"use strict";
/* ============================================================
   🎖️ cert.js — ประกาศนียบัตร Vocab World (รอบ 712)
   สอบผ่าน = ได้ "ใบประกาศ" อย่างเป็นทางการแทนอิโมจิ 📝 เดิม
   ① ฟีด: การ์ดโพสต์หมวด quiz โชว์ใบประกาศเต็มกรอบ (แตะ = ดูใบใหญ่เต็มจอ)
   ② โปรไฟล์: ตู้เก็บใบประกาศของผู้เล่น (ของตัวเอง = state.certs · ของเพื่อน = อ่านจากโพสต์ /feed)
   ③ วาดด้วย SVG viewBox เดียว (แนวตั้ง 700×1000) → ย่อ/ขยายคมทุกขนาด ไม่ต้องมีภาพหลายไซซ์

   🖼️ ภาพจากผู้ใช้ (ไม่มีก็ไม่พัง — ใต้ภาพมีกรอบ/ตราแบบเวกเตอร์รออยู่แล้ว):
     img/cert/paper.png = กระดาษ+กรอบหรู 700×1000 (แนวตั้ง) (เว้นกลางว่างให้ระบบพิมพ์ข้อความ)
     img/cert/logo.png  = โลโก้ Vocab World สี่เหลี่ยมจัตุรัส พื้นโปร่ง
   (สเปก+prompt สร้างภาพทั้งสอง: handoff/CERT_ART.md)

   ⚠️ ชื่อที่พิมพ์บนใบ = ชื่อเล่น + 🆔 + สัญลักษณ์ระดับชั้นเท่านั้น (กฎคุ้มครองเด็ก — ห้ามชื่อจริง)
   ============================================================ */

const CERT_MAX = 300;                    // เก็บใบประกาศในเซฟได้กี่ใบ (ใหม่สุดก่อน)
const CERT_ISSUER_EN = 'VOCAB WORLD';
const CERT_MONTHS = ['January','February','March','April','May','June',
                     'July','August','September','October','November','December'];

/* ---------- ชื่อภารกิจภาษาอังกฤษอย่างเป็นทางการ (คีย์ = id หมวดใน js/data/vocab.js) ---------- */
const CERT_TOPIC_EN = {
  animals:'Animals', food:'Food & Fruits', colors:'Colours', body:'Parts of the Body',
  family:'Family & People', nature:'Nature', things:'Everyday Things & Places',
  actions:'Verbs & Feelings',
  b2_school:'Our Classroom', b2_days:'Days & Time', b2_weather:'Weather & Seasons',
  b2_animals2:'Animals of the World', b2_verbs:'Useful Verbs',
  b2_clothes:'Clothes & Accessories', b2_numbers:'Numbers & Quantities',
  b2_fruits:'Fruits & Vegetables',
  b3_jobs:'Jobs & Occupations', b3_places:'Places in Town', b3_sports:'Sports & Hobbies',
  b3_health:'Health & Well-being', b3_travel:'Travel & Transport',
  b3_feelings:'Feelings & Emotions', b3_house:'Around the House',
  b3_verbs2:'Verbs for Thinking',
  b4_environment:'The Environment', b4_technology:'Technology',
  b4_school2:'Student Life', b4_adjectives:'Adjectives',
  b4_verbs3:'Intermediate Verbs', b4_society:'Society & Community',
  b4_character:'Moods & Character', b4_work:'The World of Work',
  b5_academic:'Academic Vocabulary', b5_abstract:'Abstract Ideas', b5_economy:'Economy',
  b5_science:'Advanced Science', b5_verbs4:'Advanced Verbs', b5_media:'Media & News',
  b5_character2:'Personality', b5_global:'The World & the Future',
};
/* ป้ายระดับชั้นไทย (DICT_BAND_MANIFEST[b].label) → อังกฤษ */
const CERT_LEVEL_EN = {
  'ป.1–ป.2':'Grade 1–2', 'ป.3–ป.4':'Grade 3–4', 'ป.5–ป.6':'Grade 5–6',
  'ม.1–ม.3':'Grade 7–9', 'ม.4–ม.6':'Grade 10–12',
};
/* คลังศัพท์ขั้นสูงแยกหมวด (BAND_ADV_MANIFEST[].label) → อังกฤษ */
const CERT_ADV_EN = {'ศัพท์วิชาการ':'Academic Vocabulary', 'ศัพท์ธุรกิจ':'Business Vocabulary',
  'ศัพท์วิทยาศาสตร์':'Science Vocabulary', 'ศัพท์ท่องเที่ยว':'Travel Vocabulary',
  'ศัพท์การแพทย์':'Medical Vocabulary'};
/* 🏅 โหมดสอบใหญ่ (รอบ 773): ระดับสอบไทย → อังกฤษ · ใบประกาศคนละใบต่อระดับ (c.big = ชื่อระดับอังกฤษ) */
const CERT_BIG_LV = {'ต้น':'Foundation', 'กลาง':'Intermediate', 'สูง':'Expert'};

/* แผนที่ "ชื่อหมวดไทย → id" สร้างครั้งเดียวจาก VOCAB_BANDS (ใช้ตอนอ่านโพสต์ของเพื่อน) */
let __certByTh = null;
function certThIndex(){
  if(__certByTh) return __certByTh;
  __certByTh = {};
  if(typeof VOCAB_BANDS !== 'undefined')
    VOCAB_BANDS.forEach(b=>b.cats.forEach(c=>{ __certByTh[c.name] = c.id; }));
  return __certByTh;
}

/* ชื่อหมวดไทย → {t:ชื่ออังกฤษทางการ, lv:ระดับ(อังกฤษ)} — ใช้ได้ทั้งตอนออกใบและตอนอ่านโพสต์เพื่อน */
function certTitleOf(thName){
  const th = String(thName || '').trim();
  const id = certThIndex()[th];
  if(id && CERT_TOPIC_EN[id]) return {t:CERT_TOPIC_EN[id], lv:'Vocabulary Examination'};
  let m = th.match(/^(.+?)\s*ชุดที่\s*(\d+)$/);            // "ป.1–ป.2 ชุดที่ 11"
  if(m) return {t:`Vocabulary Set ${m[2]}`, lv:(CERT_LEVEL_EN[m[1].trim()] || m[1].trim()) + ' Level'};
  m = th.match(/^(.+?)\s*สอบซ่อม\s*(\d+)\s*ชุด$/);         // "ป.3–ป.4 สอบซ่อม 3 ชุด"
  if(m) return {t:`Retake Examination · ${m[2]} Sets`, lv:(CERT_LEVEL_EN[m[1].trim()] || m[1].trim()) + ' Level'};
  m = th.match(/^คลังศัพท์\s*(.+)$/);                       // "คลังศัพท์ ม.1–ม.3"
  if(m) return {t:'Core Vocabulary Collection', lv:(CERT_LEVEL_EN[m[1].trim()] || m[1].trim()) + ' Level'};
  // 🏅 สอบใหญ่คลังขั้นสูง "ศัพท์วิชาการ · สอบใหญ่ระดับกลาง" (bandAdvExamName ใน js/bandadv.js)
  m = th.match(/^(.+?)\s*·\s*สอบใหญ่ระดับ(ต้น|กลาง|สูง)$/);
  if(m){
    const en = CERT_BIG_LV[m[2]];
    return {t:CERT_ADV_EN[m[1].trim()] || m[1].trim(), lv:en + ' Level', big:en};
  }
  if(CERT_ADV_EN[th]) return {t:CERT_ADV_EN[th], lv:'Advanced Vocabulary'};
  if(th === 'ทบทวนคำของหนู') return {t:'My Word Book Review', lv:'Personal Vocabulary Review'};
  return {t:'English Vocabulary', lv:'Vocabulary Examination'};
}

