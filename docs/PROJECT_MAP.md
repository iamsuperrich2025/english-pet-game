# Project Map

AI navigation index for `C:\Users\rober\english-pet-game`. Paths are repository-relative. Use `handoff/CODE_MAP.md` for current symbol-to-line lookup inside large files.

## Application shell and bootstrap

SYSTEM: Primary Vocab City entry
PURPOSE: PWA start page and interactive 3D city lobby.
PRIMARY FILE: `index.html`
RELATED FILES: `js/city3d.js`, `manifest.webmanifest`, `js/app-update.js`, `sw.js`, `js/thaitime.js`
PUBLIC ENTRY POINTS / KEY SYMBOLS: `boot`, `BUILDINGS`, `actBuilding`, `setupInput`, `window.CITY`
DEPENDENCIES: `THREE`, Firebase config, browser DOM/storage.
NOTES: Loads immediately; links to `index_classic.html`. City building actions route into game destinations.

SYSTEM: Classic lobby bootstrap
PURPOSE: Loads the complete 2D lobby/game shell in dependency order and starts authentication/game boot.
PRIMARY FILE: `index_classic.html`
RELATED FILES: `js/main.js`, `js/util.js`, `js/ui.js`, `css/style.css`, `css/lobby.css`
PUBLIC ENTRY POINTS / KEY SYMBOLS: `bootGame`, `showScreen`, DOM button handlers
DEPENDENCIES: Ordered browser globals from all preceding `<script>` tags.
NOTES: No module loader or bundler. Script order is part of the architecture.

SYSTEM: Screen routing and level admission
PURPOSE: Switches classic-lobby DOM screens and lazy-loads 3D engines when a world is entered.
PRIMARY FILE: `js/ui.js`
RELATED FILES: `js/util.js`, `js/main.js`, `js/data/calendar.js`
PUBLIC ENTRY POINTS / KEY SYMBOLS: `showScreen`, `loadScriptOnce`, `loadAdv3d`, `enterAdventure3D`, `enterHeli3D`, `enterDrive3D`, `enterPetShopping3D`, `enterMoto3D`, `enterF1_3D`, `enterInvasion3D`
DEPENDENCIES: `state`, ticket/health rules, `THREE`, world globals.
NOTES: Inspect only the relevant loader/entry zone in `ui.js`.

## 3D engine, scenes, worlds, and buildings

SYSTEM: Vocab City scene
PURPOSE: Procedurally builds the overview city, buildings, actors, camera rig, touch gestures, building selection, and city presence/chat.
PRIMARY FILE: `js/city3d.js`
RELATED FILES: `index.html`, `js/data/firebase-config.js`, `js/data/badwords.js`
PUBLIC ENTRY POINTS / KEY SYMBOLS: `boot`, `buildCity`, `BUILDINGS`, `setupInput`, `actBuilding`, `liveStart`, `window.CITY`
DEPENDENCIES: `THREE`, optional Firebase SDK, session/local storage.
NOTES: This is an orbit/pan city map, not the first-person player controller.

SYSTEM: Shared Adventure3D engine
PURPOSE: Owns the renderer/camera/loop and gameplay for adventure, hotel/haunt, helicopter, drone, drive, soccer, and mecha modes.
PRIMARY FILE: `js/adventure3d.js`
RELATED FILES: `js/adv3d_css.js`, `js/adv3d_intro.js`, `js/adv3d_tex.js`, `js/hotel3d.js`, `js/data/city_kpp.js`, `js/netroom.js`
PUBLIC ENTRY POINTS / KEY SYMBOLS: `window.Adventure3D`, `start`, `exitWorld`, `buildScene`, `loop`, `bindInput`, `movePlayer`, `tickPlayer`
DEPENDENCIES: `THREE`, state/UI globals, `NetRoom`, optional `GLTFLoader`, world data.
NOTES: Very large multi-mode file. Route through the mode banners and symbol index; never read it wholesale.

