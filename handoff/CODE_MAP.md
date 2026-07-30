# CODE_MAP.md — แผนที่โค้ด:บรรทัด (เจนอัตโนมัติโดย `tools/gen_code_map.py` — **ห้ามแก้มือ** เดี๋ยวโดนเขียนทับ)

> วิธีใช้: หาชื่อฟังก์ชัน/ค่าคงที่/selector ในไฟล์นี้ (Grep หรือกวาดตา) → `Read` ไฟล์จริง `offset=<บรรทัด>` `limit=40`
> 🗂️ ไฟล์อ้วนมี **สารบัญโซน** (`st-end ชื่อโซน`) — งานทั้งระบบ/โลก 3D: Grep ชื่อโซน → Read/Edit เฉพาะช่วงนั้น **ห้ามอ่านทั้งไฟล์** · เพิ่มระบบใหม่ในไฟล์อ้วนต้องครอบ banner `/* ==== */`+ชื่อโซน (สารบัญเจนเอง)
> css = index `selector:บรรทัดทุกจุดที่ประกาศ` (บั๊ก UI เริ่มหาที่นี่) · เจนใหม่ทุกครั้งที่รัน `python tools/rotate_handoff.py` · อัปเดต: 2026-07-30

## js/adv3d_css.js (1,109 บรรทัด · 0 รายการ)

## js/adv3d_intro.js (86 บรรทัด · 0 รายการ)

## js/adv3d_tex.js (245 บรรทัด · 19 รายการ)
TILE_COLORS:9 · letterTexture:10 · letterTextureDark:27 · emojiTexture:40 · GHOST_IMG_MAX:52 · measureGhostBox:58
probeGhostImages:71 · whenGhostsReady:83 · ghostTexture:87 · ghostScareSrc:92 · AD_STYLES:100 · adBoardTexture:109
addAdBillboard:156 · ringAds:167 · BUILDING_TINTS:177 · FACADE_ROWS:179 · buildingFacadeTexture:180 · makePeerSprite:205
bind:241

