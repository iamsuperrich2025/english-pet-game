/* Pure DROP protocol tests: no browser, Firebase connection, or economy writes. */
import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';

const dir=new URL('./',import.meta.url),NOW=100000;
const context=vm.createContext({window:{},state:{student:null},Date,Math,Uint8Array,
  crypto:{getRandomValues(bytes){bytes.fill(1);return bytes;}}});
vm.runInContext(readFileSync(new URL('../../js/data/vocab.js',dir),'utf8'),context);
for(const name of ['config','words','bases','tank','letters','drop','bots','guards','combat','bombs','room','commands'])
  vm.runInContext(readFileSync(new URL('frontline-'+name+'.js',dir),'utf8'),context);
const F=context.window.Frontline;
const plain=value=>JSON.parse(JSON.stringify(value));
const manual=r=>Object.entries(r.letters).filter(([key])=>/^ds[0-3]_/.test(key));
const core=r=>Object.fromEntries(Object.entries(r.letters).filter(([key])=>/^a\d+$/.test(key)));
function parkSources(r){Object.values(core(r)).forEach((item,i)=>{item.x=65+i%5;item.z=65+Math.floor(i/5);});}
function room(){
  const r=F.admit(null,'drop-owner',NOW,'drop-run');
  for(const [key,p] of Object.entries(r.players)){p.x=75;p.z=75;if(key!=='s0')p.hp=0;}
  for(const g of Object.values(r.guards)){g.hp=0;g.respawnAt=NOW+100000;}
  r.players.s0.x=r.players.s0.z=0;r.players.s0.hull=0;parkSources(r);return r;
}
function acquire(r,letter,now=NOW,key='s0'){
  const p=r.players[key],item=r.letters['a'+(letter.charCodeAt(0)-65)];
  assert.equal(p.carried,'','fixture must not overwrite a held card');
  item.x=p.x;item.z=p.z;F.tickLetters(r,now);
  assert.equal(p.carried,letter);return p.carriedRevision;
}

test('DROP starts empty and places a carried card behind the hull without banking or rewarding it',()=>{
  const r=room(),p=r.players.s0;
  assert.equal(p.dropSeq,0);assert.equal(p.dropResult,'');assert.equal(p.carriedRevision,0);
  const revision=acquire(r,'P'),before=plain({core:core(r),bases:r.bases,word:r.word,rewards:r.rewards||{}});
  F.commitDrop(r,'s0',1,'P',revision,NOW+100);
  assert.equal(p.carried,'');assert.equal(p.dropSeq,1);assert.equal(p.dropResult,'P');
  const [[key,item]]=manual(r);assert.match(key,/^ds0_1(?:_|$)/);
  assert.equal(item.letter,'P');assert.equal(item.x,0);assert.equal(item.z,2.2);
  assert.ok(Math.hypot(item.x-p.x,item.z-p.z)>F.C.pickupRadius);
  assert.equal(item.blockedId,'s0');assert.equal(item.blockedUntil,NOW+1350);
  assert.deepEqual(plain({core:core(r),bases:r.bases,word:r.word,rewards:r.rewards||{}}),before);
});

test('duplicate or older DROP delivery cannot remove a later held card or create another drop',()=>{
  const r=room(),p=r.players.s0,revision=acquire(r,'A');
  F.commitDrop(r,'s0',1,'A',revision,NOW+10);
  const first=plain(manual(r));const nextRevision=acquire(r,'E',NOW+20);
  F.commitDrop(r,'s0',1,'A',revision,NOW+30);
  assert.equal(p.carried,'E');assert.equal(p.dropSeq,1);assert.deepEqual(plain(manual(r)),first);
  F.commitDrop(r,'s0',2,'A',revision,NOW+40);
  assert.equal(p.dropSeq,2);assert.equal(p.dropResult,'CHANGED');assert.equal(p.carried,'E');
  F.commitDrop(r,'s0',3,'E',nextRevision,NOW+50);
  assert.equal(p.dropResult,'E');assert.equal(manual(r).length,2);
  F.commitDrop(r,'s0',2,'A',revision,NOW+60);
  assert.equal(p.dropSeq,3);assert.equal(manual(r).length,2);assert.deepEqual(plain(manual(r)[0]),first[0]);
});

test('same-letter reacquisition after damage is distinguished by carried revision',()=>{
  const r=room(),p=r.players.s0,originalRevision=acquire(r,'P');
  F.dropCarried(r,'s0',p.x,p.z,NOW+10);
  const laterRevision=acquire(r,'P',NOW+20);
  assert.ok(laterRevision>originalRevision);assert.equal(r.letters.ds0.letter,'P');
  F.commitDrop(r,'s0',1,'P',originalRevision,NOW+30);
  assert.equal(p.dropSeq,1);assert.equal(p.dropResult,'CHANGED');assert.equal(p.carried,'P');assert.equal(manual(r).length,0);
  F.commitDrop(r,'s0',2,'P',laterRevision,NOW+40);
  assert.equal(p.dropResult,'P');assert.equal(manual(r).length,1);assert.equal(r.letters.ds0.letter,'P');
});

