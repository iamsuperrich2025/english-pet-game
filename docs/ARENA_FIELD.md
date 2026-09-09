# Arena Field — current behavior (round 1389)

The Adventure / Vocab Arena entry remains admin-only. `js/home-v2.js` renders its small fantasy-house lobby icon; `js/ui.js` loads the hero picker, map picker, catalogue and battle engine in dependency order. The eight existing animated full-body portraits are preserved. Confirming a hero keeps the owned loadout instead of granting free signature spells.

## Maps and rooms

Choose Sky Citadel, Crystal Hollow or Moonleaf Ruins. The map picker loads three small WebP thumbnails; only the confirmed map loads a 1024×1024 AVIF ground texture, with WebP fallback. Round 1388 restores the original small articulated 3D heroes for both the player and peers, with the original 1.12 model scale and matching overhead label heights. Large portraits remain in character selection and the HUD; battle actors no longer use portrait sprites. Round slimes, collectible letter gems, home rings, HP labels, movement and combat remain dynamic above the illustrated floor. The house is a 213×256 alpha WebP, with no full 3D model.

Round 1389 restores the original following perspective camera: FOV 48°, near/far 0.1/120; aspect >1.8 uses height 33 and trailing offset 20, otherwise height 36 and offset 23. Both look 2.3 units ahead of the player and retain the original eased follow. Entry and resize snap to the correct framing. New overhead terrain art is mapped onto a horizontal world plane, so its visible angle comes from that original camera; it is not a screen-fixed background. The three low-poly instanced perimeter meshes supply actual vertical depth. A shader reflects only the outer 10% terrain strips beyond the image bounds, covering the following camera's view without another image or draw call. Painted centers and diameters are calibrated per map; this does not change the playable field radius.

`ArenaMaps` reserves the existing `adv` room indices r21–r35: five groups of three map rooms, four players per map. A new group becomes available only after all three maps in the preceding group are full. If the chosen map is full while a sibling map has space, the picker offers that space or waits. Current Rules permit **five groups / 60 seats total**; exhaustion is displayed rather than inventing out-of-range rooms. This is not an unlimited-capacity promise. The legacy Adventure range currently ends before r21; revisit this reservation before expanding that engine's room limit.

NetRoom's optional `roomIndices`, `roomPicker`, `roomFmt` and `legacy:false` keep joins, peers and friend navigation in the selected map lane. Existing worlds keep their default behavior. A generation guard discards late admission after exit/map change. Seat contention uses the existing deterministic verification loop: seven simultaneous arrivals settle at four admitted seats; it is eventual admission, not an atomic server reservation. No Firebase Rules, data schema paths or production accounts were changed. Real-account co-op still needs live-user verification.

## Permanent shops and admin entitlement

The elemental catalogue contains **60 spells**: the original ten plus 50 new spells in ten family packs. The relic shop contains **50 permanent items**, retaining the original four IDs. Both use small external SVG atlases, search, categories and pagination. All priced definitions are 3,000–5,000 coins; utility/compact effects cost less than wide, repeated or finishing effects. Exact metadata lives in `js/arena-spell-catalog.js` and `js/arena-relics.js`.

Ordinary accounts start with **basic shot and Light / แสงฟื้นฟู only**; their second slot is empty. Light is the starter exception to purchasing. Bought spells persist as `state.arenaItems['spell_'+id]`; relics retain `state.arenaItems[id]`. Existing genuine purchases remain owned. Hero selection cannot bypass ownership. A spell's script must load successfully before charging; failed loads, late responses after exit, insufficient funds and repeat purchases cannot spend coins. Casting an owned spell is free, subject to its cooldown.

**Admins have all 60 spells and all 50 relic bonuses immediately, with no coin deduction and no fabricated purchased flags.** Entitlement is derived from the existing `isAdmin()` check. Shop cards display ADMIN. Selected spells still load on demand. Basic shot and Light remain the initial equipped controls; admins can equip any spell.

