# Vocab World Kart — private preview

Round 1377. Reference: the supplied Vocab World toy-kart poster. Vehicle treatment: Soft Cuboid Chibi 3D, rounded helmet, square headlights, white racing stripe/star, coloured body/cuffs, chunky tyres and gold hubs. Track: bright dirt circuit, red/white barriers, block cliffs, palm trees, water, lighthouse, clouds and start gantry. Geometry is an interpretation for a playable 3D world, not a pixel-identical still image.

## Ownership and isolation

- `js/f1_3d.js`: one shared engine source; `createVocabRacingWorld(profile)` creates isolated runtime closures. Default `F1World` keeps original tuning and visuals. Unique `f1-*` / `kart-*` DOM ids; existing classes/controls preserved. Switching stops the previous race/audio/network loop.
- `js/kart3d.js`: presentation, half-scale track coordinates (same topology), compact car footprint and tuning. 110 km/h base limit, existing 8% DRS boost, 40 km/h pit limit. Same start lights, lap/ghost, peer collision, jumps, word pickups, rewards and room controls. Kart has no off-track portal; its own solid road/pit corridor sweeps movement and reflects impact velocity.
- `js/kart-access.js`: fresh server read on every entry; no persisted access flag. Failed/offline admission stops before loading heavy code. Active game stops on account replacement/sign-out.
- `Auth.user.emailVerified` + current `isAdmin()` gate both lobbies/direct entry. Saved `adminAccess`, display name and ticket cannot grant access.
- RTDB verified-email rules protect `kartAccess`, `wroom/kart`, `winfo/kart`, `kartRank`; legacy `world/kart` is denied. Rule source remains `handoff/RULES.md`, updated against the exact live snapshot. Only Kart grants changed.
- Saves: `kartTicket`, `kartDone`, `kartRecent`, `kartBest`. Local preferences/ghost: `vwKartCarColor`, `vwKartGhost`. Shared wallet/vocabulary curriculum remain canonical. Private best-lap board preserves the original tester-exclusion behavior.

## Delivery and performance

New modules are lazy and content hashed by `tools/build_web.mjs`. The lobby icon is a 96x96 transparent WebP rendered from the actual car (10,534 bytes, shared URL, lazy loaded only when visible); the race adds no raster/model/audio downloads: selected colours, steering and vehicle bodies share geometry/materials; the garage snapshot uses the existing renderer. Road grain is a tiny locally generated canvas texture. Existing music streams through the same immutable URL/cache as Racing; Kart motor is synthesized rather than downloading another sample. Static scene geometry is batched into spatial chunks. Existing mobile resolution/thermal governor and 160 ms compact NetRoom cadence remain in force; no extra per-frame server calls. Lobby users without admin access do not load the Kart modules. Private friend lookup is filtered by the same current-identity gate.

## Round 1378 fixes

Scenery is accepted only when its full footprint clears every main-road and pit segment, including nearby hairpins. All parts of a cliff are rejected together; the lighthouse island is moved outward until clear. Roadside boundary collisions use a vehicle-size margin, <=0.75 m movement steps and 48% normal restitution. The portal entry guard and caller are Kart-only; Racing retains its previous recovery. Global lobby toast stack and close-all are hidden while Kart is open, restored on exit without deleting financial notices. Both lobby variants use the same car icon.

`node tools/kart/clearance.mjs`: actual Three.js raycasts across 2,025 driving segments; independent full-footprint checks; 146 swept collisions on both sides; real Kart velocity reflection/no portal and real F1 portal preserved; toast lifecycle at 1318x615 and 812x375. `KART_BEFORE` can load the previous Kart profile to reproduce scenery hits and the visible close-all button. `KART_ICON_OUTPUT` renders the car icon and compares WebP/AVIF lossless sizes with exact visible RGB and alpha checks.

## Validation

- `node tools/test_kart_entry.js`: 17 entry/isolation checks, including forged saved adminAccess and server denial before heavy assets.
- `node tools/kart/browser.mjs`: 29 Chrome checks, 5 colours, Android touch, desktop + 812x375, actual physics (109.91 km/h), coasting/braking, 66 coins for CAT (3x2 + 60), F1 records unchanged, game switching, unique DOM ids and identity revocation. Mock save only; no live data.
- `KART_PEERS=1 node tools/kart/rules.mjs`: 45 real RTDB emulator rules checks + 7 real two-browser NetRoom checks (slots, colour sync, namespaces, peer departure). Uses existing `work/frontline-v1-deps` Java/database.jar. The emulator has a serialization bug in an unrelated existing whitespace regex; the tests load the exact affected zones with root permissions, never weaken or rewrite the production rules.
- `node tools/kart/lobby.mjs`: 12 checks against actual Classic/Home V2 shell (including shared decoded icon and no icon download for ordinary players). Fixture dismisses unrelated first-login notices; checks role changes and native click -> shared confirmation -> ticket/start pipeline. External requests blocked.
- Existing 19 F1 test programs, Home V2, free-entry tests, production build and web/PWA/cache/TWA validator required before shipping.

`KART_ROOT` can point browser/lobby checks at `dist`; `KART_OUTPUT` chooses scratch screenshot/report location. Tests use ports 17476-17479, demo namespace only, local fake identities. Bundled Playwright/Sharp dependency paths match this workstation. WebP screenshots are temporary QA artifacts, not game downloads. Test programs stay under production-excluded `tools/`.
