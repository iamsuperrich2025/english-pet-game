# CODE_MAP.md — แผนที่โค้ด:บรรทัด (เจนอัตโนมัติโดย `tools/gen_code_map.py` — **ห้ามแก้มือ** เดี๋ยวโดนเขียนทับ)

> วิธีใช้: หาชื่อฟังก์ชัน/ค่าคงที่/selector ในไฟล์นี้ (Grep หรือกวาดตา) → `Read` ไฟล์จริง `offset=<บรรทัด>` `limit=40`
> 🗂️ ไฟล์อ้วนมี **สารบัญโซน** (`st-end ชื่อโซน`) — งานทั้งระบบ/โลก 3D: Grep ชื่อโซน → Read/Edit เฉพาะช่วงนั้น **ห้ามอ่านทั้งไฟล์** · เพิ่มระบบใหม่ในไฟล์อ้วนต้องครอบ banner `/* ==== */`+ชื่อโซน (สารบัญเจนเอง)
> css = index `selector:บรรทัดทุกจุดที่ประกาศ` (บั๊ก UI เริ่มหาที่นี่) · เจนใหม่ทุกครั้งที่รัน `python tools/rotate_handoff.py` · อัปเดต: 2026-09-15

## js/account-deletion.js (235 บรรทัด · 0 รายการ)

## js/adv3d_css.js (1,318 บรรทัด · 0 รายการ)

## js/adv3d_intro.js (86 บรรทัด · 0 รายการ)

## js/adv3d_tex.js (250 บรรทัด · 19 รายการ)
TILE_COLORS:9 · letterTexture:10 · letterTextureDark:27 · emojiTexture:40 · GHOST_IMG_MAX:52 · measureGhostBox:58
probeGhostImages:71 · whenGhostsReady:83 · ghostTexture:87 · ghostScareSrc:92 · AD_STYLES:100 · adBoardTexture:109
addAdBillboard:160 · ringAds:172 · BUILDING_TINTS:182 · FACADE_ROWS:184 · buildingFacadeTexture:185 · makePeerSprite:210
bind:246

