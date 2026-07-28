/* ============================================================
   hotel3d.js — 🏨 โรงแรมผีสิง 5 ชั้น (รอบ 684 · ผู้ใช้สั่งเปลี่ยนโลกผีสิงใหม่ทั้งโลก)
   สร้าง "ตัวโรงแรม" ล้วน ๆ (โมเดล+ชนกำแพง+บันได+ลิฟต์+เฟอร์นิเจอร์+รูปตามอง)
   ส่วน "การเล่น" (ผี/ไฟฉาย/ตัวอักษร/เสียง) อยู่ในโซน 🏨 ของ js/adventure3d.js
   ▶ แยกไฟล์เพราะ adventure3d.js แตะ 10,700 บรรทัดแล้ว (กฎทอง #2 ห้ามให้ไฟล์อ้วนโตอีก)
   ▶ ต้องโหลดหลัง js/vendor/three.min.js และก่อน js/adventure3d.js (ดู loadAdv3d() ใน js/ui.js)

   🗺️ ผังตึก (มองจากบน · +X = ทางเข้าหน้าโรงแรม)
       WEST -19.5 ─ SHAFT_E -15 ─ CORE_E -12.5 ────────────── BX +20
   z-10.5 ┌──────────────┬──────────────┬──────────┬──────────┐
          │ 🪜 ทางลาดบันได (โล่งทะลุทุกชั้น)│  ห้อง N1 │ N2 │ N3 │
   z -6.5 ├──────────────┤ ราวกันตก      ├──────────┴──────────┤
          │ 🛗 ชานพัก (ราบทุกชั้น)        │                     │
   z -2.5 ├───┬──────────┴───────────────┴─────────────────────┤
          │ลิฟต์│  ⬅ ทางเดินกลาง ➡                    ประตูหน้า │
   z +2.5 ├───┴──────────┬──────────────┬──────────┬──────────┤
          │ ห้องเก็บของ    │  ห้อง S1 │ S2 │ S3               │
   z+10.5 └──────────────┴──────────────┴──────────┴──────────┘
   ชั้น 0 = ล็อบบี้หรู (ไม่มีผนังห้อง) · ชั้น 1-4 = ห้องพัก 6 ห้อง/ชั้น (รวม 24 ห้อง)
   ============================================================ */
