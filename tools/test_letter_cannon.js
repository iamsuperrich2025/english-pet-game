"use strict";
const fs=require('fs'),vm=require('vm'),assert=require('assert'),zlib=require('zlib');
const code=fs.readFileSync('js/lettercannon.js','utf8');
const html=fs.readFileSync('index_classic.html','utf8'),city=fs.readFileSync('js/city3d.js','utf8'),main=fs.readFileSync('js/main.js','utf8'),net=fs.readFileSync('js/netroom.js','utf8'),rules=fs.readFileSync('handoff/RULES.md','utf8'),build=fs.readFileSync('tools/build_web.mjs','utf8');
const listeners={};
function el(){return {style:{},classList:{add(){},remove(){},toggle(){}},appendChild(){},remove(){},addEventListener(){},querySelector(){return el();},querySelectorAll(){return[];},setAttribute(){},getBoundingClientRect(){return{width:1280,height:720}},getContext(){return null}};}
let teacher=true;
const sandbox={console,performance:{now:()=>1000},Math,setTimeout:(fn)=>0,clearTimeout(){},requestAnimationFrame:()=>1,cancelAnimationFrame(){},localStorage:{getItem:()=>null,setItem(){}},window:{addEventListener(){}},document:{readyState:'complete',addEventListener(n,f){listeners[n]=f;},getElementById(){return null},createElement:el,body:el()},state:{student:{grade:'ป.1'},sound:false},isTeacher:()=>teacher,vocabForStudent:()=>[['apple','แอปเปิล'],['letter','ตัวอักษร'],['book','หนังสือ']],addCoins(){},saveState(){}};
sandbox.window=sandbox;vm.createContext(sandbox);vm.runInContext(code,sandbox);
const T=sandbox.LetterCannon._t;
assert.strictEqual(T.ownerAllowed(),true,'existing owner authorization is allowed');teacher=false;assert.strictEqual(T.ownerAllowed(),false,'tester/general account cannot bypass owner gate');teacher=true;
assert(T.wordPool().some(x=>x.en==='APPLE'),'approved grade vocabulary');
T.nextWord();const w=T.word.en;assert(w.length>=3,'word selected');
T.ensureNeeded(true);assert(T.letters.some(x=>x.alive&&x.ch===w[0]),'next required letter guaranteed');
const need=T.letters.find(x=>x.alive&&x.ch===w[0]);T.hit(need,false);assert.strictEqual(T.pos,1,'correct letter advances exactly once');
const wrong=T.spawnLetter(w[1]==='Z'?'Y':'Z',false),before=T.pos,combo=T.combo;T.hit(wrong,false);assert.strictEqual(T.pos,before,'wrong letter has no penalty');assert.strictEqual(T.combo,combo,'wrong letter does not reset combo');
T.setAim(-Math.PI/2);assert(T.aim<=T.AIM_MAX&&T.aim>=T.AIM_MIN,'aim clamped to upper 180 degrees');
for(let i=0;i<40;i++)T.spawnLetter('A',false);assert(T.letters.filter(x=>x.alive).length<=T.MAX_LETTERS,'letter pool capped');
T.POWER.forEach(p=>T.activate(p));assert(T.POWER.some(p=>p.id==='triple')&&T.POWER.some(p=>p.id==='beam')&&T.POWER.some(p=>p.id==='chain')&&T.POWER.some(p=>p.id==='homing')&&T.POWER.some(p=>p.id==='nova'),'required powers exposed');
assert.deepStrictEqual(Array.from(T.seatOrder(7)),[0,-1,1,-2,2,-3,3],'turrets fill center then left/right without overlap');
assert.strictEqual(T.ROOM_MAX,7,'full room opens next room at seven turrets');
T.setViewport(1280,720);const up=T.turretGeometry(640,0,260,0,0),left=T.turretGeometry(640,-Math.PI/2,260,0,0),right=T.turretGeometry(640,Math.PI/2,260,1,0);
assert(up.muzzles[0].x<640&&up.muzzles[1].x>640&&up.muzzles.every(m=>m.y<up.mountY),'up aim uses both real muzzle positions');
assert(left.muzzles.every(m=>m.x<640)&&right.muzzles.every(m=>m.x>640),'left/right aim rotates both muzzles with the rigid head');
assert.strictEqual(left.mountY,right.mountY,'stationary base mount does not rotate');
function pngInfo(file){
  const b=fs.readFileSync(file);assert.strictEqual(b.toString('ascii',1,4),'PNG',file+' is PNG');const w=b.readUInt32BE(16),h=b.readUInt32BE(20),depth=b[24],type=b[25],interlace=b[28];assert(depth===8&&type===6&&interlace===0,file+' is non-interlaced RGBA8');
  let at=8,idat=[];while(at<b.length){const n=b.readUInt32BE(at),name=b.toString('ascii',at+4,at+8);if(name==='IDAT')idat.push(b.subarray(at+8,at+8+n));at+=12+n;}
  const raw=zlib.inflateSync(Buffer.concat(idat)),stride=w*4,prev=Buffer.alloc(stride),row=Buffer.alloc(stride);let p=0,transparent=0,opaque=0;
  for(let y=0;y<h;y++){const filter=raw[p++];for(let x=0;x<stride;x++){const v=raw[p++],a=x>=4?row[x-4]:0,bv=prev[x],c=x>=4?prev[x-4]:0;row[x]=(v+(filter===1?a:filter===2?bv:filter===3?Math.floor((a+bv)/2):filter===4?(()=>{const q=a+bv-c,pa=Math.abs(q-a),pb=Math.abs(q-bv),pc=Math.abs(q-c);return pa<=pb&&pa<=pc?a:pb<=pc?bv:c;})():0))&255;}for(let x=3;x<stride;x+=4){if(row[x]===0)transparent++;if(row[x]===255)opaque++;}row.copy(prev);}
  assert(transparent>0&&opaque>0,file+' has real transparent and opaque pixels');return{w,h};
}
for(const name of ['letter_cannon_base.png','letter_cannon_gun_head.png']){const path='assets/images/letter_cannon/'+name,info=pngInfo(path);assert.deepStrictEqual(info,{w:1254,h:1254},name+' dimensions');assert(build.includes(path),name+' copied by production build');}
assert(build.includes("'assets/images/letter_cannon/'"),'git-archive fallback publishes the Letter Cannon asset directory');
assert(html.includes('btn-rail-lettercannon')&&html.includes('js/lettercannon.js')&&html.includes('css/lettercannon.css'),'classic lobby entry and assets');
assert(city.includes("bld('lettercannon'")&&city.includes('ป้อมพิทักษ์คำศัพท์'),'3D city entry and bilingual name');
assert(main.includes("lettercannon:'#btn-rail-lettercannon'"),'3D go routing');
assert(net.includes("'lettercannon'")&&rules.match(/\$map === 'lettercannon'/g).length>=3,'room discovery and Firebase map rules');
assert(html.includes('btn-rail-lettercannon')&&html.includes('เปิดให้เฉพาะบัญชีเจ้าของ')&&html.includes('rail-lock'),'owner-only lobby lock is visible');
assert(city.includes("go==='lettercannon'")&&city.includes('cityLetterCannonOwner'),'3D city gate requires persisted owner authorization');
assert(code.includes('function ownerAllowed()')&&code.includes("if(!ownerAllowed()){lockedNotice();return;}"),'owner-only gate protects direct game open and lobby event');
assert(code.includes('drawImage(turretImages.base')&&code.includes('drawImage(turretImages.head')&&!code.includes("const base=ctx.createLinearGradient(-80"),'runtime uses new two-layer turret only');
assert(code.includes("touchcancel")&&code.includes("pointercancel")&&code.includes("orientationchange")&&code.includes("visibilitychange")&&code.includes("clearTimers()"),'input and lifecycle cleanup paths included');
console.log('PASS Letter Cannon: owner-only gate, RGBA turret assets, rigid 180-degree head, twin muzzles, touch cleanup, grade words, no penalty, powers, multiplayer seats');
