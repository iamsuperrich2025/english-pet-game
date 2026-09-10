# Chibi Mecha for Vocab World — round 1399

Ten original Soft Cuboid Chibi models modeled from the colors/gear in `img/robots/robot_01..10.png`. The supplied red chibi reference guides proportions; these are newly modeled lightweight assets, not a scan or exact reproduction.

## Runtime

- `js/mecha-models.js`: allowlisted robot IDs, shared GLB/template loading, per-player articulated clones, retryable fallback, late-load cancellation. Existing `m_01` to `m_10` NetRoom payload is unchanged. Selected fallback, cockpit, weapon and advertised avatar agree.
- `js/mecha-combat-fx.js`: ten cosmetic projectile, muzzle and star-impact designs matching each robot. Six instanced batches, at most twelve active shots. Existing scoring, heat and weapon intervals stay in Adventure3D. Effects are currently visible to the shooter; only avatar/movement uses the existing multiplayer transport.
- Models face -Z, feet at y=0, height 4.6102m. Named body and four independently animated pivots: `Body`, `Leg_L`, `Leg_R`, `Arm_L`, `Arm_R`. Clips: Idle, Walk, Attack. Online walking uses the existing distance-based pivot animation.
- Portable glTF 2.0 PBR, no images/textures, 10 draws per robot, 8,866–9,870 triangles. Normal vectors use normalized 16-bit storage with `KHR_mesh_quantization` and an 8-byte aligned stride; the checked-in loader supports it. Runtime converts color/material once to match Adventure3D's legacy output pipeline without changing other worlds.
- Model byte counts and unique equipment are in `img/models/mecha/manifest.json`. Models total about 2.1MB; load only selected/encountered IDs. Geometry/materials are shared across same-model peers.

## Build and verify

`python tools/mecha/build_robots.py` requires NumPy and SciPy. Generator is deterministic. Do not edit the emitted binaries independently.

`node tools/mecha/test_models.cjs` verifies binary layouts, IDs, real NetRoom in two browser windows over isolated FakeDB listeners, remote changes for all ten models, actual local firing, movement, retry/disposal and three landscape viewports. It blocks all non-local requests and does not write production Firebase data. `--source <build-directory>` runs the same checks against a build.

`node tools/mecha/test_fx.cjs` uses a local root server (default http://127.0.0.1:19459; override MECHA_PREVIEW_URL). It validates ten projectile/impact/expiry patterns and a 500-shot stress sequence. `--source <build-directory>` uses built runtime JS. Override MECHA_TEST_OUTPUT to choose the report directory.

Previews: `/tools/mecha/preview.html` (models, rotate/walk) and `/tools/mecha/fx-preview.html` (projectiles). These are development tools, not production gameplay pages.

Khronos format reference: https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Khronos/KHR_mesh_quantization/README.md
