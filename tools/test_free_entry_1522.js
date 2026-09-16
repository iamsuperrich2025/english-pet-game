'use strict';
const fs=require('fs');
const assert=(ok,m)=>{ if(!ok){ console.error('FAIL',m); process.exit(1); } console.log('ok',m); };

const ui=fs.readFileSync('js/ui.js','utf8');
const adv=fs.readFileSync('js/adventure3d.js','utf8');

assert(ui.includes('function grantWorldPlayAccess'),'grant helper');
assert(ui.includes('grantWorldPlayAccess();'),'grant on dashboard/entry');
assert(!/async function enterMecha3D\(\)\{[\s\S]{0,400}!state\.mechaTicket/.test(ui),'enterMecha no ticket block');
assert(!adv.includes('ต้องจ่ายค่าเข้าโลกหุ่นรบ'),'no mecha pay toast in adventure3d');
assert(!adv.includes('ต้องมีตั๋วโลกผจญภัย'),'no adv ticket toast in adventure3d');
assert(adv.includes('grantWorldPlayAccess'),'adventure3d grants play access');

for(const fn of ['enterAdventure3D','enterHaunted3D','enterHeli3D','enterDrive3D','enterSoccer3D','enterMecha3D']){
  const start=ui.indexOf(`async function ${fn}(`);
  const end=ui.indexOf('\nasync function ',start+16);
  const block=ui.slice(start,end>0?end:ui.length);
  assert(!/!state\.\w+Ticket/.test(block),`${fn} must not require ticket flag`);
}
console.log('free-entry-1522 checks passed');
