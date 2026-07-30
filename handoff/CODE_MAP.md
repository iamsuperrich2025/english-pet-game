# CODE_MAP.md — แผนที่โค้ด:บรรทัด (เจนอัตโนมัติโดย `tools/gen_code_map.py` — **ห้ามแก้มือ** เดี๋ยวโดนเขียนทับ)

> วิธีใช้: หาชื่อฟังก์ชัน/ค่าคงที่/selector ในไฟล์นี้ (Grep หรือกวาดตา) → `Read` ไฟล์จริง `offset=<บรรทัด>` `limit=40`
> 🗂️ ไฟล์อ้วนมี **สารบัญโซน** (`st-end ชื่อโซน`) — งานทั้งระบบ/โลก 3D: Grep ชื่อโซน → Read/Edit เฉพาะช่วงนั้น **ห้ามอ่านทั้งไฟล์** · เพิ่มระบบใหม่ในไฟล์อ้วนต้องครอบ banner `/* ==== */`+ชื่อโซน (สารบัญเจนเอง)
> css = index `selector:บรรทัดทุกจุดที่ประกาศ` (บั๊ก UI เริ่มหาที่นี่) · เจนใหม่ทุกครั้งที่รัน `python tools/rotate_handoff.py` · อัปเดต: 2026-07-30

## js/adv3d_css.js (1,137 บรรทัด · 0 รายการ)

## js/adv3d_intro.js (86 บรรทัด · 0 รายการ)

## js/adv3d_tex.js (245 บรรทัด · 19 รายการ)
TILE_COLORS:9 · letterTexture:10 · letterTextureDark:27 · emojiTexture:40 · GHOST_IMG_MAX:52 · measureGhostBox:58
probeGhostImages:71 · whenGhostsReady:83 · ghostTexture:87 · ghostScareSrc:92 · AD_STYLES:100 · adBoardTexture:109
addAdBillboard:156 · ringAds:167 · BUILDING_TINTS:177 · FACADE_ROWS:179 · buildingFacadeTexture:180 · makePeerSprite:205
bind:241

