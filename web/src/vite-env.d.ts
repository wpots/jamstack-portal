/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CONTENTFUL_SPACE_ID?: string;
  readonly VITE_CONTENTFUL_ACCESS_TOKEN?: string;
  readonly VITE_VOTING_ENABLED?: string;
  readonly VITE_VOTING_OPEN_AT?: string;
  readonly VITE_VOTING_CLOSE_AT?: string;
  readonly VITE_FEEDBACK_ENABLED?: string;
  readonly VITE_FEEDBACK_OPEN_AT?: string;
  readonly VITE_FEEDBACK_CLOSE_AT?: string;
  readonly VUE_APP_CONTENTFUL_SPACE_ID?: string;
  readonly VUE_APP_CONTENTFUL_ACCESS_TOKEN?: string;
  readonly VUE_APP_VOTING_ENABLED?: string;
  readonly VUE_APP_VOTING_OPEN_AT?: string;
  readonly VUE_APP_VOTING_CLOSE_AT?: string;
  readonly VUE_APP_FEEDBACK_ENABLED?: string;
  readonly VUE_APP_FEEDBACK_OPEN_AT?: string;
  readonly VUE_APP_FEEDBACK_CLOSE_AT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
