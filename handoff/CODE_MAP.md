# CODE_MAP.md — แผนที่โค้ด:บรรทัด (เจนอัตโนมัติโดย `tools/gen_code_map.py` — **ห้ามแก้มือ** เดี๋ยวโดนเขียนทับ)

> วิธีใช้: หาชื่อฟังก์ชัน/ค่าคงที่/selector ในไฟล์นี้ (Grep หรือกวาดตา) → `Read` ไฟล์จริง `offset=<บรรทัด>` `limit=40`
> 🗂️ ไฟล์อ้วนมี **สารบัญโซน** (`st-end ชื่อโซน`) — งานทั้งระบบ/โลก 3D: Grep ชื่อโซน → Read/Edit เฉพาะช่วงนั้น **ห้ามอ่านทั้งไฟล์** · เพิ่มระบบใหม่ในไฟล์อ้วนต้องครอบ banner `/* ==== */`+ชื่อโซน (สารบัญเจนเอง)
> css = index `selector:บรรทัดทุกจุดที่ประกาศ` (บั๊ก UI เริ่มหาที่นี่) · เจนใหม่ทุกครั้งที่รัน `python tools/rotate_handoff.py` · อัปเดต: 2026-09-09

## js/account-deletion.js (235 บรรทัด · 0 รายการ)

## js/adv3d_css.js (1,318 บรรทัด · 0 รายการ)

## js/adv3d_intro.js (86 บรรทัด · 0 รายการ)

## js/adv3d_tex.js (250 บรรทัด · 19 รายการ)
TILE_COLORS:9 · letterTexture:10 · letterTextureDark:27 · emojiTexture:40 · GHOST_IMG_MAX:52 · measureGhostBox:58
probeGhostImages:71 · whenGhostsReady:83 · ghostTexture:87 · ghostScareSrc:92 · AD_STYLES:100 · adBoardTexture:109
addAdBillboard:160 · ringAds:172 · BUILDING_TINTS:182 · FACADE_ROWS:184 · buildingFacadeTexture:185 · makePeerSprite:210
bind:246

