# Chibi Mecha for Vocab World — round 1400

Ten original Soft Cuboid Chibi models. Round 1400 uses the supplied ten-model reference (`sound/arena/ChatGPT Image Sep 10, 2026, 01_40_27 PM (1).png`) for larger helmets, oval eyes, compact armor, separate eye/core colors and distinct equipment. These are authored approximations, not an exact reconstruction; unseen back surfaces are newly designed. The reference PNG is not shipped or used as a texture.

## Runtime

- `js/mecha-models.js`: allowlisted robot IDs, shared GLB/template loading, per-player articulated clones, retryable fallback, late-load cancellation. Existing `m_01` to `m_10` NetRoom payload is unchanged. Selected fallback, cockpit, weapon and advertised avatar agree.
- `js/mecha-combat-fx.js`: ten cosmetic projectile, muzzle and star-impact designs matching each robot. Six instanced batches, at most twelve active shots. Existing scoring, heat and weapon intervals stay in Adventure3D. Effects are currently visible to the shooter; only avatar/movement uses the existing multiplayer transport.
- Models face -Z, feet near y=0, height about 4.15–4.54m. Named body and four independently animated pivots: `Body`, `Leg_L`, `Leg_R`, `Arm_L`, `Arm_R`. Clips: Idle, Walk, Attack. Online walking uses the existing distance-based pivot animation, with restrained arm motion for the three two-handed weapons (04/08/09).
- Portable glTF 2.0 PBR, no images/textures, 8–10 draws per robot, 16,896–19,764 triangles. Positions use 16-bit coordinates at 1/4096 model unit with per-node scale; maximum rounding error is 0.000123 unit per axis. Normal vectors use normalized 16-bit storage with `KHR_mesh_quantization` and an 8-byte aligned stride; the checked-in loader supports it. Eye and core colors share a separate `KHR_materials_unlit` material. Runtime preserves that material and converts armor color/material once to match Adventure3D's legacy output pipeline without changing other worlds.
- Model byte counts and unique equipment are in `img/models/mecha/manifest.json`. The reference requires smoother curved shells and more equipment detail: the measured budget is now 292,528–339,344 bytes/model (test ceiling 350KB and 21K triangles), about 3.14MB total instead of 2.10MB; load only selected/encountered IDs. Geometry/materials are shared across same-model peers.

## Build and verify

`python tools/mecha/build_robots.py` requires NumPy and SciPy. Generator is deterministic. Do not edit the emitted binaries independently.

`node tools/mecha/test_models.cjs` verifies binary layouts, IDs, real NetRoom in two browser windows over isolated FakeDB listeners, remote changes for all ten models, actual local firing, movement, retry/disposal and three landscape viewports. It blocks all non-local requests and does not write production Firebase data. `--source <build-directory>` runs the same checks against a build.

`node tools/mecha/test_fx.cjs` uses a local root server (default http://127.0.0.1:19459; override MECHA_PREVIEW_URL). It validates ten projectile/impact/expiry patterns and a 500-shot stress sequence. `--source <build-directory>` uses built runtime JS. Override MECHA_TEST_OUTPUT to choose the report directory.

Previews: `/tools/mecha/preview.html` (models, rotate/walk) and `/tools/mecha/fx-preview.html` (projectiles). These are development tools, not production gameplay pages.

Khronos format reference: https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Khronos/KHR_mesh_quantization/README.md

Round 1400 validation: Khronos validator 0 errors/0 warnings for all ten files; source and built game each 97 checks; FX 34 checks; three landscape game viewports and front/back/side/walking images inspected. The generic undefined-call scanner reports `robot_()` from two pre-existing regex literals; these are not function calls (ID validation is covered by the browser test).
