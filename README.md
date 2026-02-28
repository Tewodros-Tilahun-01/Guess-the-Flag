# 🌍 Guess the Flag

A fun and educational mobile game where players test their geography knowledge by identifying country flags. Features both single-player and multiplayer modes with LAN support.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React Native](https://img.shields.io/badge/React%20Native-0.81.5-61dafb.svg)
![Expo](https://img.shields.io/badge/Expo-~54.0-000020.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 📲 Download

<div align="center">
  <a href="https://github.com/Tewodros-Tilahun-01/Guess-the-Flag/releases/download/v1.0.0/guess.the.flag.apk">
    <img src="./assets/images/icon.png" alt="Guess the Flag Icon" width="120" height="120" />
  </a>
  
  ### [⬇️ Download APK (v1.0.0)](https://github.com/Tewodros-Tilahun-01/Guess-the-Flag/releases/download/v1.0.0/guess.the.flag.apk)
  
  **Compatible with most Android devices**
</div>

---

## ✨ Features

### 🎮 Game Modes

- **Single Player**: Play offline at your own pace with customizable settings
- **Multiplayer (LAN)**: Challenge friends on the same WiFi network or hotspot

### 🎯 Gameplay Features

- **Customizable Settings**: Choose number of questions (5-20), time per question (10-60s), and difficulty levels (1-5)
- **Real-time Competition**: Synchronized gameplay with live timer for multiplayer
- **Score Tracking**: Detailed results showing correct/incorrect answers with flag references
- **Player Management**: Ready system, player notifications, and graceful disconnect handling

### 🌐 Network Features

- **Hotspot Support**: Host can create a WiFi hotspot - no internet required!
- **QR Code Sharing**: Easy game joining via QR code scanning
- **Minimal Data Usage**: Only a few KB per game to load flag images
- **Automatic Reconnection**: Robust connection handling with grace periods

### 💎 UI/UX

- **Modern Design**: Beautiful gradients, smooth animations, and professional styling
- **Responsive Layout**: Optimized for various screen sizes
- **Loading States**: Clear feedback during result calculation and network operations
- **How to Play Guide**: Interactive modal with step-by-step instructions

## 📱 Screenshots

```
[Home Screen]  [Game Setup]  [Gameplay]  [Results]
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (Mac only) or Android Emulator

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Tewodros-Tilahun-01/Guess-the-Flag.git
   cd guess-the-flag
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npx expo start
   ```

4. **Run on your platform**
   - Press `a` for Android emulator
   - Press `i` for iOS simulator
   - Scan QR code with Expo Go app on your device

### Building for Production

#### Android APK

```bash
# Preview build (for testing)
eas build --profile preview --platform android

# Production build
eas build --profile production --platform android
```

#### Android AAB (for Play Store)

```bash
eas build --profile production-aab --platform android
```

## 🎮 How to Play

### Single Player Mode

1. Select "Single Player" from the main menu
2. Configure game settings (questions, time, difficulty)
3. Start the game and type country names for each flag
4. View your results and score at the end

### Multiplayer Mode

#### As Host:

1. Select "Multiplayer" → "Host Game"
2. Configure game settings
3. Share the server address or QR code with players
4. Wait for players to join and mark themselves ready
5. Start the game when all players are ready

#### As Player:

1. Select "Multiplayer" → "Join Game"
2. Enter host's IP address or scan QR code
3. Wait in lobby and click "Ready" when prepared
4. Play together and compare scores at the end

### Tips

- ⚡ Type quickly - time is limited!
- 📱 Host can create a WiFi hotspot for offline play
- 🌐 All devices must be on the same network
- 💾 Uses minimal data (only a few KB per game)
- 🎯 Spelling must be exact (watch for spaces and hyphens)

## 🏗️ Project Structure

```
guess-the-flag/
├── app/                          # Expo Router screens
│   ├── (auth)/                   # Authentication screens
│   ├── (tabs)/                   # Tab navigation screens
│   ├── _layout.tsx               # Root layout
│   ├── index.tsx                 # Home screen
│   ├── game.tsx                  # Main game screen
│   ├── lobby.tsx                 # Multiplayer lobby
│   ├── result.tsx                # Results screen
│   ├── single-player-setup.tsx   # Single player config
│   ├── multiplayer-menu.tsx      # Multiplayer menu
│   ├── host-setup.tsx            # Host configuration
│   └── join-game.tsx             # Join game screen
├── src/
│   ├── components/               # Reusable components
│   │   └── PlayerLeftNotification.tsx
│   ├── database/                 # SQLite database
│   │   ├── initDB.ts            # Database initialization
│   │   └── countryQueries.ts    # Country data queries
│   ├── engine/                   # Game logic
│   │   └── GameEngine.ts        # Core game engine
│   ├── multiplayer/              # Networking
│   │   ├── HostServer.ts        # TCP server for host
│   │   ├── ClientConnection.ts  # TCP client
│   │   └── messageTypes.ts      # Message serialization
│   ├── store/                    # State management
│   │   └── gameStore.ts         # Zustand store
│   ├── types/                    # TypeScript types
│   │   ├── game.ts              # Game types
│   │   └── messages.ts          # Network message types
│   ├── utils/                    # Utility functions
│   │   ├── network.ts           # Network utilities
│   │   ├── flagUrl.ts           # Flag image URLs
│   │   ├── connectionManager.ts # Connection management
│   │   └── multiplayerConnection.ts
│   └── hooks/                    # Custom React hooks
│       └── useBackHandler.ts    # Android back button
├── assets/                       # Static assets
│   └── images/
│       ├── icon.png             # App icon
│       └── splash.png           # Splash screen
├── app.json                      # Expo configuration
├── eas.json                      # EAS Build configuration
├── package.json                  # Dependencies
└── tsconfig.json                 # TypeScript config
```

## 🛠️ Tech Stack

### Core

- **React Native** 0.81.5 - Cross-platform mobile framework
- **Expo** ~54.0 - Development platform and tooling
- **TypeScript** ~5.9 - Type safety and better DX
- **Expo Router** ~6.0 - File-based routing

### State Management

- **Zustand** ^5.0 - Lightweight state management

### Database

- **Expo SQLite** ^16.0 - Local database for country data

### Networking

- **react-native-tcp-socket** ^6.4 - TCP server/client for LAN multiplayer
- **@react-native-community/netinfo** 11.4 - Network information

### UI/UX

- **expo-linear-gradient** ^15.0 - Beautiful gradients
- **react-native-qrcode-svg** ^6.3 - QR code generation
- **expo-haptics** ^15.0 - Haptic feedback
- **react-native-reanimated** ~4.1 - Smooth animations

### Development

- **ESLint** ^9.25 - Code linting
- **Prettier** ^3.8 - Code formatting
- **EAS Build** - Cloud build service

## 🎨 Key Features Implementation

### Game Engine

The `GameEngine` class handles:

- Question generation with difficulty filtering
- Answer validation and scoring
- Progress tracking
- Random country selection

### Multiplayer Architecture

- **TCP Server**: Host runs a TCP server on port 8080
- **Message Protocol**: JSON-based message serialization
- **State Sync**: Real-time synchronization of game state
- **Grace Period**: 2-second buffer for late answer submissions
- **Disconnect Handling**: Tracks left players for final results

### State Management

Zustand store manages:

- Game mode (single/multiplayer)
- Game state (menu/lobby/playing/calculating/ended)
- Player list and ready states
- Current question and timer
- Player answers and scores

## 🔧 Configuration

### App Configuration (`app.json`)

- App name, slug, and version
- Icon and splash screen
- Platform-specific settings (iOS/Android)
- Permissions (INTERNET, ACCESS_NETWORK_STATE)

### Build Configuration (`eas.json`)

- Development, preview, and production profiles
- APK and AAB build types
- Auto-increment version codes

## 📊 Database Schema

The app uses SQLite with a `countries` table:

```sql
CREATE TABLE countries (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  region TEXT,
  difficulty INTEGER,
  flag_file TEXT
);
```

## 🌐 Network Protocol

### Message Types

- `JOIN_GAME` - Player joins lobby
- `PLAYER_LIST_UPDATE` - Sync player list
- `PLAYER_READY` - Player ready status
- `GAME_CONFIG` - Game settings
- `GAME_START` - Start game
- `NEW_QUESTION` - Send question
- `SUBMIT_ANSWER` - Player answer
- `TIME_UPDATE` - Timer sync
- `CALCULATING_RESULTS` - Processing results
- `GAME_END` - Final results
- `PLAYER_LEFT` - Player disconnected
- `SERVER_STOPPED` - Host ended game

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Flag images provided by [flagcdn.com](https://flagcdn.com)
- Country data sourced from public domain datasets
- Built with [Expo](https://expo.dev) and [React Native](https://reactnative.dev)

## 🎉 Origin Story

This game was born from a friendly bet between friends about who knows more country flags. What started as a simple challenge turned into a full-featured mobile game that anyone can enjoy! Now you can settle your own flag debates with friends using multiplayer mode. 🏁

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

Made with ❤️ by the Guess the Flag team