## js/adventure3d.js (13,531 บรรทัด · 664 รายการ)
### 🗂️ สารบัญโซน js/adventure3d.js (Read/Edit เฉพาะช่วง)
- 1-217 adventure3d.js — โลก 3D First-person 2 โหมด (คิว 7725691507 ข้อ 8 + ต่อยอด)
- 218-322 ⚽ โหมดสนามฟุตบอล (โหมด soccer · รอบ 196) — เล็ง+ชาร์จพลังเตะบอลใส่ป้ายตัวอักษร
- 323-377 🤖 โหมดหุ่นยนต์นักรบ (โหมด mecha · รอบ 199) — มุมมองในหุ่นสูง 5m เดินยิงเอเลี่ยนตัวอักษร
- 378-523 📻 หอบังคับการบิน (รอบ 64 · รอบ 66 เปลี่ยนเป็นอังกฤษล้วนตามผู้ใช้สั่ง)
- 524-562 คำศัพท์ — ตามระดับชั้น + ไม่ซ้ำคำที่ประกอบแล้ว (8.1/8.6) · แยกคลังต่อโหมด
- 563-698 Texture ตัวอักษร / emoji / ป้ายชื่อผู้เล่น (canvas → sprite)
- 699-1019 🧸 รอบ 1200: ตัวละครผู้เล่น Soft Cuboid Chibi 3D (Drive / Haunted Hotel / Soccer)
- 1020-1327 🚙 รอบ 393: รถเพื่อนในโลกขับรถ = โมเดลจริง img/models/car_01.glb (ผู้ใช้สั่ง)
- 1328-1480 สร้างฉาก static ครั้งเดียวต่อโหมด
- 1481-1826 🚗 เมืองกำแพงเพชรจริง (โหมด drive) — ข้อมูล OpenStreetMap ใน js/data/city_kpp.js
- 1827-1893 🧭🕳️ รอบ 782 — ปิดช่องขาดของกริดถนน (ผู้ใช้: "GPS พาไปช่วงที่ถนนขาดตอน / ขับต่อไม่ได้")
- 1894-2100 🌉 รอบ 788 — ปูถนนเชื่อม "เกาะถนนโดดเดี่ยว" เข้าโครงข่ายหลัก
- 2101-2158 🌳🚁 รอบ 811: จุด "พื้นที่สีเขียวข้างถนน" (greenPts) — สุ่มออกจากจุดบนถนนแต่ละจุด
- 2159-2210 🚁🌳 รอบ 816 — บินเฮลิคอปเตอร์เหนือ "เมืองกำแพงเพชร" แล้วลงจอดเก็บตัวอักษรบนพื้นที่สีเขียว
- 2211-2255 🌅 ท้องฟ้าภาพจริง (รอบ 203) — ใส่ภาพ panorama 360° (equirectangular 2:1) เป็นฉากหลังท้องฟ้า
- 2256-2293 🧱 เทกซ์เจอร์ภาพจริง (รอบ 323) — วางไฟล์ `img/tex/<key>.jpg` (หรือ .png) แล้วแปะทับพื้นผิวทันที
- 2294-2795 🌌 ท้องฟ้ากลางคืนโรงแรมผีสิง (รอบ 694) — ผู้ใช้: "ข้างนอกโรงแรมยังไม่น่ากลัวพอ"
- 2796-2834 🏨 โรงแรมผีสิง (รอบ 684) — ตัวตึก 5 ชั้นสร้างใน js/hotel3d.js
- 2835-2933 ตัวอักษรในโลก (8.2)
- 2934-3059 🔤🎯 รอบ 1354 — โรงแรม 5 คำ + ภารกิจพิเศษเดี่ยว
- 3060-3102 🌳🪙 รอบ 811: ความหนาแน่นเสริมเฉพาะโหมดขับรถ — ผู้ใช้: "เพิ่มตัวอักษรและเหรียญบนถนนและ
- 3103-3226 🔠🪙 เก็บตัวอักษร 1 ตัว = ได้ 1 เหรียญ (รอบ 345)
- 3227-3293 ประกอบคำอัตโนมัติเมื่อมีตัวอักษรครบ (8.1/8.4)
- 3294-3388 โหมด adv: monsters ยิงสู้ได้ (สเปกเดิม 8.5)
- 3389-3521 👻 รอบใหม่ — PNG-only ghost chase + client-side shader cosmetics
- 3522-3546 🏨 ระบบโรงแรมผีสิง — ห้องไม่ซ้ำ 5→ดับ, 10→ติด, 13→ดับอีกครั้ง
- 3547-3637 🏨 HAUNTED HOTEL CANONICAL RUNTIME BOUNDARY — Phase 2 รอบ 1084
- 3638-4093 🔤🧭 รอบ 1086 — HAUNTED HOTEL PHASE 4
- 4094-4327 เสียงหลอนโหมดผีสิง — สังเคราะห์ Web Audio (ปลอดลิขสิทธิ์ 100%)
- 4328-4479 🔊 รอบ 1071 — เสียงโรงแรมจากไฟล์จริง + ฝีเท้าแยกทุกตัวละคร
- 4480-4831 Multiplayer — ผู้เล่นอื่นใน map เดียวกัน (สไตล์ Roblox)
- 4832-5046 Voice chat ใน map — WebRTC P2P mesh (เสียงวิ่งตรงระหว่างเครื่อง)
- 5047-5127 🏁 พิธีประกาศแชมป์ (ครูกด "จบรอบแข่ง") — /class/<map>/podium
- 5128-5354 HUD
- 5355-6022 DOM overlay + CSS (สร้างครั้งเดียว — self-contained ไม่แตะ style.css)
- 6023-6158 Input — เมาส์+คีย์บอร์ด และจอสัมผัส (มือถือ landscape)
- 6159-6163 🚁 โหมดเฮลิคอปเตอร์ Bell — ฟิสิกส์บินแบบอาร์เคด (สไตล์ Helicopter Flight Pilot)
- 6164-6556 🛸 โดรน FPV (โหมด drone) — บินเร็ว/คล่อง ลอดหน้าต่างเข้าตึกร้าง เก็บตัวอักษรในห้อง
- 6557-6679 🚗 โหมดขับรถเมืองกำแพงเพชร — ฟิสิกส์รถอาร์เคด (bicycle model)
- 6680-6773 🚦 รอบ 133: ไฟจราจรจริงที่ทางแยกใหญ่ + ฝ่าไฟแดงโดนใบสั่ง ม.22
- 6774-7221 🧭 GPS นำทาง (โหมด drive) — เลือกตัวอักษรเป้าหมาย + เส้นทางตามถนนจริง (A*) · นำทางด้วยภาพล้วน (ไม่มีเสียงพูด ตั
- 7222-7280 🎛️ เข็มหน้าปัดวิ่งจริง (สปีด 0-180 + วัดรอบ 0-8×1000) — วาดทับวงเกจของภาพ dash.png
- 7281-7365 🎵 รอบ 181: วิทยุในรถ — จอ head-unit กลางคอนโซล (visualizer + เลือกเพลง 3 โหมด)
- 7366-7409 🪞📷 รอบ 810: กระจกมองหลัง/ข้าง — เรนเดอร์ฉากเดิมซ้ำด้วยกล้องหันหลัง/เฉียงข้าง แล้วยัดลงกรอบบนจอ (scissor)
- 7410-7493 🪞🧑‍🤝‍🧑 รอบ 973: เพื่อนที่ขับตามมา "เห็นในกระจกมองหลัง" + ป้ายชื่อลอยเหนือรถเขา
- 7494-7621 🪆 รอบ 191: ตุ๊กตาดุ๊กดิ๊กหน้ารถ — รูปตัวละครที่ผู้เล่นเลือก (blkN.png)
- 7622-7925 🚔 รอบ 128: แผงเตรียมออกรถ + กฎหมายจราจร + ใบสั่ง
- 7926-7968 🛩️📦 ภารกิจไปรษณีย์กลางคืน (รอบ 353) — เฉพาะช่วงฟ้ามืด (heliNight>.5)
- 7969-9183 🚶🛗🚁🪂 โหมดเดินเท้าในเมืองเฮลิฯ (รอบ 354 — ผู้ใช้สั่ง)
- 9184-9257 🎛️ หน้าปัดเข็มขยับจริง (รอบ 61) — วาดสดทุกเฟรมจากค่าการบินจริง
- 9258-9529 🌧️☀️ ชั้นบนกระจก: ที่ปัดน้ำฝน + แสงแดดสาด (รอบ 346)
- 9530-9934 🔊🌧️ เสียงที่ปัดน้ำฝน (รอบ 537) — สังเคราะห์ล้วน ไม่มีไฟล์เสียง
- 9935-10004 📹 กล้องใต้ท้องเครื่อง (belly cam) — รอบ 348
- 10005-10076 🎯 วงเป้าลงจอด (รอบ 349) — ไฮไลต์ดาดฟ้าที่มีตัวอักษร ให้รู้ว่าควรร่อนลงตรงไหน
- 10077-10692 📏 แถบเตือนความเร็วดิ่ง (รอบ 349) — ลงเร็วเกินกรอบกล้องกะพริบแดง สอนให้ร่อนลงนุ่มๆ
- 10693-10695 Loop หลัก
- 10696-12411 ⚽ โหมดสนามฟุตบอล — ฟิสิกส์บอล + เล็ง + ชาร์จพลัง + กล้อง 1st/3rd + ชุดนักเตะ
- 12412-12867 🤖 โหมดหุ่นยนต์นักรบ — เดินยิงเอเลี่ยนตัวอักษร (ต้องยิงเรียงลำดับในคำ)
- 12868-12889 เข้า/ออกโลก
- 12890-13531 ❓ การ์ด "วิธีเล่น" ตอนเข้าโลกครั้งแรก (จำแยกต่อโลกใน localStorage — ไม่แตะ state.js)
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
SOCCER_BGM_BUILD_URL:293 · SOCCER_BGM_URL:294 · SOCCER_BGM_VOLUME:295 · FIRE_CHG:300 · SB_DRAG:308 · SPOST_R:309
GK_Z:314 · GK_SPRITES:315 · PK_TIME:317 · MECHA_EYE:327 · ALIEN_COUNT:328 · MECHA_MAX_HP:329
MECHA_ATK_RANGE:330 · ALIEN_SHOT_SPD:331 · POWERUP_GAP:332 · BOSS_SCALE:333 · COMBO_X2:334 · BOSS_SPECIES:337
pickBossSpecies:345 · WAVE_BASE_GOAL:347 · waveCfg:348 · MECHA_WEAPONS:357 · ATC_REPLIES:386 · ATC_CLOSERS:391
ATC:396 · orderedLetterMode:506 · netUp:517 · CHAT_MAX:520 · doneList:527 · wordPool:528
pickWords:541 · hotelCreateWordSet:547 · adRenterActive:570 · FACADE_ROWS:577 · adsFetch:583 · adsWatch:595
adsStop:602 · adsChanged:603 · adRentBuy:614 · heliMusicTick:637 · AD_FLYBY_COIN:641 · adFlybyTick:643
adShopOpen:662 · adShopRender:676 · BLOCK_AVATARS:706 · blkGeo:718 · blkMat:719 · blkCyl:720
softCuboidGeo:723 · blkFaceMat:740 · softFaceAtlasGeo:756 · softFaceAtlasMat:772 · makeLegacyAdventureFigure:782 · makeSoftCuboidChibiFigure:824
makeBlockFigure:867 · makeBlockCar:869 · blkNameSprite:915 · makeBlockPeer:931 · makeWalkPeerWithFigure:952 · makeLegacyAdventureWalkPeer:962
makeSoftChibiWalkPeer:966 · disposeBlockPeer:969 · mechGlowMat:976 · makeMechaFigure:977 · makeMechaPeer:1007 · CAR_GLB_URL:1027
CAR_GLB_LEN:1028 · carSplitWheel:1032 · carGlbEnsure:1059 · carMatGet:1078 · carGlbBuild:1094 · carAvCode:1143
driveCamToggle:1150 · SKID_N:1169 · skidGeomGet:1171 · skidDrop:1176 · skidTick:1190 · blkBuildThumbs:1200
blkBuildPicker:1219 · pickBlockAvatar:1264 · bubbleSprite:1287 · showPeerBubble:1314 · removePeerBubble:1322 · concreteTexture:1332
brokenWindowTexture:1349 · intactGlassTexture:1365 · chargeIconTexture:1383 · rustyDoorTexture:1392 · dAddBox:1406 · buildAbandoned:1413
makeNameSprite:1486 · flatGeom:1499 · flatGeomUV:1508 · buildDriveCity:1518 · HELI_BODY_R:2171 · HELI_KPP_CEIL:2172
heliKppBlocked:2174 · heliKppSpawn:2195 · SKY_IMG:2218 · SKY_EXT:2219 · seamlessSkyCanvas:2225 · applySky:2245
applyTex:2263 · HSKY_R:2308 · hskyTex:2310 · buildHauntSky:2315 · tickHauntSky:2445 · buildScene:2463
randPos:2838 · randRoadPos:2846 · randGreenPos:2864 · HOTEL_PER_ROOM:2886 · HOTEL_MIN_GAP:2887 · hotelSpot:2888
hotelPruneLetters:2924 · HOTEL_QUEST_WORDS:2939 · HOTEL_FLOOR:2940 · HOTEL_SEARCH_FLOORS:2941 · hotelQuestReset:2944 · hotelClearQuestLetters:2949
hotelQuestWordLetters:2953 · hotelStartQuestWord:2957 · hotelFinalHint:2964 · hotelRevealFinal:2971 · spawnLetter:2978 · spawnLettersForWord:3036
ensureCoverage:3038 · DRIVE_LETTER_COPIES:3066 · DRIVE_BONUS_COINS:3067 · ensureDriveAmbience:3068 · removeLetter:3081 · spawnLetterAt:3089
tickLetterRespawns:3097 · LETTER_COIN:3108 · BONUS_COIN_VAL:3109 · pickUpLetter:3110 · hotelApplyCanonicalOrdinal:3171 · letterPop:3191
letterChime:3210 · tryCompleteWords:3230 · rewardCompletedWord:3245 · completeWord:3260 · spawnMonster:3297 · killMonster:3306
tickMonsters:3314 · damagePlayer:3336 · shoot:3352 · tickShots:3366 · GHOST_IMAGE_URL:3394 · makeGhostSprite:3396
hotelGhostPlayers:3399 · hotelTurnScare:3409 · spawnGhost:3424 · tickGhosts:3445 · sessionRecapHtml:3461 · renderHearts:3468
hotelGhostAttack:3472 · hotelGameOver:3487 · hotelScare:3503 · knockedOut:3515 · DARK_LETTER:3544 · tintSprite:3545
HOTEL_LIGHT_NORMAL:3553 · hotelGlobalLightLevel:3555 · hotelApplyCanonicalMask:3561 · hotelApplyCanonicalPhase:3568 · hotelApplyCanonicalState:3591 · hotelCurrentSearchObjective:3642
hotelSearchContext:3656 · hotelApplyObjectiveProximity:3660 · hotelProximityCue:3668 · hotelShowCriticalHint:3673 · hotelHideCriticalHint:3685 · hotelImportantHint:3690
hotelDirectorContext:3695 · hotelDirectorLightPulse:3706 · hotelDirectorPortraitShift:3722 · hotelDirectorScare:3731 · hotelRuntimeInit:3747 · hotelReset:3789
setTorch:3815 · toggleTorch:3831 · tickTorch:3836 · disposeHotelTorch:3844 · hotelBlackout:3856 · hotelApplyLightingState:3859
hotelLightsOn:3889 · hotelStartFlicker:3893 · tickHotelPlayer:3901 · tickHotelWorld:3979 · hotelAct:4027 · openWardrobe:4044
announceTarget:4073 · hotelFinishRound:4080 · netReady:4485 · netJoin:4491 · sendPos:4512 · netHonk:4562
sendChat:4568 · toggleChatBox:4582 · onPeerData:4593 · disposeHeliMesh:4685 · removePeer:4690 · netLeave:4706
tickPeers:4712 · RTC_CFG:4840 · tinvLinked:4841 · partyWord:4848 · syncPartyWord:4864 · updateVoiceBtns:5028
PODIUM_BONUS:5053 · podiumJoin:5055 · podiumLeave:5066 · endRound:5067 · showPodium:5078 · tinvCheck:5119
showBanner:5132 · renderHudTop:5138 · renderHotelSpecialMission:5149 · renderHudWords:5160 · renderHudInv:5170 · ddTierFromName:5177
renderBoard:5179 · drawBigMap:5219 · openBigMap:5274 · closeBigMap:5282 · drawMinimap:5287 · loadCarDash:5360
loadCarWheel:5372 · buildDom:5382 · confirmExit:6007 · IS_TOUCH:6026 · HAS_KBD:6028 · bindInput:6029
movePlayer:6124 · tickPlayer:6134 · collideDrone:6167 · propStall:6186 · propBreak:6193 · propFix:6200
droneBatAdd:6207 · lightningBolt:6210 · startRain:6221 · stopRain:6235 · smashGlass:6237 · awardGlass:6248
neededLetter:6265 · openDoor:6280 · raceStartRun:6300 · raceStop:6307 · gateHighlight:6325 · renderRaceHud:6332
tickDrone:6341 · nearMissTick:6484 · showNearMiss:6508 · awardDaredevil:6519 · comboCheer:6536 · comboFlash:6552
driveCell:6561 · nearestStreet:6567 · collideCar:6577 · tlDotY:6608 · tlSet:6612 · driveArms:6629
tlTick:6641 · TL_GREEN:6685 · tlRedDur:6687 · tlightPhase:6688 · buildTrafficLights:6695 · rlTick:6747
cellDrivable:6779 · cellWeight:6782 · cellBlocked:6787 · cellCenter:6788 · posReachable:6790 · losClear:6801
nearestDrivableCell:6812 · routeGrid:6824 · pickGpsTarget:6877 · NAVLINE_W:6900 · NAVLINE_SKIP:6901 · navLineEnsure:6902
navLineHide:6912 · navLineUpdate:6913 · tickGps:6949 · tickDrive:7020 · drawCarDial:7228 · drawCarGauges:7258
RADIO_RECT:7286 · CAR_RADIO_RECT:7288 · carRadioRect:7294 · radioLayout:7296 · radioSetHint:7319 · renderRadioList:7325
radioToggleList:7335 · drawRadioViz:7340 · radioTick:7358 · MIRROR_REAR:7372 · mirrorRearRect:7375 · mirrorPass:7377
toggleMirrorMini:7390 · drawCarMirrors:7397 · MTAG_MAX_D:7419 · mirrorTagsHide:7423 · mirrorTagName:7424 · mirrorTagsTick:7425
BOBBLE_FOOT:7499 · BOBBLE_H:7500 · BOBBLE_ASPECT:7501 · BOB_OMEGA:7504 · BOB_PITCH_FORCE:7506 · BOBBLE_SKINS:7508
bobbleSetAvatar:7515 · bobbleLayout:7522 · bobbleTick:7535 · bobblePoke:7560 · bobbleApplySkin:7577 · dollOwned:7587
openDollPicker:7588 · carStartShow:7625 · showLawInfo:7643 · lawNotice:7665 · driveFineSettle:7675 · HELI_PHASES:7854
heliStartPhase:7861 · heliFloorAt:7868 · SOFT_TIERS:7878 · softLandBonus:7880 · awardPerfLand:7893 · setHeliLight:7912
MAIL_COIN:7931 · mailStart:7933 · mailStop:7956 · mailTick:7957 · FOOT_EYE:7976 · doorSlideSfx:7982
doorLerp:8005 · entLerp:8013 · footStepSfx:8023 · WRING_COIN:8044 · festivalPaint:8048 · dustTexture:8060
dustBurst:8069 · dustTick:8083 · HELI_GLB_URL:8104 · HELI_GLB_TEX_BLUE:8106 · HELI_GLB_ROTOR:8108 · HELI_GLB_TROTOR:8109
heliGlbEnsure:8111 · heliMatBlueGet:8129 · heliGlbAssemble:8142 · heliNavTick:8181 · peerRotorStop:8188 · peerRotorTick:8194
heliCrashSfx:8213 · heliMeshBuild:8241 · heliMeshBuildLegacy:8252 · buildHeliFoot:8382 · footFloorAt:8498 · insideTerm:8505
inDoorZone:8506 · footHint:8510 · setFootBtns:8511 · liftStart:8516 · beginRide:8527 · endRide:8550
beginWing:8561 · awardAirLetter:8574 · paxChoiceShow:8593 · paxChoiceHide:8619 · pilotShipMesh:8623 · beginPilot:8624
endPilot:8656 · drawCabinWindow:8680 · tickHeliFoot:8704 · heliWallPenalty:8915 · tickHeli:8927 · CP_NAT:9192
CP_GAUGES:9193 · SEAT_LABEL:9206 · SEAT_P_FULL:9207 · SEAT_ZOOM:9208 · DASH_OFF_Y:9209 · DASH_DROP:9210
setSeat:9212 · layoutCockpit:9224 · WIPER:9263 · WIPER_SPD:9266 · WIPER_LABEL:9267 · INT_GAP:9268
WASH_MS:9272 · WASH_TANK_MAX:9276 · SMEAR_LIFE:9288 · CHOP_MIN:9289 · SUN_RAY_FAR:9293 · sunRayBlocked:9295
sunShadeTick:9314 · applyCockpitShade:9325 · rotorChop:9337 · sunUpdate:9345 · HELI_FOG_N0:9356 · fogUpdate:9360
adGlowPulse:9408 · RAIN_MAX:9417 · VISOR_Y:9418 · RAIN_MIN:9419 · RAIN_DUR:9420 · DROP_ZONE:9424
addDrop:9425 · tickDrops:9433 · addWashDrop:9451 · washStart:9458 · renderWashGauge:9478 · washTick:9489
grimeTick:9506 · WIPE_R:9513 · wipeDrops:9514 · wiperSndOn:9537 · wiperSndOff:9549 · wiperThunk:9555
washSpraySfx:9567 · wiperSqueak:9584 · wiperSndTick:9601 · setWiper:9621 · tickWiper:9633 · SH_SWEEP:9664
shadowSweepTick:9666 · REFL_MAX:9678 · REFL_COL:9680 · cityGlowLevel:9681 · drawCityGlow:9686 · setVisor:9718
rainTick:9724 · drawBlade:9741 · drawSmears:9760 · drawGlass:9780 · drawBellyCam:9942 · drawBellyHud:9965
drawLandingTargets:10011 · VS_HARD:10081 · drawDescentBar:10082 · heliShake:10131 · cpNeedle:10142 · drawGauges:10159
XF_START:10207 · PRELOAD_WAIT:10208 · ALT_QUIET_FROM:10210 · ALT_MAX_DAMP:10211 · ALT_LP_MIN:10212 · ECHO_NEAR:10213
WIND_FULL_SPD:10214 · SHUTDOWN_SEC:10215 · PAN_MAX:10217 · OD_RPM:10218 · SHAKE_RPM:10219 · SHAKE_HIT:10220
soccerLetterPos:10700 · letterNeeded:10708 · soccerNeededSet:10717 · soccerTileGeo:10725 · soccerGoldTexture:10727 · makeSoccerTile:10744
soccerRefreshSkins:10753 · soccerBuildTargets:10760 · soccerNextTile:10770 · soccerRetarget:10786 · soccerCoinPop:10798 · soccerGrassTexture:10811
soccerTurfGrade:10833 · soccerTurfTexture:10884 · grassNormalTexture:10903 · soccerLinesTexture:10932 · soccerNetTexture:10983 · soccerCrowdTexture:10991
soccerBallMat:11010 · buildSoccerGoal:11030 · soccerFloodTexture:11049 · soccerScoreboardTexture:11059 · buildStands:11068 · soccerLedBoards:11121
soccerMusicCanPlay:11143 · soccerMusicSyncButton:11146 · soccerMusicEnsure:11155 · soccerMusicCancelFade:11160 · soccerMusicStart:11163 · soccerMusicStop:11171
soccerMusicSessionStart:11179 · soccerMusicToggle:11182 · soccerMusicVisibilityChange:11187 · soccerGKEnsure:11266 · soccerGKTick:11282 · fkBuildWall:11311
fkToggle:11326 · fkHitTest:11342 · pkHud:11361 · pkStart:11370 · pkEnd:11384 · pkTick:11399
repQualify:11406 · repEnsureEl:11409 · repStart:11420 · repTick:11427 · soccerNumTex:11452 · ssSec:11464
ssPaintPattern:11469 · soccerShirtTex:11482 · makeSoccerPlayer:11504 · soccerNewSpot:11541 · soccerResetBall:11553 · soccerKick:11560
soccerCheer:11578 · guideTexture:11581 · auraActive:11605 · auraLeftMs:11606 · auraFlameTex:11614 · auraCoilTex:11638
auraCoilRibbon:11662 · auraGlintTex:11686 · buildAura:11697 · auraBuy:11740 · auraRender:11750 · auraTick:11764
buildDrill:11815 · drillTick:11828 · ballFXTex:11868 · buildBallFX:11879 · smokePuff:11895 · ballFXTick:11903
buildLandRing:11949 · buildGuideRibbon:11959 · renderSpinPad:11984 · spinPadToggle:11996 · spinPadPick:12002 · renderCurl:12014
kickLaunch:12025 · updateSoccerGuide:12034 · soccerCamera:12098 · tickSoccer:12122 · ssShirtPath:12316 · ssShortsPath:12324
ssPaintSwatchShirt:12329 · ssPaintSwatchShorts:12334 · ssPreviewDraw:12341 · soccerKitShow:12370 · soccerKitGo:12399 · emojiSprite:12453
makeAlien:12458 · startWave:12491 · waveSpawnFill:12502 · waveComplete:12511 · updateWaveHud:12521 · checkMechaBossBadge:12523
alienSpawnPos:12532 · removeAlien:12537 · mechaHudWord:12542 · setMechaHudSkin:12550 · mechaComboPop:12562 · mechaShielded:12567
mechaDamageFx:12569 · mechaHitByAlien:12574 · spawnAlienShot:12580 · removeAlienShot:12590 · tickAlienShots:12595 · spawnPowerup:12607
removePowerup:12620 · collectPowerup:12625 · tickPowerups:12632 · updateMechaHud:12641 · mechaTracer:12681 · mechaFire:12690
explodeAlien:12727 · tickMecha:12757 · loop:12813 · grabShot:12848 · savePhoto:12859 · clearEntities:12871
INTRO_KEY:12894 · introSeenObj:12895 · introSeen:12896 · markIntroSeen:12897 · INTRO:12898 · INTRO_MODE:12900
showIntro:12902 · HELI_KPP_BANNER:12928 · HAUNT_ENTRY_NOTICE:12930 · showHauntedEntryNotice:12934 · showModeIntro:12942 · closeIntro:12946
beginPlay:12952 · start:12954 · exitWorld:13187 · mechaRecapLine:13264

## js/app-update.js (214 บรรทัด · 0 รายการ)

## js/arena3d.js (724 บรรทัด · 0 รายการ)

## js/assetaward.js (21 บรรทัด · 0 รายการ)

## js/auth.js (557 บรรทัด · 54 รายการ)
AUTH_PUSH_MS:23 · AUTH_SDK_TIMEOUT_MS:24 · AUTH_CLOUD_SLOW_MS:25 · AUTH_CLOUD_TIMEOUT_MS:26 · SKY_BETA_OPEN:31 · SKY_BETA_EMAILS:32
skyBetaEmail:37 · canAccessSkyBeta:40 · ADMIN_NAME_EMAILS:46 · adminReservedNameKey:51 · isReservedAdminName:56 · canUseReservedAdminName:60
canAccessKartBeta:66 · isAdmin:69 · checkProfileName:72 · TEACHER_EMAILS:81 · isTeacher:82 · syncAdminAccess:86
TESTER_EMAILS:99 · TESTER_COINS:100 · TESTER_PET_GROWTH_FIX_VERSION:101 · isTester:102 · RANK_EXCLUDED_TESTER_NAMES:108 · rankUserExcluded:109
testerBoost:115 · authSetStatus:151 · authLocalSaveSafe:168 · authShowLogin:171 · authGateOffline:175 · authSaveRef:182
authFetchCloud:183 · authWriteCloud:203 · authDeleteCloud:204 · authWriteProfileName:205 · authPushProfile:212 · authApplyProfileName:220
authEnsureProfileName:244 · authAskProfileName:262 · authEditProfileName:276 · authStart:288 · updateOfflinePill:320 · authEnterOffline:325
authLateSync:342 · authIsAppMode:362 · AUTH_REDIRECT_CODES:370 · authLoginClick:372 · authOnLogin:392 · authSyncOnLogin:418
authFreshStart:447 · authAskLink:456 · authEnterGame:506 · authPushSaveAwait:522 · authPushSave:529 · authLogout:534

## js/award.js (279 บรรทัด · 0 รายการ)

## js/bandadv.js (452 บรรทัด · 28 รายการ)
BAND_ADV_REWARD:9 · bandAdvFailMsg:16 · bandAdvLoad:23 · bandAdvPlay:61 · BAND_ADV_EXAM:76 · bandAdvExamId:81
bandAdvExamName:83 · BAND_ADV_SUPREME_BONUS:90 · bandAdvCheckSupreme:91 · bandAdvExamLock:107 · bandAdvExamBest:116 · bandAdvExamCat:129
bandAdvShowExamSummary:150 · bigExamBadgeNote:178 · BXR_TOP:197 · BXR_READ:198 · bxrKey:202 · bxrSubmit:206
bxrMerge:237 · bxrFetch:254 · bxrRowHTML:275 · bxRankBodyHTML:287 · bxRankMount:302 · bxRankNote:334
bxRankNoteRefresh:343 · openBigExamRank:350 · bandAdvExamOpen:367 · bandAdvCardsHTML:421

## js/bbaward.js (14 บรรทัด · 0 รายการ)

## js/bubble.js (240 บรรทัด · 0 รายการ)

## js/cert.js (655 บรรทัด · 32 รายการ)
CERT_MAX:17 · CERT_ISSUER_EN:18 · CERT_MONTHS:19 · CERT_TOPIC_EN:23 · CERT_LEVEL_EN:44 · CERT_ADV_EN:49
CERT_BIG_LV:56 · CERT_STD_EN:59 · certThIndex:67 · certTitleOf:76 · certSerial:102 · certDateEN:110
certTier:118 · CERT_TIER_META:125 · CERT_LOGO_SRC:131 · certAward:140 · certMine:166 · certAwardGold:173
certAwardAdvSupreme:194 · certBackfill:210 · certCatNameById:238 · certFromPost:263 · certXML:281 · certFit:286
certFitMeasured:292 · certHolder:301 · certSVG:311 · certChipHTML:593 · openCertBig:609 · openCertMine:625
certStripHTML:633 · certBindStrip:647

## js/city3d.js (3,354 บรรทัด · 211 รายการ)
### 🗂️ สารบัญโซน js/city3d.js (Read/Edit เฉพาะช่วง)
- 2-18 city3d.js — 🏙️ VOCAB CITY: ล็อบบี้ 3D แบบเมืองลอยฟ้า (หน้ารอง index.html?lobby=3d; หน้าเริ่มต้น = Lobby Classi
- 19-51 ⚙️ CONFIG + เครื่องมือกลาง (รอบ 861)
- 52-126 🔒 รอบ 1070: ประตูโลกที่ยัง Coming soon — สิทธิ์ทดสอบมาจาก Auth ที่ฝังในเซฟ Lobby เดิม
- 127-229 📷 CAMERA RIG — 1 นิ้วเลื่อน · 2 นิ้วหมุน/เอียง/ซูม (รอบ 861)
- 230-394 🖼️ CANVAS TEXTURE โรงงานผิวสัมผัส (พื้นเกาะ/หน้าต่างตึก/ป้าย)
- 395-455 🏗️ BUILDERS — อาคารแต่ละแบบ (ห้ามกล่องเปล่าแปะ texture — มีชั้นเชิง/ระเบียง/หลังคา/ป้ายจริง)
- 456-844 🚪🌀 รอบ 897: ประตูม้วนเลื่อนขึ้น (โรงรถ/โรงเก็บยาน) — บานพับหมุนไม่ได้เพราะช่องกว้าง 3-5 เมตร
- 845-941 🚗🏍️🚁🛸 ยานพาหนะจิ๋ว (ผู้เล่นจริงจากโลก 3D จะขับ/บินสิ่งเหล่านี้ในเมือง)
- 942-998 🧍 ตัวละครผู้เล่น — blk1-8 = หุ่นบล็อก 3D · blk9-88 = ป้ายภาพ 2D ตั้งในโลก
- 999-1019 🌆 ผังเมือง — อาคารทุกหลังผูก go=<key> (ตัวรับใน js/main.js)
- 1020-1372 🇹🇭 O-NET EXAM HALL — ปุ่ม Lobby 3D (รอบ 1183)
- 1373-1517 🎉 เทศกาลตามวันที่จริง — พลุปีใหม่ / สงกรานต์ / ลอยกระทง (รอบ 863)
- 1518-1795 🧑‍🤝‍🧑 ผู้เล่นจริง (อ่านอย่างเดียว) — presence→ยืนตามอาคาร · world→ขับ/บินในเมือง
- 1796-1952 💬 รอบ 866: บับเบิลแชทสดลอยหัวเพื่อนในเมือง
- 1953-2109 🖊️💬 รอบ 868: พิมพ์ตอบแชทได้จากในเมือง (ไม่ต้องกลับล็อบบี้เดิม)
- 2110-2259 💬🔴 รอบ 873: ไอคอน "มีข้อความค้าง ยังไม่ได้อ่าน" ลอยเหนือหัวเพื่อน
- 2260-2277 🚪 รอบ 870: กลับจากล็อบบี้เดิม → โผล่ที่ "หน้าประตูตึกที่เพิ่งเข้า"
- 2278-2512 🚪🔊 รอบ 890: บานประตูตึกเปิด-ปิดจริง + เสียงประตูสังเคราะห์เอง
- 2513-2644 🚗🤖🛸 รอบ 900: ยานพาหนะแล่นออกจากช่องประตูม้วนที่เพิ่งเปิด → จอดรอหน้าประตู
- 2645-2812 🚶 รอบ 866: ตัวเราเดินไปหน้าตึกก่อน แล้วค่อยเข้าหน้านั้น
- 2813-2897 🚪🚶 รอบ 886: กลับจากล็อบบี้เดิม → "เดินออกจากตึกมาหน้าประตู" (walkSelfTo ย้อนทาง)
- 2898-3066 👆 แตะ/คลิก: ตัวละคร→การ์ดโปรไฟล์ · อาคาร→เดินทางไปหน้านั้น · พื้น→ประกายดาว
- 3067-3120 🎵 รอบ 873: เพลงประกอบเมือง (BGM) — ปุ่มเปิด/ปิดมุมขวาล่าง
- 3121-3156 🚀 BOOT
- 3157-3354 🎬 รอบ 880: กลับจากล็อบบี้เดิม → จอเปิดคือ "ภาพเมืองใบที่เพิ่งเดินออกไป"
### รายการ js/city3d.js
ISLAND_R:22 · RING_IN:23 · BAND1_R:24 · GROUND_TEX_PX:25 · NIGHT:26 · esc:46
hash:47 · rnd:48 · clamp:49 · TAU:50 · CITY_WORLD_COMING_SOON:55 · CITY_WORLD_TESTER_NAMES:56
cityWorldTester:57 · cityWorldComingSoon:72 · BLK8:78 · CAR_COL:89 · gradeStars:94 · MAT:112
mat:113 · GEO:117 · box:118 · cyl:119 · M:120 · groundAt:151
setupInput:160 · twoState:222 · cvs:233 · ctex:234 · groundTexture:241 · wallTex:295
wallMat:314 · shopSign:319 · roundRect:329 · iconSprite:336 · nameSprite:359 · blobShadow:381
parapet:403 · roofProps:408 · DOOR_W:420 · doorNightFx:424 · doorAt:441 · ROLL_Z_HOLE:465
slatTexture:468 · rollAt:478 · awning:502 · bTower:514 · bShop:534 · bHouse:552
bLibrary:568 · bFactory:586 · bArcade:613 · bObservatory:630 · bHallOfFame:644 · bHaunted:665
bHeliport:683 · bGarage:700 · bStadium:715 · bMotoTrack:737 · bUfo:758 · bHangar:778
bJungleGate:801 · bDronePad:823 · miniCar:848 · miniMoto:867 · miniHeli:887 · miniDrone:907
miniMecha:922 · makeBlockFigure:946 · makeSpriteFigure:982 · makeFigure:991 · pickBlk:994 · bld:1002
BUILDINGS:1003 · BLD_AT:1144 · buildCity:1146 · buildPlaza:1197 · buildGreens:1243 · _glowTex:1288
buildSky:1298 · buildAmbientTraffic:1360 · FESTIVAL:1377 · buildFestival:1389 · buildFireworks:1396 · buildSongkranDeco:1438
buildLoiKrathongDeco:1470 · actBuilding:1541 · loadFirebase:1552 · setCityLoginVisible:1561 · liveStart:1574 · lbGet:1592
watchPresence:1602 · spawnStander:1626 · WORLD_MAPS:1661 · pollWorlds:1668 · spawnVehicle:1719 · removeActor:1779
markPickable:1792 · BUB_MS:1805 · BUB_FRESH:1806 · BUB_MAXCH:1807 · BUB_MAX:1808 · BUB_TEX_KEEP:1809
bubTexture:1815 · bubTexRelease:1827 · bubbleSprite:1832 · bubDraw:1841 · killBubble:1868 · showBubble:1881
flushBubble:1919 · watchFriendChats:1927 · CITY_CHAT_MAX:1966 · CITY_QUICK_REPLIES:1968 · bubSafeText:1971 · actorInfo:1977
chatBoxCanSend:1987 · chatBoxWhy:1991 · chatBoxRefresh:1997 · openChatBox:2034 · closeChatBox:2046 · cbNote:2051
sendCityChatText:2057 · sendCityChat:2087 · cityStopLive:2092 · SAVE_KEY:2121 · saveRead:2124 · pairIdOf:2127
chatSeenTsCity:2129 · chatMarkSeenCity:2135 · unreadTexture:2148 · addUnreadBadge:2166 · removeUnreadBadge:2187 · setUnread:2197
applyUnread:2203 · markReadCity:2205 · unreadCount:2213 · spawnSelf:2219 · DOOR_MEM:2270 · rememberDoor:2271
lastDoorKey:2272 · DOOR_SWING:2294 · DOOR_OPEN_S:2295 · DOOR_SHUT_S:2296 · DOOR_AJAR:2300 · AJAR_QUIET_MS:2301
ROLL_OPEN_S:2306 · ROLL_SHUT_S:2307 · ROLL_LIFT:2308 · ROLL_AJAR:2309 · registerDoor:2312 · doorLeadS:2325
doorSpillTexture:2331 · doorCreakSfx:2342 · doorLatchSfx:2360 · shutterRollSfx:2383 · shutterClunkSfx:2410 · doorMoveSfx:2433
setCityDoor:2440 · openCityDoor:2451 · closeCityDoor:2452 · setDoorRest:2454 · refreshDoorRest:2466 · applyDoorPose:2476
RIDE_GATE:2528 · RIDE_OUT_S:2529 · RIDE_PARK_S:2530 · DOOR_RIDES:2533 · rideLeadS:2543 · rideSfx:2548
ridePose:2573 · launchRide:2590 · releaseRide:2602 · WALK_SPD:2651 · WALK_MIN:2652 · WALK_MAX:2653
DOOR_GAP:2654 · RECEPTION_SPOT:2658 · doorSpotOf:2659 · walkPose:2670 · footCtx:2685 · footStepSfx:2690
footDustTexture:2711 · footDustPuff:2720 · footDustTick:2734 · FOOT_STEP_DIST:2749 · DOOR_OPEN_AT:2750 · walkSelfTo:2752
EXIT_BACK:2824 · EXIT_DUR:2825 · EXIT_STEP:2826 · EXIT_CLEAR:2827 · EXIT_SHUT:2828 · stageExitWalk:2831
walkSelfOut:2843 · onTap:2901 · captureCityShot:2920 · travelTo:2953 · sparkleAt:2995 · openProfile:3019
refreshChip:3058 · setChip:3062 · BGM_KEY:3073 · BGM_DUCK_PICTURE_DICTIONARY:3074 · bgmWant:3076 · bgmEnsure:3077
BGM_DEV:3086 · bgmPlay:3087 · bgmDuckForPictureDictionary:3089 · bgmRefreshBtn:3094 · bgmToggle:3101 · bgmSetup:3106
boot:3124

## js/coinaward.js (21 บรรทัด · 0 รายการ)

## js/dailybox.js (142 บรรทัด · 0 รายการ)

## js/dictband.js (410 บรรทัด · 27 รายการ)
BAND_EMOJI:12 · BAND_SET_REWARD:13 · BAND_DONE_BONUS:14 · bandFailMsg:21 · bandLoad:28 · bandShortTH:60
bandCat:68 · bandSets:90 · bandSetId:99 · bandCheckComplete:102 · bandSetCat:119 · BAND_RETAKE_MAX:131
bandTriedSets:132 · bandRetakeCat:143 · bandShowRetakeSummary:177 · bandSetsPassed:205 · openBandSetPicker:213 · bandMine:285
bandUnlocked:286 · bandLockToast:291 · bandExamLobby:297 · updateBandExamBtn:306 · bandLobbyTick:323 · bandPlay:334
bandSpeakSample:346 · bandPlayLobby:366 · bandCardsHTML:378

## js/examstd.js (983 บรรทัด · 55 รายการ)
XS_PASS_PCT:15 · XS_REWARD:16 · XS_REWARD_AGAIN:17 · XS_ONET_REWARD:18 · xsIsOnet:21 · xsReward:22
XS_TIME_HINT:29 · XS_TIME_FALLBACK:30 · xsLimitSec:31 · XS_SCALE:35 · xsScaleText:41 · xsFindSet:52
examStdLoad:64 · xsFailMsg:99 · xsQuizId:107 · xsBest:109 · XS_HIST_MAX:124 · xsHistory:125
xsHistorySVG:134 · xsIsPractice:166 · xsShuffle:171 · xsRandomizedPack:175 · xsTimerStop:189 · xsElapsed:190
xsFmt:191 · xsMark:198 · xsSecStats:204 · examStdStart:218 · xsBuildScreen:239 · xsTimeUp:311
xsRender:320 · xsChoose:396 · xsGo:408 · xsQuitAsk:424 · xsClose:432 · xsSubmitAsk:438
xsFinish:453 · xsTimeTableHTML:548 · xsShowReview:572 · openExamStdPicker:638 · XRK_READ:705 · XRK_ALL:706
xrkSubmit:714 · xrkMerge:744 · xrkAllRows:764 · xrkFetch:782 · xrkNote:808 · xrkNoteRefresh:819
xrkAllRowHTML:828 · xrkBodyHTML:832 · xrkMount:847 · openExamStdRank:886 · examStdCardsHTML:903 · openExamStdBoard:938
openOnetBoard:972

## js/f1_3d.js (4,802 บรรทัด · 346 รายการ)
### 🗂️ สารบัญโซน js/f1_3d.js (Read/Edit เฉพาะช่วง)
- 28-223 ⚙️ ค่าคงที่ (TUNE ZONE)
- 224-272 📦 สถานะโลก
- 273-358 🏁 รอบ 1219 — MULTIPLAYER SAFE-DISTANCE START GRID
- 359-530 🔊 F1 DYNAMIC ENGINE AUDIO — sample จริง + RPM/เกียร์เสมือน + synth fallback (รอบ 1106)
- 531-610 🎵 RACING BACKGROUND MUSIC — lazy stream + browser disk cache + fade on exit
- 611-689 🖼️ texture: probe img/f1/*.jpg ก่อน → ไม่มีใช้ canvas วาดเอง
- 690-716 ✏️ sprite ตัวอักษร / ป้ายชื่อ (canvas → sprite)
- 717-794 🛣️ เส้นแทร็ก: (IS_KART?P.map:F1_MAP).track (จุดจริง OSM) → sample ทุก 5 ม.
- 795-1013 🌌🪽 รอบ 1217 — FANTASY MAIN-LINE AIR ROUTES (GPU COOL)
- 1014-1147 🏗️ สร้างฉาก: แทร็ก + kerb + runoff + อาคารจริง + ไฟ + ทะเลทราย
- 1148-1225 🏟️ PREMIUM MODULAR CIRCUIT ARCHITECTURE — รอบ 1203
- 1226-1784 ✨ F1 REALISTIC CIRCUIT — ฉากสนามมืออาชีพเฉพาะ Realistic Mode (รอบ 1125)
- 1785-1869 🏎️ รถประกอบ procedural สำหรับ Best-Lap ghost/fallback (รถผู้เล่นจริงใช้ VR-X1 ด้านล่าง)
- 1870-2070 🏎️📱 รอบ 1210 — SEMI-REALISTIC LOW-POLY PEER F1 (GPU COOL)
- 2071-2426 🖥️ DOM + CSS (เต็มจอ ไม่มีกรอบเครื่องเกม)
- 2427-2701 ✨ PREMIUM RACE HUD — รอบ 1203 · brushed metal + glass + neon accent
- 2702-2851 🌍 สร้างโลกครั้งเดียว
- 2852-3026 🪽 รอบ 904: DRS — ปีกหลังเปิดบนทางตรง (ตามรถเพื่อนใกล้ 25 ม.)
- 3027-3038 🏁 ฟิสิกส์ + จับเวลา
- 3039-3414 🌀 PORTAL DESTINATION PREVIEW — actual target curve / Canvas2D (รอบ 1222)
- 3415-3505 🏆 รอบ 903: กระดานอันดับ Best Lap ออนไลน์ (/f1Rank)
- 3506-3674 🚦👻 รอบ 902: ลำดับออกสตาร์ท (ไฟแดง 5 ดวง) + รถเงาวิ่งตาม Best Lap
- 3675-3727 🚧 เลนพิท — ผิวทางเต็มกริป + ลิมิตเตอร์ 80 กม./ชม.
- 3728-3823 🔤 คำศัพท์บนแทร็ก (แบบเดียวกับโลกมอเตอร์ไซค์ — REWARD สูงกว่า)
- 3824-3865 🏁 รอบ 1324 — R4 LIVE RACE POSITION (lap + track progress)
- 3866-4125 🧑‍🤝‍🧑 เพื่อนร่วมสนาม (NetRoom map 'f1')
- 4126-4215 📷 กล้องไล่หลัง + ลูปเกม
- 4216-4333 🔢 รอบ 916 — จอบนพวงมาลัยเป็น "ของจริง"
- 4334-4508 🚥 รอบ 918: แถบไฟ LED รอบเครื่องบนพวงมาลัย (เขียว → เหลือง → แดง ตอนใกล้เปลี่ยนเกียร์)
- 4509-4802 🚪 เข้า/ออกโลก
### รายการ js/f1_3d.js
createRacingWorld:19 · IS_KART:20 · BEST_KEY:21 · RANK_PATH:22 · RANK_STATUS:23 · REWARD:31
LETTER_COIN:32 · COLLECT_R:33 · DONE_KEY:34 · RECENT_KEY:35 · HALF_W:36 · KERB_W:37
RUNOFF_W:38 · BARRIER_LAT:39 · BARRIER_BOUNCE:40 · CAR_HIT_PARTS:44 · CAR_HIT_RADIUS:53 · CAR_RESTITUTION:54
CAR_SIDE_FRICTION:55 · CAR_RUB_DRAG:56 · CAR_SEP_EPS:57 · SAMPLE_M:58 · FP_EYE:60 · FP_FWD:61
FP_LOOK:62 · FP_DROP:63 · FP_FOV:64 · RFP_EYE:66 · RFP_FWD:67 · RFP_LOOK:68
RFP_DROP:69 · RFP_FOV:70 · ROAD_EYE:73 · ROAD_DROP:74 · ROAD_FOV:75 · REV_A:77
REV_MAX:78 · OFFTRACK_S:79 · WHEEL_HUB_X:81 · WHEEL_HUB_Y:82 · WHEEL_RATIO:83 · WHEEL_MAX_DEG:84
QUALITY_HAND_MAX_DEG:85 · LED_GREEN_N:89 · LED_AMBER_N:90 · LED_SHIFT_R:91 · LED_FLASH_HZ:93 · LED_K_LO:94
LED_K_SPAN:95 · LED_RPM_LERP:96 · F1_LEDS:97 · WHEEL_IMG_W:106 · DASH_PX:107 · QUALITY_PLATE_W:111
QUALITY_DASH_SCALE:112 · QUALITY_DASH_POSE:113 · DASH_LED_N:118 · DASH_RPM_MIN:119 · DASH_RPM_MAX:120 · SHAKE_KERB_AMP:122
SHAKE_SAND_AMP:123 · SHAKE_SPD_REF:124 · SHAKE_HZ:125 · WHEEL_SHAKE_KERB_PX:127 · WHEEL_SHAKE_SAND_PX:128 · PWR_A:130
ACC_CAP:131 · DRAG_K:132 · ROLL_A:133 · BRAKE_A:134 · BRAKE_DF:135 · COAST_A:138
COAST_STOP:139 · GRIP_BASE:140 · GRIP_DF:141 · GRIP_CAP:142 · STEER_MAX:144 · STEER_HI:145
SURF_RUNOFF:146 · SURF_SAND:147 · JUMP_GRAVITY:149 · JUMP_LANE_LAT:150 · JUMP_ENTRY_M:151 · JUMP_RISE_M:152
JUMP_GAP_M:153 · JUMP_LAND_M:154 · JUMP_EXIT_M:155 · JUMP_RECOVER_M:156 · JUMP_HEIGHT:157 · JUMP_LAND_H:158
JUMP_MAX_PITCH:159 · RAMP_ROLL_TRACK:160 · RAMP_ROLL_MAX:161 · RAMP_ROLL_EDGE:162 · RAMP_ROLL_RESPONSE:163 · RAMP_ROLL_RETURN:164
JUMP_PEER_Y_SEP:165 · JUMP_FRACTIONS:166 · JUMP_COLORS:167 · NET_SEND_MS:168 · ROOM_MAX:169 · CHAT_MS:170
CHAT_PRESETS:171 · F1_ROLL_WIRE:174 · CAR_COLOR_KEY:177 · F1_COLOR_WIRE:180 · CAR_STYLES:181 · COCKPIT_ASSETS:188
PEER_COLORS:195 · GRID_N:196 · GRID_FRONT_M:198 · GRID_GAP_M:199 · GRID_SIDE_M:200 · GRID_SAFE_M:201
F1_GRID_WIRE:202 · LIGHT_LEAD_S:204 · LIGHT_STEP_S:205 · LIGHT_HOLD_MIN:206 · LIGHT_HOLD_MAX:207 · JUMP_PENALTY_S:208
RACE_BGM_BUILD_URL:211 · RACE_BGM_URL:212 · RACE_BGM_VOLUME:213 · RACE_BGM_EXIT_FADE_MS:214 · GHOST_HZ:216 · GHOST_MAX:217
GHOST_KEY:218 · ACTIVE_GHOST_KEY:219 · PIT_HALF_W:220 · SURF_PIT:221 · PIT_LIMIT:222 · LINE:249
JUMPS:250 · PITL:264 · gridPose:276 · startGridUid:288 · startGridUids:292 · startGridSlotFor:295
gridFormationActive:300 · gridSlotClear:301 · safeStartGridSlot:312 · placeAtGridSlot:318 · settleStartGrid:327 · packetGridSlot:334
packetBodyRoll:340 · storedCarStyle:349 · saveCarStyle:352 · cockpitAsset:353 · raceMusicPreferenceOn:534 · raceMusicCanPlay:535
raceMusicUnlocked:538 · raceMusicSyncButton:539 · raceMusicEnsure:547 · raceMusicCancelFade:558 · raceMusicStart:562 · raceMusicStop:579
raceMusicToggle:598 · raceMusicVisibilityChange:603 · GEARS:607 · gearOf:608 · matLam:618 · matLit:624
applyTex:629 · texFromCanvas:633 · texProbe:641 · asphaltTex:653 · kerbTex:668 · sandTex:674
adTex:683 · letterTexture:693 · makeTextSprite:703 · cr:721 · buildLine:725 · nearIdx:764
jumpDeltaD:800 · jumpHalfAtD:803 · jumpPhaseAtD:811 · jumpHeightAtD:820 · jumpPitchAtD:833 · jumpProbeAtSample:845
jumpProbe:855 · jumpWheelGround:863 · jumpTerrainRoll:874 · chooseJumpStart:880 · prepareFantasyJumps:900 · jumpPose:914
fantasyRampGeometry:919 · buildFantasyCircuit:942 · surfAt:999 · ribbonGeo:1017 · kerbStrips:1038 · extrudeFootprint:1073
polyCentroid:1084 · pointInFootprint:1088 · footprintCrossesRoad:1097 · footprintFrame:1105 · premiumMats:1120 · instancedParts:1136
localPart:1145 · buildBuildings:1152 · chooseRealisticTier:1231 · isThermalMobile:1238 · useRacingSky:1242 · seededRand:1254
realisticAsphaltMaps:1258 · realisticRunoffTex:1304 · realisticSandTex:1320 · racingLineRibbonGeo:1338 · linePose:1349 · tracksideSpotClear:1357
instancedFromSpots:1361 · buildRealisticCircuit:1367 · buildTrackScene:1638 · buildF1Car:1788 · addPlayerContactShadow:1862 · peerF1MergedGeometry:1876
peerF1LoftGeometry:1894 · peerF1CombineGeometry:1921 · peerF1KitGet:1934 · buildPeerF1Car:1997 · replacePlayerCar:2028 · paintPlayerStyle:2044
primePlayerCockpit:2066 · CSS:2074 · buildDom:2491 · build:2705 · mapBounds:2818 · mapXY:2826
drawMap:2829 · DRS_ZONES_N:2860 · DRS_CURV:2861 · DRS_GAP_MAX:2862 · DRS_MIN_M:2863 · DRS_ENTRY_M:2864
DRS_NEAR_M:2865 · DRS_DRAG_K:2866 · DRS_FLAP_SHUT:2868 · DRS_FLAP_OPEN:2869 · attachDrsGlow:2874 · findDrsZones:2884
DRS_DET_M:2915 · DRS_SIGN_KIND:2916 · drsDetIdx:2923 · drsSignTex:2927 · buildDrsBoards:2939 · drsZoneAt:2981
drsPeerGap:2990 · drsTick:3003 · drsHud:3018 · respawnOnTrack:3031 · drawPortalDestination:3042 · beginPortalReturn:3066
portalTick:3077 · barrierBounce:3099 · carPartContact:3116 · carContact:3138 · resolvePeerCars:3148 · landFromJump:3185
jumpPhysicsTick:3195 · physTick:3233 · progressTick:3342 · fmtLap:3387 · puffSmoke:3393 · smokeTick:3404
FR_READ:3423 · frSubmit:3425 · frMerge:3442 · frFetch:3454 · frRowHTML:3472 · frBodyHTML:3481
frNote:3490 · frMount:3495 · setStartLights:3515 · resetLights:3520 · beginLights:3528 · lightsLocked:3529
paintLights:3530 · lightsTick:3540 · ghostEnsure:3589 · ghostHide:3606 · ghostLoad:3611 · ghostSave:3620
ghostReset:3623 · ghostRecord:3627 · ghostKeep:3636 · ghostGapAt:3643 · ghostTick:3651 · buildPitLine:3680
pitAt:3711 · inPitLane:3722 · racingLineLat:3731 · trackPointAhead:3739 · pickWord:3747 · spawnLetters:3762
renderWordHud:3776 · collectTick:3782 · completeWord:3803 · relocTick:3820 · packetRaceLap:3827 · packetRaceProgress:3831
racePositionSnapshot:3840 · updateRacePosition:3854 · netReady:3869 · netJoin:3874 · netSend:3887 · sendChat:3904
peerColorIndex:3911 · packetCarColorIndex:3916 · peerColor:3926 · buildPeer:3929 · onPeer:3963 · showPeerBubble:4000
removePeerBubble:4007 · dropPeer:4013 · peerTick:4034 · netLeave:4064 · layoutBoard:4070 · renderBoard:4093
CAM_MODES:4131 · CAM_NEXT_LABEL:4132 · cycleCamMode:4133 · applyCamMode:4137 · cockpitBox:4149 · layoutWheel:4158
wheelTick:4181 · DASH_FONT:4222 · positionQualityDash:4224 · layoutDash:4240 · dashRR:4250 · dashRpmTick:4257
dashTick:4267 · drawDash:4282 · buildLeds:4339 · ledsOff:4347 · ledTick:4351 · camTick:4378
hudTick:4430 · applyThermalPixelRatio:4441 · thermalGovernorTick:4447 · thermalRenderDue:4459 · frame:4469 · tick:4493
fit:4500 · applyEnvironmentProfile:4512 · start:4561 · exitWorld:4640

## js/f1_modes.js (125 บรรทัด · 14 รายการ)
STORAGE_KEY:7 · DEFAULT_MODE:8 · ENTRY_MODE:9 · SELECTOR_ENABLED:10 · CONTRACT:11 · freezeProfile:13
PROFILES:19 · MODES:38 · normalize:45 · readPreference:46 · writePreference:50 · selection:55
removeSelector:60 · openSelector:66

## js/fpsweapon.js (194 บรรทัด · 0 รายการ)

## js/game.js (1,230 บรรทัด · 91 รายการ)
### 🗂️ สารบัญโซน js/game.js (Read/Edit เฉพาะช่วง)
- 2-633 เกมจับคู่คำศัพท์ + หมวดคำศัพท์ & แบบทดสอบ
- 634-964 🎊🪙 รอบ 985: ฉลอง "ได้เข็มใหม่" + รางวัลเงินก้อน (ผู้ใช้สั่ง 3 ส.ค. 2026)
- 965-1230 หมวดคำศัพท์ & แบบทดสอบ 10 ข้อ (ผ่านที่ 8 ข้อขึ้นไป)
### รายการ js/game.js
MATCH_COIN_MULTIPLIER:23 · MATCH_COIN_PER_PAIR:24 · MATCH_ROUND_COIN_BONUS:25 · REPLAY_BONUS_EVERY:26 · REPLAY_BONUS_TIERS:28 · replayBonusFor:29
SESSION_MILESTONES:35 · addSessionCoins:38 · updateBestTarget:77 · weekKeyStr:90 · rolloverWeekBest:97 · exitGame:103
showSessionSummary:140 · sprinkleConfetti:187 · VOCAB_PER_LEVEL:206 · VOCAB_RANK_NAMES:207 · vocabRankName:208 · showProgressReport:210
THUNDER_MS:392 · THUNDER_TIERS:396 · THUNDER_TIER_UI:397 · thunderEmoji:398 · DAREDEVIL_TIERS:402 · DAREDEVIL_TIER_UI:403
daredevilEmoji:404 · GLASS_TIERS:408 · GLASS_TIER_UI:409 · glassEmoji:410 · DILIGENT_TIERS:414 · DILIGENT_TIER_UI:415
diligentEmoji:416 · SOFTLAND_TIERS:420 · SOFTLAND_TIER_UI:421 · softLandEmoji:422 · AIRL_TIERS:426 · AIRL_TIER_UI:427
airLetterEmoji:428 · MECHABOSS_TIERS:432 · MECHABOSS_TIER_UI:433 · mechaBossEmoji:434 · TYPIST_TIERS:441 · TYPIST_TIER_UI:442
typistEmoji:444 · checkTypistBadge:446 · BIGEXAM_TIERS:462 · BIGEXAM_TIER_UI:463 · bigExamEmoji:464 · bigExamCertCount:466
checkBigExamBadge:471 · BFF_TIERS:486 · BFF_TIER_UI:487 · BFF_COIN:488 · bffEmoji:489 · badgeSuffix:494
BADGE_META:513 · NAME_BADGE_RE:530 · splitNameBadges:531 · badgeEmojis:537 · badgeScore:542 · BADGE_CATS:549
earnedBadgeEmojis:565 · bcatLevel:580 · checkCrown:587 · currentBadgeScore:603 · rolloverBadgeWeek:607 · addDiligent:620
BADGE_COIN:639 · awardBadgeCoin:647 · BC_QUEUE:661 · celebrateBadge:662 · bcShow:676 · showBadgeInfo:705
addThunder:723 · startGame:737 · gameRoundActive:777 · stopGameRoundClock:781 · scheduleGameRound:785 · newRound:792
updateTimerBar:832 · updateComboPill:838 · pickCard:842 · checkMatch:854 · renderCats:968 · fmtMMSS:1018
quizTimerStop:1022 · quizTimerStart:1027 · quizElapsed:1037 · startQuiz:1041 · renderQuizQuestion:1059 · quizNext:1123
finishQuiz:1136

## js/gradelock.js (169 บรรทัด · 15 รายการ)
GRADES:21 · GRADE_LOCK_DAYS:25 · GRADE_LOCK_MS:26 · gradeRank:29 · myGrade:30 · gradeTester:31
gradeHistList:34 · gradeLockLeftMs:44 · gradeLockLeftDays:51 · gradeUnlockAt:52 · gradeLocked:53 · gradeUpOptions:56
gradeChangeTo:64 · gradeLockNote:91 · openGradeChange:100

## js/hauntedhotel.js (625 บรรทัด · 0 รายการ)

## js/hauntedhoteldirector.js (321 บรรทัด · 0 รายการ)

## js/hauntedhotelghost.js (239 บรรทัด · 0 รายการ)

## js/hauntedhotelsession.js (255 บรรทัด · 0 รายการ)

## js/home-v2.js (2,165 บรรทัด · 0 รายการ)

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

## js/images.js (286 บรรทัด · 30 รายการ)
IMG_FILES:12 · MOODS:13 · COLLECTIBLES_IMG_V:17 · GIFTS_IMG_V:18 · PET_ASSET_V:21 · PET_IMAGE_STATES:22
startImgKey:24 · petImageKeys:26 · petAssetPath:39 · petWearImage:51 · probeImages:63 · probeRankImages:83
probeCatalogImages:86 · probeCollectImages:98 · probeGiftImages:99 · probeHomeImages:100 · CLIP_FILES:109 · CLIP_SM:115
clipCanWebm:131 · CLIP_ASSET_V:142 · clipFileFor:144 · petClipKey:153 · petClipUrl:162 · equippedItem:175
petStateImg:186 · petWearOverlay:207 · wearLayerHTML:242 · happyNow:249 · makeHappy:250 · currentPetImg:263

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

## js/kart-access.js (22 บรรทัด · 2 รายการ)
valid:5 · authorize:6

## js/kart3d.js (236 บรรทัด · 16 รายการ)
softBox:11 · merge:21 · box:34 · starGeo:35 · makeKit:38 · paintMat:83
buildCar:84 · carView:95 · steer:96 · camera:97 · applyEnvironment:108 · buildTrack:117
animate:192 · decorateDom:193 · paintDom:215 · preview:217

## js/lettercannon.js (477 บรรทัด · 0 รายการ)

## js/lobby.js (52 บรรทัด · 3 รายการ)
PANEL_TITLES:9 · openPanel:19 · closePanel:29

## js/lobby3d.js (811 บรรทัด · 0 รายการ)

## js/main.js (586 บรรทัด · 11 รายการ)
settingsButtonClick:104 · syncMusicBtn:120 · showPetShoppingGrantNotice:154 · showPetShoppingFineRefundNotice:187 · showRankRewardNotice:218 · showQuizBackPay:268
showGiantRefund:313 · showTicketRefund:354 · fitQbp:395 · bootGame:409 · showCakeGiftRefundNotice:436

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

## js/music.js (347 บรรทัด · 0 รายการ)

## js/netroom.js (822 บรรทัด · 20 รายการ)
CFG:41 · roomsAllowed:63 · HOT_KEYS:71 · COLD_KEYS:72 · HOT_BACK:73 · splitPayload:77
mergeBack:88 · metUids:100 · AIM_TTL_MS:119 · aimAt:121 · aimGet:125 · aimClear:129
MAPS3D:135 · skyMapAllowed:136 · whereFriends:140 · dbOf:164 · envReady:165 · isDenied:168
create:180 · drawBudget:795

## js/onetpromo.js (210 บรรทัด · 0 รายการ)

## js/online.js (2,289 บรรทัด · 124 รายการ)
### 🗂️ สารบัญโซน js/online.js (Read/Edit เฉพาะช่วง)
- 2-246 ENGINE: ระบบออนไลน์จริงผ่าน Firebase Realtime Database
- 247-342 ระบบเพื่อน (ข้อ 0.3): รหัสเพื่อน + ค้นหา + ส่ง/รับคำขอ
- 343-532 ระบบแชทกับเพื่อน (ข้อ 0.4)
- 533-715 ระบบส่งของขวัญ (ข้อ 0.5)
- 716-929 🏪 ตลาดออนไลน์จริง (item 2 backlog): ซื้อ-ขายสินค้าที่เพื่อน "ผลิตเอง" ข้ามผู้เล่น
- 930-1071 คำเชิญเล่นโลก 3D ด้วยกัน — /tinv/<toUid>/<fromUid> = {map,n,ts}
- 1072-1268 📰 Follow + Feed กิจกรรม (รอบ 155) · 🌍 หน้า Feed ทุกคน + ไลก์/คอมเมนต์ (รอบ 639)
- 1269-1276 🌍 หน้า Feed ทุกคน + ไลก์/คอมเมนต์ (รอบ 639)
- 1277-1419 📰 รอบ 701 — ฟีดล็อบบี้ทีละโพสต์ + รีแอ็กชัน + แจ้งเตือน (ต่อยอดรอบ 639)
- 1420-1652 🔔📥 รอบ 976 — เก็บแจ้งเตือนไลก์/คอมเมนต์ลง DB โซนใหม่ /gnotif/<uid>
- 1653-2289 📞 โทรหาเพื่อน — Voice call / Video call แบบ LINE (รอบ 625 · กลุ่ม 3 คนรอบ 631)
### รายการ js/online.js
ONLINE_STALE_MS:81 · ONLINE_BEAT_MS:82 · LEADERBOARD_SIZE:83 · LEADERBOARD_QUERY_SIZE:84 · onlineDisplayName:88 · onlineActivity:96
ensureOnlineId:117 · onlineKey:127 · onlinePushPresence:132 · onlinePushScore:142 · fetchPlayerStats:196 · onlineRerender:218
notifyFriendBadges:231 · FRIEND_ALPHA:257 · friendCode:258 · friendSearch:270 · friendRequest:294 · friendAccept:305
friendDecline:317 · friendsHeal:327 · CHAT_MAX_LEN:351 · CHAT_KEEP:352 · chatPairId:354 · chatRef:357
chatListen:363 · chatSend:379 · chatDeleteMsg:395 · TYPING_TTL:403 · typingRef:405 · chatSetTyping:406
chatClearTyping:416 · chatWatchTyping:424 · chatThemeRef:442 · chatSetTheme:443 · chatWatchTheme:448 · chatPrune:456
chatSeenTs:473 · chatMarkSeen:479 · chatUnreadCount:491 · chatWatchSync:494 · GIFT_EXPIRE_MS:544 · giftSend:547
greetSend:565 · giftAccept:579 · giftDecline:583 · giftInWatch:589 · cakeGiftEscrowKey:620 · cakeGiftEscrowClear:621
giftReclaim:627 · giftOutWatchSync:640 · giftOutRebuild:696 · salesWatch:726 · salesRerender:734 · sellInc:738
marketRequestId:749 · marketRememberTx:755 · marketTxHasRole:765 · marketResolveMissingListing:771 · marketVerifyOwnListings:805 · marketWatch:823
marketList:858 · marketUnlist:866 · marketBuy:874 · marketSoldWatch:899 · tinvSend:935 · tinvClear:948
tinvPartyTick:956 · TINV_WORLD_LABEL:978 · tinvFingerprint:982 · TINV_SESSION_GRACE_MS:985 · tinvPeerOnline:986 · tinvInviteCurrent:989
tinvSentCurrent:995 · tinvCancel:999 · tinvReconcile:1005 · tinvWatch:1058 · FEED_MAX:1080 · feedEvent:1083
feedPrune:1095 · feedPurgeCat:1106 · feedPushAssets:1117 · petDescriptor:1135 · feedPushPets:1141 · fetchPlayerPets:1155
followSet:1171 · followUnset:1182 · feedRebuild:1189 · feedWatchSync:1201 · fetchPlayerFeed:1228 · fetchPlayerAssets:1241
fetchFollowers:1260 · GFEED_READ:1286 · GFEED_KEEP_ME:1287 · gfeedPush:1290 · gfeedPrune:1304 · gfeedParse:1317
gfeedWatchStart:1346 · gfeedWatchStop:1373 · gfeedNotifDiff:1381 · gfeedNotifPush:1416 · GNOTIF_KEEP:1444 · GNOTIF_QUIET:1446
gnotifKeyOf:1449 · gnotifSend:1456 · gnotifAdd:1469 · gnotifRecount:1489 · gnotifMarkSeen:1494 · gnotifWatchStart:1505
gnotifListen:1514 · gnotifWatchStop:1532 · gnotifPrune:1537 · uidDisplayName:1550 · gfeedRebuild:1561 · gfeedToggleLike:1578
gfeedSetReaction:1583 · gfeedToggleCommentLike:1599 · gnotifTellComment:1617 · gfeedAddComment:1629 · CALL_RTC_CFG:1677 · CALL_RING_MS:1678
CALL_MAX_MS:1679 · CALL_MAX_PEERS:1680 · onlineStart:2096 · onlineLoadSDK:2263

## js/onlinecoinaward.js (22 บรรทัด · 0 รายการ)

## js/petbehavior.js (187 บรรทัด · 0 รายการ)

## js/petpantry.js (235 บรรทัด · 0 รายการ)

## js/petshopping3d.js (570 บรรทัด · 0 รายการ)

## js/photo.js (363 บรรทัด · 25 รายการ)
PHOTO_LS_KEY:12 · PHOTO_MAX:13 · PHOTO_PREFIX:14 · PHOTO_SIZES:15 · PHOTO_QS:16 · PHOTO_ZMAX:17
photoValid:25 · photoOnline:28 · photoGet:31 · photoHas:32 · photoIsMine:33 · photoOf:36
photoFetch:44 · photoAfterChange:61 · photoPush:65 · photoVerify:83 · photoSaveUrl:93 · photoRemove:99
photoPullMine:106 · photoBlkSrc:122 · photoMiniHTML:129 · openPhotoMenu:137 · photoLoadImgEl:203 · photoLoadFile:211
openPhotoCrop:224

## js/picdict.js (412 บรรทัด · 0 รายการ)

## js/picmatch.js (692 บรรทัด · 0 รายการ)

## js/picquiz_online.js (608 บรรทัด · 0 รายการ)

## js/pmaward.js (28 บรรทัด · 0 รายการ)

## js/rankgraph.js (147 บรรทัด · 0 รายการ)

## js/sgaward.js (28 บรรทัด · 0 รายการ)

## js/shootword.js (1,266 บรรทัด · 0 รายการ)
### 🗂️ สารบัญโซน js/shootword.js (Read/Edit เฉพาะช่วง)
- 2-89 🎯 shootword.js — เกม "ยิงเป้าคำศัพท์" (Carnival Word Shooting) รอบ 917
- 90-165 🔊 เสียง — สังเคราะห์เองทั้งหมด (ปืนอัดลม/แผ่นพับ/สปริงเด้ง/เป็ด)
- 166-241 🎵 FAIRGAME FUN — lazy stream + browser disk cache + exit fade
- 242-320 🖼️ Canvas textures — ทุกลายวาดเอง (ธีมสวนสนุกพาสเทล)
- 321-556 🏗️ สร้างฉากสวนสนุก
- 557-726 🎯 ตรรกะเกม — สุ่มคำ · แจกตัวอักษรลงแผ่น · ยิง
- 727-781 🎬 แอนิเมชันต่อเฟรม (แผ่นพับ-เด้ง · ไฟกะพริบ · ฯลฯ)
- 782-1185 🖥️ HUD + เอฟเฟกต์ DOM
- 1186-1266 เปิด/ปิดเกม
### รายการ js/shootword.js

## js/skyplay3d.js (640 บรรทัด · 0 รายการ)

## js/specialmission.js (223 บรรทัด · 0 รายการ)

## js/state.js (1,392 บรรทัด · 96 รายการ)
### 🗂️ สารบัญโซน js/state.js (Read/Edit เฉพาะช่วง)
- 2-246 STATE + LocalStorage + กติกากลางของเกม
- 247-303 🗄️🐾 ระบบชั้นอาหาร + เงินช่วยปรับตัว
- 304-796 👍 รอบ 701: รีแอ็กชันฟีด (กดค้างปุ่มถูกใจแล้วเลือกได้เหมือน Facebook)
- 797-852 Daily Quest (item 3 backlog): ภารกิจรายวัน 3 อย่าง สุ่มตามวันที่
- 853-963 มูลค่าทรัพย์สินสุทธิ (net worth) — ฐานของระบบแรงค์
- 964-1013 🚫🍽️ สัตว์ป่วยเพราะหิว = ซื้อของกินไม่ได้ (รอบ 952)
- 1014-1107 เครื่องยนต์บิลรายเดือน (กลาง — ค่าบำรุงบ้านตอนนี้ / ค่าไฟ-น้ำ-เน็ต เสียบเพิ่มได้)
- 1108-1232 🍖 เงินค่าอาหารสัตว์รายเดือน — ทุกวันที่ 1 ของเดือน จ่ายตามจำนวนสัตว์ที่เลี้ยงอยู่
- 1233-1392 โรงงานผลิตสินค้า: จ่ายค่าผลิตด้วย "แต้มคำศัพท์"
### รายการ js/state.js
STORAGE_KEY:6 · QUIZ_PASS_REWARD:11 · CURE_COST:13 · HUNGRY_SICK_MS:14 · MEAL_HOUR:16 · MEAL_FULL:17
SLEEP_FROM_HOUR:18 · SLEEP_SICK_HOUR:19 · WAKE_HOUR:20 · DINNER_COST:21 · TOXIN_FULL:23 · DETOX_COST:24
FOODQUIZ_Q:26 · FOODQUIZ_COIN:27 · FOODQUIZ_BONUS:28 · FOODQUIZ_MAX_PLAYS:29 · SHAPE_JUNK_MEALS:31 · SHAPE_CLEAN_MEALS:32
SHAPE_MISS_MEALS:33 · SHAPE_EXP_BONUS:34 · HEAT_SICK_MS:35 · THIRST_SICK_MS:36 · DEFAULT_STATE:38 · migratePetShoppingState:252
FEED_CATS:296 · FEED_REACTIONS:310 · feedRx:318 · FEED_QUICK_CM:320 · SLOT_MS:332 · currentSlotStart:333
nextSlotStart:339 · mealDayKey:341 · nightKeyOf:343 · isNightNow:351 · newPet:356 · loadState:381
saveState:754 · activePet:764 · petStage:765 · isAdult:770 · abilityOn:771 · hasPetType:772
todayStr:775 · dailyTick:779 · addCoins:782 · QUEST_POOL:802 · QUEST_PER_DAY:811 · questsToday:812
questTick:819 · questEvent:823 · assetValue:859 · netWorth:883 · assetCount:885 · grantRankPromotionRewards:903
refreshRank:933 · heatProtected:951 · rainProtected:955 · petHungry:958 · petCanEat:962 · hungerSickLock:970
hungerSickMsg:978 · petShapeOf:986 · updatePetShape:992 · shapeMealDone:999 · heatPct:1009 · ymStr:1018
billOutstanding:1022 · UTILITIES:1029 · HOME_UTILITIES:1035 · homeDecayed:1037 · billTick:1040 · PET_FOOD_PER_PET:1112
petFoodTick:1113 · myCar:1139 · carLoanDue:1144 · carLoanOverdue:1149 · carLoanPayable:1154 · carLoanPay:1161
compTick:1174 · ONLINE_RATE:1188 · onlineEarnActive:1189 · onlineEarnTick:1193 · onlineEarnFlush:1204 · marketTick:1214
addCraft:1238 · ORDER_MAX:1257 · ORDER_LIFE_MS:1258 · ORDER_GAP_MIN_MS:1259 · ORDER_GAP_SPAN_MS:1260 · ORDER_TIER_WEIGHT:1261
newOrder:1262 · orderTick:1275 · careTick:1283 · expNeed:1363 · addExp:1368 · addRP:1388

## js/thaitime.js (52 บรรทัด · 13 รายการ)
TH_TZ_MIN:22 · TH_DAY_MS:23 · thShift:28 · thMs:30 · thDate:31 · thHour:32
thHourF:33 · thDayKey:34 · thDayStart:35 · thAtHour:39 · thTs:40 · TH_TZ_OPT:45
thLocaleOpt:46

## js/tpaward.js (42 บรรทัด · 0 รายการ)

## js/typing.js (370 บรรทัด · 0 รายการ)

## js/ui.js (10,342 บรรทัด · 446 รายการ)
### 🗂️ สารบัญโซน js/ui.js (Read/Edit เฉพาะช่วง)
- 2-77 UI: Dashboard / ร้านค้า / ที่พัก / ร้านสัตว์เลี้ยง / แรงค์ / สถิติ
- 78-144 🎬 เวทีน้องน่ารัก (Cute Pet Show) — รอบ 604 (ผู้ใช้สั่ง 26 ก.ค. 2026)
- 145-556 🏡💞 PET BOND SCENE รอบ 1152 — ผู้เล่น + บ้านจริง + น้องในฉากเดียว
- 557-850 🆕 New Word (รอบ 116): คำศัพท์ใหม่ 1 คำ/การ login ตามระดับชั้น
- 851-875 นาฬิกาใต้ชื่อผู้เล่น (วัน · วันที่ · เวลา อัปเดตทุกวินาที)
- 876-915 ข้าวเย็นของผู้เล่น (กิจกรรมเสริม)
- 916-947 แถบฝนประจำวัน: นับถอยหลังถึง 19:00 ทุกวัน (ฝนตก 1 ชม.)
- 948-1000 เอฟเฟกต์ฝนเต็มจอ (รอบยี่สิบ): ฝนตกจริง (19:00-20:00) + ไม่มีบ้านสภาพดี
- 1001-1021 การ์ด "คนที่กำลังทำการบ้านไปพร้อมๆ กับเรา"
- 1022-1076 รอบ 149: กล่อง aside ขวาเลื่อนวนอัตโนมัติ (ล่าง→บน) ไม่มี scrollbar
- 1077-1466 Daily Quest (item 3): การ์ดภารกิจวันนี้ใน aside ขวา
- 1467-1561 รอบ 153: เมนูลัดแตะแถวเพื่อนออนไลน์ในกล่อง aside
- 1562-1844 การ์ด Leaderboard — สลับแท็บในการ์ดเดียว (ประหยัดพื้นที่):
- 1845-2418 📈 ฟีดอันดับดีขึ้นบนหัวล็อบบี้
- 2419-2803 การ์ดข้อมูลผู้เล่น 👤 — คลิกชื่อในการ์ดเพื่อน/กระดาน แล้วโชว์
- 2804-3098 แผงเพื่อน 👥 (ข้อ 0.3): รหัสเพื่อน + ค้นหา + คำขอ + รายชื่อเพื่อน
- 3099-3194 🌍 เพื่อนอยู่โลก 3D ไหน + ปุ่ม "ตามเข้าไป" (รอบ 642)
- 3195-3233 แชทกับเพื่อน (ข้อ 0.4) — กล่องแชทลอยกลางจอ + แผง emoji
- 3234-3635 รอบ 179: หน้ารวมข้อความ (inbox แบบ Messenger — ธีมกระจกฟ้า sci-fi ของเกม)
- 3636-4035 ระบบส่งของขวัญ (ข้อ 0.5) — ห้องของขวัญ + กล่องเลือกส่ง + ฉากเปิด
- 4036-4128 RANK CARD + ฉากเลื่อนแรงค์
- 4129-4131 PET DASHBOARD
- 4132-4207 📰 รอบ 155: overlay ข้อมูลน้อง & การดูแล + ฟีดกิจกรรมเพื่อน
- 4208-4829 📰 รอบ 701 — ฟีดล็อบบี้ "ทีละโพสต์" แบบ Facebook (ผู้ใช้สั่ง 29 ก.ค. 2026)
- 4830-5024 🌍 รอบ 639: หน้า Feed เต็มจอ — ทุกคน (ไม่ใช่แค่ follow) + ไลก์/คอมเมนต์
- 5025-5708 📖 Dictionary ค้นหาคำศัพท์ (รอบ 254 ผู้ใช้สั่ง 16 ก.ค. 2026)
- 5709-5752 การนอน (คิว 7725691507 ข้อ 1)
- 5753-5755 ให้อาหาร (ระบบมื้อเย็น 18:00 + ความอิ่มสะสม — ข้อ 2+3)
- 5756-6282 🐾🍽️ แผงให้อาหารสัตว์ทุกตัวในคราวเดียว — รอบ 1345
- 6283-6401 🛡️ ควิซอาหารปลอดภัย (ต่อยอดข้อ 5.1)
- 6402-6515 🎀 ตู้เสื้อผ้าสัตว์เลี้ยง — ใช้สวมเฉพาะของที่ซื้อมาแล้ว
- 6516-6703 ที่พัก (หลบแดด/หลบฝน) + เครื่องปรับอากาศ
- 6704-6821 บิลสาธารณูปโภค (ค่าไฟ/ค่าน้ำ — เครื่องยนต์อยู่ใน state.js: UTILITIES/billTick)
- 6822-6904 การ์ดมือถือ (ข้อ 7): ซื้อ 10,000 ขายคืน 6,000
- 6905-6915 การ์ดคอมพิวเตอร์ (ข้อ 11): ซื้อ 50,000 ขายคืน 30,000
- 6916-6960 item 8: โบนัสออนไลน์ +0.01 เหรียญ/วิ ฟรีทุกคนที่เปิดเกมออนไลน์อยู่
- 6961-7221 💻 รอบ 706 (ผู้ใช้สั่ง 29 ก.ค. 2026): ช่องรายได้คอมพิวเตอร์บนแถบบนล็อบบี้
- 7222-7229 🌀🔤 รอบ 1045 — Vocab Arena (โลกผจญภัยฉบับใหม่)
- 7230-7642 ☁️📚 รอบ 1229 — Vocab Sky Playground
- 7643-7713 🏝️ รอบ 1377 — KART ADMIN PREVIEW (separate entry and persistent keys)
- 7714-7734 🌍 ปุ่มลัดเข้าโลก 3D ในรางเมนูซ้าย (ผู้ใช้สั่ง 9 ก.ค. 2026)
- 7735-7800 🔒 รอบ 1070/1132: โลกที่ยังไม่เปิดสาธารณะ — เปิดให้บัญชีทดสอบ 2 ชื่อเท่านั้น
- 7801-7920 ↩️🪙 Legacy recovery — คืนค่าเข้าที่เวอร์ชันเก่าอาจหักค้างไว้ก่อนเปลี่ยนเป็นเข้าฟรี
- 7921-8006 ☁️🧸 รอบ 1258 — เลือกตัวละคร Sky ก่อนเข้าโลก
- 8007-8204 🧭 ป้ายบอกทางของรางเมนูซ้าย (รอบ 601 · ผู้ใช้สั่ง 26 ก.ค. 2026)
- 8205-8374 การ์ดสวนผลไม้ (ข้อ 12): ซื้อต้นไม้ปลูกได้ไม่จำกัด แต่ละต้นออกผล
- 8375-8389 โรงงานผลิตสินค้า 🏭 + ตลาดขายต่อ (แนวคิดใหม่ 5 ก.ค. 2026)
- 8390-8413 โรงงานผลิต (แผง 🏭) — แยกออกจากตลาด (ผู้ใช้สั่ง 6 ก.ค. 2026)
- 8414-8688 ตลาดขายสินค้า (แผง 🏪) — แยกออกจากโรงงาน
- 8689-9697 🚗 รอบ 131: หมวดยานพาหนะ — โชว์รูมรถ 10 คัน (แคตตาล็อก 5 ช่อง/แถว)
- 9698-9760 ร้านสัตว์เลี้ยง (ซื้อเพิ่มได้ ไม่ลบตัวเดิม)
- 9761-9797 เลเวลอัพ (รายตัว)
- 9798-9903 สถิติผลการเรียนรู้
- 9904-9941 item 4: การ์ดสรุปส่งครู — ใบเดียวจบ ชื่อ/วัน-เวลา/เหรียญวันนี้/แรงค์/สอบล่าสุด
- 9942-10342 📞 หน้าจอโทรหาเพื่อน — สายเสียง (รอบ 625 · กลุ่ม 3 คน + ปิดวิดีโอ รอบ 631)
### รายการ js/ui.js
startHTML:10 · PET_ANIM:30 · petAnimHTML:35 · petVisualHTML:50 · PET_SHOW:91 · PET_SHOW_STAGE:96
PET_SHOW_H:99 · petShowBgHTML:102 · petBondLine:153 · PET_HEALTH_TIPS:177 · nextPetHealthTip:215 · petBondActionLine:223
PET_BOND_TALK_MS:242 · petBondTalkPriority:245 · updatePetBondTalk:251 · startPetBondTalkHold:264 · queuePetBondTalk:274 · petBondContextHTML:295
petClipHint:337 · __clipReady:349 · PET_SHOW_SEQ:357 · petShowSeqHTML:372 · petOutfitMotionHTML:392 · petShowHTML:410
PROF_AV_MAX:477 · lobbyBlk:478 · caretakerFigureHTML:485 · footAlign:495 · heroRankBgHTML:529 · NEW_WORD_MS:563
newWordNext:569 · renderNewWord:580 · NW_GAP:618 · alignNewWord:619 · startNewWordTimer:636 · nwCountdownTick:653
PAT_REMIND_HOUR:669 · patRemindTick:670 · applyPatRemindGlow:691 · NEW_WORD_COIN:706 · NW_DAILY_GOAL:707 · NW_DAILY_BONUS:708
newWordReward:709 · nwDailyTick:732 · coinFlyFx:751 · nwDailyBarHTML:784 · showNewWordPopup:795 · renamePet:822
mealLabel:839 · fmtMins:845 · renderClock:854 · selfName:880 · selfNameHTML:885 · dinnerDue:886
renderDinnerChip:891 · dinnerClick:899 · renderRainBar:919 · rainFxTick:952 · RAIN_DROP_IMGS:975 · rainFxDrop:976
selfPronoun:1008 · selfTag:1013 · idTag:1017 · SIDE_SCROLL_SPEED:1027 · SIDE_SCROLL_RESUME:1028 · initSideScroll:1031
sideScrollTick:1059 · QUEST_FLASH_HOLD:1083 · QUEST_SLIDE_MS:1090 · QUEST_RESUME_MS:1091 · questGo:1094 · SIDE_TALL_MIN:1106
sideIsTall:1107 · qBigCardHTML:1112 · qDeckGo:1132 · qDeckTick:1152 · renderQuestCard:1173 · sideFlashRows:1233
FRIEND_FLASH_GRACE:1251 · ONLINE_FLIP_MS:1259 · ONLINE_FLIP_RESUME:1260 · ONLINE_SWIPE_STEP:1261 · ONLINE_ROW_H:1268 · onPerPage:1271
onChunk:1277 · ONLINE_GAP_MAX:1287 · onPageSpread:1288 · onPageDraw:1297 · onPageFlip:1308 · bindOnlinePager:1319
drawOnlineTicker:1356 · renderOnlineCard:1364 · bindInviteCards:1474 · bindFriendQuickMenu:1494 · openFriendQuickMenu:1504 · LB_TABS:1569
LB_ASSET_TOP:1570 · LB_ONLINE_TOP:1571 · LB_WS_TOP:1572 · LB_WS_DISPLAY:1573 · LB_PM_TOP:1574 · LB_PM_DISPLAY:1575
LB_TP_TOP:1576 · LB_TP_DISPLAY:1577 · LB_BB_TOP:1578 · LB_BB_DISPLAY:1579 · LB_SG_TOP:1580 · LB_SG_DISPLAY:1581
LB_LC_DISPLAY:1582 · bindLbTabs:1584 · updateRankRailBadge:1650 · rankUpCheck:1669 · rankUpSound:1697 · renderLeaderboardCard:1708
bindLbGroupOpen:1741 · lbRankRows:1753 · RANK_MOVE_TOPICS:1851 · RANK_MOVE_MAX:1864 · RANK_MOVE_REWARD:1865 · rankMoveFeedRender:1869
rankMoveRewardCheck:1887 · showRankMoveRewardNotice:1906 · rankMoveFeedCheck:1944 · LB_BCAT_TOP:1977 · lbBadgeSections:1982 · lbDemoRows:2008
lbChar:2030 · lbfAwardBarHtml:2040 · openLeaderboardFull:2059 · BLK_PAD:2198 · BLK_PAD_NEW:2203 · BLK_TOP_FIX:2204
seatPodChars:2205 · lbOnlineCoinHtml:2217 · lbCoinHtml:2234 · lbBadgeHtml:2250 · lbBossHtml:2276 · lbWordSearchHtml:2299
lbTypingHtml:2335 · lbBubbleHtml:2367 · lbShootHtml:2389 · bindPlayerClicks:2424 · showPlayerCard:2434 · bindProfileBadgeScroll:2715
petDescImg:2733 · openImgLightbox:2746 · openPetPeek:2766 · updateBillBadges:2810 · setBadge:2820 · tinvPendingCount:2836
attentionPendingItems:2844 · attentionUnseenCount:2864 · attentionAcknowledge:2869 · updateSettingsBadge:2884 · attentionSummaryData:2900 · openAttentionSummary:2928
updateFriendBadge:2962 · renderFriendPanel:2972 · friendDoSearch:3020 · refreshFriendData:3044 · FRW_TTL_MS:3109 · FRW_MIN_GAP:3110
frwWorldOf:3114 · frwPanelOpen:3117 · frwScan:3122 · frwPaint:3144 · frwPaintHint:3165 · frwFollow:3179
CHAT_EMOJI_CATS:3200 · CHAT_THEMES:3222 · CHAT_SECRET_MS:3231 · chatBadgeSync:3239 · ibTimeStr:3247 · IB_CALL_RE:3256
ibCallInfo:3257 · openChatInbox:3262 · chatFitKeyboard:3432 · openChat:3448 · versionedAssetPath:3639 · giftImg:3643
LAZY_ASSET_PIXEL:3652 · lazyAssetHTML:3653 · bindLazyAssets:3656 · giftDateStr:3678 · GREETS:3686 · GREET_EXP:3694
greetInfo:3695 · openGreetPicker:3699 · giftItemPic:3743 · foodGiftBlocked:3753 · giftItemName:3759 · updateGiftBadge:3765
renderGiftPanel:3774 · acceptGift:3833 · declineGift:3856 · showGreetReveal:3865 · showGiftReveal:3892 · openGiftPicker:3918
confirmSendGift:3987 · doSendGift:4013 · rankBadgeHTML:4039 · renderRankCard:4044 · renderRankTab:4078 · showRankUp:4106
bindPetPlateButtons:4141 · openPetInfoOverlay:4174 · feedAgo:4200 · FEED_DECK_MAX:4220 · FEED_SLIDE_MS:4221 · FEED_RESUME_MS:4222
feedPostImgIndex:4227 · feedPostImg:4238 · feedPostByKey:4247 · feedCanReact:4250 · fpStatsHTML:4255 · fpNameBadgesHTML:4271
fpostHTML:4275 · renderFeedCard:4310 · feedDeckGo:4348 · feedDeckTick:4368 · renderFeedBell:4390 · FNT_JUMP:4399
fntGiftName:4405 · feedNotifText:4409 · feedNotifGo:4424 · feedNotifArrived:4439 · openFeedNotif:4446 · closeRxPicker:4501
openRxPicker:4505 · feedFlyWord:4525 · feedPickRx:4536 · FCM_REP_SHOW:4551 · FCM_FOCUS_POST:4552 · openFeedComments:4554
closeFeedComments:4576 · fcmRowHTML:4585 · showCommentLikers:4608 · fcmTreeHTML:4630 · renderFeedComments:4655 · bindFeedPostEvents:4783
openFeedBoard:4836 · renderFeedBoardLive:4857 · renderFeedBoard:4875 · stageColLeft:4894 · alignPetTabs:4903 · alignFeedPlate:4915
alignProfilePlate:4931 · COIN_K_MIN:4949 · alignCoinBlock:4950 · alignStageLeft:4978 · laneModeOn:4990 · alignStageCols:5003
watchStageCols:5017 · dictRecordLookup:5036 · DICT_FILE_COUNT:5047 · loadDict:5048 · dictSearch:5063 · dictTapWords:5078
dictEntryHTML:5082 · openDictOverlay:5093 · renderDashboard:5177 · sleepBtnHTML:5714 · sleepHintHTML:5721 · sleepAllPets:5732
wakeAllPets:5745 · feedPet:5760 · feedFoodsForPet:5766 · feedFoodById:5771 · feedFoodCanUse:5772 · feedPetBlockText:5777
feedPetThumbHTML:5784 · openFoodMenu:5790 · applyFoodToPet:5924 · feedWith:5941 · AVATAR_UI:5961 · playerAvatarHTML:5965
SHAPE_UI:5973 · showFeedResult:5982 · applyCureState:6025 · curePet:6039 · cureAllPets:6062 · heartsFx:6090
PAT_HOLD_MS:6113 · PAT_EXP:6114 · bindPetTap:6115 · petBounce:6133 · petMood:6139 · shortPatPet:6146
longPatPet:6154 · patCalendarHTML:6174 · patDayKey:6208 · patStreakNow:6212 · patStreakTick:6217 · cureCelebrateFx:6242
railCureClick:6253 · detoxPet:6265 · openFoodQuiz:6288 · closeDressUpBoard:6406 · dressItemRarity:6410 · dressRarityLabel:6417
dressSlotLabel:6420 · openDressUpBoard:6423 · renderShop:6456 · homeVisualHTML:6519 · showHomeRuined:6533 · showCutNotice:6554
renderHomeCard:6572 · payMaint:6656 · trashBillUI:6672 · payTrash:6689 · UTILITY_UI:6708 · utilityBillUI:6757
payUtility:6782 · buyUtilityFix:6808 · renderPhoneCard:6826 · buyPhone:6866 · sellPhone:6888 · compLiveTotal:6909
onlineLiveTotal:6920 · syncCoinHeader:6927 · flashPillGain:6932 · renderOnlineEarnPill:6941 · renderCompEarnPill:6966 · openPillInfo:6999
renderComputerCard:7082 · buyComputer:7117 · sellComputer:7140 · soldCount:7161 · soldBadge:7162 · loadScriptOnce:7168
advBusyMsg:7193 · advResetLoad:7205 · loadAdv3d:7211 · loadVocabArena3d:7227 · loadSkyPlayground3d:7234 · SKY_BETA_DENIED_MSG:7237
ensureSkyBetaAccess:7238 · enterSkyPlayground3D:7246 · enterAdventure3D:7263 · pickAdvMap:7286 · enterHaunted3D:7321 · enterHeli3D:7344
pickHeliMap:7371 · enterDrone3D:7407 · confirmPetShoppingEntry:7428 · enterPetShopping3D:7454 · enterDrive3D:7506 · pickDriveMap:7545
enterMotoMapAsCar:7581 · enterSoccer3D:7600 · enterMoto3D:7620 · enterKart3D:7646 · enterF1_3D:7665 · enterInvasion3D:7693
WORLD3D:7721 · WORLD3D_COMING_SOON:7739 · world3DComingSoon:7740 · gotoRobotShop:7743 · openHealDialog:7749 · world3DFail:7770
worldEntryStarted:7805 · worldEntryStopped:7806 · GAME_ENTRY_STABLE_MS:7807 · gameEntryCommit:7809 · gameEntryRefund:7817 · recoverInterruptedGameEntry:7834
showGameEntryRefundNotice:7842 · startWorldEntry:7869 · railWorldClick:7895 · skyEntryCatalog:7925 · skyEntryPickerHTML:7929 · openWorldEntryDialog:7939
railScrollHint:8012 · railScrollTop:8020 · initRailScroll:8025 · renderRailWorlds:8045 · tinvOnlineFriends:8142 · refreshTinvOnlineUI:8146
tinvNoticeHTML:8157 · openTinvPicker:8166 · fruitCountdown:8210 · renderFarmCard:8222 · renderFarmClock:8297 · buyFruit:8313
sellFruit:8333 · sellAllFruit:8354 · collectImg:8383 · renderFactoryCard:8394 · renderMarketCard:8418 · updateWishBadge:8476
openWishlistDialog:8487 · bindStripArrows:8534 · renderMarketBrowse:8548 · openMarketBuyDialog:8575 · carImg:8695 · renderVehicleShop:8696
CS_CYCLE_MS:8748 · carInteriorImg:8749 · carStatHtml:8751 · renderCarShowroom:8758 · csShowBig:8785 · csInit:8812
RS_CYCLE_MS:8835 · robotImg:8836 · renderRobotShop:8837 · renderPetMarketShop:8861 · rsShowBig:8879 · rsInit:8900
buyRobot:8919 · enterMecha3D:8944 · pickMechaRobot:8972 · pickDriveCar:9004 · openCarBuyDialog:9047 · buyCarInsurance:9108
payCarLoanMonthly:9127 · payCarLoanFull:9139 · carDriveBlock:9158 · gotoVehicleShop:9163 · gotoMyStock:9168 · showNeedCarDialog:9174
craftDiscount:9186 · renderFactory:9189 · renderOrdersUI:9258 · startProduce:9277 · buyCollectible:9305 · cancelProduce:9335
deliverOrder:9349 · renderOrderClock:9366 · renderCollectMine:9376 · openListDialog:9425 · cancelListing:9482 · buyMarketItem:9506
showCollectReveal:9571 · buyAC:9609 · openHomeShop:9628 · openPetPurchase:9702 · renderPetShop:9739 · showLevelUp:9764
renderStats:9801 · showTeacherCard:9908 · CALL_REACT_EMOS:9952 · CALL_TALK_MIN:9955 · CALL_TALK_HOLD:9956 · CALL_ORDER_GAP:9958
CALL_TONES:9964 · startCall:10338

## js/util.js (1,473 บรรทัด · 57 รายการ)
### 🗂️ สารบัญโซน js/util.js (Read/Edit เฉพาะช่วง)
- 2-23 UTIL: เสียง / เอฟเฟกต์ / เครื่องมือทั่วไป
- 24-1442 🎖️ รอบ 643: สัญลักษณ์ระดับชั้น (ผู้ใช้สั่ง 28 ก.ค. 2026)
- 1443-1473 🖱️🚫 รอบ 833: กันกล่องดำ "To show your cursor, switch apps, reload the page…"
### รายการ js/util.js
shuffle:6 · fmtNum:15 · escapeHTML:19 · gradeSymbol:32 · gradeMark:47 · nameWithGrade:55
gradeMarkCanvas:61 · gradeOf:77 · seededRand:92 · fmtThaiDT:104 · fmtThaiDate:108 · gameIsPortrait:117
gameCanLockLandscape:122 · gameIsStandalone:125 · lockGameLandscape:130 · IPHONE_LOBBY_VIEWPORT:164 · fitIPhoneLobbyViewport:175 · showScreen:194
TOAST_WARN_RE:211 · TOAST_FINANCIAL_RE:212 · TOAST_FINANCIAL_AMOUNT_RE:214 · restackToasts:221 · clearWarnToasts:247 · toast:251
toastLink:304 · floatFx:322 · beep:333 · soundStatus:354 · PET_MOOD:470 · petVoiceSynth:477
sirenSynth:554 · playCashier:578 · cashierSynth:592 · keyTapSynth:625 · bubblePopSynth:663 · bubbleTapSynth:682
playSpark:693 · sparkSynth:707 · thunderFx:742 · wordAudioFile:810 · speakCutOff:819 · speakWord:823
speakLetter:862 · pickSpeakVoice:885 · speakWordTTS:896 · askNameDialog:923 · askConfirm:969 · alertBox:987
applyNoAnim:1007 · BLK_VOCAB:1014 · openSettings:1062 · openHelp:1381 · openTeacherGuide:1408 · TAPGLOW_SEL:1432
TOUCH_INPUT_SEEN:1451 · mouseLockOK:1460 · lockMouse3D:1466

## js/vocabbook.js (207 บรรทัด · 14 รายการ)
VB_MAX:11 · VB_QUIZ_N:12 · VB_QUIZ_MIN:13 · vbGroup:16 · VB_GROUP_UI:21 · vbRecord:24
vbSeen:49 · vbStats:62 · vbList:70 · vbReviewCat:81 · vbStartReview:95 · openVocabBook:106
vbRender:148 · vbCardHTML:194

## js/wordsearch.js (524 บรรทัด · 0 รายการ)

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

## css/bubble.css (60 บรรทัด · 25 selector)
#bb-overlay:4 · #bb-board:5,9,10,11 · .no-anim:12,49 · .bb-head:13 · .bb-title:14 · .bb-stat:15,16
.bb-score:17,18 · .bb-close:19,20 · .bb-snd:21,24 · .bb-snd-track:22 · .bb-snd-thumb:23 · .bb-prompt:25
.bb-star:26 · .bb-word:27,30 · .bb-ch:28,29 · .bb-thai:31 · .bb-hint:32 · .bb-stage:33
.bb-planet:34 · .bb-bubble:35,39,40,41(+4) · .bb-tools:50 · .bb-tool:51,52,53 · .bb-fx:54 · .bb-coinpop:55,56
.bb-empty:58

## css/dailybox.css (24 บรรทัด · 11 selector)
.db-overlay:2 · .db-bg-stars:3 · .db-card:4,5,6,8(+2) · .db-grid:7 · .db-chest:10,11 · .db-lid:12,13,14
.db-body:15 · .db-spark:16 · .db-win:17 · .db-coins:18 · .db-win-copy:19

## css/exam.css (377 บรรทัด · 77 selector)
#xs-screen:8,33 · .xs-top:12 · .xs-badge:16 · .xs-mode:17 · .xs-time:18,19,21,22 · .no-anim:24
.xs-score:25 · .xs-quit:26 · .xs-nav:36 · .xs-dot:40,44,45,46(+1) · .xs-body:50 · .xs-pass:51,55,62
.xs-ptitle:56 · .xs-para:57 · .xs-pn:58 · .xs-qside:63 · .xs-sec:67,68 · .xs-q:69
.xs-qno:70 · .xs-choices:74 · .xs-ch:75,80,81,86(+5) · .xs-ab:82 · .xs-ex:94,95,99 · .xs-exh:100
.xs-exref:101 · .xs-foot:104 · .xs-count:108 · .xs-btn:109,113,114,115(+1) · .levelup-box:121 · .xs-result:122,123,124,125(+4)
.xsr-box:142 · .xsr-head:147,148 · .xsr-tabs:149 · .xsr-tab:150,154 · .xsr-list:155 · .xsr-none:156
.xsr-item:157,161 · .xsr-qh:162,163,164 · .xsr-q:168 · .xsr-ans:169 · .xsr-you:170,171,172 · .xsr-ex:173
.xsr-ref:174 · .xst-wrap:176 · .xst-note:177 · .xst-row:180,181,182,190(+1) · .xst-h:183 · .xst-tag:184
.xst-bar:186,189,192 · .xst-n:193 · .xst-sum:194 · .xsr-foot:198 · .xsr-ok:199 · .xsp-box:205,269
.xsp-head:210,211 · .xsp-rows:212 · .xsp-set:213,214 · .xsp-name:215 · .xsp-tick:216 · .xsp-info:217
.xsp-best-row:218 · .xsp-best:219 · .xsp-hist:221,222 · .xsp-hist-svg:223 · .xsp-btns:224 · .xsp-go:225,229,230,233(+1)
.xsp-foot:235 · .xsb-box:250,277 · .xsb-head:255,256 · .xsb-grid:257 · .xsb-card:258,262 · .xsb-emoji:263
.xsb-name:264 · .xsb-info:265 · .xsb-done:266 · .onet-picker:270,271,272,273(+3) · .onet-board:278,279,280

## css/home-v2.css (2,497 บรรทัด · 136 selector)
:root:9,2469 · #screen-dashboard:36,46 · #vw-home-v2-root:48,49,59,60(+114) · .vw2-screen-frame:81 · .vw2-sky:82,83,92,99(+1) · .vw2-shell:102,107,591
.vw2-glass:111 · .vw2-top:124,641,788,977(+2) · .vw2-profile:129,143,147,291(+3) · .vw2-kanok-corner:148 · .vw2-profile-crown:149 · .vw2-profile-kicker:150,151
.vw2-avatar-frame:152,157,297,298(+1) · .vw2-avatar:158,159,1974,1978(+3) · .vw2-avatar-edit:160,2031 · .vw2-profile-main:161,1893 · .vw2-name-row:162,163,1894 · .vw2-pencil:164,165,166
.vw2-profile-meta:167,1829,1895 · .vw2-profile-meta-chip:168,169,170,171(+12) · .vw2-grade-identity:172 · .vw2-grade-copy:173 · .vw2-profile-chips:174,1908 · .vw2-achievement-mark:175,1909
.vw2-rank:176,300,1910 · .vw2-sync-chip:177 · .vw2-wallet:179,645,790 · .vw2-wallet-pill:180,186,187,188(+39) · .vw2-stat-art:190 · .vw2-stat-copy:191
.vw2-top-actions:193,502 · .vw2-tool-btn:194,200,201,318(+11) · .vw2-main-grid:204,592,720,949 · .vw2-left:207,208,323,526 · .vw2-rail-btn:209,324,1300,1301(+3) · .vw2-rail-art:210,211,212,213(+4)
.vw2-rail-scene:214,215 · .vw2-rail-scene-mark:216,329 · .vw2-rail-label:217,330,721,1344 · .vw2-left-scroll-cue:218,528 · .vw2-feed:221,222,334,335(+26) · .vw2-section-head:223,224,225,344(+5)
.vw2-feed-items:226,889,1023,1865(+1) · .vw2-feed-card:227,345 · .vw2-feed-avatar:228 · .vw2-feed-copy:229 · .vw2-feed-coin:230,904,1029,1038(+2) · .vw2-feature:233,708,821,1273
.vw2-feature-title:234,235,348,349(+12) · .vw2-word-ribbon:236,237,238,350(+8) · .vw2-feature-stage:239,354,355,596(+1) · .vw2-world-scene:240,597,830 · .vw2-stage-depth:241,242,243,356(+2) · .vw2-stage-castle:244,358,598
.vw2-atmosphere:245 · .vw2-speech:246,359,360,361(+5) · .vw2-reward-card:247,362,363,364(+7) · .vw2-pet-halo:248,249,601 · .vw2-pedestal-aura:250,251,367 · .vw2-pet-platform:252,253,254,365(+1)
.vw2-pet:255,368,698,705(+3) · .vw2-pet-sparkles:256 · .vw2-house-preview:257 · .vw2-stage-copy:258,372,1186,1187(+1) · .vw2-feature-actions:259,375,376,831(+5) · .vw2-right:262,498
.vw2-mission:263,336,341,499(+1) · .vw2-quests:264,500,890 · .vw2-quest-row:265,1282 · .vw2-online:266,337,342,531(+2) · .vw2-online-row:267,1203 · .vw2-friends-btn:268,533,538,1208(+1)
.vw2-bottom:271,272,382,452(+14) · .vw2-mode:273,383,384,385(+27) · .vw2-preview-mark:274,602 · .vw2-home-active:277,278,279,2007(+3) · .vw2-rail-racing:325,331,527,1342 · .vw2-house-preview-head:369,370,497,1189(+3)
.vw2-stage-foreground:371,600,1053 · .vw2-enter:377 · .vw2-play:378 · .vw2-shop-link:379 · .vw2-bottom-scroll:458,477,478,479(+6) · .vw2-bottom-track:480,490,522,523(+42)
.vw2-online-list:501,532,891,1202 · .vw2-word-kicker:711,854,1275,2096(+1) · .vw2-word-copy:712,713,714,855(+7) · .vw2-word-reward:715,858,2109 · .vw2-feed-market-divider:894,895,896,1040 · .vw2-feed-market-note:897
.vw2-market-feed-card:898,899,900,1194(+3) · .vw2-feed-product:901,902 · .vw2-market-seller:903,1198 · .no-anim:982 · .vw2-house-backdrop:1191,1983 · .vw2-online-name-line:1204,1205
.vw2-online-badges:1206 · .vw2-online-copy:1207 · .vw2-rail-cure:1211,1212,1213,1214 · .vw2-online-modal-open:1218 · .vw2-online-modal:1219,1220 · .vw2-online-modal-panel:1221,1222
.vw2-online-modal-head:1223,1224,1230 · .vw2-online-modal-emblem:1225,1226 · .vw2-online-modal-heading:1227,1228,1229 · .vw2-online-modal-close:1231,1232,1241 · .vw2-online-modal-list:1233,1234,1235,1236(+3) · .vw2-online-modal-foot:1240
.vw2-qbody:1283 · .vw2-feature-action-scroll:1384,1397,1398,2034 · .vw2-feature-action-track:1399,1409,1417,1431(+5) · .vw2-pet-name-action:1433 · .vw2-owned-pets-action:1434 · .vw2-pet-modal-open:1438
.vw2-pet-modal:1439,1440 · .vw2-pet-modal-panel:1441,1442,1503 · .vw2-pet-modal-head:1443,1444,1447,1448(+3) · .vw2-pet-modal-emblem:1445,1446 · .vw2-pet-modal-close:1451,1452,1467 · .vw2-pet-modal-list:1453,1454
.vw2-owned-pet-card:1455,1456,1457,1464 · .vw2-owned-pet-thumb:1458,1459,1460 · .vw2-owned-pet-copy:1461,1462,1463 · .vw2-pet-modal-empty:1465 · .vw2-pet-modal-foot:1466 · .vw2-pet-modal-healbar:1505
.vw2-heal-all:1506,1507,1508,1513(+3) · .vw2-heal-all-icon:1509 · .vw2-heal-all-copy:1510,1511,1512 · .vw2-adventure-hub:1539,1545,1546,1547(+22) · .vw2-adventure-landmark:1553,1557,1558,1625(+1) · .vw2-adventure-copy:1559,1560,1561,1630(+2)
.vw2-adventure-menu:1565,1566,1576,1577(+15) · .vw2-adventure-menu-panel:1567,1568,1569,1570(+8) · .vw2-adventure-menu-scroll:1573,1574 · .vw2-adventure-menu-track:1575,1646

## css/lettercannon.css (89 บรรทัด · 30 selector)
#lc-game:6,7,13,14(+30) · .lc-hud:8 · .lc-glass:9 · .lc-stats:10 · .lc-stat:11,12 · .lc-coin-stat:15
.lc-wordbox:16 · .lc-target:17 · .lc-meaning:18 · .lc-progress:19 · .lc-slot:20,21 · .lc-actions:23
.lc-iconbtn:24,25 · .lc-exitwide:26 · .lc-power:27 · .lc-power-name:28 · .lc-hint:29 · .lc-move:30,31
.lc-modal:32,33 · .lc-count-exit:34 · .lc-card:35,36 · .lc-result-card:37,40 · .lc-result-grid:38,39 · .lc-btn:42
.lc-count:43 · .lc-toast:45 · .lc-coinfx:47 · .lc-coin-flight:48 · .lc-announce:51 · .lc-rotate:52

## css/lobby.css (6,239 บรรทัด · 842 selector)
:root:6,5916 · html:15 · body:21,5880,5922 · *:41,42,43,44 · #app:47 · h1:49
.subtitle:50 · .shop-title:51 · .screen:57 · #screen-select:66,67,68,69(+5) · .egg-need:76 · .petshop-topright:78
.petshop-play-link:79,84 · #screen-login:97,110,111,115(+12) · .login-lux:128 · .login-logo:129 · .login-tag:134 · #screen-game:206,207,208,209(+7)
#screen-quiz:220,221,222,223(+6) · #quiz-choices:232,233 · .word-card:240 · .quiz-choice:241,242,243 · .big-btn:246,247,248,249 · #screen-dashboard:254,1173,1181
.lobby-top:268,903,904,905(+36) · .top-flex:269 · .profile-plate:270,274,824,4144(+12) · #rain-fx:279 · .rain-glass:283 · .glass-drop:284
.rain-vignette:303 · .no-anim:310,472,485,546(+64) · .rail-btn:313,925,931,933(+27) · .rail-badge:314 · .fr-code-box:319 · .fr-code-label:323
.fr-code-row:324 · .fr-code:325 · .fr-copy-btn:330,334,339,340 · .fr-search-btn:335 · .fr-add-btn:336 · .fr-accept:337
.fr-decline:338 · #fr-search-input:341 · #fr-search-result:345 · .fr-found:346 · .fr-hint:350 · .fr-list-title:351
.fr-row:352 · .fr-req:356 · .fr-row-name:358,362,5620 · .fr-row-status:366 · .fr-req-btns:367 · .online-dot:368
.fr-chat-btn:369,374,376 · .fr-unread:377 · .fr-call-btn:383,389 · .chat-overlay:398,404,405 · .chat-box:406,709,716,723(+12) · .chat-head:418
.chat-theme-btn:423,427 · .chat-secret-tg:428,429 · .cs-switch:430,431,436,437 · .cs-slider:432,434 · .chat-secret-note:438 · .chat-theme-strip:441
.chat-theme-sw:443,446,447,448(+1) · .chat-head-name:450,453 · .chat-head-ava:452 · .chat-close:454 · .chat-msgs:458 · .chat-empty:462
.chat-typing:464 · .ct-dots:466,467,469,470 · .chat-bubble:473,478,483 · .chat-emoji:486 · .chat-emo:490,494 · .chat-input-row:495
.chat-emoji-btn:499 · #chat-input:503 · .chat-send:507,512,513 · .chat-call-btn:519,523 · .call-ring:526 · .cr-card:530
.cr-kind:536 · .cr-av:537 · .cr-name:547 · .cr-id:548 · .cr-btns:549 · .cr-btn:550,556,561
.cr-no:557 · .cr-ok:558 · .cr-safe:562 · .call-ov:565,571,593,610(+6) · .call-stage:577 · .ctile:578,589,590
.ct-face:582 · .ct-me:588 · .ct-nm:603,607 · .ct-sub:608 · .call-add:632 · .ca-head:639
.ca-list:640 · .ca-row:641,645 · .ca-dot:646,647 · .ca-nm:648,649 · .ca-go:650 · .ca-empty:651
.ca-safe:652 · .ca-close:653 · .call-bar:657 · .cb-btn:662,667,668 · .cb-end:669,670 · .call-emos:671
.call-emo:676,677 · .call-fx:679 · .call-fx-emo:680 · .pl-click:772,774,775 · .pl-overlay:776 · .pl-card:780,2957
.pl-close:786 · .pl-head:790,2714,2717 · .pl-grade:795,5626,5627 · .pl-body:796 · .pl-loading:797 · .pl-none:798
.pl-me-tag:799 · .pl-blk-wrap:801 · .pl-blk:802 · .pl-stat:803 · .pl-lbl:808 · .pl-val:809,810
.pl-tip:811 · .chip-edit:817,822,823 · .rank-mini:829,835,836,837 · .pass-photo:839,844 · .pet-tabs:846 · .dict-box:847,851,852,853(+1)
.dict-card:859,864,868,869(+2) · .dict-head:865,866 · .dict-trail:873,877 · .dt-c:878,882,883 · .dt-sep:884 · .dict-today:885
.di-w:887,888,889 · .dict-list:890 · .dict-item:891,895,896,897(+5) · .lobby-mid:911 · .rail-wrap:914,959,970,971 · .rail-scroll:916,953,957,958
.lobby-rail:917,924 · .rail-nudge:960,968,969,972(+1) · .rail-worlds:979 · .rail-div:980 · .lobby-stage:1033,1035,1051,1178(+13) · .newword-banner:1041,1048,1053,4974(+2)
.coin-fly:1064,1067 · .coin-plus:1073 · .nw-pop-coin:1088,1090,1091 · .nw-pop-goal:1094,1095,1099,1103 · .nw-goal-head:1096,1098,1100 · .nw-goal-bar:1101
.nw-goal-fill:1102 · .nw-pop-book:1104,1105 · .nw-tag:1126,4980,5002 · .nw-word:1131,4984,5007,5100 · .nw-hint:1133,1134,4985,5009(+1) · .nw-coin:1136,1139,4986,4990
.nw-countdown:1144,4991 · .nw-bar:1146,5010 · .nw-bar-fill:1148 · .pet-stage:1151,3251 · .nw-box:1158,3260 · .nw-pop-word:1159
.nw-speak:1160 · .nw-pop-phon:1161 · .nw-ipa:1162 · .nw-pop-sent:1163 · .nw-pop-mean:1164 · .pet-tab:1165,1166,1167,3754
.stage-hero:1188,1203,1211,1356(+29) · .hero-ground:1225,1345,1351 · .hero-rank-bg:1227,1230,1233,1237(+18) · #lobby3d-canvas:1250,1251 · .hero-scene:1255,1257,1264,1265(+8) · .caretaker-fig:1304
.caretaker-img:1307 · .caretaker-emoji:1309 · .blk-rig:1316,1317,1318 · .stage-plate:1378,1386,1397,1398(+23) · .plate-title:1392 · .lobby-side:1425,1461,1466,1469(+22)
.side-sec:1428,2337,3649,4120 · .side-label:1429,1434 · .side-label-row:1437,1438 · .lb-tabs-out:1439,1440,1444 · .side-glass:1448,1455 · .side-card:1467,1578
#quest-card:1479,1480,1508,1509(+6) · .q-bigcard:1485,1514 · .qb-top:1487 · .qb-emoji:1488 · .qb-name:1490 · .qb-bar:1491,1492
.qb-row:1494 · .qb-prog:1495 · .qb-reward:1496 · .qb-go:1497,1501 · .q-dots:1502 · .q-dot:1503,1504,1505
.q-bonus:1506 · .inv-card:1525,1527,1528 · .inv-btns:1529 · .inv-go:1530,1532 · .inv-x:1533 · #online-card:1537,3657,3658,3659(+7)
.fq-overlay:1538 · .fq-box:1540,3462 · .fq-head:1544,1546 · .fq-close:1547 · .fq-sec:1549 · .fq-worlds:1550
.fq-world:1551,1553 · .fq-acts:1554 · .fq-act:1555,1558,1559 · .lb-prize:1592 · .lb-coins:1595 · .lbf-cell:1596,2796,2799,2800(+3)
.lb-award-bar:1598,1604,1605 · .lb-award-go:1606 · .lbf-award:1608,1614,1615,1616 · .pod-pz:1617 · .wsa-overlay:1620 · .wsa-box:1622
.wsa-head:1627 · .wsa-title:1628 · .wsa-when:1629,1630 · .wsa-close:1631,1634 · .wsa-cols:1635 · .wsa-col:1636
.wsa-sec-h:1637,1638 · .wsa-msg:1639 · .wsa-msg-h:1642 · .wsa-msg-b:1643,1644 · .wsa-msg-none:1645 · .wsa-rules:1647,1648
.wsa-list:1649 · .wsa-row:1650,1652 · .wsa-r:1653 · .wsa-n:1654 · .wsa-s:1655 · .wsa-p:1656
.wsa-prizes:1657 · .wsa-pz:1658,1661 · .wsa-reveal-medal:1662 · .lobby-bottom:1677,1680,1681,1683(+9) · .rail-onet:1696 · .lobby-quiz-btn:1697
.lobby-book-btn:1698,1699 · .lobby-play-btn:1701,1705 · .lobby-exam-btn:1707,1708,1710 · .panel-overlay:1715,1720,5115,5116(+8) · .panel-box:1721 · .panel-head:1728,1732
.panel-close:1733,1738 · .panel-body:1739,1743,1744 · .panel-page:1741,1742 · .collect-sub:1748 · .mkt-empty:1749 · .craft-box:1750
.mkt-listing:1751 · .mkt-filter:1752,2157 · .hq-grid:1759 · .hq-card:1760,1765,1789 · .hq-head:1766 · .hq-pic:1772,1774
.hq-emoji:1776 · .hq-badge:1777 · .hq-stars:1781 · .hq-price:1782,1787,1788,1791(+6) · .craft-credit:1795,1797,1798 · .car-grid:1805,1807,1808
.robot-weap:1809 · .dmap-box:1812,1813 · .dmap-grid:1819 · .dmap-card:1821,1824,1825,1826(+2) · .dmap-ico:1828 · .dmap-new:1831
.dcp-grid:1833 · .dcp-card:1835,1838,1839,1840(+10) · .levelup-box:1857,2081,2091,3214(+2) · .dcp-box:1860,1861,1865,1866(+6) · .dcp-lock:1874 · .sold-badge:1878,1880,1881
.rs-showroom:1883,5578,5579 · .rs-list:1884,1886,5559,5562 · .rs-thumb:1887,1889,1890,1891(+1) · .rs-thumb-pic:1892,1893 · .rs-thumb-price:1894 · .rs-stage:1896
.rs-big:1899 · .rs-big-img:1900 · .rs-elec:1904,1908,1913 · .rs-edge:1914,1920 · .rs-info:1923,1924,1925,1926(+1) · .rs-buy:1928,1930,1931
.cs-showroom:1935,5551,5552,5580(+3) · .cs-list:1936,1938,5553,5558(+9) · .cs-thumb:1939,1941,1942,1943(+1) · .cs-thumb-pic:1944,1945 · .cs-thumb-name:1946 · .cs-thumb-price:1947
.cs-thumb-own:1948 · .cs-stage:1950 · .cs-big:1953 · .cs-big-img:1954 · .cs-elec:1958,1962,1966 · .cs-edge:1967,1973
.cs-interior:1976 · .cs-inr-label:1977,1978 · .cs-inr-img:1979 · .cs-info:1981,1982,1983,1984(+6) · .cs-buy:1992,1994,1995,1996 · .car-emoji:1998
.car-mine:2004 · .car-mine-pic:2009 · .car-mine-info:2010 · .car-loan:2011,2012 · .car-mine-btns:2013,2014,2015 · .car-locked:2017
.car-mine-head:2019 · .car-pick-list:2020,2021 · .car-pick:2022,2024,2025 · .car-pick-pic:2026,2027 · .car-pick-name:2028,2029 · .car-pick-od:2030
.car-buy-box:2032,3466 · .cb-pic:2033,2034,2035 · .cb-lines:2036 · .cb-li:2037,2041,2042 · .cb-ins:2043,2047,2048 · .cb-plan:2049
.cb-pl:2050,2055,2057,2061(+1) · .cb-total:2068 · .cb-btns:2069,2074 · .cb-x:2070 · .dress-overlay:2077,2094,2097,2101 · .dress-title:2095,2096,2098
.dress-wallet:2099 · #shop-grid-wrap:2103 · .shop-grid:2104 · .shop-item:2105,2113,2114,2115(+13) · .it-topline:2121 · .it-rarity:2122,2123
.it-type:2124 · .it-art-stage:2125 · .it-art:2127 · .it-emoji:2128 · .it-sparkle:2129 · .it-action:2133
.mkt-tab:2158,2159 · .pg-btn:2160,2161,2162 · .pg-dot:2163 · .fr-gift-btn:2197,2202 · .gift-sec-title:2205 · .gift-in-row:2207
.gift-out-row:2211 · .gift-in-pic:2212,2214,2215 · .gift-in-info:2216,2217 · .gift-in-btns:2218 · .gift-accept:2219,2223,2225 · .gift-decline:2224
.gift-box-card:2226 · .gift-box-from:2227,2228 · .gift-note:2229 · .gift-pick-overlay:2232 · .gift-pick-box:2236 · .gift-pick-head:2242,2246
.gift-pick-close:2247 · .gift-pick-tabs:2249 · .gp-tab:2250,2254 · .gift-pick-body:2255 · .gp-chips:2256 · .gp-chip:2257,2261
.gp-card:2262,2263 · .gp-price:2264 · .gp-note:2265 · .gift-cf-pic:2266 · .chat-emoji-cats:2271 · .chat-emoji-cat:2275,2279,2280
.chat-emoji-wrap:2281,2282 · .stage-left:2291,5106 · .pet-info-btn:2295,2302,2303 · .feed-list:2310,2314,2339,2340(+1) · .feed-empty:2315,2318 · .fd-tools:2324
.feed-bell:2325,2327,2328,2329 · .fd-prog:2333,2334 · .fpost:2341,3096 · .fp-head:2346 · .fp-who:2347 · .fp-name-line:2350
.fp-name:2351 · .fp-when:2352 · .fp-badges:2354,2357 · .fp-badge-ic:2355 · .fp-text:2359 · .fp-media:2362
.fp-img:2364 · .fp-cap:2366 · .fp-big:2367 · .fp-sum:2369,2371 · .fp-sum-rx:2372 · .fp-sum-none:2373
.fp-en:2374 · .fp-bar:2376 · .fp-act:2377,2381,2383 · .fp-like:2382 · .fp-page:2394,2395,2396,2397(+3) · .fp-rxbox:2400
.fp-rxb:2404,2406,2407,2408(+1) · .fp-rxb-off:2410 · .fp-fly:2412,2415,2416 · .fcm-overlay:2419 · .fcm-box:2421 · .fcm-post:2425,2426
.fcm-rxs:2427 · .fcm-rx:2428 · .fcm-list:2429,2431 · .fcm-row:2432,2433,2434 · .fcm-none:2435 · .fcm-item:2437
.fcm-reps:2438 · .fcm-rep:2440 · .fcm-more:2442,2444 · .fcm-arrow:2445 · .fcm-reply:2446,2448 · .fcm-like:2450,2453,2454,2455
.fcm-likeic:2456 · .fcm-cnt:2458,2460 · .fcm-likers-box:2461 · .fcm-likers-list:2462,2464 · .fcm-liker-row:2465 · .fcm-liker-none:2466
.fcm-repbar:2467,2470 · .fcm-repx:2471 · .fcm-note:2473 · .fcm-quick:2475,2477 · .fcm-q:2478,2481,2482 · .fcm-add:2483
.fcm-input:2484,2486 · .fcm-send:2487,2489 · .fcm-locked:2490 · .fnt-overlay:2492 · .fnt-box:2494 · .fnt-list:2498,2500
.fnt-row:2501,2503,2516 · .fnt-ico:2504 · .fnt-tx:2505,2506 · .fnt-sub:2507 · .fnt-hint:2509 · .fnt-go:2510,2513,2514,2522
.fnt-tag:2517 · .fnt-note:2519 · .fcm-hl:2524 · .feed-plate:2532 · .feed-all-btn:2533,2538 · .fdb-overlay:2543
.fdb-box:2545 · .fdb-head:2549 · .fdb-close:2553,2555 · .fdb-live:2556 · .fdb-live-title:2557 · .fdb-live-rows:2559,2561,2562
.fdb-live-row:2563,2565,2566,2567 · .fdb-dot:2568 · .fdb-list:2570,2571 · .fdb-empty:2572 · .fdb-row:2573 · .fdb-row-top:2575
.fdb-ico:2576 · .fdb-txt:2577 · .fdb-name:2578 · .fdb-ago:2579 · .fdb-actions:2580 · .fdb-like:2581,2584,2585,2586
.fdb-cm-list:2587 · .fdb-cm-row:2588,2590 · .fdb-cm-empty:2591 · .fdb-cm-add:2592 · .fdb-cm-input:2593,2595 · .fdb-cm-send:2596,2598
.fdb-cm-locked:2599 · .pi-overlay:2602 · .pi-box:2606,2610,2611,2615(+13) · .pi-close:2617,2622,2623 · .pi-close-left:2625 · .pi-close-bottom:2626,2632
.pi-portrait:2656 · .pet-wear:2663,2666,2668 · .pi-portrait-wrap:2671,2673 · .pi-dress-btn:2681,2685,2686 · .pi-shape-cap:2687,2690,2691,2692 · .pi-shape-toggle-btn:2694,2697
.pi-dress-pip:2699,2704,2705,2706(+1) · .pi-wear-note:2709,2711 · .greet-card:2718 · .greet-sub:2719 · .greet-grid:2720 · .greet-opt:2721,2724,2725,2726
.greet-e:2727 · .pi-streak:2731 · .pi-streak-head:2733,2735 · .pi-streak-best:2736 · .pi-dots:2737 · .pi-dot:2739,2740,2741
.pi-streak-note:2742 · .pi-care-title:2743 · .lbf-overlay:2756 · .lbf-box:2759,2773,2774,2775(+13) · .lbf-head:2764 · .lbf-title:2765
.lbf-tabs:2766,2769 · .lbf-note:2772 · .lbf-close:2788 · .lbf-close-l:2789 · .lbf-scroll:2790,2792,2917 · .lbf-body:2793
.lbf-grid:2794 · .lbf-box-bcat:2817 · .lbf-bcat-wrap:2818 · .lbf-bcat:2820,2879,2880,2881(+3) · .lbf-bcat-head:2822,2823,2824 · .lbf-bcat-mid:2831
.lbf-bcat-badge:2832,2891 · .lbcat-ic:2842 · .badge-shine-img:2848 · .badge-shine:2866,2867 · .lbcat-ic-label:2893 · .lbf-bcat-rows:2895
.lbf-one-row:2899,2900,2901 · .lbf-bcat-row:2902,2904,2905,2907 · .lbf-podium:2923 · .pod:2925,2952,2953 · .pod-char:2927 · .pod-base:2929
.pod-rank:2931 · .pod-label:2933,5622 · .pod-name:2935 · .pod-sc:2937 · .pod-1:2942,2943 · .pod-2:2944,2945
.pod-3:2946,2947 · .pod-4:2948,2949 · .pod-5:2950,2951 · .pl-wide:2970,2973,2974,2975(+8) · .pl-follow:2976,2981,2983 · .pl-unfollow:2985,2991,2992
.pl-followers:2993 · .pl-cols:2994,2999,3000,3001 · .pl-col:2995 · .pl-sec-title:2996 · .pl-badges-col:3002 · .pl-feed:3003,3006,3013
.pl-feed-row:3007,3011,3012 · .pl-assets-wrap:3015,5459,5534 · .pl-assets:3016,5462,5467,5473(+4) · .pl-asset:3019,3023,3030 · .pl-asset-emoji:3024 · .pl-asset-n:3025
.pl-pets-wrap:3032 · .pl-pets:3033 · .pl-pet:3034,3039,3041 · .pl-pet-nm:3042 · .img-lightbox:3045,3050,3051,3055(+3) · .cert-svg:3074
.cert-tap:3075,3080 · .cert-chip-sm:3083 · .pl-sec-sub:3103 · .pl-certs:3104,3106 · .cert-mini:3107,3111,3113 · .cert-mini-cap:3114
.cert-none:3116 · .lv-cert-row:3118,3120 · .lv-cert-btn:3121,3126 · .cert-lightbox:3128,3133,3134,3138(+3) · .pl-chat:3158,3163 · .pl-call:3165,3171
.pet-peek:3172,3173 · .pp-chips:3175 · .pp-chip:3176 · .pp-gift:3181,3187 · .settings-box:3189,3190,3263,3274(+37) · .set-feed-head:3191
.set-feed-sub:3195 · .set-feed-row:3196 · .pillinfo-val:3201 · .pillinfo-desc:3206,3225 · .pillinfo-box:3217 · .plf-head:3220
.plf-emoji:3221 · .plf-ht:3222,3223,3224 · .plf-foot:3226,3228,3229 · .alert-box:3234,3236 · .ab-emoji:3237 · .ab-title:3238
.ab-desc:3239 · .ab-btns:3240,3241,3242 · .heal-heart:3244 · .attn-box:3259 · .set-tabs:3284,3288,3291,3292 · .set-attention-ico:3301
.set-attention-copy:3302,3303,3304 · .set-attention-go:3305 · .set-panels:3306 · .set-panel:3307,3310,3311,3313 · .set-offline-card:3314 · .set-pack-icon:3321
.set-pack-copy:3326,3327,3328,3329 · .set-pack-progress:3330,3332 · .set-pack-actions:3334 · .help-box:3440,3441,3442 · .wl-box:3460 · .food-box:3461
.home-shop-box:3463 · .summary-box:3464 · .report-box:3465 · .wl-grid:3468 · .tc-wrap:3470 · .spell-btn:3476,3481,3482
.sp-hud:3483 · .sp-word:3485 · .sp-ch:3486,3491 · .sp-th:3493 · .sp-hint:3495 · .sp-exit:3498,3502
.sp-banner:3503 · .sp-big:3508 · .sp-thb:3510 · .sp-coin:3511 · #spell-confetti:3516 · .sp-rb:3517
.sp-day:3527 · .sp-perfect:3529 · .sp-late:3531 · #spell-coinpop:3534 · .side-sub:3643,3645 · .sec-quest:3650
.on-page:3662,3663,3664,3665 · .inbox-overlay:3675 · .ib-box:3677 · .ib-head:3681 · .ib-close:3685,3687 · .ib-list:3688,3689
.ib-row:3690,3691,3692,3693 · .ib-ava:3694,3699,3700 · .ib-on:3701 · .ib-mid:3703 · .ib-name:3704 · .ib-last:3705
.ib-meta:3706 · .ib-time:3707 · .ib-dot:3709 · .ib-story-badge:3712 · .ib-empty:3716 · .ib-story:3718,3720
.ib-story-item:3721,3723,3730 · .ib-story-ava:3724 · .ib-story-on:3728 · .ib-world:3733,3736 · .ib-tabs:3738 · .ib-tab:3739,3742,3744
.ib-tab-dot:3745 · .ib-call-ava:3749 · .ib-call-row:3750,3751 · #btn-music:3757,3760,3761 · #ws-overlay:3776,3956 · #ws-board:3779,3785,3787,3964(+3)
.ws-head:3790,3993,3994 · .ws-title:3791,3995,4002,4003 · .ws-findbar:3794,4004 · .ws-tip:3795,4010 · #ws-combo-clock:3797,3799,3801,3802(+2) · .ws-grade:3807,3808,4015,4021
.ws-body:3811,4022 · .ws-gridwrap:3812,4052 · #ws-grid:3815,4057 · .ws-cell:3820,3825,3827,3830(+6) · .ws-flash:3836,3838,4084 · .ws-coinpop:3842,3866
.ws-combo:3853,3857,3858,3859 · .ws-find:3870,4009 · #ws-prog:3871,4011 · #ws-words:3875,3879,4023 · .ws-word:3881,3886,3887,3888(+16) · .ws-actions:3896,3897,3906,4071(+1)
.ws-sizes:3901,4077 · .ws-sizes-lb:3903,4078 · .ws-size-now:3904,4079 · #ws-new:3907,4080 · #ws-combo-help:3908,4081 · #ws-stash:3909,4082
#ws-clear:3910,4083 · #ws-combo-dialog:3912,3913 · .ws-combo-card:3915,3918,3925,3926 · .ws-combo-lead:3919 · .ws-combo-steps:3920,3921,3923,3924 · .ws-combo-close:3927
.ws-combo-ok:3929 · #ws-win:3930,3932,4085 · .ws-win-in:3933,3936,4086,4087 · .sec-online:4122 · .rank-tab:4152,4153,4154,4155(+2) · .pet-show-bg:4185,4187,4189,4194(+22)
.bond-context:4298 · .bond-owner:4300,4303,4305 · .bond-owner-heart:4306 · .bond-talk:4308,4312,4314,4315(+6) · .bond-home-card:4322,4327,4328 · .bond-home-art:4329
.bond-home-img:4331 · .bond-home-empty:4333 · .bond-home-copy:4334,4335,4336,4337 · .bond-home-go:4338 · .bond-gear:4340,4344 · .ps-night-fx:4370,4372,4384,4389(+1)
.pet-show:4399,4402,4414,4416(+63) · .ps-video:4683 · .ps-worn-pip:4761,4762 · .id-card:4785,4792,4796 · .id-chip:4809 · .clock-chip:4818,4819
.coin-block:4835 · .coin-subrow:4836 · .coin-group:4837 · .coin-pill:4867,4868,4889 · .cp-lb:4892 · .cp-v:4893
.topbar-icons:4929 · .topbar-icons-row:4930 · .rank-move-box:4947 · .rank-move-head:4952 · .rank-move-feed:4956,4960,4961 · .rank-move-row:4962,4966
.rank-move-up:4967 · .rank-move-name:4968 · .rank-move-topic:4969 · .rank-move-empty:4970 · .rank-move-gap:4971 · .nw-sub:5008
.top-flex2:5103 · #panel-factory:5122,5123,5127,5128(+39) · #panel-rank:5263,5264,5270,5275(+11) · .grid2x8:5346,5352 · .pl-badges-vwrap:5361,5376 · .grid3x5:5362,5367
.pl-badge-arrow:5368,5374 · .pba-u:5375 · .pl-badges-strip:5380,5388,5389 · .pl-badge-card:5390,5396,5414,5415(+1) · .pl-badge-card-ic:5402,5411,5413 · .pl-badge-card-nm:5417
.pl-badges-empty:5423,5425 · .mine-strip:5439,5441,5442,5447(+4) · .mb-strip:5453,5492 · .gmark:5600,5604,5605,5606(+1) · .gm-stack:5609,5613 · .gm-row:5615
.lb-name:5617,5618,5619 · .grade-edit:5640,5645,5646 · .gradelock-box:5650,5666,5671,5673 · .gl-head:5651 · .gl-emoji:5652 · .gl-ht:5653
.gl-cur:5654 · .gl-lock:5655,5660 · .gl-ok:5659 · .gl-lock-sub:5661 · .gl-why:5662 · .gl-pick-lb:5663
.gl-opts:5664 · .gl-hist:5674 · .gl-hline:5675 · .gl-hg:5679 · .gl-hat:5680 · .gl-harr:5681
.gl-foot:5682 · .gl-cf:5683 · .reg-gradelock:5705 · #tp-overlay:5715 · #tp-board:5717,5721 · .tp-head:5725
.tp-title:5726 · .tp-stat:5728,5730 · .tp-pts:5732,5735 · .tp-close:5737,5743,5744 · .tp-snd:5747,5750,5756,5757 · .tp-snd-ic:5751
.tp-snd-track:5752 · .tp-snd-thumb:5754 · .tp-prompt:5761 · .tp-word:5763,5777,5778 · .tp-ch:5765,5770,5771,5773 · .tp-thai:5781
.tp-hint:5783 · .tp-empty:5785 · .tp-keys:5788 · .tp-row:5790 · .tp-row-fn:5792,5825 · .tp-key:5796,5808,5810,5816(+2)
.tp-key-fn:5823 · .tp-fx:5829 · .tp-coinpop:5830 · .tp-pop-pt:5835 · #city-backdrop:5849,5855 · .city-arrive:5856,5857
.night:5871,5891,5892,5894(+2) · #night-veil:5917 · .theme-emerald:5946,5958,5965,5968(+7) · .theme-plum:5951,5962,5966,5969(+3) · #theme-veil:5979 · #screen-picmatch:6034,6040,6041,6042(+41)
.pm-category-btn:6080,6083 · .pm-sheet-card-img:6084 · .pm-card:6087,6092,6096,6098(+9) · .pm-grid:6090 · .pm-right:6120 · .pm-now:6121,6127
#pm-now-en:6128 · .pm-now-th:6129 · .pm-lobby-btn:6137,6141 · .pm-mode-btn:6166,6169 · .pm-wordcard:6170,6171,6173 · .mkt-pet-head:6208
.mkt-pet-wrap:6209 · .mkt-pet-list:6210 · .mkt-pet-card:6211,6218,6219,6220(+3) · .mkt-pet-picture:6222,6223,6224 · .mkt-pet-name:6225 · .mkt-pet-stage:6226
.mkt-pet-price:6227 · .mkt-pet-short:6229

## css/onetpromo.css (27 บรรทัด · 17 selector)
.onet-promo-overlay:2 · .onet-promo-card:3 · .onet-promo-content:4 · .onet-promo-close:5 · .onet-promo-kicker:6 · .onet-promo-title:7
.onet-promo-lead:8 · .onet-promo-grades:9 · .onet-promo-grid:10 · .onet-promo-stat:11 · .onet-promo-actions:12 · .onet-promo-go:13,15
.onet-promo-optout:14 · .racing-promo-overlay:20 · .racing-promo-card:21,22,23,25 · .racing-promo-flag:24 · .racing-promo-features:26

## css/petfashion.css (32 บรรทัด · 14 selector)
.pp-fashion-overlay:2,3,4,5 · .pp-fashion-note:6,7 · .pp-fashion-rail:8 · .pp-fashion-strip:9,10 · .pp-fashion-arrow:11 · .pp-fashion-card:12,13,17,18
.pp-fashion-top:14 · .pp-fashion-art:15,16 · .pp-try-overlay:19 · .pp-try-card:20 · .pp-try-visual:21 · .pp-try-copy:22
.pp-try-actions:23 · .pp-fashion-pin-overlay:24

## css/petpantry.css (6 บรรทัด · 4 selector)
.pantry-main-row:2 · .pantry-grant-overlay:3 · .petshop-entry-box:4 · .petpantry-overlay:5

## css/petshopping3d.css (26 บรรทัด · 20 selector)
.ps3-root:2,3 · .ps3-hud:4 · .ps3-gps:5 · .ps3-gps-icon:6 · .ps3-actions:7 · .ps3-turn-effects:8
.ps3-cardash:9 · .ps3-cargauge:10 · .ps3-pet:11 · .ps3-radio-screen:12 · .ps3-radio-list:13 · .ps3-steerpad:14
.ps3-gaspad:15 · .ps3-geard:16 · .ps3-turnpad:17 · .ps3-tools:18 · .ps3-warning:19 · .ps3-carstart:20
.ps3-law:21 · .cam3:22

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

## css/rankgraph.css (23 บรรทัด · 10 selector)
.rank-graph-btn:2,5 · .rg-overlay:6 · .rg-box:7,9,10,21 · .rg-close:11,12 · .rg-tabs:13 · .rg-tab:14,15,16
.rg-stage:17 · .rg-chart:18 · .rg-point:19 · .rg-loading:20

## css/skyplay3d.css (46 บรรทัด · 26 selector)
#sp-root:2,3 · #sp-canvas:4 · .sp-sky-glow:5 · .sp-top:6,28 · .sp-pill:7,8 · .sp-play:9
.sp-daily:10 · .sky-hint:11 · .sky-word:12 · .sp-toast:13 · .sp-joy:14 · .sp-actions:15
.sp-activity:16 · .sp-gate:17 · .sp-tower:18 · .sp-classroom:19 · .sp-class-finish:20 · .sp-packbar:21
.sp-character-btn:29 · .sp-character-picker:30 · .sp-character-card:31,32 · .sp-character-grid:33,34,35 · .sky-entry-box:40 · .sky-entry-character-picker:41
.sky-entry-character-grid:42,43 · .sky-entry-actions:44

## css/style.css (2,498 บรรทัด · 604 selector)
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
.pet-wrap:639 · .pet-emoji:640 · .pet-img:641 · .egg-img:642 · .feed-pet:643,891 · .pet-baby:644
.pet-adult:645 · .pet-egg-stage:647 · .wear:649 · .wear-head:650 · .wear-face:651 · .wear-neck:652
.pet-name:654 · .stage-label:655 · .level-row:656 · .level-badge:657 · .exp-bar:661 · .exp-fill:662
.exp-text:663 · .ability-box:665,669 · .hunger-bar:672 · .hunger-fill:673,674,675 · .food-item:681,746,750,751(+9) · .hunger-text:685
.heat-bar:688 · .heat-fill:689 · .heat-text:690,691,692 · .care-row:694 · .care-btn:695,699,706 · .btn-feed:700
.btn-feed-all:701 · .btn-cure:702 · .btn-foodquiz:704 · .care-row-quiz:705 · .sick-banner:707 · .pet-sick:711
.food-lock-note:714 · .pet-asleep:724 · .sleep-badge:725 · .btn-sleep:727 · .dinner-btn:730 · .food-box:734,735
.food-x:737,743 · .food-hunger-bar:744 · .food-grid:745 · .fd-lock:759 · .fd-lock-when:783 · .fd-nowok:784
.fav-tag:787 · .fd-exp:791 · .food-sec:793 · .food-sec-human:797 · .bad-tag:799 · .fd-toxin:803
.fd-safe:804 · .food-sprite:810 · .food-art-fallback:815 · .feed-all-overlay:816 · .feed-all-box:817 · .feed-all-head:823,824
.feed-all-shelf:825 · .feed-all-close:826 · .feed-all-close-top:827 · .feed-all-scroll:828,829,830 · .feed-all-pets:831 · .feed-all-pet:832,833,836
.feed-all-pet-art:834 · .feed-all-plan-art:835 · .feed-all-menu:837 · .feed-all-selected-head:838 · .feed-all-mini-bar:839 · .feed-all-foods:840
.feed-all-food:841,842 · .feed-all-food-stock:843 · .feed-all-food-art:844 · .feed-all-food-badge:845 · .feed-all-actions:846 · .fq-box:864,865
.fq-progress:866 · .fq-pair:867,868 · .fq-ask:869 · .fq-why:870 · .fq-btns:874,875,879 · .fq-yes:880
.fq-no:881 · .fq-next:882 · .food-cancel:883 · .feed-box:889,890 · .feed-gain:892 · .sick-badge:896
.big-btn:902,908,1166,1167(+6) · .shop-card:911 · .shop-title:915 · .shop-grid:916 · .shop-item:917,921,922,923(+4) · .it-tag:928
.tag-wear:929 · .lock-banner:931 · .home-current:937,942,943 · .home-img:944 · .home-emoji:945 · .home-btn:946,968
.home-layout:948 · .home-pic-col:949,955 · .home-img-big:953 · .home-info-col:956,958,961,962 · .home-name-row:959 · .home-desc-row:960
.home-shop-box:970,971 · .home-list:972 · .home-option:973,977,978,979(+3) · .home-downgrade-lock:984 · .home-opt-img:987 · .home-opt-body:989,990
.home-price:991 · .reset-link:1011 · .login-card:1017 · .login-pets:1018 · .login-status:1019 · .google-btn:1020,1026,1027
.login-note:1028 · .install-btn:1031,1037,1038 · .install-guide-overlay:1041 · .install-guide:1045,1049,1052 · .install-steps:1050,1051 · .install-guide-close:1053
.login-account:1058 · .register-card:1061,1065,1083,1087 · .reg-safety:1067,1069,1070 · .reg-privacy:1072,1074,1075 · #screen-register:1077,1078,1079,1080(+2) · .student-chip:1088
.clock-chip:1092 · .online-count:1098 · .online-row:1105,1109,1110,1129 · .online-dot:1114 · .online-name:1119 · .online-act:1123
.online-ava:1128 · .online-live:1130 · .online-note:1134 · .lb-empty:1137 · .lb-list:1138 · .lb-row:1139,1143,1144
.lb-rank:1148 · .lb-name:1150,1154 · .lb-coins:1158 · .lb-hint:1160 · .lb-badgeline:1161 · .lb-tabs:1163
.lb-tab:1164,1165 · .tinv-note:1176 · .cat-card:1182,1227,1230,1378(+1) · .cat-head:1186 · .cat-emoji:1187 · .cat-name:1188
.cat-pass:1189 · .cat-info:1190 · .cat-btns:1191 · .cat-btn:1192,1196,1197,1198(+3) · .cats-back-bottom:1201 · .tapglow:1206,1207,1215
.lobby-bottom:1214 · .band-sec-head:1225,1226 · .bax-box:1234,1236 · .bax-head:1237 · .bax-sub:1238,1239 · .bax-row:1240
.bax-lv:1241,1244,1245,1246(+3) · .bax-emoji:1247 · .bax-name:1248 · .bax-q:1249 · .bax-need:1251 · .bax-rw:1252
.bax-foot:1256 · .bax-rank:1257,1260 · .bxr-box:1263,1265 · .bxr-head:1266 · .bxr-sub:1267 · .bxr-body:1268
.bxr-pick:1269 · .bxr-cats:1270 · .bxr-chip:1271,1273,1274,1275(+1) · .bxr-list:1278 · .bxr-row:1279,1281,1283,1287 · .bxr-rk:1282
.bxr-nm:1284,1285 · .bxr-sc:1286 · .bxr-tm:1288 · .bxr-more:1289 · .bxr-none:1290 · .bxr-foot:1292
.band-mine-tag:1293 · .bsp-box:1296,1299 · .bsp-head:1300 · .bsp-prog:1301 · .bsp-retake:1303,1306 · .bsp-info:1308,1310
.rts-box:1313 · .rts-head:1315 · .rts-sets:1316 · .rts-set:1317,1318,1319 · .rts-sub:1320 · .rts-words:1321
.rts-word:1322,1324,1325 · .rts-foot:1326 · .rts-okbtn:1327,1329 · .bsp-grid:1330 · .bsp-chip:1331,1334,1335,1336(+1) · .bsp-num:1338
.bsp-best:1339 · .bsp-tick:1340 · .bsp-foot:1341 · .vb-box:1344,1346 · .xsp-box:1349 · .vb-head:1350
.vb-total:1351 · .vb-quizbtn:1352,1354 · .vb-tabs:1355 · .vb-tab:1356,1358,1359 · .vb-words:1360 · .vb-word:1361,1364,1365,1366(+3)
.vb-empty:1370 · .vb-foot:1371 · .vb-pg:1372,1374 · #vb-pginfo:1375 · .vb-hint:1376 · .band-lock:1384
.offline-btn:1385,1386 · .quiz-progress:1391 · .quiz-phon:1392 · #quiz-extra:1393,1395,1396,1397 · .quiz-word-card:1398 · .quiz-next:1404,1410,1411,1412(+1)
.quiz-choice:1415,1420,1421,1422 · .quiz-score-pill:1423 · .quiz-time-pill:1425,1427 · .stats-card:1430 · .stats-title:1434,2028 · .stats-row:1435,1436,1437,1438
.stat-badge-line:1440,1443 · .stat-badge-ic:1441 · .game-top:1446 · .back-btn:1447 · .combo-pill:1451 · .timer-wrap:1455
.timer-fill:1456,1457 · .board-label:1459 · .card-grid:1460 · .word-card:1461,1467,1468,1469(+3) · .hint-btn:1475,1480 · .game-endless-note:1483,1488,1490,1494(+6)
.report-btn:1515,1520 · .report-box:1523 · .report-close:1524 · .rp-head:1528 · .rp-avatar:1529,1530 · .rp-title:1531
.rp-sub:1532 · .rp-levelcard:1534 · .rp-level-top:1538 · .rp-bar:1539 · .rp-bar-fill:1540 · .rp-level-note:1541,1542
.rp-grid:1544 · .rp-stat:1545 · .rp-ic:1548 · .rp-num:1549 · .rp-lbl:1550 · .rp-section:1552
.rp-h3:1553 · .rp-badge-mini:1554 · .rp-row:1555,1556,1557 · .rp-empty:1558 · .rp-badges:1559 · .rp-badge:1560
.rp-tline:1563 · .rp-tl-head:1564,1565 · .rp-tl-ems:1566 · .rp-em:1567,1568 · .rp-tl-note:1569,1570 · .rp-crown:1572,1573
.rp-wtitle:1575 · .rp-wnow:1576,1577 · .rp-wgraph:1578 · .rp-wcol:1579 · .rp-wval:1580 · .rp-wbar:1581,1582
.rp-wlbl:1583 · .rp-cheer:1585 · .report-ok:1589 · .summary-box:1592,1715,1719,1720(+2) · .sm-burst:1593 · .sm-title:1595
.sm-line:1596 · .sm-coin:1597 · .sm-matches:1603,1604 · .confetti:1606 · .sm-badge:1613 · .sm-badge-all:1617
.badge-celebrate-overlay:1620,1673,1681 · .badge-celebrate:1626 · .bc-emoji:1632,1670 · .bc-emoji-img:1641 · .badge-clickable:1654,1655,1656 · .badge-info-box:1660
.bi-emoji:1661 · .bi-emoji-img:1662 · .bi-title:1663 · .bi-desc:1664 · .bi-ok:1665 · .bc-title:1671
.bc-sub:1672 · .bc-sticky:1682 · .bc-coin:1683,1688 · .bc-ok:1689,1694 · .sm-cheer:1709 · .sm-streak:1710,1711
.sm-sick:1712 · .sm-btns:1713 · .float-fx:1725 · .toast:1732 · .toast-warn:1739,1746,1747,1753 · .toast-financial:1754,1761,1764,1770(+2)
.toast-link:1783,1790,1791,1796(+4) · .toast-clear-all:1807,1814 · .alert-box:1816 · .alert-ok:1817,1822 · .settings-box:1824 · .set-row:1825
.set-hint:1829 · .set-hint-on:1830 · .set-hint-off:1831 · .set-lwrap:1832 · .set-label:1833 · .set-desc:1834
.set-switch:1835,1839,1840,1845(+4) · .set-sw-knob:1841 · .set-sw-txt:1848 · .set-night-row:1857 · .set-seg:1858,1860,1866,1867(+1) · .set-close:1869,1874
.set-help:1875,1880 · .help-box:1882,1883,1888 · .help-item:1884 · .update-banner:1896,1905,1906 · #update-reload:1907 · #update-dismiss:1911
.levelup-overlay:1917,1923,1924 · .levelup-box:1925,1932,1933,1934(+4) · .bill-box:1950,1954,1955 · .tag-off:1956 · .home-decayed-img:1957 · .home-dark-img:1958
.thirst-fill:1959 · .thirst-text:1960,1961 · .toxin-fill:1964 · .toxin-text:1965,1966 · .detox-btn:1967,1972 · .shape-text:1975,1976,1977,1978(+1)
.avatar-pick:1982 · .avatar-opt:1983,1987,1988,1989 · .avatar-chip-img:1993 · .mini-av:1995 · .fp-ava:1996 · .avatar-chip-blk:1998
.set-avatar-btns:1999 · .avatar-mini:2000,2004 · .set-blk-row:2006 · .set-sub2:2007 · .blk-grid:2009 · .blk-mini:2010,2013,2014,2015
.game-avatar:2018,2019,2020 · .stats-nick:2029 · .ticket-owned:2032,2036 · .collect-sub:2041 · .mkt-tabs:2042 · .mkt-tab:2043,2047
.mkt-filter:2048 · .mkt-row:2052 · .mkt-emoji:2056,2057 · .mkt-info:2058,2059 · .mkt-tier-stars:2060 · .mkt-buy:2061,2066,2067
.mkt-price-lo:2068 · .mkt-price-hi:2069 · .mkt-empty:2070 · .collect-grid:2073 · .collect-cell:2074 · .cc-emoji:2075,2076
.cc-name:2077 · .cc-count:2078 · .cc-list-btn:2079,2083 · .mkt-listhead:2084 · .mkt-group-head:2086,2092 · .mkt-two-col:2094,2095,2099,2111(+8)
#phone-card:2100,2116 · #computer-card:2101,2117 · #ticket-card:2103 · #haunt-card:2104 · #heli-card:2105 · #drone-card:2106
#drive-card:2107 · #soccer-card:2108 · #moto-card:2109 · #invasion-card:2110 · .mkt-listing:2138 · .ml-cancel:2142
.mkt-sold:2148,2149,2150 · .mkt-buy-box:2155,2161 · .mkt-buy-item:2162 · .mkt-buy-pic:2172 · .mkt-buy-pic-img:2184 · .mkt-buy-pic-emoji:2185
.mkt-buy-meta:2186 · .mkt-buy-name:2187 · .mkt-buy-seller:2188,2189 · .mkt-buy-price:2190 · .mkt-buy-balance:2191 · .mkt-confirm-code-title:2192
.mkt-code-target:2193 · .mkt-pin-note:2206 · .mkt-code-input:2207 · .mkt-code-error:2222 · .mkt-pin-grid:2231 · .mkt-pin-btn:2236,2248
.mkt-pin-del:2249 · .mkt-pin-clear:2250 · .mkt-buy-actions:2251,2257 · .mkt-buy-cancel:2268 · .mkt-buy-confirm:2273,2279 · .list-dialog:2300,2301,2306
.list-hint:2305 · .collect-reveal-frame:2309,2316 · .collect-reveal-img:2315 · .collect-reveal-stars:2317 · .craft-box:2320 · .craft-head:2321
.craft-bar:2322 · .craft-fill:2323 · .craft-text:2324 · .craft-btn-row:2325,2326 · .craft-go-btn:2328,2334,2335,2338 · .craft-cancel:2346,2350
.mkt-catalog:2353,2354,2355 · .mkt-pager:2358 · .pg-btn:2359,2363,2364 · .pg-mid:2365 · .pg-dots:2366 · .pg-dot:2367,2368
.order-head:2369 · .order-row:2370,2375,2377,2379 · .order-deliver:2380,2385 · .order-need:2386 · .avatar-chip-photo:2392 · .pass-photo:2393
.pl-photo:2394 · .pp-cam:2399,2407 · .set-photo-row:2410,2416 · .ph-thumb:2417 · .ph-plus:2418 · .photo-box:2424,2425,2446,2450(+4)
.ph-now:2426 · .ph-now-img:2427,2431 · .ph-now-cap:2432 · .ph-warn:2433 · .ph-sync:2438,2441 · .ph-sync-wait:2442
.ph-sync-ok:2443 · .ph-sync-bad:2444 · .ph-btns:2445 · .ph-tip:2455 · .ph-stage:2457,2461 · .ph-cv:2462
.ph-ring:2463,2468 · .ph-zoom:2472 · .ph-foot:2473 · .ph-crop-box:2474
