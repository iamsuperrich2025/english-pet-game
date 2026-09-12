# Vocab World: Codex Navigation Rules

Use this sequence for every repository task:

`REQUEST -> docs/PROJECT_MAP.md -> subsystem -> target symbols/files -> minimal patch -> targeted validation -> complete`

1. Read `docs/PROJECT_MAP.md` before source discovery. Use `handoff/CODE_MAP.md` to locate symbols and zones inside large files.
2. Follow the repository session/deployment rules in `HANDOFF.md`; read other handoff documents only when the map or task points to them.
3. Inspect only the primary and related files for the responsible subsystem. Do not scan the repository broadly unless the map is missing or the change crosses ownership boundaries.
4. Patch incrementally. Avoid unrelated refactors, global cleanup, or moving working code while implementing a focused request.
5. Reuse existing state, asset loading, networking, input, collision, audio, and UI patterns before adding another system.
6. Preserve script load order and global public APIs. This project has no bundler; dependencies are order-sensitive browser globals.
7. Protect mobile landscape behavior and 3D performance. Do not raise DPR, draw calls, shadow cost, per-frame allocations, network frequency, or asset weight without measurement.
8. Validate progressively: syntax/diff checks first, subsystem harness next, then browser/runtime and mobile viewport checks when behavior or visuals change.
9. Never weaken tests, visuals, fidelity, reliability, or algorithms to save tokens. Save tokens by narrowing reads and tool calls.
10. Update `docs/PROJECT_MAP.md` when ownership, entry points, public symbols, or file routing changes.
11. Update `docs/CURRENT_STATE.md` only for durable architecture, product-state, or limitation changes. Update `docs/PERFORMANCE.md` when performance policy materially changes.
12. Do not deploy or modify Firebase configuration/data unless the user explicitly requests it. For approved shipping, follow `HANDOFF.md` and the repository launcher workflow.

Large-file rule: never read all of `js/adventure3d.js`, `js/invasion3d.js`, or `js/ui.js` for a localized task. Find the subsystem/symbol in `docs/PROJECT_MAP.md`, then locate its current zone in `handoff/CODE_MAP.md`.
