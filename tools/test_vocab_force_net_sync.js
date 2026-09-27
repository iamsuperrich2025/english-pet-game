'use strict';
/* รอบ 1603: ทดสอบโฟกัส — multiplayer sync (บั๊ก k ใน _syncPeer), การยอมรับคำจาก host,
   ป้ายชื่อ + แถบ HP, การปัดสลับเป้าชม (รวมบอท), และ rules ที่ปลดล็อก vforce สาธารณะ */
const fs=require('fs');
const path=require('path');
const vm=require('vm');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
let n=0;
const assert=(ok,msg)=>{ if(!ok){ console.error('FAIL',msg); process.exitCode=1; } else n++; };

/* ---------- sandbox สำหรับโหลดโมดูล vocab-force ---------- */
function makeSandbox(extra){
  const sandbox={ console:{warn(){},error(){},log(){}}, setTimeout, clearTimeout };
  sandbox.window=sandbox;
  sandbox.globalThis=sandbox;
  vm.createContext(sandbox);
  vm.runInContext(read('minigames/vocab-force/vocab-force-namespace.js'),sandbox);
  if(extra) Object.assign(sandbox,extra);
  return sandbox;
}
function loadIn(sandbox,file){
  vm.runInContext(read(file),sandbox);
  return sandbox.VocabForce;
}

/* ---------- 1) regression: _syncPeer ต้องไม่ throw และตำแหน่งลู่เข้าเป้า ---------- */
function threeStub(made){
  made=made||[];
  return {
    sRGBEncoding:3001,
    PlaneGeometry:class{ constructor(){} },
    MeshBasicMaterial:class{ constructor(o){ this.o=o; } dispose(){ made.push('mat-dispose'); } },
    Group:class{ constructor(){ this.children=[]; this.position={x:0,y:0,z:0,set(){}}; this.rotation={x:0,y:0,z:0}; this.quaternion={copy(){}}; this.visible=true; this.name=''; } add(...c){ this.children.push(...c); } },
    Mesh:class{ constructor(g,m){ this.geometry=g; this.material=m; this.position={set(){},x:0,y:0,z:0}; this.scale={set(){}}; } },
    CanvasTexture:class{ constructor(c){ this.canvas=c; made.push('tex'); } dispose(){ made.push('tex-dispose'); } },
    Sprite:class{ constructor(m){ this.material=m; this.scale={set(w,h){ this.w=w; this.h=h; }}; this.position={y:0}; this.center={set(){}}; this.parent=null; this.name=''; } },
    SpriteMaterial:class{ constructor(){ this.map=null; this.needsUpdate=false; } dispose(){ made.push('mat-dispose'); } }
  };
}
function docStub(){
  const ctxStub={
    font:'', textAlign:'', textBaseline:'', fillStyle:'', strokeStyle:'', lineWidth:1, lineJoin:'',
    measureText(t){ return {width:String(t).length*18}; },
    beginPath(){},moveTo(){},lineTo(){},arcTo(){},closePath(){},fill(){},stroke(){},strokeText(){},fillText(){}
  };
  return { createElement(){ return {width:0,height:0,getContext(){ return ctxStub; }}; } };
}
{
  const sb=makeSandbox({THREE:threeStub(),document:docStub()});
  loadIn(sb,'minigames/vocab-force/ui/health-bar.js');
  const VF=loadIn(sb,'minigames/vocab-force/runtime/vocab-force-net.js');
  VF.PLAYER_HP=1000;
  const net=new VF.VocabForceNet();
  net.scene={add(){}};
  /* สร้าง vis ผ่าน _clonePeer จริง (stub clone/anim) เพื่อให้ tag+bar ถูกผูกตามโปรดักชัน */
  VF._t.cloneSkinned=(m)=>m;
  VF.NexAnimationController=class{ constructor(){} addClip(){} play(){} tick(){} has(){ return false; } };
  const vis=net._clonePeer(net.scene,{model:{},manifest:{},anim:{clips:{}}});
  assert(vis&&vis.tag&&vis.bar,'_clonePeer attaches a name tag and a world HP bar to every peer');
  const rec={x:10,z:-6,y:0.4,yaw:1.1,n:'สมชาย',hp:'H|640'};
  let threw=false;
  try{
    for(let i=0;i<120;i++) net._syncPeer(vis,rec,0.016,null);
  }catch(e){ threw=true; }
  assert(!threw,'_syncPeer never throws after the round-1603 k fix');
  assert(Math.abs(vis.x-10)<0.01&&Math.abs(vis.z+6)<0.01&&Math.abs(vis.y-0.4)<0.01,'peer position converges to the network record');
  assert(vis.tag&&vis.tagName==='สมชาย','peer name tag follows rec.n');
  assert(vis.bar,'peer gets a world HP bar');
  assert(vis.bar.group.visible===true&&vis._lastHp===640,'peer bar visible with parsed hp');
  net._drop&&net._drop('x'); /* no-op smoke */
  vis.bar.group.visible=false;
  net._rec={u1:rec};
  net.myUid='me';
  net.player={x:0,z:0,y:0,yaw:0,alive:true,hp:1000,model:null};
  net.scene=null;
  net.room={tick(){},send(){},online:true,peers:{u1:{}},joined:true};
  net.onWord=()=>{};
  let threw2=false;
  try{ net.tick(0.016,net.player,{seed:1,wordsDone:0,progress:{word:'BREAD',thai:'ขนมปัง'}},null,()=>{}); }catch(e){ threw2=true; }
  assert(!threw2,'net.tick with a live peer record does not throw');
}

