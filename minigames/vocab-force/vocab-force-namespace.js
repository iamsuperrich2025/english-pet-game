"use strict";
/* Vocab Force — shared namespace. No gameplay loop lives here. */
(function(root){
  const VF = root.VocabForce = root.VocabForce || {};
  VF.basePath = VF.basePath || 'minigames/vocab-force/';
  VF.asset = function(rel){
    const base = VF.basePath.endsWith('/') ? VF.basePath : VF.basePath + '/';
    return base + String(rel || '').replace(/^\.\//, '').replace(/^\//, '');
  };
  VF.clamp = function(v, a, b){ return Math.max(a, Math.min(b, v)); };
  VF.lerp = function(a, b, t){ return a + (b - a) * t; };
  VF.rand = function(a, b){ return a + Math.random() * (b - a); };
  VF.now = function(){ return (root.performance && performance.now) ? performance.now() : Date.now(); };
  VF.LOCK_MSG = '🔒 Vocab Force กำลังทดสอบ — เปิดให้ผู้ดูแลระบบเท่านั้น';
  VF.LETTER_REWARD = 5000;
  VF.PLAYER_HP = 100;
  VF.ZOMBIE_HP = 36;
  VF.ZOMBIE_BITE = 12;
  VF.HUNTER_PER_PLAYER = 20;
  VF.HUNTER_OPEN = 4;
  VF.HUNTER_SPAWN_SEC = 0.65;
  VF.HUNTER_RING_MIN = 12;
  VF.HUNTER_RING_MAX = 19;
  VF.HUNTER_DETECT = 36;
  VF.HUNTER_LIVE_CAP = 50;
  VF.MAP_SCALE = 10;
  VF.ARENA_HALF = 280;
  VF.CAMERA_FAR = 980;
  VF.SKY_RADIUS = 420;
  VF.NET_MAP = 'vforce';
  VF.ROOM_MAX = 14;
  VF.WIN_ACK_SEC = 8;
  VF.COLLUSION_SEC = 6;
  VF.COLLUSION_CONTEST = 28;
  VF.COLLUSION_ESCORT = 48;
  VF.COLLUSION_HUNTERS = 4;
  VF.COLLUSION_CAP = 8;
  VF.COLLUSION_COOL = 16;
  VF.DPR_CAP = 1.5;
  VF.SCRIPTS = [
    'vocab-force-namespace.js',
    'animation/nex-animation-manifest.js',
    'animation/lyravyn-animation-manifest.js',
    'character/playable-roster.js',
    'character/nex-asset-loader.js',
    'animation/nex-animation-controller.js',
    'character/nex-character-controller.js',
    'camera/third-person-camera.js',
    'controls/vocab-force-input.js',
    'combat/combat-tune.js',
    'combat/rapid-finisher-tune.js',
    'combat/secondary-impact-tune.js',
    'combat/breakable-wall-tune.js',
    'combat/dash-tune.js',
    'combat/overdrive-dash-tune.js',
    'combat/power-jump-tune.js',
    'combat/energy-attack-tune.js',
    'combat/combat-controller.js',
    'enemies/zom-animation-manifest.js',
    'enemies/zom-asset-loader.js',
    'enemies/zombie-enemy.js',
    'enemies/enemy-manager.js',
    'vocabulary/word-list.js',
    'vocabulary/letter-progress-controller.js',
    'vocabulary/vocabulary-round-controller.js',
    'vocabulary/letter-field.js',
    'effects/impact-fx-manager.js',
    'effects/secondary-impact-controller.js',
    'effects/breakable-wall-controller.js',
    'effects/motion-trail-manager.js',
    'effects/overdrive-fire-trail.js',
    'effects/energy-projectile-manager.js',
    'effects/energy-vortex-manager.js',
    'combat/heal-pad-tune.js',
    'effects/heal-pad.js',
    'combat/energy-attack-controller.js',
    'ui/letter-quest-marker.js',
    'ui/health-bar.js',
    'ui/character-select.js',
    'ui/vocab-force-hud.js',
    'map/prototype-arena.js',
    'runtime/vocab-force-audio.js',
    'runtime/vocab-force-net.js',
    'runtime/vocab-force-runtime.js'
  ];
  VF.adminAllowed = function(){
    try{
      if(VF.devPreview === true) return true;
      if(typeof isAdmin === 'function' && isAdmin() === true) return true;
      if(typeof state !== 'undefined' && state && state.adminAccess === true) return true;
    }catch(_){}
    return false;
  };
  VF._t = VF._t || {};
  VF._t.coinSrc = function(){
    return VF.devPreview ? '../../img/coins/coin_gold.webp' : 'img/coins/coin_gold.webp';
  };
  VF._t.winnerPhoto = function(opts){
    opts = opts || {};
    const uid = opts.uid || '';
    try{
      if(typeof photoOf === 'function' && uid){
        const got = photoOf(uid);
        if(got) return got;
      }
      if(opts.local && typeof photoGet === 'function'){
        const mine = photoGet();
        if(mine) return mine;
      }
    }catch(_){}
    const roster = VF.PlayableRoster;
    if(roster && roster.previewUrl){
      if(opts.def) return roster.previewUrl(opts.def);
      if(opts.av && roster.get){
        const def = roster.get(opts.av);
        if(def) return roster.previewUrl(def);
      }
    }
    try{
      if(typeof photoBlkSrc === 'function') return photoBlkSrc();
    }catch(_){}
    return '';
  };
  VF._t.letterDist = function(p, letters){
    let best = Infinity;
    const list = letters || [];
    for(let i = 0; i < list.length; i++){
      const it = list[i];
      if(!it || it.taken) continue;
      const d = Math.hypot((it.x || 0) - (p.x || 0), (it.z || 0) - (p.z || 0));
      if(d < best) best = d;
    }
    return best;
  };
  VF._t.collusionJudge = function(opts){
    opts = opts || {};
    const people = (opts.people || []).filter(function(p){ return p && p.alive !== false; });
    if(people.length < 2) return {hit: false, extra: 0, ids: [], reason: 'solo'};
    const letters = (opts.letters || []).filter(function(it){ return it && !it.taken; });
    if(!letters.length) return {hit: false, extra: 0, ids: [], reason: 'no-letters'};
    const contestR = opts.contestR != null ? opts.contestR : (VF.COLLUSION_CONTEST || 28);
    const escortR = opts.escortR != null ? opts.escortR : (VF.COLLUSION_ESCORT || 48);
    const rows = people.map(function(p){
      const near = VF._t.letterDist(p, letters);
      return {id: p.id || '', x: p.x || 0, z: p.z || 0, near: near, contest: near <= contestR};
    });
    const farmers = rows.filter(function(r){ return r.contest; });
    const idlers = rows.filter(function(r){ return !r.contest; });
    if(!farmers.length || !idlers.length) return {hit: false, extra: 0, ids: [], reason: 'fair'};
    const escorts = idlers.filter(function(idle){
      for(let i = 0; i < farmers.length; i++){
        if(Math.hypot(idle.x - farmers[i].x, idle.z - farmers[i].z) <= escortR) return true;
      }
      return false;
    });
    if(!escorts.length) return {hit: false, extra: 0, ids: [], reason: 'far'};
    const ids = [];
    farmers.concat(escorts).forEach(function(r){
      if(r.id && ids.indexOf(r.id) < 0) ids.push(r.id);
    });
    const extra = Math.min(VF.COLLUSION_CAP || 8, (VF.COLLUSION_HUNTERS || 4) + escorts.length);
    return {hit: true, extra: extra, ids: ids, reason: 'escort'};
  };
  VF._t.makeCollusionWatch = function(){
    let dwell = 0, cool = 0;
    return {
      sample: function(snap, dt){
        snap = snap || {};
        dt = dt || 0;
        cool = Math.max(0, cool - dt);
        const judge = VF._t.collusionJudge(snap);
        if(!judge.hit){
          dwell = Math.max(0, dwell - dt * 1.6);
          return {hit: false, justArmed: false, extra: 0, ids: [], dwell: dwell, cool: cool};
        }
        dwell += dt;
        const need = snap.needSec != null ? snap.needSec : (VF.COLLUSION_SEC || 6);
        if(dwell >= need && cool <= 0){
          cool = VF.COLLUSION_COOL || 16;
          dwell = 0;
          return {hit: true, justArmed: true, extra: judge.extra, ids: judge.ids, dwell: 0, cool: cool};
        }
        return {hit: false, justArmed: false, extra: 0, ids: judge.ids, dwell: dwell, cool: cool};
      },
      reset: function(){ dwell = 0; cool = 0; }
    };
  };
})(typeof window !== 'undefined' ? window : globalThis);
