# Vocab World: Frontline 1944 — Phase 1.2.6 Movable FIRE + Global Double-Tap FIRE Report







Status: **ADMIN PREVIEW ONLY**  



Scope: **Phase 1 Foundation acceptance — Phase 2 cosmetic reconstruction has NOT started**  



Current Task baseline: `VW-20260901-190151-e90b9c`







## Current source evidence used







This Phase 1.2.6 patch was built only from the current files contained in the supplied VW Dev Studio Task ZIP. The SHA-256 hashes of every supplied context file were rechecked against `TASK_MANIFEST.json` before editing and matched.

Modified current files:

- `js/frontline1944.js`
- `css/frontline1944.css`
- `tools/test_frontline1944.js`
- `docs/FRONTLINE1944_REPORT.md`

No loader/PWA file was supplied in this Task context, so none is modified. No older Frontline source was reconstructed or substituted.







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







## 4. Global mobile touch routing and gesture ownership







Phase 1.2.5 no longer requires the DRIVE/AIM joystick DOM elements to receive the initial pointer/touch event. A single `GlobalMobileTouchRouter` listens at window capture level, geometrically hit-tests the current screen-space rectangles of DRIVE, AIM and FIRE, and assigns each pointer/touch identifier to exactly one control role until release.







Once acquired, DRIVE/AIM continue receiving normalized coordinates even when the pointer leaves the visual joystick rectangle or pointer capture is unavailable/lost. Pointer capture is not required by the new architecture. FIRE uses the same ownership map, so DRIVE + AIM + FIRE can coexist without one release clearing another control.







The router only prevents/consumes events that are actually owned by a Frontline control zone. The Exit button and unrelated interactive UI are explicitly protected from control acquisition. Legacy Touch Events use the same geometric ownership model only on browsers without Pointer Events.







## 5. Mobile infantry / stale-runtime investigation







The current `js/frontline1944.js` module itself has no infantry fallback path. When this Phase 1.2 module opens it:







- renders the Frontline HUD as `TANK`



- displays `P1.2.5`



- publishes `window.__VW_FRONTLINE1944_RUNTIME__` with `kind: "tank"`



- marks the root as a tank runtime



- runs the same `TankRuntime` regardless of desktop/mobile input source







Therefore, **if a device is executing this current module, it cannot intentionally select an infantry player runtime from inside this file**.







However, the supplied current Task ZIP did **not** include the existing repository files that own the Frontline lazy loader / page shell / PWA update path, specifically the current contents of files such as `index_classic.html`, `sw.js` and `js/app-update.js`. The architecture map confirms those systems exist, but their current source was not exported as editable context. Under Source Context Guard rules this patch must not guess or rewrite those existing files.







Consequently Phase 1.2 hardens runtime ownership and makes stale-loading immediately diagnosable, but a phone that still shows `PLAYER 100/100` and no `P1.2.2` after the patch is evidence that the phone never executed the supplied Phase 1.2 module. In that case the next Task ZIP must include the current loader/service-worker/update files so the stale mobile asset path can be corrected from evidence rather than reconstructed.







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







1. HUD says `TANK` and runtime marker says `P1.2.5`.



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







If the phone still displays old `PLAYER 100/100` and does not display `P1.2.5`, do not mark Phase 1 accepted: that specifically proves the phone is loading a different/stale Frontline execution path outside the source files supplied by this Task ZIP.







## Phase 1.2.2 — Visual Forward Vector Lock (2026-08-31)







Direction correction rebased from the current Phase 1.2 source supplied by VW Dev Studio.







- Root cause: the runtime used `x = +sin(yaw)` for movement, while the visible yellow hull-front arrow is a Three.js child pointing along local `-Z`. Under Three.js Y rotation that visible axis transforms to `x = -sin(yaw), z = -cos(yaw)`. The old acceptance test compared `driveDelta()` against the same incorrect helper, so the visual/runtime sign mismatch could pass automated tests.



- Canonical rule now: `ArrowUp` / `W` uses positive throttle and moves along the exact world vector represented by the visible yellow hull-front arrow. `ArrowDown` / `S` uses negative throttle and moves exactly 180 degrees opposite that arrow.



- Hull right steering now uses the matching Three.js yaw sign, so from the default `-Z` heading a right command rotates the visible front toward `+X`.



- Collision OBB axes inherit the same corrected hull forward/right basis, so visual hull heading and collision footprint no longer mirror each other on X after turns.



- Desktop mouse aim and mobile aim convert world direction back to turret yaw through the same canonical inverse transform. Projectile firing still derives from the actual barrel/muzzle world transform.



- Runtime marker: `P1.2.2-20260831-DIRECTION-LOCK`.



- Deterministic acceptance now uses an independent Three.js local-`-Z` visual-direction oracle across all 360 integer-degree headings, preventing the prior self-validating sign error.







