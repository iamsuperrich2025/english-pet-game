# Vocab World: Frontline 1944 V1

Fresh implementation from the current repository, with separate local and public adapters. Round 1374 explicitly authorizes the public Lobby button, authenticated server gameplay and main-wallet rewards. `package-production.mjs` selects the public runtime; the preview gateway, emulator, test saves and test tools stay private. No legacy Frontline code or architecture is used.

## Local mobile preview

Run `node tools/frontline-v1/setup.mjs` once, then:

`node tools/frontline-v1/preview.mjs --lan`

Open `http://192.168.1.120:19444/__dev/frontline?room=R1001` on phones connected to the same private LAN. The LAN IP changes with Wi-Fi. Rooms have system-generated numeric labels only, such as R1001; there are no custom room names. A full room sends the next player to the next available number automatically. Browser HTTP, WebSocket, and long-poll traffic stays on port 19444; Android/iPhone clients force HTTP long-poll. `preview-proxy.mjs` forwards only the isolated RTDB protocol to the emulator bound at `127.0.0.1:19445`. Portrait play is blocked; the battlefield fills a landscape viewport. The preview rejects public hostnames and exposes no `/frontline` production route.

## Illustrated local launcher

`frontline-launcher.css` scopes the welcome-page skin to `#launcher`, leaving battlefield controls and rendering styles separate. The generated toy-tank garden and Vocab World / Frontline title form the backdrop; the room number, wallet, join control and live status remain accessible HTML rather than text baked into the illustration. Room numbers still contain exactly four digits, and the existing admission/overflow flow sends a fifth human to the next available room. The welcome page can scroll in portrait; entering the battlefield retains the landscape-only play gate.

The backdrop was generated with the builtin `image_gen` tool and encoded as `assets/launcher-garden.avif` (1,672×940, 180,384 bytes), with `assets/launcher-garden.webp` (1,672×940, 279,948 bytes) as the compatibility fallback. CSS `image-set()` selects a supported format. There is no PNG runtime asset. This artwork belongs only to the launcher; battle rendering gains no additional image loads or WebGL textures.

The local preview serves AVIF with `image/avif` and allows the scoped Frontline CSS filenames alongside the existing explicitly matched assets. These additions stay under `tools/frontline-v1`; they do not add a production route, menu item or shared asset reference. The private-host check, demo-only emulator proxy, isolated save and fresh random multiplayer namespace on every preview start remain in effect.

Public release (round 1374, explicitly authorized by the user): Classic and Home V2 show a left-rail Frontline button to every account. It saves the main game before opening `/frontline/index.html`. `package-production.mjs` packages the new runtime, strips the dev access configuration and substitutes the live Auth/network/economy adapters. The local gateway and its emulator/save remain separate.

Production uses the authenticated `frontlineV1` callable and server-only RTDB namespace `frontline_v1_live/v1/{rooms,claims}`. Existing default-deny rules keep it inaccessible to browser writes. The server accepts bounded drive/attack inputs, computes movement, hits, vaults and winner-only 1,000-coin earnings, and settles into `users/<uid>/save` with a private claim ledger plus a wallet receipt. Room admission still caps humans at four, with bots and overflow. Functions predeploy packages the same pure reducers; production cannot load emulator gateways or the test wallet.

Original synthesized audio uses `frontline-synth.js` (24 transient voices maximum and one reusable noise buffer), `frontline-score.js` (quiet pentatonic garden march), and `frontline-audio.js` (engine, shot, impact, bomb/fuse/explosion, pickup/drop/bank, damage/down/respawn, vault destruction, low HP, new word, connection, control and reward cues). Web Audio starts on user interaction at the device sample rate. Distance/pan mixing reduces remote effects. Mute is remembered, hidden pages suspend audio, and EXIT disposes all nodes/timers. No audio media downloads or third-party music licenses are needed. Production fingerprints these small scripts for immutable caching; the Lobby never loads them.

## V1 game

Four player seats compete to bank every letter of the current target word. Missing humans are replaced by bots, and a joining human replaces one bot. Two neutral guard tanks stay outside the four-seat quota and pressure the current word leader to reduce intentional-loss collusion.

The field always has one persistent source for every A-Z letter. Ram a letter to carry it on the tank, then return it to your own vault. An intact rival vault blocks entry and has 5,000 HP. Destroy it with shells or bombs to enter and steal useful stored letters. A shell hit drops carried cargo; the former carrier cannot immediately pick the same drop back up, while rivals may take it. The first player to bank the complete target earns exactly 1,000 session coins. The HUD shows “รอบนี้” starting at zero; earnings are journaled separately and only credited to the central total, daily and lifetime balances through the existing `addCoins()` / `saveState()` on EXIT or page exit. Reload recovers the journal, and a receipt prevents duplicate settlement. Rejoining starts a new session at zero. The preview includes the shared ranks data required by the unchanged central save loader.