/* ---------- 2) packHp/parseHp/parseDrop roundtrip ---------- */
{
  const sb=makeSandbox();
  const VF=loadIn(sb,'minigames/vocab-force/runtime/vocab-force-net.js');
  VF.PLAYER_HP=1000;
  assert(VF._t.parseHp(VF._t.packHp({hp:480,alive:true}))===480,'packHp/parseHp roundtrip');
  assert(VF._t.parseHp('garbage')===1000,'parseHp falls back to full hp');
  const drop=VF._t.parseDrop('H|0|7|APLE');
  assert(drop&&drop.seq===7&&drop.letters==='APLE','parseDrop reads the dead-player letter bag');
  assert(VF._t.parseDrop('H|500')===null,'a living player record is not a drop');
}

/* ---------- 3) ผู้เล่นฝั่ง non-host ต้องรับคำจาก host (คำเดียวกันทั้งห้อง) ---------- */
{
  const sb=makeSandbox();
  const VF=loadIn(sb,'minigames/vocab-force/runtime/vocab-force-net.js');
  VF.PLAYER_HP=1000;
  const net=new VF.VocabForceNet();
  net.myUid='bbbb';
  net.player={x:0,z:0,y:0,yaw:0,alive:true,hp:1000,model:null};
  net.scene=null;
  let sent=null;
  net.room={tick(){},send(rec){ sent=rec; },online:true,peers:{aaaa:{}},joined:true};
  const adopted=[];
  net.onWord=(pair)=>adopted.push(pair);
  net._rec={aaaa:{x:1,z:2,y:0,yaw:0,n:'Host',hp:'H|900',c:'BREAD',ct:77,cw:'ขนมปัง',w:0}};
  net.tick(0.016,net.player,{seed:3,wordsDone:0,progress:{word:'APPLE',thai:'แอปเปิ้ล'}},null,()=>{});
  assert(adopted.length===1&&adopted[0].w==='BREAD'&&adopted[0].seed===77&&adopted[0].th==='ขนมปัง','non-host adopts the host word + seed + meaning');
  assert(sent&&sent.c==='APPLE','we still broadcast our own word for others');
  net.tick(0.016,net.player,{seed:3,wordsDone:0,progress:{word:'APPLE',thai:'แอปเปิ้ล'}},null,()=>{});
  assert(adopted.length===1,'the same host word is not adopted twice');
  net._rec.aaaa.c='ORANGE'; net._rec.aaaa.ct=78;
  net.tick(0.016,net.player,{seed:3,wordsDone:0,progress:{word:'APPLE',thai:'แอปเปิ้ล'}},null,()=>{});
  assert(adopted.length===2&&adopted[1].w==='ORANGE','the next host word triggers a new round');
  /* host ฝั่งผู้เล่นเองต้องไม่ยอมรับคำจากใคร (เป็นฝั่งประกาศคำ) */
  const host=new VF.VocabForceNet();
  host.myUid='aaaa';
  host.player={x:0,z:0,y:0,yaw:0,alive:true,hp:1000,model:null};
  host.scene=null;
  host.room={tick(){},send(){},online:true,peers:{bbbb:{}},joined:true};
  const adopted2=[];
  host.onWord=(pair)=>adopted2.push(pair);
  host._rec={bbbb:{x:1,z:2,y:0,yaw:0,n:'Other',hp:'H|900',c:'BREAD',ct:77,cw:'ขนมปัง',w:0}};
  host.tick(0.016,host.player,{seed:9,wordsDone:0,progress:{word:'APPLE',thai:'แอปเปิ้ล'}},null,()=>{});
  assert(adopted2.length===0,'the host never adopts a word from peers');
}

