"use strict";
/* ============================================================
   UI: Dashboard / ร้านค้า / ที่พัก / ร้านสัตว์เลี้ยง / แรงค์ / สถิติ
   ============================================================ */

/* ---- สถานะการ์ดโรงงานผลิต (ในหน่วยความจำ ไม่ต้องเซฟ) ---- */
let factoryCat = 'all';         // ตัวกรองหมวดสินค้าในแคตตาล็อกโรงงาน ('all' | id หมวด)

/* ---------- ภาพเริ่มต้น (ตะกร้า/ไข่ วาดด้วย CSS ถ้าไม่มีภาพเจน) ---------- */
function startHTML(key){
  const p = PETS[key];
  if(p.startKey === 'egg'){
    const inner = p.decals.map((d,i)=>`<span class="decal d${i+1}">${d}</span>`).join('');
    return `<div class="egg ${p.eggClass}">${inner}</div>`;
  }
  return `<div class="basket ${p.eggClass}">
    <span class="ear ear-l"></span><span class="ear ear-r"></span>
    <div class="sleep-head"></div>
    <div class="blanket"></div>
    <div class="basket-body"></div>
    <span class="zzz">💤</span>
  </div>`;
}

/* 🐾 สไปรต์เดินวนลูป (พื้นหลังโปร่ง) — "อบ" จากโมเดล 3D ล่วงหน้าด้วย tools/bake_sprite.html
   แผ่นเป็นแถวเดียว (frames ช่องเรียงกัน) เล่นด้วย CSS steps() → ไม่ต้องโหลด three.js/glb ในล็อบบี้
   ⚠️ ไฟล์ img/anim/*.webp ต้อง commit ไม่งั้นไม่ขึ้นเว็บ (deploy ใช้ git archive HEAD) */
// roam:false = ท่าในไฟล์เป็น "ยืนอยู่กับที่" (ไม่ใช่ท่าเดิน) → ห้ามสั่งให้เลื่อนไปมา ไม่งั้นดูเหมือนไถลข้าง
// flip:true = สไปรต์อบมาหันขวา (ตรงข้ามค่ามาตรฐาน "หันซ้าย") → พลิกกลับให้หันซ้ายเหมือนตัวอื่น ไม่งั้น moonwalk
const PET_ANIM = {
  cat:    { file:'img/anim/pet_cat_walk.webp',    frames:24, fw:172, fh:172, fps:14, roam:true  },
  dog:    { file:'img/anim/pet_dog_walk.webp',    frames:24, fw:127, fh:165, fps:14, roam:true, flip:true },
  dragon: { file:'img/anim/pet_dragon_idle.webp', frames:24, fw:147, fh:139, fps:12, roam:true  },
};
function petAnimHTML(p){
  const a = PET_ANIM[p.type];
  // ใช้เฉพาะร่างโตปกติ — ป่วย/หลับมีป้ายบอกสถานะของมันเอง (ยังใช้ภาพนิ่งเดิม) · ไข่/เด็กยังไม่มีสไปรต์
  if(!a || petStage(p) !== 'adult' || p.sick || p.sleeping) return '';
  const dur = (a.frames / a.fps).toFixed(2);
  // --bpx: ตำแหน่งเฟรมสุดท้ายเป็น % — สูตร 100*frames/(frames-1) เพราะ % ของ background-position
  // วัดจากช่วง (ความกว้างภาพ - ความกว้างกล่อง) ไม่ใช่ความกว้างภาพ · ใส่ผิด = เฟรมเลื่อนเพี้ยนทั้งลูป
  const bpx = (100 * a.frames / (a.frames - 1)).toFixed(3);
  return `<div class="pet-roam${a.roam === false ? ' no-roam' : ''}"><div class="pet-anim" style="`
    + `aspect-ratio:${a.fw}/${a.fh};background-image:url('${a.file}');`
    + `background-size:${a.frames * 100}% 100%;--bpx:${bpx}%;`
    + `${a.flip ? 'transform:scaleX(-1);' : ''}`
    + `animation:petWalk ${dur}s steps(${a.frames}) infinite"></div></div>`;
}

function petVisualHTML(p){
  const conf = PETS[p.type];
  const stage = petStage(p);
  const imgUrl = currentPetImg(p);
  let core, overlays = '';
  const anim = petAnimHTML(p);
  if(anim){
    core = anim;
  }else if(imgUrl){
    core = `<img class="pet-img" src="${imgUrl}" alt="${conf.name}">`;
  }else if(stage === 'egg'){
    core = startHTML(p.type);
  }else{
    core = `<span class="pet-emoji">${conf[stage]}</span>`;
    const worn = equippedItem(p);
    if(worn) overlays += `<span class="wear wear-${worn.slot}">${worn.emoji}</span>`;
    if(p.sick) overlays += `<span class="sick-badge">🤒</span>`;
    else if(p.sleeping) overlays += `<span class="sick-badge sleep-badge">💤</span>`;
  }
  // ดาววิบวับ ✨ รอบตัว — เอาออกตอนเป็นสไปรต์อบ (ผู้ใช้: ดูไม่มืออาชีพ) · คงไว้เฉพาะภาพนิ่งร่างโต
  const auraHTML = (stage === 'adult' && !p.sick && !anim)
    ? `<div class="aura"><span class="sparkle sp1">✨</span><span class="sparkle sp2">✨</span><span class="sparkle sp3">✨</span></div>`
    : '';
  // pet-stage-anim: สไปรต์อบไม่ได้ผ่าน footAlign (ต่างจาก .pet-img) + กรอบ flex โดน padding เวทีดันขึ้น
  // → เท้าลอยสูงกว่าตัวละครเด็ก ต้องดึงลงด้วย CSS (--anim-drop) ให้ยืนพื้นเดียวกัน
  return `<div class="pet-stage${anim ? ' pet-stage-anim' : ''}">${auraHTML}<div class="pet-wrap" id="pet-tap">${core}${overlays}</div></div>`;
}

/* ============================================================
   🎬 เวทีน้องน่ารัก (Cute Pet Show) — รอบ 604 (ผู้ใช้สั่ง 26 ก.ค. 2026)
   ------------------------------------------------------------
   เดิมกลางล็อบบี้ = เหรียญแรงค์ยักษ์เป็นฉากหลัง + สไปรต์อบ 3D เดินไปมา (petVisualHTML/petAnimHTML)
   ใหม่ = "คลิปสั้นวนลูป" ของน้องสไตล์การ์ตูนญี่ปุ่น ทำครบทั้ง หมา/แมว/มังกร
     · ตัวละคร = ภาพต้นแบบใน img/ ตามช่วงวัยจริง (<pet>_newborn / _baby_normal / _adult_normal
       — ผ่าน currentPetImg() จึงยังเปลี่ยนตามป่วย/หิว/ชุดที่ใส่เหมือนเดิม)
     · แอนิเมชันเป็น CSS ล้วน 9 วิ/ลูป: หายใจ → กระโดด 2 ที → จังหวะดีใจ (สลับเฟรมเป็นภาพ _happy
       = 2 เฟรมแบบ GIF) + หัวใจ/โน้ตลอย → หันตัวกลับ  (ไม่มีไฟล์ gif/วิดีโอใหม่ → เบา ใช้ออฟไลน์ได้)
     · ฉากหลังต่อชนิด: หมา=ทุ่งหญ้ากลางวัน · แมว=ซากุระยามเย็น · มังกร=ฟ้าสนธยา+ประกายไฟ
     · แตะแท็บสัตว์ตัวไหน = renderDashboard วาดใหม่ตาม activePet() → โชว์ตัวนั้นทันที
   ป่วย/หลับ/ยังเป็นไข่ = โหมด ps-calm (ไม่กระโดด ไม่มีหัวใจ) ให้ตรงกับอารมณ์น้อง
   ============================================================ */
const PET_SHOW = {
  dog:    { bg:'img/bond/bond_dog.webp',    fall:['🌼','🍃','⭐','🐾'] },
  cat:    { bg:'img/bond/bond_cat.webp',    fall:['🌸','💕','✨','🐾'] },
  dragon: { bg:'img/bond/bond_dragon.webp', fall:['✨','🔥','💎','⭐'] },
};
const PET_SHOW_STAGE = {egg:'👶 แรกเกิด', baby:'🍼 ร่างเด็ก', adult:'🌟 ร่างโตเต็มวัย'};
// ความสูงน้องบนเวทีโชว์ = % ของกรอบเวที (CSS ตัดด้วย 66cqw อีกชั้น กันล้นจอแคบ)
// 🦣 รอบ 659: เดิมมีหลายระดับตามโหมดขยายร่าง (ถอดออกแล้ว) — เหลือค่าเดียวคงที่
const PET_SHOW_H = 64;

/* ฉากหลังการ์ตูน (อยู่หลัง .hero-scene ทั้งใบ — ยังเห็นตอนเกมสะกดคำเปิดฉาก 3D ทับ) */
function petShowBgHTML(p){
  /* สัตว์ใหม่เพิ่ม bond:{bg,fall} ใน PETS ได้เลย; ถ้ายังไม่ใส่จะได้ฉากกลางที่อ่านง่าย
     ไม่แอบยืมฉากหมา เพราะจะทำให้ชนิดใหม่ดูเหมือนเป็นหมา */
  const petCf = PETS[p.type] || {};
  const bondCf = petCf.bond || {};
  const cf = PET_SHOW[p.type] || {};
  const bg = bondCf.bg || cf.bg || '';
  const falls = bondCf.fall || cf.fall || ['✨','💛','🍃','🐾'];
  // ตำแหน่ง/จังหวะกลีบดอกไม้ deterministic ต่อชนิดสัตว์ (render ซ้ำแล้วไม่วูบวาบย้ายที่)
  let s = p.type.charCodeAt(0)*37 + 11, fall = '';
  const rnd = ()=>{ s = (s*16807) % 2147483647; return s/2147483647; };
  for(let i=0;i<11;i++){
    fall += `<span style="left:${(3+rnd()*94).toFixed(1)}%;font-size:${(9+rnd()*12).toFixed(0)}px;`
      + `animation-delay:${(rnd()*9).toFixed(2)}s;animation-duration:${(7.5+rnd()*6).toFixed(2)}s">`
      + `${falls[i % falls.length]}</span>`;
  }
  /* 🌙 รอบ 678: ฉากกลางคืน (ฟ้ามืด/พระจันทร์/ดาว) — สีทั้งชุดสลับใน css/lobby.css
     🕗 รอบ 680: กลางคืนตาม "นาฬิกาเครื่องผู้เล่นจริง" ด้วย (isNightNow() = 20:00-06:00 ช่วงเดียวกับเวลานอนน้อง)
        → น้องหลับ **หรือ** ถึงเวลากลางคืน = ฉากมืด · สลับเองภายใน 1 นาที (tick เรียก renderDashboard อยู่แล้ว) */
  const night = p.sleeping || (typeof isNightNow === 'function' && isNightNow());
  /* ✨ รอบ 680: หิ่งห้อยเรี่ยพื้น + ดาวตกพาดฟ้าเป็นครั้งคราว (เฉพาะกลางคืน)
     ใช้ rnd() ตัวเดิม = ตำแหน่งคงที่ต่อชนิดสัตว์ วาดใหม่แล้วไม่วูบวาบย้ายที่ */
  let fx = '';
  if(night){
    for(let i=0;i<7;i++){
      fx += `<span class="ps-firefly" style="left:${(6+rnd()*88).toFixed(1)}%;top:${(56+rnd()*30).toFixed(1)}%;`
        + `animation-delay:-${(rnd()*9).toFixed(2)}s;animation-duration:${(7+rnd()*5).toFixed(2)}s"></span>`;
    }
    // ดาวตก 2 ดวง คนละมุมฟ้า + เหลื่อมเวลากันมาก → เห็นทีละดวง นาน ๆ ครั้ง
    fx += `<span class="ps-shoot s1"></span><span class="ps-shoot s2"></span>`;
  }
  return `<div class="pet-show-bg ps-${p.type}${bg ? ' ps-generated' : ' ps-generic'}${night ? ' ps-night' : ''}">
    ${bg ? `<img class="ps-generated-bg" src="${bg}" alt="" aria-hidden="true">` : ''}
    <div class="ps-sun"></div>
    <div class="ps-cloud c1"></div><div class="ps-cloud c2"></div><div class="ps-cloud c3"></div>
    <div class="ps-hill h1"></div><div class="ps-hill h2"></div>
    <div class="ps-ground"></div>
    <div class="ps-fall">${fall}</div>
    ${night ? `<div class="ps-night-fx">${fx}</div>` : ''}
    <div class="ps-vig"></div>
  </div>`;
}

/* ============================================================
   🏡💞 PET BOND SCENE รอบ 1152 — ผู้เล่น + บ้านจริง + น้องในฉากเดียว
   ------------------------------------------------------------
   บ้าน/ผู้เลี้ยง/ชุดอ่านจาก state ทุกครั้งที่ render จึงไม่เป็นภาพตายตัว:
   · อัปเกรดบ้าน/ไฟดับ/น้ำถูกตัด/บ้านทรุด = ภาพเปลี่ยนทันที
   · เครื่องประดับและเสื้อผ้า slot ใหม่ = อ่านผ่าน equippedItem() แบบ data-driven
   · สัตว์ใหม่ไม่มีข้อความเฉพาะ = ใช้ข้อความกลางอย่างปลอดภัย; เพิ่ม PETS[type].bond.lines ได้ภายหลัง
   ============================================================ */
function petBondLine(p, h, worn){
  const n = escapeHTML(p.name || (PETS[p.type] || {}).name || 'น้อง');
  if(p.sick) return {lead:`${n}อยากให้หนูอยู่ข้าง ๆ`, sub:'หนูไม่สบาย…ลูบหัวเบา ๆ แล้วพาไปรักษานะ'};
  if(p.sleeping) return {lead:`ฝันดีนะ ${n}`, sub:h ? 'บ้านของเราอุ่นและปลอดภัยจังเลย' : 'คืนนี้อยู่ใกล้ ๆ กันนะ หนูจะไม่ทิ้งน้อง'};
  if(typeof petHungry === 'function' && petHungry(p)) return {lead:`${n}ท้องร้องแล้ว`, sub:'กินข้าวด้วยกันนะ แล้วน้องจะมีแรงมาเล่นกับหนู'};
  if(!h) return {lead:`${n}อยากมีมุมปลอดภัย`, sub:'บ้านหลังแรกจะช่วยให้น้องไม่ต้องตากแดดตากฝน'};
  if(typeof homeDecayed === 'function' && homeDecayed()) return {lead:`${n}ยังรักบ้านหลังนี้นะ`, sub:'ช่วยซ่อมและจ่ายค่าบำรุง แล้วบ้านของเราจะอบอุ่นอีกครั้ง'};
  if(state.powerCut) return {lead:`${n}มองหาหนูในบ้านมืด ๆ`, sub:'ช่วยเปิดไฟให้บ้านกลับมาสว่างและเย็นสบายอีกครั้งนะ'};
  if(state.waterCut) return {lead:`${n}อยากให้บ้านมีน้ำอีกครั้ง`, sub:'มีน้ำสะอาดแล้วน้องจะสดชื่นและแข็งแรงขึ้น'};
  if(worn) return {lead:`${n}ชอบ${escapeHTML(worn.name)}มาก!`, sub:`ขอบคุณที่แต่งตัวให้น้องนะ ${worn.emoji || '💖'} มาเล่นด้วยกันเถอะ`};
  const custom = (((PETS[p.type] || {}).bond || {}).lines || {})[h.id];
  if(custom) return {lead:escapeHTML(custom.lead || `${n}รักบ้านของเรา`), sub:escapeHTML(custom.sub || 'อยู่กับหนูแล้วน้องอุ่นใจที่สุด')};
  const typed = {
    dog:    {lead:`${n}รอหนูกลับบ้านทุกวัน`, sub:'แตะน้องหน่อยนะ หางสั่นรออยู่แล้ว!'},
    cat:    {lead:`${n}เลือกมุมโปรดในบ้านแล้ว`, sub:'มานั่งข้างกันสักพักนะ เหมียว~'},
    dragon: {lead:`${n}จะเฝ้าบ้านให้หนูเอง`, sub:'บ้านยิ่งดี น้องยิ่งมีแรงออกผจญภัยไปด้วยกัน!'},
  }[p.type];
  return typed || {lead:`${n}รักบ้านของเรา`, sub:'แตะน้องเพื่อทักทาย แล้วอยู่ด้วยกันสักครู่นะ'};
}

/* 💛🔬 รอบ 1152: คลังคำห่วงใยเชิงวิทยาศาสตร์สุขภาพสำหรับเด็ก
   อิงหลักทั่วไปจาก WHO / CDC / NIH และตั้งใจไม่ใส่ตัวเลขเฉพาะบุคคล
   (ปริมาณน้ำ อาหาร และการนอนที่เหมาะสมต่างกันตามวัย/กิจกรรม/สุขภาพ)
   เก็บหลายหมวดและหมุนวนโดยไม่ซ้ำติดกัน เพื่อให้น้องสอนได้หลากหลายอย่างเป็นธรรมชาติ */
const PET_HEALTH_TIPS = Object.freeze([
  {lead:'อย่าลืมจิบน้ำนะ', sub:'น้ำช่วยควบคุมอุณหภูมิ และพาของเสียออกจากร่างกาย'},
  {lead:'เล่นหรือวิ่งแล้วพักดื่มน้ำด้วยนะ', sub:'ตอนเคลื่อนไหวร่างกายเสียเหงื่อ จึงต้องเติมน้ำกลับเข้าไป'},
  {lead:'ถ้ากระหาย เลือกน้ำเปล่าก่อนนะ', sub:'น้ำไม่มีน้ำตาล จึงดีต่อฟันและไม่เพิ่มพลังงานเกินจำเป็น'},
  {lead:'อากาศร้อนต้องใส่ใจน้ำมากขึ้นนะ', sub:'น้ำช่วยให้ร่างกายระบายความร้อนและทำงานเป็นปกติ'},
  {lead:'อย่ากินเค็มจัดบ่อย ๆ นะ', sub:'โซเดียมมากทำให้ความดันสูงขึ้น และทำให้หัวใจกับไตทำงานหนัก'},
  {lead:'ขนมกรุบกรอบกินแต่น้อยนะ', sub:'อาหารแปรรูปหลายชนิดมีโซเดียมซ่อนอยู่ แม้เราไม่ได้เติมเกลือ'},
  {lead:'ลองชิมก่อนเติมน้ำปลาหรือซอสนะ', sub:'เครื่องปรุงเค็มมีโซเดียม การเติมน้อยลงช่วยดูแลความดัน'},
  {lead:'กินหวานแต่พอดีนะ', sub:'น้ำตาลที่มากเกินไปเพิ่มโอกาสฟันผุและพลังงานเกิน'},
  {lead:'น้ำหวานไม่ควรแทนน้ำเปล่านะ', sub:'เครื่องดื่มหวานเติมน้ำตาลได้มาก แต่ทำให้อิ่มสารอาหารน้อย'},
  {lead:'กินขนมแล้วดูแลฟันด้วยนะ', sub:'แบคทีเรียเปลี่ยนน้ำตาลเป็นกรด ซึ่งค่อย ๆ ทำลายผิวฟัน'},
  {lead:'แปรงฟันเช้าและก่อนนอนนะ', sub:'ยาสีฟันฟลูออไรด์ช่วยให้ผิวฟันแข็งแรงและลดฟันผุ'},
  {lead:'อย่าใช้แปรงสีฟันร่วมกับคนอื่นนะ', sub:'เชื้อโรคจากน้ำลายอาจติดไปกับขนแปรงได้'},
  {lead:'เพิ่มผักกับผลไม้หลายสีดีไหม?', sub:'สีที่ต่างกันมักมาพร้อมวิตามิน แร่ธาตุ และใยอาหารที่ต่างกัน'},
  {lead:'ลองกินอาหารให้หลากหลายนะ', sub:'ไม่มีอาหารชนิดเดียวให้สารอาหารครบ ความหลากหลายช่วยให้ร่างกายเติบโต'},
  {lead:'เลือกธัญพืชไม่ขัดสีบ้างนะ', sub:'ใยอาหารช่วยระบบขับถ่าย และทำให้อิ่มได้นานขึ้น'},
  {lead:'ถั่วก็เป็นเพื่อนของร่างกายนะ', sub:'ถั่วให้โปรตีน ใยอาหาร และแร่ธาตุหลายชนิด'},
  {lead:'ล้างมือก่อนกินข้าวนะ', sub:'สบู่ช่วยพาเชื้อโรคและสิ่งสกปรกหลุดออกจากมือ'},
  {lead:'เข้าห้องน้ำแล้วล้างมือทุกครั้งนะ', sub:'มือสะอาดช่วยลดการส่งต่อเชื้อที่ทำให้ท้องเสียหรือหวัด'},
  {lead:'ไอหรือจามใส่ข้อพับแขนนะ', sub:'ละอองจะกระจายไปหาคนอื่นและติดมือของเราน้อยลง'},
  {lead:'อาหารสุกใหม่ปลอดภัยกว่านะ', sub:'ความร้อนที่ทั่วถึงช่วยลดเชื้อโรคหลายชนิดในอาหาร'},
  {lead:'คืนนี้นอนให้พอนะ', sub:'ระหว่างหลับ สมองจัดระเบียบความจำและร่างกายซ่อมแซมตัวเอง'},
  {lead:'เข้านอนเวลาใกล้เดิมทุกคืนดีไหม?', sub:'กิจวัตรสม่ำเสมอช่วยให้นาฬิกาชีวภาพรู้ว่าเมื่อไรควรพัก'},
  {lead:'พักสายตาจากจอบ้างนะ', sub:'ทุก 20 นาที มองไกลประมาณ 20 ฟุต 20 วินาที ช่วยลดความล้าของตา'},
  {lead:'อย่าจ้องดวงอาทิตย์ตรง ๆ นะ', sub:'แสงที่เข้มมากอาจทำอันตรายต่อจอประสาทตาได้'},
  {lead:'ออกแดดอย่าลืมหาที่ร่มนะ', sub:'หมวก เสื้อคลุม และครีมกันแดดช่วยลดรังสีอัลตราไวโอเลตที่ถึงผิว'},
  {lead:'ขยับตัวหรือเล่นให้หัวใจเต้นเร็วบ้างนะ', sub:'การเคลื่อนไหวช่วยให้หัวใจ ปอด กล้ามเนื้อ และกระดูกแข็งแรง'},
  {lead:'นั่งนานแล้วลุกยืดตัวกันนะ', sub:'การพักขยับสั้น ๆ ช่วยให้กล้ามเนื้อได้เปลี่ยนท่าและเลือดไหลเวียนดีขึ้น'},
  {lead:'ไปเดินเล่นกันสักหน่อยไหม?', sub:'การเคลื่อนไหวช่วยทั้งความจำ สมาธิ และอารมณ์'},
  {lead:'เล่นกีฬาใส่อุปกรณ์ป้องกันด้วยนะ', sub:'หมวกกันน็อกและอุปกรณ์ที่พอดีช่วยลดความรุนแรงเมื่อเกิดอุบัติเหตุ'},
  {lead:'ฟังเสียงไม่ต้องดังมากนะ', sub:'เสียงดังนาน ๆ ทำร้ายเซลล์รับเสียงในหู ซึ่งซ่อมแซมได้ยาก'},
  {lead:'รู้สึกหนักใจก็บอกผู้ใหญ่ที่ไว้ใจนะ', sub:'การพูดถึงความรู้สึกช่วยให้เราได้รับการดูแลและไม่ต้องรับมือคนเดียว'},
  {lead:'หายใจช้า ๆ ไปพร้อมกันไหม?', sub:'การผ่อนลมหายใจยาวช่วยให้ร่างกายค่อย ๆ ลดความตื่นตัว'},
]);
let __petHealthTipCursor = (()=>{
  try{ return Math.max(0, Number(localStorage.getItem('vwPetHealthTipCursor')) || 0); }
  catch(_){ return 0; }
})();
function nextPetHealthTip(p){
  const tip = PET_HEALTH_TIPS[__petHealthTipCursor % PET_HEALTH_TIPS.length];
  __petHealthTipCursor = (__petHealthTipCursor + 1) % PET_HEALTH_TIPS.length;
  try{ localStorage.setItem('vwPetHealthTipCursor', String(__petHealthTipCursor)); }catch(_){ }
  const n = escapeHTML(p.name || (PETS[p.type] || {}).name || 'น้อง');
  return {lead:`${n}เป็นห่วงนะ — ${tip.lead}`, sub:tip.sub};
}

function petBondActionLine(p, stateName){
  const n = escapeHTML(p.name || (PETS[p.type] || {}).name || 'น้อง');
  const typed = {
    dog: {
      cuddle:{lead:`${n}ขอซบหน่อยได้ไหม?`, sub:'ขออยู่ใกล้ ๆ หนูอีกนิดนะ หางน้องหยุดสั่นไม่ได้เลย!'},
    },
    cat: {
      cuddle:{lead:`${n}ขอคลอเคลียหน่อยนะ`, sub:'ลูบหัวให้น้องอีกนิดได้ไหม เหมียว~ น้องคิดถึงหนู'},
    },
    dragon: {
      cuddle:{lead:`${n}ตัวใหญ่แต่ก็อยากอ้อนนะ`, sub:'ขอกอดอุ่น ๆ หน่อย แล้วน้องจะพาหนูบินชมฟ้า!'},
    },
  }[p.type];
  if(typed && typed[stateName]) return typed[stateName];
  if(stateName === 'cuddle') return {lead:`${n}ขออยู่ใกล้หนูหน่อยนะ`, sub:'ลูบหัวให้น้องอีกนิดได้ไหม น้องคิดถึงหนู'};
  if(stateName === 'care') return nextPetHealthTip(p);
  return null;
}

const PET_BOND_TALK_MS = 60 * 1000;
const __petBondTalkSlots = new WeakMap();

function petBondTalkPriority(stateName){
  if(stateName === 'care') return 3;
  if(stateName === 'cuddle') return 2;
  return 1;
}

function updatePetBondTalk(card, p, stateName){
  const box = card && card.querySelector('.bond-talk'); if(!box) return;
  const h = typeof homeInfo === 'function' ? homeInfo(state.home) : null;
  const worn = typeof equippedItem === 'function' ? equippedItem(p) : null;
  const line = petBondActionLine(p, stateName) || petBondLine(p, h, worn);
  const lead = box.querySelector('b'), sub = box.querySelector('span'), note = box.querySelector('small');
  if(lead) lead.innerHTML = line.lead;
  if(sub) sub.innerHTML = line.sub;
  if(note) note.textContent = stateName === 'care' ? '🔬 เกร็ดวิทยาศาสตร์สุขภาพจากน้อง' : '💞 แตะตัวน้องเพื่อทักทาย';
  box.classList.toggle('is-cuddle', stateName === 'cuddle');
  box.classList.toggle('is-care', stateName === 'care');
}

function startPetBondTalkHold(card, p){
  if(!card) return;
  const previous = __petBondTalkSlots.get(card);
  if(previous && previous.timer) clearTimeout(previous.timer);
  // The message rendered with the card also deserves a full minute on screen.
  // renderDashboard reuses the same card element when switching pets, so replace
  // the whole slot to prevent a delayed line from the previously viewed pet.
  __petBondTalkSlots.set(card, {pet:p, nextAt:Date.now() + PET_BOND_TALK_MS, pendingState:'', timer:0});
}

function queuePetBondTalk(card, p, stateName){
  if(!card) return;
  let slot = __petBondTalkSlots.get(card);
  if(!slot || slot.pet !== p){
    startPetBondTalkHold(card, p);
    slot = __petBondTalkSlots.get(card);
  }
  if(!slot.pendingState || petBondTalkPriority(stateName) > petBondTalkPriority(slot.pendingState)){
    slot.pendingState = stateName;
  }
  if(slot.timer) return;
  slot.timer = setTimeout(()=>{
    slot.timer = 0;
    if(!card.isConnected || __petBondTalkSlots.get(card) !== slot || slot.pet !== p) return;
    const nextState = slot.pendingState || 'idle';
    slot.pendingState = '';
    updatePetBondTalk(card, p, nextState);
    slot.nextAt = Date.now() + PET_BOND_TALK_MS;
  }, Math.max(0, slot.nextAt - Date.now()));
}

function petBondContextHTML(p){
  const h = typeof homeInfo === 'function' ? homeInfo(state.home) : null;
  const worn = typeof equippedItem === 'function' ? equippedItem(p) : null;
  const line = petBondLine(p, h, worn);
  const decayed = !!(h && typeof homeDecayed === 'function' && homeDecayed());
  const homeArt = h
    ? homeVisualHTML(h, 'bond-home-img', decayed, !!state.powerCut, !!state.waterCut)
    : `<span class="bond-home-empty" aria-hidden="true">🏕️</span>`;
  const homeName = h ? `${h.emoji} ${h.name}` : '🌳 ยังไม่มีบ้านให้น้อง';
  const homeStatus = !h ? 'น้องยังต้องอยู่กลางแจ้ง'
    : decayed ? 'บ้านทรุดโทรม — น้องกำลังรอหนูดูแล'
    : state.powerCut ? 'บ้านไฟดับ — น้องต้องการแสงสว่าง'
    : state.waterCut ? 'บ้านไม่มีน้ำ — น้องต้องการน้ำสะอาด'
    : h.id === 'castle' ? 'บ้านที่ดีที่สุดของน้องแล้ว!'
    : 'อัปเกรดแล้วน้องจะสบายขึ้น';
  const gear = worn
    ? `<span class="bond-gear worn">${worn.emoji || '🎀'} กำลังใส่ <b>${escapeHTML(worn.name)}</b></span>`
    : `<span class="bond-gear">🎀 เลือกเครื่องประดับหรือเสื้อผ้าให้น้องได้</span>`;
  return `<div class="bond-context" data-bond-pet="${escapeHTML(p.type)}">
    <div class="bond-owner" aria-label="ตัวละครผู้เลี้ยงของหนู">
      <span class="bond-owner-heart" aria-hidden="true">💛</span>
      <img src="img/blocks/${lobbyBlk()}.png" alt="ตัวละครผู้เลี้ยงของหนู">
    </div>
    <div class="bond-talk" aria-live="polite">
      <b>${line.lead}</b><span>${line.sub}</span><small>💞 แตะตัวน้องเพื่อทักทาย</small>
    </div>
    <button class="bond-home-card" id="btn-bond-home" type="button" title="ดูบ้านและอัปเกรดบ้านให้น้อง">
      <span class="bond-home-art">${homeArt}</span>
      <span class="bond-home-copy"><b>${escapeHTML(homeName)}</b><small>${escapeHTML(homeStatus)}</small></span>
      <span class="bond-home-go">${h && h.id === 'castle' ? '🏰 บ้านของเรา' : '⬆️ ดูและอัปเกรด'}</span>
    </button>
    ${gear}
  </div>`;
}

/* 🩹 รอบ 607: "เข้าโหมดคลิปได้หรือยัง" — เข้าเมื่อ **โหลดคลิปนั้นสำเร็จแล้วในหน้านี้** เท่านั้น
   เดิมสลับเข้าโหมดคลิปทันทีที่วาดจอ (ทั้งที่ readyState=0) → เน็ตช้าเด็กเห็น "กรอบดำว่าง" นานหลายวินาที
   หรือค้างถาวรถ้าเน็ตหลุด · ตอนนี้: ยังโหลดไม่เสร็จ = โชว์ฉากการ์ตูน+ภาพน้องไปก่อน แล้วค่อยเฟดเข้าคลิป
   (โหลดสำเร็จรอบแรกแล้ว ครั้งต่อ ๆ ไปเข้าโหมดคลิปทันที — ไฟล์อยู่ในแคชเบราว์เซอร์ ไม่มีจอวูบ) */
/* 💬 รอบ 608: "ทำไมคลิปไม่ขึ้น" — บอกเหตุผลบนจอเลย (ผู้ใช้แจ้งว่าไม่เห็นคลิป แต่เว็บจริงเทสต์แล้วเล่นได้
   → เงื่อนไขที่ทำให้ไม่เล่นมีหลายทางและ "เงียบ" หมด เด็ก/ครูเลยไม่รู้ว่าต้องทำอะไร)
   ป้ายนี้หายเองทันทีที่คลิปเล่นได้ (CSS ซ่อนใน .ps-clip-mode) */
function petClipHint(p, clipUrl){
  if(clipUrl) return '⏳ กำลังโหลดคลิปน้อง…';
  if(state.noAnim) return '🎬 เปิด "เอฟเฟกต์เคลื่อนไหว" ในตั้งค่า ⚙️ เพื่อดูคลิปน้อง';
  if(p.sick)     return '🤒 น้องป่วยอยู่ — รักษาให้หายแล้วคลิปจะกลับมา';
  if(p.sleeping) return '💤 น้องหลับอยู่ — ตื่นแล้วคลิปจะกลับมา';
  if(typeof petHungry === 'function' && petHungry(p)) return '😫 น้องหิว — ป้อนข้าวให้อิ่มแล้วคลิปจะกลับมา';
  if(state.psDress && typeof equippedItem === 'function' && equippedItem(p)) return '';   // เลือกดูชุดเอง — ปุ่มสลับบอกอยู่แล้ว
  const k = petClipKey(p);
  if(k && CLIP_FILES[k] === null) return '🎬 ยังไม่มีคลิปของวัยนี้';
  return '';
}

function __clipReady(p){
  const url = petClipUrl(p); if(!url) return false;
  const k = petClipKey(p);
  return !!(k && CLIP_FILES[k]);
}

/* 🐾 รอบ 1024: ภาพต่อเนื่อง 6 เฟรมจาก img/animation/ ถูกครอป+บีบเป็น WebP แถวเดียว
   ใช้เป็นฉากสำรองหน้า lobby เมื่อคลิปยังไม่พร้อม — โหลดเพียงชุดของสัตว์ที่กำลังแสดง */
const PET_SHOW_SEQ = {
  cat: {
    baby:  { file:'img/anim/pet_cat_baby_happy.webp',  frames:6, fw:275, fh:364, fps:6 },
    adult: { file:'img/anim/pet_cat_adult_happy.webp', frames:6, fw:341, fh:346, fps:6 },
  },
  dog: {
    baby:  { file:'img/anim/pet_dog_baby_happy.webp',  frames:6, fw:355, fh:361, fps:6 },
    adult: { file:'img/anim/pet_dog_adult_happy.webp', frames:6, fw:331, fh:357, fps:6 },
  },
  dragon: {
    baby:  { file:'img/anim/pet_dragon_baby_happy.webp',  frames:6, fw:313, fh:369, fps:6 },
    adult: { file:'img/anim/pet_dragon_adult_happy.webp', frames:6, fw:340, fh:351, fps:6 },
  },
};

function petShowSeqHTML(p, stage, base, wearOv){
  const a = PET_SHOW_SEQ[p.type] && PET_SHOW_SEQ[p.type][stage];
  const worn = (typeof equippedItem === 'function') ? equippedItem(p) : null;
  const shaped = stage === 'adult' && p.shape && p.shape !== 'normal';
  const hungry = typeof petHungry === 'function' && petHungry(p);
  if(!a || !base || wearOv || worn || shaped || state.noAnim || p.sick || p.sleeping || hungry) return '';
  const dur = (a.frames / a.fps).toFixed(2);
  const bpx = (100 * a.frames / (a.frames - 1)).toFixed(3);
  return `<span class="ps-seq-wrap ps-fr" style="aspect-ratio:${a.fw}/${a.fh}">`
    + `<img class="pet-img ps-seq-fallback" src="${base}" alt="${escapeHTML(p.name)}">`
    + `<span class="ps-seq" aria-hidden="true" style="background-image:url('${a.file}');`
    + `background-size:${a.frames * 100}% 100%;--ps-seq-end:${bpx}%;`
    + `animation-duration:${dur}s;--ps-seq-steps:${a.frames}"></span>`
    + `<img class="ps-seq-probe" src="${a.file}" alt="" aria-hidden="true" `
    + `onload="this.parentElement.classList.add('ready')"></span>`;
}

/* เครื่องประดับ/เสื้อผ้าอยู่บนตัวจริงระหว่างแอนิเมชัน:
   ใช้ภาพ pose ปกติ + pose ดีใจ แล้วตัดชิ้นชุดเดิมซ้อนตาม anchor ของแต่ละ pose
   จึง crossfade ได้เนียนโดยชุดไม่ลอย และสัตว์/slot ใหม่ใช้กลไกเดียวกันเมื่อมี WEAR_* metadata */
function petOutfitMotionHTML(p, stage){
  const worn = (typeof equippedItem === 'function') ? equippedItem(p) : null;
  if(!worn || stage === 'egg') return '';
  const shaped = stage === 'adult' && p.shape && p.shape !== 'normal';
  const poseA = (shaped && IMG_FILES[`${p.type}_adult_${p.shape}`])
    || IMG_FILES[`${p.type}_${stage}_normal`] || null;
  const poseB = IMG_FILES[`${p.type}_${stage}_happy`] || null;
  const wearA = poseA ? petWearOverlay(p, poseA) : null;
  const wearB = poseB ? petWearOverlay(p, poseB) : null;
  if(!poseA || !wearA) return '';                       // ไม่มีชิ้นชุด/anchor → ใช้ภาพชุดสำเร็จรูปด้านล่าง
  const frame = (src, ov, cls)=>`<span class="ps-cartoon-frame ${cls}">`
    + `<span class="pet-wear"><img class="pet-img" src="${src}" alt="${escapeHTML(p.name)}">${wearLayerHTML(ov)}</span></span>`;
  return `<span class="ps-cartoon-stack ps-fr">${frame(poseA, wearA, 'cf-a')}`
    + `${poseB && wearB ? frame(poseB, wearB, 'cf-b') : ''}</span>`;
}

/* ตัวน้อง + ท่าเล่นในคลิป (คลาส .pet-stage / id #pet-tap คงเดิม —
   ระบบเก่ายังยึดไว้ใช้: applyPatRemindGlow, heartsFx, cureCelebrateFx, bindPetTap) */
function petShowHTML(p, clipUrl){
  const stage = petStage(p);
  const base  = currentPetImg(p);                               // ภาพช่วงวัยจริงใน img/
  /* 🎀 รอบ 666: ซ้อนชุดที่ใส่ลงบนภาพท่านี้ (รูปร่าง/ป่วย/หิว) — เห็นทั้งสองอย่างในภาพเดียว
     ⚠️ ตอนซ้อนชุดต้องเหลือเฟรมเดียว: เฟรม "ดีใจ" เป็นคนละท่า หมุดชุดคนละที่ สลับแล้วชุดจะลอย */
  const wearOv = petWearOverlay(p, base);
  // เฟรมที่ 2 ของคลิป = ภาพ "ดีใจ" ของวัยเดียวกัน (มีไฟล์ถึงใช้ · ไม่มีก็เล่นเฟรมเดียว)
  const hungry = petHungry(p);
  const happy = (!wearOv && stage !== 'egg' && !p.sick && !p.sleeping && !hungry) ? IMG_FILES[`${p.type}_${stage}_happy`] : null;
  const calm  = !!(p.sick || p.sleeping || hungry || stage === 'egg');
  const badge = p.sick ? '🤒' : (p.sleeping ? '💤' : (hungry ? '😫' : ''));
  const outfitMotion = calm ? '' : petOutfitMotionHTML(p, stage);
  const seq = outfitMotion ? '' : petShowSeqHTML(p, stage, base, wearOv);
  const core = outfitMotion || seq || (base
    ? (wearOv
        ? `<span class="pet-wear ps-fr"><img class="pet-img" src="${base}" alt="${escapeHTML(p.name)}">${wearLayerHTML(wearOv)}</span>`
        : `<img class="pet-img ps-fr" src="${base}" alt="${escapeHTML(p.name)}">`
          + (happy && happy !== base ? `<img class="pet-img ps-fr ps-f2" src="${happy}" alt="">` : ''))
    : `<span class="pet-emoji">${(PETS[p.type] || {})[stage] || '🐾'}</span>`);
  /* 🎬 รอบ 605: มีคลิปวิดีโอของวัยนี้ = เล่นเต็มกรอบเวที (คลิปมีฉากในตัวเอง พื้นหลังดำ)
     ภาพนิ่ง+ฉากการ์ตูนยังวาดไว้ข้างใต้เสมอ — คลิปโหลดไม่ได้/ออฟไลน์ ถอด ps-clip-mode แล้วเห็นของเดิมทันที
     ⚠️ .ps-pod ต้องอยู่เสมอ (แม้โปร่งใส) เพราะ #pet-tap / heartsFx / applyPatRemindGlow ยึดไว้ */
  const video = clipUrl
    ? `<video class="ps-video" src="${clipUrl}" autoplay muted playsinline preload="auto" disablepictureinpicture></video>`
    : '';
  return `<div class="pet-show${calm ? ' ps-calm' : ''}${p.sleeping ? ' ps-sleep' : ''}${seq ? ' ps-seq-mode' : ''}${outfitMotion ? ' ps-cartoon-mode' : ''}">
    ${video}
    <div class="pet-stage ps-pod">
      <div class="ps-travel">
        <div class="ps-shadow"></div>
        <div class="ps-jump">
          <div class="pet-wrap" id="pet-tap">
            <div class="ps-body">${core}</div>
            ${calm ? '' : `<span class="ps-emote e1">💕</span><span class="ps-emote e2">🎵</span><span class="ps-emote e3">✨</span>`}
            ${badge ? `<span class="ps-badge">${badge}</span>` : ''}
          </div>
        </div>
      </div>
    </div>
    <div class="ps-tag"><b>${escapeHTML(p.name)}</b> · ${PET_SHOW_STAGE[stage] || ''}<span class="ps-behavior-state">${state.noAnim ? '⏸ ปิดเอฟเฟกต์' : '🐾 กำลังเริ่มขยับ…'}</span></div>
    ${(()=>{ const h = petClipHint(p, clipUrl); return h ? `<div class="ps-hint">${h}</div>` : ''; })()}
    <button class="ps-play" type="button">▶️ แตะเพื่อเล่นคลิปน้อง</button>
    ${(()=>{   // 🎀 รอบ 609: ใส่ชุดอยู่ = เลือกได้ว่าจะดูคลิป หรือดูน้องใส่ชุด
      const worn = (typeof equippedItem === 'function') ? equippedItem(p) : null;
      if(!worn || calm) return '';
      return `<button class="ps-dress" type="button" title="สลับระหว่างคลิปน้องกับภาพน้องใส่ชุด">`
        + (state.psDress ? `🎬 ดูคลิปน้อง` : `${worn.emoji || '🎀'} ดูน้องใส่ชุด`) + `</button>`;
    })()}
    ${(()=>{   /* 🎀 รอบ 666: ป้ายเล็ก "ชุดที่ใส่อยู่" กลางขวาเวที (แบบเดียวกับหน้าข้อมูลน้อง รอบ 661)
                  โผล่ทุกครั้งที่ชุดถูกอย่างอื่นบัง (คลิป/ร่างล่ำ-อ้วน-ผอม/ป่วย/หิว) → เด็กเห็นว่าชุดยังอยู่ ไม่ต้องกดปุ่มก่อน */
      if(stage === 'egg') return '';
      const worn = (typeof equippedItem === 'function') ? equippedItem(p) : null;
      if(!worn) return '';
      const wornImg = IMG_FILES[`${p.type}_${stage}_${worn.id}`];
      if(!wornImg || (!clipUrl && base === wornImg)) return '';        // ชุดโชว์ตัวใหญ่อยู่แล้ว ไม่ต้องมีป้าย
      const canSwap = !calm && !petHungry(p);                          // ป่วย/หลับ/หิว กดแล้วภาพไม่เปลี่ยน = ป้ายเฉย ๆ
      const tag = canSwap ? 'button' : 'div';
      return `<${tag} class="ps-worn-pip"${canSwap ? ' type="button" title="กดดูน้องใส่ชุด"' : ''}>`
        + `<img src="${wornImg}" alt=""><span>${worn.emoji || '🎀'} ยังใส่อยู่</span></${tag}>`;
    })()}
  </div>`;
}

/* ตัวละครผู้เลี้ยงยืนเต็มตัวข้างน้อง (ฉาก lobby 3D สไตล์ COD — รอบ 86)
   มีภาพ player_male/female.png ใช้ภาพเต็มตัว · ยังไม่เลือก/ไม่มีภาพ = อีโมจิตัวโต */
// 🧱 รอบ 238: ตัวละครในล็อบบี้ = ตัวบล็อก 2D (เปลี่ยนได้ในตั้งค่า)
// 🖼️ รอบ 751: เลือกได้ 88 ตัว — blk1..blk8 มีโมเดลในโลก 3D ด้วย (state.blockAv) · blk9..blk88 เป็นภาพ 2D อย่างเดียว (state.profAv)
const PROF_AV_MAX = 88;
function lobbyBlk(){
  if(/^blk([1-9]|[1-7][0-9]|8[0-8])$/.test(state.profAv||'')) return state.profAv;
  if(/^blk[1-8]$/.test(state.blockAv||'')) return state.blockAv;
  return state.playerAvatar === 'female' ? 'blk6' : 'blk1';   // ค่าเริ่มต้นตามเพศตัวละครที่เลือกตอนสมัคร
}
// ⚠️ รอบ 244: ผู้ใช้เอาตัวละครเด็กออกจากล็อบบี้ชั่วคราว (ท่าเด้งไปมาไม่เข้ากับฉาก) — ยังไม่ลบ ฟังก์ชันเก็บไว้รอหาที่ลงใหม่
// ปัจจุบันไม่มีที่เรียกแล้ว (เดิมเรียกที่ pet-card hero-scene) · จะกลับมาใช้ต้องเรียก caretakerFigureHTML() อีกครั้ง
function caretakerFigureHTML(){
  const blk = lobbyBlk();
  // rig: origin ที่เท้า → ท่า idle "มีชีวิต" (เอียงตัว/พยักหน้า/ย้ายน้ำหนัก/กระโดดเบา) แทนลอยยุบ · footAlign เล็งเท้าลงเส้นพื้น
  return `<div class="caretaker-fig"><div class="blk-rig lively">`
    + `<img class="caretaker-img blk-char" src="img/blocks/${blk}.png" alt="ตัวละครของหนู"></div></div>`;
}

// 🦶 รอบ 238: เล็งเท้าลง "เส้นฟ้า" — ภาพ blk/สัตว์มีขอบใสด้านล่างไม่เท่ากัน (เท้าไม่อยู่ก้นภาพ)
// วัดแถวทึบล่างสุดของแต่ละภาพ (cache ต่อ src) แล้วดันภาพลงเท่าขอบใส → เท้าจริงแตะกล่อง = อยู่บนเส้น
const __footFrac = {};
function footAlign(scope){
  const imgs = (scope || document).querySelectorAll('.blk-char, .hero-scene .pet-img');
  imgs.forEach(img=>{
    const src = img.getAttribute('src'); if(!src) return;
    /* 🎀 รอบ 666: ถ้าภาพอยู่ในกรอบ .pet-wear (มีชั้นชุดซ้อนอยู่) ต้องเลื่อนทั้งกรอบ
       ไม่ใช่เลื่อนแค่ภาพ ไม่งั้นชุดค้างที่เดิม (กรอบสูงเท่าภาพพอดี % จึงเท่ากัน) */
    const mover = img.closest('.pet-wear') || img;
    const apply = f => { mover.style.transform = `translateY(calc((1 - ${f}) * 100%))`; };
    if(__footFrac[src] != null){ apply(__footFrac[src]); return; }
    const probe = new Image();
    probe.onload = ()=>{
      try{
        const w = probe.naturalWidth, h = probe.naturalHeight;
        const c = document.createElement('canvas'); c.width = w; c.height = h;
        const ctx = c.getContext('2d'); ctx.drawImage(probe, 0, 0);
        const d = ctx.getImageData(0, 0, w, h).data;
        let low = -1;
        for(let y = h - 1; y >= 0 && low < 0; y--){ for(let x = 0; x < w; x += 2){ if(d[(y*w+x)*4+3] > 40){ low = y; break; } } }
        const f = low < 0 ? 1 : (low + 1) / h;
        __footFrac[src] = f; apply(f);
      }catch(e){ /* อ่านพิกเซลไม่ได้ (CORS) → ปล่อยตามภาพ */ }
    };
    probe.src = src;
  });
}

/* รอบ 114: เหรียญตราแรงค์ใหญ่เป็นฉากหลังกลางเวที lobby (อยู่หลังตัวละคร/canvas 3D)
   ใช้แรงค์ปัจจุบันจาก net worth · ไม่มีไฟล์ภาพ = ไม่โชว์ (ไม่ใช้อีโมจิ กันรก)
   รอบ 115: แรงค์เปลี่ยนระหว่าง session → เล่นเอฟเฟกต์เปลี่ยนร่าง (แฟลช+เหรียญหมุนสลับ)
   จำแรงค์ที่โชว์ล่าสุดไว้เทียบ — เข้าเกมครั้งแรก/เปลี่ยนหน้าไปมา ไม่เล่นซ้ำ */
/* ⚠️ รอบ 604: เลิกใช้บนเวทีแล้ว (แรงค์ย้ายไปแท็บเล็กใต้วันเดือนปี — renderRankTab)
   เก็บฟังก์ชันไว้เผื่ออยากเอาเหรียญยักษ์กลับมาเป็นฉากหลังในโหมดอื่น · เช่นเดียวกับ petVisualHTML/petAnimHTML
   (สไปรต์เดินอบจาก 3D) ที่ถูกแทนด้วย petShowHTML */
let heroRankShownId = null;
function heroRankBgHTML(){
  const info = rankInfo(netWorth());
  const img = IMG_FILES[`rank_${info.rank.id}`];
  const fx = heroRankShownId !== null && heroRankShownId !== info.rank.id && !state.noAnim;
  heroRankShownId = info.rank.id;
  if(!img) return '';
  // รอบ 176: ชั้นแสงมีชีวิต — .rank-edge = แถบแสงวิ่งไล่ตามขอบเหลี่ยมของเหรียญ (mask ภาพจริง 2 ชั้น xor เหลือแต่ขอบ)
  // .rank-beam = ลำแสงกวาดทั้งเหรียญ (mask ภาพจริงชั้นเดียว) · img เรืองแสงหายใจสีตามแรงค์ (CSS rankBreath)
  const imgAbs = new URL(img, document.baseURI).href;   // ⚠️ url() ใน var() Chrome resolve เทียบไฟล์ CSS — ต้องส่ง absolute
  // รอบ 177: ยิ่งใกล้เลื่อนแรงค์ แสงยิ่งหายใจถี่ (3.6s → 2.0s ตาม prog) — เด็กรู้สึก "ใกล้แล้ว!"
  const pulse = (3.6 - 1.6*Math.min(1, info.prog || 0)).toFixed(2);
  // ประกายเพชร ✦ 8 จุด — ตำแหน่ง deterministic ต่อแรงค์ (seed จาก idx) กัน render ซ้ำแล้วจุดย้ายวูบวาบ
  let sparks = '', s = info.idx*7 + 3;
  const rnd = ()=>{ s = (s*16807) % 2147483647; return s/2147483647; };
  for(let i=0;i<8;i++){
    sparks += `<span style="left:${(18+rnd()*64).toFixed(1)}%;top:${(12+rnd()*70).toFixed(1)}%;`+
      `font-size:${(10+rnd()*16).toFixed(0)}px;animation-delay:${(rnd()*3).toFixed(2)}s;`+
      `animation-duration:${(1.6+rnd()*2).toFixed(2)}s">✦</span>`;
  }
  return `<div class="hero-rank-bg${fx ? ' rank-fx' : ''}" style="--rank-c:${info.rank.color};--rank-img:url('${imgAbs}');--rank-pulse:${pulse}s">
    <img src="${img}" alt="">
    <div class="rank-beam"><i></i></div>
    <div class="rank-edge"><i></i></div>
    <div class="rank-sparks">${sparks}</div>
    <div class="rank-floor"></div>
  </div>`;
}

/* ============================================================
   🆕 New Word (รอบ 116): คำศัพท์ใหม่ 1 คำ/การ login ตามระดับชั้น
   สุ่มครั้งเดียวต่อการเปิดเกม (module var — login ใหม่/รีเฟรช = คำใหม่)
   คลิกแบนเนอร์ = ป๊อปอัปรายละเอียดตาม format พจนานุกรม + อ่านออกเสียง
   ============================================================ */
let newWordPick = null;
const NEW_WORD_MS = 120000;   // รอบ 326 (ผู้ใช้สั่ง): เปลี่ยนคำใหม่ทุก 2 นาทีระหว่างอยู่หน้า Lobby

/* หยิบคำถัดไปจาก "คิวสุ่มไม่ซ้ำ" (รอบ 326)
   คิว = คำทั้งพูลของระดับชั้น สลับลำดับแล้วหยิบทีละคำ → ไม่มีคำซ้ำจนกว่าจะครบทุกคำ
   หมดคิว = สลับใหม่แล้ววนต่อเรื่อยๆ · เก็บใน state จึงไม่ซ้ำข้ามการรีเฟรชด้วย
   เปลี่ยนระดับชั้น → คำที่ไม่อยู่ในพูลใหม่ถูกคัดออกเอง */
function newWordNext(){
  const pool = (typeof newWordPool === 'function') ? newWordPool() : [];
  if(!pool.length) return;
  if(!Array.isArray(state.nwQueue)) state.nwQueue = [];
  state.nwQueue = state.nwQueue.filter(w=>pool.some(r=>r[0] === w));
  if(!state.nwQueue.length) state.nwQueue = shuffle(pool.map(r=>r[0]));
  const en = state.nwQueue.shift();
  newWordPick = pool.find(r=>r[0] === en) || pool[0];
  state.nwAt = Date.now();
  saveState();
}
function renderNewWord(){
  const el = document.getElementById('newword-banner');
  if(!el) return;
  if(typeof NEW_WORDS === 'undefined' || !state.student){ el.style.display='none'; return; }
  if(!newWordPick) newWordNext();
  if(!newWordPick){ el.style.display='none'; return; }
  const [en] = newWordPick;
  el.style.display='';
  /* รอบ 327: โชว์ป้าย 🪙+1 เมื่อคำนี้ยังไม่ได้รับเหรียญ — เด็กเห็นชัดว่ากดแล้วได้อะไร
     รับไปแล้วเปลี่ยนเป็นเครื่องหมายถูก (ไม่ล่อให้กดรัวๆ โดยไม่ได้อะไร) */
  const paid = state.nwPaidAt === state.nwAt;
  /* 🔤 รอบ 700 (ผู้ใช้สั่ง 29 ก.ค. 2026): คำศัพท์ใหญ่ขึ้น+อยู่กึ่งกลางเวทีน้อง, คำใบ้ลงบรรทัดใต้คำศัพท์
     NEW ย้ายเป็นป้ายมุมซ้ายบน (ลอยเป็นริบบิ้น) กันไม่ให้เบียดคำศัพท์ตอนจัดกึ่งกลาง */
  el.innerHTML = `
    <span class="nw-tag">NEW</span>
    <span class="nw-word">${en}</span>
    <div class="nw-sub">
      <span class="nw-hint">ไม่รู้ว่าแปลว่าอะไร? <b>แตะดูได้เลย</b></span>
      <span class="nw-coin${paid ? ' paid' : ''}">${paid ? '✅' : `🪙 +${NEW_WORD_COIN}`}</span>
      <span class="nw-countdown" title="เวลาที่เหลือก่อนเปลี่ยนคำใหม่"></span>
    </div>
    <i class="nw-bar"><i class="nw-bar-fill"></i></i>`;
  nwCountdownTick();       // เติมเลขนับถอยหลังทันที ไม่ต้องรอ tick แรก
  el.onclick = showNewWordPopup;
  alignNewWord();          // จัดให้กึ่งกลางตรงกับภาพ Rank ใหญ่ (ความกว้างแบนเนอร์เปลี่ยนตามความยาวคำ)
  startNewWordTimer();
}

/* จัดแบนเนอร์ให้ "กึ่งกลางตรงกับภาพ Rank ใหญ่กลางเวที" (ผู้ใช้สั่งรอบ 326)
   เวทีน้องอยู่คอลัมน์ขวาของการ์ด → กึ่งกลางเวทีไม่ใช่กึ่งกลางจอ ต้องวัดเอา
   (แพทเทิร์นเดียวกับ alignPetTabs — หารด้วย scale เผื่อหน้าเพจโดนย่อด้วย transform) */
/* 📐 รอบ 613 → 🔤 รอบ 699/700 → 📏 รอบ 702 (ผู้ใช้สั่ง 29 ก.ค. 2026):
   ① "ยืดขอบซ้ายขวาให้เสมอกับกล่องเวทีน้อง" → เลิกกล่องลอยกึ่งกลาง (auto-width) เปลี่ยนเป็น
      กว้างเท่าเวทีเป๊ะ (--nw-left = ขอบซ้ายเวที · --nw-w = ความกว้างเวที) เนื้อหาข้างในจัดกึ่งกลางเอง
   ② "ดันขอบกล่องขึ้นไปทางระดับชั้น เว้นระยะสวยงามเท่าระยะซ้ายขวาของฟีดเพื่อน (= 5px)" →
      ดึงขึ้นด้วย margin-top ติดลบ (--nw-top) ให้ขอบบนกล่องห่างใต้ชิประดับชั้นเท่ากับ NW_GAP พอดี
   ⚠️ ต้องคิดจาก "ขอบบนเวที" (stageTop) กับ "ใต้ชิประดับชั้น" ซึ่งไม่ขึ้นกับตัวแบนเนอร์เอง —
      ถ้าวัดจากขอบบนแบนเนอร์จะกลายเป็นอ้างอิงตัวเอง ค่าจะไหลเรื่อย ๆ ทุกครั้งที่ ResizeObserver ยิงซ้ำ */
const NW_GAP = 5;   // = ระยะซ้าย/ขวาของกล่องฟีดเพื่อน (รอบ 695) ใช้เป็นมาตรฐานระยะห่างเดียวกันทั้งหน้า
function alignNewWord(){
  const el = document.getElementById('newword-banner');
  const c = stageColLeft();
  if(!el || !c || el.style.display === 'none') return;
  el.style.setProperty('--nw-left', c.left + 'px');
  el.style.setProperty('--nw-w', c.width + 'px');
  const grade = document.querySelector('.coin-block .grade-pill');
  const stage = document.querySelector('.lobby-stage');
  if(grade && stage && grade.offsetWidth){
    const gb = grade.getBoundingClientRect().bottom, st = stage.getBoundingClientRect().top;
    el.style.setProperty('--nw-top', Math.min(0, (gb + NW_GAP - st) / c.scale) + 'px');
  }else el.style.setProperty('--nw-top', '0px');
}

/* นาฬิกาเปลี่ยนคำ — เช็กทุก 5 วินาที (ไม่ใช่ setTimeout 2 นาทีเดียว) เพื่อให้
   เครื่องที่หลับ/สลับแท็บกลับมาแล้วคำเปลี่ยนตามเวลาจริง ไม่ค้างคำเดิม */
let __nwTimer = null;
function startNewWordTimer(){
  if(__nwTimer) return;
  __nwTimer = setInterval(()=>{
    const dash = document.getElementById('screen-dashboard');
    if(!dash || !dash.classList.contains('active')) return;        // อยู่หน้าอื่น/ในเกม = ไม่ต้องเปลี่ยน
    if(!state.student || typeof NEW_WORDS === 'undefined') return;
    patRemindTick();                                               // 🐾 รอบ 328: เตือนอ่อนๆ ตอนเย็นถ้ายังไม่ได้ลูบน้อง
    if(Date.now() - (state.nwAt || 0) < NEW_WORD_MS){ nwCountdownTick(); return; }
    newWordNext();
    renderNewWord();
    const el = document.getElementById('newword-banner');
    if(el){ el.classList.remove('nw-swap'); void el.offsetWidth; el.classList.add('nw-swap'); }
  }, 1000);
}

/* ⏳ รอบ 328 (ผู้ใช้สั่ง): นับถอยหลังจางๆ บนแถบคำใหม่ — บอกว่าอีกกี่วินาทีจะเปลี่ยนคำ
   อัปเดตเฉพาะข้อความ/ความกว้างแถบ (ไม่ render ใหม่ทั้งแบนเนอร์) = ไม่กระพริบ ไม่กินแรงเครื่อง */
function nwCountdownTick(){
  const el = document.getElementById('newword-banner');
  if(!el || el.style.display === 'none') return;
  const cd = el.querySelector('.nw-countdown'), fill = el.querySelector('.nw-bar-fill');
  if(!cd) return;
  const left = Math.max(0, NEW_WORD_MS - (Date.now() - (state.nwAt || 0)));
  const s = Math.ceil(left / 1000);
  /* 🎩 รอบ 612: ตัด ⏳ ออก — มีแถบเวลาที่ขอบล่างแบนเนอร์บอกอยู่แล้ว เหลือตัวเลขล้วนอ่านง่ายกว่า */
  cd.textContent = `อีก ${Math.floor(s/60)}:${String(s % 60).padStart(2,'0')}`;
  if(fill) fill.style.width = (100 * (1 - left / NEW_WORD_MS)).toFixed(1) + '%';
}

/* 🐾 รอบ 328 (ผู้ใช้สั่ง): เตือนอ่อนๆ ตอนเย็น ถ้าวันนี้ยังไม่ได้ลูบน้อง — กันสตรีคเข็มเพื่อนซี้ขาด
   · เตือน "วันละครั้ง" เท่านั้น (state.patRemindDay) ตั้งแต่ PAT_REMIND_HOUR เป็นต้นไป
   · เตือนแบบไม่ขวางทาง: toast + เรืองแสงนุ่มๆ ที่ตัวน้อง (ไม่มี dialog ให้ต้องกดปิด)
   · ลูบแล้วแสงหายเอง (renderDashboard วาดเวทีใหม่ทุกครั้ง) */
const PAT_REMIND_HOUR = 17;
function patRemindTick(){
  const day = todayStr();
  if(state.patRemindDay === day) return;                       // เตือนไปแล้ววันนี้
  if(thHour() < PAT_REMIND_HOUR) return;                       // ยังไม่ถึงเวลาเย็น (🇹🇭 รอบ 988: เวลาไทย)
  if(!state.pets || !state.pets.length) return;
  if(Array.isArray(state.patDays) && state.patDays.includes(day)) return;   // ลูบไปแล้ววันนี้
  state.patRemindDay = day;
  saveState();
  const p = activePet();
  const streak = patStreakNow();       // 🔥 รอบ 1035: สตรีคที่ยังต่อได้จริง (ขาดแล้วอย่าชวนต่อสตรีคเก่า)
  /* ⚠️ ถ้อยคำต้องเลี่ยงคำใน TOAST_WARN_RE (util.js) เช่น "ยังไม่" / "ไม่ได้" —
     ไม่งั้น toast กลายเป็นแบบ "คำเตือน" = ค้างจอรอกดปิด + เสียงเตือน + สั่น (ไม่ใช่เตือนอ่อนๆ) */
  toast(streak > 0
    ? `🐾 ${p ? p.name : 'น้อง'}รอให้มาลูบอยู่นะ — กดค้างที่ตัวน้อง ต่อสตรีค 🔥 ${fmtNum(streak)} วันให้ยาวขึ้น`
    : `🐾 ${p ? p.name : 'น้อง'}รอให้มาลูบอยู่นะ — กดค้างที่ตัวน้องสักครู่ รับ EXP + เริ่มนับสตรีคเข็มเพื่อนซี้`, 5200);
  applyPatRemindGlow();
}

/* แสงนุ่มๆ ที่ตัวน้อง "ระหว่างที่ยังไม่ได้ลูบวันนี้ (หลังเวลาเย็น)" — ลูบแล้วหายเอง
   ต้องทาคลาสใหม่ทุกครั้งที่ renderDashboard วาดเวทีใหม่ (ปุ่ม/เหรียญ/นาฬิกาก็สั่งวาดใหม่ได้)
   ไม่งั้นแสงหายไปเงียบๆ กลางทางแบบที่เจอตอนทดสอบ */
function applyPatRemindGlow(){
  const stage = document.querySelector('.hero-scene .pet-stage');
  if(!stage) return;
  const day = todayStr();
  const need = (state.pets || []).length
    && thHour() >= PAT_REMIND_HOUR                             // 🇹🇭 รอบ 988: เวลาไทย
    && !(Array.isArray(state.patDays) && state.patDays.includes(day));
  stage.classList.toggle('pat-remind', !!need);
}

/* ป๊อปอัปรายละเอียดคำ — format ตามสเปกพจนานุกรม (TASK_DICTIONARY_SONNET.md):
   คำ / (pos) /IPA/ เสียงอ่านไทย / ประโยคอังกฤษอธิบายความหมาย / ความหมายไทย */
/* 🪙 รอบ 327 (ผู้ใช้สั่ง): เปิดอ่านคำใหม่ = ได้ 1 เหรียญ พร้อมเสียง+ภาพชัดเจน
   ให้ "คำละ 1 เหรียญ" (ยึด state.nwAt = เวลาที่ขึ้นคำนี้เป็นตัวระบุคำ) — กดซ้ำคำเดิมไม่ได้เพิ่ม
   ไม่งั้นเด็กกดรัวๆ คำเดียวได้เหรียญไม่จำกัด · คำเปลี่ยนทุก 2 นาที = ได้เหรียญใหม่ทุกคำ */
const NEW_WORD_COIN  = 1;
const NW_DAILY_GOAL  = 10;   // รอบ 329: อ่านคำใหม่ครบกี่คำในวันเดียว
const NW_DAILY_BONUS = 20;   // 🪙 โบนัสเมื่อครบ (วันละครั้ง)
function newWordReward(){
  if(state.nwPaidAt === state.nwAt) return false;    // คำนี้รับไปแล้ว
  state.nwPaidAt = state.nwAt;
  addCoins(NEW_WORD_COIN);
  /* 📒 รอบ 329: คำที่กดอ่าน → เก็บเข้าสมุดคำศัพท์อัตโนมัติ (กลุ่ม 🌱 กำลังเรียนรู้)
     จะได้ถูกหยิบไปออกข้อสอบทบทวนของตัวเองภายหลัง */
  if(typeof vbSeen === 'function' && newWordPick) vbSeen(newWordPick[0], newWordPick[5]);
  nwDailyTick();                                     // 🎯 นับคำที่อ่านวันนี้ + โบนัสครบ 10 คำ
  saveState();
  const banner = document.getElementById('newword-banner');
  coinFlyFx(banner, NEW_WORD_COIN);                  // 🪙 บินจากแบนเนอร์ไปเข้ากระเป๋า + ป้าย +1
  if(sfx.coinGet) sfx.coinGet();                     // เสียง "เหรียญเข้า" (ชัดกว่า sfx.coin ปกติ)
  if(state.haptic !== false && navigator.vibrate) navigator.vibrate([15,30,15]);
  const cc = document.getElementById('coin-count');
  const pill = cc && cc.closest('.coin-pill');
  if(pill){ pill.classList.remove('coin-pop'); void pill.offsetWidth; pill.classList.add('coin-pop'); }
  if(typeof renderDashboard === 'function') renderDashboard();   // ตัวเลขเหรียญบนแถบบนอัปเดตทันที
  return true;
}

/* 🎯 รอบ 329 (ผู้ใช้สั่ง): นับ "อ่านคำใหม่วันนี้กี่คำ" → ครบ NW_DAILY_GOAL รับโบนัสก้อน 1 ครั้ง/วัน
   นับเฉพาะคำที่ได้เหรียญจริง (คำละครั้ง) → กดซ้ำคำเดิมไม่ปั่นยอด
   ฉลองด้วย celebrateBadge เดิม (แบนเนอร์กลางจอ + โปรยคอนเฟตติ + เสียง) — ไม่ต้องทำฉากใหม่ */
function nwDailyTick(){
  const day = todayStr();
  if(state.nwReadDay !== day){ state.nwReadDay = day; state.nwReadCount = 0; state.nwBonusDay = ''; }
  state.nwReadCount = (state.nwReadCount || 0) + 1;
  if(state.nwReadCount < NW_DAILY_GOAL || state.nwBonusDay === day) return;
  state.nwBonusDay = day;
  addCoins(NW_DAILY_BONUS);
  setTimeout(()=>{     // หน่วงให้เอฟเฟกต์เหรียญ +1 กับป๊อปอัปคำศัพท์เล่นจบก่อน
    if(typeof celebrateBadge === 'function'){
      celebrateBadge('📚', `อ่านครบ ${NW_DAILY_GOAL} คำวันนี้!`,
        `เก่งมาก! รับโบนัส 🪙${fmtNum(NW_DAILY_BONUS)} — พรุ่งนี้มาสะสมใหม่ได้อีกนะ`);
    }
    const banner = document.getElementById('newword-banner');
    if(banner) coinFlyFx(banner, NW_DAILY_BONUS);
  }, 900);
}

/* เหรียญบินจากจุดที่กด → กระเป๋าเหรียญมุมขวาบน + ป้าย "+🪙1" ลอยขึ้น
   ใช้ตำแหน่งจริงจาก getBoundingClientRect ทั้งคู่ → ตรงทุกขนาดจอ */
function coinFlyFx(fromEl, amount){
  if(document.documentElement.classList.contains('no-anim')) return;
  const target = document.getElementById('coin-count');
  if(!fromEl || !target) return;
  const a = fromEl.getBoundingClientRect(), b = target.getBoundingClientRect();
  if(!a.width || !b.width) return;
  const n = 5;                                        // เหรียญหลายเหรียญบินตามกันให้เห็นชัด
  for(let i = 0; i < n; i++){
    const c = document.createElement('div');
    c.className = 'coin-fly';
    // 🪙 รอบ 340: ใช้เหรียญภาพจริงชุดเดียวกับในโลก 3D (โหลดไม่ได้ = กลับไปใช้อีโมจิ)
    const ci = document.createElement('img');
    ci.className = 'coin-ic'; ci.src = 'img/coins/coin_gold.png'; ci.alt = '';
    ci.onerror = () => { c.textContent = '🪙'; };
    c.appendChild(ci);
    c.style.left = (a.left + a.width/2 + (Math.random()-0.5)*a.width*0.5) + 'px';
    c.style.top  = (a.top + a.height/2) + 'px';
    c.style.setProperty('--dx', (b.left + b.width/2 - (a.left + a.width/2)) + 'px');
    c.style.setProperty('--dy', (b.top + b.height/2 - (a.top + a.height/2)) + 'px');
    c.style.animationDelay = (i*70) + 'ms';
    document.body.appendChild(c);
    setTimeout(()=>c.remove(), 1000 + i*70);
  }
  const tag = document.createElement('div');
  tag.className = 'coin-plus';
  tag.textContent = `+🪙${amount}`;
  tag.style.left = (a.left + a.width/2) + 'px';
  tag.style.top  = (a.top - 6) + 'px';
  document.body.appendChild(tag);
  setTimeout(()=>tag.remove(), 1200);
}

/* แถบความคืบหน้า "อ่านวันนี้ x/10 คำ" ในป๊อปอัป — ครบแล้วบอกว่ารับโบนัสไปแล้ว */
function nwDailyBarHTML(){
  const done = (state.nwReadDay === todayStr()) ? (state.nwReadCount || 0) : 0;
  const n = Math.min(done, NW_DAILY_GOAL);
  const full = done >= NW_DAILY_GOAL;
  return `<div class="nw-pop-goal${full ? ' done' : ''}">
    <div class="nw-goal-head">🎯 อ่านคำใหม่วันนี้ <b>${n}/${NW_DAILY_GOAL}</b> คำ
      <span>${full ? `รับโบนัส 🪙${fmtNum(NW_DAILY_BONUS)} แล้ว 🎉` : `ครบ ${NW_DAILY_GOAL} คำ รับ 🪙${fmtNum(NW_DAILY_BONUS)}`}</span></div>
    <div class="nw-goal-bar"><div class="nw-goal-fill" style="width:${n / NW_DAILY_GOAL * 100}%"></div></div>
  </div>`;
}

function showNewWordPopup(){
  if(!newWordPick) return;
  const gotCoin = newWordReward();                    // 🪙 อ่านคำใหม่ = ได้เหรียญ (คำละครั้ง)
  const [en, pos, ipa, thRead, sentence, thMean] = newWordPick;
  const overlay = document.createElement('div');
  overlay.className = 'levelup-overlay';
  overlay.innerHTML = `<div class="levelup-box nw-box">
    <div class="nw-pop-word">${en} <button class="nw-speak" title="ฟังเสียงอ่าน">🔊</button></div>
    <div class="nw-pop-phon">(${pos}) <span class="nw-ipa">${ipa}</span> ${thRead}</div>
    <div class="nw-pop-sent">${sentence}</div>
    <div class="nw-pop-mean">${thMean}</div>
    ${gotCoin
      ? `<div class="nw-pop-coin">🪙 <b>+${NEW_WORD_COIN} เหรียญ</b> — รางวัลที่ตั้งใจอ่านคำใหม่!</div>`
      : `<div class="nw-pop-coin nw-coin-done">✅ รับเหรียญคำนี้ไปแล้ว — <b>คำใหม่มาทุก 2 นาที</b> มารับอีกได้เลย</div>`}
    ${nwDailyBarHTML()}
    <div class="nw-pop-book">📒 เก็บคำนี้เข้า<b>สมุดคำศัพท์ของหนู</b>แล้ว — ไว้ทบทวนทีหลังได้</div>
    <div style="margin-top:14px"><button class="cf-ok">เข้าใจแล้ว! ✨</button></div>
  </div>`;
  const close = ()=>overlay.remove();
  overlay.querySelector('.cf-ok').addEventListener('click', close);
  overlay.addEventListener('click', e=>{ if(e.target===overlay) close(); });
  overlay.querySelector('.nw-speak').addEventListener('click', ()=>speakWord(en));
  document.body.appendChild(overlay);
  speakWord(en);   // เปิดมาอ่านให้ฟังเลย (มีปุ่ม 🔊 ฟังซ้ำ)
}

/* เปลี่ยนชื่อน้อง (ใช้ทั้งปุ่ม ✏️ และคลิกซ้ำแท็บน้องที่กำลังแสดงอยู่ — รอบ 189) */
function renamePet(p){
  p = p || activePet();
  if(!p) return;
  const conf = PETS[p.type];
  askNameDialog({
    emoji:'🏷️', title:`เปลี่ยนชื่อ${conf.name}`,
    desc:'ชื่อไทย/อังกฤษ/ตัวเลข 1–9 ตัว (สั้นๆ จะได้พอดีแท็บ ไม่ตกบรรทัด)',
    placeholder:'เช่น บ็อบบี้, Lucky', value:p.name, min:1, max:9,
    okText:'เปลี่ยนชื่อ ✅', cancelText:'ยกเลิก',
    onOk:(name)=>{
      p.name = name; saveState(); sfx.select();
      toast(`🏷️ เปลี่ยนชื่อน้องเป็น "${name}" แล้ว!`);
      renderDashboard();
    },
  });
}
/* ---------- เวลามื้ออาหารเป็นข้อความไทย (มื้อเย็นวันละครั้ง 18:00 — ข้อ 2) ---------- */
function mealLabel(ts){
  // 🇹🇭 รอบ 988: เทียบ "วันไทย" กับ "วันไทยของวันนี้" (thDayStart คืน timestamp จริงของเที่ยงคืนไทย)
  const dayDiff = Math.round((thDayStart(ts) - thDayStart(Date.now()))/TH_DAY_MS);
  const day = dayDiff >= 2 ? 'มะรืนนี้ ' : dayDiff === 1 ? 'พรุ่งนี้ ' : '';
  return `${day}${String(thHour(ts)).padStart(2,'0')}:00 น.`;
}
function fmtMins(ms){
  const totalMin = Math.max(0, Math.ceil(ms/60000));
  const h = Math.floor(totalMin/60), m = totalMin%60;
  return h > 0 ? (m > 0 ? `${h} ชม. ${m} นาที` : `${h} ชม.`) : `${m} นาที`;
}

/* ============================================================
   นาฬิกาใต้ชื่อผู้เล่น (วัน · วันที่ · เวลา อัปเดตทุกวินาที)
   ============================================================ */
function renderClock(){
  const el = document.getElementById('clock-chip');
  if(!el) return;
  const now = new Date(Date.now());
  /* 🎩 รอบ 612: วันที่แบบสั้น ("จ. 27 ก.ค. 2569") + เวลาแยกชิ้นเป็นตัวเลขเด่น
     — เดิมเป็นประโยคยาว "📅 วันจันทร์ที่ 27 กรกฎาคม 2569 · ⏰ 16:36:19 น." กินพื้นที่จนป้ายชื่อดูแน่น */
  // 🇹🇭 รอบ 988: ผูกโซน Asia/Bangkok — เครื่องที่ตั้งไทม์โซนต่างประเทศก็เห็นวัน/เวลาบ้านเรา
  const dateTxt = now.toLocaleDateString('th-TH', thLocaleOpt({weekday:'short', day:'numeric', month:'short', year:'numeric'}));
  const timeTxt = now.toLocaleTimeString('th-TH', thLocaleOpt({hour:'2-digit', minute:'2-digit', second:'2-digit'}));
  el.innerHTML = `<span class="ck-date">${dateTxt}</span><span class="ck-time">${timeTxt}</span>`;
  renderRainBar();                                   // แถบนับถอยหลังฝนเดินไปพร้อมนาฬิกา
  const compLive = document.getElementById('comp-live');
  if(compLive) compLive.textContent = compLiveTotal().toFixed(2);   // ตัวเลขรายได้คอมวิ่งทุกวินาที
  renderOnlineEarnPill();                            // item 8: ตัวเลขโบนัสออนไลน์วิ่งทุกวินาที
  renderCompEarnPill();                              // รอบ 706: ช่องรายได้คอมพิวเตอร์บนแถบบน (วิ่งทุกวินาทีเช่นกัน)
  renderFarmClock();                                 // นาฬิกานับถอยหลังต้นไม้เดินพร้อมนาฬิกา
  renderOrderClock();                                // นาฬิกานับถอยหลังออเดอร์พิเศษ
  renderDinnerChip();                                // ปุ่มข้าวเย็นผู้เล่น (ข้อ 6) โผล่/หายตามเวลา (อยู่แถวแท็บสัตว์ตั้งแต่รอบ 179)
  chatBadgeSync();                                   // รอบ 179: badge เลขข้อความใหม่บนปุ่มแชท header
  if(typeof syncMusicBtn === 'function') syncMusicBtn();   // 🎵 รอบ 184: ไอคอนปุ่มเพลงตาม state.musicOff
}

/* ============================================================
   ข้าวเย็นของผู้เล่น (กิจกรรมเสริม)
   ปุ่ม 🍚 โผล่ช่วงเย็น (18:00 ถึงตี 6) จนกว่าจะกิน · ไม่กินก็ไม่ป่วยและไม่ล็อกระบบอื่น
   ============================================================ */
function selfName(){
  const n = (typeof state !== 'undefined' && state)
    ? (state.profileName || (state.student ? state.student.first : '')) : '';
  return n ? `หนู (${n})` : 'หนู';
}
function selfNameHTML(){ return escapeHTML(selfName()); }
function dinnerDue(now){
  now = now || Date.now();
  const h = thHour(now);                                       // 🇹🇭 รอบ 988: เวลาไทย
  return (h >= MEAL_HOUR || h < WAKE_HOUR) && state.playerFedDay !== mealDayKey(now);
}
function renderDinnerChip(){
  const btn = document.getElementById('btn-dinner');
  if(!btn || typeof state === 'undefined') return;
  if(dinnerDue()){
    btn.style.display = ''; btn.textContent = '🍚';
    btn.title = `ได้เวลากินข้าวเย็นของ ${selfName()} แล้ว (🪙${fmtNum(DINNER_COST)})`;
  }else btn.style.display = 'none';
}
function dinnerClick(){
  sfx.select();
  if(!dinnerDue()){ toast('😋 วันนี้กินข้าวเย็นแล้ว ไว้เจอกันมื้อพรุ่งนี้ 18:00 นะ'); return; }
  askConfirm(`<div style="font-size:56px;line-height:1">🍚</div>
    <div style="font-size:21px;font-weight:bold;margin-top:8px">กินข้าวเย็นของ ${selfNameHTML()}</div>
    <div style="margin-top:8px;color:#6a5a78;line-height:1.5"><b>ข้าวของคนนะ ไม่ใช่ของน้องสัตว์</b> — คนก็ต้องกินให้ตรงเวลาเหมือนน้อง<br>ค่าข้าวเย็น <b>🪙${fmtNum(DINNER_COST)}</b> (มี 🪙${fmtNum(Math.floor(state.coins))})</div>`,
    `🍽️ กินเลย 🪙${fmtNum(DINNER_COST)}`, ()=>{
      if(state.coins < DINNER_COST){ sfx.wrong(); toast(`ค่าข้าวเย็น 🪙${fmtNum(DINNER_COST)} — เหรียญไม่พอ ไปเล่นเกมเก็บเหรียญก่อนนะ`); return; }
      state.coins -= DINNER_COST;
      state.playerFedDay = mealDayKey(Date.now());
      sfx.buy();
      toast('🍚 อิ่มอร่อย! กินข้าวเย็นตรงเวลา สุขภาพแข็งแรง 💪');
      saveState();
      renderDashboard();
    });
}

/* ============================================================
   แถบฝนประจำวัน: นับถอยหลังถึง 19:00 ทุกวัน (ฝนตก 1 ชม.)
   ============================================================ */
function renderRainBar(){
  const el = document.getElementById('rain-banner');
  if(!el) return;
  const now = Date.now();
  const safe = rainProtected();
  if(rainNow(now)){
    const end = rainStartToday(now) + RAIN_DUR_MS;
    el.className = 'rain-banner raining' + (safe ? '' : ' danger');
    el.innerHTML = `<div class="rain-row"><span class="rain-icon">🌧️</span>
      <b>ฝนกำลังตกอยู่ตอนนี้!</b> (หยุดเวลา ${RAIN_HOUR+1}:00 น. — อีก ${fmtMins(end - now)})</div>
      <div class="rain-note">${safe
        ? '🏠 น้องอยู่ในบ้านสบายใจ ไม่เปียกฝนแน่นอน'
        : state.pets.some(p=>p.level>=2)
          ? '⚠️ น้องไม่มีที่หลบฝนสภาพดี เปียกฝนจนป่วยแล้ว! (ค่ารักษา 🪙' + fmtNum(CURE_COST) + ')'
          : '⚠️ ยังไม่มีที่หลบฝนสภาพดี — รีบหาบ้านก่อนรับน้องมาเลี้ยงนะ'}</div>`;
    return;
  }
  const next = nextRainStart(now);
  const msLeft = next - now;
  const pct = Math.min(100, Math.max(0, (1 - msLeft/(24*3600*1000)) * 100));
  el.className = 'rain-banner' + (safe ? '' : ' warn');
  el.innerHTML = `<div class="rain-row"><span class="rain-icon">🌧️</span>
    ฝนจะตกเวลา <b>${RAIN_HOUR}:00 น.</b> (ตกทุกวัน) — อีก <b>${fmtMins(msLeft)}</b></div>
    <div class="rain-track"><div class="rain-fill" style="width:${pct}%"></div></div>
    <div class="rain-note">${safe
      ? '🏠 มีบ้านสภาพดีแล้ว หลบฝนได้สบายใจ'
      : '⚠️ ยังไม่มีที่หลบฝนสภาพดี — ถ้าฝนตกน้องจะเปียกจนป่วย (ค่ารักษา 🪙' + fmtNum(CURE_COST) + ')'}</div>`;
}

/* ============================================================
   เอฟเฟกต์ฝนเต็มจอ (รอบยี่สิบ): ฝนตกจริง (19:00-20:00) + ไม่มีบ้านสภาพดี
   → เม็ดฝนจางๆ ทั้งจอ + หยดน้ำเกาะ "กระจกจอ" ชั่วคราว (แค่ภาพ ไม่แตะ state)
   ============================================================ */
function rainFxTick(){
  const on = typeof Auth !== 'undefined' && Auth.booted
          && rainNow(Date.now()) && !rainProtected();
  let fx = document.getElementById('rain-fx');
  if(on && !fx){
    fx = document.createElement('div');
    fx.id = 'rain-fx';
    /* 🌧️ รอบ 961: ถอด .rain-layer (เส้นสีขาวทแยงทั้งจอ) ออก — ผู้ใช้บอก "ดูไม่ professional"
       เหลือเฉพาะหยดน้ำเกาะกระจกซึ่งเป็นภาพจริง ดูสมจริงกว่า
       🌫️ รอบ 962: เพิ่ม .rain-vignette (ละอองฝนเบลอขอบจอ) แทนเส้นที่ถอดไป — ผู้ใช้ขอ
       "ให้รู้สึกว่าฝนตกโดยไม่ต้องมีเส้น" */
    fx.innerHTML = `<div class="rain-glass"></div><div class="rain-vignette"></div>`;
    document.body.appendChild(fx);
    rainFxDrop(fx.querySelector('.rain-glass'));
    if(typeof RainSound !== 'undefined') RainSound.start();   // 🌧️ เสียงฝนวนลูป
  }else if(!on && fx){
    fx.remove();                       // ฝนหยุด/ซื้อบ้านแล้ว → เอฟเฟกต์หาย
    if(typeof RainSound !== 'undefined') RainSound.stop();
  }
}
/* หยดน้ำเกาะกระจก: ภาพเม็ดฝนจริง 5 แบบ (img/fx/) สุ่มแบบ/ขนาด/ตำแหน่ง/
   ความทึบ/องศาเอียง เกาะ ~6 วิ แล้วไหลลงจางหาย — spawn ต่อเนื่องจนกว่า overlay
   ถูกถอด (เช็ก document.contains ทุกรอบ กัน loop ค้าง) */
const RAIN_DROP_IMGS = ['raindrop.png','raindrop_1.png','raindrop_2.png','raindrop_3.png','raindrop_4.png'];
function rainFxDrop(glass){
  if(!document.body.contains(glass)) return;
  const img = document.createElement('img');
  img.className = 'glass-drop';
  img.src = 'img/fx/' + RAIN_DROP_IMGS[Math.floor(Math.random()*RAIN_DROP_IMGS.length)];
  /* 2 แบบให้เหมือนฝนจริง: ~45% "รูดเร็ว-ไกล" (เกาะแป๊บเดียวแล้วไหลลงยาว)
     ที่เหลือ "เกาะช้า" (ค้างอยู่กับที่แล้วจางหาย) — ease-in ทำให้เริ่มช้าแล้วเร่ง */
  const streak = Math.random() < 0.45;
  const size = (streak ? 14 : 18) + Math.random()*(streak ? 16 : 28);
  const fall = streak ? 130 + Math.random()*310 : 6 + Math.random()*26;    // ระยะไหลลง (px)
  const dur  = streak ? 1.1 + Math.random()*1.5 : 4.5 + Math.random()*2.6;  // ระยะเวลา (วิ) เร็ว/ช้า
  img.style.left  = (2 + Math.random()*92).toFixed(1) + '%';
  img.style.top   = (streak ? 1 + Math.random()*38 : 2 + Math.random()*80).toFixed(1) + '%'; // เม็ดรูดเริ่มบนๆ จะได้มีที่ไหล
  img.style.width = size.toFixed(0) + 'px';
  /* 💧 รอบ 961: ผู้ใช้บอก "เห็นภาพเม็ดฝนชัดไป ไม่เหมือนของจริง" → ลดความทึบสูงสุด
     จาก 0.40-0.80 เหลือ 0.13-0.28 (น้ำจริงเป็นแค่เลนส์บิดแสง แทบไม่มีสีของตัวเอง) */
  img.style.setProperty('--o', (0.13 + Math.random()*0.15).toFixed(2));    // ความทึบสูงสุด (จางแบบน้ำ)
  img.style.setProperty('--r', (Math.random()*16 - 8).toFixed(1) + 'deg'); // เอียงเล็กน้อยไม่ให้เหมือนกันเป๊ะ
  img.style.setProperty('--fall', fall.toFixed(0) + 'px');
  img.style.animationDuration = dur.toFixed(2) + 's';
  glass.appendChild(img);
  setTimeout(()=>img.remove(), dur*1000 + 150);
  setTimeout(()=>rainFxDrop(glass), 250 + Math.random()*600);
}

/* ============================================================
   การ์ด "คนที่กำลังทำการบ้านไปพร้อมๆ กับเรา"
   ต่อ Firebase สำเร็จ → โชว์ผู้เล่นจริงที่ออนไลน์อยู่ (Online.friends)
   ออฟไลน์/ต่อไม่ได้ → ถอยไปใช้เพื่อนจำลองเดิม (สุ่มหมุนเวียนทุก 5 นาที)
   ============================================================ */
/* คำเรียกตัวเองตามระดับชั้น — ป.1-ป.6/อนุบาล = "หนู" (น่ารักสำหรับเด็ก) ·
   ตั้งแต่ ม.1 ขึ้นไป (รวม ปริญญา) = "คุณ" (สุภาพ เหมาะกับวัยโต) */
function selfPronoun(){
  const g = state.student ? state.student.grade : '';
  const junior = (g === 'ต่ำกว่าประถมศึกษา') || /^ป\.[1-6]$/.test(g);
  return junior ? 'หนู' : 'คุณ';
}
function selfTag(){ return selfPronoun() + 'เอง'; }   // "หนูเอง" / "คุณเอง"

/* 🆔 รอบ 187: รหัสประจำตัวผู้เล่น (6 ตัวจาก uid — คงที่แม้เปลี่ยนชื่อ) โชว์แทน "ชั้น" ในเกม
   มาตรการคุ้มครองเด็ก: ชั้นเรียนใช้เลือกความยากคำศัพท์เท่านั้น ไม่โชว์ · Lobby/กระดานเห็นแค่ 🆔 + ชื่อเล่น */
function idTag(uid){
  if(!uid || typeof friendCode !== 'function') return '';
  return '🆔 ' + friendCode(String(uid));
}

/* ============================================================
   รอบ 149: กล่อง aside ขวาเลื่อนวนอัตโนมัติ (ล่าง→บน) ไม่มี scrollbar
   แตะกล่อง = หยุดให้เลื่อนอ่านเองได้ · ปล่อยนิ้วเกิน 5 วิ = เลื่อนต่อ
   เนื้อหายาวเกินกล่องค่อยวน (ทำสำเนาต่อท้ายให้ลูปไร้รอยต่อ) · สั้นพอดีกล่อง = อยู่นิ่ง
   ============================================================ */
const SIDE_SCROLL_SPEED  = 14;      // px/วินาที
const SIDE_SCROLL_RESUME = 5000;    // ms หลังปล่อยนิ้วค่อยเลื่อนต่อ
const sideScrollSt = {};            // สถานะต่อกล่อง (id) — คงอยู่ข้าม re-render

function initSideScroll(el){
  if(!el) return;
  const st = sideScrollSt[el.id] || (sideScrollSt[el.id] = {hold:false, until:Date.now()+1500, pos:0});
  if(!el.__ssBound){
    el.__ssBound = true;
    const grab = ()=>{ st.hold = true; };
    const drop = ()=>{ if(st.hold){ st.hold = false; st.until = Date.now() + SIDE_SCROLL_RESUME; } };
    el.addEventListener('pointerdown', grab);
    el.addEventListener('touchstart', grab, {passive:true});
    window.addEventListener('pointerup', drop);
    window.addEventListener('pointercancel', drop);
    window.addEventListener('touchend', drop);
    window.addEventListener('touchcancel', drop);
    el.addEventListener('wheel', ()=>{ st.until = Date.now() + SIDE_SCROLL_RESUME; }, {passive:true});
  }
  el.__ssLoop = false;
  if(el.scrollHeight - el.clientHeight > 8){          // ยาวเกินกล่องค่อยวน
    const html = el.innerHTML;
    el.innerHTML = `<div class="ss-chunk">${html}</div><div class="ss-chunk">${html}</div>`;
    const c = el.querySelectorAll(':scope > .ss-chunk');
    el.__ssH = Math.max(1, c[1].offsetTop - c[0].offsetTop);
    el.__ssLoop = true;
    if(st.pos > el.__ssH) st.pos = 0;                 // เนื้อหาเปลี่ยน สั้นลง → เริ่มหัวลิสต์
    el.scrollTop = st.pos;
  }
  if(!window.__ssRafOn){ window.__ssRafOn = true; requestAnimationFrame(sideScrollTick); }
}
let __ssLastTs = 0;
function sideScrollTick(ts){
  requestAnimationFrame(sideScrollTick);
  const dt = Math.min(0.06, (ts - __ssLastTs)/1000 || 0);
  __ssLastTs = ts;
  for(const id in sideScrollSt){
    const el = document.getElementById(id), st = sideScrollSt[id];
    if(!el || !el.clientHeight) continue;                      // จอนี้ถูกซ่อนอยู่
    if(!el.__ssLoop){                                          // เรนเดอร์ตอนจอซ่อน (วัด overflow ไม่ได้) → เช็กซ้ำตอนโผล่
      if(el.scrollHeight - el.clientHeight > 8) initSideScroll(el);
      continue;
    }
    if(st.hold || Date.now() < st.until){ st.pos = el.scrollTop; continue; }  // ผู้ใช้ถืออยู่/เพิ่งปล่อย
    st.pos += SIDE_SCROLL_SPEED * dt;
    if(st.pos >= el.__ssH) st.pos -= el.__ssH;
    el.scrollTop = st.pos;
  }
}

/* ============================================================
   Daily Quest (item 3): การ์ดภารกิจวันนี้ใน aside ขวา
   ทุกคนได้ชุดเดียวกัน (seed จากวันที่) · questEvent ใน state.js เรียก re-render ให้เอง
   รอบ 150: ภารกิจเพิ่งสำเร็จ → เด้งเลื่อนกล่องไปโชว์แถวนั้น + แฟลชเขียว ค่อยวนต่อ
   (สำเร็จตอนอยู่หน้าเกม = จำค้างไว้ กลับเข้า lobby ค่อยแฟลชให้เห็น)
   ============================================================ */
const QUEST_FLASH_HOLD = 5000;        // ms ค้างโชว์แถวที่เพิ่งสำเร็จ ก่อนกลับไปเลื่อนวนต่อ
let __qDoneSeen = null;               // done ids ที่เห็นรอบก่อน (null = ยังไม่เคยเรนเดอร์ ไม่นับของเก่าตอน login)
let __qFlashPend = null;              // ภารกิจรอแฟลช (สำเร็จตอนกล่องถูกซ่อน เช่น อยู่หน้าเกมจับคู่)

/* รอบ 708 (สเปกผู้ใช้ "ทีละภารกิจ ค้างไว้ 10 วิ แล้วเลื่อน เหมือนฟีดเพื่อน"): เลิกพลิกการ์ด 3D →
   เด้ค scroll-snap เหมือนฟีดเพื่อน (ดู fd-* ด้านบน) + แถบนับเวลา #q-prog-bar + ปุ่ม 🚀 ไปทำเลย + จุดบอกตำแหน่ง
   แตะการ์ด = เลื่อนใบถัดไปทันที (พัก auto 8 วิ) · ภารกิจเพิ่งสำเร็จ = เด้งไปใบนั้น แฟลชเขียว ค้าง 5 วิ */
const QUEST_SLIDE_MS  = 10000;   // ค้างภารกิจละกี่ ms ก่อนเลื่อนถัดไป (เท่าฟีดเพื่อน 10 วิ)
const QUEST_RESUME_MS = 12000;   // แตะ/เลื่อนเอง → หยุดออโต้กี่ ms ก่อนวนต่อ (เท่าฟีดเพื่อน)
let __qIdx = 0, __qAt = 0, __qHold = 0;   // ใบที่โชว์ · เวลาเริ่มนับรอบนี้ · เวลาห้าม auto-เลื่อนถึง

function questGo(qid){                 // ปุ่ม 🚀 พาไปที่ที่ต้องทำ — คลิกปุ่ม/เรียก handler เดิม (guard ครบในตัว)
  sfx.select();
  if(qid === 'match20' || qid === 'replay2'){ const b = document.getElementById('btn-play'); if(b) b.click(); }
  else if(qid === 'quiz1'){ const b = document.getElementById('btn-cats'); if(b) b.click(); }
  else if(qid === 'word3d3'){ if(typeof railWorldClick === 'function') railWorldClick('adv'); }
  else if(qid === 'feed1'){ if(typeof openPetInfoOverlay === 'function') openPetInfoOverlay(); }
  else if(qid === 'produce1'){ const b = document.querySelector('.lobby-rail [data-panel="panel-factory"]'); if(b) b.click(); }
}

/* 🆕 รอบ 603: คอลัมน์ขวาสูงพอ (กลุ่มอันดับถูกถอดรอบ 594) → การ์ดภารกิจโชว์เต็มใบได้
   สูงกว่าเกณฑ์ = ถอด q-fit (โชว์แถบความคืบหน้า + จุดบอกใบ + บรรทัดโบนัส) · เตี้ยกว่า = หด 2 บรรทัดเหมือนเดิม
   เกณฑ์ผูกกับ "ความสูงคอลัมน์" ไม่ใช่ "ที่ว่างที่เหลือ" — ที่ว่างเปลี่ยนตามคลาสนี้เอง จะสลับไปมาไม่จบ */
const SIDE_TALL_MIN = 400;
function sideIsTall(){
  const s = document.querySelector('.lobby-side');
  return !!s && s.clientHeight >= SIDE_TALL_MIN;
}

function qBigCardHTML(qs, idx, flashId, opt){
  const q = qs[idx];
  const done = state.quests.done.includes(q.id);
  const prog = Math.min(q.target, state.quests.prog[q.id]||0);
  const pct = done ? 100 : Math.round(prog/q.target*100);
  const dots = qs.map((x,i)=>`<span class="q-dot ${i===idx?'on':''} ${state.quests.done.includes(x.id)?'ok':''}"></span>`).join('');
  return `<div class="q-bigcard${opt&&opt.clone?' q-clone':''} ${done?'done':''} ${flashId===q.id?'q-flash':''}" data-qid="${q.id}">
      <div class="qb-top"><span class="qb-emoji">${q.emoji}</span><div class="qb-name">${q.name}</div></div>
      <div class="qb-bar"><i style="width:${pct}%"></i></div>
      <div class="qb-row">
        <span class="qb-prog">${done ? '✅ สำเร็จแล้ว' : `<b>${prog}</b>/${q.target}`}</span>
        <span class="qb-reward">+${q.reward}🪙</span>
        ${done ? '' : `<button class="qb-go" data-qid="${q.id}">🚀 ไปทำเลย</button>`}
      </div>
      <div class="q-dots">${dots}<span class="q-bonus">${state.quests.allDone
        ? `🏆 รับโบนัสครบ ${QUEST_PER_DAY} แล้ว +${QUEST_ALL_BONUS}🪙`
        : `ครบ ${QUEST_PER_DAY} ภารกิจ โบนัส +${QUEST_ALL_BONUS}🪙`}</span></div>
    </div>`;
}

function qDeckGo(el, i, animate){                        // เลื่อนไปใบที่ i (ตรรกะเดียวกับ feedDeckGo)
  const h = el.clientHeight;
  if(!h) return;
  __qIdx = i;
  const top = i * h;
  el.__prog = Date.now() + 1100;                          // ช่วงที่เราสั่งเลื่อนเอง ห้ามนับเป็น "ผู้ใช้เลื่อน"
  el.scrollTo({top, behavior: animate ? 'smooth' : 'auto'});
  setTimeout(()=>{
    if(document.getElementById('quest-card') !== el) return;
    if(Math.abs(el.scrollTop - top) > 4){ el.__prog = Date.now() + 300; el.scrollTop = top; }
  }, 700);
  if(i >= el.__n){                                        // ถึงใบโคลน → ตัดกลับใบแรกแบบไม่มีอนิเมชัน
    setTimeout(()=>{
      const cur = document.getElementById('quest-card');
      if(cur !== el || !el.clientHeight) return;
      __qIdx = 0; el.__prog = Date.now() + 300;
      el.scrollTo({top:0, behavior:'auto'});
    }, 820);
  }
}
function qDeckTick(){
  const el  = document.getElementById('quest-card');
  const bar = document.getElementById('q-prog-bar');
  if(!el || !el.classList.contains('q-deck') || !el.clientHeight || (el.__n || 0) < 2){
    if(bar) bar.style.width = '0%';
    return;
  }
  const now = Date.now();
  if(now < __qHold){                                      // ผู้ใช้เพิ่งแตะ/เลื่อนเอง = พัก
    __qIdx = Math.round(el.scrollTop / el.clientHeight);
    __qAt  = now;
    if(bar) bar.style.width = '0%';
    return;
  }
  const p = Math.min(1, (now - __qAt) / QUEST_SLIDE_MS);
  if(bar) bar.style.width = (p * 100).toFixed(1) + '%';
  if(p < 1) return;
  __qAt = now;
  qDeckGo(el, __qIdx + 1, true);
}

function renderQuestCard(){
  const el = document.getElementById('quest-card');
  if(!el || typeof state === 'undefined' || !state.student) return;
  questTick();
  delete sideScrollSt[el.id];            // เด็คเลื่อนเอง — กัน ticker รอบ 149 มาห่อ ss-chunk ซ้อน
  const qs = questsToday();
  // ภารกิจที่เพิ่งสำเร็จ (ไม่นับชุดที่ done อยู่แล้วตอนเปิดเกม) → เด้งไปใบนั้น
  const doneNow = state.quests.done.slice();
  if(__qDoneSeen !== null){
    const fresh = doneNow.filter(id=>!__qDoneSeen.includes(id));
    if(fresh.length) __qFlashPend = fresh[fresh.length-1];
  }
  __qDoneSeen = doneNow;
  const visible = el.offsetParent !== null;
  if(!visible) el.__hSized = false;      // ซ่อนอยู่ (ไม่ได้อยู่หน้า lobby) → รอบหน้าที่โผล่มาต้องวัดสูงใหม่เสมอ กันค้างที่ 0px
  let flashId = null, jumpIdx = -1;
  if(__qFlashPend && visible){   // กล่องมองเห็นอยู่ค่อยแฟลช (ซ่อนอยู่ = รอรอบเรนเดอร์ตอนกลับ lobby)
    const i = qs.findIndex(q=>q.id === __qFlashPend);
    if(i >= 0){ jumpIdx = i; flashId = __qFlashPend; }
    __qFlashPend = null;
  }
  const sig = qs.map(q=>`${q.id}:${state.quests.prog[q.id]||0}:${state.quests.done.includes(q.id)}`).join('|') + `|${state.quests.allDone}`;
  const fitOn = !sideIsTall();           // รอบ 178 (สเปกผู้ใช้): จอเตี้ย = หดพอดี 2 บรรทัด (ชื่อ+แถวรางวัล) — ซ่อนแถบ/จุดใน CSS ฟอนต์ขนาดปกติ
  const fitChanged = el.classList.contains('q-fit') !== fitOn;
  el.classList.toggle('q-fit', fitOn);
  if(!(el.__sig === sig && el.classList.contains('q-deck') && !flashId)){
    el.__sig = sig;
    el.classList.add('q-deck');
    el.innerHTML = qs.map((q,i)=>qBigCardHTML(qs, i, flashId)).join('')
      + (qs.length > 1 ? qBigCardHTML(qs, 0, null, {clone:true}) : '');   // โคลนใบแรกท้ายสุด = วนขึ้นได้ไม่มีสะดุด
    el.__n = qs.length;
    if(jumpIdx >= 0) __qIdx = jumpIdx; else __qIdx = Math.min(__qIdx, qs.length - 1);
    __qAt = Date.now();
    if(jumpIdx >= 0) __qHold = Date.now() + QUEST_FLASH_HOLD;
    el.__hSized = false;                 // เนื้อหาเปลี่ยน (ขนาดอาจเปลี่ยนตาม) → วัดสูงใหม่
  }
  if(visible && (!el.__hSized || fitChanged)){
    const card = el.querySelector('.q-bigcard');   // .q-bigcard เป็น height:auto (ไม่ใช่ %) วัดตรงได้เลย ไม่ต้องคลาย/รีเซ็ตอะไรก่อน
    const h = card ? card.offsetHeight : 0;
    if(h){ el.style.height = h + 'px'; el.__hSized = true; }   // กล่องหดพอดี "1 ใบ" (สูงเท่าใบแรก ทุกใบสูงเท่ากัน)
  }
  if(el.clientHeight) el.scrollTop = __qIdx * el.clientHeight;
  if(!el.dataset.bound){                 // element สร้างใหม่ทุก renderDashboard → ผูกใหม่ได้เสมอ
    el.dataset.bound = '1';
    const hold = ()=>{ __qHold = Date.now() + QUEST_RESUME_MS; };
    el.addEventListener('pointerdown', hold);
    el.addEventListener('touchstart', hold, {passive:true});
    el.addEventListener('wheel', hold, {passive:true});
    el.addEventListener('scroll', ()=>{ if(Date.now() > (el.__prog || 0)) hold(); }, {passive:true});
    el.addEventListener('click', (e)=>{
      const go = e.target.closest('.qb-go');
      if(go){ questGo(go.dataset.qid); return; }
      if(e.target.closest('.q-bigcard')){ sfx.select(); __qHold = Date.now() + 8000; qDeckGo(el, __qIdx + 1, true); }
    });
  }
  if(!window.__qDeckTimer) window.__qDeckTimer = setInterval(qDeckTick, 200);
}

/* helper ร่วม (รอบ 150/152): เลื่อนกล่อง aside ไปโชว์แถวที่ match sel + ติด class แฟลช
   แล้วค้างไว้ QUEST_FLASH_HOLD ก่อนกลับไปเลื่อนวนต่อ */
function sideFlashRows(el, sel, cls){
  const st = sideScrollSt[el.id];
  const rows = el.querySelectorAll(sel);                           // มีทั้งในสำเนา 1+2 ตอนวนลูป
  if(!st || !rows.length) return;
  rows.forEach(r=>r.classList.add(cls));
  const base = el.querySelector(':scope > .ss-chunk') || el;       // เทียบตำแหน่งจากสำเนาแรก
  let top = rows[0].offsetTop - base.offsetTop - 4;
  const max = el.__ssLoop ? el.__ssH - 1 : Math.max(0, el.scrollHeight - el.clientHeight);
  top = Math.max(0, Math.min(top, max));
  st.pos = top;
  el.scrollTop = top;
  st.hold = false;
  st.until = Date.now() + QUEST_FLASH_HOLD;
}

/* questFlashRow (รอบ 150) ถูกแทนด้วยเด็คการ์ดรอบ 170/704 — แฟลชผ่าน flashId ใน qBigCardHTML แทน */

/* รอบ 152: ตรวจเพื่อนใหม่เพิ่งออนไลน์ (เฉพาะโหมดออนไลน์จริง — เพื่อนจำลองไม่นับ) */
const FRIEND_FLASH_GRACE = 8000;      // ms หลังต่อออนไลน์สำเร็จ ค่อยเริ่มนับเพื่อนใหม่ (กัน sync ชุดแรกสแปม)
let __onSeen = null;                  // friend ids ที่เห็นรอบก่อน (null = ยังไม่เคยเรนเดอร์โหมดออนไลน์)
let __onFirstTs = 0;                  // เวลาเรนเดอร์โหมดออนไลน์ครั้งแรก
let __onFlashPend = null;             // เพื่อนรอแฟลช (โผล่ตอนกล่องถูกซ่อน เช่น อยู่หน้าเกม)

/* รอบ 178 (สเปกผู้ใช้): กล่องเพื่อนออนไลน์ = พลิกหน้าทีละคน (1 แถว = 2 บรรทัด: ชื่อ+กิจกรรม)
   พลิก 180° (ครึ่งออก+ครึ่งเข้า rotateX แบบเด็คภารกิจ) วนอัตโนมัติ · แตะ = หยุด ·
   ลากขึ้น/ลง = พลิกทีละหน้าตามจังหวะนิ้ว · ปล่อยนิ้วเกิน 5 วิ = พลิกวนต่อเอง ไม่มีวันหยุด */
const ONLINE_FLIP_MS = 5000;          // จังหวะพลิกอัตโนมัติ
const ONLINE_FLIP_RESUME = 5000;      // ms หลังปล่อยนิ้วค่อยพลิกต่อ (ตามสเปก 5 วิ)
const ONLINE_SWIPE_STEP = 34;         // ลากกี่ px = พลิก 1 หน้า
let __onPages = [], __onPage = 0, __onHold = 0;
let __onDownY = null, __onAcc = 0, __onSwiped = false;

/* 🆕 รอบ 603: กล่องเพื่อนกินที่ว่างที่เหลือของคอลัมน์ (กลุ่มอันดับถูกถอดรอบ 594)
   → 1 หน้าใส่เพื่อนได้หลายคนตามที่วัดได้จริง (จอเตี้ยก็ยังได้อย่างน้อย 1 คนเหมือนเดิม)
   เด็กเห็นเพื่อนทั้งกลุ่มพร้อมกัน ไม่ต้องรอพลิกทีละคน · หน้าเดียวจบ = ไม่พลิกเลย */
const ONLINE_ROW_H = 38;              // ความสูงสำรองของ 1 แถว (ชื่อ+กิจกรรม) ก่อนวัดของจริงได้
let __onRowH = 0, __onBuiltPP = 0;    // ความสูงแถวที่วัดได้ · จำนวนแถวที่กล่อง "รับไหว" ตอนสร้างหน้าล่าสุด
let __onRowsPP = 1;                   // จำนวนแถวจริงต่อหน้า (เกลี่ยแล้ว) — ใช้หาเลขหน้าตอนแฟลชเพื่อนใหม่
function onPerPage(){
  const el = document.getElementById('online-card');
  const h = el ? el.clientHeight : 0;
  if(!h) return __onBuiltPP || 1;     // กล่องถูกซ่อน (วัดไม่ได้) → คงค่าเดิม อย่าเพิ่งหั่นใหม่
  return Math.max(1, Math.floor(h / (__onRowH || ONLINE_ROW_H)));
}
function onChunk(rows){               // หั่นลิสต์แถวเป็นหน้า ๆ ละเท่าที่ใส่ได้
  const cap = onPerPage(), out = [];
  __onBuiltPP = cap;
  // เกลี่ยให้ทุกหน้ามีคนใกล้เคียงกัน (8 คน กล่องรับ 7 → 4+4 ไม่ใช่ 7+1 ที่หน้าหลังโล่ง)
  const per = Math.max(1, Math.ceil(rows.length / Math.max(1, Math.ceil(rows.length / cap))));
  __onRowsPP = per;
  for(let i = 0; i < rows.length; i += per) out.push(rows.slice(i, i+per).join(''));
  return out;
}

const ONLINE_GAP_MAX = 22;            // ระยะห่างสูงสุดระหว่างแถว (กันแถวลอยห่างกันบนจอสูงมาก)
function onPageSpread(el){            // เกลี่ยแถวให้เต็มกล่องเท่าที่สวย — เหลือเกินเพดานก็จับกลุ่มไว้กลางกล่อง
  const p = el.querySelector('.on-page');
  if(!p || !p.children.length) return;
  const kids = [...p.children];
  const used = kids.reduce((a,c)=>a + c.getBoundingClientRect().height, 0);
  const free = el.clientHeight - used;
  p.style.gap = Math.max(1, Math.min(ONLINE_GAP_MAX, free/(kids.length + 1))).toFixed(1) + 'px';
}

function onPageDraw(cls){
  const el = document.getElementById('online-card');
  if(!el) return;
  if(!__onPages.length){ el.innerHTML = ''; return; }
  if(__onPage >= __onPages.length) __onPage = 0;
  el.innerHTML = `<div class="on-page${cls ? ' ' + cls : ''}">${__onPages[__onPage]}</div>`;
  const row = el.querySelector('.online-row');            // วัดแถวจริง 1 ครั้ง (ใช้หั่นหน้ารอบถัดไป)
  if(row){ const h = row.getBoundingClientRect().height; if(h > 8) __onRowH = h + 2; }
  onPageSpread(el);
  if(cls) setTimeout(()=>{ const p = el.querySelector('.on-page'); if(p) p.classList.remove(cls); }, 320);
}
function onPageFlip(dir){
  const el = document.getElementById('online-card');
  if(!el || __onPages.length < 2) return;
  const noAnim = document.documentElement.classList.contains('no-anim');
  const go = ()=>{ __onPage = (__onPage + dir + __onPages.length) % __onPages.length;
    onPageDraw(noAnim ? '' : (dir > 0 ? 'flip-in-up' : 'flip-in-down')); };
  const p = el.querySelector('.on-page');
  if(noAnim || !p){ go(); return; }
  p.classList.add(dir > 0 ? 'flip-out-up' : 'flip-out-down');
  setTimeout(go, 160);
}
function bindOnlinePager(el){
  if(el.dataset.pager) return;         // element ใหม่ทุก renderDashboard → ผูกใหม่ได้เสมอ
  el.dataset.pager = '1';
  el.addEventListener('pointerdown', e=>{ __onDownY = e.clientY; __onAcc = 0; __onSwiped = false;
    __onHold = Date.now() + 9e9; });   // นิ้วแตะค้าง = หยุดพลิกไปก่อน (ตั้งเวลาจริงตอนปล่อย)
  el.addEventListener('pointermove', e=>{
    if(__onDownY === null) return;
    const dy = e.clientY - __onDownY;
    if(Math.abs(dy - __onAcc) >= ONLINE_SWIPE_STEP){       // ทุกๆ ระยะลาก = พลิก 1 หน้า ตามจังหวะนิ้ว
      const dir = (dy - __onAcc) < 0 ? 1 : -1;             // ลากขึ้น = หน้าถัดไป (เหมือนเลื่อนอ่านต่อ)
      __onAcc = dy; __onSwiped = true;
      onPageFlip(dir);
    }
  });
  // ลากแล้วปล่อยบนแถว — กันเด้งเมนูเพื่อน (click delegation ที่ document) · จับที่ capture ก่อนถึงมัน
  el.addEventListener('click', e=>{ if(__onSwiped){ e.stopPropagation(); e.preventDefault(); __onSwiped = false; } }, true);
  el.addEventListener('wheel', ()=>{ __onHold = Date.now() + ONLINE_FLIP_RESUME; }, {passive:true});
  el.addEventListener('wheel', e=>{ onPageFlip(e.deltaY > 0 ? 1 : -1); }, {passive:true});
  if(!window.__onGestUp){               // ปล่อยนิ้วที่ไหนก็ได้ = เริ่มนับ 5 วิ (ผูกครั้งเดียวระดับ window)
    window.__onGestUp = true;
    const up = ()=>{ if(__onDownY === null) return; __onDownY = null;
      __onHold = Date.now() + ONLINE_FLIP_RESUME; };
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
  }
  if(!window.__onFlipTimer) window.__onFlipTimer = setInterval(()=>{
    const box = document.getElementById('online-card');
    if(!box || !box.clientHeight) return;                  // จอถูกซ่อน
    /* รอบ 603: ที่ว่างเปลี่ยน (เพิ่งเปิดล็อบบี้/หมุนจอ/ย่อหน้าต่าง) → หั่นหน้าใหม่ให้พอดีก่อนพลิก */
    if(onPerPage() !== __onBuiltPP){ renderOnlineCard(); return; }
    if(Date.now() < __onHold) return;                      // ผู้ใช้กำลังแตะ/เพิ่งปล่อย
    onPageFlip(1);
  }, ONLINE_FLIP_MS);
}

/* รอบ 1080: รายชื่อออนไลน์ใช้ ticker เลื่อนขึ้นต่อเนื่องเหมือน "Feed ทุกคน"
   (initSideScroll: วนไร้รอยต่อ · แตะ/ลากหยุดอ่าน · ปล่อย 5 วิเลื่อนต่อ) */
function drawOnlineTicker(rows, flashSel){
  const el = document.getElementById('online-card');
  if(!el) return;
  el.innerHTML = rows.join('');
  initSideScroll(el);
  if(flashSel) sideFlashRows(el, flashSel, 'on-flash');
}

function renderOnlineCard(){
  const el = document.getElementById('online-card');
  if(!el) return;
  const lab = document.getElementById('online-label');  // หัวข้อนอกกล่อง (รอบ 149) — ติดป้าย "ออนไลน์จริง" เมื่อต่อ Firebase สำเร็จ
  const sub = document.getElementById('online-sub');     // เลิกใช้แยกบรรทัด (รอบ N) — ยุบรวมกับ lab เป็นบรรทัดเดียว "กำลังออนไลน์ N คน"
  if(sub) sub.textContent = '';                           // เคลียร์ของเก่าเสมอ (กันค้างจากโหมดก่อนหน้า)
  const meName = state.profileName || (state.student ? state.student.first : '') || selfTag();
  const meGrade = state.student ? state.student.grade : '';
  const meUid = (typeof onlineKey === 'function') ? onlineKey() : '';
  const meBadges = (typeof badgeSuffix === 'function') ? badgeSuffix() : '';   // 🎖️ เข็มของเราต่อท้ายชื่อ (โชว์ทันทีจาก state)
  const meAv = (typeof photoMiniHTML === 'function') ? photoMiniHTML(meUid, 'online-ava') : '';
  const meRow = `<div class="online-row online-me${meAv ? ' has-ava' : ''}">
      <span class="online-dot"></span>
      ${meAv}
      <span class="online-name pl-click" data-uid="${escapeHTML(meUid)}" data-n="${escapeHTML(meName + meBadges)}" data-g="${escapeHTML(meGrade)}">⭐ ${escapeHTML(meName)} (${selfTag()})</span>
      ${gradeMark(meGrade, 'gm-row')}
      <span class="online-act">${idTag(meUid)} · กำลังเล่นอยู่ตอนนี้</span>
    </div>`;

  /* ---- โหมดออนไลน์จริง ---- */
  if(typeof Online !== 'undefined' && Online.ready){
    if(lab) lab.innerHTML = `🧑‍🤝‍🧑 กำลังออนไลน์ ${Online.friends.length + 1} คน 💚 <span class="online-live">🌏 ออนไลน์จริง</span>`;
    /* รอบ 152: เพื่อนใหม่เพิ่งออนไลน์ → toast + หน้าแฟลชฟ้า (ชุดแรกตอนต่อสำเร็จไม่นับ กันสแปม) */
    const ids = Online.friends.map(f=>String(f.id||'')).filter(Boolean);
    if(__onSeen === null){
      __onSeen = ids; __onFirstTs = Date.now();
    }else{
      const fresh = ids.filter(id=>!__onSeen.includes(id));
      __onSeen = ids;
      if(fresh.length && Date.now() - __onFirstTs > FRIEND_FLASH_GRACE){
        __onFlashPend = fresh[0];
        const f = Online.friends.find(x=>String(x.id) === __onFlashPend);
        if(typeof toast === 'function')
          toast(fresh.length > 1 ? `🎉 เพื่อน ${fresh.length} คนมาออนไลน์แล้ว!`
                                 : `🎉 ${f ? f.n : 'เพื่อน'} มาออนไลน์แล้ว!`);
        if(typeof sfx !== 'undefined' && sfx.select) sfx.select();
      }
    }
    let flashFid = null, flashInv = null;    // กล่องมองเห็นอยู่ค่อยใช้ (ซ่อนอยู่ = pend รอตอนกลับ lobby)
    if(el.clientHeight){
      if(__onFlashPend){ flashFid = __onFlashPend; __onFlashPend = null; }
      if(window.__invFlashPend){ flashInv = window.__invFlashPend; window.__invFlashPend = null; }
    }
    /* รอบ 153: แถวเพื่อน = เมนูลัดทั้งแถว · รอบ 178: 1 แถว (2 บรรทัด) = 1 หน้าพลิก */
    const rows = Online.friends.map(f=>{
      const fid = String(f.id||'');
      const fAv = (typeof photoMiniHTML === 'function') ? photoMiniHTML(fid, 'online-ava') : '';
      const fNameOnly = (typeof splitNameBadges === 'function') ? splitNameBadges(f.n).name : f.n;
      return `<div class="online-row${flashFid === fid ? ' on-flash' : ''}${fAv ? ' has-ava' : ''}" data-fid="${escapeHTML(fid)}" data-n="${escapeHTML(f.n)}" data-g="${escapeHTML(f.g)}">
      <span class="online-dot"></span>
      ${fAv}
      <span class="online-name">${escapeHTML(fNameOnly)}</span>
      ${gradeMark(gradeOf(fid, f.g), 'gm-row')}
      <span class="online-act">${idTag(fid)} · ${escapeHTML(f.act)}</span>
    </div>`;
    });
    bindPlayerClicks();
    bindFriendQuickMenu();
    /* รอบ 154: การ์ดคำชวน — หน้าของตัวเอง (สำคัญ มีปุ่ม) · "ไว้ก่อน" = ซ่อนเฉพาะเซสชัน */
    if(!Online.tinvHidden) Online.tinvHidden = {};
    const TINV_W = {adv:{ico:'🌍',label:'ผจญภัย'}, haunt:{ico:'👻',label:'ผีสิง'}, heli:{ico:'🚁',label:'เฮลิคอปเตอร์'}};
    const invEntries = Object.entries(Online.tinv || {}).filter(([fid])=>!Online.tinvHidden[fid]);
    const invs = invEntries.map(([fid,v])=>{
      const w = TINV_W[v.map] || {ico:'🌍', label:'3D'};
      return `<div class="inv-card${flashInv === fid ? ' on-flash' : ''}" data-fid="${escapeHTML(fid)}">
        <div class="inv-txt">📨 <b>${escapeHTML(v.n)}</b> ชวนไปเล่น<b>โลก${w.label} ${w.ico}</b><br>เจอกันใน map รับคนละ 🪙${fmtNum(TINV_CASHBACK)}!</div>
        <div class="inv-btns">
          <button class="inv-go" data-map="${escapeHTML(v.map)}" type="button">🚀 ไปเลย!</button>
          <button class="inv-x" data-fid="${escapeHTML(fid)}" type="button">ไว้ก่อน</button>
        </div>
      </div>`;
    });
    bindInviteCards();
    /* รอบ 1080: การ์ดคำชวน + รายชื่อทั้งหมดอยู่ใน ticker เดียว เลื่อนขึ้นเหมือน Feed ทุกคน */
    const bodyRows = [meRow, ...rows];
    if(!rows.length) bodyRows.push('<div class="online-note">ยังไม่มีเพื่อนคนอื่นออนไลน์ตอนนี้ — ชวนเพื่อนมาเล่นด้วยกันสิ! 🎉</div>');
    const flashSel = flashInv !== null ? `.inv-card[data-fid="${CSS.escape(flashInv)}"]`
                   : flashFid !== null ? `.online-row[data-fid="${CSS.escape(flashFid)}"]` : '';
    drawOnlineTicker([...invs, ...bodyRows], flashSel);
    return;
  }
  __onSeen = null;                           // หลุดออนไลน์ → เริ่มนับใหม่ตอนต่อกลับ (กันเน็ตกระพริบสแปม toast)

  /* ---- โหมดออฟไลน์: เพื่อนจำลองเดิม ---- */
  const seed = Math.floor(Date.now()/(5*60*1000));      // ชุดรายชื่อเปลี่ยนทุก 5 นาที
  const rnd = seededRand(seed * 7919);
  const count = Math.min(ONLINE_NAMES.length, onlineBaseCount(thHour()) + Math.floor(rnd()*3));   // 🇹🇭 รอบ 988
  const pool = ONLINE_NAMES.slice();
  for(let i=pool.length-1;i>0;i--){                     // สับไพ่แบบ deterministic
    const j = Math.floor(rnd()*(i+1));
    [pool[i],pool[j]] = [pool[j],pool[i]];
  }
  const friends = pool.slice(0, count);
  const rows = friends.map(f=>`<div class="online-row">
      <span class="online-dot"></span>
      <span class="online-name">${f.n}</span>
      <span class="online-act">${idTag(f.n)} · ${ONLINE_ACTIVITIES[Math.floor(rnd()*ONLINE_ACTIVITIES.length)]}</span>
    </div>`);
  if(lab) lab.innerHTML = `🧑‍🤝‍🧑 กำลังออนไลน์ ${count + 1} คน 💚`;
  drawOnlineTicker([meRow, ...rows], '');
  bindPlayerClicks();
}

/* ============================================================
   รอบ 153: เมนูลัดแตะแถวเพื่อนออนไลน์ในกล่อง aside
   🤝 ชวนเล่นโลก 3D (tinv — เจอกันรับเงินคืน) · 🎁 ของขวัญ · 💬 ทักทาย (เฉพาะเพื่อนกันแล้ว)
   ยังไม่เป็นเพื่อน = ➕ ส่งคำขอเป็นเพื่อน · 👤 ดูข้อมูล (แทน pl-click ที่ชื่อแบบเดิม)
   ============================================================ */
/* รอบ 154: ปุ่มบนการ์ดคำชวนในกล่องเพื่อนออนไลน์ — 🚀 ไปเลย! / ไว้ก่อน (ผูกครั้งเดียว)
   🚀 ใช้ railWorldClick ของปุ่มรางโลก 3D: บาดเจ็บ→ชวนไปรักษา · ไม่มีตั๋ว→พาไปการ์ดซื้อในร้าน · มีตั๋ว→เข้าโลกเลย */
function bindInviteCards(){
  if(window.__invBound) return;
  window.__invBound = true;
  document.addEventListener('click', (e)=>{
    const go = e.target.closest('#online-card .inv-go');
    if(go){
      const w = (typeof WORLD3D !== 'undefined') ? WORLD3D.find(x=>x.mode === go.dataset.map) : null;
      if(w) railWorldClick(w);
      return;
    }
    const x = e.target.closest('#online-card .inv-x');
    if(x){
      if(!Online.tinvHidden) Online.tinvHidden = {};
      Online.tinvHidden[x.dataset.fid] = true;   // ซ่อนเฉพาะเซสชัน — คำชวนใน DB ยังอยู่ เข้าเกมใหม่เห็นอีก
      sfx.select();
      renderOnlineCard();
    }
  });
}

function bindFriendQuickMenu(){
  if(window.__fqBound) return;               // ผูก listener ครั้งเดียว (การ์ด re-render บ่อย)
  window.__fqBound = true;
  document.addEventListener('click', (e)=>{
    const row = e.target.closest('#online-card .online-row[data-fid]');
    if(!row) return;
    openFriendQuickMenu(row.dataset.fid, row.dataset.n || 'เพื่อน', row.dataset.g || '');
  });
}

function openFriendQuickMenu(uid, name, grade){
  if(!uid || typeof Online === 'undefined' || !Online.ready) return;
  sfx.select();
  document.querySelectorAll('.fq-overlay').forEach(o=>o.remove());   // เปิดซ้ำ = แทนที่อันเก่า
  const isFriend = (Online.myFriends || []).some(f=>f.uid === uid);
  const canInvite = (typeof tinvPeerOnline === 'function') && tinvPeerOnline(uid);
  const sp = (typeof splitNameBadges === 'function') ? splitNameBadges(name) : {name, badges:''};
  const sent = state.tinvSent || {};
  const wbtn = (map, emo, lab)=>{
    const s = sent[uid] && sent[uid].map === map;                    // ชวนโลกนี้ไปแล้ว = ติ๊กถูก กดซ้ำไม่ได้
    return `<button class="fq-world" data-map="${map}" ${s ? 'disabled' : ''} type="button">${emo} ${lab}${s ? ' ✓' : ''}</button>`;
  };
  const overlay = document.createElement('div');
  overlay.className = 'fq-overlay';
  overlay.dataset.tinvUid = uid;
  overlay.innerHTML = `<div class="fq-box">
    <div class="fq-head">
      <span>🧑‍🤝‍🧑 ${escapeHTML(sp.name)}${escapeHTML(sp.badges)} <small>${idTag(uid)}</small>${gradeMark(gradeOf(uid, grade))}</span>
      <button class="fq-close" type="button">✕</button>
    </div>
    ${canInvite ? `<div class="fq-sec">🤝 ชวนเล่นด้วยกัน — เจอกันใน map รับคนละ 🪙${fmtNum(TINV_CASHBACK)}</div>
    <div class="fq-worlds">${wbtn('adv','🌍','ผจญภัย')}${wbtn('haunt','👻','ผีสิง')}${wbtn('heli','🚁','เฮลิฯ')}</div>` : ''}
    <div class="fq-acts">
      ${isFriend
        ? `<button class="fq-act" data-act="gift" type="button">🎁 ส่งของขวัญ</button>
           <button class="fq-act" data-act="chat" type="button">💬 ทักทาย</button>`
        : `<button class="fq-act" data-act="addfr" type="button">➕ ส่งคำขอเป็นเพื่อน</button>`}
      <button class="fq-act" data-act="info" type="button">👤 ดูข้อมูล</button>
    </div>
  </div>`;
  document.body.appendChild(overlay);
  const close = ()=>overlay.remove();
  overlay.addEventListener('click', e=>{ if(e.target === overlay) close(); });
  overlay.querySelector('.fq-close').addEventListener('click', close);
  overlay.querySelectorAll('.fq-world').forEach(b=>b.addEventListener('click', ()=>{
    b.disabled = true;
    tinvSend(uid, b.dataset.map).then(()=>{
      state.tinvSent[uid] = {map: b.dataset.map, ts: Date.now()};
      saveState();
      sfx.buy();
      toast(`📨 ส่งคำชวนถึง ${sp.name} แล้ว! เข้าโลกรอเจอกันได้เลย`);
      close();
    }).catch(()=>{ b.disabled = false; toast('ส่งคำชวนไม่สำเร็จ ลองใหม่นะ'); });
  }));
  overlay.querySelectorAll('.fq-act').forEach(b=>b.addEventListener('click', ()=>{
    const act = b.dataset.act;
    close();
    if(act === 'gift') openGiftPicker({uid, n: sp.name, g: grade});
    else if(act === 'chat') openChat({uid, n: sp.name, g: grade});
    else if(act === 'addfr'){
      friendRequest(uid)
        .then(()=>{ sfx.buy(); toast(`📨 ส่งคำขอเป็นเพื่อนถึง ${sp.name} แล้ว! รอเพื่อนกดรับนะ 😊`); })
        .catch(()=>toast('ส่งคำขอไม่สำเร็จ ลองใหม่นะ'));
    }
    else if(act === 'info') showPlayerCard(uid, name, grade);
  }));
}

/* ============================================================
   การ์ด Leaderboard — สลับแท็บในการ์ดเดียว (ประหยัดพื้นที่):
   🪙 เหรียญ (นักสะสมเหรียญ Top 50) · 🏅 เข็ม (แต้มรวมเข็มสะสม)
   🤖 ล้มบอส (รอบ 228) · 🔎 ค้นหาคำ (คะแนนสะสม Top 100 · รางวัล Top 10)
   ⌨️ พิมพ์คำ (รอบ 649 — แต้มสะสมตลอดกาล Top 10 · กติกา/รางวัลเหมือน 🔎 เป๊ะ)
   ข้อมูลจริงจาก Firebase — ออฟไลน์โชว์ข้อความเชิญชวนแทน
   ============================================================ */
const LB_TABS = ['coins','assets','online','badges','boss','ws','pm','tp','bb','sg','bx','xr'];
const LB_ASSET_TOP = 100;                              // 🏆 ทรัพย์สินรวมโชว์ Top 100 · รางวัลรายเดือนยังเฉพาะ Top 10
const LB_ONLINE_TOP = 100;                             // 🌐 เหรียญออนไลน์สะสมตลอดกาล Top 100 · รางวัลเฉพาะ Top 10
const LB_WS_TOP = 10;                                  // 🔎 Top 10 ที่ได้รับรางวัลรายเดือน
const LB_WS_DISPLAY = 100;                             // 🔎 กระดานเต็มจอโชว์อันดับที่เหลือทั้งหมดเหมือนหมวดเหรียญ
const LB_PM_TOP = 10;                                  // 🖼️ Top 10 ที่ได้รับรางวัลรายเดือน
const LB_PM_DISPLAY = 100;                             // 🖼️ กระดานเต็มจอโชว์อันดับที่เหลือทั้งหมดเหมือนหมวดเหรียญ
const LB_TP_TOP = 10;                                  // ⌨️ Top 10 ที่ได้รับรางวัลรายเดือน
const LB_TP_DISPLAY = 100;                             // ⌨️ กระดานเต็มจอโชว์อันดับที่เหลือทั้งหมดเหมือนหมวดเหรียญ
const LB_BB_TOP = 10;                                  // 🫧 Top 10 ที่ได้รับรางวัลรายเดือน
const LB_BB_DISPLAY = 100;                             // 🫧 กระดานเต็มจอโชว์อันดับที่เหลือทั้งหมดเหมือนหมวดเหรียญ
const LB_SG_TOP = 10;                                  // 🎯 Top 10 ที่ได้รับรางวัลรายเดือน
const LB_SG_DISPLAY = 100;                             // 🎯 กระดานเต็มจอโชว์อันดับที่เหลือทั้งหมดเหมือนหมวดเหรียญ
let lbTab = 'coins';                                   // แท็บกระดานที่เปิดอยู่
function bindLbTabs(){
  if(window.__lbTabBound) return;                      // ผูก listener ครั้งเดียว (การ์ด re-render บ่อย)
  window.__lbTabBound = true;
  document.addEventListener('click', (e)=>{
    const t = e.target.closest('.lb-tab');
    if(!t || !t.dataset.tab) return;          // แท็บของกระดานเต็มจอใช้ data-t (มี handler ของตัวเอง) — ไม่ต้องรีเซ็ตการ์ดเล็ก
    lbTab = LB_TABS.indexOf(t.dataset.tab) >= 0 ? t.dataset.tab : 'coins';
    if(typeof sfx !== 'undefined' && sfx.click) sfx.click();
    renderLeaderboardCard();
  });
  // 🏆 รอบ 592: แถบ/ปุ่ม "กระดานประกาศรางวัล" (มีทั้งในการ์ดเล็กและกระดานเต็มจอ)
  // ⌨️ รอบ 649: .tpa-open = ของกระดาน ⌨️ พิมพ์คำ (คนละเครื่องจ่ายรางวัล คนละ snapshot)
  document.addEventListener('click', (e)=>{
    if(e.target.closest('.tpa-open')){
      e.stopPropagation();
      if(typeof TpAward !== 'undefined') TpAward.open();
      return;
    }
    if(e.target.closest('.bba-open')){
      e.stopPropagation();
      if(typeof BbAward !== 'undefined') BbAward.open();
      return;
    }
    // 🎯 รอบ 917: .sga-open = ของกระดาน 🎯 ยิงเป้าคำ (เครื่องจ่ายรางวัลตัวที่ 3 โรงงานเดียวกัน)
    if(e.target.closest('.sga-open')){
      e.stopPropagation();
      if(typeof SgAward !== 'undefined') SgAward.open();
      return;
    }
    // 🖼️ รอบ 979: .pma-open = ของกระดาน 🖼️ จับคู่ภาพ (เครื่องจ่ายรางวัลตัวที่ 4 โรงงานเดียวกัน)
    if(e.target.closest('.pma-open')){
      e.stopPropagation();
      if(typeof PmAward !== 'undefined') PmAward.open();
      return;
    }
    if(e.target.closest('.asa-open')){
      e.stopPropagation();
      if(typeof AssetAward !== 'undefined') AssetAward.open();
      return;
    }
    if(e.target.closest('.coa-open')){
      e.stopPropagation();
      if(typeof CoinAward !== 'undefined') CoinAward.open();
      return;
    }
    if(e.target.closest('.oca-open')){
      e.stopPropagation();
      if(typeof OnlineCoinAward !== 'undefined') OnlineCoinAward.open();
      return;
    }
    if(!e.target.closest('.wsa-open')) return;
    e.stopPropagation();
    if(typeof WsAward !== 'undefined') WsAward.open();
  });
}
/* 🥇 รอบ 594: การ์ดอันดับเล็กในคอลัมน์ขวาถูกถอดออก (ผู้ใช้สั่ง — บริเวณนั้นแออัด)
   ฟังก์ชันนี้จึงไม่ทำงานแล้ว (เจอ #leaderboard-card ไม่เจอ = คืนทันที) แต่คงไว้ให้ผู้เรียกเดิม
   (online.js / wsaward.js / wordsearch.js / renderDashboard) เรียกได้ปลอดภัย
   ทางเข้าอันดับตอนนี้ = ปุ่ม #btn-rail-rank ในรางซ้าย → openLeaderboardFull() */
/* 🥇 รอบ 595: ป้ายเลขอันดับตัวเองบนปุ่ม 🥇 ในราง (อันดับเหรียญ = แท็บหลัก)
   ไม่ออนไลน์/ยังไม่ติดกระดาน = ซ่อนป้าย · เรียกทุกครั้งที่ข้อมูลกระดานเปลี่ยน (ผ่าน renderLeaderboardCard) */
function updateRankRailBadge(){
  const b = document.getElementById('rank-badge');
  if(!b) return;
  let rank = 0;
  try{
    if(typeof Online !== 'undefined' && Online.ready){
      const i = lbRankRows('coins').findIndex(r=>r.me);
      if(i >= 0) rank = i + 1;
    }
  }catch(e){}
  b.textContent = rank ? String(rank) : '';
  b.style.display = rank ? '' : 'none';
  const btn = document.getElementById('btn-rail-rank');
  if(btn) btn.title = rank ? `ตอนนี้${selfPronoun()}อยู่อันดับที่ ${rank} ของกระดานเหรียญ 🪙` : 'ดูอันดับผู้เล่นทั้งหมด';
  rankUpCheck(rank, b, btn);
}
/* 🎉 รอบ 599: อันดับดีขึ้นกว่าครั้งก่อน (เลขน้อยลง) → ป้ายเด้ง+เรืองทอง 1 จังหวะ + ป้ายลูกศร ▲n ลอยขึ้น
   เทียบกับ state.rankSeen (อันดับที่เด็กเห็นล่าสุด) · ครั้งแรกที่ติดกระดานแค่จำไว้ ไม่เด้ง (ไม่มีของเก่าให้เทียบ)
   อันดับตกลง = จำเลขใหม่เงียบ ๆ ไม่ทักอะไร (ไม่ซ้ำเติมเด็ก) */
function rankUpCheck(rank, b, btn){
  const prev = state.rankSeen || 0;
  if(rank && prev && rank < prev){
    const up = prev - rank;
    b.classList.remove('rank-up'); void b.offsetWidth;   // รีสตาร์ต animation กรณีขึ้นติด ๆ กัน
    b.classList.add('rank-up');
    setTimeout(()=>b.classList.remove('rank-up'), 1500);
    if(btn && !document.documentElement.classList.contains('no-anim')){
      btn.querySelectorAll('.rank-up-pop').forEach(o=>o.remove());   // ขึ้นติด ๆ กัน = แทนที่อันเก่า ไม่ซ้อนกัน
      const p = document.createElement('span');
      p.className = 'rank-up-pop';
      p.textContent = `▲${up}`;
      btn.appendChild(p);
      setTimeout(()=>p.remove(), 1500);
    }
    rankUpSound(rank, up);
  }
  // ออฟไลน์/หลุดกระดานชั่วคราว (rank=0) ไม่ล้างความจำ — ไม่งั้นพอเน็ตกลับมาจะกลืนการไต่อันดับจริงไป
  let dirty = false;
  if(rank && rank !== prev){ state.rankSeen = rank; dirty = true; }
  // 🏅 รอบ 602: สถิติ "อันดับดีที่สุดที่เคยทำได้" — เก็บเลขน้อยสุดตลอดกาล อันดับตกแล้วไม่หาย
  if(rank && (!state.rankBest || rank < state.rankBest)){ state.rankBest = rank; dirty = true; }
  if(dirty) saveState();
}
/* 🔔 รอบ 600: เสียงตอนไต่อันดับ (ต่อยอดรอบ 599) — ใช้เสียงชุดเดิมของเกม ไม่สร้างเสียงใหม่
   ขึ้น 1-2 = กรุ๊งกริ๊งสั้น · 3-5 = กลาง · ≥6 = ยาว · ติด Top 3 = แฟนแฟร์ sfx.win (ก้าวใหญ่ ควรได้ฉลองเต็ม)
   ⚠️ ดังเฉพาะตอนอยู่หน้าล็อบบี้ — กระดานอัปเดตได้ตลอดแม้เด็กอยู่ในโลก 3D/กำลังสอบ เสียงโผล่มากลางคันจะรบกวน */
let __rankSndAt = 0;
function rankUpSound(rank, up){
  if(typeof sfx === 'undefined') return;
  const dash = document.getElementById('screen-dashboard');
  if(!dash || !dash.classList.contains('active')) return;
  const now = Date.now();
  if(now - __rankSndAt < 1500) return;      // ขึ้นรัว ๆ ไม่ให้เสียงซ้อนกัน
  __rankSndAt = now;
  if(rank <= 3 && sfx.win) sfx.win();
  else if(sfx.coinGetTier) sfx.coinGetTier(up >= 6 ? 2 : up >= 3 ? 1 : 0);
  else if(sfx.coinGet) sfx.coinGet();
}
function renderLeaderboardCard(){
  updateRankRailBadge();                 // 🥇 รอบ 595: ป้ายอันดับบนปุ่มราง (การ์ดเล็กถูกถอดแล้ว แต่ผู้เรียกเดิมยังพาข้อมูลใหม่มาให้)
  rankMoveFeedCheck();                   // 📈 ฟีดหัวจอ: รายงานเฉพาะผู้เล่นที่อันดับดีขึ้น
  const el = document.getElementById('leaderboard-card');
  if(!el) return;
  bindLbTabs();
  // รอบ 151: แท็บอยู่นอกกล่อง (แถวหัวข้อ #lb-tabs-out) — ไม่วนไปกับเนื้อหา
  const out = document.getElementById('lb-tabs-out');
  if(out) out.innerHTML = `
    <button class="lb-tab${lbTab==='coins' ? ' active' : ''}" data-tab="coins">🪙 เหรียญ</button>
    <button class="lb-tab${lbTab==='assets' ? ' active' : ''}" data-tab="assets">🏆 ทรัพย์สินรวม</button>
    <button class="lb-tab${lbTab==='online' ? ' active' : ''}" data-tab="online">🌐 เหรียญออนไลน์</button>
    <button class="lb-tab${lbTab==='badges' ? ' active' : ''}" data-tab="badges">🏅 เข็ม</button>
    <button class="lb-tab${lbTab==='boss' ? ' active' : ''}" data-tab="boss">🤖 บอส</button>
    <button class="lb-tab${lbTab==='ws' ? ' active' : ''}" data-tab="ws">🔎 ค้นหาคำ</button>
    <button class="lb-tab${lbTab==='tp' ? ' active' : ''}" data-tab="tp">⌨️ พิมพ์คำ</button>
    <button class="lb-tab${lbTab==='bb' ? ' active' : ''}" data-tab="bb">🫧 ฟอง</button>
    <button class="lb-tab${lbTab==='sg' ? ' active' : ''}" data-tab="sg">🎯 ยิงเป้าคำ</button>`;
  if(typeof Online === 'undefined' || !Online.ready){
    el.innerHTML = `<div class="lb-empty">📡 ต่ออินเทอร์เน็ตเพื่อดูอันดับผู้เล่นจากทุกโรงเรียนนะ!</div>`;
    initSideScroll(el);
    return;
  }
  el.innerHTML = (lbTab === 'online' ? lbOnlineCoinHtml() : lbTab === 'badges' ? lbBadgeHtml() : lbTab === 'boss' ? lbBossHtml()
                : lbTab === 'ws' ? lbWordSearchHtml() : lbTab === 'tp' ? lbTypingHtml() : lbTab === 'bb' ? lbBubbleHtml()
                : lbTab === 'sg' ? lbShootHtml() : lbCoinHtml());
  bindPlayerClicks();
  initSideScroll(el);
  bindLbGroupOpen();
}
/* รอบ 246: คลิกกลุ่มอันดับ (หัวข้อ 🏆 + การ์ด) → เปิดกระดานเต็มจอ
   ยกเว้นคลิกชื่อผู้เล่น (.pl-click → โปรไฟล์) หรือแท็บ (.lb-tab → สลับการ์ดเล็ก) */
let __lbGroupBound = false;
function bindLbGroupOpen(){
  if(__lbGroupBound) return; __lbGroupBound = true;
  // 🏆 รอบ 592: .wsa-open (แถบรางวัล) มี handler ของตัวเอง — ไม่ให้เปิดกระดานเต็มจอทับ
  const open = (e)=>{ if(e.target.closest('.pl-click') || e.target.closest('.lb-tab') || e.target.closest('.wsa-open') || e.target.closest('.tpa-open') || e.target.closest('.bba-open') || e.target.closest('.sga-open') || e.target.closest('.coa-open') || e.target.closest('.asa-open') || e.target.closest('.oca-open')) return; openLeaderboardFull(); };
  const label = document.getElementById('lb-label');
  const card = document.getElementById('leaderboard-card');
  if(label){ label.style.cursor = 'pointer'; label.addEventListener('click', open); }
  if(card){ card.style.cursor = 'pointer'; card.addEventListener('click', open); }
}

/* 🏆 รอบ 246: กระดานอันดับเต็มจอ (5 คอลัมน์ Top 100 ไม่ต้องเลื่อน) — ผู้ใช้สั่งคลิกกลุ่มอันดับแล้วขยาย
   lbRankRows(tab): คืน [{uid,name,g,dataN,sc,me}] เรียงอันดับแล้ว (แหล่งข้อมูลเดียวกับการ์ดเล็ก) */
function lbRankRows(tab){
  if(window.__LBDEMO) return lbDemoRows(tab);   // 🧪 รอบ 247 (ชั่วคราว): เดโม 100 คนดูผลบนมือถือ — ลบทั้งบล็อกเดโมหลังผู้ใช้ capture
  const myId = onlineKey();
  const includeMe = !(typeof isTester === 'function' && isTester());
  const meName = (state.profileName || (state.student ? state.student.first : '') || 'หนู')
               + ((typeof badgeSuffix === 'function') ? badgeSuffix() : '');
  const meG = state.student ? state.student.grade : '';
  if(tab === 'badges'){
    if(typeof badgeScore !== 'function') return [];
    const map = {}; (Online.board || []).forEach(r=>{ map[r.id] = {id:r.id, n:r.n, g:r.g}; });
    if(includeMe) map[myId] = {id:myId, n:meName, g:meG};
    let rows = Object.values(map).map(r=>{ const sp = splitNameBadges(r.n);
      return {id:r.id, name:sp.name, badges:sp.badges, g:r.g, score:badgeScore(r.n), me:r.id===myId}; })
      .filter(r=>r.score > 0);
    rows.sort((a,b)=> b.score - a.score);
    return rows.map(r=>({uid:r.id, name:r.name, g:r.g, dataN:r.name + r.badges, sc:`🏅 ${r.score}`, val:r.score, me:r.me}));
  }
  if(tab === 'assets'){
    const map = {}; (Online.board || []).forEach(r=>{ map[r.id] = {id:r.id, n:r.n, g:r.g, av:r.av||0}; });
    if(includeMe) map[myId] = {id:myId, n:meName, g:meG, av:Math.round(assetValue()||0)};
    const rows = Object.values(map).filter(r=>r.av > 0).sort((a,b)=> b.av - a.av).slice(0, LB_ASSET_TOP);
    return rows.map((r,i)=>({uid:r.id, name:splitNameBadges(r.n).name, g:r.g, dataN:r.n,
      sc:`🏆 ${fmtNum(r.av)}`, val:r.av,
      pz:(typeof AssetAward !== 'undefined') ? AssetAward.prizeFor(i+1) : 0, me:r.id===myId}));
  }
  if(tab === 'online'){
    const map = {}; (Online.onlineCoinBoard || []).forEach(r=>{ map[r.id] = {id:r.id, n:r.n, g:r.g, oe:r.oe||0}; });
    if(includeMe) map[myId] = {id:myId, n:meName, g:meG, oe:Math.round(state.onlineEarned||0)};
    const rows = Object.values(map).filter(r=>r.oe > 0).sort((a,b)=> b.oe - a.oe).slice(0, LB_ONLINE_TOP);
    return rows.map((r,i)=>({uid:r.id, name:splitNameBadges(r.n).name, g:r.g, dataN:r.n,
      sc:`🌐 ${fmtNum(r.oe)}`, val:r.oe,
      pz:(typeof OnlineCoinAward !== 'undefined') ? OnlineCoinAward.prizeFor(i+1) : 0, me:r.id===myId}));
  }
  if(tab === 'boss'){
    const map = {}; (Online.board || []).forEach(r=>{ map[r.id] = {id:r.id, n:r.n, g:r.g, bk:r.bk||0}; });
    if(includeMe) map[myId] = {id:myId, n:meName, g:meG, bk:Math.round(state.mechaBoss||0)};
    const rows = Object.values(map).filter(r=>r.bk > 0).sort((a,b)=> b.bk - a.bk);
    return rows.map(r=>({uid:r.id, name:splitNameBadges(r.n).name, g:r.g, dataN:r.n, sc:`👾 ${fmtNum(r.bk)}`, val:r.bk, me:r.id===myId}));
  }
  if(tab === 'ws'){   // 🔎 แต้มสะสมตลอดกาลเกมค้นหาคำ (field ws) — แสดงครบ Top 100; รางวัลยังเฉพาะ Top 10
    const map = {}; (Online.board || []).forEach(r=>{ map[r.id] = {id:r.id, n:r.n, g:r.g, ws:r.ws||0}; });
    if(includeMe) map[myId] = {id:myId, n:meName, g:meG, ws:Math.round(state.wsScore||0)};
    const rows = Object.values(map).filter(r=>r.ws > 0).sort((a,b)=> b.ws - a.ws).slice(0, LB_WS_DISPLAY);
    // 🏆 รอบ 592: pz = เงินรางวัลรายเดือนของอันดับนั้น (โชว์ต่อท้ายชื่อ)
    return rows.map((r,i)=>({uid:r.id, name:splitNameBadges(r.n).name, g:r.g, dataN:r.n, sc:`🔎 ${fmtNum(r.ws)}`, val:r.ws,
      pz:(typeof WsAward !== 'undefined') ? WsAward.prizeFor(i+1) : 0, me:r.id===myId}));
  }
  if(tab === 'tp'){   // ⌨️ รอบ 649-650: เกมพิมพ์คำ — จัดอันดับด้วย "จำนวนคำ" (tw) · โชว์เหรียญสะสม (tp) คู่กัน
    const map = {}; (Online.board || []).forEach(r=>{ map[r.id] = {id:r.id, n:r.n, g:r.g, tw:r.tw||0, tp:r.tp||0}; });
    if(includeMe) map[myId] = {id:myId, n:meName, g:meG, tw:Math.round(state.tpWords||0), tp:Math.round(state.tpScore||0)};
    const rows = Object.values(map).filter(r=>r.tw > 0).sort((a,b)=> (b.tw - a.tw) || (b.tp - a.tp)).slice(0, LB_TP_DISPLAY);
    return rows.map((r,i)=>({uid:r.id, name:splitNameBadges(r.n).name, g:r.g, dataN:r.n,
      sc:`⌨️ ${fmtNum(r.tw)} คำ<span class="sc-sub"> · ${fmtNum(r.tp)} เหรียญ</span>`, val:r.tw,
      pz:(typeof TpAward !== 'undefined') ? TpAward.prizeFor(i+1) : 0, me:r.id===myId}));
  }
  if(tab === 'bb'){
    const map={}; (Online.bbBoard||[]).forEach(r=>{map[r.id]={id:r.id,n:r.n,g:r.g,bb:r.bb||0};});
    if(includeMe) map[myId]={id:myId,n:meName,g:meG,bb:Math.round(state.bbScore||0)};
    const rows=Object.values(map).filter(r=>r.bb>0).sort((a,b)=>b.bb-a.bb).slice(0,LB_BB_DISPLAY);
    return rows.map((r,i)=>({uid:r.id,name:splitNameBadges(r.n).name,g:r.g,dataN:r.n,sc:`🫧 ${fmtNum(r.bb)}`,val:r.bb,
      pz:(typeof BbAward!=='undefined')?BbAward.prizeFor(i+1):0,me:r.id===myId}));
  }
  if(tab === 'sg'){   // 🎯 แต้มสะสมตลอดกาลเกมยิงเป้าคำศัพท์ (field sg) — แสดงครบ Top 100; รางวัลยังเฉพาะ Top 10
    const map = {}; (Online.board || []).forEach(r=>{ map[r.id] = {id:r.id, n:r.n, g:r.g, sg:r.sg||0}; });
    if(includeMe) map[myId] = {id:myId, n:meName, g:meG, sg:Math.round(state.sgScore||0)};
    const rows = Object.values(map).filter(r=>r.sg > 0).sort((a,b)=> b.sg - a.sg).slice(0, LB_SG_DISPLAY);
    return rows.map((r,i)=>({uid:r.id, name:splitNameBadges(r.n).name, g:r.g, dataN:r.n, sc:`🎯 ${fmtNum(r.sg)}`, val:r.sg,
      pz:(typeof SgAward !== 'undefined') ? SgAward.prizeFor(i+1) : 0, me:r.id===myId}));
  }
  if(tab === 'pm'){   // 🖼️ แต้มสะสมตลอดกาลเกมจับคู่ภาพ (field pm) — แสดงครบ Top 100; รางวัลยังเฉพาะ Top 10
    const map = {}; (Online.board || []).forEach(r=>{ map[r.id] = {id:r.id, n:r.n, g:r.g, pm:r.pm||0}; });
    if(includeMe) map[myId] = {id:myId, n:meName, g:meG, pm:Math.round(state.pmScore||0)};
    const rows = Object.values(map).filter(r=>r.pm > 0).sort((a,b)=> b.pm - a.pm).slice(0, LB_PM_DISPLAY);
    return rows.map((r,i)=>({uid:r.id, name:splitNameBadges(r.n).name, g:r.g, dataN:r.n, sc:`🖼️ ${fmtNum(r.pm)}`, val:r.pm,
      pz:(typeof PmAward !== 'undefined') ? PmAward.prizeFor(i+1) : 0, me:r.id===myId}));
  }
  /* 🪙 ใช้ยอดสดจาก state สำหรับเจ้าของบัญชีเสมอ เหมือนทุกหมวดด้านบน
     เดิมหมวด coins เป็นหมวดเดียวที่คืน Online.board ตรง ๆ จึงเห็น snapshot เก่าระหว่างรอ sync */
  const map = {}; (Online.board || []).forEach(r=>{ map[r.id] = r; });
  if(includeMe) map[myId] = {id:myId, n:meName, g:meG, coins:Math.round(state.coins||0)};
  return Object.values(map).filter(r=>typeof r.coins === 'number').sort((a,b)=>b.coins-a.coins).slice(0, LEADERBOARD_SIZE)
    .map((r,i)=>({uid:r.id, name:splitNameBadges(r.n).name, g:r.g, dataN:r.n, sc:`🪙 ${fmtNum(r.coins)}`, val:r.coins,
      pz:(typeof CoinAward !== 'undefined') ? CoinAward.prizeFor(i+1) : 0, me:r.id===myId}));
}

/* ============================================================
   📈 ฟีดอันดับดีขึ้นบนหัวล็อบบี้
   - snapshot ครั้งแรกของแต่ละหัวข้อเป็น baseline ไม่รายงานย้อนหลัง
   - รายงานเฉพาะ current rank < previous rank; คนอันดับตกจะอัปเดต baseline เงียบ ๆ
   - ใช้ initSideScroll: แตะ/ลากหยุดทันที ปล่อย 5 วินาทีแล้ววนต่อ
   ============================================================ */
const RANK_MOVE_TOPICS = [
  {key:'coins',  ico:'🪙', label:'เหรียญ'},
  {key:'assets', ico:'🏆', label:'ทรัพย์สินรวม'},
  {key:'online', ico:'🌐', label:'เหรียญออนไลน์'},
  {key:'badges', ico:'🏅', label:'เข็ม'},
  {key:'boss',   ico:'🤖', label:'ล้มบอส'},
  {key:'ws',     ico:'🔎', label:'ค้นหาคำ'},
  {key:'pm',     ico:'🖼️', label:'จับคู่ภาพ'},
  {key:'tp',     ico:'⌨️', label:'พิมพ์คำ'},
  {key:'bb',     ico:'🫧', label:'ฟอง'},
  {key:'sg',     ico:'🎯', label:'ยิงเป้าคำ'}
];
const RANK_MOVE_MAX = 36;
const RANK_MOVE_REWARD = 1000;
const __rankMovePrev = {};
const __rankMoveItems = [];

function rankMoveFeedRender(){
  const el = document.getElementById('rank-move-feed');
  if(!el) return;
  if(!__rankMoveItems.length){
    el.innerHTML = '<div class="rank-move-empty">กำลังติดตามกระดานอันดับ…</div>';
    initSideScroll(el);
    return;
  }
  el.innerHTML = __rankMoveItems.map(it=>`<div class="rank-move-row">
    <span class="rank-move-up">▲${it.up}</span>
    <span class="rank-move-name">${escapeHTML(it.name)}</span>
    <span class="rank-move-topic">${it.ico} ${escapeHTML(it.topic)} · #${it.from}→#${it.to}${it.reward ? ` · +${fmtNum(it.reward)} 🪙` : ''}</span>
  </div>`).join('') + '<div class="rank-move-gap" aria-hidden="true"></div>';
  initSideScroll(el);
}

/* จ่ายให้เฉพาะเมื่ออันดับตัวเองดีกว่า "สถิติดีสุด" ของกระดานนั้น
   อันดับตกไม่หักเงินและไม่รีเซ็ตฐาน → ไต่กลับมารับซ้ำไม่ได้ */
function rankMoveRewardCheck(topic, rank){
  if(!rank) return 0;
  const best = Math.max(0, Math.floor(Number(state.rankMoveBest[topic.key]) || 0));
  if(!best){ state.rankMoveBest[topic.key] = rank; saveState(); return 0; } // snapshot ครั้งแรก = baseline
  if(rank >= best) return 0;
  const up = best - rank;
  const reward = up * RANK_MOVE_REWARD;
  state.rankMoveBest[topic.key] = rank;
  addCoins(reward);
  const prev = state.rankMoveRewardNotice;
  const items = prev && Array.isArray(prev.items) ? prev.items.slice(-3) : [];
  items.push({ico:topic.ico, topic:topic.label, from:best, to:rank, up, reward});
  state.rankMoveRewardNotice = {items, total:(prev && prev.total || 0) + reward,
    count:(prev && prev.count || 0) + up};
  saveState();
  setTimeout(()=>{ if(typeof showRankMoveRewardNotice === 'function') showRankMoveRewardNotice(); }, 250);
  return reward;
}

function showRankMoveRewardNotice(){
  const b = state.rankMoveRewardNotice;
  if(!b || !b.total) return;
  if(document.querySelector('[data-rank-move-reward]')) return;
  if(document.querySelector('.rankup-overlay')){
    setTimeout(showRankMoveRewardNotice, 800); // รอกล่องก่อนหน้า แต่ใบนี้ยังค้างใน state ไม่หาย
    return;
  }
  if(typeof sfx !== 'undefined'){
    if(sfx.rankup) sfx.rankup();
    if(sfx.coinGet) setTimeout(()=>sfx.coinGet(), 430);
  }
  const ov = document.createElement('div');
  ov.className = 'rankup-overlay';
  ov.dataset.rankMoveReward = '1';
  const rows = (b.items || []).map(it=>`<div>${it.ico} ${escapeHTML(it.topic)} <b>#${it.from}→#${it.to}</b> · +${fmtNum(it.reward)} 🪙</div>`).join('');
  ov.innerHTML = `
    <div class="rankup-rays" style="--rank-color:#45d483"></div>
    <div class="rankup-content qbp">
      <div class="rankup-title">📈 ยินดีด้วย! อันดับดีขึ้น</div>
      <div class="qbp-coin">🪙</div>
      <div class="rankup-name" style="color:#45d483">+${fmtNum(b.total)} เหรียญ</div>
      <p class="rankup-sub">ขยับดีขึ้นรวม <b>${fmtNum(b.count || b.total/RANK_MOVE_REWARD)} อันดับ</b> · อันดับละ <b>${fmtNum(RANK_MOVE_REWARD)} เหรียญ</b><br><small>${rows}<br>
        อันดับตกไม่เสียเงิน และต้องทำลายอันดับดีที่สุดเดิมจึงจะได้รางวัลใหม่</small></p>
      <button class="rankup-btn">รับทราบและรับรางวัล 🪙</button>
    </div>`;
  let refitT = 0;
  const refit = ()=>{ clearTimeout(refitT); refitT=setTimeout(()=>fitQbp(ov.querySelector('.qbp')),140); };
  ov.querySelector('.rankup-btn').addEventListener('click', ()=>{
    clearTimeout(refitT); window.removeEventListener('resize', refit);
    state.rankMoveRewardNotice = null; saveState(); ov.remove();
    if(document.getElementById('screen-dashboard').classList.contains('active')) renderDashboard();
  });
  document.body.appendChild(ov);
  fitQbp(ov.querySelector('.qbp'));
  window.addEventListener('resize', refit);
}

function rankMoveFeedCheck(){
  if(typeof Online === 'undefined' || !Online.ready || !Online.boardReady) return;
  const fresh = [];
  RANK_MOVE_TOPICS.forEach(topic=>{
    if(topic.key === 'bb' && !Online.bbBoardReady) return;
    if(topic.key === 'online' && !Online.onlineCoinBoardReady) return;
    const rows = lbRankRows(topic.key);
    const now = {};
    rows.forEach((row, i)=>{ if(row.uid) now[row.uid] = {rank:i+1, name:row.name || 'ผู้เล่น'}; });
    const myAt = rows.findIndex(row=>row.me);
    const myReward = myAt >= 0 ? rankMoveRewardCheck(topic, myAt + 1) : 0;
    const prev = __rankMovePrev[topic.key];
    if(prev){
      Object.keys(now).forEach(uid=>{
        if(prev[uid] && now[uid].rank < prev[uid].rank){
          const mine = rows.some(row=>row.uid === uid && row.me);
          const item = {uid, name:now[uid].name, ico:topic.ico, topic:topic.label,
            from:prev[uid].rank, to:now[uid].rank, up:prev[uid].rank-now[uid].rank};
          if(mine && myReward) item.reward = myReward;
          fresh.push(item);
        }
      });
    }
    __rankMovePrev[topic.key] = now;
  });
  if(!fresh.length){ if(!__rankMoveItems.length) rankMoveFeedRender(); return; }
  fresh.sort((a,b)=>b.up-a.up || a.to-b.to);
  __rankMoveItems.unshift(...fresh);
  if(__rankMoveItems.length > RANK_MOVE_MAX) __rankMoveItems.length = RANK_MOVE_MAX;
  rankMoveFeedRender();
}

const LB_BCAT_TOP = 5;   // แต่ละสายโชว์ Top กี่คน (กันหน้ายาวเกิน — 10 สาย × 5 คน)
/* 🗂️ รอบ 677: แยกอันดับเข็มเป็นกระดานย่อยทีละสาย (ผู้ใช้ 28 ก.ค. 2026: แต้มรวมอย่างเดียวดูไม่ออกว่าใครเก่งด้านไหน)
   คืน [{label,desc,rows:[{uid,name,g,dataN,me,emoji,tierLabel}]}] เฉพาะสายที่มีคนได้แล้ว ≥1 คน
   (ข้อมูลอ้างอิงจาก badge tier baked ในชื่อ presence/leaderboard.n เหมือน lbRankRows tab='badges' — ไม่มีตัวเลขนับดิบของ
   คนอื่นเก็บไว้ แยกได้แค่ระดับ 1-5 ต่อสาย ผูกเรียงด้วยแต้มรวมเป็น tiebreak) */
function lbBadgeSections(){
  if(typeof badgeScore !== 'function' || typeof BADGE_CATS === 'undefined') return [];
  const myId = onlineKey();
  const includeMe = !(typeof isTester === 'function' && isTester());
  const meName = (state.profileName || (state.student ? state.student.first : '') || 'หนู')
               + ((typeof badgeSuffix === 'function') ? badgeSuffix() : '');
  const meG = state.student ? state.student.grade : '';
  const map = {}; (Online.board || []).forEach(r=>{ map[r.id] = {id:r.id, n:r.n, g:r.g}; });
  if(includeMe) map[myId] = {id:myId, n:meName, g:meG};
  const players = Object.values(map).map(r=>{
    const sp = splitNameBadges(r.n);
    return {uid:r.id, name:sp.name, badges:sp.badges, g:r.g, score:badgeScore(r.n), me:r.id===myId};
  }).filter(p=>p.score > 0);
  return BADGE_CATS.map(cat=>{
    const rows = players.map(p=>({...p, lvl:bcatLevel(p.badges, cat)})).filter(p=>p.lvl > 0)
      .sort((a,b)=> b.lvl - a.lvl || b.score - a.score || a.name.localeCompare(b.name, 'th'))
      .slice(0, LB_BCAT_TOP);
    if(!rows.length) return null;
    return { label:cat.label, desc:cat.desc,
      rows: rows.map(r=>({uid:r.uid, name:r.name, g:r.g, dataN:r.name + r.badges, me:r.me,
        emoji:cat.emojis[r.lvl-1], tierLabel:(BADGE_META[cat.emojis[r.lvl-1]]||{}).n || ''})) };
  }).filter(Boolean);
}

/* 🧪🧪 รอบ 247 บล็อกเดโมชั่วคราว — เปิดด้วย vocabworld.web.app/?lbdemo=1 (ดูผล 100 คนบนมือถือ)
   ไม่แตะ Firebase จริง เห็นเฉพาะเครื่องที่ใส่ param · **ลบทั้งบล็อกนี้ + บรรทัด __LBDEMO ใน lbRankRows/openLeaderboardFull หลังผู้ใช้ capture** */
function lbDemoRows(tab){
  const em = tab === 'assets' ? '🏆' : tab === 'online' ? '🌐' : tab === 'badges' ? '🏅' : tab === 'boss' ? '👾' : tab === 'ws' ? '🔎' : '🪙';
  const names = ['ลูกหมูน้อย','เจ้าเหมียวส้ม','นักสะกดคำ','ดาวรุ่งพุ่งแรง','กัปตันมังกร','น้องข้าวปั้น','เก่งเวอร์','ยัยตัวป่วน','พ่อมดน้อย','เจ้าชายกบ','ราชินีผึ้ง','ฮีโร่ตัวจิ๋ว','นักผจญภัย','เพชรน้ำหนึ่ง','ต้นกล้า','ฟ้าใส','ข้าวโอ๊ต','มะนาว','ปลาทู','ส้มโอ'];
  const rows = [];
  for(let i=0;i<100;i++){
    const base = names[i % names.length];
    const nm = (i % 9 === 0) ? base + 'สุดยอดนักสะสมแห่งปีการศึกษา' : base + (i >= names.length ? (i+1) : '');
    const score = Math.max(1, 999999 - i*8123 - i*i*11);
    rows.push({uid:'demo'+i, name:nm, g:'', dataN:nm, sc:`${em} ${score.toLocaleString()}`, val:score, ch:'blk'+(1+(i%8)), me:i===36});
  }
  return rows;
}
try{
  if(/[?&]lbdemo\b/.test(location.search)){
    window.__LBDEMO = true;
    window.addEventListener('load', ()=> setTimeout(()=>{ try{ openLeaderboardFull(); }catch(e){} }, 2200));
  }
}catch(e){}
/* 🧪🧪 จบบล็อกเดโม */

/* ตัวละคร (blk) ของแถวกระดาน: ตัวเรา=ตัวจริงที่เลือก · คนอื่น=ฟิลด์ ch ถ้ามี ไม่งั้นสุ่มคงที่จาก uid
   (กระดานยังไม่เก็บ ch จริง — ต้องแก้ Firebase rules ก่อน · ดู handoff) */
function lbChar(r){
  if(r.me && typeof lobbyBlk === 'function') return lobbyBlk();
  if(r.ch && /^blk[1-8]$/.test(r.ch)) return r.ch;
  let h = 0; const s = r.uid || '';
  for(let i=0;i<s.length;i++) h = (h*31 + s.charCodeAt(i)) >>> 0;
  return 'blk' + (1 + h % 8);
}

/* 🏆 แถบ "ตัดสินอันดับวันที่ 1" ในกระดานเต็มจอ — ใช้ร่วมแท็บ 🔎 (รอบ 592) และ ⌨️ (รอบ 649)
   เครื่องจ่ายรางวัลคนละตัว (WsAward / TpAward) แต่หน้าตาแถบเหมือนกันเป๊ะ */
function lbfAwardBarHtml(tab){
  const A = tab === 'coins' ? (typeof CoinAward !== 'undefined' ? CoinAward : null)
          : tab === 'ws' ? (typeof WsAward !== 'undefined' ? WsAward : null)
          : tab === 'assets' ? (typeof AssetAward !== 'undefined' ? AssetAward : null)
          : tab === 'online' ? (typeof OnlineCoinAward !== 'undefined' ? OnlineCoinAward : null)
          : tab === 'tp' ? (typeof TpAward !== 'undefined' ? TpAward : null)
          : tab === 'bb' ? (typeof BbAward !== 'undefined' ? BbAward : null)
          : tab === 'sg' ? (typeof SgAward !== 'undefined' ? SgAward : null)
          : tab === 'pm' ? (typeof PmAward !== 'undefined' ? PmAward : null) : null;
  if(!A) return '';
  const cls = tab === 'coins' ? 'coa-open' : tab === 'assets' ? 'asa-open' : tab === 'online' ? 'oca-open' : tab === 'tp' ? 'tpa-open' : tab === 'bb' ? 'bba-open' : tab === 'sg' ? 'sga-open' : tab === 'pm' ? 'pma-open' : 'wsa-open';
  return `<div class="lbf-award ${cls}" role="button" tabindex="0">
    ⏰ ตัดสินอันดับ <b>ทุกวันที่ 1 ของเดือน เวลา 00:01 น. เท่านั้น</b> · ครั้งถัดไป ${A.fmtLeft(A.nextCutDate() - Date.now())}
    · 🎁 อันดับ 1 ได้ ${fmtNum(A.PRIZES[0])} เหรียญ ลดหลั่นถึงอันดับ ${A.TOP} ได้ ${fmtNum(A.PRIZES[A.TOP-1])} เหรียญ
    <span class="lb-award-go">📜 กระดานประกาศรางวัล</span></div>`;
}

let __lbfTab = 'coins';
function openLeaderboardFull(){
  if(!window.__LBDEMO && (typeof Online === 'undefined' || !Online.ready)){
    if(typeof toast === 'function') toast('📡 ต่ออินเทอร์เน็ตก่อนดูอันดับเต็มนะ');
    return;
  }
  bindLbTabs();     // 🥇 รอบ 594: การ์ดเล็กถูกถอดแล้ว → ผูก listener .wsa-open (กระดานประกาศรางวัล) ที่นี่แทน
  document.querySelectorAll('.lbf-overlay').forEach(o=>o.remove());   // กดปุ่มรางซ้ำ = แทนที่อันเก่า ไม่ซ้อนกัน
  __lbfTab = LB_TABS.indexOf(lbTab) >= 0 ? lbTab : 'coins';
  const ov = document.createElement('div'); ov.className = 'lbf-overlay';
  const close = ()=> ov.remove();
  const tabsHtml = ()=> `
          <button class="lb-tab${__lbfTab==='coins'?' active':''}" data-t="coins">🪙 เหรียญ</button>
          <button class="lb-tab${__lbfTab==='assets'?' active':''}" data-t="assets">🏆 ทรัพย์สินรวม</button>
          <button class="lb-tab${__lbfTab==='online'?' active':''}" data-t="online">🌐 เหรียญออนไลน์</button>
          <button class="lb-tab${__lbfTab==='badges'?' active':''}" data-t="badges">🏅 เข็ม</button>
          <button class="lb-tab${__lbfTab==='boss'?' active':''}" data-t="boss">🤖 ล้มบอส</button>
          <button class="lb-tab${__lbfTab==='ws'?' active':''}" data-t="ws">🔎 ค้นหาคำ</button>
          <button class="lb-tab${__lbfTab==='pm'?' active':''}" data-t="pm">🖼️ จับคู่ภาพ</button>
          <button class="lb-tab${__lbfTab==='tp'?' active':''}" data-t="tp">⌨️ พิมพ์คำ</button>
          <button class="lb-tab${__lbfTab==='bb'?' active':''}" data-t="bb">🫧 ฟอง</button>
          <button class="lb-tab${__lbfTab==='sg'?' active':''}" data-t="sg">🎯 ยิงเป้าคำ</button>
          <button class="lb-tab${__lbfTab==='bx'?' active':''}" data-t="bx">🏁 สอบใหญ่</button>
          <button class="lb-tab${__lbfTab==='xr'?' active':''}" data-t="xr">🏁 ข้อสอบมาตรฐาน</button>`;
  const closeHeadHtml = (title)=> `<div class="lbf-head">
        <button class="pl-close lbf-close lbf-close-l">✕</button>
        <span class="lbf-title">🏆 ${title}</span>
        <span class="lbf-tabs">${tabsHtml()}</span>
      </div>`;
  const bindLbfChrome = ()=>{
    ov.querySelectorAll('.lbf-close').forEach(b=> b.addEventListener('click', close));
    ov.querySelectorAll('.lbf-tabs .lb-tab').forEach(b=> b.addEventListener('click', ()=>{ __lbfTab = b.dataset.t; if(sfx&&sfx.click) sfx.click(); render(); }));
  };
  const render = ()=>{
    /* 🏁 รอบ 786: แท็บสอบใหญ่คะแนนสูงสุด/เร็วสุด — เนื้อกระดานอยู่ js/bandadv.js (bxRankMount วาด+ผูกปุ่มเอง)
       ที่นี่แค่เตรียมกล่องให้ · ⚠️ รอบ 827: เปลี่ยนมาอ่านจากโซน DB ถาวร /bandRank แทนการพาร์สฟีดรวม
       (สูตรเดียวกับแท็บ xr ด้านล่าง) · id ให้ bxRankNoteRefresh() เขียนทับได้หลังรู้ผลจาก DB */
    if(__lbfTab === 'bx'){
      ov.innerHTML = `<div class="lbf-box">${closeHeadHtml('🏁 สอบใหญ่คะแนนสูงสุด/เร็วสุด')}
        <div class="lbf-scroll"><div class="lbf-note" id="bxr-note">${(typeof bxRankNote === 'function') ? bxRankNote() : ''}</div>
        <div class="bxr-body" id="lbf-bx"></div></div></div>`;
      bindLbfChrome();
      if(typeof bxRankMount === 'function') bxRankMount(ov.querySelector('#lbf-bx'));
      return;
    }
    /* 🏁 รอบ 815: แท็บข้อสอบมาตรฐานคะแนนสูงสุด/เร็วสุด — เนื้อกระดานอยู่ js/examstd.js (xrkMount วาด+ผูกปุ่มเอง)
       สูตรเดียวกับแท็บ bx ด้านบนเป๊ะ (ทั้งคู่เป็นอันดับตลอดกาลจริงตั้งแต่รอบ 825/827) ต่างแค่เรียกฟังก์ชันฝั่ง examstd.js
       ⚠️ ป้ายต้องใช้ xrkNote() ของกระดานนี้เอง ห้ามใช้ bxRankNote() ร่วมกับแท็บ bx — คนละโซน DB (/examRank vs /bandRank)
          จึงอาจติด deny คนละสถานะกัน (rules publish แยกอิสระต่อกัน) · id ให้ xrkNoteRefresh() เขียนทับได้ */
    if(__lbfTab === 'xr'){
      ov.innerHTML = `<div class="lbf-box">${closeHeadHtml('🏁 ข้อสอบมาตรฐานคะแนนสูงสุด/เร็วสุด')}
        <div class="lbf-scroll"><div class="lbf-note" id="xrk-note"></div>
        <div class="bxr-body" id="lbf-xr"></div></div></div>`;
      bindLbfChrome();
      if(typeof xrkMount === 'function') xrkMount(ov.querySelector('#lbf-xr'));
      return;
    }
    /* 🗂️ รอบ 677: แท็บเข็ม — แยกกระดานย่อยทีละสาย (ผู้ใช้ 28 ก.ค. 2026 ขอแยกดูทีละความสามารถ
       แทนแต้มรวมอย่างเดียว) เนื้อหาต่างจากแท็บอื่นทั้งหมด (ไม่มีโพเดียม/กริดรวม) จบแล้ว return ทันที */
    if(__lbfTab === 'badges'){
      const secs = (typeof lbBadgeSections === 'function') ? lbBadgeSections() : [];
      /* 🏅 รอบ 737 (ผู้ใช้: เอาเหรียญออกจากหลังชื่อผู้เล่น เหลือเหรียญเดียวใหญ่ใต้ชื่อสายแทน
         + จัด grid 4 คอลัมน์ — ดู CSS .lbf-bcat-wrap/.lbf-bcat-badge): เหรียญตัวแทนสาย = เข็มระดับสูงสุด
         ที่มีคนได้แล้ว (แถวอันดับ 1 หลัง sort desc ใน lbBadgeSections) */
      const body = secs.length ? `<div class="lbf-bcat-wrap${secs.length<=4?' lbf-one-row':''}">${secs.map(s=>{
        const top = s.rows[0];
        return `
        <div class="lbf-bcat">
          <div class="lbf-bcat-head"><b>${escapeHTML(s.label)}</b><small>${escapeHTML(s.desc)}</small></div>
          <div class="lbf-bcat-mid">
            <div class="lbf-bcat-badge">${(typeof badgeIcHTML==='function')?badgeIcHTML(top.emoji,'lbcat-ic'):top.emoji}<span class="lbcat-ic-label">${escapeHTML(top.tierLabel)}</span></div>
            <div class="lbf-bcat-rows">${s.rows.map((r,i)=>`
              <div class="lbf-bcat-row${r.me ? ' me' : ''}">
                <span class="bcr-rank">${i===0?'🥇':i===1?'🥈':i===2?'🥉':(i+1)}</span>
                <span class="bcr-name pl-click" data-uid="${escapeHTML(r.uid||'')}" data-n="${escapeHTML(r.dataN||r.name)}" data-g="${escapeHTML(r.g||'')}">${r.me?'⭐ ':''}${escapeHTML(r.name)}${gradeMark(gradeOf(r.uid, r.g))}</span>
              </div>`).join('')}</div>
          </div>
        </div>`;
      }).join('')}</div>`
        : `<div class="lb-empty">ยังไม่มีใครได้เข็มเลย — เล่นเก่งๆ เก็บเข็มเป็นคนแรกเลย! 🏅</div>`;
      ov.innerHTML = `<div class="lbf-box lbf-box-bcat">${closeHeadHtml('🏅 อันดับเข็ม · แยกตามสาย')}<div class="lbf-scroll">${body}</div></div>`;
      bindLbfChrome();
      return;
    }

    const cap = __lbfTab === 'assets' ? LB_ASSET_TOP : __lbfTab === 'online' ? LB_ONLINE_TOP : __lbfTab === 'ws' ? LB_WS_DISPLAY : __lbfTab === 'pm' ? LB_PM_DISPLAY : __lbfTab === 'tp' ? LB_TP_DISPLAY : __lbfTab === 'bb' ? LB_BB_DISPLAY : __lbfTab === 'sg' ? LB_SG_DISPLAY : 100;
    const all = lbRankRows(__lbfTab).slice(0, cap);
    const top = all.slice(0, 5);          // 🏆 โพเดียม (ตัวละครยืนลดหลั่น)
    const rest = all.slice(5);            // ที่เหลือ → กริด 5 คอลัมน์เหมือนเดิม
    // ความสูงแท่น "สอดคล้องคะแนนจริง" — normalize คะแนน Top 5 → 3–11vh (คนคะแนนมาก แท่นสูง)
    const vals = top.map(r=> +r.val || 0);
    const maxV = Math.max(...vals), minV = Math.min(...vals);
    const baseVh = (v)=> (2.5 + 6 * (maxV > minV ? (v - minV) / (maxV - minV) : 1)).toFixed(1);
    // เรียงบนแท่น L→R = อันดับ 4,2,1,3,5 (index 3,1,0,2,4) → ชื่อ+เหรียญเหนือหัว · แท่นสูงตามคะแนน
    const podHtml = top.length ? `<div class="lbf-podium">${[3,1,0,2,4].map(idx=>{
      const r = top[idx]; if(!r) return '';
      const rank = idx + 1;
      const rk = rank===1?'🥇':rank===2?'🥈':rank===3?'🥉':rank;
      return `<div class="pod pod-${rank}${r.me?' me':''}">
        <div class="pod-label">
          <span class="pod-name pl-click" data-uid="${escapeHTML(r.uid||'')}" data-n="${escapeHTML(r.dataN||r.name)}" data-g="${escapeHTML(r.g||'')}">${r.me?'⭐ ':''}${escapeHTML(r.name)}</span>
          ${gradeMark(gradeOf(r.uid, r.g))}
          <span class="pod-sc">${r.sc}${r.pz?` <span class="pod-pz">🎁 ${fmtNum(r.pz)}</span>`:''}</span>
        </div>
        <img class="pod-char" data-blk="${lbChar(r)}" src="img/blocks/${lbChar(r)}.png" alt="" onerror="this.style.display='none'">
        <div class="pod-base" style="height:${baseVh(r.val)}vh"><span class="pod-rank">${rk}</span></div>
      </div>`;
    }).join('')}</div>` : '';
    const cells = rest.map((r,i)=>`
      <div class="lbf-cell${r.me ? ' me' : ''}">
        <span class="r">${i + 6}</span>
        <span class="nm pl-click" data-uid="${escapeHTML(r.uid||'')}" data-n="${escapeHTML(r.dataN||r.name)}" data-g="${escapeHTML(r.g||'')}">${r.me ? '⭐ ' : ''}${escapeHTML(r.name)}${gradeMark(gradeOf(r.uid, r.g))}</span>
        <span class="sc">${r.sc}${r.pz ? ` <span class="cell-pz">🎁 ${fmtNum(r.pz)}</span>` : ''}</span>
      </div>`).join('');
    const title = __lbfTab === 'assets' ? '🏆 อันดับทรัพย์สินรวม'
                : __lbfTab === 'online' ? '🌐 อันดับเหรียญออนไลน์'
                : __lbfTab === 'boss' ? '🤖 อันดับล้มบอส'
                : __lbfTab === 'ws' ? '🔎 อันดับค้นหาคำ' : __lbfTab === 'pm' ? '🖼️ อันดับจับคู่ภาพ' : __lbfTab === 'tp' ? '⌨️ อันดับพิมพ์คำ' : __lbfTab === 'bb' ? '🫧 อันดับฟอง'
                : __lbfTab === 'sg' ? '🎯 อันดับยิงเป้าคำ' : '🪙 อันดับเหรียญ';
    const allTime = (__lbfTab === 'online' || __lbfTab === 'ws' || __lbfTab === 'pm' || __lbfTab === 'tp' || __lbfTab === 'bb' || __lbfTab === 'sg') ? ' (all time)' : '';
    ov.innerHTML = `<div class="lbf-box">
      ${closeHeadHtml(`${title} · Top ${cap}${allTime}`)}
      <div class="lbf-scroll" tabindex="0" aria-label="เลื่อนดูอันดับผู้เล่นทั้งหมด">
        ${lbfAwardBarHtml(__lbfTab)}
        ${podHtml}
        ${rest.length ? `<div class="lbf-body"><div class="lbf-grid">${cells}</div></div>`
                      : (top.length ? '' : '<div class="lb-empty">ยังไม่มีใครขึ้นกระดาน — เล่นเก็บแต้มเป็นคนแรกเลย! 🥇</div>')}
      </div>
    </div>`;
    bindLbfChrome();
    seatPodChars(ov);   // เท้าติดแท่น + ลดช่องเหนือหัว (ชดเชยขอบใสในรูป blk)
  };
  ov.addEventListener('click', (e)=>{ if(e.target === ov) close(); });
  document.body.appendChild(ov);   // ต่อ DOM ก่อน render → seatPodChars อ่าน offsetHeight ได้
  render();
  if(typeof sfx !== 'undefined' && sfx.select) sfx.select();
}
/* เท้าตัวละครติดแท่น + ตัดช่องว่างเหนือหัว — รูป blk มีขอบใส (วัดจริง: บน/ล่าง ต่างกันต่อรูป)
   ดึงหัวขึ้น (margin-top ลบ = ครึ่งขอบบน) + ดึงแท่นขึ้นชนเท้า (margin-bottom ลบ = ขอบล่าง) */
const BLK_PAD = {blk1:[.11,.25], blk2:[.14,.24], blk3:[.10,.22], blk4:[.04,.18],
                 blk5:[.17,.20], blk6:[.13,.20], blk7:[.12,.21], blk8:[.13,.22]};
// 🖼️ รอบ 751/754: ชุดใหม่ blk9-blk88 ตัดจากแผ่นเดียวกัน กรอบเท่ากันทุกใบ (เท้าอยู่เส้นเดียวกัน = ขอบล่าง .223)
// ตัวที่กว้างกว่าปกติ (ปีก/ไม้สกี) ถูกย่อตามความกว้าง หัวเลยต่ำลง → จดขอบบนจริงไว้เฉพาะตัวนั้น
// (รอบ 754: เปลี่ยนไฟล์ต้นทางเป็นแผ่นพื้นโปร่งใสจริง (ผู้ใช้เตรียมมาให้เอง) แก้ฝ้าขาวเดิม — เลขวัดขยับนิดหน่อยจากรอบ 751 ไม่ใช่บั๊ก)
const BLK_PAD_NEW = [.125, .223];
const BLK_TOP_FIX = {blk30:.182, blk45:.146, blk51:.143, blk56:.225, blk58:.150, blk62:.168, blk68:.250, blk83:.135};
function seatPodChars(scope){
  (scope || document).querySelectorAll('.pod-char').forEach(img=>{
    const key = img.getAttribute('data-blk');
    const p = BLK_PAD[key] || (/^blk\d+$/.test(key||'') ? [BLK_TOP_FIX[key] || BLK_PAD_NEW[0], BLK_PAD_NEW[1]] : null);
    if(!p) return;
    const h = img.offsetHeight; if(!h) return;                 // offsetHeight = สูงจาก CSS (ไม่โดน transform ย่อ)
    img.style.marginTop = (-(p[0]*h) + 4).toFixed(1) + 'px';   // ครอปขอบใสบน เหลือช่อง ~4px ให้หัวห่างชื่อ (ชื่ออยู่เหนือหัว)
    img.style.marginBottom = (-(p[1]*h) + 2).toFixed(1) + 'px';// ดึงแท่นขึ้นชนเท้า (+2 เท้าจมแท่นนิด ดูยืนจริง)
  });
}

/* 🌐 เนื้อหาแท็บเหรียญออนไลน์ (การ์ดเล็ก legacy; ทางเข้าใช้งานจริงคือกระดานเต็ม Top 100) */
function lbOnlineCoinHtml(){
  const rows = lbRankRows('online');
  if(!rows.length) return `<div class="lb-empty">ยังไม่มีใครได้รับเหรียญออนไลน์ — เปิดเกมออนไลน์สะสมเวลาเป็นคนแรกเลย! 🌐</div>`;
  const myIdx = rows.findIndex(r=>r.me);
  const medal = (i)=> i===0?'🥇':i===1?'🥈':i===2?'🥉':(i+1);
  const list = rows.slice(0, 10).map((r,i)=>`
    <div class="lb-row${r.me?' lb-me':''}">
      <span class="lb-rank">${medal(i)}</span>
      <span class="lb-name pl-click" data-uid="${escapeHTML(r.uid||'')}" data-n="${escapeHTML(r.dataN||r.name)}" data-g="${escapeHTML(r.g||'')}">${r.me?'⭐ ':''}${escapeHTML(r.name)}<small> ${idTag(r.uid)}${gradeMark(gradeOf(r.uid,r.g))}</small>${r.pz?`<small class="lb-prize">🎁 ${fmtNum(r.pz)} เหรียญ</small>`:''}</span>
      <span class="lb-coins">${r.sc}</span>
    </div>`).join('');
  return `<div class="online-count">${myIdx>=0?`${selfPronoun()}อยู่อันดับที่ ${myIdx+1} ของ Top ${LB_ONLINE_TOP} · ${fmtNum(rows[myIdx].val)} เหรียญออนไลน์ 🌐`:`เปิดเว็บออนไลน์สะสมเวลาเพื่อขึ้น Top ${LB_ONLINE_TOP} นะ 💪`}</div>
    <div class="lb-award-bar oca-open" role="button" tabindex="0">⏰ ตัดสินอันดับทุกวันที่ 1 เวลา 00:01 น. · รางวัลเฉพาะ Top 10<span class="lb-award-go">📜 กระดานประกาศรางวัล</span></div>
    <div class="lb-list">${list}</div>`;
}

/* 🪙 เนื้อหาแท็บเหรียญ */
function lbCoinHtml(){
  if(!Online.board.length) return `<div class="lb-empty">ยังไม่มีใครขึ้นกระดาน — เล่นเกมเก็บเหรียญเป็นคนแรกเลย! 🥇</div>`;
  const medal = (i)=> i===0 ? '🥇' : i===1 ? '🥈' : i===2 ? '🥉' : (i+1);
  const myId = onlineKey();
  const myIdx = Online.board.findIndex(r=>r.id === myId);
  const rows = Online.board.map((r,i)=>`
    <div class="lb-row${r.id === myId ? ' lb-me' : ''}">
      <span class="lb-rank">${medal(i)}</span>
      <span class="lb-name pl-click" data-uid="${escapeHTML(r.id||'')}" data-n="${escapeHTML(r.n)}" data-g="${escapeHTML(r.g)}">${r.id === myId ? '⭐ ' : ''}${escapeHTML(r.n)}<small> ${idTag(r.id)}${gradeMark(gradeOf(r.id, r.g))}</small></span>
      <span class="lb-coins">🪙 ${fmtNum(r.coins)}</span>
    </div>`).join('');
  return `<div class="online-count">${myIdx >= 0 ? `${selfPronoun()}อยู่อันดับที่ ${myIdx + 1} จาก ${Online.board.length} คน 🎯` : `เก็บเหรียญเพิ่มเพื่อไต่ขึ้นกระดานนะ 💪`}</div>
    <div class="lb-list">${rows}</div>`;
}

/* 🏅 เนื้อหาแท็บเข็ม — จัดอันดับด้วยแต้มรวมเข็ม (baked ในชื่อ presence/leaderboard.n) */
function lbBadgeHtml(){
  if(typeof badgeScore !== 'function') return `<div class="lb-empty">📡 ต่ออินเทอร์เน็ตเพื่อดูอันดับเข็มของเพื่อนๆ นะ!</div>`;
  const myId = onlineKey();
  const meName = state.profileName || (state.student ? state.student.first : '') || 'หนู';
  const meBadges = (typeof badgeSuffix === 'function') ? badgeSuffix() : '';
  const map = {};                                      // รวมผู้เล่นจากกระดานเหรียญ + แทนที่เราด้วยเข็มสด
  (Online.board || []).forEach(r=>{ map[r.id] = {id:r.id, n:r.n, g:r.g}; });
  map[myId] = {id:myId, n: meName + meBadges, g: (state.student ? state.student.grade : '')};
  let rows = Object.values(map).map(r=>{
    const sp = splitNameBadges(r.n);
    return {id:r.id, name:sp.name, badges:sp.badges, g:r.g, score:badgeScore(r.n), me:r.id===myId};
  }).filter(r=>r.score > 0);
  rows.sort((a,b)=> b.score - a.score || badgeEmojis(b.badges).length - badgeEmojis(a.badges).length);
  if(!rows.length) return `<div class="lb-empty">ยังไม่มีใครได้เข็มเลย — เล่นเก่งๆ เก็บเข็มเป็นคนแรกเลย! 🏅</div>`;
  const myIdx = rows.findIndex(r=>r.me);
  const medal = (i)=> i===0 ? '🥇' : i===1 ? '🥈' : i===2 ? '🥉' : (i+1);
  const list = rows.slice(0, LEADERBOARD_SIZE).map((r,i)=>`
    <div class="lb-row${r.me ? ' lb-me' : ''}">
      <span class="lb-rank">${medal(i)}</span>
      <span class="lb-name pl-click" data-uid="${escapeHTML(r.id||'')}" data-n="${escapeHTML(r.name + r.badges)}" data-g="${escapeHTML(r.g||'')}">${r.me ? '⭐ ' : ''}${escapeHTML(r.name)}<small class="lb-badgeline">${r.badges} · ${r.score} แต้ม${gradeMark(gradeOf(r.id, r.g))}</small></span>
    </div>`).join('');
  return `<div class="online-count">${myIdx >= 0 ? `${selfPronoun()}อยู่อันดับเข็มที่ ${myIdx + 1} จาก ${rows.length} คน 🏅` : `ยังไม่มีเข็ม — เก็บเข็มแล้วมาไต่กระดานนะ 💪`}</div>
    <div class="lb-list">${list}</div>`;
}

/* 🤖 รอบ 228: เนื้อหาแท็บล้มบอส — จัดอันดับด้วยจำนวนบอสที่ล้มในโลกหุ่นยนต์ (leaderboard.bk) */
function lbBossHtml(){
  const myId = onlineKey();
  const map = {};
  (Online.board || []).forEach(r=>{ map[r.id] = {id:r.id, n:r.n, g:r.g, bk:r.bk||0}; });
  // แทนที่ตัวเราด้วยค่าสดจาก state (เห็นทันทีแม้ push ยังไม่ถึง)
  const meName = (state.profileName || (state.student ? state.student.first : '') || 'หนู') + ((typeof badgeSuffix==='function')?badgeSuffix():'');
  map[myId] = {id:myId, n: meName, g:(state.student?state.student.grade:''), bk: Math.round(state.mechaBoss||0)};
  const rows = Object.values(map).filter(r=>r.bk > 0).sort((a,b)=> b.bk - a.bk);
  if(!rows.length) return `<div class="lb-empty">ยังไม่มีใครล้มบอสเลย — เข้าโลกหุ่นยนต์ 🤖 ยิงบอสตัวแรกเป็นคนแรกสิ! 👾</div>`;
  const myIdx = rows.findIndex(r=>r.id===myId);
  const medal = (i)=> i===0?'🥇':i===1?'🥈':i===2?'🥉':(i+1);
  const list = rows.slice(0, LEADERBOARD_SIZE).map((r,i)=>`
    <div class="lb-row${r.id===myId?' lb-me':''}">
      <span class="lb-rank">${medal(i)}</span>
      <span class="lb-name pl-click" data-uid="${escapeHTML(r.id||'')}" data-n="${escapeHTML(r.n)}" data-g="${escapeHTML(r.g||'')}">${r.id===myId?'⭐ ':''}${escapeHTML(splitNameBadges(r.n).name)}<small> ${idTag(r.id)}${gradeMark(gradeOf(r.id, r.g))}</small></span>
      <span class="lb-coins">👾 ${fmtNum(r.bk)}</span>
    </div>`).join('');
  return `<div class="online-count">${myIdx>=0?`${selfPronoun()}ล้มบอสไป ${rows[myIdx].bk} ตัว — อันดับ ${myIdx+1} จาก ${rows.length} คน 🤖`:`เข้าโลกหุ่นล้มบอสเพื่อขึ้นกระดานนะ 👾`}</div>
    <div class="lb-list">${list}</div>`;
}

/* 🔎 รอบ 590: เนื้อหาแท็บค้นหาคำ — "10 อันดับผู้สะสมแต้มสูงสุด of all time" (เกม Word Search)
   แต้ม = ความยาวคำ×2 ต่อคำที่หาเจอ + โบนัสจบกระดาน 20 (สะสมถาวรใน state.wsScore → /leaderboard field ws) */
function lbWordSearchHtml(){
  const myId = onlineKey();
  const map = {};
  (Online.board || []).forEach(r=>{ map[r.id] = {id:r.id, n:r.n, g:r.g, ws:r.ws||0}; });
  // แทนที่ตัวเราด้วยค่าสดจาก state (เห็นทันทีแม้ push ยังไม่ถึง / rules ยังไม่ publish)
  const meName = (state.profileName || (state.student ? state.student.first : '') || 'หนู') + ((typeof badgeSuffix==='function')?badgeSuffix():'');
  map[myId] = {id:myId, n: meName, g:(state.student?state.student.grade:''), ws: Math.round(state.wsScore||0)};
  const all = Object.values(map).filter(r=>r.ws > 0).sort((a,b)=> b.ws - a.ws);
  if(!all.length) return `<div class="lb-empty">ยังไม่มีใครเก็บแต้มค้นหาคำเลย — กด 🔎 หาคำให้เจอ เป็นคนแรกบนกระดานสิ! 🥇</div>`;
  const rows = all.slice(0, LB_WS_TOP);
  const myIdx = all.findIndex(r=>r.id===myId);
  const medal = (i)=> i===0?'🥇':i===1?'🥈':i===2?'🥉':(i+1);
  // 🏆 รอบ 592: เงินรางวัลรายเดือนต่อท้ายชื่อแต่ละอันดับ (ผู้ใช้สั่งข้อ 2)
  const pz = (i)=> (typeof WsAward !== 'undefined') ? WsAward.prizeFor(i+1) : 0;
  const list = rows.map((r,i)=>`
    <div class="lb-row${r.id===myId?' lb-me':''}">
      <span class="lb-rank">${medal(i)}</span>
      <span class="lb-name pl-click" data-uid="${escapeHTML(r.id||'')}" data-n="${escapeHTML(r.n)}" data-g="${escapeHTML(r.g||'')}">${r.id===myId?'⭐ ':''}${escapeHTML(splitNameBadges(r.n).name)}<small> ${idTag(r.id)}${gradeMark(gradeOf(r.id, r.g))}</small>${pz(i)?`<small class="lb-prize">🎁 ${fmtNum(pz(i))} เหรียญ</small>`:''}</span>
      <span class="lb-coins">🔎 ${fmtNum(r.ws)}</span>
    </div>`).join('');
  const meLine = myIdx >= 0
    ? (myIdx < LB_WS_TOP ? `${selfPronoun()}อยู่อันดับที่ ${myIdx+1} ของ Top ${LB_WS_TOP} · ${fmtNum(map[myId].ws)} แต้ม 🔎`
                         : `${selfPronoun()}มี ${fmtNum(map[myId].ws)} แต้ม (อันดับ ${myIdx+1}) — เก็บอีกนิดก็ติด Top ${LB_WS_TOP} แล้ว 💪`)
    : `เล่นเกม 🔎 ค้นหาคำ เก็บแต้มเพื่อขึ้น Top ${LB_WS_TOP} นะ 💪`;
  // ⏰ รอบ 592 (ข้อ 3): บอกให้ชัดว่าตัดสินวันที่ 1 เวลา 00:01 เท่านั้น + ปุ่มเข้ากระดานประกาศรางวัล (ข้อ 4)
  const when = (typeof WsAward !== 'undefined')
    ? `<div class="lb-award-bar wsa-open" role="button" tabindex="0">⏰ ตัดสินอันดับ <b>ทุกวันที่ 1 เวลา 00:01 น.</b> เท่านั้น · ${WsAward.fmtLeft(WsAward.nextCutDate() - Date.now())}
         <span class="lb-award-go">📜 กระดานประกาศรางวัล</span></div>` : '';
  return `<div class="online-count">${meLine}</div>${when}
    <div class="lb-list">${list}</div>`;
}

/* ⌨️ รอบ 649 (กติกาอันดับแก้รอบ 654): เนื้อหาแท็บพิมพ์คำ — "10 อันดับ นักพิมพ์ตัวยง of all time"
   🥇 **อันดับตัดสินที่จำนวนคำที่พิมพ์สำเร็จ** (`state.tpWords` → /leaderboard field `tw`) = "ใครพิมพ์ได้เยอะที่สุด"
   🪙 โชว์ "เหรียญสะสม" คู่กัน (`state.tpScore` → field `tp` · ความยาวคำ×2 +5 ถ้าไม่ผิดเลย) และใช้ตัดสินตอนคำเท่ากัน
   โครงเหมือน lbWordSearchHtml() ทุกอย่าง ต่างแค่ field/อีโมจิ/ชื่อเกม/เครื่องจ่ายรางวัล */
function lbTypingHtml(){
  const myId = onlineKey();
  const map = {};
  (Online.board || []).forEach(r=>{ map[r.id] = {id:r.id, n:r.n, g:r.g, tw:r.tw||0, tp:r.tp||0}; });
  // แทนที่ตัวเราด้วยค่าสดจาก state (เห็นทันทีแม้ push ยังไม่ถึง / rules ยังไม่ publish)
  const meName = (state.profileName || (state.student ? state.student.first : '') || 'หนู') + ((typeof badgeSuffix==='function')?badgeSuffix():'');
  map[myId] = {id:myId, n: meName, g:(state.student?state.student.grade:''),
               tw: Math.round(state.tpWords||0), tp: Math.round(state.tpScore||0)};
  const all = Object.values(map).filter(r=>r.tw > 0).sort((a,b)=> (b.tw - a.tw) || (b.tp - a.tp));
  if(!all.length) return `<div class="lb-empty">ยังไม่มีใครพิมพ์สักคำเลย — กด ⌨️ พิมพ์คำ ให้ครบคำ เป็นคนแรกบนกระดานสิ! 🥇</div>`;
  const rows = all.slice(0, LB_TP_TOP);
  const myIdx = all.findIndex(r=>r.id===myId);
  const medal = (i)=> i===0?'🥇':i===1?'🥈':i===2?'🥉':(i+1);
  const pz = (i)=> (typeof TpAward !== 'undefined') ? TpAward.prizeFor(i+1) : 0;
  const list = rows.map((r,i)=>`
    <div class="lb-row${r.id===myId?' lb-me':''}">
      <span class="lb-rank">${medal(i)}</span>
      <span class="lb-name pl-click" data-uid="${escapeHTML(r.id||'')}" data-n="${escapeHTML(r.n)}" data-g="${escapeHTML(r.g||'')}">${r.id===myId?'⭐ ':''}${escapeHTML(splitNameBadges(r.n).name)}<small> ${idTag(r.id)}${gradeMark(gradeOf(r.id, r.g))}</small>${pz(i)?`<small class="lb-prize">🎁 ${fmtNum(pz(i))} เหรียญ</small>`:''}</span>
      <span class="lb-coins">⌨️ ${fmtNum(r.tw)} คำ<small class="lb-sub">${fmtNum(r.tp)} เหรียญ</small></span>
    </div>`).join('');
  const meLine = myIdx >= 0
    ? (myIdx < LB_TP_TOP ? `${selfPronoun()}อยู่อันดับที่ ${myIdx+1} ของ Top ${LB_TP_TOP} · พิมพ์แล้ว ${fmtNum(map[myId].tw)} คำ · ${fmtNum(map[myId].tp)} เหรียญ ⌨️`
                         : `${selfPronoun()}พิมพ์แล้ว ${fmtNum(map[myId].tw)} คำ (อันดับ ${myIdx+1}) — พิมพ์อีกนิดก็ติด Top ${LB_TP_TOP} แล้ว 💪`)
    : `เล่นเกม ⌨️ พิมพ์คำ ให้ได้หลาย ๆ คำ เพื่อขึ้น Top ${LB_TP_TOP} นะ 💪`;
  const when = (typeof TpAward !== 'undefined')
    ? `<div class="lb-award-bar tpa-open" role="button" tabindex="0">⏰ ตัดสินอันดับ <b>ทุกวันที่ 1 เวลา 00:01 น.</b> เท่านั้น · ${TpAward.fmtLeft(TpAward.nextCutDate() - Date.now())}
         <span class="lb-award-go">📜 กระดานประกาศรางวัล</span></div>` : '';
  return `<div class="online-count">${meLine}</div>${when}
    <div class="lb-list">${list}</div>`;
}

/* 🫧 อันดับฟอง Top 10 all time — ดึงกระดานเฉพาะ bb เพื่อให้ผู้เล่นเหรียญรวมน้อยยังติดอันดับได้ */
function lbBubbleHtml(){
  const myId=onlineKey(),map={};
  (Online.bbBoard||[]).forEach(r=>{map[r.id]={id:r.id,n:r.n,g:r.g,bb:r.bb||0};});
  const meName=(state.profileName||(state.student?state.student.first:'')||'หนู')+((typeof badgeSuffix==='function')?badgeSuffix():'');
  map[myId]={id:myId,n:meName,g:(state.student?state.student.grade:''),bb:Math.round(state.bbScore||0)};
  const all=Object.values(map).filter(r=>r.bb>0).sort((a,b)=>b.bb-a.bb);
  if(!all.length)return `<div class="lb-empty">ยังไม่มีใครเก็บคะแนนฟองเลย — กด 🫧 ฟอง แล้วเป็นคนแรกบนกระดานสิ! 🥇</div>`;
  const rows=all.slice(0,LB_BB_TOP),myIdx=all.findIndex(r=>r.id===myId);
  const medal=i=>i===0?'🥇':i===1?'🥈':i===2?'🥉':(i+1);
  const pz=i=>(typeof BbAward!=='undefined')?BbAward.prizeFor(i+1):0;
  const list=rows.map((r,i)=>`<div class="lb-row${r.id===myId?' lb-me':''}">
    <span class="lb-rank">${medal(i)}</span>
    <span class="lb-name pl-click" data-uid="${escapeHTML(r.id||'')}" data-n="${escapeHTML(r.n)}" data-g="${escapeHTML(r.g||'')}">${r.id===myId?'⭐ ':''}${escapeHTML(splitNameBadges(r.n).name)}<small> ${idTag(r.id)}${gradeMark(gradeOf(r.id,r.g))}</small>${pz(i)?`<small class="lb-prize">🎁 ${fmtNum(pz(i))} เหรียญ</small>`:''}</span>
    <span class="lb-coins">🫧 ${fmtNum(r.bb)}</span></div>`).join('');
  const meLine=myIdx>=0?(myIdx<LB_BB_TOP?`${selfPronoun()}อยู่อันดับที่ ${myIdx+1} ของ Top ${LB_BB_TOP} · ${fmtNum(map[myId].bb)} คะแนน 🫧`:`${selfPronoun()}มี ${fmtNum(map[myId].bb)} คะแนน (อันดับ ${myIdx+1}) — แตะฟองอีกนิดก็ติด Top ${LB_BB_TOP} แล้ว 💪`):`เล่นเกม 🫧 ฟอง เก็บคะแนนเพื่อขึ้น Top ${LB_BB_TOP} นะ 💪`;
  const when=(typeof BbAward!=='undefined')?`<div class="lb-award-bar bba-open" role="button" tabindex="0">⏰ ตัดสินอันดับ <b>ทุกวันที่ 1 เวลา 00:01 น.</b> เท่านั้น · ${BbAward.fmtLeft(BbAward.nextCutDate()-Date.now())}<span class="lb-award-go">📜 กระดานประกาศรางวัล</span></div>`:'';
  return `<div class="online-count">${meLine}</div>${when}<div class="lb-list">${list}</div>`;
}

/* 🎯 รอบ 917: เนื้อหาแท็บยิงเป้าคำ — "10 อันดับนักแม่นปืนคำศัพท์ of all time" (เกม 3D สวนสนุก)
   แต้ม = ความยาวคำ×2 ต่อคำที่ยิงสะกดครบ (+5 ไม่พลาดเลย) สะสมถาวรใน state.sgScore → /leaderboard field sg
   โครงเหมือน lbWordSearchHtml() ทุกอย่าง ต่างแค่ field/อีโมจิ/ชื่อเกม/เครื่องจ่ายรางวัล (SgAward) */
function lbShootHtml(){
  const myId = onlineKey();
  const map = {};
  (Online.board || []).forEach(r=>{ map[r.id] = {id:r.id, n:r.n, g:r.g, sg:r.sg||0}; });
  // แทนที่ตัวเราด้วยค่าสดจาก state (เห็นทันทีแม้ push ยังไม่ถึง / rules ยังไม่ publish)
  const meName = (state.profileName || (state.student ? state.student.first : '') || 'หนู') + ((typeof badgeSuffix==='function')?badgeSuffix():'');
  map[myId] = {id:myId, n: meName, g:(state.student?state.student.grade:''), sg: Math.round(state.sgScore||0)};
  const all = Object.values(map).filter(r=>r.sg > 0).sort((a,b)=> b.sg - a.sg);
  if(!all.length) return `<div class="lb-empty">ยังไม่มีใครเก็บแต้มยิงเป้าเลย — เข้าซุ้ม 🎯 ยิงสะกดคำแรก เป็นคนแรกบนกระดานสิ! 🥇</div>`;
  const rows = all.slice(0, LB_SG_TOP);
  const myIdx = all.findIndex(r=>r.id===myId);
  const medal = (i)=> i===0?'🥇':i===1?'🥈':i===2?'🥉':(i+1);
  const pz = (i)=> (typeof SgAward !== 'undefined') ? SgAward.prizeFor(i+1) : 0;
  const list = rows.map((r,i)=>`
    <div class="lb-row${r.id===myId?' lb-me':''}">
      <span class="lb-rank">${medal(i)}</span>
      <span class="lb-name pl-click" data-uid="${escapeHTML(r.id||'')}" data-n="${escapeHTML(r.n)}" data-g="${escapeHTML(r.g||'')}">${r.id===myId?'⭐ ':''}${escapeHTML(splitNameBadges(r.n).name)}<small> ${idTag(r.id)}${gradeMark(gradeOf(r.id, r.g))}</small>${pz(i)?`<small class="lb-prize">🎁 ${fmtNum(pz(i))} เหรียญ</small>`:''}</span>
      <span class="lb-coins">🎯 ${fmtNum(r.sg)}</span>
    </div>`).join('');
  const meLine = myIdx >= 0
    ? (myIdx < LB_SG_TOP ? `${selfPronoun()}อยู่อันดับที่ ${myIdx+1} ของ Top ${LB_SG_TOP} · ${fmtNum(map[myId].sg)} แต้ม 🎯`
                         : `${selfPronoun()}มี ${fmtNum(map[myId].sg)} แต้ม (อันดับ ${myIdx+1}) — ยิงอีกนิดก็ติด Top ${LB_SG_TOP} แล้ว 💪`)
    : `เข้าซุ้ม 🎯 ยิงเป้าคำศัพท์ เก็บแต้มเพื่อขึ้น Top ${LB_SG_TOP} นะ 💪`;
  const when = (typeof SgAward !== 'undefined')
    ? `<div class="lb-award-bar sga-open" role="button" tabindex="0">⏰ ตัดสินอันดับ <b>ทุกวันที่ 1 เวลา 00:01 น.</b> เท่านั้น · ${SgAward.fmtLeft(SgAward.nextCutDate() - Date.now())}
         <span class="lb-award-go">📜 กระดานประกาศรางวัล</span></div>` : '';
  return `<div class="online-count">${meLine}</div>${when}
    <div class="lb-list">${list}</div>`;
}

/* ============================================================
   การ์ดข้อมูลผู้เล่น 👤 — คลิกชื่อในการ์ดเพื่อน/กระดาน แล้วโชว์
   เงินรวม · จำนวนทรัพย์สิน · มูลค่าทรัพย์สินรวม (แยกกัน ไม่รวมยอด)
   เพื่อเป็นแรงบันดาลใจให้ผู้เล่นอื่นตั้งใจเล่น
   ============================================================ */
function bindPlayerClicks(){
  if(window.__plClickBound) return;         // ผูก listener ครั้งเดียว (การ์ด re-render บ่อย)
  window.__plClickBound = true;
  document.addEventListener('click', (e)=>{
    const t = e.target.closest('.pl-click');
    if(!t) return;
    showPlayerCard(t.dataset.uid, t.dataset.n || 'ผู้เล่น', t.dataset.g || '');
  });
}

function showPlayerCard(uid, name, grade){
  // แยกเข็มระดับสูงสุดที่ baked มากับชื่อ แล้วขยายเป็นทุกระดับที่ผู้เล่นเคยได้ (รอบ 1082)
  const sp = (typeof splitNameBadges === 'function') ? splitNameBadges(name) : {name, badges:''};
  const arr = (typeof earnedBadgeEmojis === 'function') ? earnedBadgeEmojis(sp.badges)
    : ((typeof badgeEmojis === 'function') ? badgeEmojis(sp.badges) : []);
  const badgesHTML = arr.length
    ? `<div class="pl-badges-vwrap"><button class="pl-badge-arrow pba-u" aria-label="เลื่อนเข็มขึ้น">▲</button>
        <div class="pl-badges-strip grid3x5">${arr.map(e=>{
          const nm = (BADGE_META[e]||{}).n || '';
          return `<div class="pl-badge-card" title="${escapeHTML(nm)}">
            ${(typeof badgeIcHTML==='function')?badgeIcHTML(e,'pl-badge-card-ic'):`<span class="pl-badge-card-ic badge-ic-fallback">${e}</span>`}
            <span class="pl-badge-card-nm">${escapeHTML(nm)}</span>
          </div>`;
        }).join('')}</div>
        <button class="pl-badge-arrow pba-d" aria-label="เลื่อนเข็มลง">▼</button></div>`
    : `<div class="pl-badges-empty">ยังไม่มีเข็มเกียรติยศ 🎖️<br><small>เล่นเกม สอบผ่าน หรือทำภารกิจพิเศษเพื่อปลดเข็มแรก!</small></div>`;
  // 📰 รอบ 155: การ์ดยืดกว้างเกือบเต็มจอ + ปุ่ม Follow + กิจกรรมล่าสุด + กริดทรัพย์สินที่เปิดเผย
  const me = (typeof onlineKey === 'function') && uid === onlineKey();
  const canFollow = !!uid && !me && typeof followSet === 'function'
                    && typeof Online !== 'undefined' && Online.ready;
  /* 💬 รอบ 276: เป็นเพื่อนกันแล้ว → ปุ่มทักแชทตรงจากการ์ด (แชทเปิดเฉพาะคู่เพื่อน) */
  const myFriend = (!me && typeof Online !== 'undefined' && Online.ready && typeof openChat === 'function')
    ? (Online.myFriends || []).find(f=>f.uid === uid) : null;
  const ov = document.createElement('div');
  ov.className = 'pl-overlay';
  ov.innerHTML = `<div class="pl-card pl-wide">
      <button class="pl-close">✕</button>
      <div class="pl-head">👤 <span>${escapeHTML(sp.name)}</span>
        ${myFriend ? `<button class="pl-chat" title="ส่งข้อความหาเพื่อน">💬 แชท</button>
        <button class="pl-call" type="button" title="โทรหาเพื่อนด้วยเสียง">📞</button>` : ''}
        ${(!me && typeof Online !== 'undefined' && Online.ready && typeof greetSend === 'function')
          ? `<button class="pl-greet" title="ส่งคำทักทายถึงสัตว์เลี้ยงของเพื่อน">🐾 ทักทายน้อง</button>` : ''}
        ${canFollow ? `<button class="pl-unfollow" style="display:none">Unfollow<small>เลิกติดตาม</small></button><button class="pl-follow"></button>` : ''}
      </div>
      <div class="pl-grade">${idTag(uid) || 'ผู้เล่น Vocab World'}${(()=>{   // 🎖️ รอบ 643: ระดับชั้นใต้ชื่อ (กันโกงชั้นปั๊มเหรียญ)
          const mk = gradeMark(gradeOf(uid, grade));
          return mk ? `<span class="pl-glabel">ระดับชั้น</span>${mk}` : '';
        })()}<span class="pl-followers"></span></div>
      <div class="pl-body">
        <div class="pl-cols pl-cols-top">
          <div class="pl-col pl-stats-col"><div class="pl-loading">⏳ กำลังโหลดข้อมูล...</div></div>
          <div class="pl-col pl-badges-col">
            <div class="pl-sec-title">🎖️ เข็มเกียรติยศ</div>
            ${badgesHTML}
          </div>
        </div>
        <!-- 🔁 รอบ 737 (ผู้ใช้สั่ง): กิจกรรมล่าสุด+ประกาศนียบัตร ย้ายลงแถวล่าง ให้เข็มเกียรติยศขึ้นแทนแถวบน -->
        <div class="pl-cols pl-cols-bottom">
          <div class="pl-col">
            <div class="pl-sec-title">📰 กิจกรรมล่าสุด</div>
            <div class="pl-feed"><div class="pl-loading">⏳ กำลังโหลด...</div></div>
          </div>
          <!-- 🎖️ รอบ 712: ตู้ใบประกาศ = คอลัมน์ที่ 2 ของแถวล่าง
               ของตัวเองอ่านจากเซฟครบทุกใบ · ของเพื่อนอ่านจากโพสต์สอบผ่านที่เขาเปิดเผย -->
          <div class="pl-col pl-certs-wrap" style="display:none">
            <div class="pl-sec-title">🎖️ ประกาศนียบัตร <small class="pl-sec-sub">แตะดูใบใหญ่</small></div>
            <div class="pl-certs"></div>
          </div>
        </div>
        <div class="pl-pets-wrap" style="display:none">
          <div class="pl-sec-title">🐾 สัตว์เลี้ยง</div>
          <div class="pl-pets"></div>
        </div>
        <div class="pl-assets-wrap" style="display:none">
          <div class="pl-sec-title">🏆 ทรัพย์สินที่เปิดเผย</div>
          <!-- รอบ 616: เรียงแบบเดียวกับแคตตาล็อกโรงงาน (2 แถว × 8 คอลัมน์ + ลูกศรเลื่อน) -->
          <div class="strip-wrap"><button class="strip-arrow sa-l" aria-label="เลื่อนซ้าย">❮</button>
            <div class="strip-x pl-assets grid2x8"></div>
            <button class="strip-arrow sa-r" aria-label="เลื่อนขวา">❯</button></div>
        </div>
      </div>
    </div>`;
  document.body.appendChild(ov);
  bindProfileBadgeScroll(ov.querySelector('.pl-badges-vwrap'));   // 🎖️ รอบ 1082: 3 แถว × 5 คอลัมน์ ปัดขึ้นลง
  const close = ()=>ov.remove();
  ov.addEventListener('click', (e)=>{ if(e.target === ov) close(); });
  ov.querySelector('.pl-close').addEventListener('click', close);

  /* ---- ปุ่ม Follow (ทางเดียวแบบ TikTok ไม่ต้องอนุมัติ) + จำนวนผู้ติดตาม ---- */
  const loadFollowers = ()=>{
    if(typeof fetchFollowers !== 'function') return;
    fetchFollowers(uid).then(n=>{
      const el = ov.querySelector('.pl-followers');
      if(el && n != null) el.textContent = ` · 👥 ผู้ติดตาม ${fmtNum(n)} คน`;
    });
  };
  /* ปุ่มเลิกติดตามแยกออกมาไว้หน้าปุ่มสถานะ "ติดตามแล้ว" (ผู้ใช้สั่ง 16 ก.ค. 2026)
     — เดิมซ่อนรวมในปุ่มเดียว คนไม่กล้าคลิกมั่วเลยหาไม่เจอ · ป้ายอังกฤษ+คำแปลไทย */
  const fBtn = ov.querySelector('.pl-follow');
  const uBtn = ov.querySelector('.pl-unfollow');
  if(fBtn){
    const afterChange = ()=>{
      paintFollow();
      setTimeout(loadFollowers, 600);   // รอ DB รับค่าก่อนนับใหม่
      if(typeof renderFeedCard === 'function') renderFeedCard();
    };
    const paintFollow = ()=>{
      const onF = !!(state.follows && state.follows[uid]);
      fBtn.textContent = onF ? '✓ ติดตามแล้ว' : '➕ ติดตาม';
      fBtn.classList.toggle('on', onF);
      if(uBtn) uBtn.style.display = onF ? '' : 'none';
    };
    paintFollow();
    fBtn.addEventListener('click', ()=>{
      if(state.follows && state.follows[uid]){
        toast('อยากเลิกติดตาม กดปุ่มแดง "Unfollow เลิกติดตาม" ได้เลยนะ');
        return;
      }
      followSet(uid, sp.name, grade || '');
      sfx.select();
      toast(`📰 ติดตาม ${sp.name} แล้ว! กิจกรรมของเขาจะมาโชว์ในฟีดหน้าหลัก`);
      afterChange();
    });
    if(uBtn) uBtn.addEventListener('click', ()=>{
      if(!(state.follows && state.follows[uid])) return;
      followUnset(uid);
      toast(`เลิกติดตาม ${sp.name} แล้ว`);
      afterChange();
    });
  }
  loadFollowers();

  /* ---- 💬 รอบ 276: ปุ่มทักแชท → ปิดการ์ดแล้วเปิดกล่องแชทกับเพื่อนคนนี้เลย ---- */
  const chatBtn = ov.querySelector('.pl-chat');
  if(chatBtn) chatBtn.addEventListener('click', ()=>{ sfx.select(); close(); openChat(myFriend); });
  /* 📞 รอบ 628: โทรหาเพื่อนตรงจากการ์ดโปรไฟล์ (ปิดการ์ดก่อน จอคุยจะได้ไม่ซ้อนของเก่า) */
  ov.querySelectorAll('.pl-call').forEach(b=>b.addEventListener('click', ()=>{
    close(); startCall(myFriend);
  }));
  const greetBtn = ov.querySelector('.pl-greet');   // 🐾 รอบ 325: ทักทายน้องของเพื่อน (ฟรี ไม่ต้องเป็นเพื่อนกันก็ทักได้)
  if(greetBtn) greetBtn.addEventListener('click', ()=>{ sfx.select(); openGreetPicker(uid, sp.name); });

  /* ---- คอลัมน์ซ้าย: สถิติการเงิน (เดิม) ---- */
  const statsFn = (typeof fetchPlayerStats === 'function') ? fetchPlayerStats(uid) : Promise.resolve(null);
  statsFn.then(d=>{
    const body = ov.querySelector('.pl-stats-col');
    if(!body) return;
    if(!d){
      body.innerHTML = `<div class="pl-none">ยังไม่มีข้อมูลของผู้เล่นคนนี้ 😅<br>
        <small>ผู้เล่นต้องเข้าเกมสักครั้งเพื่อบันทึกข้อมูลก่อนนะ</small></div>`;
      return;
    }
    const av = (d.av == null) ? '—' : fmtNum(d.av) + ' 🪙';
    const ni = (d.ni == null) ? '—' : fmtNum(d.ni) + ' ชิ้น';
    /* 🪪 รอบ 255: ตัวละคร blk เต็มตัวใหญ่ใต้ชื่อ (ba จาก /leaderboard · เจ้าของการ์ดยังไม่อัปเดต = ไม่โชว์)
       📷 รอบ 709: ถ้าเจ้าของการ์ดอัปโหลดรูปตัวเองไว้ → ใช้รูปนั้นแทน (ของเรารู้ทันที · ของเพื่อนโหลดตามทีหลัง) */
    const myPh = d.me && (typeof photoGet === 'function') ? photoGet() : '';
    const blkImg = myPh
      ? `<div class="pl-blk-wrap"><img class="pl-photo" src="${myPh}" alt="รูปโปรไฟล์"></div>`
      : ((d.ba && /^blk[1-8]$/.test(d.ba))
        ? `<div class="pl-blk-wrap"><img class="pl-blk" src="img/blocks/${d.ba}.png" alt="ตัวละคร"></div>` : '');
    body.innerHTML = `
      ${blkImg}
      ${d.me ? `<div class="pl-me-tag">⭐ นี่คือ${selfTag()}</div>` : ''}
      <div class="pl-stat">
        <span class="pl-lbl">💰 เงินรวม</span>
        <span class="pl-val pl-gold">${fmtNum(d.coins)} 🪙</span>
      </div>
      <div class="pl-stat">
        <span class="pl-lbl">📦 จำนวนทรัพย์สิน</span>
        <span class="pl-val">${ni}</span>
      </div>
      <div class="pl-stat">
        <span class="pl-lbl">🏆 มูลค่าทรัพย์สินรวม</span>
        <span class="pl-val pl-gold">${av}</span>
      </div>
      <div class="pl-tip">✨ ตั้งใจเล่น เก็บเงินและสะสมทรัพย์สินให้เยอะๆ นะ!</div>`;
    /* 📷 รอบ 709: รูปโปรไฟล์ของ "เพื่อน" อ่านทีหลัง (/pphoto อยู่คนละ node กับ leaderboard
       ตั้งใจแยก เพราะรูป ~20KB ถ้าอยู่ใน leaderboard จะถูกดึงมาทุกครั้งที่โหลดกระดาน)
       ต้องเรียกหลัง body.innerHTML เสมอ ไม่งั้นรูปที่แทรกไว้จะถูกเขียนทับ */
    if(!d.me && typeof photoFetch === 'function'){
      photoFetch(uid).then(url=>{
        if(!url || !ov.isConnected) return;
        const wrap = ov.querySelector('.pl-blk-wrap');
        const img  = `<img class="pl-photo" src="${url}" alt="รูปโปรไฟล์">`;
        if(wrap) wrap.innerHTML = img;
        else body.insertAdjacentHTML('afterbegin', `<div class="pl-blk-wrap">${img}</div>`);
      });
    }
  });

  /* ---- คอลัมน์ขวา: กิจกรรมล่าสุด (เห็นตามหมวดที่เจ้าตัวเปิดเผย — ไม่ต้อง follow ก็เห็น) ---- */
  const feedFn = (typeof fetchPlayerFeed === 'function') ? fetchPlayerFeed(uid) : Promise.resolve([]);
  feedFn.then(list=>{
    const el = ov.querySelector('.pl-feed');
    if(!el) return;
    if(!list.length){
      el.innerHTML = `<div class="pl-none">ยังไม่มีกิจกรรมที่เปิดเผย 🔒<br>
        <small>${me ? 'เปิด/ปิดกิจกรรมของหนูได้ในตั้งค่า ⚙️' : 'ผู้เล่นเลือกเองได้ว่าจะเปิดเผยอะไรในตั้งค่า ⚙️'}</small></div>`;
      return;
    }
    el.innerHTML = list.map(it=>{
      const fc = (typeof FEED_CATS !== 'undefined' && FEED_CATS[it.c]) || {e:'✨'};
      return `<div class="pl-feed-row"><span class="feed-ico">${fc.e}</span>
        <span class="feed-txt">${escapeHTML(it.tx)} <small class="feed-ago">· ${feedAgo(it.ts)}</small></span></div>`;
    }).join('');
    if(!me) plCerts(list.map(it=>({...it, u:uid, n:sp.name, g:grade || ''})));   // 🎖️ ใบประกาศของเพื่อน = อ่านจากโพสต์สอบผ่านที่เขาเปิดเผย
  });

  /* ---- 🎖️ รอบ 712: ตู้ใบประกาศ ---- */
  const plCerts = (posts)=>{
    if(typeof certStripHTML !== 'function') return;
    const wrap = ov.querySelector('.pl-certs-wrap');
    const box  = ov.querySelector('.pl-certs');
    if(!wrap || !box) return;
    const list = me
      ? certMine()
      : (posts || []).map(it=>certFromPost(it)).filter(Boolean)
          .sort((a, b)=>(b.ts || 0) - (a.ts || 0));
    if(!list.length && !me) return;                  // ของเพื่อนไม่มีใบ = ไม่ต้องโชว์หัวข้อเปล่า
    box.innerHTML = certStripHTML(list, me);
    certBindStrip(box, list);
    wrap.style.display = '';
    const cols = ov.querySelector('.pl-cols-bottom');   // 🔁 รอบ 737: certs อยู่แถวล่างแล้ว ไม่ใช่แถวบนที่มีเข็ม
    if(cols) cols.classList.add('has-certs');        // → กริดแถวล่างเปลี่ยนเป็น 2 คอลัมน์ (feed+certs)
  };
  if(me) plCerts(null);                              // ของตัวเองอ่านจากเซฟได้ทันที (ออฟไลน์ก็เห็น)

  /* ---- แถวล่าง: กริดทรัพย์สินที่เปิดเผย (ตารางแบบหน้าโรงงาน · ชิ้นซ้ำใส่เลขจำนวนซ้อนมุม) ---- */
  const assetsFn = (typeof fetchPlayerAssets === 'function') ? fetchPlayerAssets(uid) : Promise.resolve(null);
  assetsFn.then(counts=>{
    if(!counts) return;
    const ids = Object.keys(counts).filter(id=>collectInfo(id));
    if(!ids.length) return;
    const wrap = ov.querySelector('.pl-assets-wrap');
    const gridEl = ov.querySelector('.pl-assets');
    if(!wrap || !gridEl) return;
    // เรียงตามมูลค่าแพง→ถูก ให้ของเด่นขึ้นก่อน
    ids.sort((a,b)=>collectInfo(b).price - collectInfo(a).price);
    gridEl.innerHTML = ids.map(id=>{
      const c = collectInfo(id);
      const img = collectImg(id);
      const n = Math.max(1, Math.min(999, Math.round(counts[id])));
      return `<div class="pl-asset" title="${escapeHTML(c.name)}">
        ${img ? `<img src="${img}" alt="">` : `<span class="pl-asset-emoji">${c.emoji}</span>`}
        <span class="pl-asset-nm">${escapeHTML(c.name)}</span>
        ${n > 1 ? `<span class="pl-asset-n">×${n}</span>` : ''}
      </div>`;
    }).join('');
    wrap.style.display = '';
    bindStripArrows(wrap.querySelector('.strip-wrap'));   // ของน้อยกว่า 2 แถวเต็ม = ลูกศรซ่อนเอง (.no-x)
  });

  /* ---- 🐾 รอบ 195: สัตว์เลี้ยง (สูงสุด 3 ตัว) — ของตัวเองจาก state · คนอื่นจาก DB ถ้าเปิดเผย ---- */
  const petsFn = (typeof fetchPlayerPets === 'function') ? fetchPlayerPets(uid) : Promise.resolve(null);
  let plPets = null;   // รอบ 276: เก็บ descriptor ไว้เปิดการ์ดข้อมูลน้องตอนคลิก
  petsFn.then(list=>{
    if(!list || !list.length) return;
    const wrap = ov.querySelector('.pl-pets-wrap');
    const gridEl = ov.querySelector('.pl-pets');
    if(!wrap || !gridEl) return;
    plPets = list;
    gridEl.innerHTML = list.map((d,i)=>{
      const img = petDescImg(d);
      const nm = d.nm || ((PETS[d.t] || {}).name) || 'สัตว์เลี้ยง';
      return `<div class="pl-pet" title="${escapeHTML(nm)}" data-name="${escapeHTML(nm)}" data-pi="${i}">
        ${img ? `<img src="${img}" alt="">` : `<span class="pl-asset-emoji">${(PETS[d.t] || {}).adult || '🐾'}</span>`}
        <span class="pl-pet-nm">${escapeHTML(nm)}</span>
      </div>`;
    }).join('');
    wrap.style.display = '';
  });

  /* ---- 🖼️ รอบ 195: แตะภาพเล็ก → ภาพใหญ่ · รอบ 276: น้อง → การ์ดข้อมูลย่อ openPetPeek
     รอบ 277: เจ้าของเป็นเพื่อนกัน → การ์ดน้องมีปุ่ม 🎁 (onGift ปิดการ์ดโปรไฟล์ก่อน กันบังกล่องของขวัญ) ---- */
  ov.addEventListener('click', (e)=>{
    const pet = e.target.closest('.pl-pet');
    if(pet && plPets && plPets[+pet.dataset.pi]){
      openPetPeek(plPets[+pet.dataset.pi], myFriend ? {giftFriend: myFriend, onGift: close} : null);
      return;
    }
    const cell = e.target.closest('.pl-asset');
    if(!cell) return;
    const img = cell.querySelector('img');
    const src = img && img.getAttribute('src');
    if(src) openImgLightbox(src, cell.dataset.name || cell.getAttribute('title') || '');
  });
}

/* 🎖️ รอบ 1082: ปุ่มเสริมสำหรับตู้เข็มแนวตั้ง (การปัดนิ้วยังคงเป็นวิธีหลัก)
   ซ่อนปุ่มบน/ล่างตามตำแหน่งจริง เพื่อบอกผู้เล่นทันทีว่ายังมีเข็มต่อด้านไหน */
function bindProfileBadgeScroll(wrap){
  if(!wrap) return;
  const grid = wrap.querySelector('.pl-badges-strip');
  const up = wrap.querySelector('.pba-u'), down = wrap.querySelector('.pba-d');
  const page = ()=>Math.max(120, grid.clientHeight * .9);
  const paint = ()=>{
    const max = Math.max(0, grid.scrollHeight - grid.clientHeight);
    wrap.classList.toggle('at-top', grid.scrollTop <= 2);
    wrap.classList.toggle('at-bottom', grid.scrollTop >= max - 2);
    wrap.classList.toggle('no-y', max <= 4);
  };
  up.addEventListener('click', ()=>{ sfx.select(); grid.scrollBy({top:-page(), behavior:'smooth'}); });
  down.addEventListener('click', ()=>{ sfx.select(); grid.scrollBy({top:page(), behavior:'smooth'}); });
  grid.addEventListener('scroll', paint, {passive:true});
  setTimeout(paint, 0);
}

/* ภาพสัตว์เลี้ยงจากตัวย่อ {t,s,sh,e} — ใช้ไฟล์ภาพชุดเดียวกับในเกม (probe แล้วใน IMG_FILES) */
function petDescImg(d){
  if(!d || !d.t) return null;
  const P = (typeof PETS !== 'undefined') ? PETS[d.t] : null;
  if(d.s === 'egg') return (P && IMG_FILES[`${d.t}_${P.startKey}`]) || null;
  const cands = [];
  if(d.s === 'adult' && d.sh && d.sh !== 'normal') cands.push(`${d.t}_adult_${d.sh}`);
  if(d.e) cands.push(`${d.t}_${d.s}_${d.e}`);
  cands.push(`${d.t}_${d.s}_normal`);
  for(const k of cands){ if(IMG_FILES[k]) return IMG_FILES[k]; }
  return null;
}

/* 🖼️ รอบ 195: Layer ภาพใหญ่ (lightbox) — เกือบเต็มจอ · object-fit:contain ไม่มี scrollbar · แตะที่ไหนก็ปิด */
function openImgLightbox(src, caption){
  if(!src) return;
  const lb = document.createElement('div');
  lb.className = 'img-lightbox';
  lb.innerHTML = `<div class="ilb-inner">
      <img src="${src}" alt="">
      ${caption ? `<div class="ilb-cap">${escapeHTML(caption)}</div>` : ''}
      <button class="ilb-x" type="button" aria-label="ปิด">✕</button>
    </div>`;
  document.body.appendChild(lb);
  requestAnimationFrame(()=>lb.classList.add('on'));
  const close = ()=>{ lb.classList.remove('on'); setTimeout(()=>lb.remove(), 220); };
  lb.addEventListener('click', close);
  if(typeof sfx !== 'undefined' && sfx.select) sfx.select();
}

/* 🐾 รอบ 276: การ์ดข้อมูลน้องฉบับย่อ — คลิกน้องในโปรไฟล์ผู้เล่น (ของเพื่อนมีแค่ descriptor {t,s,sh,e,nm}
   จาก /feed/<uid>/pt จึงโชว์ได้เท่าที่เปิดเผย: ชนิด/วัย/หุ่น/ไอเทมที่สวม) · แตะที่ไหนก็ปิด ไม่มี scroll
   รอบ 277: opts.giftFriend = เจ้าของน้องเป็นเพื่อนกัน → ปุ่ม 🎁 ส่งของขวัญให้เจ้าของ (opts.onGift ให้ผู้เรียก
   ปิดการ์ดโปรไฟล์ก่อน — gift-pick-overlay z 85 ต่ำกว่า pl-overlay 90 ไม่ปิดจะโดนบัง) */
function openPetPeek(d, opts){
  if(!d || !d.t) return;
  const P = (typeof PETS !== 'undefined' && PETS[d.t]) || {};
  const img = petDescImg(d);
  const nm = d.nm || P.name || 'สัตว์เลี้ยง';
  const stageNames = {egg:'🥚 ยังเป็นไข่', baby:'🍼 ร่างเด็ก', adult:'🌟 ร่างโตเต็มวัย'};
  const chips = [`${P.adult || '🐾'} ${P.name || 'สัตว์เลี้ยง'}`];
  if(stageNames[d.s]) chips.push(stageNames[d.s]);
  if(d.s !== 'egg'){
    const sh = (typeof SHAPE_UI !== 'undefined') ? SHAPE_UI[d.sh] : null;
    chips.push(sh ? `${sh.icon} ${sh.name}` : '✨ สมส่วน');
  }
  const it = (d.e && typeof ITEMS !== 'undefined') ? ITEMS.find(i=>i.id === d.e) : null;
  if(it) chips.push(`${it.emoji} สวม${it.name}`);
  const gf = (opts && opts.giftFriend && typeof openGiftPicker === 'function') ? opts.giftFriend : null;
  const lb = document.createElement('div');
  lb.className = 'img-lightbox pet-peek';
  lb.innerHTML = `<div class="ilb-inner">
      ${img ? `<img src="${img}" alt="">` : `<div class="pp-emoji">${P.adult || '🐾'}</div>`}
      <div class="ilb-cap">${escapeHTML(nm)}</div>
      <div class="pp-chips">${chips.map(c=>`<span class="pp-chip">${escapeHTML(c)}</span>`).join('')}</div>
      ${gf ? `<button class="pp-gift" type="button">🎁 ส่งของขวัญให้ ${escapeHTML(splitNameBadges(gf.n).name || gf.n)}</button>` : ''}
      <button class="ilb-x" type="button" aria-label="ปิด">✕</button>
    </div>`;
  document.body.appendChild(lb);
  requestAnimationFrame(()=>lb.classList.add('on'));
  const close = ()=>{ lb.classList.remove('on'); setTimeout(()=>lb.remove(), 220); };
  lb.addEventListener('click', close);
  const gBtn = lb.querySelector('.pp-gift');
  if(gBtn) gBtn.addEventListener('click', (e)=>{
    e.stopPropagation();
    close();
    if(opts.onGift) opts.onGift();
    openGiftPicker(gf);
  });
  if(typeof sfx !== 'undefined' && sfx.select) sfx.select();
}

/* ============================================================
   แผงเพื่อน 👥 (ข้อ 0.3): รหัสเพื่อน + ค้นหา + คำขอ + รายชื่อเพื่อน
   - ตัวโครง (รหัส/ช่องค้นหา) สร้างครั้งเดียว (dataset.built) กันช่องค้นหา
     ถูกล้างตอน presence tick · ส่วนที่ขยับ (คำขอ/เพื่อน) refresh แยก
   ============================================================ */
/* จุดแดงแจ้งบิลค้างบนปุ่มเมนู — บ้าน (บำรุง/ไฟ/น้ำ/ขยะ) · ร้านค้า (เน็ต/ข้อมูล) */
function updateBillBadges(){
  const homeDue = ['maint','elec','water','trash'].some(id => billOutstanding(id) > 0);
  const set = (id, on)=>{ const b = document.getElementById(id); if(!b) return; if(on){ b.textContent = '!'; b.style.display = ''; } else b.style.display = 'none'; };
  set('home-bill-badge', homeDue);
  updateSettingsBadge();
}

/* ตั้งเลข badge + เด้งครั้งเดียวตอน "เพิ่มขึ้น" (มีของใหม่เข้า) — ใช้ร่วมกันทุก badge นับเลข (เพื่อน/ของขวัญ/รวม)
   คืน true ถ้าเลขเพิ่ม (ให้ badge รวมเอาไปสั่น) · ไม่เด้งตอนโหลดแรก/เลขเท่าเดิม/ลด · no-anim ปิดการเด้งเอง */
const _badgeLast = {};
function setBadge(el, n){
  if(!el) return false;
  if(n > 0){ el.textContent = n; el.style.display = ''; }
  else el.style.display = 'none';
  const key = el.id, last = _badgeLast[key];
  const increased = (last != null && n > last && n > 0);
  if(increased){
    el.classList.remove('badge-pop'); void el.offsetWidth;   // รีสตาร์ตแอนิเมชัน
    el.classList.add('badge-pop');
    el.addEventListener('animationend', ()=>el.classList.remove('badge-pop'), {once:true});
  }
  _badgeLast[key] = n;
  return increased;
}

/* จำนวนคำเชิญเล่นโลก 3D ด้วยกันที่ยังค้างอยู่ (ไม่นับที่กด "ไว้ก่อน" ซ่อนไปแล้วรอบนี้) */
function tinvPendingCount(){
  if(typeof Online === 'undefined' || !Online.tinv) return 0;
  const hidden = Online.tinvHidden || {};
  return Object.keys(Online.tinv).filter(fid=>!hidden[fid]).length;
}

/* รายการดิบที่ใช้เลขแดง: fingerprint เปลี่ยนเฉพาะเมื่อมีของใหม่/ยอดเปลี่ยน
   จึงแยก "เห็นแล้ว" ออกจาก "จัดการเสร็จแล้ว" ได้ โดยไม่ลบคำเชิญ/ข้อความ/บิลจริง */
function attentionPendingItems(){
  const items = [];
  ['maint','elec','water','trash','net','data'].forEach(id=>{
    const due = billOutstanding(id);
    if(due > 0) items.push(`b:${id}:${due}`);
  });
  const reqs = (typeof Online !== 'undefined' && Online.reqs) ? Online.reqs : [];
  reqs.forEach(r=>items.push(`r:${r.uid||''}:${r.ts||0}`));
  const chats = (typeof Online !== 'undefined' && Online.chatUnread) ? Online.chatUnread : {};
  Object.keys(chats).sort().forEach(uid=>items.push(`c:${uid}`));
  const gifts = (typeof Online !== 'undefined' && Online.giftIn) ? Online.giftIn : [];
  gifts.forEach(g=>items.push(`g:${g.key||''}:${g.from||''}:${g.id||''}:${g.ts||0}`));
  if(typeof Online !== 'undefined' && Online.tinv){
    const hidden = Online.tinvHidden || {};
    Object.entries(Online.tinv).filter(([uid])=>!hidden[uid]).forEach(([uid,v])=>
      items.push(`i:${uid}:${v.map||''}:${v.ts||0}`));
  }
  return items;
}

function attentionUnseenCount(){
  const seen = (typeof state !== 'undefined' && state.attentionSeen) ? state.attentionSeen : {};
  return attentionPendingItems().filter(key=>!seen[key]).length;
}

function attentionAcknowledge(){
  if(typeof state === 'undefined') return;
  if(!state.attentionSeen || typeof state.attentionSeen !== 'object') state.attentionSeen = {};
  const now = Date.now();
  attentionPendingItems().forEach(key=>{ state.attentionSeen[key] = now; });
  // กันเซฟโตไม่จบ: เก็บลายนิ้วมือที่เห็นล่าสุดไม่เกิน 200 รายการ
  const entries = Object.entries(state.attentionSeen).sort((a,b)=>(b[1]||0)-(a[1]||0)).slice(0,200);
  state.attentionSeen = Object.fromEntries(entries);
  saveState();
  updateSettingsBadge();
}

/* เลขรวมบนปุ่ม ⚙️ ตั้งค่า = บิลค้าง + คำขอเพื่อน/แชท + ของขวัญที่ยังไม่เปิด + คำเชิญเล่นด้วยกัน (attention รวมให้เห็นแต่ไกล)
   🚨 รอบ 814: คำเชิญ (tinv) เดิมพึ่งแค่ toast (หายไว) + การ์ดในกล่องเพื่อนบนล็อบบี้ (ต้องเปิดจอถูกจังหวะ) — พลาดง่ายมาก
   เลยรวมเข้า badge ถาวรนี้ด้วย เห็นได้ทุกหน้าจอเหมือนของขวัญ/คำขอเพื่อน */
function updateSettingsBadge(){
  const b = document.getElementById('settings-badge');
  if(!b) return;
  // มื้อเย็นเป็นกิจกรรมเสริม (ไม่กินก็ไม่ป่วย) และมีปุ่มเฉพาะของตัวเองอยู่แล้ว จึงไม่ใช่ปัญหาสีแดง
  const total = attentionUnseenCount();
  const btn = b.closest('#btn-settings');
  if(btn){
    btn.title = total > 0 ? `มี ${total} รายการต้องจัดการ · แตะเพื่อดู` : 'ตั้งค่า (เสียง/สั่น)';
    btn.setAttribute('aria-label', total > 0 ? `มี ${total} รายการต้องจัดการ` : 'ตั้งค่า');
  }
  // สั่นครั้งเดียวที่ badge รวม (แหล่งเดียว กันสั่นซ้ำกับ badge ย่อย) · badge ย่อยเด้งภาพพร้อมกันเอง
  if(setBadge(b, total)
     && typeof state !== 'undefined' && state.haptic !== false && navigator.vibrate) navigator.vibrate(30);
}

/* ข้อมูลต้นทางเดียวของ badge/เมนูสรุป/แถบบอกเหตุผลในหน้าตั้งค่า */
function attentionSummaryData(){
  const homeIds = ['maint','elec','water','trash'], shopIds = ['net','data'];
  const homeBills = homeIds.filter(id => billOutstanding(id) > 0).length;
  const shopBills = shopIds.filter(id => billOutstanding(id) > 0).length;
  const homeTotal = homeIds.reduce((s,id)=> s + billOutstanding(id), 0);
  const shopTotal = shopIds.reduce((s,id)=> s + billOutstanding(id), 0);
  const billTotal = homeTotal + shopTotal;
  const reqs  = (typeof Online !== 'undefined' && Online.reqs) ? Online.reqs.length : 0;
  const chats = (typeof Online !== 'undefined' && Online.chatUnread) ? Object.keys(Online.chatUnread).length : 0;
  const gifts = (typeof Online !== 'undefined' && Online.giftIn) ? Online.giftIn.length : 0;
  const invEntries = (typeof Online !== 'undefined' && Online.tinv)
    ? Object.entries(Online.tinv).filter(([fid])=>!(Online.tinvHidden && Online.tinvHidden[fid])) : [];
  const rows = [];
  if(homeBills > 0)   rows.push({ico:'🏠', txt:`บิลบ้านค้าง ${homeBills} รายการ`, sub:`ค่าบำรุง/ไฟ/น้ำ/ขยะ · รวม 🪙${fmtNum(homeTotal)}`, panel:'panel-home'});
  if(shopBills > 0)   rows.push({ico:'📡', txt:`บิลบริการค้าง ${shopBills} รายการ`, sub:`ค่าเน็ต/ค่าบริการข้อมูล · รวม 🪙${fmtNum(shopTotal)}`, panel:'panel-market'});
  if(reqs + chats > 0) rows.push({ico:'👥', txt:`คำขอเพื่อน/ข้อความใหม่ ${reqs + chats}`, sub:'ไปดูที่แผงเพื่อน', panel:'panel-friends'});
  if(gifts > 0)       rows.push({ico:'🎁', txt:`ของขวัญรอเปิด ${gifts}`, sub:'ไปเปิดของขวัญ', panel:'panel-gifts'});
  if(invEntries.length > 0){
    const TINV_LBL = {adv:'ผจญภัย 🌍', sky:'Sky Playground ☁️', haunt:'ผีสิง 👻', heli:'เฮลิคอปเตอร์ 🚁', drone:'โดรน 🛸', drive:'ขับรถ 🚗'};
    const [, firstInv] = invEntries[0];
    const w = TINV_LBL[firstInv.map] || 'โลก 3D';
    rows.push({ico:'📨', txt:`คำเชิญเล่นด้วยกัน ${invEntries.length} รายการ`,
      sub:`${escapeHTML(firstInv.n)} ชวนไปเล่น${w} · แตะเพื่อไปเลย`, act:'tinv'});
  }
  return {rows, billTotal};
}

/* แตะ badge บนปุ่ม ⚙️ → เมนูสรุปว่าค้างอะไร กดแถวไหนพาไปหน้านั้นเลย */
function openAttentionSummary(){
  const {rows, billTotal} = attentionSummaryData();
  if(!rows.length) return;   // ไม่มีอะไรค้าง (ปกติ badge ซ่อนอยู่แล้ว)
  const overlay = document.createElement('div');
  overlay.className = 'levelup-overlay attn-overlay';
  overlay.innerHTML = `<div class="levelup-box attn-box">
    <h2 style="margin:0 0 8px">🔔 มีอะไรต้องจัดการ</h2>
    <div class="attn-list">${rows.map(r=>`
      <button class="attn-row" data-panel="${r.panel||''}" data-act="${r.act||''}">
        <span class="attn-ico">${r.ico}</span>
        <span class="attn-txt"><b>${r.txt}</b><br><small>${r.sub}</small></span>
        <span class="attn-go">›</span>
      </button>`).join('')}</div>
    ${billTotal > 0 ? `<div class="attn-total">💰 บิลที่ต้องจ่ายรวม <b>🪙${fmtNum(billTotal)}</b></div>` : ''}
    <div style="margin-top:14px"><button class="set-close">ปิด</button></div>
  </div>`;
  overlay.querySelectorAll('.attn-row').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      overlay.remove();
      if(btn.dataset.act === 'tinv'){                       // คำเชิญเล่นด้วยกัน → พาเข้าโลกที่ถูกชวนเลย (เช็คตั๋ว/บาดเจ็บ/รถให้ครบทาง railWorldClick)
        const entries = (typeof Online !== 'undefined' && Online.tinv)
          ? Object.entries(Online.tinv).filter(([fid])=>!(Online.tinvHidden && Online.tinvHidden[fid])) : [];
        const first = entries[0];
        const w = (first && typeof WORLD3D !== 'undefined') ? WORLD3D.find(x=>x.mode === first[1].map) : null;
        if(w) railWorldClick(w);
      }
      else openPanel(btn.dataset.panel);
    });
  });
  overlay.querySelector('.set-close').addEventListener('click', ()=>overlay.remove());
  overlay.addEventListener('click', e=>{ if(e.target === overlay) overlay.remove(); });
  document.body.appendChild(overlay);
  attentionAcknowledge();   // เห็นหน้าสรุปแล้ว = เลขแดงหายทันที แม้กดปิดโดยยังไม่จัดการรายการ
}
function updateFriendBadge(){
  const b = document.getElementById('friend-badge');
  if(!b) return;
  // รวมทั้งคำขอเป็นเพื่อน + เพื่อนที่ส่งข้อความใหม่มา (ข้อ 0.4) เป็นตัวเลขเดียวบนปุ่ม "เพื่อน"
  const reqs  = (typeof Online !== 'undefined' && Online.reqs) ? Online.reqs.length : 0;
  const chats = (typeof Online !== 'undefined' && Online.chatUnread) ? Object.keys(Online.chatUnread).length : 0;
  setBadge(b, reqs + chats);   // เด้งภาพเมื่อมีคำขอ/ข้อความใหม่ (สั่นให้ badge รวมจัดการ)
  updateSettingsBadge();
}

function renderFriendPanel(){
  const el = document.getElementById('friend-card');
  if(!el) return;
  updateFriendBadge();
  if(typeof Online === 'undefined' || !Online.ready){
    el.dataset.built = '';
    el.innerHTML = `<h3 class="shop-title">👥 เพื่อนของหนู</h3>
      <div class="lb-empty">📡 ต่ออินเทอร์เน็ตเพื่อเพิ่มเพื่อนและเล่นด้วยกันนะ!</div>`;
    return;
  }
  if(el.dataset.built !== '1'){
    el.innerHTML = `<h3 class="shop-title">👥 เพื่อนของหนู</h3>
      <div class="fr-code-box">
        <div class="fr-code-label">🎫 รหัสเพื่อนของหนู — บอกเพื่อนให้มาเพิ่มได้เลย</div>
        <div class="fr-code-row">
          <span class="fr-code" id="fr-my-code">${Online.myCode || '...'}</span>
          <button class="fr-copy-btn" id="fr-copy">📋 คัดลอก</button>
        </div>
      </div>
      <div class="fr-search-box">
        <div class="fr-code-label">🔍 ค้นหาเพื่อนจากรหัส 6 ตัว</div>
        <div class="fr-search-row">
          <input id="fr-search-input" maxlength="6" placeholder="เช่น ABC234" autocomplete="off">
          <button class="fr-search-btn" id="fr-search-go">ค้นหา</button>
        </div>
        <div id="fr-search-result"></div>
      </div>
      <div id="fr-reqs"></div>
      <div class="fr-list-title">👫 เพื่อนของฉัน (<span id="fr-count">0</span> คน)</div>
      <div id="fr-list"></div>`;
    el.dataset.built = '1';
    document.getElementById('fr-copy').addEventListener('click', ()=>{
      const code = Online.myCode || '';
      if(navigator.clipboard) navigator.clipboard.writeText(code).catch(()=>{});
      sfx.select(); toast('📋 คัดลอกรหัส ' + code + ' แล้ว!');
    });
    const input = document.getElementById('fr-search-input');
    input.addEventListener('input', ()=>{ input.value = input.value.toUpperCase().replace(/[^A-Z2-9]/g, ''); });
    document.getElementById('fr-search-go').addEventListener('click', friendDoSearch);
    input.addEventListener('keydown', e=>{ if(e.key === 'Enter') friendDoSearch(); });
  }else{
    const codeEl = document.getElementById('fr-my-code');
    if(codeEl) codeEl.textContent = Online.myCode || '...';
  }
  refreshFriendData();
}

/* ค้นหารหัสเพื่อน → โชว์ผล + ปุ่มส่งคำขอ (แยกจาก refresh เพื่อไม่โดนล้างตอน tick) */
function friendDoSearch(){
  const input = document.getElementById('fr-search-input');
  const out = document.getElementById('fr-search-result');
  if(!input || !out) return;
  const code = input.value.trim();
  if(code.length !== 6){ out.innerHTML = `<div class="fr-hint">พิมพ์รหัส 6 ตัวให้ครบนะ</div>`; return; }
  out.innerHTML = `<div class="fr-hint">🔎 กำลังค้นหา...</div>`;
  friendSearch(code).then(r=>{
    if(!r){ out.innerHTML = `<div class="fr-hint">😕 ไม่พบรหัสนี้ ลองเช็กอีกครั้งนะ</div>`; return; }
    if(r.self){ out.innerHTML = `<div class="fr-hint">😄 นี่คือรหัสของ${selfTag()}นะ!</div>`; return; }
    const nameHTML = `<span class="fr-row-name">${escapeHTML(r.n)}<small> ${idTag(r.uid)}${gradeMark(gradeOf(r.uid, r.g))}</small></span>`;
    if(r.already){ out.innerHTML = `<div class="fr-found">${nameHTML}<span class="fr-hint">✅ เป็นเพื่อนกันแล้ว</span></div>`; return; }
    out.innerHTML = `<div class="fr-found">${nameHTML}<button class="fr-add-btn" id="fr-send-req">➕ ส่งคำขอเป็นเพื่อน</button></div>`;
    document.getElementById('fr-send-req').addEventListener('click', ()=>{
      const btn = document.getElementById('fr-send-req');
      btn.disabled = true;
      friendRequest(r.uid)
        .then(()=>{ sfx.buy(); out.innerHTML = `<div class="fr-hint">📨 ส่งคำขอถึง ${escapeHTML(r.n)} แล้ว! รอเพื่อนกดรับนะ 😊</div>`; })
        .catch(()=>{ btn.disabled = false; toast('ส่งคำขอไม่สำเร็จ ลองใหม่นะ'); });
    });
  }).catch(err=>{ out.innerHTML = `<div class="fr-hint">${escapeHTML(String(err))}</div>`; });
}

/* อัปเดตเฉพาะส่วนที่ขยับบ่อย: คำขอ + รายชื่อเพื่อน + badge */
function refreshFriendData(){
  updateFriendBadge();
  const reqEl = document.getElementById('fr-reqs');
  if(reqEl){
    if(Online.reqs.length){
      reqEl.innerHTML = `<div class="fr-list-title">📨 คำขอเป็นเพื่อน (${Online.reqs.length})</div>` +
        Online.reqs.map(r=>`<div class="fr-row fr-req">
          <span class="fr-row-name">${escapeHTML(r.n)}<small> ${idTag(r.uid)}${gradeMark(gradeOf(r.uid, r.g))}</small></span>
          <span class="fr-req-btns">
            <button class="fr-accept" data-uid="${escapeHTML(r.uid)}">✅ รับ</button>
            <button class="fr-decline" data-uid="${escapeHTML(r.uid)}">✕</button>
          </span></div>`).join('');
      reqEl.querySelectorAll('.fr-accept').forEach(b=>b.addEventListener('click', ()=>{
        b.disabled = true;
        friendAccept(b.dataset.uid).then(()=>{ sfx.buy(); toast('🎉 เป็นเพื่อนกันแล้ว!'); })
          .catch(()=>{ b.disabled = false; toast('เพิ่มเพื่อนไม่สำเร็จ ลองใหม่นะ'); });
      }));
      reqEl.querySelectorAll('.fr-decline').forEach(b=>b.addEventListener('click', ()=>{
        friendDecline(b.dataset.uid).catch(()=>{});
      }));
    }else reqEl.innerHTML = '';
  }
  const cnt = document.getElementById('fr-count');
  if(cnt) cnt.textContent = Online.myFriends.length;
  const listEl = document.getElementById('fr-list');
  if(listEl){
    if(Online.myFriends.length){
      listEl.innerHTML = Online.myFriends.map((f,i)=>{
        const on = Online.presenceMap && Online.presenceMap[f.uid];
        const unread = Online.chatUnread && Online.chatUnread[f.uid];
        return `<div class="fr-row">
          <span class="online-dot${on ? '' : ' off'}"></span>
          <span class="fr-row-name">${escapeHTML(f.n)}<small> ${idTag(f.uid)}${gradeMark(gradeOf(f.uid, f.g))}</small></span>
          <span class="fr-row-status">${on ? '💚' : '⚪'}</span>
          <button class="fr-call-btn" data-ci="${i}" type="button" title="โทรหาเพื่อนด้วยเสียง">📞</button>
          <button class="fr-gift-btn" data-gi="${i}">🎁 ส่งของขวัญ</button>
          <button class="fr-chat-btn${unread ? ' has-unread' : ''}" data-i="${i}">💬 แชท${unread ? '<span class="fr-unread">ใหม่!</span>' : ''}</button></div>
          <div class="frw-slot" data-uid="${escapeHTML(f.uid)}" style="display:none"></div>`;   // 🌍 แถบ "อยู่โลกไหน" (รอบ 642) เติมทีหลังจาก frwPaint
      }).join('');
      listEl.querySelectorAll('.fr-chat-btn').forEach(b=>b.addEventListener('click', ()=>{
        openChat(Online.myFriends[+b.dataset.i]);
      }));
      /* 📞 รอบ 628: โทรตรงจากแถวรายชื่อเพื่อน (ไม่ต้องเปิดกล่องแชทก่อน) — เงื่อนไขทั้งหมดเช็กใน Call.start */
      listEl.querySelectorAll('.fr-call-btn').forEach(b=>b.addEventListener('click', ()=>{
        startCall(Online.myFriends[+b.dataset.ci]);
      }));
      listEl.querySelectorAll('.fr-gift-btn').forEach(b=>b.addEventListener('click', ()=>{
        openGiftPicker(Online.myFriends[+b.dataset.gi]);
      }));
    }else listEl.innerHTML = `<div class="lb-empty">ยังไม่มีเพื่อน — บอกรหัสของหนูให้เพื่อน หรือค้นหารหัสเพื่อนด้านบนเพื่อเพิ่มกันนะ! 🤝</div>`;
    frwPaint();      // 🌍 เติมแถบ "เพื่อนอยู่โลกไหน" จากข้อมูลที่สแกนไว้ (รอบ 642)
    frwScan();       // ข้อมูลเก่าเกิน TTL แล้ว → สแกนใหม่ (คุมความถี่ในตัว)
  }
}

/* ============================================================
   🌍 เพื่อนอยู่โลก 3D ไหน + ปุ่ม "ตามเข้าไป" (รอบ 642)
   ต่อยอดรอบ 640-641: `js/netroom.js` รู้จัก `/winfo/<map>/<room>/<uid>` อยู่แล้ว
   → ล็อบบี้แค่ขอสรุปผ่าน `NetRoom.whereFriends()` แล้ววาดใต้ชื่อเพื่อน
   กด "ตามเข้าไป" = `NetRoom.aimAt()` ตั้งเป้า แล้วเข้าโลกตามปุ่มรางเมนูปกติ
   (ตรวจตั๋ว/บาดเจ็บ/รถ ที่เดียวคือ railWorldClick) — ระบบนัดเจอของรอบ 641
   จะพาลงสนามเดียวกับเพื่อนให้เอง ไม่ต้องมีทางเข้าสนามเส้นใหม่
   💰 คุมทราฟฟิก: สแกนเฉพาะตอน "แผงเพื่อนเปิดอยู่จริง" + ห่างกันอย่างน้อย FRW_TTL_MS
   🔒 คุ้มครองเด็ก: โชว์แค่ชื่อเล่น/โลก/เลขสนาม ไม่มีชื่อจริง/ชั้นเรียน
   ============================================================ */
const FRW_TTL_MS  = 20000;   // ข้อมูลเก่ากว่านี้ = สแกนใหม่ได้ (เพื่อนย้ายสนามไม่บ่อย)
const FRW_MIN_GAP = 5000;    // เปิด-ปิดแผงรัว ๆ ก็ยิงถี่กว่านี้ไม่ได้
let frwFound = {};           // uid → {map, room, n}
let frwAt = 0, frwBusy = false, frwDenied = false, frwWasOpen = false;

function frwWorldOf(map){ return WORLD3D.find(w => w.mode === map) || null; }

/* แผงเพื่อนเปิดค้างอยู่จริงไหม (renderFriendPanel ถูกเรียกทุกครั้งที่ presence ขยับ แม้แผงปิดอยู่) */
function frwPanelOpen(){
  const el = document.getElementById('friend-card');
  return !!(el && el.offsetParent !== null);
}

function frwScan(){
  if(frwBusy || typeof NetRoom === 'undefined' || !NetRoom.whereFriends) return;
  if(typeof Online === 'undefined' || !Online.ready) return;
  if(!frwPanelOpen()){ frwWasOpen = false; return; }
  /* เพิ่งเปิดแผง = อยากเห็นข้อมูลสดทันที (แต่ยังห้ามถี่กว่า FRW_MIN_GAP)
     เปิดค้างไว้เฉย ๆ = รอครบ TTL ค่อยยิงใหม่ — ไม่งั้น presence ขยับทีไรก็สแกนใหม่ทุกที */
  const justOpened = !frwWasOpen;
  frwWasOpen = true;
  const now = Date.now();
  if(now - frwAt < (justOpened ? FRW_MIN_GAP : FRW_TTL_MS)) return;
  const ids = {};
  (Online.myFriends || []).forEach(f => { if(f.uid) ids[f.uid] = f.n || 'เพื่อน'; });
  if(!Object.keys(ids).length){ frwFound = {}; return; }
  frwBusy = true; frwAt = now;
  NetRoom.whereFriends(ids).then(r => {
    frwBusy = false;
    frwFound = (r && r.found) || {};
    frwDenied = !!(r && r.denied);
    frwPaint();
  }).catch(() => { frwBusy = false; });
}

function frwPaint(){
  const listEl = document.getElementById('fr-list');
  if(!listEl) return;
  listEl.querySelectorAll('.frw-slot').forEach(slot => {
    const uid = slot.dataset.uid, hit = frwFound[uid];
    const w = hit ? frwWorldOf(hit.map) : null;
    if(!hit || !w){ slot.innerHTML = ''; slot.style.cssText = 'display:none'; return; }
    slot.style.cssText = 'display:flex;align-items:center;gap:6px;flex-wrap:wrap;'
      + 'margin:-2px 0 6px 26px;font-size:.86em;line-height:1.35';
    slot.innerHTML = `<span style="color:#8fe3ff">${w.ico} อยู่โลก${escapeHTML(w.label)} · สนาม ${hit.room + 1}</span>`
      + `<button class="frw-go" data-uid="${escapeHTML(uid)}" type="button"
           style="padding:2px 9px;border-radius:9px;border:0;background:#3a86c8;color:#fff;
                  font-weight:800;font-size:.95em;cursor:pointer;white-space:nowrap">🏃 ตามเข้าไป</button>`;
  });
  listEl.querySelectorAll('.frw-go').forEach(b => {
    b.onclick = () => frwFollow(b.dataset.uid);
  });
  frwPaintHint();
}

/* ❗ กฎทอง #1: ห้ามเงียบ — อ่าน /winfo ไม่ได้ (rules ยังไม่ publish) ต้องบอกบนจอว่าทำไมไม่มีแถบนี้ */
function frwPaintHint(){
  const listEl = document.getElementById('fr-list');
  if(!listEl) return;
  let hint = document.getElementById('frw-hint');
  if(!frwDenied){ if(hint) hint.remove(); return; }
  if(!hint){
    hint = document.createElement('div');
    hint.id = 'frw-hint';
    hint.style.cssText = 'margin-top:6px;font-size:.85em;opacity:.75;line-height:1.4';
    listEl.appendChild(hint);
  }
  hint.innerHTML = '🔒 ยังบอกไม่ได้ว่าเพื่อนอยู่โลกไหน — ระบบหลายสนามยังไม่เปิดใช้ (รอ publish rules)';
}

function frwFollow(uid){
  const hit = frwFound[uid];
  if(!hit) return;
  const w = frwWorldOf(hit.map);
  if(!w) return;
  const fr = (Online.myFriends || []).find(f => f.uid === uid);
  const name = (fr && fr.n) || hit.n || 'เพื่อน';
  /* ยังไม่มีตั๋ว/บาดเจ็บ/ไม่มีรถ → ให้ railWorldClick อธิบาย+พาไปซื้อตามเดิม อย่าตั้งเป้าค้างไว้ */
  const hasAccess = w.owned ? w.owned() : !!state[w.ticketKey];
  if(!hasAccess || state.advHurt){ railWorldClick(w); return; }
  NetRoom.aimAt(hit.map, hit.room, uid, name);
  sfx.select();
  toast(`${w.ico} กำลังพาไปหา ${escapeHTML(name)} ในโลก${w.label} สนาม ${hit.room + 1} — เจอกันในนั้นเลย!`);
  railWorldClick(w);
}

/* ============================================================
   แชทกับเพื่อน (ข้อ 0.4) — กล่องแชทลอยกลางจอ + แผง emoji
   ============================================================ */
/* แผง emoji แบบจัดกลุ่มเป็นหมวด (professional) — ทุกตัวปลอดภัยสำหรับเด็ก
   แต่ละหมวด: icon = ไอคอนบนแถบหมวด · list = emoji ในหมวดนั้น */
const CHAT_EMOJI_CATS = [
  {id:'faces', icon:'😊', list:[
    '😀','😃','😄','😁','😆','😊','🙂','🙃','😉','😌','😍','🥰','😘','😋','😜','🤪',
    '🤗','🤩','🥳','😎','🤓','🥺','😢','😭','😴','😮','😯','🤔','😇','😐','😅','😬']},
  {id:'gestures', icon:'👍', list:[
    '👍','👎','👌','✌️','🤞','🤟','🤙','👋','🙌','👏','🙏','💪','🤝','👊','✊','🖐️','🤚','☝️']},
  {id:'hearts', icon:'❤️', list:[
    '❤️','🧡','💛','💚','💙','💜','🤍','🖤','💖','💗','💓','💞','💕','💝','💘','❣️','💔','💌']},
  {id:'animals', icon:'🐶', list:[
    '🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐷','🐸','🐵','🐔',
    '🐧','🐦','🐤','🦄','🐝','🐢','🐬','🐟','🦋','🐙','🐳']},
  {id:'food', icon:'🍰', list:[
    '🍎','🍓','🍌','🍉','🍇','🍑','🍒','🍰','🎂','🧁','🍩','🍪','🍫','🍬','🍭','🍦',
    '🍨','🍿','🍕','🍔','🍟','🥤','🧃','☕']},
  {id:'activities', icon:'⚽', list:[
    '⚽','🏀','🏈','⚾','🎾','🏐','🎮','🕹️','🎯','🎲','🎨','🎵','🎸','🎤','🏆','🥇',
    '🎳','🚗','✈️','🚀','🎡','🚲']},
  {id:'symbols', icon:'🎉', list:[
    '🎉','🎊','✨','⭐','🌟','💫','🔥','🌈','☀️','🌸','🌷','🌹','🎁','🎈','💯','✅',
    '❌','❓','❗','💤','👑','🔔']},
];
/* 🎨 รอบ 190: ธีมกล่องแชท — เน้นเพื่อน/แฟน/น่ารัก (พื้นหลังลายในไฟล์ css .chat-box.ct-<id>) */
const CHAT_THEMES = [
  {id:'sky',      emoji:'💙', name:'ฟ้าใส'},
  {id:'mint',     emoji:'🍃', name:'เพื่อนซี้'},
  {id:'love',     emoji:'💖', name:'คนพิเศษ'},
  {id:'peach',    emoji:'🍑', name:'พีชหวาน'},
  {id:'lavender', emoji:'💜', name:'ลาเวนเดอร์'},
  {id:'bubble',   emoji:'🫧', name:'ฟองสบู่'},
  {id:'night',    emoji:'🌙', name:'ราตรีดาว'},
];
const CHAT_SECRET_MS = 20000;   // อ่านแล้วข้อความหายใน 20 วินาที (แชทลับ)
let chatUnsub = null;   // ฟังก์ชันเลิกฟังแชทที่เปิดอยู่ (มีได้ทีละกล่อง)

/* ============================================================
   รอบ 179: หน้ารวมข้อความ (inbox แบบ Messenger — ธีมกระจกฟ้า sci-fi ของเกม)
   ปุ่ม 💬 บน header → ลิสต์เพื่อน (Online.myFriends) + ข้อความล่าสุด/เวลา +
   จุดฟ้า=ยังไม่อ่าน + จุดเขียว=ออนไลน์อยู่ · แตะแถว = เปิดกล่องแชทเดิม (openChat)
   ============================================================ */
function chatBadgeSync(){
  const b = document.getElementById('chat-badge');
  if(!b) return;
  const n = (typeof Online !== 'undefined' && Online.ready && typeof chatUnreadCount === 'function')
    ? chatUnreadCount() : 0;
  b.style.display = n ? '' : 'none';
  if(n) b.textContent = n;
}
function ibTimeStr(ts){
  const d = thDate(ts), now = Date.now();                      // 🇹🇭 รอบ 988: หน้าปัดไทย
  if(d.toDateString() === thDayKey(now))
    return String(d.getHours()).padStart(2,'0') + ':' + String(d.getMinutes()).padStart(2,'0');
  if(now - ts < 7*86400e3) return ['อา.','จ.','อ.','พ.','พฤ.','ศ.','ส.'][d.getDay()];
  return `${d.getDate()}/${d.getMonth()+1}`;
}
/* 📞 รอบ 628: ข้อความ "บันทึกผลสาย" ที่ Call.logChat (js/online.js) เขียนลงห้องแชท
   → แยกออกมาโชว์เป็นแท็บ "ประวัติการโทร" · เทียบข้อความเต็มรูปแบบ กันข้อความที่ผู้เล่นพิมพ์เองหลุดมาปน */
const IB_CALL_RE = /^(📞|📹) (คุยสายกัน .+|คุยกลุ่มกัน .+|สายที่ไม่ได้รับ|เพื่อนยังรับสายไม่ได้|เพื่อนติดสายอื่นอยู่|ยกเลิกสายไปแล้ว)$/;
function ibCallInfo(t){
  const m = (typeof t === 'string') ? t.match(IB_CALL_RE) : null;
  if(!m) return null;
  return {vid: m[1] === '📹', miss: m[2] === 'สายที่ไม่ได้รับ', txt: m[2]};
}
function openChatInbox(){
  sfx.select();
  if(typeof Online === 'undefined' || !Online.ready){ toast('ต้องต่ออินเทอร์เน็ตก่อนถึงจะดูข้อความได้นะ 📡'); return; }
  const friends = (Online.myFriends || []).slice();
  const onlineIds = new Set((Online.friends || []).map(f=>String(f.id||'')));
  const overlay = document.createElement('div');
  overlay.className = 'inbox-overlay';
  overlay.innerHTML = `<div class="ib-box">
    <div class="ib-head"><span class="ib-tabs">
        <button class="ib-tab on" data-t="chat" type="button">💬 แชท</button>
        <button class="ib-tab" data-t="call" type="button">📞 การโทร<span class="ib-tab-dot" id="ib-miss" style="display:none"></span></button>
      </span><button class="ib-close" type="button">✕</button></div>
    <div class="ib-story" id="ib-story"></div>
    <div class="ib-list" id="ib-list"><div class="ib-empty">กำลังโหลดข้อความ… 💬</div></div>
  </div>`;
  document.body.appendChild(overlay);
  const close = ()=>overlay.remove();
  overlay.addEventListener('click', e=>{ if(e.target === overlay) close(); });
  overlay.querySelector('.ib-close').addEventListener('click', ()=>{ sfx.select(); close(); });
  /* 📞 รอบ 628: สลับแท็บ แชท ↔ ประวัติการโทร (ใช้ข้อมูลชุดเดียวกัน ไม่ยิง DB ซ้ำ)
     — ผูกไว้ตั้งแต่ตอนนี้ ระหว่างที่ข้อมูลยังโหลด กดแท็บได้ แต่ยังไม่มีอะไรให้วาด (renderList ยังว่าง) */
  let ibMode = 'chat', renderList = null;
  overlay.querySelectorAll('.ib-tab').forEach(b=>b.addEventListener('click', ()=>{
    if(ibMode === b.dataset.t) return;
    ibMode = b.dataset.t; sfx.select();
    overlay.querySelectorAll('.ib-tab').forEach(x=>x.classList.toggle('on', x.dataset.t === ibMode));
    if(renderList) renderList();
  }));

  // รอบ 185 (idea 2): แถบ "กำลังออนไลน์" แนวนอนบนสุด — วงกลมเพื่อนที่ออนไลน์ เลื่อนข้างได้ แบบ story row
  // รอบ 187 (A1): เติม badge เลขข้อความใหม่บนวงกลม (เติมหลังโหลดนับ unread)
  const storyEl = overlay.querySelector('#ib-story');
  const onlineFriends = friends.map((f,i)=>({f,i})).filter(x=>onlineIds.has(String(x.f.uid)));
  if(onlineFriends.length){
    storyEl.innerHTML = onlineFriends.map(({f,i})=>{
      const ph = (typeof photoOf === 'function') ? photoOf(f.uid) : '';
      const face = ph ? `<img src="${ph}" alt="">` : escapeHTML((f.n||'?').trim().charAt(0).toUpperCase());
      return `<button class="ib-story-item" data-i="${i}" type="button" title="แตะ = แชท · กดค้าง = ดูโปรไฟล์">
        <span class="ib-story-ava${ph ? ' ib-ava-photo' : ''}">${face}<i class="ib-story-on"></i><span class="ib-story-badge" data-uid="${escapeHTML(f.uid)}" style="display:none"></span></span>
        <small>${escapeHTML((f.n||'').trim().split(' ')[0])}</small>
      </button>`;
    }).join('');
    /* รอบ 277: แตะ = แชท (เดิม) · กดค้าง ≥550ms = เปิดโปรไฟล์เพื่อนคนนั้น */
    storyEl.querySelectorAll('.ib-story-item').forEach(b=>{
      let lpTimer = null, lpFired = false;
      const cancel = ()=>{ if(lpTimer){ clearTimeout(lpTimer); lpTimer = null; } };
      b.addEventListener('pointerdown', ()=>{
        lpFired = false;
        lpTimer = setTimeout(()=>{
          lpTimer = null; lpFired = true;
          const f = friends[+b.dataset.i];
          if(f){ sfx.select(); close(); showPlayerCard(f.uid, f.n, f.g || ''); }
        }, 550);
      });
      ['pointerup','pointerleave','pointercancel'].forEach(ev=>b.addEventListener(ev, cancel));
      b.addEventListener('contextmenu', e=>e.preventDefault());   // มือถือกดค้างชอบเด้งเมนู — กันไว้
      b.addEventListener('click', ()=>{
        if(lpFired){ lpFired = false; return; }                   // เพิ่งกดค้างไป — ไม่เปิดแชทซ้ำ
        const f = friends[+b.dataset.i];
        if(f){ sfx.select(); close(); openChat(f); }
      });
    });
  } else storyEl.style.display = 'none';

  const listEl = overlay.querySelector('#ib-list');
  if(!friends.length){
    listEl.innerHTML = `<div class="ib-empty">ยังไม่มีเพื่อนเลย 🤝<br>ไปกด ➕ เป็นเพื่อนจากรายชื่อคนออนไลน์ก่อน<br>เป็นเพื่อนกันแล้วส่งข้อความหากันได้เลย!</div>`;
    return;
  }
  const meKey = onlineKey();
  const badgeTxt = n => n > 20 ? '20+' : String(n);
  // รอบ 185 (idea 1) + 187 (A1): ดึงข้อความล่าสุด (limitToLast 20) → เรียงคนเพิ่งคุยขึ้นบน + นับข้อความใหม่ต่อคน
  Promise.all(friends.map(f=>
    // รอบ 628: ดึง 40 ข้อความ (เดิม 20) — เผื่อให้แท็บ "ประวัติการโทร" ย้อนได้ลึกขึ้น (CHAT_KEEP=100)
    Online.db.ref('chats/' + chatPairId(f.uid)).orderByKey().limitToLast(40).once('value')
      .then(snap=>{
        let last = null, unread = 0; const msgs = [];
        const seen = (typeof chatSeenTs === 'function') ? chatSeenTs(f.uid) : 0;
        snap.forEach(ch=>{ const m = ch.val(); last = m; if(m) msgs.push(m);
          if(m && m.f === f.uid && typeof m.ts === 'number' && m.ts > seen) unread++; });
        return {f, last, unread, msgs, seen};
      })
      .catch(()=>({f, last:null, unread:0, msgs:[], seen:0}))
  )).then(items=>{
    if(!document.body.contains(overlay)) return;       // ผู้ใช้ปิดกล่องไปแล้ว
    // เรียง ts มากสุดบน · ไม่เคยคุย (ts 0) ตกลงล่างตามลำดับเพื่อนเดิม (sort เสถียร)
    items.sort((a,b)=>((b.last&&b.last.ts)||0)-((a.last&&a.last.ts)||0));
    const sorted = items.map(x=>x.f);
    // เติม badge เลขบนวงกลม story
    const unreadByUid = {}; items.forEach(({f,unread})=>{ unreadByUid[f.uid] = unread; });
    storyEl.querySelectorAll('.ib-story-badge').forEach(b=>{
      const n = unreadByUid[b.dataset.uid] || 0;
      if(n > 0){ b.textContent = badgeTxt(n); b.style.display = ''; }
    });

    /* 📞 รอบ 628: รวมบันทึกผลสายจากทุกห้องแชท → เรียงใหม่สุดขึ้นบน (เก็บ 40 รายการล่าสุดพอ)
       ทิศทาง: ข้อความที่ "เรา" เป็นคนส่ง = โทรออก (Call.logChat ให้ฝ่ายโทรออกเป็นคนบันทึก) */
    const calls = [];
    items.forEach(({f, msgs, seen})=>{
      msgs.forEach(m=>{
        const info = m && ibCallInfo(m.t);
        if(!info || typeof m.ts !== 'number') return;
        calls.push({f, ts:m.ts, out:(m.f === meKey), info, unseen:(m.f === f.uid && m.ts > seen)});
      });
    });
    calls.sort((a,b)=>b.ts - a.ts);
    const callList = calls.slice(0, 40);
    const missN = callList.filter(c=>c.info.miss && !c.out && c.unseen).length;
    const missEl = overlay.querySelector('#ib-miss');
    if(missEl && missN){ missEl.textContent = badgeTxt(missN); missEl.style.display = ''; }

    function paintChat(){
      listEl.innerHTML = items.map(({f,last,unread},i)=>{
        let lastTxt, timeTxt = '';
        if(last && typeof last.t === 'string'){
          lastTxt = (last.f === meKey ? selfPronoun() + ': ' : '') + last.t;
          if(last.ts) timeTxt = ibTimeStr(last.ts);
        }else lastTxt = 'ยังไม่เคยคุยกัน — ทักเลย! 👋';
        const ph = (typeof photoOf === 'function') ? photoOf(f.uid) : '';
        const face = ph ? `<img src="${ph}" alt="">` : escapeHTML((f.n||'?').trim().charAt(0).toUpperCase());
        return `<div class="ib-row${unread ? ' unread' : ''}" data-i="${i}">
          <span class="ib-ava${ph ? ' ib-ava-photo' : ''}">${face}${onlineIds.has(String(f.uid)) ? '<i class="ib-on"></i>' : ''}</span>
          <span class="ib-mid"><b class="ib-name">${escapeHTML(f.n)}</b><small class="ib-last">${escapeHTML(lastTxt)}</small></span>
          <span class="ib-meta"><small class="ib-time">${timeTxt}</small>${unread ? `<span class="ib-dot">${badgeTxt(unread)}</span>` : ''}</span>
          ${onlineIds.has(String(f.uid)) ? `<button class="ib-world" data-i="${i}" data-tinv-online-uid="${escapeHTML(f.uid)}" title="ชวนเล่นโลก 3D" type="button">🌍</button>` : ''}
        </div>`;
      }).join('');
      listEl.querySelectorAll('.ib-row').forEach(r=>r.addEventListener('click', ()=>{
        sfx.select(); close(); openChat(sorted[+r.dataset.i]);
      }));
      // รอบ 185 (idea 3): ปุ่ม 🌍 ท้ายแถว → เมนูชวนเล่นโลก 3D (tinv) — กันไม่ให้เด้ง openChat
      listEl.querySelectorAll('.ib-world').forEach(b=>b.addEventListener('click', e=>{
        e.stopPropagation();
        const f = sorted[+b.dataset.i];
        if(f) openFriendQuickMenu(f.uid, f.n, f.g);
      }));
    }

    /* 📞 รอบ 628: แท็บประวัติการโทร — แตะแถว = เปิดแชท · ปุ่มท้ายแถว = โทรกลับแบบเดิม (เสียง/วิดีโอ) */
    function paintCalls(){
      if(!callList.length){
        listEl.innerHTML = `<div class="ib-empty">ยังไม่มีประวัติการโทร 📞<br>
          กดปุ่ม 📞 ที่แถวรายชื่อเพื่อน (หรือในกล่องแชท) เพื่อโทรหากันได้เลย!</div>`;
        return;
      }
      listEl.innerHTML = callList.map((c,i)=>
        `<div class="ib-row ib-call-row${(c.info.miss && !c.out) ? ' missed' : ''}" data-ci="${i}">
          <span class="ib-ava ib-call-ava">${c.info.vid ? '📹' : '📞'}</span>
          <span class="ib-mid"><b class="ib-name">${escapeHTML(c.f.n)}</b><small class="ib-last">${c.out ? '↗️ โทรออก' : '↙️ สายเข้า'} · ${escapeHTML(c.info.txt)}</small></span>
          <span class="ib-meta"><small class="ib-time">${ibTimeStr(c.ts)}</small></span>
          <button class="ib-world ib-cb" data-ci="${i}" title="โทรกลับ" type="button">📞</button>
        </div>`).join('');
      listEl.querySelectorAll('.ib-call-row').forEach(r=>r.addEventListener('click', ()=>{
        const c = callList[+r.dataset.ci];
        if(c){ sfx.select(); close(); openChat(c.f); }
      }));
      listEl.querySelectorAll('.ib-cb').forEach(b=>b.addEventListener('click', e=>{
        e.stopPropagation();
        const c = callList[+b.dataset.ci];
        if(c){ close(); startCall(c.f); }
      }));
    }

    renderList = ()=>{ (ibMode === 'call') ? paintCalls() : paintChat(); };
    renderList();
  });
}

/* 📱 กันแป้นพิมพ์มือถือดันกล่องแชทลอย — ใช้ visualViewport ล็อกกรอบ overlay ให้ตรงพื้นที่จอที่เห็นจริงเสมอ
   (คีย์บอร์ดเด้งแล้วไม่ลด window.innerHeight บนมือถือหลายรุ่น ทำให้ overlay ที่จัดกลางด้วย vh ลอยเหนือคีย์บอร์ดไปเลย) */
function chatFitKeyboard(overlay, box){
  const vv = window.visualViewport;
  if(!vv) return ()=>{};
  const apply = ()=>{
    overlay.style.height = vv.height + 'px';
    overlay.style.top = vv.offsetTop + 'px';
    const kbOpen = (window.innerHeight - vv.height) > 120;   // เผื่อแถบ address bar โผล่/หุบเล็กน้อย ไม่นับเป็นคีย์บอร์ด
    overlay.classList.toggle('kb-open', kbOpen);
    box.style.maxHeight = kbOpen ? (vv.height - 12) + 'px' : '';
  };
  apply();
  vv.addEventListener('resize', apply);
  vv.addEventListener('scroll', apply);
  return ()=>{ vv.removeEventListener('resize', apply); vv.removeEventListener('scroll', apply); };
}

function openChat(friend){
  if(!friend) return;
  if(typeof Online === 'undefined' || !Online.ready){ toast('ต้องต่ออินเทอร์เน็ตก่อนถึงจะแชทได้นะ 📡'); return; }
  const me = onlineKey();
  const pid = chatPairId(friend.uid);
  // จำค่าธีม + สถานะแชทลับ แยกตามคู่สนทนา (เพื่อน/แฟนคนละธีมได้)
  if(!state.chatTheme  || typeof state.chatTheme  !== 'object') state.chatTheme  = {};
  if(!state.secretChat || typeof state.secretChat !== 'object') state.secretChat = {};
  let theme = state.chatTheme[pid];
  if(!CHAT_THEMES.some(t=>t.id === theme)) theme = 'sky';
  let secretOn = !!state.secretChat[pid];

  const overlay = document.createElement('div');
  overlay.className = 'chat-overlay';
  overlay.innerHTML = `<div class="chat-box ct-${theme}" id="chat-box">
    <div class="chat-head">
      <span class="chat-head-name">${((typeof photoMiniHTML === 'function') && photoMiniHTML(friend.uid, 'chat-head-ava')) || '💬'} ${escapeHTML(friend.n)}<small> ${idTag(friend.uid)}</small></span>
      <button class="chat-call-btn" id="chat-call-voice" type="button" title="โทรด้วยเสียง">📞</button>
      <button class="chat-theme-btn" id="chat-theme-btn" type="button" title="เลือกธีม">🎨</button>
      <label class="chat-secret-tg" title="แชทลับ: อ่านแล้วข้อความหายใน 20 วินาที">
        <span class="cs-ic">🕵️</span>
        <span class="cs-switch"><input type="checkbox" id="chat-secret"${secretOn ? ' checked' : ''}><span class="cs-slider"></span></span>
      </label>
      <button class="chat-close" id="chat-close" type="button">✕</button>
    </div>
    <div class="chat-secret-note" id="chat-secret-note"${secretOn ? '' : ' style="display:none"'}>🕵️ แชทลับเปิดอยู่ — อ่านแล้วข้อความจะหายไปใน 20 วินาที</div>
    <div class="chat-theme-strip" id="chat-theme-strip" style="display:none">
      ${CHAT_THEMES.map(t=>`<button class="chat-theme-sw ct-${t.id}${t.id === theme ? ' on' : ''}" data-th="${t.id}" type="button" title="${t.name}"><span>${t.emoji}</span><small>${t.name}</small></button>`).join('')}
    </div>
    <div class="chat-msgs" id="chat-msgs"><div class="chat-empty">กำลังโหลดข้อความ... 💬</div></div>
    <div class="chat-typing" id="chat-typing" style="display:none"><span class="ct-dots"><i></i><i></i><i></i></span> ${escapeHTML(friend.n)} กำลังพิมพ์…</div>
    <div class="chat-emoji-wrap" id="chat-emoji" style="display:none">
      <div class="chat-emoji-cats" id="chat-emoji-cats">
        ${CHAT_EMOJI_CATS.map((c,i)=>`<button class="chat-emoji-cat${i === 0 ? ' on' : ''}" data-ci="${i}" type="button">${c.icon}</button>`).join('')}
      </div>
      <div class="chat-emoji" id="chat-emoji-grid"></div>
    </div>
    <div class="chat-input-row">
      <button class="chat-emoji-btn" id="chat-emoji-btn" type="button">😊</button>
      <input id="chat-input" maxlength="200" placeholder="พิมพ์ข้อความ..." autocomplete="off">
      <button class="chat-send" id="chat-send" type="button">ส่ง</button>
    </div>
  </div>`;
  document.body.appendChild(overlay);

  const msgsEl = overlay.querySelector('#chat-msgs');
  const input  = overlay.querySelector('#chat-input');
  const emojiPanel = overlay.querySelector('#chat-emoji');
  const box    = overlay.querySelector('#chat-box');
  const stopFitKeyboard = chatFitKeyboard(overlay, box);

  // 🎨 เลือกธีม (แถบ swatch เปิด/ปิด) — รอบ 241: ธีม "ร่วมกันทั้งคู่" เปลี่ยนแล้วอีกฝ่ายเห็นตามผ่าน DB
  const themeStrip = overlay.querySelector('#chat-theme-strip');
  const applyTheme = (th, fromRemote)=>{
    if(!CHAT_THEMES.some(t=>t.id === th) || th === theme) return;
    theme = th;
    box.className = 'chat-box ct-' + theme;
    overlay.querySelectorAll('.chat-theme-sw').forEach(t=>t.classList.toggle('on', t.dataset.th === theme));
    state.chatTheme[pid] = theme; saveState();                                     // จำในเครื่อง (fallback ตอนออฟไลน์/rules ยังไม่เปิด)
    if(!fromRemote && typeof chatSetTheme === 'function') chatSetTheme(friend.uid, theme);   // เผยแพร่ให้อีกฝ่ายเห็น
  };
  overlay.querySelector('#chat-theme-btn').addEventListener('click', ()=>{
    themeStrip.style.display = themeStrip.style.display === 'none' ? '' : 'none';
  });
  // 📞 รอบ 625: ปุ่มโทรบนหัวกล่องแชท (รอบ 631: สายเสียงอย่างเดียว)
  overlay.querySelector('#chat-call-voice').addEventListener('click', ()=>startCall(friend));
  overlay.querySelectorAll('.chat-theme-sw').forEach(b=>b.addEventListener('click', ()=>{
    applyTheme(b.dataset.th, false);
    themeStrip.style.display = 'none';
    if(typeof sfx !== 'undefined' && sfx.select) sfx.select();
  }));
  // เฝ้าธีมจาก DB: อีกฝ่ายเปลี่ยน → เห็นเปลี่ยนตามทันที (ยิงค่าเริ่มต้นตอนเปิดด้วย)
  const stopTheme = (typeof chatWatchTheme === 'function')
    ? chatWatchTheme(friend.uid, th=>{ if(document.body.contains(overlay)) applyTheme(th, true); })
    : ()=>{};

  // 🕵️ แชทลับ: อ่านแล้วลบข้อความใน 20 วิ (ฝั่งผู้อ่านลบ = อีกฝ่ายก็เห็นหายด้วย)
  const secretNote = overlay.querySelector('#chat-secret-note');
  const vanishTimers = new Map();   // msgKey → timeout id
  const scheduleVanish = (key)=>{
    if(!secretOn || vanishTimers.has(key)) return;
    vanishTimers.set(key, setTimeout(()=>{
      vanishTimers.delete(key);
      if(typeof chatDeleteMsg === 'function') chatDeleteMsg(friend.uid, key);
    }, CHAT_SECRET_MS));
  };
  const clearVanishTimers = ()=>{ vanishTimers.forEach(id=>clearTimeout(id)); vanishTimers.clear(); };
  let lastMsgs = [];
  overlay.querySelector('#chat-secret').addEventListener('change', e=>{
    secretOn = e.target.checked;
    state.secretChat[pid] = secretOn; saveState();
    secretNote.style.display = secretOn ? '' : 'none';
    if(!secretOn) clearVanishTimers();                       // ปิด = ยกเลิกนับถอยหลังที่ค้าง
    renderMsgs(lastMsgs);                                    // อัปเดตแอนิเมชันจางบนบับเบิล
    if(typeof sfx !== 'undefined' && sfx.select) sfx.select();
  });

  // วาดข้อความ (แยกฟังก์ชันเพื่อ re-render ตอนสลับแชทลับ)
  function renderMsgs(msgs){
    lastMsgs = msgs;
    if(!msgs.length){
      msgsEl.innerHTML = `<div class="chat-empty">ยังไม่มีข้อความ — ทักทายเพื่อนก่อนเลย! 👋</div>`;
      return;
    }
    msgsEl.innerHTML = msgs.map(m=>{
      const mine = m.f === me;
      // บับเบิลของอีกฝ่าย + แชทลับเปิด = ค่อยๆ จางบอกว่ากำลังจะหาย
      const vanish = (secretOn && !mine) ? ' vanish' : '';
      return `<div class="chat-bubble${mine ? ' mine' : ''}${vanish}">${escapeHTML(m.t)}</div>`;
    }).join('');
    msgsEl.scrollTop = msgsEl.scrollHeight;
  }

  overlay.querySelector('#chat-emoji-btn').addEventListener('click', ()=>{
    emojiPanel.style.display = emojiPanel.style.display === 'none' ? '' : 'none';
  });
  // แผง emoji แบบหมวด: คลิกหมวด → เปลี่ยนกริด · คลิก emoji → แทรกลงข้อความ
  const emojiGrid = overlay.querySelector('#chat-emoji-grid');
  const renderEmojiGrid = (ci)=>{
    emojiGrid.innerHTML = CHAT_EMOJI_CATS[ci].list
      .map(e=>`<button class="chat-emo" type="button">${e}</button>`).join('');
    emojiGrid.querySelectorAll('.chat-emo').forEach(b=>b.addEventListener('click', ()=>{
      if(input.value.length < 200) input.value += b.textContent;
      input.focus();
    }));
  };
  overlay.querySelectorAll('.chat-emoji-cat').forEach(b=>b.addEventListener('click', ()=>{
    overlay.querySelectorAll('.chat-emoji-cat').forEach(t=>t.classList.toggle('on', t === b));
    renderEmojiGrid(+b.dataset.ci);
  }));
  renderEmojiGrid(0);

  // 💬 รอบ 187 (A2): แจ้ง "กำลังพิมพ์" ให้อีกฝ่าย + โชว์แถวเมื่ออีกฝ่ายพิมพ์ (ต้อง publish rules /typing)
  input.addEventListener('input', ()=>{ if(typeof chatSetTyping === 'function') chatSetTyping(friend.uid); });
  const typingEl = overlay.querySelector('#chat-typing');
  const stopTyping = (typeof chatWatchTyping === 'function')
    ? chatWatchTyping(friend.uid, active=>{
        if(!document.body.contains(overlay)) return;
        typingEl.style.display = active ? '' : 'none';
        if(active) msgsEl.scrollTop = msgsEl.scrollHeight;   // เห็นแถวพิมพ์
      })
    : ()=>{};

  const send = ()=>{
    if(!input.value.trim()) return;
    const btn = overlay.querySelector('#chat-send');
    btn.disabled = true;
    if(typeof chatClearTyping === 'function') chatClearTyping(friend.uid);   // ส่งแล้ว = เลิกพิมพ์
    chatSend(friend.uid, input.value)
      .then(()=>{ input.value = ''; sfx.select(); })
      .catch(msg=>{ sfx.wrong(); toast(typeof msg === 'string' ? msg : 'ส่งไม่สำเร็จ ลองใหม่นะ'); })
      .then(()=>{ btn.disabled = false; input.focus(); });
  };
  overlay.querySelector('#chat-send').addEventListener('click', send);
  input.addEventListener('keydown', e=>{ if(e.key === 'Enter') send(); });

  const close = ()=>{
    if(chatUnsub){ chatUnsub(); chatUnsub = null; }
    stopTyping();
    stopTheme();
    stopFitKeyboard();
    clearVanishTimers();
    if(typeof chatClearTyping === 'function') chatClearTyping(friend.uid);
    overlay.remove();
  };
  overlay.querySelector('#chat-close').addEventListener('click', close);
  overlay.addEventListener('click', e=>{ if(e.target === overlay) close(); });

  if(chatUnsub) chatUnsub();          // ปิดกล่องเก่าถ้ามีค้าง
  chatUnsub = chatListen(friend.uid, (msgs)=>{
    if(!document.body.contains(overlay)){ if(chatUnsub){ chatUnsub(); chatUnsub = null; } return; }
    renderMsgs(msgs);
    if(!msgs.length){
      if(typeof chatMarkSeen === 'function') chatMarkSeen(friend.uid);
      return;
    }
    // 🕵️ แชทลับ: ข้อความของอีกฝ่ายที่กำลังอ่านอยู่ → ตั้งเวลาลบ 20 วิ · ยกเลิกตัวที่หายไปแล้ว
    if(secretOn){
      const alive = new Set(msgs.map(m=>m.key));
      msgs.forEach(m=>{ if(m.f !== me) scheduleVanish(m.key); });
      vanishTimers.forEach((id,k)=>{ if(!alive.has(k)){ clearTimeout(id); vanishTimers.delete(k); } });
    }
    // เปิดกล่องอยู่ = อ่านแล้ว: จำ ts ล่าสุด กันเด้งแจ้งเตือนซ้ำ (ข้อ 0.4)
    if(typeof chatMarkSeen === 'function') chatMarkSeen(friend.uid, msgs[msgs.length - 1].ts || Date.now());
  });
  sfx.select();
}

/* ============================================================
   ระบบส่งของขวัญ (ข้อ 0.5) — ห้องของขวัญ + กล่องเลือกส่ง + ฉากเปิด
   ============================================================ */
function versionedAssetPath(path, version){
  if(!path) return null;
  return path + (version ? `${path.includes('?') ? '&' : '?'}v=${version}` : '');
}
function giftImg(id, display=false){
  const gift = giftInfo(id);
  return display && gift && gift.displayImage
    ? versionedAssetPath(gift.displayImage, GIFTS_IMG_V)
    : (IMG_FILES[`gift_${id}`] || null);
}

/* Gift Asset Performance Rule: src จริงถูกใส่เมื่อภาพอยู่ใน/ใกล้ viewport เท่านั้น
   width/height ล็อกพื้นที่ 1:1 กันการ์ดกระโดด และ loading=lazy เป็นด่านสำรองของ browser */
const LAZY_ASSET_PIXEL = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
function lazyAssetHTML(src, alt=''){
  return `<img src="${LAZY_ASSET_PIXEL}" data-lazy-src="${src}" loading="lazy" decoding="async" width="256" height="256" alt="${escapeHTML(alt)}">`;
}
function bindLazyAssets(root){
  if(!root) return;
  const images = [...root.querySelectorAll('img[data-lazy-src]')];
  if(!images.length) return;
  const load = img=>{
    const src = img.dataset.lazySrc;
    if(src){ img.src = src; delete img.dataset.lazySrc; }
  };
  if(typeof IntersectionObserver !== 'function'){
    images.forEach(load);
    return;
  }
  const observer = new IntersectionObserver(entries=>{
    for(const entry of entries){
      if(!entry.isIntersecting) continue;
      load(entry.target);
      observer.unobserve(entry.target);
    }
  }, {root:null, rootMargin:'240px 320px', threshold:0.01});
  images.forEach(img=>observer.observe(img));
}

function giftDateStr(ts){
  if(!ts) return '';
  try{ return new Date(ts).toLocaleDateString('th-TH', thLocaleOpt({day:'numeric', month:'short', year:'2-digit'})); }   // 🇹🇭 รอบ 988
  catch(e){ return ''; }
}

/* 🐾 รอบ 325: คำทักทายน้องของเพื่อน (ส่งฟรี ไม่เสียของ) — ผู้รับกดรับแล้วน้องได้ EXP
   เป็นข้อความสำเร็จรูปล้วน = ไม่ต้องกรองคำหยาบ (แนวเดียวกับแชทสำเร็จรูปในโลกมอไซค์) */
const GREETS = [
  {id:'hi',    e:'👋', t:'สวัสดีน้อง!',        msg:'ส่งมาทักทายน้องของหนู'},
  {id:'hug',   e:'🤗', t:'กอดน้องหน่อย',       msg:'ส่งกอดอุ่นๆ มาให้น้อง'},
  {id:'treat', e:'🍪', t:'ฝากขนมให้น้อง',      msg:'ฝากขนมมาให้น้องหนึ่งชิ้น'},
  {id:'play',  e:'🎾', t:'ชวนน้องเล่น',        msg:'ชวนน้องออกไปวิ่งเล่นด้วยกัน'},
  {id:'cute',  e:'😍', t:'น้องน่ารักมาก!',     msg:'บอกว่าน้องของหนูน่ารักมาก'},
  {id:'proud', e:'🏆', t:'เก่งมากเลย',         msg:'ชมว่าหนูเลี้ยงน้องได้เก่งมาก'},
];
const GREET_EXP = 8;                    // EXP ที่น้องได้เมื่อเจ้าของกดรับคำทัก
function greetInfo(id){ return GREETS.find(g=>g.id === id) || null; }

/* แผงเลือกคำทัก (เปิดจากปุ่ม 🐾 ในการ์ดโปรไฟล์เพื่อน)
   จำกัด "คนละ 1 ครั้ง/วัน" (state.greetSent) — กันเด็กสแปมกล่องของขวัญเพื่อนรัวๆ */
function openGreetPicker(uid, name){
  if(!state.greetSent || typeof state.greetSent !== 'object') state.greetSent = {};
  const today = todayStr();
  if(state.greetSent[uid] === today){
    toast(`วันนี้ทักทายน้องของ ${name} ไปแล้วนะ พรุ่งนี้มาทักใหม่ได้ 🐾`);
    return;
  }
  const ov = document.createElement('div');
  ov.className = 'pl-overlay';
  ov.innerHTML = `<div class="pl-card greet-card">
      <button class="pl-close">✕</button>
      <div class="pl-head">🐾 <span>ทักทายน้องของ ${escapeHTML(name)}</span></div>
      <div class="greet-sub">เลือกคำทัก 1 อย่าง — เพื่อนจะเห็นในกล่องของขวัญ 🎁 กดรับแล้วน้องได้ EXP +${GREET_EXP}</div>
      <div class="greet-grid">
        ${GREETS.map(g=>`<button class="greet-opt" data-g="${g.id}"><span class="greet-e">${g.e}</span>${g.t}</button>`).join('')}
      </div>
    </div>`;
  document.body.appendChild(ov);
  const close = ()=>ov.remove();
  ov.addEventListener('click', (e)=>{ if(e.target === ov) close(); });
  ov.querySelector('.pl-close').addEventListener('click', close);
  ov.querySelectorAll('.greet-opt').forEach(b=>b.addEventListener('click', ()=>{
    const gr = greetInfo(b.dataset.g);
    if(!gr) return;
    /* 🚫 รอบ 952: 🍪 "ฝากขนมให้น้อง" เป็นของกิน — ป่วยเพราะหิวอยู่ส่งไม่ได้ (คำทักอื่นส่งได้ปกติ) */
    if(foodGiftBlocked('greet', gr.id)){ sfx.wrong(); toast(hungerSickMsg('ขนมฝากให้น้องเพื่อน')); return; }
    b.disabled = true;
    greetSend(uid, gr.id)
      .then(()=>{
        state.greetSent[uid] = today; saveState();
        sfx.buy(); close();
        toast(`${gr.e} ส่งคำทัก "${gr.t}" ถึงน้องของ ${name} แล้ว!`);
      })
      .catch(msg=>{
        b.disabled = false;
        sfx.wrong();
        // ส่งไม่ผ่านเพราะ rules ยังไม่รับ k='greet' → บอกให้ชัด จะได้รู้ว่าต้อง publish rules
        toast(typeof msg === 'string' ? msg
          : 'ส่งคำทักไม่สำเร็จ — ผู้ปกครอง/ครูอาจยังไม่ได้อัปเดตกติกาฐานข้อมูล (rules) ให้รองรับคำทักทาย');
      });
  }));
}

/* ภาพ/ชื่อของขวัญ 1 ชิ้น (k='shop' → gifts.js · k='collect' → collectibles.js · k='greet' → คำทัก) */
function giftItemPic(k, id){
  if(k === 'greet'){ const gr = greetInfo(id);
    return `<span class="hq-emoji">${gr ? gr.e : '🐾'}</span>`; }
  if(k === 'shop'){ const g = giftInfo(id), img = giftImg(id);
    return img ? lazyAssetHTML(img, g ? g.name : '') : `<span class="hq-emoji">${g ? g.emoji : '🎁'}</span>`; }
  const c = collectInfo(id), img = collectImg(id);
  return img ? lazyAssetHTML(img, c ? c.name : '') : `<span class="hq-emoji">${c ? c.emoji : '📦'}</span>`;
}
/* 🚫🍰 รอบ 952 (ผู้ใช้สั่ง): ของขวัญชิ้นนี้เป็น "ของกิน" และตอนนี้ป่วยเพราะหิวอยู่ไหม (true = ห้ามส่ง)
   ครอบทั้ง 🍪 คำทัก "ฝากขนมให้น้อง" · 🎂 เค้กจากร้านของขวัญ · ของสะสมหมวดอาหาร */
function foodGiftBlocked(k, id){
  if(typeof hungerSickLock !== 'function' || !hungerSickLock()) return false;
  if(k === 'greet') return id === 'treat';
  if(k === 'shop')  return ((giftInfo(id) || {}).cat === 'cake');
  return ((collectInfo(id) || {}).cat === 'food');
}
function giftItemName(k, id){
  if(k === 'greet'){ const gr = greetInfo(id); return gr ? gr.t : 'คำทักทายน้อง'; }
  if(k === 'shop'){ const g = giftInfo(id); return g ? g.name : 'ของขวัญ'; }
  const c = collectInfo(id); return c ? c.name : 'สินค้า';
}

function updateGiftBadge(){
  const b = document.getElementById('gift-badge');
  if(!b) return;
  const n = (typeof Online !== 'undefined' && Online.giftIn) ? Online.giftIn.length : 0;
  setBadge(b, n);   // เด้งภาพเมื่อมีของขวัญใหม่ (สั่นให้ badge รวมจัดการ)
  updateSettingsBadge();
}

/* แผงห้องของขวัญ: (1) ของที่รับมารอกดรับ/ไม่รับ (2) ของขวัญของฉัน (3) ที่ส่งไปยังรอผู้รับ */
function renderGiftPanel(){
  const el = document.getElementById('gift-card');
  if(!el) return;
  updateGiftBadge();
  if(typeof Online === 'undefined' || !Online.ready){
    el.innerHTML = `<h3 class="shop-title">🎁 ห้องของขวัญ</h3>
      <div class="lb-empty">📡 ต่ออินเทอร์เน็ตเพื่อส่ง–รับของขวัญกับเพื่อนนะ!<br>
      ส่งของขวัญให้เพื่อนได้ที่เมนู 👥 เพื่อน (ปุ่ม 🎁 ส่งของขวัญ)</div>`;
    return;
  }
  let html = `<h3 class="shop-title">🎁 ห้องของขวัญ</h3>`;

  const inbox = Online.giftIn || [];
  if(inbox.length){
    html += `<div class="gift-sec-title">📨 มีของขวัญส่งมาถึงหนู (${inbox.length})</div>`;
    html += inbox.map((it,i)=>`<div class="gift-in-row">
        <span class="gift-in-pic">${giftItemPic(it.k, it.id)}</span>
        <div class="gift-in-info"><b>${escapeHTML(giftItemName(it.k, it.id))}</b><br>
          <small>💌 จาก ${escapeHTML(it.fn)} · ${giftDateStr(it.ts)}</small></div>
        <span class="gift-in-btns">
          <button class="gift-accept" data-i="${i}">💝 รับ</button>
          <button class="gift-decline" data-i="${i}">✕ ไม่รับ</button>
        </span></div>`).join('');
  }

  const box = state.giftBox || [];
  html += `<div class="gift-sec-title">🎀 ของขวัญของฉัน (${box.length})</div>`;
  if(box.length){
    html += `<div class="hq-grid">` + box.map(x=>`<div class="hq-card gift-box-card" style="border-color:#e6a4c4">
        <div class="hq-head">${escapeHTML(giftItemName(x.k, x.id))}</div>
        <div class="hq-pic">${giftItemPic(x.k, x.id)}</div>
        <div class="gift-box-from">💌 จาก ${escapeHTML(x.fn || 'เพื่อน')}<br><small>${giftDateStr(x.ts)}</small></div>
      </div>`).join('') + `</div>`;
    html += `<div class="gift-note">💝 ของขวัญเก็บไว้เป็นที่ระลึก ขายต่อหรือส่งต่อไม่ได้นะ</div>`;
  }else{
    html += `<div class="mkt-empty">ยังไม่มีของขวัญเลย — เมื่อเพื่อนส่งของขวัญมาแล้วหนูกด "รับ" จะมาเก็บที่นี่ 🎁</div>`;
  }

  const out = Online.giftOut || [];
  if(out.length){
    html += `<div class="gift-sec-title">📤 ของขวัญที่หนูส่งไป (${out.length})</div>`;
    html += out.map(o=>`<div class="gift-out-row">
        <span class="gift-in-pic">${giftItemPic(o.k, o.id)}</span>
        <div class="gift-in-info"><b>${escapeHTML(giftItemName(o.k, o.id))}</b><br>
          <small>ส่งให้ ${escapeHTML(o.toName || 'เพื่อน')} · 🕓 สินค้ายังไม่มีผู้รับ</small></div>
      </div>`).join('');
  }

  el.innerHTML = html;
  bindLazyAssets(el);
  el.querySelectorAll('.gift-accept').forEach(b=>b.addEventListener('click', ()=>{
    const it = (Online.giftIn || [])[+b.dataset.i]; if(it) acceptGift(it);
  }));
  el.querySelectorAll('.gift-decline').forEach(b=>b.addEventListener('click', ()=>{
    const it = (Online.giftIn || [])[+b.dataset.i]; if(it) declineGift(it);
  }));
}

/* ผู้รับกด "รับ": ยืนยันสถานะกับ server ก่อน (กันรับซ้ำ) → เก็บเข้าห้องของขวัญ + ฉากเปิด */
function acceptGift(it){
  // 🐾 รอบ 325: คำทักทายน้อง — ไม่ใช่ของ ไม่เข้าห้องของขวัญ · น้องที่เปิดอยู่ได้ EXP + ดีใจ
  if(it.k === 'greet'){
    return giftAccept(it).then(()=>{
      Online.giftIn = (Online.giftIn || []).filter(g=>!(g.from === it.from && g.key === it.key));
      const p = activePet();
      if(p) addExp(GREET_EXP, p);
      saveState();
      showGreetReveal(it);
      renderDashboard();
    }).catch(()=>{ sfx.wrong(); toast('รับคำทักไม่สำเร็จ ลองใหม่นะ'); });
  }
  return giftAccept(it).then(()=>{
    state.giftBox.push({k: it.k, id: it.id, from: it.from, fn: it.fn, ts: it.ts || Date.now()});
    saveState();
    if(typeof feedEvent === 'function') feedEvent('goods', `ได้รับของขวัญ ${giftItemName(it.k, it.id)} จาก ${it.fn || 'เพื่อน'} 🎁`);
    Online.giftIn = (Online.giftIn || []).filter(g=>!(g.from === it.from && g.key === it.key));
    showGiftReveal(it);
    renderDashboard();
  }).catch(()=>{ sfx.wrong(); toast('รับของขวัญไม่สำเร็จ ลองใหม่นะ'); });
}

/* ผู้รับกด "ไม่รับ": ตั้งสถานะ declined → ผู้ส่งเห็นแล้วได้ของ/เหรียญคืน */
function declineGift(it){
  return giftDecline(it).then(()=>{
    Online.giftIn = (Online.giftIn || []).filter(g=>!(g.from === it.from && g.key === it.key));
    sfx.select(); toast('บอกเพื่อนแล้วว่ายังไม่สะดวกรับนะ');
    renderGiftPanel();
  }).catch(()=>{ sfx.wrong(); toast('ทำรายการไม่สำเร็จ ลองใหม่นะ'); });
}

/* 🐾 รอบ 325: ฉากรับ "คำทักทายน้อง" — น้องดีใจ หัวใจลอย + EXP (ไม่มีของเก็บ) */
function showGreetReveal(it){
  const gr = greetInfo(it.id);
  const p = activePet();
  if(sfx.petVoice && p) sfx.petVoice(p.type, 'happy');   // น้องร้องรับเสียงสดใส
  const overlay = document.createElement('div');
  overlay.className = 'rankup-overlay';
  overlay.innerHTML = `
    <div class="rankup-rays" style="--rank-color:#7fd0ff"></div>
    <div class="rankup-content">
      <div class="rankup-title">🐾 เพื่อนทักทายน้อง!</div>
      <div class="collect-reveal-frame" style="--rank-color:#7fd0ff"><span class="cr-emoji">${gr ? gr.e : '👋'}</span></div>
      <div class="rankup-name" style="color:#2f8fd0">${escapeHTML(gr ? gr.t : 'สวัสดีน้อง!')}</div>
      <p class="rankup-sub">💌 ${escapeHTML(it.fn || 'เพื่อน')} ${escapeHTML(gr ? gr.msg : 'ทักทายน้องของหนู')}<br>
        ${p ? `${escapeHTML(p.name)} ดีใจมาก! ได้ EXP +${GREET_EXP} 🥰` : 'น้องดีใจมาก! 🥰'}</p>
      <button class="rankup-btn">ขอบคุณนะ! 🥰</button>
    </div>`;
  overlay.querySelector('.rankup-btn').addEventListener('click', ()=>{
    overlay.remove();
    if(document.getElementById('screen-dashboard').classList.contains('active')) renderDashboard();
  });
  document.body.appendChild(overlay);
  const stage = document.querySelector('.hero-scene .pet-stage');
  heartsFx(stage, 6);
  setTimeout(()=>{ if(document.body.contains(overlay)) overlay.remove(); }, 9000);   // กันค้างถ้าเด็กไม่กดปุ่ม
}

/* ฉากเปิดของขวัญ (สไตล์เดียวกับฉากได้ของสะสม โทนชมพู) */
function showGiftReveal(it){
  if(sfx.rankup) sfx.rankup();
  const name = giftItemName(it.k, it.id);
  const img  = it.k === 'shop' ? giftImg(it.id, true) : collectImg(it.id, true);
  const emo  = it.k === 'shop' ? ((giftInfo(it.id) || {}).emoji || '🎁') : ((collectInfo(it.id) || {}).emoji || '📦');
  const pic  = img ? `<img class="collect-reveal-img" src="${img}" decoding="async" width="512" height="512" alt="${escapeHTML(name)}">` : `<span class="cr-emoji">${emo}</span>`;
  const overlay = document.createElement('div');
  overlay.className = 'rankup-overlay';
  overlay.innerHTML = `
    <div class="rankup-rays" style="--rank-color:#e6a4c4"></div>
    <div class="rankup-content">
      <div class="rankup-title">🎁 ได้รับของขวัญ!</div>
      <div class="collect-reveal-frame" style="--rank-color:#e6a4c4">${pic}</div>
      <div class="rankup-name" style="color:#d6467f">${escapeHTML(name)}</div>
      <p class="rankup-sub">💌 จาก ${escapeHTML(it.fn || 'เพื่อน')}<br>เก็บไว้ในห้องของขวัญเป็นที่ระลึกนะ 💝</p>
      <button class="rankup-btn">ขอบคุณนะ! 🥰</button>
    </div>`;
  overlay.querySelector('.rankup-btn').addEventListener('click', ()=>{
    overlay.remove();
    if(document.getElementById('screen-dashboard').classList.contains('active')) renderDashboard();
  });
  document.body.appendChild(overlay);
}

/* กล่องเลือกของขวัญส่งเพื่อน: แท็บ "ซื้อของขวัญ" (gifts.js) / "จากคลังของฉัน" (collectibles) */
let giftPickCat = 'cake';
function openGiftPicker(friend){
  if(!friend) return;
  if(typeof Online === 'undefined' || !Online.ready){ toast('ต้องต่ออินเทอร์เน็ตก่อนถึงจะส่งของขวัญได้นะ 📡'); return; }
  sfx.select();
  const overlay = document.createElement('div');
  overlay.className = 'gift-pick-overlay';
  overlay.innerHTML = `<div class="gift-pick-box">
    <div class="gift-pick-head">
      <span>🎁 ส่งของขวัญให้ ${escapeHTML(friend.n)}</span>
      <button class="gift-pick-close" type="button">✕</button>
    </div>
    <div class="gift-pick-tabs">
      <button class="gp-tab on" data-tab="shop" type="button">🛍️ ซื้อของขวัญ</button>
      <button class="gp-tab" data-tab="mine" type="button">📦 จากคลังของฉัน</button>
    </div>
    <div class="gift-pick-body" id="gift-pick-body"></div>
  </div>`;
  document.body.appendChild(overlay);
  const body = overlay.querySelector('#gift-pick-body');
  let tab = 'shop';

  function renderBody(){
    if(tab === 'shop'){
      const chips = GIFT_CATS.map(c=>`<button class="gp-chip${giftPickCat === c.id ? ' on' : ''}" data-cat="${c.id}" type="button">${c.emoji} ${c.name}</button>`).join('');
      const items = GIFTS.filter(g=>g.cat === giftPickCat);
      const grid = `<div class="hq-grid">` + items.map(g=>{
        const img = giftImg(g.id), afford = state.coins >= g.price;
        return `<div class="hq-card gp-card${afford ? '' : ' gp-poor'}" data-k="shop" data-id="${g.id}" style="border-color:#e6a4c4">
          <div class="hq-head">${g.name}</div>
          <div class="hq-pic">${img ? lazyAssetHTML(img, g.name) : `<span class="hq-emoji">${g.emoji}</span>`}</div>
          <div class="hq-price gp-price">🪙 ${fmtNum(g.price)}</div>
        </div>`;
      }).join('') + `</div>`;
      body.innerHTML = `<div class="gp-chips">${chips}</div>${grid}`;
      body.querySelectorAll('.gp-chip').forEach(b=>b.addEventListener('click', ()=>{ giftPickCat = b.dataset.cat; renderBody(); }));
    }else{
      const counts = {};
      for(const id of state.collection) counts[id] = (counts[id] || 0) + 1;
      const ids = COLLECTIBLES.map(c=>c.id).filter(id=>counts[id]);
      if(!ids.length){
        body.innerHTML = `<div class="mkt-empty">คลังยังว่างอยู่ — ไปผลิตสินค้าที่แท็บ 🏭 โรงงานก่อน แล้วค่อยเอามาส่งให้เพื่อนได้นะ</div>`;
      }else{
        body.innerHTML = `<div class="gp-note">ส่งสินค้าจากคลังให้เพื่อน — ส่งแล้วชิ้นนั้นออกจากคลังทันที (ถ้าเพื่อนไม่รับหรือค้างนานเกิน 7 วัน ของจะกลับคืนคลังให้เอง)</div><div class="hq-grid">` + ids.map(id=>{
          const c = collectInfo(id), tier = COLLECT_TIERS[c.tier], img = collectImg(id);
          return `<div class="hq-card gp-card" data-k="collect" data-id="${id}" style="border-color:${tier.color}">
            <div class="hq-head">${c.name}</div>
            <div class="hq-pic">${img ? lazyAssetHTML(img, c.name) : `<span class="hq-emoji">${c.emoji}</span>`}<span class="hq-badge">×${counts[id]}</span></div>
            <div class="hq-price gp-price">มูลค่า 🪙${fmtNum(c.price)}</div>
          </div>`;
        }).join('') + `</div>`;
      }
    }
    body.querySelectorAll('.gp-card').forEach(card=>card.addEventListener('click', ()=>{
      confirmSendGift(friend, card.dataset.k, card.dataset.id, ()=>overlay.remove());
    }));
    bindLazyAssets(body);
  }

  overlay.querySelectorAll('.gp-tab').forEach(b=>b.addEventListener('click', ()=>{
    tab = b.dataset.tab;
    overlay.querySelectorAll('.gp-tab').forEach(t=>t.classList.toggle('on', t === b));
    renderBody();
  }));
  overlay.querySelector('.gift-pick-close').addEventListener('click', ()=>overlay.remove());
  overlay.addEventListener('click', e=>{ if(e.target === overlay) overlay.remove(); });
  renderBody();
}

/* กล่องยืนยันก่อนส่ง — เช็กเหรียญ/ของในคลัง */
function confirmSendGift(friend, k, id, onDone){
  const name = giftItemName(k, id);
  /* 🚫 รอบ 952: ของขวัญที่เป็น "ของกิน" (เค้กจากร้าน · ของสะสมหมวดอาหาร) ส่งไม่ได้ตอนป่วยเพราะหิว */
  if(foodGiftBlocked(k, id)){ sfx.wrong(); toast(hungerSickMsg(name)); return; }
  const img  = k === 'shop' ? giftImg(id) : collectImg(id);
  const emo  = k === 'shop' ? ((giftInfo(id) || {}).emoji || '🎁') : ((collectInfo(id) || {}).emoji || '📦');
  const pic  = img ? `<img src="${img}" alt="">` : `<span>${emo}</span>`;
  let costLine;
  if(k === 'shop'){
    const g = giftInfo(id); if(!g) return;
    if(state.coins < g.price){
      askConfirm(`<div class="ld-pic">${pic}</div><div class="ld-name">${escapeHTML(name)}</div>
        <p class="ld-note">ราคา 🪙${fmtNum(g.price)} — เหรียญไม่พอนะ (มี 🪙${fmtNum(state.coins)})<br>หาเหรียญเพิ่มก่อนแล้วค่อยมาส่งนะ 😊</p>`, 'ปิด', ()=>{});
      return;
    }
    costLine = `ราคา 🪙${fmtNum(g.price)} (หักตอนส่ง)`;
  }else{
    if(!state.collection.includes(id)){ toast('ไม่มีชิ้นนี้ในคลังแล้ว'); return; }
    costLine = `ส่งจากคลังของหนู — ชิ้นนี้จะออกจากคลังทันที`;
  }
  askConfirm(`<div class="ld-pic">${pic}</div><div class="ld-name">${escapeHTML(name)}</div>
    <p class="ld-note">ส่งให้ <b>${escapeHTML(friend.n)}</b><br>${costLine}</p>`,
    '🎁 ส่งเลย!', ()=>{ doSendGift(friend, k, id); if(onDone) onDone(); });
}

/* ส่งจริง: ตัดของ/หักเหรียญทันที (escrow) → เขียน DB · ส่งไม่สำเร็จคืนให้ */
function doSendGift(friend, k, id){
  /* 🚫 รอบ 952: ด่านสุดท้ายกันของกินหลุดไป (เผื่อมีทางเข้าอื่นในอนาคต) */
  if(foodGiftBlocked(k, id)){ sfx.wrong(); toast(hungerSickMsg(giftItemName(k, id))); return; }
  if(k === 'shop'){
    const g = giftInfo(id); if(!g) return;
    if(state.coins < g.price){ toast('เหรียญไม่พอนะ'); return; }
    state.coins -= g.price; saveState(); renderDashboard();
    giftSend(friend.uid, 'shop', id)
      .then(()=>{ sfx.buy(); toast(`🎁 ส่ง${g.name}ให้ ${friend.n} แล้ว! รอเพื่อนกดรับนะ`); })
      .catch(msg=>{ state.coins += g.price; saveState(); renderDashboard();
        sfx.wrong(); toast(typeof msg === 'string' ? msg : 'ส่งไม่สำเร็จ คืนเหรียญให้แล้ว'); });
  }else{
    const idx = state.collection.indexOf(id);
    if(idx < 0){ toast('ไม่มีชิ้นนี้ในคลังแล้ว'); return; }
    const c = collectInfo(id);
    state.collection.splice(idx, 1); saveState(); renderDashboard();
    giftSend(friend.uid, 'collect', id)
      .then(()=>{ sfx.buy(); toast(`🎁 ส่ง${c ? c.name : 'ของ'}ให้ ${friend.n} แล้ว! รอเพื่อนกดรับนะ`); })
      .catch(msg=>{ state.collection.push(id); saveState(); renderDashboard();
        sfx.wrong(); toast(typeof msg === 'string' ? msg : 'ส่งไม่สำเร็จ คืนของให้แล้ว'); });
  }
}

/* ============================================================
   RANK CARD + ฉากเลื่อนแรงค์
   ============================================================ */
function rankBadgeHTML(rankId, emoji, cls){
  const img = IMG_FILES[`rank_${rankId}`];
  return img ? `<img class="${cls}" src="${img}" alt="">` : `<span class="${cls} rank-badge-emoji">${emoji}</span>`;
}

function renderRankCard(){
  const el = document.getElementById('rank-card');
  const worth = netWorth();                  // แรงค์ยึดมูลค่าทรัพย์สินสุทธิ (เหรียญ + ทรัพย์สิน)
  const info = rankInfo(worth);
  const r = info.rank;
  const assets = assetValue();
  const nextText = info.next
    ? `💰 มูลค่ารวม ${fmtNum(worth)} (🪙${fmtNum(state.coins)} + ทรัพย์สิน ${fmtNum(assets)}) · อีก ${fmtNum(info.next.min - worth)} ถึง ${info.next.name}`
    : `💰 มูลค่ารวม ${fmtNum(worth)} (🪙${fmtNum(state.coins)} + ทรัพย์สิน ${fmtNum(assets)}) · แรงค์สูงสุดแล้ว! 👑`;
  el.style.borderColor = r.color;
  el.style.setProperty('--rank-c', r.color);
  // แสงกรีดตามเหลี่ยม (.rank-beam/.rank-edge) mask ตามรูปทรงภาพจริง — ต้อง url() absolute (Chrome resolve เทียบไฟล์ CSS)
  const badgeImgFile = IMG_FILES[`rank_${r.id}`];
  const edgeFxHTML = badgeImgFile
    ? `<div class="rank-beam"><i></i></div><div class="rank-edge"><i></i></div>`
    : '';
  el.innerHTML = `
    <div class="rank-badge-wrap" style="${badgeImgFile ? `--rank-img:url('${new URL(badgeImgFile, document.baseURI).href}')` : ''}">
      <div class="rank-badge-glow"></div>${rankBadgeHTML(r.id, r.emoji, 'rank-badge-img')}${edgeFxHTML}
    </div>
    <div class="rank-body">
      <div class="rank-name" style="color:${r.color}">${r.emoji} ${info.label}</div>
      <div class="rank-bar"><div class="rank-fill" style="width:${Math.round(info.prog*100)}%;background:${r.color}"></div></div>
      <div class="rank-text">${nextText}</div>
    </div>`;

  renderRankTab();   // 🎖️ รอบ 604: ป้ายแรงค์เล็กใต้วันเดือนปี (แทนเหรียญยักษ์กลางเวทีที่ถอดออก)
}

/* 🎖️ รอบ 604 (ผู้ใช้สั่ง 26 ก.ค. 2026): แรงค์ = แท็บเล็กใต้วันเดือนปีบนแถบบน
   เดิมเป็นเหรียญยักษ์ฉากหลังเวที (รอบ 114-177) — เวทีถูกเปลี่ยนเป็น "โชว์น้องน่ารัก" แทน
   แท็บโชว์: เหรียญเล็ก + ชื่อแรงค์ + แถบความคืบหน้าไปแรงค์ถัดไป · คลิก = เปิดแผงแรงค์เต็ม
   เปลี่ยนแรงค์ระหว่างเล่น = แท็บเด้งวาบ (rk-up) ให้เด็กเห็นว่ามีอะไรเปลี่ยน */
let rankTabShownId = null;
function renderRankTab(){
  const el = document.getElementById('rank-tab');
  if(!el) return;
  const info = rankInfo(netWorth());
  const r = info.rank;
  const changed = rankTabShownId !== null && rankTabShownId !== r.id && !state.noAnim;
  rankTabShownId = r.id;
  el.style.display = 'inline-flex';
  el.style.setProperty('--rk-c', r.color);
  el.innerHTML = `${rankBadgeHTML(r.id, r.emoji, 'rk-ico')}`
    + `<span class="rk-name">${escapeHTML(info.label)}</span>`
    + `<span class="rk-bar"><i style="width:${Math.round((info.prog || 0)*100)}%"></i></span>`;
  if(!el.dataset.bound){
    el.dataset.bound = '1';
    el.addEventListener('click', ()=>{
      sfx.select();
      if(typeof openPanel === 'function') openPanel('panel-rank');
    });
  }
  if(changed){
    el.classList.remove('rk-up');
    void el.offsetWidth;          // restart animation
    el.classList.add('rk-up');
    setTimeout(()=>el.classList.remove('rk-up'), 1500);
  }
}

/* ฉากอัพแรงค์ใหญ่: เหรียญตราใหญ่ + รัศมีหมุน (สไตล์เกมยิงแรงค์) */
function showRankUp(before, after){
  sfx.rankup();
  const r = after.rank;
  const overlay = document.createElement('div');
  overlay.className = 'rankup-overlay';
  overlay.innerHTML = `
    <div class="rankup-rays" style="--rank-color:${r.color}"></div>
    <div class="rankup-content">
      <div class="rankup-title">🎖️ RANK UP!</div>
      <div class="rankup-badge" style="--rank-color:${r.color}">
        ${rankBadgeHTML(r.id, r.emoji, 'rankup-badge-img')}
      </div>
      <div class="rankup-name" style="color:${r.color}">${r.name}${after.tier ? ' ' + after.tier : ''}</div>
      <p class="rankup-sub">เลื่อนจาก ${before.rank.emoji} ${before.label} — เก่งมาก สู้ต่อไป!</p>
      <button class="rankup-btn">รับตำแหน่ง 🎉</button>
    </div>`;
  overlay.querySelector('.rankup-btn').addEventListener('click', ()=>{
    overlay.remove();
    if(document.getElementById('screen-dashboard').classList.contains('active')) renderDashboard();
  });
  document.body.appendChild(overlay);
}

/* ============================================================
   PET DASHBOARD
   ============================================================ */
/* ============================================================
   📰 รอบ 155: overlay ข้อมูลน้อง & การดูแล + ฟีดกิจกรรมเพื่อน
   - แผง "ข้อมูลน้อง"+"การดูแล" เดิม (ข้างเวที) ย้ายมาเป็น overlay ใหญ่
     เนื้อหาเก็บใน __petPlates (renderDashboard สร้างใหม่ทุกรอบ — overlay refresh ตาม)
   - ฟีด = กิจกรรมของคนที่เรา follow (Online.feed จาก feedWatchSync ใน online.js)
   ============================================================ */
let __petPlates = null;   // {info, care} — HTML แผงล่าสุด (สดจาก renderDashboard)

/* ผูกปุ่มในแผงข้อมูลน้อง/การดูแล (scope ด้วย root — ใช้เฉพาะใน overlay) */
function bindPetPlateButtons(root){
  const p = activePet();
  if(!p) return;
  const conf = PETS[p.type];
  const on = (id, fn)=>{ const b = root.querySelector('#' + id); if(b) b.addEventListener('click', fn); };
  on('btn-feed', feedPet);
  on('btn-cure', curePet);
  on('btn-sleep', sleepAllPets);
  on('btn-wake', wakeAllPets);
  on('btn-detox', ()=>detoxPet(p));
  on('btn-foodquiz', openFoodQuiz);   // 🛡️ รอบ 951: ควิซอาหารปลอดภัย (ย้ายมาจากแถบล่างล็อบบี้)
  on('btn-pet-rename', ()=>renamePet(p));
  on('btn-pi-pantry', ()=>{ if(typeof PetPantry !== 'undefined') PetPantry.openPantry(); });
  on('btn-pi-food-trip', ()=>enterPetShopping3D('food'));
  on('btn-pi-fashion-trip', ()=>enterPetShopping3D('fashion'));
  on('btn-pi-dress', ()=>{           // ตู้เสื้อผ้าใช้สวมของที่มีแล้ว; ของใหม่ต้องขับรถไปซื้อที่ร้านแฟชั่น
    window.__piOverlay = null;
    const ov = root.closest ? (root.classList.contains('pi-overlay') ? root : root.closest('.pi-overlay')) : null;
    if(ov) ov.remove();
    openDressUpBoard();
  });
  const shapeToggle = ()=>{          // 🎀 รอบ 659: สลับดูรูปร่าง ↔ ดูชุด (ตัวเดียวกับปุ่มบนเวที)
    state.psDress = !state.psDress;
    saveState();
    sfx.select();
    renderDashboard();
  };
  on('btn-pi-shape-toggle', shapeToggle);
  on('btn-pi-dress-pip', shapeToggle);   // 🎀 รอบ 661: กดภาพเล็ก "ชุดที่ใส่อยู่" = สลับมาดูตัวใหญ่
}

/* overlay ใหญ่ ข้อมูลน้อง & การดูแล — 2 คอลัมน์ (ร่างไข่ = คอลัมน์เดียว) ไม่มี scrollbar
   เปิดจากปุ่มเหนือฟีด · กดปุ่มดูแลแล้ว renderDashboard จะ refresh เนื้อหาให้เอง */
function openPetInfoOverlay(){
  if(!__petPlates) return;
  const ov = document.createElement('div');
  ov.className = 'pi-overlay';
  const close = ()=>{ window.__piOverlay = null; ov.remove(); };
  const fill = ()=>{
    if(!__petPlates || !activePet()){ close(); return; }
    ov.innerHTML = `<div class="pi-box${__petPlates.care ? '' : ' one-col'}">
      <button class="pl-close pi-close pi-close-left" aria-label="ปิด">✕</button>
      <div class="stage-plate pi-plate pi-plate-img">${__petPlates.info}</div>
      ${__petPlates.care ? `<div class="stage-plate pi-plate">${__petPlates.care}</div>` : ''}
    </div>`;
    bindPetPlateButtons(ov);
    ov.querySelectorAll('.pi-close').forEach(b=>b.addEventListener('click', close));
  };
  ov.addEventListener('click', (e)=>{ if(e.target === ov) close(); });
  window.__piOverlay = {refresh: fill};
  fill();
  document.body.appendChild(ov);
  sfx.select();
}

/* เวลาแบบอ่านง่ายในแถวฟีด */
function feedAgo(ts){
  const d = Date.now() - (ts || 0);
  if(d < 90*1000) return 'เมื่อกี้';
  if(d < 60*60*1000) return Math.floor(d/60000) + ' นาทีก่อน';
  if(d < 24*60*60*1000) return Math.floor(d/3600000) + ' ชม.ก่อน';
  return Math.floor(d/86400000) + ' วันก่อน';
}

/* ============================================================
   📰 รอบ 701 — ฟีดล็อบบี้ "ทีละโพสต์" แบบ Facebook (ผู้ใช้สั่ง 29 ก.ค. 2026)
   ① โชว์ทีละ 1 โพสต์ ค้าง 10 วิ แล้วเลื่อนขึ้นเร็ว ๆ โพสต์ถัดไปดันขึ้นมาจากด้านล่าง วนไม่รู้จบ
      (เลื่อนเองได้ตลอด → หยุดออโต้ 12 วิ แล้วกลับเข้ากระบวนการเดิม)
   ② ชื่อ+ระดับชั้นอยู่บรรทัดบน · ข้อความรายงานลงบรรทัดของตัวเอง (ห้ามต่อแถวเดียวกัน)
   ③ โพสต์ที่พูดถึงสินค้า → ดึงภาพสินค้ามาโชว์เกือบเต็มกรอบ พอดีจอไม่มี scrollbar
      (จับชื่อสินค้าจากข้อความ — ไม่ต้องเพิ่ม field ใน DB = ไม่ต้องแก้ rules)
   ④ ปุ่มถูกใจ + คอมเมนต์อยู่ล่างสุดของทุกโพสต์ · ⑥ กดค้าง = เลือกรีแอ็กชันได้เหมือน Facebook
   ⑦ 🌟 ของที่เป็น "ตัวเรา": ทุกรีแอ็กชัน/คอมเมนต์ด่วนเป็น "คำอังกฤษ + คำแปลไทย"
      เด็กได้คำศัพท์ติดตัวทุกครั้งที่ทักเพื่อน (ดู FEED_REACTIONS/FEED_QUICK_CM ใน js/state.js)
   ข้อมูลใช้ /gfeed ชุดเดียวกับหน้า Feed เต็ม (การ์ดหน้าตาเดียวกันทั้งสองที่ = ฟังก์ชันวาดตัวเดียว)
   ============================================================ */
const FEED_DECK_MAX  = 15;      // เก็บกี่โพสต์ในวงหมุนของล็อบบี้
const FEED_SLIDE_MS  = 10000;   // ค้างโพสต์ละกี่ ms (ผู้ใช้กำหนด 10 วินาที)
const FEED_RESUME_MS = 12000;   // ผู้ใช้เลื่อนเอง → หยุดออโต้กี่ ms ก่อนวนต่อ
let __fdIdx = 0, __fdAt = 0, __fdHold = 0, __fdTimer = 0;

/* ---- ภาพสินค้าในโพสต์: จับชื่อสินค้า/ของขวัญจากข้อความโพสต์ ---- */
let __fpImgIdx = null;
function feedPostImgIndex(){
  if(__fpImgIdx) return __fpImgIdx;
  const out = [];
  if(typeof COLLECTIBLES !== 'undefined')
    for(const c of COLLECTIBLES) out.push({name:c.name, emoji:c.emoji, get:()=>collectImg(c.id)});
  if(typeof GIFTS !== 'undefined')
    for(const g of GIFTS) out.push({name:g.name, emoji:g.emoji, get:()=>giftImg(g.id)});
  out.sort((a,b)=>b.name.length - a.name.length);   // ชื่อยาวก่อน ("เค้กสายรุ้งวันเกิด" ต้องชนะ "เค้กสายรุ้ง")
  __fpImgIdx = out;
  return out;
}
function feedPostImg(it){
  if(!it || !it.tx) return null;
  for(const e of feedPostImgIndex()){
    if(it.tx.indexOf(e.name) < 0) continue;
    const src = e.get();
    return src ? {src, name:e.name} : {src:'', name:e.name, emoji:e.emoji};
  }
  return null;
}
function feedPostByKey(key){
  return ((typeof Online !== 'undefined' && Online.gfeed) || []).find(it=>it.key === key) || null;
}
function feedCanReact(it){
  if(typeof Online === 'undefined' || !it) return false;
  return it.u === onlineKey() || (Online.myFriends || []).some(f=>f.uid === it.u);
}
/* สรุปรีแอ็กชัน: อีโมจิที่มีคนกด (มากสุดก่อน) + จำนวนรวม + คำอังกฤษของรีแอ็กชันยอดนิยม */
function fpStatsHTML(it){
  const cnt = {};
  for(const uid in it.rx) cnt[it.rx[uid]] = (cnt[it.rx[uid]] || 0) + 1;
  const ks = Object.keys(cnt).sort((a,b)=>cnt[b] - cnt[a]);
  if(!ks.length && !it.comments.length)
    return `<div class="fp-sum fp-sum-none">ยังไม่มีใครทัก — เป็นคนแรกสิ! ✨</div>`;
  const top = ks.length ? feedRx(ks[0]) : null;
  return `<div class="fp-sum">
    ${ks.length ? `<span class="fp-sum-rx">${ks.slice(0,3).map(k=>feedRx(k).e).join('')}</span>
      <b>${it.likeN}</b>${top ? `<i class="fp-en">${top.en}</i>` : ''}` : ''}
    ${it.comments.length ? `<span class="fp-sum-cm">💬 ${it.comments.length} คอมเมนต์</span>` : ''}
  </div>`;
}
/* การ์ดโพสต์ 1 ใบ — ใช้ทั้งวงหมุนล็อบบี้ (สูงเต็มกรอบ) และหน้า Feed เต็ม (สูงตามเนื้อหา) */
/* 🎖️ รอบ 715: ชื่อในฟีด (it.n) มีอิโมจิเข็ม baked ต่อท้าย — ตัดออกจากชื่อกันตัดบรรทัดมั่ว
   (ผู้ใช้แจ้งรอบ 715) · รอบ N: เลิกโชว์แถวเข็มใต้ชื่อ (ผู้ใช้สั่งเอาออกทั้งฟีด) — เหลือแค่ตัดชื่อให้สะอาด */
function fpNameBadgesHTML(fullName){
  const sp = splitNameBadges(fullName);
  return { name: sp.name, row: '' };
}
function fpostHTML(it, opt){
  opt = opt || {};
  const fc = (typeof FEED_CATS !== 'undefined' && FEED_CATS[it.c]) || {e:'✨'};
  const img = feedPostImg(it);
  const my  = it.myRx ? feedRx(it.myRx) : null;
  const can = feedCanReact(it);
  const k   = escapeHTML(it.key);
  const nb  = fpNameBadgesHTML(it.n);
  /* 🎖️ รอบ 712: โพสต์ "สอบผ่าน" โชว์ใบประกาศเต็มกรอบแทนอิโมจิ 📝 (แตะ = ใบใหญ่เต็มจอ) */
  const cert = (typeof certFromPost === 'function') ? certFromPost(it) : null;
  return `<div class="fpost${opt.clone ? ' fp-clone' : ''}${opt.page ? ' fp-page' : ''}${cert ? ' fp-cert' : ''}" data-key="${k}"
      data-fid="${escapeHTML(it.u)}" data-n="${escapeHTML(it.n)}" data-g="${escapeHTML(it.g || '')}">
    <div class="fp-head">
      ${(typeof photoMiniHTML === 'function') ? photoMiniHTML(it.u, 'fp-ava') : ''}
      <span class="fp-who">
        <span class="fp-name-line">${nameWithGrade(`<b class="fp-name">${escapeHTML(nb.name)}</b>`, gradeOf(it.u, it.g))}<small class="fp-when">${feedAgo(it.ts)}</small></span>
        ${nb.row}
      </span>
    </div>
    <div class="fp-text">${escapeHTML(it.tx)}</div>
    <div class="fp-media">${cert
      ? `<button class="cert-tap" type="button" data-key="${k}" title="แตะดูใบประกาศใบใหญ่">${certChipHTML(cert)}${certSVG(cert)}</button>`
      : (img && img.src
        ? `<img class="fp-img" src="${img.src}" alt="${escapeHTML(img.name)}"><span class="fp-cap">${escapeHTML(img.name)}</span>`
        : `<span class="fp-big">${img ? (img.emoji || fc.e) : fc.e}</span>`)}</div>
    ${fpStatsHTML(it)}
    <div class="fp-bar">
      <button class="fp-act fp-like${my ? ' on' : ''}${can ? '' : ' fp-like-locked'}" type="button" data-key="${k}">
        ${my ? `${my.e} <span class="fp-en">${my.en}</span>` : '👍 ถูกใจ'}</button>
      <button class="fp-act fp-cmt" type="button" data-key="${k}">💬 คอมเมนต์</button>
    </div>
  </div>`;
}

/* ---- วงหมุนในล็อบบี้ ---- */
function renderFeedCard(){
  const el = document.getElementById('feed-list');
  renderFeedBell();
  if(!el) return;
  delete sideScrollSt['feed-list'];          // เลิกใช้ตัวเลื่อนวนแบบเก่า (ไม่งั้นมันจะห่อ ss-chunk ทับเด็ค)
  const online = (typeof Online !== 'undefined' && Online.ready);
  const feed = ((typeof Online !== 'undefined' && Online.gfeed) || []).slice(0, FEED_DECK_MAX);
  if(!feed.length){
    el.classList.remove('feed-deck');
    el.__n = 0; el.__sig = '';
    el.innerHTML = `<div class="feed-empty">${online
      ? `ยังไม่มีกิจกรรมให้อ่านตอนนี้ 😴<br><small>เล่นเกม/ทำภารกิจ แล้วเปิดเผยกิจกรรมในตั้งค่า ⚙️<br>โพสต์ของทุกคนจะมาโชว์ทีละโพสต์ตรงนี้</small>`
      : `ต้องต่ออินเทอร์เน็ตก่อนถึงจะเห็นฟีด 📡<br><small>กิจกรรมของเพื่อนจะไหลมาที่นี่ทีละโพสต์</small>`}</div>`;
    return;
  }
  const sig = feed.map(it=>`${it.key}:${it.likeN}:${it.myRx}:${it.comments.length}`).join('|');
  if(el.__sig === sig && el.classList.contains('feed-deck')) return;   // ไม่มีอะไรเปลี่ยน = ไม่วาดใหม่ (กันตำแหน่งดีด)
  const topWas = el.__top;
  el.__sig = sig;
  el.__top = feed[0].key;
  el.classList.add('feed-deck');
  el.innerHTML = feed.map(it=>fpostHTML(it)).join('')
    + (feed.length > 1 ? fpostHTML(feed[0], {clone:true}) : '');      // โคลนใบแรกท้ายสุด = วนขึ้นได้ไม่มีสะดุด
  el.__n = feed.length;
  if(topWas !== el.__top) __fdIdx = 0;                                // มีโพสต์ใหม่แทรกขึ้นหัว → เด้งไปดูใบใหม่
  __fdIdx = Math.min(__fdIdx, feed.length - 1);
  if(el.clientHeight){ el.__prog = Date.now() + 400; el.scrollTop = __fdIdx * el.clientHeight; }
  __fdAt = Date.now();
  if(!el.__fdBound){
    el.__fdBound = true;
    const hold = ()=>{ __fdHold = Date.now() + FEED_RESUME_MS; };
    el.addEventListener('pointerdown', hold);
    el.addEventListener('touchstart', hold, {passive:true});
    el.addEventListener('wheel', hold, {passive:true});
    el.addEventListener('scroll', ()=>{ if(Date.now() > (el.__prog || 0)) hold(); }, {passive:true});
  }
  if(!__fdTimer) __fdTimer = setInterval(feedDeckTick, 200);
}
function feedDeckGo(el, i, smooth){
  const h = el.clientHeight;
  if(!h) return;
  __fdIdx = i;
  const top = i * h;
  el.__prog = Date.now() + 1100;                      // ช่วงที่เราสั่งเลื่อนเอง ห้ามนับเป็น "ผู้ใช้เลื่อน"
  el.scrollTo({top, behavior: smooth ? 'smooth' : 'auto'});
  setTimeout(()=>{                                    // แท็บโดน throttle = smooth ไม่ขยับเลย → กระโดดตรงแทน
    if(document.getElementById('feed-list') !== el) return;
    if(Math.abs(el.scrollTop - top) > 4){ el.__prog = Date.now() + 300; el.scrollTop = top; }
  }, 700);
  if(i >= el.__n){                                    // ถึงใบโคลน → ตัดกลับใบแรกแบบไม่มีอนิเมชัน
    setTimeout(()=>{
      const cur = document.getElementById('feed-list');
      if(cur !== el || !el.clientHeight) return;
      __fdIdx = 0; el.__prog = Date.now() + 300;
      el.scrollTo({top:0, behavior:'auto'});
    }, 820);
  }
}
function feedDeckTick(){
  const el  = document.getElementById('feed-list');
  const bar = document.getElementById('fd-prog-bar');
  if(!el || !el.classList.contains('feed-deck') || !el.clientHeight || (el.__n || 0) < 2){
    if(bar) bar.style.width = '0%';
    return;
  }
  const now = Date.now();
  if(now < __fdHold || __fcmKey){                     // ผู้ใช้เลื่อนเอง/เปิดกล่องคอมเมนต์อยู่ = พัก
    __fdIdx = Math.round(el.scrollTop / el.clientHeight);
    __fdAt  = now;
    if(bar) bar.style.width = '0%';
    return;
  }
  const p = Math.min(1, (now - __fdAt) / FEED_SLIDE_MS);
  if(bar) bar.style.width = (p * 100).toFixed(1) + '%';
  if(p < 1) return;
  __fdAt = now;
  feedDeckGo(el, __fdIdx + 1, true);
}

/* ---- 🔔 กระดิ่งแจ้งเตือน (มีคนไลก์/คอมเมนต์โพสต์ของเรา) ---- */
function renderFeedBell(){
  const b = document.getElementById('btn-feed-bell');
  if(!b) return;
  const n = (typeof Online !== 'undefined' && Online.notifUnread) || 0;
  b.innerHTML = `🔔${n ? `<b class="fb-n">${n > 9 ? '9+' : n}</b>` : ''}`;
  b.classList.toggle('on', n > 0);
}
/* 🎁🐾👋 รอบ 983: แจ้งเตือนที่ "ไม่ได้มาจากโพสต์" — ของขวัญ / ทักทายน้อง / คำขอเป็นเพื่อน
   ต้นเรื่องอยู่คนละกล่องกับฟีด → ปุ่มในแถวพาไปที่กล่องต้นทางแทน "ไปดูต้นเรื่อง" */
const FNT_JUMP = {
  gf: {ico:'🎁', go:'🎁 ไปห้องของขวัญ', panel:'panel-gifts'},
  gr: {ico:'🐾', go:'🎁 ไปห้องของขวัญ', panel:'panel-gifts'},
  fr: {ico:'👋', go:'👥 ไปแผงเพื่อน',   panel:'panel-friends'},
};
/* ชื่อของขวัญ/คำทักของใบนั้น — แปลจาก id ฝั่งผู้รับเอง (ไม่ต้องฝากข้อความยาวมากับใบแจ้งเตือน) */
function fntGiftName(n){
  return giftItemName(n.t === 'gr' ? 'greet' : (n.r === 'collect' ? 'collect' : 'shop'), n.cm || '');
}
/* ข้อความรายงาน 1 บรรทัดของแจ้งเตือนใบหนึ่ง (ใช้ทั้งแถบเด้งสดและกล่อง 🔔 ให้ตรงกันที่เดียว) */
function feedNotifText(n){
  const who = n.n || 'เพื่อน';
  const cut = String(n.cm || '').slice(0,40);
  if(n.t === 'gf') return `🎁 ${who} ส่ง${fntGiftName(n)}มาให้คุณ`;
  if(n.t === 'gr') return `🐾 ${who} ทักทายน้องของคุณ: "${fntGiftName(n)}"`;
  if(n.t === 'fr') return `👋 ${who} ส่งคำขอเป็นเพื่อนมาหาคุณ`;
  if(n.t === 'rx'){ const r = feedRx(n.r); return `${r.e} ${who} กด ${r.en} (${r.th}) ให้โพสต์ของคุณ`; }
  if(n.t === 'rp') return `↩ ${who} ตอบกลับคอมเมนต์ของคุณ: "${cut}"`;
  if(n.t === 'cl') return `💙 ${who} ถูกใจคอมเมนต์ของคุณ: "${cut}"`;
  return `💬 ${who} คอมเมนต์โพสต์ของคุณ: "${cut}"`;
}
/* 🔗 รอบ 974 (ผู้ใช้สั่ง): "ไปยังต้นเรื่อง" ของแจ้งเตือนใบนั้น
   - โพสต์ยังอยู่ในวงหมุนล็อบบี้ → เลื่อนเด็คไปหยุดที่โพสต์นั้นด้วย (ปิดแผ่นคอมเมนต์แล้วเห็นต้นเรื่องพอดี)
   - เปิดแผ่นคอมเมนต์ของโพสต์นั้น แล้ว "ไฮไลต์" ตัวที่เป็นต้นเรื่องจริง ๆ (คอมเมนต์ใบนั้น / ตัวโพสต์ถ้าเป็นการกดใจโพสต์)
   - โพสต์ถูกหมุนออกจากฟีดไปแล้ว → openFeedComments เดิมบอกผู้ใช้เองว่า "ไม่อยู่ในฟีดแล้ว" */
function feedNotifGo(n){
  if(!n) return;
  /* 🎁🐾👋 รอบ 983: ใบที่ไม่ได้มาจากโพสต์ → เปิดกล่องต้นทาง (ห้องของขวัญ / แผงเพื่อน) แทน */
  const j = FNT_JUMP[n.t];
  if(j){ if(typeof openPanel === 'function') openPanel(j.panel); return; }
  if(!n.pid) return;
  const el = document.getElementById('feed-list');
  if(el && el.classList.contains('feed-deck')){
    const feed = ((typeof Online !== 'undefined' && Online.gfeed) || []).slice(0, FEED_DECK_MAX);
    const i = feed.findIndex(x=>x.key === n.pid);
    if(i >= 0) feedDeckGo(el, i, true);
  }
  openFeedComments(n.pid, n.cid || FCM_FOCUS_POST);
}
/* เรียกจาก online.js ทุกครั้งที่มีแจ้งเตือนใหม่เข้ามาสด */
function feedNotifArrived(n){
  renderFeedBell();
  /* 🔗 รอบ 974: เดิมเป็น toast ข้อความเปล่า อ่านแล้วต้องไปหาโพสต์เอง → ตอนนี้มีปุ่มลิงก์ไปต้นเรื่องติดมาด้วย
     ไม่กดก็ได้ (หายเองใน 7 วิ) และยังย้อนดูได้ทีหลังที่กระดิ่ง 🔔 เสมอ */
  toastLink(feedNotifText(n), (FNT_JUMP[n.t] || {}).go || '🔗 ไปดูต้นเรื่อง', ()=>feedNotifGo(n), 7000);
  sfx.select();
}
function openFeedNotif(){
  sfx.select();
  const list = (typeof Online !== 'undefined' && Online.notif) || [];
  /* 🔔 รอบ 976: จำไว้ก่อนว่าใบไหน "ยังไม่ได้อ่าน" (จะได้ติดป้าย ใหม่ ให้เห็น) แล้วค่อยทำเครื่องหมายอ่านหมด
     — gnotifMarkSeen จดรหัสใบล่าสุดลง /gnotif/<uid>/seen ด้วย = ปิดเกมแล้วกลับมาเลขไม่เด้งซ้ำ */
  const fresh = list.map(n=>!n.rd);
  if(typeof gnotifMarkSeen === 'function') gnotifMarkSeen();
  else if(typeof Online !== 'undefined'){ Online.notifUnread = 0; }
  renderFeedBell();
  const old = (typeof Online !== 'undefined' && Online.gnotifOk === false);   // rules /gnotif ยังไม่ publish
  const ov = document.createElement('div');
  ov.className = 'fnt-overlay';
  ov.innerHTML = `<div class="fnt-box">
    <div class="fdb-head"><span>🔔 การแจ้งเตือน</span><button class="fdb-close" type="button">✕</button></div>
    ${list.length ? '<div class="fnt-hint">🔗 กดปุ่มท้ายแถวถ้าอยากเข้าไปดูต้นเรื่อง (โพสต์/คอมเมนต์ · ห้องของขวัญ 🎁 · แผงเพื่อน 👥) — ไม่กดก็ได้ รายการยังอยู่ที่นี่</div>' : ''}
    ${old ? `<div class="fnt-note">⚠️ ตอนนี้เก็บย้อนหลังไม่ได้ — ต้องอัปเดตกฎความปลอดภัยโซน <b>/gnotif</b> ก่อน
         จึงจะเห็นแจ้งเตือนเก่าหลังปิดเกม (ระหว่างนี้เห็นเฉพาะไลก์/คอมเมนต์ที่เกิดตอนเปิดเกมอยู่ —
         ของขวัญ 🎁 · ทักทายน้อง 🐾 · คำขอเป็นเพื่อน 👋 จะยังไม่มาขึ้นที่นี่เลย ต้องดูที่กล่องของมันเอง)</div>` : ''}
    <div class="fnt-list">${list.length ? list.map((n,i)=>{
      const r = n.t === 'rx' ? feedRx(n.r) : null;
      const j = FNT_JUMP[n.t];        // 🎁🐾👋 รอบ 983: ใบของขวัญ/ทักทายน้อง/คำขอเป็นเพื่อน (ไม่มีโพสต์ต้นเรื่อง)
      /* 🔗 รอบ 974: ทุกแถวมี "ลิงก์ไปต้นเรื่อง" เห็นชัดเป็นปุ่ม (เดิมกดแถวได้แต่ไม่มีอะไรบอกว่ากดได้)
         data-i = ที่นั่งในรายการ Online.notif → ใช้ทั้ง cid (คอมเมนต์ต้นเรื่อง) และ pid ได้ครบ */
      return `<div class="fnt-row${fresh[i] ? ' fnt-new' : ''}" data-i="${i}" data-pid="${escapeHTML(n.pid || '')}">
        <span class="fnt-ico">${j ? j.ico : (r ? r.e : (n.t === 'rp' ? '↩' : n.t === 'cl' ? '💙' : '💬'))}</span>
        <span class="fnt-tx">${fresh[i] ? '<i class="fnt-tag">ใหม่</i>' : ''}<b>${escapeHTML(n.n || 'เพื่อน')}</b> ${j
          ? (n.t === 'gf' ? `ส่ง <b>${escapeHTML(fntGiftName(n))}</b> มาให้คุณ`
           : n.t === 'gr' ? `ทักทายน้องของคุณ “${escapeHTML(fntGiftName(n))}”`
           : 'ส่งคำขอเป็นเพื่อนมาหาคุณ')
          : r
          ? `กด <i class="fp-en">${r.en}</i> (${r.th}) ให้โพสต์ของคุณ`
          : n.t === 'cl'
            ? `ถูกใจคอมเมนต์ของคุณ “${escapeHTML(String(n.cm || ''))}”`
            : `${n.t === 'rp' ? 'ตอบกลับคอมเมนต์ของคุณ' : 'คอมเมนต์'}ว่า “${escapeHTML(String(n.cm || ''))}”`}
          <small class="fnt-sub">${j ? '' : escapeHTML(String(n.tx || '').slice(0,50)) + ' · '}${feedAgo(n.ts)}</small>
          <button class="fnt-go" type="button" data-i="${i}">${j ? j.go : '🔗 ไปดูต้นเรื่อง'}</button></span>
      </div>`;
    }).join('') : `<div class="fdb-empty">ยังไม่มีการแจ้งเตือน 🔕<br>
      <small>เพื่อนกดถูกใจ/คอมเมนต์โพสต์ · ส่งของขวัญ 🎁 · ทักทายน้อง 🐾 · ขอเป็นเพื่อน 👋 จะมาขึ้นที่นี่<br>
      ${old ? '(ตอนนี้แจ้งเฉพาะช่วงที่เปิดเกมอยู่)' : 'เก็บย้อนหลังให้ด้วย — ปิดเกมไปแล้วกลับมาก็ยังอ่านได้'}</small></div>`}</div>
  </div>`;
  document.body.appendChild(ov);
  const close = ()=>ov.remove();
  const go = i=>{ close(); feedNotifGo(list[i]); };
  ov.addEventListener('click', e=>{ if(e.target === ov) close(); });
  ov.querySelector('.fdb-close').addEventListener('click', ()=>{ sfx.select(); close(); });
  ov.querySelectorAll('.fnt-go').forEach(b=>b.addEventListener('click', e=>{
    e.stopPropagation();                                  // กันซ้อนกับคลิกทั้งแถว (ไม่งั้นเด้ง 2 ครั้ง)
    go(+b.dataset.i);
  }));
  ov.querySelectorAll('.fnt-row').forEach(r=>r.addEventListener('click', ()=>go(+r.dataset.i)));
}

/* ---- 👍 ตัวเลือกรีแอ็กชัน (กดค้างที่ปุ่มถูกใจ) ---- */
let __rxLpT = 0, __rxLpFired = false;
function closeRxPicker(){
  const b = document.getElementById('fp-rxbox');
  if(b) b.remove();
}
function openRxPicker(btn, key){
  closeRxPicker();
  const box = document.createElement('div');
  box.id = 'fp-rxbox';
  box.className = 'fp-rxbox';
  box.innerHTML = FEED_REACTIONS.map(r=>
      `<button class="fp-rxb" type="button" data-rk="${r.k}"><span>${r.e}</span><i>${r.en}</i><u>${r.th}</u></button>`).join('')
    + `<button class="fp-rxb fp-rxb-off" type="button" data-rk="">✖<i>ถอน</i></button>`;
  document.body.appendChild(box);
  const r = btn.getBoundingClientRect(), w = box.offsetWidth;
  box.style.left = Math.max(6, Math.min(window.innerWidth - w - 6, r.left + r.width/2 - w/2)) + 'px';
  box.style.top  = Math.max(6, r.top - box.offsetHeight - 8) + 'px';
  box.querySelectorAll('.fp-rxb').forEach(b=>b.addEventListener('click', (e)=>{
    e.stopPropagation();
    closeRxPicker();
    feedPickRx(key, b.dataset.rk, btn);
  }));
  sfx.click ? sfx.click() : sfx.select();
}
/* คำอังกฤษลอยขึ้นตอนกด — ให้เด็กได้เห็นคำที่ตัวเองใช้ทุกครั้ง (จุดที่เป็น "ตัวเรา") */
function feedFlyWord(anchor, r){
  if(!anchor || !r) return;
  const rc = anchor.getBoundingClientRect();
  const fly = document.createElement('div');
  fly.className = 'fp-fly';
  fly.innerHTML = `${r.e} <b>${r.en}</b> <small>${r.th}</small>`;
  document.body.appendChild(fly);
  fly.style.left = Math.max(6, Math.min(window.innerWidth - fly.offsetWidth - 6, rc.left)) + 'px';
  fly.style.top  = (rc.top - 6) + 'px';
  setTimeout(()=>fly.remove(), 1300);
}
function feedPickRx(key, rk, anchor){
  const it = feedPostByKey(key);
  if(!it) return;
  if(!feedCanReact(it)){ sfx.wrong(); toast('กดถูกใจได้เฉพาะโพสต์ของเพื่อนเรานะ — ไปเพิ่มเพื่อนกันก่อน 👋'); return; }
  const next = (rk && rk === it.myRx) ? '' : rk;      // เลือกอันเดิมซ้ำ = ถอน
  if(next){ sfx.select(); feedFlyWord(anchor, feedRx(next)); }
  gfeedSetReaction(key, next).then(ok=>{
    if(!ok) toast('ส่งความรู้สึกไม่สำเร็จ ลองใหม่อีกทีนะ');
  });
}

/* ---- 💬 กล่องคอมเมนต์ (เปิดเป็นแผ่นเต็มจอ — การ์ดในวงหมุนเลยไม่ต้องมี scrollbar)
       รอบ 964: ตอบกลับใต้คอมเมนต์ได้ (nested 1 ชั้นแบบ Facebook/TikTok — ตอบใต้ตอบก็ยังอยู่สายเดียวกัน) ---- */
let __fcmKey = '', __fcmRep = null;   // __fcmRep = {cid: รหัสคอมเมนต์แม่, n: ชื่อคนที่กำลังตอบ}
let __fcmOpen = new Set();            // รอบ 965: รหัสคอมเมนต์แม่ที่ "ขยายดูการตอบกลับครบ" อยู่ (สายสั้น ไม่ต้องยุบ)
const FCM_REP_SHOW = 2;               // สายตอบกลับยาวกว่านี้ → ยุบไว้ก่อน ต้องกดขยาย
const FCM_FOCUS_POST = '@post';       // รอบ 974: ต้นเรื่องเป็น "ตัวโพสต์" (คนกดใจโพสต์) ไม่ใช่คอมเมนต์ใบไหน
let __fcmFocus = '';                  // รอบ 974: cid ที่ต้องเลื่อนไปหา+ไฮไลต์รอบหน้าที่วาด (ใช้ครั้งเดียวแล้วล้าง)
function openFeedComments(key, focusCid){
  const it = feedPostByKey(key);
  if(!it){ toast('โพสต์นี้ไม่อยู่ในฟีดแล้ว 😅 (อาจถูกหมุนออกจากฟีดแล้ว)'); return; }
  sfx.select();
  __fcmKey = key;
  __fcmRep = null;
  __fcmOpen = new Set();
  __fcmFocus = focusCid || '';
  /* 🔗 รอบ 974: ต้นเรื่องเป็น "การตอบกลับ" ที่อยู่ในสายที่ถูกยุบไว้ (รอบ 965) → กางสายนั้นให้ก่อน ไม่งั้นเลื่อนไปหาไม่เจอ */
  if(__fcmFocus && __fcmFocus !== FCM_FOCUS_POST){
    const c = it.comments.find(x=>x.id === __fcmFocus);
    if(c && c.p) __fcmOpen.add(c.p);
  }
  if(!document.getElementById('fcm-ov')){
    const ov = document.createElement('div');
    ov.id = 'fcm-ov';
    ov.className = 'fcm-overlay';
    document.body.appendChild(ov);
    ov.addEventListener('click', e=>{ if(e.target === ov) closeFeedComments(); });
  }
  renderFeedComments();
}
function closeFeedComments(){
  __fcmKey = '';
  __fcmRep = null;
  __fcmFocus = '';
  const ov = document.getElementById('fcm-ov');
  if(ov) ov.remove();
  __fdAt = Date.now();                                 // กลับเข้าวงหมุนโดยเริ่มนับ 10 วิใหม่
}
/* จัดคอมเมนต์เป็นต้นไม้ 1 ชั้น: คอมเมนต์แม่ + การตอบกลับใต้มัน (ตอบใต้ "การตอบกลับ" เกาะแม่ตัวเดิม เหมือน Facebook) */
function fcmRowHTML(c, can, isRep){
  const at = isRep ? (c.p || c.id) : c.id;           // ตอบกลับแล้วไปเกาะคอมเมนต์แม่เสมอ (ไม่ลึกเกิน 1 ชั้น)
  /* 💙 รอบ 966: ถูกใจรายคอมเมนต์ — เพื่อนกดได้ · คนนอกเห็นแต่จำนวน (อ่านฟีดได้แต่กดไม่ได้ ตามกติกาเด็ก)
     🆕 รอบ 970: แยกปุ่ม "ตัวเลข" ออกจากปุ่มหัวใจ (สลับไลก์) เป็นปุ่มของตัวเอง — กดตัวเลขเปิดรายชื่อคนถูกใจ
     กดหัวใจสลับไลก์ ไม่ชนกัน */
  const n = c.clN || 0;
  const like = can
    ? `<button class="fcm-like${c.clMe ? ' on' : ''}" type="button" data-cid="${escapeHTML(c.id)}"
        data-on="${c.clMe ? 1 : 0}" aria-label="${c.clMe ? 'เลิกถูกใจคอมเมนต์นี้' : 'ถูกใจคอมเมนต์นี้'}"
        >${c.clMe ? '💙' : '🤍'}</button>`
    : (n ? '<span class="fcm-likeic">💙</span>' : '');
  const cnt = n
    ? `<button class="fcm-cnt" type="button" data-cid="${escapeHTML(c.id)}"
        aria-label="ดูว่าใครถูกใจคอมเมนต์นี้">${n}</button>` : '';
  return `<div class="fcm-row${isRep ? ' fcm-rep' : ''}" data-cid="${escapeHTML(c.id)}">
    ${isRep ? '<span class="fcm-arrow">↳</span>' : ''}<b>${escapeHTML(c.n)}</b> ${escapeHTML(c.tx)}
    <small>${feedAgo(c.ts)}</small>
    ${like}${cnt}
    ${can ? `<button class="fcm-reply" type="button" data-cid="${escapeHTML(at)}"
        data-n="${escapeHTML(c.n)}">↩ ตอบกลับ</button>` : ''}
  </div>`;
}
/* 💙 รอบ 970: กล่องรายชื่อคนถูกใจคอมเมนต์ (เปิดจากปุ่มตัวเลข) — ชื่อจากข้อมูลที่มีในเครื่องอยู่แล้ว (uidDisplayName เดิม) */
function showCommentLikers(postId, cid){
  const it = feedPostByKey(postId);
  const c = it && it.comments.find(x=>x.id === cid);
  const uids = (c && c.clU) || [];
  sfx.select();
  document.querySelectorAll('.fcm-likers-overlay').forEach(o=>o.remove());
  const overlay = document.createElement('div');
  overlay.className = 'levelup-overlay fcm-likers-overlay';
  const me = onlineKey();
  const rows = uids.length
    ? uids.map(uid=>`<div class="fcm-liker-row">💙 ${escapeHTML(uid === me ? 'คุณ' : uidDisplayName(uid))}</div>`).join('')
    : `<div class="fcm-liker-row fcm-liker-none">ยังไม่มีใครถูกใจ</div>`;
  overlay.innerHTML = `<div class="levelup-box fcm-likers-box">
    <div class="bi-title">ถูกใจคอมเมนต์นี้ (${uids.length})</div>
    <div class="fcm-likers-list">${rows}</div>
    <button class="fcm-likers-ok">ปิด</button>
  </div>`;
  const close = ()=>overlay.remove();
  overlay.querySelector('.fcm-likers-ok').addEventListener('click', close);
  overlay.addEventListener('click', e=>{ if(e.target === overlay) close(); });
  document.body.appendChild(overlay);
}
function fcmTreeHTML(cms, can){
  const ids  = new Set(cms.map(c=>c.id));
  const kids = {}, tops = [];
  cms.forEach(c=>{                                    // p ชี้ไปคอมเมนต์ที่ถูกลบ/หลุดไปแล้ว = ถือเป็นคอมเมนต์ชั้นบน
    if(c.p && ids.has(c.p) && c.p !== c.id) (kids[c.p] = kids[c.p] || []).push(c);
    else tops.push(c);
  });
  /* 💙 รอบ 970: "ความคิดเห็นยอดนิยม" แบบ Facebook — คอมเมนต์ชั้นบนสุดถูกใจเยอะขึ้นก่อน (เท่ากัน = เก่าก่อน)
     การตอบกลับใต้แต่ละคอมเมนต์ (kids) ยังเรียงตามเวลาเดิม ไม่โดนสลับ */
  tops.sort((a,b)=>(b.clN||0) - (a.clN||0) || a.ts - b.ts);
  return tops.map(c=>{
    const rep = kids[c.id] || [];
    if(!rep.length) return `<div class="fcm-item">${fcmRowHTML(c, can, false)}</div>`;
    const open = __fcmOpen.has(c.id) || rep.length <= FCM_REP_SHOW;
    const shown = open ? rep : rep.slice(0, FCM_REP_SHOW);
    const hidden = rep.length - shown.length;
    /* รอบ 965: สายตอบกลับยาว > FCM_REP_SHOW → ยุบไว้ก่อน กดปุ่มถึงกางครบ (กันแผ่นคอมเมนต์ยาวจนหาไม่เจอ) */
    const toggle = hidden > 0
      ? `<button class="fcm-more" type="button" data-cid="${escapeHTML(c.id)}">▾ ดูการตอบกลับอีก ${hidden} รายการ</button>`
      : (open && rep.length > FCM_REP_SHOW
          ? `<button class="fcm-more" type="button" data-cid="${escapeHTML(c.id)}">▴ ย่อการตอบกลับ</button>` : '');
    return `<div class="fcm-item">${fcmRowHTML(c, can, false)}
      <div class="fcm-reps">${shown.map(r=>fcmRowHTML(r, can, true)).join('')}${toggle}</div></div>`;
  }).join('');
}
function renderFeedComments(){
  const ov = document.getElementById('fcm-ov');
  if(!ov || !__fcmKey) return;
  const it = feedPostByKey(__fcmKey);
  if(!it){ closeFeedComments(); return; }
  const can = feedCanReact(it);
  const draft = ov.querySelector('.fcm-input');
  const keep  = draft ? draft.value : '';
  /* รอบ 966: จำตำแหน่งเลื่อนไว้ — กดถูกใจคอมเมนต์บน ๆ แล้ววาดใหม่ ต้องไม่กระโดดลงล่างสุด
     (ยังกระโดดลงล่างเหมือนเดิมถ้าผู้ใช้ดูอยู่ท้ายรายการ = มีคอมเมนต์ใหม่เข้ามา) */
  const oldList = ov.querySelector('.fcm-list');
  const oldTop  = oldList ? oldList.scrollTop : 0;
  const atEnd   = !oldList || (oldList.scrollHeight - oldTop - oldList.clientHeight) < 24;
  const rxRows = Object.keys(it.rx).map(uid=>{
    const r = feedRx(it.rx[uid]);
    return `<span class="fcm-rx">${r.e} <i class="fp-en">${r.en}</i></span>`;
  }).join('');
  ov.innerHTML = `<div class="fcm-box">
    <div class="fdb-head"><span>💬 คอมเมนต์</span><button class="fdb-close" type="button">✕</button></div>
    <div class="fcm-post">
      <div class="fp-head">
        <span class="fp-who">${(()=>{ const nb = fpNameBadgesHTML(it.n);
          return `${nameWithGrade(`<b class="fp-name">${escapeHTML(nb.name)}</b>`, gradeOf(it.u, it.g))}${nb.row}`; })()}</span>
        <small class="fp-when">${feedAgo(it.ts)}</small></div>
      <div class="fp-text">${escapeHTML(it.tx)}</div>
      ${rxRows ? `<div class="fcm-rxs">${rxRows}</div>` : ''}
    </div>
    <div class="fcm-list">${it.comments.length
      ? fcmTreeHTML(it.comments, can)
      : `<div class="fcm-none">ยังไม่มีคอมเมนต์ — เป็นคนแรกสิ! ✍️</div>`}</div>
    ${can ? `${__fcmRep ? `<div class="fcm-repbar">↩ กำลังตอบ <b>@${escapeHTML(__fcmRep.n)}</b>
        <button class="fcm-repx" type="button" aria-label="ยกเลิกการตอบกลับ">✕</button></div>` : ''}
      ${(typeof Online !== 'undefined' && Online.cmReplyRulesOld)
        ? `<div class="fcm-note">⚠️ ตอนนี้การตอบกลับจะขึ้นเป็น "คอมเมนต์ธรรมดา" ที่ขึ้นต้นด้วย ↪ @ชื่อ
             — ต้องอัปเดตกฎความปลอดภัยโซน /gfeed ก่อน ถึงจะซ้อนใต้คอมเมนต์ได้จริง</div>` : ''}
      ${(typeof Online !== 'undefined' && Online.cmLikeRulesOld)
        ? `<div class="fcm-note">⚠️ กดถูกใจรายคอมเมนต์ยังบันทึกไม่ได้ — ต้องอัปเดตกฎความปลอดภัยโซน /gfeed
             (เพิ่มโซน <b>cl</b> ใต้คอมเมนต์) ก่อนนะ · ถูกใจ "ทั้งโพสต์" ยังใช้ได้ปกติ</div>` : ''}
      <div class="fcm-quick">${FEED_QUICK_CM.map(q=>
        `<button class="fcm-q" type="button" data-en="${escapeHTML(q.en)}">${escapeHTML(q.en)}<i>${escapeHTML(q.th)}</i></button>`).join('')}</div>
      <div class="fcm-add"><input class="fcm-input" maxlength="120" placeholder="${__fcmRep
          ? `ตอบกลับ @${escapeHTML(__fcmRep.n)}…` : 'เขียนคอมเมนต์…'}" value="${escapeHTML(keep)}">
        <button class="fcm-send" type="button">ส่ง</button></div>`
      : `<div class="fcm-locked">💬 คอมเมนต์ได้เฉพาะเพื่อนของเจ้าของโพสต์เท่านั้น (เพื่อความปลอดภัยของเด็ก ๆ)</div>`}
  </div>`;
  ov.querySelector('.fdb-close').addEventListener('click', ()=>{ sfx.select(); closeFeedComments(); });
  const inp  = ov.querySelector('.fcm-input');
  const send = ()=>{
    if(!inp || !inp.value.trim()) return;
    const val = inp.value;
    const rep = __fcmRep;                              // ตอบกลับใคร (null = คอมเมนต์ใต้โพสต์ตามปกติ)
    inp.value = '';
    __fcmRep = null;
    gfeedAddComment(__fcmKey, val, rep && rep.cid, rep && rep.n).then(ok=>{
      if(ok) sfx.select();
      else { inp.value = val; __fcmRep = rep; toast('ส่งคอมเมนต์ไม่สำเร็จ — ต้องเป็นเพื่อนกับเจ้าของโพสต์ก่อนนะ'); }
      renderFeedComments();
    }).catch(msg=>{ inp.value = val; __fcmRep = rep;
      toast(typeof msg === 'string' ? msg : 'ส่งคอมเมนต์ไม่สำเร็จ ลองใหม่นะ'); });
  };
  if(inp){
    inp.addEventListener('keydown', e=>{ if(e.key === 'Enter'){ e.preventDefault(); send(); } });
    const s = ov.querySelector('.fcm-send');
    if(s) s.addEventListener('click', send);
  }
  /* ↩ ตอบกลับ: จำคอมเมนต์แม่ไว้ แล้ววาดแถบ "กำลังตอบ @ชื่อ" เหนือช่องพิมพ์ */
  ov.querySelectorAll('.fcm-reply').forEach(b=>b.addEventListener('click', ()=>{
    __fcmRep = {cid: b.dataset.cid, n: b.dataset.n || 'เพื่อน'};
    sfx.select();
    renderFeedComments();
    const i2 = ov.querySelector('.fcm-input');
    if(i2) i2.focus();
  }));
  /* 💙 รอบ 966: ถูกใจรายคอมเมนต์ — เด้งสีทันที (optimistic) แล้วค่อยยืนยันกับ DB
     🆕 รอบ 970: ตัวเลขแยกเป็นปุ่ม .fcm-cnt ต่างหากแล้ว — ปุ่มนี้สลับแค่ไอคอนหัวใจ ตัวเลขรอ renderFeedComments() จริงมาอัปเดต */
  ov.querySelectorAll('.fcm-like').forEach(b=>b.addEventListener('click', ()=>{
    if(b.disabled) return;
    const on = b.dataset.on === '1';
    b.disabled = true;
    b.classList.toggle('on', !on);
    b.textContent = on ? '🤍' : '💙';
    sfx.click ? sfx.click() : sfx.select();
    gfeedToggleCommentLike(__fcmKey, b.dataset.cid, on).then(ok=>{
      /* ปุ่มนี้โผล่เฉพาะเพื่อนของเจ้าของโพสต์อยู่แล้ว → พังทีนี่คือ rules ยังไม่ publish เกือบทุกกรณี */
      if(!ok) toast('กดถูกใจคอมเมนต์ยังไม่ได้ 🔒 ต้องอัปเดตกฎความปลอดภัยโซน /gfeed ก่อนนะ');
      renderFeedComments();
    });
  }));
  ov.querySelectorAll('.fcm-cnt').forEach(b=>b.addEventListener('click', ()=>{
    showCommentLikers(__fcmKey, b.dataset.cid);
  }));
  const rx = ov.querySelector('.fcm-repx');
  if(rx) rx.addEventListener('click', ()=>{ __fcmRep = null; sfx.select(); renderFeedComments(); });
  ov.querySelectorAll('.fcm-more').forEach(b=>b.addEventListener('click', ()=>{
    const cid = b.dataset.cid;
    if(__fcmOpen.has(cid)) __fcmOpen.delete(cid); else __fcmOpen.add(cid);
    sfx.click ? sfx.click() : sfx.select();
    renderFeedComments();
  }));
  ov.querySelectorAll('.fcm-q').forEach(b=>b.addEventListener('click', ()=>{
    if(!inp) return;
    inp.value = (inp.value ? inp.value.trim() + ' ' : '') + b.dataset.en;
    inp.focus();
    sfx.click ? sfx.click() : sfx.select();
  }));
  const list = ov.querySelector('.fcm-list');
  if(list) list.scrollTop = atEnd ? list.scrollHeight : oldTop;
  /* 🔗 รอบ 974: มาจากลิงก์ "ไปดูต้นเรื่อง" → เลื่อนไปหยุดที่ต้นเรื่องนั้นแล้วกะพริบให้เห็นว่าอันไหน
     ใช้ครั้งเดียวแล้วล้างธง (renderFeedComments ถูกเรียกซ้ำทุกครั้งที่ข้อมูลขยับ — ไม่ล้างจะกระโดดกลับตลอด) */
  if(__fcmFocus){
    const target = __fcmFocus === FCM_FOCUS_POST
      ? ov.querySelector('.fcm-post')
      : [...ov.querySelectorAll('.fcm-row')].find(r=>r.dataset.cid === __fcmFocus);   // เทียบค่าตรง ๆ ไม่ต้อง escape รหัสคอมเมนต์
    __fcmFocus = '';
    if(target){
      /* ⚠️ ห้ามใช้ target.offsetTop คิดระยะ — offsetParent ของแถวคือกล่องแผ่น ไม่ใช่ .fcm-list (วัดได้ 295 ในลิสต์สูง 191)
         วัดจาก getBoundingClientRect เทียบกันตรง ๆ แล้วบวกเข้า scrollTop เดิม = ไม่ต้องรู้ว่าซ้อนกันกี่ชั้น */
      if(list && list.contains(target)){
        const lr = list.getBoundingClientRect(), tr = target.getBoundingClientRect();
        list.scrollTop += (tr.top - lr.top) - Math.max(0, (list.clientHeight - tr.height) / 2);
      }
      target.classList.add('fcm-hl');
      setTimeout(()=>target.classList.remove('fcm-hl'), 2600);
    }
  }
}

/* ---- ตัวรับเหตุการณ์กลางของการ์ดโพสต์ (ใช้ได้ทั้งวงหมุนล็อบบี้และหน้า Feed เต็ม) ---- */
function bindFeedPostEvents(){
  if(window.__fpBound) return;
  window.__fpBound = true;
  document.addEventListener('click', (e)=>{
    const t = e.target;
    if(!t || !t.closest) return;
    if(t.closest('#fp-rxbox')) return;
    closeRxPicker();
    const like = t.closest('.fp-like');
    if(like){
      if(__rxLpFired){ __rxLpFired = false; return; }   // เพิ่งกดค้างเลือกรีแอ็กชันไป = ไม่ต้องสลับซ้ำ
      /* ❤️ กดไม่ได้เพราะไม่ใช่โพสต์ตัวเอง/เพื่อน — ต้องบอกเหตุผลบนจอเสมอ (กฎทองข้อ 1) เดิมปิดเงียบด้วย disabled ล้วน ๆ */
      if(like.classList.contains('fp-like-locked')){ sfx.wrong(); toast('👍 ถูกใจได้เฉพาะโพสต์ของตัวเองกับเพื่อนเท่านั้น — ส่งคำขอเป็นเพื่อนก่อนนะ'); return; }
      const it = feedPostByKey(like.dataset.key);
      feedPickRx(like.dataset.key, it && it.myRx ? it.myRx : 'like', like);
      return;
    }
    const cmt = t.closest('.fp-cmt');
    if(cmt){ openFeedComments(cmt.dataset.key); return; }
    /* 🎖️ รอบ 712: แตะใบประกาศในโพสต์ = เปิดใบใหญ่เต็มจอ (อ่านชื่อ/หัวข้อ/วันที่ได้ชัด) */
    const cert = t.closest('.cert-tap');
    if(cert){
      const c = (typeof certFromPost === 'function') ? certFromPost(feedPostByKey(cert.dataset.key)) : null;
      if(c) openCertBig(c);
      return;
    }
    const nm = t.closest('.fp-name');
    if(nm){
      const p = nm.closest('.fpost');
      if(p){ sfx.select(); showPlayerCard(p.dataset.fid, p.dataset.n, p.dataset.g || ''); }
    }
  });
  const lpEnd = ()=>clearTimeout(__rxLpT);
  document.addEventListener('pointerdown', (e)=>{
    const b = e.target.closest && e.target.closest('.fp-like');
    if(!b || b.classList.contains('fp-like-locked')) return;
    __rxLpFired = false;
    clearTimeout(__rxLpT);
    __rxLpT = setTimeout(()=>{ __rxLpFired = true; openRxPicker(b, b.dataset.key); }, 420);
  });
  document.addEventListener('pointerup', lpEnd);
  document.addEventListener('pointercancel', lpEnd);
  document.addEventListener('scroll', lpEnd, true);
  document.addEventListener('contextmenu', (e)=>{ if(e.target.closest && e.target.closest('.fp-like')) e.preventDefault(); });
}
bindFeedPostEvents();

/* ============================================================
   🌍 รอบ 639: หน้า Feed เต็มจอ — ทุกคน (ไม่ใช่แค่ follow) + ไลก์/คอมเมนต์
   รอบ 701: การ์ดโพสต์ใช้ fpostHTML ชุดเดียวกับวงหมุนล็อบบี้ (กดค้าง = รีแอ็กชันด้วย)
   ส่วน "ใครออนไลน์" ผู้ใช้สั่ง 29 ก.ค.: ให้ค่อย ๆ เลื่อนขึ้นเองเหมือนฟีดเพื่อนแบบเดิม
   (initSideScroll — แตะ = หยุดอ่านเอง) · watcher /gfeed เปิดค้างอยู่แล้วตั้งแต่ login
   ============================================================ */
function openFeedBoard(){
  sfx.select();
  if(typeof Online === 'undefined' || !Online.ready){ toast('ต้องต่ออินเทอร์เน็ตก่อนถึงจะดู Feed ได้นะ 📡'); return; }
  const overlay = document.createElement('div');
  overlay.className = 'fdb-overlay';
  overlay.innerHTML = `<div class="fdb-box">
    <div class="fdb-head"><span>📰 Feed ทุกคน</span><button class="fdb-close" type="button">✕</button></div>
    <div class="fdb-live" id="fdb-live"></div>
    <div class="fdb-list" id="fdb-list"><div class="fdb-empty">กำลังโหลด… 📰</div></div>
  </div>`;
  document.body.appendChild(overlay);
  const close = ()=>{ overlay.remove(); };   // รอบ 701: ไม่ stop watcher แล้ว (ล็อบบี้ใช้ต่อ)
  overlay.addEventListener('click', e=>{ if(e.target === overlay) close(); });
  overlay.querySelector('.fdb-close').addEventListener('click', ()=>{ sfx.select(); close(); });
  renderFeedBoardLive();
  gfeedWatchStart();
  renderFeedBoard();
}

/* ส่วนบน: ใครออนไลน์ทำอะไรอยู่ตอนนี้ — เพื่อนก่อนเสมอ แล้วค่อยคนอื่น
   (Online.friends = ทุกคนที่ออนไลน์จริง ไม่ใช่แค่เพื่อนของเรา — presence /presence เดิมอ่านสาธารณะอยู่แล้ว) */
function renderFeedBoardLive(){
  const el = document.getElementById('fdb-live');
  if(!el || typeof Online === 'undefined') return;
  const fset = new Set((Online.myFriends || []).map(f=>f.uid));
  const meG = state.student ? (state.student.grade || '') : '';
  const meRow = `<div class="fdb-live-row fdb-live-me"><span class="fdb-dot"></span>
      ${nameWithGrade(`<b>⭐ ${escapeHTML(state.profileName || (typeof selfTag === 'function' ? selfTag() : 'เรา'))}</b>`, meG)}
      ${idTag(onlineKey())} · กำลังเล่นอยู่ตอนนี้</div>`;
  const list = (Online.friends || []).slice().sort((a,b)=>(fset.has(a.id)?0:1) - (fset.has(b.id)?0:1));
  const rows = list.map(f=>`<div class="fdb-live-row${fset.has(f.id) ? ' fdb-fr' : ''}">
      <span class="fdb-dot"></span>${nameWithGrade(`<b>${escapeHTML(f.n)}</b>`, gradeOf(f.id, f.g))} ${idTag(f.id)} · ${escapeHTML(f.act)}</div>`).join('');
  el.innerHTML = `<div class="fdb-live-title">🟢 ใครออนไลน์ทำอะไรอยู่ตอนนี้</div>
    <div class="fdb-live-rows" id="fdb-live-rows">${meRow}${rows}</div>`;
  initSideScroll(document.getElementById('fdb-live-rows'));   // รอบ 701: เลื่อนขึ้นช้า ๆ วนเอง (แตะ = หยุด)
}

/* ส่วนล่าง: โพสต์กิจกรรมทุกคน (Online.gfeed เรียงเพื่อนก่อนแล้วจาก gfeedRebuild ใน online.js)
   คลิกปุ่มถูกใจ/คอมเมนต์/ชื่อ = ตัวรับเหตุการณ์กลาง bindFeedPostEvents (delegation ทั้งเอกสาร) */
function renderFeedBoard(){
  const el = document.getElementById('fdb-list');
  if(!el) return;
  const feed = (typeof Online !== 'undefined' && Online.gfeed) ? Online.gfeed : [];
  if(!feed.length){
    el.innerHTML = `<div class="fdb-empty">ยังไม่มีกิจกรรมให้อ่านตอนนี้ 😴<br>
      <small>เล่นเกม/ทำภารกิจแล้วเปิดเผยไว้ในตั้งค่า ⚙️ กิจกรรมของทุกคนจะมาโชว์ที่นี่</small></div>`;
    return;
  }
  el.innerHTML = feed.map(it=>fpostHTML(it, {page:true})).join('');
}

/* 📐 รอบ 160: จัดขอบซ้ายแท็บสัตว์ให้ตรงแนวขอบซ้ายของ rank chip บน header
   (แท็บกับ chip อยู่คนละ container — คำนวณจาก rect จริง หารด้วย scale เผื่อเพจถูกย่อ)
   เรียกท้าย renderDashboard + ตอน resize */
/* 📐 รอบ 613 (ผู้ใช้สั่ง 27 ก.ค. 2026): "ทั้ง 3 แถวห้ามล้ำเส้นแดง" —
   เส้นแดงที่ผู้ใช้ขีด = ขอบซ้ายของเวทีน้อง (.stage-hero) · ทุกแถวขวามือ (เหรียญ/NEW/แท็บสัตว์)
   ต้องเริ่มที่แนวเดียวกันนี้พอดี และกว้างไม่เกินเวที · วัดจาก rect จริงเสมอ (กฎทองข้อ 3)
   เดิมแท็บสัตว์ยึดขอบป้ายชื่อบนหัว (รอบ 160/254) จึงยื่นล้ำมาทับคอลัมน์ซ้ายของการ์ด */
function stageColLeft(){
  const stage = document.querySelector('.lobby-stage');
  const hero  = document.querySelector('.stage-hero');
  if(!stage || !hero || !stage.offsetWidth) return null;
  const s = stage.getBoundingClientRect(), h = hero.getBoundingClientRect();
  if(!s.width || !h.width) return null;
  const scale = s.width / stage.offsetWidth;   // เพจโดนย่อ (transform) → แปลงกลับเป็น layout px
  return {left:Math.max(0,(h.left - s.left)/scale), width:h.width/scale, scale, s, h};
}
function alignPetTabs(){
  const tabs = document.getElementById('pet-tabs');
  const c = stageColLeft();
  if(!tabs || !c || tabs.style.display === 'none') return;
  tabs.style.setProperty('--tabs-left', c.left + 'px');
  tabs.style.setProperty('--tabs-w', c.width + 'px');
}
/* 🪙 รอบ 695 (ผู้ใช้สั่ง 29 ก.ค. 2026): เลิกชิดซ้ายกับเส้นแดงแล้ว — ผู้ใช้ขอให้กล่องเหรียญ+ระดับชั้น
   "อยู่กึ่งกลาง" แถวบนแทน → ปล่อย .top-flex/.top-flex2 ใช้ flex:1 เท่ากันตาม CSS ปกติ (ไม่ต้องคำนวณ JS)
   ตัวคั่นสองข้างเท่ากัน = กล่องลอยกลางพื้นที่ว่างระหว่างการ์ดประจำตัวกับปุ่มไอคอนเองโดยอัตโนมัติ */
/* ⬅ กล่องฟีดเพื่อน: อยู่กึ่งกลางระหว่างขอบรางเมนู (ปุ่มแนวตั้งซ้ายสุด) กับขอบซ้ายเวทีน้อง (เส้นแดงเดิม)
   (ผู้ใช้ขีดเส้นแดง 2 เส้นในภาพ — เดิมกล่องชิดเวทีพอดี ไม่มีช่องว่างฝั่งขวาเลย ขยับเข้าซ้ายอีกนิดให้เท่ากันสองฝั่ง) */
function alignFeedPlate(){
  const rail  = document.querySelector('.rail-wrap');
  const plate = document.querySelector('.stage-plate.feed-plate');
  const c = stageColLeft();
  if(!rail || !plate || !c) return;
  const railRight  = rail.getBoundingClientRect().right;
  const plateLeft0 = c.s.left;   // ขอบซ้ายเดิมของ .stage-left/.lobby-stage (ก่อนขยับ) = ขอบขวาเวทีคือขอบขวาเดิม
  const shift = (railRight - plateLeft0) / (2 * c.scale);   // ลบ = ขยับซ้าย
  plate.style.transform = shift ? `translateX(${shift}px)` : '';
}
/* 🪪 แผงผู้เล่น (วันที่/rank) — ยืดขอบขวาให้ตรงขอบขวาใหม่ของกล่อง Global Feed พอดี (ผู้ใช้ขอ) */
/* 📐 รอบ 971 (ผู้ใช้: "กล่องผู้เล่นสั้นกว่าแนวกล่องฟีด"): ย้ายจุดตั้งความกว้างจาก .profile-plate (ป้ายชื่อข้างใน)
   มาไว้ที่ ".id-card" (กล่องสีฟ้าที่มองเห็นจริง) — ต้นตอเดิม: .id-card เป็น flex-shrink:1 พอแถวบนแน่น
   (ตัวเลขเหรียญยาว เช่น ออนไลน์+คอมโผล่ครบ) การ์ดโดนบีบ ป้ายชื่อที่ตั้งความกว้างไว้หดตามไปด้วย
   ขอบขวาเลยไม่เคยตรงกับกล่องฟีดจริงบนเครื่องผู้ใช้ · ตอนนี้ .id-card เป็น flex:0 0 auto (CSS ท้ายไฟล์)
   → ความกว้างที่วัดได้คงอยู่เสมอ ไม่ขึ้นกับความยาวตัวเลขในแถวเหรียญ */
function alignProfilePlate(){
  const idCard = document.querySelector('.id-card');
  const plate  = document.querySelector('.profile-plate');
  const feed   = document.querySelector('.stage-plate.feed-plate');
  const c = stageColLeft();
  if(!idCard || !plate || !feed || !c) return;
  plate.style.width = '';                                   // ป้ายชื่อยืดเองด้วย flex:1 ภายในการ์ด
  const cLeft  = idCard.getBoundingClientRect().left;        // ขอบซ้ายการ์ดไม่ขึ้นกับความกว้างตัวเอง (ชิ้นแรกของแถว)
  const fRight = feed.getBoundingClientRect().right;
  idCard.style.width = Math.max(0, (fRight - cLeft) / c.scale) + 'px';   // box-sizing:border-box → รวมขอบ/padding แล้ว
}
/* 🪙 รอบ 971 (ผู้ใช้สั่ง 3 ส.ค. 2026): แถวเหรียญ+วันนี้+ออนไลน์+คอม ย้ายมาอยู่ "เลนเดียวกับกล่องแนะนำคำศัพท์"
   เลน = #newword-banner ซึ่งกว้างเท่าเวทีน้องพอดีตั้งแต่รอบ 702 → ยึดแกนกลางเลนเป็นหลัก
   ① ตัวเลขยาวจนล้นเลน (เหรียญ 6 หลัก + ออนไลน์ + คอมครบ) → ย่อ font/padding ทั้งแถวพร้อมกันด้วย --coin-k
      จนพอดีเลน = ขอบซ้าย/ขวาตรงกับกล่องคำศัพท์เป๊ะ (ไม่ตัด/ไม่ซ่อนตัวเลขทิ้ง)
   ② ตัวเลขสั้น (จอกว้าง) → คงขนาดกล่องเดิม วางกึ่งกลางแกนเดียวกับกล่องคำศัพท์
      (เคยลองยืดกล่องเต็มเลนแล้วกระจายด้วย space-between — จอ 1600px ช่องว่างระหว่างตัวเลขห่างถึง 300px ดูหลุด)
   ⚠️ วัดความกว้างต้องให้ .coin-block เป็น flex:0 0 auto + min-width:max-content ก่อน ไม่งั้นแถวบนบีบกล่องตอนวัด */
const COIN_K_MIN = 0.72;   // ย่อได้ต่ำสุด 72% ของขนาดปกติ — ต่ำกว่านี้ตัวเลขเล็กจนเด็กอ่านไม่ออก
function alignCoinBlock(){
  const block = document.querySelector('.coin-block');
  const c = stageColLeft();
  if(!block || !c || !c.h.width) return;
  const lane = c.h.width / c.scale;              // = ความกว้างกล่องแนะนำคำศัพท์ (เลนเดียวกับเวทีน้อง)
  let k = 1;
  for(let pass = 0; pass < 3; pass++){           // ย่อแล้ววัดซ้ำ (ฟอนต์ย่อไม่เป็นเส้นตรงเป๊ะ ต้องไล่ 2-3 รอบ)
    block.style.setProperty('--coin-k', k.toFixed(3));
    const natural = block.getBoundingClientRect().width / c.scale;
    if(natural <= lane) break;
    const next = Math.max(COIN_K_MIN, k * (lane - 1) / natural);
    if(next >= k) break;                         // ย่อจนสุดเพดานแล้ว — ยอมให้ล้นเลยเลนดีกว่าตัวเลขเล็กจนอ่านไม่ออก
    k = next;
  }
  block.style.setProperty('--coin-k', k.toFixed(3));
  block.style.setProperty('--coin-ml', '0px');
  let ml = 0;
  const laneMid = c.h.left + c.h.width / 2;
  for(let pass = 0; pass < 2; pass++){            // เลื่อนให้แกนกลางกล่องตรงแกนกลางเลน (วัดซ้ำ 1 รอบ เผื่อปัดเศษ)
    const r = block.getBoundingClientRect();
    const d = (laneMid - (r.left + r.width / 2)) / c.scale;
    if(Math.abs(d) < 0.2) break;
    ml += d;
    block.style.setProperty('--coin-ml', ml + 'px');
  }
}
/* คอลัมน์ซ้ายของการ์ด (เหลือฟีดเพื่อนอย่างเดียวแล้ว) — ยืดขึ้นไปชนขอบบนเวที
   (ผู้ใช้สั่ง 27 ก.ค. 2026 "ยืดฟีดเพื่อนขึ้นไปให้แตะแนวเส้นเขียว" = แนวบนสุดของเวที) */
function alignStageLeft(){
  const stage = document.querySelector('.lobby-stage');
  const left  = document.querySelector('.stage-left');
  const card  = document.getElementById('pet-card');
  if(!stage || !left || !card || !stage.offsetWidth) return;
  const s = stage.getBoundingClientRect(), cd = card.getBoundingClientRect();
  const scale = s.width / stage.offsetWidth;
  if(!scale) return;
  left.style.marginTop = -Math.max(0, (cd.top - s.top)/scale) + 'px';
}
/* 🧭 รอบ 971: เปิด/ปิดโหมด "หัวล็อบบี้ตรงแนวกล่องล่าง" ที่เดียว — ต้องมีทั้งเวทีน้องและกล่องฟีดจริง
   (หน้าที่ยังไม่มีสัตว์เลี้ยง ไม่มี .stage-hero/.feed-plate ให้อ้างอิง → ถอดคลาส กลับไปลอยกึ่งกลางแบบรอบ 695) */
function laneModeOn(){
  const top = document.querySelector('.lobby-top');
  if(!top) return false;
  const on = !!stageColLeft() && !!document.querySelector('.stage-plate.feed-plate');
  top.classList.toggle('coin-laned', on);
  if(!on){                                          // ล้างค่าที่ตรึงไว้ ไม่ให้ค้างข้ามสถานะ
    const idCard = document.querySelector('.id-card'), block = document.querySelector('.coin-block');
    if(idCard) idCard.style.width = '';
    if(block) ['--coin-w','--coin-ml','--coin-k'].forEach(v=>block.style.removeProperty(v));
  }
  return on;
}
/* 📐 รอบ 613: จัดทั้ง 3 แถว + คอลัมน์ฟีดในชุดเดียว — เรียกที่เดียวจบ ไม่ต้องไล่เรียกทีละตัว */
function alignStageCols(){
  laneModeOn();   // 🧭 รอบ 971: ตั้งโหมดก่อนวัด — ตัวการ์ด/แถวเหรียญต้องหยุดหดก่อนถึงวัดได้ตรง
  alignPetTabs(); alignNewWord(); alignFeedPlate(); alignProfilePlate(); alignCoinBlock(); alignStageLeft();
}
/* ⚠️ ตอน resize ต้องรอ layout นิ่งก่อนค่อยวัด — วัดทันทีในตัว handler ได้ตำแหน่งเวทีของขนาดจอ "เดิม"
   (เจอจริงรอบ 613: ย่อจอแล้วทั้ง 3 แถวค้างที่เส้นเก่า) → เลื่อนไปวัดใน rAF ซ้อน 2 ชั้น */
let __alignRaf = 0;
window.addEventListener('resize', ()=>{
  if(__alignRaf) cancelAnimationFrame(__alignRaf);
  __alignRaf = requestAnimationFrame(()=>{ __alignRaf = requestAnimationFrame(alignStageCols); });
});
/* 🔭 กันเหนียวกว่า resize: เฝ้าขนาดเวทีตรง ๆ — เวทีขยับเมื่อไหร่ (ย่อจอ/หมุนจอ/คอลัมน์ขวาเปลี่ยน)
   ค่อยจัดแถวใหม่ ได้ค่าหลัง layout นิ่งเสมอ · ตัวจัดแถวไม่ไปเปลี่ยนขนาดเวทีกลับ จึงไม่วนลูป */
let __heroRO = null;
function watchStageCols(){
  const hero = document.querySelector('.stage-hero');
  if(!hero || typeof ResizeObserver === 'undefined') return;
  if(!__heroRO) __heroRO = new ResizeObserver(()=>alignStageCols());
  __heroRO.disconnect();
  __heroRO.observe(hero);
}

/* ============================================================
   📖 Dictionary ค้นหาคำศัพท์ (รอบ 254 ผู้ใช้สั่ง 16 ก.ค. 2026)
   ข้อมูล js/data/dict/dict_001..057.js — แถวละ 8 ช่อง:
   [คำ, ชนิดคำ, IPA, คำอ่านไทย, นิยามอังกฤษ, คำแปลไทย, ประโยคตัวอย่าง, แปลตัวอย่าง]
   โหลดขี้เกียจตอนค้นครั้งแรก (57 ไฟล์ ~1.7MB — ไม่ถ่วงตอนเปิดเกม) · ไฟล์หายข้ามได้ไม่ค้าง
   แสดงผล 1 คำ = 5 บรรทัด: หัวคำ(+ชนิด+IPA+คำอ่าน) / นิยาม / คำแปล / ตัวอย่าง / แปลตัวอย่าง
   ============================================================ */
window.DICT_FILES = window.DICT_FILES || [];
let __dictLastQ = '', __dictAll = null, __dictLoading = null;
let __dictTrail = [];   // รอบ 285: เส้นทางไล่ศัพท์ใน session นี้ (fine › good › ...) — แตะ crumb ย้อนกลับได้
/* รอบ 285: นับคำที่ค้นเจอวันนี้ (ไม่นับคำเดิมซ้ำ) → ยิง questEvent('dict') เข้าภารกิจรายวัน 📖 */
function dictRecordLookup(w){
  const d = todayStr();
  if(!state.dictDaily || state.dictDaily.date !== d) state.dictDaily = {date:d, n:0, w:[]};
  w = String(w).toLowerCase();
  if(state.dictDaily.w.includes(w)) return;
  state.dictDaily.w.push(w);
  if(state.dictDaily.w.length > 300) state.dictDaily.w.shift();   // กันเซฟบวม (n สะสมต่อได้)
  state.dictDaily.n++;
  saveState();
  if(typeof questEvent === 'function') questEvent('dict');
}
const DICT_FILE_COUNT = 57;
function loadDict(){
  if(__dictAll) return Promise.resolve(__dictAll);
  if(__dictLoading) return __dictLoading;
  __dictLoading = new Promise(res=>{
    let done = 0;
    const fin = ()=>{ if(++done < DICT_FILE_COUNT) return; __dictAll = [].concat(...DICT_FILES); res(__dictAll); };
    for(let i = 1; i <= DICT_FILE_COUNT; i++){
      const s = document.createElement('script');
      s.src = `js/data/dict/dict_${String(i).padStart(3,'0')}.js`;
      s.onload = fin; s.onerror = fin;
      document.head.appendChild(s);
    }
  });
  return __dictLoading;
}
function dictSearch(q){
  q = q.trim().toLowerCase();
  if(!q || !__dictAll) return [];
  const starts = [], has = [], thai = [];
  for(const r of __dictAll){
    const w = String(r[0]).toLowerCase();
    if(w.startsWith(q)) starts.push(r);
    else if(w.includes(q)) has.push(r);
    else if(String(r[5]||'').includes(q) || String(r[3]||'').includes(q)) thai.push(r);   // พิมพ์ไทยก็เจอ (คำแปล/คำอ่าน)
  }
  const cmp = (a,b)=>String(a[0]).localeCompare(String(b[0]));   // script โหลด async ลำดับไฟล์ไม่แน่นอน → เรียง ก-ฮ/a-z เอง
  return starts.sort(cmp).concat(has.sort(cmp), thai.sort(cmp)).slice(0, 40);
}
/* รอบ 281: ห่อคำอังกฤษในนิยาม/ตัวอย่างเป็น .di-w — แตะคำไหนค้นคำนั้นต่อทันที (ไล่ศัพท์ไม่ต้องพิมพ์)
   ทำงานบนข้อความที่ escape แล้ว: ข้าม entity อื่น (&amp; ฯลฯ) · &#39; (apostrophe) นับเป็นส่วนของคำ เช่น don&#39;t */
function dictTapWords(s){
  return s.replace(/&[a-zA-Z]+;|&#\d+;|[A-Za-z]+(?:(?:&#39;|-)[A-Za-z]+)*/g,
    m => m[0] === '&' ? m : `<span class="di-w">${m}</span>`);
}
function dictEntryHTML(r){
  const [w, pos, ipa, pron, def, th, ex, exTh] = r.map(x=>escapeHTML(x));
  return `<div class="dict-item">
    <div class="di-head"><b>${w}</b> <span class="di-pos">(${pos})</span> <span class="di-ipa">${ipa}</span> <span class="di-pron">${pron}</span>
      <button class="di-say" data-w="${w}" title="ฟังเสียง">🔊</button></div>
    <div class="di-def">${dictTapWords(def)}</div>
    <div class="di-th">${th}</div>
    <div class="di-ex">${dictTapWords(ex)}</div>
    <div class="di-exth">${exTh}</div>
  </div>`;
}
function openDictOverlay(q){
  let ov = document.getElementById('dict-overlay');
  if(!ov){
    ov = document.createElement('div');
    ov.id = 'dict-overlay'; ov.className = 'pl-overlay';
    ov.innerHTML = `<div class="dict-card">
      <button class="pl-close" id="dict-close">✕</button>
      <div class="dict-head">📖 พจนานุกรม <span class="dict-count" id="dict-count"></span><span class="dict-today" id="dict-today"></span></div>
      <div class="dict-box"><input id="dict-input-ov" type="search" placeholder="🔍 ค้นคำถัดไปต่อได้เลย" autocomplete="off"><button id="dict-go-ov" title="ค้นหา">🔍</button></div>
      <div class="dict-trail" id="dict-trail" style="display:none"></div>
      <div class="dict-list" id="dict-list"></div>
    </div>`;
    document.body.appendChild(ov);
    ov.addEventListener('click', (e)=>{ if(e.target === ov) ov.remove(); });
    ov.querySelector('#dict-close').addEventListener('click', ()=>ov.remove());
    ov.querySelector('#dict-list').addEventListener('click', (e)=>{
      const b = e.target.closest('.di-say');
      if(b && typeof speakWord === 'function'){ speakWord(b.dataset.w); return; }
      /* รอบ 281: แตะคำอังกฤษในผลลัพธ์ = ค้นคำนั้นต่อทันที (sync ช่อง lobby เหมือนค้นจากช่องบนแผง) */
      const wEl = e.target.closest('.di-w');
      if(wEl){
        const q2 = wEl.textContent.trim();
        if(!q2) return;
        __dictLastQ = q2; sfx.select();
        const li = document.getElementById('dict-input'); if(li) li.value = q2;
        openDictOverlay(q2);
      }
    });
    /* รอบ 279: ค้นคำถัดไปจากในแผงผลลัพธ์ได้เลย ไม่ต้องปิดก่อน · blur ยุบแป้นมือถือเหมือนช่องหลัก
       + sync ค่ากลับช่องค้นหาใน lobby (#dict-input) ให้ตรงกัน */
    const oIn = ov.querySelector('#dict-input-ov');
    const oGo = ()=>{
      const q2 = oIn.value.trim(); if(!q2) return;
      __dictLastQ = q2; sfx.select(); oIn.blur();
      const li = document.getElementById('dict-input'); if(li) li.value = q2;
      openDictOverlay(q2);
    };
    oIn.addEventListener('keydown', (e)=>{ if(e.key === 'Enter') oGo(); });
    ov.querySelector('#dict-go-ov').addEventListener('click', oGo);
    /* รอบ 285: แตะ crumb ในแถบเส้นทางไล่ศัพท์ = ย้อนกลับไปคำนั้น (ตัดหางเส้นทางใน openDictOverlay) */
    ov.querySelector('#dict-trail').addEventListener('click', (e)=>{
      const c = e.target.closest('.dt-c');
      if(!c || c.classList.contains('on')) return;
      const w = c.dataset.w;
      __dictLastQ = w; sfx.select();
      const li = document.getElementById('dict-input'); if(li) li.value = w;
      openDictOverlay(w);
    });
  }
  ov.querySelector('#dict-input-ov').value = q;
  /* รอบ 285: อัปเดตเส้นทางไล่ศัพท์ — เคยค้นคำนี้แล้ว = ย้อนกลับ ตัดหางทิ้ง · คำใหม่ = ต่อท้าย (เก็บ ≤20) */
  q = String(q).trim();
  const __ql = q.toLowerCase();
  let __ti = -1;
  for(let i = __dictTrail.length - 1; i >= 0; i--){ if(__dictTrail[i].toLowerCase() === __ql){ __ti = i; break; } }
  if(__ti >= 0) __dictTrail = __dictTrail.slice(0, __ti + 1);
  else { __dictTrail.push(q); if(__dictTrail.length > 20) __dictTrail.shift(); }
  const tr = ov.querySelector('#dict-trail');
  if(__dictTrail.length >= 2){
    tr.style.display = '';
    tr.innerHTML = __dictTrail.map((w,i)=>
      `<button class="dt-c ${i === __dictTrail.length-1 ? 'on' : ''}" data-w="${escapeHTML(w)}" type="button">${escapeHTML(w)}</button>`
    ).join('<span class="dt-sep">›</span>');
    tr.scrollLeft = tr.scrollWidth;   // เส้นทางยาว → เลื่อนให้เห็นคำล่าสุดเสมอ
  }else{ tr.style.display = 'none'; tr.innerHTML = ''; }
  const list = ov.querySelector('#dict-list'), cnt = ov.querySelector('#dict-count');
  cnt.textContent = `"${q}"`;
  list.innerHTML = `<div class="pl-loading">⏳ กำลังเปิดพจนานุกรม...</div>`;
  loadDict().then(()=>{
    if(!document.body.contains(ov)) return;   // ผู้ใช้ปิดไปก่อนโหลดเสร็จ
    const rs = dictSearch(q);
    cnt.textContent = `"${q}" · พบ ${fmtNum(rs.length)} คำ`;
    list.innerHTML = rs.length
      ? rs.map(dictEntryHTML).join('')
      : `<div class="pl-none">ไม่พบคำว่า "${escapeHTML(q)}" 😅<br><small>ลองสะกดใหม่ หรือพิมพ์คำแปลภาษาไทยก็ค้นได้นะ</small></div>`;
    list.scrollTop = 0;
    /* รอบ 285: เจอผล = นับสถิติวันนี้ (คำใหม่เท่านั้น) + อัปเดตชิป 📚 บนหัวแผง */
    if(rs.length) dictRecordLookup(q);
    const td = ov.querySelector('#dict-today');
    if(td) td.textContent = (state.dictDaily && state.dictDaily.date === todayStr() && state.dictDaily.n)
      ? `📚 วันนี้ ${fmtNum(state.dictDaily.n)} คำ` : '';
  });
}

function renderDashboard(){
  careTick();
  dailyTick();
  if(Array.isArray(state.pendingCut) && state.pendingCut.length) showCutNotice();
  applyNoAnim();
  updateBillBadges();
  renderRailWorlds();
  if(typeof bandLobbyTick === 'function') bandLobbyTick();   // รอบ 268: ป้ายคืบหน้าปุ่มสอบเลื่อนขั้น + ป้ายออฟไลน์
  const now = Date.now();

  /* ---- เหรียญ: สะสมทั้งหมด + วันนี้ ---- */
  document.getElementById('coin-count').textContent = fmtNum(state.coins);
  document.getElementById('coin-today').textContent = fmtNum(state.daily.coins);
  /* แถบโปรไฟล์ (รอบ 187 คุ้มครองเด็ก): ตัวละคร + ชื่อเล่น + ✏️ แก้ชื่อ + 🆔 รหัสประจำตัว (ไม่โชว์ชื่อจริง/ชั้นแล้ว)
     รอบ 274: รูป+ชื่อเป็น .pl-click → เปิดการ์ดโปรไฟล์ตัวเอง (showPlayerCard เดียวกับคลิกชื่อบนกระดาน) */
  const chip = document.getElementById('student-chip');
  const myUid = (typeof onlineKey === 'function') ? onlineKey() : '';
  const myPlName = (state.profileName || 'ผู้เล่น') + ((typeof badgeSuffix === 'function') ? badgeSuffix() : '');
  const myPlGrade = state.student ? (state.student.grade || '') : '';
  if(state.student){
    /* 🎩 รอบ 612: ในแถบบนไม่ต้องมีรูปเล็กซ้ำ (รูป passport ใบใหญ่อยู่ติดกันแล้ว) ·
       🆔 ห่อเป็นชิปของตัวเอง (.id-chip) แทนการต่อท้ายด้วย · ให้อ่านง่ายเป็นระเบียบ */
    chip.innerHTML = `<span class="pl-click" data-uid="${escapeHTML(myUid)}" data-n="${escapeHTML(myPlName)}" data-g="${escapeHTML(myPlGrade)}"><b>${escapeHTML(state.profileName || 'ผู้เล่น')}</b></span>`
      + ` <button class="chip-edit" id="btn-edit-name" title="เปลี่ยนชื่อในเกม">✏️</button>`
      + ` <span class="id-chip" title="รหัสประจำตัวของหนู — บอกเพื่อนเพื่อเพิ่มเป็นเพื่อนกันได้">${idTag(myUid)}</span>`;
    document.getElementById('btn-edit-name').addEventListener('click', authEditProfileName);
    bindPlayerClicks();
  }else chip.textContent = '';
  /* 🎖️ รอบ 643/652: ช่องระดับชั้น (`#grade-line` = `.coin-pill.grade-pill` ต่อท้ายในแถวเหรียญ
     รอบ 652 ย้ายกลับมารวมแถวเดียวกับเหรียญ/ออนไลน์ตามที่ผู้ใช้ขอ — เดิมรอบ 643 แยกไว้คนละบรรทัด)
     ข้อความ "ระดับชั้น" + สัญลักษณ์ · ยังไม่ลงทะเบียน/ไม่รู้ชั้น = ปล่อยว่าง (:empty ซ่อนตัวเอง) */
  /* 🔒 รอบ 647: ต่อท้ายด้วยปุ่มเปลี่ยนชั้น — ล็อกอยู่ = โชว์ "🔒 อีก N วัน" คาไว้บนแถบเลย
     (ห้ามปิดเงียบ ตามกฎทอง #1) · กติกา/กล่องเปลี่ยนชั้นอยู่ใน js/gradelock.js ที่เดียว */
  const gl = document.getElementById('grade-line');
  if(gl){
    const mk = gradeMark(myPlGrade);
    if(!mk) gl.innerHTML = '';
    else{
      const lk = (typeof gradeLocked === 'function') && gradeLocked();
      const gs = gradeSymbol(myPlGrade);   // 🏫 รอบ 696 (ผู้ใช้สั่ง): โชว์ชื่อกลุ่มชั้น (ประถม/มัธยม/ป.ตรี/สูงกว่าป.ตรี) ก่อนสัญลักษณ์
      gl.innerHTML = `<span class="cp-lb">ระดับชั้น</span><span class="gp-cat">${escapeHTML(gs.cat)}</span>${mk}`
        + (state.student ? `<button class="grade-edit${lk ? ' locked' : ''}" id="btn-grade-change"
             title="${escapeHTML(gradeLockNote())}">${lk ? `🔒 อีก ${gradeLockLeftDays()} วัน` : '✏️'}</button>` : '');
      const gb = document.getElementById('btn-grade-change');
      if(gb) gb.addEventListener('click', openGradeChange);
    }
  }
  /* รอบ 254: รูปตัวละคร blk ครึ่งตัวสไตล์ passport มุมซ้ายบนสุด (ตัวที่ผู้เล่นเลือกในตั้งค่า)
     📷 รอบ 709: อัปโหลดรูปตัวเองทับได้ (js/photo.js) + ปุ่มกล้องมุมขวาล่างแบบ Facebook
     lay = ลายเซ็นสิ่งที่วาดอยู่ (กันวาดซ้ำทุก render · รูปยาวมาก เทียบแค่ความยาว+หาง) */
  const pp = document.getElementById('pass-photo');
  if(pp){
    const myPh  = (typeof photoGet === 'function') ? photoGet() : '';
    const src   = myPh || `img/blocks/${lobbyBlk()}.png`;
    const canEd = !!state.student && typeof openPhotoMenu === 'function';
    const lay   = (myPh ? 'ph' + myPh.length + myPh.slice(-16) : src) + '|' + (canEd ? 'e' : '');
    if(pp.dataset.src !== lay){
      pp.dataset.src = lay;
      pp.innerHTML = `<img class="${myPh ? 'pp-photo' : ''}" src="${src}" alt="">`
        + (canEd ? `<button class="pp-cam" type="button" title="เปลี่ยนรูปโปรไฟล์">📷</button>` : '');
      const cam = pp.querySelector('.pp-cam');
      if(cam) cam.addEventListener('click', e=>{ e.stopPropagation(); sfx.select(); openPhotoMenu(); });
    }
    if(state.student){   // รอบ 274: คลิกรูป passport → การ์ดโปรไฟล์ตัวเองเช่นกัน
      pp.classList.add('pl-click');
      pp.dataset.uid = myUid; pp.dataset.n = myPlName; pp.dataset.g = myPlGrade;
    }
  }

  renderClock();
  renderRankCard();
  if(typeof checkCrown === 'function') checkCrown();          // 👑 เข็มลับ (ครอบผู้เล่นเดิมที่ครบ 4 สายอยู่แล้ว)
  if(typeof rolloverBadgeWeek === 'function') rolloverBadgeWeek();   // 📈 สแนปแต้มเข็มต้นสัปดาห์
  renderQuestCard();      // 🎯 Daily Quest (item 3)
  renderOnlineCard();
  renderLeaderboardCard();
  renderFriendPanel();
  renderGiftPanel();

  renderNewWord();   // 🆕 คำศัพท์ใหม่ 1 คำ/การ login (รอบ 116)

  /* ---- แท็บสลับสัตว์ (หลายตัว) ----
     รอบ 179: ปุ่มข้าวเย็น #btn-dinner ย้ายจาก header มาต่อท้ายปุ่ม ➕ (สเปกผู้ใช้ — header ใส่ปุ่มแชทแทน)
     element สร้างใหม่ทุก render → ผูก click ตรงนี้ · โชว์/ซ่อน+หน้า emoji คุมโดย renderDinnerChip เดิม */
  const tabs = document.getElementById('pet-tabs');
  if(state.pets.length || dinnerDue() || state.student){   // แถวแท็บน้อง (รอบ 321: ถอดกล่องค้นหาศัพท์ออกแล้ว)
    tabs.style.display = 'flex';
    /* 🐾 รอบ 613 (ผู้ใช้สั่ง): ปุ่ม "ข้อมูลน้อง" ย้ายจากคอลัมน์ซ้ายของการ์ด มาอยู่ "แถวเดียวกับชื่อสัตว์
       และอยู่หน้าสุด" ขนาดเท่าแท็บชื่อสัตว์ · คอลัมน์ซ้ายที่ว่างลง = ฟีดเพื่อนยืดขึ้นไปเต็มความสูงเวที */
    const ap0 = activePet();
    const infoAlert = ap0 ? (ap0.sick ? ' <span class="pib-alert">🤒</span>'
                          : (petHungry(ap0) ? ' <span class="pib-alert">😫</span>' : '')) : '';
    tabs.innerHTML = (ap0 ? `<button class="pet-tab info" id="btn-pet-info" title="ข้อมูลน้อง &amp; การดูแล">🐾 ข้อมูลน้อง${infoAlert}</button>` : '')
      + state.pets.map((p,i)=>{
      const stage = petStage(p);
      const face = stage === 'egg' ? (PETS[p.type].startKey==='egg'?'🥚':'🧺') : PETS[p.type][stage];
      const alert = p.sick ? ' 🤒' : (petHungry(p) ? ' 😫' : '');
      return `<button class="pet-tab ${i===state.active?'on':''}" data-i="${i}">${face} ${escapeHTML(p.name)}${alert}</button>`;
    }).join('')
      + (state.pets.length ? `<button class="pet-tab add" id="tab-addpet">➕</button>` : '')
      + `<button class="pet-tab dinner" id="btn-dinner" style="display:none">🍚</button>`;
      /* รอบ 321 (ผู้ใช้สั่ง 18 ก.ค. 2026): เอากล่องค้นหาพจนานุกรม (.dict-box) ออกจากหน้า Lobby
         — ฟังก์ชัน openDictOverlay() ยังอยู่ เรียกจากที่อื่นได้ (การ์ดคลังศัพท์ในหน้าเลือกหมวด) */
    tabs.querySelectorAll('.pet-tab[data-i]').forEach(b=>b.addEventListener('click', ()=>{
      const i = +b.dataset.i;
      // รอบ 189: คลิกแท็บน้องที่กำลังแสดงอยู่แล้ว = เปิดกล่องเปลี่ยนชื่อ · คลิกตัวอื่น = สลับไปแสดงตัวนั้น
      if(i === state.active){ sfx.select(); renamePet(state.pets[i]); return; }
      state.active = i; saveState(); sfx.select(); renderDashboard();
    }));
    const addBtn = document.getElementById('tab-addpet');
    if(addBtn) addBtn.addEventListener('click', ()=>{ renderPetShop(); showScreen('screen-select'); });
    document.getElementById('btn-dinner').addEventListener('click', dinnerClick);
    renderDinnerChip();
  }else{
    tabs.style.display = 'none'; tabs.innerHTML = '';
  }
  alignPetTabs();   // รอบ 160: ขอบซ้ายแท็บตรงแนว rank chip
  /* รอบ 326: จัดแบนเนอร์คำใหม่ให้ตรงกลางภาพ Rank — ต้องเรียก "หลังการ์ดน้องถูกสร้าง" เท่านั้น
     (renderNewWord ถูกเรียกก่อนหน้านี้ตอน .stage-hero ยังไม่มีในหน้า → วัดตำแหน่งไม่ได้) */
  alignNewWord();
  requestAnimationFrame(alignNewWord);   // เผื่อ layout ยังไม่นิ่งในเฟรมแรก (ฟอนต์/ภาพ rank เพิ่งโหลด)
  applyPatRemindGlow();                  // 🐾 รอบ 328: คงแสงชวนลูบไว้จนกว่าจะได้ลูบวันนี้

  /* ---- ปุ่มรักษาด่วนในรางซ้าย: กดได้เฉพาะตอนมีน้องป่วย + badge เลขบอกป่วยกี่ตัว ---- */
  const railCure = document.getElementById('btn-rail-cure');
  if(railCure){
    const sickCount = state.pets.filter(x=>x.sick).length;
    railCure.disabled = sickCount === 0;
    railCure.classList.toggle('cure-alert', sickCount > 0);
    const cb = document.getElementById('cure-badge');
    if(cb){
      cb.style.display = sickCount > 0 ? '' : 'none';
      cb.textContent = sickCount;
    }
  }

  /* ---- การ์ดสัตว์เลี้ยง ---- */
  const card = document.getElementById('pet-card');
  const p = activePet();
  if(!p){
    card.className = 'pet-card no-pet';   // ยังไม่มีสัตว์ → คงการ์ดกระจกแบบเดิม (มีสัตว์ = โชว์ตัวใหญ่กลางจอ)
    card.innerHTML = `
      <div class="pet-emoji" style="font-size:64px">🏪</div>
      <div class="pet-name">ยังไม่มีสัตว์เลี้ยง</div>
      <div class="stage-label">เล่นเกมจับคู่คำศัพท์ &amp; สอบให้ผ่าน เพื่อสะสมเหรียญ<br>
        แล้วไปรับน้องที่ร้านสัตว์เลี้ยงกัน! (🐶🐱 ${fmtNum(PETS.dog.price)} · 🐲 ${fmtNum(PETS.dragon.price)})</div>
      <div class="care-row"><button class="care-btn btn-feed" id="btn-goshop">🏪 ไปร้านสัตว์เลี้ยง</button></div>`;
    document.getElementById('btn-goshop').addEventListener('click', ()=>{ renderPetShop(); showScreen('screen-select'); });
    renderHomeCard();
    renderPhoneCard();
    renderComputerCard();
    renderRailWorlds();   // 🎫→💰 รอบ 823: การ์ดตั๋วแยก 8 ใบถูกถอดออก — ราคา/ล็อกอยู่ในปุ่มรางเมนูซ้ายแทน
    renderFarmCard();
    renderFactoryCard();
    renderMarketCard();
    renderShop();
    laneModeOn();   // 🧭 รอบ 971: ไม่มีเวที/กล่องฟีดให้อ้างอิงแล้ว → ถอดโหมดเลน + ล้างความกว้างที่ตรึงไว้
    return;
  }

  const conf = PETS[p.type];
  const stage = petStage(p);
  const startStageName = conf.startKey === 'egg'
    ? 'ร่างไข่ 🥚 (เล่นเกมเพื่อฟักไข่!)'
    : 'แรกเกิดหลับปุ๋ย 🧺 (เล่นเกมให้น้องโตจนลืมตา!)';
  const stageNames = {egg:startStageName, baby:'ร่างเด็ก 🍼', adult:'ร่างโตเต็มวัย 🌟'};

  /* ---- ความหิวระบบมื้อเย็น (ข้อ 2+3): หิว 18:00 วันละครั้ง กินสะสมให้เต็ม 100 ---- */
  let hungerUI = '';
  if(stage !== 'egg'){
    const slot = currentSlotStart(now);
    const hungry = petHungry(p);
    let hungerStatus, barPct, barCls = '';
    if(p.sick){
      /* 🚫 รอบ 952: บอกตรงนี้เลยว่า "ซื้อของกินไม่ได้" — ปุ่มถูกปิดต้องมีเหตุผลบนจอ (กฎทองข้อ 1)
         เขียนทับบรรทัดเดิม ไม่เพิ่มบรรทัดใหม่ (แผงนี้ยาวชิดขอบจอเตี้ยอยู่แล้ว) */
      hungerStatus = '🤒 ป่วยอยู่... <b>ยังให้อาหารไม่ได้</b> ต้องรักษาให้หายก่อนนะ (ยังออกไปซื้อของมาตุนไว้ได้)';
      barPct = 0;
    }else if(p.sleeping){
      hungerStatus = `😴 กำลังหลับปุ๋ย... ตื่นเองตอน ${String(WAKE_HOUR).padStart(2,'0')}:00 น.`;
      barPct = petHungry(p) ? Math.min(100, p.fullness||0) : 100;
    }else if(hungry){
      const msLeft = Math.max(0, HUNGRY_SICK_MS - (now - slot));
      /* 🩺 รอบ 1034: มื้อนี้ป่วยเพราะหิว+รักษาหายไปแล้ว → ไม่ป่วยซ้ำอีก แต่ยังต้องป้อนข้าว (ห้ามขู่ผิด) */
      hungerStatus = (p.hungerSickSlot === slot)
        ? `🍽️ ยังไม่ได้กินมื้อนี้เลย! ความอิ่ม <b>${Math.min(100, p.fullness||0)}/${MEAL_FULL}</b> — ป้อนให้เต็มหลอดนะ (มื้อนี้รักษาแล้ว ไม่ป่วยซ้ำ)`
        : `😫 หิวข้าวเย็นแล้ว! ความอิ่ม <b>${Math.min(100, p.fullness||0)}/${MEAL_FULL}</b> — กินให้เต็มหลอดภายใน <b>${fmtMins(msLeft)}</b> ไม่งั้นน้องจะป่วยนะ`;
      barPct = Math.min(100, p.fullness||0); barCls = 'hungry';
    }else{
      const covered = p.fedUpTo >= nextSlotStart(now) - 1;   // feast ครอบมื้อพรุ่งนี้แล้ว
      const nextMeal = p.fedUpTo > slot ? nextSlotStart(now) + SLOT_MS : nextSlotStart(now);
      hungerStatus = covered
        ? `🍱 อิ่มพิเศษ! ตุนข้ามมื้อพรุ่งนี้ได้เลย มื้อต่อไป: ${mealLabel(nextMeal)}`
        : `😋 อิ่มมีความสุข · มื้อเย็นถัดไป: ${mealLabel(nextMeal)}`;
      barPct = 100; if(covered) barCls = 'buffed';
    }
    const sickCauseText = p.sickCause === 'heat'
      ? 'เพราะอากาศร้อนเกินไป (หาที่พักติดแอร์จะช่วยได้)'
      : p.sickCause === 'thirst'
        ? 'เพราะบ้านถูกตัดน้ำ ไม่มีน้ำกิน-อาบ (จ่ายค่าน้ำค้างให้น้ำกลับมานะ)'
        : p.sickCause === 'rain'
          ? 'เพราะโดนฝนเปียกทั้งตัว ไม่มีที่หลบฝนสภาพดี (หาที่พักให้น้องนะ)'
          : p.sickCause === 'sleep'
            ? `เพราะนอนดึกเกินไป ไม่ได้เข้านอนก่อน ${SLEEP_SICK_HOUR}:00 น. (พาเข้านอนได้ตั้งแต่ ${SLEEP_FROM_HOUR}:00 น. ทุกคืนนะ)`
            : p.sickCause === 'toxin'
              ? 'เพราะพิษจากอาหารสะสมเต็มหลอด (อาหารคนบางอย่างเป็นโทษกับสัตว์นะ — หมอจะขับพิษให้ตอนรักษา)'
              : 'เพราะหิวนานเกินไป';

    /* ---- ความร้อนสะสม (ป่วยทุก 6 ชม. ถ้าไม่มีที่พักติดแอร์ — มังกรไม่ป่วย) ---- */
    let heatUI;
    if(p.type === 'dragon'){
      heatUI = `<div class="heat-text safe">🔥 มังกรเกิดจากไฟ ทนร้อนได้สบาย ไม่ป่วยจากอากาศร้อน</div>`;
    }else if(heatProtected()){
      heatUI = `<div class="heat-text safe">❄️ อยู่ในที่พักติดแอร์ เย็นสบาย ไม่ร้อนเลย</div>`;
    }else{
      const pct = heatPct(p);
      const msLeft = p.heatFrom != null ? Math.max(0, HEAT_SICK_MS - (now - p.heatFrom)) : HEAT_SICK_MS;
      heatUI = `
        <div class="level-row">
          <span class="level-badge" style="background:#e05b3a">🌡️ ร้อน</span>
          <div class="heat-bar"><div class="heat-fill" style="width:${pct}%"></div></div>
        </div>
        <div class="heat-text">🥵 ความร้อนสะสม ${Math.round(pct)}% — ถ้าเต็มน้องจะป่วย (อีก ${fmtMins(msLeft)})<br>
          <small>${state.powerCut && (state.home === 'castle' || (state.home === 'medium' && state.ac))
            ? '🔌 ไฟถูกตัด แอร์เลยใช้ไม่ได้ — รีบจ่ายค่าไฟค้างให้ไฟกลับมานะ'
            : 'หาที่พักที่มีแอร์ให้น้องจะไม่ร้อนเลยนะ'}</small></div>`;
    }

    /* ---- ขาดน้ำสะสม (เฉพาะตอนบ้านถูกตัดน้ำ — ป่วยทุก 6 ชม. โดนทุกชนิด) ---- */
    let thirstUI = '';
    if(state.waterCut){
      const tPct = p.thirstFrom != null ? Math.min(100, (now - p.thirstFrom)/THIRST_SICK_MS*100) : 0;
      const tLeft = p.thirstFrom != null ? Math.max(0, THIRST_SICK_MS - (now - p.thirstFrom)) : THIRST_SICK_MS;
      thirstUI = `
        <div class="level-row">
          <span class="level-badge" style="background:#3a7bd5">🚱 ขาดน้ำ</span>
          <div class="heat-bar"><div class="heat-fill thirst-fill" style="width:${tPct}%"></div></div>
        </div>
        <div class="heat-text thirst-text">🚱 ขาดน้ำสะสม ${Math.round(tPct)}% — ถ้าเต็มน้องจะป่วย (อีก ${fmtMins(tLeft)})<br>
          <small>บ้านถูกตัดน้ำอยู่ — จ่ายค่าน้ำค้างให้น้ำกลับมานะ</small></div>`;
    }

    /* ---- พิษสะสมจากอาหารโทษ (ข้อ 5.1): ไม่ลดเอง เต็ม 100 → ป่วยทันที · ขับพิษ 1,000 ---- */
    let toxinUI = '';
    if((p.toxin||0) > 0){
      toxinUI = `
        <div class="level-row">
          <span class="level-badge" style="background:#7a3ab0">☠️ พิษ</span>
          <div class="heat-bar"><div class="heat-fill toxin-fill" style="width:${p.toxin}%"></div></div>
        </div>
        <div class="heat-text toxin-text">☠️ พิษสะสม ${p.toxin}/${TOXIN_FULL} — เต็มหลอดน้องจะป่วยทันที<br>
          <small>พิษจากอาหารคนที่เป็นโทษ ไม่ลดเอง</small>
          ${!p.sick ? `<button class="detox-btn" id="btn-detox">🧪 ขับพิษ 🪙${fmtNum(DETOX_COST)}</button>` : ''}</div>`;
    }

    /* ---- รูปร่างตามคุณภาพการกิน (ข้อ 5.2): ล่ำ=โบนัส EXP · อ้วน/ผอมโซ=ชวนกลับมากินดี ---- */
    let shapeUI = '';
    if(p.shape && p.shape !== 'normal'){
      const su = SHAPE_UI[p.shape];
      shapeUI = `<div class="heat-text shape-text shape-${p.shape}">${su.icon} <b>${su.name}</b> — ${su.tip}</div>`;
    }else if((p.cleanMeals||0) > 0){
      shapeUI = `<div class="heat-text shape-text shape-progress">💪 กินดีต่อเนื่อง ${p.cleanMeals}/${SHAPE_CLEAN_MEALS} มื้อ — ครบแล้ว${escapeHTML(p.name)}จะล่ำกำยำ ได้โบนัส EXP!</div>`;
    }

    const pantryShelf = (typeof PET_PANTRY_SHELVES !== 'undefined' && state.petPantry)
      ? PET_PANTRY_SHELVES.find(x=>x.id===state.petPantry.shelfId) : null;
    const pantryTotal = state.petPantry && state.petPantry.stock
      ? Object.values(state.petPantry.stock).reduce((sum,n)=>sum+Math.max(0,Number(n)||0),0) : 0;
    const pantryLabel = pantryShelf ? `${pantryTotal}/${pantryShelf.capacity} ช่อง` : 'ยังไม่มีชั้น';

    hungerUI = `
      <div class="level-row">
        <span class="level-badge" style="background:var(--orange-d)">🍖 อิ่ม</span>
        <div class="hunger-bar"><div class="hunger-fill ${barCls}" style="width:${barPct}%"></div></div>
      </div>
      <div class="hunger-text">${hungerStatus}</div>
      ${heatUI}
      ${thirstUI}
      ${toxinUI}
      ${shapeUI}
      ${p.sick ? `<div class="sick-banner">🤒 <b>${escapeHTML(p.name)}ป่วยแล้ว!</b> ${sickCauseText}<br>ตอนป่วยจะไม่ได้ EXP และใช้ความสามารถพิเศษไม่ได้<br>พาไปหาหมอเพื่อรักษาให้หายก่อนนะ</div>` : ''}
      ${sleepHintHTML(p, now)}
      <div class="care-row">
        <button class="care-btn btn-feed" id="btn-feed" ${(p.sick || p.sleeping)?'disabled':''}>🍽️ ให้อาหาร</button>
        ${sleepBtnHTML(p, now)}
        ${p.sick ? `<button class="care-btn btn-cure" id="btn-cure">💊 รักษา 🪙${fmtNum(CURE_COST)}</button>` : ''}
      </div>
      <div class="care-row pantry-main-row">
        <button class="care-btn btn-pantry" id="btn-pi-pantry">🗄️ ชั้นเก็บอาหาร <small>${pantryLabel}</small></button>
      </div>
      <div class="care-row pantry-trip-row">
        <button class="care-btn btn-food-trip" id="btn-pi-food-trip">🚗 ออกไปซื้ออาหารตุนไว้ให้น้อง</button>
        <button class="care-btn btn-fashion-trip" id="btn-pi-fashion-trip">🎀 ไปซื้อเสื้อผ้า</button>
      </div>`;
  }

  const sickGray = p.sick && stage!=='egg' && !IMG_FILES[`${p.type}_${stage}_sick`];
  // 🦣 รอบ 659: ถอด "โหมดขยายร่าง" ออกแล้ว (ผู้ใช้สั่ง) — ขนาดน้อง/ผู้เลี้ยงคงที่เท่าร่างปกติเดิมเสมอ
  const heroVars = `--pet-vh:15;--owner-vh:28;--owner-x:-56px;--ps-h:${PET_SHOW_H}`;
  card.className = 'pet-card ' + (stage==='egg' ? 'pet-egg-stage' : stage==='baby' ? 'pet-baby' : 'pet-adult')
                   + (sickGray ? ' pet-sick' : '') + (p.sleeping && !p.sick ? ' pet-asleep' : '');
  /* 📰 รอบ 155 (สเปกผู้ใช้): กล่อง "ข้อมูลน้อง"+"การดูแล" ย้ายไป overlay ใหญ่ (openPetInfoOverlay)
     ซ้าย = ปุ่มเปิด overlay (เหนือตำแหน่งกล่องข้อมูลน้องเดิม) + ฟีดเพื่อน 📰 กว้างขึ้น
     เวทีน้อง (hero) ขยับไปฝั่งขวา แทนที่กล่องการดูแลเดิม */
  /* รอบ 247 (สเปกผู้ใช้): คอลัมน์ซ้าย = รูปน้องตัวใหญ่เต็มคอลัมน์ · ตัวหนังสือทั้งหมดย้ายไปคอลัมน์ขวา (รวมกับการดูแล) */
  const infoText = `
      <div class="plate-head">
        <span class="pet-name">${escapeHTML(p.name)} <button class="chip-edit" id="btn-pet-rename" title="เปลี่ยนชื่อน้อง">✏️</button></span>
        <span class="stage-label">${stageNames[stage]}</span>
        <span class="level-badge">Lv.${p.level}</span>
        <div class="exp-bar"><div class="exp-fill" style="width:${Math.min(100, p.exp/expNeed(p.level)*100)}%"></div></div>
        <span class="exp-text">EXP ${p.exp}/${expNeed(p.level)} · สะสม ${state.totalMatches} คำ</span>
      </div>
      <div class="ability-box ${abilityOn(p)?'':'locked'}">
        ${!isAdult(p)
          ? `🔒 ความสามารถพิเศษจะปลดล็อกเมื่อโตเต็มวัย (Lv.3)<br><small>${conf.ability}</small>`
          : p.sick
            ? `🤒 ป่วยอยู่ ใช้ความสามารถพิเศษไม่ได้<br><small>${conf.ability}</small>`
            : `<b>ความสามารถพิเศษ:</b> ${conf.ability}`}
      </div>
      `;
  /* รอบ 273 (สเปกผู้ใช้): ใต้รูปน้อง = คำบรรยายว่าทำไมถึงผอม/อ้วน/ล่ำ · ปุ่ม 🎀 แต่งตัว มุมบนขวา เปิดห้องแต่งตัวซื้อใส่ได้เลย (รอบ 635: แยกจากตลาดแล้ว) */
  const shapeWhy = {
    thin:  `🦴 <b>ผอมโซ</b> — เพราะอดข้าวบ่อย ปล่อยให้หิวจนป่วยติดกัน ${SHAPE_MISS_MEALS} มื้อ · กินให้อิ่มเต็มหลอดทุกมื้อ น้องจะค่อยๆ กลับมาแข็งแรง`,
    fat:   `🍩 <b>อ้วนกลม</b> — เพราะกินอาหารโทษ/ขนมติดกัน ${SHAPE_JUNK_MEALS} มื้อ · กลับมากินอาหารดีๆ เต็มหลอดครบ ${SHAPE_CLEAN_MEALS} มื้อติด จะหุ่นดีเหมือนเดิม`,
    strong:`💪 <b>ล่ำกำยำ</b> — เพราะกินอาหารดีเต็มหลอดครบ ${SHAPE_CLEAN_MEALS} มื้อติด · ได้โบนัส EXP +${SHAPE_EXP_BONUS} ทุกคำที่จับคู่ถูก`,
    normal:`😊 <b>หุ่นสมส่วน</b> — เพราะกินอิ่มสม่ำเสมอ ไม่อดข้าว ไม่กินของโทษบ่อย · กินดีเต็มหลอดครบ ${SHAPE_CLEAN_MEALS} มื้อติด จะล่ำกำยำได้โบนัส EXP`,
  };
  const wornForShape = stage !== 'egg' ? equippedItem(p) : null;             // 🎀 รอบ 659
  const hasShapeConflict = stage === 'adult' && p.shape && p.shape !== 'normal' && !!wornForShape;
  /* 🎀 รอบ 661: ภาพเล็ก "ชุดที่ใส่อยู่" มุมซ้ายของรูปน้อง — โผล่ทุกครั้งที่ภาพชุดถูกภาพอื่นแทน
     (ร่างล่ำ/อ้วน/ผอม/ป่วย/หิว/ดีใจ) เด็กเห็นด้วยตาทันทีว่าชุดที่ซื้อยังใส่อยู่ ไม่ต้องอ่าน/กดปุ่มก่อน
     รอบ 659 มีแต่ปุ่มสลับ ซึ่งต้องอ่านคำบรรยายก่อนถึงจะรู้ว่าชุดไม่ได้หาย */
  const piNowImg  = currentPetImg(p);
  const piWornImg = wornForShape ? IMG_FILES[`${p.type}_${stage}_${wornForShape.id}`] : null;
  /* 🎀 รอบ 666: ถ้าซ้อนชุดลงบนภาพท่าปัจจุบันได้ = เห็นทั้งรูปร่างและชุดในภาพเดียว
     → ไม่ต้องมีปุ่มสลับ (รอบ 659) และไม่ต้องมีป้ายภาพเล็ก (รอบ 661) อีก */
  const piWear    = petWearOverlay(p, piNowImg);
  /* สลับได้เฉพาะเคสรูปร่างทับชุดจริง ๆ — ป่วย/หิว/ดีใจ ภาพถูกล็อกไว้ กดแล้วไม่เปลี่ยน = ปุ่มตาย
     → เคสนั้นให้ภาพเล็กเป็นป้ายบอกเฉย ๆ (และซ่อนปุ่มสลับในคำบรรยายด้วย) */
  const piCanSwap = hasShapeConflict && !p.sick && !(typeof petHungry === 'function' && petHungry(p))
                    && !(typeof happyNow === 'function' && happyNow());
  const piPipTag  = piCanSwap ? 'button' : 'div';
  const dressPip  = (!piWear && piWornImg && piNowImg && piWornImg !== piNowImg)
    ? `<${piPipTag} class="pi-dress-pip"${piPipTag === 'button' ? ' id="btn-pi-dress-pip" type="button"' : ''}>
         <img src="${piWornImg}" alt="">
         <span>${wornForShape.emoji || '🎀'} ${escapeHTML(wornForShape.name)}<br>ยังใส่อยู่${piCanSwap ? ' — กดดูใหญ่' : ''}</span>
       </${piPipTag}>`
    : '';
  __petPlates = {
    info: `
      <div class="plate-title">⬢ ข้อมูลน้อง</div>
      ${stage !== 'egg' ? `<button class="pi-dress-btn" id="btn-pi-dress">🎀 แต่งตัวน้อง</button>` : ''}
      ${dressPip}
      ${piNowImg ? (piWear
        ? `<span class="pet-wear pi-portrait-wrap"><img class="pi-portrait" src="${piNowImg}" alt="${escapeHTML(p.name)}">${wearLayerHTML(piWear)}</span>`
        : `<img class="pi-portrait" src="${piNowImg}" alt="${escapeHTML(p.name)}">`) : ''}
      ${stage !== 'egg' && piWear
        ? `<div class="pi-shape-cap shape-cap-${p.shape || 'normal'}">${shapeWhy[p.shape] || shapeWhy.normal}
            <div class="pi-wear-note">${piWear.item.emoji || '🎀'} ใส่<b>${escapeHTML(piWear.item.name)}</b>อยู่ — เห็นในรูปเลย ไม่ต้องกดสลับ</div></div>`
        : stage !== 'egg' ? (piCanSwap
        ? (state.psDress
          ? `<div class="pi-shape-cap shape-cap-${p.shape}">${wornForShape.emoji || '🎀'} <b>ใส่${escapeHTML(wornForShape.name)}อยู่</b> — ชุดนี้ยังใส่ให้น้องตลอดนะ ไม่ได้หายไปไหน
              <button class="pi-shape-toggle-btn" id="btn-pi-shape-toggle" type="button">${SHAPE_UI[p.shape].icon} ดูรูปร่างล่าสุด</button></div>`
          : `<div class="pi-shape-cap shape-cap-${p.shape}">${shapeWhy[p.shape]}
              <button class="pi-shape-toggle-btn" id="btn-pi-shape-toggle" type="button">${wornForShape.emoji || '🎀'} ดูชุดที่ใส่อยู่</button></div>`)
        : `<div class="pi-shape-cap shape-cap-${p.shape || 'normal'}">${shapeWhy[p.shape] || shapeWhy.normal}</div>`) : ''}
      ${stage !== 'egg' ? patCalendarHTML() : ''}`,
    /* 🛡️ รอบ 951 (ผู้ใช้สั่ง): ปุ่ม "ควิซอาหารปลอดภัย" ย้ายจากแถบล่างล็อบบี้ มาต่อท้ายใต้ปุ่ม 🍽️ ให้อาหาร
       อยู่นอกบล็อก hungerUI → ร่างไข่ (ยังไม่มีปุ่มให้อาหาร) ก็ยังกดเล่นควิซได้เหมือนเดิม */
    care: `${infoText}${hungerUI ? `<div class="plate-title pi-care-title">⬢ การดูแล</div>${hungerUI}` : ''}
      <div class="care-row care-row-quiz">
        <button class="care-btn btn-foodquiz" id="btn-foodquiz">🛡️ ควิซอาหารปลอดภัย</button>
      </div>`,
  };
  /* 🐾 รอบ 613: ปุ่ม "ข้อมูลน้อง" ย้ายไปอยู่แถวแท็บชื่อสัตว์แล้ว (สร้างใน renderDashboard ด้านบน)
     → คอลัมน์ซ้ายเหลือฟีดเพื่อนอย่างเดียว ยืดขึ้นไปชนขอบบนเวทีด้วย alignStageLeft() */
  card.innerHTML = `
    <div class="stage-left">
      <div class="stage-plate feed-plate">
        <div class="plate-title">⬢ Global Feed 📰<span class="fd-tools"><button class="feed-bell" id="btn-feed-bell" type="button">🔔</button><button class="feed-all-btn" id="btn-feed-all" type="button">🌏 ดูทั้งหมด</button></span></div>
        <div class="fd-prog"><i id="fd-prog-bar"></i></div>
        <div class="feed-list" id="feed-list"></div>
      </div>
    </div>
    <div class="stage-hero hero-side pet-show-mode bond-mode${__clipReady(p) ? ' ps-clip-mode' : ''}">${petShowBgHTML(p)}${petBondContextHTML(p)}<div class="hero-scene" style="${heroVars}">${petShowHTML(p, petClipUrl(p))}</div></div>`;

  const piBtn = document.getElementById('btn-pet-info');   // 🐾 รอบ 613: อยู่ในแถวแท็บแล้ว (สร้างก่อนการ์ดเสมอ)
  if(piBtn) piBtn.addEventListener('click', openPetInfoOverlay);
  const feedAllBtn = document.getElementById('btn-feed-all');   // 🌍 รอบ 639: เปิดหน้า Feed เต็ม (ทุกคน + ไลก์/คอมเมนต์)
  if(feedAllBtn) feedAllBtn.addEventListener('click', openFeedBoard);
  const feedBell = document.getElementById('btn-feed-bell');    // 🔔 รอบ 701: แจ้งเตือนไลก์/คอมเมนต์โพสต์ของเรา
  if(feedBell) feedBell.addEventListener('click', openFeedNotif);
  const bondHomeBtn = document.getElementById('btn-bond-home');
  if(bondHomeBtn) bondHomeBtn.addEventListener('click', ()=>{ sfx.select(); openHomeShop(); });
  renderFeedCard();
  /* 📐 รอบ 613: วัดตำแหน่งจริง "หลังการ์ดถูกสร้าง" — เวที (.stage-hero) เพิ่งมีจริงตรงนี้
     (เรียกตอนต้น renderDashboard ได้ค่าของการ์ดรอบก่อน → รอบแรกสุดยังไม่มีเวทีเลย) */
  alignStageCols();
  watchStageCols();   // เวทีถูกสร้างใหม่ทุก render → ย้ายตัวเฝ้าไปเกาะตัวใหม่
  /* 🎬 รอบ 604: เวทีกลาง = โชว์น้องน่ารัก (ไม่ใช่เหรียญแรงค์แล้ว) → คลิกเวทีไม่เปิดแผงแรงค์อีก
     ดูแรงค์ = แท็บเล็กใต้วันเดือนปีบนแถบบน (#rank-tab · renderRankTab) · แตะตัวน้องยังเปิดโปรไฟล์เหมือนเดิม */
  /* 🎬 รอบ 605: คลิปน้อง — โหลดไม่ได้ (ยังไม่มีไฟล์ของชนิด/วัยนั้น, ออฟไลน์, เบราว์เซอร์เล่นไม่ได้)
     → จำว่าไม่มี แล้วถอยไปฉากการ์ตูน CSS ทันที ไม่มีจอดำค้าง · autoplay ถูกบล็อกก็ลองเล่นซ้ำแบบเงียบ ๆ */
  {
    const vid = card.querySelector('.ps-video');
    const behaviorRoot = card.querySelector('.pet-show');
    const behaviorForced = p.sleeping ? 'sleep' : (p.sick ? 'idle' : (petHungry(p) ? 'sit' : ''));
    const behaviorOptions = videoEl=>({video:videoEl || null,type:p.type,stage,forced:behaviorForced});
    startPetBondTalkHold(card, p);
    if(behaviorRoot) behaviorRoot.addEventListener('petbehaviorchange', e=>queuePetBondTalk(card, p, e.detail.state));
    if(vid){
      const heroEl = card.querySelector('.stage-hero');
      const key = petClipKey(p);
      /* 🗜️ รอบ 611: เล่น "ตัวเล็ก" ใน clip/sm/ ก่อนเสมอ — ถ้าตัวเล็กมีปัญหา (ไฟล์หาย/เครื่องถอดรหัสไม่ได้)
         ให้ถอยไปต้นฉบับ clip/<key>.mp4 อีก 1 ครั้งก่อน แล้วค่อยยอมแพ้กลับไปฉากการ์ตูน */
      let triedOrig = false;
      vid.addEventListener('error', ()=>{
        const orig = key ? `clip/${key}.mp4` : '';
        if(orig && !triedOrig && vid.getAttribute('src') !== orig){
          triedOrig = true; vid.setAttribute('src', orig); vid.load(); return;
        }
        if(key) CLIP_FILES[key] = null;
        if(heroEl) heroEl.classList.remove('ps-clip-mode');
        if(behaviorRoot && typeof PetBehavior !== 'undefined' && !state.noAnim)
          PetBehavior.start(behaviorRoot, behaviorOptions(null));
        vid.remove();
      });
      const tryPlay = ()=>{ const pr = vid.play(); if(pr && pr.catch) pr.catch(()=>{}); };
      /* 🩹 รอบ 607: เปลี่ยนหน้าจอเป็นคลิป "ตอนเล่นได้จริง" เท่านั้น (canplay) — ระหว่างรอเน็ต
         เด็กยังเห็นฉากการ์ตูน+ตัวน้องตามปกติ ไม่มีกรอบดำว่าง · เฟดสลับด้วย CSS transition */
      const goClip = ()=>{
        if(key) CLIP_FILES[key] = vid.getAttribute('src');
        if(heroEl) heroEl.classList.add('ps-clip-mode');
        if(behaviorRoot && typeof PetBehavior !== 'undefined' && !state.noAnim)
          PetBehavior.start(behaviorRoot, behaviorOptions(vid));
        else{ vid.loop = true; tryPlay(); }
      };
      vid.addEventListener('canplay', goClip, {once:true});
      // ⚠️ เรียก play() ทันทีหลังตั้ง src มักโดน AbortError (ยังโหลดไม่ถึงเฟรมแรก) — ปล่อยให้ canplay สั่งแทน
      if(vid.readyState >= 3) goClip();
      /* 🎬 รอบ 608: บางเครื่อง/บางโหมด (ประหยัดแบต, ประหยัดเน็ต, นโยบาย autoplay) บล็อกการเล่นเอง
         → คลิปจะค้างเฟรมแรกเงียบ ๆ · ตรวจแล้วโชว์ปุ่ม "แตะเพื่อเล่น" ให้กดเองได้ */
      const heroForBtn = heroEl;
      vid.addEventListener('playing', ()=>{ if(heroForBtn) heroForBtn.classList.remove('ps-clip-blocked'); });
      setTimeout(()=>{
        if(document.body.contains(vid) && vid.paused && behaviorRoot
          && !behaviorRoot.classList.contains('pb-hold') && !behaviorRoot.classList.contains('pb-changing')
          && heroForBtn && heroForBtn.classList.contains('ps-clip-mode'))
          heroForBtn.classList.add('ps-clip-blocked');
      }, 1500);
      const playBtn = card.querySelector('.ps-play');
      if(playBtn) playBtn.addEventListener('click', (e)=>{
        e.stopPropagation();
        const pr = vid.play(); if(pr && pr.catch) pr.catch(()=>{});
      });
    }else if(behaviorRoot && typeof PetBehavior !== 'undefined' && !state.noAnim){
      PetBehavior.start(behaviorRoot, behaviorOptions(null));
    }
  }
  /* 🎀 รอบ 609: ปุ่มสลับ "คลิปน้อง ↔ น้องใส่ชุด" (โผล่เฉพาะตอนน้องใส่ชุดอยู่) */
  {
    /* 🎀 รอบ 666: ป้ายเล็ก "ชุดที่ใส่อยู่" (button.ps-worn-pip) กดแล้วสลับเหมือนกัน */
    card.querySelectorAll('.ps-dress, button.ps-worn-pip').forEach(dressBtn=>{
      dressBtn.addEventListener('click', (e)=>{
        e.stopPropagation();
        state.psDress = !state.psDress;
        saveState();
        sfx.select();
        renderDashboard();
      });
    });
  }
  /* เผื่อเบราว์เซอร์บล็อก autoplay (นโยบายบางเครื่อง/บางเบราว์เซอร์): แตะจอครั้งแรกแล้วคลิปเดินเอง
     ผูกครั้งเดียวตลอดอายุหน้า (renderDashboard ถูกเรียกบ่อยมาก ห้ามผูกซ้ำทุกรอบ) */
  if(!window.__clipTapBound){
    window.__clipTapBound = true;
    document.addEventListener('pointerdown', ()=>{
      const v = document.querySelector('.ps-video');
      const behaviorRoot = v && v.closest('.pet-show');
      if(v && v.paused && !(behaviorRoot && (behaviorRoot.classList.contains('pb-hold') || behaviorRoot.classList.contains('pb-changing')))){
        const pr = v.play(); if(pr && pr.catch) pr.catch(()=>{});
      }
    }, true);
  }
  if(window.__piOverlay) window.__piOverlay.refresh();   // overlay เปิดค้างอยู่ → เนื้อหาตาม state ใหม่

  // รอบ 104: โมเดล 3D ผู้เลี้ยง+น้อง (idle + ปัดหมุน) — มีไฟล์ img/models/*.glb ถึงแสดง
  // 🧱 รอบ 238: ล็อบบี้เป็น 2D ทั้งหมด (คน blk ขยับมีชีวิต + สัตว์ภาพ 2D) — ไม่โหลดโมเดล glb/three อัตโนมัติแล้ว
  // 🌀 เกมสะกดคำยังอยู่: กดปุ่มค่อย lazy-load ฉาก 3D มาเล่นชั่วคราว จบแล้วกลับ 2D
  //    (โผล่เฉพาะร่างปกติ + น้องปกติ ไม่ป่วย/หิว/ใส่ชุด — เงื่อนไขเดิมของเกมสะกดคำ)
  {
    const hero = card.querySelector('.stage-hero');
    if(hero) footAlign(hero);                      // 🦶 เล็งเท้าคน+สัตว์ลงเส้นพื้น
    // 🌀 ถ้ากำลังเล่นเกมสะกดคำอยู่ (ฉาก 3D ชั่วคราว) แล้ว renderDashboard ถูกเรียกกลางเกม (เช่นได้เหรียญ)
    //    ต้อง re-attach เพื่อผูก canvas 3D กลับเข้า hero ใหม่ + คืน HUD (ไม่งั้นเวทีหลุด)
    const spelling = typeof Lobby3D !== 'undefined' && Lobby3D._debug && Lobby3D._debug().spell && Lobby3D._debug().spell.active;
    if(hero && spelling){ Lobby3D.attach(hero, {avatar:state.playerAvatar, petType:p.type, stage, giant:0}); }
    const scene = hero && hero.querySelector('.hero-scene');
    const canSpell = !spelling && typeof Lobby3D !== 'undefined' && stage !== 'egg' && !(typeof petStateImg === 'function' && petStateImg(p));
    if(scene && canSpell && typeof Lobby3D.launchSpell === 'function'){
      const btn = document.createElement('button');
      btn.className = 'spell-btn'; btn.innerHTML = '🌀 สะกดคำ';
      btn.addEventListener('click', ()=>Lobby3D.launchSpell(hero, {avatar:state.playerAvatar, petType:p.type, stage, giant:0}));
      scene.appendChild(btn);
    }
  }
  // ปุ่มดูแล (ให้อาหาร/รักษา/นอน/ขับพิษ/ยักษ์/เปลี่ยนชื่อ) ย้ายไปอยู่ใน overlay
  // ข้อมูลน้อง — ผูกใน bindPetPlateButtons ตอน openPetInfoOverlay (รอบ 155)

  // แตะน้องแล้วเด้งดึ๋ง + มีเสียง
  const tap = document.getElementById('pet-tap');
  tap.style.cursor = 'pointer'; tap.style.pointerEvents = 'auto';
  /* แตะน้อง 2 จังหวะ (รอบ 322 ผู้ใช้สั่ง):
       · แตะสั้น = น้องร้องตามชนิด (เหมียว/โฮ่ง/คำราม) + เด้ง + หัวใจ 3 ดวง แล้วเปิดหน้าโปรไฟล์
       · แตะค้าง ≥ PAT_HOLD_MS = "ลูบยาว" หัวใจฟุ้ง + โบนัส EXP วันละครั้งต่อตัว (ไม่เปิดโปรไฟล์)
     ใช้ pointer event เพื่อจับการกดค้างได้ทั้งเมาส์และนิ้ว · ⚠️ เดิมบรรทัดนี้เรียก petPatFx()
     ที่ไม่เคยมีอยู่จริง → ReferenceError ทำให้แตะน้องแล้วเงียบทั้งหมด (แก้รอบ 320) */
  bindPetTap(tap, p);
  /* 🐾 รอบ 328: ต้องทาแสง "ชวนมาลูบ" ตรงนี้ — หลัง card.innerHTML ถูกเขียนใหม่
     (เรียกก่อนหน้านั้นคลาสจะโดนล้างไปพร้อมเวทีเก่า) */
  applyPatRemindGlow();

  renderHomeCard();
  renderPhoneCard();
  renderComputerCard();
  renderRailWorlds();   // 🎫→💰 รอบ 823: การ์ดตั๋วแยก 8 ใบถูกถอดออก — ราคา/ล็อกอยู่ในปุ่มรางเมนูซ้ายแทน
  renderFarmCard();
  renderFactoryCard();
  renderMarketCard();
  renderShop();
}

/* ============================================================
   การนอน (คิว 7725691507 ข้อ 1)
   เข้านอนได้ตั้งแต่ 20:00 · ถึง 23:00 ยังไม่นอน = ป่วย · ตื่นเอง 06:00
   ปุ่มเดียวพาสัตว์ทุกตัว (Lv.2 ขึ้นไป) เข้านอนพร้อมกัน
   ============================================================ */
function sleepBtnHTML(p, now){
  const h = thHour(now);                                       // 🇹🇭 รอบ 988: เวลาไทย
  if(p.sleeping) return `<button class="care-btn btn-sleep" id="btn-wake">⏰ ปลุกน้อง</button>`;
  if(h >= SLEEP_FROM_HOUR || h < WAKE_HOUR)
    return `<button class="care-btn btn-sleep" id="btn-sleep">🌙 พาเข้านอน</button>`;
  return '';
}
function sleepHintHTML(p, now){
  const h = thHour(now);                                       // 🇹🇭 รอบ 988: เวลาไทย
  if(p.sick || p.sleeping) return '';
  if(h >= SLEEP_FROM_HOUR && h < SLEEP_SICK_HOUR){
    const deadline = thAtHour(now, SLEEP_SICK_HOUR);           // 23:00 เวลาไทยของวันนั้น (timestamp จริง)
    return `<div class="heat-text">🌙 ได้เวลาเตรียมนอนแล้ว — พาน้องเข้านอนก่อน <b>${SLEEP_SICK_HOUR}:00 น.</b> (อีก ${fmtMins(deadline - now)}) ไม่งั้นน้องจะป่วยนะ</div>`;
  }
  if(h >= SLEEP_SICK_HOUR || h < WAKE_HOUR)
    return `<div class="heat-text">🌙 ดึกมากแล้ว รีบพาน้องเข้านอนเถอะ!</div>`;
  return '';
}
function sleepAllPets(){
  const h = thHour();                                          // 🇹🇭 รอบ 988: เวลาไทย
  if(h < SLEEP_FROM_HOUR && h >= WAKE_HOUR){
    sfx.wrong(); toast(`🌙 ยังไม่ถึงเวลานอน — พาเข้านอนได้ตั้งแต่ ${SLEEP_FROM_HOUR}:00 น. นะ`); return;
  }
  let n = 0;
  for(const p of state.pets){ if(p.level >= 2 && !p.sleeping){ p.sleeping = true; n++; } }
  if(!n) return;
  sfx.select();
  saveState();
  toast(`😴 พาน้องเข้านอนครบ ${n} ตัวแล้ว ฝันดีนะ 💤 (ตื่นเอง ${String(WAKE_HOUR).padStart(2,'0')}:00 น.)`);
  renderDashboard();
}
function wakeAllPets(){
  for(const p of state.pets) p.sleeping = false;
  sfx.select();
  saveState();
  toast(`⏰ ปลุกน้องตื่นแล้ว — ก่อน ${SLEEP_SICK_HOUR}:00 น. พากลับไปนอนด้วยนะ`);
  renderDashboard();
}

/* ============================================================
   ให้อาหาร (ระบบมื้อเย็น 18:00 + ความอิ่มสะสม — ข้อ 2+3)
   ============================================================ */
function feedPet(){
  const p = activePet();
  if(!p) return;
  if(p.sick){ alertBox('<div class="ab-emoji">🤒</div><div class="ab-title" style="color:#b23a48">น้องป่วยอยู่นะ</div><div class="ab-desc">กินไม่ลงเลย... ต้องพาไป <b>รักษา</b> ก่อน น้องถึงจะหายแล้วกลับมากินได้ 🩺</div>', 'ไว้ก่อน',
      {text:`🩺 รักษาเลย (🪙${fmtNum(CURE_COST)})`, onClick:curePet}); return; }
  if(p.sleeping){ sfx.wrong(); toast('😴 น้องหลับอยู่ อย่าเพิ่งปลุกมากินข้าวเลยนะ'); return; }
  const canEat = petCanEat(p);          // 🍽️ รอบ 1008: ดูหลอดความอิ่มจริง ไม่ใช่ petHungry อย่างเดียว
  const canFeast = p.fedUpTo < nextSlotStart(Date.now());
  if(!canEat && !canFeast){
    sfx.select(); toast('😋 น้องอิ่มแปล้ถึงมื้อหน้าแล้ว ไว้ค่อยกินใหม่นะ'); return;
  }
  const shelf = state.petPantry && state.petPantry.shelfId;
  const stockTotal = state.petPantry && state.petPantry.stock
    ? Object.values(state.petPantry.stock).reduce((sum,n)=>sum+Math.max(0,Number(n)||0),0) : 0;
  if(!shelf){
    alertBox('<div class="ab-emoji">🗄️</div><div class="ab-title">ยังไม่มีชั้นเก็บอาหาร</div><div class="ab-desc">ซื้อชั้นเปล่าก่อน แล้วค่อยขับรถพาน้องไปซื้ออาหารมาตุนไว้นะ</div>', 'ไว้ก่อน',
      {text:'เลือกซื้อชั้น', onClick:()=>PetPantry.openPantry()});
    return;
  }
  if(stockTotal <= 0){
    alertBox('<div class="ab-emoji">🥫</div><div class="ab-title">ชั้นยังว่างอยู่</div><div class="ab-desc">ให้อาหารไม่ได้จนกว่าจะมีอาหารบนชั้น — พาน้องนั่งรถไปเลือกซื้อของมาตุนกัน!</div>', 'ไว้ก่อน',
      {text:'🚗 ออกไปซื้ออาหาร', onClick:()=>enterPetShopping3D('food')});
    return;
  }
  openFoodMenu(p);
}

function openFoodMenu(p){
  /* 🚫 รอบ 952: กันทุกทางเข้า — น้องป่วยอยู่ห้ามเปิดเมนูซื้ออาหาร */
  if(p.sick){ sfx.wrong(); toast(hungerSickMsg('ของกิน') || '🤒 น้องป่วยอยู่ ต้องรักษาก่อนถึงจะซื้อของกินได้นะ'); return; }
  sfx.select();
  /* 🍽️ รอบ 1008: กินอาหารธรรมดาได้ไหม = หลอดความอิ่มของมื้อนี้ยังไม่เต็ม (petCanEat)
     ของเดิมใช้ petHungry ซึ่งเป็น false ตลอดตอน level 1 → ทั้งเมนูล็อก เหลือแต่ชุด 1,000
     ถ้าล็อกจริง (อิ่มเต็มหลอดแล้ว) ต้องบอกบนการ์ดทุกใบว่าล็อกเพราะอะไร + กินได้อีกทีเมื่อไหร่ (กฎทองข้อ 1) */
  const canEat = petCanEat(p);
  const nowTs = Date.now();
  const nextMeal = p.fedUpTo > currentSlotStart(nowTs) ? nextSlotStart(nowTs) + SLOT_MS : nextSlotStart(nowTs);
  const favId = `fav_${p.type}`;
  const fav = Object.assign({id:favId, stockId:favId}, PETS[p.type].favFood);
  /* ข้อ 5.1: แยกเมนู 2 ชุด — ชุดอาหารสัตว์ (fav+ปลอดภัย) กับชุดอาหารคน (บางอย่างเป็นโทษ) */
  const petFoods = [fav, ...FOODS.filter(f=>!f.human).map(f=>Object.assign({stockId:f.id},f))];
  const humanFoods = FOODS.filter(f=>f.human).map(f=>Object.assign({stockId:f.id},f));
  const menuFoods = [...petFoods, ...humanFoods];
  const itemHTML = f=>{
    const qty = (typeof PetPantry !== 'undefined') ? PetPantry.qty(f.stockId||f.id) : 0;
    const usable = (canEat || f.skipNext) && qty > 0;
    const bad = foodBadFor(f, p.type);
    /* 🔒 รอบ 1033: ป้ายล็อกเดิมอยู่หัวการ์ดใบเดียว พอเมนูเลื่อนแล้วหลุดจอ
       → ผู้เล่นเห็นแค่ "ปลา 300 กดได้ แต่แอปเปิ้ล 150 เทา" นึกว่าเกมบังคับซื้อของแพง
       เลยย้ำเหตุผล+เวลากินได้อีกทีไว้ท้ายการ์ดทุกใบ และติดป้ายให้ใบที่กดได้จริงด้วย */
    return `
        <div class="food-item ${f.exp ? 'food-fav' : ''} ${f.special ? 'food-special' : ''} ${bad ? 'food-bad' : ''} ${!usable ? 'food-locked' : ''} ${qty<=0 ? 'food-out' : ''}" data-food="${f.id}">
          ${qty<=0 ? `<span class="fd-lock">ชั้นว่าง</span>` : (!usable ? `<span class="fd-lock">🔒 อิ่มแล้ว</span>` : '')}
          ${f.exp ? `<span class="fav-tag">💖 เมนูโปรดของ${escapeHTML(p.name)}!</span>` : ''}
          ${bad ? `<span class="bad-tag">⚠️ เป็นโทษกับน้อง!</span>` : ''}
          <span class="fd-emoji">${f.emoji}</span>
          <span class="fd-en">${f.en}</span>
          <span class="fd-name">${f.name}</span>
          <span class="fd-info">บนชั้น ×${qty} · อิ่ม +${f.fill}</span>
          ${f.exp ? `<span class="fd-exp">✨ ได้ EXP แถม +${f.exp}!</span>` : ''}
          ${f.skipNext ? `<span class="fd-exp">⏳ เต็มหลอดทันที + ตุนข้ามมื้อพรุ่งนี้!</span>` : ''}
          ${qty<=0 ? `<span class="fd-lock-when">🚗 หมดแล้ว — ไปซื้อมาเติมชั้นก่อน</span>`
                   : usable ? (canEat ? '' : `<span class="fd-nowok">✅ กินตุนล่วงหน้าได้</span>`)
                   : `<span class="fd-lock-when">🔒 น้องอิ่มเต็มหลอด — กินได้อีกทีตอน ${mealLabel(nextMeal)}</span>`}
          ${bad ? `<span class="fd-toxin">☠️ พิษสะสม +${f.toxin}</span>`
                : f.human ? `<span class="fd-safe">✅ ${p.type==='dragon' ? 'มังกรกินได้' : 'น้องกินได้'}</span>` : ''}
        </div>`;
  };
  /* 📊 รอบ 1009: หลอดความอิ่มจริงบนหัวเมนู (เดิมมีแต่ตัวเลข X/100 อ่านยากกว่ากราฟ) — ใช้คลาส hunger-bar/hunger-fill ชุดเดียวกับแดชบอร์ด */
  const fullPct = Math.min(100, p.fullness||0);
  const overlay = document.createElement('div');
  overlay.className = 'levelup-overlay';
  overlay.innerHTML = `<div class="levelup-box food-box">
    <!-- ❌ รอบ 1034: ปุ่มปิดด้านบน (ติดหนึบตอนเลื่อน) — เดิมมีแต่ปุ่ม "ไว้ก่อน" ล่างสุด ต้องเลื่อนหาทุกครั้ง -->
    <button class="food-x" aria-label="ปิดเมนูอาหาร" title="ปิด">✕</button>
    <h2>🍽️ เลือกเมนูให้น้องกิน</h2>
    <div class="hunger-bar food-hunger-bar"><div class="hunger-fill ${canEat ? '' : 'buffed'}" style="width:${fullPct}%"></div></div>
    ${canEat
      ? `<p style="margin:4px 0;font-size:13.5px;color:#9a8aac">ความอิ่มตอนนี้ <b>${fullPct}/${MEAL_FULL}</b> — เลือกกินหลายอย่างให้เต็มหลอดนะ</p>`
      : `<p style="margin:4px 0;font-size:13.5px;color:#9a8aac">น้องอิ่มเต็มหลอดแล้ว (<b>${MEAL_FULL}/${MEAL_FULL}</b>) — เมนูอื่นจะกดได้อีกทีตอน <b>${mealLabel(nextMeal)}</b><br>ตอนนี้มีแต่ 🍱 ชุดอาหารวิเศษที่กินตุนล่วงหน้าได้ (ไม่จำเป็นต้องซื้อ รอมื้อหน้าก็ได้นะ)</p>`}
    <div class="food-grid">
      <div class="food-sec">🐾 ชุดอาหารสัตว์ (ปลอดภัย)</div>
      ${petFoods.map(itemHTML).join('')}
      <div class="food-sec food-sec-human">🧑 ชุดอาหารคน — ⚠️ บางอย่างเป็นโทษกับสัตว์</div>
      ${humanFoods.map(itemHTML).join('')}
    </div>
    <button class="food-cancel">ไว้ก่อน</button>
  </div>`;
  overlay.querySelector('.food-cancel').addEventListener('click', ()=>overlay.remove());
  overlay.querySelector('.food-x').addEventListener('click', ()=>{ sfx.select(); overlay.remove(); });
  overlay.querySelectorAll('.food-item').forEach(el=>{
    el.addEventListener('click', ()=>{
      const food = menuFoods.find(f=>f.id===el.dataset.food);
      if((typeof PetPantry === 'undefined') || PetPantry.qty(food.stockId||food.id) <= 0){
        sfx.wrong();
        toast('🥫 อาหารชนิดนี้หมดจากชั้นแล้ว — ขับรถไปซื้อมาเติมก่อนนะ');
        return;
      }
      if(!canEat && !food.skipNext){
        sfx.wrong(); toast(`😊 น้องอิ่มเต็มหลอดแล้ว เมนูนี้กินได้อีกทีตอน ${mealLabel(nextMeal)}`); return;
      }
      overlay.remove();
      /* ข้อ 5.1: อาหารโทษ → ป๊อปอัพเตือนก่อน กดรับทราบแล้วถึงป้อนได้ (กินอิ่มจริงแต่พิษสะสม) */
      if(foodBadFor(food, p.type)){
        const toxAfter = Math.min(TOXIN_FULL, (p.toxin||0) + (food.toxin||0));
        sfx.wrong();
        askConfirm(`<div style="font-size:56px;line-height:1">${food.emoji}⚠️</div>
          <div style="font-size:20px;font-weight:bold;margin-top:8px;color:#b23a48">${food.name}เป็นโทษกับ${escapeHTML(p.name)}นะ!</div>
          <div style="margin-top:8px;color:#6a5a78;line-height:1.5">${escapeHTML(foodWhy(food, p.type))}<br><br>
          กินแล้วอิ่มได้ (+${food.fill}) แต่ <b style="color:#7a3ab0">พิษจะสะสม +${food.toxin}</b><br>
          บาร์พิษ: <b>${p.toxin||0} → ${toxAfter}/${TOXIN_FULL}</b>${toxAfter >= TOXIN_FULL ? ' — <b style="color:#b23a48">เต็มแล้วน้องจะป่วยทันที!</b>' : ''}<br>
          <small>พิษไม่ลดเอง ต้องจ่ายค่าขับพิษ 🪙${fmtNum(DETOX_COST)}</small></div>`,
          'เข้าใจแล้ว ให้กินเลย', ()=>feedWith(p, food));
        return;
      }
      feedWith(p, food);
    });
  });
  document.body.appendChild(overlay);
}

function feedWith(p, food){
  const now = Date.now();
  if(typeof PetPantry === 'undefined' || !PetPantry.take(food.stockId||food.id, 1)){
    sfx.wrong();
    toast('🥫 อาหารชิ้นนี้หมดจากชั้นแล้ว — ยังไม่ได้ให้น้องกินนะ');
    return;
  }
  // ข้อ 3: สะสมความอิ่ม — ครบ 100 ถึงนับว่าอิ่มมื้อนี้ (feast เต็มหลอด + ตุนข้ามมื้อพรุ่งนี้)
  p.mealSlot = currentSlotStart(now);
  if(food.skipNext){
    p.fullness = MEAL_FULL;
    p.fedUpTo = nextSlotStart(now);
  }else{
    p.fullness = Math.min(MEAL_FULL, (p.fullness||0) + (food.fill||0));
    if(p.fullness >= MEAL_FULL && p.fedUpTo < currentSlotStart(now)) p.fedUpTo = currentSlotStart(now);
  }
  /* ข้อ 5.1: อาหารโทษ → พิษสะสม (ไม่ลดเอง) ครบ 100 → ป่วยทันที cause 'toxin' */
  if(foodBadFor(food, p.type)){
    p.toxin = Math.min(TOXIN_FULL, (p.toxin||0) + (food.toxin||0));
    if(p.toxin >= TOXIN_FULL && !p.sick){ p.sick = true; p.sickCause = 'toxin'; sfx.siren(); }   // 🚨 ล้มป่วยคามือ
    p.mealJunk = true;                 // ข้อ 5.2: มื้อนี้มีอาหารโทษปน
  }
  /* ข้อ 5.2: กินจนเต็มหลอด = จบมื้อ → นับมื้อสะอาด/มื้อโทษ อัปเดตรูปร่าง */
  const shapeChange = p.fullness >= MEAL_FULL ? shapeMealDone(p, now) : null;
  if(p.fullness >= MEAL_FULL) questEvent('feed');   // 🎯 Daily Quest: ป้อนน้องจนอิ่มเต็มหลอด
  sfx.buy();
  if(food.exp) addExp(food.exp, p);   // เมนูโปรด: ได้ EXP แถม (อาจเลเวลอัพได้เลย)
  saveState();
  makeHappy(4000);
  showFeedResult(p, food, shapeChange);
}

/* ตัวละครผู้เลี้ยง (ข้อ 4): มีภาพ player_male/female.png ใช้ภาพ ไม่มีใช้อีโมจิแทน
   fallback = สิ่งที่โชว์เมื่อผู้เล่นยังไม่เลือกตัวละคร (แต่ละจุดใช้ต่างกัน) */
const AVATAR_UI = {male:{emoji:'🦸‍♂️', name:'เด็กชาย'}, female:{emoji:'🦸‍♀️', name:'เด็กหญิง'}};
// 🧱 รอบ 245: รูปโปรไฟล์หลัก = "ตัวละครในล็อบบี้" (blk1..8) ตัวเดียวกับที่ยืนข้างน้อง
// (เลิกใช้ 🦸 ชาย/หญิง แยกต่างหาก — ผู้ใช้สั่ง 15 ก.ค. · เปลี่ยนตัวที่ ⚙️ ตั้งค่า)
// 📷 รอบ 709: อัปโหลดรูปตัวเองได้แล้ว — มีรูปใช้รูป ไม่มีถอยไปตัวการ์ตูนบล็อกเหมือนเดิม
function playerAvatarHTML(fallback){
  const ph = (typeof photoGet === 'function') ? photoGet() : '';
  if(ph) return `<img class="avatar-chip-img avatar-chip-photo" src="${ph}" alt="">`;
  if(typeof lobbyBlk === 'function') return `<img class="avatar-chip-img avatar-chip-blk" src="img/blocks/${lobbyBlk()}.png" alt="">`;
  return fallback !== undefined ? fallback : '📛';
}

/* ข้อความประจำร่าง (ข้อ 5.2) — ใช้ทั้งการ์ดสัตว์ + กล่องกินเสร็จ */
const SHAPE_UI = {
  fat:   {icon:'🍩', name:'อ้วนกลม',
          tip:`กินของโทษติดกัน ${SHAPE_JUNK_MEALS} มื้อ — กินอาหารดีๆ เต็มหลอดให้ครบ ${SHAPE_CLEAN_MEALS} มื้อติด จะกลับมาหุ่นดีเหมือนเดิม`},
  thin:  {icon:'🦴', name:'ผอมโซ',
          tip:'อดข้าวบ่อยจนผอม — กินให้อิ่มเต็มหลอดทุกมื้อ น้องจะค่อยๆ กลับมาแข็งแรง'},
  strong:{icon:'💪', name:'ล่ำกำยำ',
          tip:`กินดีครบ ${SHAPE_CLEAN_MEALS} มื้อติด! ได้ EXP แถม +${SHAPE_EXP_BONUS} ทุกคำที่จับคู่ถูก`},
};

function showFeedResult(p, food, shapeChange){
  const conf = PETS[p.type];
  const stage = petStage(p);
  const overlay = document.createElement('div');
  overlay.className = 'levelup-overlay';
  const happyImg = IMG_FILES[`${p.type}_${stage}_happy`] || IMG_FILES[`${p.type}_${stage}_normal`];
  const gotToxin = foodBadFor(food, p.type);            // ข้อ 5.1: มื้อนี้ได้พิษสะสมมาด้วย
  const toxinSick = p.sick && p.sickCause === 'toxin';  // พิษเต็ม 100 → ป่วยทันที
  const stillHungry = petCanEat(p) && !p.sick;          // 🍽️ รอบ 1008: ยังไม่เต็มหลอด → ชวนกินต่อ (น้อง level 1 ก็ต้องชวนด้วย · ป่วยแล้วห้ามกินต่อ)
  const nextMeal = p.fedUpTo >= nextSlotStart(Date.now()) - 1
    ? nextSlotStart(Date.now()) + SLOT_MS : nextSlotStart(Date.now());
  overlay.innerHTML = `<div class="levelup-box feed-box">
    <h2>${food.emoji} หม่ำ ${food.en} อร่อยจัง!</h2>
    <div class="feed-pet">${happyImg ? `<img src="${happyImg}" alt="">` : (conf[stage] || '😋')}${food.emoji}</div>
    ${toxinSick
      ? `<div class="feed-gain" style="background:var(--orange);border-color:var(--orange-d);color:#a85a1a">ความอิ่ม ${Math.min(100, p.fullness||0)}/${MEAL_FULL} — กินไม่ลงแล้ว ไม่สบายตัว...</div>`
      : stillHungry
        ? `<div class="feed-gain" style="background:var(--orange);border-color:var(--orange-d);color:#a85a1a">ความอิ่ม ${Math.min(100, p.fullness||0)}/${MEAL_FULL} — ยังไม่เต็มหลอด กินต่ออีกหน่อยนะ 😋</div>`
        : `<div class="feed-gain">อิ่มมื้อนี้เรียบร้อย 🎉 มื้อเย็นถัดไป: ${mealLabel(nextMeal)}</div>`}
    ${food.exp ? `<div class="feed-gain" style="background:var(--purple);border-color:var(--purple-d);color:#6a48a8">💖 เมนูโปรด! ได้ EXP แถม +${food.exp} ✨</div>` : ''}
    ${food.skipNext ? `<div class="feed-gain" style="background:var(--yellow);border-color:var(--yellow-d);color:#a8791a">🍱 อาหารวิเศษ! เต็มหลอด + ตุนข้ามมื้อพรุ่งนี้เลย ⏳</div>` : ''}
    ${gotToxin ? `<div class="feed-gain" style="background:#f0e3fb;border-color:#b98ae0;color:#7a3ab0">☠️ พิษสะสม +${food.toxin} → ตอนนี้ <b>${p.toxin}/${TOXIN_FULL}</b>${toxinSick ? '' : ' — อย่าให้กินบ่อยนะ!'}</div>` : ''}
    ${toxinSick ? `<div class="feed-gain" style="background:#ffe3e3;border-color:#ff8f8f;color:#b23a48">🤒 พิษเต็มหลอด! ${escapeHTML(p.name)}ป่วยแล้ว — ต้องพาไปขับพิษ+รักษา 🪙${fmtNum(CURE_COST)}</div>` : ''}
    ${shapeChange === 'strong' ? `<div class="feed-gain" style="background:#e8f8e8;border-color:#8fd48f;color:#2e7d43">💪 ${escapeHTML(p.name)}ล่ำกำยำแล้ว! กินดีครบ ${SHAPE_CLEAN_MEALS} มื้อติด — ได้ EXP แถม +${SHAPE_EXP_BONUS} ทุกคำที่จับคู่ถูก</div>` : ''}
    ${shapeChange === 'fat' ? `<div class="feed-gain" style="background:#ffefd9;border-color:#e8b93f;color:#a8791a">🍩 ${escapeHTML(p.name)}ตัวกลมปุ๊กแล้ว! กินของโทษติดกัน ${SHAPE_JUNK_MEALS} มื้อ — กลับมากินดีๆ ${SHAPE_CLEAN_MEALS} มื้อติดจะหุ่นดีเหมือนเดิม</div>` : ''}
    ${shapeChange === 'normal' ? `<div class="feed-gain">😊 ${escapeHTML(p.name)}กลับมาหุ่นปกติแล้ว — กินดีต่อเนื่องอีกนิดจะล่ำกำยำเลยนะ</div>` : ''}<br>
    <button>${toxinSick ? 'พาไปหาหมอ 🩺' : stillHungry ? 'กินต่อ 🍽️' : 'อิ่มแล้ว 😋'}</button>
  </div>`;
  overlay.querySelector('button').addEventListener('click', ()=>{
    overlay.remove();
    if(stillHungry){ openFoodMenu(p); }
    else renderDashboard();
  });
  document.body.appendChild(overlay);
  // 💗 น้องดีใจที่ได้กิน — หัวใจลอยจากรูปน้องในกล่อง (ป่วยคามื้อ = ไม่ลอย · มื้อมีพิษปน = ลอยน้อย)
  // หน่วงรอ popIn ของกล่องจบก่อน ตำแหน่ง anchor ถึงนิ่ง
  if(!toxinSick) setTimeout(()=>{
    if(overlay.isConnected) heartsFx(overlay.querySelector('.feed-pet'), gotToxin ? 4 : 8);
  }, 450);
}

/* ใช้กฎรักษาก้อนเดียวกันทั้ง "รักษาตัวปัจจุบัน" และ "รักษาทั้งหมด"
   เพื่อให้พิษ/ความหิว/อากาศ/น้ำ ถูกรีเซ็ตตรงกันทุกทางเข้า */
function applyCureState(p, slotNow, now){
  if(p.sickCause === 'toxin') p.toxin = 0;           // ข้อ 5.1: หมอขับพิษให้ตอนรักษา (เฉพาะป่วยจากพิษ)
  p.sick = false; p.sickCause = null;
  /* 🍚 รอบ 1034: หายป่วยแล้ว "ยังไม่ได้กินข้าว" ต้องป้อนได้ทันที
     ของเดิมตั้ง fedUpTo=มื้อนี้ + fullness เต็ม (นับว่ากินแล้วทั้งที่ยังไม่ได้กิน) → เมนูอาหารล็อกยกกระดาน
     ถึงพรุ่งนี้ 18:00 น้องเลยค้างผอมโซ เพราะ missedMeals ล้างได้ตอนกินเต็มหลอดเท่านั้น
     ตอนนี้กันป่วยซ้ำมื้อเดิมด้วย hungerSickSlot แทน (ดู careTick ใน state.js) */
  p.hungerSickSlot = slotNow;
  const stillHungryAfterCure = p.fedUpTo < slotNow;
  p.heatFrom = (p.type === 'dragon' || heatProtected()) ? null : now;
  p.thirstFrom = state.waterCut ? now : null; // ยังถูกตัดน้ำอยู่ → เริ่มนับรอบใหม่
  return stillHungryAfterCure;
}

function curePet(){
  const p = activePet();
  if(!p || !p.sick) return false;
  if(state.coins < CURE_COST){
    sfx.wrong();
    toast(`ค่ารักษา 🪙${fmtNum(CURE_COST)} — เหรียญไม่พอ ไปเล่นเกมเก็บเหรียญมารักษาน้องนะ!`);
    return false;
  }
  state.coins -= CURE_COST;
  const now = Date.now();
  const stillHungryAfterCure = applyCureState(p, currentSlotStart(now), now);
  sfx.levelup();
  toast(stillHungryAfterCure
    ? '💊 รักษาหายแล้ว! แต่น้องยังไม่ได้กินมื้อนี้เลย — กด 🍽️ ให้อาหารได้เลยนะ'
    : '💊 รักษาหายแล้ว! น้องกลับมาแข็งแรงร่าเริง 🎉');
  saveState();
  renderDashboard();
  cureCelebrateFx();   // เรียกหลัง render เพื่อให้คลาสเด้งเกาะ .pet-stage ตัวใหม่ (ที่ไม่ grayscale แล้ว)
  return true;
}

/* 🩺 รอบ 1289: ปุ่มเดียวรักษาสัตว์ป่วยทุกตัว
   เช็กยอดรวมก่อนแตะ state เสมอ จึงไม่เกิดเคสเงินหมดกลางทางแล้วหายป่วยแค่บางตัว */
function cureAllPets(){
  const sickPets = Array.isArray(state.pets) ? state.pets.filter(p=>p && p.sick) : [];
  if(!sickPets.length){
    toast('💚 สัตว์ทุกตัวแข็งแรงดีอยู่แล้ว ไม่ต้องเสียค่ารักษานะ');
    return {healed:false,count:0,cost:0,hungry:0};
  }
  const totalCost = sickPets.length * CURE_COST;
  if(state.coins < totalCost){
    const short = Math.max(0, totalCost - Math.floor(state.coins || 0));
    sfx.wrong();
    toast(`ต้องใช้ค่ารักษารวม 🪙${fmtNum(totalCost)} — ยังขาด 🪙${fmtNum(short)} จึงยังไม่ได้รักษาน้องตัวใด`);
    return {healed:false,count:sickPets.length,cost:totalCost,hungry:0};
  }
  state.coins -= totalCost;
  const now = Date.now();
  const slotNow = currentSlotStart(now);
  let hungry = 0;
  sickPets.forEach(p=>{ if(applyCureState(p, slotNow, now)) hungry++; });
  sfx.levelup();
  saveState();
  renderDashboard();
  toast(`💊 รักษาน้องครบ ${fmtNum(sickPets.length)} ตัวแล้ว! ใช้ 🪙${fmtNum(totalCost)}`
    + (hungry ? ` · มี ${fmtNum(hungry)} ตัวที่ยังไม่ได้กินมื้อนี้นะ` : ' · ทุกตัวกลับมาแข็งแรงแล้ว 🎉'));
  cureCelebrateFx();
  return {healed:true,count:sickPets.length,cost:totalCost,hungry};
}

/* 💗 หัวใจลอยขึ้นจาก anchor (ไม่มี/ถูกซ่อน = กลางจอ) — ใช้ทั้งรักษาหาย + ป้อนอาหาร */
function heartsFx(anchor, n=10){
  if(document.documentElement.classList.contains('no-anim')) return;  // เคารพสวิตช์ปิดแอนิเมชันในเกม
  let cx = innerWidth/2, cy = innerHeight*0.45;
  const r = anchor ? anchor.getBoundingClientRect() : null;
  if(r && r.width > 0){ cx = r.left + r.width/2; cy = r.top + r.height*0.35; }
  const HEARTS = ['💗','💖','💕','❤️','💓'];
  for(let i=0;i<n;i++){
    const h = document.createElement('div');
    h.className = 'heal-heart';
    h.textContent = HEARTS[i%HEARTS.length];
    h.style.left = (cx + (Math.random()-0.5)*150) + 'px';
    h.style.top  = cy + 'px';
    h.style.fontSize = (18 + Math.random()*18) + 'px';
    h.style.animationDelay = (i*70) + 'ms';
    h.style.setProperty('--hx', ((Math.random()-0.5)*70) + 'px');  // ปลายทางเอียงซ้าย/ขวาสุ่ม
    document.body.appendChild(h);
    setTimeout(()=>h.remove(), 1600 + i*70);
  }
}

/* ฉลองรักษาหาย: น้องบนเวทีเด้งดีใจ + หัวใจลอย (รักษาจากหน้าเกมจับคู่ ไม่เห็นน้อง → ลอยกลางจอ) */
/* ---------- 🐾 แตะน้องในล็อบบี้ (รอบ 322) ----------
   แตะสั้น = ร้อง+เด้ง+หัวใจ แล้วเปิดโปรไฟล์ · กดค้าง = ลูบยาว ได้ EXP โบนัสวันละครั้ง/ตัว */
const PAT_HOLD_MS = 800;    // กดค้างนานเท่านี้ = ลูบยาว (สั้นกว่านี้ = แตะธรรมดา)
const PAT_EXP     = 12;     // EXP โบนัสลูบยาว (วันละครั้งต่อสัตว์ 1 ตัว)
function bindPetTap(tap, p){
  let timer = null, longDone = false;
  const cancel = ()=>{ if(timer){ clearTimeout(timer); timer = null; } };
  tap.addEventListener('pointerdown', ()=>{
    longDone = false;
    cancel();
    timer = setTimeout(()=>{ timer = null; longDone = true; longPatPet(p, tap); }, PAT_HOLD_MS);
  });
  // ปล่อยนิ้ว/เมาส์: ยังไม่ครบเวลา = นับเป็นแตะสั้น · ครบไปแล้ว = ลูบยาวจบไปแล้ว ไม่ต้องทำซ้ำ
  tap.addEventListener('pointerup', ()=>{
    cancel();
    if(longDone){ longDone = false; return; }
    shortPatPet(p, tap);
  });
  // นิ้วเลื่อนออกนอกตัวน้อง/ระบบยกเลิก touch → ยกเลิกทั้งคู่ (ไม่ให้เปิดโปรไฟล์ตอนตั้งใจจะลาก)
  tap.addEventListener('pointercancel', ()=>{ cancel(); longDone = false; });
  tap.addEventListener('pointerleave',  ()=>{ cancel(); longDone = false; });
}
function petBounce(tap, scale, deg, ms){
  tap.style.transform = `scale(${scale}) rotate(${deg}deg)`;
  setTimeout(()=>tap.style.transform = '', ms);
}
/* อารมณ์ที่ใช้เลือกโทนเสียงร้อง (รอบ 323) — เรียงตามความเร่งด่วน: ป่วย > หลับ > หิว > อิ่มดี
   ไข่ยังไม่ฟัก (level 1) ไม่ร้อง — ให้เสียงกลางๆ ไปก่อน */
function petMood(p){
  if(!p) return 'normal';
  if(p.sick) return 'sick';
  if(p.sleeping) return 'sleep';
  if(typeof petHungry === 'function' && petHungry(p)) return 'hungry';
  return p.level >= 2 ? 'happy' : 'normal';
}
function shortPatPet(p, tap){
  sfx.petVoice(p.type, petMood(p));   // 🔊 เหมียว/โฮ่ง/คำราม ตามชนิด + โทนตามอารมณ์
  petBounce(tap, 1.12, -4, 160);
  heartsFx(tap, 3);
  setTimeout(()=>{ if(!window.__piOverlay) openPetInfoOverlay(); }, 200);   // หน่วงให้เห็นน้องเด้ง/หัวใจก่อน
}
/* ลูบยาว: หัวใจฟุ้ง + เด้งนุ่มกว่า + ร้องเสียงดีใจ · โบนัส EXP ให้วันละครั้งต่อตัว (p.patDay)
   ไม่เรียก renderDashboard ระหว่างนิ้วยังจิ้มอยู่ — DOM ถูกสร้างใหม่กลางคันจะทำให้ pointerup หลุด */
function longPatPet(p, tap){
  sfx.petVoice(p.type, petMood(p));
  petBounce(tap, 1.06, 0, 420);
  heartsFx(tap, 10);
  if(state.haptic !== false && navigator.vibrate) navigator.vibrate([20,40,20]);
  const day = todayStr();
  if(p.patDay === day){
    toast(`${p.name} ฟินเลย 🥰 (โบนัสลูบยาววันนี้รับไปแล้ว พรุ่งนี้มาลูบใหม่นะ)`);
    return;
  }
  p.patDay = day;
  addExp(PAT_EXP, p);            // addExp จัดการเลื่อนเลเวล/กล่องฉลองให้เอง
  const streak = patStreakTick(day);
  saveState();
  toast(`🥰 ลูบ${p.name}จนฟิน! ได้ EXP +${PAT_EXP} (วันละครั้ง)`
    + (streak ? ` · 🔥 ลูบติดกัน ${streak} วัน` : ''));
}

/* 📅 ปฏิทินจุด 30 วันในหน้าโปรไฟล์น้อง (รอบ 325) — เด็กเห็น "ความต่อเนื่อง" เป็นภาพ
   จุดทึบ = วันที่ลูบน้อง · จุดจาง = วันที่ข้าม · วงขอบ = วันนี้ (ยังไม่ลูบก็เห็นว่ารอเรา) */
function patCalendarHTML(){
  const days = new Set(state.patDays || []);
  const today = todayStr();
  const cells = [];
  for(let i = 29; i >= 0; i--){
    const d = thDate(Date.now() - i*TH_DAY_MS);   // 🇹🇭 รอบ 988: ย้อนวันไทย (คีย์ต้องตรงกับ todayStr)
    const key = d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
    const cls = (days.has(key) ? ' on' : '') + (key === today ? ' today' : '');
    cells.push(`<span class="pi-dot${cls}" title="${key}"></span>`);
  }
  const now = patStreakNow();                 // 🔥 รอบ 1035: ค่าจริงตอนนี้ (ขาดแล้ว = 0) ไม่ใช่ค่าค้างจากวันที่ลูบล่าสุด
  const broke = !now && (state.patStreak || 0) > 0 && !!state.patStreakDay;
  const best = state.patStreakBest || 0;
  const badge = (typeof bffEmoji === 'function' && state.bffBadge) ? ` ${bffEmoji(state.bffBadge)}` : '';
  return `<div class="pi-streak">
    <div class="pi-streak-head">🔥 ลูบติดกัน <b>${fmtNum(now)}</b> วัน${badge}
      <span class="pi-streak-best">ดีสุด ${fmtNum(best)} วัน</span></div>
    <div class="pi-dots">${cells.join('')}</div>
    <div class="pi-streak-note">${days.has(today)
      ? 'วันนี้ลูบแล้ว เก่งมาก! 🥰'
      : broke
        ? `สตรีคขาดไปแล้ว (ลูบครั้งล่าสุด ${escapeHTML(state.patStreakDay)}) — ลูบวันนี้เริ่มนับใหม่ที่ 1 🐾`
        : 'วันนี้ยังไม่ได้ลูบ — กดค้างที่ตัวน้องในล็อบบี้ได้เลย 🐾'}</div>
  </div>`;
}

/* 🐾 สตรีคลูบยาว → เข็ม "เพื่อนซี้" (รอบ 323)
   นับ "วันละครั้ง" ไม่ว่าจะลูบกี่ตัว (สตรีคเป็นของผู้เล่น ไม่ใช่ของสัตว์รายตัว)
   ลูบต่อจากเมื่อวาน = +1 · ขาดไปเกิน 1 วัน = เริ่มนับใหม่ที่ 1 · เข็มที่ได้แล้วไม่หายแม้สตรีคขาด
   คืนจำนวนวันสตรีคปัจจุบัน (null = วันนี้นับไปแล้ว) */
/* 🔥 รอบ 1035: สตรีคที่ "ยังมีชีวิตอยู่จริง ณ ตอนนี้"
   state.patStreak เป็นค่าที่แช่แข็งไว้ตอนลูบครั้งล่าสุด — ไม่มีใครลดมันตอนสตรีคขาด
   ผลคือหยุดลูบไป 10 วัน หน้าโปรไฟล์ยังโชว์ "🔥 ลูบติดกัน 5 วัน" เหมือนเดิม (ผู้ใช้ทัก 5 ส.ค. 2026)
   → ทุกที่ที่ "แสดงผล" ต้องเรียกตัวนี้ ไม่ใช่อ่าน state ตรง ๆ (ค่าที่เก็บไม่แตะ เข็ม/สถิติดีสุดคงเดิม) */
function patDayKey(ms){
  const d = thDate(ms);
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}
function patStreakNow(){
  const last = state.patStreakDay || '';
  if(!last) return 0;
  return (last === patDayKey(Date.now()) || last === patDayKey(Date.now() - TH_DAY_MS)) ? (state.patStreak || 0) : 0;
}
function patStreakTick(day){
  if(state.patStreakDay === day) return null;                 // ลูบตัวที่ 2 ของวันเดียวกัน — ไม่นับซ้ำ
  const yd = thDate(Date.now() - TH_DAY_MS);      // 🇹🇭 รอบ 988: เมื่อวานตามวันไทย
  const yesterday = yd.getFullYear() + '-' + String(yd.getMonth()+1).padStart(2,'0') + '-' + String(yd.getDate()).padStart(2,'0');
  state.patStreak = (state.patStreakDay === yesterday) ? (state.patStreak || 0) + 1 : 1;
  state.patStreakDay = day;
  // 📅 รอบ 325: จำวันที่ลูบไว้ 30 วันล่าสุด → ปฏิทินจุดในหน้าโปรไฟล์น้อง (เก็บแค่ 30 กันเซฟบวม)
  if(!Array.isArray(state.patDays)) state.patDays = [];
  if(!state.patDays.includes(day)) state.patDays.push(day);
  if(state.patDays.length > 30) state.patDays = state.patDays.slice(-30);
  if(state.patStreak > (state.patStreakBest || 0)) state.patStreakBest = state.patStreak;
  const tier = BFF_TIERS.filter(t=>state.patStreak >= t[0]).pop();
  if(tier && tier[1] > (state.bffBadge || 0)){
    state.bffBadge = tier[1];
    const coin = BFF_COIN[tier[1]] || 0;
    if(coin) addCoins(coin);
    setTimeout(()=>{      // หน่วงให้ toast/หัวใจเล่นจบก่อนค่อยฉลองเข็ม (แพทเทิร์นเดียวกับเข็มนักเล่นขยัน)
      celebrateBadge(bffEmoji(tier[1]), `ได้${BFF_TIER_UI[tier[1]]}!`,
        `ลูบน้องติดกัน ${tier[0]} วัน — รับ 🪙${fmtNum(coin)} + เข็มติดท้ายชื่อให้เพื่อนเห็นทุกโลกเลย 🎉`);
      if(typeof checkCrown === 'function') checkCrown();
    }, 1200);
  }
  return state.patStreak;
}

function cureCelebrateFx(){
  const stage = document.querySelector('.hero-scene .pet-stage');
  if(stage){
    stage.classList.add('heal-bounce');   // no-anim: CSS ปิด animation ที่ .pet-wrap อยู่แล้ว
    setTimeout(()=>stage.classList.remove('heal-bounce'), 1300);
  }
  heartsFx(stage, 10);
}

/* ปุ่มรักษาด่วนในรางซ้าย: น้องป่วยตัวไหนก็รักษาได้จากปุ่มเดียว
   (ถ้าตัวที่ป่วยไม่ใช่ตัวที่เปิดอยู่ → สลับแท็บไปหาตัวนั้นก่อนแล้วรักษาเลย) */
function railCureClick(){
  let p = activePet();
  if(!p || !p.sick){
    const i = state.pets.findIndex(x=>x.sick);
    if(i < 0) return;
    state.active = i;
    renderDashboard();
  }
  curePet();
}

/* ข้อ 5.1: ขับพิษก่อนป่วย — พิษไม่ลดเอง จ่าย 1,000 ล้างบาร์พิษเป็น 0 */
function detoxPet(p){
  if(!p || !(p.toxin > 0) || p.sick) return;
  sfx.select();
  askConfirm(`<div style="font-size:56px;line-height:1">🧪</div>
    <div style="font-size:20px;font-weight:bold;margin-top:8px;color:#7a3ab0">ขับพิษให้${escapeHTML(p.name)}</div>
    <div style="margin-top:8px;color:#6a5a78;line-height:1.5">พิษสะสมตอนนี้ <b>${p.toxin}/${TOXIN_FULL}</b> — ถ้าเต็มหลอดน้องจะป่วยทันที<br>
    หมอจะล้างพิษให้เหลือ 0 ค่าขับพิษ <b>🪙${fmtNum(DETOX_COST)}</b> (มี 🪙${fmtNum(Math.floor(state.coins))})</div>`,
    `🧪 ขับพิษ 🪙${fmtNum(DETOX_COST)}`, ()=>{
      if(state.coins < DETOX_COST){ sfx.wrong(); toast(`ค่าขับพิษ 🪙${fmtNum(DETOX_COST)} — เหรียญไม่พอ ไปเล่นเกมเก็บเหรียญก่อนนะ`); return; }
      state.coins -= DETOX_COST;
      p.toxin = 0;
      sfx.levelup();
      toast(`🧪 ขับพิษเรียบร้อย! ${p.name}ตัวเบาสบายแล้ว — เลือกอาหารดีๆ ให้น้องนะ`);
      saveState();
      renderDashboard();
    });
}

/* ============================================================
   🛡️ ควิซอาหารปลอดภัย (ต่อยอดข้อ 5.1)
   ทายว่า "ให้สัตว์ชนิดนี้กินอาหารนี้ได้ไหม" 5 ข้อ/รอบ — เฉลยพร้อมเหตุผลจริง (food.why)
   รางวัลเฉพาะรอบแรกของวัน (+10/ข้อ +25 ถูกครบ) เล่นซ้ำเป็นรอบฝึกซ้อม
   ============================================================ */
function openFoodQuiz(){
  sfx.select();
  const today = thDayKey();                    // 🇹🇭 รอบ 988: วันไทย
  if(state.foodQuizPlayDay !== today){ state.foodQuizPlayDay = today; state.foodQuizPlayCount = 0; }
  if(state.foodQuizPlayCount >= FOODQUIZ_MAX_PLAYS){
    const full = document.createElement('div');
    full.className = 'levelup-overlay';
    full.innerHTML = `<div class="levelup-box fq-box">
      <h2>🛡️ ควิซอาหารปลอดภัย</h2>
      <div style="font-size:44px;margin:6px 0">😴</div>
      <div class="fq-ask">วันนี้เล่นครบ ${FOODQUIZ_MAX_PLAYS} รอบแล้ว</div>
      <div class="fq-why">พรุ่งนี้กลับมาเล่นใหม่ได้นะ</div>
      <div class="fq-btns"><button class="fq-next">ปิด</button></div>
    </div>`;
    document.body.appendChild(full);
    full.querySelector('.fq-next').addEventListener('click', ()=>full.remove());
    return;
  }
  state.foodQuizPlayCount++;
  saveState();
  // 🪙 รอบ 753: เพดาน 2 รอบ/วัน (ด้านบน) คุมการฟาร์มเหรียญอยู่แล้ว → ทุกรอบที่เล่นได้ถือเป็นรอบได้รางวัลเท่ากันหมด
  // (เดิมแยก "รอบแรก=ได้เหรียญ" vs "รอบซ้ำ=ฝึกซ้อมไม่ได้เหรียญ" ทำให้รอบสองไม่มีภาพ/เสียงเงินเข้าเลย ผู้ใช้แจ้งว่าไม่ชัดเจน)
  // สุ่มคู่ (สัตว์, อาหาร) ไม่ซ้ำกันในรอบ — คละให้มีทั้งข้อ "กินได้" และ "เป็นโทษ"
  const combos = [];
  for(const type of Object.keys(PETS)) for(const f of FOODS) combos.push({type, f});
  const qs = shuffle(combos).slice(0, FOODQUIZ_Q);
  let idx = 0, score = 0, earned = 0;

  const overlay = document.createElement('div');
  overlay.className = 'levelup-overlay';
  document.body.appendChild(overlay);

  const renderQ = ()=>{
    const q = qs[idx];
    const conf = PETS[q.type];
    overlay.innerHTML = `<div class="levelup-box fq-box">
      <h2>🛡️ ควิซอาหารปลอดภัย</h2>
      <p class="fq-progress">ข้อ ${idx+1}/${FOODQUIZ_Q} · ถูกแล้ว ${score} ข้อ</p>
      <div class="fq-pair"><span>${conf.adult}</span><span class="fq-q">❓</span><span>${q.f.emoji}</span></div>
      <div class="fq-ask">ให้<b>${conf.name}</b>กิน <b>${q.f.emoji} ${q.f.name}</b> (${q.f.en}) ได้ไหม?</div>
      <div class="fq-btns">
        <button class="fq-yes">✅ ให้กินได้</button>
        <button class="fq-no">🚫 ไม่ควรให้</button>
      </div>
      <button class="food-cancel fq-quit">เลิกเล่น</button>
    </div>`;
    overlay.querySelector('.fq-quit').addEventListener('click', ()=>overlay.remove());
    const answer = saidYes=>{
      const bad = foodBadFor(q.f, q.type);
      const correct = saidYes !== bad;        // กินได้=ตอบใช่ถูกเมื่อไม่เป็นโทษ
      const gain = correct ? FOODQUIZ_COIN : 0;
      if(correct){ score++; earned += gain; addCoins(gain); saveState(); }
      const reason = bad
        ? (foodWhy(q.f, q.type) || 'อาหารนี้เป็นโทษกับสัตว์ชนิดนี้')
        : (q.f.human ? `${q.f.name}เป็นอาหารคนก็จริง แต่${conf.name}กินได้ ไม่เป็นโทษ` : `${q.f.name}เป็นอาหารที่ปลอดภัยสำหรับสัตว์ทุกตัว`);
      overlay.innerHTML = `<div class="levelup-box fq-box">
        <h2>${correct ? '🎉 ถูกต้อง!' : '💦 ยังไม่ใช่'}</h2>
        <div class="fq-pair"><span>${conf.adult}</span><span class="fq-q">${bad ? '🚫' : '✅'}</span><span>${q.f.emoji}</span></div>
        <div class="fq-ask"><b>${bad ? `ไม่ควรให้${conf.name}กิน${q.f.name}` : `${conf.name}กิน${q.f.name}ได้`}</b></div>
        <div class="fq-why">${escapeHTML(reason)}</div>
        ${gain ? `<div class="feed-gain fq-gain">ได้เหรียญ +${gain} 🪙</div>` : ''}
        <div class="fq-why fq-sndnote"></div>
        <div class="fq-btns"><button class="fq-next">${idx+1 < FOODQUIZ_Q ? 'ข้อต่อไป ➡️' : 'ดูผล 🏁'}</button></div>
        <button class="food-cancel fq-quit">เลิกเล่น</button>
      </div>`;
      overlay.querySelector('.fq-quit').addEventListener('click', ()=>overlay.remove());
      // 🪙 ตอบถูก+ได้เหรียญ → ภาพเหรียญบินเข้ากระเป๋า + เสียงเงินเข้าชัดเจนทันที (ไม่ต้องรอจบรอบ)
      if(gain){
        coinFlyFx(overlay.querySelector('.fq-pair'), gain);
        if(sfx.coinGet) sfx.coinGet();
        if(typeof renderDashboard === 'function') renderDashboard();   // ตัวเลขเหรียญบนแถบบนอัปเดตทันที ให้เห็นตรงกับภาพเหรียญที่บิน
        /* 🔎 กฎทองข้อ 1: เช็ก "หลัง" ลองเล่นเสียงจริงแล้ว (resume เป็น async — เช็กทันทีจะเตือนผิด
           ทั้งที่เสียงกำลังจะดัง) → เงียบจริงเมื่อไหร่ ให้จอบอกเหตุผลเอง ไม่ต้องเดาข้ามเครื่อง */
        setTimeout(()=>{
          const note = overlay.querySelector('.fq-sndnote');
          if(note && typeof soundStatus === 'function') note.textContent = soundStatus();
        }, 400);
      } else sfx.wrong();
      overlay.querySelector('.fq-next').addEventListener('click', ()=>{
        idx++;
        if(idx < FOODQUIZ_Q) renderQ(); else renderEnd();
      });
    };
    overlay.querySelector('.fq-yes').addEventListener('click', ()=>answer(true));
    overlay.querySelector('.fq-no').addEventListener('click', ()=>answer(false));
  };

  const renderEnd = ()=>{
    let bonus = 0;
    if(score === FOODQUIZ_Q){ bonus = FOODQUIZ_BONUS; addCoins(bonus); }
    const coins = earned + bonus;
    saveState();
    const playsLeft = FOODQUIZ_MAX_PLAYS - state.foodQuizPlayCount;
    if(score === FOODQUIZ_Q) sfx.levelup(); else sfx.select();
    overlay.innerHTML = `<div class="levelup-box fq-box">
      <h2>${score === FOODQUIZ_Q ? '🏆 สุดยอดผู้พิทักษ์!' : '🏁 จบรอบแล้ว'}</h2>
      <div style="font-size:44px;margin:6px 0">${score === FOODQUIZ_Q ? '🛡️✨' : '🛡️'}</div>
      <div class="fq-ask">ตอบถูก <b>${score}/${FOODQUIZ_Q}</b> ข้อ</div>
      ${coins > 0 ? `<div class="feed-gain">ได้เหรียญรวม +${fmtNum(coins)} 🪙${bonus > 0 ? ` (รวมโบนัสครบทุกข้อ +${FOODQUIZ_BONUS}!)` : ''}</div>` : ''}
      <div class="fq-btns">
        ${playsLeft > 0 ? `<button class="fq-again">เล่นอีกรอบ 🔁 (เหลือวันนี้ ${playsLeft})</button>` : ''}
        <button class="fq-next">ปิด</button>
      </div>
      ${playsLeft <= 0 ? `<div class="fq-why">เล่นครบ ${FOODQUIZ_MAX_PLAYS} รอบวันนี้แล้ว พรุ่งนี้มาใหม่นะ</div>` : ''}
    </div>`;
    if(bonus > 0){ coinFlyFx(overlay.querySelector('.fq-ask'), bonus); if(sfx.coinGet) sfx.coinGet(); if(typeof renderDashboard === 'function') renderDashboard(); }
    const againBtn = overlay.querySelector('.fq-again');
    if(againBtn) againBtn.addEventListener('click', ()=>{ overlay.remove(); openFoodQuiz(); });
    overlay.querySelector('.fq-next').addEventListener('click', ()=>{ overlay.remove(); renderDashboard(); });
  };

  renderQ();
}

/* ============================================================
   🎀 ตู้เสื้อผ้าสัตว์เลี้ยง — ใช้สวมเฉพาะของที่ซื้อมาแล้ว
   ของใหม่ต้องขับรถไปซื้อที่ร้านแฟชั่นในโลก Pet Shopping 3D
   ============================================================ */
function closeDressUpBoard(){
  const ov = document.querySelector('.dress-overlay');
  if(ov) ov.remove();
}
function dressItemRarity(item){
  if(item.rarity) return item.rarity;
  if(item.price >= 25000) return 'legendary';
  if(item.price >= 4000) return 'epic';
  if(item.price >= 1500) return 'rare';
  return 'common';
}
function dressRarityLabel(rarity){
  return ({common:'คลาสสิก',rare:'หายาก',epic:'มหัศจรรย์',legendary:'ตำนาน'})[rarity] || 'คลาสสิก';
}
function dressSlotLabel(slot){
  return ({head:'ศีรษะ',face:'ใบหน้า',neck:'คอ',body:'เสื้อผ้า'})[slot] || 'เครื่องแต่งกาย';
}
function openDressUpBoard(){
  /* ⚔️ รอบ 1292: ตู้ใน Lobby และร้านแฟชั่น 3D ใช้แคตตาล็อกใหญ่ชุดเดียวกัน
     ผู้เล่นจึงลากดู → ลองใส่ → กรอก PIN 6 หลักได้จากหน้าที่ผู้ใช้ชี้ในภาพทันที */
  if(typeof PetPantry!=='undefined' && typeof PetPantry.openStore==='function'){
    PetPantry.openStore('fashion',{closet:true});
    return;
  }
  closeDressUpBoard();   // กันซ้อนถ้าเผลอเปิดซ้ำ
  const overlay = document.createElement('div');
  overlay.className = 'levelup-overlay dress-overlay';
  overlay.innerHTML = `<div class="levelup-box wl-box">
    <div class="wl-head">
      <div class="dress-title">
        <span class="dress-kicker">✨ ของที่มีอยู่ในตู้</span>
        <h2>🎀 ตู้เสื้อผ้าของน้อง</h2>
        <p>เลือกใส่ได้ครั้งละ 1 ชิ้น • ของที่ยังไม่มีต้องขับรถไปซื้อที่ร้านแฟชั่น</p>
      </div>
      <div class="dress-wallet">🪙 <b>${fmtNum(state.coins)}</b></div>
      <button class="dress-trip-btn" id="dress-shop-trip">🚗 ไปซื้อของใหม่</button>
      <button class="cf-ok" id="dress-done">เสร็จแล้ว ✅</button>
    </div>
    <div id="shop-grid-wrap"></div>
  </div>`;
  document.body.appendChild(overlay);
  renderShop();
  document.getElementById('dress-done').addEventListener('click', closeDressUpBoard);
  document.getElementById('dress-shop-trip').addEventListener('click', ()=>{
    closeDressUpBoard();
    enterPetShopping3D('fashion');
  });
  overlay.addEventListener('click', e=>{ if(e.target === overlay) closeDressUpBoard(); });
  sfx.select();
}
function renderShop(){
  const wrap = document.getElementById('shop-grid-wrap');
  if(!wrap) return;   // ไม่ได้เปิดห้องแต่งตัวอยู่ (renderDashboard เรียกทุกรอบเฉย ๆ)
  const p = activePet();
  if(!p){
    wrap.innerHTML = `<div class="lock-banner">🔒 ยังไม่มีสัตว์เลี้ยง — รับน้องจากร้านสัตว์เลี้ยงก่อน แล้วค่อยมาช้อปกันนะ</div>`;
    return;
  }
  if(petStage(p) === 'egg'){
    wrap.innerHTML = `<div class="lock-banner">🔒 น้องยังเป็น${PETS[p.type].startKey==='egg'?'ไข่':'เด็กแรกเกิด'}อยู่ ยังใส่เครื่องแต่งตัวไม่ได้<br>เล่นเกมให้น้องโตถึง Lv.2 ก่อนนะ</div>`;
    return;
  }
  wrap.innerHTML = `<div class="shop-grid" id="shop-grid"></div>`;
  const grid = document.getElementById('shop-grid');
  grid.innerHTML = ITEMS.map(item=>{
    const owned = state.owned.includes(item.id);
    const equipped = p.equipped && p.equipped[item.slot] === item.id;
    const rarity = dressItemRarity(item);
    const art = item.img
      ? `<img class="it-art" src="${item.img}" alt="${item.name}" loading="lazy">`
      : `<span class="it-emoji" aria-hidden="true">${item.emoji}</span>`;
    let cls = `shop-item rarity-${rarity}`;
    let action = `<span class="it-price">🚗 ร้านแฟชั่น · 🪙${fmtNum(item.price)}</span>`;
    if(equipped){ cls += ' equipped'; action = `<span class="it-tag tag-on">✓ ใส่อยู่</span>`; }
    else if(owned){ cls += ' owned'; action = `<span class="it-tag tag-wear">ลองสวม</span>`; }
    else cls += ' shop-trip-only';
    return `<div class="${cls}" data-item="${item.id}" data-rarity="${rarity}">
      <div class="it-topline">
        <span class="it-rarity">◆ ${dressRarityLabel(rarity)}</span>
        <span class="it-type">${dressSlotLabel(item.slot)}</span>
      </div>
      <div class="it-art-stage">${art}<i class="it-sparkle" aria-hidden="true"></i></div>
      <span class="it-name">${item.name}</span>
      <div class="it-action">${action}</div>
      ${soldBadge('item_'+item.id)}
    </div>`;
  }).join('');

  grid.querySelectorAll('.shop-item').forEach(el=>{
    el.addEventListener('click', ()=>{
      const item = ITEMS.find(i=>i.id===el.dataset.item);
      const owned = state.owned.includes(item.id);
      if(!owned){
        closeDressUpBoard();
        toast(`🚗 ${item.name} มีขายที่ร้านแฟชั่น — ขับรถพาน้องไปเลือกซื้อกัน!`, 2600);
        enterPetShopping3D('fashion');
        return;
      }
      const wasOn = (p.equipped || {})[item.slot] === item.id;
      p.equipped = {};
      if(!wasOn) p.equipped[item.slot] = item.id;
      sfx.select();
      saveState();
      renderDashboard();
      closeDressUpBoard();   // รอบ 635: ซื้อ/สวมเสร็จ → ปิดห้องแต่งตัว เด้งกลับไปเห็นน้องใส่ชุดใหม่ตัวใหญ่ทันที (ฟีลห้องลองชุด)
      openPetInfoOverlay();
    });
  });
}

/* ============================================================
   ที่พัก (หลบแดด/หลบฝน) + เครื่องปรับอากาศ
   ============================================================ */
function homeVisualHTML(h, cls, decayed, dark, nowater){
  // ถูกตัดไฟ: ภาพ _dark / ถูกตัดน้ำ: ภาพ _nowater / เสื่อมสภาพ: ภาพ _decayed
  // ไม่มีภาพใช้ฟิลเตอร์แทน (เฉพาะมืด/หม่น — ตัดน้ำไม่มีฟิลเตอร์ ใช้ tag+กล่องบิลบอก)
  const dImg = (dark && IMG_FILES[`home_${h.id}_dark`])
            || (nowater && IMG_FILES[`home_${h.id}_nowater`])
            || (decayed && IMG_FILES[`home_${h.id}_decayed`]) || null;
  const img = dImg || IMG_FILES[`home_${h.id}`];
  const dCls = dark && !IMG_FILES[`home_${h.id}_dark`] ? ' home-dark-img'
             : (decayed && !dImg ? ' home-decayed-img' : '');
  return img ? `<img class="${cls}${dCls}" src="${img}" alt="${h.name}">`
             : `<span class="${cls} home-emoji${dCls}">${decayed ? '🏚️' : h.emoji}</span>`;
}

/* ฉากบ้านพัง (ค้างค่าบำรุงข้ามเดือน — billTick ตั้ง state.pendingRuin ไว้) */
function showHomeRuined(){
  const h = homeInfo(state.pendingRuin);
  state.pendingRuin = null;
  saveState();
  if(!h) return;
  const img = IMG_FILES[`home_${h.id}_ruined`];
  const overlay = document.createElement('div');
  overlay.className = 'levelup-overlay';
  overlay.innerHTML = `<div class="levelup-box">
    <h2>💥 บ้านพังแล้ว!</h2>
    <div class="feed-pet">${img ? `<img src="${img}" alt="">` : '🏚️'}</div>
    <p style="font-size:15px;margin:8px 0">${h.emoji} <b>${h.name}</b> ค้างค่าบำรุงจนสิ้นเดือน<br>
    บ้านเลยทรุดโทรมจนพังทลายลงมา...<br>
    ตอนนี้น้องกลายเป็น<b>ผู้ไม่มีที่อยู่อาศัย</b> 😢<br>ต้องเก็บเหรียญหาซื้อที่พักใหม่นะ</p>
    <button>เข้าใจแล้ว 😢</button>
  </div>`;
  overlay.querySelector('button').addEventListener('click', ()=>{ overlay.remove(); renderDashboard(); });
  document.body.appendChild(overlay);
}

/* กล่องเตือนบริการถูกตัด (ค่าไฟ/น้ำ/เน็ต/ข้อมูล — billTick ตั้ง state.pendingCut ไว้) */
function showCutNotice(){
  const ids = (state.pendingCut || []).filter(id => UTILITY_UI[id]);
  state.pendingCut = [];
  saveState();
  if(!ids.length) return;
  const rows = ids.map(id=>{
    const u = UTILITY_UI[id];
    return `<div style="margin-top:10px;text-align:left;background:#fbeceb;border-radius:12px;padding:9px 12px">
      <div style="font-weight:bold;color:#b23a48">${u.cutIcon} ${u.cutName}</div>
      <div style="color:#6a5a78;font-size:13.5px;line-height:1.45;margin-top:2px">${u.cutMsg}</div>
    </div>`;
  }).join('');
  alertBox(`<div style="font-size:52px;line-height:1">⚠️</div>
    <div style="font-size:20px;font-weight:bold;margin-top:6px;color:#b23a48">มีบริการถูกตัดแล้ว!</div>
    <div style="color:#6a5a78;margin-top:4px;font-size:13.5px;line-height:1.45">ค้างจ่ายข้ามเดือนเลยโดนตัด — รีบไปจ่ายบิลค้างที่การ์ดบ้าน/มือถือ/คอม เพื่อให้กลับมาใช้ได้นะ</div>
    ${rows}`, 'ไปจ่ายบิล');
}

function renderHomeCard(){
  if(state.pendingRuin) showHomeRuined();
  const el = document.getElementById('home-card');
  const h = homeInfo(state.home);
  const w = weatherNow();
  let body;
  if(!h){
    body = `
      <div class="home-current none">
        <span class="home-emoji">🌳</span>
        <div>
          <b>ยังไม่มีที่พัก</b><br>
          <small>น้องต้องตากแดดตากฝน (ตอนนี้${w.emoji} ${w.name}) — ความร้อนสะสมจะทำให้น้องป่วยทุก 6 ชม.</small>
        </div>
      </div>
      <button class="big-btn blue home-btn" id="btn-home-shop">🏠 หาที่พักให้น้อง (เริ่มต้น 🪙${fmtNum(HOMES[0].price)})</button>`;
  }else{
    const acWorks = h.builtinAC || (h.canAC && state.ac);
    const acState = state.powerCut
      ? (acWorks ? '🔌 ไฟถูกตัด แอร์ใช้ไม่ได้ — น้องร้อนแล้ว!' : '🔌 ไฟถูกตัด บ้านมืดทั้งหลัง')
      : h.builtinAC ? '❄️ มีแอร์ในตัว เย็นสบาย'
      : h.canAC ? (state.ac ? '❄️ ติดแอร์แล้ว เย็นสบาย' : '🥵 ยังไม่มีแอร์ — น้องยังร้อนอยู่')
      : '🥵 ไม่มีผนัง ติดแอร์ไม่ได้ — กันฝนได้ แต่กันร้อนไม่ได้';

    /* ---- บิลค่าบำรุงรายเดือน (0.5% ของราคาบ้าน ออกทุกวันที่ 1) ---- */
    const due = billOutstanding('maint');
    const decayed = homeDecayed();
    const nowD = thDate();                        // 🇹🇭 รอบ 988: เดือนตามปฏิทินไทย
    const lastDay = new Date(nowD.getFullYear(), nowD.getMonth()+1, 0).getDate();
    let billUI;
    if(due > 0 && decayed){
      billUI = `<div class="bill-box overdue">🏚️ <b>บ้านทรุดโทรมแล้ว!</b> เพราะค้างค่าบำรุงเกินวันที่ ${DECAY_DAY}<br>
        รีบจ่าย 🪙${fmtNum(due)} ภายในสิ้นเดือน (วันที่ ${lastDay}) ไม่งั้น<b>บ้านจะพัง</b>และไม่มีที่อยู่!</div>
        <button class="big-btn home-btn" id="btn-pay-maint">💸 จ่ายค่าบำรุงบ้าน 🪙${fmtNum(due)}</button>`;
    }else if(due > 0){
      billUI = `<div class="bill-box">📋 <b>บิลค่าบำรุงบ้านเดือนนี้ 🪙${fmtNum(due)}</b><br>
        จ่ายก่อนวันที่ ${DECAY_DAY} ไม่งั้นบ้านจะทรุดโทรม และถ้าค้างถึงสิ้นเดือนบ้านจะพังนะ</div>
        <button class="big-btn home-btn" id="btn-pay-maint">💸 จ่ายค่าบำรุงบ้าน 🪙${fmtNum(due)}</button>`;
    }else if(state.bills.maint && state.bills.maint.due > 0){
      billUI = `<div class="bill-box paid">✅ จ่ายค่าบำรุงเดือนนี้แล้ว — บิลหน้ามาวันที่ 1</div>`;
    }else{
      billUI = `<div class="bill-box paid">🆓 เดือนแรกฟรีค่าบำรุง — ตั้งแต่เดือนหน้า บิล 🪙${fmtNum(maintCost(h.id))}/เดือน มาทุกวันที่ 1</div>`;
    }

    /* ---- บิลสาธารณูปโภครายเดือน (ค่าไฟ/ค่าน้ำ — เน็ตอยู่การ์ดมือถือ) ---- */
    const utilUI = HOME_UTILITIES.map(id=>utilityBillUI(id, h, lastDay)).join('');
    const trashUI = trashBillUI(h, lastDay);
    const trashFine = (billOutstanding('trash') > 0 && state.bills.trash) ? (state.bills.trash.fine || 0) : 0;
    const cutTags = HOME_UTILITIES
      .filter(id=>state[UTILITIES[id].cutKey])
      .map(id=>` <span class="it-tag tag-off">${UTILITY_UI[id].cutName}</span>`).join('')
      + (trashFine > 0 ? ' <span class="it-tag tag-off">ค้างค่าขยะ</span>' : '');

    // รอบ 187: ผังใหม่ — ภาพบ้านใหญ่เต็มฝั่งซ้าย · ข้อมูล+บิลจัดเป็นระเบียบฝั่งขวา
    body = `
      <div class="home-layout">
        <div class="home-pic-col">
          ${homeVisualHTML(h, 'home-img-big', decayed, state.powerCut, state.waterCut)}
        </div>
        <div class="home-info-col">
          <div class="home-name-row"><b>${h.emoji} ${h.name}</b>${decayed ? ' <span class="it-tag tag-off">ทรุดโทรม</span>' : ''}${cutTags}</div>
          <div class="home-desc-row"><small>${h.desc}</small></div>
          <div class="home-ac-row"><small>${acState}</small></div>
          ${billUI}
          ${utilUI}
          ${trashUI}
          ${h.canAC && !state.ac ? `<button class="big-btn blue home-btn" id="btn-buy-ac">❄️ ซื้อ+ติดตั้งแอร์ (🪙${fmtNum(AC_PRICE)} + ค่าติดตั้ง 🪙${fmtNum(AC_INSTALL)})</button>${soldBadge('ac')}` : ''}
          ${state.home !== 'castle' ? `<button class="big-btn purple home-btn" id="btn-home-shop">🏠 อัปเกรดที่พัก</button>` : ''}
        </div>
      </div>`;
  }
  el.innerHTML = `<h3 class="shop-title">🏠 ที่พักหลบแดดหลบฝน</h3>${body}`;
  const shopBtn = document.getElementById('btn-home-shop');
  if(shopBtn) shopBtn.addEventListener('click', openHomeShop);
  const acBtn = document.getElementById('btn-buy-ac');
  if(acBtn) acBtn.addEventListener('click', buyAC);
  const payBtn = document.getElementById('btn-pay-maint');
  if(payBtn) payBtn.addEventListener('click', payMaint);
  const payTrashBtn = document.getElementById('btn-pay-trash');
  if(payTrashBtn) payTrashBtn.addEventListener('click', payTrash);
  el.querySelectorAll('.btn-pay-utility').forEach(b=>b.addEventListener('click', ()=>payUtility(b.dataset.u)));
  el.querySelectorAll('.btn-fix-utility').forEach(b=>b.addEventListener('click', ()=>buyUtilityFix(b.dataset.u)));
}

function payMaint(){
  const due = billOutstanding('maint');
  if(due <= 0) return;
  if(state.coins < due){
    sfx.wrong(); toast(`ค่าบำรุงบ้าน 🪙${fmtNum(due)} — เหรียญไม่พอ ไปเล่นเกมเก็บเหรียญก่อนนะ!`); return;
  }
  state.coins -= due;
  state.bills.maint.paid = state.bills.maint.due;
  sfx.buy();
  toast('💸 จ่ายค่าบำรุงเรียบร้อย! บ้านกลับมาสภาพดีเหมือนเดิม 🏠✨');
  saveState();
  renderDashboard();
}

/* ---- บิลค่าจัดการขยะ (ข้อ 13): ไม่มี cutKey/fixKey เลยไม่เข้าเครื่อง UTILITIES
   ค้างข้ามเดือน → ค่าปรับ +500 ทบสะสม (เก็บใน bills.trash.fine) ไม่ตัด/ไม่พัง ---- */
function trashBillUI(h, lastDay){
  const due = billOutstanding('trash');
  const b = state.bills.trash;
  const fine = b ? (b.fine || 0) : 0;
  if(due > 0){
    const note = fine > 0
      ? `<br><b>⚠️ รวมค่าปรับค้างจ่ายสะสม 🪙${fmtNum(fine)}</b> — โดนปรับเพิ่ม +🪙${fmtNum(TRASH_FINE)} ทุกเดือนที่ยังไม่จ่าย (ขยะไม่ถูกตัด บ้านไม่พังนะ)`
      : `<br>จ่ายภายในสิ้นเดือน (วันที่ ${lastDay}) ไม่งั้นโดน<b>ค่าปรับ +🪙${fmtNum(TRASH_FINE)}</b> เดือนหน้า (แต่ขยะไม่ถูกตัด บ้านไม่พัง)`;
    return `<div class="bill-box${fine > 0 ? ' overdue' : ''}">🗑️ <b>บิลค่าจัดการขยะเดือนนี้ 🪙${fmtNum(due)}</b>${note}</div>
      <button class="big-btn home-btn" id="btn-pay-trash">🗑️ จ่ายค่าจัดการขยะ 🪙${fmtNum(due)}</button>`;
  }
  if(b && b.due > 0){
    return `<div class="bill-box paid">✅ จ่ายค่าจัดการขยะเดือนนี้แล้ว — บิลหน้ามาวันที่ 1</div>`;
  }
  return `<div class="bill-box paid">🆓 เดือนแรกฟรีค่าจัดการขยะ — ตั้งแต่เดือนหน้า บิล 🪙${fmtNum(trashCost(h.id))}/เดือน มาทุกวันที่ 1</div>`;
}

function payTrash(){
  const due = billOutstanding('trash');
  if(due <= 0) return;
  if(state.coins < due){
    sfx.wrong(); toast(`ค่าจัดการขยะ 🪙${fmtNum(due)} — เหรียญไม่พอ ไปเล่นเกมเก็บเหรียญก่อนนะ!`); return;
  }
  state.coins -= due;
  state.bills.trash.paid = state.bills.trash.due;
  state.bills.trash.fine = 0;               // จ่ายครบ ค่าปรับสะสมหายหมด
  sfx.buy();
  toast('🗑️ จ่ายค่าจัดการขยะเรียบร้อย! เมืองสะอาด ไม่มีค่าปรับค้างแล้ว ✨');
  saveState();
  renderDashboard();
}

/* ============================================================
   บิลสาธารณูปโภค (ค่าไฟ/ค่าน้ำ — เครื่องยนต์อยู่ใน state.js: UTILITIES/billTick)
   config ข้อความ+ปุ่มต่อชนิด · onRestored = ทำอะไรตอนจ่ายบิลค้างครบแล้วกลับมาใช้ได้
   ============================================================ */
const UTILITY_UI = {
  elec:{
    icon:'⚡', name:'ค่าไฟ', cost: elecCost,
    cutName:'ถูกตัดไฟ', cutIcon:'🔌',
    cutMsg:'บ้านมืดทั้งหลัง แอร์ใช้ไม่ได้ น้องจะร้อนสะสมจนป่วย 🥵',
    warnMsg:'ไม่งั้นจะ<b>ถูกตัดไฟ</b> บ้านมืด แอร์ใช้ไม่ได้เลยนะ',
    fixIcon:'⚙️', fixName:'หม้อแปลงใหม่', fixVerb:'ซื้อ', fixCost: TRANSFORMER_COST,
    fixBrokenMsg:'หม้อแปลงพังไปด้วย',
    fixedToast:'⚙️ ได้หม้อแปลงใหม่แล้ว! จ่ายค่าไฟค้างให้ครบ ไฟก็จะกลับมานะ',
    needFixToast:'⚙️ หม้อแปลงพังอยู่ ต้องซื้อหม้อแปลงใหม่ก่อน ถึงจะจ่ายค่าไฟค้างได้นะ',
    paidToast:'⚡ จ่ายค่าไฟเรียบร้อย! เดือนนี้ไฟสว่างสบายใจ ✨',
    restoredToast:'⚡ ไฟกลับมาแล้ว! บ้านสว่าง แอร์กลับมาเย็นฉ่ำ 🎉',
    onRestored(){ if(heatProtected()) for(const p of state.pets) p.heatFrom = null; },
  },
  water:{
    icon:'🚰', name:'ค่าน้ำ', cost: waterCost,
    cutName:'ถูกตัดน้ำ', cutIcon:'🚱',
    cutMsg:'น้องไม่มีน้ำกิน-อาบ ขาดน้ำสะสมจนป่วยได้ (มังกรก็ต้องกินน้ำนะ)',
    warnMsg:'ไม่งั้นจะ<b>ถูกตัดน้ำ</b> น้องไม่มีน้ำกิน-อาบเลยนะ',
    fixIcon:'🔧', fixName:'ติดตั้งระบบน้ำใหม่', fixVerb:'จ่ายค่า', fixCost: WATER_INSTALL_COST,
    fixBrokenMsg:'ระบบน้ำเสียหายไปด้วย',
    fixedToast:'🔧 ติดตั้งระบบน้ำใหม่แล้ว! จ่ายค่าน้ำค้างให้ครบ น้ำก็จะไหลนะ',
    needFixToast:'🔧 ระบบน้ำเสียอยู่ ต้องจ่ายค่าติดตั้งระบบน้ำใหม่ก่อน ถึงจะจ่ายค่าน้ำค้างได้นะ',
    paidToast:'🚰 จ่ายค่าน้ำเรียบร้อย! เดือนนี้น้ำไหลสบายใจ ✨',
    restoredToast:'🚰 น้ำกลับมาไหลแล้ว! น้องมีน้ำกิน-อาบ สดชื่นสุดๆ 🎉',
    onRestored(){ for(const p of state.pets) p.thirstFrom = null; },
  },
  net:{
    icon:'📶', name:'ค่าเน็ต', cost: netCost,
    cutName:'ถูกตัดเน็ต', cutIcon:'📵',
    cutMsg:'มือถือใช้เน็ตไม่ได้ <b>โบนัสจับคู่ +5 เหรียญ/ข้อ ถูกระงับ</b> จนกว่าจะจ่ายครบ',
    warnMsg:'ไม่งั้นจะ<b>ถูกตัดเน็ต</b> โบนัสมือถือ +5/ข้อ หายไปเลยนะ',
    // ไม่มี fixKey — จ่ายบิลค้างได้เลย ไม่ต้องซื้ออุปกรณ์ใหม่
    paidToast:'📶 จ่ายค่าเน็ตเรียบร้อย! เดือนนี้เน็ตแรงเต็มสปีด ✨',
    restoredToast:'📶 เน็ตกลับมาแล้ว! โบนัสมือถือ +5/ข้อ ใช้ได้เหมือนเดิม 🎉',
    onRestored(){},
  },
  data:{
    icon:'📡', name:'ค่าบริการข้อมูล', cost: dataCost,
    cutName:'ถูกตัดบริการข้อมูล', cutIcon:'🔇',
    cutMsg:'คอมพิวเตอร์ออนไลน์ไม่ได้ <b>รายได้ +0.01 เหรียญ/วิ หยุดนิ่ง</b> จนกว่าจะจ่ายครบ 5,000',
    warnMsg:'ไม่งั้นจะ<b>ถูกตัดบริการข้อมูล</b> รายได้จากคอมหยุดเดินเลยนะ',
    // ไม่มี fixKey — จ่ายบิลค้างได้เลย
    paidToast:'📡 จ่ายค่าบริการข้อมูลเรียบร้อย! คอมออนไลน์ทำเงินต่อ ✨',
    restoredToast:'📡 บริการข้อมูลกลับมาแล้ว! เหรียญกลับมาเพิ่ม +0.01/วิ เหมือนเดิม 🎉',
    onRestored(){ state.compSince = Date.now(); },   // เริ่มเดินเข็มรายได้ใหม่ตั้งแต่ตอนนี้
  },
};

function utilityBillUI(id, h, lastDay){
  const u = UTILITY_UI[id], reg = UTILITIES[id];
  const due = billOutstanding(id);
  const cut = state[reg.cutKey], fixed = reg.fixKey ? state[reg.fixKey] : true;
  if(cut){
    return `<div class="bill-box overdue">${u.cutIcon} <b>${u.cutName}แล้ว!</b> เพราะค้าง${u.name}จนสิ้นเดือน<br>
      ${u.cutMsg}<br>
      ${fixed
        ? `${reg.fixKey ? `${u.fixIcon} ${u.fixName}พร้อมแล้ว — ` : ''}จ่าย${u.name}ค้าง 🪙${fmtNum(due)} ให้กลับมาใช้ได้!`
        : `${u.fixBrokenMsg} ต้อง${u.fixVerb}<b>${u.fixName} 🪙${fmtNum(u.fixCost)}</b>ก่อน จึงจะจ่าย${u.name}ค้าง 🪙${fmtNum(due)} ได้`}</div>
      ${fixed
        ? `<button class="big-btn home-btn btn-pay-utility" data-u="${id}">${u.icon} จ่าย${u.name}ค้าง 🪙${fmtNum(due)}</button>`
        : `<button class="big-btn home-btn btn-fix-utility" data-u="${id}">${u.fixIcon} ${u.fixVerb}${u.fixName} 🪙${fmtNum(u.fixCost)}</button>`}`;
  }
  if(due > 0){
    return `<div class="bill-box">${u.icon} <b>บิล${u.name}เดือนนี้ 🪙${fmtNum(due)}</b><br>
      จ่ายภายในสิ้นเดือน (วันที่ ${lastDay}) ${u.warnMsg}</div>
      <button class="big-btn home-btn btn-pay-utility" data-u="${id}">${u.icon} จ่าย${u.name} 🪙${fmtNum(due)}</button>`;
  }
  if(state.bills[id] && state.bills[id].due > 0){
    return `<div class="bill-box paid">✅ จ่าย${u.name}เดือนนี้แล้ว — บิลหน้ามาวันที่ 1</div>`;
  }
  return `<div class="bill-box paid">🆓 เดือนแรกฟรี${u.name} — ตั้งแต่เดือนหน้า บิล${u.name} 🪙${fmtNum(u.cost(h && h.id))}/เดือน มาทุกวันที่ 1</div>`;
}

function payUtility(id){
  const u = UTILITY_UI[id], reg = UTILITIES[id];
  const due = billOutstanding(id);
  if(due <= 0) return;
  if(state[reg.cutKey] && reg.fixKey && !state[reg.fixKey]){
    sfx.wrong(); toast(u.needFixToast); return;
  }
  if(state.coins < due){
    sfx.wrong(); toast(`${u.name} 🪙${fmtNum(due)} — เหรียญไม่พอ ไปเล่นเกมเก็บเหรียญก่อนนะ!`); return;
  }
  state.coins -= due;
  state.bills[id].paid = state.bills[id].due;
  if(state[reg.cutKey]){
    state[reg.cutKey] = false;
    state[reg.fixKey] = false;
    u.onRestored();
    sfx.levelup();
    toast(u.restoredToast);
  }else{
    sfx.buy();
    toast(u.paidToast);
  }
  saveState();
  renderDashboard();
}

function buyUtilityFix(id){
  const u = UTILITY_UI[id], reg = UTILITIES[id];
  if(!reg.fixKey || !state[reg.cutKey] || state[reg.fixKey]) return;
  if(state.coins < u.fixCost){
    sfx.wrong(); toast(`${u.fixName} 🪙${fmtNum(u.fixCost)} — เหรียญไม่พอ ไปเล่นเกมเก็บเหรียญก่อนนะ!`); return;
  }
  state.coins -= u.fixCost;
  state[reg.fixKey] = true;
  sfx.buy();
  toast(u.fixedToast);
  saveState();
  renderDashboard();
}

/* ============================================================
   การ์ดมือถือ (ข้อ 7): ซื้อ 10,000 ขายคืน 6,000
   โบนัสจับคู่ +5 เหรียญ/ข้อ · ค่าเน็ต 1,000/เดือน (บิล id 'net')
   ============================================================ */
function renderPhoneCard(){
  const el = document.getElementById('phone-card');
  if(!el) return;
  let body;
  if(!state.phone){
    body = `
      <div class="home-current none">
        <span class="home-emoji">📱</span>
        <div>
          <b>ยังไม่มีมือถือ</b><br>
          <small>มีมือถือแล้วเกมจับคู่ได้โบนัส <b>+${PHONE_BONUS} เหรียญ/ข้อ</b>!<br>
          ค่าเน็ต 🪙${fmtNum(NET_FEE)}/เดือน (จ่ายทุกวันที่ 1 · เดือนแรกฟรี) · ขายคืนได้ 🪙${fmtNum(PHONE_SELL)}</small>
        </div>
      </div>
      <button class="big-btn blue home-btn" id="btn-buy-phone">📱 ซื้อมือถือ 🪙${fmtNum(PHONE_PRICE)}</button>${soldBadge('phone')}`;
  }else{
    const nowD = thDate();                        // 🇹🇭 รอบ 988: เดือนตามปฏิทินไทย
    const lastDay = new Date(nowD.getFullYear(), nowD.getMonth()+1, 0).getDate();
    const bonusState = state.netCut
      ? `<span class="it-tag tag-off">ถูกตัดเน็ต</span> โบนัส +${PHONE_BONUS}/ข้อ ถูกระงับ 📵`
      : `✨ โบนัสจับคู่ <b>+${PHONE_BONUS} เหรียญ/ข้อ</b> ทำงานอยู่`;
    body = `
      <div class="home-current">
        <span class="home-emoji">${state.netCut ? '📵' : '📱'}</span>
        <div>
          <b>มือถือของหนู</b><br>
          <small>${bonusState}</small>
        </div>
      </div>
      ${utilityBillUI('net', null, lastDay)}
      <button class="big-btn purple home-btn" id="btn-sell-phone">💸 ขายคืนมือถือ 🪙${fmtNum(PHONE_SELL)}</button>`;
  }
  el.innerHTML = `<h3 class="shop-title">📱 มือถือ</h3>${body}`;
  const buyBtn = document.getElementById('btn-buy-phone');
  if(buyBtn) buyBtn.addEventListener('click', buyPhone);
  const sellBtn = document.getElementById('btn-sell-phone');
  if(sellBtn) sellBtn.addEventListener('click', sellPhone);
  el.querySelectorAll('.btn-pay-utility').forEach(b=>b.addEventListener('click', ()=>payUtility(b.dataset.u)));
}

function buyPhone(){
  if(state.phone) return;
  if(state.coins < PHONE_PRICE){
    sfx.wrong(); toast(`มือถือ 🪙${fmtNum(PHONE_PRICE)} — เหรียญยังไม่พอ สู้ๆ!`); return;
  }
  askConfirm(`<h2>📱 ซื้อมือถือ</h2>
    <p style="font-size:15px;margin:6px 0">ราคา <b>🪙${fmtNum(PHONE_PRICE)}</b><br>
    เกมจับคู่ได้โบนัส +${PHONE_BONUS} เหรียญ/ข้อ<br>
    <small>📶 ค่าเน็ต 🪙${fmtNum(NET_FEE)}/เดือน จ่ายทุกวันที่ 1 (เดือนแรกฟรี)<br>ค้างถึงสิ้นเดือนจะถูกตัดเน็ต โบนัสหายนะ</small></p>`,
    'ซื้อเลย!', ()=>{
      state.coins -= PHONE_PRICE;
      state.phone = true;
      if(typeof sellInc==='function') sellInc('phone');
      state.netCut = false;
      state.bills.net = {month: ymStr(Date.now()), due: 0, paid: 0};   // เดือนแรกฟรี
      sfx.buy();
      toast(`📱 ได้มือถือแล้ว! จับคู่ถูกรับเพิ่ม +${PHONE_BONUS} เหรียญทุกข้อ 🎉`);
      saveState();
      renderDashboard();
    });
}

function sellPhone(){
  if(!state.phone) return;
  askConfirm(`<h2>💸 ขายคืนมือถือ</h2>
    <p style="font-size:15px;margin:6px 0">ได้เงินคืน <b>🪙${fmtNum(PHONE_SELL)}</b><br>
    <small>โบนัสจับคู่ +${PHONE_BONUS}/ข้อ จะหายไป และบิลเน็ตถูกยกเลิก</small></p>`,
    'ขายเลย', ()=>{
      state.phone = false;
      state.netCut = false;
      delete state.bills.net;
      addCoins(PHONE_SELL);
      sfx.buy();
      toast(`💸 ขายมือถือแล้ว ได้เงินคืน 🪙${fmtNum(PHONE_SELL)}`);
      saveState();
      renderDashboard();
    });
}

/* ============================================================
   การ์ดคอมพิวเตอร์ (ข้อ 11): ซื้อ 50,000 ขายคืน 30,000
   รายได้ +0.01 เหรียญ/วิ (โชว์ตัวเลขวิ่งสด) · ค่าบริการข้อมูล 5,000/เดือน (บิล id 'data')
   ============================================================ */
function compLiveTotal(){   // รายได้สะสมจากคอม รวมเศษที่ยังไม่ตกเป็นเหรียญเต็ม
  let v = state.compEarned;
  if(state.computer && !state.dataCut && state.compSince != null)
    v += (Date.now() - state.compSince)/1000 * COMP_RATE;
  return v;
}

/* ============================================================
   item 8: โบนัสออนไลน์ +0.01 เหรียญ/วิ ฟรีทุกคนที่เปิดเกมออนไลน์อยู่
   pill 🌐 ใน header วิ่งสดทุกวินาที (renderClock) · ตกเหรียญเต็มทุก 100 วิ
   ============================================================ */
function onlineLiveTotal(){   // โบนัสออนไลน์สะสม รวมเศษที่ยังไม่ตกเป็นเหรียญเต็ม
  let v = state.onlineEarned || 0;
  if(state.onlineSince != null) v += (Date.now() - state.onlineSince)/1000 * ONLINE_RATE;
  return v;
}
/* 💰 รอบ 706: เหรียญเต็มเพิ่งตกเข้ากระเป๋า → อัปยอดบน header ทันที + ป้าย "+n" ลอยขึ้นจากช่องนั้น
   (ผู้ใช้สั่ง "ทำให้เด็กเห็นชัดว่าเหรียญกำลังไหลเข้า" — ตัวเลขวิ่งอย่างเดียวยังจับตาไม่ทัน) */
function syncCoinHeader(){
  const c = document.getElementById('coin-count'), t = document.getElementById('coin-today');
  if(c) c.textContent = fmtNum(state.coins);         // อัปยอดใน header ทันที ไม่รอ render รอบหน้า
  if(t) t.textContent = fmtNum(state.daily.coins);
}
function flashPillGain(pill, n){
  if(!pill || document.documentElement.classList.contains('no-anim')) return;
  const s = document.createElement('span');
  s.className = 'pill-gain';
  s.textContent = '+' + fmtNum(n);
  pill.appendChild(s);
  setTimeout(()=>s.remove(), 1000);
}

function renderOnlineEarnPill(){
  const pill = document.getElementById('net-pill');
  if(!pill || typeof state === 'undefined' || !state.student) return;
  // เดินเข็มถี่ทุกวินาที (careTick หลักเดินทุก 1 นาที — เรียกตรงนี้ด้วยให้เหรียญตกตรงเวลา 100 วิ)
  const dropped = typeof onlineEarnTick === 'function' ? onlineEarnTick(Date.now()) : 0;
  if(dropped > 0){
    saveState();
    syncCoinHeader();
    flashPillGain(pill, dropped);                    // รอบ 706: เห็นชัดว่าเหรียญเพิ่งเข้ากระเป๋าจริง
  }
  const on = typeof onlineEarnActive === 'function' && onlineEarnActive();
  if(!on && !(state.onlineEarned > 0)){ pill.style.display = 'none'; return; }
  pill.style.display = '';
  pill.classList.toggle('off', !on);
  pill.title = on ? 'เหรียญออนไลน์สะสมตลอดกาล (ไม่รีเซ็ตรายวัน): เปิดเกมออนไลน์อยู่ = +0.01/วินาที!'
                  : 'เหรียญออนไลน์สะสมตลอดกาลหยุดพัก (ต้อง login ออนไลน์ถึงจะเดิน)';
  const live = document.getElementById('net-live');
  if(live) live.textContent = onlineLiveTotal().toFixed(2);
}

/* ============================================================
   💻 รอบ 706 (ผู้ใช้สั่ง 29 ก.ค. 2026): ช่องรายได้คอมพิวเตอร์บนแถบบนล็อบบี้
   ยังไม่ซื้อ = จาง + 🔒 (แตะ = กล่องบอกวิธีปลดล็อก + ปุ่มซื้อในกล่องเลย)
   ซื้อแล้ว = ตัวเลขวิ่งสดทุกวินาที · ถูกตัดบริการข้อมูล = สีส้มแดง "หยุด"
   ============================================================ */
function renderCompEarnPill(){
  const pill = document.getElementById('comp-pill');
  if(!pill || typeof state === 'undefined' || !state.student) return;
  pill.style.display = '';
  const has = !!state.computer, cut = has && !!state.dataCut;
  pill.classList.toggle('locked', !has);
  pill.classList.toggle('cut', cut);
  pill.classList.toggle('on', has && !cut);
  const live = document.getElementById('comp-live-top');
  const plus = pill.querySelector('.comp-plus');
  if(!has){
    if(plus) plus.textContent = '';
    if(live) live.textContent = '🔒';
    pill.title = `ยังไม่มีคอมพิวเตอร์ — ซื้อแล้วเหรียญเพิ่มเอง +${COMP_RATE}/วินาที (แตะเพื่อดูวิธี)`;
    return;
  }
  // เดินเข็มถี่ทุกวินาทีเหมือนโบนัสออนไลน์ (careTick หลักเดินทุก 1 นาที) — เลขบนจอตรงกับเหรียญที่เข้ากระเป๋าจริง
  const before = state.compEarned;
  if(typeof compTick === 'function') compTick(Date.now());
  const dropped = state.compEarned - before;
  if(dropped > 0){
    saveState();
    syncCoinHeader();
    flashPillGain(pill, dropped);
  }
  if(plus) plus.textContent = cut ? '' : '+';
  if(live) live.textContent = cut ? 'หยุด' : compLiveTotal().toFixed(2);
  pill.title = cut ? '📡 คอมถูกตัดบริการข้อมูล รายได้หยุดนิ่ง — แตะเพื่อจ่ายค่าบริการ'
                   : `💻 คอมกำลังทำเงินให้ +${COMP_RATE} เหรียญ/วินาที (แตะเพื่อดูรายละเอียด)`;
}

/* 💡 รอบ 156: แตะ pill ตัวเลขบน header Lobby → หน้าต่างอธิบายว่าเลขนี้คือเลขอะไร
   (ผู้ใช้สั่ง 12 ก.ค.: เด็กเห็นเลข 3 ก้อนแล้วงง — แตะแล้วต้องมีคำอธิบาย) */
function openPillInfo(kind){
  const rate = (typeof ONLINE_RATE !== 'undefined') ? ONLINE_RATE : 0.01;
  const netOn = (typeof onlineEarnActive === 'function') && onlineEarnActive();
  const infos = {
    coins: {
      emoji:'🪙', title:'เหรียญสะสมทั้งหมด', val:`${fmtNum(state.coins)} เหรียญ`,
      desc:`เหรียญทั้งหมดที่หนูมีอยู่<b>ตอนนี้</b> — ใช้ซื้อของทุกอย่างในเกม เช่น อาหารน้อง บ้าน เสื้อผ้า ตั๋วโลก 3D และจ่ายบิลรายเดือน<br><br>
        หาเพิ่มได้จาก: เกมจับคู่คำศัพท์ 🎮 · สอบผ่าน 📝 · ภารกิจรายวัน 🎯 · โรงงาน 🏭 · ฟาร์ม 🌳 · ขายของในตลาด 🏪`,
    },
    today: {
      emoji:'📅', title:'เหรียญที่หาได้วันนี้', val:`+${fmtNum(state.daily.coins)} เหรียญ`,
      desc:`นับเฉพาะเหรียญที่<b>หามาได้วันนี้</b> (ตอนใช้จ่ายเลขนี้ไม่ลด) — ขึ้นวันใหม่รีเซ็ตเป็น 0 เริ่มนับใหม่<br><br>
        ไว้ดูว่าวันนี้ขยันแค่ไหน แคปหน้าจอส่งคุณครู/คุณพ่อคุณแม่ได้เลย 📸`,
    },
    net: {
      emoji:'🌐', title:'โบนัสออนไลน์', val:`+${onlineLiveTotal().toFixed(2)} เหรียญ`,
      desc:`ของขวัญฟรี! แค่<b>เปิดเกมแบบออนไลน์</b>อยู่ เหรียญก็เพิ่มเอง <b>+${rate} เหรียญ/วินาที</b> (สะสมครบแล้วตกเป็นเหรียญเต็มเข้ากระเป๋าเองทุก 100 วินาที)<br><br>
        ตัวเลขนี้ = โบนัสออนไลน์ที่สะสมมา<b>ทั้งหมด</b>ตั้งแต่เริ่มเล่น<br>
        ${netOn ? '🟢 ตอนนี้กำลังเดินอยู่ — เล่นต่อไปเลย!' : '⚪ ตอนนี้หยุดพัก (ต้องต่อเน็ต + login ถึงจะเดิน)'}`,
    },
    /* รอบ 269: แตะป้าย 📴 → อธิบายโหมดออฟไลน์ให้เด็กเข้าใจ ไม่ต้องกลัวคะแนนหาย */
    offline: {
      emoji:'📴', title:'กำลังเล่นแบบออฟไลน์', val:'คะแนนยังไม่ขึ้นกระดาน',
      desc:`ตอนนี้เกม<b>ไม่ได้ต่ออินเทอร์เน็ต</b> — เล่นได้ตามปกติเลย เหรียญ คะแนน และความคืบหน้าทุกอย่าง<b>เก็บไว้ในเครื่องครบ ไม่หายแน่นอน</b> 💾<br><br>
        แค่คะแนนจะ<b>ยังไม่ขึ้นกระดานอันดับ</b> และเพื่อนๆ ยังไม่เห็นเราออนไลน์<br><br>
        📶 เมื่อไหร่ที่ต่อเน็ตได้ เกมจะส่งคะแนนขึ้นเซิร์ฟเวอร์<b>ให้เองอัตโนมัติ</b> (มีข้อความ ☁️ เด้งบอก) แล้วป้ายนี้ก็จะหายไปเอง — ไม่ต้องทำอะไรเพิ่มเลย 😊`,
    },
  };
  /* 💻 รอบ 706: ช่องคอมพิวเตอร์ — เนื้อหาเปลี่ยนตามสถานะ 3 แบบ และมี "ปุ่มลงมือ" (inf.act) ในกล่องเลย
     ยังไม่ซื้อ → บอกวิธีปลดล็อก + ปุ่มซื้อ · ถูกตัดบริการ → ปุ่มจ่ายบิล · ปกติ → สรุปรายได้ */
  const perDay = Math.round(COMP_RATE * 86400);
  if(!state.computer){
    const need = Math.max(0, COMP_PRICE - state.coins);
    infos.comp = {
      emoji:'💻', title:'คอมพิวเตอร์ — ยังไม่ทำงาน', val:'🔒 ยังไม่มีคอม',
      desc:`ช่องนี้จะ<b>สว่างขึ้นและเริ่มนับเหรียญเอง</b>เมื่อหนูมีคอมพิวเตอร์แล้ว 💡<br><br>
        💰 มีคอม = เหรียญเพิ่มเองอัตโนมัติ <b>+${COMP_RATE} เหรียญ/วินาที</b> (≈ <b>${fmtNum(perDay)} เหรียญ/วัน</b>) แม้ตอนไม่ได้เล่น<br>
        🛒 ราคา <b>🪙${fmtNum(COMP_PRICE)}</b> · ตอนนี้หนูมี 🪙${fmtNum(state.coins)} ${need > 0
          ? `<b>(ขาดอีก 🪙${fmtNum(need)})</b> ไปเล่นเกมคำศัพท์เก็บเหรียญก่อนนะ 💪`
          : '<b>— ซื้อได้เลย!</b> 🎉'}<br>
        📡 ค่าบริการข้อมูล 🪙${fmtNum(DATA_FEE)}/เดือน (<b>เดือนแรกฟรี</b> · ค้างถึงสิ้นเดือน = ถูกตัด รายได้หยุด) · 💸 ขายคืนได้ 🪙${fmtNum(COMP_SELL)}`,
      act:{label:`💻 ซื้อคอมพิวเตอร์ 🪙${fmtNum(COMP_PRICE)}`, cls:'blue', fn:buyComputer},
    };
  }else{
    const due = (typeof billOutstanding === 'function') ? billOutstanding('data') : 0;
    infos.comp = state.dataCut ? {
      emoji:'📡', title:'คอมถูกตัดบริการข้อมูล', val:'⏸️ รายได้หยุดนิ่ง',
      desc:`คอมยังอยู่ครบ แต่<b>ค่าบริการข้อมูลค้างจ่าย</b> เลยถูกตัดเน็ต — เหรียญจึงหยุดเดินชั่วคราว 😢<br><br>
        📄 ยอดค้าง <b>🪙${fmtNum(due)}</b> · จ่ายครบเมื่อไหร่ รายได้ <b>+${COMP_RATE} เหรียญ/วินาที</b> กลับมาเดินทันที<br>
        🪙 เหรียญที่คอมหามาได้แล้วทั้งหมด: <b>${compLiveTotal().toFixed(2)}</b>`,
      act: due > 0 ? {label:`📡 จ่ายค่าบริการข้อมูล 🪙${fmtNum(due)}`, cls:'green', fn:()=>payUtility('data')} : null,
    } : {
      emoji:'💻', title:'รายได้จากคอมพิวเตอร์', val:`+${compLiveTotal().toFixed(2)} เหรียญ`,
      desc:`คอมของหนู<b>กำลังทำเงินอยู่ตอนนี้</b> <b>+${COMP_RATE} เหรียญ/วินาที</b> (≈ <b>${fmtNum(perDay)} เหรียญ/วัน</b>) — เดินตลอดเวลาแม้ปิดเกมไปแล้ว 🎉<br><br>
        ตัวเลขนี้ = เหรียญที่คอมหามาได้<b>ทั้งหมด</b>ตั้งแต่ซื้อมา (สะสมครบ 1 เหรียญเต็มเมื่อไหร่ ตกเข้ากระเป๋าเองทันที)<br>
        📡 อย่าลืมจ่ายค่าบริการข้อมูล 🪙${fmtNum(DATA_FEE)} ทุกวันที่ 1 นะ ${due > 0 ? `— <b>ตอนนี้ค้างอยู่ 🪙${fmtNum(due)}</b>` : '— ตอนนี้ไม่มียอดค้าง ✅'}`,
      act: due > 0 ? {label:`📡 จ่ายค่าบริการข้อมูล 🪙${fmtNum(due)}`, cls:'green', fn:()=>payUtility('data')} : null,
    };
  }
  const inf = infos[kind];
  if(!inf) return;
  sfx.select();
  const overlay = document.createElement('div');
  overlay.className = 'levelup-overlay pillinfo-overlay';
  // รอบ 167: หัวกล่องแนวนอน (ไอคอน | ชื่อ+ป้ายเหรียญ) แทนกองแนวตั้ง — จอเตี้ยเห็นครบทั้งใบไม่ต้องเลื่อน
  overlay.innerHTML = `<div class="levelup-box pillinfo-box">
    <div class="plf-head">
      <span class="plf-emoji">${inf.emoji}</span>
      <div class="plf-ht"><h2>${inf.title}</h2><div class="pillinfo-val">${inf.val}</div></div>
    </div>
    <p class="pillinfo-desc">${inf.desc}</p>
    <div class="plf-foot">
      ${inf.act ? `<button class="big-btn ${inf.act.cls || 'blue'} pill-act">${inf.act.label}</button>` : ''}
      <button class="set-close">เข้าใจแล้ว!</button>
    </div>
  </div>`;
  overlay.querySelector('.set-close').addEventListener('click', ()=>overlay.remove());
  const actBtn = overlay.querySelector('.pill-act');   // รอบ 706: ปุ่มลงมือ (ซื้อคอม/จ่ายบิล) — ปิดกล่องก่อนค่อยทำงาน
  if(actBtn) actBtn.addEventListener('click', ()=>{ overlay.remove(); inf.act.fn(); });
  overlay.addEventListener('click', e=>{ if(e.target === overlay) overlay.remove(); });
  document.body.appendChild(overlay);
}

function renderComputerCard(){
  const el = document.getElementById('computer-card');
  if(!el) return;
  let body;
  if(!state.computer){
    body = `
      <div class="home-current none">
        <span class="home-emoji">💻</span>
        <div>
          <b>ยังไม่มีคอมพิวเตอร์</b><br>
          <small>มีคอมแล้วเหรียญเพิ่มเอง <b>+${COMP_RATE} เหรียญ/วินาที</b> ตลอดเวลา!<br>
          📡 ค่าบริการข้อมูล 🪙${fmtNum(DATA_FEE)}/เดือน (จ่ายทุกวันที่ 1 · เดือนแรกฟรี) · ขายคืนได้ 🪙${fmtNum(COMP_SELL)}</small>
        </div>
      </div>
      <button class="big-btn blue home-btn" id="btn-buy-comp">💻 ซื้อคอมพิวเตอร์ 🪙${fmtNum(COMP_PRICE)}</button>${soldBadge('computer')}`;
  }else{
    const nowD = thDate();                        // 🇹🇭 รอบ 988: เดือนตามปฏิทินไทย
    const lastDay = new Date(nowD.getFullYear(), nowD.getMonth()+1, 0).getDate();
    body = `
      <div class="comp-earn ${state.dataCut ? 'off' : ''}">
        <div class="comp-earn-label">${state.dataCut ? '🔇 รายได้หยุดนิ่ง (ถูกตัดบริการข้อมูล)' : '💻 คอมกำลังทำเงินให้หนู +'+COMP_RATE+' เหรียญ/วินาที'}</div>
        <div class="comp-earn-num" id="comp-live">${compLiveTotal().toFixed(2)}</div>
        <div class="comp-earn-sub">เหรียญที่คอมหามาได้ทั้งหมด</div>
      </div>
      ${utilityBillUI('data', null, lastDay)}
      <button class="big-btn purple home-btn" id="btn-sell-comp">💸 ขายคืนคอมพิวเตอร์ 🪙${fmtNum(COMP_SELL)}</button>`;
  }
  el.innerHTML = `<h3 class="shop-title">💻 คอมพิวเตอร์</h3>${body}`;
  const buyBtn = document.getElementById('btn-buy-comp');
  if(buyBtn) buyBtn.addEventListener('click', buyComputer);
  const sellBtn = document.getElementById('btn-sell-comp');
  if(sellBtn) sellBtn.addEventListener('click', sellComputer);
  el.querySelectorAll('.btn-pay-utility').forEach(b=>b.addEventListener('click', ()=>payUtility(b.dataset.u)));
}

function buyComputer(){
  if(state.computer) return;
  if(state.coins < COMP_PRICE){
    sfx.wrong(); toast(`คอมพิวเตอร์ 🪙${fmtNum(COMP_PRICE)} — เหรียญยังไม่พอ สู้ๆ!`); return;
  }
  askConfirm(`<h2>💻 ซื้อคอมพิวเตอร์</h2>
    <p style="font-size:15px;margin:6px 0">ราคา <b>🪙${fmtNum(COMP_PRICE)}</b><br>
    เหรียญเพิ่มเอง +${COMP_RATE}/วินาที ตลอดเวลา (≈ 864 เหรียญ/วัน)<br>
    <small>📡 ค่าบริการข้อมูล 🪙${fmtNum(DATA_FEE)}/เดือน จ่ายทุกวันที่ 1 (เดือนแรกฟรี)<br>ค้างถึงสิ้นเดือนถูกตัดบริการ รายได้หยุดนะ</small></p>`,
    'ซื้อเลย!', ()=>{
      state.coins -= COMP_PRICE;
      state.computer = true;
      if(typeof sellInc==='function') sellInc('computer');
      state.compSince = Date.now();
      state.dataCut = false;
      state.bills.data = {month: ymStr(Date.now()), due: 0, paid: 0};   // เดือนแรกฟรี
      sfx.buy();
      toast(`💻 ได้คอมพิวเตอร์แล้ว! เหรียญกำลังเพิ่มขึ้นเองทุกวินาที 🎉`);
      saveState();
      renderDashboard();
    });
}

function sellComputer(){
  if(!state.computer) return;
  askConfirm(`<h2>💸 ขายคืนคอมพิวเตอร์</h2>
    <p style="font-size:15px;margin:6px 0">ได้เงินคืน <b>🪙${fmtNum(COMP_SELL)}</b><br>
    <small>รายได้ +${COMP_RATE}/วิ จะหายไป และบิลค่าบริการข้อมูลถูกยกเลิก</small></p>`,
    'ขายเลย', ()=>{
      careTick();                        // ตกรายได้ค้างให้ครบก่อนขาย
      state.computer = false;
      state.compSince = null;
      state.dataCut = false;
      delete state.bills.data;
      addCoins(COMP_SELL);
      sfx.buy();
      toast(`💸 ขายคอมพิวเตอร์แล้ว ได้เงินคืน 🪙${fmtNum(COMP_SELL)}`);
      saveState();
      renderDashboard();
    });
}

/* 🛒 รอบ 208: ป้าย "ขายไปแล้ว N ชิ้น" — โชว์ยอดขายจริงทั้งเซิร์ฟเวอร์ (จาก Online.sales) ใต้สินค้าทุกชิ้น
   ให้เห็นว่ามีคนซื้อจริง + ดูความนิยมได้ · ไม่ต่อเน็ต/ยังไม่มียอด = "ขายแล้ว 0 ชิ้น" (ยังใช้กับสินค้าตลาดอื่น) */
function soldCount(id){ return (typeof Online !== 'undefined' && Online.sales && Online.sales[id]) ? Online.sales[id] : 0; }
function soldBadge(id){
  const n = soldCount(id);
  return `<div class="sold-badge${n>0?' has':''}">🛒 ขายไปแล้ว <b>${fmtNum(n)}</b> ชิ้น</div>`;
}

/* ---------- ข้อ 8: เข้าโลกผจญภัย 3D — โหลด engine เฉพาะตอนกดเข้า (กันหน้าหลักหนัก) ---------- */
function loadScriptOnce(src){
  return new Promise((resolve,reject)=>{
    let s = document.querySelector(`script[src="${src}"]`);
    if(s){
      if(s.dataset.loaded){ resolve(); return; }
      /* 🐛 รอบ 859 (ต้นตอ "เข้าไม่ได้ทุกโลก" บน APK): แท็กที่ "โหลดพังไปแล้ว" (error ยิงไปแล้ว)
         จะไม่ยิง load/error ซ้ำอีก → promise ค้างตลอดกาล → advLoading ค้าง true → ทุกโลกเงียบถาวร
         แก้: แท็กพัง = ถอดทิ้งแล้วสร้างใหม่ (ลองโหลดซ้ำจริง) · แท็กที่ยังโหลดอยู่ = รอ event ตามเดิม */
      if(s.dataset.failed){ s.remove(); }
      else{
        s.addEventListener('load', resolve);
        s.addEventListener('error', ()=>reject(new Error('โหลดไฟล์ไม่สำเร็จ: '+src)));
        return;
      }
    }
    s = document.createElement('script');
    s.src = src;
    s.dataset.lso = '1';   // ป้ายว่าสร้างโดย loadScriptOnce — ให้ advResetLoad ถอดตัวที่โหลดไม่จบได้
    s.addEventListener('load', ()=>{ s.dataset.loaded='1'; resolve(); });
    s.addEventListener('error', ()=>{ s.dataset.failed='1'; reject(new Error('โหลดไฟล์ไม่สำเร็จ: '+src)); });
    document.head.appendChild(s);
  });
}
/* 🚑 รอบ 859: guard ทางเข้าโลก 3D ห้ามเงียบ — ถ้ากดแล้วไม่เกิดอะไรเพราะ advLoading ค้าง ให้บอกผู้เล่นบนจอ
   (เงื่อนไขอื่น เช่น ไม่มีตั๋ว/บาดเจ็บ มีข้อความจากทางเข้าปกติอยู่แล้ว — เงียบเหมือนเดิม) */
function advBusyMsg(retry){
  if(!advLoading) return;
  /* 🔄 รอบ 860: ไม่บอกให้ผู้เล่น "ปิดเกมเปิดใหม่" อีกแล้ว — โหลดค้างเกิน 10 วิ = ระบบล้างสถานะ
     + ถอดสคริปต์ที่โหลดไม่จบทิ้ง แล้วลองเข้าโลกเดิมให้ใหม่อัตโนมัติ (เทียบเท่าปิดเกมเปิดใหม่เฉพาะส่วนโหลด) */
  if(Date.now() - advLoading > 10000){
    advResetLoad();
    toast('🔄 โหลดนานผิดปกติ — ล้างระบบให้ใหม่แล้ว กำลังลองเข้าอีกครั้งนะ');
    if(retry) retry();
    return;
  }
  toast('⏳ โลก 3D กำลังโหลดอยู่ — รอสักครู่นะ');
}
function advResetLoad(){
  advLoading = false;
  document.querySelectorAll('script[data-lso]:not([data-loaded])').forEach(s=>s.remove());
}
/* 🪓 รอบ 544: adventure3d.js ถูกผ่าเป็นไฟล์ part (data ล้วน) + ไฟล์หลัก
   ทุกจุดที่เคยโหลด js/adventure3d.js ตรงๆ ต้องเรียกตัวนี้แทน — part ก่อน หลักทีหลัง */
async function loadAdv3d(){
  await loadScriptOnce('js/adv3d_css.js');
  await loadScriptOnce('js/adv3d_intro.js');   // ❓ เฟส 2 รอบ 545: data การ์ดวิธีเล่น
  await loadScriptOnce('js/adv3d_tex.js');     // 🖼️ เฟส 3 รอบ 546: texture ตัวอักษร/emoji/ป้าย (window.Adv3dTex)
  await loadScriptOnce('js/hotel3d.js');       // 🏨 รอบ 684: ตัวตึกโรงแรมผีสิง 5 ชั้น (window.HOTEL3D)
  await loadScriptOnce('js/hauntedhotelsession.js'); // 🏨 Phase 2: canonical low-frequency Firebase run adapter
  await loadScriptOnce('js/hauntedhoteldirector.js'); // 🏨 Phase 3: adaptive local horror + compact shared scare intent
  await loadScriptOnce('js/hauntedhotel.js');  // 🏨 Phase 2+3: mission lifecycle + Horror Director boundary
  await loadScriptOnce('js/hauntedhotelghost.js'); // 👻 PNG-only chase + lightweight hair/lighting shader
  await loadScriptOnce('js/adventure3d.js');
}
/* ============================================================
   🌀🔤 รอบ 1045 — Vocab Arena (โลกผจญภัยฉบับใหม่)
   แยกเอนจินออกจาก adventure3d.js ที่เกิน 12,000 บรรทัดแล้ว เพื่อไม่ทำให้ไฟล์เดิมบวมขึ้น
   🤝👑 รอบ 1048 — Co-op PvE 2–4 คน + บอสคำศัพท์รายบท + revive + รางวัลทีม
   ============================================================ */
async function loadVocabArena3d(){
  await loadScriptOnce('js/arena3d.js');
}
/* ============================================================
   ☁️📚 รอบ 1229 — Vocab Sky Playground
   standalone social + obby world; ไม่โหลด/ไม่แก้ Adventure World หรือ Invasion
   ============================================================ */
async function loadSkyPlayground3d(){
  await loadScriptOnce('js/skyplay3d.js');
}
const SKY_BETA_DENIED_MSG = 'Vocab Sky Playground กำลังเปิดแบบ Private Beta เฉพาะบัญชีที่ได้รับเชิญ ขอบคุณที่สนใจนะครับ';
function ensureSkyBetaAccess(){
  const allowed = typeof canAccessSkyBeta === 'function' && canAccessSkyBeta();
  if(!allowed){
    if(typeof sfx !== 'undefined' && sfx.wrong) sfx.wrong();
    toast(`🔒 ${SKY_BETA_DENIED_MSG}`);
  }
  return allowed;
}
async function enterSkyPlayground3D(){
  if(!ensureSkyBetaAccess()) return worldEntryStopped(SKY_BETA_DENIED_MSG);
  if(!state.skyTicket) return worldEntryStopped('สิทธิ์เข้าเกมยังไม่พร้อม');
  if(advLoading){ advBusyMsg(enterSkyPlayground3D); return worldEntryStopped('มีเกมอื่นกำลังโหลดอยู่'); }
  advLoading=Date.now();toast('☁️ กำลังเปิด Vocab Sky Playground...');
  try{
    await loadScriptOnce('js/vendor/three.min.js');
    await loadSkyPlayground3d();
  }catch(e){
    advLoading=false;
    return worldEntryStopped('โหลด Vocab Sky Playground ไม่สำเร็จ อาจเกิดจากเน็ตหรือหน่วยความจำเครื่อง',e);
  }
  advLoading=false;
  SkyPlayground3D.start();
  return worldEntryStarted();
}
let advLoading = false;
async function enterAdventure3D(){
  if(!state.advTicket || state.advHurt) return worldEntryStopped('สิทธิ์เข้าเกมยังไม่พร้อม');
  if(advLoading){ advBusyMsg(enterAdventure3D); return worldEntryStopped('มีเกมอื่นกำลังโหลดอยู่'); }
  // 🗺️ รอบ 1045: เลือกแผนที่ก่อน แล้วค่อยโหลดเฉพาะเอนจินที่ใช้จริง
  // Vocab Arena เบากว่า adventure3d.js มาก จึงไม่บังคับมือถือโหลดโลกเฮลิคอปเตอร์ทั้งก้อนก่อนเข้าต่อสู้
  const map = await pickAdvMap();
  if(!map) return worldEntryStopped('ยกเลิกการเลือกแผนที่ก่อนเกมเริ่ม');
  advLoading = Date.now();
  toast(map==='heli'?'🚁 กำลังเปิดเมืองเฮลิคอปเตอร์...':'🌀 กำลังเปิด Vocab Arena...');
  try{
    await loadScriptOnce('js/vendor/three.min.js');
    if(map==='heli') await loadAdv3d();
    else await loadVocabArena3d();
  }catch(e){
    advLoading = false;
    return worldEntryStopped('โหลดไฟล์โลกผจญภัยไม่สำเร็จ อาจเกิดจากเน็ตหรือหน่วยความจำเครื่อง', e);
  }
  advLoading = false;
  if(map==='heli'){ Adventure3D.start('heli',{walkIn:true}); return worldEntryStarted(); }
  VocabArena3D.start();
  return worldEntryStarted();
}
/* 🗺️ กล่องเลือกแผนที่โลกเดิน (รอบ 356) — 2 การ์ดใหญ่ แตะง่าย ออกแบบให้พอดีจอเตี้ย 812×375 ไม่มี scroll (กฎ 7) */
function pickAdvMap(){
  return new Promise(res=>{
    const ov=document.createElement('div');
    ov.style.cssText='position:fixed;inset:0;z-index:2600;background:rgba(8,6,18,.82);display:flex;align-items:center;justify-content:center;padding:10px';
    ov.innerHTML=`
      <div style="background:linear-gradient(160deg,#241a3d,#161028);border:2px solid #6c5ce7;border-radius:18px;
                  padding:clamp(10px,2.6vh,18px) clamp(12px,2.6vw,22px);max-width:min(560px,96vw);width:100%;
                  max-height:94vh;display:flex;flex-direction:column;gap:clamp(6px,1.6vh,12px)">
        <div style="color:#ffd54f;font-weight:800;font-size:clamp(15px,3.4vh,19px);text-align:center">🗺️ วันนี้อยากไปเดินเล่นที่ไหน?</div>
        <div style="display:flex;gap:clamp(8px,2vw,14px)">
          <button class="am-c" data-m="field" style="flex:1;background:linear-gradient(145deg,rgba(38,202,225,.18),rgba(115,75,224,.2));border:2px solid #69e3ff;border-radius:14px;
                  padding:clamp(8px,2vh,14px) 6px;color:#e8fbff;cursor:pointer;box-shadow:inset 0 0 18px rgba(93,222,255,.08)">
            <div style="font-size:clamp(26px,7vh,38px)">🌀</div>
            <div style="font-weight:800;font-size:clamp(13px,3vh,16px)">Vocab Arena</div>
            <div style="font-size:clamp(10px,2.3vh,12px);opacity:.85;line-height:1.35">Co-op 2–4 คน 🤝 บอสคำศัพท์รายบท 👑<br>ช่วยชุบเพื่อน + แบ่งรางวัลอย่างยุติธรรม</div>
          </button>
          <button class="am-c" data-m="heli" style="flex:1;background:rgba(41,182,246,.13);border:2px solid #4fc3f7;border-radius:14px;
                  padding:clamp(8px,2vh,14px) 6px;color:#e5f6ff;cursor:pointer">
            <div style="font-size:clamp(26px,7vh,38px)">🚁</div>
            <div style="font-weight:800;font-size:clamp(13px,3vh,16px)">เมืองเฮลิคอปเตอร์</div>
            <div style="font-size:clamp(10px,2.3vh,12px);opacity:.85;line-height:1.35">เดินเข้าตึก 🛗 นั่ง ฮ. ชมวิว โดดวิงสูท 🪂 ฟรี!<br>มีตั๋วเฮลิฯ = ขับเองได้ด้วย</div>
          </button>
        </div>
        <button class="am-x" style="align-self:center;background:none;border:1px solid #5a4d80;border-radius:10px;
                color:#b3a8d0;padding:4px 18px;font-size:clamp(11px,2.4vh,13px);cursor:pointer">ยังก่อน</button>
      </div>`;
    const done=v=>{ ov.remove(); res(v); };
    ov.querySelectorAll('.am-c').forEach(b=>b.addEventListener('click',()=>{ sfx.select(); done(b.dataset.m); }));
    ov.querySelector('.am-x').addEventListener('click',()=>done(null));
    ov.addEventListener('click',e=>{ if(e.target===ov) done(null); });
    document.body.appendChild(ov);
  });
}

/* เข้าโลกผีสิงกลางคืน 👻 (ตั๋วแยก · ใช้ engine เดียวกัน โหมด haunt) */
async function enterHaunted3D(){
  if(!state.hauntTicket || state.advHurt) return worldEntryStopped('สิทธิ์เข้าเกมยังไม่พร้อม');
  if(advLoading){ advBusyMsg(enterHaunted3D); return worldEntryStopped('มีเกมอื่นกำลังโหลดอยู่'); }
  if(!window.Adventure3D){
    advLoading = Date.now();
    toast('👻 กำลังเปิดประตูโลกผีสิง...');
    try{
      await loadScriptOnce('js/vendor/three.min.js');
      await loadAdv3d();
    }catch(e){
      advLoading = false;
      return worldEntryStopped('โหลดไฟล์โลกผีสิงไม่สำเร็จ อาจเกิดจากเน็ตหรือหน่วยความจำเครื่อง', e);
    }
    advLoading = false;
  }
  // 🧱 เลือกตัวละครบล็อกก่อนเข้า (เหมือนโลกผจญภัย/ขับรถ) — ยกเลิก = ไม่เข้าโลก
  const go = await Adventure3D.pickBlockAvatar('👻 กล้าเข้าไป!');
  if(!go) return worldEntryStopped('ยกเลิกการเลือกตัวละครก่อนเกมเริ่ม');
  Adventure3D.start('haunt');
  return worldEntryStarted();
}

/* เข้าโลกเฮลิคอปเตอร์ (engine เดียวกัน โหมด heli) */
async function enterHeli3D(){
  if(!state.heliTicket || state.advHurt) return worldEntryStopped('สิทธิ์เข้าเกมยังไม่พร้อม');
  if(advLoading){ advBusyMsg(enterHeli3D); return worldEntryStopped('มีเกมอื่นกำลังโหลดอยู่'); }
  // 🗺️ รอบ 815 (ผู้ใช้สั่ง): เลือกแผนที่ก่อนขึ้นบิน เหมือนตอนเข้าโลกขับรถ
  const hmap = await pickHeliMap();
  if(!hmap) return worldEntryStopped('ยกเลิกการเลือกแผนที่ก่อนเกมเริ่ม');
  const needCity = hmap === 'kpp';                 // เมืองกำแพงเพชรใช้ข้อมูลแผนที่จริงชุดเดียวกับโลกขับรถ
  if(!window.Adventure3D || (needCity && !window.KPP_CITY)){
    advLoading = Date.now();
    toast(needCity ? '🚁 กำลังสตาร์ทเครื่องยนต์ + โหลดแผนที่เมืองกำแพงเพชร...' : '🚁 กำลังสตาร์ทเครื่องยนต์...');
    try{
      await loadScriptOnce('js/vendor/three.min.js');
      if(needCity) await loadScriptOnce('js/data/city_kpp.js');
      await loadAdv3d();
    }catch(e){
      advLoading = false;
      return worldEntryStopped('โหลดไฟล์โลกเฮลิคอปเตอร์ไม่สำเร็จ อาจเกิดจากเน็ตหรือหน่วยความจำเครื่อง', e);
    }
    advLoading = false;
  }
  Adventure3D.start('heli', {map:hmap});
  return worldEntryStarted();
}
/* 🗺️🚁 รอบ 815: หน้าเลือกแผนที่โลกเฮลิคอปเตอร์ (ผู้ใช้สั่ง — ให้เหมือน pickDriveMap ของโลกขับรถ)
   คืน 'city' = เมืองเฮลิฯ เดิม (เดินเท้า/ลิฟต์/วิงสูท · ตัวอักษรบนดาดฟ้า)
       'kpp'  = เมืองกำแพงเพชรจริง (ขึ้นบินทันที · ลงจอดเก็บตัวอักษรบนพื้นที่สีเขียว) · null = ยกเลิก
   ใช้ CSS ชุด .dmap-* ร่วมกับหน้าเลือกแผนที่รถ (ไม่เพิ่ม CSS ใหม่) */
function pickHeliMap(){
  return new Promise(res=>{
    let sel = state.heliMap === 'kpp' ? 'kpp' : 'city';
    const ov = document.createElement('div');
    ov.className = 'levelup-overlay';
    ov.innerHTML = `<div class="levelup-box dmap-box">
      <h2>🗺️ วันนี้จะไปบินที่ไหนดี?</h2>
      <div class="dmap-grid">
        <div class="dmap-card${sel==='city'?' sel':''}" data-m="city">
          <div class="dmap-ico">🏙️🚁</div>
          <b>เมืองเฮลิคอปเตอร์</b>
          <small>เริ่มแบบเดินเท้า · ขับลำแดง 🔴 หรือนั่งลำฟ้า 🔵 ชมวิว · 🪂 โดดวิงสูท<br>เก็บตัวอักษร<b>บนดาดฟ้าตึก</b> คำละ 🪙30</small>
        </div>
        <div class="dmap-card${sel==='kpp'?' sel':''}" data-m="kpp">
          <div class="dmap-ico">🌳🚁</div>
          <b>เมืองกำแพงเพชร <span class="dmap-new">ใหม่!</span></b>
          <small>บินเหนือเมืองจริง ถนน–ตึก–แม่น้ำปิง · <b>ขึ้นบินได้ทันที</b><br>
          ตัวอักษรอยู่บน<b>พื้นที่สีเขียวข้างถนน</b> — ร่อนลงจอดบนหญ้าเพื่อเก็บ · คำละ 🪙30</small>
        </div>
      </div>
      <div class="cb-btns"><button class="cb-x">ยังก่อน</button><button class="cf-ok" id="hmap-go">ไปเลย! 🚁</button></div>
    </div>`;
    ov.querySelectorAll('.dmap-card').forEach(el=>el.addEventListener('click',()=>{
      sel = el.dataset.m; sfx.select();
      ov.querySelectorAll('.dmap-card').forEach(e2=>e2.classList.toggle('sel', e2===el));
    }));
    ov.querySelector('.cb-x').addEventListener('click',()=>{ ov.remove(); res(null); });
    ov.querySelector('#hmap-go').addEventListener('click',()=>{
      state.heliMap = sel; saveState();
      ov.remove(); res(sel);
    });
    document.body.appendChild(ov);
  });
}

/* เข้าโลกโดรน (engine เดียวกัน โหมด drone) */
async function enterDrone3D(){
  if(!state.droneTicket || state.advHurt) return worldEntryStopped('สิทธิ์เข้าเกมยังไม่พร้อม');
  if(advLoading){ advBusyMsg(enterDrone3D); return worldEntryStopped('มีเกมอื่นกำลังโหลดอยู่'); }
  if(!window.Adventure3D){
    advLoading = Date.now();
    toast('🛸 กำลังอาร์มโดรน...');
    try{
      await loadScriptOnce('js/vendor/three.min.js');
      await loadAdv3d();
    }catch(e){
      advLoading = false;
      return worldEntryStopped('โหลดไฟล์โลกโดรนไม่สำเร็จ อาจเกิดจากเน็ตหรือหน่วยความจำเครื่อง', e);
    }
    advLoading = false;
  }
  Adventure3D.start('drone');
  return worldEntryStarted();
}

/* ==== 🐾🛍️ PET SHOPPING 3D — รอบ 1158 ====
   โลกซื้อของใช้รถส่วนตัวฟรี; ผู้เล่นที่ยังไม่มีรถเช่า car_01 ครั้งละ 500 เหรียญ
   หักค่าเช่าหลัง engine เปิดสำเร็จเท่านั้น เพื่อไม่กินเงินเมื่อโหลดไฟล์/WebGL ล้มเหลว */
function confirmPetShoppingEntry(target, rental){
  return new Promise(resolve=>{
    const food = target === 'food';
    const fee = (typeof PET_SHOP_RENTAL_FEE === 'number') ? PET_SHOP_RENTAL_FEE : 500;
    const ov = document.createElement('div');
    ov.className = 'levelup-overlay petshop-entry-overlay';
    ov.innerHTML = `<div class="levelup-box petshop-entry-box">
      <div class="petshop-entry-icon">${food ? '🥫🐾' : '🎀🐾'}</div>
      <h2>${food ? 'ไปร้านอาหารสัตว์' : 'ไปร้านแฟชั่นสัตว์เลี้ยง'}</h2>
      <p>พาน้องนั่งรถไปด้วย ขับตาม GPS ไปยังร้านที่อยู่ไม่ไกล แล้วเลือกซื้อที่หน้าร้านจริง</p>
      ${rental
        ? `<div class="petshop-rental-note">🚗 ยังไม่มีรถ — ระบบจะให้เช่า <b>รถแดงสายฟ้า</b> รอบนี้<br>ค่าเช่า <b>🪙${fmtNum(fee)}</b> (ไม่เพิ่มรถเข้าคลัง)</div>`
        : `<div class="petshop-owncar-note">✅ ใช้รถส่วนตัวของหนู — <b>ไม่มีค่าเช่า</b></div>`}
      <div class="cb-btns"><button class="cf-no">ไว้ก่อน</button><button class="cf-ok">ออกเดินทาง 🚗</button></div>
    </div>`;
    let done = false;
    const finish = value=>{ if(done) return; done=true; ov.remove(); resolve(value); };
    ov.querySelector('.cf-no').addEventListener('click', ()=>finish(false));
    ov.querySelector('.cf-ok').addEventListener('click', ()=>finish(true));
    ov.addEventListener('click', e=>{ if(e.target===ov) finish(false); });
    document.body.appendChild(ov);
    if(typeof fitQbp === 'function') fitQbp(ov.querySelector('.levelup-box'));
  });
}

async function enterPetShopping3D(target='food'){
  target = target === 'fashion' ? 'fashion' : 'food';
  if(!activePet()){
    toast('🐾 ต้องรับน้องมาเลี้ยงก่อน จึงจะพาน้องออกไปซื้อของได้');
    return worldEntryStopped('ยังไม่มีสัตว์เลี้ยง');
  }
  if(target === 'food' && !(state.petPantry && state.petPantry.shelfId)){
    toast('🗄️ ซื้อชั้นเปล่าก่อน เพื่อให้มีที่เก็บอาหารที่ซื้อกลับมา');
    if(typeof PetPantry !== 'undefined') PetPantry.openPantry();
    return worldEntryStopped('ยังไม่มีชั้นเก็บอาหาร');
  }
  if(advLoading){ advBusyMsg(()=>enterPetShopping3D(target)); return worldEntryStopped('มีเกมอื่นกำลังโหลดอยู่'); }

  const rental = !(state.cars && state.cars.length);
  const fee = (typeof PET_SHOP_RENTAL_FEE === 'number') ? PET_SHOP_RENTAL_FEE : 500;
  if(!rental && carDriveBlock() === 'overdue'){
    sfx.wrong();
    toast('🔒 รถคันนี้ค้างค่างวด — ชำระหรือสลับรถก่อนออกไปซื้อของนะ', 3200);
    return worldEntryStopped('รถที่เลือกค้างค่างวด');
  }
  if(rental && state.coins < fee){
    sfx.wrong();
    toast(`🪙 ต้องมี ${fmtNum(fee)} เหรียญสำหรับเช่ารถรอบนี้ — เล่นเกมหาเหรียญเพิ่มก่อนนะ`, 3200);
    return worldEntryStopped('เหรียญไม่พอค่าเช่ารถ');
  }
  if(!await confirmPetShoppingEntry(target, rental)) return worldEntryStopped('ยกเลิกก่อนออกเดินทาง');

  advLoading = Date.now();
  toast(target==='food' ? '🚗 กำลังเตรียมเส้นทางไปร้านอาหารสัตว์...' : '🚗 กำลังเตรียมเส้นทางไปร้านแฟชั่นสัตว์เลี้ยง...');
  try{
    const ps3Css = document.querySelector('link[href*="css/petshopping3d.css"]');
    if(ps3Css && !ps3Css.href.includes('v=1168')) ps3Css.href='css/petshopping3d.css?v=1168';
    await loadScriptOnce('js/vendor/three.min.js');
    await loadScriptOnce('js/petshopping3d.js?v=1169');
    if(!window.PetShopping3D || typeof PetShopping3D.start !== 'function') throw new Error('PetShopping3D API ไม่พร้อม');
    const own = rental ? null : myCar();
    const started = PetShopping3D.start({target, carId:own ? own.id : 'car_01', rental});
    if(started === false) throw new Error('เปิดฉาก Pet Shopping 3D ไม่สำเร็จ');
    if(rental){
      state.coins -= fee;
      saveState();
      if(typeof syncHeader === 'function') syncHeader();
      if(typeof sfx !== 'undefined' && typeof sfx.buy === 'function') sfx.buy();
      toast(`🚗 เช่ารถรอบนี้แล้ว 🪙${fmtNum(fee)} — ขับตาม GPS ไปที่ร้านได้เลย!`, 3000);
    }
    return worldEntryStarted();
  }catch(e){
    console.error('[pet-shopping-3d]', e);
    toast('⚠️ เปิดโลกซื้อของไม่สำเร็จ — ยังไม่หักค่าเช่ารถ ลองใหม่อีกครั้งนะ', 3600);
    return worldEntryStopped('โหลดโลกซื้อของไม่สำเร็จและไม่คิดค่าเช่า', e);
  }finally{
    advLoading = false;
  }
}

/* เข้าโลกขับรถ (engine เดียวกัน โหมด drive) — โหลดแผนที่เมืองจริงเพิ่ม 1 ไฟล์ (~240KB โหลดครั้งเดียว) */
async function enterDrive3D(){
  if(!state.driveTicket || state.advHurt) return worldEntryStopped('สิทธิ์เข้าเกมยังไม่พร้อม');
  if(advLoading){ advBusyMsg(enterDrive3D); return worldEntryStopped('มีเกมอื่นกำลังโหลดอยู่'); }
  // 🔓 รอบ 943: ไม่มีรถไม่บล็อกแล้ว — ระบบให้ยืมรถขับฟรีสำหรับรอบนั้น (myCar()=null → โมเดล car_01 + สมรรถนะกลาง 3/3/3)
  const loanCar = !(state.cars && state.cars.length);
  if(loanCar) toast('🚗 รอบนี้ยืมรถของระบบขับฟรี — อยากได้คันของตัวเอง ซื้อที่หมวดยานพาหนะนะ');
  if(!window.Adventure3D || !window.KPP_CITY){
    advLoading = Date.now();
    toast('🚗 กำลังสตาร์ทรถ + โหลดแผนที่เมืองกำแพงเพชร...');
    try{
      await loadScriptOnce('js/vendor/three.min.js');
      await loadScriptOnce('js/data/city_kpp.js');
      await loadAdv3d();
    }catch(e){
      advLoading = false;
      return worldEntryStopped('โหลดไฟล์โลกขับรถไม่สำเร็จ อาจเกิดจากเน็ตหรือหน่วยความจำเครื่อง', e);
    }
    advLoading = false;
  }
  // 🗺️ รอบ 317: เลือกแผนที่ก่อนออกรถ (ผู้ใช้สั่ง — รถยนต์ไปเล่นแผนที่บ้านโพธิ์สวัสดิ์ร่วมกับมอเตอร์ไซค์ได้)
  const map = await pickDriveMap();
  if(!map) return worldEntryStopped('ยกเลิกการเลือกแผนที่ก่อนเกมเริ่ม');
  // 🚗 รอบ 233: เลือกรถออกขับ (เหมือนเลือกหุ่นออกรบ) — ตั้ง state.carIdx → สมรรถนะ (drivePerf) + ภายในรถ (loadCarDash) ตามคันที่เลือก
  if(!loanCar){
    const gotCar = await pickDriveCar();
    if(!gotCar) return worldEntryStopped('ยกเลิกการเลือกรถก่อนเกมเริ่ม');
    // 🔐 คันที่เลือกค้างค่างวด → ขับไม่ได้ (เลือกคันอื่นได้)
    if(carDriveBlock()){ sfx.wrong(); showNeedCarDialog(carDriveBlock()); return worldEntryStopped('รถที่เลือกมีค่างวดค้างชำระ จึงยังขับไม่ได้'); }
  }
  if(map === 'phosawat') return await enterMotoMapAsCar();   // 🏫 ไปแผนที่บ้านโพธิ์สวัสดิ์ด้วยรถยนต์
  // 🧱 เลือกตัวละครบล็อกก่อนออกรถ (จำตัวล่าสุดไว้ · เพื่อนใน map เห็นเป็นตัวที่เลือก) — กดยกเลิก = ไม่เข้าโลก
  const go = await Adventure3D.pickBlockAvatar();
  if(!go) return worldEntryStopped('ยกเลิกการเลือกตัวละครก่อนเกมเริ่ม');
  Adventure3D.start('drive');
  return worldEntryStarted();
}

/* 🗺️ รอบ 317: หน้าเลือกแผนที่ของผู้เล่นโลกขับรถ (ผู้ใช้สั่ง)
   คืน 'city' = เมืองกำแพงเพชรเดิม · 'phosawat' = แผนที่มอเตอร์ไซค์บ้านโพธิ์สวัสดิ์ (ขับรถยนต์เข้าไปเล่นร่วมกัน) · null = ยกเลิก */
function pickDriveMap(){
  return new Promise(res=>{
    let sel = state.driveMap === 'phosawat' ? 'phosawat' : 'city';
    const ov = document.createElement('div');
    ov.className = 'levelup-overlay';
    ov.innerHTML = `<div class="levelup-box dmap-box">
      <h2>🗺️ วันนี้จะไปขับที่ไหนดี?</h2>
      <div class="dmap-grid">
        <div class="dmap-card${sel==='city'?' sel':''}" data-m="city">
          <div class="dmap-ico">🏙️🕰️</div>
          <b>เมืองกำแพงเพชร</b>
          <small>เมืองจริง ถนน–ตึก–แม่น้ำปิง · ไฟจราจร ตำรวจ วิทยุในรถ<br>เก็บตัวอักษรบนถนน คำละ 🪙40</small>
        </div>
        <div class="dmap-card${sel==='phosawat'?' sel':''}" data-m="phosawat">
          <div class="dmap-ico">🏫🛣️</div>
          <b>บ้านโพธิ์สวัสดิ์ <span class="dmap-new">ใหม่!</span></b>
          <small>ถนนหมู่บ้านจริงรัศมี 30 กม. · <b>ขับร่วมกับเพื่อนที่ขี่มอเตอร์ไซค์</b><br>
          ออกรถหน้าโรงเรียน · คำละ 🪙45 + เหรียญทองตามถนน</small>
        </div>
      </div>
      <div class="cb-btns"><button class="cb-x">ยังก่อน</button><button class="cf-ok" id="dmap-go">ไปเลย! 🚗</button></div>
    </div>`;
    ov.querySelectorAll('.dmap-card').forEach(el=>el.addEventListener('click',()=>{
      sel = el.dataset.m; sfx.select();
      ov.querySelectorAll('.dmap-card').forEach(e2=>e2.classList.toggle('sel', e2===el));
    }));
    ov.querySelector('.cb-x').addEventListener('click',()=>{ ov.remove(); res(null); });
    ov.querySelector('#dmap-go').addEventListener('click',()=>{
      state.driveMap = sel; saveState();
      ov.remove(); res(sel);
    });
    document.body.appendChild(ov);
  });
}
/* 🚗🏫 รอบ 317: เอารถยนต์เข้าไปเล่นแผนที่มอเตอร์ไซค์ (engine moto3d โหมด vehicle:'car')
   ไม่ต้องมีตั๋วมอเตอร์ไซค์ — ตั๋วขับรถ + มีรถ ก็เข้าได้ (จุดประสงค์คือเล่นรวมกัน) */
async function enterMotoMapAsCar(){
  if(!window.MotoWorld || !window.MOTO_MAP){
    advLoading = Date.now();
    toast('🚗 กำลังโหลดแผนที่บ้านโพธิ์สวัสดิ์...');
    try{
      await loadScriptOnce('js/vendor/three.min.js');
      await loadScriptOnce('js/data/moto_phosawat.js');
      await loadScriptOnce('js/moto3d.js');
    }catch(e){
      advLoading = false;
      return worldEntryStopped('โหลดแผนที่บ้านโพธิ์สวัสดิ์ไม่สำเร็จ อาจเกิดจากเน็ตหรือหน่วยความจำเครื่อง', e);
    }
    advLoading = false;
  }
  MotoWorld.start({vehicle:'car'});
  return worldEntryStarted();
}

/* เข้าโลกสนามฟุตบอล (engine เดียวกัน โหมด soccer) */
async function enterSoccer3D(){
  if(!state.soccerTicket || state.advHurt) return worldEntryStopped('สิทธิ์เข้าเกมยังไม่พร้อม');
  if(advLoading){ advBusyMsg(enterSoccer3D); return worldEntryStopped('มีเกมอื่นกำลังโหลดอยู่'); }
  if(!window.Adventure3D){
    advLoading = Date.now();
    toast('⚽ กำลังเข้าสนาม...');
    try{
      await loadScriptOnce('js/vendor/three.min.js');
      await loadAdv3d();
    }catch(e){
      advLoading = false;
      return worldEntryStopped('โหลดสนามฟุตบอลไม่สำเร็จ อาจเกิดจากเน็ตหรือหน่วยความจำเครื่อง', e);
    }
    advLoading = false;
  }
  Adventure3D.start('soccer');
  return worldEntryStarted();
}

/* เข้าโลกมอเตอร์ไซค์ — engine แยก (js/moto3d.js) + แผนที่จริง 1 ไฟล์ (~190KB โหลดครั้งเดียว) */
async function enterMoto3D(){
  if(!state.motoTicket || state.advHurt) return worldEntryStopped('สิทธิ์เข้าเกมยังไม่พร้อม');
  if(advLoading){ advBusyMsg(enterMoto3D); return worldEntryStopped('มีเกมอื่นกำลังโหลดอยู่'); }
  if(!window.MotoWorld || !window.MOTO_MAP){
    advLoading = Date.now();
    toast('🏍️ กำลังสตาร์ทมอเตอร์ไซค์ + โหลดแผนที่บ้านโพธิ์สวัสดิ์...');
    try{
      await loadScriptOnce('js/vendor/three.min.js');
      await loadScriptOnce('js/data/moto_phosawat.js');
      await loadScriptOnce('js/moto3d.js');
    }catch(e){
      advLoading = false;
      return worldEntryStopped('โหลดไฟล์โลกมอเตอร์ไซค์ไม่สำเร็จ อาจเกิดจากเน็ตหรือหน่วยความจำเครื่อง', e);
    }
    advLoading = false;
  }
  MotoWorld.start();
  return worldEntryStarted();
}


/* 🏎️ รอบ 896: เข้าโลกแข่งรถ F1 สนามซาเคียร์ (Bahrain) — engine แยก (js/f1_3d.js)
   + ข้อมูลสนามจริงจาก OSM (js/data/f1_bahrain.js) + GLTFLoader เผื่อผู้ใช้วางโมเดล f1_car.glb */
async function enterF1_3D(){
  if(!state.f1Ticket || state.advHurt) return worldEntryStopped('สิทธิ์เข้าเกมยังไม่พร้อม');
  if(advLoading){ advBusyMsg(enterF1_3D); return worldEntryStopped('มีเกมอื่นกำลังโหลดอยู่'); }
  if(!window.F1World || !window.F1_MAP){
    advLoading = Date.now();
    toast('🏎️ กำลังเปิด Vocab World Racing...');
    try{
      await loadScriptOnce('js/vendor/three.min.js');
      await loadScriptOnce('js/vendor/GLTFLoader.js');
      await loadScriptOnce('js/data/f1_bahrain.js');
      /* The web build replaces this with an immutable content-hashed F1 engine path.
         Source/dev fallback stays usable before the replacement runs. */
      const f1EngineUrl='__VW_F1_ENGINE_URL__';
      await loadScriptOnce(f1EngineUrl.startsWith('__VW_')?'js/f1_3d.js':f1EngineUrl);
    }catch(e){
      advLoading = false;
      return worldEntryStopped('โหลดสนามแข่งรถไม่สำเร็จ อาจเกิดจากเน็ตหรือหน่วยความจำเครื่อง', e);
    }
    advLoading = false;
  }
  try{
    const graphics=window.F1Modes?F1Modes.getSelection(F1Modes.ENTRY_MODE||'quality'):null;
    F1World.start(graphics?{graphicsMode:graphics.id,environmentProfile:graphics.environment}:undefined);
    return worldEntryStarted();
  }catch(e){ return worldEntryStopped('เครื่องสร้างสนามแข่งรถไม่สำเร็จ', e); }
}

/* เข้าโลกยานแม่บุกโลก — engine แยก (js/invasion3d.js) ไม่แตะ adventure3d.js */
async function enterInvasion3D(){
  if(!state.invasionTicket || state.advHurt) return worldEntryStopped('สิทธิ์เข้าเกมยังไม่พร้อม');
  if(advLoading){ advBusyMsg(enterInvasion3D); return worldEntryStopped('มีเกมอื่นกำลังโหลดอยู่'); }
  if(!window.InvasionWorld){
    advLoading = Date.now();
    toast('🛸 กำลังเปิดสมรภูมิทะเลทราย...');
    try{
      await loadScriptOnce('js/vendor/three.min.js');
      await loadScriptOnce('js/vendor/GLTFLoader.js');   // 🧩 โมเดล .glb ยานแม่/ยานลูก/ปืน (ไม่ได้อยู่ใน three.min.js)
      await loadScriptOnce('js/fpsweapon.js');           // 🔫 FPS weapon presentation state machine + cached sprite frames
      await loadScriptOnce('js/invasion3d.js');
    }catch(e){
      advLoading = false;
      return worldEntryStopped('โหลดไฟล์โลกยานแม่ไม่สำเร็จ อาจเกิดจากเน็ตหรือหน่วยความจำเครื่อง', e);
    }
    advLoading = false;
  }
  InvasionWorld.start();
  return worldEntryStarted();
}

/* ============================================================
   🌍 ปุ่มลัดเข้าโลก 3D ในรางเมนูซ้าย (ผู้ใช้สั่ง 9 ก.ค. 2026)
   🎫→💰 รอบ 823 (ผู้ใช้สั่ง 30 ก.ค. 2026): ยกเลิกตั๋วราคาแพงจ่ายทีเดียว — กดปุ่มเข้าโลกเด้งหน้าจ่ายค่าเข้าทันที
   (ไม่มีการ์ดตั๋วแยกในตลาดแล้ว) ราคาวันนี้เดียวกันทุกโลกจาก worldEntryInfo() (js/data/calendar.js — คิดวันหยุด/วันเด็ก)
   ปุ่มทุกใบสร้างจาก WORLD3D ก้อนเดียว → มีโลก 3D ใหม่ในอนาคตแค่ "เพิ่ม 1 บรรทัด" ที่นี่แล้วปุ่มจะโผล่ในรางเอง
   🔓 รอบ 943 (ผู้ใช้สั่ง 3 ส.ค. 2026): ยกเลิกลำดับปลดล็อกโลก (prereq) — จ่ายค่าเข้า 500 เข้าโลกไหนก็ได้ทันที
   ไม่มีหุ่น/รถของตัวเอง = ระบบให้ยืมฟรีสำหรับรอบนั้น (ดู enterMecha3D / enterDrive3D) */
const WORLD3D = [
  { mode:'adv',   ico:'🌍', label:'ผจญภัย', ticketKey:'advTicket',   doneKey:'advDone',   enter:enterAdventure3D },
  { mode:'sky',   ico:'☁️', label:'Sky Playground', ticketKey:'skyTicket', doneKey:'skyDone', enter:enterSkyPlayground3D },
  { mode:'haunt', ico:'👻', label:'ผีสิง',  ticketKey:'hauntTicket', doneKey:'hauntDone', enter:enterHaunted3D },
  { mode:'heli',  ico:'🚁', label:'เฮลิ',   ticketKey:'heliTicket',  doneKey:'heliDone',  enter:enterHeli3D },
  { mode:'drone', ico:'🛸', label:'โดรน',   ticketKey:'droneTicket', doneKey:'droneDone', enter:enterDrone3D },
  { mode:'drive', ico:'🚗', label:'ขับรถ',  ticketKey:'driveTicket', doneKey:'driveDone', enter:enterDrive3D },
  { mode:'soccer',ico:'⚽', label:'ฟุตบอล', ticketKey:'soccerTicket',doneKey:'soccerDone',enter:enterSoccer3D },
  { mode:'moto',  ico:'🏍️', label:'มอไซค์', ticketKey:'motoTicket', doneKey:'motoDone',  enter:enterMoto3D },
  { mode:'invasion',ico:'🛸',label:'ยานแม่', ticketKey:'invasionTicket',doneKey:'invasionDone', enter:enterInvasion3D },
  { mode:'mecha', ico:'🤖', label:'หุ่นรบ', ticketKey:'mechaTicket', doneKey:'mechaDone', enter:enterMecha3D },
  { mode:'f1',    ico:'🏎️', label:'Vocab World Racing', ticketKey:'f1Ticket',  doneKey:'f1Done',    enter:enterF1_3D },   // internal keys kept for compatibility
];
/* ============================================================
   🔒 รอบ 1070/1132: โลกที่ยังไม่เปิดสาธารณะ — เปิดให้บัญชีทดสอบ 2 ชื่อเท่านั้น
   เทียบชื่อแบบ NFC + ตัดช่องว่าง กันชื่อไทยจากคนละคีย์บอร์ด/มีช่องว่างหลุดแล้วสิทธิ์ไม่ตรง
   ============================================================ */
const WORLD3D_COMING_SOON = new Set(['adv','drive','moto','invasion','mecha']);
function world3DComingSoon(w){
  return !!(w && WORLD3D_COMING_SOON.has(w.mode) && !(typeof isTester === 'function' && isTester()));
}
function gotoRobotShop(){
  if(typeof openPanel === 'function') openPanel('panel-market');
  setTimeout(()=>{ const s = document.getElementById('mkt-robots'); if(s) s.scrollIntoView({behavior:'smooth', block:'start'}); }, 150);
}

/* 🤕 บาดเจ็บ/พลังหมดในโลก 3D (สเปก 8.5 — ใช้ร่วมทุกโลก) ต้องรักษาก่อนถึงจะเข้าโลกไหนก็ได้อีกครั้ง */
function openHealDialog(){
  if(state.coins < CURE_COST){
    sfx.wrong(); toast(`ค่ารักษา 🪙${fmtNum(CURE_COST)} — เหรียญไม่พอ ไปเล่นเกมเก็บเหรียญก่อนนะ!`); return;
  }
  askConfirm(`<h2>🤕 บาดเจ็บจากโลก 3D</h2>
    <p style="font-size:15px;margin:6px 0">พลังหมด/โดนจับตอนผจญภัย ต้องรักษาตัวก่อนถึงจะกลับเข้าโลก 3D ได้อีกครั้ง<br>
    ค่ารักษา <b>🪙${fmtNum(CURE_COST)}</b></p>`,
    '💊 รักษาเลย', ()=>{
      state.coins -= CURE_COST;
      state.advHurt = false;
      sfx.buy();
      toast('💪 หายดีแล้ว! กลับเข้าโลก 3D ได้เลย');
      saveState();
      renderDashboard();
    });
}

/* 🚑 รอบ 859: เปิดโลก 3D ล้มเหลวต้อง "บอกเหตุผลบนจอ" ห้ามเงียบ (กฎทอง #1 — เคสจริงบน APK:
   เล่นมอไซค์→เปิดข้อสอบ TOEIC→กลับมาเข้าโลก 3D ไม่ได้ทุกโลกโดยไม่มีข้อความอะไรเลย)
   กล่องนี้โชว์ error จริง + สถานะ WebGL + หน่วยความจำ ให้ผู้เล่นส่งภาพมาแล้ววินิจฉัยได้ทันที
   + ปุ่มโหลดเกมใหม่ (ล้างหน่วยความจำ WebView — แก้อาการการ์ดจอ/แรมเต็มได้ เซฟไม่หาย) */
function world3DFail(label, err){
  advLoading = false;
  console.error('world3DFail', label, err);
  let glOk = false;
  try{
    const c = document.createElement('canvas');
    const g = c.getContext('webgl') || c.getContext('experimental-webgl');
    glOk = !!g;
    const lose = g && g.getExtension('WEBGL_lose_context'); if(lose) lose.loseContext();   // คืน context ทดสอบทันที
  }catch(e){}
  const mem = (window.performance && performance.memory)
    ? `${Math.round(performance.memory.usedJSHeapSize/1048576)}/${Math.round(performance.memory.jsHeapSizeLimit/1048576)} MB` : '';
  const detail = err ? String((err && err.message) || err).slice(0,180) : '';
  document.querySelectorAll('.w3f-overlay').forEach(el=>el.remove());   // ไม่ซ้อนหลายใบ
  const ov = document.createElement('div');
  ov.className = 'levelup-overlay w3f-overlay';
  ov.innerHTML = `<div class="levelup-box" style="max-width:360px">
    <h2 style="font-size:18px">⚠️ เปิด${escapeHTML(label)}ไม่สำเร็จ</h2>
    <p style="font-size:13.5px;margin:6px 0">${glOk
      ? 'เกิดข้อผิดพลาดตอนสร้างโลก 3D'
      : 'หน่วยความจำกราฟิกของเครื่องเต็มชั่วคราว (WebGL ใช้งานไม่ได้)'}<br>กด <b>"โหลดเกมใหม่"</b> แล้วเข้าอีกครั้งได้เลย — เซฟไม่หายแน่นอน</p>
    ${detail ? `<p style="font-size:11px;color:#8a7a9a;word-break:break-all;margin:4px 0">รายละเอียด: ${escapeHTML(detail)}</p>` : ''}
    <p style="font-size:11px;color:#8a7a9a;margin:4px 0">WebGL: ${glOk?'✅ ปกติ':'❌ ใช้ไม่ได้'}${mem?` · RAM JS: ${mem}`:''}</p>
    <button class="big-btn green home-btn" id="w3f-reload" style="width:100%;margin:6px 0 4px">🔄 โหลดเกมใหม่</button>
    <button class="big-btn" id="w3f-close" style="width:100%;font-size:14px;padding:8px">ปิด</button>
  </div>`;
  document.body.appendChild(ov);
  ov.querySelector('#w3f-reload').addEventListener('click', ()=>location.reload());
  ov.querySelector('#w3f-close').addEventListener('click', ()=>ov.remove());
}

/* ============================================================
   ↩️🪙 รอบ 1143 — ธุรกรรมค่าเข้าเกม + คืนเงินเมื่อเกมเปิดไม่สำเร็จ
   หักเหรียญและเก็บ tx ใน state ก่อนเริ่มโหลด; ล้าง tx เมื่อ start() สำเร็จเท่านั้น
   ถ้า throw/โหลดพัง/ยกเลิกก่อนเกมเริ่ม ให้คืนเต็มจำนวน; ถ้าเครื่องค้างกลางทาง bootGame กู้ tx ให้
   ============================================================ */
function worldEntryStarted(){ return {started:true}; }
function worldEntryStopped(reason, err){ return {started:false, reason:String(reason||'เกมไม่ตอบสนองก่อนเปิดสำเร็จ'), error:err||null}; }
const GAME_ENTRY_STABLE_MS = 15000; // ถ้าค้าง/reload ช่วงเริ่มเกม ให้ boot คืนค่าเข้า

function gameEntryCommit(tx){
  if(!tx || !state.gameEntryTx || state.gameEntryTx.id !== tx.id) return false;
  state.gameEntryTx = null;
  if(!tx.wasUnlocked && typeof sellInc === 'function') sellInc('tk_'+tx.mode);
  saveState();
  return true;
}

function gameEntryRefund(tx, reason){
  if(!tx || !state.gameEntryTx || state.gameEntryTx.id !== tx.id) return false; // กันคืนซ้ำ
  const amount = Math.max(0, Number(tx.amount)||0);
  state.coins = Math.max(0, Number(state.coins)||0) + amount;
  if(!tx.wasUnlocked && tx.ticketKey) state[tx.ticketKey] = false;
  state.gameEntryTx = null;
  state.gameEntryRefundNotice = {
    id:tx.id, amount, game:String(tx.game||'เกม'),
    reason:String(reason||'เกมไม่ตอบสนองก่อนเปิดสำเร็จ').slice(0,160), ts:Date.now()
  };
  saveState();
  if(typeof renderRailWorlds === 'function') renderRailWorlds();
  if(typeof syncCoinHeader === 'function') syncCoinHeader();
  if(typeof feedEvent === 'function') feedEvent('coin', `คืนค่าเข้า${tx.game} +${fmtNum(amount)} 🪙 — ${state.gameEntryRefundNotice.reason}`);
  return true;
}

function recoverInterruptedGameEntry(){
  const tx = state.gameEntryTx;
  if(!tx || !tx.id || !(Number(tx.amount)>0)) return false;
  return gameEntryRefund(tx, tx.startedAt
    ? 'เข้าเกมแล้วแต่เครื่องค้างก่อนจะเล่นได้'
    : 'เกมหยุดหรือเครื่องค้างก่อนเปิดให้เล่นได้');
}

function showGameEntryRefundNotice(next){
  const b = state.gameEntryRefundNotice;
  if(!b || !(Number(b.amount)>0)){ if(typeof next === 'function') next(); return; }
  if(document.querySelector('[data-game-entry-refund]')) return;
  if(typeof sfx !== 'undefined' && sfx.coinGet){ sfx.coinGet(); setTimeout(()=>sfx.coinGet(), 420); }
  const ov = document.createElement('div');
  ov.className = 'rankup-overlay';
  ov.dataset.gameEntryRefund = '1';
  ov.innerHTML = `<div class="rankup-rays" style="--rank-color:#5dd7a8"></div>
    <div class="rankup-content qbp">
      <div class="rankup-title">↩️ คืนค่าเข้าแล้ว</div>
      <div class="qbp-coin">🪙</div>
      <div class="rankup-name" style="color:#18a76f">+${fmtNum(b.amount)} เหรียญ 🪙</div>
      <p class="rankup-sub">เข้า${escapeHTML(b.game)}ไม่ได้: ${escapeHTML(b.reason)}<br>ระบบคืนค่าเข้า <b>🪙${fmtNum(b.amount)}</b> เข้ากระเป๋าแล้ว</p>
      <button class="rankup-btn">รับทราบ</button>
    </div>`;
  ov.querySelector('.rankup-btn').addEventListener('click', ()=>{
    state.gameEntryRefundNotice = null;
    saveState();
    ov.remove();
    if(document.getElementById('screen-dashboard').classList.contains('active')) renderDashboard();
    if(typeof next === 'function') next();
  });
  document.body.appendChild(ov); // ไม่ผูก backdrop/Esc: ต้องกด "รับทราบ" เท่านั้น
  if(typeof fitQbp === 'function') fitQbp(ov.querySelector('.qbp'));
}

async function startWorldEntry(w, info, unlocked, overlay, button){
  if(w && w.mode === 'sky' && !ensureSkyBetaAccess()) return;
  if(button) button.disabled = true;
  let tx = null;
  if(!info.free){
    if(state.coins < info.fee){
      if(button) button.disabled = false;
      sfx.wrong(); toast(`เหรียญยังไม่พอ ต้องมี 🪙${fmtNum(info.fee)}`); return;
    }
    tx = {id:`${Date.now()}-${Math.random().toString(36).slice(2,9)}`, mode:w.mode,
      game:`โลก${w.label}`, amount:info.fee, ticketKey:w.ticketKey, wasUnlocked:!!unlocked, ts:Date.now()};
    state.gameEntryTx = tx;
    state.coins -= info.fee;
  }
  state[w.ticketKey] = true; // ฟังก์ชัน enter ใช้เป็น guard; ถ้าล้มเหลวจะ rollback ให้
  saveState();
  renderRailWorlds();
  overlay.remove();
  if(!info.free) sfx.buy();
  let out;
  try{ out = await w.enter(); }
  catch(err){ out = worldEntryStopped('เกมเกิดข้อผิดพลาดก่อนเปิดให้เล่นได้', err); }
  if(out && out.started === true){
    if(tx && state.gameEntryTx && state.gameEntryTx.id === tx.id){
      tx.startedAt = Date.now();
      saveState();
      setTimeout(()=>gameEntryCommit(tx), GAME_ENTRY_STABLE_MS);
    }else if(!unlocked && typeof sellInc === 'function'){
      sellInc('tk_'+w.mode); saveState();
    }
    return;
  }
  const reason = out && out.reason ? out.reason : 'เกมไม่ตอบสนองก่อนเปิดให้เล่นได้';
  if(out && out.error) console.error('world entry failed', w.mode, out.error);
  advResetLoad();
  if(tx){
    gameEntryRefund(tx, reason);
    showGameEntryRefundNotice();
  }else{
    if(!unlocked) state[w.ticketKey] = false;
    saveState();
    sfx.wrong(); toast(`⚠️ เข้าโลก${w.label}ไม่ได้ — ${reason}`);
  }
}

function railWorldClick(w){
  if(w && w.mode === 'sky' && !ensureSkyBetaAccess()) return;
  if(world3DComingSoon(w)){
    sfx.wrong(); toast('🔒 Coming soon'); return;
  }
  /* 🔓 รอบ 943: ยกเลิกด่าน "ต้องปลดล็อกโลกก่อนหน้า" + ด่าน "ต้องมีหุ่น/รถก่อน" — จ่ายค่าเข้าแล้วเข้าได้ทุกโลก
     ไม่มีหุ่น/รถ = ระบบให้ยืมฟรีสำหรับรอบนั้น (enterMecha3D / enterDrive3D จัดการ) */
  if(state.advHurt){ sfx.wrong(); openHealDialog(); return; }
  if(w.mode === 'adv' && !state.advTicket && !state.pets.some(p=>isAdult(p))){
    sfx.wrong(); toast('🔒 ต้องมีสัตว์โตเต็มวัย (Lv.3) อย่างน้อย 1 ตัวก่อนถึงจะเข้าโลกผจญภัยได้นะ'); return;
  }
  if(w.mode === 'drive' && carDriveBlock() === 'overdue'){  // 🔐 ค้างงวดรถ = ขับไม่ได้จนกว่าจะจ่าย (ไม่มีรถไม่บล็อกแล้ว — ยืมรถระบบ)
    sfx.wrong(); showNeedCarDialog('overdue'); return;
  }
  if(w.mode==='f1'){
    loadScriptOnce('js/f1_modes.js').then(()=>{
      /* รอบ 1203: เข้าสนาม Realistic โดยตรงชั่วคราว; เก็บ Battery Saver/selector ไว้ในโมดูลโดยไม่แสดง */
      F1Modes.setSelectedMode(F1Modes.ENTRY_MODE||'quality');
      openWorldEntryDialog(w);
    }).catch(err=>world3DFail('ตัวเลือก Vocab World Racing',err));
    return;
  }
  openWorldEntryDialog(w);
}

/* ============================================================
   ☁️🧸 รอบ 1258 — เลือกตัวละคร Sky ก่อนเข้าโลก
   ============================================================ */
let skyEntryDialogLoading = false;
function skyEntryCatalog(){
  const api = window.SkyPlayground3D;
  return api && api._t && Array.isArray(api._t.characters) ? api._t.characters : [];
}
function skyEntryPickerHTML(w, characters){
  if(!w || w.mode !== 'sky' || !characters.length) return '';
  const selected = characters.find(c=>c.id === state.skyCharacter) || characters[0];
  return `<section class="sky-entry-character-picker" aria-label="Choose a character before entering Vocab Sky Playground">
    <div class="sky-entry-character-head"><b>🧸 เลือกตัวละครก่อนเข้า</b><span id="we-sky-character-name">${escapeHTML(selected.name)}</span></div>
    <div class="sky-entry-character-grid">${characters.map(c=>`<button type="button" data-sky-entry-character="${escapeHTML(c.id)}" class="${c.id===selected.id?'selected':''}" aria-pressed="${c.id===selected.id}"><img src="${escapeHTML(c.thumb||c.atlas)}" alt="" width="174" height="348" decoding="async"><b>${escapeHTML(c.name)}</b></button>`).join('')}</div>
  </section>`;
}

/* 🎫→💰 รอบ 823: หน้าจ่ายค่าเข้าโลก 3D กลาง — แทนที่การ์ดตั๋วแยก 8 ใบเดิม
   ราคาวันนี้ (worldEntryInfo) + ปุ่มชวนเพื่อนเล่นด้วยกัน (openTinvPicker) รวมอยู่ในหน้าเดียว */
function openWorldEntryDialog(w){
  if(w && w.mode === 'sky' && !ensureSkyBetaAccess()) return;
  const isSky = !!(w && w.mode === 'sky');
  const skyCharacters = isSky ? skyEntryCatalog() : [];
  if(isSky && !skyCharacters.length){
    if(skyEntryDialogLoading) return;
    skyEntryDialogLoading = true;
    toast('☁️ กำลังเตรียมตัวเลือกตัวละคร...');
    loadSkyPlayground3d().then(()=>{
      skyEntryDialogLoading = false;
      openWorldEntryDialog(w);
    }).catch(err=>{
      skyEntryDialogLoading = false;
      world3DFail('ตัวเลือกตัวละคร Sky Playground',err);
    });
    return;
  }
  const info = worldEntryInfo(w.mode);
  const unlocked = !!state[w.ticketKey];
  // 🤖🚗 รอบ 945: ส่วนลดเจ้าของหุ่น/รถทบกับส่วนลดวันหยุดได้ — โชว์ทุกเหตุผลที่ลด ห้ามลดเงียบๆ
  const feeHTML = info.free
    ? `<div style="font-size:14px;font-weight:700;color:#2e9e4a;margin:6px 0">🎉 ${escapeHTML(info.reason)}<br>เข้าฟรีวันนี้!</div>`
    : (info.discount || info.ownerDiscount)
      ? `<p style="font-size:14px;margin:6px 0">${info.discount ? `🎊 ${escapeHTML(info.reason)} — ลดครึ่งราคา!<br>` : ''}${info.ownerDiscount ? `${escapeHTML(info.ownerReason)}<br>` : ''}ค่าเข้าวันนี้ <b>🪙${fmtNum(info.fee)}</b> <s style="opacity:.55">🪙${fmtNum(WORLD_ENTRY_FEE)}</s></p>`
      : `<p style="font-size:14px;margin:6px 0">ค่าเข้า <b>🪙${fmtNum(info.fee)}</b></p>`;
  /* 🔓 รอบ 943: โน้ต "ปลดล็อกโลกถัดไป" เลิกใช้ (ไม่มีลำดับโลกแล้ว) → แจ้งเรื่องยืมหุ่น/รถฟรีแทนเมื่อยังไม่มีของตัวเอง */
  const loanNote = (w.mode === 'drive' && !myCar())
    ? '<p style="font-size:12px;color:#8a7a9a;margin:4px 0">🚗 ยังไม่มีรถของตัวเอง — รอบนี้ระบบให้ยืมรถขับฟรี 1 คัน (อยากได้คันเก่งกว่า ซื้อได้ที่หมวดยานพาหนะ)</p>'
    : (w.mode === 'mecha' && !(state.robots && state.robots.length))
      ? `<p style="font-size:12px;color:#8a7a9a;margin:4px 0">🤖 ยังไม่มีหุ่นของตัวเอง — รอบนี้ระบบให้ยืมหุ่น ${escapeHTML(ROBOTS[0].name)} ฟรี 1 ตัว (ซื้อหุ่นของตัวเองได้ที่ตลาด)</p>`
      : '';
  const skyPicker = skyEntryPickerHTML(w, skyCharacters);
  const selectedSky = isSky ? (skyCharacters.find(c=>c.id === state.skyCharacter) || skyCharacters[0]) : null;
  const enterLabel = selectedSky
    ? `${info.free?'🚪 เข้าเป็น':'🪙 จ่ายแล้วเข้าเป็น'} ${escapeHTML(selectedSky.name)}`
    : (info.free?'🚪 เข้าเลย!':'🪙 จ่ายแล้วเข้าเลย!');
  const overlay = document.createElement('div');
  overlay.className = 'levelup-overlay';
  overlay.innerHTML = `<div class="levelup-box${isSky?' sky-entry-box':''}" style="${isSky?'max-width:780px;padding:12px 14px':'max-width:340px;padding:20px 24px'}">
    <h2 style="font-size:18px">${w.ico} เข้าโลก${w.label}</h2>
    ${feeHTML}
    ${loanNote}
    ${tinvNoticeHTML(w.mode)}
    ${skyPicker}
    <div class="${isSky?'sky-entry-actions':''}">
      <button class="big-btn green home-btn" id="we-enter" style="width:100%;margin:4px 0">${enterLabel}</button>
      ${tinvOnlineFriends().length ? `<button class="big-btn blue home-btn" id="we-invite" style="width:100%;margin:4px 0">📨 ชวนเพื่อนเล่นด้วยกัน (เงินคืนคนละ 🪙${fmtNum(TINV_CASHBACK)})</button>` : ''}
      <button class="big-btn" id="we-cancel" style="width:100%;font-size:14px;padding:8px;margin:4px 0 0">ยกเลิก</button>
    </div>
  </div>`;
  document.body.appendChild(overlay);
  overlay.addEventListener('click', e=>{ if(e.target===overlay) overlay.remove(); });
  overlay.querySelector('#we-cancel').addEventListener('click', ()=>overlay.remove());
  const inviteBtn = overlay.querySelector('#we-invite');
  if(inviteBtn) inviteBtn.addEventListener('click', ()=>openTinvPicker(w.mode));
  const enterBtn = overlay.querySelector('#we-enter');
  if(isSky){
    const nameEl = overlay.querySelector('#we-sky-character-name');
    overlay.querySelectorAll('[data-sky-entry-character]').forEach(button=>button.addEventListener('click',()=>{
      const character = skyCharacters.find(c=>c.id === button.dataset.skyEntryCharacter) || skyCharacters[0];
      state.skyCharacter = character.id;
      saveState();
      if(typeof authPushSave === 'function') authPushSave(false);
      overlay.querySelectorAll('[data-sky-entry-character]').forEach(item=>{
        const active = item.dataset.skyEntryCharacter === character.id;
        item.classList.toggle('selected',active);
        item.setAttribute('aria-pressed',String(active));
      });
      if(nameEl) nameEl.textContent = character.name;
      enterBtn.textContent = `${info.free?'🚪 เข้าเป็น':'🪙 จ่ายแล้วเข้าเป็น'} ${character.name}`;
    }));
  }
  enterBtn.addEventListener('click', ()=>startWorldEntry(w, info, unlocked, overlay, enterBtn));
}

/* ============================================================
   🧭 ป้ายบอกทางของรางเมนูซ้าย (รอบ 601 · ผู้ใช้สั่ง 26 ก.ค. 2026)
   ราง 21 ปุ่มยาวเกินจอ → เลื่อนแล้วปุ่มหลุดนอกจอ ผู้ใช้ที่ไม่ชำนาญนึกว่า "ปุ่มหาย"
   ทางแก้: ด้านที่ยังมีปุ่มซ่อนอยู่ = โชว์ ▲/▼ + ขอบจาง · กดแล้วเลื่อนให้เอง
   ============================================================ */
function railScrollHint(){
  const wrap = document.getElementById('rail-wrap');
  const rail = document.getElementById('lobby-rail');
  if(!wrap || !rail) return;
  const max = rail.scrollHeight - rail.clientHeight;         // เลื่อนได้สุดเท่าไร
  wrap.classList.toggle('more-up',   rail.scrollTop > 6);
  wrap.classList.toggle('more-down', max > 6 && rail.scrollTop < max - 6);
}
function railScrollTop(){                                    // กลับเมนูบนสุด (ใช้ตอนกลับเข้าล็อบบี้ด้วย)
  const rail = document.getElementById('lobby-rail');
  if(rail) rail.scrollTop = 0;
  railScrollHint();
}
function initRailScroll(){
  if(initRailScroll.done) return;                            // ผูก listener ครั้งเดียวพอ
  const rail = document.getElementById('lobby-rail');
  if(!rail) return;
  initRailScroll.done = true;
  rail.addEventListener('scroll', railScrollHint, {passive:true});
  window.addEventListener('resize', railScrollHint);
  const up = document.getElementById('rail-nudge-up');
  const dn = document.getElementById('rail-nudge-down');
  /* เลื่อนแบบลื่น + กันเหนียว: ถ้าเบราว์เซอร์ไม่ทำ smooth ให้ (บางเครื่อง/ประหยัดแบต) ก็กระโดดไปเลย */
  const glide = to=>{
    const from = rail.scrollTop;
    rail.scrollTo({top:to, behavior:'smooth'});
    setTimeout(()=>{ if(rail.scrollTop === from) rail.scrollTop = to; railScrollHint(); }, 380);
  };
  if(up) up.addEventListener('click', ()=>{ sfx.select(); glide(0); });
  if(dn) dn.addEventListener('click', ()=>{ sfx.select(); glide(rail.scrollTop + Math.max(60, rail.clientHeight*0.75)); });
}

/* สร้างปุ่มโลก 3D ในรางครั้งแรก แล้วอัปเดตสถานะล็อก/ปลดล็อกทุกครั้งที่ render */
function renderRailWorlds(){
  const rail = document.querySelector('.lobby-rail');
  if(!rail) return;
  let box = document.getElementById('rail-worlds');
  if(!box){                                                 // สร้างครั้งเดียว
    box = document.createElement('div');
    box.id = 'rail-worlds';
    box.className = 'rail-worlds';
    box.innerHTML = '<div class="rail-div">โลก 3D</div>';
    WORLD3D.forEach(w=>{
      const b = document.createElement('button');
      b.className = 'rail-btn rail-world';
      b.id = 'btn-world-' + w.mode;
      b.innerHTML = `<span class="rail-ico">${w.ico}</span>${w.label}`
        + (w.mode === 'sky' ? '<span class="rail-beta">PRIVATE BETA</span>' : '')
        + `<span class="rail-lock" style="display:none">🔒</span>`          // มุมขวาบน: ล็อกอยู่
        + `<span class="rail-count" style="display:none">0</span>`          // มุมขวาบน: จำนวนคำที่พิชิตแล้ว (ปลดล็อกแล้ว)
        + `<span class="rail-price" style="display:none"></span>`;          // ใต้ชื่อ: ราคาตั๋ว (ยังไม่มีตั๋ว)
      b.addEventListener('click', ()=>railWorldClick(w));
      box.appendChild(b);
    });
    rail.appendChild(box);
  }
  // 🎫→💰 รอบ 823: ราคาวันนี้ (คิดวันหยุด/วันเด็กแล้ว) · 🤖🚗 รอบ 945: mecha/drive ราคาต่างกันได้ถ้ามีของตัวเอง → คำนวณแยกต่อโลก
  WORLD3D.forEach(w=>{
    const info = worldEntryInfo(w.mode);
    const b = document.getElementById('btn-world-' + w.mode);
    if(!b) return;
    const betaVisible = w.mode !== 'sky' || (typeof canAccessSkyBeta === 'function' && canAccessSkyBeta());
    b.hidden = !betaVisible;
    if(!betaVisible) return;
    const done = Array.isArray(state[w.doneKey]) ? state[w.doneKey].length : 0;
    const lk = b.querySelector('.rail-lock');
    const cnt = b.querySelector('.rail-count');
    const pr  = b.querySelector('.rail-price');
    const comingSoon = world3DComingSoon(w);
    b.classList.toggle('soon-locked', comingSoon);
    b.title = comingSoon ? 'Coming soon' : '';
    if(comingSoon){
      b.classList.add('locked');
      if(lk){ lk.style.display = ''; lk.textContent = '🔒'; lk.title = 'Coming soon'; }
      if(cnt) cnt.style.display = 'none';
      if(pr) pr.style.display = 'none';
      return;
    }
    /* 🔓 รอบ 943: ยกเลิกลำดับปลดล็อกโลก (prereq) + หุ่นรบเข้าระบบค่าเข้าเดียวกับโลกอื่น (ไม่มีหุ่น=ยืมฟรี)
       ล็อก 🔒 เหลือเคสเดียว: โลกผจญภัยยังไม่มีสัตว์โตเต็มวัย */
    const locked = w.mode === 'adv' && !state.advTicket && !state.pets.some(p=>isAdult(p));
    b.classList.toggle('locked', locked);
    if(locked){
      if(lk){ lk.style.display = ''; lk.textContent = '🔒'; }
      if(cnt) cnt.style.display = 'none';
      if(pr) pr.style.display = 'none';
      return;
    }
    // 🔐 ค้างค่างวดรถ → กุญแจเหลืองล็อกทับ (ไม่มีรถไม่ล็อกแล้ว — ระบบให้ยืมรถฟรี)
    const carBlock = (w.mode === 'drive' && carDriveBlock() === 'overdue') ? 'overdue' : '';
    if(lk){
      lk.style.display = carBlock ? '' : 'none';
      if(carBlock){ lk.textContent = '🔐'; lk.title = 'ค้างค่างวดรถ — จ่ายก่อนถึงขับได้'; }
    }
    // ปลดล็อกแล้ว (เข้าได้) → โชว์ราคาวันนี้เสมอ (จ่ายทุกครั้ง) + จำนวนคำที่พิชิต (ถ้ามี)
    if(pr){
      pr.style.display = '';
      pr.textContent = info.free ? '🎉 ฟรี!' : '🪙' + fmtNum(info.fee);
      const afford = info.free || state.coins >= info.fee;
      pr.classList.toggle('afford', afford);
      pr.title = info.free ? info.reason
        : info.ownerDiscount ? (info.discount ? info.reason + ' + ' : '') + info.ownerReason
        : info.discount ? info.reason
        : (afford ? 'เหรียญพอเข้าได้แล้ว!' : '');
    }
    if(cnt){
      cnt.style.display = (done > 0 && !carBlock) ? '' : 'none';
      cnt.textContent = fmtNum(done);
      cnt.title = 'พิชิตไปแล้ว ' + fmtNum(done) + ' คำ';
    }
  });
  initRailScroll();                                           // 🧭 รอบ 601: ป้ายบอกทาง ▲/▼ (ปุ่มในรางเปลี่ยนความสูงได้ → อัปเดตทุก render)
  railScrollHint();
}

/* ---------- คำเชิญเล่นด้วยกัน (เงินคืนคนละ TINV_CASHBACK เมื่อเจอกันใน map) ---------- */
function tinvOnlineFriends(){
  if(!(window.Online && Online.ready && Online.presenceReady)) return [];
  return (Online.myFriends || []).filter(f=>typeof tinvPeerOnline === 'function' && tinvPeerOnline(f.uid));
}
function refreshTinvOnlineUI(){
  const anyOnlineFriend = tinvOnlineFriends().length > 0;
  document.querySelectorAll('#we-invite').forEach(btn=>{ btn.hidden = !anyOnlineFriend; });
  document.querySelectorAll('[data-tinv-online-uid]').forEach(btn=>{
    btn.hidden = !(typeof tinvPeerOnline === 'function' && tinvPeerOnline(btn.dataset.tinvOnlineUid));
  });
  document.querySelectorAll('.fq-overlay[data-tinv-uid]').forEach(overlay=>{
    if(typeof tinvPeerOnline === 'function' && tinvPeerOnline(overlay.dataset.tinvUid)) return;
    overlay.querySelectorAll('.fq-sec,.fq-worlds').forEach(el=>{ el.hidden = true; });
  });
}
function tinvNoticeHTML(map){
  if(map === 'sky' && !ensureSkyBetaAccess()) return '';
  if(state.tinvClaimed && state.tinvClaimed[map]) return '';
  if(!(window.Online && Online.tinv)) return '';
  const from = Object.values(Online.tinv).filter(v=>v.map===map);
  if(!from.length) return '';
  return `<div class="tinv-note">📨 <b>${escapeHTML(from[0].n)}</b> ชวนหนูไปเล่นด้วยกัน!
    เข้าโลกไปเจอกัน แล้วเล่นจบด้วยกัน (อยู่ด้วยกันต่อเนื่อง) รับเงินคืนคนละ <b>🪙${fmtNum(TINV_CASHBACK)}</b></div>`;
}
function openTinvPicker(map){
  if(map === 'sky' && !ensureSkyBetaAccess()) return;
  if(!(window.Online && Online.ready)){ sfx.wrong(); toast('⚠️ ยังไม่ได้เชื่อมต่อออนไลน์ — ลองใหม่อีกครั้งนะ'); return; }
  const friends = tinvOnlineFriends();
  if(!friends.length){ sfx.wrong(); toast('ตอนนี้ยังไม่มีเพื่อนออนไลน์พร้อมกัน — ปุ่มชวนจะปรากฏเมื่อเพื่อนออนไลน์นะ'); return; }
  const w = (typeof TINV_WORLD_LABEL !== 'undefined' && TINV_WORLD_LABEL[map]) || 'โลกผจญภัย 🌍';   // 🤝 รอบ 823: ป้ายชื่อรวมทุกโลกจาก js/online.js
  const overlay = document.createElement('div');
  overlay.className = 'levelup-overlay';
  overlay.innerHTML = `<div class="levelup-box" style="max-width:340px">
    <h2 style="font-size:18px">📨 ชวนเพื่อนไปเล่น${w}</h2>
    <p style="font-size:13px;margin:4px 0">เล่นจบด้วยกัน (อยู่ด้วยกันต่อเนื่อง) รับเงินคืน<b>คนละ 🪙${fmtNum(TINV_CASHBACK)}</b></p>
    <div style="max-height:44vh;overflow-y:auto;margin:8px 0">
      ${friends.map(f=>{
        const sent = state.tinvSent[f.uid] && state.tinvSent[f.uid].map===map;
        return `<button class="big-btn ${sent?'':'blue'}" data-uid="${f.uid}" data-n="${escapeHTML(f.n)}" data-tinv-online-uid="${escapeHTML(f.uid)}" ${sent?'disabled style="opacity:.55"':''}
          style="width:100%;margin:3px 0;font-size:14px;padding:8px">🟢 ${escapeHTML(f.n)}${sent?' · ✅ ชวนแล้ว':''}</button>`;
      }).join('')}
    </div>
    <button class="big-btn" id="tinv-close" style="width:100%;font-size:14px;padding:8px">ปิด</button>
  </div>`;
  document.body.appendChild(overlay);
  overlay.addEventListener('click', e=>{ if(e.target===overlay) overlay.remove(); });
  overlay.querySelector('#tinv-close').addEventListener('click', ()=>overlay.remove());
  overlay.querySelectorAll('button[data-uid]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const uid = btn.dataset.uid;
      tinvSend(uid, map).then(()=>{
        state.tinvSent[uid] = {map, ts: Date.now()};
        saveState();
        sfx.buy();
        toast(`📨 ส่งคำชวนถึง ${btn.dataset.n} แล้ว! เข้าโลกรอเจอกันได้เลย`);
        overlay.remove();
      }).catch(()=>{
        sfx.wrong(); toast('⚠️ ส่งคำชวนไม่สำเร็จ — ลองใหม่อีกครั้งนะ');
      });
    });
  });
}

/* ============================================================
   การ์ดสวนผลไม้ (ข้อ 12): ซื้อต้นไม้ปลูกได้ไม่จำกัด แต่ละต้นออกผล
   ตามเวลาของมัน · ครบเวลาแล้วเก็บขายได้ · ขายแล้วต้นไม่หาย เริ่ม
   ออกผลรอบใหม่ทันที (plantedAt=now) · นาฬิกานับถอยหลังต่อต้น
   ============================================================ */
function fruitCountdown(ms){                      // ตัวเลขนับถอยหลังแบบ วัน/ชม./นาที/วิ
  const totalSec = Math.ceil(ms/1000);
  const d = Math.floor(totalSec/86400);
  const h = Math.floor((totalSec%86400)/3600);
  const m = Math.floor((totalSec%3600)/60);
  const s = totalSec%60;
  if(d > 0) return `${d} วัน ${h} ชม. ${m} นาที`;
  if(h > 0) return `${h} ชม. ${m} นาที ${s} วิ`;
  if(m > 0) return `${m} นาที ${s} วิ`;
  return `${s} วิ`;
}

function renderFarmCard(){
  const el = document.getElementById('farm-card');
  if(!el) return;
  const now = Date.now();
  // ร้านต้นไม้ = การ์ดปัดแนวนอนสไตล์ SimCity BuildIt (หัวน้ำเงิน · ภาพใหญ่ · แถบราคาทอง)
  const shop = FRUITS.map(f=>{
    const mk = fruitMktLabel(f.id, now);
    return `
    <div class="hq-card farm-hq">
      <div class="hq-head">${f.name}</div>
      <div class="hq-pic"><span class="hq-emoji">${f.emoji}</span>
        <span class="hq-badge">⏰ โต ${f.growDays} วัน</span></div>
      <div class="farm-yield">ขายผลตอนนี้ <b>🪙${fmtNum(fruitSellNow(f.id, now))}</b><small>${mk.emoji} ตลาด ${mk.pct}% — ${mk.text}</small></div>
      <button class="hq-price craft-buy farm-buy-btn" data-fruit="${f.id}">🪙${fmtNum(f.price)} ปลูกเลย</button>
    </div>`;}).join('');

  let list, sig = '';
  if(state.farm.length){
    let readyCount = 0, readyTotal = 0;
    const rows = state.farm.map((t,i)=>{
      const f = fruitInfo(t.id);
      const left = fruitMsLeft(t, now);
      const ready = left <= 0;
      sig += ready ? '1' : '0';
      const sellNow = fruitSellNow(t.id, now);        // 📊 ราคาตลาดตอนนี้ ไม่ใช่ราคาฐาน
      if(ready){ readyCount++; readyTotal += sellNow; }
      const mk = fruitMktLabel(t.id, now);
      const status = ready
        ? (mk.pct < 90 ? `✅ ผลสุกแล้ว! ${mk.emoji} ตลาด ${mk.pct}%` : '✅ ผลสุกแล้ว! เก็บขายได้เลย')
        : '⏳ อีก ' + fruitCountdown(left);
      const action = ready
        ? `<button class="farm-sell-btn" data-tree="${i}">เก็บขาย 🪙${fmtNum(sellNow)}</button>`
        : `<div class="farm-grow-badge">🌱 กำลังโต</div>`;
      return `<div class="farm-tree ${ready ? 'ready' : ''}">
        <span class="farm-tree-emoji">${f.emoji}</span>
        <b class="farm-tree-name">${f.name}</b>
        <div class="farm-tree-status" id="farm-time-${i}">${status}</div>
        ${action}
      </div>`;
    }).join('');
    // ปุ่มรวบ: โผล่เมื่อมีต้นสุกตั้งแต่ 2 ต้นขึ้นไป (ต้นเดียวใช้ปุ่มของมันเองได้อยู่แล้ว)
    const sellAll = readyCount >= 2
      ? `<button class="farm-sellall-btn" id="btn-farm-sellall">🧺 เก็บขายทั้งหมดที่สุกแล้ว (${readyCount} ต้น) 🪙${fmtNum(readyTotal)}</button>`
      : '';
    list = `<div class="farm-sec"><h4 class="farm-sub">🌱 ต้นไม้ของหนู (${state.farm.length} ต้น)</h4>
      <div class="farm-mkt-hint"><small>📊 ขายผลชนิดเดียวถี่ๆ ราคาจะตก · พักขายสักพักราคาฟื้นเอง</small></div>${sellAll}
      <div class="strip-wrap"><button class="strip-arrow sa-l" aria-label="เลื่อนซ้าย">❮</button>
        <div class="farm-list strip-x">${rows}</div>
        <button class="strip-arrow sa-r" aria-label="เลื่อนขวา">❯</button></div></div>`;
  }else{
    list = `<div class="farm-sec"><div class="home-current none">
      <span class="home-emoji">🌱</span>
      <div><b>สวนยังว่างอยู่</b><br>
        <small>ซื้อต้นไม้มาปลูก รอผลสุกแล้วเก็บขายได้เงิน — ลงทุนครั้งเดียวเก็บผลได้เรื่อยๆ!</small>
      </div>
    </div></div>`;
  }

  el.innerHTML = `<h3 class="shop-title">🌳 สวนผลไม้</h3>
    <div class="farm-cols">
    <div class="farm-sec"><h4 class="farm-sub">🪴 ร้านต้นไม้ — ปัดซ้ายขวาเลือกได้เลย</h4>
      <div class="strip-wrap"><button class="strip-arrow sa-l" aria-label="เลื่อนซ้าย">❮</button>
        <div class="farm-shop strip-x">${shop}</div>
        <button class="strip-arrow sa-r" aria-label="เลื่อนขวา">❯</button></div></div>
    ${list}
    </div>`;
  el.dataset.readysig = sig;
  el.querySelectorAll('.strip-wrap').forEach(bindStripArrows);
  el.querySelectorAll('.farm-buy-btn').forEach(b=>b.addEventListener('click', ()=>buyFruit(b.dataset.fruit)));
  el.querySelectorAll('.farm-sell-btn').forEach(b=>b.addEventListener('click', ()=>sellFruit(+b.dataset.tree)));
  const sellAllBtn = document.getElementById('btn-farm-sellall');
  if(sellAllBtn) sellAllBtn.addEventListener('click', sellAllFruit);
}

/* อัปเดตนาฬิกานับถอยหลังต่อต้นทุกวินาที (เรียกจาก renderClock) */
function renderFarmClock(){
  const el = document.getElementById('farm-card');
  if(!el || !state.farm || !state.farm.length) return;
  const now = Date.now();
  let sig = '';
  state.farm.forEach((t,i)=>{
    const left = fruitMsLeft(t, now);
    sig += left <= 0 ? '1' : '0';
    if(left > 0){
      const tEl = document.getElementById('farm-time-'+i);
      if(tEl) tEl.textContent = '⏳ อีก ' + fruitCountdown(left);
    }
  });
  if(el.dataset.readysig !== sig) renderFarmCard();   // มีต้นสุกใหม่ → สร้างการ์ดใหม่ให้ปุ่มขายโผล่
}

function buyFruit(id){
  const f = fruitInfo(id);
  if(!f) return;
  if(state.coins < f.price){
    sfx.wrong(); toast(`ปลูก${f.name} 🪙${fmtNum(f.price)} — เหรียญยังไม่พอ สู้ๆ!`); return;
  }
  askConfirm(`<h2>${f.emoji} ปลูก${f.name}</h2>
    <p style="font-size:15px;margin:6px 0">ราคาต้น <b>🪙${fmtNum(f.price)}</b><br>
    โตเต็มที่ใน <b>${f.growDays} วัน</b> ขายผลได้สูงสุด <b>🪙${fmtNum(f.sell)}</b><br>
    <small>🌱 ขายแล้วต้นไม่หาย ออกผลรอบใหม่ทันที · 📊 ราคาขายขึ้นลงตามตลาด ขายถี่ราคาตก พักขายราคาฟื้น</small></p>`,
    'ปลูกเลย!', ()=>{
      state.coins -= f.price;
      state.farm.push({id: f.id, plantedAt: Date.now()});
      sfx.buy();
      toast(`${f.emoji} ปลูก${f.name}เรียบร้อย! อีก ${f.growDays} วันมาเก็บผลกันนะ 🎉`);
      saveState();
      renderDashboard();
    });
}

function sellFruit(i){
  const t = state.farm[i];
  if(!t) return;
  const f = fruitInfo(t.id);
  const now = Date.now();
  if(fruitMsLeft(t, now) > 0){              // ยังไม่สุก (อาจกดพร้อมนาฬิกาพอดี) — กันพลาด
    sfx.wrong(); toast('ผลยังไม่สุกนะ รออีกนิดหนึ่ง 🌱'); renderFarmCard(); return;
  }
  const gain = fruitSellNow(t.id, now);     // 📊 ขายตามราคาตลาดตอนนี้ (รอบ 395)
  addCoins(gain);
  fruitMktAdd(t.id, 1, now);                // อุปทานพุ่ง ราคาชนิดนี้ตกสำหรับรอบถัดไป
  t.plantedAt = now;                        // เริ่มออกผลรอบใหม่ทันที ต้นเดิมไม่หาย
  sfx.buy();
  floatFx(`+🪙${fmtNum(gain)}`);
  const mk = fruitMktLabel(t.id, now);
  toast(`${f.emoji} เก็บ${f.name}ขายได้ 🪙${fmtNum(gain)}! ${mk.pct < 90 ? mk.emoji+' ตลาดตอนนี้ '+mk.pct+'% — พักขายให้ราคาฟื้นนะ' : 'ต้นเริ่มออกผลรอบใหม่แล้ว 🌱'}`);
  saveState();
  renderDashboard();
}

/* เก็บขายทุกต้นที่สุกแล้วรวดเดียว — ต้นที่ขายเริ่มออกผลรอบใหม่ทันที (ต้นที่ยังไม่สุกไม่ยุ่ง) */
function sellAllFruit(){
  const now = Date.now();
  let count = 0, total = 0;
  const soldByType = {};                      // 📊 ขายทั้งล็อตที่ราคาตลาดตอนกด แล้วค่อยกดอุปทานทีเดียว (รอบ 395)
  for(const t of state.farm){
    if(fruitMsLeft(t, now) > 0) continue;
    const gain = fruitSellNow(t.id, now);
    addCoins(gain);
    total += gain; count++;
    soldByType[t.id] = (soldByType[t.id]||0) + 1;
    t.plantedAt = now;                        // เริ่มออกผลรอบใหม่ทันที ต้นเดิมไม่หาย
  }
  if(!count){ sfx.wrong(); toast('ยังไม่มีต้นไหนสุกเลยนะ รออีกนิด 🌱'); renderFarmCard(); return; }
  for(const id in soldByType) fruitMktAdd(id, soldByType[id], now);
  sfx.buy();
  floatFx(`+🪙${fmtNum(total)}`);
  toast(`🧺 เก็บผลสุก ${count} ต้นขายรวดเดียว ได้ 🪙${fmtNum(total)}! ขายทีละมากราคาจะตกนะ พักให้ตลาดฟื้นก่อน 📊`);
  saveState();
  renderDashboard();
}

/* ============================================================
   โรงงานผลิตสินค้า 🏭 + ตลาดขายต่อ (แนวคิดใหม่ 5 ก.ค. 2026)
   - โรงงานผลิต: เลือกสินค้าค้างไว้ → เล่นเกมคำศัพท์ ตอบถูก 1 คำ = 1 แต้มผลิต
     (เครื่องยนต์ addCraft ใน state.js — hook อยู่ใน game.js) ครบแล้วเข้าคลัง
   - ออเดอร์พิเศษ: ลูกค้าจำลองสั่งผลิตเจาะจง จ่ายแพงกว่าราคาฐาน (orderTick ใน state.js)
   - คลังของฉัน: ตั้งราคาขายเอง · ลูกค้าจำลองมาซื้อตามเวลา (marketTick)
   หมายเหตุ: ผู้ซื้อเป็น "จำลอง" — เฟส 2 ต่อ Firebase ให้ผู้เล่นจริงซื้อขายของที่เพื่อนผลิต
   ============================================================ */
function collectImg(id, display=false){
  const item = collectInfo(id);
  return display && item && item.displayImage
    ? versionedAssetPath(item.displayImage, COLLECTIBLES_IMG_V)
    : (IMG_FILES[`collect_${id}`] || null);
}

/* ============================================================
   โรงงานผลิต (แผง 🏭) — แยกออกจากตลาด (ผู้ใช้สั่ง 6 ก.ค. 2026)
   เฉพาะสายการผลิต: งานที่กำลังผลิต + แคตตาล็อกเลือกสินค้าผลิต
   ============================================================ */
function renderFactoryCard(){
  const el = document.getElementById('factory-card');
  if(!el) return;
  el.innerHTML = `<h3 class="shop-title">🏭 โรงงานผลิตสินค้า</h3>
    <p class="collect-sub">มีเหรียญพอ กด "ซื้อเลย" รับสินค้าเข้าคลังทันที · เหรียญไม่พอ เล่นเกมคำศัพท์เก็บแต้มผลิตเองได้ฟรี (ตอบถูก 1 คำ = 1 แต้ม) ได้ของแล้วเอาไปตั้งขายที่เมนู 🏪 ตลาดได้เลย</p>
    ${renderFactory()}`;
  bindLazyAssets(el);

  const catSel = document.getElementById('factory-cat');
  if(catSel) catSel.addEventListener('change', ()=>{ factoryCat = catSel.value; sfx.select(); renderFactoryCard(); });
  /* รอบ 292: แคตตาล็อกเป็นแถบปัดแนวนอนต่อเนื่อง — ปัดนิ้ว/ลูกศรเลื่อนเอง (เลิกแบ่งหน้า) */
  el.querySelectorAll('.strip-wrap').forEach(bindStripArrows);
  el.querySelectorAll('.craft-make').forEach(b=>b.addEventListener('click', ()=>startProduce(b.dataset.id, true)));
  el.querySelectorAll('.craft-buy').forEach(b=>b.addEventListener('click', ()=>buyCollectible(b.dataset.id)));
  const goBtn = document.getElementById('craft-go');
  if(goBtn) goBtn.addEventListener('click', ()=>startGame(null));
  const cancelBtn = document.getElementById('craft-cancel');
  if(cancelBtn) cancelBtn.addEventListener('click', cancelProduce);
}

/* ============================================================
   ตลาดขายสินค้า (แผง 🏪) — แยกออกจากโรงงาน
   ออเดอร์พิเศษ + คลังของฉัน (ตั้งราคาขาย) + รายการที่กำลังลงขาย + กล่องขายสำเร็จ
   ============================================================ */
function renderMarketCard(){
  const el = document.getElementById('market-card');
  if(!el) return;

  /* กล่องแจ้ง "ขายของสำเร็จ" (ลูกค้าจำลองมาซื้อของที่เราลงขาย) */
  let soldUI = '';
  if(state.tradeSold.length){
    const total = state.tradeSold.reduce((s,x)=>s + x.price, 0);
    const items = state.tradeSold.slice().reverse().map(x=>{
      const c = collectInfo(x.id);
      return `<li>${c ? c.emoji+' '+c.name : x.id} — 🪙${fmtNum(x.price)}</li>`;
    }).join('');
    soldUI = `<div class="mkt-sold">📬 <b>ขายสินค้าได้ ${state.tradeSold.length} ชิ้น!</b> รับเงินรวม 🪙${fmtNum(total)}
      <ul>${items}</ul>
      <button id="mkt-sold-ok">รับทราบ ✅</button></div>`;
  }

  el.innerHTML = `<h3 class="shop-title">🏪 ตลาดขายสินค้า</h3>
    <p class="collect-sub">เอาสินค้าที่ผลิตจากโรงงานมาตั้งราคาขาย หรือส่งมอบออเดอร์พิเศษให้ลูกค้าทำกำไร 🌍</p>
    <div class="mkt-listhead" id="mkt-mystock">🎁 คลังสินค้าของฉัน${state.collection.length?` (${state.collection.length} ชิ้น)`:''}</div>
    ${renderCollectMine()}
    <button class="wl-open" id="btn-wishlist">💖 ของที่หนูเล็งไว้${state.wishlist && state.wishlist.length ? ` (${state.wishlist.length})` : ''} <small>มีคนลงขาย = แจ้งเตือนทันที</small></button>
    ${soldUI}
    ${renderOrdersUI()}
    ${renderMarketBrowse()}
    ${renderVehicleShop()}`;
  bindLazyAssets(el);

  el.querySelectorAll('.strip-wrap').forEach(bindStripArrows);   // รอบ 292: ลูกศรแถบปัดแนวนอน (ตลาดรวม+คลังของฉัน)
  const soldOk = document.getElementById('mkt-sold-ok');
  if(soldOk) soldOk.addEventListener('click', ()=>{ state.tradeSold = []; saveState(); renderMarketCard(); });
  el.querySelectorAll('.order-deliver').forEach(b=>b.addEventListener('click', ()=>deliverOrder(+b.dataset.i)));
  el.querySelectorAll('.cc-list-btn').forEach(b=>b.addEventListener('click', ()=>openListDialog(b.dataset.id)));
  el.querySelectorAll('.ml-cancel').forEach(b=>b.addEventListener('click', ()=>cancelListing(+b.dataset.i)));
  el.querySelectorAll('.mb-buy').forEach(b=>b.addEventListener('click', ()=>openMarketBuyDialog(b.dataset.key)));
  el.querySelectorAll('.car-buy').forEach(b=>b.addEventListener('click', ()=>openCarBuyDialog(b.dataset.id)));
  el.querySelectorAll('.mkt-pet-card').forEach(b=>b.addEventListener('click', ()=>openPetPurchase(b.dataset.pet)));
  if(typeof csInit==='function') csInit();   // 🚗 โชว์รูมรถ (thumb+จอใหญ่ ตัวรถ+ภายในห้องโดยสาร วนโชว์)
  if(typeof rsInit==='function') rsInit();   // 🤖 โชว์รูมหุ่นยนต์ (thumb+จอใหญ่วนโชว์)
  const insBtn = document.getElementById('car-buy-ins');
  if(insBtn) insBtn.addEventListener('click', buyCarInsurance);
  const payBtn = document.getElementById('car-pay-loan');
  if(payBtn) payBtn.addEventListener('click', payCarLoanMonthly);
  const clsBtn = document.getElementById('car-close-loan');
  if(clsBtn) clsBtn.addEventListener('click', payCarLoanFull);
  el.querySelectorAll('.car-pick').forEach(b=>b.addEventListener('click', ()=>{   // 🚗 รอบ 211: เลือกคันที่จะขับ
    const i = +b.dataset.i;
    if(i===state.carIdx) return;
    state.carIdx = i; if(typeof sfx!=='undefined'&&sfx.select) sfx.select();
    const nm = carInfo(state.cars[i].id); if(nm) toast(`🚗 เปลี่ยนไปขับ ${nm.name} แล้ว`);
    saveState(); renderDashboard();
  }));
  const wl = document.getElementById('btn-wishlist');
  if(wl) wl.addEventListener('click', openWishlistDialog);
  updateWishBadge();
}

/* 💖 รอบ 126: badge ที่ปุ่มราง 🏪 ตลาด = จำนวนของที่เล็งไว้ซึ่งมีคนลงขายอยู่ตอนนี้ */
function updateWishBadge(){
  const b = document.getElementById('mkt-wish-badge');
  if(!b || typeof state === 'undefined') return;
  const me = (typeof onlineKey === 'function') ? onlineKey() : '';
  const n = (typeof Online !== 'undefined' && Online.marketOk)
    ? (Online.market || []).filter(m=>m.sid !== me && (state.wishlist || []).includes(m.id)).length : 0;
  b.style.display = n ? '' : 'none';
  b.textContent = n;
}

/* 💖 รอบ 126: กล่องเลือก "ของที่หนูเล็งไว้" — แตะสลับเล็ง/เลิกเล็งได้ทั้งแคตตาล็อก 50 ชิ้น */
function openWishlistDialog(){
  sfx.select();
  const overlay = document.createElement('div');
  overlay.className = 'levelup-overlay';
  const grid = ()=>COLLECTIBLES.map(c=>{
    const on = (state.wishlist || []).includes(c.id);
    const tier = COLLECT_TIERS[c.tier], img = collectImg(c.id);
    return `<div class="wl-it ${on ? 'on' : ''}" data-id="${c.id}" style="border-color:${on ? '#e0447a' : tier.color}">
      ${img ? lazyAssetHTML(img, c.name) : `<span class="wl-emoji">${c.emoji}</span>`}
      <div class="wl-name">${c.name}</div>
      <div class="wl-h">${on ? '💖 เล็งอยู่' : '🤍 แตะเพื่อเล็ง'}</div>
    </div>`;
  }).join('');
  overlay.innerHTML = `<div class="levelup-box wl-box">
    <div class="wl-head">
      <h2>💖 ของที่หนูเล็งไว้</h2>
      <button class="cf-ok wl-done">เสร็จแล้ว ✅</button>
    </div>
    <p class="ld-note">แตะเลือกของที่อยากได้ — พอมีผู้เล่นอื่นลงขายในตลาด เกมจะแจ้งเตือนหนูทันที! · ปัดซ้ายขวาดูของทั้งหมด</p>
    <div class="strip-wrap">
      <button class="strip-arrow sa-l" aria-label="เลื่อนซ้าย">❮</button>
      <div class="wl-grid strip-x">${grid()}</div>
      <button class="strip-arrow sa-r" aria-label="เลื่อนขวา">❯</button>
    </div>
  </div>`;
  const wrap = overlay.querySelector('.wl-grid');
  bindStripArrows(overlay.querySelector('.strip-wrap'));
  wrap.addEventListener('click', e=>{
    const it = e.target.closest('.wl-it');
    if(!it) return;
    const id = it.dataset.id;
    if(!Array.isArray(state.wishlist)) state.wishlist = [];
    const i = state.wishlist.indexOf(id);
    if(i >= 0) state.wishlist.splice(i, 1); else state.wishlist.push(id);
    sfx.select();
    saveState();
    wrap.innerHTML = grid();
    bindLazyAssets(wrap);
    updateWishBadge();
  });
  overlay.querySelector('.cf-ok').addEventListener('click', ()=>{ overlay.remove(); renderMarketCard(); });
  document.body.appendChild(overlay);
  bindLazyAssets(overlay);
}

/* ลูกศรเลื่อนแถบปัดแนวนอน (สไตล์ SimCity BuildIt) — wrap = .strip-wrap ที่มี .strip-x ข้างใน
   คลิกเลื่อนทีละ ~80% ของช่องมอง · เนื้อหาไม่ล้น = ซ่อนลูกศรเอง (เรียกซ้ำได้หลัง re-render) */
function bindStripArrows(wrap, opts){
  if(!wrap) return;
  const strip = wrap.querySelector('.strip-x');
  // 🦸 รอบ 895: blk-x (ตัวเลือกตัวละคร) ส่ง {full:true} มา — กระโดดเต็มหน้า (5 ตัว) แทนเลื่อนซ้อน 80% เดิม
  //   ตัว strip อื่นทั้งหมด (โรงงาน/ตลาด/โชว์รูมรถ ฯลฯ) เรียกแบบไม่ใส่ opts → พฤติกรรม 0.8 เดิมเป๊ะ ไม่กระทบ
  const page = ()=> Math.max(120, strip.clientWidth * (opts && opts.full ? 1 : 0.8));
  const l = wrap.querySelector('.sa-l'), r = wrap.querySelector('.sa-r');
  if(l && !l.dataset.bound){ l.dataset.bound = '1'; l.addEventListener('click', ()=>{ sfx.select(); strip.scrollBy({left:-page(), behavior:'smooth'}); }); }
  if(r && !r.dataset.bound){ r.dataset.bound = '1'; r.addEventListener('click', ()=>{ sfx.select(); strip.scrollBy({left: page(), behavior:'smooth'}); }); }
  // setTimeout ไม่ใช่ rAF — rAF ไม่ยิงตอนแท็บ hidden (วัดแล้วซ่อนลูกศรไม่ทำงาน)
  setTimeout(()=> wrap.classList.toggle('no-x', strip.scrollWidth <= strip.clientWidth + 4), 0);
}

/* 🏪 item 2: ตลาดรวมทั้งเซิร์ฟเวอร์ — ผู้เล่นทุกคนเห็นทุกประกาศ รวมประกาศของตัวเอง */
function renderMarketBrowse(){
  if(typeof Online === 'undefined' || !Online.marketOk) return '';
  const me = (typeof onlineKey === 'function') ? onlineKey() : '';
  const items = Online.market || [];
  const inner = items.length
    ? `<div class="strip-wrap mb-strip"><button class="strip-arrow sa-l" aria-label="เลื่อนซ้าย">❮</button><div class="strip-x grid2x8">` + items.map(m=>{
        const c = collectInfo(m.id), tier = COLLECT_TIERS[c.tier], img = collectImg(m.id);
        const own = m.sid === me;
        const afford = !own && state.coins >= m.p;
        const wished = (state.wishlist || []).includes(m.id);   // 💖 ของที่เล็งไว้ — ขับให้เด่น
        return `<div class="hq-card ${wished ? 'mb-wish' : ''}" style="border-color:${wished ? '#e0447a' : tier.color}">
          <div class="hq-head">${own ? '🏪 ' : (wished ? '💖 ' : '')}${c.name}</div>
          <div class="hq-pic">
            ${img ? lazyAssetHTML(img, c.name) : `<span class="hq-emoji">${c.emoji}</span>`}
            <span class="hq-stars" style="color:${tier.color}">${tier.stars}</span>
          </div>
          <div class="mb-seller">${own ? '🏪 ร้านของฉัน' : `🧑 ร้านของ ${escapeHTML(m.sn)}`}</div>
          ${own
            ? `<button class="hq-price" disabled title="ถอนขายได้ที่คลังสินค้าของฉัน">🪙${fmtNum(m.p)} · โพสต์ขายแล้ว</button>`
            : `<button class="hq-price mb-buy ${afford?'':'cant-afford'}" data-key="${m.key}">🪙${fmtNum(m.p)} · ซื้อเลย</button>`}
        </div>`;
      }).join('') + `</div><button class="strip-arrow sa-r" aria-label="เลื่อนขวา">❯</button></div>`
    : `<div class="mkt-empty">ยังไม่มีผู้เล่นลงขายตอนนี้ — ผลิตของแล้วมาเปิดร้านคนแรกกันเถอะ! 🏪</div>`;
  return `<div class="mkt-listhead">🌏 ตลาดผู้เล่นทั้งหมด — ทุกคนเห็นทุกประกาศ${items.length?` (${items.length} ชิ้น)`:''}</div>` + inner;
}

/* 🛒 รอบ 1235: ยืนยันการซื้อต้องผ่านรหัส 6 หลักก่อน — ไม่หักเงินตอนแตะการ์ด */
function openMarketBuyDialog(key){
  if(!key || mktBuying) return;
  if(!Online.marketOk || !Array.isArray(Online.market)){
    sfx.wrong();
    toast('ยังโหลดตลาดไม่เสร็จ — ลองกดอีกครั้งนะ');
    return;
  }

  const item = Online.market.find(m=>m.key === key);
  if(!item){ sfx.wrong(); toast('รายการนี้ถูกซื้อไปแล้ว หรือยังไม่เปิดอยู่'); return; }

  const c = collectInfo(item.id);
  if(!c){
    sfx.wrong();
    toast('ข้อมูลสินค้าไม่ครบ — แจ้งทีมงานให้เพิ่มรูปและชื่อให้หนูได้ตรงๆ นะ');
    return;
  }

  const pic = collectImg(item.id);
  const picHtml = pic
    ? `<img class="mkt-buy-pic-img" src="${pic}" alt="${escapeHTML(c.name)}">`
    : `<span class="mkt-buy-pic-emoji">${c.emoji || '🧸'}</span>`;
  const code = Math.floor(Math.random()*1000000).toString().padStart(6, '0');
  const overlay = document.createElement('div');
  overlay.className = 'levelup-overlay mkt-buy-overlay';
  const price = Number(item.p) || 0;
  const myCoins = Number(state.coins) || 0;
  let input = '';
  let processing = false;
  const confirmText = `ยืนยันการซื้อ`;

  overlay.innerHTML = `<div class="levelup-box mkt-buy-box">
    <h2>ยืนยันการซื้อ</h2>
    <div class="mkt-buy-item">
      <div class="mkt-buy-pic">${picHtml}</div>
      <div class="mkt-buy-meta">
        <div class="mkt-buy-name">${escapeHTML(c.name)}</div>
        <div class="mkt-buy-seller">ร้าน: ${escapeHTML(item.sn || 'เพื่อน')}</div>
        <div class="mkt-buy-price">ราคา: 🪙${fmtNum(price)}</div>
        <div class="mkt-buy-balance">เหรียญปัจจุบัน: 🪙${fmtNum(myCoins)}</div>
      </div>
    </div>
    <div class="mkt-confirm-code-title">รหัสยืนยัน:</div>
    <div class="mkt-code-target">${code}</div>
    <div class="mkt-pin-note">กรุณากดตัวเลขด้านล่างให้ตรงกับรหัสด้านบน</div>
    <div class="mkt-code-input" id="mkt-code-input"></div>
    <div class="mkt-code-error" id="mkt-code-error"></div>
    <div class="mkt-pin-grid">
      <button class="mkt-pin-btn" data-d="1">1</button><button class="mkt-pin-btn" data-d="2">2</button><button class="mkt-pin-btn" data-d="3">3</button>
      <button class="mkt-pin-btn" data-d="4">4</button><button class="mkt-pin-btn" data-d="5">5</button><button class="mkt-pin-btn" data-d="6">6</button>
      <button class="mkt-pin-btn" data-d="7">7</button><button class="mkt-pin-btn" data-d="8">8</button><button class="mkt-pin-btn" data-d="9">9</button>
      <button class="mkt-pin-btn" data-d="0">0</button>
      <button class="mkt-pin-btn mkt-pin-del" data-act="del">⌫ ลบตัวเลขล่าสุด</button>
      <button class="mkt-pin-btn mkt-pin-clear" data-act="clear">ล้างทั้งหมด</button>
    </div>
    <div class="mkt-buy-actions">
      <button class="cf-no mkt-buy-cancel">ยกเลิก</button>
      <button class="cf-ok mkt-buy-confirm" disabled>${confirmText}</button>
    </div>
  </div>`;

  const inputEl = overlay.querySelector('#mkt-code-input');
  const errEl = overlay.querySelector('#mkt-code-error');
  const confirmBtn = overlay.querySelector('.mkt-buy-confirm');
  const cancelBtn = overlay.querySelector('.mkt-buy-cancel');
  const refresh = ()=>{
    if(input.length < 6){
      errEl.textContent = '';
      confirmBtn.disabled = true;
    }else{
      if(input === code){
        errEl.textContent = '';
        confirmBtn.disabled = false;
      }else{
        errEl.textContent = 'รหัสไม่ถูกต้อง กรุณาลองใหม่';
        confirmBtn.disabled = true;
      }
    }
    const show = input + '_'.repeat(Math.max(0, 6 - input.length));
    inputEl.textContent = show.split('').join(' ');
  };
  const close = ()=>{ if(overlay.parentNode) overlay.remove(); };
  overlay.querySelectorAll('.mkt-pin-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      if(processing) return;
      const d = btn.dataset.d;
      const act = btn.dataset.act;
      if(d && input.length < 6){ input += d; refresh(); sfx.select(); return; }
      if(act === 'del'){ input = input.slice(0, -1); refresh(); sfx.select(); }
      if(act === 'clear'){ input = ''; refresh(); sfx.select(); }
    });
  });
  cancelBtn.addEventListener('click', ()=>{ if(!processing) close(); });
  overlay.addEventListener('click', e=>{ if(e.target===overlay && !processing) close(); });
  confirmBtn.addEventListener('click', ()=>{
    if(processing || confirmBtn.disabled) return;
    processing = true;
    confirmBtn.disabled = true;
    confirmBtn.textContent = 'กำลังดำเนินการ...';
    cancelBtn.disabled = true;
    buyMarketItem(item.key).then(r=>{
      if(r && r.ok){
        close();
        return;
      }
      close();
      renderMarketCard();
    }).catch(()=>{ close(); });
  });

  refresh();
  document.body.appendChild(overlay);
}

/* ============================================================
   🚗 รอบ 131: หมวดยานพาหนะ — โชว์รูมรถ 10 คัน (แคตตาล็อก 5 ช่อง/แถว)
   ตั๋วขับรถ = สิทธิ์เข้าเมือง · รถ = พาหนะ ต้องซื้อแยก (ผู้ใช้เคาะ 11 ก.ค. 2026)
   ภาพ img/cars/<id>.png probe อัตโนมัติ — ไม่มีภาพใช้ 🚗 บนพื้นสีประจำคัน เกมไม่พัง
   ============================================================ */
let carsProbed = false;
function carImg(id){ return IMG_FILES[id] || null; }
function renderVehicleShop(){
  if(!carsProbed){
    carsProbed = true;
    probeImages(CARS.map(c=>c.id), 'img/cars').then(()=>{ if(document.getElementById('mkt-vehicles')) renderMarketCard(); });
  }
  /* 🚗 รอบ 211: รถของหนูหลายคัน — แถบเลือกคันขับ + รายละเอียดคันที่ขับอยู่ (พ.ร.บ./ประกัน/ผ่อน) */
  let mine = '';
  if(state.cars && state.cars.length){
    const pick = state.cars.map((car,i)=>{
      const my = carInfo(car.id), img = carImg(car.id), isA = (i===state.carIdx);
      return `<button class="car-pick${isA?' active':''}" data-i="${i}" style="border-color:${my.c}" title="${my.name}">
        <div class="car-pick-pic">${img?`<img src="${img}" alt="">`:`<span class="car-emoji" style="background:${my.c}33;border-color:${my.c}">🚗</span>`}</div>
        <div class="car-pick-name">${my.name}${isA?' <b>▶</b>':''}</div>
        ${car.loan&&car.loan.carry?'<div class="car-pick-od">⚠️ ค้างงวด</div>':''}
      </button>`;
    }).join('');
    const car = myCar(), my = carInfo(car.id), img = carImg(my.id);
    const L = car.loan, overdue = carLoanOverdue(), payable = carLoanPayable();
    const detail = `<div class="car-mine" style="border-color:${my.c}">
      <div class="car-mine-pic">${img?`<img src="${img}" alt="">`:`<span class="car-emoji" style="background:${my.c}33;border-color:${my.c}">🚗</span>`}</div>
      <div class="car-mine-info">
        <b>▶ คันที่ขับอยู่: ${my.name}</b><br>
        <small>📋 พ.ร.บ. ✅ · 🛡️ ประกันภัย ${car.insured
          ? '✅ คุ้มครองชนรถผู้เล่นอื่น'
          : `❌ ยังไม่มี (ชนรถเพื่อน = จ่ายเอง 🪙${fmtNum(CAR_HITCAR_FEE)}/ครั้ง)`}</small>
        ${L?`<div class="car-loan ${overdue?'od':''}">📅 ผ่อนเหลือ <b>🪙${fmtNum(L.remain)}</b> · เดือนละ 🪙${fmtNum(L.perMonth)}${
          overdue?`<br>⚠️ <b>ค้างงวด 🪙${fmtNum(overdue)} — ขับคันนี้ไม่ได้จนกว่าจะจ่าย!</b>`
          :(carLoanDue()-L.paid>0?`<br>งวดเดือนนี้เหลือ 🪙${fmtNum(carLoanDue()-L.paid)}`:'<br>งวดเดือนนี้จ่ายแล้ว ✅')}</div>`
        :'<div class="car-loan">💵 จ่ายครบแล้ว — รถเป็นของหนูเต็มตัว!</div>'}
      </div>
      <div class="car-mine-btns">
        ${!car.insured?`<button class="hq-price" id="car-buy-ins">🛡️ ซื้อประกัน 🪙${fmtNum(CAR_INSURANCE)}</button>`:''}
        ${L&&payable>0?`<button class="hq-price ${overdue?'car-od-btn':''}" id="car-pay-loan">📅 จ่ายงวด 🪙${fmtNum(payable)}</button>`:''}
        ${L?`<button class="hq-price" id="car-close-loan">💰 โปะปิดยอด 🪙${fmtNum(L.remain)}</button>`:''}
      </div>
    </div>`;
    mine = `<div class="car-mine-head">🚘 รถของหนู (${state.cars.length} คัน) — แตะเลือกคันที่จะขับ · ทุกคันนับเป็นทรัพย์สินในแรงค์</div>
      <div class="car-pick-list">${pick}</div>${detail}`;
  }
  return `<div class="mkt-listhead" id="mkt-vehicles">🚗 ยานพาหนะ — โชว์รูมรถ</div>
    <div class="gp-note">มีตั๋วโลกขับรถแล้วต้องมี<b>รถ</b>ถึงจะออกถนนได้ · <b>ซื้อสะสมได้หลายคัน</b> (ทุกคันนับเป็นทรัพย์สินในแรงค์ · เลือกคันขับได้) · ซื้อรถต้องมี <b>พ.ร.บ.</b> (บังคับ 🪙${fmtNum(CAR_PRB)})
    · <b>ประกันภัย</b>เลือกได้ (🪙${fmtNum(CAR_INSURANCE)} — คุ้มครองชนรถผู้เล่นอื่น)
    · จ่ายสด หรือผ่อน ${CAR_LOAN_MONTHS} เดือน (ดาวน์ ${Math.round(CAR_DOWN_RATE*100)}%) โปะปิดยอดได้ทุกเมื่อ</div>
    ${mine}
    ${renderCarShowroom()}
    ${renderRobotShop()}
    ${renderPetMarketShop()}`;
}

/* 🚗 รอบ 212: โชว์รูมรถ — thumb ซ้าย (ตัวรถ+ราคา+ยอดขาย) · จอใหญ่ขวา (ตัวรถใหญ่ไฟฟ้าไล่ตัวสีประจำคัน + ภาพภายในห้องโดยสาร)
   ไม่แตะ = วนโชว์ทีละคันทุก 4.2 วิ · แตะ = ค้างดูคันนั้น + หยุดวน 2 นาที แล้ววนต่อ (แพตเทิร์นเดียวกับโชว์รูมหุ่นยนต์) */
let carsInteriorProbed = false, csIdx = 0, csPausedUntil = 0, csTimer = null;
const CS_CYCLE_MS = 4200, CS_PAUSE_MS = 120000;
function carInteriorImg(id){ return IMG_FILES['dash_'+id] || null; }
/* 🚗 รอบ 232: ป้ายสมรรถนะในโชว์รูม (ความเร็ว/อัตราเร่ง/เกาะถนน · 5 ขีด) — สีตามคัน · ผูกกับการขับจริง */
function carStatHtml(c){
  const rows=[['⚡','ความเร็ว',c.spd||3],['🚀','อัตราเร่ง',c.acc||3],['🛞','เกาะถนน',c.grip||3]];
  return `<div class="cs-stats" style="--cc:${c.c}">${rows.map(([ic,lb,v])=>
    `<div class="cs-stat"><span class="cs-stat-l">${ic} ${lb}</span>`+
    `<span class="cs-stat-bar">${[1,2,3,4,5].map(n=>`<i class="${n<=v?'on':''}"></i>`).join('')}</span></div>`
  ).join('')}</div>`;
}
function renderCarShowroom(){
  if(!carsInteriorProbed){
    carsInteriorProbed = true;
    probeImages(CARS.map(c=>'dash_'+c.id), 'img/car').then(()=>{ if(document.getElementById('cs-stage')) renderMarketCard(); });
  }
  const owned = new Set((state.cars||[]).map(c=>c.id));
  const thumbs = CARS.map((c,i)=>{
    const img = carImg(c.id), mineC = owned.has(c.id);
    return `<button class="cs-thumb${mineC?' owned-c':''}" data-i="${i}" data-id="${c.id}" style="--cc:${c.c}">
      <div class="cs-thumb-pic">${img?`<img src="${img}" alt="">`:`<span class="car-emoji" style="background:${c.c}33;border-color:${c.c}">🚗</span>`}</div>
      <div class="cs-thumb-name">${c.name}</div>
      <div class="cs-thumb-price">🪙${fmtNum(c.price)}</div>
      ${mineC?'<div class="cs-thumb-own">🚘 มีแล้ว</div>':''}
      ${soldBadge(c.id)}
    </button>`;
  }).join('');
  /* รอบ 624: จอใหญ่เต็มความกว้างด้านบน + แคตตาล็อกรถ 2 แถว × 8 คอลัมน์ (.grid2x8 + ลูกศร) ด้านล่าง — ผังเดียวกับแคตตาล็อกโรงงาน */
  return `<div class="cs-showroom">
    <div class="cs-stage" id="cs-stage">
      <div class="cs-big" id="cs-big"></div>
      <div class="cs-interior" id="cs-interior"></div>
      <div class="cs-info" id="cs-info"></div>
    </div>
    <div class="strip-wrap"><button class="strip-arrow sa-l" aria-label="เลื่อนซ้าย">❮</button><div class="cs-list strip-x grid2x8">${thumbs}</div><button class="strip-arrow sa-r" aria-label="เลื่อนขวา">❯</button></div>
  </div>`;
}
/* แสดงรถคันที่ i บนจอใหญ่ — ตัวรถ (mask ไฟฟ้าไล่ตัวสีประจำคัน) + ภาพภายในห้องโดยสาร + ป้ายข้อมูล/ปุ่มซื้อ */
function csShowBig(i){
  const c = CARS[i]; if(!c) return;
  const big = document.getElementById('cs-big'), inr = document.getElementById('cs-interior'), info = document.getElementById('cs-info');
  if(!big || !inr || !info) return;
  const img = carImg(c.id), inrImg = carInteriorImg(c.id), have = (state.cars||[]).some(x=>x.id===c.id);
  if(img){
    big.style.setProperty('--cs-img', `url("${img}")`);
    big.style.setProperty('--cc', c.c);
    big.innerHTML = `<img class="cs-big-img" src="${img}" alt="${escapeHTML(c.name)}"><div class="cs-elec"><i></i></div><div class="cs-edge"><i></i></div>`;
  }else{
    big.style.removeProperty('--cs-img');
    big.innerHTML = `<div style="font-size:120px;filter:drop-shadow(0 0 30px ${c.c})">🚗</div>`;
  }
  inr.innerHTML = inrImg
    ? `<div class="cs-inr-label">🪑 ภายในห้องโดยสาร</div><img class="cs-inr-img" src="${inrImg}" alt="ภายใน ${escapeHTML(c.name)}">`
    : `<div class="cs-inr-label dim">🪑 ภาพภายในกำลังมา…</div>`;
  const minToday = Math.ceil(c.price*CAR_DOWN_RATE) + CAR_PRB;
  info.innerHTML = `<div class="cs-name" style="color:${c.c}">${escapeHTML(c.name)}</div>
    <div class="cs-meta"><span class="cs-price">🪙${fmtNum(c.price)}</span>${soldBadge(c.id)}</div>
    ${carStatHtml(c)}
    ${have?`<button class="cs-buy own" disabled>🚘 มีคันนี้แล้ว</button>`
      :`<button class="cs-buy ${state.coins>=minToday?'':'cant-afford'}" data-id="${c.id}">🛒 ดูรายละเอียด / ซื้อ</button>`}`;
  const buy = info.querySelector('.cs-buy:not(.own)');
  if(buy) buy.addEventListener('click', ()=>openCarBuyDialog(buy.dataset.id));
  document.querySelectorAll('.cs-thumb').forEach(t=>t.classList.toggle('active', +t.dataset.i===i));
}
/* เรียกหลัง render market — ผูกคลิก thumb + เริ่มวนโชว์ */
function csInit(){
  const room = document.querySelector('.cs-showroom'); if(!room) return;
  if(csIdx >= CARS.length) csIdx = 0;
  csShowBig(csIdx);
  room.querySelectorAll('.cs-thumb').forEach(b=>b.addEventListener('click', ()=>{
    csIdx = +b.dataset.i; csPausedUntil = Date.now() + CS_PAUSE_MS;
    if(typeof sfx!=='undefined' && sfx.select) sfx.select();
    csShowBig(csIdx);
  }));
  clearInterval(csTimer);
  csTimer = setInterval(()=>{
    const big = document.getElementById('cs-big');
    if(!big){ clearInterval(csTimer); csTimer = null; return; }   // ตลาด re-render/ปิด → หยุด
    if(!big.offsetParent) return;                                  // จอซ่อนอยู่ = ไม่วน
    if(Date.now() < csPausedUntil) return;                         // เพิ่งแตะดู (ภายใน 2 นาที)
    csIdx = (csIdx + 1) % CARS.length;
    csShowBig(csIdx);
  }, CS_CYCLE_MS);
}

/* 🤖 หุ่นยนต์นักรบ (หมวดยานพาหนะ) — โชว์รูม: thumb ซ้าย (ราคา+ยอดขาย) · จอใหญ่ขวา (ไฟฟ้าไล่ตัว premium)
   ไม่แตะ = วนโชว์ทีละตัวทุก 3.5 วิ · แตะ = ค้างดูตัวนั้น + หยุดวน 2 นาที (บางคนหยุดดูจริง) แล้ววนต่อ */
let robotsProbed = false, rsIdx = 0, rsPausedUntil = 0, rsTimer = null;
const RS_CYCLE_MS = 3500, RS_PAUSE_MS = 120000;   // วนทุก 3.5 วิ · หยุดวน 2 นาทีหลังแตะ
function robotImg(id){ return IMG_FILES[id] || null; }
function renderRobotShop(){
  if(!robotsProbed){
    robotsProbed = true;
    probeImages(ROBOTS.map(r=>r.id), 'img/robots').then(()=>{ if(document.getElementById('mkt-robots')) renderMarketCard(); });
  }
  const owned = state.robots || [];
  const thumbs = ROBOTS.map((r,i)=>{
    const img = robotImg(r.id);
    return `<button class="rs-thumb${owned.includes(r.id)?' owned-r':''}" data-i="${i}" data-id="${r.id}" style="--rc:${r.c}">
      <div class="rs-thumb-pic">${img?`<img src="${img}" alt="">`:`<span class="car-emoji" style="background:${r.c}33;border-color:${r.c}">🤖</span>`}</div>
      <div class="rs-thumb-price">🪙${fmtNum(r.price)}</div>
      ${soldBadge(r.id)}
    </button>`;
  }).join('');
  return `<div class="mkt-listhead" id="mkt-robots">🤖 หุ่นยนต์นักรบ — โชว์รูมหุ่นรบ</div>
    <div class="gp-note">แตะหุ่นเพื่อดูตัวใหญ่ · ไม่แตะ = โชว์วนทีละตัว · <b>ซื้อกี่ตัวก็ได้</b> สะสมเป็นทรัพย์สินในแรงค์ · มี ≥1 ตัว = เข้า<b>โลกหุ่นยนต์นักรบ</b> ยิงเอเลี่ยน คำละ 🪙35</div>
    <div class="rs-showroom">
      <div class="rs-stage"><div class="rs-big" id="rs-big"></div><div class="rs-info" id="rs-info"></div></div>
      <div class="strip-wrap"><button class="strip-arrow sa-l" aria-label="เลื่อนซ้าย">❮</button><div class="rs-list strip-x grid2x8">${thumbs}</div><button class="strip-arrow sa-r" aria-label="เลื่อนขวา">❯</button></div>
    </div>`;
}

/* 🐾 รอบ 1317: สัตว์ทุกชนิดอยู่ต่อจากโชว์รูมหุ่นยนต์ในตลาด
   ใช้ PETS/ภาพ/ราคาและ purchase flow ชุดเดียวกับร้านสัตว์เดิม */
function renderPetMarketShop(){
  const cards = Object.keys(PETS).map(key=>{
    const p = PETS[key], img = IMG_FILES[startImgKey(key)];
    const owned = hasPetType(key), afford = state.coins >= p.price;
    return `<button type="button" class="mkt-pet-card${owned?' owned-pet':''}${!owned&&!afford?' cant-afford':''}" data-pet="${key}" aria-label="${owned?'เลี้ยงอยู่แล้ว':`ซื้อ ${escapeHTML(p.name)}`}">
      <span class="mkt-pet-picture">${img ? `<img src="${img}" alt="${escapeHTML(p.eggName)}">` : startHTML(key)}</span>
      <span class="mkt-pet-name">${escapeHTML(p.name)}</span>
      <span class="mkt-pet-stage">${escapeHTML(p.eggName)}</span>
      <span class="mkt-pet-price">${owned ? '✅ เลี้ยงอยู่แล้ว' : `🪙${fmtNum(p.price)}`}</span>
      ${!owned&&!afford ? `<span class="mkt-pet-short">ขาดอีก 🪙${fmtNum(p.price-state.coins)}</span>` : ''}
      ${soldBadge('pet_'+key)}
    </button>`;
  }).join('');
  return `<div class="mkt-listhead mkt-pet-head" id="mkt-pets">🐾 สัตว์เลี้ยงทั้งหมด — รับน้องกลับบ้าน</div>
    <div class="gp-note">สัตว์ทุกชนิดใช้ราคาและกติกาเดียวกับร้านสัตว์ · เลี้ยงได้ชนิดละ 1 ตัว · ต้องตั้งชื่อก่อนซื้อ</div>
    <div class="strip-wrap mkt-pet-wrap"><button class="strip-arrow sa-l" aria-label="เลื่อนซ้าย">❮</button><div class="mkt-pet-list strip-x grid2x8">${cards}</div><button class="strip-arrow sa-r" aria-label="เลื่อนขวา">❯</button></div>`;
}
/* แสดงหุ่นตัวที่ i บนจอใหญ่ + ไฟฟ้าไล่ตัว (mask ตามรูปหุ่น) + ป้ายข้อมูล/ปุ่มซื้อ */
function rsShowBig(i){
  const r = ROBOTS[i]; if(!r) return;
  const big = document.getElementById('rs-big'), info = document.getElementById('rs-info');
  if(!big || !info) return;
  const img = robotImg(r.id), have = (state.robots||[]).includes(r.id);
  if(img){
    big.style.setProperty('--rs-img', `url("${img}")`);
    big.innerHTML = `<img class="rs-big-img" src="${img}" alt="${escapeHTML(r.name)}"><div class="rs-elec"><i></i></div><div class="rs-edge"><i></i></div>`;
  }else{
    big.style.removeProperty('--rs-img');
    big.innerHTML = `<div style="font-size:120px;filter:drop-shadow(0 0 30px ${r.c})">🤖</div>`;
  }
  info.innerHTML = `<div class="rs-name">${escapeHTML(r.name)}</div>
    <div class="rs-weap" style="color:${r.c}">🔫 ${escapeHTML(r.weapon)}</div>
    <div class="rs-meta"><span class="rs-price">🪙${fmtNum(r.price)}</span>${soldBadge(r.id)}</div>
    ${have?`<button class="rs-buy own" disabled>🤖 มีหุ่นนี้แล้ว</button>`:`<button class="rs-buy" data-id="${r.id}">🛒 ซื้อหุ่นนี้</button>`}`;
  const buy = info.querySelector('.rs-buy:not(.own)');
  if(buy) buy.addEventListener('click', ()=>buyRobot(buy.dataset.id));
  document.querySelectorAll('.rs-thumb').forEach(t=>t.classList.toggle('active', +t.dataset.i===i));
}
/* เรียกหลัง render market — ผูกคลิก thumb + เริ่มวนโชว์ */
function rsInit(){
  const room = document.querySelector('.rs-showroom'); if(!room) return;
  if(rsIdx >= ROBOTS.length) rsIdx = 0;
  rsShowBig(rsIdx);
  room.querySelectorAll('.rs-thumb').forEach(b=>b.addEventListener('click', ()=>{
    rsIdx = +b.dataset.i; rsPausedUntil = Date.now() + RS_PAUSE_MS;
    if(typeof sfx!=='undefined' && sfx.select) sfx.select();
    rsShowBig(rsIdx);
  }));
  clearInterval(rsTimer);
  rsTimer = setInterval(()=>{
    const big = document.getElementById('rs-big');
    if(!big){ clearInterval(rsTimer); rsTimer = null; return; }   // ตลาด re-render/ปิด → หยุด
    if(!big.offsetParent) return;                                  // จอซ่อนอยู่ = ไม่วน
    if(Date.now() < rsPausedUntil) return;                         // เพิ่งแตะดู (ภายใน 2 นาที)
    rsIdx = (rsIdx + 1) % ROBOTS.length;
    rsShowBig(rsIdx);
  }, RS_CYCLE_MS);
}
function buyRobot(id){
  const r = ROBOTS.find(x=>x.id===id);
  if(!r || (state.robots||[]).includes(id)) return;
  if(state.coins < r.price){ sfx.wrong(); toast(`หุ่น ${r.name} 🪙${fmtNum(r.price)} — เหรียญยังไม่พอ สู้ๆ!`); return; }
  askConfirm(`<h2>🤖 ซื้อหุ่นยนต์ ${r.name}</h2>
    <p style="font-size:15px;margin:6px 0">ราคา <b>🪙${fmtNum(r.price)}</b> · อาวุธ: <b>${r.weapon}</b><br>
    <small>บังคับเดินหน้า-ถอยเหมือนหุ่นเดิน · เข้าโลกหุ่นยนต์ยิงเอเลี่ยนตัวอักษร คำละ 🪙35<br>
    ซื้อกี่ตัวก็ได้ · นับเป็นทรัพย์สินในแรงค์</small></p>`,
    'ซื้อเลย! 🤖', ()=>{
      state.coins -= r.price;
      state.robots = state.robots || [];
      state.robots.push(id);
      if(!state.mechaRobot) state.mechaRobot = id;
      if(typeof sellInc==='function') sellInc(r.id);      // 🛒 นับยอดขาย
      sfx.buy();
      // 🧹 รอบ 941: ป้ายเตือน "ยังไม่มีหุ่นยนต์" เป็นแบบค้างจนกดปิด — ซื้อแล้วต้องหายเอง (ผู้ใช้เจอป้ายเก่าลอยทับทั้งที่มีหุ่นแล้ว)
      if(typeof clearWarnToasts==='function') clearWarnToasts(/หุ่นยนต์/);
      toast(`🤖 ได้หุ่น ${r.name} แล้ว! เข้าโลกหุ่นยนต์นักรบได้เลย 💥`,0);
      saveState();
      renderDashboard();
    });
}

/* เลือกหุ่นก่อนเข้าโลก (ถ้ามีหลายตัว) แล้วเข้าโลก mecha
   🔓 รอบ 943: ไม่มีหุ่นของตัวเอง = ระบบให้ยืมหุ่นตัวแรก (robot_01) ฟรีสำหรับรอบนั้น — ไม่บันทึกเป็นทรัพย์สิน */
async function enterMecha3D(){
  if(state.advHurt) return worldEntryStopped('สิทธิ์เข้าเกมยังไม่พร้อม');
  if(advLoading){ advBusyMsg(enterMecha3D); return worldEntryStopped('มีเกมอื่นกำลังโหลดอยู่'); }
  let chosen;
  if(state.robots && state.robots.length){
    chosen = await pickMechaRobot();
    if(!chosen) return worldEntryStopped('ยกเลิกการเลือกหุ่นก่อนเกมเริ่ม');
  }else{
    chosen = ROBOTS[0].id;
    toast(`🤖 รอบนี้ยืมหุ่น ${ROBOTS[0].name} ของระบบออกรบฟรี — ซื้อหุ่นของตัวเองได้ที่ตลาดนะ`);
  }
  state.mechaRobot = chosen; saveState();
  if(!window.Adventure3D){
    advLoading = Date.now();
    toast('🤖 กำลังบูตระบบหุ่นยนต์...');
    try{
      await loadScriptOnce('js/vendor/three.min.js');
      await loadAdv3d();
    }catch(e){
      advLoading = false;
      return worldEntryStopped('โหลดไฟล์โลกหุ่นยนต์ไม่สำเร็จ อาจเกิดจากเน็ตหรือหน่วยความจำเครื่อง', e);
    }
    advLoading = false;
  }
  Adventure3D.start('mecha');
  return worldEntryStarted();
}
/* หน้าต่างเลือกหุ่น (เฉพาะตัวที่ครอบครอง) — คืน id หรือ null ถ้ายกเลิก */
function pickMechaRobot(){
  return new Promise(res=>{
    const owned = (state.robots||[]).map(id=>ROBOTS.find(r=>r.id===id)).filter(Boolean);
    if(owned.length<=1){ res(owned[0]?owned[0].id:null); return; }
    let sel = state.mechaRobot && owned.some(r=>r.id===state.mechaRobot) ? state.mechaRobot : owned[0].id;
    const ov = document.createElement('div');
    ov.className = 'levelup-overlay';
    ov.innerHTML = `<div class="levelup-box" style="max-width:560px">
      <h2>🤖 เลือกหุ่นออกรบ</h2>
      <div class="hq-grid car-grid" id="rp-grid">${owned.map(r=>{
        const img = robotImg(r.id);
        return `<div class="hq-card rp-it${r.id===sel?' hq-cur':''}" data-id="${r.id}" style="border-color:${r.c};cursor:pointer">
          <div class="hq-head">${r.name}</div>
          <div class="hq-pic">${img?`<img src="${img}" alt="">`:`<span class="car-emoji" style="background:${r.c}33;border-color:${r.c}">🤖</span>`}</div>
          <div class="robot-weap" style="color:${r.c}">🔫 ${r.weapon}</div></div>`;
      }).join('')}</div>
      <div class="cb-btns"><button class="cb-x">ยังก่อน</button><button class="cf-ok" id="rp-go">ออกรบ! 💥</button></div>
    </div>`;
    ov.querySelectorAll('.rp-it').forEach(el=>el.addEventListener('click',()=>{
      sel = el.dataset.id; sfx.select();
      ov.querySelectorAll('.rp-it').forEach(e2=>e2.classList.toggle('hq-cur', e2===el));
    }));
    ov.querySelector('.cb-x').addEventListener('click',()=>{ ov.remove(); res(null); });
    ov.querySelector('#rp-go').addEventListener('click',()=>{ ov.remove(); res(sel); });
    document.body.appendChild(ov);
  });
}

/* 🚗 รอบ 233: หน้าเลือกรถออกขับ (เฉพาะคันที่ครอบครอง) — เหมือน "เลือกหุ่นออกรบ"
   เลือกคันไหน → ตั้ง state.carIdx = คันนั้น → myCar() คืนคันนั้น → สมรรถนะ (drivePerf) + ภายในรถ (loadCarDash)
   ตอน start('drive') สอดคล้องกับคันที่เลือกเอง · คืน true เมื่อพร้อมขับ, false ถ้ายกเลิก
   คันที่ค้างค่างวด (loan.carry>0) โชว์ป้าย "ค้างงวด" เลือกไม่ได้ */
function pickDriveCar(){
  return new Promise(res=>{
    const cars = state.cars || [];
    if(cars.length <= 1){ res(true); return; }   // มีคันเดียว/ไม่มี = ไม่ต้องเลือก ขับคันเดิม
    const locked = i => { const L = cars[i] && cars[i].loan; return !!(L && (L.carry||0) > 0); };
    // ตั้งค่าเริ่มต้น = คันที่ขับล่าสุดถ้าขับได้ ไม่งั้นคันแรกที่ไม่ค้างงวด
    let sel = (state.carIdx>=0 && state.carIdx<cars.length && !locked(state.carIdx)) ? state.carIdx : cars.findIndex((_,i)=>!locked(i));
    if(sel < 0) sel = 0;   // ทุกคันค้างงวด — ปล่อยให้ carDriveBlock จัดการทีหลัง
    const cardHtml = (car, i)=>{
      const c = carInfo(car.id); if(!c) return '';
      const img = carImg(c.id), lk = locked(i);
      return `<div class="dcp-card${i===sel?' sel':''}${lk?' dcp-locked':''}" data-i="${i}" style="--cc:${c.c}">
        <div class="hq-head">${c.name}</div>
        <div class="hq-pic">${img?`<img src="${img}" alt="">`:`<span class="car-emoji" style="background:${c.c}33;border-color:${c.c}">🚗</span>`}</div>
        ${carStatHtml(c)}
        ${lk?'<div class="dcp-lock">🔐 ค้างงวด</div>':''}
      </div>`;
    };
    // 📐 รอบ 259: กล่องเกือบเต็มจอ ไม่มี scrollbar — คำนวณแถว/คอลัมน์ให้พอดีจำนวนคัน (≤5 = แถวเดียว · 6-10 = 2 แถว)
    const rows = cars.length > 5 ? 2 : 1, cols = Math.ceil(cars.length/rows);
    const ov = document.createElement('div');
    ov.className = 'levelup-overlay';
    ov.innerHTML = `<div class="levelup-box dcp-box" style="--dcp-cols:${cols};--dcp-rows:${rows}">
      <h2>🚗 เลือกรถออกขับ</h2>
      <div class="dcp-grid" id="dcp-grid">${cars.map((car,i)=>cardHtml(car,i)).join('')}</div>
      <div class="cb-btns"><button class="cb-x">ยังก่อน</button><button class="cf-ok" id="dcp-go">ออกขับ! 🚗</button></div>
    </div>`;
    ov.querySelectorAll('.dcp-card').forEach(el=>el.addEventListener('click',()=>{
      const i = +el.dataset.i;
      if(locked(i)){ sfx.wrong(); toast('🔐 คันนี้ค้างค่างวด ขับไม่ได้ — จ่ายงวดที่หมวดยานพาหนะก่อนนะ'); return; }
      sel = i; sfx.select();
      ov.querySelectorAll('.dcp-card').forEach(e2=>e2.classList.toggle('sel', e2===el));
    }));
    ov.querySelector('.cb-x').addEventListener('click',()=>{ ov.remove(); res(false); });
    ov.querySelector('#dcp-go').addEventListener('click',()=>{
      state.carIdx = sel; saveState();
      ov.remove(); res(true);
    });
    document.body.appendChild(ov);
  });
}

/* กล่องซื้อรถ — แจ้งชัด 3 รายการ: ราคารถ · พ.ร.บ. (บังคับ) · ประกัน (ทางเลือก) + เลือกจ่ายสด/ผ่อน */
function openCarBuyDialog(id){
  const c = carInfo(id);
  if(!c || (state.cars||[]).some(car=>car.id===id)) return;   // 🚗 รอบ 211: ซื้อได้หลายคัน (บล็อกเฉพาะคันที่มีแล้ว)
  sfx.select();
  let ins = false, plan = 'cash';
  const down = Math.ceil(c.price*CAR_DOWN_RATE);
  const perMonth = Math.ceil((c.price-down)/CAR_LOAN_MONTHS);
  const img = carImg(id);
  const overlay = document.createElement('div');
  overlay.className = 'levelup-overlay';
  overlay.innerHTML = `<div class="levelup-box car-buy-box">
    <h2>🚗 ซื้อรถ ${c.name}</h2>
    <div class="cb-pic">${img?`<img src="${img}" alt="">`:`<span class="car-emoji" style="background:${c.c}33;border-color:${c.c}">🚗</span>`}</div>
    <div class="cb-lines">
      <div class="cb-li"><span>🚗 ราคารถ</span><b>🪙${fmtNum(c.price)}</b></div>
      <div class="cb-li"><span>📋 พ.ร.บ. <small>(บังคับตามกฎหมาย)</small></span><b>🪙${fmtNum(CAR_PRB)}</b></div>
      <div class="cb-li cb-ins" id="cb-ins"><span>🛡️ ประกันภัย <small>(ทางเลือก — ชนรถผู้เล่นอื่น ประกันจ่ายให้)</small></span>
        <b>🪙${fmtNum(CAR_INSURANCE)}</b><button id="cb-ins-tg">➕ เอาด้วย</button></div>
    </div>
    <div class="cb-plan">
      <button class="cb-pl sel" data-p="cash">💵 จ่ายสด</button>
      <button class="cb-pl" data-p="loan">📅 ผ่อน ${CAR_LOAN_MONTHS} เดือน<small>ดาวน์ ${Math.round(CAR_DOWN_RATE*100)}% · ค้างงวด=ขับไม่ได้ชั่วคราว</small></button>
    </div>
    <div class="cb-total" id="cb-total"></div>
    <div class="cb-btns"><button class="cb-x">ยังก่อน</button><button class="cf-ok" id="cb-buy">ซื้อเลย! 🚗</button></div>
  </div>`;
  const todayCost = ()=>(plan==='cash'?c.price:down) + CAR_PRB + (ins?CAR_INSURANCE:0);
  const refresh = ()=>{
    const t = todayCost();
    overlay.querySelector('#cb-ins-tg').textContent = ins ? '✅ เอาด้วย' : '➕ เอาด้วย';
    overlay.querySelector('#cb-ins').classList.toggle('on', ins);
    overlay.querySelectorAll('.cb-pl').forEach(b=>b.classList.toggle('sel', b.dataset.p===plan));
    overlay.querySelector('#cb-total').innerHTML = plan==='cash'
      ? `จ่ายวันนี้ทั้งหมด <b>🪙${fmtNum(t)}</b>`
      : `จ่ายวันนี้ (ดาวน์+พ.ร.บ.${ins?'+ประกัน':''}) <b>🪙${fmtNum(t)}</b><br><small>แล้วผ่อนเดือนละ <b>🪙${fmtNum(perMonth)}</b> × ${CAR_LOAN_MONTHS} เดือน — มีเงินเมื่อไหร่กด "โปะปิดยอด" ได้ทุกเมื่อ</small>`;
    overlay.querySelector('#cb-buy').classList.toggle('cant-afford', state.coins < t);
  };
  overlay.querySelector('#cb-ins-tg').addEventListener('click', ()=>{ ins = !ins; sfx.select(); refresh(); });
  overlay.querySelectorAll('.cb-pl').forEach(b=>b.addEventListener('click', ()=>{ plan = b.dataset.p; sfx.select(); refresh(); }));
  overlay.querySelector('.cb-x').addEventListener('click', ()=>{ overlay.remove(); });
  overlay.querySelector('#cb-buy').addEventListener('click', ()=>{
    const t = todayCost();
    if(state.coins < t){ sfx.wrong(); toast(`เหรียญยังไม่พอ — วันนี้ต้องจ่าย 🪙${fmtNum(t)} สู้ๆ!`); return; }
    state.coins -= t;
    state.cars = state.cars || [];
    state.cars.push({id, insured:ins,
      loan: plan==='cash' ? null : {remain:c.price-down, perMonth, month:ymStr(Date.now()), paid:0, carry:0}});
    state.carIdx = state.cars.length - 1;                 // 🚗 คันใหม่ = คันที่ขับทันที
    if(typeof sellInc==='function') sellInc(id);          // 🛒 นับยอดขายรถ
    sfx.buy();
    toast(plan==='cash'
      ? `🚗 ได้รถ ${c.name} แล้ว! กดปุ่มขับรถออกเมืองได้เลย 🕰️`
      : `🚗 ออกรถ ${c.name} แบบผ่อนแล้ว! จ่ายงวดทุกเดือนที่หมวดยานพาหนะนะ 📅`);
    saveState();
    overlay.remove();
    renderDashboard();
  });
  refresh();
  document.body.appendChild(overlay);
}

function buyCarInsurance(){
  const car = myCar();
  if(!car || car.insured) return;
  if(state.coins < CAR_INSURANCE){ sfx.wrong(); toast(`ประกันภัยรถ 🪙${fmtNum(CAR_INSURANCE)} — เหรียญยังไม่พอ สู้ๆ!`); return; }
  askConfirm(`<h2>🛡️ ซื้อประกันภัยรถ</h2>
    <p style="font-size:15px;margin:6px 0">ราคา <b>🪙${fmtNum(CAR_INSURANCE)}</b> (จ่ายครั้งเดียว)<br>
    ชนรถผู้เล่นอื่นเมื่อไหร่ ประกันจ่ายค่าเสียหาย 🪙${fmtNum(CAR_HITCAR_FEE)} ให้ทุกครั้ง<br>
    <small>ไม่มีประกัน = จ่ายเองเต็มๆ ตอนออกจากโลกขับรถ</small></p>`,
    'ซื้อเลย! 🛡️', ()=>{
      const car2 = myCar(); if(!car2) return;
      state.coins -= CAR_INSURANCE;
      car2.insured = true;
      sfx.buy();
      toast('🛡️ มีประกันแล้ว! ชนรถเพื่อนเมื่อไหร่ประกันจ่ายให้');
      saveState();
      renderDashboard();
    });
}

function payCarLoanMonthly(){
  const amt = carLoanPayable();
  if(!amt) return;
  if(state.coins < amt){ sfx.wrong(); toast(`งวดนี้ต้องจ่าย 🪙${fmtNum(amt)} — เหรียญยังไม่พอ สู้ๆ!`); return; }
  state.coins -= amt;
  const done = carLoanPay(amt);
  sfx.buy();
  toast(done ? '🎉 ผ่อนครบแล้ว! รถเป็นของหนูเต็มตัว' : '📅 จ่ายงวดเรียบร้อย — ขับรถได้ตามปกติ');
  saveState();
  renderDashboard();
}

function payCarLoanFull(){
  const car = myCar();
  const L = car && car.loan;
  if(!L) return;
  if(state.coins < L.remain){ sfx.wrong(); toast(`โปะปิดยอดต้องใช้ 🪙${fmtNum(L.remain)} — เหรียญยังไม่พอ`); return; }
  askConfirm(`<h2>💰 โปะปิดยอดผ่อนรถ</h2>
    <p style="font-size:15px;margin:6px 0">จ่ายยอดที่เหลือทั้งหมด <b>🪙${fmtNum(L.remain)}</b> ครั้งเดียวจบ<br>
    <small>ปิดยอดแล้วไม่มีงวดรายเดือนอีก — รถเป็นของหนูเต็มตัว!</small></p>`,
    'โปะเลย! 💰', ()=>{
      state.coins -= L.remain;
      carLoanPay(L.remain);
      sfx.buy();
      toast('🎉 ปิดยอดแล้ว! รถเป็นของหนูเต็มตัว');
      saveState();
      renderDashboard();
    });
}

/* 🔐 ด่านกันขับ: มีตั๋วแต่ยังไม่มีรถ / ค้างค่างวด — คืน '' เมื่อขับได้ */
function carDriveBlock(){
  if(!myCar()) return 'nocar';                 // 🚗 รอบ 211: เช็กคันที่ขับอยู่
  if(carLoanOverdue() > 0) return 'overdue';   // คันที่ขับค้างงวด = ขับไม่ได้ (สลับไปคันอื่นได้)
  return '';
}
function gotoVehicleShop(){
  if(typeof openPanel === 'function') openPanel('panel-market');
  setTimeout(()=>{ const s = document.getElementById('mkt-vehicles'); if(s) s.scrollIntoView({behavior:'smooth', block:'start'}); }, 150);
}
/* 🏭→📦 พาผู้เล่นจากฉากฉลอง "ผลิตสำเร็จ" ไปเปิดคลังสินค้า (ท้ายแผงตลาด) เพื่อให้เจอของที่เพิ่งผลิต */
function gotoMyStock(){
  showScreen('screen-dashboard');                               // ออกจากหน้าเกม/ผลสอบกลับล็อบบี้ก่อน (showScreen จะ closePanel ให้)
  if(typeof renderDashboard === 'function') renderDashboard();  // รีเฟรชแผงตลาด — ชิ้นที่เพิ่งเข้าคลังจึงโผล่
  if(typeof openPanel === 'function') openPanel('panel-market');
  setTimeout(()=>{ const s = document.getElementById('mkt-mystock'); if(s) s.scrollIntoView({behavior:'smooth', block:'start'}); }, 180);
}
function showNeedCarDialog(why){
  askConfirm(why==='overdue'
    ? `<div style="font-size:56px;line-height:1">🔐</div>
       <h2>ค้างค่างวดรถ</h2>
       <p style="font-size:15px;margin:6px 0">ขับรถไม่ได้ชั่วคราว — จ่ายงวดที่ค้าง <b>🪙${fmtNum(carLoanOverdue())}</b> ที่หมวดยานพาหนะ แล้วกลับมาขับได้ทันที</p>`
    : `<div style="font-size:56px;line-height:1">🔐</div>
       <h2>ต้องซื้อรถก่อน จึงจะขับรถได้</h2>
       <p style="font-size:15px;margin:6px 0">ตั๋ว = สิทธิ์เข้าเมืองกำแพงเพชร · <b>รถ = พาหนะ</b> ต้องมีก่อนออกถนน<br>ไปเลือกรถคันแรกที่หมวดยานพาหนะในตลาดกันเลย!</p>`,
    '🏪 ไปหมวดยานพาหนะ', gotoVehicleShop);
}

/* 🎟️ ส่วนลดโรงงานจากแต้มคำศัพท์ (16 ก.ค. 2026): 1 แต้ม = ลด 🪙1 · ลดได้สูงสุดครึ่งราคาต่อชิ้น · ใช้แล้วแต้มหมดไป */
function craftDiscount(price){ return Math.min(state.wordCredit||0, Math.floor(price/2)); }

/* ---- มุมมอง "โรงงานผลิต": งานที่กำลังผลิต + แคตตาล็อกเลือกสินค้า ---- */
function renderFactory(){
  let jobUI;
  if(state.producing){
    const c = collectInfo(state.producing.id), tier = COLLECT_TIERS[c.tier], img = collectImg(c.id);
    const pct = Math.min(100, state.producing.progress/c.words*100);
    jobUI = `<div class="craft-box" style="border-color:${tier.color}">
      <div class="craft-head">
        <span class="mkt-emoji">${img?`<img src="${img}" alt="">`:c.emoji}</span>
        <div class="mkt-info"><b>กำลังผลิต: ${c.name}</b> <span class="mkt-tier-stars" style="color:${tier.color}">${tier.stars}</span><br>
          <small>ตอบคำศัพท์ถูกอีก <b>${fmtNum(c.words - state.producing.progress)}</b> คำ ผลิตเสร็จ! (ขายได้ ~🪙${fmtNum(c.price)})</small></div>
      </div>
      <div class="craft-bar"><div class="craft-fill" style="width:${pct}%;background:${tier.color}"></div></div>
      <div class="craft-text">🔤 แต้มผลิต ${fmtNum(state.producing.progress)}/${fmtNum(c.words)} (${Math.floor(pct)}%)</div>
      <div class="craft-btn-row">
        <button class="big-btn craft-go-btn" id="craft-go"><span class="cg-ic">🎮</span> ไปเล่นเกมเก็บแต้มผลิต</button>
        <button class="craft-cancel" id="craft-cancel">ยกเลิก</button>
      </div>
    </div>`;
  }else{
    jobUI = `<div class="home-current none">
      <span class="home-emoji">🏭</span>
      <div><b>โรงงานพร้อมส่งสินค้า</b><br>
        <small>มีเหรียญพอ กดซื้อจากแคตตาล็อกด้านล่างเข้าคลังได้ทันที · เหรียญไม่พอ กดปุ่ม 🎮 เล่นเกมคำศัพท์เก็บแต้มผลิตเองได้ฟรี!</small>
      </div>
    </div>`;
  }
  const opts = `<option value="all">📦 ทุกหมวดสินค้า (${COLLECTIBLES.length} ชนิด)</option>` +
    COLLECT_CATS.map(g=>`<option value="${g.id}" ${factoryCat===g.id?'selected':''}>${g.emoji} หมวด${g.name}</option>`).join('');
  /* รอบ 292: เลิกแบ่งหน้า 5 ชิ้น → แถบปัดแนวนอนต่อเนื่องสไตล์ SimCity BuildIt (เหมือนสวน/เล็งของ) */
  const items = COLLECTIBLES.filter(c=>factoryCat==='all' || c.cat===factoryCat);
  /* การ์ดสินค้าสไตล์ Trade HQ: หัวการ์ดชื่อสินค้า + ภาพใหญ่ + badge แต้มคำ + แถบราคาทองเป็นปุ่ม */
  const rows = items.map(c=>{
    const tier = COLLECT_TIERS[c.tier], img = collectImg(c.id);
    const cur = state.producing && state.producing.id === c.id;
    /* เหรียญพอ = ซื้อเข้าคลังทันที (หักส่วนลด 🎟️ อัตโนมัติ) · เหรียญไม่พอค่อยโชว์ปุ่มไปเล่นเกมเก็บแต้มผลิต (ผู้ใช้สั่ง 16 ก.ค. 2026) */
    const disc = craftDiscount(c.price), pay = c.price - disc;
    const btn = cur
      ? `<button class="hq-price craft-make" data-id="${c.id}">⏳ กำลังผลิตอยู่...</button>`
      : state.coins >= pay
        ? `<button class="hq-price craft-buy" data-id="${c.id}">${disc>0?`<small><s>🪙${fmtNum(c.price)}</s> ลด 🎟️${fmtNum(disc)}</small>`:''}🪙${fmtNum(pay)} ซื้อเลย</button>`
        : `<button class="hq-price hq-play craft-make" data-id="${c.id}"><small>เหรียญไม่พอ (🪙${fmtNum(pay)})</small>🎮 ไปเล่นเกมเก็บแต้มผลิต</button>`;
    return `<div class="hq-card ${cur?'hq-cur':''}" style="border-color:${tier.color}">
      <div class="hq-head">${c.name}</div>
      <div class="hq-pic">
        ${img ? lazyAssetHTML(img, c.name) : `<span class="hq-emoji">${c.emoji}</span>`}
        <span class="hq-badge">🔤 ${fmtNum(c.words)}</span>
        <span class="hq-stars" style="color:${tier.color}">${tier.stars}</span>
      </div>
      ${btn}
    </div>`;
  }).join('');
  const creditChip = `<div class="craft-credit">🎟️ แต้มส่วนลด <b>${fmtNum(state.wordCredit||0)}</b> แต้ม
    <small>ตอบคำศัพท์ถูก 1 คำ = 1 แต้ม (สะสมจากทุกเกม) · ใช้เป็นส่วนลด 1 แต้ม = 🪙1 ลดได้สูงสุดครึ่งราคา</small></div>`;
  /* .fc-cols: จอปกติซ้อนเป็นชั้น · จอเตี้ยแบ่ง 2 คอลัมน์ ซ้าย=สถานะ+เครื่องมือ ขวา=แคตตาล็อก (กฎ 7)
     รอบ 614 (เต็มจอ): CSS พลิก .fc-cols เป็นแนวตั้ง → fc-left = แถบเครื่องมือบน · fc-right = แคตตาล็อกเต็มความกว้าง 2×8 */
  const catName = factoryCat==='all' ? 'ทุกหมวด' : ((COLLECT_CATS.find(g=>g.id===factoryCat)||{}).name || '');
  const catHead = `<div class="fc-cat-head">
      <span class="fc-cat-title">📦 แคตตาล็อกสินค้า</span>
      <span class="fc-cat-chip">${escapeHTML(catName)} · ${fmtNum(items.length)} ชนิด</span>
      <span class="fc-cat-hint">ปัดแถบ หรือกดลูกศร ❮ ❯ เพื่อดูสินค้าถัดไป</span>
    </div>`;
  return `<div class="fc-cols"><div class="fc-left">${jobUI}
      <div class="craft-toolbar">${creditChip}<select class="mkt-filter" id="factory-cat">${opts}</select></div></div>
    <div class="fc-right">${catHead}<div class="strip-wrap"><button class="strip-arrow sa-l" aria-label="เลื่อนซ้าย">❮</button>
      <div class="strip-x grid2x8" id="factory-list">${rows}</div>
      <button class="strip-arrow sa-r" aria-label="เลื่อนขวา">❯</button></div></div></div>`;
}

/* ---- ออเดอร์พิเศษ: ลูกค้าจำลองสั่งผลิตเจาะจง จ่ายแพงกว่าราคาฐาน 30–80% ---- */
function renderOrdersUI(){
  if(!state.orders.length) return '';
  const now = Date.now();
  const rows = state.orders.map((o,i)=>{
    const c = collectInfo(o.id), img = collectImg(o.id);
    const have = state.collection.includes(o.id);
    const bonus = Math.round((o.payout/c.price - 1)*100);
    return `<div class="order-row">
      <span class="mkt-emoji">${img?`<img src="${img}" alt="">`:c.emoji}</span>
      <div class="mkt-info"><b>${c.name}</b> <span class="mkt-price-lo">+${bonus}% 💰</span><br>
        <small>👤 ${o.buyer} สั่งผลิต · ⏳ เหลือ <span id="order-left-${i}">${fmtMins(Math.max(0, o.expireAt - now))}</span></small></div>
      ${have
        ? `<button class="order-deliver" data-i="${i}">📦 ส่งมอบ<br>🪙${fmtNum(o.payout)}</button>`
        : `<span class="order-need">🪙${fmtNum(o.payout)}<br><small>ยังไม่มีของ</small></span>`}
    </div>`;
  }).join('');
  return `<div class="order-head">📦 ออเดอร์พิเศษ — ลูกค้าจ่ายแพงกว่าราคาตลาด!</div>${rows}`;
}

function startProduce(id, goGame){
  const c = collectInfo(id);
  if(!c) return;
  if(state.producing && state.producing.id === id){
    sfx.select();
    if(goGame){ startGame(null); return; }   // กดปุ่มการ์ดตัวที่ผลิตอยู่ = พาเข้าเกมเก็บแต้มเลย
    toast(`🏭 กำลังผลิต${c.name}อยู่แล้ว — ไปเล่นเกมเก็บแต้มกันเถอะ!`); return;
  }
  const doStart = ()=>{
    state.producing = {id, progress:0};
    sfx.buy();
    toast(`🏭 เริ่มผลิต${c.name}! ตอบคำศัพท์ถูกให้ครบ ${fmtNum(c.words)} คำนะ`);
    saveState();
    renderFactoryCard();
    if(goGame) startGame(null);              // เหรียญไม่พอ → เริ่มผลิตแล้วพาไปเล่นเกมเก็บแต้มทันที
  };
  if(state.producing && state.producing.progress > 0){
    const oc = collectInfo(state.producing.id);
    askConfirm(`<h2>🏭 เปลี่ยนสินค้าที่ผลิต?</h2>
      <p style="font-size:15px;margin:6px 0">ตอนนี้กำลังผลิต${oc.name} (${fmtNum(state.producing.progress)}/${fmtNum(oc.words)} แต้ม)<br>
      ถ้าเปลี่ยนไปผลิต${c.name} <b>แต้มเดิมจะหายนะ</b></p>`, 'เปลี่ยนเลย', doStart);
  }else{
    doStart();
  }
}

/* ซื้อสินค้าโรงงานด้วยเหรียญทันที (ผู้ใช้สั่ง 16 ก.ค. 2026) — จ่ายราคาฐานเข้าคลังเลย
   ไม่นับ producedCount/เควสต์ผลิต (นั่นสงวนให้การผลิตด้วยแต้มคำศัพท์จริง) */
function buyCollectible(id){
  const c = collectInfo(id);
  if(!c) return;
  /* 🚫 รอบ 952: ของสะสมหมวดอาหาร 🍰🍩🧋 ก็คือ "ของกิน" — ป่วยเพราะหิวอยู่ซื้อไม่ได้ ต้องรักษาก่อน */
  if(c.cat === 'food' && hungerSickLock()){ sfx.wrong(); toast(hungerSickMsg(c.name)); return; }
  const disc = craftDiscount(c.price), pay = c.price - disc;
  if(state.coins < pay){
    sfx.wrong(); toast(`เหรียญไม่พอ — ${c.name} ราคา 🪙${fmtNum(pay)} เล่นเกมเก็บแต้มผลิตเองได้ฟรีนะ!`);
    renderFactoryCard();   // เหรียญเพิ่งลด → สลับปุ่มการ์ดเป็นโหมดไปเล่นเกมให้ตรงสถานะ
    return;
  }
  askConfirm(`<h2>🏭 ซื้อ${c.name}?</h2>
    <p style="font-size:15px;margin:6px 0">${disc>0
      ? `ราคา <s>🪙${fmtNum(c.price)}</s> − ส่วนลดแต้มคำศัพท์ 🎟️${fmtNum(disc)}<br>จ่ายจริง <b>🪙${fmtNum(pay)}</b> รับ${c.name}เข้าคลังทันที`
      : `จ่าย <b>🪙${fmtNum(c.price)}</b> รับ${c.name}เข้าคลังทันที`}<br>
    <small>เอาไปตั้งขายในตลาด หรือส่งมอบออเดอร์พิเศษได้เลย</small></p>`,
    'ซื้อเลย', ()=>{
      const d2 = craftDiscount(c.price), p2 = c.price - d2;   // คิดใหม่ตอนยืนยัน กันค่าเปลี่ยนระหว่างเปิดกล่อง
      if(state.coins < p2){ sfx.wrong(); toast('เหรียญไม่พอแล้ว'); return; }
      state.coins -= p2;
      if(d2 > 0) state.wordCredit = (state.wordCredit||0) - d2;
      state.collection.push(c.id);
      if(typeof feedEvent === 'function') feedEvent('goods', `ซื้อ ${c.emoji||''} ${c.name} จากโรงงาน 🏭`);
      saveState();
      renderDashboard();
      showCollectReveal(c.id, p2, false);
      if(d2 > 0) toast(`🎟️ ใช้แต้มส่วนลดไป ${fmtNum(d2)} แต้ม เหลือ ${fmtNum(state.wordCredit)} แต้ม`);
    });
}

function cancelProduce(){
  if(!state.producing) return;
  const c = collectInfo(state.producing.id);
  askConfirm(`<h2>ยกเลิกการผลิต?</h2>
    <p style="font-size:15px;margin:6px 0">แต้มผลิต${c ? c.name : ''}ที่สะสมไว้ (${fmtNum(state.producing.progress)} แต้ม) จะหายไปนะ</p>`,
    'ยกเลิกการผลิต', ()=>{
      state.producing = null;
      sfx.select();
      toast('ยกเลิกการผลิตแล้ว — เลือกสินค้าใหม่ได้เลย');
      saveState();
      renderFactoryCard();
    });
}

function deliverOrder(i){
  const o = state.orders[i];
  if(!o) return;
  const c = collectInfo(o.id);
  const idx = state.collection.indexOf(o.id);
  if(idx < 0){ sfx.wrong(); toast(`ยังไม่มี${c.name}ในคลัง — ผลิตให้เสร็จก่อนนะ`); return; }
  state.collection.splice(idx, 1);
  state.orders.splice(i, 1);
  addCoins(o.payout);
  sfx.levelup();
  floatFx(`+🪙${fmtNum(o.payout)}`);
  toast(`📦 ส่งมอบ${c.name}ให้ ${o.buyer} เรียบร้อย! รับ 🪙${fmtNum(o.payout)} 🎉`);
  saveState();
  renderDashboard();
}

/* นาฬิกานับถอยหลังออเดอร์พิเศษ (เดินพร้อมนาฬิกา — หมดเวลาแล้ว careTick รอบถัดไปลบเอง) */
function renderOrderClock(){
  if(!state.orders || !state.orders.length) return;
  const now = Date.now();
  state.orders.forEach((o,i)=>{
    const el = document.getElementById('order-left-'+i);
    if(el) el.textContent = fmtMins(Math.max(0, o.expireAt - now));
  });
}

/* ---- มุมมอง "คลังของฉัน": ของสะสม (ตั้งขายได้) + รายการที่กำลังลงขาย ---- */
function renderCollectMine(){
  const counts = {};
  for(const id of state.collection) counts[id] = (counts[id]||0) + 1;
  const ids = COLLECTIBLES.map(c=>c.id).filter(id=>counts[id]);
  let ownedUI;
  if(ids.length){
    /* การ์ดสินค้าสไตล์ Trade HQ เหมือนแคตตาล็อกโรงงาน — รอบ 292: แถบปัดแนวนอน · รอบ 616: 2 แถว × 8 คอลัมน์ */
    ownedUI = `<div class="strip-wrap mine-strip"><button class="strip-arrow sa-l" aria-label="เลื่อนซ้าย">❮</button><div class="strip-x grid2x8">` + ids.map(id=>{
      const c = collectInfo(id), tier = COLLECT_TIERS[c.tier], img = collectImg(id);
      return `<div class="hq-card" style="border-color:${tier.color}">
        <div class="hq-head">${c.name}</div>
        <div class="hq-pic">
          ${img ? lazyAssetHTML(img, c.name) : `<span class="hq-emoji">${c.emoji}</span>`}
          <span class="hq-badge">×${counts[id]}</span>
          <span class="hq-stars" style="color:${tier.color}">${tier.stars}</span>
        </div>
        <button class="hq-price cc-list-btn" data-id="${id}">🏷️ ตั้งราคาขาย</button>
      </div>`;
    }).join('') + `</div><button class="strip-arrow sa-r" aria-label="เลื่อนขวา">❯</button></div>`;
  }else{
    ownedUI = `<div class="mkt-empty">คลังยังว่างอยู่ — ไปผลิตสินค้าชิ้นแรกที่เมนู <b>🏭 โรงงาน</b> กันเถอะ!<br>ผลิตเสร็จเอามาตั้งขาย หรือส่งมอบออเดอร์พิเศษได้เงินเพิ่ม 💰</div>`;
  }
  let listUI = '';
  if(state.listings.length){
    listUI = `<div class="mkt-listhead">🏷️ กำลังลงขายอยู่ (${state.listings.length} ชิ้น)</div>` +
      state.listings.map((l,i)=>{
        const c = collectInfo(l.id), img = collectImg(l.id);
        const netState = l.netKey && typeof Online !== 'undefined' && Online.marketListingStatus
          ? Online.marketListingStatus[l.netKey] : '';
        const st = !l.netKey ? listingStatus(l.price / c.price)
          : netState === 'online'
            ? {t:'🌏 แขวนอยู่ในตลาดผู้เล่นทั้งหมด — ผู้เล่นอื่นซื้อเมื่อไหร่เงินเข้าทันที', c:'#1f6fbf'}
            : netState === 'sold'
              ? {t:'⏳ ขายสำเร็จแล้ว — กำลังนำเงินเข้ากระเป๋า', c:'#8a6d1a'}
              : (typeof Online !== 'undefined' && Online.marketOk)
                ? {t:'⏳ กำลังตรวจสอบสถานะการขาย…', c:'#8a6d1a'}
                : {t:'📡 ยังตรวจสอบสถานะตลาดไม่ได้', c:'#8a6d1a'};
        return `<div class="mkt-listing">
          <span class="mkt-emoji">${img?`<img src="${img}" alt="">`:c.emoji}</span>
          <div class="mkt-info"><b>${c.name}</b> · ตั้งขาย 🪙${fmtNum(l.price)}<br>
            <small style="color:${st.c}">${st.t}</small></div>
          <button class="ml-cancel" data-i="${i}">ยกเลิก</button>
        </div>`;
      }).join('');
  }
  return ownedUI + listUI;
}

/* กล่องตั้งราคาขายเอง (พิมพ์ราคา + โชว์สถานะราคาสด) */
function openListDialog(id){
  const c = collectInfo(id);
  if(!c || !state.collection.includes(id)) return;
  sfx.select();
  const img = collectImg(id);
  const overlay = document.createElement('div');
  overlay.className = 'levelup-overlay';
  overlay.innerHTML = `<div class="levelup-box list-dialog">
    <h2>🏷️ ตั้งราคาขาย</h2>
    <div class="ld-pic">${img?`<img src="${img}" alt="">`:`<span>${c.emoji}</span>`}</div>
    <div class="ld-name">${c.name}</div>
    <p class="ld-note">ราคาปกติของชิ้นนี้ 🪙${fmtNum(c.price)}<br>ตั้งถูกกว่าปกติ = ลูกค้าซื้อไว · ตั้งแพงเกินไป = ไม่มีคนซื้อ</p>
    <div class="ld-input">🪙 <input type="number" id="list-price" value="${c.price}" min="1" step="100"></div>
    <div class="list-hint" id="list-hint"></div>
    <div style="display:flex;gap:10px;justify-content:center;margin-top:14px">
      <button class="cf-no" style="background:#b8a8cc;box-shadow:0 4px 0 #96859f">ยกเลิก</button>
      <button class="cf-ok">🏷️ ลงขายเลย</button>
    </div>
  </div>`;
  const input = overlay.querySelector('#list-price');
  const hint = overlay.querySelector('#list-hint');
  const upd = ()=>{
    const v = +input.value;
    if(!v || v <= 0){ hint.textContent = 'ใส่ราคามากกว่า 0 นะ'; hint.style.color = '#c0392b'; return; }
    const st = listingStatus(v / c.price);
    hint.textContent = st.t; hint.style.color = st.c;
  };
  input.addEventListener('input', upd); upd();
  overlay.querySelector('.cf-no').addEventListener('click', ()=>overlay.remove());
  overlay.querySelector('.cf-ok').addEventListener('click', ()=>{
    const price = Math.round(+input.value);
    if(!price || price <= 0){ sfx.wrong(); toast('ใส่ราคาที่มากกว่า 0 นะ'); return; }
    const idx = state.collection.indexOf(id);
    if(idx < 0){ overlay.remove(); return; }
    state.collection.splice(idx, 1);
    overlay.remove();
    // 🏪 item 2: พยายามแขวนขึ้นตลาดออนไลน์จริงก่อน — ไม่ได้ (ออฟไลน์/rules ยังไม่เปิด) fallback ตลาดจำลองเดิม
    const fin = (netKey)=>{
      const l = {id, price, listedAt: Date.now()};
      if(netKey){
        l.netKey = netKey;
        if(typeof Online !== 'undefined' && Online.marketListingStatus) Online.marketListingStatus[netKey] = 'online';
      }
      state.listings.push(l);
      sfx.buy();
      toast(netKey ? `🌏 ลงขาย${c.name} 🪙${fmtNum(price)} ในตลาดผู้เล่นทั้งหมดแล้ว!`
                   : `🏷️ ลงขาย${c.name} 🪙${fmtNum(price)} แล้ว! รอลูกค้ามาซื้อได้เลย`);
      saveState();
      if(netKey && typeof authPushSave === 'function') authPushSave(true); // ให้เซิร์ฟเวอร์เห็นหลักฐานเจ้าของทันที
      renderDashboard();
    };
    if(typeof marketList === 'function') marketList(id, price).then(fin);
    else fin(null);
  });
  document.body.appendChild(overlay);
}

function cancelListing(i){
  const l = state.listings[i];
  if(!l) return;
  const c = collectInfo(l.id);
  const finish = ()=>{
    state.listings.splice(i, 1);
    state.collection.push(l.id);
    if(l.netKey && typeof Online !== 'undefined' && Online.marketListingStatus) delete Online.marketListingStatus[l.netKey];
    sfx.select();
    toast(`เก็บ${c ? c.name : 'สินค้า'}กลับเข้าคลังแล้ว`);
    saveState();
    renderDashboard();
  };
  if(!l.netKey || typeof marketUnlist !== 'function'){ finish(); return; }
  // 🏪 ประกาศจริง: ต้องถอนออกจาก DB ให้สำเร็จก่อนคืนของ (กันคนกำลังกดซื้อพอดี)
  marketUnlist(l.netKey).then(r=>{
    if(r === 'removed') finish();
    else if(r === 'gone') toast('🌏 มีเพื่อนซื้อชิ้นนี้ไปแล้ว — เดี๋ยวเงินเข้ากระเป๋าเองนะ');
    else { sfx.wrong(); toast('📡 ถอนไม่สำเร็จ ลองใหม่อีกครั้งนะ'); }
  });
}

/* 🏪 รอบ 1178: เซิร์ฟเวอร์บันทึก ledger + หัก/จ่าย/ส่งของก่อน แล้ว local ทำตาม tx เดียวกัน */
let mktBuying = false;                       // กันกดรัว/ซื้อซ้อนระหว่างรอ DB
function buyMarketItem(key){
  if(mktBuying) return Promise.resolve({ok:false, reason:'busy'});

  const item = (Online.market || []).find(m=>m.key === key);
  const me = (typeof onlineKey === 'function') ? onlineKey() : '';
  if(!item || typeof marketBuy !== 'function') return Promise.resolve({ok:false, reason:'missing'});
  if(!state || Number(state.coins) < 0 || !item || !item.id) return Promise.resolve({ok:false, reason:'missing'});

  const c = collectInfo(item.id);
  if(!c) return Promise.resolve({ok:false, reason:'invalid_item'});
  const price = Number(item.p) || 0;
  if(price <= 0) return Promise.resolve({ok:false, reason:'invalid_price'});
  if(item.sid === me){
    return Promise.resolve({ok:false, reason:'own_item'});
  }
  if(c.cat === 'food' && hungerSickLock()){
    sfx.wrong(); toast(hungerSickMsg(c.name)); return Promise.resolve({ok:false, reason:'food_lock'});
  }
  if(state.coins < price){
    sfx.wrong();
    toast(`เหรียญไม่พอ (ต้องมี 🪙${fmtNum(price)}) สู้ๆ!`);
    return Promise.resolve({ok:false, reason:'not_enough_coins'});
  }

  mktBuying = true;
  return marketBuy(item).then(out=>{
    if(!out || !out.ok){
      sfx.wrong();
      if(out && out.reason === 'invalid') toast('ของในตลาดเปลี่ยนไปก่อนซื้อ เห็นไม่ทันหนู — ลองปิดแล้วเปิดใหม่อีกครั้งนะ');
      else if(out && out.reason === 'sold_out') toast('😅 ช้าไปนิดเดียว — มีคนซื้อตัดหน้าไปแล้ว');
      else if(out && (out.reason === 'db_error' || out.reason === 'save_error' || out.reason === 'processing')) toast('😵 ระบบกำลังยืนยันรายการอย่างปลอดภัย — กรุณาลองใหม่อีกครั้งนะ');
      else if(out && out.reason === 'seller_not_ready') toast('⚠️ การขายสินค้านี้ไม่สำเร็จ กรุณาให้ผู้ขายลงขายใหม่');
      else toast('⚠️ ไม่สามารถซื้อได้ตอนนี้ ลองใหม่อีกครั้งได้เลย');
      renderMarketCard();
      return {ok:false, reason:(out && out.reason) || 'failed'};
    }
    const b = out.item || item;
    const finalPrice = Number(b.p);
    if(!b || !b.id || !Number.isFinite(finalPrice) || finalPrice <= 0) return {ok:false, reason:'invalid_item'};
    if(!marketTxHasRole(out.tx, 'buyer')){
      state.coins = Math.max(0, Number(state.coins) - finalPrice);
      state.collection.push(b.id);
      // 💖 ได้ของที่เล็งไว้แล้ว → ถอนออกจากลิสต์อัตโนมัติ (รอบ 126)
      const wi = (state.wishlist || []).indexOf(item.id);
      if(wi >= 0) state.wishlist.splice(wi, 1);
      marketRememberTx(out.tx, 'buyer', {id:b.id, p:finalPrice, key:b.key || key});
      saveState();
      if(typeof authPushSave === 'function') authPushSave(true);
    }
    if(typeof feedEvent === 'function') feedEvent('goods', `ซื้อ ${c.emoji} ${c.name} จากตลาดผู้เล่น 🏪`);
    showCollectReveal(b.id, finalPrice);
    sfx.buy();
    if(out.warning === 'receipt_error') toast('⚠️ ซื้อเสร็จแล้ว — บางข้อมูลอัปเดตช้าค่ะ ลองเปิดตลาดอีกครั้ง');
    toast(`🌏 ซื้อ${c.name}จาก ${b.sn || item.sn || 'เพื่อน'} สำเร็จ!`);
    if(typeof syncCoinHeader === 'function') syncCoinHeader();
    renderDashboard();
    renderMarketCard();
    return {ok:true, item:b};
  }).catch(()=>{
    return {ok:false, reason:'failed'};
  }).finally(()=>{ mktBuying = false; });
}

/* ฉากเปิดภาพใหญ่ตอนได้สินค้าใหม่ (สไตล์เดียวกับฉากอัปแรงค์ ใช้สีตามระดับ)
   produced=true → ฉาก "ผลิตสำเร็จ" (เรียกจาก game.js ตอนแต้มผลิตครบ) */
function showCollectReveal(id, price, produced){
  const c = collectInfo(id), tier = COLLECT_TIERS[c.tier];
  // ซื้อของ (จ่ายเหรียญ — โรงงาน/ตลาดผู้เล่น) = เสียงแคชเชียร์ชิ้ง! · ผลิตเอง = แฟนแฟร์เดิม
  if(!produced && price != null && sfx.cashier) sfx.cashier();
  else sfx.rankup();
  const img = collectImg(id, true);
  const overlay = document.createElement('div');
  overlay.className = 'rankup-overlay';
  const sub = produced
    ? `ผลิตด้วยแต้มคำศัพท์ ${fmtNum(c.words)} คำ เก่งมาก! เก็บเข้าคลังแล้ว 🏆<br>ตั้งขายในตลาด หรือส่งมอบออเดอร์พิเศษได้เลย!`
    : `${price != null ? `ซื้อมาในราคา 🪙${fmtNum(price)} · ` : ''}เก็บเข้าคลังสะสมแล้ว 🏆<br>ตั้งราคาขายต่อในตลาดได้ทุกเมื่อ!`;
  overlay.innerHTML = `
    <div class="rankup-rays" style="--rank-color:${tier.color}"></div>
    <div class="rankup-content">
      <div class="rankup-title">${produced ? '🏭 ผลิตสำเร็จ!' : '🎁 ได้ของสะสมใหม่!'}</div>
      <div class="collect-reveal-frame" style="--rank-color:${tier.color}">
        ${img ? `<img class="collect-reveal-img" src="${img}" decoding="async" width="512" height="512" alt="${escapeHTML(c.name)}">` : `<span class="cr-emoji">${c.emoji}</span>`}
      </div>
      <div class="rankup-name" style="color:${tier.color}">${c.name}</div>
      <div class="collect-reveal-stars" style="color:${tier.color}">${tier.stars} ${tier.label}</div>
      <p class="rankup-sub">${sub}</p>
      ${produced
        ? `<div class="cr-btn-row">
             <button class="rankup-btn rankup-btn-2 cr-close">ไว้ก่อน</button>
             <button class="rankup-btn cr-warehouse">📦 ไปเปิดคลัง</button>
           </div>`
        : `<button class="rankup-btn cr-close">เยี่ยมไปเลย! 🎉</button>`}
    </div>`;
  const closeReveal = ()=>{
    overlay.remove();
    if(document.getElementById('screen-dashboard').classList.contains('active')) renderDashboard();
  };
  overlay.querySelector('.cr-close').addEventListener('click', closeReveal);
  const whBtn = overlay.querySelector('.cr-warehouse');
  if(whBtn) whBtn.addEventListener('click', ()=>{ overlay.remove(); gotoMyStock(); });
  document.body.appendChild(overlay);
}

function buyAC(){
  const total = AC_PRICE + AC_INSTALL;
  if(state.coins < total){
    sfx.wrong(); toast(`แอร์+ติดตั้งรวม 🪙${fmtNum(total)} — เหรียญยังไม่พอนะ`); return;
  }
  askConfirm(`<h2>❄️ ติดแอร์ให้บ้าน</h2>
    <p style="font-size:16px;margin:6px 0">เครื่องปรับอากาศ 🪙${fmtNum(AC_PRICE)}<br>+ ค่าติดตั้ง 🪙${fmtNum(AC_INSTALL)}<br>= รวม <b>🪙${fmtNum(total)}</b></p>`,
    'ติดเลย!', ()=>{
      state.coins -= total;
      state.ac = true;
      if(typeof sellInc==='function') sellInc('ac');
      for(const p of state.pets) if(p.type !== 'dragon') p.heatFrom = null;
      sfx.buy();
      toast('❄️ ติดแอร์เรียบร้อย! บ้านเย็นฉ่ำ น้องสบายตัวสุดๆ 🎉');
      saveState();
      renderDashboard();
    });
}

function openHomeShop(){
  sfx.select();
  const overlay = document.createElement('div');
  overlay.className = 'levelup-overlay';
  overlay.innerHTML = `<div class="levelup-box home-shop-box">
    <h2>🏠 เลือกที่พักให้น้อง</h2>
    <div class="home-list">
      ${HOMES.map(h=>{
        const current = state.home === h.id;
        const downgradeLocked = homeDowngradeLocked(state.home, h.id);
        const afford = state.coins >= h.price;
        return `<div class="home-option ${current?'current':''} ${downgradeLocked?'downgrade-locked':''} ${!current && !downgradeLocked && !afford?'cant-afford':''}" data-home="${h.id}"${downgradeLocked?' aria-disabled="true"':''}>
          ${homeVisualHTML(h, 'home-opt-img')}
          <div class="home-opt-body">
            <b>${h.emoji} ${h.name}</b>
            <small>${h.desc}<br>${h.acNote}<br>🧾 ค่าบำรุง 🪙${fmtNum(maintCost(h.id))} + ⚡ ค่าไฟ 🪙${fmtNum(elecCost(h.id))} + 🚰 ค่าน้ำ 🪙${fmtNum(waterCost(h.id))} + 🗑️ ค่าขยะ 🪙${fmtNum(trashCost(h.id))}/เดือน (จ่ายทุกวันที่ 1)${h.quizBonus > 0 ? `<br>🎁 ทำแบบทดสอบครบ 10 ข้อ รับโบนัส +${h.quizBonus} 🪙 ทุกครั้ง` : ''}</small>
            ${current ? '<span class="it-tag tag-on">อยู่ปัจจุบัน</span>' : downgradeLocked ? '<span class="it-tag home-downgrade-lock">🔒 ต่ำกว่าบ้านปัจจุบัน</span>' : `<span class="home-price">🪙${fmtNum(h.price)}</span>`}
            ${soldBadge('home_'+h.id)}
          </div>
        </div>`;}).join('')}
    </div>
    <button class="food-cancel">ไว้ก่อน</button>
  </div>`;
  overlay.querySelector('.food-cancel').addEventListener('click', ()=>overlay.remove());
  overlay.querySelectorAll('.home-option').forEach(el=>{
    el.addEventListener('click', ()=>{
      const h = homeInfo(el.dataset.home);
      if(state.home === h.id){ toast('อยู่ที่พักนี้อยู่แล้วจ้า 😊'); return; }
      if(homeDowngradeLocked(state.home, h.id)){
        sfx.wrong(); toast('🔒 เลือกบ้านที่ราคาต่ำกว่าบ้านปัจจุบันไม่ได้ เพื่อป้องกันบ้านเดิมหาย'); return;
      }
      if(state.coins < h.price){
        sfx.wrong(); toast(`${h.name} ราคา 🪙${fmtNum(h.price)} — เหรียญยังไม่พอ สู้ๆ!`); return;
      }
      overlay.remove();
      askConfirm(`<h2>${h.emoji} ${h.name}</h2>
        <p style="font-size:16px;margin:6px 0">${h.desc}<br>${h.acNote}<br>ราคา <b>🪙${fmtNum(h.price)}</b><br>
        <small>🧾 ค่าบำรุง 🪙${fmtNum(maintCost(h.id))} + ⚡ ค่าไฟ 🪙${fmtNum(elecCost(h.id))} + 🚰 ค่าน้ำ 🪙${fmtNum(waterCost(h.id))} + 🗑️ ค่าขยะ 🪙${fmtNum(trashCost(h.id))}/เดือน (เดือนแรกฟรี)</small></p>`,
        'ซื้อเลย!', ()=>{
          // ตรวจซ้ำใน callback: กัน state เปลี่ยนระหว่างเปิดกล่องยืนยันและกดซื้อ
          if(homeDowngradeLocked(state.home, h.id)){
            sfx.wrong(); toast('🔒 ยกเลิกการซื้อ: บ้านนี้ต่ำกว่าบ้านปัจจุบัน'); return;
          }
          if(state.coins < h.price){
            sfx.wrong(); toast(`${h.name} ราคา 🪙${fmtNum(h.price)} — เหรียญไม่พอแล้ว`); return;
          }
          if(!Array.isArray(state.homePurchaseLog)) state.homePurchaseLog = [];
          state.homePurchaseLog.push({id:h.id, from:state.home || null, price:h.price, at:Date.now()});
          state.homePurchaseLog = state.homePurchaseLog.slice(-20);
          state.coins -= h.price;
          state.home = h.id;
          if(typeof sellInc==='function') sellInc('home_'+h.id);   // 🛒 นับยอดขายที่พัก
          state.ac = false;                       // แอร์ติดกับบ้านหลังเดิม ย้ายบ้านต้องซื้อใหม่
          state.bills.maint = {month: ymStr(Date.now()), due: 0, paid: 0};   // เดือนแรกฟรี บิลจริงออกวันที่ 1
          state.bills.elec  = {month: ymStr(Date.now()), due: 0, paid: 0};   // ค่าไฟ/ค่าน้ำบ้านใหม่ก็ฟรีเดือนแรก
          state.bills.water = {month: ymStr(Date.now()), due: 0, paid: 0};
          state.bills.trash = {month: ymStr(Date.now()), due: 0, paid: 0, fine: 0};   // ค่าขยะฟรีเดือนแรก
          state.powerCut = false; state.transformerBought = false;           // มิเตอร์+ระบบน้ำใหม่มากับบ้านใหม่
          state.waterCut = false; state.plumbingBought = false;
          if(heatProtected()) for(const p of state.pets) p.heatFrom = null;
          sfx.buy();
          toast(`🎉 ได้${h.name}แล้ว! น้องมีที่หลบแดดหลบฝนแล้ว`,0);
          saveState();
          renderDashboard();
        });
    });
  });
  document.body.appendChild(overlay);
}

/* ============================================================
   ร้านสัตว์เลี้ยง (ซื้อเพิ่มได้ ไม่ลบตัวเดิม)
   ============================================================ */
/* Purchase authority shared by the original pet shop and the Market catalog. */
function openPetPurchase(key){
  const conf = PETS[key];
  if(!conf){ sfx.wrong(); toast('ไม่พบข้อมูลสัตว์ชนิดนี้'); return; }
  if(hasPetType(key)){ sfx.select(); toast(`มี${conf.name}อยู่แล้วจ้า เลี้ยงน้องให้โตกันเถอะ 🥰`); return; }
  if(state.coins < conf.price){
    sfx.wrong();
    toast(`${conf.eggName} ราคา 🪙${fmtNum(conf.price)} — เล่นเกมจับคู่สะสมเหรียญก่อนนะ!`);
    return;
  }
  askConfirm(`<h2>รับ${conf.eggName}มาเลี้ยง?</h2>
    <p style="font-size:16px;margin:6px 0">${conf.eggDesc}<br>ราคา <b>🪙${fmtNum(conf.price)}</b><br><small>${conf.ability}</small></p>`,
    'รับเลย! 🥰', ()=>{
      // ข้อ 7: บังคับตั้งชื่อก่อนรับน้อง (กดยกเลิก = ไม่ซื้อ เหรียญไม่หาย)
      askNameDialog({
        emoji:'🏷️', title:`ตั้งชื่อให้${conf.name}ก่อนรับกลับบ้าน`,
        desc:'ชื่อไทย/อังกฤษ/ตัวเลข 1–9 ตัว (เปลี่ยนทีหลังได้ที่ปุ่ม ✏️)',
        placeholder:'เช่น บ็อบบี้, Lucky', min:1, max:9,
        okText:'รับเลย! 🥰', cancelText:'ยังไม่รับ',
        onOk:(name)=>{
          state.coins -= conf.price;
          state.pets.push(newPet(key, name));
          state.active = state.pets.length - 1;
          if(typeof sellInc==='function') sellInc('pet_'+key);
          saveState();
          if(typeof feedEvent === 'function') feedEvent('other', `รับน้องใหม่ ${conf.emoji||'🐾'} "${name}" มาเลี้ยงแล้ว 🥰`);
          if(typeof testerBoost === 'function') testerBoost();
          sfx.levelup();
          toast(conf.startKey === 'egg'
            ? `ได้ ${name} มาแล้ว! เล่นเกมเพื่อฟักไข่กันเถอะ 🎉`
            : `ได้ ${name} มาแล้ว! เล่นเกมให้น้องแข็งแรงจนลืมตากันเถอะ 🎉`);
          renderDashboard();
          showScreen('screen-dashboard');
          probeImages(petImageKeys(key)).then(renderDashboard);
        },
      });
    });
}

function renderPetShop(){
  document.getElementById('petshop-coin-count').textContent = fmtNum(state.coins);
  const grid = document.getElementById('egg-grid');
  grid.innerHTML = Object.keys(PETS).map(key=>{
    const p = PETS[key];
    const eggImg = IMG_FILES[startImgKey(key)];
    const owned = hasPetType(key);
    const afford = state.coins >= p.price;
    return `<div class="egg-card ${owned?'owned-pet':''} ${!owned && !afford?'cant-afford':''}" data-pet="${key}">
      ${eggImg ? `<img class="egg-img" src="${eggImg}" alt="${p.eggName}">` : startHTML(key)}
      <div class="egg-name">${p.eggName}</div>
      <div class="egg-desc">${p.eggDesc}</div>
      ${owned ? '<div class="pet-price owned">✅ เลี้ยงอยู่แล้ว</div>' : `<div class="pet-price">🪙${fmtNum(p.price)}</div>`}
      ${!owned && !afford ? `<div class="egg-need">ขาดอีก 🪙${fmtNum(p.price - state.coins)} ≈ เล่นอีก ${fmtNum(Math.ceil((p.price - state.coins)/10))} คำ</div>` : ''}
      ${soldBadge('pet_'+key)}
    </div>`;
  }).join('');
  grid.querySelectorAll('.egg-card').forEach(card=>{
    card.addEventListener('click', ()=>openPetPurchase(card.dataset.pet));
  });
}

/* ============================================================
   เลเวลอัพ (รายตัว)
   ============================================================ */
function showLevelUp(p){
  sfx.levelup();
  const conf = PETS[p.type];
  const pname = escapeHTML(p.name || conf.name);
  let title = `เลเวลอัพ! Lv.${p.level} 🎊`;
  let emoji = '⭐', msg = `${pname}เก่งขึ้นแล้ว!`;
  if(p.level === 2){
    if(conf.startKey === 'egg'){
      title = '🥚💥 ไข่ฟักแล้ว!';
      msg = `${pname}ออกมาจากไข่แล้ว น่ารักมาก! ปลดล็อกแอนิเมชันดุ๊กดิ๊ก`;
    }else{
      title = '👀 น้องลืมตาแล้ว!';
      msg = `${pname}ลืมตาและออกจากตะกร้าแล้ว! ปลดล็อกแอนิเมชันดุ๊กดิ๊ก<br>
        <small>🔍 รู้ไหม? ลูกหมาและลูกแมวแรกเกิดจะหลับตา แล้วค่อยลืมตาตอนอายุราว 1–2 สัปดาห์</small>`;
    }
    emoji = conf.baby;
  }else if(p.level === 3){
    title = '🌟 โตเต็มวัยแล้ว!';
    emoji = conf.adult; msg = `${pname}โตเต็มวัย มีออร่าประกาย ✨ ปลดล็อก: ${conf.ability}`;
  }
  const overlay = document.createElement('div');
  overlay.className = 'levelup-overlay';
  const lvImg = IMG_FILES[`${p.type}_${petStage(p)}_happy`] || IMG_FILES[`${p.type}_${petStage(p)}_normal`];
  overlay.innerHTML = `<div class="levelup-box">
    <h2>${title}</h2>
    ${lvImg ? `<img class="lv-img" src="${lvImg}" alt="">` : `<div class="lv-emoji" style="font-size:70px">${emoji}</div>`}
    <p style="margin:8px 0 0;font-size:16px">${msg}</p>
    <button>เย้! 🎉</button>
  </div>`;
  overlay.querySelector('button').addEventListener('click', ()=>overlay.remove());
  document.body.appendChild(overlay);
  saveState();
}

/* ============================================================
   สถิติผลการเรียนรู้
   ============================================================ */
function renderStats(){
  dailyTick();
  const s = state.student || {first:'-', last:'', grade:'-'};
  const worth = netWorth();                  // แรงค์ยึดมูลค่าทรัพย์สินสุทธิ
  const info = rankInfo(worth);
  const catRows = catsForStudent().map(c=>{
    const attempts = state.quizLog.filter(l=>l.cat === c.id);
    const best = attempts.length ? Math.max(...attempts.map(a=>a.score)) : null;
    const passed = state.quizPassed.includes(c.id);
    return `<div class="stats-row">
      <span>${c.emoji} ${c.name}</span>
      <span>${best === null ? 'ยังไม่เคยสอบ' : `สูงสุด ${best}/10`}${passed ? ' <span class="pass-mark">✅</span>' : ''}</span>
    </div>`;
  }).join('');
  const logs = [...state.quizLog].reverse().slice(0,20).map(l=>{
    const c = findCat(l.cat);
    return `<div class="stats-row">
      <span>${c ? c.emoji + ' ' + c.name : l.cat} — <b>${l.score}/${l.total}</b>
        ${l.passed ? '<span class="pass-mark">ผ่าน</span>' : '<span class="fail-mark">ไม่ผ่าน</span>'}</span>
      <span style="color:#9a8aac">${fmtThaiDT(l.ts)}</span>
    </div>`;
  }).join('');
  const petRows = state.pets.length
    ? state.pets.map(p=>{
        const stage = petStage(p);
        const face = stage === 'egg' ? (PETS[p.type].startKey==='egg'?'🥚':'🧺') : PETS[p.type][stage];
        return `<div class="stats-row"><span>${face} ${escapeHTML(p.name)} <small>(${PETS[p.type].name})</small></span><span>Lv.${p.level}${p.sick?' 🤒':''}</span></div>`;
      }).join('')
    : '<div class="cat-info">ยังไม่มีสัตว์เลี้ยง</div>';
  // ⌨️ รอบ 656: การ์ดสถิติเกม ⌨️ พิมพ์คำ — คำสะสม/เหรียญสะสม/เข็ม/อันดับปัจจุบันจากแท็บ tp + ประวัติรางวัลรายเดือน
  const tpBadge = state.typistBadge || 0;
  let tpRank = 0, tpInTop = false;
  try{
    if(typeof Online !== 'undefined' && Online.ready){
      const myId = onlineKey();
      const map = {};
      (Online.board || []).forEach(r=>{ map[r.id] = {id:r.id, tw:r.tw||0, tp:r.tp||0}; });
      map[myId] = {id:myId, tw:Math.round(state.tpWords||0), tp:Math.round(state.tpScore||0)};
      const all = Object.values(map).filter(r=>r.tw > 0).sort((a,b)=> (b.tw - a.tw) || (b.tp - a.tp));
      const idx = all.findIndex(r=>r.id===myId);
      if(idx >= 0){ tpRank = idx + 1; tpInTop = tpRank <= LB_TP_TOP; }
    }
  }catch(e){}
  const tpLog = (state.tpAwardLog || []).slice(0, 3).map(a=>`
    <div class="stats-row"><span>🏆 ${(typeof TpAward !== 'undefined') ? TpAward.monthThai(a.m) : a.m} · อันดับ ${a.r}
      <small>(${fmtNum(a.s||0)} คำ · ${fmtNum(a.s2||0)} เหรียญตอนตัดรอบ)</small></span>
      <span><b style="color:#d99a12">+${fmtNum(a.p)}</b> เหรียญ</span></div>`).join('');
  document.getElementById('stats-body').innerHTML = `
    <div class="stats-card">
      <h3 class="stats-title">${playerAvatarHTML('👧')} ${escapeHTML(state.profileName || s.first || 'ผู้เล่น')} · ชั้น ${escapeHTML(s.grade||'-')} <small class="stats-nick">${idTag((typeof onlineKey==='function')?onlineKey():'')}</small></h3>
      <div class="stats-row"><span>🎖️ แรงค์ปัจจุบัน (ตามมูลค่าทรัพย์สินสุทธิ)</span>
        <span style="color:${info.rank.color};font-weight:bold">${info.rank.emoji} ${info.label}</span></div>
      <div class="stats-row"><span>💪 แต้มความพยายามสะสม</span><span><b>${fmtNum(state.rp)}</b> RP</span></div>
      <div class="stats-row"><span>🪙 เหรียญที่หาได้วันนี้ (${fmtThaiDate(Date.now())})</span><span><b>+${fmtNum(state.daily.coins)}</b> เหรียญ</span></div>
      <div class="stats-row"><span>🪙 เหรียญคงเหลือ</span><span><b>${fmtNum(state.coins)}</b> เหรียญ</span></div>
      <div class="stats-row"><span>🏆 มูลค่าทรัพย์สินที่ซื้อไว้</span><span><b>${fmtNum(assetValue())}</b> เหรียญ</span></div>
      <div class="stats-row"><span>💰 มูลค่ารวมสุทธิ (ฐานคิดแรงค์)</span><span style="font-weight:bold;color:${info.rank.color}">${fmtNum(worth)} เหรียญ</span></div>
      <div class="stats-row"><span>สอบไปแล้วทั้งหมด</span><span><b>${state.quizLog.length}</b> ครั้ง</span></div>
      <div class="stats-row"><span>หมวดที่สอบผ่านแล้ว (ระดับชั้นนี้)</span><span><b>${catsForStudent().filter(c=>state.quizPassed.includes(c.id)).length}</b> / ${catsForStudent().length} หมวด</span></div>
      <div class="stats-row"><span>จับคู่คำศัพท์ถูกสะสม</span><span><b>${state.totalMatches}</b> คำ</span></div>
      <div class="stats-row"><span>⚡ สายฟ้าแลบ (เคลียร์ไว ≤5 วิ ไม่พลาดเลย)</span>
        <span><b>${fmtNum(state.thunderCount||0)}</b> ครั้ง${(state.thunderBadge||0) > 0 ? ` · ${THUNDER_TIER_UI[state.thunderBadge]}` : ''}</span></div>
      <div class="stats-row"><span>🎯 บินเฉียดสุดๆ (โลกเฮลิฯ/โดรน แบบไม่ชน)</span>
        <span><b>${fmtNum(state.daredevilCount||0)}</b> ครั้ง${(state.daredevilBadge||0) > 0 ? ` · ${DAREDEVIL_TIER_UI[state.daredevilBadge]}` : ''}</span></div>
      <div class="stats-row"><span>🏅 เล่นต่ออีกรอบสะสม (เกมจับคู่)</span>
        <span><b>${fmtNum(state.diligentCount||0)}</b> รอบ${(state.diligentBadge||0) > 0 ? ` · ${DILIGENT_TIER_UI[state.diligentBadge]}` : ''}</span></div>
      <div class="stats-row"><span>🏆 คอมโบเฉียดสูงสุด (เฉียดต่อเนื่องไม่ชน)</span>
        <span><b>${fmtNum(state.bestCombo||0)}</b> ครั้งติด</span></div>
      <div class="stats-row"><span>🏭 สินค้าที่ผลิตสำเร็จ</span><span><b>${fmtNum(state.producedCount)}</b> ชิ้น</span></div>
      <div class="stats-row"><span>🌐 โบนัสออนไลน์สะสม (เปิดเกมออนไลน์ = +${ONLINE_RATE}/วิ)</span><span><b>${fmtNum(state.onlineEarned||0)}</b> เหรียญ</span></div>
      <!-- 🏅 รอบ 602: อันดับดีที่สุดที่เคยทำได้บนกระดานเหรียญ (เก็บใน state.rankBest · อันดับตกแล้วสถิตินี้ไม่หาย) -->
      <div class="stats-row"><span>🥇 อันดับดีที่สุดที่เคยทำได้ (กระดานเหรียญ 🪙)</span>
        <span>${state.rankBest
          ? `<b style="color:#d99a12">อันดับ ${fmtNum(state.rankBest)}</b>${state.rankSeen ? ` · ตอนนี้อันดับ ${fmtNum(state.rankSeen)}` : ''}`
          : 'ยังไม่เคยติดกระดาน — เก็บเหรียญเพิ่มอีกนิดนะ 💪'}</span></div>
    </div>
    <div class="stats-card"><h3 class="stats-title">🐾 สัตว์เลี้ยงของหนู</h3>${petRows}</div>
    <div class="stats-card">
      <h3 class="stats-title">⌨️ สถิติเกมพิมพ์คำ</h3>
      <div class="stats-row"><span>📝 คำที่พิมพ์สำเร็จสะสม (ตัดสินอันดับ)</span><span><b>${fmtNum(state.tpWords||0)}</b> คำ</span></div>
      <div class="stats-row"><span>🪙 เหรียญสะสมจากเกมนี้</span><span><b>${fmtNum(state.tpScore||0)}</b> เหรียญ</span></div>
      <div class="stats-row"><span>🎖️ เข็มนักพิมพ์</span>
        <span>${tpBadge ? `<b class="stat-badge-line">${(typeof badgeIcHTML==='function')?badgeIcHTML(typistEmoji(tpBadge),'stat-badge-ic'):typistEmoji(tpBadge)} ${escapeHTML((BADGE_META[typistEmoji(tpBadge)]||{}).n||'')}</b>` : 'ยังไม่ได้เข็ม — พิมพ์ครบ 100 คำจะได้ ⌨️'}</span></div>
      <div class="stats-row"><span>🥇 อันดับปัจจุบัน (กระดาน ⌨️ พิมพ์คำ)</span>
        <span>${tpRank
          ? `<b style="color:${tpInTop?'#d99a12':'#7a5ca8'}">อันดับ ${fmtNum(tpRank)}</b>${tpInTop?'':` <small>(นอก Top ${LB_TP_TOP})</small>`}`
          : 'พิมพ์ให้ครบอย่างน้อย 1 คำก่อนถึงจะติดกระดาน'}</span></div>
      <h3 class="stats-title" style="margin-top:10px">📜 ประวัติรางวัลรายเดือน ⌨️ พิมพ์คำ</h3>
      ${tpLog || '<div class="cat-info">ยังไม่เคยได้รับรางวัลรายเดือน — ติด Top 10 ก่อนวันตัดรอบสิ!</div>'}
    </div>
    <div class="stats-card"><h3 class="stats-title">📚 คะแนนสูงสุดรายหมวด (${gradeBand(s.grade).label})</h3>${catRows}</div>
    <div class="stats-card"><h3 class="stats-title">🕐 ประวัติการสอบล่าสุด</h3>
      ${logs || '<div class="cat-info">ยังไม่มีประวัติการสอบ — ไปลองสอบหมวดแรกกันเถอะ!</div>'}
    </div>`;
  // item 4: ปุ่มการ์ดสรุปส่งครู — แทรกบนสุดของหน้าสถิติ
  const tcBtn = document.createElement('button');
  tcBtn.className = 'big-btn tc-open';
  tcBtn.id = 'btn-teacher-card';
  tcBtn.innerHTML = '📇 การ์ดสรุปส่งครู <small>(แคปหน้าจอส่งไลน์ครูได้เลย)</small>';
  tcBtn.addEventListener('click', showTeacherCard);
  document.getElementById('stats-body').prepend(tcBtn);
}

/* ============================================================
   item 4: การ์ดสรุปส่งครู — ใบเดียวจบ ชื่อ/วัน-เวลา/เหรียญวันนี้/แรงค์/สอบล่าสุด
   เด็กแคปหน้าจอส่งไลน์ครู · ปุ่มปิดอยู่นอกตัวการ์ด แคปแล้วภาพสะอาด
   ============================================================ */
function showTeacherCard(){
  dailyTick();
  const s = state.student || {first:'-', last:'', grade:'-'};
  const info = rankInfo(netWorth());
  const last = state.quizLog.length ? state.quizLog[state.quizLog.length-1] : null;
  const lastCat = last ? findCat(last.cat) : null;
  const now = new Date();
  const dateTxt = now.toLocaleDateString('th-TH', thLocaleOpt({weekday:'long', day:'numeric', month:'long', year:'numeric'}));   // 🇹🇭 รอบ 988
  const timeTxt = now.toLocaleTimeString('th-TH', thLocaleOpt({hour:'2-digit', minute:'2-digit'}));
  const badges = (typeof badgeSuffix === 'function') ? badgeSuffix() : '';
  const overlay = document.createElement('div');
  overlay.className = 'levelup-overlay';
  overlay.innerHTML = `<div class="tc-wrap">
    <div class="tc-card">
      <div class="tc-head">🌍 Vocab World<div class="tc-sub">การ์ดรายงานผลการเรียนรู้</div></div>
      <div class="tc-name">${playerAvatarHTML('🧒')} <b>${escapeHTML(state.profileName || s.first || 'ผู้เล่น')}</b> · ชั้น ${escapeHTML(s.grade||'-')} · ${idTag((typeof onlineKey==='function')?onlineKey():'')}${badges ? ` <span class="tc-badges">${badges}</span>` : ''}</div>
      <div class="tc-when">🗓️ ${dateTxt} · ⏰ ${timeTxt} น.</div>
      <div class="tc-row"><span>🪙 เหรียญที่หาได้วันนี้</span><b>+${fmtNum(state.daily.coins)}</b></div>
      <div class="tc-row"><span>🎖️ แรงค์ปัจจุบัน</span><b style="color:${info.rank.color}">${info.rank.emoji} ${info.label}</b></div>
      <div class="tc-row"><span>📝 คะแนนสอบล่าสุด</span><b>${last
        ? `${lastCat ? lastCat.emoji + ' ' + lastCat.name : last.cat} <span class="${last.passed ? 'tc-pass' : 'tc-try'}">${last.score}/${last.total} ${last.passed ? '✅ ผ่าน' : '💪 กำลังพยายาม'}</span>`
        : 'ยังไม่เคยสอบ'}</b></div>
      <div class="tc-row"><span>🃏 จับคู่คำศัพท์ถูกสะสม</span><b>${fmtNum(state.totalMatches)} คำ</b></div>
      <div class="tc-sign">✔️ ออกให้โดยเกมอัตโนมัติ · ${escapeHTML(location.hostname || 'Vocab World')}</div>
    </div>
    <div class="tc-hint">📸 แคปหน้าจอนี้ แล้วส่งให้คุณครูทางไลน์ได้เลย</div>
    <button class="tc-close">ปิด</button>
  </div>`;
  overlay.querySelector('.tc-close').addEventListener('click', ()=>overlay.remove());
  overlay.addEventListener('click', e=>{ if(e.target === overlay) overlay.remove(); });
  document.body.appendChild(overlay);
  sfx.select();
}

/* ============================================================
   📞 หน้าจอโทรหาเพื่อน — สายเสียง (รอบ 625 · กลุ่ม 3 คน + ปิดวิดีโอ รอบ 631)
   เครื่องยนต์ (WebRTC + กริ่งผ่าน Firebase) อยู่ที่ `Call` ใน js/online.js
   ไฟล์นี้ = หน้าจอล้วน: กริ่งสายเข้า / จอคุย / ปุ่มควบคุม / อิโมจิลอย / ➕ ชวนคนที่ 3
   ผูกกันด้วย object ชื่อ `callUI` (เครื่องยนต์เรียกผ่าน Call.ui('ชื่อ',...))
   🔒 โชว์ชื่อเล่น + 🆔 เท่านั้น (กติกาคุ้มครองเด็ก — ไม่มีชื่อจริง/ชั้นเรียน)
   🔒 รอบ 631 (ผู้ใช้สั่ง — ป้องกันมิจฉาชีพ): ลบวิดีโอคอลออกทั้งระบบ เหลือ "สายเสียง" อย่างเดียว
      ไม่มี <video> ไม่มีปุ่มกล้อง/สลับกล้อง ไม่ขอสิทธิ์กล้องจากเครื่องเลย (ดู Call.media ใน js/online.js)
      ของเดิมที่ถูกลบไปพร้อมกัน: จอวิดีโอเต็มจอ+จอเล็ก (รอบ 625) · จอแนวตั้ง (รอบ 626) · สลับจอใหญ่-เล็ก (รอบ 627)
   ============================================================ */
const CALL_REACT_EMOS = ['❤️','😆','👍','😮','🎉','😭','🐱','⭐'];
/* 🟢 รอบ 632: ไฟเขียวรอบช่อง "คนที่กำลังพูด" — วัดระดับเสียงจากสตรีมจริง (Web Audio)
   MIN = ดังเกินนี้ถือว่าพูดอยู่ (ต่ำกว่านี้คือเสียงลมหายใจ/เสียงห้อง) · HOLD = ค้างไฟหลังเงียบ กันกะพริบตามจังหวะคำ */
const CALL_TALK_MIN  = .028;
const CALL_TALK_HOLD = 420;
/* 🗣️ รอบ 633: สลับตำแหน่งช่อง "คนพูดล่าสุด" ได้ไม่ถี่กว่านี้ (กันช่องเต้นตอนคุยสลับกันไว) */
const CALL_ORDER_GAP = 1400;

/* 🔔 เสียงกริ่ง (รอบ 629: ผู้ใช้ส่งไฟล์เสียงจริงมาให้ — สูตร 2 ชั้นเดียวกับ playCashier ใน util.js)
   ชั้น 1: ไฟล์จริงเล่นวน (loop) — ฝั่งผู้รับสาย IncomingCallTone · ฝั่งผู้โทร OutgoingCallTone
   ชั้น 2: ไฟล์หาย/เบราว์เซอร์บล็อก autoplay → สลับเป็น beep สังเคราะห์แบบเดิมทันที (กริ่งต้องไม่เงียบ)
   🔇 เคารพสวิตช์เสียง `state.sound` · การสั่นแยกสวิตช์ (`state.haptic`) ทำงานของมันเองไม่ว่าเสียงจะมาจากทางไหน */
const CALL_TONES = {in:'sound/IncomingCallTone.mp3', out:'sound/OutgoingCallTone.mp3'};
const callRing = {
  t:null, au:null, dir:null, cache:{}, miss:{in:false, out:false},
  synth(){
    if(this.dir === 'in'){ beep(880,.18,0,'sine',.14); beep(660,.2,.24,'sine',.14); }
    else                 { beep(420,.32,0,'sine',.06); beep(420,.32,.5,'sine',.06); }
  },
  /* ไฟล์เล่นไม่ได้ → ปล่อยมือจากไฟล์ แล้วให้ตัวจับเวลาเดิมยิง beep แทน (เติมเสียงรอบนี้ให้ก่อน ไม่ต้องรอรอบถัดไป) */
  toSynth(){
    if(this.au){ try{ this.au.pause(); }catch(e){} this.au = null; }
    if(this.t) this.synth();
  },
  start(dir){
    this.stop();
    this.dir = dir;
    if(state.sound && !this.miss[dir]){
      try{
        const a = this.cache[dir] || (this.cache[dir] = new Audio(CALL_TONES[dir]));
        a.loop = true; a.volume = (dir === 'in') ? .7 : .5;
        a.onerror = ()=>{ this.miss[dir] = true; if(this.au === a) this.toSynth(); };
        try{ a.currentTime = 0; }catch(e){}
        const p = a.play();
        if(p && p.catch) p.catch(()=>{ this.miss[dir] = true; if(this.au === a) this.toSynth(); });
        this.au = a;
      }catch(e){ this.miss[dir] = true; this.au = null; }
    }
    // จังหวะซ้ำ: ใช้ไฟล์ = เท่ากับความยาวไฟล์ (สั่นตรงหัวลูปทุกรอบ ไม่เลื่อนหนีกัน) · ใช้ beep = จังหวะเดิม
    const period = ()=>(this.au && this.au.duration > .4)
      ? Math.round(this.au.duration * 1000) : (dir === 'in' ? 1600 : 2800);
    const tick = ()=>{
      if(dir === 'in' && state.haptic !== false && navigator.vibrate) navigator.vibrate([200,110,200]);
      if(!this.au) this.synth();          // ใช้ไฟล์อยู่ = ไฟล์ loop เองแล้ว ตัวจับเวลาเหลือหน้าที่สั่นอย่างเดียว
      this.t = setTimeout(tick, period());
    };
    tick();
  },
  stop(){
    if(this.t){ clearTimeout(this.t); this.t = null; }
    if(this.au){ try{ this.au.pause(); this.au.currentTime = 0; }catch(e){} this.au = null; }
    this.dir = null;
    if(navigator.vibrate) try{ navigator.vibrate(0); }catch(e){}
  },
};

const callUI = {
  ov:null, ring:null, tick:null,
  wasLive:false,        // ☎️ รอบ 630: สายนี้ต่อติดจริงหรือยัง (ใช้ตัดสินว่าตอนวางสายควรมีเสียง "ปุ๊ก" ไหม)

  /* 🔒 อยู่ในโลก 3D เมาส์ถูกล็อกอยู่ (pointer lock) → ปลดก่อน ไม่งั้นกดปุ่มรับสายไม่ได้ */
  freeMouse(){ try{ if(document.pointerLockElement) document.exitPointerLock(); }catch(e){} },

  /* 🔔 กริ่งสายเข้า — เด้งทับทุกหน้าในเกม (รวมโลก 3D) */
  incoming(){
    this.closeRing();
    this.freeMouse();
    const p = Call.peer || {uid:'', n:'เพื่อน'};
    const grp = (Call.roomG || []).length > 0;      // 👥 รอบ 631: ถูกชวนเข้า "สายกลุ่ม" ที่คุยกันอยู่แล้ว
    const d = document.createElement('div');
    d.className = 'call-ring';
    d.innerHTML = `<div class="cr-card">
      <div class="cr-kind">${grp ? '👥 ชวนคุยกลุ่ม' : '📞 สายเสียงเข้า'}</div>
      <div class="cr-av"><span>🧒</span></div>
      <div class="cr-name">${escapeHTML(p.n)}</div>
      <div class="cr-id">${idTag(p.uid)}</div>
      ${grp ? `<div class="cr-grp">มีเพื่อนคุยอยู่ในสายแล้ว ${(Call.roomG || []).length} คน</div>` : ''}
      <div class="cr-btns">
        <button class="cr-btn cr-no" type="button">✕<small>ไม่รับ</small></button>
        <button class="cr-btn cr-ok" type="button">📞<small>รับสาย</small></button>
      </div>
      <div class="cr-safe">🔒 รับสายได้เฉพาะเพื่อนที่เพิ่มกันแล้ว</div>
    </div>`;
    document.body.appendChild(d);
    this.ring = d;
    d.querySelector('.cr-ok').addEventListener('click', ()=>{ callRing.stop(); Call.accept(); });
    d.querySelector('.cr-no').addEventListener('click', ()=>{ callRing.stop(); Call.decline(); });
    callRing.start('in');
  },
  closeRing(){ if(this.ring){ this.ring.remove(); this.ring = null; } },

  /* ☎️ จอคุย (ใช้ทั้งตอนกำลังเรียกออกและตอนคุยจริง)
     👥 รอบ 631: จอเดียวรองรับทั้งสายเดี่ยวและสายกลุ่ม 3 คน — ทุกคนเป็น "ช่อง" (.ctile) เหมือนกันหมด
     สายเดี่ยว (n2) = โชว์ช่องของเพื่อนช่องเดียวเต็มจอ (หน้าตาเหมือนเดิมทุกอย่าง)
     สายกลุ่ม (n3) = แบ่งจอเท่า ๆ กัน 3 ช่อง ไม่มี scroll (กฎทองข้อ 7) */
  open(){
    this.closeRing();
    this.freeMouse();
    if(this.ov) return;
    const d = document.createElement('div');
    d.className = 'call-ov n2';
    d.innerHTML = `<div class="call-stage" id="call-stage"></div>
      <div class="call-top">
        <div class="ct-name"></div>
        <div class="ct-time" id="call-time">${Call.caller ? 'กำลังเรียก…' : 'กำลังต่อสาย…'}</div>
      </div>
      <div class="call-note" id="call-note" style="display:none"></div>
      <div class="call-fx" id="call-fx"></div>
      <div class="call-emos" id="call-emos" style="display:none">
        ${CALL_REACT_EMOS.map(e=>`<button class="call-emo" type="button">${e}</button>`).join('')}
      </div>
      <div class="call-bar" id="call-bar">
        <button class="cb-btn" data-a="emo" type="button" title="ส่งอิโมจิ">😀</button>
        <button class="cb-btn" data-a="mic" type="button" title="ไมค์">🎤</button>
        <button class="cb-btn cb-add" data-a="add" type="button" title="ชวนเพื่อนเข้าสาย" style="display:none">➕</button>
        <button class="cb-btn" data-a="spk" type="button" title="ลำโพง">🔊</button>
        <button class="cb-btn cb-end" data-a="end" type="button" title="วางสาย">📞</button>
      </div>`;
    document.body.appendChild(d);
    this.ov = d;

    d.querySelectorAll('.cb-btn').forEach(b=>b.addEventListener('click', ()=>{
      const a = b.dataset.a;
      if(a === 'end')       { callRing.stop(); Call.hangup(); }
      else if(a === 'mic')  { Call.setMic(!Call.micOn); sfx.select(); }
      else if(a === 'spk')  { Call.setSpk(!Call.spkOn); sfx.select(); }
      else if(a === 'add')  { sfx.select(); this.openInvite(); }
      else if(a === 'emo')  {
        const box = d.querySelector('#call-emos');
        box.style.display = box.style.display === 'none' ? '' : 'none';
      }
    }));
    d.querySelectorAll('.call-emo').forEach(b=>b.addEventListener('click', ()=>{
      Call.sendReaction(b.textContent);
      d.querySelector('#call-emos').style.display = 'none';
    }));

    this.paint();
    this.btns();
    if(Call.caller && Call.st === 'out') callRing.start('out');
  },

  /* หัวจอ: สายเดี่ยว = ชื่อเพื่อน + 🆔 · สายกลุ่ม = "คุยกลุ่ม N คน" */
  head(){
    if(!this.ov) return;
    const el = this.ov.querySelector('.ct-name');
    if(!el) return;
    const ps = Call.list();
    if(ps.length > 1) el.innerHTML = '👥 คุยกลุ่ม ' + (ps.length + 1) + ' คน';
    else if(ps[0])    el.innerHTML = escapeHTML(ps[0].n) + ' <small>' + idTag(ps[0].uid) + '</small>';
  },

  /* 🎨 วาดช่องของทุกคนในสาย (เรียกทุกครั้งที่คนเข้า/ออก/สถานะเปลี่ยน)
     เสียงของแต่ละคนอยู่ที่ <audio> ของช่องนั้น ๆ — ปุ่ม 🔊 คุมทุกช่องพร้อมกัน */
  paint(){
    if(!this.ov) return;
    const stage = this.ov.querySelector('#call-stage');
    if(!stage) return;
    const ps  = Call.list();
    const ids = ps.map(p=>p.uid).concat('me');
    this.ov.classList.toggle('n3', ids.length > 2);
    this.ov.classList.toggle('n2', ids.length <= 2);
    ids.forEach((uid, i)=>{
      const me = uid === 'me';
      const p  = me ? null : Call.peers[uid];
      if(!me && !p) return;
      let t = stage.querySelector('.ctile[data-uid="' + uid + '"]');
      if(!t){
        t = document.createElement('div');
        t.className = 'ctile' + (me ? ' ct-me' : '');
        t.dataset.uid = uid;
        t.innerHTML = '<div class="ct-face"><span>' + (me ? '🙂' : '🧒') + '</span></div>' +
                      '<div class="ct-nm"></div><div class="ct-sub"></div>' +
                      (me ? '' : '<audio autoplay></audio>');
      }
      if(stage.children[i] !== t) stage.insertBefore(t, stage.children[i] || null);
      const conn = !me && p.pc && p.pc.connectionState === 'connected';
      t.querySelector('.ct-nm').innerHTML = me
        ? 'ฉัน' : escapeHTML(p.n) + ' <small>' + idTag(uid) + '</small>';
      t.querySelector('.ct-sub').textContent = me
        ? (Call.micOn ? '' : '🔇 ปิดไมค์อยู่')
        : (p.ring && !p.on ? 'กำลังเรียก…' : (conn ? '🟢 คุยอยู่' : 'กำลังต่อสาย…'));
      t.classList.toggle('ringing', !!(!me && p.ring && !p.on));
      t.classList.toggle('mute', !!(me && !Call.micOn));
      if(!me){
        const au = t.querySelector('audio');
        if(au){
          if(p.remote && au.srcObject !== p.remote){ au.srcObject = p.remote; au.play().catch(()=>{}); }
          au.muted = !Call.spkOn;
        }
      }
      this.vuTap(uid, me ? Call.local : p.remote);     // 🟢 รอบ 632: เกาะสตรีมไว้ดูว่าใครกำลังพูด
    });
    Array.from(stage.children).forEach(el=>{
      if(ids.indexOf(el.dataset.uid) < 0){ this.vuDrop(el.dataset.uid); el.remove(); }
    });
    this.vuPlace();                                  // 🗣️ รอบ 633: ช่องคนพูดล่าสุดอยู่หน้าสุด
    this.head();
  },

  /* 🟢 รอบ 632 (ผู้ใช้เลือกไอเดียต่อยอดข้อ 1 จากรอบ 631): ไฟเขียวรอบช่องคนที่กำลังพูด
     วัดจากสตรีมจริงด้วย Web Audio — AudioContext ตัวเดียวทั้งสาย + analyser คนละตัวต่อคน
     🔇 analyser ต่อจาก source เฉย ๆ ไม่ต่อไป destination → ไม่มีเสียงงอกออกลำโพงซ้ำ
     เช็กราว 12 ครั้ง/วินาที (เบาพอสำหรับมือถือเด็ก) · ปิดไมค์ตัวเอง = ไฟไม่ติดถึงจะมีเสียงเข้าไมค์ */
  vu:{ac:null, src:{}, an:{}, hold:{}, last:{}, buf:null, timer:null},
  vuTap(uid, stream){
    const V = this.vu;
    if(!stream || !stream.getAudioTracks().length) return;
    if(V.src[uid] && V.src[uid].stream === stream) return;      // เกาะสตรีมนี้อยู่แล้ว
    this.vuDrop(uid);
    if(!V.ac){
      try{ V.ac = new (window.AudioContext || window.webkitAudioContext)(); }catch(e){ return; }
      if(V.ac.state === 'suspended') V.ac.resume().catch(()=>{});
    }
    try{
      const node = V.ac.createMediaStreamSource(stream);
      const an = V.ac.createAnalyser();
      an.fftSize = 256; an.smoothingTimeConstant = .45;
      node.connect(an);
      V.src[uid] = {node, stream}; V.an[uid] = an;
    }catch(e){ return; }
    if(!V.timer) V.timer = setInterval(()=>this.vuTick(), 85);
  },
  vuDrop(uid){
    const V = this.vu;
    if(V.src[uid]){ try{ V.src[uid].node.disconnect(); }catch(e){} delete V.src[uid]; }
    delete V.an[uid]; delete V.hold[uid]; delete V.last[uid];
  },
  vuTick(){
    const V = this.vu;
    if(!this.ov) return this.vuStop();
    const buf = V.buf || (V.buf = new Uint8Array(256));
    const now = Date.now();
    Object.keys(V.an).forEach(uid=>{
      V.an[uid].getByteTimeDomainData(buf);
      let sum = 0;
      for(let i = 0; i < buf.length; i++){ const d = (buf[i] - 128)/128; sum += d*d; }
      const loud = Math.sqrt(sum/buf.length) > CALL_TALK_MIN;
      const open = (uid === 'me') ? Call.micOn : true;           // ปิดไมค์แล้วห้ามโชว์ว่าพูดอยู่
      if(loud && open){ V.hold[uid] = now + CALL_TALK_HOLD; V.last[uid] = now; }
      const t = this.ov.querySelector('.ctile[data-uid="' + uid + '"]');
      if(t) t.classList.toggle('talking', (V.hold[uid] || 0) > now);
    });
    this.vuOrder();
  },

  /* 🗣️ รอบ 633 (ผู้ใช้เลือกไอเดียต่อยอดข้อ 1 จากรอบ 632): คุยกลุ่มแล้วช่อง "คนพูดล่าสุด" ขึ้นก่อน
     สลับด้วย CSS `order` ของ grid — **ไม่ย้าย DOM** เพราะย้าย <audio> ที่กำลังเล่นอยู่เสี่ยงเสียงสะดุด
     (DOM ยังเรียง [เพื่อน, เพื่อน, ฉัน] เสมอ → กฎ :nth-child(3) ของผังแนวตั้งจึงยังชี้ช่อง "ฉัน" ถูกเหมือนเดิม)
     ⏱️ หน่วง CALL_ORDER_GAP กันช่องเต้นตอนคุยสลับกันไว ๆ · ช่อง "ฉัน" อยู่ท้ายเสมอ (เด็กรู้อยู่แล้วว่าตัวเองพูด) */
  vuLead:'', vuAt:0,
  vuOrder(force){
    if(!this.ov) return;
    const ps = Call.list();
    if(ps.length < 2){ if(this.vuLead){ this.vuLead = ''; this.vuPlace(); } return; }
    let lead = this.vuLead, best = -1;
    ps.forEach(p=>{ const t = this.vu.last[p.uid] || 0; if(t > best){ best = t; lead = p.uid; } });
    if(lead === this.vuLead && !force) return;
    const now = Date.now(), fresh = best <= 0;   // ยังไม่มีใครพูดเลย = แค่จัดลำดับตั้งต้น ไม่นับเป็นการสลับ
    if(!force && !fresh && now - this.vuAt < CALL_ORDER_GAP) return;   // เพิ่งสลับไป รอให้ครบจังหวะก่อน
    this.vuLead = lead; this.vuAt = fresh ? 0 : now;                   // → คนแรกที่พูดจริงขึ้นหน้าทันที ไม่ต้องรอ
    this.vuPlace();
  },
  /* ใส่ลำดับจริงลงช่อง (เรียกตอนวาดใหม่ด้วย เผื่อมีช่องเพิ่งเกิด) */
  vuPlace(){
    if(!this.ov) return;
    this.ov.querySelectorAll('.ctile').forEach(t=>{
      const u = t.dataset.uid;
      t.style.order = (u === 'me') ? 2 : (u === this.vuLead ? 0 : 1);
    });
  },
  vuStop(){
    const V = this.vu;
    if(V.timer){ clearInterval(V.timer); V.timer = null; }
    Object.keys(V.src).forEach(u=>this.vuDrop(u));
    if(V.ac){ try{ V.ac.close(); }catch(e){} V.ac = null; }
    V.hold = {}; V.last = {}; V.buf = null;
    this.vuLead = ''; this.vuAt = 0;
  },

  /* ต่อสายติดแล้ว → เริ่มจับเวลา + เปิดปุ่มอิโมจิ */
  live(){
    callRing.stop();
    if(!this.ov) this.open();
    this.ov.classList.add('on');
    this.status('');
    clearInterval(this.tick);
    const tEl = this.ov.querySelector('#call-time');
    const upd = ()=>{
      if(!Call.startedAt) return;
      const s = Math.floor((Date.now() - Call.startedAt)/1000);
      tEl.textContent = String(Math.floor(s/60)).padStart(2,'0') + ':' + String(s%60).padStart(2,'0');
    };
    upd();
    this.tick = setInterval(upd, 1000);
    this.paint();
    this.btns();
    if(!this.wasLive && typeof sfx !== 'undefined') sfx.callOn();
    this.wasLive = true;                         // ☎️ รอบ 630: จำไว้ว่าสายนี้ "ต่อติดจริง" → ตอนวางสายถึงมีเสียงปุ๊ก
  },

  /* ป้ายบอกเหตุผลบนจอ (กฎทองข้อ 1 — ระบบต้องบอกเองว่าติดอะไร) */
  status(html){
    if(!this.ov) return;
    const n = this.ov.querySelector('#call-note');
    n.innerHTML = html || '';
    n.style.display = html ? '' : 'none';
  },

  /* สถานะปุ่ม (ปิดไมค์/ลำโพง/ชวนเพื่อน) — ปุ่มกล้อง+สลับกล้องถูกลบไปแล้ว (รอบ 631 ลบวิดีโอคอล) */
  btns(){
    if(!this.ov) return;
    const q = a=>this.ov.querySelector('.cb-btn[data-a="' + a + '"]');
    const mic = q('mic'), spk = q('spk'), add = q('add');
    mic.textContent = Call.micOn ? '🎤' : '🔇';
    mic.classList.toggle('off', !Call.micOn);
    spk.textContent = Call.spkOn ? '🔊' : '🔈';
    spk.classList.toggle('off', !Call.spkOn);
    add.style.display = (Call.st === 'live' && !Call.full()) ? '' : 'none';   // 👥 ชวนได้ตอนคุยกันแล้ว และยังไม่ครบ 3 คน
    this.paint();
  },

  /* ➕ รอบ 631: เลือกเพื่อนมาเข้าสายเป็นคนที่ 3 */
  openInvite(){
    if(!this.ov) return;
    if(Call.st !== 'live'){ toast('รอเพื่อนรับสายก่อน แล้วค่อยชวนคนที่ 3 นะ ☎️'); return; }
    if(Call.full()){ toast('📞 คุยกลุ่มพร้อมกันได้ ' + (CALL_MAX_PEERS + 1) + ' คนนะ'); return; }
    const old = this.ov.querySelector('.call-add');
    if(old){ old.remove(); return; }                    // กดซ้ำ = ปิด
    const fr = (typeof Online !== 'undefined' ? (Online.myFriends || []) : []).filter(f=>!Call.peers[f.uid]);
    const on = (typeof Online !== 'undefined' && Online.presenceMap) ? Online.presenceMap : {};
    const box = document.createElement('div');
    box.className = 'call-add';
    box.innerHTML = `<div class="ca-head">➕ ชวนเพื่อนเข้าสาย</div>
      <div class="ca-list">${
        fr.length ? fr.map((f,i)=>`<button class="ca-row" data-i="${i}" type="button">
            <span class="ca-dot${on[f.uid] ? '' : ' off'}"></span>
            <span class="ca-nm">${escapeHTML(f.n)}<small> ${idTag(f.uid)}</small></span>
            <span class="ca-go">📞</span>
          </button>`).join('')
        : '<div class="ca-empty">ยังไม่มีเพื่อนคนอื่นให้ชวนเลย 🐣</div>'}</div>
      <div class="ca-safe">👫 เข้ากลุ่มได้เมื่อ<b>ทุกคนเป็นเพื่อนกันครบ</b> (เพื่อความปลอดภัย)</div>
      <button class="ca-close" type="button">ปิด</button>`;
    this.ov.appendChild(box);
    box.querySelectorAll('.ca-row').forEach(b=>b.addEventListener('click', ()=>{
      const f = fr[+b.dataset.i];
      box.remove();
      if(f) Call.invite(f);
    }));
    box.querySelector('.ca-close').addEventListener('click', ()=>box.remove());
  },

  /* 💛 อิโมจิลอย (ดีกว่า LINE: ส่งตรง P2P ระหว่างคุย เห็นพร้อมกันทุกคนในสาย) */
  reaction(emo, mine){
    if(!this.ov) return;
    const fx = this.ov.querySelector('#call-fx');
    const s = document.createElement('span');
    s.className = 'call-fx-emo' + (mine ? ' mine' : '');
    s.textContent = emo;
    s.style.left = (mine ? 55 : 15) + Math.random()*28 + '%';
    fx.appendChild(s);
    setTimeout(()=>s.remove(), 2600);
    if(!mine && typeof sfx !== 'undefined') sfx.select();
  },

  close(note){
    callRing.stop();
    this.vuStop();                               // 🟢 ปิดตัววัดเสียง + AudioContext ให้เกลี้ยง
    clearInterval(this.tick); this.tick = null;
    this.closeRing();
    /* ☎️ รอบ 630: "ปุ๊ก" เฉพาะสายที่คุยกันจริงแล้ววาง — สายที่ไม่ได้รับ/ติดสาย/ยกเลิก มี toast บอกอยู่แล้ว
       (เช็กที่ธงของตัวเองเพราะ Call.end() ล้าง startedAt ทิ้งก่อนเรียก close มาถึงตรงนี้) */
    if(this.wasLive && typeof sfx !== 'undefined') sfx.callOff();
    this.wasLive = false;
    if(this.ov){
      const ov = this.ov; this.ov = null;
      ov.querySelectorAll('audio').forEach(a=>{ try{ a.pause(); a.srcObject = null; }catch(e){} });
      const t = ov.querySelector('#call-time');
      if(t && note) t.textContent = note;
      ov.classList.add('bye');
      setTimeout(()=>ov.remove(), 420);
    }
  },
};

/* 📞 เปิดสายจากที่ไหนก็ได้ในเกม (ใช้ในหัวกล่องแชท) */
function startCall(friend){
  if(typeof Call === 'undefined'){ toast('ระบบโทรยังไม่พร้อม ลองรีเฟรชหน้าเว็บนะ'); return; }
  sfx.select();
  Call.start(friend);                 // 🔒 สายเสียงอย่างเดียว (ลบวิดีโอคอลแล้ว รอบ 631)
}