SYSTEM: Hotel building and interior
PURPOSE: Builds the five-floor haunted hotel geometry, rooms, stairs/lift, lights, floor visibility, surfaces, and solid collision data.
PRIMARY FILE: `js/hotel3d.js`
RELATED FILES: `js/adventure3d.js`, `handoff/PROMPTS_HOTEL.md`, hotel image/audio assets
PUBLIC ENTRY POINTS / KEY SYMBOLS: `window.HOTEL3D`, `build`, `surfaceY`, `collide`, `setLights`, `tick`, `roomAt`
DEPENDENCIES: `THREE`; Adventure3D supplies renderer, player, ghosts, quests, and HUD.
NOTES: Building ownership is here; hotel gameplay ownership remains in the `haunt` zones of `adventure3d.js`.

SYSTEM: Drive city environment
PURPOSE: Defines real-world KPP road/building/map data consumed by the drive mode.
PRIMARY FILE: `js/data/city_kpp.js`
RELATED FILES: `js/adventure3d.js`, `js/ui.js`
PUBLIC ENTRY POINTS / KEY SYMBOLS: `window.KPP_CITY`, `buildDriveCity`, drive grid/GPS symbols in Adventure3D
DEPENDENCIES: Adventure3D.
NOTES: Procedural rendering/collision/navigation are built from this data inside `adventure3d.js`.

SYSTEM: Pet pantry and shopping trip
PURPOSE: Replaces instant feeding/clothing purchases with shelf inventory and a short first-person driving trip to dedicated food/fashion stores.
PRIMARY FILE: `js/petshopping3d.js`
RELATED FILES: `js/petpantry.js`, `js/data/petshopping.js`, `js/state.js`, `js/ui.js`, `css/petpantry.css`, `css/petshopping3d.css`, `img/pet-shopping/`, `js/music.js`
PUBLIC ENTRY POINTS / KEY SYMBOLS: `window.PetShopping3D`, `start`, `exit`, `window.PetPantry`, `ensureState`, `buyShelf`, `buyFood`, `take`, `openPantry`, `openStore`, `enterPetShopping3D`
DEPENDENCIES: `THREE`, shared pet/economy state, `FOODS`, `ITEMS`, `Music`, local/cloud save.
NOTES: `petshopping3d.js` is lazy-loaded. Food stock is consumable and excluded from net worth; the shelf is a permanent asset. Players without a car rent `car_01` per trip without acquiring it.

SYSTEM: Vocab Arena
PURPOSE: Lightweight combat-first vocabulary world with player/pet/bots, co-op boss state, pickups, HUD, and its own renderer lifecycle.
PRIMARY FILE: `js/arena3d.js`
RELATED FILES: `css/arena3d.css`, `js/ui.js`, `js/state.js`
PUBLIC ENTRY POINTS / KEY SYMBOLS: `window.VocabArena3D`, `start`, `stop`, `loop`, `updatePlayer`, `startBoss`
DEPENDENCIES: `THREE`, shared state/progression, optional online state.
NOTES: Intentionally loads without the large Adventure3D engine for the normal adventure entry.

SYSTEM: Invasion world
PURPOSE: Large FPS/vehicle world: terrain, town, NPC squads/fighters, weapons, mothership, aircraft, missions, networking, and LOD.
PRIMARY FILE: `js/invasion3d.js`
RELATED FILES: `js/ui.js`, `js/netroom.js`, invasion GLB/texture/audio assets
PUBLIC ENTRY POINTS / KEY SYMBOLS: `window.InvasionWorld`, `start`, `exitWorld`, `build`, `bindInput`, `tickPlayer`, `startWave`
DEPENDENCIES: `THREE`, `GLTFLoader`, state/UI globals, `NetRoom`.
NOTES: Very large standalone engine; use banner zones/CODE_MAP.

