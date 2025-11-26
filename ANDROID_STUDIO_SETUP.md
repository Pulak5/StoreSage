# Android Studio Setup for APK Building

You need Android Studio installed to build the APK with Gradle. Follow these steps:

## Step 1: Download Android Studio
- Go to: https://developer.android.com/studio
- Click **"Download Android Studio"** (latest version, ~900 MB)
- Choose the Windows installer

## Step 2: Install Android Studio
- Run the installer `.exe` file
- Click **Next** through all screens
- Choose installation path (default is fine: `C:\Program Files\Android\android-studio`)
- Accept default components (it will include Java JDK, which you need)
- Click **Install** and wait (~5-10 minutes)

## Step 3: First Launch & SDK Setup
- Launch Android Studio after installation completes
- If prompted, click **Next** on "Android SDK Setup" screen
- It will download SDK components (~3-5 GB)
- Wait for "Emulator configuration" to finish
- Close Android Studio when done (you don't need to create a project)

## Step 4: Verify Java & SDK are Available
- Open PowerShell
- Run:
  ```powershell
  $env:ANDROID_HOME = 'C:\Users\pulak\AppData\Local\Android\Sdk'
  $env:JAVA_HOME = 'C:\Program Files\Android\android-studio\jbr'
  where java
  ```
- If it prints a path, Java is set up correctly

## Step 5: Build the APK
- From your repo root in PowerShell, run:
  ```powershell
  cd .\android
  .\gradlew.bat assembleDebug
  ```
- This builds the debug APK (takes ~5-10 minutes first time, ~1-2 min after)
- APK will be at: `android\app\build\outputs\apk\debug\app-debug.apk`

## If Build Fails

**"JAVA_HOME not set" error:**
- Set it before building:
  ```powershell
  $env:JAVA_HOME = 'C:\Program Files\Android\android-studio\jbr'
  cd .\android
  .\gradlew.bat assembleDebug
  ```

**"ANDROID_SDK_ROOT" or "SDK not found" error:**
- Set it:
  ```powershell
  $env:ANDROID_HOME = 'C:\Users\pulak\AppData\Local\Android\Sdk'
  $env:ANDROID_SDK_ROOT = 'C:\Users\pulak\AppData\Local\Android\Sdk'
  cd .\android
  .\gradlew.bat assembleDebug
  ```

**Build errors about missing licenses:**
- Run:
  ```powershell
  & "$env:ANDROID_SDK_ROOT\tools\bin\sdkmanager.bat" --licenses
  ```
- Type `y` to accept all licenses, then retry the build.

## After Build Succeeds

Your debug APK is ready at:
```
android\app\build\outputs\apk\debug\app-debug.apk
```

**Install to phone (USB Debug enabled):**
```powershell
adb install -r .\app\build\outputs\apk\debug\app-debug.apk
```

**Or manually install:**
- Email or transfer `app-debug.apk` to your phone
- Open it on the phone to install

---

**Estimated total setup time:** ~20-30 minutes (including downloads)

Need help? Post any error messages and I'll debug them.
