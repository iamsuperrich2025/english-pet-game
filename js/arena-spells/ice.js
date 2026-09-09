"use strict";
/* Round 1387: ice spell recipes, loaded only when equipped. */
window.ArenaSpellPacks=window.ArenaSpellPacks||{};
window.ArenaSpellPacks.ice={
  "frost_lotus": {
    "pattern": "rings",
    "r": 12,
    "damage": 27,
    "steps": 3,
    "interval": 0.35,
    "slow": 3.5
  },
  "glacier_lance": {
    "pattern": "line",
    "range": 24,
    "r": 2.2,
    "damage": 45,
    "steps": 6,
    "interval": 0.08,
    "slow": 2
  },
  "winter_prison": {
    "pattern": "field",
    "aim": true,
    "r": 7,
    "damage": 8,
    "pulses": 5,
    "interval": 0.6,
    "slow": 2,
    "final": 65
  },
  "snow_orbit": {
    "pattern": "orbit",
    "r": 2.5,
    "orbit": 7,
    "arms": 4,
    "damage": 12,
    "life": 4,
    "interval": 0.5,
    "slow": 1.4
  },
  "mirror_frost": {
    "pattern": "twin",
    "aim": true,
    "r": 5,
    "damage": 55,
    "delay": 0.6,
    "spread": 5,
    "slow": 3
  }
};

