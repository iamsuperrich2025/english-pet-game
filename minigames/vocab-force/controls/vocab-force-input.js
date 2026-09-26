"use strict";
/* Desktop WASD/mouse + modular landscape/portrait touch controls. */
(function(root){
  const VF = root.VocabForce = root.VocabForce || {};

  function VocabForceInput(){
    this.moveX = 0; this.moveZ = 0;
    this.lookX = 0; this.lookY = 0;
    this.sprint = false; this.jump = false; this.jumpQueued = false;
    this.punch = false; this.kick = false; this.block = false;
    this.punchQueued = false; this.kickQueued = false;
    this.throwQueued = false;
    this.dashQueued = false;
    this.slamQueued = false;
    this.punchHeld = false;
    this.punchReleased = false;
    this.spectating = false;
    this.spectateQueued = 0;
    this.exit = false;
    this._keys = {};
    this._pointers = new Map();
    this._joy = {id: null, x: 0, z: 0};
    this._lookId = null;
    this._lookLast = null;
    this._ptrBlock = false;
    this._ptrSprint = false;
    this.root = null;
    this.hud = null;
    this.bound = false;
    this._onKey = this._onKey.bind(this);
    this._onKeyUp = this._onKeyUp.bind(this);
    this._onPointerDown = this._onPointerDown.bind(this);
    this._onPointerMove = this._onPointerMove.bind(this);
    this._onPointerUp = this._onPointerUp.bind(this);
    this._onContext = function(e){ e.preventDefault(); };
    this._onBlur = this.clear.bind(this);
  }

  VocabForceInput.prototype.bind = function(root, hud){
    if(this.bound) return;
    this.root = root;
    this.hud = hud || {};
    this.bound = true;
    window.addEventListener('keydown', this._onKey);
    window.addEventListener('keyup', this._onKeyUp);
    window.addEventListener('blur', this._onBlur);
    root.addEventListener('pointerdown', this._onPointerDown);
    window.addEventListener('pointermove', this._onPointerMove);
    window.addEventListener('pointerup', this._onPointerUp);
    window.addEventListener('pointercancel', this._onPointerUp);
    root.addEventListener('contextmenu', this._onContext);
  };

  VocabForceInput.prototype.unbind = function(){
    if(!this.bound) return;
    window.removeEventListener('keydown', this._onKey);
    window.removeEventListener('keyup', this._onKeyUp);
    window.removeEventListener('blur', this._onBlur);
    if(this.root){
      this.root.removeEventListener('pointerdown', this._onPointerDown);
      this.root.removeEventListener('contextmenu', this._onContext);
    }
    window.removeEventListener('pointermove', this._onPointerMove);
    window.removeEventListener('pointerup', this._onPointerUp);
    window.removeEventListener('pointercancel', this._onPointerUp);
    this.bound = false;
    this.clear();
  };

  VocabForceInput.prototype.clear = function(){
    this._keys = {};
    this._pointers.clear();
    this._joy = {id: null, x: 0, z: 0};
    this._lookId = null;
    this._lookLast = null;
    this.moveX = 0; this.moveZ = 0; this.lookX = 0; this.lookY = 0;
    this.sprint = false; this.jump = false; this.block = false;
    this.jumpQueued = false;
    this._ptrBlock = false; this._ptrSprint = false;
    this.punch = false; this.kick = false;
    this.punchQueued = false; this.kickQueued = false;
    this.throwQueued = false;
    this.dashQueued = false;
    this.slamQueued = false;
    this.punchHeld = false;
    this.punchReleased = false;
    this.spectateQueued = 0;
    this._syncJoyKnob();
  };

  VocabForceInput.prototype.setSpectating = function(on){
    const next = !!on;
    if(this.spectating === next) return;
    this.clear();
    this.spectating = next;
  };

  VocabForceInput.prototype._onKey = function(e){
    if(this.spectating){
      if(e.code === 'ArrowLeft' || e.code === 'KeyA'){ this.spectateQueued = -1; e.preventDefault(); return; }
      if(e.code === 'ArrowRight' || e.code === 'KeyD'){ this.spectateQueued = 1; e.preventDefault(); return; }
      if(e.code === 'Escape') this.exit = true;
      return;
    }
    if(e.repeat && (e.code === 'Space' || e.code === 'KeyF' || e.code === 'KeyE' || e.code === 'KeyG' || e.code === 'KeyR')) return;
    this._keys[e.code] = true;
    if(e.code === 'Space'){ this.jumpQueued = true; e.preventDefault(); }
    if(e.code === 'KeyF' || e.code === 'ControlLeft'){ this.kickQueued = true; e.preventDefault(); }
    if(e.code === 'KeyG'){ this.throwQueued = true; e.preventDefault(); }
    if(e.code === 'KeyE'){ this.dashQueued = true; e.preventDefault(); }
    if(e.code === 'KeyR'){ this.slamQueued = true; e.preventDefault(); }
    if(e.code === 'Escape') this.exit = true;
    if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].indexOf(e.code) >= 0) e.preventDefault();
  };

  VocabForceInput.prototype._onKeyUp = function(e){
    this._keys[e.code] = false;
  };

  VocabForceInput.prototype._actFromTarget = function(t){
    const btn = t && t.closest ? t.closest('[data-vf-act]') : null;
    return btn ? btn.getAttribute('data-vf-act') : '';
  };

  VocabForceInput.prototype._onPointerDown = function(e){
    if(!this.root) return;
    const act = this._actFromTarget(e.target);
    if(this.spectating){
      if(act === 'exit'){ this.exit = true; return; }
      this._pointers.set(e.pointerId, {act: 'spectate', sx: e.clientX, sy: e.clientY, x: e.clientX, y: e.clientY});
      return;
    }
    if(act === 'punch'){
      this.punchQueued = true;
      this.punchHeld = true;
      this._pointers.set(e.pointerId, {act: act});
      return;
    }
    if(act === 'kick'){ this.kickQueued = true; this._pointers.set(e.pointerId, {act: act}); return; }
    if(act === 'throw'){ this.throwQueued = true; this._pointers.set(e.pointerId, {act: act}); return; }
    if(act === 'jump'){ this.jumpQueued = true; this._pointers.set(e.pointerId, {act: act}); return; }
    if(act === 'block'){ this._ptrBlock = true; this._pointers.set(e.pointerId, {act: act}); return; }
    if(act === 'sprint'){ this._ptrSprint = true; this._pointers.set(e.pointerId, {act: act}); return; }
    if(act === 'dash'){ this.dashQueued = true; this._pointers.set(e.pointerId, {act: act}); return; }
    if(act === 'slam'){ this.slamQueued = true; this._pointers.set(e.pointerId, {act: act}); return; }
    if(act === 'exit'){ this.exit = true; return; }
    const rect = this.root.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const left = x < rect.width * 0.46;
    if(left && (e.pointerType === 'touch' || e.pointerType === 'pen' || (this.hud && this.hud.joy))){
      this._joy.id = e.pointerId;
      this._joy.originX = x; this._joy.originY = y;
      this._setJoyFrom(x, y);
      this._pointers.set(e.pointerId, {act: 'joy'});
      if(this.hud && this.hud.joy) this.hud.joy.setPointerCapture && this.hud.joy.setPointerCapture(e.pointerId);
      return;
    }
    if(e.button === 2){
      this._ptrBlock = true;
      this._pointers.set(e.pointerId, {act: 'block'});
      return;
    }
    if(e.button === 0 && e.pointerType === 'mouse'){
      this.punchQueued = true;
      this._lookId = e.pointerId;
      this._lookLast = {x: e.clientX, y: e.clientY};
      this._pointers.set(e.pointerId, {act: 'look'});
      return;
    }
    this._lookId = e.pointerId;
    this._lookLast = {x: e.clientX, y: e.clientY};
    this._pointers.set(e.pointerId, {act: 'look'});
  };

  VocabForceInput.prototype._setJoyFrom = function(x, y){
    const ox = this._joy.originX, oy = this._joy.originY;
    let dx = (x - ox) / 46, dz = (y - oy) / 46;
    const len = Math.hypot(dx, dz) || 1;
    if(len > 1){ dx /= len; dz /= len; }
    this._joy.x = dx; this._joy.z = -dz;
    this._syncJoyKnob();
  };

  VocabForceInput.prototype._syncJoyKnob = function(){
    if(!this.hud || !this.hud.joyKnob) return;
    this.hud.joyKnob.style.transform = 'translate(calc(-50% + ' + ((this._joy.x || 0) * 22) + 'px), calc(-50% + ' + ((-(this._joy.z || 0)) * 22) + 'px))';
  };

  VocabForceInput.prototype._onPointerMove = function(e){
    const p = this._pointers.get(e.pointerId);
    if(!p) return;
    if(p.act === 'spectate'){
      p.x = e.clientX; p.y = e.clientY;
      return;
    }
    if(p.act === 'joy' && this._joy.id === e.pointerId){
      const rect = this.root.getBoundingClientRect();
      this._setJoyFrom(e.clientX - rect.left, e.clientY - rect.top);
      return;
    }
    if(p.act === 'look' && this._lookLast){
      this.lookX += e.clientX - this._lookLast.x;
      this.lookY += e.clientY - this._lookLast.y;
      this._lookLast = {x: e.clientX, y: e.clientY};
    }
  };

  VocabForceInput.prototype._onPointerUp = function(e){
    const p = this._pointers.get(e.pointerId);
    this._pointers.delete(e.pointerId);
    if(!p) return;
    if(p.act === 'spectate'){
      const dx = e.clientX - p.sx;
      const dy = e.clientY - p.sy;
      if(Math.abs(dx) >= 36 && Math.abs(dx) > Math.abs(dy) * 1.15) this.spectateQueued = dx > 0 ? 1 : -1;
      return;
    }
    if(p.act === 'joy' && this._joy.id === e.pointerId){
      this._joy.id = null; this._joy.x = 0; this._joy.z = 0; this._syncJoyKnob();
    }
    if(p.act === 'block') this._ptrBlock = false;
    if(p.act === 'sprint') this._ptrSprint = false;
    if(p.act === 'punch'){
      this.punchHeld = false;
      this.punchReleased = true;
    }
    if(p.act === 'look' && this._lookId === e.pointerId){ this._lookId = null; this._lookLast = null; }
  };

  VocabForceInput.prototype.poll = function(){
    const k = this._keys;
    if(this.spectating){
      const exit = this.exit; this.exit = false;
      const spectateStep = this.spectateQueued; this.spectateQueued = 0;
      return {moveX: 0, moveZ: 0, lookX: 0, lookY: 0, sprint: false, jump: false, punch: false, kick: false, throw: false, dash: false, slam: false, block: false, punchHeld: false, punchReleased: false, spectateStep: spectateStep, exit: exit};
    }
    let x = 0, z = 0;
    if(k.KeyA || k.ArrowLeft) x -= 1;
    if(k.KeyD || k.ArrowRight) x += 1;
    if(k.KeyW || k.ArrowUp) z += 1;
    if(k.KeyS || k.ArrowDown) z -= 1;
    if(this._joy.id != null){ x += this._joy.x; z += this._joy.z; }
    const len = Math.hypot(x, z);
    if(len > 1){ x /= len; z /= len; }
    this.moveX = x; this.moveZ = z;
    this.sprint = this._ptrSprint || !!(k.ShiftLeft || k.ShiftRight);
    this.jump = this.jumpQueued; this.jumpQueued = false;
    this.punch = this.punchQueued; this.punchQueued = false;
    this.kick = this.kickQueued; this.kickQueued = false;
    this.throw = this.throwQueued; this.throwQueued = false;
    this.dash = this.dashQueued; this.dashQueued = false;
    this.slam = this.slamQueued; this.slamQueued = false;
    this.block = this._ptrBlock || !!(k.KeyQ);
    const punchHeld = this.punchHeld;
    const punchReleased = this.punchReleased; this.punchReleased = false;
    const exit = this.exit; this.exit = false;
    const lx = this.lookX, ly = this.lookY;
    this.lookX = 0; this.lookY = 0;
    return {moveX: x, moveZ: z, lookX: lx, lookY: ly, sprint: this.sprint, jump: this.jump, punch: this.punch, kick: this.kick, throw: this.throw, dash: this.dash, slam: this.slam, block: this.block, punchHeld: punchHeld, punchReleased: punchReleased, spectateStep: 0, exit: exit};
  };

  VF.VocabForceInput = VocabForceInput;
})(typeof window !== 'undefined' ? window : globalThis);
