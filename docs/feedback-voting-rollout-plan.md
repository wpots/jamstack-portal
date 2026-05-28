# Feedback & songrating rollout plan

## Doel

Zorgen dat songrating en open feedback vóór zaterdag weer werken, met een minimale maar voldoende
veilige opzet voor een publieke livegang.

## Samenvatting

De huidige flow schrijft ratings en feedback direct vanuit de browser naar Firebase. Functioneel is
dat snel, maar voor een publieke livegang is het te kwetsbaar voor spam, foutieve success states en
dubbele of inconsistente stemmen.

Daarom is het voorstel:

1. writes uit de browser halen;
2. writes via Netlify Functions laten lopen;
3. voting en feedback achter feature flags zetten;
4. inputvalidatie en basis rate limiting toevoegen;
5. rollback eenvoudig maken via env toggles.

## Huidige situatie

### Songrating

- Ratings worden direct vanuit de client naar Firebase Realtime Database geschreven.
- De huidige flow zit in web/src/composables/useFeedback/index.ts.
- De UI gebruikt web/src/components/AppRatingItem.vue.
- De rating-overzichten worden client-side opnieuw opgehaald.

### Feedback

- Feedback wordt ook direct vanuit de client naar Firebase geschreven.
- Het formulier zit in web/src/components/FeedBackForm.vue.
- Het formulier toont nu een success state zonder harde garantie dat de write echt geslaagd is.
- Er staat een Netlify reCAPTCHA placeholder in het formulier, maar die beschermt deze
  Firebase-write niet.

## Belangrijkste risico’s

### 1. Publieke writes vanuit de browser

Als Firebase rules niet volledig dichtgetimmerd zijn, kan iedereen direct posten, scripts draaien of
data vervuilen.

### 2. False positive success feedback

Het feedbackformulier meldt succes ook als de write faalt of time-out.

### 3. Dubbele of vervuilde stemmen

De huidige flow is niet sterk genoeg opgezet om stemmen per bezoeker netjes te overschrijven.
Daardoor kunnen meerdere writes voor dezelfde gebruiker ontstaan.

### 4. Te weinig rem op misbruik

Zonder rate limiting, input caps en simpele anti-spammaatregelen is publieke openstelling risicovol.

## Advies voor zaterdag

Niet live zetten met de huidige client-side write flow.

Wel live zetten met een minimale hardened setup:

- browser -> Netlify Function -> Firebase;
- feature flags voor open/dicht;
- validatie op input;
- basis rate limit per IP;
- één stem per bezoeker per nummer;
- nette foutafhandeling in de UI.

## Scope voor deze rollout

### In scope

- Voting veilig publiceren
- Feedback veilig publiceren
- Toggle-based livegang
- Minimale anti-spam bescherming
- Rollback zonder codewijziging

### Niet in scope

- Moderation dashboard
- Geavanceerde abuse detection
- Authenticated voting
- Backoffice rapportage
- Grote herbouw van store/composable architectuur

## Technische aanpak

### 1. Feature flags toevoegen

Voeg env-gedreven flags toe voor publicatie en scheduling.

Voorstel:

- `VITE_VOTING_ENABLED`
- `VITE_FEEDBACK_ENABLED`
- `VITE_VOTING_OPEN_AT`
- `VITE_FEEDBACK_OPEN_AT`
- `VITE_VOTING_CLOSE_AT`
- `VITE_FEEDBACK_CLOSE_AT`

Gebruik:

- UI toont vote controls alleen als voting open is.
- UI toont feedback CTA en formulier alleen als feedback open is.
- Zaterdag kan de livegang via env/config gebeuren.

### 2. Server-side submit endpoints via Netlify Functions

Voeg twee functies toe:

- `submit-rating`
- `submit-feedback`

Taken van deze functions:

- request body valideren;
- input normaliseren;
- write naar Firebase uitvoeren;
- fouten expliciet teruggeven;
- basis rate limiting toepassen;
- alleen toegestane origins accepteren.

### 3. Voting idempotent maken

Sla stemmen niet op als losse anonieme pushes per klik.

Voorstel:

