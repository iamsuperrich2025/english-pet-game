# Arena Field — rounds 1380–1381

The admin-only Adventure entry loads `js/arena-field-visuals.js` and `js/arena-elements.js` before `js/arena3d.js`. The main engine still owns combat, words, rewards, co-op/boss state and lifecycle. The visual module owns compact articulated heroes, original procedural houses, merged static scenery, and bounded spell pools. `css/arena3d.css` owns its landscape HUD.

Controls: WASD/arrows or left joystick to move; hold the attack button or Space for repeated attacks; 1/2 for the equipped elements, 3 for Wordstorm, E for the elemental library; H or the house button to walk home. Manual steering interrupts the return route.

Pick up up to six letters, then walk within 3.3 world units of your own house to bank them. Only banked letters complete words, with repeated letters consumed individually. `state.arenaHome={letters,cargo}` uses the existing account save; both bank and carried letters survive exit/reload. Downing drops carried letters on the field, while banked letters remain safe. A-Z counts are sanitized and capped at 999; ground drops expire after 45 seconds. The home ring offers recovery and blocks incoming damage. Rewards retain the original Arena calculations, not Frontline's economy.

Co-op retains the existing `adv` room, A2 payload, chapter bosses and revive system. Self and peers use the same articulated hero; each member sees their personal home and peer homes at deterministic party slots. Houses may move to another slot when the sorted membership changes. This is co-op PvE, not a new competitive Frontline server. No Firebase paths, Rules, or callable changes were made.

Battle visual cost: no new raster/model/audio downloads in the battle renderer; the selection screen separately loads generated portraits. Avatar animation, scenery and house art are procedural; effects reuse 640 points + 48 effect meshes (256 + 28 on low-power mode). Floating combat text uses at most 32 projected DOM labels, with no per-hit texture upload. HP bars and current/max numbers are projected above the player, enemies, bosses and peers. Static scenery is merged once before dynamic actors are created. DPR stays capped at 1.45, antialias/shadows remain off. Timers, input captures, GPU resources and audio are cleared on exit.

Validation: `node tools/test_arena_field.cjs` runs real Edge/Playwright with an isolated fake account/save and no production writes. It covers admin entry denial, cargo capacity, banking distance, repeated letters, reward idempotency, reload, downing, keyboard/touch, mobile layout/shop/intro, peer/boss lifecycle and reentry. `VW_ARENA_SOURCE=dist` selects a built source root; `VW_ARENA_OUTPUT` chooses the report/WebP directory. A local eight-enemy comparison at 812x375 measured old/new ultimate peak draw calls 402/138; idle 127/136, peak triangles 10,394/17,062. These are desktop-browser scene-cost samples, not physical-phone FPS claims. Real-account co-op was not exercised.


## Elemental library (round 1381)

Ten choices fit on one landscape panel; two distinct slots persist in `state.arenaLoadout` (defaults fire/wind). Selecting an already equipped skill swaps slots, and cooldowns stay attached to the skill ID. The picker pauses local combat and blocks skill keys until closed.

- Fire: a 6.2-unit burning field, six damage ticks over three seconds.
- Wind: a moving tornado pulls nearby enemies and damages them for four seconds; Storm expands its range.
- Ice: nearby damage plus a four-second slow.
- Meteor: three telegraphed impacts, 0.5 seconds apart, each 0.65 seconds after its warning.
- Earth: radial damage, knockback and a brief slow; bosses resist displacement.
- Gravity: three seconds of pull/damage, followed by a final collapse.
- Water: a traveling wave; each target takes damage once and is pushed away.
- Light: restore up to 30 HP and add up to 20 shield, bounded by the existing/temporary shield capacity.
- Existing Arc and Nova remain available; Wordstorm remains the fixed ultimate.

`ArenaElements.create()` owns the bounded gameplay zones (maximum 12) and does not own rewards or network writes. The visual module reuses the existing 640/48 or 256/28 pools with procedural flame/crystal/ribbon/wave/orb geometry. Damage to the player produces red floating text, shields use cyan, enemy damage keeps the original damage colors, and healing uses green. Labels rise and fade over 1.15 seconds and are removed on expiry or exit. Pets remain non-targetable companions, with no invented health system.

Tests: `node tools/test_arena_elements.cjs` validates the eight actual combat behaviors, slot persistence/cooldowns, numeric overhead HP, floating-text motion/fade/removal, ten-card layout at 667x320/812x375/1366x768, keyboard use, combined budgets and cleanup. Fixtures are isolated and do not write production saves. Screenshot cost samples of the individual spells were 118–136 calls and 18–22k triangles at 812x375 on desktop Edge; no physical-phone FPS claim.


## Character selection and live portraits (round 1381)

The normal admin entry in `js/ui.js` loads `css/arena-heroes.css`, `js/arena-elements.js`, `js/arena-portrait.js` and `js/arena-heroes.js`. A modal selection screen appears before battle starts. Three.js and the remaining battle scripts preload while the user reads; battle simulation, rewards and network room start only after confirmation. Cancel leaves the prior selection/save intact; failed preload can retry. This preloads scripts, not an already running scene.

Eight generated full-body heroes (male: fire/wind/ice/light; female: earth/meteor/gravity/water) have distinct starter pairs. Confirmation stores `state.arenaHero` and resets `state.arenaLoadout` to that pair. Signature element cooldown is multiplied by 0.8 in actual gameplay and displayed consistently in selection, spell library and cooldown rings. All heroes have 100 HP. The in-battle actor remains tiny procedural geometry, using hero armor/hair colors and a small cape/hair silhouette; peer actors retain the compatible existing appearance and A2 protocol.

`img/arena-heroes/` contains only WebP: eight 768x1152 alpha portraits and eight 160x240 thumbnails. Generated source PNGs stay outside the repo. `docs/ARENA_HERO_ASSETS.json` records prompts, sources, codec comparisons, alpha and bytes. Thumbnails load together; full images load as selected. One selected portrait owns one lightweight WebGL shader and an 18-particle canvas overlay capped at 30 FPS, DPR 1.5 and 768x1152. Per-hero masks displace hair/cape/magic while protecting the face and leaving feet anchored. No video or animation frame atlas downloads. Hidden tab, reduced-motion preference and the motion button stop animation; cancellation/entry releases textures, context, observer and listeners. If WebGL is unavailable, the full-body still remains visible.

`node tools/test_arena_heroes.cjs` exercises the actual entry function with isolated loader/account fixtures, all eight decoded images, 4/4 gender split, responsive layouts (1366x768,812x375,667x320,390x844), pixel differences proving hair/cape/fire animate while face/boots remain still, reduced motion, selection-to-game powers and cooldown, persistence, cancellation, preload retry/late resolution, and disposal. No production account writes. Set `VW_ARENA_CAPTURE=1` to export temporary preview frames.