Relic effects include bounded attack/critical/echo bonuses, ten element sigils, cooldowns, healing, armor, recovery, HP/shield, movement, pickup distance, cargo, drop lifetime, ordinary-word reward, pet attacks and revive time. Bonuses compile only on entry/purchase, not each frame. With all current relics: 145 maximum HP, 60 maximum shield and nine carried letters. A2's existing 28-character HP field optionally appends maximum HP; older messages default to 100.

The wallet shows total coins and a separate **รอบนี้ +N** for coins actually earned this play session. Purchases do not alter this earned counter. Map changes preserve it and carried letters; exit/reentry resets earned coins to zero.

## Effects and loading

`ArenaElements` owns the original effects and shared 12-zone gameplay budget. `arena-spell-catalog.js` stores only small metadata, then loads `arena-spell-engine.js` plus the selected family from `js/arena-spells/`. Fifty recipes use 13 actual attack patterns with different trajectories, timing, collision, pull/push/slow/heal behavior. `arena-field-visuals.js` reuses 640 particles / 48 meshes (low-power 256 / 28) and creates the procedural moving flame shader on first fire use. No video or spell image sequences are downloaded.

Both inventories pause local combat and redundant scene rendering while preserving room activity. DPR remains capped at 1.45; shadows/antialias remain off. Map changes and exit release renderer resources. See `docs/PERFORMANCE.md` and `docs/ARENA_GROUND_ASSETS.json` for current asset and measurement details; `docs/ARENA_MAP_ASSETS.json` records the superseded round-1387 plates and retained home art.

## Validation

- `tools/test_arena_maps.cjs`: original camera height/FOV/projection and following movement on three landscape viewports, world-bound ground, edge-view screenshots, room grouping, lane isolation, full-room races, admin guard, responsive layouts, selected-only image downloads, fallback, movement, MEGA counter, map-change cleanup, letters and session coins.
- `tools/test_arena_grimoire.cjs`: all 50 recipes and 13 patterns, lazy loading/retry, both permanent shops, prices, real bonuses, saved ownership reload, free admin access, inventory layout/render pause and GPU caps.
- Existing field/crystal/hero harnesses retain combat, banking, MEGA five-use behavior, animated portraits and cleanup coverage. Fixtures use isolated saves and fake networking; no production account writes.

## Historical implementation notes (rounds 1380–1384)

The following records describe their original rounds. Where they differ (procedural map art, free starter pairs, ten spells, six-letter maximum), the current behavior above takes precedence.


The admin-only Adventure entry loads `js/arena-field-visuals.js` and `js/arena-elements.js` before `js/arena3d.js`. The main engine still owns combat, words, rewards, co-op/boss state and lifecycle. The visual module owns compact articulated heroes, original procedural houses, merged static scenery, and bounded spell pools. `css/arena3d.css` owns its landscape HUD.

Controls: WASD/arrows or left joystick to move; hold the attack button or Space for repeated attacks; 1/2 for the equipped elements, 3 for elemental MEGA, E for the elemental library; H or the house button to walk home. Manual steering interrupts the return route.

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
- Existing Arc and Nova remain available; elemental MEGA is the fixed ultimate (see round 1384 below).

`ArenaElements.create()` owns the bounded gameplay zones (maximum 12) and does not own rewards or network writes. The visual module reuses the existing 640/48 or 256/28 pools with procedural flame/crystal/ribbon/wave/orb geometry. Damage to the player produces red floating text, shields use cyan, enemy damage keeps the original damage colors, and healing uses green. Labels rise and fade over 1.15 seconds and are removed on expiry or exit. Pets remain non-targetable companions, with no invented health system.

Tests: `node tools/test_arena_elements.cjs` validates the eight actual combat behaviors, slot persistence/cooldowns, numeric overhead HP, floating-text motion/fade/removal, ten-card layout at 667x320/812x375/1366x768, keyboard use, combined budgets and cleanup. Fixtures are isolated and do not write production saves. Screenshot cost samples of the individual spells were 118–136 calls and 18–22k triangles at 812x375 on desktop Edge; no physical-phone FPS claim.


## Character selection and live portraits (round 1381)

