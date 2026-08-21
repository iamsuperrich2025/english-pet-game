# Current State

Snapshot verified 2026-08-09. Keep only durable facts here.

## Product/runtime

- The PWA starts in Vocab City 3D (`index.html`); the feature-rich classic lobby remains at `index_classic.html` and is reachable from the city.
- The game targets fullscreen landscape use and has explicit small-landscape/iPhone lobby handling. Touch and keyboard/pointer paths coexist.
- Core play is offline-capable. Local state is canonical during play; Google/Firebase sync reconciles and backs up the serialized save when available.
- Vocabulary content is split by grade/band/category into manifests and chunks. Core matching, quizzes, personal review, exams, and multiple 3D vocabulary modes share progression.
- Normal-player access currently marks adventure, drive, motorcycle, and mecha worlds as Coming Soon; authorized tester accounts can enter them. Treat this as product gating, not engine removal.
- The current handoff reports no confirmed unresolved bug. Two-account/two-device realtime flows still require real-device acceptance coverage beyond local fake-DB harnesses.

## Active 3D architecture

- Vocab City, Adventure3D, Vocab Arena, Invasion, Moto, F1, ShootWord, and lobby character rendering are separate Three.js owners rather than one universal engine.
- Adventure3D is a multi-mode engine for adventure, haunted hotel, helicopter, drone, drive, soccer, and mecha. Scenes are cached per mode for reuse.
- Hotel geometry/collision/visibility is separated into `hotel3d.js`; gameplay remains in Adventure3D.
- Collision and navigation are custom lightweight systems. There is no external physics engine.
- Visual effects use standard Three materials, sprites/meshes, additive blending, and generated canvas textures. No application-level custom shader/post-processing stack is present.

## Asset and animation strategy

- Visible 3D player characters use the mandatory **Soft Cuboid Chibi 3D** standard in all new and existing covered worlds. Adventure3D P0 is implemented for Drive, Haunted Hotel peers, and Soccer local/peer players through shared cached low-subdivision rounded cuboids; original Adventure remains isolated on its unchanged hard-box legacy builder. Invasion/Mothership also retains its established style; the canonical specification and review checklist are in `docs/PLAYER_CHARACTER_STYLE.md`.
- Three.js and GLTFLoader are vendored. World scripts and many datasets load on demand; the service worker pre-caches only the essential City shell and content-addresses lazy assets so unchanged GLB/audio/textures survive deployments.
- Runtime assets mix manually optimized `*_lite.glb`, WebP/PNG/JPG textures, procedural geometry/canvas textures, audio files, and generated effects.
- Lobby pet animation prefers baked transparent sprite sheets/CSS steps or video/image fallbacks where live 3D is unnecessary. The central lobby scene uses GLB idle clips with `AnimationMixer`.
- Optional assets are probed and should fail softly. Full-resolution source assets are intentionally excluded from deploy in several asset families.

## Development constraints

- There is no game bundler or typed module graph. Browser globals and script order remain architectural dependencies; a dependency-free Node build copies the existing game into `dist/`, fingerprints startup JS/CSS, and generates the deployment asset manifest.
- The largest maintenance hotspots are `js/adventure3d.js` (~13k lines), `js/invasion3d.js` (~10k), and `js/ui.js` (~8.8k). Banner zones and generated `handoff/CODE_MAP.md` are required navigation aids.
- Automated checks are script-based: syntax/diff, missing assets, undefined global calls, template-string validation, and preview-console fake-DB/world harnesses. Visual and mobile viewport changes still need browser verification.
- The worktree commonly contains local/untracked source assets. Deployment intentionally archives tracked `git HEAD` so WIP assets do not leak into production.
- Current feature work is incremental and round-based. Do not infer a refactor mandate from file size; isolate a subsystem first and preserve existing behavior.

## Delivery boundary

- Firebase Hosting at `https://vocabworld.web.app` is the complete game runtime and the normal update channel.
- The Google Play application is a stable TWA shell (`app.web.vocabworld.twa`) configured by `android-twa/twa-manifest.json`; it contains no game assets or executable game code.
- Web updates are installed atomically for the essential shell and never clear the canonical `petVocabAdventure_v1` player save or other persistent player storage.

## Account privacy and deletion

- Account/privacy controls live in the classic lobby Settings under a single `Account & Privacy` tab. Permanent deletion requires exact typed `DELETE`, a recent Google re-authentication, one RTDB multi-location cleanup, and then Firebase Authentication deletion.
- Public bilingual resources are `privacy.html` and `delete-account.html`. The latter documents both the in-app route and an email fallback for users who cannot sign in.
- The browser cleanup intentionally deletes only paths attributable to the departing UID and does not erase other participants' shared content. Firebase Rules in `handoff/RULES.md` must be published before release, and an isolated disposable account must complete end-to-end acceptance testing before Play Console declarations are submitted.
