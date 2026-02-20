import { ManifestOptions } from 'vite-plugin-pwa'

export const manifest: Partial<ManifestOptions> = {
  short_name: 'NexusChat',
  name: 'NexusChat',
  description:
    'NexusChat — A secure, peer-to-peer encrypted communication platform with real-time collaboration. No servers, no tracking, no traces.',
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
  ],
  start_url: './',
  display: 'fullscreen',
  theme_color: '#64748B',
  background_color: '#0F172A',
  screenshots: [
    {
      src: 'screenshots/home-desktop.png',
      sizes: '2160x1620',
      type: 'image/png',
    },
    {
      src: 'screenshots/public-room-desktop.png',
      sizes: '2160x1620',
      type: 'image/png',
    },
    {
      src: 'screenshots/public-room-desktop-with-video.png',
      sizes: '2160x1620',
      type: 'image/png',
    },
    {
      src: 'screenshots/home-mobile-dark.png',
      sizes: '750x1334',
      type: 'image/png',
      form_factor: 'narrow',
    },
    {
      src: 'screenshots/home-mobile-light.png',
      sizes: '750x1334',
      type: 'image/png',
      form_factor: 'narrow',
    },
    {
      src: 'screenshots/public-room-mobile.png',
      sizes: '750x1334',
      type: 'image/png',
      form_factor: 'narrow',
    },
  ],

  shortcuts: [
    {
      name: 'About',
      url: './about',
      icons: [
        {
          src: 'logo512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any',
        },
      ],
    },
    {
      name: 'Disclaimer',
      url: './disclaimer',
      icons: [
        {
          src: 'logo512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any',
        },
      ],
    },
  ],
}