This remains Phase 1 Foundation acceptance work. No Phase 2 cosmetic reconstruction is included.



## Phase 1.2.3 — Mobile Drive Input Hardening (2026-08-31)







Current-device evidence after Phase 1.2.2: desktop tank movement, hull direction and projectile/barrel agreement are accepted; the real phone now renders the tank runtime and FIRE works, but DRIVE does not move or steer the tank. This proves the stale infantry/runtime-loader symptom is no longer the active blocker and narrows the defect to mobile control event delivery.







Current-source root cause/risk found in `bindStick()`: movement updates were attached to the stick element itself and active state was reset on `lostpointercapture`. If a mobile browser rejects, loses, or does not reliably route pointer capture after a centered touch, DRIVE can remain at approximately zero even though FIRE (which only needs press/release) still works.







Phase 1.2.3 changes only the mobile input transport and diagnostics; canonical desktop/tank physics are intentionally locked:







- DRIVE/AIM pointer down still attempts pointer capture, but capture is no longer required for movement.



- Active pointer movement is tracked at `window` capture level until the matching pointer up/cancel, so dragging continues even if capture fails or is lost.



- `lostpointercapture` no longer resets DRIVE/AIM; it only records that capture is unavailable while window tracking continues.



- Legacy Touch Events use the same window-level move/end ownership on browsers without Pointer Events.



- FIRE release is also matched by pointer/touch ID at window level so multi-touch DRIVE + AIM + FIRE sessions cannot cancel one another accidentally.



- A compact Admin Preview input diagnostic is shown under the runtime marker: `DRIVE READY · PTR/WIN` at rest and normalized DRIVE throttle/steering while active.



- `foundationDiagnostics()` now exposes DRIVE/AIM active ID, normalized axes, transport, capture state, move count and last event time.



- Runtime marker: `P1.2.3-20260831-MOBILE-DRIVE-HARDENED`.







Deterministic acceptance now simulates a mobile browser where `setPointerCapture()` throws and `lostpointercapture` fires. The test then sends movement only through the window-level pointer path and requires: forward throttle, reverse throttle, right steering, clean release/centering, and actual forward/turning motion through the authoritative `TankRuntime`. The existing 360-degree direction, zero-lateral-velocity, collision, sector-heading and muzzle-ray tests remain unchanged and continue to pass.







This is still Phase 1 Foundation acceptance work. No Phase 2 cosmetic reconstruction is included.







## Phase 1.2.5 — Mobile Aim Hold Correction + Floating Mobile Controls (2026-08-31)

### Source-confirmed AIM release cause

The applied Phase 1.2.4 source correctly routed active mobile AIM while the AIM pointer was held. The release path then called `resetStickState()` for AIM, which made `G.aim.active` false and zeroed the stick vector. `UnifiedTankInputAdapter` consequently stopped granting mobile AIM authority and immediately fell back to the desktop pointer command. A stale desktop pointer / compatibility mouse event could therefore replace the last mobile turret target after touch release. `TankRuntime.step()` itself already preserved its current `turretTargetHeading` whenever a command supplied no new heading, so the tank/turret physics did not need to be rewritten.

### Persistent mobile AIM authority

Phase 1.2.5 adds a dedicated `mobileAimLatch` outside pointer-down state. Valid AIM drag vectors are converted through the existing `screenAimDirection()` / `rotationFromForward()` path and stored as the last valid absolute turret heading. Releasing or cancelling the AIM pointer ends only pointer ownership; the latched heading remains authoritative for mobile AIM until a new AIM gesture updates it or a genuine accepted desktop mouse/pen aim source deliberately takes authority. Touch-generated compatibility mouse input is rejected using pointer-source checks plus a short touch-suppression window.

The canonical turret world transform, barrel orientation, muzzle world transform, projectile spawn and projectile direction are unchanged.

### Floating DRIVE / AIM / FIRE

`GlobalMobileTouchRouter` remains the one global/capture-level mobile transport. Phase 1.2.5 changes only acquisition geometry and per-gesture control origins:

- DRIVE may begin anywhere in its explicit lower-left safe zone; its visible joystick recenters for that gesture and continues to own the same pointer outside the visual circle.
- AIM may begin anywhere in its explicit lower-right AIM zone; its visual control recenters and feeds the same turret command path. Releasing AIM preserves the final latched turret heading.
- FIRE has its own smaller right-side activation territory, separate from AIM; the button recenters toward the accepted touch and fires immediately.
- Each role retains an independent pointer/touch identifier, so DRIVE + AIM + FIRE can remain active simultaneously and releasing one pointer cannot reset the others.

