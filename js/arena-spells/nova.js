"use strict";
/* Round 1387: nova spell recipes, loaded only when equipped. */
window.ArenaSpellPacks=window.ArenaSpellPacks||{};
window.ArenaSpellPacks.nova={
  "lunar_eclipse": {
    "pattern": "field",
    "r": 11,
    "damage": 9,
    "pulses": 5,
    "interval": 0.5,
    "pull": 2,
    "final": 55
  },
  "cosmic_heart": {
    "pattern": "burst",
    "r": 12,
    "damage": 26,
    "pulses": 4,
    "interval": 0.5,
    "delay": 0.2
  },
  "comet_spiral": {
    "pattern": "orbit",
    "r": 3.4,
    "orbit": 10,
    "arms": 3,
    "damage": 16,
    "life": 4,
    "interval": 0.5
  },
  "star_bloom": {
    "pattern": "rain",
    "aim": true,
    "r": 4.5,
    "spread": 8,
    "steps": 7,
    "damage": 33,
    "delay": 0.7,
    "interval": 0.14
  },
  "aurora_ribbon": {
    "pattern": "serpent",
    "range": 26,
    "r": 3.6,
    "amplitude": 6,
    "damage": 49,
    "life": 3,
    "slow": 2
  }
};