- geef iedere browser een `participantId` via cookie of local storage;
- schrijf stem naar `songRatings/{songId}/{participantId}`;
- een wijziging overschrijft bestaande stem;
- aggregatie blijft daarna eenvoudig.

Resultaat:

- minder dubbele stemmen;
- simpeler updategedrag;
- duidelijker data model.

### 4. Feedback input hardenen

Voor feedback:

- `naam` optioneel houden;
- `tiptop` verplicht houden;
- trimmen van input;
- max lengte instellen, bijvoorbeeld:
  - naam: 80 chars
  - bericht: 1000 chars;
- lege of whitespace-only berichten afwijzen;
- honeypot veld toevoegen;
- server-side foutmelding teruggeven bij invalid input.

### 5. UI-foutafhandeling corrigeren

In het feedbackformulier:

- alleen succes tonen als de submit echt geslaagd is;
- foutmelding tonen als request mislukt;
- submitknop tijdelijk blokkeren tijdens pending state.

In rating flow:

- pas success UI tonen na geslaagde response;
- duidelijke melding tonen als stemmen tijdelijk niet beschikbaar is.

### 6. Firebase toegang beperken

Doel:

- client writes uitzetten;
- alleen gecontroleerde writes via function toestaan.

Minimale richting:

- geen publieke write rules voor ruwe feedback;
- alleen publieke reads waar nodig;
- writes alleen via server-side flow.

## Concreet implementatieplan

### Fase 1 — directe bugfix en toggle setup

Doel: functionele basis herstellen en livegang bestuurbaar maken.

Taken:

- `useFeedback` opruimen;
- `update()` calls correct awaiten;
- feedbackformulier echte error handling geven;
- rating state netter bijwerken;
- feature flags toevoegen in frontend;
- UI blokkeren als voting/feedback gesloten is.

### Fase 2 — veilige write flow

Doel: geen directe browser writes meer.

Taken:

- Netlify function `submit-rating` toevoegen;
- Netlify function `submit-feedback` toevoegen;
- Firebase writes daarheen verplaatsen;
- inputvalidatie toevoegen;
- basis rate limiting per IP toevoegen;
- honeypot check toevoegen op feedback.

### Fase 3 — zaterdag livegang

Doel: gecontroleerd openen en snel kunnen terugdraaien.

Taken:

- env flags in productie zetten;
- open tijden instellen;
- smoke test uitvoeren;
- live monitoren;
- rollback pad klaarzetten.

## Voorstel tijdslijn

### Vandaag

- bugfixes in feedback en voting flow;
- feature flags invoeren;
- basis UI gating toevoegen.

### Morgen

- Netlify Functions bouwen;
- validatie en rate limiting toevoegen;
- Firebase write pad afsluiten;
- end-to-end testen.

### Zaterdag

- flags aan;
- smoke test op productie;
- monitoren tijdens openstelling;
- indien nodig direct flags uit.

## Rollback plan

Als er iets misgaat:

1. `VITE_VOTING_ENABLED=false`
2. `VITE_FEEDBACK_ENABLED=false`
3. eventueel CTA en rating UI verborgen laten
4. functions online laten voor analyse, maar geen publieksflow meer tonen

Rollback moet zonder codewijziging kunnen, alleen via environment config.

## Reviewpunten

Graag review op deze keuzes:

1. Is Netlify Function + Firebase voor zaterdag snel genoeg als minimale veilige route?
2. Willen we ratings live zichtbaar houden voor iedereen, of alleen submit toelaten zonder publieke
   aggregate read?
3. Willen we feedback direct opslaan, of liever eerst in een moderatiepad?
4. Is een `participantId` in local storage voldoende voor deze context?
5. Willen we open/dicht alleen met booleans sturen, of ook echt met datumvensters?

## Aanbevolen beslissing

Ga voor de minimale hardened variant:

- feature flags;
- writes via Netlify Functions;
- inputvalidatie;
- rate limiting;
- nette foutafhandeling;
- eenvoudige rollback.

Dat is klein genoeg om nu uit te voeren en veilig genoeg om zaterdag publiek open te zetten.

## Firebase Realtime Database rules voorstel

De nieuwe submit-flow loopt via Netlify Functions met Firebase Admin. Daardoor mogen client writes
nu dicht.

