# Mobile 3D Performance

This file records observed policy, not a mandate to implement speculative changes. Measure the target world on representative landscape mobile viewports before and after any performance patch.

## Existing optimizations

### Loading and asset delivery

- The classic shell loads 2D/data systems first. Heavy world engines are executed through `loadScriptOnce` only when entered; manifests split dictionary/band/exam data into lazy chunks.
- The service worker uses a generated content hash as the cache key for lazy scripts, JSON, GLB, images, and audio, so a deployment downloads only modified files. Startup JS/CSS use immutable hashed URLs. Videos bypass the service worker to preserve range requests.
- Several production models are manually reduced `*_lite.glb` variants; original high-poly assets are excluded. Many environment textures use WebP or resized derivatives.
- GLB loads are cached or queued inside individual engines (for example lobby, Adventure3D, and Invasion) so repeated actors clone a loaded source rather than refetching it.
- Optional image/model assets have fallbacks, avoiding hard failure or mandatory downloads for absent visual upgrades.

### Renderer and pixel ratio policy

- Vocab City: antialias on, high-performance preference, DPR capped at 2.
- Lobby GLB scene: antialias/alpha on, high-performance preference, DPR capped at 2; render loop stops when the dashboard is inactive.
- Adventure3D: antialias off, DPR capped at 1.6.
- Vocab Arena: antialias off, high-performance preference, DPR capped at 1.45.
- Invasion: antialias off, DPR capped at 1.6, ACES tone mapping.
- Moto, F1, and ShootWord: antialias on, DPR capped at 2.
- Frame deltas are clamped in the principal loops to avoid simulation explosions after tab stalls.

### Shadows and lighting

- Most worlds use Hemisphere/Ambient/Directional/Point lights without enabling renderer shadow maps, keeping shadow cost low.
- The hotel uses only two warm PointLights per floor, `castShadow=false`, and visibility-culls other floors. Transition zones show at most the adjacent floors/lights.
- Invasion is the notable high-fidelity exception: one shadow-casting sun uses a bounded 1024x1024 PCF soft shadow map and a limited shadow camera volume. Repeated objects selectively set cast/receive shadows.
- Many convincing shadows/glows are cheap transparent meshes, sprites, baked textures, or material lighting rather than dynamic shadow maps.

### Geometry, draw calls, and visibility

- Invasion batches repeated battlefield props and tree parts into `InstancedMesh`, reducing hundreds of potential draw calls to a few batches.
- Invasion has distance LOD for heavy tree/house GLBs, updates LOD only after movement or at reduced frame cadence, and caps transient effects/entities.
- Moto instances flowers, buildings, roofs, trees, and posts.
- Adventure drive mode instances repeated roadside buildings/roofs and combines large road/decal triangle sets into shared geometries.
- Hotel groups geometry by material and hides floor-specific rooms, props, mission items, and lights outside the active/adjacent floors.
- `NetRoom.drawBudget` ranks peers by distance and limits rendered online avatars; update/send cadence grows with crowd size.
- Fog, finite camera far planes, and default Three.js frustum culling reduce distant work. Objects set `frustumCulled=false` only when their overlay/large-mesh behavior requires it.
- Alpha-cutout assets use `alphaTest` where possible instead of large numbers of sorted transparent surfaces.

### Textures and effects

- Common colors/materials/geometries and many `CanvasTexture` results are cached or reused within engines.
- Procedural textures avoid network weight and let repeated geometry share materials.
- Additive glows/particles commonly disable depth writes to reduce visual sorting artifacts; effect counts are bounded and Vocab Arena reduces bursts on low-core devices or when `state.noAnim` is set.
- Application effects use standard materials rather than a post-processing chain, avoiding extra full-screen render passes.

### Animation loops and lifecycle

- World loops use `requestAnimationFrame`; standalone engines cancel it on exit. Audio loops, network room membership, listeners, and transient entities have explicit stop/leave paths.
- Vocab Arena performs the strongest teardown: it removes listeners/entities, recursively disposes scene resources, disposes the renderer, and forces WebGL context loss.
- Adventure3D keeps renderer and per-mode scenes cached for fast re-entry, but clears mode-specific transient entities and stops audio/network state on exit.
- Moto, F1, and Invasion stop their frame loops and world audio/network state on exit while retaining built engine resources for reuse.
- City pauses/restarts background music on visibility changes; its page-level render loop is expected to live for the page lifetime.
- Short-lived shots, particles, chat sprites, and generated materials are usually disposed when removed. Shared cached textures are deliberately not disposed from individual instances.

### Collision and per-frame cost

- No general rigid-body engine runs every frame. Adventure modes use footprints/circles/typed-array grids; hotel uses solid boxes plus surface queries; Invasion uses occupancy grids and analytic ray/sphere tests; F1 uses a spatial track grid.
- Drive GPS uses a separate navigation grid and A*-style routing only when selecting/updating a route, not as a full per-frame physics solve.
- Expensive crowd/LOD/visibility work is throttled or triggered by movement rather than blindly recomputed every frame in the optimized worlds.

## Potential future optimizations

Do not implement these without a scoped task, baseline measurements, and visual regression checks.

1. Add a shared adaptive quality policy for mobile DPR and selected effects. Current caps differ by engine, and DPR 2 plus antialiasing in City/Lobby/Moto/F1/ShootWord may be expensive on high-DPR phones. Prefer dynamic frame-time response over a permanent visual downgrade.
2. Add a measured GPU-memory budget/eviction policy for cached Adventure3D scenes and engine-local GLB/texture caches. Fast re-entry is valuable, but visiting many worlds can retain multiple scene graphs in one session.
3. Audit teardown consistency for Moto, F1, Invasion, ShootWord, Lobby3D, and Adventure3D. Determine which resources intentionally persist and which accumulate across repeated enter/exit cycles; only dispose confirmed growth.
4. Centralize model/texture fetch caching without centralizing world gameplay. Engine-local caches can duplicate CPU/GPU assets when the same GLB is used in multiple worlds; any asset manager must preserve correct skinned-mesh cloning and ownership-aware disposal.
5. Evaluate KTX2/Basis textures and Meshopt/Draco GLB compression for the heaviest measured downloads. The current loader has no decoder configuration; compare decode cost, browser support, cache size, and visual fidelity before adopting.
6. Extend instancing/merged geometry to repeated City and non-drive Adventure props identified by renderer call counts. Avoid batching interactive/animated objects or breaking per-object culling for marginal wins.
7. Pool high-frequency projectile/particle geometry/materials in worlds where profiling shows allocation or garbage-collection spikes. Existing disposal is useful, but repeated construction still costs CPU.
8. Add per-engine performance telemetry/harness assertions for FPS, renderer calls, triangles, texture memory, and enter/exit memory deltas at 812x375 and a representative high-DPR device size. Keep thresholds world-specific.
9. Pause or reduce the page-level City loop when `document.hidden`, provided presence, animations, and camera transition timing resume correctly. Validate battery impact and return-from-background behavior.
10. Review shadow caster/receiver scope in Invasion with GPU timings. Preserve its visual hierarchy while excluding distant or visually irrelevant meshes from the bounded shadow pass.

## Performance change checklist

- Route through `docs/PROJECT_MAP.md` to the exact engine and symbol zone.
- Record baseline viewport, DPR, calls, triangles, FPS/frame time, and memory where available.
- Preserve image quality and gameplay behavior; use adaptive or distance-based reductions before global removal.
- Test entry, active play, pause/background, exit, and second entry.
- Check low landscape (812x375), a high-DPR phone profile, and desktop regression.
- Update this document only when the durable strategy changes.
