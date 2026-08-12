# CODE_MAP.md — แผนที่โค้ด:บรรทัด (เจนอัตโนมัติโดย `tools/gen_code_map.py` — **ห้ามแก้มือ** เดี๋ยวโดนเขียนทับ)

> วิธีใช้: หาชื่อฟังก์ชัน/ค่าคงที่/selector ในไฟล์นี้ (Grep หรือกวาดตา) → `Read` ไฟล์จริง `offset=<บรรทัด>` `limit=40`
> 🗂️ ไฟล์อ้วนมี **สารบัญโซน** (`st-end ชื่อโซน`) — งานทั้งระบบ/โลก 3D: Grep ชื่อโซน → Read/Edit เฉพาะช่วงนั้น **ห้ามอ่านทั้งไฟล์** · เพิ่มระบบใหม่ในไฟล์อ้วนต้องครอบ banner `/* ==== */`+ชื่อโซน (สารบัญเจนเอง)
> css = index `selector:บรรทัดทุกจุดที่ประกาศ` (บั๊ก UI เริ่มหาที่นี่) · เจนใหม่ทุกครั้งที่รัน `python tools/rotate_handoff.py` · อัปเดต: 2026-08-12

## js/account-deletion.js (235 บรรทัด · 0 รายการ)

## js/adv3d_css.js (1,272 บรรทัด · 0 รายการ)

## js/adv3d_intro.js (86 บรรทัด · 0 รายการ)

## js/adv3d_tex.js (245 บรรทัด · 19 รายการ)
TILE_COLORS:9 · letterTexture:10 · letterTextureDark:27 · emojiTexture:40 · GHOST_IMG_MAX:52 · measureGhostBox:58
probeGhostImages:71 · whenGhostsReady:83 · ghostTexture:87 · ghostScareSrc:92 · AD_STYLES:100 · adBoardTexture:109
addAdBillboard:156 · ringAds:167 · BUILDING_TINTS:177 · FACADE_ROWS:179 · buildingFacadeTexture:180 · makePeerSprite:205
bind:241

