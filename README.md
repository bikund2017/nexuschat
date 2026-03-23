<h1 align="center">
  <br>
  <img src="public/logo/logo.svg" alt="NexusChat Logo" width="120">
  <br>
  NexusChat 💬
  <br>
</h1>

<h4 align="center">A secure, serverless, peer-to-peer encrypted chat platform built with modern web technologies.</h4>

<p align="center">
  <a href="https://nexuschat-inky.vercel.app"><b>Live Demo</b></a> •
  <a href="#-features"><b>Features</b></a> •
  <a href="#-architecture"><b>Architecture</b></a> •
  <a href="#-getting-started"><b>Getting Started</b></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black" alt="React 18" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/MUI-007FFF?logo=mui&logoColor=white" alt="Material UI" />
  <img src="https://img.shields.io/badge/WebRTC-333333?logo=webrtc&logoColor=white" alt="WebRTC" />
  <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License" />
</p>

---

## 📌 Purpose & Motivation

In today's digital landscape, most messaging platforms route conversations through centralized servers — creating single points of failure, surveillance vulnerabilities, and risks of data breaches.

**NexusChat** (*originally built as a final year BCA project*) was designed to address this problem by demonstrating that **real-time, encrypted communication is possible entirely within the browser**, with absolute zero server-side message storage.

**Core Objectives:**
- Demonstrate practical use of WebRTC for direct browser-to-browser data and media communication.
- Implement strictly client-side RSA-OAEP encryption using the native Web Crypto API.
- Build a production-grade Progressive Web App (PWA) with React, TypeScript, and Material UI.
- Explore decentralized peer discovery via BitTorrent tracker signaling using Trystero.

---

## ✨ Features

### 🔒 Security First
- **End-to-End Encryption:** RSA-OAEP (2048-bit) via Web Crypto API. Your private keys are generated locally and never leave your browser.
- **Zero-Server Footprint:** Direct WebRTC data channels mean absolutely no central message storage.
- **Private Rooms:** Password-protected rooms with SHA-256 hashed credentials.
- **Cryptographic Verification:** Exchange verification tokens independently to confirm peer identities cryptographically.
- **Ephemeral Sessions:** Closing the tab cleanly wipes out the conversation data in transit.

### 💬 Rich Communication
- **P2P Messaging:** Real-time messaging with live typing indicators.
- **Delivery Receipts:** Visually track sending $\rightarrow$ sent $\rightarrow$ delivered status for your messages.
- **Markdown & Code:** Full GitHub Flavored Markdown (GFM) support with syntax highlighting via `react-syntax-highlighter`.
- **Media & YouTube Previews:** Seamless inline embedding of YouTube videos and image references.

### 🎥 Media & Sharing
- **Video & Audio Calls:** High-quality real-time media sessions with active speaker volume visualizers.
- **Screen Sharing:** Native P2P desktop screen sharing abilities.
- **File Transfer:** Chunked, resumable P2P file transfers powered by BitTorrent trackers and the Streamsaver API for massive file handling.

### 📱 User Experience
- **PWA Ready:** Installable on desktop and mobile platforms with a touch-optimized responsive interface.
- **Smart Theming:** Automatic Light/Dark mode syncing with system preferences, including manual toggles.
- **Notifications:** Configurable desktop notifications with bundled acoustic sounds for events.
- **Room Portability:** Directly embed Chat Rooms into other projects seamlessly with generated `<iframe>` code. Room QR code generation for quick mobile joining.

---

## 🛠️ Tech Stack

| Domain | Technologies |
| :--- | :--- |
| **Frontend Core** | React 18, TypeScript, Vite, React Router v7 |
| **Styling & UI** | Material UI (MUI 5), Emotion, Framer Motion |
| **Networking** | WebRTC Adapter, Trystero (BitTorrent signaling) |
| **Security & Storage**| Web Crypto API, LocalForage (IndexedDB) |
| **API & State** | TanStack React Query (`v5`), Vercel Serverless Functions |
| **Testing** | Vitest, Playwright (E2E), Testing Library |

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

