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

SYSTEM: Robot market showroom artwork
PURPOSE: Show ten reference-matched chibi robot portraits in the market with a shared illustrated display room.
PRIMARY FILE: `js/ui.js` (`robotShopImg`, `renderRobotShop`, `rsShowBig`, `rsInit`)
RELATED FILES: `css/lobby.css` (`.rs-chibi`), `img/robots/chibi-market/manifest.json`, `img/robots/chibi-market/`
DEPENDENCIES: Existing ROBOTS catalog, buyRobot flow and strip controls; no new gameplay/network state.
NOTES: Separate 720px-height WebP portraits and 240px-height lazy thumbnails; opaque AVIF backdrop. Direct market paths bypass old PNG probing. robotImg retains existing resolved images with a lightweight chibi thumbnail fallback for owned-robot selection. Does not change GLBs or cockpit assets. Scoped two-column landscape layout, stacked portrait, aria-pressed selection; no animated texture masks.

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

SYSTEM: Mecha selected online robot models
PURPOSE: Render each remote player as the chibi GLB matching their selected robot, preserving first-person cockpit controls.
PRIMARY FILE: `js/mecha-models.js`, `js/mecha-combat-fx.js`
RELATED FILES: `js/adventure3d.js`, `js/ui.js`, `img/models/mecha/`, `tools/mecha/build_robots.py`, `tools/mecha/preview.html`, `tools/mecha/test_models.cjs`, `tools/mecha/test_fx.cjs`, `tools/mecha/fx-preview.html`
PUBLIC ENTRY POINTS / KEY SYMBOLS: `MechaModels.prepare/attach/fromAvatar/avatar/resolveSelection`, `makeMechaPeer`, `mechaRobotId`
DEPENDENCIES: THREE, lazy GLTFLoader, existing NetRoom m_01..m_10 avatar payload; no new network fields/rules.
NOTES: Ten original texture-free Soft Cuboid Chibi GLBs with Idle/Walk/Attack clips, forward -Z, feet y=0, height 4.61m. Each cached template shares geometry/materials across peers; four cloned pivots use existing distance-driven walking. Disposed/replaced peers ignore late loads; failures retain the old colored fallback and can retry on re-entry. Mecha's own view remains the selected cockpit. GLBs keep portable PBR; MechaModels bridges their colors to the engine's existing linear-output Phong pipeline. MechaCombatFX owns ten cosmetic projectile/muzzle/impact styles: six instanced batches, max 12 active shots; no new network fields, rewards, cadence or heat changes. FX are local to the shooter, and disposed on exit. Preview: tools/mecha/preview.html and fx-preview.html.

