# CODE_MAP.md — แผนที่โค้ด:บรรทัด (เจนอัตโนมัติโดย `tools/gen_code_map.py` — **ห้ามแก้มือ** เดี๋ยวโดนเขียนทับ)

> วิธีใช้: หาชื่อฟังก์ชัน/ค่าคงที่/selector ในไฟล์นี้ (Grep หรือกวาดตา) → `Read` ไฟล์จริง `offset=<บรรทัด>` `limit=40`
> 🗂️ ไฟล์อ้วนมี **สารบัญโซน** (`st-end ชื่อโซน`) — งานทั้งระบบ/โลก 3D: Grep ชื่อโซน → Read/Edit เฉพาะช่วงนั้น **ห้ามอ่านทั้งไฟล์** · เพิ่มระบบใหม่ในไฟล์อ้วนต้องครอบ banner `/* ==== */`+ชื่อโซน (สารบัญเจนเอง)
> css = index `selector:บรรทัดทุกจุดที่ประกาศ` (บั๊ก UI เริ่มหาที่นี่) · เจนใหม่ทุกครั้งที่รัน `python tools/rotate_handoff.py` · อัปเดต: 2026-09-03

## js/account-deletion.js (235 บรรทัด · 0 รายการ)

## js/adv3d_css.js (1,300 บรรทัด · 0 รายการ)

## js/adv3d_intro.js (86 บรรทัด · 0 รายการ)

## js/adv3d_tex.js (250 บรรทัด · 19 รายการ)
TILE_COLORS:9 · letterTexture:10 · letterTextureDark:27 · emojiTexture:40 · GHOST_IMG_MAX:52 · measureGhostBox:58
probeGhostImages:71 · whenGhostsReady:83 · ghostTexture:87 · ghostScareSrc:92 · AD_STYLES:100 · adBoardTexture:109
addAdBillboard:160 · ringAds:172 · BUILDING_TINTS:182 · FACADE_ROWS:184 · buildingFacadeTexture:185 · makePeerSprite:210
bind:246

