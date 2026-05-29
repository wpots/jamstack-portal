# web

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Run your unit tests

```
npm run test:unit
```

### Lints and fixes files

```
npm run lint
```

### Run Netlify Functions + app locally

```
netlify dev
```

### Connect to Services

Rename `.configenv` to `.env` and fill in the required values.

Minimum voor de feedback/voting rollout:

```dotenv
CONTENTFUL_SPACE_ID=
CONTENTFUL_ACCESS_TOKEN=
RESEND_API_KEY=
RECAPTCHA_KEY=

VITE_VOTING_ENABLED=false
VITE_FEEDBACK_ENABLED=false
VITE_VOTING_OPEN_AT=
VITE_VOTING_CLOSE_AT=
VITE_FEEDBACK_OPEN_AT=
VITE_FEEDBACK_CLOSE_AT=

FEEDBACK_ALLOWED_ORIGINS=http://localhost:8888,https://jouwdomein.nl

FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
FIREBASE_DATABASE_URL=
```

## Firebase Realtime Database rules

De hardened rollout verwacht gesloten client writes en publieke read alleen voor `songRatings`.

Gebruik [firebase.database.rules.json](firebase.database.rules.json) als bronbestand voor de rules
deploy.

Beoogd effect:

- `songRatings`: publiek leesbaar, niet publiek schrijfbaar;
- `feedback`: niet publiek leesbaar, niet publiek schrijfbaar;
- writes lopen alleen via Netlify Functions met Firebase Admin.

## Go-live volgorde

1. deploy de site en functions;
2. zet de productie-env vars;
3. deploy de Firebase Database rules;
4. draai de smoke test uit
   [docs/feedback-voting-rollout-plan.md](../docs/feedback-voting-rollout-plan.md);
5. zet pas daarna `VITE_VOTING_ENABLED` en `VITE_FEEDBACK_ENABLED` open.