SYSTEM: Hotel building and interior
PURPOSE: Builds the five-floor haunted hotel geometry, rooms, stairs/lift, lights, floor visibility, surfaces, and solid collision data.
PRIMARY FILE: `js/hotel3d.js`
RELATED FILES: `js/adventure3d.js`, `handoff/PROMPTS_HOTEL.md`, hotel image/audio assets
PUBLIC ENTRY POINTS / KEY SYMBOLS: `window.HOTEL3D`, `build`, `surfaceY`, `collide`, `setLights`, `tick`, `roomAt`
DEPENDENCIES: `THREE`; Adventure3D supplies renderer, player, ghosts, quests, and HUD.
NOTES: Building ownership is here; hotel gameplay ownership remains in the `haunt` zones of `adventure3d.js`. Completing the shared five-word hunt announces to everyone in the hotel and immediately starts the next word set with fresh letters (`HauntedHotelRuntime.startNextMission`). The solo 10,000-coin mission still pays once; that winner is broadcast to peers. Active-word letters are refilled if any required ordinal is missing.

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
PURPOSE: Shared four-player word race with private destructible 5,000 HP homes, carry-one A–Z pickups, winner-only 1,000 coins, combat and its own renderer lifecycle.
PRIMARY FILE: `js/arena3d.js`
RACE OWNERS: `js/arena-race.js`, `functions/arena-race.js`, callable `arenaRaceV1`; wallet receipts in `functions/frontline-wallet.js` and `js/auth.js`. Rules and tests: `docs/ARENA_RACE.md`, `functions/test_arena_race.js`, `tools/test_arena_race.cjs`.
RELATED FILES: `js/arena-strip.js`, `js/arena-audio.js`, `sound/arena/`, `SOUND_LICENSES.md`, `tools/test_arena_music.cjs`, `tools/test_arena_music_entry.cjs`, `js/arena-heroes.js`, `js/arena-portrait.js`, `js/arena-maps.js`, `js/arena-elements.js`, `js/arena-field-visuals.js`, `js/arena-spell-catalog.js`, `js/arena-spell-engine.js`, `js/arena-spells/`, `js/arena-grimoire.js`, `js/arena-relics.js`, `js/netroom.js`, `css/arena3d.css`, `css/arena-heroes.css`, `js/ui.js`, `js/home-v2.js`, `img/arena-heroes/`, `img/arena-maps/`, `img/arena-icons/`, `docs/ARENA_FIELD.md`, `docs/ARENA_GROUND_ASSETS.json`, `tools/test_arena_maps.cjs`, `tools/test_arena_grimoire.cjs`, `tools/test_arena_fire.cjs`
PUBLIC ENTRY POINTS / KEY SYMBOLS: `window.VocabArena3D`, `start`, `stop`, `loop`, `cameraTick`, `updatePlayer`, `startBoss`; `ArenaMaps.prepare/scenery`
DEPENDENCIES: `THREE`, shared state/progression, optional online state.
NOTES: ArenaStrip.bind owns native touch scrolling, mouse drag/click suppression and keyboard strip navigation for the hero roster, searchable 60-spell grimoire and 50-relic inventory; load before those views. CSS controls responsive rows and card widths; filters reset scroll, purchases/equip preserve position. ArenaAudio owns background music plus the user-approved 1.mp3 MEGA activation, 2.mp3 elemental cast, 3.mp3 shield impact, 4.mp3 healing, 5.mp3 lightning and 6.mp3 fire clips (earlier SFX remain removed). User-supplied looping song uses one compressed Blob/media element, Opus with MP3 capability fallback, lazy first-gesture loading, existing persistent content-hash cache, shared master sound and independent arenaMusicOff settings, and immediate background/exit cleanup. Music defaults on and inherits the entry gesture regardless of lobby musicOff. #va-music-toggle is an optional accessible switch (tap or slide); ArenaAudio.toggleMusic changes only state.arenaMusicOff, default false in js/state.js. Any game touch retries blocked playback/downloads; no separate enable tap is required. MEGA quietly preloads at five crystals and plays once on successful activation through a reusable cached media element. Element/shield/heal/lightning/fire silently cache after the first gesture and play only on successful casts/absorbed damage; each cue reuses one player with a 250 ms retrigger guard (heal: 1.8 s, actual HP recovery only). ARC and all extended arc-family spells use only the lightning cue instead of the generic element cue. Fire and its five extended spells use the user fire clip with silent padding removed via lossless packet copy (224,906B). Original following 48° perspective camera in arena3d.js; arena-maps.js owns generated world-ground textures and instanced perimeter depth. Public Arena entry (no admin/tester/adult-pet gate); home card uses existing fire hero + crystal thumbnails with explicit cover dimensions. Three selectable illustrated maps, four players/map, five groups in adv r21–r35. Sixty spells (50 lazy recipe extensions), 50 relics, permanent 3,000–5,000 coin ownership in state.arenaItems; admins use all free. Ordinary starter shot/light. Session-earned wallet counter, pooled VFX and home banking. See `docs/ARENA_FIELD.md`.

SYSTEM: Vocab Sky Playground
PURPOSE: Bright fantasy social plaza with shared Letter Hunt, Word Race, timed Sky Obby, six-floor Vocabulary Tower, rotating Daily Sky Missions, badges, checkpoints, vocabulary rewards, pets, and up to six nearby players.
PRIMARY FILE: `js/skyplay3d.js`
RELATED FILES: `css/skyplay3d.css`, `js/ui.js`, `js/netroom.js`, `js/state.js`, `handoff/RULES.md`
PUBLIC ENTRY POINTS / KEY SYMBOLS: `window.SkyPlayground3D`, `start`, `stop`, `enterSkyPlayground3D`
DEPENDENCIES: `THREE`, shared state/vocabulary/audio helpers, `NetRoom`, active Lobby pet.
NOTES: Standalone lazy-loaded engine registered through `WORLD3D`; map key `sky`, room cap 6. Phase 3 standings/live join reuse the existing compact NetRoom `hp` payload; reward claims and active-run resume live in the existing save, with no new Firebase path. It does not alter original Adventure or Invasion character/controller paths.

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

