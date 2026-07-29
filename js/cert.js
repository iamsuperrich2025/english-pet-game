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
const CERT_ADV_EN = {'ศัพท์วิชาการ':'Academic Vocabulary', 'ศัพท์ธุรกิจ':'Business Vocabulary'};

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

/* ============================================================
   💾 คลังใบประกาศในเซฟ (state.certs) — 1 ใบต่อ 1 หมวด (สอบซ้ำ = อัปเดตคะแนนดีที่สุด)
   ============================================================ */
function certAward(cat, score, total){
  if(typeof state === 'undefined' || !cat) return null;
  if(!Array.isArray(state.certs)) state.certs = [];
  const ti = certTitleOf(cat.name);
  const old = state.certs.find(x=>x.id === cat.id);
  if(old){
    old.n = (old.n || 1) + 1;                       // สอบผ่านซ้ำกี่ครั้ง
    if(score / total > old.sc / old.tt){ old.sc = score; old.tt = total; old.ts = Date.now(); }
    return old;
  }
  const c = {id:cat.id, th:cat.name, t:ti.t, lv:ti.lv, sc:score, tt:total, ts:Date.now(), n:1};
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
  m = s.match(/^badv_(.+)$/);
  if(m && typeof BAND_ADV_MANIFEST !== 'undefined' && BAND_ADV_MANIFEST[m[1]]) return BAND_ADV_MANIFEST[m[1]].label;
  if(s === 'vbreview') return 'ทบทวนคำของหนู';
  return 'คำศัพท์ภาษาอังกฤษ';
}

/* ---------- อ่านใบประกาศจากโพสต์ในฟีด (ของเพื่อนก็เห็น — ไม่ต้องเพิ่มโซนใน DB) ----------
   ข้อความโพสต์: "สอบผ่านหมวด<ชื่อหมวด> <ถูก>/<ทั้งหมด> ข้อ 📝" (ดู finishQuiz ใน js/game.js) */
