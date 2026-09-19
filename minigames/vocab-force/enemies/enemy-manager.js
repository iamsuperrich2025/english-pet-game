"use strict";
(function(root){
  const VF = root.VocabForce = root.VocabForce || {};

  function EnemyManager(){
    this.list = [];
    this.scene = null;
    this.spread = 3.2;
    this.wave = {};
    this.waveOn = false;
    this._spawnWait = 0;
    this._opened = {};
  }

  EnemyManager.prototype.attach = function(scene){
    this.scene = scene;
    return this;
  };

  EnemyManager.prototype.clear = function(){
    this.list.forEach(en => {
      if(en.bar && en.bar.dispose) en.bar.dispose();
      if(en.mesh && en.mesh.parent) en.mesh.parent.remove(en.mesh);
      if(en.mesh && en.mesh.userData && en.mesh.userData.letterTex) en.mesh.userData.letterTex.dispose();
    });
    this.list = [];
    this.wave = {};
    this.waveOn = false;
    this._spawnWait = 0;
    this._opened = {};
  };

  EnemyManager.prototype.place = function(x, z, used){
    let px = x, pz = z, guard = 0;
    while(guard++ < 12){
      const clash = used.some(p => Math.hypot(p.x - px, p.z - pz) < this.spread);
      if(!clash) break;
      px += VF.rand(-4, 4); pz += VF.rand(-4, 4);
    }
    used.push({x: px, z: pz});
    return {x: px, z: pz};
  };

  EnemyManager.prototype.spawnLetters = function(THREE, letters, arena){
    this.clear();
    const used = [];
    const spots = (arena && arena.spawnPoints) ? arena.spawnPoints.slice() : [
      {x: 8, z: -6}, {x: -9, z: 4}, {x: 12, z: 9}, {x: -6, z: -11}, {x: 0, z: 14}
    ];
    letters.forEach((ch, i) => {
      const base = spots[i % spots.length];
      const pos = this.place(base.x + (i * 1.7) % 5, base.z - (i % 3) * 2.4, used);
      const en = new VF.ZombieEnemy({letter: ch, x: pos.x, z: pos.z, y: arena && arena.surfaceY ? arena.surfaceY(pos.x, pos.z) : 0});
      this.scene.add(en.mesh);
      if(en.bar) en.bar.attach(this.scene);
      this.list.push(en);
    });
    return this.list;
  };

  EnemyManager.prototype.waveCap = function(){
    return VF.HUNTER_PER_PLAYER || 20;
  };

  EnemyManager.prototype.waveCount = function(id){
    return this.wave[id || 'local'] || 0;
  };

  EnemyManager.prototype.waveOpen = function(id){
    return this.waveCount(id) < this.waveCap();
  };

  EnemyManager.prototype.noteWaveSpawn = function(id){
    const key = id || 'local';
    this.wave[key] = (this.wave[key] || 0) + 1;
    return this.wave[key];
  };

  EnemyManager.prototype.liveHunterCount = function(){
    return this.list.filter(function(en){ return en && en.alive && en.hunter && !en.collusion; }).length;
  };

  EnemyManager.prototype.pickHuntTarget = function(people){
    const marks = (people || []).filter(function(p){ return p && p.alive !== false; });
    let pick = null, best = Infinity;
    for(let i = 0; i < marks.length; i++){
      const p = marks[i];
      const n = this.waveCount(p.id);
      if(n < this.waveCap() && n < best){
        best = n;
        pick = p;
      }
    }
    return pick;
  };

  EnemyManager.prototype.resetHunterWave = function(){
    this.list.slice().forEach(en => {
      if(en && (en.hunter || en.collusion) && !en.letter) this.remove(en);
    });
    this.wave = {};
    this.waveOn = true;
    this._spawnWait = 0;
    this._opened = {};
    return this;
  };

  EnemyManager.prototype.makeHunter = function(opts){
    if(!VF.ZombieEnemy) return null;
    if(VF.ZomAssets && VF.ZomAssets.ready && !VF.ZomAssets.ready()) return null;
    if(VF.ZomAssets && typeof VF.ZomAssets.spawn !== 'function') return null;
    return new VF.ZombieEnemy(opts);
  };

  EnemyManager.prototype.spawnOneAround = function(target, arena, angHint){
    if(!target || !this.waveOpen(target.id)) return null;
    if(this.liveHunterCount() >= (VF.HUNTER_LIVE_CAP || 50)) return null;
    const id = target.id || 'local';
    const step = this.waveCount(id);
    const ang = angHint != null ? angHint : (step * 2.39996 + VF.rand(-0.2, 0.2));
    const rad = VF.rand(VF.HUNTER_RING_MIN || 12, VF.HUNTER_RING_MAX || 19);
    const used = this.list.filter(function(en){ return en.alive; }).map(function(en){ return {x: en.x, z: en.z}; });
    const pos = this.place((target.x || 0) + Math.cos(ang) * rad, (target.z || 0) + Math.sin(ang) * rad, used);
    const en = this.makeHunter({
      letter: '',
      x: pos.x,
      z: pos.z,
      y: arena && arena.surfaceY ? arena.surfaceY(pos.x, pos.z) : 0,
      hunter: true,
      preyId: id,
      detect: VF.HUNTER_DETECT || 36,
      walkSpeed: 1.75
    });
    if(!en) return null;
    this.noteWaveSpawn(id);
    if(this.scene && en.mesh) this.scene.add(en.mesh);
    if(en.bar && en.bar.attach) en.bar.attach(this.scene);
    this.list.push(en);
    return en;
  };

  EnemyManager.prototype.tickHuntSpawn = function(dt, people, arena){
    if(!this.waveOn) return this.list;
    this._spawnWait -= dt;
    if(this._spawnWait > 0) return this.list;
    if(this.liveHunterCount() >= (VF.HUNTER_LIVE_CAP || 50)){
      this._spawnWait = 0.4;
      return this.list;
    }
    const marks = (people || []).filter(function(p){ return p && p.alive !== false; });
    if(!marks.length) return this.list;
    let made = 0;
    for(let i = 0; i < marks.length; i++){
      const p = marks[i];
      const key = p.id || 'local';
      if(this._opened[key]) continue;
      const burst = Math.min(VF.HUNTER_OPEN || 4, this.waveCap());
      const slice = Math.PI * 2 / burst;
      const spin = VF.rand(0, Math.PI * 2);
      let got = 0;
      for(let n = 0; n < burst; n++){
        if(this.spawnOneAround(p, arena, spin + slice * n)) got++;
      }
      if(!got) continue;
      this._opened[key] = true;
      made += got;
    }
    if(made){
      this._spawnWait = VF.HUNTER_SPAWN_SEC || 0.65;
      return this.list;
    }
    let added = 0;
    const maxBurst = 1;
    while(added < maxBurst){
      const pick = this.pickHuntTarget(marks);
      if(!pick) break;
      if(!this.spawnOneAround(pick, arena)) break;
      added++;
    }
    this._spawnWait = added ? (VF.HUNTER_SPAWN_SEC || 0.65) : 0.45;
    return this.list;
  };

  EnemyManager.prototype.spawnHunters = function(count, arena){
    return this.list;
  };

  EnemyManager.prototype.spawnCollusionHunters = function(count, arena, around){
    const want = Math.max(0, count | 0);
    if(!want) return this.list;
    const prey = (around || []).filter(function(p){ return p && p.alive !== false; });
    const marks = prey.length ? prey : [{id: '', x: 0, z: 0}];
    const have = this.list.filter(function(en){ return en.alive && en.collusion; }).length;
    const add = Math.min(want, Math.max(0, (VF.COLLUSION_CAP || 8) - have));
    const used = this.list.filter(function(en){ return en.alive; }).map(function(en){ return {x: en.x, z: en.z}; });
    for(let i = 0; i < add; i++){
      const target = marks[i % marks.length];
      const ang = VF.rand(0, Math.PI * 2);
      const rad = VF.rand(8, 16);
      const pos = this.place((target.x || 0) + Math.cos(ang) * rad, (target.z || 0) + Math.sin(ang) * rad, used);
      const en = new VF.ZombieEnemy({
        letter: '',
        x: pos.x,
        z: pos.z,
        y: arena && arena.surfaceY ? arena.surfaceY(pos.x, pos.z) : 0,
        hunter: true,
        collusion: true,
        preyId: target.id || '',
        detect: 48,
        walkSpeed: 2.9
      });
      if(this.scene) this.scene.add(en.mesh);
      if(en.bar) en.bar.attach(this.scene);
      this.list.push(en);
    }
    return this.list;
  };

  EnemyManager.prototype.setPrey = function(list){
    this.prey = list || [];
    return this;
  };

  EnemyManager.prototype._preyFor = function(en, player){
    const list = this.prey || [];
    let chosen = null;
    if(en && en.preyId){
      for(let i = 0; i < list.length; i++){
        if(list[i].id === en.preyId && list[i].alive !== false){ chosen = list[i]; break; }
      }
    }
    if(!chosen && en && en.collusion){
      let best = Infinity;
      for(let i = 0; i < list.length; i++){
        const p = list[i];
        if(!p || p.alive === false) continue;
        const d = Math.hypot((p.x || 0) - (en.x || 0), (p.z || 0) - (en.z || 0));
        if(d < best){ best = d; chosen = p; }
      }
    }
    if(chosen && chosen.local !== false && player) return player;
    return chosen || player;
  };

  EnemyManager.prototype.billboard = function(camera){
    this.list.forEach(function(en){
      if(en && en.bar && en.bar.follow) en.bar.follow(en.x, en.y, en.z, camera);
    });
  };

  EnemyManager.prototype.respawn = function(THREE, letter, arena){
    const used = this.list.filter(function(en){ return en.alive; }).map(function(en){ return {x: en.x, z: en.z}; });
    const spots = (arena && arena.spawnPoints) ? arena.spawnPoints : [{x: 8, z: -6}];
    const base = spots[(this.list.length) % spots.length];
    const pos = this.place(base.x + VF.rand(-3, 3), base.z + VF.rand(-3, 3), used);
    const en = new VF.ZombieEnemy({
      letter: letter,
      x: pos.x,
      z: pos.z,
      y: arena && arena.surfaceY ? arena.surfaceY(pos.x, pos.z) : 0
    });
    this.scene.add(en.mesh);
    if(en.bar) en.bar.attach(this.scene);
    this.list.push(en);
    return en;
  };

  EnemyManager.prototype.hurtInSphere = function(origin, radius, info){
    const hit = [];
    const payload = info || {};
    payload.origin = origin;
    this.list.forEach(en => {
      if(!en || en.burstFinisherTriggered || en.state === 'gone') return;
      if(!en.alive && en.state !== 'dying') return;
      const d = Math.hypot(en.x - origin.x, en.z - origin.z);
      if(d <= radius + en.radius){
        if(en.applyHit(payload)) hit.push(en);
      }
    });
    return hit;
  };

  EnemyManager.prototype.tick = function(dt, player, arena){
    const dead = [];
    const lands = [];
    const impacts = [];
    const fires = [];
    const bites = [];
    this.list.forEach(en => {
      en.tick(dt, this._preyFor(en, player), arena);
      if(en.pendingBite){
        bites.push({en: en, damage: en.pendingBite});
        en.pendingBite = 0;
      }
      if(en.pendingImpacts && en.pendingImpacts.length){
        for(let i = 0; i < en.pendingImpacts.length; i++) impacts.push(en.pendingImpacts[i]);
        en.pendingImpacts = [];
      }
      if(en.pendingDeathFire){
        fires.push(en.pendingDeathFire);
        en.pendingDeathFire = null;
      }
      if(en.justLanded){
        lands.push(en.justLanded);
        en.justLanded = null;
      }
      if(!en.alive && en.state === 'dying' && (en.burstFinisherTriggered || en.deathReady || (en.deathT || 0) >= 2.2)){
        en.state = 'dead';
      }
      if(!en.alive && en.state === 'dead'){
        en.state = 'gone';
        dead.push(en);
      }
    });
    const live = this.list.filter(function(en){ return en.alive; });
    for(let i = 0; i < live.length; i++){
      for(let j = i + 1; j < live.length; j++){
        const a = live[i], b = live[j];
        let dx = b.x - a.x, dz = b.z - a.z;
        let d = Math.hypot(dx, dz);
        const min = this.spread;
        if(d < 0.001){ dx = 0.7; dz = 0.4; d = Math.hypot(dx, dz); }
        if(d < min){
          const push = (min - d) * 0.5;
          dx /= d; dz /= d;
          a.x -= dx * push; a.z -= dz * push;
          b.x += dx * push; b.z += dz * push;
          a.mesh.position.set(a.x, a.y, a.z);
          b.mesh.position.set(b.x, b.y, b.z);
        }
      }
    }
    return {dead: dead, lands: lands, impacts: impacts, fires: fires, bites: bites};
  };

  EnemyManager.prototype.nearestLetter = function(ch, ox, oz){
    const want = String(ch || '').slice(0, 1).toUpperCase();
    if(!want) return null;
    let best = null, bestD = Infinity;
    for(let i = 0; i < this.list.length; i++){
      const en = this.list[i];
      if(!en || en._collected || en.state === 'gone') continue;
      if(en.letter !== want) continue;
      const d = Math.hypot((en.x || 0) - (ox || 0), (en.z || 0) - (oz || 0));
      if(d < bestD){ best = en; bestD = d; }
    }
    return best;
  };

  EnemyManager.prototype.remove = function(en){
    this.list = this.list.filter(function(item){ return item !== en; });
    if(en && en.bar && en.bar.dispose) en.bar.dispose();
    if(en.mesh && en.mesh.parent) en.mesh.parent.remove(en.mesh);
    if(en.mesh && en.mesh.userData && en.mesh.userData.letterTex) en.mesh.userData.letterTex.dispose();
  };

  VF.EnemyManager = EnemyManager;
})(typeof window !== 'undefined' ? window : globalThis);
