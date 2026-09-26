"use strict";
/* รอบ 1593: ปุ่มปัดพลัง (DEFLECT) — กดแล้วเล่นท่า Shield_Push_Left (GLB จริงของแต่ละตัวละคร)
   ตอน hitAt ลูกพลังศัตรู/เพื่อนที่อยู่ในแนวหน้าจะถูกปัดให้หักเหไปตามทิศหน้าผู้เล่น
   ลูกพลังที่ถูกปัดกลายเป็นของเรา (โดนซอมบี้ ผู้เล่นอื่น และระเบิดรถได้)
   ถ้าเป็นลูกเพื่อน ส่ง deflect-ack กลับไปให้เจ้าของลบลูกจริงของเขาด้วย (กันดาเมจซ้ำ) */
(function(root){
  const VF = root.VocabForce = root.VocabForce || {};

  function DeflectController(){
    this.pending = [];
    this._coolUntil = 0;
    this._peerCatchAt = 0;
  }

  DeflectController.prototype.reset = function(){
    this.pending.length = 0;
    this._peerCatchAt = 0;
    this._lastDeflectAt = 0;
  };

  DeflectController.prototype.tryDeflect = function(player, now, camera, audio){
    const T = VF.DeflectTune || {};
    if(!player || player.alive === false || !player.anim) return false;
    if(player.carrying) return false;
    if(player.isDashing && player.isDashing()) return false;
    if(player.anim.isBusy(now)) return false;
    if(now < (this._coolUntil || 0)) return false;
    if(!player.playAction('deflect')) return false;
    const t = now != null ? now : VF.now();
    this._lastDeflectAt = t;
    this._coolUntil = t + (T.COOLDOWN || 2.5) * 1000;
    this.pending.push({at: t + (T.HIT_AT || 0.26) * 1000});
    if(audio && audio.energyFire) audio.energyFire();
    return true;
  };

  DeflectController.prototype.tick = function(dt, now, player, deps){
    deps = deps || {};
    const T = VF.DeflectTune || {};
    const orbs = deps.orbs;
    if(!orbs) return;
    for(let i = this.pending.length - 1; i >= 0; i--){
      const p = this.pending[i];
      if(now < p.at) continue;
      this.pending.splice(i, 1);
      const f = player.forward ? player.forward() : {x: 0, z: 1};
      const caught = orbs.scan(player, T.RANGE || 3.8, T.ARC_DOT != null ? T.ARC_DOT : 0.1);
      for(let c = 0; c < caught.length; c++){
        const orb = caught[c];
        const wasPeer = orb.team === 'peer';
        orbs.redirect(orb, f.x, f.z, T.REDIRECT_SPEED || 34);
        /* รอบ 1596: จับจังหวะที่ปัดโดนลูก "เพื่อน" — เปิดหน้าต่างกันดาเมจ strike 'G'
           ที่เจ้าของลูกอาจแพ็กมาให้ก่อน/หลังเล็กน้อย (ดู peerGuardActive) */
        if(wasPeer) this._peerCatchAt = now != null ? now : VF.now();
        /* ประกายไฟตอนปัดโดน */
        if(deps.fx){
          if(deps.fx.arenaFire) deps.fx.arenaFire(orb.x, orb.y, orb.z, {r: 1.4});
          if(deps.fx._spawn){
            deps.fx._spawn('ring', orb.x, Math.max(0.06, orb.y - 0.8), orb.z, 0.3, {role: 'shock', rotX: -Math.PI / 2, startR: 0.26, endR: 1.9, color: 0x9bfff0, opacity: 0.85, add: true});
          }
        }
        /* ลูกพลังเพื่อน: บอกเจ้าของให้ลบลูกจริงของเขา (ออนไลน์) */
        if(wasPeer && deps.onPeerDeflect) deps.onPeerDeflect(orb);
      }
      if(caught.length){
        if(deps.audio && deps.audio.energyHit) deps.audio.energyHit();
        if(deps.camera && deps.camera.impulse) deps.camera.impulse(0.4, 3, {low: true});
      }
    }
  };

  /* รอบ 1596: หน้าต่างกันดาเมจลูกพลังเพื่อน — คืน true ถ้า (1) อยู่ในจังหวะปัดที่กดไว้
     (ตั้งแต่กดถึง hitAt + สละ 0.4 วิ) และ (2) มีลูกเพื่อนเคลื่อนผ่านใกล้ตัว/ถูกปัดโดน
     ไม่เกิน PEER_GUARD_MS ก่อนหน้า — strike 'G' ที่เจ้าของลูกแพ็กมาถึงในช่วงนี้จะถูกกลืน
     ผู้เล่นไม่เสีย HP จากการโจมตีครั้งนั้น (ต้อง orbs เพื่ออ่าน _peerNearAt ส่งจาก runtime) */
  DeflectController.prototype.peerGuardActive = function(now, orbs){
    const T = VF.DeflectTune || {};
    const t = now != null ? now : VF.now();
    const swingUntil = (this._lastDeflectAt || 0) + (T.HIT_AT || 0.26) * 1000 + 400;
    if(t > swingUntil) return false;
    const nearAt = Math.max(this._peerCatchAt || 0, (orbs && orbs._peerNearAt) || 0);
    if(!nearAt) return false;
    if(t < nearAt - 300) return false;
    if(t > nearAt + (T.PEER_GUARD_MS || 1000)) return false;
    return true;
  };

  DeflectController.prototype.cooldownFrac = function(now){
    const T = VF.DeflectTune || {};
    const t = now != null ? now : VF.now();
    const left = (this._coolUntil || 0) - t;
    if(left <= 0) return 1;
    return VF.clamp(1 - left / ((T.COOLDOWN || 2.5) * 1000), 0, 1);
  };

  VF.DeflectController = DeflectController;
})(typeof window !== 'undefined' ? window : globalThis);
