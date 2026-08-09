/* ============================================================
   hotel3d.js — 🏨 โรงแรมผีสิง 5 ชั้น (รอบ 684 · ยกบรรยากาศ/ภารกิจงานศพไทยรอบ 1060)
   สร้าง "ตัวโรงแรม" ล้วน ๆ (โมเดล+ชนกำแพง+บันได+ลิฟต์+เฟอร์นิเจอร์+รูปตามอง)
   ส่วน "การเล่น" (ผี/ไฟฉาย/ตัวอักษร/เสียง) อยู่ในโซน 🏨 ของ js/adventure3d.js
   ▶ แยกไฟล์เพราะ adventure3d.js แตะ 10,700 บรรทัดแล้ว (กฎทอง #2 ห้ามให้ไฟล์อ้วนโตอีก)
   ▶ ต้องโหลดหลัง js/vendor/three.min.js และก่อน js/adventure3d.js (ดู loadAdv3d() ใน js/ui.js)

   🗺️ ผังตึก (มองจากบน · +X = ทางเข้าหน้าโรงแรม)
       WEST -19.5 ─ SHAFT_E -15 ─ CORE_E -12.5 ────────────── BX +20
   z-10.5 ┌──────────────┬──────────────┬──────────┬──────────┐
          │ 🪜 บันได dog-leg: ชานกลาง│ช่วง2↗│ชานชั้น │ ห้อง N1 │ N2 │ N3 │
   z -6.5 ├──── (หักกลับ180°) │ช่วง1↖│ (รอบ850) ├──────┴──────────┤
          │ 🛗 ชานพักหน้าบันได (ราบทุกชั้น)   │                     │
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
const FLOOR_H=3.4, FLOORS=5, CEIL_H=2.95, SLAB=.2;
const BZ=10.5;                   // ผนังนอกด้านในตามแกน Z
const CZ=1.4;                    // ครึ่งกว้างทางเดิน 2.8 ม. — สัดส่วนโรงแรมจริง ไม่ใช่โถงกว้าง 5 ม.
const WEST=-19.5;                // ผนังตะวันตกด้านใน
const SHAFT_E=-15;               // หน้าปล่องลิฟต์
const CORE_E=-12.5;              // ขอบตะวันออกของแกนบันได/ลิฟต์
/* 🏨 รอบ 1062: ยืด "แนวทางเดิน" จริง 3 เท่า โดยคงขนาดห้องเดิม
   เดิม CORE_E..BASE_BX = 32.5 ม. และมี 3 ห้อง/ฝั่ง → ใหม่ยาว 97.5 ม. และมี 9 ห้อง/ฝั่ง
   ไม่ใช้ scale ก้อนทั้งตึก เพราะจะทำให้ประตู ห้อง และความสูงผิดสัดส่วน */
const HOTEL_LENGTH_SCALE=3, BASE_BX=20, BASE_ROOM_N=3;
const BASE_CORRIDOR_LEN=BASE_BX-CORE_E;
const BX=CORE_E+BASE_CORRIDOR_LEN*HOTEL_LENGTH_SCALE; // 85: ทางเดิน 97.5 ม. = เดิม 3 เท่า
const WORLD_X_MIN=WEST-20, WORLD_X_MAX=BX+36;         // สวนหน้า/จุดเกิดนอกตึกต้องพ้นรั้วโลก
const RZ0=-10.5, RZ1=-6.5;       // เลนโถงบันได (กว้าง 4 ม.)
const LZ0=-6.5,  LZ1=-2.5;       // เลนชานพักหน้าบันได (พื้นราบทุกชั้น)
/* 🪜 รอบ 850 (ผู้ใช้: "บันไดชิดผนังไม่สวย ค้นหลักการสร้างบันไดตึกจริง"): เปลี่ยนจากทางลาดยาว
   เส้นเดียวแนบผนังเหนือ → บันไดแบบ "พับกลับ" (dog-leg / half-turn) ตามหลักออกแบบบันไดอาคารจริง:
   ขึ้น 2 ช่วงสั้น ช่วงละครึ่งชั้น มี "ชานพักกลาง" หักกลับ 180° + ช่องโล่งกลาง (stairwell) มีแผงราวกันตก
   ▸ เลนใต้ (z -8.35..-6.5)  = ช่วงแรก ไต่จากชานพักชั้น(ตะวันออก) ขึ้นไปทางตะวันตก ครึ่งชั้น
   ▸ เลนเหนือ (z -10.5..-8.65) = ช่วงสอง ไต่จากชานพักกลาง(ตะวันตก) กลับมาทางตะวันออก ถึงชั้นถัดไป
   ▸ ขนาดตามมาตรฐานกฎกระทรวง ฉ.55: ลูกตั้ง .17 ≤ .18 ม. · ลูกนอน .34 ≥ .25 ม. · ชานพักลึก 1.8 ≥ 1.2 ม.
   surfaceY() ใช้ค่าชุดเดียวกันนี้คำนวณความสูงใต้เท้า */
const ST_LAND=1.8;               // ความลึกชานพัก (ตะวันออก=ระดับชั้น · ตะวันตก=ครึ่งชั้น)
const ST_XW=WEST+ST_LAND;        // -17.7 ขอบตะวันออกของชานพักกลาง
const ST_XE=CORE_E-ST_LAND;      // -14.3 ขอบตะวันตกของชานพักชั้น
const ST_RUN=ST_XE-ST_XW;        // 3.4 ระยะราบของแต่ละช่วง
const ST_RISE=FLOOR_H/2;         // 1.7 แต่ละช่วงขึ้นครึ่งชั้น
const ST_STEPS=10;               // 10 ขั้น/ช่วง (ลูกตั้ง .17 · ลูกนอน .34)
const ST_GAP0=-8.65, ST_GAP1=-8.35; // ช่องโล่งกลางระหว่าง 2 ช่วง (มีแผงราวกันตก)
const ST_ZMID=-8.5;              // เส้นแบ่งเลนใต้/เลนเหนือ (ใช้ใน surfaceY)
const ROOM_N=BASE_ROOM_N*HOTEL_LENGTH_SCALE; // 9 ห้อง/ฝั่ง/ชั้น — ขนาดห้องเท่าเดิม
const RW=(BX-CORE_E)/ROOM_N;     // กว้างห้อง ~10.8
const RD=BZ-CZ;                  // ลึกห้อง 8
const DOOR_W=.98, DOOR_H=2.12;   // ประตูห้องพักตามสัดส่วนจริง ~0.9×2.1 ม.
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
  /* tint = สีคูณทับภาพ · ไม่ใส่ = ภาพขึ้นเต็มความสว่างของไฟล์ (สว่างโพลนกลางคืนได้) */
  const bump=(kind)=>{
    const cv=document.createElement('canvas'); cv.width=cv.height=64; const c=cv.getContext('2d');
    const im=c.createImageData(64,64), d=im.data;
    for(let y=0;y<64;y++) for(let x=0;x<64;x++){
      const i=(y*64+x)*4;
      const grain=kind==='wood' ? 128+Math.sin(y*.9+Math.sin(x*.13)*3)*22+Math.sin(y*.18)*13
        : kind==='carpet' ? 112+((x*17+y*29)%31)+Math.sin((x+y)*1.7)*10
        : 124+((x*11+y*7)%17)+Math.sin(x*.8)*5;
      d[i]=d[i+1]=d[i+2]=grain; d[i+3]=255;
    }
    c.putImageData(im,0,0); const t=new T.CanvasTexture(cv); t.wrapS=t.wrapT=T.RepeatWrapping;
    t.repeat.set(kind==='wood'?3:6,kind==='wood'?3:6); return t;
  };
  const bumps={wall:bump('wall'),carpet:bump('carpet'),wood:bump('wood')};
  const L=(c,key,rx,ry,tint,rough=.82,metal=.0,bumpKey)=>{
    const m=new T.MeshStandardMaterial({color:c,roughness:rough,metalness:metal});
    if(bumpKey){ m.bumpMap=bumps[bumpKey]; m.bumpScale=bumpKey==='carpet'?.035:.018; }
    if(key) TEX(m,key,rx||1,ry||1,tint); return m;
  };
  const M={
    wall  : L(0x6f5a45,'tex_hotel_wall',1,1,null,.92,0,'wall'),      // วอลเปเปอร์ทางเดิน
    room  : L(0x7d6a52,'tex_hotel_room',1,1,null,.90,0,'wall'),      // วอลเปเปอร์ในห้อง
    carpet: L(0x5d1f2c,'tex_hotel_carpet',1,1,null,.98,0,'carpet'),  // พรมแดงเลือดหมู
    marble: L(0x8f8779,'tex_hotel_marble',1,1),    // พื้นหินอ่อนล็อบบี้
    wood  : L(0x3b2418,'tex_hotel_wood',1,1,null,.58,0,'wood'),      // ไม้เข้ม (ประตู/ตู้/เตียง)
    trim  : L(0x33271f,null,1,1,null,.67,0,'wood'),
    ceil  : L(0xc9c2b5,null,1,1,null,.94),
    tile  : L(0xc3cbcd,'tex_hotel_tile',1,1),      // กระเบื้องห้องน้ำ
    porc  : L(0xe8ecec),                           // เครื่องสุขภัณฑ์
    gold  : L(0xa77b28,null,1,1,null,.38,.82),      // ทองเหลืองเก่า ไม่เงาแบบพลาสติก
    cloth : L(0x6d1622),                           // ผ้าคลุมเตียง/ม่าน
    sheet : L(0xd9d2c2),                           // ผ้าปูที่นอน
    metal : L(0x4e5359,null,1,1,null,.45,.72),
    /* 🌙 รอบ 694: เปลือกนอกต้อง "หม่นแบบกลางคืน" — เดิมแปะภาพแล้วสีคูณถูกรีเซ็ตเป็นขาว
       ตึกเลยสว่างโพลนเหมือนกลางวันทั้งที่ฟ้ามืด (ต้นเหตุที่ผู้ใช้บอกว่าข้างนอกดูชุ่ย) */
    facade: L(0x7a6f61,'tex_hotel_facade',1,1,0x6d6a66),
    stone : L(0x6b665e),
    /* 🩹 รอบ 764: ลานหินหน้าประตู เดิมใช้ M.stone = สีเทาล้วน วางแนบพื้นสนามพอดี
       → เห็นเป็นแผ่นเทาโพลนทับภาพพื้นจริง (ผู้ใช้แจ้ง) · ให้ปูคอนกรีตจริงหม่นแบบกลางคืน
       จะได้กลืนกับพื้นรอบ ๆ เหมือนทางเดินปูจริง ไม่ใช่แผ่นสีทับ */
    porch : L(0x585349,'tex_concrete',1,1,0x565b62),
    leaf  : L(0x2c4a2e),
    funeralWood:L(0x24120d,'tex_hotel_wood',1,1,0x2f211b),
    funeralWhite:L(0xd7d2c7),
    funeralBlack:L(0x111116),
    stain : new T.MeshStandardMaterial({color:0x3d4534,roughness:1,metalness:0,transparent:true,opacity:.24,depthWrite:false}),
  };
  /* ไฟ/หน้าต่าง = MeshBasic (ไม่ง้อแสง) + fog:false → ยังเรืองแสงทะลุหมอกกลางคืน
     ทำให้ตอนเดินเข้ามาเห็น "โรงแรมหรูไฟสว่าง" ชัดจากไกล (ข้อ 3) */
  M.lamp   =new T.MeshBasicMaterial({color:0xffe6ae,fog:false});   // ไฟในตึก (ดับตอนไฟดับ)
  M.indicator=new T.MeshBasicMaterial({color:0x6fe09b,fog:false});
  M.win    =new T.MeshBasicMaterial({color:0xffdf9e,fog:false});   // หน้าต่างสว่างมองจากนอก
  M.glass  =new T.MeshBasicMaterial({color:0x121a2c});   // กระจกหน้าต่างมองจากใน
  M.mirror =new T.MeshBasicMaterial({color:0x2b3038});   // กระจกเงา
  return M;
}

