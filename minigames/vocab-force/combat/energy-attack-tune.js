"use strict";
/* Ranged energy burst numbers. Melee still uses CombatTune. */
(function(root){
  const VF = root.VocabForce = root.VocabForce || {};

  const ENERGY_ATTACK = {
    doubleTapWindowMs: 1000,
    minTapGapMs: 45,
    projectileCount: 3,
    projectileIntervalMs: 85,
    projectileSpeed: 420,
    maxRange: (VF.ARENA_HALF || 280) * 2 * Math.SQRT2 + 24,
    projectileRadius: 0.28,
    damagePerProjectile: 12,
    knockbackPerProjectile: 18,
    liftPerProjectile: 2.2,
    lastProjectileKnockbackMultiplier: 1.3,
    lastProjectileLift: 3.4,
    assistDot: 0.72,
    assistBlend: 0.18,
    maxLive: 6,
    pool: 9,
    trailLife: 0.16,
    chargeLife: 1.0,
    recoil: -2.2,
    muzzleForward: 0.95,
    muzzleHeight: 1.22,
    muzzleSide: 0.28,
    chargedMuzzleForward: 0.14,
    chargedMuzzleHeight: 1.22,
    chargedMuzzleSide: 0,
    aimStickDeadzone: 0.12,
    aimMarkerRange: 14,
    aimMarkerMin: 4,
    aimMarkerMax: 36,
    aimMarkerMove: 22,
    wallBreakScale: 0.55,
    cameraShake: 0.22,
    finalShake: 0.38,
    fovPunch: 2.4,
    holdChargeMs: 3000,
    tapReleaseMaxMs: 220,
    holdBarShowMs: 90,
    /* รอบ 1578: กล้องโชว์ตอนชาร์จพลัง — ซูมใกล้ โคจรรอบตัวละคร ให้ตัวละครดูเด่น */
    chargeCamDist: 2.7,
    chargeCamLookY: 1.05,
    chargeCamOrbit: 0.62,
    chargeCamFovDrop: 5,
    chargeCamBlendK: 4.5,
    chargedScale: 5,
    chargedDamageMul: 2,
    chargedKnockbackMul: 1.8,
    chargedLiftMul: 1.5,
    blastRadius: 2.4,
    chargedBlastRadius: 7.2,
    vortexSparkCount: 16,
    vortexStreakCount: 6,
    vortexRingCount: 3,
    vortexLiftRadius: 6.2,
    vortexLift: 1.55,
    vortexSpin: 4.6,
    vortexOut: 3.8,
    vortexFling: 18,
    vortexFlingLift: 6.2,
    PALETTE: {
      nex: {core: 0xb8fff8, shell: 0x3ee0c8, trail: 0x7cffcf, glow: 0x9bfff0},
      lyravyn: {core: 0xffe6f4, shell: 0xd080ff, trail: 0xff9ad8, glow: 0xf0c4ff}
    }
  };

  VF.EnergyAttackTune = ENERGY_ATTACK;
  VF._t = VF._t || {};
  VF._t.meleeHurtRadius = function(kind){
    const t = VF.CombatTune && VF.CombatTune.attack(kind || 'punch');
    return ((t && t.radius) || 1.28) + ((t && t.range) || 1.92) * 0.15;
  };
  VF._t.meleeOrigin = function(player){
    const fwd = player && player.forward ? player.forward() : {x: 0, z: 1};
    return {
      x: (player && player.x || 0) + fwd.x * 0.85,
      y: (player && player.y || 0) + 1.0,
      z: (player && player.z || 0) + fwd.z * 0.85,
      fwd: fwd
    };
  };
  VF._t.hasMeleeTarget = function(player, enemies, kind, people){
    if(!player) return false;
    const list = enemies && enemies.list ? enemies.list : (enemies || []);
    const origin = VF._t.meleeOrigin(player);
    const rad = VF._t.meleeHurtRadius(kind);
    for(let i = 0; i < list.length; i++){
      const en = list[i];
      if(!en || en.burstFinisherTriggered || en.state === 'gone') continue;
      if(!en.alive && en.state !== 'dying') continue;
      const d = Math.hypot(en.x - origin.x, en.z - origin.z);
      if(d <= rad + (en.radius || 0.7)) return true;
    }
    const folks = people || [];
    const pr = (VF.GunTune && VF.GunTune.PLAYER_R) || 0.62;
    for(let i = 0; i < folks.length; i++){
      const p = folks[i];
      if(!p || p.local || p.alive === false) continue;
      if(Math.hypot((p.x || 0) - origin.x, (p.z || 0) - origin.z) <= rad + pr) return true;
    }
    return false;
  };
  VF._t.energyPalette = function(player){
    const id = player && player.def && player.def.id;
    const pal = ENERGY_ATTACK.PALETTE;
    return (id && pal[id]) || pal.nex;
  };
  VF._t.energyMapRange = function(){
    return (VF.ARENA_HALF || 280) * 2 * Math.SQRT2 + 24;
  };
  VF._t.pruneEnergyTaps = function(taps, now, windowMs){
    const w = windowMs != null ? windowMs : ENERGY_ATTACK.doubleTapWindowMs;
    const out = [];
    const src = taps || [];
    for(let i = 0; i < src.length; i++){
      if(now - src[i] <= w) out.push(src[i]);
    }
    return out;
  };
  VF._t.energyTapResult = function(taps, now, opts){
    const minGap = (opts && opts.minGap) != null ? opts.minGap : ENERGY_ATTACK.minTapGapMs;
    const windowMs = (opts && opts.windowMs) != null ? opts.windowMs : ENERGY_ATTACK.doubleTapWindowMs;
    let kept = VF._t.pruneEnergyTaps(taps, now, windowMs);
    if(kept.length && now - kept[kept.length - 1] < minGap){
      return {taps: kept, fire: false, bounce: true};
    }
    kept = kept.concat([now]);
    const fire = kept.length >= 2;
    return {taps: fire ? [] : kept, fire: fire, bounce: false};
  };
  /* รอบ 1567: ลูกพลังต้องอยู่ระดับเดียวกับศัตรู ไม่ลอยขึ้นฟ้า — ถ้า aim assist เจอเป้า ยิงเอียงลงสู่ความสูงลำตัวศัตรู (chest ~+0.95)
     ถ้าไม่มีเป้า ยิงราบ (y=0) ไม่มีส่วนชักขึ้นแม้กล้องจะมองต่ำ */
  VF._t.energyAim = function(player, camera, enemies){
    const yaw = camera && camera.yaw != null ? camera.yaw : (player && player.yaw || 0);
    let x = Math.sin(yaw), z = Math.cos(yaw);
    const T = ENERGY_ATTACK;
    const list = enemies && enemies.list ? enemies.list : [];
    let best = null, bestDot = T.assistDot;
    const px = player && player.x || 0, pz = player && player.z || 0;
    for(let i = 0; i < list.length; i++){
      const en = list[i];
      if(!en || !en.alive) continue;
      const dx = en.x - px, dz = en.z - pz;
      const dist = Math.hypot(dx, dz);
      if(dist < 2.2 || dist > T.maxRange) continue;
      const inv = dist || 1;
      const dot = x * (dx / inv) + z * (dz / inv);
      if(dot > bestDot){ bestDot = dot; best = en; }
    }
    if(best){
      const k = T.assistBlend;
      const dx = best.x - px, dz = best.z - pz;
      const inv = Math.hypot(dx, dz) || 1;
      x = x * (1 - k) + dx / inv * k;
      z = z * (1 - k) + dz / inv * k;
      const oy = (player && player.y || 0) + (T.muzzleHeight || 1.22);
      const ty = (best.y || 0) + 0.95;
      const hx = x, hz = z;
      const dl = Math.hypot(hx, hz) || 1;
      const dy = (ty - oy) / Math.max(6, dl * 6);
      const len = Math.hypot(hx / dl, dy, hz / dl) || 1;
      return {x: hx / dl / len, y: dy / len, z: hz / dl / len, assisted: true};
    }
    const len = Math.hypot(x, z) || 1;
    return {x: x / len, y: 0, z: z / len, assisted: false};
  };
  VF._t.energyWish = function(yaw, moveX, moveZ){
    if(VF.cameraWish) return VF.cameraWish(yaw || 0, moveX || 0, moveZ || 0);
    const s = Math.sin(yaw || 0), c = Math.cos(yaw || 0);
    return {x: -(moveX || 0) * c + (moveZ || 0) * s, z: (moveX || 0) * s + (moveZ || 0) * c};
  };
  VF._t.energyAimSteer = function(state, player, camera, moveX, moveZ, dt){
    const T = ENERGY_ATTACK;
    const hold = state || {};
    const wish = VF._t.energyWish(camera && camera.yaw, moveX, moveZ);
    const stick = Math.hypot(wish.x, wish.z);
    const dead = T.aimStickDeadzone || 0.12;
    if(stick >= dead){
      if(hold.x == null || hold.z == null){
        const fwd = player && player.forward ? player.forward() : {x: Math.sin((player && player.yaw) || 0), z: Math.cos((player && player.yaw) || 0)};
        const seed = Math.hypot(fwd.x, fwd.z) || 1;
        const range = T.aimMarkerRange || 14;
        hold.x = (player && player.x || 0) + fwd.x / seed * range;
        hold.z = (player && player.z || 0) + fwd.z / seed * range;
      }
      const inv = stick || 1;
      const speed = T.aimMarkerMove || 22;
      const step = dt > 0 ? dt : 0;
      hold.x += wish.x / inv * speed * step;
      hold.z += wish.z / inv * speed * step;
      hold.aimed = true;
    }
    if(hold.aimed && hold.x != null){
      const px = player && player.x || 0, pz = player && player.z || 0;
      let dx = hold.x - px, dz = hold.z - pz;
      let dist = Math.hypot(dx, dz);
      const min = T.aimMarkerMin || 4, max = T.aimMarkerMax || 36;
      if(dist < min){
        const n = dist || 1;
        dx = dx / n * min; dz = dz / n * min; dist = min;
        hold.x = px + dx; hold.z = pz + dz;
      }else if(dist > max){
        dx = dx / dist * max; dz = dz / dist * max;
        hold.x = px + dx; hold.z = pz + dz;
      }
      const lift = 0; /* รอบ 1567: ป้ายเล็งอยู่ระดับเดียวกับตัว — ไม่ชักขึ้นตาม pitch อีกต่อไป */
      hold.y = (player && player.y || 0) + (T.muzzleHeight || 1.22) + lift * 4.2;
    }
    return hold;
  };
  VF._t.energyDirToPoint = function(origin, point){
    const ox = origin && origin.x || 0, oy = origin && origin.y || 0, oz = origin && origin.z || 0;
    const dx = (point && point.x || 0) - ox;
    const dy = (point && point.y != null ? point.y : oy) - oy;
    const dz = (point && point.z || 0) - oz;
    const len = Math.hypot(dx, dy, dz) || 1;
    return {x: dx / len, y: dy / len, z: dz / len};
  };
  VF._t.energyMuzzle = function(player, opts){
    const charged = !!(opts && (opts.charged || opts.hold));
    const fwd = player && player.forward ? player.forward() : {x: 0, z: 1};
    const sideX = fwd.z, sideZ = -fwd.x;
    const forward = charged ? ENERGY_ATTACK.chargedMuzzleForward : ENERGY_ATTACK.muzzleForward;
    const height = charged ? ENERGY_ATTACK.chargedMuzzleHeight : ENERGY_ATTACK.muzzleHeight;
    const side = charged ? ENERGY_ATTACK.chargedMuzzleSide : ENERGY_ATTACK.muzzleSide;
    return {
      x: (player && player.x || 0) + fwd.x * forward + sideX * side,
      y: (player && player.y || 0) + height,
      z: (player && player.z || 0) + fwd.z * forward + sideZ * side
    };
  };
  VF._t.energyHoldFrac = function(start, now, holdMs){
    const ms = holdMs != null ? holdMs : ENERGY_ATTACK.holdChargeMs;
    return Math.max(0, Math.min(1, ((now || 0) - (start || 0)) / Math.max(1, ms)));
  };
  VF._t.energyChargeScale = function(frac){
    const f = Math.max(0, Math.min(1, frac || 0));
    const max = ENERGY_ATTACK.chargedScale || 5;
    return 1 + (max - 1) * f;
  };
  VF._t.energyBlastRadius = function(frac, last){
    const T = ENERGY_ATTACK;
    const f = Math.max(0, Math.min(1, frac || 0));
    const r = (T.blastRadius || 2.4) + ((T.chargedBlastRadius || 7.2) - (T.blastRadius || 2.4)) * f;
    return last ? r * 1.15 : r;
  };
  VF._t.energyChargeMul = function(frac, fullMul){
    const f = Math.max(0, Math.min(1, frac || 0));
    const m = fullMul != null ? fullMul : 1;
    return 1 + (m - 1) * f;
  };
  VF._t.energyWindLift = function(dist, frac){
    const R = ENERGY_ATTACK.vortexLiftRadius || 6.2;
    const f = Math.max(0, Math.min(1, frac || 0));
    if(dist >= R || f <= 0) return 0;
    return (ENERGY_ATTACK.vortexLift || 1.55) * (1 - dist / R) * f;
  };
  VF._t.energyWindFlingSpeed = function(dist, frac){
    const R = ENERGY_ATTACK.vortexLiftRadius || 6.2;
    const f = Math.max(0, Math.min(1, frac || 0));
    if(dist >= R || f <= 0) return 0;
    return (8 + (ENERGY_ATTACK.vortexFling || 14) * f) * (1 - dist / R);
  };
  VF._t.energyHoldRelease = function(start, now, fired, opts){
    const maxTap = (opts && opts.tapMax) != null ? opts.tapMax : ENERGY_ATTACK.tapReleaseMaxMs;
    const dt = (now || 0) - (start || 0);
    const frac = VF._t.energyHoldFrac(start, now);
    if(fired) return {tap: false, cancel: true, charged: true, frac: 1};
    if(dt <= maxTap) return {tap: true, cancel: false, charged: false, frac: 0};
    return {tap: false, cancel: false, charged: true, frac: frac};
  };
})(typeof window !== 'undefined' ? window : globalThis);