## js/adventure3d.js (12,098 บรรทัด · 591 รายการ)
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
- 1272-1588 🚗 เมืองกำแพงเพชรจริง (โหมด drive) — ข้อมูล OpenStreetMap ใน js/data/city_kpp.js
- 1589-1655 🧭🕳️ รอบ 782 — ปิดช่องขาดของกริดถนน (ผู้ใช้: "GPS พาไปช่วงที่ถนนขาดตอน / ขับต่อไม่ได้")
- 1656-1862 🌉 รอบ 788 — ปูถนนเชื่อม "เกาะถนนโดดเดี่ยว" เข้าโครงข่ายหลัก
- 1863-1897 🌳🚁 รอบ 811: จุด "พื้นที่สีเขียวข้างถนน" (greenPts) — สุ่มออกจากจุดบนถนนแต่ละจุด
- 1898-1949 🚁🌳 รอบ 816 — บินเฮลิคอปเตอร์เหนือ "เมืองกำแพงเพชร" แล้วลงจอดเก็บตัวอักษรบนพื้นที่สีเขียว
- 1950-1966 🌅 ท้องฟ้าภาพจริง (รอบ 203) — ใส่ภาพ panorama 360° (equirectangular 2:1) เป็นฉากหลังท้องฟ้า
- 1967-2006 🧱 เทกซ์เจอร์ภาพจริง (รอบ 323) — วางไฟล์ `img/tex/<key>.jpg` (หรือ .png) แล้วแปะทับพื้นผิวทันที
- 2007-2500 🌌 ท้องฟ้ากลางคืนโรงแรมผีสิง (รอบ 694) — ผู้ใช้: "ข้างนอกโรงแรมยังไม่น่ากลัวพอ"
- 2501-2539 🏨 โรงแรมผีสิง (รอบ 684) — ตัวตึก 5 ชั้นสร้างใน js/hotel3d.js
- 2540-2700 ตัวอักษรในโลก (8.2)
- 2701-2759 🌳🪙 รอบ 811: ความหนาแน่นเสริมเฉพาะโหมดขับรถ — ผู้ใช้: "เพิ่มตัวอักษรและเหรียญบนถนนและ
- 2760-2825 🔠🪙 เก็บตัวอักษร 1 ตัว = ได้ 1 เหรียญ (รอบ 345)
- 2826-2888 ประกอบคำอัตโนมัติเมื่อมีตัวอักษรครบ (8.1/8.4)
- 2889-2983 โหมด adv: monsters ยิงสู้ได้ (สเปกเดิม 8.5)
- 2984-2991 👻 ผีในโรงแรม (รอบ 684 — เขียนใหม่ทั้งชุด · ผู้ใช้สั่งข้อ 10-13, 18)
- 2992-3120 🧟 โมเดลผี 3D (รอบ 689 — ผู้ใช้สั่ง: "ภาพผีแบน ๆ ไม่สมจริง ไม่น่ากลัว ใช้โมเดลแทน")
- 3121-3347 🔦👻 รอบ 778 (ผู้ใช้สั่งข้อ 4) — กติกาใหม่ของผีเดินเพ่นพ่านในโรงแรม
- 3348-3594 🏨 ระบบโรงแรมผีสิง (รอบ 684) — เดินขึ้นชั้น/ไฟดับ/ไฟฉาย/ตู้เสื้อผ้า/รูปตามอง
- 3595-3808 เสียงหลอนโหมดผีสิง — สังเคราะห์ Web Audio (ปลอดลิขสิทธิ์ 100%)
- 3809-4134 Multiplayer — ผู้เล่นอื่นใน map เดียวกัน (สไตล์ Roblox)
- 4135-4334 Voice chat ใน map — WebRTC P2P mesh (เสียงวิ่งตรงระหว่างเครื่อง)
- 4335-4421 🏁 พิธีประกาศแชมป์ (ครูกด "จบรอบแข่ง") — /class/<map>/podium
- 4422-4628 HUD
- 4629-5261 DOM overlay + CSS (สร้างครั้งเดียว — self-contained ไม่แตะ style.css)
- 5262-5397 Input — เมาส์+คีย์บอร์ด และจอสัมผัส (มือถือ landscape)
- 5398-5402 🚁 โหมดเฮลิคอปเตอร์ Bell — ฟิสิกส์บินแบบอาร์เคด (สไตล์ Helicopter Flight Pilot)
- 5403-5794 🛸 โดรน FPV (โหมด drone) — บินเร็ว/คล่อง ลอดหน้าต่างเข้าตึกร้าง เก็บตัวอักษรในห้อง
- 5795-5917 🚗 โหมดขับรถเมืองกำแพงเพชร — ฟิสิกส์รถอาร์เคด (bicycle model)
- 5918-6011 🚦 รอบ 133: ไฟจราจรจริงที่ทางแยกใหญ่ + ฝ่าไฟแดงโดนใบสั่ง ม.22
- 6012-6459 🧭 GPS นำทาง (โหมด drive) — เลือกตัวอักษรเป้าหมาย + เส้นทางตามถนนจริง (A*) · นำทางด้วยภาพล้วน (ไม่มีเสียงพูด ตั
- 6460-6518 🎛️ เข็มหน้าปัดวิ่งจริง (สปีด 0-180 + วัดรอบ 0-8×1000) — วาดทับวงเกจของภาพ dash.png
- 6519-6603 🎵 รอบ 181: วิทยุในรถ — จอ head-unit กลางคอนโซล (visualizer + เลือกเพลง 3 โหมด)
- 6604-6636 🪞📷 รอบ 810: กระจกมองหลัง/ข้าง — เรนเดอร์ฉากเดิมซ้ำด้วยกล้องหันหลัง/เฉียงข้าง แล้วยัดลงกรอบบนจอ (scissor)
- 6637-6764 🪆 รอบ 191: ตุ๊กตาดุ๊กดิ๊กหน้ารถ — รูปตัวละครที่ผู้เล่นเลือก (blkN.png)
- 6765-7068 🚔 รอบ 128: แผงเตรียมออกรถ + กฎหมายจราจร + ใบสั่ง
- 7069-7111 🛩️📦 ภารกิจไปรษณีย์กลางคืน (รอบ 353) — เฉพาะช่วงฟ้ามืด (heliNight>.5)
- 7112-8324 🚶🛗🚁🪂 โหมดเดินเท้าในเมืองเฮลิฯ (รอบ 354 — ผู้ใช้สั่ง)
- 8325-8398 🎛️ หน้าปัดเข็มขยับจริง (รอบ 61) — วาดสดทุกเฟรมจากค่าการบินจริง
- 8399-8670 🌧️☀️ ชั้นบนกระจก: ที่ปัดน้ำฝน + แสงแดดสาด (รอบ 346)
- 8671-9075 🔊🌧️ เสียงที่ปัดน้ำฝน (รอบ 537) — สังเคราะห์ล้วน ไม่มีไฟล์เสียง
- 9076-9145 📹 กล้องใต้ท้องเครื่อง (belly cam) — รอบ 348
- 9146-9217 🎯 วงเป้าลงจอด (รอบ 349) — ไฮไลต์ดาดฟ้าที่มีตัวอักษร ให้รู้ว่าควรร่อนลงตรงไหน
- 9218-9833 📏 แถบเตือนความเร็วดิ่ง (รอบ 349) — ลงเร็วเกินกรอบกล้องกะพริบแดง สอนให้ร่อนลงนุ่มๆ
- 9834-9836 Loop หลัก
- 9837-11063 ⚽ โหมดสนามฟุตบอล — ฟิสิกส์บอล + เล็ง + ชาร์จพลัง + กล้อง 1st/3rd + ชุดนักเตะ
- 11064-11517 🤖 โหมดหุ่นยนต์นักรบ — เดินยิงเอเลี่ยนตัวอักษร (ต้องยิงเรียงลำดับในคำ)
- 11518-11537 เข้า/ออกโลก
- 11538-12098 ❓ การ์ด "วิธีเล่น" ตอนเข้าโลกครั้งแรก (จำแยกต่อโลกใน localStorage — ไม่แตะ state.js)
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
makeNameSprite:1277 · flatGeom:1290 · flatGeomUV:1299 · buildDriveCity:1309 · HELI_BODY_R:1910 · HELI_KPP_CEIL:1911
heliKppBlocked:1913 · heliKppSpawn:1934 · SKY_IMG:1957 · applySky:1958 · applyTex:1974 · HSKY_R:2021
hskyTex:2023 · buildHauntSky:2028 · tickHauntSky:2158 · buildScene:2176 · randPos:2543 · randRoadPos:2551
randGreenPos:2569 · HOTEL_PER_ROOM:2591 · HOTEL_MIN_GAP:2592 · hotelSpot:2593 · hotelPruneLetters:2628 · spawnLetter:2637
spawnLettersForWord:2683 · ensureCoverage:2685 · DRIVE_LETTER_COPIES:2707 · DRIVE_BONUS_COINS:2708 · ensureDriveAmbience:2709 · relocateLetters:2722
removeLetter:2754 · LETTER_COIN:2765 · BONUS_COIN_VAL:2766 · pickUpLetter:2767 · letterPop:2790 · letterChime:2809
tryCompleteWords:2829 · completeWord:2843 · spawnMonster:2892 · killMonster:2901 · tickMonsters:2909 · damagePlayer:2931
shoot:2947 · tickShots:2961 · GHOST_GLB_URL:3001 · GHOST_MODEL_H:3002 · ghostGlbEnsure:3004 · buildGhostMesh:3030
makeGhostSprite:3052 · spawnGhost:3070 · applyGhostSize:3095 · faceGhostToPlayer:3106 · setGhostVis:3112 · GHOST_MIN_FLOOR:3128
TORCH_LOCK_S:3129 · BANISH_S:3130 · ghostsAllowed:3132 · hotelCorridorX:3137 · torchHitsGhost:3146 · ghostBanish:3153
ghostGoLurk:3162 · ghostGoStalk:3172 · ghostGoBehind:3184 · tickGhosts:3192 · sessionRecapHtml:3282 · hauntRunSec:3289
fmtSurv:3290 · hauntSurviveFinish:3291 · tickSurvive:3301 · renderHearts:3315 · hotelScare:3321 · knockedOut:3341
BLACKOUT_MS:3361 · FLICKER_MS:3362 · DARK_LETTER:3366 · tintSprite:3367 · hotelReset:3370 · setTorch:3394
toggleTorch:3410 · tickTorch:3415 · hotelBlackout:3425 · hotelFlicker:3441 · tickHotelPlayer:3453 · tickHotelWorld:3505
hotelAct:3548 · openWardrobe:3565 · announceTarget:3588 · netReady:3814 · netJoin:3820 · sendPos:3841
sendChat:3883 · toggleChatBox:3897 · onPeerData:3908 · disposeHeliMesh:3996 · removePeer:4001 · netLeave:4016
tickPeers:4022 · RTC_CFG:4143 · tinvLinked:4144 · partyWord:4151 · syncPartyWord:4164 · updateVoiceBtns:4316
PODIUM_BONUS:4341 · podiumJoin:4343 · podiumLeave:4354 · endRound:4355 · showPodium:4366 · tinvCheck:4406
showBanner:4426 · renderHudTop:4432 · renderHudWords:4437 · renderHudInv:4447 · ddTierFromName:4454 · renderBoard:4456
drawBigMap:4493 · openBigMap:4548 · closeBigMap:4556 · drawMinimap:4561 · loadCarDash:4634 · loadCarWheel:4646
buildDom:4656 · confirmExit:5246 · IS_TOUCH:5265 · HAS_KBD:5267 · bindInput:5268 · movePlayer:5363
tickPlayer:5373 · collideDrone:5406 · propStall:5425 · propBreak:5432 · propFix:5439 · droneBatAdd:5446
lightningBolt:5449 · startRain:5460 · stopRain:5474 · smashGlass:5476 · awardGlass:5487 · neededLetter:5504
openDoor:5519 · raceStartRun:5539 · raceStop:5546 · gateHighlight:5564 · renderRaceHud:5571 · tickDrone:5580
nearMissTick:5722 · showNearMiss:5746 · awardDaredevil:5757 · comboCheer:5774 · comboFlash:5790 · driveCell:5799
nearestStreet:5805 · collideCar:5815 · tlDotY:5846 · tlSet:5850 · driveArms:5867 · tlTick:5879
TL_GREEN:5923 · tlRedDur:5925 · tlightPhase:5926 · buildTrafficLights:5933 · rlTick:5985 · cellDrivable:6017
cellWeight:6020 · cellBlocked:6025 · cellCenter:6026 · posReachable:6028 · losClear:6039 · nearestDrivableCell:6050
routeGrid:6062 · pickGpsTarget:6115 · NAVLINE_W:6138 · NAVLINE_SKIP:6139 · navLineEnsure:6140 · navLineHide:6150
navLineUpdate:6151 · tickGps:6187 · tickDrive:6258 · drawCarDial:6466 · drawCarGauges:6496 · RADIO_RECT:6524
CAR_RADIO_RECT:6526 · carRadioRect:6532 · radioLayout:6534 · radioSetHint:6557 · renderRadioList:6563 · radioToggleList:6573
drawRadioViz:6578 · radioTick:6596 · MIRROR_REAR:6610 · mirrorPass:6612 · drawCarMirrors:6624 · BOBBLE_FOOT:6642
BOBBLE_H:6643 · BOBBLE_ASPECT:6644 · BOB_OMEGA:6647 · BOB_PITCH_FORCE:6649 · BOBBLE_SKINS:6651 · bobbleSetAvatar:6658
bobbleLayout:6665 · bobbleTick:6678 · bobblePoke:6703 · bobbleApplySkin:6720 · dollOwned:6730 · openDollPicker:6731
carStartShow:6768 · showLawInfo:6786 · lawNotice:6808 · driveFineSettle:6818 · HELI_PHASES:6997 · heliStartPhase:7004
heliFloorAt:7011 · SOFT_TIERS:7021 · softLandBonus:7023 · awardPerfLand:7036 · setHeliLight:7055 · MAIL_COIN:7074
mailStart:7076 · mailStop:7099 · mailTick:7100 · FOOT_EYE:7119 · doorSlideSfx:7125 · doorLerp:7148
entLerp:7156 · footStepSfx:7166 · WRING_COIN:7187 · festivalPaint:7191 · dustTexture:7203 · dustBurst:7212
dustTick:7226 · HELI_GLB_URL:7247 · HELI_GLB_TEX_BLUE:7249 · HELI_GLB_ROTOR:7251 · HELI_GLB_TROTOR:7252 · heliGlbEnsure:7254
heliMatBlueGet:7272 · heliGlbAssemble:7285 · heliNavTick:7324 · peerRotorStop:7331 · peerRotorTick:7337 · heliCrashSfx:7356
heliMeshBuild:7384 · heliMeshBuildLegacy:7395 · buildHeliFoot:7525 · footFloorAt:7641 · insideTerm:7648 · inDoorZone:7649
footHint:7653 · setFootBtns:7654 · liftStart:7659 · beginRide:7670 · endRide:7693 · beginWing:7704
awardAirLetter:7717 · paxChoiceShow:7736 · paxChoiceHide:7762 · pilotShipMesh:7766 · beginPilot:7767 · endPilot:7799
drawCabinWindow:7823 · tickHeliFoot:7847 · heliWallPenalty:8058 · tickHeli:8070 · CP_NAT:8333 · CP_GAUGES:8334
SEAT_LABEL:8347 · SEAT_P_FULL:8348 · SEAT_ZOOM:8349 · DASH_OFF_Y:8350 · DASH_DROP:8351 · setSeat:8353
layoutCockpit:8365 · WIPER:8404 · WIPER_SPD:8407 · WIPER_LABEL:8408 · INT_GAP:8409 · WASH_MS:8413
WASH_TANK_MAX:8417 · SMEAR_LIFE:8429 · CHOP_MIN:8430 · SUN_RAY_FAR:8434 · sunRayBlocked:8436 · sunShadeTick:8455
applyCockpitShade:8466 · rotorChop:8478 · sunUpdate:8486 · HELI_FOG_N0:8497 · fogUpdate:8501 · adGlowPulse:8549
RAIN_MAX:8558 · VISOR_Y:8559 · RAIN_MIN:8560 · RAIN_DUR:8561 · DROP_ZONE:8565 · addDrop:8566
tickDrops:8574 · addWashDrop:8592 · washStart:8599 · renderWashGauge:8619 · washTick:8630 · grimeTick:8647
WIPE_R:8654 · wipeDrops:8655 · wiperSndOn:8678 · wiperSndOff:8690 · wiperThunk:8696 · washSpraySfx:8708
wiperSqueak:8725 · wiperSndTick:8742 · setWiper:8762 · tickWiper:8774 · SH_SWEEP:8805 · shadowSweepTick:8807
REFL_MAX:8819 · REFL_COL:8821 · cityGlowLevel:8822 · drawCityGlow:8827 · setVisor:8859 · rainTick:8865
drawBlade:8882 · drawSmears:8901 · drawGlass:8921 · drawBellyCam:9083 · drawBellyHud:9106 · drawLandingTargets:9152
VS_HARD:9222 · drawDescentBar:9223 · heliShake:9272 · cpNeedle:9283 · drawGauges:9300 · XF_START:9348
PRELOAD_WAIT:9349 · ALT_QUIET_FROM:9351 · ALT_MAX_DAMP:9352 · ALT_LP_MIN:9353 · ECHO_NEAR:9354 · WIND_FULL_SPD:9355
SHUTDOWN_SEC:9356 · PAN_MAX:9358 · OD_RPM:9359 · SHAKE_RPM:9360 · SHAKE_HIT:9361 · soccerLetterPos:9841
letterNeeded:9849 · soccerNeededSet:9854 · soccerTileGeo:9860 · soccerGoldTexture:9862 · makeSoccerTile:9879 · soccerRefreshSkins:9888
soccerBuildTargets:9895 · soccerNextTile:9905 · soccerRetarget:9918 · soccerCoinPop:9930 · soccerGrassTexture:9943 · soccerTurfGrade:9965
soccerTurfTexture:9988 · grassNormalTexture:10007 · soccerLinesTexture:10036 · soccerNetTexture:10087 · soccerCrowdTexture:10095 · soccerBallMat:10114
buildSoccerGoal:10134 · buildStands:10153 · soccerLedBoards:10188 · soccerGKEnsure:10285 · soccerGKTick:10301 · fkBuildWall:10330
fkToggle:10345 · fkHitTest:10361 · pkHud:10380 · pkStart:10389 · pkEnd:10403 · pkTick:10418
repQualify:10425 · repEnsureEl:10428 · repStart:10439 · repTick:10446 · soccerNumTex:10471 · makeSoccerPlayer:10481
soccerNewSpot:10507 · soccerResetBall:10519 · soccerKick:10526 · soccerCheer:10543 · guideTexture:10546 · auraActive:10570
auraLeftMs:10571 · buildAura:10573 · auraBuy:10594 · auraRender:10604 · auraTick:10618 · buildDrill:10638
drillTick:10651 · buildLandRing:10688 · buildGuideRibbon:10698 · renderSpinPad:10723 · spinPadToggle:10735 · spinPadPick:10741
renderCurl:10753 · kickLaunch:10764 · updateSoccerGuide:10772 · soccerCamera:10836 · tickSoccer:10857 · soccerKitShow:11037
soccerKitGo:11052 · emojiSprite:11105 · makeAlien:11110 · startWave:11143 · waveSpawnFill:11154 · waveComplete:11163
updateWaveHud:11173 · checkMechaBossBadge:11175 · alienSpawnPos:11184 · removeAlien:11189 · mechaHudWord:11194 · setMechaHudSkin:11202
mechaComboPop:11214 · mechaShielded:11219 · mechaDamageFx:11221 · mechaHitByAlien:11226 · spawnAlienShot:11232 · removeAlienShot:11242
tickAlienShots:11247 · spawnPowerup:11259 · removePowerup:11272 · collectPowerup:11277 · tickPowerups:11284 · updateMechaHud:11293
mechaTracer:11333 · mechaFire:11342 · explodeAlien:11379 · tickMecha:11409 · loop:11465 · grabShot:11498
savePhoto:11509 · clearEntities:11521 · INTRO_KEY:11542 · introSeenObj:11543 · introSeen:11544 · markIntroSeen:11545
INTRO:11546 · INTRO_MODE:11548 · showIntro:11550 · HELI_KPP_BANNER:11576 · closeIntro:11578 · beginPlay:11584
start:11586 · exitWorld:11807 · mechaRecapLine:11876

## js/auth.js (389 บรรทัด · 32 รายการ)
AUTH_PUSH_MS:23 · AUTH_SDK_TIMEOUT_MS:24 · TEACHER_EMAILS:28 · isTeacher:29 · TESTER_EMAILS:42 · TESTER_COINS:43
isTester:44 · testerBoost:48 · authSetStatus:74 · authShowLogin:86 · authGateOffline:90 · authSaveRef:97
authFetchCloud:98 · authWriteCloud:99 · authDeleteCloud:100 · authWriteProfileName:101 · authPushProfile:108 · authApplyProfileName:116
authAskProfileName:132 · authEditProfileName:143 · authStart:154 · updateOfflinePill:184 · authEnterOffline:189 · authLateSync:206
authLoginClick:222 · authOnLogin:241 · authSyncOnLogin:254 · authFreshStart:283 · authAskLink:292 · authEnterGame:342
authPushSave:357 · authLogout:368

## js/award.js (271 บรรทัด · 0 รายการ)

## js/bandadv.js (394 บรรทัด · 24 รายการ)
BAND_ADV_REWARD:9 · bandAdvFailMsg:16 · bandAdvLoad:23 · bandAdvPlay:61 · BAND_ADV_EXAM:76 · bandAdvExamId:81
bandAdvExamName:83 · BAND_ADV_SUPREME_BONUS:90 · bandAdvCheckSupreme:91 · bandAdvExamLock:107 · bandAdvExamBest:116 · bandAdvExamCat:129
bandAdvShowExamSummary:146 · bigExamBadgeNote:174 · BXR_TOP:192 · bxrIdByLabel:196 · bxRankRows:202 · bxrRowHTML:235
bxRankBodyHTML:247 · bxRankMount:261 · bxRankNote:286 · openBigExamRank:292 · bandAdvExamOpen:309 · bandAdvCardsHTML:363

## js/cert.js (635 บรรทัด · 31 รายการ)
CERT_MAX:17 · CERT_ISSUER_EN:18 · CERT_MONTHS:19 · CERT_TOPIC_EN:23 · CERT_LEVEL_EN:44 · CERT_ADV_EN:49
CERT_BIG_LV:56 · CERT_STD_EN:59 · certThIndex:67 · certTitleOf:76 · certSerial:102 · certDateEN:110
certTier:118 · CERT_TIER_META:125 · CERT_LOGO_SRC:131 · certAward:140 · certMine:164 · certAwardGold:171
certAwardAdvSupreme:192 · certBackfill:208 · certCatNameById:236 · certFromPost:261 · certXML:279 · certFit:284
certHolder:289 · certSVG:299 · certChipHTML:574 · openCertBig:589 · openCertMine:605 · certStripHTML:613
certBindStrip:627

## js/dictband.js (410 บรรทัด · 27 รายการ)
BAND_EMOJI:12 · BAND_SET_REWARD:13 · BAND_DONE_BONUS:14 · bandFailMsg:21 · bandLoad:28 · bandShortTH:60
bandCat:68 · bandSets:90 · bandSetId:99 · bandCheckComplete:102 · bandSetCat:119 · BAND_RETAKE_MAX:131
bandTriedSets:132 · bandRetakeCat:143 · bandShowRetakeSummary:177 · bandSetsPassed:205 · openBandSetPicker:213 · bandMine:285
bandUnlocked:286 · bandLockToast:291 · bandExamLobby:297 · updateBandExamBtn:306 · bandLobbyTick:323 · bandPlay:334
bandSpeakSample:346 · bandPlayLobby:366 · bandCardsHTML:378

## js/examstd.js (803 บรรทัด · 39 รายการ)
XS_PASS_PCT:15 · XS_REWARD:16 · XS_REWARD_AGAIN:17 · XS_TIME_HINT:21 · XS_TIME_FALLBACK:22 · xsLimitSec:23
XS_SCALE:27 · xsScaleText:33 · xsFindSet:44 · examStdLoad:56 · xsFailMsg:91 · xsQuizId:99
xsBest:101 · xsIsPractice:126 · xsTimerStop:128 · xsElapsed:129 · xsFmt:130 · xsMark:137
xsSecStats:143 · examStdStart:157 · xsBuildScreen:177 · xsTimeUp:249 · xsRender:258 · xsChoose:334
xsGo:346 · xsQuitAsk:362 · xsClose:370 · xsSubmitAsk:376 · xsFinish:391 · xsTimeTableHTML:479
xsShowReview:503 · openExamStdPicker:569 · xrkIdByLabel:631 · xrkRows:641 · xrkBodyHTML:673 · xrkMount:685
openExamStdRank:712 · examStdCardsHTML:729 · openExamStdBoard:764

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

## js/invasion3d.js (9,950 บรรทัด · 612 รายการ)
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
- 6251-6384 🕹️ Input — มือถือ (จอย+ปุ่ม) และคอม (WASD + pointer lock)
- 6385-6505 🚶 ผู้เล่น + AI + ลูป
- 6506-6510 🚁 โหมดขับเฮลิคอปเตอร์เอง (รอบ 414 — ผู้ใช้สั่ง)
- 6511-6669 🗺️ รอบ 417: แผนที่เลือกจุดลงสนาม (ผู้ใช้สั่ง) — เข้าเกมแล้วเลือกได้ว่าจะไปเกิดตรงไหน
- 6670-6828 🎖️ รอบ 418: นั่งเฮลิลำเดียวกับเพื่อน — "นักบิน + พลปืนประจำประตู" (ผู้ใช้สั่ง)
- 6829-7190 🔭🚫 รอบ 575 (ผู้ใช้สั่ง): "ซูมปืนค้างไว้ = ขึ้นเฮลิไม่ได้ ต้องเลิกซูมก่อน"
- 7191-7449 🌐 ผู้เล่นออนไลน์ใน map เดียวกัน (รอบ 414) — Firebase /world/invasion
- 7450-7599 🧯👥 กันผู้เล่นล้น — ฝั่งเรนเดอร์ของโลกนี้ (รอบ 637 · ยกส่วนกลางออกไป js/netroom.js รอบ 640)
- 7600-7658 💨 ควันตามหลังมิสไซล์ (รอบ 531 — ผู้ใช้สั่ง) — สไปรต์ควันนุ่มปล่อยเป็นระยะ
- 7659-7826 🔥🌀 รอบ 565 (ผู้ใช้สั่ง): ยานลูก "หลบมิสไซล์ที่ล็อกได้" — ปล่อยแฟลร์ + บิดหนี
- 7827-7905 🔫↩️ รอบ 568 (ผู้ใช้สั่ง): ยานลูกที่ "ถูกเรดาร์ล็อก" ยิงสวนกลับใส่เฮลิผู้เล่น
- 7906-8107 🔥🛡️ รอบ 569 (ผู้ใช้สั่ง): แฟลร์ของ "เฮลิผู้เล่น" + เสียงเตือนตอนถูกล็อก
- 8108-8118 🏃🪖 รอบ 530: หน่วยรบเคลื่อนที่เชิงยุทธวิธี (ผู้ใช้สั่ง: "อย่าปักหลักยืนทื่อ
- 8119-8244 🧘🎯 รอบ 586 (ผู้ใช้ส่งคลิป: "ตัวละครดิ้นไปดิ้นมา ไม่เป็นธรรมชาติ")
- 8245-8420 📣 รอบ 471: ทหารฝ่ายเราตะโกนบอกทิศศัตรู (ผู้ใช้สั่ง)
- 8421-8863 🌙 รอบ 471: โหมดกลางคืน — ฉากมืดสลัว + ท้องฟ้าดาว + ไฟฉายติดปืน
- 8864-9130 🔵💀 รอบ 576 (ผู้ใช้สั่ง): ยานแม่ยิง "ลำแสงสีฟ้า" ลงมาใกล้ตัวผู้เล่น — เตือน 3 ครั้ง ครั้งที่ 4 ตายจริง
- 9131-9181 ⚡👾 รอบ 579 (ผู้ใช้สั่ง): "ทุก 5 นาที สุ่มยานลูก 10 ลำ เร่งความเร็ว 10 เท่า นาน 10 วินาที แล้ววนลูป"
- 9182-9255 🔁 ลูปหลัก
- 9256-9950 ▶️ เข้า/ออกโลก
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
renderHeat:6228 · renderMissiles:6234 · toastBan:6244 · bindInput:6254 · moveJoy:6375 · unlockMouse:6383
solidPushOut:6392 · tickPlayer:6407 · hurtPlayer:6487 · MAP_VIEW:6516 · mapToWorld:6517 · worldToMap:6518
zoneName:6519 · buildMapShade:6533 · drawSpawnMap:6552 · safeSpawn:6627 · fitSpawnMap:6637 · openSpawnMap:6648
applySpawnPick:6657 · RIDE_DIST:6680 · RIDE_UP:6681 · RIDE_OFF:6682 · rideableHelis:6683 · findRide:6689
nearestRideable:6690 · ridePos:6700 · setRideView:6712 · boardGunner:6721 · dismountGunner:6740 · tickGunner:6756
updateGunnerBtn:6796 · tickAutoBoard:6812 · heliCount:6824 · zoomBlocksBoard:6842 · enterHeli:6852 · exitHeli:6894
EXT_CAM:6923 · EXT_VIEWS:6944 · EXT_SELF:6959 · EXT_RIDE:6960 · extP:6962 · syncExtBtn:6964
cycleExtView:6970 · resetExtCam:6979 · angDiff:6981 · extCamClear:6986 · extCamera:7005 · seatCamera:7028
tickHeliFlight:7049 · heliCrash:7148 · tickGpws:7158 · syncBotHelis:7180 · netReady:7196 · netJoin:7202
netSend:7213 · peerColor:7235 · NAME_SPR_H:7239 · nameSprite:7240 · bakedSoldierGlb:7256 · loadPeerSoldier:7257
peerRig:7266 · setPeerWeapon:7271 · peerBody:7276 · buildPeer:7305 · onPeer:7318 · dropPeer:7358
netLeave:7365 · peerTick:7370 · renderBoard:7406 · sendChat:7431 · showPeerBubble:7438 · removePeerBubble:7444
PEER_DRAW_MAX:7457 · PEER_DRAW_SLACK:7458 · DRAW_SWAP_MARGIN:7459 · JOIN_TOAST_MAX:7460 · drawnPeers:7463 · drawSlotFree:7464
showPeerAgain:7467 · hidePeer:7474 · tickDrawBudget:7479 · tickCrowdGuard:7489 · resetCrowdGuard:7493 · tickFighters:7495
tickMother:7548 · spawnAlienShot:7571 · tickAlienShots:7583 · smokeTex:7605 · spawnPuff:7616 · spawnSmoke:7626
spawnDust:7628 · tickSmoke:7637 · clearSmoke:7647 · tickHeliDust:7650 · EVA_WARN:7672 · EVA_FLARE_D:7673
EVA_TURN:7674 · EVA_SPIN_MUL:7675 · EVA_SPD_MAX:7676 · EVA_ROLL:7679 · EVA_Y:7680 · FLARE_PODS:7681
FLARE_COOL:7682 · FLARE_N:7683 · FLARE_LIFE:7684 · FLARE_TRAP:7685 · FLARE_CH:7686 · incomingMis:7691
startEvade:7702 · dropFlares:7711 · tickEvade:7739 · clearFlares:7771 · tickMissiles:7772 · CTR_REACT:7841
CTR_WARN:7842 · CTR_GAP:7843 · CTR_BURST:7847 · CTR_BURST_MS:7848 · CTR_SPD:7849 · CTR_DMG:7850
CTR_MAX:7851 · CTR_SPREAD:7852 · CTR_LEAD:7853 · ctrAimPoint:7856 · ctrArming:7863 · counterFire:7867
tickCounter:7872 · SPK_RANGE:7923 · SPK_MS:7924 · SPK_GAP:7925 · SPK_WORLD_GAP:7926 · SPK_BEEP:7927
AMIS_SPD:7928 · AMIS_TURN:7929 · AMIS_DMG:7930 · AMIS_LIFE:7931 · AMIS_MAX:7932 · AMIS_PROX:7933
PH_FLARE_MAX:7934 · PH_FLARE_RE:7935 · PH_FLARE_N:7936 · PH_FLARE_COOL:7937 · PH_FLARE_BACK:7938 · PH_FLARE_DOWN:7939
PH_TRAP:7940 · PH_FLARE_CH:7941 · renderFlareBtn:7944 · dropPlayerFlares:7950 · fireAlienMissile:7982 · clearAMis:7997
resetSpike:8002 · spikeStart:8003 · aMisNear:8005 · tickSpike:8013 · tickAMis:8065 · SQUAD_COVERS:8117
squadCoverPool:8118 · SQ_TURN:8128 · angWrap:8133 · turnTo:8135 · easeLook:8140 · squadTarget:8145
pickSquadDest:8157 · tickSquadMove:8171 · tickSquad:8197 · CALL_DIST:8251 · CALL_NEAR:8252 · CALL_GAP_ALL:8253
CALL_GAP_ONE:8254 · CALL_GAP_DIR:8255 · CALL_MS:8256 · CALL_LINES:8257 · CALL_SECTORS:8268 · bearingKey:8271
clearSquadBubble:8279 · callSprite:8285 · squadShout:8297 · tickSquadCalls:8310 · CHAT_GAP_ALL:8337 · CHAT_LINES:8338
tickSquadChatter:8344 · heliFireAt:8361 · nearestFighterTo:8373 · tickHelis:8379 · DAY:8428 · NIGHT:8430
collectMsMats:8434 · CYCLE_MS:8445 · MODE_ICON:8447 · STORM_MS:8454 · buildStars:8461 · buildStreetLamps:8484
glowTex:8502 · tickStreetLamps:8510 · beamPair:8527 · tickSearchBeams:8538 · buildBarrelFires:8575 · tickBarrels:8593
tickShootingStar:8603 · buildMist:8628 · tickMist:8638 · tickNightSound:8681 · tickSneak:8690 · tickStorm:8701
nvReady:8717 · nvEnter:8718 · nvExit:8724 · tickNvHint:8725 · dropGlowStick:8734 · tickGlowSticks:8751
buildFlashlight:8760 · setNight:8765 · setDayMode:8766 · tickNight:8780 · applyNightLook:8812 · tickFlashlight:8852
MSB_FIRST:8882 · MSB_GAP:8883 · MSB_WARN:8884 · MSB_KILL_WARN:8885 · MSB_NEAR:8886 · MSB_FLEE:8887
MSB_R:8888 · MSB_HOLD:8889 · MSB_MAX:8890 · MSB_DEAD_MS:8891 · MSB_BEEP:8892 · MSB_COVER_R:8895
MSB_PAD_R:8896 · MSB_COVER_RECHECK:8897 · msbEnsure:8902 · msbPlace:8919 · msbBarPos:8928 · msbHide:8935
resetMsBeam:8939 · msbCoverAt:8954 · msbAimBeside:8975 · msbBegin:8981 · msbAim:8998 · msbStrike:9029
msbKill:9068 · msbKickOut:9081 · tickMsBeam:9091 · TURBO_EVERY:9144 · TURBO_MS:9145 · TURBO_MUL:9146
TURBO_N:9147 · TURBO_TRACK:9148 · resetTurbo:9150 · turboPick:9155 · turboBegin:9162 · tickTurbo:9174
fit:9185 · tick:9191 · frame:9199 · build:9259 · start:9324 · exitWorld:9451

## js/lobby.js (52 บรรทัด · 3 รายการ)
PANEL_TITLES:9 · openPanel:19 · closePanel:29

## js/lobby3d.js (780 บรรทัด · 0 รายการ)

## js/main.js (282 บรรทัด · 5 รายการ)
syncMusicBtn:102 · showQuizBackPay:138 · showGiantRefund:182 · fitQbp:221 · bootGame:235

## js/moto3d.js (2,645 บรรทัด · 141 รายการ)
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
- 1814-1996 🧑‍🤝‍🧑 รอบ 317: เพื่อนในแผนที่เดียวกัน (/world/moto/<uid>)
- 1997-2038 🏟️👥 รอบ 640: งบวาดตัวเพื่อน (ใช้ NetRoom.drawBudget ร่วมกับโลกอื่น)
- 2039-2189 คำศัพท์ + ตัวอักษรบนถนน
- 2190-2499 สร้างโลกครั้งเดียว + ลูปเกม
- 2500-2645 เข้า/ออกโลก
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
dropPeer:1962 · netLeave:1969 · peerTick:1974 · PEER_DRAW_MAX:2002 · drawnPeers:2003 · drawSlotFree:2004
showPeerAgain:2005 · hidePeer:2012 · tickDrawBudget:2017 · spawnSlot:2025 · pickWord:2042 · spawnLetters:2052
renderWordHud:2070 · fitWord:2078 · collectTick:2085 · completeWord:2109 · relocTick:2134 · gpsTick:2149
miniTick:2158 · build:2193 · applyVehicleUi:2227 · fit:2256 · tick:2265 · carDrive:2275
frame:2324 · start:2503 · exitWorld:2575

## js/music.js (169 บรรทัด · 0 รายการ)

## js/netroom.js (807 บรรทัด · 19 รายการ)
CFG:41 · roomsAllowed:63 · HOT_KEYS:71 · COLD_KEYS:72 · HOT_BACK:73 · splitPayload:77
mergeBack:88 · metUids:100 · AIM_TTL_MS:119 · aimAt:121 · aimGet:125 · aimClear:129
MAPS3D:135 · whereFriends:136 · dbOf:160 · envReady:161 · isDenied:164 · create:176
drawBudget:780

## js/online.js (1,770 บรรทัด · 94 รายการ)
### 🗂️ สารบัญโซน js/online.js (Read/Edit เฉพาะช่วง)
- 2-201 ENGINE: ระบบออนไลน์จริงผ่าน Firebase Realtime Database
- 202-295 ระบบเพื่อน (ข้อ 0.3): รหัสเพื่อน + ค้นหา + ส่ง/รับคำขอ
- 296-485 ระบบแชทกับเพื่อน (ข้อ 0.4)
- 486-651 ระบบส่งของขวัญ (ข้อ 0.5)
- 652-768 🏪 ตลาดออนไลน์จริง (item 2 backlog): ซื้อ-ขายสินค้าที่เพื่อน "ผลิตเอง" ข้ามผู้เล่น
- 769-806 คำเชิญเล่นโลก 3D ด้วยกัน — /tinv/<toUid>/<fromUid> = {map,n,ts}
- 807-1003 📰 Follow + Feed กิจกรรม (รอบ 155) · 🌍 หน้า Feed ทุกคน + ไลก์/คอมเมนต์ (รอบ 639)
- 1004-1011 🌍 หน้า Feed ทุกคน + ไลก์/คอมเมนต์ (รอบ 639)
- 1012-1184 📰 รอบ 701 — ฟีดล็อบบี้ทีละโพสต์ + รีแอ็กชัน + แจ้งเตือน (ต่อยอดรอบ 639)
- 1185-1770 📞 โทรหาเพื่อน — Voice call / Video call แบบ LINE (รอบ 625 · กลุ่ม 3 คนรอบ 631)
### รายการ js/online.js
ONLINE_STALE_MS:63 · ONLINE_BEAT_MS:64 · LEADERBOARD_SIZE:65 · onlineDisplayName:69 · onlineActivity:77 · ensureOnlineId:93
onlineKey:103 · onlinePushPresence:108 · onlinePushScore:118 · fetchPlayerStats:152 · onlineRerender:174 · notifyFriendBadges:186
FRIEND_ALPHA:212 · friendCode:213 · friendSearch:225 · friendRequest:249 · friendAccept:258 · friendDecline:270
friendsHeal:280 · CHAT_MAX_LEN:304 · CHAT_KEEP:305 · chatPairId:307 · chatRef:310 · chatListen:316
chatSend:332 · chatDeleteMsg:348 · TYPING_TTL:356 · typingRef:358 · chatSetTyping:359 · chatClearTyping:369
chatWatchTyping:377 · chatThemeRef:395 · chatSetTheme:396 · chatWatchTheme:401 · chatPrune:409 · chatSeenTs:426
chatMarkSeen:432 · chatUnreadCount:444 · chatWatchSync:447 · GIFT_EXPIRE_MS:497 · giftSend:500 · greetSend:514
giftAccept:526 · giftDecline:530 · giftInWatch:536 · giftReclaim:567 · giftOutWatchSync:577 · giftOutRebuild:632
salesWatch:662 · salesRerender:670 · sellInc:674 · marketWatch:682 · marketList:715 · marketUnlist:723
marketBuy:732 · marketSoldWatch:745 · tinvSend:774 · tinvClear:781 · tinvWatch:785 · FEED_MAX:815
feedEvent:818 · feedPrune:830 · feedPurgeCat:841 · feedPushAssets:852 · petDescriptor:870 · feedPushPets:876
fetchPlayerPets:890 · followSet:906 · followUnset:917 · feedRebuild:924 · feedWatchSync:936 · fetchPlayerFeed:963
fetchPlayerAssets:976 · fetchFollowers:995 · GFEED_READ:1021 · GFEED_KEEP_ME:1022 · gfeedPush:1025 · gfeedPrune:1039
gfeedParse:1052 · gfeedWatchStart:1074 · gfeedWatchStop:1101 · gfeedNotifDiff:1109 · gfeedNotifPush:1123 · uidDisplayName:1130
gfeedRebuild:1141 · gfeedToggleLike:1158 · gfeedSetReaction:1163 · gfeedAddComment:1171 · CALL_RTC_CFG:1209 · CALL_RING_MS:1210
CALL_MAX_MS:1211 · CALL_MAX_PEERS:1212 · onlineStart:1628 · onlineLoadSDK:1745

## js/photo.js (361 บรรทัด · 25 รายการ)
PHOTO_LS_KEY:12 · PHOTO_MAX:13 · PHOTO_PREFIX:14 · PHOTO_SIZES:15 · PHOTO_QS:16 · PHOTO_ZMAX:17
photoValid:25 · photoOnline:28 · photoGet:31 · photoHas:32 · photoIsMine:33 · photoOf:36
photoFetch:44 · photoAfterChange:61 · photoPush:65 · photoVerify:83 · photoSaveUrl:93 · photoRemove:99
photoPullMine:106 · photoBlkSrc:122 · photoMiniHTML:129 · openPhotoMenu:137 · photoLoadImgEl:203 · photoLoadFile:211
openPhotoCrop:224

## js/state.js (1,129 บรรทัด · 91 รายการ)
STORAGE_KEY:6 · QUIZ_PASS_REWARD:11 · CURE_COST:13 · HUNGRY_SICK_MS:14 · MEAL_HOUR:16 · MEAL_FULL:17
SLEEP_FROM_HOUR:18 · SLEEP_SICK_HOUR:19 · WAKE_HOUR:20 · DINNER_COST:21 · TOXIN_FULL:23 · DETOX_COST:24
FOODQUIZ_Q:26 · FOODQUIZ_COIN:27 · FOODQUIZ_BONUS:28 · FOODQUIZ_MAX_PLAYS:29 · SHAPE_JUNK_MEALS:31 · SHAPE_CLEAN_MEALS:32
SHAPE_MISS_MEALS:33 · SHAPE_EXP_BONUS:34 · HEAT_SICK_MS:35 · THIRST_SICK_MS:36 · DEFAULT_STATE:38 · FEED_CATS:194
FEED_REACTIONS:208 · feedRx:216 · FEED_QUICK_CM:218 · SLOT_MS:230 · currentSlotStart:231 · nextSlotStart:237
mealDayKey:239 · nightKeyOf:241 · isNightNow:249 · newPet:254 · loadState:278 · saveState:547
activePet:554 · petStage:555 · isAdult:560 · abilityOn:561 · hasPetType:562 · todayStr:565
dailyTick:569 · addCoins:572 · QUEST_POOL:592 · QUEST_PER_DAY:601 · questsToday:602 · questTick:609
questEvent:613 · assetValue:649 · netWorth:675 · assetCount:677 · refreshRank:694 · heatProtected:710
rainProtected:714 · petHungry:717 · petShapeOf:721 · updatePetShape:727 · shapeMealDone:734 · heatPct:744
ymStr:753 · billOutstanding:757 · UTILITIES:764 · HOME_UTILITIES:770 · homeDecayed:772 · billTick:775
PET_FOOD_PER_PET:847 · petFoodTick:848 · myCar:874 · carLoanDue:879 · carLoanOverdue:884 · carLoanPayable:889
carLoanPay:896 · compTick:909 · ONLINE_RATE:923 · onlineEarnActive:924 · onlineEarnTick:928 · onlineEarnFlush:939
marketTick:949 · addCraft:973 · ORDER_MAX:992 · ORDER_LIFE_MS:993 · ORDER_GAP_MIN_MS:994 · ORDER_GAP_SPAN_MS:995
ORDER_TIER_WEIGHT:996 · newOrder:997 · orderTick:1010 · careTick:1018 · expNeed:1100 · addExp:1105
addRP:1125

## js/tpaward.js (41 บรรทัด · 0 รายการ)

## js/typing.js (369 บรรทัด · 0 รายการ)

## js/ui.js (9,140 บรรทัด · 363 รายการ)
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
- 1319-1846 การ์ด Leaderboard — สลับแท็บในการ์ดเดียว (ประหยัดพื้นที่):
- 1847-2211 การ์ดข้อมูลผู้เล่น 👤 — คลิกชื่อในการ์ดเพื่อน/กระดาน แล้วโชว์
- 2212-2462 แผงเพื่อน 👥 (ข้อ 0.3): รหัสเพื่อน + ค้นหา + คำขอ + รายชื่อเพื่อน
- 2463-2558 🌍 เพื่อนอยู่โลก 3D ไหน + ปุ่ม "ตามเข้าไป" (รอบ 642)
- 2559-2597 แชทกับเพื่อน (ข้อ 0.4) — กล่องแชทลอยกลางจอ + แผง emoji
- 2598-2999 รอบ 179: หน้ารวมข้อความ (inbox แบบ Messenger — ธีมกระจกฟ้า sci-fi ของเกม)
- 3000-3346 ระบบส่งของขวัญ (ข้อ 0.5) — ห้องของขวัญ + กล่องเลือกส่ง + ฉากเปิด
- 3347-3439 RANK CARD + ฉากเลื่อนแรงค์
- 3440-3442 PET DASHBOARD
- 3443-3511 📰 รอบ 155: overlay ข้อมูลน้อง & การดูแล + ฟีดกิจกรรมเพื่อน
- 3512-3915 📰 รอบ 701 — ฟีดล็อบบี้ "ทีละโพสต์" แบบ Facebook (ผู้ใช้สั่ง 29 ก.ค. 2026)
- 3916-4075 🌍 รอบ 639: หน้า Feed เต็มจอ — ทุกคน (ไม่ใช่แค่ follow) + ไลก์/คอมเมนต์
- 4076-4741 📖 Dictionary ค้นหาคำศัพท์ (รอบ 254 ผู้ใช้สั่ง 16 ก.ค. 2026)
- 4742-4785 การนอน (คิว 7725691507 ข้อ 1)
- 4786-5167 ให้อาหาร (ระบบมื้อเย็น 18:00 + ความอิ่มสะสม — ข้อ 2+3)
- 5168-5286 🛡️ ควิซอาหารปลอดภัย (ต่อยอดข้อ 5.1)
- 5287-5372 🎀 ห้องแต่งตัวสัตว์เลี้ยง (รอบ 635: แยกออกจาก "ร้านค้า" เดิม —
- 5373-5560 ที่พัก (หลบแดด/หลบฝน) + เครื่องปรับอากาศ
- 5561-5678 บิลสาธารณูปโภค (ค่าไฟ/ค่าน้ำ — เครื่องยนต์อยู่ใน state.js: UTILITIES/billTick)
- 5679-5761 การ์ดมือถือ (ข้อ 7): ซื้อ 10,000 ขายคืน 6,000
- 5762-5772 การ์ดคอมพิวเตอร์ (ข้อ 11): ซื้อ 50,000 ขายคืน 30,000
- 5773-5817 item 8: โบนัสออนไลน์ +0.01 เหรียญ/วิ ฟรีทุกคนที่เปิดเกมออนไลน์อยู่
- 5818-6015 💻 รอบ 706 (ผู้ใช้สั่ง 29 ก.ค. 2026): ช่องรายได้คอมพิวเตอร์บนแถบบนล็อบบี้
- 6016-6232 🎫 การ์ดตั๋วโลกผจญภัย (คิว 7725691507 ข้อ 7)
- 6233-6315 🎃 การ์ดตั๋วโลกผีสิงกลางคืน (ต่อยอดข้อ 8 · ผู้ใช้เคาะ 7 ก.ค.)
- 6316-6462 🚁 การ์ดตั๋วโลกเฮลิคอปเตอร์ Bell (รอบ 52)
- 6463-6562 🛸 การ์ดตั๋วโลกโดรน FPV Racing (รอบ 85) — ซื้อได้เมื่อมีตั๋วเฮลิคอปเตอร์
- 6563-6753 🚗 การ์ดตั๋วโลกขับรถกำแพงเพชร (รอบ 113) — ซื้อได้เมื่อมีตั๋วโดรน FPV
- 6754-6846 ⚽ การ์ดตั๋วโลกสนามฟุตบอล (รอบ 196) — ซื้อได้เมื่อมีตั๋วขับรถ
- 6847-6942 🏍️ การ์ดตั๋วโลกมอเตอร์ไซค์บ้านโพธิ์สวัสดิ์ (รอบ 293) — ซื้อได้เมื่อมีตั๋วขับรถ
- 6943-7040 🛸 การ์ดตั๋วโลก "ยานแม่บุกโลก" (Invasion · รอบ 413)
- 7041-7085 🌍 ปุ่มลัดเข้าโลก 3D ในรางเมนูซ้าย (ผู้ใช้สั่ง 9 ก.ค. 2026)
- 7086-7231 🧭 ป้ายบอกทางของรางเมนูซ้าย (รอบ 601 · ผู้ใช้สั่ง 26 ก.ค. 2026)
- 7232-7401 การ์ดสวนผลไม้ (ข้อ 12): ซื้อต้นไม้ปลูกได้ไม่จำกัด แต่ละต้นออกผล
- 7402-7411 โรงงานผลิตสินค้า 🏭 + ตลาดขายต่อ (แนวคิดใหม่ 5 ก.ค. 2026)
- 7412-7434 โรงงานผลิต (แผง 🏭) — แยกออกจากตลาด (ผู้ใช้สั่ง 6 ก.ค. 2026)
- 7435-7585 ตลาดขายสินค้า (แผง 🏪) — แยกออกจากโรงงาน
- 7586-8497 🚗 รอบ 131: หมวดยานพาหนะ — โชว์รูมรถ 10 คัน (แคตตาล็อก 5 ช่อง/แถว)
- 8498-8558 ร้านสัตว์เลี้ยง (ซื้อเพิ่มได้ ไม่ลบตัวเดิม)
- 8559-8595 เลเวลอัพ (รายตัว)
- 8596-8701 สถิติผลการเรียนรู้
- 8702-8739 item 4: การ์ดสรุปส่งครู — ใบเดียวจบ ชื่อ/วัน-เวลา/เหรียญวันนี้/แรงค์/สอบล่าสุด
- 8740-9140 📞 หน้าจอโทรหาเพื่อน — สายเสียง (รอบ 625 · กลุ่ม 3 คน + ปิดวิดีโอ รอบ 631)
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
lbBadgeSections:1502 · lbDemoRows:1527 · lbChar:1549 · lbfAwardBarHtml:1559 · openLeaderboardFull:1571 · BLK_PAD:1696
BLK_PAD_NEW:1701 · BLK_TOP_FIX:1702 · seatPodChars:1703 · lbCoinHtml:1715 · lbBadgeHtml:1731 · lbBossHtml:1757
lbWordSearchHtml:1780 · lbTypingHtml:1816 · bindPlayerClicks:1852 · showPlayerCard:1862 · petDescImg:2141 · openImgLightbox:2154
openPetPeek:2174 · updateBillBadges:2218 · setBadge:2228 · tinvPendingCount:2244 · updateSettingsBadge:2253 · openAttentionSummary:2268
updateFriendBadge:2326 · renderFriendPanel:2336 · friendDoSearch:2384 · refreshFriendData:2408 · FRW_TTL_MS:2473 · FRW_MIN_GAP:2474
frwWorldOf:2478 · frwPanelOpen:2481 · frwScan:2486 · frwPaint:2508 · frwPaintHint:2529 · frwFollow:2543
CHAT_EMOJI_CATS:2564 · CHAT_THEMES:2586 · CHAT_SECRET_MS:2595 · chatBadgeSync:2603 · ibTimeStr:2611 · IB_CALL_RE:2620
ibCallInfo:2621 · openChatInbox:2626 · chatFitKeyboard:2796 · openChat:2812 · giftImg:3003 · giftDateStr:3005
GREETS:3013 · GREET_EXP:3021 · greetInfo:3022 · openGreetPicker:3026 · giftItemPic:3068 · giftItemName:3076
updateGiftBadge:3082 · renderGiftPanel:3091 · acceptGift:3149 · declineGift:3172 · showGreetReveal:3181 · showGiftReveal:3208
openGiftPicker:3234 · confirmSendGift:3302 · doSendGift:3326 · rankBadgeHTML:3350 · renderRankCard:3355 · renderRankTab:3389
showRankUp:3417 · bindPetPlateButtons:3452 · openPetInfoOverlay:3481 · feedAgo:3504 · FEED_DECK_MAX:3524 · FEED_SLIDE_MS:3525
FEED_RESUME_MS:3526 · feedPostImgIndex:3531 · feedPostImg:3542 · feedPostByKey:3551 · feedCanReact:3554 · fpStatsHTML:3559
fpNameBadgesHTML:3575 · fpostHTML:3579 · renderFeedCard:3614 · feedDeckGo:3652 · feedDeckTick:3672 · renderFeedBell:3694
feedNotifArrived:3702 · openFeedNotif:3709 · closeRxPicker:3743 · openRxPicker:3747 · feedFlyWord:3767 · feedPickRx:3778
openFeedComments:3791 · closeFeedComments:3805 · renderFeedComments:3811 · bindFeedPostEvents:3870 · openFeedBoard:3922 · renderFeedBoardLive:3943
renderFeedBoard:3961 · stageColLeft:3980 · alignPetTabs:3989 · alignFeedPlate:4001 · alignProfilePlate:4012 · alignStageLeft:4028
alignStageCols:4039 · watchStageCols:4053 · alignCureBtn:4063 · dictRecordLookup:4087 · DICT_FILE_COUNT:4098 · loadDict:4099
dictSearch:4114 · dictTapWords:4129 · dictEntryHTML:4133 · openDictOverlay:4144 · renderDashboard:4228 · sleepBtnHTML:4747
sleepHintHTML:4754 · sleepAllPets:4765 · wakeAllPets:4778 · feedPet:4789 · openFoodMenu:4803 · feedWith:4874
AVATAR_UI:4904 · playerAvatarHTML:4908 · SHAPE_UI:4916 · showFeedResult:4925 · curePet:4966 · heartsFx:4989
PAT_HOLD_MS:5012 · PAT_EXP:5013 · bindPetTap:5014 · petBounce:5032 · petMood:5038 · shortPatPet:5045
longPatPet:5053 · patCalendarHTML:5073 · patStreakTick:5101 · cureCelebrateFx:5127 · railCureClick:5138 · detoxPet:5150
openFoodQuiz:5173 · closeDressUpBoard:5292 · openDressUpBoard:5296 · renderShop:5313 · homeVisualHTML:5376 · showHomeRuined:5390
showCutNotice:5411 · renderHomeCard:5429 · payMaint:5513 · trashBillUI:5529 · payTrash:5546 · UTILITY_UI:5565
utilityBillUI:5614 · payUtility:5639 · buyUtilityFix:5665 · renderPhoneCard:5683 · buyPhone:5723 · sellPhone:5745
compLiveTotal:5766 · onlineLiveTotal:5777 · syncCoinHeader:5784 · flashPillGain:5789 · renderOnlineEarnPill:5798 · renderCompEarnPill:5823
openPillInfo:5856 · renderComputerCard:5939 · buyComputer:5974 · sellComputer:5997 · soldCount:6023 · soldBadge:6024
renderTicketCard:6029 · loadScriptOnce:6085 · loadAdv3d:6102 · enterAdventure3D:6110 · pickAdvMap:6135 · enterHaunted3D:6170
advHealClick:6192 · buyTicket:6212 · renderHauntCard:6238 · buyHauntTicket:6294 · renderHeliCard:6321 · buyHeliTicket:6379
enterHeli3D:6402 · pickHeliMap:6428 · renderDroneCard:6467 · buyDroneTicket:6522 · enterDrone3D:6545 · renderDriveCard:6568
buyDriveTicket:6642 · enterDrive3D:6665 · pickDriveMap:6700 · enterMotoMapAsCar:6736 · renderSoccerCard:6758 · buySoccerTicket:6806
enterSoccer3D:6829 · renderMotoCard:6852 · buyMotoTicket:6901 · enterMoto3D:6924 · renderInvasionCard:6947 · INVASION_REWARD:6996
buyInvasionTicket:6998 · enterInvasion3D:7022 · WORLD3D:7047 · gotoRobotShop:7058 · scrollShopCardIntoView:7063 · railWorldClick:7066
railScrollHint:7091 · railScrollTop:7099 · initRailScroll:7104 · renderRailWorlds:7124 · tinvNoticeHTML:7185 · openTinvPicker:7193
fruitCountdown:7237 · renderFarmCard:7249 · renderFarmClock:7324 · buyFruit:7340 · sellFruit:7360 · sellAllFruit:7381
collectImg:7410 · renderFactoryCard:7416 · renderMarketCard:7439 · updateWishBadge:7495 · openWishlistDialog:7506 · bindStripArrows:7551
renderMarketBrowse:7563 · carImg:7592 · renderVehicleShop:7593 · CS_CYCLE_MS:7644 · carInteriorImg:7645 · carStatHtml:7647
renderCarShowroom:7654 · csShowBig:7681 · csInit:7708 · RS_CYCLE_MS:7731 · robotImg:7732 · renderRobotShop:7733
rsShowBig:7755 · rsInit:7776 · buyRobot:7795 · enterMecha3D:7817 · pickMechaRobot:7838 · pickDriveCar:7870
openCarBuyDialog:7913 · buyCarInsurance:7974 · payCarLoanMonthly:7993 · payCarLoanFull:8005 · carDriveBlock:8024 · gotoVehicleShop:8029
gotoMyStock:8034 · showNeedCarDialog:8040 · craftDiscount:8052 · renderFactory:8055 · renderOrdersUI:8124 · startProduce:8143
buyCollectible:8171 · cancelProduce:8199 · deliverOrder:8213 · renderOrderClock:8230 · renderCollectMine:8240 · openListDialog:8282
cancelListing:8335 · buyMarketItem:8358 · showCollectReveal:8385 · buyAC:8423 · openHomeShop:8442 · renderPetShop:8501
showLevelUp:8562 · renderStats:8599 · showTeacherCard:8706 · CALL_REACT_EMOS:8750 · CALL_TALK_MIN:8753 · CALL_TALK_HOLD:8754
CALL_ORDER_GAP:8756 · CALL_TONES:8762 · startCall:9136

## js/util.js (997 บรรทัด · 41 รายการ)
shuffle:6 · fmtNum:15 · escapeHTML:19 · gradeSymbol:32 · gradeMark:47 · nameWithGrade:55
gradeMarkCanvas:61 · gradeOf:77 · seededRand:92 · fmtThaiDT:102 · fmtThaiDate:106 · showScreen:111
TOAST_WARN_RE:121 · restackToasts:124 · toast:146 · floatFx:166 · beep:177 · soundStatus:198
PET_MOOD:269 · petVoiceSynth:276 · sirenSynth:353 · playCashier:377 · cashierSynth:391 · keyTapSynth:424
playSpark:465 · sparkSynth:479 · thunderFx:514 · wordAudioFile:582 · speakCutOff:591 · speakWord:595
speakLetter:619 · pickSpeakVoice:642 · speakWordTTS:653 · askNameDialog:673 · askConfirm:718 · alertBox:736
applyNoAnim:756 · BLK_VOCAB:763 · openSettings:811 · openHelp:952 · openTeacherGuide:978

## js/vocabbook.js (207 บรรทัด · 14 รายการ)
VB_MAX:11 · VB_QUIZ_N:12 · VB_QUIZ_MIN:13 · vbGroup:16 · VB_GROUP_UI:21 · vbRecord:24
vbSeen:49 · vbStats:62 · vbList:70 · vbReviewCat:81 · vbStartReview:95 · openVocabBook:106
vbRender:148 · vbCardHTML:194

## js/wordsearch.js (414 บรรทัด · 0 รายการ)

## js/wsaward.js (32 บรรทัด · 0 รายการ)

## css/exam.css (327 บรรทัด · 72 selector)
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
.xsp-best:214 · .xsp-btns:215 · .xsp-go:216,220,221,224(+1) · .xsp-foot:226 · .xsb-box:229 · .xsb-head:234,235
.xsb-grid:236 · .xsb-card:237,241 · .xsb-emoji:242 · .xsb-name:243 · .xsb-info:244 · .xsb-done:245

## css/lobby.css (4,820 บรรทัด · 725 selector)
:root:6 · html:15 · body:16 · *:33,34,35,36 · #app:39 · h1:41
.subtitle:42 · .shop-title:43 · #rotate-overlay:46 · .screen:68 · #screen-select:77,78,79,80(+5) · .egg-need:87
.petshop-topright:89 · .petshop-play-link:90,95 · #screen-game:137,138,139,140(+7) · #screen-quiz:151,152,153,154(+6) · #quiz-choices:163,164 · .word-card:171
.quiz-choice:172,173,174 · .big-btn:177,178,179,180 · #screen-dashboard:185,1070,1078 · .lobby-top:192,825,826,827(+27) · .top-flex:193 · .profile-plate:194,198,746,3433(+12)
#rain-fx:203 · .rain-layer:206,212 · .rain-glass:219 · .glass-drop:220 · .rail-btn:235,838,844,845(+16) · .rail-badge:236
.fr-code-box:241 · .fr-code-label:245 · .fr-code-row:246 · .fr-code:247 · .fr-copy-btn:252,256,261,262 · .fr-search-btn:257
.fr-add-btn:258 · .fr-accept:259 · .fr-decline:260 · #fr-search-input:263 · #fr-search-result:267 · .fr-found:268
.fr-hint:272 · .fr-list-title:273 · .fr-row:274 · .fr-req:278 · .fr-row-name:280,284,4600 · .fr-row-status:288
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
.pl-click:694,696,697 · .pl-overlay:698 · .pl-card:702,2571 · .pl-close:708 · .pl-head:712,2429,2432 · .pl-grade:717,4606,4607
.pl-body:718 · .pl-loading:719 · .pl-none:720 · .pl-me-tag:721 · .pl-blk-wrap:723 · .pl-blk:724
.pl-stat:725 · .pl-lbl:730 · .pl-val:731,732 · .pl-tip:733 · .chip-edit:739,744,745 · .rank-mini:751,757,758,759
.pass-photo:761,766 · .pet-tabs:768 · .dict-box:769,773,774,775(+1) · .dict-card:781,786,790,791(+2) · .dict-head:787,788 · .dict-trail:795,799
.dt-c:800,804,805 · .dt-sep:806 · .dict-today:807 · .di-w:809,810,811 · .dict-list:812 · .dict-item:813,817,818,819(+5)
.lobby-mid:833 · .rail-wrap:836,861,865,866(+3) · .lobby-rail:837 · .rail-nudge:868,876,877,880(+1) · .rail-worlds:887 · .rail-div:888
.lobby-stage:930,932,948,1075(+13) · .newword-banner:938,945,950,3985(+2) · .coin-fly:961,964 · .coin-plus:970 · .nw-pop-coin:985,987,988 · .nw-pop-goal:991,992,996,1000
.nw-goal-head:993,995,997 · .nw-goal-bar:998 · .nw-goal-fill:999 · .nw-pop-book:1001,1002 · .nw-tag:1023,3991,4013 · .nw-word:1028,3995,4018,4107
.nw-hint:1030,1031,3996,4020(+1) · .nw-coin:1033,1036,3997,4001 · .nw-countdown:1041,4002 · .nw-bar:1043,4021 · .nw-bar-fill:1045 · .pet-stage:1048,2865
.nw-box:1055,2874 · .nw-pop-word:1056 · .nw-speak:1057 · .nw-pop-phon:1058 · .nw-ipa:1059 · .nw-pop-sent:1060
.nw-pop-mean:1061 · .pet-tab:1062,1063,1064,3239 · .stage-hero:1085,1100,1108,1253(+22) · .hero-ground:1122,1242,1248 · .hero-rank-bg:1124,1127,1130,1134(+18) · #lobby3d-canvas:1147,1148
.hero-scene:1152,1154,1161,1162(+8) · .caretaker-fig:1201 · .caretaker-img:1204 · .caretaker-emoji:1206 · .blk-rig:1213,1214,1215 · .stage-plate:1275,1283,1294,1295(+23)
.plate-title:1289 · .lobby-side:1322,1358,1363,1366(+22) · .side-sec:1325,2141,3135,3411 · .side-label:1326,1331 · .side-label-row:1334,1335 · .lb-tabs-out:1336,1337,1341
.side-glass:1345,1352 · .side-card:1364,1475 · #quest-card:1376,1377,1405,1406(+6) · .q-bigcard:1382,1411 · .qb-top:1384 · .qb-emoji:1385
.qb-name:1387 · .qb-bar:1388,1389 · .qb-row:1391 · .qb-prog:1392 · .qb-reward:1393 · .qb-go:1394,1398
.q-dots:1399 · .q-dot:1400,1401,1402 · .q-bonus:1403 · .inv-card:1422,1424,1425 · .inv-btns:1426 · .inv-go:1427,1429
.inv-x:1430 · #online-card:1434,3143,3144,3145(+4) · .fq-overlay:1435 · .fq-box:1437,2949 · .fq-head:1441,1443 · .fq-close:1444
.fq-sec:1446 · .fq-worlds:1447 · .fq-world:1448,1450 · .fq-acts:1451 · .fq-act:1452,1455,1456 · .lb-prize:1489
.lb-coins:1492 · .lbf-cell:1493,2498,2501,2502(+3) · .lb-award-bar:1495,1501,1502 · .lb-award-go:1503 · .lbf-award:1505,1511,1512,1513 · .pod-pz:1514
.wsa-overlay:1517 · .wsa-box:1519 · .wsa-head:1524 · .wsa-title:1525 · .wsa-when:1526,1527 · .wsa-close:1528,1531
.wsa-cols:1532 · .wsa-col:1533 · .wsa-sec-h:1534,1535 · .wsa-msg:1536 · .wsa-msg-h:1539 · .wsa-msg-b:1540,1541
.wsa-msg-none:1542 · .wsa-rules:1544,1545 · .wsa-list:1546 · .wsa-row:1547,1549 · .wsa-r:1550 · .wsa-n:1551
.wsa-s:1552 · .wsa-p:1553 · .wsa-prizes:1554 · .wsa-pz:1555,1558 · .wsa-reveal-medal:1559 · .lobby-bottom:1569,1571
.lobby-quiz-btn:1572 · .lobby-book-btn:1573,1574 · .lobby-foodquiz-btn:1575,1576 · .lobby-play-btn:1577,1581 · .lobby-exam-btn:1583,1584,1586 · .panel-overlay:1591,1596,4122,4123(+8)
.panel-box:1597 · .panel-head:1604,1608 · .panel-close:1609,1614 · .panel-body:1615,1619,1620 · .panel-page:1617,1618 · .collect-sub:1624
.mkt-empty:1625 · .craft-box:1626 · .mkt-listing:1627 · .mkt-filter:1628,1972 · .hq-grid:1635 · .hq-card:1636,1641,1665
.hq-head:1642 · .hq-pic:1648,1650 · .hq-emoji:1652 · .hq-badge:1653 · .hq-stars:1657 · .hq-price:1658,1663,1664,1667(+6)
.craft-credit:1671,1673,1674 · .car-grid:1681,1683,1684 · .robot-weap:1685 · .dmap-box:1688,1689 · .dmap-grid:1695 · .dmap-card:1697,1700,1701,1702(+2)
.dmap-ico:1704 · .dmap-new:1707 · .dcp-grid:1709 · .dcp-card:1711,1714,1715,1716(+10) · .levelup-box:1733,2828,2829,2946 · .dcp-box:1736,1737,1741,1742(+6)
.dcp-lock:1750 · .sold-badge:1754,1756,1757 · .rs-showroom:1759,4558,4559 · .rs-list:1760,1762,4539,4542 · .rs-thumb:1763,1765,1766,1767(+1) · .rs-thumb-pic:1768,1769
.rs-thumb-price:1770 · .rs-stage:1772 · .rs-big:1775 · .rs-big-img:1776 · .rs-elec:1780,1784,1789 · .rs-edge:1790,1796
.rs-info:1799,1800,1801,1802(+1) · .rs-buy:1804,1806,1807 · .cs-showroom:1811,4531,4532,4560(+3) · .cs-list:1812,1814,4533,4538(+9) · .cs-thumb:1815,1817,1818,1819(+1) · .cs-thumb-pic:1820,1821
.cs-thumb-name:1822 · .cs-thumb-price:1823 · .cs-thumb-own:1824 · .cs-stage:1826 · .cs-big:1829 · .cs-big-img:1830
.cs-elec:1834,1838,1842 · .cs-edge:1843,1849 · .cs-interior:1852 · .cs-inr-label:1853,1854 · .cs-inr-img:1855 · .cs-info:1857,1858,1859,1860(+6)
.cs-buy:1868,1870,1871,1872 · .car-emoji:1874 · .car-mine:1880 · .car-mine-pic:1885 · .car-mine-info:1886 · .car-loan:1887,1888
.car-mine-btns:1889,1890,1891 · .car-locked:1893 · .car-mine-head:1895 · .car-pick-list:1896,1897 · .car-pick:1898,1900,1901 · .car-pick-pic:1902,1903
.car-pick-name:1904,1905 · .car-pick-od:1906 · .car-buy-box:1908,2953 · .cb-pic:1909,1910,1911 · .cb-lines:1912 · .cb-li:1913,1917,1918
.cb-ins:1919,1923,1924 · .cb-plan:1925 · .cb-pl:1926,1931,1933,1937(+1) · .cb-total:1944 · .cb-btns:1945,1950 · .cb-x:1946
.shop-grid:1953 · .shop-item:1954,1959,1964,1965(+3) · .mkt-tab:1973,1974 · .pg-btn:1975,1976,1977 · .pg-dot:1978 · .fr-gift-btn:2001,2006
.gift-sec-title:2009 · .gift-in-row:2011 · .gift-out-row:2015 · .gift-in-pic:2016,2018,2019 · .gift-in-info:2020,2021 · .gift-in-btns:2022
.gift-accept:2023,2027,2029 · .gift-decline:2028 · .gift-box-card:2030 · .gift-box-from:2031,2032 · .gift-note:2033 · .gift-pick-overlay:2036
.gift-pick-box:2040 · .gift-pick-head:2046,2050 · .gift-pick-close:2051 · .gift-pick-tabs:2053 · .gp-tab:2054,2058 · .gift-pick-body:2059
.gp-chips:2060 · .gp-chip:2061,2065 · .gp-card:2066,2067 · .gp-price:2068 · .gp-note:2069 · .gift-cf-pic:2070
.chat-emoji-cats:2075 · .chat-emoji-cat:2079,2083,2084 · .chat-emoji-wrap:2085,2086 · .stage-left:2095,4113 · .pet-info-btn:2099,2106,2107 · .feed-list:2114,2118,2143,2144(+1)
.feed-empty:2119,2122 · .fd-tools:2128 · .feed-bell:2129,2131,2132,2133 · .fd-prog:2137,2138 · .fpost:2145,2710 · .fp-head:2150
.fp-who:2151 · .fp-name-line:2154 · .fp-name:2155 · .fp-when:2156 · .fp-badges:2158,2161 · .fp-badge-ic:2159
.fp-text:2163 · .fp-media:2166 · .fp-img:2168 · .fp-cap:2170 · .fp-big:2171 · .fp-sum:2173,2175
.fp-sum-rx:2176 · .fp-sum-none:2177 · .fp-en:2178 · .fp-bar:2180 · .fp-act:2181,2185,2187 · .fp-like:2186
.fp-page:2198,2199,2200,2201(+3) · .fp-rxbox:2204 · .fp-rxb:2208,2210,2211,2212(+1) · .fp-rxb-off:2214 · .fp-fly:2216,2219,2220 · .fcm-overlay:2223
.fcm-box:2225 · .fcm-post:2229,2230 · .fcm-rxs:2231 · .fcm-rx:2232 · .fcm-list:2233,2235 · .fcm-row:2236,2237,2238
.fcm-none:2239 · .fcm-quick:2241,2243 · .fcm-q:2244,2247,2248 · .fcm-add:2249 · .fcm-input:2250,2252 · .fcm-send:2253,2255
.fcm-locked:2256 · .fnt-overlay:2258 · .fnt-box:2260 · .fnt-list:2264,2266 · .fnt-row:2267,2269 · .fnt-ico:2270
.fnt-tx:2271,2272 · .fnt-sub:2273 · .feed-plate:2275 · .feed-all-btn:2276,2281 · .fdb-overlay:2286 · .fdb-box:2288
.fdb-head:2292 · .fdb-close:2296,2298 · .fdb-live:2299 · .fdb-live-title:2300 · .fdb-live-rows:2302,2304,2305 · .fdb-live-row:2306,2308,2309,2310
.fdb-dot:2311 · .fdb-list:2313,2314 · .fdb-empty:2315 · .fdb-row:2316 · .fdb-row-top:2318 · .fdb-ico:2319
.fdb-txt:2320 · .fdb-name:2321 · .fdb-ago:2322 · .fdb-actions:2323 · .fdb-like:2324,2327,2328,2329 · .fdb-cm-list:2330
.fdb-cm-row:2331,2333 · .fdb-cm-empty:2334 · .fdb-cm-add:2335 · .fdb-cm-input:2336,2338 · .fdb-cm-send:2339,2341 · .fdb-cm-locked:2342
.pi-overlay:2345 · .pi-box:2349,2354,2355,2359(+3) · .pi-close:2361,2366,2367 · .pi-close-left:2369 · .pi-portrait:2371 · .pet-wear:2378,2381,2383
.pi-portrait-wrap:2386,2388 · .pi-dress-btn:2396,2400,2401 · .pi-shape-cap:2402,2405,2406,2407 · .pi-shape-toggle-btn:2409,2412 · .pi-dress-pip:2414,2419,2420,2421(+1) · .pi-wear-note:2424,2426
.greet-card:2433 · .greet-sub:2434 · .greet-grid:2435 · .greet-opt:2436,2439,2440,2441 · .greet-e:2442 · .pi-streak:2446
.pi-streak-head:2448,2450 · .pi-streak-best:2451 · .pi-dots:2452 · .pi-dot:2454,2455,2456 · .pi-streak-note:2457 · .pi-care-title:2458
.lbf-overlay:2461 · .lbf-box:2464,2478,2479,2480(+10) · .lbf-head:2469 · .lbf-title:2470 · .lbf-tabs:2471,2474 · .lbf-note:2477
.lbf-close:2493 · .lbf-close-l:2494 · .lbf-body:2495 · .lbf-grid:2496 · .lbf-bcat-wrap:2511,2513 · .lbf-bcat:2514
.lbf-bcat-head:2515,2516,2517 · .lbf-bcat-badge:2522,2525 · .lbcat-ic:2523 · .lbcat-ic-label:2526 · .lbf-bcat-rows:2527 · .lbf-bcat-row:2528,2530,2531,2533
.lbf-podium:2537 · .pod:2539,2566,2567 · .pod-char:2541 · .pod-base:2543 · .pod-rank:2545 · .pod-label:2547,4602
.pod-name:2549 · .pod-sc:2551 · .pod-1:2556,2557 · .pod-2:2558,2559 · .pod-3:2560,2561 · .pod-4:2562,2563
.pod-5:2564,2565 · .pl-wide:2584,2587,2588,2589(+8) · .pl-follow:2590,2595,2597 · .pl-unfollow:2599,2605,2606 · .pl-followers:2607 · .pl-cols:2608,2613,2614,2615
.pl-col:2609 · .pl-sec-title:2610 · .pl-badges-col:2616 · .pl-feed:2617,2620,2627 · .pl-feed-row:2621,2625,2626 · .pl-assets-wrap:2629,4439,4514
.pl-assets:2630,4442,4447,4453(+4) · .pl-asset:2633,2637,2644 · .pl-asset-emoji:2638 · .pl-asset-n:2639 · .pl-pets-wrap:2646 · .pl-pets:2647
.pl-pet:2648,2653,2655 · .pl-pet-nm:2656 · .img-lightbox:2659,2664,2665,2669(+3) · .cert-svg:2688 · .cert-tap:2689,2694 · .cert-chip-sm:2697
.pl-sec-sub:2717 · .pl-certs:2718,2720 · .cert-mini:2721,2725,2727 · .cert-mini-cap:2728 · .cert-none:2730 · .lv-cert-row:2732,2734
.lv-cert-btn:2735,2740 · .cert-lightbox:2742,2747,2748,2752(+3) · .pl-chat:2772,2777 · .pl-call:2779,2785 · .pet-peek:2786,2787 · .pp-chips:2789
.pp-chip:2790 · .pp-gift:2795,2801 · .settings-box:2803,2804,2878,2883(+27) · .set-feed-head:2805 · .set-feed-sub:2809 · .set-feed-row:2810
.pillinfo-val:2815 · .pillinfo-desc:2820,2839 · .pillinfo-box:2831 · .plf-head:2834 · .plf-emoji:2835 · .plf-ht:2836,2837,2838
.plf-foot:2840,2842,2843 · .alert-box:2848,2850 · .ab-emoji:2851 · .ab-title:2852 · .ab-desc:2853 · .ab-btns:2854,2855,2856
.heal-heart:2858 · .attn-box:2873 · .help-box:2924,2925,2926 · .wl-box:2947 · .food-box:2948 · .home-shop-box:2950
.summary-box:2951 · .report-box:2952 · .wl-grid:2955 · .tc-wrap:2957 · .spell-btn:2963,2968 · .sp-hud:2969
.sp-word:2971 · .sp-ch:2972,2977 · .sp-th:2979 · .sp-hint:2981 · .sp-exit:2984,2988 · .sp-banner:2989
.sp-big:2994 · .sp-thb:2996 · .sp-coin:2997 · #spell-confetti:3002 · .sp-rb:3003 · .sp-day:3013
.sp-perfect:3015 · .sp-late:3017 · #spell-coinpop:3020 · .side-sub:3129,3131 · .sec-quest:3136 · .on-page:3147,3148,3149,3150
.inbox-overlay:3160 · .ib-box:3162 · .ib-head:3166 · .ib-close:3170,3172 · .ib-list:3173,3174 · .ib-row:3175,3176,3177,3178
.ib-ava:3179,3184,3185 · .ib-on:3186 · .ib-mid:3188 · .ib-name:3189 · .ib-last:3190 · .ib-meta:3191
.ib-time:3192 · .ib-dot:3194 · .ib-story-badge:3197 · .ib-empty:3201 · .ib-story:3203,3205 · .ib-story-item:3206,3208,3215
.ib-story-ava:3209 · .ib-story-on:3213 · .ib-world:3218,3221 · .ib-tabs:3223 · .ib-tab:3224,3227,3229 · .ib-tab-dot:3230
.ib-call-ava:3234 · .ib-call-row:3235,3236 · #btn-music:3242,3245,3246 · #ws-overlay:3261 · #ws-board:3264,3270,3272 · .ws-head:3275
.ws-title:3276 · .ws-findbar:3279 · .ws-tip:3280 · .ws-grade:3282,3283 · .ws-body:3286 · .ws-gridwrap:3287
#ws-grid:3290 · .ws-cell:3295,3300,3303,3306(+2) · .ws-flash:3312,3314 · .ws-coinpop:3318,3342 · .ws-combo:3329,3333,3334,3335 · .ws-find:3346
#ws-prog:3347 · #ws-words:3351,3355 · .ws-word:3357,3362,3363,3364(+2) · .ws-actions:3370,3371,3380 · .ws-sizes:3375 · .ws-sizes-lb:3377
.ws-size-now:3378 · #ws-new:3381 · #ws-stash:3382 · #ws-clear:3383 · #ws-win:3384,3386 · .ws-win-in:3387,3390
.sec-online:3413 · .rank-tab:3441,3442,3443,3444(+2) · .pet-show-bg:3474,3477,3481,3485(+19) · .ps-night-fx:3577,3579,3591,3596(+1) · .pet-show:3606,3609,3621,3623(+22) · .ps-video:3742
.ps-worn-pip:3820,3821 · .id-card:3844,3851,3855 · .id-chip:3868 · .clock-chip:3877,3878 · .coin-block:3894 · .coin-group:3895
.coin-pill:3925,3926,3947 · .cp-lb:3950 · .cp-v:3951 · .nw-sub:4019 · .top-flex2:4110 · #panel-factory:4129,4130,4134,4135(+39)
#panel-rank:4270,4271,4277,4282(+11) · .grid2x8:4353,4359 · .grid1x5:4369,4375 · .pl-badges-strip:4381 · .pl-badge-card:4385,4391 · .pl-badge-card-ic:4392,4396
.pl-badge-card-nm:4397 · .pl-badges-empty:4403,4405 · .mine-strip:4419,4421,4422,4427(+4) · .mb-strip:4433,4472 · .gmark:4580,4584,4585,4586(+1) · .gm-stack:4589,4593
.gm-row:4595 · .lb-name:4597,4598,4599 · .grade-edit:4620,4625,4626 · .gradelock-box:4630,4646,4651,4653 · .gl-head:4631 · .gl-emoji:4632
.gl-ht:4633 · .gl-cur:4634 · .gl-lock:4635,4640 · .gl-ok:4639 · .gl-lock-sub:4641 · .gl-why:4642
.gl-pick-lb:4643 · .gl-opts:4644 · .gl-hist:4654 · .gl-hline:4655 · .gl-hg:4659 · .gl-hat:4660
.gl-harr:4661 · .gl-foot:4662 · .gl-cf:4663 · .reg-gradelock:4685 · #tp-overlay:4695 · #tp-board:4697,4701
.tp-head:4705 · .tp-title:4706 · .tp-stat:4708,4710 · .tp-pts:4712,4715 · .tp-close:4717,4723,4724 · .tp-snd:4727,4730,4736,4737
.tp-snd-ic:4731 · .tp-snd-track:4732 · .tp-snd-thumb:4734 · .tp-prompt:4741 · .tp-word:4743,4757,4758 · .tp-ch:4745,4750,4751,4753
.tp-thai:4761 · .tp-hint:4763 · .tp-empty:4765 · .tp-keys:4768 · .tp-row:4770 · .tp-row-fn:4772,4805
.tp-key:4776,4788,4790,4796(+2) · .tp-key-fn:4803 · .tp-fx:4809 · .tp-coinpop:4810 · .tp-pop-pt:4815

## css/style.css (2,059 บรรทัด · 532 selector)
:root:5 · *:15 · html:16,21 · input:25 · body:29 · #app:35
.screen:38,39 · h1:42 · .subtitle:43 · .egg-grid:46,63 · .egg-card:47,52,53,54(+2) · .pet-price:57,61
.egg:65,71,75 · .d1:76 · .basket:79,80,85,91(+5) · .basket-dog:89,102,103,104 · .basket-cat:90,105,106,107 · .egg-dragon:110
.topbar:125 · .topbar-coins:126 · .coin-pill:127,138,142,147(+4) · .coin-ic:134 · .no-anim:148,179,183,184(+5) · .coin-flow:152,153,157,164(+1)
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
.cat-card:1058,1079,1082,1227(+1) · .cat-head:1062 · .cat-emoji:1063 · .cat-name:1064 · .cat-pass:1065 · .cat-info:1066
.cat-btns:1067 · .cat-btn:1068,1072,1073,1074(+3) · .band-sec-head:1077,1078 · .bax-box:1086,1088 · .bax-head:1089 · .bax-sub:1090,1091
.bax-row:1092 · .bax-lv:1093,1096,1097,1098(+3) · .bax-emoji:1099 · .bax-name:1100 · .bax-q:1101 · .bax-need:1103
.bax-rw:1104 · .bax-foot:1108 · .bax-rank:1109,1112 · .bxr-box:1115,1117 · .bxr-head:1118 · .bxr-sub:1119
.bxr-body:1120 · .bxr-pick:1121 · .bxr-cats:1122 · .bxr-chip:1123,1125,1126,1127(+1) · .bxr-list:1130 · .bxr-row:1131,1133,1135,1139
.bxr-rk:1134 · .bxr-nm:1136,1137 · .bxr-sc:1138 · .bxr-tm:1140 · .bxr-more:1141 · .bxr-none:1142
.bxr-foot:1144 · .band-mine-tag:1145 · .bsp-box:1148,1151 · .bsp-head:1152 · .bsp-prog:1153 · .bsp-retake:1155,1158
.bsp-info:1160,1162 · .rts-box:1165 · .rts-head:1167 · .rts-sets:1168 · .rts-set:1169,1170,1171 · .rts-sub:1172
.rts-words:1173 · .rts-word:1174,1176,1177 · .rts-foot:1178 · .rts-okbtn:1179,1181 · .bsp-grid:1182 · .bsp-chip:1183,1186,1187,1188(+1)
.bsp-num:1190 · .bsp-best:1191 · .bsp-tick:1192 · .bsp-foot:1193 · .vb-box:1196,1198 · .vb-head:1199
.vb-total:1200 · .vb-quizbtn:1201,1203 · .vb-tabs:1204 · .vb-tab:1205,1207,1208 · .vb-words:1209 · .vb-word:1210,1213,1214,1215(+3)
.vb-empty:1219 · .vb-foot:1220 · .vb-pg:1221,1223 · #vb-pginfo:1224 · .vb-hint:1225 · .band-lock:1233
.offline-btn:1234,1235 · .quiz-progress:1240 · .quiz-phon:1241 · #quiz-extra:1242,1244,1245,1246 · .quiz-word-card:1247 · .quiz-next:1253,1259,1260,1261(+1)
.quiz-choice:1264,1269,1270,1271 · .quiz-score-pill:1272 · .quiz-time-pill:1274,1276 · .stats-card:1279 · .stats-title:1283,1732 · .stats-row:1284,1285,1286,1287
.stat-badge-line:1289,1292 · .stat-badge-ic:1290 · .game-top:1295 · .back-btn:1296 · .combo-pill:1300 · .timer-wrap:1304
.timer-fill:1305,1306 · .board-label:1308 · .card-grid:1309 · .word-card:1310,1316,1317,1318(+3) · .hint-btn:1324,1329 · .game-endless-note:1332,1337,1339,1343(+6)
.report-btn:1364,1369 · .report-box:1372 · .report-close:1373 · .rp-head:1377 · .rp-avatar:1378,1379 · .rp-title:1380
.rp-sub:1381 · .rp-levelcard:1383 · .rp-level-top:1387 · .rp-bar:1388 · .rp-bar-fill:1389 · .rp-level-note:1390,1391
.rp-grid:1393 · .rp-stat:1394 · .rp-ic:1397 · .rp-num:1398 · .rp-lbl:1399 · .rp-section:1401
.rp-h3:1402 · .rp-badge-mini:1403 · .rp-row:1404,1405,1406 · .rp-empty:1407 · .rp-badges:1408 · .rp-badge:1409
.rp-tline:1412 · .rp-tl-head:1413,1414 · .rp-tl-ems:1415 · .rp-em:1416,1417 · .rp-tl-note:1418,1419 · .rp-crown:1421,1422
.rp-wtitle:1424 · .rp-wnow:1425,1426 · .rp-wgraph:1427 · .rp-wcol:1428 · .rp-wval:1429 · .rp-wbar:1430,1431
.rp-wlbl:1432 · .rp-cheer:1434 · .report-ok:1438 · .summary-box:1441,1496,1500,1501(+2) · .sm-burst:1442 · .sm-title:1444
.sm-line:1445 · .sm-coin:1446 · .sm-matches:1452,1453 · .confetti:1455 · .sm-badge:1462 · .sm-badge-all:1466
.badge-celebrate-overlay:1469,1486 · .badge-celebrate:1475 · .bc-emoji:1481,1483 · .bc-emoji-img:1482 · .bc-title:1484 · .bc-sub:1485
.sm-cheer:1490 · .sm-streak:1491,1492 · .sm-sick:1493 · .sm-btns:1494 · .float-fx:1506 · .toast:1513
.toast-warn:1520,1527,1528,1534 · .toast-clear-all:1536,1543 · .alert-box:1545 · .alert-ok:1546,1551 · .settings-box:1553 · .set-row:1554
.set-hint:1558 · .set-hint-on:1559 · .set-hint-off:1560 · .set-lwrap:1561 · .set-label:1562 · .set-desc:1563
.set-switch:1564,1568,1569,1574(+4) · .set-sw-knob:1570 · .set-sw-txt:1577 · .set-close:1583,1588 · .set-help:1589,1594 · .help-box:1596,1597,1602
.help-item:1598 · .update-banner:1610,1619,1620 · #update-reload:1621 · #update-dismiss:1625 · .levelup-overlay:1631,1637,1638 · .levelup-box:1639,1646,1647,1648(+4)
.bill-box:1654,1658,1659 · .tag-off:1660 · .home-decayed-img:1661 · .home-dark-img:1662 · .thirst-fill:1663 · .thirst-text:1664,1665
.toxin-fill:1668 · .toxin-text:1669,1670 · .detox-btn:1671,1676 · .shape-text:1679,1680,1681,1682(+1) · .avatar-pick:1686 · .avatar-opt:1687,1691,1692,1693
.avatar-chip-img:1697 · .mini-av:1699 · .fp-ava:1700 · .avatar-chip-blk:1702 · .set-avatar-btns:1703 · .avatar-mini:1704,1708
.set-blk-row:1710 · .set-sub2:1711 · .blk-grid:1713 · .blk-mini:1714,1717,1718,1719 · .game-avatar:1722,1723,1724 · .stats-nick:1733
.ticket-owned:1736,1740 · .collect-sub:1745 · .mkt-tabs:1746 · .mkt-tab:1747,1751 · .mkt-filter:1752 · .mkt-row:1756
.mkt-emoji:1760,1761 · .mkt-info:1762,1763 · .mkt-tier-stars:1764 · .mkt-buy:1765,1770,1771 · .mkt-price-lo:1772 · .mkt-price-hi:1773
.mkt-empty:1774 · .collect-grid:1777 · .collect-cell:1778 · .cc-emoji:1779,1780 · .cc-name:1781 · .cc-count:1782
.cc-list-btn:1783,1787 · .mkt-listhead:1788 · .mkt-group-head:1790,1796 · .mkt-two-col:1798,1799,1803,1815(+8) · #phone-card:1804,1820 · #computer-card:1805,1821
#ticket-card:1807 · #haunt-card:1808 · #heli-card:1809 · #drone-card:1810 · #drive-card:1811 · #soccer-card:1812
#moto-card:1813 · #invasion-card:1814 · .mkt-listing:1842 · .ml-cancel:1846 · .mkt-sold:1852,1853,1854 · .list-dialog:1861,1862,1867
.list-hint:1866 · .collect-reveal-frame:1870,1877 · .collect-reveal-img:1876 · .collect-reveal-stars:1878 · .craft-box:1881 · .craft-head:1882
.craft-bar:1883 · .craft-fill:1884 · .craft-text:1885 · .craft-btn-row:1886,1887 · .craft-go-btn:1889,1895,1896,1899 · .craft-cancel:1907,1911
.mkt-catalog:1914,1915,1916 · .mkt-pager:1919 · .pg-btn:1920,1924,1925 · .pg-mid:1926 · .pg-dots:1927 · .pg-dot:1928,1929
.order-head:1930 · .order-row:1931,1936,1938,1940 · .order-deliver:1941,1946 · .order-need:1947 · .avatar-chip-photo:1953 · .pass-photo:1954
.pl-photo:1955 · .pp-cam:1960,1968 · .set-photo-row:1971,1977 · .ph-thumb:1978 · .ph-plus:1979 · .photo-box:1985,1986,2007,2011(+4)
.ph-now:1987 · .ph-now-img:1988,1992 · .ph-now-cap:1993 · .ph-warn:1994 · .ph-sync:1999,2002 · .ph-sync-wait:2003
.ph-sync-ok:2004 · .ph-sync-bad:2005 · .ph-btns:2006 · .ph-tip:2016 · .ph-stage:2018,2022 · .ph-cv:2023
.ph-ring:2024,2029 · .ph-zoom:2033 · .ph-foot:2034 · .ph-crop-box:2035