The control zones are computed from the current Frontline viewport, actual control element sizes, safe-area CSS insets and current DOM rectangles. Initial acquisition is rejected over the Exit button, top HUD/Target Word panel, Objective, Boss panel and bottom state panel. The router still tracks owned pointers after they leave the initial control rectangle; pointer capture is not the sole delivery mechanism.

### Desktop diagnostic visibility

The Phase 1.2.4 diagnostic overlay is now hidden during ordinary fine-pointer desktop gameplay. It remains available for Admin Preview on a coarse-pointer/mobile environment, or when explicitly enabled with `window.__VW_FRONTLINE1944_INPUT_DIAGNOSTICS__ = true`, `?fl44diag=1`, or `?frontlineInputDiag=1`. CSS also enforces `[hidden]{display:none!important}` so code-looking diagnostics cannot remain visible solely because of previous styling.

### Desktop / Tank Runtime lock evidence

The canonical `TankRuntime` motion block and cannon/muzzle transform block are semantically unchanged from the verified Phase 1.2.4 baseline. Phase 1.2.5 edits input arbitration, touch geometry, diagnostics visibility, cache-busting and tests only. Hull-forward translation, reverse, steering/yaw, swept collision, zero-strafe behavior, turret physics and projectile world alignment remain locked.

### Deterministic acceptance evidence

`node tools/test_frontline1944.js` executes all 32 requested Phase 1.2.5 deterministic acceptance checks and passes in the supplied Task context: DRIVE forward/reverse/steering/diagonal/zero-strafe; outside-circle ownership and release; AIM acquisition, drag, release latch, no Up-Right reset, no stale-desktop takeover and compatibility-mouse rejection; reacquisition at new floating centers; dynamic FIRE; protected UI geometry; every requested two- and three-finger combination; independent release; desktop keyboard/mouse lock; one shared TankRuntime; barrel/muzzle projectile alignment; 360-degree forward/reverse; collision; sector-transition heading stability; desktop diagnostic hiding; and retained mobile/admin diagnostics.

The isolated Task ZIP does not include the current shared `js/data/f1_vocab.js` dependency. The harness therefore reports that vocabulary audit as skipped only when the file is absent; after import into the full project, the same test automatically executes the vocabulary audit. Real-device acceptance on the user's phone remains mandatory before Phase 1 Foundation is accepted.

## Phase 1.2.4 — Global Mobile Touch Router (2026-08-31)







### Source-confirmed failure in Phase 1.2.3







The current Phase 1.2.3 source proved that the previous hardening globalized only **movement/release tracking**. DRIVE/AIM still had to receive their initial `pointerdown`/`touchstart` directly on the joystick DIV before `target.active` became true. Window-level `pointermove` therefore could not help if the real phone's initial DOM hit-test targeted the Three.js canvas or another layer.







FIRE was structurally different: it had its own press handler and only needed a down/up state. That explains why FIRE could work while DRIVE/AIM remained inactive. The exact real-device element receiving the failed DRIVE/AIM touch could not be proven from the old source alone because Phase 1.2.3 had no full DOM hit-test overlay; Phase 1.2.4 adds that evidence instead of guessing.







### Replacement architecture







- One `GlobalMobileTouchRouter` receives pointer events at `window` capture level.



- On pointer/touch down it reads current `getBoundingClientRect()` values for DRIVE, AIM and FIRE and assigns ownership geometrically.



- Ownership is stored by pointer/touch identifier and remains fixed until matching up/cancel.



- DRIVE maps only to normalized `throttle` + `steering`; it never adds world-space lateral movement.



- AIM writes only the existing turret target path; barrel/muzzle/projectile transform code is unchanged.



- FIRE is owned independently and can coexist with DRIVE/AIM.



- Releasing one pointer resets only its owned control.



- `lostpointercapture` is diagnostic only; the router does not require pointer capture.



- Protected interactive UI such as Exit is not acquired even if its rectangle overlaps a control rectangle.



- Frontline lazy-loaded JS/CSS now use the Phase 1.2.4 cache-bust query `?v=124` so the real phone is less likely to execute the previous 1.2.3 resource after deployment.







### Temporary Admin Preview diagnostics







`#fl44-input-diag` displays live:







- input transport (`POINTER` / `TOUCH`)



- active pointer count



- DRIVE down/id/x/y/throttle/steer



- AIM down/id/x/y



- FIRE down/id



- actual event target



- `document.elementFromPoint()` hit-test target







Diagnostics are controlled by `CFG.mobileInputDiagnostics` and can be disabled/removed after Phase 1 Foundation acceptance.







### Desktop Runtime Lock evidence







The Phase 1.2.4 edit does not alter the canonical tank motion/turret runtime block (`forwardFromRotation`, `driveDelta`, desktop/mobile normalized command adapters, `UnifiedTankInputAdapter`, or `TankRuntime.step`). The established Three.js local `-Z` forward convention, non-holonomic movement, swept collision, turret independence and muzzle world transform remain the same.







