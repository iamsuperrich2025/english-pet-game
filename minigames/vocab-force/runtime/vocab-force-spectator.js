"use strict";
/* View-only dead-player camera. Input is limited to target cycling and exit. */
(function(root){
  const VF = root.VocabForce = root.VocabForce || {};

  function SpectatorController(){
    this.active = false;
    this.targetId = '';
    this.index = 0;
  }

  SpectatorController.prototype.enter = function(){
    this.active = true;
    this.targetId = '';
    this.index = 0;
  };

  SpectatorController.prototype.exit = function(){
    this.active = false;
    this.targetId = '';
    this.index = 0;
  };

  SpectatorController.prototype._targets = function(net){
    const rows = net && net.spectatorTargets ? net.spectatorTargets() : [];
    return rows.filter(function(p){ return p && p.alive !== false; }).sort(function(a, b){
      return String(a.id || '').localeCompare(String(b.id || ''));
    });
  };

  SpectatorController.prototype.tick = function(poll, net, hud, arena){
    if(!this.active) return null;
    const rows = this._targets(net);
    if(!rows.length){
      this.targetId = '';
      if(hud && hud.setSpectator) hud.setSpectator(true, '', 0);
      return {
        id: 'safe', name: '', x: 0,
        y: arena && arena.surfaceY ? arena.surfaceY(0, 0) : 0,
        z: 0, alive: true,
        isDashing: function(){ return false; },
        isPowerJumping: function(){ return false; }
      };
    }
    let current = rows.findIndex(function(p){ return p.id === this.targetId; }, this);
    if(current < 0) current = Math.min(this.index, rows.length - 1);
    const step = poll && poll.spectateStep || 0;
    if(step) current = (current + (step > 0 ? 1 : -1) + rows.length) % rows.length;
    this.index = current;
    const target = rows[current];
    this.targetId = target.id;
    if(target.pivot) target.pivot.visible = true;
    if(hud && hud.setSpectator) hud.setSpectator(true, target.name || 'Player', rows.length);
    target.isDashing = function(){ return false; };
    target.isPowerJumping = function(){ return false; };
    return target;
  };

  VF.SpectatorController = SpectatorController;
})(typeof window !== 'undefined' ? window : globalThis);
