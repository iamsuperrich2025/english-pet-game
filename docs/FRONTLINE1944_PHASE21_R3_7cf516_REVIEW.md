# Frontline 1944 Phase 2.1 R3 — local review candidate

Task: `VW-20260906-065552-7cf516`  
Source identity: `ea9f5b172f537fe3d59fa1c4ae27cb7b6be81c726ced2789c526b9eed06c6702`  
Visual/safety revision: `P2.1R3-7cf516`  
Status: **SOURCE-TESTED CANDIDATE. NOT full R3 visual acceptance. NOT deployed.**

## ขอบเขตที่ส่งมอบ

แก้ระบบเกิดใหม่และการกู้รถถังที่ทับสิ่งกีดขวางเป็นหลัก พร้อมใช้ภาพเดิมร่วมกันในเซสชัน และปรับกล้องตามหลังให้ต่ำ/ใกล้ขึ้นเล็กน้อย งานฉากโดยรวมยังไม่ได้ยกระดับจนยืนยันว่าใกล้ Visual Master ตามข้อกำหนด R3 ทั้งหมด ห้ามนับแพตช์นี้เป็นงานภาพที่ผู้ใช้ยอมรับแล้ว

ซอร์สตั้งต้นทั้งหมดมาจาก context ของ Task 7cf516 เท่านั้น ไม่ได้นำซอร์สหรือแพตช์เก่ามาสร้างฐานใหม่ ภาพอ้างอิงเดิม “WWII Tank Battle: Fortress Assault” ถูกค้นคืนและเปิดดูเพื่อเทียบแนวทาง แต่ไม่ได้ใส่เป็นพื้นหลังเกมหรือหลักฐานภาพจากเกมจริง

## Root cause verified in the supplied source

The previous `damagePlayer` death branch teleported directly to `x=0, z=sectorCenterZ(max(0,currentIndex-1))`, retained the current heading and restored HP, without a collision or maneuver-space check. It streamed the destination **after** teleporting. Its destination can overlap current buildings or a local-test fortress. The new test reproduces that blocked center before exercising the patched death branch.

## Safe respawn / recovery implementation

- Stream actual destination geometry, terrain and collision data before selecting a spawn; preloaded descriptors do not count as loaded collision data.
- Validate a circular clearance envelope enclosing the current tank body, a 0.35-unit margin and a four-unit maneuver allowance. Minimum visual half-width/length are 3.25/4.50. Current accepted movement footprint and swept-collision algorithm are unchanged.
- Use exact disk-versus-AABB/circle checks, conservative blocked-terrain checks, world-edge checks and live-enemy clearance. A narrow bridge over deep water is not used as a respawn turning bay; normal bridge movement priorities are unchanged.
- Require a clear connection from an off-road preferred point to the central road. Avoid an enclosed courtyard which merely fits the tank.
- Search preferred location and nine central-road anchors in up to three nearby logical sectors. Commit only after a second validation. Do not disable solids, grant noclip, move scenery, or invent an unchecked final fallback.
- On death, restore HP only after successful placement and give two seconds of spawn protection. Preserve health during non-death embedded-pose recovery.
- Recover genuinely overlapping saved/late-loaded poses. Holding DRIVE against a wall does not trigger a teleport: recovery uses an inset overlap test, not a movement/input timeout.
- If every bounded candidate is blocked, retain the prior pose, hide/suspend the player simulation, display a persistent compact status and retry after 0.75 seconds. This deliberately fails closed rather than respawning inside a building. Scene teardown clears pending state.
- Keep pointer ownership, AIM latch, FIRE state and automatic movement intent. Clear the old target selection on death/recovery using the existing lock function.

## Download / presentation changes

No new images, models, fonts, external services or runtime dependencies. Existing 11 `p21r2_*.webp` URL definitions are unchanged. The shared per-open-session cache issues at most one loader request per URL, shares texture objects between materials, and reuses them across corridor unload/re-entry. Disposed sector subscribers cannot mutate discarded materials. Failed requests are not repeatedly downloaded during sector churn; reopening creates a fresh cache. Loading has a ten-second timeout; late completions after failure/teardown are discarded and disposed safely.

A closer/lower trailing camera uses height 8.0 instead of 9.2, distance 17.5 instead of 20; FOV 55 and look-ahead 22 remain unchanged. This is a **limited camera adjustment**, not a rebuilt cinematic village/fortress or a claim of visual-master convergence. Current modular scene geometry, tank models and HUD structure are reused. The visible brand changes to R3 and the existing information drawer includes safe-placement status.

| Payload measure | Before | Candidate | Difference |
|---|---:|---:|---:|
| Runtime JS, raw bytes | 296,305 | 305,925 | +9,620 |
| Runtime JS, local gzip level 9 estimate | 66,680 | 69,921 | +3,241 |
| Newly added image/model bytes | 0 | 0 | 0 |

Gzip figures are local compression measurements, not captured server-transfer figures or measured hosting savings. The supplied build script excludes `tools/` and `docs/` from public runtime files, so the test/report additions do not enter the normal public runtime copy set. The build script itself is unchanged, and no build was executed here.