### Deterministic acceptance evidence in this Task ZIP







A task-local harness executed every Phase 1.2.4 input/runtime guard that can run from the supplied source context and passed: global canvas-target acquisition, forward/reverse, left/right yaw, diagonal drive, zero strafe, outside-rectangle drag, lost-capture continuity, release reset, DRIVE+AIM+FIRE multi-touch, independent release, AIM-to-turret runtime, shared TankRuntime, 360-degree direction lock, collision, sector-heading stability and projectile/muzzle alignment.







The supplied Task ZIP does not contain the existing `js/data/f1_vocab.js` file referenced by the repository-wide `tools/test_frontline1944.js`, so the final vocabulary-source audit cannot be executed inside this isolated Task ZIP without fabricating a missing existing source file. After import into the real project, run the full `node tools/test_frontline1944.js`; the current project contains that shared vocabulary dependency.







This remains **Phase 1 — Foundation Acceptance**. Phase 2 has not started.

## Phase 1.2.6 — Movable FIRE + Global Double-Tap FIRE (2026-09-01)

### Accepted runtime lock

The user real-device verified DRIVE forward/reverse, left/right steering, hull-forward movement, zero strafe, mobile AIM/heading retention, normal FIRE and barrel-aligned projectile direction before this phase. Phase 1.2.6 therefore changes only mobile input/UI ergonomics around FIRE.

A source-level lock comparison against the supplied Phase 1.2.5 baseline confirms the authoritative `TankRuntime`, `DesktopTankInputAdapter`, `UnifiedTankInputAdapter`, `forwardFromRotation`, `rightFromRotation`, `driveDelta`, `tickTank`, `cannonWorldPosition`, `cannonWorldDirection`, `cannonWorldRay`, and `firePlayer` blocks are byte-identical.

### Movable FIRE control

- A quick tap on the visible FIRE button queues exactly one mobile FIRE pulse.
- Hold + intentional drag crosses both a movement threshold and a short hold threshold before entering reposition mode, preventing tiny finger jitter from moving the control.
- Repositioning follows the pointer and clamps against the actual viewport, safe-area insets, current DOM rectangles for protected Frontline UI, and the current visible DRIVE/AIM controls.
- The selected FIRE position is stored in `localStorage` as normalized coordinates, independently for landscape and portrait.
- A saved position is recovered through the same clamp/avoidance solver when viewport geometry changes or when a stale stored value is invalid.
- A long stationary FIRE hold retains the existing continuous-fire behavior; once reposition mode begins, continuous fire is stopped and no release pulse is emitted.

### Global deterministic double-tap FIRE

`GlobalMobileTouchRouter` remains the single mobile pointer-ownership router. It now tracks short tap candidates separately from DRIVE/AIM/FIRE ownership and recognizes a double tap using explicit time, distance and per-tap movement thresholds. It does not depend on browser `dblclick`.

A valid double tap emits a queued mobile FIRE pulse through `MobileTankInputAdapter`; it does not create a second Tank Runtime and does not mutate hull heading, turret heading, joystick state, or another pointer's ownership. A third finger can therefore double-tap a safe battlefield region while DRIVE and AIM remain owned by the first two fingers.

Critical UI is excluded using live DOM geometry/targets, including Exit, top HUD/Target Word, objective/fortress navigation, boss/state panels, visible diagnostics/loading/toasts, modal/menu/button-style interactive targets, and the visible DRIVE/AIM/FIRE controls where a tap would conflict with their direct interaction.

### Automated acceptance

The isolated Task-ZIP harness passes all 57 Phase 1.2.6 deterministic checks covering accepted DRIVE/AIM behavior, normal/quick FIRE, reposition suppression, clamping, protected-UI avoidance, local persistence/recovery, deterministic double-tap recognition/rejection, protected-area rejection, DRIVE+AIM+double-tap concurrency, projectile/barrel alignment, unchanged desktop behavior, and the one-TankRuntime architecture.

The supplied Task ZIP does not contain `js/data/f1_vocab.js`, so the vocabulary-source portion of the repository-wide test is skipped only in the isolated harness. It must run after the patch is imported into the full project.

### Source-context limitation

The Phase 1.2.6 Task ZIP did not include the current `index_classic.html`, service worker, app-update loader, or other runtime-loader/versioning source. Under the Source Context Guard, this patch does **not** fabricate or modify those existing files. The full-project loader/cache-bust must therefore remain untouched in this patch; if local/mobile preview serves stale cached Phase 1.2.5 after Apply + Build, export a fresh ChatGPT Task ZIP that includes the current loader/PWA files before changing cache/version references.


This remains **Phase 1 — Foundation Acceptance**. Phase 2 has not started.
