# Vocab World: Frontline 1944 — Phase 1.2 Canonical Tank Controller & Unified Runtime Report

Status: **ADMIN PREVIEW ONLY**  
Scope: **Phase 1 Foundation acceptance — Phase 2 cosmetic reconstruction has NOT started**  
Current Task baseline: `VW-20260831-194006-c1e049`

## Current source evidence used

This Phase 1.2 patch was built only from the current files contained in the supplied VW Dev Studio Task ZIP. The SHA-256 hashes of every supplied context file were rechecked against `TASK_MANIFEST.json` before editing and matched.

Modified current files:

- `js/frontline1944.js`
- `css/frontline1944.css`
- `tools/test_frontline1944.js`
- `docs/FRONTLINE1944_REPORT.md`

No older Frontline source was reconstructed or substituted.

## 1. One authoritative Tank Runtime

Phase 1.2 replaces the symptom-by-symptom player movement path with a canonical `TankRuntime`.

The authoritative runtime owns:

- world X/Z position
- hull heading
- signed tracked speed
- turret heading / turret target heading
- the last authoritative motion diagnostic

Every player-tank tick follows the same non-holonomic rule in sub-steps:

`hullForward = forwardFromRotation(authoritativeHeading)`

`position += hullForward * signedSpeed * dt`

There is no input path that adds joystick X directly to world X/Z. DRIVE X is steering/yaw only; DRIVE Y is forward/reverse throttle only.

Steering first updates the authoritative hull heading for the sub-step, and translation is then calculated from that new heading. Reverse uses a negative signed speed on the same forward vector.

## 2. Physics, visual, collision and replication heading are unified

`TankRuntime.heading` is the local-player authoritative heading. Runtime synchronization writes this same value to:

- the player entity hull rotation
- the rendered hull rotation
- the heading supplied to oriented-footprint collision
- `tankStateSnapshot().hullRotation` for multiplayer-ready replication

The local replication snapshot explicitly reads the authoritative runtime pose rather than a separate stale visual transform.

Sector streaming does not mutate hull heading.

## 3. Desktop and mobile are Input Adapters only

There is one gameplay runtime. Inputs are normalized before they reach it:

- `DesktopTankInputAdapter` — keyboard + mouse aim/fire
- `MobileTankInputAdapter` — DRIVE/AIM/FIRE pointer/touch state
- `UnifiedTankInputAdapter` — merges normalized commands
- `TankRuntime` — executes the command

Desktop and mobile therefore do not have separate movement/gameplay implementations.

The normalized command contract is:

- `throttle` ∈ [-1, 1]
- `steering` ∈ [-1, 1]
- optional absolute turret target heading
- `fire` boolean

## 4. Pointer capture and mobile gesture ownership

DRIVE, AIM and FIRE explicitly use `touch-action:none`, non-passive control handlers and pointer capture when Pointer Events are available. Pointer cancel/lost-capture, blur and visibility changes clear active input state.

The legacy touch-event path remains only as an input fallback on browsers without Pointer Events; it does not contain gameplay execution.

## 5. Mobile infantry / stale-runtime investigation

The current `js/frontline1944.js` module itself has no infantry fallback path. When this Phase 1.2 module opens it:

- renders the Frontline HUD as `TANK`
- displays `P1.2`
- publishes `window.__VW_FRONTLINE1944_RUNTIME__` with `kind: "tank"`
- marks the root as a tank runtime
- runs the same `TankRuntime` regardless of desktop/mobile input source

Therefore, **if a device is executing this current module, it cannot intentionally select an infantry player runtime from inside this file**.

However, the supplied current Task ZIP did **not** include the existing repository files that own the Frontline lazy loader / page shell / PWA update path, specifically the current contents of files such as `index_classic.html`, `sw.js` and `js/app-update.js`. The architecture map confirms those systems exist, but their current source was not exported as editable context. Under Source Context Guard rules this patch must not guess or rewrite those existing files.