## Verification performed

Environment: Node.js v22.16.0. Run from project root:

```text
node --check js/frontline1944.js
node --check tools/test_frontline1944.js
node tools/test_frontline1944.js --phase21-r3
```

Result: **29 R3 focused groups + 27 existing N3 dynamic groups = 56 passing groups**, with one explicitly skipped CSS-only check in the N3 source-only invocation.

- 200 lethal-damage/respawn cycles; all ten current procedural sector templates; eight initial hull directions; real current `SectorStreamer`, `TerrainSystem`, `CollisionSystem` and `TankRuntime` code executes in a Node VM.
- Separate eight-heading preferred-spawn preservation test, 16-direction footprint/forward/reverse sweeps, and actual runtime forward/backward and complete left/right turning trials at selected respawns.
- Building, fortress core/wall/gate, tiny trunk/corner, deep water/bridge, unloaded-sector, enclosed courtyard, live enemy, invalid-coordinate, all-candidates-blocked and delayed recovery cases.
- 20 seconds of held DRIVE against a wall must not trigger recovery. Initial valid pose remains unchanged; actual embedded entry/late-insertion poses recover.
- Exact SHA-256 of **131 exported callable declarations** match the raw current Task baseline. These include tank movement, collision/terrain/streamer classes, input adapters/router, target-lock helpers, projectile paths, automatic controls, rewards and admin/public hooks. This is an unchanged-code guarantee, not physical-device acceptance.
- Existing N3 dynamic tests exercise lock selection/status, ownership, double-tap FIRE, simultaneous DRIVE+AIM+FIRE, AIM movement near FIRE, auto forward/reverse, boss/core lifecycle and local-test no-reward isolation. Their projection tests use explicit legacy camera/DOM doubles, not the new camera in a real browser.
- Cache request deduplication, subscriber cancellation, failure/timeout, late callback, close-before-load and eight corridor re-entry cycles pass. Actual supplied corridor geometry emits 41 meshes / 15,702 triangles in the geometry-contract harness; these are not renderer performance measurements.
- Scene, geometry and DOM are explicit **test doubles**. Optional cosmetic paths requiring Matrix4 are not exercised by the doubles. No real Three.js/WebGL or in-game screenshot pass is claimed.

## Verification blocked / acceptance still required

The Task ZIP does not include `js/vendor/three.min.js`, `css/frontline1944.css`, `index_classic.html`, the eleven referenced current WebP files, or their current asset manifest. No substitute current CSS, HTML, vendor or image bytes were invented, imported from old code packages or packaged for the user.

The unchanged full `--target-lock` path was attempted and stops with ENOENT for `css/frontline1944.css`. The full `--landscape-lock` path was attempted and stops with ENOENT for `index_classic.html`. The added source-only option leaves the default full checks mandatory; it explicitly reports its CSS omission. These full suites are **BLOCKED**, not passing.

No full project build, real browser/WebGL rendering, spawn/corridor/fortress screenshots, real-device landscape layout, real perspective-camera target acquisition, mobile FPS, network waterfall, authentication bootstrap or physical iQOO test was completed. No Apply, Build or Deploy was run against the user's project.

| R3 acceptance target | This delivery |
|---|---|
| A: eliminate stuck respawn | Source-level fix and repeatable tests pass; real-play acceptance pending |
| B: accepted controls preserved | 131 declaration locks plus dynamic contracts pass; real-device regression pending |
| C: actual scene closer to master | Limited camera adjustment only; visual acceptance NOT established |
| D: low-download strategy | Zero new asset bytes; shared existing textures; wire savings not measured |
| E: playable, optimized final scene | Requires full-project build, actual browser/device play and screenshots |

## Local review steps

Import **VW_CHATGPT_PATCH_VW-20260906-065552-7cf516.zip** as a ChatGPT Patch in the same project/Task. Inspect the proposal and normal backup/freshness checks, then Apply, Build and Local Preview through Studio. Do not force a stale-source rejection. Do not deploy.

Confirm the visible `FRONTLINE 1944 · R3` brand or `P2.1R3-7cf516` visual revision. The underlying accepted runtime identity `P1.2.6F-20260902-5cc6a0` intentionally stays unchanged; it is not the R3 proof by itself.

In actual play, repeat at least five deaths near village structures/fortress, then immediately drive forward/backward and turn both ways. Recheck target selection/status and firing, AUTO FORWARD/AUTO REVERSE, AIM near FIRE and simultaneous three-finger controls. Capture actual spawn, corridor and fortress-approach screenshots plus one active lock. Keep this a local candidate until those results and the visual gap are reviewed.

For the remaining cinematic pass, a fresh CURRENT-disk export must include the current missing vendor/CSS/HTML and referenced asset bytes/manifest plus actual screenshots. Do not supply old source or fake evidence.

## Changed project files

1. `js/frontline1944.js` — safety/cache/camera/diagnostics.
2. `tools/test_frontline1944.js` — additive R3 suite and explicit optional source-only N3 switch; default full CSS assertion retained.
3. `docs/FRONTLINE1944_PHASE21_R3_7cf516_REVIEW.md` — this evidence/limitation report.

