# Vocab World delivery architecture

## Boundary

The Android application is a stable Trusted Web Activity shell for `https://vocabworld.web.app`. It contains no game HTML, CSS, JavaScript, Three.js, GLB models, textures, audio, vocabulary data, or level data. Google Play remains the only native update channel.

Firebase Hosting serves the complete game. `npm run build` creates `dist/`; `firebase deploy` publishes that directory. Normal game changes therefore require only a web deployment.

## Build and cache model

- `index.html`, `index_classic.html`, `version.json`, `sw.js`, `manifest.webmanifest`, and `asset-manifest.json` are mutable and revalidate on every load.
- Startup JavaScript and CSS referenced directly by the two HTML entry points receive content-hashed aliases under `/assets/build/` and one-year immutable HTTP caching.
- `asset-manifest.json` records the content hash of every deployed file. The service worker uses that hash as the Cache Storage key for lazy JavaScript, JSON, GLB, textures, images, and audio. A new deployment therefore downloads only files whose bytes changed.
- The City entry and minimum shell are pre-cached. Classic lobby/world engines and level assets remain lazy and load only when requested.
- Installation of a new service worker is atomic for the essential shell. A failed install deletes only its incomplete shell cache. The active shell, one previous shell, and prior content-addressed assets remain available as fallback.
- `version.json` is network-only. It is never answered from Cache Storage.

Video range requests bypass the service worker because caching partial `206` responses can corrupt playback. Normal browser/CDN range caching remains available.

## Player data

Player state is deliberately outside game caches. The existing canonical key `petVocabAdventure_v1` remains in persistent local storage and continues to reconcile with Firebase through `js/state.js` and `js/auth.js`. Profile photos and other existing persistent keys remain separate. Neither the service worker nor update UI calls `localStorage.clear()`, deletes the player key, removes IndexedDB, or resets Firebase saves.

Cache Storage contains only replaceable game resources. Removing or promoting a game cache can never delete coins, progress, inventory, pets, unlocked levels, settings, achievements, or vocabulary history.

## Update sequence

1. The page reads its build ID from generated HTML.
2. `js/app-update.js` fetches `/version.json` with `cache: no-store`.
3. A newer version triggers a service-worker update and an update screen.
4. The new worker fetches and validates its essential shell plus matching asset manifest before activation.
5. After `controllerchange`, the page reloads into the complete new shell.
6. If any step fails, the current page/cache remains intact and the player can retry. Lazy assets fall back to the latest cached version of the same path when the network is unavailable.

## Asset changes

For new or manually maintained large assets, prefer semantic or content versions (`ghost-v2.glb` or `ghost.a83f192.glb`) instead of replacing a path in place. The content manifest protects existing legacy paths during the incremental migration, but versioned source filenames remain the clearest long-term convention.