The normal admin entry in `js/ui.js` loads `css/arena-heroes.css`, `js/arena-elements.js`, `js/arena-portrait.js` and `js/arena-heroes.js`. A modal selection screen appears before battle starts. Three.js and the remaining battle scripts preload while the user reads; battle simulation, rewards and network room start only after confirmation. Cancel leaves the prior selection/save intact; failed preload can retry. This preloads scripts, not an already running scene.

Eight generated full-body heroes (male: fire/wind/ice/light; female: earth/meteor/gravity/water) have distinct starter pairs. Confirmation stores `state.arenaHero` and resets `state.arenaLoadout` to that pair. Signature element cooldown is multiplied by 0.8 in actual gameplay and displayed consistently in selection, spell library and cooldown rings. All heroes have 100 HP. The in-battle actor remains tiny procedural geometry, using hero armor/hair colors and a small cape/hair silhouette; peer actors retain the compatible existing appearance and A2 protocol.

`img/arena-heroes/` contains only WebP: eight 768x1152 alpha portraits and eight 160x240 thumbnails. Generated source PNGs stay outside the repo. `docs/ARENA_HERO_ASSETS.json` records prompts, sources, codec comparisons, alpha and bytes. Thumbnails load together; full images load as selected. One selected portrait owns one lightweight WebGL shader and a 24-particle canvas overlay capped at 30 FPS, DPR 1.5 and 768x1152. Per-hero masks visibly displace hair, capes and elemental magic while protecting the face and leaving feet anchored. No video or animation frame atlas downloads. The portrait starts automatically without a visible motion control and remains active when the battle low-animation flag is set. Hidden tabs and the operating-system reduced-motion preference pause it; cancellation/entry releases textures, context, observer and listeners. If WebGL is unavailable, the full-body still remains visible.

`node tools/test_arena_heroes.cjs` exercises the actual entry function with isolated loader/account fixtures, all eight decoded images, 4/4 gender split, responsive layouts (1366x768,812x375,667x320,390x844), pixel differences proving hair/cape/fire animate while face/boots remain still, reduced motion, selection-to-game powers and cooldown, persistence, cancellation, preload retry/late resolution, and disposal. No production account writes. Set `VW_ARENA_CAPTURE=1` to export temporary preview frames.


## Letter crystals and five-use MEGA (round 1384)

Six former decorative pedestal cores now hold collectible diamonds with A–Z printed on the crystal. Bases remain in the merged static scene; dynamic gems spawn afterward, bob/rotate, and respawn after 18 active gameplay seconds. Letters cycle through A–Z from a randomized starting offset. Walking within 2.5 units collects a pedestal gem; enemy letter diamonds use the existing 1.4-unit radius. Both fresh sources add one charge and one carried letter. Full cargo leaves the gem available and awards neither resource; the six-letter cargo/home bank rules remain intact.

Five fresh crystals grant exactly **five MEGA uses**. Each cast consumes one use, retaining every carried/banked letter. While uses remain, crystals still yield letters but do not accumulate a second charge batch. After the fifth cast the charge meter resets to 0/5; five more pickups grant a fresh five-use batch. The button badge says `เหลือ N`, the top meter says `MEGA เหลือ N ครั้ง`, and cooldown explicitly includes `วิ` to distinguish seconds from remaining uses. The existing 15-second cooldown remains. Downing/exit clears session charges/uses; letters spilled on downing cannot grant fresh charge when reclaimed.

MEGA follows the selected hero's element, with a fixed 18-unit damage radius and matching luminous boundary, rune and dome. Three pulses at 0.35/1.05/1.75 seconds each deal 40 times the current letter/item multiplier to enemies inside the radius. Wind/gravity pull; ice slows; earth/water push; light also heals 30 and grants 20 shield. Targets outside the ring receive no damage. Spell zones cap at 12, and effects retain the existing 640-particle/48-mesh or 256/28 low-power pools. No image/model/audio files or network schema changes were added.

`tools/test_arena_crystals.cjs` covers each element's actual inside/outside damage, matched VFX radius, five-pickup unlock, five-use countdown and recharging, full-cargo rejection, respawn, anti-recharge on spilled letters, home banking, cooldown/uses labels, viewport fit, pool bounds and cleanup. Fixtures are local and do not write production saves.
