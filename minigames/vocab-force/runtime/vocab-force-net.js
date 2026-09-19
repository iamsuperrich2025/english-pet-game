"use strict";
/* NetRoom presence only. Word/letters are seeded locally so RTDB stays tiny. */
(function(root){
  const VF = root.VocabForce = root.VocabForce || {};

  function packHp(player){
    const dead = !!(player && player.alive === false);
    const hp = dead ? 0 : Math.ceil((player && player.hp) || 0);
    let s = 'H|' + hp;
    const drop = player && player._vfDrop;
    if(dead && drop && drop.letters){
      const bag = String(drop.letters || '').replace(/[^A-Z]/g, '').slice(0, 16);
      if(bag) s += '|' + ((drop.seq || 1) % 100) + '|' + bag;
    }else if(!dead){
      const strike = VF._t.packStrike ? VF._t.packStrike(player) : '';
      const od = VF._t.packOverdrive ? VF._t.packOverdrive(player) : '';
      const jump = VF._t.packJump ? VF._t.packJump(player) : '';
      if(strike) s += '|' + strike;
      else if(od) s += '|' + od;
      else if(jump) s += '|' + jump;
    }
    return s.slice(0, 28);
  }
  function parseHp(raw){
    const s = String(raw || '');
    const cap = VF.PLAYER_HP || 1000;
    if(s.charAt(0) === 'H') return VF.clamp(parseInt(s.split('|')[1], 10) || 0, 0, cap);
    const n = parseInt(s, 10);
    return isFinite(n) ? VF.clamp(n, 0, cap) : cap;
  }
  function parseDrop(raw){
    const s = String(raw || '');
    if(s.charAt(0) !== 'H') return null;
    const parts = s.split('|');
    if(parts.length < 4) return null;
    const letters = String(parts[3] || '').replace(/[^A-Z]/g, '');
    if(!letters) return null;
    return {seq: parseInt(parts[2], 10) || 0, letters: letters};
  }
  function displayName(){
    try{
      if(typeof state !== 'undefined' && state && state.profileName) return String(state.profileName).slice(0, 40);
    }catch(_){}
    return 'ผู้เล่น';
  }

  function VocabForceNet(){
    this.room = null;
    this.peers = {};
    this.myUid = '';
    this._rec = {};
    this._lastW = {};
    this._hostWord = '';
    this._hostSeed = 0;
    this._seenLoot = {};
    this._seenJump = {};
    this._seenOverdrive = {};
    this._seenStrike = {};
  }

  VocabForceNet.prototype.humanCount = function(){
    if(this.room && this.room.joined) return Math.max(1, this.room.count || 1);
    return 1;
  };

  VocabForceNet.prototype.isHost = function(){
    if(!this.room || !this.room.online) return true;
    const ids = [this.myUid].concat(Object.keys(this.room.peers || {})).filter(Boolean).sort();
    return ids[0] === this.myUid;
  };

  VocabForceNet.prototype.statusText = function(){
    if(!this.room) return 'โหมดฝึกเดี่ยว';
    if(typeof this.room.statusText === 'function') return this.room.statusText(true, Object.keys(this.peers).length);
    return this.room.online ? ('👥 ' + this.humanCount() + ' คน') : '📡 กำลังหาห้อง…';
  };

  VocabForceNet.prototype.roomHud = function(){
    if(VF._t.roomHud){
      if(!this.room) return VF._t.roomHud({offline: true, here: 1});
      if(this.room.full) return VF._t.roomHud({full: true});
      if(!this.room.joined) return VF._t.roomHud({searching: true});
      const lot = parseInt(this.room.roomLabel, 10);
      return VF._t.roomHud({
        lot: lot,
        here: this.humanCount(),
        cap: VF.ROOM_MAX || 14,
        legacy: !!this.room.legacy
      });
    }
    return this.statusText();
  };

  VocabForceNet.prototype._clonePeer = function(scene, player){
    const THREE = root.THREE;
    if(!player || !player.model || !VF._t.cloneSkinned) return null;
    const pivot = new THREE.Group();
    pivot.name = 'VFPeer';
    const model = VF._t.cloneSkinned(player.model);
    pivot.add(model);
    const anim = new VF.NexAnimationController(model, player.manifest || VF.NexManifest);
    const clips = player.anim && player.anim.clips || {};
    ['idle', 'walk', 'run'].forEach(function(st){
      if(clips[st]) anim.addClip(st, clips[st]);
    });
    scene.add(pivot);
    return {pivot: pivot, model: model, anim: anim, bar: null, x: 0, z: 0, y: 0, yaw: 0};
  };

  VocabForceNet.prototype._syncPeer = function(vis, rec, dt, camera){
    const x = Number(rec.x) || 0, z = Number(rec.z) || 0, y = Number(rec.y) || 0;
    const yaw = Number(rec.yaw) || 0;
    if(vis._snap){
      vis.x += (x - vis.x) * k;
      vis.z += (z - vis.z) * k;
      vis.y += (y - vis.y) * k;
    }else{
      vis.x = x; vis.z = z; vis.y = y; vis._snap = true;
    }
    vis.yaw = yaw;
    vis.pivot.position.set(vis.x, vis.y, vis.z);
    vis.pivot.rotation.y = vis.yaw;
    const moving = Math.hypot(x - (vis._lx == null ? x : vis._lx), z - (vis._lz == null ? z : vis._lz)) > 0.08;
    vis._lx = x; vis._lz = z;
    const hp = parseHp(rec.hp);
    const alive = rec.m !== 1 && hp > 0;
    vis.pivot.visible = true;
    if(vis.anim){
      if(!alive) vis.anim.play('idle', {timeScale: 0.0001, loop: true});
      else if(moving) vis.anim.play(vis.anim.has('run') ? 'run' : 'walk');
      else vis.anim.play('idle');
      vis.anim.tick(dt);
    }
  };

  VocabForceNet.prototype.start = function(scene, player, onWord, onStatus){
    this.scene = scene;
    this.player = player;
    this.onWord = onWord;
    this.onStatus = onStatus;
    if(typeof NetRoom === 'undefined' || !NetRoom.create) return this;
    if(typeof onlineKey !== 'function') return this;
    try{
      if(typeof Online === 'undefined' || !Online.ready) return this;
    }catch(_){ return this; }
    this.myUid = onlineKey() || '';
    const self = this;
    this.room = NetRoom.create({
      map: VF.NET_MAP || 'vforce',
      roomMax: VF.ROOM_MAX || 14,
      roomsCap: VF.ROOMS_MAX || 36,
      openNewRoom: true,
      sendMs: 190,
      roomNoun: 'ลาน Vocab Force',
      roomFmt: function(i){ return 'ลาน '+i; },
      roomIcon: '⚡',
      push: function(){ self.send(); },
      onPeer: function(uid, rec){
        self._rec[uid] = rec;
        if(self.onStatus) self.onStatus();
      },
      onPeerGone: function(uid){
        delete self._rec[uid];
        self._drop(uid);
        if(self.onStatus) self.onStatus();
      },
      onStatus: function(){ if(self.onStatus) self.onStatus(); },
      toast: function(html){
        if(self.onStatus) self.onStatus();
        if(typeof toast === 'function'){
          const d = document.createElement('div');
          d.innerHTML = html;
          toast(d.textContent || 'อัปเดตห้อง');
        }
      }
    });
    if(this.room && this.room.join) this.room.join();
    return this;
  };

  VocabForceNet.prototype._drop = function(uid){
    const vis = this.peers[uid];
    if(!vis) return;
    if(vis.bar) vis.bar.dispose();
    if(vis.pivot && vis.pivot.parent) vis.pivot.parent.remove(vis.pivot);
    delete this.peers[uid];
    delete this._lastW[uid];
  };

  VocabForceNet.prototype.consumeDrops = function(){
    const out = [];
    this._seenLoot = this._seenLoot || {};
    for(const uid in this._rec){
      if(uid === this.myUid) continue;
      const rec = this._rec[uid] || {};
      const drop = parseDrop(rec.hp);
      if(!drop) continue;
      const id = uid + '#' + drop.seq;
      if(this._seenLoot[id]) continue;
      this._seenLoot[id] = true;
      out.push({
        id: id,
        uid: uid,
        letters: drop.letters.split(''),
        x: Number(rec.x) || 0,
        z: Number(rec.z) || 0,
        y: Number(rec.y) || 0
      });
    }
    return out;
  };

  VocabForceNet.prototype.consumeJumps = function(){
    const out = [];
    this._seenJump = this._seenJump || {};
    for(const uid in this._rec){
      if(uid === this.myUid) continue;
      const rec = this._rec[uid] || {};
      const jump = VF._t.parseJump ? VF._t.parseJump(rec.hp) : null;
      if(!jump) continue;
      const id = uid + '#' + jump.seq + '#' + jump.phase;
      if(this._seenJump[id]) continue;
      this._seenJump[id] = true;
      out.push({
        type: jump.phase,
        phase: jump.phase,
        seq: jump.seq,
        uid: uid,
        x: Number(rec.x) || 0,
        z: Number(rec.z) || 0,
        y: Number(rec.y) || 0,
        strength: jump.phase === 'impact' ? 1 : 0
      });
    }
    return out;
  };

  VocabForceNet.prototype.consumeOverdrive = function(){
    const out = [];
    this._seenOverdrive = this._seenOverdrive || {};
    for(const uid in this._rec){
      if(uid === this.myUid) continue;
      const rec = this._rec[uid] || {};
      const od = VF._t.parseOverdrive ? VF._t.parseOverdrive(rec.hp) : null;
      if(!od) continue;
      const id = uid + '#' + od.seq + '#' + od.phase;
      if(this._seenOverdrive[id]) continue;
      this._seenOverdrive[id] = true;
      out.push({
        type: od.phase,
        phase: od.phase,
        seq: od.seq,
        uid: uid,
        x: Number(rec.x) || 0,
        z: Number(rec.z) || 0,
        y: Number(rec.y) || 0
      });
    }
    return out;
  };

  VocabForceNet.prototype.consumeStrikes = function(){
    const out = [];
    this._seenStrike = this._seenStrike || {};
    for(const uid in this._rec){
      if(uid === this.myUid) continue;
      const rec = this._rec[uid] || {};
      const hit = VF._t.parseStrike ? VF._t.parseStrike(rec.hp) : null;
      if(!hit) continue;
      const id = uid + '#' + hit.seq;
      if(this._seenStrike[id]) continue;
      this._seenStrike[id] = true;
      out.push({
        seq: hit.seq,
        kind: hit.kind,
        zone: hit.zone,
        target: hit.target,
        dmg: hit.dmg,
        uid: uid
      });
    }
    return out;
  };

  VocabForceNet.prototype.bodies = function(player){
    const out = [];
    const me = this.myUid || 'local';
    if(player){
      out.push({
        id: me,
        x: player.x || 0,
        z: player.z || 0,
        y: player.y || 0,
        alive: player.alive !== false,
        local: true
      });
    }
    for(const uid in this._rec){
      if(uid === me) continue;
      const rec = this._rec[uid] || {};
      const vis = this.peers[uid];
      out.push({
        id: uid,
        x: vis ? vis.x : (Number(rec.x) || 0),
        z: vis ? vis.z : (Number(rec.z) || 0),
        y: vis ? vis.y : (Number(rec.y) || 0),
        alive: rec.m !== 1 && parseHp(rec.hp) > 0,
        local: false
      });
    }
    return out;
  };

  VocabForceNet.prototype.send = function(round){
    if(!this.room || !this.room.send || !this.player) return;
    const p = this.player;
    const word = round && round.progress ? round.progress.word : '';
    const force = !!p._vfDashForce;
    if(force) p._vfDashForce = false;
    this.room.send({
      n: displayName(),
      x: +p.x.toFixed(2),
      z: +p.z.toFixed(2),
      y: +p.y.toFixed(2),
      yaw: +p.yaw.toFixed(3),
      av: String((p.def && p.def.id) || 'nex').slice(0, 12),
      m: p.alive === false ? 1 : 0,
      hp: packHp(p),
      w: (round && round.wordsDone) || 0,
      c: String(word || '-').slice(0, 60),
      ct: (round && round.seed) || 0,
      cw: String((round && round.progress && round.progress.thai) || '').slice(0, 60)
    }, force);
  };

  VocabForceNet.prototype._hostRecord = function(){
    if(!this.room) return null;
    const ids = [this.myUid].concat(Object.keys(this._rec)).filter(Boolean).sort();
    const host = ids[0];
    if(!host || host === this.myUid) return null;
    return this._rec[host] || null;
  };

  VocabForceNet.prototype.tick = function(dt, player, round, camera, onPeerComplete){
    if(this.room && this.room.tick) this.room.tick();
    this.send(round);
    if(!this.room) return {};
    const live = {};
    for(const uid in this._rec){
      live[uid] = true;
      const rec = this._rec[uid] || {};
      let vis = this.peers[uid];
      if(!vis && this.scene && player) vis = this.peers[uid] = this._clonePeer(this.scene, player);
      if(vis) this._syncPeer(vis, rec, dt, camera);
      const done = Number(rec.w) || 0;
      if(onPeerComplete && this._lastW[uid] != null && done > this._lastW[uid] && rec.c && round && round.progress && rec.c === round.progress.word){
        onPeerComplete(rec.n || 'เพื่อน', rec.c, rec.cw || '', uid, rec.av || '');
      }
      this._lastW[uid] = done;
    }
    for(const uid in this.peers){
      if(!live[uid]) this._drop(uid);
    }
    if(typeof NetRoom !== 'undefined' && NetRoom.drawBudget){
      NetRoom.drawBudget({
        peers: this.peers,
        max: 8,
        dist: function(uid, vis){ return vis ? Math.hypot((player.x || 0) - vis.x, (player.z || 0) - vis.z) : 999; },
        isDrawn: function(vis){ return !!(vis && vis.pivot && vis.pivot.visible); },
        show: function(uid, vis){ if(vis && vis.pivot) vis.pivot.visible = true; },
        hide: function(uid, vis){ if(vis && vis.pivot) vis.pivot.visible = false; }
      });
    }
    if(!this.isHost() && this.onWord){
      const host = this._hostRecord();
      if(host && host.c && host.c !== '-' && (host.c !== this._hostWord || Number(host.ct) !== this._hostSeed)){
        this._hostWord = host.c;
        this._hostSeed = Number(host.ct) || 0;
        this.onWord({w: host.c, th: host.cw || '', seed: this._hostSeed});
      }
    }
    return {};
  };

  VocabForceNet.prototype.stop = function(){
    for(const uid in this.peers) this._drop(uid);
    this._rec = {};
    this._seenLoot = {};
    this._seenJump = {};
    this._seenOverdrive = {};
    this._seenStrike = {};
    if(this.room && this.room.leave) this.room.leave();
    this.room = null;
  };

  VF.VocabForceNet = VocabForceNet;
  VF._t.packHp = packHp;
  VF._t.parseHp = parseHp;
  VF._t.parseDrop = parseDrop;
})(typeof window !== 'undefined' ? window : globalThis);
