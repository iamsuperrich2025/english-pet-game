"use strict";
/* Holographic cyan healing station. Compact metal pad + column + heart. Gameplay radius stays in HealPadTune. */
(function(root){
  const VF = root.VocabForce = root.VocabForce || {};
  const CYAN = 0x00f5ff;
  const TEAL = 0x00cfcf;
  const TURQ = 0x00ffd5;
  const BLUE = 0x49cfff;

  function canvasTex(draw, size){
    if(typeof document === 'undefined' || !document.createElement) return null;
    const c = document.createElement('canvas');
    c.width = c.height = size;
    draw(c.getContext('2d'), size);
    const THREE = root.THREE;
    if(!THREE || !THREE.CanvasTexture) return c;
    const tex = new THREE.CanvasTexture(c);
    tex.needsUpdate = true;
    if(tex.minFilter != null) tex.minFilter = THREE.LinearFilter;
    if(tex.magFilter != null) tex.magFilter = THREE.LinearFilter;
    return tex;
  }

  function paintPlatform(ctx, size){
    const cx = size * 0.5, cy = size * 0.5;
    ctx.clearRect(0, 0, size, size);
    const halo = ctx.createRadialGradient(cx, cy, size * 0.36, cx, cy, size * 0.5);
    halo.addColorStop(0, 'rgba(0,207,207,0.22)');
    halo.addColorStop(0.55, 'rgba(0,180,210,0.16)');
    halo.addColorStop(1, 'rgba(0,40,60,0)');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(cx, cy, size * 0.5, 0, Math.PI * 2);
    ctx.fill();
    const metal = ctx.createRadialGradient(cx, cy, size * 0.04, cx, cy, size * 0.41);
    metal.addColorStop(0, '#163044');
    metal.addColorStop(0.38, '#0c1c28');
    metal.addColorStop(0.78, '#08141c');
    metal.addColorStop(1, '#050b12');
    ctx.fillStyle = metal;
    ctx.beginPath();
    ctx.arc(cx, cy, size * 0.41, 0, Math.PI * 2);
    ctx.fill();
    const well = ctx.createRadialGradient(cx, cy, 2, cx, cy, size * 0.11);
    well.addColorStop(0, 'rgba(0,255,213,0.38)');
    well.addColorStop(0.55, 'rgba(0,207,207,0.16)');
    well.addColorStop(1, 'rgba(10,40,52,0.9)');
    ctx.fillStyle = well;
    ctx.beginPath();
    ctx.arc(cx, cy, size * 0.12, 0, Math.PI * 2);
    ctx.fill();
    const rings = [
      [0.395, '#00cfcf', 0.012, 0.8],
      [0.325, '#00f5ff', 0.007, 0.72],
      [0.245, '#00ffd5', 0.008, 0.78],
      [0.165, '#49cfff', 0.006, 0.7]
    ];
    for(let i = 0; i < rings.length; i++){
      const r = rings[i];
      ctx.beginPath();
      ctx.arc(cx, cy, size * r[0], 0, Math.PI * 2);
      ctx.strokeStyle = r[1];
      ctx.globalAlpha = r[3];
      ctx.lineWidth = size * r[2];
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.strokeStyle = 'rgba(0,245,255,0.45)';
    ctx.lineWidth = size * 0.005;
    for(let i = 0; i < 24; i++){
      const a = (i / 24) * Math.PI * 2;
      const r0 = size * 0.355;
      const r1 = size * (i % 6 === 0 ? 0.398 : 0.378);
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0);
      ctx.lineTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1);
      ctx.stroke();
    }
    ctx.fillStyle = 'rgba(0,245,255,0.55)';
    const p = size * 0.012, arm = size * 0.038;
    ctx.fillRect(cx - p, cy - arm, p * 2, arm * 2);
    ctx.fillRect(cx - arm, cy - p, arm * 2, p * 2);
  }

  function paintHeart(ctx, size){
    const cx = size * 0.5, cy = size * 0.5;
    ctx.clearRect(0, 0, size, size);
    ctx.save();
    ctx.translate(cx, cy + size * 0.04);
    ctx.scale(size / 220, size / 220);
    ctx.beginPath();
    ctx.moveTo(0, 16);
    ctx.bezierCurveTo(0, -16, -50, -40, -50, 2);
    ctx.bezierCurveTo(-50, 38, -18, 62, 0, 88);
    ctx.bezierCurveTo(18, 62, 50, 38, 50, 2);
    ctx.bezierCurveTo(50, -40, 0, -16, 0, 16);
    ctx.closePath();
    ctx.fillStyle = 'rgba(0,207,207,0.32)';
    ctx.fill();
    ctx.save();
    ctx.clip();
    for(let y = -78; y < 96; y += 7){
      ctx.fillStyle = y % 14 === 0 ? 'rgba(0,245,255,0.38)' : 'rgba(0,255,213,0.14)';
      ctx.fillRect(-56, y, 112, 2);
    }
    ctx.restore();
    ctx.strokeStyle = 'rgba(0,245,255,0.98)';
    ctx.lineWidth = 6.5;
    ctx.shadowColor = '#00f5ff';
    ctx.shadowBlur = 14;
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(210,255,255,0.92)';
    ctx.fillRect(-7, -26, 14, 48);
    ctx.fillRect(-24, -7, 48, 14);
    ctx.restore();
  }

  function paintPlus(ctx, size){
    ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = 'rgba(0,245,255,0.9)';
    ctx.shadowColor = '#00cfcf';
    ctx.shadowBlur = 6;
    const m = size * 0.5, t = size * 0.13, a = size * 0.36;
    ctx.fillRect(m - t, m - a, t * 2, a * 2);
    ctx.fillRect(m - a, m - t, a * 2, t * 2);
  }

  function paintDot(ctx, size){
    ctx.clearRect(0, 0, size, size);
    const g = ctx.createRadialGradient(size * 0.5, size * 0.5, 1, size * 0.5, size * 0.5, size * 0.45);
    g.addColorStop(0, 'rgba(180,255,255,0.9)');
    g.addColorStop(0.4, 'rgba(0,245,255,0.55)');
    g.addColorStop(1, 'rgba(0,180,210,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
  }

  function paintSquare(ctx, size){
    ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = 'rgba(0,255,213,0.85)';
    ctx.shadowColor = '#00f5ff';
    ctx.shadowBlur = 5;
    const m = size * 0.28;
    ctx.fillRect(size * 0.5 - m, size * 0.5 - m, m * 2, m * 2);
  }

  function paintColumn(ctx, size){
    ctx.clearRect(0, 0, size, size);
    const g = ctx.createLinearGradient(0, 0, size, 0);
    g.addColorStop(0, 'rgba(0,180,210,0)');
    g.addColorStop(0.35, 'rgba(0,207,207,0.18)');
    g.addColorStop(0.5, 'rgba(0,245,255,0.32)');
    g.addColorStop(0.65, 'rgba(0,207,207,0.18)');
    g.addColorStop(1, 'rgba(0,180,210,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    const v = ctx.createLinearGradient(0, 0, 0, size);
    v.addColorStop(0, 'rgba(0,40,60,0.55)');
    v.addColorStop(0.15, 'rgba(0,0,0,0)');
    v.addColorStop(0.85, 'rgba(0,0,0,0)');
    v.addColorStop(1, 'rgba(0,40,60,0.55)');
    ctx.fillStyle = v;
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = 'rgba(73,207,255,0.12)';
    for(let y = 0; y < size; y += 8) ctx.fillRect(0, y, size, 2);
  }

  function paintGlow(ctx, size){
    const cx = size * 0.5, cy = size * 0.5;
    ctx.clearRect(0, 0, size, size);
    const g = ctx.createRadialGradient(cx, cy, size * 0.12, cx, cy, size * 0.5);
    g.addColorStop(0, 'rgba(0,207,207,0.28)');
    g.addColorStop(0.45, 'rgba(0,180,210,0.14)');
    g.addColorStop(1, 'rgba(0,40,70,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, size * 0.5, 0, Math.PI * 2);
    ctx.fill();
  }

  function mat(THREE, opt){
    const m = new THREE.MeshBasicMaterial(opt);
    if(m.fog != null) m.fog = false;
    return m;
  }

  function HealPad(){
    const T = VF.HealPadTune || {};
    this.x = T.X || 0;
    this.z = T.Z || 0;
    this.radius = T.RADIUS || 5.4;
    this.group = null;
    this.heart = null;
    this.heartGlow = null;
    this.halos = [];
    this.pluses = [];
    this.particles = [];
    this.streaks = [];
    this.columnPlanes = [];
    this.beam = null;
    this.core = null;
    this.floor = null;
    this.glow = null;
    this.base = null;
    this.aura = null;
    this.light = null;
    this.t = 0;
    this.heartY = T.HEART_Y || 3.35;
    this.heartS = T.HEART_SIZE || 2.45;
    this.inside = false;
    this._heat = 0;
    this._humAt = 0;
    this._trash = [];
  }

  HealPad.prototype._keep = function(obj){
    if(obj) this._trash.push(obj);
    return obj;
  };

  HealPad.prototype.attach = function(scene){
    const THREE = root.THREE;
    if(!THREE || !scene) return this;
    if(this.group) this.dispose();
    const T = VF.HealPadTune || {};
    const pr = T.PLATFORM_R || 1.55;
    const h = T.HEIGHT || 3.55;
    const heartY = T.HEART_Y || 3.35;
    const heartS = T.HEART_SIZE || 2.45;
    this.heartY = heartY;
    this.heartS = heartS;
    const add = THREE.AdditiveBlending != null ? THREE.AdditiveBlending : 2;
    const g = new THREE.Group();
    g.name = 'VFHealPad';
    g.position.set(this.x, 0, this.z);

    const platTex = this._keep(canvasTex(paintPlatform, 512));
    const heartTex = this._keep(canvasTex(paintHeart, 256));
    const plusTex = this._keep(canvasTex(paintPlus, 64));
    const dotTex = this._keep(canvasTex(paintDot, 32));
    const sqTex = this._keep(canvasTex(paintSquare, 32));
    const colTex = this._keep(canvasTex(paintColumn, 128));
    const glowTex = this._keep(canvasTex(paintGlow, 256));

    this.base = new THREE.Mesh(
      this._keep(new THREE.CylinderGeometry(pr * 0.98, pr * 1.05, 0.14, 28)),
      new THREE.MeshLambertMaterial({color: 0x0c1822, emissive: 0x00333c})
    );
    this.base.position.y = 0.02;
    g.add(this.base);

    this.floor = new THREE.Mesh(
      this._keep(new THREE.CircleGeometry(pr, 40)),
      mat(THREE, {
        map: platTex || null, color: platTex ? 0xdeffff : TEAL,
        transparent: true, opacity: 0.96, depthWrite: false, side: THREE.DoubleSide
      })
    );
    this.floor.rotation.x = -Math.PI / 2;
    this.floor.position.y = 0.1;
    this.floor.renderOrder = 2;
    g.add(this.floor);

    this.glow = new THREE.Mesh(
      this._keep(new THREE.CircleGeometry(pr * 1.22, 32)),
      mat(THREE, {
        map: glowTex || null, color: glowTex ? BLUE : TEAL,
        transparent: true, opacity: 0.42, depthWrite: false, side: THREE.DoubleSide
      })
    );
    this.glow.rotation.x = -Math.PI / 2;
    this.glow.position.y = 0.03;
    this.glow.renderOrder = 1;
    g.add(this.glow);

    const ringSpec = [[0.42, 0.48], [0.70, 0.76], [0.92, 0.98]];
    for(let i = 0; i < ringSpec.length; i++){
      const rs = ringSpec[i];
      const ring = new THREE.Mesh(
        this._keep(new THREE.RingGeometry(pr * rs[0], pr * rs[1], 36)),
        mat(THREE, {
          color: i === 1 ? CYAN : TEAL, transparent: true, opacity: 0.38,
          blending: add, depthWrite: false, side: THREE.DoubleSide
        })
      );
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.12 + i * 0.012;
      g.add(ring);
      this.halos.push(ring);
    }

    const colMat = mat(THREE, {
      map: colTex || null, color: colTex ? TEAL : CYAN,
      transparent: true, opacity: 0.12, blending: add, depthWrite: false, side: THREE.DoubleSide
    });
    const colGeo = this._keep(new THREE.PlaneGeometry(pr * 1.15, h));
    for(let i = 0; i < 2; i++){
      const plane = new THREE.Mesh(colGeo, colMat);
      plane.position.y = h * 0.5;
      plane.rotation.y = i * Math.PI * 0.5;
      plane.frustumCulled = false;
      g.add(plane);
      this.columnPlanes.push(plane);
    }
    this.beam = new THREE.Mesh(
      this._keep(new THREE.CylinderGeometry(pr * 0.52, pr * 0.62, h, 14, 1, true)),
      mat(THREE, {
        color: TEAL, transparent: true, opacity: 0.09, blending: add,
        depthWrite: false, side: THREE.DoubleSide
      })
    );
    this.beam.position.y = h * 0.5;
    this.beam.frustumCulled = false;
    g.add(this.beam);
    this.core = new THREE.Mesh(
      this._keep(new THREE.CylinderGeometry(0.16, 0.22, h * 0.82, 10, 1, true)),
      mat(THREE, {
        color: CYAN, transparent: true, opacity: 0.12, blending: add,
        depthWrite: false, side: THREE.DoubleSide
      })
    );
    this.core.position.y = h * 0.42;
    this.core.frustumCulled = false;
    g.add(this.core);

    const torusGeo = this._keep(new THREE.TorusGeometry(pr * 0.58, 0.018, 6, 32));
    const torusYs = [0.55, 1.55, heartY + heartS * 0.18];
    for(let i = 0; i < 3; i++){
      const halo = new THREE.Mesh(torusGeo, mat(THREE, {
        color: i === 1 ? TURQ : CYAN, transparent: true, opacity: 0.62,
        blending: add, depthWrite: false
      }));
      halo.position.y = torusYs[i];
      halo.rotation.x = Math.PI / 2;
      halo.userData.baseY = torusYs[i];
      halo.userData.spin = 0.35 + i * 0.18;
      g.add(halo);
      this.halos.push(halo);
    }

    this.heartGlow = new THREE.Mesh(
      this._keep(new THREE.PlaneGeometry(heartS * 1.28, heartS * 1.28)),
      mat(THREE, {
        map: heartTex || null, color: TEAL, transparent: true, opacity: 0.22,
        blending: add, depthWrite: false, side: THREE.DoubleSide
      })
    );
    this.heartGlow.position.y = heartY;
    this.heartGlow.frustumCulled = false;
    this.heartGlow.renderOrder = 7;
    if(this.heartGlow.material) this.heartGlow.material.depthTest = false;
    g.add(this.heartGlow);
    this.heart = new THREE.Mesh(
      this._keep(new THREE.PlaneGeometry(heartS, heartS)),
      mat(THREE, {
        map: heartTex || null, color: heartTex ? CYAN : TEAL,
        transparent: true, opacity: 0.92, depthWrite: false, depthTest: false, side: THREE.DoubleSide
      })
    );
    this.heart.position.y = heartY;
    this.heart.frustumCulled = false;
    this.heart.renderOrder = 8;
    g.add(this.heart);

    const plusMat = mat(THREE, {
      map: plusTex || null, color: plusTex ? CYAN : TURQ,
      transparent: true, opacity: 0.7, blending: add, depthWrite: false, side: THREE.DoubleSide
    });
    const plusGeo = this._keep(new THREE.PlaneGeometry(0.22, 0.22));
    for(let i = 0; i < 3; i++){
      const p = new THREE.Mesh(plusGeo, plusMat.clone ? plusMat.clone() : plusMat);
      p.userData.k = i;
      p.userData.kind = 'plus';
      g.add(p);
      this.pluses.push(p);
      this.particles.push(p);
    }
    const dotMat = mat(THREE, {
      map: dotTex || null, color: CYAN, transparent: true, opacity: 0.7,
      blending: add, depthWrite: false, side: THREE.DoubleSide
    });
    const sqMat = mat(THREE, {
      map: sqTex || null, color: TURQ, transparent: true, opacity: 0.65,
      blending: add, depthWrite: false, side: THREE.DoubleSide
    });
    const bitGeo = this._keep(new THREE.PlaneGeometry(0.1, 0.1));
    for(let i = 0; i < 8; i++){
      const src = i % 2 ? sqMat : dotMat;
      const p = new THREE.Mesh(bitGeo, src.clone ? src.clone() : src);
      p.userData.k = i + 3;
      p.userData.kind = i % 2 ? 'sq' : 'dot';
      g.add(p);
      this.particles.push(p);
    }

    const streakMat = mat(THREE, {
      color: CYAN, transparent: true, opacity: 0, blending: add, depthWrite: false, side: THREE.DoubleSide
    });
    const streakGeo = this._keep(new THREE.PlaneGeometry(0.05, 1.15));
    for(let i = 0; i < 4; i++){
      const s = new THREE.Mesh(streakGeo, streakMat);
      s.visible = false;
      g.add(s);
      this.streaks.push(s);
    }
    this.aura = new THREE.Mesh(
      this._keep(new THREE.RingGeometry(0.28, 0.42, 24)),
      mat(THREE, {
        color: TURQ, transparent: true, opacity: 0, blending: add,
        depthWrite: false, side: THREE.DoubleSide
      })
    );
    this.aura.rotation.x = -Math.PI / 2;
    this.aura.position.y = 0.08;
    this.aura.visible = false;
    g.add(this.aura);

    scene.add(g);
    this.group = g;
    return this;
  };

  HealPad.prototype.contains = function(player){
    if(!player || player.alive === false) return false;
    return VF._t.healPadContains
      ? VF._t.healPadContains(player.x, player.z, this.x, this.z, this.radius)
      : Math.hypot((player.x || 0) - this.x, (player.z || 0) - this.z) <= this.radius;
  };

  HealPad.prototype._face = function(mesh, camera){
    if(!mesh || !mesh.lookAt) return;
    if(camera && camera.cam) mesh.lookAt(camera.cam.position);
    else if(camera && camera.position) mesh.lookAt(camera.position);
  };

  HealPad.prototype.tick = function(dt, player, hud, audio, camera){
    this.t += dt || 0;
    const inside = this.contains(player);
    this.inside = inside;
    this._heat += ((inside ? 1 : 0) - this._heat) * Math.min(1, (dt || 0) * 4);
    const heat = this._heat;
    const pulse = 1 + Math.sin(this.t * 2.2) * (0.04 + heat * 0.05);
    const flick = 0.82 + Math.sin(this.t * 11.5) * 0.06 + Math.sin(this.t * 23) * 0.03;
    if(this.heart){
      this.heart.scale.set(pulse, pulse, 1);
      if(this.heart.material) this.heart.material.opacity = (0.78 + heat * 0.12) * flick;
      this._face(this.heart, camera);
    }
    if(this.heartGlow){
      const gp = pulse * (1.04 + heat * 0.08);
      this.heartGlow.scale.set(gp, gp, 1);
      if(this.heartGlow.material) this.heartGlow.material.opacity = 0.16 + heat * 0.12;
      this._face(this.heartGlow, camera);
    }
    if(this.beam && this.beam.material){
      this.beam.material.opacity = 0.07 + Math.sin(this.t * 2.6) * 0.02 + heat * 0.05;
    }
    if(this.core && this.core.material){
      this.core.material.opacity = 0.1 + Math.sin(this.t * 3.4) * 0.03 + heat * 0.06;
    }
    for(let i = 0; i < this.columnPlanes.length; i++){
      const p = this.columnPlanes[i];
      if(p && p.material) p.material.opacity = 0.1 + Math.sin(this.t * 2.1) * 0.03 + heat * 0.05;
    }
    if(this.floor && this.floor.material){
      this.floor.material.opacity = 0.9 + heat * 0.08;
    }
    if(this.glow && this.glow.material){
      this.glow.material.opacity = 0.32 + heat * 0.16 + Math.sin(this.t * 1.8) * 0.04;
    }
    for(let i = 0; i < this.halos.length; i++){
      const h = this.halos[i];
      if(!h) continue;
      if(i < 3){
        h.rotation.z += dt * (0.28 + i * 0.12);
        if(h.material) h.material.opacity = 0.3 + heat * 0.18 + Math.sin(this.t * 2 + i) * 0.05;
      }else{
        const spin = (h.userData && h.userData.spin) || 0.4;
        h.rotation.z += dt * spin;
        const baseY = (h.userData && h.userData.baseY) || h.position.y;
        h.position.y = baseY + Math.sin(this.t * 1.15 + i) * 0.06;
        if(h.material) h.material.opacity = 0.5 + heat * 0.18 + Math.sin(this.t * 2.4 + i) * 0.08;
      }
    }
    const liftSpan = 2.4 + heat * 0.35;
    for(let i = 0; i < this.particles.length; i++){
      const p = this.particles[i];
      const k = (p.userData && p.userData.k) || i;
      const a = this.t * (0.7 + heat * 0.35) + k * 0.9;
      const rad = 0.55 + (k % 3) * 0.28;
      const lift = (this.t * (0.42 + heat * 0.22) + k * 0.31) % liftSpan;
      const aroundHeart = (p.userData && p.userData.kind) === 'dot' && k % 4 === 0;
      if(aroundHeart){
        p.position.set(Math.cos(a * 1.6) * 0.55, (this.heartY || 3.35) + Math.sin(a * 2.1) * 0.32, Math.sin(a * 1.6) * 0.55);
        p.scale.setScalar(0.7 + heat * 0.2);
      }else{
        p.position.set(Math.cos(a) * rad, 0.28 + lift, Math.sin(a) * rad);
        p.scale.setScalar(0.85 + (1 - lift / liftSpan) * 0.35);
      }
      p.rotation.y = a;
      if(p.material) p.material.opacity = (0.22 + (1 - lift / liftSpan) * 0.45 + heat * 0.18) * (inside || aroundHeart ? 1 : 0.85);
    }
    const lx = player ? (player.x || 0) - this.x : 0;
    const lz = player ? (player.z || 0) - this.z : 0;
    for(let i = 0; i < this.streaks.length; i++){
      const s = this.streaks[i];
      if(!s) continue;
      const show = heat > 0.08;
      s.visible = show;
      if(!show) continue;
      const a = this.t * 1.7 + i * 1.57;
      s.position.set(lx + Math.cos(a) * 0.38, 0.55 + ((this.t * 1.1 + i * 0.4) % 1.6), lz + Math.sin(a) * 0.38);
      s.rotation.y = a;
      if(s.material) s.material.opacity = 0.18 * heat;
    }
    if(this.aura){
      const show = heat > 0.08;
      this.aura.visible = show;
      this.aura.position.set(lx, 0.08, lz);
      this.aura.rotation.z += dt * 1.2;
      if(this.aura.material) this.aura.material.opacity = 0.28 * heat;
      const as = 1 + Math.sin(this.t * 3.2) * 0.08;
      this.aura.scale.set(as, as, 1);
    }
    let healed = 0;
    if(inside && player && player.heal){
      healed = player.heal(VF._t.healPadAmount ? VF._t.healPadAmount(dt) : 24 * dt);
    }
    if(hud && hud.els && hud.els.hp){
      hud.els.hp.classList.toggle('is-heal', !!(inside && player && player.alive !== false && player.hp < player.maxHp));
    }
    if(inside && healed > 0.01 && audio && audio.healPad){
      const now = VF.now ? VF.now() : 0;
      const wait = (VF.HealPadTune && VF.HealPadTune.HUM_MS) || 420;
      if(now - this._humAt >= wait){
        this._humAt = now;
        audio.healPad();
      }
    }
    return healed;
  };

  HealPad.prototype.dispose = function(){
    if(this.group && this.group.parent) this.group.parent.remove(this.group);
    const seen = [];
    function dump(obj){
      if(!obj || seen.indexOf(obj) >= 0) return;
      seen.push(obj);
      if(obj.dispose) obj.dispose();
    }
    for(let i = 0; i < this._trash.length; i++) dump(this._trash[i]);
    if(this.group && this.group.traverse){
      this.group.traverse(function(child){
        dump(child.geometry);
        const mats = child.material ? (Array.isArray(child.material) ? child.material : [child.material]) : [];
        for(let m = 0; m < mats.length; m++){
          if(mats[m] && mats[m].map) dump(mats[m].map);
          dump(mats[m]);
        }
      });
    }
    this.group = null;
    this.heart = null;
    this.heartGlow = null;
    this.halos = [];
    this.pluses = [];
    this.particles = [];
    this.streaks = [];
    this.columnPlanes = [];
    this.beam = null;
    this.core = null;
    this.floor = null;
    this.glow = null;
    this.base = null;
    this.aura = null;
    this._trash = [];
  };

  VF.HealPad = HealPad;
})(typeof window !== 'undefined' ? window : globalThis);
