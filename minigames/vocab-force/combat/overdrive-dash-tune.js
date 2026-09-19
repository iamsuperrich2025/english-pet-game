"use strict";
/* Central double-dash Overdrive feel. Change numbers here, not in controllers. */
(function(root){
  const VF = root.VocabForce = root.VocabForce || {};
  VF._t = VF._t || {};

  VF.OverdriveDashTune = {
    DOUBLE_DASH_WINDOW: 1.0,
    OVERDRIVE_SPEED_MULTIPLIER: 5.0,
    OVERDRIVE_DISTANCE_MULTIPLIER: 5.0,
    FIRE_TRAIL_SEGMENT_SPACING: 0.42,
    FIRE_TRAIL_LIFETIME: 2.2,
    FIRE_TRAIL_STRONG: 1.15,
    FIRE_TRAIL_MAX_SEGMENTS: 56,
    FIRE_TRAIL_HIT_RADIUS: 0.85,
    OVERDRIVE_FOV_BONUS: 6,
    OVERDRIVE_SHAKE: 0.28,
    OVERDRIVE_SUBSTEP: 0.18,
    OVERDRIVE_FIRE_DAMAGE_ENABLED: true,
    FIRE_DAMAGE_INTERVAL: 0.35,
    FIRE_DAMAGE: 1,
    FIRE_KNOCKBACK: 8,
    FIRE_LIFT: 1.2,
    NET_HOLD: 0.55
  };

  VF._t.overdriveDistance = function(){
    const D = VF.DashTune || {};
    const T = VF.OverdriveDashTune;
    return (D.dashDistance || 4.6) * (T.OVERDRIVE_DISTANCE_MULTIPLIER || 5);
  };

  VF._t.overdriveSpeed = function(){
    const T = VF.OverdriveDashTune;
    const s = VF._t.dashSpeed ? VF._t.dashSpeed() : 28.75;
    return s * (T.OVERDRIVE_SPEED_MULTIPLIER || 5);
  };

  VF._t.overdriveDuration = function(){
    const D = VF.DashTune || {};
    return D.dashDuration || 0.16;
  };

  VF._t.overdriveSpec = function(){
    const D = VF.DashTune || {};
    return {
      normalDistance: D.dashDistance || 4.6,
      normalSpeed: VF._t.dashSpeed ? VF._t.dashSpeed() : 28.75,
      normalDuration: D.dashDuration || 0.16,
      distance: VF._t.overdriveDistance(),
      speed: VF._t.overdriveSpeed(),
      duration: VF._t.overdriveDuration()
    };
  };

  VF._t.overdriveWindowOpen = function(lastAt, now, windowSec){
    const T = VF.OverdriveDashTune;
    const win = (windowSec != null ? windowSec : T.DOUBLE_DASH_WINDOW) * 1000;
    if(lastAt == null || lastAt < 0) return false;
    return (now - lastAt) <= win;
  };

  VF._t.packOverdrive = function(player){
    const j = player && player._vfDash;
    if(!j || !j.seq) return '';
    const seq = ('0' + (j.seq % 100)).slice(-2);
    const phase = j.phase === 'end' ? '2' : '1';
    return 'O' + seq + phase;
  };

  VF._t.parseOverdrive = function(raw){
    const s = String(raw || '');
    if(s.charAt(0) !== 'H') return null;
    const parts = s.split('|');
    if(parts.length < 3) return null;
    const code = String(parts[2] || '');
    if(code.charAt(0) !== 'O') return null;
    const seq = parseInt(code.slice(1, 3), 10);
    const phaseN = parseInt(code.slice(3, 4), 10);
    if(!seq || (phaseN !== 1 && phaseN !== 2)) return null;
    return {seq: seq, phase: phaseN === 2 ? 'end' : 'start'};
  };
})(typeof window !== 'undefined' ? window : globalThis);
