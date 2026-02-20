# NexusChat 💬

A secure, real-time peer-to-peer chat application built with React, TypeScript, and WebRTC.

> **Final Year Project** — End-to-end encrypted, serverless communication platform.

---

## ✨ Features

- 🔒 **End-to-End Encryption** — Messages encrypted before leaving your device
- 🌐 **Peer-to-Peer** — No central server, direct communication via WebRTC
- 💬 **Real-Time Messaging** — Instant delivery with typing indicators
- 📹 **Video & Audio Calls** — Built-in media sharing and screen sharing
- 📁 **File Sharing** — Send files directly to peers
- 🎨 **Collaborative Whiteboard** — Draw and share ideas in real-time
- 📊 **In-Chat Polls** — Create polls for group decisions
- 🎙️ **Voice Transcription** — Speech-to-text using Web Speech API
- 🛡️ **Admin Controls** — Room management (mute, lock, slow mode)
- 🌙 **Dark/Light Theme** — Premium glassmorphic UI design

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | Frontend framework |
| TypeScript | Type-safe development |
| Material UI 5 | Component library |
| WebRTC (Trystero) | Peer-to-peer communication |
| Vite | Build tool & dev server |
| Web Speech API | Voice transcription |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
git clone https://github.com/bikund2017/nexuschat.git
cd nexuschat
npm install
```

### Development

```bash
npm start
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

### Production Build

```bash
npm run build
```

Output will be in the `dist/` folder.

## 💬 How to Use

1. Open the app and create a room (public or private)
2. Share the room URL with your peers
3. Start chatting! Messages are encrypted end-to-end
4. Use the whiteboard, polls, and voice transcription features

## 🏗️ Architecture

```
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

## 📁 Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── AdminControls/    # Room management
│   ├── Message/          # Chat message bubbles
│   ├── MessageForm/      # Message input
│   ├── Poll/             # In-chat polls
│   ├── Shell/            # App shell, drawer, app bar
│   └── Whiteboard/       # Collaborative drawing
├── config/           # App configuration
├── contexts/         # React contexts
├── hooks/            # Custom hooks
├── models/           # TypeScript types
├── pages/            # Page components
│   ├── Home/             # Landing page
│   ├── About/            # About page
│   ├── Disclaimer/       # Legal disclaimer
│   └── Settings/         # User preferences
└── services/         # Business logic
```

## 📄 License

GPL-2.0-or-later
