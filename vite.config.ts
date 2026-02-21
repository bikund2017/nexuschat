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

const srcPaths = [
  'components',
  'hooks',
  'config',
  'contexts',
  'lib',
  'models',
  'pages',
  'services',
  'img',
  'utils',
  'test-utils',
]

const srcPathAliases = srcPaths.reduce((acc, dir) => {
  acc[dir] = path.resolve(__dirname, `./src/${dir}`)
  return acc
}, {})

const config = () => {
  return defineConfig({
    // NOTE: Uncomment this if you are hosting NexusChat on GitHub Pages
    // without a custom domain. Replace 'nexuschat' with your repo name if different.
    // base: '/nexuschat/',
    server: {
      https: true,
      host: true,
      proxy: {
        '/api': {
          target: process.env.IS_E2E_TEST
            ? 'http://localhost:3003'
            : 'http://localhost:3001',
          changeOrigin: true,
          secure: false,
        },
      },
    },
    build: {
      // NOTE: This isn't really working. At the very least, it's still useful
      // for exposing source code to users.
      // See: https://github.com/vitejs/vite/issues/15012#issuecomment-1956429165
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
        devOptions: {
          enabled: false,
        },
        injectRegister: 'auto',
        filename: 'service-worker.js',
        manifest,
        workbox: {
          // Cache app shell and static assets
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
          // Runtime caching for Google Fonts
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
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
        ...srcPathAliases,
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
  })
}

export default config
