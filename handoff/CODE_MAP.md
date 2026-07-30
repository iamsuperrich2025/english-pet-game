# CODE_MAP.md — แผนที่โค้ด:บรรทัด (เจนอัตโนมัติโดย `tools/gen_code_map.py` — **ห้ามแก้มือ** เดี๋ยวโดนเขียนทับ)

> วิธีใช้: หาชื่อฟังก์ชัน/ค่าคงที่/selector ในไฟล์นี้ (Grep หรือกวาดตา) → `Read` ไฟล์จริง `offset=<บรรทัด>` `limit=40`
> 🗂️ ไฟล์อ้วนมี **สารบัญโซน** (`st-end ชื่อโซน`) — งานทั้งระบบ/โลก 3D: Grep ชื่อโซน → Read/Edit เฉพาะช่วงนั้น **ห้ามอ่านทั้งไฟล์** · เพิ่มระบบใหม่ในไฟล์อ้วนต้องครอบ banner `/* ==== */`+ชื่อโซน (สารบัญเจนเอง)
> css = index `selector:บรรทัดทุกจุดที่ประกาศ` (บั๊ก UI เริ่มหาที่นี่) · เจนใหม่ทุกครั้งที่รัน `python tools/rotate_handoff.py` · อัปเดต: 2026-07-30

## js/adv3d_css.js (1,110 บรรทัด · 0 รายการ)

## js/adv3d_intro.js (86 บรรทัด · 0 รายการ)

## js/adv3d_tex.js (245 บรรทัด · 19 รายการ)
TILE_COLORS:9 · letterTexture:10 · letterTextureDark:27 · emojiTexture:40 · GHOST_IMG_MAX:52 · measureGhostBox:58
probeGhostImages:71 · whenGhostsReady:83 · ghostTexture:87 · ghostScareSrc:92 · AD_STYLES:100 · adBoardTexture:109
addAdBillboard:156 · ringAds:167 · BUILDING_TINTS:177 · FACADE_ROWS:179 · buildingFacadeTexture:180 · makePeerSprite:205
bind:241

