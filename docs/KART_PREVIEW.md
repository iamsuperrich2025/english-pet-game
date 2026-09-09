# Vocab World Kart — public game

Round 1379 opens the former admin preview to all players after fixing visible-wall collision. Reference artwork: the supplied tropical toy-kart poster; procedural Soft Cuboid Chibi 3D car, five colours, square lights, white stripe/star, gold hubs, palms, block cliffs, lighthouse and waterfall. It is a lightweight playable interpretation of the poster.

## Engine and player state

`js/f1_3d.js` exposes `createVocabRacingWorld(profile)` with independent closures. Default F1 keeps its original tuning and recovery. `js/kart3d.js` owns Kart visuals, 110 km/h tuning (+8% DRS), 40 km/h pit, and solid boundaries. Switching stops the previous race/audio/network loop. Unique `f1-*` and `kart-*` DOM ids share original classes/controls.

Kart preserves word pickups, wallet rewards, peer rooms, laps, ghosts, jumps and controls. It has no off-track portal. Records remain `kartTicket/kartDone/kartRecent/kartBest`, preferences `vwKartCarColor/vwKartGhost`, and rooms/rank `wroom/kart`, `winfo/kart`, `kartRank`. Entry also records `kartPlayedV1`. F1 saves and namespace remain separate.

## Public access and invitation

Classic and Home V2 show Kart to ordinary users, with no admin badge. Public solo entry follows Racing and does not call a server admission endpoint. `canAccessKartBeta()` is retained as a true-returning compatibility alias for old callers. `js/kart-access.js` is a legacy module no longer loaded by new entry code. RTDB requires authentication for rooms/ranks, UID ownership for writes, original data validation and improving lap records. `kartAccess` is readable by authenticated users for old clients; client writes remain denied. Legacy `world/kart` stays closed because Kart uses modern rooms only. Other world restrictions remain unchanged.

`js/onetpromo.js` and `css/onetpromo.css` provide a cute once-per-player Kart invitation. A UID-scoped local marker and `state.kartPromoSeenV1` persist only when it is shown. It skips players with prior Kart entry, words/recent words, or best lap. It waits for existing dialogs/financial notices, defers while a race is open, fits four tested viewport sizes, and routes its CTA through the normal free-entry confirmation. It uses the same cached car artwork as the lobby.

## Scenery and solid walls

Scenery footprints are checked against all main-road and pit segments, preventing decorations outside one bend from blocking another. All parts of a cliff are rejected together and the lighthouse island moves outward until clear.

Round 1378's road-corridor union could allow crossing a visible wall where nearby track/pit corridors overlap. Round 1379 draws and collides against one shared list of 1,286 continuous wall segments, with open track/pit joins. Swept capsule intersection covers each segment and both end caps; a 32 m spatial grid keeps per-frame searches local. Vehicle-size margin and 48% normal restitution stop tunnelling and reflect impact velocity. Corridor recovery remains a fallback beyond the outer scene. The actual visible walls are the primary contact boundary.

Lobby toasts and close-all are hidden while Kart is open and restored on exit without deleting transaction notices.

## Downloads and rendering

Car/track geometry and materials are shared and batched, road grain is generated locally, and the existing mobile resolution governor remains enabled. No extra race image/model/audio files. Music shares Racing's immutable cached URL; Kart motor is synthesized. Lobby/invitation artwork is the same 96x96 transparent WebP (10,534 bytes vs AVIF lossless14,602); visible pixels and alpha verified. Lazy modules and icon use content-hashed paths. Public entry removes the old per-entry admission request. No new per-frame network requests; NetRoom cadence remains160ms.

## Tests

- `node tools/kart/walls.mjs`:12,404 crossing checks (4,957 fast oblique cases) against all1,286 visible walls, both sides, no failures. A legacy profile without `boundaryWalls` reproduces the old gap.
- `node tools/kart/clearance.mjs`:2,025 Three.js driving-segment raycasts,92 scenery footprint groups,146 boundary sweeps, actual bounce/no-portal and F1's original portal, toast lifecycle.
- `node tools/kart/invite.mjs`:24 checks covering once/account/reload/synced marker/previous player/deferred dialogs/native free entry;812x375,667x320,1318x615,390x844. Fixture suppresses unrelated first-login Dragon/Daily Box notices only.
- `node tools/kart/lobby.mjs`:13 public lobby/icon checks across ordinary, unverified and admin identities; same decoded icon, no admin tag, native entry.
- `node tools/test_kart_entry.js`:28 public/offline entry/guard/save-isolation checks. `node tools/kart/browser.mjs`:29 full gameplay checks (five colours, touch,109.91 km/h, coast/brake,CAT66coins,F1 saves,switching,offline public play).
- `KART_PEERS=1 node tools/kart/rules.mjs`:45 exact affected-zone RTDB emulator checks and7 two-ordinary-browser NetRoom checks. The existing emulator has a serialization bug in an unrelated whitespace regex; production rules remain untouched outside the scoped Kart changes.
- Existing19 F1 regression programs, HomeV2 and build validator must pass before shipping.

Browser tests use bundled Playwright/Sharp on this workstation and local ports17476-17481. `KART_ROOT` selects source or dist; `KART_OUTPUT` selects scratch output. No test writes production data. Mobile coverage is viewport/touch simulation, not hardware FPS measurement. Tools/test artifacts stay excluded from Hosting.
