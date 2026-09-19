# Vocab Force (V1 prototype)

Isolated third-person vocab combat mini-game. Admin/dev only. Not a public menu item.

## How to test locally

Serve the **repository root** (the usual `english-pet-game` Python server), then open:

`http://localhost:<port>/minigames/vocab-force/index.html`

This preview sets `VocabForce.devPreview = true` and does not require Google login.

In the classic lobby, an **admin-only** hidden rail button `Vocab Force` also lazy-loads the same modules. Normal players never see it.

Do not deploy this unfinished prototype.

## NEX animation architecture

Every file in `characters/next/animations/` is a full Mixamo character GLB (~28 MB) with:

- 1 skinned mesh (`output`)
- 1 `BakedMaterial` + 3 images
- 28 `mixamorig:*` bones (all current GLBs match)
- 1 real clip + a 0.08s leftover `.001` clip

Runtime loads **one** body (`nex_walk.glb`) and copies AnimationClips from the other files onto a single `AnimationMixer`. Extra scenes are never added to the world.

### Mapped V1 states (real clip names)

| State | File | Clip |
|---|---|---|
| Idle | `nex_walk.glb` | `Walking.001` (no idle GLB exists) |
| Walk | `nex_walk.glb` | `Walking` |
| WalkBackward | `nex_Walk_Backward.glb` | `Walk_Backward_with_Sword_inplace` |
| Run / Sprint | `nex_Standard_Forward_Char.glb` | `Standard_Forward_Charge_inplace` |
| Punch | `nex_Right_Jab_from_Guard.glb` | `Right_Jab_from_Guard` |
| Kick | `nex_Step_in_High_Kick.glb` | `Step_in_High_Kick` |
| Block | `nex_Block1.glb` | `Block1` |
| Jump | `nex_Hop_with_Arms_Raised.glb` | `Hop_with_Arms_Raised` |
| Vault / Land | `nex_Vault_and_Land.glb` | `Vault_and_Land` |

Present on disk but not required for the V1 loop: climb left/right/stairs/down, wall flip, sweeping kick, victory, stand-up, sit, tightrope, unsteady walk, lying hit.

No dedicated Fall or Dodge clips.

## Later Blender optimization

Consolidate every clip into **one** NEX GLB (mesh + textures once). That drops hundreds of MB of duplicate mesh/texture payloads to a single character asset. Do not keep shipping a full character per animation.

## Economy

Word complete pays **5,000** coins through existing `addCoins` / `saveState`. A winner overlay shows the player's profile photo (lobby `photoOf`/`photoFetch`, else the playable portrait), name, a coin burst into the session counter, and a รับทราบ button with an 8-second countdown. The next word starts as soon as that player acknowledges, or automatically if nobody taps in time. Preview HTML keeps a local counter when those APIs are absent. Letters on the field match the current word exactly (e.g. THREE → T, H, R, E, E) using the same `vocabForStudent` pool as Shoot Word. Players bag letters in any order with no cap; dying scatters that life's bag around the corpse as map loot so other players can pick them up. Original field letters stay taken. If two or more players stay together while only one contests letters (opening a path / refusing to compete) for 6 seconds, extra faster hunter zombies spawn on **all** of those players. Solo play and players who are far apart are not punished. No new Firebase fields. World HP bars sit only above zombies and face the camera; local/peer fighters use the bottom HUD capsule.

## Character style note

NEX is the user-supplied Mixamo tactical character for this admin prototype, not a Soft Cuboid Chibi stand-in. Do not replace him with a chibi in V1.