/* ---------- 4) ปัดสลับเป้าชมตอนตาย: ไปข้างหน้า/ย้อน/วนรอบ รวมบอท ---------- */
{
  const sb=makeSandbox();
  const VF=loadIn(sb,'minigames/vocab-force/runtime/vocab-force-spectator.js');
  const spec=new VF.SpectatorController();
  const humans=[
    {id:'u_b',name:'Bee',x:1,y:0,z:1,alive:true},
    {id:'u_d',name:'Dee',x:2,y:0,z:2,alive:true}
  ];
  const bots={bots:[
    {id:'vfb1',name:'Arthit',ctl:{alive:true,x:3,y:0,z:3,pivot:null}},
    {id:'vfb2',name:'Alice',ctl:{alive:true,x:4,y:0,z:4,pivot:null}}
  ]};
  const hudLog=[];
  const hud={setSpectator(on,name,count){ hudLog.push([on,name,count]); }};
  spec.enter();
  const seq=[];
  const steps=[0,1,1,1];
  for(let i=0;i<steps.length;i++){
    const t=spec.tick({spectateStep:steps[i]}, {spectatorTargets:()=>humans.slice()}, hud, null, bots);
    seq.push(t&&t.id);
  }
  assert(JSON.stringify(seq)===JSON.stringify(['u_b','u_d','vfb1','vfb2']),'swipe next cycles a→b→bots in stable order');
  const backSteps=[-1,-1,-1];
  const back=[];
  for(let i=0;i<backSteps.length;i++){
    const t=spec.tick({spectateStep:backSteps[i]}, {spectatorTargets:()=>humans.slice()}, hud, null, bots);
    back.push(t&&t.id);
  }
  assert(JSON.stringify(back)===JSON.stringify(['vfb1','u_d','u_b']),'swipe previous walks backward');
  const wrap=spec.tick({spectateStep:-1}, {spectatorTargets:()=>humans.slice()}, hud, null, bots);
  assert(wrap&&wrap.id==='vfb2','swiping back from the first target wraps to the last');
  const fwd=spec.tick({spectateStep:1}, {spectatorTargets:()=>humans.slice()}, hud, null, bots);
  assert(fwd&&fwd.id==='u_b','swiping forward from the last target wraps to the first');
  const alone=new VF.SpectatorController();
  alone.enter();
  const safe=alone.tick({spectateStep:1},{spectatorTargets:()=>[]},hud,{surfaceY:()=>0.5},null);
  assert(safe&&safe.id==='safe'&&!safe.x,'an empty arena keeps the safe camera');
}

/* ---------- 5) input ปัดตอน spectator: ขวา→ซ้าย=ถัดไป (+1) · ซ้าย→ขวา=ย้อน (−1) ---------- */
{
  const sb=makeSandbox();
  loadIn(sb,'minigames/vocab-force/controls/vocab-force-input.js');
  const input=new sb.VocabForce.VocabForceInput();
  input.setSpectating(true);
  /* เลียนแบบ pointer swipe: ลงที่ x=300 แล้วปล่อที่ x=180 (dx=-120 → ขวา→ซ้าย) */
  input._pointers.set(9,{act:'spectate',sx:300,sy:200,x:300,y:200});
  input._onPointerUp({pointerId:9,clientX:180,clientY:205});
  const p1=input.poll();
  assert(p1.spectateStep===1&&p1.punch===false&&p1.dash===false&&p1.slam===false,'right-to-left swipe queues NEXT and no action buttons while spectating');
  input._pointers.set(10,{act:'spectate',sx:100,sy:200,x:100,y:200});
  input._onPointerUp({pointerId:10,clientX:220,clientY:210});
  const p2=input.poll();
  assert(p2.spectateStep===-1,'left-to-right swipe queues PREVIOUS');
  input._pointers.set(11,{act:'spectate',sx:100,sy:200,x:100,y:200});
  input._onPointerUp({pointerId:11,clientX:118,clientY:202});
  assert(input.poll().spectateStep===0,'a tiny drag is not a swipe');
  const k={code:'ArrowRight',preventDefault(){}};
  input._onKey(k);
  assert(input.poll().spectateStep===1,'ArrowRight still steps forward');
}

