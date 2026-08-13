# CODE_MAP.md — แผนที่โค้ด:บรรทัด (เจนอัตโนมัติโดย `tools/gen_code_map.py` — **ห้ามแก้มือ** เดี๋ยวโดนเขียนทับ)

> วิธีใช้: หาชื่อฟังก์ชัน/ค่าคงที่/selector ในไฟล์นี้ (Grep หรือกวาดตา) → `Read` ไฟล์จริง `offset=<บรรทัด>` `limit=40`
> 🗂️ ไฟล์อ้วนมี **สารบัญโซน** (`st-end ชื่อโซน`) — งานทั้งระบบ/โลก 3D: Grep ชื่อโซน → Read/Edit เฉพาะช่วงนั้น **ห้ามอ่านทั้งไฟล์** · เพิ่มระบบใหม่ในไฟล์อ้วนต้องครอบ banner `/* ==== */`+ชื่อโซน (สารบัญเจนเอง)
> css = index `selector:บรรทัดทุกจุดที่ประกาศ` (บั๊ก UI เริ่มหาที่นี่) · เจนใหม่ทุกครั้งที่รัน `python tools/rotate_handoff.py` · อัปเดต: 2026-08-14

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

## js/app-update.js (214 บรรทัด · 0 รายการ)

## js/arena3d.js (724 บรรทัด · 0 รายการ)

## js/assetaward.js (21 บรรทัด · 0 รายการ)

## js/auth.js (530 บรรทัด · 47 รายการ)
AUTH_PUSH_MS:23 · AUTH_SDK_TIMEOUT_MS:24 · AUTH_CLOUD_SLOW_MS:25 · AUTH_CLOUD_TIMEOUT_MS:26 · ADMIN_NAME_EMAILS:30 · adminReservedNameKey:35
isReservedAdminName:40 · canUseReservedAdminName:44 · isAdmin:49 · checkProfileName:52 · TEACHER_EMAILS:61 · isTeacher:62
syncAdminAccess:66 · TESTER_EMAILS:80 · TESTER_COINS:81 · isTester:82 · RANK_EXCLUDED_TESTER_NAMES:88 · rankUserExcluded:89
testerBoost:95 · authSetStatus:128 · authLocalSaveSafe:145 · authShowLogin:148 · authGateOffline:152 · authSaveRef:159
authFetchCloud:160 · authWriteCloud:180 · authDeleteCloud:181 · authWriteProfileName:182 · authPushProfile:189 · authApplyProfileName:197
authEnsureProfileName:220 · authAskProfileName:238 · authEditProfileName:252 · authStart:264 · updateOfflinePill:296 · authEnterOffline:301
authLateSync:318 · authIsAppMode:338 · AUTH_REDIRECT_CODES:346 · authLoginClick:348 · authOnLogin:368 · authSyncOnLogin:394
authFreshStart:423 · authAskLink:432 · authEnterGame:482 · authPushSave:498 · authLogout:509

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