SYSTEM: Motorcycle/car world
PURPOSE: Standalone road-driving engine, scenery, vehicle physics, collectibles, NPC/peer rendering, and controls.
PRIMARY FILE: `js/moto3d.js`
RELATED FILES: `js/data/moto_phosawat.js`, `js/ui.js`, `js/netroom.js`
PUBLIC ENTRY POINTS / KEY SYMBOLS: `window.MotoWorld`, `start`, `exitWorld`, `tick`, `buildScenery`, `roadInfo`
DEPENDENCIES: `THREE`, optional `GLTFLoader`, state/UI globals, `NetRoom`.
NOTES: Supports motorcycle and car options through the same engine.

SYSTEM: F1 world
PURPOSE: Standalone Bahrain circuit engine with track grid, car physics, laps, DRS, pits, rivals, vocabulary pickups, and HUD.
PRIMARY FILE: `js/f1_3d.js`
RELATED FILES: `js/data/f1_bahrain.js`, `js/ui.js`, F1 assets
PUBLIC ENTRY POINTS / KEY SYMBOLS: `window.F1World`, `start`, `exitWorld`, `tick`, `surfAt`, `nearIdx`
DEPENDENCIES: `THREE`, `GLTFLoader`, state/UI globals.
NOTES: Track lookup uses a spatial grid rather than a general physics library.

SYSTEM: 3D shooting minigame
PURPOSE: First-person carnival vocabulary target game with an isolated scene, controls, scoring, and HUD.
PRIMARY FILE: `js/shootword.js`
RELATED FILES: `js/ui.js`, `js/state.js`, leaderboard/award files
PUBLIC ENTRY POINTS / KEY SYMBOLS: `window.ShootWord`, `open`, `close`, `buildScene`, `bindInput`, `loop`
DEPENDENCIES: Lazily loaded `THREE`, shared state/UI/audio.
NOTES: Separate from Invasion combat.

SYSTEM: Letter Cannon vocabulary minigame
PURPOSE: Endless, penalty-free spelling practice by shooting falling letters in word order.
PRIMARY FILE: `js/lettercannon.js`
RELATED FILES: `css/lettercannon.css`, `index_classic.html`, `js/city3d.js`, `js/main.js`
PUBLIC ENTRY POINTS / KEY SYMBOLS: `window.LetterCannon`, `open`, `close`
DEPENDENCIES: `vocabForStudent`, shared state/rewards/audio, Canvas 2D.
NOTES: Canvas 2D gameplay with two-layer PNG turret assets under `assets/images/letter_cannon/`; synthesized SFX and no WebGL lifecycle.

## Player, camera, collision, animation, and NPCs

SYSTEM: Player movement and mobile controls
PURPOSE: Handles keyboard/pointer/touch input and mode-specific player/vehicle movement.
PRIMARY FILE: `js/adventure3d.js`
RELATED FILES: `js/arena3d.js`, `js/invasion3d.js`, `js/moto3d.js`, `js/f1_3d.js`, `js/shootword.js`, `js/city3d.js`
PUBLIC ENTRY POINTS / KEY SYMBOLS: `bindInput`, `movePlayer`, `tickPlayer`, `tickDrive`, `tickHeli`, `tickSoccer`; each standalone engine has its own input/tick zone
DEPENDENCIES: Camera, collision data, DOM control overlay, current mode.
NOTES: There is no universal controller. Identify the destination world before editing movement or touch behavior.

SYSTEM: Camera systems
PURPOSE: Provides city orbit/pan, first-person, chase/vehicle, cockpit, arena follow, and special replay/mirror cameras.
PRIMARY FILE: `js/adventure3d.js`
RELATED FILES: All 3D engine files, especially `js/city3d.js`
PUBLIC ENTRY POINTS / KEY SYMBOLS: city `rig`; Adventure3D `camera`, `soccerCamera`, `mirrorPass`; standalone camera setup/tick zones
DEPENDENCIES: Player/vehicle transforms and viewport sizing.
NOTES: Camera ownership is per engine/mode; do not create a cross-engine camera abstraction for a local fix.

