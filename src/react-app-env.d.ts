/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_HOMEPAGE?: string
  readonly VITE_IS_E2E_TEST?: string
  readonly VITE_TRACKER_URL?: string
  readonly VITE_ROUTER_TYPE?: string
  readonly VITE_STREAMSAVER_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
