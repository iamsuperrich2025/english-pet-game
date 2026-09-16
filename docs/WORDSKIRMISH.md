# Word Skirmish

Admin-only third-person vocabulary shooter. The intro offers **Battle Royale** (primary action) and **training**. Both retain the corrected body/upper-body stance pivots, private letter bank and 1,000 central coins per completed word.

## Ownership and loading

`ui.openWordSkirmish` loads CSS, `wordskirmish-br.js`, `wordskirmish-field.js`, then `wordskirmish.js`; THREE remains lazy. BR owns deterministic inventory/damage/zone rules and compact round metadata; Field owns original procedural geometry, movement cover and supplies. The main module owns rendering, rig, input, audio, gameplay bridge and UI. Build allowlist includes all three modules.

## Controls

| Action | Desktop | Touch |
|---|---|---|
| Move / aim | WASD or arrows / drag right side | Left joystick / right-side drag |
| Fire | Hold F | Hold FIRE; drag it to aim |
| Scope | V | SCOPE, 2.5x optical FOV |
| Sprint / jump | Shift / Space | วิ่ง toggle / กระโดด |
| Reload / heal | R / H | บรรจุ / รักษา |
| Weapons | 1 / 2 / 3 | RANGER / SWIFT / SCOUT slots |
| Crouch / prone / dodge | C / Z / X or Ctrl | ย่อ / หมอบ / หลบ |
| Drop / return home | Q / E | DROP / AUTO |

Battle HUD has a separate จัดปุ่ม toggle; firing never repositions controls. Positions use `skmPadBR1`; training keeps `skmPad1` and its legacy long-press positioning. Sprint has 1.5x speed, scoped walking is 0.6x and diagonal motion is normalized. Jump stands the character up and returns to the floor under gravity. Heal channels for 3s and is interrupted by movement, firing or damage. Blur clears held input.

## Rules

A 1.5s presence settling window precedes 10s warm-up. Warm-up roster changes update distinct spawn positions. A solo round has seven AI opponents that fight each other and the player; a human multiplayer round has no per-client AI. No respawn during an active round. A late arrival waits until the next warm-up. Last alive wins; 8s intermission then a new warm-up. A simultaneous wipe can end with no winner.

The initial circle has radius 52. After 40s it contracts at 0.36 units/s toward (9,-6), reaching zero around 185s. Outside damage escalates from 4 to 9 to 18 HP/s and bypasses armor. Local AI seeks the circle and checks the same solid cover before shooting.

| Weapon | Body / head | Magazine / initial reserve | Shot interval | Reload |
|---|---|---|---|---|
| RANGER | 20 / 60 | 24 / 96 | 140ms | 1.65s |
| SWIFT | 14 / 42 | 30 / 120 | 85ms | 1.3s |
| SCOUT | 60 / 180 | 5 / 25 | 750ms | 2.25s |

Players start with RANGER, 50 armor and two medkits. Armor absorbs 60% of incoming weapon damage until depleted. A medkit heals 65 HP. Colored **personal supply stations** unlock weapons, add one magazine of reserve, 30 armor and a medkit (cap five), once per station per round. They are intentionally not contested server-owned loot. Completing a word adds 35 armor and one magazine to the current weapon as well as the existing 1,000-coin reward. Winning does not issue an additional currency reward. Training retains its original infinite ammo, 35 body damage, headshot KO and automatic home respawn.

## Aim and geometry

Camera NDC (0,0) selects the nearest visible aim point. A second ray starts at the actual muzzle joint and resolves the first obstruction before that point. That hit supplies both damage and the endpoint of a moving visual tracer; it is hitscan combat, not a gravity projectile simulation. Scope is a true FOV change; the local avatar is hidden while zoomed. Houses, containers, terrain and foliage stop shots. Movement shares Field's solid cover rectangles; the chase camera retracts in front of nearby cover.

The tactical map is original geometry, with instanced cover/tree batches and cached rounded-box character geometry. No new image downloads, runtime PNGs, shadows or higher DPR. Eight actors in the representative 1367x617 view measured about 302–305 draws / 40,500 triangles; the field itself uses shared batches. Pooled tracer count stays four. Removed letter cards/textures are disposed on round resets. Minimap/HUD update at 10Hz.

## Existing NetRoom protocol

- `c` (max 60): `B` + phase W/A/F + winner token (5) + AI alive mask (2 base36) + dot-separated five-character roster tokens (max 8); maximum 56 characters. UID tokens are FNV hashes reduced to five base36 characters.
- `ct`: shared round-start wall-clock epoch; `c/ct` rebroadcast the adopted round. Lowest connected admitted token is authority, including eliminated players; disconnect elects the next admitted peer. Warm-up proposals converge to the earliest start. Same-epoch phase moves only forward. Clock synchronization is assumed, as in the existing timestamp-based room transport.
- `hp`: `K|health|carry|seat|armor|lastAttackerToken`, within 28 characters. Ammo/action timers remain local and do not trigger cold writes on each shot.
- `cw`: sequenced, round-tagged bursts (`R<epoch base36>.<sequence>|...`), capped at 60 characters and flushed at most once per 170ms. Hit entries encode target token, weapon id and hit part; repeat packets are deduplicated. Nonparticipants and old-round packets are ignored. Letter pickup/drop entries share the queue. Training events now also include a sequence so repeated identical hits are not lost.
- `av`: existing stance/dodge phase codes. `y` additionally carries jump height. Existing NetRoom hot interval remains 170ms. No new database fields, paths, Rules or configuration.

This is the existing client-authoritative admin test game, not a new authoritative competitive backend. Transport delivery/latency and two signed-in physical devices still need live acceptance testing; the offline browser harness exchanges the exact existing field payloads without writing production data. Hash token collisions are rare and duplicate roster identities are not admitted twice.

## Validation

Run `node tools/test_wordskirmish.js` and `node tools/test_wordskirmish_br.cjs`; then the `poses`, `scope` and `battle` `.cjs` browser tests. They use installed Playwright Edge and support `SKM_ROOT` for dist and `SKM_OUT` for WebP captures. Fixtures bypass login/production writes. Coverage includes real mesh poses, 72 centre-ray shots, head/body hits and muzzle obstruction, all three Battle Royale weapons, cover blocking both player/AI, finite reload/healing, hold-fire/aim/edit input, safe mobile layouts, a complete AI match, two clients, late join, unique spawn positions and host departure. Run `node tools/build_web.mjs` then `node tools/validate_web_build.mjs` for shipping.
