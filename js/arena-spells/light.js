"use strict";
/* Round 1387: light spell recipes, loaded only when equipped. */
window.ArenaSpellPacks=window.ArenaSpellPacks||{};
window.ArenaSpellPacks.light={
  "seraph_wings": {
    "pattern": "cone",
    "range": 16,
    "r": 4,
    "damage": 30,
    "pulses": 2,
    "interval": 0.45,
    "heal": 18
  },
  "dawn_spear": {
    "pattern": "line",
    "range": 25,
    "r": 2.3,
    "steps": 5,
    "damage": 48,
    "interval": 0.09
  },
  "sanctuary": {
    "pattern": "field",
    "r": 8,
    "damage": 8,
    "pulses": 5,
    "interval": 0.6,
    "heal": 30,
    "shield": 12
  },
  "prismatic_cross": {
    "pattern": "cross",
    "range": 17,
    "r": 3,
    "damage": 64,
    "push": 1.5
  },
  "sun_judgment": {
    "pattern": "burst",
    "aim": true,
    "r": 10,
    "damage": 120,
    "delay": 1.3
  }
};