SYSTEM: Collision and navigation
PURPOSE: Performs cheap custom world collision, surface lookup, projectile hit tests, road classification, and GPS pathfinding.
PRIMARY FILE: `js/adventure3d.js`
RELATED FILES: `js/hotel3d.js`, `js/invasion3d.js`, `js/moto3d.js`, `js/f1_3d.js`
PUBLIC ENTRY POINTS / KEY SYMBOLS: `collideDrone`, `collideCar`, `routeGrid`, `HOTEL3D.collide`, `HOTEL3D.surfaceY`, Invasion `gridBlocked`/ray tests, F1 `surfAt`/`nearIdx`
DEPENDENCIES: World-specific grids, solid boxes, footprints, and mode state.
NOTES: No external physics engine. Preserve the data representation used by the target world.

SYSTEM: Character and pet animation
PURPOSE: Runs GLB idle animation in the lobby and sprite/video state-machine animation for pet behavior.
PRIMARY FILE: `js/lobby3d.js`
RELATED FILES: `js/petbehavior.js`, `js/images.js`, `js/ui.js`, `css/lobby.css`
PUBLIC ENTRY POINTS / KEY SYMBOLS: `Lobby3D.attach`, `AnimationMixer`, `cloneSkinned`, `window.PetBehavior`, `petAnimHTML`, `currentPetImg`
DEPENDENCIES: GLB clips, baked sprite sheets, video/image fallbacks, pet state.
NOTES: The lobby intentionally prefers baked CSS `steps()` sprites in many 2D contexts to avoid live Three.js cost.

SYSTEM: NPCs and multiplayer actors
PURPOSE: Owns AI enemies/allies/ghosts and renders nearby online players with bounded cost.
PRIMARY FILE: `js/netroom.js`
RELATED FILES: `js/online.js`, `js/adventure3d.js`, `js/invasion3d.js`, `js/moto3d.js`, `js/f1_3d.js`, `js/city3d.js`
PUBLIC ENTRY POINTS / KEY SYMBOLS: `NetRoom.create`, `NetRoom.drawBudget`, world `tickPeers`/AI tick functions, city `Live.actors`
DEPENDENCIES: Firebase RTDB, world transforms, draw budgets.
NOTES: AI ownership is world-local; NetRoom owns room/presence transport and peer budgeting, not NPC decisions.

## Vocabulary, quests, progression, UI, and save

SYSTEM: Core vocabulary data
PURPOSE: Supplies grade/category vocabulary and shared dictionary content.
PRIMARY FILE: `js/data/vocab.js`
RELATED FILES: `js/data/dict/`, `js/data/dict_band/`, `js/data/band/`, their `manifest.js` files
PUBLIC ENTRY POINTS / KEY SYMBOLS: data globals/manifests consumed by game loaders
DEPENDENCIES: Script order and lazy data loaders.
NOTES: Large datasets are split into chunks; do not inventory or read all chunks for a gameplay change.

SYSTEM: Matching game and quiz
PURPOSE: Runs the core word matching loop, rewards, timed quiz, and result flow.
PRIMARY FILE: `js/game.js`
RELATED FILES: `js/data/vocab.js`, `js/dictband.js`, `js/bandadv.js`, `js/vocabbook.js`, `js/state.js`
PUBLIC ENTRY POINTS / KEY SYMBOLS: `startGame`, `exitGame`, `startQuiz`, `finishQuiz`
DEPENDENCIES: Vocabulary providers, state/rewards, UI helpers.
NOTES: Band loaders feed the same game/quiz engine rather than duplicating gameplay.

SYSTEM: Advanced vocabulary and standardized exams
PURPOSE: Lazy-loads banded dictionaries, advanced categories, and IELTS/TOEIC/TOEFL exam sets.
PRIMARY FILE: `js/dictband.js`
RELATED FILES: `js/bandadv.js`, `js/examstd.js`, `js/data/dict_band/manifest.js`, `js/data/band/manifest.js`, `js/data/exam/manifest.js`
PUBLIC ENTRY POINTS / KEY SYMBOLS: `bandPlayLobby`, `bandExamLobby`, `openExamStdPicker`
DEPENDENCIES: Core game/state/UI.
NOTES: Inspect the requested provider and its manifest, not every data shard.