## js/adventure3d.js (13,506 บรรทัด · 664 รายการ)
### 🗂️ สารบัญโซน js/adventure3d.js (Read/Edit เฉพาะช่วง)
- 1-217 adventure3d.js — โลก 3D First-person 2 โหมด (คิว 7725691507 ข้อ 8 + ต่อยอด)
- 218-322 ⚽ โหมดสนามฟุตบอล (โหมด soccer · รอบ 196) — เล็ง+ชาร์จพลังเตะบอลใส่ป้ายตัวอักษร
- 323-377 🤖 โหมดหุ่นยนต์นักรบ (โหมด mecha · รอบ 199) — มุมมองในหุ่นสูง 5m เดินยิงเอเลี่ยนตัวอักษร
- 378-524 📻 หอบังคับการบิน (รอบ 64 · รอบ 66 เปลี่ยนเป็นอังกฤษล้วนตามผู้ใช้สั่ง)
- 525-563 คำศัพท์ — ตามระดับชั้น + ไม่ซ้ำคำที่ประกอบแล้ว (8.1/8.6) · แยกคลังต่อโหมด
- 564-699 Texture ตัวอักษร / emoji / ป้ายชื่อผู้เล่น (canvas → sprite)
- 700-1020 🧸 รอบ 1200: ตัวละครผู้เล่น Soft Cuboid Chibi 3D (Drive / Haunted Hotel / Soccer)
- 1021-1328 🚙 รอบ 393: รถเพื่อนในโลกขับรถ = โมเดลจริง img/models/car_01.glb (ผู้ใช้สั่ง)
- 1329-1481 สร้างฉาก static ครั้งเดียวต่อโหมด
- 1482-1827 🚗 เมืองกำแพงเพชรจริง (โหมด drive) — ข้อมูล OpenStreetMap ใน js/data/city_kpp.js
- 1828-1894 🧭🕳️ รอบ 782 — ปิดช่องขาดของกริดถนน (ผู้ใช้: "GPS พาไปช่วงที่ถนนขาดตอน / ขับต่อไม่ได้")
- 1895-2101 🌉 รอบ 788 — ปูถนนเชื่อม "เกาะถนนโดดเดี่ยว" เข้าโครงข่ายหลัก
- 2102-2159 🌳🚁 รอบ 811: จุด "พื้นที่สีเขียวข้างถนน" (greenPts) — สุ่มออกจากจุดบนถนนแต่ละจุด
- 2160-2211 🚁🌳 รอบ 816 — บินเฮลิคอปเตอร์เหนือ "เมืองกำแพงเพชร" แล้วลงจอดเก็บตัวอักษรบนพื้นที่สีเขียว
- 2212-2256 🌅 ท้องฟ้าภาพจริง (รอบ 203) — ใส่ภาพ panorama 360° (equirectangular 2:1) เป็นฉากหลังท้องฟ้า
- 2257-2294 🧱 เทกซ์เจอร์ภาพจริง (รอบ 323) — วางไฟล์ `img/tex/<key>.jpg` (หรือ .png) แล้วแปะทับพื้นผิวทันที
- 2295-2796 🌌 ท้องฟ้ากลางคืนโรงแรมผีสิง (รอบ 694) — ผู้ใช้: "ข้างนอกโรงแรมยังไม่น่ากลัวพอ"
- 2797-2835 🏨 โรงแรมผีสิง (รอบ 684) — ตัวตึก 5 ชั้นสร้างใน js/hotel3d.js
- 2836-2934 ตัวอักษรในโลก (8.2)
- 2935-3059 🔤 ภารกิจโรงแรม 4 คำ — ทุกห้องตั้งแต่ชั้น 2 มีตัวอักษร 1 ตัว
- 3060-3102 🌳🪙 รอบ 811: ความหนาแน่นเสริมเฉพาะโหมดขับรถ — ผู้ใช้: "เพิ่มตัวอักษรและเหรียญบนถนนและ
- 3103-3214 🔠🪙 เก็บตัวอักษร 1 ตัว = ได้ 1 เหรียญ (รอบ 345)
- 3215-3281 ประกอบคำอัตโนมัติเมื่อมีตัวอักษรครบ (8.1/8.4)
- 3282-3376 โหมด adv: monsters ยิงสู้ได้ (สเปกเดิม 8.5)
- 3377-3534 👻 รอบใหม่ — PNG-only ghost chase + client-side shader cosmetics
- 3535-3559 🏨 ระบบโรงแรมผีสิง — ห้องไม่ซ้ำ 5→ดับ, 10→ติด, 13→ดับอีกครั้ง
- 3560-3644 🏨 HAUNTED HOTEL CANONICAL RUNTIME BOUNDARY — Phase 2 รอบ 1084
- 3645-4098 🔤🧭 รอบ 1086 — HAUNTED HOTEL PHASE 4
- 4099-4332 เสียงหลอนโหมดผีสิง — สังเคราะห์ Web Audio (ปลอดลิขสิทธิ์ 100%)
- 4333-4484 🔊 รอบ 1071 — เสียงโรงแรมจากไฟล์จริง + ฝีเท้าแยกทุกตัวละคร
- 4485-4836 Multiplayer — ผู้เล่นอื่นใน map เดียวกัน (สไตล์ Roblox)
- 4837-5051 Voice chat ใน map — WebRTC P2P mesh (เสียงวิ่งตรงระหว่างเครื่อง)
- 5052-5132 🏁 พิธีประกาศแชมป์ (ครูกด "จบรอบแข่ง") — /class/<map>/podium
- 5133-5344 HUD
- 5345-6012 DOM overlay + CSS (สร้างครั้งเดียว — self-contained ไม่แตะ style.css)
- 6013-6148 Input — เมาส์+คีย์บอร์ด และจอสัมผัส (มือถือ landscape)
- 6149-6153 🚁 โหมดเฮลิคอปเตอร์ Bell — ฟิสิกส์บินแบบอาร์เคด (สไตล์ Helicopter Flight Pilot)
- 6154-6546 🛸 โดรน FPV (โหมด drone) — บินเร็ว/คล่อง ลอดหน้าต่างเข้าตึกร้าง เก็บตัวอักษรในห้อง
- 6547-6669 🚗 โหมดขับรถเมืองกำแพงเพชร — ฟิสิกส์รถอาร์เคด (bicycle model)
- 6670-6763 🚦 รอบ 133: ไฟจราจรจริงที่ทางแยกใหญ่ + ฝ่าไฟแดงโดนใบสั่ง ม.22
- 6764-7211 🧭 GPS นำทาง (โหมด drive) — เลือกตัวอักษรเป้าหมาย + เส้นทางตามถนนจริง (A*) · นำทางด้วยภาพล้วน (ไม่มีเสียงพูด ตั
- 7212-7270 🎛️ เข็มหน้าปัดวิ่งจริง (สปีด 0-180 + วัดรอบ 0-8×1000) — วาดทับวงเกจของภาพ dash.png
- 7271-7355 🎵 รอบ 181: วิทยุในรถ — จอ head-unit กลางคอนโซล (visualizer + เลือกเพลง 3 โหมด)
- 7356-7399 🪞📷 รอบ 810: กระจกมองหลัง/ข้าง — เรนเดอร์ฉากเดิมซ้ำด้วยกล้องหันหลัง/เฉียงข้าง แล้วยัดลงกรอบบนจอ (scissor)
- 7400-7483 🪞🧑‍🤝‍🧑 รอบ 973: เพื่อนที่ขับตามมา "เห็นในกระจกมองหลัง" + ป้ายชื่อลอยเหนือรถเขา
- 7484-7611 🪆 รอบ 191: ตุ๊กตาดุ๊กดิ๊กหน้ารถ — รูปตัวละครที่ผู้เล่นเลือก (blkN.png)
- 7612-7915 🚔 รอบ 128: แผงเตรียมออกรถ + กฎหมายจราจร + ใบสั่ง
- 7916-7958 🛩️📦 ภารกิจไปรษณีย์กลางคืน (รอบ 353) — เฉพาะช่วงฟ้ามืด (heliNight>.5)
- 7959-9173 🚶🛗🚁🪂 โหมดเดินเท้าในเมืองเฮลิฯ (รอบ 354 — ผู้ใช้สั่ง)
- 9174-9247 🎛️ หน้าปัดเข็มขยับจริง (รอบ 61) — วาดสดทุกเฟรมจากค่าการบินจริง
- 9248-9519 🌧️☀️ ชั้นบนกระจก: ที่ปัดน้ำฝน + แสงแดดสาด (รอบ 346)
- 9520-9924 🔊🌧️ เสียงที่ปัดน้ำฝน (รอบ 537) — สังเคราะห์ล้วน ไม่มีไฟล์เสียง
- 9925-9994 📹 กล้องใต้ท้องเครื่อง (belly cam) — รอบ 348
- 9995-10066 🎯 วงเป้าลงจอด (รอบ 349) — ไฮไลต์ดาดฟ้าที่มีตัวอักษร ให้รู้ว่าควรร่อนลงตรงไหน
- 10067-10682 📏 แถบเตือนความเร็วดิ่ง (รอบ 349) — ลงเร็วเกินกรอบกล้องกะพริบแดง สอนให้ร่อนลงนุ่มๆ
- 10683-10685 Loop หลัก
- 10686-12401 ⚽ โหมดสนามฟุตบอล — ฟิสิกส์บอล + เล็ง + ชาร์จพลัง + กล้อง 1st/3rd + ชุดนักเตะ
- 12402-12857 🤖 โหมดหุ่นยนต์นักรบ — เดินยิงเอเลี่ยนตัวอักษร (ต้องยิงเรียงลำดับในคำ)
- 12858-12879 เข้า/ออกโลก
- 12880-13506 ❓ การ์ด "วิธีเล่น" ตอนเข้าโลกครั้งแรก (จำแยกต่อโลกใน localStorage — ไม่แตะ state.js)
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
ATC:396 · orderedLetterMode:507 · netUp:518 · CHAT_MAX:521 · doneList:528 · wordPool:529
pickWords:542 · hotelCreateWordSet:548 · adRenterActive:571 · FACADE_ROWS:578 · adsFetch:584 · adsWatch:596
adsStop:603 · adsChanged:604 · adRentBuy:615 · heliMusicTick:638 · AD_FLYBY_COIN:642 · adFlybyTick:644
adShopOpen:663 · adShopRender:677 · BLOCK_AVATARS:707 · blkGeo:719 · blkMat:720 · blkCyl:721
softCuboidGeo:724 · blkFaceMat:741 · softFaceAtlasGeo:757 · softFaceAtlasMat:773 · makeLegacyAdventureFigure:783 · makeSoftCuboidChibiFigure:825
makeBlockFigure:868 · makeBlockCar:870 · blkNameSprite:916 · makeBlockPeer:932 · makeWalkPeerWithFigure:953 · makeLegacyAdventureWalkPeer:963
makeSoftChibiWalkPeer:967 · disposeBlockPeer:970 · mechGlowMat:977 · makeMechaFigure:978 · makeMechaPeer:1008 · CAR_GLB_URL:1028
CAR_GLB_LEN:1029 · carSplitWheel:1033 · carGlbEnsure:1060 · carMatGet:1079 · carGlbBuild:1095 · carAvCode:1144
driveCamToggle:1151 · SKID_N:1170 · skidGeomGet:1172 · skidDrop:1177 · skidTick:1191 · blkBuildThumbs:1201
blkBuildPicker:1220 · pickBlockAvatar:1265 · bubbleSprite:1288 · showPeerBubble:1315 · removePeerBubble:1323 · concreteTexture:1333
brokenWindowTexture:1350 · intactGlassTexture:1366 · chargeIconTexture:1384 · rustyDoorTexture:1393 · dAddBox:1407 · buildAbandoned:1414
makeNameSprite:1487 · flatGeom:1500 · flatGeomUV:1509 · buildDriveCity:1519 · HELI_BODY_R:2172 · HELI_KPP_CEIL:2173
heliKppBlocked:2175 · heliKppSpawn:2196 · SKY_IMG:2219 · SKY_EXT:2220 · seamlessSkyCanvas:2226 · applySky:2246
applyTex:2264 · HSKY_R:2309 · hskyTex:2311 · buildHauntSky:2316 · tickHauntSky:2446 · buildScene:2464
randPos:2839 · randRoadPos:2847 · randGreenPos:2865 · HOTEL_PER_ROOM:2887 · HOTEL_MIN_GAP:2888 · hotelSpot:2889
hotelPruneLetters:2925 · HOTEL_QUEST_WORDS:2939 · HOTEL_FLOOR:2940 · HOTEL_SEARCH_FLOORS:2941 · hotelQuestReset:2944 · hotelClearQuestLetters:2949
hotelQuestWordLetters:2953 · hotelStartQuestWord:2957 · hotelFinalHint:2964 · hotelRevealFinal:2971 · spawnLetter:2978 · spawnLettersForWord:3036
ensureCoverage:3038 · DRIVE_LETTER_COPIES:3066 · DRIVE_BONUS_COINS:3067 · ensureDriveAmbience:3068 · removeLetter:3081 · spawnLetterAt:3089
tickLetterRespawns:3097 · LETTER_COIN:3108 · BONUS_COIN_VAL:3109 · pickUpLetter:3110 · hotelApplyCanonicalOrdinal:3159 · letterPop:3179
letterChime:3198 · tryCompleteWords:3218 · rewardCompletedWord:3233 · completeWord:3248 · spawnMonster:3285 · killMonster:3294
tickMonsters:3302 · damagePlayer:3324 · shoot:3340 · tickShots:3354 · GHOST_IMAGE_URL:3382 · makeGhostSprite:3384
hotelGhostPlayers:3387 · hotelTurnScare:3397 · spawnGhost:3412 · tickGhosts:3433 · sessionRecapHtml:3450 · hauntRunSec:3457
fmtSurv:3458 · hauntSurviveFinish:3459 · tickSurvive:3469 · renderHearts:3482 · hotelGhostAttack:3487 · hotelGameOver:3502
hotelScare:3516 · knockedOut:3528 · DARK_LETTER:3557 · tintSprite:3558 · HOTEL_LIGHT_NORMAL:3566 · hotelGlobalLightLevel:3568
hotelApplyCanonicalMask:3574 · hotelApplyCanonicalPhase:3581 · hotelApplyCanonicalState:3604 · hotelCurrentSearchObjective:3649 · hotelSearchContext:3663 · hotelApplyObjectiveProximity:3667
hotelProximityCue:3675 · hotelShowCriticalHint:3680 · hotelHideCriticalHint:3690 · hotelImportantHint:3695 · hotelDirectorContext:3700 · hotelDirectorLightPulse:3711
hotelDirectorPortraitShift:3727 · hotelDirectorScare:3736 · hotelRuntimeInit:3752 · hotelReset:3794 · setTorch:3820 · toggleTorch:3836
tickTorch:3841 · disposeHotelTorch:3849 · hotelBlackout:3861 · hotelApplyLightingState:3864 · hotelLightsOn:3894 · hotelStartFlicker:3898
tickHotelPlayer:3906 · tickHotelWorld:3984 · hotelAct:4032 · openWardrobe:4049 · announceTarget:4078 · hotelFinishRound:4085
netReady:4490 · netJoin:4496 · sendPos:4517 · netHonk:4567 · sendChat:4573 · toggleChatBox:4587
onPeerData:4598 · disposeHeliMesh:4690 · removePeer:4695 · netLeave:4711 · tickPeers:4717 · RTC_CFG:4845
tinvLinked:4846 · partyWord:4853 · syncPartyWord:4869 · updateVoiceBtns:5033 · PODIUM_BONUS:5058 · podiumJoin:5060
podiumLeave:5071 · endRound:5072 · showPodium:5083 · tinvCheck:5124 · showBanner:5137 · renderHudTop:5143
renderHudWords:5153 · renderHudInv:5163 · ddTierFromName:5170 · renderBoard:5172 · drawBigMap:5209 · openBigMap:5264
closeBigMap:5272 · drawMinimap:5277 · loadCarDash:5350 · loadCarWheel:5362 · buildDom:5372 · confirmExit:5997
IS_TOUCH:6016 · HAS_KBD:6018 · bindInput:6019 · movePlayer:6114 · tickPlayer:6124 · collideDrone:6157
propStall:6176 · propBreak:6183 · propFix:6190 · droneBatAdd:6197 · lightningBolt:6200 · startRain:6211
stopRain:6225 · smashGlass:6227 · awardGlass:6238 · neededLetter:6255 · openDoor:6270 · raceStartRun:6290
raceStop:6297 · gateHighlight:6315 · renderRaceHud:6322 · tickDrone:6331 · nearMissTick:6474 · showNearMiss:6498
awardDaredevil:6509 · comboCheer:6526 · comboFlash:6542 · driveCell:6551 · nearestStreet:6557 · collideCar:6567
tlDotY:6598 · tlSet:6602 · driveArms:6619 · tlTick:6631 · TL_GREEN:6675 · tlRedDur:6677
tlightPhase:6678 · buildTrafficLights:6685 · rlTick:6737 · cellDrivable:6769 · cellWeight:6772 · cellBlocked:6777
cellCenter:6778 · posReachable:6780 · losClear:6791 · nearestDrivableCell:6802 · routeGrid:6814 · pickGpsTarget:6867
NAVLINE_W:6890 · NAVLINE_SKIP:6891 · navLineEnsure:6892 · navLineHide:6902 · navLineUpdate:6903 · tickGps:6939
tickDrive:7010 · drawCarDial:7218 · drawCarGauges:7248 · RADIO_RECT:7276 · CAR_RADIO_RECT:7278 · carRadioRect:7284
radioLayout:7286 · radioSetHint:7309 · renderRadioList:7315 · radioToggleList:7325 · drawRadioViz:7330 · radioTick:7348
MIRROR_REAR:7362 · mirrorRearRect:7365 · mirrorPass:7367 · toggleMirrorMini:7380 · drawCarMirrors:7387 · MTAG_MAX_D:7409
mirrorTagsHide:7413 · mirrorTagName:7414 · mirrorTagsTick:7415 · BOBBLE_FOOT:7489 · BOBBLE_H:7490 · BOBBLE_ASPECT:7491
BOB_OMEGA:7494 · BOB_PITCH_FORCE:7496 · BOBBLE_SKINS:7498 · bobbleSetAvatar:7505 · bobbleLayout:7512 · bobbleTick:7525
bobblePoke:7550 · bobbleApplySkin:7567 · dollOwned:7577 · openDollPicker:7578 · carStartShow:7615 · showLawInfo:7633
lawNotice:7655 · driveFineSettle:7665 · HELI_PHASES:7844 · heliStartPhase:7851 · heliFloorAt:7858 · SOFT_TIERS:7868
softLandBonus:7870 · awardPerfLand:7883 · setHeliLight:7902 · MAIL_COIN:7921 · mailStart:7923 · mailStop:7946
mailTick:7947 · FOOT_EYE:7966 · doorSlideSfx:7972 · doorLerp:7995 · entLerp:8003 · footStepSfx:8013
WRING_COIN:8034 · festivalPaint:8038 · dustTexture:8050 · dustBurst:8059 · dustTick:8073 · HELI_GLB_URL:8094
HELI_GLB_TEX_BLUE:8096 · HELI_GLB_ROTOR:8098 · HELI_GLB_TROTOR:8099 · heliGlbEnsure:8101 · heliMatBlueGet:8119 · heliGlbAssemble:8132
heliNavTick:8171 · peerRotorStop:8178 · peerRotorTick:8184 · heliCrashSfx:8203 · heliMeshBuild:8231 · heliMeshBuildLegacy:8242
buildHeliFoot:8372 · footFloorAt:8488 · insideTerm:8495 · inDoorZone:8496 · footHint:8500 · setFootBtns:8501
liftStart:8506 · beginRide:8517 · endRide:8540 · beginWing:8551 · awardAirLetter:8564 · paxChoiceShow:8583
paxChoiceHide:8609 · pilotShipMesh:8613 · beginPilot:8614 · endPilot:8646 · drawCabinWindow:8670 · tickHeliFoot:8694
heliWallPenalty:8905 · tickHeli:8917 · CP_NAT:9182 · CP_GAUGES:9183 · SEAT_LABEL:9196 · SEAT_P_FULL:9197
SEAT_ZOOM:9198 · DASH_OFF_Y:9199 · DASH_DROP:9200 · setSeat:9202 · layoutCockpit:9214 · WIPER:9253
WIPER_SPD:9256 · WIPER_LABEL:9257 · INT_GAP:9258 · WASH_MS:9262 · WASH_TANK_MAX:9266 · SMEAR_LIFE:9278
CHOP_MIN:9279 · SUN_RAY_FAR:9283 · sunRayBlocked:9285 · sunShadeTick:9304 · applyCockpitShade:9315 · rotorChop:9327
sunUpdate:9335 · HELI_FOG_N0:9346 · fogUpdate:9350 · adGlowPulse:9398 · RAIN_MAX:9407 · VISOR_Y:9408
RAIN_MIN:9409 · RAIN_DUR:9410 · DROP_ZONE:9414 · addDrop:9415 · tickDrops:9423 · addWashDrop:9441
washStart:9448 · renderWashGauge:9468 · washTick:9479 · grimeTick:9496 · WIPE_R:9503 · wipeDrops:9504
wiperSndOn:9527 · wiperSndOff:9539 · wiperThunk:9545 · washSpraySfx:9557 · wiperSqueak:9574 · wiperSndTick:9591
setWiper:9611 · tickWiper:9623 · SH_SWEEP:9654 · shadowSweepTick:9656 · REFL_MAX:9668 · REFL_COL:9670
cityGlowLevel:9671 · drawCityGlow:9676 · setVisor:9708 · rainTick:9714 · drawBlade:9731 · drawSmears:9750
drawGlass:9770 · drawBellyCam:9932 · drawBellyHud:9955 · drawLandingTargets:10001 · VS_HARD:10071 · drawDescentBar:10072
heliShake:10121 · cpNeedle:10132 · drawGauges:10149 · XF_START:10197 · PRELOAD_WAIT:10198 · ALT_QUIET_FROM:10200
ALT_MAX_DAMP:10201 · ALT_LP_MIN:10202 · ECHO_NEAR:10203 · WIND_FULL_SPD:10204 · SHUTDOWN_SEC:10205 · PAN_MAX:10207
OD_RPM:10208 · SHAKE_RPM:10209 · SHAKE_HIT:10210 · soccerLetterPos:10690 · letterNeeded:10698 · soccerNeededSet:10707
soccerTileGeo:10715 · soccerGoldTexture:10717 · makeSoccerTile:10734 · soccerRefreshSkins:10743 · soccerBuildTargets:10750 · soccerNextTile:10760
soccerRetarget:10776 · soccerCoinPop:10788 · soccerGrassTexture:10801 · soccerTurfGrade:10823 · soccerTurfTexture:10874 · grassNormalTexture:10893
soccerLinesTexture:10922 · soccerNetTexture:10973 · soccerCrowdTexture:10981 · soccerBallMat:11000 · buildSoccerGoal:11020 · soccerFloodTexture:11039
soccerScoreboardTexture:11049 · buildStands:11058 · soccerLedBoards:11111 · soccerMusicCanPlay:11133 · soccerMusicSyncButton:11136 · soccerMusicEnsure:11145
soccerMusicCancelFade:11150 · soccerMusicStart:11153 · soccerMusicStop:11161 · soccerMusicSessionStart:11169 · soccerMusicToggle:11172 · soccerMusicVisibilityChange:11177
soccerGKEnsure:11256 · soccerGKTick:11272 · fkBuildWall:11301 · fkToggle:11316 · fkHitTest:11332 · pkHud:11351
pkStart:11360 · pkEnd:11374 · pkTick:11389 · repQualify:11396 · repEnsureEl:11399 · repStart:11410
repTick:11417 · soccerNumTex:11442 · ssSec:11454 · ssPaintPattern:11459 · soccerShirtTex:11472 · makeSoccerPlayer:11494
soccerNewSpot:11531 · soccerResetBall:11543 · soccerKick:11550 · soccerCheer:11568 · guideTexture:11571 · auraActive:11595
auraLeftMs:11596 · auraFlameTex:11604 · auraCoilTex:11628 · auraCoilRibbon:11652 · auraGlintTex:11676 · buildAura:11687
auraBuy:11730 · auraRender:11740 · auraTick:11754 · buildDrill:11805 · drillTick:11818 · ballFXTex:11858
buildBallFX:11869 · smokePuff:11885 · ballFXTick:11893 · buildLandRing:11939 · buildGuideRibbon:11949 · renderSpinPad:11974
spinPadToggle:11986 · spinPadPick:11992 · renderCurl:12004 · kickLaunch:12015 · updateSoccerGuide:12024 · soccerCamera:12088
tickSoccer:12112 · ssShirtPath:12306 · ssShortsPath:12314 · ssPaintSwatchShirt:12319 · ssPaintSwatchShorts:12324 · ssPreviewDraw:12331
soccerKitShow:12360 · soccerKitGo:12389 · emojiSprite:12443 · makeAlien:12448 · startWave:12481 · waveSpawnFill:12492
waveComplete:12501 · updateWaveHud:12511 · checkMechaBossBadge:12513 · alienSpawnPos:12522 · removeAlien:12527 · mechaHudWord:12532
setMechaHudSkin:12540 · mechaComboPop:12552 · mechaShielded:12557 · mechaDamageFx:12559 · mechaHitByAlien:12564 · spawnAlienShot:12570
removeAlienShot:12580 · tickAlienShots:12585 · spawnPowerup:12597 · removePowerup:12610 · collectPowerup:12615 · tickPowerups:12622
updateMechaHud:12631 · mechaTracer:12671 · mechaFire:12680 · explodeAlien:12717 · tickMecha:12747 · loop:12803
grabShot:12838 · savePhoto:12849 · clearEntities:12861 · INTRO_KEY:12884 · introSeenObj:12885 · introSeen:12886
markIntroSeen:12887 · INTRO:12888 · INTRO_MODE:12890 · showIntro:12892 · HELI_KPP_BANNER:12918 · closeIntro:12920
beginPlay:12926 · start:12928 · exitWorld:13162 · mechaRecapLine:13239

## js/app-update.js (214 บรรทัด · 0 รายการ)

## js/arena3d.js (724 บรรทัด · 0 รายการ)

## js/assetaward.js (21 บรรทัด · 0 รายการ)

## js/auth.js (549 บรรทัด · 52 รายการ)
AUTH_PUSH_MS:23 · AUTH_SDK_TIMEOUT_MS:24 · AUTH_CLOUD_SLOW_MS:25 · AUTH_CLOUD_TIMEOUT_MS:26 · SKY_BETA_OPEN:31 · SKY_BETA_EMAILS:32
skyBetaEmail:37 · canAccessSkyBeta:40 · ADMIN_NAME_EMAILS:46 · adminReservedNameKey:51 · isReservedAdminName:56 · canUseReservedAdminName:60
isAdmin:65 · checkProfileName:68 · TEACHER_EMAILS:77 · isTeacher:78 · syncAdminAccess:82 · TESTER_EMAILS:96
TESTER_COINS:97 · isTester:98 · RANK_EXCLUDED_TESTER_NAMES:104 · rankUserExcluded:105 · testerBoost:111 · authSetStatus:144
authLocalSaveSafe:161 · authShowLogin:164 · authGateOffline:168 · authSaveRef:175 · authFetchCloud:176 · authWriteCloud:196
authDeleteCloud:197 · authWriteProfileName:198 · authPushProfile:205 · authApplyProfileName:213 · authEnsureProfileName:236 · authAskProfileName:254
authEditProfileName:268 · authStart:280 · updateOfflinePill:312 · authEnterOffline:317 · authLateSync:334 · authIsAppMode:354
AUTH_REDIRECT_CODES:362 · authLoginClick:364 · authOnLogin:384 · authSyncOnLogin:410 · authFreshStart:439 · authAskLink:448
authEnterGame:498 · authPushSaveAwait:514 · authPushSave:521 · authLogout:526

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

## js/f1_3d.js (4,753 บรรทัด · 340 รายการ)
### 🗂️ สารบัญโซน js/f1_3d.js (Read/Edit เฉพาะช่วง)
- 19-213 ⚙️ ค่าคงที่ (TUNE ZONE)
- 214-262 📦 สถานะโลก
- 263-347 🏁 รอบ 1219 — MULTIPLAYER SAFE-DISTANCE START GRID
- 348-518 🔊 F1 DYNAMIC ENGINE AUDIO — sample จริง + RPM/เกียร์เสมือน + synth fallback (รอบ 1106)
- 519-597 🎵 RACING BACKGROUND MUSIC — lazy stream + browser disk cache + fade on exit
- 598-675 🖼️ texture: probe img/f1/*.jpg ก่อน → ไม่มีใช้ canvas วาดเอง
- 676-702 ✏️ sprite ตัวอักษร / ป้ายชื่อ (canvas → sprite)
- 703-780 🛣️ เส้นแทร็ก: F1_MAP.track (จุดจริง OSM) → sample ทุก 5 ม.
- 781-999 🌌🪽 รอบ 1217 — FANTASY MAIN-LINE AIR ROUTES (GPU COOL)
- 1000-1133 🏗️ สร้างฉาก: แทร็ก + kerb + runoff + อาคารจริง + ไฟ + ทะเลทราย
- 1134-1211 🏟️ PREMIUM MODULAR CIRCUIT ARCHITECTURE — รอบ 1203
- 1212-1765 ✨ F1 REALISTIC CIRCUIT — ฉากสนามมืออาชีพเฉพาะ Realistic Mode (รอบ 1125)
- 1766-1849 🏎️ รถประกอบ procedural สำหรับ Best-Lap ghost/fallback (รถผู้เล่นจริงใช้ VR-X1 ด้านล่าง)
- 1850-2046 🏎️📱 รอบ 1210 — SEMI-REALISTIC LOW-POLY PEER F1 (GPU COOL)
- 2047-2402 🖥️ DOM + CSS (เต็มจอ ไม่มีกรอบเครื่องเกม)
- 2403-2673 ✨ PREMIUM RACE HUD — รอบ 1203 · brushed metal + glass + neon accent
- 2674-2823 🌍 สร้างโลกครั้งเดียว
- 2824-2998 🪽 รอบ 904: DRS — ปีกหลังเปิดบนทางตรง (ตามรถเพื่อนใกล้ 25 ม.)
- 2999-3010 🏁 ฟิสิกส์ + จับเวลา
- 3011-3383 🌀 PORTAL DESTINATION PREVIEW — actual target curve / Canvas2D (รอบ 1222)
- 3384-3474 🏆 รอบ 903: กระดานอันดับ Best Lap ออนไลน์ (/f1Rank)
- 3475-3643 🚦👻 รอบ 902: ลำดับออกสตาร์ท (ไฟแดง 5 ดวง) + รถเงาวิ่งตาม Best Lap
- 3644-3696 🚧 เลนพิท — ผิวทางเต็มกริป + ลิมิตเตอร์ 80 กม./ชม.
- 3697-3792 🔤 คำศัพท์บนแทร็ก (แบบเดียวกับโลกมอเตอร์ไซค์ — REWARD สูงกว่า)
- 3793-3834 🏁 รอบ 1324 — R4 LIVE RACE POSITION (lap + track progress)
- 3835-4094 🧑‍🤝‍🧑 เพื่อนร่วมสนาม (NetRoom map 'f1')
- 4095-4181 📷 กล้องไล่หลัง + ลูปเกม
- 4182-4299 🔢 รอบ 916 — จอบนพวงมาลัยเป็น "ของจริง"
- 4300-4471 🚥 รอบ 918: แถบไฟ LED รอบเครื่องบนพวงมาลัย (เขียว → เหลือง → แดง ตอนใกล้เปลี่ยนเกียร์)
- 4472-4753 🚪 เข้า/ออกโลก
### รายการ js/f1_3d.js
REWARD:22 · LETTER_COIN:23 · COLLECT_R:24 · DONE_KEY:25 · RECENT_KEY:26 · HALF_W:27
KERB_W:28 · RUNOFF_W:29 · BARRIER_LAT:30 · BARRIER_BOUNCE:31 · CAR_HIT_PARTS:35 · CAR_HIT_RADIUS:44
CAR_RESTITUTION:45 · CAR_SIDE_FRICTION:46 · CAR_RUB_DRAG:47 · CAR_SEP_EPS:48 · SAMPLE_M:49 · FP_EYE:51
FP_FWD:52 · FP_LOOK:53 · FP_DROP:54 · FP_FOV:55 · RFP_EYE:57 · RFP_FWD:58
RFP_LOOK:59 · RFP_DROP:60 · RFP_FOV:61 · ROAD_EYE:64 · ROAD_DROP:65 · ROAD_FOV:66
REV_A:68 · REV_MAX:69 · OFFTRACK_S:70 · WHEEL_HUB_X:72 · WHEEL_HUB_Y:73 · WHEEL_RATIO:74
WHEEL_MAX_DEG:75 · QUALITY_HAND_MAX_DEG:76 · LED_GREEN_N:80 · LED_AMBER_N:81 · LED_SHIFT_R:82 · LED_FLASH_HZ:84
LED_K_LO:85 · LED_K_SPAN:86 · LED_RPM_LERP:87 · F1_LEDS:88 · WHEEL_IMG_W:97 · DASH_PX:98
QUALITY_PLATE_W:102 · QUALITY_DASH_SCALE:103 · QUALITY_DASH_POSE:104 · DASH_LED_N:109 · DASH_RPM_MIN:110 · DASH_RPM_MAX:111
SHAKE_KERB_AMP:113 · SHAKE_SAND_AMP:114 · SHAKE_SPD_REF:115 · SHAKE_HZ:116 · WHEEL_SHAKE_KERB_PX:118 · WHEEL_SHAKE_SAND_PX:119
PWR_A:121 · ACC_CAP:122 · DRAG_K:123 · ROLL_A:124 · BRAKE_A:125 · BRAKE_DF:126
COAST_A:129 · COAST_STOP:130 · GRIP_BASE:131 · GRIP_DF:132 · GRIP_CAP:133 · STEER_MAX:135
STEER_HI:136 · SURF_RUNOFF:137 · SURF_SAND:138 · JUMP_GRAVITY:140 · JUMP_LANE_LAT:141 · JUMP_ENTRY_M:142
JUMP_RISE_M:143 · JUMP_GAP_M:144 · JUMP_LAND_M:145 · JUMP_EXIT_M:146 · JUMP_RECOVER_M:147 · JUMP_HEIGHT:148
JUMP_LAND_H:149 · JUMP_MAX_PITCH:150 · RAMP_ROLL_TRACK:151 · RAMP_ROLL_MAX:152 · RAMP_ROLL_EDGE:153 · RAMP_ROLL_RESPONSE:154
RAMP_ROLL_RETURN:155 · JUMP_PEER_Y_SEP:156 · JUMP_FRACTIONS:157 · JUMP_COLORS:158 · NET_SEND_MS:159 · ROOM_MAX:160
CHAT_MS:161 · CHAT_PRESETS:162 · F1_ROLL_WIRE:165 · CAR_COLOR_KEY:168 · F1_COLOR_WIRE:171 · CAR_STYLES:172
COCKPIT_ASSETS:179 · PEER_COLORS:186 · GRID_N:187 · GRID_FRONT_M:189 · GRID_GAP_M:190 · GRID_SIDE_M:191
GRID_SAFE_M:192 · F1_GRID_WIRE:193 · LIGHT_LEAD_S:195 · LIGHT_STEP_S:196 · LIGHT_HOLD_MIN:197 · LIGHT_HOLD_MAX:198
JUMP_PENALTY_S:199 · RACE_BGM_BUILD_URL:202 · RACE_BGM_URL:203 · RACE_BGM_VOLUME:204 · RACE_BGM_EXIT_FADE_MS:205 · GHOST_HZ:207
GHOST_MAX:208 · GHOST_KEY:209 · PIT_HALF_W:210 · SURF_PIT:211 · PIT_LIMIT:212 · LINE:239
JUMPS:240 · PITL:254 · gridPose:266 · startGridUid:278 · startGridUids:282 · startGridSlotFor:285
gridFormationActive:290 · gridSlotClear:291 · safeStartGridSlot:302 · placeAtGridSlot:308 · settleStartGrid:317 · packetGridSlot:324
packetBodyRoll:330 · storedCarStyle:339 · saveCarStyle:342 · cockpitAsset:343 · raceMusicPreferenceOn:522 · raceMusicCanPlay:523
raceMusicUnlocked:526 · raceMusicSyncButton:527 · raceMusicEnsure:535 · raceMusicCancelFade:546 · raceMusicStart:550 · raceMusicStop:567
raceMusicToggle:586 · raceMusicVisibilityChange:591 · GEARS:595 · gearOf:596 · matLam:605 · matLit:611
applyTex:616 · texFromCanvas:620 · texProbe:628 · asphaltTex:639 · kerbTex:654 · sandTex:660
adTex:669 · letterTexture:679 · makeTextSprite:689 · cr:707 · buildLine:711 · nearIdx:750
jumpDeltaD:786 · jumpHalfAtD:789 · jumpPhaseAtD:797 · jumpHeightAtD:806 · jumpPitchAtD:819 · jumpProbeAtSample:831
jumpProbe:841 · jumpWheelGround:849 · jumpTerrainRoll:860 · chooseJumpStart:866 · prepareFantasyJumps:886 · jumpPose:900
fantasyRampGeometry:905 · buildFantasyCircuit:928 · surfAt:985 · ribbonGeo:1003 · kerbStrips:1024 · extrudeFootprint:1059
polyCentroid:1070 · pointInFootprint:1074 · footprintCrossesRoad:1083 · footprintFrame:1091 · premiumMats:1106 · instancedParts:1122
localPart:1131 · buildBuildings:1138 · chooseRealisticTier:1217 · isThermalMobile:1224 · useRacingSky:1228 · seededRand:1240
realisticAsphaltMaps:1244 · realisticRunoffTex:1290 · realisticSandTex:1306 · racingLineRibbonGeo:1324 · linePose:1335 · tracksideSpotClear:1343
instancedFromSpots:1347 · buildRealisticCircuit:1353 · buildTrackScene:1624 · buildF1Car:1769 · addPlayerContactShadow:1842 · peerF1MergedGeometry:1856
peerF1LoftGeometry:1874 · peerF1CombineGeometry:1901 · peerF1KitGet:1914 · buildPeerF1Car:1977 · replacePlayerCar:2007 · paintPlayerStyle:2022
primePlayerCockpit:2043 · CSS:2050 · buildDom:2467 · build:2677 · mapBounds:2790 · mapXY:2798
drawMap:2801 · DRS_ZONES_N:2832 · DRS_CURV:2833 · DRS_GAP_MAX:2834 · DRS_MIN_M:2835 · DRS_ENTRY_M:2836
DRS_NEAR_M:2837 · DRS_DRAG_K:2838 · DRS_FLAP_SHUT:2840 · DRS_FLAP_OPEN:2841 · attachDrsGlow:2846 · findDrsZones:2856
DRS_DET_M:2887 · DRS_SIGN_KIND:2888 · drsDetIdx:2895 · drsSignTex:2899 · buildDrsBoards:2911 · drsZoneAt:2953
drsPeerGap:2962 · drsTick:2975 · drsHud:2990 · respawnOnTrack:3003 · drawPortalDestination:3014 · beginPortalReturn:3038
portalTick:3049 · barrierBounce:3071 · carPartContact:3088 · carContact:3110 · resolvePeerCars:3120 · landFromJump:3157
jumpPhysicsTick:3167 · physTick:3205 · progressTick:3311 · fmtLap:3356 · puffSmoke:3362 · smokeTick:3373
FR_READ:3392 · frSubmit:3394 · frMerge:3411 · frFetch:3423 · frRowHTML:3441 · frBodyHTML:3450
frNote:3459 · frMount:3464 · setStartLights:3484 · resetLights:3489 · beginLights:3497 · lightsLocked:3498
paintLights:3499 · lightsTick:3509 · ghostEnsure:3558 · ghostHide:3575 · ghostLoad:3580 · ghostSave:3589
ghostReset:3592 · ghostRecord:3596 · ghostKeep:3605 · ghostGapAt:3612 · ghostTick:3620 · buildPitLine:3649
pitAt:3680 · inPitLane:3691 · racingLineLat:3700 · trackPointAhead:3708 · pickWord:3716 · spawnLetters:3731
renderWordHud:3745 · collectTick:3751 · completeWord:3772 · relocTick:3789 · packetRaceLap:3796 · packetRaceProgress:3800
racePositionSnapshot:3809 · updateRacePosition:3823 · netReady:3838 · netJoin:3843 · netSend:3856 · sendChat:3873
peerColorIndex:3880 · packetCarColorIndex:3885 · peerColor:3895 · buildPeer:3898 · onPeer:3932 · showPeerBubble:3969
removePeerBubble:3976 · dropPeer:3982 · peerTick:4003 · netLeave:4033 · layoutBoard:4039 · renderBoard:4062
CAM_MODES:4100 · CAM_NEXT_LABEL:4101 · cycleCamMode:4102 · applyCamMode:4106 · cockpitBox:4117 · layoutWheel:4126
wheelTick:4148 · DASH_FONT:4188 · positionQualityDash:4190 · layoutDash:4206 · dashRR:4216 · dashRpmTick:4223
dashTick:4233 · drawDash:4248 · buildLeds:4305 · ledsOff:4313 · ledTick:4317 · camTick:4344
hudTick:4395 · applyThermalPixelRatio:4406 · thermalGovernorTick:4412 · thermalRenderDue:4424 · frame:4434 · tick:4456
fit:4463 · applyEnvironmentProfile:4475 · start:4519 · exitWorld:4594

## js/f1_modes.js (125 บรรทัด · 14 รายการ)
STORAGE_KEY:7 · DEFAULT_MODE:8 · ENTRY_MODE:9 · SELECTOR_ENABLED:10 · CONTRACT:11 · freezeProfile:13
PROFILES:19 · MODES:38 · normalize:45 · readPreference:46 · writePreference:50 · selection:55
removeSelector:60 · openSelector:66

## js/fpsweapon.js (194 บรรทัด · 0 รายการ)

## js/frontline1944.js (13,878 บรรทัด · 168 รายการ)
FRONTLINE_EXECUTING_SCRIPT_URL:142 · CFG:172 · LAYER:952 · TERRAIN:1132 · SECTOR_TEMPLATES:1297 · approach:1717
rotateToward:1732 · listen:1747 · hash32:1762 · randFrom:1777 · adminAllowed:1807 · lockNotice:1912
syncAdminEntry:1927 · claimTankRuntimeOwnership:2062 · releaseTankRuntimeOwnership:2167 · runtimeIdentity:2242 · frontlineAssetLabel:2248 · frontlineDeliveryIdentity:2266
renderRuntimeIdentity:2293 · normalizeWord:2335 · vocabPool:2440 · auditVocabulary:2560 · ensureProgress:2665 · persist:2800
claim:2935 · chooseWord:2950 · pronounce:3055 · awardLetter:3070 · loadThree:3280 · makeDom:3385
showToast:3610 · sharedMesh:4270 · addToLayer:4285 · addToSector:4300 · setWorldPos:4315 · visualIdFor:5740
sectorDescriptor:5755 · createSectorGroups:5785 · removeSectorGroups:5800 · registerOccluder:5815 · updateOcclusionOrder:5830 · addBaseSectorArt:5920
addFieldRows:6085 · addCrater:6100 · addMudPatch:6115 · addTree:6130 · addHouse:6250 · addBunker:6340
addCampTent:6355 · addWall:6370 · addBridgeCrossing:6460 · addSmoke:6610 · makeSmokeTexture:6670 · populateSector:6730
disposeSectorRuntime:7045 · instantiateSector:7120 · createProjectilePool:7780 · createFxPool:7900 · initPools:7945 · disposePools:7960
makeTank:7990 · playerIdentity:8350 · makePlayer:8425 · authoritativeTankPose:8515 · syncTankVisual:8575 · tankStateSnapshot:8590
interpolateRemoteTank:8635 · makeEnemyFigure:8680 · makeBossTank:8725 · spawnEnemy:8740 · registerFortressCollision:8800 · makeFortress:8950
removeFortress:9055 · activateNextFortress:9070 · spawnDefenders:9175 · spawnBoss:9220 · recordDamage:9250 · damageEnemy:9265
damagePlayer:9280 · destroyCore:9295 · cannonWorldPosition:9325 · cannonWorldRay:9340 · cannonWorldDirection:9400 · spawnProjectile:9415
firePlayer:9430 · enemyFire:9520 · projectileImpact:9580 · tickProjectilePool:9595 · burst:9820 · tickFx:9880
forwardFromRotation:10000 · rightFromRotation:10015 · rotationFromForward:10030 · driveDelta:10045 · normalizeTankCommand:10060 · steeringForTravelDirection:10075
desktopCommandFromState:10090 · mobileCommandFromState:10165 · mergeTankCommands:10240 · screenAimDirection:10285 · tickTank:10780 · tickFortress:10825
tickEnemies:10870 · cameraTick:10945 · updateObjective:11005 · fortressStateText:11020 · updateHud:11035 · inputNow:11218
markTouchLikeInput:11233 · hasRecentTouchLikeInput:11248 · mobileAimLatchValid:11263 · mobileAimLatchedHeading:11278 · latchMobileAimWorldDirection:11293 · latchMobileAimVector:11308
clearMobileAimLatch:11323 · shouldAcceptDesktopAimEvent:11338 · explicitInputDiagnosticsRequested:11353 · coarseInputEnvironment:11368 · inputDiagnosticsEnabled:11383 · preventControlDefault:11398
queueMobileFirePulse:11413 · consumeMobileFirePulse:11428 · stickVectorFromRect:11443 · resetStickState:11488 · pointInRect:11533 · rectFromEdges:11548
rectFromDomRect:11563 · rectCenter:11578 · expandRect:11593 · rectIntersects:11608 · viewportRectFor:11623 · safeAreaInsetsFor:11638
safeGameplayRect:11653 · elementUsableRect:11668 · protectedFrontlineRects:11683 · mobileControlRegions:11698 · pointOverProtectedFrontlineUI:11773 · eventTargetLabel:11788
isProtectedFrontlineTarget:11848 · firePlacementBlockedRects:11893 · fireRectWithinSafe:11908 · fireRectIsValid:11923 · fireRectAtCenter:11938 · findSafeFireRect:11953
applyFireRect:12058 · fireOrientationKey:12073 · fireStorage:12088 · readFirePositionStore:12103 · writeFirePositionStore:12118 · normalizedFirePosition:12133
saveFirePositionPreference:12148 · restoreFirePositionPreference:12163 · updateInputDiagnostics:12808 · bindGlobalMobileTouchRouter:12886 · bindControls:13171 · pointerToGround:13279
bindCanvasAim:13294 · resize:13354 · buildLayers:13369 · buildWorld:13384 · initThree:13459 · loop:13504
clearScene:13564 · open:13609 · close:13699 · routeCheck:13744 · occlusionAcceptance:13774 · foundationDiagnostics:13789

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

## js/home-v2.js (2,098 บรรทัด · 0 รายการ)

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

## js/lettercannon.js (477 บรรทัด · 0 รายการ)

## js/lobby.js (52 บรรทัด · 3 รายการ)
PANEL_TITLES:9 · openPanel:19 · closePanel:29

## js/lobby3d.js (811 บรรทัด · 0 รายการ)

## js/main.js (584 บรรทัด · 11 รายการ)
settingsButtonClick:103 · syncMusicBtn:119 · showPetShoppingGrantNotice:153 · showPetShoppingFineRefundNotice:186 · showRankRewardNotice:217 · showQuizBackPay:267
showGiantRefund:312 · showTicketRefund:353 · fitQbp:394 · bootGame:408 · showCakeGiftRefundNotice:434

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

## js/netroom.js (821 บรรทัด · 20 รายการ)
CFG:41 · roomsAllowed:63 · HOT_KEYS:71 · COLD_KEYS:72 · HOT_BACK:73 · splitPayload:77
mergeBack:88 · metUids:100 · AIM_TTL_MS:119 · aimAt:121 · aimGet:125 · aimClear:129
MAPS3D:135 · skyMapAllowed:136 · whereFriends:139 · dbOf:163 · envReady:164 · isDenied:167
create:179 · drawBudget:794

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

## js/state.js (1,386 บรรทัด · 96 รายการ)
### 🗂️ สารบัญโซน js/state.js (Read/Edit เฉพาะช่วง)
- 2-243 STATE + LocalStorage + กติกากลางของเกม
- 244-300 🗄️🐾 ระบบชั้นอาหาร + เงินช่วยปรับตัว
- 301-790 👍 รอบ 701: รีแอ็กชันฟีด (กดค้างปุ่มถูกใจแล้วเลือกได้เหมือน Facebook)
- 791-846 Daily Quest (item 3 backlog): ภารกิจรายวัน 3 อย่าง สุ่มตามวันที่
- 847-957 มูลค่าทรัพย์สินสุทธิ (net worth) — ฐานของระบบแรงค์
- 958-1007 🚫🍽️ สัตว์ป่วยเพราะหิว = ซื้อของกินไม่ได้ (รอบ 952)
- 1008-1101 เครื่องยนต์บิลรายเดือน (กลาง — ค่าบำรุงบ้านตอนนี้ / ค่าไฟ-น้ำ-เน็ต เสียบเพิ่มได้)
- 1102-1226 🍖 เงินค่าอาหารสัตว์รายเดือน — ทุกวันที่ 1 ของเดือน จ่ายตามจำนวนสัตว์ที่เลี้ยงอยู่
- 1227-1386 โรงงานผลิตสินค้า: จ่ายค่าผลิตด้วย "แต้มคำศัพท์"
### รายการ js/state.js
STORAGE_KEY:6 · QUIZ_PASS_REWARD:11 · CURE_COST:13 · HUNGRY_SICK_MS:14 · MEAL_HOUR:16 · MEAL_FULL:17
SLEEP_FROM_HOUR:18 · SLEEP_SICK_HOUR:19 · WAKE_HOUR:20 · DINNER_COST:21 · TOXIN_FULL:23 · DETOX_COST:24
FOODQUIZ_Q:26 · FOODQUIZ_COIN:27 · FOODQUIZ_BONUS:28 · FOODQUIZ_MAX_PLAYS:29 · SHAPE_JUNK_MEALS:31 · SHAPE_CLEAN_MEALS:32
SHAPE_MISS_MEALS:33 · SHAPE_EXP_BONUS:34 · HEAT_SICK_MS:35 · THIRST_SICK_MS:36 · DEFAULT_STATE:38 · migratePetShoppingState:249
FEED_CATS:293 · FEED_REACTIONS:307 · feedRx:315 · FEED_QUICK_CM:317 · SLOT_MS:329 · currentSlotStart:330
nextSlotStart:336 · mealDayKey:338 · nightKeyOf:340 · isNightNow:348 · newPet:353 · loadState:378
saveState:748 · activePet:758 · petStage:759 · isAdult:764 · abilityOn:765 · hasPetType:766
todayStr:769 · dailyTick:773 · addCoins:776 · QUEST_POOL:796 · QUEST_PER_DAY:805 · questsToday:806
questTick:813 · questEvent:817 · assetValue:853 · netWorth:877 · assetCount:879 · grantRankPromotionRewards:897
refreshRank:927 · heatProtected:945 · rainProtected:949 · petHungry:952 · petCanEat:956 · hungerSickLock:964
hungerSickMsg:972 · petShapeOf:980 · updatePetShape:986 · shapeMealDone:993 · heatPct:1003 · ymStr:1012
billOutstanding:1016 · UTILITIES:1023 · HOME_UTILITIES:1029 · homeDecayed:1031 · billTick:1034 · PET_FOOD_PER_PET:1106
petFoodTick:1107 · myCar:1133 · carLoanDue:1138 · carLoanOverdue:1143 · carLoanPayable:1148 · carLoanPay:1155
compTick:1168 · ONLINE_RATE:1182 · onlineEarnActive:1183 · onlineEarnTick:1187 · onlineEarnFlush:1198 · marketTick:1208
addCraft:1232 · ORDER_MAX:1251 · ORDER_LIFE_MS:1252 · ORDER_GAP_MIN_MS:1253 · ORDER_GAP_SPAN_MS:1254 · ORDER_TIER_WEIGHT:1255
newOrder:1256 · orderTick:1269 · careTick:1277 · expNeed:1357 · addExp:1362 · addRP:1382

## js/thaitime.js (52 บรรทัด · 13 รายการ)
TH_TZ_MIN:22 · TH_DAY_MS:23 · thShift:28 · thMs:30 · thDate:31 · thHour:32
thHourF:33 · thDayKey:34 · thDayStart:35 · thAtHour:39 · thTs:40 · TH_TZ_OPT:45
thLocaleOpt:46

## js/tpaward.js (42 บรรทัด · 0 รายการ)

## js/typing.js (370 บรรทัด · 0 รายการ)

## js/ui.js (10,333 บรรทัด · 445 รายการ)
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
- 7230-7691 ☁️📚 รอบ 1229 — Vocab Sky Playground
- 7692-7711 🌍 ปุ่มลัดเข้าโลก 3D ในรางเมนูซ้าย (ผู้ใช้สั่ง 9 ก.ค. 2026)
- 7712-7777 🔒 รอบ 1070/1132: โลกที่ยังไม่เปิดสาธารณะ — เปิดให้บัญชีทดสอบ 2 ชื่อเท่านั้น
- 7778-7916 ↩️🪙 รอบ 1143 — ธุรกรรมค่าเข้าเกม + คืนเงินเมื่อเกมเปิดไม่สำเร็จ
- 7917-8010 ☁️🧸 รอบ 1258 — เลือกตัวละคร Sky ก่อนเข้าโลก
- 8011-8194 🧭 ป้ายบอกทางของรางเมนูซ้าย (รอบ 601 · ผู้ใช้สั่ง 26 ก.ค. 2026)
- 8195-8364 การ์ดสวนผลไม้ (ข้อ 12): ซื้อต้นไม้ปลูกได้ไม่จำกัด แต่ละต้นออกผล
- 8365-8379 โรงงานผลิตสินค้า 🏭 + ตลาดขายต่อ (แนวคิดใหม่ 5 ก.ค. 2026)
- 8380-8403 โรงงานผลิต (แผง 🏭) — แยกออกจากตลาด (ผู้ใช้สั่ง 6 ก.ค. 2026)
- 8404-8678 ตลาดขายสินค้า (แผง 🏪) — แยกออกจากโรงงาน
- 8679-9687 🚗 รอบ 131: หมวดยานพาหนะ — โชว์รูมรถ 10 คัน (แคตตาล็อก 5 ช่อง/แถว)
- 9688-9751 ร้านสัตว์เลี้ยง (ซื้อเพิ่มได้ ไม่ลบตัวเดิม)
- 9752-9788 เลเวลอัพ (รายตัว)
- 9789-9894 สถิติผลการเรียนรู้
- 9895-9932 item 4: การ์ดสรุปส่งครู — ใบเดียวจบ ชื่อ/วัน-เวลา/เหรียญวันนี้/แรงค์/สอบล่าสุด
- 9933-10333 📞 หน้าจอโทรหาเพื่อน — สายเสียง (รอบ 625 · กลุ่ม 3 คน + ปิดวิดีโอ รอบ 631)
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
enterMotoMapAsCar:7581 · enterSoccer3D:7600 · enterMoto3D:7620 · enterF1_3D:7643 · enterInvasion3D:7671 · WORLD3D:7699
WORLD3D_COMING_SOON:7716 · world3DComingSoon:7717 · gotoRobotShop:7720 · openHealDialog:7726 · world3DFail:7747 · worldEntryStarted:7783
worldEntryStopped:7784 · GAME_ENTRY_STABLE_MS:7785 · gameEntryCommit:7787 · gameEntryRefund:7795 · recoverInterruptedGameEntry:7812 · showGameEntryRefundNotice:7820
startWorldEntry:7847 · railWorldClick:7892 · skyEntryCatalog:7921 · skyEntryPickerHTML:7925 · openWorldEntryDialog:7936 · railScrollHint:8016
railScrollTop:8024 · initRailScroll:8029 · renderRailWorlds:8049 · tinvOnlineFriends:8132 · refreshTinvOnlineUI:8136 · tinvNoticeHTML:8147
openTinvPicker:8156 · fruitCountdown:8200 · renderFarmCard:8212 · renderFarmClock:8287 · buyFruit:8303 · sellFruit:8323
sellAllFruit:8344 · collectImg:8373 · renderFactoryCard:8384 · renderMarketCard:8408 · updateWishBadge:8466 · openWishlistDialog:8477
bindStripArrows:8524 · renderMarketBrowse:8538 · openMarketBuyDialog:8565 · carImg:8685 · renderVehicleShop:8686 · CS_CYCLE_MS:8738
carInteriorImg:8739 · carStatHtml:8741 · renderCarShowroom:8748 · csShowBig:8775 · csInit:8802 · RS_CYCLE_MS:8825
robotImg:8826 · renderRobotShop:8827 · renderPetMarketShop:8851 · rsShowBig:8869 · rsInit:8890 · buyRobot:8909
enterMecha3D:8934 · pickMechaRobot:8962 · pickDriveCar:8994 · openCarBuyDialog:9037 · buyCarInsurance:9098 · payCarLoanMonthly:9117
payCarLoanFull:9129 · carDriveBlock:9148 · gotoVehicleShop:9153 · gotoMyStock:9158 · showNeedCarDialog:9164 · craftDiscount:9176
renderFactory:9179 · renderOrdersUI:9248 · startProduce:9267 · buyCollectible:9295 · cancelProduce:9325 · deliverOrder:9339
renderOrderClock:9356 · renderCollectMine:9366 · openListDialog:9415 · cancelListing:9472 · buyMarketItem:9496 · showCollectReveal:9561
buyAC:9599 · openHomeShop:9618 · openPetPurchase:9692 · renderPetShop:9730 · showLevelUp:9755 · renderStats:9792
showTeacherCard:9899 · CALL_REACT_EMOS:9943 · CALL_TALK_MIN:9946 · CALL_TALK_HOLD:9947 · CALL_ORDER_GAP:9949 · CALL_TONES:9955
startCall:10329

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

## css/frontline1944.css (630 บรรทัด · 22 selector)
#vw-frontline1944:19,37,55,613 · .fl44-hud:73 · .fl44-top:91 · .fl44-panel:109 · .fl44-player:127 · .fl44-bar:145
.fl44-word:163 · .fl44-coins:181 · .fl44-boss:199 · .fl44-objective:217 · .fl44-state:235 · .fl44-exit:253
.fl44-controls:271 · .fl44-stick:289,307,325 · .fl44-knob:343 · .fl44-aim-knob:361 · .fl44-aim-stick:373 · .fl44-fire:391,403
.fl44-input-diag:421,433 · .fl44-toast:451 · .fl44-loading:469 · #btn-rail-frontline1944:487,505

## css/home-v2.css (2,479 บรรทัด · 136 selector)
:root:9,2467 · #screen-dashboard:36,46 · #vw-home-v2-root:48,49,59,60(+112) · .vw2-screen-frame:81 · .vw2-sky:82,83,92,99(+1) · .vw2-shell:102,107,589
.vw2-glass:111 · .vw2-top:124,639,786,975(+2) · .vw2-profile:129,143,147,289(+3) · .vw2-kanok-corner:148 · .vw2-profile-crown:149 · .vw2-profile-kicker:150,151
.vw2-avatar-frame:152,157,295,296(+1) · .vw2-avatar:158,159,1972,1976(+3) · .vw2-avatar-edit:160,2029 · .vw2-profile-main:161,1891 · .vw2-name-row:162,163,1892 · .vw2-pencil:164
.vw2-profile-meta:165,1827,1893 · .vw2-profile-meta-chip:166,167,168,169(+12) · .vw2-grade-identity:170 · .vw2-grade-copy:171 · .vw2-profile-chips:172,1906 · .vw2-achievement-mark:173,1907
.vw2-rank:174,298,1908 · .vw2-sync-chip:175 · .vw2-wallet:177,643,788 · .vw2-wallet-pill:178,184,185,186(+39) · .vw2-stat-art:188 · .vw2-stat-copy:189
.vw2-top-actions:191,500 · .vw2-tool-btn:192,198,199,316(+11) · .vw2-main-grid:202,590,718,947 · .vw2-left:205,206,321,524 · .vw2-rail-btn:207,322,1298,1299(+3) · .vw2-rail-art:208,209,210,211(+4)
.vw2-rail-scene:212,213 · .vw2-rail-scene-mark:214,327 · .vw2-rail-label:215,328,719,1342 · .vw2-left-scroll-cue:216,526 · .vw2-feed:219,220,332,333(+26) · .vw2-section-head:221,222,223,342(+5)
.vw2-feed-items:224,887,1021,1863(+1) · .vw2-feed-card:225,343 · .vw2-feed-avatar:226 · .vw2-feed-copy:227 · .vw2-feed-coin:228,902,1027,1036(+2) · .vw2-feature:231,706,819,1271
.vw2-feature-title:232,233,346,347(+12) · .vw2-word-ribbon:234,235,236,348(+8) · .vw2-feature-stage:237,352,353,594(+1) · .vw2-world-scene:238,595,828 · .vw2-stage-depth:239,240,241,354(+2) · .vw2-stage-castle:242,356,596
.vw2-atmosphere:243 · .vw2-speech:244,357,358,359(+5) · .vw2-reward-card:245,360,361,362(+7) · .vw2-pet-halo:246,247,599 · .vw2-pedestal-aura:248,249,365 · .vw2-pet-platform:250,251,252,363(+1)
.vw2-pet:253,366,696,703(+3) · .vw2-pet-sparkles:254 · .vw2-house-preview:255 · .vw2-stage-copy:256,370,1184,1185(+1) · .vw2-feature-actions:257,373,374,829(+5) · .vw2-right:260,496
.vw2-mission:261,334,339,497(+1) · .vw2-quests:262,498,888 · .vw2-quest-row:263,1280 · .vw2-online:264,335,340,529(+2) · .vw2-online-row:265,1201 · .vw2-friends-btn:266,531,536,1206(+1)
.vw2-bottom:269,270,380,450(+14) · .vw2-mode:271,381,382,383(+27) · .vw2-preview-mark:272,600 · .vw2-home-active:275,276,277,2005(+3) · .vw2-rail-racing:323,329,525,1340 · .vw2-house-preview-head:367,368,495,1187(+3)
.vw2-stage-foreground:369,598,1051 · .vw2-enter:375 · .vw2-play:376 · .vw2-shop-link:377 · .vw2-bottom-scroll:456,475,476,477(+6) · .vw2-bottom-track:478,488,520,521(+42)
.vw2-online-list:499,530,889,1200 · .vw2-word-kicker:709,852,1273,2094(+1) · .vw2-word-copy:710,711,712,853(+7) · .vw2-word-reward:713,856,2107 · .vw2-feed-market-divider:892,893,894,1038 · .vw2-feed-market-note:895
.vw2-market-feed-card:896,897,898,1192(+3) · .vw2-feed-product:899,900 · .vw2-market-seller:901,1196 · .no-anim:980 · .vw2-house-backdrop:1189,1981 · .vw2-online-name-line:1202,1203
.vw2-online-badges:1204 · .vw2-online-copy:1205 · .vw2-rail-cure:1209,1210,1211,1212 · .vw2-online-modal-open:1216 · .vw2-online-modal:1217,1218 · .vw2-online-modal-panel:1219,1220
.vw2-online-modal-head:1221,1222,1228 · .vw2-online-modal-emblem:1223,1224 · .vw2-online-modal-heading:1225,1226,1227 · .vw2-online-modal-close:1229,1230,1239 · .vw2-online-modal-list:1231,1232,1233,1234(+3) · .vw2-online-modal-foot:1238
.vw2-qbody:1281 · .vw2-feature-action-scroll:1382,1395,1396,2032 · .vw2-feature-action-track:1397,1407,1415,1429(+5) · .vw2-pet-name-action:1431 · .vw2-owned-pets-action:1432 · .vw2-pet-modal-open:1436
.vw2-pet-modal:1437,1438 · .vw2-pet-modal-panel:1439,1440,1501 · .vw2-pet-modal-head:1441,1442,1445,1446(+3) · .vw2-pet-modal-emblem:1443,1444 · .vw2-pet-modal-close:1449,1450,1465 · .vw2-pet-modal-list:1451,1452
.vw2-owned-pet-card:1453,1454,1455,1462 · .vw2-owned-pet-thumb:1456,1457,1458 · .vw2-owned-pet-copy:1459,1460,1461 · .vw2-pet-modal-empty:1463 · .vw2-pet-modal-foot:1464 · .vw2-pet-modal-healbar:1503
.vw2-heal-all:1504,1505,1506,1511(+3) · .vw2-heal-all-icon:1507 · .vw2-heal-all-copy:1508,1509,1510 · .vw2-adventure-hub:1537,1543,1544,1545(+22) · .vw2-adventure-landmark:1551,1555,1556,1623(+1) · .vw2-adventure-copy:1557,1558,1559,1628(+2)
.vw2-adventure-menu:1563,1564,1574,1575(+15) · .vw2-adventure-menu-panel:1565,1566,1567,1568(+8) · .vw2-adventure-menu-scroll:1571,1572 · .vw2-adventure-menu-track:1573,1644

## css/lettercannon.css (89 บรรทัด · 30 selector)
#lc-game:6,7,13,14(+30) · .lc-hud:8 · .lc-glass:9 · .lc-stats:10 · .lc-stat:11,12 · .lc-coin-stat:15
.lc-wordbox:16 · .lc-target:17 · .lc-meaning:18 · .lc-progress:19 · .lc-slot:20,21 · .lc-actions:23
.lc-iconbtn:24,25 · .lc-exitwide:26 · .lc-power:27 · .lc-power-name:28 · .lc-hint:29 · .lc-move:30,31
.lc-modal:32,33 · .lc-count-exit:34 · .lc-card:35,36 · .lc-result-card:37,40 · .lc-result-grid:38,39 · .lc-btn:42
.lc-count:43 · .lc-toast:45 · .lc-coinfx:47 · .lc-coin-flight:48 · .lc-announce:51 · .lc-rotate:52

## css/lobby.css (6,237 บรรทัด · 842 selector)
:root:6,5914 · html:15 · body:21,5878,5920 · *:41,42,43,44 · #app:47 · h1:49
.subtitle:50 · .shop-title:51 · .screen:57 · #screen-select:66,67,68,69(+5) · .egg-need:76 · .petshop-topright:78
.petshop-play-link:79,84 · #screen-login:97,110,111,115(+12) · .login-lux:128 · .login-logo:129 · .login-tag:134 · #screen-game:206,207,208,209(+7)
#screen-quiz:220,221,222,223(+6) · #quiz-choices:232,233 · .word-card:240 · .quiz-choice:241,242,243 · .big-btn:246,247,248,249 · #screen-dashboard:254,1171,1179
.lobby-top:268,903,904,905(+36) · .top-flex:269 · .profile-plate:270,274,824,4142(+12) · #rain-fx:279 · .rain-glass:283 · .glass-drop:284
.rain-vignette:303 · .no-anim:310,472,485,546(+64) · .rail-btn:313,925,931,933(+25) · .rail-badge:314 · .fr-code-box:319 · .fr-code-label:323
.fr-code-row:324 · .fr-code:325 · .fr-copy-btn:330,334,339,340 · .fr-search-btn:335 · .fr-add-btn:336 · .fr-accept:337
.fr-decline:338 · #fr-search-input:341 · #fr-search-result:345 · .fr-found:346 · .fr-hint:350 · .fr-list-title:351
.fr-row:352 · .fr-req:356 · .fr-row-name:358,362,5618 · .fr-row-status:366 · .fr-req-btns:367 · .online-dot:368
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
.call-emo:676,677 · .call-fx:679 · .call-fx-emo:680 · .pl-click:772,774,775 · .pl-overlay:776 · .pl-card:780,2955
.pl-close:786 · .pl-head:790,2712,2715 · .pl-grade:795,5624,5625 · .pl-body:796 · .pl-loading:797 · .pl-none:798
.pl-me-tag:799 · .pl-blk-wrap:801 · .pl-blk:802 · .pl-stat:803 · .pl-lbl:808 · .pl-val:809,810
.pl-tip:811 · .chip-edit:817,822,823 · .rank-mini:829,835,836,837 · .pass-photo:839,844 · .pet-tabs:846 · .dict-box:847,851,852,853(+1)
.dict-card:859,864,868,869(+2) · .dict-head:865,866 · .dict-trail:873,877 · .dt-c:878,882,883 · .dt-sep:884 · .dict-today:885
.di-w:887,888,889 · .dict-list:890 · .dict-item:891,895,896,897(+5) · .lobby-mid:911 · .rail-wrap:914,959,970,971 · .rail-scroll:916,953,957,958
.lobby-rail:917,924 · .rail-nudge:960,968,969,972(+1) · .rail-worlds:979 · .rail-div:980 · .lobby-stage:1031,1033,1049,1176(+13) · .newword-banner:1039,1046,1051,4972(+2)
.coin-fly:1062,1065 · .coin-plus:1071 · .nw-pop-coin:1086,1088,1089 · .nw-pop-goal:1092,1093,1097,1101 · .nw-goal-head:1094,1096,1098 · .nw-goal-bar:1099
.nw-goal-fill:1100 · .nw-pop-book:1102,1103 · .nw-tag:1124,4978,5000 · .nw-word:1129,4982,5005,5098 · .nw-hint:1131,1132,4983,5007(+1) · .nw-coin:1134,1137,4984,4988
.nw-countdown:1142,4989 · .nw-bar:1144,5008 · .nw-bar-fill:1146 · .pet-stage:1149,3249 · .nw-box:1156,3258 · .nw-pop-word:1157
.nw-speak:1158 · .nw-pop-phon:1159 · .nw-ipa:1160 · .nw-pop-sent:1161 · .nw-pop-mean:1162 · .pet-tab:1163,1164,1165,3752
.stage-hero:1186,1201,1209,1354(+29) · .hero-ground:1223,1343,1349 · .hero-rank-bg:1225,1228,1231,1235(+18) · #lobby3d-canvas:1248,1249 · .hero-scene:1253,1255,1262,1263(+8) · .caretaker-fig:1302
.caretaker-img:1305 · .caretaker-emoji:1307 · .blk-rig:1314,1315,1316 · .stage-plate:1376,1384,1395,1396(+23) · .plate-title:1390 · .lobby-side:1423,1459,1464,1467(+22)
.side-sec:1426,2335,3647,4118 · .side-label:1427,1432 · .side-label-row:1435,1436 · .lb-tabs-out:1437,1438,1442 · .side-glass:1446,1453 · .side-card:1465,1576
#quest-card:1477,1478,1506,1507(+6) · .q-bigcard:1483,1512 · .qb-top:1485 · .qb-emoji:1486 · .qb-name:1488 · .qb-bar:1489,1490
.qb-row:1492 · .qb-prog:1493 · .qb-reward:1494 · .qb-go:1495,1499 · .q-dots:1500 · .q-dot:1501,1502,1503
.q-bonus:1504 · .inv-card:1523,1525,1526 · .inv-btns:1527 · .inv-go:1528,1530 · .inv-x:1531 · #online-card:1535,3655,3656,3657(+7)
.fq-overlay:1536 · .fq-box:1538,3460 · .fq-head:1542,1544 · .fq-close:1545 · .fq-sec:1547 · .fq-worlds:1548
.fq-world:1549,1551 · .fq-acts:1552 · .fq-act:1553,1556,1557 · .lb-prize:1590 · .lb-coins:1593 · .lbf-cell:1594,2794,2797,2798(+3)
.lb-award-bar:1596,1602,1603 · .lb-award-go:1604 · .lbf-award:1606,1612,1613,1614 · .pod-pz:1615 · .wsa-overlay:1618 · .wsa-box:1620
.wsa-head:1625 · .wsa-title:1626 · .wsa-when:1627,1628 · .wsa-close:1629,1632 · .wsa-cols:1633 · .wsa-col:1634
.wsa-sec-h:1635,1636 · .wsa-msg:1637 · .wsa-msg-h:1640 · .wsa-msg-b:1641,1642 · .wsa-msg-none:1643 · .wsa-rules:1645,1646
.wsa-list:1647 · .wsa-row:1648,1650 · .wsa-r:1651 · .wsa-n:1652 · .wsa-s:1653 · .wsa-p:1654
.wsa-prizes:1655 · .wsa-pz:1656,1659 · .wsa-reveal-medal:1660 · .lobby-bottom:1675,1678,1679,1681(+9) · .rail-onet:1694 · .lobby-quiz-btn:1695
.lobby-book-btn:1696,1697 · .lobby-play-btn:1699,1703 · .lobby-exam-btn:1705,1706,1708 · .panel-overlay:1713,1718,5113,5114(+8) · .panel-box:1719 · .panel-head:1726,1730
.panel-close:1731,1736 · .panel-body:1737,1741,1742 · .panel-page:1739,1740 · .collect-sub:1746 · .mkt-empty:1747 · .craft-box:1748
.mkt-listing:1749 · .mkt-filter:1750,2155 · .hq-grid:1757 · .hq-card:1758,1763,1787 · .hq-head:1764 · .hq-pic:1770,1772
.hq-emoji:1774 · .hq-badge:1775 · .hq-stars:1779 · .hq-price:1780,1785,1786,1789(+6) · .craft-credit:1793,1795,1796 · .car-grid:1803,1805,1806
.robot-weap:1807 · .dmap-box:1810,1811 · .dmap-grid:1817 · .dmap-card:1819,1822,1823,1824(+2) · .dmap-ico:1826 · .dmap-new:1829
.dcp-grid:1831 · .dcp-card:1833,1836,1837,1838(+10) · .levelup-box:1855,2079,2089,3212(+2) · .dcp-box:1858,1859,1863,1864(+6) · .dcp-lock:1872 · .sold-badge:1876,1878,1879
.rs-showroom:1881,5576,5577 · .rs-list:1882,1884,5557,5560 · .rs-thumb:1885,1887,1888,1889(+1) · .rs-thumb-pic:1890,1891 · .rs-thumb-price:1892 · .rs-stage:1894
.rs-big:1897 · .rs-big-img:1898 · .rs-elec:1902,1906,1911 · .rs-edge:1912,1918 · .rs-info:1921,1922,1923,1924(+1) · .rs-buy:1926,1928,1929
.cs-showroom:1933,5549,5550,5578(+3) · .cs-list:1934,1936,5551,5556(+9) · .cs-thumb:1937,1939,1940,1941(+1) · .cs-thumb-pic:1942,1943 · .cs-thumb-name:1944 · .cs-thumb-price:1945
.cs-thumb-own:1946 · .cs-stage:1948 · .cs-big:1951 · .cs-big-img:1952 · .cs-elec:1956,1960,1964 · .cs-edge:1965,1971
.cs-interior:1974 · .cs-inr-label:1975,1976 · .cs-inr-img:1977 · .cs-info:1979,1980,1981,1982(+6) · .cs-buy:1990,1992,1993,1994 · .car-emoji:1996
.car-mine:2002 · .car-mine-pic:2007 · .car-mine-info:2008 · .car-loan:2009,2010 · .car-mine-btns:2011,2012,2013 · .car-locked:2015
.car-mine-head:2017 · .car-pick-list:2018,2019 · .car-pick:2020,2022,2023 · .car-pick-pic:2024,2025 · .car-pick-name:2026,2027 · .car-pick-od:2028
.car-buy-box:2030,3464 · .cb-pic:2031,2032,2033 · .cb-lines:2034 · .cb-li:2035,2039,2040 · .cb-ins:2041,2045,2046 · .cb-plan:2047
.cb-pl:2048,2053,2055,2059(+1) · .cb-total:2066 · .cb-btns:2067,2072 · .cb-x:2068 · .dress-overlay:2075,2092,2095,2099 · .dress-title:2093,2094,2096
.dress-wallet:2097 · #shop-grid-wrap:2101 · .shop-grid:2102 · .shop-item:2103,2111,2112,2113(+13) · .it-topline:2119 · .it-rarity:2120,2121
.it-type:2122 · .it-art-stage:2123 · .it-art:2125 · .it-emoji:2126 · .it-sparkle:2127 · .it-action:2131
.mkt-tab:2156,2157 · .pg-btn:2158,2159,2160 · .pg-dot:2161 · .fr-gift-btn:2195,2200 · .gift-sec-title:2203 · .gift-in-row:2205
.gift-out-row:2209 · .gift-in-pic:2210,2212,2213 · .gift-in-info:2214,2215 · .gift-in-btns:2216 · .gift-accept:2217,2221,2223 · .gift-decline:2222
.gift-box-card:2224 · .gift-box-from:2225,2226 · .gift-note:2227 · .gift-pick-overlay:2230 · .gift-pick-box:2234 · .gift-pick-head:2240,2244
.gift-pick-close:2245 · .gift-pick-tabs:2247 · .gp-tab:2248,2252 · .gift-pick-body:2253 · .gp-chips:2254 · .gp-chip:2255,2259
.gp-card:2260,2261 · .gp-price:2262 · .gp-note:2263 · .gift-cf-pic:2264 · .chat-emoji-cats:2269 · .chat-emoji-cat:2273,2277,2278
.chat-emoji-wrap:2279,2280 · .stage-left:2289,5104 · .pet-info-btn:2293,2300,2301 · .feed-list:2308,2312,2337,2338(+1) · .feed-empty:2313,2316 · .fd-tools:2322
.feed-bell:2323,2325,2326,2327 · .fd-prog:2331,2332 · .fpost:2339,3094 · .fp-head:2344 · .fp-who:2345 · .fp-name-line:2348
.fp-name:2349 · .fp-when:2350 · .fp-badges:2352,2355 · .fp-badge-ic:2353 · .fp-text:2357 · .fp-media:2360
.fp-img:2362 · .fp-cap:2364 · .fp-big:2365 · .fp-sum:2367,2369 · .fp-sum-rx:2370 · .fp-sum-none:2371
.fp-en:2372 · .fp-bar:2374 · .fp-act:2375,2379,2381 · .fp-like:2380 · .fp-page:2392,2393,2394,2395(+3) · .fp-rxbox:2398
.fp-rxb:2402,2404,2405,2406(+1) · .fp-rxb-off:2408 · .fp-fly:2410,2413,2414 · .fcm-overlay:2417 · .fcm-box:2419 · .fcm-post:2423,2424
.fcm-rxs:2425 · .fcm-rx:2426 · .fcm-list:2427,2429 · .fcm-row:2430,2431,2432 · .fcm-none:2433 · .fcm-item:2435
.fcm-reps:2436 · .fcm-rep:2438 · .fcm-more:2440,2442 · .fcm-arrow:2443 · .fcm-reply:2444,2446 · .fcm-like:2448,2451,2452,2453
.fcm-likeic:2454 · .fcm-cnt:2456,2458 · .fcm-likers-box:2459 · .fcm-likers-list:2460,2462 · .fcm-liker-row:2463 · .fcm-liker-none:2464
.fcm-repbar:2465,2468 · .fcm-repx:2469 · .fcm-note:2471 · .fcm-quick:2473,2475 · .fcm-q:2476,2479,2480 · .fcm-add:2481
.fcm-input:2482,2484 · .fcm-send:2485,2487 · .fcm-locked:2488 · .fnt-overlay:2490 · .fnt-box:2492 · .fnt-list:2496,2498
.fnt-row:2499,2501,2514 · .fnt-ico:2502 · .fnt-tx:2503,2504 · .fnt-sub:2505 · .fnt-hint:2507 · .fnt-go:2508,2511,2512,2520
.fnt-tag:2515 · .fnt-note:2517 · .fcm-hl:2522 · .feed-plate:2530 · .feed-all-btn:2531,2536 · .fdb-overlay:2541
.fdb-box:2543 · .fdb-head:2547 · .fdb-close:2551,2553 · .fdb-live:2554 · .fdb-live-title:2555 · .fdb-live-rows:2557,2559,2560
.fdb-live-row:2561,2563,2564,2565 · .fdb-dot:2566 · .fdb-list:2568,2569 · .fdb-empty:2570 · .fdb-row:2571 · .fdb-row-top:2573
.fdb-ico:2574 · .fdb-txt:2575 · .fdb-name:2576 · .fdb-ago:2577 · .fdb-actions:2578 · .fdb-like:2579,2582,2583,2584
.fdb-cm-list:2585 · .fdb-cm-row:2586,2588 · .fdb-cm-empty:2589 · .fdb-cm-add:2590 · .fdb-cm-input:2591,2593 · .fdb-cm-send:2594,2596
.fdb-cm-locked:2597 · .pi-overlay:2600 · .pi-box:2604,2608,2609,2613(+13) · .pi-close:2615,2620,2621 · .pi-close-left:2623 · .pi-close-bottom:2624,2630
.pi-portrait:2654 · .pet-wear:2661,2664,2666 · .pi-portrait-wrap:2669,2671 · .pi-dress-btn:2679,2683,2684 · .pi-shape-cap:2685,2688,2689,2690 · .pi-shape-toggle-btn:2692,2695
.pi-dress-pip:2697,2702,2703,2704(+1) · .pi-wear-note:2707,2709 · .greet-card:2716 · .greet-sub:2717 · .greet-grid:2718 · .greet-opt:2719,2722,2723,2724
.greet-e:2725 · .pi-streak:2729 · .pi-streak-head:2731,2733 · .pi-streak-best:2734 · .pi-dots:2735 · .pi-dot:2737,2738,2739
.pi-streak-note:2740 · .pi-care-title:2741 · .lbf-overlay:2754 · .lbf-box:2757,2771,2772,2773(+13) · .lbf-head:2762 · .lbf-title:2763
.lbf-tabs:2764,2767 · .lbf-note:2770 · .lbf-close:2786 · .lbf-close-l:2787 · .lbf-scroll:2788,2790,2915 · .lbf-body:2791
.lbf-grid:2792 · .lbf-box-bcat:2815 · .lbf-bcat-wrap:2816 · .lbf-bcat:2818,2877,2878,2879(+3) · .lbf-bcat-head:2820,2821,2822 · .lbf-bcat-mid:2829
.lbf-bcat-badge:2830,2889 · .lbcat-ic:2840 · .badge-shine-img:2846 · .badge-shine:2864,2865 · .lbcat-ic-label:2891 · .lbf-bcat-rows:2893
.lbf-one-row:2897,2898,2899 · .lbf-bcat-row:2900,2902,2903,2905 · .lbf-podium:2921 · .pod:2923,2950,2951 · .pod-char:2925 · .pod-base:2927
.pod-rank:2929 · .pod-label:2931,5620 · .pod-name:2933 · .pod-sc:2935 · .pod-1:2940,2941 · .pod-2:2942,2943
.pod-3:2944,2945 · .pod-4:2946,2947 · .pod-5:2948,2949 · .pl-wide:2968,2971,2972,2973(+8) · .pl-follow:2974,2979,2981 · .pl-unfollow:2983,2989,2990
.pl-followers:2991 · .pl-cols:2992,2997,2998,2999 · .pl-col:2993 · .pl-sec-title:2994 · .pl-badges-col:3000 · .pl-feed:3001,3004,3011
.pl-feed-row:3005,3009,3010 · .pl-assets-wrap:3013,5457,5532 · .pl-assets:3014,5460,5465,5471(+4) · .pl-asset:3017,3021,3028 · .pl-asset-emoji:3022 · .pl-asset-n:3023
.pl-pets-wrap:3030 · .pl-pets:3031 · .pl-pet:3032,3037,3039 · .pl-pet-nm:3040 · .img-lightbox:3043,3048,3049,3053(+3) · .cert-svg:3072
.cert-tap:3073,3078 · .cert-chip-sm:3081 · .pl-sec-sub:3101 · .pl-certs:3102,3104 · .cert-mini:3105,3109,3111 · .cert-mini-cap:3112
.cert-none:3114 · .lv-cert-row:3116,3118 · .lv-cert-btn:3119,3124 · .cert-lightbox:3126,3131,3132,3136(+3) · .pl-chat:3156,3161 · .pl-call:3163,3169
.pet-peek:3170,3171 · .pp-chips:3173 · .pp-chip:3174 · .pp-gift:3179,3185 · .settings-box:3187,3188,3261,3272(+37) · .set-feed-head:3189
.set-feed-sub:3193 · .set-feed-row:3194 · .pillinfo-val:3199 · .pillinfo-desc:3204,3223 · .pillinfo-box:3215 · .plf-head:3218
.plf-emoji:3219 · .plf-ht:3220,3221,3222 · .plf-foot:3224,3226,3227 · .alert-box:3232,3234 · .ab-emoji:3235 · .ab-title:3236
.ab-desc:3237 · .ab-btns:3238,3239,3240 · .heal-heart:3242 · .attn-box:3257 · .set-tabs:3282,3286,3289,3290 · .set-attention-ico:3299
.set-attention-copy:3300,3301,3302 · .set-attention-go:3303 · .set-panels:3304 · .set-panel:3305,3308,3309,3311 · .set-offline-card:3312 · .set-pack-icon:3319
.set-pack-copy:3324,3325,3326,3327 · .set-pack-progress:3328,3330 · .set-pack-actions:3332 · .help-box:3438,3439,3440 · .wl-box:3458 · .food-box:3459
.home-shop-box:3461 · .summary-box:3462 · .report-box:3463 · .wl-grid:3466 · .tc-wrap:3468 · .spell-btn:3474,3479,3480
.sp-hud:3481 · .sp-word:3483 · .sp-ch:3484,3489 · .sp-th:3491 · .sp-hint:3493 · .sp-exit:3496,3500
.sp-banner:3501 · .sp-big:3506 · .sp-thb:3508 · .sp-coin:3509 · #spell-confetti:3514 · .sp-rb:3515
.sp-day:3525 · .sp-perfect:3527 · .sp-late:3529 · #spell-coinpop:3532 · .side-sub:3641,3643 · .sec-quest:3648
.on-page:3660,3661,3662,3663 · .inbox-overlay:3673 · .ib-box:3675 · .ib-head:3679 · .ib-close:3683,3685 · .ib-list:3686,3687
.ib-row:3688,3689,3690,3691 · .ib-ava:3692,3697,3698 · .ib-on:3699 · .ib-mid:3701 · .ib-name:3702 · .ib-last:3703
.ib-meta:3704 · .ib-time:3705 · .ib-dot:3707 · .ib-story-badge:3710 · .ib-empty:3714 · .ib-story:3716,3718
.ib-story-item:3719,3721,3728 · .ib-story-ava:3722 · .ib-story-on:3726 · .ib-world:3731,3734 · .ib-tabs:3736 · .ib-tab:3737,3740,3742
.ib-tab-dot:3743 · .ib-call-ava:3747 · .ib-call-row:3748,3749 · #btn-music:3755,3758,3759 · #ws-overlay:3774,3954 · #ws-board:3777,3783,3785,3962(+3)
.ws-head:3788,3991,3992 · .ws-title:3789,3993,4000,4001 · .ws-findbar:3792,4002 · .ws-tip:3793,4008 · #ws-combo-clock:3795,3797,3799,3800(+2) · .ws-grade:3805,3806,4013,4019
.ws-body:3809,4020 · .ws-gridwrap:3810,4050 · #ws-grid:3813,4055 · .ws-cell:3818,3823,3825,3828(+6) · .ws-flash:3834,3836,4082 · .ws-coinpop:3840,3864
.ws-combo:3851,3855,3856,3857 · .ws-find:3868,4007 · #ws-prog:3869,4009 · #ws-words:3873,3877,4021 · .ws-word:3879,3884,3885,3886(+16) · .ws-actions:3894,3895,3904,4069(+1)
.ws-sizes:3899,4075 · .ws-sizes-lb:3901,4076 · .ws-size-now:3902,4077 · #ws-new:3905,4078 · #ws-combo-help:3906,4079 · #ws-stash:3907,4080
#ws-clear:3908,4081 · #ws-combo-dialog:3910,3911 · .ws-combo-card:3913,3916,3923,3924 · .ws-combo-lead:3917 · .ws-combo-steps:3918,3919,3921,3922 · .ws-combo-close:3925
.ws-combo-ok:3927 · #ws-win:3928,3930,4083 · .ws-win-in:3931,3934,4084,4085 · .sec-online:4120 · .rank-tab:4150,4151,4152,4153(+2) · .pet-show-bg:4183,4185,4187,4192(+22)
.bond-context:4296 · .bond-owner:4298,4301,4303 · .bond-owner-heart:4304 · .bond-talk:4306,4310,4312,4313(+6) · .bond-home-card:4320,4325,4326 · .bond-home-art:4327
.bond-home-img:4329 · .bond-home-empty:4331 · .bond-home-copy:4332,4333,4334,4335 · .bond-home-go:4336 · .bond-gear:4338,4342 · .ps-night-fx:4368,4370,4382,4387(+1)
.pet-show:4397,4400,4412,4414(+63) · .ps-video:4681 · .ps-worn-pip:4759,4760 · .id-card:4783,4790,4794 · .id-chip:4807 · .clock-chip:4816,4817
.coin-block:4833 · .coin-subrow:4834 · .coin-group:4835 · .coin-pill:4865,4866,4887 · .cp-lb:4890 · .cp-v:4891
.topbar-icons:4927 · .topbar-icons-row:4928 · .rank-move-box:4945 · .rank-move-head:4950 · .rank-move-feed:4954,4958,4959 · .rank-move-row:4960,4964
.rank-move-up:4965 · .rank-move-name:4966 · .rank-move-topic:4967 · .rank-move-empty:4968 · .rank-move-gap:4969 · .nw-sub:5006
.top-flex2:5101 · #panel-factory:5120,5121,5125,5126(+39) · #panel-rank:5261,5262,5268,5273(+11) · .grid2x8:5344,5350 · .pl-badges-vwrap:5359,5374 · .grid3x5:5360,5365
.pl-badge-arrow:5366,5372 · .pba-u:5373 · .pl-badges-strip:5378,5386,5387 · .pl-badge-card:5388,5394,5412,5413(+1) · .pl-badge-card-ic:5400,5409,5411 · .pl-badge-card-nm:5415
.pl-badges-empty:5421,5423 · .mine-strip:5437,5439,5440,5445(+4) · .mb-strip:5451,5490 · .gmark:5598,5602,5603,5604(+1) · .gm-stack:5607,5611 · .gm-row:5613
.lb-name:5615,5616,5617 · .grade-edit:5638,5643,5644 · .gradelock-box:5648,5664,5669,5671 · .gl-head:5649 · .gl-emoji:5650 · .gl-ht:5651
.gl-cur:5652 · .gl-lock:5653,5658 · .gl-ok:5657 · .gl-lock-sub:5659 · .gl-why:5660 · .gl-pick-lb:5661
.gl-opts:5662 · .gl-hist:5672 · .gl-hline:5673 · .gl-hg:5677 · .gl-hat:5678 · .gl-harr:5679
.gl-foot:5680 · .gl-cf:5681 · .reg-gradelock:5703 · #tp-overlay:5713 · #tp-board:5715,5719 · .tp-head:5723
.tp-title:5724 · .tp-stat:5726,5728 · .tp-pts:5730,5733 · .tp-close:5735,5741,5742 · .tp-snd:5745,5748,5754,5755 · .tp-snd-ic:5749
.tp-snd-track:5750 · .tp-snd-thumb:5752 · .tp-prompt:5759 · .tp-word:5761,5775,5776 · .tp-ch:5763,5768,5769,5771 · .tp-thai:5779
.tp-hint:5781 · .tp-empty:5783 · .tp-keys:5786 · .tp-row:5788 · .tp-row-fn:5790,5823 · .tp-key:5794,5806,5808,5814(+2)
.tp-key-fn:5821 · .tp-fx:5827 · .tp-coinpop:5828 · .tp-pop-pt:5833 · #city-backdrop:5847,5853 · .city-arrive:5854,5855
.night:5869,5889,5890,5892(+2) · #night-veil:5915 · .theme-emerald:5944,5956,5963,5966(+7) · .theme-plum:5949,5960,5964,5967(+3) · #theme-veil:5977 · #screen-picmatch:6032,6038,6039,6040(+41)
.pm-category-btn:6078,6081 · .pm-sheet-card-img:6082 · .pm-card:6085,6090,6094,6096(+9) · .pm-grid:6088 · .pm-right:6118 · .pm-now:6119,6125
#pm-now-en:6126 · .pm-now-th:6127 · .pm-lobby-btn:6135,6139 · .pm-mode-btn:6164,6167 · .pm-wordcard:6168,6169,6171 · .mkt-pet-head:6206
.mkt-pet-wrap:6207 · .mkt-pet-list:6208 · .mkt-pet-card:6209,6216,6217,6218(+3) · .mkt-pet-picture:6220,6221,6222 · .mkt-pet-name:6223 · .mkt-pet-stage:6224
.mkt-pet-price:6225 · .mkt-pet-short:6227

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

## css/style.css (2,488 บรรทัด · 604 selector)
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
.quiz-choice:1415,1420,1421,1422 · .quiz-score-pill:1423 · .quiz-time-pill:1425,1427 · .stats-card:1430 · .stats-title:1434,2018 · .stats-row:1435,1436,1437,1438
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
.levelup-overlay:1917,1923,1924 · .levelup-box:1925,1932,1933,1934(+4) · .bill-box:1940,1944,1945 · .tag-off:1946 · .home-decayed-img:1947 · .home-dark-img:1948
.thirst-fill:1949 · .thirst-text:1950,1951 · .toxin-fill:1954 · .toxin-text:1955,1956 · .detox-btn:1957,1962 · .shape-text:1965,1966,1967,1968(+1)
.avatar-pick:1972 · .avatar-opt:1973,1977,1978,1979 · .avatar-chip-img:1983 · .mini-av:1985 · .fp-ava:1986 · .avatar-chip-blk:1988
.set-avatar-btns:1989 · .avatar-mini:1990,1994 · .set-blk-row:1996 · .set-sub2:1997 · .blk-grid:1999 · .blk-mini:2000,2003,2004,2005
.game-avatar:2008,2009,2010 · .stats-nick:2019 · .ticket-owned:2022,2026 · .collect-sub:2031 · .mkt-tabs:2032 · .mkt-tab:2033,2037
.mkt-filter:2038 · .mkt-row:2042 · .mkt-emoji:2046,2047 · .mkt-info:2048,2049 · .mkt-tier-stars:2050 · .mkt-buy:2051,2056,2057
.mkt-price-lo:2058 · .mkt-price-hi:2059 · .mkt-empty:2060 · .collect-grid:2063 · .collect-cell:2064 · .cc-emoji:2065,2066
.cc-name:2067 · .cc-count:2068 · .cc-list-btn:2069,2073 · .mkt-listhead:2074 · .mkt-group-head:2076,2082 · .mkt-two-col:2084,2085,2089,2101(+8)
#phone-card:2090,2106 · #computer-card:2091,2107 · #ticket-card:2093 · #haunt-card:2094 · #heli-card:2095 · #drone-card:2096
#drive-card:2097 · #soccer-card:2098 · #moto-card:2099 · #invasion-card:2100 · .mkt-listing:2128 · .ml-cancel:2132
.mkt-sold:2138,2139,2140 · .mkt-buy-box:2145,2151 · .mkt-buy-item:2152 · .mkt-buy-pic:2162 · .mkt-buy-pic-img:2174 · .mkt-buy-pic-emoji:2175
.mkt-buy-meta:2176 · .mkt-buy-name:2177 · .mkt-buy-seller:2178,2179 · .mkt-buy-price:2180 · .mkt-buy-balance:2181 · .mkt-confirm-code-title:2182
.mkt-code-target:2183 · .mkt-pin-note:2196 · .mkt-code-input:2197 · .mkt-code-error:2212 · .mkt-pin-grid:2221 · .mkt-pin-btn:2226,2238
.mkt-pin-del:2239 · .mkt-pin-clear:2240 · .mkt-buy-actions:2241,2247 · .mkt-buy-cancel:2258 · .mkt-buy-confirm:2263,2269 · .list-dialog:2290,2291,2296
.list-hint:2295 · .collect-reveal-frame:2299,2306 · .collect-reveal-img:2305 · .collect-reveal-stars:2307 · .craft-box:2310 · .craft-head:2311
.craft-bar:2312 · .craft-fill:2313 · .craft-text:2314 · .craft-btn-row:2315,2316 · .craft-go-btn:2318,2324,2325,2328 · .craft-cancel:2336,2340
.mkt-catalog:2343,2344,2345 · .mkt-pager:2348 · .pg-btn:2349,2353,2354 · .pg-mid:2355 · .pg-dots:2356 · .pg-dot:2357,2358
.order-head:2359 · .order-row:2360,2365,2367,2369 · .order-deliver:2370,2375 · .order-need:2376 · .avatar-chip-photo:2382 · .pass-photo:2383
.pl-photo:2384 · .pp-cam:2389,2397 · .set-photo-row:2400,2406 · .ph-thumb:2407 · .ph-plus:2408 · .photo-box:2414,2415,2436,2440(+4)
.ph-now:2416 · .ph-now-img:2417,2421 · .ph-now-cap:2422 · .ph-warn:2423 · .ph-sync:2428,2431 · .ph-sync-wait:2432
.ph-sync-ok:2433 · .ph-sync-bad:2434 · .ph-btns:2435 · .ph-tip:2445 · .ph-stage:2447,2451 · .ph-cv:2452
.ph-ring:2453,2458 · .ph-zoom:2462 · .ph-foot:2463 · .ph-crop-box:2464
