# NexusChat# NexusChat 💬# NexusChat 💬# NexusChat 💬



> **Final Year Project** — A secure, real-time peer-to-peer communication platform with end-to-end encryption.



NexusChat enables private conversations without relying on central servers. Messages are encrypted on the sender's device and decrypted only by the intended recipient — no intermediary can read them. Built as a college project to explore modern web technologies including WebRTC, the Web Crypto API, and React.> **Final Year Project** — A secure, real-time peer-to-peer communication platform with end-to-end encryption.



**Live Demo:** <https://nexuschat-inky.vercel.app>



---NexusChat enables private conversations without relying on central servers. Messages are encrypted on the sender's device and decrypted only by the intended recipient — no intermediary can read them. Built as a college project to explore modern web technologies including WebRTC, the Web Crypto API, and React.> **Final Year Project** — A secure, real-time peer-to-peer communication platform with end-to-end encryption.A secure, real-time peer-to-peer chat application built with React, TypeScript, and WebRTC.



## Features



- **End-to-End Encryption** — RSA-OAEP encryption via the Web Crypto API. Private keys never leave the browser.🔗 **Live Demo:** [https://nexuschat-inky.vercel.app](https://nexuschat-inky.vercel.app)

- **Peer-to-Peer** — Direct communication between browsers using WebRTC — no central message server.

- **Real-Time Messaging** — Instant delivery with Markdown support and syntax highlighting.

- **Video and Audio Calls** — Built-in media sharing with screen sharing.

- **File Transfer** — Send files directly to peers over the data channel.---NexusChat enables private conversations without relying on central servers. Messages are encrypted on the sender's device and decrypted only by the intended recipient — no intermediary can read them. Built as a college project to explore modern web technologies including WebRTC, the Web Crypto API, and React.> **Final Year Project** — End-to-end encrypted, serverless communication platform.

- **Dark and Light Theme** — Clean monochrome UI with automatic system preference detection.

- **PWA Support** — Installable as a Progressive Web App on desktop and mobile.



## Tech Stack## ✨ Features



| Technology | Purpose |

| --- | --- |

| React 18 | UI framework with hooks and context |- 🔒 **End-to-End Encryption** — RSA-OAEP encryption via the Web Crypto API. Private keys never leave the browser.------

| TypeScript | Static type safety across the codebase |

| Material UI 5 | Accessible component library |- 🌐 **Peer-to-Peer** — Direct communication between browsers using WebRTC — no central message server.

| WebRTC | Peer-to-peer media and data channels |

| Web Crypto API | Client-side RSA-OAEP encryption |- 💬 **Real-Time Messaging** — Instant delivery with Markdown support and syntax highlighting.

| Vite | Fast build tool and HMR dev server |

| Vitest | Unit and integration testing |- 📹 **Video & Audio Calls** — Built-in media sharing with screen sharing.



## Getting Started- 📁 **File Transfer** — Send files directly to peers over the data channel.## ✨ Features## ✨ Features



### Prerequisites- 🌙 **Dark / Light Theme** — Clean monochrome UI with automatic system preference detection.



- Node.js 18+- 🗣️ **Voice Transcription** — Speech-to-text via the Web Speech API.

- npm 9+

- 📱 **PWA Support** — Installable as a Progressive Web App on desktop and mobile.

### Installation

- 🔒 **End-to-End Encryption** — RSA-OAEP encryption via the Web Crypto API. Private keys never leave the browser.- 🔒 **End-to-End Encryption** — Messages encrypted before leaving your device

```bash

git clone https://github.com/bikund2017/nexuschat.git## 🛠️ Tech Stack

cd nexuschat

npm install- 🌐 **Peer-to-Peer** — Direct communication between browsers using WebRTC — no central message server.- 🌐 **Peer-to-Peer** — No central server, direct communication via WebRTC

```

| Technology | Purpose |

### Development

|---|---|- 💬 **Real-Time Messaging** — Instant delivery with Markdown support and syntax highlighting.- 💬 **Real-Time Messaging** — Instant delivery with typing indicators

```bash

npm start| **React 18** | UI framework with hooks and context |

```

| **TypeScript** | Static type safety across the codebase |- 📹 **Video & Audio Calls** — Built-in media sharing with screen sharing.- 📹 **Video & Audio Calls** — Built-in media sharing and screen sharing

Open <http://localhost:3000> in your browser.

| **Material UI 5** | Accessible component library |

### Production Build

| **WebRTC** | Peer-to-peer media and data channels |- 📁 **File Transfer** — Send files directly to peers over the data channel.- 📁 **File Sharing** — Send files directly to peers

```bash

npm run build| **Web Crypto API** | Client-side RSA-OAEP encryption |

```

| **Vite** | Fast build tool and HMR dev server |- 🌙 **Dark / Light Theme** — Clean monochrome UI with automatic system preference detection.- 🌙 **Dark/Light Theme** — Clean monochrome minimal UI design

Output will be in the `dist/` folder.

| **Vitest** | Unit and integration testing |

## How It Works

| **Web Speech API** | Voice transcription feature |- 🗣️ **Voice Transcription** — Speech-to-text via the Web Speech API.

1. **Room Creation** — A user creates a public or private room. Private rooms require a shared password.

2. **Peer Discovery** — WebTorrent trackers are used only to discover peers. No message data passes through them.

3. **Direct Connection** — Once discovered, peers establish a direct WebRTC connection.

4. **Encryption** — Each peer generates an RSA-OAEP key pair locally. Public keys are exchanged and all messages are encrypted end-to-end.## 🚀 Getting Started- 📱 **PWA Support** — Installable as a Progressive Web App on desktop and mobile.## 🛠️ Tech Stack

5. **Ephemeral Data** — Nothing is stored on any server. Closing the tab erases all conversation data.



## Architecture

### Prerequisites

```text

+-----------+     WebRTC      +-----------+

|  Peer A   | <-------------> |  Peer B   |

| (Browser) |   P2P Direct    | (Browser) |- Node.js 18+## 🛠️ Tech Stack| Technology | Purpose |

+-----------+                 +-----------+

     |                             |- npm 9+

     +--- WebTorrent Trackers -----+

          (Peer Discovery Only)|---|---|

```

### Installation

- No server stores messages — everything is peer-to-peer

- WebTorrent trackers handle only initial peer discovery| Technology | Purpose || React 18 | Frontend framework |

- All data is ephemeral — erased when you close the tab

```bash

## Project Structure

git clone https://github.com/bikund2017/nexuschat.git|---|---|| TypeScript | Type-safe development |

```text

src/cd nexuschat

├── components/       # Reusable UI components

│   ├── Message/          # Chat message renderingnpm install| **React 18** | UI framework with hooks and context || Material UI 5 | Component library |

│   ├── MessageForm/      # Message input

│   ├── Shell/            # App shell, navigation drawer, top bar```

│   └── Room/             # Room logic and peer management

├── config/           # App-wide configuration constants| **TypeScript** | Static type safety across the codebase || WebRTC (Trystero) | Peer-to-peer communication |

├── contexts/         # React contexts (Shell, Settings, Storage, Room)

├── hooks/            # Custom React hooks### Development

├── lib/              # Core libraries (PeerRoom, Audio, etc.)

├── models/           # TypeScript interfaces and types| **Material UI 5** | Accessible component library || Vite | Build tool & dev server |

├── pages/            # Route-level page components

│   ├── Home/             # Landing page and room creation```bash

│   ├── About/            # Project information

│   ├── Disclaimer/       # Legal disclaimernpm start| **WebRTC** | Peer-to-peer media and data channels || Web Speech API | Voice features |

│   └── Settings/         # User preferences

└── services/         # Business logic layer```

    ├── Encryption/       # Web Crypto API wrapper

    ├── FileTransfer/     # Peer file sharing| **Web Crypto API** | Client-side RSA-OAEP encryption |

    ├── Notification/     # Browser notifications

    └── Serialization/    # Message encodingOpen [http://localhost:3000](http://localhost:3000) in your browser.

```

| **Vite** | Fast build tool and HMR dev server |## 🚀 Getting Started

## Testing

### Production Build

```bash

npm test              # Unit tests (Vitest)| **Vitest** | Unit and integration testing |

npm run test:e2e      # End-to-end tests (Playwright)

``````bash



## Licensenpm run build| **Web Speech API** | Voice transcription feature |### Prerequisites



MIT - 2026 bikund2017```




Output will be in the `dist/` folder.

## 🚀 Getting Started- Node.js 18+

## 💬 How It Works

- npm 9+

1. **Room Creation** — A user creates a public or private room. Private rooms require a shared password.

2. **Peer Discovery** — WebTorrent trackers are used _only_ to discover peers. No message data passes through them.### Prerequisites

3. **Direct Connection** — Once discovered, peers establish a direct WebRTC connection.

4. **Encryption** — Each peer generates an RSA-OAEP key pair locally. Public keys are exchanged, and all messages are encrypted end-to-end.### Installation

5. **Ephemeral Data** — Nothing is stored on any server. Closing the tab erases all conversation data.

- Node.js 18+

## 🏗️ Architecture

- npm 9+```bash

```

┌──────────┐     WebRTC      ┌──────────┐git clone https://github.com/bikund2017/nexuschat.git

│  Peer A  │ ◄─────────────► │  Peer B  │

│ (Browser)│   P2P Direct    │ (Browser)│### Installationcd nexuschat

└──────────┘                 └──────────┘

     │                            │npm install

     └── WebTorrent Trackers ─────┘

         (Peer Discovery Only)```bash```

```

git clone https://github.com/bikund2017/nexuschat.git

- **No server** stores messages — everything is peer-to-peer

- **WebTorrent trackers** handle only initial peer discoverycd nexuschat### Development

- **All data** is ephemeral — erased when you close the tab

npm install

## 📁 Project Structure

``````bash

```

src/npm start

├── components/       # Reusable UI components

│   ├── Message/          # Chat message rendering### Development```

│   ├── MessageForm/      # Message input with emoji & attachments

│   ├── Shell/            # App shell, navigation drawer, top bar

│   └── Room/             # Room logic and peer management

├── config/           # App-wide configuration constants```bashOpen [http://localhost:5173](http://localhost:5173) in your browser.

├── contexts/         # React contexts (Shell, Settings, Storage, Room)

├── hooks/            # Custom React hooksnpm start

├── lib/              # Core libraries (PeerRoom, Audio, etc.)

├── models/           # TypeScript interfaces and types```### Production Build

├── pages/            # Route-level page components

│   ├── Home/             # Landing page & room creation

│   ├── About/            # Project information

│   ├── Disclaimer/       # Legal disclaimerOpen [http://localhost:3000](http://localhost:3000) in your browser.```bash

│   └── Settings/         # User preferences

└── services/         # Business logic layernpm run build

    ├── Encryption/       # Web Crypto API wrapper

    ├── FileTransfer/     # Peer file sharing### Production Build```

    ├── Notification/     # Browser notifications

    └── Serialization/    # Message encoding

```

```bashOutput will be in the `dist/` folder.

## 🧪 Testing

npm run build

```bash

npm test              # Unit tests (Vitest)```## 💬 How to Use

npm run test:e2e      # End-to-end tests (Playwright)

```



## 📄 LicenseOutput will be in the `dist/` folder.1. Open the app and create a room (public or private)



MIT © 2026 bikund20172. Share the room URL with your peers


## 💬 How It Works3. Start chatting! Messages are encrypted end-to-end

4. Use the voice transcription and other features

1. **Room Creation** — A user creates a public or private room. Private rooms require a shared password.

2. **Peer Discovery** — WebTorrent trackers are used _only_ to discover peers. No message data passes through them.## 🏗️ Architecture

3. **Direct Connection** — Once discovered, peers establish a direct WebRTC connection.

4. **Encryption** — Each peer generates an RSA-OAEP key pair locally. Public keys are exchanged, and all messages are encrypted end-to-end.```

5. **Ephemeral Data** — Nothing is stored on any server. Closing the tab erases all conversation data.┌──────────┐     WebRTC      ┌──────────┐

│  Peer A  │ ◄─────────────► │  Peer B  │

## 🏗️ Architecture│ (Browser)│   P2P Direct    │ (Browser)│

└──────────┘                 └──────────┘

```     │                            │

┌──────────┐     WebRTC      ┌──────────┐     └── Trystero (BitTorrent) ───┘

│  Peer A  │ ◄─────────────► │  Peer B  │         (Peer Discovery Only)

│ (Browser)│   P2P Direct    │ (Browser)│```

└──────────┘                 └──────────┘

     │                            │- **No server** stores messages — everything is peer-to-peer

     └── WebTorrent Trackers ─────┘- **Trystero** uses BitTorrent trackers only for initial peer discovery

         (Peer Discovery Only)- **All data** is ephemeral — erased when you close the tab

```

## 📁 Project Structure

- **No server** stores messages — everything is peer-to-peer

- **WebTorrent trackers** handle only initial peer discovery```

- **All data** is ephemeral — erased when you close the tabsrc/

├── components/       # Reusable UI components

## 📁 Project Structure│   ├── Message/          # Chat message bubbles

│   ├── MessageForm/      # Message input

```│   ├── Shell/            # App shell, drawer, app bar

src/│   └── Room/             # Room management

├── components/       # Reusable UI components├── config/           # App configuration

│   ├── Message/          # Chat message rendering├── contexts/         # React contexts

│   ├── MessageForm/      # Message input with emoji & attachments├── hooks/            # Custom hooks

│   ├── Shell/            # App shell, navigation drawer, top bar├── models/           # TypeScript types

│   └── Room/             # Room logic and peer management├── pages/            # Page components

├── config/           # App-wide configuration constants│   ├── Home/             # Landing page

├── contexts/         # React contexts (Shell, Settings, Storage, Room)│   ├── About/            # About page

├── hooks/            # Custom React hooks│   ├── Disclaimer/       # Legal disclaimer

├── lib/              # Core libraries (PeerRoom, Audio, etc.)│   └── Settings/         # User preferences

├── models/           # TypeScript interfaces and types└── services/         # Business logic

├── pages/            # Route-level page components```

│   ├── Home/             # Landing page & room creation
│   ├── About/            # Project information
│   ├── Disclaimer/       # Legal disclaimer
│   └── Settings/         # User preferences
└── services/         # Business logic layer
    ├── Encryption/       # Web Crypto API wrapper
    ├── FileTransfer/     # Peer file sharing
    ├── Notification/     # Browser notifications
    └── Serialization/    # Message encoding
```

## 🧪 Testing

```bash
npm test              # Unit tests (Vitest)
npm run test:e2e      # End-to-end tests (Playwright)
```

## 📄 License

MIT © 2026 bikund2017
