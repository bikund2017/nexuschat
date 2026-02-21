import { ManifestOptions } from 'vite-plugin-pwa'

export const manifest: Partial<ManifestOptions> = {
  short_name: 'NexusChat',
  name: 'NexusChat',
  description:
    'A secure, peer-to-peer encrypted communication platform. No servers, no tracking, no traces.',
  icons: [
    {
      src: 'favicon.ico',
      sizes: '64x64 32x32 24x24 16x16',
      type: 'image/x-icon',
    },
    {
      src: 'logo192.png',
      type: 'image/png',
      sizes: '192x192',
    },
    {
      src: 'logo512.png',
      type: 'image/png',
      sizes: '512x512',
    },
    {
      src: 'logo512.png',
      type: 'image/png',
      sizes: '512x512',
      purpose: 'maskable',
    },
  ],
  start_url: './',
  scope: './',
  display: 'standalone',
  orientation: 'any',
  theme_color: '#171717',
  background_color: '#0A0A0A',
  categories: ['social', 'communication', 'productivity'],

  shortcuts: [
    {
      name: 'New Room',
      short_name: 'New Room',
      url: './',
      description: 'Create or join a chat room',
      icons: [
        {
          src: 'logo192.png',
          sizes: '192x192',
          type: 'image/png',
        },
      ],
    },
    {
      name: 'Settings',
      short_name: 'Settings',
      url: './settings',
      description: 'App preferences',
      icons: [
        {
          src: 'logo192.png',
          sizes: '192x192',
          type: 'image/png',
        },
      ],
    },
    {
      name: 'About',
      short_name: 'About',
      url: './about',
      description: 'About NexusChat',
      icons: [
        {
          src: 'logo192.png',
          sizes: '192x192',
          type: 'image/png',
        },
      ],
    },
  ],
}
