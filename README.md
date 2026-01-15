# Expo + NativeWind Starter

A modern React Native starter template with Expo Router and NativeWind (Tailwind CSS) pre-configured for rapid cross-platform development.

## Tech Stack

- **React Native** 0.81.5 - Cross-platform mobile framework
- **Expo** ~54.0 - Development platform and tooling
- **Expo Router** ~6.0 - File-based routing for navigation
- **React** 19.1.0 - UI library
- **TypeScript** ~5.9 - Type safety
- **NativeWind** 5.0 - Tailwind CSS for React Native
- **Tailwind CSS** 4.1 - Utility-first CSS framework
- **React Navigation** 7.x - Navigation library
- **Reanimated** ~4.1 - Smooth animations
- **Gesture Handler** ~2.28 - Touch gesture system

## Features

- ✅ File-based routing with Expo Router
- ✅ TypeScript configured with strict mode
- ✅ NativeWind (Tailwind CSS) styling
- ✅ Path aliases (`@/*`)
- ✅ Prettier + ESLint configured
- ✅ React Compiler enabled
- ✅ New Architecture enabled
- ✅ Web, iOS, and Android support
- ✅ Dark mode ready

## Getting Started

1. Clone this repository

2. Install dependencies

   ```bash
   npm install
   ```

3. Start the development server

   ```bash
   npx expo start
   ```

4. Run on your platform
   - Press `a` for Android emulator
   - Press `i` for iOS simulator
   - Press `w` for web browser
   - Scan QR code with Expo Go app

## Project Structure

```
├── app/              # File-based routing directory
│   ├── _layout.tsx   # Root layout
│   ├── index.tsx     # Home screen
│   └── global.css    # Global styles
├── assets/           # Images and static files
└── ...config files
```

## Development

Start developing by editing files in the `app/` directory. The app uses file-based routing, so creating new files automatically creates new routes.

## Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm run web` - Run on web
- `npm run lint` - Run ESLint

## Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [NativeWind](https://www.nativewind.dev/)
- [React Native](https://reactnative.dev/)

## License

MIT