## js/adventure3d.js (12,298 บรรทัด · 597 รายการ)
### 🗂️ สารบัญโซน js/adventure3d.js (Read/Edit เฉพาะช่วง)
- 1-218 adventure3d.js — โลก 3D First-person 2 โหมด (คิว 7725691507 ข้อ 8 + ต่อยอด)
- 219-287 ⚽ โหมดสนามฟุตบอล (โหมด soccer · รอบ 196) — เล็ง+ชาร์จพลังเตะบอลใส่ป้ายตัวอักษร
- 288-342 🤖 โหมดหุ่นยนต์นักรบ (โหมด mecha · รอบ 199) — มุมมองในหุ่นสูง 5m เดินยิงเอเลี่ยนตัวอักษร
- 343-485 📻 หอบังคับการบิน (รอบ 64 · รอบ 66 เปลี่ยนเป็นอังกฤษล้วนตามผู้ใช้สั่ง)
- 486-506 คำศัพท์ — ตามระดับชั้น + ไม่ซ้ำคำที่ประกอบแล้ว (8.1/8.6) · แยกคลังต่อโหมด
- 507-645 Texture ตัวอักษร / emoji / ป้ายชื่อผู้เล่น (canvas → sprite)
- 646-816 🧱 ตัวละครบล็อก (โลกขับรถ) — เลือกก่อนออกรถ · เพื่อนใน map เห็นเป็นหุ่นบล็อกขับรถบล็อก
- 817-1123 🚙 รอบ 393: รถเพื่อนในโลกขับรถ = โมเดลจริง img/models/car_01.glb (ผู้ใช้สั่ง)
- 1124-1276 สร้างฉาก static ครั้งเดียวต่อโหมด
- 1277-1623 🚗 เมืองกำแพงเพชรจริง (โหมด drive) — ข้อมูล OpenStreetMap ใน js/data/city_kpp.js
- 1624-1690 🧭🕳️ รอบ 782 — ปิดช่องขาดของกริดถนน (ผู้ใช้: "GPS พาไปช่วงที่ถนนขาดตอน / ขับต่อไม่ได้")
- 1691-1897 🌉 รอบ 788 — ปูถนนเชื่อม "เกาะถนนโดดเดี่ยว" เข้าโครงข่ายหลัก
- 1898-1955 🌳🚁 รอบ 811: จุด "พื้นที่สีเขียวข้างถนน" (greenPts) — สุ่มออกจากจุดบนถนนแต่ละจุด
- 1956-2007 🚁🌳 รอบ 816 — บินเฮลิคอปเตอร์เหนือ "เมืองกำแพงเพชร" แล้วลงจอดเก็บตัวอักษรบนพื้นที่สีเขียว
- 2008-2024 🌅 ท้องฟ้าภาพจริง (รอบ 203) — ใส่ภาพ panorama 360° (equirectangular 2:1) เป็นฉากหลังท้องฟ้า
- 2025-2064 🧱 เทกซ์เจอร์ภาพจริง (รอบ 323) — วางไฟล์ `img/tex/<key>.jpg` (หรือ .png) แล้วแปะทับพื้นผิวทันที
- 2065-2559 🌌 ท้องฟ้ากลางคืนโรงแรมผีสิง (รอบ 694) — ผู้ใช้: "ข้างนอกโรงแรมยังไม่น่ากลัวพอ"
- 2560-2598 🏨 โรงแรมผีสิง (รอบ 684) — ตัวตึก 5 ชั้นสร้างใน js/hotel3d.js
- 2599-2759 ตัวอักษรในโลก (8.2)
- 2760-2802 🌳🪙 รอบ 811: ความหนาแน่นเสริมเฉพาะโหมดขับรถ — ผู้ใช้: "เพิ่มตัวอักษรและเหรียญบนถนนและ
- 2803-2870 🔠🪙 เก็บตัวอักษร 1 ตัว = ได้ 1 เหรียญ (รอบ 345)
- 2871-2933 ประกอบคำอัตโนมัติเมื่อมีตัวอักษรครบ (8.1/8.4)
- 2934-3028 โหมด adv: monsters ยิงสู้ได้ (สเปกเดิม 8.5)
- 3029-3036 👻 ผีในโรงแรม (รอบ 684 — เขียนใหม่ทั้งชุด · ผู้ใช้สั่งข้อ 10-13, 18)
- 3037-3165 🧟 โมเดลผี 3D (รอบ 689 — ผู้ใช้สั่ง: "ภาพผีแบน ๆ ไม่สมจริง ไม่น่ากลัว ใช้โมเดลแทน")
- 3166-3402 🔦👻 รอบ 778 (ผู้ใช้สั่งข้อ 4) — กติกาใหม่ของผีเดินเพ่นพ่านในโรงแรม
- 3403-3664 🏨 ระบบโรงแรมผีสิง (รอบ 684) — เดินขึ้นชั้น/ไฟดับ/ไฟฉาย/ตู้เสื้อผ้า/รูปตามอง
- 3665-3898 เสียงหลอนโหมดผีสิง — สังเคราะห์ Web Audio (ปลอดลิขสิทธิ์ 100%)
- 3899-4224 Multiplayer — ผู้เล่นอื่นใน map เดียวกัน (สไตล์ Roblox)
- 4225-4424 Voice chat ใน map — WebRTC P2P mesh (เสียงวิ่งตรงระหว่างเครื่อง)
- 4425-4505 🏁 พิธีประกาศแชมป์ (ครูกด "จบรอบแข่ง") — /class/<map>/podium
- 4506-4712 HUD
- 4713-5345 DOM overlay + CSS (สร้างครั้งเดียว — self-contained ไม่แตะ style.css)
- 5346-5481 Input — เมาส์+คีย์บอร์ด และจอสัมผัส (มือถือ landscape)
- 5482-5486 🚁 โหมดเฮลิคอปเตอร์ Bell — ฟิสิกส์บินแบบอาร์เคด (สไตล์ Helicopter Flight Pilot)
- 5487-5879 🛸 โดรน FPV (โหมด drone) — บินเร็ว/คล่อง ลอดหน้าต่างเข้าตึกร้าง เก็บตัวอักษรในห้อง
- 5880-6002 🚗 โหมดขับรถเมืองกำแพงเพชร — ฟิสิกส์รถอาร์เคด (bicycle model)
- 6003-6096 🚦 รอบ 133: ไฟจราจรจริงที่ทางแยกใหญ่ + ฝ่าไฟแดงโดนใบสั่ง ม.22
- 6097-6544 🧭 GPS นำทาง (โหมด drive) — เลือกตัวอักษรเป้าหมาย + เส้นทางตามถนนจริง (A*) · นำทางด้วยภาพล้วน (ไม่มีเสียงพูด ตั
- 6545-6603 🎛️ เข็มหน้าปัดวิ่งจริง (สปีด 0-180 + วัดรอบ 0-8×1000) — วาดทับวงเกจของภาพ dash.png
- 6604-6688 🎵 รอบ 181: วิทยุในรถ — จอ head-unit กลางคอนโซล (visualizer + เลือกเพลง 3 โหมด)
- 6689-6721 🪞📷 รอบ 810: กระจกมองหลัง/ข้าง — เรนเดอร์ฉากเดิมซ้ำด้วยกล้องหันหลัง/เฉียงข้าง แล้วยัดลงกรอบบนจอ (scissor)
- 6722-6849 🪆 รอบ 191: ตุ๊กตาดุ๊กดิ๊กหน้ารถ — รูปตัวละครที่ผู้เล่นเลือก (blkN.png)
- 6850-7153 🚔 รอบ 128: แผงเตรียมออกรถ + กฎหมายจราจร + ใบสั่ง
- 7154-7196 🛩️📦 ภารกิจไปรษณีย์กลางคืน (รอบ 353) — เฉพาะช่วงฟ้ามืด (heliNight>.5)
- 7197-8411 🚶🛗🚁🪂 โหมดเดินเท้าในเมืองเฮลิฯ (รอบ 354 — ผู้ใช้สั่ง)
- 8412-8485 🎛️ หน้าปัดเข็มขยับจริง (รอบ 61) — วาดสดทุกเฟรมจากค่าการบินจริง
- 8486-8757 🌧️☀️ ชั้นบนกระจก: ที่ปัดน้ำฝน + แสงแดดสาด (รอบ 346)
- 8758-9162 🔊🌧️ เสียงที่ปัดน้ำฝน (รอบ 537) — สังเคราะห์ล้วน ไม่มีไฟล์เสียง
- 9163-9232 📹 กล้องใต้ท้องเครื่อง (belly cam) — รอบ 348
- 9233-9304 🎯 วงเป้าลงจอด (รอบ 349) — ไฮไลต์ดาดฟ้าที่มีตัวอักษร ให้รู้ว่าควรร่อนลงตรงไหน
- 9305-9920 📏 แถบเตือนความเร็วดิ่ง (รอบ 349) — ลงเร็วเกินกรอบกล้องกะพริบแดง สอนให้ร่อนลงนุ่มๆ
- 9921-9923 Loop หลัก
- 9924-11249 ⚽ โหมดสนามฟุตบอล — ฟิสิกส์บอล + เล็ง + ชาร์จพลัง + กล้อง 1st/3rd + ชุดนักเตะ
- 11250-11704 🤖 โหมดหุ่นยนต์นักรบ — เดินยิงเอเลี่ยนตัวอักษร (ต้องยิงเรียงลำดับในคำ)
- 11705-11725 เข้า/ออกโลก
- 11726-12298 ❓ การ์ด "วิธีเล่น" ตอนเข้าโลกครั้งแรก (จำแยกต่อโลกใน localStorage — ไม่แตะ state.js)
### รายการ js/adventure3d.js
GUIDE_WORDS:20 · LETTER_RESPAWN_MS:21 · HALF:22 · PLAYER_SPEED:23 · HAUNT_LIVES:24 · HAUNT_IFRAME:25
PICK_DIST:26 · EYE_H:27 · NET_SEND_MS:28 · MODES:31 · SHOOT_GAP_MS:95 · MONSTER_REWARD:96
AD_COUNT:97 · AD_RENT_COIN:98 · AD_RENT_MS:99 · SHOP_ADS:103 · PILOT_TIERS:105 · pilotEmoji:106
DRONE_R:118 · DRONE_ACCEL:119 · DRONE_VMAX:120 · DRONE_CLIMB:121 · DRONE_YAWSP:122 · DRONE_GRAV:123
CAR_EYE:127 · CAR_ACCEL:128 · CAR_BRAKE:129 · CAR_VMAX:130 · CAR_LEGAL_KMH:131 · CAR_FINE_SPEED:132
CAR_FINE_BELT:133 · CAR_REPAIR_FEE:134 · CAR_FINE_SIGNAL:135 · CAR_RAM_FEE:136 · CAR_FINE_RED:137 · CAR_VMAX_OFF:138
CAR_VREV:139 · CAR_WB:140 · CAR_STEER_MAX:141 · HELI_SKID:176 · HELI_CRASH_FINE:177 · HELI_MESH_SCALE:178
ASSIST_R:182 · PROP_STALL_MS:187 · PROP_BREAK_SPD:190 · PROP_BROKEN_MUL:191 · BAT_DRAIN:194 · BAT_LETTER:195
BAT_LOW:196 · BAT_EMPTY_MUL:197 · CHG_R:200 · GATE_R:203 · showHeliSkip:210 · BOLT_MIN:211
GLASS_HIT_R:212 · DOOR_R:213 · SOCCER_SHIRTS:223 · BALL_R:228 · GOAL_HW:229 · KICK_SPD_MIN:230
AIM_YAW_SP:231 · SOCCER_TILES:232 · AIM_STICK:240 · CURL_SWIPE:243 · CURL_SPIN:244 · HIT_LIFT:248
GUIDE_N:249 · FK_SPOT_Z:255 · FK_MAN_R:256 · AURA_COST:262 · FIRE_CHG:265 · SB_DRAG:273
SPOST_R:274 · GK_Z:279 · GK_SPRITES:280 · PK_TIME:282 · MECHA_EYE:292 · ALIEN_COUNT:293
MECHA_MAX_HP:294 · MECHA_ATK_RANGE:295 · ALIEN_SHOT_SPD:296 · POWERUP_GAP:297 · BOSS_SCALE:298 · COMBO_X2:299
BOSS_SPECIES:302 · pickBossSpecies:310 · WAVE_BASE_GOAL:312 · waveCfg:313 · MECHA_WEAPONS:322 · ATC_REPLIES:351
ATC_CLOSERS:356 · ATC:361 · netUp:479 · CHAT_MAX:482 · doneList:489 · wordPool:490
pickWords:503 · adRenterActive:515 · FACADE_ROWS:524 · adsFetch:530 · adsWatch:542 · adsStop:549
adsChanged:550 · adRentBuy:561 · heliMusicTick:584 · AD_FLYBY_COIN:588 · adFlybyTick:590 · adShopOpen:609
adShopRender:623 · BLOCK_AVATARS:652 · blkGeo:663 · blkMat:664 · blkCyl:665 · blkFaceMat:667
makeBlockFigure:682 · makeBlockCar:722 · blkNameSprite:768 · makeBlockPeer:784 · makeBlockWalkPeer:805 · disposeBlockPeer:813
CAR_GLB_URL:824 · CAR_GLB_LEN:825 · carSplitWheel:829 · carGlbEnsure:856 · carMatGet:875 · carGlbBuild:891
carAvCode:940 · driveCamToggle:947 · SKID_N:966 · skidGeomGet:968 · skidDrop:973 · skidTick:987
blkBuildThumbs:997 · blkBuildPicker:1015 · pickBlockAvatar:1060 · bubbleSprite:1083 · showPeerBubble:1110 · removePeerBubble:1118
concreteTexture:1128 · brokenWindowTexture:1145 · intactGlassTexture:1161 · chargeIconTexture:1179 · rustyDoorTexture:1188 · dAddBox:1202
buildAbandoned:1209 · makeNameSprite:1282 · flatGeom:1295 · flatGeomUV:1304 · buildDriveCity:1314 · HELI_BODY_R:1968
HELI_KPP_CEIL:1969 · heliKppBlocked:1971 · heliKppSpawn:1992 · SKY_IMG:2015 · applySky:2016 · applyTex:2032
HSKY_R:2079 · hskyTex:2081 · buildHauntSky:2086 · tickHauntSky:2216 · buildScene:2234 · randPos:2602
randRoadPos:2610 · randGreenPos:2628 · HOTEL_PER_ROOM:2650 · HOTEL_MIN_GAP:2651 · hotelSpot:2652 · hotelPruneLetters:2687
spawnLetter:2696 · spawnLettersForWord:2742 · ensureCoverage:2744 · DRIVE_LETTER_COPIES:2766 · DRIVE_BONUS_COINS:2767 · ensureDriveAmbience:2768
removeLetter:2781 · spawnLetterAt:2789 · tickLetterRespawns:2797 · LETTER_COIN:2808 · BONUS_COIN_VAL:2809 · pickUpLetter:2810
letterPop:2835 · letterChime:2854 · tryCompleteWords:2874 · completeWord:2888 · spawnMonster:2937 · killMonster:2946
tickMonsters:2954 · damagePlayer:2976 · shoot:2992 · tickShots:3006 · GHOST_GLB_URL:3046 · GHOST_MODEL_H:3047
ghostGlbEnsure:3049 · buildGhostMesh:3075 · makeGhostSprite:3097 · spawnGhost:3115 · applyGhostSize:3140 · faceGhostToPlayer:3151
setGhostVis:3157 · GHOST_MIN_FLOOR:3173 · TORCH_LOCK_S:3174 · BANISH_S:3175 · ghostsAllowed:3177 · hotelCorridorX:3182
torchHitsGhost:3191 · ghostBanish:3198 · ghostGoLurk:3207 · ghostGoStalk:3218 · ghostGoBehind:3231 · tickGhosts:3239
sessionRecapHtml:3337 · hauntRunSec:3344 · fmtSurv:3345 · hauntSurviveFinish:3346 · tickSurvive:3356 · renderHearts:3370
hotelScare:3376 · knockedOut:3396 · BLACKOUT_MS:3418 · FLICKER_MS:3419 · DARK_LETTER:3423 · tintSprite:3424
hotelReset:3427 · setTorch:3451 · toggleTorch:3467 · tickTorch:3472 · hotelBlackout:3482 · hotelFlicker:3498
tickHotelPlayer:3510 · tickHotelWorld:3575 · hotelAct:3618 · openWardrobe:3635 · announceTarget:3658 · netReady:3904
netJoin:3910 · sendPos:3931 · sendChat:3973 · toggleChatBox:3987 · onPeerData:3998 · disposeHeliMesh:4086
removePeer:4091 · netLeave:4106 · tickPeers:4112 · RTC_CFG:4233 · tinvLinked:4234 · partyWord:4241
syncPartyWord:4254 · updateVoiceBtns:4406 · PODIUM_BONUS:4431 · podiumJoin:4433 · podiumLeave:4444 · endRound:4445
showPodium:4456 · tinvCheck:4497 · showBanner:4510 · renderHudTop:4516 · renderHudWords:4521 · renderHudInv:4531
ddTierFromName:4538 · renderBoard:4540 · drawBigMap:4577 · openBigMap:4632 · closeBigMap:4640 · drawMinimap:4645
loadCarDash:4718 · loadCarWheel:4730 · buildDom:4740 · confirmExit:5330 · IS_TOUCH:5349 · HAS_KBD:5351
bindInput:5352 · movePlayer:5447 · tickPlayer:5457 · collideDrone:5490 · propStall:5509 · propBreak:5516
propFix:5523 · droneBatAdd:5530 · lightningBolt:5533 · startRain:5544 · stopRain:5558 · smashGlass:5560
awardGlass:5571 · neededLetter:5588 · openDoor:5603 · raceStartRun:5623 · raceStop:5630 · gateHighlight:5648
renderRaceHud:5655 · tickDrone:5664 · nearMissTick:5807 · showNearMiss:5831 · awardDaredevil:5842 · comboCheer:5859
comboFlash:5875 · driveCell:5884 · nearestStreet:5890 · collideCar:5900 · tlDotY:5931 · tlSet:5935
driveArms:5952 · tlTick:5964 · TL_GREEN:6008 · tlRedDur:6010 · tlightPhase:6011 · buildTrafficLights:6018
rlTick:6070 · cellDrivable:6102 · cellWeight:6105 · cellBlocked:6110 · cellCenter:6111 · posReachable:6113
losClear:6124 · nearestDrivableCell:6135 · routeGrid:6147 · pickGpsTarget:6200 · NAVLINE_W:6223 · NAVLINE_SKIP:6224
navLineEnsure:6225 · navLineHide:6235 · navLineUpdate:6236 · tickGps:6272 · tickDrive:6343 · drawCarDial:6551
drawCarGauges:6581 · RADIO_RECT:6609 · CAR_RADIO_RECT:6611 · carRadioRect:6617 · radioLayout:6619 · radioSetHint:6642
renderRadioList:6648 · radioToggleList:6658 · drawRadioViz:6663 · radioTick:6681 · MIRROR_REAR:6695 · mirrorPass:6697
drawCarMirrors:6709 · BOBBLE_FOOT:6727 · BOBBLE_H:6728 · BOBBLE_ASPECT:6729 · BOB_OMEGA:6732 · BOB_PITCH_FORCE:6734
BOBBLE_SKINS:6736 · bobbleSetAvatar:6743 · bobbleLayout:6750 · bobbleTick:6763 · bobblePoke:6788 · bobbleApplySkin:6805
dollOwned:6815 · openDollPicker:6816 · carStartShow:6853 · showLawInfo:6871 · lawNotice:6893 · driveFineSettle:6903
HELI_PHASES:7082 · heliStartPhase:7089 · heliFloorAt:7096 · SOFT_TIERS:7106 · softLandBonus:7108 · awardPerfLand:7121
setHeliLight:7140 · MAIL_COIN:7159 · mailStart:7161 · mailStop:7184 · mailTick:7185 · FOOT_EYE:7204
doorSlideSfx:7210 · doorLerp:7233 · entLerp:7241 · footStepSfx:7251 · WRING_COIN:7272 · festivalPaint:7276
dustTexture:7288 · dustBurst:7297 · dustTick:7311 · HELI_GLB_URL:7332 · HELI_GLB_TEX_BLUE:7334 · HELI_GLB_ROTOR:7336
HELI_GLB_TROTOR:7337 · heliGlbEnsure:7339 · heliMatBlueGet:7357 · heliGlbAssemble:7370 · heliNavTick:7409 · peerRotorStop:7416
peerRotorTick:7422 · heliCrashSfx:7441 · heliMeshBuild:7469 · heliMeshBuildLegacy:7480 · buildHeliFoot:7610 · footFloorAt:7726
insideTerm:7733 · inDoorZone:7734 · footHint:7738 · setFootBtns:7739 · liftStart:7744 · beginRide:7755
endRide:7778 · beginWing:7789 · awardAirLetter:7802 · paxChoiceShow:7821 · paxChoiceHide:7847 · pilotShipMesh:7851
beginPilot:7852 · endPilot:7884 · drawCabinWindow:7908 · tickHeliFoot:7932 · heliWallPenalty:8143 · tickHeli:8155
CP_NAT:8420 · CP_GAUGES:8421 · SEAT_LABEL:8434 · SEAT_P_FULL:8435 · SEAT_ZOOM:8436 · DASH_OFF_Y:8437
DASH_DROP:8438 · setSeat:8440 · layoutCockpit:8452 · WIPER:8491 · WIPER_SPD:8494 · WIPER_LABEL:8495
INT_GAP:8496 · WASH_MS:8500 · WASH_TANK_MAX:8504 · SMEAR_LIFE:8516 · CHOP_MIN:8517 · SUN_RAY_FAR:8521
sunRayBlocked:8523 · sunShadeTick:8542 · applyCockpitShade:8553 · rotorChop:8565 · sunUpdate:8573 · HELI_FOG_N0:8584
fogUpdate:8588 · adGlowPulse:8636 · RAIN_MAX:8645 · VISOR_Y:8646 · RAIN_MIN:8647 · RAIN_DUR:8648
DROP_ZONE:8652 · addDrop:8653 · tickDrops:8661 · addWashDrop:8679 · washStart:8686 · renderWashGauge:8706
washTick:8717 · grimeTick:8734 · WIPE_R:8741 · wipeDrops:8742 · wiperSndOn:8765 · wiperSndOff:8777
wiperThunk:8783 · washSpraySfx:8795 · wiperSqueak:8812 · wiperSndTick:8829 · setWiper:8849 · tickWiper:8861
SH_SWEEP:8892 · shadowSweepTick:8894 · REFL_MAX:8906 · REFL_COL:8908 · cityGlowLevel:8909 · drawCityGlow:8914
setVisor:8946 · rainTick:8952 · drawBlade:8969 · drawSmears:8988 · drawGlass:9008 · drawBellyCam:9170
drawBellyHud:9193 · drawLandingTargets:9239 · VS_HARD:9309 · drawDescentBar:9310 · heliShake:9359 · cpNeedle:9370
drawGauges:9387 · XF_START:9435 · PRELOAD_WAIT:9436 · ALT_QUIET_FROM:9438 · ALT_MAX_DAMP:9439 · ALT_LP_MIN:9440
ECHO_NEAR:9441 · WIND_FULL_SPD:9442 · SHUTDOWN_SEC:9443 · PAN_MAX:9445 · OD_RPM:9446 · SHAKE_RPM:9447
SHAKE_HIT:9448 · soccerLetterPos:9928 · letterNeeded:9936 · soccerNeededSet:9941 · soccerTileGeo:9947 · soccerGoldTexture:9949
makeSoccerTile:9966 · soccerRefreshSkins:9975 · soccerBuildTargets:9982 · soccerNextTile:9992 · soccerRetarget:10005 · soccerCoinPop:10017
soccerGrassTexture:10030 · soccerTurfGrade:10052 · soccerTurfTexture:10075 · grassNormalTexture:10094 · soccerLinesTexture:10123 · soccerNetTexture:10174
soccerCrowdTexture:10182 · soccerBallMat:10201 · buildSoccerGoal:10221 · buildStands:10240 · soccerLedBoards:10275 · soccerGKEnsure:10372
soccerGKTick:10388 · fkBuildWall:10417 · fkToggle:10432 · fkHitTest:10448 · pkHud:10467 · pkStart:10476
pkEnd:10490 · pkTick:10505 · repQualify:10512 · repEnsureEl:10515 · repStart:10526 · repTick:10533
soccerNumTex:10558 · makeSoccerPlayer:10568 · soccerNewSpot:10595 · soccerResetBall:10607 · soccerKick:10614 · soccerCheer:10632
guideTexture:10635 · auraActive:10659 · auraLeftMs:10660 · buildAura:10662 · auraBuy:10683 · auraRender:10693
auraTick:10707 · buildDrill:10728 · drillTick:10741 · ballFXTex:10781 · buildBallFX:10792 · smokePuff:10808
ballFXTick:10816 · buildLandRing:10861 · buildGuideRibbon:10871 · renderSpinPad:10896 · spinPadToggle:10908 · spinPadPick:10914
renderCurl:10926 · kickLaunch:10937 · updateSoccerGuide:10946 · soccerCamera:11010 · tickSoccer:11031 · soccerKitShow:11223
soccerKitGo:11238 · emojiSprite:11291 · makeAlien:11296 · startWave:11329 · waveSpawnFill:11340 · waveComplete:11349
updateWaveHud:11359 · checkMechaBossBadge:11361 · alienSpawnPos:11370 · removeAlien:11375 · mechaHudWord:11380 · setMechaHudSkin:11388
mechaComboPop:11400 · mechaShielded:11405 · mechaDamageFx:11407 · mechaHitByAlien:11412 · spawnAlienShot:11418 · removeAlienShot:11428
tickAlienShots:11433 · spawnPowerup:11445 · removePowerup:11458 · collectPowerup:11463 · tickPowerups:11470 · updateMechaHud:11479
mechaTracer:11519 · mechaFire:11528 · explodeAlien:11565 · tickMecha:11595 · loop:11651 · grabShot:11685
savePhoto:11696 · clearEntities:11708 · INTRO_KEY:11730 · introSeenObj:11731 · introSeen:11732 · markIntroSeen:11733
INTRO:11734 · INTRO_MODE:11736 · showIntro:11738 · HELI_KPP_BANNER:11764 · closeIntro:11766 · beginPlay:11772
start:11774 · exitWorld:11995 · mechaRecapLine:12064

## js/auth.js (389 บรรทัด · 32 รายการ)
AUTH_PUSH_MS:23 · AUTH_SDK_TIMEOUT_MS:24 · TEACHER_EMAILS:28 · isTeacher:29 · TESTER_EMAILS:42 · TESTER_COINS:43
isTester:44 · testerBoost:48 · authSetStatus:74 · authShowLogin:86 · authGateOffline:90 · authSaveRef:97
authFetchCloud:98 · authWriteCloud:99 · authDeleteCloud:100 · authWriteProfileName:101 · authPushProfile:108 · authApplyProfileName:116
authAskProfileName:132 · authEditProfileName:143 · authStart:154 · updateOfflinePill:184 · authEnterOffline:189 · authLateSync:206
authLoginClick:222 · authOnLogin:241 · authSyncOnLogin:254 · authFreshStart:283 · authAskLink:292 · authEnterGame:342
authPushSave:357 · authLogout:368

## js/award.js (271 บรรทัด · 0 รายการ)

## js/bandadv.js (447 บรรทัด · 28 รายการ)
BAND_ADV_REWARD:9 · bandAdvFailMsg:16 · bandAdvLoad:23 · bandAdvPlay:61 · BAND_ADV_EXAM:76 · bandAdvExamId:81
bandAdvExamName:83 · BAND_ADV_SUPREME_BONUS:90 · bandAdvCheckSupreme:91 · bandAdvExamLock:107 · bandAdvExamBest:116 · bandAdvExamCat:129
bandAdvShowExamSummary:150 · bigExamBadgeNote:178 · BXR_TOP:197 · BXR_READ:198 · bxrKey:202 · bxrSubmit:206
bxrMerge:233 · bxrFetch:249 · bxrRowHTML:270 · bxRankBodyHTML:282 · bxRankMount:297 · bxRankNote:329
bxRankNoteRefresh:338 · openBigExamRank:345 · bandAdvExamOpen:362 · bandAdvCardsHTML:416

## js/cert.js (655 บรรทัด · 32 รายการ)
CERT_MAX:17 · CERT_ISSUER_EN:18 · CERT_MONTHS:19 · CERT_TOPIC_EN:23 · CERT_LEVEL_EN:44 · CERT_ADV_EN:49
CERT_BIG_LV:56 · CERT_STD_EN:59 · certThIndex:67 · certTitleOf:76 · certSerial:102 · certDateEN:110
certTier:118 · CERT_TIER_META:125 · CERT_LOGO_SRC:131 · certAward:140 · certMine:166 · certAwardGold:173
certAwardAdvSupreme:194 · certBackfill:210 · certCatNameById:238 · certFromPost:263 · certXML:281 · certFit:286
certFitMeasured:292 · certHolder:301 · certSVG:311 · certChipHTML:593 · openCertBig:609 · openCertMine:625
certStripHTML:633 · certBindStrip:647

## js/dictband.js (410 บรรทัด · 27 รายการ)
BAND_EMOJI:12 · BAND_SET_REWARD:13 · BAND_DONE_BONUS:14 · bandFailMsg:21 · bandLoad:28 · bandShortTH:60
bandCat:68 · bandSets:90 · bandSetId:99 · bandCheckComplete:102 · bandSetCat:119 · BAND_RETAKE_MAX:131
bandTriedSets:132 · bandRetakeCat:143 · bandShowRetakeSummary:177 · bandSetsPassed:205 · openBandSetPicker:213 · bandMine:285
bandUnlocked:286 · bandLockToast:291 · bandExamLobby:297 · updateBandExamBtn:306 · bandLobbyTick:323 · bandPlay:334
bandSpeakSample:346 · bandPlayLobby:366 · bandCardsHTML:378

## js/examstd.js (942 บรรทัด · 49 รายการ)
XS_PASS_PCT:15 · XS_REWARD:16 · XS_REWARD_AGAIN:17 · XS_TIME_HINT:21 · XS_TIME_FALLBACK:22 · xsLimitSec:23
XS_SCALE:27 · xsScaleText:33 · xsFindSet:44 · examStdLoad:56 · xsFailMsg:91 · xsQuizId:99
xsBest:101 · XS_HIST_MAX:116 · xsHistory:117 · xsHistorySVG:126 · xsIsPractice:158 · xsTimerStop:160
xsElapsed:161 · xsFmt:162 · xsMark:169 · xsSecStats:175 · examStdStart:189 · xsBuildScreen:209
xsTimeUp:281 · xsRender:290 · xsChoose:366 · xsGo:378 · xsQuitAsk:394 · xsClose:402
xsSubmitAsk:408 · xsFinish:423 · xsTimeTableHTML:517 · xsShowReview:541 · openExamStdPicker:607 · XRK_READ:673
XRK_ALL:674 · xrkSubmit:682 · xrkMerge:710 · xrkAllRows:729 · xrkFetch:747 · xrkNote:773
xrkNoteRefresh:784 · xrkAllRowHTML:793 · xrkBodyHTML:797 · xrkMount:812 · openExamStdRank:851 · examStdCardsHTML:868
openExamStdBoard:903

## js/game.js (1,115 บรรทัด · 79 รายการ)
REPLAY_BONUS_EVERY:23 · REPLAY_BONUS_TIERS:25 · replayBonusFor:26 · SESSION_MILESTONES:32 · addSessionCoins:35 · updateBestTarget:74
weekKeyStr:87 · rolloverWeekBest:93 · exitGame:99 · showSessionSummary:135 · sprinkleConfetti:182 · VOCAB_PER_LEVEL:201
VOCAB_RANK_NAMES:202 · vocabRankName:203 · showProgressReport:205 · THUNDER_MS:386 · THUNDER_TIERS:390 · THUNDER_TIER_UI:391
thunderEmoji:392 · DAREDEVIL_TIERS:396 · DAREDEVIL_TIER_UI:397 · daredevilEmoji:398 · GLASS_TIERS:402 · GLASS_TIER_UI:403
glassEmoji:404 · DILIGENT_TIERS:408 · DILIGENT_TIER_UI:409 · diligentEmoji:410 · SOFTLAND_TIERS:414 · SOFTLAND_TIER_UI:415
softLandEmoji:416 · AIRL_TIERS:420 · AIRL_TIER_UI:421 · airLetterEmoji:422 · MECHABOSS_TIERS:426 · MECHABOSS_TIER_UI:427
mechaBossEmoji:428 · TYPIST_TIERS:435 · TYPIST_TIER_UI:436 · typistEmoji:438 · checkTypistBadge:440 · BIGEXAM_TIERS:456
BIGEXAM_TIER_UI:457 · bigExamEmoji:458 · bigExamCertCount:460 · checkBigExamBadge:465 · BFF_TIERS:480 · BFF_TIER_UI:481
BFF_COIN:482 · bffEmoji:483 · badgeSuffix:488 · BADGE_META:505 · NAME_BADGE_RE:522 · splitNameBadges:523
badgeEmojis:529 · badgeScore:534 · BADGE_CATS:541 · bcatLevel:554 · checkCrown:561 · currentBadgeScore:577
rolloverBadgeWeek:581 · addDiligent:594 · celebrateBadge:610 · addThunder:624 · startGame:638 · newRound:678
updateTimerBar:717 · updateComboPill:723 · pickCard:727 · checkMatch:739 · renderCats:853 · fmtMMSS:903
quizTimerStop:907 · quizTimerStart:912 · quizElapsed:922 · startQuiz:926 · renderQuizQuestion:944 · quizNext:1008
finishQuiz:1021

## js/gradelock.js (158 บรรทัด · 14 รายการ)
GRADES:21 · GRADE_LOCK_DAYS:25 · GRADE_LOCK_MS:26 · gradeRank:29 · myGrade:30 · gradeHistList:33
gradeLockLeftMs:43 · gradeLockLeftDays:50 · gradeUnlockAt:51 · gradeLocked:52 · gradeUpOptions:55 · gradeChangeTo:62
gradeLockNote:86 · openGradeChange:94

## js/hotel3d.js (888 บรรทัด · 47 รายการ)
TEX:25 · FLOOR_H:28 · WEST:31 · SHAFT_E:32 · CORE_E:33 · RZ0:34
LZ0:35 · ST_LAND:43 · ST_XW:44 · ST_XE:45 · ST_RUN:46 · ST_RISE:47
ST_STEPS:48 · ST_GAP0:49 · ST_ZMID:50 · ROOM_N:51 · DOOR_W:54 · ENTRY_HW:55
PLAYER_R:56 · floorY:57 · Acc:64 · accBox:65 · accGeo:81 · accMesh:89
makeMats:100 · PORTRAIT_PHOTOS:145 · EYE_R0:154 · PORTRAIT_EYE:155 · PORTRAIT_SKIN:163 · PORTRAIT_CLOTH:164
portraitTexture:165 · signTexture:204 · build:218 · inRect:703 · insideHotel:704 · surfaceY:707
collide:739 · roomAt:759 · floorOf:767 · setLights:772 · BLINK_DUR:785 · BLINK_MIN:786
tick:788 · nearWardrobe:859 · inLift:870 · atLiftDoor:874 · randomHaunt:878

## js/images.js (211 บรรทัด · 23 รายการ)
IMG_FILES:11 · MOODS:12 · startImgKey:14 · petImageKeys:16 · probeImages:28 · probeRankImages:40
probeCollectImages:41 · probeGiftImages:42 · probeHomeImages:43 · CLIP_FILES:52 · CLIP_SM:58 · clipCanWebm:74
CLIP_ASSET_V:85 · clipFileFor:87 · petClipKey:96 · petClipUrl:105 · equippedItem:116 · petStateImg:126
petWearOverlay:147 · wearLayerHTML:168 · happyNow:175 · makeHappy:176 · currentPetImg:189

## js/invasion3d.js (9,957 บรรทัด · 612 รายการ)
### 🗂️ สารบัญโซน js/invasion3d.js (Read/Edit เฉพาะช่วง)
- 16-81 ⚙️ ค่ากติกา (จูนฟีลทั้งหมดที่นี่)
- 82-116 🎯 รอบ 419: ปืนกระบอกที่ 2 — R93 สไนเปอร์ (ตามสเปก Delta Force ที่ผู้ใช้ส่งมา)
- 117-162 🎬 รอบ 422: แอนิเมชันยกปืนเล็ง (ADS) ของ R93 — ตามสเปกที่ผู้ใช้ให้มา
- 163-191 🔍🫁 รอบ 504: "ตัวคูณบวกทับ" ท่าเล็ง — ซูมยิ่งแรงปืนยิ่งแนบตา + ท่าประทับแก้มตอนกลั้นหายใจ
- 192-229 🫁🌑 รอบ 505: สัญญาณรับรู้ลมหายใจตอนส่องกล้อง — เสียงสูด/ผ่อน/สั่น + ขอบจอมืดตามลมที่เหลือ
- 230-259 🔭🫨 รอบ 506: "กำลังขยายมีผลกับความนิ่งของภาพ" — ยิ่งซูมแรงยิ่งสั่นมาก ต้องพึ่งการกลั้นหายใจจริง
- 260-370 🫁💨 รอบ 508: "ลมหมดขณะยังกดกลั้นหายใจอยู่" — ปืนตกวูบแล้วหอบ ก่อนกลับสู่ปกติ
- 371-419 🚫🤖 รอบ 637 (ผู้ใช้สั่ง): ปิดบอทที่ช่วยผู้เล่นยิง — สนามนี้เหลือแต่ "ผู้เล่นจริง" เท่านั้น
- 420-1175 🎨 CSS + DOM overlay (self-contained ไม่แตะ css/style.css)
- 1176-1540 🔊 เสียงสังเคราะห์ Web Audio (ปลอดลิขสิทธิ์ 100%)
- 1541-1705 🚁🔊 เสียงเฮลิคอปเตอร์ Bell 212 — "เหมือนโลก helicopter ทุกประการ" (รอบ 531 — ผู้ใช้สั่ง)
- 1706-1746 🚁🔊🌍 เสียงเฮลิรอบตัว (รอบ 531 — ผู้ใช้สั่ง) — ทุกลำในสนามส่งเสียงใบพัดจริง ดังตามระยะ + ซ้าย/ขวา
- 1747-1809 🖼️ เทกซ์เจอร์วาดเอง (canvas) + ตัวช่วยโหลดภาพจริงถ้ามีไฟล์
- 1810-1857 🌍 สถานะฉาก
- 1858-1917 📦 โหลดโมเดล .glb ถ้ามีไฟล์ (ผู้ใช้เอาของจริงมาใส่แล้ว)
- 1918-2044 🏜️ สร้างฉากทะเลทราย + เมือง
- 2045-2104 🌳 รอบ 580 (ผู้ใช้สั่ง): ต้นไม้จริงจากโมเดล tree.glb ของผู้ใช้
- 2105-2275 🏚️ รอบ 416: ถนนสมรภูมิหน้าจุดเกิด (ผู้ใช้ส่งภาพอ้างอิง Delta Force)
- 2276-2413 🏠 รอบ 431: บ้านหลบซุ่มยิง (โมเดล house_01 ของผู้ใช้) + จุดสูงข่มบนเนินเขา
- 2414-2474 🛸 ยานแม่ลำมหึมา — ทรงลิ่มเหลี่ยมมืด + หนาม + ช่องตัวอักษร (สไตล์ ID4)
- 2475-2541 👾 ยานลูก — 1 ลำต่อ 1 ตัวอักษร (บินเพ่นพ่าน + ปล่อยลำแสงใส่ผู้เล่น)
- 2542-2545 👥 พันธมิตร — หน่วยรบภาคพื้นอาวุธครบมือ + ฝูงเฮลิคอปเตอร์ติดมิสไซล์
- 2546-2650 🪖 รอบ 423: ระบบตัวละครทหารแบบมี "ข้อต่อ" (rig) — รองรับโมเดล .glb ของผู้ใช้
- 2651-3163 🤖 รอบ 424: จับชิ้นส่วนเข้าข้อต่อ "อัตโนมัติจากตำแหน่ง" (ผู้ใช้ไม่ต้องตั้งชื่อ)
- 3164-3309 🚁🅿️ รอบ 434: เฮลิคอปเตอร์จอดในสนามรบ 5 ลำ (โมเดลจริง helicopter.glb — ผู้ใช้สั่ง)
- 3310-3612 🎛️🚁 รอบ 532: ห้องนักบิน "ภาพจริง + เข็มเกจขยับ" (ผู้ใช้สั่ง — เหมือนโลก helicopter ทุกประการ)
- 3613-3637 🔫 อาวุธในมือผู้เล่น (view model ติดกล้อง — เห็นปืนที่ถืออยู่แบบ Delta Force)
- 3638-3744 🎯🔧 TUNE ZONE — ท่าถือปืน (แก้ที่นี่ที่เดียว · 3 บรรทัดล่างนี้เท่านั้น)
- 3745-3800 💪 มือถือปืน มุมมองที่ 1 — รอบ 518 (ผู้ใช้สั่งตรง: เปิดโชว์มือจริง)
- 3801-3938 🧤 รอบ 518: โมเดลมือจริง (GLB จาก Tripo) — ผู้ใช้เจนเอง img/models/hand_grip.glb
- 3939-4087 🔧 รอบ 427: ยืดลำกล้องปืนหลัง export (ผู้ใช้: โมเดล R93 ลำกล้องสั้นไป)
- 4088-4793 🔩 รอบ 447: ชักลูกเลื่อนแบบ SV-98/Delta Force (ผู้ใช้ส่งคลิปอ้างอิงมา)
- 4794-5060 💥 เอฟเฟกต์: ระเบิด · ประกายโดน · ลำแสง · เศษซาก
- 5061-5190 🛡️🔵 รอบ 581 (ผู้ใช้สั่ง): "เกราะยานแม่ที่มองไม่เห็น"
- 5191-5296 🎯📝 รอบ 471: เป้าฝึกยิงในสมรภูมิ (ผู้ใช้สั่ง)
- 5297-5357 🔎 รอบ 473: โจทย์แปลไทย — "ยิงคำที่แปลว่า …"
- 5358-5744 🎯 ระบบยิงของผู้เล่น
- 5745-5758 🎯📡 รอบ 563: เรดาร์ล็อกเป้า + มิสไซล์นำวิถีเข้าเป้าที่ล็อก (ผู้ใช้สั่ง — สไตล์ Ace Combat)
- 5759-5901 🎯🔒 รอบ 564 (ผู้ใช้สั่ง): ล็อกหลายเป้าพร้อมกัน → ยิงมิสไซล์รัวทีละชุด
- 5902-5953 🧭🚀 รอบ 572 (ผู้ใช้สั่ง · ต่อยอดรอบ 569): ลูกศรบอกทิศ "จรวดที่พุ่งเข้าหาเฮลิเรา" บนจอเรดาร์
- 5954-6025 📡⬇️ รอบ 575 (ผู้ใช้สั่ง): เรดาร์ต้องไม่ทับ "แผงสถานะซ้าย" (พลังชีวิต/ความร้อนปืน/ลูกจรวด)
- 6026-6095 ⚔️ ดาเมจ / เงื่อนไขชนะ
- 6096-6186 📖 คำศัพท์ + รอบเล่น
- 6187-6250 🖥️ HUD
- 6251-6386 🕹️ Input — มือถือ (จอย+ปุ่ม) และคอม (WASD + pointer lock)
- 6387-6507 🚶 ผู้เล่น + AI + ลูป
- 6508-6512 🚁 โหมดขับเฮลิคอปเตอร์เอง (รอบ 414 — ผู้ใช้สั่ง)
- 6513-6671 🗺️ รอบ 417: แผนที่เลือกจุดลงสนาม (ผู้ใช้สั่ง) — เข้าเกมแล้วเลือกได้ว่าจะไปเกิดตรงไหน
- 6672-6830 🎖️ รอบ 418: นั่งเฮลิลำเดียวกับเพื่อน — "นักบิน + พลปืนประจำประตู" (ผู้ใช้สั่ง)
- 6831-7192 🔭🚫 รอบ 575 (ผู้ใช้สั่ง): "ซูมปืนค้างไว้ = ขึ้นเฮลิไม่ได้ ต้องเลิกซูมก่อน"
- 7193-7456 🌐 ผู้เล่นออนไลน์ใน map เดียวกัน (รอบ 414) — Firebase /world/invasion
- 7457-7606 🧯👥 กันผู้เล่นล้น — ฝั่งเรนเดอร์ของโลกนี้ (รอบ 637 · ยกส่วนกลางออกไป js/netroom.js รอบ 640)
- 7607-7665 💨 ควันตามหลังมิสไซล์ (รอบ 531 — ผู้ใช้สั่ง) — สไปรต์ควันนุ่มปล่อยเป็นระยะ
- 7666-7833 🔥🌀 รอบ 565 (ผู้ใช้สั่ง): ยานลูก "หลบมิสไซล์ที่ล็อกได้" — ปล่อยแฟลร์ + บิดหนี
- 7834-7912 🔫↩️ รอบ 568 (ผู้ใช้สั่ง): ยานลูกที่ "ถูกเรดาร์ล็อก" ยิงสวนกลับใส่เฮลิผู้เล่น
- 7913-8114 🔥🛡️ รอบ 569 (ผู้ใช้สั่ง): แฟลร์ของ "เฮลิผู้เล่น" + เสียงเตือนตอนถูกล็อก
- 8115-8125 🏃🪖 รอบ 530: หน่วยรบเคลื่อนที่เชิงยุทธวิธี (ผู้ใช้สั่ง: "อย่าปักหลักยืนทื่อ
- 8126-8251 🧘🎯 รอบ 586 (ผู้ใช้ส่งคลิป: "ตัวละครดิ้นไปดิ้นมา ไม่เป็นธรรมชาติ")
- 8252-8427 📣 รอบ 471: ทหารฝ่ายเราตะโกนบอกทิศศัตรู (ผู้ใช้สั่ง)
- 8428-8870 🌙 รอบ 471: โหมดกลางคืน — ฉากมืดสลัว + ท้องฟ้าดาว + ไฟฉายติดปืน
- 8871-9137 🔵💀 รอบ 576 (ผู้ใช้สั่ง): ยานแม่ยิง "ลำแสงสีฟ้า" ลงมาใกล้ตัวผู้เล่น — เตือน 3 ครั้ง ครั้งที่ 4 ตายจริง
- 9138-9188 ⚡👾 รอบ 579 (ผู้ใช้สั่ง): "ทุก 5 นาที สุ่มยานลูก 10 ลำ เร่งความเร็ว 10 เท่า นาน 10 วินาที แล้ววนลูป"
- 9189-9262 🔁 ลูปหลัก
- 9263-9957 ▶️ เข้า/ออกโลก
### รายการ js/invasion3d.js
WORD_COIN:23 · WORD_TIME:25 · WORLD:26 · EYE:27 · FOV:28 · LOOK_SENS:29
PITCH_MIN:30 · MS_Y:52 · MS_FLAT:61 · MS_BELLY:62 · MS_HP:63 · MS_DMG_GUN:64
CORE_Y:70 · F_HP:75 · FIGHTER_SIZE:76 · F_SHOT_GAP:77 · MS_BEAM_GAP:78 · GUN_GAP:81
WEAPONS:88 · SNIPER_SENS:95 · SCOPE_R:99 · SCOPE_MAGS:104 · RIFLE_MAGS:111 · magList:114
curMag:115 · ADS_IN:123 · ADS_POS:124 · ADS_ROT:125 · ADS_SCALE:126 · ADS_BY_GUN:158
adsView:162 · ADS_BOOST:175 · tickAdsBoost:184 · BREATH_FX:202 · tickBreathFx:213 · ADS_BREATH:229
SWAY_MAG:242 · tickSwayMag:251 · GASP:275 · fireGasp:287 · clearGasp:288 · tickGasp:290
gaspMul:301 · gaspPitchNow:303 · applyGasp:309 · REC_BY_GUN:325 · REC_DEFAULT:331 · recCfg:333
BOLT_MS:334 · BREATH_MAX:335 · SPRINT_IN:339 · SPRINT_POS:340 · LAG_GAIN:346 · SWAY:352
PANT_FROM:365 · MIS_MAX:368 · PLAYER_HP:369 · ALLY_BOTS:378 · SQUAD_N:381 · SQUAD_GAP:382
HELI_CHASE_SPD:383 · SQUAD_RUN:384 · HELI_MAX:390 · HELI_ACCEL:394 · HELI_LAND_VY:397 · HELI_CRUISE:400
HELI_SKID:401 · HELI_GUN_MUL:404 · PH_GUN_GAP:405 · PH_MIS_MAX:406 · NET_SEND_MS:409 · CHAT_MS:410
CHAT_PRESETS:411 · PEER_COLORS:412 · TAU:414 · CSS:423 · buildDom:964 · HELI_XF:1555
HELI_OD_AMBER:1556 · CHORUS_RANGE:1712 · resumeAudio:1744 · tryTex:1752 · letterSpriteTex:1763 · sandTex:1774
wallTex:1795 · BULLET_SPD_R93:1821 · loadGlb:1867 · tameGlbMaterials:1897 · fitInto:1909 · HILLS:1924
buildTerrain:1933 · baseLow:1967 · buildTown:1973 · TREE_LOD:2054 · buildTreesGlb:2056 · refreshTreeInstances:2082
tickTreeLod:2100 · STREET_Z0:2110 · instancer:2114 · buildWarStreet:2128 · sandbagWalls:2233 · squadCoverSpots:2241
buildDustMotes:2251 · tickDust:2262 · HOUSE_SIZE:2285 · HOUSE_LOD:2286 · HOUSE_COVER:2287 · HOUSE_CELL:2288
HOUSE_SPOTS:2289 · buildHouses:2295 · buildBlockGrid:2321 · gridBlocked:2357 · houseBlocked:2364 · houseCover:2373
tickHouseLod:2381 · findSniperSpots:2390 · buildMothership:2418 · layoutLetterPanels:2471 · makeFighter:2478 · drawFighterBar:2532
SOLDIER_PARTS:2553 · joint:2567 · buildSoldierRig:2571 · loadSoldierGlb:2614 · applySoldierGlb:2615 · BODY_MAP:2659
mergeMeshList:2671 · faceModelForward:2712 · skinSoldierLimb:2767 · autoRigSoldier:2809 · fitSoldierGround:2941 · poseSoldier:2967
MUZZLE_BY_WEAPON:3088 · FLASH_COLOR:3090 · makeSoldierFlash:3091 · makeSoldier:3098 · makeHeli:3129 · HELI_ROTOR_NODES:3172
HELI_TROTOR_NODES:3173 · HELI_LEN:3174 · HELI_DESERT:3175 · BOARD_DIST:3176 · AUTO_BOARD_DIST:3181 · HELI_COL_SENS:3188
heliPiloting:3189 · START_MS:3190 · START_PHASES:3191 · HELI_PADS:3198 · SEAT_VIEWS:3206 · heliModel:3217
buildHeliPads:3259 · padAt:3268 · movePad:3274 · startPhaseText:3279 · setSeatView:3286 · tickPads:3299
CP_NAT:3320 · CP_GAUGES:3321 · CP_LAMP:3332 · FUEL_MAX:3335 · FUEL_WARN:3336 · ENG_AMB:3338
HOT_FULL:3345 · heliLift:3347 · cpRpmNow:3352 · CP_SEAT_FULL:3353 · CP_ZOOM:3354 · CP_DASH_OFF_Y:3355
CP_DASH_DROP:3356 · CP_RPM_MAX:3360 · CP_SHAKE_RPM:3361 · loadCockpitImg:3366 · layoutInvCockpit:3382 · cpNeedle:3410
cpArc:3427 · cpRoundRect:3433 · tickHeliGauges:3440 · tickHeliHot:3465 · heliLampLv:3482 · ALARM_GAP:3491
ALARM_KEYS:3492 · resetHeliAlarm:3494 · tickHeliAlarm:3495 · cpLamps:3511 · drawInvGauges:3545 · ZERO_DIST:3652
GUN_VIEW:3666 · GUN_POS:3731 · GUN_ROT:3732 · GUN_SCALE:3733 · useGunView:3735 · MUZZLE_Y:3741
buildFist:3754 · buildArms:3774 · HAND_POSE:3811 · makeHandTopMat:3820 · FOREARM:3826 · addForearm:3827
loadHandModel:3835 · applyHandPose:3857 · fitArmsToWeapon:3866 · buildRifleModel:3872 · buildR93Model:3893 · GUN_CUT:3948
GUN_STRETCH:3949 · orientGunModel:3954 · stretchGunBarrel:3980 · mergeGunParts:4038 · forceGunForward:4063 · attachBoltHandle:4095
tickBolt:4123 · tickBarrelHeat:4166 · muzzleSmoke:4175 · alignGunMuzzle:4195 · syncMuzzleAnchor:4231 · buildSelfShadow:4239
SUN_DIR:4252 · tickSelfShadow:4253 · renderViewModel:4268 · vmToWorld:4284 · gunSil:4287 · setGunPose:4312
buildGun:4340 · tickSwap:4426 · applyWeapon:4436 · swapWeapon:4446 · setScoped:4460 · smoothstep:4474
tickSway:4478 · tickAds:4503 · applyRecoil:4624 · applyBreath:4630 · scopeRadius:4643 · scopeRadiusNow:4655
tickRange:4660 · layoutScope:4680 · scopeFovDeg:4730 · renderScopePass:4738 · cycleScopeMag:4766 · renderAmmo:4774
syncWeaponBtns:4785 · fxTex:4803 · fxGlow:4811 · fxFire:4819 · fxRing:4836 · fxDisc:4844
fxStar:4851 · boomFlashLight:4869 · tickBoomLight:4881 · boom:4890 · dustPuff:4956 · sparkAt:4966
tracer:4981 · tickFx:4997 · MSH_PAD:5073 · MSH_COL:5074 · MSH_CORE:5075 · MSH_HINT_GAP:5076
MSH_FX_MAX:5077 · msShieldOn:5079 · msShieldPt:5081 · msShieldRay:5092 · msShieldPow:5107 · shieldBurst:5110
shieldHit:5171 · tickShieldFx:5173 · TRG_COIN:5199 · QUIZ_COIN:5200 · targetTexture:5205 · setTargetWord:5223
targetSpots:5233 · buildTargets:5246 · tickTargets:5275 · quizPool:5303 · newQuiz:5306 · tickQuiz:5312
renderQuiz:5318 · targetWord:5325 · hitTarget:5331 · AIM_OFF:5366 · AIM_BY_GUN:5385 · aimOffNow:5386
adsPosNow:5390 · aimPct:5395 · layoutCross:5397 · aimDir:5400 · fireGun:5408 · ENV_BLOCK_D:5508
solidAt:5509 · envHit:5525 · HOLE_MAX:5584 · holeTexture:5585 · bulletHole:5600 · tickBullets:5611
RECOIL_PAT:5634 · RECOIL_RESET:5635 · addRecoil:5637 · startReload:5651 · tickReload:5659 · launchMissile:5665
misBusyHint:5692 · fireMissile:5696 · tickMisQueue:5732 · RDR_RANGE:5754 · RDR_FIND:5755 · RDR_KEEP:5756
RDR_LOCK_MS:5757 · RDR_BEEP:5758 · RDR_MAX_LOCK:5769 · RDR_ADD_GAP:5770 · SALVO_PER_TGT:5771 · SALVO_PAIR_MS:5772
SALVO_TGT_MS:5773 · LK_NUM:5778 · rdrOn:5779 · resetRadar:5780 · radarPick:5787 · radarHolds:5801
tickRadar:5807 · drawLockBoxes:5837 · drawRadar:5859 · AMK_TRACK:5915 · AMK_DECOY:5916 · AMK_BEEP:5917
amisRel:5919 · drawAMisMarks:5924 · RDR_GAP_TOP:5965 · RDR_GAP_JOY:5966 · RDR_SIZE:5967 · RDR_SIZE_MIN:5968
RDR_SIZE_SIDE:5969 · layoutRadar:5970 · lockTarget:5991 · rayTarget:6001 · raySphere:6018 · damageFighter:6033
dropFighter:6042 · updateArmor:6068 · killMother:6075 · flashScreen:6090 · myUid:6100 · leaderUid:6101
isLeader:6106 · pickWord:6107 · setWord:6120 · adoptWord:6130 · applyShared:6139 · startWave:6154
completeWord:6164 · renderWord:6190 · renderTarget:6200 · tickWordTimer:6211 · renderCoins:6221 · renderHp:6222
renderHeat:6228 · renderMissiles:6234 · toastBan:6244 · bindInput:6254 · moveJoy:6377 · unlockMouse:6385
solidPushOut:6394 · tickPlayer:6409 · hurtPlayer:6489 · MAP_VIEW:6518 · mapToWorld:6519 · worldToMap:6520
zoneName:6521 · buildMapShade:6535 · drawSpawnMap:6554 · safeSpawn:6629 · fitSpawnMap:6639 · openSpawnMap:6650
applySpawnPick:6659 · RIDE_DIST:6682 · RIDE_UP:6683 · RIDE_OFF:6684 · rideableHelis:6685 · findRide:6691
nearestRideable:6692 · ridePos:6702 · setRideView:6714 · boardGunner:6723 · dismountGunner:6742 · tickGunner:6758
updateGunnerBtn:6798 · tickAutoBoard:6814 · heliCount:6826 · zoomBlocksBoard:6844 · enterHeli:6854 · exitHeli:6896
EXT_CAM:6925 · EXT_VIEWS:6946 · EXT_SELF:6961 · EXT_RIDE:6962 · extP:6964 · syncExtBtn:6966
cycleExtView:6972 · resetExtCam:6981 · angDiff:6983 · extCamClear:6988 · extCamera:7007 · seatCamera:7030
tickHeliFlight:7051 · heliCrash:7150 · tickGpws:7160 · syncBotHelis:7182 · netReady:7198 · netJoin:7204
netSend:7215 · peerColor:7237 · NAME_SPR_H:7241 · nameSprite:7242 · bakedSoldierGlb:7258 · loadPeerSoldier:7259
peerRig:7268 · setPeerWeapon:7273 · peerBody:7278 · buildPeer:7307 · onPeer:7320 · dropPeer:7365
netLeave:7372 · peerTick:7377 · renderBoard:7413 · sendChat:7438 · showPeerBubble:7445 · removePeerBubble:7451
PEER_DRAW_MAX:7464 · PEER_DRAW_SLACK:7465 · DRAW_SWAP_MARGIN:7466 · JOIN_TOAST_MAX:7467 · drawnPeers:7470 · drawSlotFree:7471
showPeerAgain:7474 · hidePeer:7481 · tickDrawBudget:7486 · tickCrowdGuard:7496 · resetCrowdGuard:7500 · tickFighters:7502
tickMother:7555 · spawnAlienShot:7578 · tickAlienShots:7590 · smokeTex:7612 · spawnPuff:7623 · spawnSmoke:7633
spawnDust:7635 · tickSmoke:7644 · clearSmoke:7654 · tickHeliDust:7657 · EVA_WARN:7679 · EVA_FLARE_D:7680
EVA_TURN:7681 · EVA_SPIN_MUL:7682 · EVA_SPD_MAX:7683 · EVA_ROLL:7686 · EVA_Y:7687 · FLARE_PODS:7688
FLARE_COOL:7689 · FLARE_N:7690 · FLARE_LIFE:7691 · FLARE_TRAP:7692 · FLARE_CH:7693 · incomingMis:7698
startEvade:7709 · dropFlares:7718 · tickEvade:7746 · clearFlares:7778 · tickMissiles:7779 · CTR_REACT:7848
CTR_WARN:7849 · CTR_GAP:7850 · CTR_BURST:7854 · CTR_BURST_MS:7855 · CTR_SPD:7856 · CTR_DMG:7857
CTR_MAX:7858 · CTR_SPREAD:7859 · CTR_LEAD:7860 · ctrAimPoint:7863 · ctrArming:7870 · counterFire:7874
tickCounter:7879 · SPK_RANGE:7930 · SPK_MS:7931 · SPK_GAP:7932 · SPK_WORLD_GAP:7933 · SPK_BEEP:7934
AMIS_SPD:7935 · AMIS_TURN:7936 · AMIS_DMG:7937 · AMIS_LIFE:7938 · AMIS_MAX:7939 · AMIS_PROX:7940
PH_FLARE_MAX:7941 · PH_FLARE_RE:7942 · PH_FLARE_N:7943 · PH_FLARE_COOL:7944 · PH_FLARE_BACK:7945 · PH_FLARE_DOWN:7946
PH_TRAP:7947 · PH_FLARE_CH:7948 · renderFlareBtn:7951 · dropPlayerFlares:7957 · fireAlienMissile:7989 · clearAMis:8004
resetSpike:8009 · spikeStart:8010 · aMisNear:8012 · tickSpike:8020 · tickAMis:8072 · SQUAD_COVERS:8124
squadCoverPool:8125 · SQ_TURN:8135 · angWrap:8140 · turnTo:8142 · easeLook:8147 · squadTarget:8152
pickSquadDest:8164 · tickSquadMove:8178 · tickSquad:8204 · CALL_DIST:8258 · CALL_NEAR:8259 · CALL_GAP_ALL:8260
CALL_GAP_ONE:8261 · CALL_GAP_DIR:8262 · CALL_MS:8263 · CALL_LINES:8264 · CALL_SECTORS:8275 · bearingKey:8278
clearSquadBubble:8286 · callSprite:8292 · squadShout:8304 · tickSquadCalls:8317 · CHAT_GAP_ALL:8344 · CHAT_LINES:8345
tickSquadChatter:8351 · heliFireAt:8368 · nearestFighterTo:8380 · tickHelis:8386 · DAY:8435 · NIGHT:8437
collectMsMats:8441 · CYCLE_MS:8452 · MODE_ICON:8454 · STORM_MS:8461 · buildStars:8468 · buildStreetLamps:8491
glowTex:8509 · tickStreetLamps:8517 · beamPair:8534 · tickSearchBeams:8545 · buildBarrelFires:8582 · tickBarrels:8600
tickShootingStar:8610 · buildMist:8635 · tickMist:8645 · tickNightSound:8688 · tickSneak:8697 · tickStorm:8708
nvReady:8724 · nvEnter:8725 · nvExit:8731 · tickNvHint:8732 · dropGlowStick:8741 · tickGlowSticks:8758
buildFlashlight:8767 · setNight:8772 · setDayMode:8773 · tickNight:8787 · applyNightLook:8819 · tickFlashlight:8859
MSB_FIRST:8889 · MSB_GAP:8890 · MSB_WARN:8891 · MSB_KILL_WARN:8892 · MSB_NEAR:8893 · MSB_FLEE:8894
MSB_R:8895 · MSB_HOLD:8896 · MSB_MAX:8897 · MSB_DEAD_MS:8898 · MSB_BEEP:8899 · MSB_COVER_R:8902
MSB_PAD_R:8903 · MSB_COVER_RECHECK:8904 · msbEnsure:8909 · msbPlace:8926 · msbBarPos:8935 · msbHide:8942
resetMsBeam:8946 · msbCoverAt:8961 · msbAimBeside:8982 · msbBegin:8988 · msbAim:9005 · msbStrike:9036
msbKill:9075 · msbKickOut:9088 · tickMsBeam:9098 · TURBO_EVERY:9151 · TURBO_MS:9152 · TURBO_MUL:9153
TURBO_N:9154 · TURBO_TRACK:9155 · resetTurbo:9157 · turboPick:9162 · turboBegin:9169 · tickTurbo:9181
fit:9192 · tick:9198 · frame:9206 · build:9266 · start:9331 · exitWorld:9458

## js/lobby.js (52 บรรทัด · 3 รายการ)
PANEL_TITLES:9 · openPanel:19 · closePanel:29

## js/lobby3d.js (780 บรรทัด · 0 รายการ)

## js/main.js (333 บรรทัด · 6 รายการ)
syncMusicBtn:110 · showQuizBackPay:146 · showGiantRefund:191 · showTicketRefund:232 · fitQbp:272 · bootGame:286

## js/moto3d.js (2,670 บรรทัด · 141 รายการ)
### 🗂️ สารบัญโซน js/moto3d.js (Read/Edit เฉพาะช่วง)
- 91-296 🚗🏙️ รอบ 785: ยกการขับจาก "โลกขับรถเมืองกำแพงเพชร" มาทั้งชุด (เฉพาะ vehicle==='car')
- 297-484 DOM เครื่องเกมพกพา (สร้างครั้งเดียว · CSS ฉีดเอง ไม่แตะ style.css)
- 485-514 🚗🏙️ รอบ 785: ห้องคนขับ + ปุ่มบังคับชุดโลกเมือง (โผล่เฉพาะ .car — โหมดมอไซค์ไม่เห็นอะไรเลย)
- 515-738 🪞📷 รอบ 810: กระจกมองหลัง+ข้าง (เฉพาะโหมดรถยนต์ในห้องคนขับ) — ภาพจริงจากกล้อง 3D ตัวที่ 2/3/4
- 739-835 🚗🏙️ รอบ 785: ห้องคนขับ (หน้าปัด/พวงมาลัย/เข็มเกจ) + ปุ่มเกียร์ — เฉพาะโหมดรถยนต์
- 836-864 🪞📷 รอบ 810: กระจกมองหลัง/ข้าง — เรนเดอร์ฉากเดิมซ้ำด้วยกล้องหันหลัง/เฉียงข้าง แล้วยัดลงแถบบนจอ (scissor)
- 865-932 🎵📻 รอบ 810: วิทยุในรถ — จอ head-unit (visualizer + แผงเลือกเพลง) พอร์ตจาก adventure3d.js ทั้งชุด
- 933-1173 ถนนจากแผนที่จริง → geometry + ตารางแฮชชนถนน
- 1174-1513 ฉาก: พื้น/โรงเรียน/ป้ายหมู่บ้าน/ต้นไม้/เมฆ/บ้านหมู่บ้าน
- 1514-1566 🐕 รอบ 312: หมาวิ่งตัดถนน — โผล่ข้างถนนข้างหน้ารถ วิ่งตัดผ่านเร็ว · ชน = ปรับ 100 เหรียญ (รอบ 643: ลดจาก 500)
- 1567-1700 🪙 รอบ 317: เหรียญบนถนน — pool ลอยเหนือเลนซ้าย รีไซเคิลรอบผู้เล่นตลอด
- 1701-1733 🏍️🚗 รอบ 317: โมเดลยานพาหนะ 3D (ใช้ทั้งรถเราเองโหมด car และรถ/มอไซค์ของเพื่อน)
- 1734-1830 🚗 รอบ 394: โมเดลรถจริง img/models/car_01.glb ในแผนที่บ้านโพธิ์สวัสดิ์
- 1831-2021 🧑‍🤝‍🧑 รอบ 317: เพื่อนในแผนที่เดียวกัน (/world/moto/<uid>)
- 2022-2063 🏟️👥 รอบ 640: งบวาดตัวเพื่อน (ใช้ NetRoom.drawBudget ร่วมกับโลกอื่น)
- 2064-2214 คำศัพท์ + ตัวอักษรบนถนน
- 2215-2524 สร้างโลกครั้งเดียว + ลูปเกม
- 2525-2670 เข้า/ออกโลก
### รายการ js/moto3d.js
REWARD:7 · ACCEL:8 · DASH_LEN:9 · DOG_HIT_COIN:10 · FEAT_SP:12 · DECAL_N:13
GRAV:14 · SUSP_K:15 · ROAD_WIDE:16 · EDGE_M:17 · ROAD_TEX_S:18 · POST_N:19
LEAN_MAX:20 · COLLECT_R:21 · SPAWN_MIN:22 · SCATTER_MS:23 · LETTER_COPIES:24 · BUCKET:25
TILE_COLORS:26 · LETTER_COIN:28 · COIN_VAL:32 · COIN_GAP:33 · COIN_SPIN_SPD:35 · COIN_TIERS:38
EMERALD_TIER:45 · HARD_LAND:46 · COIN_CURVE_RAD:47 · NET_SEND_MS:49 · PEER_COLORS:50 · CHAT_MS:52
CHAT_PRESETS:53 · CAR_EYE:102 · CAR_ACCEL:103 · CAR_VMAX:104 · CAR_WB:105 · MIRROR_REAR:115
RADIO_RECT:120 · CAR_RADIO_RECT:121 · carRadioRect:127 · sndKick:235 · ENG_FILES:245 · CSS:300
buildDom:587 · loadCarDash:744 · loadCarWheel:756 · setGear:766 · setCam3:772 · syncGearUi:779
carDial:788 · drawCarGauge:818 · mirrorPass:841 · drawCarMirrors:853 · radioLayout:869 · radioSetHint:893
renderRadioList:899 · radioToggleList:909 · drawRadioViz:914 · segKey:936 · smoothPts:939 · featKey:955
addFeat:956 · genFeatures:961 · terrainAt:980 · roadGroundY:993 · decalTex:1001 · makeDecals:1020
decalTick:1029 · buildRoads:1046 · distToSeg:1142 · roadInfo:1147 · onRoad:1153 · randomRoadPoint:1154
TXT_SPR_H:1179 · makeTextSprite:1180 · letterTexture:1195 · woodTileMat:1210 · muralTexture:1221 · buildSchool:1233
buildScenery:1379 · scatterTrees:1458 · postTick:1478 · scatterClouds:1505 · makeDog:1517 · spawnDog:1532
dogHit:1542 · dogTick:1553 · coinTexture:1571 · makeCoins:1582 · loadCoinImg:1588 · addCoin:1600
clearCoins:1608 · addFreeCoin:1612 · coinTierAt:1620 · coinFx:1630 · grabCoin:1639 · coinTick:1656
scatterCoinTick:1672 · placeSpecialCoin:1690 · makeVehicle:1705 · mCarSplitWheel:1742 · mCarEnsure:1768 · mCarMat:1785
mCarBuild:1798 · mCarCode:1825 · netReady:1837 · netJoin:1843 · netSend:1856 · sendChat:1870
showPeerBubble:1880 · removePeerBubble:1887 · renderBoard:1894 · peerColor:1916 · buildPeer:1920 · onPeer:1944
dropPeer:1987 · netLeave:1994 · peerTick:1999 · PEER_DRAW_MAX:2027 · drawnPeers:2028 · drawSlotFree:2029
showPeerAgain:2030 · hidePeer:2037 · tickDrawBudget:2042 · spawnSlot:2050 · pickWord:2067 · spawnLetters:2077
renderWordHud:2095 · fitWord:2103 · collectTick:2110 · completeWord:2134 · relocTick:2159 · gpsTick:2174
miniTick:2183 · build:2218 · applyVehicleUi:2252 · fit:2281 · tick:2290 · carDrive:2300
frame:2349 · start:2528 · exitWorld:2600

## js/music.js (169 บรรทัด · 0 รายการ)

## js/netroom.js (807 บรรทัด · 19 รายการ)
CFG:41 · roomsAllowed:63 · HOT_KEYS:71 · COLD_KEYS:72 · HOT_BACK:73 · splitPayload:77
mergeBack:88 · metUids:100 · AIM_TTL_MS:119 · aimAt:121 · aimGet:125 · aimClear:129
MAPS3D:135 · whereFriends:136 · dbOf:160 · envReady:161 · isDenied:164 · create:176
drawBudget:780

## js/online.js (1,799 บรรทัด · 96 รายการ)
### 🗂️ สารบัญโซน js/online.js (Read/Edit เฉพาะช่วง)
- 2-203 ENGINE: ระบบออนไลน์จริงผ่าน Firebase Realtime Database
- 204-297 ระบบเพื่อน (ข้อ 0.3): รหัสเพื่อน + ค้นหา + ส่ง/รับคำขอ
- 298-487 ระบบแชทกับเพื่อน (ข้อ 0.4)
- 488-653 ระบบส่งของขวัญ (ข้อ 0.5)
- 654-770 🏪 ตลาดออนไลน์จริง (item 2 backlog): ซื้อ-ขายสินค้าที่เพื่อน "ผลิตเอง" ข้ามผู้เล่น
- 771-835 คำเชิญเล่นโลก 3D ด้วยกัน — /tinv/<toUid>/<fromUid> = {map,n,ts}
- 836-1032 📰 Follow + Feed กิจกรรม (รอบ 155) · 🌍 หน้า Feed ทุกคน + ไลก์/คอมเมนต์ (รอบ 639)
- 1033-1040 🌍 หน้า Feed ทุกคน + ไลก์/คอมเมนต์ (รอบ 639)
- 1041-1213 📰 รอบ 701 — ฟีดล็อบบี้ทีละโพสต์ + รีแอ็กชัน + แจ้งเตือน (ต่อยอดรอบ 639)
- 1214-1799 📞 โทรหาเพื่อน — Voice call / Video call แบบ LINE (รอบ 625 · กลุ่ม 3 คนรอบ 631)
### รายการ js/online.js
ONLINE_STALE_MS:65 · ONLINE_BEAT_MS:66 · LEADERBOARD_SIZE:67 · onlineDisplayName:71 · onlineActivity:79 · ensureOnlineId:95
onlineKey:105 · onlinePushPresence:110 · onlinePushScore:120 · fetchPlayerStats:154 · onlineRerender:176 · notifyFriendBadges:188
FRIEND_ALPHA:214 · friendCode:215 · friendSearch:227 · friendRequest:251 · friendAccept:260 · friendDecline:272
friendsHeal:282 · CHAT_MAX_LEN:306 · CHAT_KEEP:307 · chatPairId:309 · chatRef:312 · chatListen:318
chatSend:334 · chatDeleteMsg:350 · TYPING_TTL:358 · typingRef:360 · chatSetTyping:361 · chatClearTyping:371
chatWatchTyping:379 · chatThemeRef:397 · chatSetTheme:398 · chatWatchTheme:403 · chatPrune:411 · chatSeenTs:428
chatMarkSeen:434 · chatUnreadCount:446 · chatWatchSync:449 · GIFT_EXPIRE_MS:499 · giftSend:502 · greetSend:516
giftAccept:528 · giftDecline:532 · giftInWatch:538 · giftReclaim:569 · giftOutWatchSync:579 · giftOutRebuild:634
salesWatch:664 · salesRerender:672 · sellInc:676 · marketWatch:684 · marketList:717 · marketUnlist:725
marketBuy:734 · marketSoldWatch:747 · tinvSend:776 · tinvClear:783 · tinvPartyTick:791 · TINV_WORLD_LABEL:813
tinvWatch:817 · FEED_MAX:844 · feedEvent:847 · feedPrune:859 · feedPurgeCat:870 · feedPushAssets:881
petDescriptor:899 · feedPushPets:905 · fetchPlayerPets:919 · followSet:935 · followUnset:946 · feedRebuild:953
feedWatchSync:965 · fetchPlayerFeed:992 · fetchPlayerAssets:1005 · fetchFollowers:1024 · GFEED_READ:1050 · GFEED_KEEP_ME:1051
gfeedPush:1054 · gfeedPrune:1068 · gfeedParse:1081 · gfeedWatchStart:1103 · gfeedWatchStop:1130 · gfeedNotifDiff:1138
gfeedNotifPush:1152 · uidDisplayName:1159 · gfeedRebuild:1170 · gfeedToggleLike:1187 · gfeedSetReaction:1192 · gfeedAddComment:1200
CALL_RTC_CFG:1238 · CALL_RING_MS:1239 · CALL_MAX_MS:1240 · CALL_MAX_PEERS:1241 · onlineStart:1657 · onlineLoadSDK:1774

## js/photo.js (361 บรรทัด · 25 รายการ)
PHOTO_LS_KEY:12 · PHOTO_MAX:13 · PHOTO_PREFIX:14 · PHOTO_SIZES:15 · PHOTO_QS:16 · PHOTO_ZMAX:17
photoValid:25 · photoOnline:28 · photoGet:31 · photoHas:32 · photoIsMine:33 · photoOf:36
photoFetch:44 · photoAfterChange:61 · photoPush:65 · photoVerify:83 · photoSaveUrl:93 · photoRemove:99
photoPullMine:106 · photoBlkSrc:122 · photoMiniHTML:129 · openPhotoMenu:137 · photoLoadImgEl:203 · photoLoadFile:211
openPhotoCrop:224

## js/state.js (1,142 บรรทัด · 91 รายการ)
STORAGE_KEY:6 · QUIZ_PASS_REWARD:11 · CURE_COST:13 · HUNGRY_SICK_MS:14 · MEAL_HOUR:16 · MEAL_FULL:17
SLEEP_FROM_HOUR:18 · SLEEP_SICK_HOUR:19 · WAKE_HOUR:20 · DINNER_COST:21 · TOXIN_FULL:23 · DETOX_COST:24
FOODQUIZ_Q:26 · FOODQUIZ_COIN:27 · FOODQUIZ_BONUS:28 · FOODQUIZ_MAX_PLAYS:29 · SHAPE_JUNK_MEALS:31 · SHAPE_CLEAN_MEALS:32
SHAPE_MISS_MEALS:33 · SHAPE_EXP_BONUS:34 · HEAT_SICK_MS:35 · THIRST_SICK_MS:36 · DEFAULT_STATE:38 · FEED_CATS:196
FEED_REACTIONS:210 · feedRx:218 · FEED_QUICK_CM:220 · SLOT_MS:232 · currentSlotStart:233 · nextSlotStart:239
mealDayKey:241 · nightKeyOf:243 · isNightNow:251 · newPet:256 · loadState:280 · saveState:566
activePet:573 · petStage:574 · isAdult:579 · abilityOn:580 · hasPetType:581 · todayStr:584
dailyTick:588 · addCoins:591 · QUEST_POOL:611 · QUEST_PER_DAY:620 · questsToday:621 · questTick:628
questEvent:632 · assetValue:668 · netWorth:688 · assetCount:690 · refreshRank:707 · heatProtected:723
rainProtected:727 · petHungry:730 · petShapeOf:734 · updatePetShape:740 · shapeMealDone:747 · heatPct:757
ymStr:766 · billOutstanding:770 · UTILITIES:777 · HOME_UTILITIES:783 · homeDecayed:785 · billTick:788
PET_FOOD_PER_PET:860 · petFoodTick:861 · myCar:887 · carLoanDue:892 · carLoanOverdue:897 · carLoanPayable:902
carLoanPay:909 · compTick:922 · ONLINE_RATE:936 · onlineEarnActive:937 · onlineEarnTick:941 · onlineEarnFlush:952
marketTick:962 · addCraft:986 · ORDER_MAX:1005 · ORDER_LIFE_MS:1006 · ORDER_GAP_MIN_MS:1007 · ORDER_GAP_SPAN_MS:1008
ORDER_TIER_WEIGHT:1009 · newOrder:1010 · orderTick:1023 · careTick:1031 · expNeed:1113 · addExp:1118
addRP:1138

## js/tpaward.js (41 บรรทัด · 0 รายการ)

## js/typing.js (369 บรรทัด · 0 รายการ)

## js/ui.js (8,524 บรรทัด · 346 รายการ)
### 🗂️ สารบัญโซน js/ui.js (Read/Edit เฉพาะช่วง)
- 2-77 UI: Dashboard / ร้านค้า / ที่พัก / ร้านสัตว์เลี้ยง / แรงค์ / สถิติ
- 78-308 🎬 เวทีน้องน่ารัก (Cute Pet Show) — รอบ 604 (ผู้ใช้สั่ง 26 ก.ค. 2026)
- 309-603 🆕 New Word (รอบ 116): คำศัพท์ใหม่ 1 คำ/การ login ตามระดับชั้น
- 604-627 นาฬิกาใต้ชื่อผู้เล่น (วัน · วันที่ · เวลา อัปเดตทุกวินาที)
- 628-680 ข้าวเย็นของผู้เล่น (คิว 7725691507 ข้อ 6)
- 681-712 แถบฝนประจำวัน: นับถอยหลังถึง 19:00 ทุกวัน (ฝนตก 1 ชม.)
- 713-757 เอฟเฟกต์ฝนเต็มจอ (รอบยี่สิบ): ฝนตกจริง (19:00-20:00) + ไม่มีบ้านสภาพดี
- 758-778 การ์ด "คนที่กำลังทำการบ้านไปพร้อมๆ กับเรา"
- 779-833 รอบ 149: กล่อง aside ขวาเลื่อนวนอัตโนมัติ (ล่าง→บน) ไม่มี scrollbar
- 834-1225 Daily Quest (item 3): การ์ดภารกิจวันนี้ใน aside ขวา
- 1226-1318 รอบ 153: เมนูลัดแตะแถวเพื่อนออนไลน์ในกล่อง aside
- 1319-1849 การ์ด Leaderboard — สลับแท็บในการ์ดเดียว (ประหยัดพื้นที่):
- 1850-2214 การ์ดข้อมูลผู้เล่น 👤 — คลิกชื่อในการ์ดเพื่อน/กระดาน แล้วโชว์
- 2215-2465 แผงเพื่อน 👥 (ข้อ 0.3): รหัสเพื่อน + ค้นหา + คำขอ + รายชื่อเพื่อน
- 2466-2561 🌍 เพื่อนอยู่โลก 3D ไหน + ปุ่ม "ตามเข้าไป" (รอบ 642)
- 2562-2600 แชทกับเพื่อน (ข้อ 0.4) — กล่องแชทลอยกลางจอ + แผง emoji
- 2601-3002 รอบ 179: หน้ารวมข้อความ (inbox แบบ Messenger — ธีมกระจกฟ้า sci-fi ของเกม)
- 3003-3349 ระบบส่งของขวัญ (ข้อ 0.5) — ห้องของขวัญ + กล่องเลือกส่ง + ฉากเปิด
- 3350-3442 RANK CARD + ฉากเลื่อนแรงค์
- 3443-3445 PET DASHBOARD
- 3446-3514 📰 รอบ 155: overlay ข้อมูลน้อง & การดูแล + ฟีดกิจกรรมเพื่อน
- 3515-3918 📰 รอบ 701 — ฟีดล็อบบี้ "ทีละโพสต์" แบบ Facebook (ผู้ใช้สั่ง 29 ก.ค. 2026)
- 3919-4078 🌍 รอบ 639: หน้า Feed เต็มจอ — ทุกคน (ไม่ใช่แค่ follow) + ไลก์/คอมเมนต์
- 4079-4730 📖 Dictionary ค้นหาคำศัพท์ (รอบ 254 ผู้ใช้สั่ง 16 ก.ค. 2026)
- 4731-4774 การนอน (คิว 7725691507 ข้อ 1)
- 4775-5156 ให้อาหาร (ระบบมื้อเย็น 18:00 + ความอิ่มสะสม — ข้อ 2+3)
- 5157-5275 🛡️ ควิซอาหารปลอดภัย (ต่อยอดข้อ 5.1)
- 5276-5361 🎀 ห้องแต่งตัวสัตว์เลี้ยง (รอบ 635: แยกออกจาก "ร้านค้า" เดิม —
- 5362-5549 ที่พัก (หลบแดด/หลบฝน) + เครื่องปรับอากาศ
- 5550-5667 บิลสาธารณูปโภค (ค่าไฟ/ค่าน้ำ — เครื่องยนต์อยู่ใน state.js: UTILITIES/billTick)
- 5668-5750 การ์ดมือถือ (ข้อ 7): ซื้อ 10,000 ขายคืน 6,000
- 5751-5761 การ์ดคอมพิวเตอร์ (ข้อ 11): ซื้อ 50,000 ขายคืน 30,000
- 5762-5806 item 8: โบนัสออนไลน์ +0.01 เหรียญ/วิ ฟรีทุกคนที่เปิดเกมออนไลน์อยู่
- 5807-6350 💻 รอบ 706 (ผู้ใช้สั่ง 29 ก.ค. 2026): ช่องรายได้คอมพิวเตอร์บนแถบบนล็อบบี้
- 6351-6450 🌍 ปุ่มลัดเข้าโลก 3D ในรางเมนูซ้าย (ผู้ใช้สั่ง 9 ก.ค. 2026)
- 6451-6615 🧭 ป้ายบอกทางของรางเมนูซ้าย (รอบ 601 · ผู้ใช้สั่ง 26 ก.ค. 2026)
- 6616-6785 การ์ดสวนผลไม้ (ข้อ 12): ซื้อต้นไม้ปลูกได้ไม่จำกัด แต่ละต้นออกผล
- 6786-6795 โรงงานผลิตสินค้า 🏭 + ตลาดขายต่อ (แนวคิดใหม่ 5 ก.ค. 2026)
- 6796-6818 โรงงานผลิต (แผง 🏭) — แยกออกจากตลาด (ผู้ใช้สั่ง 6 ก.ค. 2026)
- 6819-6969 ตลาดขายสินค้า (แผง 🏪) — แยกออกจากโรงงาน
- 6970-7881 🚗 รอบ 131: หมวดยานพาหนะ — โชว์รูมรถ 10 คัน (แคตตาล็อก 5 ช่อง/แถว)
- 7882-7942 ร้านสัตว์เลี้ยง (ซื้อเพิ่มได้ ไม่ลบตัวเดิม)
- 7943-7979 เลเวลอัพ (รายตัว)
- 7980-8085 สถิติผลการเรียนรู้
- 8086-8123 item 4: การ์ดสรุปส่งครู — ใบเดียวจบ ชื่อ/วัน-เวลา/เหรียญวันนี้/แรงค์/สอบล่าสุด
- 8124-8524 📞 หน้าจอโทรหาเพื่อน — สายเสียง (รอบ 625 · กลุ่ม 3 คน + ปิดวิดีโอ รอบ 631)
### รายการ js/ui.js
startHTML:10 · PET_ANIM:30 · petAnimHTML:35 · petVisualHTML:50 · PET_SHOW:91 · PET_SHOW_STAGE:96
PET_SHOW_H:99 · petShowBgHTML:102 · petClipHint:145 · __clipReady:157 · petShowHTML:165 · PROF_AV_MAX:229
lobbyBlk:230 · caretakerFigureHTML:237 · footAlign:247 · heroRankBgHTML:281 · NEW_WORD_MS:315 · newWordNext:321
renderNewWord:332 · NW_GAP:370 · alignNewWord:371 · startNewWordTimer:388 · nwCountdownTick:405 · PAT_REMIND_HOUR:421
patRemindTick:422 · applyPatRemindGlow:443 · NEW_WORD_COIN:458 · NW_DAILY_GOAL:459 · NW_DAILY_BONUS:460 · newWordReward:461
nwDailyTick:484 · coinFlyFx:503 · nwDailyBarHTML:536 · showNewWordPopup:547 · renamePet:574 · mealLabel:591
fmtMins:598 · renderClock:607 · dinnerDue:633 · renderDinnerChip:638 · dinnerClick:649 · renderRainBar:684
rainFxTick:717 · RAIN_DROP_IMGS:734 · rainFxDrop:735 · selfPronoun:765 · selfTag:770 · idTag:774
SIDE_SCROLL_SPEED:784 · SIDE_SCROLL_RESUME:785 · initSideScroll:788 · sideScrollTick:816 · QUEST_FLASH_HOLD:840 · QUEST_SLIDE_MS:847
QUEST_RESUME_MS:848 · questGo:851 · SIDE_TALL_MIN:863 · sideIsTall:864 · qBigCardHTML:869 · qDeckGo:889
qDeckTick:909 · renderQuestCard:930 · sideFlashRows:990 · FRIEND_FLASH_GRACE:1008 · ONLINE_FLIP_MS:1016 · ONLINE_FLIP_RESUME:1017
ONLINE_SWIPE_STEP:1018 · ONLINE_ROW_H:1025 · onPerPage:1028 · onChunk:1034 · ONLINE_GAP_MAX:1044 · onPageSpread:1045
onPageDraw:1054 · onPageFlip:1065 · bindOnlinePager:1076 · renderOnlineCard:1111 · bindInviteCards:1233 · bindFriendQuickMenu:1253
openFriendQuickMenu:1263 · LB_TABS:1326 · LB_WS_TOP:1327 · LB_TP_TOP:1328 · bindLbTabs:1330 · updateRankRailBadge:1359
rankUpCheck:1378 · rankUpSound:1406 · renderLeaderboardCard:1417 · bindLbGroupOpen:1444 · lbRankRows:1456 · LB_BCAT_TOP:1497
lbBadgeSections:1502 · lbDemoRows:1527 · lbChar:1549 · lbfAwardBarHtml:1559 · openLeaderboardFull:1571 · BLK_PAD:1699
BLK_PAD_NEW:1704 · BLK_TOP_FIX:1705 · seatPodChars:1706 · lbCoinHtml:1718 · lbBadgeHtml:1734 · lbBossHtml:1760
lbWordSearchHtml:1783 · lbTypingHtml:1819 · bindPlayerClicks:1855 · showPlayerCard:1865 · petDescImg:2144 · openImgLightbox:2157
openPetPeek:2177 · updateBillBadges:2221 · setBadge:2231 · tinvPendingCount:2247 · updateSettingsBadge:2256 · openAttentionSummary:2271
updateFriendBadge:2329 · renderFriendPanel:2339 · friendDoSearch:2387 · refreshFriendData:2411 · FRW_TTL_MS:2476 · FRW_MIN_GAP:2477
frwWorldOf:2481 · frwPanelOpen:2484 · frwScan:2489 · frwPaint:2511 · frwPaintHint:2532 · frwFollow:2546
CHAT_EMOJI_CATS:2567 · CHAT_THEMES:2589 · CHAT_SECRET_MS:2598 · chatBadgeSync:2606 · ibTimeStr:2614 · IB_CALL_RE:2623
ibCallInfo:2624 · openChatInbox:2629 · chatFitKeyboard:2799 · openChat:2815 · giftImg:3006 · giftDateStr:3008
GREETS:3016 · GREET_EXP:3024 · greetInfo:3025 · openGreetPicker:3029 · giftItemPic:3071 · giftItemName:3079
updateGiftBadge:3085 · renderGiftPanel:3094 · acceptGift:3152 · declineGift:3175 · showGreetReveal:3184 · showGiftReveal:3211
openGiftPicker:3237 · confirmSendGift:3305 · doSendGift:3329 · rankBadgeHTML:3353 · renderRankCard:3358 · renderRankTab:3392
showRankUp:3420 · bindPetPlateButtons:3455 · openPetInfoOverlay:3484 · feedAgo:3507 · FEED_DECK_MAX:3527 · FEED_SLIDE_MS:3528
FEED_RESUME_MS:3529 · feedPostImgIndex:3534 · feedPostImg:3545 · feedPostByKey:3554 · feedCanReact:3557 · fpStatsHTML:3562
fpNameBadgesHTML:3578 · fpostHTML:3582 · renderFeedCard:3617 · feedDeckGo:3655 · feedDeckTick:3675 · renderFeedBell:3697
feedNotifArrived:3705 · openFeedNotif:3712 · closeRxPicker:3746 · openRxPicker:3750 · feedFlyWord:3770 · feedPickRx:3781
openFeedComments:3794 · closeFeedComments:3808 · renderFeedComments:3814 · bindFeedPostEvents:3873 · openFeedBoard:3925 · renderFeedBoardLive:3946
renderFeedBoard:3964 · stageColLeft:3983 · alignPetTabs:3992 · alignFeedPlate:4004 · alignProfilePlate:4015 · alignStageLeft:4031
alignStageCols:4042 · watchStageCols:4056 · alignCureBtn:4066 · dictRecordLookup:4090 · DICT_FILE_COUNT:4101 · loadDict:4102
dictSearch:4117 · dictTapWords:4132 · dictEntryHTML:4136 · openDictOverlay:4147 · renderDashboard:4231 · sleepBtnHTML:4736
sleepHintHTML:4743 · sleepAllPets:4754 · wakeAllPets:4767 · feedPet:4778 · openFoodMenu:4792 · feedWith:4863
AVATAR_UI:4893 · playerAvatarHTML:4897 · SHAPE_UI:4905 · showFeedResult:4914 · curePet:4955 · heartsFx:4978
PAT_HOLD_MS:5001 · PAT_EXP:5002 · bindPetTap:5003 · petBounce:5021 · petMood:5027 · shortPatPet:5034
longPatPet:5042 · patCalendarHTML:5062 · patStreakTick:5090 · cureCelebrateFx:5116 · railCureClick:5127 · detoxPet:5139
openFoodQuiz:5162 · closeDressUpBoard:5281 · openDressUpBoard:5285 · renderShop:5302 · homeVisualHTML:5365 · showHomeRuined:5379
showCutNotice:5400 · renderHomeCard:5418 · payMaint:5502 · trashBillUI:5518 · payTrash:5535 · UTILITY_UI:5554
utilityBillUI:5603 · payUtility:5628 · buyUtilityFix:5654 · renderPhoneCard:5672 · buyPhone:5712 · sellPhone:5734
compLiveTotal:5755 · onlineLiveTotal:5766 · syncCoinHeader:5773 · flashPillGain:5778 · renderOnlineEarnPill:5787 · renderCompEarnPill:5812
openPillInfo:5845 · renderComputerCard:5928 · buyComputer:5963 · sellComputer:5986 · soldCount:6007 · soldBadge:6008
loadScriptOnce:6014 · loadAdv3d:6031 · enterAdventure3D:6039 · pickAdvMap:6064 · enterHaunted3D:6099 · enterHeli3D:6121
pickHeliMap:6147 · enterDrone3D:6183 · enterDrive3D:6202 · pickDriveMap:6237 · enterMotoMapAsCar:6273 · enterSoccer3D:6292
enterMoto3D:6311 · enterInvasion3D:6332 · WORLD3D:6357 · gotoRobotShop:6368 · openHealDialog:6374 · railWorldClick:6391
openWorldEntryDialog:6414 · railScrollHint:6456 · railScrollTop:6464 · initRailScroll:6469 · renderRailWorlds:6489 · tinvNoticeHTML:6569
openTinvPicker:6577 · fruitCountdown:6621 · renderFarmCard:6633 · renderFarmClock:6708 · buyFruit:6724 · sellFruit:6744
sellAllFruit:6765 · collectImg:6794 · renderFactoryCard:6800 · renderMarketCard:6823 · updateWishBadge:6879 · openWishlistDialog:6890
bindStripArrows:6935 · renderMarketBrowse:6947 · carImg:6976 · renderVehicleShop:6977 · CS_CYCLE_MS:7028 · carInteriorImg:7029
carStatHtml:7031 · renderCarShowroom:7038 · csShowBig:7065 · csInit:7092 · RS_CYCLE_MS:7115 · robotImg:7116
renderRobotShop:7117 · rsShowBig:7139 · rsInit:7160 · buyRobot:7179 · enterMecha3D:7201 · pickMechaRobot:7222
pickDriveCar:7254 · openCarBuyDialog:7297 · buyCarInsurance:7358 · payCarLoanMonthly:7377 · payCarLoanFull:7389 · carDriveBlock:7408
gotoVehicleShop:7413 · gotoMyStock:7418 · showNeedCarDialog:7424 · craftDiscount:7436 · renderFactory:7439 · renderOrdersUI:7508
startProduce:7527 · buyCollectible:7555 · cancelProduce:7583 · deliverOrder:7597 · renderOrderClock:7614 · renderCollectMine:7624
openListDialog:7666 · cancelListing:7719 · buyMarketItem:7742 · showCollectReveal:7769 · buyAC:7807 · openHomeShop:7826
renderPetShop:7885 · showLevelUp:7946 · renderStats:7983 · showTeacherCard:8090 · CALL_REACT_EMOS:8134 · CALL_TALK_MIN:8137
CALL_TALK_HOLD:8138 · CALL_ORDER_GAP:8140 · CALL_TONES:8146 · startCall:8520

## js/util.js (1,043 บรรทัด · 45 รายการ)
shuffle:6 · fmtNum:15 · escapeHTML:19 · gradeSymbol:32 · gradeMark:47 · nameWithGrade:55
gradeMarkCanvas:61 · gradeOf:77 · seededRand:92 · fmtThaiDT:102 · fmtThaiDate:106 · showScreen:111
TOAST_WARN_RE:121 · restackToasts:124 · toast:146 · floatFx:166 · beep:177 · soundStatus:198
PET_MOOD:269 · petVoiceSynth:276 · sirenSynth:353 · playCashier:377 · cashierSynth:391 · keyTapSynth:424
playSpark:465 · sparkSynth:479 · thunderFx:514 · wordAudioFile:582 · speakCutOff:591 · speakWord:595
speakLetter:619 · pickSpeakVoice:642 · speakWordTTS:653 · askNameDialog:673 · askConfirm:718 · alertBox:736
applyNoAnim:756 · BLK_VOCAB:763 · openSettings:811 · openHelp:952 · openTeacherGuide:978 · TAPGLOW_SEL:1002
TOUCH_INPUT_SEEN:1021 · mouseLockOK:1030 · lockMouse3D:1036

## js/vocabbook.js (207 บรรทัด · 14 รายการ)
VB_MAX:11 · VB_QUIZ_N:12 · VB_QUIZ_MIN:13 · vbGroup:16 · VB_GROUP_UI:21 · vbRecord:24
vbSeen:49 · vbStats:62 · vbList:70 · vbReviewCat:81 · vbStartReview:95 · openVocabBook:106
vbRender:148 · vbCardHTML:194

## js/wordsearch.js (414 บรรทัด · 0 รายการ)

## js/wsaward.js (32 บรรทัด · 0 รายการ)

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

## css/lobby.css (4,839 บรรทัด · 725 selector)
:root:6 · html:15 · body:16 · *:33,34,35,36 · #app:39 · h1:41
.subtitle:42 · .shop-title:43 · #rotate-overlay:46 · .screen:68 · #screen-select:77,78,79,80(+5) · .egg-need:87
.petshop-topright:89 · .petshop-play-link:90,95 · #screen-game:137,138,139,140(+7) · #screen-quiz:151,152,153,154(+6) · #quiz-choices:163,164 · .word-card:171
.quiz-choice:172,173,174 · .big-btn:177,178,179,180 · #screen-dashboard:185,1070,1078 · .lobby-top:192,825,826,827(+27) · .top-flex:193 · .profile-plate:194,198,746,3452(+12)
#rain-fx:203 · .rain-layer:206,212 · .rain-glass:219 · .glass-drop:220 · .rail-btn:235,838,844,845(+16) · .rail-badge:236
.fr-code-box:241 · .fr-code-label:245 · .fr-code-row:246 · .fr-code:247 · .fr-copy-btn:252,256,261,262 · .fr-search-btn:257
.fr-add-btn:258 · .fr-accept:259 · .fr-decline:260 · #fr-search-input:263 · #fr-search-result:267 · .fr-found:268
.fr-hint:272 · .fr-list-title:273 · .fr-row:274 · .fr-req:278 · .fr-row-name:280,284,4619 · .fr-row-status:288
.fr-req-btns:289 · .online-dot:290 · .fr-chat-btn:291,296,298 · .fr-unread:299 · .fr-call-btn:305,311 · .chat-overlay:320,326,327
.chat-box:328,631,638,645(+12) · .chat-head:340 · .chat-theme-btn:345,349 · .chat-secret-tg:350,351 · .cs-switch:352,353,358,359 · .cs-slider:354,356
.chat-secret-note:360 · .chat-theme-strip:363 · .chat-theme-sw:365,368,369,370(+1) · .chat-head-name:372,375 · .chat-head-ava:374 · .chat-close:376
.chat-msgs:380 · .chat-empty:384 · .chat-typing:386 · .ct-dots:388,389,391,392 · .no-anim:394,407,468,482(+55) · .chat-bubble:395,400,405
.chat-emoji:408 · .chat-emo:412,416 · .chat-input-row:417 · .chat-emoji-btn:421 · #chat-input:425 · .chat-send:429,434,435
.chat-call-btn:441,445 · .call-ring:448 · .cr-card:452 · .cr-kind:458 · .cr-av:459 · .cr-name:469
.cr-id:470 · .cr-btns:471 · .cr-btn:472,478,483 · .cr-no:479 · .cr-ok:480 · .cr-safe:484
.call-ov:487,493,515,532(+6) · .call-stage:499 · .ctile:500,511,512 · .ct-face:504 · .ct-me:510 · .ct-nm:525,529
.ct-sub:530 · .call-add:554 · .ca-head:561 · .ca-list:562 · .ca-row:563,567 · .ca-dot:568,569
.ca-nm:570,571 · .ca-go:572 · .ca-empty:573 · .ca-safe:574 · .ca-close:575 · .call-bar:579
.cb-btn:584,589,590 · .cb-end:591,592 · .call-emos:593 · .call-emo:598,599 · .call-fx:601 · .call-fx-emo:602
.pl-click:694,696,697 · .pl-overlay:698 · .pl-card:702,2590 · .pl-close:708 · .pl-head:712,2448,2451 · .pl-grade:717,4625,4626
.pl-body:718 · .pl-loading:719 · .pl-none:720 · .pl-me-tag:721 · .pl-blk-wrap:723 · .pl-blk:724
.pl-stat:725 · .pl-lbl:730 · .pl-val:731,732 · .pl-tip:733 · .chip-edit:739,744,745 · .rank-mini:751,757,758,759
.pass-photo:761,766 · .pet-tabs:768 · .dict-box:769,773,774,775(+1) · .dict-card:781,786,790,791(+2) · .dict-head:787,788 · .dict-trail:795,799
.dt-c:800,804,805 · .dt-sep:806 · .dict-today:807 · .di-w:809,810,811 · .dict-list:812 · .dict-item:813,817,818,819(+5)
.lobby-mid:833 · .rail-wrap:836,861,865,866(+3) · .lobby-rail:837 · .rail-nudge:868,876,877,880(+1) · .rail-worlds:887 · .rail-div:888
.lobby-stage:930,932,948,1075(+13) · .newword-banner:938,945,950,4004(+2) · .coin-fly:961,964 · .coin-plus:970 · .nw-pop-coin:985,987,988 · .nw-pop-goal:991,992,996,1000
.nw-goal-head:993,995,997 · .nw-goal-bar:998 · .nw-goal-fill:999 · .nw-pop-book:1001,1002 · .nw-tag:1023,4010,4032 · .nw-word:1028,4014,4037,4126
.nw-hint:1030,1031,4015,4039(+1) · .nw-coin:1033,1036,4016,4020 · .nw-countdown:1041,4021 · .nw-bar:1043,4040 · .nw-bar-fill:1045 · .pet-stage:1048,2884
.nw-box:1055,2893 · .nw-pop-word:1056 · .nw-speak:1057 · .nw-pop-phon:1058 · .nw-ipa:1059 · .nw-pop-sent:1060
.nw-pop-mean:1061 · .pet-tab:1062,1063,1064,3258 · .stage-hero:1085,1100,1108,1253(+22) · .hero-ground:1122,1242,1248 · .hero-rank-bg:1124,1127,1130,1134(+18) · #lobby3d-canvas:1147,1148
.hero-scene:1152,1154,1161,1162(+8) · .caretaker-fig:1201 · .caretaker-img:1204 · .caretaker-emoji:1206 · .blk-rig:1213,1214,1215 · .stage-plate:1275,1283,1294,1295(+23)
.plate-title:1289 · .lobby-side:1322,1358,1363,1366(+22) · .side-sec:1325,2160,3154,3430 · .side-label:1326,1331 · .side-label-row:1334,1335 · .lb-tabs-out:1336,1337,1341
.side-glass:1345,1352 · .side-card:1364,1475 · #quest-card:1376,1377,1405,1406(+6) · .q-bigcard:1382,1411 · .qb-top:1384 · .qb-emoji:1385
.qb-name:1387 · .qb-bar:1388,1389 · .qb-row:1391 · .qb-prog:1392 · .qb-reward:1393 · .qb-go:1394,1398
.q-dots:1399 · .q-dot:1400,1401,1402 · .q-bonus:1403 · .inv-card:1422,1424,1425 · .inv-btns:1426 · .inv-go:1427,1429
.inv-x:1430 · #online-card:1434,3162,3163,3164(+4) · .fq-overlay:1435 · .fq-box:1437,2968 · .fq-head:1441,1443 · .fq-close:1444
.fq-sec:1446 · .fq-worlds:1447 · .fq-world:1448,1450 · .fq-acts:1451 · .fq-act:1452,1455,1456 · .lb-prize:1489
.lb-coins:1492 · .lbf-cell:1493,2517,2520,2521(+3) · .lb-award-bar:1495,1501,1502 · .lb-award-go:1503 · .lbf-award:1505,1511,1512,1513 · .pod-pz:1514
.wsa-overlay:1517 · .wsa-box:1519 · .wsa-head:1524 · .wsa-title:1525 · .wsa-when:1526,1527 · .wsa-close:1528,1531
.wsa-cols:1532 · .wsa-col:1533 · .wsa-sec-h:1534,1535 · .wsa-msg:1536 · .wsa-msg-h:1539 · .wsa-msg-b:1540,1541
.wsa-msg-none:1542 · .wsa-rules:1544,1545 · .wsa-list:1546 · .wsa-row:1547,1549 · .wsa-r:1550 · .wsa-n:1551
.wsa-s:1552 · .wsa-p:1553 · .wsa-prizes:1554 · .wsa-pz:1555,1558 · .wsa-reveal-medal:1559 · .lobby-bottom:1574,1577,1578,1580(+7)
.lobby-quiz-btn:1591 · .lobby-book-btn:1592,1593 · .lobby-foodquiz-btn:1594,1595 · .lobby-play-btn:1596,1600 · .lobby-exam-btn:1602,1603,1605 · .panel-overlay:1610,1615,4141,4142(+8)
.panel-box:1616 · .panel-head:1623,1627 · .panel-close:1628,1633 · .panel-body:1634,1638,1639 · .panel-page:1636,1637 · .collect-sub:1643
.mkt-empty:1644 · .craft-box:1645 · .mkt-listing:1646 · .mkt-filter:1647,1991 · .hq-grid:1654 · .hq-card:1655,1660,1684
.hq-head:1661 · .hq-pic:1667,1669 · .hq-emoji:1671 · .hq-badge:1672 · .hq-stars:1676 · .hq-price:1677,1682,1683,1686(+6)
.craft-credit:1690,1692,1693 · .car-grid:1700,1702,1703 · .robot-weap:1704 · .dmap-box:1707,1708 · .dmap-grid:1714 · .dmap-card:1716,1719,1720,1721(+2)
.dmap-ico:1723 · .dmap-new:1726 · .dcp-grid:1728 · .dcp-card:1730,1733,1734,1735(+10) · .levelup-box:1752,2847,2848,2965 · .dcp-box:1755,1756,1760,1761(+6)
.dcp-lock:1769 · .sold-badge:1773,1775,1776 · .rs-showroom:1778,4577,4578 · .rs-list:1779,1781,4558,4561 · .rs-thumb:1782,1784,1785,1786(+1) · .rs-thumb-pic:1787,1788
.rs-thumb-price:1789 · .rs-stage:1791 · .rs-big:1794 · .rs-big-img:1795 · .rs-elec:1799,1803,1808 · .rs-edge:1809,1815
.rs-info:1818,1819,1820,1821(+1) · .rs-buy:1823,1825,1826 · .cs-showroom:1830,4550,4551,4579(+3) · .cs-list:1831,1833,4552,4557(+9) · .cs-thumb:1834,1836,1837,1838(+1) · .cs-thumb-pic:1839,1840
.cs-thumb-name:1841 · .cs-thumb-price:1842 · .cs-thumb-own:1843 · .cs-stage:1845 · .cs-big:1848 · .cs-big-img:1849
.cs-elec:1853,1857,1861 · .cs-edge:1862,1868 · .cs-interior:1871 · .cs-inr-label:1872,1873 · .cs-inr-img:1874 · .cs-info:1876,1877,1878,1879(+6)
.cs-buy:1887,1889,1890,1891 · .car-emoji:1893 · .car-mine:1899 · .car-mine-pic:1904 · .car-mine-info:1905 · .car-loan:1906,1907
.car-mine-btns:1908,1909,1910 · .car-locked:1912 · .car-mine-head:1914 · .car-pick-list:1915,1916 · .car-pick:1917,1919,1920 · .car-pick-pic:1921,1922
.car-pick-name:1923,1924 · .car-pick-od:1925 · .car-buy-box:1927,2972 · .cb-pic:1928,1929,1930 · .cb-lines:1931 · .cb-li:1932,1936,1937
.cb-ins:1938,1942,1943 · .cb-plan:1944 · .cb-pl:1945,1950,1952,1956(+1) · .cb-total:1963 · .cb-btns:1964,1969 · .cb-x:1965
.shop-grid:1972 · .shop-item:1973,1978,1983,1984(+3) · .mkt-tab:1992,1993 · .pg-btn:1994,1995,1996 · .pg-dot:1997 · .fr-gift-btn:2020,2025
.gift-sec-title:2028 · .gift-in-row:2030 · .gift-out-row:2034 · .gift-in-pic:2035,2037,2038 · .gift-in-info:2039,2040 · .gift-in-btns:2041
.gift-accept:2042,2046,2048 · .gift-decline:2047 · .gift-box-card:2049 · .gift-box-from:2050,2051 · .gift-note:2052 · .gift-pick-overlay:2055
.gift-pick-box:2059 · .gift-pick-head:2065,2069 · .gift-pick-close:2070 · .gift-pick-tabs:2072 · .gp-tab:2073,2077 · .gift-pick-body:2078
.gp-chips:2079 · .gp-chip:2080,2084 · .gp-card:2085,2086 · .gp-price:2087 · .gp-note:2088 · .gift-cf-pic:2089
.chat-emoji-cats:2094 · .chat-emoji-cat:2098,2102,2103 · .chat-emoji-wrap:2104,2105 · .stage-left:2114,4132 · .pet-info-btn:2118,2125,2126 · .feed-list:2133,2137,2162,2163(+1)
.feed-empty:2138,2141 · .fd-tools:2147 · .feed-bell:2148,2150,2151,2152 · .fd-prog:2156,2157 · .fpost:2164,2729 · .fp-head:2169
.fp-who:2170 · .fp-name-line:2173 · .fp-name:2174 · .fp-when:2175 · .fp-badges:2177,2180 · .fp-badge-ic:2178
.fp-text:2182 · .fp-media:2185 · .fp-img:2187 · .fp-cap:2189 · .fp-big:2190 · .fp-sum:2192,2194
.fp-sum-rx:2195 · .fp-sum-none:2196 · .fp-en:2197 · .fp-bar:2199 · .fp-act:2200,2204,2206 · .fp-like:2205
.fp-page:2217,2218,2219,2220(+3) · .fp-rxbox:2223 · .fp-rxb:2227,2229,2230,2231(+1) · .fp-rxb-off:2233 · .fp-fly:2235,2238,2239 · .fcm-overlay:2242
.fcm-box:2244 · .fcm-post:2248,2249 · .fcm-rxs:2250 · .fcm-rx:2251 · .fcm-list:2252,2254 · .fcm-row:2255,2256,2257
.fcm-none:2258 · .fcm-quick:2260,2262 · .fcm-q:2263,2266,2267 · .fcm-add:2268 · .fcm-input:2269,2271 · .fcm-send:2272,2274
.fcm-locked:2275 · .fnt-overlay:2277 · .fnt-box:2279 · .fnt-list:2283,2285 · .fnt-row:2286,2288 · .fnt-ico:2289
.fnt-tx:2290,2291 · .fnt-sub:2292 · .feed-plate:2294 · .feed-all-btn:2295,2300 · .fdb-overlay:2305 · .fdb-box:2307
.fdb-head:2311 · .fdb-close:2315,2317 · .fdb-live:2318 · .fdb-live-title:2319 · .fdb-live-rows:2321,2323,2324 · .fdb-live-row:2325,2327,2328,2329
.fdb-dot:2330 · .fdb-list:2332,2333 · .fdb-empty:2334 · .fdb-row:2335 · .fdb-row-top:2337 · .fdb-ico:2338
.fdb-txt:2339 · .fdb-name:2340 · .fdb-ago:2341 · .fdb-actions:2342 · .fdb-like:2343,2346,2347,2348 · .fdb-cm-list:2349
.fdb-cm-row:2350,2352 · .fdb-cm-empty:2353 · .fdb-cm-add:2354 · .fdb-cm-input:2355,2357 · .fdb-cm-send:2358,2360 · .fdb-cm-locked:2361
.pi-overlay:2364 · .pi-box:2368,2373,2374,2378(+3) · .pi-close:2380,2385,2386 · .pi-close-left:2388 · .pi-portrait:2390 · .pet-wear:2397,2400,2402
.pi-portrait-wrap:2405,2407 · .pi-dress-btn:2415,2419,2420 · .pi-shape-cap:2421,2424,2425,2426 · .pi-shape-toggle-btn:2428,2431 · .pi-dress-pip:2433,2438,2439,2440(+1) · .pi-wear-note:2443,2445
.greet-card:2452 · .greet-sub:2453 · .greet-grid:2454 · .greet-opt:2455,2458,2459,2460 · .greet-e:2461 · .pi-streak:2465
.pi-streak-head:2467,2469 · .pi-streak-best:2470 · .pi-dots:2471 · .pi-dot:2473,2474,2475 · .pi-streak-note:2476 · .pi-care-title:2477
.lbf-overlay:2480 · .lbf-box:2483,2497,2498,2499(+10) · .lbf-head:2488 · .lbf-title:2489 · .lbf-tabs:2490,2493 · .lbf-note:2496
.lbf-close:2512 · .lbf-close-l:2513 · .lbf-body:2514 · .lbf-grid:2515 · .lbf-bcat-wrap:2530,2532 · .lbf-bcat:2533
.lbf-bcat-head:2534,2535,2536 · .lbf-bcat-badge:2541,2544 · .lbcat-ic:2542 · .lbcat-ic-label:2545 · .lbf-bcat-rows:2546 · .lbf-bcat-row:2547,2549,2550,2552
.lbf-podium:2556 · .pod:2558,2585,2586 · .pod-char:2560 · .pod-base:2562 · .pod-rank:2564 · .pod-label:2566,4621
.pod-name:2568 · .pod-sc:2570 · .pod-1:2575,2576 · .pod-2:2577,2578 · .pod-3:2579,2580 · .pod-4:2581,2582
.pod-5:2583,2584 · .pl-wide:2603,2606,2607,2608(+8) · .pl-follow:2609,2614,2616 · .pl-unfollow:2618,2624,2625 · .pl-followers:2626 · .pl-cols:2627,2632,2633,2634
.pl-col:2628 · .pl-sec-title:2629 · .pl-badges-col:2635 · .pl-feed:2636,2639,2646 · .pl-feed-row:2640,2644,2645 · .pl-assets-wrap:2648,4458,4533
.pl-assets:2649,4461,4466,4472(+4) · .pl-asset:2652,2656,2663 · .pl-asset-emoji:2657 · .pl-asset-n:2658 · .pl-pets-wrap:2665 · .pl-pets:2666
.pl-pet:2667,2672,2674 · .pl-pet-nm:2675 · .img-lightbox:2678,2683,2684,2688(+3) · .cert-svg:2707 · .cert-tap:2708,2713 · .cert-chip-sm:2716
.pl-sec-sub:2736 · .pl-certs:2737,2739 · .cert-mini:2740,2744,2746 · .cert-mini-cap:2747 · .cert-none:2749 · .lv-cert-row:2751,2753
.lv-cert-btn:2754,2759 · .cert-lightbox:2761,2766,2767,2771(+3) · .pl-chat:2791,2796 · .pl-call:2798,2804 · .pet-peek:2805,2806 · .pp-chips:2808
.pp-chip:2809 · .pp-gift:2814,2820 · .settings-box:2822,2823,2897,2902(+27) · .set-feed-head:2824 · .set-feed-sub:2828 · .set-feed-row:2829
.pillinfo-val:2834 · .pillinfo-desc:2839,2858 · .pillinfo-box:2850 · .plf-head:2853 · .plf-emoji:2854 · .plf-ht:2855,2856,2857
.plf-foot:2859,2861,2862 · .alert-box:2867,2869 · .ab-emoji:2870 · .ab-title:2871 · .ab-desc:2872 · .ab-btns:2873,2874,2875
.heal-heart:2877 · .attn-box:2892 · .help-box:2943,2944,2945 · .wl-box:2966 · .food-box:2967 · .home-shop-box:2969
.summary-box:2970 · .report-box:2971 · .wl-grid:2974 · .tc-wrap:2976 · .spell-btn:2982,2987 · .sp-hud:2988
.sp-word:2990 · .sp-ch:2991,2996 · .sp-th:2998 · .sp-hint:3000 · .sp-exit:3003,3007 · .sp-banner:3008
.sp-big:3013 · .sp-thb:3015 · .sp-coin:3016 · #spell-confetti:3021 · .sp-rb:3022 · .sp-day:3032
.sp-perfect:3034 · .sp-late:3036 · #spell-coinpop:3039 · .side-sub:3148,3150 · .sec-quest:3155 · .on-page:3166,3167,3168,3169
.inbox-overlay:3179 · .ib-box:3181 · .ib-head:3185 · .ib-close:3189,3191 · .ib-list:3192,3193 · .ib-row:3194,3195,3196,3197
.ib-ava:3198,3203,3204 · .ib-on:3205 · .ib-mid:3207 · .ib-name:3208 · .ib-last:3209 · .ib-meta:3210
.ib-time:3211 · .ib-dot:3213 · .ib-story-badge:3216 · .ib-empty:3220 · .ib-story:3222,3224 · .ib-story-item:3225,3227,3234
.ib-story-ava:3228 · .ib-story-on:3232 · .ib-world:3237,3240 · .ib-tabs:3242 · .ib-tab:3243,3246,3248 · .ib-tab-dot:3249
.ib-call-ava:3253 · .ib-call-row:3254,3255 · #btn-music:3261,3264,3265 · #ws-overlay:3280 · #ws-board:3283,3289,3291 · .ws-head:3294
.ws-title:3295 · .ws-findbar:3298 · .ws-tip:3299 · .ws-grade:3301,3302 · .ws-body:3305 · .ws-gridwrap:3306
#ws-grid:3309 · .ws-cell:3314,3319,3322,3325(+2) · .ws-flash:3331,3333 · .ws-coinpop:3337,3361 · .ws-combo:3348,3352,3353,3354 · .ws-find:3365
#ws-prog:3366 · #ws-words:3370,3374 · .ws-word:3376,3381,3382,3383(+2) · .ws-actions:3389,3390,3399 · .ws-sizes:3394 · .ws-sizes-lb:3396
.ws-size-now:3397 · #ws-new:3400 · #ws-stash:3401 · #ws-clear:3402 · #ws-win:3403,3405 · .ws-win-in:3406,3409
.sec-online:3432 · .rank-tab:3460,3461,3462,3463(+2) · .pet-show-bg:3493,3496,3500,3504(+19) · .ps-night-fx:3596,3598,3610,3615(+1) · .pet-show:3625,3628,3640,3642(+22) · .ps-video:3761
.ps-worn-pip:3839,3840 · .id-card:3863,3870,3874 · .id-chip:3887 · .clock-chip:3896,3897 · .coin-block:3913 · .coin-group:3914
.coin-pill:3944,3945,3966 · .cp-lb:3969 · .cp-v:3970 · .nw-sub:4038 · .top-flex2:4129 · #panel-factory:4148,4149,4153,4154(+39)
#panel-rank:4289,4290,4296,4301(+11) · .grid2x8:4372,4378 · .grid1x5:4388,4394 · .pl-badges-strip:4400 · .pl-badge-card:4404,4410 · .pl-badge-card-ic:4411,4415
.pl-badge-card-nm:4416 · .pl-badges-empty:4422,4424 · .mine-strip:4438,4440,4441,4446(+4) · .mb-strip:4452,4491 · .gmark:4599,4603,4604,4605(+1) · .gm-stack:4608,4612
.gm-row:4614 · .lb-name:4616,4617,4618 · .grade-edit:4639,4644,4645 · .gradelock-box:4649,4665,4670,4672 · .gl-head:4650 · .gl-emoji:4651
.gl-ht:4652 · .gl-cur:4653 · .gl-lock:4654,4659 · .gl-ok:4658 · .gl-lock-sub:4660 · .gl-why:4661
.gl-pick-lb:4662 · .gl-opts:4663 · .gl-hist:4673 · .gl-hline:4674 · .gl-hg:4678 · .gl-hat:4679
.gl-harr:4680 · .gl-foot:4681 · .gl-cf:4682 · .reg-gradelock:4704 · #tp-overlay:4714 · #tp-board:4716,4720
.tp-head:4724 · .tp-title:4725 · .tp-stat:4727,4729 · .tp-pts:4731,4734 · .tp-close:4736,4742,4743 · .tp-snd:4746,4749,4755,4756
.tp-snd-ic:4750 · .tp-snd-track:4751 · .tp-snd-thumb:4753 · .tp-prompt:4760 · .tp-word:4762,4776,4777 · .tp-ch:4764,4769,4770,4772
.tp-thai:4780 · .tp-hint:4782 · .tp-empty:4784 · .tp-keys:4787 · .tp-row:4789 · .tp-row-fn:4791,4824
.tp-key:4795,4807,4809,4815(+2) · .tp-key-fn:4822 · .tp-fx:4828 · .tp-coinpop:4829 · .tp-pop-pt:4834

## css/style.css (2,086 บรรทัด · 536 selector)
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
.pet-wrap:639 · .pet-emoji:640 · .pet-img:641 · .egg-img:642 · .feed-pet:643,789 · .pet-baby:644
.pet-adult:645 · .pet-egg-stage:647 · .wear:649 · .wear-head:650 · .wear-face:651 · .wear-neck:652
.pet-name:654 · .stage-label:655 · .level-row:656 · .level-badge:657 · .exp-bar:661 · .exp-fill:662
.exp-text:663 · .ability-box:665,669 · .hunger-bar:672 · .hunger-fill:673,674,675 · .food-item:681,723,727,728(+6) · .hunger-text:685
.heat-bar:688 · .heat-fill:689 · .heat-text:690,691,692 · .care-row:694 · .care-btn:695,699,702 · .btn-feed:700
.btn-cure:701 · .sick-banner:703 · .pet-sick:707 · .pet-asleep:710 · .sleep-badge:711 · .btn-sleep:713
.dinner-btn:716 · .food-box:720,721 · .food-grid:722 · .fav-tag:742 · .fd-exp:746 · .food-sec:748
.food-sec-human:752 · .bad-tag:754 · .fd-toxin:758 · .fd-safe:759 · .fq-box:762,763 · .fq-progress:764
.fq-pair:765,766 · .fq-ask:767 · .fq-why:768 · .fq-btns:772,773,777 · .fq-yes:778 · .fq-no:779
.fq-next:780 · .food-cancel:781 · .feed-box:787,788 · .feed-gain:790 · .sick-badge:794 · .big-btn:800,806,1042,1043(+6)
.shop-card:809 · .shop-title:813 · .shop-grid:814 · .shop-item:815,819,820,821(+4) · .it-tag:826 · .tag-wear:827
.lock-banner:829 · .home-current:835,840,841 · .home-img:842 · .home-emoji:843 · .home-btn:844,866 · .home-layout:846
.home-pic-col:847,853 · .home-img-big:851 · .home-info-col:854,856,859,860 · .home-name-row:857 · .home-desc-row:858 · .home-shop-box:868,869
.home-list:870 · .home-option:871,875,876,877(+1) · .home-opt-img:878 · .home-opt-body:880,881 · .home-price:882 · .reset-link:887
.login-card:893 · .login-pets:894 · .login-status:895 · .google-btn:896,902,903 · .login-note:904 · .install-btn:907,913,914
.install-guide-overlay:917 · .install-guide:921,925,928 · .install-steps:926,927 · .install-guide-close:929 · .login-account:934 · .register-card:937,941,959,963
.reg-safety:943,945,946 · .reg-privacy:948,950,951 · #screen-register:953,954,955,956(+2) · .student-chip:964 · .clock-chip:968 · .online-count:974
.online-row:981,985,986,1005 · .online-dot:990 · .online-name:995 · .online-act:999 · .online-ava:1004 · .online-live:1006
.online-note:1010 · .lb-empty:1013 · .lb-list:1014 · .lb-row:1015,1019,1020 · .lb-rank:1024 · .lb-name:1026,1030
.lb-coins:1034 · .lb-hint:1036 · .lb-badgeline:1037 · .lb-tabs:1039 · .lb-tab:1040,1041 · .tinv-note:1052
.cat-card:1058,1103,1106,1254(+1) · .cat-head:1062 · .cat-emoji:1063 · .cat-name:1064 · .cat-pass:1065 · .cat-info:1066
.cat-btns:1067 · .cat-btn:1068,1072,1073,1074(+3) · .cats-back-bottom:1077 · .tapglow:1082,1083,1091 · .lobby-bottom:1090 · .band-sec-head:1101,1102
.bax-box:1110,1112 · .bax-head:1113 · .bax-sub:1114,1115 · .bax-row:1116 · .bax-lv:1117,1120,1121,1122(+3) · .bax-emoji:1123
.bax-name:1124 · .bax-q:1125 · .bax-need:1127 · .bax-rw:1128 · .bax-foot:1132 · .bax-rank:1133,1136
.bxr-box:1139,1141 · .bxr-head:1142 · .bxr-sub:1143 · .bxr-body:1144 · .bxr-pick:1145 · .bxr-cats:1146
.bxr-chip:1147,1149,1150,1151(+1) · .bxr-list:1154 · .bxr-row:1155,1157,1159,1163 · .bxr-rk:1158 · .bxr-nm:1160,1161 · .bxr-sc:1162
.bxr-tm:1164 · .bxr-more:1165 · .bxr-none:1166 · .bxr-foot:1168 · .band-mine-tag:1169 · .bsp-box:1172,1175
.bsp-head:1176 · .bsp-prog:1177 · .bsp-retake:1179,1182 · .bsp-info:1184,1186 · .rts-box:1189 · .rts-head:1191
.rts-sets:1192 · .rts-set:1193,1194,1195 · .rts-sub:1196 · .rts-words:1197 · .rts-word:1198,1200,1201 · .rts-foot:1202
.rts-okbtn:1203,1205 · .bsp-grid:1206 · .bsp-chip:1207,1210,1211,1212(+1) · .bsp-num:1214 · .bsp-best:1215 · .bsp-tick:1216
.bsp-foot:1217 · .vb-box:1220,1222 · .xsp-box:1225 · .vb-head:1226 · .vb-total:1227 · .vb-quizbtn:1228,1230
.vb-tabs:1231 · .vb-tab:1232,1234,1235 · .vb-words:1236 · .vb-word:1237,1240,1241,1242(+3) · .vb-empty:1246 · .vb-foot:1247
.vb-pg:1248,1250 · #vb-pginfo:1251 · .vb-hint:1252 · .band-lock:1260 · .offline-btn:1261,1262 · .quiz-progress:1267
.quiz-phon:1268 · #quiz-extra:1269,1271,1272,1273 · .quiz-word-card:1274 · .quiz-next:1280,1286,1287,1288(+1) · .quiz-choice:1291,1296,1297,1298 · .quiz-score-pill:1299
.quiz-time-pill:1301,1303 · .stats-card:1306 · .stats-title:1310,1759 · .stats-row:1311,1312,1313,1314 · .stat-badge-line:1316,1319 · .stat-badge-ic:1317
.game-top:1322 · .back-btn:1323 · .combo-pill:1327 · .timer-wrap:1331 · .timer-fill:1332,1333 · .board-label:1335
.card-grid:1336 · .word-card:1337,1343,1344,1345(+3) · .hint-btn:1351,1356 · .game-endless-note:1359,1364,1366,1370(+6) · .report-btn:1391,1396 · .report-box:1399
.report-close:1400 · .rp-head:1404 · .rp-avatar:1405,1406 · .rp-title:1407 · .rp-sub:1408 · .rp-levelcard:1410
.rp-level-top:1414 · .rp-bar:1415 · .rp-bar-fill:1416 · .rp-level-note:1417,1418 · .rp-grid:1420 · .rp-stat:1421
.rp-ic:1424 · .rp-num:1425 · .rp-lbl:1426 · .rp-section:1428 · .rp-h3:1429 · .rp-badge-mini:1430
.rp-row:1431,1432,1433 · .rp-empty:1434 · .rp-badges:1435 · .rp-badge:1436 · .rp-tline:1439 · .rp-tl-head:1440,1441
.rp-tl-ems:1442 · .rp-em:1443,1444 · .rp-tl-note:1445,1446 · .rp-crown:1448,1449 · .rp-wtitle:1451 · .rp-wnow:1452,1453
.rp-wgraph:1454 · .rp-wcol:1455 · .rp-wval:1456 · .rp-wbar:1457,1458 · .rp-wlbl:1459 · .rp-cheer:1461
.report-ok:1465 · .summary-box:1468,1523,1527,1528(+2) · .sm-burst:1469 · .sm-title:1471 · .sm-line:1472 · .sm-coin:1473
.sm-matches:1479,1480 · .confetti:1482 · .sm-badge:1489 · .sm-badge-all:1493 · .badge-celebrate-overlay:1496,1513 · .badge-celebrate:1502
.bc-emoji:1508,1510 · .bc-emoji-img:1509 · .bc-title:1511 · .bc-sub:1512 · .sm-cheer:1517 · .sm-streak:1518,1519
.sm-sick:1520 · .sm-btns:1521 · .float-fx:1533 · .toast:1540 · .toast-warn:1547,1554,1555,1561 · .toast-clear-all:1563,1570
.alert-box:1572 · .alert-ok:1573,1578 · .settings-box:1580 · .set-row:1581 · .set-hint:1585 · .set-hint-on:1586
.set-hint-off:1587 · .set-lwrap:1588 · .set-label:1589 · .set-desc:1590 · .set-switch:1591,1595,1596,1601(+4) · .set-sw-knob:1597
.set-sw-txt:1604 · .set-close:1610,1615 · .set-help:1616,1621 · .help-box:1623,1624,1629 · .help-item:1625 · .update-banner:1637,1646,1647
#update-reload:1648 · #update-dismiss:1652 · .levelup-overlay:1658,1664,1665 · .levelup-box:1666,1673,1674,1675(+4) · .bill-box:1681,1685,1686 · .tag-off:1687
.home-decayed-img:1688 · .home-dark-img:1689 · .thirst-fill:1690 · .thirst-text:1691,1692 · .toxin-fill:1695 · .toxin-text:1696,1697
.detox-btn:1698,1703 · .shape-text:1706,1707,1708,1709(+1) · .avatar-pick:1713 · .avatar-opt:1714,1718,1719,1720 · .avatar-chip-img:1724 · .mini-av:1726
.fp-ava:1727 · .avatar-chip-blk:1729 · .set-avatar-btns:1730 · .avatar-mini:1731,1735 · .set-blk-row:1737 · .set-sub2:1738
.blk-grid:1740 · .blk-mini:1741,1744,1745,1746 · .game-avatar:1749,1750,1751 · .stats-nick:1760 · .ticket-owned:1763,1767 · .collect-sub:1772
.mkt-tabs:1773 · .mkt-tab:1774,1778 · .mkt-filter:1779 · .mkt-row:1783 · .mkt-emoji:1787,1788 · .mkt-info:1789,1790
.mkt-tier-stars:1791 · .mkt-buy:1792,1797,1798 · .mkt-price-lo:1799 · .mkt-price-hi:1800 · .mkt-empty:1801 · .collect-grid:1804
.collect-cell:1805 · .cc-emoji:1806,1807 · .cc-name:1808 · .cc-count:1809 · .cc-list-btn:1810,1814 · .mkt-listhead:1815
.mkt-group-head:1817,1823 · .mkt-two-col:1825,1826,1830,1842(+8) · #phone-card:1831,1847 · #computer-card:1832,1848 · #ticket-card:1834 · #haunt-card:1835
#heli-card:1836 · #drone-card:1837 · #drive-card:1838 · #soccer-card:1839 · #moto-card:1840 · #invasion-card:1841
.mkt-listing:1869 · .ml-cancel:1873 · .mkt-sold:1879,1880,1881 · .list-dialog:1888,1889,1894 · .list-hint:1893 · .collect-reveal-frame:1897,1904
.collect-reveal-img:1903 · .collect-reveal-stars:1905 · .craft-box:1908 · .craft-head:1909 · .craft-bar:1910 · .craft-fill:1911
.craft-text:1912 · .craft-btn-row:1913,1914 · .craft-go-btn:1916,1922,1923,1926 · .craft-cancel:1934,1938 · .mkt-catalog:1941,1942,1943 · .mkt-pager:1946
.pg-btn:1947,1951,1952 · .pg-mid:1953 · .pg-dots:1954 · .pg-dot:1955,1956 · .order-head:1957 · .order-row:1958,1963,1965,1967
.order-deliver:1968,1973 · .order-need:1974 · .avatar-chip-photo:1980 · .pass-photo:1981 · .pl-photo:1982 · .pp-cam:1987,1995
.set-photo-row:1998,2004 · .ph-thumb:2005 · .ph-plus:2006 · .photo-box:2012,2013,2034,2038(+4) · .ph-now:2014 · .ph-now-img:2015,2019
.ph-now-cap:2020 · .ph-warn:2021 · .ph-sync:2026,2029 · .ph-sync-wait:2030 · .ph-sync-ok:2031 · .ph-sync-bad:2032
.ph-btns:2033 · .ph-tip:2043 · .ph-stage:2045,2049 · .ph-cv:2050 · .ph-ring:2051,2056 · .ph-zoom:2060
.ph-foot:2061 · .ph-crop-box:2062
