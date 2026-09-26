"use strict";
/* Maps Lyravyn states to REAL on-disk GLBs. Inspected 2026-09-18.
   9 files, mixamorig 28 bones, same loader path as NEX (one body + clip reuse). */
(function(root){
  const VF = root.VocabForce = root.VocabForce || {};
  const DIR = 'runtime-models/lyravyn/';
  const STATES = {
    idle: {
      file: 'ly_Run.glb',
      clip: 'Running.001',
      loop: true,
      fade: 0.16,
      timeScale: 0.0001,
      note: 'No idle GLB. Short leftover pose from the run file is held as idle.'
    },
    walk: {
      file: 'ly_Run.glb',
      clip: 'Running',
      loop: true,
      fade: 0.12,
      timeScale: 0.72,
      note: 'No walk GLB. Slowed Running clip is the V1 fallback.'
    },
    run: { file: 'ly_Run.glb', clip: 'Running', loop: true, fade: 0.1 },
    sprint: { file: 'ly_Run.glb', clip: 'Running', loop: true, fade: 0.08, timeScale: 1.28 },
    dash: {
      file: 'ly_Run.glb',
      clip: 'Running',
      loop: false,
      fade: 0.04,
      busy: 0.18,
      timeScale: 1.85,
      note: 'No dedicated dash GLB. Fast run clip is the burst fallback.'
    },
    punch: { file: 'ly_Elbow_Strike.glb', clip: 'Elbow_Strike', loop: false, fade: 0.06, busy: 0.5, hitAt: 0.28 },
    kick: { file: 'ly_Roundhouse_Kick.glb', clip: 'Roundhouse_Kick', loop: false, fade: 0.06, busy: 0.62, hitAt: 0.34 },
    jump: { file: 'ly_Jump_with_Arms_Open.glb', clip: 'Jump_with_Arms_Open', loop: false, fade: 0.06 },
    land: { file: 'ly_Dive_Down_and_Land_2.glb', clip: 'Dive_Down_and_Land_2', loop: false, fade: 0.1 },
    vault: { file: 'ly_Dive_Down_and_Land_2.glb', clip: 'Dive_Down_and_Land_2', loop: false, fade: 0.08 },
    victory: { file: 'ly_Backflip_and_Hooks.glb', clip: 'Backflip_and_Hooks', loop: false, fade: 0.12 },
    fall: { file: 'ly_Fall2.glb', clip: 'Fall2', loop: false, fade: 0.06 },
    /* รอบ 1570: ท่ายกค้าง+ขว้างสำหรับ Lyravyn (เดิมไม่มี lift/throw เลย ตอนแบกจะไม่มีท่า)
       ท่ายกค้างใช้ GLB cast จริงที่ผู้ใช้ส่งมา แช่เฟรมกลางคลิปจนกว่าจะกด THROW */
    lift: { file: 'ly_mage_soell_cast.glb', clip: 'mage_soell_cast', loop: true, fade: 0.14, holdAt: 0.45 },
    throw: { file: 'ly_Power_Spin_Jump.glb', clip: '360_Power_Spin_Jump', loop: false, fade: 0.06, busy: 0.6, hitAt: 0.3 },
    /* รอบ 1589: ท่ากระแทกพื้น (ปุ่ม SLAM) — GLB จริงที่ผู้ใช้ส่งมา คลิป Charged_Ground_Slam */
    groundSlam: { file: 'ly_Charged_Ground_Slam.glb', clip: 'Charged_Ground_Slam', loop: false, fade: 0.1, busy: 1.3, hitAt: 0.55 },
    /* รอบ 1592: ท่าล้มเมื่อโดนระเบิดรถน้ำมัน / แนว SLAM / ลูกพลัง ATTACK — GLB จริงที่ผู้ใช้ส่งมา คลิป Knock_Down */
    knockDown: { file: 'ly_Knock_Down.glb', clip: 'Knock_Down', loop: false, fade: 0.08, busy: 1.25 },
    /* รอบ 1593: ท่าปัดพลัง (ปุ่ม DEFLECT) — GLB จริงที่ผู้ใช้ส่งมา คลิป Shield_Push_Left */
    deflect: { file: 'ly_Shield_Push_Left.glb', clip: 'Shield_Push_Left', loop: false, fade: 0.08, busy: 0.75, hitAt: 0.26 }
  };
  Object.keys(STATES).forEach(function(key){
    STATES[key].url = DIR + STATES[key].file;
  });
  VF.LyraManifest = {
    dir: DIR,
    bodyState: 'run',
    states: STATES,
    skeleton: 'mixamorig',
    boneCount: 28,
    files: [
      'ly_Backflip_and_Hooks.glb',
      'ly_Confident_Strut.glb',
      'ly_Dive_Down_and_Land_2.glb',
      'ly_Elbow_Strike.glb',
      'ly_Fall2.glb',
      'ly_Jump_with_Arms_Open.glb',
      'ly_mage_soell_cast.glb',
      'ly_Power_Spin_Jump.glb',
      'ly_Roundhouse_Kick.glb',
      'ly_Run.glb'
    ],
    unusedV1: {
      confidentStrut: 'ly_Confident_Strut.glb exists (style walk) but is not loaded in V1 to avoid an extra 33MB body.'
    },
    missing: {
      idle: 'No idle GLB; held Running.001 pose from ly_Run.glb.',
      walk: 'No walk GLB; slowed Running clip.',
      block: 'No block GLB; block input still works without a clip.',
      heavyKick: 'No second kick GLB; Roundhouse_Kick is the kick.'
    },
    spec: function(state){ return STATES[state] || null; }
  };
  VF._t.lyraManifest = VF.LyraManifest;
})(typeof window !== 'undefined' ? window : globalThis);
