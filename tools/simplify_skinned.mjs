// รอบ 1631 — ยุบเมชตัวละคร (skinned) ด้วย meshoptimizer ตรง ๆ ทดแทน gltf-transform simplify ที่ข้าม skinned mesh
// ทำ: ตัด TANGENT → weld ตำแหน่ง (spatial hash) → simplify index → compact attributes ทุกตัวตาม remap
// ใช้: node tools/simplify_skinned.mjs <input.glb> <output.glb> [ratio] [error]
import { createRequire } from 'module';
import fs from 'fs';
const require = createRequire('C:/Users/rober/bin/node/node_modules/@gltf-transform/cli/package.json');
const { NodeIO } = require('@gltf-transform/core');
const { ALL_EXTENSIONS } = require('@gltf-transform/extensions');
const { MeshoptSimplifier } = require('meshoptimizer');
const { prune } = require('@gltf-transform/functions');

const [input, output, ratioArg, errorArg] = process.argv.slice(2);
const ratio = Number(ratioArg) || 0.3;
const error = Number(errorArg) || 0.01;

await MeshoptSimplifier.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const doc = await io.read(input);

for (const mesh of doc.getRoot().listMeshes()) {
  for (const prim of mesh.listPrimitives()) {
    // 1) ตัด TANGENT — three.js คำนวณ tangent ฝั่ง shader เองได้ (normal map ยังทำงาน)
    if (prim.getAttribute('TANGENT')) prim.setAttribute('TANGENT', null);

    const posAcc = prim.getAttribute('POSITION');
    const pos = posAcc.getArray();           // Float32Array
    const idx = prim.getIndices().getArray(); // Uint32Array
    const vertCount = posAcc.getCount();

    // 2) weld ตำแหน่ง: hash ตาราง 1e-4 → canonical id
    const keyOf = (i) => `${Math.round(pos[i * 3] * 10000)},${Math.round(pos[i * 3 + 1] * 10000)},${Math.round(pos[i * 3 + 2] * 10000)}`;
    const remap = new Uint32Array(vertCount);
    const canonList = [];
    const keyMap = new Map();
    for (let i = 0; i < vertCount; i++) {
      const k = keyOf(i);
      let c = keyMap.get(k);
      if (c === undefined) { c = canonList.length; keyMap.set(k, c); canonList.push(i); }
      remap[i] = c;
    }
    const weldedIdx = new Uint32Array(idx.length);
    for (let i = 0; i < idx.length; i++) weldedIdx[i] = remap[idx[i]];

    // 3) simplify บน index ที่ weld แล้ว (canonical positions)
    const canonPos = new Float32Array(canonList.length * 3);
    canonList.forEach((src, c) => { canonPos[c * 3] = pos[src * 3]; canonPos[c * 3 + 1] = pos[src * 3 + 1]; canonPos[c * 3 + 2] = pos[src * 3 + 2]; });
    const targetIdx = Math.floor((idx.length / 3) * ratio) * 3;
    const [newIdx] = MeshoptSimplifier.simplify(weldedIdx, canonPos, 3, targetIdx, error, []);

    // 4) compact: เฉพาะ canonical ที่ยังถูกใช้
    const used = new Map();
    for (let i = 0; i < newIdx.length; i++) { if (!used.has(newIdx[i])) used.set(newIdx[i], used.size); }
    const finalIdx = new Uint32Array(newIdx.length);
    for (let i = 0; i < newIdx.length; i++) finalIdx[i] = used.get(newIdx[i]);

    // เขียน index กลับ
    prim.setIndices(doc.createAccessor().setType('SCALAR').setArray(finalIdx));

    // 5) ตัด attributes ทุกตัวตาม used remap (canonical→final)
    const canonToFinal = new Uint32Array(canonList.length);
    used.forEach((f, c) => { canonToFinal[c] = f; });
    const keepRows = (acc) => {
      const arr = acc.getArray();
      const comps = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4 }[acc.getType()];
      const out = new arr.constructor(used.size * comps);
      used.forEach((f, c) => {
        const srcRow = canonList[c];
        for (let k = 0; k < comps; k++) out[f * comps + k] = arr[srcRow * comps + k];
      });
      return doc.createAccessor().setType(acc.getType()).setArray(out).setNormalized(acc.getNormalized());
    };
    for (const sem of prim.listSemantics()) prim.setAttribute(sem, keepRows(prim.getAttribute(sem)));

    console.log(`mesh "${mesh.getName()}" ${vertCount} → ${used.size} verts (${(used.size / vertCount * 100).toFixed(0)}%), ${idx.length / 3} → ${finalIdx.length / 3} tris`);
  }
}

await doc.transform(prune());
await io.write(output, doc);
console.log(`✅ ${(fs.statSync(input).size / 1048576).toFixed(1)}MB → ${(fs.statSync(output).size / 1048576).toFixed(1)}MB`);