## js/adventure3d.js (13,229 บรรทัด · 640 รายการ)
### 🗂️ สารบัญโซน js/adventure3d.js (Read/Edit เฉพาะช่วง)
- 1-217 adventure3d.js — โลก 3D First-person 2 โหมด (คิว 7725691507 ข้อ 8 + ต่อยอด)
- 218-316 ⚽ โหมดสนามฟุตบอล (โหมด soccer · รอบ 196) — เล็ง+ชาร์จพลังเตะบอลใส่ป้ายตัวอักษร
- 317-371 🤖 โหมดหุ่นยนต์นักรบ (โหมด mecha · รอบ 199) — มุมมองในหุ่นสูง 5m เดินยิงเอเลี่ยนตัวอักษร
- 372-514 📻 หอบังคับการบิน (รอบ 64 · รอบ 66 เปลี่ยนเป็นอังกฤษล้วนตามผู้ใช้สั่ง)
- 515-553 คำศัพท์ — ตามระดับชั้น + ไม่ซ้ำคำที่ประกอบแล้ว (8.1/8.6) · แยกคลังต่อโหมด
- 554-689 Texture ตัวอักษร / emoji / ป้ายชื่อผู้เล่น (canvas → sprite)
- 690-907 🧱 ตัวละครบล็อก (โลกขับรถ) — เลือกก่อนออกรถ · เพื่อนใน map เห็นเป็นหุ่นบล็อกขับรถบล็อก
- 908-1215 🚙 รอบ 393: รถเพื่อนในโลกขับรถ = โมเดลจริง img/models/car_01.glb (ผู้ใช้สั่ง)
- 1216-1368 สร้างฉาก static ครั้งเดียวต่อโหมด
- 1369-1715 🚗 เมืองกำแพงเพชรจริง (โหมด drive) — ข้อมูล OpenStreetMap ใน js/data/city_kpp.js
- 1716-1782 🧭🕳️ รอบ 782 — ปิดช่องขาดของกริดถนน (ผู้ใช้: "GPS พาไปช่วงที่ถนนขาดตอน / ขับต่อไม่ได้")
- 1783-1989 🌉 รอบ 788 — ปูถนนเชื่อม "เกาะถนนโดดเดี่ยว" เข้าโครงข่ายหลัก
- 1990-2047 🌳🚁 รอบ 811: จุด "พื้นที่สีเขียวข้างถนน" (greenPts) — สุ่มออกจากจุดบนถนนแต่ละจุด
- 2048-2099 🚁🌳 รอบ 816 — บินเฮลิคอปเตอร์เหนือ "เมืองกำแพงเพชร" แล้วลงจอดเก็บตัวอักษรบนพื้นที่สีเขียว
- 2100-2116 🌅 ท้องฟ้าภาพจริง (รอบ 203) — ใส่ภาพ panorama 360° (equirectangular 2:1) เป็นฉากหลังท้องฟ้า
- 2117-2159 🧱 เทกซ์เจอร์ภาพจริง (รอบ 323) — วางไฟล์ `img/tex/<key>.jpg` (หรือ .png) แล้วแปะทับพื้นผิวทันที
- 2160-2659 🌌 ท้องฟ้ากลางคืนโรงแรมผีสิง (รอบ 694) — ผู้ใช้: "ข้างนอกโรงแรมยังไม่น่ากลัวพอ"
- 2660-2698 🏨 โรงแรมผีสิง (รอบ 684) — ตัวตึก 5 ชั้นสร้างใน js/hotel3d.js
- 2699-2797 ตัวอักษรในโลก (8.2)
- 2798-2914 🔤 ภารกิจโรงแรม 4 คำ — ทุกห้องตั้งแต่ชั้น 2 มีตัวอักษร 1 ตัว
- 2915-2957 🌳🪙 รอบ 811: ความหนาแน่นเสริมเฉพาะโหมดขับรถ — ผู้ใช้: "เพิ่มตัวอักษรและเหรียญบนถนนและ
- 2958-3057 🔠🪙 เก็บตัวอักษร 1 ตัว = ได้ 1 เหรียญ (รอบ 345)
- 3058-3123 ประกอบคำอัตโนมัติเมื่อมีตัวอักษรครบ (8.1/8.4)
- 3124-3218 โหมด adv: monsters ยิงสู้ได้ (สเปกเดิม 8.5)
- 3219-3376 👻 รอบใหม่ — PNG-only ghost chase + client-side shader cosmetics
- 3377-3401 🏨 ระบบโรงแรมผีสิง — ห้องไม่ซ้ำ 5→ดับ, 10→ติด, 13→ดับอีกครั้ง
- 3402-3486 🏨 HAUNTED HOTEL CANONICAL RUNTIME BOUNDARY — Phase 2 รอบ 1084
- 3487-3940 🔤🧭 รอบ 1086 — HAUNTED HOTEL PHASE 4
- 3941-4174 เสียงหลอนโหมดผีสิง — สังเคราะห์ Web Audio (ปลอดลิขสิทธิ์ 100%)
- 4175-4326 🔊 รอบ 1071 — เสียงโรงแรมจากไฟล์จริง + ฝีเท้าแยกทุกตัวละคร
- 4327-4676 Multiplayer — ผู้เล่นอื่นใน map เดียวกัน (สไตล์ Roblox)
- 4677-4884 Voice chat ใน map — WebRTC P2P mesh (เสียงวิ่งตรงระหว่างเครื่อง)
- 4885-4965 🏁 พิธีประกาศแชมป์ (ครูกด "จบรอบแข่ง") — /class/<map>/podium
- 4966-5177 HUD
- 5178-5840 DOM overlay + CSS (สร้างครั้งเดียว — self-contained ไม่แตะ style.css)
- 5841-5976 Input — เมาส์+คีย์บอร์ด และจอสัมผัส (มือถือ landscape)
- 5977-5981 🚁 โหมดเฮลิคอปเตอร์ Bell — ฟิสิกส์บินแบบอาร์เคด (สไตล์ Helicopter Flight Pilot)
- 5982-6374 🛸 โดรน FPV (โหมด drone) — บินเร็ว/คล่อง ลอดหน้าต่างเข้าตึกร้าง เก็บตัวอักษรในห้อง
- 6375-6497 🚗 โหมดขับรถเมืองกำแพงเพชร — ฟิสิกส์รถอาร์เคด (bicycle model)
- 6498-6591 🚦 รอบ 133: ไฟจราจรจริงที่ทางแยกใหญ่ + ฝ่าไฟแดงโดนใบสั่ง ม.22
- 6592-7039 🧭 GPS นำทาง (โหมด drive) — เลือกตัวอักษรเป้าหมาย + เส้นทางตามถนนจริง (A*) · นำทางด้วยภาพล้วน (ไม่มีเสียงพูด ตั
- 7040-7098 🎛️ เข็มหน้าปัดวิ่งจริง (สปีด 0-180 + วัดรอบ 0-8×1000) — วาดทับวงเกจของภาพ dash.png
- 7099-7183 🎵 รอบ 181: วิทยุในรถ — จอ head-unit กลางคอนโซล (visualizer + เลือกเพลง 3 โหมด)
- 7184-7227 🪞📷 รอบ 810: กระจกมองหลัง/ข้าง — เรนเดอร์ฉากเดิมซ้ำด้วยกล้องหันหลัง/เฉียงข้าง แล้วยัดลงกรอบบนจอ (scissor)
- 7228-7311 🪞🧑‍🤝‍🧑 รอบ 973: เพื่อนที่ขับตามมา "เห็นในกระจกมองหลัง" + ป้ายชื่อลอยเหนือรถเขา
- 7312-7439 🪆 รอบ 191: ตุ๊กตาดุ๊กดิ๊กหน้ารถ — รูปตัวละครที่ผู้เล่นเลือก (blkN.png)
- 7440-7743 🚔 รอบ 128: แผงเตรียมออกรถ + กฎหมายจราจร + ใบสั่ง
- 7744-7786 🛩️📦 ภารกิจไปรษณีย์กลางคืน (รอบ 353) — เฉพาะช่วงฟ้ามืด (heliNight>.5)
- 7787-9001 🚶🛗🚁🪂 โหมดเดินเท้าในเมืองเฮลิฯ (รอบ 354 — ผู้ใช้สั่ง)
- 9002-9075 🎛️ หน้าปัดเข็มขยับจริง (รอบ 61) — วาดสดทุกเฟรมจากค่าการบินจริง
- 9076-9347 🌧️☀️ ชั้นบนกระจก: ที่ปัดน้ำฝน + แสงแดดสาด (รอบ 346)
- 9348-9752 🔊🌧️ เสียงที่ปัดน้ำฝน (รอบ 537) — สังเคราะห์ล้วน ไม่มีไฟล์เสียง
- 9753-9822 📹 กล้องใต้ท้องเครื่อง (belly cam) — รอบ 348
- 9823-9894 🎯 วงเป้าลงจอด (รอบ 349) — ไฮไลต์ดาดฟ้าที่มีตัวอักษร ให้รู้ว่าควรร่อนลงตรงไหน
- 9895-10510 📏 แถบเตือนความเร็วดิ่ง (รอบ 349) — ลงเร็วเกินกรอบกล้องกะพริบแดง สอนให้ร่อนลงนุ่มๆ
- 10511-10513 Loop หลัก
- 10514-12141 ⚽ โหมดสนามฟุตบอล — ฟิสิกส์บอล + เล็ง + ชาร์จพลัง + กล้อง 1st/3rd + ชุดนักเตะ
- 12142-12597 🤖 โหมดหุ่นยนต์นักรบ — เดินยิงเอเลี่ยนตัวอักษร (ต้องยิงเรียงลำดับในคำ)
- 12598-12619 เข้า/ออกโลก
- 12620-13229 ❓ การ์ด "วิธีเล่น" ตอนเข้าโลกครั้งแรก (จำแยกต่อโลกใน localStorage — ไม่แตะ state.js)
### รายการ js/adventure3d.js
GUIDE_WORDS:19 · LETTER_RESPAWN_MS:20 · HALF:21 · PLAYER_SPEED:22 · HAUNT_ATTACKS:23 · HAUNT_IFRAME:24
PICK_DIST:25 · EYE_H:26 · NET_SEND_MS:27 · MODES:30 · SHOOT_GAP_MS:94 · MONSTER_REWARD:95
AD_COUNT:96 · AD_RENT_COIN:97 · AD_RENT_MS:98 · SHOP_ADS:102 · PILOT_TIERS:104 · pilotEmoji:105
DRONE_R:117 · DRONE_ACCEL:118 · DRONE_VMAX:119 · DRONE_CLIMB:120 · DRONE_YAWSP:121 · DRONE_GRAV:122
CAR_EYE:126 · CAR_ACCEL:127 · CAR_BRAKE:128 · CAR_VMAX:129 · CAR_LEGAL_KMH:130 · CAR_FINE_SPEED:131
CAR_FINE_BELT:132 · CAR_REPAIR_FEE:133 · CAR_FINE_SIGNAL:134 · CAR_RAM_FEE:135 · CAR_FINE_RED:136 · CAR_VMAX_OFF:137
CAR_VREV:138 · CAR_WB:139 · CAR_STEER_MAX:140 · HELI_SKID:175 · HELI_CRASH_FINE:176 · HELI_MESH_SCALE:177
ASSIST_R:181 · PROP_STALL_MS:186 · PROP_BREAK_SPD:189 · PROP_BROKEN_MUL:190 · BAT_DRAIN:193 · BAT_LETTER:194
BAT_LOW:195 · BAT_EMPTY_MUL:196 · CHG_R:199 · GATE_R:202 · showHeliSkip:209 · BOLT_MIN:210
GLASS_HIT_R:211 · DOOR_R:212 · SOCCER_SHIRTS:222 · SOCCER_SHORTS:231 · SOCCER_PATTERNS:236 · BALL_R:255
GOAL_HW:256 · KICK_SPD_MIN:257 · AIM_YAW_SP:258 · SOCCER_TILES:259 · AIM_STICK:267 · CURL_SWIPE:270
CURL_SPIN:271 · HIT_LIFT:275 · GUIDE_N:276 · FK_SPOT_Z:282 · FK_MAN_R:283 · AURA_COST:291
FIRE_CHG:294 · SB_DRAG:302 · SPOST_R:303 · GK_Z:308 · GK_SPRITES:309 · PK_TIME:311
MECHA_EYE:321 · ALIEN_COUNT:322 · MECHA_MAX_HP:323 · MECHA_ATK_RANGE:324 · ALIEN_SHOT_SPD:325 · POWERUP_GAP:326
BOSS_SCALE:327 · COMBO_X2:328 · BOSS_SPECIES:331 · pickBossSpecies:339 · WAVE_BASE_GOAL:341 · waveCfg:342
MECHA_WEAPONS:351 · ATC_REPLIES:380 · ATC_CLOSERS:385 · ATC:390 · netUp:508 · CHAT_MAX:511
doneList:518 · wordPool:519 · pickWords:532 · hotelCreateWordSet:538 · adRenterActive:561 · FACADE_ROWS:568
adsFetch:574 · adsWatch:586 · adsStop:593 · adsChanged:594 · adRentBuy:605 · heliMusicTick:628
AD_FLYBY_COIN:632 · adFlybyTick:634 · adShopOpen:653 · adShopRender:667 · BLOCK_AVATARS:696 · blkGeo:707
blkMat:708 · blkCyl:709 · blkFaceMat:711 · makeBlockFigure:726 · makeBlockCar:766 · blkNameSprite:812
makeBlockPeer:828 · makeBlockWalkPeer:849 · disposeBlockPeer:857 · mechGlowMat:864 · makeMechaFigure:865 · makeMechaPeer:895
CAR_GLB_URL:915 · CAR_GLB_LEN:916 · carSplitWheel:920 · carGlbEnsure:947 · carMatGet:966 · carGlbBuild:982
carAvCode:1031 · driveCamToggle:1038 · SKID_N:1057 · skidGeomGet:1059 · skidDrop:1064 · skidTick:1078
blkBuildThumbs:1088 · blkBuildPicker:1107 · pickBlockAvatar:1152 · bubbleSprite:1175 · showPeerBubble:1202 · removePeerBubble:1210
concreteTexture:1220 · brokenWindowTexture:1237 · intactGlassTexture:1253 · chargeIconTexture:1271 · rustyDoorTexture:1280 · dAddBox:1294
buildAbandoned:1301 · makeNameSprite:1374 · flatGeom:1387 · flatGeomUV:1396 · buildDriveCity:1406 · HELI_BODY_R:2060
HELI_KPP_CEIL:2061 · heliKppBlocked:2063 · heliKppSpawn:2084 · SKY_IMG:2107 · applySky:2108 · applyTex:2124
HSKY_R:2174 · hskyTex:2176 · buildHauntSky:2181 · tickHauntSky:2311 · buildScene:2329 · randPos:2702
randRoadPos:2710 · randGreenPos:2728 · HOTEL_PER_ROOM:2750 · HOTEL_MIN_GAP:2751 · hotelSpot:2752 · hotelPruneLetters:2788
HOTEL_QUEST_WORDS:2802 · HOTEL_FLOOR:2803 · HOTEL_SEARCH_FLOORS:2804 · hotelQuestReset:2807 · hotelClearQuestLetters:2812 · hotelQuestWordLetters:2816
hotelStartQuestWord:2820 · hotelFinalHint:2827 · hotelRevealFinal:2834 · spawnLetter:2841 · spawnLettersForWord:2893 · ensureCoverage:2895
DRIVE_LETTER_COPIES:2921 · DRIVE_BONUS_COINS:2922 · ensureDriveAmbience:2923 · removeLetter:2936 · spawnLetterAt:2944 · tickLetterRespawns:2952
LETTER_COIN:2963 · BONUS_COIN_VAL:2964 · pickUpLetter:2965 · hotelApplyCanonicalOrdinal:3002 · letterPop:3022 · letterChime:3041
tryCompleteWords:3061 · rewardCompletedWord:3076 · completeWord:3091 · spawnMonster:3127 · killMonster:3136 · tickMonsters:3144
damagePlayer:3166 · shoot:3182 · tickShots:3196 · GHOST_IMAGE_URL:3224 · makeGhostSprite:3226 · hotelGhostPlayers:3229
hotelTurnScare:3239 · spawnGhost:3254 · tickGhosts:3275 · sessionRecapHtml:3292 · hauntRunSec:3299 · fmtSurv:3300
hauntSurviveFinish:3301 · tickSurvive:3311 · renderHearts:3324 · hotelGhostAttack:3329 · hotelGameOver:3344 · hotelScare:3358
knockedOut:3370 · DARK_LETTER:3399 · tintSprite:3400 · HOTEL_LIGHT_NORMAL:3408 · hotelGlobalLightLevel:3410 · hotelApplyCanonicalMask:3416
hotelApplyCanonicalPhase:3423 · hotelApplyCanonicalState:3446 · hotelCurrentSearchObjective:3491 · hotelSearchContext:3505 · hotelApplyObjectiveProximity:3509 · hotelProximityCue:3517
hotelShowCriticalHint:3522 · hotelHideCriticalHint:3532 · hotelImportantHint:3537 · hotelDirectorContext:3542 · hotelDirectorLightPulse:3553 · hotelDirectorPortraitShift:3569
hotelDirectorScare:3578 · hotelRuntimeInit:3594 · hotelReset:3636 · setTorch:3662 · toggleTorch:3678 · tickTorch:3683
disposeHotelTorch:3691 · hotelBlackout:3703 · hotelApplyLightingState:3706 · hotelLightsOn:3736 · hotelStartFlicker:3740 · tickHotelPlayer:3748
tickHotelWorld:3826 · hotelAct:3874 · openWardrobe:3891 · announceTarget:3920 · hotelFinishRound:3927 · netReady:4332
netJoin:4338 · sendPos:4359 · netHonk:4409 · sendChat:4415 · toggleChatBox:4429 · onPeerData:4440
disposeHeliMesh:4530 · removePeer:4535 · netLeave:4551 · tickPeers:4557 · RTC_CFG:4685 · tinvLinked:4686
partyWord:4693 · syncPartyWord:4709 · updateVoiceBtns:4866 · PODIUM_BONUS:4891 · podiumJoin:4893 · podiumLeave:4904
endRound:4905 · showPodium:4916 · tinvCheck:4957 · showBanner:4970 · renderHudTop:4976 · renderHudWords:4986
renderHudInv:4996 · ddTierFromName:5003 · renderBoard:5005 · drawBigMap:5042 · openBigMap:5097 · closeBigMap:5105
drawMinimap:5110 · loadCarDash:5183 · loadCarWheel:5195 · buildDom:5205 · confirmExit:5825 · IS_TOUCH:5844
HAS_KBD:5846 · bindInput:5847 · movePlayer:5942 · tickPlayer:5952 · collideDrone:5985 · propStall:6004
propBreak:6011 · propFix:6018 · droneBatAdd:6025 · lightningBolt:6028 · startRain:6039 · stopRain:6053
smashGlass:6055 · awardGlass:6066 · neededLetter:6083 · openDoor:6098 · raceStartRun:6118 · raceStop:6125
gateHighlight:6143 · renderRaceHud:6150 · tickDrone:6159 · nearMissTick:6302 · showNearMiss:6326 · awardDaredevil:6337
comboCheer:6354 · comboFlash:6370 · driveCell:6379 · nearestStreet:6385 · collideCar:6395 · tlDotY:6426
tlSet:6430 · driveArms:6447 · tlTick:6459 · TL_GREEN:6503 · tlRedDur:6505 · tlightPhase:6506
buildTrafficLights:6513 · rlTick:6565 · cellDrivable:6597 · cellWeight:6600 · cellBlocked:6605 · cellCenter:6606
posReachable:6608 · losClear:6619 · nearestDrivableCell:6630 · routeGrid:6642 · pickGpsTarget:6695 · NAVLINE_W:6718
NAVLINE_SKIP:6719 · navLineEnsure:6720 · navLineHide:6730 · navLineUpdate:6731 · tickGps:6767 · tickDrive:6838
drawCarDial:7046 · drawCarGauges:7076 · RADIO_RECT:7104 · CAR_RADIO_RECT:7106 · carRadioRect:7112 · radioLayout:7114
radioSetHint:7137 · renderRadioList:7143 · radioToggleList:7153 · drawRadioViz:7158 · radioTick:7176 · MIRROR_REAR:7190
mirrorRearRect:7193 · mirrorPass:7195 · toggleMirrorMini:7208 · drawCarMirrors:7215 · MTAG_MAX_D:7237 · mirrorTagsHide:7241
mirrorTagName:7242 · mirrorTagsTick:7243 · BOBBLE_FOOT:7317 · BOBBLE_H:7318 · BOBBLE_ASPECT:7319 · BOB_OMEGA:7322
BOB_PITCH_FORCE:7324 · BOBBLE_SKINS:7326 · bobbleSetAvatar:7333 · bobbleLayout:7340 · bobbleTick:7353 · bobblePoke:7378
bobbleApplySkin:7395 · dollOwned:7405 · openDollPicker:7406 · carStartShow:7443 · showLawInfo:7461 · lawNotice:7483
driveFineSettle:7493 · HELI_PHASES:7672 · heliStartPhase:7679 · heliFloorAt:7686 · SOFT_TIERS:7696 · softLandBonus:7698
awardPerfLand:7711 · setHeliLight:7730 · MAIL_COIN:7749 · mailStart:7751 · mailStop:7774 · mailTick:7775
FOOT_EYE:7794 · doorSlideSfx:7800 · doorLerp:7823 · entLerp:7831 · footStepSfx:7841 · WRING_COIN:7862
festivalPaint:7866 · dustTexture:7878 · dustBurst:7887 · dustTick:7901 · HELI_GLB_URL:7922 · HELI_GLB_TEX_BLUE:7924
HELI_GLB_ROTOR:7926 · HELI_GLB_TROTOR:7927 · heliGlbEnsure:7929 · heliMatBlueGet:7947 · heliGlbAssemble:7960 · heliNavTick:7999
peerRotorStop:8006 · peerRotorTick:8012 · heliCrashSfx:8031 · heliMeshBuild:8059 · heliMeshBuildLegacy:8070 · buildHeliFoot:8200
footFloorAt:8316 · insideTerm:8323 · inDoorZone:8324 · footHint:8328 · setFootBtns:8329 · liftStart:8334
beginRide:8345 · endRide:8368 · beginWing:8379 · awardAirLetter:8392 · paxChoiceShow:8411 · paxChoiceHide:8437
pilotShipMesh:8441 · beginPilot:8442 · endPilot:8474 · drawCabinWindow:8498 · tickHeliFoot:8522 · heliWallPenalty:8733
tickHeli:8745 · CP_NAT:9010 · CP_GAUGES:9011 · SEAT_LABEL:9024 · SEAT_P_FULL:9025 · SEAT_ZOOM:9026
DASH_OFF_Y:9027 · DASH_DROP:9028 · setSeat:9030 · layoutCockpit:9042 · WIPER:9081 · WIPER_SPD:9084
WIPER_LABEL:9085 · INT_GAP:9086 · WASH_MS:9090 · WASH_TANK_MAX:9094 · SMEAR_LIFE:9106 · CHOP_MIN:9107
SUN_RAY_FAR:9111 · sunRayBlocked:9113 · sunShadeTick:9132 · applyCockpitShade:9143 · rotorChop:9155 · sunUpdate:9163
HELI_FOG_N0:9174 · fogUpdate:9178 · adGlowPulse:9226 · RAIN_MAX:9235 · VISOR_Y:9236 · RAIN_MIN:9237
RAIN_DUR:9238 · DROP_ZONE:9242 · addDrop:9243 · tickDrops:9251 · addWashDrop:9269 · washStart:9276
renderWashGauge:9296 · washTick:9307 · grimeTick:9324 · WIPE_R:9331 · wipeDrops:9332 · wiperSndOn:9355
wiperSndOff:9367 · wiperThunk:9373 · washSpraySfx:9385 · wiperSqueak:9402 · wiperSndTick:9419 · setWiper:9439
tickWiper:9451 · SH_SWEEP:9482 · shadowSweepTick:9484 · REFL_MAX:9496 · REFL_COL:9498 · cityGlowLevel:9499
drawCityGlow:9504 · setVisor:9536 · rainTick:9542 · drawBlade:9559 · drawSmears:9578 · drawGlass:9598
drawBellyCam:9760 · drawBellyHud:9783 · drawLandingTargets:9829 · VS_HARD:9899 · drawDescentBar:9900 · heliShake:9949
cpNeedle:9960 · drawGauges:9977 · XF_START:10025 · PRELOAD_WAIT:10026 · ALT_QUIET_FROM:10028 · ALT_MAX_DAMP:10029
ALT_LP_MIN:10030 · ECHO_NEAR:10031 · WIND_FULL_SPD:10032 · SHUTDOWN_SEC:10033 · PAN_MAX:10035 · OD_RPM:10036
SHAKE_RPM:10037 · SHAKE_HIT:10038 · soccerLetterPos:10518 · letterNeeded:10526 · soccerNeededSet:10535 · soccerTileGeo:10543
soccerGoldTexture:10545 · makeSoccerTile:10562 · soccerRefreshSkins:10571 · soccerBuildTargets:10578 · soccerNextTile:10588 · soccerRetarget:10604
soccerCoinPop:10616 · soccerGrassTexture:10629 · soccerTurfGrade:10651 · soccerTurfTexture:10702 · grassNormalTexture:10721 · soccerLinesTexture:10750
soccerNetTexture:10801 · soccerCrowdTexture:10809 · soccerBallMat:10828 · buildSoccerGoal:10848 · buildStands:10867 · soccerLedBoards:10902
soccerGKEnsure:10999 · soccerGKTick:11015 · fkBuildWall:11044 · fkToggle:11059 · fkHitTest:11075 · pkHud:11094
pkStart:11103 · pkEnd:11117 · pkTick:11132 · repQualify:11139 · repEnsureEl:11142 · repStart:11153
repTick:11160 · soccerNumTex:11185 · ssSec:11197 · ssPaintPattern:11202 · soccerShirtTex:11215 · makeSoccerPlayer:11237
soccerNewSpot:11273 · soccerResetBall:11285 · soccerKick:11292 · soccerCheer:11310 · guideTexture:11313 · auraActive:11337
auraLeftMs:11338 · auraFlameTex:11346 · auraCoilTex:11370 · auraCoilRibbon:11394 · auraGlintTex:11418 · buildAura:11429
auraBuy:11472 · auraRender:11482 · auraTick:11496 · buildDrill:11547 · drillTick:11560 · ballFXTex:11600
buildBallFX:11611 · smokePuff:11627 · ballFXTick:11635 · buildLandRing:11681 · buildGuideRibbon:11691 · renderSpinPad:11716
spinPadToggle:11728 · spinPadPick:11734 · renderCurl:11746 · kickLaunch:11757 · updateSoccerGuide:11766 · soccerCamera:11830
tickSoccer:11853 · ssShirtPath:12047 · ssShortsPath:12055 · ssPaintSwatchShirt:12060 · ssPaintSwatchShorts:12065 · ssPreviewDraw:12072
soccerKitShow:12101 · soccerKitGo:12130 · emojiSprite:12183 · makeAlien:12188 · startWave:12221 · waveSpawnFill:12232
waveComplete:12241 · updateWaveHud:12251 · checkMechaBossBadge:12253 · alienSpawnPos:12262 · removeAlien:12267 · mechaHudWord:12272
setMechaHudSkin:12280 · mechaComboPop:12292 · mechaShielded:12297 · mechaDamageFx:12299 · mechaHitByAlien:12304 · spawnAlienShot:12310
removeAlienShot:12320 · tickAlienShots:12325 · spawnPowerup:12337 · removePowerup:12350 · collectPowerup:12355 · tickPowerups:12362
updateMechaHud:12371 · mechaTracer:12411 · mechaFire:12420 · explodeAlien:12457 · tickMecha:12487 · loop:12543
grabShot:12578 · savePhoto:12589 · clearEntities:12601 · INTRO_KEY:12624 · introSeenObj:12625 · introSeen:12626
markIntroSeen:12627 · INTRO:12628 · INTRO_MODE:12630 · showIntro:12632 · HELI_KPP_BANNER:12658 · closeIntro:12660
beginPlay:12666 · start:12668 · exitWorld:12899 · mechaRecapLine:12969

## js/app-update.js (211 บรรทัด · 0 รายการ)

## js/arena3d.js (724 บรรทัด · 0 รายการ)

## js/assetaward.js (21 บรรทัด · 0 รายการ)

## js/auth.js (422 บรรทัด · 36 รายการ)
AUTH_PUSH_MS:23 · AUTH_SDK_TIMEOUT_MS:24 · TEACHER_EMAILS:28 · isTeacher:29 · TESTER_EMAILS:42 · TESTER_COINS:43
isTester:44 · RANK_EXCLUDED_TESTER_NAMES:50 · rankUserExcluded:51 · testerBoost:57 · authSetStatus:90 · authShowLogin:102
authGateOffline:106 · authSaveRef:113 · authFetchCloud:114 · authWriteCloud:115 · authDeleteCloud:116 · authWriteProfileName:117
authPushProfile:124 · authApplyProfileName:132 · authAskProfileName:148 · authEditProfileName:159 · authStart:170 · updateOfflinePill:202
authEnterOffline:207 · authLateSync:224 · authIsAppMode:244 · AUTH_REDIRECT_CODES:252 · authLoginClick:254 · authOnLogin:274
authSyncOnLogin:287 · authFreshStart:316 · authAskLink:325 · authEnterGame:375 · authPushSave:390 · authLogout:401

## js/award.js (275 บรรทัด · 0 รายการ)

## js/bandadv.js (452 บรรทัด · 28 รายการ)
BAND_ADV_REWARD:9 · bandAdvFailMsg:16 · bandAdvLoad:23 · bandAdvPlay:61 · BAND_ADV_EXAM:76 · bandAdvExamId:81
bandAdvExamName:83 · BAND_ADV_SUPREME_BONUS:90 · bandAdvCheckSupreme:91 · bandAdvExamLock:107 · bandAdvExamBest:116 · bandAdvExamCat:129
bandAdvShowExamSummary:150 · bigExamBadgeNote:178 · BXR_TOP:197 · BXR_READ:198 · bxrKey:202 · bxrSubmit:206
bxrMerge:237 · bxrFetch:254 · bxrRowHTML:275 · bxRankBodyHTML:287 · bxRankMount:302 · bxRankNote:334
bxRankNoteRefresh:343 · openBigExamRank:350 · bandAdvExamOpen:367 · bandAdvCardsHTML:421

## js/bbaward.js (14 บรรทัด · 0 รายการ)

## js/bubble.js (200 บรรทัด · 0 รายการ)

## js/cert.js (655 บรรทัด · 32 รายการ)
CERT_MAX:17 · CERT_ISSUER_EN:18 · CERT_MONTHS:19 · CERT_TOPIC_EN:23 · CERT_LEVEL_EN:44 · CERT_ADV_EN:49
CERT_BIG_LV:56 · CERT_STD_EN:59 · certThIndex:67 · certTitleOf:76 · certSerial:102 · certDateEN:110
certTier:118 · CERT_TIER_META:125 · CERT_LOGO_SRC:131 · certAward:140 · certMine:166 · certAwardGold:173
certAwardAdvSupreme:194 · certBackfill:210 · certCatNameById:238 · certFromPost:263 · certXML:281 · certFit:286
certFitMeasured:292 · certHolder:301 · certSVG:311 · certChipHTML:593 · openCertBig:609 · openCertMine:625
certStripHTML:633 · certBindStrip:647

## js/city3d.js (3,328 บรรทัด · 211 รายการ)
### 🗂️ สารบัญโซน js/city3d.js (Read/Edit เฉพาะช่วง)
- 2-18 city3d.js — 🏙️ VOCAB CITY: ล็อบบี้ 3D แบบเมืองลอยฟ้า (index.html = หน้าหลัก · รอบ 861 · สลับเป็นหน้าหลักรอบ 86
- 19-51 ⚙️ CONFIG + เครื่องมือกลาง (รอบ 861)
- 52-126 🔒 รอบ 1070: ประตูโลกที่ยัง Coming soon — สิทธิ์ทดสอบมาจาก Auth ที่ฝังในเซฟ Lobby เดิม
- 127-229 📷 CAMERA RIG — 1 นิ้วเลื่อน · 2 นิ้วหมุน/เอียง/ซูม (รอบ 861)
- 230-393 🖼️ CANVAS TEXTURE โรงงานผิวสัมผัส (พื้นเกาะ/หน้าต่างตึก/ป้าย)
- 394-454 🏗️ BUILDERS — อาคารแต่ละแบบ (ห้ามกล่องเปล่าแปะ texture — มีชั้นเชิง/ระเบียง/หลังคา/ป้ายจริง)
- 455-843 🚪🌀 รอบ 897: ประตูม้วนเลื่อนขึ้น (โรงรถ/โรงเก็บยาน) — บานพับหมุนไม่ได้เพราะช่องกว้าง 3-5 เมตร
- 844-940 🚗🏍️🚁🛸 ยานพาหนะจิ๋ว (ผู้เล่นจริงจากโลก 3D จะขับ/บินสิ่งเหล่านี้ในเมือง)
- 941-997 🧍 ตัวละครผู้เล่น — blk1-8 = หุ่นบล็อก 3D · blk9-88 = ป้ายภาพ 2D ตั้งในโลก
- 998-1349 🌆 ผังเมือง — อาคารทุกหลังผูก go=<key> (ตัวรับใน js/main.js)
- 1350-1494 🎉 เทศกาลตามวันที่จริง — พลุปีใหม่ / สงกรานต์ / ลอยกระทง (รอบ 863)
- 1495-1770 🧑‍🤝‍🧑 ผู้เล่นจริง (อ่านอย่างเดียว) — presence→ยืนตามอาคาร · world→ขับ/บินในเมือง
- 1771-1927 💬 รอบ 866: บับเบิลแชทสดลอยหัวเพื่อนในเมือง
- 1928-2084 🖊️💬 รอบ 868: พิมพ์ตอบแชทได้จากในเมือง (ไม่ต้องกลับล็อบบี้เดิม)
- 2085-2234 💬🔴 รอบ 873: ไอคอน "มีข้อความค้าง ยังไม่ได้อ่าน" ลอยเหนือหัวเพื่อน
- 2235-2252 🚪 รอบ 870: กลับจากล็อบบี้เดิม → โผล่ที่ "หน้าประตูตึกที่เพิ่งเข้า"
- 2253-2487 🚪🔊 รอบ 890: บานประตูตึกเปิด-ปิดจริง + เสียงประตูสังเคราะห์เอง
- 2488-2619 🚗🤖🛸 รอบ 900: ยานพาหนะแล่นออกจากช่องประตูม้วนที่เพิ่งเปิด → จอดรอหน้าประตู
- 2620-2787 🚶 รอบ 866: ตัวเราเดินไปหน้าตึกก่อน แล้วค่อยเข้าหน้านั้น
- 2788-2872 🚪🚶 รอบ 886: กลับจากล็อบบี้เดิม → "เดินออกจากตึกมาหน้าประตู" (walkSelfTo ย้อนทาง)
- 2873-3040 👆 แตะ/คลิก: ตัวละคร→การ์ดโปรไฟล์ · อาคาร→เดินทางไปหน้านั้น · พื้น→ประกายดาว
- 3041-3094 🎵 รอบ 873: เพลงประกอบเมือง (BGM) — ปุ่มเปิด/ปิดมุมขวาล่าง
- 3095-3130 🚀 BOOT
- 3131-3328 🎬 รอบ 880: กลับจากล็อบบี้เดิม → จอเปิดคือ "ภาพเมืองใบที่เพิ่งเดินออกไป"
### รายการ js/city3d.js
ISLAND_R:22 · RING_IN:23 · BAND1_R:24 · GROUND_TEX_PX:25 · NIGHT:26 · esc:46
hash:47 · rnd:48 · clamp:49 · TAU:50 · CITY_WORLD_COMING_SOON:55 · CITY_WORLD_TESTER_NAMES:56
cityWorldTester:57 · cityWorldComingSoon:72 · BLK8:78 · CAR_COL:89 · gradeStars:94 · MAT:112
mat:113 · GEO:117 · box:118 · cyl:119 · M:120 · groundAt:151
setupInput:160 · twoState:222 · cvs:233 · ctex:234 · groundTexture:241 · wallTex:295
wallMat:314 · shopSign:319 · roundRect:329 · iconSprite:336 · nameSprite:358 · blobShadow:380
parapet:402 · roofProps:407 · DOOR_W:419 · doorNightFx:423 · doorAt:440 · ROLL_Z_HOLE:464
slatTexture:467 · rollAt:477 · awning:501 · bTower:513 · bShop:533 · bHouse:551
bLibrary:567 · bFactory:585 · bArcade:612 · bObservatory:629 · bHallOfFame:643 · bHaunted:664
bHeliport:682 · bGarage:699 · bStadium:714 · bMotoTrack:736 · bUfo:757 · bHangar:777
bJungleGate:800 · bDronePad:822 · miniCar:847 · miniMoto:866 · miniHeli:886 · miniDrone:906
miniMecha:921 · makeBlockFigure:945 · makeSpriteFigure:981 · makeFigure:990 · pickBlk:993 · bld:1001
BUILDINGS:1002 · BLD_AT:1121 · buildCity:1123 · buildPlaza:1174 · buildGreens:1220 · _glowTex:1265
buildSky:1275 · buildAmbientTraffic:1337 · FESTIVAL:1354 · buildFestival:1366 · buildFireworks:1373 · buildSongkranDeco:1415
buildLoiKrathongDeco:1447 · actBuilding:1518 · loadFirebase:1529 · setCityLoginVisible:1538 · liveStart:1551 · lbGet:1567
watchPresence:1577 · spawnStander:1601 · WORLD_MAPS:1636 · pollWorlds:1643 · spawnVehicle:1694 · removeActor:1754
markPickable:1767 · BUB_MS:1780 · BUB_FRESH:1781 · BUB_MAXCH:1782 · BUB_MAX:1783 · BUB_TEX_KEEP:1784
bubTexture:1790 · bubTexRelease:1802 · bubbleSprite:1807 · bubDraw:1816 · killBubble:1843 · showBubble:1856
flushBubble:1894 · watchFriendChats:1902 · CITY_CHAT_MAX:1941 · CITY_QUICK_REPLIES:1943 · bubSafeText:1946 · actorInfo:1952
chatBoxCanSend:1962 · chatBoxWhy:1966 · chatBoxRefresh:1972 · openChatBox:2009 · closeChatBox:2021 · cbNote:2026
sendCityChatText:2032 · sendCityChat:2062 · cityStopLive:2067 · SAVE_KEY:2096 · saveRead:2099 · pairIdOf:2102
chatSeenTsCity:2104 · chatMarkSeenCity:2110 · unreadTexture:2123 · addUnreadBadge:2141 · removeUnreadBadge:2162 · setUnread:2172
applyUnread:2178 · markReadCity:2180 · unreadCount:2188 · spawnSelf:2194 · DOOR_MEM:2245 · rememberDoor:2246
lastDoorKey:2247 · DOOR_SWING:2269 · DOOR_OPEN_S:2270 · DOOR_SHUT_S:2271 · DOOR_AJAR:2275 · AJAR_QUIET_MS:2276
ROLL_OPEN_S:2281 · ROLL_SHUT_S:2282 · ROLL_LIFT:2283 · ROLL_AJAR:2284 · registerDoor:2287 · doorLeadS:2300
doorSpillTexture:2306 · doorCreakSfx:2317 · doorLatchSfx:2335 · shutterRollSfx:2358 · shutterClunkSfx:2385 · doorMoveSfx:2408
setCityDoor:2415 · openCityDoor:2426 · closeCityDoor:2427 · setDoorRest:2429 · refreshDoorRest:2441 · applyDoorPose:2451
RIDE_GATE:2503 · RIDE_OUT_S:2504 · RIDE_PARK_S:2505 · DOOR_RIDES:2508 · rideLeadS:2518 · rideSfx:2523
ridePose:2548 · launchRide:2565 · releaseRide:2577 · WALK_SPD:2626 · WALK_MIN:2627 · WALK_MAX:2628
DOOR_GAP:2629 · RECEPTION_SPOT:2633 · doorSpotOf:2634 · walkPose:2645 · footCtx:2660 · footStepSfx:2665
footDustTexture:2686 · footDustPuff:2695 · footDustTick:2709 · FOOT_STEP_DIST:2724 · DOOR_OPEN_AT:2725 · walkSelfTo:2727
EXIT_BACK:2799 · EXIT_DUR:2800 · EXIT_STEP:2801 · EXIT_CLEAR:2802 · EXIT_SHUT:2803 · stageExitWalk:2806
walkSelfOut:2818 · onTap:2876 · captureCityShot:2895 · travelTo:2928 · sparkleAt:2969 · openProfile:2993
refreshChip:3032 · setChip:3036 · BGM_KEY:3047 · BGM_DUCK_PICTURE_DICTIONARY:3048 · bgmWant:3050 · bgmEnsure:3051
BGM_DEV:3060 · bgmPlay:3061 · bgmDuckForPictureDictionary:3063 · bgmRefreshBtn:3068 · bgmToggle:3075 · bgmSetup:3080
boot:3098

## js/dictband.js (410 บรรทัด · 27 รายการ)
BAND_EMOJI:12 · BAND_SET_REWARD:13 · BAND_DONE_BONUS:14 · bandFailMsg:21 · bandLoad:28 · bandShortTH:60
bandCat:68 · bandSets:90 · bandSetId:99 · bandCheckComplete:102 · bandSetCat:119 · BAND_RETAKE_MAX:131
bandTriedSets:132 · bandRetakeCat:143 · bandShowRetakeSummary:177 · bandSetsPassed:205 · openBandSetPicker:213 · bandMine:285
bandUnlocked:286 · bandLockToast:291 · bandExamLobby:297 · updateBandExamBtn:306 · bandLobbyTick:323 · bandPlay:334
bandSpeakSample:346 · bandPlayLobby:366 · bandCardsHTML:378

## js/examstd.js (945 บรรทัด · 49 รายการ)
XS_PASS_PCT:15 · XS_REWARD:16 · XS_REWARD_AGAIN:17 · XS_TIME_HINT:21 · XS_TIME_FALLBACK:22 · xsLimitSec:23
XS_SCALE:27 · xsScaleText:33 · xsFindSet:44 · examStdLoad:56 · xsFailMsg:91 · xsQuizId:99
xsBest:101 · XS_HIST_MAX:116 · xsHistory:117 · xsHistorySVG:126 · xsIsPractice:158 · xsTimerStop:160
xsElapsed:161 · xsFmt:162 · xsMark:169 · xsSecStats:175 · examStdStart:189 · xsBuildScreen:209
xsTimeUp:281 · xsRender:290 · xsChoose:366 · xsGo:378 · xsQuitAsk:394 · xsClose:402
xsSubmitAsk:408 · xsFinish:423 · xsTimeTableHTML:517 · xsShowReview:541 · openExamStdPicker:607 · XRK_READ:673
XRK_ALL:674 · xrkSubmit:682 · xrkMerge:712 · xrkAllRows:732 · xrkFetch:750 · xrkNote:776
xrkNoteRefresh:787 · xrkAllRowHTML:796 · xrkBodyHTML:800 · xrkMount:815 · openExamStdRank:854 · examStdCardsHTML:871
openExamStdBoard:906

## js/f1_3d.js (2,909 บรรทัด · 214 รายการ)
### 🗂️ สารบัญโซน js/f1_3d.js (Read/Edit เฉพาะช่วง)
- 19-127 ⚙️ ค่าคงที่ (TUNE ZONE)
- 128-169 📦 สถานะโลก
- 170-343 🔊 F1 DYNAMIC ENGINE AUDIO — sample จริง + RPM/เกียร์เสมือน + synth fallback (รอบ 1106)
- 344-462 🖼️ texture: probe img/f1/*.jpg ก่อน → ไม่มีใช้ canvas วาดเอง
- 463-489 ✏️ sprite ตัวอักษร / ป้ายชื่อ (canvas → sprite)
- 490-580 🛣️ เส้นแทร็ก: F1_MAP.track (จุดจริง OSM) → sample ทุก 5 ม.
- 581-854 🏗️ สร้างฉาก: แทร็ก + kerb + runoff + อาคารจริง + ไฟ + ทะเลทราย
- 855-964 🏎️ โมเดลรถ: GLB ผู้ใช้ (img/models/f1_car.glb) → ไม่มี = ประกอบเอง
- 965-1312 🖥️ DOM + CSS (เต็มจอ ไม่มีกรอบเครื่องเกม)
- 1313-1458 🌍 สร้างโลกครั้งเดียว
- 1459-1633 🪽 รอบ 904: DRS — ปีกหลังเปิดบนทางตรง (ตามรถเพื่อนใกล้ 25 ม.)
- 1634-1819 🏁 ฟิสิกส์ + จับเวลา
- 1820-1907 🏆 รอบ 903: กระดานอันดับ Best Lap ออนไลน์ (/f1Rank)
- 1908-2070 🚦👻 รอบ 902: ลำดับออกสตาร์ท (ไฟแดง 5 ดวง) + รถเงาวิ่งตาม Best Lap
- 2071-2123 🚧 เลนพิท — ผิวทางเต็มกริป + ลิมิตเตอร์ 80 กม./ชม.
- 2124-2208 🔤 คำศัพท์บนแทร็ก (แบบเดียวกับโลกมอเตอร์ไซค์ — REWARD สูงกว่า)
- 2209-2358 🧑‍🤝‍🧑 เพื่อนร่วมสนาม (NetRoom map 'f1')
- 2359-2482 📷 กล้องไล่หลัง + ลูปเกม
- 2483-2587 🔢 รอบ 916 — จอบนพวงมาลัยเป็น "ของจริง"
- 2588-2714 🚥 รอบ 918: แถบไฟ LED รอบเครื่องบนพวงมาลัย (เขียว → เหลือง → แดง ตอนใกล้เปลี่ยนเกียร์)
- 2715-2909 🚪 เข้า/ออกโลก
### รายการ js/f1_3d.js
REWARD:22 · LETTER_COIN:23 · LETTER_COPIES:24 · COLLECT_R:25 · DONE_KEY:26 · HALF_W:27
KERB_W:28 · RUNOFF_W:29 · SAMPLE_M:30 · FP_EYE:32 · FP_FWD:33 · FP_LOOK:34
FP_DROP:35 · FP_FOV:36 · ROAD_EYE:39 · ROAD_DROP:40 · ROAD_FOV:41 · REV_A:43
REV_MAX:44 · OFFTRACK_S:45 · FPW_F:46 · FPW_S:47 · FPW_R:48 · FPW_H:49
WHEEL_HUB_X:52 · WHEEL_HUB_Y:53 · WHEEL_RATIO:54 · WHEEL_MAX_DEG:55 · LED_GREEN_N:59 · LED_AMBER_N:60
LED_SHIFT_R:61 · LED_FLASH_HZ:63 · LED_K_LO:64 · LED_K_SPAN:65 · LED_RPM_LERP:66 · F1_LEDS:67
WHEEL_IMG_W:76 · DASH_PX:77 · DASH_LED_N:78 · DASH_RPM_MIN:79 · DASH_RPM_MAX:80 · SHAKE_KERB_AMP:82
SHAKE_SAND_AMP:83 · SHAKE_SPD_REF:84 · SHAKE_HZ:85 · WHEEL_SHAKE_KERB_PX:87 · WHEEL_SHAKE_SAND_PX:88 · PWR_A:90
ACC_CAP:91 · DRAG_K:92 · ROLL_A:93 · BRAKE_A:94 · BRAKE_DF:95 · COAST_A:98
COAST_STOP:99 · GRIP_BASE:100 · GRIP_DF:101 · GRIP_CAP:102 · STEER_MAX:104 · STEER_HI:105
SURF_RUNOFF:106 · SURF_SAND:107 · NET_SEND_MS:108 · ROOM_MAX:109 · CHAT_MS:110 · CHAT_PRESETS:111
PEER_COLORS:112 · GRID_N:113 · LIGHT_LEAD_S:115 · LIGHT_STEP_S:116 · LIGHT_HOLD_MIN:117 · LIGHT_HOLD_MAX:118
JUMP_PENALTY_S:119 · GHOST_HZ:121 · GHOST_MAX:122 · GHOST_KEY:123 · PIT_HALF_W:124 · SURF_PIT:125
PIT_LIMIT:126 · LINE:148 · PITL:161 · GEARS:341 · gearOf:342 · matLam:351
matLit:357 · applyTex:362 · texFromCanvas:366 · texProbe:374 · asphaltTex:385 · kerbTex:400
sandTex:406 · crowdTex:415 · garageTex:426 · towerTex:437 · adTex:446 · tentTex:453
letterTexture:466 · makeTextSprite:476 · cr:494 · buildLine:498 · nearIdx:537 · surfAt:568
ribbonGeo:584 · kerbStrips:605 · extrudeFootprint:640 · polyCentroid:651 · buildBuildings:655 · buildTrackScene:705
glbEnsure:858 · buildF1Car:872 · makeCar:944 · CSS:968 · buildDom:1158 · build:1316
mapBounds:1426 · mapXY:1434 · drawMap:1437 · DRS_ZONES_N:1467 · DRS_CURV:1468 · DRS_GAP_MAX:1469
DRS_MIN_M:1470 · DRS_ENTRY_M:1471 · DRS_NEAR_M:1472 · DRS_DRAG_K:1473 · DRS_FLAP_SHUT:1475 · DRS_FLAP_OPEN:1476
attachDrsGlow:1481 · findDrsZones:1491 · DRS_DET_M:1522 · DRS_SIGN_KIND:1523 · drsDetIdx:1530 · drsSignTex:1534
buildDrsBoards:1546 · drsZoneAt:1588 · drsPeerGap:1597 · drsTick:1610 · drsHud:1625 · respawnOnTrack:1638
physTick:1650 · progressTick:1746 · fmtLap:1794 · puffSmoke:1800 · smokeTick:1809 · FR_READ:1828
frSubmit:1830 · frMerge:1845 · frFetch:1856 · frRowHTML:1874 · frBodyHTML:1883 · frNote:1892
frMount:1897 · resetLights:1917 · beginLights:1924 · lightsLocked:1925 · paintLights:1926 · lightsTick:1936
ghostEnsure:1985 · ghostHide:2002 · ghostLoad:2007 · ghostSave:2016 · ghostReset:2019 · ghostRecord:2023
ghostKeep:2032 · ghostGapAt:2039 · ghostTick:2047 · buildPitLine:2076 · pitAt:2107 · inPitLane:2118
trackPointAhead:2127 · pickWord:2133 · spawnLetters:2143 · renderWordHud:2156 · collectTick:2162 · completeWord:2180
relocTick:2197 · netReady:2212 · netJoin:2217 · netSend:2230 · sendChat:2241 · peerColor:2248
buildPeer:2252 · onPeer:2273 · showPeerBubble:2293 · removePeerBubble:2300 · dropPeer:2306 · peerTick:2314
netLeave:2334 · renderBoard:2338 · CAM_MODES:2364 · CAM_NEXT_LABEL:2365 · cycleCamMode:2366 · applyCamMode:2370
buildFpWheels:2381 · fpWheelTick:2412 · cockpitBox:2425 · layoutWheel:2440 · wheelTick:2462 · DASH_FONT:2489
layoutDash:2490 · dashRR:2504 · dashRpmTick:2511 · dashTick:2521 · drawDash:2536 · buildLeds:2593
ledsOff:2601 · ledTick:2605 · camTick:2632 · hudTick:2672 · frame:2682 · tick:2700
fit:2707 · applyEnvironmentProfile:2718 · start:2740 · exitWorld:2806

## js/f1_modes.js (123 บรรทัด · 12 รายการ)
STORAGE_KEY:7 · DEFAULT_MODE:8 · CONTRACT:9 · freezeProfile:11 · PROFILES:17 · MODES:36
normalize:43 · readPreference:44 · writePreference:48 · selection:53 · removeSelector:58 · openSelector:64

## js/fpsweapon.js (193 บรรทัด · 0 รายการ)

## js/game.js (1,210 บรรทัด · 85 รายการ)
### 🗂️ สารบัญโซน js/game.js (Read/Edit เฉพาะช่วง)
- 2-629 เกมจับคู่คำศัพท์ + หมวดคำศัพท์ & แบบทดสอบ
- 630-944 🎊🪙 รอบ 985: ฉลอง "ได้เข็มใหม่" + รางวัลเงินก้อน (ผู้ใช้สั่ง 3 ส.ค. 2026)
- 945-1210 หมวดคำศัพท์ & แบบทดสอบ 10 ข้อ (ผ่านที่ 8 ข้อขึ้นไป)
### รายการ js/game.js
REPLAY_BONUS_EVERY:23 · REPLAY_BONUS_TIERS:25 · replayBonusFor:26 · SESSION_MILESTONES:32 · addSessionCoins:35 · updateBestTarget:74
weekKeyStr:87 · rolloverWeekBest:94 · exitGame:100 · showSessionSummary:136 · sprinkleConfetti:183 · VOCAB_PER_LEVEL:202
VOCAB_RANK_NAMES:203 · vocabRankName:204 · showProgressReport:206 · THUNDER_MS:388 · THUNDER_TIERS:392 · THUNDER_TIER_UI:393
thunderEmoji:394 · DAREDEVIL_TIERS:398 · DAREDEVIL_TIER_UI:399 · daredevilEmoji:400 · GLASS_TIERS:404 · GLASS_TIER_UI:405
glassEmoji:406 · DILIGENT_TIERS:410 · DILIGENT_TIER_UI:411 · diligentEmoji:412 · SOFTLAND_TIERS:416 · SOFTLAND_TIER_UI:417
softLandEmoji:418 · AIRL_TIERS:422 · AIRL_TIER_UI:423 · airLetterEmoji:424 · MECHABOSS_TIERS:428 · MECHABOSS_TIER_UI:429
mechaBossEmoji:430 · TYPIST_TIERS:437 · TYPIST_TIER_UI:438 · typistEmoji:440 · checkTypistBadge:442 · BIGEXAM_TIERS:458
BIGEXAM_TIER_UI:459 · bigExamEmoji:460 · bigExamCertCount:462 · checkBigExamBadge:467 · BFF_TIERS:482 · BFF_TIER_UI:483
BFF_COIN:484 · bffEmoji:485 · badgeSuffix:490 · BADGE_META:509 · NAME_BADGE_RE:526 · splitNameBadges:527
badgeEmojis:533 · badgeScore:538 · BADGE_CATS:545 · earnedBadgeEmojis:561 · bcatLevel:576 · checkCrown:583
currentBadgeScore:599 · rolloverBadgeWeek:603 · addDiligent:616 · BADGE_COIN:635 · awardBadgeCoin:643 · BC_QUEUE:657
celebrateBadge:658 · bcShow:672 · showBadgeInfo:701 · addThunder:719 · startGame:733 · newRound:773
updateTimerBar:812 · updateComboPill:818 · pickCard:822 · checkMatch:834 · renderCats:948 · fmtMMSS:998
quizTimerStop:1002 · quizTimerStart:1007 · quizElapsed:1017 · startQuiz:1021 · renderQuizQuestion:1039 · quizNext:1103
finishQuiz:1116

## js/gradelock.js (169 บรรทัด · 15 รายการ)
GRADES:21 · GRADE_LOCK_DAYS:25 · GRADE_LOCK_MS:26 · gradeRank:29 · myGrade:30 · gradeTester:31
gradeHistList:34 · gradeLockLeftMs:44 · gradeLockLeftDays:51 · gradeUnlockAt:52 · gradeLocked:53 · gradeUpOptions:56
gradeChangeTo:64 · gradeLockNote:91 · openGradeChange:100

## js/hauntedhotel.js (621 บรรทัด · 0 รายการ)

## js/hauntedhoteldirector.js (321 บรรทัด · 0 รายการ)

## js/hauntedhotelghost.js (237 บรรทัด · 0 รายการ)

## js/hauntedhotelsession.js (255 บรรทัด · 0 รายการ)

## js/hotel3d.js (1,526 บรรทัด · 62 รายการ)
### 🗂️ สารบัญโซน js/hotel3d.js (Read/Edit เฉพาะช่วง)
- 1-65 hotel3d.js — 🏨 โรงแรมผีสิง 5 ชั้น (รอบ 684 · ยกบรรยากาศ/ภารกิจงานศพไทยรอบ 1060)
- 66-134 🧱 ตัวช่วยรวมกล่องเป็น mesh เดียว (draw call น้อย = มือถือไหว)
- 135-288 🎨 วัสดุ (ไม่มีไฟล์ภาพใน img/tex/ = ใช้สีล้วนที่ตั้งไว้ เกมไม่พัง)
- 289-352 🪧 รอบ 1102 — ป้ายบอกชั้นอ่านชัดจากโถงลิฟต์
- 353-866 🏗️ สร้างโรงแรมทั้งหลัง
- 867-1031 ⚰️🕯️ ABANDONED FUNERAL WAKE — local realism pass
- 1032-1191 🚪🚪🚪🚪🚪 รอบ 1060 — ห้องในสุดชั้น 4 มีตู้ภารกิจ 5 ใบ
- 1192-1265 🚶 ระบบเดิน: หาความสูงพื้นใต้เท้า + ชนกำแพง
- 1266-1315 🔤🧭 รอบ 1086 — HAUNTED HOTEL PHASE 4 stable letter placement pool
- 1316-1339 👁️‍🗨️ รอบ 1067 — visibility/light culling ตามชั้น
- 1340-1385 💡 เปิด/ปิดไฟทั้งโรงแรม (ไฟดับ = มืดสนิท เหลือแค่ไฟฉาย)
- 1386-1526 ⏱ อัปเดตทุกเฟรม: ลูกตาในรูปมองตาม · ลิฟต์วิ่ง · บานตู้เปิด
### รายการ js/hotel3d.js
TEX:25 · FLOOR_H:28 · WEST:31 · SHAFT_E:32 · CORE_E:33 · HOTEL_LENGTH_SCALE:37
BASE_CORRIDOR_LEN:38 · WORLD_X_MIN:40 · RZ0:41 · LZ0:42 · ST_LAND:50 · ST_XW:51
ST_XE:52 · ST_RUN:53 · ST_RISE:54 · ST_STEPS:55 · ST_GAP0:56 · ST_ZMID:57
ROOM_N:58 · DOOR_W:61 · ENTRY_HW:62 · PLAYER_R:63 · floorY:64 · Acc:71
accBox:72 · accGeo:88 · accMesh:96 · funeralDecayTexture:104 · makeMats:139 · PORTRAIT_PHOTOS:219
EYE_R0:228 · PORTRAIT_EYE:229 · PORTRAIT_SKIN:237 · PORTRAIT_CLOTH:238 · portraitTexture:239 · signTexture:278
floorSignTexture:292 · thepPhanomPanelTexture:318 · build:356 · inRect:1195 · insideHotel:1196 · surfaceY:1199
collide:1231 · roomAt:1251 · floorOf:1259 · roomVisitId:1260 · LETTER_PLACEMENT_VERSION:1273 · letterPlacementPool:1274
validateLetterPlacementPool:1305 · updateFloorVisibility:1321 · setLightLevel:1343 · setLights:1358 · updatePracticalLights:1361 · configureSpecialWardrobes:1373
BLINK_DUR:1389 · BLINK_MIN:1390 · tick:1392 · nearWardrobe:1490 · nearFuneral:1501 · inLift:1506
atLiftDoor:1510 · randomHaunt:1514

## js/images.js (216 บรรทัด · 25 รายการ)
IMG_FILES:11 · MOODS:12 · COLLECTIBLES_IMG_V:16 · GIFTS_IMG_V:17 · startImgKey:19 · petImageKeys:21
probeImages:33 · probeRankImages:45 · probeCollectImages:46 · probeGiftImages:47 · probeHomeImages:48 · CLIP_FILES:57
CLIP_SM:63 · clipCanWebm:79 · CLIP_ASSET_V:90 · clipFileFor:92 · petClipKey:101 · petClipUrl:110
equippedItem:121 · petStateImg:131 · petWearOverlay:152 · wearLayerHTML:173 · happyNow:180 · makeHappy:181
currentPetImg:194

## js/invasion3d.js (10,495 บรรทัด · 649 รายการ)
### 🗂️ สารบัญโซน js/invasion3d.js (Read/Edit เฉพาะช่วง)
- 16-79 ⚙️ ค่ากติกา (จูนฟีลทั้งหมดที่นี่)
- 80-114 🎯 รอบ 419: ปืนกระบอกที่ 2 — R93 สไนเปอร์ (ตามสเปก Delta Force ที่ผู้ใช้ส่งมา)
- 115-160 🎬 รอบ 422: แอนิเมชันยกปืนเล็ง (ADS) ของ R93 — ตามสเปกที่ผู้ใช้ให้มา
- 161-189 🔍🫁 รอบ 504: "ตัวคูณบวกทับ" ท่าเล็ง — ซูมยิ่งแรงปืนยิ่งแนบตา + ท่าประทับแก้มตอนกลั้นหายใจ
- 190-227 🫁🌑 รอบ 505: สัญญาณรับรู้ลมหายใจตอนส่องกล้อง — เสียงสูด/ผ่อน/สั่น + ขอบจอมืดตามลมที่เหลือ
- 228-257 🔭🫨 รอบ 506: "กำลังขยายมีผลกับความนิ่งของภาพ" — ยิ่งซูมแรงยิ่งสั่นมาก ต้องพึ่งการกลั้นหายใจจริง
- 258-368 🫁💨 รอบ 508: "ลมหมดขณะยังกดกลั้นหายใจอยู่" — ปืนตกวูบแล้วหอบ ก่อนกลับสู่ปกติ
- 369-417 🚫🤖 รอบ 637 (ผู้ใช้สั่ง): ปิดบอทที่ช่วยผู้เล่นยิง — สนามนี้เหลือแต่ "ผู้เล่นจริง" เท่านั้น
- 418-449 🎛️ รอบ 1041: ภาษาภาพ HUD ยุทธวิธี — ไอคอนเวกเตอร์ต้นฉบับ
- 450-990 🎨 CSS + DOM overlay (self-contained ไม่แตะ css/style.css)
- 991-1291 🎛️ รอบ 1041: HUD ยุทธวิธี + ตัวแก้ตำแหน่งแบบเกมยิงมือถือ
- 1292-1421 🎛️🧭 รอบ 1041: HUD LAYOUT EDITOR — ลาก/ย่อขยาย/ความทึบ/บันทึก
- 1422-1786 🔊 เสียงสังเคราะห์ Web Audio (ปลอดลิขสิทธิ์ 100%)
- 1787-1951 🚁🔊 เสียงเฮลิคอปเตอร์ Bell 212 — "เหมือนโลก helicopter ทุกประการ" (รอบ 531 — ผู้ใช้สั่ง)
- 1952-1992 🚁🔊🌍 เสียงเฮลิรอบตัว (รอบ 531 — ผู้ใช้สั่ง) — ทุกลำในสนามส่งเสียงใบพัดจริง ดังตามระยะ + ซ้าย/ขวา
- 1993-2059 🖼️ เทกซ์เจอร์วาดเอง (canvas) + ตัวช่วยโหลดภาพจริงถ้ามีไฟล์
- 2060-2109 🌍 สถานะฉาก
- 2110-2169 📦 โหลดโมเดล .glb ถ้ามีไฟล์ (ผู้ใช้เอาของจริงมาใส่แล้ว)
- 2170-2297 🏜️ สร้างฉากทะเลทราย + เมือง
- 2298-2357 🌳 รอบ 580 (ผู้ใช้สั่ง): ต้นไม้จริงจากโมเดล tree.glb ของผู้ใช้
- 2358-2497 🏚️ รอบ 416: ถนนสมรภูมิหน้าจุดเกิด (ผู้ใช้ส่งภาพอ้างอิง Delta Force)
- 2498-2674 🏜️🪖 รอบ 1040: ภูมิทัศน์สมรภูมิสมัยใหม่ — PBR + ร่องรอยการรบ (ต้นฉบับ)
- 2675-2812 🏠 รอบ 431: บ้านหลบซุ่มยิง (โมเดล house_01 ของผู้ใช้) + จุดสูงข่มบนเนินเขา
- 2813-2873 🛸 ยานแม่ลำมหึมา — ทรงลิ่มเหลี่ยมมืด + หนาม + ช่องตัวอักษร (สไตล์ ID4)
- 2874-2946 👾 ยานลูก — 1 ลำต่อ 1 ตัวอักษร (บินเพ่นพ่าน + ยิงตอบเฉพาะผู้เล่นที่ยิงโดนลำนั้นก่อน)
- 2947-2950 👥 พันธมิตร — หน่วยรบภาคพื้นอาวุธครบมือ + ฝูงเฮลิคอปเตอร์ติดมิสไซล์
- 2951-3055 🪖 รอบ 423: ระบบตัวละครทหารแบบมี "ข้อต่อ" (rig) — รองรับโมเดล .glb ของผู้ใช้
- 3056-3568 🤖 รอบ 424: จับชิ้นส่วนเข้าข้อต่อ "อัตโนมัติจากตำแหน่ง" (ผู้ใช้ไม่ต้องตั้งชื่อ)
- 3569-3714 🚁🅿️ รอบ 434: เฮลิคอปเตอร์จอดในสนามรบ 5 ลำ (โมเดลจริง helicopter.glb — ผู้ใช้สั่ง)
- 3715-4017 🎛️🚁 รอบ 532: ห้องนักบิน "ภาพจริง + เข็มเกจขยับ" (ผู้ใช้สั่ง — เหมือนโลก helicopter ทุกประการ)
- 4018-4042 🔫 อาวุธในมือผู้เล่น (view model ติดกล้อง — เห็นปืนที่ถืออยู่แบบ Delta Force)
- 4043-4149 🎯🔧 TUNE ZONE — ท่าถือปืน (แก้ที่นี่ที่เดียว · 3 บรรทัดล่างนี้เท่านั้น)
- 4150-4205 💪 มือถือปืน มุมมองที่ 1 — รอบ 518 (ผู้ใช้สั่งตรง: เปิดโชว์มือจริง)
- 4206-4343 🧤 รอบ 518: โมเดลมือจริง (GLB จาก Tripo) — ผู้ใช้เจนเอง img/models/hand_grip.glb
- 4344-4492 🔧 รอบ 427: ยืดลำกล้องปืนหลัง export (ผู้ใช้: โมเดล R93 ลำกล้องสั้นไป)
- 4493-4687 🔩 รอบ 447: ชักลูกเลื่อนแบบ SV-98/Delta Force (ผู้ใช้ส่งคลิปอ้างอิงมา)
- 4688-5224 🔫 FPS WEAPON SPRITE ADAPTER — isolated from gameplay/world state
- 5225-5491 💥 เอฟเฟกต์: ระเบิด · ประกายโดน · ลำแสง · เศษซาก
- 5492-5621 🛡️🔵 รอบ 581 (ผู้ใช้สั่ง): "เกราะยานแม่ที่มองไม่เห็น"
- 5622-5727 🎯📝 รอบ 471: เป้าฝึกยิงในสมรภูมิ (ผู้ใช้สั่ง)
- 5728-5788 🔎 รอบ 473: โจทย์แปลไทย — "ยิงคำที่แปลว่า …"
- 5789-6179 🎯 ระบบยิงของผู้เล่น
- 6180-6193 🎯📡 รอบ 563: เรดาร์ล็อกเป้า + มิสไซล์นำวิถีเข้าเป้าที่ล็อก (ผู้ใช้สั่ง — สไตล์ Ace Combat)
- 6194-6336 🎯🔒 รอบ 564 (ผู้ใช้สั่ง): ล็อกหลายเป้าพร้อมกัน → ยิงมิสไซล์รัวทีละชุด
- 6337-6388 🧭🚀 รอบ 572 (ผู้ใช้สั่ง · ต่อยอดรอบ 569): ลูกศรบอกทิศ "จรวดที่พุ่งเข้าหาเฮลิเรา" บนจอเรดาร์
- 6389-6460 📡⬇️ รอบ 575 (ผู้ใช้สั่ง): เรดาร์ต้องไม่ทับ "แผงสถานะซ้าย" (พลังชีวิต/ความร้อนปืน/ลูกจรวด)
- 6461-6533 ⚔️ ดาเมจ / เงื่อนไขชนะ
- 6534-6624 📖 คำศัพท์ + รอบเล่น
- 6625-6688 🖥️ HUD
- 6689-6893 🕹️ Input — มือถือ (จอย+ปุ่ม) และคอม (WASD + pointer lock)
- 6894-7015 🚶 ผู้เล่น + AI + ลูป
- 7016-7020 🚁 โหมดขับเฮลิคอปเตอร์เอง (รอบ 414 — ผู้ใช้สั่ง)
- 7021-7179 🗺️ รอบ 417: แผนที่เลือกจุดลงสนาม (ผู้ใช้สั่ง) — เข้าเกมแล้วเลือกได้ว่าจะไปเกิดตรงไหน
- 7180-7338 🎖️ รอบ 418: นั่งเฮลิลำเดียวกับเพื่อน — "นักบิน + พลปืนประจำประตู" (ผู้ใช้สั่ง)
- 7339-7700 🔭🚫 รอบ 575 (ผู้ใช้สั่ง): "ซูมปืนค้างไว้ = ขึ้นเฮลิไม่ได้ ต้องเลิกซูมก่อน"
- 7701-7964 🌐 ผู้เล่นออนไลน์ใน map เดียวกัน (รอบ 414) — Firebase /world/invasion
- 7965-8110 🧯👥 กันผู้เล่นล้น — ฝั่งเรนเดอร์ของโลกนี้ (รอบ 637 · ยกส่วนกลางออกไป js/netroom.js รอบ 640)
- 8111-8169 💨 ควันตามหลังมิสไซล์ (รอบ 531 — ผู้ใช้สั่ง) — สไปรต์ควันนุ่มปล่อยเป็นระยะ
- 8170-8337 🔥🌀 รอบ 565 (ผู้ใช้สั่ง): ยานลูก "หลบมิสไซล์ที่ล็อกได้" — ปล่อยแฟลร์ + บิดหนี
- 8338-8417 🔫↩️ รอบ 568/1043: ยานลูกที่ถูกผู้เล่นยิงโดนแล้ว และกำลัง "ถูกเรดาร์ล็อก" จึงยิงสวนใส่เฮลิผู้เล่น
- 8418-8619 🔥🛡️ รอบ 569 (ผู้ใช้สั่ง): แฟลร์ของ "เฮลิผู้เล่น" + เสียงเตือนตอนถูกล็อก
- 8620-8630 🏃🪖 รอบ 530: หน่วยรบเคลื่อนที่เชิงยุทธวิธี (ผู้ใช้สั่ง: "อย่าปักหลักยืนทื่อ
- 8631-8756 🧘🎯 รอบ 586 (ผู้ใช้ส่งคลิป: "ตัวละครดิ้นไปดิ้นมา ไม่เป็นธรรมชาติ")
- 8757-8932 📣 รอบ 471: ทหารฝ่ายเราตะโกนบอกทิศศัตรู (ผู้ใช้สั่ง)
- 8933-9375 🌙 รอบ 471: โหมดกลางคืน — ฉากมืดสลัว + ท้องฟ้าดาว + ไฟฉายติดปืน
- 9376-9642 🔵💀 รอบ 576 (ผู้ใช้สั่ง): ยานแม่ยิง "ลำแสงสีฟ้า" ลงมาใกล้ตัวผู้เล่น — เตือน 3 ครั้ง ครั้งที่ 4 ตายจริง
- 9643-9693 ⚡👾 รอบ 579 (ผู้ใช้สั่ง): "ทุก 5 นาที สุ่มยานลูก 10 ลำ เร่งความเร็ว 10 เท่า นาน 10 วินาที แล้ววนลูป"
- 9694-9771 🔁 ลูปหลัก
- 9772-10495 ▶️ เข้า/ออกโลก
### รายการ js/invasion3d.js
WORD_COIN:23 · WORD_TIME:25 · WORLD:26 · EYE:27 · FOV:28 · LOOK_SENS:29
PITCH_MIN:30 · MS_Y:52 · MS_FLAT:61 · MS_BELLY:62 · MS_HP:63 · MS_DMG_GUN:64
CORE_Y:70 · F_HP:75 · FIGHTER_SIZE:76 · F_SHOT_GAP:77 · GUN_GAP:79 · WEAPONS:86
SNIPER_SENS:93 · SCOPE_R:97 · SCOPE_MAGS:102 · RIFLE_MAGS:109 · magList:112 · curMag:113
ADS_IN:121 · ADS_POS:122 · ADS_ROT:123 · ADS_SCALE:124 · ADS_BY_GUN:156 · adsView:160
ADS_BOOST:173 · tickAdsBoost:182 · BREATH_FX:200 · tickBreathFx:211 · ADS_BREATH:227 · SWAY_MAG:240
tickSwayMag:249 · GASP:273 · fireGasp:285 · clearGasp:286 · tickGasp:288 · gaspMul:299
gaspPitchNow:301 · applyGasp:307 · REC_BY_GUN:323 · REC_DEFAULT:329 · recCfg:331 · BOLT_MS:332
BREATH_MAX:333 · SPRINT_IN:337 · SPRINT_POS:338 · LAG_GAIN:344 · SWAY:350 · PANT_FROM:363
MIS_MAX:366 · PLAYER_HP:367 · ALLY_BOTS:376 · SQUAD_N:379 · SQUAD_GAP:380 · HELI_CHASE_SPD:381
SQUAD_RUN:382 · HELI_MAX:388 · HELI_ACCEL:392 · HELI_LAND_VY:395 · HELI_CRUISE:398 · HELI_SKID:399
HELI_GUN_MUL:402 · PH_GUN_GAP:403 · PH_MIS_MAX:404 · NET_SEND_MS:407 · CHAT_MS:408 · CHAT_PRESETS:409
PEER_COLORS:410 · TAU:412 · HUD_ICON:422 · hudIcon:445 · CSS:453 · buildDom:1065
HUD_LAYOUT_KEY:1296 · HUD_TARGETS:1297 · HUD_PRESET_RIGHT:1308 · HUD_PRESET_LEFT:1317 · HUD_PRESET_TABLET:1319 · HUD_PRESETS:1328
hudCopy:1330 · hudRead:1331 · hudEl:1337 · hudSame:1338 · syncHudPreset:1341 · markHudCustom:1345
clearHudStyle:1346 · applyHudOne:1350 · applyHudLayout:1358 · applyHudPreset:1359 · ensureHudEntry:1364 · pickHudControl:1369
closeHudEditor:1376 · openHudEditor:1386 · initHudEditor:1392 · HELI_XF:1801 · HELI_OD_AMBER:1802 · CHORUS_RANGE:1958
resumeAudio:1990 · tryTex:1998 · letterSpriteTex:2011 · sandTex:2022 · wallTex:2044 · BULLET_SPD_R93:2072
loadGlb:2119 · tameGlbMaterials:2149 · fitInto:2161 · HILLS:2176 · buildTerrain:2185 · baseLow:2219
buildTown:2225 · TREE_LOD:2307 · buildTreesGlb:2309 · refreshTreeInstances:2335 · tickTreeLod:2353 · STREET_Z0:2363
instancer:2367 · buildWarStreet:2384 · roadSurfaceTex:2503 · fieldDecalTex:2525 · buildGroundDetail:2539 · buildMilitarySetDressing:2557
smokePointTex:2603 · buildBattlefieldAtmos:2609 · tickBattlefieldAtmos:2622 · sandbagWalls:2632 · squadCoverSpots:2640 · buildDustMotes:2650
tickDust:2661 · HOUSE_SIZE:2684 · HOUSE_LOD:2685 · HOUSE_COVER:2686 · HOUSE_CELL:2687 · HOUSE_SPOTS:2688
buildHouses:2694 · buildBlockGrid:2720 · gridBlocked:2756 · houseBlocked:2763 · houseCover:2772 · tickHouseLod:2780
findSniperSpots:2789 · buildMothership:2817 · layoutLetterPanels:2870 · makeFighter:2877 · drawFighterBar:2937 · SOLDIER_PARTS:2958
joint:2972 · buildSoldierRig:2976 · loadSoldierGlb:3019 · applySoldierGlb:3020 · BODY_MAP:3064 · mergeMeshList:3076
faceModelForward:3117 · skinSoldierLimb:3172 · autoRigSoldier:3214 · fitSoldierGround:3346 · poseSoldier:3372 · MUZZLE_BY_WEAPON:3493
FLASH_COLOR:3495 · makeSoldierFlash:3496 · makeSoldier:3503 · makeHeli:3534 · HELI_ROTOR_NODES:3577 · HELI_TROTOR_NODES:3578
HELI_LEN:3579 · HELI_DESERT:3580 · BOARD_DIST:3581 · AUTO_BOARD_DIST:3586 · HELI_COL_SENS:3593 · heliPiloting:3594
START_MS:3595 · START_PHASES:3596 · HELI_PADS:3603 · SEAT_VIEWS:3611 · heliModel:3622 · buildHeliPads:3664
padAt:3673 · movePad:3679 · startPhaseText:3684 · setSeatView:3691 · tickPads:3704 · CP_NAT:3725
CP_GAUGES:3726 · CP_LAMP:3737 · FUEL_MAX:3740 · FUEL_WARN:3741 · ENG_AMB:3743 · HOT_FULL:3750
heliLift:3752 · cpRpmNow:3757 · CP_SEAT_FULL:3758 · CP_ZOOM:3759 · CP_DASH_OFF_Y:3760 · CP_DASH_DROP:3761
CP_RPM_MAX:3765 · CP_SHAKE_RPM:3766 · loadCockpitImg:3771 · layoutInvCockpit:3787 · cpNeedle:3815 · cpArc:3832
cpRoundRect:3838 · tickHeliGauges:3845 · tickHeliHot:3870 · heliLampLv:3887 · ALARM_GAP:3896 · ALARM_KEYS:3897
resetHeliAlarm:3899 · tickHeliAlarm:3900 · cpLamps:3916 · drawInvGauges:3950 · ZERO_DIST:4057 · GUN_VIEW:4071
GUN_POS:4136 · GUN_ROT:4137 · GUN_SCALE:4138 · useGunView:4140 · MUZZLE_Y:4146 · buildFist:4159
buildArms:4179 · HAND_POSE:4216 · makeHandTopMat:4225 · FOREARM:4231 · addForearm:4232 · loadHandModel:4240
applyHandPose:4262 · fitArmsToWeapon:4271 · buildRifleModel:4277 · buildR93Model:4298 · GUN_CUT:4353 · GUN_STRETCH:4354
orientGunModel:4359 · stretchGunBarrel:4385 · mergeGunParts:4443 · forceGunForward:4468 · attachBoltHandle:4500 · tickBolt:4528
tickBarrelHeat:4571 · muzzleSmoke:4580 · alignGunMuzzle:4600 · syncMuzzleAnchor:4636 · buildSelfShadow:4644 · SUN_DIR:4657
tickSelfShadow:4658 · renderViewModel:4673 · fpsWeaponFrame:4692 · fpsWeaponIntent:4696 · initFpsWeapon:4700 · tickFpsWeapon:4708
vmToWorld:4714 · gunSil:4717 · setGunPose:4742 · buildGun:4770 · tickSwap:4856 · applyWeapon:4866
swapWeapon:4877 · setScoped:4891 · smoothstep:4905 · tickSway:4909 · tickAds:4934 · applyRecoil:5055
applyBreath:5061 · scopeRadius:5074 · scopeRadiusNow:5086 · tickRange:5091 · layoutScope:5111 · scopeFovDeg:5161
renderScopePass:5169 · cycleScopeMag:5197 · renderAmmo:5205 · syncWeaponBtns:5216 · fxTex:5234 · fxGlow:5242
fxFire:5250 · fxRing:5267 · fxDisc:5275 · fxStar:5282 · boomFlashLight:5300 · tickBoomLight:5312
boom:5321 · dustPuff:5387 · sparkAt:5397 · tracer:5412 · tickFx:5428 · MSH_PAD:5504
MSH_COL:5505 · MSH_CORE:5506 · MSH_HINT_GAP:5507 · MSH_FX_MAX:5508 · msShieldOn:5510 · msShieldPt:5512
msShieldRay:5523 · msShieldPow:5538 · shieldBurst:5541 · shieldHit:5602 · tickShieldFx:5604 · TRG_COIN:5630
QUIZ_COIN:5631 · targetTexture:5636 · setTargetWord:5654 · targetSpots:5664 · buildTargets:5677 · tickTargets:5706
quizPool:5734 · newQuiz:5737 · tickQuiz:5743 · renderQuiz:5749 · targetWord:5756 · hitTarget:5762
AIM_OFF:5797 · AIM_BY_GUN:5816 · aimOffNow:5817 · adsPosNow:5821 · aimPct:5826 · layoutCross:5828
aimDir:5831 · fireGun:5839 · ENV_BLOCK_D:5943 · solidAt:5944 · envHit:5960 · HOLE_MAX:6019
holeTexture:6020 · bulletHole:6035 · tickBullets:6046 · RECOIL_PAT:6069 · RECOIL_RESET:6070 · addRecoil:6072
startReload:6086 · tickReload:6094 · launchMissile:6100 · misBusyHint:6127 · fireMissile:6131 · tickMisQueue:6167
RDR_RANGE:6189 · RDR_FIND:6190 · RDR_KEEP:6191 · RDR_LOCK_MS:6192 · RDR_BEEP:6193 · RDR_MAX_LOCK:6204
RDR_ADD_GAP:6205 · SALVO_PER_TGT:6206 · SALVO_PAIR_MS:6207 · SALVO_TGT_MS:6208 · LK_NUM:6213 · rdrOn:6214
resetRadar:6215 · radarPick:6222 · radarHolds:6236 · tickRadar:6242 · drawLockBoxes:6272 · drawRadar:6294
AMK_TRACK:6350 · AMK_DECOY:6351 · AMK_BEEP:6352 · amisRel:6354 · drawAMisMarks:6359 · RDR_GAP_TOP:6400
RDR_GAP_JOY:6401 · RDR_SIZE:6402 · RDR_SIZE_MIN:6403 · RDR_SIZE_SIDE:6404 · layoutRadar:6405 · lockTarget:6426
rayTarget:6436 · raySphere:6453 · damageFighter:6468 · dropFighter:6480 · updateArmor:6506 · killMother:6513
flashScreen:6528 · myUid:6538 · leaderUid:6539 · isLeader:6544 · pickWord:6545 · setWord:6558
adoptWord:6568 · applyShared:6577 · startWave:6592 · completeWord:6602 · renderWord:6628 · renderTarget:6638
tickWordTimer:6649 · renderCoins:6659 · renderHp:6660 · renderHeat:6666 · renderMissiles:6672 · toastBan:6682
JOY_TOUCH_SLOP:6695 · invTouchInRect:6696 · invTouchLookSide:6700 · invTouchRole:6704 · bindInput:6710 · moveJoy:6884
unlockMouse:6892 · solidPushOut:6901 · tickPlayer:6916 · hurtPlayer:6997 · MAP_VIEW:7026 · mapToWorld:7027
worldToMap:7028 · zoneName:7029 · buildMapShade:7043 · drawSpawnMap:7062 · safeSpawn:7137 · fitSpawnMap:7147
openSpawnMap:7158 · applySpawnPick:7167 · RIDE_DIST:7190 · RIDE_UP:7191 · RIDE_OFF:7192 · rideableHelis:7193
findRide:7199 · nearestRideable:7200 · ridePos:7210 · setRideView:7222 · boardGunner:7231 · dismountGunner:7250
tickGunner:7266 · updateGunnerBtn:7306 · tickAutoBoard:7322 · heliCount:7334 · zoomBlocksBoard:7352 · enterHeli:7362
exitHeli:7404 · EXT_CAM:7433 · EXT_VIEWS:7454 · EXT_SELF:7469 · EXT_RIDE:7470 · extP:7472
syncExtBtn:7474 · cycleExtView:7480 · resetExtCam:7489 · angDiff:7491 · extCamClear:7496 · extCamera:7515
seatCamera:7538 · tickHeliFlight:7559 · heliCrash:7658 · tickGpws:7668 · syncBotHelis:7690 · netReady:7706
netJoin:7712 · netSend:7723 · peerColor:7745 · NAME_SPR_H:7749 · nameSprite:7750 · bakedSoldierGlb:7766
loadPeerSoldier:7767 · peerRig:7776 · setPeerWeapon:7781 · peerBody:7786 · buildPeer:7815 · onPeer:7828
dropPeer:7873 · netLeave:7880 · peerTick:7885 · renderBoard:7921 · sendChat:7946 · showPeerBubble:7953
removePeerBubble:7959 · PEER_DRAW_MAX:7972 · PEER_DRAW_SLACK:7973 · DRAW_SWAP_MARGIN:7974 · JOIN_TOAST_MAX:7975 · drawnPeers:7978
drawSlotFree:7979 · showPeerAgain:7982 · hidePeer:7989 · tickDrawBudget:7994 · tickCrowdGuard:8004 · resetCrowdGuard:8008
tickFighters:8010 · tickMother:8065 · spawnAlienShot:8082 · tickAlienShots:8094 · smokeTex:8116 · spawnPuff:8127
spawnSmoke:8137 · spawnDust:8139 · tickSmoke:8148 · clearSmoke:8158 · tickHeliDust:8161 · EVA_WARN:8183
EVA_FLARE_D:8184 · EVA_TURN:8185 · EVA_SPIN_MUL:8186 · EVA_SPD_MAX:8187 · EVA_ROLL:8190 · EVA_Y:8191
FLARE_PODS:8192 · FLARE_COOL:8193 · FLARE_N:8194 · FLARE_LIFE:8195 · FLARE_TRAP:8196 · FLARE_CH:8197
incomingMis:8202 · startEvade:8213 · dropFlares:8222 · tickEvade:8250 · clearFlares:8282 · tickMissiles:8283
CTR_REACT:8352 · CTR_WARN:8353 · CTR_GAP:8354 · CTR_BURST:8358 · CTR_BURST_MS:8359 · CTR_SPD:8360
CTR_DMG:8361 · CTR_MAX:8362 · CTR_SPREAD:8363 · CTR_LEAD:8364 · ctrAimPoint:8367 · ctrArming:8374
counterFire:8378 · tickCounter:8383 · SPK_RANGE:8435 · SPK_MS:8436 · SPK_GAP:8437 · SPK_WORLD_GAP:8438
SPK_BEEP:8439 · AMIS_SPD:8440 · AMIS_TURN:8441 · AMIS_DMG:8442 · AMIS_LIFE:8443 · AMIS_MAX:8444
AMIS_PROX:8445 · PH_FLARE_MAX:8446 · PH_FLARE_RE:8447 · PH_FLARE_N:8448 · PH_FLARE_COOL:8449 · PH_FLARE_BACK:8450
PH_FLARE_DOWN:8451 · PH_TRAP:8452 · PH_FLARE_CH:8453 · renderFlareBtn:8456 · dropPlayerFlares:8462 · fireAlienMissile:8494
clearAMis:8509 · resetSpike:8514 · spikeStart:8515 · aMisNear:8517 · tickSpike:8525 · tickAMis:8577
SQUAD_COVERS:8629 · squadCoverPool:8630 · SQ_TURN:8640 · angWrap:8645 · turnTo:8647 · easeLook:8652
squadTarget:8657 · pickSquadDest:8669 · tickSquadMove:8683 · tickSquad:8709 · CALL_DIST:8763 · CALL_NEAR:8764
CALL_GAP_ALL:8765 · CALL_GAP_ONE:8766 · CALL_GAP_DIR:8767 · CALL_MS:8768 · CALL_LINES:8769 · CALL_SECTORS:8780
bearingKey:8783 · clearSquadBubble:8791 · callSprite:8797 · squadShout:8809 · tickSquadCalls:8822 · CHAT_GAP_ALL:8849
CHAT_LINES:8850 · tickSquadChatter:8856 · heliFireAt:8873 · nearestFighterTo:8885 · tickHelis:8891 · DAY:8940
NIGHT:8942 · collectMsMats:8946 · CYCLE_MS:8957 · MODE_ICON:8959 · STORM_MS:8966 · buildStars:8973
buildStreetLamps:8996 · glowTex:9014 · tickStreetLamps:9022 · beamPair:9039 · tickSearchBeams:9050 · buildBarrelFires:9087
tickBarrels:9105 · tickShootingStar:9115 · buildMist:9140 · tickMist:9150 · tickNightSound:9193 · tickSneak:9202
tickStorm:9213 · nvReady:9229 · nvEnter:9230 · nvExit:9236 · tickNvHint:9237 · dropGlowStick:9246
tickGlowSticks:9263 · buildFlashlight:9272 · setNight:9277 · setDayMode:9278 · tickNight:9292 · applyNightLook:9324
tickFlashlight:9364 · MSB_FIRST:9394 · MSB_GAP:9395 · MSB_WARN:9396 · MSB_KILL_WARN:9397 · MSB_NEAR:9398
MSB_FLEE:9399 · MSB_R:9400 · MSB_HOLD:9401 · MSB_MAX:9402 · MSB_DEAD_MS:9403 · MSB_BEEP:9404
MSB_COVER_R:9407 · MSB_PAD_R:9408 · MSB_COVER_RECHECK:9409 · msbEnsure:9414 · msbPlace:9431 · msbBarPos:9440
msbHide:9447 · resetMsBeam:9451 · msbCoverAt:9466 · msbAimBeside:9487 · msbBegin:9493 · msbAim:9510
msbStrike:9541 · msbKill:9580 · msbKickOut:9593 · tickMsBeam:9603 · TURBO_EVERY:9656 · TURBO_MS:9657
TURBO_MUL:9658 · TURBO_N:9659 · TURBO_TRACK:9660 · resetTurbo:9662 · turboPick:9667 · turboBegin:9674
tickTurbo:9686 · fit:9697 · tick:9703 · frame:9711 · build:9775 · start:9857
exitWorld:9984

## js/lobby.js (52 บรรทัด · 3 รายการ)
PANEL_TITLES:9 · openPanel:19 · closePanel:29

## js/lobby3d.js (780 บรรทัด · 0 รายการ)

## js/main.js (428 บรรทัด · 6 รายการ)
syncMusicBtn:110 · showQuizBackPay:146 · showGiantRefund:191 · showTicketRefund:232 · fitQbp:272 · bootGame:286

## js/moto3d.js (2,776 บรรทัด · 143 รายการ)
### 🗂️ สารบัญโซน js/moto3d.js (Read/Edit เฉพาะช่วง)
- 91-296 🚗🏙️ รอบ 785: ยกการขับจาก "โลกขับรถเมืองกำแพงเพชร" มาทั้งชุด (เฉพาะ vehicle==='car')
- 297-514 DOM เครื่องเกมพกพา (สร้างครั้งเดียว · CSS ฉีดเอง ไม่แตะ style.css)
- 515-544 🚗🏙️ รอบ 785: ห้องคนขับ + ปุ่มบังคับชุดโลกเมือง (โผล่เฉพาะ .car — โหมดมอไซค์ไม่เห็นอะไรเลย)
- 545-770 🪞📷 รอบ 810: กระจกมองหลัง+ข้าง (เฉพาะโหมดรถยนต์ในห้องคนขับ) — ภาพจริงจากกล้อง 3D ตัวที่ 2/3/4
- 771-867 🚗🏙️ รอบ 785: ห้องคนขับ (หน้าปัด/พวงมาลัย/เข็มเกจ) + ปุ่มเกียร์ — เฉพาะโหมดรถยนต์
- 868-896 🪞📷 รอบ 810: กระจกมองหลัง/ข้าง — เรนเดอร์ฉากเดิมซ้ำด้วยกล้องหันหลัง/เฉียงข้าง แล้วยัดลงแถบบนจอ (scissor)
- 897-964 🎵📻 รอบ 810: วิทยุในรถ — จอ head-unit (visualizer + แผงเลือกเพลง) พอร์ตจาก adventure3d.js ทั้งชุด
- 965-1205 ถนนจากแผนที่จริง → geometry + ตารางแฮชชนถนน
- 1206-1545 ฉาก: พื้น/โรงเรียน/ป้ายหมู่บ้าน/ต้นไม้/เมฆ/บ้านหมู่บ้าน
- 1546-1603 🐕 รอบ 312: หมาวิ่งตัดถนน — โผล่ข้างถนนข้างหน้ารถ วิ่งตัดผ่านเร็ว · ชน = ปรับ 100 เหรียญ (รอบ 643: ลดจาก 500)
- 1604-1737 🪙 รอบ 317: เหรียญบนถนน — pool ลอยเหนือเลนซ้าย รีไซเคิลรอบผู้เล่นตลอด
- 1738-1770 🏍️🚗 รอบ 317: โมเดลยานพาหนะ 3D (ใช้ทั้งรถเราเองโหมด car และรถ/มอไซค์ของเพื่อน)
- 1771-1867 🚗 รอบ 394: โมเดลรถจริง img/models/car_01.glb ในแผนที่บ้านโพธิ์สวัสดิ์
- 1868-2095 🧑‍🤝‍🧑 รอบ 317: เพื่อนในแผนที่เดียวกัน (/world/moto/<uid>)
- 2096-2137 🏟️👥 รอบ 640: งบวาดตัวเพื่อน (ใช้ NetRoom.drawBudget ร่วมกับโลกอื่น)
- 2138-2312 คำศัพท์ + ตัวอักษรบนถนน
- 2313-2626 สร้างโลกครั้งเดียว + ลูปเกม
- 2627-2776 เข้า/ออกโลก
### รายการ js/moto3d.js
REWARD:7 · ACCEL:8 · DASH_LEN:9 · DOG_HIT_COIN:10 · FEAT_SP:12 · DECAL_N:13
GRAV:14 · SUSP_K:15 · ROAD_WIDE:16 · EDGE_M:17 · ROAD_TEX_S:18 · POST_N:19
LEAN_MAX:20 · COLLECT_R:21 · SPAWN_MIN:22 · SCATTER_MS:23 · LETTER_COPIES:24 · BUCKET:25
TILE_COLORS:26 · LETTER_COIN:28 · COIN_VAL:32 · COIN_GAP:33 · COIN_SPIN_SPD:35 · COIN_TIERS:38
EMERALD_TIER:45 · HARD_LAND:46 · COIN_CURVE_RAD:47 · NET_SEND_MS:49 · PEER_COLORS:50 · CHAT_MS:52
CHAT_PRESETS:53 · CAR_EYE:102 · CAR_ACCEL:103 · CAR_VMAX:104 · CAR_WB:105 · MIRROR_REAR:115
RADIO_RECT:120 · CAR_RADIO_RECT:121 · carRadioRect:127 · sndKick:235 · ENG_FILES:245 · CSS:300
buildDom:617 · loadCarDash:776 · loadCarWheel:788 · setGear:798 · setCam3:804 · syncGearUi:811
carDial:820 · drawCarGauge:850 · mirrorPass:873 · drawCarMirrors:885 · radioLayout:901 · radioSetHint:925
renderRadioList:931 · radioToggleList:941 · drawRadioViz:946 · segKey:968 · smoothPts:971 · featKey:987
addFeat:988 · genFeatures:993 · terrainAt:1012 · roadGroundY:1025 · decalTex:1033 · makeDecals:1052
decalTick:1061 · buildRoads:1078 · distToSeg:1174 · roadInfo:1179 · onRoad:1185 · randomRoadPoint:1186
TXT_SPR_H:1211 · makeTextSprite:1212 · letterTexture:1227 · woodTileMat:1242 · muralTexture:1253 · buildSchool:1265
buildScenery:1411 · scatterTrees:1490 · postTick:1510 · scatterClouds:1537 · makeDog:1549 · spawnDog:1564
dogHit:1574 · dogTick:1590 · coinTexture:1608 · makeCoins:1619 · loadCoinImg:1625 · addCoin:1637
clearCoins:1645 · addFreeCoin:1649 · coinTierAt:1657 · coinFx:1667 · grabCoin:1676 · coinTick:1693
scatterCoinTick:1709 · placeSpecialCoin:1727 · makeVehicle:1742 · mCarSplitWheel:1779 · mCarEnsure:1805 · mCarMat:1822
mCarBuild:1835 · mCarCode:1862 · netReady:1874 · netJoin:1880 · netSend:1893 · sendChat:1907
showPeerBubble:1917 · removePeerBubble:1924 · BOARD_MS:1937 · renderBoard:1939 · peerColor:1990 · buildPeer:1994
onPeer:2018 · dropPeer:2061 · netLeave:2068 · peerTick:2073 · PEER_DRAW_MAX:2101 · drawnPeers:2102
drawSlotFree:2103 · showPeerAgain:2104 · hidePeer:2111 · tickDrawBudget:2116 · spawnSlot:2124 · pickWord:2141
spawnLetters:2151 · renderWordHud:2169 · WORD_MIN_K:2180 · fitWord:2181 · collectTick:2208 · completeWord:2232
relocTick:2257 · gpsTick:2272 · miniTick:2281 · build:2316 · applyVehicleUi:2353 · fit:2382
tick:2392 · carDrive:2402 · frame:2451 · start:2630 · exitWorld:2703

## js/music.js (205 บรรทัด · 0 รายการ)

## js/netroom.js (811 บรรทัด · 19 รายการ)
CFG:41 · roomsAllowed:63 · HOT_KEYS:71 · COLD_KEYS:72 · HOT_BACK:73 · splitPayload:77
mergeBack:88 · metUids:100 · AIM_TTL_MS:119 · aimAt:121 · aimGet:125 · aimClear:129
MAPS3D:135 · whereFriends:136 · dbOf:160 · envReady:161 · isDenied:164 · create:176
drawBudget:784

## js/online.js (2,050 บรรทัด · 110 รายการ)
### 🗂️ สารบัญโซน js/online.js (Read/Edit เฉพาะช่วง)
- 2-229 ENGINE: ระบบออนไลน์จริงผ่าน Firebase Realtime Database
- 230-325 ระบบเพื่อน (ข้อ 0.3): รหัสเพื่อน + ค้นหา + ส่ง/รับคำขอ
- 326-515 ระบบแชทกับเพื่อน (ข้อ 0.4)
- 516-687 ระบบส่งของขวัญ (ข้อ 0.5)
- 688-804 🏪 ตลาดออนไลน์จริง (item 2 backlog): ซื้อ-ขายสินค้าที่เพื่อน "ผลิตเอง" ข้ามผู้เล่น
- 805-869 คำเชิญเล่นโลก 3D ด้วยกัน — /tinv/<toUid>/<fromUid> = {map,n,ts}
- 870-1066 📰 Follow + Feed กิจกรรม (รอบ 155) · 🌍 หน้า Feed ทุกคน + ไลก์/คอมเมนต์ (รอบ 639)
- 1067-1074 🌍 หน้า Feed ทุกคน + ไลก์/คอมเมนต์ (รอบ 639)
- 1075-1217 📰 รอบ 701 — ฟีดล็อบบี้ทีละโพสต์ + รีแอ็กชัน + แจ้งเตือน (ต่อยอดรอบ 639)
- 1218-1450 🔔📥 รอบ 976 — เก็บแจ้งเตือนไลก์/คอมเมนต์ลง DB โซนใหม่ /gnotif/<uid>
- 1451-2050 📞 โทรหาเพื่อน — Voice call / Video call แบบ LINE (รอบ 625 · กลุ่ม 3 คนรอบ 631)
### รายการ js/online.js
ONLINE_STALE_MS:72 · ONLINE_BEAT_MS:73 · LEADERBOARD_SIZE:74 · LEADERBOARD_QUERY_SIZE:75 · onlineDisplayName:79 · onlineActivity:87
ensureOnlineId:107 · onlineKey:117 · onlinePushPresence:122 · onlinePushScore:132 · fetchPlayerStats:180 · onlineRerender:202
notifyFriendBadges:214 · FRIEND_ALPHA:240 · friendCode:241 · friendSearch:253 · friendRequest:277 · friendAccept:288
friendDecline:300 · friendsHeal:310 · CHAT_MAX_LEN:334 · CHAT_KEEP:335 · chatPairId:337 · chatRef:340
chatListen:346 · chatSend:362 · chatDeleteMsg:378 · TYPING_TTL:386 · typingRef:388 · chatSetTyping:389
chatClearTyping:399 · chatWatchTyping:407 · chatThemeRef:425 · chatSetTheme:426 · chatWatchTheme:431 · chatPrune:439
chatSeenTs:456 · chatMarkSeen:462 · chatUnreadCount:474 · chatWatchSync:477 · GIFT_EXPIRE_MS:527 · giftSend:530
greetSend:548 · giftAccept:562 · giftDecline:566 · giftInWatch:572 · giftReclaim:603 · giftOutWatchSync:613
giftOutRebuild:668 · salesWatch:698 · salesRerender:706 · sellInc:710 · marketWatch:718 · marketList:751
marketUnlist:759 · marketBuy:768 · marketSoldWatch:781 · tinvSend:810 · tinvClear:817 · tinvPartyTick:825
TINV_WORLD_LABEL:847 · tinvWatch:851 · FEED_MAX:878 · feedEvent:881 · feedPrune:893 · feedPurgeCat:904
feedPushAssets:915 · petDescriptor:933 · feedPushPets:939 · fetchPlayerPets:953 · followSet:969 · followUnset:980
feedRebuild:987 · feedWatchSync:999 · fetchPlayerFeed:1026 · fetchPlayerAssets:1039 · fetchFollowers:1058 · GFEED_READ:1084
GFEED_KEEP_ME:1085 · gfeedPush:1088 · gfeedPrune:1102 · gfeedParse:1115 · gfeedWatchStart:1144 · gfeedWatchStop:1171
gfeedNotifDiff:1179 · gfeedNotifPush:1214 · GNOTIF_KEEP:1242 · GNOTIF_QUIET:1244 · gnotifKeyOf:1247 · gnotifSend:1254
gnotifAdd:1267 · gnotifRecount:1287 · gnotifMarkSeen:1292 · gnotifWatchStart:1303 · gnotifListen:1312 · gnotifWatchStop:1330
gnotifPrune:1335 · uidDisplayName:1348 · gfeedRebuild:1359 · gfeedToggleLike:1376 · gfeedSetReaction:1381 · gfeedToggleCommentLike:1397
gnotifTellComment:1415 · gfeedAddComment:1427 · CALL_RTC_CFG:1475 · CALL_RING_MS:1476 · CALL_MAX_MS:1477 · CALL_MAX_PEERS:1478
onlineStart:1894 · onlineLoadSDK:2025

## js/petbehavior.js (182 บรรทัด · 0 รายการ)

## js/photo.js (361 บรรทัด · 25 รายการ)
PHOTO_LS_KEY:12 · PHOTO_MAX:13 · PHOTO_PREFIX:14 · PHOTO_SIZES:15 · PHOTO_QS:16 · PHOTO_ZMAX:17
photoValid:25 · photoOnline:28 · photoGet:31 · photoHas:32 · photoIsMine:33 · photoOf:36
photoFetch:44 · photoAfterChange:61 · photoPush:65 · photoVerify:83 · photoSaveUrl:93 · photoRemove:99
photoPullMine:106 · photoBlkSrc:122 · photoMiniHTML:129 · openPhotoMenu:137 · photoLoadImgEl:203 · photoLoadFile:211
openPhotoCrop:224

## js/picdict.js (349 บรรทัด · 0 รายการ)

## js/picmatch.js (592 บรรทัด · 0 รายการ)

## js/picquiz_online.js (603 บรรทัด · 0 รายการ)

## js/pmaward.js (28 บรรทัด · 0 รายการ)

## js/sgaward.js (28 บรรทัด · 0 รายการ)

## js/shootword.js (1,085 บรรทัด · 0 รายการ)

## js/state.js (1,220 บรรทัด · 94 รายการ)
### 🗂️ สารบัญโซน js/state.js (Read/Edit เฉพาะช่วง)
- 2-222 STATE + LocalStorage + กติกากลางของเกม
- 223-661 👍 รอบ 701: รีแอ็กชันฟีด (กดค้างปุ่มถูกใจแล้วเลือกได้เหมือน Facebook)
- 662-717 Daily Quest (item 3 backlog): ภารกิจรายวัน 3 อย่าง สุ่มตามวันที่
- 718-791 มูลค่าทรัพย์สินสุทธิ (net worth) — ฐานของระบบแรงค์
- 792-841 🚫🍽️ สัตว์ป่วยเพราะหิว = ซื้อของกินไม่ได้ (รอบ 952)
- 842-935 เครื่องยนต์บิลรายเดือน (กลาง — ค่าบำรุงบ้านตอนนี้ / ค่าไฟ-น้ำ-เน็ต เสียบเพิ่มได้)
- 936-1060 🍖 เงินค่าอาหารสัตว์รายเดือน — ทุกวันที่ 1 ของเดือน จ่ายตามจำนวนสัตว์ที่เลี้ยงอยู่
- 1061-1220 โรงงานผลิตสินค้า: จ่ายค่าผลิตด้วย "แต้มคำศัพท์"
### รายการ js/state.js
STORAGE_KEY:6 · QUIZ_PASS_REWARD:11 · CURE_COST:13 · HUNGRY_SICK_MS:14 · MEAL_HOUR:16 · MEAL_FULL:17
SLEEP_FROM_HOUR:18 · SLEEP_SICK_HOUR:19 · WAKE_HOUR:20 · DINNER_COST:21 · TOXIN_FULL:23 · DETOX_COST:24
FOODQUIZ_Q:26 · FOODQUIZ_COIN:27 · FOODQUIZ_BONUS:28 · FOODQUIZ_MAX_PLAYS:29 · SHAPE_JUNK_MEALS:31 · SHAPE_CLEAN_MEALS:32
SHAPE_MISS_MEALS:33 · SHAPE_EXP_BONUS:34 · HEAT_SICK_MS:35 · THIRST_SICK_MS:36 · DEFAULT_STATE:38 · FEED_CATS:215
FEED_REACTIONS:229 · feedRx:237 · FEED_QUICK_CM:239 · SLOT_MS:251 · currentSlotStart:252 · nextSlotStart:258
mealDayKey:260 · nightKeyOf:262 · isNightNow:270 · newPet:275 · loadState:300 · saveState:622
activePet:629 · petStage:630 · isAdult:635 · abilityOn:636 · hasPetType:637 · todayStr:640
dailyTick:644 · addCoins:647 · QUEST_POOL:667 · QUEST_PER_DAY:676 · questsToday:677 · questTick:684
questEvent:688 · assetValue:724 · netWorth:744 · assetCount:746 · refreshRank:763 · heatProtected:779
rainProtected:783 · petHungry:786 · petCanEat:790 · hungerSickLock:798 · hungerSickMsg:806 · petShapeOf:814
updatePetShape:820 · shapeMealDone:827 · heatPct:837 · ymStr:846 · billOutstanding:850 · UTILITIES:857
HOME_UTILITIES:863 · homeDecayed:865 · billTick:868 · PET_FOOD_PER_PET:940 · petFoodTick:941 · myCar:967
carLoanDue:972 · carLoanOverdue:977 · carLoanPayable:982 · carLoanPay:989 · compTick:1002 · ONLINE_RATE:1016
onlineEarnActive:1017 · onlineEarnTick:1021 · onlineEarnFlush:1032 · marketTick:1042 · addCraft:1066 · ORDER_MAX:1085
ORDER_LIFE_MS:1086 · ORDER_GAP_MIN_MS:1087 · ORDER_GAP_SPAN_MS:1088 · ORDER_TIER_WEIGHT:1089 · newOrder:1090 · orderTick:1103
careTick:1111 · expNeed:1191 · addExp:1196 · addRP:1216

## js/thaitime.js (52 บรรทัด · 13 รายการ)
TH_TZ_MIN:22 · TH_DAY_MS:23 · thShift:28 · thMs:30 · thDate:31 · thHour:32
thHourF:33 · thDayKey:34 · thDayStart:35 · thAtHour:39 · thTs:40 · TH_TZ_OPT:45
thLocaleOpt:46

## js/tpaward.js (41 บรรทัด · 0 รายการ)

## js/typing.js (370 บรรทัด · 0 รายการ)

## js/ui.js (9,167 บรรทัด · 379 รายการ)
### 🗂️ สารบัญโซน js/ui.js (Read/Edit เฉพาะช่วง)
- 2-77 UI: Dashboard / ร้านค้า / ที่พัก / ร้านสัตว์เลี้ยง / แรงค์ / สถิติ
- 78-344 🎬 เวทีน้องน่ารัก (Cute Pet Show) — รอบ 604 (ผู้ใช้สั่ง 26 ก.ค. 2026)
- 345-638 🆕 New Word (รอบ 116): คำศัพท์ใหม่ 1 คำ/การ login ตามระดับชั้น
- 639-663 นาฬิกาใต้ชื่อผู้เล่น (วัน · วันที่ · เวลา อัปเดตทุกวินาที)
- 664-703 ข้าวเย็นของผู้เล่น (กิจกรรมเสริม)
- 704-735 แถบฝนประจำวัน: นับถอยหลังถึง 19:00 ทุกวัน (ฝนตก 1 ชม.)
- 736-788 เอฟเฟกต์ฝนเต็มจอ (รอบยี่สิบ): ฝนตกจริง (19:00-20:00) + ไม่มีบ้านสภาพดี
- 789-809 การ์ด "คนที่กำลังทำการบ้านไปพร้อมๆ กับเรา"
- 810-864 รอบ 149: กล่อง aside ขวาเลื่อนวนอัตโนมัติ (ล่าง→บน) ไม่มี scrollbar
- 865-1254 Daily Quest (item 3): การ์ดภารกิจวันนี้ใน aside ขวา
- 1255-1347 รอบ 153: เมนูลัดแตะแถวเพื่อนออนไลน์ในกล่อง aside
- 1348-2004 การ์ด Leaderboard — สลับแท็บในการ์ดเดียว (ประหยัดพื้นที่):
- 2005-2389 การ์ดข้อมูลผู้เล่น 👤 — คลิกชื่อในการ์ดเพื่อน/กระดาน แล้วโชว์
- 2390-2639 แผงเพื่อน 👥 (ข้อ 0.3): รหัสเพื่อน + ค้นหา + คำขอ + รายชื่อเพื่อน
- 2640-2735 🌍 เพื่อนอยู่โลก 3D ไหน + ปุ่ม "ตามเข้าไป" (รอบ 642)
- 2736-2774 แชทกับเพื่อน (ข้อ 0.4) — กล่องแชทลอยกลางจอ + แผง emoji
- 2775-3176 รอบ 179: หน้ารวมข้อความ (inbox แบบ Messenger — ธีมกระจกฟ้า sci-fi ของเกม)
- 3177-3537 ระบบส่งของขวัญ (ข้อ 0.5) — ห้องของขวัญ + กล่องเลือกส่ง + ฉากเปิด
- 3538-3630 RANK CARD + ฉากเลื่อนแรงค์
- 3631-3633 PET DASHBOARD
- 3634-3703 📰 รอบ 155: overlay ข้อมูลน้อง & การดูแล + ฟีดกิจกรรมเพื่อน
- 3704-4325 📰 รอบ 701 — ฟีดล็อบบี้ "ทีละโพสต์" แบบ Facebook (ผู้ใช้สั่ง 29 ก.ค. 2026)
- 4326-4520 🌍 รอบ 639: หน้า Feed เต็มจอ — ทุกคน (ไม่ใช่แค่ follow) + ไลก์/คอมเมนต์
- 4521-5198 📖 Dictionary ค้นหาคำศัพท์ (รอบ 254 ผู้ใช้สั่ง 16 ก.ค. 2026)
- 5199-5242 การนอน (คิว 7725691507 ข้อ 1)
- 5243-5665 ให้อาหาร (ระบบมื้อเย็น 18:00 + ความอิ่มสะสม — ข้อ 2+3)
- 5666-5784 🛡️ ควิซอาหารปลอดภัย (ต่อยอดข้อ 5.1)
- 5785-5870 🎀 ห้องแต่งตัวสัตว์เลี้ยง (รอบ 635: แยกออกจาก "ร้านค้า" เดิม —
- 5871-6058 ที่พัก (หลบแดด/หลบฝน) + เครื่องปรับอากาศ
- 6059-6176 บิลสาธารณูปโภค (ค่าไฟ/ค่าน้ำ — เครื่องยนต์อยู่ใน state.js: UTILITIES/billTick)
- 6177-6259 การ์ดมือถือ (ข้อ 7): ซื้อ 10,000 ขายคืน 6,000
- 6260-6270 การ์ดคอมพิวเตอร์ (ข้อ 11): ซื้อ 50,000 ขายคืน 30,000
- 6271-6315 item 8: โบนัสออนไลน์ +0.01 เหรียญ/วิ ฟรีทุกคนที่เปิดเกมออนไลน์อยู่
- 6316-6576 💻 รอบ 706 (ผู้ใช้สั่ง 29 ก.ค. 2026): ช่องรายได้คอมพิวเตอร์บนแถบบนล็อบบี้
- 6577-6922 🌀🔤 รอบ 1045 — Vocab Arena (โลกผจญภัยฉบับใหม่)
- 6923-6941 🌍 ปุ่มลัดเข้าโลก 3D ในรางเมนูซ้าย (ผู้ใช้สั่ง 9 ก.ค. 2026)
- 6942-7079 🔒 รอบ 1070: โลกที่ยังไม่เปิดสาธารณะ — เปิดให้บัญชีทดสอบ 2 ชื่อเท่านั้น
- 7080-7243 🧭 ป้ายบอกทางของรางเมนูซ้าย (รอบ 601 · ผู้ใช้สั่ง 26 ก.ค. 2026)
- 7244-7413 การ์ดสวนผลไม้ (ข้อ 12): ซื้อต้นไม้ปลูกได้ไม่จำกัด แต่ละต้นออกผล
- 7414-7423 โรงงานผลิตสินค้า 🏭 + ตลาดขายต่อ (แนวคิดใหม่ 5 ก.ค. 2026)
- 7424-7446 โรงงานผลิต (แผง 🏭) — แยกออกจากตลาด (ผู้ใช้สั่ง 6 ก.ค. 2026)
- 7447-7599 ตลาดขายสินค้า (แผง 🏪) — แยกออกจากโรงงาน
- 7600-8524 🚗 รอบ 131: หมวดยานพาหนะ — โชว์รูมรถ 10 คัน (แคตตาล็อก 5 ช่อง/แถว)
- 8525-8585 ร้านสัตว์เลี้ยง (ซื้อเพิ่มได้ ไม่ลบตัวเดิม)
- 8586-8622 เลเวลอัพ (รายตัว)
- 8623-8728 สถิติผลการเรียนรู้
- 8729-8766 item 4: การ์ดสรุปส่งครู — ใบเดียวจบ ชื่อ/วัน-เวลา/เหรียญวันนี้/แรงค์/สอบล่าสุด
- 8767-9167 📞 หน้าจอโทรหาเพื่อน — สายเสียง (รอบ 625 · กลุ่ม 3 คน + ปิดวิดีโอ รอบ 631)
### รายการ js/ui.js
startHTML:10 · PET_ANIM:30 · petAnimHTML:35 · petVisualHTML:50 · PET_SHOW:91 · PET_SHOW_STAGE:96
PET_SHOW_H:99 · petShowBgHTML:102 · petClipHint:145 · __clipReady:157 · PET_SHOW_SEQ:165 · petShowSeqHTML:180
petShowHTML:199 · PROF_AV_MAX:265 · lobbyBlk:266 · caretakerFigureHTML:273 · footAlign:283 · heroRankBgHTML:317
NEW_WORD_MS:351 · newWordNext:357 · renderNewWord:368 · NW_GAP:406 · alignNewWord:407 · startNewWordTimer:424
nwCountdownTick:441 · PAT_REMIND_HOUR:457 · patRemindTick:458 · applyPatRemindGlow:479 · NEW_WORD_COIN:494 · NW_DAILY_GOAL:495
NW_DAILY_BONUS:496 · newWordReward:497 · nwDailyTick:520 · coinFlyFx:539 · nwDailyBarHTML:572 · showNewWordPopup:583
renamePet:610 · mealLabel:627 · fmtMins:633 · renderClock:642 · selfName:668 · selfNameHTML:673
dinnerDue:674 · renderDinnerChip:679 · dinnerClick:687 · renderRainBar:707 · rainFxTick:740 · RAIN_DROP_IMGS:763
rainFxDrop:764 · selfPronoun:796 · selfTag:801 · idTag:805 · SIDE_SCROLL_SPEED:815 · SIDE_SCROLL_RESUME:816
initSideScroll:819 · sideScrollTick:847 · QUEST_FLASH_HOLD:871 · QUEST_SLIDE_MS:878 · QUEST_RESUME_MS:879 · questGo:882
SIDE_TALL_MIN:894 · sideIsTall:895 · qBigCardHTML:900 · qDeckGo:920 · qDeckTick:940 · renderQuestCard:961
sideFlashRows:1021 · FRIEND_FLASH_GRACE:1039 · ONLINE_FLIP_MS:1047 · ONLINE_FLIP_RESUME:1048 · ONLINE_SWIPE_STEP:1049 · ONLINE_ROW_H:1056
onPerPage:1059 · onChunk:1065 · ONLINE_GAP_MAX:1075 · onPageSpread:1076 · onPageDraw:1085 · onPageFlip:1096
bindOnlinePager:1107 · drawOnlineTicker:1144 · renderOnlineCard:1152 · bindInviteCards:1262 · bindFriendQuickMenu:1282 · openFriendQuickMenu:1292
LB_TABS:1355 · LB_ASSET_TOP:1356 · LB_WS_TOP:1357 · LB_PM_TOP:1358 · LB_TP_TOP:1359 · LB_BB_TOP:1360
LB_SG_TOP:1361 · bindLbTabs:1363 · updateRankRailBadge:1414 · rankUpCheck:1433 · rankUpSound:1461 · renderLeaderboardCard:1472
bindLbGroupOpen:1503 · lbRankRows:1515 · LB_BCAT_TOP:1586 · lbBadgeSections:1591 · lbDemoRows:1617 · lbChar:1639
lbfAwardBarHtml:1649 · openLeaderboardFull:1665 · BLK_PAD:1801 · BLK_PAD_NEW:1806 · BLK_TOP_FIX:1807 · seatPodChars:1808
lbCoinHtml:1820 · lbBadgeHtml:1836 · lbBossHtml:1862 · lbWordSearchHtml:1885 · lbTypingHtml:1921 · lbBubbleHtml:1953
lbShootHtml:1975 · bindPlayerClicks:2010 · showPlayerCard:2020 · bindProfileBadgeScroll:2301 · petDescImg:2319 · openImgLightbox:2332
openPetPeek:2352 · updateBillBadges:2396 · setBadge:2406 · tinvPendingCount:2422 · updateSettingsBadge:2431 · openAttentionSummary:2446
updateFriendBadge:2503 · renderFriendPanel:2513 · friendDoSearch:2561 · refreshFriendData:2585 · FRW_TTL_MS:2650 · FRW_MIN_GAP:2651
frwWorldOf:2655 · frwPanelOpen:2658 · frwScan:2663 · frwPaint:2685 · frwPaintHint:2706 · frwFollow:2720
CHAT_EMOJI_CATS:2741 · CHAT_THEMES:2763 · CHAT_SECRET_MS:2772 · chatBadgeSync:2780 · ibTimeStr:2788 · IB_CALL_RE:2797
ibCallInfo:2798 · openChatInbox:2803 · chatFitKeyboard:2973 · openChat:2989 · giftImg:3180 · giftDateStr:3182
GREETS:3190 · GREET_EXP:3198 · greetInfo:3199 · openGreetPicker:3203 · giftItemPic:3247 · foodGiftBlocked:3257
giftItemName:3263 · updateGiftBadge:3269 · renderGiftPanel:3278 · acceptGift:3336 · declineGift:3359 · showGreetReveal:3368
showGiftReveal:3395 · openGiftPicker:3421 · confirmSendGift:3489 · doSendGift:3515 · rankBadgeHTML:3541 · renderRankCard:3546
renderRankTab:3580 · showRankUp:3608 · bindPetPlateButtons:3643 · openPetInfoOverlay:3673 · feedAgo:3696 · FEED_DECK_MAX:3716
FEED_SLIDE_MS:3717 · FEED_RESUME_MS:3718 · feedPostImgIndex:3723 · feedPostImg:3734 · feedPostByKey:3743 · feedCanReact:3746
fpStatsHTML:3751 · fpNameBadgesHTML:3767 · fpostHTML:3771 · renderFeedCard:3806 · feedDeckGo:3844 · feedDeckTick:3864
renderFeedBell:3886 · FNT_JUMP:3895 · fntGiftName:3901 · feedNotifText:3905 · feedNotifGo:3920 · feedNotifArrived:3935
openFeedNotif:3942 · closeRxPicker:3997 · openRxPicker:4001 · feedFlyWord:4021 · feedPickRx:4032 · FCM_REP_SHOW:4047
FCM_FOCUS_POST:4048 · openFeedComments:4050 · closeFeedComments:4072 · fcmRowHTML:4081 · showCommentLikers:4104 · fcmTreeHTML:4126
renderFeedComments:4151 · bindFeedPostEvents:4279 · openFeedBoard:4332 · renderFeedBoardLive:4353 · renderFeedBoard:4371 · stageColLeft:4390
alignPetTabs:4399 · alignFeedPlate:4411 · alignProfilePlate:4427 · COIN_K_MIN:4445 · alignCoinBlock:4446 · alignStageLeft:4474
laneModeOn:4486 · alignStageCols:4499 · watchStageCols:4513 · dictRecordLookup:4532 · DICT_FILE_COUNT:4543 · loadDict:4544
dictSearch:4559 · dictTapWords:4574 · dictEntryHTML:4578 · openDictOverlay:4589 · renderDashboard:4673 · sleepBtnHTML:5204
sleepHintHTML:5211 · sleepAllPets:5222 · wakeAllPets:5235 · feedPet:5246 · openFoodMenu:5260 · feedWith:5351
AVATAR_UI:5381 · playerAvatarHTML:5385 · SHAPE_UI:5393 · showFeedResult:5402 · curePet:5443 · heartsFx:5473
PAT_HOLD_MS:5496 · PAT_EXP:5497 · bindPetTap:5498 · petBounce:5516 · petMood:5522 · shortPatPet:5529
longPatPet:5537 · patCalendarHTML:5557 · patDayKey:5591 · patStreakNow:5595 · patStreakTick:5600 · cureCelebrateFx:5625
railCureClick:5636 · detoxPet:5648 · openFoodQuiz:5671 · closeDressUpBoard:5790 · openDressUpBoard:5794 · renderShop:5811
homeVisualHTML:5874 · showHomeRuined:5888 · showCutNotice:5909 · renderHomeCard:5927 · payMaint:6011 · trashBillUI:6027
payTrash:6044 · UTILITY_UI:6063 · utilityBillUI:6112 · payUtility:6137 · buyUtilityFix:6163 · renderPhoneCard:6181
buyPhone:6221 · sellPhone:6243 · compLiveTotal:6264 · onlineLiveTotal:6275 · syncCoinHeader:6282 · flashPillGain:6287
renderOnlineEarnPill:6296 · renderCompEarnPill:6321 · openPillInfo:6354 · renderComputerCard:6437 · buyComputer:6472 · sellComputer:6495
soldCount:6516 · soldBadge:6517 · loadScriptOnce:6523 · advBusyMsg:6548 · advResetLoad:6560 · loadAdv3d:6566
loadVocabArena3d:6582 · enterAdventure3D:6586 · pickAdvMap:6608 · enterHaunted3D:6643 · enterHeli3D:6665 · pickHeliMap:6691
enterDrone3D:6727 · enterDrive3D:6746 · pickDriveMap:6784 · enterMotoMapAsCar:6820 · enterSoccer3D:6839 · enterMoto3D:6858
enterF1_3D:6880 · enterInvasion3D:6903 · WORLD3D:6930 · WORLD3D_COMING_SOON:6946 · world3DComingSoon:6947 · gotoRobotShop:6950
openHealDialog:6956 · world3DFail:6977 · railWorldClick:7008 · openWorldEntryDialog:7032 · railScrollHint:7085 · railScrollTop:7093
initRailScroll:7098 · renderRailWorlds:7118 · tinvNoticeHTML:7197 · openTinvPicker:7205 · fruitCountdown:7249 · renderFarmCard:7261
renderFarmClock:7336 · buyFruit:7352 · sellFruit:7372 · sellAllFruit:7393 · collectImg:7422 · renderFactoryCard:7428
renderMarketCard:7451 · updateWishBadge:7507 · openWishlistDialog:7518 · bindStripArrows:7563 · renderMarketBrowse:7577 · carImg:7606
renderVehicleShop:7607 · CS_CYCLE_MS:7658 · carInteriorImg:7659 · carStatHtml:7661 · renderCarShowroom:7668 · csShowBig:7695
csInit:7722 · RS_CYCLE_MS:7745 · robotImg:7746 · renderRobotShop:7747 · rsShowBig:7769 · rsInit:7790
buyRobot:7809 · enterMecha3D:7834 · pickMechaRobot:7861 · pickDriveCar:7893 · openCarBuyDialog:7936 · buyCarInsurance:7997
payCarLoanMonthly:8016 · payCarLoanFull:8028 · carDriveBlock:8047 · gotoVehicleShop:8052 · gotoMyStock:8057 · showNeedCarDialog:8063
craftDiscount:8075 · renderFactory:8078 · renderOrdersUI:8147 · startProduce:8166 · buyCollectible:8194 · cancelProduce:8224
deliverOrder:8238 · renderOrderClock:8255 · renderCollectMine:8265 · openListDialog:8307 · cancelListing:8360 · buyMarketItem:8383
showCollectReveal:8412 · buyAC:8450 · openHomeShop:8469 · renderPetShop:8528 · showLevelUp:8589 · renderStats:8626
showTeacherCard:8733 · CALL_REACT_EMOS:8777 · CALL_TALK_MIN:8780 · CALL_TALK_HOLD:8781 · CALL_ORDER_GAP:8783 · CALL_TONES:8789
startCall:9163

## js/util.js (1,287 บรรทัด · 51 รายการ)
### 🗂️ สารบัญโซน js/util.js (Read/Edit เฉพาะช่วง)
- 2-23 UTIL: เสียง / เอฟเฟกต์ / เครื่องมือทั่วไป
- 24-1256 🎖️ รอบ 643: สัญลักษณ์ระดับชั้น (ผู้ใช้สั่ง 28 ก.ค. 2026)
- 1257-1287 🖱️🚫 รอบ 833: กันกล่องดำ "To show your cursor, switch apps, reload the page…"
### รายการ js/util.js
shuffle:6 · fmtNum:15 · escapeHTML:19 · gradeSymbol:32 · gradeMark:47 · nameWithGrade:55
gradeMarkCanvas:61 · gradeOf:77 · seededRand:92 · fmtThaiDT:104 · fmtThaiDate:108 · IPHONE_LOBBY_VIEWPORT:118
fitIPhoneLobbyViewport:129 · showScreen:148 · TOAST_WARN_RE:159 · restackToasts:162 · clearWarnToasts:188 · toast:192
toastLink:219 · floatFx:237 · beep:248 · soundStatus:269 · PET_MOOD:385 · petVoiceSynth:392
sirenSynth:469 · playCashier:493 · cashierSynth:507 · keyTapSynth:540 · bubblePopSynth:578 · bubbleTapSynth:597
playSpark:608 · sparkSynth:622 · thunderFx:657 · wordAudioFile:725 · speakCutOff:734 · speakWord:738
speakLetter:777 · pickSpeakVoice:800 · speakWordTTS:811 · askNameDialog:838 · askConfirm:883 · alertBox:901
applyNoAnim:921 · BLK_VOCAB:928 · openSettings:976 · openHelp:1196 · openTeacherGuide:1222 · TAPGLOW_SEL:1246
TOUCH_INPUT_SEEN:1265 · mouseLockOK:1274 · lockMouse3D:1280

## js/vocabbook.js (207 บรรทัด · 14 รายการ)
VB_MAX:11 · VB_QUIZ_N:12 · VB_QUIZ_MIN:13 · vbGroup:16 · VB_GROUP_UI:21 · vbRecord:24
vbSeen:49 · vbStats:62 · vbList:70 · vbReviewCat:81 · vbStartReview:95 · openVocabBook:106
vbRender:148 · vbCardHTML:194

## js/wordsearch.js (455 บรรทัด · 0 รายการ)

## js/wsaward.js (32 บรรทัด · 0 รายการ)

## css/account-deletion.css (15 บรรทัด · 11 selector)
.account-delete-overlay:2 · .ad-box:3 · .ad-head:4 · .ad-warning:5 · .ad-grid:6 · .ad-shared:7
.ad-actions:8 · .ad-safe:9 · .ad-type-label:10 · .ad-busy:11 · .set-account-panel:12

## css/arena3d.css (201 บรรทัด · 62 selector)
#va-root:5,7,9 · #va-canvas:8 · .va-vignette:11 · .va-scan:15 · .va-top:18 · .va-glass:20
.va-exit:23,26 · .va-player-card:27,29 · .va-player-name:30 · .va-online:31 · .va-word-card:32,34,36 · .va-word-th:37
.va-word-en:38 · .va-word-slots:40,41,43 · .va-coins:44 · .va-shop-btn:46 · .va-energy:48,54 · .va-energy-label:50
.va-energy-track:51 · .va-energy-fill:52 · .va-energy-power:55 · .va-bag:57 · .va-bag-label:59 · .va-bag-list:60
.va-bag-letter:61 · .va-party:68,72,73 · .va-party-find:70 · .va-party-list:74,76 · .va-boss:78,80 · .va-boss-head:81,82
.va-boss-track:83 · .va-boss-fill:84 · .va-boss-word:85 · .va-downed:87,90,91 · .va-revive:92,94,95 · .va-skill:96,117,120,121(+9)
.va-hp:98,100,103 · .va-hp-track:101 · .va-hp-fill:102 · .va-stick:105,109,110 · .va-stick-knob:111 · .va-skills:115
.va-feed:136 · .va-feed-line:138,140 · .va-pop:142,144,145,148 · .va-modal:150,152 · .va-panel:153 · .va-panel-head:156
.va-panel-title:157 · .va-panel-coins:158 · .va-store-grid:160 · .va-store-item:161,163,164 · .va-store-ico:165 · .va-store-name:167
.va-store-price:168 · .va-intro-panel:169 · .va-intro-logo:170 · .va-intro-sub:172 · .va-intro-steps:173 · .va-intro-step:174
.va-start:176,178 · .va-portrait:180

## css/bubble.css (54 บรรทัด · 23 selector)
#bb-overlay:4 · #bb-board:5,9,10 · .no-anim:11,44 · .bb-head:12 · .bb-title:13 · .bb-stat:14,15
.bb-score:16,17 · .bb-close:18,19 · .bb-snd:20,23 · .bb-snd-track:21 · .bb-snd-thumb:22 · .bb-prompt:24
.bb-word:25,28 · .bb-ch:26,27 · .bb-thai:29 · .bb-hint:30 · .bb-stage:31 · .bb-bubble:32,36,37,38(+2)
.bb-tools:45 · .bb-tool:46,47 · .bb-fx:48 · .bb-coinpop:49,50 · .bb-empty:52

## css/exam.css (352 บรรทัด · 75 selector)
#xs-screen:8,33 · .xs-top:12 · .xs-badge:16 · .xs-mode:17 · .xs-time:18,19,21,22 · .no-anim:24
.xs-score:25 · .xs-quit:26 · .xs-nav:36 · .xs-dot:40,44,45,46(+1) · .xs-body:50 · .xs-pass:51,55,62
.xs-ptitle:56 · .xs-para:57 · .xs-pn:58 · .xs-qside:63 · .xs-sec:67,68 · .xs-q:69
.xs-qno:70 · .xs-choices:74 · .xs-ch:75,80,81,86(+5) · .xs-ab:82 · .xs-ex:94,95,99 · .xs-exh:100
.xs-exref:101 · .xs-foot:104 · .xs-count:108 · .xs-btn:109,113,114,115(+1) · .levelup-box:121 · .xs-result:122,123,124,125(+4)
.xsr-box:142 · .xsr-head:147,148 · .xsr-tabs:149 · .xsr-tab:150,154 · .xsr-list:155 · .xsr-none:156
.xsr-item:157,161 · .xsr-qh:162,163,164 · .xsr-q:168 · .xsr-ans:169 · .xsr-you:170,171,172 · .xsr-ex:173
.xsr-ref:174 · .xst-wrap:176 · .xst-note:177 · .xst-row:180,181,182,190(+1) · .xst-h:183 · .xst-tag:184
.xst-bar:186,189,192 · .xst-n:193 · .xst-sum:194 · .xsr-foot:198 · .xsr-ok:199 · .xsp-box:205
.xsp-head:210,211 · .xsp-rows:212 · .xsp-set:213,214 · .xsp-name:215 · .xsp-tick:216 · .xsp-info:217
.xsp-best-row:218 · .xsp-best:219 · .xsp-hist:221,222 · .xsp-hist-svg:223 · .xsp-btns:224 · .xsp-go:225,229,230,233(+1)
.xsp-foot:235 · .xsb-box:250 · .xsb-head:255,256 · .xsb-grid:257 · .xsb-card:258,262 · .xsb-emoji:263
.xsb-name:264 · .xsb-info:265 · .xsb-done:266

## css/lobby.css (5,680 บรรทัด · 787 selector)
:root:6,5408 · html:15 · body:21,5372,5414 · *:41,42,43,44 · #app:47 · h1:49
.subtitle:50 · .shop-title:51 · #rotate-overlay:54 · .screen:76 · #screen-select:85,86,87,88(+5) · .egg-need:95
.petshop-topright:97 · .petshop-play-link:98,103 · #screen-login:116,129,130,134(+12) · .login-lux:147 · .login-logo:148 · .login-tag:153
#screen-game:226,227,228,229(+7) · #screen-quiz:240,241,242,243(+6) · #quiz-choices:252,253 · .word-card:260 · .quiz-choice:261,262,263 · .big-btn:266,267,268,269
#screen-dashboard:274,1184,1192 · .lobby-top:288,923,924,925(+36) · .top-flex:289 · .profile-plate:290,294,844,3801(+12) · #rain-fx:299 · .rain-glass:303
.glass-drop:304 · .rain-vignette:323 · .no-anim:330,492,505,566(+59) · .rail-btn:333,945,951,953(+21) · .rail-badge:334 · .fr-code-box:339
.fr-code-label:343 · .fr-code-row:344 · .fr-code:345 · .fr-copy-btn:350,354,359,360 · .fr-search-btn:355 · .fr-add-btn:356
.fr-accept:357 · .fr-decline:358 · #fr-search-input:361 · #fr-search-result:365 · .fr-found:366 · .fr-hint:370
.fr-list-title:371 · .fr-row:372 · .fr-req:376 · .fr-row-name:378,382,5112 · .fr-row-status:386 · .fr-req-btns:387
.online-dot:388 · .fr-chat-btn:389,394,396 · .fr-unread:397 · .fr-call-btn:403,409 · .chat-overlay:418,424,425 · .chat-box:426,729,736,743(+12)
.chat-head:438 · .chat-theme-btn:443,447 · .chat-secret-tg:448,449 · .cs-switch:450,451,456,457 · .cs-slider:452,454 · .chat-secret-note:458
.chat-theme-strip:461 · .chat-theme-sw:463,466,467,468(+1) · .chat-head-name:470,473 · .chat-head-ava:472 · .chat-close:474 · .chat-msgs:478
.chat-empty:482 · .chat-typing:484 · .ct-dots:486,487,489,490 · .chat-bubble:493,498,503 · .chat-emoji:506 · .chat-emo:510,514
.chat-input-row:515 · .chat-emoji-btn:519 · #chat-input:523 · .chat-send:527,532,533 · .chat-call-btn:539,543 · .call-ring:546
.cr-card:550 · .cr-kind:556 · .cr-av:557 · .cr-name:567 · .cr-id:568 · .cr-btns:569
.cr-btn:570,576,581 · .cr-no:577 · .cr-ok:578 · .cr-safe:582 · .call-ov:585,591,613,630(+6) · .call-stage:597
.ctile:598,609,610 · .ct-face:602 · .ct-me:608 · .ct-nm:623,627 · .ct-sub:628 · .call-add:652
.ca-head:659 · .ca-list:660 · .ca-row:661,665 · .ca-dot:666,667 · .ca-nm:668,669 · .ca-go:670
.ca-empty:671 · .ca-safe:672 · .ca-close:673 · .call-bar:677 · .cb-btn:682,687,688 · .cb-end:689,690
.call-emos:691 · .call-emo:696,697 · .call-fx:699 · .call-fx-emo:700 · .pl-click:792,794,795 · .pl-overlay:796
.pl-card:800,2865 · .pl-close:806 · .pl-head:810,2633,2636 · .pl-grade:815,5118,5119 · .pl-body:816 · .pl-loading:817
.pl-none:818 · .pl-me-tag:819 · .pl-blk-wrap:821 · .pl-blk:822 · .pl-stat:823 · .pl-lbl:828
.pl-val:829,830 · .pl-tip:831 · .chip-edit:837,842,843 · .rank-mini:849,855,856,857 · .pass-photo:859,864 · .pet-tabs:866
.dict-box:867,871,872,873(+1) · .dict-card:879,884,888,889(+2) · .dict-head:885,886 · .dict-trail:893,897 · .dt-c:898,902,903 · .dt-sep:904
.dict-today:905 · .di-w:907,908,909 · .dict-list:910 · .dict-item:911,915,916,917(+5) · .lobby-mid:931 · .rail-wrap:934,979,990,991
.rail-scroll:936,973,977,978 · .lobby-rail:937,944 · .rail-nudge:980,988,989,992(+1) · .rail-worlds:999 · .rail-div:1000 · .lobby-stage:1044,1046,1062,1189(+13)
.newword-banner:1052,1059,1064,4466(+2) · .coin-fly:1075,1078 · .coin-plus:1084 · .nw-pop-coin:1099,1101,1102 · .nw-pop-goal:1105,1106,1110,1114 · .nw-goal-head:1107,1109,1111
.nw-goal-bar:1112 · .nw-goal-fill:1113 · .nw-pop-book:1115,1116 · .nw-tag:1137,4472,4494 · .nw-word:1142,4476,4499,4592 · .nw-hint:1144,1145,4477,4501(+1)
.nw-coin:1147,1150,4478,4482 · .nw-countdown:1155,4483 · .nw-bar:1157,4502 · .nw-bar-fill:1159 · .pet-stage:1162,3159 · .nw-box:1169,3168
.nw-pop-word:1170 · .nw-speak:1171 · .nw-pop-phon:1172 · .nw-ipa:1173 · .nw-pop-sent:1174 · .nw-pop-mean:1175
.pet-tab:1176,1177,1178,3604 · .stage-hero:1199,1214,1222,1367(+25) · .hero-ground:1236,1356,1362 · .hero-rank-bg:1238,1241,1244,1248(+18) · #lobby3d-canvas:1261,1262 · .hero-scene:1266,1268,1275,1276(+8)
.caretaker-fig:1315 · .caretaker-img:1318 · .caretaker-emoji:1320 · .blk-rig:1327,1328,1329 · .stage-plate:1389,1397,1408,1409(+23) · .plate-title:1403
.lobby-side:1436,1472,1477,1480(+22) · .side-sec:1439,2284,3499,3777 · .side-label:1440,1445 · .side-label-row:1448,1449 · .lb-tabs-out:1450,1451,1455 · .side-glass:1459,1466
.side-card:1478,1589 · #quest-card:1490,1491,1519,1520(+6) · .q-bigcard:1496,1525 · .qb-top:1498 · .qb-emoji:1499 · .qb-name:1501
.qb-bar:1502,1503 · .qb-row:1505 · .qb-prog:1506 · .qb-reward:1507 · .qb-go:1508,1512 · .q-dots:1513
.q-dot:1514,1515,1516 · .q-bonus:1517 · .inv-card:1536,1538,1539 · .inv-btns:1540 · .inv-go:1541,1543 · .inv-x:1544
#online-card:1548,3507,3508,3509(+7) · .fq-overlay:1549 · .fq-box:1551,3313 · .fq-head:1555,1557 · .fq-close:1558 · .fq-sec:1560
.fq-worlds:1561 · .fq-world:1562,1564 · .fq-acts:1565 · .fq-act:1566,1569,1570 · .lb-prize:1603 · .lb-coins:1606
.lbf-cell:1607,2712,2715,2716(+3) · .lb-award-bar:1609,1615,1616 · .lb-award-go:1617 · .lbf-award:1619,1625,1626,1627 · .pod-pz:1628 · .wsa-overlay:1631
.wsa-box:1633 · .wsa-head:1638 · .wsa-title:1639 · .wsa-when:1640,1641 · .wsa-close:1642,1645 · .wsa-cols:1646
.wsa-col:1647 · .wsa-sec-h:1648,1649 · .wsa-msg:1650 · .wsa-msg-h:1653 · .wsa-msg-b:1654,1655 · .wsa-msg-none:1656
.wsa-rules:1658,1659 · .wsa-list:1660 · .wsa-row:1661,1663 · .wsa-r:1664 · .wsa-n:1665 · .wsa-s:1666
.wsa-p:1667 · .wsa-prizes:1668 · .wsa-pz:1669,1672 · .wsa-reveal-medal:1673 · .lobby-bottom:1688,1691,1692,1694(+7) · .lobby-quiz-btn:1705
.lobby-book-btn:1706,1707 · .lobby-play-btn:1709,1713 · .lobby-exam-btn:1715,1716,1718 · .panel-overlay:1723,1728,4607,4608(+8) · .panel-box:1729 · .panel-head:1736,1740
.panel-close:1741,1746 · .panel-body:1747,1751,1752 · .panel-page:1749,1750 · .collect-sub:1756 · .mkt-empty:1757 · .craft-box:1758
.mkt-listing:1759 · .mkt-filter:1760,2104 · .hq-grid:1767 · .hq-card:1768,1773,1797 · .hq-head:1774 · .hq-pic:1780,1782
.hq-emoji:1784 · .hq-badge:1785 · .hq-stars:1789 · .hq-price:1790,1795,1796,1799(+6) · .craft-credit:1803,1805,1806 · .car-grid:1813,1815,1816
.robot-weap:1817 · .dmap-box:1820,1821 · .dmap-grid:1827 · .dmap-card:1829,1832,1833,1834(+2) · .dmap-ico:1836 · .dmap-new:1839
.dcp-grid:1841 · .dcp-card:1843,1846,1847,1848(+10) · .levelup-box:1865,3122,3123,3310 · .dcp-box:1868,1869,1873,1874(+6) · .dcp-lock:1882 · .sold-badge:1886,1888,1889
.rs-showroom:1891,5070,5071 · .rs-list:1892,1894,5051,5054 · .rs-thumb:1895,1897,1898,1899(+1) · .rs-thumb-pic:1900,1901 · .rs-thumb-price:1902 · .rs-stage:1904
.rs-big:1907 · .rs-big-img:1908 · .rs-elec:1912,1916,1921 · .rs-edge:1922,1928 · .rs-info:1931,1932,1933,1934(+1) · .rs-buy:1936,1938,1939
.cs-showroom:1943,5043,5044,5072(+3) · .cs-list:1944,1946,5045,5050(+9) · .cs-thumb:1947,1949,1950,1951(+1) · .cs-thumb-pic:1952,1953 · .cs-thumb-name:1954 · .cs-thumb-price:1955
.cs-thumb-own:1956 · .cs-stage:1958 · .cs-big:1961 · .cs-big-img:1962 · .cs-elec:1966,1970,1974 · .cs-edge:1975,1981
.cs-interior:1984 · .cs-inr-label:1985,1986 · .cs-inr-img:1987 · .cs-info:1989,1990,1991,1992(+6) · .cs-buy:2000,2002,2003,2004 · .car-emoji:2006
.car-mine:2012 · .car-mine-pic:2017 · .car-mine-info:2018 · .car-loan:2019,2020 · .car-mine-btns:2021,2022,2023 · .car-locked:2025
.car-mine-head:2027 · .car-pick-list:2028,2029 · .car-pick:2030,2032,2033 · .car-pick-pic:2034,2035 · .car-pick-name:2036,2037 · .car-pick-od:2038
.car-buy-box:2040,3317 · .cb-pic:2041,2042,2043 · .cb-lines:2044 · .cb-li:2045,2049,2050 · .cb-ins:2051,2055,2056 · .cb-plan:2057
.cb-pl:2058,2063,2065,2069(+1) · .cb-total:2076 · .cb-btns:2077,2082 · .cb-x:2078 · .shop-grid:2085 · .shop-item:2086,2091,2096,2097(+3)
.mkt-tab:2105,2106 · .pg-btn:2107,2108,2109 · .pg-dot:2110 · .fr-gift-btn:2144,2149 · .gift-sec-title:2152 · .gift-in-row:2154
.gift-out-row:2158 · .gift-in-pic:2159,2161,2162 · .gift-in-info:2163,2164 · .gift-in-btns:2165 · .gift-accept:2166,2170,2172 · .gift-decline:2171
.gift-box-card:2173 · .gift-box-from:2174,2175 · .gift-note:2176 · .gift-pick-overlay:2179 · .gift-pick-box:2183 · .gift-pick-head:2189,2193
.gift-pick-close:2194 · .gift-pick-tabs:2196 · .gp-tab:2197,2201 · .gift-pick-body:2202 · .gp-chips:2203 · .gp-chip:2204,2208
.gp-card:2209,2210 · .gp-price:2211 · .gp-note:2212 · .gift-cf-pic:2213 · .chat-emoji-cats:2218 · .chat-emoji-cat:2222,2226,2227
.chat-emoji-wrap:2228,2229 · .stage-left:2238,4598 · .pet-info-btn:2242,2249,2250 · .feed-list:2257,2261,2286,2287(+1) · .feed-empty:2262,2265 · .fd-tools:2271
.feed-bell:2272,2274,2275,2276 · .fd-prog:2280,2281 · .fpost:2288,3004 · .fp-head:2293 · .fp-who:2294 · .fp-name-line:2297
.fp-name:2298 · .fp-when:2299 · .fp-badges:2301,2304 · .fp-badge-ic:2302 · .fp-text:2306 · .fp-media:2309
.fp-img:2311 · .fp-cap:2313 · .fp-big:2314 · .fp-sum:2316,2318 · .fp-sum-rx:2319 · .fp-sum-none:2320
.fp-en:2321 · .fp-bar:2323 · .fp-act:2324,2328,2330 · .fp-like:2329 · .fp-page:2341,2342,2343,2344(+3) · .fp-rxbox:2347
.fp-rxb:2351,2353,2354,2355(+1) · .fp-rxb-off:2357 · .fp-fly:2359,2362,2363 · .fcm-overlay:2366 · .fcm-box:2368 · .fcm-post:2372,2373
.fcm-rxs:2374 · .fcm-rx:2375 · .fcm-list:2376,2378 · .fcm-row:2379,2380,2381 · .fcm-none:2382 · .fcm-item:2384
.fcm-reps:2385 · .fcm-rep:2387 · .fcm-more:2389,2391 · .fcm-arrow:2392 · .fcm-reply:2393,2395 · .fcm-like:2397,2400,2401,2402
.fcm-likeic:2403 · .fcm-cnt:2405,2407 · .fcm-likers-box:2408 · .fcm-likers-list:2409,2411 · .fcm-liker-row:2412 · .fcm-liker-none:2413
.fcm-repbar:2414,2417 · .fcm-repx:2418 · .fcm-note:2420 · .fcm-quick:2422,2424 · .fcm-q:2425,2428,2429 · .fcm-add:2430
.fcm-input:2431,2433 · .fcm-send:2434,2436 · .fcm-locked:2437 · .fnt-overlay:2439 · .fnt-box:2441 · .fnt-list:2445,2447
.fnt-row:2448,2450,2463 · .fnt-ico:2451 · .fnt-tx:2452,2453 · .fnt-sub:2454 · .fnt-hint:2456 · .fnt-go:2457,2460,2461,2469
.fnt-tag:2464 · .fnt-note:2466 · .fcm-hl:2471 · .feed-plate:2479 · .feed-all-btn:2480,2485 · .fdb-overlay:2490
.fdb-box:2492 · .fdb-head:2496 · .fdb-close:2500,2502 · .fdb-live:2503 · .fdb-live-title:2504 · .fdb-live-rows:2506,2508,2509
.fdb-live-row:2510,2512,2513,2514 · .fdb-dot:2515 · .fdb-list:2517,2518 · .fdb-empty:2519 · .fdb-row:2520 · .fdb-row-top:2522
.fdb-ico:2523 · .fdb-txt:2524 · .fdb-name:2525 · .fdb-ago:2526 · .fdb-actions:2527 · .fdb-like:2528,2531,2532,2533
.fdb-cm-list:2534 · .fdb-cm-row:2535,2537 · .fdb-cm-empty:2538 · .fdb-cm-add:2539 · .fdb-cm-input:2540,2542 · .fdb-cm-send:2543,2545
.fdb-cm-locked:2546 · .pi-overlay:2549 · .pi-box:2553,2558,2559,2563(+3) · .pi-close:2565,2570,2571 · .pi-close-left:2573 · .pi-portrait:2575
.pet-wear:2582,2585,2587 · .pi-portrait-wrap:2590,2592 · .pi-dress-btn:2600,2604,2605 · .pi-shape-cap:2606,2609,2610,2611 · .pi-shape-toggle-btn:2613,2616 · .pi-dress-pip:2618,2623,2624,2625(+1)
.pi-wear-note:2628,2630 · .greet-card:2637 · .greet-sub:2638 · .greet-grid:2639 · .greet-opt:2640,2643,2644,2645 · .greet-e:2646
.pi-streak:2650 · .pi-streak-head:2652,2654 · .pi-streak-best:2655 · .pi-dots:2656 · .pi-dot:2658,2659,2660 · .pi-streak-note:2661
.pi-care-title:2662 · .lbf-overlay:2675 · .lbf-box:2678,2692,2693,2694(+10) · .lbf-head:2683 · .lbf-title:2684 · .lbf-tabs:2685,2688
.lbf-note:2691 · .lbf-close:2707 · .lbf-close-l:2708 · .lbf-body:2709 · .lbf-grid:2710 · .lbf-box-bcat:2729
.lbf-bcat-wrap:2730 · .lbf-bcat:2732,2791,2792,2793(+3) · .lbf-bcat-head:2734,2735,2736 · .lbf-bcat-mid:2743 · .lbf-bcat-badge:2744,2803 · .lbcat-ic:2754
.badge-shine-img:2760 · .badge-shine:2778,2779 · .lbcat-ic-label:2805 · .lbf-bcat-rows:2807 · .lbf-one-row:2811,2812,2813 · .lbf-bcat-row:2814,2816,2817,2819
.lbf-podium:2831 · .pod:2833,2860,2861 · .pod-char:2835 · .pod-base:2837 · .pod-rank:2839 · .pod-label:2841,5114
.pod-name:2843 · .pod-sc:2845 · .pod-1:2850,2851 · .pod-2:2852,2853 · .pod-3:2854,2855 · .pod-4:2856,2857
.pod-5:2858,2859 · .pl-wide:2878,2881,2882,2883(+8) · .pl-follow:2884,2889,2891 · .pl-unfollow:2893,2899,2900 · .pl-followers:2901 · .pl-cols:2902,2907,2908,2909
.pl-col:2903 · .pl-sec-title:2904 · .pl-badges-col:2910 · .pl-feed:2911,2914,2921 · .pl-feed-row:2915,2919,2920 · .pl-assets-wrap:2923,4951,5026
.pl-assets:2924,4954,4959,4965(+4) · .pl-asset:2927,2931,2938 · .pl-asset-emoji:2932 · .pl-asset-n:2933 · .pl-pets-wrap:2940 · .pl-pets:2941
.pl-pet:2942,2947,2949 · .pl-pet-nm:2950 · .img-lightbox:2953,2958,2959,2963(+3) · .cert-svg:2982 · .cert-tap:2983,2988 · .cert-chip-sm:2991
.pl-sec-sub:3011 · .pl-certs:3012,3014 · .cert-mini:3015,3019,3021 · .cert-mini-cap:3022 · .cert-none:3024 · .lv-cert-row:3026,3028
.lv-cert-btn:3029,3034 · .cert-lightbox:3036,3041,3042,3046(+3) · .pl-chat:3066,3071 · .pl-call:3073,3079 · .pet-peek:3080,3081 · .pp-chips:3083
.pp-chip:3084 · .pp-gift:3089,3095 · .settings-box:3097,3098,3171,3182(+30) · .set-feed-head:3099 · .set-feed-sub:3103 · .set-feed-row:3104
.pillinfo-val:3109 · .pillinfo-desc:3114,3133 · .pillinfo-box:3125 · .plf-head:3128 · .plf-emoji:3129 · .plf-ht:3130,3131,3132
.plf-foot:3134,3136,3137 · .alert-box:3142,3144 · .ab-emoji:3145 · .ab-title:3146 · .ab-desc:3147 · .ab-btns:3148,3149,3150
.heal-heart:3152 · .attn-box:3167 · .set-tabs:3192,3196,3199,3200 · .set-panels:3202 · .set-panel:3203,3206,3207 · .help-box:3291,3292,3293
.wl-box:3311 · .food-box:3312 · .home-shop-box:3314 · .summary-box:3315 · .report-box:3316 · .wl-grid:3319
.tc-wrap:3321 · .spell-btn:3327,3332 · .sp-hud:3333 · .sp-word:3335 · .sp-ch:3336,3341 · .sp-th:3343
.sp-hint:3345 · .sp-exit:3348,3352 · .sp-banner:3353 · .sp-big:3358 · .sp-thb:3360 · .sp-coin:3361
#spell-confetti:3366 · .sp-rb:3367 · .sp-day:3377 · .sp-perfect:3379 · .sp-late:3381 · #spell-coinpop:3384
.side-sub:3493,3495 · .sec-quest:3500 · .on-page:3512,3513,3514,3515 · .inbox-overlay:3525 · .ib-box:3527 · .ib-head:3531
.ib-close:3535,3537 · .ib-list:3538,3539 · .ib-row:3540,3541,3542,3543 · .ib-ava:3544,3549,3550 · .ib-on:3551 · .ib-mid:3553
.ib-name:3554 · .ib-last:3555 · .ib-meta:3556 · .ib-time:3557 · .ib-dot:3559 · .ib-story-badge:3562
.ib-empty:3566 · .ib-story:3568,3570 · .ib-story-item:3571,3573,3580 · .ib-story-ava:3574 · .ib-story-on:3578 · .ib-world:3583,3586
.ib-tabs:3588 · .ib-tab:3589,3592,3594 · .ib-tab-dot:3595 · .ib-call-ava:3599 · .ib-call-row:3600,3601 · #btn-music:3607,3610,3611
#ws-overlay:3626 · #ws-board:3629,3635,3637 · .ws-head:3640 · .ws-title:3641 · .ws-findbar:3644 · .ws-tip:3645
.ws-grade:3647,3648 · .ws-body:3651 · .ws-gridwrap:3652 · #ws-grid:3655 · .ws-cell:3660,3665,3667,3670(+2) · .ws-flash:3676,3678
.ws-coinpop:3682,3706 · .ws-combo:3693,3697,3698,3699 · .ws-find:3710 · #ws-prog:3711 · #ws-words:3715,3719 · .ws-word:3721,3726,3727,3728(+2)
.ws-actions:3736,3737,3746 · .ws-sizes:3741 · .ws-sizes-lb:3743 · .ws-size-now:3744 · #ws-new:3747 · #ws-stash:3748
#ws-clear:3749 · #ws-win:3750,3752 · .ws-win-in:3753,3756 · .sec-online:3779 · .rank-tab:3809,3810,3811,3812(+2) · .pet-show-bg:3842,3845,3849,3853(+19)
.ps-night-fx:3945,3947,3959,3964(+1) · .pet-show:3974,3977,3989,3991(+48) · .ps-video:4205 · .ps-worn-pip:4283,4284 · .id-card:4307,4314,4318 · .id-chip:4331
.clock-chip:4340,4341 · .coin-block:4357 · .coin-group:4358 · .coin-pill:4388,4389,4410 · .cp-lb:4413 · .cp-v:4414
.topbar-icons:4450 · .topbar-icons-row:4451 · .topbar-theme-row:4452 · .theme-swatch:4453,4458,4459 · #theme-navy:4461 · #theme-emerald:4462
#theme-plum:4463 · .nw-sub:4500 · .top-flex2:4595 · #panel-factory:4614,4615,4619,4620(+39) · #panel-rank:4755,4756,4762,4767(+11) · .grid2x8:4838,4844
.pl-badges-vwrap:4853,4868 · .grid3x5:4854,4859 · .pl-badge-arrow:4860,4866 · .pba-u:4867 · .pl-badges-strip:4872,4880,4881 · .pl-badge-card:4882,4888,4906,4907(+1)
.pl-badge-card-ic:4894,4903,4905 · .pl-badge-card-nm:4909 · .pl-badges-empty:4915,4917 · .mine-strip:4931,4933,4934,4939(+4) · .mb-strip:4945,4984 · .gmark:5092,5096,5097,5098(+1)
.gm-stack:5101,5105 · .gm-row:5107 · .lb-name:5109,5110,5111 · .grade-edit:5132,5137,5138 · .gradelock-box:5142,5158,5163,5165 · .gl-head:5143
.gl-emoji:5144 · .gl-ht:5145 · .gl-cur:5146 · .gl-lock:5147,5152 · .gl-ok:5151 · .gl-lock-sub:5153
.gl-why:5154 · .gl-pick-lb:5155 · .gl-opts:5156 · .gl-hist:5166 · .gl-hline:5167 · .gl-hg:5171
.gl-hat:5172 · .gl-harr:5173 · .gl-foot:5174 · .gl-cf:5175 · .reg-gradelock:5197 · #tp-overlay:5207
#tp-board:5209,5213 · .tp-head:5217 · .tp-title:5218 · .tp-stat:5220,5222 · .tp-pts:5224,5227 · .tp-close:5229,5235,5236
.tp-snd:5239,5242,5248,5249 · .tp-snd-ic:5243 · .tp-snd-track:5244 · .tp-snd-thumb:5246 · .tp-prompt:5253 · .tp-word:5255,5269,5270
.tp-ch:5257,5262,5263,5265 · .tp-thai:5273 · .tp-hint:5275 · .tp-empty:5277 · .tp-keys:5280 · .tp-row:5282
.tp-row-fn:5284,5317 · .tp-key:5288,5300,5302,5308(+2) · .tp-key-fn:5315 · .tp-fx:5321 · .tp-coinpop:5322 · .tp-pop-pt:5327
#city-backdrop:5341,5347 · .city-arrive:5348,5349 · .night:5363,5383,5384,5386(+2) · #night-veil:5409 · .theme-emerald:5438,5450,5457,5460(+7) · .theme-plum:5443,5454,5458,5461(+3)
#theme-veil:5471 · #screen-picmatch:5524,5530,5531,5532(+29) · .pm-category-btn:5557,5560 · .pm-sheet-card-img:5561 · .pm-card:5564,5569,5573,5575(+9) · .pm-grid:5567
.pm-right:5597 · .pm-now:5598,5604 · #pm-now-en:5605 · .pm-now-th:5606 · .pm-lobby-btn:5614,5618 · .pm-mode-btn:5643,5646
.pm-wordcard:5647,5648,5650

## css/picdict.css (107 บรรทัด · 1 selector)
#screen-picdict:5,10,11,14(+53)

## css/picquiz_online.css (119 บรรทัด · 37 selector)
#pqr-root:5,6,7,8(+3) · .pqr-shade:13 · .pqr-card:15 · .pqr-mode-card:17,18,19 · .pqr-x:20 · .pqr-mode-grid:21
.pqr-mode-btn:22,24,25,26 · .pqr-full:28,30,32,33 · .pqr-net:34 · .pqr-hub-body:35,36,37,39(+3) · .pqr-bigicon:38 · .pqr-code-input:42
.pqr-primary:43,44 · .pqr-room-head:47 · .pqr-code-chip:48 · .pqr-head-actions:49,50 · .pqr-call:51 · .pqr-room-grid:52,53,54
.pqr-members:55 · .pqr-member:56,57,58 · .pqr-wait:59 · .pqr-room-hero:60 · .pqr-start:61 · .pqr-voice-note:62
.pqr-chat:63 · .pqr-msg:64,65,66 · .pqr-chat-form:67,68 · .pqr-hud:70 · .pqr-hud-main:72,73,74,75 · .pqr-hud-actions:76,77,78
.pqr-drawer:80 · .pqr-drawer-card:81 · #pqr-drawer-body:82 · .pqr-chat-draw:83 · .pqr-score-row:84,85 · .pqr-incoming:87,88,89,90
#screen-picdict:97,98,99,100(+2)

## css/style.css (2,254 บรรทัด · 557 selector)
:root:5 · *:15 · html:16,21 · input:25 · body:29 · #app:35
.screen:38,39 · h1:42 · .subtitle:43 · .egg-grid:46,63 · .egg-card:47,52,53,54(+2) · .pet-price:57,61
.egg:65,71,75 · .d1:76 · .basket:79,80,85,91(+5) · .basket-dog:89,102,103,104 · .basket-cat:90,105,106,107 · .egg-dragon:110
.topbar:125 · .topbar-coins:126 · .coin-pill:127,138,142,147(+4) · .coin-ic:134 · .no-anim:148,179,183,184(+6) · .coin-flow:152,153,157,164(+1)
.pill-gain:193 · .q-row:209,210,211,215(+1) · .q-emoji:212 · .q-mid:213 · .q-name:214 · .q-bar:216,217
.q-right:219,220 · .q-foot:221,222 · .tc-open:225,226 · .tc-wrap:227 · .tc-card:228 · .tc-head:232
.tc-sub:236 · .tc-name:237,238 · .tc-badges:239 · .tc-when:240 · .tc-row:241,245 · .tc-pass:246
.tc-try:247 · .tc-sign:248 · .tc-hint:249 · .tc-close:250 · .mb-seller:256 · .mb-buy:257
.wl-open:260,265 · .strip-wrap:268,286 · .strip-x:269,276,277,289(+1) · .strip-arrow:278,284,285 · .craft-toolbar:292,293 · .fc-cols:295,296
.wl-box:330 · .wl-head:331,332,333 · .wl-grid:335 · .dress-overlay:343 · .wl-it:353,357,358,359 · .wl-emoji:360
.wl-name:361 · .wl-h:362 · .hq-card:363,445 · .icon-btn:364 · #settings-badge:370 · .badge-pop:373
.attn-box:375,376,393 · .attn-list:377 · .attn-row:378,383 · .attn-ico:384 · .attn-txt:385,386 · .attn-go:387
.attn-total:388,392 · .rain-banner:396,401,402,403 · .rain-row:405 · .rain-icon:406 · .rain-track:407 · .rain-fill:411
.rain-note:412 · .comp-earn:415,427,431,432(+1) · .comp-earn-label:420 · .comp-earn-num:421,425 · .comp-earn-sub:426 · .farm-sub:438
.farm-mkt-hint:439 · .farm-cols:441,442 · .farm-shop:444 · .farm-hq:446,447,448 · .farm-yield:449,450 · .farm-tree:451,456,461,465
.farm-tree-emoji:460 · .farm-tree-name:463 · .farm-tree-status:464 · .farm-grow-badge:466 · .farm-sell-btn:487,492 · .farm-sellall-btn:493,499,500
.rank-card:503 · .rank-badge-wrap:508 · .rank-badge-img:509 · .rank-badge-emoji:510 · .rank-body:511 · .rank-name:512,513
.rank-bar:514 · .rank-fill:515 · .rank-text:516 · .rankup-overlay:519 · .rankup-rays:525 · .rankup-content:541
.rankup-title:546 · .rankup-badge:551,564 · .rankup-badge-img:563 · .rankup-name:565 · .rankup-en:569 · .rankup-sub:573
.rankup-btn:574,581,582 · .qbp:586,587,588,589(+4) · .cr-btn-row:595 · .rankup-btn-2:596,597 · .thunder-fx:600 · .quake:601
.pet-tabs:613 · .pet-tab:614,620,621 · .pet-card:623 · .pet-stage:628 · .aura:629,635 · .sp1:636
.pet-wrap:639 · .pet-emoji:640 · .pet-img:641 · .egg-img:642 · .feed-pet:643,833 · .pet-baby:644
.pet-adult:645 · .pet-egg-stage:647 · .wear:649 · .wear-head:650 · .wear-face:651 · .wear-neck:652
.pet-name:654 · .stage-label:655 · .level-row:656 · .level-badge:657 · .exp-bar:661 · .exp-fill:662
.exp-text:663 · .ability-box:665,669 · .hunger-bar:672 · .hunger-fill:673,674,675 · .food-item:681,745,749,750(+9) · .hunger-text:685
.heat-bar:688 · .heat-fill:689 · .heat-text:690,691,692 · .care-row:694 · .care-btn:695,699,705 · .btn-feed:700
.btn-cure:701 · .btn-foodquiz:703 · .care-row-quiz:704 · .sick-banner:706 · .pet-sick:710 · .food-lock-note:713
.pet-asleep:723 · .sleep-badge:724 · .btn-sleep:726 · .dinner-btn:729 · .food-box:733,734 · .food-x:736,742
.food-hunger-bar:743 · .food-grid:744 · .fd-lock:758 · .fd-lock-when:782 · .fd-nowok:783 · .fav-tag:786
.fd-exp:790 · .food-sec:792 · .food-sec-human:796 · .bad-tag:798 · .fd-toxin:802 · .fd-safe:803
.fq-box:806,807 · .fq-progress:808 · .fq-pair:809,810 · .fq-ask:811 · .fq-why:812 · .fq-btns:816,817,821
.fq-yes:822 · .fq-no:823 · .fq-next:824 · .food-cancel:825 · .feed-box:831,832 · .feed-gain:834
.sick-badge:838 · .big-btn:844,850,1103,1104(+6) · .shop-card:853 · .shop-title:857 · .shop-grid:858 · .shop-item:859,863,864,865(+4)
.it-tag:870 · .tag-wear:871 · .lock-banner:873 · .home-current:879,884,885 · .home-img:886 · .home-emoji:887
.home-btn:888,910 · .home-layout:890 · .home-pic-col:891,897 · .home-img-big:895 · .home-info-col:898,900,903,904 · .home-name-row:901
.home-desc-row:902 · .home-shop-box:912,913 · .home-list:914 · .home-option:915,919,920,921(+1) · .home-opt-img:924 · .home-opt-body:926,927
.home-price:928 · .reset-link:948 · .login-card:954 · .login-pets:955 · .login-status:956 · .google-btn:957,963,964
.login-note:965 · .install-btn:968,974,975 · .install-guide-overlay:978 · .install-guide:982,986,989 · .install-steps:987,988 · .install-guide-close:990
.login-account:995 · .register-card:998,1002,1020,1024 · .reg-safety:1004,1006,1007 · .reg-privacy:1009,1011,1012 · #screen-register:1014,1015,1016,1017(+2) · .student-chip:1025
.clock-chip:1029 · .online-count:1035 · .online-row:1042,1046,1047,1066 · .online-dot:1051 · .online-name:1056 · .online-act:1060
.online-ava:1065 · .online-live:1067 · .online-note:1071 · .lb-empty:1074 · .lb-list:1075 · .lb-row:1076,1080,1081
.lb-rank:1085 · .lb-name:1087,1091 · .lb-coins:1095 · .lb-hint:1097 · .lb-badgeline:1098 · .lb-tabs:1100
.lb-tab:1101,1102 · .tinv-note:1113 · .cat-card:1119,1164,1167,1315(+1) · .cat-head:1123 · .cat-emoji:1124 · .cat-name:1125
.cat-pass:1126 · .cat-info:1127 · .cat-btns:1128 · .cat-btn:1129,1133,1134,1135(+3) · .cats-back-bottom:1138 · .tapglow:1143,1144,1152
.lobby-bottom:1151 · .band-sec-head:1162,1163 · .bax-box:1171,1173 · .bax-head:1174 · .bax-sub:1175,1176 · .bax-row:1177
.bax-lv:1178,1181,1182,1183(+3) · .bax-emoji:1184 · .bax-name:1185 · .bax-q:1186 · .bax-need:1188 · .bax-rw:1189
.bax-foot:1193 · .bax-rank:1194,1197 · .bxr-box:1200,1202 · .bxr-head:1203 · .bxr-sub:1204 · .bxr-body:1205
.bxr-pick:1206 · .bxr-cats:1207 · .bxr-chip:1208,1210,1211,1212(+1) · .bxr-list:1215 · .bxr-row:1216,1218,1220,1224 · .bxr-rk:1219
.bxr-nm:1221,1222 · .bxr-sc:1223 · .bxr-tm:1225 · .bxr-more:1226 · .bxr-none:1227 · .bxr-foot:1229
.band-mine-tag:1230 · .bsp-box:1233,1236 · .bsp-head:1237 · .bsp-prog:1238 · .bsp-retake:1240,1243 · .bsp-info:1245,1247
.rts-box:1250 · .rts-head:1252 · .rts-sets:1253 · .rts-set:1254,1255,1256 · .rts-sub:1257 · .rts-words:1258
.rts-word:1259,1261,1262 · .rts-foot:1263 · .rts-okbtn:1264,1266 · .bsp-grid:1267 · .bsp-chip:1268,1271,1272,1273(+1) · .bsp-num:1275
.bsp-best:1276 · .bsp-tick:1277 · .bsp-foot:1278 · .vb-box:1281,1283 · .xsp-box:1286 · .vb-head:1287
.vb-total:1288 · .vb-quizbtn:1289,1291 · .vb-tabs:1292 · .vb-tab:1293,1295,1296 · .vb-words:1297 · .vb-word:1298,1301,1302,1303(+3)
.vb-empty:1307 · .vb-foot:1308 · .vb-pg:1309,1311 · #vb-pginfo:1312 · .vb-hint:1313 · .band-lock:1321
.offline-btn:1322,1323 · .quiz-progress:1328 · .quiz-phon:1329 · #quiz-extra:1330,1332,1333,1334 · .quiz-word-card:1335 · .quiz-next:1341,1347,1348,1349(+1)
.quiz-choice:1352,1357,1358,1359 · .quiz-score-pill:1360 · .quiz-time-pill:1362,1364 · .stats-card:1367 · .stats-title:1371,1927 · .stats-row:1372,1373,1374,1375
.stat-badge-line:1377,1380 · .stat-badge-ic:1378 · .game-top:1383 · .back-btn:1384 · .combo-pill:1388 · .timer-wrap:1392
.timer-fill:1393,1394 · .board-label:1396 · .card-grid:1397 · .word-card:1398,1404,1405,1406(+3) · .hint-btn:1412,1417 · .game-endless-note:1420,1425,1427,1431(+6)
.report-btn:1452,1457 · .report-box:1460 · .report-close:1461 · .rp-head:1465 · .rp-avatar:1466,1467 · .rp-title:1468
.rp-sub:1469 · .rp-levelcard:1471 · .rp-level-top:1475 · .rp-bar:1476 · .rp-bar-fill:1477 · .rp-level-note:1478,1479
.rp-grid:1481 · .rp-stat:1482 · .rp-ic:1485 · .rp-num:1486 · .rp-lbl:1487 · .rp-section:1489
.rp-h3:1490 · .rp-badge-mini:1491 · .rp-row:1492,1493,1494 · .rp-empty:1495 · .rp-badges:1496 · .rp-badge:1497
.rp-tline:1500 · .rp-tl-head:1501,1502 · .rp-tl-ems:1503 · .rp-em:1504,1505 · .rp-tl-note:1506,1507 · .rp-crown:1509,1510
.rp-wtitle:1512 · .rp-wnow:1513,1514 · .rp-wgraph:1515 · .rp-wcol:1516 · .rp-wval:1517 · .rp-wbar:1518,1519
.rp-wlbl:1520 · .rp-cheer:1522 · .report-ok:1526 · .summary-box:1529,1652,1656,1657(+2) · .sm-burst:1530 · .sm-title:1532
.sm-line:1533 · .sm-coin:1534 · .sm-matches:1540,1541 · .confetti:1543 · .sm-badge:1550 · .sm-badge-all:1554
.badge-celebrate-overlay:1557,1610,1618 · .badge-celebrate:1563 · .bc-emoji:1569,1607 · .bc-emoji-img:1578 · .badge-clickable:1591,1592,1593 · .badge-info-box:1597
.bi-emoji:1598 · .bi-emoji-img:1599 · .bi-title:1600 · .bi-desc:1601 · .bi-ok:1602 · .bc-title:1608
.bc-sub:1609 · .bc-sticky:1619 · .bc-coin:1620,1625 · .bc-ok:1626,1631 · .sm-cheer:1646 · .sm-streak:1647,1648
.sm-sick:1649 · .sm-btns:1650 · .float-fx:1662 · .toast:1669 · .toast-warn:1676,1683,1684,1690 · .toast-link:1692,1699,1700,1705(+4)
.toast-clear-all:1716,1723 · .alert-box:1725 · .alert-ok:1726,1731 · .settings-box:1733 · .set-row:1734 · .set-hint:1738
.set-hint-on:1739 · .set-hint-off:1740 · .set-lwrap:1741 · .set-label:1742 · .set-desc:1743 · .set-switch:1744,1748,1749,1754(+4)
.set-sw-knob:1750 · .set-sw-txt:1757 · .set-night-row:1766 · .set-seg:1767,1769,1775,1776(+1) · .set-close:1778,1783 · .set-help:1784,1789
.help-box:1791,1792,1797 · .help-item:1793 · .update-banner:1805,1814,1815 · #update-reload:1816 · #update-dismiss:1820 · .levelup-overlay:1826,1832,1833
.levelup-box:1834,1841,1842,1843(+4) · .bill-box:1849,1853,1854 · .tag-off:1855 · .home-decayed-img:1856 · .home-dark-img:1857 · .thirst-fill:1858
.thirst-text:1859,1860 · .toxin-fill:1863 · .toxin-text:1864,1865 · .detox-btn:1866,1871 · .shape-text:1874,1875,1876,1877(+1) · .avatar-pick:1881
.avatar-opt:1882,1886,1887,1888 · .avatar-chip-img:1892 · .mini-av:1894 · .fp-ava:1895 · .avatar-chip-blk:1897 · .set-avatar-btns:1898
.avatar-mini:1899,1903 · .set-blk-row:1905 · .set-sub2:1906 · .blk-grid:1908 · .blk-mini:1909,1912,1913,1914 · .game-avatar:1917,1918,1919
.stats-nick:1928 · .ticket-owned:1931,1935 · .collect-sub:1940 · .mkt-tabs:1941 · .mkt-tab:1942,1946 · .mkt-filter:1947
.mkt-row:1951 · .mkt-emoji:1955,1956 · .mkt-info:1957,1958 · .mkt-tier-stars:1959 · .mkt-buy:1960,1965,1966 · .mkt-price-lo:1967
.mkt-price-hi:1968 · .mkt-empty:1969 · .collect-grid:1972 · .collect-cell:1973 · .cc-emoji:1974,1975 · .cc-name:1976
.cc-count:1977 · .cc-list-btn:1978,1982 · .mkt-listhead:1983 · .mkt-group-head:1985,1991 · .mkt-two-col:1993,1994,1998,2010(+8) · #phone-card:1999,2015
#computer-card:2000,2016 · #ticket-card:2002 · #haunt-card:2003 · #heli-card:2004 · #drone-card:2005 · #drive-card:2006
#soccer-card:2007 · #moto-card:2008 · #invasion-card:2009 · .mkt-listing:2037 · .ml-cancel:2041 · .mkt-sold:2047,2048,2049
.list-dialog:2056,2057,2062 · .list-hint:2061 · .collect-reveal-frame:2065,2072 · .collect-reveal-img:2071 · .collect-reveal-stars:2073 · .craft-box:2076
.craft-head:2077 · .craft-bar:2078 · .craft-fill:2079 · .craft-text:2080 · .craft-btn-row:2081,2082 · .craft-go-btn:2084,2090,2091,2094
.craft-cancel:2102,2106 · .mkt-catalog:2109,2110,2111 · .mkt-pager:2114 · .pg-btn:2115,2119,2120 · .pg-mid:2121 · .pg-dots:2122
.pg-dot:2123,2124 · .order-head:2125 · .order-row:2126,2131,2133,2135 · .order-deliver:2136,2141 · .order-need:2142 · .avatar-chip-photo:2148
.pass-photo:2149 · .pl-photo:2150 · .pp-cam:2155,2163 · .set-photo-row:2166,2172 · .ph-thumb:2173 · .ph-plus:2174
.photo-box:2180,2181,2202,2206(+4) · .ph-now:2182 · .ph-now-img:2183,2187 · .ph-now-cap:2188 · .ph-warn:2189 · .ph-sync:2194,2197
.ph-sync-wait:2198 · .ph-sync-ok:2199 · .ph-sync-bad:2200 · .ph-btns:2201 · .ph-tip:2211 · .ph-stage:2213,2217
.ph-cv:2218 · .ph-ring:2219,2224 · .ph-zoom:2228 · .ph-foot:2229 · .ph-crop-box:2230
