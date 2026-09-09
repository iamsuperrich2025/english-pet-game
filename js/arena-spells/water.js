"use strict";
/* Round 1387: water spell recipes, loaded only when equipped. */
window.ArenaSpellPacks=window.ArenaSpellPacks||{};
window.ArenaSpellPacks.water={
  "tidal_dragon": {
    "pattern": "serpent",
    "range": 25,
    "r": 4,
    "amplitude": 5,
    "damage": 54,
    "life": 2.8,
    "push": 3
  },
  "pearl_prison": {
    "pattern": "field",
    "aim": true,
    "r": 6.5,
    "damage": 18,
    "pulses": 4,
    "interval": 0.55,
    "slow": 2.5,
    "final": 34
  },
  "moonwell": {
    "pattern": "rings",
    "r": 9,
    "damage": 20,
    "steps": 3,
    "interval": 0.45,
    "heal": 24,
    "push": 2
  },
  "monsoon_needles": {
    "pattern": "rain",
    "aim": true,
    "r": 3.2,
    "spread": 8,
    "steps": 8,
    "damage": 24,
    "delay": 0.4,
    "interval": 0.15,
    "slow": 1
  },
  "riptide_return": {
    "pattern": "return",
    "range": 20,
    "r": 4.2,
    "damage": 38,
    "life": 2.6,
    "pull": 2.5
  }
};

