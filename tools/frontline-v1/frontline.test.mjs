import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
const dir=new URL('./',import.meta.url);
const context=vm.createContext({window:{},state:{student:null},Date,Math,Uint8Array,crypto:{getRandomValues(bytes){for(let i=0;i<bytes.length;i++)bytes[i]=i;return bytes;}}});
vm.runInContext(readFileSync(new URL('../../js/data/vocab.js',dir),'utf8'),context);
for(const name of ['config','health','words','bases','collision','tank','letters','drop','bots','guards','combat','bombs','room','commands','lobby']){
  vm.runInContext(readFileSync(new URL('frontline-'+name+'.js',dir),'utf8'),context);
}
const F=context.window.Frontline,close=(a,b,t=1e-9)=>assert.ok(Math.abs(a-b)<=t,a+' != '+b);
function room(){return F.admit(null,'p1',100000,'run1');}

test('forward and reverse follow hull without strafe at three live speeds',()=>{
  for(const hull of [0,Math.PI/2,-Math.PI/3])for(const auto of [1,-1])for(let speedLevel=0;speedLevel<3;speedLevel++){
    const p=F.newTank('p',0,0);p.x=p.z=0;p.hull=hull;F.drive(p,{auto,turn:0,speedLevel},.05);
    close(p.x*Math.cos(hull)+p.z*Math.sin(hull),0);
    assert.equal(Math.sign(p.x*Math.sin(hull)-p.z*Math.cos(hull)),auto);
  }
  const distances=F.C.speeds.map((_,speedLevel)=>{const p=F.newTank('p',0,0);p.x=p.z=0;F.drive(p,{auto:1,turn:0,speedLevel},.05);return Math.hypot(p.x,p.z);});
  assert.ok(distances[0]<distances[1]&&distances[1]<distances[2]);
});

test('live pose corrections blend instead of snapping the hull mid-drive',()=>{
  const local=F.newTank('p',0,0);local.x=0;local.z=0;local.hull=0;
  assert.equal(F.blendToward(local,{x:.2,z:0,hull:.1,turret:.1}),'blend');
  assert.ok(local.x>0&&local.x<.2);assert.ok(local.hull>0&&local.hull<.1);
  const far=F.newTank('q',0,0);far.x=0;far.z=0;far.hull=0;
  assert.equal(F.blendToward(far,{x:20,z:0,hull:0,turret:0}),'reset');
  close(far.x,20);
});

test('steering works while advancing and reversing; stationary turn does not translate',()=>{
  for(const auto of [-1,0,1])for(const turn of [-1,1]){
    const p=F.newTank('p',0,0);p.x=p.z=0;p.hull=0;F.drive(p,{auto,turn,speedLevel:1},.05);
    assert.equal(Math.sign(p.hull),turn);assert.ok(Math.sign(p.x)===auto*turn);assert.ok(Math.sign(-p.z)===auto);
  }
});

test('one human admission fills every empty seat with bots',()=>{
  const r=room();assert.equal(Object.keys(r.players).length,4);
  assert.equal(Object.values(r.players).filter(p=>p.bot).length,3);
  assert.equal(Object.values(r.players).filter(p=>!p.bot).length,1);
  assert.equal(Object.keys(r.bases).length,4);assert.equal(Object.keys(r.guards).length,2);
  assert.ok(Object.values(r.players).every(p=>p.hp===5000));
  assert.ok(Object.values(r.guards).every(p=>p.hp===5000));
});

test('real players replace bots until four humans, then a fifth is rejected',()=>{
  let r=room();for(let i=2;i<=4;i++)r=F.admit(r,'p'+i,100000+i,'unused');
  assert.equal(Object.values(r.players).filter(p=>p.bot).length,0);
  assert.equal(F.admit(r,'p5',100100,'unused'),undefined);
  assert.equal(new Set(Object.values(r.players).map(p=>p.slot)).size,4);
});

test('field always contains A-Z and collision carries one letter while relocating its source',()=>{
  const r=room(),p=r.players.s0,item=r.letters.a0;
  assert.equal(Object.keys(r.letters).length,26);
  assert.equal(new Set(Object.values(r.letters).map(x=>x.letter)).size,26);
  const before={x:item.x,z:item.z,serial:item.serial};p.x=item.x;p.z=item.z;
  F.tickLetters(r,100100);assert.equal(p.carried,'A');assert.equal(item.serial,1);
  assert.notDeepEqual({x:item.x,z:item.z,serial:item.serial},before);
});

