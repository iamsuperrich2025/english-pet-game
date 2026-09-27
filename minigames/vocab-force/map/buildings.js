"use strict";
/* รอบ 1604: อาคารหลบในสนาม Vocab Force — 1 ชั้น×4 + 2 ชั้น×2
   เดินเข้าประตูได้ (ผนัง = กล่องชนมาตรฐานของ arena → ผู้เล่น/บอท/ซอมบี้/ลูกพลัง ถูกกั้นครบ
   เพราะทุกตัวใช้ arena.collide กลาง) · อาคาร 2 ชั้นขึ้นชั้นบนด้วยบันไดบันไดเต็มแนวผนัง
   แผ่นพื้นชั้นสอง/หลังคา = กล่อง ceiling (เดินใต้ได้ ไม่โดนผลัก กระโดดหัวไม่ชน — ส่วนสูงชั้น 3.2
   มากกว่าหัวกระโดดสูงสุด ~2.95) + walkSlabs ให้ floorY คำนวณระดับยืนชั้นบน
   เมื่อผู้เล่นอยู่ในอาคาร shell ทั้งหลังถูกซ่อนเพื่อให้กล้องเห็นตัวละครในอาคาร */
(function(root){
  const VF = root.VocabForce = root.VocabForce || {};
  const WALL_H = 3.2;    /* ความสูงหนึ่งชั้น — กระโดดปกติสูงสุด ~1.4 (หัว ~2.95) ไม่ชนแผ่นชั้นสอง */
  const SLAB_T = 0.3;    /* หนาแผ่นพื้นชั้นสอง */
  const UPPER_H = 3.2;   /* ความสูงชั้นสอง */
  const ROOF_T = 0.3;    /* หนาหลังคา */
  const DOOR_W = 2.2;    /* กว้างประตู */
  const TH = 0.3;        /* หนาผนัง */
  const HEAD = 1.55;     /* ระดับหัวตัวละครเทียบใต้แผ่น (collide ใช้) */

  /* ตำแหน่งในลาน — ห่างจากของเดิม (ลังสนาม/รถ/ฮีลแพด) และหันประตูเข้าหากลางลาน */
  const SPECS = [
    {x: 175,  z: 140,  w: 10, d: 8, two: false},
    {x: -185, z: 95,   w: 10, d: 8, two: false},
    {x: 95,   z: -185, w: 9,  d: 8, two: false},
    {x: -135, z: -195, w: 9,  d: 8, two: false},
    {x: -30,  z: 215,  w: 12, d: 9, two: true},
    {x: 225,  z: -75,  w: 12, d: 9, two: true}
  ];

  function Buildings(){
    this.list = [];
  }

  function doorSide(s){
    const dx = -s.x, dz = -s.z;
    if(Math.abs(dx) > Math.abs(dz)) return dx > 0 ? 'e' : 'w';
    return dz > 0 ? 's' : 'n';
  }

  Buildings.prototype.build = function(arena, group){
    const THREE = root.THREE;
    if(!THREE || !arena) return this;
    const self = this;
    arena.walkSlabs = arena.walkSlabs || [];
    const mats = {
      wall: new THREE.MeshLambertMaterial({color: 0x2a2438}),
      roof: new THREE.MeshLambertMaterial({color: 0x232c3e}),
      slab: new THREE.MeshLambertMaterial({color: 0x2e3850}),
      step: new THREE.MeshLambertMaterial({color: 0x3d6d68}),
      floor: new THREE.MeshLambertMaterial({color: 0x241f33}),
      trimC: new THREE.MeshBasicMaterial({color: 0x3ee8d8}),
      trimM: new THREE.MeshBasicMaterial({color: 0xff5cb0}),
      win: new THREE.MeshBasicMaterial({color: 0xffd890})
    };
    const geoCache = {};
    function geo(w, h, d){
      const k = w.toFixed(2) + '|' + h.toFixed(2) + '|' + d.toFixed(2);
      if(!geoCache[k]) geoCache[k] = new THREE.BoxGeometry(w, h, d);
      return geoCache[k];
    }
    function boxMesh(mat, w, h, d, x, y, z, parent){
      const m = new THREE.Mesh(geo(w, h, d), mat);
      m.position.set(x, y, z);
      parent.add(m);
      return m;
    }
    function collideBox(cx, cy, cz, w, h, d, flags){
      const b = {
        minx: cx - w / 2, maxx: cx + w / 2,
        miny: cy - h / 2, maxy: cy + h / 2,
        minz: cz - d / 2, maxz: cz + d / 2,
        vault: false, platform: false, breakable: false, broken: false,
        ceiling: !!(flags && flags.ceiling), walk: !!(flags && flags.walk),
        mesh: null, cx: cx, cy: cy, cz: cz, w: w, h: h, d: d
      };
      arena.boxes.push(b);
      return b;
    }

    /* ผนัง 4 ด้าน แกนราบ — ด้านที่มีประตูถูกแยกเป็น 2 ท่อนเว้นช่อง DOOR_W ตรงกลาง */
    function walls(bd, shell, yBase, h, withDoorGap, mat){
      const sides = ['n', 's', 'e', 'w'];
      for(let si = 0; si < sides.length; si++){
        const side = sides[si];
        const horiz = side === 'n' || side === 's';
        const len = horiz ? bd.w : bd.d;
        const door = withDoorGap && side === bd.door;
        const gap = door ? DOOR_W : 0;
        const rest = len - gap;
        const segs = [];
        if(rest < 0.4){
          segs.push({off: 0, len: len});
        }else{
          const a = rest / 2;
          segs.push({off: -(gap / 2 + a / 2), len: a});
          segs.push({off: (gap / 2 + a / 2), len: a});
        }
        for(let gi = 0; gi < segs.length; gi++){
          const seg = segs[gi];
          let gx, gz, gw, gd;
          if(horiz){
            gx = bd.x + seg.off;
            gz = side === 'n' ? bd.z - bd.d / 2 : bd.z + bd.d / 2;
            gw = seg.len; gd = TH;
          }else{
            gx = side === 'w' ? bd.x - bd.w / 2 : bd.x + bd.w / 2;
            gz = bd.z + seg.off;
            gw = TH; gd = seg.len;
          }
          boxMesh(mat, gw, h, gd, gx, yBase + h / 2, gz, shell);
          collideBox(gx, yBase + h / 2, gz, gw, h, gd, null);
        }
        /* หน้าต่างเรืองแสงชั้นสอง (แค่ด้านยาว) */
        if(yBase > 0.1 && len >= 8 && mat === mats.wall){
          const wn = 2;
          const wallZ = side === 'n' ? bd.z - bd.d / 2 : (side === 's' ? bd.z + bd.d / 2 : bd.z);
          const wallX = side === 'w' ? bd.x - bd.w / 2 : (side === 'e' ? bd.x + bd.w / 2 : bd.x);
          for(let wi = 0; wi < wn; wi++){
            const off = (wi === 0 ? -1 : 1) * len * 0.22;
            let wx, wz;
            if(horiz){ wx = bd.x + off; wz = wallZ + (side === 'n' ? -TH / 2 - 0.02 : TH / 2 + 0.02); }
            else{ wx = wallX + (side === 'w' ? -TH / 2 - 0.02 : TH / 2 + 0.02); wz = bd.z + off; }
            const win = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 0.95), mats.win);
            win.position.set(wx, yBase + h * 0.52, wz);
            if(!horiz) win.rotation.y = side === 'w' ? -Math.PI / 2 : Math.PI / 2;
            else win.rotation.y = side === 'n' ? Math.PI : 0;
            shell.add(win);
          }
        }
      }
    }

    for(let bi = 0; bi < SPECS.length; bi++){
      const s = SPECS[bi];
      const bd = {x: s.x, z: s.z, w: s.w, d: s.d, door: doorSide(s)};
      const shell = new THREE.Group();
      shell.name = 'VFBuilding' + bi;
      /* รอบ 1605: ซ่อนเฉพาะหลังคาเวลาอยู่ในอาคาร — ผนัง/หน้าต่าง/กรอบประตูคงอยู่เหมือนเดิม
         (เดิมซ่อนทั้ง shell ทำให้บ้านกลายเป็นแผ่นแบน) */
      const roofG = new THREE.Group();
      roofG.name = 'VFBuildingRoof' + bi;
      shell.add(roofG);
      const perm = new THREE.Group();
      group.add(shell); group.add(perm);
      const trim = bi % 2 ? mats.trimM : mats.trimC;

      /* พื้นในอาคาร + ไฟนีออนประตู (อยู่ตลอด แม้ shell ถูกซ่อน) */
      boxMesh(mats.floor, s.w - 2 * TH - 0.2, 0.06, s.d - 2 * TH - 0.2, s.x, 0.03, s.z, perm);

      /* ผนังชั้นล่าง + กรอบประตู */
      walls(bd, shell, 0, WALL_H, true, mats.wall);
      const doorHoriz = bd.door === 'n' || bd.door === 's';
      const doorZ = bd.door === 'n' ? s.z - s.d / 2 : (bd.door === 's' ? s.z + s.d / 2 : s.z);
      const doorX = bd.door === 'w' ? s.x - s.w / 2 : (bd.door === 'e' ? s.x + s.w / 2 : s.x);
      const px = doorHoriz ? DOOR_W / 2 + 0.08 : 0;
      const pz = doorHoriz ? 0 : DOOR_W / 2 + 0.08;
      boxMesh(trim, 0.14, 2.6, 0.14, doorX - px, 1.3, doorZ - pz, shell);
      boxMesh(trim, 0.14, 2.6, 0.14, doorX + px, 1.3, doorZ + pz, shell);
      boxMesh(trim, DOOR_W + 0.3, 0.14, 0.14, doorX, 2.68, doorZ, shell);

      let hideBelow = WALL_H + 0.01;
      if(!s.two){
        /* อาคาร 1 ชั้น: หลังคาแผ่นเรียบ — กันลูกพลัง/การเดินระดับกลาง แต่เดินใต้ได้ */
        const roof = boxMesh(mats.roof, s.w, ROOF_T, s.d, s.x, WALL_H + ROOF_T / 2, s.z, roofG);
        const rb = collideBox(s.x, WALL_H + ROOF_T / 2, s.z, s.w, ROOF_T, s.d, {ceiling: true, walk: false});
        rb.mesh = roof;
      }else{
        /* อาคาร 2 ชั้น: บันไดเต็มแนวผนังฝั่งตรงข้ามประตู → พื้นชั้นสอง → ผนังชั้นสอง → หลังคา */
        const stair = {n: 's', s: 'n', e: 'w', w: 'e'}[bd.door];
        const stairHoriz = stair === 'n' || stair === 's';
        const SD = 3.2; /* ลึกชานบันได */
        const iw = s.w - 2 * TH, id = s.d - 2 * TH;
        /* แผ่นพื้นชั้นสอง: ปล่อยช่องบันได (walkSlabs + ceiling เดินใต้ได้) */
        let sx0, sz0, sw, sd2;
        if(stairHoriz){
          sw = iw;
          sd2 = id - SD;
          sx0 = s.x;
          sz0 = stair === 'n' ? s.z - s.d / 2 + TH + SD + sd2 / 2 : s.z + s.d / 2 - TH - SD - sd2 / 2;
        }else{
          sw = iw - SD;
          sd2 = id;
          sx0 = stair === 'w' ? s.x - s.w / 2 + TH + SD + sw / 2 : s.x + s.w / 2 - TH - SD - sw / 2;
          sz0 = s.z;
        }
        const slabTop = WALL_H + SLAB_T;
        const slabMesh = boxMesh(mats.slab, sw, SLAB_T, sd2, sx0, WALL_H + SLAB_T / 2, sz0, shell);
        const sb = collideBox(sx0, WALL_H + SLAB_T / 2, sz0, sw, SLAB_T, sd2, {ceiling: true, walk: true});
        sb.mesh = slabMesh;
        arena.walkSlabs.push({minx: sx0 - sw / 2, maxx: sx0 + sw / 2, minz: sz0 - sd2 / 2, maxz: sz0 + sd2 / 2, top: slabTop});
        /* บันได 4 ขั้น เต็มแนว (platform — เดินขึ้นทีละขั้นเหมือนขึ้นลัง) */
        const stepN = 4, stepD = SD / stepN, stepW = stairHoriz ? iw : id;
        for(let i = 1; i <= stepN; i++){
          const top = slabTop * i / stepN;
          let cx, cz;
          if(stairHoriz){
            cx = s.x;
            cz = stair === 'n'
              ? s.z - s.d / 2 + TH + stepD * (i - 0.5)
              : s.z + s.d / 2 - TH - stepD * (i - 0.5);
          }else{
            cz = s.z;
            cx = stair === 'w'
              ? s.x - s.w / 2 + TH + stepD * (i - 0.5)
              : s.x + s.w / 2 - TH - stepD * (i - 0.5);
          }
          const stepMesh = boxMesh(mats.step, stairHoriz ? stepW : stepD, top, stairHoriz ? stepD : stepW, cx, top / 2, cz, perm);
          const pb = {
            minx: cx - (stairHoriz ? stepW : stepD) / 2, maxx: cx + (stairHoriz ? stepW : stepD) / 2,
            miny: 0, maxy: top,
            minz: cz - (stairHoriz ? stepD : stepW) / 2, maxz: cz + (stairHoriz ? stepD : stepW) / 2,
            vault: false, platform: true, breakable: false, broken: false, ceiling: false, walk: false,
            mesh: stepMesh, cx: cx, cy: top / 2, cz: cz,
            w: stairHoriz ? stepW : stepD, h: top, d: stairHoriz ? stepD : stepW
          };
          arena.boxes.push(pb);
        }
        /* ผนังชั้นสอง (ซ้อนแนวเดียวกับชั้นล่าง ประตูไม่เว้นช่อง → เหนือประตูมีช่องระบายสูง) */
        walls(bd, shell, slabTop, UPPER_H, false, mats.wall);
        /* หลังคา */
        const roofTop = slabTop + UPPER_H;
        const roofMesh = boxMesh(mats.roof, s.w, ROOF_T, s.d, s.x, roofTop + ROOF_T / 2, s.z, roofG);
        const roofB = collideBox(s.x, roofTop + ROOF_T / 2, s.z, s.w, ROOF_T, s.d, {ceiling: true, walk: false});
        roofB.mesh = roofMesh;
        hideBelow = roofTop + 0.01;
      }

      this.list.push({
        shell: shell,
        roof: roofG,
        minx: s.x - s.w / 2 + TH, maxx: s.x + s.w / 2 - TH,
        minz: s.z - s.d / 2 + TH, maxz: s.z + s.d / 2 - TH,
        hideBelow: hideBelow
      });
    }
    arena.buildings = this;
    return this;
  };

  /* ซ่อนเฉพาะ "หลังคา" ของอาคารที่ผู้เล่นอยู่ข้างใน (ต่ำกว่าระดับหลังคา) เพื่อให้กล้องเห็นตัวละคร
     ผนัง หน้าต่าง กรอบประตู และพื้นชั้นสองยังคงมองเห็นครบเหมือนยืนอยู่ในบ้านจริง */
  Buildings.prototype.update = function(p){
    if(!p) return;
    const list = this.list;
    for(let i = 0; i < list.length; i++){
      const b = list[i];
      const inside = p.x > b.minx - 0.4 && p.x < b.maxx + 0.4 &&
                     p.z > b.minz - 0.4 && p.z < b.maxz + 0.4 &&
                     (p.y || 0) < b.hideBelow;
      if(b.roof.visible === inside) b.roof.visible = !inside;
    }
  };

  VF.Buildings = Buildings;
  VF._t = VF._t || {};
  VF._t.buildingSpecs = SPECS;
  VF._t.buildingHead = HEAD;
})(typeof window !== 'undefined' ? window : globalThis);
