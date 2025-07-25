/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // add more env variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module 'vite-plugin-obfuscator';
declare module 'vite-plugin-javascript-obfuscator';