test('carried letters deposit only at the owner base and repeated letters spell APPLE',()=>{
  const r=room(),p=r.players.s0,base=r.bases.s0;
  p.carried='A';p.x=r.bases.s1.x;p.z=r.bases.s1.z;F.tickLetters(r,100100);assert.equal(p.carried,'A');
  p.x=base.x;p.z=base.z;F.tickLetters(r,100200);assert.equal(p.carried,'');assert.equal(base.stored,'A');
  base.stored='APPLE';assert.equal(F.completeWord(r,'s0',100300),true);
  assert.equal(base.stored,'');assert.equal(r.word.winnerId,'s0');assert.equal(r.rewards.s0,1000);
  assert.equal(r.rewards.s1,undefined);assert.equal(F.completeWord(r,'s1',100301),false);
});

test('intact rival base blocks entry and opens after 20 shell hits',()=>{
  const r=room(),base=r.bases.s1;
  assert.equal(F.canOccupy(r,'s0',base.x,base.z),false);
  for(let i=0;i<20;i++)assert.match(F.damageBase(r,'s1',100000+i),/base-/);
  assert.equal(base.hp,0);assert.equal(F.canOccupy(r,'s0',base.x,base.z),true);
});

test('a player can steal one useful letter from a destroyed rival vault',()=>{
  const r=room(),p=r.players.s0,base=r.bases.s1;r.letters={};base.hp=0;base.stored='ZAP';
  p.x=base.x;p.z=base.z;p.carried='';F.tickLetters(r,100100);
  assert.equal(p.carried,'A');assert.equal(base.stored,'ZP');
});

test('shells leave only the cannon muzzle, never the hull center',()=>{
  const tip=F.muzzlePoint({x:10,z:20,turret:0});
  close(tip.x,10);close(tip.z,20-F.C.muzzle);close(tip.y,F.C.muzzleY);
  const side=F.muzzlePoint({x:0,z:0,turret:Math.PI/2});
  close(side.x,F.C.muzzle);close(side.z,0);
  const r=room(),p=r.players.s0;
  Object.values(r.bases).forEach(base=>base.hp=0);Object.values(r.guards).forEach(g=>{g.x=80;g.z=80;});r.letters={};
  Object.values(r.players).forEach(other=>{if(other!==p){other.x=80;other.z=80;}});
  p.x=0;p.z=0;p.hull=p.turret=0;
  const hit=F.pickHit(p,r,'s0');
  close(hit.x,0);close(hit.z,-F.C.muzzle);
  assert.ok(Math.hypot(hit.x-p.x,hit.z-p.z)>=2.2,'spawn is at the barrel tip');
  assert.ok(Math.abs(hit.z-p.z)>1.8,'spawn is not inside the hull');
});

test('tank shell deals 100 HP and drops the target carried letter into the field',()=>{
  const r=room(),a=r.players.s0,b=r.players.s1;
  Object.values(r.bases).forEach(base=>base.hp=0);Object.values(r.guards).forEach(g=>{g.x=80;g.z=80;});r.letters={};
  a.x=0;a.z=8;a.hull=a.turret=0;b.x=0;b.z=3;b.carried='P';
  assert.equal(F.commitFire(r,'s0',1,100500),true);
  assert.equal(a.hp,5000);assert.equal(b.hp,4900);assert.equal(b.carried,'');
  assert.equal(r.letters.ds1.letter,'P');assert.equal(r.events.s0.kind,'tank-hit');
  F.tickLetters(r,100600);assert.equal(b.carried,'','former carrier cannot instantly reclaim the drop');
  F.tickLetters(r,101800);assert.equal(b.carried,'P','drop becomes collectible after the brief lockout');
});

test('base shell hits the shield before a tank sheltered inside',()=>{
  const r=room(),a=r.players.s0,b=r.players.s1,base=r.bases.s1;
  a.x=-10;a.z=18;a.hull=a.turret=Math.PI/2;b.x=base.x;b.z=base.z;
  Object.values(r.guards).forEach(g=>{g.x=80;g.z=80;});
  F.commitFire(r,'s0',1,100500);
  assert.equal(base.hp,4750);assert.equal(b.hp,5000);assert.equal(r.events.s0.targetType,'base');
});

