// รอบ 1631 — optimize GLB รบคำแบบไฟล์เดียว: weld(tolerance)→simplify→resample→quantize→prune→webp 1024
// ใช้: node tools/optimize_skirmish_glb.mjs <input.glb> <output.glb> [ratio]
import { createRequire } from 'module';
import path from 'path';
const require = createRequire('C:/Users/rober/bin/node/node_modules/@gltf-transform/cli/package.json');
const { NodeIO } = require('@gltf-transform/core');
const { ALL_EXTENSIONS } = require('@gltf-transform/extensions');
const { weld, simplify, resample, quantize, prune, textureCompress } = require('@gltf-transform/functions');
const { MeshoptSimplifier } = require('meshoptimizer');
const sharp = require('sharp');

const [input, output, ratioArg] = process.argv.slice(2);
const ratio = Number(ratioArg) || 0.25;
const skipSimplify = ratioArg === '0'; // ratio "0" = ข้าม weld+simplify (ใช้กับไฟล์ที่ยุบด้วยมือแล้ว)

const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
await MeshoptSimplifier.ready; // ไม่รอ ready → simplify เงียบหายไม่ทำงาน
const doc = await io.read(input);

const steps = [
  ...(skipSimplify ? [] : [weld({ tolerance: 0.0001 }), simplify({ simplifier: MeshoptSimplifier, ratio, error: 0.01 })]),
  resample({ tolerance: 0.005 }),
  quantize(),
  prune(),
  textureCompress({ encoder: sharp, targetFormat: 'webp', quality: 82, resize: [1024, 1024] }),
];
await doc.transform(...steps);

await io.write(output, doc);

// รายงานผล
const fs = require('fs');
const root = doc.getRoot();
let verts = 0, tris = 0;
for (const m of root.listMeshes()) for (const p of m.listPrimitives()) {
  verts += p.getAttribute('POSITION').getCount();
  if (p.getIndices()) tris += p.getIndices().getCount() / 3;
}
console.log(`✅ ${path.basename(input)} ${(fs.statSync(input).size / 1048576).toFixed(1)}MB → ${path.basename(output)} ${(fs.statSync(output).size / 1048576).toFixed(1)}MB | ${Math.round(verts)} verts ${Math.round(tris)} tris | clips: ${root.listAnimations().map(a => a.getName()).join(',') || '-'}`);
