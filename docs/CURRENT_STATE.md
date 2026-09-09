# Current State

Snapshot verified 2026-08-09. Keep only durable facts here.

## Product/runtime

- The PWA starts in Vocab City 3D (`index.html`); the feature-rich classic lobby remains at `index_classic.html` and is reachable from the city.
- The game targets fullscreen landscape use and has explicit small-landscape/iPhone lobby handling. Touch and keyboard/pointer paths coexist.
- Core play is offline-capable. Local state is canonical during play; Google/Firebase sync reconciles and backs up the serialized save when available.
- Vocabulary content is split by grade/band/category into manifests and chunks. Core matching, quizzes, personal review, exams, and multiple 3D vocabulary modes share progression.
- Normal-player access currently marks adventure, drive, motorcycle, and mecha worlds as Coming Soon; authorized tester accounts can enter them. Treat this as product gating, not engine removal.
- The current handoff reports no confirmed unresolved bug. Two-account/two-device realtime flows still require real-device acceptance coverage beyond local fake-DB harnesses.

## Isolated Frontline V1 development

- Host election uses recent owner-verified input heartbeats (2.5 seconds), so expired room timestamps cannot deadlock FIRE/BOMB after a suspended phone returns. Missing or replaced seats pause input and automatically re-admit the human; cached-page returns preserve the session. AUTO buttons are separated from steering by 40–72 CSS pixels.
- Room labels are system numbers (R1001, R1002, ...). A fifth human automatically enters the next room. Quick FIRE/BOMB taps are queued until acknowledged; per-seat `inputs/` mailboxes avoid racing the elected simulation writer. Conditional admission runs only in the local preview server. Shell/bomb supplies are unlimited, with brief use intervals and pooled local visual effects.
- Target words and Thai meanings reuse ShootWord's `js/data/vocab.js` / `vocabForStudent()` data. The first bank to complete each word earns exactly 1,000 central coins in the isolated save; all players see a winner banner and hear a synthesized cue. There are no downloaded audio files or new textures.

- `tools/frontline-v1/` is a fresh modular competitive prototype: four player seats, bots for vacant seats, two neutral leader-pressure guards, persistent A-Z ram pickups, private 5,000-HP vaults, letter theft, 5,000-HP tanks, projectile/PvP damage, timed bombs, and winner-only target-word rewards. Players, bots and guards spawn/respawn at 5,000 HP. Lightweight overhead health bars use green above 50%, yellow above 25% through 50%, and red at 25% or less. All tanks share one texture-free cute toy GLB and rotate continuously through 360 degrees with no directional sprite snapping.
- The local development server exposes only `/__dev/frontline` on port 19444. It renders a fullscreen landscape battlefield from 15 recycled procedural chunks. The production build excludes the whole `tools/` directory and has no Frontline launcher, menu item, public route, asset, or test state.
- Multiplayer uses only the `demo-vocab-frontline-v1` RTDB emulator on loopback port 19445, with browser traffic proxied through the single LAN port 19444 and mobile clients forced to HTTP long-poll, at `frontline_v1_dev/<random-session>/rooms/<CODE>`. Four explicit Rules-backed seats enforce capacity. Main `addCoins()`/`saveState()` award exactly 1,000 coins to the word winner in isolated storage `vw.frontline-v1.test.save.v1`; production Firebase, saves, accounts, and leaderboards are never loaded. No production deployment was performed.
## Active 3D architecture

- Vocab City, Adventure3D, Vocab Arena, Vocab Sky Playground, Invasion, Moto, F1, ShootWord, and lobby character rendering are separate Three.js owners rather than one universal engine.
- Adventure3D is a multi-mode engine for adventure, haunted hotel, helicopter, drone, drive, soccer, and mecha. Scenes are cached per mode for reuse.
- Hotel geometry/collision/visibility is separated into `hotel3d.js`; gameplay remains in Adventure3D.
- Collision and navigation are custom lightweight systems. There is no external physics engine.
- Visual effects use standard Three materials, sprites/meshes, additive blending, and generated canvas textures. No application-level custom shader/post-processing stack is present.
- Vocab Sky Playground Phase 3 is a public standalone social world registered through `WORLD3D`: shared Letter Hunt, competitive Word Race, timed Sky Obby, a six-floor Vocabulary Tower, rotating Daily Sky Missions, durable reward claims, speed/accuracy/co-op badges, reconnect/live join, vocabulary gates/stars, active pet following, main-coin rewards, and `NetRoom` map `sky` capped at six players per instance.

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

## Vocab World Kart public game (round 1379)

Kart is public and shares the Racing engine through isolated game closures. Its tropical scene and selected-colour vehicle/cockpit are procedural 3D; top speed is 110 km/h (8% DRS boost) and pit limit 40 km/h. Drawn walls and continuous swept collision use identical segments; Kart has no portal. Authenticated room/rank writes remain UID-owned. A once-per-player lobby invitation skips previous Kart players. Existing F1 retains its original behavior and records. Details and QA: `docs/KART_PREVIEW.md`.

## Arena Field (round 1380)

- Adventure remains admin-only, with articulated small heroes and bounded spell effects. Letter pickups must be carried home to bank before word completion; bank/cargo persist in the existing account save. See `docs/ARENA_FIELD.md`.

- Arena round 1381: admin entry now opens an eight-hero (4 male/4 female) selection with generated alpha WebP full-body portraits; hair/cape/elements animate locally, with reduced-motion and lifecycle cleanup. Battle scripts preload during selection. Signature cooldown -20%, two starter skills per hero, ten-spell library, numeric overhead HP and bounded floating damage. See `docs/ARENA_FIELD.md`.

- Arena round1384: six letter-crystal pedestals respawn after18 active seconds; five fresh crystals unlock five uses of the selected hero elemental MEGA. Radius18 real AoE, remaining-use badge distinct from seconds, cargo/home preserved, session charges reset on down/exit. See docs/ARENA_FIELD.md.