/* ---------- ภาพวาดในกรอบรูป (วาดเอง = ปลอดลิขสิทธิ์ 100%) ----------
   🖼️ รอบ 694: ถ้ามีไฟล์ `img/tex/tex_hotel_portrait_1..6.png` (ภาพเหมือนจริง) จะแปะทับภาพวาดนี้อัตโนมัติ
   ⚠️ ภาพต้องวาง "เบ้าตา" ตรงตำแหน่งเดิมเป๊ะ เพราะลูกตาเป็น mesh แยกวางทับ (จะได้กลอกตาตามได้):
      ตาซ้าย/ขวาอยู่ที่ 40.6% / 59.4% ของความกว้าง · สูงจากขอบบน 43.5% · สัดส่วนภาพ 256:340 (3:4)
      และในภาพต้องเป็น "ตาขาวล้วน ไม่มีตาดำ" — ตาดำคือ mesh ที่เกมวางทับให้เอง
      prompt เต็มอยู่ handoff/PROMPTS_HOTEL.md */
const PORTRAIT_PHOTOS=6;
/* 🖼️ รอบ 768: ตำแหน่ง/ขนาดตาจริงของภาพถ่ายแต่ละใบ (วัดจากพิกเซลเบ้าตาขาวในไฟล์จริงแต่ละใบด้วย OpenCV)
   เดิมใช้ EYE_X/EYE_Y ค่าเดียวคำนวณจากภาพวาด canvas (256×340, ตา 40.6%/59.4% กว้าง, 43.5% สูง) — ใช้ได้แค่ตอนไม่มีไฟล์จริง
   ภาพถ่ายจริงแต่ละใบครอปตำแหน่งหน้า/ขนาดตาไม่เท่ากัน ใช้ค่าเดียวจึงตาเลื่อนไปอยู่แก้ม + ตาดำใหญ่เกินเบ้าตาจริง
   lx/rx/y = ตำแหน่งตาซ้าย/ขวา/ระดับสูง (เมตร บนระนาบ 1.02×1.36) · r = รัศมีตาดำ (เมตร) ให้พอดีเบ้าตาขาว ไม่ใหญ่เกิน
   👁️ รอบ 778 (ผู้ใช้: "ลูกตาดำชิดข้างมากเกินไป เหมือนมองภาพข้าง ๆ มากกว่ามองผู้เล่น"):
      เดิม tick() กลอกตาได้ ±.03 ม. เท่ากันทุกใบ ทั้งที่ "ครึ่งกว้างเบ้าตาขาว" จริงมีแค่ .022–.033 ม.
      → ตาดำถูกดันไปติดหางตาแทบตลอดเวลา (แถมเกนเดิมอิ่มตัวตั้งแต่ผู้เล่นเยื้องไปแค่ 1.5 ม.)
      mx/my = ระยะกลอกสูงสุดของภาพใบนั้น = (ครึ่งเบ้า − รัศมีตาดำ)×0.85 วัดพิกเซลจริงด้วย OpenCV ทั้ง 6 ใบ */
