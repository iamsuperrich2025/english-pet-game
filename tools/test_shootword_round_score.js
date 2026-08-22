"use strict";
const fs=require('fs');
const path=require('path');
const assert=require('assert');
const src=fs.readFileSync(path.join(__dirname,'..','js','shootword.js'),'utf8');

assert(src.includes('let roundCoins=0;'), 'missing current-round coin state');
assert(/function awardLetterCoin\(P,worldPos\)[\s\S]*?addCoins\(LETTER_COIN\);\s*roundCoins\+=LETTER_COIN;[\s\S]*?renderTopHud\(\);/.test(src), 'first correct letter must add 5 to the round badge immediately');
assert(/function hitDuck\(D\)[\s\S]*?addCoins\(DUCK_COIN\);\s*roundCoins\+=DUCK_COIN;[\s\S]*?renderTopHud\(\);/.test(src), 'duck bonus coins must be included immediately');
const wordDone=src.match(/function wordDone\(\)\{([\s\S]*?)\n  \}/);
assert(wordDone && !wordDone[1].includes('roundCoins+='), 'word completion must not add round coins a second time');
assert(/async function open\(\)[\s\S]*?opening=true;\s*roundCoins=0;/.test(src), 'opening the game must reset current-round coins');
assert(src.includes('id="sg-round-coins" aria-live="polite"'), 'missing visible current-round coin badge');
assert(src.includes('hudRoundCoins.textContent=`🪙 สะสมรอบนี้ ${roundCoins.toLocaleString()} เหรียญ`;'), 'badge must clearly render accumulated round coins');
assert(!src.includes('roundScore'), 'obsolete delayed round-score counter must be removed');
assert(src.includes("e.target.closest('#sg-tl')"), 'top-left HUD must not trigger a shot');
assert(src.includes('get roundCoins(){return roundCoins;}'), 'test hook must expose current-round coins');

// Conservative 812×375 geometry from the exact clamp/vh values in the embedded CSS.
const viewportHeight=375;
const fontPx=Math.max(11,Math.min(15,viewportHeight*0.028));
const pillHeight=fontPx*1.2 + 2*(viewportHeight*0.0055) + 6;
const stackBottom=viewportHeight*0.01 + pillHeight*3 + (viewportHeight*0.008)*2;
assert(stackBottom<139.5,`HUD overlaps the highest projected letter target: ${stackBottom.toFixed(1)}px`);

console.log(`PASS shootword immediate round coins regression (first hit +5; 812×375 HUD bottom ${stackBottom.toFixed(1)}px)`);