### Flow Summary
1. **Boot Sequence:** `index.tsx` $\rightarrow$ `Init` (async RSA key pair generation) $\rightarrow$ `Bootstrap` (loads persisted settings from IndexedDB, sets up context providers and routing).
2. **Context Hierarchy:** `QueryClientProvider` $\rightarrow$ `Router` $\rightarrow$ `StorageContext` $\rightarrow$ `SettingsContext` $\rightarrow$ `ShellContext` $\rightarrow$ `RoomContext` $\rightarrow$ page components.
3. **Encryption Flow:** Keys are generated at boot $\rightarrow$ stored securely as `CryptoKey` objects $\rightarrow$ converted via `SerializationService` for `IndexedDB` persistence $\rightarrow$ `EncryptionService` handles encryption / decryption at message send / receive time.

### Key Design Constraints Respected
- **No Messages Backend:** The only server-side footprint is an optional minimal Vercel Function that returns standard TURN server credentials to help peers punch through strict NATs.
- **Decoupled Architecture:** Utilizes robust Barrel exporting (`index.ts`) for clean project structures and component decoupling. TypeScript limits strictly enforce typed messaging configurations.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.0+
- npm 9.0+

### Installation & Local Environment

1. Clone the project:
   ```bash
   git clone https://github.com/bikund2017/nexuschat.git
   cd nexuschat
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server (runs with HTTPS locally via basicSSL to allow WebRTC / Crypto API features):
   ```bash
   npm run dev
   ```
   > App runs effectively on port `3000`.

4. Build for production:
   ```bash
   npm run build
   npm run preview # Preview the dist/ build
   ```

---

## 🧪 Testing

Comprehensive test suites are embedded spanning unit, integration, and E2E boundaries.

| Command | Usage | Included Mechanics |
| --- | --- | --- |
| `npm run test` | Unit Tests | Executes Vitest with JSDom, mocks Crypto/Trystero |
| `npm run test:e2e` | End-to-End | Spawns Playwright to mock multiple browser contexts |
| `npm run test:e2e:ui`| E2E UI Mode | Opens Playwright's test visualizer UI |
| `npm run check:types`| Static Typing | Runs TypeScript `tsc` to enforce strict patterns|
| `npm run lint` | ESLint Runner | Evaluates code lint rules with `react-app` configs |

---

## ⚙️ Environment Variables

For advanced functionality overrides, configure `.env.local` with the following variables:

| Variable | Description |
| --- | --- |
| `VITE_TRACKER_URL` | Override WebTorrent tracker URL (local dev fallback: `ws://localhost:8000`) |
| `VITE_STREAMSAVER_URL` | Override the default StreamSaver `mitm.html` endpoint. |
| `VITE_ROUTER_TYPE` | Specify frontend router structure (`browser` or `hash`). |
| `VITE_RTC_CONFIG_ENDPOINT`| Custom API pointing to TURN config fetchers (`/api/get-config`). |
| `RTC_CONFIG` | *(Server-Side)* Base64-encoded TURN server configuration variables. |

---

## ⚠️ Overcoming Core Challenges

1. **WebRTC NAT Traversal:** Peers behind symmetric NATs often fail direct connection. Handled by introducing dynamic integration with an optional fallback TURN relay service.
2. **Web Crypto Object Constraints:** Raw `CryptoKey` components are non-serializable. Engineered `SerializationService` dynamically serializing active keystreams to/from standard base64 constructs.
3. **Browser Security Lockouts:** WebRTC / Web Crypto fails without `HTTPS` context natively. Patched using Vite `basicSsl` and warning dialogs (`EnvironmentUnsupportedDialog`).
4. **P2P File Transfer Robustness:** WebRTC data channels normally break on extreme sizing. Implemented `secure-file-transfer` relying on bit-sliced chunking and indexed streams.

---

## 🔮 Future Scope

- **Group Asymmetric Encryption:** Current encryption is scoped directly per-peer. Introducing layered cluster keys for group distribution without massive repetitive load.
- **Client-Side Encrypted Storage:** Enable persisting messages inside the local browser without losing encryption standards between reloads inside specific configured persistence rooms.
- **Offline Message Queuing:** Allow messages to buffer successfully during disconnection spikes.
- **Multi-device Session Support:** Encrypted sync pairing to connect your mobile PWA identifier directly with your desktop agent securely.

---

## 📄 License

This software is released under the MIT License. Copyright © 2026 `bikund2017`.
