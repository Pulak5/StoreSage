<#
PowerShell helper to prepare Capacitor Android project and copy web assets.
Run this from the repository root in PowerShell. It will NOT open Android Studio.
#>
Set-StrictMode -Version Latest

function Ensure-Command($name) {
    $which = Get-Command $name -ErrorAction SilentlyContinue
    if (-not $which) {
        Write-Error "Required command '$name' not found. Please install it and re-run."
        exit 1
    }
}

Ensure-Command npm
Ensure-Command npx

Write-Host "1) Installing node dependencies (will use package-lock if present)"
if (-not (Test-Path .\node_modules)) {
    npm ci
} else {
    Write-Host "node_modules already present — running npm ci skipped."
}

Write-Host "2) Building web assets"
npm run mobile:prepare

Write-Host "3) Installing Capacitor packages (local dev dependency)"

try {
    npm install @capacitor/cli @capacitor/core @capacitor/android --save-exact
} catch {
    Write-Warning "npm install for Capacitor packages failed; continuing and using npx --package where possible."
}

$capConfig = Join-Path (Get-Location) 'capacitor.config.json'
if (-not (Test-Path $capConfig)) {
    Write-Host "Creating capacitor.config.json via npx cap init"
    npx --package @capacitor/cli@latest cap init "StoreSage" "com.storesage.app" --web-dir dist/public
} else {
    Write-Host "Found existing capacitor.config.json"
}

if (-not (Test-Path "android")) {
    Write-Host "Adding Android platform"
    # prefer npx --package to avoid npx resolution issues
    npx --package @capacitor/cli@latest cap add android || {
        Write-Warning "Failed to add platform via npx --package; trying without --package"
        npx cap add android
    }
} else {
    Write-Host "Android platform already present"
}

Write-Host "Copying web assets to native project"
npx --package @capacitor/cli@latest cap copy android || npx cap copy android

Write-Host "Done. Next steps to build the APK locally:\n- Open Android Studio: 'npx --package @capacitor/cli@latest cap open android' or open the 'android' folder manually.\n- Or build from CLI:\n  cd android\n  .\\gradlew.bat assembleDebug\nThe debug APK will be at: android/app/build/outputs/apk/debug/app-debug.apk"