SYSTEM: Vocab World Kart
PURPOSE: Public tropical toy-kart game with solid walls, a once-only new-player invitation, and separate rooms/records.
PRIMARY FILE: `js/kart3d.js`
RELATED FILES: `js/kart-access.js`, `js/f1_3d.js`, `js/auth.js`, `js/ui.js`, `js/home-v2.js`, `js/netroom.js`, `handoff/RULES.md`, `docs/KART_PREVIEW.md`
PUBLIC ENTRY POINTS / KEY SYMBOLS: `enterKart3D`, `KartWorld`, `KartProfile`, `collideBoundary`, `kartPromoMaybeShow`, `createVocabRacingWorld`
DEPENDENCIES: Shared Three.js/Racing engine/vocabulary/economy/NetRoom. Lazy content-hashed modules; no new raster runtime assets.
NOTES: Public solo entry; authenticated UID-owned multiplayer/rank writes. Invitation: `js/onetpromo.js` + `css/onetpromo.css`, UID-scoped seen marker. RTDB `kartAccess`, `wroom/kart`, `winfo/kart`, `kartRank`; legacy `world/kart` denied. Saves `kartTicket/kartDone/kartRecent/kartBest`, local `vwKartCarColor/vwKartGhost`; no mixing with F1. Tests: `tools/test_kart_entry.js`, `tools/kart/`.

SYSTEM: 3D shooting minigame
PURPOSE: First-person carnival vocabulary target game with an isolated scene, controls, scoring, and HUD.
PRIMARY FILE: `js/shootword.js`
RELATED FILES: `js/ui.js`, `js/state.js`, leaderboard/award files
PUBLIC ENTRY POINTS / KEY SYMBOLS: `window.ShootWord`, `open`, `close`, `buildScene`, `bindInput`, `loop`
DEPENDENCIES: Lazily loaded `THREE`, shared state/UI/audio.
NOTES: Separate from Invasion combat.

SYSTEM: Letter Cannon vocabulary minigame
PURPOSE: Portrait 9:16 vertical shooter: freely fly a weapon-mounted dragon, spell five words, protect ten hearts from meteors, and survive a two-hit boss wave.
PRIMARY FILE: `js/lettercannon.js`
RELATED FILES: `css/lettercannon.css`, `assets/images/letter_cannon/dragon_gunner_player.webp`, `tools/test_letter_cannon.js`, `index_classic.html`, `js/city3d.js`, `js/main.js`
PUBLIC ENTRY POINTS / KEY SYMBOLS: `window.LetterCannon`, `open`, `close`
DEPENDENCIES: `vocabForStudent`, shared state/rewards/audio, Canvas 2D.
NOTES: Canvas 2D solo gameplay with drag/WASD free flight, animated tail, a procedurally scrolling battlefield, Tracer/Heavy/Piercer rounds, homing missiles, layered ballistic SFX, streak powers, retained coin rewards, touch-only portrait lock/fullscreen lifecycle, and no WebGL lifecycle.