## js/adventure3d.js (13,580 บรรทัด · 668 รายการ)
### 🗂️ สารบัญโซน js/adventure3d.js (Read/Edit เฉพาะช่วง)
- 1-217 adventure3d.js — โลก 3D First-person 2 โหมด (คิว 7725691507 ข้อ 8 + ต่อยอด)
- 218-322 ⚽ โหมดสนามฟุตบอล (โหมด soccer · รอบ 196) — เล็ง+ชาร์จพลังเตะบอลใส่ป้ายตัวอักษร
- 323-379 🤖 โหมดหุ่นยนต์นักรบ (โหมด mecha · รอบ 199) — มุมมองในหุ่นสูง 5m เดินยิงเอเลี่ยนตัวอักษร
- 380-525 📻 หอบังคับการบิน (รอบ 64 · รอบ 66 เปลี่ยนเป็นอังกฤษล้วนตามผู้ใช้สั่ง)
- 526-564 คำศัพท์ — ตามระดับชั้น + ไม่ซ้ำคำที่ประกอบแล้ว (8.1/8.6) · แยกคลังต่อโหมด
- 565-700 Texture ตัวอักษร / emoji / ป้ายชื่อผู้เล่น (canvas → sprite)
- 701-1025 🧸 รอบ 1200: ตัวละครผู้เล่น Soft Cuboid Chibi 3D (Drive / Haunted Hotel / Soccer)
- 1026-1333 🚙 รอบ 393: รถเพื่อนในโลกขับรถ = โมเดลจริง img/models/car_01.glb (ผู้ใช้สั่ง)
- 1334-1486 สร้างฉาก static ครั้งเดียวต่อโหมด
- 1487-1832 🚗 เมืองกำแพงเพชรจริง (โหมด drive) — ข้อมูล OpenStreetMap ใน js/data/city_kpp.js
- 1833-1899 🧭🕳️ รอบ 782 — ปิดช่องขาดของกริดถนน (ผู้ใช้: "GPS พาไปช่วงที่ถนนขาดตอน / ขับต่อไม่ได้")
- 1900-2106 🌉 รอบ 788 — ปูถนนเชื่อม "เกาะถนนโดดเดี่ยว" เข้าโครงข่ายหลัก
- 2107-2164 🌳🚁 รอบ 811: จุด "พื้นที่สีเขียวข้างถนน" (greenPts) — สุ่มออกจากจุดบนถนนแต่ละจุด
- 2165-2216 🚁🌳 รอบ 816 — บินเฮลิคอปเตอร์เหนือ "เมืองกำแพงเพชร" แล้วลงจอดเก็บตัวอักษรบนพื้นที่สีเขียว
- 2217-2261 🌅 ท้องฟ้าภาพจริง (รอบ 203) — ใส่ภาพ panorama 360° (equirectangular 2:1) เป็นฉากหลังท้องฟ้า
- 2262-2299 🧱 เทกซ์เจอร์ภาพจริง (รอบ 323) — วางไฟล์ `img/tex/<key>.jpg` (หรือ .png) แล้วแปะทับพื้นผิวทันที
- 2300-2801 🌌 ท้องฟ้ากลางคืนโรงแรมผีสิง (รอบ 694) — ผู้ใช้: "ข้างนอกโรงแรมยังไม่น่ากลัวพอ"
- 2802-2840 🏨 โรงแรมผีสิง (รอบ 684) — ตัวตึก 5 ชั้นสร้างใน js/hotel3d.js
- 2841-2939 ตัวอักษรในโลก (8.2)
- 2940-3090 🔤🎯 รอบ 1354 — โรงแรม 5 คำ + ภารกิจพิเศษเดี่ยว
- 3091-3133 🌳🪙 รอบ 811: ความหนาแน่นเสริมเฉพาะโหมดขับรถ — ผู้ใช้: "เพิ่มตัวอักษรและเหรียญบนถนนและ
- 3134-3257 🔠🪙 เก็บตัวอักษร 1 ตัว = ได้ 1 เหรียญ (รอบ 345)
- 3258-3324 ประกอบคำอัตโนมัติเมื่อมีตัวอักษรครบ (8.1/8.4)
- 3325-3419 โหมด adv: monsters ยิงสู้ได้ (สเปกเดิม 8.5)
- 3420-3552 👻 รอบใหม่ — PNG-only ghost chase + client-side shader cosmetics
- 3553-3577 🏨 ระบบโรงแรมผีสิง — ห้องไม่ซ้ำ 5→ดับ, 10→ติด, 13→ดับอีกครั้ง
- 3578-3675 🏨 HAUNTED HOTEL CANONICAL RUNTIME BOUNDARY — Phase 2 รอบ 1084
- 3676-4133 🔤🧭 รอบ 1086 — HAUNTED HOTEL PHASE 4
- 4134-4367 เสียงหลอนโหมดผีสิง — สังเคราะห์ Web Audio (ปลอดลิขสิทธิ์ 100%)
- 4368-4519 🔊 รอบ 1071 — เสียงโรงแรมจากไฟล์จริง + ฝีเท้าแยกทุกตัวละคร
- 4520-4874 Multiplayer — ผู้เล่นอื่นใน map เดียวกัน (สไตล์ Roblox)
- 4875-5089 Voice chat ใน map — WebRTC P2P mesh (เสียงวิ่งตรงระหว่างเครื่อง)
- 5090-5170 🏁 พิธีประกาศแชมป์ (ครูกด "จบรอบแข่ง") — /class/<map>/podium
- 5171-5397 HUD
- 5398-6065 DOM overlay + CSS (สร้างครั้งเดียว — self-contained ไม่แตะ style.css)
- 6066-6201 Input — เมาส์+คีย์บอร์ด และจอสัมผัส (มือถือ landscape)
- 6202-6206 🚁 โหมดเฮลิคอปเตอร์ Bell — ฟิสิกส์บินแบบอาร์เคด (สไตล์ Helicopter Flight Pilot)
- 6207-6599 🛸 โดรน FPV (โหมด drone) — บินเร็ว/คล่อง ลอดหน้าต่างเข้าตึกร้าง เก็บตัวอักษรในห้อง
- 6600-6722 🚗 โหมดขับรถเมืองกำแพงเพชร — ฟิสิกส์รถอาร์เคด (bicycle model)
- 6723-6816 🚦 รอบ 133: ไฟจราจรจริงที่ทางแยกใหญ่ + ฝ่าไฟแดงโดนใบสั่ง ม.22
- 6817-7264 🧭 GPS นำทาง (โหมด drive) — เลือกตัวอักษรเป้าหมาย + เส้นทางตามถนนจริง (A*) · นำทางด้วยภาพล้วน (ไม่มีเสียงพูด ตั
- 7265-7323 🎛️ เข็มหน้าปัดวิ่งจริง (สปีด 0-180 + วัดรอบ 0-8×1000) — วาดทับวงเกจของภาพ dash.png
- 7324-7408 🎵 รอบ 181: วิทยุในรถ — จอ head-unit กลางคอนโซล (visualizer + เลือกเพลง 3 โหมด)
- 7409-7452 🪞📷 รอบ 810: กระจกมองหลัง/ข้าง — เรนเดอร์ฉากเดิมซ้ำด้วยกล้องหันหลัง/เฉียงข้าง แล้วยัดลงกรอบบนจอ (scissor)
- 7453-7536 🪞🧑‍🤝‍🧑 รอบ 973: เพื่อนที่ขับตามมา "เห็นในกระจกมองหลัง" + ป้ายชื่อลอยเหนือรถเขา
- 7537-7664 🪆 รอบ 191: ตุ๊กตาดุ๊กดิ๊กหน้ารถ — รูปตัวละครที่ผู้เล่นเลือก (blkN.png)
- 7665-7968 🚔 รอบ 128: แผงเตรียมออกรถ + กฎหมายจราจร + ใบสั่ง
- 7969-8011 🛩️📦 ภารกิจไปรษณีย์กลางคืน (รอบ 353) — เฉพาะช่วงฟ้ามืด (heliNight>.5)
- 8012-9226 🚶🛗🚁🪂 โหมดเดินเท้าในเมืองเฮลิฯ (รอบ 354 — ผู้ใช้สั่ง)
- 9227-9300 🎛️ หน้าปัดเข็มขยับจริง (รอบ 61) — วาดสดทุกเฟรมจากค่าการบินจริง
- 9301-9572 🌧️☀️ ชั้นบนกระจก: ที่ปัดน้ำฝน + แสงแดดสาด (รอบ 346)
- 9573-9977 🔊🌧️ เสียงที่ปัดน้ำฝน (รอบ 537) — สังเคราะห์ล้วน ไม่มีไฟล์เสียง
- 9978-10047 📹 กล้องใต้ท้องเครื่อง (belly cam) — รอบ 348
- 10048-10119 🎯 วงเป้าลงจอด (รอบ 349) — ไฮไลต์ดาดฟ้าที่มีตัวอักษร ให้รู้ว่าควรร่อนลงตรงไหน
- 10120-10735 📏 แถบเตือนความเร็วดิ่ง (รอบ 349) — ลงเร็วเกินกรอบกล้องกะพริบแดง สอนให้ร่อนลงนุ่มๆ
- 10736-10738 Loop หลัก
- 10739-12454 ⚽ โหมดสนามฟุตบอล — ฟิสิกส์บอล + เล็ง + ชาร์จพลัง + กล้อง 1st/3rd + ชุดนักเตะ
- 12455-12909 🤖 โหมดหุ่นยนต์นักรบ — เดินยิงเอเลี่ยนตัวอักษร (ต้องยิงเรียงลำดับในคำ)
- 12910-12932 เข้า/ออกโลก
- 12933-13580 ❓ การ์ด "วิธีเล่น" ตอนเข้าโลกครั้งแรก (จำแยกต่อโลกใน localStorage — ไม่แตะ state.js)
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
pickBossSpecies:345 · WAVE_BASE_GOAL:347 · waveCfg:348 · MECHA_WEAPONS:357 · ATC_REPLIES:388 · ATC_CLOSERS:393
ATC:398 · orderedLetterMode:508 · netUp:519 · CHAT_MAX:522 · doneList:529 · wordPool:530
pickWords:543 · hotelCreateWordSet:549 · adRenterActive:572 · FACADE_ROWS:579 · adsFetch:585 · adsWatch:597
adsStop:604 · adsChanged:605 · adRentBuy:616 · heliMusicTick:639 · AD_FLYBY_COIN:643 · adFlybyTick:645
adShopOpen:664 · adShopRender:678 · BLOCK_AVATARS:708 · blkGeo:720 · blkMat:721 · blkCyl:722
softCuboidGeo:725 · blkFaceMat:742 · softFaceAtlasGeo:758 · softFaceAtlasMat:774 · makeLegacyAdventureFigure:784 · makeSoftCuboidChibiFigure:826
makeBlockFigure:869 · makeBlockCar:871 · blkNameSprite:917 · makeBlockPeer:933 · makeWalkPeerWithFigure:954 · makeLegacyAdventureWalkPeer:964
makeSoftChibiWalkPeer:968 · disposeBlockPeer:971 · mechGlowMat:979 · makeMechaFigure:980 · makeMechaPeer:1010 · CAR_GLB_URL:1033
CAR_GLB_LEN:1034 · carSplitWheel:1038 · carGlbEnsure:1065 · carMatGet:1084 · carGlbBuild:1100 · carAvCode:1149
driveCamToggle:1156 · SKID_N:1175 · skidGeomGet:1177 · skidDrop:1182 · skidTick:1196 · blkBuildThumbs:1206
blkBuildPicker:1225 · pickBlockAvatar:1270 · bubbleSprite:1293 · showPeerBubble:1320 · removePeerBubble:1328 · concreteTexture:1338
brokenWindowTexture:1355 · intactGlassTexture:1371 · chargeIconTexture:1389 · rustyDoorTexture:1398 · dAddBox:1412 · buildAbandoned:1419
makeNameSprite:1492 · flatGeom:1505 · flatGeomUV:1514 · buildDriveCity:1524 · HELI_BODY_R:2177 · HELI_KPP_CEIL:2178
heliKppBlocked:2180 · heliKppSpawn:2201 · SKY_IMG:2224 · SKY_EXT:2225 · seamlessSkyCanvas:2231 · applySky:2251
applyTex:2269 · HSKY_R:2314 · hskyTex:2316 · buildHauntSky:2321 · tickHauntSky:2451 · buildScene:2469
randPos:2844 · randRoadPos:2852 · randGreenPos:2870 · HOTEL_PER_ROOM:2892 · HOTEL_MIN_GAP:2893 · hotelSpot:2894
hotelPruneLetters:2930 · HOTEL_QUEST_WORDS:2945 · HOTEL_FLOOR:2946 · HOTEL_SEARCH_FLOORS:2947 · hotelQuestReset:2950 · hotelClearQuestLetters:2955
hotelQuestWordLetters:2959 · hotelStartQuestWord:2963 · hotelFillMissingLetters:2970 · hotelFinalHint:2995 · hotelRevealFinal:3002 · spawnLetter:3009
spawnLettersForWord:3067 · ensureCoverage:3069 · DRIVE_LETTER_COPIES:3097 · DRIVE_BONUS_COINS:3098 · ensureDriveAmbience:3099 · removeLetter:3112
spawnLetterAt:3120 · tickLetterRespawns:3128 · LETTER_COIN:3139 · BONUS_COIN_VAL:3140 · pickUpLetter:3141 · hotelApplyCanonicalOrdinal:3202
letterPop:3222 · letterChime:3241 · tryCompleteWords:3261 · rewardCompletedWord:3276 · completeWord:3291 · spawnMonster:3328
killMonster:3337 · tickMonsters:3345 · damagePlayer:3367 · shoot:3383 · tickShots:3397 · GHOST_IMAGE_URL:3425
makeGhostSprite:3427 · hotelGhostPlayers:3430 · hotelTurnScare:3440 · spawnGhost:3455 · tickGhosts:3476 · sessionRecapHtml:3492
renderHearts:3499 · hotelGhostAttack:3503 · hotelGameOver:3518 · hotelScare:3534 · knockedOut:3546 · DARK_LETTER:3575
tintSprite:3576 · HOTEL_LIGHT_NORMAL:3584 · hotelGlobalLightLevel:3586 · hotelApplyCanonicalMask:3592 · hotelApplyCanonicalPhase:3599 · hotelApplyCanonicalState:3622
hotelCurrentSearchObjective:3680 · hotelSearchContext:3694 · hotelApplyObjectiveProximity:3698 · hotelProximityCue:3706 · hotelShowCriticalHint:3711 · hotelHideCriticalHint:3723
hotelImportantHint:3728 · hotelDirectorContext:3733 · hotelDirectorLightPulse:3744 · hotelDirectorPortraitShift:3760 · hotelDirectorScare:3769 · hotelRuntimeInit:3785
hotelReset:3827 · setTorch:3853 · toggleTorch:3869 · tickTorch:3874 · disposeHotelTorch:3882 · hotelBlackout:3894
hotelApplyLightingState:3897 · hotelLightsOn:3927 · hotelStartFlicker:3931 · tickHotelPlayer:3939 · tickHotelWorld:4017 · hotelAct:4066
openWardrobe:4083 · announceTarget:4112 · HAUNT_SOLO_WIN_CHAT:4118 · hotelAnnounceCycleComplete:4119 · hotelBroadcastSoloWin:4124 · hotelFinishRound:4130
netReady:4525 · netJoin:4531 · sendPos:4552 · netHonk:4602 · sendChat:4608 · toggleChatBox:4622
onPeerData:4633 · disposeHeliMesh:4728 · removePeer:4733 · netLeave:4749 · tickPeers:4755 · RTC_CFG:4883
tinvLinked:4884 · partyWord:4891 · syncPartyWord:4907 · updateVoiceBtns:5071 · PODIUM_BONUS:5096 · podiumJoin:5098
podiumLeave:5109 · endRound:5110 · showPodium:5121 · tinvCheck:5162 · showBanner:5175 · renderHudTop:5181
renderHotelSpecialMission:5192 · renderHudWords:5203 · renderHudInv:5213 · ddTierFromName:5220 · renderBoard:5222 · drawBigMap:5262
openBigMap:5317 · closeBigMap:5325 · drawMinimap:5330 · loadCarDash:5403 · loadCarWheel:5415 · buildDom:5425
confirmExit:6050 · IS_TOUCH:6069 · HAS_KBD:6071 · bindInput:6072 · movePlayer:6167 · tickPlayer:6177
collideDrone:6210 · propStall:6229 · propBreak:6236 · propFix:6243 · droneBatAdd:6250 · lightningBolt:6253
startRain:6264 · stopRain:6278 · smashGlass:6280 · awardGlass:6291 · neededLetter:6308 · openDoor:6323
raceStartRun:6343 · raceStop:6350 · gateHighlight:6368 · renderRaceHud:6375 · tickDrone:6384 · nearMissTick:6527
showNearMiss:6551 · awardDaredevil:6562 · comboCheer:6579 · comboFlash:6595 · driveCell:6604 · nearestStreet:6610
collideCar:6620 · tlDotY:6651 · tlSet:6655 · driveArms:6672 · tlTick:6684 · TL_GREEN:6728
tlRedDur:6730 · tlightPhase:6731 · buildTrafficLights:6738 · rlTick:6790 · cellDrivable:6822 · cellWeight:6825
cellBlocked:6830 · cellCenter:6831 · posReachable:6833 · losClear:6844 · nearestDrivableCell:6855 · routeGrid:6867
pickGpsTarget:6920 · NAVLINE_W:6943 · NAVLINE_SKIP:6944 · navLineEnsure:6945 · navLineHide:6955 · navLineUpdate:6956
tickGps:6992 · tickDrive:7063 · drawCarDial:7271 · drawCarGauges:7301 · RADIO_RECT:7329 · CAR_RADIO_RECT:7331
carRadioRect:7337 · radioLayout:7339 · radioSetHint:7362 · renderRadioList:7368 · radioToggleList:7378 · drawRadioViz:7383
radioTick:7401 · MIRROR_REAR:7415 · mirrorRearRect:7418 · mirrorPass:7420 · toggleMirrorMini:7433 · drawCarMirrors:7440
MTAG_MAX_D:7462 · mirrorTagsHide:7466 · mirrorTagName:7467 · mirrorTagsTick:7468 · BOBBLE_FOOT:7542 · BOBBLE_H:7543
BOBBLE_ASPECT:7544 · BOB_OMEGA:7547 · BOB_PITCH_FORCE:7549 · BOBBLE_SKINS:7551 · bobbleSetAvatar:7558 · bobbleLayout:7565
bobbleTick:7578 · bobblePoke:7603 · bobbleApplySkin:7620 · dollOwned:7630 · openDollPicker:7631 · carStartShow:7668
showLawInfo:7686 · lawNotice:7708 · driveFineSettle:7718 · HELI_PHASES:7897 · heliStartPhase:7904 · heliFloorAt:7911
SOFT_TIERS:7921 · softLandBonus:7923 · awardPerfLand:7936 · setHeliLight:7955 · MAIL_COIN:7974 · mailStart:7976
mailStop:7999 · mailTick:8000 · FOOT_EYE:8019 · doorSlideSfx:8025 · doorLerp:8048 · entLerp:8056
footStepSfx:8066 · WRING_COIN:8087 · festivalPaint:8091 · dustTexture:8103 · dustBurst:8112 · dustTick:8126
HELI_GLB_URL:8147 · HELI_GLB_TEX_BLUE:8149 · HELI_GLB_ROTOR:8151 · HELI_GLB_TROTOR:8152 · heliGlbEnsure:8154 · heliMatBlueGet:8172
heliGlbAssemble:8185 · heliNavTick:8224 · peerRotorStop:8231 · peerRotorTick:8237 · heliCrashSfx:8256 · heliMeshBuild:8284
heliMeshBuildLegacy:8295 · buildHeliFoot:8425 · footFloorAt:8541 · insideTerm:8548 · inDoorZone:8549 · footHint:8553
setFootBtns:8554 · liftStart:8559 · beginRide:8570 · endRide:8593 · beginWing:8604 · awardAirLetter:8617
paxChoiceShow:8636 · paxChoiceHide:8662 · pilotShipMesh:8666 · beginPilot:8667 · endPilot:8699 · drawCabinWindow:8723
tickHeliFoot:8747 · heliWallPenalty:8958 · tickHeli:8970 · CP_NAT:9235 · CP_GAUGES:9236 · SEAT_LABEL:9249
SEAT_P_FULL:9250 · SEAT_ZOOM:9251 · DASH_OFF_Y:9252 · DASH_DROP:9253 · setSeat:9255 · layoutCockpit:9267
WIPER:9306 · WIPER_SPD:9309 · WIPER_LABEL:9310 · INT_GAP:9311 · WASH_MS:9315 · WASH_TANK_MAX:9319
SMEAR_LIFE:9331 · CHOP_MIN:9332 · SUN_RAY_FAR:9336 · sunRayBlocked:9338 · sunShadeTick:9357 · applyCockpitShade:9368
rotorChop:9380 · sunUpdate:9388 · HELI_FOG_N0:9399 · fogUpdate:9403 · adGlowPulse:9451 · RAIN_MAX:9460
VISOR_Y:9461 · RAIN_MIN:9462 · RAIN_DUR:9463 · DROP_ZONE:9467 · addDrop:9468 · tickDrops:9476
addWashDrop:9494 · washStart:9501 · renderWashGauge:9521 · washTick:9532 · grimeTick:9549 · WIPE_R:9556
wipeDrops:9557 · wiperSndOn:9580 · wiperSndOff:9592 · wiperThunk:9598 · washSpraySfx:9610 · wiperSqueak:9627
wiperSndTick:9644 · setWiper:9664 · tickWiper:9676 · SH_SWEEP:9707 · shadowSweepTick:9709 · REFL_MAX:9721
REFL_COL:9723 · cityGlowLevel:9724 · drawCityGlow:9729 · setVisor:9761 · rainTick:9767 · drawBlade:9784
drawSmears:9803 · drawGlass:9823 · drawBellyCam:9985 · drawBellyHud:10008 · drawLandingTargets:10054 · VS_HARD:10124
drawDescentBar:10125 · heliShake:10174 · cpNeedle:10185 · drawGauges:10202 · XF_START:10250 · PRELOAD_WAIT:10251
ALT_QUIET_FROM:10253 · ALT_MAX_DAMP:10254 · ALT_LP_MIN:10255 · ECHO_NEAR:10256 · WIND_FULL_SPD:10257 · SHUTDOWN_SEC:10258
PAN_MAX:10260 · OD_RPM:10261 · SHAKE_RPM:10262 · SHAKE_HIT:10263 · soccerLetterPos:10743 · letterNeeded:10751
soccerNeededSet:10760 · soccerTileGeo:10768 · soccerGoldTexture:10770 · makeSoccerTile:10787 · soccerRefreshSkins:10796 · soccerBuildTargets:10803
soccerNextTile:10813 · soccerRetarget:10829 · soccerCoinPop:10841 · soccerGrassTexture:10854 · soccerTurfGrade:10876 · soccerTurfTexture:10927
grassNormalTexture:10946 · soccerLinesTexture:10975 · soccerNetTexture:11026 · soccerCrowdTexture:11034 · soccerBallMat:11053 · buildSoccerGoal:11073
soccerFloodTexture:11092 · soccerScoreboardTexture:11102 · buildStands:11111 · soccerLedBoards:11164 · soccerMusicCanPlay:11186 · soccerMusicSyncButton:11189
soccerMusicEnsure:11198 · soccerMusicCancelFade:11203 · soccerMusicStart:11206 · soccerMusicStop:11214 · soccerMusicSessionStart:11222 · soccerMusicToggle:11225
soccerMusicVisibilityChange:11230 · soccerGKEnsure:11309 · soccerGKTick:11325 · fkBuildWall:11354 · fkToggle:11369 · fkHitTest:11385
pkHud:11404 · pkStart:11413 · pkEnd:11427 · pkTick:11442 · repQualify:11449 · repEnsureEl:11452
repStart:11463 · repTick:11470 · soccerNumTex:11495 · ssSec:11507 · ssPaintPattern:11512 · soccerShirtTex:11525
makeSoccerPlayer:11547 · soccerNewSpot:11584 · soccerResetBall:11596 · soccerKick:11603 · soccerCheer:11621 · guideTexture:11624
auraActive:11648 · auraLeftMs:11649 · auraFlameTex:11657 · auraCoilTex:11681 · auraCoilRibbon:11705 · auraGlintTex:11729
buildAura:11740 · auraBuy:11783 · auraRender:11793 · auraTick:11807 · buildDrill:11858 · drillTick:11871
ballFXTex:11911 · buildBallFX:11922 · smokePuff:11938 · ballFXTick:11946 · buildLandRing:11992 · buildGuideRibbon:12002
renderSpinPad:12027 · spinPadToggle:12039 · spinPadPick:12045 · renderCurl:12057 · kickLaunch:12068 · updateSoccerGuide:12077
soccerCamera:12141 · tickSoccer:12165 · ssShirtPath:12359 · ssShortsPath:12367 · ssPaintSwatchShirt:12372 · ssPaintSwatchShorts:12377
ssPreviewDraw:12384 · soccerKitShow:12413 · soccerKitGo:12442 · emojiSprite:12496 · makeAlien:12501 · startWave:12534
waveSpawnFill:12545 · waveComplete:12554 · updateWaveHud:12564 · checkMechaBossBadge:12566 · alienSpawnPos:12575 · removeAlien:12580
mechaHudWord:12585 · setMechaHudSkin:12593 · mechaComboPop:12605 · mechaShielded:12610 · mechaDamageFx:12612 · mechaHitByAlien:12617
spawnAlienShot:12623 · removeAlienShot:12633 · tickAlienShots:12638 · spawnPowerup:12650 · removePowerup:12663 · collectPowerup:12668
tickPowerups:12675 · updateMechaHud:12684 · mechaTracer:12724 · mechaFire:12731 · explodeAlien:12768 · tickMecha:12798
loop:12855 · grabShot:12890 · savePhoto:12901 · clearEntities:12913 · INTRO_KEY:12937 · introSeenObj:12938
introSeen:12939 · markIntroSeen:12940 · INTRO:12941 · INTRO_MODE:12943 · showIntro:12945 · HELI_KPP_BANNER:12971
HAUNT_ENTRY_NOTICE:12973 · showHauntedEntryNotice:12977 · showModeIntro:12985 · closeIntro:12989 · beginPlay:12995 · start:12997
exitWorld:13234 · mechaRecapLine:13312

## js/app-update.js (214 บรรทัด · 0 รายการ)

## js/arena-audio.js (175 บรรทัด · 0 รายการ)

## js/arena-elements.js (74 บรรทัด · 0 รายการ)

## js/arena-field-visuals.js (232 บรรทัด · 0 รายการ)

## js/arena-grimoire.js (31 บรรทัด · 0 รายการ)

## js/arena-heroes.js (41 บรรทัด · 0 รายการ)

## js/arena-maps.js (108 บรรทัด · 0 รายการ)

## js/arena-nav.js (38 บรรทัด · 3 รายการ)
remain:4 · neededLetterHints:14 · placeLetterHint:24

## js/arena-portrait.js (32 บรรทัด · 0 รายการ)

## js/arena-race.js (14 บรรทัด · 6 รายการ)
api:5 · mergeCredit:6 · settle:7 · create:8 · error:9 · request:10

## js/arena-relics.js (582 บรรทัด · 0 รายการ)

## js/arena-spell-catalog.js (377 บรรทัด · 0 รายการ)

## js/arena-spell-engine.js (93 บรรทัด · 0 รายการ)

## js/arena-strip.js (40 บรรทัด · 0 รายการ)

## js/arena3d.js (974 บรรทัด · 0 รายการ)

## js/assetaward.js (21 บรรทัด · 0 รายการ)

## js/auth.js (573 บรรทัด · 54 รายการ)
AUTH_PUSH_MS:23 · AUTH_SDK_TIMEOUT_MS:24 · AUTH_CLOUD_SLOW_MS:25 · AUTH_CLOUD_TIMEOUT_MS:26 · SKY_BETA_OPEN:31 · SKY_BETA_EMAILS:32
skyBetaEmail:37 · canAccessSkyBeta:40 · ADMIN_NAME_EMAILS:46 · adminReservedNameKey:51 · isReservedAdminName:56 · canUseReservedAdminName:60
canAccessKartBeta:66 · isAdmin:69 · checkProfileName:72 · TEACHER_EMAILS:81 · isTeacher:82 · syncAdminAccess:86
TESTER_EMAILS:100 · TESTER_COINS:101 · TESTER_PET_GROWTH_FIX_VERSION:102 · isTester:103 · RANK_EXCLUDED_TESTER_NAMES:109 · rankUserExcluded:110
testerBoost:116 · authSetStatus:152 · authLocalSaveSafe:169 · authShowLogin:172 · authGateOffline:176 · authSaveRef:183
authFetchCloud:184 · authWriteCloud:206 · authDeleteCloud:219 · authWriteProfileName:220 · authPushProfile:227 · authApplyProfileName:235
authEnsureProfileName:259 · authAskProfileName:277 · authEditProfileName:291 · authStart:303 · updateOfflinePill:335 · authEnterOffline:340
authLateSync:357 · authIsAppMode:377 · AUTH_REDIRECT_CODES:385 · authLoginClick:387 · authOnLogin:407 · authSyncOnLogin:433
authFreshStart:462 · authAskLink:471 · authEnterGame:521 · authPushSaveAwait:537 · authPushSave:545 · authLogout:550

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

## js/city3d.js (3,355 บรรทัด · 212 รายการ)
### 🗂️ สารบัญโซน js/city3d.js (Read/Edit เฉพาะช่วง)
- 2-18 city3d.js — 🏙️ VOCAB CITY: ล็อบบี้ 3D แบบเมืองลอยฟ้า (หน้ารอง index.html?lobby=3d; หน้าเริ่มต้น = Lobby Classi
- 19-33 ⚙️ CONFIG + เครื่องมือกลาง (รอบ 861)
- 34-114 🔒 รอบ 1070: ประตูโลกที่ยัง Coming soon — สิทธิ์ทดสอบมาจาก Auth ที่ฝังในเซฟ Lobby เดิม
- 115-217 📷 CAMERA RIG — 1 นิ้วเลื่อน · 2 นิ้วหมุน/เอียง/ซูม (รอบ 861)
- 218-382 🖼️ CANVAS TEXTURE โรงงานผิวสัมผัส (พื้นเกาะ/หน้าต่างตึก/ป้าย)
- 383-443 🏗️ BUILDERS — อาคารแต่ละแบบ (ห้ามกล่องเปล่าแปะ texture — มีชั้นเชิง/ระเบียง/หลังคา/ป้ายจริง)
- 444-832 🚪🌀 รอบ 897: ประตูม้วนเลื่อนขึ้น (โรงรถ/โรงเก็บยาน) — บานพับหมุนไม่ได้เพราะช่องกว้าง 3-5 เมตร
- 833-929 🚗🏍️🚁🛸 ยานพาหนะจิ๋ว (ผู้เล่นจริงจากโลก 3D จะขับ/บินสิ่งเหล่านี้ในเมือง)
- 930-986 🧍 ตัวละครผู้เล่น — blk1-8 = หุ่นบล็อก 3D · blk9-88 = ป้ายภาพ 2D ตั้งในโลก
- 987-1007 🌆 ผังเมือง — อาคารทุกหลังผูก go=<key> (ตัวรับใน js/main.js)
- 1008-1367 🇹🇭 O-NET EXAM HALL — ปุ่ม Lobby 3D (รอบ 1183)
- 1368-1512 🎉 เทศกาลตามวันที่จริง — พลุปีใหม่ / สงกรานต์ / ลอยกระทง (รอบ 863)
- 1513-1790 🧑‍🤝‍🧑 ผู้เล่นจริง (อ่านอย่างเดียว) — presence→ยืนตามอาคาร · world→ขับ/บินในเมือง
- 1791-1947 💬 รอบ 866: บับเบิลแชทสดลอยหัวเพื่อนในเมือง
- 1948-2104 🖊️💬 รอบ 868: พิมพ์ตอบแชทได้จากในเมือง (ไม่ต้องกลับล็อบบี้เดิม)
- 2105-2254 💬🔴 รอบ 873: ไอคอน "มีข้อความค้าง ยังไม่ได้อ่าน" ลอยเหนือหัวเพื่อน
- 2255-2272 🚪 รอบ 870: กลับจากล็อบบี้เดิม → โผล่ที่ "หน้าประตูตึกที่เพิ่งเข้า"
- 2273-2507 🚪🔊 รอบ 890: บานประตูตึกเปิด-ปิดจริง + เสียงประตูสังเคราะห์เอง
- 2508-2639 🚗🤖🛸 รอบ 900: ยานพาหนะแล่นออกจากช่องประตูม้วนที่เพิ่งเปิด → จอดรอหน้าประตู
- 2640-2807 🚶 รอบ 866: ตัวเราเดินไปหน้าตึกก่อน แล้วค่อยเข้าหน้านั้น
- 2808-2892 🚪🚶 รอบ 886: กลับจากล็อบบี้เดิม → "เดินออกจากตึกมาหน้าประตู" (walkSelfTo ย้อนทาง)
- 2893-3067 👆 แตะ/คลิก: ตัวละคร→การ์ดโปรไฟล์ · อาคาร→เดินทางไปหน้านั้น · พื้น→ประกายดาว
- 3068-3121 🎵 รอบ 873: เพลงประกอบเมือง (BGM) — ปุ่มเปิด/ปิดมุมขวาล่าง
- 3122-3157 🚀 BOOT
- 3158-3355 🎬 รอบ 880: กลับจากล็อบบี้เดิม → จอเปิดคือ "ภาพเมืองใบที่เพิ่งเดินออกไป"
### รายการ js/city3d.js
ISLAND_R:22 · RING_IN:23 · BAND1_R:24 · GROUND_TEX_PX:25 · NIGHT:26 · esc:28
hash:29 · rnd:30 · clamp:31 · TAU:32 · CITY_WORLD_COMING_SOON:37 · CITY_WORLD_TESTER_NAMES:38
cityWorldTester:39 · cityAdminAccess:54 · cityWorldComingSoon:60 · BLK8:66 · CAR_COL:77 · gradeStars:82
MAT:100 · mat:101 · GEO:105 · box:106 · cyl:107 · M:108
groundAt:139 · setupInput:148 · twoState:210 · cvs:221 · ctex:222 · groundTexture:229
wallTex:283 · wallMat:302 · shopSign:307 · roundRect:317 · iconSprite:324 · nameSprite:347
blobShadow:369 · parapet:391 · roofProps:396 · DOOR_W:408 · doorNightFx:412 · doorAt:429
ROLL_Z_HOLE:453 · slatTexture:456 · rollAt:466 · awning:490 · bTower:502 · bShop:522
bHouse:540 · bLibrary:556 · bFactory:574 · bArcade:601 · bObservatory:618 · bHallOfFame:632
bHaunted:653 · bHeliport:671 · bGarage:688 · bStadium:703 · bMotoTrack:725 · bUfo:746
bHangar:766 · bJungleGate:789 · bDronePad:811 · miniCar:836 · miniMoto:855 · miniHeli:875
miniDrone:895 · miniMecha:910 · makeBlockFigure:934 · makeSpriteFigure:970 · makeFigure:979 · pickBlk:982
bld:990 · BUILDINGS:991 · BLD_AT:1139 · buildCity:1141 · buildPlaza:1192 · buildGreens:1238
_glowTex:1283 · buildSky:1293 · buildAmbientTraffic:1355 · FESTIVAL:1372 · buildFestival:1384 · buildFireworks:1391
buildSongkranDeco:1433 · buildLoiKrathongDeco:1465 · actBuilding:1536 · loadFirebase:1547 · setCityLoginVisible:1556 · liveStart:1569
lbGet:1587 · watchPresence:1597 · spawnStander:1621 · WORLD_MAPS:1656 · pollWorlds:1663 · spawnVehicle:1714
removeActor:1774 · markPickable:1787 · BUB_MS:1800 · BUB_FRESH:1801 · BUB_MAXCH:1802 · BUB_MAX:1803
BUB_TEX_KEEP:1804 · bubTexture:1810 · bubTexRelease:1822 · bubbleSprite:1827 · bubDraw:1836 · killBubble:1863
showBubble:1876 · flushBubble:1914 · watchFriendChats:1922 · CITY_CHAT_MAX:1961 · CITY_QUICK_REPLIES:1963 · bubSafeText:1966
actorInfo:1972 · chatBoxCanSend:1982 · chatBoxWhy:1986 · chatBoxRefresh:1992 · openChatBox:2029 · closeChatBox:2041
cbNote:2046 · sendCityChatText:2052 · sendCityChat:2082 · cityStopLive:2087 · SAVE_KEY:2116 · saveRead:2119
pairIdOf:2122 · chatSeenTsCity:2124 · chatMarkSeenCity:2130 · unreadTexture:2143 · addUnreadBadge:2161 · removeUnreadBadge:2182
setUnread:2192 · applyUnread:2198 · markReadCity:2200 · unreadCount:2208 · spawnSelf:2214 · DOOR_MEM:2265
rememberDoor:2266 · lastDoorKey:2267 · DOOR_SWING:2289 · DOOR_OPEN_S:2290 · DOOR_SHUT_S:2291 · DOOR_AJAR:2295
AJAR_QUIET_MS:2296 · ROLL_OPEN_S:2301 · ROLL_SHUT_S:2302 · ROLL_LIFT:2303 · ROLL_AJAR:2304 · registerDoor:2307
doorLeadS:2320 · doorSpillTexture:2326 · doorCreakSfx:2337 · doorLatchSfx:2355 · shutterRollSfx:2378 · shutterClunkSfx:2405
doorMoveSfx:2428 · setCityDoor:2435 · openCityDoor:2446 · closeCityDoor:2447 · setDoorRest:2449 · refreshDoorRest:2461
applyDoorPose:2471 · RIDE_GATE:2523 · RIDE_OUT_S:2524 · RIDE_PARK_S:2525 · DOOR_RIDES:2528 · rideLeadS:2538
rideSfx:2543 · ridePose:2568 · launchRide:2585 · releaseRide:2597 · WALK_SPD:2646 · WALK_MIN:2647
WALK_MAX:2648 · DOOR_GAP:2649 · RECEPTION_SPOT:2653 · doorSpotOf:2654 · walkPose:2665 · footCtx:2680
footStepSfx:2685 · footDustTexture:2706 · footDustPuff:2715 · footDustTick:2729 · FOOT_STEP_DIST:2744 · DOOR_OPEN_AT:2745
walkSelfTo:2747 · EXIT_BACK:2819 · EXIT_DUR:2820 · EXIT_STEP:2821 · EXIT_CLEAR:2822 · EXIT_SHUT:2823
stageExitWalk:2826 · walkSelfOut:2838 · onTap:2896 · captureCityShot:2915 · travelTo:2948 · sparkleAt:2996
openProfile:3020 · refreshChip:3059 · setChip:3063 · BGM_KEY:3074 · BGM_DUCK_PICTURE_DICTIONARY:3075 · bgmWant:3077
bgmEnsure:3078 · BGM_DEV:3087 · bgmPlay:3088 · bgmDuckForPictureDictionary:3090 · bgmRefreshBtn:3095 · bgmToggle:3102
bgmSetup:3107 · boot:3125

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

## js/f1_3d.js (4,817 บรรทัด · 347 รายการ)
### 🗂️ สารบัญโซน js/f1_3d.js (Read/Edit เฉพาะช่วง)
- 30-225 ⚙️ ค่าคงที่ (TUNE ZONE)
- 226-274 📦 สถานะโลก
- 275-360 🏁 รอบ 1219 — MULTIPLAYER SAFE-DISTANCE START GRID
- 361-532 🔊 F1 DYNAMIC ENGINE AUDIO — sample จริง + RPM/เกียร์เสมือน + synth fallback (รอบ 1106)
- 533-612 🎵 RACING BACKGROUND MUSIC — lazy stream + browser disk cache + fade on exit
- 613-691 🖼️ texture: probe img/f1/*.jpg ก่อน → ไม่มีใช้ canvas วาดเอง
- 692-718 ✏️ sprite ตัวอักษร / ป้ายชื่อ (canvas → sprite)
- 719-796 🛣️ เส้นแทร็ก: (IS_KART?P.map:F1_MAP).track (จุดจริง OSM) → sample ทุก 5 ม.
- 797-1015 🌌🪽 รอบ 1217 — FANTASY MAIN-LINE AIR ROUTES (GPU COOL)
- 1016-1149 🏗️ สร้างฉาก: แทร็ก + kerb + runoff + อาคารจริง + ไฟ + ทะเลทราย
- 1150-1227 🏟️ PREMIUM MODULAR CIRCUIT ARCHITECTURE — รอบ 1203
- 1228-1786 ✨ F1 REALISTIC CIRCUIT — ฉากสนามมืออาชีพเฉพาะ Realistic Mode (รอบ 1125)
- 1787-1871 🏎️ รถประกอบ procedural สำหรับ Best-Lap ghost/fallback (รถผู้เล่นจริงใช้ VR-X1 ด้านล่าง)
- 1872-2072 🏎️📱 รอบ 1210 — SEMI-REALISTIC LOW-POLY PEER F1 (GPU COOL)
- 2073-2428 🖥️ DOM + CSS (เต็มจอ ไม่มีกรอบเครื่องเกม)
- 2429-2703 ✨ PREMIUM RACE HUD — รอบ 1203 · brushed metal + glass + neon accent
- 2704-2853 🌍 สร้างโลกครั้งเดียว
- 2854-3028 🪽 รอบ 904: DRS — ปีกหลังเปิดบนทางตรง (ตามรถเพื่อนใกล้ 25 ม.)
- 3029-3040 🏁 ฟิสิกส์ + จับเวลา
- 3041-3428 🌀 PORTAL DESTINATION PREVIEW — actual target curve / Canvas2D (รอบ 1222)
- 3429-3519 🏆 รอบ 903: กระดานอันดับ Best Lap ออนไลน์ (/f1Rank)
- 3520-3688 🚦👻 รอบ 902: ลำดับออกสตาร์ท (ไฟแดง 5 ดวง) + รถเงาวิ่งตาม Best Lap
- 3689-3741 🚧 เลนพิท — ผิวทางเต็มกริป + ลิมิตเตอร์ 80 กม./ชม.
- 3742-3837 🔤 คำศัพท์บนแทร็ก (แบบเดียวกับโลกมอเตอร์ไซค์ — REWARD สูงกว่า)
- 3838-3879 🏁 รอบ 1324 — R4 LIVE RACE POSITION (lap + track progress)
- 3880-4139 🧑‍🤝‍🧑 เพื่อนร่วมสนาม (NetRoom map 'f1')
- 4140-4229 📷 กล้องไล่หลัง + ลูปเกม
- 4230-4347 🔢 รอบ 916 — จอบนพวงมาลัยเป็น "ของจริง"
- 4348-4522 🚥 รอบ 918: แถบไฟ LED รอบเครื่องบนพวงมาลัย (เขียว → เหลือง → แดง ตอนใกล้เปลี่ยนเกียร์)
- 4523-4817 🚪 เข้า/ออกโลก
### รายการ js/f1_3d.js
createRacingWorld:19 · IS_KART:20 · GAME_TITLE:22 · BEST_KEY:23 · RANK_PATH:24 · RANK_STATUS:25
REWARD:33 · LETTER_COIN:34 · COLLECT_R:35 · DONE_KEY:36 · RECENT_KEY:37 · HALF_W:38
KERB_W:39 · RUNOFF_W:40 · BARRIER_LAT:41 · BARRIER_BOUNCE:42 · CAR_HIT_PARTS:46 · CAR_HIT_RADIUS:55
CAR_RESTITUTION:56 · CAR_SIDE_FRICTION:57 · CAR_RUB_DRAG:58 · CAR_SEP_EPS:59 · SAMPLE_M:60 · FP_EYE:62
FP_FWD:63 · FP_LOOK:64 · FP_DROP:65 · FP_FOV:66 · RFP_EYE:68 · RFP_FWD:69
RFP_LOOK:70 · RFP_DROP:71 · RFP_FOV:72 · ROAD_EYE:75 · ROAD_DROP:76 · ROAD_FOV:77
REV_A:79 · REV_MAX:80 · OFFTRACK_S:81 · WHEEL_HUB_X:83 · WHEEL_HUB_Y:84 · WHEEL_RATIO:85
WHEEL_MAX_DEG:86 · QUALITY_HAND_MAX_DEG:87 · LED_GREEN_N:91 · LED_AMBER_N:92 · LED_SHIFT_R:93 · LED_FLASH_HZ:95
LED_K_LO:96 · LED_K_SPAN:97 · LED_RPM_LERP:98 · F1_LEDS:99 · WHEEL_IMG_W:108 · DASH_PX:109
QUALITY_PLATE_W:113 · QUALITY_DASH_SCALE:114 · QUALITY_DASH_POSE:115 · DASH_LED_N:120 · DASH_RPM_MIN:121 · DASH_RPM_MAX:122
SHAKE_KERB_AMP:124 · SHAKE_SAND_AMP:125 · SHAKE_SPD_REF:126 · SHAKE_HZ:127 · WHEEL_SHAKE_KERB_PX:129 · WHEEL_SHAKE_SAND_PX:130
PWR_A:132 · ACC_CAP:133 · DRAG_K:134 · ROLL_A:135 · BRAKE_A:136 · BRAKE_DF:137
COAST_A:140 · COAST_STOP:141 · GRIP_BASE:142 · GRIP_DF:143 · GRIP_CAP:144 · STEER_MAX:146
STEER_HI:147 · SURF_RUNOFF:148 · SURF_SAND:149 · JUMP_GRAVITY:151 · JUMP_LANE_LAT:152 · JUMP_ENTRY_M:153
JUMP_RISE_M:154 · JUMP_GAP_M:155 · JUMP_LAND_M:156 · JUMP_EXIT_M:157 · JUMP_RECOVER_M:158 · JUMP_HEIGHT:159
JUMP_LAND_H:160 · JUMP_MAX_PITCH:161 · RAMP_ROLL_TRACK:162 · RAMP_ROLL_MAX:163 · RAMP_ROLL_EDGE:164 · RAMP_ROLL_RESPONSE:165
RAMP_ROLL_RETURN:166 · JUMP_PEER_Y_SEP:167 · JUMP_FRACTIONS:168 · JUMP_COLORS:169 · NET_SEND_MS:170 · ROOM_MAX:171
CHAT_MS:172 · CHAT_PRESETS:173 · F1_ROLL_WIRE:176 · CAR_COLOR_KEY:179 · F1_COLOR_WIRE:182 · CAR_STYLES:183
COCKPIT_ASSETS:190 · PEER_COLORS:197 · GRID_N:198 · GRID_FRONT_M:200 · GRID_GAP_M:201 · GRID_SIDE_M:202
GRID_SAFE_M:203 · F1_GRID_WIRE:204 · LIGHT_LEAD_S:206 · LIGHT_STEP_S:207 · LIGHT_HOLD_MIN:208 · LIGHT_HOLD_MAX:209
JUMP_PENALTY_S:210 · RACE_BGM_BUILD_URL:213 · RACE_BGM_URL:214 · RACE_BGM_VOLUME:215 · RACE_BGM_EXIT_FADE_MS:216 · GHOST_HZ:218
GHOST_MAX:219 · GHOST_KEY:220 · ACTIVE_GHOST_KEY:221 · PIT_HALF_W:222 · SURF_PIT:223 · PIT_LIMIT:224
LINE:251 · JUMPS:252 · PITL:266 · gridPose:278 · startGridUid:290 · startGridUids:294
startGridSlotFor:297 · gridFormationActive:302 · gridSlotClear:303 · safeStartGridSlot:314 · placeAtGridSlot:320 · settleStartGrid:329
packetGridSlot:336 · packetBodyRoll:342 · storedCarStyle:351 · saveCarStyle:354 · cockpitAsset:355 · raceMusicPreferenceOn:536
raceMusicCanPlay:537 · raceMusicUnlocked:540 · raceMusicSyncButton:541 · raceMusicEnsure:549 · raceMusicCancelFade:560 · raceMusicStart:564
raceMusicStop:581 · raceMusicToggle:600 · raceMusicVisibilityChange:605 · GEARS:609 · gearOf:610 · matLam:620
matLit:626 · applyTex:631 · texFromCanvas:635 · texProbe:643 · asphaltTex:655 · kerbTex:670
sandTex:676 · adTex:685 · letterTexture:695 · makeTextSprite:705 · cr:723 · buildLine:727
nearIdx:766 · jumpDeltaD:802 · jumpHalfAtD:805 · jumpPhaseAtD:813 · jumpHeightAtD:822 · jumpPitchAtD:835
jumpProbeAtSample:847 · jumpProbe:857 · jumpWheelGround:865 · jumpTerrainRoll:876 · chooseJumpStart:882 · prepareFantasyJumps:902
jumpPose:916 · fantasyRampGeometry:921 · buildFantasyCircuit:944 · surfAt:1001 · ribbonGeo:1019 · kerbStrips:1040
extrudeFootprint:1075 · polyCentroid:1086 · pointInFootprint:1090 · footprintCrossesRoad:1099 · footprintFrame:1107 · premiumMats:1122
instancedParts:1138 · localPart:1147 · buildBuildings:1154 · chooseRealisticTier:1233 · isThermalMobile:1240 · useRacingSky:1244
seededRand:1256 · realisticAsphaltMaps:1260 · realisticRunoffTex:1306 · realisticSandTex:1322 · racingLineRibbonGeo:1340 · linePose:1351
tracksideSpotClear:1359 · instancedFromSpots:1363 · buildRealisticCircuit:1369 · buildTrackScene:1640 · buildF1Car:1790 · addPlayerContactShadow:1864
peerF1MergedGeometry:1878 · peerF1LoftGeometry:1896 · peerF1CombineGeometry:1923 · peerF1KitGet:1936 · buildPeerF1Car:1999 · replacePlayerCar:2030
paintPlayerStyle:2046 · primePlayerCockpit:2068 · CSS:2076 · buildDom:2493 · build:2707 · mapBounds:2820
mapXY:2828 · drawMap:2831 · DRS_ZONES_N:2862 · DRS_CURV:2863 · DRS_GAP_MAX:2864 · DRS_MIN_M:2865
DRS_ENTRY_M:2866 · DRS_NEAR_M:2867 · DRS_DRAG_K:2868 · DRS_FLAP_SHUT:2870 · DRS_FLAP_OPEN:2871 · attachDrsGlow:2876
findDrsZones:2886 · DRS_DET_M:2917 · DRS_SIGN_KIND:2918 · drsDetIdx:2925 · drsSignTex:2929 · buildDrsBoards:2941
drsZoneAt:2983 · drsPeerGap:2992 · drsTick:3005 · drsHud:3020 · respawnOnTrack:3033 · drawPortalDestination:3044
beginPortalReturn:3068 · portalTick:3080 · barrierBounce:3102 · carPartContact:3127 · carContact:3149 · resolvePeerCars:3159
landFromJump:3196 · jumpPhysicsTick:3206 · physTick:3244 · progressTick:3356 · fmtLap:3401 · puffSmoke:3407
smokeTick:3418 · FR_READ:3437 · frSubmit:3439 · frMerge:3456 · frFetch:3468 · frRowHTML:3486
frBodyHTML:3495 · frNote:3504 · frMount:3509 · setStartLights:3529 · resetLights:3534 · beginLights:3542
lightsLocked:3543 · paintLights:3544 · lightsTick:3554 · ghostEnsure:3603 · ghostHide:3620 · ghostLoad:3625
ghostSave:3634 · ghostReset:3637 · ghostRecord:3641 · ghostKeep:3650 · ghostGapAt:3657 · ghostTick:3665
buildPitLine:3694 · pitAt:3725 · inPitLane:3736 · racingLineLat:3745 · trackPointAhead:3753 · pickWord:3761
spawnLetters:3776 · renderWordHud:3790 · collectTick:3796 · completeWord:3817 · relocTick:3834 · packetRaceLap:3841
packetRaceProgress:3845 · racePositionSnapshot:3854 · updateRacePosition:3868 · netReady:3883 · netJoin:3888 · netSend:3901
sendChat:3918 · peerColorIndex:3925 · packetCarColorIndex:3930 · peerColor:3940 · buildPeer:3943 · onPeer:3977
showPeerBubble:4014 · removePeerBubble:4021 · dropPeer:4027 · peerTick:4048 · netLeave:4078 · layoutBoard:4084
renderBoard:4107 · CAM_MODES:4145 · CAM_NEXT_LABEL:4146 · cycleCamMode:4147 · applyCamMode:4151 · cockpitBox:4163
layoutWheel:4172 · wheelTick:4195 · DASH_FONT:4236 · positionQualityDash:4238 · layoutDash:4254 · dashRR:4264
dashRpmTick:4271 · dashTick:4281 · drawDash:4296 · buildLeds:4353 · ledsOff:4361 · ledTick:4365
camTick:4392 · hudTick:4444 · applyThermalPixelRatio:4455 · thermalGovernorTick:4461 · thermalRenderDue:4473 · frame:4483
tick:4507 · fit:4514 · applyEnvironmentProfile:4526 · start:4575 · exitWorld:4655

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

## js/hauntedhotel.js (655 บรรทัด · 0 รายการ)

## js/hauntedhoteldirector.js (321 บรรทัด · 0 รายการ)

## js/hauntedhotelghost.js (239 บรรทัด · 0 รายการ)

## js/hauntedhotelsession.js (255 บรรทัด · 0 รายการ)

## js/home-v2.js (2,175 บรรทัด · 0 รายการ)

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

## js/kart3d.js (362 บรรทัด · 22 รายการ)
softBox:11 · merge:21 · box:34 · starGeo:35 · makeKit:38 · paintMat:83
buildCar:84 · carView:95 · steer:96 · camera:97 · applyEnvironment:108 · boundaryPoint:120
recoverCorridor:130 · WALL_RADIUS:144 · addBoundaryWall:145 · sweptWall:153 · collideBoundary:174 · buildTrack:187
animate:315 · decorateDom:316 · paintDom:339 · preview:341

## js/lettercannon.js (482 บรรทัด · 0 รายการ)

## js/lobby.js (52 บรรทัด · 3 รายการ)
PANEL_TITLES:9 · openPanel:19 · closePanel:29

## js/lobby3d.js (811 บรรทัด · 0 รายการ)

## js/main.js (617 บรรทัด · 12 รายการ)
settingsButtonClick:104 · syncMusicBtn:120 · showPetShoppingGrantNotice:154 · showPetShoppingFineRefundNotice:187 · showRankRewardNotice:218 · showQuizBackPay:268
showGiantRefund:313 · showTicketRefund:354 · showAcDuplicateRefundNotice:393 · fitQbp:426 · bootGame:440 · showCakeGiftRefundNotice:467

## js/mecha-combat-fx.js (101 บรรทัด · 3 รายการ)
STYLES:5 · style:17 · create:18

## js/mecha-models.js (85 บรรทัด · 0 รายการ)

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

## js/netroom.js (839 บรรทัด · 20 รายการ)
CFG:41 · roomsAllowed:63 · HOT_KEYS:71 · COLD_KEYS:72 · HOT_BACK:73 · splitPayload:77
mergeBack:88 · metUids:100 · AIM_TTL_MS:119 · aimAt:121 · aimGet:125 · aimClear:129
MAPS3D:135 · skyMapAllowed:136 · whereFriends:139 · dbOf:163 · envReady:164 · isDenied:167
create:179 · drawBudget:812

## js/onetpromo.js (259 บรรทัด · 0 รายการ)

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

## js/pickup3d.js (362 บรรทัด · 22 รายการ)
softBox:10 · merge:20 · box:33 · starGeo:34 · makeKit:37 · paintMat:82
buildCar:83 · carView:94 · steer:95 · camera:96 · applyEnvironment:107 · boundaryPoint:119
recoverCorridor:129 · WALL_RADIUS:143 · addBoundaryWall:144 · sweptWall:152 · collideBoundary:173 · buildTrack:186
animate:314 · decorateDom:315 · paintDom:338 · preview:340

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

## js/specialmission.js (229 บรรทัด · 0 รายการ)

## js/state.js (1,424 บรรทัด · 97 รายการ)
### 🗂️ สารบัญโซน js/state.js (Read/Edit เฉพาะช่วง)
- 2-253 STATE + LocalStorage + กติกากลางของเกม
- 254-310 🗄️🐾 ระบบชั้นอาหาร + เงินช่วยปรับตัว
- 311-810 👍 รอบ 701: รีแอ็กชันฟีด (กดค้างปุ่มถูกใจแล้วเลือกได้เหมือน Facebook)
- 811-866 Daily Quest (item 3 backlog): ภารกิจรายวัน 3 อย่าง สุ่มตามวันที่
- 867-977 มูลค่าทรัพย์สินสุทธิ (net worth) — ฐานของระบบแรงค์
- 978-1027 🚫🍽️ สัตว์ป่วยเพราะหิว = ซื้อของกินไม่ได้ (รอบ 952)
- 1028-1121 เครื่องยนต์บิลรายเดือน (กลาง — ค่าบำรุงบ้านตอนนี้ / ค่าไฟ-น้ำ-เน็ต เสียบเพิ่มได้)
- 1122-1264 🍖 เงินค่าอาหารสัตว์รายเดือน — ทุกวันที่ 1 ของเดือน จ่ายตามจำนวนสัตว์ที่เลี้ยงอยู่
- 1265-1424 โรงงานผลิตสินค้า: จ่ายค่าผลิตด้วย "แต้มคำศัพท์"
### รายการ js/state.js
STORAGE_KEY:6 · QUIZ_PASS_REWARD:11 · CURE_COST:13 · HUNGRY_SICK_MS:14 · MEAL_HOUR:16 · MEAL_FULL:17
SLEEP_FROM_HOUR:18 · SLEEP_SICK_HOUR:19 · WAKE_HOUR:20 · DINNER_COST:21 · TOXIN_FULL:23 · DETOX_COST:24
FOODQUIZ_Q:26 · FOODQUIZ_COIN:27 · FOODQUIZ_BONUS:28 · FOODQUIZ_MAX_PLAYS:29 · SHAPE_JUNK_MEALS:31 · SHAPE_CLEAN_MEALS:32
SHAPE_MISS_MEALS:33 · SHAPE_EXP_BONUS:34 · HEAT_SICK_MS:35 · THIRST_SICK_MS:36 · DEFAULT_STATE:38 · migratePetShoppingState:259
FEED_CATS:303 · FEED_REACTIONS:317 · feedRx:325 · FEED_QUICK_CM:327 · SLOT_MS:339 · currentSlotStart:340
nextSlotStart:346 · mealDayKey:348 · nightKeyOf:350 · isNightNow:358 · newPet:363 · loadState:388
saveState:768 · activePet:778 · petStage:779 · isAdult:784 · abilityOn:785 · hasPetType:786
todayStr:789 · dailyTick:793 · addCoins:796 · QUEST_POOL:816 · QUEST_PER_DAY:825 · questsToday:826
questTick:833 · questEvent:837 · assetValue:873 · netWorth:897 · assetCount:899 · grantRankPromotionRewards:917
refreshRank:947 · heatProtected:965 · rainProtected:969 · petHungry:972 · petCanEat:976 · hungerSickLock:984
hungerSickMsg:992 · petShapeOf:1000 · updatePetShape:1006 · shapeMealDone:1013 · heatPct:1023 · ymStr:1032
billOutstanding:1036 · UTILITIES:1043 · HOME_UTILITIES:1049 · homeDecayed:1051 · billTick:1054 · PET_FOOD_PER_PET:1126
petFoodTick:1127 · myCar:1153 · carLoanDue:1158 · carLoanOverdue:1163 · carLoanPayable:1168 · carLoanPay:1175
compTick:1188 · ONLINE_RATE:1202 · onlineEarnActive:1203 · onlineEarnTick:1207 · onlineEarnFlush:1218 · marketTick:1228
applyMarketSystemBuy:1249 · addCraft:1270 · ORDER_MAX:1289 · ORDER_LIFE_MS:1290 · ORDER_GAP_MIN_MS:1291 · ORDER_GAP_SPAN_MS:1292
ORDER_TIER_WEIGHT:1293 · newOrder:1294 · orderTick:1307 · careTick:1315 · expNeed:1395 · addExp:1400
addRP:1420

## js/thaitime.js (52 บรรทัด · 13 รายการ)
TH_TZ_MIN:22 · TH_DAY_MS:23 · thShift:28 · thMs:30 · thDate:31 · thHour:32
thHourF:33 · thDayKey:34 · thDayStart:35 · thAtHour:39 · thTs:40 · TH_TZ_OPT:45
thLocaleOpt:46

## js/tpaward.js (42 บรรทัด · 0 รายการ)

## js/typing.js (370 บรรทัด · 0 รายการ)

## js/ui.js (10,530 บรรทัด · 459 รายการ)
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
- 6961-7282 💻 รอบ 706 (ผู้ใช้สั่ง 29 ก.ค. 2026): ช่องรายได้คอมพิวเตอร์บนแถบบนล็อบบี้
- 7283-7300 🌀🔤 รอบ 1045 — Vocab Arena (โลกผจญภัยฉบับใหม่)
- 7301-7723 ☁️📚 รอบ 1229 — Vocab Sky Playground
- 7724-7808 🏝️ รอบ 1377 — KART (public entry; separate persistent keys)
- 7809-7830 🌍 ปุ่มลัดเข้าโลก 3D ในรางเมนูซ้าย (ผู้ใช้สั่ง 9 ก.ค. 2026)
- 7831-7896 🔒 รอบ 1070/1132: โลกที่ยังไม่เปิดสาธารณะ — เปิดให้บัญชีทดสอบ 2 ชื่อเท่านั้น
- 7897-8011 ↩️🪙 Legacy recovery — คืนค่าเข้าที่เวอร์ชันเก่าอาจหักค้างไว้ก่อนเปลี่ยนเป็นเข้าฟรี
- 8012-8096 ☁️🧸 รอบ 1258 — เลือกตัวละคร Sky ก่อนเข้าโลก
- 8097-8285 🧭 ป้ายบอกทางของรางเมนูซ้าย (รอบ 601 · ผู้ใช้สั่ง 26 ก.ค. 2026)
- 8286-8455 การ์ดสวนผลไม้ (ข้อ 12): ซื้อต้นไม้ปลูกได้ไม่จำกัด แต่ละต้นออกผล
- 8456-8470 โรงงานผลิตสินค้า 🏭 + ตลาดขายต่อ (แนวคิดใหม่ 5 ก.ค. 2026)
- 8471-8494 โรงงานผลิต (แผง 🏭) — แยกออกจากตลาด (ผู้ใช้สั่ง 6 ก.ค. 2026)
- 8495-8769 ตลาดขายสินค้า (แผง 🏪) — แยกออกจากโรงงาน
- 8770-9885 🚗 รอบ 131: หมวดยานพาหนะ — โชว์รูมรถ 10 คัน (แคตตาล็อก 5 ช่อง/แถว)
- 9886-9948 ร้านสัตว์เลี้ยง (ซื้อเพิ่มได้ ไม่ลบตัวเดิม)
- 9949-9985 เลเวลอัพ (รายตัว)
- 9986-10091 สถิติผลการเรียนรู้
- 10092-10129 item 4: การ์ดสรุปส่งครู — ใบเดียวจบ ชื่อ/วัน-เวลา/เหรียญวันนี้/แรงค์/สอบล่าสุด
- 10130-10530 📞 หน้าจอโทรหาเพื่อน — สายเสียง (รอบ 625 · กลุ่ม 3 คน + ปิดวิดีโอ รอบ 631)
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
WORDSHIP_LOCK_MSG:7192 · wordShipAdminAllowed:7193 · refreshWordShipLock:7200 · loadStylesheetOnce:7210 · openWordShip:7220 · bindWordShipRail:7239
advBusyMsg:7252 · advResetLoad:7264 · loadAdv3d:7270 · loadVocabArena3d:7288 · loadSkyPlayground3d:7305 · SKY_BETA_DENIED_MSG:7308
ensureSkyBetaAccess:7309 · enterSkyPlayground3D:7317 · enterAdventure3D:7334 · pickAdvMap:7367 · enterHaunted3D:7402 · enterHeli3D:7425
pickHeliMap:7452 · enterDrone3D:7488 · confirmPetShoppingEntry:7509 · enterPetShopping3D:7535 · enterDrive3D:7587 · pickDriveMap:7626
enterMotoMapAsCar:7662 · enterSoccer3D:7681 · enterMoto3D:7701 · kartLobbyIconHTML:7727 · enterKart3D:7730 · enterPickup3D:7745
enterF1_3D:7760 · enterInvasion3D:7788 · WORLD3D:7816 · WORLD3D_COMING_SOON:7835 · world3DComingSoon:7836 · gotoRobotShop:7839
openHealDialog:7845 · world3DFail:7866 · worldEntryStarted:7901 · worldEntryStopped:7902 · GAME_ENTRY_STABLE_MS:7903 · gameEntryCommit:7905
gameEntryRefund:7913 · recoverInterruptedGameEntry:7930 · showGameEntryRefundNotice:7938 · startWorldEntry:7965 · railWorldClick:7990 · skyEntryCatalog:8016
skyEntryPickerHTML:8020 · openWorldEntryDialog:8030 · railScrollHint:8102 · railScrollTop:8110 · initRailScroll:8115 · renderRailWorlds:8135
tinvOnlineFriends:8223 · refreshTinvOnlineUI:8227 · tinvNoticeHTML:8238 · openTinvPicker:8247 · fruitCountdown:8291 · renderFarmCard:8303
renderFarmClock:8378 · buyFruit:8394 · sellFruit:8414 · sellAllFruit:8435 · collectImg:8464 · renderFactoryCard:8475
renderMarketCard:8499 · updateWishBadge:8557 · openWishlistDialog:8568 · bindStripArrows:8615 · renderMarketBrowse:8629 · openMarketBuyDialog:8656
carImg:8776 · renderVehicleShop:8777 · CS_CYCLE_MS:8829 · carInteriorImg:8830 · carStatHtml:8832 · renderCarShowroom:8839
csShowBig:8866 · csInit:8893 · RS_CYCLE_MS:8916 · robotImg:8917 · robotShopImg:8919 · renderRobotShop:8922
renderPetMarketShop:8942 · rsShowBig:8960 · rsInit:8980 · buyRobot:8999 · enterMecha3D:9024 · pickMechaRobot:9052
pickDriveCar:9084 · openCarBuyDialog:9127 · buyCarInsurance:9188 · payCarLoanMonthly:9207 · payCarLoanFull:9219 · carDriveBlock:9238
gotoVehicleShop:9243 · gotoMyStock:9248 · showNeedCarDialog:9254 · craftDiscount:9266 · renderFactory:9269 · renderOrdersUI:9338
startProduce:9357 · buyCollectible:9385 · cancelProduce:9415 · deliverOrder:9429 · renderOrderClock:9446 · renderCollectMine:9456
openListDialog:9505 · cancelListing:9562 · listingMarketStatus:9586 · maybeOfferStaleMarketBuy:9590 · openStaleMarketOffer:9601 · acceptStaleMarketBuy:9639
buyMarketItem:9675 · showCollectReveal:9740 · buyAC:9778 · openHomeShop:9816 · openPetPurchase:9890 · renderPetShop:9927
showLevelUp:9952 · renderStats:9989 · showTeacherCard:10096 · CALL_REACT_EMOS:10140 · CALL_TALK_MIN:10143 · CALL_TALK_HOLD:10144
CALL_ORDER_GAP:10146 · CALL_TONES:10152 · startCall:10526

## js/util.js (1,449 บรรทัด · 57 รายการ)
### 🗂️ สารบัญโซน js/util.js (Read/Edit เฉพาะช่วง)
- 2-23 UTIL: เสียง / เอฟเฟกต์ / เครื่องมือทั่วไป
- 24-1418 🎖️ รอบ 643: สัญลักษณ์ระดับชั้น (ผู้ใช้สั่ง 28 ก.ค. 2026)
- 1419-1449 🖱️🚫 รอบ 833: กันกล่องดำ "To show your cursor, switch apps, reload the page…"
### รายการ js/util.js
shuffle:6 · fmtNum:15 · escapeHTML:19 · gradeSymbol:32 · gradeMark:47 · nameWithGrade:55
gradeMarkCanvas:61 · gradeOf:77 · seededRand:92 · fmtThaiDT:104 · fmtThaiDate:108 · gameIsPortrait:117
gameCanLockLandscape:122 · gameIsStandalone:125 · lockGameLandscape:130 · IPHONE_LOBBY_VIEWPORT:164 · fitIPhoneLobbyViewport:175 · showScreen:194
TOAST_WARN_RE:211 · TOAST_FINANCIAL_RE:212 · TOAST_FINANCIAL_AMOUNT_RE:214 · restackToasts:221 · clearWarnToasts:247 · toast:251
toastLink:304 · floatFx:322 · beep:333 · soundStatus:354 · PET_MOOD:470 · petVoiceSynth:477
sirenSynth:554 · playCashier:578 · cashierSynth:592 · keyTapSynth:625 · bubblePopSynth:663 · bubbleTapSynth:682
playSpark:693 · sparkSynth:707 · thunderFx:742 · wordAudioFile:810 · speakCutOff:819 · speakWord:823
speakLetter:862 · pickSpeakVoice:885 · speakWordTTS:896 · askNameDialog:923 · askConfirm:969 · alertBox:987
applyNoAnim:1007 · BLK_VOCAB:1014 · openSettings:1062 · openHelp:1357 · openTeacherGuide:1384 · TAPGLOW_SEL:1408
TOUCH_INPUT_SEEN:1427 · mouseLockOK:1436 · lockMouse3D:1442

## js/vocabbook.js (207 บรรทัด · 14 รายการ)
VB_MAX:11 · VB_QUIZ_N:12 · VB_QUIZ_MIN:13 · vbGroup:16 · VB_GROUP_UI:21 · vbRecord:24
vbSeen:49 · vbStats:62 · vbList:70 · vbReviewCat:81 · vbStartReview:95 · openVocabBook:106
vbRender:148 · vbCardHTML:194

## js/wordsearch.js (524 บรรทัด · 0 รายการ)

## js/wordship.js (1,496 บรรทัด · 0 รายการ)

## js/wsaward.js (32 บรรทัด · 0 รายการ)

## css/account-deletion.css (15 บรรทัด · 11 selector)
.account-delete-overlay:2 · .ad-box:3 · .ad-head:4 · .ad-warning:5 · .ad-grid:6 · .ad-shared:7
.ad-actions:8 · .ad-safe:9 · .ad-type-label:10 · .ad-busy:11 · .set-account-panel:12

## css/arena-heroes.css (20 บรรทัด · 5 selector)
#ah-picker:2,3 · .ah-layout:4 · .ah-info:5,15 · .ah-header:11,12 · .ah-roster:16,17,18,19(+1)

## css/arena3d.css (458 บรรทัด · 102 selector)
#va-root:5,7,9,226(+102) · #va-canvas:8 · .va-vignette:11 · .va-scan:15 · .va-top:18 · .va-glass:20
.va-exit:23,26 · .va-player-card:27,29 · .va-player-name:30 · .va-online:31 · .va-word-card:32,34,36 · .va-word-th:37
.va-word-en:38 · .va-word-slots:40,41,43 · .va-coins:44 · .va-shop-btn:46 · .va-energy:48,54 · .va-energy-label:50
.va-energy-track:51 · .va-energy-fill:52 · .va-energy-power:55 · .va-bag:57 · .va-bag-label:59 · .va-bag-list:60
.va-bag-letter:61 · .va-party:68,72,73 · .va-party-find:70 · .va-party-list:74,76 · .va-boss:78,80 · .va-boss-head:81,82
.va-boss-track:83 · .va-boss-fill:84 · .va-boss-word:85 · .va-downed:87,90,91 · .va-revive:92,94,95 · .va-skill:96,117,120,121(+9)
.va-hp:98,100,103 · .va-hp-track:101 · .va-hp-fill:102 · .va-stick:105,109,110 · .va-stick-knob:111 · .va-skills:115
.va-feed:136 · .va-feed-line:138,140 · .va-pop:142,144,145,148 · .va-modal:150,152 · .va-panel:153 · .va-panel-head:156
.va-panel-title:157 · .va-panel-coins:158 · .va-store-grid:160 · .va-store-item:161,163,164 · .va-store-ico:165 · .va-store-name:167
.va-store-price:168 · .va-intro-panel:169 · .va-intro-logo:170 · .va-intro-sub:172 · .va-intro-steps:173 · .va-intro-step:174
.va-start:176,178 · .va-buy-confirm:181 · .va-buy-card:182,190,191 · .va-buy-gem:186,188 · .va-buy-kicker:189 · .va-buy-ledger:192,193,194
.va-buy-note:195 · .va-buy-actions:196,197 · #va-buy-cancel:198 · #va-buy-ok:199,200 · .va-portrait:203 · .va-avatar-icon:229
.va-home-nav:243,244,245 · .va-cargo:246 · .va-spell-toggle:264,265 · .va-spell-panel:267 · .va-slot-tabs:268,269,404 · .va-spell-grid:270
.va-spell-card:271,272,274,275 · .va-element-icon:273 · .va-spell-footer:276 · .va-vitals-layer:281 · .va-vital:282,283,284,285(+2) · .va-damage-number:287
.va-nav-layer:289 · .va-letter:290,291,292,293 · .va-hint:294,295,296,297(+1) · .va-mega-uses:306 · #va-crystal-count:307 · .va-map-ambience:310,311
.va-map-change:340 · #va-map-picker:361,362,363,364(+1) · .vam-cards:365 · .vam-card:366,367,368,369 · #vam-play:371 · .va-spell-icon:399
.va-grimoire-tools:405,406,407,408(+1) · .va-grimoire-nav:410,411,412,413 · .va-music-track:430,431 · .va-swipe-strip:442,443,444,445 · .va-swipe-hint:446 · #va-drop-letter:454,455

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

## css/home-v2.css (2,509 บรรทัด · 136 selector)
:root:9,2474 · #screen-dashboard:36,46 · #vw-home-v2-root:48,49,59,60(+123) · .vw2-screen-frame:81 · .vw2-sky:82,83,92,99(+1) · .vw2-shell:102,107,591
.vw2-glass:111 · .vw2-top:124,641,788,977(+2) · .vw2-profile:129,143,147,291(+3) · .vw2-kanok-corner:148 · .vw2-profile-crown:149 · .vw2-profile-kicker:150,151
.vw2-avatar-frame:152,157,297,298(+1) · .vw2-avatar:158,159,1979,1983(+3) · .vw2-avatar-edit:160,2036 · .vw2-profile-main:161,1898 · .vw2-name-row:162,163,1899 · .vw2-pencil:164,165,166
.vw2-profile-meta:167,1834,1900 · .vw2-profile-meta-chip:168,169,170,171(+12) · .vw2-grade-identity:172 · .vw2-grade-copy:173 · .vw2-profile-chips:174,1913 · .vw2-achievement-mark:175,1914
.vw2-rank:176,300,1915 · .vw2-sync-chip:177 · .vw2-wallet:179,645,790 · .vw2-wallet-pill:180,186,187,188(+39) · .vw2-stat-art:190 · .vw2-stat-copy:191
.vw2-top-actions:193,502 · .vw2-tool-btn:194,200,201,318(+11) · .vw2-main-grid:204,592,720,949 · .vw2-left:207,208,323,526 · .vw2-rail-btn:209,324,1300,1301(+3) · .vw2-rail-art:210,211,212,213(+4)
.vw2-rail-scene:214,215 · .vw2-rail-scene-mark:216,329 · .vw2-rail-label:217,330,721,1344 · .vw2-left-scroll-cue:218,528 · .vw2-feed:221,222,334,335(+26) · .vw2-section-head:223,224,225,344(+5)
.vw2-feed-items:226,889,1023,1870(+1) · .vw2-feed-card:227,345 · .vw2-feed-avatar:228 · .vw2-feed-copy:229 · .vw2-feed-coin:230,904,1029,1038(+2) · .vw2-feature:233,708,821,1273
.vw2-feature-title:234,235,348,349(+12) · .vw2-word-ribbon:236,237,238,350(+8) · .vw2-feature-stage:239,354,355,596(+1) · .vw2-world-scene:240,597,830 · .vw2-stage-depth:241,242,243,356(+2) · .vw2-stage-castle:244,358,598
.vw2-atmosphere:245 · .vw2-speech:246,359,360,361(+5) · .vw2-reward-card:247,362,363,364(+7) · .vw2-pet-halo:248,249,601 · .vw2-pedestal-aura:250,251,367 · .vw2-pet-platform:252,253,254,365(+1)
.vw2-pet:255,368,698,705(+3) · .vw2-pet-sparkles:256 · .vw2-house-preview:257 · .vw2-stage-copy:258,372,1186,1187(+1) · .vw2-feature-actions:259,375,376,831(+5) · .vw2-right:262,498
.vw2-mission:263,336,341,499(+1) · .vw2-quests:264,500,890 · .vw2-quest-row:265,1282 · .vw2-online:266,337,342,531(+2) · .vw2-online-row:267,1203 · .vw2-friends-btn:268,533,538,1208(+1)
.vw2-bottom:271,272,382,452(+14) · .vw2-mode:273,383,384,385(+27) · .vw2-preview-mark:274,602 · .vw2-home-active:277,278,279,2012(+3) · .vw2-rail-racing:325,331,527,1342 · .vw2-house-preview-head:369,370,497,1189(+3)
.vw2-stage-foreground:371,600,1053 · .vw2-enter:377 · .vw2-play:378 · .vw2-shop-link:379 · .vw2-bottom-scroll:458,477,478,479(+6) · .vw2-bottom-track:480,490,522,523(+42)
.vw2-online-list:501,532,891,1202 · .vw2-word-kicker:711,854,1275,2101(+1) · .vw2-word-copy:712,713,714,855(+7) · .vw2-word-reward:715,858,2114 · .vw2-feed-market-divider:894,895,896,1040 · .vw2-feed-market-note:897
.vw2-market-feed-card:898,899,900,1194(+3) · .vw2-feed-product:901,902 · .vw2-market-seller:903,1198 · .no-anim:982 · .vw2-house-backdrop:1191,1988 · .vw2-online-name-line:1204,1205
.vw2-online-badges:1206 · .vw2-online-copy:1207 · .vw2-rail-cure:1211,1212,1213,1214 · .vw2-online-modal-open:1218 · .vw2-online-modal:1219,1220 · .vw2-online-modal-panel:1221,1222
.vw2-online-modal-head:1223,1224,1230 · .vw2-online-modal-emblem:1225,1226 · .vw2-online-modal-heading:1227,1228,1229 · .vw2-online-modal-close:1231,1232,1241 · .vw2-online-modal-list:1233,1234,1235,1236(+3) · .vw2-online-modal-foot:1240
.vw2-qbody:1283 · .vw2-feature-action-scroll:1384,1397,1398,2039 · .vw2-feature-action-track:1399,1409,1417,1431(+5) · .vw2-pet-name-action:1433 · .vw2-owned-pets-action:1434 · .vw2-pet-modal-open:1438
.vw2-pet-modal:1439,1440 · .vw2-pet-modal-panel:1441,1442,1503 · .vw2-pet-modal-head:1443,1444,1447,1448(+3) · .vw2-pet-modal-emblem:1445,1446 · .vw2-pet-modal-close:1451,1452,1467 · .vw2-pet-modal-list:1453,1454
.vw2-owned-pet-card:1455,1456,1457,1464 · .vw2-owned-pet-thumb:1458,1459,1460 · .vw2-owned-pet-copy:1461,1462,1463 · .vw2-pet-modal-empty:1465 · .vw2-pet-modal-foot:1466 · .vw2-pet-modal-healbar:1505
.vw2-heal-all:1506,1507,1508,1513(+3) · .vw2-heal-all-icon:1509 · .vw2-heal-all-copy:1510,1511,1512 · .vw2-adventure-hub:1544,1550,1551,1552(+22) · .vw2-adventure-landmark:1558,1562,1563,1630(+1) · .vw2-adventure-copy:1564,1565,1566,1635(+2)
.vw2-adventure-menu:1570,1571,1581,1582(+15) · .vw2-adventure-menu-panel:1572,1573,1574,1575(+8) · .vw2-adventure-menu-scroll:1578,1579 · .vw2-adventure-menu-track:1580,1651

## css/lettercannon.css (89 บรรทัด · 30 selector)
#lc-game:6,7,13,14(+30) · .lc-hud:8 · .lc-glass:9 · .lc-stats:10 · .lc-stat:11,12 · .lc-coin-stat:15
.lc-wordbox:16 · .lc-target:17 · .lc-meaning:18 · .lc-progress:19 · .lc-slot:20,21 · .lc-actions:23
.lc-iconbtn:24,25 · .lc-exitwide:26 · .lc-power:27 · .lc-power-name:28 · .lc-hint:29 · .lc-move:30,31
.lc-modal:32,33 · .lc-count-exit:34 · .lc-card:35,36 · .lc-result-card:37,40 · .lc-result-grid:38,39 · .lc-btn:42
.lc-count:43 · .lc-toast:45 · .lc-coinfx:47 · .lc-coin-flight:48 · .lc-announce:51 · .lc-rotate:52

## css/lobby.css (6,294 บรรทัด · 843 selector)
:root:6,5917 · html:15,5931 · body:21,5881,5923,5943 · *:41,42,43,44 · #app:47 · h1:49
.subtitle:50 · .shop-title:51 · .screen:57 · #screen-select:66,67,68,69(+5) · .egg-need:76 · .petshop-topright:78
.petshop-play-link:79,84 · #screen-login:97,110,111,115(+12) · .login-lux:128 · .login-logo:129 · .login-tag:134 · #screen-game:206,207,208,209(+7)
#screen-quiz:220,221,222,223(+6) · #quiz-choices:232,233 · .word-card:240 · .quiz-choice:241,242,243 · .big-btn:246,247,248,249 · #screen-dashboard:254,1174,1182
.lobby-top:268,903,904,905(+36) · .top-flex:269 · .profile-plate:270,274,824,4145(+12) · #rain-fx:279 · .rain-glass:283 · .glass-drop:284
.rain-vignette:303 · .no-anim:310,472,485,546(+64) · .rail-btn:313,925,931,933(+28) · .rail-badge:314 · .fr-code-box:319 · .fr-code-label:323
.fr-code-row:324 · .fr-code:325 · .fr-copy-btn:330,334,339,340 · .fr-search-btn:335 · .fr-add-btn:336 · .fr-accept:337
.fr-decline:338 · #fr-search-input:341 · #fr-search-result:345 · .fr-found:346 · .fr-hint:350 · .fr-list-title:351
.fr-row:352 · .fr-req:356 · .fr-row-name:358,362,5621 · .fr-row-status:366 · .fr-req-btns:367 · .online-dot:368
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
.call-emo:676,677 · .call-fx:679 · .call-fx-emo:680 · .pl-click:772,774,775 · .pl-overlay:776 · .pl-card:780,2958
.pl-close:786 · .pl-head:790,2715,2718 · .pl-grade:795,5627,5628 · .pl-body:796 · .pl-loading:797 · .pl-none:798
.pl-me-tag:799 · .pl-blk-wrap:801 · .pl-blk:802 · .pl-stat:803 · .pl-lbl:808 · .pl-val:809,810
.pl-tip:811 · .chip-edit:817,822,823 · .rank-mini:829,835,836,837 · .pass-photo:839,844 · .pet-tabs:846 · .dict-box:847,851,852,853(+1)
.dict-card:859,864,868,869(+2) · .dict-head:865,866 · .dict-trail:873,877 · .dt-c:878,882,883 · .dt-sep:884 · .dict-today:885
.di-w:887,888,889 · .dict-list:890 · .dict-item:891,895,896,897(+5) · .lobby-mid:911 · .rail-wrap:914,959,970,971 · .rail-scroll:916,953,957,958
.lobby-rail:917,924 · .rail-nudge:960,968,969,972(+1) · .rail-worlds:979 · .rail-div:980 · .lobby-stage:1034,1036,1052,1179(+13) · .newword-banner:1042,1049,1054,4975(+2)
.coin-fly:1065,1068 · .coin-plus:1074 · .nw-pop-coin:1089,1091,1092 · .nw-pop-goal:1095,1096,1100,1104 · .nw-goal-head:1097,1099,1101 · .nw-goal-bar:1102
.nw-goal-fill:1103 · .nw-pop-book:1105,1106 · .nw-tag:1127,4981,5003 · .nw-word:1132,4985,5008,5101 · .nw-hint:1134,1135,4986,5010(+1) · .nw-coin:1137,1140,4987,4991
.nw-countdown:1145,4992 · .nw-bar:1147,5011 · .nw-bar-fill:1149 · .pet-stage:1152,3252 · .nw-box:1159,3261 · .nw-pop-word:1160
.nw-speak:1161 · .nw-pop-phon:1162 · .nw-ipa:1163 · .nw-pop-sent:1164 · .nw-pop-mean:1165 · .pet-tab:1166,1167,1168,3755
.stage-hero:1189,1204,1212,1357(+29) · .hero-ground:1226,1346,1352 · .hero-rank-bg:1228,1231,1234,1238(+18) · #lobby3d-canvas:1251,1252 · .hero-scene:1256,1258,1265,1266(+8) · .caretaker-fig:1305
.caretaker-img:1308 · .caretaker-emoji:1310 · .blk-rig:1317,1318,1319 · .stage-plate:1379,1387,1398,1399(+23) · .plate-title:1393 · .lobby-side:1426,1462,1467,1470(+22)
.side-sec:1429,2338,3650,4121 · .side-label:1430,1435 · .side-label-row:1438,1439 · .lb-tabs-out:1440,1441,1445 · .side-glass:1449,1456 · .side-card:1468,1579
#quest-card:1480,1481,1509,1510(+6) · .q-bigcard:1486,1515 · .qb-top:1488 · .qb-emoji:1489 · .qb-name:1491 · .qb-bar:1492,1493
.qb-row:1495 · .qb-prog:1496 · .qb-reward:1497 · .qb-go:1498,1502 · .q-dots:1503 · .q-dot:1504,1505,1506
.q-bonus:1507 · .inv-card:1526,1528,1529 · .inv-btns:1530 · .inv-go:1531,1533 · .inv-x:1534 · #online-card:1538,3658,3659,3660(+7)
.fq-overlay:1539 · .fq-box:1541,3463 · .fq-head:1545,1547 · .fq-close:1548 · .fq-sec:1550 · .fq-worlds:1551
.fq-world:1552,1554 · .fq-acts:1555 · .fq-act:1556,1559,1560 · .lb-prize:1593 · .lb-coins:1596 · .lbf-cell:1597,2797,2800,2801(+3)
.lb-award-bar:1599,1605,1606 · .lb-award-go:1607 · .lbf-award:1609,1615,1616,1617 · .pod-pz:1618 · .wsa-overlay:1621 · .wsa-box:1623
.wsa-head:1628 · .wsa-title:1629 · .wsa-when:1630,1631 · .wsa-close:1632,1635 · .wsa-cols:1636 · .wsa-col:1637
.wsa-sec-h:1638,1639 · .wsa-msg:1640 · .wsa-msg-h:1643 · .wsa-msg-b:1644,1645 · .wsa-msg-none:1646 · .wsa-rules:1648,1649
.wsa-list:1650 · .wsa-row:1651,1653 · .wsa-r:1654 · .wsa-n:1655 · .wsa-s:1656 · .wsa-p:1657
.wsa-prizes:1658 · .wsa-pz:1659,1662 · .wsa-reveal-medal:1663 · .lobby-bottom:1678,1681,1682,1684(+9) · .rail-onet:1697 · .lobby-quiz-btn:1698
.lobby-book-btn:1699,1700 · .lobby-play-btn:1702,1706 · .lobby-exam-btn:1708,1709,1711 · .panel-overlay:1716,1721,5116,5117(+8) · .panel-box:1722 · .panel-head:1729,1733
.panel-close:1734,1739 · .panel-body:1740,1744,1745 · .panel-page:1742,1743 · .collect-sub:1749 · .mkt-empty:1750 · .craft-box:1751
.mkt-listing:1752 · .mkt-filter:1753,2158 · .hq-grid:1760 · .hq-card:1761,1766,1790 · .hq-head:1767 · .hq-pic:1773,1775
.hq-emoji:1777 · .hq-badge:1778 · .hq-stars:1782 · .hq-price:1783,1788,1789,1792(+6) · .craft-credit:1796,1798,1799 · .car-grid:1806,1808,1809
.robot-weap:1810 · .dmap-box:1813,1814 · .dmap-grid:1820 · .dmap-card:1822,1825,1826,1827(+2) · .dmap-ico:1829 · .dmap-new:1832
.dcp-grid:1834 · .dcp-card:1836,1839,1840,1841(+10) · .levelup-box:1858,2082,2092,3215(+2) · .dcp-box:1861,1862,1866,1867(+6) · .dcp-lock:1875 · .sold-badge:1879,1881,1882
.rs-showroom:1884,5579,5580 · .rs-list:1885,1887,5560,5563 · .rs-thumb:1888,1890,1891,1892(+1) · .rs-thumb-pic:1893,1894 · .rs-thumb-price:1895 · .rs-stage:1897
.rs-big:1900 · .rs-big-img:1901 · .rs-elec:1905,1909,1914 · .rs-edge:1915,1921 · .rs-info:1924,1925,1926,1927(+1) · .rs-buy:1929,1931,1932
.cs-showroom:1936,5552,5553,5581(+3) · .cs-list:1937,1939,5554,5559(+9) · .cs-thumb:1940,1942,1943,1944(+1) · .cs-thumb-pic:1945,1946 · .cs-thumb-name:1947 · .cs-thumb-price:1948
.cs-thumb-own:1949 · .cs-stage:1951 · .cs-big:1954 · .cs-big-img:1955 · .cs-elec:1959,1963,1967 · .cs-edge:1968,1974
.cs-interior:1977 · .cs-inr-label:1978,1979 · .cs-inr-img:1980 · .cs-info:1982,1983,1984,1985(+6) · .cs-buy:1993,1995,1996,1997 · .car-emoji:1999
.car-mine:2005 · .car-mine-pic:2010 · .car-mine-info:2011 · .car-loan:2012,2013 · .car-mine-btns:2014,2015,2016 · .car-locked:2018
.car-mine-head:2020 · .car-pick-list:2021,2022 · .car-pick:2023,2025,2026 · .car-pick-pic:2027,2028 · .car-pick-name:2029,2030 · .car-pick-od:2031
.car-buy-box:2033,3467 · .cb-pic:2034,2035,2036 · .cb-lines:2037 · .cb-li:2038,2042,2043 · .cb-ins:2044,2048,2049 · .cb-plan:2050
.cb-pl:2051,2056,2058,2062(+1) · .cb-total:2069 · .cb-btns:2070,2075 · .cb-x:2071 · .dress-overlay:2078,2095,2098,2102 · .dress-title:2096,2097,2099
.dress-wallet:2100 · #shop-grid-wrap:2104 · .shop-grid:2105 · .shop-item:2106,2114,2115,2116(+13) · .it-topline:2122 · .it-rarity:2123,2124
.it-type:2125 · .it-art-stage:2126 · .it-art:2128 · .it-emoji:2129 · .it-sparkle:2130 · .it-action:2134
.mkt-tab:2159,2160 · .pg-btn:2161,2162,2163 · .pg-dot:2164 · .fr-gift-btn:2198,2203 · .gift-sec-title:2206 · .gift-in-row:2208
.gift-out-row:2212 · .gift-in-pic:2213,2215,2216 · .gift-in-info:2217,2218 · .gift-in-btns:2219 · .gift-accept:2220,2224,2226 · .gift-decline:2225
.gift-box-card:2227 · .gift-box-from:2228,2229 · .gift-note:2230 · .gift-pick-overlay:2233 · .gift-pick-box:2237 · .gift-pick-head:2243,2247
.gift-pick-close:2248 · .gift-pick-tabs:2250 · .gp-tab:2251,2255 · .gift-pick-body:2256 · .gp-chips:2257 · .gp-chip:2258,2262
.gp-card:2263,2264 · .gp-price:2265 · .gp-note:2266 · .gift-cf-pic:2267 · .chat-emoji-cats:2272 · .chat-emoji-cat:2276,2280,2281
.chat-emoji-wrap:2282,2283 · .stage-left:2292,5107 · .pet-info-btn:2296,2303,2304 · .feed-list:2311,2315,2340,2341(+1) · .feed-empty:2316,2319 · .fd-tools:2325
.feed-bell:2326,2328,2329,2330 · .fd-prog:2334,2335 · .fpost:2342,3097 · .fp-head:2347 · .fp-who:2348 · .fp-name-line:2351
.fp-name:2352 · .fp-when:2353 · .fp-badges:2355,2358 · .fp-badge-ic:2356 · .fp-text:2360 · .fp-media:2363
.fp-img:2365 · .fp-cap:2367 · .fp-big:2368 · .fp-sum:2370,2372 · .fp-sum-rx:2373 · .fp-sum-none:2374
.fp-en:2375 · .fp-bar:2377 · .fp-act:2378,2382,2384 · .fp-like:2383 · .fp-page:2395,2396,2397,2398(+3) · .fp-rxbox:2401
.fp-rxb:2405,2407,2408,2409(+1) · .fp-rxb-off:2411 · .fp-fly:2413,2416,2417 · .fcm-overlay:2420 · .fcm-box:2422 · .fcm-post:2426,2427
.fcm-rxs:2428 · .fcm-rx:2429 · .fcm-list:2430,2432 · .fcm-row:2433,2434,2435 · .fcm-none:2436 · .fcm-item:2438
.fcm-reps:2439 · .fcm-rep:2441 · .fcm-more:2443,2445 · .fcm-arrow:2446 · .fcm-reply:2447,2449 · .fcm-like:2451,2454,2455,2456
.fcm-likeic:2457 · .fcm-cnt:2459,2461 · .fcm-likers-box:2462 · .fcm-likers-list:2463,2465 · .fcm-liker-row:2466 · .fcm-liker-none:2467
.fcm-repbar:2468,2471 · .fcm-repx:2472 · .fcm-note:2474 · .fcm-quick:2476,2478 · .fcm-q:2479,2482,2483 · .fcm-add:2484
.fcm-input:2485,2487 · .fcm-send:2488,2490 · .fcm-locked:2491 · .fnt-overlay:2493 · .fnt-box:2495 · .fnt-list:2499,2501
.fnt-row:2502,2504,2517 · .fnt-ico:2505 · .fnt-tx:2506,2507 · .fnt-sub:2508 · .fnt-hint:2510 · .fnt-go:2511,2514,2515,2523
.fnt-tag:2518 · .fnt-note:2520 · .fcm-hl:2525 · .feed-plate:2533 · .feed-all-btn:2534,2539 · .fdb-overlay:2544
.fdb-box:2546 · .fdb-head:2550 · .fdb-close:2554,2556 · .fdb-live:2557 · .fdb-live-title:2558 · .fdb-live-rows:2560,2562,2563
.fdb-live-row:2564,2566,2567,2568 · .fdb-dot:2569 · .fdb-list:2571,2572 · .fdb-empty:2573 · .fdb-row:2574 · .fdb-row-top:2576
.fdb-ico:2577 · .fdb-txt:2578 · .fdb-name:2579 · .fdb-ago:2580 · .fdb-actions:2581 · .fdb-like:2582,2585,2586,2587
.fdb-cm-list:2588 · .fdb-cm-row:2589,2591 · .fdb-cm-empty:2592 · .fdb-cm-add:2593 · .fdb-cm-input:2594,2596 · .fdb-cm-send:2597,2599
.fdb-cm-locked:2600 · .pi-overlay:2603 · .pi-box:2607,2611,2612,2616(+13) · .pi-close:2618,2623,2624 · .pi-close-left:2626 · .pi-close-bottom:2627,2633
.pi-portrait:2657 · .pet-wear:2664,2667,2669 · .pi-portrait-wrap:2672,2674 · .pi-dress-btn:2682,2686,2687 · .pi-shape-cap:2688,2691,2692,2693 · .pi-shape-toggle-btn:2695,2698
.pi-dress-pip:2700,2705,2706,2707(+1) · .pi-wear-note:2710,2712 · .greet-card:2719 · .greet-sub:2720 · .greet-grid:2721 · .greet-opt:2722,2725,2726,2727
.greet-e:2728 · .pi-streak:2732 · .pi-streak-head:2734,2736 · .pi-streak-best:2737 · .pi-dots:2738 · .pi-dot:2740,2741,2742
.pi-streak-note:2743 · .pi-care-title:2744 · .lbf-overlay:2757 · .lbf-box:2760,2774,2775,2776(+13) · .lbf-head:2765 · .lbf-title:2766
.lbf-tabs:2767,2770 · .lbf-note:2773 · .lbf-close:2789 · .lbf-close-l:2790 · .lbf-scroll:2791,2793,2918 · .lbf-body:2794
.lbf-grid:2795 · .lbf-box-bcat:2818 · .lbf-bcat-wrap:2819 · .lbf-bcat:2821,2880,2881,2882(+3) · .lbf-bcat-head:2823,2824,2825 · .lbf-bcat-mid:2832
.lbf-bcat-badge:2833,2892 · .lbcat-ic:2843 · .badge-shine-img:2849 · .badge-shine:2867,2868 · .lbcat-ic-label:2894 · .lbf-bcat-rows:2896
.lbf-one-row:2900,2901,2902 · .lbf-bcat-row:2903,2905,2906,2908 · .lbf-podium:2924 · .pod:2926,2953,2954 · .pod-char:2928 · .pod-base:2930
.pod-rank:2932 · .pod-label:2934,5623 · .pod-name:2936 · .pod-sc:2938 · .pod-1:2943,2944 · .pod-2:2945,2946
.pod-3:2947,2948 · .pod-4:2949,2950 · .pod-5:2951,2952 · .pl-wide:2971,2974,2975,2976(+8) · .pl-follow:2977,2982,2984 · .pl-unfollow:2986,2992,2993
.pl-followers:2994 · .pl-cols:2995,3000,3001,3002 · .pl-col:2996 · .pl-sec-title:2997 · .pl-badges-col:3003 · .pl-feed:3004,3007,3014
.pl-feed-row:3008,3012,3013 · .pl-assets-wrap:3016,5460,5535 · .pl-assets:3017,5463,5468,5474(+4) · .pl-asset:3020,3024,3031 · .pl-asset-emoji:3025 · .pl-asset-n:3026
.pl-pets-wrap:3033 · .pl-pets:3034 · .pl-pet:3035,3040,3042 · .pl-pet-nm:3043 · .img-lightbox:3046,3051,3052,3056(+3) · .cert-svg:3075
.cert-tap:3076,3081 · .cert-chip-sm:3084 · .pl-sec-sub:3104 · .pl-certs:3105,3107 · .cert-mini:3108,3112,3114 · .cert-mini-cap:3115
.cert-none:3117 · .lv-cert-row:3119,3121 · .lv-cert-btn:3122,3127 · .cert-lightbox:3129,3134,3135,3139(+3) · .pl-chat:3159,3164 · .pl-call:3166,3172
.pet-peek:3173,3174 · .pp-chips:3176 · .pp-chip:3177 · .pp-gift:3182,3188 · .settings-box:3190,3191,3264,3275(+37) · .set-feed-head:3192
.set-feed-sub:3196 · .set-feed-row:3197 · .pillinfo-val:3202 · .pillinfo-desc:3207,3226 · .pillinfo-box:3218 · .plf-head:3221
.plf-emoji:3222 · .plf-ht:3223,3224,3225 · .plf-foot:3227,3229,3230 · .alert-box:3235,3237 · .ab-emoji:3238 · .ab-title:3239
.ab-desc:3240 · .ab-btns:3241,3242,3243 · .heal-heart:3245 · .attn-box:3260 · .set-tabs:3285,3289,3292,3293 · .set-attention-ico:3302
.set-attention-copy:3303,3304,3305 · .set-attention-go:3306 · .set-panels:3307 · .set-panel:3308,3311,3312,3314 · .set-offline-card:3315 · .set-pack-icon:3322
.set-pack-copy:3327,3328,3329,3330 · .set-pack-progress:3331,3333 · .set-pack-actions:3335 · .help-box:3441,3442,3443 · .wl-box:3461 · .food-box:3462
.home-shop-box:3464 · .summary-box:3465 · .report-box:3466 · .wl-grid:3469 · .tc-wrap:3471 · .spell-btn:3477,3482,3483
.sp-hud:3484 · .sp-word:3486 · .sp-ch:3487,3492 · .sp-th:3494 · .sp-hint:3496 · .sp-exit:3499,3503
.sp-banner:3504 · .sp-big:3509 · .sp-thb:3511 · .sp-coin:3512 · #spell-confetti:3517 · .sp-rb:3518
.sp-day:3528 · .sp-perfect:3530 · .sp-late:3532 · #spell-coinpop:3535 · .side-sub:3644,3646 · .sec-quest:3651
.on-page:3663,3664,3665,3666 · .inbox-overlay:3676 · .ib-box:3678 · .ib-head:3682 · .ib-close:3686,3688 · .ib-list:3689,3690
.ib-row:3691,3692,3693,3694 · .ib-ava:3695,3700,3701 · .ib-on:3702 · .ib-mid:3704 · .ib-name:3705 · .ib-last:3706
.ib-meta:3707 · .ib-time:3708 · .ib-dot:3710 · .ib-story-badge:3713 · .ib-empty:3717 · .ib-story:3719,3721
.ib-story-item:3722,3724,3731 · .ib-story-ava:3725 · .ib-story-on:3729 · .ib-world:3734,3737 · .ib-tabs:3739 · .ib-tab:3740,3743,3745
.ib-tab-dot:3746 · .ib-call-ava:3750 · .ib-call-row:3751,3752 · #btn-music:3758,3761,3762 · #ws-overlay:3777,3957 · #ws-board:3780,3786,3788,3965(+3)
.ws-head:3791,3994,3995 · .ws-title:3792,3996,4003,4004 · .ws-findbar:3795,4005 · .ws-tip:3796,4011 · #ws-combo-clock:3798,3800,3802,3803(+2) · .ws-grade:3808,3809,4016,4022
.ws-body:3812,4023 · .ws-gridwrap:3813,4053 · #ws-grid:3816,4058 · .ws-cell:3821,3826,3828,3831(+6) · .ws-flash:3837,3839,4085 · .ws-coinpop:3843,3867
.ws-combo:3854,3858,3859,3860 · .ws-find:3871,4010 · #ws-prog:3872,4012 · #ws-words:3876,3880,4024 · .ws-word:3882,3887,3888,3889(+16) · .ws-actions:3897,3898,3907,4072(+1)
.ws-sizes:3902,4078 · .ws-sizes-lb:3904,4079 · .ws-size-now:3905,4080 · #ws-new:3908,4081 · #ws-combo-help:3909,4082 · #ws-stash:3910,4083
#ws-clear:3911,4084 · #ws-combo-dialog:3913,3914 · .ws-combo-card:3916,3919,3926,3927 · .ws-combo-lead:3920 · .ws-combo-steps:3921,3922,3924,3925 · .ws-combo-close:3928
.ws-combo-ok:3930 · #ws-win:3931,3933,4086 · .ws-win-in:3934,3937,4087,4088 · .sec-online:4123 · .rank-tab:4153,4154,4155,4156(+2) · .pet-show-bg:4186,4188,4190,4195(+22)
.bond-context:4299 · .bond-owner:4301,4304,4306 · .bond-owner-heart:4307 · .bond-talk:4309,4313,4315,4316(+6) · .bond-home-card:4323,4328,4329 · .bond-home-art:4330
.bond-home-img:4332 · .bond-home-empty:4334 · .bond-home-copy:4335,4336,4337,4338 · .bond-home-go:4339 · .bond-gear:4341,4345 · .ps-night-fx:4371,4373,4385,4390(+1)
.pet-show:4400,4403,4415,4417(+63) · .ps-video:4684 · .ps-worn-pip:4762,4763 · .id-card:4786,4793,4797 · .id-chip:4810 · .clock-chip:4819,4820
.coin-block:4836 · .coin-subrow:4837 · .coin-group:4838 · .coin-pill:4868,4869,4890 · .cp-lb:4893 · .cp-v:4894
.topbar-icons:4930 · .topbar-icons-row:4931 · .rank-move-box:4948 · .rank-move-head:4953 · .rank-move-feed:4957,4961,4962 · .rank-move-row:4963,4967
.rank-move-up:4968 · .rank-move-name:4969 · .rank-move-topic:4970 · .rank-move-empty:4971 · .rank-move-gap:4972 · .nw-sub:5009
.top-flex2:5104 · #panel-factory:5123,5124,5128,5129(+39) · #panel-rank:5264,5265,5271,5276(+11) · .grid2x8:5347,5353 · .pl-badges-vwrap:5362,5377 · .grid3x5:5363,5368
.pl-badge-arrow:5369,5375 · .pba-u:5376 · .pl-badges-strip:5381,5389,5390 · .pl-badge-card:5391,5397,5415,5416(+1) · .pl-badge-card-ic:5403,5412,5414 · .pl-badge-card-nm:5418
.pl-badges-empty:5424,5426 · .mine-strip:5440,5442,5443,5448(+4) · .mb-strip:5454,5493 · .gmark:5601,5605,5606,5607(+1) · .gm-stack:5610,5614 · .gm-row:5616
.lb-name:5618,5619,5620 · .grade-edit:5641,5646,5647 · .gradelock-box:5651,5667,5672,5674 · .gl-head:5652 · .gl-emoji:5653 · .gl-ht:5654
.gl-cur:5655 · .gl-lock:5656,5661 · .gl-ok:5660 · .gl-lock-sub:5662 · .gl-why:5663 · .gl-pick-lb:5664
.gl-opts:5665 · .gl-hist:5675 · .gl-hline:5676 · .gl-hg:5680 · .gl-hat:5681 · .gl-harr:5682
.gl-foot:5683 · .gl-cf:5684 · .reg-gradelock:5706 · #tp-overlay:5716 · #tp-board:5718,5722 · .tp-head:5726
.tp-title:5727 · .tp-stat:5729,5731 · .tp-pts:5733,5736 · .tp-close:5738,5744,5745 · .tp-snd:5748,5751,5757,5758 · .tp-snd-ic:5752
.tp-snd-track:5753 · .tp-snd-thumb:5755 · .tp-prompt:5762 · .tp-word:5764,5778,5779 · .tp-ch:5766,5771,5772,5774 · .tp-thai:5782
.tp-hint:5784 · .tp-empty:5786 · .tp-keys:5789 · .tp-row:5791 · .tp-row-fn:5793,5826 · .tp-key:5797,5809,5811,5817(+2)
.tp-key-fn:5824 · .tp-fx:5830 · .tp-coinpop:5831 · .tp-pop-pt:5836 · #city-backdrop:5850,5856 · .city-arrive:5857,5858
.night:5872,5892,5893,5895(+4) · #night-veil:5918,5942 · .theme-emerald:5961,5973,5980,5983(+7) · .theme-plum:5966,5977,5981,5984(+3) · #theme-veil:5994 · #screen-picmatch:6049,6055,6056,6057(+41)
.pm-category-btn:6095,6098 · .pm-sheet-card-img:6099 · .pm-card:6102,6107,6111,6113(+9) · .pm-grid:6105 · .pm-right:6135 · .pm-now:6136,6142
#pm-now-en:6143 · .pm-now-th:6144 · .pm-lobby-btn:6152,6156 · .pm-mode-btn:6181,6184 · .pm-wordcard:6185,6186,6188 · .mkt-pet-head:6223
.mkt-pet-wrap:6224 · .mkt-pet-list:6225 · .mkt-pet-card:6226,6233,6234,6235(+3) · .mkt-pet-picture:6237,6238,6239 · .mkt-pet-name:6240 · .mkt-pet-stage:6241
.mkt-pet-price:6242 · .mkt-pet-short:6244 · .rs-chibi:6257,6258,6259,6260(+15)

## css/onetpromo.css (41 บรรทัด · 26 selector)
.onet-promo-overlay:2 · .onet-promo-card:3 · .onet-promo-content:4 · .onet-promo-close:5 · .onet-promo-kicker:6 · .onet-promo-title:7
.onet-promo-lead:8 · .onet-promo-grades:9 · .onet-promo-grid:10 · .onet-promo-stat:11 · .onet-promo-actions:12 · .onet-promo-go:13,15
.onet-promo-optout:14 · .racing-promo-overlay:20 · .racing-promo-card:21,22,23,25 · .racing-promo-flag:24 · .racing-promo-features:26 · .kart-promo-overlay:30
.kart-promo-card:31 · .kart-promo-close:32 · .kart-promo-art:33,34 · .kart-promo-spark:35 · .kart-promo-road:36 · .kart-promo-tag:37
.kart-promo-chips:38 · .kart-promo-actions:39

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

## css/style.css (2,503 บรรทัด · 606 selector)
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
.mkt-sold:2148,2149,2150 · .mkt-sys-box:2151,2152,2153 · .mkt-sys-coins:2154,2155 · .mkt-buy-box:2160,2166 · .mkt-buy-item:2167 · .mkt-buy-pic:2177
.mkt-buy-pic-img:2189 · .mkt-buy-pic-emoji:2190 · .mkt-buy-meta:2191 · .mkt-buy-name:2192 · .mkt-buy-seller:2193,2194 · .mkt-buy-price:2195
.mkt-buy-balance:2196 · .mkt-confirm-code-title:2197 · .mkt-code-target:2198 · .mkt-pin-note:2211 · .mkt-code-input:2212 · .mkt-code-error:2227
.mkt-pin-grid:2236 · .mkt-pin-btn:2241,2253 · .mkt-pin-del:2254 · .mkt-pin-clear:2255 · .mkt-buy-actions:2256,2262 · .mkt-buy-cancel:2273
.mkt-buy-confirm:2278,2284 · .list-dialog:2305,2306,2311 · .list-hint:2310 · .collect-reveal-frame:2314,2321 · .collect-reveal-img:2320 · .collect-reveal-stars:2322
.craft-box:2325 · .craft-head:2326 · .craft-bar:2327 · .craft-fill:2328 · .craft-text:2329 · .craft-btn-row:2330,2331
.craft-go-btn:2333,2339,2340,2343 · .craft-cancel:2351,2355 · .mkt-catalog:2358,2359,2360 · .mkt-pager:2363 · .pg-btn:2364,2368,2369 · .pg-mid:2370
.pg-dots:2371 · .pg-dot:2372,2373 · .order-head:2374 · .order-row:2375,2380,2382,2384 · .order-deliver:2385,2390 · .order-need:2391
.avatar-chip-photo:2397 · .pass-photo:2398 · .pl-photo:2399 · .pp-cam:2404,2412 · .set-photo-row:2415,2421 · .ph-thumb:2422
.ph-plus:2423 · .photo-box:2429,2430,2451,2455(+4) · .ph-now:2431 · .ph-now-img:2432,2436 · .ph-now-cap:2437 · .ph-warn:2438
.ph-sync:2443,2446 · .ph-sync-wait:2447 · .ph-sync-ok:2448 · .ph-sync-bad:2449 · .ph-btns:2450 · .ph-tip:2460
.ph-stage:2462,2466 · .ph-cv:2467 · .ph-ring:2468,2473 · .ph-zoom:2477 · .ph-foot:2478 · .ph-crop-box:2479

## css/wordship.css (62 บรรทัด · 25 selector)
#wsh-game:2,3 · .wsh-stage:4 · .wsh-cross:5 · .wsh-hud:6 · .wsh-glass:7 · .wsh-stats:8,9
#wsh-hearts:10 · .wsh-word:11,12,13,14 · .wsh-bank:15 · .wsh-exit:16 · .wsh-hint:17 · .wsh-pad:18,19,23
.wsh-left-controls:20 · .wsh-auto:21,22 · .wsh-attack:24,25 · #wsh-drop:26,27 · #wsh-scope:28 · .wsh-speed:29,30,31,32(+3)
.wsh-speed-foot:36 · .wsh-toast:37 · #wsh-arrows:38 · .wsh-nav:39,40,41,42(+2) · .wsh-modal:45,46 · .wsh-card:47,48,49
.wsh-buttons:50,51
