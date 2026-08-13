"use strict";
const fs=require('fs'),vm=require('vm'),assert=require('assert'),zlib=require('zlib');
const code=fs.readFileSync('js/lettercannon.js','utf8');
const html=fs.readFileSync('index_classic.html','utf8'),city=fs.readFileSync('js/city3d.js','utf8'),main=fs.readFileSync('js/main.js','utf8'),build=fs.readFileSync('tools/build_web.mjs','utf8');
const listeners={};
function el(){return {style:{},classList:{add(){},remove(){},toggle(){}},appendChild(){},remove(){},addEventListener(){},querySelector(){return el();},querySelectorAll(){return[];},setAttribute(){},getBoundingClientRect(){return{width:1280,height:720}},getContext(){return null}};}
let admin=true;
const sandbox={console,performance:{now:()=>1000},Math,setTimeout:(fn)=>0,clearTimeout(){},requestAnimationFrame:()=>1,cancelAnimationFrame(){},localStorage:{getItem:()=>null,setItem(){}},window:{addEventListener(){}},document:{readyState:'complete',addEventListener(n,f){listeners[n]=f;},getElementById(){return null},createElement:el,body:el()},state:{student:{grade:'ป.1'},sound:false},isAdmin:()=>admin,vocabForStudent:()=>[['apple','แอปเปิล'],['letter','ตัวอักษร'],['book','หนังสือ']],addCoins(){},saveState(){}};
sandbox.window=sandbox;vm.createContext(sandbox);vm.runInContext(code,sandbox);
const T=sandbox.LetterCannon._t;
assert.strictEqual(T.adminAllowed(),true,'existing admin authorization is allowed');admin=false;assert.strictEqual(T.adminAllowed(),false,'non-admin account cannot bypass admin gate');admin=true;
assert(T.wordPool().some(x=>x.en==='APPLE'),'approved grade vocabulary');
T.nextWord();const w=T.word.en;assert(w.length>=3,'word selected');
T.ensureNeeded(true);assert(T.letters.some(x=>x.alive&&x.ch===w[0]),'next required letter guaranteed');
const need=T.letters.find(x=>x.alive&&x.ch===w[0]);T.hit(need,false);assert.strictEqual(T.pos,1,'correct letter advances exactly once');
const wrong=T.spawnLetter(w[1]==='Z'?'Y':'Z',false),before=T.pos,combo=T.combo;T.hit(wrong,false);assert.strictEqual(T.pos,before,'wrong letter has no penalty');assert.strictEqual(T.combo,combo,'wrong letter does not reset combo');
assert(T.particles.length>=16&&T.shockwaves.length>=2,'correct and wrong targets create amplified particles and shockwaves');
for(let i=0;i<40;i++)T.spawnLetter('A',false);assert(T.letters.filter(x=>x.alive).length<=T.MAX_LETTERS,'letter pool capped');
T.POWER.forEach(p=>T.activate(p));assert(T.POWER.some(p=>p.id==='triple')&&T.POWER.some(p=>p.id==='beam')&&T.POWER.some(p=>p.id==='chain')&&T.POWER.some(p=>p.id==='homing')&&T.POWER.some(p=>p.id==='nova'),'required powers exposed');
T.setViewport(1280,720);assert(T.turretSize()<=190&&T.turretSize()<=720*.26,'cannon is compact so the playfield stays wide');T.setPlayerX(640);const gun=T.turretGeometry(640,180,0,0);assert(gun.muzzles[0].x<640&&gun.muzzles[1].x>640&&gun.muzzles.every(m=>m.y<gun.mountY),'small fixed cannon uses both real upward muzzle positions');
const lim=T.cannonLimits();T.setPlayerX(-100);assert.strictEqual(T.playerX,lim.min,'left movement clamps inside screen');T.setPlayerX(9999);assert.strictEqual(T.playerX,lim.max,'right movement clamps inside screen');
T.setPlayerX(640);T.setMove(true,false);T.step(.016);const firstVX=Math.abs(T.playerVX);T.step(.016);assert(T.playerX<640&&Math.abs(T.playerVX)>firstVX,'holding left accelerates cannon smoothly without input lag');for(let i=0;i<8;i++)T.step(.016);const beforeBrake=Math.abs(T.playerVX);T.setMove(false,false);T.step(.016);assert(Math.abs(T.playerVX)<beforeBrake&&Math.abs(T.playerVX)>0,'releasing movement eases smoothly instead of stopping abruptly');T.setMove(false,true);for(let i=0;i<12;i++)T.step(.016);assert(T.playerVX>0,'holding right responds quickly and reverses cannon direction');T.setMove(false,false);
function pngInfo(file){
  const b=fs.readFileSync(file);assert.strictEqual(b.toString('ascii',1,4),'PNG',file+' is PNG');const w=b.readUInt32BE(16),h=b.readUInt32BE(20),depth=b[24],type=b[25],interlace=b[28];assert(depth===8&&type===6&&interlace===0,file+' is non-interlaced RGBA8');
  let at=8,idat=[];while(at<b.length){const n=b.readUInt32BE(at),name=b.toString('ascii',at+4,at+8);if(name==='IDAT')idat.push(b.subarray(at+8,at+8+n));at+=12+n;}
  const raw=zlib.inflateSync(Buffer.concat(idat)),stride=w*4,prev=Buffer.alloc(stride),row=Buffer.alloc(stride);let p=0,transparent=0,opaque=0;
  for(let y=0;y<h;y++){const filter=raw[p++];for(let x=0;x<stride;x++){const v=raw[p++],a=x>=4?row[x-4]:0,bv=prev[x],c=x>=4?prev[x-4]:0;row[x]=(v+(filter===1?a:filter===2?bv:filter===3?Math.floor((a+bv)/2):filter===4?(()=>{const q=a+bv-c,pa=Math.abs(q-a),pb=Math.abs(q-bv),pc=Math.abs(q-c);return pa<=pb&&pa<=pc?a:pb<=pc?bv:c;})():0))&255;}for(let x=3;x<stride;x+=4){if(row[x]===0)transparent++;if(row[x]===255)opaque++;}row.copy(prev);}
  assert(transparent>0&&opaque>0,file+' has real transparent and opaque pixels');return{w,h};
}
for(const name of ['letter_cannon_gun_head.png']){const path='assets/images/letter_cannon/'+name,info=pngInfo(path);assert.deepStrictEqual(info,{w:1254,h:1254},name+' dimensions');assert(build.includes(path),name+' copied by production build');}
assert(build.includes("'assets/images/letter_cannon/'"),'git-archive fallback publishes the Letter Cannon asset directory');
assert(html.includes('btn-rail-lettercannon')&&html.includes('js/lettercannon.js')&&html.includes('css/lettercannon.css'),'classic lobby entry and assets');
assert(city.includes("bld('lettercannon'")&&city.includes('ป้อมพิทักษ์คำศัพท์'),'3D city entry and bilingual name');
assert(main.includes("lettercannon:'#btn-rail-lettercannon'"),'3D go routing');
assert(html.includes('btn-rail-lettercannon')&&html.includes('เปิดให้เฉพาะบัญชี Admin')&&html.includes('rail-lock'),'admin-only lobby lock is visible');
assert(city.includes("go==='lettercannon'")&&city.includes('cityLetterCannonAdmin'),'3D city gate requires persisted admin authorization');
assert(code.includes('function adminAllowed()')&&code.includes("if(!adminAllowed()){lockedNotice();return;}"),'admin-only gate protects direct game open and lobby event');
assert(code.includes('drawImage(turretImage')&&!code.includes('letter_cannon_base.png')&&!code.includes('baseClip'),'runtime renders only the smaller cannon head without its base');
assert(code.includes('if(firePointers.size||keyFire)fire();')&&code.includes('const movePointers=new Map(),firePointers=new Map()'),'shots only repeat while a shoot control is held');
assert(code.includes('id="lc-fire-left"')&&code.includes('id="lc-fire-right"')&&code.indexOf('id="lc-fire-left"')<code.indexOf('id="lc-left"')&&code.indexOf('id="lc-fire-right"')<code.indexOf('id="lc-right"'),'shoot button is present above each left/right movement control');
assert(!code.includes('NetRoom.create')&&!code.includes('netJoin()')&&!code.includes('drawPeerCannon'),'Letter Cannon is solo-only with no multiplayer runtime');
assert(code.includes('function shockwave')&&code.includes('function impact')&&code.includes("globalCompositeOperation='lighter'"),'projectile and target impact spectacle included');
assert(!code.includes('registerTap(now)')&&!code.includes('tapPointers.set'),'obsolete double-tap firing removed');
assert(code.includes("pointercancel")&&code.includes("orientationchange")&&code.includes("visibilitychange")&&code.includes("clearTimers()")&&code.includes("movePointers.clear()"),'input and lifecycle cleanup paths included');
console.log('PASS Letter Cannon: press-to-fire controls on both sides, responsive smooth movement, preserved spectacle FX, admin gate, grade words, no penalty');
