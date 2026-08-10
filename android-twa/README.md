# Vocab World Android TWA wrapper

This directory is the reproducible configuration for the stable Android shell. The game itself is not an Android artifact: it is served from `https://vocabworld.web.app` and updated through Firebase Hosting.

## Trust and identity

- Android application ID: `app.web.vocabworld.twa`
- Trusted origin: `https://vocabworld.web.app`
- Start URL and scope: `/`
- Display: immersive sticky fullscreen
- Orientation: landscape
- Browser fallback: Custom Tab (never an embedded WebView)
- Digital Asset Links: `/.well-known/assetlinks.json`

The fingerprint in `twa-manifest.json` is the Google Play app-signing certificate. Before any native release, compare it with Play Console → App integrity. The upload keystore remains under ignored `store/android/`; never commit a keystore or its passwords.

## Generate or refresh the wrapper

Use Bubblewrap from this directory after the web PWA is deployed and publicly reachable:

```powershell
npx @bubblewrap/cli update --manifest .
npx @bubblewrap/cli build --manifest .
```

If generated Android sources do not exist yet, initialize them in the ignored `generated/` directory from the live manifest, then copy/preserve this checked-in `twa-manifest.json` identity:

```powershell
npx @bubblewrap/cli init --manifest https://vocabworld.web.app/manifest.webmanifest --directory generated
```

Build tools require JDK 17 and an Android SDK. A release build produces an `.aab` for Google Play. Increment `appVersionCode` only when the native wrapper itself changes.

## Hard boundary

Do not copy `dist/`, `js/`, `css/`, `img/`, `sound/`, `clip/`, GLB files, vocabulary/level JSON, or any game JavaScript into the Android project. The wrapper may contain only normal Android launcher/splash resources and TWA metadata. It must never download or execute `.dex`, `.jar`, or `.so` files from Firebase and must never self-update an APK. Native updates are distributed only by Google Play.

Normal game releases do not touch this directory. They use:

```powershell
npm run build
firebase deploy --only hosting:vocabworld --project english-pet-game
```
