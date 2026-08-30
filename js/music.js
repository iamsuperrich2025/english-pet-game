/* ============================================================
   music.js — ระบบเพลง (รอบ 181)
   • เพลงพื้นหลัง (instrument) เล่นวนทั้งเกม เริ่มหลัง gesture แรก (autoplay policy)
   • เข้าโลก 3D ใดๆ → พัก bg (โลกมี soundscape ของตัวเอง) · ออก → เล่นต่อ
   • โลกขับรถ: ผู้เล่นเปิด "วิทยุในรถ" → เล่นเพลงในรถ (มี visualizer + เลือกเพลง 3 โหมด)
     เปิดวิทยุ = bg เงียบอยู่แล้ว (พักตอนเข้าโลก) · ปิดวิทยุ = เงียบเฉยๆ จนออกจากโลก bg กลับมา
   • ไฟล์เพลง: sound/SongsInCar/rock_01..NN.mp3 (ผู้ใช้เตรียมไว้) — probe หาที่มีจริง
     (เพลงชุดเดียวใช้ทั้ง bg + วิทยุรถ · วาง sound/bgm/bgm_01.. เพิ่มภายหลัง = ใช้เป็น bg แทนได้)
   • 🎀 รอบ 746: เพลงล็อบบี้เฉพาะ sound/bgm/lobby_01..NN.mp3 — มีไฟล์นี้เมื่อไหร่ = ใช้แทน bgm_* ทันที
     (🎵 รอบ 854: ผู้ใช้ลบ bgm_02/03 เหลือ bgm_01 เพลงเดียว → ฉากเฮลิฯ ที่เคยขอ bgm_02/03 หาไม่เจอ จะคงเพลงเดิมไว้เฉยๆ) · เพลงเดียว = loop ในตัวไม่มีรอยต่อ
   • เอนจินเสียงล้วน — UI visualizer/รายการเพลงอยู่ใน adventure3d.js (เจ้าของหน้าปัด)
   ============================================================ */
