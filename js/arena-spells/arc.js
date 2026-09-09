"use strict";
/* Round 1387: arc spell recipes, loaded only when equipped. */
window.ArenaSpellPacks=window.ArenaSpellPacks||{};
window.ArenaSpellPacks.arc={
  "thunder_chain": {
    "pattern": "chain",
    "range": 21,
    "r": 9,
    "jumps": 8,
    "damage": 39,
    "interval": 0.1
  },
  "thunder_road": {
    "pattern": "line",
    "range": 26,
    "r": 3,
    "steps": 6,
    "damage": 40,
    "interval": 0.12,
    "slow": 1
  },
  "storm_cage": {
    "pattern": "orbit",
    "r": 3.1,
    "orbit": 8,
    "arms": 3,
    "damage": 15,
    "life": 4,
    "interval": 0.45,
    "slow": 1.6
  },
  "twin_fulgur": {
    "pattern": "twin",
    "aim": true,
    "r": 5.5,
    "damage": 62,
    "delay": 0.35,
    "spread": 5
  },
  "ion_ripple": {
    "pattern": "rings",
    "r": 15,
    "damage": 23,
    "steps": 4,
    "interval": 0.22,
    "push": 1
  }
};

