# Vocab World: Frontline 1944 — Phase 1 Foundation Report

Status: **ADMIN PREVIEW ONLY**  
Scope: **Sector Streamer + Collision + Tank Runtime**  
Baseline source: the current ChatGPT Task ZIP `VW-20260831-160051-a282d1`; no older Frontline source was substituted.

## 1. Current source inspected

The Phase 1 implementation was based on the current exported source files, especially:

- `js/frontline1944.js`
- `css/frontline1944.css`
- `tools/test_frontline1944.js`
- `docs/FRONTLINE1944_REPORT.md`
- `js/home-v2.js` was inspected as supplied context but is **not modified** by this patch.
- Existing shared vocabulary/economy/admin interfaces are consumed rather than replaced.

The prior Frontline implementation was a bounded single-map orthographic prototype with direct character-style movement. Phase 1 replaces the Frontline runtime foundation while preserving the established fortress -> boss -> core -> letter -> word loop and fail-closed admin gate.

## 2. Files created

No new production runtime path outside the existing Frontline area is required. The existing Frontline files are upgraded in place so the current lazy admin route remains authoritative.

## 3. Files modified

- `js/frontline1944.js`
- `css/frontline1944.css`
- `tools/test_frontline1944.js`
- `docs/FRONTLINE1944_REPORT.md`

No Home V2, Adventure, Racing, Picture Dictionary, Firebase, login, PWA, grade resolver, or shared economy file is modified.

## 4. Sector streamer implementation

`SectorStreamer` now maintains an endless logical strip while limiting full simulation/rendering to:

- Previous sector
- Current sector
- Next sector

Descriptors for the following neighbors are preloaded separately. The descriptor cache is bounded. When a sector leaves the active window, its groups are detached, sector terrain/collision data is removed, local smoke materials are disposed, and expensive entity simulation for that sector stops.

There are exactly **10 reusable visual-sector identities**:

1. Farmland
2. Wheat Fields
3. Forest
4. Village
5. Ruined Village
6. River Crossing
7. Defensive Line
8. Artillery Zone
9. Military Camp
10. Fortress Approach

A logical sector index is mapped deterministically to a reusable visual sector ID. The logical world can therefore continue indefinitely without retaining all previous sectors in memory.

## 5. World coordinate implementation

`WorldSpace` provides logical world coordinates independent of screen pixels and visual artwork. Tank, enemies, fortress, terrain, collision, projectiles, and future multiplayer state use world X/Z coordinates. The orthographic camera performs the World -> Screen projection.

Logical sector numbers increase in the tank's default forward direction, so continuous forward travel progresses naturally from Sector 0 to Sector 1, Sector 2, and onward.

## 6. Collision implementation

`CollisionSystem` uses lightweight circle and AABB proxies. Visual meshes are not used as pixel-perfect collision masks.

Implemented solid examples include:

- tree trunks
- houses / ruins
- bunkers
- walls / defensive structures
- fortress walls and fortress core
- bridge rails

Tank movement uses sub-stepped circle resolution with axis sliding. The resolver advances from the last accepted position, preventing a fast vehicle from becoming blocked on one sub-step and then tunneling through a thin wall later in the same frame.

## 7. River / bridge implementation

River appearance and river blocking are separate data.

- Deep river: `DEEP_WATER`, blocked
- Bridge deck: higher-priority `ROAD`, crossing allowed
- Ford: higher-priority `SHALLOW_WATER`, crossing allowed with slowdown
- Bridge rails: physical AABB colliders

This explicitly avoids the incorrect rule “visible water means every water pixel is solid.”

## 8. Terrain type implementation

The extensible terrain table includes:

- `ROAD` — 1.08x
- `GRASS` — 1.00x
- `MUD` — 0.58x
- `DAMAGED_GROUND` — 0.78x
- `SHALLOW_WATER` — 0.43x
- `DEEP_WATER` — blocked
- `FORTIFICATION` — blocked

Terrain zones use priorities so a bridge or ford can safely override a deep-water river zone without coupling gameplay to art pixels.

## 9. Occlusion implementation

The scene now uses the requested ordered architecture:

1. Background
2. Terrain
3. Roads / Water
4. Ground Decoration
5. Gameplay Props
6. Actors
7. Foreground Occluders
8. Combat FX
9. Atmosphere

Tree trunk and tree canopy are separate objects. Canopies carry a depth anchor and foreground priority. Actor and occluder render ordering is updated from world depth while normal WebGL depth testing remains available for the actual geometry relationship.

## 10. Tank runtime implementation

The player is now an armored vehicle runtime instead of an infantry-style character runtime.

Movement includes:

- forward
- reverse
- acceleration
- braking / coasting
- vehicle turning
- terrain speed modifiers
- collision response
- lateral world boundary protection while forward/back sector travel remains endless

The tank has more weight than instant character-direction movement while remaining responsive for mobile controls.

## 11. Hull / turret implementation

Hull and turret are separate transform groups.

- Hull rotation follows driving/steering.
- Turret rotation follows aim input.
- The tank can drive in one direction while aiming/firing in another.
- Mouse/pen ground aiming is supported for desktop testing.
- Mobile has a separate AIM stick in addition to DRIVE and FIRE.

Future UI anchors are already present for player name, HP, and floating damage.

