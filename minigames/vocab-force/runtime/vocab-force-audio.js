"use strict";
(function(root){
  const VF = root.VocabForce = root.VocabForce || {};
  let ctx = null;
  const HOOKS = {
    punchWhoosh: null,
    punchImpact: null,
    kickWhoosh: null,
    kickImpact: null,
    enemyLaunch: null,
    enemyLand: null,
    heavyImpact: null,
    dashWhoosh: null,
    dashArrive: null,
    zombieWallImpactLight: null,
    zombieWallImpactHeavy: null,
    zombieWallImpactExtreme: null,
    zombieGroundImpactLight: null,
    zombieGroundImpactHeavy: null,
    zombieGroundImpactExtreme: null,
    debrisImpact: null,
    shockwaveImpact: null,
    rapidComboHit: null,
    rapidComboReady: null,
    zombieBurstFinisher: null,
    zombieBurstImpact: null,
    zombieBurstFragments: null,
    breakableWallHit: null,
    breakableWallCrack: null,
    breakableWallShatter: null,
    breakableWallDebris: null,
    breakableWallCollapse: null,
    energyCharge: null,
    energyFire: null,
    energyProjectileTravel: null,
    energyHit: null,
    energyFinalHit: null,
    energyWallImpact: null,
    energyVortex: null,
    powerJumpLaunch: null,
    powerJumpLand: null,
    overdriveStart: null,
    overdriveLoop: null,
    overdriveEnd: null,
    fireTrailBurn: null
  };
  const players = {};
  const BGM = {
    file: 'Vocab_force_bgm.mp3',
    dir: '/sound/vocab-force/',
    hash: '005fca63b9391f66',
    vol: 0.36
  };
  const CLIP_DIR = '/sound/vocab-force/';
  const CLIPS = {
    charge: {file: 'chargeEnergy.mp3', hash: 'dd874c566fe62677', vol: 0.55, loop: true},
    shot: {file: 'energy_beam_shot.mp3', hash: '792802af81f6421e', vol: 0.68, loop: false},
    boom: {file: 'fire-a6fea31058694941.mp3', hash: 'a6fea31058694941', vol: 0.56, loop: false, dir: '/sound/arena/'}
  };
  const SOUND_KEY = 'vocabForce.sound';
  const bgm = {sfx: null, blob: null, url: '', load: null, session: false, fadeT: 0, playTok: 0, visBound: false, muted: false, blocked: false, lastError: ''};
  const clips = {
    charge: {blob: null, url: '', load: null, sfx: null, gen: 0},
    shot: {blob: null, url: '', load: null, pool: [], next: 0},
    boom: {blob: null, url: '', load: null, pool: [], next: 0}
  };
  try{ bgm.muted = !!(root.localStorage && localStorage.getItem(SOUND_KEY) === 'off'); }catch(_){}

  function soundWanted(){
    if(bgm.muted) return false;
    try{
      if(typeof root.state !== 'undefined' && root.state && root.state.sound === false) return false;
    }catch(_){}
    if(typeof document !== 'undefined' && document.hidden) return false;
    return true;
  }

  function bgmWanted(){
    if(bgm.muted) return false;
    try{
      if(typeof document !== 'undefined' && document.hidden) return false;
    }catch(_){}
    return true;
  }

  function replayBgm(){
    if(!bgm.session || bgm.muted) return;
    const el = bgm.sfx;
    if(!el) return;
    el.loop = true;
    try{ el.currentTime = 0; }catch(_){}
    if(!bgmWanted()) return;
    const p = el.play();
    if(p && p.catch) p.catch(function(){});
  }

  function bindBgmEl(el){
    if(!el || el._vfLoop) return;
    el._vfLoop = true;
    el.loop = true;
    el.addEventListener('ended', replayBgm);
  }

  function isMuted(){ return !!bgm.muted; }

  function setMuted(off){
    bgm.muted = !!off;
    try{ if(root.localStorage) localStorage.setItem(SOUND_KEY, bgm.muted ? 'off' : 'on'); }catch(_){}
    if(bgm.muted){
      if(bgm.sfx && !bgm.sfx.paused) try{ bgm.sfx.pause(); }catch(_){}
      stopEnergyCharge();
    }else{
      startBgm();
    }
    return !bgm.muted;
  }

  function toggleMuted(){ return setMuted(!bgm.muted); }

  function bindBgmVis(){
    if(bgm.visBound || typeof document === 'undefined') return;
    document.addEventListener('visibilitychange', function(){
      if(bgm.session) syncBgm();
    });
    bgm.visBound = true;
  }

  function cacheKey(dir, file, hash){
    const path = dir + file;
    return {path: path, key: (root.location && location.origin ? location.origin : '') + '/__vw_asset__' + path + '?v=' + hash};
  }

  function loadCachedBlob(slot, dir, file, hash){
    if(slot.blob) return Promise.resolve(slot.blob);
    if(slot.load) return slot.load;
    const rec = cacheKey(dir, file, hash);
    slot.load = Promise.resolve().then(function(){
      if(typeof caches === 'undefined') return null;
      return caches.open('vw-assets-content-v1').then(function(cache){
        return cache.match(rec.key).then(function(hit){ return hit ? {cache: cache, hit: hit} : {cache: cache}; });
      }).catch(function(){ return {}; });
    }).then(function(got){
      got = got || {};
      if(got.hit) return got.hit.blob();
      if(typeof fetch !== 'function') return null;
      return fetch(rec.path).then(function(res){
        if(!res.ok) throw 0;
        if(got.cache) got.cache.put(rec.key, res.clone()).catch(function(){});
        return res.blob();
      });
    }).then(function(blob){ return blob ? (slot.blob = blob) : null; })
      .catch(function(){ return null; })
      .finally(function(){ slot.load = null; });
    return slot.load;
  }

  function loadBgm(){
    return loadCachedBlob(bgm, BGM.dir, BGM.file, BGM.hash);
  }

  function loadClip(name){
    const spec = CLIPS[name];
    const slot = clips[name];
    if(!spec || !slot) return Promise.resolve(null);
    return loadCachedBlob(slot, spec.dir || CLIP_DIR, spec.file, spec.hash);
  }

  function warmupEnergy(){
    if(!soundWanted()) return;
    void loadClip('charge');
    void loadClip('shot');
  }

  function playChargeClip(){
    if(!soundWanted()) return false;
    const spec = CLIPS.charge;
    const slot = clips.charge;
    const Ctor = root.Audio || (typeof Audio !== 'undefined' ? Audio : null);
    if(!Ctor) return false;
    try{
      void loadClip('shot');
      if(!slot.sfx){
        slot.sfx = new Ctor();
        slot.sfx.preload = 'none';
      }
      const el = slot.sfx;
      const tok = ++slot.gen;
      el.loop = true;
      el.volume = spec.vol;
      void loadClip('charge').then(function(blob){
        if(!blob || el !== slot.sfx || tok !== slot.gen || !soundWanted()) return;
        if(!slot.url){
          slot.url = URL.createObjectURL(blob);
          el.src = slot.url;
        }
        try{ el.currentTime = 0; }catch(_){}
        return el.play().catch(function(){});
      });
      return true;
    }catch(_){ return false; }
  }

  function stopEnergyCharge(){
    const slot = clips.charge;
    slot.gen++;
    if(slot.sfx){
      try{ slot.sfx.pause(); slot.sfx.currentTime = 0; }catch(_){}
    }
  }

  function playPooledClip(name){
    if(!soundWanted()) return false;
    const spec = CLIPS[name];
    const slot = clips[name];
    const Ctor = root.Audio || (typeof Audio !== 'undefined' ? Audio : null);
    if(!spec || !slot || !Ctor) return false;
    try{
      const tok = slot.next = (slot.next || 0) + 1;
      const idx = tok % 2;
      void loadClip(name).then(function(blob){
        if(!blob || tok < slot.next - 2 || !soundWanted()) return;
        if(!slot.url) slot.url = URL.createObjectURL(blob);
        let el = slot.pool[idx];
        if(!el){
          el = new Ctor();
          el.preload = 'none';
          slot.pool[idx] = el;
        }
        if(el.src !== slot.url) el.src = slot.url;
        el.volume = spec.vol;
        try{ el.currentTime = 0; }catch(_){}
        return el.play().catch(function(){});
      });
      return true;
    }catch(_){ return false; }
  }

  function playShotClip(){ return playPooledClip('shot'); }

  function startEnergyCharge(){
    if(playChargeClip()) return true;
    beep(520, 0.07, 'sine', 0.05); beep(740, 0.09, 'triangle', 0.04);
    return false;
  }

  function startBgm(){
    if(bgm.muted) return false;
    const Ctor = root.Audio || (typeof Audio !== 'undefined' ? Audio : null);
    if(!Ctor) return false;
    bindBgmVis();
    bgm.session = true;
    if(bgm.fadeT){ try{ clearTimeout(bgm.fadeT); }catch(_){ } bgm.fadeT = 0; }
    try{
      if(!bgm.sfx){
        bgm.sfx = new Ctor();
        bgm.sfx.preload = 'auto';
        bgm.sfx.volume = BGM.vol;
      }
      const el = bgm.sfx;
      el.loop = true;
      el.volume = BGM.vol;
      bindBgmEl(el);
      if(!el.src) el.src = BGM.dir + BGM.file + '?v=' + BGM.hash;
      if(!bgmWanted()) return true;
      bgm.playTok++;
      try{ if(el.ended) el.currentTime = 0; }catch(_){}
      const play = el.play();
      if(play && play.then){
        play.then(function(){ bgm.blocked = false; bgm.lastError = ''; }).catch(function(err){
          bgm.blocked = true;
          bgm.lastError = String(err && (err.name || err.message) || 'play-blocked');
        });
      }
      void loadBgm();
      warmupEnergy();
      return true;
    }catch(_){ return false; }
  }

  function syncBgm(){
    if(!bgm.session) return;
    if(bgm.muted || !bgmWanted()){
      if(bgm.sfx && !bgm.sfx.paused) try{ bgm.sfx.pause(); }catch(_){}
      return;
    }
    startBgm();
  }

  function stopBgm(fadeMs){
    bgm.session = false;
    bgm.playTok++;
    if(bgm.fadeT){ try{ clearTimeout(bgm.fadeT); }catch(_){ } bgm.fadeT = 0; }
    const a = bgm.sfx;
    const finish = function(){
      if(a){ try{ a.pause(); a.volume = BGM.vol; }catch(_){ } }
      bgm.fadeT = 0;
    };
    const ms = fadeMs == null ? 800 : fadeMs;
    if(!a || a.paused || !(ms > 0)){ finish(); return; }
    const startAt = (root.performance && performance.now) ? performance.now() : Date.now();
    const startVol = a.volume;
    const step = function(){
      if(bgm.session) return;
      const now = (root.performance && performance.now) ? performance.now() : Date.now();
      const k = Math.min(1, (now - startAt) / ms);
      try{ a.volume = startVol * (1 - k); }catch(_){}
      if(k >= 1){ finish(); return; }
      bgm.fadeT = setTimeout(step, 40);
    };
    step();
  }

  function ac(){
    if(ctx) return ctx;
    const C = root.AudioContext || root.webkitAudioContext;
    if(!C) return null;
    ctx = new C();
    return ctx;
  }

  function beep(freq, dur, type, gain){
    if(!soundWanted()) return;
    const a = ac(); if(!a) return;
    const o = a.createOscillator();
    const g = a.createGain();
    o.type = type || 'triangle';
    o.frequency.value = freq;
    g.gain.value = gain || 0.08;
    o.connect(g); g.connect(a.destination);
    o.start();
    g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + dur);
    o.stop(a.currentTime + dur + 0.02);
  }

  function playFile(url){
    if(!url || !soundWanted()) return false;
    try{
      let el = players[url];
      if(!el){
        el = new Audio(url);
        el.preload = 'auto';
        players[url] = el;
      }
      el.currentTime = 0;
      const p = el.play();
      if(p && p.catch) p.catch(function(){});
      return true;
    }catch(_){ return false; }
  }

  function hook(name, fallback){
    if(playFile(HOOKS[name])) return;
    if(fallback) fallback();
  }

  VF.AUDIO_HOOKS = HOOKS;
  VF.BGM = BGM;
  VF.ENERGY_CLIPS = CLIPS;
  VF.SOUND_KEY = SOUND_KEY;
  VF._t = VF._t || {};
  VF._t.bgm = bgm;
  VF.audio = {
    resume: function(){ const a = ac(); if(a && a.state === 'suspended') a.resume(); },
    startBgm: startBgm,
    stopBgm: stopBgm,
    syncBgm: syncBgm,
    loadBgm: loadBgm,
    loadClip: loadClip,
    warmupEnergy: warmupEnergy,
    startEnergyCharge: startEnergyCharge,
    stopEnergyCharge: stopEnergyCharge,
    isMuted: isMuted,
    setMuted: setMuted,
    toggleMuted: toggleMuted,
    setHook: function(name, url){ if(HOOKS.hasOwnProperty(name)) HOOKS[name] = url || null; },
    punchWhoosh: function(){ hook('punchWhoosh', function(){ beep(240, 0.05, 'square', 0.05); }); },
    punchImpact: function(){ hook('punchImpact', function(){ beep(190, 0.07, 'square', 0.08); beep(70, 0.09, 'square', 0.06); }); },
    kickWhoosh: function(){ hook('kickWhoosh', function(){ beep(120, 0.1, 'sawtooth', 0.07); beep(70, 0.09, 'square', 0.05); }); },
    kickImpact: function(){ hook('kickImpact', function(){ beep(88, 0.14, 'sawtooth', 0.12); beep(46, 0.18, 'square', 0.1); beep(160, 0.06, 'triangle', 0.04); }); },
    heavyImpact: function(){ hook('heavyImpact', function(){ beep(90, 0.14, 'sawtooth', 0.1); beep(55, 0.16, 'square', 0.08); }); },
    enemyLaunch: function(){ hook('enemyLaunch', function(){ beep(110, 0.08, 'triangle', 0.05); }); },
    enemyLand: function(){ hook('enemyLand', function(){ beep(85, 0.1, 'square', 0.05); }); },
    dashWhoosh: function(){ hook('dashWhoosh', function(){ beep(320, 0.06, 'sawtooth', 0.05); beep(180, 0.08, 'triangle', 0.04); }); },
    dashArrive: function(){ hook('dashArrive', function(){ beep(140, 0.05, 'square', 0.04); }); },
    overdriveStart: function(){ hook('overdrive_start', function(){ beep(420, 0.08, 'sawtooth', 0.07); beep(220, 0.12, 'triangle', 0.05); }); },
    overdriveLoop: function(){ hook('overdrive_loop', function(){ beep(180, 0.05, 'sine', 0.03); }); },
    overdriveEnd: function(){ hook('overdrive_end', function(){ beep(90, 0.1, 'square', 0.06); beep(48, 0.12, 'sawtooth', 0.05); }); },
    fireTrailBurn: function(){ hook('fire_trail_burn', function(){ beep(260, 0.07, 'triangle', 0.04); beep(140, 0.1, 'sawtooth', 0.03); }); },
    powerJumpLaunch: function(){ hook('powerJumpLaunch', function(){ beep(210, 0.08, 'sawtooth', 0.05); beep(140, 0.12, 'triangle', 0.04); }); },
    powerJumpLand: function(){ hook('powerJumpLand', function(){ beep(62, 0.16, 'sawtooth', 0.1); beep(36, 0.2, 'square', 0.08); beep(48, 0.12, 'sine', 0.05); }); },
    zombieWallImpactLight: function(){ hook('zombieWallImpactLight', function(){ beep(160, 0.07, 'square', 0.05); }); },
    zombieWallImpactHeavy: function(){ hook('zombieWallImpactHeavy', function(){ beep(92, 0.12, 'sawtooth', 0.09); beep(48, 0.14, 'square', 0.07); }); },
    zombieWallImpactExtreme: function(){ hook('zombieWallImpactExtreme', function(){ beep(70, 0.16, 'sawtooth', 0.11); beep(38, 0.2, 'square', 0.09); }); },
    zombieGroundImpactLight: function(){ hook('zombieGroundImpactLight', function(){ beep(120, 0.08, 'square', 0.05); }); },
    zombieGroundImpactHeavy: function(){ hook('zombieGroundImpactHeavy', function(){ beep(78, 0.13, 'sawtooth', 0.09); beep(44, 0.16, 'square', 0.07); }); },
    zombieGroundImpactExtreme: function(){ hook('zombieGroundImpactExtreme', function(){ beep(58, 0.18, 'sawtooth', 0.11); beep(32, 0.22, 'square', 0.09); }); },
    debrisImpact: function(){ hook('debrisImpact', function(){ beep(210, 0.05, 'triangle', 0.04); beep(140, 0.07, 'square', 0.03); }); },
    shockwaveImpact: function(){ hook('shockwaveImpact', function(){ beep(52, 0.14, 'sine', 0.06); }); },
    rapidComboHit: function(){ hook('rapidComboHit', function(){ beep(420, 0.04, 'square', 0.05); }); },
    rapidComboReady: function(){ hook('rapidComboReady', function(){ beep(640, 0.06, 'triangle', 0.07); beep(880, 0.08, 'sine', 0.05); }); },
    zombieBurstFinisher: function(){ hook('zombieBurstFinisher', function(){ beep(90, 0.12, 'sawtooth', 0.1); beep(48, 0.16, 'square', 0.08); }); },
    zombieBurstImpact: function(){ hook('zombieBurstImpact', function(){ beep(70, 0.14, 'square', 0.1); beep(160, 0.08, 'sawtooth', 0.06); }); },
    zombieBurstFragments: function(){ hook('zombieBurstFragments', function(){ beep(210, 0.05, 'triangle', 0.04); beep(140, 0.07, 'square', 0.03); beep(90, 0.09, 'sawtooth', 0.03); }); },
    breakableWallHit: function(){ hook('breakableWallHit', function(){ beep(110, 0.1, 'square', 0.08); beep(48, 0.14, 'sawtooth', 0.07); }); },
    breakableWallCrack: function(){ hook('breakableWallCrack', function(){ beep(240, 0.05, 'triangle', 0.05); beep(180, 0.08, 'square', 0.04); }); },
    breakableWallShatter: function(){ hook('breakableWallShatter', function(){ beep(70, 0.16, 'sawtooth', 0.11); beep(36, 0.2, 'square', 0.09); }); },
    breakableWallDebris: function(){ hook('breakableWallDebris', function(){ beep(190, 0.06, 'triangle', 0.04); beep(120, 0.09, 'square', 0.03); }); },
    breakableWallCollapse: function(){ hook('breakableWallCollapse', function(){ beep(52, 0.22, 'sine', 0.08); beep(28, 0.26, 'square', 0.07); }); },
    energyCharge: function(){ hook('energyCharge', function(){ beep(520, 0.07, 'sine', 0.05); beep(740, 0.09, 'triangle', 0.04); }); },
    energyFire: function(){
      stopEnergyCharge();
      if(playShotClip()) return;
      hook('energyFire', function(){ beep(380, 0.06, 'sawtooth', 0.07); beep(220, 0.08, 'square', 0.05); });
    },
    energyProjectileTravel: function(){
      if(clips.shot.blob || clips.shot.url) return;
      hook('energyProjectileTravel', function(){ beep(880, 0.03, 'sine', 0.03); });
    },
    energyHit: function(){ hook('energyHit', function(){ beep(260, 0.07, 'square', 0.07); beep(140, 0.09, 'sawtooth', 0.05); }); },
    energyFinalHit: function(){ hook('energyFinalHit', function(){ beep(180, 0.1, 'sawtooth', 0.09); beep(90, 0.12, 'square', 0.07); }); },
    energyWallImpact: function(){ hook('energyWallImpact', function(){ beep(210, 0.06, 'triangle', 0.05); beep(110, 0.08, 'square', 0.04); }); },
    energyVortex: function(){ hook('energyVortex', function(){ beep(180, 0.14, 'sine', 0.05); beep(420, 0.18, 'triangle', 0.04); }); },
    healPad: function(){ hook('healPad', function(){ beep(880, 0.05, 'sine', 0.035); beep(1240, 0.08, 'triangle', 0.03); }); },
    arenaFire: function(){
      if(playPooledClip('boom')) return;
      hook('energyFinalHit', function(){ beep(90, 0.16, 'sawtooth', 0.1); beep(42, 0.2, 'square', 0.08); });
    },
    punch: function(){ this.punchWhoosh(); },
    kick: function(){ this.kickWhoosh(); },
    hit: function(kind){
      if(kind === 'heavyKick') this.heavyImpact();
      else if(kind === 'kick') this.kickImpact();
      else this.punchImpact();
    },
    letter: function(){
      if(root.sfx && sfx.correct) sfx.correct();
      else { beep(740, 0.08, 'triangle', 0.09); beep(980, 0.12, 'sine', 0.07); }
    },
    wrong: function(){
      if(root.sfx && sfx.wrong) sfx.wrong();
      else beep(170, 0.16, 'sawtooth', 0.06);
    },
    complete: function(){
      if(root.sfx && sfx.levelup) sfx.levelup();
      else [523, 659, 784, 1047].forEach(function(f, i){ setTimeout(function(){ beep(f, 0.16, 'triangle', 0.08); }, i * 90); });
    },
    coin: function(){
      const ding = function(){
        if(root.sfx && sfx.coinGet) sfx.coinGet();
        else { beep(1240, 0.09, 'triangle', 0.12); beep(1560, 0.12, 'sine', 0.09); }
      };
      ding();
      setTimeout(ding, 180);
      setTimeout(ding, 420);
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
