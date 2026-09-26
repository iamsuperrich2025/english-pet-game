"use strict";
/* รอบ 1589: Ground Slam controller — กดปุ่ม SLAM → เล่นท่า groundSlam (GLB จริงของแต่ละตัวละคร)
   ตอน hitAt เส้นเปลวเพลิงสีฟ้าพุ่งยาวเป็นเส้นตรงบนพื้นตามทิศหน้าตัวละคร (ยาวเท่าวิถี overdrive dash)
   · ผู้เล่นคนอื่นที่อยู่ในแนวเส้นเสีย 300 HP ต่อครั้งที่โดน (กันโดนซ้ำรอบเดียวกันด้วย castId)
   · ซอมบี้ในแนวเส้นไหม้เป็นจังหวะ
   · รอบ 1591: รถยนต์/รถน้ำมันที่วางอยู่บนแนวเส้นระเบิดแตกทันที (เส้นทางเดียวกับพลังปุ่ม ATTACK) */
(function(root){
  const VF = root.VocabForce = root.VocabForce || {};

  function GroundSlamController(){
    this.pending = [];
    this.active = [];
    this._hits = {};
    this._seq = 0;
  }

  GroundSlamController.prototype.reset = function(){
    this.pending.length = 0;
    this.active.length = 0;
    this._hits = {};
  };

  GroundSlamController.prototype.trySlam = function(player, now, camera, audio){
    const T = VF.GroundSlamTune || {};
    if(!player || player.alive === false || !player.anim) return null;
    if(player.carrying) return null;
    if(player.isDashing && player.isDashing()) return null;
    if(player.anim.isBusy(now)) return null;
    if(now < (this._coolUntil || 0)) return null;
    if(!player.playAction('groundSlam')) return null;
    const t = now != null ? now : VF.now();
    this._coolUntil = t + (T.COOLDOWN || 6) * 1000;
    const castId = (++this._seq % 1000);
    this.pending.push({at: t + (T.HIT_AT || 0.55) * 1000, castId: castId});
    /* ตั้งธง net ให้ packSlam หยิบไปส่งเพื่อน (เพนท์เส้นไฟฝั่งผู้ชม) */
    player._vfSlam = {seq: castId};
    player._vfDashForce = true;
    if(audio && audio.powerJumpLaunch) audio.powerJumpLaunch();
    if(camera && camera.impulse) camera.impulse(0.5, 3.5, {low: true});
    return {castId: castId};
  };

  GroundSlamController.prototype.tick = function(dt, now, player, deps){
    deps = deps || {};
    const T = VF.GroundSlamTune || {};
    const fx = deps.fx;
    if(!fx) return;
    /* ปล่อยเส้นไฟตอนท่า hitAt */
    for(let i = this.pending.length - 1; i >= 0; i--){
      const p = this.pending[i];
      if(now < p.at) continue;
      this.pending.splice(i, 1);
      const f = player.forward();
      const len = VF._t.slamLineLength ? VF._t.slamLineLength() : 23;
      const bx = player.x + f.x * len, bz = player.z + f.z * len;
      fx.castLine(player.x, player.z, bx, bz, p.castId);
      this.active.push({
        castId: p.castId,
        until: now + (T.LINE_LIFE || 2.6) * 1000,
        nextBurn: 0,
        boomed: {}
      });
      if(deps.camera && deps.camera.impulse) deps.camera.impulse(T.CAMERA_SHAKE || 1.7, T.FOV_PUNCH || 9, {low: true});
      if(deps.audio){
        if(deps.audio.powerJumpLand) deps.audio.powerJumpLand();
        if(deps.audio.fireTrailBurn) deps.audio.fireTrailBurn();
        if(deps.audio.shockwaveImpact) deps.audio.shockwaveImpact();
      }
      /* รอบ 1591: รถยนต์/รถน้ำมันที่วางอยู่บนแนวเส้น → ระเบิดแตกทันที เส้นทางเดียวกับลูกพลังปุ่ม ATTACK */
      this._detonateVehiclesOnLine(player.x, player.z, bx, bz, T.LINE_HALF_WIDTH || 1.3, deps);
    }
    /* ดาเมจระหว่างที่ไฟลุก */
    const halfW = T.LINE_HALF_WIDTH || 1.3;
    const f = player.forward();
    const pr = (VF.GunTune && VF.GunTune.PLAYER_R) || 0.62;
    const pvpDmg = T.PVP_DAMAGE != null ? T.PVP_DAMAGE : 300;
    const people = deps.people || [];
    const list = deps.enemies && deps.enemies.list ? deps.enemies.list : [];
    for(let i = this.active.length - 1; i >= 0; i--){
      const cast = this.active[i];
      if(now > cast.until){ this.active.splice(i, 1); continue; }
      /* ผู้เล่นอื่น: ครั้งละ 300 ต่อครั้งที่โดนแนวเส้น (กันซ้ำรอบเดียวกันด้วย castId) */
      for(let p = 0; p < people.length; p++){
        const peer = people[p];
        if(!peer || peer.local || peer.alive === false) continue;
        const key = cast.castId + '#' + peer.id;
        if(this._hits[key]) continue;
        if(!fx.hit(peer.x, peer.z, halfW + pr)) continue;
        this._hits[key] = true;
        if(VF._t.notePvpHit) VF._t.notePvpHit(player, {kind: 'P', zone: 'body', targetId: peer.id, dmg: pvpDmg});
        /* ระเบิดไฟสนั่นจุดชน — เปลวไฟลุกท่วม + คลื่นกระแทก + ซากเศษพื้นแยกร้าว (ชุดเดียวกับ power jump/tanker) */
        const px = peer.x, py = peer.y || 0, pz = peer.z;
        if(deps.fxm && deps.fxm.arenaFire) deps.fxm.arenaFire(px, py, pz, {r: T.EXPLOSION_R || 3});
        if(deps.fxm && deps.fxm.powerJumpImpact){
          deps.fxm.powerJumpImpact({x: px, y: py, z: pz, nx: -f.x * 0.35, ny: 1, nz: -f.z * 0.35}, 1.2, {local: true, dirX: f.x, dirZ: f.z, player: player});
        }
        if(deps.fxImpact && !deps.fxm) deps.fxImpact(px, py + 1.15, pz, {kind: 'heavyKick', level: 'HEAVY', dir: f, force: 20});
        if(deps.audio){
          if(deps.audio.arenaFire) deps.audio.arenaFire();
          if(deps.audio.heavyImpact) deps.audio.heavyImpact();
        }
      }
      /* ซอมบี้: ไหม้เป็นจังหวะขณะไฟยังลุก */
      if(now >= cast.nextBurn && list.length){
        cast.nextBurn = now + (T.ZOMBIE_BURN_INTERVAL || 0.45) * 1000;
        for(let e = 0; e < list.length; e++){
          const en = list[e];
          if(!en || en.alive === false) continue;
          if(player && en === player) continue;
          if(en.local === true) continue;
          if((en.invuln || 0) > 0) continue;
          if(!fx.hit(en.x, en.z, halfW + 0.5)) continue;
          /* ระเบิดไฟรอบแรกที่ซอมบี้แต่ละตัวโดนแนวเส้นในแต่ละ cast (รอบต่อไปไหม้เงียบ กันเสียง/เอฟเฟกต์ถาโถม) */
          const boomKey = en.id || (en.uid || '') || ('e' + e);
          if(!cast.boomed[boomKey]){
            cast.boomed[boomKey] = true;
            if(deps.fxm && deps.fxm.arenaFire) deps.fxm.arenaFire(en.x, en.y || 0, en.z, {r: T.ZOMBIE_EXPLOSION_R || 2.2});
            if(deps.audio && deps.audio.arenaFire) deps.audio.arenaFire();
          }
          if(typeof en.applyHit === 'function'){
            en.applyHit({
              kind: 'punch',
              damage: T.ZOMBIE_DAMAGE || 20,
              force: T.ZOMBIE_FORCE || 30,
              lift: T.ZOMBIE_LIFT || 4.2,
              origin: {x: player.x, z: player.z},
              reaction: 'launch',
              level: 'HEAVY'
            });
          }
        }
      }
    }
  };

  /* รอบ 1591: ยานพาหนะ (รถยนต์/รถน้ำมัน) ที่วางอยู่บนแนวเส้น SLAM → ระเบิดแตกทันที
     เส้นทางเดียวกับลูกพลังปุ่ม ATTACK (sedan.detonate / tanker.detonate) — detonate มี broken guard กันซ้ำอยู่แล้ว */
  GroundSlamController.prototype._detonateVehiclesOnLine = function(x0, z0, x1, z1, halfW, deps){
    const vehs = deps.vehicles;
    if(!vehs) return;
    const pad = (halfW || 1.3) + 0.4;
    const names = ['sedan', 'tanker'];
    for(let n = 0; n < names.length; n++){
      const veh = vehs[names[n]];
      if(!veh || !veh.ready || !veh.collider || veh.collider.broken) continue;
      if(typeof veh.detonate !== 'function') continue;
      const c = veh.collider;
      const dx = x1 - x0, dz = z1 - z0;
      const dist = Math.sqrt(dx * dx + dz * dz) || 1;
      const steps = Math.max(1, Math.ceil(dist / 1.0));
      for(let s = 0; s <= steps; s++){
        const t = s / steps;
        const px = x0 + dx * t, pz = z0 + dz * t;
        if(px < c.minx - pad || px > c.maxx + pad || pz < c.minz - pad || pz > c.maxz + pad) continue;
        /* จุดชน = จุดบนเส้นที่ใกล้กล่องรถที่สุด — ระเบิดใหญ่พร้อมเสียงและแรงสั่นหน้าจอ */
        const hx = Math.max(c.minx, Math.min(c.maxx, px));
        const hz = Math.max(c.minz, Math.min(c.maxz, pz));
        veh.detonate(deps.fxm, deps.audio, deps.camera);
        if(deps.fxm && deps.fxm.arenaFire) deps.fxm.arenaFire(hx, 0.4, hz, {r: (VF.GroundSlamTune && VF.GroundSlamTune.EXPLOSION_R || 3) * 1.2});
        if(deps.audio && deps.audio.arenaFire) deps.audio.arenaFire();
        if(deps.camera && deps.camera.impulse) deps.camera.impulse(1.4, 7, {low: true});
        break;
      }
    }
  };

  GroundSlamController.prototype.cooldownFrac = function(now){
    const T = VF.GroundSlamTune || {};
    const t = now != null ? now : VF.now();
    const left = (this._coolUntil || 0) - t;
    if(left <= 0) return 1;
    return VF.clamp(1 - left / ((T.COOLDOWN || 6) * 1000), 0, 1);
  };

  /* สัญญาณ slam บน hp string ร่วมกับ strike/overdrive/jump — 'M' + seq 2 หลัก (เพื่อนเอาไปเพนท์เส้นไฟ) */
  VF._t.packSlam = function(player){
    const s = player && player._vfSlam;
    if(!s || !s.seq) return '';
    return 'M' + ('0' + (s.seq % 100)).slice(-2);
  };
  VF._t.parseSlam = function(raw){
    const s = String(raw || '');
    if(s.charAt(0) !== 'H') return null;
    const parts = s.split('|');
    if(parts.length < 3) return null;
    const code = String(parts[2] || '');
    if(code.charAt(0) !== 'M' || code.length < 3) return null;
    const seq = parseInt(code.slice(1, 3), 10);
    if(!seq) return null;
    return {seq: seq};
  };

  VF.GroundSlamController = GroundSlamController;
})(typeof window !== 'undefined' ? window : globalThis);
