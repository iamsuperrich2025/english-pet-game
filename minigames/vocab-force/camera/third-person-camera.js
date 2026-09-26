"use strict";
/* Original third-person follow camera. Not a GTA clone. */
(function(root){
  const VF = root.VocabForce = root.VocabForce || {};

  function ThirdPersonCamera(){
    this.yaw = 0.35;
    this.pitch = 0.38;
    this.dist = 6.4;
    this.height = 1.55;
    this.lookY = 1.35;
    this.fov = 52;
    this.baseFov = 52;
    this.shake = 0;
    this.shakeX = 0;
    this.shakeY = 0;
    this.shakeDecay = 18;
    this.shakeAmp = 0.22;
    this.shakeAmpY = 0.14;
    /* รอบ 1578: โหมดกล้องชาร์จพลัง — ซูมใกล้ + โคจรรอบตัวละคร (blend ไหลเข้า/ออกแบบนุ่ม) */
    this.chargeTarget = 0;
    this.chargeBlend = 0;
    this.cam = null;
    this._tx = 0; this._ty = 2; this._tz = 6;
  }

  ThirdPersonCamera.prototype.attach = function(camera){
    this.cam = camera;
    camera.fov = this.fov;
    camera.near = 0.12;
    camera.far = VF.CAMERA_FAR || 980;
    camera.updateProjectionMatrix();
    return this;
  };

  ThirdPersonCamera.prototype.look = function(dx, dy){
    this.yaw -= dx * 0.0055;
    // Finger/mouse up (negative dy) looks up; down looks down. Not airplane pitch.
    this.pitch = VF.clamp(this.pitch + dy * 0.0045, 0.08, 1.15);
  };

  ThirdPersonCamera.prototype.setChargeCam = function(on){
    this.chargeTarget = on ? 1 : 0;
  };

  ThirdPersonCamera.prototype.impulse = function(strength, fovPunch, opts){
    const s = VF.clamp(strength, 0, 1.6);
    this.shake = Math.max(this.shake, s);
    this.shakeDecay = (opts && opts.low) ? 10 : 18;
    this.shakeAmp = (opts && opts.low) ? 0.34 : 0.22;
    this.shakeAmpY = (opts && opts.low) ? 0.26 : 0.14;
    if(fovPunch === 0) return;
    const add = fovPunch != null ? fovPunch : (3 + 4 * s);
    if(add > 0) this.fov = this.baseFov + VF.clamp(add, 0, 8);
  };

  ThirdPersonCamera.prototype.tick = function(dt, player){
    if(!this.cam || !player) return;
    const THREE = root.THREE;
    const T = VF.EnergyAttackTune || {};
    /* รอบ 1578: ไหลเข้า/ออกโหมดกล้องชาร์จแบบนุ่ม แล้วหมุน yaw โคจรรอบตัวละครตามระดับ blend */
    this.chargeBlend += (this.chargeTarget - this.chargeBlend) * (1 - Math.exp(-dt * (T.chargeCamBlendK || 4.5)));
    if(this.chargeBlend < 0.002 && !this.chargeTarget) this.chargeBlend = 0;
    const cb = VF.clamp(this.chargeBlend, 0, 1);
    if(cb > 0 && !(player.isDashing && player.isDashing())) this.yaw += (T.chargeCamOrbit || 0.62) * dt * cb;
    const pj = (player.isPowerJumping && player.isPowerJumping());
    /* ซูมใกล้เฉพาะตอนชาร์จ (ไม่กระทบระยะกล้อง power jump) */
    const dist = pj
      ? Math.max(this.dist, (VF.PowerJumpTune && VF.PowerJumpTune.CAMERA_DIST) || 11)
      : this.dist + ((T.chargeCamDist || 2.7) - this.dist) * cb;
    const lookY = this.lookY + ((T.chargeCamLookY || 1.05) - this.lookY) * cb;
    const px = player.x, py = player.y + lookY, pz = player.z;
    const cp = Math.cos(this.pitch), sp = Math.sin(this.pitch);
    const sy = Math.sin(this.yaw), cy = Math.cos(this.yaw);
    const wantX = px - sy * cp * dist;
    const wantY = py + sp * dist + this.height * 0.15;
    const wantZ = pz - cy * cp * dist;
    const followK = (player.isDashing && player.isDashing())
      ? (VF.DashTune && VF.DashTune.dashFollowK || 16)
      : ((player.isPowerJumping && player.isPowerJumping()) ? 12 : (cb > 0.5 ? 12 : 9.5));
    const k = 1 - Math.exp(-dt * followK);
    this._tx += (wantX - this._tx) * k;
    this._ty += (wantY - this._ty) * k;
    this._tz += (wantZ - this._tz) * k;
    this.shake *= Math.exp(-dt * (this.shakeDecay || 18));
    if(this.shake < 0.01) this.shake = 0;
    const jx = (Math.random() * 2 - 1) * this.shake * (this.shakeAmp || 0.22);
    const jy = (Math.random() * 2 - 1) * this.shake * (this.shakeAmpY || 0.14);
    this.cam.position.set(this._tx + jx, this._ty + jy, this._tz);
    this.cam.lookAt(px, py, pz);
    /* ตอนชาร์จ: บีบ fov ลงเล็กน้อยให้ภาพซูมแบบภาพยนตร์ */
    const baseFov = this.baseFov - (T.chargeCamFovDrop || 5) * cb;
    this.fov += (baseFov - this.fov) * VF.clamp(dt * 9, 0, 1);
    if(Math.abs(this.fov - baseFov) > 0.05){
      this.cam.fov = this.fov;
      this.cam.updateProjectionMatrix();
    }
  };

  VF.ThirdPersonCamera = ThirdPersonCamera;
})(typeof window !== 'undefined' ? window : globalThis);
