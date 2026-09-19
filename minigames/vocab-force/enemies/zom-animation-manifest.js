"use strict";
/* Maps zombie states to REAL on-disk GLBs. Inspected 2026-09-17.
   Only three files exist. All share mixamorig 28-bone skeleton. */
(function(root){
  const VF = root.VocabForce = root.VocabForce || {};
  const DIR = 'runtime-models/zom/';
  const STATES = {
    walk: {
      file: 'zom_Elderly_Shaky_Walk_in.glb',
      clip: 'Elderly_Shaky_Walk_inplace',
      loop: true,
      fade: 0.14
    },
    idle: {
      file: 'zom_Elderly_Shaky_Walk_in.glb',
      clip: 'Elderly_Shaky_Walk_inplace.001',
      loop: true,
      fade: 0.16,
      timeScale: 0.0001,
      note: 'No idle GLB. Short leftover pose from the walk file is held as idle.'
    },
    scream: {
      file: 'zom_Scream.glb',
      clip: 'Zombie_Scream',
      loop: false,
      fade: 0.08,
      busy: 1.35
    },
    fall: {
      file: 'zom_Fall3.glb',
      clip: 'Fall3',
      loop: false,
      fade: 0.04,
      busy: 1.38
    }
  };
  Object.keys(STATES).forEach(function(key){
    STATES[key].url = DIR + STATES[key].file;
  });
  VF.ZomManifest = {
    dir: DIR,
    bodyState: 'walk',
    states: STATES,
    skeleton: 'mixamorig',
    boneCount: 28,
    files: ['zom_Elderly_Shaky_Walk_in.glb', 'zom_Scream.glb', 'zom_Fall3.glb'],
    missing: {
      idle: 'No idle GLB; held Elderly_Shaky_Walk_inplace.001 pose.',
      hit: 'No hit GLB; live hits use procedural recoil + knockback.',
      attack: 'No attack GLB; scream is aggro/intimidate only.'
    },
    spec: function(state){ return STATES[state] || null; }
  };
  VF._t.zomManifest = VF.ZomManifest;
})(typeof window !== 'undefined' ? window : globalThis);