/* ---------- เลขที่ใบประกาศ: คงที่ตลอดสำหรับ (เจ้าของ+หมวด+วัน) ---------- */
function certSerial(c, uid){
  const src = String(uid || (typeof onlineKey === 'function' ? onlineKey() : '')) + '|' + (c.id || c.t);
  let h = 0;
  for(let i = 0; i < src.length; i++){ h = (h * 31 + src.charCodeAt(i)) >>> 0; }
  const d = new Date(c.ts || Date.now());
  const ymd = `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`;
  return `VW-${ymd}-${h.toString(36).toUpperCase().slice(-4).padStart(4,'0')}`;
}
function certDateEN(ts){
  const d = new Date(ts || Date.now());
  return `${d.getDate()} ${CERT_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/* ---------- 🥇 ระดับใบตามเปอร์เซ็นต์คะแนน (รอบ 726 ผู้ใช้สั่ง) — เฉพาะใบสอบผ่านปกติ
   ใบ mastery (c.gold ครบทุกชุด) คะแนนเต็มเสมออยู่แล้ว จึงตกเป็น 'gold' โดยธรรมชาติ ไม่ต้องคิดแยก
   100% = ทอง · ≥90% = เงิน · ที่เหลือ (ผ่านขั้นต่ำ 80% ตาม passMark ใน finishQuiz) = ทองแดง ---------- */
function certTier(c){
  if(!c || !c.tt) return 'gold';
  const pct = c.sc / c.tt;
  if(pct >= 1) return 'gold';
  if(pct >= 0.9) return 'silver';
  return 'bronze';
}
const CERT_TIER_META = {
  gold:  {label:'GOLD',   emoji:'🥇'},
  silver:{label:'SILVER', emoji:'🥈'},
  bronze:{label:'BRONZE', emoji:'🥉'},
};
/* รอบ 759: ภาพโล่จริงแยกโทนโลหะต่อระดับ (ตัดโทนจาก logo.png ต้นฉบับ ด้วย scratchpad/cert_logo_tone.py) */
const CERT_LOGO_SRC = {
  gold:  'img/cert/logo.png',
  silver:'img/cert/logo_silver.png',
  bronze:'img/cert/logo_bronze.png',
};

/* ============================================================
   💾 คลังใบประกาศในเซฟ (state.certs) — 1 ใบต่อ 1 หมวด (สอบซ้ำ = อัปเดตคะแนนดีที่สุด)
   ============================================================ */
function certAward(cat, score, total, sec){
  if(typeof state === 'undefined' || !cat) return null;
  if(!Array.isArray(state.certs)) state.certs = [];
  const ti = certTitleOf(cat.name);
  const old = state.certs.find(x=>x.id === cat.id);
  if(old){
    old.n = (old.n || 1) + 1;                       // สอบผ่านซ้ำกี่ครั้ง
    if(score / total > old.sc / old.tt){
      old.sc = score; old.tt = total; old.ts = Date.now();
      if(sec) old.sec = sec;                        // ⏱️ คะแนนดีขึ้น = เวลาของรอบนั้นขึ้นใบด้วย
    }else if(sec && score / total === old.sc / old.tt && (!old.sec || sec < old.sec)){
      old.sec = sec; old.ts = Date.now();           // ⏱️ คะแนนเท่าเดิมแต่เร็วกว่า = อัปเดตสถิติเวลาบนใบ
    }
    return old;
  }
  const c = {id:cat.id, th:cat.name, t:ti.t, lv:ti.lv, sc:score, tt:total, ts:Date.now(), n:1};
  if(ti.big) c.big = ti.big;                        // 🏅 ใบสอบใหญ่ — วาดต่างจากใบสอบ 10 ข้อ (certSVG)
  if(sec) c.sec = sec;                              // ⏱️ รอบ 777: เวลาที่ใช้สอบ (วินาที) — พิมพ์บนใบ
  state.certs.unshift(c);
  if(state.certs.length > CERT_MAX) state.certs.length = CERT_MAX;
  return c;
}
/* ใบประกาศของเราทั้งหมด (ใหม่สุดก่อน) */
function certMine(){
  if(typeof state === 'undefined' || !Array.isArray(state.certs)) return [];
  return state.certs.slice().sort((a,b)=>(b.ts || 0) - (a.ts || 0));
}
/* ---------- 👑 ใบประกาศ Gold — ให้เมื่อผ่านครบ "ทุกชุด" ของระดับ (dictband.js bandCheckComplete)
   คนละใบกับใบสอบผ่านรายชุด (id ต่างกัน) · c.gold=true ทำให้ certSVG วาดสไตล์ต่างออกไป
   sc/tt = จำนวนชุดที่ผ่าน/ทั้งหมด (ครบเสมอตอนออกใบ) · words = จำนวนคำรวมทั้งระดับ ---------- */
function certAwardGold(b, setsCount, wordsCount){
  if(typeof state === 'undefined') return null;
  if(!Array.isArray(state.certs)) state.certs = [];
  const label = (typeof DICT_BAND_MANIFEST !== 'undefined' && DICT_BAND_MANIFEST[b]) ? DICT_BAND_MANIFEST[b].label : '';
  const id = 'bandgold' + b;
  const old = state.certs.find(x=>x.id === id);
  if(old){                                            // ผ่านซ้ำ (แทบไม่เกิด แต่กันไว้) — แค่รีเฟรชวันที่
    old.ts = Date.now();
    return old;
  }
  const c = {id, th:label, t:'Complete Vocabulary Mastery',
    lv:(CERT_LEVEL_EN[label] || label) + ' Level', sc:setsCount, tt:setsCount,
    words:wordsCount, ts:Date.now(), n:1, gold:true};
  state.certs.unshift(c);
  if(state.certs.length > CERT_MAX) state.certs.length = CERT_MAX;
  return c;
}
/* ---------- 👑 ใบประกาศ Supreme (รอบ 779) — ให้เมื่อสอบใหญ่ระดับ "สูง" (badvx_<หมวด>_expert)
   ผ่านครบทุกหมวดใน BAND_ADV_MANIFEST (bandAdvCheckSupreme ใน js/bandadv.js เรียกตอน onPass ของระดับสูง)
   คนละใบกับ certAwardGold (นั่นคือครบทุกชุดของ "1 ระดับชั้น DICT_BAND" — อันนี้คือครบทุก "หมวดคลังขั้นสูง")
   c.supreme=true ทำให้ certSVG วาดสไตล์พิเศษเหมือน gold (โทนแดง/มงกุฎ) แต่ข้อความคนละชุด ---------- */
function certAwardAdvSupreme(catCount){
  if(typeof state === 'undefined') return null;
  if(!Array.isArray(state.certs)) state.certs = [];
  const id = 'advsupreme';
  const old = state.certs.find(x=>x.id === id);
  if(old){                                            // ผ่านซ้ำ (แทบไม่เกิด แต่กันไว้) — แค่รีเฟรชวันที่
    old.ts = Date.now();
    return old;
  }
  const c = {id, th:'All Advanced Categories · Expert Level', t:'Grand Vocabulary Champion',
    sc:catCount, tt:catCount, ts:Date.now(), n:1, supreme:true};
  state.certs.unshift(c);
  if(state.certs.length > CERT_MAX) state.certs.length = CERT_MAX;
  return c;
}
/* 🔁 เซฟเก่าที่สอบผ่านไปก่อนมีระบบนี้ → สร้างใบย้อนหลังจาก quizLog (เรียกครั้งเดียวตอนโหลด) */
function certBackfill(){
  if(typeof state === 'undefined') return;
  if(!Array.isArray(state.certs)) state.certs = [];
  if(state.certsFilled) return;
  const byCat = {};
  (state.quizLog || []).forEach(l=>{
    if(!l || !l.passed) return;
    const cur = byCat[l.cat];
    if(!cur || (l.score / l.total) > (cur.score / cur.total)) byCat[l.cat] = l;
    if(cur) cur.n = (cur.n || 1) + 1;
  });
  const have = {};
  state.certs.forEach(c=>{ have[c.id] = 1; });
  const add = [];
  for(const id in byCat){
    if(have[id]) continue;
    const l = byCat[id];
    const th = certCatNameById(id);
    const ti = certTitleOf(th);
    add.push({id, th, t:ti.t, lv:ti.lv, sc:l.score, tt:l.total, ts:l.ts || Date.now(), n:l.n || 1});
  }
  if(add.length){
    state.certs = add.concat(state.certs).sort((a,b)=>(b.ts||0)-(a.ts||0)).slice(0, CERT_MAX);
  }
  state.certsFilled = true;
  if(typeof saveState === 'function') saveState();
}
/* id หมวด → ชื่อไทย (เท่าที่รู้จักโดยไม่ต้องโหลดคลังศัพท์ใหญ่) */
function certCatNameById(id){
  const s = String(id || '');
  if(typeof VOCAB_BANDS !== 'undefined'){
    for(const b of VOCAB_BANDS){ const c = b.cats.find(x=>x.id === s); if(c) return c.name; }
  }
  let m = s.match(/^band(\d+)s(\d+)$/);
  const lab = b=>(typeof DICT_BAND_MANIFEST !== 'undefined' && DICT_BAND_MANIFEST[b]) ? DICT_BAND_MANIFEST[b].label : '';
  if(m) return `${lab(m[1])} ชุดที่ ${m[2]}`;
  m = s.match(/^band(\d+)retake$/);
  if(m) return `${lab(m[1])} สอบซ่อม`;
  m = s.match(/^band(\d+)$/);
  if(m) return `คลังศัพท์ ${lab(m[1])}`;
  m = s.match(/^badvx_(.+)_(found|inter|expert)$/);                 // 🏅 สอบใหญ่ (รอบ 773)
  if(m && typeof BAND_ADV_MANIFEST !== 'undefined' && BAND_ADV_MANIFEST[m[1]] && typeof BAND_ADV_EXAM !== 'undefined'){
    const e = BAND_ADV_EXAM.find(x=>x.k === m[2]);
    if(e) return bandAdvExamName(BAND_ADV_MANIFEST[m[1]].label, e);
  }
  m = s.match(/^badv_(.+)$/);
  if(m && typeof BAND_ADV_MANIFEST !== 'undefined' && BAND_ADV_MANIFEST[m[1]]) return BAND_ADV_MANIFEST[m[1]].label;
  if(s === 'vbreview') return 'ทบทวนคำของหนู';
  return 'คำศัพท์ภาษาอังกฤษ';
}

/* ---------- อ่านใบประกาศจากโพสต์ในฟีด (ของเพื่อนก็เห็น — ไม่ต้องเพิ่มโซนใน DB) ----------
   ข้อความโพสต์: "สอบผ่านหมวด<ชื่อหมวด> <ถูก>/<ทั้งหมด> ข้อ 📝" (ดู finishQuiz ใน js/game.js) */
function certFromPost(it){
  if(!it || it.c !== 'quiz') return null;
  const tx = String(it.tx || '');
  const m = tx.match(/สอบผ่านหมวด(.+?)\s+(\d+)\s*\/\s*(\d+)\s*ข้อ/);
  if(!m) return null;
  const ti = certTitleOf(m[1]);
  const mt = tx.match(/⏱️\s*(\d+):([0-5]\d)/);      // ⏱️ รอบ 777: เวลาที่ใช้ (มีเฉพาะข้อสอบใหญ่)
  return {id:'post_' + (it.key || it.ts || 0), th:m[1].trim(), t:ti.t, lv:ti.lv, big:ti.big,
          sc:Number(m[2]), tt:Number(m[3]), ts:it.ts || Date.now(),
          sec:mt ? Number(mt[1]) * 60 + Number(mt[2]) : 0,
          who:it.n, uid:it.u, grade:it.g || ''};
}

/* ============================================================
   🖨️ วาดใบประกาศเป็น SVG (viewBox 1000×700 — ย่อ/ขยายคมเสมอ)
   opt.full = ฉบับเต็ม (ดูใบใหญ่) · ไม่ใส่ = ฉบับย่อ ตัวใหญ่อ่านออกในกรอบเล็ก
   ============================================================ */
let __certSeq = 0;
function certXML(s){
  return String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
/* ชื่อ/หัวข้อยาว = ลดขนาดตัวอักษรให้อยู่ในกรอบ (ไม่ตัดคำทิ้ง) */
function certFit(txt, base, maxW){
  const n = String(txt || '').length || 1;
  return Math.max(20, Math.min(base, Math.round(maxW / (n * 0.56))));
}
/* ผู้รับใบ: ชื่อเล่น + 🆔 + สัญลักษณ์ระดับชั้น (กฎคุ้มครองเด็ก — ไม่มีชื่อจริง/ตัวเลขชั้น) */
function certHolder(c){
  const meUid = (typeof onlineKey === 'function') ? onlineKey() : '';
  const uid = c.uid || meUid;
  let name = c.who || (typeof state !== 'undefined' && state.student ? state.student.name : '') || 'ผู้เล่น';
  if(typeof splitNameBadges === 'function') name = splitNameBadges(name).name;
  const grade = (typeof gradeOf === 'function') ? gradeOf(uid, c.grade || '') : (c.grade || '');
  const gs = (typeof gradeSymbol === 'function') ? gradeSymbol(grade) : null;
  const id = (typeof friendCode === 'function' && uid) ? 'ID ' + friendCode(String(uid)) : '';
  return {name, id, mark:gs ? gs.sym : '', markTxt:gs ? (gs.cat || '') : '', uid};
}
function certSVG(c, opt){
  opt = opt || {};
  const full = !!opt.full;
  const gold = !!c.gold;                              // 👑 ใบครบทุกชุดของระดับ — โทนสี/ข้อความต่างจากใบสอบผ่านรายชุด
  const supreme = !!c.supreme;                        // 👑 รอบ 779: ใบครบทุกหมวดสอบใหญ่ระดับสูง — โทนเดียวกับ gold แต่ข้อความคนละชุด
  const u = 'cw' + (++__certSeq);
  const h = certHolder(c);
  const name  = certXML(h.name);
  const topic = certXML(c.t || 'English Vocabulary');
  const th    = certXML(c.th || '');
  const pct   = c.tt ? Math.round(c.sc / c.tt * 100) : 0;
  const perfect = c.tt && c.sc >= c.tt;
  const nameFs  = certFit(h.name, full ? 64 : 80, 560);
  const topicFs = certFit(c.t,    full ? 48 : 62, 560);   // 560 (ไม่ใช่ 600) — เผื่อ letter-spacing 1 ไม่ให้ชื่อยาว เช่น "Academic Vocabulary" ชนกรอบทอง (วัดพบรอบ 773)
  /* 🏅 รอบ 773: ใบ "สอบใหญ่" (c.big = Foundation/Intermediate/Expert) — บรรทัดใต้หัวข้อโชว์ระดับ+จำนวนข้อ
     เป็นภาษาอังกฤษแทนชื่อไทย และเปลี่ยนคำประกาศให้เห็นชัดว่าเป็นข้อสอบใหญ่คนละใบกับสอบ 10 ข้อ
     ชื่อไทยยาว (เช่น "ศัพท์วิทยาศาสตร์ · สอบใหญ่ระดับกลาง") ก็ยังหดพอดีกรอบด้วย certFit เหมือนกัน */
  const big     = c.big || '';
  const subTxt  = big ? `${big} Level · ${c.tt} Questions` : (c.th || '');
  const subFs   = certFit(subTxt, full ? 25 : 32, 580);
  const sub     = certXML(subTxt);
  /* ⏱️ รอบ 777: เวลาที่ใช้สอบ — ต่อท้ายบรรทัดวันที่ (ไม่แทรกบรรทัดใหม่ ใบแน่นอยู่แล้ว) */
  const secTxt  = c.sec ? `${Math.floor(c.sec/60)}:${String(c.sec % 60).padStart(2,'0')}` : '';
  /* 👑 รอบ 779: ใบ Supreme (c.supreme) — th เป็นข้อความอังกฤษยาวกว่าเดิม (gold ใช้ป้ายชั้นสั้น ๆ) หดด้วย certFit กันล้นกรอบ */
  const thFs    = certFit(c.th, full ? 25 : 30, 580);
  const passLn  = big ? 'has passed the grand vocabulary examination in' : 'has passed the examination in';
  const passLnF = big ? 'has successfully passed the grand vocabulary examination in'
                      : 'has successfully passed the vocabulary examination in';
  const accent  = (gold || supreme) ? '#7a1f2a' : '#123a63'; // สีชื่อ/ตัวเลขเด่น — Gold(mastery)/Supreme ใช้แดงเลือดหมูแทนน้ำเงิน
  const crestGlyph = (gold || supreme) ? '♛' : '★';
  // 🥇 รอบ 726: ระดับใบ (ทอง/เงิน/ทองแดง) — เฉพาะใบสอบผ่านปกติ (mastery/supreme แดงมีโทนของตัวเองอยู่แล้ว)
  const tier = (gold || supreme) ? 'gold' : certTier(c);
  const tm = CERT_TIER_META[tier];
  const ringClr = gold ? '#8a2331' : (tier === 'silver' ? '#8a93a0' : tier === 'bronze' ? '#a9672f' : '#c8a13c');
  const sealStroke = gold ? '#5e1420' : (tier === 'silver' ? '#5a6169' : tier === 'bronze' ? '#5e3814' : '#a8801f');
  const shieldStops = tier === 'silver'
    ? `<stop offset="0" stop-color="#f4f5f7"/><stop offset=".28" stop-color="#b7bec7"/><stop offset=".55" stop-color="#ffffff"/><stop offset=".78" stop-color="#8b93a0"/><stop offset="1" stop-color="#d9dee4"/>`
    : tier === 'bronze'
    ? `<stop offset="0" stop-color="#e7b489"/><stop offset=".28" stop-color="#a86a35"/><stop offset=".55" stop-color="#f2caa0"/><stop offset=".78" stop-color="#8a5624"/><stop offset="1" stop-color="#c98a52"/>`
    : `<stop offset="0" stop-color="#f3dd9a"/><stop offset=".28" stop-color="#c8a13c"/><stop offset=".55" stop-color="#f7ecc4"/><stop offset=".78" stop-color="#b98f2c"/><stop offset="1" stop-color="#e8cd7e"/>`;
  const sealTierStops = tier === 'silver'
    ? `<stop offset="0" stop-color="#eef0f3"/><stop offset=".6" stop-color="#aab0b8"/><stop offset="1" stop-color="#757b82"/>`
    : tier === 'bronze'
    ? `<stop offset="0" stop-color="#ecb98a"/><stop offset=".6" stop-color="#a86a35"/><stop offset="1" stop-color="#6e431c"/>`
    : `<stop offset="0" stop-color="#f6e2a4"/><stop offset=".6" stop-color="#d5ab3f"/><stop offset="1" stop-color="#a8801f"/>`;

  /* กรอบ/กระดาษแบบเวกเตอร์ = ตัวสำรองเมื่อยังไม่มี img/cert/paper.png (มีไฟล์แล้วภาพจะทับชั้นนี้) */
  const frame = `
    <rect width="700" height="1000" fill="url(#${u}pap)"/>
    <rect width="700" height="1000" fill="url(#${u}ray)" opacity=".55"/>
    <rect x="14" y="14" width="672" height="972" rx="6" fill="none" stroke="url(#${u}gold)" stroke-width="13"/>
    ${(gold || supreme) ? `<rect x="24" y="24" width="652" height="952" rx="5" fill="none" stroke="${ringClr}" stroke-width="3" opacity=".85"/>` : ''}
    <rect x="27" y="27" width="646" height="946" rx="4" fill="none" stroke="#b9922f" stroke-width="1.6" opacity=".85"/>
    <rect x="38" y="38" width="624" height="924" rx="3" fill="none" stroke="#d9be6a" stroke-width="3.5" opacity=".9"/>
    ${[[38,38,1,1],[662,38,-1,1],[38,962,1,-1],[662,962,-1,-1]].map(p=>`
      <g transform="translate(${p[0]},${p[1]}) scale(${p[2]},${p[3]})" fill="none" stroke="url(#${u}gold)" stroke-width="4">
        <path d="M0 62 C0 22 22 0 62 0"/>
        <path d="M10 74 C10 34 34 10 74 10" stroke-width="2" opacity=".75"/>
        <circle cx="30" cy="30" r="5.5" fill="#c8a13c" stroke="none"/>
      </g>`).join('')}`;

  /* ตราประทับทอง (มุมล่างซ้าย) */
  const seal = (x, y, r)=>`
    <g transform="translate(${x},${y})">
      ${Array.from({length:24}, (_, i)=>{
        const a = i * Math.PI / 12;
        return `<line x1="${(Math.cos(a)*r*0.86).toFixed(1)}" y1="${(Math.sin(a)*r*0.86).toFixed(1)}"
                 x2="${(Math.cos(a)*r*1.12).toFixed(1)}" y2="${(Math.sin(a)*r*1.12).toFixed(1)}"
                 stroke="${ringClr}" stroke-width="${i % 2 ? 3 : 6}" stroke-linecap="round" opacity=".92"/>`;
      }).join('')}
      <circle r="${r*0.9}" fill="url(#${u}seal)" stroke="${sealStroke}" stroke-width="2"/>
      <circle r="${r*0.72}" fill="none" stroke="#fff6dc" stroke-width="1.6" opacity=".8"/>
      <text y="${-r*0.16}" text-anchor="middle" font-size="${r*0.5}" fill="#fff8e4">${crestGlyph}</text>
      <text y="${r*0.42}" text-anchor="middle" font-size="${r*0.27}" font-family="Georgia,serif"
        font-weight="bold" fill="#fff8e4" letter-spacing="1.5">VW</text>
    </g>`;

  /* ตราสัญลักษณ์เวกเตอร์ = โล่ (ใต้ img/cert/logo.png — ไม่มีไฟล์ก็ยังสวย)
     รอบ 725 (ผู้ใช้: "เปลี่ยนจากวงกลมเป็นทรงโล่ เท่ ๆ สง่างาม"): โล่ heater shield
     ขอบทองหนา + สนามน้ำเงินเข้ม + ดาว/ลูกโลก/หนังสือเปิด · สูงกว่ากว้าง = ดูสง่า
     🥇 รอบ 726: ขอบโล่ใช้ ${u}shield (แยกจาก ${u}gold ของกรอบใบทั้งหน้า) → ระบายสีตามระดับ (ทอง/เงิน/ทองแดง)
     โดยไม่กระทบกรอบใบ — กรอบใบยังทองเสมอทุกระดับ */
  const emblem = (x, y, s)=>`
    <g transform="translate(${x},${y}) scale(${s})">
      <path d="M-56 -82 H56 A10 10 0 0 1 66 -72 V4 C66 54 20 80 0 94 C-20 80 -66 54 -66 4 V-72 A10 10 0 0 1 -56 -82 Z"
        fill="url(#${u}shield)" stroke="#8a6a1f" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M-45 -69 H45 A8 8 0 0 1 53 -61 V2 C53 43 16 65 0 78 C-16 65 -53 43 -53 2 V-61 A8 8 0 0 1 -45 -69 Z"
        fill="#123a63" stroke="#f2dfa4" stroke-width="2" stroke-linejoin="round"/>
      <path d="M-45 -69 H0 V78 C-16 65 -53 43 -53 2 V-61 A8 8 0 0 1 -45 -69 Z" fill="#ffffff" opacity=".07"/>
      <text y="-38" text-anchor="middle" font-size="26" fill="#f2dfa4">★</text>
      <g transform="translate(0,6)" fill="none" stroke="#8fd4ff" stroke-width="2.3">
        <circle r="26"/>
        <ellipse rx="12" ry="26"/>
        <path d="M-26 0 H26 M-23.5 -12.5 H23.5 M-23.5 12.5 H23.5" stroke-width="1.7" opacity=".8"/>
      </g>
      <path d="M-29 45 q29 -12 29 0 q0 -12 29 0 v10 q-29 -12 -29 0 q0 -12 -29 0 z"
        fill="#f7e6b4" stroke="#a8801f" stroke-width="1.5" stroke-linejoin="round"/>
    </g>`;

  const wordsN = certXML(typeof fmtNum === 'function' ? fmtNum(c.words || 0) : String(c.words || 0));
  const body = full ? (supreme ? `
    <text x="350" y="432" text-anchor="middle" font-size="27" font-style="italic" fill="#5d4a2a"
      font-family="Georgia,'Times New Roman',serif">This is to certify that</text>
    <text x="350" y="504" text-anchor="middle" font-size="${nameFs}" font-weight="bold" fill="${accent}">${name}</text>
    <line x1="150" y1="524" x2="550" y2="524" stroke="${ringClr}" stroke-width="1.6" opacity=".8"/>
    <text x="350" y="554" text-anchor="middle" font-size="22" fill="#6b5836"
      font-family="Georgia,'Times New Roman',serif" letter-spacing="1">${certXML(h.id)}${h.mark ? '  ·  ' + certXML(h.markTxt) + ' ' + certXML(h.mark) : ''}</text>
    <text x="350" y="606" text-anchor="middle" font-size="22" fill="#5d4a2a"
      font-family="Georgia,'Times New Roman',serif">has passed the grand vocabulary examination at Expert Level in</text>
    <text x="350" y="672" text-anchor="middle" font-size="${topicFs}" font-weight="bold" fill="#8a6a1f"
      font-family="Georgia,'Times New Roman',serif" letter-spacing="1">${topic}</text>
    <text x="350" y="710" text-anchor="middle" font-size="${thFs}" fill="#6b5836"
      font-family="Georgia,'Times New Roman',serif">${th}</text>
    <text x="350" y="772" text-anchor="middle" font-size="25" fill="#4a3f2a"
      font-family="Georgia,'Times New Roman',serif">mastering all <tspan font-weight="bold" fill="${accent}">${c.tt}</tspan> advanced vocabulary categories <tspan fill="#a8801f" font-weight="bold">— Perfect</tspan></text>
    <text x="350" y="812" text-anchor="middle" font-size="23" fill="#6b5836"
      font-family="Georgia,'Times New Roman',serif">Awarded on ${certDateEN(c.ts)}</text>
    <text x="350" y="838" text-anchor="middle" font-size="17" fill="#8a7440"
      font-family="Georgia,'Times New Roman',serif" letter-spacing="1.2">Certificate No. ${certXML(certSerial(c, h.uid))}</text>
    ${seal(148, 888, 52)}
    <g>
      <line x1="250" y1="874" x2="530" y2="874" stroke="#8a7440" stroke-width="1.6"/>
      <text x="390" y="868" text-anchor="middle" font-size="26" fill="${accent}"
        font-family="Georgia,'Times New Roman',serif" font-style="italic">Vocab World Academy</text>
      <text x="390" y="900" text-anchor="middle" font-size="18" fill="#6b5836"
        font-family="Georgia,'Times New Roman',serif">Head of Vocabulary Studies</text>
    </g>
  ` : gold ? `
    <text x="350" y="432" text-anchor="middle" font-size="27" font-style="italic" fill="#5d4a2a"
      font-family="Georgia,'Times New Roman',serif">This is to certify that</text>
    <text x="350" y="504" text-anchor="middle" font-size="${nameFs}" font-weight="bold" fill="${accent}">${name}</text>
    <line x1="150" y1="524" x2="550" y2="524" stroke="${ringClr}" stroke-width="1.6" opacity=".8"/>
    <text x="350" y="554" text-anchor="middle" font-size="22" fill="#6b5836"
      font-family="Georgia,'Times New Roman',serif" letter-spacing="1">${certXML(h.id)}${h.mark ? '  ·  ' + certXML(h.markTxt) + ' ' + certXML(h.mark) : ''}</text>
    <text x="350" y="606" text-anchor="middle" font-size="22" fill="#5d4a2a"
      font-family="Georgia,'Times New Roman',serif">has completed the entire vocabulary curriculum of</text>
    <text x="350" y="672" text-anchor="middle" font-size="${topicFs}" font-weight="bold" fill="#8a6a1f"
      font-family="Georgia,'Times New Roman',serif" letter-spacing="1">${topic}</text>
    <text x="350" y="710" text-anchor="middle" font-size="25" fill="#6b5836">${th} Level</text>
    <text x="350" y="772" text-anchor="middle" font-size="25" fill="#4a3f2a"
      font-family="Georgia,'Times New Roman',serif">mastering all <tspan font-weight="bold" fill="${accent}">${c.tt}</tspan> sets · <tspan font-weight="bold" fill="${accent}">${wordsN}</tspan> words <tspan fill="#a8801f" font-weight="bold">— Perfect</tspan></text>
    <text x="350" y="812" text-anchor="middle" font-size="23" fill="#6b5836"
      font-family="Georgia,'Times New Roman',serif">Awarded on ${certDateEN(c.ts)}</text>
    <text x="350" y="838" text-anchor="middle" font-size="17" fill="#8a7440"
      font-family="Georgia,'Times New Roman',serif" letter-spacing="1.2">Certificate No. ${certXML(certSerial(c, h.uid))}</text>
    ${seal(148, 888, 52)}
    <!-- 🩹 รอบ 733: ขยับลายเซ็นขึ้น+หดแคบลง — พิกัดเดิม (x=460 กว้างถึง x=620) คำนวณจากกรอบเวกเตอร์บางๆ
         พอ img/cert/paper.png ของจริง (ลายกรอบทองหนา+ลายก้านม้วนมุมล่าง) โหลดได้แล้ว (แก้บั๊ก git add รอบ 729)
         ข้อความเลยไปทับลายกรอบ/ลายมุมขวาล่างพอดี -->
    <g>
      <line x1="250" y1="874" x2="530" y2="874" stroke="#8a7440" stroke-width="1.6"/>
      <text x="390" y="868" text-anchor="middle" font-size="26" fill="${accent}"
        font-family="Georgia,'Times New Roman',serif" font-style="italic">Vocab World Academy</text>
      <text x="390" y="900" text-anchor="middle" font-size="18" fill="#6b5836"
        font-family="Georgia,'Times New Roman',serif">Head of Vocabulary Studies</text>
    </g>
  ` : `
    <text x="350" y="432" text-anchor="middle" font-size="27" font-style="italic" fill="#5d4a2a"
      font-family="Georgia,'Times New Roman',serif">This is to certify that</text>
    <text x="350" y="504" text-anchor="middle" font-size="${nameFs}" font-weight="bold" fill="${accent}">${name}</text>
    <line x1="150" y1="524" x2="550" y2="524" stroke="${ringClr}" stroke-width="1.6" opacity=".8"/>
    <text x="350" y="554" text-anchor="middle" font-size="22" fill="#6b5836"
      font-family="Georgia,'Times New Roman',serif" letter-spacing="1">${certXML(h.id)}${h.mark ? '  ·  ' + certXML(h.markTxt) + ' ' + certXML(h.mark) : ''}</text>
    <text x="350" y="606" text-anchor="middle" font-size="22" fill="#5d4a2a"
      font-family="Georgia,'Times New Roman',serif">${passLnF}</text>
    <text x="350" y="672" text-anchor="middle" font-size="${topicFs}" font-weight="bold" fill="#8a6a1f"
      font-family="Georgia,'Times New Roman',serif" letter-spacing="1">${topic}</text>
    <text x="350" y="710" text-anchor="middle" font-size="${subFs}" fill="#6b5836"
      font-family="${big ? "Georgia,'Times New Roman',serif" : 'inherit'}" letter-spacing="${big ? 1.5 : 0}">${sub}</text>
    <text x="350" y="772" text-anchor="middle" font-size="25" fill="#4a3f2a"
      font-family="Georgia,'Times New Roman',serif">with a score of <tspan font-weight="bold" fill="${accent}">${c.sc}/${c.tt}</tspan> (${pct}%) <tspan font-weight="bold" fill="${ringClr}">${tm.emoji} ${tm.label}</tspan></text>
    <text x="350" y="812" text-anchor="middle" font-size="23" fill="#6b5836"
      font-family="Georgia,'Times New Roman',serif">Awarded on ${certDateEN(c.ts)}${secTxt ? ` · completed in ${secTxt}` : ''}</text>
    <text x="350" y="838" text-anchor="middle" font-size="17" fill="#8a7440"
      font-family="Georgia,'Times New Roman',serif" letter-spacing="1.2">Certificate No. ${certXML(certSerial(c, h.uid))}</text>
    ${seal(148, 888, 52)}
    <!-- 🩹 รอบ 733: ขยับลายเซ็นขึ้น+หดแคบลง — พิกัดเดิม (x=460 กว้างถึง x=620) คำนวณจากกรอบเวกเตอร์บางๆ
         พอ img/cert/paper.png ของจริง (ลายกรอบทองหนา+ลายก้านม้วนมุมล่าง) โหลดได้แล้ว (แก้บั๊ก git add รอบ 729)
         ข้อความเลยไปทับลายกรอบ/ลายมุมขวาล่างพอดี -->
    <g>
      <line x1="250" y1="874" x2="530" y2="874" stroke="#8a7440" stroke-width="1.6"/>
      <text x="390" y="868" text-anchor="middle" font-size="26" fill="${accent}"
        font-family="Georgia,'Times New Roman',serif" font-style="italic">Vocab World Academy</text>
      <text x="390" y="900" text-anchor="middle" font-size="18" fill="#6b5836"
        font-family="Georgia,'Times New Roman',serif">Head of Vocabulary Studies</text>
    </g>
  `) : (supreme ? `
    <line x1="130" y1="386" x2="570" y2="386" stroke="${ringClr}" stroke-width="2" opacity=".75"/>
    <text x="350" y="482" text-anchor="middle" font-size="${nameFs}" font-weight="bold" fill="${accent}">${name}</text>
    <text x="350" y="540" text-anchor="middle" font-size="23" fill="#6b5836"
      font-family="Georgia,'Times New Roman',serif">has passed Expert Level exams in all</text>
    <text x="350" y="628" text-anchor="middle" font-size="${topicFs}" font-weight="bold" fill="#8a6a1f"
      font-family="Georgia,'Times New Roman',serif" letter-spacing="1">${topic}</text>
    <text x="350" y="676" text-anchor="middle" font-size="${thFs}" fill="#6b5836"
      font-family="Georgia,'Times New Roman',serif">${th}</text>
    <text x="350" y="770" text-anchor="middle" font-size="34" font-weight="bold" fill="${accent}"
      font-family="Georgia,'Times New Roman',serif">${c.tt} categories mastered</text>
    <text x="350" y="828" text-anchor="middle" font-size="30" fill="#6b5836"
      font-family="Georgia,'Times New Roman',serif">${certDateEN(c.ts)}</text>
    ${seal(350, 912, 56)}
  ` : gold ? `
    <line x1="130" y1="386" x2="570" y2="386" stroke="${ringClr}" stroke-width="2" opacity=".75"/>
    <text x="350" y="482" text-anchor="middle" font-size="${nameFs}" font-weight="bold" fill="${accent}">${name}</text>
    <text x="350" y="540" text-anchor="middle" font-size="24" fill="#6b5836"
      font-family="Georgia,'Times New Roman',serif">has mastered the full curriculum of</text>
    <text x="350" y="628" text-anchor="middle" font-size="${topicFs}" font-weight="bold" fill="#8a6a1f"
      font-family="Georgia,'Times New Roman',serif" letter-spacing="1">${topic}</text>
    <text x="350" y="676" text-anchor="middle" font-size="30" fill="#6b5836">${th} Level</text>
    <text x="350" y="770" text-anchor="middle" font-size="34" font-weight="bold" fill="${accent}"
      font-family="Georgia,'Times New Roman',serif">${c.tt} sets · ${wordsN} words</text>
    <text x="350" y="828" text-anchor="middle" font-size="30" fill="#6b5836"
      font-family="Georgia,'Times New Roman',serif">${certDateEN(c.ts)}</text>
    ${seal(350, 912, 56)}
  ` : `
    <line x1="130" y1="386" x2="570" y2="386" stroke="${ringClr}" stroke-width="2" opacity=".75"/>
    <text x="350" y="482" text-anchor="middle" font-size="${nameFs}" font-weight="bold" fill="${accent}">${name}</text>
    <text x="350" y="540" text-anchor="middle" font-size="27" fill="#6b5836"
      font-family="Georgia,'Times New Roman',serif">${passLn}</text>
    <text x="350" y="628" text-anchor="middle" font-size="${topicFs}" font-weight="bold" fill="#8a6a1f"
      font-family="Georgia,'Times New Roman',serif" letter-spacing="1">${topic}</text>
    <text x="350" y="676" text-anchor="middle" font-size="${subFs}" fill="#6b5836"
      font-family="${big ? "Georgia,'Times New Roman',serif" : 'inherit'}" letter-spacing="${big ? 1.5 : 0}">${sub}</text>
    <text x="350" y="730" text-anchor="middle" font-size="26" font-weight="bold" fill="${ringClr}"
      font-family="Georgia,'Times New Roman',serif" letter-spacing="1.5">${tm.emoji} ${tm.label}</text>
    <text x="350" y="782" text-anchor="middle" font-size="52" font-weight="bold" fill="${accent}"
      font-family="Georgia,'Times New Roman',serif">${c.sc}/${c.tt}${secTxt ? `<tspan font-size="30" fill="#6b5836">   ⏱ ${secTxt}</tspan>` : ''}</text>
    <text x="350" y="828" text-anchor="middle" font-size="30" fill="#6b5836"
      font-family="Georgia,'Times New Roman',serif">${certDateEN(c.ts)}</text>
    ${seal(350, 912, 56)}
  `);

  return `<svg class="cert-svg" viewBox="0 0 700 1000" xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid meet" role="img"
      aria-label="ประกาศนียบัตร ${certXML(c.t)} ของ ${name}">
    <defs>
      <linearGradient id="${u}pap" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#fffdf5"/><stop offset=".5" stop-color="#fdf3d9"/>
        <stop offset="1" stop-color="#f6e6c0"/>
      </linearGradient>
      <linearGradient id="${u}gold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#f3dd9a"/><stop offset=".28" stop-color="#c8a13c"/>
        <stop offset=".55" stop-color="#f7ecc4"/><stop offset=".78" stop-color="#b98f2c"/>
        <stop offset="1" stop-color="#e8cd7e"/>
      </linearGradient>
      <radialGradient id="${u}seal" cx=".35" cy=".3">
        ${(gold || supreme)
          ? `<stop offset="0" stop-color="#e8a6a0"/><stop offset=".6" stop-color="#a83a45"/><stop offset="1" stop-color="#6e1524"/>`
          : sealTierStops}
      </radialGradient>
      <radialGradient id="${u}ray" cx=".5" cy=".42">
        <stop offset="0" stop-color="#fffefa"/><stop offset="1" stop-color="#efdcae"/>
      </radialGradient>
      <linearGradient id="${u}shield" x1="0" y1="0" x2="1" y2="1">${shieldStops}</linearGradient>
    </defs>
    ${frame}
    <image href="img/cert/paper.png" xlink:href="img/cert/paper.png" x="0" y="0"
      width="700" height="1000" preserveAspectRatio="none"/>
    ${emblem(350, 156, 1.12)}
    <!-- 🥇 รอบ 726/759: ภาพจริงแทนโล่เวกเตอร์ — มีครบ 3 โทนแล้ว (logo.png ทอง · logo_silver.png · logo_bronze.png) -->
    <image href="${CERT_LOGO_SRC[tier]}" xlink:href="${CERT_LOGO_SRC[tier]}" x="262" y="58"
      width="176" height="196" preserveAspectRatio="xMidYMid meet"/>
    <text x="350" y="308" text-anchor="middle" font-size="46" font-weight="bold" fill="#8a6a1f"
      font-family="Georgia,'Times New Roman',serif" letter-spacing="7">${CERT_ISSUER_EN}</text>
    <text x="350" y="350" text-anchor="middle" font-size="${full ? 24 : 26}" fill="${(gold || supreme) ? accent : '#7a6431'}"
      font-family="Georgia,'Times New Roman',serif" letter-spacing="${full ? 3 : 2}">${supreme ? 'CERTIFICATE OF SUPREME EXCELLENCE'
        : gold ? 'CERTIFICATE OF EXCELLENCE' : big ? 'CERTIFICATE OF PROFICIENCY' : 'CERTIFICATE OF ACHIEVEMENT'}</text>
    ${body}
  </svg>`;
}

/* ป้ายทองบรรทัดเดียว — ใช้แทนใบเต็มเมื่อจอเตี้ยมาก (พื้นที่ในการ์ดเหลือ <~50px
   ย่อใบทั้งใบลงไปจะอ่านไม่ออก) · CSS สลับให้เองที่ @media (max-height:500px) */
function certChipHTML(c){
  if(c.supreme){
    return `<span class="cert-chip-sm cert-chip-gold"><b>👑 ${certXML(c.t)}</b>
      <small>${c.tt} categories · ${certXML(certDateEN(c.ts))}</small></span>`;
  }
  if(c.gold){
    return `<span class="cert-chip-sm cert-chip-gold"><b>👑 ${certXML(c.t)}</b>
      <small>${c.tt} sets · ${certXML(certDateEN(c.ts))}</small></span>`;
  }
  const tm = CERT_TIER_META[certTier(c)];              // 🥇 รอบ 726: เหรียญตามระดับแทนดาว/ไอคอนกลาง ๆ
  return `<span class="cert-chip-sm"><b>${tm.emoji} ${certXML(c.t)}${c.big ? ' · ' + certXML(c.big) : ''}</b>
    <small>${c.sc}/${c.tt} · ${certXML(certDateEN(c.ts))}</small></span>`;
}

/* ---------- 🔍 ดูใบใหญ่เต็มจอ (แตะที่ไหนก็ปิด · ไม่มี scrollbar ตามกฎทองข้อ 7) ---------- */
function openCertBig(c){
  if(!c) return;
  const lb = document.createElement('div');
  lb.className = 'cert-lightbox';
  lb.innerHTML = `<div class="clb-inner">
      <div class="clb-paper">${certSVG(c, {full:true})}</div>
      <div class="clb-cap">🎖️ ประกาศนียบัตรจาก Vocab World — เก็บไว้ในโปรไฟล์ของหนูแล้ว</div>
      <button class="clb-x" type="button" aria-label="ปิด">✕</button>
    </div>`;
  document.body.appendChild(lb);
  requestAnimationFrame(()=>lb.classList.add('on'));
  const close = ()=>{ lb.classList.remove('on'); setTimeout(()=>lb.remove(), 200); };
  lb.addEventListener('click', close);
  if(typeof sfx !== 'undefined' && sfx.select) sfx.select();
}
/* เปิดใบใหญ่จากคลังของเรา (ใช้ในโปรไฟล์) */
function openCertMine(i){
  const list = certMine();
  if(list[i]) openCertBig(list[i]);
}

/* ---------- 🗂️ แถบใบประกาศในหน้าโปรไฟล์ ----------
   คืน HTML อย่างเดียว · ผู้เรียกผูกปุ่มเองด้วย data-ci = index ใน list ที่ส่งมา
   (โปรไฟล์ตัวเอง list = certMine() · ของเพื่อน list = อ่านจากโพสต์ /feed) */
function certStripHTML(list, me){
  if(!list || !list.length){
    return `<div class="pl-none cert-none">${me
      ? 'ยังไม่มีใบประกาศ — สอบผ่านหมวดคำศัพท์ครั้งแรก รับใบประกาศใบแรกได้เลย 📝'
      : 'ยังไม่เห็นใบประกาศของผู้เล่นคนนี้ (เจ้าตัวต้องเปิดเผยกิจกรรม 📝 ในตั้งค่า)'}</div>`;
  }
  return list.map((c, i)=>`<button class="cert-mini${(c.gold || c.supreme) ? ' cert-mini-gold' : ''}" type="button" data-ci="${i}"
      title="${certXML(c.t)} — แตะดูใบใหญ่">
      ${certSVG(c)}
      <span class="cert-mini-cap">${(c.gold || c.supreme) ? '👑 ' : CERT_TIER_META[certTier(c)].emoji + ' '}${certXML(c.t)}${
        c.big ? ' · ' + certXML(c.big) : ''}${c.n > 1 ? ` ×${c.n}` : ''}</span>
    </button>`).join('');
}
/* ผูกปุ่มใบประกาศทุกใบในกล่องหนึ่ง ๆ → แตะแล้วเปิดใบใหญ่ */
function certBindStrip(box, list){
  if(!box) return;
  box.querySelectorAll('.cert-mini').forEach(b=>{
    b.addEventListener('click', ()=>{
      const c = list[Number(b.dataset.ci)];
      if(c) openCertBig(c);
    });
  });
}