test('empty or dead requests are acknowledged and cannot execute after pickup or respawn',()=>{
  for(const hp of [0,F.C.maxHp]){
    const r=room(),p=r.players.s0;p.hp=hp;p.carriedRevision=7;p.respawnAt=NOW+100;
    F.commitDrop(r,'s0',1,'A',7,NOW+10);
    assert.equal(p.dropSeq,1);assert.equal(p.dropResult,'EMPTY');assert.equal(manual(r).length,0);
    if(!hp){F.stepRoom(r,'s0',NOW+200);assert.equal(p.hp,F.C.maxHp);assert.equal(p.dropSeq,1);assert.equal(p.carriedRevision,7);}
    p.x=p.z=0;const revision=acquire(r,'A',NOW+300);assert.ok(revision>7);
    F.commitDrop(r,'s0',1,'A',7,NOW+400);
    assert.equal(p.carried,'A');assert.equal(manual(r).length,0);
  }
});

test('core pickups and vault raids each advance carried revision',()=>{
  const r=room(),p=r.players.s0;
  const first=acquire(r,'L');assert.equal(first,1);
  F.dropCarried(r,'s0',p.x,p.z,NOW+10);
  const base=r.bases.s1;base.hp=0;base.stored='P';p.x=base.x;p.z=base.z;parkSources(r);
  F.tickLetters(r,NOW+20);
  assert.equal(p.carried,'P');assert.equal(p.carriedRevision,first+1);assert.equal(base.stored,'');
});

test('manual cards remain distinct at capacity; a refused drop keeps its card and forced drops still work',()=>{
  const r=room(),p=r.players.s0;
  for(let i=0;i<32;i++){
    const letter=String.fromCharCode(65+i%26),revision=acquire(r,letter,NOW+i*100);
    F.commitDrop(r,'s0',i+1,letter,revision,NOW+i*100+10);
    assert.equal(p.dropResult,letter);assert.equal(manual(r).length,i+1);
  }
  const retained=plain(manual(r)),revision=acquire(r,'Z',NOW+4000);
  F.commitDrop(r,'s0',33,'Z',revision,NOW+4010);
  assert.equal(p.dropSeq,33);assert.equal(p.dropResult,'FULL');assert.equal(p.carried,'Z');
  assert.deepEqual(plain(manual(r)),retained);
  F.dropCarried(r,'s0',p.x,p.z,NOW+4020);
  assert.equal(p.carried,'');assert.equal(r.letters.ds0.letter,'Z');assert.deepEqual(plain(manual(r)),retained);
  p.hp=0;F.tickLetters(r,NOW+3600000);assert.deepEqual(plain(manual(r)),retained);
  assert.equal(Object.keys(core(r)).length,26);assert.equal(new Set(Object.values(core(r)).map(item=>item.letter)).size,26);
});

test('a rival can pick up a manual card immediately while its former owner waits for the lock',()=>{
  const r=room(),p=r.players.s0,revision=acquire(r,'A');F.commitDrop(r,'s0',1,'A',revision,NOW+10);
  const [key,item]=manual(r)[0],rival=r.players.s1;parkSources(r);
  rival.hp=F.C.maxHp;rival.x=item.x;rival.z=item.z;
  F.tickLetters(r,NOW+11);
  assert.equal(rival.carried,'A');assert.equal(rival.carriedRevision,1);assert.equal(p.carried,'');assert.equal(r.letters[key],undefined);
  const ownRoom=room(),owner=ownRoom.players.s0,ownRevision=acquire(ownRoom,'E');
  F.commitDrop(ownRoom,'s0',1,'E',ownRevision,NOW+20);
  const [ownKey,ownItem]=manual(ownRoom)[0];owner.x=ownItem.x;owner.z=ownItem.z;parkSources(ownRoom);
  F.tickLetters(ownRoom,ownItem.blockedUntil-1);assert.equal(owner.carried,'');assert.ok(ownRoom.letters[ownKey]);
  F.tickLetters(ownRoom,ownItem.blockedUntil);assert.equal(owner.carried,'E');assert.equal(owner.carriedRevision,ownRevision+1);
  assert.equal(ownRoom.letters[ownKey],undefined);
});

