# CODE_MAP.md — แผนที่โค้ด:บรรทัด (เจนอัตโนมัติโดย `tools/gen_code_map.py` — **ห้ามแก้มือ** เดี๋ยวโดนเขียนทับ)

> วิธีใช้: หาชื่อฟังก์ชัน/ค่าคงที่/selector ในไฟล์นี้ (Grep หรือกวาดตา) → `Read` ไฟล์จริง `offset=<บรรทัด>` `limit=40`
> 🗂️ ไฟล์อ้วนมี **สารบัญโซน** (`st-end ชื่อโซน`) — งานทั้งระบบ/โลก 3D: Grep ชื่อโซน → Read/Edit เฉพาะช่วงนั้น **ห้ามอ่านทั้งไฟล์** · เพิ่มระบบใหม่ในไฟล์อ้วนต้องครอบ banner `/* ==== */`+ชื่อโซน (สารบัญเจนเอง)
> css = index `selector:บรรทัดทุกจุดที่ประกาศ` (บั๊ก UI เริ่มหาที่นี่) · เจนใหม่ทุกครั้งที่รัน `python tools/rotate_handoff.py` · อัปเดต: 2026-09-26

## js/account-deletion.js (235 บรรทัด · 0 รายการ)

## js/adv3d_css.js (1,344 บรรทัด · 0 รายการ)

## js/adv3d_intro.js (86 บรรทัด · 0 รายการ)

## js/adv3d_tex.js (250 บรรทัด · 19 รายการ)
TILE_COLORS:9 · letterTexture:10 · letterTextureDark:27 · emojiTexture:40 · GHOST_IMG_MAX:52 · measureGhostBox:58
probeGhostImages:71 · whenGhostsReady:83 · ghostTexture:87 · ghostScareSrc:92 · AD_STYLES:100 · adBoardTexture:109
addAdBillboard:160 · ringAds:172 · BUILDING_TINTS:182 · FACADE_ROWS:184 · buildingFacadeTexture:185 · makePeerSprite:210
bind:246