SYSTEM: Vocabulary book and learning history
PURPOSE: Records encountered/correct/incorrect words and builds personal review quizzes.
PRIMARY FILE: `js/vocabbook.js`
RELATED FILES: `js/state.js`, `js/game.js`, band/exam modules
PUBLIC ENTRY POINTS / KEY SYMBOLS: vocabulary-book record/render/review functions
DEPENDENCIES: `state.vocabBook` and shared quiz UI.
NOTES: Persistent across sessions through central save.

SYSTEM: Daily quests and progression
PURPOSE: Owns durable player/pet/economy fields, deterministic daily quests, rewards, care ticks, ranks, and migrations.
PRIMARY FILE: `js/state.js`
RELATED FILES: `js/ui.js`, `js/game.js`, all world engines that emit progression events
PUBLIC ENTRY POINTS / KEY SYMBOLS: `DEFAULT_STATE`, `loadState`, `saveState`, `dailyTick`, `questsToday`, `questEvent`, `addCoins`
DEPENDENCIES: Static data globals and localStorage.
NOTES: World-specific word missions live in their engine; cross-game daily quest accounting lives here.

SYSTEM: UI and HUD
PURPOSE: Renders dashboard panels, pet/shop/home/rank/friend/quest UI and launches world overlays.
PRIMARY FILE: `js/ui.js`
RELATED FILES: `css/lobby.css`, `css/style.css`, per-feature CSS, per-world inline/HUD code
PUBLIC ENTRY POINTS / KEY SYMBOLS: `renderDashboard`, `renderQuestCard`, panel open/close functions, world entry functions
DEPENDENCIES: State, data, online, images, utilities.
NOTES: `lobby.css` overrides parts of `style.css`; inspect both only when cascade ownership is unclear.

SYSTEM: Local and cloud save
PURPOSE: Maintains the canonical local state, migrations, ownership, Google login, cloud reconciliation, and periodic upload.
PRIMARY FILE: `js/state.js`
RELATED FILES: `js/auth.js`, `js/online.js`, `js/photo.js`, `js/data/firebase-config.js`
PUBLIC ENTRY POINTS / KEY SYMBOLS: `loadState`, `saveState`, `authStart`, `authSyncOnLogin`, `authPushSave`, `authEnterOffline`
DEPENDENCIES: localStorage, Firebase Auth/RTDB.
NOTES: Cloud save stores serialized state plus timestamp. Profile photo is deliberately stored separately from the main save.

SYSTEM: Account privacy and deletion
PURPOSE: Provides the single protected account-deletion entry point, typed confirmation, Google re-authentication, account-linked RTDB cleanup, Auth deletion, and public deletion instructions.
PRIMARY FILE: `js/account-deletion.js`
RELATED FILES: `css/account-deletion.css`, `js/auth.js`, `js/util.js`, `delete-account.html`, `privacy.html`, `handoff/RULES.md`, `tools/test_account_deletion.js`
PUBLIC ENTRY POINTS / KEY SYMBOLS: `accountDeletionOpen`, `accountDeletionHandleRedirectResult`, `AccountDeletion`
DEPENDENCIES: Firebase Authentication/Realtime Database, authenticated online state, Settings UI.
NOTES: Destructive writes start only after typed `DELETE` plus recent Google re-authentication. RTDB cleanup is one multi-location update; Authentication is deleted only after it succeeds. Publishing the matching Firebase Rules is required before shipping.

## Assets, audio, effects, Firebase, and delivery

SYSTEM: Image/video asset resolution
PURPOSE: Probes optional images, selects pet mood/stage/wear assets, and falls back across video/sprite/image representations.
PRIMARY FILE: `js/images.js`
RELATED FILES: `js/ui.js`, `js/petbehavior.js`, `img/`, `clip/`
PUBLIC ENTRY POINTS / KEY SYMBOLS: `probeImages`, `petStateImg`, `petClipUrl`, `currentPetImg`, `wearLayerHTML`
DEPENDENCIES: Pet/item data and browser media support.
NOTES: Missing optional visual assets are expected to fall back gracefully.

