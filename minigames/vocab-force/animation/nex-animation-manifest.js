"use strict";
/* Maps logical NEX states to REAL on-disk GLB filenames and clip names.
   Do not invent files. Inspected 2026-09-17 from characters/next/animations/.
   All 21 GLBs share mixamorig 28-bone skeleton (Khronos Blender I/O v4.5.51).
   Each file ~28 MB and duplicates mesh + 3 baked textures. Runtime must load
   ONE body GLB and extract clips from the others without adding extra scenes.
   Later Blender work: bake every clip into one NEX GLB (mesh+textures once). */
(function(root){
  const VF = root.VocabForce = root.VocabForce || {};
  const DIR = 'runtime-models/nex/';
  const STATES = {
    idle: {
      file: 'nex_walk.glb',
      clip: 'Walking.001',
      loop: true,
      fade: 0.18,
      note: 'No dedicated idle GLB. Short leftover pose from the body file is held as idle.'
    },
    walk: { file: 'nex_walk.glb', clip: 'Walking', loop: true, fade: 0.12 },
    walkBack: { file: 'nex_Walk_Backward.glb', clip: 'Walk_Backward_with_Sword_inplace', loop: true, fade: 0.12 },
    run: { file: 'nex_Standard_Forward_Char.glb', clip: 'Standard_Forward_Charge_inplace', loop: true, fade: 0.1 },
    sprint: { file: 'nex_Standard_Forward_Char.glb', clip: 'Standard_Forward_Charge_inplace', loop: true, fade: 0.08, timeScale: 1.35 },
    dash: {
      file: 'nex_Standard_Forward_Char.glb',
      clip: 'Standard_Forward_Charge_inplace',
      loop: false,
      fade: 0.04,
      busy: 0.18,
      timeScale: 1.9,
      note: 'No dedicated dash GLB. Fast charge clip is the burst fallback.'
    },
    punch: { file: 'nex_Right_Jab_from_Guard.glb', clip: 'Right_Jab_from_Guard', loop: false, fade: 0.06, busy: 0.46, hitAt: 0.24 },
    kick: { file: 'nex_Step_in_High_Kick.glb', clip: 'Step_in_High_Kick', loop: false, fade: 0.06, busy: 0.62, hitAt: 0.34 },
    heavyKick: { file: 'nex_Sweeping_Kick.glb', clip: 'Sweeping_Kick', loop: false, fade: 0.08, busy: 0.78, hitAt: 0.40 },
    block: { file: 'nex_Block1.glb', clip: 'Block1', loop: true, fade: 0.08 },
    hit: { file: 'nex_Stand_To_Side_Lying.glb', clip: 'Stand_To_Side_Lying', loop: false, fade: 0.05 },
    jump: { file: 'nex_Jump_with_Arms_Open.glb', clip: 'Jump_with_Arms_Open', loop: false, fade: 0.06 },
    land: { file: 'nex_Vault_and_Land.glb', clip: 'Vault_and_Land', loop: false, fade: 0.1 },
    vault: { file: 'nex_Vault_and_Land.glb', clip: 'Vault_and_Land', loop: false, fade: 0.08 },
    climb: { file: 'nex_Climb_Stairs.glb', clip: 'Climb_Stairs', loop: true, fade: 0.12 },
    climbLeft: { file: 'nex_Climb_Left_with_Both_.glb', clip: 'Climb_Left_with_Both_Limbs_inplace', loop: true, fade: 0.12 },
    climbRight: { file: 'nex_Climb_Right_with_Both.glb', clip: 'Climb_Right_with_Both_Limbs_inplace', loop: true, fade: 0.12 },
    climbDown: { file: 'nex_climbing_down_wall.glb', clip: 'climbing_down_wall', loop: true, fade: 0.12 },
    wallFlip: { file: 'nex_Wall_Flip.glb', clip: 'Wall_Flip', loop: false, fade: 0.08 },
    victory: { file: 'nex_victory.glb', clip: 'victory', loop: false, fade: 0.12 },
    getUp: { file: 'nex_Stand_Up5.glb', clip: 'Stand_Up5', loop: false, fade: 0.1 },
    sit: { file: 'nex_Step_to_Sit_Transitio.glb', clip: 'Step_to_Sit_Transition', loop: false, fade: 0.12 },
    guardKick: { file: 'nex_Boxing_Guard_Right_St.glb', clip: 'Boxing_Guard_Right_Straight_Kick', loop: false, fade: 0.08, busy: 0.55, hitAt: 0.3 },
    /* รอบ 1567: ยก-ทุ่มวัตถุ — ไม่มีคลิปเฉพาะในแพ็ก ใช้ climb แช่เฟรมเป็นท่าถือหนัก + หมัดเป็นท่าปล่อยทุ่ม
       รอบ 1570: ผู้ใช้ส่ง GLB ท่า cast จริงมา — แช่เฟรมกลางคลิป (holdAt) ค้างจนกว่าจะกด THROW */
    lift: { file: 'nex_mage_soell_cast.glb', clip: 'mage_soell_cast', loop: true, fade: 0.14, holdAt: 0.45, note: 'User-supplied cast GLB (characters/next/animations/nex_mage_soell_cast.glb); mid-clip frame held as the carry pose.' },
    throw: { file: 'nex_Right_Jab_from_Guard.glb', clip: 'Right_Jab_from_Guard', loop: false, fade: 0.06, busy: 0.5, hitAt: 0.24 },
    tightrope: { file: 'nex_Tightrope_Walk_inplac.glb', clip: 'Tightrope_Walk_inplace', loop: true, fade: 0.15 },
    unsteady: { file: 'nex_Unsteady_Walk.glb', clip: 'Unsteady_Walk', loop: true, fade: 0.12 },
    /* รอบ 1589: ท่ากระแทกพื้น (ปุ่ม SLAM) — GLB จริงที่ผู้ใช้ส่งมา คลิป Charged_Ground_Slam */
    groundSlam: { file: 'nex_Charged_Ground_Slam.glb', clip: 'Charged_Ground_Slam', loop: false, fade: 0.1, busy: 1.3, hitAt: 0.55 },
    /* รอบ 1592: ท่าล้มเมื่อโดนระเบิดรถน้ำมัน / แนว SLAM / ลูกพลัง ATTACK — GLB จริงที่ผู้ใช้ส่งมา คลิป Knock_Down */
    knockDown: { file: 'nex_Knock_Down.glb', clip: 'Knock_Down', loop: false, fade: 0.08, busy: 1.25 },
    /* รอบ 1593: ท่าปัดพลัง (ปุ่ม DEFLECT) — GLB จริงที่ผู้ใช้ส่งมา คลิป Shield_Push_Left */
    deflect: { file: 'nex_Shield_Push_Left.glb', clip: 'Shield_Push_Left', loop: false, fade: 0.08, busy: 0.75, hitAt: 0.26 }
  };
  Object.keys(STATES).forEach(function(key){
    STATES[key].url = DIR + STATES[key].file;
  });
  VF.NexManifest = {
    dir: DIR,
    bodyState: 'walk',
    states: STATES,
    skeleton: 'mixamorig',
    boneCount: 28,
    v1Core: ['idle', 'walk', 'run', 'sprint', 'dash', 'punch', 'kick', 'block', 'jump'],
    v1Optional: ['vault', 'jump', 'land', 'heavyKick', 'victory'],
    later: ['climb', 'climbLeft', 'climbRight', 'climbDown', 'wallFlip', 'hit', 'getUp'],
    unusedV1: {
      hopJump: 'nex_Hop_with_Arms_Raised.glb stays on disk; V1 jump uses Jump_with_Arms_Open.'
    },
    missing: {
      idle: 'No idle GLB on disk; held Walking.001 pose.',
      fall: 'No fall GLB; airborne uses Jump_with_Arms_Open/vault or last locomotion.',
      dodge: 'No dedicated dash GLB; dash uses Standard_Forward_Charge_inplace at high timeScale.',
      fly: 'No fly GLB; reserved for a later movement pass.'
    },
    urlFor: function(state){
      const spec = STATES[state];
      return spec ? spec.url : null;
    },
    spec: function(state){ return STATES[state] || null; }
  };
  VF._t.manifest = VF.NexManifest;
})(typeof window !== 'undefined' ? window : globalThis);
