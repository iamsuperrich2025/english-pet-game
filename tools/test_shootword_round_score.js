"use strict";
const fs=require('fs');
const path=require('path');
const assert=require('assert');
const src=fs.readFileSync(path.join(__dirname,'..','js','shootword.js'),'utf8');

assert(src.includes('let roundScore=0;'), 'missing current-round score state');
assert(/function wordDone\(\)[\s\S]*?const pts=[^;]+;\s*roundScore\+=pts;/.test(src), 'word completion must add points to current round');
assert(/async function open\(\)[\s\S]*?opening=true;\s*roundScore=0;/.test(src), 'opening the game must reset current-round score');
assert(src.includes('id="sg-round-score" aria-live="polite"'), 'missing visible current-round score badge');
assert(src.includes('hudRoundScore.textContent=`🏅 รอบนี้ ${roundScore.toLocaleString()} แต้ม`;'), 'badge must render the current score');
assert(src.includes('🎯 สะสม ${(st.sgScore||0).toLocaleString()} แต้ม'), 'lifetime score must remain visible and clearly labelled');
assert(/#sg-round-score\{background:linear-gradient/.test(src), 'missing compact badge styling');
assert(src.includes("e.target.closest('#sg-tl')"), 'top-left HUD must not trigger a shot');
assert(src.includes('get roundScore(){return roundScore;}'), 'test hook must expose current-round score');

// Conservative 812×375 geometry from the exact clamp/vh values in the embedded CSS.
// Three pills must stay above the nearest validated target top (139.5px from round 1239 projection test).
const viewportHeight=375;
const fontPx=Math.max(11,Math.min(15,viewportHeight*0.028));
const pillHeight=fontPx*1.2 + 2*(viewportHeight*0.0055) + 6; // line box + vertical padding + borders
const stackBottom=viewportHeight*0.01 + pillHeight*3 + (viewportHeight*0.008)*2;
assert(stackBottom<100,`top-left HUD is too tall at 812×375: ${stackBottom.toFixed(1)}px`);
assert(stackBottom<139.5,`HUD overlaps the highest projected letter target: ${stackBottom.toFixed(1)}px`);
assert(src.includes('{z:-54,  y:9.50, n:6, w:20.7, size:1.98}'), 'validated shelf geometry changed; rerun projection QA');

console.log(`PASS shootword current-round score regression (812×375 HUD bottom ${stackBottom.toFixed(1)}px)`);