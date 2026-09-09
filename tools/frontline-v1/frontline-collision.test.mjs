import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const context=vm.createContext({window:{},Date,Math});
for(const name of ['config','bases','collision','tank','commands'])vm.runInContext(readFileSync(new URL('./frontline-'+name+'.js',import.meta.url),'utf8'),context);
const F=context.window.Frontline;
function setup(n=2){
 const room={players:{},guards:{},bases:{}};
 for(let i=0;i<n;i++)room.players['s'+i]={...F.newTank('p'+i,i,1000),x:0,z:-i*F.tankDiameter,hull:0,turret:0};
 return room;
}
function clear(room){
 const list=[...Object.values(room.players),...Object.values(room.guards)].filter(p=>p.hp>0);
 for(let i=0;i<list.length;i++){
  assert.ok(Math.abs(list[i].x)<=89&&Math.abs(list[i].z)<=89);
  for(let j=i+1;j<list.length;j++)assert.ok(Math.hypot(list[i].x-list[j].x,list[i].z-list[j].z)>=F.tankDiameter-.001,'hulls overlap');
 }
}
test('forward ramming pushes a stationary hull, preserving HP and carried letters',()=>{
 const r=setup(),a=r.players.s0,b=r.players.s1;b.carried='P';
 for(let i=0;i<80;i++){F.drive(a,{auto:1,turn:0,speedLevel:2},.05,r,'s0');clear(r);}
 assert.ok(b.z<-10);assert.ok(b.bumpSeq>0);assert.equal(b.hp,5000);assert.equal(b.carried,'P');assert.equal(a.hp,5000);
});
test('reverse bumping and diagonal impact work at every speed',()=>{
 for(const auto of [-1,1])for(const speedLevel of [0,1,2])for(const angle of [0,.75,2.3]){
  const r=setup(),a=r.players.s0,b=r.players.s1;a.hull=angle;
  b.x=Math.sin(angle)*auto*F.tankDiameter;b.z=-Math.cos(angle)*auto*F.tankDiameter;
  const before={x:b.x,z:b.z};
  for(let i=0;i<30;i++){F.drive(a,{auto,turn:0,speedLevel},.05,r,'s0');clear(r);}
  assert.ok(Math.hypot(b.x-before.x,b.z-before.z)>1);
 }
});
test('head-on maximum-speed drivers cannot exchange sides or tunnel through each other',()=>{
 const r=setup(),a=r.players.s0,b=r.players.s1;b.hull=Math.PI;
 for(let i=0;i<200;i++){F.drive(a,{auto:1,turn:0,speedLevel:2},.05,r,'s0');F.drive(b,{auto:1,turn:0,speedLevel:2},.05,r,'s1');clear(r);assert.ok(a.z>b.z);}
});
test('four hulls form a push chain, including bot seats',()=>{
 const r=setup(4);r.players.s2.bot=true;
 for(let i=0;i<80;i++){F.drive(r.players.s0,{auto:1,turn:0,speedLevel:2},.05,r,'s0');clear(r);}
 assert.ok(r.players.s3.z<-12);assert.ok(r.players.s2.bumpSeq>0);
});
test('a tank pinned against the arena edge remains solid under repeated pushes',()=>{
 const r=setup();r.players.s1.z=-89;r.players.s0.z=-89+F.tankDiameter;
 for(let i=0;i<100;i++){F.drive(r.players.s0,{auto:1,turn:0,speedLevel:2},.05,r,'s0');clear(r);}
 assert.ok(r.players.s0.z>=-89+F.tankDiameter-.001);
});
test('bumps cannot push a rival inside an intact vault; destroyed vault opens',()=>{
 const r=setup();r.bases.home={x:0,z:-10,hp:5000};
 r.players.s1.z=-10+F.C.baseBlockRadius;r.players.s0.z=r.players.s1.z+F.tankDiameter;
 for(let i=0;i<60;i++){F.drive(r.players.s0,{auto:1,turn:0,speedLevel:2},.05,r,'s0');clear(r);assert.ok(F.canOccupy(r,'s1',r.players.s1.x,r.players.s1.z));}
 r.bases.home.hp=0;for(let i=0;i<30;i++)F.drive(r.players.s0,{auto:1,turn:0,speedLevel:2},.05,r,'s0');
 assert.ok(r.players.s1.z<-7);
});
test('guards have solid hulls, disabled tanks are ignored, and respawn avoids occupied ground',()=>{
 const r=setup();r.guards.g0=r.players.s1;delete r.players.s1;
 F.drive(r.players.s0,{auto:1,turn:0,speedLevel:2},.05,r,'s0');clear(r);assert.ok(r.guards.g0.bumpSeq>0);
 r.guards.g0.hp=0;const before=r.players.s0.z;F.drive(r.players.s0,{auto:1,turn:0,speedLevel:2},.05,r,'s0');assert.equal(r.players.s0.z,before-.375);
 const fresh={...F.newTank('fresh',1,1000),x:r.players.s0.x,z:r.players.s0.z};r.players.s1=fresh;
 F.clearSpawn(r,fresh,'s1');clear(r);
});
test('old mailbox positions cannot undo an authoritative push',()=>{
 const r=setup(),a=r.players.s0,b=r.players.s1,old={...b};
 F.drive(a,{auto:1,turn:0,speedLevel:2},.05,r,'s0');const pushed=b.z;
 F.commitDrop=F.commitFire=F.placeBomb=()=>{};
 F.applyCommands(r,{s1:{...old,uid:b.id,t:1100}},1100);assert.equal(b.z,pushed);
 F.applyCommands(r,{s1:{...b,uid:b.id,x:99,z:99,t:1200}},1200);clear(r);
 assert.ok(Math.hypot(b.x,b.z-pushed)<=.751);
});
test('steering free of contact stays on hull heading; scenery remains passable',()=>{
 const r=setup(1),a=r.players.s0;r.decorations=[{x:0,z:0,kind:'bush'}];
 F.drive(a,{auto:1,turn:1,speedLevel:2},.05,r,'s0');
 assert.ok(Math.abs(a.x*Math.cos(a.hull)+a.z*Math.sin(a.hull))<1e-9);
 assert.ok(a.x>0&&a.z<0);
});
