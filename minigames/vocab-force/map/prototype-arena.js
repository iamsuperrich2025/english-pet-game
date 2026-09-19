"use strict";
/* Night industrial lot: JPEG sky cylinder + wet ground. Collision still uses the plaza boxes. */
(function(root){
  const VF = root.VocabForce = root.VocabForce || {};

  function PrototypeArena(){
    this.scale = VF.MAP_SCALE || 10;
    this.half = 28 * this.scale;
    this.boxes = [];
    this.ramps = [];
    this.loose = [];
    this.group = null;
    this.spawnPoints = [];
  }

  PrototypeArena.prototype._prepTex = function(tex, sx, sy){
    const THREE = root.THREE;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    if(sx) tex.repeat.set(sx, sy || sx);
    if(tex.encoding != null && THREE.sRGBEncoding != null) tex.encoding = THREE.sRGBEncoding;
    tex.needsUpdate = true;
    return tex;
  };

  PrototypeArena.prototype._placeSky = function(group, tex){
    const THREE = root.THREE;
    const img = tex.image || {};
    const band = VF._t.skyBand(VF.SKY_RADIUS || 420, img.width || 1280, img.height || 446, 3);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.repeat.set(band.wraps, band.crop);
    tex.offset.set(0, 0);
    if(tex.encoding != null && THREE.sRGBEncoding != null) tex.encoding = THREE.sRGBEncoding;
    tex.anisotropy = Math.max(tex.anisotropy || 1, 8);
    tex.needsUpdate = true;
    const dome = new THREE.Mesh(
      new THREE.SphereGeometry((VF.SKY_RADIUS || 420) * 1.55, 24, 16),
      new THREE.MeshBasicMaterial({color: 0x0b122c, side: THREE.BackSide, fog: false, depthWrite: false})
    );
    dome.name = 'VFSkyDome';
    dome.renderOrder = -3;
    group.add(dome);
    const cyl = new THREE.Mesh(
      new THREE.CylinderGeometry(band.radius, band.radius, band.height, 48, 1, true),
      new THREE.MeshBasicMaterial({map: tex, side: THREE.BackSide, fog: false, depthWrite: false})
    );
    cyl.name = 'VFSky';
    cyl.position.y = band.y;
    cyl.renderOrder = -2;
    group.add(cyl);
    const moon = new THREE.Mesh(
      new THREE.CircleGeometry(5.2, 28),
      new THREE.MeshBasicMaterial({color: 0xe8f0ff, fog: false, depthWrite: false})
    );
    moon.name = 'VFMoon';
    moon.position.set(-32 * (this.scale || 10) * 0.4, band.y + band.height * 0.28, -64 * (this.scale || 10) * 0.4);
    moon.lookAt(0, 8, 0);
    moon.renderOrder = -1;
    group.add(moon);
    return band;
  };

  PrototypeArena.prototype.build = function(scene){
    const THREE = root.THREE;
    const S = this.scale || 10;
    const self = this;
    const g = new THREE.Group();
    g.name = 'VFArena';
    const groundMat = new THREE.MeshPhongMaterial({color: 0x2a3344, shininess: 42, specular: 0x3a6a88});
    const crateMat = new THREE.MeshLambertMaterial({color: 0x3d6d68});
    const rustMat = new THREE.MeshLambertMaterial({color: 0x8a4a32});
    const wallMat = new THREE.MeshLambertMaterial({color: 0x2a2438});
    const breakMat = new THREE.MeshLambertMaterial({color: 0x8a5a3a});
    const barrierMat = new THREE.MeshLambertMaterial({color: 0xc4b08a});
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(this.half * 2.2, this.half * 2.2), groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.name = 'VFGround';
    g.add(ground);
    scene.background = new THREE.Color(0x0a1228);

    function box(mat, w, h, d, x, y, z, flags){
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      m.position.set(x, y, z);
      m.userData.breakable = !!(flags && flags.breakable);
      g.add(m);
      return {
        minx: x - w / 2, maxx: x + w / 2, miny: y - h / 2, maxy: y + h / 2, minz: z - d / 2, maxz: z + d / 2,
        vault: !!(flags && flags.vault),
        platform: !!(flags && flags.platform),
        breakable: !!(flags && flags.breakable),
        broken: false,
        mesh: m,
        cx: x, cy: y, cz: z, w: w, h: h, d: d
      };
    }
    this.boxes = [
      box(wallMat, 2.2, 4.2, 18, -this.half, 2.1, 0),
      box(wallMat, 2.2, 4.2, 18, this.half, 2.1, 0),
      box(wallMat, 18, 4.2, 2.2, 0, 2.1, -this.half),
      box(wallMat, 18, 4.2, 2.2, 0, 2.1, this.half),
      box(crateMat, 6, 1.4, 6, -10 * S, 0.7, -10 * S, {platform: true}),
      box(rustMat, 7, 2.2, 5, 11 * S, 1.1, 11 * S, {platform: true}),
      box(barrierMat, 4.5, 1.05, 0.7, 0, 0.52, -6 * S, {vault: true}),
      box(barrierMat, 0.7, 1.05, 4.2, 6 * S, 0.52, 1 * S, {vault: true}),
      box(breakMat, 3.2, 2.8, 1.2, -7 * S, 1.4, 8 * S, {breakable: true}),
      box(breakMat, 1.4, 2.4, 3.6, 8 * S, 1.2, -9 * S, {breakable: true}),
      box(breakMat, 3.0, 2.4, 0.7, 14 * S, 1.2, 4 * S, {breakable: true}),
      box(breakMat, 0.7, 2.4, 3.0, -15 * S, 1.2, -8 * S, {breakable: true})
    ];
    const step = box(rustMat, 4, 0.45, 2.2, -11 * S, 0.22, 0, {platform: true});
    const step2 = box(crateMat, 4, 0.9, 2.2, -11 * S, 0.45, 2.1 * S, {platform: true});
    this.boxes.push(step, step2);
    const extras = [
      [80, -90], [120, 70], [-140, 40], [-60, 160], [200, -40], [-180, -120],
      [40, 210], [-220, 90]
    ];
    for(let e = 0; e < extras.length; e++){
      this.boxes.push(box(e % 2 ? rustMat : crateMat, 6, 1.4, 6, extras[e][0], 0.7, extras[e][1], {platform: true}));
    }
    for(let i = 0; i < 4; i++){
      if(this.boxes[i] && this.boxes[i].mesh) this.boxes[i].mesh.visible = false;
    }
    const crateA = new THREE.MeshLambertMaterial({color: 0x6b5340});
    const crateB = new THREE.MeshLambertMaterial({color: 0x4a6a58});
    const drumMat = new THREE.MeshLambertMaterial({color: 0x3a4a62});
    const drumGeo = new THREE.CylinderGeometry(0.18, 0.2, 0.42, 8);
    function looseProp(mesh, x, y, z, s){
      mesh.position.set(x, y, z);
      mesh.userData.loose = true;
      g.add(mesh);
      return {
        mesh: mesh, loose: true,
        ox: x, oy: y, oz: z, s: s || 0.32,
        x: x, y: y, z: z,
        rx: 0, ry: 0, rz: 0,
        vx: 0, vy: 0, vz: 0,
        svx: 0, svy: 0, svz: 0,
        flying: false
      };
    }
    const scatter = [
      [1.8 * S, 1.4 * S, 0.34, 0], [2.6 * S, -0.6 * S, 0.3, 1], [-1.6 * S, 1.8 * S, 0.38, 0],
      [-2.2 * S, -1.2 * S, 0.28, 1], [0.9 * S, -2.4 * S, 0.32, 0], [-0.7 * S, 2.8 * S, 0.26, 2],
      [3.6 * S, 1.8 * S, 0.36, 1], [-3.2 * S, 0.4 * S, 0.3, 0], [4.4 * S, -2.2 * S, 0.34, 2],
      [-4.0 * S, -2.8 * S, 0.28, 1], [2.2 * S, 4.2 * S, 0.4, 0], [-1.8 * S, -4.0 * S, 0.32, 1],
      [5.2 * S, 1.2 * S, 0.3, 0], [-5.0 * S, 2.4 * S, 0.36, 2], [1.4 * S, 5.6 * S, 0.28, 1],
      [-6.2 * S, -0.8 * S, 0.34, 0]
    ];
    this.loose = [];
    for(let i = 0; i < scatter.length; i++){
      const p = scatter[i];
      const s = p[2];
      let mesh;
      if(p[3] === 2){
        mesh = new THREE.Mesh(drumGeo, drumMat);
        this.loose.push(looseProp(mesh, p[0], 0.21, p[1], s));
      }else{
        mesh = new THREE.Mesh(new THREE.BoxGeometry(s, s, s), p[3] ? crateB : crateA);
        this.loose.push(looseProp(mesh, p[0], s * 0.5, p[1], s));
      }
    }
    const dummy = new THREE.Object3D();
    const decoCount = 48;
    const deco = new THREE.InstancedMesh(new THREE.BoxGeometry(0.36, 0.36, 0.36), crateA, decoCount);
    deco.name = 'VFDeco';
    deco.frustumCulled = true;
    for(let d = 0; d < decoCount; d++){
      const a = (d / decoCount) * Math.PI * 2;
      const rad = 22 + (d % 7) * (this.half * 0.12);
      dummy.position.set(Math.cos(a) * rad, 0.18, Math.sin(a) * rad);
      dummy.rotation.y = a * 0.7;
      dummy.updateMatrix();
      deco.setMatrixAt(d, dummy.matrix);
    }
    g.add(deco);
    this.spawnPoints = [
      {x: 10 * S, z: -8 * S}, {x: -11 * S, z: 6 * S}, {x: 14 * S, z: 10 * S}, {x: -8 * S, z: -13 * S},
      {x: 3 * S, z: 16 * S}, {x: -16 * S, z: -4 * S}, {x: 18 * S, z: -2 * S}, {x: -4 * S, z: 12 * S}
    ];
    for(let i = 0; i < 16; i++){
      const a = i / 16 * Math.PI * 2;
      const r = this.half * (0.22 + (i % 3) * 0.16);
      this.spawnPoints.push({x: Math.cos(a) * r, z: Math.sin(a) * r});
    }
    const hemi = new THREE.HemisphereLight(0x9ad0ff, 0x1a1028, 1.05);
    const moon = new THREE.DirectionalLight(0xe8f2ff, 0.78);
    moon.position.set(-12, 28, -16);
    const neonC = new THREE.DirectionalLight(0x3ee8d8, 0.34);
    neonC.position.set(16, 10, 8);
    const neonM = new THREE.DirectionalLight(0xff5cb0, 0.24);
    neonM.position.set(-14, 8, 16);
    g.add(hemi, moon, neonC, neonM);
    scene.add(g);
    this.group = g;
    scene.fog = new THREE.Fog(0x10182e, 80, 640);
    try{
      const loader = new THREE.TextureLoader();
      loader.load(VF.asset('map/arena-ground.avif'), function(tex){
        self._prepTex(tex, 32, 32);
        ground.material.map = tex;
        ground.material.color.setHex(0xffffff);
        ground.material.needsUpdate = true;
      }, undefined, function(){});
      loader.load(VF.asset('map/arena-sky.avif'), function(tex){
        self._placeSky(g, tex);
      }, undefined, function(){});
    }catch(_){}
    return this;
  };

  PrototypeArena.prototype.surfaceY = function(x, z){
    let y = 0;
    for(let i = 0; i < this.boxes.length; i++){
      const b = this.boxes[i];
      if(!b.platform) continue;
      if(x >= b.minx && x <= b.maxx && z >= b.minz && z <= b.maxz) y = Math.max(y, b.maxy);
    }
    return y;
  };

  PrototypeArena.prototype.collide = function(x, y, z, r){
    r = r || 0.5;
    const h = this.half - 1.2;
    let nx = 0, nz = 0, wall = false, hitBox = null;
    let cx = x, cy = y, cz = z;
    const ox = x, oz = z;
    if(x < -h){ nx = 1; wall = true; cx = -h; }
    else if(x > h){ nx = -1; wall = true; cx = h; }
    if(z < -h){ nz = 1; wall = true; cz = -h; }
    else if(z > h){ nz = -1; wall = true; cz = h; }
    x = VF.clamp(x, -h, h);
    z = VF.clamp(z, -h, h);
    for(let i = 0; i < this.boxes.length; i++){
      const b = this.boxes[i];
      if(b.platform || b.broken || b.loose) continue;
      const px = VF.clamp(x, b.minx, b.maxx);
      const pz = VF.clamp(z, b.minz, b.maxz);
      const dx = x - px, dz = z - pz;
      const d = Math.hypot(dx, dz);
      if(d < r && y < b.maxy - 0.15){
        if(b.vault && y > b.maxy - 0.85) continue;
        if(d < 1e-5){ x += r; continue; }
        const push = (r - d) / d;
        x += dx * push; z += dz * push;
        const nlen = Math.hypot(dx, dz) || 1;
        nx = dx / nlen; nz = dz / nlen;
        cx = px; cy = VF.clamp(y + 0.9, b.miny, b.maxy); cz = pz;
        wall = true;
        hitBox = b;
      }
    }
    if(wall && cx === ox && cz === oz){
      cx = x - nx * r;
      cz = z - nz * r;
      cy = y + 0.9;
    }
    const sy = this.surfaceY(x, z);
    return {
      x: x, y: sy, z: z,
      grounded: y <= sy + 0.08,
      wall: wall,
      hitBox: hitBox,
      normal: {x: nx, y: 0, z: nz},
      contact: {x: cx, y: cy, z: cz}
    };
  };

  PrototypeArena.prototype.tickLoose = function(dt, player, windFrac, gust){
    const props = this.loose || [];
    if(!props.length) return;
    const T = VF.EnergyAttackTune || {};
    const R = T.vortexLiftRadius || 6.2;
    const px = player && player.x || 0;
    const pz = player && player.z || 0;
    const wind = Math.max(0, windFrac || 0);
    const fling = Math.max(0, gust || 0);
    const h = this.half - 1.4;
    const grav = 22;
    for(let i = 0; i < props.length; i++){
      const p = props[i];
      const m = p.mesh;
      const dx = p.x - px;
      const dz = p.z - pz;
      const dist = Math.hypot(dx, dz);
      const inRange = dist < R;
      const reach = inRange ? (1 - dist / R) : 0;
      const inv = dist > 0.12 ? 1 / dist : 0;
      const nx = dx * inv;
      const nz = dz * inv;
      const tx = -dz * inv;
      const tz = dx * inv;
      const inStorm = wind > 0.06 && inRange;
      if(inStorm && !p.flying){
        p.caught = true;
        const lift = VF._t.energyWindLift ? VF._t.energyWindLift(dist, wind) : (T.vortexLift || 1.55) * reach * wind;
        const wantY = p.oy + 0.28 + lift;
        p.y += (wantY - p.y) * Math.min(1, dt * 7);
        const spin = (T.vortexSpin || 4.6) * wind * (0.55 + 0.7 * reach);
        const out = (T.vortexOut || 3.8) * wind * (0.35 + 0.85 * (1 - reach));
        p.vx = tx * spin * 2.4 + nx * out;
        p.vz = tz * spin * 2.4 + nz * out;
        p.ry += (4.2 + 10 * wind) * dt;
        p.rx += 1.8 * wind * dt;
        p.rz -= 1.5 * wind * dt;
        p.svx = tx * 6;
        p.svy = 5 + wind * 8;
        p.svz = tz * 6;
        const spd = Math.hypot(p.vx, p.vz);
        if(fling > 0.02 || (wind > 0.38 && (reach < 0.18 || spd > 7.2 || dist > R * 0.9))){
          p.flying = true;
          if(fling > 0.02){
            const power = VF._t.energyWindFlingSpeed ? VF._t.energyWindFlingSpeed(dist, fling) : (8 + 18 * fling) * reach;
            p.vx += nx * power + tx * power * 0.85;
            p.vz += nz * power + tz * power * 0.85;
            p.vy = 3.6 + (T.vortexFlingLift || 6.2) * fling * (0.4 + 0.6 * reach);
          }else{
            p.vy = 1.4 + 3.8 * wind;
          }
        }else{
          p.x += p.vx * dt;
          p.z += p.vz * dt;
        }
      }else if(fling > 0.02 && inRange){
        p.caught = true;
        p.flying = true;
        const power = VF._t.energyWindFlingSpeed ? VF._t.energyWindFlingSpeed(dist, fling) : (8 + 18 * fling) * reach;
        p.vx += nx * power + tx * power * 0.85;
        p.vz += nz * power + tz * power * 0.85;
        p.vy = Math.max(p.vy || 0, 3.6 + (T.vortexFlingLift || 6.2) * fling * (0.4 + 0.6 * reach));
      }else if(p.caught && !p.flying && !inStorm && (Math.hypot(p.vx, p.vz) > 0.2 || p.y > p.oy + 0.05)){
        p.flying = true;
      }
      if(p.flying){
        p.vy -= grav * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.z += p.vz * dt;
        p.rx += p.svx * dt;
        p.ry += p.svy * dt;
        p.rz += p.svz * dt;
        if(p.x < -h || p.x > h){ p.vx *= -0.28; p.x = VF.clamp(p.x, -h, h); }
        if(p.z < -h || p.z > h){ p.vz *= -0.28; p.z = VF.clamp(p.z, -h, h); }
        if(p.y <= p.oy){
          p.y = p.oy;
          p.vy = 0;
          p.vx *= 0.84;
          p.vz *= 0.84;
          p.svx *= 0.88;
          p.svy *= 0.88;
          p.svz *= 0.88;
          p.ox = p.x;
          p.oz = p.z;
          if(Math.hypot(p.vx, p.vz) < 0.4){
            p.flying = false;
            p.vx = 0; p.vy = 0; p.vz = 0;
            p.svx = 0; p.svy = 0; p.svz = 0;
          }
        }
      }
      if(m && m.position && m.position.set) m.position.set(p.x, p.y, p.z);
      if(m && m.rotation && m.rotation.set) m.rotation.set(p.rx, p.ry, p.rz);
    }
  };

  VF.PrototypeArena = PrototypeArena;
  VF._t = VF._t || {};
  VF._t.skyBand = function(radius, imgW, imgH, wraps, cropV){
    const r = radius || 76;
    const n = Math.max(1, wraps || 3);
    const crop = cropV == null ? 0.58 : cropV;
    const aspect = Math.max(0.5, (imgW || 1280) / ((imgH || 446) * crop));
    const height = (Math.PI * 2 * r / n) / aspect;
    return {radius: r, wraps: n, height: height, y: height * 0.5 + 0.8, crop: crop};
  };
})(typeof window !== 'undefined' ? window : globalThis);
