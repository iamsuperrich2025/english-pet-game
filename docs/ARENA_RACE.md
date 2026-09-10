# Arena shared word race — round 1403

## Player rules

- Everyone admitted to the same Arena map room races the same 3–8 letter word and Thai meaning. The server advances to the next word 2.5 seconds after a win.
- The field has one shared A–Z set. Pick up one letter at a time, then walk into your own home to bank it. Repeated letters are counted separately. Leftovers remain in the bank; only the winning word is consumed.
- The first valid bank completion wins exactly 1,000 central coins. Other players receive no reward for that word and keep their letters. There are no local ordinary-word multipliers or chapter/boss coin payouts in the race.
- Homes start with 5,000 HP. Healthy enemy homes block entry. Actual basic/elemental impacts request a house hit; the server accepts at most one 250-damage hit per attacker per 700 ms within 15 world units. Item damage multipliers do not change this house-damage rule.
- At zero HP the house is flattened and its vault is open. Any other player walking into the ruin with empty cargo can take one letter; the server prioritizes a target letter, otherwise the first stored letter. Competing requests cannot take the same stored letter twice. The owner can still deposit and use letters remaining in their own vault. A ruined home no longer heals or protects its owner.
- Q or the touch DROP button releases carried cargo. The owner cannot immediately reclaim it for 1.25 seconds; another player can. Downing also releases cargo. Reclaimed/stolen letters do not charge MEGA. Five fresh field pickups still grant five MEGA uses.
- Race banks/cargo survive reconnect on the server. Old `state.arenaHome` solo inventory is preserved, including up to nine old carried letters, but cannot be imported into competitive rewards.
- Rune Satchel, Starlight Satchel and Lexicon Charm remain owned if previously bought. Their cargo/reward effects and new purchases are suspended in this mode, with an explicit shop label. No refund or invented replacement bonus is applied.
- Network loss stops race actions and coin claims until recovery; there is no offline coin fallback. Combat/visuals can keep running locally. Existing revive helpers remain; the chapter-boss progression is inactive.

## Ownership and synchronization

`functions/arena-race.js` owns the room word, pickup revisions, per-account carried letter and bank, four home slots/HP, and winner earnings. It uses existing server-packaged Frontline vocabulary. The callable is `arenaRaceV1` in `functions/index.js`; private data lives at `arena_v1_live/v1/{rooms,claims}` under existing default-deny Rules. No Firebase Rules or client database permissions change.

The callable authenticates the user and verifies recent A3 Arena presence/position in the existing `wroom/adv/r21..r35` and `winfo/adv/r21..r35` lanes. Positions and spell simulation remain part of Arena's existing client-driven engine; the service validates distances, house-hit rate, item revisions and authoritative inventories. It does not claim to run all Arena movement or spell simulation on the server. Active race slots expire after 90 seconds; a replacement gets its own bank/HP/earnings, never the previous user's. Stale accounts retain private inventory/earnings for recovery.

`js/arena-race.js` serializes actions and snapshots (1.5 s idle interval, 3 s failure backoff), rejects responses from previous map generations, and remembers visited room codes per authenticated UID for reward recovery after reload/map change. The renderer reconciles only changed letter revisions. All 26 pickup circles remain separated after relocation; targets cannot spawn inside a protected home.

Settlement uses the same atomic central-wallet credit helper as Frontline, with a separate `arenaRaceReceipts` field and a private claim ledger. `js/auth.js` serializes cloud saves and merges newer Arena receipts/coin deltas so a stale save does not erase a server credit. Client settlement merges only credited coin deltas into current local state, preserving purchases/progress made during the request. Existing Frontline receipts and reducer behavior are unchanged.

## Validation and limits

`node functions/test_arena_race.js` exercises authentication, seat bounds, shared targets, simultaneous pickups/completions/raids, carry-one, remote-bank denial, repeated letters, loser retention, 5,000 HP destruction, DROP/downing, private-ledger retries and stale-save receipt merging. `node functions/test_frontline.js` guards the existing game and wallet path.

`node tools/test_arena_race.cjs` runs two real Edge clients against a local in-memory service fixture. It uses the actual Arena transport/renderer/control scripts, isolated identities/saves and intercepted callable requests: no production data writes. Coverage includes pickup-to-bank-to-reward, real attack into a home, ruined-vault theft, touch DROP, reentry, old-inventory retention and landscape layout/overlap checks at 812×375, 667×320 and 1366×768. `VW_ARENA_SOURCE` selects built runtime; `VW_ARENA_OUTPUT` selects WebP/report output.

The previous field/maps/crystal harnesses encode the old solo/co-op cargo, boss and reward rules. Their old reward assertions are historical, not acceptance criteria for this shared race. Real-account production multiplayer and physical-phone FPS require live verification after deployment.
