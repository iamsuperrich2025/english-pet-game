"use strict";
/* รอบ 1589: Ground Slam — เส้นเปลวเพลิงสีฟ้าบนพื้น (shader โทนน้ำเงิน/ฟ้าอ่อน)
   โครง pooled mesh ยืมแบบ OverdriveFireTrail แต่พาเลต์สีฟ้า + เก็บ castId ต่อเซกเมนต์
   เพื่อให้ combat ตรวจ "ใครโดนแนวเส้นครั้งไหน" ได้ (ผู้เล่นลบ 300 HP ต่อครั้งที่โดน) */
(function(root){
  const VF = root.VocabForce = root.VocabForce || {};

  function blueFireMaterial(THREE){
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
        'col=mix(vec3(.012,.05,.30),vec3(.16,.52,1.0),hot);',
        'col=mix(col,vec3(.75,.92,1.0),clamp(cracks*.7+hot*hot*.6,0.0,1.0));',
        'alpha=(1.0-smoothstep(.77,1.0,r))*(.36+hot*.57)*fade;',
        '}else{',
        'vec2 flow=vec2(p.x*3.8+seed,p.y*6.3-t*2.8);float n=fbm(flow);',
        'float curl=sin(p.y*5.0-t*1.7+seed)*.13*p.y;',
        'float envelope=1.0-length(vec2((p.x+curl)*(1.0+p.y*.65),(p.y-.23)*1.38));',
        'float density=envelope+(n-.5)*1.05-p.y*.12;',
        'alpha=smoothstep(.11,.29,density)*smoothstep(.2,.47,n+envelope*.32-p.y*.16)*smoothstep(0.0,.08,p.y)*(1.0-smoothstep(.76,1.0,p.y))*fade;',
        'float heat=clamp(density*.83+n*.38-p.y*.22,0.0,1.0);',
        'col=mix(vec3(.02,.09,.42),vec3(.18,.55,1.0),smoothstep(.15,.5,heat));',
        'col=mix(col,vec3(.62,.88,1.0),smoothstep(.48,.74,heat));',
        'col=mix(col,vec3(.95,.99,1.0),smoothstep(.72,.96,heat));',
        '}',
        'if(mode<1.5)alpha*=smoothstep(0.0,.17,vUv.x)*smoothstep(0.0,.17,1.0-vUv.x)*smoothstep(0.0,.15,vUv.y)*smoothstep(0.0,.18,1.0-vUv.y);',
        'if(alpha<.008)discard;gl_FragColor=vec4(col,alpha);',
        '}'
      ].join('\n')
    });
  }

  function GroundSlamFX(){
    this.group = null;
    this.flames = [];
    this.embers = [];
    this.sparks = [];
    this.live = [];
    this.segs = [];
    this._fxT = 0;
    this._castSeq = 0;
  }

  GroundSlamFX.prototype.attach = function(scene){
    const THREE = root.THREE;
    const T = VF.GroundSlamTune || {};
    const n = T.MAX_SEGMENTS || 64;
    this.group = new THREE.Group();
    this.group.name = 'VFGroundSlamFire';
    scene.add(this.group);
    this.flameGeo = new THREE.PlaneGeometry(1.7, 2.5);
    this.flameGeo.translate(0, 1.1, 0);
    this.emberGeo = new THREE.PlaneGeometry(2.3, 2.3);
    this.sparkGeo = new THREE.SphereGeometry(0.06, 5, 4);
    this.fireMat = blueFireMaterial(THREE);
    this.sparkMat = new THREE.MeshBasicMaterial({color: 0x9fd8ff, transparent: true, opacity: 0.9, depthWrite: false, fog: false});
    const bindFire = function(mesh){
      mesh.onBeforeRender = function(){
        const u = mesh.userData.mat && mesh.userData.mat.uniforms;
        if(!u) return;
        u.seed.value = mesh.userData.phase || 0;
        u.fade.value = mesh.userData.fade != null ? mesh.userData.fade : 1;
        u.mode.value = mesh.userData.kind === 'embers' ? 2 : 0;
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
    for(let i = 0; i < 16; i++){
      const sp = new THREE.Mesh(this.sparkGeo, this.sparkMat.clone());
      sp.visible = false;
      sp.userData.life = 0;
      this.group.add(sp);
      this.sparks.push(sp);
    }
    return this;
  };

  /* เพนท์เส้นไฟจาก (ax,az) ไป (bx,bz) · castId ผูกกับเซกเมนต์เพื่อนับดาเมจรายครั้ง (สร้างเองถ้าไม่ส่งมา) */
  GroundSlamFX.prototype.castLine = function(ax, az, bx, bz, castId){
    const T = VF.GroundSlamTune || {};
    const spacing = T.SEGMENT_SPACING || 0.6;
    const life = T.LINE_LIFE || 2.6;
    const id = castId != null ? castId : (++this._castSeq);
    const dist = Math.hypot(bx - ax, bz - az);
    if(dist < 0.05){
      this._drop(ax, az, 0, 1, life, id, true);
      return id;
    }
    const dirX = (bx - ax) / dist, dirZ = (bz - az) / dist;
    const n = Math.max(1, Math.round(dist / spacing));
    for(let i = 0; i <= n; i++){
      const t = i / n;
      this._drop(ax + (bx - ax) * t, az + (bz - az) * t, dirX, dirZ, life, id, i === 0 || i === n);
    }
    return id;
  };

  /* เพื่อนออนไลน์ใช้ — ไม่ผูก castId การดาเมจ (ผู้ถูกกระทำจัดการเองจาก strike ของเจ้าของ) */
  GroundSlamFX.prototype.paintLine = function(ax, az, bx, bz){
    return this.castLine(ax, az, bx, bz, null);
  };

  GroundSlamFX.prototype._take = function(arr){
    if(!arr || !arr.length) return null;
    let best = arr[0];
    for(let i = 0; i < arr.length; i++){
      if(arr[i].userData.life <= 0){ best = arr[i]; break; }
      if(arr[i].userData.life < best.userData.life) best = arr[i];
    }
    return best;
  };

  GroundSlamFX.prototype._place = function(mesh, x, y, z, kind, life, extras){
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
    if(this.live.indexOf(mesh) < 0) this.live.push(mesh);
  };

  GroundSlamFX.prototype._drop = function(x, z, dirX, dirZ, life, castId, burst){
    const T = VF.GroundSlamTune || {};
    const cap = T.MAX_SEGMENTS || 64;
    if(this.segs.length >= cap) this.segs.shift();
    this.segs.push({x: x, z: z, until: life, cast: castId});
    const jx = (Math.random() - 0.5) * 0.16;
    const jz = (Math.random() - 0.5) * 0.16;
    const yaw = Math.atan2(dirX || 0, dirZ || 1);
    const emberS = (burst ? 1.15 : 0.9) + Math.random() * 0.2;
    this._place(this._take(this.embers), x, 0.05, z, 'embers', life, {
      rx: -Math.PI / 2, sx: emberS, sy: emberS, op: 1
    });
    const h = (burst ? 1.0 : 0.74) + Math.random() * 0.2;
    const w = 0.62 + Math.random() * 0.18;
    this._place(this._take(this.flames), x + jx, 0, z + jz, 'flame', life, {
      rx: -0.42, ry: yaw + (Math.random() - 0.5) * 0.5, sx: w, sy: h, op: 1
    });
    if(burst || Math.random() < 0.45) this._spark(x, 0.22, z, dirX, dirZ);
  };

  GroundSlamFX.prototype._spark = function(x, y, z, dirX, dirZ){
    const sp = this._take(this.sparks);
    if(!sp) return;
    this._place(sp, x, y, z, 'spark', 0.45 + Math.random() * 0.28, {
      vx: (dirX || 0) * -0.5 + (Math.random() - 0.5) * 1.4,
      vy: 2.2 + Math.random() * 2.6,
      vz: (dirZ || 0) * -0.5 + (Math.random() - 0.5) * 1.4,
      sx: 1, sy: 1, op: 0.9
    });
  };

  /* มีเซกเมนต์ของแนวเส้นอยู่ในรัศมี r จาก (x,z) ไหม (ใช้ตรวจดาเมจ) */
  GroundSlamFX.prototype.hit = function(x, z, r){
    const list = this.segs;
    for(let i = 0; i < list.length; i++){
      const dx = (x || 0) - list[i].x, dz = (z || 0) - list[i].z;
      if(dx * dx + dz * dz <= r * r) return list[i];
    }
    return null;
  };

  GroundSlamFX.prototype.tick = function(dt){
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
      }
      let fade = 1;
      const strong = 1.15;
      if(age > strong) fade = VF.clamp(1 - (age - strong) / Math.max(0.05, (m.userData.max || 2.6) - strong), 0, 1);
      m.userData.fade = fade;
      if(m.material && m.material.opacity != null && !m.userData.mat) m.material.opacity = 0.88 * fade;
    }
  };

  GroundSlamFX.prototype.clear = function(){
    this.live.forEach(function(m){ m.visible = false; m.userData.life = 0; });
    this.live = [];
    this.segs = [];
  };

  GroundSlamFX.prototype.dispose = function(){
    this.clear();
    [this.flameGeo, this.emberGeo, this.sparkGeo].forEach(function(g){ if(g && g.dispose) g.dispose(); });
    if(this.fireMat && this.fireMat.dispose) this.fireMat.dispose();
  };

  VF.GroundSlamFX = GroundSlamFX;
})(typeof window !== 'undefined' ? window : globalThis);