## 12. Projectile foundation

Player and enemy shell records contain:

- world position
- direction
- speed
- damage
- owner ID
- weapon ID
- impact event
- lifetime
- team
- collision radius

Projectile travel is sub-stepped to reduce tunneling through actors/solids. Impact events feed lightweight pooled FX. This structure can later add tracer, muzzle flash, smoke trail, ballistic impression, recoil, sparks, dust, explosion, and transient light without replacing the projectile contract.

## 13. Pooling implementation

Bounded object pools are used for:

- player projectiles: max 40
- enemy projectiles: max 24
- transient impact FX: max 60

Expired/impacted objects are released back to their pools instead of creating unlimited retained objects.

## 14. Multiplayer-ready fields

The local tank exposes a network-ready snapshot containing:

- player ID
- display name
- position
- hull rotation
- turret rotation
- HP / max HP
- active weapon
- fire event serial
- visual upgrade tier
- damage statistic
- hull / armor / engine / turret tiers
- main / special weapon IDs
- skin ID

`interpolateRemoteTank()` is provided for future remote-state smoothing. Phase 1 deliberately does **not** invent or modify Firebase room paths.

Damage records contain source ID, target ID, value, kind, and timestamp, which keeps later Match Damage and Lifetime Damage ranking work attributable.

## 15. Mobile optimizations

- active sector count is bounded to 3
- descriptor preload cache is bounded
- inactive sector enemies/fortress simulation is skipped
- shared geometry/material cache is reused across sectors
- sector-specific smoke materials are disposed when sectors leave the active window
- projectile and FX counts are capped
- renderer DPR is capped at 1.35
- antialiasing/shadows are reduced on lower-core devices
- Three.js remains lazy-loaded only after admin access succeeds
- landscape DRIVE / AIM / FIRE controls have short-screen CSS rules
- no 4K map or giant uncompressed whole-world image is introduced

## 16. Regression / acceptance test results

### Server-side validation performed on the exported task context

**PASS**

- `node --check` on patched `js/frontline1944.js`
- `node --check` on patched `tools/test_frontline1944.js`
- logical world coordinate round-trip
- 10 visual sector IDs and reusable mapping range
- bounded descriptor cache
- Tank -> tree trunk = blocked
- Tank -> house = blocked
- Tank -> bunker = blocked
- Tank -> fortress wall = blocked
- Tank -> deep river = blocked
- Tank -> bridge = allowed
- Tank -> ford = shallow-water terrain
- Tank -> mud = reduced speed
- swept movement does not tunnel through tested fortress wall
- foreground occluder ownership contract
- independent hull/turret values in tank snapshot
- remote interpolation contract
- bounded/reusable object pool
- explicit mobile object caps
- future player name / HP / damage anchors

### Full repository regression to run after Import in VW Dev Studio

The exported Task ZIP is a curated source-context package and does not contain the full runnable repository (`package.json`, `index_classic.html`, `js/data/f1_vocab.js`, vendored Three.js, and the full build tree are not all present). Therefore full browser/build claims are intentionally **not fabricated on the server**.

The patched `tools/test_frontline1944.js` is prepared to validate the real repository after import, including the existing admin lazy route, shared P.1-P.6 vocabulary source, shared economy/save hooks, terrain/collision foundation, mobile controls, object caps, and multiplayer-ready tank state.

## 17. Build result

- JavaScript syntax validation: **PASS**
- Phase 1 isolated foundation unit validation: **PASS**
- Full `npm run build`: **NOT EXECUTED in the curated ChatGPT Task ZIP environment** because the complete repository/package files were not exported. Run VW Dev Studio **Build** immediately after applying the patch.

## 18. Known limitations

- This is intentionally **Phase 1 Foundation**, not Visual Master convergence.
- Sector visuals remain inexpensive procedural/primitive representations suitable for validating streaming/collision/depth. Phase 2 should replace the main presentation with authored/generated lightweight battlefield art while retaining these logical systems.
- Enemy defender visuals are still lightweight placeholders; Phase 1 only requires the player runtime to become a tank.
- Multiplayer networking is not activated yet; only the state contract and interpolation foundation are prepared.
- Final realistic shell FX, recoil, tracer, smoke trail, explosions, transient lighting, ranking UI, garage/shop, and persistent upgrade purchase flow remain later phases.
- Browser rendering/mobile FPS must be measured on the actual local project after import because this task export does not include a runnable complete web build.

## 19. Exact next step — Phase 2

**Phase 2 — Visual Reconstruction** should keep the Phase 1 world/terrain/collision/tank contracts unchanged and replace only the presentation layer with the planned lightweight high-quality battlefield pipeline:

- approximately 10 authored/generated reusable sector art sets
- farmland / wheat / forest / village / ruins / river / defense / artillery / camp / fortress-approach visual identities
- optimized WebP/AVIF where appropriate
- separate tree canopy / roof / arch foreground occluders
- reusable props, decals, craters, debris, fog, smoke and atmosphere overlays
- visual variation driven by logical sector seed so repeated sector art does not look like a direct loop
- screenshot comparison against the supplied Frontline 1944 Visual Master at mobile landscape sizes

The Phase 2 rule should be: **upgrade visuals without moving gameplay collision back into pixels and without increasing endless-world memory with distance traveled.**