test('two neutral guards do not consume player seats and pursue the word leader',()=>{
  const r=room(),guard=r.guards.g0;r.bases.s0.stored='APPL';
  const before=Math.hypot(guard.x-r.players.s0.x,guard.z-r.players.s0.z);
  F.stepGuards(r,.2,101000);
  const after=Math.hypot(guard.x-r.players.s0.x,guard.z-r.players.s0.z);
  assert.equal(Object.keys(r.players).length,4);assert.equal(Object.keys(r.guards).length,2);
  assert.ok(after<before||guard.hull!==0);
});

test('host is always a live human and bot state advances under that host',()=>{
  const r=room(),bot=r.players.s1,before={x:bot.x,z:bot.z,hull:bot.hull};
  assert.equal(F.leader(r,100100),'s0');F.stepRoom(r,'s0',100200);
  assert.ok(bot.x!==before.x||bot.z!==before.z||bot.hull!==before.hull);
  assert.ok(Object.values(r.players).every(p=>p.t>=100000));
});

test('destroyed tanks and guards respawn with 5000 HP',()=>{
  const r=room(),p=r.players.s0;p.hp=0;p.carried='';p.respawnAt=100100;
  F.stepRoom(r,'s0',100200);assert.equal(p.hp,5000);
  assert.equal(p.x,r.bases.s0.x);assert.equal(p.z,r.bases.s0.z);
  r.guards.g0.hp=0;r.guards.g0.respawnAt=100200;F.stepGuards(r,.1,100201);assert.equal(r.guards.g0.hp,5000);
});

test('BOMB has unlimited supply, a short placement interval, and chains nearby bombs',()=>{
  const r=room(),a=r.players.s0,b=r.players.s1;a.x=a.z=0;b.x=2;b.z=0;b.carried='L';
  assert.equal(F.placeBomb(r,'s0',1,100000),true);assert.equal(F.placeBomb(r,'s0',2,100100),false);
  b.x=3;b.z=0;assert.equal(F.placeBomb(r,'s1',1,100000),true);
  F.stepBombs(r,101999);assert.equal(a.hp,5000);F.stepBombs(r,102000);
  assert.equal(a.hp,4500);assert.equal(b.hp,4500);assert.equal(b.carried,'');assert.equal(r.letters.ds1.letter,'L');
  assert.ok(r.bombs.s0_1.explodedAt&&r.bombs.s1_1.explodedAt);
});

test('unlimited stock permits repeated fire and several bombs while expired bombs are reclaimed',()=>{
  const r=room(),p=r.players.s0;p.x=p.z=0;
  for(let i=1;i<=60;i++){
    const now=100000+i*F.C.bombCooldown;
    assert.equal(F.placeBomb(r,'s0',i,now),true);
    assert.equal(F.commitFire(r,'s0',i,now),true);
    p.x=i*12;F.stepBombs(r,now); // Leave each blast before it explodes; avoid chains in this fixture.
    assert.ok(Object.keys(r.bombs).length<=5);
  }
  assert.equal(p.bombSeq,60);assert.equal(p.fireSeq,60);
});

test('public hosts fail the access gate while private LAN hosts pass',()=>{
  assert.equal(F.isPrivateHost('vocabworld.web.app'),false);assert.equal(F.isPrivateHost('localhost'),true);
  assert.equal(F.isPrivateHost('192.168.attacker.example'),false);assert.equal(F.isPrivateHost('10.1.1.999'),false);
  assert.equal(F.isPrivateHost('192.168.1.5'),true);
});
test('phones skip the Fullscreen API so the browser URL bar cannot cover the field',()=>{
  assert.equal(F.usePageFullscreen('Mozilla/5.0 (Linux; Android 14) Chrome/120',true),false);
  assert.equal(F.usePageFullscreen('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',false),false);
  assert.equal(F.usePageFullscreen('Mozilla/5.0 (Windows NT 10.0; Win64; x64)',false),true);
});

test('LAN random IDs do not require secure-context randomUUID',()=>{
  const id=F.randomId();assert.match(id,/^[0-9a-f]{32}$/);assert.equal(id[12],'4');assert.match(id[16],/[89ab]/);
});

