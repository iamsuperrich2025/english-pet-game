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
    fall: { file: 'ly_Fall2.glb', clip: 'Fall2', loop: false, fade: 0.06 }
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
      'ly_Power_Spin_Jump.glb',
      'ly_Roundhouse_Kick.glb',
      'ly_Run.glb'
    ],
    unusedV1: {
      confidentStrut: 'ly_Confident_Strut.glb exists (style walk) but is not loaded in V1 to avoid an extra 33MB body.',
      powerSpinJump: 'ly_Power_Spin_Jump.glb stays on disk; V1 jump uses Jump_with_Arms_Open.'
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
