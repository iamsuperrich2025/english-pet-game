# Vocab World — Permanent Development Rules

This file is loaded automatically by VW Dev Studio before AI code changes. Keep it in the Vocab World project root.

## 1. Production safety
- Never deploy automatically after an AI edit.
- Required sequence: edit -> backup -> inspect diff -> build -> local test -> explicit human approval -> production deploy.
- Money, purchases, inventory, housing, rewards, and restoration/refund messages must not disappear automatically when the player needs to read or acknowledge them. Use a clear manual close/confirm action unless a specific feature intentionally says otherwise.
- Avoid destructive migrations and irreversible player-data changes without an explicit migration and rollback plan.

## 2. Character visual standard
- For existing and new 3D gameplay worlds, use the cute block character direction: Cute Blocky 3D Character / Soft Cuboid Chibi / Toy-Block Cartoon 3D.
- Exceptions: Mother Ship world and Adventure World keep their established original character system unless explicitly instructed otherwise.
- Do not make characters look Roblox-like when implementing the cute-block standard.

## 3. Adventure / 2.5D sprite direction standard
- Direction order: Down, Down-Left, Left, Up-Left, Up, Up-Right, Right, Down-Right.
- Every direction must be a true direction view. Do not create one direction by mirroring another.
- Up-Left (UL) is a critical direction: head, face, and torso must visibly face diagonally Up-Left. It must not drift into Up, Left, Down-Left, or Up-Right.
- Walk animation: alternating natural leg steps; arms counter-swing; preserve weapon hand and weapon direction unless the specific animation requires otherwise.
- Sprite exports: transparent PNG when the task is a sprite asset.

## 4. Performance
- Vocab World is a browser game. Prefer mobile-friendly, battery-conscious changes.
- Avoid unnecessary per-frame allocations, excessive particle counts, expensive full-screen postprocessing, and high-frequency network writes.
- Prefer shared/reused materials and geometry where practical.
- Visual upgrades must consider GPU/CPU cost and should keep the established art direction consistent.

## 5. Purchase and housing safety
- Clicking an item must not accidentally perform a purchase if the feature requires confirmation.
- Purchase confirmation flows must provide a clear Cancel action.
- A player who owns a higher-tier house must not be downgraded by clicking a cheaper house. Lower tiers should be disabled/unavailable where appropriate.
- Any corrective restoration/refund flow must clearly tell the player what was restored/refunded and keep that message visible until the player closes/acknowledges it.

## 6. Pet shopping / driving area
- Navigation must lead to reachable road/driveable locations; fences or scenery must not block the intended route.
- On arrival at or near the intended shop trigger, the correct shopping UI should open reliably.
- Pet food and pet fashion shops should follow consistent arrival and interaction rules unless intentionally different.

## 7. Scope discipline
- Preserve unrelated behavior.
- Prefer the smallest coherent change that fully fixes the requested behavior.
- Do not edit secrets, .env files, service-account files, generated build output, node_modules, or .git.
- If a change affects Firebase data structures, authentication, purchases, player balances, or production migrations, treat it as high risk and surface the risk before applying it.

## Integrated Asset Pipeline
- Standard authoring order: Character Style Studio -> Sprite Studio -> Battle FX Studio -> VW Dev Studio Import -> Build/Test -> Deploy.
- Generated packages are authoritative static assets. Runtime code must not regenerate them using AI.
- Sprite direction order remains Down, Down-Left, Left, Up-Left, Up, Up-Right, Right, Down-Right.
- Up-Left (UL) is Critical: true diagonal up-left, head and torso visibly aligned toward up-left, never mirror-derived from Up-Right.
- An asset import is a project change and must invalidate previous Build/Browser deploy approval.
- Production deployment is never initiated by any asset authoring tool.

## Mini Game Creator standard
- New mini games should reuse existing Vocab World player/session, vocabulary, coin/reward, audio, Firebase, navigation, and UI services where they already exist. Do not create parallel duplicate account/balance systems.
- New mini games default to Admin/Test-only visibility until explicitly approved for public players.
- A mini game must not weaken authentication or authorization to make testing easier.
- Coin/reward settlement must be idempotent for one round/result: guard against double-clicks, repeated completion callbacks, reconnects, and duplicate Firebase/client events.
- Reward and money-result messages that the player needs to acknowledge must stay visible until the player closes/confirms them.
- Mobile/landscape controls must be responsive and must not block essential UI.
- Pause, exit, restart, and scene teardown must clean up timers, DOM/window listeners, requestAnimationFrame loops, audio loops, and Firebase/multiplayer subscriptions created by that mini game.
- Prefer shared game infrastructure and small lazy-loaded modules over duplicating heavy renderers or loading every mini game at startup.
- New mini games follow the same production safety sequence: create/edit -> backup -> diff -> build -> local play test/browser test -> explicit human approval -> deploy.