## js/city3d.js (3,346 บรรทัด · 212 รายการ)
### 🗂️ สารบัญโซน js/city3d.js (Read/Edit เฉพาะช่วง)
- 2-18 city3d.js — 🏙️ VOCAB CITY: ล็อบบี้ 3D แบบเมืองลอยฟ้า (index.html = หน้าหลัก · รอบ 861 · สลับเป็นหน้าหลักรอบ 86
- 19-51 ⚙️ CONFIG + เครื่องมือกลาง (รอบ 861)
- 52-133 🔒 รอบ 1070: ประตูโลกที่ยัง Coming soon — สิทธิ์ทดสอบมาจาก Auth ที่ฝังในเซฟ Lobby เดิม
- 134-236 📷 CAMERA RIG — 1 นิ้วเลื่อน · 2 นิ้วหมุน/เอียง/ซูม (รอบ 861)
- 237-401 🖼️ CANVAS TEXTURE โรงงานผิวสัมผัส (พื้นเกาะ/หน้าต่างตึก/ป้าย)
- 402-462 🏗️ BUILDERS — อาคารแต่ละแบบ (ห้ามกล่องเปล่าแปะ texture — มีชั้นเชิง/ระเบียง/หลังคา/ป้ายจริง)
- 463-851 🚪🌀 รอบ 897: ประตูม้วนเลื่อนขึ้น (โรงรถ/โรงเก็บยาน) — บานพับหมุนไม่ได้เพราะช่องกว้าง 3-5 เมตร
- 852-948 🚗🏍️🚁🛸 ยานพาหนะจิ๋ว (ผู้เล่นจริงจากโลก 3D จะขับ/บินสิ่งเหล่านี้ในเมือง)
- 949-1005 🧍 ตัวละครผู้เล่น — blk1-8 = หุ่นบล็อก 3D · blk9-88 = ป้ายภาพ 2D ตั้งในโลก
- 1006-1366 🌆 ผังเมือง — อาคารทุกหลังผูก go=<key> (ตัวรับใน js/main.js)
- 1367-1511 🎉 เทศกาลตามวันที่จริง — พลุปีใหม่ / สงกรานต์ / ลอยกระทง (รอบ 863)
- 1512-1787 🧑‍🤝‍🧑 ผู้เล่นจริง (อ่านอย่างเดียว) — presence→ยืนตามอาคาร · world→ขับ/บินในเมือง
- 1788-1944 💬 รอบ 866: บับเบิลแชทสดลอยหัวเพื่อนในเมือง
- 1945-2101 🖊️💬 รอบ 868: พิมพ์ตอบแชทได้จากในเมือง (ไม่ต้องกลับล็อบบี้เดิม)
- 2102-2251 💬🔴 รอบ 873: ไอคอน "มีข้อความค้าง ยังไม่ได้อ่าน" ลอยเหนือหัวเพื่อน
- 2252-2269 🚪 รอบ 870: กลับจากล็อบบี้เดิม → โผล่ที่ "หน้าประตูตึกที่เพิ่งเข้า"
- 2270-2504 🚪🔊 รอบ 890: บานประตูตึกเปิด-ปิดจริง + เสียงประตูสังเคราะห์เอง
- 2505-2636 🚗🤖🛸 รอบ 900: ยานพาหนะแล่นออกจากช่องประตูม้วนที่เพิ่งเปิด → จอดรอหน้าประตู
- 2637-2804 🚶 รอบ 866: ตัวเราเดินไปหน้าตึกก่อน แล้วค่อยเข้าหน้านั้น
- 2805-2889 🚪🚶 รอบ 886: กลับจากล็อบบี้เดิม → "เดินออกจากตึกมาหน้าประตู" (walkSelfTo ย้อนทาง)
- 2890-3058 👆 แตะ/คลิก: ตัวละคร→การ์ดโปรไฟล์ · อาคาร→เดินทางไปหน้านั้น · พื้น→ประกายดาว
- 3059-3112 🎵 รอบ 873: เพลงประกอบเมือง (BGM) — ปุ่มเปิด/ปิดมุมขวาล่าง
- 3113-3148 🚀 BOOT
- 3149-3346 🎬 รอบ 880: กลับจากล็อบบี้เดิม → จอเปิดคือ "ภาพเมืองใบที่เพิ่งเดินออกไป"
### รายการ js/city3d.js
ISLAND_R:22 · RING_IN:23 · BAND1_R:24 · GROUND_TEX_PX:25 · NIGHT:26 · esc:46
hash:47 · rnd:48 · clamp:49 · TAU:50 · CITY_WORLD_COMING_SOON:55 · CITY_WORLD_TESTER_NAMES:56
cityWorldTester:57 · cityLetterCannonAdmin:72 · cityWorldComingSoon:78 · BLK8:85 · CAR_COL:96 · gradeStars:101
MAT:119 · mat:120 · GEO:124 · box:125 · cyl:126 · M:127
groundAt:158 · setupInput:167 · twoState:229 · cvs:240 · ctex:241 · groundTexture:248
wallTex:302 · wallMat:321 · shopSign:326 · roundRect:336 · iconSprite:343 · nameSprite:366
blobShadow:388 · parapet:410 · roofProps:415 · DOOR_W:427 · doorNightFx:431 · doorAt:448
ROLL_Z_HOLE:472 · slatTexture:475 · rollAt:485 · awning:509 · bTower:521 · bShop:541
bHouse:559 · bLibrary:575 · bFactory:593 · bArcade:620 · bObservatory:637 · bHallOfFame:651
bHaunted:672 · bHeliport:690 · bGarage:707 · bStadium:722 · bMotoTrack:744 · bUfo:765
bHangar:785 · bJungleGate:808 · bDronePad:830 · miniCar:855 · miniMoto:874 · miniHeli:894
miniDrone:914 · miniMecha:929 · makeBlockFigure:953 · makeSpriteFigure:989 · makeFigure:998 · pickBlk:1001
bld:1009 · BUILDINGS:1010 · BLD_AT:1138 · buildCity:1140 · buildPlaza:1191 · buildGreens:1237
_glowTex:1282 · buildSky:1292 · buildAmbientTraffic:1354 · FESTIVAL:1371 · buildFestival:1383 · buildFireworks:1390
buildSongkranDeco:1432 · buildLoiKrathongDeco:1464 · actBuilding:1535 · loadFirebase:1546 · setCityLoginVisible:1555 · liveStart:1568
lbGet:1584 · watchPresence:1594 · spawnStander:1618 · WORLD_MAPS:1653 · pollWorlds:1660 · spawnVehicle:1711
removeActor:1771 · markPickable:1784 · BUB_MS:1797 · BUB_FRESH:1798 · BUB_MAXCH:1799 · BUB_MAX:1800
BUB_TEX_KEEP:1801 · bubTexture:1807 · bubTexRelease:1819 · bubbleSprite:1824 · bubDraw:1833 · killBubble:1860
showBubble:1873 · flushBubble:1911 · watchFriendChats:1919 · CITY_CHAT_MAX:1958 · CITY_QUICK_REPLIES:1960 · bubSafeText:1963
actorInfo:1969 · chatBoxCanSend:1979 · chatBoxWhy:1983 · chatBoxRefresh:1989 · openChatBox:2026 · closeChatBox:2038
cbNote:2043 · sendCityChatText:2049 · sendCityChat:2079 · cityStopLive:2084 · SAVE_KEY:2113 · saveRead:2116
pairIdOf:2119 · chatSeenTsCity:2121 · chatMarkSeenCity:2127 · unreadTexture:2140 · addUnreadBadge:2158 · removeUnreadBadge:2179
setUnread:2189 · applyUnread:2195 · markReadCity:2197 · unreadCount:2205 · spawnSelf:2211 · DOOR_MEM:2262
rememberDoor:2263 · lastDoorKey:2264 · DOOR_SWING:2286 · DOOR_OPEN_S:2287 · DOOR_SHUT_S:2288 · DOOR_AJAR:2292
AJAR_QUIET_MS:2293 · ROLL_OPEN_S:2298 · ROLL_SHUT_S:2299 · ROLL_LIFT:2300 · ROLL_AJAR:2301 · registerDoor:2304
doorLeadS:2317 · doorSpillTexture:2323 · doorCreakSfx:2334 · doorLatchSfx:2352 · shutterRollSfx:2375 · shutterClunkSfx:2402
doorMoveSfx:2425 · setCityDoor:2432 · openCityDoor:2443 · closeCityDoor:2444 · setDoorRest:2446 · refreshDoorRest:2458
applyDoorPose:2468 · RIDE_GATE:2520 · RIDE_OUT_S:2521 · RIDE_PARK_S:2522 · DOOR_RIDES:2525 · rideLeadS:2535
rideSfx:2540 · ridePose:2565 · launchRide:2582 · releaseRide:2594 · WALK_SPD:2643 · WALK_MIN:2644
WALK_MAX:2645 · DOOR_GAP:2646 · RECEPTION_SPOT:2650 · doorSpotOf:2651 · walkPose:2662 · footCtx:2677
footStepSfx:2682 · footDustTexture:2703 · footDustPuff:2712 · footDustTick:2726 · FOOT_STEP_DIST:2741 · DOOR_OPEN_AT:2742
walkSelfTo:2744 · EXIT_BACK:2816 · EXIT_DUR:2817 · EXIT_STEP:2818 · EXIT_CLEAR:2819 · EXIT_SHUT:2820
stageExitWalk:2823 · walkSelfOut:2835 · onTap:2893 · captureCityShot:2912 · travelTo:2945 · sparkleAt:2987
openProfile:3011 · refreshChip:3050 · setChip:3054 · BGM_KEY:3065 · BGM_DUCK_PICTURE_DICTIONARY:3066 · bgmWant:3068
bgmEnsure:3069 · BGM_DEV:3078 · bgmPlay:3079 · bgmDuckForPictureDictionary:3081 · bgmRefreshBtn:3086 · bgmToggle:3093
bgmSetup:3098 · boot:3116

## js/coinaward.js (21 บรรทัด · 0 รายการ)

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

## js/f1_3d.js (3,182 บรรทัด · 230 รายการ)
### 🗂️ สารบัญโซน js/f1_3d.js (Read/Edit เฉพาะช่วง)
- 19-138 ⚙️ ค่าคงที่ (TUNE ZONE)
- 139-181 📦 สถานะโลก
- 182-355 🔊 F1 DYNAMIC ENGINE AUDIO — sample จริง + RPM/เกียร์เสมือน + synth fallback (รอบ 1106)
- 356-474 🖼️ texture: probe img/f1/*.jpg ก่อน → ไม่มีใช้ canvas วาดเอง
- 475-501 ✏️ sprite ตัวอักษร / ป้ายชื่อ (canvas → sprite)
- 502-592 🛣️ เส้นแทร็ก: F1_MAP.track (จุดจริง OSM) → sample ทุก 5 ม.
- 593-717 🏗️ สร้างฉาก: แทร็ก + kerb + runoff + อาคารจริง + ไฟ + ทะเลทราย
- 718-1075 ✨ F1 REALISTIC CIRCUIT — ฉากสนามมืออาชีพเฉพาะ Realistic Mode (รอบ 1125)
- 1076-1185 🏎️ โมเดลรถ: GLB ผู้ใช้ (img/models/f1_car.glb) → ไม่มี = ประกอบเอง
- 1186-1546 🖥️ DOM + CSS (เต็มจอ ไม่มีกรอบเครื่องเกม)
- 1547-1692 🌍 สร้างโลกครั้งเดียว
- 1693-1867 🪽 รอบ 904: DRS — ปีกหลังเปิดบนทางตรง (ตามรถเพื่อนใกล้ 25 ม.)
- 1868-2053 🏁 ฟิสิกส์ + จับเวลา
- 2054-2144 🏆 รอบ 903: กระดานอันดับ Best Lap ออนไลน์ (/f1Rank)
- 2145-2307 🚦👻 รอบ 902: ลำดับออกสตาร์ท (ไฟแดง 5 ดวง) + รถเงาวิ่งตาม Best Lap
- 2308-2360 🚧 เลนพิท — ผิวทางเต็มกริป + ลิมิตเตอร์ 80 กม./ชม.
- 2361-2455 🔤 คำศัพท์บนแทร็ก (แบบเดียวกับโลกมอเตอร์ไซค์ — REWARD สูงกว่า)
- 2456-2605 🧑‍🤝‍🧑 เพื่อนร่วมสนาม (NetRoom map 'f1')
- 2606-2733 📷 กล้องไล่หลัง + ลูปเกม
- 2734-2838 🔢 รอบ 916 — จอบนพวงมาลัยเป็น "ของจริง"
- 2839-2969 🚥 รอบ 918: แถบไฟ LED รอบเครื่องบนพวงมาลัย (เขียว → เหลือง → แดง ตอนใกล้เปลี่ยนเกียร์)
- 2970-3182 🚪 เข้า/ออกโลก
### รายการ js/f1_3d.js
REWARD:22 · LETTER_COIN:23 · LETTER_COPIES:24 · COLLECT_R:25 · DONE_KEY:26 · HALF_W:27
KERB_W:28 · RUNOFF_W:29 · SAMPLE_M:30 · FP_EYE:32 · FP_FWD:33 · FP_LOOK:34
FP_DROP:35 · FP_FOV:36 · RFP_EYE:38 · RFP_FWD:39 · RFP_LOOK:40 · RFP_DROP:41
RFP_FOV:42 · ROAD_EYE:45 · ROAD_DROP:46 · ROAD_FOV:47 · REV_A:49 · REV_MAX:50
OFFTRACK_S:51 · FPW_F:52 · FPW_S:53 · FPW_R:54 · FPW_H:55 · RFPW_F:58
RFPW_S:59 · RFPW_H:60 · RFPW_SCALE:61 · WHEEL_HUB_X:63 · WHEEL_HUB_Y:64 · WHEEL_RATIO:65
WHEEL_MAX_DEG:66 · LED_GREEN_N:70 · LED_AMBER_N:71 · LED_SHIFT_R:72 · LED_FLASH_HZ:74 · LED_K_LO:75
LED_K_SPAN:76 · LED_RPM_LERP:77 · F1_LEDS:78 · WHEEL_IMG_W:87 · DASH_PX:88 · DASH_LED_N:89
DASH_RPM_MIN:90 · DASH_RPM_MAX:91 · SHAKE_KERB_AMP:93 · SHAKE_SAND_AMP:94 · SHAKE_SPD_REF:95 · SHAKE_HZ:96
WHEEL_SHAKE_KERB_PX:98 · WHEEL_SHAKE_SAND_PX:99 · PWR_A:101 · ACC_CAP:102 · DRAG_K:103 · ROLL_A:104
BRAKE_A:105 · BRAKE_DF:106 · COAST_A:109 · COAST_STOP:110 · GRIP_BASE:111 · GRIP_DF:112
GRIP_CAP:113 · STEER_MAX:115 · STEER_HI:116 · SURF_RUNOFF:117 · SURF_SAND:118 · NET_SEND_MS:119
ROOM_MAX:120 · CHAT_MS:121 · CHAT_PRESETS:122 · PEER_COLORS:123 · GRID_N:124 · LIGHT_LEAD_S:126
LIGHT_STEP_S:127 · LIGHT_HOLD_MIN:128 · LIGHT_HOLD_MAX:129 · JUMP_PENALTY_S:130 · GHOST_HZ:132 · GHOST_MAX:133
GHOST_KEY:134 · PIT_HALF_W:135 · SURF_PIT:136 · PIT_LIMIT:137 · LINE:160 · PITL:173
GEARS:353 · gearOf:354 · matLam:363 · matLit:369 · applyTex:374 · texFromCanvas:378
texProbe:386 · asphaltTex:397 · kerbTex:412 · sandTex:418 · crowdTex:427 · garageTex:438
towerTex:449 · adTex:458 · tentTex:465 · letterTexture:478 · makeTextSprite:488 · cr:506
buildLine:510 · nearIdx:549 · surfAt:580 · ribbonGeo:596 · kerbStrips:617 · extrudeFootprint:652
polyCentroid:663 · buildBuildings:667 · chooseRealisticTier:723 · seededRand:729 · realisticAsphaltTex:733 · linePose:758
instancedFromSpots:764 · buildRealisticCircuit:770 · buildTrackScene:926 · glbEnsure:1079 · buildF1Car:1093 · makeCar:1165
CSS:1189 · buildDom:1392 · build:1550 · mapBounds:1660 · mapXY:1668 · drawMap:1671
DRS_ZONES_N:1701 · DRS_CURV:1702 · DRS_GAP_MAX:1703 · DRS_MIN_M:1704 · DRS_ENTRY_M:1705 · DRS_NEAR_M:1706
DRS_DRAG_K:1707 · DRS_FLAP_SHUT:1709 · DRS_FLAP_OPEN:1710 · attachDrsGlow:1715 · findDrsZones:1725 · DRS_DET_M:1756
DRS_SIGN_KIND:1757 · drsDetIdx:1764 · drsSignTex:1768 · buildDrsBoards:1780 · drsZoneAt:1822 · drsPeerGap:1831
drsTick:1844 · drsHud:1859 · respawnOnTrack:1872 · physTick:1884 · progressTick:1980 · fmtLap:2028
puffSmoke:2034 · smokeTick:2043 · FR_READ:2062 · frSubmit:2064 · frMerge:2081 · frFetch:2093
frRowHTML:2111 · frBodyHTML:2120 · frNote:2129 · frMount:2134 · resetLights:2154 · beginLights:2161
lightsLocked:2162 · paintLights:2163 · lightsTick:2173 · ghostEnsure:2222 · ghostHide:2239 · ghostLoad:2244
ghostSave:2253 · ghostReset:2256 · ghostRecord:2260 · ghostKeep:2269 · ghostGapAt:2276 · ghostTick:2284
buildPitLine:2313 · pitAt:2344 · inPitLane:2355 · racingLineLat:2364 · trackPointAhead:2372 · pickWord:2380
spawnLetters:2390 · renderWordHud:2403 · collectTick:2409 · completeWord:2427 · relocTick:2444 · netReady:2459
netJoin:2464 · netSend:2477 · sendChat:2488 · peerColor:2495 · buildPeer:2499 · onPeer:2520
showPeerBubble:2540 · removePeerBubble:2547 · dropPeer:2553 · peerTick:2561 · netLeave:2581 · renderBoard:2585
CAM_MODES:2611 · CAM_NEXT_LABEL:2612 · cycleCamMode:2613 · applyCamMode:2617 · buildFpWheels:2628 · fpWheelTick:2660
cockpitBox:2676 · layoutWheel:2691 · wheelTick:2713 · DASH_FONT:2740 · layoutDash:2741 · dashRR:2755
dashRpmTick:2762 · dashTick:2772 · drawDash:2787 · buildLeds:2844 · ledsOff:2852 · ledTick:2856
camTick:2883 · hudTick:2927 · frame:2937 · tick:2955 · fit:2962 · applyEnvironmentProfile:2973
start:3010 · exitWorld:3076

## js/f1_modes.js (123 บรรทัด · 12 รายการ)
STORAGE_KEY:7 · DEFAULT_MODE:8 · CONTRACT:9 · freezeProfile:11 · PROFILES:17 · MODES:36
normalize:43 · readPreference:44 · writePreference:48 · selection:53 · removeSelector:58 · openSelector:64

## js/fpsweapon.js (194 บรรทัด · 0 รายการ)

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

## js/invasion3d.js (10,581 บรรทัด · 653 รายการ)
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
- 450-1019 🎨 CSS + DOM overlay (self-contained ไม่แตะ css/style.css)
- 1020-1320 🎛️ รอบ 1041: HUD ยุทธวิธี + ตัวแก้ตำแหน่งแบบเกมยิงมือถือ
- 1321-1450 🎛️🧭 รอบ 1041: HUD LAYOUT EDITOR — ลาก/ย่อขยาย/ความทึบ/บันทึก
- 1451-1815 🔊 เสียงสังเคราะห์ Web Audio (ปลอดลิขสิทธิ์ 100%)
- 1816-1980 🚁🔊 เสียงเฮลิคอปเตอร์ Bell 212 — "เหมือนโลก helicopter ทุกประการ" (รอบ 531 — ผู้ใช้สั่ง)
- 1981-2021 🚁🔊🌍 เสียงเฮลิรอบตัว (รอบ 531 — ผู้ใช้สั่ง) — ทุกลำในสนามส่งเสียงใบพัดจริง ดังตามระยะ + ซ้าย/ขวา
- 2022-2088 🖼️ เทกซ์เจอร์วาดเอง (canvas) + ตัวช่วยโหลดภาพจริงถ้ามีไฟล์
- 2089-2138 🌍 สถานะฉาก
- 2139-2198 📦 โหลดโมเดล .glb ถ้ามีไฟล์ (ผู้ใช้เอาของจริงมาใส่แล้ว)
- 2199-2326 🏜️ สร้างฉากทะเลทราย + เมือง
- 2327-2386 🌳 รอบ 580 (ผู้ใช้สั่ง): ต้นไม้จริงจากโมเดล tree.glb ของผู้ใช้
- 2387-2526 🏚️ รอบ 416: ถนนสมรภูมิหน้าจุดเกิด (ผู้ใช้ส่งภาพอ้างอิง Delta Force)
- 2527-2703 🏜️🪖 รอบ 1040: ภูมิทัศน์สมรภูมิสมัยใหม่ — PBR + ร่องรอยการรบ (ต้นฉบับ)
- 2704-2841 🏠 รอบ 431: บ้านหลบซุ่มยิง (โมเดล house_01 ของผู้ใช้) + จุดสูงข่มบนเนินเขา
- 2842-2902 🛸 ยานแม่ลำมหึมา — ทรงลิ่มเหลี่ยมมืด + หนาม + ช่องตัวอักษร (สไตล์ ID4)
- 2903-3007 👾 ยานลูก — 1 ลำต่อ 1 ตัวอักษร (บินเพ่นพ่าน + ยิงตอบเฉพาะผู้เล่นที่ยิงโดนลำนั้นก่อน)
- 3008-3011 👥 พันธมิตร — หน่วยรบภาคพื้นอาวุธครบมือ + ฝูงเฮลิคอปเตอร์ติดมิสไซล์
- 3012-3116 🪖 รอบ 423: ระบบตัวละครทหารแบบมี "ข้อต่อ" (rig) — รองรับโมเดล .glb ของผู้ใช้
- 3117-3629 🤖 รอบ 424: จับชิ้นส่วนเข้าข้อต่อ "อัตโนมัติจากตำแหน่ง" (ผู้ใช้ไม่ต้องตั้งชื่อ)
- 3630-3775 🚁🅿️ รอบ 434: เฮลิคอปเตอร์จอดในสนามรบ 5 ลำ (โมเดลจริง helicopter.glb — ผู้ใช้สั่ง)
- 3776-4078 🎛️🚁 รอบ 532: ห้องนักบิน "ภาพจริง + เข็มเกจขยับ" (ผู้ใช้สั่ง — เหมือนโลก helicopter ทุกประการ)
- 4079-4103 🔫 อาวุธในมือผู้เล่น (view model ติดกล้อง — เห็นปืนที่ถืออยู่แบบ Delta Force)
- 4104-4210 🎯🔧 TUNE ZONE — ท่าถือปืน (แก้ที่นี่ที่เดียว · 3 บรรทัดล่างนี้เท่านั้น)
- 4211-4266 💪 มือถือปืน มุมมองที่ 1 — รอบ 518 (ผู้ใช้สั่งตรง: เปิดโชว์มือจริง)
- 4267-4404 🧤 รอบ 518: โมเดลมือจริง (GLB จาก Tripo) — ผู้ใช้เจนเอง img/models/hand_grip.glb
- 4405-4553 🔧 รอบ 427: ยืดลำกล้องปืนหลัง export (ผู้ใช้: โมเดล R93 ลำกล้องสั้นไป)
- 4554-4748 🔩 รอบ 447: ชักลูกเลื่อนแบบ SV-98/Delta Force (ผู้ใช้ส่งคลิปอ้างอิงมา)
- 4749-5293 🔫 FPS WEAPON SPRITE ADAPTER — isolated from gameplay/world state
- 5294-5560 💥 เอฟเฟกต์: ระเบิด · ประกายโดน · ลำแสง · เศษซาก
- 5561-5690 🛡️🔵 รอบ 581 (ผู้ใช้สั่ง): "เกราะยานแม่ที่มองไม่เห็น"
- 5691-5796 🎯📝 รอบ 471: เป้าฝึกยิงในสมรภูมิ (ผู้ใช้สั่ง)
- 5797-5857 🔎 รอบ 473: โจทย์แปลไทย — "ยิงคำที่แปลว่า …"
- 5858-6253 🎯 ระบบยิงของผู้เล่น
- 6254-6267 🎯📡 รอบ 563: เรดาร์ล็อกเป้า + มิสไซล์นำวิถีเข้าเป้าที่ล็อก (ผู้ใช้สั่ง — สไตล์ Ace Combat)
- 6268-6410 🎯🔒 รอบ 564 (ผู้ใช้สั่ง): ล็อกหลายเป้าพร้อมกัน → ยิงมิสไซล์รัวทีละชุด
- 6411-6462 🧭🚀 รอบ 572 (ผู้ใช้สั่ง · ต่อยอดรอบ 569): ลูกศรบอกทิศ "จรวดที่พุ่งเข้าหาเฮลิเรา" บนจอเรดาร์
- 6463-6534 📡⬇️ รอบ 575 (ผู้ใช้สั่ง): เรดาร์ต้องไม่ทับ "แผงสถานะซ้าย" (พลังชีวิต/ความร้อนปืน/ลูกจรวด)
- 6535-6606 ⚔️ ดาเมจ / เงื่อนไขชนะ
- 6607-6697 📖 คำศัพท์ + รอบเล่น
- 6698-6761 🖥️ HUD
- 6762-6978 🕹️ Input — มือถือ (จอย+ปุ่ม) และคอม (WASD + pointer lock)
- 6979-7100 🚶 ผู้เล่น + AI + ลูป
- 7101-7105 🚁 โหมดขับเฮลิคอปเตอร์เอง (รอบ 414 — ผู้ใช้สั่ง)
- 7106-7264 🗺️ รอบ 417: แผนที่เลือกจุดลงสนาม (ผู้ใช้สั่ง) — เข้าเกมแล้วเลือกได้ว่าจะไปเกิดตรงไหน
- 7265-7423 🎖️ รอบ 418: นั่งเฮลิลำเดียวกับเพื่อน — "นักบิน + พลปืนประจำประตู" (ผู้ใช้สั่ง)
- 7424-7785 🔭🚫 รอบ 575 (ผู้ใช้สั่ง): "ซูมปืนค้างไว้ = ขึ้นเฮลิไม่ได้ ต้องเลิกซูมก่อน"
- 7786-8049 🌐 ผู้เล่นออนไลน์ใน map เดียวกัน (รอบ 414) — Firebase /world/invasion
- 8050-8195 🧯👥 กันผู้เล่นล้น — ฝั่งเรนเดอร์ของโลกนี้ (รอบ 637 · ยกส่วนกลางออกไป js/netroom.js รอบ 640)
- 8196-8254 💨 ควันตามหลังมิสไซล์ (รอบ 531 — ผู้ใช้สั่ง) — สไปรต์ควันนุ่มปล่อยเป็นระยะ
- 8255-8422 🔥🌀 รอบ 565 (ผู้ใช้สั่ง): ยานลูก "หลบมิสไซล์ที่ล็อกได้" — ปล่อยแฟลร์ + บิดหนี
- 8423-8502 🔫↩️ รอบ 568/1043: ยานลูกที่ถูกผู้เล่นยิงโดนแล้ว และกำลัง "ถูกเรดาร์ล็อก" จึงยิงสวนใส่เฮลิผู้เล่น
- 8503-8704 🔥🛡️ รอบ 569 (ผู้ใช้สั่ง): แฟลร์ของ "เฮลิผู้เล่น" + เสียงเตือนตอนถูกล็อก
- 8705-8715 🏃🪖 รอบ 530: หน่วยรบเคลื่อนที่เชิงยุทธวิธี (ผู้ใช้สั่ง: "อย่าปักหลักยืนทื่อ
- 8716-8841 🧘🎯 รอบ 586 (ผู้ใช้ส่งคลิป: "ตัวละครดิ้นไปดิ้นมา ไม่เป็นธรรมชาติ")
- 8842-9017 📣 รอบ 471: ทหารฝ่ายเราตะโกนบอกทิศศัตรู (ผู้ใช้สั่ง)
- 9018-9460 🌙 รอบ 471: โหมดกลางคืน — ฉากมืดสลัว + ท้องฟ้าดาว + ไฟฉายติดปืน
- 9461-9727 🔵💀 รอบ 576 (ผู้ใช้สั่ง): ยานแม่ยิง "ลำแสงสีฟ้า" ลงมาใกล้ตัวผู้เล่น — เตือน 3 ครั้ง ครั้งที่ 4 ตายจริง
- 9728-9778 ⚡👾 รอบ 579 (ผู้ใช้สั่ง): "ทุก 5 นาที สุ่มยานลูก 10 ลำ เร่งความเร็ว 10 เท่า นาน 10 วินาที แล้ววนลูป"
- 9779-9856 🔁 ลูปหลัก
- 9857-10581 ▶️ เข้า/ออกโลก
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
PEER_COLORS:410 · TAU:412 · HUD_ICON:422 · hudIcon:445 · CSS:453 · buildDom:1094
HUD_LAYOUT_KEY:1325 · HUD_TARGETS:1326 · HUD_PRESET_RIGHT:1337 · HUD_PRESET_LEFT:1346 · HUD_PRESET_TABLET:1348 · HUD_PRESETS:1357
hudCopy:1359 · hudRead:1360 · hudEl:1366 · hudSame:1367 · syncHudPreset:1370 · markHudCustom:1374
clearHudStyle:1375 · applyHudOne:1379 · applyHudLayout:1387 · applyHudPreset:1388 · ensureHudEntry:1393 · pickHudControl:1398
closeHudEditor:1405 · openHudEditor:1415 · initHudEditor:1421 · HELI_XF:1830 · HELI_OD_AMBER:1831 · CHORUS_RANGE:1987
resumeAudio:2019 · tryTex:2027 · letterSpriteTex:2040 · sandTex:2051 · wallTex:2073 · BULLET_SPD_R93:2101
loadGlb:2148 · tameGlbMaterials:2178 · fitInto:2190 · HILLS:2205 · buildTerrain:2214 · baseLow:2248
buildTown:2254 · TREE_LOD:2336 · buildTreesGlb:2338 · refreshTreeInstances:2364 · tickTreeLod:2382 · STREET_Z0:2392
instancer:2396 · buildWarStreet:2413 · roadSurfaceTex:2532 · fieldDecalTex:2554 · buildGroundDetail:2568 · buildMilitarySetDressing:2586
smokePointTex:2632 · buildBattlefieldAtmos:2638 · tickBattlefieldAtmos:2651 · sandbagWalls:2661 · squadCoverSpots:2669 · buildDustMotes:2679
tickDust:2690 · HOUSE_SIZE:2713 · HOUSE_LOD:2714 · HOUSE_COVER:2715 · HOUSE_CELL:2716 · HOUSE_SPOTS:2717
buildHouses:2723 · buildBlockGrid:2749 · gridBlocked:2785 · houseBlocked:2792 · houseCover:2801 · tickHouseLod:2809
findSniperSpots:2818 · buildMothership:2846 · layoutLetterPanels:2899 · makeFighter:2906 · FIGHTER_TEXTURE_KEYS:2971 · disposeFighter:2972
clearFighters:2995 · drawFighterBar:2998 · SOLDIER_PARTS:3019 · joint:3033 · buildSoldierRig:3037 · loadSoldierGlb:3080
applySoldierGlb:3081 · BODY_MAP:3125 · mergeMeshList:3137 · faceModelForward:3178 · skinSoldierLimb:3233 · autoRigSoldier:3275
fitSoldierGround:3407 · poseSoldier:3433 · MUZZLE_BY_WEAPON:3554 · FLASH_COLOR:3556 · makeSoldierFlash:3557 · makeSoldier:3564
makeHeli:3595 · HELI_ROTOR_NODES:3638 · HELI_TROTOR_NODES:3639 · HELI_LEN:3640 · HELI_DESERT:3641 · BOARD_DIST:3642
AUTO_BOARD_DIST:3647 · HELI_COL_SENS:3654 · heliPiloting:3655 · START_MS:3656 · START_PHASES:3657 · HELI_PADS:3664
SEAT_VIEWS:3672 · heliModel:3683 · buildHeliPads:3725 · padAt:3734 · movePad:3740 · startPhaseText:3745
setSeatView:3752 · tickPads:3765 · CP_NAT:3786 · CP_GAUGES:3787 · CP_LAMP:3798 · FUEL_MAX:3801
FUEL_WARN:3802 · ENG_AMB:3804 · HOT_FULL:3811 · heliLift:3813 · cpRpmNow:3818 · CP_SEAT_FULL:3819
CP_ZOOM:3820 · CP_DASH_OFF_Y:3821 · CP_DASH_DROP:3822 · CP_RPM_MAX:3826 · CP_SHAKE_RPM:3827 · loadCockpitImg:3832
layoutInvCockpit:3848 · cpNeedle:3876 · cpArc:3893 · cpRoundRect:3899 · tickHeliGauges:3906 · tickHeliHot:3931
heliLampLv:3948 · ALARM_GAP:3957 · ALARM_KEYS:3958 · resetHeliAlarm:3960 · tickHeliAlarm:3961 · cpLamps:3977
drawInvGauges:4011 · ZERO_DIST:4118 · GUN_VIEW:4132 · GUN_POS:4197 · GUN_ROT:4198 · GUN_SCALE:4199
useGunView:4201 · MUZZLE_Y:4207 · buildFist:4220 · buildArms:4240 · HAND_POSE:4277 · makeHandTopMat:4286
FOREARM:4292 · addForearm:4293 · loadHandModel:4301 · applyHandPose:4323 · fitArmsToWeapon:4332 · buildRifleModel:4338
buildR93Model:4359 · GUN_CUT:4414 · GUN_STRETCH:4415 · orientGunModel:4420 · stretchGunBarrel:4446 · mergeGunParts:4504
forceGunForward:4529 · attachBoltHandle:4561 · tickBolt:4589 · tickBarrelHeat:4632 · muzzleSmoke:4641 · alignGunMuzzle:4661
syncMuzzleAnchor:4697 · buildSelfShadow:4705 · SUN_DIR:4718 · tickSelfShadow:4719 · renderViewModel:4734 · fpsWeaponFrame:4753
fpsWeaponFireFeedback:4757 · fpsWeaponIntent:4763 · initFpsWeapon:4767 · tickFpsWeapon:4776 · vmToWorld:4783 · gunSil:4786
setGunPose:4811 · buildGun:4839 · tickSwap:4925 · applyWeapon:4935 · swapWeapon:4946 · setScoped:4960
smoothstep:4974 · tickSway:4978 · tickAds:5003 · applyRecoil:5124 · applyBreath:5130 · scopeRadius:5143
scopeRadiusNow:5155 · tickRange:5160 · layoutScope:5180 · scopeFovDeg:5230 · renderScopePass:5238 · cycleScopeMag:5266
renderAmmo:5274 · syncWeaponBtns:5285 · fxTex:5303 · fxGlow:5311 · fxFire:5319 · fxRing:5336
fxDisc:5344 · fxStar:5351 · boomFlashLight:5369 · tickBoomLight:5381 · boom:5390 · dustPuff:5456
sparkAt:5466 · tracer:5481 · tickFx:5497 · MSH_PAD:5573 · MSH_COL:5574 · MSH_CORE:5575
MSH_HINT_GAP:5576 · MSH_FX_MAX:5577 · msShieldOn:5579 · msShieldPt:5581 · msShieldRay:5592 · msShieldPow:5607
shieldBurst:5610 · shieldHit:5671 · tickShieldFx:5673 · TRG_COIN:5699 · QUIZ_COIN:5700 · targetTexture:5705
setTargetWord:5723 · targetSpots:5733 · buildTargets:5746 · tickTargets:5775 · quizPool:5803 · newQuiz:5806
tickQuiz:5812 · renderQuiz:5818 · targetWord:5825 · hitTarget:5831 · AIM_OFF:5866 · AIM_BY_GUN:5885
aimOffNow:5886 · adsPosNow:5895 · aimPct:5900 · layoutCross:5902 · aimDir:5905 · fireGun:5913
ENV_BLOCK_D:6017 · solidAt:6018 · envHit:6034 · HOLE_MAX:6093 · holeTexture:6094 · bulletHole:6109
tickBullets:6120 · RECOIL_PAT:6143 · RECOIL_RESET:6144 · addRecoil:6146 · startReload:6160 · tickReload:6168
launchMissile:6174 · misBusyHint:6201 · fireMissile:6205 · tickMisQueue:6241 · RDR_RANGE:6263 · RDR_FIND:6264
RDR_KEEP:6265 · RDR_LOCK_MS:6266 · RDR_BEEP:6267 · RDR_MAX_LOCK:6278 · RDR_ADD_GAP:6279 · SALVO_PER_TGT:6280
SALVO_PAIR_MS:6281 · SALVO_TGT_MS:6282 · LK_NUM:6287 · rdrOn:6288 · resetRadar:6289 · radarPick:6296
radarHolds:6310 · tickRadar:6316 · drawLockBoxes:6346 · drawRadar:6368 · AMK_TRACK:6424 · AMK_DECOY:6425
AMK_BEEP:6426 · amisRel:6428 · drawAMisMarks:6433 · RDR_GAP_TOP:6474 · RDR_GAP_JOY:6475 · RDR_SIZE:6476
RDR_SIZE_MIN:6477 · RDR_SIZE_SIDE:6478 · layoutRadar:6479 · lockTarget:6500 · rayTarget:6510 · raySphere:6527
damageFighter:6542 · dropFighter:6554 · updateArmor:6579 · killMother:6586 · flashScreen:6601 · myUid:6611
leaderUid:6612 · isLeader:6617 · pickWord:6618 · setWord:6631 · adoptWord:6641 · applyShared:6650
startWave:6665 · completeWord:6675 · renderWord:6701 · renderTarget:6711 · tickWordTimer:6722 · renderCoins:6732
renderHp:6733 · renderHeat:6739 · renderMissiles:6745 · toastBan:6755 · JOY_TOUCH_SLOP:6768 · invTouchInRect:6769
invTouchLookSide:6773 · invTouchRole:6777 · bindInput:6783 · moveJoy:6969 · unlockMouse:6977 · solidPushOut:6986
tickPlayer:7001 · hurtPlayer:7082 · MAP_VIEW:7111 · mapToWorld:7112 · worldToMap:7113 · zoneName:7114
buildMapShade:7128 · drawSpawnMap:7147 · safeSpawn:7222 · fitSpawnMap:7232 · openSpawnMap:7243 · applySpawnPick:7252
RIDE_DIST:7275 · RIDE_UP:7276 · RIDE_OFF:7277 · rideableHelis:7278 · findRide:7284 · nearestRideable:7285
ridePos:7295 · setRideView:7307 · boardGunner:7316 · dismountGunner:7335 · tickGunner:7351 · updateGunnerBtn:7391
tickAutoBoard:7407 · heliCount:7419 · zoomBlocksBoard:7437 · enterHeli:7447 · exitHeli:7489 · EXT_CAM:7518
EXT_VIEWS:7539 · EXT_SELF:7554 · EXT_RIDE:7555 · extP:7557 · syncExtBtn:7559 · cycleExtView:7565
resetExtCam:7574 · angDiff:7576 · extCamClear:7581 · extCamera:7600 · seatCamera:7623 · tickHeliFlight:7644
heliCrash:7743 · tickGpws:7753 · syncBotHelis:7775 · netReady:7791 · netJoin:7797 · netSend:7808
peerColor:7830 · NAME_SPR_H:7834 · nameSprite:7835 · bakedSoldierGlb:7851 · loadPeerSoldier:7852 · peerRig:7861
setPeerWeapon:7866 · peerBody:7871 · buildPeer:7900 · onPeer:7913 · dropPeer:7958 · netLeave:7965
peerTick:7970 · renderBoard:8006 · sendChat:8031 · showPeerBubble:8038 · removePeerBubble:8044 · PEER_DRAW_MAX:8057
PEER_DRAW_SLACK:8058 · DRAW_SWAP_MARGIN:8059 · JOIN_TOAST_MAX:8060 · drawnPeers:8063 · drawSlotFree:8064 · showPeerAgain:8067
hidePeer:8074 · tickDrawBudget:8079 · tickCrowdGuard:8089 · resetCrowdGuard:8093 · tickFighters:8095 · tickMother:8150
spawnAlienShot:8167 · tickAlienShots:8179 · smokeTex:8201 · spawnPuff:8212 · spawnSmoke:8222 · spawnDust:8224
tickSmoke:8233 · clearSmoke:8243 · tickHeliDust:8246 · EVA_WARN:8268 · EVA_FLARE_D:8269 · EVA_TURN:8270
EVA_SPIN_MUL:8271 · EVA_SPD_MAX:8272 · EVA_ROLL:8275 · EVA_Y:8276 · FLARE_PODS:8277 · FLARE_COOL:8278
FLARE_N:8279 · FLARE_LIFE:8280 · FLARE_TRAP:8281 · FLARE_CH:8282 · incomingMis:8287 · startEvade:8298
dropFlares:8307 · tickEvade:8335 · clearFlares:8367 · tickMissiles:8368 · CTR_REACT:8437 · CTR_WARN:8438
CTR_GAP:8439 · CTR_BURST:8443 · CTR_BURST_MS:8444 · CTR_SPD:8445 · CTR_DMG:8446 · CTR_MAX:8447
CTR_SPREAD:8448 · CTR_LEAD:8449 · ctrAimPoint:8452 · ctrArming:8459 · counterFire:8463 · tickCounter:8468
SPK_RANGE:8520 · SPK_MS:8521 · SPK_GAP:8522 · SPK_WORLD_GAP:8523 · SPK_BEEP:8524 · AMIS_SPD:8525
AMIS_TURN:8526 · AMIS_DMG:8527 · AMIS_LIFE:8528 · AMIS_MAX:8529 · AMIS_PROX:8530 · PH_FLARE_MAX:8531
PH_FLARE_RE:8532 · PH_FLARE_N:8533 · PH_FLARE_COOL:8534 · PH_FLARE_BACK:8535 · PH_FLARE_DOWN:8536 · PH_TRAP:8537
PH_FLARE_CH:8538 · renderFlareBtn:8541 · dropPlayerFlares:8547 · fireAlienMissile:8579 · clearAMis:8594 · resetSpike:8599
spikeStart:8600 · aMisNear:8602 · tickSpike:8610 · tickAMis:8662 · SQUAD_COVERS:8714 · squadCoverPool:8715
SQ_TURN:8725 · angWrap:8730 · turnTo:8732 · easeLook:8737 · squadTarget:8742 · pickSquadDest:8754
tickSquadMove:8768 · tickSquad:8794 · CALL_DIST:8848 · CALL_NEAR:8849 · CALL_GAP_ALL:8850 · CALL_GAP_ONE:8851
CALL_GAP_DIR:8852 · CALL_MS:8853 · CALL_LINES:8854 · CALL_SECTORS:8865 · bearingKey:8868 · clearSquadBubble:8876
callSprite:8882 · squadShout:8894 · tickSquadCalls:8907 · CHAT_GAP_ALL:8934 · CHAT_LINES:8935 · tickSquadChatter:8941
heliFireAt:8958 · nearestFighterTo:8970 · tickHelis:8976 · DAY:9025 · NIGHT:9027 · collectMsMats:9031
CYCLE_MS:9042 · MODE_ICON:9044 · STORM_MS:9051 · buildStars:9058 · buildStreetLamps:9081 · glowTex:9099
tickStreetLamps:9107 · beamPair:9124 · tickSearchBeams:9135 · buildBarrelFires:9172 · tickBarrels:9190 · tickShootingStar:9200
buildMist:9225 · tickMist:9235 · tickNightSound:9278 · tickSneak:9287 · tickStorm:9298 · nvReady:9314
nvEnter:9315 · nvExit:9321 · tickNvHint:9322 · dropGlowStick:9331 · tickGlowSticks:9348 · buildFlashlight:9357
setNight:9362 · setDayMode:9363 · tickNight:9377 · applyNightLook:9409 · tickFlashlight:9449 · MSB_FIRST:9479
MSB_GAP:9480 · MSB_WARN:9481 · MSB_KILL_WARN:9482 · MSB_NEAR:9483 · MSB_FLEE:9484 · MSB_R:9485
MSB_HOLD:9486 · MSB_MAX:9487 · MSB_DEAD_MS:9488 · MSB_BEEP:9489 · MSB_COVER_R:9492 · MSB_PAD_R:9493
MSB_COVER_RECHECK:9494 · msbEnsure:9499 · msbPlace:9516 · msbBarPos:9525 · msbHide:9532 · resetMsBeam:9536
msbCoverAt:9551 · msbAimBeside:9572 · msbBegin:9578 · msbAim:9595 · msbStrike:9626 · msbKill:9665
msbKickOut:9678 · tickMsBeam:9688 · TURBO_EVERY:9741 · TURBO_MS:9742 · TURBO_MUL:9743 · TURBO_N:9744
TURBO_TRACK:9745 · resetTurbo:9747 · turboPick:9752 · turboBegin:9759 · tickTurbo:9771 · fit:9782
tick:9788 · frame:9796 · build:9860 · start:9942 · exitWorld:10069

## js/lettercannon.js (219 บรรทัด · 0 รายการ)

## js/lobby.js (52 บรรทัด · 3 รายการ)
PANEL_TITLES:9 · openPanel:19 · closePanel:29

## js/lobby3d.js (780 บรรทัด · 0 รายการ)

## js/main.js (484 บรรทัด · 8 รายการ)
settingsButtonClick:101 · syncMusicBtn:117 · showRankRewardNotice:151 · showQuizBackPay:200 · showGiantRefund:245 · showTicketRefund:286
fitQbp:327 · bootGame:341

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

## js/online.js (2,064 บรรทัด · 110 รายการ)
### 🗂️ สารบัญโซน js/online.js (Read/Edit เฉพาะช่วง)
- 2-233 ENGINE: ระบบออนไลน์จริงผ่าน Firebase Realtime Database
- 234-329 ระบบเพื่อน (ข้อ 0.3): รหัสเพื่อน + ค้นหา + ส่ง/รับคำขอ
- 330-519 ระบบแชทกับเพื่อน (ข้อ 0.4)
- 520-691 ระบบส่งของขวัญ (ข้อ 0.5)
- 692-808 🏪 ตลาดออนไลน์จริง (item 2 backlog): ซื้อ-ขายสินค้าที่เพื่อน "ผลิตเอง" ข้ามผู้เล่น
- 809-873 คำเชิญเล่นโลก 3D ด้วยกัน — /tinv/<toUid>/<fromUid> = {map,n,ts}
- 874-1070 📰 Follow + Feed กิจกรรม (รอบ 155) · 🌍 หน้า Feed ทุกคน + ไลก์/คอมเมนต์ (รอบ 639)
- 1071-1078 🌍 หน้า Feed ทุกคน + ไลก์/คอมเมนต์ (รอบ 639)
- 1079-1221 📰 รอบ 701 — ฟีดล็อบบี้ทีละโพสต์ + รีแอ็กชัน + แจ้งเตือน (ต่อยอดรอบ 639)
- 1222-1454 🔔📥 รอบ 976 — เก็บแจ้งเตือนไลก์/คอมเมนต์ลง DB โซนใหม่ /gnotif/<uid>
- 1455-2064 📞 โทรหาเพื่อน — Voice call / Video call แบบ LINE (รอบ 625 · กลุ่ม 3 คนรอบ 631)
### รายการ js/online.js
ONLINE_STALE_MS:73 · ONLINE_BEAT_MS:74 · LEADERBOARD_SIZE:75 · LEADERBOARD_QUERY_SIZE:76 · onlineDisplayName:80 · onlineActivity:88
ensureOnlineId:108 · onlineKey:118 · onlinePushPresence:123 · onlinePushScore:133 · fetchPlayerStats:184 · onlineRerender:206
notifyFriendBadges:218 · FRIEND_ALPHA:244 · friendCode:245 · friendSearch:257 · friendRequest:281 · friendAccept:292
friendDecline:304 · friendsHeal:314 · CHAT_MAX_LEN:338 · CHAT_KEEP:339 · chatPairId:341 · chatRef:344
chatListen:350 · chatSend:366 · chatDeleteMsg:382 · TYPING_TTL:390 · typingRef:392 · chatSetTyping:393
chatClearTyping:403 · chatWatchTyping:411 · chatThemeRef:429 · chatSetTheme:430 · chatWatchTheme:435 · chatPrune:443
chatSeenTs:460 · chatMarkSeen:466 · chatUnreadCount:478 · chatWatchSync:481 · GIFT_EXPIRE_MS:531 · giftSend:534
greetSend:552 · giftAccept:566 · giftDecline:570 · giftInWatch:576 · giftReclaim:607 · giftOutWatchSync:617
giftOutRebuild:672 · salesWatch:702 · salesRerender:710 · sellInc:714 · marketWatch:722 · marketList:755
marketUnlist:763 · marketBuy:772 · marketSoldWatch:785 · tinvSend:814 · tinvClear:821 · tinvPartyTick:829
TINV_WORLD_LABEL:851 · tinvWatch:855 · FEED_MAX:882 · feedEvent:885 · feedPrune:897 · feedPurgeCat:908
feedPushAssets:919 · petDescriptor:937 · feedPushPets:943 · fetchPlayerPets:957 · followSet:973 · followUnset:984
feedRebuild:991 · feedWatchSync:1003 · fetchPlayerFeed:1030 · fetchPlayerAssets:1043 · fetchFollowers:1062 · GFEED_READ:1088
GFEED_KEEP_ME:1089 · gfeedPush:1092 · gfeedPrune:1106 · gfeedParse:1119 · gfeedWatchStart:1148 · gfeedWatchStop:1175
gfeedNotifDiff:1183 · gfeedNotifPush:1218 · GNOTIF_KEEP:1246 · GNOTIF_QUIET:1248 · gnotifKeyOf:1251 · gnotifSend:1258
gnotifAdd:1271 · gnotifRecount:1291 · gnotifMarkSeen:1296 · gnotifWatchStart:1307 · gnotifListen:1316 · gnotifWatchStop:1334
gnotifPrune:1339 · uidDisplayName:1352 · gfeedRebuild:1363 · gfeedToggleLike:1380 · gfeedSetReaction:1385 · gfeedToggleCommentLike:1401
gnotifTellComment:1419 · gfeedAddComment:1431 · CALL_RTC_CFG:1479 · CALL_RING_MS:1480 · CALL_MAX_MS:1481 · CALL_MAX_PEERS:1482
onlineStart:1898 · onlineLoadSDK:2039

## js/onlinecoinaward.js (22 บรรทัด · 0 รายการ)

## js/petbehavior.js (182 บรรทัด · 0 รายการ)

## js/photo.js (361 บรรทัด · 25 รายการ)
PHOTO_LS_KEY:12 · PHOTO_MAX:13 · PHOTO_PREFIX:14 · PHOTO_SIZES:15 · PHOTO_QS:16 · PHOTO_ZMAX:17
photoValid:25 · photoOnline:28 · photoGet:31 · photoHas:32 · photoIsMine:33 · photoOf:36
photoFetch:44 · photoAfterChange:61 · photoPush:65 · photoVerify:83 · photoSaveUrl:93 · photoRemove:99
photoPullMine:106 · photoBlkSrc:122 · photoMiniHTML:129 · openPhotoMenu:137 · photoLoadImgEl:203 · photoLoadFile:211
openPhotoCrop:224

## js/picdict.js (391 บรรทัด · 0 รายการ)

## js/picmatch.js (646 บรรทัด · 0 รายการ)

## js/picquiz_online.js (603 บรรทัด · 0 รายการ)

## js/pmaward.js (28 บรรทัด · 0 รายการ)

## js/sgaward.js (28 บรรทัด · 0 รายการ)

## js/shootword.js (1,085 บรรทัด · 0 รายการ)

## js/state.js (1,281 บรรทัด · 95 รายการ)
### 🗂️ สารบัญโซน js/state.js (Read/Edit เฉพาะช่วง)
- 2-236 STATE + LocalStorage + กติกากลางของเกม
- 237-690 👍 รอบ 701: รีแอ็กชันฟีด (กดค้างปุ่มถูกใจแล้วเลือกได้เหมือน Facebook)
- 691-746 Daily Quest (item 3 backlog): ภารกิจรายวัน 3 อย่าง สุ่มตามวันที่
- 747-852 มูลค่าทรัพย์สินสุทธิ (net worth) — ฐานของระบบแรงค์
- 853-902 🚫🍽️ สัตว์ป่วยเพราะหิว = ซื้อของกินไม่ได้ (รอบ 952)
- 903-996 เครื่องยนต์บิลรายเดือน (กลาง — ค่าบำรุงบ้านตอนนี้ / ค่าไฟ-น้ำ-เน็ต เสียบเพิ่มได้)
- 997-1121 🍖 เงินค่าอาหารสัตว์รายเดือน — ทุกวันที่ 1 ของเดือน จ่ายตามจำนวนสัตว์ที่เลี้ยงอยู่
- 1122-1281 โรงงานผลิตสินค้า: จ่ายค่าผลิตด้วย "แต้มคำศัพท์"
### รายการ js/state.js
STORAGE_KEY:6 · QUIZ_PASS_REWARD:11 · CURE_COST:13 · HUNGRY_SICK_MS:14 · MEAL_HOUR:16 · MEAL_FULL:17
SLEEP_FROM_HOUR:18 · SLEEP_SICK_HOUR:19 · WAKE_HOUR:20 · DINNER_COST:21 · TOXIN_FULL:23 · DETOX_COST:24
FOODQUIZ_Q:26 · FOODQUIZ_COIN:27 · FOODQUIZ_BONUS:28 · FOODQUIZ_MAX_PLAYS:29 · SHAPE_JUNK_MEALS:31 · SHAPE_CLEAN_MEALS:32
SHAPE_MISS_MEALS:33 · SHAPE_EXP_BONUS:34 · HEAT_SICK_MS:35 · THIRST_SICK_MS:36 · DEFAULT_STATE:38 · FEED_CATS:229
FEED_REACTIONS:243 · feedRx:251 · FEED_QUICK_CM:253 · SLOT_MS:265 · currentSlotStart:266 · nextSlotStart:272
mealDayKey:274 · nightKeyOf:276 · isNightNow:284 · newPet:289 · loadState:314 · saveState:651
activePet:658 · petStage:659 · isAdult:664 · abilityOn:665 · hasPetType:666 · todayStr:669
dailyTick:673 · addCoins:676 · QUEST_POOL:696 · QUEST_PER_DAY:705 · questsToday:706 · questTick:713
questEvent:717 · assetValue:753 · netWorth:773 · assetCount:775 · grantRankPromotionRewards:792 · refreshRank:822
heatProtected:840 · rainProtected:844 · petHungry:847 · petCanEat:851 · hungerSickLock:859 · hungerSickMsg:867
petShapeOf:875 · updatePetShape:881 · shapeMealDone:888 · heatPct:898 · ymStr:907 · billOutstanding:911
UTILITIES:918 · HOME_UTILITIES:924 · homeDecayed:926 · billTick:929 · PET_FOOD_PER_PET:1001 · petFoodTick:1002
myCar:1028 · carLoanDue:1033 · carLoanOverdue:1038 · carLoanPayable:1043 · carLoanPay:1050 · compTick:1063
ONLINE_RATE:1077 · onlineEarnActive:1078 · onlineEarnTick:1082 · onlineEarnFlush:1093 · marketTick:1103 · addCraft:1127
ORDER_MAX:1146 · ORDER_LIFE_MS:1147 · ORDER_GAP_MIN_MS:1148 · ORDER_GAP_SPAN_MS:1149 · ORDER_TIER_WEIGHT:1150 · newOrder:1151
orderTick:1164 · careTick:1172 · expNeed:1252 · addExp:1257 · addRP:1277

## js/thaitime.js (52 บรรทัด · 13 รายการ)
TH_TZ_MIN:22 · TH_DAY_MS:23 · thShift:28 · thMs:30 · thDate:31 · thHour:32
thHourF:33 · thDayKey:34 · thDayStart:35 · thAtHour:39 · thTs:40 · TH_TZ_OPT:45
thLocaleOpt:46

## js/tpaward.js (41 บรรทัด · 0 รายการ)

## js/typing.js (370 บรรทัด · 0 รายการ)

## js/ui.js (9,498 บรรทัด · 400 รายการ)
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
- 1348-1607 การ์ด Leaderboard — สลับแท็บในการ์ดเดียว (ประหยัดพื้นที่):
- 1608-2177 📈 ฟีดอันดับดีขึ้นบนหัวล็อบบี้
- 2178-2562 การ์ดข้อมูลผู้เล่น 👤 — คลิกชื่อในการ์ดเพื่อน/กระดาน แล้วโชว์
- 2563-2857 แผงเพื่อน 👥 (ข้อ 0.3): รหัสเพื่อน + ค้นหา + คำขอ + รายชื่อเพื่อน
- 2858-2953 🌍 เพื่อนอยู่โลก 3D ไหน + ปุ่ม "ตามเข้าไป" (รอบ 642)
- 2954-2992 แชทกับเพื่อน (ข้อ 0.4) — กล่องแชทลอยกลางจอ + แผง emoji
- 2993-3394 รอบ 179: หน้ารวมข้อความ (inbox แบบ Messenger — ธีมกระจกฟ้า sci-fi ของเกม)
- 3395-3755 ระบบส่งของขวัญ (ข้อ 0.5) — ห้องของขวัญ + กล่องเลือกส่ง + ฉากเปิด
- 3756-3848 RANK CARD + ฉากเลื่อนแรงค์
- 3849-3851 PET DASHBOARD
- 3852-3921 📰 รอบ 155: overlay ข้อมูลน้อง & การดูแล + ฟีดกิจกรรมเพื่อน
- 3922-4543 📰 รอบ 701 — ฟีดล็อบบี้ "ทีละโพสต์" แบบ Facebook (ผู้ใช้สั่ง 29 ก.ค. 2026)
- 4544-4738 🌍 รอบ 639: หน้า Feed เต็มจอ — ทุกคน (ไม่ใช่แค่ follow) + ไลก์/คอมเมนต์
- 4739-5416 📖 Dictionary ค้นหาคำศัพท์ (รอบ 254 ผู้ใช้สั่ง 16 ก.ค. 2026)
- 5417-5460 การนอน (คิว 7725691507 ข้อ 1)
- 5461-5883 ให้อาหาร (ระบบมื้อเย็น 18:00 + ความอิ่มสะสม — ข้อ 2+3)
- 5884-6002 🛡️ ควิซอาหารปลอดภัย (ต่อยอดข้อ 5.1)
- 6003-6088 🎀 ห้องแต่งตัวสัตว์เลี้ยง (รอบ 635: แยกออกจาก "ร้านค้า" เดิม —
- 6089-6276 ที่พัก (หลบแดด/หลบฝน) + เครื่องปรับอากาศ
- 6277-6394 บิลสาธารณูปโภค (ค่าไฟ/ค่าน้ำ — เครื่องยนต์อยู่ใน state.js: UTILITIES/billTick)
- 6395-6477 การ์ดมือถือ (ข้อ 7): ซื้อ 10,000 ขายคืน 6,000
- 6478-6488 การ์ดคอมพิวเตอร์ (ข้อ 11): ซื้อ 50,000 ขายคืน 30,000
- 6489-6533 item 8: โบนัสออนไลน์ +0.01 เหรียญ/วิ ฟรีทุกคนที่เปิดเกมออนไลน์อยู่
- 6534-6794 💻 รอบ 706 (ผู้ใช้สั่ง 29 ก.ค. 2026): ช่องรายได้คอมพิวเตอร์บนแถบบนล็อบบี้
- 6795-7153 🌀🔤 รอบ 1045 — Vocab Arena (โลกผจญภัยฉบับใหม่)
- 7154-7172 🌍 ปุ่มลัดเข้าโลก 3D ในรางเมนูซ้าย (ผู้ใช้สั่ง 9 ก.ค. 2026)
- 7173-7238 🔒 รอบ 1070/1132: โลกที่ยังไม่เปิดสาธารณะ — เปิดให้บัญชีทดสอบ 2 ชื่อเท่านั้น
- 7239-7409 ↩️🪙 รอบ 1143 — ธุรกรรมค่าเข้าเกม + คืนเงินเมื่อเกมเปิดไม่สำเร็จ
- 7410-7573 🧭 ป้ายบอกทางของรางเมนูซ้าย (รอบ 601 · ผู้ใช้สั่ง 26 ก.ค. 2026)
- 7574-7743 การ์ดสวนผลไม้ (ข้อ 12): ซื้อต้นไม้ปลูกได้ไม่จำกัด แต่ละต้นออกผล
- 7744-7753 โรงงานผลิตสินค้า 🏭 + ตลาดขายต่อ (แนวคิดใหม่ 5 ก.ค. 2026)
- 7754-7776 โรงงานผลิต (แผง 🏭) — แยกออกจากตลาด (ผู้ใช้สั่ง 6 ก.ค. 2026)
- 7777-7929 ตลาดขายสินค้า (แผง 🏪) — แยกออกจากโรงงาน
- 7930-8855 🚗 รอบ 131: หมวดยานพาหนะ — โชว์รูมรถ 10 คัน (แคตตาล็อก 5 ช่อง/แถว)
- 8856-8916 ร้านสัตว์เลี้ยง (ซื้อเพิ่มได้ ไม่ลบตัวเดิม)
- 8917-8953 เลเวลอัพ (รายตัว)
- 8954-9059 สถิติผลการเรียนรู้
- 9060-9097 item 4: การ์ดสรุปส่งครู — ใบเดียวจบ ชื่อ/วัน-เวลา/เหรียญวันนี้/แรงค์/สอบล่าสุด
- 9098-9498 📞 หน้าจอโทรหาเพื่อน — สายเสียง (รอบ 625 · กลุ่ม 3 คน + ปิดวิดีโอ รอบ 631)
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
LB_TABS:1355 · LB_ASSET_TOP:1356 · LB_ONLINE_TOP:1357 · LB_WS_TOP:1358 · LB_PM_TOP:1359 · LB_TP_TOP:1360
LB_BB_TOP:1361 · LB_SG_TOP:1362 · bindLbTabs:1364 · updateRankRailBadge:1425 · rankUpCheck:1444 · rankUpSound:1472
renderLeaderboardCard:1483 · bindLbGroupOpen:1516 · lbRankRows:1528 · RANK_MOVE_TOPICS:1614 · RANK_MOVE_MAX:1626 · RANK_MOVE_REWARD:1627
rankMoveFeedRender:1631 · rankMoveRewardCheck:1649 · showRankMoveRewardNotice:1668 · rankMoveFeedCheck:1706 · LB_BCAT_TOP:1738 · lbBadgeSections:1743
lbDemoRows:1769 · lbChar:1791 · lbfAwardBarHtml:1801 · openLeaderboardFull:1819 · BLK_PAD:1957 · BLK_PAD_NEW:1962
BLK_TOP_FIX:1963 · seatPodChars:1964 · lbOnlineCoinHtml:1976 · lbCoinHtml:1993 · lbBadgeHtml:2009 · lbBossHtml:2035
lbWordSearchHtml:2058 · lbTypingHtml:2094 · lbBubbleHtml:2126 · lbShootHtml:2148 · bindPlayerClicks:2183 · showPlayerCard:2193
bindProfileBadgeScroll:2474 · petDescImg:2492 · openImgLightbox:2505 · openPetPeek:2525 · updateBillBadges:2569 · setBadge:2579
tinvPendingCount:2595 · attentionPendingItems:2603 · attentionUnseenCount:2623 · attentionAcknowledge:2628 · updateSettingsBadge:2643 · attentionSummaryData:2659
openAttentionSummary:2687 · updateFriendBadge:2721 · renderFriendPanel:2731 · friendDoSearch:2779 · refreshFriendData:2803 · FRW_TTL_MS:2868
FRW_MIN_GAP:2869 · frwWorldOf:2873 · frwPanelOpen:2876 · frwScan:2881 · frwPaint:2903 · frwPaintHint:2924
frwFollow:2938 · CHAT_EMOJI_CATS:2959 · CHAT_THEMES:2981 · CHAT_SECRET_MS:2990 · chatBadgeSync:2998 · ibTimeStr:3006
IB_CALL_RE:3015 · ibCallInfo:3016 · openChatInbox:3021 · chatFitKeyboard:3191 · openChat:3207 · giftImg:3398
giftDateStr:3400 · GREETS:3408 · GREET_EXP:3416 · greetInfo:3417 · openGreetPicker:3421 · giftItemPic:3465
foodGiftBlocked:3475 · giftItemName:3481 · updateGiftBadge:3487 · renderGiftPanel:3496 · acceptGift:3554 · declineGift:3577
showGreetReveal:3586 · showGiftReveal:3613 · openGiftPicker:3639 · confirmSendGift:3707 · doSendGift:3733 · rankBadgeHTML:3759
renderRankCard:3764 · renderRankTab:3798 · showRankUp:3826 · bindPetPlateButtons:3861 · openPetInfoOverlay:3891 · feedAgo:3914
FEED_DECK_MAX:3934 · FEED_SLIDE_MS:3935 · FEED_RESUME_MS:3936 · feedPostImgIndex:3941 · feedPostImg:3952 · feedPostByKey:3961
feedCanReact:3964 · fpStatsHTML:3969 · fpNameBadgesHTML:3985 · fpostHTML:3989 · renderFeedCard:4024 · feedDeckGo:4062
feedDeckTick:4082 · renderFeedBell:4104 · FNT_JUMP:4113 · fntGiftName:4119 · feedNotifText:4123 · feedNotifGo:4138
feedNotifArrived:4153 · openFeedNotif:4160 · closeRxPicker:4215 · openRxPicker:4219 · feedFlyWord:4239 · feedPickRx:4250
FCM_REP_SHOW:4265 · FCM_FOCUS_POST:4266 · openFeedComments:4268 · closeFeedComments:4290 · fcmRowHTML:4299 · showCommentLikers:4322
fcmTreeHTML:4344 · renderFeedComments:4369 · bindFeedPostEvents:4497 · openFeedBoard:4550 · renderFeedBoardLive:4571 · renderFeedBoard:4589
stageColLeft:4608 · alignPetTabs:4617 · alignFeedPlate:4629 · alignProfilePlate:4645 · COIN_K_MIN:4663 · alignCoinBlock:4664
alignStageLeft:4692 · laneModeOn:4704 · alignStageCols:4717 · watchStageCols:4731 · dictRecordLookup:4750 · DICT_FILE_COUNT:4761
loadDict:4762 · dictSearch:4777 · dictTapWords:4792 · dictEntryHTML:4796 · openDictOverlay:4807 · renderDashboard:4891
sleepBtnHTML:5422 · sleepHintHTML:5429 · sleepAllPets:5440 · wakeAllPets:5453 · feedPet:5464 · openFoodMenu:5478
feedWith:5569 · AVATAR_UI:5599 · playerAvatarHTML:5603 · SHAPE_UI:5611 · showFeedResult:5620 · curePet:5661
heartsFx:5691 · PAT_HOLD_MS:5714 · PAT_EXP:5715 · bindPetTap:5716 · petBounce:5734 · petMood:5740
shortPatPet:5747 · longPatPet:5755 · patCalendarHTML:5775 · patDayKey:5809 · patStreakNow:5813 · patStreakTick:5818
cureCelebrateFx:5843 · railCureClick:5854 · detoxPet:5866 · openFoodQuiz:5889 · closeDressUpBoard:6008 · openDressUpBoard:6012
renderShop:6029 · homeVisualHTML:6092 · showHomeRuined:6106 · showCutNotice:6127 · renderHomeCard:6145 · payMaint:6229
trashBillUI:6245 · payTrash:6262 · UTILITY_UI:6281 · utilityBillUI:6330 · payUtility:6355 · buyUtilityFix:6381
renderPhoneCard:6399 · buyPhone:6439 · sellPhone:6461 · compLiveTotal:6482 · onlineLiveTotal:6493 · syncCoinHeader:6500
flashPillGain:6505 · renderOnlineEarnPill:6514 · renderCompEarnPill:6539 · openPillInfo:6572 · renderComputerCard:6655 · buyComputer:6690
sellComputer:6713 · soldCount:6734 · soldBadge:6735 · loadScriptOnce:6741 · advBusyMsg:6766 · advResetLoad:6778
loadAdv3d:6784 · loadVocabArena3d:6800 · enterAdventure3D:6804 · pickAdvMap:6827 · enterHaunted3D:6862 · enterHeli3D:6885
pickHeliMap:6912 · enterDrone3D:6948 · enterDrive3D:6968 · pickDriveMap:7007 · enterMotoMapAsCar:7043 · enterSoccer3D:7062
enterMoto3D:7082 · enterF1_3D:7105 · enterInvasion3D:7133 · WORLD3D:7161 · WORLD3D_COMING_SOON:7177 · world3DComingSoon:7178
gotoRobotShop:7181 · openHealDialog:7187 · world3DFail:7208 · worldEntryStarted:7244 · worldEntryStopped:7245 · GAME_ENTRY_STABLE_MS:7246
gameEntryCommit:7248 · gameEntryRefund:7256 · recoverInterruptedGameEntry:7273 · showGameEntryRefundNotice:7281 · startWorldEntry:7308 · railWorldClick:7352
openWorldEntryDialog:7376 · railScrollHint:7415 · railScrollTop:7423 · initRailScroll:7428 · renderRailWorlds:7448 · tinvNoticeHTML:7527
openTinvPicker:7535 · fruitCountdown:7579 · renderFarmCard:7591 · renderFarmClock:7666 · buyFruit:7682 · sellFruit:7702
sellAllFruit:7723 · collectImg:7752 · renderFactoryCard:7758 · renderMarketCard:7781 · updateWishBadge:7837 · openWishlistDialog:7848
bindStripArrows:7893 · renderMarketBrowse:7907 · carImg:7936 · renderVehicleShop:7937 · CS_CYCLE_MS:7988 · carInteriorImg:7989
carStatHtml:7991 · renderCarShowroom:7998 · csShowBig:8025 · csInit:8052 · RS_CYCLE_MS:8075 · robotImg:8076
renderRobotShop:8077 · rsShowBig:8099 · rsInit:8120 · buyRobot:8139 · enterMecha3D:8164 · pickMechaRobot:8192
pickDriveCar:8224 · openCarBuyDialog:8267 · buyCarInsurance:8328 · payCarLoanMonthly:8347 · payCarLoanFull:8359 · carDriveBlock:8378
gotoVehicleShop:8383 · gotoMyStock:8388 · showNeedCarDialog:8394 · craftDiscount:8406 · renderFactory:8409 · renderOrdersUI:8478
startProduce:8497 · buyCollectible:8525 · cancelProduce:8555 · deliverOrder:8569 · renderOrderClock:8586 · renderCollectMine:8596
openListDialog:8638 · cancelListing:8691 · buyMarketItem:8714 · showCollectReveal:8743 · buyAC:8781 · openHomeShop:8800
renderPetShop:8859 · showLevelUp:8920 · renderStats:8957 · showTeacherCard:9064 · CALL_REACT_EMOS:9108 · CALL_TALK_MIN:9111
CALL_TALK_HOLD:9112 · CALL_ORDER_GAP:9114 · CALL_TONES:9120 · startCall:9494

## js/util.js (1,300 บรรทัด · 51 รายการ)
### 🗂️ สารบัญโซน js/util.js (Read/Edit เฉพาะช่วง)
- 2-23 UTIL: เสียง / เอฟเฟกต์ / เครื่องมือทั่วไป
- 24-1269 🎖️ รอบ 643: สัญลักษณ์ระดับชั้น (ผู้ใช้สั่ง 28 ก.ค. 2026)
- 1270-1300 🖱️🚫 รอบ 833: กันกล่องดำ "To show your cursor, switch apps, reload the page…"
### รายการ js/util.js
shuffle:6 · fmtNum:15 · escapeHTML:19 · gradeSymbol:32 · gradeMark:47 · nameWithGrade:55
gradeMarkCanvas:61 · gradeOf:77 · seededRand:92 · fmtThaiDT:104 · fmtThaiDate:108 · IPHONE_LOBBY_VIEWPORT:118
fitIPhoneLobbyViewport:129 · showScreen:148 · TOAST_WARN_RE:159 · restackToasts:162 · clearWarnToasts:188 · toast:192
toastLink:219 · floatFx:237 · beep:248 · soundStatus:269 · PET_MOOD:385 · petVoiceSynth:392
sirenSynth:469 · playCashier:493 · cashierSynth:507 · keyTapSynth:540 · bubblePopSynth:578 · bubbleTapSynth:597
playSpark:608 · sparkSynth:622 · thunderFx:657 · wordAudioFile:725 · speakCutOff:734 · speakWord:738
speakLetter:777 · pickSpeakVoice:800 · speakWordTTS:811 · askNameDialog:838 · askConfirm:884 · alertBox:902
applyNoAnim:922 · BLK_VOCAB:929 · openSettings:977 · openHelp:1209 · openTeacherGuide:1235 · TAPGLOW_SEL:1259
TOUCH_INPUT_SEEN:1278 · mouseLockOK:1287 · lockMouse3D:1293

## js/vocabbook.js (207 บรรทัด · 14 รายการ)
VB_MAX:11 · VB_QUIZ_N:12 · VB_QUIZ_MIN:13 · vbGroup:16 · VB_GROUP_UI:21 · vbRecord:24
vbSeen:49 · vbStats:62 · vbList:70 · vbReviewCat:81 · vbStartReview:95 · openVocabBook:106
vbRender:148 · vbCardHTML:194

## js/wordsearch.js (485 บรรทัด · 0 รายการ)

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

## css/lettercannon.css (44 บรรทัด · 25 selector)
#lc-game:6,7 · .lc-hud:8 · .lc-glass:9 · .lc-stats:10 · .lc-stat:11 · .lc-wordbox:12
.lc-target:13 · .lc-meaning:14 · .lc-progress:15 · .lc-slot:16,17 · .lc-actions:19 · .lc-iconbtn:20,21
.lc-exitwide:22 · .lc-power:23 · .lc-power-name:24 · .lc-hint:25 · .lc-move:26,27 · .lc-shoot:28,29
.lc-modal:30,31 · .lc-count-exit:32 · .lc-card:33,34 · .lc-btn:35 · .lc-count:36 · .lc-toast:38
.lc-rotate:40

## css/lobby.css (5,738 บรรทัด · 801 selector)
:root:6,5457 · html:15 · body:21,5421,5463 · *:41,42,43,44 · #app:47 · h1:49
.subtitle:50 · .shop-title:51 · #rotate-overlay:54 · .screen:76 · #screen-select:85,86,87,88(+5) · .egg-need:95
.petshop-topright:97 · .petshop-play-link:98,103 · #screen-login:116,129,130,134(+12) · .login-lux:147 · .login-logo:148 · .login-tag:153
#screen-game:226,227,228,229(+7) · #screen-quiz:240,241,242,243(+6) · #quiz-choices:252,253 · .word-card:260 · .quiz-choice:261,262,263 · .big-btn:266,267,268,269
#screen-dashboard:274,1187,1195 · .lobby-top:288,923,924,925(+36) · .top-flex:289 · .profile-plate:290,294,844,3836(+12) · #rain-fx:299 · .rain-glass:303
.glass-drop:304 · .rain-vignette:323 · .no-anim:330,492,505,566(+59) · .rail-btn:333,945,951,953(+24) · .rail-badge:334 · .fr-code-box:339
.fr-code-label:343 · .fr-code-row:344 · .fr-code:345 · .fr-copy-btn:350,354,359,360 · .fr-search-btn:355 · .fr-add-btn:356
.fr-accept:357 · .fr-decline:358 · #fr-search-input:361 · #fr-search-result:365 · .fr-found:366 · .fr-hint:370
.fr-list-title:371 · .fr-row:372 · .fr-req:376 · .fr-row-name:378,382,5161 · .fr-row-status:386 · .fr-req-btns:387
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
.pl-card:800,2868 · .pl-close:806 · .pl-head:810,2636,2639 · .pl-grade:815,5167,5168 · .pl-body:816 · .pl-loading:817
.pl-none:818 · .pl-me-tag:819 · .pl-blk-wrap:821 · .pl-blk:822 · .pl-stat:823 · .pl-lbl:828
.pl-val:829,830 · .pl-tip:831 · .chip-edit:837,842,843 · .rank-mini:849,855,856,857 · .pass-photo:859,864 · .pet-tabs:866
.dict-box:867,871,872,873(+1) · .dict-card:879,884,888,889(+2) · .dict-head:885,886 · .dict-trail:893,897 · .dt-c:898,902,903 · .dt-sep:904
.dict-today:905 · .di-w:907,908,909 · .dict-list:910 · .dict-item:911,915,916,917(+5) · .lobby-mid:931 · .rail-wrap:934,979,990,991
.rail-scroll:936,973,977,978 · .lobby-rail:937,944 · .rail-nudge:980,988,989,992(+1) · .rail-worlds:999 · .rail-div:1000 · .lobby-stage:1047,1049,1065,1192(+13)
.newword-banner:1055,1062,1067,4515(+2) · .coin-fly:1078,1081 · .coin-plus:1087 · .nw-pop-coin:1102,1104,1105 · .nw-pop-goal:1108,1109,1113,1117 · .nw-goal-head:1110,1112,1114
.nw-goal-bar:1115 · .nw-goal-fill:1116 · .nw-pop-book:1118,1119 · .nw-tag:1140,4521,4543 · .nw-word:1145,4525,4548,4641 · .nw-hint:1147,1148,4526,4550(+1)
.nw-coin:1150,1153,4527,4531 · .nw-countdown:1158,4532 · .nw-bar:1160,4551 · .nw-bar-fill:1162 · .pet-stage:1165,3162 · .nw-box:1172,3171
.nw-pop-word:1173 · .nw-speak:1174 · .nw-pop-phon:1175 · .nw-ipa:1176 · .nw-pop-sent:1177 · .nw-pop-mean:1178
.pet-tab:1179,1180,1181,3619 · .stage-hero:1202,1217,1225,1370(+25) · .hero-ground:1239,1359,1365 · .hero-rank-bg:1241,1244,1247,1251(+18) · #lobby3d-canvas:1264,1265 · .hero-scene:1269,1271,1278,1279(+8)
.caretaker-fig:1318 · .caretaker-img:1321 · .caretaker-emoji:1323 · .blk-rig:1330,1331,1332 · .stage-plate:1392,1400,1411,1412(+23) · .plate-title:1406
.lobby-side:1439,1475,1480,1483(+22) · .side-sec:1442,2287,3514,3812 · .side-label:1443,1448 · .side-label-row:1451,1452 · .lb-tabs-out:1453,1454,1458 · .side-glass:1462,1469
.side-card:1481,1592 · #quest-card:1493,1494,1522,1523(+6) · .q-bigcard:1499,1528 · .qb-top:1501 · .qb-emoji:1502 · .qb-name:1504
.qb-bar:1505,1506 · .qb-row:1508 · .qb-prog:1509 · .qb-reward:1510 · .qb-go:1511,1515 · .q-dots:1516
.q-dot:1517,1518,1519 · .q-bonus:1520 · .inv-card:1539,1541,1542 · .inv-btns:1543 · .inv-go:1544,1546 · .inv-x:1547
#online-card:1551,3522,3523,3524(+7) · .fq-overlay:1552 · .fq-box:1554,3328 · .fq-head:1558,1560 · .fq-close:1561 · .fq-sec:1563
.fq-worlds:1564 · .fq-world:1565,1567 · .fq-acts:1568 · .fq-act:1569,1572,1573 · .lb-prize:1606 · .lb-coins:1609
.lbf-cell:1610,2715,2718,2719(+3) · .lb-award-bar:1612,1618,1619 · .lb-award-go:1620 · .lbf-award:1622,1628,1629,1630 · .pod-pz:1631 · .wsa-overlay:1634
.wsa-box:1636 · .wsa-head:1641 · .wsa-title:1642 · .wsa-when:1643,1644 · .wsa-close:1645,1648 · .wsa-cols:1649
.wsa-col:1650 · .wsa-sec-h:1651,1652 · .wsa-msg:1653 · .wsa-msg-h:1656 · .wsa-msg-b:1657,1658 · .wsa-msg-none:1659
.wsa-rules:1661,1662 · .wsa-list:1663 · .wsa-row:1664,1666 · .wsa-r:1667 · .wsa-n:1668 · .wsa-s:1669
.wsa-p:1670 · .wsa-prizes:1671 · .wsa-pz:1672,1675 · .wsa-reveal-medal:1676 · .lobby-bottom:1691,1694,1695,1697(+7) · .lobby-quiz-btn:1708
.lobby-book-btn:1709,1710 · .lobby-play-btn:1712,1716 · .lobby-exam-btn:1718,1719,1721 · .panel-overlay:1726,1731,4656,4657(+8) · .panel-box:1732 · .panel-head:1739,1743
.panel-close:1744,1749 · .panel-body:1750,1754,1755 · .panel-page:1752,1753 · .collect-sub:1759 · .mkt-empty:1760 · .craft-box:1761
.mkt-listing:1762 · .mkt-filter:1763,2107 · .hq-grid:1770 · .hq-card:1771,1776,1800 · .hq-head:1777 · .hq-pic:1783,1785
.hq-emoji:1787 · .hq-badge:1788 · .hq-stars:1792 · .hq-price:1793,1798,1799,1802(+6) · .craft-credit:1806,1808,1809 · .car-grid:1816,1818,1819
.robot-weap:1820 · .dmap-box:1823,1824 · .dmap-grid:1830 · .dmap-card:1832,1835,1836,1837(+2) · .dmap-ico:1839 · .dmap-new:1842
.dcp-grid:1844 · .dcp-card:1846,1849,1850,1851(+10) · .levelup-box:1868,3125,3126,3325 · .dcp-box:1871,1872,1876,1877(+6) · .dcp-lock:1885 · .sold-badge:1889,1891,1892
.rs-showroom:1894,5119,5120 · .rs-list:1895,1897,5100,5103 · .rs-thumb:1898,1900,1901,1902(+1) · .rs-thumb-pic:1903,1904 · .rs-thumb-price:1905 · .rs-stage:1907
.rs-big:1910 · .rs-big-img:1911 · .rs-elec:1915,1919,1924 · .rs-edge:1925,1931 · .rs-info:1934,1935,1936,1937(+1) · .rs-buy:1939,1941,1942
.cs-showroom:1946,5092,5093,5121(+3) · .cs-list:1947,1949,5094,5099(+9) · .cs-thumb:1950,1952,1953,1954(+1) · .cs-thumb-pic:1955,1956 · .cs-thumb-name:1957 · .cs-thumb-price:1958
.cs-thumb-own:1959 · .cs-stage:1961 · .cs-big:1964 · .cs-big-img:1965 · .cs-elec:1969,1973,1977 · .cs-edge:1978,1984
.cs-interior:1987 · .cs-inr-label:1988,1989 · .cs-inr-img:1990 · .cs-info:1992,1993,1994,1995(+6) · .cs-buy:2003,2005,2006,2007 · .car-emoji:2009
.car-mine:2015 · .car-mine-pic:2020 · .car-mine-info:2021 · .car-loan:2022,2023 · .car-mine-btns:2024,2025,2026 · .car-locked:2028
.car-mine-head:2030 · .car-pick-list:2031,2032 · .car-pick:2033,2035,2036 · .car-pick-pic:2037,2038 · .car-pick-name:2039,2040 · .car-pick-od:2041
.car-buy-box:2043,3332 · .cb-pic:2044,2045,2046 · .cb-lines:2047 · .cb-li:2048,2052,2053 · .cb-ins:2054,2058,2059 · .cb-plan:2060
.cb-pl:2061,2066,2068,2072(+1) · .cb-total:2079 · .cb-btns:2080,2085 · .cb-x:2081 · .shop-grid:2088 · .shop-item:2089,2094,2099,2100(+3)
.mkt-tab:2108,2109 · .pg-btn:2110,2111,2112 · .pg-dot:2113 · .fr-gift-btn:2147,2152 · .gift-sec-title:2155 · .gift-in-row:2157
.gift-out-row:2161 · .gift-in-pic:2162,2164,2165 · .gift-in-info:2166,2167 · .gift-in-btns:2168 · .gift-accept:2169,2173,2175 · .gift-decline:2174
.gift-box-card:2176 · .gift-box-from:2177,2178 · .gift-note:2179 · .gift-pick-overlay:2182 · .gift-pick-box:2186 · .gift-pick-head:2192,2196
.gift-pick-close:2197 · .gift-pick-tabs:2199 · .gp-tab:2200,2204 · .gift-pick-body:2205 · .gp-chips:2206 · .gp-chip:2207,2211
.gp-card:2212,2213 · .gp-price:2214 · .gp-note:2215 · .gift-cf-pic:2216 · .chat-emoji-cats:2221 · .chat-emoji-cat:2225,2229,2230
.chat-emoji-wrap:2231,2232 · .stage-left:2241,4647 · .pet-info-btn:2245,2252,2253 · .feed-list:2260,2264,2289,2290(+1) · .feed-empty:2265,2268 · .fd-tools:2274
.feed-bell:2275,2277,2278,2279 · .fd-prog:2283,2284 · .fpost:2291,3007 · .fp-head:2296 · .fp-who:2297 · .fp-name-line:2300
.fp-name:2301 · .fp-when:2302 · .fp-badges:2304,2307 · .fp-badge-ic:2305 · .fp-text:2309 · .fp-media:2312
.fp-img:2314 · .fp-cap:2316 · .fp-big:2317 · .fp-sum:2319,2321 · .fp-sum-rx:2322 · .fp-sum-none:2323
.fp-en:2324 · .fp-bar:2326 · .fp-act:2327,2331,2333 · .fp-like:2332 · .fp-page:2344,2345,2346,2347(+3) · .fp-rxbox:2350
.fp-rxb:2354,2356,2357,2358(+1) · .fp-rxb-off:2360 · .fp-fly:2362,2365,2366 · .fcm-overlay:2369 · .fcm-box:2371 · .fcm-post:2375,2376
.fcm-rxs:2377 · .fcm-rx:2378 · .fcm-list:2379,2381 · .fcm-row:2382,2383,2384 · .fcm-none:2385 · .fcm-item:2387
.fcm-reps:2388 · .fcm-rep:2390 · .fcm-more:2392,2394 · .fcm-arrow:2395 · .fcm-reply:2396,2398 · .fcm-like:2400,2403,2404,2405
.fcm-likeic:2406 · .fcm-cnt:2408,2410 · .fcm-likers-box:2411 · .fcm-likers-list:2412,2414 · .fcm-liker-row:2415 · .fcm-liker-none:2416
.fcm-repbar:2417,2420 · .fcm-repx:2421 · .fcm-note:2423 · .fcm-quick:2425,2427 · .fcm-q:2428,2431,2432 · .fcm-add:2433
.fcm-input:2434,2436 · .fcm-send:2437,2439 · .fcm-locked:2440 · .fnt-overlay:2442 · .fnt-box:2444 · .fnt-list:2448,2450
.fnt-row:2451,2453,2466 · .fnt-ico:2454 · .fnt-tx:2455,2456 · .fnt-sub:2457 · .fnt-hint:2459 · .fnt-go:2460,2463,2464,2472
.fnt-tag:2467 · .fnt-note:2469 · .fcm-hl:2474 · .feed-plate:2482 · .feed-all-btn:2483,2488 · .fdb-overlay:2493
.fdb-box:2495 · .fdb-head:2499 · .fdb-close:2503,2505 · .fdb-live:2506 · .fdb-live-title:2507 · .fdb-live-rows:2509,2511,2512
.fdb-live-row:2513,2515,2516,2517 · .fdb-dot:2518 · .fdb-list:2520,2521 · .fdb-empty:2522 · .fdb-row:2523 · .fdb-row-top:2525
.fdb-ico:2526 · .fdb-txt:2527 · .fdb-name:2528 · .fdb-ago:2529 · .fdb-actions:2530 · .fdb-like:2531,2534,2535,2536
.fdb-cm-list:2537 · .fdb-cm-row:2538,2540 · .fdb-cm-empty:2541 · .fdb-cm-add:2542 · .fdb-cm-input:2543,2545 · .fdb-cm-send:2546,2548
.fdb-cm-locked:2549 · .pi-overlay:2552 · .pi-box:2556,2561,2562,2566(+3) · .pi-close:2568,2573,2574 · .pi-close-left:2576 · .pi-portrait:2578
.pet-wear:2585,2588,2590 · .pi-portrait-wrap:2593,2595 · .pi-dress-btn:2603,2607,2608 · .pi-shape-cap:2609,2612,2613,2614 · .pi-shape-toggle-btn:2616,2619 · .pi-dress-pip:2621,2626,2627,2628(+1)
.pi-wear-note:2631,2633 · .greet-card:2640 · .greet-sub:2641 · .greet-grid:2642 · .greet-opt:2643,2646,2647,2648 · .greet-e:2649
.pi-streak:2653 · .pi-streak-head:2655,2657 · .pi-streak-best:2658 · .pi-dots:2659 · .pi-dot:2661,2662,2663 · .pi-streak-note:2664
.pi-care-title:2665 · .lbf-overlay:2678 · .lbf-box:2681,2695,2696,2697(+10) · .lbf-head:2686 · .lbf-title:2687 · .lbf-tabs:2688,2691
.lbf-note:2694 · .lbf-close:2710 · .lbf-close-l:2711 · .lbf-body:2712 · .lbf-grid:2713 · .lbf-box-bcat:2732
.lbf-bcat-wrap:2733 · .lbf-bcat:2735,2794,2795,2796(+3) · .lbf-bcat-head:2737,2738,2739 · .lbf-bcat-mid:2746 · .lbf-bcat-badge:2747,2806 · .lbcat-ic:2757
.badge-shine-img:2763 · .badge-shine:2781,2782 · .lbcat-ic-label:2808 · .lbf-bcat-rows:2810 · .lbf-one-row:2814,2815,2816 · .lbf-bcat-row:2817,2819,2820,2822
.lbf-podium:2834 · .pod:2836,2863,2864 · .pod-char:2838 · .pod-base:2840 · .pod-rank:2842 · .pod-label:2844,5163
.pod-name:2846 · .pod-sc:2848 · .pod-1:2853,2854 · .pod-2:2855,2856 · .pod-3:2857,2858 · .pod-4:2859,2860
.pod-5:2861,2862 · .pl-wide:2881,2884,2885,2886(+8) · .pl-follow:2887,2892,2894 · .pl-unfollow:2896,2902,2903 · .pl-followers:2904 · .pl-cols:2905,2910,2911,2912
.pl-col:2906 · .pl-sec-title:2907 · .pl-badges-col:2913 · .pl-feed:2914,2917,2924 · .pl-feed-row:2918,2922,2923 · .pl-assets-wrap:2926,5000,5075
.pl-assets:2927,5003,5008,5014(+4) · .pl-asset:2930,2934,2941 · .pl-asset-emoji:2935 · .pl-asset-n:2936 · .pl-pets-wrap:2943 · .pl-pets:2944
.pl-pet:2945,2950,2952 · .pl-pet-nm:2953 · .img-lightbox:2956,2961,2962,2966(+3) · .cert-svg:2985 · .cert-tap:2986,2991 · .cert-chip-sm:2994
.pl-sec-sub:3014 · .pl-certs:3015,3017 · .cert-mini:3018,3022,3024 · .cert-mini-cap:3025 · .cert-none:3027 · .lv-cert-row:3029,3031
.lv-cert-btn:3032,3037 · .cert-lightbox:3039,3044,3045,3049(+3) · .pl-chat:3069,3074 · .pl-call:3076,3082 · .pet-peek:3083,3084 · .pp-chips:3086
.pp-chip:3087 · .pp-gift:3092,3098 · .settings-box:3100,3101,3174,3185(+32) · .set-feed-head:3102 · .set-feed-sub:3106 · .set-feed-row:3107
.pillinfo-val:3112 · .pillinfo-desc:3117,3136 · .pillinfo-box:3128 · .plf-head:3131 · .plf-emoji:3132 · .plf-ht:3133,3134,3135
.plf-foot:3137,3139,3140 · .alert-box:3145,3147 · .ab-emoji:3148 · .ab-title:3149 · .ab-desc:3150 · .ab-btns:3151,3152,3153
.heal-heart:3155 · .attn-box:3170 · .set-tabs:3195,3199,3202,3203 · .set-attention-ico:3212 · .set-attention-copy:3213,3214,3215 · .set-attention-go:3216
.set-panels:3217 · .set-panel:3218,3221,3222 · .help-box:3306,3307,3308 · .wl-box:3326 · .food-box:3327 · .home-shop-box:3329
.summary-box:3330 · .report-box:3331 · .wl-grid:3334 · .tc-wrap:3336 · .spell-btn:3342,3347 · .sp-hud:3348
.sp-word:3350 · .sp-ch:3351,3356 · .sp-th:3358 · .sp-hint:3360 · .sp-exit:3363,3367 · .sp-banner:3368
.sp-big:3373 · .sp-thb:3375 · .sp-coin:3376 · #spell-confetti:3381 · .sp-rb:3382 · .sp-day:3392
.sp-perfect:3394 · .sp-late:3396 · #spell-coinpop:3399 · .side-sub:3508,3510 · .sec-quest:3515 · .on-page:3527,3528,3529,3530
.inbox-overlay:3540 · .ib-box:3542 · .ib-head:3546 · .ib-close:3550,3552 · .ib-list:3553,3554 · .ib-row:3555,3556,3557,3558
.ib-ava:3559,3564,3565 · .ib-on:3566 · .ib-mid:3568 · .ib-name:3569 · .ib-last:3570 · .ib-meta:3571
.ib-time:3572 · .ib-dot:3574 · .ib-story-badge:3577 · .ib-empty:3581 · .ib-story:3583,3585 · .ib-story-item:3586,3588,3595
.ib-story-ava:3589 · .ib-story-on:3593 · .ib-world:3598,3601 · .ib-tabs:3603 · .ib-tab:3604,3607,3609 · .ib-tab-dot:3610
.ib-call-ava:3614 · .ib-call-row:3615,3616 · #btn-music:3622,3625,3626 · #ws-overlay:3641 · #ws-board:3644,3650,3652 · .ws-head:3655
.ws-title:3656 · .ws-findbar:3659 · .ws-tip:3660 · .ws-grade:3662,3663 · .ws-body:3666 · .ws-gridwrap:3667
#ws-grid:3670 · .ws-cell:3675,3680,3682,3685(+2) · .ws-flash:3691,3693 · .ws-coinpop:3697,3721 · .ws-combo:3708,3712,3713,3714 · .ws-find:3725
#ws-prog:3726 · #ws-words:3730,3734 · .ws-word:3736,3741,3742,3743(+2) · .ws-actions:3751,3752,3761 · .ws-sizes:3756 · .ws-sizes-lb:3758
.ws-size-now:3759 · #ws-new:3762 · #ws-combo-help:3763 · #ws-stash:3764 · #ws-clear:3765 · #ws-combo-dialog:3767,3768
.ws-combo-card:3770,3773,3780,3781 · .ws-combo-lead:3774 · .ws-combo-steps:3775,3776,3778,3779 · .ws-combo-close:3782 · .ws-combo-ok:3784 · #ws-win:3785,3787
.ws-win-in:3788,3791 · .sec-online:3814 · .rank-tab:3844,3845,3846,3847(+2) · .pet-show-bg:3877,3880,3884,3888(+19) · .ps-night-fx:3980,3982,3994,3999(+1) · .pet-show:4009,4012,4024,4026(+48)
.ps-video:4240 · .ps-worn-pip:4318,4319 · .id-card:4342,4349,4353 · .id-chip:4366 · .clock-chip:4375,4376 · .coin-block:4392
.coin-group:4393 · .coin-pill:4423,4424,4445 · .cp-lb:4448 · .cp-v:4449 · .topbar-icons:4485 · .topbar-icons-row:4486
.rank-move-box:4488 · .rank-move-head:4493 · .rank-move-feed:4497,4501,4502 · .rank-move-row:4503,4507 · .rank-move-up:4508 · .rank-move-name:4509
.rank-move-topic:4510 · .rank-move-empty:4511 · .rank-move-gap:4512 · .nw-sub:4549 · .top-flex2:4644 · #panel-factory:4663,4664,4668,4669(+39)
#panel-rank:4804,4805,4811,4816(+11) · .grid2x8:4887,4893 · .pl-badges-vwrap:4902,4917 · .grid3x5:4903,4908 · .pl-badge-arrow:4909,4915 · .pba-u:4916
.pl-badges-strip:4921,4929,4930 · .pl-badge-card:4931,4937,4955,4956(+1) · .pl-badge-card-ic:4943,4952,4954 · .pl-badge-card-nm:4958 · .pl-badges-empty:4964,4966 · .mine-strip:4980,4982,4983,4988(+4)
.mb-strip:4994,5033 · .gmark:5141,5145,5146,5147(+1) · .gm-stack:5150,5154 · .gm-row:5156 · .lb-name:5158,5159,5160 · .grade-edit:5181,5186,5187
.gradelock-box:5191,5207,5212,5214 · .gl-head:5192 · .gl-emoji:5193 · .gl-ht:5194 · .gl-cur:5195 · .gl-lock:5196,5201
.gl-ok:5200 · .gl-lock-sub:5202 · .gl-why:5203 · .gl-pick-lb:5204 · .gl-opts:5205 · .gl-hist:5215
.gl-hline:5216 · .gl-hg:5220 · .gl-hat:5221 · .gl-harr:5222 · .gl-foot:5223 · .gl-cf:5224
.reg-gradelock:5246 · #tp-overlay:5256 · #tp-board:5258,5262 · .tp-head:5266 · .tp-title:5267 · .tp-stat:5269,5271
.tp-pts:5273,5276 · .tp-close:5278,5284,5285 · .tp-snd:5288,5291,5297,5298 · .tp-snd-ic:5292 · .tp-snd-track:5293 · .tp-snd-thumb:5295
.tp-prompt:5302 · .tp-word:5304,5318,5319 · .tp-ch:5306,5311,5312,5314 · .tp-thai:5322 · .tp-hint:5324 · .tp-empty:5326
.tp-keys:5329 · .tp-row:5331 · .tp-row-fn:5333,5366 · .tp-key:5337,5349,5351,5357(+2) · .tp-key-fn:5364 · .tp-fx:5370
.tp-coinpop:5371 · .tp-pop-pt:5376 · #city-backdrop:5390,5396 · .city-arrive:5397,5398 · .night:5412,5432,5433,5435(+2) · #night-veil:5458
.theme-emerald:5487,5499,5506,5509(+7) · .theme-plum:5492,5503,5507,5510(+3) · #theme-veil:5520 · #screen-picmatch:5573,5579,5580,5581(+38) · .pm-category-btn:5615,5618 · .pm-sheet-card-img:5619
.pm-card:5622,5627,5631,5633(+9) · .pm-grid:5625 · .pm-right:5655 · .pm-now:5656,5662 · #pm-now-en:5663 · .pm-now-th:5664
.pm-lobby-btn:5672,5676 · .pm-mode-btn:5701,5704 · .pm-wordcard:5705,5706,5708

## css/picdict.css (108 บรรทัด · 1 selector)
#screen-picdict:5,10,11,14(+54)

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
