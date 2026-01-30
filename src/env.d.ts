/// <reference types="astro/client" />
/// <reference types="@astrojs/react/client" />

declare module '*.png' {
  const value: ImageMetadata;
  export default value;
}

declare module '*.jpg' {
  const value: ImageMetadata;
  export default value;
}

declare module '*.jpeg' {
  const value: ImageMetadata;
  export default value;
}

interface ImportMetaEnv {
  readonly RESEND_API_KEY: string;
  readonly BIMOORA_TEAM_EMAIL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