Other supplied files, including build script, GLTFLoader, Home V2 CSS, permanent rules and prior reports/maps, are byte-identical. No existing asset metadata was overwritten.

## Raw test log

```text
  LOCKED 131 declarations byte-identical to Task 7cf516
PASS R3 exact uploaded baseline declaration locks (physics/input/targets/economy/admin)
  corridor meshes=41 triangles=15702 colliders=78
PASS R3 initial active sector uses actual current R2 corridor geometry and collision proxies
PASS R3 unsafe old center respawn reproduced and fixed through damagePlayer
PASS R3 real fortress proxies reject core, walls and gate for respawn, without disabling collision
PASS R3 spawn requires visual hull plus full turn and forward/reverse maneuver envelope
PASS R3 safe preferred heading survives respawn at each of eight hull directions
PASS R3 tiny circular blockers and rectangular corners cannot fall between footprint samples
PASS R3 deep water and narrow bridge are not selected as maneuver-safe spawn bays
PASS R3 descriptor-only terrain cannot be mistaken for a safe spawn
PASS R3 enclosed off-road courtyard rejected unless connected to through road
PASS R3 normal wall contact or holding DRIVE does not trigger a teleport
PASS R3 embedded saved pose recovers on entry, valid saved pose is unchanged
PASS R3 late scene/collision insertion recovers only a genuinely embedded player
PASS R3 all candidates blocked: fail closed, preserve pose/solids, retry then recover
PASS R3 failed-death retry blocks repeated damage and rewards are untouched
PASS R3 live enemies excluded; dead enemies do not reserve permanent spawn space
PASS R3 NaN/infinite/out-of-bounds spawn requests cannot be accepted
  death cycles=200, procedural templates=10, streamed sectors max=3
PASS R3 200 real damage/death cycles across all ten current procedural templates and 8 headings
PASS R3 accepted drive, reverse and zero-strafe remain correct after respawn
PASS R3 respawn preserves independent router pointer ownership, AIM latch, FIRE and auto mode
PASS R3 camera is trailing and lower/closer without changing authoritative pose at 8 headings
PASS R3 no new image URLs, texture dimensions or heavyweight model dependencies
PASS R3 shared URL loads once for different materials and repeated subscribers
PASS R3 unloaded subscribers cannot touch disposed materials
PASS R3 failed/timeout textures do not block gameplay or retry-download on sector churn
PASS R3 close while loading prevents late callback and disposes each texture once
PASS R3 real corridor unload/re-entry reuses nine existing maps with bounded resources
PASS R3 portrait suspension adapter still neutralizes controls and resume resets time
PASS R3 safe-spawn state reset has no pending retry leaking into next session
PASS R3 29 focused groups. Rendering doubles only: no real WebGL screenshots or physical-device acceptance claimed.
Running existing N3 dynamic control/target tests; its stylesheet-only check is explicitly skipped in this source-only mode.
SKIP N3 current stylesheet identity: not supplied / source-only mode
PASS N3 accepted identity and wide camera
PASS N3 private-host policy and production isolation
PASS N3 local range creates real Fortress + three real defenders
PASS N3 OFF -> READY does not invent a lock; instruction is not a blocking toast
PASS N3 arming removes only the bootstrap ready toast, not combat/reward notices
PASS N3 enemy child mesh -> actual entity -> LOCKED -> name/HP/marker
PASS N3 CSS canvas coordinates, offsets and DPR at four wide-camera viewports
PASS N3 wide-camera small-actor allowance is bounded; empty ground never picks a Fortress
PASS N3 switching locks actual clicked enemy; miss retains current target
PASS N3 protected HUD/button input cannot select behind UI
PASS N3 Fortress child mesh remains selectable while Core is protected
PASS N3 marker follows the entity and turret heading has one lock authority
PASS N3 OFF clears marker/state and restores manual aiming immediately
PASS N3 desktop click selects instead of firing; FIRE/Space remain available
PASS N3 actual mobile router binds with current special-button DOM
PASS N3 touch target acquisition and double-tap FIRE use current router paths
PASS N3 selected-target drag and cancel do not turn into double-tap FIRE
PASS N3 DRIVE + immediate AIM + FIRE ownership stays independent during lock
PASS N3 auto forward/reverse mutual exclusion and manual steering survive
PASS N3 hidden/unloaded/detached lifecycle targets cannot remain stale
PASS N3 defenders -> real Boss -> vulnerable Core grants no persistent rewards
PASS N3 normal projectile collision retains protected/vulnerable Core damage gating
PASS N3 Core destruction clears feedback and safely respawns near player without persistence
PASS N3 local placement follows rotated Hull Forward, not a fixed world axis
PASS N3 test setup failure stays non-blocking and visibly reports failure
PASS N3 fallback touchstart/touchend selects real targets and preserves double-tap FIRE
PASS N3 removal/re-entry clears entity reference; original bootstrap remains deferred
PASS N3 27 focused groups; source-path / rendering-double tests only. Real browser delivery, WebGL raycasting and physical mobile acceptance remain required.
SUITE_ELAPSED_SECONDS=5.90
```
