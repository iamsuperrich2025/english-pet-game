"use strict";
/* Central Power Jump + heavy landing feel. Change numbers here, not in controllers. */
(function(root){
  const VF = root.VocabForce = root.VocabForce || {};

  VF.PowerJumpTune = {
    ENABLED: true,
    POWER_JUMP_HORIZONTAL_SPEED: 32,
    POWER_JUMP_VERTICAL_SPEED: 24,
    POWER_JUMP_MIN_DISTANCE: 48,
    POWER_JUMP_MAX_DISTANCE: 70,
    POWER_JUMP_AIR_CONTROL: 0.12,
    POWER_JUMP_INPUT_WINDOW: 180,
    POWER_JUMP_MOVE_THRESHOLD: 0.08,
    POWER_JUMP_RECOVERY: 0.32,
    POWER_JUMP_SUBSTEP: 0.3,
    LAND_COMPRESS: 0.18,
    IMPACT_RADIUS: 7,
    IMPACT_KNOCKBACK: 22,
    IMPACT_UPWARD_FORCE: 5.5,
    IMPACT_REF_VELOCITY: 12,
    SHOCKWAVE_DURATION: 0.45,
    SHOCKWAVE_START_RADIUS: 0.5,
    SHOCKWAVE_END_RADIUS: 7,
    CAMERA_DIST: 11,
    CAMERA_SHAKE_STRENGTH: 0.85,
    CAMERA_SHAKE_DURATION: 0.28,
    CAMERA_SHAKE_FOV: 3.2,
    DUST_COUNT: 28,
    DEBRIS_COUNT: 12,
    CRACK_LIFETIME: 4,
    CRACK_SCALE: 2.4,
    NET_HOLD: 0.55,
    MAX_LIVE: 96,
    POOL: {ring: 4, dust: 16, rock: 8, decal: 2, line: 4, plume: 4}
  };

  function wish(camYaw, moveX, moveZ){
    if(VF.cameraWish) return VF.cameraWish(camYaw, moveX, moveZ);
    const s = Math.sin(camYaw || 0), c = Math.cos(camYaw || 0);
    return {
      x: -moveX * c + moveZ * s,
      z: moveX * s + moveZ * c
    };
  }

  VF._t.powerJumpWish = function(camYaw, moveX, moveZ){
    const w = wish(camYaw, moveX, moveZ);
    const len = Math.hypot(w.x, w.z);
    if(len < 1e-5) return null;
    return {x: w.x / len, z: w.z / len};
  };

  VF._t.powerJumpDir = function(input, camera, mem, now){
    const T = VF.PowerJumpTune;
    const ix = input && input.moveX || 0;
    const iz = input && input.moveZ || 0;
    const camYaw = camera && camera.yaw != null ? camera.yaw : 0;
    const thresh = T.POWER_JUMP_MOVE_THRESHOLD;
    if(Math.hypot(ix, iz) > thresh) return VF._t.powerJumpWish(camYaw, ix, iz);
    if(mem && now != null && (now - (mem.lastMoveAt || 0)) <= T.POWER_JUMP_INPUT_WINDOW){
      if(Math.hypot(mem.lastIx || 0, mem.lastIz || 0) > thresh){
        return VF._t.powerJumpWish(camYaw, mem.lastIx, mem.lastIz);
      }
    }
    return null;
  };

  VF._t.powerJumpStrength = function(verticalLandingVelocity){
    const T = VF.PowerJumpTune;
    const ref = T.IMPACT_REF_VELOCITY || 12;
    return VF.clamp(Math.abs(verticalLandingVelocity || 0) / ref, 0, 1);
  };

  VF._t.powerJumpFalloff = function(distance){
    const R = VF.PowerJumpTune.IMPACT_RADIUS || 7;
    return VF.clamp(1 - (distance || 0) / R, 0, 1);
  };

  VF._t.powerJumpGroundHit = function(arena, x, y, z){
    const floor = arena && arena.surfaceY ? arena.surfaceY(x, z) : (y || 0);
    let nx = 0, ny = 1, nz = 0;
    if(arena && arena.surfaceY){
      const e = 0.45;
      const yp = arena.surfaceY(x + e, z);
      const ym = arena.surfaceY(x - e, z);
      const zp = arena.surfaceY(x, z + e);
      const zm = arena.surfaceY(x, z - e);
      nx = (ym - yp) / (2 * e);
      nz = (zm - zp) / (2 * e);
      ny = 1;
      const len = Math.hypot(nx, ny, nz) || 1;
      nx /= len; ny /= len; nz /= len;
    }
    return {x: x, y: floor, z: z, nx: nx, ny: ny, nz: nz};
  };

  VF._t.powerJumpArc = function(){
    const T = VF.PowerJumpTune;
    const g = 24;
    const v = T.POWER_JUMP_VERTICAL_SPEED;
    const h = T.POWER_JUMP_HORIZONTAL_SPEED;
    const air = 2 * v / g;
    return {
      airTime: air,
      height: (v * v) / (2 * g),
      distance: h * air
    };
  };

  VF._t.powerJumpBlast = function(origin, enemies, player){
    const T = VF.PowerJumpTune;
    const R = T.IMPACT_RADIUS;
    const list = enemies && enemies.list ? enemies.list : (enemies || []);
    const hits = [];
    const ox = origin && origin.x || 0;
    const oz = origin && origin.z || 0;
    const str0 = origin && origin.strength != null ? origin.strength : 1;
    for(let i = 0; i < list.length; i++){
      const en = list[i];
      if(!en || en.alive === false) continue;
      if(player && en === player) continue;
      if(en.local === true) continue;
      const dist = Math.hypot((en.x || 0) - ox, (en.z || 0) - oz);
      if(dist > R || dist < 1e-4) continue;
      const fall = VF._t.powerJumpFalloff(dist) * str0;
      if(fall < 0.04) continue;
      const dir = {x: (en.x || 0) - ox, z: (en.z || 0) - oz};
      if(typeof en.applyHit === 'function'){
        en.applyHit({
          kind: 'punch',
          damage: 0,
          force: T.IMPACT_KNOCKBACK * fall,
          lift: T.IMPACT_UPWARD_FORCE * fall,
          maxSpeed: 28,
          maxDist: R,
          origin: {x: ox, z: oz},
          reaction: 'launch',
          level: fall > 0.65 ? 'HEAVY' : 'MEDIUM'
        });
      }
      hits.push({enemy: en, dist: dist, fall: fall});
    }
    return hits;
  };

  VF._t.packJump = function(player){
    const j = player && player._vfJump;
    if(!j || !j.seq) return '';
    const seq = ('0' + (j.seq % 100)).slice(-2);
    const phase = j.phase === 'impact' ? '2' : '1';
    return 'P' + seq + phase;
  };

  VF._t.parseJump = function(raw){
    const s = String(raw || '');
    if(s.charAt(0) !== 'H') return null;
    const parts = s.split('|');
    if(parts.length < 3) return null;
    const code = String(parts[2] || '');
    if(code.charAt(0) !== 'P') return null;
    const seq = parseInt(code.slice(1, 3), 10);
    const phaseN = parseInt(code.slice(3, 4), 10);
    if(!seq || (phaseN !== 1 && phaseN !== 2)) return null;
    return {seq: seq, phase: phaseN === 2 ? 'impact' : 'launch'};
  };
})(typeof window !== 'undefined' ? window : globalThis);
