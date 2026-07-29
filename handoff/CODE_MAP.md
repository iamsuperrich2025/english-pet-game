# CODE_MAP.md — แผนที่โค้ด:บรรทัด (เจนอัตโนมัติโดย `tools/gen_code_map.py` — **ห้ามแก้มือ** เดี๋ยวโดนเขียนทับ)

> วิธีใช้: หาชื่อฟังก์ชัน/ค่าคงที่/selector ในไฟล์นี้ (Grep หรือกวาดตา) → `Read` ไฟล์จริง `offset=<บรรทัด>` `limit=40`
> 🗂️ ไฟล์อ้วนมี **สารบัญโซน** (`st-end ชื่อโซน`) — งานทั้งระบบ/โลก 3D: Grep ชื่อโซน → Read/Edit เฉพาะช่วงนั้น **ห้ามอ่านทั้งไฟล์** · เพิ่มระบบใหม่ในไฟล์อ้วนต้องครอบ banner `/* ==== */`+ชื่อโซน (สารบัญเจนเอง)
> css = index `selector:บรรทัดทุกจุดที่ประกาศ` (บั๊ก UI เริ่มหาที่นี่) · เจนใหม่ทุกครั้งที่รัน `python tools/rotate_handoff.py` · อัปเดต: 2026-07-29

## js/adv3d_css.js (1,076 บรรทัด · 0 รายการ)

## js/adv3d_intro.js (72 บรรทัด · 0 รายการ)

## js/adv3d_tex.js (245 บรรทัด · 19 รายการ)
TILE_COLORS:9 · letterTexture:10 · letterTextureDark:27 · emojiTexture:40 · GHOST_IMG_MAX:52 · measureGhostBox:58
probeGhostImages:71 · whenGhostsReady:83 · ghostTexture:87 · ghostScareSrc:92 · AD_STYLES:100 · adBoardTexture:109
addAdBillboard:156 · ringAds:167 · BUILDING_TINTS:177 · FACADE_ROWS:179 · buildingFacadeTexture:180 · makePeerSprite:205
bind:241