Consequently Phase 1.2 hardens runtime ownership and makes stale-loading immediately diagnosable, but a phone that still shows `PLAYER 100/100` and no `P1.2` after the patch is evidence that the phone never executed the supplied Phase 1.2 module. In that case the next Task ZIP must include the current loader/service-worker/update files so the stale mobile asset path can be corrected from evidence rather than reconstructed.

## 6. Barrel / muzzle / projectile agreement

Player fire now uses `cannonWorldRay()`.

Before spawning a shell, the tank world matrix is updated and both the actual cannon-tip world position and actual barrel world position are read from the rendered hierarchy. The projectile origin comes from the real muzzle and its direction is the normalized barrel-to-muzzle world vector.

This keeps turret aim independent from the hull while making the shell agree with the barrel that is actually visible.

## 7. Swept oriented tank-footprint collision

The local player no longer relies on a circular approximation for canonical tank movement.

Phase 1.2 adds:

- oriented tank footprint dimensions
- OBB-vs-AABB collision for houses, bunkers, walls and fortress geometry
- OBB-vs-circle collision for tree trunks / circular blockers
- rotated footprint terrain samples
- sweep sub-steps for translation
- sweep sub-steps for hull rotation

This prevents tunneling through thin walls, edges and corners and also prevents rotating the long hull through nearby solids.

Logical terrain priority remains intact. In particular, the ROAD bridge override remains traversable where it has higher priority than DEEP_WATER.

## 8. Admin Preview orientation diagnostic

The temporary tank keeps the yellow front stripe and red rear marker and adds:

- a bright yellow forward-pointing nose arrow
- two bright red rear lamps

These are acceptance diagnostics only and may be replaced by final tank art in Phase 2.

## 9. Battlefield camera coverage

The orthographic world width is now `156`, compared with the original Phase 1 width of `84`, or about **1.86×** the earlier battlefield coverage. Camera offset/height are increased and fog density is reduced to retain useful landscape visibility.

This remains a Foundation readability change, not a cosmetic reconstruction.

## 10. Deterministic automated acceptance coverage

`tools/test_frontline1944.js` now covers:

- all 360 whole-degree hull headings
- normalized forward/right axes
- forward/reverse exact opposition at every tested heading
- steering then forward movement
- steering then reverse movement
- zero instantaneous lateral velocity
- equality of authoritative, entity, visual and replicated hull yaw
- desktop/mobile normalized command parity
- swept oriented-footprint collision against a thin wall
- deep-water blocking and bridge priority
- sector-transition heading stability
- barrel/muzzle/projectile world-ray agreement
- Pointer Events / pointer capture / touch-action ownership
- explicit Phase 1.2 tank runtime identity
- camera coverage target

An isolated VM acceptance harness run against the returned source passed these deterministic Foundation checks. `node --check` also passes for both modified JavaScript files.

## Preserved systems

This patch does not rewrite unrelated systems and preserves the existing integration points for:

- Sector Streamer and 10 reusable sector identities
- vocabulary providers
- coin/economy functions
- save/cloud hooks
- Firebase-ready snapshot contract
- fail-closed Admin Preview access
- projectile/object pooling
- unrelated Vocab World games

## Required local acceptance after Import / Apply

Before Phase 2 begins, confirm on desktop and the real phone:

1. HUD says `TANK` and runtime marker says `P1.2`.
2. Yellow arrow is always the tank front; red lamps are always the rear.
3. DRIVE up moves toward the yellow front after any hull turn.
4. DRIVE down reverses toward the red rear after any hull turn.
5. DRIVE left/right changes hull heading and never strafes/slides sideways.
6. AIM moves the turret independently of hull.
7. FIRE shell follows the visible barrel exactly.
8. Walls, tree trunks, houses, bunkers and fortress corners cannot be tunneled through.
9. Bridge remains traversable and deep water remains blocked.
10. Sector transitions do not rotate/reset the hull.
11. Mobile DRIVE/AIM/FIRE respond with no browser scroll/gesture stealing.
12. Camera shows roughly 1.86× the earlier Phase 1 world width.

If the phone still displays old `PLAYER 100/100` and does not display `P1.2`, do not mark Phase 1 accepted: that specifically proves the phone is loading a different/stale Frontline execution path outside the source files supplied by this Task ZIP.
