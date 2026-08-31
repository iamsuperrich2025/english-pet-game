# Vocab World: Frontline 1944 — Admin Preview implementation report

## Scope
This round adds an isolated admin-preview mini-game runtime. It does not rewrite Home V2, Adventure World, Racing, Letter Cannon, Picture Dictionary, shared Firebase paths, or the core economy.

## Existing systems reused
- Vocabulary: `f1VocabForStudent()` first, with `vocabForStudent()` as the existing shared fallback. No new word database is created.
- Player grade: existing `state.student.grade`.
- Economy: existing `addCoins()`.
- Persistence: existing `saveState()` and `authPushSave(false)` when available.
- Audio: existing `Music.suspendBg()/resumeBg()` when available; browser speech is only a pronunciation fallback.
- Three.js: existing vendored `js/vendor/three.min.js`, loaded lazily only when the admin opens Frontline.
- Admin: existing global admin guard symbols (`adminAllowed`, `isAdmin`, `canAccessAdmin`, or `AdminGate.allowed`) are consumed fail-closed. Frontline never creates an email allowlist and never trusts query strings/profile grade as authorization.

## Rendering architecture
Frontline owns a separate Three.js scene and orthographic elevated camera. Layer groups 0–7 match the requested conceptual depth architecture. Terrain is made from reusable procedural geometry/materials rather than one huge battlefield image.

- Layer 0: atmosphere/fog/distant visual depth.
- Layer 1: base terrain and broad farmland regions.
- Layer 2: roads, river, field rows, bridges and infrastructure.
- Layer 3: ground decoration, trench elements and debris.
- Layer 4: houses, ruins, tree trunks and fortress structures.
- Layer 5: player, defenders and bosses.
- Layer 6: tree canopies/foreground occluders.
- Layer 7: projectiles, smoke and impact effects.

Tree trunks and canopies are separate objects. Canopies are explicit Layer 6 occluders while the player is Layer 5; normal WebGL depth testing remains enabled, so the camera/geometry produces the under-canopy effect rather than a static screenshot trick.

## Fortress / boss / endless loop
A fortress cycles through `dormant -> defenders -> boss -> core -> destroyed`. Every activated fortress creates a boss phase. Destroying the core awards exactly the next sequential letter, then activates a geographically separated fortress site. Sites are recycled by least-recent use; memory does not grow with the endless objective count.

## Letter and coin logic
The current target word is consumed sequentially, so repeated letters are preserved (`APPLE` would require A, P, P, L, E rather than unique-letter matching). Reward constants are centralized: 1 coin per captured fortress letter and 50 coins per completed word. Both pass through persistent claim IDs to prevent duplicate settlement.

## Vocabulary audit
`tools/test_frontline1944.js` reads the real current `js/data/f1_vocab.js` and prints actual P.1–P.6 counts and unique counts. This patch intentionally does not fabricate counts in documentation. The task ZIP only supplied the existing Letter Cannon regression proving 500 words for representative bands P.1, P.3, P.5, M.1 and M.4; the new test closes the missing P.2/P.4/P.6 evidence at local Build/Test time.

## Mobile optimization
- Orthographic view with DPR capped at 1.5.
- Explicit active caps: 10 enemies, 48 player projectiles, bounded enemy shots, 72 transient FX.
- Destroyed actors/projectiles/effects are disposed instead of retained.
- Three.js is lazy-loaded only after a successful admin check.
- Landscape touch joystick + fire control; compact CSS for short landscape screens.
- No whole-world high-resolution texture download.

## Access status
The rail button is HTML-hidden by default. JavaScript unhides it only after an existing authoritative admin guard returns true. `Frontline1944.open()` repeats the guard and fails closed, so direct `?go=frontline1944` access does not bypass the check. No production deploy is performed by this patch.

## Known limitations of this first playable core
- Environment art is original procedural Three.js geometry/material work in this round, not the final authored/generated WebP art pack. This keeps the first patch lightweight and validates the gameplay/depth architecture before asset expansion.
- The supplied task context did not include the implementation files that define the authoritative admin guard; therefore this module consumes the existing known global guard interfaces and deliberately stays locked if none is present.
- Multiplayer is intentionally not introduced in Phase 1; the requested core loop is solo and does not create new Firebase room paths.
