"use strict";
/* รอบ 1593: Hostile orb field — ลูกพลังที่มุ่งร้ายต่อผู้เล่นคนนี้ 3 ทีม
   · 'enemy' ลูกพลังซอมบี้ (ทำดาเมจผู้เล่นคนนี้)
   · 'peer'  ลูกพลังที่เพื่อนยิง (visual ซิงก์ออนไลน์ — ไม่ทำดาเมจซ้ำ เพราะเจ้าของยิงดาเมจอยู่แล้ว)
   · 'player' ลูกพลังที่ถูก "ปัด" เป็นของเราแล้ว — โดนซอมบี้/ผู้เล่นอื่น/รถได้เหมือนลูกพลังปุ่ม ATTACK */
(function(root){
  const VF = root.VocabForce = root.VocabForce || {};

  function HostileOrbManager(){
    this.group = null;
    this.pool = [];
    this.live = [];
    this._vehicles = null;
    /* รอบ 1596: เวลาที่ลูกพลัง "เพื่อน" ล่าสุดเคลื่อนผ่านใกล้ตัวผู้เล่น (ใช้เปิดหน้าต่างกันดาเมจ
       ตอนกดปัด — ลูกเพื่อนวิ่ง ~420 หน่วย/วิ ผ่านรัศมีปัดในเสี้ยววินาที จับที่ hitAt อย่างเดียวไม่ทัน) */
    this._peerNearAt = 0;
  }

  HostileOrbManager.prototype.attach = function(scene){
    const THREE = root.THREE;
    const T = VF.DeflectTune || {};
    this.group = new THREE.Group();
    this.group.name = 'VFHostileOrbs';
    scene.add(this.group);
    this.coreGeo = new THREE.SphereGeometry(0.14, 10, 8);
    this.shellGeo = new THREE.SphereGeometry(0.24, 10, 8);
    const n = T.POOL || 12;
    for(let i = 0; i < n; i++){
      const core = new THREE.Mesh(this.coreGeo, new THREE.MeshBasicMaterial({color: 0xff6a4a, transparent: true, opacity: 1, depthWrite: false}));
      const shell = new THREE.Mesh(this.shellGeo, new THREE.MeshBasicMaterial({color: 0xff8a50, transparent: true, opacity: 0.4, depthWrite: false}));
      core.visible = false; shell.visible = false;
      this.group.add(core, shell);
      this.pool.push({core: core, shell: shell, life: 0, x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, team: '', delay: 0, dist: 0});
    }
    return this;
  };

  HostileOrbManager.prototype.setVehicles = function(sedan, tanker){
    this._vehicles = {sedan: sedan || null, tanker: tanker || null};
  };

  HostileOrbManager.prototype._take = function(){
    for(let i = 0; i < this.pool.length; i++){
      if(this.pool[i].life <= 0 && this.pool[i].delay <= 0) return this.pool[i];
    }
    return null;
  };

  HostileOrbManager.prototype._paint = function(orb){
    let core = 0xff6a4a, shell = 0xff8a50;
    if(orb.team === 'peer'){ core = 0xb8fff8; shell = 0x3ee0c8; }
    else if(orb.team === 'player'){ core = 0xffe08a; shell = 0xffc14a; }
    orb.core.material.color.setHex(core);
    orb.shell.material.color.setHex(shell);
  };

  HostileOrbManager.prototype._launch = function(orb){
    orb.life = orb.maxLife;
    orb.dist = 0;
    orb.core.visible = true; orb.shell.visible = true;
    orb.core.position.set(orb.x, orb.y, orb.z);
    orb.shell.position.set(orb.x, orb.y, orb.z);
    this._paint(orb);
    if(this.live.indexOf(orb) < 0) this.live.push(orb);
  };

  /* ซอมบี้พ่นลูกพลัง */
  HostileOrbManager.prototype.spawnEnemy = function(x, y, z, dirX, dirY, dirZ, speed, dmg){
    const orb = this._take();
    if(!orb) return null;
    const T = VF.DeflectTune || {};
    orb.team = 'enemy';
    orb.x = x; orb.y = y; orb.z = z;
    const n = Math.hypot(dirX, dirY, dirZ) || 1;
    orb.vx = dirX / n * speed; orb.vy = dirY / n * speed; orb.vz = dirZ / n * speed;
    orb.dmg = dmg != null ? dmg : (T.ZOMBIE_SPIT_DAMAGE || 120);
    orb.delay = 0;
    orb.maxLife = 4.5;
    orb.peerTail = ''; orb.burst = 0; orb.index = 0;
    return this._launch(orb);
  };

  /* ลูกพลังเพื่อนที่ซิงก์มา (visual) — peerTail/burst/index ใช้ตอนปัดแล้วส่ง ack กลับเจ้าของ */
  HostileOrbManager.prototype.spawnPeer = function(peerTail, burst, index, x, y, z, dirX, dirY, dirZ, speed, delay, chargeFrac){
    const orb = this._take();
    if(!orb) return null;
    orb.team = 'peer';
    orb.x = x; orb.y = y; orb.z = z;
    const n = Math.hypot(dirX, dirY, dirZ) || 1;
    orb.vx = dirX / n * speed; orb.vy = dirY / n * speed; orb.vz = dirZ / n * speed;
    orb.dmg = 0;
    orb.delay = (delay || 0) / 1000;
    orb.maxLife = ((VF.EnergyAttackTune && VF.EnergyAttackTune.maxRange) || 400) / Math.max(8, speed) + 0.4;
    orb.peerTail = peerTail || '';
    orb.burst = burst || 0;
    orb.index = index || 0;
    const s = 1 + (chargeFrac || 0) * 1.4;
    orb.core.scale.set(s, s, s); orb.shell.scale.set(s * 1.2, s * 1.2, s * 1.2);
    return this._launch(orb);
  };

  /* ปัด: หลุดจากสนามรับ → กลายเป็นของเรา พุ่งไปทิศที่กำหนด */
  HostileOrbManager.prototype.redirect = function(orb, dirX, dirZ, speed){
    if(!orb) return false;
    const T = VF.DeflectTune || {};
    const n = Math.hypot(dirX, 0, dirZ) || 1;
    orb.vx = dirX / n * speed; orb.vy = 0; orb.vz = dirZ / n * speed;
    orb.team = 'player';
    orb.life = T.DEFLECTED_LIFE || 2.4;
    orb.maxLife = orb.life;
    orb.dist = 0;
    orb.delay = 0;
    orb.core.scale.set(1.25, 1.25, 1.25); orb.shell.scale.set(1.5, 1.5, 1.5);
    this._paint(orb);
    return true;
  };

  /* รับเฉพาะลูกที่อยู่ใน RANGE และแนวหน้าตัว (dot ≥ ARC_DOT) */
  HostileOrbManager.prototype.scan = function(player, range, arcDot){
    const out = [];
    if(!player) return out;
    const f = player.forward ? player.forward() : {x: 0, z: 1};
    for(let i = 0; i < this.live.length; i++){
      const orb = this.live[i];
      if(orb.team !== 'enemy' && orb.team !== 'peer') continue;
      if(orb.delay > 0) continue;
      const dx = orb.x - player.x, dz = orb.z - player.z;
      const d = Math.hypot(dx, dz);
      if(d > range) continue;
      const dn = d || 1;
      if((dx / dn) * f.x + (dz / dn) * f.z < (arcDot != null ? arcDot : 0.1)) continue;
      out.push(orb);
    }
    return out;
  };

  HostileOrbManager.prototype.killQuiet = function(orb){
    if(!orb) return;
    orb.life = 0; orb.delay = 0;
    orb.core.visible = false; orb.shell.visible = false;
    const i = this.live.indexOf(orb);
    if(i >= 0) this.live.splice(i, 1);
  };

  HostileOrbManager.prototype._impact = function(deps, x, y, z, big){
    const fx = deps.fx;
    if(!fx) return;
    if(fx.arenaFire) fx.arenaFire(x, y, z, {r: big ? 2.2 : 1.1});
    if(fx._spawn){
      fx._spawn('ring', x, 0.06, z, 0.36, {role: 'shock', rotX: -Math.PI / 2, startR: 0.3, endR: big ? 2.4 : 1.2, color: big ? 0xffc14a : 0xff8a50, opacity: 0.75, add: true});
    }
  };

  HostileOrbManager.prototype._hitVehicles = function(orb, rad, deps){
    const v = this._vehicles;
    if(!v) return false;
    const audio = deps.audio, cam = deps.cam, fx = deps.fx;
    const names = ['tanker', 'sedan'];
    for(let n = 0; n < names.length; n++){
      const veh = v[names[n]];
      if(!veh || !veh.ready || !veh.collider || veh.collider.broken) continue;
      if(typeof veh.detonate !== 'function') continue;
      const c = veh.collider;
      if(orb.x >= c.minx - rad && orb.x <= c.maxx + rad &&
         orb.z >= c.minz - rad && orb.z <= c.maxz + rad &&
         orb.y <= (c.maxy || 4.8) + rad && orb.y >= -rad){
        veh.detonate(fx, audio, cam);
        this._impact(deps, orb.x, orb.y, orb.z, true);
        if(audio && audio.arenaFire) audio.arenaFire();
        if(cam && cam.impulse) cam.impulse(1.2, 6, {low: true});
        return true;
      }
    }
    return false;
  };

  HostileOrbManager.prototype.tick = function(dt, deps){
    deps = deps || {};
    const T = VF.DeflectTune || {};
    const player = deps.player;
    const pr = (VF.GunTune && VF.GunTune.PLAYER_R) || 0.62;
    const arena = deps.arena;
    for(let i = this.live.length - 1; i >= 0; i--){
      const orb = this.live[i];
      if(orb.delay > 0){
        orb.delay -= dt;
        if(orb.delay > 0) continue;
      }
      let dead = false;
      const speed = Math.hypot(orb.vx, orb.vy, orb.vz) || 1;
      const move = speed * Math.min(dt, 0.05);
      const slices = Math.max(1, Math.ceil(move / 0.3));
      const sx = orb.vx * dt / slices, sy = orb.vy * dt / slices, sz = orb.vz * dt / slices;
      for(let s = 0; s < slices && !dead; s++){
        orb.x += sx; orb.y += sy; orb.z += sz;
        orb.dist += Math.hypot(sx, sy, sz);
        /* ลูกพลังที่ปัดแล้ว (ของเรา): โดนรถ = ระเบิด เหมือนลูกพลังปุ่ม ATTACK */
        if(orb.team === 'player' && this._hitVehicles(orb, 0.35, deps)){ dead = true; break; }
        if(arena && arena.collide){
          const c = arena.collide(orb.x, orb.y, orb.z, 0.3);
          const corr = Math.hypot(c.x - orb.x, c.z - orb.z);
          if(c.wall || corr > 0.12){
            this._impact(deps, orb.x, orb.y, orb.z, orb.team === 'player');
            if(deps.audio && deps.audio.energyWallImpact) deps.audio.energyWallImpact();
            dead = true; break;
          }
        }
        /* enemy: โดนตัวเรา */
        if(orb.team === 'enemy' && player && player.alive !== false){
          const d = Math.hypot((player.x || 0) - orb.x, (player.z || 0) - orb.z);
          if(d <= 0.3 + pr && Math.abs((player.y || 0) + 0.9 - orb.y) < 1.7){
            if(typeof player.takeHit === 'function'){
              const dmg = player.takeHit(orb.dmg, !!player.blocking, {from: 'zombie'});
              if(dmg > 0 && deps.onPlayerHurt) deps.onPlayerHurt(dmg);
            }
            this._impact(deps, orb.x, orb.y, orb.z, false);
            if(deps.audio && deps.audio.energyHit) deps.audio.energyHit();
            dead = true; break;
          }
        }
        /* player (ปัดแล้ว): โดนผู้เล่นอื่น */
        if(orb.team === 'player'){
          const folks = deps.people || [];
          for(let p = 0; p < folks.length && !dead; p++){
            const peer = folks[p];
            if(!peer || peer.local || peer.alive === false) continue;
            const d = Math.hypot((peer.x || 0) - orb.x, (peer.z || 0) - orb.z);
            if(d > 0.35 + pr) continue;
            if(VF._t.notePvpHit) VF._t.notePvpHit(player, {kind: 'G', zone: 'body', targetId: peer.id, dmg: T.DEFLECTED_PVP_DMG || 300});
            this._impact(deps, orb.x, orb.y, orb.z, true);
            if(deps.audio && deps.audio.energyHit) deps.audio.energyHit();
            dead = true;
          }
          /* โดนซอมบี้ */
          const list = deps.enemies && deps.enemies.list ? deps.enemies.list : [];
          for(let e = 0; e < list.length && !dead; e++){
            const en = list[e];
            if(!en || en.burstFinisherTriggered || en.state === 'gone') continue;
            if(!en.alive && en.state !== 'dying') continue;
            const d = Math.hypot(en.x - orb.x, en.z - orb.z);
            if(d <= 0.35 + (en.radius || 0.7) && Math.abs((en.y || 0) + 0.9 - orb.y) < 1.6){
              if(typeof en.applyHit === 'function'){
                en.applyHit({
                  damage: T.DEFLECTED_ZOMBIE_DMG || 120,
                  force: 26, lift: 3.6,
                  dir: {x: orb.vx, z: orb.vz},
                  origin: {x: orb.x, y: orb.y, z: orb.z},
                  kind: 'energy', reaction: 'launch', level: 'MEDIUM'
                });
              }
              this._impact(deps, orb.x, orb.y, orb.z, true);
              if(deps.audio && deps.audio.energyHit) deps.audio.energyHit();
              dead = true;
            }
          }
        }
      }
      /* รอบ 1596: ลูกพลัง "เพื่อน" เคลื่อนผ่านใกล้ตัว — ตราเวลาไว้ให้หน้าต่างกันดาเมจตอนกดปัด
         (ลูกเพื่อนวิ่ง ~420 หน่วย/วิ ผ่านรัศมีปัดในเสี้ยววินาที รอจับที่ hitAt อย่างเดียวไม่ทัน) */
      if(!dead && orb.team === 'peer' && player && player.alive !== false){
        const dnp = Math.hypot((player.x || 0) - orb.x, (player.z || 0) - orb.z);
        if(dnp <= (T.PEER_NEAR || 2.4)) this._peerNearAt = VF.now();
      }
      if(dead){ this.killQuiet(orb); continue; }
      if(orb.dist >= (orb.maxLife || 3) * speed || (orb.life -= Math.min(dt, 0.05)) <= 0){
        if(orb.team !== 'peer') this._impact(deps, orb.x, orb.y, orb.z, orb.team === 'player');
        this.killQuiet(orb); continue;
      }
      orb.core.position.set(orb.x, orb.y, orb.z);
      orb.shell.position.set(orb.x, orb.y, orb.z);
      orb.shell.rotation.y += dt * 6;
    }
  };

  HostileOrbManager.prototype.dispose = function(){
    this.live.slice().forEach(function(o){ o.core.visible = false; o.shell.visible = false; o.life = 0; });
    this.live = [];
  };

  VF.HostileOrbManager = HostileOrbManager;
})(typeof window !== 'undefined' ? window : globalThis);
