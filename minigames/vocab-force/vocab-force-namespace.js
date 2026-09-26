"use strict";
/* Vocab Force — shared namespace. No gameplay loop lives here. */
(function(root){
  const VF = root.VocabForce = root.VocabForce || {};
  VF.basePath = VF.basePath || 'minigames/vocab-force/';
  VF.asset = function(rel){
    const base = VF.basePath.endsWith('/') ? VF.basePath : VF.basePath + '/';
    return base + String(rel || '').replace(/^\.\//, '').replace(/^\//, '');
  };
  /* รอบ 1569: GLTFLoader ไม่ได้อยู่ใน three.min.js — helper กลาง lazy-load js/vendor/GLTFLoader.js
     (รถยนต์/รถน้ำมันเคย reject เงียบ 'GLTFLoader missing' ทั้งคู่จนมองไม่เห็นโมเดลบนจริง) */
  VF.ensureGLTFLoader = function(){
    const T0 = root.THREE;
    if(T0 && T0.GLTFLoader) return Promise.resolve(T0);
    if(VF._gltfLoaderPromise) return VF._gltfLoaderPromise;
    const src = (VF.vendorPath || 'js/vendor/') + 'GLTFLoader.js';
    VF._gltfLoaderPromise = new Promise(function(resolve, reject){
      const done = function(){
        const T = root.THREE;
        if(T && T.GLTFLoader){ resolve(T); return; }
        VF._gltfLoaderPromise = null;
        reject(new Error('GLTFLoader missing'));
      };
      const fail = function(err){ VF._gltfLoaderPromise = null; reject(err || new Error('GLTFLoader failed: ' + src)); };
      if(typeof loadScriptOnce === 'function') loadScriptOnce(src).then(done).catch(fail);
      else{
        const s = document.createElement('script');
        s.src = src;
        s.onload = done;
        s.onerror = fail;
        document.head.appendChild(s);
      }
    });
    return VF._gltfLoaderPromise;
  };
  VF.clamp = function(v, a, b){ return Math.max(a, Math.min(b, v)); };
  VF.lerp = function(a, b, t){ return a + (b - a) * t; };
  VF.rand = function(a, b){ return a + Math.random() * (b - a); };
  VF.now = function(){ return (root.performance && performance.now) ? performance.now() : Date.now(); };
  VF.LETTER_REWARD = 1000;
  VF.PLAYER_HP = 1000;
  VF.ZOMBIE_HP = 36;
  VF.ZOMBIE_BITE = 80;
  VF.BLOCK_PVE = 0.22;
  VF.BLOCK_PVP = 0.38;
  VF.HUNTER_PER_PLAYER = 5;
  VF.HUNTER_OPEN = 2;
  VF.HUNTER_SPAWN_SEC = 0.65;
  VF.HUNTER_RING_MIN = 12;
  VF.HUNTER_RING_MAX = 19;
  VF.HUNTER_DETECT = 36;
  VF.HUNTER_LIVE_CAP = 50;
  VF.HUNTER_SKIP_HUMANS = 5;
  VF.MAP_SCALE = 10;
  VF.ARENA_HALF = 280;
  VF.CAMERA_FAR = 980;
  VF.SKY_RADIUS = 420;
  VF.NET_MAP = 'vforce';
  VF.ROOM_MAX = 14;
  VF.ROOMS_MAX = 36;
  VF.WIN_ACK_SEC = 8;
  VF.COLLUSION_SEC = 6;
  VF.COLLUSION_CONTEST = 28;
  VF.COLLUSION_ESCORT = 48;
  VF.COLLUSION_HUNTERS = 4;
  VF.COLLUSION_CAP = 8;
  VF.COLLUSION_COOL = 16;
  VF.DPR_CAP = 1.5;
  VF.TANKER_DAMAGE = 500;
  VF.TANKER_SPAWN = {x: 84, z: -18, yaw: Math.PI * 0.5};
  VF.SEDAN_DAMAGE = 100;
  VF.SEDAN_SPAWN = {x: -62, z: 58, yaw: 2.2};
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
    'combat/gun-tune.js',
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
    'map/oil-tanker-controller.js',
    'map/sedan-controller.js',
    'map/vehicle-grab.js',
    'runtime/vocab-force-audio.js',
    'runtime/vocab-force-net.js',
    'runtime/vocab-force-spectator.js',
    'runtime/vocab-force-runtime.js'
  ];
  VF._t = VF._t || {};
  VF._t.wordReward = function(here){
    const players = VF.clamp(Math.floor(Number(here) || 1), 1, VF.ROOM_MAX || 14);
    if(players <= 5) return 1000;
    if(players <= 10) return 3000;
    return 10000;
  };
  VF._t.wantHunters = function(here){
    return (here == null ? 1 : here) < (VF.HUNTER_SKIP_HUMANS || 5);
  };
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
  VF._t.roomHud = function(info){
    info = info || {};
    const cap = info.cap != null ? info.cap : (VF.ROOM_MAX || 14);
    const here = Math.max(1, info.here || 1);
    if(info.full) return 'ลานเต็ม · เล่นคนเดียว';
    if(info.searching) return 'กำลังหาลาน…';
    const lot = parseInt(info.lot, 10);
    if(info.legacy || !isFinite(lot) || lot < 1) return 'ลานฝึก · ' + here + ' คน';
    return 'ลาน ' + lot + ' · ' + here + '/' + cap + ' คน';
  };
  VF._t.nextOpenRoom = function(filled, per, cap){
    const max = per != null ? per : (VF.ROOM_MAX || 14);
    const n = cap != null ? cap : (VF.ROOMS_MAX || 36);
    const rows = filled || [];
    for(let i = 0; i < n; i++){
      if((rows[i] || 0) < max) return i;
    }
    return -1;
  };
  VF._t.stableHash = function(raw){
    const s = String(raw == null ? '' : raw);
    let h = 2166136261;
    for(let i = 0; i < s.length; i++){
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  };
  VF._t.fairSpawn = function(ids, myId, seed, arena, avoid){
    const list = (ids || []).filter(Boolean).map(String).sort();
    const mine = String(myId || list[0] || 'local');
    if(list.indexOf(mine) < 0) list.push(mine);
    list.sort();
    const count = Math.max(1, list.length);
    const index = Math.max(0, list.indexOf(mine));
    const turn = ((VF._t.stableHash(seed || 1) % 360) / 180) * Math.PI;
    const minAvoid = (avoid && avoid.radius) || 18;
    for(let ring = 0; ring < 4; ring++){
      const radius = 34 + ring * 12;
      const angle = turn + index * Math.PI * 2 / count;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      if(avoid && Math.hypot(x - avoid.x, z - avoid.z) < minAvoid) continue;
      if(arena && arena.collide){
        const hit = arena.collide(x, 0, z, 0.9);
        if(hit.wall || Math.hypot(hit.x - x, hit.z - z) > 0.08) continue;
      }
      return {x: x, z: z, y: arena && arena.surfaceY ? arena.surfaceY(x, z) : 0, yaw: angle + Math.PI};
    }
    return {x: 0, z: 0, y: arena && arena.surfaceY ? arena.surfaceY(0, 0) : 0, yaw: turn};
  };
})(typeof window !== 'undefined' ? window : globalThis);
