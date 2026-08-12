"use strict";
/* Regression: Picture Dictionary must stay an 18-card single-page gallery, not a two-page book. */
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const js = fs.readFileSync(path.join(root, 'js/picdict.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'css/picdict.css'), 'utf8');
const ok = (v, msg)=>{ if(!v) throw new Error(msg); };

ok(/const PAGE_SIZE = 18;/.test(js), 'page size must remain 18 words');
ok(/slice\(start,start\+PAGE_SIZE\)/.test(js), 'renderer must slice the active page');
ok(/repeat\(6,minmax\(0,1fr\)\)/.test(css), 'gallery must have 6 columns');
ok(/repeat\(3,minmax\(0,1fr\)\)/.test(css), 'gallery must have 3 rows');
ok(!/pd-book|pd-turn|cover-mode/.test(js + css), 'legacy two-page book UI returned');
ok(/qzCells=.*pd-gallery/.test(js), 'teacher quiz must use the 18 visible cards');
console.log('PASS Picture Dictionary: single page, 18 cards, 6x3, no legacy book');