const EYE_R0=.03;   // รัศมีฐานของ eyeGeo (ใช้คำนวณอัตราส่วน scale ต่อภาพ)
const PORTRAIT_EYE=[
  {lx:-.090,rx:.071,y:.231,r:.0123,mx:.0107,my:.0035},
  {lx:-.097,rx:.097,y:.176,r:.0118,mx:.0141,my:.0035},
  {lx:-.090,rx:.077,y:.267,r:.0101,mx:.0105,my:.0027},
  {lx:-.095,rx:.087,y:.218,r:.0171,mx:.0134,my:.0016},
  {lx:-.081,rx:.083,y:.223,r:.0105,mx:.0118,my:.0035},
  {lx:-.079,rx:.082,y:.259,r:.0132,mx:.0138,my:.0012},
];
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
  const H={grp, mats:M, solids:[], rooms:[], spots:[], portraits:[], wardrobes:[], specialWardrobes:[], fixtureLights:[],
           floorVisuals:Array.from({length:FLOORS},()=>[]), visibleFloors:[],
           funeral:null, funeralBulbs:[],
           lamps:[M.lamp,M.win], lightsOn:true, lightLevel:1, FLOOR_H, FLOORS, BX, BZ, CZ,
           HOTEL_LENGTH_SCALE, WORLD_X_MIN, WORLD_X_MAX, floorY};

  /* กล่องกันชน (AABB) — y0..y1 คุมว่าอยู่ชั้นไหน */
  const solid=(x0,x1,z0,z1,y0,y1,tag)=>{ H.solids.push({x0,x1,z0,z1,y0,y1,on:true,tag:tag||''}); };
  /* วัตถุแยกชิ้นที่อยู่ชั้นเดียวชัดเจน — ใช้ซ่อนชั้นอื่นซึ่งถูกผนัง/ฝ้าบังอยู่แล้ว
     (WebGL ไม่มี occlusion culling จึงยังส่งห้องหลังผนังเข้า GPU ถ้าไม่ปิด visibility เอง) */
  const floorVisual=(f,o)=>{ if(o&&f>=0&&f<FLOORS){ o.userData.hotelFloor=f; H.floorVisuals[f].push(o); } return o; };
  // Repeated small props share geometry/material and collapse into one draw call.
  const staticInstances=(geo,mat,items,parent,floor)=>{
    const host=parent||grp;
    if(!items.length)return null;
    if(!T.InstancedMesh){
      const fallback=new T.Group();
      items.forEach(it=>{ const m=new T.Mesh(geo,mat); m.position.set(it.x,it.y,it.z); m.scale.setScalar(it.s||1); fallback.add(m); });
      if(floor!==undefined)floorVisual(floor,fallback); host.add(fallback); return fallback;
    }
    const mesh=new T.InstancedMesh(geo,mat,items.length), matrix=new T.Matrix4();
    const pos=new T.Vector3(), quat=new T.Quaternion(), scale=new T.Vector3();
    items.forEach((it,i)=>{
      pos.set(it.x,it.y,it.z); scale.setScalar(it.s||1); matrix.compose(pos,quat,scale); mesh.setMatrixAt(i,matrix);
    });
    mesh.instanceMatrix.needsUpdate=true;
    if(floor!==undefined)floorVisual(floor,mesh); host.add(mesh); return mesh;
  };
  /* กำแพง: วางกล่อง + กันชนพร้อมกัน (thick = ความหนา) */
  const A={ struct:Acc(), room:Acc(), carpet:Acc(), marble:Acc(), wood:Acc(), trim:Acc(), ceil:Acc(), stain:Acc(),
            tile:Acc(), porc:Acc(), gold:Acc(), cloth:Acc(), sheet:Acc(), metal:Acc(),
            facade:Acc(), stone:Acc(), porch:Acc(), leaf:Acc(), glass:Acc(), win:Acc(), lamp:Acc(),
             indicator:Acc(), funeralWood:Acc(), funeralWhite:Acc(), funeralBlack:Acc() };
  function wall(acc,x0,x1,z0,z1,y,h,uv,noSolid){
    if(x1<=x0||z1<=z0) return;
    accBox(acc,(x0+x1)/2,y+h/2,(z0+z1)/2,x1-x0,h,z1-z0,uv||1.25);
    if(!noSolid) solid(x0,x1,z0,z1,y,y+h);
  }

  /* ---------- โครงพื้น/เพดานแต่ละชั้น ---------- */
  function slab(acc,x0,x1,z0,z1,y,uv){
    accBox(acc,(x0+x1)/2,y-SLAB/2,(z0+z1)/2,x1-x0,SLAB,z1-z0,uv||3);
  }
  for(let f=0;f<FLOORS;f++){
    const y=floorY(f), fl=(f===0)?A.marble:A.carpet;
    slab(fl,CORE_E,BX,-BZ,BZ,y,f===0?3:.9);              // ลายพรมเล็กลงตามสเกลจริง
    slab(fl,WEST,CORE_E,LZ0,LZ1,y,2.2);                 // ชานพักบันได
    slab(fl,CORE_E-2.0,CORE_E,LZ1,-CZ,y,2.2);           // ทางเชื่อมชานพัก→corridor (อุดช่องว่าง 1.1 ม. ที่เห็นหลังขึ้นบันได)
    slab(fl,SHAFT_E,CORE_E,-CZ,CZ,y,2.2);               // หน้าลิฟต์
    slab(fl,WEST,CORE_E,CZ,BZ,y,2.2);                   // ห้องเก็บของฝั่งใต้
    // ฝ้าปูนจริงแยกจากท้องแผ่นพื้น — ไม่ให้มองขึ้นไปเห็น material พรมของชั้นบน
    slab(A.ceil,CORE_E,BX,-BZ,BZ,y+CEIL_H,3);
  }
  slab(A.stone,WEST-.6,BX+.6,-BZ-.6,BZ+.6,floorY(FLOORS-1)+CEIL_H+.5,4);  // ดาดฟ้า

  /* ---------- ผนังนอก (ทุกชั้น) ---------- */
  for(let f=0;f<FLOORS;f++){
    const y=floorY(f);
    wall(A.struct,WEST-.35,WEST,-BZ,BZ,y,CEIL_H);                       // ตะวันตก
    if(f===0){                                                          // ล็อบบี้โล่ง ไม่มีห้อง — ผนังทั้งเส้นเป็นวอลเปเปอร์ทางเดินเดิม
      wall(A.struct,WEST,BX,-BZ-.35,-BZ,y,CEIL_H);                      // เหนือ
      wall(A.struct,WEST,BX,BZ,BZ+.35,y,CEIL_H);                        // ใต้
      wall(A.struct,BX,BX+.35,-BZ,-ENTRY_HW,y,CEIL_H);                  // ตะวันออก: เว้นประตูหน้า
      wall(A.struct,BX,BX+.35,ENTRY_HW,BZ,y,CEIL_H);
      wall(A.struct,BX,BX+.35,-ENTRY_HW,ENTRY_HW,y+2.6,CEIL_H-2.6,2.4,true);
    }else{
      /* 🩹 ชั้นห้องพัก: ฝั่งโถงบันได (WEST..CORE_E) ยังเป็นวอลเปเปอร์ทางเดิน tex_hotel_wall เดิม
         ฝั่งห้องพัก (CORE_E..BX) = "ผนังนอกสุดของห้อง" เปลี่ยนเป็นวอลเปเปอร์ในห้อง tex_hotel_room
         (เดิมทั้งเส้นใช้ A.struct เส้นเดียว ทำให้ tex_hotel_room ไม่เคยถูกวาดที่ไหนในตึกเลย) */
      wall(A.struct,WEST,CORE_E,-BZ-.35,-BZ,y,CEIL_H);
      wall(A.room,  CORE_E,BX,  -BZ-.35,-BZ,y,CEIL_H);
      wall(A.struct,WEST,CORE_E,BZ,BZ+.35,y,CEIL_H);
      wall(A.room,  CORE_E,BX,  BZ,BZ+.35,y,CEIL_H);
      wall(A.room,BX,BX+.35,-BZ,BZ,y,CEIL_H);                          // ตะวันออก (ผนังท้ายห้องริมสุด)
    }
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
    const sideWindowN=Math.ceil((BX-WEST-4.8)/3.7); // รักษาระยะหน้าต่างเดิมตลอดปีกที่ยาวขึ้น
    for(let i=0;i<sideWindowN;i++){                // หน้าต่างเรียงหน้า-หลังตึก
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
        if(i>0) wall(A.room,x0,x0+.3,sgn<0?-BZ:CZ,sgn<0?-CZ:BZ,y,CEIL_H);   // ผนังกั้นห้อง (อยู่ในห้องล้วน → วอลเปเปอร์ห้อง)
        const R={f,side,i,x0,x1,cx,cz:sgn*((CZ+BZ)/2),y,rot:(side==='n'?0:Math.PI),
                 door:{x:dx,z:sgn*CZ}, key:roomKey(f,side,i)};
        H.rooms.push(R);
      }
      cut.sort((a,b)=>a[0]-b[0]);
      let px=CORE_E;
      const finishWall=(a,b)=>{
        wall(A.struct,a,b,Math.min(zc0,zc1),Math.max(zc0,zc1),y,CEIL_H);
        if(b-a>.02){
          const zt=sgn*(CZ-.045), w=b-a;
          accBox(A.trim,(a+b)/2,y+.11,zt,w,.22,.09,1.2);              // บัวพื้น
          accBox(A.trim,(a+b)/2,y+1.02,zt,w,.075,.07,1.2);            // chair rail
          accBox(A.trim,(a+b)/2,y+CEIL_H-.10,zt,w,.20,.11,1.2);       // crown molding
        }
      };
      cut.forEach(c=>{
        finishWall(px,c[0]);
        wall(A.struct,c[0],c[1],Math.min(zc0,zc1),Math.max(zc0,zc1),y+DOOR_H,CEIL_H-DOOR_H,1.2);
        px=c[1];
      });
      finishWall(px,BX);
    });
    // แบ่งโถงยาวเป็นปีกด้วยคานฝ้า+เสาหลอกทุก 32.5 ม. ลดความรู้สึกอุโมงค์ procedural
    for(let section=1;section<6;section++){
      const ax=CORE_E+section*(BX-CORE_E)/6;
      accBox(A.trim,ax,y+CEIL_H-.12,0,.34,.24,CZ*2-.08,1.2);
      [-1,1].forEach(s=>accBox(A.trim,ax,y+1.42,s*(CZ-.06),.34,2.84,.16,1.2));
    }
  }

  /* ---------- 🪜 บันไดหลักแบบ "พับกลับ" (dog-leg) — รอบ 850 ----------
     หลักบันไดตึกจริง: ช่วงสั้น 2 ช่วง หักกลับ 180° ที่ชานพักกลาง ไม่ใช่ทางลาดยาวแนบผนัง
     ▸ เดินเข้าจากชานพักชั้น (ตะวันออก x ST_XE..CORE_E ราบเต็มกว้าง)
     ▸ ช่วงแรก (เลนใต้)  ไต่ไปตะวันตก ขึ้นครึ่งชั้น → ชานพักกลาง (ตะวันตก ราบเต็มกว้าง)
     ▸ หันกลับ ช่วงสอง (เลนเหนือ) ไต่กลับมาตะวันออก → ถึงชานพักของชั้นถัดไป
     ตรงกลางเป็นช่องโล่ง (stairwell) มีแผงราวกันตกกั้นตลอดช่วงไต่ */
  const sLaneC=(ST_GAP1+RZ1)/2, sLaneW=RZ1-ST_GAP1;        // เลนใต้: กึ่งกลาง/ความกว้าง (~1.85)
  const nLaneC=(RZ0+ST_GAP0)/2, nLaneW=ST_GAP0-RZ0;        // เลนเหนือ
  const stepY=t=>Math.max(0,Math.min(1,t))*ST_RISE;        // ความสูงตามสัดส่วนช่วงไต่ 0..1
  const ang=Math.atan2(ST_RISE,ST_RUN), len=Math.hypot(ST_RUN,ST_RISE);
  for(let f=0;f<FLOORS;f++){
    // ชานพักชั้น (ตะวันออก) ราบเต็มกว้างทุกชั้น — จุดเริ่มขึ้น/จุดมาถึง + ทางออกสู่ทางเดิน
    accBox(A.stone,(ST_XE+CORE_E)/2,floorY(f)-.15,(RZ0+RZ1)/2,CORE_E-ST_XE,.3,RZ1-RZ0,2.4);
  }
  for(let f=0;f<FLOORS-1;f++){
    const y=floorY(f);
    // ชานพักกลาง (ตะวันตก) ครึ่งชั้น ราบเต็มกว้าง — จุดหักกลับ 180°
    accBox(A.stone,(WEST+ST_XW)/2,y+ST_RISE-.15,(RZ0+RZ1)/2,ST_XW-WEST,.3,RZ1-RZ0,2.4);
    /* ช่วงแรก (เลนใต้ ไต่ตะวันตก): แผ่นเอียงใต้ท้อง + ลูกนอนเป็นขั้นจริง */
    accBox(A.stone,(ST_XW+ST_XE)/2,y+ST_RISE/2-.16,sLaneC,len,.3,sLaneW,2.4,{z:-ang});
    /* ช่วงสอง (เลนเหนือ ไต่ตะวันออก) */
    accBox(A.stone,(ST_XW+ST_XE)/2,y+ST_RISE+ST_RISE/2-.16,nLaneC,len,.3,nLaneW,2.4,{z:ang});
    for(let s=0;s<ST_STEPS;s++){
      const t=(s+.5)/ST_STEPS, w=ST_RUN/ST_STEPS*.94;
      accBox(A.stone,ST_XE-t*ST_RUN,y+stepY(t)+.06,sLaneC,w,.12,sLaneW-.14,2.4);           // ขั้นเลนใต้
      accBox(A.stone,ST_XW+t*ST_RUN,y+ST_RISE+stepY(t)+.06,nLaneC,w,.12,nLaneW-.14,2.4);   // ขั้นเลนเหนือ
    }
    /* แผงราวกันตกช่องกลาง (balustrade) — กั้นระหว่าง 2 ช่วงตลอดช่วงไต่ (ชานพักหัวท้ายเปิดให้ข้ามเลน)
       ความสูงไล่ตามขั้น: ท้องแผง = ระดับเลนใต้ · ยอดแผง = ระดับเลนเหนือ +1.05 (ราวจับ) */
    for(let s=0;s<5;s++){
      const x0=ST_XW+s*(ST_RUN/5), x1=x0+ST_RUN/5, tm=(ST_XE-(x0+x1)/2)/ST_RUN;
      const yl=y+stepY(tm), yh=y+ST_RISE+stepY(1-tm);
      accBox(A.wood,(x0+x1)/2,(yl+yh+1.05)/2,ST_ZMID,x1-x0,yh+1.05-yl,.12,0);                // 🩹 เดิม A.metal สีเทาแบนไม่มีลาย ผู้ใช้เห็นแล้วนึกว่าเป็นช่องว่าง/รูโหว่ → ไม้เข้มทึบตัน (tex_hotel_wood) ดูหรูขึ้น
      accBox(A.wood,(x0+x1)/2,yh+1.12,ST_ZMID,x1-x0,.09,.2,0);                             // ราวจับไม้
    }
    /* ราวจับด้านนอกช่วงแรก (ขอบติดเลนชานพักหน้าบันได z=RZ1) — บันไดจริงต้องมีราวสองฝั่ง */
    for(let s=0;s<5;s++){
      const x0=ST_XW+s*(ST_RUN/5), x1=x0+ST_RUN/5, ry=y+stepY((ST_XE-(x0+x1)/2)/ST_RUN);
      accBox(A.wood,(x0+x1)/2,ry+.55,RZ1,x1-x0,1.1,.12,0);                                 // 🩹 เดิม A.metal สีเทาแบน → ไม้เข้มทึบให้เข้าชุดกับแผงราวช่องกลาง
      accBox(A.wood,(x0+x1)/2,ry+1.14,RZ1,x1-x0,.09,.2,0);
      solid(x0,x1,RZ1-.16,RZ1+.16,ry-.2,ry+1.15,'rail');
    }
  }
  // กันข้ามช่องโล่งกลางตลอดช่วงไต่ทุกชั้น (แผงราวเป็น solid เดียวสูงตลอดตึก — ชานพักหัวท้ายไม่กั้น)
  solid(ST_XW,ST_XE,ST_GAP0,ST_GAP1,0,FLOORS*FLOOR_H,'rail');
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
    floorVisual(f,dl); floorVisual(f,dr);
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
  accBox(F.room,-HX+1.8,1.5,HZ-2.6,.16,3,5.2,2);                     // 🩹 ผนังยาว (แกน Z) หันหน้าเข้าห้อง: เดิมกระเบื้องห้องน้ำ (tex_hotel_tile) — ผู้ใช้เห็นจากในห้อง/ทางเดินแล้วดูไม่หรู เปลี่ยนเป็นวอลเปเปอร์ห้อง (tex_hotel_room) แทน (ยืนยันด้วยการเรนเดอร์แยกตรงจุดนี้เทียบภาพผู้ใช้แล้ว)
  fs(-HX+1.72,-HX+1.88,HZ-5.2,HZ,3);
  accBox(F.tile,-HX+.55,1.5,HZ-5.2,2.5,3,.16,2);                     // ผนังขวาง เว้นช่องประตู (อยู่ในห้องน้ำเอง ไม่ได้หันหน้าออกห้อง — คงกระเบื้องเดิม)
  fs(-HX,-HX+1.8,HZ-5.28,HZ-5.12,3);
  accBox(F.tile,-HX+.02,1.2,HZ-2.6,.06,2.4,5.2,2);                   // กระเบื้องผนังนอก (แนบชิดผนังโครงสร้างเดิมอยู่แล้ว มองไม่เห็น — คงเดิม)
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
                   tile:accGeo(F.tile), porc:accGeo(F.porc), gold:accGeo(F.gold), room:accGeo(F.room) };
  const lampGeo=new T.BoxGeometry(.9,.1,.9);
  const mirGeo=new T.BoxGeometry(.04,1.9,.9);
  const doorGeo=new T.BoxGeometry(.08,2.2,1.15);
  const wdDoorGeo=new T.BoxGeometry(.07,2.15,1.15);
  /* 🩹 บรรทัดนี้เดิม (.09,2.3,DOOR_W-.1) วางแกนยาว(DOOR_W-.1)ไปตามแกน Z ท้องถิ่น — ผิดแกน
     (ช่องประตูบนผนังกว้างไปตาม X ไม่ใช่ Z) ทำให้บานประตูไม่เคยพาดผ่านช่องจริงเลย ต้องสลับเป็น (DOOR_W-.1,2.3,.09) */
  const rmDoorGeo=new T.BoxGeometry(DOOR_W-.1,DOOR_H-.04,.075);
  const DIGITS=['abcdef','bc','abdeg','abcdg','bcfg','acdfg','acdefg','abc','abcdefg','abcdfg'];
  function addRoomNumber(num,x,y,z,side){
    const s=String(num), seg={a:[0,.10,.08,.018],b:[.05,.05,.018,.09],c:[.05,-.05,.018,.09],
      d:[0,-.10,.08,.018],e:[-.05,-.05,.018,.09],f:[-.05,.05,.018,.09],g:[0,0,.08,.018]};
    accBox(A.gold,x,y,z,.48,.30,.035,0);
    [...s].forEach((ch,di)=>[...DIGITS[+ch]].forEach(k=>{
      const q=seg[k]; accBox(A.metal,x+(di-1)*.12+q[0],y+q[1],z-side*.026,q[2],q[3],.025,0);
    }));
  }

  H.rooms.forEach(R=>{
    const g=new T.Group();
    floorVisual(R.f,g);
    g.position.set(R.cx,R.y,R.cz); g.rotation.y=R.rot;
    ['wood','cloth','sheet','tile','porc','gold','room'].forEach(k=>{
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
    const W={room:R, hingeL, hingeR, ghost:gh, open:false, t:0, knockAt:0, done:false,
             haunted:false, interactive:false,
             x:R.cx+(R.rot?-1:1)*(-HX+.9), z:R.cz+(R.rot?-1:1)*(-HZ+2.0), y:R.y};
    H.wardrobes.push(W); R.wardrobe=W;
    /* 🩹 ประตูห้องเปิดแง้ม (เดินเข้าออกได้ ไม่มีกล่องกันชน)
       ผู้ใช้แจ้ง (ภาพ): "ประตูเปิดกลางห้อง" — เดิมวางบานประตูด้วยการเลื่อน x+.55/z+.5 แล้วหมุนลอย ๆ
       ไม่มีบานพับยึดกับวงกบเลย บวกกับแกนกล่องผิด (ดูหมายเหตุ rmDoorGeo) ทำให้บานลอยกลางอากาศกลางทางเดิน/ห้อง
       ไม่ติดผนังช่องประตูจริง → แก้เป็น "บานพับจริง": หมุนกลุ่ม (T.Group) ที่จุดหมุน = ขอบวงกบ
       ฝั่งในสุด (ระนาบกลางความหนาผนัง) แล้วให้บานยื่นออกจากจุดหมุนไปเต็มความกว้างช่องประตู
       ปิดสนิท = rotation 0 พอดีเต็มช่อง · แง้มเปิด = หมุนรอบจุดหมุนนั้นจริง ไม่ใช่เลื่อนลอย */
    const sideSign=R.side==='n'?-1:1;
    const doorHingeX=R.door.x-(DOOR_W-.1)/2;                 // ขอบวงกบฝั่งเดียวกันทุกห้อง (จุดหมุนบาน)
    const doorZ=sideSign*(CZ+.22);                            // ถอยบานเข้า recess จากผิวทางเดิน
    const dHinge=new T.Group();
    dHinge.position.set(doorHingeX,R.y+DOOR_H/2,doorZ);
    const rd=new T.Mesh(rmDoorGeo,M.wood);
    rd.position.x=(DOOR_W-.1)/2;                              // แขวนจากบานพับ พาดเต็มช่องประตูตอนปิด
    dHinge.add(rd);
    const doorAngle=(R.side==='n'?-1:1)*(.27+(R.i%3)*.045);
    dHinge.rotation.y=doorAngle;                              // แง้มเล็กน้อย ยังอ่านเป็นประตูโรงแรมและไม่กินโถงแคบ
    floorVisual(R.f,dHinge);
    grp.add(dHinge);
    // วงกบ/reveal/ธรณีประตู — รวม geometry เพื่อคง draw call ต่ำ
    const frameZ=sideSign*(CZ-.025), frameX=R.door.x;
    accBox(A.trim,frameX-DOOR_W/2-.055,R.y+DOOR_H/2,frameZ,.11,DOOR_H+.12,.14,1.2);
    accBox(A.trim,frameX+DOOR_W/2+.055,R.y+DOOR_H/2,frameZ,.11,DOOR_H+.12,.14,1.2);
    accBox(A.trim,frameX,R.y+DOOR_H+.055,frameZ,DOOR_W+.22,.11,.14,1.2);
    accBox(A.gold,frameX,R.y+.025,sideSign*(CZ+.08),DOOR_W,.05,.30,0);
    // แผงนูนบนบาน + มือจับทองเหลือง + peephole (คำนวณ transform ให้รวม mesh ได้)
    const worldOnDoor=(lx,ly)=>({x:doorHingeX+Math.cos(doorAngle)*lx,
      y:R.y+ly,z:doorZ-Math.sin(doorAngle)*lx});
    const panel=(lx,ly,sx,sy)=>{ const p=worldOnDoor(lx,ly);
      accBox(A.trim,p.x,p.y,p.z-sideSign*.045,sx,sy,.035,0,{y:doorAngle}); };
    panel((DOOR_W-.1)/2,1.48,DOOR_W-.30,.52); panel((DOOR_W-.1)/2,.64,DOOR_W-.30,.72);
    let hp=worldOnDoor(DOOR_W-.28,1.00);
    accBox(A.gold,hp.x,hp.y,hp.z-sideSign*.085,.24,.055,.065,0,{y:doorAngle});
    let pp=worldOnDoor((DOOR_W-.1)/2,1.62);
    accBox(A.gold,pp.x,pp.y,pp.z-sideSign*.085,.055,.055,.045,0,{y:doorAngle});
    // keycard reader + ไฟสถานะ และหมายเลขห้องแบบ geometry (ไม่เพิ่ม canvas/material ต่อ 72 ประตู)
    const cardX=frameX+DOOR_W/2+.25;
    accBox(A.metal,cardX,R.y+1.12,frameZ-sideSign*.045,.18,.32,.07,0);
    accBox(A.indicator,cardX,R.y+1.22,frameZ-sideSign*.085,.075,.025,.018,0);
    const roomNo=(R.f+1)*100+R.i*2+(R.side==='n'?1:2);
    addRoomNumber(roomNo,frameX,R.y+2.38,frameZ-sideSign*.055,sideSign);
    // หน้าต่างในห้อง (มองออกไปเห็นฟ้ากลางคืน) — ติดผนังนอกของฝั่งนั้น
    const wz=(R.side==='n')?(-BZ+.18):(BZ-.18);
    const gw=new T.Mesh(new T.BoxGeometry(1.5,1.9,.06),M.glass);
    floorVisual(R.f,gw);
    gw.position.set(R.cx-2.2,R.y+1.75,wz); grp.add(gw);
    const gw2=gw.clone(); floorVisual(R.f,gw2); gw2.position.x=R.cx+2.2; grp.add(gw2);
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
    const y=0, frontShift=BX-BASE_BX;              // ย้ายชุดล็อบบี้เดิมไปอยู่ใกล้ประตูหน้าใหม่
    // พรมแดงจากประตูหน้าถึงลิฟต์ — ยาวเต็มโถงใหม่ ไม่ขาดกลางตึก
    const carpetX0=CORE_E+1.5, carpetX1=BX-1;
    accBox(A.carpet,(carpetX0+carpetX1)/2,.03,0,carpetX1-carpetX0,.06,4.2,2.2);
    // เคาน์เตอร์ต้อนรับ (ทรงตัว L) + ตู้กุญแจห้อง
    accBox(A.wood,9+frontShift,.6,-6.4,7.5,1.2,1.0,1.6); solid(5.25+frontShift,12.75+frontShift,-6.9,-5.9,y,y+1.2,'desk');
    accBox(A.wood,12.4+frontShift,.6,-4.6,1.0,1.2,4.6,1.6); solid(11.9+frontShift,12.9+frontShift,-6.9,-2.3,y,y+1.2,'desk');
    accBox(A.gold,9+frontShift,1.24,-6.4,7.6,.08,1.1,1.6);
    accBox(A.wood,9+frontShift,1.6,-8.6,7.0,3.0,.3,1.6); solid(5.5+frontShift,12.5+frontShift,-8.75,-8.45,y,y+3,'desk');
    for(let i=0;i<7;i++) for(let j=0;j<4;j++)
      accBox(A.gold,6+frontShift+i*1.0,1.0+j*.55,-8.42,.8,.42,.05,0); // ช่องกุญแจห้อง
    // เสาหินอ่อน 4 ต้น + คิ้วทอง
    [[-2,-6.5],[-2,6.5],[8,6.5],[15,-6.5]].forEach(p=>{
      const x=p[0]+frontShift;
      accBox(A.marble,x,1.6,p[1],1.1,3.2,1.1,2);
      accBox(A.gold,x,3.1,p[1],1.35,.22,1.35,0);
      solid(x-.6,x+.6,p[1]-.6,p[1]+.6,y,y+3.2,'col');
    });
    // โซฟา + โต๊ะกลาง
    accBox(A.cloth,2.5+frontShift,.35,6.0,3.4,.7,1.3,1.2); solid(.8+frontShift,4.2+frontShift,5.35,6.65,y,y+.7,'sofa');
    accBox(A.cloth,2.5+frontShift,.85,6.6,3.4,.9,.4,1.2);
    accBox(A.wood,2.5+frontShift,.28,4.0,1.6,.56,1.0,0); solid(1.7+frontShift,3.3+frontShift,3.5,4.5,y,y+.56,'tbl');
    // ต้นไม้ประดับ 2 กระถาง
    [[16.5,5.5],[16.5,-5.5]].forEach(p=>{
      const x=p[0]+frontShift;
      accBox(A.stone,x,.3,p[1],.9,.6,.9,0);
      accBox(A.leaf,x,1.35,p[1],1.3,1.5,1.3,0);
      solid(x-.5,x+.5,p[1]-.5,p[1]+.5,y,y+1.9,'pot');
    });
    // โคมระย้ากลางล็อบบี้
    accBox(A.gold,5+frontShift,3.0,0,.12,.5,.12,0);
    accBox(A.lamp,5+frontShift,2.55,0,1.9,.35,1.9,0);
    for(let i=0;i<8;i++){ const a=i/8*Math.PI*2;
      accBox(A.lamp,5+frontShift+Math.cos(a)*1.25,2.25,Math.sin(a)*1.25,.22,.5,.22,0); }
    // โคมผนัง vintage เว้นจังหวะตาม bay ห้อง — ไม่เรียงถี่เป็นลาย procedural
    for(let f=1;f<FLOORS;f++){
      const fy=floorY(f);
      for(let i=0;i<ROOM_N;i++){
        const lx=CORE_E+(i+.5)*RW+((i%3)-1)*.28;
        [-1,1].forEach(side=>{
          const z=side*(CZ-.055);
          accBox(A.gold,lx,fy+2.12,z,.22,.38,.075,0);                 // backplate
          accBox(A.gold,lx,fy+2.02,z-side*.13,.07,.09,.26,0);        // ก้านโคม
          accBox(A.lamp,lx,fy+2.18,z-side*.20,.34,.36,.22,0);        // โป๊ะแก้วอุ่น
        });
      }
      accBox(A.lamp,(WEST+ST_XW)/2,fy+ST_RISE+2.25,(RZ0+RZ1)/2,.5,.34,.34,0);
      // ไฟจริงเพียง 2 ดวง/ชั้น ไม่มีเงา: สร้าง pool แสง 2800K โดยไม่ทำ shader มือถือหนักเกินไป
      [1,2].forEach((q,qi)=>{
        const lx=CORE_E+(BX-CORE_E)*(q/3), side=(qi%2?1:-1);
        const base=.72+((f+qi)%3)*.10;
        const light=new T.PointLight(qi?0xffbf72:0xffd092,base,21,2);
        light.position.set(lx,fy+2.12,side*(CZ-.32)); light.castShadow=false; grp.add(light);
        light.userData.hotelBaseIntensity=base;
        H.fixtureLights.push(light); floorVisual(f,light);
      });
      // Sparse moisture marks and one neglected service cart per floor add age without new materials/draw calls.
      [CORE_E+5.8,BX-8.4].forEach((sx,si)=>{
        const side=(f+si)%2?1:-1, z=side*(CZ-.018);
        accBox(A.stain,sx,fy+.46,z,1.15,.72,.022,0);
        accBox(A.stain,sx+.72,fy+.24,z,.42,.38,.024,0);
      });
      const cartX=CORE_E+8.5+f*3.1, cartZ=(f%2?1:-1)*(CZ-.48);
      accBox(A.metal,cartX,fy+.36,cartZ,1.05,.72,.50,0);
      accBox(A.wood,cartX,fy+.78,cartZ,1.12,.08,.56,0);
      accBox(A.cloth,cartX-.32,fy+.92,cartZ,.34,.30,.42,0);
      // รายละเอียดโรงแรมจริงแบบประหยัด geometry: detector, ช่องลม, EXIT และตู้ดับเพลิง
      for(let wing=0;wing<HOTEL_LENGTH_SCALE;wing++){
        const ax=CORE_E+(wing+.5)*BASE_CORRIDOR_LEN;
        accBox(A.porc,ax,fy+CEIL_H-.055,0,.24,.06,.24,0);             // smoke detector
        accBox(A.metal,ax+2.2,fy+CEIL_H-.06,0,1.0,.045,.42,0);        // ventilation grille
      }
      for(let wing=1;wing<HOTEL_LENGTH_SCALE;wing++){
        const ax=CORE_E+wing*BASE_CORRIDOR_LEN;
        accBox(A.indicator,ax,fy+2.55,-CZ+.08,.72,.26,.05,0);         // ป้าย EXIT เรืองแสง
        accBox(A.gold,ax+.72,fy+1.15,CZ-.06,.56,.92,.08,0);           // fire cabinet frame
        accBox(A.glass,ax+.72,fy+1.15,CZ-.10,.43,.77,.035,0);
      }
    }
    // 🚪 ประตูหน้า (บานคู่แง้มไว้) + ซุ้มทางเข้า/ขั้นบันไดนอก
    /* 🩹 รอบ 801 (ผู้ใช้ต่อยอดรอบ797 ถามว่าประตูหน้าบังทางเข้าแบบเดียวกับประตูห้องหรือไม่):
       บานนี้หมุนรอบ "จุดกึ่งกลาง" ของตัวมันเอง (ไม่มีบานพับที่ขอบวงกบเหมือนประตูห้อง) — เดิม .5 rad (28.6°)
       ที่มุมนี้หน้าบาน (ตั้งฉากกับแกนยาว 1.15 ม.) เกือบหันตรงเข้าหาผู้เล่นที่เดินเข้ามาตามแนวแกน X
       (cos28.6°≈0.88 = บังพื้นที่เกือบเต็ม) ยิ่งมุมเล็กยิ่งใกล้ 0°(บานปิดสนิทแนวเดียวกับผนัง)ยิ่งบังเต็มร้อย
       ตรงข้ามกับประตูห้อง (บานพับที่ขอบ) ที่ยิ่งมุมเล็กยิ่งบังน้อย — ทดสอบภาพจริงยืนยันแล้ว: ลดมุมแบบเดียวกับ
       ห้อง (.5→.25) กลับบังมากขึ้น ต้อง "เพิ่ม" มุมแทนถึงจะเผยทางเข้าได้จริง (.5→1.0 บานเกือบขนานแนวเดิน) */
    [[-1.35,-1.0],[1.35,1.0]].forEach(d=>{
      const dm=new T.Mesh(doorGeo,M.wood);
      dm.position.set(BX+.5,1.1,d[0]); dm.rotation.y=d[1]; grp.add(dm);
    });
    /* ลานหิน + ขั้นบันไดนอกหน้าประตู (uv 2.4 = ลายคอนกรีตประมาณ 2 ตารางเมตร/แผ่น) */
    accBox(A.porch,BX+1.6,-.1,0,3.2,.2,9,2.4);
    accBox(A.porch,BX+2.6,-.28,0,1.4,.24,10,2.4);
    accBox(A.porch,BX+3.6,-.46,0,1.4,.24,11,2.4);
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

  /* ============================================================
     ⚰️🕯️ รอบ 1060 — ศาลางานศพไทยที่ปลายทางเดินชั้น 3
     งานภาพอ้างอิงธรรมเนียมร่วมสมัย: หีบไม้ลายทองบนฐานต่างระดับ รูปผู้เสียชีวิต
     กรอบทอง ดอกไม้ขาว-ดำ และสายไฟประดับหน้าแท่น โดยใช้ใบหน้าบุคคลสมมติที่เจนใหม่
     ไฟชุดนี้แยกจากไฟโรงแรม จึงยังกะพริบอยู่แม้ไฟทั้งตึกดับตามเนื้อเรื่อง
     ============================================================ */
  {
    const fy=floorY(2), fx=BX-1.75, fz=0;
    // ฐานต่างระดับ + หีบทรงไทยไม้เข้ม คิ้ว/ลายทอง
    accBox(A.funeralBlack,fx,fy+.12,fz,3.25,.24,4.25,0);
    accBox(A.funeralWood,fx+.15,fy+.56,fz,2.30,.88,3.10,1.2);
    accBox(A.funeralWood,fx+.15,fy+1.05,fz,2.48,.14,3.28,1.2);
    accBox(A.gold,fx-1.03,fy+.60,fz,.08,.56,3.12,0);
    accBox(A.gold,fx+1.33,fy+.60,fz,.08,.56,3.12,0);
    for(let z=-1.32;z<=1.32;z+=.66){
      accBox(A.gold,fx-1.04,fy+.83,z,.07,.20,.25,0);
      accBox(A.gold,fx+1.34,fy+.83,z,.07,.20,.25,0);
    }
    // ฝาหีบยกสันเล็กน้อยแบบงานไม้แกะไทย (ทึบสงบ ไม่แสดงร่าง)
    accBox(A.funeralWood,fx+.15,fy+1.18,fz,1.45,.22,3.35,1.2,{z:.20});
    accBox(A.funeralWood,fx+.15,fy+1.18,fz,1.45,.22,3.35,1.2,{z:-.20});
    accBox(A.gold,fx+.15,fy+1.31,fz,.10,.09,3.44,0);
    solid(fx-1.45,fx+1.65,-1.8,1.8,fy,fy+1.5,'funeral');

    // รูปผู้เสียชีวิตสมมติในกรอบทอง ตั้งสูงที่ผนังปลายทางเดิน
    const pm=new T.MeshPhongMaterial({color:0xffffff,shininess:5,specular:0x111111});
    TEX(pm,'tex_hotel_funeral_portrait',1,1,null,true);
    const pf=new T.Group(); floorVisual(2,pf); pf.position.set(BX-.42,fy+2.06,0); pf.rotation.y=-Math.PI/2;
    pf.add(new T.Mesh(new T.BoxGeometry(1.55,2.05,.14),M.gold));
    const pa=new T.Mesh(new T.PlaneGeometry(1.25,1.68),pm); pa.position.z=.082; pf.add(pa); grp.add(pf);

    // พวงมาลัยขาว-ดำพาดกรอบ: เม็ดดอกเล็กเรียงเป็นตัวยู ดูสมจริงกว่าทรงทึบชิ้นเดียว
    const whiteMat=new T.MeshPhongMaterial({color:0xe8e3da,shininess:10});
    const blackMat=new T.MeshPhongMaterial({color:0x17171b,shininess:4});
    const beadGeo=new T.SphereGeometry(.075,8,6), garlandWhite=[], garlandBlack=[];
    for(let i=0;i<19;i++){
      const t=i/18, x=-.58+t*1.16, y=.68-Math.sin(t*Math.PI)*.62;
      ((i%5===0)?garlandBlack:garlandWhite).push({x,y,z:.18});
    }
    staticInstances(beadGeo,whiteMat,garlandWhite,pf);
    staticInstances(beadGeo,blackMat,garlandBlack,pf);
    // พุ่มดอกไม้ขาว-ดำสองข้างหน้าโลง
    const flowerWhite=[], flowerBlack=[];
    [[BX-3.35,-1.55],[BX-3.35,1.55]].forEach((p,side)=>{
      for(let i=0;i<22;i++){
        const a=i*2.399, rr=.15+.58*Math.sqrt(i/22);
        const item={x:p[0]+Math.cos(a)*rr,y:fy+.38+(i%4)*.09,z:p[1]+Math.sin(a)*rr,s:.82+((i*7)%5)*.04};
        ((i+side)%6===0?flowerBlack:flowerWhite).push(item);
      }
    });
    staticInstances(beadGeo,whiteMat,flowerWhite,grp,2);
    staticInstances(beadGeo,blackMat,flowerBlack,grp,2);

    // หลอดไฟงานศพ: ทำเป็นสามชุด material เพื่อกระพริบสลับจังหวะ แต่ไม่เพิ่ม material ต่อหลอด
    const bulbGeo=new T.SphereGeometry(.055,7,5), bulbMats=[0,1,2].map(()=>new T.MeshBasicMaterial({color:0xffd782,fog:false}));
    const bulbItems=[[],[],[]];
    const addBulb=(x,y,z,i)=>bulbItems[i%3].push({x,y,z});
    let bi=0;
    for(let z=-1.55;z<=1.55;z+=.31){ addBulb(BX-3.18,fy+.20,z,bi++); addBulb(BX-.28,fy+.20,z,bi++); }
    for(let y=fy+1.18;y<=fy+2.95;y+=.25){ addBulb(BX-.28,y,-.93,bi++); addBulb(BX-.28,y,.93,bi++); }
    bulbItems.forEach((items,i)=>H.funeralBulbs.push({m:staticInstances(bulbGeo,bulbMats[i],items,grp,2),phase:i*2.1}));

    H.funeral={x:fx,z:fz,y:fy,letterSpot:{x:BX-3.82,z:0,y:fy},portrait:pf};
  }

  /* ============================================================
     🚪🚪🚪🚪🚪 รอบ 1060 — ห้องในสุดชั้น 4 มีตู้ภารกิจ 5 ใบ
     ตำแหน่งตู้คงที่เพื่อให้ห้องอ่านง่าย แต่ “ของข้างใน” สุ่มสลับทุกครั้งที่เข้าเล่น:
     ตัวอักษร / ว่าง / รูปหน้าโลง / ห่อผ้าขาว / ห่อผ้าขาว
     ============================================================ */
  {
    const fy=floorY(3), z=9.40;
    const whiteMat=new T.MeshPhongMaterial({color:0xe8e3da,shininess:10});
    const blackMat=new T.MeshPhongMaterial({color:0x17171b,shininess:4});
    const beadGeo=new T.SphereGeometry(.075,8,6);
    const bodyGeo=new T.SphereGeometry(.48,12,9);
    const mkBundle=()=>{
      const g=new T.Group();
      const torso=new T.Mesh(bodyGeo,M.funeralWhite); torso.scale.set(.56,1.72,.42); torso.position.y=.92; g.add(torso);
      const fold=new T.Mesh(new T.TorusGeometry(.30,.035,6,18),M.funeralWhite); fold.rotation.x=Math.PI/2; fold.position.y=1.34; g.add(fold);
      return g;
    };
    for(let i=0;i<5;i++){
      const x=BX-9.65+i*2.10, g=new T.Group(); floorVisual(3,g); g.position.set(x,fy,z); grp.add(g);
      const part=(sx,sy,sz,px,py,pz,mat)=>{ const m=new T.Mesh(new T.BoxGeometry(sx,sy,sz),mat||M.funeralWood); m.position.set(px,py,pz); g.add(m); };
      part(1.72,.13,.92,0,.065,0); part(1.72,.13,.92,0,2.555,0);
      part(.13,2.62,.92,-.795,1.31,0); part(.13,2.62,.92,.795,1.31,0);
      part(1.50,2.38,.10,0,1.31,.43,M.funeralBlack);              // หลังตู้เปิดโล่งด้านหน้า
      const hingeL=new T.Group(), hingeR=new T.Group();
      hingeL.position.set(-.83,1.31,-.52); hingeR.position.set(.83,1.31,-.52);
      const dl=new T.Mesh(new T.BoxGeometry(.82,2.52,.08),M.funeralWood), dr=dl.clone();
      dl.position.x=.41; dr.position.x=-.41; hingeL.add(dl); hingeR.add(dr); g.add(hingeL,hingeR);

      const photo=new T.Group(); photo.position.set(0,1.38,.36); photo.rotation.y=Math.PI;
      const pmat=new T.MeshPhongMaterial({color:0xffffff,shininess:4}); TEX(pmat,'tex_hotel_funeral_portrait',1,1,null,true);
      photo.add(new T.Mesh(new T.BoxGeometry(.93,1.35,.07),M.gold));
      const art=new T.Mesh(new T.PlaneGeometry(.72,1.05),pmat); art.position.z=.045; photo.add(art);
      for(let j=0;j<13;j++){ const t=j/12, b=new T.Mesh(beadGeo,j%4===0?blackMat:whiteMat);
        b.scale.setScalar(.65); b.position.set(-.34+t*.68,.47-Math.sin(t*Math.PI)*.40,.09); photo.add(b); }
      g.add(photo);

      const bundleA=mkBundle(); bundleA.position.set(0,.02,.04); bundleA.rotation.z=.06; g.add(bundleA);
      const bundleB=mkBundle(); bundleB.position.set(0,.02,.04); bundleB.rotation.z=-.07; g.add(bundleB);
      photo.visible=bundleA.visible=bundleB.visible=false;
      const W={special:true,interactive:true,slot:i,x,z:z-.72,y:fy,room:{rot:0},hingeL,hingeR,open:false,t:0,done:false,
               content:'empty',visuals:{photo,bundleA,bundleB},letter:null};
      H.wardrobes.push(W); H.specialWardrobes.push(W);
      solid(x-.88,x+.88,z-.48,z+.48,fy,fy+2.65,'questWardrobe');
    }
    configureSpecialWardrobes(H,0,1);
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
     ตำแหน่ง/ขนาดตาต่อภาพ = PORTRAIT_EYE (บรรทัด ~131) วัดจากพิกเซลจริงของแต่ละไฟล์ */
  const frameGeo=new T.BoxGeometry(1.25,1.65,.1);
  const artGeo=new T.PlaneGeometry(1.02,1.36);
  const eyeGeo=new T.CircleGeometry(.03,12);
  /* ตาดำปกติ (ไฟติด) — ใช้วัสดุเดียวร่วมกันทั้ง 30 กรอบ (ไม่มีต้นทุนเพิ่ม)
     🔴 รอบ 697: ตอนไฟดับ H.eyeMat จะถูกทำให้แดงวาบพร้อมกันทั้งโรงแรมใน tick() ด้านล่าง
     (MeshBasicMaterial ไม่รับแสง → สีที่ตั้งคือสีที่เห็นตรง ๆ ทำหน้าที่เหมือน "เรืองแสง" อยู่แล้ว) */
  const eyeMat=new T.MeshBasicMaterial({color:0x0b0a09});
  H.eyeMat=eyeMat;
  let seed=0;
  function addPortrait(x,y,z,face){
    const g=new T.Group(); g.position.set(x,y,z); g.rotation.y=(face>0?0:Math.PI);
    floorVisual(Math.max(0,Math.min(FLOORS-1,Math.round((y-1.75)/FLOOR_H))),g);
    const variant=seed%5;
    g.scale.set([1,.90,1.08,.94,1.03][variant],[1,.96,1.06,.91,1.02][variant],1);
    g.add(new T.Mesh(frameGeo,M.gold));
    /* ⚠️ ต้องเป็น Lambert ไม่ใช่ Basic — ไฟดับแล้วภาพในกรอบต้อง "มืดไปด้วย"
       แล้วค่อยโผล่ขึ้นมาตอนไฟฉายส่องโดน (นั่นคือจังหวะที่เด็กเห็นตากลอกตาม 😱) */
    const art=new T.Mesh(artGeo,new T.MeshPhongMaterial({map:portraitTexture(seed),shininess:6,specular:0x111111}));
    /* มีไฟล์ภาพเหมือนจริง = แปะทับภาพวาดทันที · ไม่มีไฟล์ = คงภาพวาดเดิม (เกมไม่พัง) */
    const photoIdx=seed%PORTRAIT_PHOTOS;
    TEX(art.material,'tex_hotel_portrait_'+(photoIdx+1),1,1,null,true);
    const PE=PORTRAIT_EYE[photoIdx];
    seed++;
    art.position.z=.055; g.add(art);
    const e1=new T.Mesh(eyeGeo,eyeMat), e2=new T.Mesh(eyeGeo,eyeMat);
    const er=PE.r/EYE_R0;
    e1.position.set(PE.lx,PE.y,.07); e2.position.set(PE.rx,PE.y,.07);
    e1.scale.set(er,er,1); e2.scale.set(er,er,1);
    e1.visible=e2.visible=false;                    // ภาพไทยชุดใหม่มีม่านตา/รูม่านตาสมจริงอยู่แล้ว
    g.add(e1,e2);
    /* lat/ver = ตำแหน่งตาปัจจุบัน (หน่วงตามด้วย lerp) · blinkT/blinkAt = จังหวะกะพริบสุ่มต่อกรอบ
       eyeLX/eyeRX/eyeY/eyeR = ตำแหน่ง/ขนาดฐานของภาพนี้ (per-photo ไม่ใช่ค่าคงที่เดียวเหมือนเดิม) */
    H.portraits.push({g,e1,e2,face,on:false,px:x,py:y,pz:z,lat:0,ver:0,blinkT:0,blinkAt:0,
      eyeLX:PE.lx,eyeRX:PE.rx,eyeY:PE.y,eyeR:er,eyeMX:PE.mx,eyeMY:PE.my});
    grp.add(g);
  }
  /* 🩹 รอบ 778 (ผู้ใช้ส่งภาพ: "รูปกับประตูก็ทับกัน"): เดิมวางรูปเรียงระยะเท่ากัน (CORE_E+3.4+i*4.3)
     โดยไม่รู้ว่าประตูห้องอยู่ตรงไหน → ชนช่องประตูฝั่งเหนือที่ x≈-5.2 และฝั่งใต้ที่ x≈1.85 ทุกชั้น
     ประตูห้องอยู่ที่ กลางห้อง±1.9 (ดูตัวแปร dx ในลูปสร้างห้อง) = เหนือ -5.18/5.65/16.48 · ใต้ -8.98/1.85/12.68
     ตำแหน่งด้านล่างเลือกให้ห่างทั้งช่องประตู (±.85) และโคมไฟผนัง (x=CORE_E+1.6+i*4.2 กว้าง .62) แล้ว
     🛎️ ชั้น 0 เป็นล็อบบี้โล่ง **ไม่มีผนังทางเดิน** — รูปชุดเดิมจึงลอยกลางอากาศ ย้ายไปแขวนผนังนอกแทน */
  const repeatWingXs=base=>{ const out=[];
    for(let wing=0;wing<HOTEL_LENGTH_SCALE;wing++) base.forEach((x,i)=>
      out.push(x+wing*BASE_CORRIDOR_LEN+(((wing+i)%3)-1)*.28));
    return out;
  };
  const PORTRAIT_X_N=repeatWingXs([-10.2,-1.5,2.9,11.2]); // รูปซ้ำจังหวะเดิมทุกปีก เลี่ยงประตู/โคมไฟ
  const PORTRAIT_X_S=repeatWingXs([-4.5,7.0]);
  const LOBBY_X_N=repeatWingXs([-8,-2,3,16]), LOBBY_X_S=repeatWingXs([-6,8]);
  for(let f=0;f<FLOORS;f++){
    const fy=floorY(f)+1.75;
    if(f===0){
      LOBBY_X_N.forEach(px=>addPortrait(px,fy,-BZ+.18,1));
      LOBBY_X_S.forEach(px=>addPortrait(px,fy, BZ-.18,-1));
    }else{
      PORTRAIT_X_N.forEach(px=>addPortrait(px,fy,-CZ+.18,1));   // หันเข้าทางเดิน
      PORTRAIT_X_S.forEach(px=>addPortrait(px,fy, CZ-.18,-1));
    }
  }

  /* ---------- ประกอบ mesh รวม ---------- */
  accMesh(A.struct,M.wall,grp);
  accMesh(A.room,M.room,grp);
  accMesh(A.carpet,M.carpet,grp);
  accMesh(A.marble,M.marble,grp);
  accMesh(A.wood,M.wood,grp);
  accMesh(A.trim,M.trim,grp);
  accMesh(A.ceil,M.ceil,grp);
  accMesh(A.stain,M.stain,grp);
  accMesh(A.tile,M.tile,grp);
  accMesh(A.porc,M.porc,grp);
  accMesh(A.gold,M.gold,grp);
  accMesh(A.cloth,M.cloth,grp);
  accMesh(A.sheet,M.sheet,grp);
  accMesh(A.metal,M.metal,grp);
  accMesh(A.facade,M.facade,grp);
  accMesh(A.stone,M.stone,grp);
  accMesh(A.porch,M.porch,grp);
  accMesh(A.leaf,M.leaf,grp);
  accMesh(A.glass,M.glass,grp);
  accMesh(A.win,M.win,grp);
  accMesh(A.lamp,M.lamp,grp);
  accMesh(A.indicator,M.indicator,grp);
  accMesh(A.funeralWood,M.funeralWood,grp);
  accMesh(A.funeralWhite,M.funeralWhite,grp);
  accMesh(A.funeralBlack,M.funeralBlack,grp);

  /* จุดวางตัวอักษรในล็อบบี้/ทางเดิน (นอกห้องพัก) */
  for(let f=0;f<FLOORS;f++){
    const y=floorY(f);
    let i=0;
    for(let x=CORE_E+3;x<BX-1.5;x+=4.2,i++) H.spots.push({x,z:(i%2?1.4:-1.4),y,room:'hall'+f});
  }
  /* 🩹 รอบ 766: ล็อบบี้ชั้น 0 เดิมมีแค่ 5 จุด (hall 4+store 1) ทั้งที่ห้องโล่งกว้างมาก
     (ชั้นอื่นมีห้องพักละ 4 จุด × 6 ห้อง = 24 จุด) → ตัวอักษรกองกันแน่นที่ 5 จุดเดิมเวลาผู้เล่นอยู่ชั้นล่าง
     เติมจุดกระจายตามเฟอร์นิเจอร์จริงในล็อบบี้ (ข้างเสา/โซฟา/กระถางต้นไม้/หน้าเคาน์เตอร์/กลางพรม) */
  [[-2,-5.3],[-2,5.3],[8,5.3],[15,-5.3],[2.5,8],[9,-4],[16.5,3.5],[16.5,-3.5],[5,0],[17,0]]
    .forEach(p=>H.spots.push({x:p[0]+(BX-BASE_BX),z:p[1],y:0,room:'lobby'}));
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
  if(inRect(x,z,WEST,CORE_E,RZ0,RZ1)){                            // ในโถงบันได dog-leg (รอบ 850)
    if(x>=ST_XE){                                                 // ชานพักชั้น (ตะวันออก) — ราบทุกชั้น
      let f=Math.max(0,Math.min(FLOORS-1,Math.round(curY/FLOOR_H)));
      return floorY(f);
    }
    if(x<=ST_XW){                                                 // ชานพักกลาง (ตะวันตก) — ครึ่งชั้น
      let best=ST_RISE,bd=1e9;
      for(let f=0;f<FLOORS-1;f++){
        const y=floorY(f)+ST_RISE, d=Math.abs(y-curY);
        if(d<bd){ bd=d; best=y; }
      }
      return best;
    }
    /* ช่วงไต่: เลนใต้ขึ้นจากชั้น f ไปตะวันตก · เลนเหนือไต่ต่อจากครึ่งชั้นกลับมาตะวันออก */
    const t=Math.max(0,Math.min(1,(ST_XE-x)/ST_RUN));             // 0=ฝั่งตะวันออก · 1=ฝั่งตะวันตก
    let best=0,bd=1e9;
    for(let f=0;f<FLOORS-1;f++){
      const y=(z>=ST_ZMID)? floorY(f)+t*ST_RISE : floorY(f)+FLOOR_H-t*ST_RISE;
      const d=Math.abs(y-curY);
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
   🔤🧭 รอบ 1086 — HAUNTED HOTEL PHASE 4 stable letter placement pool
   Mission code may choose from these immutable semantic slots, but HOTEL3D
   remains scene-only: it does not decide the active word or mission state.
   Never use scene traversal order as a seed input. We sort by semantic room
   and coordinates first, then assign a stable per-zone suffix.
   ============================================================ */
const LETTER_PLACEMENT_VERSION=1;
function letterPlacementPool(H){
  if(!H)return [];
  if(H.letterPlacementPool)return H.letterPlacementPool;
  const roomByKey={};
  H.rooms.forEach(R=>{roomByKey[R.key]=R;});
  const source=(H.spots||[]).slice().sort((a,b)=>{
    const af=floorOf(a.y),bf=floorOf(b.y);
    return af-bf || String(a.room||'').localeCompare(String(b.room||'')) || a.x-b.x || a.z-b.z;
  });
  const zoneCount={};
  const pool=source.map(raw=>{
    const floor=floorOf(raw.y),roomKey=String(raw.room||'open'),R=roomByKey[roomKey];
    let zone='CORRIDOR',label=`ทางเดินชั้น ${floor+1}`,roomNumber=0;
    if(R){
      roomNumber=(R.f+1)*100+R.i*2+(R.side==='n'?1:2);
      zone='ROOM_'+roomNumber; label=`ห้อง ${roomNumber}`;
    }else if(roomKey==='lobby'){
      zone='LOBBY'; label='โถงต้อนรับชั้น 1';
    }else if(roomKey.indexOf('store')===0){
      zone='STORE'; label=`ห้องเก็บของชั้น ${floor+1}`;
    }else if(roomKey.indexOf('hall')===0){
      zone='CORRIDOR'; label=`ทางเดินชั้น ${floor+1}`;
    }
    const zoneKey=`F${floor+1}_${zone}`;
    const ordinal=(zoneCount[zoneKey]=(zoneCount[zoneKey]||0)+1);
    const id=zoneKey+'_'+String(ordinal).padStart(2,'0');
    return Object.freeze({id,x:raw.x,y:raw.y,z:raw.z,floor,room:roomKey,zone,label,roomNumber});
  });
  H.letterPlacementPool=Object.freeze(pool);
  return H.letterPlacementPool;
}
function validateLetterPlacementPool(H){
  const pool=letterPlacementPool(H),ids=new Set(),errors=[];
  pool.forEach(slot=>{
    if(!slot.id||ids.has(slot.id))errors.push('duplicate:'+slot.id);
    ids.add(slot.id);
    if(!Number.isFinite(slot.x)||!Number.isFinite(slot.y)||!Number.isFinite(slot.z))errors.push('position:'+slot.id);
    if(slot.floor<0||slot.floor>=FLOORS)errors.push('floor:'+slot.id);
  });
  return {ok:errors.length===0,count:pool.length,version:LETTER_PLACEMENT_VERSION,errors};
}

/* ============================================================
   👁️‍🗨️ รอบ 1067 — visibility/light culling ตามชั้น
   วัตถุแบบรวม geometry (ผนัง/พื้น/corridor) คงเดิมทุกชิ้น จึงไม่ลดคุณภาพหรือทำให้รอยต่อหาย
   ซ่อนเฉพาะห้อง ประตู กระจก รูป ของภารกิจ และ PointLight ที่อยู่หลังพื้น/ฝ้าของชั้นอื่น
   ระหว่างบันได/ลิฟต์จะแสดงสองชั้นติดกันตามความสูงจริง ป้องกัน pop ที่รอยต่อชั้น */
function updateFloorVisibility(H,cam){
  if(!H || !H.floorVisuals || !cam) return;
  const pos=Math.max(0,Math.min(FLOORS-1,(cam.y-1.6)/FLOOR_H));
  const nearest=Math.round(pos), floors=[];
  if(Math.abs(pos-nearest)<.18) floors.push(Math.max(0,Math.min(FLOORS-1,nearest)));
  else{
    floors.push(Math.max(0,Math.min(FLOORS-1,Math.floor(pos))));
    const hi=Math.max(0,Math.min(FLOORS-1,Math.ceil(pos)));
    if(hi!==floors[0]) floors.push(hi);
  }
  const mask=floors.join(',');
  if(H._floorMask===mask) return;
  H._floorMask=mask; H.visibleFloors=floors;
  for(let f=0;f<FLOORS;f++){
    const on=floors.indexOf(f)>=0;
    H.floorVisuals[f].forEach(o=>{ o.visible=on; });
  }
}

/* ============================================================
   💡 เปิด/ปิดไฟทั้งโรงแรม (ไฟดับ = มืดสนิท เหลือแค่ไฟฉาย)
   ============================================================ */
function setLightLevel(H,level){
  const t=Math.max(0,Math.min(1,Number(level)||0));
  H.lightLevel=t; H.lightsOn=t>.04;
  const M=H.mats;
  if(!H._lightPalette){
    const c=v=>new T.Color(v);
    H._lightPalette={lamp:[c(0x14100a),c(0xffe6ae)],win:[c(0x0a0a10),c(0xffdf9e)],
      glass:[c(0x05060c),c(0x121a2c)],mirror:[c(0x0b0d12),c(0x2b3038)],
      indicator:[c(0x10251a),c(0x6fe09b)],sign:[c(0x2a2a2a),c(0xffffff)]};
  }
  const set=(mat,key)=>mat&&mat.color&&mat.color.copy(H._lightPalette[key][0]).lerp(H._lightPalette[key][1],t);
  set(M.lamp,'lamp'); set(M.win,'win'); set(M.glass,'glass'); set(M.mirror,'mirror'); set(M.indicator,'indicator');
  if(H.fixtureLights)H.fixtureLights.forEach(l=>{l.intensity=(l.userData.hotelBaseIntensity||.8)*t;});
  if(H.signMat)set(H.signMat,'sign');
}
function setLights(H,on){
  setLightLevel(H,on?1:0);
}
function updatePracticalLights(H,now,cam){
  if(!H||!H.fixtureLights||!cam||now<(H._lightCullAt||0))return;
  H._lightCullAt=now+250;
  H.fixtureLights.forEach(light=>{
    const floorOn=H.visibleFloors.indexOf(light.userData.hotelFloor)>=0;
    const near=Math.hypot(cam.x-light.position.x,cam.z-light.position.z)<36;
    light.visible=floorOn&&near&&(H.lightLevel===undefined||H.lightLevel>.02);
  });
}

/* Phase 2: จัดของในตู้จาก seed ร่วม โดย cabinetLetterSlot คือเลขตู้ 0..4 ที่มีตัวอักษร
   การจัดนี้เป็น scene consequence เท่านั้น; run/seed/slot ตัวจริงอยู่ใน HauntedHotelRuntime */
function configureSpecialWardrobes(H,cabinetLetterSlot,seed){
  if(!H || !H.specialWardrobes) return;
  const slot=Math.max(0,Math.min(H.specialWardrobes.length-1,Number(cabinetLetterSlot)||0));
  const types=['empty','photo','bundleA','bundleB'];
  let x=(Number(seed)>>>0)||1;
  const random=()=>{x=(x+0x6d2b79f5)>>>0;let t=x;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296;};
  for(let i=types.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[types[i],types[j]]=[types[j],types[i]];}
  types.splice(slot,0,'letter');
  H.specialWardrobes.forEach((W,i)=>{
    W.content=types[i]; W.open=false; W.done=false; W.t=0; W.letter=null;
    W.hingeL.rotation.y=0; W.hingeR.rotation.y=0;
    Object.keys(W.visuals).forEach(k=>W.visuals[k].visible=(k===W.content));
  });
}

/* ============================================================
   ⏱ อัปเดตทุกเฟรม: ลูกตาในรูปมองตาม · ลิฟต์วิ่ง · บานตู้เปิด
   ============================================================ */
const BLINK_DUR=140;             // ms กะพริบ 1 ครั้ง (หลับ-ลืมเร็ว เหมือนกะพริบตาจริง)
const BLINK_MIN=2200, BLINK_GAP=4200;   // ช่วงเวลาสุ่มระหว่างกะพริบ (ต่อกรอบ ไม่พร้อมกันหมด)
/* 🔴 รอบ 697: ตอนไฟดับ ตาทุกกรอบทั้งโรงแรมแดงวาบพร้อมกัน (H.eyeMat ใช้ร่วมทั้ง 30 กรอบ ต้นทุนแทบเป็นศูนย์) */
function tick(H,dt,now,cam){
  updateFloorVisibility(H,cam);
  updatePracticalLights(H,now,cam);
  /* ภาพชุดใหม่มีดวงตาจริงอยู่ในไฟล์แล้ว จึงไม่ทำตาแดงเรืองทับหน้า (ดูเป็นการ์ตูนและเสียความสมจริง) */
  if(H.funeralBulbs) H.funeralBulbs.forEach((b,i)=>{
    const pulse=.45+.55*Math.max(0,Math.sin(now*.008+b.phase));
    if(b.m)b.m.visible=H.visibleFloors.indexOf(2)>=0 && pulse>.54;
  });
  /* 🖼️ ลูกตามองตาม — เฉพาะรูปที่อยู่ใกล้และชั้นเดียวกัน (คุมงานต่อเฟรม)
     รูปหันไป local +Z → ระยะเยื้องซ้าย-ขวาของผู้เล่นในแกนรูป = face*(camX - รูปX)
     🐌 รอบ 697: เดิมตากระโดดไปตำแหน่งเป้าหมายทันที (สะดุดตา ดูเป็นกลไก) → lerp หน่วงให้เนียนเหมือนหันตามจริง */
  for(let i=0;i<H.portraits.length;i++){
    const P=H.portraits[i];
    const dy=Math.abs(P.py-cam.y), d=Math.hypot(cam.x-P.px,cam.z-P.pz);
    if(dy>2.4 || d>9){                               // ไกล/คนละชั้น → ตากลับมาตรง
      if(P.on){ P.e1.position.x=P.eyeLX; P.e2.position.x=P.eyeRX;
                P.e1.position.y=P.e2.position.y=P.eyeY; P.on=false;
                P.lat=0; P.ver=0; P.blinkT=0; P.e1.scale.y=P.e2.scale.y=P.eyeR; }
      continue;
    }
    P.on=true;
    /* 👁️ รอบ 778: กลอกตาตาม "มุมมอง" จริง แล้วคูณด้วยระยะกลอกสูงสุดของภาพใบนั้น (eyeMX/eyeMY)
       เดิมคิดจากระยะเยื้องตรง ๆ ×.02 แล้วตัดที่ ±.03 → เยื้องแค่ 1.5 ม. ก็ตันเต็มพิกัดแล้ว
       และ .03 ยังกว้างกว่าเบ้าตาจริง = ตาดำไปติดหางตาค้างไว้ ดูเหมือนมองของข้าง ๆ ไม่ใช่มองเรา */
    const off=P.face*(cam.x-P.px), nrm=Math.max(.9,Math.abs(cam.z-P.pz));
    const u=Math.max(-1,Math.min(1,Math.atan2(off,nrm)));            // ±57° = สุดขอบเบ้าตา
    const v=Math.max(-1,Math.min(1,Math.atan2(cam.y-P.py,Math.max(.9,d))*1.6));
    const targetLat=P.eyeMX*u, targetVer=P.eyeMY*v;
    const k=Math.min(1,dt*4.5);                      // อัตราหน่วง (frame-independent)
    P.lat+=(targetLat-P.lat)*k; P.ver+=(targetVer-P.ver)*k;
    P.e1.position.x=P.eyeLX+P.lat; P.e2.position.x=P.eyeRX+P.lat;
    P.e1.position.y=P.e2.position.y=P.eyeY+P.ver;
    // 😑 กะพริบตา — สุ่มจังหวะต่อกรอบ ไม่พร้อมกันทุกใบ (ดูมีชีวิตกว่าตากระพริบยกชุด)
    if(P.blinkT>0){
      P.blinkT-=dt*1000;
      const t=1-P.blinkT/BLINK_DUR, close=Math.max(0,1-Math.abs(t-.5)*2);
      P.e1.scale.y=P.e2.scale.y=P.eyeR*(1-close*.92);
    }else if(now>=P.blinkAt){
      P.blinkT=BLINK_DUR; P.blinkAt=now+BLINK_MIN+Math.random()*BLINK_GAP;
    }
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
    if(W.interactive===false) continue;
    if(Math.abs(W.y-y)>1.6) continue;
    const d=Math.hypot(W.x-x,W.z-z);
    if(d<bd){ bd=d; best=W; }
  }
  return best;
}
function nearFuneral(H,x,z,y,dist){
  if(!H || !H.funeral || Math.abs(H.funeral.y-y)>1.6) return false;
  return Math.hypot(H.funeral.x-x,H.funeral.z-z)<(dist||6.5);
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

return { build, surfaceY, collide, setLights, setLightLevel, tick, roomAt, nearWardrobe, inLift, atLiftDoor,
         randomHaunt, insideHotel, floorOf, floorY, nearFuneral, configureSpecialWardrobes, updateFloorVisibility,
         letterPlacementPool, validateLetterPlacementPool, LETTER_PLACEMENT_VERSION,
         FLOOR_H, FLOORS, BX, BZ, CZ, WEST, CORE_E, SHAFT_E, ENTRY_HW, PLAYER_R,
         HOTEL_LENGTH_SCALE, WORLD_X_MIN, WORLD_X_MAX };
})();