test('room labels accept only system numbers and overflow deterministically',()=>{
  assert.equal(F.roomCode('1001'),'R1001');assert.equal(F.roomCode('Parents name'),'R1001');
  assert.equal(F.roomCode('APPLE'),'R1001');assert.equal(F.nextRoom('R1001',1),'R1002');assert.equal(F.nextRoom('R9999',1),'R0000');
});
test('word data includes Thai from the shared ShootWord vocabulary source',()=>{
  const w=F.newWord(0);assert.equal(w.target,'APPLE');assert.equal(w.translation,'แอปเปิ้ล');
  for(let i=0;i<100;i++){const word=F.newWord(i);assert.match(word.target,/^[A-Z]{3,8}$/);assert.ok(word.translation);}
});
test('only the first bank to complete each word receives 1000, across repeated words',()=>{
  const r=room();r.bases.s0.stored='APPLE';r.bases.s1.stored='APPLE';
  assert.equal(F.completeWord(r,'s0',100100),true);assert.equal(F.completeWord(r,'s1',100100),false);
  assert.equal(r.rewards.s0,1000);assert.equal(r.rewards.s1,undefined);
  r.word=F.newWord(1);r.bases.s1.stored=r.word.target;F.completeWord(r,'s1',103000);
  assert.equal(r.rewards.s0,1000);assert.equal(r.rewards.s1,1000);
});
test('host consumes mailbox attacks exactly once, retries cooldown, and ignores another seat owner',()=>{
  const r=room(),p=r.players.s0,c={uid:p.id,t:100000,x:0,z:0,hull:0,turret:0,fireSeq:1,bombSeq:1};
  F.applyCommands(r,{s0:c},100000);assert.equal(p.fireSeq,1);assert.equal(Object.keys(r.bombs).length,1);
  F.applyCommands(r,{s0:c},100010);assert.equal(Object.keys(r.bombs).length,1);
  c.fireSeq=2;F.applyCommands(r,{s0:c},100100);assert.equal(p.fireSeq,1);
  F.applyCommands(r,{s0:c},100500);assert.equal(p.fireSeq,2);
  c.uid='someone-else';c.bombSeq=3;F.applyCommands(r,{s0:c},103000);assert.equal(p.bombSeq,1);
});

test('fresh mailbox revives expired simulation before stale seats are pruned',()=>{
  const r=room(),now=120000,p=r.players.s0;
  const commands={s0:{...F.tankPose(p),uid:p.id,t:now,fireSeq:1,bombSeq:1}};
  assert.equal(F.leader(r,now),undefined);assert.equal(F.commandLeader(r,commands,now),'s0');
  F.applyCommands(r,commands,now);F.stepRoom(r,'s0',now,commands);
  assert.equal(r.players.s0.id,'p1');assert.equal(r.tickAt,now);
  assert.equal(r.players.s0.fireSeq,1);assert.ok(r.bombs.s0_1);
});

test('host selection ignores suspended, mismatched, bot, and future mailbox owners',()=>{
  const r=F.admit(room(),'p2',100000,'unused'),now=104000;
  const commands={s0:{uid:'p1',t:100000},s1:{uid:'p2',t:now},s2:{uid:r.players.s2.id,t:now}};
  assert.equal(F.leader(r,now),'s0');assert.equal(F.commandLeader(r,commands,now),'s1');
  commands.s0={uid:'imposter',t:now};assert.equal(F.commandLeader(r,commands,now),'s1');
  commands.s0={uid:'p1',t:now+2000};assert.equal(F.commandLeader(r,commands,now),'s1');
  assert.equal(F.stepRoom(r,'s0',now,commands),undefined);assert.equal(r.tickAt,100000);
});


