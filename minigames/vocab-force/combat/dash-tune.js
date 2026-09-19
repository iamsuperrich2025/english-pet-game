"use strict";
/* Central dash / blink-approach feel. Change numbers here, not in controllers. */
(function(root){
  const VF = root.VocabForce = root.VocabForce || {};

  VF.DashTune = {
    dashDistance: 4.6,
    dashDuration: 0.16,
    dashCooldown: 0.85,
    dashFovBoost: 6,
    dashTrailDuration: 0.22,
    dashStartBurstStrength: 0.85,
    dashArrivalBurstStrength: 0.55,
    dashFollowK: 16,
    dashShake: 0.16,
    jumpDash: false,
    attackApproachMinDistance: 2.2,
    attackApproachMaxDistance: 6.1,
    attackApproachMinGap: 1.5,
    attackApproachMaxGap: 4.0,
    attackApproachDuration: 0.14,
    attackApproachCooldown: 0.3,
    approachDot: 0.22
  };

  VF._t.dashSpeed = function(){
    const D = VF.DashTune;
    return D.dashDistance / Math.max(0.08, D.dashDuration);
  };

  VF._t.dashPathClear = function(arena, x, y, z, dirX, dirZ, dist, radius){
    if(!arena || !arena.collide) return true;
    const steps = Math.max(2, Math.ceil(dist / 0.38));
    for(let i = 1; i <= steps; i++){
      const t = i / steps;
      const wantX = x + dirX * dist * t;
      const wantZ = z + dirZ * dist * t;
      const hit = arena.collide(wantX, y, wantZ, radius || 0.55);
      if(Math.hypot(hit.x - wantX, hit.z - wantZ) > 0.2) return false;
    }
    return true;
  };

  VF._t.approachPlan = function(player, enemies, kind, arena){
    const D = VF.DashTune;
    const tune = VF.CombatTune && VF.CombatTune.attack(kind || 'punch');
    const reach = (tune && tune.range || 1.9) + 0.25;
    const list = enemies && enemies.list ? enemies.list : (enemies || []);
    const fwd = player.forward ? player.forward() : {x: Math.sin(player.yaw || 0), z: Math.cos(player.yaw || 0)};
    let best = null, bestScore = 1e9;
    for(let i = 0; i < list.length; i++){
      const en = list[i];
      if(!en || en.alive === false) continue;
      const dx = en.x - player.x, dz = en.z - player.z;
      const dist = Math.hypot(dx, dz);
      if(dist < D.attackApproachMinDistance || dist > D.attackApproachMaxDistance) continue;
      const inv = dist || 1;
      const dirX = dx / inv, dirZ = dz / inv;
      const dot = fwd.x * dirX + fwd.z * dirZ;
      if(dot < D.approachDot) continue;
      const close = VF.clamp(dist - reach, D.attackApproachMinGap, D.attackApproachMaxGap);
      if(close < D.attackApproachMinGap * 0.85) continue;
      if(!VF._t.dashPathClear(arena, player.x, player.y || 0, player.z, dirX, dirZ, close, player.radius || 0.55)) continue;
      const score = dist - dot * 0.8;
      if(score < bestScore){
        bestScore = score;
        best = {enemy: en, dirX: dirX, dirZ: dirZ, dist: dist, close: close};
      }
    }
    return best;
  };
})(typeof window !== 'undefined' ? window : globalThis);