## js/adventure3d.js (14,034 บรรทัด · 684 รายการ)
### 🗂️ สารบัญโซน js/adventure3d.js (Read/Edit เฉพาะช่วง)
- 1-217 adventure3d.js — โลก 3D First-person 2 โหมด (คิว 7725691507 ข้อ 8 + ต่อยอด)
- 218-322 ⚽ โหมดสนามฟุตบอล (โหมด soccer · รอบ 196) — เล็ง+ชาร์จพลังเตะบอลใส่ป้ายตัวอักษร
- 323-401 🤖 โหมดหุ่นยนต์นักรบ (โหมด mecha · รอบ 199) — มุมมองในหุ่นสูง 5m เดินยิงเอเลี่ยนตัวอักษร
- 402-547 📻 หอบังคับการบิน (รอบ 64 · รอบ 66 เปลี่ยนเป็นอังกฤษล้วนตามผู้ใช้สั่ง)
- 548-586 คำศัพท์ — ตามระดับชั้น + ไม่ซ้ำคำที่ประกอบแล้ว (8.1/8.6) · แยกคลังต่อโหมด
- 587-722 Texture ตัวอักษร / emoji / ป้ายชื่อผู้เล่น (canvas → sprite)
- 723-1047 🧸 รอบ 1200: ตัวละครผู้เล่น Soft Cuboid Chibi 3D (Drive / Haunted Hotel / Soccer)
- 1048-1355 🚙 รอบ 393: รถเพื่อนในโลกขับรถ = โมเดลจริง img/models/car_01.glb (ผู้ใช้สั่ง)
- 1356-1508 สร้างฉาก static ครั้งเดียวต่อโหมด
- 1509-1854 🚗 เมืองกำแพงเพชรจริง (โหมด drive) — ข้อมูล OpenStreetMap ใน js/data/city_kpp.js
- 1855-1921 🧭🕳️ รอบ 782 — ปิดช่องขาดของกริดถนน (ผู้ใช้: "GPS พาไปช่วงที่ถนนขาดตอน / ขับต่อไม่ได้")
- 1922-2128 🌉 รอบ 788 — ปูถนนเชื่อม "เกาะถนนโดดเดี่ยว" เข้าโครงข่ายหลัก
- 2129-2186 🌳🚁 รอบ 811: จุด "พื้นที่สีเขียวข้างถนน" (greenPts) — สุ่มออกจากจุดบนถนนแต่ละจุด
- 2187-2238 🚁🌳 รอบ 816 — บินเฮลิคอปเตอร์เหนือ "เมืองกำแพงเพชร" แล้วลงจอดเก็บตัวอักษรบนพื้นที่สีเขียว
- 2239-2283 🌅 ท้องฟ้าภาพจริง (รอบ 203) — ใส่ภาพ panorama 360° (equirectangular 2:1) เป็นฉากหลังท้องฟ้า
- 2284-2321 🧱 เทกซ์เจอร์ภาพจริง (รอบ 323) — วางไฟล์ `img/tex/<key>.jpg` (หรือ .png) แล้วแปะทับพื้นผิวทันที
- 2322-2490 🌌 ท้องฟ้ากลางคืนโรงแรมผีสิง (รอบ 694) — ผู้ใช้: "ข้างนอกโรงแรมยังไม่น่ากลัวพอ"
- 2491-2914 🤖 รอบ 1519: ฟ้ากลางวัน+เมฆ+ขุนเขาไกล (mecha) — โดมไล่สีอุ่นแบบภาพอ้างอิง ไม่ใช้ panorama
- 2915-2953 🏨 โรงแรมผีสิง (รอบ 684) — ตัวตึก 5 ชั้นสร้างใน js/hotel3d.js
- 2954-3052 ตัวอักษรในโลก (8.2)
- 3053-3203 🔤🎯 รอบ 1354 — โรงแรม 5 คำ + ภารกิจพิเศษเดี่ยว
- 3204-3246 🌳🪙 รอบ 811: ความหนาแน่นเสริมเฉพาะโหมดขับรถ — ผู้ใช้: "เพิ่มตัวอักษรและเหรียญบนถนนและ
- 3247-3370 🔠🪙 เก็บตัวอักษร 1 ตัว = ได้ 1 เหรียญ (รอบ 345)
- 3371-3437 ประกอบคำอัตโนมัติเมื่อมีตัวอักษรครบ (8.1/8.4)
- 3438-3532 โหมด adv: monsters ยิงสู้ได้ (สเปกเดิม 8.5)
- 3533-3665 👻 รอบใหม่ — PNG-only ghost chase + client-side shader cosmetics
- 3666-3690 🏨 ระบบโรงแรมผีสิง — ห้องไม่ซ้ำ 5→ดับ, 10→ติด, 13→ดับอีกครั้ง
- 3691-3788 🏨 HAUNTED HOTEL CANONICAL RUNTIME BOUNDARY — Phase 2 รอบ 1084
- 3789-4246 🔤🧭 รอบ 1086 — HAUNTED HOTEL PHASE 4
- 4247-4480 เสียงหลอนโหมดผีสิง — สังเคราะห์ Web Audio (ปลอดลิขสิทธิ์ 100%)
- 4481-4632 🔊 รอบ 1071 — เสียงโรงแรมจากไฟล์จริง + ฝีเท้าแยกทุกตัวละคร
- 4633-4987 Multiplayer — ผู้เล่นอื่นใน map เดียวกัน (สไตล์ Roblox)
- 4988-5202 Voice chat ใน map — WebRTC P2P mesh (เสียงวิ่งตรงระหว่างเครื่อง)
- 5203-5283 🏁 พิธีประกาศแชมป์ (ครูกด "จบรอบแข่ง") — /class/<map>/podium
- 5284-5510 HUD
- 5511-6189 DOM overlay + CSS (สร้างครั้งเดียว — self-contained ไม่แตะ style.css)
- 6190-6325 Input — เมาส์+คีย์บอร์ด และจอสัมผัส (มือถือ landscape)
- 6326-6330 🚁 โหมดเฮลิคอปเตอร์ Bell — ฟิสิกส์บินแบบอาร์เคด (สไตล์ Helicopter Flight Pilot)
- 6331-6723 🛸 โดรน FPV (โหมด drone) — บินเร็ว/คล่อง ลอดหน้าต่างเข้าตึกร้าง เก็บตัวอักษรในห้อง
- 6724-6846 🚗 โหมดขับรถเมืองกำแพงเพชร — ฟิสิกส์รถอาร์เคด (bicycle model)
- 6847-6940 🚦 รอบ 133: ไฟจราจรจริงที่ทางแยกใหญ่ + ฝ่าไฟแดงโดนใบสั่ง ม.22
- 6941-7388 🧭 GPS นำทาง (โหมด drive) — เลือกตัวอักษรเป้าหมาย + เส้นทางตามถนนจริง (A*) · นำทางด้วยภาพล้วน (ไม่มีเสียงพูด ตั
- 7389-7447 🎛️ เข็มหน้าปัดวิ่งจริง (สปีด 0-180 + วัดรอบ 0-8×1000) — วาดทับวงเกจของภาพ dash.png
- 7448-7532 🎵 รอบ 181: วิทยุในรถ — จอ head-unit กลางคอนโซล (visualizer + เลือกเพลง 3 โหมด)
- 7533-7576 🪞📷 รอบ 810: กระจกมองหลัง/ข้าง — เรนเดอร์ฉากเดิมซ้ำด้วยกล้องหันหลัง/เฉียงข้าง แล้วยัดลงกรอบบนจอ (scissor)
- 7577-7660 🪞🧑‍🤝‍🧑 รอบ 973: เพื่อนที่ขับตามมา "เห็นในกระจกมองหลัง" + ป้ายชื่อลอยเหนือรถเขา
- 7661-7788 🪆 รอบ 191: ตุ๊กตาดุ๊กดิ๊กหน้ารถ — รูปตัวละครที่ผู้เล่นเลือก (blkN.png)
- 7789-8092 🚔 รอบ 128: แผงเตรียมออกรถ + กฎหมายจราจร + ใบสั่ง
- 8093-8135 🛩️📦 ภารกิจไปรษณีย์กลางคืน (รอบ 353) — เฉพาะช่วงฟ้ามืด (heliNight>.5)
- 8136-9350 🚶🛗🚁🪂 โหมดเดินเท้าในเมืองเฮลิฯ (รอบ 354 — ผู้ใช้สั่ง)
- 9351-9424 🎛️ หน้าปัดเข็มขยับจริง (รอบ 61) — วาดสดทุกเฟรมจากค่าการบินจริง
- 9425-9696 🌧️☀️ ชั้นบนกระจก: ที่ปัดน้ำฝน + แสงแดดสาด (รอบ 346)
- 9697-10101 🔊🌧️ เสียงที่ปัดน้ำฝน (รอบ 537) — สังเคราะห์ล้วน ไม่มีไฟล์เสียง
- 10102-10171 📹 กล้องใต้ท้องเครื่อง (belly cam) — รอบ 348
- 10172-10243 🎯 วงเป้าลงจอด (รอบ 349) — ไฮไลต์ดาดฟ้าที่มีตัวอักษร ให้รู้ว่าควรร่อนลงตรงไหน
- 10244-10859 📏 แถบเตือนความเร็วดิ่ง (รอบ 349) — ลงเร็วเกินกรอบกล้องกะพริบแดง สอนให้ร่อนลงนุ่มๆ
- 10860-10862 Loop หลัก
- 10863-12578 ⚽ โหมดสนามฟุตบอล — ฟิสิกส์บอล + เล็ง + ชาร์จพลัง + กล้อง 1st/3rd + ชุดนักเตะ
- 12579-13356 🤖 โหมดหุ่นยนต์นักรบ — เดินยิงเอเลี่ยนตัวอักษร (ต้องยิงเรียงลำดับในคำ)
- 13357-13381 เข้า/ออกโลก
- 13382-14034 ❓ การ์ด "วิธีเล่น" ตอนเข้าโลกครั้งแรก (จำแยกต่อโลกใน localStorage — ไม่แตะ state.js)
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
MECHA_ATK_RANGE:330 · ALIEN_SHOT_SPD:331 · POWERUP_GAP:332 · BOSS_SCALE:333 · COMBO_X2:334 · MECHA_G:336
BOSS_SPECIES:339 · pickBossSpecies:347 · WAVE_BASE_GOAL:349 · waveCfg:350 · MECHA_WEAPONS:359 · syncMechaMoveBtns:373
syncMechaFireBtns:382 · ATC_REPLIES:410 · ATC_CLOSERS:415 · ATC:420 · orderedLetterMode:530 · netUp:541
CHAT_MAX:544 · doneList:551 · wordPool:552 · pickWords:565 · hotelCreateWordSet:571 · adRenterActive:594
FACADE_ROWS:601 · adsFetch:607 · adsWatch:619 · adsStop:626 · adsChanged:627 · adRentBuy:638
heliMusicTick:661 · AD_FLYBY_COIN:665 · adFlybyTick:667 · adShopOpen:686 · adShopRender:700 · BLOCK_AVATARS:730
blkGeo:742 · blkMat:743 · blkCyl:744 · softCuboidGeo:747 · blkFaceMat:764 · softFaceAtlasGeo:780
softFaceAtlasMat:796 · makeLegacyAdventureFigure:806 · makeSoftCuboidChibiFigure:848 · makeBlockFigure:891 · makeBlockCar:893 · blkNameSprite:939
makeBlockPeer:955 · makeWalkPeerWithFigure:976 · makeLegacyAdventureWalkPeer:986 · makeSoftChibiWalkPeer:990 · disposeBlockPeer:993 · mechGlowMat:1001
makeMechaFigure:1002 · makeMechaPeer:1032 · CAR_GLB_URL:1055 · CAR_GLB_LEN:1056 · carSplitWheel:1060 · carGlbEnsure:1087
carMatGet:1106 · carGlbBuild:1122 · carAvCode:1171 · driveCamToggle:1178 · SKID_N:1197 · skidGeomGet:1199
skidDrop:1204 · skidTick:1218 · blkBuildThumbs:1228 · blkBuildPicker:1247 · pickBlockAvatar:1292 · bubbleSprite:1315
showPeerBubble:1342 · removePeerBubble:1350 · concreteTexture:1360 · brokenWindowTexture:1377 · intactGlassTexture:1393 · chargeIconTexture:1411
rustyDoorTexture:1420 · dAddBox:1434 · buildAbandoned:1441 · makeNameSprite:1514 · flatGeom:1527 · flatGeomUV:1536
buildDriveCity:1546 · HELI_BODY_R:2199 · HELI_KPP_CEIL:2200 · heliKppBlocked:2202 · heliKppSpawn:2223 · SKY_IMG:2246
SKY_EXT:2247 · seamlessSkyCanvas:2253 · applySky:2273 · applyTex:2291 · HSKY_R:2336 · hskyTex:2338
buildHauntSky:2343 · tickHauntSky:2473 · MSKY_R:2494 · buildMechaSky:2495 · buildMechaScenery:2533 · buildScene:2584
randPos:2957 · randRoadPos:2965 · randGreenPos:2983 · HOTEL_PER_ROOM:3005 · HOTEL_MIN_GAP:3006 · hotelSpot:3007
hotelPruneLetters:3043 · HOTEL_QUEST_WORDS:3058 · HOTEL_FLOOR:3059 · HOTEL_SEARCH_FLOORS:3060 · hotelQuestReset:3063 · hotelClearQuestLetters:3068
hotelQuestWordLetters:3072 · hotelStartQuestWord:3076 · hotelFillMissingLetters:3083 · hotelFinalHint:3108 · hotelRevealFinal:3115 · spawnLetter:3122
spawnLettersForWord:3180 · ensureCoverage:3182 · DRIVE_LETTER_COPIES:3210 · DRIVE_BONUS_COINS:3211 · ensureDriveAmbience:3212 · removeLetter:3225
spawnLetterAt:3233 · tickLetterRespawns:3241 · LETTER_COIN:3252 · BONUS_COIN_VAL:3253 · pickUpLetter:3254 · hotelApplyCanonicalOrdinal:3315
letterPop:3335 · letterChime:3354 · tryCompleteWords:3374 · rewardCompletedWord:3389 · completeWord:3404 · spawnMonster:3441
killMonster:3450 · tickMonsters:3458 · damagePlayer:3480 · shoot:3496 · tickShots:3510 · GHOST_IMAGE_URL:3538
makeGhostSprite:3540 · hotelGhostPlayers:3543 · hotelTurnScare:3553 · spawnGhost:3568 · tickGhosts:3589 · sessionRecapHtml:3605
renderHearts:3612 · hotelGhostAttack:3616 · hotelGameOver:3631 · hotelScare:3647 · knockedOut:3659 · DARK_LETTER:3688
tintSprite:3689 · HOTEL_LIGHT_NORMAL:3697 · hotelGlobalLightLevel:3699 · hotelApplyCanonicalMask:3705 · hotelApplyCanonicalPhase:3712 · hotelApplyCanonicalState:3735
hotelCurrentSearchObjective:3793 · hotelSearchContext:3807 · hotelApplyObjectiveProximity:3811 · hotelProximityCue:3819 · hotelShowCriticalHint:3824 · hotelHideCriticalHint:3836
hotelImportantHint:3841 · hotelDirectorContext:3846 · hotelDirectorLightPulse:3857 · hotelDirectorPortraitShift:3873 · hotelDirectorScare:3882 · hotelRuntimeInit:3898
hotelReset:3940 · setTorch:3966 · toggleTorch:3982 · tickTorch:3987 · disposeHotelTorch:3995 · hotelBlackout:4007
hotelApplyLightingState:4010 · hotelLightsOn:4040 · hotelStartFlicker:4044 · tickHotelPlayer:4052 · tickHotelWorld:4130 · hotelAct:4179
openWardrobe:4196 · announceTarget:4225 · HAUNT_SOLO_WIN_CHAT:4231 · hotelAnnounceCycleComplete:4232 · hotelBroadcastSoloWin:4237 · hotelFinishRound:4243
netReady:4638 · netJoin:4644 · sendPos:4665 · netHonk:4715 · sendChat:4721 · toggleChatBox:4735
onPeerData:4746 · disposeHeliMesh:4841 · removePeer:4846 · netLeave:4862 · tickPeers:4868 · RTC_CFG:4996
tinvLinked:4997 · partyWord:5004 · syncPartyWord:5020 · updateVoiceBtns:5184 · PODIUM_BONUS:5209 · podiumJoin:5211
podiumLeave:5222 · endRound:5223 · showPodium:5234 · tinvCheck:5275 · showBanner:5288 · renderHudTop:5294
renderHotelSpecialMission:5305 · renderHudWords:5316 · renderHudInv:5326 · ddTierFromName:5333 · renderBoard:5335 · drawBigMap:5375
openBigMap:5430 · closeBigMap:5438 · drawMinimap:5443 · loadCarDash:5516 · loadCarWheel:5528 · buildDom:5538
confirmExit:6174 · IS_TOUCH:6193 · HAS_KBD:6195 · bindInput:6196 · movePlayer:6291 · tickPlayer:6301
collideDrone:6334 · propStall:6353 · propBreak:6360 · propFix:6367 · droneBatAdd:6374 · lightningBolt:6377
startRain:6388 · stopRain:6402 · smashGlass:6404 · awardGlass:6415 · neededLetter:6432 · openDoor:6447
raceStartRun:6467 · raceStop:6474 · gateHighlight:6492 · renderRaceHud:6499 · tickDrone:6508 · nearMissTick:6651
showNearMiss:6675 · awardDaredevil:6686 · comboCheer:6703 · comboFlash:6719 · driveCell:6728 · nearestStreet:6734
collideCar:6744 · tlDotY:6775 · tlSet:6779 · driveArms:6796 · tlTick:6808 · TL_GREEN:6852
tlRedDur:6854 · tlightPhase:6855 · buildTrafficLights:6862 · rlTick:6914 · cellDrivable:6946 · cellWeight:6949
cellBlocked:6954 · cellCenter:6955 · posReachable:6957 · losClear:6968 · nearestDrivableCell:6979 · routeGrid:6991
pickGpsTarget:7044 · NAVLINE_W:7067 · NAVLINE_SKIP:7068 · navLineEnsure:7069 · navLineHide:7079 · navLineUpdate:7080
tickGps:7116 · tickDrive:7187 · drawCarDial:7395 · drawCarGauges:7425 · RADIO_RECT:7453 · CAR_RADIO_RECT:7455
carRadioRect:7461 · radioLayout:7463 · radioSetHint:7486 · renderRadioList:7492 · radioToggleList:7502 · drawRadioViz:7507
radioTick:7525 · MIRROR_REAR:7539 · mirrorRearRect:7542 · mirrorPass:7544 · toggleMirrorMini:7557 · drawCarMirrors:7564
MTAG_MAX_D:7586 · mirrorTagsHide:7590 · mirrorTagName:7591 · mirrorTagsTick:7592 · BOBBLE_FOOT:7666 · BOBBLE_H:7667
BOBBLE_ASPECT:7668 · BOB_OMEGA:7671 · BOB_PITCH_FORCE:7673 · BOBBLE_SKINS:7675 · bobbleSetAvatar:7682 · bobbleLayout:7689
bobbleTick:7702 · bobblePoke:7727 · bobbleApplySkin:7744 · dollOwned:7754 · openDollPicker:7755 · carStartShow:7792
showLawInfo:7810 · lawNotice:7832 · driveFineSettle:7842 · HELI_PHASES:8021 · heliStartPhase:8028 · heliFloorAt:8035
SOFT_TIERS:8045 · softLandBonus:8047 · awardPerfLand:8060 · setHeliLight:8079 · MAIL_COIN:8098 · mailStart:8100
mailStop:8123 · mailTick:8124 · FOOT_EYE:8143 · doorSlideSfx:8149 · doorLerp:8172 · entLerp:8180
footStepSfx:8190 · WRING_COIN:8211 · festivalPaint:8215 · dustTexture:8227 · dustBurst:8236 · dustTick:8250
HELI_GLB_URL:8271 · HELI_GLB_TEX_BLUE:8273 · HELI_GLB_ROTOR:8275 · HELI_GLB_TROTOR:8276 · heliGlbEnsure:8278 · heliMatBlueGet:8296
heliGlbAssemble:8309 · heliNavTick:8348 · peerRotorStop:8355 · peerRotorTick:8361 · heliCrashSfx:8380 · heliMeshBuild:8408
heliMeshBuildLegacy:8419 · buildHeliFoot:8549 · footFloorAt:8665 · insideTerm:8672 · inDoorZone:8673 · footHint:8677
setFootBtns:8678 · liftStart:8683 · beginRide:8694 · endRide:8717 · beginWing:8728 · awardAirLetter:8741
paxChoiceShow:8760 · paxChoiceHide:8786 · pilotShipMesh:8790 · beginPilot:8791 · endPilot:8823 · drawCabinWindow:8847
tickHeliFoot:8871 · heliWallPenalty:9082 · tickHeli:9094 · CP_NAT:9359 · CP_GAUGES:9360 · SEAT_LABEL:9373
SEAT_P_FULL:9374 · SEAT_ZOOM:9375 · DASH_OFF_Y:9376 · DASH_DROP:9377 · setSeat:9379 · layoutCockpit:9391
WIPER:9430 · WIPER_SPD:9433 · WIPER_LABEL:9434 · INT_GAP:9435 · WASH_MS:9439 · WASH_TANK_MAX:9443
SMEAR_LIFE:9455 · CHOP_MIN:9456 · SUN_RAY_FAR:9460 · sunRayBlocked:9462 · sunShadeTick:9481 · applyCockpitShade:9492
rotorChop:9504 · sunUpdate:9512 · HELI_FOG_N0:9523 · fogUpdate:9527 · adGlowPulse:9575 · RAIN_MAX:9584
VISOR_Y:9585 · RAIN_MIN:9586 · RAIN_DUR:9587 · DROP_ZONE:9591 · addDrop:9592 · tickDrops:9600
addWashDrop:9618 · washStart:9625 · renderWashGauge:9645 · washTick:9656 · grimeTick:9673 · WIPE_R:9680
wipeDrops:9681 · wiperSndOn:9704 · wiperSndOff:9716 · wiperThunk:9722 · washSpraySfx:9734 · wiperSqueak:9751
wiperSndTick:9768 · setWiper:9788 · tickWiper:9800 · SH_SWEEP:9831 · shadowSweepTick:9833 · REFL_MAX:9845
REFL_COL:9847 · cityGlowLevel:9848 · drawCityGlow:9853 · setVisor:9885 · rainTick:9891 · drawBlade:9908
drawSmears:9927 · drawGlass:9947 · drawBellyCam:10109 · drawBellyHud:10132 · drawLandingTargets:10178 · VS_HARD:10248
drawDescentBar:10249 · heliShake:10298 · cpNeedle:10309 · drawGauges:10326 · XF_START:10374 · PRELOAD_WAIT:10375
ALT_QUIET_FROM:10377 · ALT_MAX_DAMP:10378 · ALT_LP_MIN:10379 · ECHO_NEAR:10380 · WIND_FULL_SPD:10381 · SHUTDOWN_SEC:10382
PAN_MAX:10384 · OD_RPM:10385 · SHAKE_RPM:10386 · SHAKE_HIT:10387 · soccerLetterPos:10867 · letterNeeded:10875
soccerNeededSet:10884 · soccerTileGeo:10892 · soccerGoldTexture:10894 · makeSoccerTile:10911 · soccerRefreshSkins:10920 · soccerBuildTargets:10927
soccerNextTile:10937 · soccerRetarget:10953 · soccerCoinPop:10965 · soccerGrassTexture:10978 · soccerTurfGrade:11000 · soccerTurfTexture:11051
grassNormalTexture:11070 · soccerLinesTexture:11099 · soccerNetTexture:11150 · soccerCrowdTexture:11158 · soccerBallMat:11177 · buildSoccerGoal:11197
soccerFloodTexture:11216 · soccerScoreboardTexture:11226 · buildStands:11235 · soccerLedBoards:11288 · soccerMusicCanPlay:11310 · soccerMusicSyncButton:11313
soccerMusicEnsure:11322 · soccerMusicCancelFade:11327 · soccerMusicStart:11330 · soccerMusicStop:11338 · soccerMusicSessionStart:11346 · soccerMusicToggle:11349
soccerMusicVisibilityChange:11354 · soccerGKEnsure:11433 · soccerGKTick:11449 · fkBuildWall:11478 · fkToggle:11493 · fkHitTest:11509
pkHud:11528 · pkStart:11537 · pkEnd:11551 · pkTick:11566 · repQualify:11573 · repEnsureEl:11576
repStart:11587 · repTick:11594 · soccerNumTex:11619 · ssSec:11631 · ssPaintPattern:11636 · soccerShirtTex:11649
makeSoccerPlayer:11671 · soccerNewSpot:11708 · soccerResetBall:11720 · soccerKick:11727 · soccerCheer:11745 · guideTexture:11748
auraActive:11772 · auraLeftMs:11773 · auraFlameTex:11781 · auraCoilTex:11805 · auraCoilRibbon:11829 · auraGlintTex:11853
buildAura:11864 · auraBuy:11907 · auraRender:11917 · auraTick:11931 · buildDrill:11982 · drillTick:11995
ballFXTex:12035 · buildBallFX:12046 · smokePuff:12062 · ballFXTick:12070 · buildLandRing:12116 · buildGuideRibbon:12126
renderSpinPad:12151 · spinPadToggle:12163 · spinPadPick:12169 · renderCurl:12181 · kickLaunch:12192 · updateSoccerGuide:12201
soccerCamera:12265 · tickSoccer:12289 · ssShirtPath:12483 · ssShortsPath:12491 · ssPaintSwatchShirt:12496 · ssPaintSwatchShorts:12501
ssPreviewDraw:12508 · soccerKitShow:12537 · soccerKitGo:12566 · emojiSprite:12810 · makeAlien:12815 · startWave:12866
waveSpawnFill:12877 · waveComplete:12886 · updateWaveHud:12896 · checkMechaBossBadge:12898 · alienSpawnPos:12907 · removeAlien:12912
mechaBankCoins:12917 · mechaHudWord:12927 · setMechaHudSkin:12935 · mechaComboPop:12948 · mechaShielded:12953 · mechaDamageFx:12955
mechaHitByAlien:12960 · spawnAlienShot:12966 · removeAlienShot:12976 · tickAlienShots:12981 · spawnPowerup:12993 · removePowerup:13006
collectPowerup:13011 · tickPowerups:13018 · updateMechaHud:13027 · mechaTracer:13067 · mechaMuzzlePoint:13075 · spawnMechaShell:13085
mechaKillShell:13093 · mechaApplyLetterHit:13102 · mechaSmokeTex:13123 · spawnMechaSmoke:13134 · tickMechaSmoke:13143 · clearMechaSmoke:13152
tickMechaShells:13156 · mechaFire:13188 · explodeAlien:13202 · tickMecha:13234 · loop:13302 · grabShot:13337
savePhoto:13348 · clearEntities:13360 · INTRO_KEY:13386 · introSeenObj:13387 · introSeen:13388 · markIntroSeen:13389
INTRO:13390 · INTRO_MODE:13392 · showIntro:13394 · HELI_KPP_BANNER:13420 · HAUNT_ENTRY_NOTICE:13422 · showHauntedEntryNotice:13426
showModeIntro:13434 · closeIntro:13438 · beginPlay:13444 · start:13446 · exitWorld:13683 · mechaRecapLine:13766

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

## js/auth.js (698 บรรทัด · 56 รายการ)
AUTH_PUSH_MS:25 · AUTH_SDK_TIMEOUT_MS:26 · AUTH_CLOUD_SLOW_MS:27 · AUTH_CLOUD_TIMEOUT_MS:28 · SKY_BETA_OPEN:33 · SKY_BETA_EMAILS:34
skyBetaEmail:39 · canAccessSkyBeta:42 · ADMIN_NAME_EMAILS:48 · adminReservedNameKey:53 · isReservedAdminName:58 · canUseReservedAdminName:62
canAccessKartBeta:68 · isAdmin:71 · checkProfileName:74 · TEACHER_EMAILS:83 · isTeacher:84 · syncAdminAccess:88
TESTER_EMAILS:106 · TESTER_COINS:107 · TESTER_PET_GROWTH_FIX_VERSION:108 · isTester:109 · RANK_EXCLUDED_TESTER_NAMES:115 · rankUserExcluded:116
testerBoost:122 · authSetStatus:158 · authLocalSaveSafe:175 · authShowLogin:178 · authGateOffline:182 · authSaveRef:189
authFetchCloud:190 · authWriteCloud:212 · authDeleteCloud:225 · authWriteProfileName:226 · authPushProfile:233 · authApplyProfileName:241
authEnsureProfileName:265 · authAskProfileName:283 · authEditProfileName:297 · authStart:309 · updateOfflinePill:344 · authEnterOffline:349
authLateSync:366 · authIsAppMode:386 · authIsLocalLanPreviewHost:395 · AUTH_REDIRECT_CODES:482 · AUTH_POPUP_CANCEL_CODES:484 · authLoginClick:485
authOnLogin:521 · authSyncOnLogin:551 · authFreshStart:580 · authAskLink:589 · authEnterGame:639 · authPushSaveAwait:662
authPushSave:670 · authLogout:675

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

## js/city3d.js (3,363 บรรทัด · 212 รายการ)
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
- 1008-1375 🇹🇭 O-NET EXAM HALL — ปุ่ม Lobby 3D (รอบ 1183)
- 1376-1520 🎉 เทศกาลตามวันที่จริง — พลุปีใหม่ / สงกรานต์ / ลอยกระทง (รอบ 863)
- 1521-1798 🧑‍🤝‍🧑 ผู้เล่นจริง (อ่านอย่างเดียว) — presence→ยืนตามอาคาร · world→ขับ/บินในเมือง
- 1799-1955 💬 รอบ 866: บับเบิลแชทสดลอยหัวเพื่อนในเมือง
- 1956-2112 🖊️💬 รอบ 868: พิมพ์ตอบแชทได้จากในเมือง (ไม่ต้องกลับล็อบบี้เดิม)
- 2113-2262 💬🔴 รอบ 873: ไอคอน "มีข้อความค้าง ยังไม่ได้อ่าน" ลอยเหนือหัวเพื่อน
- 2263-2280 🚪 รอบ 870: กลับจากล็อบบี้เดิม → โผล่ที่ "หน้าประตูตึกที่เพิ่งเข้า"
- 2281-2515 🚪🔊 รอบ 890: บานประตูตึกเปิด-ปิดจริง + เสียงประตูสังเคราะห์เอง
- 2516-2647 🚗🤖🛸 รอบ 900: ยานพาหนะแล่นออกจากช่องประตูม้วนที่เพิ่งเปิด → จอดรอหน้าประตู
- 2648-2815 🚶 รอบ 866: ตัวเราเดินไปหน้าตึกก่อน แล้วค่อยเข้าหน้านั้น
- 2816-2900 🚪🚶 รอบ 886: กลับจากล็อบบี้เดิม → "เดินออกจากตึกมาหน้าประตู" (walkSelfTo ย้อนทาง)
- 2901-3075 👆 แตะ/คลิก: ตัวละคร→การ์ดโปรไฟล์ · อาคาร→เดินทางไปหน้านั้น · พื้น→ประกายดาว
- 3076-3129 🎵 รอบ 873: เพลงประกอบเมือง (BGM) — ปุ่มเปิด/ปิดมุมขวาล่าง
- 3130-3165 🚀 BOOT
- 3166-3363 🎬 รอบ 880: กลับจากล็อบบี้เดิม → จอเปิดคือ "ภาพเมืองใบที่เพิ่งเดินออกไป"
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
bld:990 · BUILDINGS:991 · BLD_AT:1146 · buildCity:1148 · buildPlaza:1200 · buildGreens:1246
_glowTex:1291 · buildSky:1301 · buildAmbientTraffic:1363 · FESTIVAL:1380 · buildFestival:1392 · buildFireworks:1399
buildSongkranDeco:1441 · buildLoiKrathongDeco:1473 · actBuilding:1544 · loadFirebase:1555 · setCityLoginVisible:1564 · liveStart:1577
lbGet:1595 · watchPresence:1605 · spawnStander:1629 · WORLD_MAPS:1664 · pollWorlds:1671 · spawnVehicle:1722
removeActor:1782 · markPickable:1795 · BUB_MS:1808 · BUB_FRESH:1809 · BUB_MAXCH:1810 · BUB_MAX:1811
BUB_TEX_KEEP:1812 · bubTexture:1818 · bubTexRelease:1830 · bubbleSprite:1835 · bubDraw:1844 · killBubble:1871
showBubble:1884 · flushBubble:1922 · watchFriendChats:1930 · CITY_CHAT_MAX:1969 · CITY_QUICK_REPLIES:1971 · bubSafeText:1974
actorInfo:1980 · chatBoxCanSend:1990 · chatBoxWhy:1994 · chatBoxRefresh:2000 · openChatBox:2037 · closeChatBox:2049
cbNote:2054 · sendCityChatText:2060 · sendCityChat:2090 · cityStopLive:2095 · SAVE_KEY:2124 · saveRead:2127
pairIdOf:2130 · chatSeenTsCity:2132 · chatMarkSeenCity:2138 · unreadTexture:2151 · addUnreadBadge:2169 · removeUnreadBadge:2190
setUnread:2200 · applyUnread:2206 · markReadCity:2208 · unreadCount:2216 · spawnSelf:2222 · DOOR_MEM:2273
rememberDoor:2274 · lastDoorKey:2275 · DOOR_SWING:2297 · DOOR_OPEN_S:2298 · DOOR_SHUT_S:2299 · DOOR_AJAR:2303
AJAR_QUIET_MS:2304 · ROLL_OPEN_S:2309 · ROLL_SHUT_S:2310 · ROLL_LIFT:2311 · ROLL_AJAR:2312 · registerDoor:2315
doorLeadS:2328 · doorSpillTexture:2334 · doorCreakSfx:2345 · doorLatchSfx:2363 · shutterRollSfx:2386 · shutterClunkSfx:2413
doorMoveSfx:2436 · setCityDoor:2443 · openCityDoor:2454 · closeCityDoor:2455 · setDoorRest:2457 · refreshDoorRest:2469
applyDoorPose:2479 · RIDE_GATE:2531 · RIDE_OUT_S:2532 · RIDE_PARK_S:2533 · DOOR_RIDES:2536 · rideLeadS:2546
rideSfx:2551 · ridePose:2576 · launchRide:2593 · releaseRide:2605 · WALK_SPD:2654 · WALK_MIN:2655
WALK_MAX:2656 · DOOR_GAP:2657 · RECEPTION_SPOT:2661 · doorSpotOf:2662 · walkPose:2673 · footCtx:2688
footStepSfx:2693 · footDustTexture:2714 · footDustPuff:2723 · footDustTick:2737 · FOOT_STEP_DIST:2752 · DOOR_OPEN_AT:2753
walkSelfTo:2755 · EXIT_BACK:2827 · EXIT_DUR:2828 · EXIT_STEP:2829 · EXIT_CLEAR:2830 · EXIT_SHUT:2831
stageExitWalk:2834 · walkSelfOut:2846 · onTap:2904 · captureCityShot:2923 · travelTo:2956 · sparkleAt:3004
openProfile:3028 · refreshChip:3067 · setChip:3071 · BGM_KEY:3082 · BGM_DUCK_PICTURE_DICTIONARY:3083 · bgmWant:3085
bgmEnsure:3086 · BGM_DEV:3095 · bgmPlay:3096 · bgmDuckForPictureDictionary:3098 · bgmRefreshBtn:3103 · bgmToggle:3110
bgmSetup:3115 · boot:3133

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

## js/home-v2.js (2,233 บรรทัด · 0 รายการ)

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

## js/mecha-combat-fx.js (286 บรรทัด · 3 รายการ)
STYLES:8 · style:20 · create:21

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

## js/netroom.js (845 บรรทัด · 20 รายการ)
CFG:41 · roomsAllowed:63 · HOT_KEYS:71 · COLD_KEYS:72 · HOT_BACK:73 · splitPayload:77
mergeBack:88 · metUids:100 · AIM_TTL_MS:119 · aimAt:121 · aimGet:125 · aimClear:129
MAPS3D:135 · skyMapAllowed:136 · whereFriends:140 · dbOf:164 · envReady:165 · isDenied:168
create:180 · drawBudget:818

## js/onetpromo.js (259 บรรทัด · 0 รายการ)

## js/online.js (2,306 บรรทัด · 125 รายการ)
### 🗂️ สารบัญโซน js/online.js (Read/Edit เฉพาะช่วง)
- 2-246 ENGINE: ระบบออนไลน์จริงผ่าน Firebase Realtime Database
- 247-342 ระบบเพื่อน (ข้อ 0.3): รหัสเพื่อน + ค้นหา + ส่ง/รับคำขอ
- 343-532 ระบบแชทกับเพื่อน (ข้อ 0.4)
- 533-715 ระบบส่งของขวัญ (ข้อ 0.5)
- 716-929 🏪 ตลาดออนไลน์จริง (item 2 backlog): ซื้อ-ขายสินค้าที่เพื่อน "ผลิตเอง" ข้ามผู้เล่น
- 930-1071 คำเชิญเล่นโลก 3D ด้วยกัน — /tinv/<toUid>/<fromUid> = {map,n,ts}
- 1072-1285 📰 Follow + Feed กิจกรรม (รอบ 155) · 🌍 หน้า Feed ทุกคน + ไลก์/คอมเมนต์ (รอบ 639)
- 1286-1293 🌍 หน้า Feed ทุกคน + ไลก์/คอมเมนต์ (รอบ 639)
- 1294-1436 📰 รอบ 701 — ฟีดล็อบบี้ทีละโพสต์ + รีแอ็กชัน + แจ้งเตือน (ต่อยอดรอบ 639)
- 1437-1669 🔔📥 รอบ 976 — เก็บแจ้งเตือนไลก์/คอมเมนต์ลง DB โซนใหม่ /gnotif/<uid>
- 1670-2306 📞 โทรหาเพื่อน — Voice call / Video call แบบ LINE (รอบ 625 · กลุ่ม 3 คนรอบ 631)
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
feedPrune:1095 · feedPurgeCat:1106 · feedPushAssets:1117 · petDescriptor:1135 · localProfileAssetCounts:1142 · feedPushPets:1162
fetchPlayerPets:1176 · followSet:1192 · followUnset:1203 · feedRebuild:1210 · feedWatchSync:1222 · fetchPlayerFeed:1249
fetchPlayerAssets:1262 · fetchFollowers:1277 · GFEED_READ:1303 · GFEED_KEEP_ME:1304 · gfeedPush:1307 · gfeedPrune:1321
gfeedParse:1334 · gfeedWatchStart:1363 · gfeedWatchStop:1390 · gfeedNotifDiff:1398 · gfeedNotifPush:1433 · GNOTIF_KEEP:1461
GNOTIF_QUIET:1463 · gnotifKeyOf:1466 · gnotifSend:1473 · gnotifAdd:1486 · gnotifRecount:1506 · gnotifMarkSeen:1511
gnotifWatchStart:1522 · gnotifListen:1531 · gnotifWatchStop:1549 · gnotifPrune:1554 · uidDisplayName:1567 · gfeedRebuild:1578
gfeedToggleLike:1595 · gfeedSetReaction:1600 · gfeedToggleCommentLike:1616 · gnotifTellComment:1634 · gfeedAddComment:1646 · CALL_RTC_CFG:1694
CALL_RING_MS:1695 · CALL_MAX_MS:1696 · CALL_MAX_PEERS:1697 · onlineStart:2113 · onlineLoadSDK:2280

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

## js/picdict.js (413 บรรทัด · 0 รายการ)

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

## js/state.js (1,428 บรรทัด · 97 รายการ)
### 🗂️ สารบัญโซน js/state.js (Read/Edit เฉพาะช่วง)
- 2-256 STATE + LocalStorage + กติกากลางของเกม
- 257-313 🗄️🐾 ระบบชั้นอาหาร + เงินช่วยปรับตัว
- 314-813 👍 รอบ 701: รีแอ็กชันฟีด (กดค้างปุ่มถูกใจแล้วเลือกได้เหมือน Facebook)
- 814-869 Daily Quest (item 3 backlog): ภารกิจรายวัน 3 อย่าง สุ่มตามวันที่
- 870-981 มูลค่าทรัพย์สินสุทธิ (net worth) — ฐานของระบบแรงค์
- 982-1031 🚫🍽️ สัตว์ป่วยเพราะหิว = ซื้อของกินไม่ได้ (รอบ 952)
- 1032-1125 เครื่องยนต์บิลรายเดือน (กลาง — ค่าบำรุงบ้านตอนนี้ / ค่าไฟ-น้ำ-เน็ต เสียบเพิ่มได้)
- 1126-1268 🍖 เงินค่าอาหารสัตว์รายเดือน — ทุกวันที่ 1 ของเดือน จ่ายตามจำนวนสัตว์ที่เลี้ยงอยู่
- 1269-1428 โรงงานผลิตสินค้า: จ่ายค่าผลิตด้วย "แต้มคำศัพท์"
### รายการ js/state.js
STORAGE_KEY:6 · QUIZ_PASS_REWARD:11 · CURE_COST:13 · HUNGRY_SICK_MS:14 · MEAL_HOUR:16 · MEAL_FULL:17
SLEEP_FROM_HOUR:18 · SLEEP_SICK_HOUR:19 · WAKE_HOUR:20 · DINNER_COST:21 · TOXIN_FULL:23 · DETOX_COST:24
FOODQUIZ_Q:26 · FOODQUIZ_COIN:27 · FOODQUIZ_BONUS:28 · FOODQUIZ_MAX_PLAYS:29 · SHAPE_JUNK_MEALS:31 · SHAPE_CLEAN_MEALS:32
SHAPE_MISS_MEALS:33 · SHAPE_EXP_BONUS:34 · HEAT_SICK_MS:35 · THIRST_SICK_MS:36 · DEFAULT_STATE:38 · migratePetShoppingState:262
FEED_CATS:306 · FEED_REACTIONS:320 · feedRx:328 · FEED_QUICK_CM:330 · SLOT_MS:342 · currentSlotStart:343
nextSlotStart:349 · mealDayKey:351 · nightKeyOf:353 · isNightNow:361 · newPet:366 · loadState:391
saveState:771 · activePet:781 · petStage:782 · isAdult:787 · abilityOn:788 · hasPetType:789
todayStr:792 · dailyTick:796 · addCoins:799 · QUEST_POOL:819 · QUEST_PER_DAY:828 · questsToday:829
questTick:836 · questEvent:840 · assetValue:876 · netWorth:900 · assetCount:902 · grantRankPromotionRewards:921
refreshRank:951 · heatProtected:969 · rainProtected:973 · petHungry:976 · petCanEat:980 · hungerSickLock:988
hungerSickMsg:996 · petShapeOf:1004 · updatePetShape:1010 · shapeMealDone:1017 · heatPct:1027 · ymStr:1036
billOutstanding:1040 · UTILITIES:1047 · HOME_UTILITIES:1053 · homeDecayed:1055 · billTick:1058 · PET_FOOD_PER_PET:1130
petFoodTick:1131 · myCar:1157 · carLoanDue:1162 · carLoanOverdue:1167 · carLoanPayable:1172 · carLoanPay:1179
compTick:1192 · ONLINE_RATE:1206 · onlineEarnActive:1207 · onlineEarnTick:1211 · onlineEarnFlush:1222 · marketTick:1232
applyMarketSystemBuy:1253 · addCraft:1274 · ORDER_MAX:1293 · ORDER_LIFE_MS:1294 · ORDER_GAP_MIN_MS:1295 · ORDER_GAP_SPAN_MS:1296
ORDER_TIER_WEIGHT:1297 · newOrder:1298 · orderTick:1311 · careTick:1319 · expNeed:1399 · addExp:1404
addRP:1424

## js/thaitime.js (52 บรรทัด · 13 รายการ)
TH_TZ_MIN:22 · TH_DAY_MS:23 · thShift:28 · thMs:30 · thDate:31 · thHour:32
thHourF:33 · thDayKey:34 · thDayStart:35 · thAtHour:39 · thTs:40 · TH_TZ_OPT:45
thLocaleOpt:46

## js/tpaward.js (42 บรรทัด · 0 รายการ)

## js/typing.js (370 บรรทัด · 0 รายการ)

## js/ui.js (10,688 บรรทัด · 476 รายการ)
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
- 2419-2912 การ์ดข้อมูลผู้เล่น 👤 — คลิกชื่อในการ์ดเพื่อน/กระดาน แล้วโชว์
- 2913-3207 แผงเพื่อน 👥 (ข้อ 0.3): รหัสเพื่อน + ค้นหา + คำขอ + รายชื่อเพื่อน
- 3208-3303 🌍 เพื่อนอยู่โลก 3D ไหน + ปุ่ม "ตามเข้าไป" (รอบ 642)
- 3304-3342 แชทกับเพื่อน (ข้อ 0.4) — กล่องแชทลอยกลางจอ + แผง emoji
- 3343-3744 รอบ 179: หน้ารวมข้อความ (inbox แบบ Messenger — ธีมกระจกฟ้า sci-fi ของเกม)
- 3745-4144 ระบบส่งของขวัญ (ข้อ 0.5) — ห้องของขวัญ + กล่องเลือกส่ง + ฉากเปิด
- 4145-4237 RANK CARD + ฉากเลื่อนแรงค์
- 4238-4240 PET DASHBOARD
- 4241-4316 📰 รอบ 155: overlay ข้อมูลน้อง & การดูแล + ฟีดกิจกรรมเพื่อน
- 4317-4938 📰 รอบ 701 — ฟีดล็อบบี้ "ทีละโพสต์" แบบ Facebook (ผู้ใช้สั่ง 29 ก.ค. 2026)
- 4939-5133 🌍 รอบ 639: หน้า Feed เต็มจอ — ทุกคน (ไม่ใช่แค่ follow) + ไลก์/คอมเมนต์
- 5134-5818 📖 Dictionary ค้นหาคำศัพท์ (รอบ 254 ผู้ใช้สั่ง 16 ก.ค. 2026)
- 5819-5862 การนอน (คิว 7725691507 ข้อ 1)
- 5863-5865 ให้อาหาร (ระบบมื้อเย็น 18:00 + ความอิ่มสะสม — ข้อ 2+3)
- 5866-6392 🐾🍽️ แผงให้อาหารสัตว์ทุกตัวในคราวเดียว — รอบ 1345
- 6393-6511 🛡️ ควิซอาหารปลอดภัย (ต่อยอดข้อ 5.1)
- 6512-6625 🎀 ตู้เสื้อผ้าสัตว์เลี้ยง — ใช้สวมเฉพาะของที่ซื้อมาแล้ว
- 6626-6813 ที่พัก (หลบแดด/หลบฝน) + เครื่องปรับอากาศ
- 6814-6931 บิลสาธารณูปโภค (ค่าไฟ/ค่าน้ำ — เครื่องยนต์อยู่ใน state.js: UTILITIES/billTick)
- 6932-7014 การ์ดมือถือ (ข้อ 7): ซื้อ 10,000 ขายคืน 6,000
- 7015-7025 การ์ดคอมพิวเตอร์ (ข้อ 11): ซื้อ 50,000 ขายคืน 30,000
- 7026-7070 item 8: โบนัสออนไลน์ +0.01 เหรียญ/วิ ฟรีทุกคนที่เปิดเกมออนไลน์อยู่
- 7071-7494 💻 รอบ 706 (ผู้ใช้สั่ง 29 ก.ค. 2026): ช่องรายได้คอมพิวเตอร์บนแถบบนล็อบบี้
- 7495-7512 🌀🔤 รอบ 1045 — Vocab Arena (โลกผจญภัยฉบับใหม่)
- 7513-7934 ☁️📚 รอบ 1229 — Vocab Sky Playground
- 7935-8025 🏝️ รอบ 1377 — KART (public entry; separate persistent keys)
- 8026-8047 🌍 ปุ่มลัดเข้าโลก 3D ในรางเมนูซ้าย (ผู้ใช้สั่ง 9 ก.ค. 2026)
- 8048-8113 🔒 รอบ 1070/1132: โลกที่ยังไม่เปิดสาธารณะ — เปิดให้บัญชีทดสอบ 2 ชื่อเท่านั้น
- 8114-8243 ↩️🪙 Legacy recovery — คืนค่าเข้าที่เวอร์ชันเก่าอาจหักค้างไว้ก่อนเปลี่ยนเป็นเข้าฟรี
- 8244-8432 🧭 ป้ายบอกทางของรางเมนูซ้าย (รอบ 601 · ผู้ใช้สั่ง 26 ก.ค. 2026)
- 8433-8602 การ์ดสวนผลไม้ (ข้อ 12): ซื้อต้นไม้ปลูกได้ไม่จำกัด แต่ละต้นออกผล
- 8603-8617 โรงงานผลิตสินค้า 🏭 + ตลาดขายต่อ (แนวคิดใหม่ 5 ก.ค. 2026)
- 8618-8641 โรงงานผลิต (แผง 🏭) — แยกออกจากตลาด (ผู้ใช้สั่ง 6 ก.ค. 2026)
- 8642-8916 ตลาดขายสินค้า (แผง 🏪) — แยกออกจากโรงงาน
- 8917-10043 🚗 รอบ 131: หมวดยานพาหนะ — โชว์รูมรถ 10 คัน (แคตตาล็อก 5 ช่อง/แถว)
- 10044-10106 ร้านสัตว์เลี้ยง (ซื้อเพิ่มได้ ไม่ลบตัวเดิม)
- 10107-10143 เลเวลอัพ (รายตัว)
- 10144-10249 สถิติผลการเรียนรู้
- 10250-10287 item 4: การ์ดสรุปส่งครู — ใบเดียวจบ ชื่อ/วัน-เวลา/เหรียญวันนี้/แรงค์/สอบล่าสุด
- 10288-10688 📞 หน้าจอโทรหาเพื่อน — สายเสียง (รอบ 625 · กลุ่ม 3 คน + ปิดวิดีโอ รอบ 631)
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
lbTypingHtml:2335 · lbBubbleHtml:2367 · lbShootHtml:2389 · bindPlayerClicks:2424 · ensureProfileModernStyles:2434 · bindProfileTabs:2443
profileAssetMeta:2473 · showPlayerCard:2509 · bindProfileBadgeScroll:2824 · petDescImg:2842 · openImgLightbox:2855 · openPetPeek:2875
updateBillBadges:2919 · setBadge:2929 · tinvPendingCount:2945 · attentionPendingItems:2953 · attentionUnseenCount:2973 · attentionAcknowledge:2978
updateSettingsBadge:2993 · attentionSummaryData:3009 · openAttentionSummary:3037 · updateFriendBadge:3071 · renderFriendPanel:3081 · friendDoSearch:3129
refreshFriendData:3153 · FRW_TTL_MS:3218 · FRW_MIN_GAP:3219 · frwWorldOf:3223 · frwPanelOpen:3226 · frwScan:3231
frwPaint:3253 · frwPaintHint:3274 · frwFollow:3288 · CHAT_EMOJI_CATS:3309 · CHAT_THEMES:3331 · CHAT_SECRET_MS:3340
chatBadgeSync:3348 · ibTimeStr:3356 · IB_CALL_RE:3365 · ibCallInfo:3366 · openChatInbox:3371 · chatFitKeyboard:3541
openChat:3557 · versionedAssetPath:3748 · giftImg:3752 · LAZY_ASSET_PIXEL:3761 · lazyAssetHTML:3762 · bindLazyAssets:3765
giftDateStr:3787 · GREETS:3795 · GREET_EXP:3803 · greetInfo:3804 · openGreetPicker:3808 · giftItemPic:3852
foodGiftBlocked:3862 · giftItemName:3868 · updateGiftBadge:3874 · renderGiftPanel:3883 · acceptGift:3942 · declineGift:3965
showGreetReveal:3974 · showGiftReveal:4001 · openGiftPicker:4027 · confirmSendGift:4096 · doSendGift:4122 · rankBadgeHTML:4148
renderRankCard:4153 · renderRankTab:4187 · showRankUp:4215 · bindPetPlateButtons:4250 · openPetInfoOverlay:4283 · feedAgo:4309
FEED_DECK_MAX:4329 · FEED_SLIDE_MS:4330 · FEED_RESUME_MS:4331 · feedPostImgIndex:4336 · feedPostImg:4347 · feedPostByKey:4356
feedCanReact:4359 · fpStatsHTML:4364 · fpNameBadgesHTML:4380 · fpostHTML:4384 · renderFeedCard:4419 · feedDeckGo:4457
feedDeckTick:4477 · renderFeedBell:4499 · FNT_JUMP:4508 · fntGiftName:4514 · feedNotifText:4518 · feedNotifGo:4533
feedNotifArrived:4548 · openFeedNotif:4555 · closeRxPicker:4610 · openRxPicker:4614 · feedFlyWord:4634 · feedPickRx:4645
FCM_REP_SHOW:4660 · FCM_FOCUS_POST:4661 · openFeedComments:4663 · closeFeedComments:4685 · fcmRowHTML:4694 · showCommentLikers:4717
fcmTreeHTML:4739 · renderFeedComments:4764 · bindFeedPostEvents:4892 · openFeedBoard:4945 · renderFeedBoardLive:4966 · renderFeedBoard:4984
stageColLeft:5003 · alignPetTabs:5012 · alignFeedPlate:5024 · alignProfilePlate:5040 · COIN_K_MIN:5058 · alignCoinBlock:5059
alignStageLeft:5087 · laneModeOn:5099 · alignStageCols:5112 · watchStageCols:5126 · dictRecordLookup:5145 · DICT_FILE_COUNT:5156
loadDict:5157 · dictSearch:5172 · dictTapWords:5187 · dictEntryHTML:5191 · openDictOverlay:5202 · renderDashboard:5286
sleepBtnHTML:5824 · sleepHintHTML:5831 · sleepAllPets:5842 · wakeAllPets:5855 · feedPet:5870 · feedFoodsForPet:5876
feedFoodById:5881 · feedFoodCanUse:5882 · feedPetBlockText:5887 · feedPetThumbHTML:5894 · openFoodMenu:5900 · applyFoodToPet:6034
feedWith:6051 · AVATAR_UI:6071 · playerAvatarHTML:6075 · SHAPE_UI:6083 · showFeedResult:6092 · applyCureState:6135
curePet:6149 · cureAllPets:6172 · heartsFx:6200 · PAT_HOLD_MS:6223 · PAT_EXP:6224 · bindPetTap:6225
petBounce:6243 · petMood:6249 · shortPatPet:6256 · longPatPet:6264 · patCalendarHTML:6284 · patDayKey:6318
patStreakNow:6322 · patStreakTick:6327 · cureCelebrateFx:6352 · railCureClick:6363 · detoxPet:6375 · openFoodQuiz:6398
closeDressUpBoard:6516 · dressItemRarity:6520 · dressRarityLabel:6527 · dressSlotLabel:6530 · openDressUpBoard:6533 · renderShop:6566
homeVisualHTML:6629 · showHomeRuined:6643 · showCutNotice:6664 · renderHomeCard:6682 · payMaint:6766 · trashBillUI:6782
payTrash:6799 · UTILITY_UI:6818 · utilityBillUI:6867 · payUtility:6892 · buyUtilityFix:6918 · renderPhoneCard:6936
buyPhone:6976 · sellPhone:6998 · compLiveTotal:7019 · onlineLiveTotal:7030 · syncCoinHeader:7037 · flashPillGain:7042
renderOnlineEarnPill:7051 · renderCompEarnPill:7076 · openPillInfo:7109 · renderComputerCard:7192 · buyComputer:7227 · sellComputer:7250
soldCount:7271 · soldBadge:7272 · loadScriptOnce:7278 · WORDSHIP_LOCK_MSG:7302 · wordShipAdminAllowed:7303 · refreshWordShipLock:7310
loadStylesheetOnce:7320 · openWordShip:7330 · bindWordShipRail:7349 · SKIRMISH_LOCK_MSG:7359 · skirmishAdminAllowed:7360 · refreshSkirmishLock:7367
openWordSkirmish:7377 · bindSkirmishRail:7398 · VOCABFORCE_LOCK_MSG:7408 · vocabForceAdminAllowed:7409 · refreshVocabForceLock:7412 · loadVocabForceModules:7424
openVocabForce:7433 · bindVocabForceRail:7453 · advBusyMsg:7464 · advResetLoad:7476 · loadAdv3d:7482 · loadVocabArena3d:7500
loadSkyPlayground3d:7517 · SKY_BETA_DENIED_MSG:7520 · ensureSkyBetaAccess:7521 · enterSkyPlayground3D:7529 · enterAdventure3D:7545 · pickAdvMap:7578
enterHaunted3D:7613 · enterHeli3D:7636 · pickHeliMap:7663 · enterDrone3D:7699 · confirmPetShoppingEntry:7720 · enterPetShopping3D:7746
enterDrive3D:7798 · pickDriveMap:7837 · enterMotoMapAsCar:7873 · enterSoccer3D:7892 · enterMoto3D:7912 · kartLobbyIconHTML:7938
mechaLobbyIconHTML:7942 · enterKart3D:7947 · enterPickup3D:7962 · enterF1_3D:7977 · enterInvasion3D:8005 · WORLD3D:8033
WORLD3D_COMING_SOON:8052 · world3DComingSoon:8053 · gotoRobotShop:8056 · openHealDialog:8062 · world3DFail:8083 · WORLD_PLAY_TICKETS:8118
grantWorldPlayAccess:8120 · worldEntryStarted:8124 · worldEntryStopped:8125 · GAME_ENTRY_STABLE_MS:8126 · gameEntryCommit:8128 · gameEntryRefund:8136
recoverInterruptedGameEntry:8153 · showGameEntryRefundNotice:8161 · startWorldEntry:8188 · railWorldClick:8214 · openWorldEntryDialog:8238 · railScrollHint:8249
railScrollTop:8257 · initRailScroll:8262 · renderRailWorlds:8282 · tinvOnlineFriends:8370 · refreshTinvOnlineUI:8374 · tinvNoticeHTML:8385
openTinvPicker:8394 · fruitCountdown:8438 · renderFarmCard:8450 · renderFarmClock:8525 · buyFruit:8541 · sellFruit:8561
sellAllFruit:8582 · collectImg:8611 · renderFactoryCard:8622 · renderMarketCard:8646 · updateWishBadge:8704 · openWishlistDialog:8715
bindStripArrows:8762 · renderMarketBrowse:8776 · openMarketBuyDialog:8803 · carImg:8923 · renderVehicleShop:8924 · CS_CYCLE_MS:8976
carInteriorImg:8977 · carStatHtml:8979 · renderCarShowroom:8986 · csShowBig:9013 · csInit:9040 · RS_CYCLE_MS:9063
robotImg:9064 · robotShopImg:9066 · renderRobotShop:9069 · renderPetMarketShop:9089 · rsShowBig:9107 · rsInit:9127
buyRobot:9146 · mechaAdminAllowed:9172 · refreshMechaLock:9173 · enterMecha3D:9182 · pickMechaRobot:9210 · pickDriveCar:9242
openCarBuyDialog:9285 · buyCarInsurance:9346 · payCarLoanMonthly:9365 · payCarLoanFull:9377 · carDriveBlock:9396 · gotoVehicleShop:9401
gotoMyStock:9406 · showNeedCarDialog:9412 · craftDiscount:9424 · renderFactory:9427 · renderOrdersUI:9496 · startProduce:9515
buyCollectible:9543 · cancelProduce:9573 · deliverOrder:9587 · renderOrderClock:9604 · renderCollectMine:9614 · openListDialog:9663
cancelListing:9720 · listingMarketStatus:9744 · maybeOfferStaleMarketBuy:9748 · openStaleMarketOffer:9759 · acceptStaleMarketBuy:9797 · buyMarketItem:9833
showCollectReveal:9898 · buyAC:9936 · openHomeShop:9974 · openPetPurchase:10048 · renderPetShop:10085 · showLevelUp:10110
renderStats:10147 · showTeacherCard:10254 · CALL_REACT_EMOS:10298 · CALL_TALK_MIN:10301 · CALL_TALK_HOLD:10302 · CALL_ORDER_GAP:10304
CALL_TONES:10310 · startCall:10684

## js/util.js (1,644 บรรทัด · 60 รายการ)
### 🗂️ สารบัญโซน js/util.js (Read/Edit เฉพาะช่วง)
- 2-23 UTIL: เสียง / เอฟเฟกต์ / เครื่องมือทั่วไป
- 24-1613 🎖️ รอบ 643: สัญลักษณ์ระดับชั้น (ผู้ใช้สั่ง 28 ก.ค. 2026)
- 1614-1644 🖱️🚫 รอบ 833: กันกล่องดำ "To show your cursor, switch apps, reload the page…"
### รายการ js/util.js
shuffle:6 · fmtNum:15 · escapeHTML:19 · gradeSymbol:32 · gradeMark:47 · nameWithGrade:55
gradeMarkCanvas:61 · gradeOf:77 · seededRand:92 · fmtThaiDT:104 · fmtThaiDate:108 · gameIsPortrait:117
gameCanLockLandscape:122 · gameIsStandalone:125 · lockGameLandscape:130 · IPHONE_LOBBY_VIEWPORT:164 · fitIPhoneLobbyViewport:175 · showScreen:194
TOAST_WARN_RE:211 · TOAST_FINANCIAL_RE:212 · TOAST_FINANCIAL_AMOUNT_RE:214 · financialToastParts:219 · fillFinancialToastMsg:227 · restackToasts:253
clearWarnToasts:279 · toast:283 · toastLink:338 · floatFx:356 · beep:367 · soundStatus:388
PET_MOOD:504 · petVoiceSynth:511 · sirenSynth:588 · playCashier:612 · cashierSynth:626 · keyTapSynth:659
bubblePopSynth:697 · bubbleTapSynth:716 · playSpark:727 · sparkSynth:741 · thunderFx:776 · wordAudioFile:844
speakCutOff:853 · speakWord:857 · speakLetter:896 · pickSpeakVoice:919 · speakWordTTS:930 · askNameDialog:957
askConfirm:1003 · alertBox:1021 · applyNoAnim:1041 · BLK_VOCAB:1048 · enablePublicHomeTheme:1097 · openSettings:1146
openHelp:1462 · openTeacherGuide:1579 · TAPGLOW_SEL:1603 · TOUCH_INPUT_SEEN:1622 · mouseLockOK:1631 · lockMouse3D:1637

## js/vocabbook.js (207 บรรทัด · 14 รายการ)
VB_MAX:11 · VB_QUIZ_N:12 · VB_QUIZ_MIN:13 · vbGroup:16 · VB_GROUP_UI:21 · vbRecord:24
vbSeen:49 · vbStats:62 · vbList:70 · vbReviewCat:81 · vbStartReview:95 · openVocabBook:106
vbRender:148 · vbCardHTML:194

## js/wordsearch.js (524 บรรทัด · 0 รายการ)

## js/wordship.js (1,496 บรรทัด · 0 รายการ)

## js/wordskirmish-br.js (57 บรรทัด · 0 รายการ)

## js/wordskirmish-field.js (31 บรรทัด · 0 รายการ)

## js/wordskirmish.js (1,472 บรรทัด · 0 รายการ)

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

## css/home-dark-surfaces.css (824 บรรทัด · 1 selector)
.theme-noir:7,488,494,500(+28)

## css/home-v2.css (2,731 บรรทัด · 137 selector)
:root:9,2536,2592 · #screen-dashboard:36,46 · #vw-home-v2-root:48,49,59,60(+134) · .vw2-screen-frame:81 · .vw2-sky:82,83,92,99(+1) · .vw2-shell:102,107,646
.vw2-glass:111 · .vw2-top:124,696,843,1032(+2) · .vw2-profile:129,143,147,337(+3) · .vw2-kanok-corner:148 · .vw2-profile-crown:149 · .vw2-profile-kicker:150,151
.vw2-avatar-frame:152,157,343,344(+1) · .vw2-avatar:158,159,2041,2045(+3) · .vw2-avatar-edit:160,2098 · .vw2-profile-main:161,1960 · .vw2-name-row:162,163,1961 · .vw2-pencil:164,165,166
.vw2-profile-meta:167,1896,1962 · .vw2-profile-meta-chip:168,169,170,171(+12) · .vw2-grade-identity:172 · .vw2-grade-copy:173 · .vw2-profile-chips:174,1975 · .vw2-achievement-mark:175,1976
.vw2-rank:176,346,1977 · .vw2-sync-chip:177 · .vw2-wallet:179,700,845 · .vw2-wallet-pill:180,186,187,188(+39) · .vw2-stat-art:190 · .vw2-stat-copy:191
.vw2-top-actions:193,557 · .vw2-tool-btn:194,200,201,364(+11) · .vw2-main-grid:204,647,775,1004 · .vw2-left:207,208,369,581 · .vw2-rail-btn:209,370,1355,1356(+3) · .vw2-rail-art:210,211,212,213(+4)
.vw2-rail-scene:214,215 · .vw2-rail-scene-mark:216,375 · .vw2-rail-label:217,376,776,1399 · .vw2-left-scroll-cue:218,583 · .vw2-feed:221,222,380,381(+26) · .vw2-section-head:223,224,225,390(+5)
.vw2-feed-items:226,944,1078,1932(+1) · .vw2-feed-card:227,391 · .vw2-feed-avatar:228 · .vw2-feed-copy:229 · .vw2-feed-coin:230,959,1084,1093(+2) · .vw2-feature:233,763,876,1328
.vw2-feature-title:234,235,394,395(+12) · .vw2-word-ribbon:236,237,238,396(+8) · .vw2-feature-stage:239,400,401,651(+1) · .vw2-world-scene:240,652,885 · .vw2-stage-depth:241,242,243,402(+2) · .vw2-stage-castle:244,404,653
.vw2-atmosphere:245 · .vw2-speech:246,405,406,407(+5) · .vw2-reward-card:247,408,409,410(+7) · .vw2-pet-halo:248,249,656 · .vw2-pedestal-aura:250,251,413 · .vw2-pet-platform:252,253,254,411(+1)
.vw2-pet:255,414,753,760(+3) · .vw2-pet-sparkles:256 · .vw2-house-preview:257 · .vw2-stage-copy:258,418,1241,1242(+1) · .vw2-feature-actions:259,421,422,886(+5) · .vw2-right:262,553
.vw2-mission:263,382,387,554(+1) · .vw2-quests:264,555,945 · .vw2-quest-row:265,1337 · .vw2-online:266,383,388,586(+2) · .vw2-online-row:267,1258 · .vw2-friends-btn:268,588,593,1263(+1)
.vw2-bottom:271,272,428,507(+14) · .vw2-mode:273,429,430,431(+27) · .vw2-preview-mark:274,657 · .vw2-home-active:277,278,279,283(+10) · .vw2-rail-racing:371,377,582,1397 · .vw2-house-preview-head:415,416,552,1244(+3)
.vw2-stage-foreground:417,655,1108 · .vw2-enter:423 · .vw2-play:424 · .vw2-shop-link:425 · .vw2-bottom-scroll:513,532,533,534(+6) · .vw2-bottom-track:535,545,577,578(+42)
.vw2-online-list:556,587,946,1257 · .vw2-word-kicker:766,909,1330,2163(+1) · .vw2-word-copy:767,768,769,910(+7) · .vw2-word-reward:770,913,2176 · .vw2-feed-market-divider:949,950,951,1095 · .vw2-feed-market-note:952
.vw2-market-feed-card:953,954,955,1249(+3) · .vw2-feed-product:956,957 · .vw2-market-seller:958,1253 · .no-anim:1037 · .vw2-house-backdrop:1246,2050 · .vw2-online-name-line:1259,1260
.vw2-online-badges:1261 · .vw2-online-copy:1262 · .vw2-rail-cure:1266,1267,1268,1269 · .vw2-online-modal-open:1273 · .vw2-online-modal:1274,1275 · .vw2-online-modal-panel:1276,1277
.vw2-online-modal-head:1278,1279,1285 · .vw2-online-modal-emblem:1280,1281 · .vw2-online-modal-heading:1282,1283,1284 · .vw2-online-modal-close:1286,1287,1296 · .vw2-online-modal-list:1288,1289,1290,1291(+3) · .vw2-online-modal-foot:1295
.vw2-qbody:1338 · .vw2-feature-action-scroll:1439,1452,1453,2101 · .vw2-feature-action-track:1454,1464,1472,1486(+5) · .vw2-pet-name-action:1488 · .vw2-owned-pets-action:1489 · .vw2-pet-modal-open:1493
.vw2-pet-modal:1494,1495 · .vw2-pet-modal-panel:1496,1497,1558 · .vw2-pet-modal-head:1498,1499,1502,1503(+3) · .vw2-pet-modal-emblem:1500,1501 · .vw2-pet-modal-close:1506,1507,1522 · .vw2-pet-modal-list:1508,1509
.vw2-owned-pet-card:1510,1511,1512,1519 · .vw2-owned-pet-thumb:1513,1514,1515 · .vw2-owned-pet-copy:1516,1517,1518 · .vw2-pet-modal-empty:1520 · .vw2-pet-modal-foot:1521 · .vw2-pet-modal-healbar:1560
.vw2-heal-all:1561,1562,1563,1568(+3) · .vw2-heal-all-icon:1564 · .vw2-heal-all-copy:1565,1566,1567 · .vw2-adventure-hub:1606,1612,1613,1614(+22) · .vw2-adventure-landmark:1620,1624,1625,1692(+1) · .vw2-adventure-copy:1626,1627,1628,1697(+2)
.vw2-adventure-menu:1632,1633,1643,1644(+15) · .vw2-adventure-menu-panel:1634,1635,1636,1637(+8) · .vw2-adventure-menu-scroll:1640,1641 · .vw2-adventure-menu-track:1642,1713 · .theme-noir:2593,2614,2615,2616(+62)

## css/lettercannon.css (89 บรรทัด · 30 selector)
#lc-game:6,7,13,14(+30) · .lc-hud:8 · .lc-glass:9 · .lc-stats:10 · .lc-stat:11,12 · .lc-coin-stat:15
.lc-wordbox:16 · .lc-target:17 · .lc-meaning:18 · .lc-progress:19 · .lc-slot:20,21 · .lc-actions:23
.lc-iconbtn:24,25 · .lc-exitwide:26 · .lc-power:27 · .lc-power-name:28 · .lc-hint:29 · .lc-move:30,31
.lc-modal:32,33 · .lc-count-exit:34 · .lc-card:35,36 · .lc-result-card:37,40 · .lc-result-grid:38,39 · .lc-btn:42
.lc-count:43 · .lc-toast:45 · .lc-coinfx:47 · .lc-coin-flight:48 · .lc-announce:51 · .lc-rotate:52

## css/lobby.css (6,380 บรรทัด · 854 selector)
:root:6,6003 · html:15,6017 · body:21,5967,6009,6029 · *:41,42,43,44 · #app:47 · h1:49
.subtitle:50 · .shop-title:51 · .screen:57 · #screen-select:66,67,68,69(+5) · .egg-need:76 · .petshop-topright:78
.petshop-play-link:79,84 · #screen-login:97,110,111,115(+12) · .login-lux:128 · .login-logo:129 · .login-tag:134 · #screen-game:206,207,208,209(+7)
#screen-quiz:220,221,222,223(+6) · #quiz-choices:232,233 · .word-card:240 · .quiz-choice:241,242,243 · .big-btn:246,247,248,249 · #screen-dashboard:254,1181,1189
.lobby-top:268,903,904,905(+36) · .top-flex:269 · .profile-plate:270,274,824,4231(+12) · #rain-fx:279 · .rain-glass:283 · .glass-drop:284
.rain-vignette:303 · .no-anim:310,472,485,546(+64) · .rail-btn:313,925,931,933(+33) · .rail-badge:314 · .fr-code-box:319 · .fr-code-label:323
.fr-code-row:324 · .fr-code:325 · .fr-copy-btn:330,334,339,340 · .fr-search-btn:335 · .fr-add-btn:336 · .fr-accept:337
.fr-decline:338 · #fr-search-input:341 · #fr-search-result:345 · .fr-found:346 · .fr-hint:350 · .fr-list-title:351
.fr-row:352 · .fr-req:356 · .fr-row-name:358,362,5707 · .fr-row-status:366 · .fr-req-btns:367 · .online-dot:368
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
.call-emo:676,677 · .call-fx:679 · .call-fx-emo:680 · .pl-click:772,774,775 · .pl-overlay:776 · .pl-card:780,2965
.pl-close:786 · .pl-head:790,2722,2725 · .pl-grade:795,5713,5714 · .pl-body:796 · .pl-loading:797 · .pl-none:798
.pl-me-tag:799 · .pl-blk-wrap:801 · .pl-blk:802 · .pl-stat:803 · .pl-lbl:808 · .pl-val:809,810
.pl-tip:811 · .chip-edit:817,822,823 · .rank-mini:829,835,836,837 · .pass-photo:839,844 · .pet-tabs:846 · .dict-box:847,851,852,853(+1)
.dict-card:859,864,868,869(+2) · .dict-head:865,866 · .dict-trail:873,877 · .dt-c:878,882,883 · .dt-sep:884 · .dict-today:885
.di-w:887,888,889 · .dict-list:890 · .dict-item:891,895,896,897(+5) · .lobby-mid:911 · .rail-wrap:914,964,975,976 · .rail-scroll:916,958,962,963
.lobby-rail:917,924 · .rail-nudge:965,973,974,977(+1) · .rail-worlds:984 · .rail-div:985 · .lobby-stage:1041,1043,1059,1186(+13) · .newword-banner:1049,1056,1061,5061(+2)
.coin-fly:1072,1075 · .coin-plus:1081 · .nw-pop-coin:1096,1098,1099 · .nw-pop-goal:1102,1103,1107,1111 · .nw-goal-head:1104,1106,1108 · .nw-goal-bar:1109
.nw-goal-fill:1110 · .nw-pop-book:1112,1113 · .nw-tag:1134,5067,5089 · .nw-word:1139,5071,5094,5187 · .nw-hint:1141,1142,5072,5096(+1) · .nw-coin:1144,1147,5073,5077
.nw-countdown:1152,5078 · .nw-bar:1154,5097 · .nw-bar-fill:1156 · .pet-stage:1159,3259 · .nw-box:1166,3268 · .nw-pop-word:1167
.nw-speak:1168 · .nw-pop-phon:1169 · .nw-ipa:1170 · .nw-pop-sent:1171 · .nw-pop-mean:1172 · .pet-tab:1173,1174,1175,3841
.stage-hero:1196,1211,1219,1364(+29) · .hero-ground:1233,1353,1359 · .hero-rank-bg:1235,1238,1241,1245(+18) · #lobby3d-canvas:1258,1259 · .hero-scene:1263,1265,1272,1273(+8) · .caretaker-fig:1312
.caretaker-img:1315 · .caretaker-emoji:1317 · .blk-rig:1324,1325,1326 · .stage-plate:1386,1394,1405,1406(+23) · .plate-title:1400 · .lobby-side:1433,1469,1474,1477(+22)
.side-sec:1436,2345,3736,4207 · .side-label:1437,1442 · .side-label-row:1445,1446 · .lb-tabs-out:1447,1448,1452 · .side-glass:1456,1463 · .side-card:1475,1586
#quest-card:1487,1488,1516,1517(+6) · .q-bigcard:1493,1522 · .qb-top:1495 · .qb-emoji:1496 · .qb-name:1498 · .qb-bar:1499,1500
.qb-row:1502 · .qb-prog:1503 · .qb-reward:1504 · .qb-go:1505,1509 · .q-dots:1510 · .q-dot:1511,1512,1513
.q-bonus:1514 · .inv-card:1533,1535,1536 · .inv-btns:1537 · .inv-go:1538,1540 · .inv-x:1541 · #online-card:1545,3744,3745,3746(+7)
.fq-overlay:1546 · .fq-box:1548,3549 · .fq-head:1552,1554 · .fq-close:1555 · .fq-sec:1557 · .fq-worlds:1558
.fq-world:1559,1561 · .fq-acts:1562 · .fq-act:1563,1566,1567 · .lb-prize:1600 · .lb-coins:1603 · .lbf-cell:1604,2804,2807,2808(+3)
.lb-award-bar:1606,1612,1613 · .lb-award-go:1614 · .lbf-award:1616,1622,1623,1624 · .pod-pz:1625 · .wsa-overlay:1628 · .wsa-box:1630
.wsa-head:1635 · .wsa-title:1636 · .wsa-when:1637,1638 · .wsa-close:1639,1642 · .wsa-cols:1643 · .wsa-col:1644
.wsa-sec-h:1645,1646 · .wsa-msg:1647 · .wsa-msg-h:1650 · .wsa-msg-b:1651,1652 · .wsa-msg-none:1653 · .wsa-rules:1655,1656
.wsa-list:1657 · .wsa-row:1658,1660 · .wsa-r:1661 · .wsa-n:1662 · .wsa-s:1663 · .wsa-p:1664
.wsa-prizes:1665 · .wsa-pz:1666,1669 · .wsa-reveal-medal:1670 · .lobby-bottom:1685,1688,1689,1691(+9) · .rail-onet:1704 · .lobby-quiz-btn:1705
.lobby-book-btn:1706,1707 · .lobby-play-btn:1709,1713 · .lobby-exam-btn:1715,1716,1718 · .panel-overlay:1723,1728,5202,5203(+8) · .panel-box:1729 · .panel-head:1736,1740
.panel-close:1741,1746 · .panel-body:1747,1751,1752 · .panel-page:1749,1750 · .collect-sub:1756 · .mkt-empty:1757 · .craft-box:1758
.mkt-listing:1759 · .mkt-filter:1760,2165 · .hq-grid:1767 · .hq-card:1768,1773,1797 · .hq-head:1774 · .hq-pic:1780,1782
.hq-emoji:1784 · .hq-badge:1785 · .hq-stars:1789 · .hq-price:1790,1795,1796,1799(+6) · .craft-credit:1803,1805,1806 · .car-grid:1813,1815,1816
.robot-weap:1817 · .dmap-box:1820,1821 · .dmap-grid:1827 · .dmap-card:1829,1832,1833,1834(+2) · .dmap-ico:1836 · .dmap-new:1839
.dcp-grid:1841 · .dcp-card:1843,1846,1847,1848(+10) · .levelup-box:1865,2089,2099,3222(+2) · .dcp-box:1868,1869,1873,1874(+6) · .dcp-lock:1882 · .sold-badge:1886,1888,1889
.rs-showroom:1891,5665,5666 · .rs-list:1892,1894,5646,5649 · .rs-thumb:1895,1897,1898,1899(+1) · .rs-thumb-pic:1900,1901 · .rs-thumb-price:1902 · .rs-stage:1904
.rs-big:1907 · .rs-big-img:1908 · .rs-elec:1912,1916,1921 · .rs-edge:1922,1928 · .rs-info:1931,1932,1933,1934(+1) · .rs-buy:1936,1938,1939
.cs-showroom:1943,5638,5639,5667(+3) · .cs-list:1944,1946,5640,5645(+9) · .cs-thumb:1947,1949,1950,1951(+1) · .cs-thumb-pic:1952,1953 · .cs-thumb-name:1954 · .cs-thumb-price:1955
.cs-thumb-own:1956 · .cs-stage:1958 · .cs-big:1961 · .cs-big-img:1962 · .cs-elec:1966,1970,1974 · .cs-edge:1975,1981
.cs-interior:1984 · .cs-inr-label:1985,1986 · .cs-inr-img:1987 · .cs-info:1989,1990,1991,1992(+6) · .cs-buy:2000,2002,2003,2004 · .car-emoji:2006
.car-mine:2012 · .car-mine-pic:2017 · .car-mine-info:2018 · .car-loan:2019,2020 · .car-mine-btns:2021,2022,2023 · .car-locked:2025
.car-mine-head:2027 · .car-pick-list:2028,2029 · .car-pick:2030,2032,2033 · .car-pick-pic:2034,2035 · .car-pick-name:2036,2037 · .car-pick-od:2038
.car-buy-box:2040,3553 · .cb-pic:2041,2042,2043 · .cb-lines:2044 · .cb-li:2045,2049,2050 · .cb-ins:2051,2055,2056 · .cb-plan:2057
.cb-pl:2058,2063,2065,2069(+1) · .cb-total:2076 · .cb-btns:2077,2082 · .cb-x:2078 · .dress-overlay:2085,2102,2105,2109 · .dress-title:2103,2104,2106
.dress-wallet:2107 · #shop-grid-wrap:2111 · .shop-grid:2112 · .shop-item:2113,2121,2122,2123(+13) · .it-topline:2129 · .it-rarity:2130,2131
.it-type:2132 · .it-art-stage:2133 · .it-art:2135 · .it-emoji:2136 · .it-sparkle:2137 · .it-action:2141
.mkt-tab:2166,2167 · .pg-btn:2168,2169,2170 · .pg-dot:2171 · .fr-gift-btn:2205,2210 · .gift-sec-title:2213 · .gift-in-row:2215
.gift-out-row:2219 · .gift-in-pic:2220,2222,2223 · .gift-in-info:2224,2225 · .gift-in-btns:2226 · .gift-accept:2227,2231,2233 · .gift-decline:2232
.gift-box-card:2234 · .gift-box-from:2235,2236 · .gift-note:2237 · .gift-pick-overlay:2240 · .gift-pick-box:2244 · .gift-pick-head:2250,2254
.gift-pick-close:2255 · .gift-pick-tabs:2257 · .gp-tab:2258,2262 · .gift-pick-body:2263 · .gp-chips:2264 · .gp-chip:2265,2269
.gp-card:2270,2271 · .gp-price:2272 · .gp-note:2273 · .gift-cf-pic:2274 · .chat-emoji-cats:2279 · .chat-emoji-cat:2283,2287,2288
.chat-emoji-wrap:2289,2290 · .stage-left:2299,5193 · .pet-info-btn:2303,2310,2311 · .feed-list:2318,2322,2347,2348(+1) · .feed-empty:2323,2326 · .fd-tools:2332
.feed-bell:2333,2335,2336,2337 · .fd-prog:2341,2342 · .fpost:2349,3104 · .fp-head:2354 · .fp-who:2355 · .fp-name-line:2358
.fp-name:2359 · .fp-when:2360 · .fp-badges:2362,2365 · .fp-badge-ic:2363 · .fp-text:2367 · .fp-media:2370
.fp-img:2372 · .fp-cap:2374 · .fp-big:2375 · .fp-sum:2377,2379 · .fp-sum-rx:2380 · .fp-sum-none:2381
.fp-en:2382 · .fp-bar:2384 · .fp-act:2385,2389,2391 · .fp-like:2390 · .fp-page:2402,2403,2404,2405(+3) · .fp-rxbox:2408
.fp-rxb:2412,2414,2415,2416(+1) · .fp-rxb-off:2418 · .fp-fly:2420,2423,2424 · .fcm-overlay:2427 · .fcm-box:2429 · .fcm-post:2433,2434
.fcm-rxs:2435 · .fcm-rx:2436 · .fcm-list:2437,2439 · .fcm-row:2440,2441,2442 · .fcm-none:2443 · .fcm-item:2445
.fcm-reps:2446 · .fcm-rep:2448 · .fcm-more:2450,2452 · .fcm-arrow:2453 · .fcm-reply:2454,2456 · .fcm-like:2458,2461,2462,2463
.fcm-likeic:2464 · .fcm-cnt:2466,2468 · .fcm-likers-box:2469 · .fcm-likers-list:2470,2472 · .fcm-liker-row:2473 · .fcm-liker-none:2474
.fcm-repbar:2475,2478 · .fcm-repx:2479 · .fcm-note:2481 · .fcm-quick:2483,2485 · .fcm-q:2486,2489,2490 · .fcm-add:2491
.fcm-input:2492,2494 · .fcm-send:2495,2497 · .fcm-locked:2498 · .fnt-overlay:2500 · .fnt-box:2502 · .fnt-list:2506,2508
.fnt-row:2509,2511,2524 · .fnt-ico:2512 · .fnt-tx:2513,2514 · .fnt-sub:2515 · .fnt-hint:2517 · .fnt-go:2518,2521,2522,2530
.fnt-tag:2525 · .fnt-note:2527 · .fcm-hl:2532 · .feed-plate:2540 · .feed-all-btn:2541,2546 · .fdb-overlay:2551
.fdb-box:2553 · .fdb-head:2557 · .fdb-close:2561,2563 · .fdb-live:2564 · .fdb-live-title:2565 · .fdb-live-rows:2567,2569,2570
.fdb-live-row:2571,2573,2574,2575 · .fdb-dot:2576 · .fdb-list:2578,2579 · .fdb-empty:2580 · .fdb-row:2581 · .fdb-row-top:2583
.fdb-ico:2584 · .fdb-txt:2585 · .fdb-name:2586 · .fdb-ago:2587 · .fdb-actions:2588 · .fdb-like:2589,2592,2593,2594
.fdb-cm-list:2595 · .fdb-cm-row:2596,2598 · .fdb-cm-empty:2599 · .fdb-cm-add:2600 · .fdb-cm-input:2601,2603 · .fdb-cm-send:2604,2606
.fdb-cm-locked:2607 · .pi-overlay:2610 · .pi-box:2614,2618,2619,2623(+13) · .pi-close:2625,2630,2631 · .pi-close-left:2633 · .pi-close-bottom:2634,2640
.pi-portrait:2664 · .pet-wear:2671,2674,2676 · .pi-portrait-wrap:2679,2681 · .pi-dress-btn:2689,2693,2694 · .pi-shape-cap:2695,2698,2699,2700 · .pi-shape-toggle-btn:2702,2705
.pi-dress-pip:2707,2712,2713,2714(+1) · .pi-wear-note:2717,2719 · .greet-card:2726 · .greet-sub:2727 · .greet-grid:2728 · .greet-opt:2729,2732,2733,2734
.greet-e:2735 · .pi-streak:2739 · .pi-streak-head:2741,2743 · .pi-streak-best:2744 · .pi-dots:2745 · .pi-dot:2747,2748,2749
.pi-streak-note:2750 · .pi-care-title:2751 · .lbf-overlay:2764 · .lbf-box:2767,2781,2782,2783(+13) · .lbf-head:2772 · .lbf-title:2773
.lbf-tabs:2774,2777 · .lbf-note:2780 · .lbf-close:2796 · .lbf-close-l:2797 · .lbf-scroll:2798,2800,2925 · .lbf-body:2801
.lbf-grid:2802 · .lbf-box-bcat:2825 · .lbf-bcat-wrap:2826 · .lbf-bcat:2828,2887,2888,2889(+3) · .lbf-bcat-head:2830,2831,2832 · .lbf-bcat-mid:2839
.lbf-bcat-badge:2840,2899 · .lbcat-ic:2850 · .badge-shine-img:2856 · .badge-shine:2874,2875 · .lbcat-ic-label:2901 · .lbf-bcat-rows:2903
.lbf-one-row:2907,2908,2909 · .lbf-bcat-row:2910,2912,2913,2915 · .lbf-podium:2931 · .pod:2933,2960,2961 · .pod-char:2935 · .pod-base:2937
.pod-rank:2939 · .pod-label:2941,5709 · .pod-name:2943 · .pod-sc:2945 · .pod-1:2950,2951 · .pod-2:2952,2953
.pod-3:2954,2955 · .pod-4:2956,2957 · .pod-5:2958,2959 · .pl-wide:2978,2981,2982,2983(+8) · .pl-follow:2984,2989,2991 · .pl-unfollow:2993,2999,3000
.pl-followers:3001 · .pl-cols:3002,3007,3008,3009 · .pl-col:3003 · .pl-sec-title:3004 · .pl-badges-col:3010 · .pl-feed:3011,3014,3021
.pl-feed-row:3015,3019,3020 · .pl-assets-wrap:3023,5546,5621 · .pl-assets:3024,5549,5554,5560(+4) · .pl-asset:3027,3031,3038 · .pl-asset-emoji:3032 · .pl-asset-n:3033
.pl-pets-wrap:3040 · .pl-pets:3041 · .pl-pet:3042,3047,3049 · .pl-pet-nm:3050 · .img-lightbox:3053,3058,3059,3063(+3) · .cert-svg:3082
.cert-tap:3083,3088 · .cert-chip-sm:3091 · .pl-sec-sub:3111 · .pl-certs:3112,3114 · .cert-mini:3115,3119,3121 · .cert-mini-cap:3122
.cert-none:3124 · .lv-cert-row:3126,3128 · .lv-cert-btn:3129,3134 · .cert-lightbox:3136,3141,3142,3146(+3) · .pl-chat:3166,3171 · .pl-call:3173,3179
.pet-peek:3180,3181 · .pp-chips:3183 · .pp-chip:3184 · .pp-gift:3189,3195 · .settings-box:3197,3198,3271,3282(+37) · .set-feed-head:3199
.set-feed-sub:3203 · .set-feed-row:3204 · .pillinfo-val:3209 · .pillinfo-desc:3214,3233 · .pillinfo-box:3225 · .plf-head:3228
.plf-emoji:3229 · .plf-ht:3230,3231,3232 · .plf-foot:3234,3236,3237 · .alert-box:3242,3244 · .ab-emoji:3245 · .ab-title:3246
.ab-desc:3247 · .ab-btns:3248,3249,3250 · .heal-heart:3252 · .attn-box:3267 · .set-tabs:3292,3296,3299,3300 · .theme-noir:3303,3306,3307,3308(+12)
.set-attention-ico:3334 · .set-attention-copy:3335,3336,3337 · .set-attention-go:3338 · .set-panels:3339 · .set-panel:3340,3343,3344,3346 · .set-offline-card:3347
.set-pack-icon:3354 · .set-pack-copy:3359,3360,3361,3362 · .set-pack-progress:3363,3365 · .set-pack-actions:3367 · .help-box:3473,3474,3475 · .help-guide-box:3486,3505,3510,3511(+8)
.help-guide-x:3495 · .help-guide-head:3501,3502,3503 · .help-guide-tabs:3504 · .help-guide-page:3512 · .help-guide-page-head:3513,3514,3515 · .help-guide-foot:3522
.help-guide-count:3523 · .help-guide-nav:3524 · .help-guide-prev:3526 · .wl-box:3547 · .food-box:3548 · .home-shop-box:3550
.summary-box:3551 · .report-box:3552 · .wl-grid:3555 · .tc-wrap:3557 · .spell-btn:3563,3568,3569 · .sp-hud:3570
.sp-word:3572 · .sp-ch:3573,3578 · .sp-th:3580 · .sp-hint:3582 · .sp-exit:3585,3589 · .sp-banner:3590
.sp-big:3595 · .sp-thb:3597 · .sp-coin:3598 · #spell-confetti:3603 · .sp-rb:3604 · .sp-day:3614
.sp-perfect:3616 · .sp-late:3618 · #spell-coinpop:3621 · .side-sub:3730,3732 · .sec-quest:3737 · .on-page:3749,3750,3751,3752
.inbox-overlay:3762 · .ib-box:3764 · .ib-head:3768 · .ib-close:3772,3774 · .ib-list:3775,3776 · .ib-row:3777,3778,3779,3780
.ib-ava:3781,3786,3787 · .ib-on:3788 · .ib-mid:3790 · .ib-name:3791 · .ib-last:3792 · .ib-meta:3793
.ib-time:3794 · .ib-dot:3796 · .ib-story-badge:3799 · .ib-empty:3803 · .ib-story:3805,3807 · .ib-story-item:3808,3810,3817
.ib-story-ava:3811 · .ib-story-on:3815 · .ib-world:3820,3823 · .ib-tabs:3825 · .ib-tab:3826,3829,3831 · .ib-tab-dot:3832
.ib-call-ava:3836 · .ib-call-row:3837,3838 · #btn-music:3844,3847,3848 · #ws-overlay:3863,4043 · #ws-board:3866,3872,3874,4051(+3) · .ws-head:3877,4080,4081
.ws-title:3878,4082,4089,4090 · .ws-findbar:3881,4091 · .ws-tip:3882,4097 · #ws-combo-clock:3884,3886,3888,3889(+2) · .ws-grade:3894,3895,4102,4108 · .ws-body:3898,4109
.ws-gridwrap:3899,4139 · #ws-grid:3902,4144 · .ws-cell:3907,3912,3914,3917(+6) · .ws-flash:3923,3925,4171 · .ws-coinpop:3929,3953 · .ws-combo:3940,3944,3945,3946
.ws-find:3957,4096 · #ws-prog:3958,4098 · #ws-words:3962,3966,4110 · .ws-word:3968,3973,3974,3975(+16) · .ws-actions:3983,3984,3993,4158(+1) · .ws-sizes:3988,4164
.ws-sizes-lb:3990,4165 · .ws-size-now:3991,4166 · #ws-new:3994,4167 · #ws-combo-help:3995,4168 · #ws-stash:3996,4169 · #ws-clear:3997,4170
#ws-combo-dialog:3999,4000 · .ws-combo-card:4002,4005,4012,4013 · .ws-combo-lead:4006 · .ws-combo-steps:4007,4008,4010,4011 · .ws-combo-close:4014 · .ws-combo-ok:4016
#ws-win:4017,4019,4172 · .ws-win-in:4020,4023,4173,4174 · .sec-online:4209 · .rank-tab:4239,4240,4241,4242(+2) · .pet-show-bg:4272,4274,4276,4281(+22) · .bond-context:4385
.bond-owner:4387,4390,4392 · .bond-owner-heart:4393 · .bond-talk:4395,4399,4401,4402(+6) · .bond-home-card:4409,4414,4415 · .bond-home-art:4416 · .bond-home-img:4418
.bond-home-empty:4420 · .bond-home-copy:4421,4422,4423,4424 · .bond-home-go:4425 · .bond-gear:4427,4431 · .ps-night-fx:4457,4459,4471,4476(+1) · .pet-show:4486,4489,4501,4503(+63)
.ps-video:4770 · .ps-worn-pip:4848,4849 · .id-card:4872,4879,4883 · .id-chip:4896 · .clock-chip:4905,4906 · .coin-block:4922
.coin-subrow:4923 · .coin-group:4924 · .coin-pill:4954,4955,4976 · .cp-lb:4979 · .cp-v:4980 · .topbar-icons:5016
.topbar-icons-row:5017 · .rank-move-box:5034 · .rank-move-head:5039 · .rank-move-feed:5043,5047,5048 · .rank-move-row:5049,5053 · .rank-move-up:5054
.rank-move-name:5055 · .rank-move-topic:5056 · .rank-move-empty:5057 · .rank-move-gap:5058 · .nw-sub:5095 · .top-flex2:5190
#panel-factory:5209,5210,5214,5215(+39) · #panel-rank:5350,5351,5357,5362(+11) · .grid2x8:5433,5439 · .pl-badges-vwrap:5448,5463 · .grid3x5:5449,5454 · .pl-badge-arrow:5455,5461
.pba-u:5462 · .pl-badges-strip:5467,5475,5476 · .pl-badge-card:5477,5483,5501,5502(+1) · .pl-badge-card-ic:5489,5498,5500 · .pl-badge-card-nm:5504 · .pl-badges-empty:5510,5512
.mine-strip:5526,5528,5529,5534(+4) · .mb-strip:5540,5579 · .gmark:5687,5691,5692,5693(+1) · .gm-stack:5696,5700 · .gm-row:5702 · .lb-name:5704,5705,5706
.grade-edit:5727,5732,5733 · .gradelock-box:5737,5753,5758,5760 · .gl-head:5738 · .gl-emoji:5739 · .gl-ht:5740 · .gl-cur:5741
.gl-lock:5742,5747 · .gl-ok:5746 · .gl-lock-sub:5748 · .gl-why:5749 · .gl-pick-lb:5750 · .gl-opts:5751
.gl-hist:5761 · .gl-hline:5762 · .gl-hg:5766 · .gl-hat:5767 · .gl-harr:5768 · .gl-foot:5769
.gl-cf:5770 · .reg-gradelock:5792 · #tp-overlay:5802 · #tp-board:5804,5808 · .tp-head:5812 · .tp-title:5813
.tp-stat:5815,5817 · .tp-pts:5819,5822 · .tp-close:5824,5830,5831 · .tp-snd:5834,5837,5843,5844 · .tp-snd-ic:5838 · .tp-snd-track:5839
.tp-snd-thumb:5841 · .tp-prompt:5848 · .tp-word:5850,5864,5865 · .tp-ch:5852,5857,5858,5860 · .tp-thai:5868 · .tp-hint:5870
.tp-empty:5872 · .tp-keys:5875 · .tp-row:5877 · .tp-row-fn:5879,5912 · .tp-key:5883,5895,5897,5903(+2) · .tp-key-fn:5910
.tp-fx:5916 · .tp-coinpop:5917 · .tp-pop-pt:5922 · #city-backdrop:5936,5942 · .city-arrive:5943,5944 · .night:5958,5978,5979,5981(+4)
#night-veil:6004,6028 · .theme-emerald:6047,6059,6066,6069(+7) · .theme-plum:6052,6063,6067,6070(+3) · #theme-veil:6080 · #screen-picmatch:6135,6141,6142,6143(+41) · .pm-category-btn:6181,6184
.pm-sheet-card-img:6185 · .pm-card:6188,6193,6197,6199(+9) · .pm-grid:6191 · .pm-right:6221 · .pm-now:6222,6228 · #pm-now-en:6229
.pm-now-th:6230 · .pm-lobby-btn:6238,6242 · .pm-mode-btn:6267,6270 · .pm-wordcard:6271,6272,6274 · .mkt-pet-head:6309 · .mkt-pet-wrap:6310
.mkt-pet-list:6311 · .mkt-pet-card:6312,6319,6320,6321(+3) · .mkt-pet-picture:6323,6324,6325 · .mkt-pet-name:6326 · .mkt-pet-stage:6327 · .mkt-pet-price:6328
.mkt-pet-short:6330 · .rs-chibi:6343,6344,6345,6346(+15)

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

## css/profile-modern.css (183 บรรทัด · 41 selector)
.pl-overlay:5 · .pl-card:9,19,27,32(+29) · .pl-ambient:24 · .pl-ambient-a:25 · .pl-ambient-b:26 · .pl-head-mark:41,44
.pl-identity:45 · .pl-eyebrow:46 · .pl-name-line:47,48,49 · .pl-grade-label:51 · .pl-head-actions:52,53 · .pl-chat:54
.pl-call:58 · .pl-profile-rail:68,70,71 · .pl-rail-kicker:72 · .pl-stats-col:73,74 · .pl-blk-wrap:75,77 · .pl-blk:78
.pl-photo:79 · .pl-me-tag:80 · .pl-value-hero:82,84,85,86 · .pl-stat-grid:87 · .pl-stat-ico:90 · .pl-portfolio:94
.pl-tabs:95 · .pl-tab:96,97,98 · .pl-tab-count:99 · .pl-panels:100 · .pl-tab-panel:101,102 · .pl-collection-panel:104
.pl-collection-status:105 · .pl-pets-wrap:106 · .pl-section-heading:107,108,110,111 · .pl-section-icon:109 · .pl-pet-stage:128 · .pl-asset-cat:137
.pl-asset-price:141 · .pl-honors-panel:144,145,146,147(+3) · .pl-story-panel:152 · .pl-story-grid:153,155 · .no-anim:158

## css/rankgraph.css (23 บรรทัด · 10 selector)
.rank-graph-btn:2,5 · .rg-overlay:6 · .rg-box:7,9,10,21 · .rg-close:11,12 · .rg-tabs:13 · .rg-tab:14,15,16
.rg-stage:17 · .rg-chart:18 · .rg-point:19 · .rg-loading:20

## css/skyplay3d.css (38 บรรทัด · 22 selector)
#sp-root:2,3 · #sp-canvas:4 · .sp-sky-glow:5 · .sp-top:6,28 · .sp-pill:7,8 · .sp-play:9
.sp-daily:10 · .sky-hint:11 · .sky-word:12 · .sp-toast:13 · .sp-joy:14 · .sp-actions:15
.sp-activity:16 · .sp-gate:17 · .sp-tower:18 · .sp-classroom:19 · .sp-class-finish:20 · .sp-packbar:21
.sp-character-btn:29 · .sp-character-picker:30 · .sp-character-card:31,32 · .sp-character-grid:33,34,35

## css/style.css (2,539 บรรทัด · 613 selector)
:root:5 · *:25 · html:26,31 · input:35 · body:39 · #app:45
.screen:48,49 · h1:52 · .subtitle:53 · .egg-grid:56,73 · .egg-card:57,62,63,64(+2) · .pet-price:67,71
.egg:75,81,85 · .d1:86 · .basket:89,90,95,101(+5) · .basket-dog:99,112,113,114 · .basket-cat:100,115,116,117 · .egg-dragon:120
.topbar:135 · .topbar-coins:136 · .coin-pill:137,148,152,157(+4) · .coin-ic:144 · .no-anim:158,189,193,194(+6) · .coin-flow:162,163,167,174(+1)
.pill-gain:203 · .q-row:219,220,221,225(+1) · .q-emoji:222 · .q-mid:223 · .q-name:224 · .q-bar:226,227
.q-right:229,230 · .q-foot:231,232 · .tc-open:235,236 · .tc-wrap:237 · .tc-card:238 · .tc-head:242
.tc-sub:246 · .tc-name:247,248 · .tc-badges:249 · .tc-when:250 · .tc-row:251,255 · .tc-pass:256
.tc-try:257 · .tc-sign:258 · .tc-hint:259 · .tc-close:260 · .mb-seller:266 · .mb-buy:267
.wl-open:270,275 · .strip-wrap:278,296 · .strip-x:279,286,287,299(+1) · .strip-arrow:288,294,295 · .craft-toolbar:302,303 · .fc-cols:305,306
.wl-box:340 · .wl-head:341,342,343 · .wl-grid:345 · .dress-overlay:353 · .wl-it:363,367,368,369 · .wl-emoji:370
.wl-name:371 · .wl-h:372 · .hq-card:373,455 · .icon-btn:374 · #settings-badge:380 · .badge-pop:383
.attn-box:385,386,403 · .attn-list:387 · .attn-row:388,393 · .attn-ico:394 · .attn-txt:395,396 · .attn-go:397
.attn-total:398,402 · .rain-banner:406,411,412,413 · .rain-row:415 · .rain-icon:416 · .rain-track:417 · .rain-fill:421
.rain-note:422 · .comp-earn:425,437,441,442(+1) · .comp-earn-label:430 · .comp-earn-num:431,435 · .comp-earn-sub:436 · .farm-sub:448
.farm-mkt-hint:449 · .farm-cols:451,452 · .farm-shop:454 · .farm-hq:456,457,458 · .farm-yield:459,460 · .farm-tree:461,466,471,475
.farm-tree-emoji:470 · .farm-tree-name:473 · .farm-tree-status:474 · .farm-grow-badge:476 · .farm-sell-btn:497,502 · .farm-sellall-btn:503,509,510
.rank-card:513 · .rank-badge-wrap:518 · .rank-badge-img:519 · .rank-badge-emoji:520 · .rank-body:521 · .rank-name:522,523
.rank-bar:524 · .rank-fill:525 · .rank-text:526 · .rankup-overlay:529 · .rankup-rays:535 · .rankup-content:551
.rankup-title:556 · .rankup-badge:561,574 · .rankup-badge-img:573 · .rankup-name:575 · .rankup-en:579 · .rankup-sub:583
.rankup-btn:584,591,592 · .qbp:596,597,598,599(+4) · .cr-btn-row:605 · .rankup-btn-2:606,607 · .thunder-fx:610 · .quake:611
.pet-tabs:623 · .pet-tab:624,630,631 · .pet-card:633 · .pet-stage:638 · .aura:639,645 · .sp1:646
.pet-wrap:649 · .pet-emoji:650 · .pet-img:651 · .egg-img:652 · .feed-pet:653,901 · .pet-baby:654
.pet-adult:655 · .pet-egg-stage:657 · .wear:659 · .wear-head:660 · .wear-face:661 · .wear-neck:662
.pet-name:664 · .stage-label:665 · .level-row:666 · .level-badge:667 · .exp-bar:671 · .exp-fill:672
.exp-text:673 · .ability-box:675,679 · .hunger-bar:682 · .hunger-fill:683,684,685 · .food-item:691,756,760,761(+9) · .hunger-text:695
.heat-bar:698 · .heat-fill:699 · .heat-text:700,701,702 · .care-row:704 · .care-btn:705,709,716 · .btn-feed:710
.btn-feed-all:711 · .btn-cure:712 · .btn-foodquiz:714 · .care-row-quiz:715 · .sick-banner:717 · .pet-sick:721
.food-lock-note:724 · .pet-asleep:734 · .sleep-badge:735 · .btn-sleep:737 · .dinner-btn:740 · .food-box:744,745
.food-x:747,753 · .food-hunger-bar:754 · .food-grid:755 · .fd-lock:769 · .fd-lock-when:793 · .fd-nowok:794
.fav-tag:797 · .fd-exp:801 · .food-sec:803 · .food-sec-human:807 · .bad-tag:809 · .fd-toxin:813
.fd-safe:814 · .food-sprite:820 · .food-art-fallback:825 · .feed-all-overlay:826 · .feed-all-box:827 · .feed-all-head:833,834
.feed-all-shelf:835 · .feed-all-close:836 · .feed-all-close-top:837 · .feed-all-scroll:838,839,840 · .feed-all-pets:841 · .feed-all-pet:842,843,846
.feed-all-pet-art:844 · .feed-all-plan-art:845 · .feed-all-menu:847 · .feed-all-selected-head:848 · .feed-all-mini-bar:849 · .feed-all-foods:850
.feed-all-food:851,852 · .feed-all-food-stock:853 · .feed-all-food-art:854 · .feed-all-food-badge:855 · .feed-all-actions:856 · .fq-box:874,875
.fq-progress:876 · .fq-pair:877,878 · .fq-ask:879 · .fq-why:880 · .fq-btns:884,885,889 · .fq-yes:890
.fq-no:891 · .fq-next:892 · .food-cancel:893 · .feed-box:899,900 · .feed-gain:902 · .sick-badge:906
.big-btn:912,918,1176,1177(+6) · .shop-card:921 · .shop-title:925 · .shop-grid:926 · .shop-item:927,931,932,933(+4) · .it-tag:938
.tag-wear:939 · .lock-banner:941 · .home-current:947,952,953 · .home-img:954 · .home-emoji:955 · .home-btn:956,978
.home-layout:958 · .home-pic-col:959,965 · .home-img-big:963 · .home-info-col:966,968,971,972 · .home-name-row:969 · .home-desc-row:970
.home-shop-box:980,981 · .home-list:982 · .home-option:983,987,988,989(+3) · .home-downgrade-lock:994 · .home-opt-img:997 · .home-opt-body:999,1000
.home-price:1001 · .reset-link:1021 · .login-card:1027 · .login-pets:1028 · .login-status:1029 · .google-btn:1030,1036,1037
.login-note:1038 · .install-btn:1041,1047,1048 · .install-guide-overlay:1051 · .install-guide:1055,1059,1062 · .install-steps:1060,1061 · .install-guide-close:1063
.login-account:1068 · .register-card:1071,1075,1093,1097 · .reg-safety:1077,1079,1080 · .reg-privacy:1082,1084,1085 · #screen-register:1087,1088,1089,1090(+2) · .student-chip:1098
.clock-chip:1102 · .online-count:1108 · .online-row:1115,1119,1120,1139 · .online-dot:1124 · .online-name:1129 · .online-act:1133
.online-ava:1138 · .online-live:1140 · .online-note:1144 · .lb-empty:1147 · .lb-list:1148 · .lb-row:1149,1153,1154
.lb-rank:1158 · .lb-name:1160,1164 · .lb-coins:1168 · .lb-hint:1170 · .lb-badgeline:1171 · .lb-tabs:1173
.lb-tab:1174,1175 · .tinv-note:1186 · .cat-card:1192,1237,1240,1388(+1) · .cat-head:1196 · .cat-emoji:1197 · .cat-name:1198
.cat-pass:1199 · .cat-info:1200 · .cat-btns:1201 · .cat-btn:1202,1206,1207,1208(+3) · .cats-back-bottom:1211 · .tapglow:1216,1217,1225
.lobby-bottom:1224 · .band-sec-head:1235,1236 · .bax-box:1244,1246 · .bax-head:1247 · .bax-sub:1248,1249 · .bax-row:1250
.bax-lv:1251,1254,1255,1256(+3) · .bax-emoji:1257 · .bax-name:1258 · .bax-q:1259 · .bax-need:1261 · .bax-rw:1262
.bax-foot:1266 · .bax-rank:1267,1270 · .bxr-box:1273,1275 · .bxr-head:1276 · .bxr-sub:1277 · .bxr-body:1278
.bxr-pick:1279 · .bxr-cats:1280 · .bxr-chip:1281,1283,1284,1285(+1) · .bxr-list:1288 · .bxr-row:1289,1291,1293,1297 · .bxr-rk:1292
.bxr-nm:1294,1295 · .bxr-sc:1296 · .bxr-tm:1298 · .bxr-more:1299 · .bxr-none:1300 · .bxr-foot:1302
.band-mine-tag:1303 · .bsp-box:1306,1309 · .bsp-head:1310 · .bsp-prog:1311 · .bsp-retake:1313,1316 · .bsp-info:1318,1320
.rts-box:1323 · .rts-head:1325 · .rts-sets:1326 · .rts-set:1327,1328,1329 · .rts-sub:1330 · .rts-words:1331
.rts-word:1332,1334,1335 · .rts-foot:1336 · .rts-okbtn:1337,1339 · .bsp-grid:1340 · .bsp-chip:1341,1344,1345,1346(+1) · .bsp-num:1348
.bsp-best:1349 · .bsp-tick:1350 · .bsp-foot:1351 · .vb-box:1354,1356 · .xsp-box:1359 · .vb-head:1360
.vb-total:1361 · .vb-quizbtn:1362,1364 · .vb-tabs:1365 · .vb-tab:1366,1368,1369 · .vb-words:1370 · .vb-word:1371,1374,1375,1376(+3)
.vb-empty:1380 · .vb-foot:1381 · .vb-pg:1382,1384 · #vb-pginfo:1385 · .vb-hint:1386 · .band-lock:1394
.offline-btn:1395,1396 · .quiz-progress:1401 · .quiz-phon:1402 · #quiz-extra:1403,1405,1406,1407 · .quiz-word-card:1408 · .quiz-next:1414,1420,1421,1422(+1)
.quiz-choice:1425,1430,1431,1432 · .quiz-score-pill:1433 · .quiz-time-pill:1435,1437 · .stats-card:1440 · .stats-title:1444,2064 · .stats-row:1445,1446,1447,1448
.stat-badge-line:1450,1453 · .stat-badge-ic:1451 · .game-top:1456 · .back-btn:1457 · .combo-pill:1461 · .timer-wrap:1465
.timer-fill:1466,1467 · .board-label:1469 · .card-grid:1470 · .word-card:1471,1477,1478,1479(+3) · .hint-btn:1485,1490 · .game-endless-note:1493,1498,1500,1504(+6)
.report-btn:1525,1530 · .report-box:1533 · .report-close:1534 · .rp-head:1538 · .rp-avatar:1539,1540 · .rp-title:1541
.rp-sub:1542 · .rp-levelcard:1544 · .rp-level-top:1548 · .rp-bar:1549 · .rp-bar-fill:1550 · .rp-level-note:1551,1552
.rp-grid:1554 · .rp-stat:1555 · .rp-ic:1558 · .rp-num:1559 · .rp-lbl:1560 · .rp-section:1562
.rp-h3:1563 · .rp-badge-mini:1564 · .rp-row:1565,1566,1567 · .rp-empty:1568 · .rp-badges:1569 · .rp-badge:1570
.rp-tline:1573 · .rp-tl-head:1574,1575 · .rp-tl-ems:1576 · .rp-em:1577,1578 · .rp-tl-note:1579,1580 · .rp-crown:1582,1583
.rp-wtitle:1585 · .rp-wnow:1586,1587 · .rp-wgraph:1588 · .rp-wcol:1589 · .rp-wval:1590 · .rp-wbar:1591,1592
.rp-wlbl:1593 · .rp-cheer:1595 · .report-ok:1599 · .summary-box:1602,1725,1729,1730(+2) · .sm-burst:1603 · .sm-title:1605
.sm-line:1606 · .sm-coin:1607 · .sm-matches:1613,1614 · .confetti:1616 · .sm-badge:1623 · .sm-badge-all:1627
.badge-celebrate-overlay:1630,1683,1691 · .badge-celebrate:1636 · .bc-emoji:1642,1680 · .bc-emoji-img:1651 · .badge-clickable:1664,1665,1666 · .badge-info-box:1670
.bi-emoji:1671 · .bi-emoji-img:1672 · .bi-title:1673 · .bi-desc:1674 · .bi-ok:1675 · .bc-title:1681
.bc-sub:1682 · .bc-sticky:1692 · .bc-coin:1693,1698 · .bc-ok:1699,1704 · .sm-cheer:1719 · .sm-streak:1720,1721
.sm-sick:1722 · .sm-btns:1723 · .float-fx:1735 · .toast:1742 · .toast-warn:1749,1756,1757,1763 · .toast-financial:1764,1773,1791,1797(+2)
.toast-fin-title:1777 · .toast-fin-chips:1780 · .toast-fin-chip:1781,1787 · .toast-link:1811,1818,1819,1824(+4) · .toast-clear-all:1835,1842 · .alert-box:1844
.alert-ok:1845,1850 · .settings-box:1852 · .set-row:1853 · .set-hint:1857 · .set-hint-on:1858 · .set-hint-off:1859
.set-lwrap:1860 · .set-label:1861 · .set-desc:1862 · .set-switch:1863,1867,1868,1873(+4) · .set-sw-knob:1869 · .set-sw-txt:1876
.set-night-row:1885 · .set-seg:1886,1888,1894,1895(+1) · .set-theme-row:1898 · .set-theme-seg:1899 · .set-theme-sw:1900 · .set-theme-chip:1901
.set-close:1905,1910 · .set-help:1911,1916 · .help-box:1918,1919,1924 · .help-item:1920 · .update-banner:1932,1941,1942 · #update-reload:1943
#update-dismiss:1947 · .levelup-overlay:1953,1959,1960 · .levelup-box:1961,1968,1969,1970(+4) · .bill-box:1986,1990,1991 · .tag-off:1992 · .home-decayed-img:1993
.home-dark-img:1994 · .thirst-fill:1995 · .thirst-text:1996,1997 · .toxin-fill:2000 · .toxin-text:2001,2002 · .detox-btn:2003,2008
.shape-text:2011,2012,2013,2014(+1) · .avatar-pick:2018 · .avatar-opt:2019,2023,2024,2025 · .avatar-chip-img:2029 · .mini-av:2031 · .fp-ava:2032
.avatar-chip-blk:2034 · .set-avatar-btns:2035 · .avatar-mini:2036,2040 · .set-blk-row:2042 · .set-sub2:2043 · .blk-grid:2045
.blk-mini:2046,2049,2050,2051 · .game-avatar:2054,2055,2056 · .stats-nick:2065 · .ticket-owned:2068,2072 · .collect-sub:2077 · .mkt-tabs:2078
.mkt-tab:2079,2083 · .mkt-filter:2084 · .mkt-row:2088 · .mkt-emoji:2092,2093 · .mkt-info:2094,2095 · .mkt-tier-stars:2096
.mkt-buy:2097,2102,2103 · .mkt-price-lo:2104 · .mkt-price-hi:2105 · .mkt-empty:2106 · .collect-grid:2109 · .collect-cell:2110
.cc-emoji:2111,2112 · .cc-name:2113 · .cc-count:2114 · .cc-list-btn:2115,2119 · .mkt-listhead:2120 · .mkt-group-head:2122,2128
.mkt-two-col:2130,2131,2135,2147(+8) · #phone-card:2136,2152 · #computer-card:2137,2153 · #ticket-card:2139 · #haunt-card:2140 · #heli-card:2141
#drone-card:2142 · #drive-card:2143 · #soccer-card:2144 · #moto-card:2145 · #invasion-card:2146 · .mkt-listing:2174
.ml-cancel:2178 · .mkt-sold:2184,2185,2186 · .mkt-sys-box:2187,2188,2189 · .mkt-sys-coins:2190,2191 · .mkt-buy-box:2196,2202 · .mkt-buy-item:2203
.mkt-buy-pic:2213 · .mkt-buy-pic-img:2225 · .mkt-buy-pic-emoji:2226 · .mkt-buy-meta:2227 · .mkt-buy-name:2228 · .mkt-buy-seller:2229,2230
.mkt-buy-price:2231 · .mkt-buy-balance:2232 · .mkt-confirm-code-title:2233 · .mkt-code-target:2234 · .mkt-pin-note:2247 · .mkt-code-input:2248
.mkt-code-error:2263 · .mkt-pin-grid:2272 · .mkt-pin-btn:2277,2289 · .mkt-pin-del:2290 · .mkt-pin-clear:2291 · .mkt-buy-actions:2292,2298
.mkt-buy-cancel:2309 · .mkt-buy-confirm:2314,2320 · .list-dialog:2341,2342,2347 · .list-hint:2346 · .collect-reveal-frame:2350,2357 · .collect-reveal-img:2356
.collect-reveal-stars:2358 · .craft-box:2361 · .craft-head:2362 · .craft-bar:2363 · .craft-fill:2364 · .craft-text:2365
.craft-btn-row:2366,2367 · .craft-go-btn:2369,2375,2376,2379 · .craft-cancel:2387,2391 · .mkt-catalog:2394,2395,2396 · .mkt-pager:2399 · .pg-btn:2400,2404,2405
.pg-mid:2406 · .pg-dots:2407 · .pg-dot:2408,2409 · .order-head:2410 · .order-row:2411,2416,2418,2420 · .order-deliver:2421,2426
.order-need:2427 · .avatar-chip-photo:2433 · .pass-photo:2434 · .pl-photo:2435 · .pp-cam:2440,2448 · .set-photo-row:2451,2457
.ph-thumb:2458 · .ph-plus:2459 · .photo-box:2465,2466,2487,2491(+4) · .ph-now:2467 · .ph-now-img:2468,2472 · .ph-now-cap:2473
.ph-warn:2474 · .ph-sync:2479,2482 · .ph-sync-wait:2483 · .ph-sync-ok:2484 · .ph-sync-bad:2485 · .ph-btns:2486
.ph-tip:2496 · .ph-stage:2498,2502 · .ph-cv:2503 · .ph-ring:2504,2509 · .ph-zoom:2513 · .ph-foot:2514
.ph-crop-box:2515

## css/wordship.css (62 บรรทัด · 25 selector)
#wsh-game:2,3 · .wsh-stage:4 · .wsh-cross:5 · .wsh-hud:6 · .wsh-glass:7 · .wsh-stats:8,9
#wsh-hearts:10 · .wsh-word:11,12,13,14 · .wsh-bank:15 · .wsh-exit:16 · .wsh-hint:17 · .wsh-pad:18,19,23
.wsh-left-controls:20 · .wsh-auto:21,22 · .wsh-attack:24,25 · #wsh-drop:26,27 · #wsh-scope:28 · .wsh-speed:29,30,31,32(+3)
.wsh-speed-foot:36 · .wsh-toast:37 · #wsh-arrows:38 · .wsh-nav:39,40,41,42(+2) · .wsh-modal:45,46 · .wsh-card:47,48,49
.wsh-buttons:50,51

## css/wordskirmish.css (117 บรรทัด · 40 selector)
#skm-game:2,3,72,87 · .skm-stage:4 · .skm-cross:6,7,8,9 · .skm-scope-view:10 · .skm-scoped:11,17,18 · .skm-scope-ring:12,13,14,15(+1)
#skm-scope:19,20 · .skm-hud:21 · .skm-glass:22 · .skm-stats:23,24 · #skm-hp:25 · .skm-word:26,27,28,29
.skm-bank:30 · .skm-exit:31 · .skm-hint:32 · .skm-zones:33 · .skm-zone:34 · .skm-joy:35,36
.skm-joy-knob:37 · .skm-joy-lab:38 · .skm-float:39,46 · #skm-drop:40,41 · #skm-auto:42,43 · #skm-crouch:44,45
.skm-toast:47 · .skm-modal:48,49 · .skm-card:50,51,52,53 · .skm-br-ui:63 · .skm-kicker:64 · #skm-intro:65,66,67,68(+1)
.skm-battle:70,71,73,74(+14) · .skm-match:88,89 · #skm-edit:90 · .skm-editing:91 · .skm-vitals:92,93,94 · .skm-weapon-panel:95
#skm-ammo:96 · .skm-weapon-slots:97 · .skm-round-result:99,100 · .skm-zone-warning:101