Every tank, including players, seat bots and neutral guards, starts and respawns at 5,000 HP. A small overhead bar tracks each tank: green above 50%, yellow above 25% up to 50%, red at 25% or less. Bars stay above carried letters, hide with destroyed/offscreen tanks, and use CSS without textures or extra synchronized state. Shells are visible moving projectiles and create a local impact burst. PvP damage is enabled; there is no friendly-fire concept because this ruleset is competitive. Shells and bombs have unlimited supply, with intervals of 450 ms and 700 ms. Multiple timed bombs may coexist, deal radial damage, and chain nearby bombs. Expired bombs are reclaimed.

Target words and Thai meanings come from the same `js/data/vocab.js` / `vocabForStudent()` source used by ShootWord; the isolated preview uses elementary vocabulary and 3–8-letter targets. Thai appears in the existing target panel. Only the first completed bank wins each word's 1,000 coins; all players see the winner banner and hear a short synthesized cue. Audio has a mute button and loads no sound files.

Mobile controls are AUTO FORWARD, AUTO REVERSE, LEFT, RIGHT, FIRE, BOMB, DROP, and a live three-position speed slider. Auto forward and reverse are mutually exclusive. Their group is separated from LEFT/RIGHT by 40–72 CSS pixels, depending on screen height. Steering changes hull rotation while forward or reverse motion stays on the hull axis with no strafe. Keyboard: W/S toggle auto movement, A/D or arrows steer, Space fires, B places a bomb, and Q drops the carried card once per press.

The cute tank renderer uses one shared, texture-free `tank-cute.glb` model with soft toy proportions, a friendly face, rounded tracks, and lightweight PBR colors. The mesh rotates continuously through 360 degrees with the physics hull, so steering has no eight-direction sprite snapping. A team-color ring identifies each player without duplicating the model or materials.

The orange DROP button leaves the carried card behind the hull, with safe placement around map edges and intact vaults. Empty/dead/offline/pending players cannot press it. An unneeded-letter hint accounts for duplicate letters already banked. Tall landscape screens place DROP above BOMB; short screens place it beside BOMB to keep all controls accessible. The owner has a 1,250 ms re-pickup lock, while rivals may pick it up immediately. Manual cards remain until collected, separately from forced combat drops. Up to 32 manual cards may be on the field; at capacity the card stays carried and the HUD asks players to collect loose cards first. DROP does not change banks or coins.

Each DROP captures the carried letter and its pickup revision. The elected host acknowledges its sequence exactly once, including rejected requests, so retries, repeated letters, damage, respawn and seat replacement cannot discard a later pickup. Optional validated mailbox/player fields preserve compatibility with already-running test rooms. Only the local emulator rules are updated; production rules stay untouched.

## Open-field movement and visible arena edge

Bushes, grass, flowers, crates, trees and decorative fences are presentation only: forward/reverse travel stays at the selected speed through them. The only movement barriers are the arena bounds and intact rival vaults. The screenshot alone did not establish the cause of the reported stop; inspection found that the terrain previously continued beyond an invisible movement boundary.

The existing ±90-world-unit perimeter is now drawn with toy wooden rails and a sandy edge leading to soft blue water. Decorations remain inside the arena; the map still reuses15 chunks. `frontline-boundary.js` shares cached geometry/materials and adds eight rails plus one instanced draw for120 posts, without assets, collision objects or synchronized state. When an attempted move reaches the actual limit, the HUD shows `EDGE · TURN`; an intact rival vault shows `BASE LOCKED`. Steering and reversing remain available. The central field stays fully traversable.

## Architecture and isolation

Focused browser-global modules divide config, movement, input, combat, bombs, A-Z pickups, vaults, words, bots, neutral guards, networking, room simulation, recycled map chunks, shapes, scene rendering, effects, synthesized audio, UI, and economy integration. The scene repositions 15 procedural chunks around the local tank instead of building the full 180×180 field at once. The toy garden has continuous scalloped dirt lanes, rounded flowering bushes, crates, fences, cube trees and instanced grass/daisies in three draw calls. The battlefield loads no image textures or icon fonts. A single 512px shadow target updates at 10 Hz; effects do not cast shadows or create lights. The HUD uses small inline SVG illustrations and glossy CSS controls. The shared tank GLB is 130,640 bytes, 3,754 vertices and 5,124 triangles.

FIRE launches a visible brass/orange projectile with a muzzle star and puff trail. BOMB places a round toy explosive with a fuse, a dashed warning ring and a countdown. Explosions combine gold ground glow, orange/cream/gray puffs, stars and a few cosmetic debris cubes; scenery is not destructible. Effects reuse 24 projectile slots and 20 burst slots. No particles, shadows or visual effects are synchronized. The orthographic camera looks down at 66.2 degrees with a vertical view of 25 world units on short phones or 31 on larger screens (roughly 35–39% wider than the previous camera). Ultra-wide views cap their horizontal span at 68.4 units. The same 15 chunks are centered on the camera's ground target using nearest-chunk rounding to keep terrain under every screen corner. Flower petals share one merged geometry and use one draw per flower to offset the wider view's rendering cost. HUD/button sizes stay unchanged.