## js/adventure3d.js (12,122 บรรทัด · 591 รายการ)
### 🗂️ สารบัญโซน js/adventure3d.js (Read/Edit เฉพาะช่วง)
- 1-218 adventure3d.js — โลก 3D First-person 2 โหมด (คิว 7725691507 ข้อ 8 + ต่อยอด)
- 219-282 ⚽ โหมดสนามฟุตบอล (โหมด soccer · รอบ 196) — เล็ง+ชาร์จพลังเตะบอลใส่ป้ายตัวอักษร
- 283-337 🤖 โหมดหุ่นยนต์นักรบ (โหมด mecha · รอบ 199) — มุมมองในหุ่นสูง 5m เดินยิงเอเลี่ยนตัวอักษร
- 338-480 📻 หอบังคับการบิน (รอบ 64 · รอบ 66 เปลี่ยนเป็นอังกฤษล้วนตามผู้ใช้สั่ง)
- 481-501 คำศัพท์ — ตามระดับชั้น + ไม่ซ้ำคำที่ประกอบแล้ว (8.1/8.6) · แยกคลังต่อโหมด
- 502-640 Texture ตัวอักษร / emoji / ป้ายชื่อผู้เล่น (canvas → sprite)
- 641-811 🧱 ตัวละครบล็อก (โลกขับรถ) — เลือกก่อนออกรถ · เพื่อนใน map เห็นเป็นหุ่นบล็อกขับรถบล็อก
- 812-1118 🚙 รอบ 393: รถเพื่อนในโลกขับรถ = โมเดลจริง img/models/car_01.glb (ผู้ใช้สั่ง)
- 1119-1271 สร้างฉาก static ครั้งเดียวต่อโหมด
- 1272-1594 🚗 เมืองกำแพงเพชรจริง (โหมด drive) — ข้อมูล OpenStreetMap ใน js/data/city_kpp.js
- 1595-1661 🧭🕳️ รอบ 782 — ปิดช่องขาดของกริดถนน (ผู้ใช้: "GPS พาไปช่วงที่ถนนขาดตอน / ขับต่อไม่ได้")
- 1662-1868 🌉 รอบ 788 — ปูถนนเชื่อม "เกาะถนนโดดเดี่ยว" เข้าโครงข่ายหลัก
- 1869-1926 🌳🚁 รอบ 811: จุด "พื้นที่สีเขียวข้างถนน" (greenPts) — สุ่มออกจากจุดบนถนนแต่ละจุด
- 1927-1978 🚁🌳 รอบ 816 — บินเฮลิคอปเตอร์เหนือ "เมืองกำแพงเพชร" แล้วลงจอดเก็บตัวอักษรบนพื้นที่สีเขียว
- 1979-1995 🌅 ท้องฟ้าภาพจริง (รอบ 203) — ใส่ภาพ panorama 360° (equirectangular 2:1) เป็นฉากหลังท้องฟ้า
- 1996-2035 🧱 เทกซ์เจอร์ภาพจริง (รอบ 323) — วางไฟล์ `img/tex/<key>.jpg` (หรือ .png) แล้วแปะทับพื้นผิวทันที
- 2036-2529 🌌 ท้องฟ้ากลางคืนโรงแรมผีสิง (รอบ 694) — ผู้ใช้: "ข้างนอกโรงแรมยังไม่น่ากลัวพอ"
- 2530-2568 🏨 โรงแรมผีสิง (รอบ 684) — ตัวตึก 5 ชั้นสร้างใน js/hotel3d.js
- 2569-2729 ตัวอักษรในโลก (8.2)
- 2730-2788 🌳🪙 รอบ 811: ความหนาแน่นเสริมเฉพาะโหมดขับรถ — ผู้ใช้: "เพิ่มตัวอักษรและเหรียญบนถนนและ
- 2789-2854 🔠🪙 เก็บตัวอักษร 1 ตัว = ได้ 1 เหรียญ (รอบ 345)
- 2855-2917 ประกอบคำอัตโนมัติเมื่อมีตัวอักษรครบ (8.1/8.4)
- 2918-3012 โหมด adv: monsters ยิงสู้ได้ (สเปกเดิม 8.5)
- 3013-3020 👻 ผีในโรงแรม (รอบ 684 — เขียนใหม่ทั้งชุด · ผู้ใช้สั่งข้อ 10-13, 18)
- 3021-3149 🧟 โมเดลผี 3D (รอบ 689 — ผู้ใช้สั่ง: "ภาพผีแบน ๆ ไม่สมจริง ไม่น่ากลัว ใช้โมเดลแทน")
- 3150-3376 🔦👻 รอบ 778 (ผู้ใช้สั่งข้อ 4) — กติกาใหม่ของผีเดินเพ่นพ่านในโรงแรม
- 3377-3623 🏨 ระบบโรงแรมผีสิง (รอบ 684) — เดินขึ้นชั้น/ไฟดับ/ไฟฉาย/ตู้เสื้อผ้า/รูปตามอง
- 3624-3837 เสียงหลอนโหมดผีสิง — สังเคราะห์ Web Audio (ปลอดลิขสิทธิ์ 100%)
- 3838-4163 Multiplayer — ผู้เล่นอื่นใน map เดียวกัน (สไตล์ Roblox)
- 4164-4363 Voice chat ใน map — WebRTC P2P mesh (เสียงวิ่งตรงระหว่างเครื่อง)
- 4364-4444 🏁 พิธีประกาศแชมป์ (ครูกด "จบรอบแข่ง") — /class/<map>/podium
- 4445-4651 HUD
- 4652-5284 DOM overlay + CSS (สร้างครั้งเดียว — self-contained ไม่แตะ style.css)
- 5285-5420 Input — เมาส์+คีย์บอร์ด และจอสัมผัส (มือถือ landscape)
- 5421-5425 🚁 โหมดเฮลิคอปเตอร์ Bell — ฟิสิกส์บินแบบอาร์เคด (สไตล์ Helicopter Flight Pilot)
- 5426-5818 🛸 โดรน FPV (โหมด drone) — บินเร็ว/คล่อง ลอดหน้าต่างเข้าตึกร้าง เก็บตัวอักษรในห้อง
- 5819-5941 🚗 โหมดขับรถเมืองกำแพงเพชร — ฟิสิกส์รถอาร์เคด (bicycle model)
- 5942-6035 🚦 รอบ 133: ไฟจราจรจริงที่ทางแยกใหญ่ + ฝ่าไฟแดงโดนใบสั่ง ม.22
- 6036-6483 🧭 GPS นำทาง (โหมด drive) — เลือกตัวอักษรเป้าหมาย + เส้นทางตามถนนจริง (A*) · นำทางด้วยภาพล้วน (ไม่มีเสียงพูด ตั
- 6484-6542 🎛️ เข็มหน้าปัดวิ่งจริง (สปีด 0-180 + วัดรอบ 0-8×1000) — วาดทับวงเกจของภาพ dash.png
- 6543-6627 🎵 รอบ 181: วิทยุในรถ — จอ head-unit กลางคอนโซล (visualizer + เลือกเพลง 3 โหมด)
- 6628-6660 🪞📷 รอบ 810: กระจกมองหลัง/ข้าง — เรนเดอร์ฉากเดิมซ้ำด้วยกล้องหันหลัง/เฉียงข้าง แล้วยัดลงกรอบบนจอ (scissor)
- 6661-6788 🪆 รอบ 191: ตุ๊กตาดุ๊กดิ๊กหน้ารถ — รูปตัวละครที่ผู้เล่นเลือก (blkN.png)
- 6789-7092 🚔 รอบ 128: แผงเตรียมออกรถ + กฎหมายจราจร + ใบสั่ง
- 7093-7135 🛩️📦 ภารกิจไปรษณีย์กลางคืน (รอบ 353) — เฉพาะช่วงฟ้ามืด (heliNight>.5)
- 7136-8348 🚶🛗🚁🪂 โหมดเดินเท้าในเมืองเฮลิฯ (รอบ 354 — ผู้ใช้สั่ง)
- 8349-8422 🎛️ หน้าปัดเข็มขยับจริง (รอบ 61) — วาดสดทุกเฟรมจากค่าการบินจริง
- 8423-8694 🌧️☀️ ชั้นบนกระจก: ที่ปัดน้ำฝน + แสงแดดสาด (รอบ 346)
- 8695-9099 🔊🌧️ เสียงที่ปัดน้ำฝน (รอบ 537) — สังเคราะห์ล้วน ไม่มีไฟล์เสียง
- 9100-9169 📹 กล้องใต้ท้องเครื่อง (belly cam) — รอบ 348
- 9170-9241 🎯 วงเป้าลงจอด (รอบ 349) — ไฮไลต์ดาดฟ้าที่มีตัวอักษร ให้รู้ว่าควรร่อนลงตรงไหน
- 9242-9857 📏 แถบเตือนความเร็วดิ่ง (รอบ 349) — ลงเร็วเกินกรอบกล้องกะพริบแดง สอนให้ร่อนลงนุ่มๆ
- 9858-9860 Loop หลัก
- 9861-11087 ⚽ โหมดสนามฟุตบอล — ฟิสิกส์บอล + เล็ง + ชาร์จพลัง + กล้อง 1st/3rd + ชุดนักเตะ
- 11088-11541 🤖 โหมดหุ่นยนต์นักรบ — เดินยิงเอเลี่ยนตัวอักษร (ต้องยิงเรียงลำดับในคำ)
- 11542-11561 เข้า/ออกโลก
- 11562-12122 ❓ การ์ด "วิธีเล่น" ตอนเข้าโลกครั้งแรก (จำแยกต่อโลกใน localStorage — ไม่แตะ state.js)
### รายการ js/adventure3d.js
GUIDE_WORDS:20 · RELOCATE_MS:21 · HALF:22 · PLAYER_SPEED:23 · HAUNT_LIVES:24 · HAUNT_IFRAME:25
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
GUIDE_N:249 · FK_SPOT_Z:255 · FK_MAN_R:256 · AURA_COST:261 · SB_DRAG:268 · SPOST_R:269
GK_Z:274 · GK_SPRITES:275 · PK_TIME:277 · MECHA_EYE:287 · ALIEN_COUNT:288 · MECHA_MAX_HP:289
MECHA_ATK_RANGE:290 · ALIEN_SHOT_SPD:291 · POWERUP_GAP:292 · BOSS_SCALE:293 · COMBO_X2:294 · BOSS_SPECIES:297
pickBossSpecies:305 · WAVE_BASE_GOAL:307 · waveCfg:308 · MECHA_WEAPONS:317 · ATC_REPLIES:346 · ATC_CLOSERS:351
ATC:356 · netUp:474 · CHAT_MAX:477 · doneList:484 · wordPool:485 · pickWords:498
adRenterActive:510 · FACADE_ROWS:519 · adsFetch:525 · adsWatch:537 · adsStop:544 · adsChanged:545
adRentBuy:556 · heliMusicTick:579 · AD_FLYBY_COIN:583 · adFlybyTick:585 · adShopOpen:604 · adShopRender:618
BLOCK_AVATARS:647 · blkGeo:658 · blkMat:659 · blkCyl:660 · blkFaceMat:662 · makeBlockFigure:677
makeBlockCar:717 · blkNameSprite:763 · makeBlockPeer:779 · makeBlockWalkPeer:800 · disposeBlockPeer:808 · CAR_GLB_URL:819
CAR_GLB_LEN:820 · carSplitWheel:824 · carGlbEnsure:851 · carMatGet:870 · carGlbBuild:886 · carAvCode:935
driveCamToggle:942 · SKID_N:961 · skidGeomGet:963 · skidDrop:968 · skidTick:982 · blkBuildThumbs:992
blkBuildPicker:1010 · pickBlockAvatar:1055 · bubbleSprite:1078 · showPeerBubble:1105 · removePeerBubble:1113 · concreteTexture:1123
brokenWindowTexture:1140 · intactGlassTexture:1156 · chargeIconTexture:1174 · rustyDoorTexture:1183 · dAddBox:1197 · buildAbandoned:1204
makeNameSprite:1277 · flatGeom:1290 · flatGeomUV:1299 · buildDriveCity:1309 · HELI_BODY_R:1939 · HELI_KPP_CEIL:1940
heliKppBlocked:1942 · heliKppSpawn:1963 · SKY_IMG:1986 · applySky:1987 · applyTex:2003 · HSKY_R:2050
hskyTex:2052 · buildHauntSky:2057 · tickHauntSky:2187 · buildScene:2205 · randPos:2572 · randRoadPos:2580
randGreenPos:2598 · HOTEL_PER_ROOM:2620 · HOTEL_MIN_GAP:2621 · hotelSpot:2622 · hotelPruneLetters:2657 · spawnLetter:2666
spawnLettersForWord:2712 · ensureCoverage:2714 · DRIVE_LETTER_COPIES:2736 · DRIVE_BONUS_COINS:2737 · ensureDriveAmbience:2738 · relocateLetters:2751
removeLetter:2783 · LETTER_COIN:2794 · BONUS_COIN_VAL:2795 · pickUpLetter:2796 · letterPop:2819 · letterChime:2838
tryCompleteWords:2858 · completeWord:2872 · spawnMonster:2921 · killMonster:2930 · tickMonsters:2938 · damagePlayer:2960
shoot:2976 · tickShots:2990 · GHOST_GLB_URL:3030 · GHOST_MODEL_H:3031 · ghostGlbEnsure:3033 · buildGhostMesh:3059
makeGhostSprite:3081 · spawnGhost:3099 · applyGhostSize:3124 · faceGhostToPlayer:3135 · setGhostVis:3141 · GHOST_MIN_FLOOR:3157
TORCH_LOCK_S:3158 · BANISH_S:3159 · ghostsAllowed:3161 · hotelCorridorX:3166 · torchHitsGhost:3175 · ghostBanish:3182
ghostGoLurk:3191 · ghostGoStalk:3201 · ghostGoBehind:3213 · tickGhosts:3221 · sessionRecapHtml:3311 · hauntRunSec:3318
fmtSurv:3319 · hauntSurviveFinish:3320 · tickSurvive:3330 · renderHearts:3344 · hotelScare:3350 · knockedOut:3370
BLACKOUT_MS:3390 · FLICKER_MS:3391 · DARK_LETTER:3395 · tintSprite:3396 · hotelReset:3399 · setTorch:3423
toggleTorch:3439 · tickTorch:3444 · hotelBlackout:3454 · hotelFlicker:3470 · tickHotelPlayer:3482 · tickHotelWorld:3534
hotelAct:3577 · openWardrobe:3594 · announceTarget:3617 · netReady:3843 · netJoin:3849 · sendPos:3870
sendChat:3912 · toggleChatBox:3926 · onPeerData:3937 · disposeHeliMesh:4025 · removePeer:4030 · netLeave:4045
tickPeers:4051 · RTC_CFG:4172 · tinvLinked:4173 · partyWord:4180 · syncPartyWord:4193 · updateVoiceBtns:4345
PODIUM_BONUS:4370 · podiumJoin:4372 · podiumLeave:4383 · endRound:4384 · showPodium:4395 · tinvCheck:4436
showBanner:4449 · renderHudTop:4455 · renderHudWords:4460 · renderHudInv:4470 · ddTierFromName:4477 · renderBoard:4479
drawBigMap:4516 · openBigMap:4571 · closeBigMap:4579 · drawMinimap:4584 · loadCarDash:4657 · loadCarWheel:4669
buildDom:4679 · confirmExit:5269 · IS_TOUCH:5288 · HAS_KBD:5290 · bindInput:5291 · movePlayer:5386
tickPlayer:5396 · collideDrone:5429 · propStall:5448 · propBreak:5455 · propFix:5462 · droneBatAdd:5469
lightningBolt:5472 · startRain:5483 · stopRain:5497 · smashGlass:5499 · awardGlass:5510 · neededLetter:5527
openDoor:5542 · raceStartRun:5562 · raceStop:5569 · gateHighlight:5587 · renderRaceHud:5594 · tickDrone:5603
nearMissTick:5746 · showNearMiss:5770 · awardDaredevil:5781 · comboCheer:5798 · comboFlash:5814 · driveCell:5823
nearestStreet:5829 · collideCar:5839 · tlDotY:5870 · tlSet:5874 · driveArms:5891 · tlTick:5903
TL_GREEN:5947 · tlRedDur:5949 · tlightPhase:5950 · buildTrafficLights:5957 · rlTick:6009 · cellDrivable:6041
cellWeight:6044 · cellBlocked:6049 · cellCenter:6050 · posReachable:6052 · losClear:6063 · nearestDrivableCell:6074
routeGrid:6086 · pickGpsTarget:6139 · NAVLINE_W:6162 · NAVLINE_SKIP:6163 · navLineEnsure:6164 · navLineHide:6174
navLineUpdate:6175 · tickGps:6211 · tickDrive:6282 · drawCarDial:6490 · drawCarGauges:6520 · RADIO_RECT:6548
CAR_RADIO_RECT:6550 · carRadioRect:6556 · radioLayout:6558 · radioSetHint:6581 · renderRadioList:6587 · radioToggleList:6597
drawRadioViz:6602 · radioTick:6620 · MIRROR_REAR:6634 · mirrorPass:6636 · drawCarMirrors:6648 · BOBBLE_FOOT:6666
BOBBLE_H:6667 · BOBBLE_ASPECT:6668 · BOB_OMEGA:6671 · BOB_PITCH_FORCE:6673 · BOBBLE_SKINS:6675 · bobbleSetAvatar:6682
bobbleLayout:6689 · bobbleTick:6702 · bobblePoke:6727 · bobbleApplySkin:6744 · dollOwned:6754 · openDollPicker:6755
carStartShow:6792 · showLawInfo:6810 · lawNotice:6832 · driveFineSettle:6842 · HELI_PHASES:7021 · heliStartPhase:7028
heliFloorAt:7035 · SOFT_TIERS:7045 · softLandBonus:7047 · awardPerfLand:7060 · setHeliLight:7079 · MAIL_COIN:7098
mailStart:7100 · mailStop:7123 · mailTick:7124 · FOOT_EYE:7143 · doorSlideSfx:7149 · doorLerp:7172
entLerp:7180 · footStepSfx:7190 · WRING_COIN:7211 · festivalPaint:7215 · dustTexture:7227 · dustBurst:7236
dustTick:7250 · HELI_GLB_URL:7271 · HELI_GLB_TEX_BLUE:7273 · HELI_GLB_ROTOR:7275 · HELI_GLB_TROTOR:7276 · heliGlbEnsure:7278
heliMatBlueGet:7296 · heliGlbAssemble:7309 · heliNavTick:7348 · peerRotorStop:7355 · peerRotorTick:7361 · heliCrashSfx:7380
heliMeshBuild:7408 · heliMeshBuildLegacy:7419 · buildHeliFoot:7549 · footFloorAt:7665 · insideTerm:7672 · inDoorZone:7673
footHint:7677 · setFootBtns:7678 · liftStart:7683 · beginRide:7694 · endRide:7717 · beginWing:7728
awardAirLetter:7741 · paxChoiceShow:7760 · paxChoiceHide:7786 · pilotShipMesh:7790 · beginPilot:7791 · endPilot:7823
drawCabinWindow:7847 · tickHeliFoot:7871 · heliWallPenalty:8082 · tickHeli:8094 · CP_NAT:8357 · CP_GAUGES:8358
SEAT_LABEL:8371 · SEAT_P_FULL:8372 · SEAT_ZOOM:8373 · DASH_OFF_Y:8374 · DASH_DROP:8375 · setSeat:8377
layoutCockpit:8389 · WIPER:8428 · WIPER_SPD:8431 · WIPER_LABEL:8432 · INT_GAP:8433 · WASH_MS:8437
WASH_TANK_MAX:8441 · SMEAR_LIFE:8453 · CHOP_MIN:8454 · SUN_RAY_FAR:8458 · sunRayBlocked:8460 · sunShadeTick:8479
applyCockpitShade:8490 · rotorChop:8502 · sunUpdate:8510 · HELI_FOG_N0:8521 · fogUpdate:8525 · adGlowPulse:8573
RAIN_MAX:8582 · VISOR_Y:8583 · RAIN_MIN:8584 · RAIN_DUR:8585 · DROP_ZONE:8589 · addDrop:8590
tickDrops:8598 · addWashDrop:8616 · washStart:8623 · renderWashGauge:8643 · washTick:8654 · grimeTick:8671
WIPE_R:8678 · wipeDrops:8679 · wiperSndOn:8702 · wiperSndOff:8714 · wiperThunk:8720 · washSpraySfx:8732
wiperSqueak:8749 · wiperSndTick:8766 · setWiper:8786 · tickWiper:8798 · SH_SWEEP:8829 · shadowSweepTick:8831
REFL_MAX:8843 · REFL_COL:8845 · cityGlowLevel:8846 · drawCityGlow:8851 · setVisor:8883 · rainTick:8889
drawBlade:8906 · drawSmears:8925 · drawGlass:8945 · drawBellyCam:9107 · drawBellyHud:9130 · drawLandingTargets:9176
VS_HARD:9246 · drawDescentBar:9247 · heliShake:9296 · cpNeedle:9307 · drawGauges:9324 · XF_START:9372
PRELOAD_WAIT:9373 · ALT_QUIET_FROM:9375 · ALT_MAX_DAMP:9376 · ALT_LP_MIN:9377 · ECHO_NEAR:9378 · WIND_FULL_SPD:9379
SHUTDOWN_SEC:9380 · PAN_MAX:9382 · OD_RPM:9383 · SHAKE_RPM:9384 · SHAKE_HIT:9385 · soccerLetterPos:9865
letterNeeded:9873 · soccerNeededSet:9878 · soccerTileGeo:9884 · soccerGoldTexture:9886 · makeSoccerTile:9903 · soccerRefreshSkins:9912
soccerBuildTargets:9919 · soccerNextTile:9929 · soccerRetarget:9942 · soccerCoinPop:9954 · soccerGrassTexture:9967 · soccerTurfGrade:9989
soccerTurfTexture:10012 · grassNormalTexture:10031 · soccerLinesTexture:10060 · soccerNetTexture:10111 · soccerCrowdTexture:10119 · soccerBallMat:10138
buildSoccerGoal:10158 · buildStands:10177 · soccerLedBoards:10212 · soccerGKEnsure:10309 · soccerGKTick:10325 · fkBuildWall:10354
fkToggle:10369 · fkHitTest:10385 · pkHud:10404 · pkStart:10413 · pkEnd:10427 · pkTick:10442
repQualify:10449 · repEnsureEl:10452 · repStart:10463 · repTick:10470 · soccerNumTex:10495 · makeSoccerPlayer:10505
soccerNewSpot:10531 · soccerResetBall:10543 · soccerKick:10550 · soccerCheer:10567 · guideTexture:10570 · auraActive:10594
auraLeftMs:10595 · buildAura:10597 · auraBuy:10618 · auraRender:10628 · auraTick:10642 · buildDrill:10662
drillTick:10675 · buildLandRing:10712 · buildGuideRibbon:10722 · renderSpinPad:10747 · spinPadToggle:10759 · spinPadPick:10765
renderCurl:10777 · kickLaunch:10788 · updateSoccerGuide:10796 · soccerCamera:10860 · tickSoccer:10881 · soccerKitShow:11061
soccerKitGo:11076 · emojiSprite:11129 · makeAlien:11134 · startWave:11167 · waveSpawnFill:11178 · waveComplete:11187
updateWaveHud:11197 · checkMechaBossBadge:11199 · alienSpawnPos:11208 · removeAlien:11213 · mechaHudWord:11218 · setMechaHudSkin:11226
mechaComboPop:11238 · mechaShielded:11243 · mechaDamageFx:11245 · mechaHitByAlien:11250 · spawnAlienShot:11256 · removeAlienShot:11266
tickAlienShots:11271 · spawnPowerup:11283 · removePowerup:11296 · collectPowerup:11301 · tickPowerups:11308 · updateMechaHud:11317
mechaTracer:11357 · mechaFire:11366 · explodeAlien:11403 · tickMecha:11433 · loop:11489 · grabShot:11522
savePhoto:11533 · clearEntities:11545 · INTRO_KEY:11566 · introSeenObj:11567 · introSeen:11568 · markIntroSeen:11569
INTRO:11570 · INTRO_MODE:11572 · showIntro:11574 · HELI_KPP_BANNER:11600 · closeIntro:11602 · beginPlay:11608
start:11610 · exitWorld:11831 · mechaRecapLine:11900

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

## js/hotel3d.js (849 บรรทัด · 44 รายการ)
TEX:25 · FLOOR_H:28 · WEST:31 · SHAFT_E:32 · CORE_E:33 · RZ0:34
LZ0:35 · STAIR_TOP_D:38 · STAIR_BOT_D:39 · RAMP_X0:40 · RAMP_X1:41 · RAMP_RUN:42
ROOM_N:43 · DOOR_W:46 · ENTRY_HW:47 · PLAYER_R:48 · floorY:49 · Acc:56
accBox:57 · accGeo:73 · accMesh:81 · makeMats:92 · PORTRAIT_PHOTOS:137 · EYE_R0:146
PORTRAIT_EYE:147 · PORTRAIT_SKIN:155 · PORTRAIT_CLOTH:156 · portraitTexture:157 · signTexture:196 · build:210
inRect:677 · insideHotel:678 · surfaceY:681 · collide:700 · roomAt:720 · floorOf:728
setLights:733 · BLINK_DUR:746 · BLINK_MIN:747 · tick:749 · nearWardrobe:820 · inLift:831
atLiftDoor:835 · randomHaunt:839

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

## js/moto3d.js (2,653 บรรทัด · 141 รายการ)
### 🗂️ สารบัญโซน js/moto3d.js (Read/Edit เฉพาะช่วง)
- 91-296 🚗🏙️ รอบ 785: ยกการขับจาก "โลกขับรถเมืองกำแพงเพชร" มาทั้งชุด (เฉพาะ vehicle==='car')
- 297-482 DOM เครื่องเกมพกพา (สร้างครั้งเดียว · CSS ฉีดเอง ไม่แตะ style.css)
- 483-512 🚗🏙️ รอบ 785: ห้องคนขับ + ปุ่มบังคับชุดโลกเมือง (โผล่เฉพาะ .car — โหมดมอไซค์ไม่เห็นอะไรเลย)
- 513-734 🪞📷 รอบ 810: กระจกมองหลัง+ข้าง (เฉพาะโหมดรถยนต์ในห้องคนขับ) — ภาพจริงจากกล้อง 3D ตัวที่ 2/3/4
- 735-831 🚗🏙️ รอบ 785: ห้องคนขับ (หน้าปัด/พวงมาลัย/เข็มเกจ) + ปุ่มเกียร์ — เฉพาะโหมดรถยนต์
- 832-860 🪞📷 รอบ 810: กระจกมองหลัง/ข้าง — เรนเดอร์ฉากเดิมซ้ำด้วยกล้องหันหลัง/เฉียงข้าง แล้วยัดลงแถบบนจอ (scissor)
- 861-928 🎵📻 รอบ 810: วิทยุในรถ — จอ head-unit (visualizer + แผงเลือกเพลง) พอร์ตจาก adventure3d.js ทั้งชุด
- 929-1169 ถนนจากแผนที่จริง → geometry + ตารางแฮชชนถนน
- 1170-1509 ฉาก: พื้น/โรงเรียน/ป้ายหมู่บ้าน/ต้นไม้/เมฆ/บ้านหมู่บ้าน
- 1510-1562 🐕 รอบ 312: หมาวิ่งตัดถนน — โผล่ข้างถนนข้างหน้ารถ วิ่งตัดผ่านเร็ว · ชน = ปรับ 100 เหรียญ (รอบ 643: ลดจาก 500)
- 1563-1683 🪙 รอบ 317: เหรียญบนถนน — pool ลอยเหนือเลนซ้าย รีไซเคิลรอบผู้เล่นตลอด
- 1684-1716 🏍️🚗 รอบ 317: โมเดลยานพาหนะ 3D (ใช้ทั้งรถเราเองโหมด car และรถ/มอไซค์ของเพื่อน)
- 1717-1813 🚗 รอบ 394: โมเดลรถจริง img/models/car_01.glb ในแผนที่บ้านโพธิ์สวัสดิ์
- 1814-2004 🧑‍🤝‍🧑 รอบ 317: เพื่อนในแผนที่เดียวกัน (/world/moto/<uid>)
- 2005-2046 🏟️👥 รอบ 640: งบวาดตัวเพื่อน (ใช้ NetRoom.drawBudget ร่วมกับโลกอื่น)
- 2047-2197 คำศัพท์ + ตัวอักษรบนถนน
- 2198-2507 สร้างโลกครั้งเดียว + ลูปเกม
- 2508-2653 เข้า/ออกโลก
### รายการ js/moto3d.js
REWARD:7 · ACCEL:8 · DASH_LEN:9 · DOG_HIT_COIN:10 · FEAT_SP:12 · DECAL_N:13
GRAV:14 · SUSP_K:15 · ROAD_WIDE:16 · EDGE_M:17 · ROAD_TEX_S:18 · POST_N:19
LEAN_MAX:20 · COLLECT_R:21 · SPAWN_MIN:22 · SCATTER_MS:23 · LETTER_COPIES:24 · BUCKET:25
TILE_COLORS:26 · LETTER_COIN:28 · COIN_VAL:32 · COIN_GAP:33 · COIN_SPIN_SPD:35 · COIN_TIERS:38
EMERALD_TIER:45 · HARD_LAND:46 · COIN_CURVE_RAD:47 · NET_SEND_MS:49 · PEER_COLORS:50 · CHAT_MS:52
CHAT_PRESETS:53 · CAR_EYE:102 · CAR_ACCEL:103 · CAR_VMAX:104 · CAR_WB:105 · MIRROR_REAR:115
RADIO_RECT:120 · CAR_RADIO_RECT:121 · carRadioRect:127 · sndKick:235 · ENG_FILES:245 · CSS:300
buildDom:585 · loadCarDash:740 · loadCarWheel:752 · setGear:762 · setCam3:768 · syncGearUi:775
carDial:784 · drawCarGauge:814 · mirrorPass:837 · drawCarMirrors:849 · radioLayout:865 · radioSetHint:889
renderRadioList:895 · radioToggleList:905 · drawRadioViz:910 · segKey:932 · smoothPts:935 · featKey:951
addFeat:952 · genFeatures:957 · terrainAt:976 · roadGroundY:989 · decalTex:997 · makeDecals:1016
decalTick:1025 · buildRoads:1042 · distToSeg:1138 · roadInfo:1143 · onRoad:1149 · randomRoadPoint:1150
TXT_SPR_H:1175 · makeTextSprite:1176 · letterTexture:1191 · woodTileMat:1206 · muralTexture:1217 · buildSchool:1229
buildScenery:1375 · scatterTrees:1454 · postTick:1474 · scatterClouds:1501 · makeDog:1513 · spawnDog:1528
dogHit:1538 · dogTick:1549 · coinTexture:1567 · makeCoins:1578 · loadCoinImg:1584 · addCoin:1596
clearCoins:1604 · addFreeCoin:1608 · coinTierAt:1616 · coinFx:1626 · grabCoin:1635 · coinTick:1652
scatterCoinTick:1666 · placeSpecialCoin:1673 · makeVehicle:1688 · mCarSplitWheel:1725 · mCarEnsure:1751 · mCarMat:1768
mCarBuild:1781 · mCarCode:1808 · netReady:1820 · netJoin:1826 · netSend:1839 · sendChat:1853
showPeerBubble:1863 · removePeerBubble:1870 · renderBoard:1877 · peerColor:1899 · buildPeer:1903 · onPeer:1927
dropPeer:1970 · netLeave:1977 · peerTick:1982 · PEER_DRAW_MAX:2010 · drawnPeers:2011 · drawSlotFree:2012
showPeerAgain:2013 · hidePeer:2020 · tickDrawBudget:2025 · spawnSlot:2033 · pickWord:2050 · spawnLetters:2060
renderWordHud:2078 · fitWord:2086 · collectTick:2093 · completeWord:2117 · relocTick:2142 · gpsTick:2157
miniTick:2166 · build:2201 · applyVehicleUi:2235 · fit:2264 · tick:2273 · carDrive:2283
frame:2332 · start:2511 · exitWorld:2583

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

## css/exam.css (348 บรรทัด · 75 selector)
#xs-screen:8 · .xs-top:12 · .xs-badge:16 · .xs-mode:17 · .xs-time:18,19,21,22 · .no-anim:24
.xs-score:25 · .xs-quit:26 · .xs-nav:32 · .xs-dot:36,40,41,42(+1) · .xs-body:46 · .xs-pass:47,51,58
.xs-ptitle:52 · .xs-para:53 · .xs-pn:54 · .xs-qside:59 · .xs-sec:63,64 · .xs-q:65
.xs-qno:66 · .xs-choices:70 · .xs-ch:71,76,77,82(+5) · .xs-ab:78 · .xs-ex:90,91,95 · .xs-exh:96
.xs-exref:97 · .xs-foot:100 · .xs-count:104 · .xs-btn:105,109,110,111(+1) · .levelup-box:117 · .xs-result:118,119,120,121(+4)
.xsr-box:138 · .xsr-head:143,144 · .xsr-tabs:145 · .xsr-tab:146,150 · .xsr-list:151 · .xsr-none:152
.xsr-item:153,157 · .xsr-qh:158,159,160 · .xsr-q:164 · .xsr-ans:165 · .xsr-you:166,167,168 · .xsr-ex:169
.xsr-ref:170 · .xst-wrap:172 · .xst-note:173 · .xst-row:176,177,178,186(+1) · .xst-h:179 · .xst-tag:180
.xst-bar:182,185,188 · .xst-n:189 · .xst-sum:190 · .xsr-foot:194 · .xsr-ok:195 · .xsp-box:201
.xsp-head:206,207 · .xsp-rows:208 · .xsp-set:209,210 · .xsp-name:211 · .xsp-tick:212 · .xsp-info:213
.xsp-best-row:214 · .xsp-best:215 · .xsp-hist:217,218 · .xsp-hist-svg:219 · .xsp-btns:220 · .xsp-go:221,225,226,229(+1)
.xsp-foot:231 · .xsb-box:246 · .xsb-head:251,252 · .xsb-grid:253 · .xsb-card:254,258 · .xsb-emoji:259
.xsb-name:260 · .xsb-info:261 · .xsb-done:262

## css/lobby.css (4,837 บรรทัด · 726 selector)
:root:6 · html:15 · body:16 · *:33,34,35,36 · #app:39 · h1:41
.subtitle:42 · .shop-title:43 · #rotate-overlay:46 · .screen:68 · #screen-select:77,78,79,80(+5) · .egg-need:87
.petshop-topright:89 · .petshop-play-link:90,95 · #screen-game:137,138,139,140(+7) · #screen-quiz:151,152,153,154(+6) · #quiz-choices:163,164 · .word-card:171
.quiz-choice:172,173,174 · .big-btn:177,178,179,180 · #screen-dashboard:185,1070,1078 · .lobby-top:192,825,826,827(+27) · .top-flex:193 · .profile-plate:194,198,746,3450(+12)
#rain-fx:203 · .rain-layer:206,212 · .rain-glass:219 · .glass-drop:220 · .rail-btn:235,838,844,845(+16) · .rail-badge:236
.fr-code-box:241 · .fr-code-label:245 · .fr-code-row:246 · .fr-code:247 · .fr-copy-btn:252,256,261,262 · .fr-search-btn:257
.fr-add-btn:258 · .fr-accept:259 · .fr-decline:260 · #fr-search-input:263 · #fr-search-result:267 · .fr-found:268
.fr-hint:272 · .fr-list-title:273 · .fr-row:274 · .fr-req:278 · .fr-row-name:280,284,4617 · .fr-row-status:288
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
.pl-click:694,696,697 · .pl-overlay:698 · .pl-card:702,2588 · .pl-close:708 · .pl-head:712,2446,2449 · .pl-grade:717,4623,4624
.pl-body:718 · .pl-loading:719 · .pl-none:720 · .pl-me-tag:721 · .pl-blk-wrap:723 · .pl-blk:724
.pl-stat:725 · .pl-lbl:730 · .pl-val:731,732 · .pl-tip:733 · .chip-edit:739,744,745 · .rank-mini:751,757,758,759
.pass-photo:761,766 · .pet-tabs:768 · .dict-box:769,773,774,775(+1) · .dict-card:781,786,790,791(+2) · .dict-head:787,788 · .dict-trail:795,799
.dt-c:800,804,805 · .dt-sep:806 · .dict-today:807 · .di-w:809,810,811 · .dict-list:812 · .dict-item:813,817,818,819(+5)
.lobby-mid:833 · .rail-wrap:836,861,865,866(+3) · .lobby-rail:837 · .rail-nudge:868,876,877,880(+1) · .rail-worlds:887 · .rail-div:888
.lobby-stage:930,932,948,1075(+13) · .newword-banner:938,945,950,4002(+2) · .coin-fly:961,964 · .coin-plus:970 · .nw-pop-coin:985,987,988 · .nw-pop-goal:991,992,996,1000
.nw-goal-head:993,995,997 · .nw-goal-bar:998 · .nw-goal-fill:999 · .nw-pop-book:1001,1002 · .nw-tag:1023,4008,4030 · .nw-word:1028,4012,4035,4124
.nw-hint:1030,1031,4013,4037(+1) · .nw-coin:1033,1036,4014,4018 · .nw-countdown:1041,4019 · .nw-bar:1043,4038 · .nw-bar-fill:1045 · .pet-stage:1048,2882
.nw-box:1055,2891 · .nw-pop-word:1056 · .nw-speak:1057 · .nw-pop-phon:1058 · .nw-ipa:1059 · .nw-pop-sent:1060
.nw-pop-mean:1061 · .pet-tab:1062,1063,1064,3256 · .stage-hero:1085,1100,1108,1253(+22) · .hero-ground:1122,1242,1248 · .hero-rank-bg:1124,1127,1130,1134(+18) · #lobby3d-canvas:1147,1148
.hero-scene:1152,1154,1161,1162(+8) · .caretaker-fig:1201 · .caretaker-img:1204 · .caretaker-emoji:1206 · .blk-rig:1213,1214,1215 · .stage-plate:1275,1283,1294,1295(+23)
.plate-title:1289 · .lobby-side:1322,1358,1363,1366(+22) · .side-sec:1325,2158,3152,3428 · .side-label:1326,1331 · .side-label-row:1334,1335 · .lb-tabs-out:1336,1337,1341
.side-glass:1345,1352 · .side-card:1364,1475 · #quest-card:1376,1377,1405,1406(+6) · .q-bigcard:1382,1411 · .qb-top:1384 · .qb-emoji:1385
.qb-name:1387 · .qb-bar:1388,1389 · .qb-row:1391 · .qb-prog:1392 · .qb-reward:1393 · .qb-go:1394,1398
.q-dots:1399 · .q-dot:1400,1401,1402 · .q-bonus:1403 · .inv-card:1422,1424,1425 · .inv-btns:1426 · .inv-go:1427,1429
.inv-x:1430 · #online-card:1434,3160,3161,3162(+4) · .fq-overlay:1435 · .fq-box:1437,2966 · .fq-head:1441,1443 · .fq-close:1444
.fq-sec:1446 · .fq-worlds:1447 · .fq-world:1448,1450 · .fq-acts:1451 · .fq-act:1452,1455,1456 · .lb-prize:1489
.lb-coins:1492 · .lbf-cell:1493,2515,2518,2519(+3) · .lb-award-bar:1495,1501,1502 · .lb-award-go:1503 · .lbf-award:1505,1511,1512,1513 · .pod-pz:1514
.wsa-overlay:1517 · .wsa-box:1519 · .wsa-head:1524 · .wsa-title:1525 · .wsa-when:1526,1527 · .wsa-close:1528,1531
.wsa-cols:1532 · .wsa-col:1533 · .wsa-sec-h:1534,1535 · .wsa-msg:1536 · .wsa-msg-h:1539 · .wsa-msg-b:1540,1541
.wsa-msg-none:1542 · .wsa-rules:1544,1545 · .wsa-list:1546 · .wsa-row:1547,1549 · .wsa-r:1550 · .wsa-n:1551
.wsa-s:1552 · .wsa-p:1553 · .wsa-prizes:1554 · .wsa-pz:1555,1558 · .wsa-reveal-medal:1559 · .lobby-bottom:1574,1577,1578,1580
.lobby-std-btn:1582,1583,1584,1585(+3) · .lobby-quiz-btn:1589 · .lobby-book-btn:1590,1591 · .lobby-foodquiz-btn:1592,1593 · .lobby-play-btn:1594,1598 · .lobby-exam-btn:1600,1601,1603
.panel-overlay:1608,1613,4139,4140(+8) · .panel-box:1614 · .panel-head:1621,1625 · .panel-close:1626,1631 · .panel-body:1632,1636,1637 · .panel-page:1634,1635
.collect-sub:1641 · .mkt-empty:1642 · .craft-box:1643 · .mkt-listing:1644 · .mkt-filter:1645,1989 · .hq-grid:1652
.hq-card:1653,1658,1682 · .hq-head:1659 · .hq-pic:1665,1667 · .hq-emoji:1669 · .hq-badge:1670 · .hq-stars:1674
.hq-price:1675,1680,1681,1684(+6) · .craft-credit:1688,1690,1691 · .car-grid:1698,1700,1701 · .robot-weap:1702 · .dmap-box:1705,1706 · .dmap-grid:1712
.dmap-card:1714,1717,1718,1719(+2) · .dmap-ico:1721 · .dmap-new:1724 · .dcp-grid:1726 · .dcp-card:1728,1731,1732,1733(+10) · .levelup-box:1750,2845,2846,2963
.dcp-box:1753,1754,1758,1759(+6) · .dcp-lock:1767 · .sold-badge:1771,1773,1774 · .rs-showroom:1776,4575,4576 · .rs-list:1777,1779,4556,4559 · .rs-thumb:1780,1782,1783,1784(+1)
.rs-thumb-pic:1785,1786 · .rs-thumb-price:1787 · .rs-stage:1789 · .rs-big:1792 · .rs-big-img:1793 · .rs-elec:1797,1801,1806
.rs-edge:1807,1813 · .rs-info:1816,1817,1818,1819(+1) · .rs-buy:1821,1823,1824 · .cs-showroom:1828,4548,4549,4577(+3) · .cs-list:1829,1831,4550,4555(+9) · .cs-thumb:1832,1834,1835,1836(+1)
.cs-thumb-pic:1837,1838 · .cs-thumb-name:1839 · .cs-thumb-price:1840 · .cs-thumb-own:1841 · .cs-stage:1843 · .cs-big:1846
.cs-big-img:1847 · .cs-elec:1851,1855,1859 · .cs-edge:1860,1866 · .cs-interior:1869 · .cs-inr-label:1870,1871 · .cs-inr-img:1872
.cs-info:1874,1875,1876,1877(+6) · .cs-buy:1885,1887,1888,1889 · .car-emoji:1891 · .car-mine:1897 · .car-mine-pic:1902 · .car-mine-info:1903
.car-loan:1904,1905 · .car-mine-btns:1906,1907,1908 · .car-locked:1910 · .car-mine-head:1912 · .car-pick-list:1913,1914 · .car-pick:1915,1917,1918
.car-pick-pic:1919,1920 · .car-pick-name:1921,1922 · .car-pick-od:1923 · .car-buy-box:1925,2970 · .cb-pic:1926,1927,1928 · .cb-lines:1929
.cb-li:1930,1934,1935 · .cb-ins:1936,1940,1941 · .cb-plan:1942 · .cb-pl:1943,1948,1950,1954(+1) · .cb-total:1961 · .cb-btns:1962,1967
.cb-x:1963 · .shop-grid:1970 · .shop-item:1971,1976,1981,1982(+3) · .mkt-tab:1990,1991 · .pg-btn:1992,1993,1994 · .pg-dot:1995
.fr-gift-btn:2018,2023 · .gift-sec-title:2026 · .gift-in-row:2028 · .gift-out-row:2032 · .gift-in-pic:2033,2035,2036 · .gift-in-info:2037,2038
.gift-in-btns:2039 · .gift-accept:2040,2044,2046 · .gift-decline:2045 · .gift-box-card:2047 · .gift-box-from:2048,2049 · .gift-note:2050
.gift-pick-overlay:2053 · .gift-pick-box:2057 · .gift-pick-head:2063,2067 · .gift-pick-close:2068 · .gift-pick-tabs:2070 · .gp-tab:2071,2075
.gift-pick-body:2076 · .gp-chips:2077 · .gp-chip:2078,2082 · .gp-card:2083,2084 · .gp-price:2085 · .gp-note:2086
.gift-cf-pic:2087 · .chat-emoji-cats:2092 · .chat-emoji-cat:2096,2100,2101 · .chat-emoji-wrap:2102,2103 · .stage-left:2112,4130 · .pet-info-btn:2116,2123,2124
.feed-list:2131,2135,2160,2161(+1) · .feed-empty:2136,2139 · .fd-tools:2145 · .feed-bell:2146,2148,2149,2150 · .fd-prog:2154,2155 · .fpost:2162,2727
.fp-head:2167 · .fp-who:2168 · .fp-name-line:2171 · .fp-name:2172 · .fp-when:2173 · .fp-badges:2175,2178
.fp-badge-ic:2176 · .fp-text:2180 · .fp-media:2183 · .fp-img:2185 · .fp-cap:2187 · .fp-big:2188
.fp-sum:2190,2192 · .fp-sum-rx:2193 · .fp-sum-none:2194 · .fp-en:2195 · .fp-bar:2197 · .fp-act:2198,2202,2204
.fp-like:2203 · .fp-page:2215,2216,2217,2218(+3) · .fp-rxbox:2221 · .fp-rxb:2225,2227,2228,2229(+1) · .fp-rxb-off:2231 · .fp-fly:2233,2236,2237
.fcm-overlay:2240 · .fcm-box:2242 · .fcm-post:2246,2247 · .fcm-rxs:2248 · .fcm-rx:2249 · .fcm-list:2250,2252
.fcm-row:2253,2254,2255 · .fcm-none:2256 · .fcm-quick:2258,2260 · .fcm-q:2261,2264,2265 · .fcm-add:2266 · .fcm-input:2267,2269
.fcm-send:2270,2272 · .fcm-locked:2273 · .fnt-overlay:2275 · .fnt-box:2277 · .fnt-list:2281,2283 · .fnt-row:2284,2286
.fnt-ico:2287 · .fnt-tx:2288,2289 · .fnt-sub:2290 · .feed-plate:2292 · .feed-all-btn:2293,2298 · .fdb-overlay:2303
.fdb-box:2305 · .fdb-head:2309 · .fdb-close:2313,2315 · .fdb-live:2316 · .fdb-live-title:2317 · .fdb-live-rows:2319,2321,2322
.fdb-live-row:2323,2325,2326,2327 · .fdb-dot:2328 · .fdb-list:2330,2331 · .fdb-empty:2332 · .fdb-row:2333 · .fdb-row-top:2335
.fdb-ico:2336 · .fdb-txt:2337 · .fdb-name:2338 · .fdb-ago:2339 · .fdb-actions:2340 · .fdb-like:2341,2344,2345,2346
.fdb-cm-list:2347 · .fdb-cm-row:2348,2350 · .fdb-cm-empty:2351 · .fdb-cm-add:2352 · .fdb-cm-input:2353,2355 · .fdb-cm-send:2356,2358
.fdb-cm-locked:2359 · .pi-overlay:2362 · .pi-box:2366,2371,2372,2376(+3) · .pi-close:2378,2383,2384 · .pi-close-left:2386 · .pi-portrait:2388
.pet-wear:2395,2398,2400 · .pi-portrait-wrap:2403,2405 · .pi-dress-btn:2413,2417,2418 · .pi-shape-cap:2419,2422,2423,2424 · .pi-shape-toggle-btn:2426,2429 · .pi-dress-pip:2431,2436,2437,2438(+1)
.pi-wear-note:2441,2443 · .greet-card:2450 · .greet-sub:2451 · .greet-grid:2452 · .greet-opt:2453,2456,2457,2458 · .greet-e:2459
.pi-streak:2463 · .pi-streak-head:2465,2467 · .pi-streak-best:2468 · .pi-dots:2469 · .pi-dot:2471,2472,2473 · .pi-streak-note:2474
.pi-care-title:2475 · .lbf-overlay:2478 · .lbf-box:2481,2495,2496,2497(+10) · .lbf-head:2486 · .lbf-title:2487 · .lbf-tabs:2488,2491
.lbf-note:2494 · .lbf-close:2510 · .lbf-close-l:2511 · .lbf-body:2512 · .lbf-grid:2513 · .lbf-bcat-wrap:2528,2530
.lbf-bcat:2531 · .lbf-bcat-head:2532,2533,2534 · .lbf-bcat-badge:2539,2542 · .lbcat-ic:2540 · .lbcat-ic-label:2543 · .lbf-bcat-rows:2544
.lbf-bcat-row:2545,2547,2548,2550 · .lbf-podium:2554 · .pod:2556,2583,2584 · .pod-char:2558 · .pod-base:2560 · .pod-rank:2562
.pod-label:2564,4619 · .pod-name:2566 · .pod-sc:2568 · .pod-1:2573,2574 · .pod-2:2575,2576 · .pod-3:2577,2578
.pod-4:2579,2580 · .pod-5:2581,2582 · .pl-wide:2601,2604,2605,2606(+8) · .pl-follow:2607,2612,2614 · .pl-unfollow:2616,2622,2623 · .pl-followers:2624
.pl-cols:2625,2630,2631,2632 · .pl-col:2626 · .pl-sec-title:2627 · .pl-badges-col:2633 · .pl-feed:2634,2637,2644 · .pl-feed-row:2638,2642,2643
.pl-assets-wrap:2646,4456,4531 · .pl-assets:2647,4459,4464,4470(+4) · .pl-asset:2650,2654,2661 · .pl-asset-emoji:2655 · .pl-asset-n:2656 · .pl-pets-wrap:2663
.pl-pets:2664 · .pl-pet:2665,2670,2672 · .pl-pet-nm:2673 · .img-lightbox:2676,2681,2682,2686(+3) · .cert-svg:2705 · .cert-tap:2706,2711
.cert-chip-sm:2714 · .pl-sec-sub:2734 · .pl-certs:2735,2737 · .cert-mini:2738,2742,2744 · .cert-mini-cap:2745 · .cert-none:2747
.lv-cert-row:2749,2751 · .lv-cert-btn:2752,2757 · .cert-lightbox:2759,2764,2765,2769(+3) · .pl-chat:2789,2794 · .pl-call:2796,2802 · .pet-peek:2803,2804
.pp-chips:2806 · .pp-chip:2807 · .pp-gift:2812,2818 · .settings-box:2820,2821,2895,2900(+27) · .set-feed-head:2822 · .set-feed-sub:2826
.set-feed-row:2827 · .pillinfo-val:2832 · .pillinfo-desc:2837,2856 · .pillinfo-box:2848 · .plf-head:2851 · .plf-emoji:2852
.plf-ht:2853,2854,2855 · .plf-foot:2857,2859,2860 · .alert-box:2865,2867 · .ab-emoji:2868 · .ab-title:2869 · .ab-desc:2870
.ab-btns:2871,2872,2873 · .heal-heart:2875 · .attn-box:2890 · .help-box:2941,2942,2943 · .wl-box:2964 · .food-box:2965
.home-shop-box:2967 · .summary-box:2968 · .report-box:2969 · .wl-grid:2972 · .tc-wrap:2974 · .spell-btn:2980,2985
.sp-hud:2986 · .sp-word:2988 · .sp-ch:2989,2994 · .sp-th:2996 · .sp-hint:2998 · .sp-exit:3001,3005
.sp-banner:3006 · .sp-big:3011 · .sp-thb:3013 · .sp-coin:3014 · #spell-confetti:3019 · .sp-rb:3020
.sp-day:3030 · .sp-perfect:3032 · .sp-late:3034 · #spell-coinpop:3037 · .side-sub:3146,3148 · .sec-quest:3153
.on-page:3164,3165,3166,3167 · .inbox-overlay:3177 · .ib-box:3179 · .ib-head:3183 · .ib-close:3187,3189 · .ib-list:3190,3191
.ib-row:3192,3193,3194,3195 · .ib-ava:3196,3201,3202 · .ib-on:3203 · .ib-mid:3205 · .ib-name:3206 · .ib-last:3207
.ib-meta:3208 · .ib-time:3209 · .ib-dot:3211 · .ib-story-badge:3214 · .ib-empty:3218 · .ib-story:3220,3222
.ib-story-item:3223,3225,3232 · .ib-story-ava:3226 · .ib-story-on:3230 · .ib-world:3235,3238 · .ib-tabs:3240 · .ib-tab:3241,3244,3246
.ib-tab-dot:3247 · .ib-call-ava:3251 · .ib-call-row:3252,3253 · #btn-music:3259,3262,3263 · #ws-overlay:3278 · #ws-board:3281,3287,3289
.ws-head:3292 · .ws-title:3293 · .ws-findbar:3296 · .ws-tip:3297 · .ws-grade:3299,3300 · .ws-body:3303
.ws-gridwrap:3304 · #ws-grid:3307 · .ws-cell:3312,3317,3320,3323(+2) · .ws-flash:3329,3331 · .ws-coinpop:3335,3359 · .ws-combo:3346,3350,3351,3352
.ws-find:3363 · #ws-prog:3364 · #ws-words:3368,3372 · .ws-word:3374,3379,3380,3381(+2) · .ws-actions:3387,3388,3397 · .ws-sizes:3392
.ws-sizes-lb:3394 · .ws-size-now:3395 · #ws-new:3398 · #ws-stash:3399 · #ws-clear:3400 · #ws-win:3401,3403
.ws-win-in:3404,3407 · .sec-online:3430 · .rank-tab:3458,3459,3460,3461(+2) · .pet-show-bg:3491,3494,3498,3502(+19) · .ps-night-fx:3594,3596,3608,3613(+1) · .pet-show:3623,3626,3638,3640(+22)
.ps-video:3759 · .ps-worn-pip:3837,3838 · .id-card:3861,3868,3872 · .id-chip:3885 · .clock-chip:3894,3895 · .coin-block:3911
.coin-group:3912 · .coin-pill:3942,3943,3964 · .cp-lb:3967 · .cp-v:3968 · .nw-sub:4036 · .top-flex2:4127
#panel-factory:4146,4147,4151,4152(+39) · #panel-rank:4287,4288,4294,4299(+11) · .grid2x8:4370,4376 · .grid1x5:4386,4392 · .pl-badges-strip:4398 · .pl-badge-card:4402,4408
.pl-badge-card-ic:4409,4413 · .pl-badge-card-nm:4414 · .pl-badges-empty:4420,4422 · .mine-strip:4436,4438,4439,4444(+4) · .mb-strip:4450,4489 · .gmark:4597,4601,4602,4603(+1)
.gm-stack:4606,4610 · .gm-row:4612 · .lb-name:4614,4615,4616 · .grade-edit:4637,4642,4643 · .gradelock-box:4647,4663,4668,4670 · .gl-head:4648
.gl-emoji:4649 · .gl-ht:4650 · .gl-cur:4651 · .gl-lock:4652,4657 · .gl-ok:4656 · .gl-lock-sub:4658
.gl-why:4659 · .gl-pick-lb:4660 · .gl-opts:4661 · .gl-hist:4671 · .gl-hline:4672 · .gl-hg:4676
.gl-hat:4677 · .gl-harr:4678 · .gl-foot:4679 · .gl-cf:4680 · .reg-gradelock:4702 · #tp-overlay:4712
#tp-board:4714,4718 · .tp-head:4722 · .tp-title:4723 · .tp-stat:4725,4727 · .tp-pts:4729,4732 · .tp-close:4734,4740,4741
.tp-snd:4744,4747,4753,4754 · .tp-snd-ic:4748 · .tp-snd-track:4749 · .tp-snd-thumb:4751 · .tp-prompt:4758 · .tp-word:4760,4774,4775
.tp-ch:4762,4767,4768,4770 · .tp-thai:4778 · .tp-hint:4780 · .tp-empty:4782 · .tp-keys:4785 · .tp-row:4787
.tp-row-fn:4789,4822 · .tp-key:4793,4805,4807,4813(+2) · .tp-key-fn:4820 · .tp-fx:4826 · .tp-coinpop:4827 · .tp-pop-pt:4832

## css/style.css (2,083 บรรทัด · 535 selector)
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
.cat-card:1058,1103,1106,1251(+1) · .cat-head:1062 · .cat-emoji:1063 · .cat-name:1064 · .cat-pass:1065 · .cat-info:1066
.cat-btns:1067 · .cat-btn:1068,1072,1073,1074(+3) · .cats-back-bottom:1077 · .tapglow:1082,1083,1091 · .lobby-bottom:1090 · .band-sec-head:1101,1102
.bax-box:1110,1112 · .bax-head:1113 · .bax-sub:1114,1115 · .bax-row:1116 · .bax-lv:1117,1120,1121,1122(+3) · .bax-emoji:1123
.bax-name:1124 · .bax-q:1125 · .bax-need:1127 · .bax-rw:1128 · .bax-foot:1132 · .bax-rank:1133,1136
.bxr-box:1139,1141 · .bxr-head:1142 · .bxr-sub:1143 · .bxr-body:1144 · .bxr-pick:1145 · .bxr-cats:1146
.bxr-chip:1147,1149,1150,1151(+1) · .bxr-list:1154 · .bxr-row:1155,1157,1159,1163 · .bxr-rk:1158 · .bxr-nm:1160,1161 · .bxr-sc:1162
.bxr-tm:1164 · .bxr-more:1165 · .bxr-none:1166 · .bxr-foot:1168 · .band-mine-tag:1169 · .bsp-box:1172,1175
.bsp-head:1176 · .bsp-prog:1177 · .bsp-retake:1179,1182 · .bsp-info:1184,1186 · .rts-box:1189 · .rts-head:1191
.rts-sets:1192 · .rts-set:1193,1194,1195 · .rts-sub:1196 · .rts-words:1197 · .rts-word:1198,1200,1201 · .rts-foot:1202
.rts-okbtn:1203,1205 · .bsp-grid:1206 · .bsp-chip:1207,1210,1211,1212(+1) · .bsp-num:1214 · .bsp-best:1215 · .bsp-tick:1216
.bsp-foot:1217 · .vb-box:1220,1222 · .vb-head:1223 · .vb-total:1224 · .vb-quizbtn:1225,1227 · .vb-tabs:1228
.vb-tab:1229,1231,1232 · .vb-words:1233 · .vb-word:1234,1237,1238,1239(+3) · .vb-empty:1243 · .vb-foot:1244 · .vb-pg:1245,1247
#vb-pginfo:1248 · .vb-hint:1249 · .band-lock:1257 · .offline-btn:1258,1259 · .quiz-progress:1264 · .quiz-phon:1265
#quiz-extra:1266,1268,1269,1270 · .quiz-word-card:1271 · .quiz-next:1277,1283,1284,1285(+1) · .quiz-choice:1288,1293,1294,1295 · .quiz-score-pill:1296 · .quiz-time-pill:1298,1300
.stats-card:1303 · .stats-title:1307,1756 · .stats-row:1308,1309,1310,1311 · .stat-badge-line:1313,1316 · .stat-badge-ic:1314 · .game-top:1319
.back-btn:1320 · .combo-pill:1324 · .timer-wrap:1328 · .timer-fill:1329,1330 · .board-label:1332 · .card-grid:1333
.word-card:1334,1340,1341,1342(+3) · .hint-btn:1348,1353 · .game-endless-note:1356,1361,1363,1367(+6) · .report-btn:1388,1393 · .report-box:1396 · .report-close:1397
.rp-head:1401 · .rp-avatar:1402,1403 · .rp-title:1404 · .rp-sub:1405 · .rp-levelcard:1407 · .rp-level-top:1411
.rp-bar:1412 · .rp-bar-fill:1413 · .rp-level-note:1414,1415 · .rp-grid:1417 · .rp-stat:1418 · .rp-ic:1421
.rp-num:1422 · .rp-lbl:1423 · .rp-section:1425 · .rp-h3:1426 · .rp-badge-mini:1427 · .rp-row:1428,1429,1430
.rp-empty:1431 · .rp-badges:1432 · .rp-badge:1433 · .rp-tline:1436 · .rp-tl-head:1437,1438 · .rp-tl-ems:1439
.rp-em:1440,1441 · .rp-tl-note:1442,1443 · .rp-crown:1445,1446 · .rp-wtitle:1448 · .rp-wnow:1449,1450 · .rp-wgraph:1451
.rp-wcol:1452 · .rp-wval:1453 · .rp-wbar:1454,1455 · .rp-wlbl:1456 · .rp-cheer:1458 · .report-ok:1462
.summary-box:1465,1520,1524,1525(+2) · .sm-burst:1466 · .sm-title:1468 · .sm-line:1469 · .sm-coin:1470 · .sm-matches:1476,1477
.confetti:1479 · .sm-badge:1486 · .sm-badge-all:1490 · .badge-celebrate-overlay:1493,1510 · .badge-celebrate:1499 · .bc-emoji:1505,1507
.bc-emoji-img:1506 · .bc-title:1508 · .bc-sub:1509 · .sm-cheer:1514 · .sm-streak:1515,1516 · .sm-sick:1517
.sm-btns:1518 · .float-fx:1530 · .toast:1537 · .toast-warn:1544,1551,1552,1558 · .toast-clear-all:1560,1567 · .alert-box:1569
.alert-ok:1570,1575 · .settings-box:1577 · .set-row:1578 · .set-hint:1582 · .set-hint-on:1583 · .set-hint-off:1584
.set-lwrap:1585 · .set-label:1586 · .set-desc:1587 · .set-switch:1588,1592,1593,1598(+4) · .set-sw-knob:1594 · .set-sw-txt:1601
.set-close:1607,1612 · .set-help:1613,1618 · .help-box:1620,1621,1626 · .help-item:1622 · .update-banner:1634,1643,1644 · #update-reload:1645
#update-dismiss:1649 · .levelup-overlay:1655,1661,1662 · .levelup-box:1663,1670,1671,1672(+4) · .bill-box:1678,1682,1683 · .tag-off:1684 · .home-decayed-img:1685
.home-dark-img:1686 · .thirst-fill:1687 · .thirst-text:1688,1689 · .toxin-fill:1692 · .toxin-text:1693,1694 · .detox-btn:1695,1700
.shape-text:1703,1704,1705,1706(+1) · .avatar-pick:1710 · .avatar-opt:1711,1715,1716,1717 · .avatar-chip-img:1721 · .mini-av:1723 · .fp-ava:1724
.avatar-chip-blk:1726 · .set-avatar-btns:1727 · .avatar-mini:1728,1732 · .set-blk-row:1734 · .set-sub2:1735 · .blk-grid:1737
.blk-mini:1738,1741,1742,1743 · .game-avatar:1746,1747,1748 · .stats-nick:1757 · .ticket-owned:1760,1764 · .collect-sub:1769 · .mkt-tabs:1770
.mkt-tab:1771,1775 · .mkt-filter:1776 · .mkt-row:1780 · .mkt-emoji:1784,1785 · .mkt-info:1786,1787 · .mkt-tier-stars:1788
.mkt-buy:1789,1794,1795 · .mkt-price-lo:1796 · .mkt-price-hi:1797 · .mkt-empty:1798 · .collect-grid:1801 · .collect-cell:1802
.cc-emoji:1803,1804 · .cc-name:1805 · .cc-count:1806 · .cc-list-btn:1807,1811 · .mkt-listhead:1812 · .mkt-group-head:1814,1820
.mkt-two-col:1822,1823,1827,1839(+8) · #phone-card:1828,1844 · #computer-card:1829,1845 · #ticket-card:1831 · #haunt-card:1832 · #heli-card:1833
#drone-card:1834 · #drive-card:1835 · #soccer-card:1836 · #moto-card:1837 · #invasion-card:1838 · .mkt-listing:1866
.ml-cancel:1870 · .mkt-sold:1876,1877,1878 · .list-dialog:1885,1886,1891 · .list-hint:1890 · .collect-reveal-frame:1894,1901 · .collect-reveal-img:1900
.collect-reveal-stars:1902 · .craft-box:1905 · .craft-head:1906 · .craft-bar:1907 · .craft-fill:1908 · .craft-text:1909
.craft-btn-row:1910,1911 · .craft-go-btn:1913,1919,1920,1923 · .craft-cancel:1931,1935 · .mkt-catalog:1938,1939,1940 · .mkt-pager:1943 · .pg-btn:1944,1948,1949
.pg-mid:1950 · .pg-dots:1951 · .pg-dot:1952,1953 · .order-head:1954 · .order-row:1955,1960,1962,1964 · .order-deliver:1965,1970
.order-need:1971 · .avatar-chip-photo:1977 · .pass-photo:1978 · .pl-photo:1979 · .pp-cam:1984,1992 · .set-photo-row:1995,2001
.ph-thumb:2002 · .ph-plus:2003 · .photo-box:2009,2010,2031,2035(+4) · .ph-now:2011 · .ph-now-img:2012,2016 · .ph-now-cap:2017
.ph-warn:2018 · .ph-sync:2023,2026 · .ph-sync-wait:2027 · .ph-sync-ok:2028 · .ph-sync-bad:2029 · .ph-btns:2030
.ph-tip:2040 · .ph-stage:2042,2046 · .ph-cv:2047 · .ph-ring:2048,2053 · .ph-zoom:2057 · .ph-foot:2058
.ph-crop-box:2059
