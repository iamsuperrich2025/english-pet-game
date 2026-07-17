"use strict";
/* DICT_BAND manifest — เจนโดย tools/split_dict_band.py ห้ามแก้มือ
   เกมโหลดไฟล์นี้ตอนบูต แล้วค่อยโหลดชิ้น db<band>_*.js ขี้เกียจตามที่ใช้
   Claude: อ่านไฟล์นี้แทนไฟล์ข้อมูล — ไฟล์ db*_a-b.js เปิดเฉพาะช่วงคำที่จำเป็น */
const DICT_BAND = [];
const DICT_BAND_MANIFEST = {
 "1": {
  "label": "ป.1–ป.2",
  "count": 366,
  "files": [
   {
    "f": "db1_a-ever.js",
    "n": 75,
    "from": "a",
    "to": "ever"
   },
   {
    "f": "db1_every-just.js",
    "n": 75,
    "from": "every",
    "to": "just"
   },
   {
    "f": "db1_keep-own.js",
    "n": 75,
    "from": "keep",
    "to": "own"
   },
   {
    "f": "db1_part-the.js",
    "n": 75,
    "from": "part",
    "to": "the"
   },
   {
    "f": "db1_their-your.js",
    "n": 66,
    "from": "their",
    "to": "your"
   }
  ]
 },
 "2": {
  "label": "ป.3–ป.4",
  "count": 491,
  "files": [
   {
    "f": "db2_above-child.js",
    "n": 75,
    "from": "above",
    "to": "child"
   },
   {
    "f": "db2_choice-fall.js",
    "n": 75,
    "from": "choice",
    "to": "fall"
   },
   {
    "f": "db2_fast-late.js",
    "n": 75,
    "from": "fast",
    "to": "late"
   },
   {
    "f": "db2_lead-perhaps.js",
    "n": 75,
    "from": "lead",
    "to": "perhaps"
   },
   {
    "f": "db2_period-save.js",
    "n": 75,
    "from": "period",
    "to": "save"
   },
   {
    "f": "db2_saw-turn.js",
    "n": 75,
    "from": "saw",
    "to": "turn"
   },
   {
    "f": "db2_turndown-yourself.js",
    "n": 41,
    "from": "turn down",
    "to": "yourself"
   }
  ]
 },
 "3": {
  "label": "ป.5–ป.6",
  "count": 644,
  "files": [
   {
    "f": "db3_ability-brand.js",
    "n": 75,
    "from": "ability",
    "to": "brand"
   },
   {
    "f": "db3_breaktheice-dad.js",
    "n": 75,
    "from": "break the ice",
    "to": "dad"
   },
   {
    "f": "db3_damage-express.js",
    "n": 75,
    "from": "damage",
    "to": "express"
   },
   {
    "f": "db3_extra-image.js",
    "n": 75,
    "from": "extra",
    "to": "image"
   },
   {
    "f": "db3_imagine-mention.js",
    "n": 75,
    "from": "imagine",
    "to": "mention"
   },
   {
    "f": "db3_metal-primary.js",
    "n": 75,
    "from": "metal",
    "to": "primary"
   },
   {
    "f": "db3_prince-significant.js",
    "n": 75,
    "from": "prince",
    "to": "significant"
   },
   {
    "f": "db3_silver-upper.js",
    "n": 75,
    "from": "silver",
    "to": "upper"
   },
   {
    "f": "db3_useful-zone.js",
    "n": 44,
    "from": "useful",
    "to": "zone"
   }
  ]
 },
 "4": {
  "label": "ม.1–ม.3",
  "count": 794,
  "files": [
   {
    "f": "db4_abroad-bunch.js",
    "n": 75,
    "from": "abroad",
    "to": "bunch"
   },
   {
    "f": "db4_burn-constantly.js",
    "n": 75,
    "from": "burn",
    "to": "constantly"
   },
   {
    "f": "db4_consumer-divorce.js",
    "n": 75,
    "from": "consumer",
    "to": "divorce"
   },
   {
    "f": "db4_document-extraordinary.js",
    "n": 75,
    "from": "document",
    "to": "extraordinary"
   },
   {
    "f": "db4_extreme-intention.js",
    "n": 75,
    "from": "extreme",
    "to": "intention"
   },
   {
    "f": "db4_interesting-mood.js",
    "n": 75,
    "from": "interesting",
    "to": "mood"
   },
   {
    "f": "db4_moral-pizza.js",
    "n": 75,
    "from": "moral",
    "to": "pizza"
   },
   {
    "f": "db4_planet-repair.js",
    "n": 75,
    "from": "planet",
    "to": "repair"
   },
   {
    "f": "db4_repeat-shoulder.js",
    "n": 75,
    "from": "repeat",
    "to": "shoulder"
   },
   {
    "f": "db4_shower-trap.js",
    "n": 75,
    "from": "shower",
    "to": "trap"
   },
   {
    "f": "db4_travel-yard.js",
    "n": 44,
    "from": "travel",
    "to": "yard"
   }
  ]
 },
 "5": {
  "label": "ม.4–ม.6",
  "count": 925,
  "files": [
   {
    "f": "db5_absent-cafe.js",
    "n": 75,
    "from": "absent",
    "to": "cafe"
   },
   {
    "f": "db5_cage-cruel.js",
    "n": 75,
    "from": "cage",
    "to": "cruel"
   },
   {
    "f": "db5_crush-education.js",
    "n": 75,
    "from": "crush",
    "to": "education"
   },
   {
    "f": "db5_eighteen-forecast.js",
    "n": 75,
    "from": "eighteen",
    "to": "forecast"
   },
   {
    "f": "db5_fork-interpret.js",
    "n": 75,
    "from": "fork",
    "to": "interpret"
   },
   {
    "f": "db5_interrupt-magnificent.js",
    "n": 75,
    "from": "interrupt",
    "to": "magnificent"
   },
   {
    "f": "db5_maid-occupation.js",
    "n": 75,
    "from": "maid",
    "to": "occupation"
   },
   {
    "f": "db5_occupy-peer.js",
    "n": 75,
    "from": "occupy",
    "to": "peer"
   },
   {
    "f": "db5_pendulum-riot.js",
    "n": 75,
    "from": "pendulum",
    "to": "riot"
   },
   {
    "f": "db5_ripe-scour.js",
    "n": 75,
    "from": "ripe",
    "to": "scour"
   },
   {
    "f": "db5_scout-tactics.js",
    "n": 75,
    "from": "scout",
    "to": "tactics"
   },
   {
    "f": "db5_tailor-vocabulary.js",
    "n": 75,
    "from": "tailor",
    "to": "vocabulary"
   },
   {
    "f": "db5_voluntary-zoo.js",
    "n": 25,
    "from": "voluntary",
    "to": "zoo"
   }
  ]
 }
};
