# Programma pagina plan

## Doel

- [ ] Programma-pagina los trekken van het huidige 2-set model
- [ ] Content flexibel maken voor toekomstige concerten
- [ ] Bestaande contentblokken uit CMS hergebruiken waar mogelijk
- [ ] Tijdelijke support houden voor `double-impact`

## Besloten richting

- [ ] `ProgramPage` toevoegen in CMS
- [ ] `concertId` koppelen aan `page.siteSlug`
- [ ] `programItemsCollection` gebruiken als ordered repeater / references
- [ ] Bestaande `TeaserBlock` kunnen gebruiken binnen programma-items
- [ ] Bestaand rich text content type kunnen gebruiken binnen programma-items
- [ ] Nieuw `ProgramSetBlock` toevoegen voor muzikale sets
- [ ] Nieuw `ProgramSongItem` toevoegen voor nummers binnen een set

## Waarom deze aanpak

- [ ] Niet meer vastzitten aan `setlistCollection` + `setlist2Collection`
- [ ] Meer dan 2 sets ondersteunen
- [ ] Gezamenlijke nummers ondersteunen
- [ ] Meerdere tekstblokken tussen sets ondersteunen
- [ ] Geen hacks met meerdere timetable blocks op dezelfde `concertId`

## CMS model

### ProgramPage

- [ ] Content type `ProgramPage` aanmaken
- [ ] Veld `concertId` toevoegen
- [ ] Veld `pageTitle` toevoegen
- [ ] Veld `programItemsCollection` toevoegen
- [ ] `programItemsCollection` mixed references laten accepteren

### ProgramSetBlock

- [ ] Content type `ProgramSetBlock` aanmaken
- [ ] Veld `title` toevoegen
- [ ] Veld `songsCollection` toevoegen
- [ ] `songsCollection` ordered references laten gebruiken
- [ ] Optioneel: `style` of `variant` toevoegen als dat later nodig is

### ProgramSongItem

- [ ] Content type `ProgramSongItem` aanmaken
- [ ] Veld `title` toevoegen
- [ ] Veld `artist` optioneel toevoegen
- [ ] Veld `linkedScore` optioneel toevoegen
- [ ] `linkedScore` laten verwijzen naar bestaand repertoire-item

## Toegestane blokken in programItemsCollection

- [ ] `TeaserBlock`
- [ ] bestaand rich text type
- [ ] `ProgramSetBlock`

## Niet doen

- [ ] Geen tweede `pageBlockTimeTable` maken met dezelfde `concertId`
- [ ] Geen extra logica blijven bouwen op `firstSetlist` / `lastSetlist`
- [ ] Geen fake songs gebruiken voor overgang / praatje / pauze
- [ ] Geen volledig nieuw tekstbloktype bouwen als rich text al voldoet

## Frontend doelmodel

- [ ] Eén generiek programma-model gebruiken
- [ ] `pageTitle` behouden
- [ ] `programItems` als enige renderlijst gebruiken
- [ ] Oude timetable-data naar hetzelfde model kunnen mappen
- [ ] Nieuwe CMS-data naar hetzelfde model kunnen mappen
- [ ] Lokale overrides tijdelijk op hetzelfde model laten aansluiten

## Frontend implementatie

### Queries

- [ ] Nieuwe query toevoegen voor `ProgramPage`
- [ ] Oude timetable query voorlopig als fallback behouden

### Mapping

- [ ] Mapper uitbreiden in `web/src/composables/useContent/content.mapper.ts`
- [ ] Oude timetable response mappen naar generieke `programItems`
- [ ] Nieuwe `ProgramPage` response mappen naar dezelfde `programItems`
- [ ] Eén outputshape afdwingen voor alle bronnen

### Content flow

- [ ] `web/src/composables/useContent/index.js` aanpassen
- [ ] Prioriteit bepalen:
  - [ ] lokale override
  - [ ] nieuw CMS model
  - [ ] oud timetable model

### Rendering

- [ ] `web/src/components/Partials/TimeTableBlock.vue` refactoren
- [ ] Niet meer hardcoden op intro / set 1 / intermezzo / set 2
- [ ] Renderen op basis van item type
- [ ] Rich text items tonen via bestaande rich text renderer
- [ ] Teaser items tonen via bestaande teaser renderer
- [ ] Set items tonen via nieuwe set component

### Nieuwe componenten

- [ ] Component voor `ProgramSetBlock` maken
- [ ] Component voor eenvoudige songweergave maken
- [ ] Alleen verrijkte songweergave gebruiken als `linkedScore` bestaat

## Double Impact overgangsplan

- [ ] `double-impact` tijdelijk lokaal overridebaar houden
- [ ] Bestaande JSON override alleen gebruiken als tijdelijke escape hatch
- [ ] Later `double-impact` migreren naar nieuw CMS model

## Content-afspraken

- [ ] Tekst tussen sets als rich text invoeren
- [ ] Visuele tussenblokken alleen als teaser gebruiken wanneer echt nodig
- [ ] Muzikale blokken altijd als `ProgramSetBlock` invoeren
- [ ] Externe of gezamenlijke nummers als `ProgramSongItem` invoeren
- [ ] Eigen repertoire-items optioneel koppelen via `linkedScore`

## Opruimen na migratie

- [ ] Oude timetable query uitfaseren
- [ ] Oude timetable mapper uitfaseren
- [ ] `firstSetlist` / `lastSetlist` uit de frontend verwijderen
- [ ] JSON override alleen behouden als noodoplossing

## Open keuzes

- [ ] Willen we `TeaserBlock` echt in programma-items toestaan, of alleen rich text + setblock?
- [ ] Willen we ratings alleen tonen voor songs met `linkedScore`?
- [ ] Willen we artwork tonen voor gekoppelde repertoire-items?
- [ ] Willen we `ProgramSongItem` ook een `ensemble` veld geven?