SYSTEM: GLB/GLTF loading
PURPOSE: Loads and clones character, vehicle, environment, ghost, and weapon models on demand.
PRIMARY FILE: `js/vendor/GLTFLoader.js`
RELATED FILES: `js/lobby3d.js`, every 3D engine, `img/models/`, model-specific caches
PUBLIC ENTRY POINTS / KEY SYMBOLS: `THREE.GLTFLoader`, `loadScriptOnce`, `cloneSkinned`, engine `*GlbEnsure` functions
DEPENDENCIES: Vendored `js/vendor/three.min.js`.
NOTES: Caches are engine-local. No DRACO/KTX2/Meshopt decoder is configured.

SYSTEM: Audio
PURPOSE: Provides global SFX/music and world-specific engines, ambient loops, vehicle sounds, speech, and positional/peer audio.
PRIMARY FILE: `js/util.js`
RELATED FILES: `js/music.js`, `js/online.js`, `js/adventure3d.js`, `js/invasion3d.js`, `js/moto3d.js`, `js/f1_3d.js`, `sound/`
PUBLIC ENTRY POINTS / KEY SYMBOLS: `sfx`, `Music`, world sound objects, voice/call functions
DEPENDENCIES: Web Audio/HTMLAudio, state sound settings, user gesture policies.
NOTES: For stuck sound bugs, inspect the target world's exit/stop path as well as playback.

SYSTEM: Shaders and visual effects
PURPOSE: Implements lighting, materials, particles, glows, weather, canvas-generated textures, and HUD effects.
PRIMARY FILE: Target 3D engine file
RELATED FILES: `js/adv3d_tex.js`, `js/adv3d_css.js`, per-world CSS/assets
PUBLIC ENTRY POINTS / KEY SYMBOLS: world effect tick/build functions, `CanvasTexture`, standard Three materials
DEPENDENCIES: Renderer and scene lifecycle.
NOTES: Application code currently uses standard Three materials/additive sprites/meshes; no custom ShaderMaterial or post-processing pipeline was found.

SYSTEM: Firebase online services
PURPOSE: Loads Firebase SDK, owns presence, leaderboard, friends, chat, gifts, market/feed/calls, and scalable 3D rooms.
PRIMARY FILE: `js/online.js`
RELATED FILES: `js/auth.js`, `js/netroom.js`, `js/data/firebase-config.js`, `handoff/RULES.md`
PUBLIC ENTRY POINTS / KEY SYMBOLS: `onlineLoadSDK`, `onlineStart`, `Online`, `NetRoom.create`, `NetRoom.drawBudget`
DEPENDENCIES: Firebase Auth/Realtime Database and published security rules.
NOTES: City has a small direct Firebase loader; classic lobby SDK ownership remains in `online.js`/`auth.js`.

SYSTEM: PWA, validation, and deployment
PURPOSE: Builds the Firebase-hosted web game, provides atomic/offline content-addressed caching, version signaling, source checks, staged deployment, the stable Android TWA configuration, and browser harnesses.
PRIMARY FILE: `sw.js`
RELATED FILES: `package.json`, `firebase.json`, `manifest.webmanifest`, `version.json`, `asset-manifest.json` (generated), `js/app-update.js`, `tools/build_web.mjs`, `tools/validate_web_build.mjs`, `tools/deploy_firebase.sh`, `tools/finish_round.sh`, `android-twa/twa-manifest.json`, `COMMIT_DEPLOY.bat`
PUBLIC ENTRY POINTS / KEY SYMBOLS: `npm run build`, `BUILD_ID`, `PRECACHE`, `VW_BUILD_INFO`, launcher workflow
DEPENDENCIES: Service Worker/Cache Storage APIs, Node.js, Git, Firebase CLI; Bubblewrap/JDK/Android SDK only when the native wrapper changes.
NOTES: Deployment archives `git HEAD`, builds `dist/`, validates it, then publishes Firebase Hosting. Normal game releases never rebuild Android. Player data stays in local persistent storage/Firebase and is outside Cache Storage.
