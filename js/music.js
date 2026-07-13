/* ============================================================
   music.js — ระบบเพลง (รอบ 181)
   • เพลงพื้นหลัง (instrument) เล่นวนทั้งเกม เริ่มหลัง gesture แรก (autoplay policy)
   • เข้าโลก 3D ใดๆ → พัก bg (โลกมี soundscape ของตัวเอง) · ออก → เล่นต่อ
   • โลกขับรถ: ผู้เล่นเปิด "วิทยุในรถ" → เล่นเพลงในรถ (มี visualizer + เลือกเพลง 3 โหมด)
     เปิดวิทยุ = bg เงียบอยู่แล้ว (พักตอนเข้าโลก) · ปิดวิทยุ = เงียบเฉยๆ จนออกจากโลก bg กลับมา
   • ไฟล์เพลง: sound/SongsInCar/rock_01..NN.mp3 (ผู้ใช้เตรียมไว้) — probe หาที่มีจริง
     (เพลงชุดเดียวใช้ทั้ง bg + วิทยุรถ · วาง sound/bgm/bgm_01.. เพิ่มภายหลัง = ใช้เป็น bg แทนได้)
   • เอนจินเสียงล้วน — UI visualizer/รายการเพลงอยู่ใน adventure3d.js (เจ้าของหน้าปัด)
   ============================================================ */
const Music = (function(){
  const CAR_DIR = 'sound/SongsInCar/';
  const BG_DIR  = 'sound/bgm/';
  const CAR_NAMES = ['rock_01','rock_02','rock_03','rock_04','rock_05','rock_06','rock_07','rock_08','rock_09','rock_10'];
  const BG_NAMES  = ['bgm_01','bgm_02','bgm_03','bgm_04','bgm_05','bgm_06','bgm_07','bgm_08'];
  const MODES = ['all','one','shuffle'];
  const BG_VOL = 0.30, CAR_VOL = 0.62;

  let carTracks = [], bgTracks = [], probed = false;
  let bg = null, bgIdx = 0, bgStarted = false, bgSuspended = false;
  let car = null, carIdx = 0, carOn = false;
  let audioCtx = null, analyser = null, srcNode = null, freq = null;

  function soundOn(){ return typeof state === 'undefined' || state.sound; }
  function musicOn(){ return !(typeof state !== 'undefined' && state.musicOff); }   // 🎵 รอบ 184: ปุ่มปิดเพลงแยก
  function bgAllowed(){ return soundOn() && musicOn() && !carOn && !bgSuspended; }
  function mode(){ return (typeof state !== 'undefined' && MODES.includes(state.musicMode)) ? state.musicMode : 'all'; }
  function setMode(m){ if(MODES.includes(m) && typeof state !== 'undefined'){ state.musicMode = m; if(typeof saveState === 'function') saveState(); } }

  async function probeDir(dir, names){
    const out = [];
    for(const n of names){
      const url = dir + n + '.mp3';
      // eslint-disable-next-line no-await-in-loop
      const ok = await fetch(url, {method:'HEAD'}).then(r=>r.ok).catch(()=>false);
      if(ok) out.push({name:n, url});
      else if(out.length) break;    // เลขหยุดต่อเนื่อง = หมดชุด (ไฟล์ตั้งชื่อเรียงเลข)
    }
    return out;
  }

  // ---------- background ----------
  function bgPlay(i){
    if(!bgTracks.length) return;
    bgIdx = (i % bgTracks.length + bgTracks.length) % bgTracks.length;
    if(!bg){ bg = new Audio(); bg.volume = BG_VOL; bg.addEventListener('ended', ()=>bgPlay(bgIdx+1)); }
    bg.src = bgTracks[bgIdx].url;
    if(bgAllowed()) bg.play().catch(()=>{});
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
    else if(!carOn && !bgSuspended && soundOn()){ bgStarted ? (bg && bg.play().catch(()=>{})) : startBg(); }
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

  // ---------- โลก 3D: พัก/คืน bg ----------
  function suspendBg(){ bgSuspended = true; if(bg) bg.pause(); }
  function resumeBg(){
    bgSuspended = false; carOn = false; if(car) car.pause();
    if(soundOn() && musicOn()){ bgStarted ? (bg && bg.play().catch(()=>{})) : startBg(); }
  }

  // ---------- สลับเสียงในตั้งค่า ----------
  function onSound(){
    if(!soundOn()){ if(bg) bg.pause(); if(car) car.pause(); return; }
    if(carOn){ if(car) car.play().catch(()=>{}); }
    else if(!bgSuspended && musicOn()){ bgStarted ? (bg && bg.play().catch(()=>{})) : startBg(); }
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
    Promise.all([probeDir(CAR_DIR, CAR_NAMES), probeDir(BG_DIR, BG_NAMES)]).then(([cars, bgm])=>{
      carTracks = cars;
      bgTracks = bgm.length ? bgm : cars;               // ไม่มีชุด bgm เฉพาะ → ใช้เพลงชุดรถเป็น bg ด้วย
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
    setMusic, isMusicOn, toggleMusic:()=>setMusic(!musicOn()),   // 🎵 รอบ 184: ปุ่มเปิด/ปิดเพลง Lobby
  };
})();