function certFromPost(it){
  if(!it || it.c !== 'quiz') return null;
  const m = String(it.tx || '').match(/สอบผ่านหมวด(.+?)\s+(\d+)\s*\/\s*(\d+)\s*ข้อ/);
  if(!m) return null;
  const ti = certTitleOf(m[1]);
  return {id:'post_' + (it.key || it.ts || 0), th:m[1].trim(), t:ti.t, lv:ti.lv,
          sc:Number(m[2]), tt:Number(m[3]), ts:it.ts || Date.now(),
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
  const u = 'cw' + (++__certSeq);
  const h = certHolder(c);
  const name  = certXML(h.name);
  const topic = certXML(c.t || 'English Vocabulary');
  const th    = certXML(c.th || '');
  const pct   = c.tt ? Math.round(c.sc / c.tt * 100) : 0;
  const perfect = c.tt && c.sc >= c.tt;
  const nameFs  = certFit(h.name, full ? 64 : 80, 560);
  const topicFs = certFit(c.t,    full ? 48 : 62, 600);
  const accent  = gold ? '#7a1f2a' : '#123a63';       // สีชื่อ/ตัวเลขเด่น — Gold ใช้แดงเลือดหมูแทนน้ำเงิน
  const ringClr = gold ? '#8a2331' : '#c8a13c';       // สีเส้นวงแหวนตราประทับ + กรอบชั้นใน
  const crestGlyph = gold ? '♛' : '★';

  /* กรอบ/กระดาษแบบเวกเตอร์ = ตัวสำรองเมื่อยังไม่มี img/cert/paper.png (มีไฟล์แล้วภาพจะทับชั้นนี้) */
  const frame = `
    <rect width="700" height="1000" fill="url(#${u}pap)"/>
    <rect width="700" height="1000" fill="url(#${u}ray)" opacity=".55"/>
    <rect x="14" y="14" width="672" height="972" rx="6" fill="none" stroke="url(#${u}gold)" stroke-width="13"/>
    ${gold ? `<rect x="24" y="24" width="652" height="952" rx="5" fill="none" stroke="${ringClr}" stroke-width="3" opacity=".85"/>` : ''}
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
      <circle r="${r*0.9}" fill="url(#${u}seal)" stroke="${gold ? '#5e1420' : '#a8801f'}" stroke-width="2"/>
      <circle r="${r*0.72}" fill="none" stroke="#fff6dc" stroke-width="1.6" opacity=".8"/>
      <text y="${-r*0.16}" text-anchor="middle" font-size="${r*0.5}" fill="#fff8e4">${crestGlyph}</text>
      <text y="${r*0.42}" text-anchor="middle" font-size="${r*0.27}" font-family="Georgia,serif"
        font-weight="bold" fill="#fff8e4" letter-spacing="1.5">VW</text>
    </g>`;

  /* ตราสัญลักษณ์เวกเตอร์ (ใต้ img/cert/logo.png — ไม่มีไฟล์ก็ยังสวย) */
  const emblem = (x, y, s)=>`
    <g transform="translate(${x},${y}) scale(${s})">
      <circle r="46" fill="url(#${u}seal)" stroke="#a8801f" stroke-width="3"/>
      <circle r="37" fill="#123a63" stroke="#f2dfa4" stroke-width="2"/>
      <ellipse rx="26" ry="26" fill="none" stroke="#8fd4ff" stroke-width="2" opacity=".9"/>
      <ellipse rx="12" ry="26" fill="none" stroke="#8fd4ff" stroke-width="2" opacity=".8"/>
      <path d="M-26 0 H26 M-23 -13 H23 M-23 13 H23" stroke="#8fd4ff" stroke-width="1.6" opacity=".75"/>
      <path d="M-27 22 q27 -11 27 0 q0 -11 27 0 v7 q-27 -11 -27 0 q0 -11 -27 0 z" fill="#f7e6b4" stroke="#a8801f" stroke-width="1.4"/>
    </g>`;

  const wordsN = certXML(typeof fmtNum === 'function' ? fmtNum(c.words || 0) : String(c.words || 0));
  const body = full ? (gold ? `
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
    <text x="350" y="846" text-anchor="middle" font-size="17" fill="#8a7440"
      font-family="Georgia,'Times New Roman',serif" letter-spacing="1.2">Certificate No. ${certXML(certSerial(c, h.uid))}</text>
    ${seal(148, 888, 52)}
    <g>
      <line x1="300" y1="912" x2="620" y2="912" stroke="#8a7440" stroke-width="1.6"/>
      <text x="460" y="906" text-anchor="middle" font-size="26" fill="${accent}"
        font-family="Georgia,'Times New Roman',serif" font-style="italic">Vocab World Academy</text>
      <text x="460" y="938" text-anchor="middle" font-size="18" fill="#6b5836"
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
      font-family="Georgia,'Times New Roman',serif">has successfully passed the vocabulary examination in</text>
    <text x="350" y="672" text-anchor="middle" font-size="${topicFs}" font-weight="bold" fill="#8a6a1f"
      font-family="Georgia,'Times New Roman',serif" letter-spacing="1">${topic}</text>
    <text x="350" y="710" text-anchor="middle" font-size="25" fill="#6b5836">${th}</text>
    <text x="350" y="772" text-anchor="middle" font-size="26" fill="#4a3f2a"
      font-family="Georgia,'Times New Roman',serif">with a score of <tspan font-weight="bold" fill="${accent}">${c.sc}/${c.tt}</tspan> (${pct}%)${perfect ? ' <tspan fill="#a8801f" font-weight="bold">— Perfect</tspan>' : ''}</text>
    <text x="350" y="812" text-anchor="middle" font-size="23" fill="#6b5836"
      font-family="Georgia,'Times New Roman',serif">Awarded on ${certDateEN(c.ts)}</text>
    <text x="350" y="846" text-anchor="middle" font-size="17" fill="#8a7440"
      font-family="Georgia,'Times New Roman',serif" letter-spacing="1.2">Certificate No. ${certXML(certSerial(c, h.uid))}</text>
    ${seal(148, 888, 52)}
    <g>
      <line x1="300" y1="912" x2="620" y2="912" stroke="#8a7440" stroke-width="1.6"/>
      <text x="460" y="906" text-anchor="middle" font-size="26" fill="${accent}"
        font-family="Georgia,'Times New Roman',serif" font-style="italic">Vocab World Academy</text>
      <text x="460" y="938" text-anchor="middle" font-size="18" fill="#6b5836"
        font-family="Georgia,'Times New Roman',serif">Head of Vocabulary Studies</text>
    </g>
  `) : (gold ? `
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
      font-family="Georgia,'Times New Roman',serif">has passed the examination in</text>
    <text x="350" y="628" text-anchor="middle" font-size="${topicFs}" font-weight="bold" fill="#8a6a1f"
      font-family="Georgia,'Times New Roman',serif" letter-spacing="1">${topic}</text>
    <text x="350" y="676" text-anchor="middle" font-size="32" fill="#6b5836">${th}</text>
    <text x="350" y="782" text-anchor="middle" font-size="52" font-weight="bold" fill="${accent}"
      font-family="Georgia,'Times New Roman',serif">${c.sc}/${c.tt}${perfect ? ' ★' : ''}</text>
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
        ${gold
          ? `<stop offset="0" stop-color="#e8a6a0"/><stop offset=".6" stop-color="#a83a45"/><stop offset="1" stop-color="#6e1524"/>`
          : `<stop offset="0" stop-color="#f6e2a4"/><stop offset=".6" stop-color="#d5ab3f"/><stop offset="1" stop-color="#a8801f"/>`}
      </radialGradient>
      <radialGradient id="${u}ray" cx=".5" cy=".42">
        <stop offset="0" stop-color="#fffefa"/><stop offset="1" stop-color="#efdcae"/>
      </radialGradient>
    </defs>
    ${frame}
    <image href="img/cert/paper.png" xlink:href="img/cert/paper.png" x="0" y="0"
      width="700" height="1000" preserveAspectRatio="none"/>
    ${emblem(350, 158, 1.35)}
    <image href="img/cert/logo.png" xlink:href="img/cert/logo.png" x="260" y="68"
      width="180" height="180" preserveAspectRatio="xMidYMid meet"/>
    <text x="350" y="308" text-anchor="middle" font-size="46" font-weight="bold" fill="#8a6a1f"
      font-family="Georgia,'Times New Roman',serif" letter-spacing="7">${CERT_ISSUER_EN}</text>
    <text x="350" y="350" text-anchor="middle" font-size="${full ? 24 : 26}" fill="${gold ? accent : '#7a6431'}"
      font-family="Georgia,'Times New Roman',serif" letter-spacing="${full ? 3 : 2}">${gold ? 'CERTIFICATE OF EXCELLENCE' : 'CERTIFICATE OF ACHIEVEMENT'}</text>
    ${body}
  </svg>`;
}

/* ป้ายทองบรรทัดเดียว — ใช้แทนใบเต็มเมื่อจอเตี้ยมาก (พื้นที่ในการ์ดเหลือ <~50px
   ย่อใบทั้งใบลงไปจะอ่านไม่ออก) · CSS สลับให้เองที่ @media (max-height:500px) */
function certChipHTML(c){
  const perfect = c.tt && c.sc >= c.tt;
  if(c.gold){
    return `<span class="cert-chip-sm cert-chip-gold"><b>👑 ${certXML(c.t)}</b>
      <small>${c.tt} sets · ${certXML(certDateEN(c.ts))}</small></span>`;
  }
  return `<span class="cert-chip-sm"><b>🎖️ ${certXML(c.t)}</b>
    <small>${c.sc}/${c.tt}${perfect ? ' ★' : ''} · ${certXML(certDateEN(c.ts))}</small></span>`;
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
  return list.map((c, i)=>`<button class="cert-mini${c.gold ? ' cert-mini-gold' : ''}" type="button" data-ci="${i}"
      title="${certXML(c.t)} — แตะดูใบใหญ่">
      ${certSVG(c)}
      <span class="cert-mini-cap">${c.gold ? '👑 ' : ''}${certXML(c.t)}${c.n > 1 ? ` ×${c.n}` : ''}</span>
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
