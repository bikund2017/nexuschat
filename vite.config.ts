/// <reference types="vitest" />
import path from 'path'
import { fileURLToPath } from 'url'

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import macrosPlugin from 'vite-plugin-babel-macros'
import { VitePWA } from 'vite-plugin-pwa'
import basicSsl from '@vitejs/plugin-basic-ssl'

import { manifest } from './manifest'
import { RouterType } from './src/models/router'

// -----------------------------
// Constants
// -----------------------------
const SRC_DIRS = [
  'components',
  'hooks',
  'config',
  'contexts',
  'lib',
  'models',
  'pages',
  'providers',
  'services',
  'img',
  'utils',
  'test-utils',
]

const ONE_YEAR = 60 * 60 * 24 * 365

// -----------------------------
// Helpers
// -----------------------------
const createAliases = () =>
  Object.fromEntries(
    SRC_DIRS.map(dir => [dir, path.resolve(__dirname, `./src/${dir}`)])
  )

const fontCacheRule = (urlPattern: RegExp, cacheName: string) => ({
  urlPattern,
  handler: 'CacheFirst' as const,
  options: {
    cacheName,
    expiration: {
      maxEntries: 10,
      maxAgeSeconds: ONE_YEAR,
    },
    cacheableResponse: {
      statuses: [0, 200],
    },
  },
})

// -----------------------------
// Config
// -----------------------------
export default defineConfig(() => {
  const isE2E = process.env.IS_E2E_TEST

  return {
    server: {
      https: true,
      host: true,
      proxy: {
        '/api': {
          target: isE2E
            ? 'http://localhost:3003'
            : 'http://localhost:3001',
          changeOrigin: true,
          secure: false,
        },
      },
    },

    build: {
      // Known limitation in Vite (see linked issue)
      sourcemap: true,
    },

    plugins: [
      basicSsl(),

      svgr({
        include: '**/*.svg?react',
      }),

      react(),
      macrosPlugin(),

      nodePolyfills({
        globals: {
          Buffer: true,
          global: true,
          process: true,
        },
        protocolImports: true,
      }),

      VitePWA({
        registerType: 'prompt',
        injectRegister: 'auto',
        filename: 'service-worker.js',
        manifest,

        devOptions: {
          enabled: false,
        },

        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],

          runtimeCaching: [
            fontCacheRule(
              /^https:\/\/fonts\.googleapis\.com\/.*/i,
              'google-fonts-cache'
            ),
            fontCacheRule(
              /^https:\/\/fonts\.gstatic\.com\/.*/i,
              'gstatic-fonts-cache'
            ),
          ],
        },
      }),
    ],

    resolve: {
      alias: {
        webtorrent: fileURLToPath(
          new URL(
            './node_modules/webtorrent/webtorrent.min.js',
            import.meta.url
          )
        ),
        ...createAliases(),
      },
    },

    test: {
      watch: false,
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/setupTests.ts',

      exclude: ['**/e2e/**', '**/node_modules/**'],

      coverage: {
        reporter: ['text', 'html'],
        exclude: ['node_modules/', 'src/setupTests.ts'],
      },

      env: {
        VITE_ROUTER_TYPE: RouterType.BROWSER,
      },
    },
  }
})
