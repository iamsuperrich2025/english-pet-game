# CODE_MAP.md — แผนที่โค้ด:บรรทัด (เจนอัตโนมัติโดย `tools/gen_code_map.py` — **ห้ามแก้มือ** เดี๋ยวโดนเขียนทับ)

> วิธีใช้: หาชื่อฟังก์ชัน/ค่าคงที่/selector ในไฟล์นี้ (Grep หรือกวาดตา) → `Read` ไฟล์จริง `offset=<บรรทัด>` `limit=40`
> 🗂️ ไฟล์อ้วนมี **สารบัญโซน** (`st-end ชื่อโซน`) — งานทั้งระบบ/โลก 3D: Grep ชื่อโซน → Read/Edit เฉพาะช่วงนั้น **ห้ามอ่านทั้งไฟล์** · เพิ่มระบบใหม่ในไฟล์อ้วนต้องครอบ banner `/* ==== */`+ชื่อโซน (สารบัญเจนเอง)
> css = index `selector:บรรทัดทุกจุดที่ประกาศ` (บั๊ก UI เริ่มหาที่นี่) · เจนใหม่ทุกครั้งที่รัน `python tools/rotate_handoff.py` · อัปเดต: 2026-08-22

## js/account-deletion.js (235 บรรทัด · 0 รายการ)

## js/adv3d_css.js (1,272 บรรทัด · 0 รายการ)

## js/adv3d_intro.js (86 บรรทัด · 0 รายการ)

## js/adv3d_tex.js (245 บรรทัด · 19 รายการ)
TILE_COLORS:9 · letterTexture:10 · letterTextureDark:27 · emojiTexture:40 · GHOST_IMG_MAX:52 · measureGhostBox:58
probeGhostImages:71 · whenGhostsReady:83 · ghostTexture:87 · ghostScareSrc:92 · AD_STYLES:100 · adBoardTexture:109
addAdBillboard:156 · ringAds:167 · BUILDING_TINTS:177 · FACADE_ROWS:179 · buildingFacadeTexture:180 · makePeerSprite:205
bind:241