test('open-field driving never stops for decorative scenery in either direction at all speeds',()=>{
 const r=room();r.players={};r.guards={};r.decorations=[{kind:'bush',x:0,z:0},{kind:'grass',x:0,z:0},{kind:'fence',x:0,z:0}];
 for(const hull of [0,Math.PI/2,-Math.PI/3])for(const auto of [-1,1])for(let speedLevel=0;speedLevel<3;speedLevel++){
  const p=F.newTank('p',0,100000);p.x=-Math.sin(hull)*auto*2;p.z=Math.cos(hull)*auto*2;p.hull=hull;
  const start={x:p.x,z:p.z},speed=auto===1?F.C.speeds[speedLevel]:F.C.reverseSpeeds[speedLevel];
  for(let frame=0;frame<80;frame++)assert.equal(F.drive(p,{auto,turn:0,speedLevel},.05,r,'s0'),'');
  close(Math.hypot(p.x-start.x,p.z-start.z),speed*4);close((p.x-start.x)*Math.cos(hull)+(p.z-start.z)*Math.sin(hull),0);
 }
});
test('wrong carries are letters that do not fill a remaining target slot',()=>{
  assert.equal(F.carryHelps('','APPLE','K'),false);
  assert.equal(F.carryHelps('','APPLE','A'),true);
  assert.equal(F.carryHelps('A','APPLE','A'),false);
  assert.equal(F.carryHelps('A','APPLE','P'),true);
});
test('HP loss pops the actual subtracted amount and ignores heals or first sight',()=>{
  assert.equal(F.hpLoss(null,5000),0);
  assert.equal(F.hpLoss(5000,4900),100);
  assert.equal(F.hpLoss(5000,4750),250);
  assert.equal(F.hpLoss(80,5000),0);
  assert.equal(F.hpLoss(100,100),0);
});
test('letter hints hide while carrying so only the vault arrow remains',()=>{
  const r={word:{target:'CAT',completedAt:0},bases:{s0:{stored:'C'}},players:{s0:{carried:'A'}},
    letters:{a:{letter:'A',x:10,z:0},c:{letter:'C',x:0,z:10},t:{letter:'T',x:40,z:0},b:{letter:'B',x:0,z:0}}};
  assert.equal(F.neededLetterHints(r,'s0',{x:0,z:0}).length,0);
  r.players.s0.carried='';const next=F.neededLetterHints(r,'s0',{x:0,z:0}).map(h=>h.letter).sort().join('');
  assert.equal(next,'AT');
  r.word.completedAt=1;assert.equal(F.neededLetterHints(r,'s0',{x:0,z:0}).length,0);
});
test('off-screen letter hints clamp to the HUD-safe edge and hide when the card is already in view',()=>{
  const hidden=F.placeLetterHint(400,200,800,400);assert.equal(hidden.visible,false);
  const left=F.placeLetterHint(-80,200,800,400);assert.equal(left.visible,true);assert.ok(left.x>=52&&left.x<=54);
  const right=F.placeLetterHint(900,200,800,400);assert.equal(right.visible,true);assert.ok(right.x>=800-54&&right.x<=800-52);
  assert.ok(Math.abs(left.angle)>1);assert.ok(Math.abs(right.angle)>1);
});
test('own-base hint uses the local vault and reuses HUD-safe edge placement',()=>{
  const r=room(),spot=F.baseSpot(r.players.s0.slot),hint=F.ownBaseHint(r,'s0');
  assert.equal(hint.x,spot.x);assert.equal(hint.z,spot.z);
  assert.equal(F.ownBaseHint(r,'missing'),null);
  const off=F.placeLetterHint(-200,800,800,400);
  assert.equal(off.visible,true);assert.ok(off.x>=52&&off.y<=400-124);
});
test('only real arena edges and intact rival bases report a block; turning and backing away remain available',()=>{
 const r=room(),p=F.newTank('p',0,100000);p.x=89;p.z=0;p.hull=Math.PI/2;
 assert.equal(F.drive(p,{auto:1,turn:0,speedLevel:1},.05,r,'s0'),'edge');close(p.x,89);
 assert.equal(F.drive(p,{auto:-1,turn:0,speedLevel:1},.05,r,'s0'),'');assert.ok(p.x<89);
 const base=r.bases.s1;p.x=base.x-F.C.baseBlockRadius-.01;p.z=base.z;p.hull=Math.PI/2;
 const before=p.x;assert.equal(F.drive(p,{auto:1,turn:0,speedLevel:1},.05,r,'s0'),'base');close(p.x,before);
 assert.equal(F.drive(p,{auto:-1,turn:-1,speedLevel:1},.05,r,'s0'),'');assert.ok(p.x<before);assert.ok(p.hull<Math.PI/2);
 base.hp=0;assert.equal(F.drive(p,{auto:1,turn:0,speedLevel:1},.05,r,'s0'),'');
 assert.equal(F.drive(p,{auto:0,turn:1,speedLevel:1},.05,r,'s0'),'');
});
