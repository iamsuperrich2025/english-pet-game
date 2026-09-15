'use strict';
const fs=require('fs');
const a=fs.readFileSync('js/adventure3d.js','utf8');
const css=fs.readFileSync('js/adv3d_css.js','utf8');
const assert=(ok,m)=>{ if(!ok){ console.error('FAIL',m); process.exit(1); } console.log('ok',m); };

assert(a.includes('function syncMechaMoveBtns'),'sync helper');
assert(a.includes('mechaToggleBtn'),'toggle binder');
assert(a.includes('mFwdBtn=mFwdBtn===1?0:1'),'fwd toggle');
assert(a.includes('mFwdBtn=mFwdBtn===-1?0:-1'),'back toggle');
assert(a.includes('mStrafeBtn=mStrafeBtn===-1?0:-1'),'left toggle');
assert(a.includes('mStrafeBtn=mStrafeBtn===1?0:1'),'right toggle');
assert(!/holdBtn\('#mecha-fwd'/.test(a),'fwd not hold');
assert(!/holdBtn\('#mecha-back'/.test(a),'back not hold');
assert(/holdBtn\('#mecha-fire'/.test(a),'fire still hold');
assert(css.includes('left:96px;bottom:104px')&&css.includes('#mecha-fwd'),'fwd on left cluster');
assert(!/#mecha-fwd\{right:/.test(css),'fwd not on right');
assert(!/#mecha-back\{right:/.test(css),'back not on right');
assert(css.includes('.mecha-btn.on'),'active auto style');
assert(a.includes('syncMechaMoveBtns()'),'reset calls sync');

console.log('mecha-1491 auto-move pad checks passed');