window.HOTEL3D=(function(){
'use strict';

let T=null;                      // THREE (ตั้งค่าตอน build)
let TEX=function(){};            // applyTex ของ adventure3d (ไม่มีไฟล์ภาพ = คงสีที่โค้ดวาด)

/* ---------- ค่าผังตึก (หน่วยเมตร) ---------- */
const FLOOR_H=3.4, FLOORS=5, CEIL_H=3.2, SLAB=.2;
const BX=20, BZ=10.5;            // ผนังนอกด้านใน (ครึ่งกว้าง/ครึ่งลึก)
const CZ=2.5;                    // ครึ่งกว้างทางเดินกลาง
const WEST=-19.5;                // ผนังตะวันตกด้านใน
const SHAFT_E=-15;               // หน้าปล่องลิฟต์
const CORE_E=-12.5;              // ขอบตะวันออกของแกนบันได/ลิฟต์
const RZ0=-10.5, RZ1=-6.5;       // เลนทางลาด (โล่งทุกชั้น — ทางลาดพาดผ่าน)
const LZ0=-6.5,  LZ1=-2.5;       // เลนชานพัก (พื้นราบทุกชั้น)
const ROOM_N=3;                  // ห้อง/ฝั่ง/ชั้น
const RW=(BX-CORE_E)/ROOM_N;     // กว้างห้อง ~10.8
const RD=BZ-CZ;                  // ลึกห้อง 8
const DOOR_W=1.7;                // ช่องประตูห้อง
const ENTRY_HW=2.2;              // ครึ่งกว้างประตูหน้าโรงแรม
const PLAYER_R=.42;              // รัศมีตัวผู้เล่นตอนชนกำแพง
function floorY(f){ return f*FLOOR_H; }

/* ============================================================
   🧱 ตัวช่วยรวมกล่องเป็น mesh เดียว (draw call น้อย = มือถือไหว)
   เก็บ position/normal/uv ลง array แล้วค่อยสร้าง BufferGeometry ครั้งเดียว
   uvScale = สเกล uv ตามขนาดจริง (ลายกระเบื้อง/วอลเปเปอร์ซ้ำเท่ากันทุกก้อน)
   ============================================================ */
function Acc(){ return {p:[],n:[],u:[]}; }
function accBox(A,cx,cy,cz,sx,sy,sz,uvScale,rot){
  let g=new T.BoxGeometry(sx,sy,sz);
  if(rot){ if(rot.x) g.rotateX(rot.x); if(rot.y) g.rotateY(rot.y); if(rot.z) g.rotateZ(rot.z); }
  g.translate(cx,cy,cz);
  if(g.index) g=g.toNonIndexed();
  const pos=g.attributes.position.array, nor=g.attributes.normal.array, uv=g.attributes.uv.array;
  for(let i=0;i<pos.length;i++){ A.p.push(pos[i]); A.n.push(nor[i]); }
  // BoxGeometry เรียงหน้า: +X,-X,+Y,-Y,+Z,-Z หน้าละ 6 จุด (หลัง toNonIndexed)
  const face=[[sz,sy],[sz,sy],[sx,sz],[sx,sz],[sx,sy],[sx,sy]];
  for(let f=0;f<6;f++) for(let k=0;k<6;k++){
    const j=(f*6+k)*2;
    const w=uvScale?face[f][0]/uvScale:1, h=uvScale?face[f][1]/uvScale:1;
    A.u.push(uv[j]*w, uv[j+1]*h);
  }
  g.dispose();
}
function accGeo(A){
  const g=new T.BufferGeometry();
  g.setAttribute('position',new T.Float32BufferAttribute(A.p,3));
  g.setAttribute('normal',new T.Float32BufferAttribute(A.n,3));
  g.setAttribute('uv',new T.Float32BufferAttribute(A.u,2));
  g.computeBoundingSphere();
  return g;
}
function accMesh(A,mat,parent){
  if(!A.p.length) return null;
  const m=new T.Mesh(accGeo(A),mat);
  if(parent) parent.add(m);
  return m;
}

/* ============================================================
   🎨 วัสดุ (ไม่มีไฟล์ภาพใน img/tex/ = ใช้สีล้วนที่ตั้งไว้ เกมไม่พัง)
   prompt ภาพทั้งชุดอยู่ใน handoff/PROMPTS_HOTEL.md
   ============================================================ */
function makeMats(){
  /* ⚠️ ต้องเป็น Phong ไม่ใช่ Lambert — Lambert คิดแสง "ต่อจุดยอด" (Gouraud)
     ผนัง/พื้นของโรงแรมเป็นกล่องใหญ่ ๆ มีจุดยอดแค่ 8 จุด → ลำไฟฉายจะไม่ปรากฏบนผนังเลย
     Phong คิดแสงต่อพิกเซล ลำไฟฉายจึงสาดเป็นวงนุ่ม ๆ บนกำแพงจริง (หัวใจของโลกนี้) · shininess ต่ำ = ผิวด้าน */
  const L=(c,key,rx,ry)=>{ const m=new T.MeshPhongMaterial({color:c,shininess:4,specular:0x0a0a0a});
                           if(key) TEX(m,key,rx||1,ry||1); return m; };
  const M={
    wall  : L(0x6f5a45,'tex_hotel_wall',1,1),      // วอลเปเปอร์ทางเดิน
    room  : L(0x7d6a52,'tex_hotel_room',1,1),      // วอลเปเปอร์ในห้อง
    carpet: L(0x5d1f2c,'tex_hotel_carpet',1,1),    // พรมแดงเลือดหมู
    marble: L(0x8f8779,'tex_hotel_marble',1,1),    // พื้นหินอ่อนล็อบบี้
    wood  : L(0x4a3324,'tex_hotel_wood',1,1),      // ไม้เข้ม (ประตู/ตู้/เตียง)
    ceil  : L(0xbdb4a4),
    tile  : L(0xc3cbcd,'tex_hotel_tile',1,1),      // กระเบื้องห้องน้ำ
    porc  : L(0xe8ecec),                           // เครื่องสุขภัณฑ์
    gold  : L(0xb99334),                           // คิ้วทอง/กรอบรูป
    cloth : L(0x6d1622),                           // ผ้าคลุมเตียง/ม่าน
    sheet : L(0xd9d2c2),                           // ผ้าปูที่นอน
    metal : L(0x6a6f75),
    facade: L(0x7a6f61,'tex_hotel_facade',1,1),    // เปลือกนอกอาคาร (สว่างพอให้เห็นตึกตอนกลางคืน)
    stone : L(0x6b665e),
    leaf  : L(0x2c4a2e),
  };
  /* ไฟ/หน้าต่าง = MeshBasic (ไม่ง้อแสง) + fog:false → ยังเรืองแสงทะลุหมอกกลางคืน
     ทำให้ตอนเดินเข้ามาเห็น "โรงแรมหรูไฟสว่าง" ชัดจากไกล (ข้อ 3) */
  M.lamp   =new T.MeshBasicMaterial({color:0xffe6ae,fog:false});   // ไฟในตึก (ดับตอนไฟดับ)
  M.win    =new T.MeshBasicMaterial({color:0xffdf9e,fog:false});   // หน้าต่างสว่างมองจากนอก
  M.glass  =new T.MeshBasicMaterial({color:0x121a2c});   // กระจกหน้าต่างมองจากใน
  M.mirror =new T.MeshBasicMaterial({color:0x2b3038});   // กระจกเงา
  return M;
}

/* ---------- ภาพวาดในกรอบรูป (วาดเอง = ปลอดลิขสิทธิ์ 100%) ---------- */
const PORTRAIT_SKIN=['#c9a98c','#b08e6e','#d8bfa3','#9d7a5c'];
const PORTRAIT_CLOTH=['#2b2f45','#3d2430','#242c26','#3a3327'];
function portraitTexture(seed){
  const cv=document.createElement('canvas'); cv.width=256; cv.height=340;
  const c=cv.getContext('2d');
  const bg=c.createRadialGradient(128,120,20,128,180,240);
  bg.addColorStop(0,'#5b4b3a'); bg.addColorStop(1,'#181310');
  c.fillStyle=bg; c.fillRect(0,0,256,340);
  const skin=PORTRAIT_SKIN[seed%4], cloth=PORTRAIT_CLOTH[(seed>>1)%4];
  // ลำตัว/เสื้อคลุมโบราณ
  c.fillStyle=cloth; c.beginPath(); c.moveTo(40,340); c.quadraticCurveTo(60,225,128,215);
  c.quadraticCurveTo(196,225,216,340); c.closePath(); c.fill();
  c.fillStyle='#efe6d2'; c.beginPath(); c.moveTo(112,222); c.lineTo(128,262); c.lineTo(144,222); c.closePath(); c.fill();
  // คอ + หน้า
  c.fillStyle=skin; c.fillRect(112,186,32,34);
  c.beginPath(); c.ellipse(128,150,52,66,0,0,Math.PI*2); c.fill();
  // ผม
  c.fillStyle=seed%2?'#1d1712':'#4a3a2a';
  c.beginPath(); c.ellipse(128,116,56,48,0,Math.PI,Math.PI*2); c.fill();
  if(seed%3===0){ c.beginPath(); c.ellipse(78,168,16,44,.2,0,Math.PI*2); c.fill();
                  c.beginPath(); c.ellipse(178,168,16,44,-.2,0,Math.PI*2); c.fill(); }
  // เบ้าตา (ลูกตาจริงเป็น mesh แยก วางทับทีหลัง — จะได้ "กลอกตาตาม" ได้)
  c.fillStyle='#f4efe6';
  c.beginPath(); c.ellipse(104,148,15,9,0,0,Math.PI*2); c.fill();
  c.beginPath(); c.ellipse(152,148,15,9,0,0,Math.PI*2); c.fill();
  c.strokeStyle='rgba(30,20,14,.75)'; c.lineWidth=2.4;
  c.beginPath(); c.ellipse(104,148,15,9,0,0,Math.PI*2); c.stroke();
  c.beginPath(); c.ellipse(152,148,15,9,0,0,Math.PI*2); c.stroke();
  // คิ้ว/จมูก/ปาก
  c.strokeStyle='rgba(25,18,12,.85)'; c.lineWidth=4;
  c.beginPath(); c.moveTo(92,132); c.lineTo(118,129); c.moveTo(138,129); c.lineTo(164,132); c.stroke();
  c.lineWidth=2.6; c.strokeStyle='rgba(60,40,28,.7)';
  c.beginPath(); c.moveTo(128,152); c.lineTo(124,172); c.lineTo(133,173); c.stroke();
  c.beginPath(); c.moveTo(112,190); c.quadraticCurveTo(128,seed%2?184:196,144,190); c.stroke();
  // คราบเก่า/ขอบมืด
  const vg=c.createRadialGradient(128,170,80,128,170,200);
  vg.addColorStop(0,'rgba(0,0,0,0)'); vg.addColorStop(1,'rgba(0,0,0,.55)');
  c.fillStyle=vg; c.fillRect(0,0,256,340);
  const t=new T.CanvasTexture(cv); t.needsUpdate=true; return t;
}
/* ป้ายชื่อโรงแรมหน้าตึก (ชื่อสมมติ ไม่ชนลิขสิทธิ์ใคร) */
function signTexture(){
  const cv=document.createElement('canvas'); cv.width=1024; cv.height=256;
  const c=cv.getContext('2d');
  c.fillStyle='#150f0c'; c.fillRect(0,0,1024,256);
  c.strokeStyle='#c9a227'; c.lineWidth=6; c.strokeRect(14,14,996,228);
  c.fillStyle='#f2d98b'; c.textAlign='center'; c.textBaseline='middle';
  c.font='bold 96px Georgia,serif'; c.fillText('THE VELVET HOTEL',512,104);
  c.font='44px Georgia,serif'; c.fillStyle='#cbb37a'; c.fillText('โรงแรมกำมะหยี่  ·  EST. 1912',512,186);
  const t=new T.CanvasTexture(cv); t.needsUpdate=true; return t;
}

/* ============================================================
   🏗️ สร้างโรงแรมทั้งหลัง
   ============================================================ */
function build(THREE_,opt){
  T=THREE_; opt=opt||{};
  TEX=opt.tex||function(){};
  const M=makeMats();
  const grp=new T.Group();
  const H={grp, mats:M, solids:[], rooms:[], spots:[], portraits:[], wardrobes:[],
           lamps:[M.lamp,M.win], lightsOn:true, FLOOR_H, FLOORS, BX, BZ, CZ, floorY};

  /* กล่องกันชน (AABB) — y0..y1 คุมว่าอยู่ชั้นไหน */
  const solid=(x0,x1,z0,z1,y0,y1,tag)=>{ H.solids.push({x0,x1,z0,z1,y0,y1,on:true,tag:tag||''}); };
  /* กำแพง: วางกล่อง + กันชนพร้อมกัน (thick = ความหนา) */
  const A={ struct:Acc(), room:Acc(), carpet:Acc(), marble:Acc(), wood:Acc(), ceil:Acc(),
            tile:Acc(), porc:Acc(), gold:Acc(), cloth:Acc(), sheet:Acc(), metal:Acc(),
            facade:Acc(), stone:Acc(), leaf:Acc(), glass:Acc(), win:Acc(), lamp:Acc() };
  function wall(acc,x0,x1,z0,z1,y,h,uv,noSolid){
    if(x1<=x0||z1<=z0) return;
    accBox(acc,(x0+x1)/2,y+h/2,(z0+z1)/2,x1-x0,h,z1-z0,uv||2.4);
    if(!noSolid) solid(x0,x1,z0,z1,y,y+h);
  }

  /* ---------- โครงพื้น/เพดานแต่ละชั้น ---------- */
  function slab(acc,x0,x1,z0,z1,y,uv){
    accBox(acc,(x0+x1)/2,y-SLAB/2,(z0+z1)/2,x1-x0,SLAB,z1-z0,uv||3);
  }
  for(let f=0;f<FLOORS;f++){
    const y=floorY(f), fl=(f===0)?A.marble:A.carpet;
    slab(fl,CORE_E,BX,-BZ,BZ,y,f===0?3:2.2);            // บล็อกตะวันออก (ห้องพัก/ล็อบบี้)
    slab(fl,WEST,CORE_E,LZ0,LZ1,y,2.2);                 // ชานพักบันได
    slab(fl,SHAFT_E,CORE_E,-CZ,CZ,y,2.2);               // หน้าลิฟต์
    slab(fl,WEST,CORE_E,CZ,BZ,y,2.2);                   // ห้องเก็บของฝั่งใต้
    // ฝ้าเพดานของชั้นล่าง = แผ่นพื้นของชั้นบน (ไม่ต้องสร้างซ้ำ)
  }
  slab(A.ceil,CORE_E,BX,-BZ,BZ,floorY(FLOORS-1)+CEIL_H,3);   // ฝ้าชั้นบนสุด
  slab(A.stone,WEST-.6,BX+.6,-BZ-.6,BZ+.6,floorY(FLOORS-1)+CEIL_H+.5,4);  // ดาดฟ้า

  /* ---------- ผนังนอก (ทุกชั้น) ---------- */
  for(let f=0;f<FLOORS;f++){
    const y=floorY(f);
    wall(A.struct,WEST-.35,WEST,-BZ,BZ,y,CEIL_H);                       // ตะวันตก
    wall(A.struct,WEST,BX,-BZ-.35,-BZ,y,CEIL_H);                        // เหนือ
    wall(A.struct,WEST,BX,BZ,BZ+.35,y,CEIL_H);                          // ใต้
    if(f===0){                                                          // ตะวันออก: ชั้นล่างเว้นประตูหน้า
      wall(A.struct,BX,BX+.35,-BZ,-ENTRY_HW,y,CEIL_H);
      wall(A.struct,BX,BX+.35,ENTRY_HW,BZ,y,CEIL_H);
      wall(A.struct,BX,BX+.35,-ENTRY_HW,ENTRY_HW,y+2.6,CEIL_H-2.6,2.4,true);
    }else wall(A.struct,BX,BX+.35,-BZ,BZ,y,CEIL_H);
  }
  /* เปลือกนอก + หน้าต่างสว่าง (มองจากข้างนอกให้เห็นเป็นโรงแรมหรู) */
  accBox(A.facade,(WEST+BX)/2,floorY(FLOORS-1)/2+CEIL_H/2,-BZ-.75,BX-WEST+1.6,FLOORS*FLOOR_H,.5,3.2);
  accBox(A.facade,(WEST+BX)/2,floorY(FLOORS-1)/2+CEIL_H/2, BZ+.75,BX-WEST+1.6,FLOORS*FLOOR_H,.5,3.2);
  accBox(A.facade,WEST-.75,floorY(FLOORS-1)/2+CEIL_H/2,0,.5,FLOORS*FLOOR_H,BZ*2+1.6,3.2);
  /* ด้านหน้า (ตะวันออก) ต้อง **เว้นช่องประตูหน้า** ไม่งั้นเปลือกนอกไปปิดทางเข้าจนเดินเข้าไม่ได้ */
  const eh=FLOORS*FLOOR_H, ey=floorY(FLOORS-1)/2+CEIL_H/2, ew=ENTRY_HW+.35;
  accBox(A.facade,BX+.75,ey,(ew+BZ+.8)/2,.5,eh,BZ+.8-ew,3.2);
  accBox(A.facade,BX+.75,ey,-(ew+BZ+.8)/2,.5,eh,BZ+.8-ew,3.2);
  accBox(A.facade,BX+.75,(2.9+eh)/2+.05,0,.5,eh-2.9,ew*2,3.2);      // คานเหนือประตูหน้า
  for(let f=0;f<FLOORS;f++){
    const wy=floorY(f)+1.75;
    for(let i=0;i<10;i++){                        // หน้าต่างเรียงหน้า-หลังตึก
      const wx=WEST+2.4+i*3.7;
      accBox(A.win,wx,wy,-BZ-1.02,1.5,1.9,.06,0);
      accBox(A.win,wx,wy, BZ+1.02,1.5,1.9,.06,0);
      accBox(A.gold,wx,wy,-BZ-1.06,1.75,2.15,.05,0);
      accBox(A.gold,wx,wy, BZ+1.06,1.75,2.15,.05,0);
    }
    if(f>0) for(let i=0;i<4;i++){                 // ด้านหน้า (ตะวันออก) ชั้นบน
      const wz=-6.6+i*4.4;
      accBox(A.win,BX+1.02,wy,wz,.06,1.9,1.5,0);
      accBox(A.gold,BX+1.06,wy,wz,.05,2.15,1.75,0);
    }
  }

  /* ---------- ทางเดินกลาง + ห้องพักชั้น 1-4 ---------- */
  const roomKey=(f,side,i)=>f+'_'+side+'_'+i;
  for(let f=0;f<FLOORS;f++){
    const y=floorY(f);
    /* ผนังแกนบันได/ลิฟต์ (ทุกชั้น) */
    wall(A.struct,CORE_E,CORE_E+.3,-BZ,-CZ,y,CEIL_H);             // กั้นบันไดกับห้อง N1
    wall(A.struct,WEST,SHAFT_E,-CZ-.3,-CZ,y,CEIL_H);              // ข้างปล่องลิฟต์ (เหนือ)
    wall(A.struct,WEST,SHAFT_E,CZ,CZ+.3,y,CEIL_H);                // ข้างปล่องลิฟต์ (ใต้)
    wall(A.struct,CORE_E,CORE_E+.3,CZ,BZ,y,CEIL_H);               // กั้นห้องเก็บของกับห้อง S1
    /* ผนังทางเดิน ฝั่งบันได: เว้นซุ้มทางเข้าบันได */
    wall(A.struct,WEST,CORE_E-2.0,-CZ-.3,-CZ,y,CEIL_H);
    /* ห้องเก็บของฝั่งใต้ (ประตูกลางผนัง) */
    wall(A.struct,WEST,-17.2,CZ,CZ+.3,y,CEIL_H);
    wall(A.struct,-15.5,CORE_E,CZ,CZ+.3,y,CEIL_H);
    H.spots.push({x:-16.4,z:6.6,y,room:'store'+f});

    if(f===0) continue;                                            // ชั้นล่างเป็นล็อบบี้โล่ง

    ['n','s'].forEach(side=>{
      const sgn=(side==='n')?-1:1;
      const zc0=sgn<0?-CZ:CZ, zc1=sgn<0?-CZ-.3:CZ+.3;
      let cut=[];                                                   // ช่องประตูบนผนังทางเดิน
      for(let i=0;i<ROOM_N;i++){
        const x0=CORE_E+i*RW, x1=x0+RW, cx=(x0+x1)/2;
        const dx=cx+ (side==='n'?1.9:-1.9);                         // ประตูเยื้องจากกลางห้อง
        cut.push([dx-DOOR_W/2,dx+DOOR_W/2]);
        if(i>0) wall(A.struct,x0,x0+.3,sgn<0?-BZ:CZ,sgn<0?-CZ:BZ,y,CEIL_H);   // ผนังกั้นห้อง
        const R={f,side,i,x0,x1,cx,cz:sgn*((CZ+BZ)/2),y,rot:(side==='n'?0:Math.PI),
                 door:{x:dx,z:sgn*CZ}, key:roomKey(f,side,i)};
        H.rooms.push(R);
      }
      cut.sort((a,b)=>a[0]-b[0]);
      let px=CORE_E;
      cut.forEach(c=>{ wall(A.struct,px,c[0],Math.min(zc0,zc1),Math.max(zc0,zc1),y,CEIL_H); px=c[1]; });
      wall(A.struct,px,BX,Math.min(zc0,zc1),Math.max(zc0,zc1),y,CEIL_H);
    });
  }

  /* ---------- 🪜 บันได: ทางลาดมีลูกนอน + ราวกันตกไต่ตามความชัน ---------- */
  const RUN=CORE_E-WEST;                                   // ระยะแนวราบ 7 ม.
  const rampY=x=>Math.max(0,Math.min(1,(x-WEST)/RUN))*FLOOR_H;
  for(let f=0;f<FLOORS-1;f++){
    const y=floorY(f), ang=Math.atan2(FLOOR_H,RUN), len=Math.hypot(RUN,FLOOR_H);
    accBox(A.stone,(WEST+CORE_E)/2,y+FLOOR_H/2-.16,(RZ0+RZ1)/2,len,.3,RZ1-RZ0,2.4,{z:ang});
    for(let s=0;s<12;s++){                                  // ลูกนอนให้เห็นเป็นขั้นบันไดจริง
      const t=(s+.5)/12, sx=WEST+t*RUN;
      accBox(A.stone,sx,y+rampY(sx)+.06,(RZ0+RZ1)/2,RUN/12*.94,.12,RZ1-RZ0-.2,2.4);
    }
    // ราวกันตกด้านชานพัก (เว้นช่องขึ้น-ลงหัวท้าย)
    for(let s=0;s<4;s++){
      const x0=WEST+1.8+s*.8, x1=x0+.8, ry=y+rampY((x0+x1)/2);
      accBox(A.metal,(x0+x1)/2,ry+.55,RZ1,x1-x0,1.1,.12,0);
      solid(x0,x1,RZ1-.16,RZ1+.16,ry-.2,ry+1.15,'rail');
    }
  }
  // ผนังรอบช่องบันได (สูงทะลุทุกชั้น กันตกออกนอกโถง)
  solid(WEST-.35,WEST,RZ0,LZ1,0,FLOORS*FLOOR_H,'stair');
  solid(CORE_E,CORE_E+.3,RZ0,RZ1,0,FLOORS*FLOOR_H,'stair');
  solid(WEST,CORE_E,-BZ-.35,-BZ,0,FLOORS*FLOOR_H,'stair');

  /* ---------- 🛗 ลิฟต์ ---------- */
  const cab=new T.Group();
  {
    const CA=Acc(), CG=Acc(), CL=Acc();
    accBox(CA,0,-.1,0,SHAFT_E-WEST-.2,.2,CZ*2-.2,2);                 // พื้นห้องโดยสาร
    accBox(CA,0,1.3,-CZ+.15,SHAFT_E-WEST-.2,2.6,.14,2);
    accBox(CA,0,1.3, CZ-.15,SHAFT_E-WEST-.2,2.6,.14,2);
    accBox(CA,-(SHAFT_E-WEST)/2+.08,1.3,0,.16,2.6,CZ*2-.2,2);
    accBox(CA,0,2.68,0,SHAFT_E-WEST-.2,.16,CZ*2-.2,2);               // ฝ้า
    accBox(CG,0,1.5,-CZ+.24,2.2,1.4,.05,0);                          // กระจกเงาในลิฟต์
    accBox(CL,0,2.5,0,1.5,.08,1.1,0);                                // ไฟเพดานลิฟต์
    accMesh(CA,M.wood,cab); accMesh(CG,M.mirror,cab); accMesh(CL,M.lamp,cab);
    // ปุ่มกดในลิฟต์
    const btn=new T.Mesh(new T.BoxGeometry(.28,.9,.05),M.gold);
    btn.position.set(SHAFT_E-WEST-.7-((SHAFT_E-WEST)/2),1.2,CZ-.28); cab.add(btn);
  }
  cab.position.set((WEST+SHAFT_E)/2,0,0);
  grp.add(cab);
  H.lift={cab, y:0, floor:0, target:0, moving:false, doorT:1,
          x0:WEST,x1:SHAFT_E,z0:-CZ,z1:CZ, hint:''};
  // ประตูลิฟต์แต่ละชั้น (บานเลื่อน 2 บาน) + กล่องกันตกลงปล่อง
  H.liftDoors=[];
  for(let f=0;f<FLOORS;f++){
    const y=floorY(f);
    const dl=new T.Mesh(new T.BoxGeometry(.12,2.5,CZ-.05),M.metal);
    const dr=new T.Mesh(new T.BoxGeometry(.12,2.5,CZ-.05),M.metal);
    dl.position.set(SHAFT_E-.06,y+1.25,-CZ/2); dr.position.set(SHAFT_E-.06,y+1.25,CZ/2);
    grp.add(dl,dr);
    const guard={x0:SHAFT_E-.25,x1:SHAFT_E+.05,z0:-CZ,z1:CZ,y0:y,y1:y+2.6,on:true,tag:'lift'+f};
    H.solids.push(guard);
    H.liftDoors.push({f,dl,dr,guard,t:0});
    accBox(A.gold,SHAFT_E-.02,y+2.72,0,.1,.34,CZ*2,0);               // คิ้วทองเหนือประตูลิฟต์
  }

  /* ---------- 🛏️ เฟอร์นิเจอร์ห้องพัก (สร้างครั้งเดียว ใช้ซ้ำทุกห้อง) ----------
     พิกัด local: กลางห้อง (0,0) · +Z = ด้านทางเดิน · ห้องฝั่งใต้หมุน 180° */
  const HX=RW/2-.15, HZ=RD/2-.15;
  const F={ wood:Acc(), cloth:Acc(), sheet:Acc(), tile:Acc(), porc:Acc(), gold:Acc(), room:Acc() };
  const furnSolids=[];
  const fs=(x0,x1,z0,z1,h)=>furnSolids.push({x0,x1,z0,z1,h});
  // ห้องน้ำมุมซ้ายติดทางเดิน (ผนังกระเบื้อง เว้นช่องเข้า)
  accBox(F.tile,-HX+1.8,1.5,HZ-2.6,.16,3,5.2,2);                     // ผนังยาว (แกน Z)
  fs(-HX+1.72,-HX+1.88,HZ-5.2,HZ,3);
  accBox(F.tile,-HX+.55,1.5,HZ-5.2,2.5,3,.16,2);                     // ผนังขวาง เว้นช่องประตู
  fs(-HX,-HX+1.8,HZ-5.28,HZ-5.12,3);
  accBox(F.tile,-HX+.02,1.2,HZ-2.6,.06,2.4,5.2,2);                   // กระเบื้องผนังนอก
  accBox(F.porc,-HX+.6,.32,HZ-1.1,1.1,.64,.6,0);                     // อ่างล้างหน้า
  accBox(F.porc,-HX+.6,.62,HZ-1.1,.9,.1,.5,0);
  accBox(F.gold,-HX+.6,1.55,HZ-1.05,1.0,.9,.05,0);                   // กระจกเหนืออ่าง
  accBox(F.porc,-HX+.55,.3,HZ-3.1,.5,.6,.66,0);                      // โถสุขภัณฑ์
  accBox(F.porc,-HX+.55,.62,HZ-3.4,.5,.7,.14,0);
  accBox(F.porc,-HX+.9,.28,HZ-4.6,1.7,.56,1.1,0);                    // อ่างอาบน้ำ
  fs(-HX,-HX+1.75,HZ-5.15,HZ-4.05,.6);
  // เตียงคู่ + หัวเตียง + ผ้าคลุม
  accBox(F.wood, 1.6,.25,-HZ+2.2,2.2,.5,2.4,0);
  accBox(F.sheet,1.6,.62,-HZ+2.2,2.16,.28,2.36,0);
  accBox(F.cloth,1.6,.74,-HZ+2.9,2.16,.06,1.0,0);
  accBox(F.sheet,1.0,.82,-HZ+1.35,.8,.16,.5,0);                      // หมอน
  accBox(F.sheet,2.2,.82,-HZ+1.35,.8,.16,.5,0);
  accBox(F.wood, 1.6,1.1,-HZ+.9,2.6,2.2,.16,1.6);                    // หัวเตียง
  fs(.5,2.7,-HZ+.8,-HZ+3.45,.9);
  // โต๊ะข้างเตียง + โคมไฟ
  accBox(F.wood,3.35,.28,-HZ+1.6,.7,.56,.7,0);
  fs(3.0,3.7,-HZ+1.25,-HZ+1.95,.6);
  // ตู้เสื้อผ้า (ตัวตู้ — บานประตูเป็น mesh แยกต่อห้อง เพราะต้องเปิดได้)
  accBox(F.wood,-HX+.75,1.15,-HZ+2.0,1.4,2.3,2.4,1.6);
  fs(-HX,-HX+1.5,-HZ+.8,-HZ+3.2,2.3);
  // โต๊ะเครื่องแป้ง + กระจกยืน (กระจกจริงเป็น mesh แยก)
  accBox(F.wood,HX-.5,.38,-.6,1.0,.76,1.8,0);
  fs(HX-1.0,HX,-1.5,.3,.8);
  accBox(F.gold,HX-.06,1.6,2.6,.08,2.1,1.05,0);                      // กรอบกระจกยืน
  // พรมกลางห้อง + ไฟเพดาน + ม่าน
  accBox(F.cloth,.6,.02,-.4,4.4,.04,3.4,1.4);
  accBox(F.cloth,-2.2,2.15,-HZ+.06,1.1,2.0,.1,0);
  accBox(F.cloth, 2.2,2.15,-HZ+.06,1.1,2.0,.1,0);
  const furnMesh={ wood:accGeo(F.wood), cloth:accGeo(F.cloth), sheet:accGeo(F.sheet),
                   tile:accGeo(F.tile), porc:accGeo(F.porc), gold:accGeo(F.gold) };
  const lampGeo=new T.BoxGeometry(.9,.1,.9);
  const mirGeo=new T.BoxGeometry(.04,1.9,.9);
  const doorGeo=new T.BoxGeometry(.08,2.2,1.15);
  const wdDoorGeo=new T.BoxGeometry(.07,2.15,1.15);
  const rmDoorGeo=new T.BoxGeometry(.09,2.3,DOOR_W-.1);

  H.rooms.forEach(R=>{
    const g=new T.Group();
    g.position.set(R.cx,R.y,R.cz); g.rotation.y=R.rot;
    ['wood','cloth','sheet','tile','porc','gold'].forEach(k=>{
      g.add(new T.Mesh(furnMesh[k],M[k==='wood'?'wood':k]));
    });
    // ไฟเพดานห้อง
    const lp=new T.Mesh(lampGeo,M.lamp); lp.position.set(.4,CEIL_H-.28,0); g.add(lp);
    // กระจกยืน (ผี "แว็บ" ในกระจกได้)
    const mir=new T.Mesh(mirGeo,M.mirror); mir.position.set(HX-.1,1.6,2.6); g.add(mir);
    // 🚪👻 ตู้เสื้อผ้า: บานประตู 2 บานเปิดได้ + ผีนั่งอยู่ข้างใน
    const hingeL=new T.Group(), hingeR=new T.Group();
    hingeL.position.set(-HX+1.46,1.15,-HZ+.85); hingeR.position.set(-HX+1.46,1.15,-HZ+3.15);
    const dl=new T.Mesh(wdDoorGeo,M.wood), dr=new T.Mesh(wdDoorGeo,M.wood);
    dl.position.set(0,0,.575); dr.position.set(0,0,-.575);
    hingeL.add(dl); hingeR.add(dr); g.add(hingeL,hingeR);
    let gh=null;
    if(opt.makeGhost){
      gh=opt.makeGhost();
      if(gh){ gh.scale.set(1.5,1.5,1); gh.position.set(-HX+.75,.95,-HZ+2.0); gh.visible=false; g.add(gh); }
    }
    const W={room:R, hingeL, hingeR, ghost:gh, open:false, t:0, knockAt:0, done:false,
             haunted:Math.random()<.42,
             x:R.cx+(R.rot?-1:1)*(-HX+.9), z:R.cz+(R.rot?-1:1)*(-HZ+2.0), y:R.y};
    H.wardrobes.push(W); R.wardrobe=W;
    // ประตูห้องเปิดแง้ม (เดินเข้าออกได้ ไม่มีกล่องกันชน)
    const rd=new T.Mesh(rmDoorGeo,M.wood);
    rd.position.set(R.door.x+(R.side==='n'?.55:-.55), R.y+1.15, R.door.z+(R.side==='n'?.5:-.5));
    rd.rotation.y=(R.side==='n'?-.9:.9);
    grp.add(rd);
    // หน้าต่างในห้อง (มองออกไปเห็นฟ้ากลางคืน) — ติดผนังนอกของฝั่งนั้น
    const wz=(R.side==='n')?(-BZ+.18):(BZ-.18);
    const gw=new T.Mesh(new T.BoxGeometry(1.5,1.9,.06),M.glass);
    gw.position.set(R.cx-2.2,R.y+1.75,wz); grp.add(gw);
    const gw2=gw.clone(); gw2.position.x=R.cx+2.2; grp.add(gw2);
    grp.add(g);
    // กล่องกันชนของเฟอร์นิเจอร์ (แปลงพิกัด local → world ตามการหมุนห้อง)
    furnSolids.forEach(s=>{
      let x0,x1,z0,z1;
      if(R.rot){ x0=R.cx-s.x1; x1=R.cx-s.x0; z0=R.cz-s.z1; z1=R.cz-s.z0; }
      else     { x0=R.cx+s.x0; x1=R.cx+s.x1; z0=R.cz+s.z0; z1=R.cz+s.z1; }
      solid(x0,x1,z0,z1,R.y,R.y+s.h,'furn');
    });
    // จุดวางตัวอักษรในห้อง (บนเตียง/กลางห้อง/มุมห้องน้ำ)
    const put=(lx,lz)=>{ const x=R.rot?R.cx-lx:R.cx+lx, z=R.rot?R.cz-lz:R.cz+lz;
                         H.spots.push({x,z,y:R.y,room:R.key}); };
    put(1.6,-RD/2+2.2); put(-1.2,1.4); put(HX-1.6,-2.4); put(-HX+.9,HZ-2.2);
  });

  /* ---------- 🛎️ ล็อบบี้ชั้นล่าง ---------- */
  {
    const y=0;
    // พรมแดงจากประตูหน้าถึงลิฟต์
    accBox(A.carpet,4,.03,0,30,.06,4.2,2.2);
    // เคาน์เตอร์ต้อนรับ (ทรงตัว L) + ตู้กุญแจห้อง
    accBox(A.wood,9,.6,-6.4,7.5,1.2,1.0,1.6); solid(5.25,12.75,-6.9,-5.9,y,y+1.2,'desk');
    accBox(A.wood,12.4,.6,-4.6,1.0,1.2,4.6,1.6); solid(11.9,12.9,-6.9,-2.3,y,y+1.2,'desk');
    accBox(A.gold,9,1.24,-6.4,7.6,.08,1.1,1.6);
    accBox(A.wood,9,1.6,-8.6,7.0,3.0,.3,1.6); solid(5.5,12.5,-8.75,-8.45,y,y+3,'desk');
    for(let i=0;i<7;i++) for(let j=0;j<4;j++)
      accBox(A.gold,6+i*1.0,1.0+j*.55,-8.42,.8,.42,.05,0);           // ช่องกุญแจห้อง
    // เสาหินอ่อน 4 ต้น + คิ้วทอง
    [[-2,-6.5],[-2,6.5],[8,6.5],[15,-6.5]].forEach(p=>{
      accBox(A.marble,p[0],1.6,p[1],1.1,3.2,1.1,2);
      accBox(A.gold,p[0],3.1,p[1],1.35,.22,1.35,0);
      solid(p[0]-.6,p[0]+.6,p[1]-.6,p[1]+.6,y,y+3.2,'col');
    });
    // โซฟา + โต๊ะกลาง
    accBox(A.cloth,2.5,.35,6.0,3.4,.7,1.3,1.2); solid(.8,4.2,5.35,6.65,y,y+.7,'sofa');
    accBox(A.cloth,2.5,.85,6.6,3.4,.9,.4,1.2);
    accBox(A.wood,2.5,.28,4.0,1.6,.56,1.0,0);  solid(1.7,3.3,3.5,4.5,y,y+.56,'tbl');
    // ต้นไม้ประดับ 2 กระถาง
    [[16.5,5.5],[16.5,-5.5]].forEach(p=>{
      accBox(A.stone,p[0],.3,p[1],.9,.6,.9,0);
      accBox(A.leaf,p[0],1.35,p[1],1.3,1.5,1.3,0);
      solid(p[0]-.5,p[0]+.5,p[1]-.5,p[1]+.5,y,y+1.9,'pot');
    });
    // โคมระย้ากลางล็อบบี้
    accBox(A.gold,5,3.0,0,.12,.5,.12,0);
    accBox(A.lamp,5,2.55,0,1.9,.35,1.9,0);
    for(let i=0;i<8;i++){ const a=i/8*Math.PI*2;
      accBox(A.lamp,5+Math.cos(a)*1.25,2.25,Math.sin(a)*1.25,.22,.5,.22,0); }
    // ไฟผนังทางเดิน/ล็อบบี้ทุกชั้น
    for(let f=0;f<FLOORS;f++){
      const fy=floorY(f);
      for(let i=0;i<8;i++){
        const lx=CORE_E+1.6+i*4.2;
        accBox(A.lamp,lx,fy+2.35,-CZ+.12,.5,.34,.1,0);
        accBox(A.lamp,lx,fy+2.35, CZ-.12,.5,.34,.1,0);
        accBox(A.gold,lx,fy+2.35,-CZ+.06,.62,.46,.06,0);
        accBox(A.gold,lx,fy+2.35, CZ-.06,.62,.46,.06,0);
      }
      accBox(A.lamp,-16,fy+2.5,-8.4,.5,.34,.34,0);                    // ไฟโถงบันได
    }
    // 🚪 ประตูหน้า (บานคู่แง้มไว้) + ซุ้มทางเข้า/ขั้นบันไดนอก
    [[-1.35,-.5],[1.35,.5]].forEach(d=>{
      const dm=new T.Mesh(doorGeo,M.wood);
      dm.position.set(BX+.5,1.1,d[0]); dm.rotation.y=d[1]; grp.add(dm);
    });
    accBox(A.stone,BX+1.6,-.1,0,3.2,.2,9,3);
    accBox(A.stone,BX+2.6,-.28,0,1.4,.24,10,3);
    accBox(A.stone,BX+3.6,-.46,0,1.4,.24,11,3);
    [[BX+2.6,-4.2],[BX+2.6,4.2]].forEach(p=>{
      accBox(A.marble,p[0],1.8,p[1],.9,3.6,.9,2);
      solid(p[0]-.5,p[0]+.5,p[1]-.5,p[1]+.5,0,3.6,'col');
    });
    accBox(A.stone,BX+2.4,3.85,0,4.6,.5,10,3);                        // หลังคาซุ้ม
    // เสาไฟหน้าโรงแรม
    [[BX+6.5,-5.5],[BX+6.5,5.5]].forEach(p=>{
      accBox(A.metal,p[0],1.5,p[1],.16,3,.16,0);
      accBox(A.lamp,p[0],3.2,p[1],.5,.5,.5,0);
      solid(p[0]-.3,p[0]+.3,p[1]-.3,p[1]+.3,0,3,'pole');
    });
  }
  /* ป้ายชื่อโรงแรมเหนือประตูหน้า */
  {
    const sg=new T.Mesh(new T.PlaneGeometry(8.4,2.1),
      new T.MeshBasicMaterial({map:signTexture(),fog:false}));
    sg.position.set(BX+1.12,5.3,0); sg.rotation.y=Math.PI/2; grp.add(sg);
    H.signMat=sg.material;
  }

  /* ---------- 🖼️ รูปคนบนผนัง — เฉพาะ "ลูกตา" ที่มองตามผู้เล่น ---------- */
  /* กรอบ+ภาพหันไปทาง local +Z เสมอ · face=+1 ติดผนังเหนือ (หันเข้าทางเดิน +Z) · face=-1 ผนังใต้
     ลูกตา = mesh วงกลม 2 อัน วางทับเบ้าตาที่วาดไว้ในภาพ แล้วเลื่อนตามผู้เล่นทุกเฟรม
     (พิกัดตา: ภาพ 256×340px เบ้าตาอยู่ x=104/152 y=148 → แปลงเป็นเมตรบนระนาบ 1.02×1.36) */
  const EYE_X=.096, EYE_Y=.088;
  const frameGeo=new T.BoxGeometry(1.25,1.65,.1);
  const artGeo=new T.PlaneGeometry(1.02,1.36);
  const eyeGeo=new T.CircleGeometry(.03,12);
  const eyeMat=new T.MeshBasicMaterial({color:0x0b0a09});
  let seed=0;
  function addPortrait(x,y,z,face){
    const g=new T.Group(); g.position.set(x,y,z); g.rotation.y=(face>0?0:Math.PI);
    g.add(new T.Mesh(frameGeo,M.gold));
    /* ⚠️ ต้องเป็น Lambert ไม่ใช่ Basic — ไฟดับแล้วภาพในกรอบต้อง "มืดไปด้วย"
       แล้วค่อยโผล่ขึ้นมาตอนไฟฉายส่องโดน (นั่นคือจังหวะที่เด็กเห็นตากลอกตาม 😱) */
    const art=new T.Mesh(artGeo,new T.MeshPhongMaterial({map:portraitTexture(seed++),shininess:6,specular:0x111111}));
    art.position.z=.055; g.add(art);
    const e1=new T.Mesh(eyeGeo,eyeMat), e2=new T.Mesh(eyeGeo,eyeMat);
    e1.position.set(-EYE_X,EYE_Y,.07); e2.position.set(EYE_X,EYE_Y,.07);
    g.add(e1,e2);
    H.portraits.push({g,e1,e2,face,on:false,px:x,py:y,pz:z});
    grp.add(g);
  }
  for(let f=0;f<FLOORS;f++){
    const fy=floorY(f)+1.75;
    for(let i=0;i<4;i++){
      const px=CORE_E+3.4+i*4.3;
      addPortrait(px,fy,-CZ+.18,1);                // ผนังฝั่งเหนือ หันเข้าทางเดิน
      if(i%2===0) addPortrait(px+2.1,fy,CZ-.18,-1);
    }
  }

  /* ---------- ประกอบ mesh รวม ---------- */
  accMesh(A.struct,M.wall,grp);
  accMesh(A.room,M.room,grp);
  accMesh(A.carpet,M.carpet,grp);
  accMesh(A.marble,M.marble,grp);
  accMesh(A.wood,M.wood,grp);
  accMesh(A.ceil,M.ceil,grp);
  accMesh(A.tile,M.tile,grp);
  accMesh(A.porc,M.porc,grp);
  accMesh(A.gold,M.gold,grp);
  accMesh(A.cloth,M.cloth,grp);
  accMesh(A.sheet,M.sheet,grp);
  accMesh(A.metal,M.metal,grp);
  accMesh(A.facade,M.facade,grp);
  accMesh(A.stone,M.stone,grp);
  accMesh(A.leaf,M.leaf,grp);
  accMesh(A.glass,M.glass,grp);
  accMesh(A.win,M.win,grp);
  accMesh(A.lamp,M.lamp,grp);

  /* จุดวางตัวอักษรในล็อบบี้/ทางเดิน (นอกห้องพัก) */
  for(let f=0;f<FLOORS;f++){
    const y=floorY(f);
    for(let i=0;i<4;i++) H.spots.push({x:CORE_E+3+i*4.2,z:(i%2?1.4:-1.4),y,room:'hall'+f});
  }
  return H;
}

/* ============================================================
   🚶 ระบบเดิน: หาความสูงพื้นใต้เท้า + ชนกำแพง
   ============================================================ */
function inRect(x,z,x0,x1,z0,z1){ return x>=x0&&x<=x1&&z>=z0&&z<=z1; }
function insideHotel(x,z){ return inRect(x,z,WEST-.4,BX+.4,-BZ-.4,BZ+.4); }

/* ความสูงพื้นที่ผู้เล่นควรยืน (curY = ความสูงพื้นเฟรมก่อน — ใช้เลือกชั้น/ทางลาดที่ถูกตัว) */
function surfaceY(H,x,z,curY){
  if(!insideHotel(x,z)) return 0;
  const L=H.lift;
  if(inRect(x,z,L.x0,L.x1,L.z0,L.z1)) return L.y;                 // ยืนในห้องลิฟต์
  if(inRect(x,z,WEST,CORE_E,RZ0,RZ1)){                            // อยู่บนทางลาดบันได
    const t=Math.max(0,Math.min(1,(x-WEST)/(CORE_E-WEST)));
    let best=0,bd=1e9;
    for(let f=0;f<FLOORS-1;f++){
      const y=floorY(f)+t*FLOOR_H, d=Math.abs(y-curY);
      if(d<bd){ bd=d; best=y; }
    }
    return best;
  }
  let f=Math.round(curY/FLOOR_H);
  f=Math.max(0,Math.min(FLOORS-1,f));
  return floorY(f);
}
/* ดันตัวออกจากกล่องกันชนทุกก้อนที่อยู่ระดับเดียวกับตัวผู้เล่น */
function collide(H,x,z,footY){
  const lo=footY+.15, hi=footY+1.7, S=H.solids;
  for(let i=0;i<S.length;i++){
    const s=S[i];
    if(!s.on || s.y1<=lo || s.y0>=hi) continue;
    const cx=Math.max(s.x0,Math.min(x,s.x1)), cz=Math.max(s.z0,Math.min(z,s.z1));
    const dx=x-cx, dz=z-cz, d2=dx*dx+dz*dz;
    if(d2>=PLAYER_R*PLAYER_R) continue;
    if(d2>1e-6){ const d=Math.sqrt(d2); x=cx+dx/d*PLAYER_R; z=cz+dz/d*PLAYER_R; }
    else{                                            // จุดศูนย์กลางจมในกล่อง → ดันออกด้านที่ใกล้ที่สุด
      const l=x-s.x0, r=s.x1-x, u=z-s.z0, dn=s.z1-z;
      const m=Math.min(l,r,u,dn);
      if(m===l) x=s.x0-PLAYER_R; else if(m===r) x=s.x1+PLAYER_R;
      else if(m===u) z=s.z0-PLAYER_R; else z=s.z1+PLAYER_R;
    }
  }
  return {x,z};
}

/* ---------- ห้องที่ผู้เล่นยืนอยู่ (ใช้บอกผี/เสียงเคาะตู้) ---------- */
function roomAt(H,x,z,y){
  for(let i=0;i<H.rooms.length;i++){
    const R=H.rooms[i];
    if(Math.abs(R.y-y)<1.6 && inRect(x,z,R.x0,R.x1,Math.min(R.cz-RD/2,R.cz+RD/2),Math.max(R.cz-RD/2,R.cz+RD/2)))
      return R;
  }
  return null;
}
function floorOf(y){ return Math.max(0,Math.min(FLOORS-1,Math.round(y/FLOOR_H))); }

/* ============================================================
   💡 เปิด/ปิดไฟทั้งโรงแรม (ไฟดับ = มืดสนิท เหลือแค่ไฟฉาย)
   ============================================================ */
function setLights(H,on){
  H.lightsOn=!!on;
  const M=H.mats;
  M.lamp.color.setHex(on?0xffe6ae:0x14100a);
  M.win.color.setHex(on?0xffdf9e:0x0a0a10);
  M.glass.color.setHex(on?0x121a2c:0x05060c);
  M.mirror.color.setHex(on?0x2b3038:0x0b0d12);
  if(H.signMat) H.signMat.color.setHex(on?0xffffff:0x2a2a2a);
}

/* ============================================================
   ⏱ อัปเดตทุกเฟรม: ลูกตาในรูปมองตาม · ลิฟต์วิ่ง · บานตู้เปิด
   ============================================================ */
const EYE_X0=.096, EYE_Y0=.088;
function tick(H,dt,now,cam){
  /* 🖼️ ลูกตามองตาม — เฉพาะรูปที่อยู่ใกล้และชั้นเดียวกัน (คุมงานต่อเฟรม)
     รูปหันไป local +Z → ระยะเยื้องซ้าย-ขวาของผู้เล่นในแกนรูป = face*(camX - รูปX) */
  for(let i=0;i<H.portraits.length;i++){
    const P=H.portraits[i];
    const dy=Math.abs(P.py-cam.y), d=Math.hypot(cam.x-P.px,cam.z-P.pz);
    if(dy>2.4 || d>9){                               // ไกล/คนละชั้น → ตากลับมาตรง
      if(P.on){ P.e1.position.x=-EYE_X0; P.e2.position.x=EYE_X0;
                P.e1.position.y=P.e2.position.y=EYE_Y0; P.on=false; }
      continue;
    }
    P.on=true;
    const lat=Math.max(-.03,Math.min(.03,P.face*(cam.x-P.px)*.02));
    const ver=Math.max(-.014,Math.min(.014,(cam.y-P.py)*.02));
    P.e1.position.x=-EYE_X0+lat; P.e2.position.x=EYE_X0+lat;
    P.e1.position.y=P.e2.position.y=EYE_Y0+ver;
  }
  /* 🛗 ลิฟต์วิ่ง + ประตูเลื่อน */
  const L=H.lift, ty=floorY(L.target);
  if(Math.abs(L.y-ty)>.01){
    L.moving=true;
    const step=2.3*dt;
    L.y += Math.max(-step,Math.min(step,ty-L.y));
    L.doorT=Math.max(0,L.doorT-dt*3);
  }else{
    if(L.moving){ L.moving=false; L.floor=L.target; }
    L.y=ty; L.doorT=Math.min(1,L.doorT+dt*2.2);
  }
  L.cab.position.y=L.y;
  for(let i=0;i<H.liftDoors.length;i++){
    const D=H.liftDoors[i];
    const open=(!L.moving && L.floor===D.f) ? L.doorT : 0;
    D.dl.position.z=-CZ/2-open*(CZ*.48);
    D.dr.position.z= CZ/2+open*(CZ*.48);
    D.guard.on = open<.5;                             // ประตูยังไม่เปิด = เดินเข้าปล่องไม่ได้
  }
  /* 🚪 บานตู้เสื้อผ้าที่กำลังเปิด */
  for(let i=0;i<H.wardrobes.length;i++){
    const W=H.wardrobes[i];
    if(W.open && W.t<1){
      W.t=Math.min(1,W.t+dt*1.6);
      W.hingeL.rotation.y=-W.t*1.35; W.hingeR.rotation.y=W.t*1.35;
    }
  }
}

/* ---------- ตู้เสื้อผ้าใกล้ตัวที่สุด (ระยะ 2.2 ม. และชั้นเดียวกัน) ---------- */
function nearWardrobe(H,x,z,y){
  let best=null,bd=2.2;
  for(let i=0;i<H.wardrobes.length;i++){
    const W=H.wardrobes[i];
    if(Math.abs(W.y-y)>1.6) continue;
    const d=Math.hypot(W.x-x,W.z-z);
    if(d<bd){ bd=d; best=W; }
  }
  return best;
}
/* ---------- อยู่หน้า/ในลิฟต์ไหม ---------- */
function inLift(H,x,z,y){
  const L=H.lift;
  return inRect(x,z,L.x0,L.x1,L.z0,L.z1) && Math.abs(L.y-y)<1.6;
}
function atLiftDoor(H,x,z,y){
  return inRect(x,z,SHAFT_E,SHAFT_E+3.2,-CZ,CZ) && Math.abs(floorY(floorOf(y))-y)<1.2;
}
/* ---------- สุ่มจุดในโรงแรมสำหรับผี (ในห้อง/ทางเดิน ชั้นใดก็ได้) ---------- */
function randomHaunt(H,floorPref){
  const pool=H.rooms.filter(R=>floorPref===undefined||R.f===floorPref);
  const list=pool.length?pool:H.rooms;
  const R=list[Math.floor(Math.random()*list.length)];
  return {x:R.cx+(Math.random()*2-1)*2.4, z:R.cz+(Math.random()*2-1)*2.0, y:R.y, room:R};
}

return { build, surfaceY, collide, setLights, tick, roomAt, nearWardrobe, inLift, atLiftDoor,
         randomHaunt, insideHotel, floorOf, floorY,
         FLOOR_H, FLOORS, BX, BZ, CZ, WEST, CORE_E, SHAFT_E, ENTRY_HW, PLAYER_R };
})();
