/* Fifteen recycled prop chunks keep decorations nearby; the painted meadow follows the camera every frame. */
(function () {
  'use strict';
  const F = window.Frontline;
  F.buildMap = function (scene, shapes) {
    const size = F.C.chunkSize, root = new THREE.Group(), chunks = [],meadow=F.makeMeadow(),flora=F.makeFlora(root),boundary=F.makeBoundary(scene,shapes);
    scene.add(root);meadow.mount(root);
    function hash(x, z, salt) {
      let n = Math.imul(x + 8191, 374761393) ^ Math.imul(z - 131, 668265263) ^ salt;
      n = Math.imul(n ^ (n >>> 13), 1274126177);
      return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
    }
    function makeChunk(i) {
      const group = new THREE.Group();
      const props = [];
      for (let p = 0; p < 6; p++) {
        const prop = F.makeGarden(shapes,p);
        prop.scale.setScalar(1.2);
        group.add(prop); props.push(prop);
      }
      root.add(group); return { group, props, x: Infinity, z: Infinity, slot: i };
    }
    for (let i = 0; i < 15; i++) chunks.push(makeChunk(i));
    let baseX = Infinity, baseZ = Infinity;
    function assign(chunk, cx, cz) {
      chunk.x = cx; chunk.z = cz; chunk.group.position.set(cx * size, 0, cz * size);
      chunk.props.forEach((prop, i) => {
        const px = (hash(cx, cz, i * 5 + 2) - 0.5) * (size - 4);
        const pz = (hash(cx, cz, i * 5 + 3) - 0.5) * (size - 4);
        prop.position.set(px, 0, pz);
        prop.rotation.y = hash(cx, cz, i * 5 + 4) * Math.PI * 2;
        const wx=cx*size+px,wz=cz*size+pz,roadX=Math.abs(wx-Math.round(wx/36)*36),roadZ=Math.abs(wz-Math.round(wz/36)*36);
        const clearBase=[0,1,2,3].every(slot=>{const b=F.baseSpot(slot);return Math.hypot(wx-b.x,wz-b.z)>5.7;});
        const inside=Math.abs(wx)<F.C.halfX-2.6&&Math.abs(wz)<F.C.halfZ-2.6;
        prop.visible = inside&&roadX>2.4&&roadZ>2.4&&clearBase;
      });
      flora.fill(chunk.slot,cx,cz,hash);
    }
    function update(x, z) {
      meadow.follow(x, z);
      const nx = Math.round(x / size), nz = Math.round(z / size);
      if (nx === baseX && nz === baseZ) return false;
      const wanted = [];
      for (let dz = -1; dz <= 1; dz++) for (let dx = -2; dx <= 2; dx++) wanted.push((nx + dx)+','+(nz + dz));
      const kept = new Set();
      const free = [];
      for (const chunk of chunks) {
        const key = chunk.x+','+chunk.z;
        if (wanted.includes(key)) kept.add(key); else free.push(chunk);
      }
      baseX = nx; baseZ = nz;
      for (let dz = -1; dz <= 1; dz++) for (let dx = -2; dx <= 2; dx++) {
        const cx = nx + dx, cz = nz + dz, key = cx+','+cz;
        if (kept.has(key)) continue;
        assign(free.pop(), cx, cz);
      }
      return true;
    }
    update(0, 0);
    return { update, count: chunks.length, get center() { return { x: baseX, z: baseZ }; },
      dispose() { scene.remove(root);meadow.dispose();flora.dispose();boundary.dispose(); } };
  };
})();
