"use strict";
/* Pooled Overdrive ground fire. Arena วงเพลิง look: shader tongues + ember rings. */
(function(root){
  const VF = root.VocabForce = root.VocabForce || {};

  function fireMaterial(THREE){
    return new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, side: THREE.DoubleSide, fog: false, toneMapped: false,
      uniforms: {time: {value: 0}, seed: {value: 0}, fade: {value: 1}, mode: {value: 0}},
      vertexShader: 'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
      fragmentShader: [
        'precision highp float;',
        'varying vec2 vUv;uniform float time,seed,fade,mode;',
        'float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}',
        'float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}',
        'float fbm(vec2 p){float v=.57*noise(p);p=mat2(1.6,-1.2,1.2,1.6)*p;v+=.28*noise(p);p=mat2(1.6,-1.2,1.2,1.6)*p;return v+.11*noise(p);}',
        'void main(){',
        'vec2 p=vec2(vUv.x*2.0-1.0,vUv.y);float t=time+seed*5.37;vec3 col;float alpha;',
        'if(mode>1.5){',
        'vec2 q=(vUv-.5)*2.0;float r=length(q),a=atan(q.y,q.x);',
        'float churn=fbm(q*4.0+vec2(t*.35,-t*.45));',
        'float wave=abs(r-(.72+.09*sin(a*5.0+t*2.0)+.13*(churn-.5)));',
        'float hot=exp(-wave*25.0)*(.4+.6*churn);',
        'float cracks=pow(max(0.0,1.0-abs(churn-.5)*11.0),5.0)*(1.0-smoothstep(.15,.85,r));',
        'col=mix(vec3(.12,.038,.018),vec3(1.0,.30,.022),hot);',
        'col=mix(col,vec3(1.0,.82,.33),clamp(cracks*.7+hot*hot*.6,0.0,1.0));',
        'alpha=(1.0-smoothstep(.77,1.0,r))*(.36+hot*.57)*fade;',
        '}else if(mode>.5){',
        'float n=fbm(vec2(p.x*3.2+seed,p.y*4.1-t*.8));',
        'float density=1.0-length(vec2(p.x,(p.y-.48)*1.8))+.65*(n-.5);',
        'alpha=smoothstep(.03,.5,density)*(.18+.22*n)*fade;',
        'col=mix(vec3(.10,.075,.067),vec3(.29,.22,.18),n);',
        '}else{',
        'vec2 flow=vec2(p.x*3.8+seed,p.y*6.3-t*2.5);float n=fbm(flow);',
        'float curl=sin(p.y*5.0-t*1.5+seed)*.13*p.y;',
        'float envelope=1.0-length(vec2((p.x+curl)*(1.0+p.y*.65),(p.y-.23)*1.38));',
        'float density=envelope+(n-.5)*1.05-p.y*.12;',
        'alpha=smoothstep(.11,.29,density)*smoothstep(.2,.47,n+envelope*.32-p.y*.16)*smoothstep(0.0,.08,p.y)*(1.0-smoothstep(.76,1.0,p.y))*fade;',
        'float heat=clamp(density*.83+n*.38-p.y*.22,0.0,1.0);',
        'col=mix(vec3(.38,.065,.012),vec3(1.0,.34,.028),smoothstep(.15,.5,heat));',
        'col=mix(col,vec3(1.0,.73,.19),smoothstep(.48,.74,heat));',
        'col=mix(col,vec3(1.0,.98,.84),smoothstep(.72,.96,heat));',
        '}',
        'if(mode<1.5)alpha*=smoothstep(0.0,.17,vUv.x)*smoothstep(0.0,.17,1.0-vUv.x)*smoothstep(0.0,.15,vUv.y)*smoothstep(0.0,.18,1.0-vUv.y);',
        'if(alpha<.008)discard;gl_FragColor=vec4(col,alpha);',
        '}'
      ].join('\n')
    });
  }

  function OverdriveFireTrail(){
    this.group = null;
    this.flames = [];
    this.embers = [];
    this.smoke = [];
    this.sparks = [];
    this.live = [];
    this.segs = [];
    this._last = null;
    this._accum = 0;
    this._pathLen = 0;
    this._active = false;
    this._loopT = 0;
    this._fxT = 0;
    this.player = null;
  }

  OverdriveFireTrail.prototype.attach = function(scene){
    const THREE = root.THREE;
    const T = VF.OverdriveDashTune || {};
    const n = T.FIRE_TRAIL_MAX_SEGMENTS || 56;
    this.group = new THREE.Group();
    this.group.name = 'VFOverdriveFire';
    scene.add(this.group);
    this.flameGeo = new THREE.PlaneGeometry(1.55, 2.35);
    this.flameGeo.translate(0, 1.05, 0);
    this.emberGeo = new THREE.PlaneGeometry(2.15, 2.15);
    this.smokeGeo = new THREE.PlaneGeometry(1.8, 1.8);
    this.sparkGeo = new THREE.SphereGeometry(0.055, 5, 4);
    this.fireMat = fireMaterial(THREE);
    this.sparkMat = new THREE.MeshBasicMaterial({color: 0xffc174, transparent: true, opacity: 0.9, depthWrite: false, fog: false});
    const bindFire = function(mesh){
      mesh.onBeforeRender = function(){
        const u = mesh.userData.mat && mesh.userData.mat.uniforms;
        if(!u) return;
        u.seed.value = mesh.userData.phase || 0;
        u.fade.value = mesh.userData.fade != null ? mesh.userData.fade : 1;
        const kind = mesh.userData.kind;
        u.mode.value = kind === 'embers' ? 2 : kind === 'smoke' ? 1 : 0;
      };
    };
    for(let i = 0; i < n; i++){
      const flame = new THREE.Mesh(this.flameGeo, this.fireMat);
      const ember = new THREE.Mesh(this.emberGeo, this.fireMat);
      flame.visible = false; ember.visible = false;
      flame.userData.life = 0; ember.userData.life = 0;
      flame.userData.mat = this.fireMat; ember.userData.mat = this.fireMat;
      bindFire(flame); bindFire(ember);
      this.group.add(flame, ember);
      this.flames.push(flame);
      this.embers.push(ember);
    }
    for(let i = 0; i < Math.max(8, Math.floor(n / 4)); i++){
      const sm = new THREE.Mesh(this.smokeGeo, this.fireMat);
      sm.visible = false;
      sm.userData.life = 0;
      sm.userData.mat = this.fireMat;
      bindFire(sm);
      this.group.add(sm);
      this.smoke.push(sm);
    }
    for(let i = 0; i < 16; i++){
      const sp = new THREE.Mesh(this.sparkGeo, this.sparkMat.clone());
      sp.visible = false;
      sp.userData.life = 0;
      this.group.add(sp);
      this.sparks.push(sp);
    }
    return this;
  };

  OverdriveFireTrail.prototype.bind = function(player){
    this.player = player;
    if(player) player.overdriveTrail = this;
    return this;
  };

  OverdriveFireTrail.prototype.pathLength = function(){ return this._pathLen || 0; };
  OverdriveFireTrail.prototype.isActive = function(){ return !!this._active; };
  OverdriveFireTrail.prototype.liveCount = function(){ return this.segs.length; };

  OverdriveFireTrail.prototype.start = function(x, y, z){
    this._active = true;
    this._last = {x: x, y: y, z: z};
    this._accum = 0;
    this._pathLen = 0;
    this._loopT = 0;
    this._drop(x, y, z, 0, 1, true);
    this._burst(x, y, z, 2);
    if(VF.audio && VF.audio.fireTrailBurn) VF.audio.fireTrailBurn();
  };

  OverdriveFireTrail.prototype.sample = function(x, y, z){
    if(!this._active || !this._last) return;
    const T = VF.OverdriveDashTune || {};
    const spacing = T.FIRE_TRAIL_SEGMENT_SPACING || 0.42;
    const dx = x - this._last.x, dy = (y || 0) - (this._last.y || 0), dz = z - this._last.z;
    const d = Math.hypot(dx, dz);
    if(d < 1e-4) return;
    this._pathLen += d;
    const dirX = dx / d, dirZ = dz / d;
    let moved = 0;
    while(this._accum + (d - moved) >= spacing - 1e-6){
      const need = spacing - this._accum;
      moved += need;
      const t = moved / d;
      this._drop(this._last.x + dx * t, this._last.y + dy * t, this._last.z + dz * t, dirX, dirZ, false);
      this._accum = 0;
    }
    this._accum += (d - moved);
    this._last = {x: x, y: y, z: z};
  };

  OverdriveFireTrail.prototype.end = function(x, y, z){
    const leftover = this._accum;
    if(this._active) this.sample(x, y, z);
    if(this._active && leftover > 0.08) this._drop(x, y, z, 0, 1, false);
    this._burst(x, y, z, 2);
    this._active = false;
    this._accum = 0;
    this._last = {x: x, y: y, z: z};
  };

  OverdriveFireTrail.prototype.paintLine = function(ax, ay, az, bx, by, bz){
    const T = VF.OverdriveDashTune || {};
    const spacing = T.FIRE_TRAIL_SEGMENT_SPACING || 0.42;
    const dist = Math.hypot(bx - ax, bz - az);
    if(dist < 0.05){
      this._drop(bx, by, bz, 0, 1, true);
      return;
    }
    const dirX = (bx - ax) / dist, dirZ = (bz - az) / dist;
    const n = Math.max(1, Math.round(dist / spacing));
    for(let i = 0; i <= n; i++){
      const t = i / n;
      this._drop(ax + (bx - ax) * t, ay + (by - ay) * t, az + (bz - az) * t, dirX, dirZ, i === 0 || i === n);
    }
  };

  OverdriveFireTrail.prototype.markPeer = function(uid, x, y, z){
    this._peer = this._peer || {};
    this._peer[uid] = {x: x, y: y, z: z};
  };

  OverdriveFireTrail.prototype.endPeer = function(uid, x, y, z){
    this._peer = this._peer || {};
    const a = this._peer[uid];
    delete this._peer[uid];
    if(a) this.paintLine(a.x, a.y, a.z, x, y, z);
    else this._drop(x, y, z, 0, 1, true);
  };

  OverdriveFireTrail.prototype._take = function(arr){
    if(!arr || !arr.length) return null;
    let best = arr[0];
    for(let i = 0; i < arr.length; i++){
      if(arr[i].userData.life <= 0){ best = arr[i]; break; }
      if(arr[i].userData.life < best.userData.life) best = arr[i];
    }
    return best;
  };

  OverdriveFireTrail.prototype._place = function(mesh, x, y, z, kind, life, extras){
    if(!mesh) return;
    extras = extras || {};
    mesh.visible = true;
    mesh.position.set(x, y, z);
    mesh.rotation.set(extras.rx || 0, extras.ry || 0, extras.rz || 0);
    const sx = extras.sx || 1, sy = extras.sy || 1, sz = extras.sz || 1;
    mesh.scale.set(sx, sy, sz);
    mesh.userData.life = life;
    mesh.userData.max = life;
    mesh.userData.kind = kind;
    mesh.userData.baseY = y;
    mesh.userData.baseSx = sx;
    mesh.userData.baseSy = sy;
    mesh.userData.flicker = 7 + Math.random() * 11;
    mesh.userData.phase = Math.random() * 6.28;
    mesh.userData.vx = extras.vx || 0;
    mesh.userData.vy = extras.vy || 0;
    mesh.userData.vz = extras.vz || 0;
    mesh.userData.fade = extras.op != null ? extras.op : 1;
    if(mesh.material && mesh.material.opacity != null && !mesh.userData.mat) mesh.material.opacity = mesh.userData.fade;
    if(this.live.indexOf(mesh) < 0) this.live.push(mesh);
  };

  OverdriveFireTrail.prototype._drop = function(x, y, z, dirX, dirZ, burst){
    const T = VF.OverdriveDashTune || {};
    const life = T.FIRE_TRAIL_LIFETIME || 2.2;
    const cap = T.FIRE_TRAIL_MAX_SEGMENTS || 56;
    if(this.segs.length >= cap) this.segs.shift();
    this.segs.push({x: x, y: y || 0, z: z, until: life, max: life});
    const gy = y || 0;
    const jx = (Math.random() - 0.5) * 0.16;
    const jz = (Math.random() - 0.5) * 0.16;
    const yaw = Math.atan2(dirX || 0, dirZ || 1);
    const emberS = (burst ? 1.05 : 0.82) + Math.random() * 0.18;
    this._place(this._take(this.embers), x, gy + 0.05, z, 'embers', life, {
      rx: -Math.PI / 2, sx: emberS, sy: emberS, op: 1
    });
    const h = (burst ? 0.92 : 0.68) + Math.random() * 0.18;
    const w = 0.58 + Math.random() * 0.16;
    this._place(this._take(this.flames), x + jx, gy, z + jz, 'flame', life, {
      rx: -0.42, ry: yaw + (Math.random() - 0.5) * 0.5, sx: w, sy: h, op: 1
    });
    if(burst || Math.random() < 0.28){
      this._place(this._take(this.smoke), x - jx * 0.4, gy + 0.35, z - jz * 0.4, 'smoke', life * 0.7, {
        rx: -0.2, sx: 0.7, sy: 0.7, op: 0.85
      });
    }
    if(burst || Math.random() < 0.4) this._spark(x, gy + 0.22, z, dirX, dirZ);
  };

  OverdriveFireTrail.prototype._burst = function(x, y, z, n){
    for(let i = 0; i < n; i++){
      const a = i * 2.4 + Math.random();
      const r = 0.18 + Math.random() * 0.22;
      this._drop(x + Math.cos(a) * r, y, z + Math.sin(a) * r, Math.cos(a), Math.sin(a), i === 0);
    }
  };

  OverdriveFireTrail.prototype._spark = function(x, y, z, dirX, dirZ){
    const sp = this._take(this.sparks);
    if(!sp) return;
    this._place(sp, x, y, z, 'spark', 0.45 + Math.random() * 0.28, {
      vx: (dirX || 0) * -0.5 + (Math.random() - 0.5) * 1.4,
      vy: 2.2 + Math.random() * 2.6,
      vz: (dirZ || 0) * -0.5 + (Math.random() - 0.5) * 1.4,
      sx: 1, sy: 1, op: 0.9
    });
  };

  OverdriveFireTrail.prototype.tick = function(dt, enemies, player){
    const T = VF.OverdriveDashTune || {};
    const strong = T.FIRE_TRAIL_STRONG || 1.15;
    this._fxT = (this._fxT || 0) + dt;
    if(this.fireMat && this.fireMat.uniforms && this.fireMat.uniforms.time) this.fireMat.uniforms.time.value = this._fxT;
    for(let i = this.segs.length - 1; i >= 0; i--){
      this.segs[i].until -= dt;
      if(this.segs[i].until <= 0) this.segs.splice(i, 1);
    }
    for(let i = this.live.length - 1; i >= 0; i--){
      const m = this.live[i];
      m.userData.life -= dt;
      if(m.userData.life <= 0){
        m.visible = false;
        this.live.splice(i, 1);
        continue;
      }
      const age = (m.userData.max || 1) - m.userData.life;
      const kind = m.userData.kind;
      const flick = 0.9 + 0.1 * Math.sin(this._fxT * (m.userData.flicker || 9) + (m.userData.phase || 0));
      if(kind === 'spark'){
        m.position.x += (m.userData.vx || 0) * dt;
        m.position.y += (m.userData.vy || 0) * dt;
        m.position.z += (m.userData.vz || 0) * dt;
        m.userData.vy = (m.userData.vy || 0) - 5.5 * dt;
      }else if(kind === 'flame'){
        m.scale.x = (m.userData.baseSx || 1) * (0.92 + 0.08 * flick);
        m.scale.y = (m.userData.baseSy || 1) * (1.05 + 0.08 * Math.sin(age * 2.7 + (m.userData.phase || 0)));
      }else if(kind === 'embers'){
        const s = (m.userData.baseSx || 1) * (0.78 + 0.22 * Math.min(1, age * 4));
        m.scale.set(s, s, 1);
      }else if(kind === 'smoke'){
        const swell = 1 + age * 0.22;
        m.scale.set((m.userData.baseSx || 1) * swell, (m.userData.baseSy || 1) * swell, 1);
        m.position.y = (m.userData.baseY || 0) + age * 0.9;
      }
      let fade = 1;
      if(age > strong) fade = VF.clamp(1 - (age - strong) / Math.max(0.05, (m.userData.max || 2.2) - strong), 0, 1);
      if(kind === 'smoke') fade *= 0.7;
      m.userData.fade = fade;
      if(m.material && m.material.opacity != null && !m.userData.mat) m.material.opacity = 0.88 * fade;
    }
    if(this._active){
      this._loopT += dt;
      if(this._loopT >= 0.12){
        this._loopT = 0;
        if(VF.audio && VF.audio.overdriveLoop) VF.audio.overdriveLoop();
        if(player) this._spark(player.x, (player.y || 0) + 0.18, player.z, 0, 0);
      }
    }
    this._burn(dt, enemies, player);
  };


  OverdriveFireTrail.prototype._burn = function(dt, enemies, player){
    const T = VF.OverdriveDashTune || {};
    if(!T.OVERDRIVE_FIRE_DAMAGE_ENABLED) return;
    const list = enemies && enemies.list ? enemies.list : (enemies || []);
    if(!list.length || !this.segs.length) return;
    const R = T.FIRE_TRAIL_HIT_RADIUS || 0.85;
    const gap = T.FIRE_DAMAGE_INTERVAL || 0.35;
    const now = VF.now ? VF.now() : Date.now();
    for(let i = 0; i < list.length; i++){
      const en = list[i];
      if(!en || en.alive === false) continue;
      if(player && en === player) continue;
      if(en.local === true) continue;
      if((en.invuln || 0) > 0) continue;
      if((en._odFireAt || 0) + gap * 1000 > now) continue;
      let hit = false;
      for(let s = 0; s < this.segs.length; s++){
        if(Math.hypot((en.x || 0) - this.segs[s].x, (en.z || 0) - this.segs[s].z) <= R){ hit = true; break; }
      }
      if(!hit) continue;
      en._odFireAt = now;
      if(typeof en.applyHit === 'function'){
        en.applyHit({
          kind: 'punch',
          damage: T.FIRE_DAMAGE || 1,
          force: T.FIRE_KNOCKBACK || 8,
          lift: T.FIRE_LIFT || 1.2,
          origin: {x: en.x, z: en.z},
          reaction: 'front',
          level: 'LIGHT'
        });
      }
    }
  };

  OverdriveFireTrail.prototype.clear = function(){
    this.live.forEach(function(m){ m.visible = false; m.userData.life = 0; });
    this.live = [];
    this.segs = [];
    this._active = false;
    this._peer = {};
    this._last = null;
    this._accum = 0;
  };

  OverdriveFireTrail.prototype.dispose = function(){
    this.clear();
    [this.flameGeo, this.emberGeo, this.smokeGeo, this.sparkGeo].forEach(function(g){ if(g && g.dispose) g.dispose(); }); if(this.fireMat && this.fireMat.dispose) this.fireMat.dispose();
  };

  VF.OverdriveFireTrail = OverdriveFireTrail;
})(typeof window !== 'undefined' ? window : globalThis);
