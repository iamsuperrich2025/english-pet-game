// รอบ 1631 — รวม 8 คลิปแอนิเมชัน Tactical Sentinel เข้า soldier.glb ตัวเดียว (โหนดชื่อตรงกัน คัดลอกเฉพาะแอนิเมชันมาผูกกับโครงกระดูกฐาน)
// ใช้: node tools/build_skirmish_soldier.mjs
import { createRequire } from 'module';
import path from 'path';
// ESM ไม่รู้จัก NODE_PATH → ชี้ require ไปที่ node_modules ของเครื่องมือโดยตรง
const require = createRequire('C:/Users/rober/bin/node/node_modules/@gltf-transform/cli/package.json');
const { NodeIO } = require('@gltf-transform/core');

const SRC = 'minigames/VocabSkirmish/animations';
const OUT = 'minigames/VocabSkirmish/models/soldier.glb';
// [ไฟล์, ชื่อคลิปในเกม] — ต้องมีครบ idle/walk/run/sprint/aim/fire/reload/crouch
const CLIPS = [
  ['Meshy_AI_Tactical_Sentinel_Tightrope_Walk_inplac.glb', 'idle'],
  ['sol1_Walking.glb', 'walk'],
  ['sol1_Running.glb', 'run'],
  ['sol1_Charge_inplace.glb', 'sprint'],
  ['sol1_Walk_Forward_with_Bow.glb', 'aim'],
  ['sol1_Side_Shot.glb', 'fire'],
  ['sol1_Reload_Subtle.glb', 'reload'],
  ['sol1_Crouch_Pull_and_Throw.glb', 'crouch'],
];

const io = new NodeIO();
const base = await io.read(path.join(SRC, CLIPS[0][0]));
const baseNodes = new Map();
base.getRoot().listNodes().forEach(n => baseNodes.set(n.getName(), n));
console.log('base nodes:', baseNodes.size, '| base clip:', CLIPS[0][1]);

for (const [file, name] of CLIPS.slice(1)) {
  const doc = await io.read(path.join(SRC, file));
  const srcAnims = doc.getRoot().listAnimations();
  if (!srcAnims.length) { console.error('!! ไม่มี animation ใน', file); process.exit(1); }
  for (const anim of srcAnims) {
    const copy = base.createAnimation(name);
    for (const ch of anim.listChannels()) {
      const target = ch.getTargetNode();
      if (!target) continue;
      const baseNode = baseNodes.get(target.getName());
      if (!baseNode) { console.error('!! โหนดไม่ตรง:', target.getName(), 'ใน', file); process.exit(1); }
      const srcSampler = ch.getSampler();
      const sampler = base.createAnimationSampler()
        .setInput(base.createAccessor().setArray(srcSampler.getInput().getArray().slice()))
        .setOutput(base.createAccessor().setArray(srcSampler.getOutput().getArray().slice()))
        .setInterpolation(srcSampler.getInterpolation());
      const channel = base.createAnimationChannel()
        .setTargetNode(baseNode).setTargetPath(ch.getTargetPath()).setSampler(sampler);
      copy.addSampler(sampler).addChannel(channel);
    }
  }
  console.log('merged', name, '<-', file, `(${srcAnims.length} clip)`);
}

await io.write(OUT, base);
console.log('✅ wrote', OUT);
