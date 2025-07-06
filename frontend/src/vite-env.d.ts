/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_MAPBOX_TOKEN: string;
  readonly VITE_BLOCKCHAIN_RPC_URL: string;
  readonly VITE_OPENAI_API_KEY: string;
  // Add more environment variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}