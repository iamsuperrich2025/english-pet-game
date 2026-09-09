"use strict";
/* Round 1387: earth spell recipes, loaded only when equipped. */
window.ArenaSpellPacks=window.ArenaSpellPacks||{};
window.ArenaSpellPacks.earth={
  "fault_serpent": {
    "pattern": "line",
    "range": 23,
    "r": 3.1,
    "steps": 7,
    "damage": 31,
    "interval": 0.17,
    "zigzag": 3,
    "push": 1.5
  },
  "obsidian_cross": {
    "pattern": "cross",
    "range": 15,
    "r": 2.8,
    "damage": 61,
    "slow": 3
  },
  "golem_footfall": {
    "pattern": "burst",
    "aim": true,
    "r": 8,
    "damage": 33,
    "pulses": 3,
    "interval": 0.45,
    "push": 2.5,
    "delay": 0.45
  },
  "jade_aegis": {
    "pattern": "rings",
    "r": 8,
    "damage": 22,
    "steps": 2,
    "interval": 0.4,
    "shield": 20,
    "push": 3
  },
  "sand_maelstrom": {
    "pattern": "field",
    "aim": true,
    "r": 8,
    "damage": 10,
    "pulses": 6,
    "interval": 0.45,
    "pull": 2.4,
    "final": 45
  }
};