const Music = (function(){
  const CAR_DIR = 'sound/SongsInCar/';
  const BG_DIR  = 'sound/bgm/';
  const CAR_NAMES = ['rock_01','rock_02','rock_03','rock_04','rock_05','rock_06','rock_07','rock_08','rock_09','rock_10'];
  const BG_NAMES  = ['bgm_01'];
  const LOBBY_NAMES = ['lobby_01','lobby_02','lobby_03','lobby_04','lobby_05','lobby_06'];   // 🎀 รอบ 746
  const MODES = ['all','one','shuffle'];
  const BG_VOL = 0.30, CAR_VOL = 0.62;
  const OFFLINE_CACHE = 'vw-assets-content-v1';
  const OFFLINE_META_KEY = 'vwMusicOfflinePack_v1';

  let carTracks = [], bgTracks = [], sceneTracks = [], probed = false;   // bgTracks = ชุดเพลงล็อบบี้ที่หมุนเล่น · sceneTracks = ทุกไฟล์ใน sound/bgm/ (ให้เพลงตามฉากค้นชื่อ)
  let bg = null, bgIdx = 0, bgUrl = '', bgStarted = false, bgSuspended = false;
  let car = null, carIdx = 0, carOn = false;
  let audioCtx = null, analyser = null, srcNode = null, freq = null;
  let probePromise = null, offlineDownload = null;

  function soundOn(){ return typeof state === 'undefined' || state.sound; }
  function musicOn(){ return !(typeof state !== 'undefined' && state.musicOff); }   // 🎵 รอบ 184: ปุ่มปิดเพลงแยก
  // 🐛 รอบ 387: เพลงตามฉาก (sceneBg) ต้องเล่นได้แม้ bg โดนพักตอนเข้าโลก 3D — เดิม bgSuspended
  //    บล็อกหมด ทำให้เพลงโลกเฮลิฯ ไม่เคยดังตั้งแต่รอบ 369 (ฉากขอเพลงเอง = ตั้งใจให้ดังในโลก)
  function bgAllowed(){ return soundOn() && musicOn() && !carOn && (!bgSuspended || !!sceneName); }
  function mode(){ return (typeof state !== 'undefined' && MODES.includes(state.musicMode)) ? state.musicMode : 'all'; }
  function setMode(m){ if(MODES.includes(m) && typeof state !== 'undefined'){ state.musicMode = m; if(typeof saveState === 'function') saveState(); } }

  async function probeDir(dir, names){
    const out = [];
    for(const n of names){
      const url = dir + n + '.mp3';
      // eslint-disable-next-line no-await-in-loop
      const res = await fetch(url, {method:'HEAD'}).catch(()=>null);
      if(res && res.ok) out.push({name:n, url, bytes:Number(res.headers.get('content-length')) || 0});
      else if(out.length) break;    // เลขหยุดต่อเนื่อง = หมดชุด (ไฟล์ตั้งชื่อเรียงเลข)
    }
    return out;
  }

  /* ---------- ชุดเพลงออฟไลน์ ----------
     ไม่ใส่เพลงใน SW PRECACHE เพราะ install ของ Service Worker เกิดทุก deploy ไม่ใช่เฉพาะตอนติดตั้ง PWA
     เก็บด้วย content hash เดียวกับ sw.js: เพลงเดิมอยู่ข้ามเวอร์ชัน · เพลงที่เปลี่ยนเท่านั้นจึงดาวน์โหลดใหม่ */
  function offlineSupported(){
    return /^https?:$/.test(location.protocol) && typeof caches !== 'undefined' && typeof fetch === 'function';
  }
  function offlineTracks(){
    const byUrl = new Map();
    sceneTracks.concat(carTracks).forEach(t=>{ if(t && t.url) byUrl.set(t.url, t); });
    if(!byUrl.size){
      try{
        const saved = JSON.parse(localStorage.getItem(OFFLINE_META_KEY) || 'null');
        (saved && Array.isArray(saved.files) ? saved.files : []).forEach(f=>byUrl.set(f.url, f));
      }catch(e){}
    }
    return Array.from(byUrl.values());
  }
  function offlineSavedMeta(){
    try{ return JSON.parse(localStorage.getItem(OFFLINE_META_KEY) || 'null'); }catch(e){ return null; }
  }
  function offlineSaveMeta(files){
    try{ localStorage.setItem(OFFLINE_META_KEY, JSON.stringify({at:Date.now(), files})); }catch(e){}
  }
  function offlinePath(url){ return new URL(url, location.href).pathname; }
  function offlineKey(pathname, hash){
    return new Request(`${location.origin}/__vw_asset__${pathname}?v=${encodeURIComponent(hash)}`);
  }
  async function offlineCatalog(){
    if(probePromise) await probePromise.catch(()=>{});
    const tracks = offlineTracks();
    if(!tracks.length) throw new Error('ยังไม่พบไฟล์เพลงสำหรับดาวน์โหลด');
    let manifest = null;
    try{
      const res = await fetch(`/asset-manifest.json?music-pack=${Date.now()}`, {cache:'no-store'});
      if(res.ok) manifest = await res.json();
    }catch(e){}
    const saved = offlineSavedMeta();
    const savedByPath = new Map((saved && Array.isArray(saved.files) ? saved.files : []).map(f=>[f.path, f]));
    const files = tracks.map(track=>{
      const path = offlinePath(track.url);
      const live = manifest && manifest.files ? manifest.files[path] : null;
      const old = savedByPath.get(path);
      return {
        name:track.name, url:track.url, path,
        hash:(live && live.hash) || (old && old.hash) || '',
        bytes:Number((live && live.bytes) || track.bytes || (old && old.bytes)) || 0,
      };
    }).filter(file=>file.hash);
    if(!files.length) throw new Error('ยังอ่านรายการไฟล์เพลงไม่ได้ กรุณาเชื่อมต่ออินเทอร์เน็ตแล้วลองใหม่');
    return files;
  }
  async function offlinePackInfo(){
    if(!offlineSupported()) return {supported:false, reason:'อุปกรณ์นี้ยังไม่รองรับการเก็บเพลงออฟไลน์'};
    let files;
    try{ files = await offlineCatalog(); }
    catch(error){ return {supported:true, ready:false, reason:error.message}; }
    const cache = await caches.open(OFFLINE_CACHE);
    let doneFiles = 0, doneBytes = 0;
    for(const file of files){
      // eslint-disable-next-line no-await-in-loop
      if(await cache.match(offlineKey(file.path, file.hash))){ doneFiles++; doneBytes += file.bytes; }
    }
    const totalBytes = files.reduce((sum,file)=>sum + file.bytes, 0);
    return {supported:true, ready:true, files, totalFiles:files.length, doneFiles, totalBytes, doneBytes,
      complete:files.length > 0 && doneFiles === files.length};
  }
  async function offlinePackDownload(onProgress){
    if(offlineDownload) return offlineDownload;
    offlineDownload = (async()=>{
      if(!offlineSupported()) throw new Error('อุปกรณ์นี้ยังไม่รองรับการเก็บเพลงออฟไลน์');
      const files = await offlineCatalog();
      offlineSaveMeta(files);
      const cache = await caches.open(OFFLINE_CACHE);
      const totalBytes = files.reduce((sum,file)=>sum + file.bytes, 0);
      let doneFiles = 0, doneBytes = 0;
      for(const file of files){
        const key = offlineKey(file.path, file.hash);
        // eslint-disable-next-line no-await-in-loop
        const hit = await cache.match(key);
        if(!hit){
          // normal GET (ไม่มี Range) เพื่อให้ได้ไฟล์เต็มหนึ่งครั้ง แล้วเก็บด้วย hash ที่ข้าม deploy ได้
          // eslint-disable-next-line no-await-in-loop
          const response = await fetch(file.path, {cache:'no-cache'});
          if(!response.ok) throw new Error(`ดาวน์โหลด ${file.name} ไม่สำเร็จ (${response.status})`);
          // eslint-disable-next-line no-await-in-loop
          const body = await response.arrayBuffer();
          const headers = new Headers(response.headers);
          headers.set('Content-Length', String(body.byteLength));
          // eslint-disable-next-line no-await-in-loop
          await cache.put(key, new Response(body, {status:200, headers}));
        }
        doneFiles++; doneBytes += file.bytes;
        if(onProgress) onProgress({doneFiles, totalFiles:files.length, doneBytes, totalBytes, file:file.name});
      }
      if(navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(()=>false);
      offlineSaveMeta(files);
      return offlinePackInfo();
    })().finally(()=>{ offlineDownload = null; });
    return offlineDownload;
  }
  async function offlinePackRemove(){
    if(!offlineSupported()) return;
    const cache = await caches.open(OFFLINE_CACHE);
    const keys = await cache.keys();
    await Promise.all(keys.filter(key=>{
      const path = new URL(key.url).pathname;
      return path.startsWith('/__vw_asset__/sound/bgm/') || path.startsWith('/__vw_asset__/sound/SongsInCar/');
    }).map(key=>cache.delete(key)));
    try{ localStorage.removeItem(OFFLINE_META_KEY); }catch(e){}
  }


  // ---------- background ----------
  function bgSrc(url, loop){
    if(!bg){ bg = new Audio(); bg.volume = BG_VOL; bg.addEventListener('ended', ()=>{ if(!sceneName) bgPlay(bgIdx+1); }); }
    bgUrl = url; bg.src = url; bg.loop = !!loop;
    if(bgAllowed()) bg.play().catch(()=>{});
  }
  function bgPlay(i){
    if(!bgTracks.length) return;
    bgIdx = (i % bgTracks.length + bgTracks.length) % bgTracks.length;
    // 🎀 รอบ 746: เพลงเดียว = loop ในตัว (วนไม่มีรอยต่อ จนกว่าจะปิดเสียง/ปิดเพลง) · หลายเพลง = จบแล้วหมุนเพลงถัดไป
    bgSrc(bgTracks[bgIdx].url, bgTracks.length === 1);
  }
  /* 🎬 รอบ 369: เพลงตามฉาก — โลก 3D ขอเพลงเฉพาะชื่อ (เช่น 'bgm_03') เล่นวนลูปจนกว่าจะปล่อย (null)
     ยังไม่ probe เสร็จ/ไม่มีไฟล์ = ไม่เก็บชื่อ → ฝั่งเกมเรียกซ้ำทุก tick จะติดเองเมื่อพร้อม */
  let sceneName = null;
  function sceneBg(name){
    name = name || null;
    if(name === sceneName) return;
    if(name){
      const t = sceneTracks.find(x=>x.name===name);   // 🎀 รอบ 746: ค้นจากทุกไฟล์ใน sound/bgm/ (เพลงฉากอาจไม่อยู่ในชุดล็อบบี้แล้ว)
      if(!t) return;
      sceneName = name;
      bgStarted = true; bgSrc(t.url, true);
    }else{
      sceneName = null;
      if(bg) bg.loop = false;          // เพลงปัจจุบันเล่นจบแล้วหมุนต่อตามปกติ
    }
  }
  function startBg(){
    if(bgStarted || !bgTracks.length || !musicOn()) return;   // ปิดเพลงไว้ = ยังไม่เริ่ม
    bgStarted = true;
    bgPlay(Math.floor(Math.random()*bgTracks.length));   // เริ่มสุ่มเพลง ไม่ซ้ำจำเจ
  }
  // 🎵 รอบ 184: เปิด/ปิดเพลงพื้นหลัง (ปุ่ม 🎵) — เก็บใน state.musicOff · ไม่กระทบเสียงเอฟเฟกต์/วิทยุรถ
  function setMusic(on){
    if(typeof state !== 'undefined'){ state.musicOff = !on; if(typeof saveState === 'function') saveState(); }
    if(!on){ if(bg) bg.pause(); }
    else if(!carOn && (!bgSuspended || sceneName) && soundOn()){ bgStarted ? (bg && bg.play().catch(()=>{})) : startBg(); }   // 🐛 รอบ 387: เปิดเพลงกลับกลางโลก 3D ที่มีเพลงฉากต้องกลับมาดัง
  }
  function isMusicOn(){ return musicOn(); }

  // ---------- car radio ----------
  function ensureCtx(){
    if(audioCtx || !car) return;
    try{
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;                              // 32 แท่งความถี่ พอสำหรับหน้าจอเล็ก
      freq = new Uint8Array(analyser.frequencyBinCount);
      srcNode = audioCtx.createMediaElementSource(car);
      srcNode.connect(analyser); analyser.connect(audioCtx.destination);
    }catch(e){ audioCtx = null; analyser = null; }
  }
  function carPlay(i){
    if(!carTracks.length) return;
    carIdx = (i % carTracks.length + carTracks.length) % carTracks.length;
    if(!car){ car = new Audio(); car.volume = CAR_VOL; car.addEventListener('ended', carEnded); }
    car.src = carTracks[carIdx].url;
    ensureCtx();
    if(audioCtx && audioCtx.state === 'suspended') audioCtx.resume().catch(()=>{});
    if(soundOn() && carOn) car.play().catch(()=>{});
  }
  function carEnded(){
    const m = mode();
    if(m === 'one') carPlay(carIdx);
    else if(m === 'shuffle') carPlay(carTracks.length > 1 ? carIdx + 1 + Math.floor(Math.random()*(carTracks.length-1)) : carIdx);
    else carPlay(carIdx + 1);
  }
  function carRadio(on){
    carOn = !!on;
    if(carOn){ if(bg) bg.pause(); carPlay(carIdx); }
    else{ if(car) car.pause(); if(!bgSuspended && soundOn()){ bgStarted ? (bg && bg.play().catch(()=>{})) : startBg(); } }
  }

  /* ---------- 🤫 รอบ 859 (ผู้ใช้สั่ง): เปิดหน้าสอบ/ควิซ/เกมจากแถบล่าง Lobby → เพลงค่อยๆ เฟดเงียบ
     ปิดหน้านั้นแล้วเพลงค่อยๆ กลับมาดังเอง — ตรวจจับจาก DOM กลางทาง (ไม่ต้องไปฝัง hook ทุกจุดเปิด/ปิด)
     ครอบคลุม: IELTS/TOEIC/TOEFL (#xs-picker/#xs-screen/#xs-review) · ควิซอาหาร (.fq-box)
     · หมวดคำศัพท์+แบบทดสอบ (screen-cats/screen-quiz) · เกมจับคู่คำศัพท์ (screen-game)
     · 🖼️ จับคู่ภาพ · 📖 Picture Dictionary/ครูถามศัพท์ · 📝 แผงสอบเลื่อนขั้น (รอบ 1048) */
  const DUCK_SEL = '#xs-picker,#xs-screen,#xs-review,.fq-box,#screen-cats.active,#screen-quiz.active,#screen-game.active,#screen-picmatch.active,#screen-picdict.active,#bsp-overlay';
  let ducked = false, duckFadeT = 0;
  function fadeBgTo(target, done){                     // ไล่ volume ทีละสเต็ปทุก 60ms (~0.85 วิเต็มช่วง)
    clearInterval(duckFadeT);
    if(!bg){ if(done) done(); return; }
    const step = BG_VOL / 14;
    duckFadeT = setInterval(()=>{
      if(!bg){ clearInterval(duckFadeT); return; }
      const v = bg.volume;
      if(Math.abs(v - target) <= step){ bg.volume = target; clearInterval(duckFadeT); duckFadeT = 0; if(done) done(); }
      else bg.volume = v + Math.sign(target - v) * step;
    }, 60);
  }
  function duckTick(){
    const quiet = !!document.querySelector(DUCK_SEL);
    if(quiet){
      // เฟดออกแล้วพัก · คืน volume เต็มไว้ตอนพัก กันทางเล่นเพลงอื่น (resumeBg/setMusic) เจอ volume 0 ค้าง
      if(bg && !bg.paused && !duckFadeT) fadeBgTo(0, ()=>{ if(bg){ bg.pause(); bg.volume = BG_VOL; } });
      ducked = true;
    }else if(ducked){
      ducked = false;
      clearInterval(duckFadeT); duckFadeT = 0;
      if(bg && bg.paused && bgStarted && bgAllowed()){ bg.volume = 0; bg.play().catch(()=>{}); fadeBgTo(BG_VOL); }
      else if(bg) bg.volume = BG_VOL;
    }
  }
  setInterval(duckTick, 250);

  // ---------- โลก 3D: พัก/คืน bg ----------
  function suspendBg(){ bgSuspended = true; if(bg) bg.pause(); }
  function resumeBg(){
    bgSuspended = false; carOn = false; if(car) car.pause();
    if(!(soundOn() && musicOn())) return;
    if(!bgStarted){ startBg(); return; }
    // 🎀 รอบ 746: ออกจากโลกที่มีเพลงตามฉาก (เฮลิฯ) เพลงที่ค้างอยู่ไม่ใช่เพลงล็อบบี้ → เริ่มเพลงล็อบบี้ใหม่
    if(!sceneName && bgTracks.length && !bgTracks.some(t=>t.url===bgUrl)){ bgPlay(bgIdx); return; }
    if(bg) bg.play().catch(()=>{});    // โลกอื่น = เล่นต่อจากจุดที่พักไว้
  }

  // ---------- สลับเสียงในตั้งค่า ----------
  function onSound(){
    if(!soundOn()){ if(bg) bg.pause(); if(car) car.pause(); return; }
    if(carOn){ if(car) car.play().catch(()=>{}); }
    else if((!bgSuspended || sceneName) && musicOn()){ bgStarted ? (bg && bg.play().catch(()=>{})) : startBg(); }   // 🐛 รอบ 387
  }

  // ---------- visualizer feed ----------
  function vizData(){
    if(!analyser || !carOn) return null;
    analyser.getByteFrequencyData(freq);
    return freq;
  }

  function init(){
    if(probed) return;
    probed = true;
    probePromise = Promise.all([probeDir(CAR_DIR, CAR_NAMES), probeDir(BG_DIR, BG_NAMES), probeDir(BG_DIR, LOBBY_NAMES)]).then(([cars, bgm, lob])=>{
      carTracks = cars;
      sceneTracks = lob.concat(bgm);                    // เพลงตามฉากค้นชื่อจากทุกไฟล์ใน sound/bgm/
      // 🎀 รอบ 746: มี lobby_*.mp3 = เพลงล็อบบี้ใหม่ (แทน bgm_* เดิม) · ไม่มี = พฤติกรรมเดิมทุกอย่าง
      bgTracks = lob.length ? lob : (bgm.length ? bgm : cars);   // ไม่มีชุด bgm เฉพาะ → ใช้เพลงชุดรถเป็น bg ด้วย
      const go = ()=>{ if(soundOn() && !bgSuspended) startBg(); };
      window.addEventListener('pointerdown', go, {once:true});
      window.addEventListener('keydown', go, {once:true});
    });
  }

  return {
    init, onSound, suspendBg, resumeBg,
    carRadio, isCarOn:()=>carOn, toggleCar:()=>carRadio(!carOn),
    carTracks:()=>carTracks, curCar:()=>carIdx, playCar:carPlay,
    mode, setMode, vizData, ready:()=>carTracks.length>0,
    sceneBg, curScene:()=>sceneName,             // 🎬 รอบ 369: เพลงตามฉากโลก 3D
    bgReady:()=>bgTracks.length>0,
    setMusic, isMusicOn, toggleMusic:()=>setMusic(!musicOn()),   // 🎵 รอบ 184: ปุ่มเปิด/ปิดเพลง Lobby
    offlinePackInfo, offlinePackDownload, offlinePackRemove,
    /* test hooks — ใช้เฉพาะตอนเทสต์ preview (🤫 รอบ 859: ตรวจการเฟดเพลงตอนเปิดหน้าสอบ) */
    _t:{ get ducked(){ return ducked; }, get vol(){ return bg ? bg.volume : null; },
         get paused(){ return bg ? bg.paused : null; }, get started(){ return bgStarted; }, duckTick },
  };
})();