The preview reuses the repository's vendored Three.js and the existing central state/economy implementation. It changes only the preview storage key to `vw.frontline-v1.test.save.v1`, and refuses to serve if that shared state contract changes.

Multiplayer uses only Firebase RTDB compat against the local emulator project `demo-vocab-frontline-v1`, namespace `frontline_v1_dev/<random-preview-session>/rooms/R<4 digits>`. Per-seat inputs live in the sibling `inputs/R<4 digits>/<s0–s3>` namespace, writable only by that seat's owner. Only the elected human host writes simulation state, preventing high-latency clients from racing continuous room transactions. Attacks retain sequence IDs until acknowledged; short pointer taps persist across frames. `preview-admission.mjs` performs conditional demo-emulator admission near the database, reusing `F.admit` and refusing a fifth seat. `frontline-lobby.js` selects overflow rooms. Each preview start creates a new random session path. Production Firebase, authentication, cloud save, presence, leaderboards, and routes are unavailable.

## Validation

The host is elected from ownership-checked input heartbeats with a 2.5-second lease, allowing a live peer to take over from a suspended phone and a lone returning player to revive an expired world. Missing or replaced seats pause controls and trigger automatic re-admission; a bot at the old seat is never treated as the local player. Back/forward cache preserves the session so returning pages can recover.

- `node tools/frontline-v1/frontline.test.mjs`
- `node tools/frontline-v1/frontline-input.test.mjs`
- `node tools/frontline-v1/movement.browser.test.mjs` checks native forward/reverse passage through actual rendered scenery, peer movement, vault blocking and visible edge recovery.
- `node --test tools/frontline-v1/frontline-drop.test.mjs` for one-shot/revision-safe drops, placement, retention, pickup locks and unchanged rewards.
- `node tools/frontline-v1/drop.browser.test.mjs` for native mobile DROP, peer pickup, transport latency and responsive controls.
- `node tools/frontline-v1/weapons.browser.test.mjs` while preview is running, for native mobile quick taps during delayed writes, multiple bombs, effects, and cleanup.
- `node tools/frontline-v1/resume.browser.test.mjs` for expired-room recovery, reclaimed seats, suspended-host handoff, visible FIRE/BOMB outcomes, and separated controls at three landscape sizes.
- `node tools/frontline-v1/health.browser.test.mjs` for 5,000 HP, synchronized bar colors/fill, HP validation, respawn, carried-letter spacing and cleanup.
- `node --test tools/frontline-v1/economy.test.mjs` for journal/receipt recovery, duplicate results, failed writes and shared-wallet settlement.
- `node tools/frontline-v1/session.browser.test.mjs` for multiple word wins, the session HUD, central settlement, re-entry and actual page reloads.
- `node tools/frontline-v1/launcher.browser.test.mjs` for actual AVIF/WebP/CSS delivery, live HTML room controls at four landscape sizes and 375×812 portrait, numeric validation, native join/EXIT, battle control smoke checks and zero production requests.
- `node tools/frontline-v1/visual.browser.test.mjs` for HUD geometry at 1672×941, 1008×566, 812×375 and 667×320, plus native FIRE/BOMB screenshots and render budgets.
- `node tools/frontline-v1/browser.test.mjs` while the preview is running; set `FRONTLINE_PLAYWRIGHT` if Playwright is not locally resolvable.
- `node tools/frontline-v1/check-production.mjs <build-directory>`

The browser suite runs five Chromium clients at 812×375, verifies four-seat capacity and automatic overflow, input ownership, bot replacement, two guards, multi-touch, landscape lock, controls, streamed chunks, projectiles, impact damage, vault shielding, bombs, persistent A-Z pickup, APPLE completion and single-player 1,000-coin payout, Thai meanings, winner visuals/audio, host migration, re-entry with a fresh WebGL canvas, the shared GLB model, and zero production network requests.

## Deferred beyond V1

Public release is authorized and uses the live adapters documented above. Real-device multi-network testing and ongoing abuse monitoring remain follow-up work. Scope, target lock, on-foot play, Titan, multiple tank classes, destructible buildings, a large streamed map service, upgrades and advanced missions remain deferred.

## Solid tank bumpers (round 1375)

`frontline-collision.js` resolves equal-mass hull contact in 0.2-unit movement steps, including bots and guards. Tanks push each other without collision damage, while arena edges and intact rival bases constrain both bodies. Disabled tanks do not block; respawns select clear ground. Production applies the same reducer on the server. Local input mailboxes carry a bump revision so stale pre-impact positions cannot undo a push; the receiving client reconciles its position and plays a soft synthesized bumper sound. Decorative bushes/grass remain passable. No physics engine or extra asset is loaded.

Validation: 9 collision reducer checks plus existing 49 gameplay/input/economy checks; native two-browser public-adapter tests and Android long-poll emulator tests confirm a stationary peer is pushed, minimum separation remains 3.3 units, and FIRE/BOMB still work.
