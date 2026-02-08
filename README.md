# jamstack-portal

Content-driven event/venue portal that renders a Vue SPA backed by
Contentful. It serves marketing pages, embeds external ticket forms, and
includes a Netlify contact form with email forwarding via Resend. The
concert feedback flow stores ratings and messages in Firebase Realtime
Database.

## Stack

- Frontend: Vue (single-page app) with single-file components (`.vue`)
- Content: Contentful GraphQL via Apollo Client
- Forms: Netlify Forms + reCAPTCHA
- Feedback: Firebase Realtime Database (ratings + messages)
- Email: Resend in a Netlify Function
- Styling: Sass/SCSS stylesheets
- Backend: Netlify Functions (Node.js, serverless)
- Hosting/CI: Netlify (`netlify.toml` config)
