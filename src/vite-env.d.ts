/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Absolute base URL of the Unicorn't Store backend, without a trailing slash.
   * Defaults to http://localhost:8080 when unset. See .env.example.
   */
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
