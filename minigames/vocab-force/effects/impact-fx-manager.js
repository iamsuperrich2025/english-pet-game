"use strict";
/* Pooled stylized impact FX. Spawn only on hits. No gore. */
(function(root){
  const VF = root.VocabForce = root.VocabForce || {};

  function cloneMat(src){
    return src.clone();
  }

  function poolCounts(){
    const p = VF.SecondaryImpactTune && VF.SecondaryImpactTune.POOL;
    const extra = VF.RapidFinisher && VF.RapidFinisher.POOL;
    const wall = VF.BreakableWallTune && VF.BreakableWallTune.POOL;
    const jump = VF.PowerJumpTune && VF.PowerJumpTune.POOL;
    const base = p || {ring: 8, spark: 28, flash: 6, streak: 8, line: 10, dust: 20, ghost: 8, rock: 12, plume: 6, decal: 6};
    return {
      ring: base.ring + (jump && jump.ring || 0),
      spark: base.spark,
      flash: base.flash,
      streak: base.streak,
      line: base.line + (jump && jump.line || 0),
      dust: base.dust + (jump && jump.dust || 0),
      ghost: base.ghost,
      rock: base.rock + (jump && jump.rock || 0),
      plume: base.plume + (jump && jump.plume || 0),
      decal: base.decal + (jump && jump.decal || 0),
      ichor: extra && extra.ichor, chunk: extra && extra.chunk, shard: wall && wall.shard
    };
  }

  function ImpactFXManager(){
    this.live = [];
    this.group = null;
    this.ringGeo = null;
    this.sparkGeo = null;
    this.flashGeo = null;
    this.streakGeo = null;
    this.lineGeo = null;
    this.ringMat = null;
    this.sparkMat = null;
    this.dustMat = null;
    this.flashMat = null;
    this.streakMat = null;
    this.pool = {ring: [], spark: [], flash: [], streak: [], line: [], dust: [], ghost: [], rock: [], plume: [], decal: [], ichor: [], chunk: [], shard: []};
    this._decalQ = [];
    this._burstAt = [];
  }

  ImpactFXManager.prototype.attach = function(scene){
    const THREE = root.THREE;
    const n = poolCounts();
    this.group = new THREE.Group();
    this.group.name = 'VFImpactFX';
    scene.add(this.group);
    this.ringGeo = new THREE.RingGeometry(0.18, 0.42, 20);
    this.sparkGeo = new THREE.SphereGeometry(0.055, 5, 4);
    this.flashGeo = new THREE.SphereGeometry(0.22, 8, 6);
    this.streakGeo = new THREE.BoxGeometry(0.08, 0.08, 0.85);
    this.lineGeo = new THREE.BoxGeometry(0.035, 0.035, 0.7);
    this.ghostGeo = new THREE.BoxGeometry(0.42, 1.45, 0.28);
    this.rockGeo = new THREE.BoxGeometry(0.11, 0.08, 0.09);
    this.plumeGeo = new THREE.SphereGeometry(0.22, 6, 5);
    this.decalGeo = new THREE.PlaneGeometry(1.35, 1.35);
    this.ringMat = new THREE.MeshBasicMaterial({color: 0x9bfff0, transparent: true, opacity: 0.9, side: THREE.DoubleSide, depthWrite: false});
    this.sparkMat = new THREE.MeshBasicMaterial({color: 0xfff1a8, transparent: true, opacity: 0.92, depthWrite: false});
    this.dustMat = new THREE.MeshBasicMaterial({color: 0xc4b59a, transparent: true, opacity: 0.55, depthWrite: false});
    this.flashMat = new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.95, depthWrite: false});
    this.streakMat = new THREE.MeshBasicMaterial({color: 0xb8e8ff, transparent: true, opacity: 0.8, depthWrite: false});
    this.ghostMat = new THREE.MeshBasicMaterial({color: 0x9bfff0, transparent: true, opacity: 0.35, depthWrite: false});
    this.rockMat = new THREE.MeshBasicMaterial({color: 0xb7a489, transparent: true, opacity: 0.85, depthWrite: false});
    this.plumeMat = new THREE.MeshBasicMaterial({color: 0xd8cbb4, transparent: true, opacity: 0.4, depthWrite: false});
    this.decalMat = new THREE.MeshBasicMaterial({color: 0x6a5a48, transparent: true, opacity: 0.55, side: THREE.DoubleSide, depthWrite: false});
    this.ichorMat = new THREE.MeshBasicMaterial({color: 0x7a1424, transparent: true, opacity: 0.9, depthWrite: false});
    this.chunkMat = new THREE.MeshBasicMaterial({color: 0x3a4a38, transparent: true, opacity: 0.92, depthWrite: false});
    this.shardMat = new THREE.MeshBasicMaterial({color: 0x8a5a3a, transparent: true, opacity: 0.95, depthWrite: false});
    this.ichorGeo = new THREE.SphereGeometry(0.07, 5, 4);
    this.chunkGeo = new THREE.BoxGeometry(0.22, 0.16, 0.12);
    this.shardGeo = new THREE.BoxGeometry(0.34, 0.26, 0.1);
    this._fill('ring', this.ringGeo, this.ringMat, n.ring);
    this._fill('spark', this.sparkGeo, this.sparkMat, n.spark);
    this._fill('flash', this.flashGeo, this.flashMat, n.flash);
    this._fill('streak', this.streakGeo, this.streakMat, n.streak);
    this._fill('line', this.lineGeo, this.streakMat, n.line);
    this._fill('dust', this.sparkGeo, this.dustMat, n.dust);
    this._fill('ghost', this.ghostGeo, this.ghostMat, n.ghost);
    this._fill('rock', this.rockGeo, this.rockMat, n.rock);
    this._fill('plume', this.plumeGeo, this.plumeMat, n.plume);
    this._fill('decal', this.decalGeo, this.decalMat, n.decal);
    this._fill('ichor', this.ichorGeo, this.ichorMat, n.ichor || 28);
    this._fill('chunk', this.chunkGeo, this.chunkMat, n.chunk || 20);
    this._fill('shard', this.shardGeo, this.shardMat, n.shard || 32);
    this._up = new THREE.Vector3(0, 1, 0);
    this._face = new THREE.Vector3(0, 0, 1);
    this._n = new THREE.Vector3();
    return this;
  };

  ImpactFXManager.prototype._fill = function(kind, geo, mat, n){
    const THREE = root.THREE;
    for(let i = 0; i < n; i++){
      const m = new THREE.Mesh(geo, cloneMat(mat));
      m.visible = false;
      m.userData.life = 0;
      m.userData.kind = kind;
      this.group.add(m);
      this.pool[kind].push(m);
    }
  };

  ImpactFXManager.prototype._maxLive = function(){
    const a = (VF.SecondaryImpactTune && VF.SecondaryImpactTune.MAX_LIVE) || 72;
    const b = (VF.PowerJumpTune && VF.PowerJumpTune.MAX_LIVE) || 0;
    return Math.max(a, b);
  };

  ImpactFXManager.prototype._take = function(kind){
    const arr = this.pool[kind];
    if(!arr || !arr.length) return null;
    let best = arr[0], bestLife = arr[0].userData.life;
    for(let i = 0; i < arr.length; i++){
      if(arr[i].userData.life <= 0){ best = arr[i]; break; }
      if(arr[i].userData.life < bestLife){ best = arr[i]; bestLife = arr[i].userData.life; }
    }
    if(this.live.indexOf(best) < 0){
      if(this.live.length >= this._maxLive()){
        const old = this.live.shift();
        if(old && old !== best){ old.visible = false; old.userData.life = 0; }
      }
      this.live.push(best);
    }
    return best;
  };

  ImpactFXManager.prototype._spawn = function(kind, x, y, z, life, extra){
    const m = this._take(kind);
    if(!m) return null;
    m.visible = true;
    m.position.set(x, y, z);
    m.scale.set(1, 1, 1);
    m.rotation.set(0, 0, 0);
    m.userData.life = life;
    m.userData.max = life;
    m.userData.kind = extra && extra.role || kind;
    m.userData.vx = extra && extra.vx || 0;
    m.userData.vy = extra && extra.vy || 0;
    m.userData.vz = extra && extra.vz || 0;
    m.userData.grow = extra && extra.grow || 1;
    m.userData.spin = extra && extra.spin || 0;
    m.userData.startR = extra && extra.startR;
    m.userData.endR = extra && extra.endR;
    if(m.material) m.material.opacity = extra && extra.opacity != null ? extra.opacity : 0.9;
    if(extra && extra.color != null && m.material) m.material.color.setHex(extra.color);
    if(m.material){
      const THREE = root.THREE;
      m.material.blending = (extra && extra.add && THREE && THREE.AdditiveBlending) ? THREE.AdditiveBlending : THREE.NormalBlending;
      m.material.depthWrite = false;
    }
    if(extra && extra.rotX != null) m.rotation.x = extra.rotX;
    if(extra && extra.rotY != null) m.rotation.y = extra.rotY;
    if(extra && extra.rotZ != null) m.rotation.z = extra.rotZ;
    if(extra && extra.sx) m.scale.set(extra.sx, extra.sy || extra.sx, extra.sz || extra.sx);
    return m;
  };

  ImpactFXManager.prototype._far = function(player, x, z){
    if(!player) return false;
    const lim = (VF.SecondaryImpactTune && VF.SecondaryImpactTune.FAR_DIST) || 18;
    return Math.hypot(player.x - x, player.z - z) > lim;
  };

  ImpactFXManager.prototype._wallRot = function(nx, nz){
    if(Math.abs(nx) >= Math.abs(nz)) return {rotX: 0, rotY: nx >= 0 ? Math.PI / 2 : -Math.PI / 2};
    return {rotX: 0, rotY: nz >= 0 ? 0 : Math.PI};
  };

  ImpactFXManager.prototype._placeDecal = function(x, y, z, nx, ny, nz, life, scale){
    const m = this._spawn('decal', x + nx * 0.04, y + ny * 0.04, z + nz * 0.04, life, {
      role: 'decal', opacity: 0.5, color: 0x6a5a48, sx: scale, sy: scale, sz: 1
    });
    if(!m) return;
    if(ny > 0.35) this._alignUp(m, nx, ny, nz);
    else{
      const wr = this._wallRot(nx, nz);
      m.rotation.x = wr.rotX;
      m.rotation.y = wr.rotY;
    }
    this._decalQ.push(m);
    const cap = (VF.SecondaryImpactTune && VF.SecondaryImpactTune.DECAL_MAX) || 6;
    while(this._decalQ.length > cap){
      const old = this._decalQ.shift();
      if(old){ old.visible = false; old.userData.life = 0; }
    }
  };

  ImpactFXManager.prototype.impact = function(x, y, z, forceOrOpts){
    if(!this.group) return;
    const opts = (forceOrOpts && typeof forceOrOpts === 'object') ? forceOrOpts : {force: forceOrOpts};
    const kind = opts.kind || 'punch';
    const kick = kind === 'kick' || kind === 'heavyKick';
    const heavy = kick || opts.level === 'HEAVY' || opts.level === 'EXTREME';
    const force = opts.force != null ? opts.force : (kick ? 46 : (heavy ? 36 : 26));
    const dir = opts.dir || {x: 0, z: 1};
    const yaw = Math.atan2(dir.x || 0, dir.z || 1);

    this._spawn('flash', x, y, z, kick ? 0.14 : 0.1, {role: 'flash', sx: kick ? 1.9 : (heavy ? 1.35 : 1), color: kick ? 0xffe8c8 : 0xffffff});
    this._spawn('ring', x, 0.12, z, kick ? 0.42 : (heavy ? 0.34 : 0.26), {
      role: 'ring', rotX: -Math.PI / 2, grow: kick ? 2.15 : (heavy ? 1.55 : 1.15), color: heavy ? 0xffe08a : 0x9bfff0
    });
    if(heavy){
      this._spawn('ring', x, y * 0.4 + 0.2, z, kick ? 0.3 : 0.22, {
        role: 'distort', rotX: -Math.PI / 2, grow: kick ? 2.8 : 2.1, color: 0xffffff, opacity: kick ? 0.62 : 0.45
      });
    }
    if(kick){
      this._spawn('ring', x, y + 0.15, z, 0.24, {
        role: 'ring', rotY: yaw, grow: 1.7, color: 0xffc44a, opacity: 0.7
      });
      this._spawn('streak', x, y, z, 0.2, {
        role: 'streak', rotY: yaw, sx: 1.2, sy: 1.2, sz: 2.6, color: 0xffe08a, opacity: 0.95
      });
    }
    this._spawn('streak', x, y, z, 0.16, {
      role: 'streak', rotY: yaw, sx: 1, sy: 1, sz: kick ? 2.2 : (heavy ? 1.6 : 1.1), color: 0xb8e8ff
    });
    const sparks = kick ? 12 : (heavy ? 8 : 5);
    for(let i = 0; i < sparks; i++){
      const ang = Math.random() * Math.PI * 2;
      const spd = 5 + force * 0.08;
      this._spawn('spark', x, y, z, 0.28, {
        role: 'spark',
        vx: Math.cos(ang) * spd,
        vy: 3.2 + Math.random() * 3.4,
        vz: Math.sin(ang) * spd,
        color: i % 2 ? 0xfff1a8 : 0xffffff
      });
    }
    const dustN = kick ? 9 : (heavy ? 6 : 4);
    for(let i = 0; i < dustN; i++){
      const ang = Math.random() * Math.PI * 2;
      this._spawn('dust', x, 0.1, z, kick ? 0.5 : 0.4, {
        role: 'dust',
        vx: Math.cos(ang) * ((kick ? 3.4 : 2.2) + Math.random() * 2.4),
        vy: (kick ? 1.8 : 1.2) + Math.random() * 2.2,
        vz: Math.sin(ang) * ((kick ? 3.4 : 2.2) + Math.random() * 2.4)
      });
    }
    const lines = heavy ? 5 : 3;
    for(let i = 0; i < lines; i++){
      const ang = yaw + (i - lines / 2) * 0.22;
      this._spawn('line', x + Math.sin(ang) * 0.2, y + 0.1 * i, z + Math.cos(ang) * 0.2, 0.14, {
        role: 'line', rotY: ang, color: 0xdfffff, opacity: 0.7
      });
    }
  };

  ImpactFXManager.prototype.land = function(x, y, z, speed){
    if(!this.group) return;
    const n = speed > 12 ? 8 : 5;
    this._spawn('ring', x, y + 0.08, z, 0.28, {role: 'ring', rotX: -Math.PI / 2, grow: 0.9 + speed * 0.04, color: 0xc4b59a});
    for(let i = 0; i < n; i++){
      const ang = Math.random() * Math.PI * 2;
      this._spawn('dust', x, y + 0.06, z, 0.42, {
        role: 'dust',
        vx: Math.cos(ang) * (2 + speed * 0.12),
        vy: 1 + Math.random() * 2.2,
        vz: Math.sin(ang) * (2 + speed * 0.12)
      });
    }
  };

  ImpactFXManager.prototype.wallImpact = function(ev, spec, player){
    if(!this.group || !ev || !spec) return;
    const x = ev.x, y = ev.y, z = ev.z;
    const nx = ev.nx || 0, nz = ev.nz || 0;
    const wr = this._wallRot(nx, nz);
    const far = this._far(player, x, z);
    const grow = spec.grow || 1;
    this._spawn('flash', x, y, z, 0.12, {role: 'flash', sx: spec.flash, color: 0xffffff});
    this._spawn('ring', x + nx * 0.05, y, z + nz * 0.05, 0.38, {
      role: 'ring', rotX: wr.rotX, rotY: wr.rotY, grow: grow, color: 0xffe08a, opacity: 0.9
    });
    this._spawn('ring', x + nx * 0.08, y, z + nz * 0.08, 0.28, {
      role: 'distort', rotX: wr.rotX, rotY: wr.rotY, grow: grow * 1.35, color: 0xffffff, opacity: 0.4
    });
    if(spec.rings > 2){
      this._spawn('ring', x, y, z, 0.46, {
        role: 'ring', rotX: wr.rotX, rotY: wr.rotY, grow: grow * 1.7, color: 0x9bfff0, opacity: 0.5
      });
    }
    const yawIn = Math.atan2(-(ev.vx || 0), -(ev.vz || 1));
    const streaks = far ? Math.min(2, spec.streaks) : spec.streaks;
    for(let i = 0; i < streaks; i++){
      const ang = yawIn + (i - streaks / 2) * 0.16;
      this._spawn('streak', x - nx * 0.2, y + (i - streaks / 2) * 0.12, z - nz * 0.2, 0.18, {
        role: 'streak', rotY: ang, sx: 1.1, sy: 1.1, sz: 1.4 + grow * 0.3, color: 0xb8e8ff,
        vx: -(ev.vx || 0) * 0.04, vz: -(ev.vz || 0) * 0.04
      });
    }
    const dustN = far ? Math.ceil(spec.dust * 0.4) : spec.dust;
    for(let i = 0; i < dustN; i++){
      const side = (Math.random() * 2 - 1);
      const up = Math.random() * 2 - 0.2;
      this._spawn('dust', x, y, z, 0.5, {
        role: 'dust',
        vx: nx * (2.4 + Math.random() * 4) + (-nz) * side * 3,
        vy: 1.6 + up * 3.2,
        vz: nz * (2.4 + Math.random() * 4) + nx * side * 3,
        color: 0xc4b59a
      });
    }
    if(!far){
      for(let i = 0; i < spec.debris; i++){
        const side = (Math.random() * 2 - 1);
        this._spawn('rock', x, y, z, 0.55, {
          role: 'rock',
          vx: nx * (4 + Math.random() * 7) + (-nz) * side * 5,
          vy: 3 + Math.random() * 6,
          vz: nz * (4 + Math.random() * 7) + nx * side * 5,
          spin: VF.rand(-8, 8)
        });
      }
      for(let i = 0; i < spec.sparks; i++){
        const side = Math.random() * Math.PI * 2;
        this._spawn('spark', x, y, z, 0.32, {
          role: 'spark',
          vx: nx * 6 + Math.cos(side) * 4,
          vy: 4 + Math.random() * 5,
          vz: nz * 6 + Math.sin(side) * 4,
          color: i % 2 ? 0xfff1a8 : 0xffffff
        });
      }
    }
    for(let i = 0; i < spec.plume; i++){
      this._spawn('plume', x + nx * 0.15, y + 0.2, z + nz * 0.15, 0.48, {
        role: 'plume', grow: 1.4 + i * 0.35, opacity: 0.38, color: 0xd8cbb4,
        vx: nx * 0.8, vy: 1.4, vz: nz * 0.8
      });
    }
    if(spec.decal && !far){
      const life = (VF.SecondaryImpactTune && VF.SecondaryImpactTune.DECAL_LIFE) || 1.55;
      this._placeDecal(x, y, z, nx, 0, nz, life, 0.9 + grow * 0.25);
    }
  };

  ImpactFXManager.prototype.wallShatter = function(ev, tier, player, crowded){
    if(!this.group || !ev) return;
    const T = VF.BreakableWallTune || {};
    const x = ev.x, y = ev.y, z = ev.z;
    const nx = ev.nx || 0, nz = ev.nz || 0;
    const wr = this._wallRot(nx, nz);
    const far = this._far(player, x, z);
    const extreme = tier === 'EXTREME';
    let dens = VF._t.breakableDensity ? VF._t.breakableDensity() : 1;
    if(crowded) dens *= 0.45;
    if(far) dens *= 0.55;
    const grow = extreme ? 3.1 : 2.45;
    const nShard = Math.max(6, Math.round((extreme ? T.extremeShardCount : T.shardCount) * dens));
    const nDust = Math.max(6, Math.round((extreme ? T.extremeDust : T.dust) * dens));
    const nChip = Math.max(4, Math.round((extreme ? T.extremeChips : T.chips) * dens));
    const nStreak = Math.max(3, Math.round((T.streaks || 6) * dens));
    const inbound = Math.hypot(ev.vx || 0, ev.vz || 0) || 1;
    const ix = -(ev.vx || 0) / inbound, iz = -(ev.vz || 0) / inbound;
    this._spawn('flash', x, y, z, 0.16, {role: 'flash', sx: extreme ? 3.2 : 2.4, color: 0xfff4d2});
    this._spawn('flash', x + nx * 0.1, y, z + nz * 0.1, 0.1, {role: 'flash', sx: 1.6, color: 0xffffff});
    this._spawn('ring', x + nx * 0.04, y, z + nz * 0.04, 0.42, {
      role: 'ring', rotX: wr.rotX, rotY: wr.rotY, grow: grow, color: 0xffc978, opacity: 0.95
    });
    this._spawn('ring', x + nx * 0.08, y, z + nz * 0.08, 0.34, {
      role: 'distort', rotX: wr.rotX, rotY: wr.rotY, grow: grow * 1.45, color: 0xffffff, opacity: 0.5
    });
    this._spawn('ring', x, y, z, 0.5, {
      role: 'ring', rotX: wr.rotX, rotY: wr.rotY, grow: grow * 1.85, color: 0xc47a4a, opacity: 0.55
    });
    for(let i = 0; i < 3; i++){
      this._spawn('streak', x, y + (i - 1) * 0.28, z, 0.16, {
        role: 'streak', rotY: wr.rotY, sx: 0.18, sy: 0.04, sz: 1.8 + i * 0.3, color: 0x2a1810, opacity: 0.8
      });
    }
    const yawIn = Math.atan2(-(ev.vx || 0), -(ev.vz || 1));
    for(let i = 0; i < nStreak; i++){
      const ang = yawIn + (i - nStreak / 2) * 0.14;
      this._spawn('streak', x - nx * 0.15, y + (i - nStreak / 2) * 0.1, z - nz * 0.15, 0.2, {
        role: 'streak', rotY: ang, sx: 1.2, sy: 1.2, sz: 1.8 + grow * 0.25, color: 0xffe08a,
        vx: (ev.vx || 0) * 0.05, vz: (ev.vz || 0) * 0.05
      });
    }
    const shardTint = [0x8a5a3a, 0x6a4430, 0xb07a52, 0x4a3b58, 0x3a2a22];
    for(let i = 0; i < nShard; i++){
      const side = Math.random() * 2 - 1;
      const out = 8 + Math.random() * (extreme ? 14 : 9);
      this._spawn('shard', x, y + Math.random() * 0.8, z, T.shardLife || 0.72, {
        role: 'shard',
        vx: nx * out + (-nz) * side * 7 + ix * 3,
        vy: 4 + Math.random() * 8,
        vz: nz * out + nx * side * 7 + iz * 3,
        spin: VF.rand(-14, 14),
        color: shardTint[i % shardTint.length],
        sx: 0.7 + Math.random() * 1.1, sy: 0.55 + Math.random() * 1.2, sz: 0.45 + Math.random() * 0.8
      });
    }
    for(let i = 0; i < nChip; i++){
      const side = Math.random() * 2 - 1;
      this._spawn('rock', x, y, z, T.chipLife || 0.48, {
        role: 'rock',
        vx: nx * (5 + Math.random() * 8) + (-nz) * side * 6,
        vy: 3 + Math.random() * 7,
        vz: nz * (5 + Math.random() * 8) + nx * side * 6,
        spin: VF.rand(-10, 10),
        color: 0xb7a489
      });
    }
    for(let i = 0; i < nDust; i++){
      const side = Math.random() * 2 - 1;
      this._spawn('dust', x, y, z, 0.55, {
        role: 'dust',
        vx: nx * (3 + Math.random() * 6) + (-nz) * side * 4,
        vy: 1.8 + Math.random() * 3.6,
        vz: nz * (3 + Math.random() * 6) + nx * side * 4,
        color: 0xc4b59a
      });
    }
    const plumes = T.plume || 2;
    for(let i = 0; i < plumes; i++){
      this._spawn('plume', x + nx * 0.2, y + 0.25, z + nz * 0.2, 0.55, {
        role: 'plume', grow: 1.8 + i * 0.4, opacity: 0.42, color: 0xd8cbb4,
        vx: nx * 1.1, vy: 1.6, vz: nz * 1.1
      });
    }
    this._placeDecal(x, Math.max(0.04, y - 0.8), z, 0, 1, 0, 1.4, extreme ? 1.6 : 1.2);
  };

  ImpactFXManager.prototype.groundImpact = function(ev, spec, player){
    if(!this.group || !ev || !spec) return;
    const x = ev.x, y = ev.y, z = ev.z;
    const far = this._far(player, x, z);
    const grow = spec.grow || 1;
    const extreme = spec.flash >= 2;
    this._spawn('flash', x, y + 0.2, z, 0.11, {role: 'flash', sx: spec.flash, color: 0xffffff});
    this._spawn('ring', x, y + 0.06, z, 0.4, {
      role: 'ring', rotX: -Math.PI / 2, grow: grow, color: 0xc4b59a
    });
    this._spawn('ring', x, y + 0.08, z, 0.28, {
      role: 'distort', rotX: -Math.PI / 2, grow: grow * 1.25, color: 0xffe08a, opacity: 0.5
    });
    if(spec.rings > 2){
      this._spawn('ring', x, y + 0.05, z, 0.5, {
        role: 'ring', rotX: -Math.PI / 2, grow: grow * (extreme ? 2.2 : 1.6), color: 0x9bfff0, opacity: 0.4
      });
    }
    const dustN = far ? Math.ceil(spec.dust * 0.4) : spec.dust;
    for(let i = 0; i < dustN; i++){
      const ang = Math.random() * Math.PI * 2;
      this._spawn('dust', x, y + 0.05, z, 0.52, {
        role: 'dust',
        vx: Math.cos(ang) * (3 + grow * 2.4),
        vy: 0.8 + Math.random() * 1.6,
        vz: Math.sin(ang) * (3 + grow * 2.4)
      });
    }
    for(let i = 0; i < spec.plume; i++){
      this._spawn('plume', x, y + 0.15, z, 0.55, {
        role: 'plume', grow: 1.6 + i * 0.5, opacity: 0.42, color: 0xd8cbb4,
        vx: 0, vy: 2.2 + i * 0.6, vz: 0, sx: 0.8, sy: 1.4, sz: 0.8
      });
    }
    if(!far){
      for(let i = 0; i < spec.debris; i++){
        const ang = Math.random() * Math.PI * 2;
        this._spawn('rock', x, y + 0.08, z, 0.58, {
          role: 'rock',
          vx: Math.cos(ang) * (3.5 + grow * 3),
          vy: 2.8 + Math.random() * 4.5,
          vz: Math.sin(ang) * (3.5 + grow * 3),
          spin: VF.rand(-10, 10)
        });
      }
      const streaks = spec.streaks;
      for(let i = 0; i < streaks; i++){
        const ang = (i / Math.max(1, streaks)) * Math.PI * 2;
        this._spawn('line', x, y + 0.12, z, 0.16, {
          role: 'line', rotY: ang, color: 0xdfffff, opacity: 0.7
        });
      }
    }
    if(spec.decal && !far){
      const life = (VF.SecondaryImpactTune && VF.SecondaryImpactTune.DECAL_LIFE) || 1.55;
      this._placeDecal(x, y + 0.03, z, 0, 1, 0, life, 1.1 + grow * 0.35);
    }
  };

  ImpactFXManager.prototype._alignUp = function(m, nx, ny, nz){
    const THREE = root.THREE;
    if(!m) return;
    if(!THREE || !this._n || !this._face){
      m.rotation.x = -Math.PI / 2;
      return;
    }
    this._n.set(nx || 0, ny == null ? 1 : ny, nz || 0);
    if(this._n.lengthSq() < 1e-6) this._n.set(0, 1, 0);
    this._n.normalize();
    m.quaternion.setFromUnitVectors(this._face, this._n);
  };

  ImpactFXManager.prototype.powerJumpLaunch = function(x, y, z, dirX, dirZ){
    if(!this.group) return;
    const yaw = Math.atan2(dirX || 0, dirZ || 1);
    this._spawn('flash', x, y + 0.35, z, 0.1, {role: 'flash', sx: 1.1, color: 0xfff4d2});
    this._spawn('ring', x, y + 0.05, z, 0.22, {role: 'ring', rotX: -Math.PI / 2, grow: 1.1, color: 0xe8d7b0, opacity: 0.55});
    for(let i = 0; i < 6; i++){
      const ang = Math.random() * Math.PI * 2;
      this._spawn('dust', x, y + 0.04, z, 0.32, {
        role: 'dust',
        vx: Math.cos(ang) * 2.2 + (dirX || 0) * 1.4,
        vy: 1.1 + Math.random(),
        vz: Math.sin(ang) * 2.2 + (dirZ || 0) * 1.4
      });
    }
    this._spawn('line', x, y + 0.7, z, 0.14, {role: 'line', rotY: yaw, color: 0xffe8c4, opacity: 0.7});
  };

  ImpactFXManager.prototype.powerJumpImpact = function(hit, strength, opts){
    if(!this.group || !hit) return;
    opts = opts || {};
    const T = VF.PowerJumpTune || {};
    const s = strength != null ? strength : 1;
    const x = hit.x, y = hit.y, z = hit.z;
    const nx = hit.nx || 0, ny = hit.ny == null ? 1 : hit.ny, nz = hit.nz || 0;
    const far = !opts.local && this._far(opts.player, x, z);
    const dustN = Math.max(12, Math.round((T.DUST_COUNT || 28) * (0.65 + 0.35 * s) * (far ? 0.45 : 1)));
    const rockN = Math.max(6, Math.round((T.DEBRIS_COUNT || 12) * (0.7 + 0.3 * s) * (far ? 0.4 : 1)));
    const startR = T.SHOCKWAVE_START_RADIUS || 0.5;
    const endR = T.SHOCKWAVE_END_RADIUS || 7;
    const life = T.SHOCKWAVE_DURATION || 0.45;
    this._spawn('flash', x, y + 0.22, z, 0.12, {role: 'flash', sx: 1.6 + s * 0.9, color: 0xfff6e4});
    const shockA = this._spawn('ring', x, y + 0.05, z, life, {
      role: 'shock', startR: startR, endR: endR, color: 0xe8d2a8, opacity: 0.82
    });
    if(shockA) this._alignUp(shockA, nx, ny, nz);
    const shockB = this._spawn('ring', x, y + 0.08, z, life * 0.78, {
      role: 'shock', startR: startR * 0.8, endR: endR * 0.72, color: 0xfff1c8, opacity: 0.5
    });
    if(shockB) this._alignUp(shockB, nx, ny, nz);
    const dustRing = this._spawn('ring', x, y + 0.04, z, 0.38, {
      role: 'shock', startR: 0.7, endR: 3.2 + s * 1.4, color: 0xc4b59a, opacity: 0.4
    });
    if(dustRing) this._alignUp(dustRing, nx, ny, nz);
    for(let i = 0; i < dustN; i++){
      const ang = Math.random() * Math.PI * 2;
      const spd = 3.2 + s * 4.2;
      this._spawn('dust', x, y + 0.06, z, 0.7 + Math.random() * 0.35, {
        role: 'dust',
        vx: Math.cos(ang) * spd,
        vy: 1.2 + Math.random() * 2.8,
        vz: Math.sin(ang) * spd,
        color: i % 2 ? 0xc4b59a : 0xd8cbb4
      });
    }
    if(opts.dirX || opts.dirZ){
      const yaw = Math.atan2(opts.dirX || 0, opts.dirZ || 1);
      for(let i = 0; i < 6; i++){
        const a = yaw + (i / 6 - 0.5) * 1.2;
        this._spawn('plume', x, y + 0.1, z, 0.55, {
          role: 'plume', grow: 1.4, opacity: 0.38, color: 0xd8cbb4,
          vx: Math.sin(a) * 2.4, vy: 0.8, vz: Math.cos(a) * 2.4
        });
      }
    }
    for(let i = 0; i < 2; i++){
      this._spawn('plume', x, y + 0.12, z, 0.7, {
        role: 'plume', grow: 1.8 + i * 0.5, opacity: 0.4, color: 0xd8cbb4,
        vx: 0, vy: 1.8 + i * 0.6, vz: 0
      });
    }
    if(!far){
      for(let i = 0; i < rockN; i++){
        const ang = Math.random() * Math.PI * 2;
        const spd = 4 + s * 5;
        const rock = this._spawn('rock', x, y + 0.1, z, 1.15 + Math.random() * 0.55, {
          role: 'rock',
          vx: Math.cos(ang) * spd,
          vy: 3.2 + Math.random() * 5,
          vz: Math.sin(ang) * spd,
          spin: VF.rand(-12, 12),
          color: 0xb7a489
        });
        if(rock) rock.scale.set(0.8 + Math.random() * 0.7, 0.6 + Math.random() * 0.6, 0.7 + Math.random() * 0.6);
      }
    }
    const crackLife = T.CRACK_LIFETIME || 4;
    const crackScale = (T.CRACK_SCALE || 2.4) * (0.85 + 0.3 * s);
    this._placeDecal(x, y + 0.02, z, nx, ny, nz, crackLife, crackScale);
    const crackCount = far ? 3 : 5;
    for(let i = 0; i < crackCount; i++){
      const ang = (i / crackCount) * Math.PI + Math.random() * 0.25;
      const crack = this._spawn('line', x, y + 0.03, z, crackLife, {
        role: 'crack', rotX: -Math.PI / 2, rotY: ang, color: 0x4a3c32, opacity: 0.62, sx: 0.45, sy: 0.08, sz: 1.1 + s * 0.6
      });
      if(crack && ny < 0.98) this._alignUp(crack, nx, ny, nz);
    }
  };

  ImpactFXManager.prototype.launchTrail = function(x, y, z, vx, vy, vz, speed, dist){
    if(!this.group) return;
    const far = dist != null && dist > ((VF.SecondaryImpactTune && VF.SecondaryImpactTune.FAR_DIST) || 18);
    if(far) return;
    const yaw = Math.atan2(vx || 0, vz || 1);
    const k = VF.clamp((speed - 12) / 30, 0.2, 1);
    this._spawn('ghost', x, y, z, 0.14, {role: 'ghost', rotY: yaw, opacity: 0.22 * k, color: 0x9bfff0, sx: 0.7, sy: 1, sz: 0.7});
    this._spawn('streak', x, y, z, 0.12, {
      role: 'streak', rotY: yaw, sx: 0.7, sy: 0.7, sz: 0.9 + k, color: 0xb8e8ff, opacity: 0.55 * k
    });
    if(y < 1.35 && k > 0.45){
      this._spawn('dust', x, Math.max(0.05, y - 0.7), z, 0.22, {
        role: 'dust', vx: VF.rand(-0.6, 0.6), vy: 0.4, vz: VF.rand(-0.6, 0.6), opacity: 0.3
      });
    }
  };

  ImpactFXManager.prototype.trailBurst = function(x, y, z, vx, vy, vz){
    if(!this.group) return;
    const yaw = Math.atan2(vx || 0, vz || 1);
    this._spawn('flash', x, y, z, 0.1, {role: 'flash', sx: 1.6, color: 0xffffff});
    for(let i = -2; i <= 2; i++){
      this._spawn('streak', x, y + i * 0.12, z, 0.16, {role: 'streak', rotY: yaw + i * 0.08, color: 0xffe08a, sz: 1.5});
    }
  };

  ImpactFXManager.prototype.dashStart = function(x, y, z, dirX, dirZ, strength){
    if(!this.group) return;
    const yaw = Math.atan2(dirX || 0, dirZ || 1);
    const s = strength != null ? strength : 0.85;
    this._spawn('flash', x, y + 0.9, z, 0.09, {role: 'flash', sx: 0.9 + s * 0.4, color: 0xffffff});
    this._spawn('ring', x, y + 0.06, z, 0.22, {role: 'ring', rotX: -Math.PI / 2, grow: 0.8 + s * 0.4, color: 0x9bfff0});
    for(let i = 0; i < 4; i++){
      const ang = Math.random() * Math.PI * 2;
      this._spawn('dust', x, y + 0.05, z, 0.28, {
        role: 'dust',
        vx: Math.cos(ang) * 2.4,
        vy: 1.4 + Math.random(),
        vz: Math.sin(ang) * 2.4
      });
    }
    for(let i = -1; i <= 1; i++){
      this._spawn('line', x, y + 0.8 + i * 0.12, z, 0.16, {role: 'line', rotY: yaw + i * 0.08, color: 0xdfffff, opacity: 0.8});
    }
  };

  ImpactFXManager.prototype.dashGhost = function(x, y, z, yaw){
    if(!this.group) return;
    this._spawn('ghost', x, y + 0.9, z, 0.16, {role: 'ghost', rotY: yaw || 0, opacity: 0.32, color: 0x9bfff0});
  };

  ImpactFXManager.prototype.dashEnd = function(x, y, z, dirX, dirZ, strength){
    if(!this.group) return;
    const s = strength != null ? strength : 0.55;
    this._spawn('flash', x, y + 0.85, z, 0.08, {role: 'flash', sx: 0.7 + s * 0.3, color: 0xb8fff4});
    this._spawn('ring', x, y + 0.07, z, 0.2, {role: 'ring', rotX: -Math.PI / 2, grow: 0.7 + s * 0.35, color: 0xffe08a});
  };

  ImpactFXManager.prototype.burstFinisher = function(x, y, z, opts){
    if(!this.group) return;
    const T = VF.RapidFinisher || {};
    const now = VF.now ? VF.now() : Date.now();
    this._burstAt = (this._burstAt || []).filter(function(t){ return now - t < 900; });
    this._burstAt.push(now);
    const crowded = this._burstAt.length > (T.maxLive || 2);
    let dens = VF._t.rapidDensity ? VF._t.rapidDensity() : 1;
    if(crowded) dens *= 0.45;
    opts = opts || {};
    const kick = opts.kind === 'kick' || opts.kind === 'heavyKick';
    const dir = opts.dir || {x: 0, z: 1};
    const dlen = Math.hypot(dir.x || 0, dir.z || 0) || 1;
    const dx = (dir.x || 0) / dlen, dz = (dir.z || 0) / dlen;
    const cone = kick ? (T.kickCone || 0.78) : (T.punchCone || 0.48);
    const force = (T.burstForce || 14) * (kick ? (T.kickForceMul || 1.28) : 1) * dens;
    const lift = (T.verticalForce || 8) * dens;
    const nFrag = Math.max(4, Math.round((T.fragmentCount || 10) * dens));
    const nIchor = Math.max(5, Math.round((T.ichorCount || 14) * dens));
    const nDust = Math.max(4, Math.round((T.dust || 10) * dens));
    const nStreak = Math.max(4, Math.round((T.streaks || 8) * dens));
    const grow = kick ? 3.15 : 2.35;
    this._spawn('flash', x, y, z, 0.14, {role: 'flash', sx: (T.flashScale || 2.4) * (kick ? 1.2 : 1), color: 0xffe8f0});
    this._spawn('flash', x, y, z, 0.1, {role: 'flash', sx: 1.4, color: 0xffffff});
    this._spawn('ring', x, 0.1, z, 0.42, {role: 'ring', rotX: -Math.PI / 2, grow: grow, color: 0xc21e3a, opacity: 0.85});
    this._spawn('ring', x, y * 0.35, z, 0.32, {role: 'distort', rotX: -Math.PI / 2, grow: grow * 1.35, color: 0xff6a7a, opacity: 0.5});
    if((T.rings || 4) > 2){
      this._spawn('ring', x, 0.08, z, 0.5, {role: 'ring', rotX: -Math.PI / 2, grow: grow * 1.7, color: 0x4a0810, opacity: 0.4});
    }
    const yaw = Math.atan2(dx, dz);
    for(let i = 0; i < nStreak; i++){
      const spread = (i / Math.max(1, nStreak - 1) - 0.5) * (kick ? 1.1 : 0.7);
      this._spawn('streak', x, y + (i % 3) * 0.12, z, 0.2, {
        role: 'streak', rotY: yaw + spread, sz: kick ? 2.2 : 1.6, color: i % 2 ? 0xff6a7a : 0xffe08a, opacity: 0.88
      });
    }
    const chunkTint = [0x3a4a38, 0x2a2e28, 0x5c6e52, 0x1c1814];
    for(let i = 0; i < nFrag; i++){
      const ang = Math.random() * Math.PI * 2;
      const rx = Math.cos(ang), rz = Math.sin(ang);
      const mx = dx * cone + rx * (1 - cone);
      const mz = dz * cone + rz * (1 - cone);
      const ml = Math.hypot(mx, mz) || 1;
      this._spawn('chunk', x, y, z, T.fragmentLife || 0.55, {
        role: 'chunk',
        vx: mx / ml * (force * (0.7 + Math.random() * 0.8)),
        vy: lift * (0.45 + Math.random() * 0.8),
        vz: mz / ml * (force * (0.7 + Math.random() * 0.8)),
        spin: VF.rand(-12, 12),
        color: chunkTint[i % chunkTint.length],
        sx: 0.7 + Math.random() * 0.7, sy: 0.6 + Math.random() * 0.8, sz: 0.5 + Math.random() * 0.6
      });
    }
    const ichorTint = [0x7a1424, 0x4a0810, 0xc21e3a, 0x2a060c];
    for(let i = 0; i < nIchor; i++){
      const ang = Math.random() * Math.PI * 2;
      const rx = Math.cos(ang), rz = Math.sin(ang);
      const mx = dx * (cone * 0.85) + rx * (1 - cone * 0.85);
      const mz = dz * (cone * 0.85) + rz * (1 - cone * 0.85);
      const ml = Math.hypot(mx, mz) || 1;
      this._spawn('ichor', x, y + 0.1, z, T.ichorLife || 0.42, {
        role: 'ichor',
        vx: mx / ml * (force * (0.9 + Math.random())),
        vy: lift * (0.7 + Math.random() * 0.9),
        vz: mz / ml * (force * (0.9 + Math.random())),
        color: ichorTint[i % ichorTint.length]
      });
    }
    for(let i = 0; i < nDust; i++){
      const ang = Math.random() * Math.PI * 2;
      this._spawn('dust', x, 0.08, z, 0.5, {
        role: 'dust',
        vx: Math.cos(ang) * (3 + force * 0.18) + dx * 2,
        vy: 1.1 + Math.random() * 2.2,
        vz: Math.sin(ang) * (3 + force * 0.18) + dz * 2,
        color: 0x4a3a32
      });
    }
  };

  ImpactFXManager.prototype.arenaFire = function(x, y, z, opts){
    if(!this.group) return;
    const r = (opts && opts.r) != null ? opts.r : 3.4;
    this._spawn('flash', x, y + 0.42, z, 0.16, {role: 'flash', sx: 3.1, color: 0xfff4d2, opacity: 0.95, add: true});
    this._spawn('flash', x, y + 0.22, z, 0.28, {role: 'flash', sx: 1.7, color: 0xff7a28, opacity: 0.82, add: true});
    this._spawn('ring', x, y + 0.05, z, 0.48, {role: 'ring', rotX: -Math.PI / 2, grow: r * 0.52, color: 0xffb365, opacity: 0.9, add: true});
    this._spawn('ring', x, y + 0.08, z, 0.26, {role: 'ring', rotX: -Math.PI / 2, grow: r * 0.34, color: 0xffebbd, opacity: 0.72, add: true});
    this._spawn('ring', x, y + 0.04, z, 0.62, {role: 'distort', rotX: -Math.PI / 2, grow: r * 0.7, color: 0xff812e, opacity: 0.45, add: true});
    const nFlame = 6;
    for(let i = 0; i < nFlame; i++){
      const a = i * 2.399 + 0.3;
      const spread = r * Math.sqrt((i + 0.4) / nFlame) * 0.28;
      this._spawn('plume', x + Math.cos(a) * spread, y + 0.12, z + Math.sin(a) * spread, 0.72, {
        role: 'plume', grow: 1.8 + (i % 3) * 0.35, opacity: 0.7, color: i % 2 ? 0xffad45 : 0xff6a22,
        vx: Math.cos(a) * 0.4, vy: 1.8 + (i % 3) * 0.5, vz: Math.sin(a) * 0.4, add: true
      });
    }
    for(let i = 0; i < 4; i++){
      this._spawn('plume', x + VF.rand(-0.3, 0.3), y + 0.35 + i * 0.08, z + VF.rand(-0.3, 0.3), 0.85, {
        role: 'plume', grow: 1.3 + i * 0.2, opacity: 0.35, color: 0x392a24,
        vx: VF.rand(-0.4, 0.4), vy: 0.9 + i * 0.25, vz: VF.rand(-0.6, -0.1)
      });
    }
    for(let i = 0; i < 12; i++){
      const a = Math.random() * Math.PI * 2;
      this._spawn('spark', x, y + 0.18, z, 0.55, {
        role: 'spark', color: i % 3 ? 0xffbb69 : 0xff812e, add: true,
        vx: Math.cos(a) * (2.4 + Math.random() * 4.2),
        vy: 2.2 + Math.random() * 5.5,
        vz: Math.sin(a) * (2.4 + Math.random() * 4.2)
      });
    }
  };

  ImpactFXManager.prototype.celebrate = function(x, y, z){
    for(let i = 0; i < 3; i++) this.impact(x + VF.rand(-0.4, 0.4), y + 0.4 * i, z + VF.rand(-0.4, 0.4), {kind: 'kick', force: 36});
  };

  ImpactFXManager.prototype.tick = function(dt){
    for(let i = this.live.length - 1; i >= 0; i--){
      const m = this.live[i];
      m.userData.life -= dt;
      if(m.userData.life <= 0){
        m.visible = false;
        this.live.splice(i, 1);
        continue;
      }
      const t = 1 - m.userData.life / m.userData.max;
      const kind = m.userData.kind;
      if(kind === 'ring' || kind === 'distort'){
        const s = 1 + t * 3.4 * (m.userData.grow || 1);
        m.scale.set(s, s, s);
      }else if(kind === 'shock'){
        const u = 1 - (1 - t) * (1 - t);
        const r0 = m.userData.startR || 0.5;
        const r1 = m.userData.endR || 7;
        const s = (r0 + (r1 - r0) * u) / 0.3;
        m.scale.set(s, s, s);
      }else if(kind === 'flash'){
        const s = 1 + t * 2.8;
        m.scale.set(s, s, s);
      }else if(kind === 'ghost'){
        m.scale.y = 1 - t * 0.25;
      }else if(kind === 'plume'){
        const s = 1 + t * 2.2 * (m.userData.grow || 1);
        m.scale.set(s, s * 1.45, s);
        m.position.x += m.userData.vx * dt;
        m.position.y += m.userData.vy * dt;
        m.position.z += m.userData.vz * dt;
      }else if(kind === 'decal' || kind === 'crack'){
        m.scale.x = 1 + t * 0.08;
        m.scale.y = 1 + t * 0.08;
      }else if(kind === 'streak' || kind === 'line'){
        m.scale.z = 1 + t * 1.8;
        m.position.x += m.userData.vx * dt;
        m.position.z += m.userData.vz * dt;
      }else{
        m.position.x += m.userData.vx * dt;
        m.position.y += m.userData.vy * dt;
        m.position.z += m.userData.vz * dt;
        m.userData.vy -= (kind === 'rock' || kind === 'chunk' || kind === 'shard' ? 18 : (kind === 'ichor' ? 11 : 14)) * dt;
        if((kind === 'rock' || kind === 'chunk' || kind === 'shard') && m.userData.spin){
          m.rotation.x += m.userData.spin * dt;
          m.rotation.z += m.userData.spin * 0.6 * dt;
        }
      }
      if(m.material){
        let fade = kind === 'ghost' ? 0.32 * (1 - t) : (kind === 'flash' ? 1 - t * t : 1 - t);
        if(kind === 'distort') fade *= 0.45;
        if(kind === 'plume') fade *= 0.42;
        if(kind === 'ichor') fade = 0.92 * (1 - t * t);
        if(kind === 'chunk' || kind === 'shard') fade = 0.95 * (1 - t);
        if(kind === 'decal') fade = 0.5 * (1 - t * t);
        if(kind === 'shock') fade = (1 - t) * 0.82;
        if(kind === 'crack') fade = 0.62 * (t < 0.7 ? 1 : 1 - (t - 0.7) / 0.3);
        m.material.opacity = Math.max(0, fade);
      }
    }
  };

  ImpactFXManager.prototype.dispose = function(){
    this.live.forEach(function(m){ m.visible = false; m.userData.life = 0; });
    this.live = [];
    this._decalQ = [];
    const geos = [this.ringGeo, this.sparkGeo, this.flashGeo, this.streakGeo, this.lineGeo, this.ghostGeo, this.rockGeo, this.plumeGeo, this.decalGeo, this.ichorGeo, this.chunkGeo, this.shardGeo];
    geos.forEach(function(g){ if(g && g.dispose) g.dispose(); });
  };

  VF.ImpactFXManager = ImpactFXManager;
})(typeof window !== 'undefined' ? window : globalThis);
