"use strict";
/* Round 1387: meteor spell recipes, loaded only when equipped. */
window.ArenaSpellPacks=window.ArenaSpellPacks||{};
window.ArenaSpellPacks.meteor={
  "comet_shower": {
    "pattern": "rain",
    "aim": true,
    "r": 3.6,
    "spread": 7,
    "steps": 6,
    "damage": 36,
    "delay": 0.6,
    "interval": 0.22
  },
  "star_hammer": {
    "pattern": "burst",
    "aim": true,
    "r": 11,
    "damage": 115,
    "delay": 1.25,
    "push": 4
  },
  "meteor_train": {
    "pattern": "line",
    "range": 26,
    "r": 3.2,
    "steps": 7,
    "damage": 34,
    "interval": 0.16
  },
  "cinder_wheel": {
    "pattern": "return",
    "range": 21,
    "r": 4,
    "damage": 40,
    "life": 3
  },
  "stardust_mines": {
    "pattern": "rain",
    "aim": true,
    "r": 4.5,
    "spread": 9,
    "steps": 5,
    "damage": 42,
    "delay": 1,
    "interval": 0.3,
    "inward": true
  }
};