test('corner drops use a reachable alternative beyond pickup radius and inside battlefield bounds',()=>{
  for(const x of [-89,89])for(const z of [-89,89]){
    const r=room(),p=r.players.s0,revision=acquire(r,'A');p.x=x;p.z=z;p.hull=Math.atan2(-x,z);
    F.commitDrop(r,'s0',1,'A',revision,NOW+10);
    assert.equal(p.dropResult,'A');const [,item]=manual(r)[0];
    assert.ok(item.x>=-89&&item.x<=89);assert.ok(item.z>=-89&&item.z<=89);
    assert.ok(Math.hypot(item.x-x,item.z-z)>F.C.pickupRadius);assert.equal(F.canOccupy(r,'s0',item.x,item.z),true);
  }
});

test('protected rival vaults redirect drops; a fully blocked placement retains its letter',()=>{
  const r=room(),p=r.players.s0,revision=acquire(r,'A'),base=r.bases.s1;
  p.x=base.x-F.C.baseBlockRadius-.1;p.z=base.z;p.hull=-Math.PI/2;
  F.commitDrop(r,'s0',1,'A',revision,NOW+10);
  assert.equal(p.dropResult,'A');const [,item]=manual(r)[0];assert.equal(F.canOccupy(r,'s0',item.x,item.z),true);
  const blocked=room(),q=blocked.players.s0,blockedRevision=acquire(blocked,'E');
  for(const [key,b] of Object.entries(blocked.bases))if(key!=='s0'){b.x=0;b.z=0;}
  F.commitDrop(blocked,'s0',1,'E',blockedRevision,NOW+20);
  assert.equal(q.dropSeq,1);assert.equal(q.dropResult,'BLOCKED');assert.equal(q.carried,'E');assert.equal(manual(blocked).length,0);
});

test('manual key reuse after a seat reset chooses a free suffix without replacing the earlier card',()=>{
  const r=room(),p=r.players.s0,revision=acquire(r,'A');F.commitDrop(r,'s0',1,'A',revision,NOW+10);
  const [oldKey,oldItem]=manual(r)[0],before=plain(oldItem);p.dropSeq=0;
  const nextRevision=acquire(r,'E',NOW+20);F.commitDrop(r,'s0',1,'E',nextRevision,NOW+30);
  assert.equal(manual(r).length,2);assert.deepEqual(plain(r.letters[oldKey]),before);
  assert.deepEqual(manual(r).map(([,item])=>item.letter).sort(),['A','E']);
});

test('mailbox DROP binds to its seat owner and older clients without DROP fields still move',()=>{
  const r=room(),p=r.players.s0,revision=acquire(r,'A');
  const command={...F.tankPose(p),uid:'another-owner',t:NOW+10,fireSeq:0,bombSeq:0,
    dropSeq:1,dropLetter:'A',dropRevision:revision};
  F.applyCommands(r,{s0:command},NOW+10);
  assert.equal(p.carried,'A');assert.equal(p.dropSeq,0);assert.equal(manual(r).length,0);
  command.uid=p.id;F.applyCommands(r,{s0:command},NOW+10);
  assert.equal(p.carried,'');assert.equal(p.dropSeq,1);assert.equal(manual(r).length,1);
  acquire(r,'E',NOW+20);command.t=NOW+30;
  F.applyCommands(r,{s0:command},NOW+30);
  assert.equal(p.carried,'E');assert.equal(manual(r).length,1);
  const legacy={...F.tankPose(p),x:3,uid:p.id,t:NOW+40,fireSeq:0,bombSeq:0};
  F.applyCommands(r,{s0:legacy},NOW+40);
  assert.equal(p.x,3);assert.equal(p.carried,'E');assert.equal(p.dropSeq,1);
});

test('readmitted seat rejects a previous owner DROP even when letter and revision match',()=>{
  let r=room();for(let i=2;i<=4;i++)r=F.admit(r,'peer-'+i,NOW,'unused');
  const old=r.players.s0,oldUid=old.id;
  for(const [key,p] of Object.entries(r.players))if(key!=='s0')p.t=NOW+20000;
  r=F.admit(r,'replacement-owner',NOW+20000,'unused');
  const p=r.players.s0;assert.notEqual(p.id,oldUid);assert.equal(p.dropSeq,0);p.x=p.z=0;
  const revision=acquire(r,'P',NOW+20001);
  const stale={...F.tankPose(p),uid:oldUid,t:NOW+20010,fireSeq:0,bombSeq:0,
    dropSeq:1,dropLetter:'P',dropRevision:revision};
  F.applyCommands(r,{s0:stale},NOW+20010);
  assert.equal(p.carried,'P');assert.equal(p.dropSeq,0);assert.equal(manual(r).length,0);
  F.applyCommands(r,{s0:{...stale,uid:p.id}},NOW+20010);
  assert.equal(p.carried,'');assert.equal(p.dropSeq,1);assert.equal(manual(r).length,1);
});
