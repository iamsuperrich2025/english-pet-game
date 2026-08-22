# Player Character Visual Standard

Status: mandatory, effective immediately from 2026-08-21.

## Canonical style

The canonical visual style for visible 3D player characters is **Soft Cuboid Chibi 3D**. Acceptable descriptive aliases are **Cute Blocky 3D Character** and **Toy-Block Cartoon 3D**, but design documents, prompts, reviews, and team communication should use **Soft Cuboid Chibi 3D** as the primary name.

## Required scope

Apply this standard to every visible player-controlled or multiplayer player character in all new and existing 3D worlds, games, minigames, and modes, including:

- the local player's visible character;
- friends and other online players;
- multiplayer room avatars;
- controllable or observable player characters during gameplay.

Existing nonconforming player characters in covered worlds must enter the reskin/model-replacement backlog and be migrated by project priority. New covered work must conform before acceptance.

## Explicit exceptions

Do **not** replace the established player-character style in:

1. the Invasion/Mothership world (`js/invasion3d.js`); or
2. Adventure World's original Adventure mode.

These exceptions retain their existing character standards. They do not exempt other modes that happen to share the Adventure3D engine; evaluate each visible-player implementation by its actual world/mode.

## Required visual traits

- Soft, rounded cuboid forms: blocky but never rigid or harsh.
- Chibi proportions: relatively large head, short body, short readable limbs.
- Cute, child-friendly, bright, modern, approachable, and toy-like presentation.
- Simple readable face, clear eyes, and a friendly or gently smiling expression.
- Bright colors appropriate for an educational game and silhouettes that remain clear at gameplay distance.
- A cohesive style within each world; mixed player-character styles require an explicit approved design reason.

## Prohibited outcomes

- A look that is too close to Roblox or another recognizable platform's generic avatar language.
- Rigid rectangular anatomy that loses the soft, cute quality.
- A visual personality that conflicts with a child-friendly educational game.
- Unapproved mixing of multiple player-character styles inside one world.

## Design and acceptance workflow

Before creating or approving a covered player character:

1. Name **Soft Cuboid Chibi 3D** explicitly in the brief or image/model prompt.
2. Check the target world against the two exceptions above.
3. Review the result for soft cuboid shape, chibi proportions, child friendliness, readability, and style consistency.
4. Reject or revise results that look too Roblox-like, too rigid, too generic, or inconsistent with the world.
5. When interpretation is ambiguous, choose the option that is cuter, clearer, and more child-friendly.

## Initial migration register

This register turns the rule into an actionable reskin plan. A status of **audit/migrate** does not mean the current asset is accepted; it means the implementation must be visually reviewed and replaced or adjusted before it can be marked conforming.

| Priority | World/mode | Current implementation | Required action |
|---|---|---|---|
| P0 ✅ | Drive, Haunted Hotel, and Soccer in Adventure3D | Shared low-subdivision `softCuboidGeo()` / `makeSoftCuboidChibiFigure()` path; Soccer local player uses the same language | Conforming since round 1200; one-material face atlas tightened the standard head budget in round 1202. Preserve `makeLegacyAdventureFigure()` / `makeLegacyAdventureWalkPeer()` as the isolated original-Adventure path and keep the runtime draw-budget regression. |
| P0 ✅ | Vocab Sky | Six selectable lossless 8-direction atlases share the round-1247 scale and foot anchor; local and online peers use the same sprite renderer and synchronized character ID. | Conforming: red hoodie, explorer, captain, schoolgirl, witch, and pajamas. Preserve true alpha, canonical direction order, and the 812×375 visual QA gate. |
| P0 | All new 3D worlds/modes | No single mandatory acceptance gate existed | Use this document in the brief and review before approval; do not introduce a new legacy-style avatar. |
| P1 | Vocab Arena | Local and peer players are `img/blocks/*.png` billboards in the 3D scene | Replace or rebake with a Soft Cuboid Chibi design, then verify local/peer consistency and gameplay readability. |
| P1 | Helicopter and Drone modes | Some player/peer phases use profile-image sprites rather than the shared 3D character | Audit each visible phase and migrate any visible human player representation to the canonical style. Vehicle-only phases are not character assets. |
| P1 | Vocab City live presence | Nearby players are rendered as sprites in the 3D city | Audit and migrate the visible player representation to a matching Soft Cuboid Chibi asset or lightweight baked equivalent. |
| Review when introduced | Moto and F1 | Multiplayer currently renders vehicles without a separate visible human character | No reskin is required while only vehicles are visible. Any future rider/driver character must conform. |
| Exempt | Invasion/Mothership | Established soldier/player style | Preserve unchanged under this rule. |
| Exempt | Original Adventure mode | Established Adventure player style | Preserve unchanged; do not let shared-helper changes alter this mode. |

Migration work must preserve multiplayer payload compatibility, mobile landscape performance, draw budgets, and the target world's existing controls. A lightweight baked sprite is allowed where a live 3D model is unnecessary, but its depicted character must still follow the same Soft Cuboid Chibi design language.

This document overrides older player-character style guidance and prompts wherever they conflict. It does not change pet, NPC, enemy, vehicle, first-person hand/weapon, or 2D profile-avatar standards unless those assets are also being used as a visible 3D player character.
