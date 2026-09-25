"use strict";
/* Per-gun body/limb damage. A headshot always empties player HP. */
(function(root){
  const VF = root.VocabForce = root.VocabForce || {};

  const GUNS = {
    energy: {id: 'energy', name: 'Energy Burst', body: 140, limb: 90},
    aurora_fang: {id: 'aurora_fang', name: 'Aurora Fang', body: 120, limb: 80},
    crimson_halo: {id: 'crimson_halo', name: 'Crimson Halo', body: 160, limb: 110},
    dune_specter: {id: 'dune_specter', name: 'Dune Specter', body: 100, limb: 70},
    emberleaf: {id: 'emberleaf', name: 'Emberleaf', body: 130, limb: 85},
    frost_warden: {id: 'frost_warden', name: 'Frost Warden', body: 150, limb: 100},
    iron_jackal: {id: 'iron_jackal', name: 'Iron Jackal', body: 175, limb: 115},
    night_howl: {id: 'night_howl', name: 'Night Howl', body: 145, limb: 95},
    stormfang: {id: 'stormfang', name: 'Stormfang', body: 190, limb: 125},
    sunflare: {id: 'sunflare', name: 'Sunflare', body: 135, limb: 90},
    volt_krait: {id: 'volt_krait', name: 'Volt Krait', body: 110, limb: 75}
  };

  VF.GunTune = {
    HEAD_Y: 1.48,
    LIMB_Y: 0.58,
    PLAYER_R: 0.62,
    GUNS: GUNS
  };

  VF._t = VF._t || {};
  VF._t.gunOf = function(id){
    const key = String(id || '').toLowerCase().replace(/\s+/g, '_');
    return GUNS[key] || GUNS.energy;
  };
  VF._t.playerGunId = function(player){
    if(player && player.gunId) return player.gunId;
    if(player && player.def && player.def.gun) return player.def.gun;
    return 'energy';
  };
  VF._t.hitZone = function(shotY, target){
    const local = (shotY || 0) - (target && target.y || 0);
    if(local >= (VF.GunTune.HEAD_Y || 1.48)) return 'head';
    if(local <= (VF.GunTune.LIMB_Y || 0.58)) return 'limb';
    return 'body';
  };
  VF._t.gunDamage = function(gunId, zone, chargeFrac){
    if(zone === 'head') return VF.PLAYER_HP || 1000;
    const g = VF._t.gunOf(gunId);
    const base = zone === 'limb' ? (g.limb || 70) : (g.body || 140);
    const mul = VF._t.energyChargeMul ? VF._t.energyChargeMul(chargeFrac || 0, (VF.EnergyAttackTune && VF.EnergyAttackTune.chargedDamageMul) || 2) : 1;
    return Math.round(base * mul);
  };
  VF._t.meleePvpDamage = function(kind){
    const t = VF.CombatTune && VF.CombatTune.attack(kind || 'punch');
    return (t && t.pvpDamage != null) ? t.pvpDamage : (t && t.damage) || 90;
  };
  VF._t.uidTail = function(id){
    const s = String(id || '');
    return s.length <= 2 ? s : s.slice(-2);
  };
  VF._t.notePvpHit = function(player, info){
    if(!player || !info || !info.targetId) return null;
    player._vfStrikeSeq = (player._vfStrikeSeq || 0) + 1;
    player._vfStrike = {
      seq: player._vfStrikeSeq,
      kind: info.kind || 'P',
      zone: info.zone || 'body',
      targetId: info.targetId,
      dmg: info.dmg || 0
    };
    player._vfDashForce = true;
    return player._vfStrike;
  };
  VF._t.packStrike = function(player){
    const s = player && player._vfStrike;
    if(!s || !s.seq) return '';
    const seq = ('0' + (s.seq % 100)).slice(-2);
    const kind = (s.kind === 'kick' || s.kind === 'K') ? 'K' : ((s.kind === 'G' || s.kind === 'gun' || s.kind === 'energy') ? 'G' : 'P');
    const zone = (s.zone === 'head' || s.zone === 'H') ? 'H' : ((s.zone === 'limb' || s.zone === 'L') ? 'L' : 'B');
    const tgt = VF._t.uidTail(s.targetId);
    const dmg = Math.min(999, Math.max(1, s.dmg | 0));
    return 'S' + seq + kind + zone + tgt + ('00' + dmg).slice(-3);
  };
  VF._t.parseStrike = function(raw){
    const s = String(raw || '');
    if(s.charAt(0) !== 'H') return null;
    const parts = s.split('|');
    if(parts.length < 3) return null;
    const code = String(parts[2] || '');
    if(code.charAt(0) !== 'S' || code.length < 8) return null;
    const seq = parseInt(code.slice(1, 3), 10);
    const kind = code.charAt(3);
    const zone = code.charAt(4);
    const target = code.slice(5, 7);
    const dmg = parseInt(code.slice(7, 10), 10);
    if(!seq || 'PGK'.indexOf(kind) < 0 || 'HBL'.indexOf(zone) < 0) return null;
    return {
      seq: seq,
      kind: kind,
      zone: zone === 'H' ? 'head' : (zone === 'L' ? 'limb' : 'body'),
      target: target,
      dmg: zone === 'H' ? (VF.PLAYER_HP || 1000) : (dmg || 0)
    };
  };
  /* รอบ 1567: ห้ามยิงชักขึ้นฟ้า — lift ติดลบเท่านั้น (เล็งตามคนดูลงต่ำ) */
  VF._t.aimPitchLift = function(pitch){
    const p = pitch != null ? pitch : 0.38;
    return VF.clamp((0.38 - p) * 0.42, -0.22, 0);
  };
})(typeof window !== 'undefined' ? window : globalThis);
