# Frontline 1944 — Phase 2.1 R13 Battlefield & Sector Expansion

Task: `VW-20260906-232412-09cfa9`  
Runtime: `P2.1R13-09cfa9`  
Baseline: CURRENT R12.2 supplied by the Task ZIP

## Implementation

- Preserves the CURRENT `SectorStreamer` architecture and its previous/current/next active-sector policy.
- Expands the deterministic campaign route from 8 to 10 distinct battlefield sectors: Rural Approach, Forest Road, River Crossing, Trench Line, Ruined Village, Open Battlefield, Defensive Bunkers, Industrial Ruins, Fortress Approach, and Final Fortress.
- Adds a lightweight R13 sector composition layer using existing shared geometry/material/terrain/collision helpers rather than a new engine or always-active giant world.
- Keeps a broad center maneuver corridor clear of dense tree/crater placement to reduce tank traps and preserve safe-respawn practicality.
- Adds sector-specific landmarks and silhouettes including watchtower/tower forms, bridge, trench bands, bunker complex, industrial chimneys, fortress gate/towers, and a final fortress arena.
- Keeps the authoritative mission-critical `makeFortress` objective architecture intact in the final sector.
- Extends mission progression and checkpoint routing to the new 10-sector route.
- Does not change cannon/MG balance, tank HP/physics, DRIVE/AIM/FIRE/MG/SCOPE behavior, target-selection timeout rules, wallet authority, prices, rewards, or accepted combat-damage scoring.
- Updates Frontline delivery identity to `P2.1R13-09cfa9` in JS/CSS/HTML.

## Verification performed in isolated Task context

`node tools/test_frontline1944.js` passes, including:

- R11.3 central wallet/combat damage/destructible protection regression
- R12 mission/checkpoint/fortress regression
- R12 Boot Hotfix regression
- R12.1 direct target + five-second hull-forward return + MG regression
- R12.2 EXIT/top-right + same-target deselect + five-second selected-target timeout + SCOPE exception
- R13 ten-sector uniqueness/streaming/mission/invariant regression
- responsive viewport matrix including 1253 × 553

The isolated Task intentionally lacks `js/data/f1_vocab.js`; its existing test therefore skips only that vocabulary audit and requires the normal full-project test after import.

## Safety

This is a patch proposal only. No Apply, Build, Deploy, package installation, wallet reset, purchase reset, mission reset, or production change was performed.
