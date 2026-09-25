"use strict";
/* รอบ 1567: ผู้ประสานงานจับยก-ทุ่มยานพาหนะ — เดินเข้าใกล้แล้วกด KICK เพื่อยก กด KICK อีกครั้งเพื่อทุ่ม
   รถยนต์: โดนทุ่มใส่ใคร คนนั้นพลัง -100 (VF.SEDAN_DAMAGE) · รถน้ำมัน: ปะทะสิ่งใดระเบิด ทุกตัว -500 (VF.TANKER_DAMAGE) */
(function(root){
  const VF = root.VocabForce = root.VocabForce || {};

  function VehicleGrabController(opts){
    opts = opts || {};
    this.sedan = opts.sedan || null;
    this.tanker = opts.tanker || null;
    this.arena = opts.arena || null;
    this._toastAt = 0;
    this._promptShown = false;
  }

  VehicleGrabController.prototype.vehicles = function(){
    const out = [];
    if(this.sedan && this.sedan.ready) out.push(this.sedan);
    if(this.tanker && this.tanker.ready) out.push(this.tanker);
    return out;
  };

  VehicleGrabController.prototype.carrying = function(){
    const list = this.vehicles();
    for(let i = 0; i < list.length; i++){
      if(list[i].state === 'carried') return list[i];
    }
    return null;
  };

  VehicleGrabController.prototype.nearest = function(player){
    if(!player || player.alive === false) return null;
    const list = this.vehicles();
    let best = null;
    for(let i = 0; i < list.length; i++){
      const v = list[i];
      if(!v.canGrab || !v.canGrab(player)) continue;
      const d = VF._t.tankerPointDistance ? VF._t.tankerPointDistance(player.x || 0, player.z || 0, v.collider) : 0;
      if(!best || d < best.d) best = {veh: v, d: d};
    }
    return best;
  };

  /* กด KICK — คืน true ถื่อระบบยก/ทุ่มกลืนปุ่มนี้ (จะได้ไม่เตะต่อยซ้ำ) */
  VehicleGrabController.prototype.onKick = function(player, cam, fx, audio, hud, requestTankerHit, hasNet){
    if(!player || player.alive === false) return false;
    const held = this.carrying();
    const fwd = player.forward ? player.forward() : {x: 0, z: 1};
    if(held){
      if(player.playAction) player.playAction('throw');
      if(audio && audio.punchWhoosh) audio.punchWhoosh();
      player.carrying = null;
      if(held === this.tanker){
        if(hasNet && requestTankerHit){
          /* ส่งให้ host ตัดสินแล้วประกาศ event — applyEvent เคลียร์สถานะ carried ให้เอง */
          requestTankerHit({kind: 'throw', x: player.x || 0, z: player.z || 0, dx: fwd.x, dz: fwd.z, grab: 1});
        }else if(held.throwBy){
          held.throwBy(player, fwd.x, fwd.z);
        }
      }else if(held.throwBy){
        held.throwBy(player, fwd.x, fwd.z);
      }
      if(hud && hud.toast) hud.toast('🚀 ทุ่ม!');
      return true;
    }
    const near = this.nearest(player);
    if(!near) return false;
    if(near.veh.grab && near.veh.grab(player)){
      player.carrying = near.veh;
      if(player.playAction) player.playAction('lift');
      if(audio && audio.punchWhoosh) audio.punchWhoosh();
      if(hud && hud.toast) hud.toast('🖐 ยกแล้ว! กด KICK อีกครั้งเพื่อทุ่ม');
      return true;
    }
    return false;
  };

  VehicleGrabController.prototype.tick = function(dt, player, ctx){
    ctx = ctx || {};
    const held = this.carrying();
    if(held){
      if(!player || player.alive === false){
        /* ตายระหว่างแบก — วางของลง */
        if(player) player.carrying = null;
        if(held.drop) held.drop();
        else{
          held.state = 'idle';
          held.carrier = null;
          if(held._updateCollider) held._updateCollider();
        }
        return;
      }
      return;
    }
    /* ป้ายเตือนเมื่อเดินเข้าใกล้ยานพาหนะ */
    if(player && player.alive !== false && ctx.hud && ctx.hud.toast){
      const near = this.nearest(player);
      if(near && !this._promptShown){
        this._promptShown = true;
        ctx.hud.toast('🖐 กด KICK เพื่อยก ' + (near.veh === this.tanker ? 'รถน้ำมัน' : 'รถยนต์'));
      }else if(!near){
        this._promptShown = false;
      }
    }
  };

  VF.VehicleGrabController = VehicleGrabController;
})(typeof window !== 'undefined' ? window : globalThis);