/* ---------- 6) NameTag + HealthBar สีเขียว/เหลือง/แดง ---------- */
{
  const sb=makeSandbox();
  const made=[];
  sb.THREE=threeStub(made);
  sb.document=docStub();
  const VF=loadIn(sb,'minigames/vocab-force/ui/health-bar.js');
  assert(VF._t.hpBand(0.9)==='green'&&VF._t.hpBand(0.61)==='green','hp band green above 60%');
  assert(VF._t.hpBand(0.6)==='yellow'&&VF._t.hpBand(0.31)==='yellow','hp band yellow between 30–60%');
  assert(VF._t.hpBand(0.3)==='red'&&VF._t.hpBand(0)==='red','hp band red at or below 30%');
  const tag=new VF.NameTag('ทดสอบ');
  assert(tag.sprite&&tag.sprite.scale.h===0.5,'name tag sprite scales to the fixed world height');
  tag.setText('ทดสอบ');
  assert(made.filter(x=>x==='tex').length===1,'setText with the same name redraws nothing');
  tag.setText('คนอื่น');
  assert(made.filter(x=>x==='tex').length===2&&made.includes('tex-dispose'),'setText with a new name disposes the old texture');
  tag.dispose();
  assert(made.includes('mat-dispose'),'name tag dispose releases the material');
}

/* ---------- 7) rules: vforce ปลดล็อกสาธารณะแล้ว ---------- */
{
  const md=read('handoff/RULES.md');
  const m=md.match(/```json\s*\n([\s\S]*?)\n```/);
  assert(!!m,'RULES.md embeds the full rules JSON block');
  const doc=JSON.parse(m[1]).rules;
  const worldRead=doc.world['$map']['.read'];
  const wroomRead=doc.wroom['$map']['.read'];
  const winfoRead=doc.winfo['$map']['.read'];
  assert(worldRead.includes("$map !== 'skirmish')")&&!worldRead.includes('vforce'),'world read no longer locks vforce');
  assert(!wroomRead.includes('vforce')&&!winfoRead.includes('vforce'),'wroom/winfo read no longer lock vforce');
  const wroomVal=JSON.stringify(doc.wroom['$map']['.validate']);
  assert(wroomVal.includes('vforce'),'vforce stays in the write allowlist');
  const worldWrite=JSON.stringify(doc.world['$map']['$uid']['.write']);
  assert(worldWrite.includes('auth.uid === $uid'),'world writes stay per-uid');
}

/* ---------- 8) runtime ต่อป้ายตัวเอง + ส่งบอท/กล้องให้ spectator ---------- */
{
  const rt=read('minigames/vocab-force/runtime/vocab-force-runtime.js');
  assert(rt.includes('attachSelfLabel')&&rt.includes('tickSelfLabel')&&rt.includes('disposeSelfLabel'),'runtime owns the self name+HP label lifecycle');
  assert(rt.includes('spectator.tick(poll, net, hud, arena, bots)'),'spectator receives the bot roster');
  const hudSrc=read('minigames/vocab-force/ui/vocab-force-hud.js');
  assert(hudSrc.indexOf('data-vf-act="slam"')<hudSrc.indexOf('data-vf-act="dash"'),'HUD DOM order puts SLAM before DASH (round 1603 swap)');
  const css=read('minigames/vocab-force/css/vocab-force.css');
  const slamR=css.match(/\.vf-slam\{right:calc\((\d+)px/);
  const dashR=css.match(/\.vf-dash\{right:calc\((\d+)px/);
  assert(slamR&&dashR&&Number(slamR[1])<Number(dashR[1]),'CSS puts SLAM nearer the thumb than DASH');
}

console.log((process.exitCode?'FAILURES':'PASS')+' · '+n+' asserts · round 1603');
