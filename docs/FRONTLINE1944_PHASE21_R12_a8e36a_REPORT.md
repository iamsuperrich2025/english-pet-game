# Frontline 1944 — Phase 2.1 R12 Implementation Report

Task: `VW-20260906-200047-a8e36a`  
Runtime: `P2.1R12-a8e36a`  
Baseline: CURRENT R11.3 (`VW-20260906-191254-c08371`)

## Authoritative CURRENT architecture used

- Battlefield/world generation: `js/frontline1944.js`; `sectorDescriptor`, `instantiateSector`, `populateSector`, `SectorStreamer`.
- Sector streaming: existing `SectorStreamer` remains authoritative. It fully activates previous/current/next sectors and descriptor-preloads farther neighbors.
- Collision/terrain/destruction: existing `CollisionSystem`, `TerrainSystem`, and R11.3 environment-destructible registration remain authoritative.
- Tank runtime/input: existing TankRuntime, DRIVE/AIM/FIRE/MG/SCOPE/TARGET LOCK and mobile pointer ownership are unchanged.
- Vocabulary/letter progression: existing `chooseWord`, `awardLetter`, claims and shared MAIN COINS gateway remain authoritative.
- Fortress: existing `makeFortress`, `registerFortressCollision`, defenders, boss and core sequence are retained and now routed to the final R12 mission sector.
- Respawn: existing R3 safe-spawn validator remains authoritative; R12 supplies the latest mission checkpoint pose to that validator.
- HUD/world projection: existing objective panel, `WorldSpace.worldToScreen`, camera projection and responsive layout remain authoritative.
- Damage accounting: R11.3 `recordCombatDamage` allowlist remains unchanged: ZOMBIE and ENEMY_TANK only.
- Persistence: existing `state.frontline1944` + `persist()` remains authoritative; R12 stores only mission/checkpoint state inside it.

## R12 additions

1. Central `R12_MISSION_STATES` controller and idempotent progression.
2. Deterministic 8-sector campaign route: Rural Approach, Village, Forest/Woodland, Bridge/River, Damaged Town/Ruins, Defensive Line, Fortress Approach, Fortress Outer Area.
3. Existing sector visual templates are reused; no renderer or physics rewrite.
4. Existing previous/current/next streaming policy is preserved for mobile practicality.
5. Compact objective text, rounded distance, directional arrow and off-screen emphasis.
6. Checkpoint progression at meaningful campaign milestones, with all death respawns still passing through the existing safe-spawn collision validator/fallback system.
7. Fortress is placed at the final campaign sector and does not respawn after mission completion.
8. Mission completion is idempotent and persists safely.

## Preserved R11.3 invariants

- Shared Vocab World MAIN COINS only; no Frontline wallet.
- Local Test remains no-reward.
- Environment destruction scores zero combat damage.
- Zombie scoring and actual Enemy Tank HP scoring remain unchanged.
- Protected fortress/path collision remains protected.
- Tank physics, no-strafe semantics, reverse diagonals, turret/cannon behavior, Scope and Target Lock are not rewritten.
- Responsive viewport matrix and 1253×553 layout model remain unchanged.
- ASH SPEAR fictional faction remains; no historical extremist insignia added.

## Verification

`node tools/test_frontline1944.js` passes in the exported Task context. The vocabulary audit is intentionally skipped by the isolated Task test because `js/data/f1_vocab.js` was not supplied; the existing test explicitly requires that audit in a full-project run.
