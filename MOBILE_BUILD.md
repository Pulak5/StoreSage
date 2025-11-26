# Build Android APK (Capacitor)

This project uses Vite + React. Below are steps to create an Android APK using Capacitor. You must run these commands on your development machine (Windows) and have Android Studio installed. These steps do not run in this repo automatically; they guide you to create the native wrapper.

Prerequisites
- Node.js and npm installed
- Android Studio + Android SDK installed
- Java JDK (bundled with Android Studio)
- `npx` available (comes with npm)

High-level approach
1. Build the web app (produces `dist/public/` from root `build` script).
2. Install Capacitor CLI and Capacitor core packages.
3. Initialize Capacitor and add the Android platform.
4. Copy web assets into the native project with `npx cap copy`.
5. Open Android Studio to build a signed APK.

Recommended commands (PowerShell)

# 1. Build web assets
npm run mobile:prepare

# 2. Install Capacitor packages (do this once)
npm install @capacitor/core @capacitor/cli --save-exact

# 3. Initialize Capacitor (replace bundle id and app name if you want)
npx cap init "StoreSage" "com.storesage.app" --web-dir dist/public

# 4. Add Android platform
npx cap add android

# 5. Copy web assets to native project
npx cap copy android

# 6. Open Android Studio to configure signing and build the APK
npx cap open android

Notes
- After Android Studio opens, go to "Build > Generate Signed Bundle / APK..." to generate a signed APK.
- If you make web changes, re-run `npm run mobile:prepare` and `npx cap copy android`.
- If you prefer using a trusted web activity (TWA) for publishing to Play Store, consider using Bubblewrap: https://github.com/GoogleChromeLabs/bubblewrap

Alternative: PWABuilder
- If you'd rather produce an Android package directly from PWA, use https://www.pwabuilder.com/ to generate a project or APK from your built site (hosted or zipped).

If you want, I can also:
- Add a small PowerShell helper script to run the sequence (non-destructive), or
- Scaffold a `capacitor.config.json` for you now.

