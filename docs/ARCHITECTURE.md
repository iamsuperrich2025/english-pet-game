# Architecture

## Runtime shape

Vocab World is a static browser/PWA application. It has no package build, module bundler, or framework runtime. HTML loads classic features as ordered global scripts; large 3D engines are executed lazily through `loadScriptOnce` when the player enters a world.

There are two page-level entry points:

1. `index.html` is the PWA start URL. It boots the standalone Vocab City scene from `city3d.js` and routes building interactions toward game destinations or the classic lobby.
2. `index_classic.html` loads data, state, UI, learning games, Firebase integration, and finally `main.js`. Authentication chooses cloud/local state, then `bootGame` opens registration or the dashboard.

## Main flow

```text
page bootstrap
  -> static data/manifests
  -> utilities + local state/migrations
  -> UI/game modules
  -> auth + online SDK
  -> bootGame/dashboard
  -> feature or world admission in ui.js
  -> lazy engine/data/GLTF loader
  -> engine-owned scene + input + loop + HUD
  -> progression events/saveState
  -> periodic authPushSave + online presence
```

## Ownership boundaries

- `state.js` is the durable gameplay source of truth. It owns defaults, migrations, economy/care rules, daily quests, and local serialization. Feature modules may mutate state through existing rules, then call `saveState`.
- `auth.js` owns identity and whole-save synchronization. It reconciles local/cloud timestamps and supports offline-first play. It does not own gameplay rules.
- `online.js` owns persistent/social realtime features. `netroom.js` is the bounded room/presence transport used by 3D worlds. World engines own visual peer models and world-specific packets.
- `ui.js` owns classic lobby rendering, panels, admission checks, and lazy world loading. It should not absorb renderer physics or world AI.
- `game.js` owns the core matching/quiz loop. Dictionary/band/exam modules provide content to existing gameplay rather than owning central progression.
- `city3d.js` owns the page-level city scene and its camera gestures/building interactions. It is independent of Adventure3D.
- `adventure3d.js` owns one reusable renderer/camera and cached scenes for several modes. `hotel3d.js` only builds/query-updates hotel geometry, lights, surfaces, and solids; hotel quests, ghosts, player control, and HUD remain in Adventure3D.
- `arena3d.js`, `invasion3d.js`, `moto3d.js`, `f1_3d.js`, and `shootword.js` are standalone engines. Each owns its scene, camera, input, animation loop, collision/physics, HUD, and exit cleanup.
- Character presentation has two paths: live GLB/AnimationMixer in `lobby3d.js`, and lightweight baked sprite/video/image behavior through `petbehavior.js`, `images.js`, `ui.js`, and CSS.
- Audio has shared controls in `util.js`/`music.js`, but complex worlds own their vehicle/ambient/weapon sound lifecycle.

## Scene, camera, interaction, and collision

Every 3D engine creates its own Three.js scene graph. There is no shared scene manager or general physics library. Collision is deliberately world-specific and data-oriented: hotel solid boxes/surfaces, drive navigation grids/footprints, Invasion occupancy/ray tests, F1 spatial track lookup, and simple circle/box tests in smaller modes.

Mobile controls are also engine-owned because interaction differs: city orbit/pan gestures, first-person look/move, vehicle/cockpit controls, arena joystick/skills, and shooting gestures. A movement request must first be routed to its world engine.

## Vocabulary and gameplay flow

Core and banded datasets feed the matching/quiz engine and vocabulary book. World modes choose target words locally, award progress/rewards into central state, and can emit `questEvent` for cross-game daily quests. Standardized exams use separate lazy JSON manifests but share state, UI, and award conventions.

## Save and online flow

`saveState` writes the serialized canonical state to localStorage and advances `savedAt`. After authentication, `authPushSave` uploads the whole state only when it changed or a force sync is requested. On login, cloud/local timestamps and `ownerUid` prevent cross-account overwrite. Profile photos are stored separately to avoid bloating every save.

Firebase presence, leaderboards, social data, and 3D room packets are separate from the whole-save blob. Offline play continues locally and syncs after Firebase becomes available.

## Delivery

The service worker uses network-first for code and cache-first for media/vendor assets. The repository is served directly; deployment stages tracked `git HEAD`, validates referenced assets/undefined calls/template strings, generates a temporary Firebase Hosting config, and deploys the staged static tree. Documentation and tooling are excluded from hosting.
