# Vocab World: Frontline 1944 — Phase 1.1 Tank Runtime Correction Report

Status: **ADMIN PREVIEW ONLY**  
Scope: **Phase 1 acceptance correction — not Phase 2 visual reconstruction**  
Current Task baseline: `VW-20260831-190731-3015dd`

## Current source inspected

The correction is based only on the current files exported by VW Dev Studio after the Phase 1 patch:

- `js/frontline1944.js`
- `css/frontline1944.css`
- `tools/test_frontline1944.js`
- current Frontline report / architecture / code-map context supplied by the task

No Home V2, Firebase, economy, vocabulary source, Adventure, Racing, or unrelated game source is rewritten.

## Acceptance failures addressed

The user reported seven concrete Phase 1 failures after browser/mobile testing:

1. Desktop showed the tank runtime, while mobile still showed the old infantry presentation and mobile controls did not react.
2. Shell travel did not visually agree with the cannon barrel direction.
3. The tank appeared able to slide sideways.
4. Forward/reverse behavior was difficult to verify as hull-relative movement.
5. The temporary tank model did not make front/rear orientation obvious.
6. Some obstacle edges/corners could still be penetrated.
7. The gameplay camera was too close to the tank.

Phase 1.1 corrects the runtime paths that are available in the current exported source and adds explicit diagnostics for the mobile/Desktop parity check.

## 1. Mobile/Desktop runtime and control parity

`bindStick()` now supports two input paths:

- Pointer Events when available
- explicit `touchstart` / `touchmove` / `touchend` / `touchcancel` fallback

Pointer capture loss and global pointer release are also handled, and blur/visibility changes reset all DRIVE/AIM/FIRE state cleanly.

The Frontline admin launch buttons are hidden and have pointer events disabled while the battlefield runtime is open. This prevents the visible `Frontline 1944 — ADMIN PREVIEW` launcher from overlapping/intercepting AIM/FIRE input on mobile landscape.

The current runtime exposes an explicit version marker:

- `Frontline1944.VERSION = P1.1-20260831`
- the HUD shows `P1.1`

This is intentionally visible during Admin Preview. If a phone still shows the old `PLAYER 100/100` infantry UI and does not show `P1.1`, that phone is not executing this current runtime source; the remaining problem would be outside the supplied Frontline JS/CSS (for example stale deployed/PWA asset loading) and must be investigated from a fresh current task containing the loader/service-worker source rather than guessed here.

## 2. Shell / barrel direction

Player projectile direction is no longer reconstructed only from a stored turret angle.

`cannonWorldDirection()` now derives the actual X/Z fire vector from the rendered barrel and cannon-tip world transforms. Shell spawn position is taken from the real muzzle tip and advanced slightly beyond the muzzle.

Therefore the projectile contract follows the geometry that the player actually sees, even if the turret hierarchy or visual offset changes later.

## 3. No tank strafe / no collision-induced side slide

Tracked player movement now has a dedicated strict resolver:

`CollisionSystem.resolveVehicleMove()`

The player tank does not use axis-separated collision sliding. Once the intended forward/reverse path is blocked, movement stops at the obstacle instead of resolving X and Z independently and producing a sideways glide.

Enemy movement retains the general circle resolver so this correction remains isolated to player tracked-vehicle behavior.

## 4. Hull-relative forward / reverse

The tank controller now centralizes its vehicle axis in:

- `forwardFromRotation(hullRotation)`
- `driveDelta(hullRotation, speed, dt)`

The movement vector is always:

`Hull Forward × signed speed`

DRIVE Y controls forward/reverse speed. DRIVE X changes hull heading. There is no direct world-X/world-Z strafe command.

A negative speed uses exactly the opposite hull axis, so reverse remains vehicle-relative.

## 5. Clear front / rear diagnostic

The temporary Phase 1 tank now includes Admin Preview orientation markers:

- **yellow front marker + yellow top stripe** = hull front
- **red rear marker** = hull rear

These are diagnostic geometry for acceptance testing. They can be removed/replaced when Phase 2 introduces the final visual tank asset with an unmistakable glacis/front/rear silhouette.

## 6. Collision edge/corner hardening

Collision receives three additional protections:

1. Player tracked movement uses finer strict swept steps and stops on the first blocked sub-step.
2. Blocked terrain is sampled across the tank footprint, not only at the tank center. This reduces clipping into deep-water/fortification boundaries.
3. Fortress perimeter collision uses continuous side/back proxies and continuous front segments around the intended gate instead of many small segment colliders with tiny seams.

Rotated wall proxies also receive a small safety margin so visible wall endpoints/corners do not expose narrow penetration gaps.

## 7. Camera distance

The orthographic gameplay width is increased from `84` to `132` world units (about 1.57× wider). Camera offset/height is moved farther out and fog density is reduced so the expanded battlefield view remains useful.

This is a gameplay/readability correction only; it does not attempt Visual Master reconstruction.

## Preserved Phase 1 foundation

The correction keeps the already-built foundation intact:

- 10 reusable visual-sector identities
- Previous / Current / Next active streaming
- bounded descriptor preload cache
- logical world coordinates independent from art pixels
- terrain types and bridge-over-deep-water priority
- object pooling and projectile caps
- hull/turret independent state
- multiplayer-ready tank snapshot fields
- vocabulary/economy/save integration points
- fail-closed Admin Preview access

## Validation performed in the task environment

**PASS**

- `node --check js/frontline1944.js`
- `node --check tools/test_frontline1944.js`
- isolated VM load of the patched runtime surface
- hull rotation 0 -> forward world `-Z`
- hull rotation +90° -> forward world `+X`
- positive speed follows hull forward
- negative speed follows the exact opposite hull axis
- strict vehicle sweep stops at a solid wall without axis-slide resolution
- tank-footprint terrain check blocks at a deep-water edge before the center enters it
- bridge center remains traversable when ROAD priority overrides DEEP_WATER
- runtime version marker is exported

Full browser/build regression must still run in VW Dev Studio after Import because the ChatGPT Task ZIP is curated context and does not include the complete runnable repository/build tree.

## Required local acceptance after Apply

Before Phase 2 begins, verify on **both desktop and the actual phone**:

1. HUD says `TANK` and displays `P1.1`.
2. Yellow marker is visibly the hull front and red marker is the rear.
3. DRIVE up moves toward the yellow front marker.
4. DRIVE down reverses toward the red rear marker.
5. DRIVE left/right rotates the hull and does not strafe the tank sideways.
6. AIM rotates only the turret.
7. FIRE sends the shell exactly along the visible barrel.
8. Tree/house/bunker/wall/fortress/deep-water collisions cannot be penetrated at corners/endpoints.
9. Bridge remains crossable.
10. The camera shows materially more surrounding battlefield than the Phase 1 screenshot.
11. Mobile DRIVE/AIM/FIRE all react to touch.
12. The floating Frontline admin launcher is not visible over the controls while the runtime is open.

If desktop shows `P1.1` but the phone still shows the old infantry `PLAYER 100/100` runtime, stop there: do not call Phase 1 accepted. Export a fresh VW Dev Task that explicitly includes the Frontline lazy loader and PWA/service-worker/update path so cache/deploy parity can be fixed from current source evidence.
