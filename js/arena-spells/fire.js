"use strict";
/* Round 1387: fire spell recipes, loaded only when equipped. */
window.ArenaSpellPacks=window.ArenaSpellPacks||{};
window.ArenaSpellPacks.fire={
  "dragon_breath": {
    "pattern": "cone",
    "range": 14,
    "r": 3,
    "damage": 22,
    "pulses": 4,
    "interval": 0.35,
    "slow": 0
  },
  "phoenix_return": {
    "pattern": "return",
    "range": 17,
    "r": 2.8,
    "damage": 32,
    "life": 2.8,
    "heal": 18
  },
  "solar_fall": {
    "pattern": "burst",
    "aim": true,
    "r": 9,
    "damage": 105,
    "delay": 1,
    "push": 3
  },
  "molten_fissure": {
    "pattern": "line",
    "range": 19,
    "r": 3,
    "damage": 28,
    "steps": 5,
    "interval": 0.18,
    "burn": 7
  },
  "ember_satellites": {
    "pattern": "orbit",
    "r": 2.7,
    "orbit": 6,
    "arms": 3,
    "damage": 14,
    "life": 4,
    "interval": 0.5
  }
};

