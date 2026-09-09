"use strict";
/* Round 1387: gravity spell recipes, loaded only when equipped. */
window.ArenaSpellPacks=window.ArenaSpellPacks||{};
window.ArenaSpellPacks.gravity={
  "singularity_seed": {
    "pattern": "field",
    "aim": true,
    "r": 10,
    "damage": 7,
    "pulses": 6,
    "interval": 0.45,
    "pull": 4,
    "final": 70
  },
  "rift_lance": {
    "pattern": "line",
    "range": 27,
    "r": 2.5,
    "steps": 6,
    "damage": 44,
    "interval": 0.1
  },
  "astral_orbits": {
    "pattern": "orbit",
    "r": 3,
    "orbit": 8,
    "arms": 2,
    "damage": 20,
    "life": 4.5,
    "interval": 0.45,
    "reverse": true,
    "pull": 1
  },
  "chrono_field": {
    "pattern": "field",
    "aim": true,
    "r": 10,
    "damage": 23,
    "pulses": 4,
    "interval": 0.8,
    "slow": 2
  },
  "void_echo": {
    "pattern": "twin",
    "aim": true,
    "r": 6,
    "damage": 60,
    "delay": 0.75,
    "spread": 6,
    "pull": 3
  }
};

