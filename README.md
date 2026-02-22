# NexusChat 💬

> **Final Year BCA Project** — A secure, serverless, peer-to-peer encrypted chat platform built with modern web technologies.

🔗 **Live Demo:** [https://nexuschat-inky.vercel.app](https://nexuschat-inky.vercel.app)

---

## 📌 Purpose & Motivation

In today's digital landscape, most messaging platforms route conversations through centralized servers — creating single points of failure, surveillance, and data breaches. NexusChat was built as a final year college project to address this problem by proving that **real-time, encrypted communication is possible entirely within the browser**, with zero server-side message storage.

**Core objectives:**
- Demonstrate practical use of WebRTC for direct browser-to-browser communication
- Implement client-side RSA-OAEP encryption using the native Web Crypto API
- Build a production-grade PWA with React, TypeScript, and Material UI
- Explore decentralized peer discovery via BitTorrent tracker signaling

---

## ✨ Features

| Feature | Description |
| --- | --- |
| 🔒 **End-to-End Encryption** | RSA-OAEP (2048-bit) via Web Crypto API; private keys never leave the browser |
| 🌐 **Peer-to-Peer Messaging** | Direct WebRTC data channels — no central message server |
| 📹 **Video & Audio Calls** | Real-time media sharing with screen sharing support |
| 📁 **P2P File Transfer** | Files sent directly over WebRTC using WebTorrent-based `secure-file-transfer` |
| ✅ **Delivery Receipts** | Sending → Sent → Delivered status indicators for every message |
| 💬 **Markdown & Syntax Highlighting** | Rich text rendering with GFM support via `react-markdown` |
| 🔐 **Private Rooms** | Password-protected rooms with SHA-256 hashed room credentials |
| 👥 **Community Rooms** | Pre-configured public rooms (general, study-group, tech-help, etc.) |
| ⌨️ **Live Typing Indicators** | See when peers are typing in real time |
| 🔔 **Browser Notifications** | Desktop notifications and configurable sound alerts on new messages |
| 🌙 **Dark / Light Theme** | Automatic system preference detection with manual override |
| 📱 **PWA & Mobile Optimized** | Installable on desktop/mobile; responsive touch-friendly UI |
| 🖼️ **Embeddable Rooms** | Rooms can be embedded in external sites via iframe with SDK config |
| 🛡️ **Peer Verification** | Cryptographic token exchange to verify peer identity |

---

## 🛠️ Tech Stack

| Technology | Purpose |
| --- | --- |
| **React 18** | UI framework with hooks and context-based state |
| **TypeScript** | Static typing across the entire codebase |
| **Material UI 5** | Accessible, theme-aware component library |
| **Vite** | Fast HMR dev server, build tooling, and PWA plugin |
| **Trystero** | WebRTC peer connections over BitTorrent tracker signaling |
| **Web Crypto API** | Native browser RSA-OAEP key generation, encryption, and decryption |
| **localforage / IndexedDB** | Client-side persistence for user settings and crypto keys |
| **TanStack React Query** | Async state management for TURN config fetching |
| **Vitest + Playwright** | Unit testing and end-to-end testing |
| **Vercel Functions** | Single serverless endpoint for optional TURN server credentials |

---

## 🏗️ Architecture

```text
┌──────────────┐       WebRTC (P2P)       ┌──────────────┐
│    Peer A    │ ◄═══════════════════════► │    Peer B    │
│   (Browser)  │   Encrypted Data Channel  │   (Browser)  │
└──────┬───────┘                           └───────┬──────┘
       │                                           │
       └───── Trystero (BitTorrent Trackers) ──────┘
                  (Signaling / Discovery Only)
```

**Boot sequence:** `index.tsx` → `Init` (async RSA key pair generation) → `Bootstrap` (loads persisted settings from IndexedDB, sets up context providers and routing).

**Context hierarchy:** `QueryClientProvider` → `Router` → `StorageContext` → `SettingsContext` → `ShellContext` → `RoomContext` → page components.

**Encryption flow:** Keys generated at boot → stored as `CryptoKey` objects → `SerializationService` converts to/from base64 for IndexedDB persistence → `EncryptionService` handles encrypt/decrypt at message send/receive time.

**Key design decisions:**
- **No backend for messages** — all communication is peer-to-peer; the only server-side code is a Vercel Function returning optional TURN credentials
- **Ephemeral conversations** — closing the tab erases all chat data
- **Typed peer actions** — enum-based `PeerAction` system with 12-char name limit (Trystero constraint), wired into components via `usePeerAction` hook
- **Barrel exports** — every module uses `index.ts` re-exports for clean imports
- **Path aliases** — `tsconfig.json` baseUrl + Vite aliases enable bare imports like `import { encryption } from 'services/Encryption'`

---

## 💬 How It Works

1. **Room Creation** — User creates a public or private (password-protected) room from the home page.
2. **Key Generation** — On app boot, a 2048-bit RSA-OAEP key pair is generated via `window.crypto.subtle.generateKey`.
3. **Peer Discovery** — Trystero uses BitTorrent trackers **only** for signaling; no message data passes through them.
4. **WebRTC Connection** — Peers establish a direct data channel; optional TURN relay for restrictive networks.
5. **Key Exchange** — Public keys are shared over the data channel; each peer encrypts messages with the recipient's public key.
6. **Encrypted Messaging** — All text, media references, and control signals are encrypted end-to-end before transmission.
7. **Verification** — Peers exchange encrypted verification tokens to confirm identities cryptographically.

---

## 📁 Project Structure

```text
nexuschat
|
├── index.html                        # Vite HTML entry point
├── manifest.ts                       # PWA manifest configuration
├── vercel.json                       # Vercel deployment  config
│
│
├── api/                              # Vercel serverless functions
│   ├── get-config.ts                 # TURN server credentials endpoint
│   └── get-config.test.ts           # API endpoint tests
│
├── public/                           # Static assets
│   ├── favicon.ico                   # Browser tab icon
│   ├── logo192.png                   # PWA icon (192×192)
│   ├── logo512.png                   # PWA icon (512×512)
│   ├── robots.txt                    # Search engine crawl rules
│   ├── logo/
│   │   ├── favicon.svg              # SVG favicon
│   │   ├── logo.svg                 # App logo SVG
│   │   ├── logo192.png              # Logo (192px)
│   │   └── logo512.png              # Logo (512px)
│   └── sounds/
│       ├── beep.mp3                  # Notification sound
│       ├── chime.mp3                 # Notification sound
│       └── new-message.aac          # Notification sound
│
├── scripts/
│   └── generate-rtc-config.cjs      # RTC config generation helper
│
└── src/                              # Application source code
    │
    ├── index.tsx                     # App entry point
    ├── index.css                     # Global styles
    ├── Init.tsx                      # RSA key pair generation & boot
    ├── Bootstrap.tsx                 # Context providers, routing, settings loader
    ├── Bootstrap.test.tsx            # Bootstrap component tests
    ├── polyfills.ts                  # Browser polyfills
    ├── react-app-env.d.ts           # TypeScript environment declarations
    ├── setupTests.ts                 # Vitest global mocks setup
    │
    ├── img/
    │   └── icon.svg                  # App icon SVG
    │
    ├── components/                   # Reusable UI components
    │   │
    │   ├── AudioVolume/
    │   │   ├── AudioVolume.tsx       # Audio volume indicator
    │   │   └── index.ts
    │   │
    │   ├── ChatTranscript/
    │   │   ├── ChatTranscript.tsx    # Message list rendering
    │   │   └── index.ts
    │   │
    │   ├── ConfirmDialog/
    │   │   ├── ConfirmDialog.tsx     # Reusable confirmation modal
    │   │   └── index.ts
    │   │
    │   ├── CopyableBlock/
    │   │   ├── CopyableBlock.tsx     # Click-to-copy text block
    │   │   └── index.ts
    │   │
    │   ├── Elements/
    │   │   └── index.tsx             # Shared styled elements (Form, Main)
    │   │
    │   ├── EnhancedConnectivityControl/
    │   │   ├── EnhancedConnectivityControl.tsx  # TURN relay toggle
    │   │   └── index.ts
    │   │
    │   ├── ErrorBoundary/
    │   │   ├── ErrorBoundary.tsx     # React error boundary wrapper
    │   │   └── index.ts
    │   │
    │   ├── Loading/
    │   │   ├── Loading.tsx           # Loading spinner / full-page loader
    │   │   └── index.ts
    │   │
    │   ├── Message/
    │   │   ├── Message.tsx           # Chat bubble with delivery status
    │   │   ├── Message.test.tsx      # Message component tests
    │   │   ├── InlineMedia.tsx       # Inline media rendering (images, videos)
    │   │   └── index.ts
    │   │
    │   ├── MessageForm/
    │   │   ├── MessageForm.tsx       # Message input bar with send controls
    │   │   └── index.ts
    │   │
    │   ├── PasswordPrompt/
    │   │   ├── PasswordPrompt.tsx    # Private room password entry dialog
    │   │   └── index.tsx
    │   │
    │   ├── PeerNameDisplay/
    │   │   ├── PeerNameDisplay.tsx   # Peer name display component
    │   │   ├── getPeerName.ts        # Peer name resolution utility
    │   │   ├── usePeerNameDisplay.ts # Hook for peer name logic
    │   │   └── index.ts
    │   │
    │   ├── PublicKey/
    │   │   ├── PublicKey.tsx         # Public key display component
    │   │   └── index.ts
    │   │
    │   ├── Room/
    │   │   ├── Room.tsx              # Main room component
    │   │   ├── Room.test.tsx         # Room component tests
    │   │   ├── useRoom.ts           # Core room logic hook
    │   │   ├── useRoomAudio.ts      # Audio call management hook
    │   │   ├── useRoomVideo.ts      # Video call management hook
    │   │   ├── useRoomScreenShare.ts # Screen sharing hook
    │   │   ├── useRoomFileShare.ts  # File transfer hook
    │   │   ├── usePeerVerification.ts # Peer identity verification hook
    │   │   ├── MediaButton.tsx       # Media control toggle button
    │   │   ├── PeerVideo.tsx         # Peer video stream renderer
    │   │   ├── RoomAudioControls.tsx # Audio call controls
    │   │   ├── RoomVideoControls.tsx # Video call controls
    │   │   ├── RoomScreenShareControls.tsx # Screen share controls
    │   │   ├── RoomFileUploadControls.tsx  # File upload controls
    │   │   ├── RoomShowMessagesControls.tsx # Chat toggle controls
    │   │   ├── RoomHideRoomControls.tsx    # Room visibility controls
    │   │   ├── RoomVideoDisplay.tsx  # Video grid layout
    │   │   ├── TypingStatusBar.tsx   # Typing indicator bar
    │   │   └── index.ts
    │   │
    │   ├── Shell/
    │   │   ├── Shell.tsx             # App shell (layout, drawer, context)
    │   │   ├── Shell.test.tsx        # Shell component tests
    │   │   ├── ShellAppBar.tsx       # Top navigation bar
    │   │   ├── Drawer.tsx            # Side navigation drawer
    │   │   ├── PeerList.tsx          # Connected peers list
    │   │   ├── PeerListHeader.tsx    # Peer list header
    │   │   ├── PeerListItem.tsx      # Individual peer list entry
    │   │   ├── PeerDownloadFileButton.tsx # File download trigger
    │   │   ├── NotificationArea.tsx  # In-app alert/notification display
    │   │   ├── QRCodeDialog.tsx      # QR code for room sharing
    │   │   ├── RoomShareDialog.tsx   # Room link sharing dialog
    │   │   ├── ConnectionTestResults.tsx # Network connection test display
    │   │   ├── EnvironmentUnsupportedDialog.tsx # Browser compatibility warning
    │   │   ├── ServerConnectionFailureDialog.tsx # Connection failure dialog
    │   │   ├── UpgradeDialog.tsx     # App update prompt
    │   │   ├── RouteContent.tsx      # Route-level content wrapper
    │   │   ├── useConnectionTest.ts  # Connection test hook
    │   │   ├── useShellTheme.ts      # Theme management hook
    │   │   ├── constants.ts          # Shell constants
    │   │   └── index.ts
    │   │
    │   ├── SoundSelector/
    │   │   ├── SoundSelector.tsx     # Notification sound picker
    │   │   └── index.ts
    │   │
    │   └── UserInfo/
    │       ├── UserInfo.tsx          # User profile info display
    │       └── index.ts
    │
    ├── config/                       # App configuration
    │   ├── communityRooms.ts         # Pre-configured public room names
    │   ├── enhancedConnectivity.ts   # TURN relay availability config
    │   ├── enhancedConnectivity.test.ts # Enhanced connectivity tests
    │   ├── iframeFeatureAllowList.ts # Iframe embed permission policy
    │   ├── messaging.ts              # Messaging constants
    │   ├── router.ts                 # Router type selection (Browser / Hash)
    │   ├── routes.ts                 # Route path definitions
    │   ├── soundNames.ts             # Available notification sound names
    │   ├── streamSaverUrl.ts         # StreamSaver mitm.html URL config
    │   └── trackerUrls.ts            # WebTorrent tracker URLs
    │
    ├── contexts/                     # React context providers
    │   ├── RoomContext.ts            # Per-room state (media, files, messages)
    │   ├── SettingsContext.ts        # User preferences context
    │   ├── ShellContext.ts           # Global app state (peers, alerts, room ID)
    │   └── StorageContext.ts         # localforage instance access
    │
    ├── hooks/                        # Custom React hooks
    │   ├── types.ts                  # Shared hook type definitions
    │   ├── usePeerAction.ts          # Typed Trystero action hook
    │   ├── useThrottledRoomMount.ts  # Throttled room mount hook
    │   ├── useThrottledRoomMount.test.tsx # Throttled mount tests
    │   ├── useTurnConfig.ts          # TURN server config fetcher (React Query)
    │   └── useTurnConfig.test.tsx    # TURN config hook tests
    │
    ├── lib/                          # Core utility libraries
    │   ├── sleep.ts                  # Async delay utility
    │   ├── type-guards.ts            # Runtime type guard functions
    │   │
    │   ├── Audio/
    │   │   ├── Audio.ts              # Audio playback manager
    │   │   └── index.ts
    │   │
    │   ├── ConnectionTest/
    │   │   ├── ConnectionTest.ts     # WebRTC connection tester
    │   │   └── index.ts
    │   │
    │   ├── PeerRoom/
    │   │   ├── PeerRoom.ts           # Trystero room wrapper (actions, streams)
    │   │   └── index.ts
    │   │
    │   ├── RoomNameGenerator/
    │   │   ├── RoomNameGenerator.ts  # Random room name generator
    │   │   └── index.ts
    │   │
    │   └── Time/
    │       ├── Time.ts               # Time formatting utilities
    │       └── index.ts
    │
    ├── models/                       # TypeScript types & enums
    │   ├── chat.ts                   # Message, Peer, media state types
    │   ├── network.ts                # PeerAction enum (WebRTC actions)
    │   ├── router.ts                 # Router type enum
    │   ├── sdk.ts                    # Iframe SDK / PostMessage types
    │   ├── settings.ts               # UserSettings interface, ColorMode enum
    │   ├── shell.ts                  # Shell state types, query param keys
    │   └── storage.ts                # IndexedDB storage key constants
    │
    ├── pages/                        # Page-level components
    │   │
    │   ├── About/
    │   │   ├── About.tsx             # About page
    │   │   └── index.ts
    │   │
    │   ├── Disclaimer/
    │   │   ├── Disclaimer.tsx        # Legal disclaimer page
    │   │   └── index.ts
    │   │
    │   ├── Home/
    │   │   ├── Home.tsx              # Landing page (room creation)
    │   │   ├── useHome.tsx           # Home page logic hook
    │   │   ├── useHome.test.tsx      # Home hook tests
    │   │   ├── CommunityRoomSelector.tsx # Community room dropdown
    │   │   ├── EmbedCodeDialog.tsx   # Iframe embed code generator
    │   │   └── index.ts
    │   │
    │   ├── PrivateRoom/
    │   │   ├── PrivateRoom.tsx       # Password-protected room page
    │   │   └── index.ts
    │   │
    │   ├── PublicRoom/
    │   │   ├── PublicRoom.tsx        # Open public room page
    │   │   └── index.ts
    │   │
    │   └── Settings/
    │       ├── Settings.tsx          # User preferences page
    │       └── index.ts
    │
    ├── services/                     # Business logic singletons
    │   │
    │   ├── Encryption/
    │   │   ├── Encryption.ts         # Web Crypto API wrapper (RSA-OAEP)
    │   │   └── index.ts
    │   │
    │   ├── FileTransfer/
    │   │   ├── FileTransfer.ts       # P2P file sharing via WebTorrent
    │   │   └── index.ts
    │   │
    │   ├── Notification/
    │   │   ├── Notification.tsx      # Browser notification service
    │   │   └── index.ts
    │   │
    │   ├── Serialization/
    │   │   ├── Serialization.ts      # CryptoKey ↔ base64 string conversion
    │   │   └── index.ts
    │   │
    │   └── Settings/
    │       ├── Settings.ts           # User settings persistence service
    │       └── index.ts
    │
    └── test-utils/                   # Test helpers
        │
        ├── mocks/
        │   ├── mockEncryptionService.ts  # Mocked EncryptionService
        │   └── mockSerializationService.ts # Mocked SerializationService
        │
        └── stubs/
            ├── userSettings.ts       # UserSettings stub factory
            └── settingsContext.ts     # SettingsContext stub factory
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm 9+

### Installation

```bash
git clone https://github.com/bikund2017/nexuschat.git
cd nexuschat
npm install
```

### Development

```bash
npm start             # HTTPS dev server on port 3000
npm run dev           # Full local stack (app + BitTorrent tracker + StreamSaver + Vercel API)
```

### Build

```bash
npm run build         # Production build → dist/
```

---

## 🧪 Testing

```bash
npm test              # Vitest unit tests (jsdom, globals enabled)
npm run test:e2e      # Playwright end-to-end tests
npm run check:types   # TypeScript type checking (no emit)
npm run lint          # ESLint with zero-warnings policy
```

Testing setup: Vitest with `@testing-library/react`, global mocks for `trystero` and `secure-file-transfer` in `setupTests.ts`, and dedicated test stubs/mocks in `src/test-utils/`.

---

## ⚙️ Environment Variables

| Variable | Purpose |
| --- | --- |
| `VITE_TRACKER_URL` | Override WebTorrent tracker URL (local dev: `ws://localhost:8000`) |
| `VITE_STREAMSAVER_URL` | Override StreamSaver mitm.html URL |
| `VITE_ROUTER_TYPE` | `browser` (default) or `hash` |
| `VITE_RTC_CONFIG_ENDPOINT` | Custom TURN config API path (default: `/api/get-config`) |
| `VITE_API_BASE_URL` | Override API base URL in development |
| `RTC_CONFIG` | Base64-encoded TURN server config (server-side, Vercel Functions) |

---

## ⚠️ Challenges Faced During Development

| Challenge | How It Was Addressed |
| --- | --- |
| **WebRTC NAT traversal** | Peers behind symmetric NATs cannot connect directly; added optional TURN relay support via Vercel Function endpoint |
| **Web Crypto API limitations** | `CryptoKey` objects are non-serializable; built a `SerializationService` to convert keys to/from base64 strings for IndexedDB storage |
| **Trystero action name limit** | Trystero restricts action names to 12 characters; used numeric enums (`PeerAction`) instead of descriptive strings |
| **Secure context requirement** | WebRTC and Web Crypto require HTTPS; configured Vite with `basicSsl` plugin for local dev and added an `EnvironmentUnsupportedDialog` for unsupported browsers |
| **Testing without real peers** | WebRTC and crypto APIs are unavailable in jsdom; created comprehensive mocks (`mockEncryptionService`, `mockSerializationService`) and stubs |
| **Cross-browser incognito detection** | Some browsers restrict IndexedDB in private mode; integrated `detectincognitojs` for graceful handling |
| **File transfer reliability** | Large files over WebRTC data channels are unreliable; used `secure-file-transfer` (WebTorrent-based) for chunked, resumable transfers |
| **State management complexity** | Multiple layers of async state (rooms, peers, media, encryption); solved with layered React contexts (`Shell` → `Room` → `Settings`) and TanStack Query for server state |

---

## 🔮 Future Scope

- Group encryption (currently encrypts per-peer; could add group key distribution)
- Message persistence with client-side encrypted storage
- Offline message queuing and delivery on reconnection
- End-to-end encrypted file previews (image/video thumbnails)
- Multi-device session support

---

## 📄 License

MIT © 2026 bikund2017