## js/adventure3d.js (13,401 บรรทัด · 649 รายการ)
### 🗂️ สารบัญโซน js/adventure3d.js (Read/Edit เฉพาะช่วง)
- 1-217 adventure3d.js — โลก 3D First-person 2 โหมด (คิว 7725691507 ข้อ 8 + ต่อยอด)
- 218-316 ⚽ โหมดสนามฟุตบอล (โหมด soccer · รอบ 196) — เล็ง+ชาร์จพลังเตะบอลใส่ป้ายตัวอักษร
- 317-371 🤖 โหมดหุ่นยนต์นักรบ (โหมด mecha · รอบ 199) — มุมมองในหุ่นสูง 5m เดินยิงเอเลี่ยนตัวอักษร
- 372-518 📻 หอบังคับการบิน (รอบ 64 · รอบ 66 เปลี่ยนเป็นอังกฤษล้วนตามผู้ใช้สั่ง)
- 519-557 คำศัพท์ — ตามระดับชั้น + ไม่ซ้ำคำที่ประกอบแล้ว (8.1/8.6) · แยกคลังต่อโหมด
- 558-693 Texture ตัวอักษร / emoji / ป้ายชื่อผู้เล่น (canvas → sprite)
- 694-1014 🧸 รอบ 1200: ตัวละครผู้เล่น Soft Cuboid Chibi 3D (Drive / Haunted Hotel / Soccer)
- 1015-1322 🚙 รอบ 393: รถเพื่อนในโลกขับรถ = โมเดลจริง img/models/car_01.glb (ผู้ใช้สั่ง)
- 1323-1475 สร้างฉาก static ครั้งเดียวต่อโหมด
- 1476-1822 🚗 เมืองกำแพงเพชรจริง (โหมด drive) — ข้อมูล OpenStreetMap ใน js/data/city_kpp.js
- 1823-1889 🧭🕳️ รอบ 782 — ปิดช่องขาดของกริดถนน (ผู้ใช้: "GPS พาไปช่วงที่ถนนขาดตอน / ขับต่อไม่ได้")
- 1890-2096 🌉 รอบ 788 — ปูถนนเชื่อม "เกาะถนนโดดเดี่ยว" เข้าโครงข่ายหลัก
- 2097-2154 🌳🚁 รอบ 811: จุด "พื้นที่สีเขียวข้างถนน" (greenPts) — สุ่มออกจากจุดบนถนนแต่ละจุด
- 2155-2206 🚁🌳 รอบ 816 — บินเฮลิคอปเตอร์เหนือ "เมืองกำแพงเพชร" แล้วลงจอดเก็บตัวอักษรบนพื้นที่สีเขียว
- 2207-2249 🌅 ท้องฟ้าภาพจริง (รอบ 203) — ใส่ภาพ panorama 360° (equirectangular 2:1) เป็นฉากหลังท้องฟ้า
- 2250-2292 🧱 เทกซ์เจอร์ภาพจริง (รอบ 323) — วางไฟล์ `img/tex/<key>.jpg` (หรือ .png) แล้วแปะทับพื้นผิวทันที
- 2293-2792 🌌 ท้องฟ้ากลางคืนโรงแรมผีสิง (รอบ 694) — ผู้ใช้: "ข้างนอกโรงแรมยังไม่น่ากลัวพอ"
- 2793-2831 🏨 โรงแรมผีสิง (รอบ 684) — ตัวตึก 5 ชั้นสร้างใน js/hotel3d.js
- 2832-2930 ตัวอักษรในโลก (8.2)
- 2931-3055 🔤 ภารกิจโรงแรม 4 คำ — ทุกห้องตั้งแต่ชั้น 2 มีตัวอักษร 1 ตัว
- 3056-3098 🌳🪙 รอบ 811: ความหนาแน่นเสริมเฉพาะโหมดขับรถ — ผู้ใช้: "เพิ่มตัวอักษรและเหรียญบนถนนและ
- 3099-3210 🔠🪙 เก็บตัวอักษร 1 ตัว = ได้ 1 เหรียญ (รอบ 345)
- 3211-3277 ประกอบคำอัตโนมัติเมื่อมีตัวอักษรครบ (8.1/8.4)
- 3278-3372 โหมด adv: monsters ยิงสู้ได้ (สเปกเดิม 8.5)
- 3373-3530 👻 รอบใหม่ — PNG-only ghost chase + client-side shader cosmetics
- 3531-3555 🏨 ระบบโรงแรมผีสิง — ห้องไม่ซ้ำ 5→ดับ, 10→ติด, 13→ดับอีกครั้ง
- 3556-3640 🏨 HAUNTED HOTEL CANONICAL RUNTIME BOUNDARY — Phase 2 รอบ 1084
- 3641-4094 🔤🧭 รอบ 1086 — HAUNTED HOTEL PHASE 4
- 4095-4328 เสียงหลอนโหมดผีสิง — สังเคราะห์ Web Audio (ปลอดลิขสิทธิ์ 100%)
- 4329-4480 🔊 รอบ 1071 — เสียงโรงแรมจากไฟล์จริง + ฝีเท้าแยกทุกตัวละคร
- 4481-4832 Multiplayer — ผู้เล่นอื่นใน map เดียวกัน (สไตล์ Roblox)
- 4833-5047 Voice chat ใน map — WebRTC P2P mesh (เสียงวิ่งตรงระหว่างเครื่อง)
- 5048-5128 🏁 พิธีประกาศแชมป์ (ครูกด "จบรอบแข่ง") — /class/<map>/podium
- 5129-5340 HUD
- 5341-6003 DOM overlay + CSS (สร้างครั้งเดียว — self-contained ไม่แตะ style.css)
- 6004-6139 Input — เมาส์+คีย์บอร์ด และจอสัมผัส (มือถือ landscape)
- 6140-6144 🚁 โหมดเฮลิคอปเตอร์ Bell — ฟิสิกส์บินแบบอาร์เคด (สไตล์ Helicopter Flight Pilot)
- 6145-6537 🛸 โดรน FPV (โหมด drone) — บินเร็ว/คล่อง ลอดหน้าต่างเข้าตึกร้าง เก็บตัวอักษรในห้อง
- 6538-6660 🚗 โหมดขับรถเมืองกำแพงเพชร — ฟิสิกส์รถอาร์เคด (bicycle model)
- 6661-6754 🚦 รอบ 133: ไฟจราจรจริงที่ทางแยกใหญ่ + ฝ่าไฟแดงโดนใบสั่ง ม.22
- 6755-7202 🧭 GPS นำทาง (โหมด drive) — เลือกตัวอักษรเป้าหมาย + เส้นทางตามถนนจริง (A*) · นำทางด้วยภาพล้วน (ไม่มีเสียงพูด ตั
- 7203-7261 🎛️ เข็มหน้าปัดวิ่งจริง (สปีด 0-180 + วัดรอบ 0-8×1000) — วาดทับวงเกจของภาพ dash.png
- 7262-7346 🎵 รอบ 181: วิทยุในรถ — จอ head-unit กลางคอนโซล (visualizer + เลือกเพลง 3 โหมด)
- 7347-7390 🪞📷 รอบ 810: กระจกมองหลัง/ข้าง — เรนเดอร์ฉากเดิมซ้ำด้วยกล้องหันหลัง/เฉียงข้าง แล้วยัดลงกรอบบนจอ (scissor)
- 7391-7474 🪞🧑‍🤝‍🧑 รอบ 973: เพื่อนที่ขับตามมา "เห็นในกระจกมองหลัง" + ป้ายชื่อลอยเหนือรถเขา
- 7475-7602 🪆 รอบ 191: ตุ๊กตาดุ๊กดิ๊กหน้ารถ — รูปตัวละครที่ผู้เล่นเลือก (blkN.png)
- 7603-7906 🚔 รอบ 128: แผงเตรียมออกรถ + กฎหมายจราจร + ใบสั่ง
- 7907-7949 🛩️📦 ภารกิจไปรษณีย์กลางคืน (รอบ 353) — เฉพาะช่วงฟ้ามืด (heliNight>.5)
- 7950-9164 🚶🛗🚁🪂 โหมดเดินเท้าในเมืองเฮลิฯ (รอบ 354 — ผู้ใช้สั่ง)
- 9165-9238 🎛️ หน้าปัดเข็มขยับจริง (รอบ 61) — วาดสดทุกเฟรมจากค่าการบินจริง
- 9239-9510 🌧️☀️ ชั้นบนกระจก: ที่ปัดน้ำฝน + แสงแดดสาด (รอบ 346)
- 9511-9915 🔊🌧️ เสียงที่ปัดน้ำฝน (รอบ 537) — สังเคราะห์ล้วน ไม่มีไฟล์เสียง
- 9916-9985 📹 กล้องใต้ท้องเครื่อง (belly cam) — รอบ 348
- 9986-10057 🎯 วงเป้าลงจอด (รอบ 349) — ไฮไลต์ดาดฟ้าที่มีตัวอักษร ให้รู้ว่าควรร่อนลงตรงไหน
- 10058-10673 📏 แถบเตือนความเร็วดิ่ง (รอบ 349) — ลงเร็วเกินกรอบกล้องกะพริบแดง สอนให้ร่อนลงนุ่มๆ
- 10674-10676 Loop หลัก
- 10677-12305 ⚽ โหมดสนามฟุตบอล — ฟิสิกส์บอล + เล็ง + ชาร์จพลัง + กล้อง 1st/3rd + ชุดนักเตะ
- 12306-12761 🤖 โหมดหุ่นยนต์นักรบ — เดินยิงเอเลี่ยนตัวอักษร (ต้องยิงเรียงลำดับในคำ)
- 12762-12783 เข้า/ออกโลก
- 12784-13401 ❓ การ์ด "วิธีเล่น" ตอนเข้าโลกครั้งแรก (จำแยกต่อโลกใน localStorage — ไม่แตะ state.js)
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
MECHA_WEAPONS:351 · ATC_REPLIES:380 · ATC_CLOSERS:385 · ATC:390 · orderedLetterMode:501 · netUp:512
CHAT_MAX:515 · doneList:522 · wordPool:523 · pickWords:536 · hotelCreateWordSet:542 · adRenterActive:565
FACADE_ROWS:572 · adsFetch:578 · adsWatch:590 · adsStop:597 · adsChanged:598 · adRentBuy:609
heliMusicTick:632 · AD_FLYBY_COIN:636 · adFlybyTick:638 · adShopOpen:657 · adShopRender:671 · BLOCK_AVATARS:701
blkGeo:713 · blkMat:714 · blkCyl:715 · softCuboidGeo:718 · blkFaceMat:735 · softFaceAtlasGeo:751
softFaceAtlasMat:767 · makeLegacyAdventureFigure:777 · makeSoftCuboidChibiFigure:819 · makeBlockFigure:862 · makeBlockCar:864 · blkNameSprite:910
makeBlockPeer:926 · makeWalkPeerWithFigure:947 · makeLegacyAdventureWalkPeer:957 · makeSoftChibiWalkPeer:961 · disposeBlockPeer:964 · mechGlowMat:971
makeMechaFigure:972 · makeMechaPeer:1002 · CAR_GLB_URL:1022 · CAR_GLB_LEN:1023 · carSplitWheel:1027 · carGlbEnsure:1054
carMatGet:1073 · carGlbBuild:1089 · carAvCode:1138 · driveCamToggle:1145 · SKID_N:1164 · skidGeomGet:1166
skidDrop:1171 · skidTick:1185 · blkBuildThumbs:1195 · blkBuildPicker:1214 · pickBlockAvatar:1259 · bubbleSprite:1282
showPeerBubble:1309 · removePeerBubble:1317 · concreteTexture:1327 · brokenWindowTexture:1344 · intactGlassTexture:1360 · chargeIconTexture:1378
rustyDoorTexture:1387 · dAddBox:1401 · buildAbandoned:1408 · makeNameSprite:1481 · flatGeom:1494 · flatGeomUV:1503
buildDriveCity:1513 · HELI_BODY_R:2167 · HELI_KPP_CEIL:2168 · heliKppBlocked:2170 · heliKppSpawn:2191 · SKY_IMG:2214
seamlessSkyCanvas:2220 · applySky:2240 · applyTex:2257 · HSKY_R:2307 · hskyTex:2309 · buildHauntSky:2314
tickHauntSky:2444 · buildScene:2462 · randPos:2835 · randRoadPos:2843 · randGreenPos:2861 · HOTEL_PER_ROOM:2883
HOTEL_MIN_GAP:2884 · hotelSpot:2885 · hotelPruneLetters:2921 · HOTEL_QUEST_WORDS:2935 · HOTEL_FLOOR:2936 · HOTEL_SEARCH_FLOORS:2937
hotelQuestReset:2940 · hotelClearQuestLetters:2945 · hotelQuestWordLetters:2949 · hotelStartQuestWord:2953 · hotelFinalHint:2960 · hotelRevealFinal:2967
spawnLetter:2974 · spawnLettersForWord:3032 · ensureCoverage:3034 · DRIVE_LETTER_COPIES:3062 · DRIVE_BONUS_COINS:3063 · ensureDriveAmbience:3064
removeLetter:3077 · spawnLetterAt:3085 · tickLetterRespawns:3093 · LETTER_COIN:3104 · BONUS_COIN_VAL:3105 · pickUpLetter:3106
hotelApplyCanonicalOrdinal:3155 · letterPop:3175 · letterChime:3194 · tryCompleteWords:3214 · rewardCompletedWord:3229 · completeWord:3244
spawnMonster:3281 · killMonster:3290 · tickMonsters:3298 · damagePlayer:3320 · shoot:3336 · tickShots:3350
GHOST_IMAGE_URL:3378 · makeGhostSprite:3380 · hotelGhostPlayers:3383 · hotelTurnScare:3393 · spawnGhost:3408 · tickGhosts:3429
sessionRecapHtml:3446 · hauntRunSec:3453 · fmtSurv:3454 · hauntSurviveFinish:3455 · tickSurvive:3465 · renderHearts:3478
hotelGhostAttack:3483 · hotelGameOver:3498 · hotelScare:3512 · knockedOut:3524 · DARK_LETTER:3553 · tintSprite:3554
HOTEL_LIGHT_NORMAL:3562 · hotelGlobalLightLevel:3564 · hotelApplyCanonicalMask:3570 · hotelApplyCanonicalPhase:3577 · hotelApplyCanonicalState:3600 · hotelCurrentSearchObjective:3645
hotelSearchContext:3659 · hotelApplyObjectiveProximity:3663 · hotelProximityCue:3671 · hotelShowCriticalHint:3676 · hotelHideCriticalHint:3686 · hotelImportantHint:3691
hotelDirectorContext:3696 · hotelDirectorLightPulse:3707 · hotelDirectorPortraitShift:3723 · hotelDirectorScare:3732 · hotelRuntimeInit:3748 · hotelReset:3790
setTorch:3816 · toggleTorch:3832 · tickTorch:3837 · disposeHotelTorch:3845 · hotelBlackout:3857 · hotelApplyLightingState:3860
hotelLightsOn:3890 · hotelStartFlicker:3894 · tickHotelPlayer:3902 · tickHotelWorld:3980 · hotelAct:4028 · openWardrobe:4045
announceTarget:4074 · hotelFinishRound:4081 · netReady:4486 · netJoin:4492 · sendPos:4513 · netHonk:4563
sendChat:4569 · toggleChatBox:4583 · onPeerData:4594 · disposeHeliMesh:4686 · removePeer:4691 · netLeave:4707
tickPeers:4713 · RTC_CFG:4841 · tinvLinked:4842 · partyWord:4849 · syncPartyWord:4865 · updateVoiceBtns:5029
PODIUM_BONUS:5054 · podiumJoin:5056 · podiumLeave:5067 · endRound:5068 · showPodium:5079 · tinvCheck:5120
showBanner:5133 · renderHudTop:5139 · renderHudWords:5149 · renderHudInv:5159 · ddTierFromName:5166 · renderBoard:5168
drawBigMap:5205 · openBigMap:5260 · closeBigMap:5268 · drawMinimap:5273 · loadCarDash:5346 · loadCarWheel:5358
buildDom:5368 · confirmExit:5988 · IS_TOUCH:6007 · HAS_KBD:6009 · bindInput:6010 · movePlayer:6105
tickPlayer:6115 · collideDrone:6148 · propStall:6167 · propBreak:6174 · propFix:6181 · droneBatAdd:6188
lightningBolt:6191 · startRain:6202 · stopRain:6216 · smashGlass:6218 · awardGlass:6229 · neededLetter:6246
openDoor:6261 · raceStartRun:6281 · raceStop:6288 · gateHighlight:6306 · renderRaceHud:6313 · tickDrone:6322
nearMissTick:6465 · showNearMiss:6489 · awardDaredevil:6500 · comboCheer:6517 · comboFlash:6533 · driveCell:6542
nearestStreet:6548 · collideCar:6558 · tlDotY:6589 · tlSet:6593 · driveArms:6610 · tlTick:6622
TL_GREEN:6666 · tlRedDur:6668 · tlightPhase:6669 · buildTrafficLights:6676 · rlTick:6728 · cellDrivable:6760
cellWeight:6763 · cellBlocked:6768 · cellCenter:6769 · posReachable:6771 · losClear:6782 · nearestDrivableCell:6793
routeGrid:6805 · pickGpsTarget:6858 · NAVLINE_W:6881 · NAVLINE_SKIP:6882 · navLineEnsure:6883 · navLineHide:6893
navLineUpdate:6894 · tickGps:6930 · tickDrive:7001 · drawCarDial:7209 · drawCarGauges:7239 · RADIO_RECT:7267
CAR_RADIO_RECT:7269 · carRadioRect:7275 · radioLayout:7277 · radioSetHint:7300 · renderRadioList:7306 · radioToggleList:7316
drawRadioViz:7321 · radioTick:7339 · MIRROR_REAR:7353 · mirrorRearRect:7356 · mirrorPass:7358 · toggleMirrorMini:7371
drawCarMirrors:7378 · MTAG_MAX_D:7400 · mirrorTagsHide:7404 · mirrorTagName:7405 · mirrorTagsTick:7406 · BOBBLE_FOOT:7480
BOBBLE_H:7481 · BOBBLE_ASPECT:7482 · BOB_OMEGA:7485 · BOB_PITCH_FORCE:7487 · BOBBLE_SKINS:7489 · bobbleSetAvatar:7496
bobbleLayout:7503 · bobbleTick:7516 · bobblePoke:7541 · bobbleApplySkin:7558 · dollOwned:7568 · openDollPicker:7569
carStartShow:7606 · showLawInfo:7624 · lawNotice:7646 · driveFineSettle:7656 · HELI_PHASES:7835 · heliStartPhase:7842
heliFloorAt:7849 · SOFT_TIERS:7859 · softLandBonus:7861 · awardPerfLand:7874 · setHeliLight:7893 · MAIL_COIN:7912
mailStart:7914 · mailStop:7937 · mailTick:7938 · FOOT_EYE:7957 · doorSlideSfx:7963 · doorLerp:7986
entLerp:7994 · footStepSfx:8004 · WRING_COIN:8025 · festivalPaint:8029 · dustTexture:8041 · dustBurst:8050
dustTick:8064 · HELI_GLB_URL:8085 · HELI_GLB_TEX_BLUE:8087 · HELI_GLB_ROTOR:8089 · HELI_GLB_TROTOR:8090 · heliGlbEnsure:8092
heliMatBlueGet:8110 · heliGlbAssemble:8123 · heliNavTick:8162 · peerRotorStop:8169 · peerRotorTick:8175 · heliCrashSfx:8194
heliMeshBuild:8222 · heliMeshBuildLegacy:8233 · buildHeliFoot:8363 · footFloorAt:8479 · insideTerm:8486 · inDoorZone:8487
footHint:8491 · setFootBtns:8492 · liftStart:8497 · beginRide:8508 · endRide:8531 · beginWing:8542
awardAirLetter:8555 · paxChoiceShow:8574 · paxChoiceHide:8600 · pilotShipMesh:8604 · beginPilot:8605 · endPilot:8637
drawCabinWindow:8661 · tickHeliFoot:8685 · heliWallPenalty:8896 · tickHeli:8908 · CP_NAT:9173 · CP_GAUGES:9174
SEAT_LABEL:9187 · SEAT_P_FULL:9188 · SEAT_ZOOM:9189 · DASH_OFF_Y:9190 · DASH_DROP:9191 · setSeat:9193
layoutCockpit:9205 · WIPER:9244 · WIPER_SPD:9247 · WIPER_LABEL:9248 · INT_GAP:9249 · WASH_MS:9253
WASH_TANK_MAX:9257 · SMEAR_LIFE:9269 · CHOP_MIN:9270 · SUN_RAY_FAR:9274 · sunRayBlocked:9276 · sunShadeTick:9295
applyCockpitShade:9306 · rotorChop:9318 · sunUpdate:9326 · HELI_FOG_N0:9337 · fogUpdate:9341 · adGlowPulse:9389
RAIN_MAX:9398 · VISOR_Y:9399 · RAIN_MIN:9400 · RAIN_DUR:9401 · DROP_ZONE:9405 · addDrop:9406
tickDrops:9414 · addWashDrop:9432 · washStart:9439 · renderWashGauge:9459 · washTick:9470 · grimeTick:9487
WIPE_R:9494 · wipeDrops:9495 · wiperSndOn:9518 · wiperSndOff:9530 · wiperThunk:9536 · washSpraySfx:9548
wiperSqueak:9565 · wiperSndTick:9582 · setWiper:9602 · tickWiper:9614 · SH_SWEEP:9645 · shadowSweepTick:9647
REFL_MAX:9659 · REFL_COL:9661 · cityGlowLevel:9662 · drawCityGlow:9667 · setVisor:9699 · rainTick:9705
drawBlade:9722 · drawSmears:9741 · drawGlass:9761 · drawBellyCam:9923 · drawBellyHud:9946 · drawLandingTargets:9992
VS_HARD:10062 · drawDescentBar:10063 · heliShake:10112 · cpNeedle:10123 · drawGauges:10140 · XF_START:10188
PRELOAD_WAIT:10189 · ALT_QUIET_FROM:10191 · ALT_MAX_DAMP:10192 · ALT_LP_MIN:10193 · ECHO_NEAR:10194 · WIND_FULL_SPD:10195
SHUTDOWN_SEC:10196 · PAN_MAX:10198 · OD_RPM:10199 · SHAKE_RPM:10200 · SHAKE_HIT:10201 · soccerLetterPos:10681
letterNeeded:10689 · soccerNeededSet:10698 · soccerTileGeo:10706 · soccerGoldTexture:10708 · makeSoccerTile:10725 · soccerRefreshSkins:10734
soccerBuildTargets:10741 · soccerNextTile:10751 · soccerRetarget:10767 · soccerCoinPop:10779 · soccerGrassTexture:10792 · soccerTurfGrade:10814
soccerTurfTexture:10865 · grassNormalTexture:10884 · soccerLinesTexture:10913 · soccerNetTexture:10964 · soccerCrowdTexture:10972 · soccerBallMat:10991
buildSoccerGoal:11011 · buildStands:11030 · soccerLedBoards:11065 · soccerGKEnsure:11162 · soccerGKTick:11178 · fkBuildWall:11207
fkToggle:11222 · fkHitTest:11238 · pkHud:11257 · pkStart:11266 · pkEnd:11280 · pkTick:11295
repQualify:11302 · repEnsureEl:11305 · repStart:11316 · repTick:11323 · soccerNumTex:11348 · ssSec:11360
ssPaintPattern:11365 · soccerShirtTex:11378 · makeSoccerPlayer:11400 · soccerNewSpot:11437 · soccerResetBall:11449 · soccerKick:11456
soccerCheer:11474 · guideTexture:11477 · auraActive:11501 · auraLeftMs:11502 · auraFlameTex:11510 · auraCoilTex:11534
auraCoilRibbon:11558 · auraGlintTex:11582 · buildAura:11593 · auraBuy:11636 · auraRender:11646 · auraTick:11660
buildDrill:11711 · drillTick:11724 · ballFXTex:11764 · buildBallFX:11775 · smokePuff:11791 · ballFXTick:11799
buildLandRing:11845 · buildGuideRibbon:11855 · renderSpinPad:11880 · spinPadToggle:11892 · spinPadPick:11898 · renderCurl:11910
kickLaunch:11921 · updateSoccerGuide:11930 · soccerCamera:11994 · tickSoccer:12017 · ssShirtPath:12211 · ssShortsPath:12219
ssPaintSwatchShirt:12224 · ssPaintSwatchShorts:12229 · ssPreviewDraw:12236 · soccerKitShow:12265 · soccerKitGo:12294 · emojiSprite:12347
makeAlien:12352 · startWave:12385 · waveSpawnFill:12396 · waveComplete:12405 · updateWaveHud:12415 · checkMechaBossBadge:12417
alienSpawnPos:12426 · removeAlien:12431 · mechaHudWord:12436 · setMechaHudSkin:12444 · mechaComboPop:12456 · mechaShielded:12461
mechaDamageFx:12463 · mechaHitByAlien:12468 · spawnAlienShot:12474 · removeAlienShot:12484 · tickAlienShots:12489 · spawnPowerup:12501
removePowerup:12514 · collectPowerup:12519 · tickPowerups:12526 · updateMechaHud:12535 · mechaTracer:12575 · mechaFire:12584
explodeAlien:12621 · tickMecha:12651 · loop:12707 · grabShot:12742 · savePhoto:12753 · clearEntities:12765
INTRO_KEY:12788 · introSeenObj:12789 · introSeen:12790 · markIntroSeen:12791 · INTRO:12792 · INTRO_MODE:12794
showIntro:12796 · HELI_KPP_BANNER:12822 · closeIntro:12824 · beginPlay:12830 · start:12832 · exitWorld:13064
mechaRecapLine:13134

## js/app-update.js (214 บรรทัด · 0 รายการ)

## js/arena3d.js (724 บรรทัด · 0 รายการ)

## js/assetaward.js (21 บรรทัด · 0 รายการ)

## js/auth.js (533 บรรทัด · 48 รายการ)
AUTH_PUSH_MS:23 · AUTH_SDK_TIMEOUT_MS:24 · AUTH_CLOUD_SLOW_MS:25 · AUTH_CLOUD_TIMEOUT_MS:26 · ADMIN_NAME_EMAILS:30 · adminReservedNameKey:35
isReservedAdminName:40 · canUseReservedAdminName:44 · isAdmin:49 · checkProfileName:52 · TEACHER_EMAILS:61 · isTeacher:62
syncAdminAccess:66 · TESTER_EMAILS:80 · TESTER_COINS:81 · isTester:82 · RANK_EXCLUDED_TESTER_NAMES:88 · rankUserExcluded:89
testerBoost:95 · authSetStatus:128 · authLocalSaveSafe:145 · authShowLogin:148 · authGateOffline:152 · authSaveRef:159
authFetchCloud:160 · authWriteCloud:180 · authDeleteCloud:181 · authWriteProfileName:182 · authPushProfile:189 · authApplyProfileName:197
authEnsureProfileName:220 · authAskProfileName:238 · authEditProfileName:252 · authStart:264 · updateOfflinePill:296 · authEnterOffline:301
authLateSync:318 · authIsAppMode:338 · AUTH_REDIRECT_CODES:346 · authLoginClick:348 · authOnLogin:368 · authSyncOnLogin:394
authFreshStart:423 · authAskLink:432 · authEnterGame:482 · authPushSaveAwait:498 · authPushSave:505 · authLogout:510

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
- 2-18 city3d.js — 🏙️ VOCAB CITY: ล็อบบี้ 3D แบบเมืองลอยฟ้า (index.html = หน้าหลัก · รอบ 861 · สลับเป็นหน้าหลักรอบ 86
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

## js/f1_3d.js (4,693 บรรทัด · 334 รายการ)
### 🗂️ สารบัญโซน js/f1_3d.js (Read/Edit เฉพาะช่วง)
- 19-217 ⚙️ ค่าคงที่ (TUNE ZONE)
- 218-266 📦 สถานะโลก
- 267-351 🏁 รอบ 1219 — MULTIPLAYER SAFE-DISTANCE START GRID
- 352-525 🔊 F1 DYNAMIC ENGINE AUDIO — sample จริง + RPM/เกียร์เสมือน + synth fallback (รอบ 1106)
- 526-603 🖼️ texture: probe img/f1/*.jpg ก่อน → ไม่มีใช้ canvas วาดเอง
- 604-630 ✏️ sprite ตัวอักษร / ป้ายชื่อ (canvas → sprite)
- 631-708 🛣️ เส้นแทร็ก: F1_MAP.track (จุดจริง OSM) → sample ทุก 5 ม.
- 709-927 🌌🪽 รอบ 1217 — FANTASY MAIN-LINE AIR ROUTES (GPU COOL)
- 928-1061 🏗️ สร้างฉาก: แทร็ก + kerb + runoff + อาคารจริง + ไฟ + ทะเลทราย
- 1062-1139 🏟️ PREMIUM MODULAR CIRCUIT ARCHITECTURE — รอบ 1203
- 1140-1693 ✨ F1 REALISTIC CIRCUIT — ฉากสนามมืออาชีพเฉพาะ Realistic Mode (รอบ 1125)
- 1694-1791 🏎️ โมเดลรถ: GLB ผู้ใช้ (img/models/f1_car.glb) → ไม่มี = ประกอบเอง
- 1792-2003 🏎️📱 รอบ 1210 — SEMI-REALISTIC LOW-POLY PEER F1 (GPU COOL)
- 2004-2334 🖥️ DOM + CSS (เต็มจอ ไม่มีกรอบเครื่องเกม)
- 2335-2601 ✨ PREMIUM RACE HUD — รอบ 1203 · brushed metal + glass + neon accent
- 2602-2751 🌍 สร้างโลกครั้งเดียว
- 2752-2926 🪽 รอบ 904: DRS — ปีกหลังเปิดบนทางตรง (ตามรถเพื่อนใกล้ 25 ม.)
- 2927-2938 🏁 ฟิสิกส์ + จับเวลา
- 2939-3311 🌀 PORTAL DESTINATION PREVIEW — actual target curve / Canvas2D (รอบ 1222)
- 3312-3402 🏆 รอบ 903: กระดานอันดับ Best Lap ออนไลน์ (/f1Rank)
- 3403-3571 🚦👻 รอบ 902: ลำดับออกสตาร์ท (ไฟแดง 5 ดวง) + รถเงาวิ่งตาม Best Lap
- 3572-3624 🚧 เลนพิท — ผิวทางเต็มกริป + ลิมิตเตอร์ 80 กม./ชม.
- 3625-3720 🔤 คำศัพท์บนแทร็ก (แบบเดียวกับโลกมอเตอร์ไซค์ — REWARD สูงกว่า)
- 3721-3970 🧑‍🤝‍🧑 เพื่อนร่วมสนาม (NetRoom map 'f1')
- 3971-4118 📷 กล้องไล่หลัง + ลูปเกม
- 4119-4251 🔢 รอบ 916 — จอบนพวงมาลัยเป็น "ของจริง"
- 4252-4423 🚥 รอบ 918: แถบไฟ LED รอบเครื่องบนพวงมาลัย (เขียว → เหลือง → แดง ตอนใกล้เปลี่ยนเกียร์)
- 4424-4693 🚪 เข้า/ออกโลก
### รายการ js/f1_3d.js
REWARD:22 · LETTER_COIN:23 · COLLECT_R:24 · DONE_KEY:25 · RECENT_KEY:26 · HALF_W:27
KERB_W:28 · RUNOFF_W:29 · BARRIER_LAT:30 · BARRIER_BOUNCE:31 · CAR_HIT_PARTS:35 · CAR_HIT_RADIUS:44
CAR_RESTITUTION:45 · CAR_SIDE_FRICTION:46 · CAR_RUB_DRAG:47 · CAR_SEP_EPS:48 · SAMPLE_M:49 · FP_EYE:51
FP_FWD:52 · FP_LOOK:53 · FP_DROP:54 · FP_FOV:55 · RFP_EYE:57 · RFP_FWD:58
RFP_LOOK:59 · RFP_DROP:60 · RFP_FOV:61 · ROAD_EYE:64 · ROAD_DROP:65 · ROAD_FOV:66
REV_A:68 · REV_MAX:69 · OFFTRACK_S:70 · FPW_F:71 · FPW_S:72 · FPW_R:73
FPW_H:74 · RFPW_F:77 · RFPW_S:78 · RFPW_H:79 · RFPW_SCALE:80 · WHEEL_HUB_X:82
WHEEL_HUB_Y:83 · WHEEL_RATIO:84 · WHEEL_MAX_DEG:85 · QUALITY_HAND_MAX_DEG:86 · LED_GREEN_N:90 · LED_AMBER_N:91
LED_SHIFT_R:92 · LED_FLASH_HZ:94 · LED_K_LO:95 · LED_K_SPAN:96 · LED_RPM_LERP:97 · F1_LEDS:98
WHEEL_IMG_W:107 · DASH_PX:108 · QUALITY_PLATE_W:112 · QUALITY_DASH_SCALE:113 · QUALITY_DASH_POSE:114 · DASH_LED_N:119
DASH_RPM_MIN:120 · DASH_RPM_MAX:121 · SHAKE_KERB_AMP:123 · SHAKE_SAND_AMP:124 · SHAKE_SPD_REF:125 · SHAKE_HZ:126
WHEEL_SHAKE_KERB_PX:128 · WHEEL_SHAKE_SAND_PX:129 · PWR_A:131 · ACC_CAP:132 · DRAG_K:133 · ROLL_A:134
BRAKE_A:135 · BRAKE_DF:136 · COAST_A:139 · COAST_STOP:140 · GRIP_BASE:141 · GRIP_DF:142
GRIP_CAP:143 · STEER_MAX:145 · STEER_HI:146 · SURF_RUNOFF:147 · SURF_SAND:148 · JUMP_GRAVITY:150
JUMP_LANE_LAT:151 · JUMP_ENTRY_M:152 · JUMP_RISE_M:153 · JUMP_GAP_M:154 · JUMP_LAND_M:155 · JUMP_EXIT_M:156
JUMP_RECOVER_M:157 · JUMP_HEIGHT:158 · JUMP_LAND_H:159 · JUMP_MAX_PITCH:160 · RAMP_ROLL_TRACK:161 · RAMP_ROLL_MAX:162
RAMP_ROLL_EDGE:163 · RAMP_ROLL_RESPONSE:164 · RAMP_ROLL_RETURN:165 · JUMP_PEER_Y_SEP:166 · JUMP_FRACTIONS:167 · JUMP_COLORS:168
NET_SEND_MS:169 · ROOM_MAX:170 · CHAT_MS:171 · CHAT_PRESETS:172 · F1_ROLL_WIRE:175 · CAR_COLOR_KEY:178
F1_COLOR_WIRE:181 · CAR_STYLES:182 · COCKPIT_ASSETS:189 · PEER_COLORS:196 · GRID_N:197 · GRID_FRONT_M:199
GRID_GAP_M:200 · GRID_SIDE_M:201 · GRID_SAFE_M:202 · F1_GRID_WIRE:203 · LIGHT_LEAD_S:205 · LIGHT_STEP_S:206
LIGHT_HOLD_MIN:207 · LIGHT_HOLD_MAX:208 · JUMP_PENALTY_S:209 · GHOST_HZ:211 · GHOST_MAX:212 · GHOST_KEY:213
PIT_HALF_W:214 · SURF_PIT:215 · PIT_LIMIT:216 · LINE:242 · JUMPS:243 · PITL:257
gridPose:270 · startGridUid:282 · startGridUids:286 · startGridSlotFor:289 · gridFormationActive:294 · gridSlotClear:295
safeStartGridSlot:306 · placeAtGridSlot:312 · settleStartGrid:321 · packetGridSlot:328 · packetBodyRoll:334 · storedCarStyle:343
saveCarStyle:346 · cockpitAsset:347 · GEARS:523 · gearOf:524 · matLam:533 · matLit:539
applyTex:544 · texFromCanvas:548 · texProbe:556 · asphaltTex:567 · kerbTex:582 · sandTex:588
adTex:597 · letterTexture:607 · makeTextSprite:617 · cr:635 · buildLine:639 · nearIdx:678
jumpDeltaD:714 · jumpHalfAtD:717 · jumpPhaseAtD:725 · jumpHeightAtD:734 · jumpPitchAtD:747 · jumpProbeAtSample:759
jumpProbe:769 · jumpWheelGround:777 · jumpTerrainRoll:788 · chooseJumpStart:794 · prepareFantasyJumps:814 · jumpPose:828
fantasyRampGeometry:833 · buildFantasyCircuit:856 · surfAt:913 · ribbonGeo:931 · kerbStrips:952 · extrudeFootprint:987
polyCentroid:998 · pointInFootprint:1002 · footprintCrossesRoad:1011 · footprintFrame:1019 · premiumMats:1034 · instancedParts:1050
localPart:1059 · buildBuildings:1066 · chooseRealisticTier:1145 · isThermalMobile:1152 · useRacingSky:1156 · seededRand:1168
realisticAsphaltMaps:1172 · realisticRunoffTex:1218 · realisticSandTex:1234 · racingLineRibbonGeo:1252 · linePose:1263 · tracksideSpotClear:1271
instancedFromSpots:1275 · buildRealisticCircuit:1281 · buildTrackScene:1552 · glbEnsure:1697 · buildF1Car:1711 · addPlayerContactShadow:1784
peerF1MergedGeometry:1798 · peerF1LoftGeometry:1816 · peerF1CombineGeometry:1843 · peerF1KitGet:1856 · buildPeerF1Car:1919 · makeCar:1947
replacePlayerCar:1970 · paintPlayerStyle:1985 · primePlayerCockpit:2000 · CSS:2007 · buildDom:2395 · build:2605
mapBounds:2718 · mapXY:2726 · drawMap:2729 · DRS_ZONES_N:2760 · DRS_CURV:2761 · DRS_GAP_MAX:2762
DRS_MIN_M:2763 · DRS_ENTRY_M:2764 · DRS_NEAR_M:2765 · DRS_DRAG_K:2766 · DRS_FLAP_SHUT:2768 · DRS_FLAP_OPEN:2769
attachDrsGlow:2774 · findDrsZones:2784 · DRS_DET_M:2815 · DRS_SIGN_KIND:2816 · drsDetIdx:2823 · drsSignTex:2827
buildDrsBoards:2839 · drsZoneAt:2881 · drsPeerGap:2890 · drsTick:2903 · drsHud:2918 · respawnOnTrack:2931
drawPortalDestination:2942 · beginPortalReturn:2966 · portalTick:2977 · barrierBounce:2999 · carPartContact:3016 · carContact:3038
resolvePeerCars:3048 · landFromJump:3085 · jumpPhysicsTick:3095 · physTick:3133 · progressTick:3239 · fmtLap:3284
puffSmoke:3290 · smokeTick:3301 · FR_READ:3320 · frSubmit:3322 · frMerge:3339 · frFetch:3351
frRowHTML:3369 · frBodyHTML:3378 · frNote:3387 · frMount:3392 · setStartLights:3412 · resetLights:3417
beginLights:3425 · lightsLocked:3426 · paintLights:3427 · lightsTick:3437 · ghostEnsure:3486 · ghostHide:3503
ghostLoad:3508 · ghostSave:3517 · ghostReset:3520 · ghostRecord:3524 · ghostKeep:3533 · ghostGapAt:3540
ghostTick:3548 · buildPitLine:3577 · pitAt:3608 · inPitLane:3619 · racingLineLat:3628 · trackPointAhead:3636
pickWord:3644 · spawnLetters:3659 · renderWordHud:3673 · collectTick:3679 · completeWord:3700 · relocTick:3717
netReady:3724 · netJoin:3729 · netSend:3742 · sendChat:3758 · peerColorIndex:3765 · packetCarColorIndex:3770
peerColor:3780 · buildPeer:3783 · onPeer:3817 · showPeerBubble:3850 · removePeerBubble:3857 · dropPeer:3863
peerTick:3883 · netLeave:3913 · layoutBoard:3919 · renderBoard:3938 · CAM_MODES:3976 · CAM_NEXT_LABEL:3977
cycleCamMode:3978 · applyCamMode:3982 · buildFpWheels:3993 · fpWheelTick:4025 · cockpitBox:4041 · layoutWheel:4063
wheelTick:4085 · DASH_FONT:4125 · positionQualityDash:4127 · layoutDash:4143 · dashRR:4168 · dashRpmTick:4175
dashTick:4185 · drawDash:4200 · buildLeds:4257 · ledsOff:4265 · ledTick:4269 · camTick:4296
hudTick:4347 · applyThermalPixelRatio:4357 · thermalGovernorTick:4363 · thermalRenderDue:4375 · frame:4385 · tick:4408
fit:4415 · applyEnvironmentProfile:4427 · start:4472 · exitWorld:4542

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

## js/hauntedhotel.js (621 บรรทัด · 0 รายการ)

## js/hauntedhoteldirector.js (321 บรรทัด · 0 รายการ)

## js/hauntedhotelghost.js (239 บรรทัด · 0 รายการ)

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

## js/images.js (229 บรรทัด · 25 รายการ)
IMG_FILES:11 · MOODS:12 · COLLECTIBLES_IMG_V:16 · GIFTS_IMG_V:17 · startImgKey:19 · petImageKeys:21
probeImages:33 · probeRankImages:45 · probeCollectImages:46 · probeGiftImages:47 · probeHomeImages:48 · CLIP_FILES:57
CLIP_SM:63 · clipCanWebm:79 · CLIP_ASSET_V:90 · clipFileFor:92 · petClipKey:101 · petClipUrl:110
equippedItem:123 · petStateImg:134 · petWearOverlay:155 · wearLayerHTML:186 · happyNow:193 · makeHappy:194
currentPetImg:207

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

## js/lettercannon.js (244 บรรทัด · 0 รายการ)

## js/lobby.js (52 บรรทัด · 3 รายการ)
PANEL_TITLES:9 · openPanel:19 · closePanel:29

## js/lobby3d.js (810 บรรทัด · 0 รายการ)

## js/main.js (523 บรรทัด · 9 รายการ)
settingsButtonClick:102 · syncMusicBtn:118 · showPetShoppingGrantNotice:152 · showRankRewardNotice:189 · showQuizBackPay:239 · showGiantRefund:284
showTicketRefund:325 · fitQbp:366 · bootGame:380

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

## js/onetpromo.js (210 บรรทัด · 0 รายการ)

## js/online.js (2,177 บรรทัด · 116 รายการ)
### 🗂️ สารบัญโซน js/online.js (Read/Edit เฉพาะช่วง)
- 2-235 ENGINE: ระบบออนไลน์จริงผ่าน Firebase Realtime Database
- 236-331 ระบบเพื่อน (ข้อ 0.3): รหัสเพื่อน + ค้นหา + ส่ง/รับคำขอ
- 332-521 ระบบแชทกับเพื่อน (ข้อ 0.4)
- 522-693 ระบบส่งของขวัญ (ข้อ 0.5)
- 694-907 🏪 ตลาดออนไลน์จริง (item 2 backlog): ซื้อ-ขายสินค้าที่เพื่อน "ผลิตเอง" ข้ามผู้เล่น
- 908-984 คำเชิญเล่นโลก 3D ด้วยกัน — /tinv/<toUid>/<fromUid> = {map,n,ts}
- 985-1181 📰 Follow + Feed กิจกรรม (รอบ 155) · 🌍 หน้า Feed ทุกคน + ไลก์/คอมเมนต์ (รอบ 639)
- 1182-1189 🌍 หน้า Feed ทุกคน + ไลก์/คอมเมนต์ (รอบ 639)
- 1190-1332 📰 รอบ 701 — ฟีดล็อบบี้ทีละโพสต์ + รีแอ็กชัน + แจ้งเตือน (ต่อยอดรอบ 639)
- 1333-1565 🔔📥 รอบ 976 — เก็บแจ้งเตือนไลก์/คอมเมนต์ลง DB โซนใหม่ /gnotif/<uid>
- 1566-2177 📞 โทรหาเพื่อน — Voice call / Video call แบบ LINE (รอบ 625 · กลุ่ม 3 คนรอบ 631)
### รายการ js/online.js
ONLINE_STALE_MS:75 · ONLINE_BEAT_MS:76 · LEADERBOARD_SIZE:77 · LEADERBOARD_QUERY_SIZE:78 · onlineDisplayName:82 · onlineActivity:90
ensureOnlineId:110 · onlineKey:120 · onlinePushPresence:125 · onlinePushScore:135 · fetchPlayerStats:186 · onlineRerender:208
notifyFriendBadges:220 · FRIEND_ALPHA:246 · friendCode:247 · friendSearch:259 · friendRequest:283 · friendAccept:294
friendDecline:306 · friendsHeal:316 · CHAT_MAX_LEN:340 · CHAT_KEEP:341 · chatPairId:343 · chatRef:346
chatListen:352 · chatSend:368 · chatDeleteMsg:384 · TYPING_TTL:392 · typingRef:394 · chatSetTyping:395
chatClearTyping:405 · chatWatchTyping:413 · chatThemeRef:431 · chatSetTheme:432 · chatWatchTheme:437 · chatPrune:445
chatSeenTs:462 · chatMarkSeen:468 · chatUnreadCount:480 · chatWatchSync:483 · GIFT_EXPIRE_MS:533 · giftSend:536
greetSend:554 · giftAccept:568 · giftDecline:572 · giftInWatch:578 · giftReclaim:609 · giftOutWatchSync:619
giftOutRebuild:674 · salesWatch:704 · salesRerender:712 · sellInc:716 · marketRequestId:727 · marketRememberTx:733
marketTxHasRole:743 · marketResolveMissingListing:749 · marketVerifyOwnListings:783 · marketWatch:801 · marketList:836 · marketUnlist:844
marketBuy:852 · marketSoldWatch:877 · tinvSend:913 · tinvClear:920 · tinvPartyTick:928 · TINV_WORLD_LABEL:950
tinvFingerprint:954 · tinvWatch:957 · FEED_MAX:993 · feedEvent:996 · feedPrune:1008 · feedPurgeCat:1019
feedPushAssets:1030 · petDescriptor:1048 · feedPushPets:1054 · fetchPlayerPets:1068 · followSet:1084 · followUnset:1095
feedRebuild:1102 · feedWatchSync:1114 · fetchPlayerFeed:1141 · fetchPlayerAssets:1154 · fetchFollowers:1173 · GFEED_READ:1199
GFEED_KEEP_ME:1200 · gfeedPush:1203 · gfeedPrune:1217 · gfeedParse:1230 · gfeedWatchStart:1259 · gfeedWatchStop:1286
gfeedNotifDiff:1294 · gfeedNotifPush:1329 · GNOTIF_KEEP:1357 · GNOTIF_QUIET:1359 · gnotifKeyOf:1362 · gnotifSend:1369
gnotifAdd:1382 · gnotifRecount:1402 · gnotifMarkSeen:1407 · gnotifWatchStart:1418 · gnotifListen:1427 · gnotifWatchStop:1445
gnotifPrune:1450 · uidDisplayName:1463 · gfeedRebuild:1474 · gfeedToggleLike:1491 · gfeedSetReaction:1496 · gfeedToggleCommentLike:1512
gnotifTellComment:1530 · gfeedAddComment:1542 · CALL_RTC_CFG:1590 · CALL_RING_MS:1591 · CALL_MAX_MS:1592 · CALL_MAX_PEERS:1593
onlineStart:2009 · onlineLoadSDK:2151

## js/onlinecoinaward.js (22 บรรทัด · 0 รายการ)

## js/petbehavior.js (187 บรรทัด · 0 รายการ)

## js/petpantry.js (88 บรรทัด · 0 รายการ)

## js/petshopping3d.js (581 บรรทัด · 0 รายการ)

## js/photo.js (361 บรรทัด · 25 รายการ)
PHOTO_LS_KEY:12 · PHOTO_MAX:13 · PHOTO_PREFIX:14 · PHOTO_SIZES:15 · PHOTO_QS:16 · PHOTO_ZMAX:17
photoValid:25 · photoOnline:28 · photoGet:31 · photoHas:32 · photoIsMine:33 · photoOf:36
photoFetch:44 · photoAfterChange:61 · photoPush:65 · photoVerify:83 · photoSaveUrl:93 · photoRemove:99
photoPullMine:106 · photoBlkSrc:122 · photoMiniHTML:129 · openPhotoMenu:137 · photoLoadImgEl:203 · photoLoadFile:211
openPhotoCrop:224

## js/picdict.js (412 บรรทัด · 0 รายการ)

## js/picmatch.js (658 บรรทัด · 0 รายการ)

## js/picquiz_online.js (608 บรรทัด · 0 รายการ)

## js/pmaward.js (28 บรรทัด · 0 รายการ)

## js/rankgraph.js (147 บรรทัด · 0 รายการ)

## js/sgaward.js (28 บรรทัด · 0 รายการ)

## js/shootword.js (1,086 บรรทัด · 0 รายการ)

## js/skyplay3d.js (328 บรรทัด · 0 รายการ)

## js/state.js (1,353 บรรทัด · 96 รายการ)
### 🗂️ สารบัญโซน js/state.js (Read/Edit เฉพาะช่วง)
- 2-234 STATE + LocalStorage + กติกากลางของเกม
- 235-291 🗄️🐾 ระบบชั้นอาหาร + เงินช่วยปรับตัว
- 292-757 👍 รอบ 701: รีแอ็กชันฟีด (กดค้างปุ่มถูกใจแล้วเลือกได้เหมือน Facebook)
- 758-813 Daily Quest (item 3 backlog): ภารกิจรายวัน 3 อย่าง สุ่มตามวันที่
- 814-924 มูลค่าทรัพย์สินสุทธิ (net worth) — ฐานของระบบแรงค์
- 925-974 🚫🍽️ สัตว์ป่วยเพราะหิว = ซื้อของกินไม่ได้ (รอบ 952)
- 975-1068 เครื่องยนต์บิลรายเดือน (กลาง — ค่าบำรุงบ้านตอนนี้ / ค่าไฟ-น้ำ-เน็ต เสียบเพิ่มได้)
- 1069-1193 🍖 เงินค่าอาหารสัตว์รายเดือน — ทุกวันที่ 1 ของเดือน จ่ายตามจำนวนสัตว์ที่เลี้ยงอยู่
- 1194-1353 โรงงานผลิตสินค้า: จ่ายค่าผลิตด้วย "แต้มคำศัพท์"
### รายการ js/state.js
STORAGE_KEY:6 · QUIZ_PASS_REWARD:11 · CURE_COST:13 · HUNGRY_SICK_MS:14 · MEAL_HOUR:16 · MEAL_FULL:17
SLEEP_FROM_HOUR:18 · SLEEP_SICK_HOUR:19 · WAKE_HOUR:20 · DINNER_COST:21 · TOXIN_FULL:23 · DETOX_COST:24
FOODQUIZ_Q:26 · FOODQUIZ_COIN:27 · FOODQUIZ_BONUS:28 · FOODQUIZ_MAX_PLAYS:29 · SHAPE_JUNK_MEALS:31 · SHAPE_CLEAN_MEALS:32
SHAPE_MISS_MEALS:33 · SHAPE_EXP_BONUS:34 · HEAT_SICK_MS:35 · THIRST_SICK_MS:36 · DEFAULT_STATE:38 · migratePetShoppingState:240
FEED_CATS:284 · FEED_REACTIONS:298 · feedRx:306 · FEED_QUICK_CM:308 · SLOT_MS:320 · currentSlotStart:321
nextSlotStart:327 · mealDayKey:329 · nightKeyOf:331 · isNightNow:339 · newPet:344 · loadState:369
saveState:715 · activePet:725 · petStage:726 · isAdult:731 · abilityOn:732 · hasPetType:733
todayStr:736 · dailyTick:740 · addCoins:743 · QUEST_POOL:763 · QUEST_PER_DAY:772 · questsToday:773
questTick:780 · questEvent:784 · assetValue:820 · netWorth:844 · assetCount:846 · grantRankPromotionRewards:864
refreshRank:894 · heatProtected:912 · rainProtected:916 · petHungry:919 · petCanEat:923 · hungerSickLock:931
hungerSickMsg:939 · petShapeOf:947 · updatePetShape:953 · shapeMealDone:960 · heatPct:970 · ymStr:979
billOutstanding:983 · UTILITIES:990 · HOME_UTILITIES:996 · homeDecayed:998 · billTick:1001 · PET_FOOD_PER_PET:1073
petFoodTick:1074 · myCar:1100 · carLoanDue:1105 · carLoanOverdue:1110 · carLoanPayable:1115 · carLoanPay:1122
compTick:1135 · ONLINE_RATE:1149 · onlineEarnActive:1150 · onlineEarnTick:1154 · onlineEarnFlush:1165 · marketTick:1175
addCraft:1199 · ORDER_MAX:1218 · ORDER_LIFE_MS:1219 · ORDER_GAP_MIN_MS:1220 · ORDER_GAP_SPAN_MS:1221 · ORDER_TIER_WEIGHT:1222
newOrder:1223 · orderTick:1236 · careTick:1244 · expNeed:1324 · addExp:1329 · addRP:1349

## js/thaitime.js (52 บรรทัด · 13 รายการ)
TH_TZ_MIN:22 · TH_DAY_MS:23 · thShift:28 · thMs:30 · thDate:31 · thHour:32
thHourF:33 · thDayKey:34 · thDayStart:35 · thAtHour:39 · thTs:40 · TH_TZ_OPT:45
thLocaleOpt:46

## js/tpaward.js (42 บรรทัด · 0 รายการ)

## js/typing.js (370 บรรทัด · 0 รายการ)

## js/ui.js (10,053 บรรทัด · 420 รายการ)
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
- 1467-1559 รอบ 153: เมนูลัดแตะแถวเพื่อนออนไลน์ในกล่อง aside
- 1560-1825 การ์ด Leaderboard — สลับแท็บในการ์ดเดียว (ประหยัดพื้นที่):
- 1826-2395 📈 ฟีดอันดับดีขึ้นบนหัวล็อบบี้
- 2396-2780 การ์ดข้อมูลผู้เล่น 👤 — คลิกชื่อในการ์ดเพื่อน/กระดาน แล้วโชว์
- 2781-3075 แผงเพื่อน 👥 (ข้อ 0.3): รหัสเพื่อน + ค้นหา + คำขอ + รายชื่อเพื่อน
- 3076-3171 🌍 เพื่อนอยู่โลก 3D ไหน + ปุ่ม "ตามเข้าไป" (รอบ 642)
- 3172-3210 แชทกับเพื่อน (ข้อ 0.4) — กล่องแชทลอยกลางจอ + แผง emoji
- 3211-3612 รอบ 179: หน้ารวมข้อความ (inbox แบบ Messenger — ธีมกระจกฟ้า sci-fi ของเกม)
- 3613-3973 ระบบส่งของขวัญ (ข้อ 0.5) — ห้องของขวัญ + กล่องเลือกส่ง + ฉากเปิด
- 3974-4066 RANK CARD + ฉากเลื่อนแรงค์
- 4067-4069 PET DASHBOARD
- 4070-4142 📰 รอบ 155: overlay ข้อมูลน้อง & การดูแล + ฟีดกิจกรรมเพื่อน
- 4143-4764 📰 รอบ 701 — ฟีดล็อบบี้ "ทีละโพสต์" แบบ Facebook (ผู้ใช้สั่ง 29 ก.ค. 2026)
- 4765-4959 🌍 รอบ 639: หน้า Feed เต็มจอ — ทุกคน (ไม่ใช่แค่ follow) + ไลก์/คอมเมนต์
- 4960-5644 📖 Dictionary ค้นหาคำศัพท์ (รอบ 254 ผู้ใช้สั่ง 16 ก.ค. 2026)
- 5645-5688 การนอน (คิว 7725691507 ข้อ 1)
- 5689-6131 ให้อาหาร (ระบบมื้อเย็น 18:00 + ความอิ่มสะสม — ข้อ 2+3)
- 6132-6250 🛡️ ควิซอาหารปลอดภัย (ต่อยอดข้อ 5.1)
- 6251-6358 🎀 ตู้เสื้อผ้าสัตว์เลี้ยง — ใช้สวมเฉพาะของที่ซื้อมาแล้ว
- 6359-6546 ที่พัก (หลบแดด/หลบฝน) + เครื่องปรับอากาศ
- 6547-6664 บิลสาธารณูปโภค (ค่าไฟ/ค่าน้ำ — เครื่องยนต์อยู่ใน state.js: UTILITIES/billTick)
- 6665-6747 การ์ดมือถือ (ข้อ 7): ซื้อ 10,000 ขายคืน 6,000
- 6748-6758 การ์ดคอมพิวเตอร์ (ข้อ 11): ซื้อ 50,000 ขายคืน 30,000
- 6759-6803 item 8: โบนัสออนไลน์ +0.01 เหรียญ/วิ ฟรีทุกคนที่เปิดเกมออนไลน์อยู่
- 6804-7064 💻 รอบ 706 (ผู้ใช้สั่ง 29 ก.ค. 2026): ช่องรายได้คอมพิวเตอร์บนแถบบนล็อบบี้
- 7065-7072 🌀🔤 รอบ 1045 — Vocab Arena (โลกผจญภัยฉบับใหม่)
- 7073-7528 ☁️📚 รอบ 1229 — Vocab Sky Playground
- 7529-7548 🌍 ปุ่มลัดเข้าโลก 3D ในรางเมนูซ้าย (ผู้ใช้สั่ง 9 ก.ค. 2026)
- 7549-7614 🔒 รอบ 1070/1132: โลกที่ยังไม่เปิดสาธารณะ — เปิดให้บัญชีทดสอบ 2 ชื่อเท่านั้น
- 7615-7787 ↩️🪙 รอบ 1143 — ธุรกรรมค่าเข้าเกม + คืนเงินเมื่อเกมเปิดไม่สำเร็จ
- 7788-7951 🧭 ป้ายบอกทางของรางเมนูซ้าย (รอบ 601 · ผู้ใช้สั่ง 26 ก.ค. 2026)
- 7952-8121 การ์ดสวนผลไม้ (ข้อ 12): ซื้อต้นไม้ปลูกได้ไม่จำกัด แต่ละต้นออกผล
- 8122-8131 โรงงานผลิตสินค้า 🏭 + ตลาดขายต่อ (แนวคิดใหม่ 5 ก.ค. 2026)
- 8132-8154 โรงงานผลิต (แผง 🏭) — แยกออกจากตลาด (ผู้ใช้สั่ง 6 ก.ค. 2026)
- 8155-8422 ตลาดขายสินค้า (แผง 🏪) — แยกออกจากโรงงาน
- 8423-9410 🚗 รอบ 131: หมวดยานพาหนะ — โชว์รูมรถ 10 คัน (แคตตาล็อก 5 ช่อง/แถว)
- 9411-9471 ร้านสัตว์เลี้ยง (ซื้อเพิ่มได้ ไม่ลบตัวเดิม)
- 9472-9508 เลเวลอัพ (รายตัว)
- 9509-9614 สถิติผลการเรียนรู้
- 9615-9652 item 4: การ์ดสรุปส่งครู — ใบเดียวจบ ชื่อ/วัน-เวลา/เหรียญวันนี้/แรงค์/สอบล่าสุด
- 9653-10053 📞 หน้าจอโทรหาเพื่อน — สายเสียง (รอบ 625 · กลุ่ม 3 คน + ปิดวิดีโอ รอบ 631)
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
drawOnlineTicker:1356 · renderOnlineCard:1364 · bindInviteCards:1474 · bindFriendQuickMenu:1494 · openFriendQuickMenu:1504 · LB_TABS:1567
LB_ASSET_TOP:1568 · LB_ONLINE_TOP:1569 · LB_WS_TOP:1570 · LB_PM_TOP:1571 · LB_TP_TOP:1572 · LB_TP_DISPLAY:1573
LB_BB_TOP:1574 · LB_SG_TOP:1575 · bindLbTabs:1577 · updateRankRailBadge:1638 · rankUpCheck:1657 · rankUpSound:1685
renderLeaderboardCard:1696 · bindLbGroupOpen:1729 · lbRankRows:1741 · RANK_MOVE_TOPICS:1832 · RANK_MOVE_MAX:1844 · RANK_MOVE_REWARD:1845
rankMoveFeedRender:1849 · rankMoveRewardCheck:1867 · showRankMoveRewardNotice:1886 · rankMoveFeedCheck:1924 · LB_BCAT_TOP:1956 · lbBadgeSections:1961
lbDemoRows:1987 · lbChar:2009 · lbfAwardBarHtml:2019 · openLeaderboardFull:2037 · BLK_PAD:2175 · BLK_PAD_NEW:2180
BLK_TOP_FIX:2181 · seatPodChars:2182 · lbOnlineCoinHtml:2194 · lbCoinHtml:2211 · lbBadgeHtml:2227 · lbBossHtml:2253
lbWordSearchHtml:2276 · lbTypingHtml:2312 · lbBubbleHtml:2344 · lbShootHtml:2366 · bindPlayerClicks:2401 · showPlayerCard:2411
bindProfileBadgeScroll:2692 · petDescImg:2710 · openImgLightbox:2723 · openPetPeek:2743 · updateBillBadges:2787 · setBadge:2797
tinvPendingCount:2813 · attentionPendingItems:2821 · attentionUnseenCount:2841 · attentionAcknowledge:2846 · updateSettingsBadge:2861 · attentionSummaryData:2877
openAttentionSummary:2905 · updateFriendBadge:2939 · renderFriendPanel:2949 · friendDoSearch:2997 · refreshFriendData:3021 · FRW_TTL_MS:3086
FRW_MIN_GAP:3087 · frwWorldOf:3091 · frwPanelOpen:3094 · frwScan:3099 · frwPaint:3121 · frwPaintHint:3142
frwFollow:3156 · CHAT_EMOJI_CATS:3177 · CHAT_THEMES:3199 · CHAT_SECRET_MS:3208 · chatBadgeSync:3216 · ibTimeStr:3224
IB_CALL_RE:3233 · ibCallInfo:3234 · openChatInbox:3239 · chatFitKeyboard:3409 · openChat:3425 · giftImg:3616
giftDateStr:3618 · GREETS:3626 · GREET_EXP:3634 · greetInfo:3635 · openGreetPicker:3639 · giftItemPic:3683
foodGiftBlocked:3693 · giftItemName:3699 · updateGiftBadge:3705 · renderGiftPanel:3714 · acceptGift:3772 · declineGift:3795
showGreetReveal:3804 · showGiftReveal:3831 · openGiftPicker:3857 · confirmSendGift:3925 · doSendGift:3951 · rankBadgeHTML:3977
renderRankCard:3982 · renderRankTab:4016 · showRankUp:4044 · bindPetPlateButtons:4079 · openPetInfoOverlay:4112 · feedAgo:4135
FEED_DECK_MAX:4155 · FEED_SLIDE_MS:4156 · FEED_RESUME_MS:4157 · feedPostImgIndex:4162 · feedPostImg:4173 · feedPostByKey:4182
feedCanReact:4185 · fpStatsHTML:4190 · fpNameBadgesHTML:4206 · fpostHTML:4210 · renderFeedCard:4245 · feedDeckGo:4283
feedDeckTick:4303 · renderFeedBell:4325 · FNT_JUMP:4334 · fntGiftName:4340 · feedNotifText:4344 · feedNotifGo:4359
feedNotifArrived:4374 · openFeedNotif:4381 · closeRxPicker:4436 · openRxPicker:4440 · feedFlyWord:4460 · feedPickRx:4471
FCM_REP_SHOW:4486 · FCM_FOCUS_POST:4487 · openFeedComments:4489 · closeFeedComments:4511 · fcmRowHTML:4520 · showCommentLikers:4543
fcmTreeHTML:4565 · renderFeedComments:4590 · bindFeedPostEvents:4718 · openFeedBoard:4771 · renderFeedBoardLive:4792 · renderFeedBoard:4810
stageColLeft:4829 · alignPetTabs:4838 · alignFeedPlate:4850 · alignProfilePlate:4866 · COIN_K_MIN:4884 · alignCoinBlock:4885
alignStageLeft:4913 · laneModeOn:4925 · alignStageCols:4938 · watchStageCols:4952 · dictRecordLookup:4971 · DICT_FILE_COUNT:4982
loadDict:4983 · dictSearch:4998 · dictTapWords:5013 · dictEntryHTML:5017 · openDictOverlay:5028 · renderDashboard:5112
sleepBtnHTML:5650 · sleepHintHTML:5657 · sleepAllPets:5668 · wakeAllPets:5681 · feedPet:5692 · openFoodMenu:5719
feedWith:5813 · AVATAR_UI:5847 · playerAvatarHTML:5851 · SHAPE_UI:5859 · showFeedResult:5868 · curePet:5909
heartsFx:5939 · PAT_HOLD_MS:5962 · PAT_EXP:5963 · bindPetTap:5964 · petBounce:5982 · petMood:5988
shortPatPet:5995 · longPatPet:6003 · patCalendarHTML:6023 · patDayKey:6057 · patStreakNow:6061 · patStreakTick:6066
cureCelebrateFx:6091 · railCureClick:6102 · detoxPet:6114 · openFoodQuiz:6137 · closeDressUpBoard:6255 · dressItemRarity:6259
dressRarityLabel:6266 · dressSlotLabel:6269 · openDressUpBoard:6272 · renderShop:6299 · homeVisualHTML:6362 · showHomeRuined:6376
showCutNotice:6397 · renderHomeCard:6415 · payMaint:6499 · trashBillUI:6515 · payTrash:6532 · UTILITY_UI:6551
utilityBillUI:6600 · payUtility:6625 · buyUtilityFix:6651 · renderPhoneCard:6669 · buyPhone:6709 · sellPhone:6731
compLiveTotal:6752 · onlineLiveTotal:6763 · syncCoinHeader:6770 · flashPillGain:6775 · renderOnlineEarnPill:6784 · renderCompEarnPill:6809
openPillInfo:6842 · renderComputerCard:6925 · buyComputer:6960 · sellComputer:6983 · soldCount:7004 · soldBadge:7005
loadScriptOnce:7011 · advBusyMsg:7036 · advResetLoad:7048 · loadAdv3d:7054 · loadVocabArena3d:7070 · loadSkyPlayground3d:7077
enterSkyPlayground3D:7080 · enterAdventure3D:7096 · pickAdvMap:7119 · enterHaunted3D:7154 · enterHeli3D:7177 · pickHeliMap:7204
enterDrone3D:7240 · confirmPetShoppingEntry:7262 · enterPetShopping3D:7287 · enterDrive3D:7343 · pickDriveMap:7382 · enterMotoMapAsCar:7418
enterSoccer3D:7437 · enterMoto3D:7457 · enterF1_3D:7480 · enterInvasion3D:7508 · WORLD3D:7536 · WORLD3D_COMING_SOON:7553
world3DComingSoon:7554 · gotoRobotShop:7557 · openHealDialog:7563 · world3DFail:7584 · worldEntryStarted:7620 · worldEntryStopped:7621
GAME_ENTRY_STABLE_MS:7622 · gameEntryCommit:7624 · gameEntryRefund:7632 · recoverInterruptedGameEntry:7649 · showGameEntryRefundNotice:7657 · startWorldEntry:7684
railWorldClick:7728 · openWorldEntryDialog:7754 · railScrollHint:7793 · railScrollTop:7801 · initRailScroll:7806 · renderRailWorlds:7826
tinvNoticeHTML:7905 · openTinvPicker:7913 · fruitCountdown:7957 · renderFarmCard:7969 · renderFarmClock:8044 · buyFruit:8060
sellFruit:8080 · sellAllFruit:8101 · collectImg:8130 · renderFactoryCard:8136 · renderMarketCard:8159 · updateWishBadge:8215
openWishlistDialog:8226 · bindStripArrows:8271 · renderMarketBrowse:8285 · openMarketBuyDialog:8309 · carImg:8429 · renderVehicleShop:8430
CS_CYCLE_MS:8481 · carInteriorImg:8482 · carStatHtml:8484 · renderCarShowroom:8491 · csShowBig:8518 · csInit:8545
RS_CYCLE_MS:8568 · robotImg:8569 · renderRobotShop:8570 · rsShowBig:8592 · rsInit:8613 · buyRobot:8632
enterMecha3D:8657 · pickMechaRobot:8685 · pickDriveCar:8717 · openCarBuyDialog:8760 · buyCarInsurance:8821 · payCarLoanMonthly:8840
payCarLoanFull:8852 · carDriveBlock:8871 · gotoVehicleShop:8876 · gotoMyStock:8881 · showNeedCarDialog:8887 · craftDiscount:8899
renderFactory:8902 · renderOrdersUI:8971 · startProduce:8990 · buyCollectible:9018 · cancelProduce:9048 · deliverOrder:9062
renderOrderClock:9079 · renderCollectMine:9089 · openListDialog:9138 · cancelListing:9195 · buyMarketItem:9219 · showCollectReveal:9284
buyAC:9322 · openHomeShop:9341 · renderPetShop:9414 · showLevelUp:9475 · renderStats:9512 · showTeacherCard:9619
CALL_REACT_EMOS:9663 · CALL_TALK_MIN:9666 · CALL_TALK_HOLD:9667 · CALL_ORDER_GAP:9669 · CALL_TONES:9675 · startCall:10049

## js/util.js (1,340 บรรทัด · 53 รายการ)
### 🗂️ สารบัญโซน js/util.js (Read/Edit เฉพาะช่วง)
- 2-23 UTIL: เสียง / เอฟเฟกต์ / เครื่องมือทั่วไป
- 24-1309 🎖️ รอบ 643: สัญลักษณ์ระดับชั้น (ผู้ใช้สั่ง 28 ก.ค. 2026)
- 1310-1340 🖱️🚫 รอบ 833: กันกล่องดำ "To show your cursor, switch apps, reload the page…"
### รายการ js/util.js
shuffle:6 · fmtNum:15 · escapeHTML:19 · gradeSymbol:32 · gradeMark:47 · nameWithGrade:55
gradeMarkCanvas:61 · gradeOf:77 · seededRand:92 · fmtThaiDT:104 · fmtThaiDate:108 · IPHONE_LOBBY_VIEWPORT:118
fitIPhoneLobbyViewport:129 · showScreen:148 · TOAST_WARN_RE:165 · TOAST_FINANCIAL_RE:166 · TOAST_FINANCIAL_AMOUNT_RE:168 · restackToasts:175
clearWarnToasts:201 · toast:205 · toastLink:258 · floatFx:276 · beep:287 · soundStatus:308
PET_MOOD:424 · petVoiceSynth:431 · sirenSynth:508 · playCashier:532 · cashierSynth:546 · keyTapSynth:579
bubblePopSynth:617 · bubbleTapSynth:636 · playSpark:647 · sparkSynth:661 · thunderFx:696 · wordAudioFile:764
speakCutOff:773 · speakWord:777 · speakLetter:816 · pickSpeakVoice:839 · speakWordTTS:850 · askNameDialog:877
askConfirm:923 · alertBox:941 · applyNoAnim:961 · BLK_VOCAB:968 · openSettings:1016 · openHelp:1248
openTeacherGuide:1275 · TAPGLOW_SEL:1299 · TOUCH_INPUT_SEEN:1318 · mouseLockOK:1327 · lockMouse3D:1333

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

## css/bubble.css (60 บรรทัด · 25 selector)
#bb-overlay:4 · #bb-board:5,9,10,11 · .no-anim:12,49 · .bb-head:13 · .bb-title:14 · .bb-stat:15,16
.bb-score:17,18 · .bb-close:19,20 · .bb-snd:21,24 · .bb-snd-track:22 · .bb-snd-thumb:23 · .bb-prompt:25
.bb-star:26 · .bb-word:27,30 · .bb-ch:28,29 · .bb-thai:31 · .bb-hint:32 · .bb-stage:33
.bb-planet:34 · .bb-bubble:35,39,40,41(+4) · .bb-tools:50 · .bb-tool:51,52,53 · .bb-fx:54 · .bb-coinpop:55,56
.bb-empty:58

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

## css/lettercannon.css (48 บรรทัด · 28 selector)
#lc-game:6,7 · .lc-hud:8 · .lc-glass:9 · .lc-stats:10 · .lc-stat:11 · .lc-coin-stat:12
.lc-wordbox:13 · .lc-target:14 · .lc-meaning:15 · .lc-progress:16 · .lc-slot:17,18 · .lc-actions:20
.lc-iconbtn:21,22 · .lc-exitwide:23 · .lc-power:24 · .lc-power-name:25 · .lc-hint:26 · .lc-move:27,28
.lc-shoot:29,30 · .lc-modal:31,32 · .lc-count-exit:33 · .lc-card:34,35 · .lc-btn:36 · .lc-count:37
.lc-toast:39 · .lc-coinfx:41 · .lc-announce:43 · .lc-rotate:44

## css/lobby.css (6,130 บรรทัด · 827 selector)
:root:6,5847 · html:15 · body:21,5811,5853 · *:41,42,43,44 · #app:47 · h1:49
.subtitle:50 · .shop-title:51 · #rotate-overlay:54 · .screen:76 · #screen-select:85,86,87,88(+5) · .egg-need:95
.petshop-topright:97 · .petshop-play-link:98,103 · #screen-login:116,129,130,134(+12) · .login-lux:147 · .login-logo:148 · .login-tag:153
#screen-game:226,227,228,229(+7) · #screen-quiz:240,241,242,243(+6) · #quiz-choices:252,253 · .word-card:260 · .quiz-choice:261,262,263 · .big-btn:266,267,268,269
#screen-dashboard:274,1187,1195 · .lobby-top:288,923,924,925(+36) · .top-flex:289 · .profile-plate:290,294,844,4075(+12) · #rain-fx:299 · .rain-glass:303
.glass-drop:304 · .rain-vignette:323 · .no-anim:330,492,505,566(+64) · .rail-btn:333,945,951,953(+24) · .rail-badge:334 · .fr-code-box:339
.fr-code-label:343 · .fr-code-row:344 · .fr-code:345 · .fr-copy-btn:350,354,359,360 · .fr-search-btn:355 · .fr-add-btn:356
.fr-accept:357 · .fr-decline:358 · #fr-search-input:361 · #fr-search-result:365 · .fr-found:366 · .fr-hint:370
.fr-list-title:371 · .fr-row:372 · .fr-req:376 · .fr-row-name:378,382,5551 · .fr-row-status:386 · .fr-req-btns:387
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
.pl-card:800,2943 · .pl-close:806 · .pl-head:810,2700,2703 · .pl-grade:815,5557,5558 · .pl-body:816 · .pl-loading:817
.pl-none:818 · .pl-me-tag:819 · .pl-blk-wrap:821 · .pl-blk:822 · .pl-stat:823 · .pl-lbl:828
.pl-val:829,830 · .pl-tip:831 · .chip-edit:837,842,843 · .rank-mini:849,855,856,857 · .pass-photo:859,864 · .pet-tabs:866
.dict-box:867,871,872,873(+1) · .dict-card:879,884,888,889(+2) · .dict-head:885,886 · .dict-trail:893,897 · .dt-c:898,902,903 · .dt-sep:904
.dict-today:905 · .di-w:907,908,909 · .dict-list:910 · .dict-item:911,915,916,917(+5) · .lobby-mid:931 · .rail-wrap:934,979,990,991
.rail-scroll:936,973,977,978 · .lobby-rail:937,944 · .rail-nudge:980,988,989,992(+1) · .rail-worlds:999 · .rail-div:1000 · .lobby-stage:1047,1049,1065,1192(+13)
.newword-banner:1055,1062,1067,4905(+2) · .coin-fly:1078,1081 · .coin-plus:1087 · .nw-pop-coin:1102,1104,1105 · .nw-pop-goal:1108,1109,1113,1117 · .nw-goal-head:1110,1112,1114
.nw-goal-bar:1115 · .nw-goal-fill:1116 · .nw-pop-book:1118,1119 · .nw-tag:1140,4911,4933 · .nw-word:1145,4915,4938,5031 · .nw-hint:1147,1148,4916,4940(+1)
.nw-coin:1150,1153,4917,4921 · .nw-countdown:1158,4922 · .nw-bar:1160,4941 · .nw-bar-fill:1162 · .pet-stage:1165,3237 · .nw-box:1172,3246
.nw-pop-word:1173 · .nw-speak:1174 · .nw-pop-phon:1175 · .nw-ipa:1176 · .nw-pop-sent:1177 · .nw-pop-mean:1178
.pet-tab:1179,1180,1181,3695 · .stage-hero:1202,1217,1225,1370(+29) · .hero-ground:1239,1359,1365 · .hero-rank-bg:1241,1244,1247,1251(+18) · #lobby3d-canvas:1264,1265 · .hero-scene:1269,1271,1278,1279(+8)
.caretaker-fig:1318 · .caretaker-img:1321 · .caretaker-emoji:1323 · .blk-rig:1330,1331,1332 · .stage-plate:1392,1400,1411,1412(+23) · .plate-title:1406
.lobby-side:1439,1475,1480,1483(+22) · .side-sec:1442,2351,3590,4051 · .side-label:1443,1448 · .side-label-row:1451,1452 · .lb-tabs-out:1453,1454,1458 · .side-glass:1462,1469
.side-card:1481,1592 · #quest-card:1493,1494,1522,1523(+6) · .q-bigcard:1499,1528 · .qb-top:1501 · .qb-emoji:1502 · .qb-name:1504
.qb-bar:1505,1506 · .qb-row:1508 · .qb-prog:1509 · .qb-reward:1510 · .qb-go:1511,1515 · .q-dots:1516
.q-dot:1517,1518,1519 · .q-bonus:1520 · .inv-card:1539,1541,1542 · .inv-btns:1543 · .inv-go:1544,1546 · .inv-x:1547
#online-card:1551,3598,3599,3600(+7) · .fq-overlay:1552 · .fq-box:1554,3403 · .fq-head:1558,1560 · .fq-close:1561 · .fq-sec:1563
.fq-worlds:1564 · .fq-world:1565,1567 · .fq-acts:1568 · .fq-act:1569,1572,1573 · .lb-prize:1606 · .lb-coins:1609
.lbf-cell:1610,2782,2785,2786(+3) · .lb-award-bar:1612,1618,1619 · .lb-award-go:1620 · .lbf-award:1622,1628,1629,1630 · .pod-pz:1631 · .wsa-overlay:1634
.wsa-box:1636 · .wsa-head:1641 · .wsa-title:1642 · .wsa-when:1643,1644 · .wsa-close:1645,1648 · .wsa-cols:1649
.wsa-col:1650 · .wsa-sec-h:1651,1652 · .wsa-msg:1653 · .wsa-msg-h:1656 · .wsa-msg-b:1657,1658 · .wsa-msg-none:1659
.wsa-rules:1661,1662 · .wsa-list:1663 · .wsa-row:1664,1666 · .wsa-r:1667 · .wsa-n:1668 · .wsa-s:1669
.wsa-p:1670 · .wsa-prizes:1671 · .wsa-pz:1672,1675 · .wsa-reveal-medal:1676 · .lobby-bottom:1691,1694,1695,1697(+9) · .rail-onet:1710
.lobby-quiz-btn:1711 · .lobby-book-btn:1712,1713 · .lobby-play-btn:1715,1719 · .lobby-exam-btn:1721,1722,1724 · .panel-overlay:1729,1734,5046,5047(+8) · .panel-box:1735
.panel-head:1742,1746 · .panel-close:1747,1752 · .panel-body:1753,1757,1758 · .panel-page:1755,1756 · .collect-sub:1762 · .mkt-empty:1763
.craft-box:1764 · .mkt-listing:1765 · .mkt-filter:1766,2171 · .hq-grid:1773 · .hq-card:1774,1779,1803 · .hq-head:1780
.hq-pic:1786,1788 · .hq-emoji:1790 · .hq-badge:1791 · .hq-stars:1795 · .hq-price:1796,1801,1802,1805(+6) · .craft-credit:1809,1811,1812
.car-grid:1819,1821,1822 · .robot-weap:1823 · .dmap-box:1826,1827 · .dmap-grid:1833 · .dmap-card:1835,1838,1839,1840(+2) · .dmap-ico:1842
.dmap-new:1845 · .dcp-grid:1847 · .dcp-card:1849,1852,1853,1854(+10) · .levelup-box:1871,2095,2105,3200(+2) · .dcp-box:1874,1875,1879,1880(+6) · .dcp-lock:1888
.sold-badge:1892,1894,1895 · .rs-showroom:1897,5509,5510 · .rs-list:1898,1900,5490,5493 · .rs-thumb:1901,1903,1904,1905(+1) · .rs-thumb-pic:1906,1907 · .rs-thumb-price:1908
.rs-stage:1910 · .rs-big:1913 · .rs-big-img:1914 · .rs-elec:1918,1922,1927 · .rs-edge:1928,1934 · .rs-info:1937,1938,1939,1940(+1)
.rs-buy:1942,1944,1945 · .cs-showroom:1949,5482,5483,5511(+3) · .cs-list:1950,1952,5484,5489(+9) · .cs-thumb:1953,1955,1956,1957(+1) · .cs-thumb-pic:1958,1959 · .cs-thumb-name:1960
.cs-thumb-price:1961 · .cs-thumb-own:1962 · .cs-stage:1964 · .cs-big:1967 · .cs-big-img:1968 · .cs-elec:1972,1976,1980
.cs-edge:1981,1987 · .cs-interior:1990 · .cs-inr-label:1991,1992 · .cs-inr-img:1993 · .cs-info:1995,1996,1997,1998(+6) · .cs-buy:2006,2008,2009,2010
.car-emoji:2012 · .car-mine:2018 · .car-mine-pic:2023 · .car-mine-info:2024 · .car-loan:2025,2026 · .car-mine-btns:2027,2028,2029
.car-locked:2031 · .car-mine-head:2033 · .car-pick-list:2034,2035 · .car-pick:2036,2038,2039 · .car-pick-pic:2040,2041 · .car-pick-name:2042,2043
.car-pick-od:2044 · .car-buy-box:2046,3407 · .cb-pic:2047,2048,2049 · .cb-lines:2050 · .cb-li:2051,2055,2056 · .cb-ins:2057,2061,2062
.cb-plan:2063 · .cb-pl:2064,2069,2071,2075(+1) · .cb-total:2082 · .cb-btns:2083,2088 · .cb-x:2084 · .dress-overlay:2091,2108,2111,2115
.dress-title:2109,2110,2112 · .dress-wallet:2113 · #shop-grid-wrap:2117 · .shop-grid:2118 · .shop-item:2119,2127,2128,2129(+13) · .it-topline:2135
.it-rarity:2136,2137 · .it-type:2138 · .it-art-stage:2139 · .it-art:2141 · .it-emoji:2142 · .it-sparkle:2143
.it-action:2147 · .mkt-tab:2172,2173 · .pg-btn:2174,2175,2176 · .pg-dot:2177 · .fr-gift-btn:2211,2216 · .gift-sec-title:2219
.gift-in-row:2221 · .gift-out-row:2225 · .gift-in-pic:2226,2228,2229 · .gift-in-info:2230,2231 · .gift-in-btns:2232 · .gift-accept:2233,2237,2239
.gift-decline:2238 · .gift-box-card:2240 · .gift-box-from:2241,2242 · .gift-note:2243 · .gift-pick-overlay:2246 · .gift-pick-box:2250
.gift-pick-head:2256,2260 · .gift-pick-close:2261 · .gift-pick-tabs:2263 · .gp-tab:2264,2268 · .gift-pick-body:2269 · .gp-chips:2270
.gp-chip:2271,2275 · .gp-card:2276,2277 · .gp-price:2278 · .gp-note:2279 · .gift-cf-pic:2280 · .chat-emoji-cats:2285
.chat-emoji-cat:2289,2293,2294 · .chat-emoji-wrap:2295,2296 · .stage-left:2305,5037 · .pet-info-btn:2309,2316,2317 · .feed-list:2324,2328,2353,2354(+1) · .feed-empty:2329,2332
.fd-tools:2338 · .feed-bell:2339,2341,2342,2343 · .fd-prog:2347,2348 · .fpost:2355,3082 · .fp-head:2360 · .fp-who:2361
.fp-name-line:2364 · .fp-name:2365 · .fp-when:2366 · .fp-badges:2368,2371 · .fp-badge-ic:2369 · .fp-text:2373
.fp-media:2376 · .fp-img:2378 · .fp-cap:2380 · .fp-big:2381 · .fp-sum:2383,2385 · .fp-sum-rx:2386
.fp-sum-none:2387 · .fp-en:2388 · .fp-bar:2390 · .fp-act:2391,2395,2397 · .fp-like:2396 · .fp-page:2408,2409,2410,2411(+3)
.fp-rxbox:2414 · .fp-rxb:2418,2420,2421,2422(+1) · .fp-rxb-off:2424 · .fp-fly:2426,2429,2430 · .fcm-overlay:2433 · .fcm-box:2435
.fcm-post:2439,2440 · .fcm-rxs:2441 · .fcm-rx:2442 · .fcm-list:2443,2445 · .fcm-row:2446,2447,2448 · .fcm-none:2449
.fcm-item:2451 · .fcm-reps:2452 · .fcm-rep:2454 · .fcm-more:2456,2458 · .fcm-arrow:2459 · .fcm-reply:2460,2462
.fcm-like:2464,2467,2468,2469 · .fcm-likeic:2470 · .fcm-cnt:2472,2474 · .fcm-likers-box:2475 · .fcm-likers-list:2476,2478 · .fcm-liker-row:2479
.fcm-liker-none:2480 · .fcm-repbar:2481,2484 · .fcm-repx:2485 · .fcm-note:2487 · .fcm-quick:2489,2491 · .fcm-q:2492,2495,2496
.fcm-add:2497 · .fcm-input:2498,2500 · .fcm-send:2501,2503 · .fcm-locked:2504 · .fnt-overlay:2506 · .fnt-box:2508
.fnt-list:2512,2514 · .fnt-row:2515,2517,2530 · .fnt-ico:2518 · .fnt-tx:2519,2520 · .fnt-sub:2521 · .fnt-hint:2523
.fnt-go:2524,2527,2528,2536 · .fnt-tag:2531 · .fnt-note:2533 · .fcm-hl:2538 · .feed-plate:2546 · .feed-all-btn:2547,2552
.fdb-overlay:2557 · .fdb-box:2559 · .fdb-head:2563 · .fdb-close:2567,2569 · .fdb-live:2570 · .fdb-live-title:2571
.fdb-live-rows:2573,2575,2576 · .fdb-live-row:2577,2579,2580,2581 · .fdb-dot:2582 · .fdb-list:2584,2585 · .fdb-empty:2586 · .fdb-row:2587
.fdb-row-top:2589 · .fdb-ico:2590 · .fdb-txt:2591 · .fdb-name:2592 · .fdb-ago:2593 · .fdb-actions:2594
.fdb-like:2595,2598,2599,2600 · .fdb-cm-list:2601 · .fdb-cm-row:2602,2604 · .fdb-cm-empty:2605 · .fdb-cm-add:2606 · .fdb-cm-input:2607,2609
.fdb-cm-send:2610,2612 · .fdb-cm-locked:2613 · .pi-overlay:2616 · .pi-box:2620,2625,2626,2630(+3) · .pi-close:2632,2637,2638 · .pi-close-left:2640
.pi-portrait:2642 · .pet-wear:2649,2652,2654 · .pi-portrait-wrap:2657,2659 · .pi-dress-btn:2667,2671,2672 · .pi-shape-cap:2673,2676,2677,2678 · .pi-shape-toggle-btn:2680,2683
.pi-dress-pip:2685,2690,2691,2692(+1) · .pi-wear-note:2695,2697 · .greet-card:2704 · .greet-sub:2705 · .greet-grid:2706 · .greet-opt:2707,2710,2711,2712
.greet-e:2713 · .pi-streak:2717 · .pi-streak-head:2719,2721 · .pi-streak-best:2722 · .pi-dots:2723 · .pi-dot:2725,2726,2727
.pi-streak-note:2728 · .pi-care-title:2729 · .lbf-overlay:2742 · .lbf-box:2745,2759,2760,2761(+13) · .lbf-head:2750 · .lbf-title:2751
.lbf-tabs:2752,2755 · .lbf-note:2758 · .lbf-close:2774 · .lbf-close-l:2775 · .lbf-scroll:2776,2778,2903 · .lbf-body:2779
.lbf-grid:2780 · .lbf-box-bcat:2803 · .lbf-bcat-wrap:2804 · .lbf-bcat:2806,2865,2866,2867(+3) · .lbf-bcat-head:2808,2809,2810 · .lbf-bcat-mid:2817
.lbf-bcat-badge:2818,2877 · .lbcat-ic:2828 · .badge-shine-img:2834 · .badge-shine:2852,2853 · .lbcat-ic-label:2879 · .lbf-bcat-rows:2881
.lbf-one-row:2885,2886,2887 · .lbf-bcat-row:2888,2890,2891,2893 · .lbf-podium:2909 · .pod:2911,2938,2939 · .pod-char:2913 · .pod-base:2915
.pod-rank:2917 · .pod-label:2919,5553 · .pod-name:2921 · .pod-sc:2923 · .pod-1:2928,2929 · .pod-2:2930,2931
.pod-3:2932,2933 · .pod-4:2934,2935 · .pod-5:2936,2937 · .pl-wide:2956,2959,2960,2961(+8) · .pl-follow:2962,2967,2969 · .pl-unfollow:2971,2977,2978
.pl-followers:2979 · .pl-cols:2980,2985,2986,2987 · .pl-col:2981 · .pl-sec-title:2982 · .pl-badges-col:2988 · .pl-feed:2989,2992,2999
.pl-feed-row:2993,2997,2998 · .pl-assets-wrap:3001,5390,5465 · .pl-assets:3002,5393,5398,5404(+4) · .pl-asset:3005,3009,3016 · .pl-asset-emoji:3010 · .pl-asset-n:3011
.pl-pets-wrap:3018 · .pl-pets:3019 · .pl-pet:3020,3025,3027 · .pl-pet-nm:3028 · .img-lightbox:3031,3036,3037,3041(+3) · .cert-svg:3060
.cert-tap:3061,3066 · .cert-chip-sm:3069 · .pl-sec-sub:3089 · .pl-certs:3090,3092 · .cert-mini:3093,3097,3099 · .cert-mini-cap:3100
.cert-none:3102 · .lv-cert-row:3104,3106 · .lv-cert-btn:3107,3112 · .cert-lightbox:3114,3119,3120,3124(+3) · .pl-chat:3144,3149 · .pl-call:3151,3157
.pet-peek:3158,3159 · .pp-chips:3161 · .pp-chip:3162 · .pp-gift:3167,3173 · .settings-box:3175,3176,3249,3260(+32) · .set-feed-head:3177
.set-feed-sub:3181 · .set-feed-row:3182 · .pillinfo-val:3187 · .pillinfo-desc:3192,3211 · .pillinfo-box:3203 · .plf-head:3206
.plf-emoji:3207 · .plf-ht:3208,3209,3210 · .plf-foot:3212,3214,3215 · .alert-box:3220,3222 · .ab-emoji:3223 · .ab-title:3224
.ab-desc:3225 · .ab-btns:3226,3227,3228 · .heal-heart:3230 · .attn-box:3245 · .set-tabs:3270,3274,3277,3278 · .set-attention-ico:3287
.set-attention-copy:3288,3289,3290 · .set-attention-go:3291 · .set-panels:3292 · .set-panel:3293,3296,3297 · .help-box:3381,3382,3383 · .wl-box:3401
.food-box:3402 · .home-shop-box:3404 · .summary-box:3405 · .report-box:3406 · .wl-grid:3409 · .tc-wrap:3411
.spell-btn:3417,3422,3423 · .sp-hud:3424 · .sp-word:3426 · .sp-ch:3427,3432 · .sp-th:3434 · .sp-hint:3436
.sp-exit:3439,3443 · .sp-banner:3444 · .sp-big:3449 · .sp-thb:3451 · .sp-coin:3452 · #spell-confetti:3457
.sp-rb:3458 · .sp-day:3468 · .sp-perfect:3470 · .sp-late:3472 · #spell-coinpop:3475 · .side-sub:3584,3586
.sec-quest:3591 · .on-page:3603,3604,3605,3606 · .inbox-overlay:3616 · .ib-box:3618 · .ib-head:3622 · .ib-close:3626,3628
.ib-list:3629,3630 · .ib-row:3631,3632,3633,3634 · .ib-ava:3635,3640,3641 · .ib-on:3642 · .ib-mid:3644 · .ib-name:3645
.ib-last:3646 · .ib-meta:3647 · .ib-time:3648 · .ib-dot:3650 · .ib-story-badge:3653 · .ib-empty:3657
.ib-story:3659,3661 · .ib-story-item:3662,3664,3671 · .ib-story-ava:3665 · .ib-story-on:3669 · .ib-world:3674,3677 · .ib-tabs:3679
.ib-tab:3680,3683,3685 · .ib-tab-dot:3686 · .ib-call-ava:3690 · .ib-call-row:3691,3692 · #btn-music:3698,3701,3702 · #ws-overlay:3717,3887
#ws-board:3720,3726,3728,3895(+3) · .ws-head:3731,3924,3925 · .ws-title:3732,3926,3933,3934 · .ws-findbar:3735,3935 · .ws-tip:3736,3941 · .ws-grade:3738,3739,3946,3952
.ws-body:3742,3953 · .ws-gridwrap:3743,3983 · #ws-grid:3746,3988 · .ws-cell:3751,3756,3758,3761(+6) · .ws-flash:3767,3769,4015 · .ws-coinpop:3773,3797
.ws-combo:3784,3788,3789,3790 · .ws-find:3801,3940 · #ws-prog:3802,3942 · #ws-words:3806,3810,3954 · .ws-word:3812,3817,3818,3819(+16) · .ws-actions:3827,3828,3837,4002(+1)
.ws-sizes:3832,4008 · .ws-sizes-lb:3834,4009 · .ws-size-now:3835,4010 · #ws-new:3838,4011 · #ws-combo-help:3839,4012 · #ws-stash:3840,4013
#ws-clear:3841,4014 · #ws-combo-dialog:3843,3844 · .ws-combo-card:3846,3849,3856,3857 · .ws-combo-lead:3850 · .ws-combo-steps:3851,3852,3854,3855 · .ws-combo-close:3858
.ws-combo-ok:3860 · #ws-win:3861,3863,4016 · .ws-win-in:3864,3867,4017,4018 · .sec-online:4053 · .rank-tab:4083,4084,4085,4086(+2) · .pet-show-bg:4116,4118,4120,4125(+22)
.bond-context:4229 · .bond-owner:4231,4234,4236 · .bond-owner-heart:4237 · .bond-talk:4239,4243,4245,4246(+6) · .bond-home-card:4253,4258,4259 · .bond-home-art:4260
.bond-home-img:4262 · .bond-home-empty:4264 · .bond-home-copy:4265,4266,4267,4268 · .bond-home-go:4269 · .bond-gear:4271,4275 · .ps-night-fx:4301,4303,4315,4320(+1)
.pet-show:4330,4333,4345,4347(+63) · .ps-video:4614 · .ps-worn-pip:4692,4693 · .id-card:4716,4723,4727 · .id-chip:4740 · .clock-chip:4749,4750
.coin-block:4766 · .coin-subrow:4767 · .coin-group:4768 · .coin-pill:4798,4799,4820 · .cp-lb:4823 · .cp-v:4824
.topbar-icons:4860 · .topbar-icons-row:4861 · .rank-move-box:4878 · .rank-move-head:4883 · .rank-move-feed:4887,4891,4892 · .rank-move-row:4893,4897
.rank-move-up:4898 · .rank-move-name:4899 · .rank-move-topic:4900 · .rank-move-empty:4901 · .rank-move-gap:4902 · .nw-sub:4939
.top-flex2:5034 · #panel-factory:5053,5054,5058,5059(+39) · #panel-rank:5194,5195,5201,5206(+11) · .grid2x8:5277,5283 · .pl-badges-vwrap:5292,5307 · .grid3x5:5293,5298
.pl-badge-arrow:5299,5305 · .pba-u:5306 · .pl-badges-strip:5311,5319,5320 · .pl-badge-card:5321,5327,5345,5346(+1) · .pl-badge-card-ic:5333,5342,5344 · .pl-badge-card-nm:5348
.pl-badges-empty:5354,5356 · .mine-strip:5370,5372,5373,5378(+4) · .mb-strip:5384,5423 · .gmark:5531,5535,5536,5537(+1) · .gm-stack:5540,5544 · .gm-row:5546
.lb-name:5548,5549,5550 · .grade-edit:5571,5576,5577 · .gradelock-box:5581,5597,5602,5604 · .gl-head:5582 · .gl-emoji:5583 · .gl-ht:5584
.gl-cur:5585 · .gl-lock:5586,5591 · .gl-ok:5590 · .gl-lock-sub:5592 · .gl-why:5593 · .gl-pick-lb:5594
.gl-opts:5595 · .gl-hist:5605 · .gl-hline:5606 · .gl-hg:5610 · .gl-hat:5611 · .gl-harr:5612
.gl-foot:5613 · .gl-cf:5614 · .reg-gradelock:5636 · #tp-overlay:5646 · #tp-board:5648,5652 · .tp-head:5656
.tp-title:5657 · .tp-stat:5659,5661 · .tp-pts:5663,5666 · .tp-close:5668,5674,5675 · .tp-snd:5678,5681,5687,5688 · .tp-snd-ic:5682
.tp-snd-track:5683 · .tp-snd-thumb:5685 · .tp-prompt:5692 · .tp-word:5694,5708,5709 · .tp-ch:5696,5701,5702,5704 · .tp-thai:5712
.tp-hint:5714 · .tp-empty:5716 · .tp-keys:5719 · .tp-row:5721 · .tp-row-fn:5723,5756 · .tp-key:5727,5739,5741,5747(+2)
.tp-key-fn:5754 · .tp-fx:5760 · .tp-coinpop:5761 · .tp-pop-pt:5766 · #city-backdrop:5780,5786 · .city-arrive:5787,5788
.night:5802,5822,5823,5825(+2) · #night-veil:5848 · .theme-emerald:5877,5889,5896,5899(+7) · .theme-plum:5882,5893,5897,5900(+3) · #theme-veil:5910 · #screen-picmatch:5965,5971,5972,5973(+38)
.pm-category-btn:6007,6010 · .pm-sheet-card-img:6011 · .pm-card:6014,6019,6023,6025(+9) · .pm-grid:6017 · .pm-right:6047 · .pm-now:6048,6054
#pm-now-en:6055 · .pm-now-th:6056 · .pm-lobby-btn:6064,6068 · .pm-mode-btn:6093,6096 · .pm-wordcard:6097,6098,6100

## css/onetpromo.css (27 บรรทัด · 17 selector)
.onet-promo-overlay:2 · .onet-promo-card:3 · .onet-promo-content:4 · .onet-promo-close:5 · .onet-promo-kicker:6 · .onet-promo-title:7
.onet-promo-lead:8 · .onet-promo-grades:9 · .onet-promo-grid:10 · .onet-promo-stat:11 · .onet-promo-actions:12 · .onet-promo-go:13,15
.onet-promo-optout:14 · .racing-promo-overlay:20 · .racing-promo-card:21,22,23,25 · .racing-promo-flag:24 · .racing-promo-features:26

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

## css/skyplay3d.css (20 บรรทัด · 13 selector)
#sp-root:2,3 · #sp-canvas:4 · .sp-sky-glow:5 · .sp-top:6 · .sp-pill:7,8 · .sp-play:9
.sp-hint:10 · .sp-word:11 · .sp-toast:12 · .sp-joy:13 · .sp-actions:14 · .sp-activity:15
.sp-gate:16

## css/style.css (2,430 บรรทัด · 581 selector)
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
.sick-badge:838 · .big-btn:844,850,1108,1109(+6) · .shop-card:853 · .shop-title:857 · .shop-grid:858 · .shop-item:859,863,864,865(+4)
.it-tag:870 · .tag-wear:871 · .lock-banner:873 · .home-current:879,884,885 · .home-img:886 · .home-emoji:887
.home-btn:888,910 · .home-layout:890 · .home-pic-col:891,897 · .home-img-big:895 · .home-info-col:898,900,903,904 · .home-name-row:901
.home-desc-row:902 · .home-shop-box:912,913 · .home-list:914 · .home-option:915,919,920,921(+3) · .home-downgrade-lock:926 · .home-opt-img:929
.home-opt-body:931,932 · .home-price:933 · .reset-link:953 · .login-card:959 · .login-pets:960 · .login-status:961
.google-btn:962,968,969 · .login-note:970 · .install-btn:973,979,980 · .install-guide-overlay:983 · .install-guide:987,991,994 · .install-steps:992,993
.install-guide-close:995 · .login-account:1000 · .register-card:1003,1007,1025,1029 · .reg-safety:1009,1011,1012 · .reg-privacy:1014,1016,1017 · #screen-register:1019,1020,1021,1022(+2)
.student-chip:1030 · .clock-chip:1034 · .online-count:1040 · .online-row:1047,1051,1052,1071 · .online-dot:1056 · .online-name:1061
.online-act:1065 · .online-ava:1070 · .online-live:1072 · .online-note:1076 · .lb-empty:1079 · .lb-list:1080
.lb-row:1081,1085,1086 · .lb-rank:1090 · .lb-name:1092,1096 · .lb-coins:1100 · .lb-hint:1102 · .lb-badgeline:1103
.lb-tabs:1105 · .lb-tab:1106,1107 · .tinv-note:1118 · .cat-card:1124,1169,1172,1320(+1) · .cat-head:1128 · .cat-emoji:1129
.cat-name:1130 · .cat-pass:1131 · .cat-info:1132 · .cat-btns:1133 · .cat-btn:1134,1138,1139,1140(+3) · .cats-back-bottom:1143
.tapglow:1148,1149,1157 · .lobby-bottom:1156 · .band-sec-head:1167,1168 · .bax-box:1176,1178 · .bax-head:1179 · .bax-sub:1180,1181
.bax-row:1182 · .bax-lv:1183,1186,1187,1188(+3) · .bax-emoji:1189 · .bax-name:1190 · .bax-q:1191 · .bax-need:1193
.bax-rw:1194 · .bax-foot:1198 · .bax-rank:1199,1202 · .bxr-box:1205,1207 · .bxr-head:1208 · .bxr-sub:1209
.bxr-body:1210 · .bxr-pick:1211 · .bxr-cats:1212 · .bxr-chip:1213,1215,1216,1217(+1) · .bxr-list:1220 · .bxr-row:1221,1223,1225,1229
.bxr-rk:1224 · .bxr-nm:1226,1227 · .bxr-sc:1228 · .bxr-tm:1230 · .bxr-more:1231 · .bxr-none:1232
.bxr-foot:1234 · .band-mine-tag:1235 · .bsp-box:1238,1241 · .bsp-head:1242 · .bsp-prog:1243 · .bsp-retake:1245,1248
.bsp-info:1250,1252 · .rts-box:1255 · .rts-head:1257 · .rts-sets:1258 · .rts-set:1259,1260,1261 · .rts-sub:1262
.rts-words:1263 · .rts-word:1264,1266,1267 · .rts-foot:1268 · .rts-okbtn:1269,1271 · .bsp-grid:1272 · .bsp-chip:1273,1276,1277,1278(+1)
.bsp-num:1280 · .bsp-best:1281 · .bsp-tick:1282 · .bsp-foot:1283 · .vb-box:1286,1288 · .xsp-box:1291
.vb-head:1292 · .vb-total:1293 · .vb-quizbtn:1294,1296 · .vb-tabs:1297 · .vb-tab:1298,1300,1301 · .vb-words:1302
.vb-word:1303,1306,1307,1308(+3) · .vb-empty:1312 · .vb-foot:1313 · .vb-pg:1314,1316 · #vb-pginfo:1317 · .vb-hint:1318
.band-lock:1326 · .offline-btn:1327,1328 · .quiz-progress:1333 · .quiz-phon:1334 · #quiz-extra:1335,1337,1338,1339 · .quiz-word-card:1340
.quiz-next:1346,1352,1353,1354(+1) · .quiz-choice:1357,1362,1363,1364 · .quiz-score-pill:1365 · .quiz-time-pill:1367,1369 · .stats-card:1372 · .stats-title:1376,1960
.stats-row:1377,1378,1379,1380 · .stat-badge-line:1382,1385 · .stat-badge-ic:1383 · .game-top:1388 · .back-btn:1389 · .combo-pill:1393
.timer-wrap:1397 · .timer-fill:1398,1399 · .board-label:1401 · .card-grid:1402 · .word-card:1403,1409,1410,1411(+3) · .hint-btn:1417,1422
.game-endless-note:1425,1430,1432,1436(+6) · .report-btn:1457,1462 · .report-box:1465 · .report-close:1466 · .rp-head:1470 · .rp-avatar:1471,1472
.rp-title:1473 · .rp-sub:1474 · .rp-levelcard:1476 · .rp-level-top:1480 · .rp-bar:1481 · .rp-bar-fill:1482
.rp-level-note:1483,1484 · .rp-grid:1486 · .rp-stat:1487 · .rp-ic:1490 · .rp-num:1491 · .rp-lbl:1492
.rp-section:1494 · .rp-h3:1495 · .rp-badge-mini:1496 · .rp-row:1497,1498,1499 · .rp-empty:1500 · .rp-badges:1501
.rp-badge:1502 · .rp-tline:1505 · .rp-tl-head:1506,1507 · .rp-tl-ems:1508 · .rp-em:1509,1510 · .rp-tl-note:1511,1512
.rp-crown:1514,1515 · .rp-wtitle:1517 · .rp-wnow:1518,1519 · .rp-wgraph:1520 · .rp-wcol:1521 · .rp-wval:1522
.rp-wbar:1523,1524 · .rp-wlbl:1525 · .rp-cheer:1527 · .report-ok:1531 · .summary-box:1534,1657,1661,1662(+2) · .sm-burst:1535
.sm-title:1537 · .sm-line:1538 · .sm-coin:1539 · .sm-matches:1545,1546 · .confetti:1548 · .sm-badge:1555
.sm-badge-all:1559 · .badge-celebrate-overlay:1562,1615,1623 · .badge-celebrate:1568 · .bc-emoji:1574,1612 · .bc-emoji-img:1583 · .badge-clickable:1596,1597,1598
.badge-info-box:1602 · .bi-emoji:1603 · .bi-emoji-img:1604 · .bi-title:1605 · .bi-desc:1606 · .bi-ok:1607
.bc-title:1613 · .bc-sub:1614 · .bc-sticky:1624 · .bc-coin:1625,1630 · .bc-ok:1631,1636 · .sm-cheer:1651
.sm-streak:1652,1653 · .sm-sick:1654 · .sm-btns:1655 · .float-fx:1667 · .toast:1674 · .toast-warn:1681,1688,1689,1695
.toast-financial:1696,1703,1706,1712(+2) · .toast-link:1725,1732,1733,1738(+4) · .toast-clear-all:1749,1756 · .alert-box:1758 · .alert-ok:1759,1764 · .settings-box:1766
.set-row:1767 · .set-hint:1771 · .set-hint-on:1772 · .set-hint-off:1773 · .set-lwrap:1774 · .set-label:1775
.set-desc:1776 · .set-switch:1777,1781,1782,1787(+4) · .set-sw-knob:1783 · .set-sw-txt:1790 · .set-night-row:1799 · .set-seg:1800,1802,1808,1809(+1)
.set-close:1811,1816 · .set-help:1817,1822 · .help-box:1824,1825,1830 · .help-item:1826 · .update-banner:1838,1847,1848 · #update-reload:1849
#update-dismiss:1853 · .levelup-overlay:1859,1865,1866 · .levelup-box:1867,1874,1875,1876(+4) · .bill-box:1882,1886,1887 · .tag-off:1888 · .home-decayed-img:1889
.home-dark-img:1890 · .thirst-fill:1891 · .thirst-text:1892,1893 · .toxin-fill:1896 · .toxin-text:1897,1898 · .detox-btn:1899,1904
.shape-text:1907,1908,1909,1910(+1) · .avatar-pick:1914 · .avatar-opt:1915,1919,1920,1921 · .avatar-chip-img:1925 · .mini-av:1927 · .fp-ava:1928
.avatar-chip-blk:1930 · .set-avatar-btns:1931 · .avatar-mini:1932,1936 · .set-blk-row:1938 · .set-sub2:1939 · .blk-grid:1941
.blk-mini:1942,1945,1946,1947 · .game-avatar:1950,1951,1952 · .stats-nick:1961 · .ticket-owned:1964,1968 · .collect-sub:1973 · .mkt-tabs:1974
.mkt-tab:1975,1979 · .mkt-filter:1980 · .mkt-row:1984 · .mkt-emoji:1988,1989 · .mkt-info:1990,1991 · .mkt-tier-stars:1992
.mkt-buy:1993,1998,1999 · .mkt-price-lo:2000 · .mkt-price-hi:2001 · .mkt-empty:2002 · .collect-grid:2005 · .collect-cell:2006
.cc-emoji:2007,2008 · .cc-name:2009 · .cc-count:2010 · .cc-list-btn:2011,2015 · .mkt-listhead:2016 · .mkt-group-head:2018,2024
.mkt-two-col:2026,2027,2031,2043(+8) · #phone-card:2032,2048 · #computer-card:2033,2049 · #ticket-card:2035 · #haunt-card:2036 · #heli-card:2037
#drone-card:2038 · #drive-card:2039 · #soccer-card:2040 · #moto-card:2041 · #invasion-card:2042 · .mkt-listing:2070
.ml-cancel:2074 · .mkt-sold:2080,2081,2082 · .mkt-buy-box:2087,2093 · .mkt-buy-item:2094 · .mkt-buy-pic:2104 · .mkt-buy-pic-img:2116
.mkt-buy-pic-emoji:2117 · .mkt-buy-meta:2118 · .mkt-buy-name:2119 · .mkt-buy-seller:2120,2121 · .mkt-buy-price:2122 · .mkt-buy-balance:2123
.mkt-confirm-code-title:2124 · .mkt-code-target:2125 · .mkt-pin-note:2138 · .mkt-code-input:2139 · .mkt-code-error:2154 · .mkt-pin-grid:2163
.mkt-pin-btn:2168,2180 · .mkt-pin-del:2181 · .mkt-pin-clear:2182 · .mkt-buy-actions:2183,2189 · .mkt-buy-cancel:2200 · .mkt-buy-confirm:2205,2211
.list-dialog:2232,2233,2238 · .list-hint:2237 · .collect-reveal-frame:2241,2248 · .collect-reveal-img:2247 · .collect-reveal-stars:2249 · .craft-box:2252
.craft-head:2253 · .craft-bar:2254 · .craft-fill:2255 · .craft-text:2256 · .craft-btn-row:2257,2258 · .craft-go-btn:2260,2266,2267,2270
.craft-cancel:2278,2282 · .mkt-catalog:2285,2286,2287 · .mkt-pager:2290 · .pg-btn:2291,2295,2296 · .pg-mid:2297 · .pg-dots:2298
.pg-dot:2299,2300 · .order-head:2301 · .order-row:2302,2307,2309,2311 · .order-deliver:2312,2317 · .order-need:2318 · .avatar-chip-photo:2324
.pass-photo:2325 · .pl-photo:2326 · .pp-cam:2331,2339 · .set-photo-row:2342,2348 · .ph-thumb:2349 · .ph-plus:2350
.photo-box:2356,2357,2378,2382(+4) · .ph-now:2358 · .ph-now-img:2359,2363 · .ph-now-cap:2364 · .ph-warn:2365 · .ph-sync:2370,2373
.ph-sync-wait:2374 · .ph-sync-ok:2375 · .ph-sync-bad:2376 · .ph-btns:2377 · .ph-tip:2387 · .ph-stage:2389,2393
.ph-cv:2394 · .ph-ring:2395,2400 · .ph-zoom:2404 · .ph-foot:2405 · .ph-crop-box:2406