Aanbevolen minimale rules:

```json
{
  "rules": {
    ".read": false,
    ".write": false,
    "songRatings": {
      ".read": true,
      ".write": false
    },
    "feedback": {
      ".read": false,
      ".write": false
    }
  }
}
```

### Effect van deze rules

- ratings blijven publiek leesbaar voor live gemiddelden in de frontend;
- ratings zijn niet meer direct vanuit de browser schrijfbaar;
- feedback is niet publiek leesbaar;
- feedback is niet direct vanuit de browser schrijfbaar;
- Netlify Functions blijven wel werken, omdat Firebase Admin rules bypassed.

### Tijdelijke fallback rule als publieke feedbacklijst nog nodig is

Alleen gebruiken als de pagina met publieke feedbackinzendingen zaterdag echt nodig is.

```json
{
  "rules": {
    ".read": false,
    ".write": false,
    "songRatings": {
      ".read": true,
      ".write": false
    },
    "feedback": {
      ".read": true,
      ".write": false
    }
  }
}
```

Nadeel:

- alle opgeslagen feedback wordt dan publiek uitleesbaar.

Daarom blijft de voorkeur:

- `feedback.read = false`
- alleen een beheerde admin-view of function gebruiken voor inzendingen.

## Smoke test checklist

Deze checklist is bedoeld voor direct na deploy op Netlify.

### 1. Config check

- Netlify deploy is afgerond zonder function errors.
- De env vars voor voting en feedback staan goed.
- Firebase Admin env vars staan op productie.
- Eventuele `FEEDBACK_ALLOWED_ORIGINS` bevat het productie-domein.

### 2. Voting gesloten scenario

- Zet `VITE_VOTING_ENABLED=false`.
- Open de programmapagina.
- Controleer dat song cards wel zichtbaar zijn.
- Controleer dat de rating dialoog niet opent.
- Controleer dat bestaande gemiddelden zichtbaar blijven.

### 3. Feedback gesloten scenario

- Zet `VITE_FEEDBACK_ENABLED=false`.
- Open de programmapagina.
- Controleer dat de CTA-knop niet zichtbaar is.
- Controleer dat de melding “Feedback opent binnenkort.” zichtbaar is.

### 4. Voting open scenario

- Zet `VITE_VOTING_ENABLED=true` en publiceer opnieuw.
- Open een programmapagina.
- Geef een rating op een nummer.
- Controleer dat de submit slaagt.
- Herlaad de pagina.
- Controleer dat de eigen stemstatus behouden blijft.
- Geef een andere rating op hetzelfde nummer.
- Controleer dat de wijziging slaagt en geen dubbele flow zichtbaar wordt.

### 5. Feedback open scenario

- Zet `VITE_FEEDBACK_ENABLED=true` en publiceer opnieuw.
- Open de feedback CTA.
- Verstuur een geldig bericht.
- Controleer dat de success melding verschijnt.
- Verstuur een leeg bericht.
- Controleer dat validatie blokkeert.
- Vul het honeypot-veld niet in tijdens normale test.

### 6. Function health

- Controleer in Netlify function logs dat `submit-rating` requests binnenkomen.
- Controleer in Netlify function logs dat `submit-feedback` requests binnenkomen.
- Controleer dat er geen 500 responses zijn.
- Controleer dat rate limiting niet onbedoeld normale traffic blokkeert.

### 7. Database check

- Controleer in Realtime Database dat ratings nu per `songId/{participantId}` landen.
- Controleer dat feedbackinzendingen in `feedback/` landen.
- Controleer dat directe client writes niet meer mogelijk zijn na rules update.

### 8. Rollback check

- Zet `VITE_VOTING_ENABLED=false`.
- Zet `VITE_FEEDBACK_ENABLED=false`.
- Trigger een nieuwe deploy.
- Controleer dat voting en feedback direct uit de publieksflow verdwijnen.

## Go-live notities

- Doe eerst deploy met functions + env vars.
- Zet daarna pas Firebase rules dicht.
- Test daarna direct de publieksflow.
- Als er iets breekt, eerst flags uitzetten, daarna pas verder debuggen.