SYSTEM: Frontline 1944 public game and isolated development preview
ADDITIONAL MODULES: `tools/frontline-v1/frontline-lobby.js` (numeric overflow rooms), `frontline-commands.js` (host input reducer), `preview-admission.mjs` (local conditional seat admission), `frontline-effects.js` (pooled toy fireworks), `frontline-audio.js` (synthesized cues plus one hashed looping BGM Blob). Target/Thai data comes from `js/data/vocab.js`, the same source as ShootWord. Inputs use `frontline_v1_dev/<session>/inputs/<room>/<seat>`; only the seat owner writes its mailbox and the elected host writes room simulation state.
PURPOSE: Competitive four-seat word raid with vacant-seat bots, two neutral anti-collusion guards, A-Z ram pickups, private destructible vaults, projectile/PvP combat, timed bombs, and winner-only central coin rewards.
PRIMARY FILE: `tools/frontline-v1/frontline-main.js`
RELATED FILES: `tools/frontline-v1/frontline-{config,input,tank,combat,bombs,letters,bases,words,bots,guards,room,network,economy,shapes,map,scene,ui}.js`, `tools/frontline-v1/assets/tank-cute.glb`, `tools/frontline-v1/build_tank_glb.py`, `frontline.css`, `index.html`, `preview.mjs`, `preview-proxy.mjs`, `database.rules.json`, `README.md`, `js/vendor/GLTFLoader.js`
PUBLIC ENTRY POINTS / KEY SYMBOLS: Public `/frontline/index.html` via `package-production.mjs`; launcher `#fl-lobby` returns to `/index_classic.html`; `makeRenderPose` in `frontline-scene.js`; `muzzlePoint` in `frontline-config.js`; isolated `/__dev/frontline` via `node tools/frontline-v1/preview.mjs`; `window.Frontline`, `admit`, `drive`, `commitFire`, `placeBomb`, `tickLetters`, `creditReward`, `connect`.
DEPENDENCIES: Existing Three.js and shared state/economy; public Auth/callable adapters, or isolated preview RTDB emulator.
NOTES: Source lives under `tools/`; `package-production.mjs` explicitly publishes runtime with live Auth/network/economy adapters. Dev gateways and tests remain excluded. `makeRenderPose` smooths only visual server/bump corrections; normal driving remains immediate, and camera/terrain/tank/labels share the displayed position. Stable HUD/label text avoids repeated writes; projection runs once after camera update. Scroll regressions: `frontline-scroll.test.mjs`, `scroll.browser.test.mjs`. Browsers use one LAN port (19444); mobile clients force HTTP long-poll while desktop may use WebSocket, and the restricted gateway keeps RTDB on loopback 19445. Demo namespace `frontline_v1_dev/<preview-session>/rooms/<CODE>`, four fixed seats with bot substitution plus two non-seat guards. Central `addCoins`/`saveState` is unchanged and uses a preview-only save key. Labels project once per frame after the camera update, and stable label/HUD text is written only when changed. Edge arrows mark the nearest remaining target-word letters that are off-screen, plus the local player's vault. Hit tanks show a floating HP loss over the hull. Tests: `frontline.test.mjs`, `frontline-audio.test.mjs`, `audio.browser.test.mjs`, `browser.test.mjs`, `check-production.mjs`. Hashed Frontline BGM lives under `sound/Frontline/`; the original master is excluded from the web build. No legacy Frontline code reused; production uses server-owned `frontline_v1_live/v1` and the local preview retains its separate namespace.

## Player, camera, collision, animation, and NPCs

SYSTEM: Visible 3D player-character visual standard
PURPOSE: Defines the mandatory Soft Cuboid Chibi 3D style, covered player avatars, acceptance criteria, migration rule, and world exceptions.
PRIMARY FILE: `docs/PLAYER_CHARACTER_STYLE.md`
RELATED FILES: `js/adventure3d.js`, `tools/test_player_character_style.js`, `tools/player_character_style_preview.html`, player/peer builders in each 3D engine, `js/netroom.js`, character asset prompts and model/image assets
PUBLIC ENTRY POINTS / KEY SYMBOLS: `softCuboidGeo`, `makeSoftCuboidChibiFigure`, `makeLegacyAdventureFigure`, `makeSoftChibiWalkPeer`, `makeLegacyAdventureWalkPeer`, `makeSoccerPlayer`, `Adventure3D._t.playerCharacterStyle`
DEPENDENCIES: Target world's existing art direction and the explicit Invasion/Mothership and original Adventure-mode exceptions.
NOTES: Read before creating, replacing, reskinning, or approving any visible 3D player character. P0 Drive/Haunted Hotel/Soccer is conforming; original Adventure remains on an explicit legacy builder.

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
RELATED FILES: `package.json`, `firebase.json`, `manifest.webmanifest`, `version.json`, `asset-manifest.json` (generated), `js/app-update.js`, `tools/build_web.mjs`, `tools/validate_web_build.mjs`, `tools/assetlinks.mjs`, `.well-known/assetlinks.json`, `tools/make_assetlinks.py`, `tools/deploy_firebase.sh`, `tools/finish_round.sh`, `android-twa/twa-manifest.json`, `COMMIT_DEPLOY.bat`
PUBLIC ENTRY POINTS / KEY SYMBOLS: `npm run build`, `BUILD_ID`, `PRECACHE`, `VW_BUILD_INFO`, launcher workflow
DEPENDENCIES: Service Worker/Cache Storage APIs, Node.js, Git, Firebase CLI; Bubblewrap/JDK/Android SDK only when the native wrapper changes.
NOTES: Deployment archives `git HEAD`, builds `dist/`, validates it, then publishes Firebase Hosting. Digital Asset Links source is `.well-known/assetlinks.json`; `tools/assetlinks.mjs` enforces all five recovered certificates before build and byte equality after copy. The generator adds certificates without dropping existing ones. Commit source and guards together because deploy archives HEAD. No proven assetlinks-only deploy exists; do not use the full launcher for that repair. Normal game releases never rebuild Android. Player data stays in local persistent storage/Firebase and is outside Cache Storage.