## js/adventure3d.js (11,625 บรรทัด · 574 รายการ)
### 🗂️ สารบัญโซน js/adventure3d.js (Read/Edit เฉพาะช่วง)
- 1-216 adventure3d.js — โลก 3D First-person 2 โหมด (คิว 7725691507 ข้อ 8 + ต่อยอด)
- 217-280 ⚽ โหมดสนามฟุตบอล (โหมด soccer · รอบ 196) — เล็ง+ชาร์จพลังเตะบอลใส่ป้ายตัวอักษร
- 281-335 🤖 โหมดหุ่นยนต์นักรบ (โหมด mecha · รอบ 199) — มุมมองในหุ่นสูง 5m เดินยิงเอเลี่ยนตัวอักษร
- 336-478 📻 หอบังคับการบิน (รอบ 64 · รอบ 66 เปลี่ยนเป็นอังกฤษล้วนตามผู้ใช้สั่ง)
- 479-499 คำศัพท์ — ตามระดับชั้น + ไม่ซ้ำคำที่ประกอบแล้ว (8.1/8.6) · แยกคลังต่อโหมด
- 500-638 Texture ตัวอักษร / emoji / ป้ายชื่อผู้เล่น (canvas → sprite)
- 639-809 🧱 ตัวละครบล็อก (โลกขับรถ) — เลือกก่อนออกรถ · เพื่อนใน map เห็นเป็นหุ่นบล็อกขับรถบล็อก
- 810-1116 🚙 รอบ 393: รถเพื่อนในโลกขับรถ = โมเดลจริง img/models/car_01.glb (ผู้ใช้สั่ง)
- 1117-1269 สร้างฉาก static ครั้งเดียวต่อโหมด
- 1270-1582 🚗 เมืองกำแพงเพชรจริง (โหมด drive) — ข้อมูล OpenStreetMap ใน js/data/city_kpp.js
- 1583-1670 🧭🕳️ รอบ 779 — ปิดช่องขาดของกริดถนน (ผู้ใช้: "GPS พาไปช่วงที่ถนนขาดตอน / ขับต่อไม่ได้")
- 1671-1687 🌅 ท้องฟ้าภาพจริง (รอบ 203) — ใส่ภาพ panorama 360° (equirectangular 2:1) เป็นฉากหลังท้องฟ้า
- 1688-1727 🧱 เทกซ์เจอร์ภาพจริง (รอบ 323) — วางไฟล์ `img/tex/<key>.jpg` (หรือ .png) แล้วแปะทับพื้นผิวทันที
- 1728-2221 🌌 ท้องฟ้ากลางคืนโรงแรมผีสิง (รอบ 694) — ผู้ใช้: "ข้างนอกโรงแรมยังไม่น่ากลัวพอ"
- 2222-2260 🏨 โรงแรมผีสิง (รอบ 684) — ตัวตึก 5 ชั้นสร้างใน js/hotel3d.js
- 2261-2424 ตัวอักษรในโลก (8.2)
- 2425-2479 🔠🪙 เก็บตัวอักษร 1 ตัว = ได้ 1 เหรียญ (รอบ 345)
- 2480-2542 ประกอบคำอัตโนมัติเมื่อมีตัวอักษรครบ (8.1/8.4)
- 2543-2637 โหมด adv: monsters ยิงสู้ได้ (สเปกเดิม 8.5)
- 2638-2645 👻 ผีในโรงแรม (รอบ 684 — เขียนใหม่ทั้งชุด · ผู้ใช้สั่งข้อ 10-13, 18)
- 2646-2774 🧟 โมเดลผี 3D (รอบ 689 — ผู้ใช้สั่ง: "ภาพผีแบน ๆ ไม่สมจริง ไม่น่ากลัว ใช้โมเดลแทน")
- 2775-3001 🔦👻 รอบ 778 (ผู้ใช้สั่งข้อ 4) — กติกาใหม่ของผีเดินเพ่นพ่านในโรงแรม
- 3002-3248 🏨 ระบบโรงแรมผีสิง (รอบ 684) — เดินขึ้นชั้น/ไฟดับ/ไฟฉาย/ตู้เสื้อผ้า/รูปตามอง
- 3249-3462 เสียงหลอนโหมดผีสิง — สังเคราะห์ Web Audio (ปลอดลิขสิทธิ์ 100%)
- 3463-3787 Multiplayer — ผู้เล่นอื่นใน map เดียวกัน (สไตล์ Roblox)
- 3788-3987 Voice chat ใน map — WebRTC P2P mesh (เสียงวิ่งตรงระหว่างเครื่อง)
- 3988-4074 🏁 พิธีประกาศแชมป์ (ครูกด "จบรอบแข่ง") — /class/<map>/podium
- 4075-4280 HUD
- 4281-4904 DOM overlay + CSS (สร้างครั้งเดียว — self-contained ไม่แตะ style.css)
- 4905-5035 Input — เมาส์+คีย์บอร์ด และจอสัมผัส (มือถือ landscape)
- 5036-5040 🚁 โหมดเฮลิคอปเตอร์ Bell — ฟิสิกส์บินแบบอาร์เคด (สไตล์ Helicopter Flight Pilot)
- 5041-5432 🛸 โดรน FPV (โหมด drone) — บินเร็ว/คล่อง ลอดหน้าต่างเข้าตึกร้าง เก็บตัวอักษรในห้อง
- 5433-5555 🚗 โหมดขับรถเมืองกำแพงเพชร — ฟิสิกส์รถอาร์เคด (bicycle model)
- 5556-5649 🚦 รอบ 133: ไฟจราจรจริงที่ทางแยกใหญ่ + ฝ่าไฟแดงโดนใบสั่ง ม.22
- 5650-6080 🧭 GPS นำทาง (โหมด drive) — เลือกตัวอักษรเป้าหมาย + เส้นทางตามถนนจริง (A*) · นำทางด้วยภาพล้วน (ไม่มีเสียงพูด ตั
- 6081-6139 🎛️ เข็มหน้าปัดวิ่งจริง (สปีด 0-180 + วัดรอบ 0-8×1000) — วาดทับวงเกจของภาพ dash.png
- 6140-6224 🎵 รอบ 181: วิทยุในรถ — จอ head-unit กลางคอนโซล (visualizer + เลือกเพลง 3 โหมด)
- 6225-6352 🪆 รอบ 191: ตุ๊กตาดุ๊กดิ๊กหน้ารถ — รูปตัวละครที่ผู้เล่นเลือก (blkN.png)
- 6353-6656 🚔 รอบ 128: แผงเตรียมออกรถ + กฎหมายจราจร + ใบสั่ง
- 6657-6699 🛩️📦 ภารกิจไปรษณีย์กลางคืน (รอบ 353) — เฉพาะช่วงฟ้ามืด (heliNight>.5)
- 6700-7887 🚶🛗🚁🪂 โหมดเดินเท้าในเมืองเฮลิฯ (รอบ 354 — ผู้ใช้สั่ง)
- 7888-7961 🎛️ หน้าปัดเข็มขยับจริง (รอบ 61) — วาดสดทุกเฟรมจากค่าการบินจริง
- 7962-8231 🌧️☀️ ชั้นบนกระจก: ที่ปัดน้ำฝน + แสงแดดสาด (รอบ 346)
- 8232-8636 🔊🌧️ เสียงที่ปัดน้ำฝน (รอบ 537) — สังเคราะห์ล้วน ไม่มีไฟล์เสียง
- 8637-8706 📹 กล้องใต้ท้องเครื่อง (belly cam) — รอบ 348
- 8707-8778 🎯 วงเป้าลงจอด (รอบ 349) — ไฮไลต์ดาดฟ้าที่มีตัวอักษร ให้รู้ว่าควรร่อนลงตรงไหน
- 8779-9394 📏 แถบเตือนความเร็วดิ่ง (รอบ 349) — ลงเร็วเกินกรอบกล้องกะพริบแดง สอนให้ร่อนลงนุ่มๆ
- 9395-9397 Loop หลัก
- 9398-10624 ⚽ โหมดสนามฟุตบอล — ฟิสิกส์บอล + เล็ง + ชาร์จพลัง + กล้อง 1st/3rd + ชุดนักเตะ
- 10625-11077 🤖 โหมดหุ่นยนต์นักรบ — เดินยิงเอเลี่ยนตัวอักษร (ต้องยิงเรียงลำดับในคำ)
- 11078-11097 เข้า/ออกโลก
- 11098-11625 ❓ การ์ด "วิธีเล่น" ตอนเข้าโลกครั้งแรก (จำแยกต่อโลกใน localStorage — ไม่แตะ state.js)
### รายการ js/adventure3d.js
GUIDE_WORDS:20 · RELOCATE_MS:21 · HALF:22 · PLAYER_SPEED:23 · HAUNT_LIVES:24 · HAUNT_IFRAME:25
PICK_DIST:26 · EYE_H:27 · NET_SEND_MS:28 · MODES:31 · SHOOT_GAP_MS:95 · MONSTER_REWARD:96
AD_COUNT:97 · AD_RENT_COIN:98 · AD_RENT_MS:99 · SHOP_ADS:103 · PILOT_TIERS:105 · pilotEmoji:106
DRONE_R:118 · DRONE_ACCEL:119 · DRONE_VMAX:120 · DRONE_CLIMB:121 · DRONE_YAWSP:122 · DRONE_GRAV:123
CAR_EYE:127 · CAR_ACCEL:128 · CAR_BRAKE:129 · CAR_VMAX:130 · CAR_LEGAL_KMH:131 · CAR_FINE_SPEED:132
CAR_FINE_BELT:133 · CAR_REPAIR_FEE:134 · CAR_FINE_SIGNAL:135 · CAR_RAM_FEE:136 · CAR_FINE_RED:137 · CAR_VMAX_OFF:138
CAR_VREV:139 · CAR_WB:140 · CAR_STEER_MAX:141 · HELI_SKID:175 · HELI_CRASH_FINE:176 · HELI_MESH_SCALE:177
ASSIST_R:180 · PROP_STALL_MS:185 · PROP_BREAK_SPD:188 · PROP_BROKEN_MUL:189 · BAT_DRAIN:192 · BAT_LETTER:193
BAT_LOW:194 · BAT_EMPTY_MUL:195 · CHG_R:198 · GATE_R:201 · showHeliSkip:208 · BOLT_MIN:209
GLASS_HIT_R:210 · DOOR_R:211 · SOCCER_SHIRTS:221 · BALL_R:226 · GOAL_HW:227 · KICK_SPD_MIN:228
AIM_YAW_SP:229 · SOCCER_TILES:230 · AIM_STICK:238 · CURL_SWIPE:241 · CURL_SPIN:242 · HIT_LIFT:246
GUIDE_N:247 · FK_SPOT_Z:253 · FK_MAN_R:254 · AURA_COST:259 · SB_DRAG:266 · SPOST_R:267
GK_Z:272 · GK_SPRITES:273 · PK_TIME:275 · MECHA_EYE:285 · ALIEN_COUNT:286 · MECHA_MAX_HP:287
MECHA_ATK_RANGE:288 · ALIEN_SHOT_SPD:289 · POWERUP_GAP:290 · BOSS_SCALE:291 · COMBO_X2:292 · BOSS_SPECIES:295
pickBossSpecies:303 · WAVE_BASE_GOAL:305 · waveCfg:306 · MECHA_WEAPONS:315 · ATC_REPLIES:344 · ATC_CLOSERS:349
ATC:354 · netUp:472 · CHAT_MAX:475 · doneList:482 · wordPool:483 · pickWords:496
adRenterActive:508 · FACADE_ROWS:517 · adsFetch:523 · adsWatch:535 · adsStop:542 · adsChanged:543
adRentBuy:554 · heliMusicTick:577 · AD_FLYBY_COIN:581 · adFlybyTick:583 · adShopOpen:602 · adShopRender:616
BLOCK_AVATARS:645 · blkGeo:656 · blkMat:657 · blkCyl:658 · blkFaceMat:660 · makeBlockFigure:675
makeBlockCar:715 · blkNameSprite:761 · makeBlockPeer:777 · makeBlockWalkPeer:798 · disposeBlockPeer:806 · CAR_GLB_URL:817
CAR_GLB_LEN:818 · carSplitWheel:822 · carGlbEnsure:849 · carMatGet:868 · carGlbBuild:884 · carAvCode:933
driveCamToggle:940 · SKID_N:959 · skidGeomGet:961 · skidDrop:966 · skidTick:980 · blkBuildThumbs:990
blkBuildPicker:1008 · pickBlockAvatar:1053 · bubbleSprite:1076 · showPeerBubble:1103 · removePeerBubble:1111 · concreteTexture:1121
brokenWindowTexture:1138 · intactGlassTexture:1154 · chargeIconTexture:1172 · rustyDoorTexture:1181 · dAddBox:1195 · buildAbandoned:1202
makeNameSprite:1275 · flatGeom:1288 · flatGeomUV:1297 · buildDriveCity:1307 · SKY_IMG:1678 · applySky:1679
applyTex:1695 · HSKY_R:1742 · hskyTex:1744 · buildHauntSky:1749 · tickHauntSky:1879 · buildScene:1897
randPos:2264 · randRoadPos:2272 · HOTEL_PER_ROOM:2287 · HOTEL_MIN_GAP:2288 · hotelSpot:2289 · hotelPruneLetters:2324
spawnLetter:2333 · spawnLettersForWord:2372 · ensureCoverage:2374 · relocateLetters:2390 · removeLetter:2419 · LETTER_COIN:2430
pickUpLetter:2431 · letterPop:2445 · letterChime:2463 · tryCompleteWords:2483 · completeWord:2497 · spawnMonster:2546
killMonster:2555 · tickMonsters:2563 · damagePlayer:2585 · shoot:2601 · tickShots:2615 · GHOST_GLB_URL:2655
GHOST_MODEL_H:2656 · ghostGlbEnsure:2658 · buildGhostMesh:2684 · makeGhostSprite:2706 · spawnGhost:2724 · applyGhostSize:2749
faceGhostToPlayer:2760 · setGhostVis:2766 · GHOST_MIN_FLOOR:2782 · TORCH_LOCK_S:2783 · BANISH_S:2784 · ghostsAllowed:2786
hotelCorridorX:2791 · torchHitsGhost:2800 · ghostBanish:2807 · ghostGoLurk:2816 · ghostGoStalk:2826 · ghostGoBehind:2838
tickGhosts:2846 · sessionRecapHtml:2936 · hauntRunSec:2943 · fmtSurv:2944 · hauntSurviveFinish:2945 · tickSurvive:2955
renderHearts:2969 · hotelScare:2975 · knockedOut:2995 · BLACKOUT_MS:3015 · FLICKER_MS:3016 · DARK_LETTER:3020
tintSprite:3021 · hotelReset:3024 · setTorch:3048 · toggleTorch:3064 · tickTorch:3069 · hotelBlackout:3079
hotelFlicker:3095 · tickHotelPlayer:3107 · tickHotelWorld:3159 · hotelAct:3202 · openWardrobe:3219 · announceTarget:3242
netReady:3468 · netJoin:3474 · sendPos:3494 · sendChat:3536 · toggleChatBox:3550 · onPeerData:3561
disposeHeliMesh:3649 · removePeer:3654 · netLeave:3669 · tickPeers:3675 · RTC_CFG:3796 · tinvLinked:3797
partyWord:3804 · syncPartyWord:3817 · updateVoiceBtns:3969 · PODIUM_BONUS:3994 · podiumJoin:3996 · podiumLeave:4007
endRound:4008 · showPodium:4019 · tinvCheck:4059 · showBanner:4079 · renderHudTop:4085 · renderHudWords:4090
renderHudInv:4100 · ddTierFromName:4107 · renderBoard:4109 · drawBigMap:4146 · openBigMap:4201 · closeBigMap:4209
drawMinimap:4214 · loadCarDash:4286 · loadCarWheel:4298 · buildDom:4308 · confirmExit:4889 · IS_TOUCH:4908
bindInput:4909 · movePlayer:5001 · tickPlayer:5011 · collideDrone:5044 · propStall:5063 · propBreak:5070
propFix:5077 · droneBatAdd:5084 · lightningBolt:5087 · startRain:5098 · stopRain:5112 · smashGlass:5114
awardGlass:5125 · neededLetter:5142 · openDoor:5157 · raceStartRun:5177 · raceStop:5184 · gateHighlight:5202
renderRaceHud:5209 · tickDrone:5218 · nearMissTick:5360 · showNearMiss:5384 · awardDaredevil:5395 · comboCheer:5412
comboFlash:5428 · driveCell:5437 · nearestStreet:5443 · collideCar:5453 · tlDotY:5484 · tlSet:5488
driveArms:5505 · tlTick:5517 · TL_GREEN:5561 · tlRedDur:5563 · tlightPhase:5564 · buildTrafficLights:5571
rlTick:5623 · cellDrivable:5655 · cellWeight:5658 · cellBlocked:5663 · cellCenter:5664 · posReachable:5666
losClear:5677 · nearestDrivableCell:5688 · routeGrid:5700 · pickGpsTarget:5753 · NAVLINE_W:5776 · navLineEnsure:5777
navLineHide:5787 · navLineUpdate:5788 · tickGps:5815 · tickDrive:5879 · drawCarDial:6087 · drawCarGauges:6117
RADIO_RECT:6145 · CAR_RADIO_RECT:6147 · carRadioRect:6153 · radioLayout:6155 · radioSetHint:6178 · renderRadioList:6184
radioToggleList:6194 · drawRadioViz:6199 · radioTick:6217 · BOBBLE_FOOT:6230 · BOBBLE_H:6231 · BOBBLE_ASPECT:6232
BOB_OMEGA:6235 · BOB_PITCH_FORCE:6237 · BOBBLE_SKINS:6239 · bobbleSetAvatar:6246 · bobbleLayout:6253 · bobbleTick:6266
bobblePoke:6291 · bobbleApplySkin:6308 · dollOwned:6318 · openDollPicker:6319 · carStartShow:6356 · showLawInfo:6374
lawNotice:6396 · driveFineSettle:6406 · HELI_PHASES:6585 · heliStartPhase:6592 · heliFloorAt:6599 · SOFT_TIERS:6609
softLandBonus:6611 · awardPerfLand:6624 · setHeliLight:6643 · MAIL_COIN:6662 · mailStart:6664 · mailStop:6687
mailTick:6688 · FOOT_EYE:6707 · doorSlideSfx:6713 · doorLerp:6736 · entLerp:6744 · footStepSfx:6754
WRING_COIN:6775 · festivalPaint:6779 · dustTexture:6791 · dustBurst:6800 · dustTick:6814 · HELI_GLB_URL:6835
HELI_GLB_TEX_BLUE:6837 · HELI_GLB_ROTOR:6839 · HELI_GLB_TROTOR:6840 · heliGlbEnsure:6842 · heliMatBlueGet:6860 · heliGlbAssemble:6873
heliNavTick:6912 · peerRotorStop:6919 · peerRotorTick:6925 · heliCrashSfx:6944 · heliMeshBuild:6972 · heliMeshBuildLegacy:6983
buildHeliFoot:7113 · footFloorAt:7229 · insideTerm:7236 · inDoorZone:7237 · footHint:7241 · setFootBtns:7242
liftStart:7247 · beginRide:7258 · endRide:7281 · beginWing:7292 · awardAirLetter:7305 · paxChoiceShow:7324
paxChoiceHide:7350 · pilotShipMesh:7354 · beginPilot:7355 · endPilot:7387 · drawCabinWindow:7411 · tickHeliFoot:7435
tickHeli:7644 · CP_NAT:7896 · CP_GAUGES:7897 · SEAT_LABEL:7910 · SEAT_P_FULL:7911 · SEAT_ZOOM:7912
DASH_OFF_Y:7913 · DASH_DROP:7914 · setSeat:7916 · layoutCockpit:7928 · WIPER:7967 · WIPER_SPD:7970
WIPER_LABEL:7971 · INT_GAP:7972 · WASH_MS:7976 · WASH_TANK_MAX:7980 · SMEAR_LIFE:7992 · CHOP_MIN:7993
SUN_RAY_FAR:7997 · sunRayBlocked:7999 · sunShadeTick:8018 · applyCockpitShade:8029 · rotorChop:8041 · sunUpdate:8049
HELI_FOG_N0:8060 · fogUpdate:8064 · adGlowPulse:8110 · RAIN_MAX:8119 · VISOR_Y:8120 · RAIN_MIN:8121
RAIN_DUR:8122 · DROP_ZONE:8126 · addDrop:8127 · tickDrops:8135 · addWashDrop:8153 · washStart:8160
renderWashGauge:8180 · washTick:8191 · grimeTick:8208 · WIPE_R:8215 · wipeDrops:8216 · wiperSndOn:8239
wiperSndOff:8251 · wiperThunk:8257 · washSpraySfx:8269 · wiperSqueak:8286 · wiperSndTick:8303 · setWiper:8323
tickWiper:8335 · SH_SWEEP:8366 · shadowSweepTick:8368 · REFL_MAX:8380 · REFL_COL:8382 · cityGlowLevel:8383
drawCityGlow:8388 · setVisor:8420 · rainTick:8426 · drawBlade:8443 · drawSmears:8462 · drawGlass:8482
drawBellyCam:8644 · drawBellyHud:8667 · drawLandingTargets:8713 · VS_HARD:8783 · drawDescentBar:8784 · heliShake:8833
cpNeedle:8844 · drawGauges:8861 · XF_START:8909 · PRELOAD_WAIT:8910 · ALT_QUIET_FROM:8912 · ALT_MAX_DAMP:8913
ALT_LP_MIN:8914 · ECHO_NEAR:8915 · WIND_FULL_SPD:8916 · SHUTDOWN_SEC:8917 · PAN_MAX:8919 · OD_RPM:8920
SHAKE_RPM:8921 · SHAKE_HIT:8922 · soccerLetterPos:9402 · letterNeeded:9410 · soccerNeededSet:9415 · soccerTileGeo:9421
soccerGoldTexture:9423 · makeSoccerTile:9440 · soccerRefreshSkins:9449 · soccerBuildTargets:9456 · soccerNextTile:9466 · soccerRetarget:9479
soccerCoinPop:9491 · soccerGrassTexture:9504 · soccerTurfGrade:9526 · soccerTurfTexture:9549 · grassNormalTexture:9568 · soccerLinesTexture:9597
soccerNetTexture:9648 · soccerCrowdTexture:9656 · soccerBallMat:9675 · buildSoccerGoal:9695 · buildStands:9714 · soccerLedBoards:9749
soccerGKEnsure:9846 · soccerGKTick:9862 · fkBuildWall:9891 · fkToggle:9906 · fkHitTest:9922 · pkHud:9941
pkStart:9950 · pkEnd:9964 · pkTick:9979 · repQualify:9986 · repEnsureEl:9989 · repStart:10000
repTick:10007 · soccerNumTex:10032 · makeSoccerPlayer:10042 · soccerNewSpot:10068 · soccerResetBall:10080 · soccerKick:10087
soccerCheer:10104 · guideTexture:10107 · auraActive:10131 · auraLeftMs:10132 · buildAura:10134 · auraBuy:10155
auraRender:10165 · auraTick:10179 · buildDrill:10199 · drillTick:10212 · buildLandRing:10249 · buildGuideRibbon:10259
renderSpinPad:10284 · spinPadToggle:10296 · spinPadPick:10302 · renderCurl:10314 · kickLaunch:10325 · updateSoccerGuide:10333
soccerCamera:10397 · tickSoccer:10418 · soccerKitShow:10598 · soccerKitGo:10613 · emojiSprite:10666 · makeAlien:10671
startWave:10704 · waveSpawnFill:10715 · waveComplete:10724 · updateWaveHud:10734 · checkMechaBossBadge:10736 · alienSpawnPos:10745
removeAlien:10750 · mechaHudWord:10755 · setMechaHudSkin:10763 · mechaComboPop:10775 · mechaShielded:10780 · mechaDamageFx:10782
mechaHitByAlien:10787 · spawnAlienShot:10793 · removeAlienShot:10803 · tickAlienShots:10808 · spawnPowerup:10820 · removePowerup:10833
collectPowerup:10838 · tickPowerups:10845 · updateMechaHud:10854 · mechaTracer:10894 · mechaFire:10903 · explodeAlien:10940
tickMecha:10970 · loop:11026 · grabShot:11058 · savePhoto:11069 · clearEntities:11081 · INTRO_KEY:11102
introSeenObj:11103 · introSeen:11104 · markIntroSeen:11105 · INTRO:11106 · showIntro:11107 · closeIntro:11132
beginPlay:11138 · start:11140 · exitWorld:11338 · mechaRecapLine:11407

## js/auth.js (389 บรรทัด · 32 รายการ)
AUTH_PUSH_MS:23 · AUTH_SDK_TIMEOUT_MS:24 · TEACHER_EMAILS:28 · isTeacher:29 · TESTER_EMAILS:42 · TESTER_COINS:43
isTester:44 · testerBoost:48 · authSetStatus:74 · authShowLogin:86 · authGateOffline:90 · authSaveRef:97
authFetchCloud:98 · authWriteCloud:99 · authDeleteCloud:100 · authWriteProfileName:101 · authPushProfile:108 · authApplyProfileName:116
authAskProfileName:132 · authEditProfileName:143 · authStart:154 · updateOfflinePill:184 · authEnterOffline:189 · authLateSync:206
authLoginClick:222 · authOnLogin:241 · authSyncOnLogin:254 · authFreshStart:283 · authAskLink:292 · authEnterGame:342
authPushSave:357 · authLogout:368

## js/award.js (271 บรรทัด · 0 รายการ)

## js/bandadv.js (218 บรรทัด · 14 รายการ)
BAND_ADV_REWARD:9 · bandAdvFailMsg:16 · bandAdvLoad:23 · bandAdvPlay:61 · BAND_ADV_EXAM:76 · bandAdvExamId:81
bandAdvExamName:83 · BAND_ADV_SUPREME_BONUS:90 · bandAdvCheckSupreme:91 · bandAdvExamLock:107 · bandAdvExamBest:116 · bandAdvExamCat:129
bandAdvExamOpen:137 · bandAdvCardsHTML:187

## js/cert.js (616 บรรทัด · 30 รายการ)
CERT_MAX:17 · CERT_ISSUER_EN:18 · CERT_MONTHS:19 · CERT_TOPIC_EN:23 · CERT_LEVEL_EN:44 · CERT_ADV_EN:49
CERT_BIG_LV:52 · certThIndex:56 · certTitleOf:65 · certSerial:87 · certDateEN:95 · certTier:103
CERT_TIER_META:110 · CERT_LOGO_SRC:116 · certAward:125 · certMine:148 · certAwardGold:155 · certAwardAdvSupreme:176
certBackfill:192 · certCatNameById:220 · certFromPost:245 · certXML:263 · certFit:268 · certHolder:273
certSVG:283 · certChipHTML:555 · openCertBig:570 · openCertMine:586 · certStripHTML:594 · certBindStrip:608

## js/dictband.js (389 บรรทัด · 26 รายการ)
BAND_EMOJI:12 · BAND_SET_REWARD:13 · BAND_DONE_BONUS:14 · bandFailMsg:21 · bandLoad:28 · bandShortTH:60
bandCat:68 · bandSets:90 · bandSetId:99 · bandCheckComplete:102 · bandSetCat:119 · BAND_RETAKE_MAX:131
bandTriedSets:132 · bandRetakeCat:143 · bandShowRetakeSummary:177 · bandSetsPassed:205 · openBandSetPicker:213 · bandMine:284
bandUnlocked:285 · bandLockToast:290 · bandExamLobby:296 · updateBandExamBtn:305 · bandLobbyTick:322 · bandPlay:333
bandPlayLobby:346 · bandCardsHTML:358

## js/game.js (1,074 บรรทัด · 74 รายการ)
REPLAY_BONUS_EVERY:23 · REPLAY_BONUS_TIERS:25 · replayBonusFor:26 · SESSION_MILESTONES:32 · addSessionCoins:35 · updateBestTarget:74
weekKeyStr:87 · rolloverWeekBest:93 · exitGame:99 · showSessionSummary:135 · sprinkleConfetti:182 · VOCAB_PER_LEVEL:201
VOCAB_RANK_NAMES:202 · vocabRankName:203 · showProgressReport:205 · THUNDER_MS:384 · THUNDER_TIERS:388 · THUNDER_TIER_UI:389
thunderEmoji:390 · DAREDEVIL_TIERS:394 · DAREDEVIL_TIER_UI:395 · daredevilEmoji:396 · GLASS_TIERS:400 · GLASS_TIER_UI:401
glassEmoji:402 · DILIGENT_TIERS:406 · DILIGENT_TIER_UI:407 · diligentEmoji:408 · SOFTLAND_TIERS:412 · SOFTLAND_TIER_UI:413
softLandEmoji:414 · AIRL_TIERS:418 · AIRL_TIER_UI:419 · airLetterEmoji:420 · MECHABOSS_TIERS:424 · MECHABOSS_TIER_UI:425
mechaBossEmoji:426 · TYPIST_TIERS:433 · TYPIST_TIER_UI:434 · typistEmoji:436 · checkTypistBadge:438 · BFF_TIERS:453
BFF_TIER_UI:454 · BFF_COIN:455 · bffEmoji:456 · badgeSuffix:461 · BADGE_META:477 · NAME_BADGE_RE:493
splitNameBadges:494 · badgeEmojis:500 · badgeScore:505 · BADGE_CATS:512 · bcatLevel:524 · checkCrown:531
currentBadgeScore:547 · rolloverBadgeWeek:551 · addDiligent:564 · celebrateBadge:580 · addThunder:594 · startGame:608
newRound:648 · updateTimerBar:687 · updateComboPill:693 · pickCard:697 · checkMatch:709 · renderCats:823
fmtMMSS:866 · quizTimerStop:870 · quizTimerStart:875 · quizElapsed:885 · startQuiz:889 · renderQuizQuestion:907
quizNext:971 · finishQuiz:984

## js/gradelock.js (158 บรรทัด · 14 รายการ)
GRADES:21 · GRADE_LOCK_DAYS:25 · GRADE_LOCK_MS:26 · gradeRank:29 · myGrade:30 · gradeHistList:33
gradeLockLeftMs:43 · gradeLockLeftDays:50 · gradeUnlockAt:51 · gradeLocked:52 · gradeUpOptions:55 · gradeChangeTo:62
gradeLockNote:86 · openGradeChange:94

## js/hotel3d.js (822 บรรทัด · 44 รายการ)
TEX:25 · FLOOR_H:28 · WEST:31 · SHAFT_E:32 · CORE_E:33 · RZ0:34
LZ0:35 · STAIR_TOP_D:38 · STAIR_BOT_D:39 · RAMP_X0:40 · RAMP_X1:41 · RAMP_RUN:42
ROOM_N:43 · DOOR_W:46 · ENTRY_HW:47 · PLAYER_R:48 · floorY:49 · Acc:56
accBox:57 · accGeo:73 · accMesh:81 · makeMats:92 · PORTRAIT_PHOTOS:137 · EYE_R0:146
PORTRAIT_EYE:147 · PORTRAIT_SKIN:155 · PORTRAIT_CLOTH:156 · portraitTexture:157 · signTexture:196 · build:210
inRect:650 · insideHotel:651 · surfaceY:654 · collide:673 · roomAt:693 · floorOf:701
setLights:706 · BLINK_DUR:719 · BLINK_MIN:720 · tick:722 · nearWardrobe:793 · inLift:804
atLiftDoor:808 · randomHaunt:812

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

## js/moto3d.js (2,031 บรรทัด · 116 รายการ)
### 🗂️ สารบัญโซน js/moto3d.js (Read/Edit เฉพาะช่วง)
- 147-435 DOM เครื่องเกมพกพา (สร้างครั้งเดียว · CSS ฉีดเอง ไม่แตะ style.css)
- 436-676 ถนนจากแผนที่จริง → geometry + ตารางแฮชชนถนน
- 677-1016 ฉาก: พื้น/โรงเรียน/ป้ายหมู่บ้าน/ต้นไม้/เมฆ/บ้านหมู่บ้าน
- 1017-1069 🐕 รอบ 312: หมาวิ่งตัดถนน — โผล่ข้างถนนข้างหน้ารถ วิ่งตัดผ่านเร็ว · ชน = ปรับ 100 เหรียญ (รอบ 643: ลดจาก 500)
- 1070-1187 🪙 รอบ 317: เหรียญบนถนน — pool ลอยเหนือเลนซ้าย รีไซเคิลรอบผู้เล่นตลอด
- 1188-1220 🏍️🚗 รอบ 317: โมเดลยานพาหนะ 3D (ใช้ทั้งรถเราเองโหมด car และรถ/มอไซค์ของเพื่อน)
- 1221-1317 🚗 รอบ 394: โมเดลรถจริง img/models/car_01.glb ในแผนที่บ้านโพธิ์สวัสดิ์
- 1318-1500 🧑‍🤝‍🧑 รอบ 317: เพื่อนในแผนที่เดียวกัน (/world/moto/<uid>)
- 1501-1542 🏟️👥 รอบ 640: งบวาดตัวเพื่อน (ใช้ NetRoom.drawBudget ร่วมกับโลกอื่น)
- 1543-1685 คำศัพท์ + ตัวอักษรบนถนน
- 1686-1902 สร้างโลกครั้งเดียว + ลูปเกม
- 1903-2031 เข้า/ออกโลก
### รายการ js/moto3d.js
REWARD:7 · ACCEL:8 · DASH_LEN:9 · DOG_HIT_COIN:10 · FEAT_SP:12 · DECAL_N:13
GRAV:14 · SUSP_K:15 · ROAD_WIDE:16 · EDGE_M:17 · ROAD_TEX_S:18 · POST_N:19
LEAN_MAX:20 · COLLECT_R:21 · SPAWN_MIN:22 · SCATTER_MS:23 · BUCKET:24 · TILE_COLORS:25
LETTER_COIN:27 · COIN_VAL:31 · COIN_GAP:32 · COIN_SPIN_SPD:34 · COIN_TIERS:37 · EMERALD_TIER:44
HARD_LAND:45 · COIN_CURVE_RAD:46 · NET_SEND_MS:48 · PEER_COLORS:49 · CHAT_MS:51 · CHAT_PRESETS:52
ENG_FILES:95 · CSS:150 · buildDom:335 · segKey:439 · smoothPts:442 · featKey:458
addFeat:459 · genFeatures:464 · terrainAt:483 · roadGroundY:496 · decalTex:504 · makeDecals:523
decalTick:532 · buildRoads:549 · distToSeg:645 · roadInfo:650 · onRoad:656 · randomRoadPoint:657
TXT_SPR_H:682 · makeTextSprite:683 · letterTexture:698 · woodTileMat:713 · muralTexture:724 · buildSchool:736
buildScenery:882 · scatterTrees:961 · postTick:981 · scatterClouds:1008 · makeDog:1020 · spawnDog:1035
dogHit:1045 · dogTick:1056 · coinTexture:1074 · makeCoins:1085 · loadCoinImg:1091 · addCoin:1103
clearCoins:1111 · addFreeCoin:1115 · coinTierAt:1123 · coinFx:1133 · grabCoin:1142 · coinTick:1159
scatterCoinTick:1173 · placeSpecialCoin:1180 · makeVehicle:1192 · mCarSplitWheel:1229 · mCarEnsure:1255 · mCarMat:1272
mCarBuild:1285 · mCarCode:1312 · netReady:1324 · netJoin:1330 · netSend:1343 · sendChat:1357
showPeerBubble:1367 · removePeerBubble:1374 · renderBoard:1381 · peerColor:1403 · buildPeer:1407 · onPeer:1431
dropPeer:1466 · netLeave:1473 · peerTick:1478 · PEER_DRAW_MAX:1506 · drawnPeers:1507 · drawSlotFree:1508
showPeerAgain:1509 · hidePeer:1516 · tickDrawBudget:1521 · spawnSlot:1529 · pickWord:1546 · spawnLetters:1556
renderWordHud:1571 · fitWord:1579 · collectTick:1586 · completeWord:1605 · relocTick:1630 · gpsTick:1645
miniTick:1654 · build:1689 · applyVehicleUi:1723 · fit:1741 · tick:1749 · frame:1757
start:1906 · exitWorld:1967

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

## js/state.js (1,128 บรรทัด · 91 รายการ)
STORAGE_KEY:6 · QUIZ_PASS_REWARD:11 · CURE_COST:13 · HUNGRY_SICK_MS:14 · MEAL_HOUR:16 · MEAL_FULL:17
SLEEP_FROM_HOUR:18 · SLEEP_SICK_HOUR:19 · WAKE_HOUR:20 · DINNER_COST:21 · TOXIN_FULL:23 · DETOX_COST:24
FOODQUIZ_Q:26 · FOODQUIZ_COIN:27 · FOODQUIZ_BONUS:28 · FOODQUIZ_MAX_PLAYS:29 · SHAPE_JUNK_MEALS:31 · SHAPE_CLEAN_MEALS:32
SHAPE_MISS_MEALS:33 · SHAPE_EXP_BONUS:34 · HEAT_SICK_MS:35 · THIRST_SICK_MS:36 · DEFAULT_STATE:38 · FEED_CATS:193
FEED_REACTIONS:207 · feedRx:215 · FEED_QUICK_CM:217 · SLOT_MS:229 · currentSlotStart:230 · nextSlotStart:236
mealDayKey:238 · nightKeyOf:240 · isNightNow:248 · newPet:253 · loadState:277 · saveState:545
activePet:552 · petStage:553 · isAdult:558 · abilityOn:559 · hasPetType:560 · todayStr:563
dailyTick:567 · addCoins:570 · QUEST_POOL:590 · QUEST_PER_DAY:600 · questsToday:601 · questTick:608
questEvent:612 · assetValue:648 · netWorth:674 · assetCount:676 · refreshRank:693 · heatProtected:709
rainProtected:713 · petHungry:716 · petShapeOf:720 · updatePetShape:726 · shapeMealDone:733 · heatPct:743
ymStr:752 · billOutstanding:756 · UTILITIES:763 · HOME_UTILITIES:769 · homeDecayed:771 · billTick:774
PET_FOOD_PER_PET:846 · petFoodTick:847 · myCar:873 · carLoanDue:878 · carLoanOverdue:883 · carLoanPayable:888
carLoanPay:895 · compTick:908 · ONLINE_RATE:922 · onlineEarnActive:923 · onlineEarnTick:927 · onlineEarnFlush:938
marketTick:948 · addCraft:972 · ORDER_MAX:991 · ORDER_LIFE_MS:992 · ORDER_GAP_MIN_MS:993 · ORDER_GAP_SPAN_MS:994
ORDER_TIER_WEIGHT:995 · newOrder:996 · orderTick:1009 · careTick:1017 · expNeed:1099 · addExp:1104
addRP:1124

## js/tpaward.js (41 บรรทัด · 0 รายการ)

## js/typing.js (369 บรรทัด · 0 รายการ)

## js/ui.js (9,053 บรรทัด · 361 รายการ)
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
- 1319-1824 การ์ด Leaderboard — สลับแท็บในการ์ดเดียว (ประหยัดพื้นที่):
- 1825-2193 การ์ดข้อมูลผู้เล่น 👤 — คลิกชื่อในการ์ดเพื่อน/กระดาน แล้วโชว์
- 2194-2418 แผงเพื่อน 👥 (ข้อ 0.3): รหัสเพื่อน + ค้นหา + คำขอ + รายชื่อเพื่อน
- 2419-2514 🌍 เพื่อนอยู่โลก 3D ไหน + ปุ่ม "ตามเข้าไป" (รอบ 642)
- 2515-2553 แชทกับเพื่อน (ข้อ 0.4) — กล่องแชทลอยกลางจอ + แผง emoji
- 2554-2955 รอบ 179: หน้ารวมข้อความ (inbox แบบ Messenger — ธีมกระจกฟ้า sci-fi ของเกม)
- 2956-3302 ระบบส่งของขวัญ (ข้อ 0.5) — ห้องของขวัญ + กล่องเลือกส่ง + ฉากเปิด
- 3303-3395 RANK CARD + ฉากเลื่อนแรงค์
- 3396-3398 PET DASHBOARD
- 3399-3467 📰 รอบ 155: overlay ข้อมูลน้อง & การดูแล + ฟีดกิจกรรมเพื่อน
- 3468-3871 📰 รอบ 701 — ฟีดล็อบบี้ "ทีละโพสต์" แบบ Facebook (ผู้ใช้สั่ง 29 ก.ค. 2026)
- 3872-4031 🌍 รอบ 639: หน้า Feed เต็มจอ — ทุกคน (ไม่ใช่แค่ follow) + ไลก์/คอมเมนต์
- 4032-4697 📖 Dictionary ค้นหาคำศัพท์ (รอบ 254 ผู้ใช้สั่ง 16 ก.ค. 2026)
- 4698-4741 การนอน (คิว 7725691507 ข้อ 1)
- 4742-5123 ให้อาหาร (ระบบมื้อเย็น 18:00 + ความอิ่มสะสม — ข้อ 2+3)
- 5124-5242 🛡️ ควิซอาหารปลอดภัย (ต่อยอดข้อ 5.1)
- 5243-5328 🎀 ห้องแต่งตัวสัตว์เลี้ยง (รอบ 635: แยกออกจาก "ร้านค้า" เดิม —
- 5329-5516 ที่พัก (หลบแดด/หลบฝน) + เครื่องปรับอากาศ
- 5517-5634 บิลสาธารณูปโภค (ค่าไฟ/ค่าน้ำ — เครื่องยนต์อยู่ใน state.js: UTILITIES/billTick)
- 5635-5717 การ์ดมือถือ (ข้อ 7): ซื้อ 10,000 ขายคืน 6,000
- 5718-5728 การ์ดคอมพิวเตอร์ (ข้อ 11): ซื้อ 50,000 ขายคืน 30,000
- 5729-5773 item 8: โบนัสออนไลน์ +0.01 เหรียญ/วิ ฟรีทุกคนที่เปิดเกมออนไลน์อยู่
- 5774-5971 💻 รอบ 706 (ผู้ใช้สั่ง 29 ก.ค. 2026): ช่องรายได้คอมพิวเตอร์บนแถบบนล็อบบี้
- 5972-6188 🎫 การ์ดตั๋วโลกผจญภัย (คิว 7725691507 ข้อ 7)
- 6189-6271 🎃 การ์ดตั๋วโลกผีสิงกลางคืน (ต่อยอดข้อ 8 · ผู้ใช้เคาะ 7 ก.ค.)
- 6272-6375 🚁 การ์ดตั๋วโลกเฮลิคอปเตอร์ Bell (รอบ 52)
- 6376-6475 🛸 การ์ดตั๋วโลกโดรน FPV Racing (รอบ 85) — ซื้อได้เมื่อมีตั๋วเฮลิคอปเตอร์
- 6476-6666 🚗 การ์ดตั๋วโลกขับรถกำแพงเพชร (รอบ 113) — ซื้อได้เมื่อมีตั๋วโดรน FPV
- 6667-6759 ⚽ การ์ดตั๋วโลกสนามฟุตบอล (รอบ 196) — ซื้อได้เมื่อมีตั๋วขับรถ
- 6760-6855 🏍️ การ์ดตั๋วโลกมอเตอร์ไซค์บ้านโพธิ์สวัสดิ์ (รอบ 293) — ซื้อได้เมื่อมีตั๋วขับรถ
- 6856-6953 🛸 การ์ดตั๋วโลก "ยานแม่บุกโลก" (Invasion · รอบ 413)
- 6954-6998 🌍 ปุ่มลัดเข้าโลก 3D ในรางเมนูซ้าย (ผู้ใช้สั่ง 9 ก.ค. 2026)
- 6999-7144 🧭 ป้ายบอกทางของรางเมนูซ้าย (รอบ 601 · ผู้ใช้สั่ง 26 ก.ค. 2026)
- 7145-7314 การ์ดสวนผลไม้ (ข้อ 12): ซื้อต้นไม้ปลูกได้ไม่จำกัด แต่ละต้นออกผล
- 7315-7324 โรงงานผลิตสินค้า 🏭 + ตลาดขายต่อ (แนวคิดใหม่ 5 ก.ค. 2026)
- 7325-7347 โรงงานผลิต (แผง 🏭) — แยกออกจากตลาด (ผู้ใช้สั่ง 6 ก.ค. 2026)
- 7348-7498 ตลาดขายสินค้า (แผง 🏪) — แยกออกจากโรงงาน
- 7499-8410 🚗 รอบ 131: หมวดยานพาหนะ — โชว์รูมรถ 10 คัน (แคตตาล็อก 5 ช่อง/แถว)
- 8411-8471 ร้านสัตว์เลี้ยง (ซื้อเพิ่มได้ ไม่ลบตัวเดิม)
- 8472-8508 เลเวลอัพ (รายตัว)
- 8509-8614 สถิติผลการเรียนรู้
- 8615-8652 item 4: การ์ดสรุปส่งครู — ใบเดียวจบ ชื่อ/วัน-เวลา/เหรียญวันนี้/แรงค์/สอบล่าสุด
- 8653-9053 📞 หน้าจอโทรหาเพื่อน — สายเสียง (รอบ 625 · กลุ่ม 3 คน + ปิดวิดีโอ รอบ 631)
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
lbBadgeSections:1502 · lbDemoRows:1527 · lbChar:1549 · lbfAwardBarHtml:1559 · openLeaderboardFull:1571 · BLK_PAD:1674
BLK_PAD_NEW:1679 · BLK_TOP_FIX:1680 · seatPodChars:1681 · lbCoinHtml:1693 · lbBadgeHtml:1709 · lbBossHtml:1735
lbWordSearchHtml:1758 · lbTypingHtml:1794 · bindPlayerClicks:1830 · showPlayerCard:1840 · petDescImg:2123 · openImgLightbox:2136
openPetPeek:2156 · updateBillBadges:2200 · setBadge:2210 · updateSettingsBadge:2226 · openAttentionSummary:2240 · updateFriendBadge:2282
renderFriendPanel:2292 · friendDoSearch:2340 · refreshFriendData:2364 · FRW_TTL_MS:2429 · FRW_MIN_GAP:2430 · frwWorldOf:2434
frwPanelOpen:2437 · frwScan:2442 · frwPaint:2464 · frwPaintHint:2485 · frwFollow:2499 · CHAT_EMOJI_CATS:2520
CHAT_THEMES:2542 · CHAT_SECRET_MS:2551 · chatBadgeSync:2559 · ibTimeStr:2567 · IB_CALL_RE:2576 · ibCallInfo:2577
openChatInbox:2582 · chatFitKeyboard:2752 · openChat:2768 · giftImg:2959 · giftDateStr:2961 · GREETS:2969
GREET_EXP:2977 · greetInfo:2978 · openGreetPicker:2982 · giftItemPic:3024 · giftItemName:3032 · updateGiftBadge:3038
renderGiftPanel:3047 · acceptGift:3105 · declineGift:3128 · showGreetReveal:3137 · showGiftReveal:3164 · openGiftPicker:3190
confirmSendGift:3258 · doSendGift:3282 · rankBadgeHTML:3306 · renderRankCard:3311 · renderRankTab:3345 · showRankUp:3373
bindPetPlateButtons:3408 · openPetInfoOverlay:3437 · feedAgo:3460 · FEED_DECK_MAX:3480 · FEED_SLIDE_MS:3481 · FEED_RESUME_MS:3482
feedPostImgIndex:3487 · feedPostImg:3498 · feedPostByKey:3507 · feedCanReact:3510 · fpStatsHTML:3515 · fpNameBadgesHTML:3531
fpostHTML:3535 · renderFeedCard:3570 · feedDeckGo:3608 · feedDeckTick:3628 · renderFeedBell:3650 · feedNotifArrived:3658
openFeedNotif:3665 · closeRxPicker:3699 · openRxPicker:3703 · feedFlyWord:3723 · feedPickRx:3734 · openFeedComments:3747
closeFeedComments:3761 · renderFeedComments:3767 · bindFeedPostEvents:3826 · openFeedBoard:3878 · renderFeedBoardLive:3899 · renderFeedBoard:3917
stageColLeft:3936 · alignPetTabs:3945 · alignFeedPlate:3957 · alignProfilePlate:3968 · alignStageLeft:3984 · alignStageCols:3995
watchStageCols:4009 · alignCureBtn:4019 · dictRecordLookup:4043 · DICT_FILE_COUNT:4054 · loadDict:4055 · dictSearch:4070
dictTapWords:4085 · dictEntryHTML:4089 · openDictOverlay:4100 · renderDashboard:4184 · sleepBtnHTML:4703 · sleepHintHTML:4710
sleepAllPets:4721 · wakeAllPets:4734 · feedPet:4745 · openFoodMenu:4759 · feedWith:4830 · AVATAR_UI:4860
playerAvatarHTML:4864 · SHAPE_UI:4872 · showFeedResult:4881 · curePet:4922 · heartsFx:4945 · PAT_HOLD_MS:4968
PAT_EXP:4969 · bindPetTap:4970 · petBounce:4988 · petMood:4994 · shortPatPet:5001 · longPatPet:5009
patCalendarHTML:5029 · patStreakTick:5057 · cureCelebrateFx:5083 · railCureClick:5094 · detoxPet:5106 · openFoodQuiz:5129
closeDressUpBoard:5248 · openDressUpBoard:5252 · renderShop:5269 · homeVisualHTML:5332 · showHomeRuined:5346 · showCutNotice:5367
renderHomeCard:5385 · payMaint:5469 · trashBillUI:5485 · payTrash:5502 · UTILITY_UI:5521 · utilityBillUI:5570
payUtility:5595 · buyUtilityFix:5621 · renderPhoneCard:5639 · buyPhone:5679 · sellPhone:5701 · compLiveTotal:5722
onlineLiveTotal:5733 · syncCoinHeader:5740 · flashPillGain:5745 · renderOnlineEarnPill:5754 · renderCompEarnPill:5779 · openPillInfo:5812
renderComputerCard:5895 · buyComputer:5930 · sellComputer:5953 · soldCount:5979 · soldBadge:5980 · renderTicketCard:5985
loadScriptOnce:6041 · loadAdv3d:6058 · enterAdventure3D:6066 · pickAdvMap:6091 · enterHaunted3D:6126 · advHealClick:6148
buyTicket:6168 · renderHauntCard:6194 · buyHauntTicket:6250 · renderHeliCard:6277 · buyHeliTicket:6335 · enterHeli3D:6358
renderDroneCard:6380 · buyDroneTicket:6435 · enterDrone3D:6458 · renderDriveCard:6481 · buyDriveTicket:6555 · enterDrive3D:6578
pickDriveMap:6613 · enterMotoMapAsCar:6649 · renderSoccerCard:6671 · buySoccerTicket:6719 · enterSoccer3D:6742 · renderMotoCard:6765
buyMotoTicket:6814 · enterMoto3D:6837 · renderInvasionCard:6860 · INVASION_REWARD:6909 · buyInvasionTicket:6911 · enterInvasion3D:6935
WORLD3D:6960 · gotoRobotShop:6971 · scrollShopCardIntoView:6976 · railWorldClick:6979 · railScrollHint:7004 · railScrollTop:7012
initRailScroll:7017 · renderRailWorlds:7037 · tinvNoticeHTML:7098 · openTinvPicker:7106 · fruitCountdown:7150 · renderFarmCard:7162
renderFarmClock:7237 · buyFruit:7253 · sellFruit:7273 · sellAllFruit:7294 · collectImg:7323 · renderFactoryCard:7329
renderMarketCard:7352 · updateWishBadge:7408 · openWishlistDialog:7419 · bindStripArrows:7464 · renderMarketBrowse:7476 · carImg:7505
renderVehicleShop:7506 · CS_CYCLE_MS:7557 · carInteriorImg:7558 · carStatHtml:7560 · renderCarShowroom:7567 · csShowBig:7594
csInit:7621 · RS_CYCLE_MS:7644 · robotImg:7645 · renderRobotShop:7646 · rsShowBig:7668 · rsInit:7689
buyRobot:7708 · enterMecha3D:7730 · pickMechaRobot:7751 · pickDriveCar:7783 · openCarBuyDialog:7826 · buyCarInsurance:7887
payCarLoanMonthly:7906 · payCarLoanFull:7918 · carDriveBlock:7937 · gotoVehicleShop:7942 · gotoMyStock:7947 · showNeedCarDialog:7953
craftDiscount:7965 · renderFactory:7968 · renderOrdersUI:8037 · startProduce:8056 · buyCollectible:8084 · cancelProduce:8112
deliverOrder:8126 · renderOrderClock:8143 · renderCollectMine:8153 · openListDialog:8195 · cancelListing:8248 · buyMarketItem:8271
showCollectReveal:8298 · buyAC:8336 · openHomeShop:8355 · renderPetShop:8414 · showLevelUp:8475 · renderStats:8512
showTeacherCard:8619 · CALL_REACT_EMOS:8663 · CALL_TALK_MIN:8666 · CALL_TALK_HOLD:8667 · CALL_ORDER_GAP:8669 · CALL_TONES:8675
startCall:9049

## js/util.js (944 บรรทัด · 40 รายการ)
shuffle:6 · fmtNum:15 · escapeHTML:19 · gradeSymbol:32 · gradeMark:47 · nameWithGrade:55
gradeMarkCanvas:61 · gradeOf:77 · seededRand:92 · fmtThaiDT:102 · fmtThaiDate:106 · showScreen:111
TOAST_WARN_RE:121 · restackToasts:124 · toast:146 · floatFx:166 · beep:177 · soundStatus:198
PET_MOOD:269 · petVoiceSynth:276 · sirenSynth:353 · playCashier:377 · cashierSynth:391 · keyTapSynth:424
playSpark:465 · sparkSynth:479 · thunderFx:514 · wordAudioFile:582 · speakCutOff:591 · speakWord:595
speakLetter:619 · pickSpeakVoice:642 · speakWordTTS:653 · askNameDialog:673 · askConfirm:718 · alertBox:736
applyNoAnim:756 · openSettings:761 · openHelp:899 · openTeacherGuide:925

## js/vocabbook.js (207 บรรทัด · 14 รายการ)
VB_MAX:11 · VB_QUIZ_N:12 · VB_QUIZ_MIN:13 · vbGroup:16 · VB_GROUP_UI:21 · vbRecord:24
vbSeen:49 · vbStats:62 · vbList:70 · vbReviewCat:81 · vbStartReview:95 · openVocabBook:106
vbRender:148 · vbCardHTML:194

## js/wordsearch.js (414 บรรทัด · 0 รายการ)

## js/wsaward.js (32 บรรทัด · 0 รายการ)

## css/lobby.css (4,793 บรรทัด · 724 selector)
:root:6 · html:15 · body:16 · *:33,34,35,36 · #app:39 · h1:41
.subtitle:42 · .shop-title:43 · #rotate-overlay:46 · .screen:68 · #screen-select:77,78,79,80(+5) · .egg-need:87
.petshop-topright:89 · .petshop-play-link:90,95 · #screen-game:137,138,139,140(+7) · #screen-quiz:151,152,153,154(+6) · #quiz-choices:163,164 · .word-card:171
.quiz-choice:172,173,174 · .big-btn:177,178,179,180 · #screen-dashboard:185,1070,1078 · .lobby-top:192,825,826,827(+27) · .top-flex:193 · .profile-plate:194,198,746,3406(+12)
#rain-fx:203 · .rain-layer:206,212 · .rain-glass:219 · .glass-drop:220 · .rail-btn:235,838,844,845(+16) · .rail-badge:236
.fr-code-box:241 · .fr-code-label:245 · .fr-code-row:246 · .fr-code:247 · .fr-copy-btn:252,256,261,262 · .fr-search-btn:257
.fr-add-btn:258 · .fr-accept:259 · .fr-decline:260 · #fr-search-input:263 · #fr-search-result:267 · .fr-found:268
.fr-hint:272 · .fr-list-title:273 · .fr-row:274 · .fr-req:278 · .fr-row-name:280,284,4573 · .fr-row-status:288
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
.pl-click:694,696,697 · .pl-overlay:698 · .pl-card:702,2555 · .pl-close:708 · .pl-head:712,2429,2432 · .pl-grade:717,4579,4580
.pl-body:718 · .pl-loading:719 · .pl-none:720 · .pl-me-tag:721 · .pl-blk-wrap:723 · .pl-blk:724
.pl-stat:725 · .pl-lbl:730 · .pl-val:731,732 · .pl-tip:733 · .chip-edit:739,744,745 · .rank-mini:751,757,758,759
.pass-photo:761,766 · .pet-tabs:768 · .dict-box:769,773,774,775(+1) · .dict-card:781,786,790,791(+2) · .dict-head:787,788 · .dict-trail:795,799
.dt-c:800,804,805 · .dt-sep:806 · .dict-today:807 · .di-w:809,810,811 · .dict-list:812 · .dict-item:813,817,818,819(+5)
.lobby-mid:833 · .rail-wrap:836,861,865,866(+3) · .lobby-rail:837 · .rail-nudge:868,876,877,880(+1) · .rail-worlds:887 · .rail-div:888
.lobby-stage:930,932,948,1075(+13) · .newword-banner:938,945,950,3958(+2) · .coin-fly:961,964 · .coin-plus:970 · .nw-pop-coin:985,987,988 · .nw-pop-goal:991,992,996,1000
.nw-goal-head:993,995,997 · .nw-goal-bar:998 · .nw-goal-fill:999 · .nw-pop-book:1001,1002 · .nw-tag:1023,3964,3986 · .nw-word:1028,3968,3991,4080
.nw-hint:1030,1031,3969,3993(+1) · .nw-coin:1033,1036,3970,3974 · .nw-countdown:1041,3975 · .nw-bar:1043,3994 · .nw-bar-fill:1045 · .pet-stage:1048,2849
.nw-box:1055,2858 · .nw-pop-word:1056 · .nw-speak:1057 · .nw-pop-phon:1058 · .nw-ipa:1059 · .nw-pop-sent:1060
.nw-pop-mean:1061 · .pet-tab:1062,1063,1064,3212 · .stage-hero:1085,1100,1108,1253(+22) · .hero-ground:1122,1242,1248 · .hero-rank-bg:1124,1127,1130,1134(+18) · #lobby3d-canvas:1147,1148
.hero-scene:1152,1154,1161,1162(+8) · .caretaker-fig:1201 · .caretaker-img:1204 · .caretaker-emoji:1206 · .blk-rig:1213,1214,1215 · .stage-plate:1275,1283,1294,1295(+23)
.plate-title:1289 · .lobby-side:1322,1358,1363,1366(+22) · .side-sec:1325,2141,3108,3384 · .side-label:1326,1331 · .side-label-row:1334,1335 · .lb-tabs-out:1336,1337,1341
.side-glass:1345,1352 · .side-card:1364,1475 · #quest-card:1376,1377,1405,1406(+6) · .q-bigcard:1382,1411 · .qb-top:1384 · .qb-emoji:1385
.qb-name:1387 · .qb-bar:1388,1389 · .qb-row:1391 · .qb-prog:1392 · .qb-reward:1393 · .qb-go:1394,1398
.q-dots:1399 · .q-dot:1400,1401,1402 · .q-bonus:1403 · .inv-card:1422,1424,1425 · .inv-btns:1426 · .inv-go:1427,1429
.inv-x:1430 · #online-card:1434,3116,3117,3118(+4) · .fq-overlay:1435 · .fq-box:1437,2922 · .fq-head:1441,1443 · .fq-close:1444
.fq-sec:1446 · .fq-worlds:1447 · .fq-world:1448,1450 · .fq-acts:1451 · .fq-act:1452,1455,1456 · .lb-prize:1489
.lb-coins:1492 · .lbf-cell:1493,2482,2485,2486(+3) · .lb-award-bar:1495,1501,1502 · .lb-award-go:1503 · .lbf-award:1505,1511,1512,1513 · .pod-pz:1514
.wsa-overlay:1517 · .wsa-box:1519 · .wsa-head:1524 · .wsa-title:1525 · .wsa-when:1526,1527 · .wsa-close:1528,1531
.wsa-cols:1532 · .wsa-col:1533 · .wsa-sec-h:1534,1535 · .wsa-msg:1536 · .wsa-msg-h:1539 · .wsa-msg-b:1540,1541
.wsa-msg-none:1542 · .wsa-rules:1544,1545 · .wsa-list:1546 · .wsa-row:1547,1549 · .wsa-r:1550 · .wsa-n:1551
.wsa-s:1552 · .wsa-p:1553 · .wsa-prizes:1554 · .wsa-pz:1555,1558 · .wsa-reveal-medal:1559 · .lobby-bottom:1569,1571
.lobby-quiz-btn:1572 · .lobby-book-btn:1573,1574 · .lobby-foodquiz-btn:1575,1576 · .lobby-play-btn:1577,1581 · .lobby-exam-btn:1583,1584,1586 · .panel-overlay:1591,1596,4095,4096(+8)
.panel-box:1597 · .panel-head:1604,1608 · .panel-close:1609,1614 · .panel-body:1615,1619,1620 · .panel-page:1617,1618 · .collect-sub:1624
.mkt-empty:1625 · .craft-box:1626 · .mkt-listing:1627 · .mkt-filter:1628,1972 · .hq-grid:1635 · .hq-card:1636,1641,1665
.hq-head:1642 · .hq-pic:1648,1650 · .hq-emoji:1652 · .hq-badge:1653 · .hq-stars:1657 · .hq-price:1658,1663,1664,1667(+6)
.craft-credit:1671,1673,1674 · .car-grid:1681,1683,1684 · .robot-weap:1685 · .dmap-box:1688,1689 · .dmap-grid:1695 · .dmap-card:1697,1700,1701,1702(+2)
.dmap-ico:1704 · .dmap-new:1707 · .dcp-grid:1709 · .dcp-card:1711,1714,1715,1716(+10) · .levelup-box:1733,2812,2813,2919 · .dcp-box:1736,1737,1741,1742(+6)
.dcp-lock:1750 · .sold-badge:1754,1756,1757 · .rs-showroom:1759,4531,4532 · .rs-list:1760,1762,4512,4515 · .rs-thumb:1763,1765,1766,1767(+1) · .rs-thumb-pic:1768,1769
.rs-thumb-price:1770 · .rs-stage:1772 · .rs-big:1775 · .rs-big-img:1776 · .rs-elec:1780,1784,1789 · .rs-edge:1790,1796
.rs-info:1799,1800,1801,1802(+1) · .rs-buy:1804,1806,1807 · .cs-showroom:1811,4504,4505,4533(+3) · .cs-list:1812,1814,4506,4511(+9) · .cs-thumb:1815,1817,1818,1819(+1) · .cs-thumb-pic:1820,1821
.cs-thumb-name:1822 · .cs-thumb-price:1823 · .cs-thumb-own:1824 · .cs-stage:1826 · .cs-big:1829 · .cs-big-img:1830
.cs-elec:1834,1838,1842 · .cs-edge:1843,1849 · .cs-interior:1852 · .cs-inr-label:1853,1854 · .cs-inr-img:1855 · .cs-info:1857,1858,1859,1860(+6)
.cs-buy:1868,1870,1871,1872 · .car-emoji:1874 · .car-mine:1880 · .car-mine-pic:1885 · .car-mine-info:1886 · .car-loan:1887,1888
.car-mine-btns:1889,1890,1891 · .car-locked:1893 · .car-mine-head:1895 · .car-pick-list:1896,1897 · .car-pick:1898,1900,1901 · .car-pick-pic:1902,1903
.car-pick-name:1904,1905 · .car-pick-od:1906 · .car-buy-box:1908,2926 · .cb-pic:1909,1910,1911 · .cb-lines:1912 · .cb-li:1913,1917,1918
.cb-ins:1919,1923,1924 · .cb-plan:1925 · .cb-pl:1926,1931,1933,1937(+1) · .cb-total:1944 · .cb-btns:1945,1950 · .cb-x:1946
.shop-grid:1953 · .shop-item:1954,1959,1964,1965(+3) · .mkt-tab:1973,1974 · .pg-btn:1975,1976,1977 · .pg-dot:1978 · .fr-gift-btn:2001,2006
.gift-sec-title:2009 · .gift-in-row:2011 · .gift-out-row:2015 · .gift-in-pic:2016,2018,2019 · .gift-in-info:2020,2021 · .gift-in-btns:2022
.gift-accept:2023,2027,2029 · .gift-decline:2028 · .gift-box-card:2030 · .gift-box-from:2031,2032 · .gift-note:2033 · .gift-pick-overlay:2036
.gift-pick-box:2040 · .gift-pick-head:2046,2050 · .gift-pick-close:2051 · .gift-pick-tabs:2053 · .gp-tab:2054,2058 · .gift-pick-body:2059
.gp-chips:2060 · .gp-chip:2061,2065 · .gp-card:2066,2067 · .gp-price:2068 · .gp-note:2069 · .gift-cf-pic:2070
.chat-emoji-cats:2075 · .chat-emoji-cat:2079,2083,2084 · .chat-emoji-wrap:2085,2086 · .stage-left:2095,4086 · .pet-info-btn:2099,2106,2107 · .feed-list:2114,2118,2143,2144(+1)
.feed-empty:2119,2122 · .fd-tools:2128 · .feed-bell:2129,2131,2132,2133 · .fd-prog:2137,2138 · .fpost:2145,2694 · .fp-head:2150
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
.lbf-overlay:2461 · .lbf-box:2464 · .lbf-head:2469 · .lbf-title:2470 · .lbf-tabs:2471,2474 · .lbf-close:2477
.lbf-close-l:2478 · .lbf-body:2479 · .lbf-grid:2480 · .lbf-bcat-wrap:2495,2497 · .lbf-bcat:2498 · .lbf-bcat-head:2499,2500,2501
.lbf-bcat-badge:2506,2509 · .lbcat-ic:2507 · .lbcat-ic-label:2510 · .lbf-bcat-rows:2511 · .lbf-bcat-row:2512,2514,2515,2517 · .lbf-podium:2521
.pod:2523,2550,2551 · .pod-char:2525 · .pod-base:2527 · .pod-rank:2529 · .pod-label:2531,4575 · .pod-name:2533
.pod-sc:2535 · .pod-1:2540,2541 · .pod-2:2542,2543 · .pod-3:2544,2545 · .pod-4:2546,2547 · .pod-5:2548,2549
.pl-wide:2568,2571,2572,2573(+8) · .pl-follow:2574,2579,2581 · .pl-unfollow:2583,2589,2590 · .pl-followers:2591 · .pl-cols:2592,2597,2598,2599 · .pl-col:2593
.pl-sec-title:2594 · .pl-badges-col:2600 · .pl-feed:2601,2604,2611 · .pl-feed-row:2605,2609,2610 · .pl-assets-wrap:2613,4412,4487 · .pl-assets:2614,4415,4420,4426(+4)
.pl-asset:2617,2621,2628 · .pl-asset-emoji:2622 · .pl-asset-n:2623 · .pl-pets-wrap:2630 · .pl-pets:2631 · .pl-pet:2632,2637,2639
.pl-pet-nm:2640 · .img-lightbox:2643,2648,2649,2653(+3) · .cert-svg:2672 · .cert-tap:2673,2678 · .cert-chip-sm:2681 · .pl-sec-sub:2701
.pl-certs:2702,2704 · .cert-mini:2705,2709,2711 · .cert-mini-cap:2712 · .cert-none:2714 · .lv-cert-row:2716,2718 · .lv-cert-btn:2719,2724
.cert-lightbox:2726,2731,2732,2736(+3) · .pl-chat:2756,2761 · .pl-call:2763,2769 · .pet-peek:2770,2771 · .pp-chips:2773 · .pp-chip:2774
.pp-gift:2779,2785 · .settings-box:2787,2788,2860,2865(+22) · .set-feed-head:2789 · .set-feed-sub:2793 · .set-feed-row:2794 · .pillinfo-val:2799
.pillinfo-desc:2804,2823 · .pillinfo-box:2815 · .plf-head:2818 · .plf-emoji:2819 · .plf-ht:2820,2821,2822 · .plf-foot:2824,2826,2827
.alert-box:2832,2834 · .ab-emoji:2835 · .ab-title:2836 · .ab-desc:2837 · .ab-btns:2838,2839,2840 · .heal-heart:2842
.attn-box:2857 · .help-box:2897,2898,2899 · .wl-box:2920 · .food-box:2921 · .home-shop-box:2923 · .summary-box:2924
.report-box:2925 · .wl-grid:2928 · .tc-wrap:2930 · .spell-btn:2936,2941 · .sp-hud:2942 · .sp-word:2944
.sp-ch:2945,2950 · .sp-th:2952 · .sp-hint:2954 · .sp-exit:2957,2961 · .sp-banner:2962 · .sp-big:2967
.sp-thb:2969 · .sp-coin:2970 · #spell-confetti:2975 · .sp-rb:2976 · .sp-day:2986 · .sp-perfect:2988
.sp-late:2990 · #spell-coinpop:2993 · .side-sub:3102,3104 · .sec-quest:3109 · .on-page:3120,3121,3122,3123 · .inbox-overlay:3133
.ib-box:3135 · .ib-head:3139 · .ib-close:3143,3145 · .ib-list:3146,3147 · .ib-row:3148,3149,3150,3151 · .ib-ava:3152,3157,3158
.ib-on:3159 · .ib-mid:3161 · .ib-name:3162 · .ib-last:3163 · .ib-meta:3164 · .ib-time:3165
.ib-dot:3167 · .ib-story-badge:3170 · .ib-empty:3174 · .ib-story:3176,3178 · .ib-story-item:3179,3181,3188 · .ib-story-ava:3182
.ib-story-on:3186 · .ib-world:3191,3194 · .ib-tabs:3196 · .ib-tab:3197,3200,3202 · .ib-tab-dot:3203 · .ib-call-ava:3207
.ib-call-row:3208,3209 · #btn-music:3215,3218,3219 · #ws-overlay:3234 · #ws-board:3237,3243,3245 · .ws-head:3248 · .ws-title:3249
.ws-findbar:3252 · .ws-tip:3253 · .ws-grade:3255,3256 · .ws-body:3259 · .ws-gridwrap:3260 · #ws-grid:3263
.ws-cell:3268,3273,3276,3279(+2) · .ws-flash:3285,3287 · .ws-coinpop:3291,3315 · .ws-combo:3302,3306,3307,3308 · .ws-find:3319 · #ws-prog:3320
#ws-words:3324,3328 · .ws-word:3330,3335,3336,3337(+2) · .ws-actions:3343,3344,3353 · .ws-sizes:3348 · .ws-sizes-lb:3350 · .ws-size-now:3351
#ws-new:3354 · #ws-stash:3355 · #ws-clear:3356 · #ws-win:3357,3359 · .ws-win-in:3360,3363 · .sec-online:3386
.rank-tab:3414,3415,3416,3417(+2) · .pet-show-bg:3447,3450,3454,3458(+19) · .ps-night-fx:3550,3552,3564,3569(+1) · .pet-show:3579,3582,3594,3596(+22) · .ps-video:3715 · .ps-worn-pip:3793,3794
.id-card:3817,3824,3828 · .id-chip:3841 · .clock-chip:3850,3851 · .coin-block:3867 · .coin-group:3868 · .coin-pill:3898,3899,3920
.cp-lb:3923 · .cp-v:3924 · .nw-sub:3992 · .top-flex2:4083 · #panel-factory:4102,4103,4107,4108(+39) · #panel-rank:4243,4244,4250,4255(+11)
.grid2x8:4326,4332 · .grid1x5:4342,4348 · .pl-badges-strip:4354 · .pl-badge-card:4358,4364 · .pl-badge-card-ic:4365,4369 · .pl-badge-card-nm:4370
.pl-badges-empty:4376,4378 · .mine-strip:4392,4394,4395,4400(+4) · .mb-strip:4406,4445 · .gmark:4553,4557,4558,4559(+1) · .gm-stack:4562,4566 · .gm-row:4568
.lb-name:4570,4571,4572 · .grade-edit:4593,4598,4599 · .gradelock-box:4603,4619,4624,4626 · .gl-head:4604 · .gl-emoji:4605 · .gl-ht:4606
.gl-cur:4607 · .gl-lock:4608,4613 · .gl-ok:4612 · .gl-lock-sub:4614 · .gl-why:4615 · .gl-pick-lb:4616
.gl-opts:4617 · .gl-hist:4627 · .gl-hline:4628 · .gl-hg:4632 · .gl-hat:4633 · .gl-harr:4634
.gl-foot:4635 · .gl-cf:4636 · .reg-gradelock:4658 · #tp-overlay:4668 · #tp-board:4670,4674 · .tp-head:4678
.tp-title:4679 · .tp-stat:4681,4683 · .tp-pts:4685,4688 · .tp-close:4690,4696,4697 · .tp-snd:4700,4703,4709,4710 · .tp-snd-ic:4704
.tp-snd-track:4705 · .tp-snd-thumb:4707 · .tp-prompt:4714 · .tp-word:4716,4730,4731 · .tp-ch:4718,4723,4724,4726 · .tp-thai:4734
.tp-hint:4736 · .tp-empty:4738 · .tp-keys:4741 · .tp-row:4743 · .tp-row-fn:4745,4778 · .tp-key:4749,4761,4763,4769(+2)
.tp-key-fn:4776 · .tp-fx:4782 · .tp-coinpop:4783 · .tp-pop-pt:4788

## css/style.css (2,019 บรรทัด · 514 selector)
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
.cat-card:1058,1079,1082,1187(+1) · .cat-head:1062 · .cat-emoji:1063 · .cat-name:1064 · .cat-pass:1065 · .cat-info:1066
.cat-btns:1067 · .cat-btn:1068,1072,1073,1074(+3) · .band-sec-head:1077,1078 · .bax-box:1086,1088 · .bax-head:1089 · .bax-sub:1090,1091
.bax-row:1092 · .bax-lv:1093,1096,1097,1098(+3) · .bax-emoji:1099 · .bax-name:1100 · .bax-q:1101 · .bax-need:1103
.bax-rw:1104 · .bax-foot:1108 · .band-mine-tag:1109 · .bsp-box:1112,1115 · .bsp-head:1116 · .bsp-prog:1117
.bsp-retake:1119,1122 · .rts-box:1125 · .rts-head:1127 · .rts-sets:1128 · .rts-set:1129,1130,1131 · .rts-sub:1132
.rts-words:1133 · .rts-word:1134,1136,1137 · .rts-foot:1138 · .rts-okbtn:1139,1141 · .bsp-grid:1142 · .bsp-chip:1143,1146,1147,1148(+1)
.bsp-num:1150 · .bsp-best:1151 · .bsp-tick:1152 · .bsp-foot:1153 · .vb-box:1156,1158 · .vb-head:1159
.vb-total:1160 · .vb-quizbtn:1161,1163 · .vb-tabs:1164 · .vb-tab:1165,1167,1168 · .vb-words:1169 · .vb-word:1170,1173,1174,1175(+3)
.vb-empty:1179 · .vb-foot:1180 · .vb-pg:1181,1183 · #vb-pginfo:1184 · .vb-hint:1185 · .band-lock:1193
.offline-btn:1194,1195 · .quiz-progress:1200 · .quiz-phon:1201 · #quiz-extra:1202,1204,1205,1206 · .quiz-word-card:1207 · .quiz-next:1213,1219,1220,1221(+1)
.quiz-choice:1224,1229,1230,1231 · .quiz-score-pill:1232 · .quiz-time-pill:1234,1236 · .stats-card:1239 · .stats-title:1243,1692 · .stats-row:1244,1245,1246,1247
.stat-badge-line:1249,1252 · .stat-badge-ic:1250 · .game-top:1255 · .back-btn:1256 · .combo-pill:1260 · .timer-wrap:1264
.timer-fill:1265,1266 · .board-label:1268 · .card-grid:1269 · .word-card:1270,1276,1277,1278(+3) · .hint-btn:1284,1289 · .game-endless-note:1292,1297,1299,1303(+6)
.report-btn:1324,1329 · .report-box:1332 · .report-close:1333 · .rp-head:1337 · .rp-avatar:1338,1339 · .rp-title:1340
.rp-sub:1341 · .rp-levelcard:1343 · .rp-level-top:1347 · .rp-bar:1348 · .rp-bar-fill:1349 · .rp-level-note:1350,1351
.rp-grid:1353 · .rp-stat:1354 · .rp-ic:1357 · .rp-num:1358 · .rp-lbl:1359 · .rp-section:1361
.rp-h3:1362 · .rp-badge-mini:1363 · .rp-row:1364,1365,1366 · .rp-empty:1367 · .rp-badges:1368 · .rp-badge:1369
.rp-tline:1372 · .rp-tl-head:1373,1374 · .rp-tl-ems:1375 · .rp-em:1376,1377 · .rp-tl-note:1378,1379 · .rp-crown:1381,1382
.rp-wtitle:1384 · .rp-wnow:1385,1386 · .rp-wgraph:1387 · .rp-wcol:1388 · .rp-wval:1389 · .rp-wbar:1390,1391
.rp-wlbl:1392 · .rp-cheer:1394 · .report-ok:1398 · .summary-box:1401,1456,1460,1461(+2) · .sm-burst:1402 · .sm-title:1404
.sm-line:1405 · .sm-coin:1406 · .sm-matches:1412,1413 · .confetti:1415 · .sm-badge:1422 · .sm-badge-all:1426
.badge-celebrate-overlay:1429,1446 · .badge-celebrate:1435 · .bc-emoji:1441,1443 · .bc-emoji-img:1442 · .bc-title:1444 · .bc-sub:1445
.sm-cheer:1450 · .sm-streak:1451,1452 · .sm-sick:1453 · .sm-btns:1454 · .float-fx:1466 · .toast:1473
.toast-warn:1480,1487,1488,1494 · .toast-clear-all:1496,1503 · .alert-box:1505 · .alert-ok:1506,1511 · .settings-box:1513 · .set-row:1514
.set-hint:1518 · .set-hint-on:1519 · .set-hint-off:1520 · .set-lwrap:1521 · .set-label:1522 · .set-desc:1523
.set-switch:1524,1528,1529,1534(+4) · .set-sw-knob:1530 · .set-sw-txt:1537 · .set-close:1543,1548 · .set-help:1549,1554 · .help-box:1556,1557,1562
.help-item:1558 · .update-banner:1570,1579,1580 · #update-reload:1581 · #update-dismiss:1585 · .levelup-overlay:1591,1597,1598 · .levelup-box:1599,1606,1607,1608(+4)
.bill-box:1614,1618,1619 · .tag-off:1620 · .home-decayed-img:1621 · .home-dark-img:1622 · .thirst-fill:1623 · .thirst-text:1624,1625
.toxin-fill:1628 · .toxin-text:1629,1630 · .detox-btn:1631,1636 · .shape-text:1639,1640,1641,1642(+1) · .avatar-pick:1646 · .avatar-opt:1647,1651,1652,1653
.avatar-chip-img:1657 · .mini-av:1659 · .fp-ava:1660 · .avatar-chip-blk:1662 · .set-avatar-btns:1663 · .avatar-mini:1664,1668
.set-blk-row:1670 · .set-sub2:1671 · .blk-grid:1673 · .blk-mini:1674,1677,1678,1679 · .game-avatar:1682,1683,1684 · .stats-nick:1693
.ticket-owned:1696,1700 · .collect-sub:1705 · .mkt-tabs:1706 · .mkt-tab:1707,1711 · .mkt-filter:1712 · .mkt-row:1716
.mkt-emoji:1720,1721 · .mkt-info:1722,1723 · .mkt-tier-stars:1724 · .mkt-buy:1725,1730,1731 · .mkt-price-lo:1732 · .mkt-price-hi:1733
.mkt-empty:1734 · .collect-grid:1737 · .collect-cell:1738 · .cc-emoji:1739,1740 · .cc-name:1741 · .cc-count:1742
.cc-list-btn:1743,1747 · .mkt-listhead:1748 · .mkt-group-head:1750,1756 · .mkt-two-col:1758,1759,1763,1775(+8) · #phone-card:1764,1780 · #computer-card:1765,1781
#ticket-card:1767 · #haunt-card:1768 · #heli-card:1769 · #drone-card:1770 · #drive-card:1771 · #soccer-card:1772
#moto-card:1773 · #invasion-card:1774 · .mkt-listing:1802 · .ml-cancel:1806 · .mkt-sold:1812,1813,1814 · .list-dialog:1821,1822,1827
.list-hint:1826 · .collect-reveal-frame:1830,1837 · .collect-reveal-img:1836 · .collect-reveal-stars:1838 · .craft-box:1841 · .craft-head:1842
.craft-bar:1843 · .craft-fill:1844 · .craft-text:1845 · .craft-btn-row:1846,1847 · .craft-go-btn:1849,1855,1856,1859 · .craft-cancel:1867,1871
.mkt-catalog:1874,1875,1876 · .mkt-pager:1879 · .pg-btn:1880,1884,1885 · .pg-mid:1886 · .pg-dots:1887 · .pg-dot:1888,1889
.order-head:1890 · .order-row:1891,1896,1898,1900 · .order-deliver:1901,1906 · .order-need:1907 · .avatar-chip-photo:1913 · .pass-photo:1914
.pl-photo:1915 · .pp-cam:1920,1928 · .set-photo-row:1931,1937 · .ph-thumb:1938 · .ph-plus:1939 · .photo-box:1945,1946,1967,1971(+4)
.ph-now:1947 · .ph-now-img:1948,1952 · .ph-now-cap:1953 · .ph-warn:1954 · .ph-sync:1959,1962 · .ph-sync-wait:1963
.ph-sync-ok:1964 · .ph-sync-bad:1965 · .ph-btns:1966 · .ph-tip:1976 · .ph-stage:1978,1982 · .ph-cv:1983
.ph-ring:1984,1989 · .ph-zoom:1993 · .ph-foot:1994 · .ph-crop-box:1995
