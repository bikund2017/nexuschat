# NexusChat 💬

> **Final Year Project** — A secure, real-time peer-to-peer communication platform with end-to-end encryption.

NexusChat enables private conversations without relying on central servers. Messages are encrypted on the sender's device and decrypted only by the intended recipient — no intermediary can read them. Built as a college project to explore modern web technologies including WebRTC, the Web Crypto API, and React.

🔗 **Live Demo:** [https://nexuschat-inky.vercel.app](https://nexuschat-inky.vercel.app)

---

## ✨ Features

- 🔒 **End-to-End Encryption** — RSA-OAEP encryption via the Web Crypto API. Private keys never leave the browser.
- 🌐 **Peer-to-Peer** — Direct communication between browsers using WebRTC — no central message server.
- 💬 **Real-Time Messaging** — Instant delivery with Markdown support and syntax highlighting.
- ✅ **Delivery Receipts** — See when your messages are sent and delivered with tick indicators.
- 📹 **Video & Audio Calls** — Built-in media sharing with screen sharing.
- 📁 **File Transfer** — Send files directly to peers over the data channel.
- 🌙 **Dark / Light Theme** — Clean monochrome UI with automatic system preference detection.
- 📱 **PWA Support** — Installable as a Progressive Web App on desktop and mobile.
- 📲 **Mobile Optimized** — Responsive design with touch-friendly controls and overlay drawers.

---

## 🛠️ Tech Stack

| Technology | Purpose |
| --- | --- |
| **React 18** | UI framework with hooks and context |
| **TypeScript** | Static type safety across the codebase |
| **Material UI 5** | Accessible component library |
| **WebRTC (Trystero)** | Peer-to-peer media and data channels |
| **Web Crypto API** | Client-side RSA-OAEP encryption |
| **Vite** | Fast build tool and HMR dev server |
| **Vitest** | Unit and integration testing |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Setup

```bash
git clone https://github.com/bikund2017/nexuschat.git
cd nexuschat
npm install
```

### Development Server

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder.

---

## 💬 How It Works

1. **Room Creation** — A user creates a public or private room. Private rooms require a shared password.
2. **Peer Discovery** — WebTorrent trackers are used _only_ to discover peers. No message data passes through them.
3. **Direct Connection** — Once discovered, peers establish a direct WebRTC connection.
4. **Encryption** — Each peer generates an RSA-OAEP key pair locally. Public keys are exchanged, and all messages are encrypted end-to-end.
5. **Ephemeral Data** — Nothing is stored on any server. Closing the tab erases all conversation data.

---

## 🏗️ Architecture

```text
┌──────────┐     WebRTC      ┌──────────┐
│  Peer A  │ ◄─────────────► │  Peer B  │
│ (Browser)│   P2P Direct    │ (Browser)│
└──────────┘                 └──────────┘
     │                            │
     └── Trystero (BitTorrent) ───┘
         (Peer Discovery Only)
```

- **No server** stores messages — everything is peer-to-peer
- **Trystero** uses BitTorrent trackers only for initial peer discovery
- **All data** is ephemeral — erased when you close the tab

---

## 📁 Project Structure

```text
src/
├── components/       # Reusable UI components
│   ├── Message/          # Chat message bubbles
│   ├── MessageForm/      # Message input
│   ├── Shell/            # App shell, drawer, app bar
│   └── Room/             # Room management
├── config/           # App configuration
├── contexts/         # React contexts
├── hooks/            # Custom hooks
├── lib/              # Core libraries (PeerRoom, Audio, etc.)
├── models/           # TypeScript types
├── pages/            # Page components
│   ├── Home/             # Landing page
│   ├── About/            # About page
│   ├── Disclaimer/       # Legal disclaimer
│   └── Settings/         # User preferences
└── services/         # Business logic
    ├── Encryption/       # Web Crypto API wrapper
    ├── FileTransfer/     # Peer file sharing
    ├── Notification/     # Browser notifications
    └── Serialization/    # Message encoding
```

---

## 🧪 Testing

```bash
npm test              # Unit tests (Vitest)
npm run test:e2e      # End-to-end tests (Playwright)
```

---

## 📄 License

MIT © 2026 bikund2017
