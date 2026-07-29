# CODE_MAP.md — แผนที่โค้ด:บรรทัด (เจนอัตโนมัติโดย `tools/gen_code_map.py` — **ห้ามแก้มือ** เดี๋ยวโดนเขียนทับ)

> วิธีใช้: หาชื่อฟังก์ชัน/ค่าคงที่/selector ในไฟล์นี้ (Grep หรือกวาดตา) → `Read` ไฟล์จริง `offset=<บรรทัด>` `limit=40`
> 🗂️ ไฟล์อ้วนมี **สารบัญโซน** (`st-end ชื่อโซน`) — งานทั้งระบบ/โลก 3D: Grep ชื่อโซน → Read/Edit เฉพาะช่วงนั้น **ห้ามอ่านทั้งไฟล์** · เพิ่มระบบใหม่ในไฟล์อ้วนต้องครอบ banner `/* ==== */`+ชื่อโซน (สารบัญเจนเอง)
> css = index `selector:บรรทัดทุกจุดที่ประกาศ` (บั๊ก UI เริ่มหาที่นี่) · เจนใหม่ทุกครั้งที่รัน `python tools/rotate_handoff.py` · อัปเดต: 2026-07-29

## js/adv3d_css.js (1,076 บรรทัด · 0 รายการ)

## js/adv3d_intro.js (72 บรรทัด · 0 รายการ)

## js/adv3d_tex.js (229 บรรทัด · 18 รายการ)
TILE_COLORS:9 · letterTexture:10 · emojiTexture:24 · GHOST_IMG_MAX:36 · measureGhostBox:42 · probeGhostImages:55
whenGhostsReady:67 · ghostTexture:71 · ghostScareSrc:76 · AD_STYLES:84 · adBoardTexture:93 · addAdBillboard:140
ringAds:151 · BUILDING_TINTS:161 · FACADE_ROWS:163 · buildingFacadeTexture:164 · makePeerSprite:189 · bind:225

## js/adventure3d.js (11,423 บรรทัด · 562 รายการ)
### 🗂️ สารบัญโซน js/adventure3d.js (Read/Edit เฉพาะช่วง)
- 1-215 adventure3d.js — โลก 3D First-person 2 โหมด (คิว 7725691507 ข้อ 8 + ต่อยอด)
- 216-279 ⚽ โหมดสนามฟุตบอล (โหมด soccer · รอบ 196) — เล็ง+ชาร์จพลังเตะบอลใส่ป้ายตัวอักษร
- 280-334 🤖 โหมดหุ่นยนต์นักรบ (โหมด mecha · รอบ 199) — มุมมองในหุ่นสูง 5m เดินยิงเอเลี่ยนตัวอักษร
- 335-477 📻 หอบังคับการบิน (รอบ 64 · รอบ 66 เปลี่ยนเป็นอังกฤษล้วนตามผู้ใช้สั่ง)
- 478-498 คำศัพท์ — ตามระดับชั้น + ไม่ซ้ำคำที่ประกอบแล้ว (8.1/8.6) · แยกคลังต่อโหมด
- 499-635 Texture ตัวอักษร / emoji / ป้ายชื่อผู้เล่น (canvas → sprite)
- 636-806 🧱 ตัวละครบล็อก (โลกขับรถ) — เลือกก่อนออกรถ · เพื่อนใน map เห็นเป็นหุ่นบล็อกขับรถบล็อก
- 807-1113 🚙 รอบ 393: รถเพื่อนในโลกขับรถ = โมเดลจริง img/models/car_01.glb (ผู้ใช้สั่ง)
- 1114-1266 สร้างฉาก static ครั้งเดียวต่อโหมด
- 1267-1584 🚗 เมืองกำแพงเพชรจริง (โหมด drive) — ข้อมูล OpenStreetMap ใน js/data/city_kpp.js
- 1585-1601 🌅 ท้องฟ้าภาพจริง (รอบ 203) — ใส่ภาพ panorama 360° (equirectangular 2:1) เป็นฉากหลังท้องฟ้า
- 1602-1641 🧱 เทกซ์เจอร์ภาพจริง (รอบ 323) — วางไฟล์ `img/tex/<key>.jpg` (หรือ .png) แล้วแปะทับพื้นผิวทันที
- 1642-2129 🌌 ท้องฟ้ากลางคืนโรงแรมผีสิง (รอบ 694) — ผู้ใช้: "ข้างนอกโรงแรมยังไม่น่ากลัวพอ"
- 2130-2168 🏨 โรงแรมผีสิง (รอบ 684) — ตัวตึก 5 ชั้นสร้างใน js/hotel3d.js
- 2169-2287 ตัวอักษรในโลก (8.2)
- 2288-2342 🔠🪙 เก็บตัวอักษร 1 ตัว = ได้ 1 เหรียญ (รอบ 345)
- 2343-2402 ประกอบคำอัตโนมัติเมื่อมีตัวอักษรครบ (8.1/8.4)
- 2403-2497 โหมด adv: monsters ยิงสู้ได้ (สเปกเดิม 8.5)
- 2498-2505 👻 ผีในโรงแรม (รอบ 684 — เขียนใหม่ทั้งชุด · ผู้ใช้สั่งข้อ 10-13, 18)
- 2506-2804 🧟 โมเดลผี 3D (รอบ 689 — ผู้ใช้สั่ง: "ภาพผีแบน ๆ ไม่สมจริง ไม่น่ากลัว ใช้โมเดลแทน")
- 2805-3051 🏨 ระบบโรงแรมผีสิง (รอบ 684) — เดินขึ้นชั้น/ไฟดับ/ไฟฉาย/ตู้เสื้อผ้า/รูปตามอง
- 3052-3265 เสียงหลอนโหมดผีสิง — สังเคราะห์ Web Audio (ปลอดลิขสิทธิ์ 100%)
- 3266-3590 Multiplayer — ผู้เล่นอื่นใน map เดียวกัน (สไตล์ Roblox)
- 3591-3790 Voice chat ใน map — WebRTC P2P mesh (เสียงวิ่งตรงระหว่างเครื่อง)
- 3791-3877 🏁 พิธีประกาศแชมป์ (ครูกด "จบรอบแข่ง") — /class/<map>/podium
- 3878-4083 HUD
- 4084-4707 DOM overlay + CSS (สร้างครั้งเดียว — self-contained ไม่แตะ style.css)
- 4708-4838 Input — เมาส์+คีย์บอร์ด และจอสัมผัส (มือถือ landscape)
- 4839-4843 🚁 โหมดเฮลิคอปเตอร์ Bell — ฟิสิกส์บินแบบอาร์เคด (สไตล์ Helicopter Flight Pilot)
- 4844-5235 🛸 โดรน FPV (โหมด drone) — บินเร็ว/คล่อง ลอดหน้าต่างเข้าตึกร้าง เก็บตัวอักษรในห้อง
- 5236-5358 🚗 โหมดขับรถเมืองกำแพงเพชร — ฟิสิกส์รถอาร์เคด (bicycle model)
- 5359-5452 🚦 รอบ 133: ไฟจราจรจริงที่ทางแยกใหญ่ + ฝ่าไฟแดงโดนใบสั่ง ม.22
- 5453-5880 🧭 GPS นำทาง (โหมด drive) — เลือกตัวอักษรเป้าหมาย + เส้นทางตามถนนจริง (A*) + เสียงอังกฤษเลี้ยว
- 5881-5939 🎛️ เข็มหน้าปัดวิ่งจริง (สปีด 0-180 + วัดรอบ 0-8×1000) — วาดทับวงเกจของภาพ dash.png
- 5940-6024 🎵 รอบ 181: วิทยุในรถ — จอ head-unit กลางคอนโซล (visualizer + เลือกเพลง 3 โหมด)
- 6025-6152 🪆 รอบ 191: ตุ๊กตาดุ๊กดิ๊กหน้ารถ — รูปตัวละครที่ผู้เล่นเลือก (blkN.png)
- 6153-6456 🚔 รอบ 128: แผงเตรียมออกรถ + กฎหมายจราจร + ใบสั่ง
- 6457-6499 🛩️📦 ภารกิจไปรษณีย์กลางคืน (รอบ 353) — เฉพาะช่วงฟ้ามืด (heliNight>.5)
- 6500-7687 🚶🛗🚁🪂 โหมดเดินเท้าในเมืองเฮลิฯ (รอบ 354 — ผู้ใช้สั่ง)
- 7688-7761 🎛️ หน้าปัดเข็มขยับจริง (รอบ 61) — วาดสดทุกเฟรมจากค่าการบินจริง
- 7762-8031 🌧️☀️ ชั้นบนกระจก: ที่ปัดน้ำฝน + แสงแดดสาด (รอบ 346)
- 8032-8436 🔊🌧️ เสียงที่ปัดน้ำฝน (รอบ 537) — สังเคราะห์ล้วน ไม่มีไฟล์เสียง
- 8437-8506 📹 กล้องใต้ท้องเครื่อง (belly cam) — รอบ 348
- 8507-8578 🎯 วงเป้าลงจอด (รอบ 349) — ไฮไลต์ดาดฟ้าที่มีตัวอักษร ให้รู้ว่าควรร่อนลงตรงไหน
- 8579-9194 📏 แถบเตือนความเร็วดิ่ง (รอบ 349) — ลงเร็วเกินกรอบกล้องกะพริบแดง สอนให้ร่อนลงนุ่มๆ
- 9195-9197 Loop หลัก
- 9198-10424 ⚽ โหมดสนามฟุตบอล — ฟิสิกส์บอล + เล็ง + ชาร์จพลัง + กล้อง 1st/3rd + ชุดนักเตะ
- 10425-10877 🤖 โหมดหุ่นยนต์นักรบ — เดินยิงเอเลี่ยนตัวอักษร (ต้องยิงเรียงลำดับในคำ)
- 10878-10897 เข้า/ออกโลก
- 10898-11423 ❓ การ์ด "วิธีเล่น" ตอนเข้าโลกครั้งแรก (จำแยกต่อโลกใน localStorage — ไม่แตะ state.js)
### รายการ js/adventure3d.js
GUIDE_WORDS:20 · RELOCATE_MS:21 · HALF:22 · PLAYER_SPEED:23 · HAUNT_LIVES:24 · HAUNT_IFRAME:25
PICK_DIST:26 · EYE_H:27 · NET_SEND_MS:28 · MODES:31 · SHOOT_GAP_MS:95 · MONSTER_REWARD:96
AD_COUNT:97 · AD_RENT_COIN:98 · AD_RENT_MS:99 · SHOP_ADS:103 · PILOT_TIERS:105 · pilotEmoji:106
DRONE_R:118 · DRONE_ACCEL:119 · DRONE_VMAX:120 · DRONE_CLIMB:121 · DRONE_YAWSP:122 · DRONE_GRAV:123
CAR_EYE:127 · CAR_ACCEL:128 · CAR_BRAKE:129 · CAR_VMAX:130 · CAR_LEGAL_KMH:131 · CAR_FINE_SPEED:132
CAR_FINE_BELT:133 · CAR_REPAIR_FEE:134 · CAR_FINE_SIGNAL:135 · CAR_RAM_FEE:136 · CAR_FINE_RED:137 · CAR_VMAX_OFF:138
CAR_VREV:139 · CAR_WB:140 · CAR_STEER_MAX:141 · HELI_SKID:174 · HELI_CRASH_FINE:175 · HELI_MESH_SCALE:176
ASSIST_R:179 · PROP_STALL_MS:184 · PROP_BREAK_SPD:187 · PROP_BROKEN_MUL:188 · BAT_DRAIN:191 · BAT_LETTER:192
BAT_LOW:193 · BAT_EMPTY_MUL:194 · CHG_R:197 · GATE_R:200 · showHeliSkip:207 · BOLT_MIN:208
GLASS_HIT_R:209 · DOOR_R:210 · SOCCER_SHIRTS:220 · BALL_R:225 · GOAL_HW:226 · KICK_SPD_MIN:227
AIM_YAW_SP:228 · SOCCER_TILES:229 · AIM_STICK:237 · CURL_SWIPE:240 · CURL_SPIN:241 · HIT_LIFT:245
GUIDE_N:246 · FK_SPOT_Z:252 · FK_MAN_R:253 · AURA_COST:258 · SB_DRAG:265 · SPOST_R:266
GK_Z:271 · GK_SPRITES:272 · PK_TIME:274 · MECHA_EYE:284 · ALIEN_COUNT:285 · MECHA_MAX_HP:286
MECHA_ATK_RANGE:287 · ALIEN_SHOT_SPD:288 · POWERUP_GAP:289 · BOSS_SCALE:290 · COMBO_X2:291 · BOSS_SPECIES:294
pickBossSpecies:302 · WAVE_BASE_GOAL:304 · waveCfg:305 · MECHA_WEAPONS:314 · ATC_REPLIES:343 · ATC_CLOSERS:348
ATC:353 · netUp:471 · CHAT_MAX:474 · doneList:481 · wordPool:482 · pickWords:495
adRenterActive:507 · FACADE_ROWS:514 · adsFetch:520 · adsWatch:532 · adsStop:539 · adsChanged:540
adRentBuy:551 · heliMusicTick:574 · AD_FLYBY_COIN:578 · adFlybyTick:580 · adShopOpen:599 · adShopRender:613
BLOCK_AVATARS:642 · blkGeo:653 · blkMat:654 · blkCyl:655 · blkFaceMat:657 · makeBlockFigure:672
makeBlockCar:712 · blkNameSprite:758 · makeBlockPeer:774 · makeBlockWalkPeer:795 · disposeBlockPeer:803 · CAR_GLB_URL:814
CAR_GLB_LEN:815 · carSplitWheel:819 · carGlbEnsure:846 · carMatGet:865 · carGlbBuild:881 · carAvCode:930
driveCamToggle:937 · SKID_N:956 · skidGeomGet:958 · skidDrop:963 · skidTick:977 · blkBuildThumbs:987
blkBuildPicker:1005 · pickBlockAvatar:1050 · bubbleSprite:1073 · showPeerBubble:1100 · removePeerBubble:1108 · concreteTexture:1118
brokenWindowTexture:1135 · intactGlassTexture:1151 · chargeIconTexture:1169 · rustyDoorTexture:1178 · dAddBox:1192 · buildAbandoned:1199
makeNameSprite:1272 · flatGeom:1285 · flatGeomUV:1294 · buildDriveCity:1304 · SKY_IMG:1592 · applySky:1593
applyTex:1609 · HSKY_R:1656 · hskyTex:1658 · buildHauntSky:1663 · tickHauntSky:1793 · buildScene:1811
randPos:2172 · randRoadPos:2180 · hotelSpot:2193 · spawnLetter:2202 · spawnLettersForWord:2239 · ensureCoverage:2241
relocateLetters:2254 · removeLetter:2282 · LETTER_COIN:2293 · pickUpLetter:2294 · letterPop:2308 · letterChime:2326
tryCompleteWords:2346 · completeWord:2360 · spawnMonster:2406 · killMonster:2415 · tickMonsters:2423 · damagePlayer:2445
shoot:2461 · tickShots:2475 · GHOST_GLB_URL:2515 · GHOST_MODEL_H:2516 · ghostGlbEnsure:2518 · buildGhostMesh:2544
makeGhostSprite:2566 · spawnGhost:2584 · applyGhostSize:2609 · faceGhostToPlayer:2620 · setGhostVis:2626 · ghostGoLurk:2636
ghostGoStalk:2647 · ghostGoBehind:2659 · tickGhosts:2667 · sessionRecapHtml:2739 · hauntRunSec:2746 · fmtSurv:2747
hauntSurviveFinish:2748 · tickSurvive:2758 · renderHearts:2772 · hotelScare:2778 · knockedOut:2798 · BLACKOUT_MS:2818
FLICKER_MS:2819 · DARK_LETTER:2823 · tintSprite:2824 · hotelReset:2827 · setTorch:2851 · toggleTorch:2867
tickTorch:2872 · hotelBlackout:2882 · hotelFlicker:2898 · tickHotelPlayer:2910 · tickHotelWorld:2962 · hotelAct:3005
openWardrobe:3022 · announceTarget:3045 · netReady:3271 · netJoin:3277 · sendPos:3297 · sendChat:3339
toggleChatBox:3353 · onPeerData:3364 · disposeHeliMesh:3452 · removePeer:3457 · netLeave:3472 · tickPeers:3478
RTC_CFG:3599 · tinvLinked:3600 · partyWord:3607 · syncPartyWord:3620 · updateVoiceBtns:3772 · PODIUM_BONUS:3797
podiumJoin:3799 · podiumLeave:3810 · endRound:3811 · showPodium:3822 · tinvCheck:3862 · showBanner:3882
renderHudTop:3888 · renderHudWords:3893 · renderHudInv:3903 · ddTierFromName:3910 · renderBoard:3912 · drawBigMap:3949
openBigMap:4004 · closeBigMap:4012 · drawMinimap:4017 · loadCarDash:4089 · loadCarWheel:4101 · buildDom:4111
confirmExit:4692 · IS_TOUCH:4711 · bindInput:4712 · movePlayer:4804 · tickPlayer:4814 · collideDrone:4847
propStall:4866 · propBreak:4873 · propFix:4880 · droneBatAdd:4887 · lightningBolt:4890 · startRain:4901
stopRain:4915 · smashGlass:4917 · awardGlass:4928 · neededLetter:4945 · openDoor:4960 · raceStartRun:4980
raceStop:4987 · gateHighlight:5005 · renderRaceHud:5012 · tickDrone:5021 · nearMissTick:5163 · showNearMiss:5187
awardDaredevil:5198 · comboCheer:5215 · comboFlash:5231 · driveCell:5240 · nearestStreet:5246 · collideCar:5256
tlDotY:5287 · tlSet:5291 · driveArms:5308 · tlTick:5320 · TL_GREEN:5364 · tlRedDur:5366
tlightPhase:5367 · buildTrafficLights:5374 · rlTick:5426 · cellDrivable:5458 · cellCenter:5459 · losClear:5461
nearestDrivableCell:5471 · routeGrid:5480 · pickGpsTarget:5533 · gpsSpeak:5545 · NAVLINE_W:5564 · navLineEnsure:5565
navLineHide:5575 · navLineUpdate:5576 · tickGps:5603 · tickDrive:5679 · drawCarDial:5887 · drawCarGauges:5917
RADIO_RECT:5945 · CAR_RADIO_RECT:5947 · carRadioRect:5953 · radioLayout:5955 · radioSetHint:5978 · renderRadioList:5984
radioToggleList:5994 · drawRadioViz:5999 · radioTick:6017 · BOBBLE_FOOT:6030 · BOBBLE_H:6031 · BOBBLE_ASPECT:6032
BOB_OMEGA:6035 · BOB_PITCH_FORCE:6037 · BOBBLE_SKINS:6039 · bobbleSetAvatar:6046 · bobbleLayout:6053 · bobbleTick:6066
bobblePoke:6091 · bobbleApplySkin:6108 · dollOwned:6118 · openDollPicker:6119 · carStartShow:6156 · showLawInfo:6174
lawNotice:6196 · driveFineSettle:6206 · HELI_PHASES:6385 · heliStartPhase:6392 · heliFloorAt:6399 · SOFT_TIERS:6409
softLandBonus:6411 · awardPerfLand:6424 · setHeliLight:6443 · MAIL_COIN:6462 · mailStart:6464 · mailStop:6487
mailTick:6488 · FOOT_EYE:6507 · doorSlideSfx:6513 · doorLerp:6536 · entLerp:6544 · footStepSfx:6554
WRING_COIN:6575 · festivalPaint:6579 · dustTexture:6591 · dustBurst:6600 · dustTick:6614 · HELI_GLB_URL:6635
HELI_GLB_TEX_BLUE:6637 · HELI_GLB_ROTOR:6639 · HELI_GLB_TROTOR:6640 · heliGlbEnsure:6642 · heliMatBlueGet:6660 · heliGlbAssemble:6673
heliNavTick:6712 · peerRotorStop:6719 · peerRotorTick:6725 · heliCrashSfx:6744 · heliMeshBuild:6772 · heliMeshBuildLegacy:6783
buildHeliFoot:6913 · footFloorAt:7029 · insideTerm:7036 · inDoorZone:7037 · footHint:7041 · setFootBtns:7042
liftStart:7047 · beginRide:7058 · endRide:7081 · beginWing:7092 · awardAirLetter:7105 · paxChoiceShow:7124
paxChoiceHide:7150 · pilotShipMesh:7154 · beginPilot:7155 · endPilot:7187 · drawCabinWindow:7211 · tickHeliFoot:7235
tickHeli:7444 · CP_NAT:7696 · CP_GAUGES:7697 · SEAT_LABEL:7710 · SEAT_P_FULL:7711 · SEAT_ZOOM:7712
DASH_OFF_Y:7713 · DASH_DROP:7714 · setSeat:7716 · layoutCockpit:7728 · WIPER:7767 · WIPER_SPD:7770
WIPER_LABEL:7771 · INT_GAP:7772 · WASH_MS:7776 · WASH_TANK_MAX:7780 · SMEAR_LIFE:7792 · CHOP_MIN:7793
SUN_RAY_FAR:7797 · sunRayBlocked:7799 · sunShadeTick:7818 · applyCockpitShade:7829 · rotorChop:7841 · sunUpdate:7849
HELI_FOG_N0:7860 · fogUpdate:7864 · adGlowPulse:7910 · RAIN_MAX:7919 · VISOR_Y:7920 · RAIN_MIN:7921
RAIN_DUR:7922 · DROP_ZONE:7926 · addDrop:7927 · tickDrops:7935 · addWashDrop:7953 · washStart:7960
renderWashGauge:7980 · washTick:7991 · grimeTick:8008 · WIPE_R:8015 · wipeDrops:8016 · wiperSndOn:8039
wiperSndOff:8051 · wiperThunk:8057 · washSpraySfx:8069 · wiperSqueak:8086 · wiperSndTick:8103 · setWiper:8123
tickWiper:8135 · SH_SWEEP:8166 · shadowSweepTick:8168 · REFL_MAX:8180 · REFL_COL:8182 · cityGlowLevel:8183
drawCityGlow:8188 · setVisor:8220 · rainTick:8226 · drawBlade:8243 · drawSmears:8262 · drawGlass:8282
drawBellyCam:8444 · drawBellyHud:8467 · drawLandingTargets:8513 · VS_HARD:8583 · drawDescentBar:8584 · heliShake:8633
cpNeedle:8644 · drawGauges:8661 · XF_START:8709 · PRELOAD_WAIT:8710 · ALT_QUIET_FROM:8712 · ALT_MAX_DAMP:8713
ALT_LP_MIN:8714 · ECHO_NEAR:8715 · WIND_FULL_SPD:8716 · SHUTDOWN_SEC:8717 · PAN_MAX:8719 · OD_RPM:8720
SHAKE_RPM:8721 · SHAKE_HIT:8722 · soccerLetterPos:9202 · letterNeeded:9210 · soccerNeededSet:9215 · soccerTileGeo:9221
soccerGoldTexture:9223 · makeSoccerTile:9240 · soccerRefreshSkins:9249 · soccerBuildTargets:9256 · soccerNextTile:9266 · soccerRetarget:9279
soccerCoinPop:9291 · soccerGrassTexture:9304 · soccerTurfGrade:9326 · soccerTurfTexture:9349 · grassNormalTexture:9368 · soccerLinesTexture:9397
soccerNetTexture:9448 · soccerCrowdTexture:9456 · soccerBallMat:9475 · buildSoccerGoal:9495 · buildStands:9514 · soccerLedBoards:9549
soccerGKEnsure:9646 · soccerGKTick:9662 · fkBuildWall:9691 · fkToggle:9706 · fkHitTest:9722 · pkHud:9741
pkStart:9750 · pkEnd:9764 · pkTick:9779 · repQualify:9786 · repEnsureEl:9789 · repStart:9800
repTick:9807 · soccerNumTex:9832 · makeSoccerPlayer:9842 · soccerNewSpot:9868 · soccerResetBall:9880 · soccerKick:9887
soccerCheer:9904 · guideTexture:9907 · auraActive:9931 · auraLeftMs:9932 · buildAura:9934 · auraBuy:9955
auraRender:9965 · auraTick:9979 · buildDrill:9999 · drillTick:10012 · buildLandRing:10049 · buildGuideRibbon:10059
renderSpinPad:10084 · spinPadToggle:10096 · spinPadPick:10102 · renderCurl:10114 · kickLaunch:10125 · updateSoccerGuide:10133
soccerCamera:10197 · tickSoccer:10218 · soccerKitShow:10398 · soccerKitGo:10413 · emojiSprite:10466 · makeAlien:10471
startWave:10504 · waveSpawnFill:10515 · waveComplete:10524 · updateWaveHud:10534 · checkMechaBossBadge:10536 · alienSpawnPos:10545
removeAlien:10550 · mechaHudWord:10555 · setMechaHudSkin:10563 · mechaComboPop:10575 · mechaShielded:10580 · mechaDamageFx:10582
mechaHitByAlien:10587 · spawnAlienShot:10593 · removeAlienShot:10603 · tickAlienShots:10608 · spawnPowerup:10620 · removePowerup:10633
collectPowerup:10638 · tickPowerups:10645 · updateMechaHud:10654 · mechaTracer:10694 · mechaFire:10703 · explodeAlien:10740
tickMecha:10770 · loop:10826 · grabShot:10858 · savePhoto:10869 · clearEntities:10881 · INTRO_KEY:10902
introSeenObj:10903 · introSeen:10904 · markIntroSeen:10905 · INTRO:10906 · showIntro:10907 · closeIntro:10932
beginPlay:10938 · start:10940 · exitWorld:11136 · mechaRecapLine:11205

## js/auth.js (389 บรรทัด · 32 รายการ)
AUTH_PUSH_MS:23 · AUTH_SDK_TIMEOUT_MS:24 · TEACHER_EMAILS:28 · isTeacher:29 · TESTER_EMAILS:42 · TESTER_COINS:43
isTester:44 · testerBoost:48 · authSetStatus:74 · authShowLogin:86 · authGateOffline:90 · authSaveRef:97
authFetchCloud:98 · authWriteCloud:99 · authDeleteCloud:100 · authWriteProfileName:101 · authPushProfile:108 · authApplyProfileName:116
authAskProfileName:132 · authEditProfileName:143 · authStart:154 · updateOfflinePill:184 · authEnterOffline:189 · authLateSync:206
authLoginClick:222 · authOnLogin:241 · authSyncOnLogin:254 · authFreshStart:283 · authAskLink:292 · authEnterGame:342
authPushSave:357 · authLogout:368

## js/award.js (271 บรรทัด · 0 รายการ)

## js/bandadv.js (68 บรรทัด · 4 รายการ)
BAND_ADV_REWARD:9 · bandAdvLoad:13 · bandAdvPlay:37 · bandAdvCardsHTML:46

## js/dictband.js (362 บรรทัด · 25 รายการ)
BAND_EMOJI:12 · BAND_SET_REWARD:13 · BAND_DONE_BONUS:14 · bandLoad:18 · bandShortTH:36 · bandCat:44
bandSets:66 · bandSetId:75 · bandCheckComplete:78 · bandSetCat:92 · BAND_RETAKE_MAX:104 · bandTriedSets:105
bandRetakeCat:116 · bandShowRetakeSummary:150 · bandSetsPassed:178 · openBandSetPicker:186 · bandMine:257 · bandUnlocked:258
bandLockToast:263 · bandExamLobby:269 · updateBandExamBtn:278 · bandLobbyTick:295 · bandPlay:306 · bandPlayLobby:319
bandCardsHTML:331

## js/game.js (1,017 บรรทัด · 70 รายการ)
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
startQuiz:859 · renderQuizQuestion:875 · quizNext:939 · finishQuiz:952

## js/gradelock.js (158 บรรทัด · 14 รายการ)
GRADES:21 · GRADE_LOCK_DAYS:25 · GRADE_LOCK_MS:26 · gradeRank:29 · myGrade:30 · gradeHistList:33
gradeLockLeftMs:43 · gradeLockLeftDays:50 · gradeUnlockAt:51 · gradeLocked:52 · gradeUpOptions:55 · gradeChangeTo:62
gradeLockNote:86 · openGradeChange:94

## js/hotel3d.js (757 บรรทัด · 38 รายการ)
TEX:25 · FLOOR_H:28 · WEST:31 · SHAFT_E:32 · CORE_E:33 · RZ0:34
LZ0:35 · ROOM_N:36 · DOOR_W:39 · ENTRY_HW:40 · PLAYER_R:41 · floorY:42
Acc:49 · accBox:50 · accGeo:66 · accMesh:74 · makeMats:85 · PORTRAIT_PHOTOS:126
PORTRAIT_SKIN:127 · PORTRAIT_CLOTH:128 · portraitTexture:129 · signTexture:168 · build:182 · inRect:590
insideHotel:591 · surfaceY:594 · collide:612 · roomAt:632 · floorOf:640 · setLights:645
EYE_X0:658 · BLINK_DUR:659 · BLINK_MIN:660 · tick:662 · nearWardrobe:728 · inLift:739
atLiftDoor:743 · randomHaunt:747

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

## js/main.js (277 บรรทัด · 5 รายการ)
syncMusicBtn:98 · showQuizBackPay:134 · showGiantRefund:178 · fitQbp:217 · bootGame:231

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

## js/music.js (157 บรรทัด · 0 รายการ)

## js/netroom.js (807 บรรทัด · 19 รายการ)
CFG:41 · roomsAllowed:63 · HOT_KEYS:71 · COLD_KEYS:72 · HOT_BACK:73 · splitPayload:77
mergeBack:88 · metUids:100 · AIM_TTL_MS:119 · aimAt:121 · aimGet:125 · aimClear:129
MAPS3D:135 · whereFriends:136 · dbOf:160 · envReady:161 · isDenied:164 · create:176
drawBudget:780

## js/online.js (1,769 บรรทัด · 94 รายการ)
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
- 1185-1769 📞 โทรหาเพื่อน — Voice call / Video call แบบ LINE (รอบ 625 · กลุ่ม 3 คนรอบ 631)
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
CALL_MAX_MS:1211 · CALL_MAX_PEERS:1212 · onlineStart:1628 · onlineLoadSDK:1744

## js/state.js (1,121 บรรทัด · 90 รายการ)
STORAGE_KEY:6 · QUIZ_PASS_REWARD:11 · CURE_COST:13 · HUNGRY_SICK_MS:14 · MEAL_HOUR:16 · MEAL_FULL:17
SLEEP_FROM_HOUR:18 · SLEEP_SICK_HOUR:19 · WAKE_HOUR:20 · DINNER_COST:21 · TOXIN_FULL:23 · DETOX_COST:24
FOODQUIZ_Q:26 · FOODQUIZ_COIN:27 · FOODQUIZ_BONUS:28 · SHAPE_JUNK_MEALS:30 · SHAPE_CLEAN_MEALS:31 · SHAPE_MISS_MEALS:32
SHAPE_EXP_BONUS:33 · HEAT_SICK_MS:34 · THIRST_SICK_MS:35 · DEFAULT_STATE:37 · FEED_CATS:188 · FEED_REACTIONS:202
feedRx:210 · FEED_QUICK_CM:212 · SLOT_MS:224 · currentSlotStart:225 · nextSlotStart:231 · mealDayKey:233
nightKeyOf:235 · isNightNow:243 · newPet:248 · loadState:272 · saveState:538 · activePet:545
petStage:546 · isAdult:551 · abilityOn:552 · hasPetType:553 · todayStr:556 · dailyTick:560
addCoins:563 · QUEST_POOL:583 · QUEST_PER_DAY:593 · questsToday:594 · questTick:601 · questEvent:605
assetValue:641 · netWorth:667 · assetCount:669 · refreshRank:686 · heatProtected:702 · rainProtected:706
petHungry:709 · petShapeOf:713 · updatePetShape:719 · shapeMealDone:726 · heatPct:736 · ymStr:745
billOutstanding:749 · UTILITIES:756 · HOME_UTILITIES:762 · homeDecayed:764 · billTick:767 · PET_FOOD_PER_PET:839
petFoodTick:840 · myCar:866 · carLoanDue:871 · carLoanOverdue:876 · carLoanPayable:881 · carLoanPay:888
compTick:901 · ONLINE_RATE:915 · onlineEarnActive:916 · onlineEarnTick:920 · onlineEarnFlush:931 · marketTick:941
addCraft:965 · ORDER_MAX:984 · ORDER_LIFE_MS:985 · ORDER_GAP_MIN_MS:986 · ORDER_GAP_SPAN_MS:987 · ORDER_TIER_WEIGHT:988
newOrder:989 · orderTick:1002 · careTick:1010 · expNeed:1092 · addExp:1097 · addRP:1117

## js/tpaward.js (41 บรรทัด · 0 รายการ)

## js/typing.js (369 บรรทัด · 0 รายการ)

## js/ui.js (8,756 บรรทัด · 352 รายการ)
### 🗂️ สารบัญโซน js/ui.js (Read/Edit เฉพาะช่วง)
- 2-77 UI: Dashboard / ร้านค้า / ที่พัก / ร้านสัตว์เลี้ยง / แรงค์ / สถิติ
- 78-305 🎬 เวทีน้องน่ารัก (Cute Pet Show) — รอบ 604 (ผู้ใช้สั่ง 26 ก.ค. 2026)
- 306-600 🆕 New Word (รอบ 116): คำศัพท์ใหม่ 1 คำ/การ login ตามระดับชั้น
- 601-623 นาฬิกาใต้ชื่อผู้เล่น (วัน · วันที่ · เวลา อัปเดตทุกวินาที)
- 624-676 ข้าวเย็นของผู้เล่น (คิว 7725691507 ข้อ 6)
- 677-708 แถบฝนประจำวัน: นับถอยหลังถึง 19:00 ทุกวัน (ฝนตก 1 ชม.)
- 709-753 เอฟเฟกต์ฝนเต็มจอ (รอบยี่สิบ): ฝนตกจริง (19:00-20:00) + ไม่มีบ้านสภาพดี
- 754-774 การ์ด "คนที่กำลังทำการบ้านไปพร้อมๆ กับเรา"
- 775-829 รอบ 149: กล่อง aside ขวาเลื่อนวนอัตโนมัติ (ล่าง→บน) ไม่มี scrollbar
- 830-1169 Daily Quest (item 3): การ์ดภารกิจวันนี้ใน aside ขวา
- 1170-1262 รอบ 153: เมนูลัดแตะแถวเพื่อนออนไลน์ในกล่อง aside
- 1263-1755 การ์ด Leaderboard — สลับแท็บในการ์ดเดียว (ประหยัดพื้นที่):
- 1756-2067 การ์ดข้อมูลผู้เล่น 👤 — คลิกชื่อในการ์ดเพื่อน/กระดาน แล้วโชว์
- 2068-2292 แผงเพื่อน 👥 (ข้อ 0.3): รหัสเพื่อน + ค้นหา + คำขอ + รายชื่อเพื่อน
- 2293-2388 🌍 เพื่อนอยู่โลก 3D ไหน + ปุ่ม "ตามเข้าไป" (รอบ 642)
- 2389-2427 แชทกับเพื่อน (ข้อ 0.4) — กล่องแชทลอยกลางจอ + แผง emoji
- 2428-2824 รอบ 179: หน้ารวมข้อความ (inbox แบบ Messenger — ธีมกระจกฟ้า sci-fi ของเกม)
- 2825-3171 ระบบส่งของขวัญ (ข้อ 0.5) — ห้องของขวัญ + กล่องเลือกส่ง + ฉากเปิด
- 3172-3256 RANK CARD + ฉากเลื่อนแรงค์
- 3257-3259 PET DASHBOARD
- 3260-3328 📰 รอบ 155: overlay ข้อมูลน้อง & การดูแล + ฟีดกิจกรรมเพื่อน
- 3329-3712 📰 รอบ 701 — ฟีดล็อบบี้ "ทีละโพสต์" แบบ Facebook (ผู้ใช้สั่ง 29 ก.ค. 2026)
- 3713-3872 🌍 รอบ 639: หน้า Feed เต็มจอ — ทุกคน (ไม่ใช่แค่ follow) + ไลก์/คอมเมนต์
- 3873-4527 📖 Dictionary ค้นหาคำศัพท์ (รอบ 254 ผู้ใช้สั่ง 16 ก.ค. 2026)
- 4528-4571 การนอน (คิว 7725691507 ข้อ 1)
- 4572-4950 ให้อาหาร (ระบบมื้อเย็น 18:00 + ความอิ่มสะสม — ข้อ 2+3)
- 4951-5032 🛡️ ควิซอาหารปลอดภัย (ต่อยอดข้อ 5.1)
- 5033-5118 🎀 ห้องแต่งตัวสัตว์เลี้ยง (รอบ 635: แยกออกจาก "ร้านค้า" เดิม —
- 5119-5306 ที่พัก (หลบแดด/หลบฝน) + เครื่องปรับอากาศ
- 5307-5424 บิลสาธารณูปโภค (ค่าไฟ/ค่าน้ำ — เครื่องยนต์อยู่ใน state.js: UTILITIES/billTick)
- 5425-5507 การ์ดมือถือ (ข้อ 7): ซื้อ 10,000 ขายคืน 6,000
- 5508-5518 การ์ดคอมพิวเตอร์ (ข้อ 11): ซื้อ 50,000 ขายคืน 30,000
- 5519-5674 item 8: โบนัสออนไลน์ +0.01 เหรียญ/วิ ฟรีทุกคนที่เปิดเกมออนไลน์อยู่
- 5675-5891 🎫 การ์ดตั๋วโลกผจญภัย (คิว 7725691507 ข้อ 7)
- 5892-5974 🎃 การ์ดตั๋วโลกผีสิงกลางคืน (ต่อยอดข้อ 8 · ผู้ใช้เคาะ 7 ก.ค.)
- 5975-6078 🚁 การ์ดตั๋วโลกเฮลิคอปเตอร์ Bell (รอบ 52)
- 6079-6178 🛸 การ์ดตั๋วโลกโดรน FPV Racing (รอบ 85) — ซื้อได้เมื่อมีตั๋วเฮลิคอปเตอร์
- 6179-6369 🚗 การ์ดตั๋วโลกขับรถกำแพงเพชร (รอบ 113) — ซื้อได้เมื่อมีตั๋วโดรน FPV
- 6370-6462 ⚽ การ์ดตั๋วโลกสนามฟุตบอล (รอบ 196) — ซื้อได้เมื่อมีตั๋วขับรถ
- 6463-6558 🏍️ การ์ดตั๋วโลกมอเตอร์ไซค์บ้านโพธิ์สวัสดิ์ (รอบ 293) — ซื้อได้เมื่อมีตั๋วขับรถ
- 6559-6656 🛸 การ์ดตั๋วโลก "ยานแม่บุกโลก" (Invasion · รอบ 413)
- 6657-6701 🌍 ปุ่มลัดเข้าโลก 3D ในรางเมนูซ้าย (ผู้ใช้สั่ง 9 ก.ค. 2026)
- 6702-6847 🧭 ป้ายบอกทางของรางเมนูซ้าย (รอบ 601 · ผู้ใช้สั่ง 26 ก.ค. 2026)
- 6848-7017 การ์ดสวนผลไม้ (ข้อ 12): ซื้อต้นไม้ปลูกได้ไม่จำกัด แต่ละต้นออกผล
- 7018-7027 โรงงานผลิตสินค้า 🏭 + ตลาดขายต่อ (แนวคิดใหม่ 5 ก.ค. 2026)
- 7028-7050 โรงงานผลิต (แผง 🏭) — แยกออกจากตลาด (ผู้ใช้สั่ง 6 ก.ค. 2026)
- 7051-7201 ตลาดขายสินค้า (แผง 🏪) — แยกออกจากโรงงาน
- 7202-8113 🚗 รอบ 131: หมวดยานพาหนะ — โชว์รูมรถ 10 คัน (แคตตาล็อก 5 ช่อง/แถว)
- 8114-8174 ร้านสัตว์เลี้ยง (ซื้อเพิ่มได้ ไม่ลบตัวเดิม)
- 8175-8211 เลเวลอัพ (รายตัว)
- 8212-8317 สถิติผลการเรียนรู้
- 8318-8355 item 4: การ์ดสรุปส่งครู — ใบเดียวจบ ชื่อ/วัน-เวลา/เหรียญวันนี้/แรงค์/สอบล่าสุด
- 8356-8756 📞 หน้าจอโทรหาเพื่อน — สายเสียง (รอบ 625 · กลุ่ม 3 คน + ปิดวิดีโอ รอบ 631)
### รายการ js/ui.js
startHTML:10 · PET_ANIM:30 · petAnimHTML:35 · petVisualHTML:50 · PET_SHOW:91 · PET_SHOW_STAGE:96
PET_SHOW_H:99 · petShowBgHTML:102 · petClipHint:145 · __clipReady:157 · petShowHTML:165 · lobbyBlk:228
caretakerFigureHTML:234 · footAlign:244 · heroRankBgHTML:278 · NEW_WORD_MS:312 · newWordNext:318 · renderNewWord:329
NW_GAP:367 · alignNewWord:368 · startNewWordTimer:385 · nwCountdownTick:402 · PAT_REMIND_HOUR:418 · patRemindTick:419
applyPatRemindGlow:440 · NEW_WORD_COIN:455 · NW_DAILY_GOAL:456 · NW_DAILY_BONUS:457 · newWordReward:458 · nwDailyTick:481
coinFlyFx:500 · nwDailyBarHTML:533 · showNewWordPopup:544 · renamePet:571 · mealLabel:588 · fmtMins:595
renderClock:604 · dinnerDue:629 · renderDinnerChip:634 · dinnerClick:645 · renderRainBar:680 · rainFxTick:713
RAIN_DROP_IMGS:730 · rainFxDrop:731 · selfPronoun:761 · selfTag:766 · idTag:770 · SIDE_SCROLL_SPEED:780
SIDE_SCROLL_RESUME:781 · initSideScroll:784 · sideScrollTick:812 · QUEST_FLASH_HOLD:836 · QUEST_DECK_FLIP_MS:843 · questGo:846
SIDE_TALL_MIN:858 · sideIsTall:859 · qDeckDraw:864 · qDeckNext:887 · renderQuestCard:901 · sideFlashRows:939
FRIEND_FLASH_GRACE:957 · ONLINE_FLIP_MS:965 · ONLINE_FLIP_RESUME:966 · ONLINE_SWIPE_STEP:967 · ONLINE_ROW_H:974 · onPerPage:977
onChunk:983 · ONLINE_GAP_MAX:993 · onPageSpread:994 · onPageDraw:1003 · onPageFlip:1014 · bindOnlinePager:1025
renderOnlineCard:1060 · bindInviteCards:1177 · bindFriendQuickMenu:1197 · openFriendQuickMenu:1207 · LB_TABS:1270 · LB_WS_TOP:1271
LB_TP_TOP:1272 · bindLbTabs:1274 · updateRankRailBadge:1303 · rankUpCheck:1322 · rankUpSound:1350 · renderLeaderboardCard:1361
bindLbGroupOpen:1388 · lbRankRows:1400 · LB_BCAT_TOP:1441 · lbBadgeSections:1446 · lbDemoRows:1471 · lbChar:1493
lbfAwardBarHtml:1503 · openLeaderboardFull:1515 · BLK_PAD:1612 · seatPodChars:1614 · lbCoinHtml:1624 · lbBadgeHtml:1640
lbBossHtml:1666 · lbWordSearchHtml:1689 · lbTypingHtml:1725 · bindPlayerClicks:1761 · showPlayerCard:1771 · petDescImg:1997
openImgLightbox:2010 · openPetPeek:2030 · updateBillBadges:2074 · setBadge:2084 · updateSettingsBadge:2100 · openAttentionSummary:2114
updateFriendBadge:2156 · renderFriendPanel:2166 · friendDoSearch:2214 · refreshFriendData:2238 · FRW_TTL_MS:2303 · FRW_MIN_GAP:2304
frwWorldOf:2308 · frwPanelOpen:2311 · frwScan:2316 · frwPaint:2338 · frwPaintHint:2359 · frwFollow:2373
CHAT_EMOJI_CATS:2394 · CHAT_THEMES:2416 · CHAT_SECRET_MS:2425 · chatBadgeSync:2433 · ibTimeStr:2441 · IB_CALL_RE:2450
ibCallInfo:2451 · openChatInbox:2456 · chatFitKeyboard:2621 · openChat:2637 · giftImg:2828 · giftDateStr:2830
GREETS:2838 · GREET_EXP:2846 · greetInfo:2847 · openGreetPicker:2851 · giftItemPic:2893 · giftItemName:2901
updateGiftBadge:2907 · renderGiftPanel:2916 · acceptGift:2974 · declineGift:2997 · showGreetReveal:3006 · showGiftReveal:3033
openGiftPicker:3059 · confirmSendGift:3127 · doSendGift:3151 · rankBadgeHTML:3175 · renderRankCard:3180 · renderRankTab:3206
showRankUp:3234 · bindPetPlateButtons:3269 · openPetInfoOverlay:3298 · feedAgo:3321 · FEED_DECK_MAX:3341 · FEED_SLIDE_MS:3342
FEED_RESUME_MS:3343 · feedPostImgIndex:3348 · feedPostImg:3359 · feedPostByKey:3368 · feedCanReact:3371 · fpStatsHTML:3376
fpostHTML:3390 · renderFeedCard:3418 · feedDeckGo:3456 · feedDeckTick:3476 · renderFeedBell:3498 · feedNotifArrived:3506
openFeedNotif:3513 · closeRxPicker:3547 · openRxPicker:3551 · feedFlyWord:3571 · feedPickRx:3582 · openFeedComments:3595
closeFeedComments:3609 · renderFeedComments:3615 · bindFeedPostEvents:3674 · openFeedBoard:3719 · renderFeedBoardLive:3740 · renderFeedBoard:3758
stageColLeft:3777 · alignPetTabs:3786 · alignFeedPlate:3798 · alignProfilePlate:3809 · alignStageLeft:3825 · alignStageCols:3836
watchStageCols:3850 · alignCureBtn:3860 · dictRecordLookup:3884 · DICT_FILE_COUNT:3895 · loadDict:3896 · dictSearch:3911
dictTapWords:3926 · dictEntryHTML:3930 · openDictOverlay:3941 · renderDashboard:4025 · sleepBtnHTML:4533 · sleepHintHTML:4540
sleepAllPets:4551 · wakeAllPets:4564 · feedPet:4575 · openFoodMenu:4589 · feedWith:4660 · AVATAR_UI:4690
playerAvatarHTML:4693 · SHAPE_UI:4699 · showFeedResult:4708 · curePet:4749 · heartsFx:4772 · PAT_HOLD_MS:4795
PAT_EXP:4796 · bindPetTap:4797 · petBounce:4815 · petMood:4821 · shortPatPet:4828 · longPatPet:4836
patCalendarHTML:4856 · patStreakTick:4884 · cureCelebrateFx:4910 · railCureClick:4921 · detoxPet:4933 · openFoodQuiz:4956
closeDressUpBoard:5038 · openDressUpBoard:5042 · renderShop:5059 · homeVisualHTML:5122 · showHomeRuined:5136 · showCutNotice:5157
renderHomeCard:5175 · payMaint:5259 · trashBillUI:5275 · payTrash:5292 · UTILITY_UI:5311 · utilityBillUI:5360
payUtility:5385 · buyUtilityFix:5411 · renderPhoneCard:5429 · buyPhone:5469 · sellPhone:5491 · compLiveTotal:5512
onlineLiveTotal:5523 · renderOnlineEarnPill:5528 · openPillInfo:5551 · renderComputerCard:5598 · buyComputer:5633 · sellComputer:5656
soldCount:5682 · soldBadge:5683 · renderTicketCard:5688 · loadScriptOnce:5744 · loadAdv3d:5761 · enterAdventure3D:5769
pickAdvMap:5794 · enterHaunted3D:5829 · advHealClick:5851 · buyTicket:5871 · renderHauntCard:5897 · buyHauntTicket:5953
renderHeliCard:5980 · buyHeliTicket:6038 · enterHeli3D:6061 · renderDroneCard:6083 · buyDroneTicket:6138 · enterDrone3D:6161
renderDriveCard:6184 · buyDriveTicket:6258 · enterDrive3D:6281 · pickDriveMap:6316 · enterMotoMapAsCar:6352 · renderSoccerCard:6374
buySoccerTicket:6422 · enterSoccer3D:6445 · renderMotoCard:6468 · buyMotoTicket:6517 · enterMoto3D:6540 · renderInvasionCard:6563
INVASION_REWARD:6612 · buyInvasionTicket:6614 · enterInvasion3D:6638 · WORLD3D:6663 · gotoRobotShop:6674 · scrollShopCardIntoView:6679
railWorldClick:6682 · railScrollHint:6707 · railScrollTop:6715 · initRailScroll:6720 · renderRailWorlds:6740 · tinvNoticeHTML:6801
openTinvPicker:6809 · fruitCountdown:6853 · renderFarmCard:6865 · renderFarmClock:6940 · buyFruit:6956 · sellFruit:6976
sellAllFruit:6997 · collectImg:7026 · renderFactoryCard:7032 · renderMarketCard:7055 · updateWishBadge:7111 · openWishlistDialog:7122
bindStripArrows:7167 · renderMarketBrowse:7179 · carImg:7208 · renderVehicleShop:7209 · CS_CYCLE_MS:7260 · carInteriorImg:7261
carStatHtml:7263 · renderCarShowroom:7270 · csShowBig:7297 · csInit:7324 · RS_CYCLE_MS:7347 · robotImg:7348
renderRobotShop:7349 · rsShowBig:7371 · rsInit:7392 · buyRobot:7411 · enterMecha3D:7433 · pickMechaRobot:7454
pickDriveCar:7486 · openCarBuyDialog:7529 · buyCarInsurance:7590 · payCarLoanMonthly:7609 · payCarLoanFull:7621 · carDriveBlock:7640
gotoVehicleShop:7645 · gotoMyStock:7650 · showNeedCarDialog:7656 · craftDiscount:7668 · renderFactory:7671 · renderOrdersUI:7740
startProduce:7759 · buyCollectible:7787 · cancelProduce:7815 · deliverOrder:7829 · renderOrderClock:7846 · renderCollectMine:7856
openListDialog:7898 · cancelListing:7951 · buyMarketItem:7974 · showCollectReveal:8001 · buyAC:8039 · openHomeShop:8058
renderPetShop:8117 · showLevelUp:8178 · renderStats:8215 · showTeacherCard:8322 · CALL_REACT_EMOS:8366 · CALL_TALK_MIN:8369
CALL_TALK_HOLD:8370 · CALL_ORDER_GAP:8372 · CALL_TONES:8378 · startCall:8752

## js/util.js (891 บรรทัด · 39 รายการ)
shuffle:6 · fmtNum:15 · escapeHTML:19 · gradeSymbol:32 · gradeMark:47 · nameWithGrade:55
gradeMarkCanvas:61 · gradeOf:77 · seededRand:92 · fmtThaiDT:102 · fmtThaiDate:106 · showScreen:111
TOAST_WARN_RE:121 · restackToasts:124 · toast:146 · floatFx:166 · beep:177 · PET_MOOD:253
petVoiceSynth:260 · sirenSynth:337 · playCashier:361 · cashierSynth:375 · keyTapSynth:408 · playSpark:449
sparkSynth:463 · thunderFx:498 · wordAudioFile:566 · speakCutOff:575 · speakWord:579 · speakLetter:603
pickSpeakVoice:626 · speakWordTTS:637 · askNameDialog:657 · askConfirm:697 · alertBox:715 · applyNoAnim:735
openSettings:740 · openHelp:846 · openTeacherGuide:872

## js/vocabbook.js (207 บรรทัด · 14 รายการ)
VB_MAX:11 · VB_QUIZ_N:12 · VB_QUIZ_MIN:13 · vbGroup:16 · VB_GROUP_UI:21 · vbRecord:24
vbSeen:49 · vbStats:62 · vbList:70 · vbReviewCat:81 · vbStartReview:95 · openVocabBook:106
vbRender:148 · vbCardHTML:194

## js/wordsearch.js (414 บรรทัด · 0 รายการ)

## js/wsaward.js (32 บรรทัด · 0 รายการ)

## css/lobby.css (4,479 บรรทัด · 702 selector)
:root:6 · html:15 · body:16 · *:33,34,35,36 · #app:39 · h1:41
.subtitle:42 · .shop-title:43 · #rotate-overlay:46 · .screen:68 · #screen-select:77,78,79,80(+5) · .egg-need:87
.petshop-topright:89 · .petshop-play-link:90,95 · #screen-quiz:137,138,139,140(+6) · #quiz-choices:149,150 · .word-card:157 · .quiz-choice:158,159,160
.big-btn:163,164,165,166 · #screen-dashboard:171,1063,1071 · .lobby-top:178,818,819,820(+22) · .top-flex:179 · .profile-plate:180,184,739,3272(+12) · #rain-fx:189
.rain-layer:192,198 · .rain-glass:205 · .glass-drop:206 · .rail-btn:221,831,837,838(+16) · .rail-badge:222 · .fr-code-box:227
.fr-code-label:231 · .fr-code-row:232 · .fr-code:233 · .fr-copy-btn:238,242,247,248 · .fr-search-btn:243 · .fr-add-btn:244
.fr-accept:245 · .fr-decline:246 · #fr-search-input:249 · #fr-search-result:253 · .fr-found:254 · .fr-hint:258
.fr-list-title:259 · .fr-row:260 · .fr-req:264 · .fr-row-name:266,270,4263 · .fr-row-status:274 · .fr-req-btns:275
.online-dot:276 · .fr-chat-btn:277,282,284 · .fr-unread:285 · .fr-call-btn:291,297 · .chat-overlay:306,312,313 · .chat-box:314,615,622,629(+12)
.chat-head:326 · .chat-theme-btn:331,335 · .chat-secret-tg:336,337 · .cs-switch:338,339,344,345 · .cs-slider:340,342 · .chat-secret-note:346
.chat-theme-strip:349 · .chat-theme-sw:351,354,355,356(+1) · .chat-head-name:358,359 · .chat-close:360 · .chat-msgs:364 · .chat-empty:368
.chat-typing:370 · .ct-dots:372,373,375,376 · .no-anim:378,391,452,466(+47) · .chat-bubble:379,384,389 · .chat-emoji:392 · .chat-emo:396,400
.chat-input-row:401 · .chat-emoji-btn:405 · #chat-input:409 · .chat-send:413,418,419 · .chat-call-btn:425,429 · .call-ring:432
.cr-card:436 · .cr-kind:442 · .cr-av:443 · .cr-name:453 · .cr-id:454 · .cr-btns:455
.cr-btn:456,462,467 · .cr-no:463 · .cr-ok:464 · .cr-safe:468 · .call-ov:471,477,499,516(+6) · .call-stage:483
.ctile:484,495,496 · .ct-face:488 · .ct-me:494 · .ct-nm:509,513 · .ct-sub:514 · .call-add:538
.ca-head:545 · .ca-list:546 · .ca-row:547,551 · .ca-dot:552,553 · .ca-nm:554,555 · .ca-go:556
.ca-empty:557 · .ca-safe:558 · .ca-close:559 · .call-bar:563 · .cb-btn:568,573,574 · .cb-end:575,576
.call-emos:577 · .call-emo:582,583 · .call-fx:585 · .call-fx-emo:586 · .pl-click:678,680,681 · .pl-overlay:682
.pl-card:686,2531 · .pl-close:692 · .pl-head:696,2412,2415 · .pl-grade:701,4269,4270 · .pl-badges:703 · .pl-badge-chip:704,708
.pl-badge-ic:709 · .pl-body:711 · .pl-loading:712 · .pl-none:713 · .pl-me-tag:714 · .pl-blk-wrap:716
.pl-blk:717 · .pl-stat:718 · .pl-lbl:723 · .pl-val:724,725 · .pl-tip:726 · .chip-edit:732,737,738
.rank-mini:744,750,751,752 · .pass-photo:754,759 · .pet-tabs:761 · .dict-box:762,766,767,768(+1) · .dict-card:774,779,783,784(+2) · .dict-head:780,781
.dict-trail:788,792 · .dt-c:793,797,798 · .dt-sep:799 · .dict-today:800 · .di-w:802,803,804 · .dict-list:805
.dict-item:806,810,811,812(+5) · .lobby-mid:826 · .rail-wrap:829,854,858,859(+3) · .lobby-rail:830 · .rail-nudge:861,869,870,873(+1) · .rail-worlds:880
.rail-div:881 · .lobby-stage:923,925,941,1068(+13) · .newword-banner:931,938,943,3790(+2) · .coin-fly:954,957 · .coin-plus:963 · .nw-pop-coin:978,980,981
.nw-pop-goal:984,985,989,993 · .nw-goal-head:986,988,990 · .nw-goal-bar:991 · .nw-goal-fill:992 · .nw-pop-book:994,995 · .nw-tag:1016,3796,3818
.nw-word:1021,3800,3823,3907 · .nw-hint:1023,1024,3801,3825(+1) · .nw-coin:1026,1029,3802,3806 · .nw-countdown:1034,3807 · .nw-bar:1036,3826 · .nw-bar-fill:1038
.pet-stage:1041,2726 · .nw-box:1048,2735 · .nw-pop-word:1049 · .nw-speak:1050 · .nw-pop-phon:1051 · .nw-ipa:1052
.nw-pop-sent:1053 · .nw-pop-mean:1054 · .pet-tab:1055,1056,1057,3078 · .stage-hero:1078,1093,1101,1246(+22) · .hero-ground:1115,1235,1241 · .hero-rank-bg:1117,1120,1123,1127(+18)
#lobby3d-canvas:1140,1141 · .hero-scene:1145,1147,1154,1155(+8) · .caretaker-fig:1194 · .caretaker-img:1197 · .caretaker-emoji:1199 · .blk-rig:1206,1207,1208
.stage-plate:1268,1276,1287,1288(+23) · .plate-title:1282 · .lobby-side:1315,1351,1356,1359(+22) · .side-sec:1318,2977,3250 · .side-label:1319,1324 · .side-label-row:1327,1328
.lb-tabs-out:1329,1330,1334 · .side-glass:1338,1345 · .side-card:1357,1467 · #quest-card:1369,1393,1394,1395(+6) · .q-bigcard:1370,1399,1400,1403(+1) · .qb-top:1372
.qb-emoji:1373 · .qb-name:1375 · .qb-bar:1376,1377 · .qb-row:1379 · .qb-prog:1380 · .qb-reward:1381
.qb-go:1382,1386 · .q-dots:1387 · .q-dot:1388,1389,1390 · .q-bonus:1391 · .inv-card:1414,1416,1417 · .inv-btns:1418
.inv-go:1419,1421 · .inv-x:1422 · #online-card:1426,2985,2986,2987(+4) · .fq-overlay:1427 · .fq-box:1429,2791 · .fq-head:1433,1435
.fq-close:1436 · .fq-sec:1438 · .fq-worlds:1439 · .fq-world:1440,1442 · .fq-acts:1443 · .fq-act:1444,1447,1448
.lb-prize:1481 · .lb-coins:1484 · .lbf-cell:1485,2465,2468,2469(+3) · .lb-award-bar:1487,1493,1494 · .lb-award-go:1495 · .lbf-award:1497,1503,1504,1505
.pod-pz:1506 · .wsa-overlay:1509 · .wsa-box:1511 · .wsa-head:1516 · .wsa-title:1517 · .wsa-when:1518,1519
.wsa-close:1520,1523 · .wsa-cols:1524 · .wsa-col:1525 · .wsa-sec-h:1526,1527 · .wsa-msg:1528 · .wsa-msg-h:1531
.wsa-msg-b:1532,1533 · .wsa-msg-none:1534 · .wsa-rules:1536,1537 · .wsa-list:1538 · .wsa-row:1539,1541 · .wsa-r:1542
.wsa-n:1543 · .wsa-s:1544 · .wsa-p:1545 · .wsa-prizes:1546 · .wsa-pz:1547,1550 · .wsa-reveal-medal:1551
.lobby-bottom:1561,1563 · .lobby-quiz-btn:1564 · .lobby-book-btn:1565,1566 · .lobby-foodquiz-btn:1567,1568 · .lobby-play-btn:1569,1573 · .lobby-exam-btn:1575,1576,1578
.panel-overlay:1583,1588,3922,3923(+5) · .panel-box:1589 · .panel-head:1596,1600 · .panel-close:1601,1606 · .panel-body:1607,1611,1612 · .panel-page:1609,1610
.collect-sub:1616 · .mkt-empty:1617 · .craft-box:1618 · .mkt-listing:1619 · .mkt-filter:1620,1964 · .hq-grid:1627
.hq-card:1628,1633,1657 · .hq-head:1634 · .hq-pic:1640,1642 · .hq-emoji:1644 · .hq-badge:1645 · .hq-stars:1649
.hq-price:1650,1655,1656,1659(+6) · .craft-credit:1663,1665,1666 · .car-grid:1673,1675,1676 · .robot-weap:1677 · .dmap-box:1680,1681 · .dmap-grid:1687
.dmap-card:1689,1692,1693,1694(+2) · .dmap-ico:1696 · .dmap-new:1699 · .dcp-grid:1701 · .dcp-card:1703,1706,1707,1708(+10) · .levelup-box:1725,2692,2693,2788
.dcp-box:1728,1729,1733,1734(+6) · .dcp-lock:1742 · .sold-badge:1746,1748,1749 · .rs-showroom:1751,4221,4222 · .rs-list:1752,1754,4202,4205 · .rs-thumb:1755,1757,1758,1759(+1)
.rs-thumb-pic:1760,1761 · .rs-thumb-price:1762 · .rs-stage:1764 · .rs-big:1767 · .rs-big-img:1768 · .rs-elec:1772,1776,1781
.rs-edge:1782,1788 · .rs-info:1791,1792,1793,1794(+1) · .rs-buy:1796,1798,1799 · .cs-showroom:1803,4194,4195,4223(+3) · .cs-list:1804,1806,4196,4201(+9) · .cs-thumb:1807,1809,1810,1811(+1)
.cs-thumb-pic:1812,1813 · .cs-thumb-name:1814 · .cs-thumb-price:1815 · .cs-thumb-own:1816 · .cs-stage:1818 · .cs-big:1821
.cs-big-img:1822 · .cs-elec:1826,1830,1834 · .cs-edge:1835,1841 · .cs-interior:1844 · .cs-inr-label:1845,1846 · .cs-inr-img:1847
.cs-info:1849,1850,1851,1852(+6) · .cs-buy:1860,1862,1863,1864 · .car-emoji:1866 · .car-mine:1872 · .car-mine-pic:1877 · .car-mine-info:1878
.car-loan:1879,1880 · .car-mine-btns:1881,1882,1883 · .car-locked:1885 · .car-mine-head:1887 · .car-pick-list:1888,1889 · .car-pick:1890,1892,1893
.car-pick-pic:1894,1895 · .car-pick-name:1896,1897 · .car-pick-od:1898 · .car-buy-box:1900,2795 · .cb-pic:1901,1902,1903 · .cb-lines:1904
.cb-li:1905,1909,1910 · .cb-ins:1911,1915,1916 · .cb-plan:1917 · .cb-pl:1918,1923,1925,1929(+1) · .cb-total:1936 · .cb-btns:1937,1942
.cb-x:1938 · .shop-grid:1945 · .shop-item:1946,1951,1956,1957(+3) · .mkt-tab:1965,1966 · .pg-btn:1967,1968,1969 · .pg-dot:1970
.fr-gift-btn:1993,1998 · .gift-sec-title:2001 · .gift-in-row:2003 · .gift-out-row:2007 · .gift-in-pic:2008,2010,2011 · .gift-in-info:2012,2013
.gift-in-btns:2014 · .gift-accept:2015,2019,2021 · .gift-decline:2020 · .gift-box-card:2022 · .gift-box-from:2023,2024 · .gift-note:2025
.gift-pick-overlay:2028 · .gift-pick-box:2032 · .gift-pick-head:2038,2042 · .gift-pick-close:2043 · .gift-pick-tabs:2045 · .gp-tab:2046,2050
.gift-pick-body:2051 · .gp-chips:2052 · .gp-chip:2053,2057 · .gp-card:2058,2059 · .gp-price:2060 · .gp-note:2061
.gift-cf-pic:2062 · .chat-emoji-cats:2067 · .chat-emoji-cat:2071,2075,2076 · .chat-emoji-wrap:2077,2078 · .stage-left:2087,3913 · .pet-info-btn:2091,2098,2099
.feed-list:2106,2110,2133,2134 · .feed-empty:2111,2114 · .fd-tools:2120 · .feed-bell:2121,2123,2124,2125 · .fd-prog:2129,2130 · .fpost:2135
.fp-head:2140 · .fp-ico:2141 · .fp-who:2142 · .fp-name:2143 · .fp-when:2144 · .fp-text:2146
.fp-media:2149 · .fp-img:2151 · .fp-cap:2153 · .fp-big:2154 · .fp-sum:2156,2158 · .fp-sum-rx:2159
.fp-sum-none:2160 · .fp-en:2161 · .fp-bar:2163 · .fp-act:2164,2168,2170 · .fp-like:2169 · .fp-page:2181,2182,2183,2184(+1)
.fp-rxbox:2187 · .fp-rxb:2191,2193,2194,2195(+1) · .fp-rxb-off:2197 · .fp-fly:2199,2202,2203 · .fcm-overlay:2206 · .fcm-box:2208
.fcm-post:2212,2213 · .fcm-rxs:2214 · .fcm-rx:2215 · .fcm-list:2216,2218 · .fcm-row:2219,2220,2221 · .fcm-none:2222
.fcm-quick:2224,2226 · .fcm-q:2227,2230,2231 · .fcm-add:2232 · .fcm-input:2233,2235 · .fcm-send:2236,2238 · .fcm-locked:2239
.fnt-overlay:2241 · .fnt-box:2243 · .fnt-list:2247,2249 · .fnt-row:2250,2252 · .fnt-ico:2253 · .fnt-tx:2254,2255
.fnt-sub:2256 · .feed-plate:2258 · .feed-all-btn:2259,2264 · .fdb-overlay:2269 · .fdb-box:2271 · .fdb-head:2275
.fdb-close:2279,2281 · .fdb-live:2282 · .fdb-live-title:2283 · .fdb-live-rows:2285,2287,2288 · .fdb-live-row:2289,2291,2292,2293 · .fdb-dot:2294
.fdb-list:2296,2297 · .fdb-empty:2298 · .fdb-row:2299 · .fdb-row-top:2301 · .fdb-ico:2302 · .fdb-txt:2303
.fdb-name:2304 · .fdb-ago:2305 · .fdb-actions:2306 · .fdb-like:2307,2310,2311,2312 · .fdb-cm-list:2313 · .fdb-cm-row:2314,2316
.fdb-cm-empty:2317 · .fdb-cm-add:2318 · .fdb-cm-input:2319,2321 · .fdb-cm-send:2322,2324 · .fdb-cm-locked:2325 · .pi-overlay:2328
.pi-box:2332,2337,2338,2342(+3) · .pi-close:2344,2349,2350 · .pi-close-left:2352 · .pi-portrait:2354 · .pet-wear:2361,2364,2366 · .pi-portrait-wrap:2369,2371
.pi-dress-btn:2379,2383,2384 · .pi-shape-cap:2385,2388,2389,2390 · .pi-shape-toggle-btn:2392,2395 · .pi-dress-pip:2397,2402,2403,2404(+1) · .pi-wear-note:2407,2409 · .greet-card:2416
.greet-sub:2417 · .greet-grid:2418 · .greet-opt:2419,2422,2423,2424 · .greet-e:2425 · .pi-streak:2429 · .pi-streak-head:2431,2433
.pi-streak-best:2434 · .pi-dots:2435 · .pi-dot:2437,2438,2439 · .pi-streak-note:2440 · .pi-care-title:2441 · .lbf-overlay:2444
.lbf-box:2447 · .lbf-head:2452 · .lbf-title:2453 · .lbf-tabs:2454,2457 · .lbf-close:2460 · .lbf-close-l:2461
.lbf-body:2462 · .lbf-grid:2463 · .lbf-bcat-wrap:2476,2478 · .lbf-bcat:2479 · .lbf-bcat-head:2480,2481,2482 · .lbf-bcat-rows:2483
.lbf-bcat-row:2484,2486,2487,2488(+1) · .bcr-ic:2492 · .badge-ic-fallback:2494 · .lbf-podium:2497 · .pod:2499,2526,2527 · .pod-char:2501
.pod-base:2503 · .pod-rank:2505 · .pod-label:2507,4265 · .pod-name:2509 · .pod-sc:2511 · .pod-1:2516,2517
.pod-2:2518,2519 · .pod-3:2520,2521 · .pod-4:2522,2523 · .pod-5:2524,2525 · .pl-wide:2544,2547,2548,2549(+8) · .pl-follow:2550,2555,2557
.pl-unfollow:2559,2565,2566 · .pl-followers:2567 · .pl-cols:2568 · .pl-col:2569 · .pl-sec-title:2570 · .pl-feed:2571,2574,2581
.pl-feed-row:2575,2579,2580 · .pl-assets-wrap:2583,4102,4177 · .pl-assets:2584,4105,4110,4116(+4) · .pl-asset:2587,2591,2598 · .pl-asset-emoji:2592 · .pl-asset-n:2593
.pl-pets-wrap:2600 · .pl-pets:2601 · .pl-pet:2602,2607,2609 · .pl-pet-nm:2610 · .img-lightbox:2613,2618,2619,2623(+3) · .pl-chat:2636,2641
.pl-call:2643,2649 · .pet-peek:2650,2651 · .pp-chips:2653 · .pp-chip:2654 · .pp-gift:2659,2665 · .settings-box:2667,2668,2737,2742(+20)
.set-feed-head:2669 · .set-feed-sub:2673 · .set-feed-row:2674 · .pillinfo-val:2679 · .pillinfo-desc:2684,2703 · .pillinfo-box:2695
.plf-head:2698 · .plf-emoji:2699 · .plf-ht:2700,2701,2702 · .plf-foot:2704 · .alert-box:2709,2711 · .ab-emoji:2712
.ab-title:2713 · .ab-desc:2714 · .ab-btns:2715,2716,2717 · .heal-heart:2719 · .attn-box:2734 · .help-box:2766,2767,2768
.wl-box:2789 · .food-box:2790 · .home-shop-box:2792 · .summary-box:2793 · .report-box:2794 · .wl-grid:2797
.tc-wrap:2799 · .spell-btn:2805,2810 · .sp-hud:2811 · .sp-word:2813 · .sp-ch:2814,2819 · .sp-th:2821
.sp-hint:2823 · .sp-exit:2826,2830 · .sp-banner:2831 · .sp-big:2836 · .sp-thb:2838 · .sp-coin:2839
#spell-confetti:2844 · .sp-rb:2845 · .sp-day:2855 · .sp-perfect:2857 · .sp-late:2859 · #spell-coinpop:2862
.side-sub:2971,2973 · .sec-quest:2978 · .on-page:2989,2990,2991,2992 · .inbox-overlay:3002 · .ib-box:3004 · .ib-head:3008
.ib-close:3012,3014 · .ib-list:3015,3016 · .ib-row:3017,3018,3019,3020 · .ib-ava:3021 · .ib-on:3025 · .ib-mid:3027
.ib-name:3028 · .ib-last:3029 · .ib-meta:3030 · .ib-time:3031 · .ib-dot:3033 · .ib-story-badge:3036
.ib-empty:3040 · .ib-story:3042,3044 · .ib-story-item:3045,3047,3054 · .ib-story-ava:3048 · .ib-story-on:3052 · .ib-world:3057,3060
.ib-tabs:3062 · .ib-tab:3063,3066,3068 · .ib-tab-dot:3069 · .ib-call-ava:3073 · .ib-call-row:3074,3075 · #btn-music:3081,3084,3085
#ws-overlay:3100 · #ws-board:3103,3109,3111 · .ws-head:3114 · .ws-title:3115 · .ws-findbar:3118 · .ws-tip:3119
.ws-grade:3121,3122 · .ws-body:3125 · .ws-gridwrap:3126 · #ws-grid:3129 · .ws-cell:3134,3139,3142,3145(+2) · .ws-flash:3151,3153
.ws-coinpop:3157,3181 · .ws-combo:3168,3172,3173,3174 · .ws-find:3185 · #ws-prog:3186 · #ws-words:3190,3194 · .ws-word:3196,3201,3202,3203(+2)
.ws-actions:3209,3210,3219 · .ws-sizes:3214 · .ws-sizes-lb:3216 · .ws-size-now:3217 · #ws-new:3220 · #ws-stash:3221
#ws-clear:3222 · #ws-win:3223,3225 · .ws-win-in:3226,3229 · .sec-online:3252 · .rank-tab:3280,3281,3282,3283(+2) · .pet-show-bg:3313,3316,3320,3324(+19)
.ps-night-fx:3416,3418,3430,3435(+1) · .pet-show:3445,3448,3460,3462(+22) · .ps-video:3581 · .ps-worn-pip:3659,3660 · .id-card:3683,3689,3693 · .id-chip:3706
.clock-chip:3715,3716 · .coin-block:3732 · .coin-group:3733 · .cp-lb:3755 · .cp-v:3756 · .nw-sub:3824
.top-flex2:3910 · #panel-factory:3929,3930,3934,3935(+39) · .grid2x8:4058,4064 · .mine-strip:4082,4084,4085,4090(+4) · .mb-strip:4096,4135 · .gmark:4243,4247,4248,4249(+1)
.gm-stack:4252,4256 · .gm-row:4258 · .lb-name:4260,4261,4262 · .grade-edit:4283,4288,4289 · .gradelock-box:4291,4307,4312,4314 · .gl-head:4292
.gl-emoji:4293 · .gl-ht:4294 · .gl-cur:4295 · .gl-lock:4296,4301 · .gl-ok:4300 · .gl-lock-sub:4302
.gl-why:4303 · .gl-pick-lb:4304 · .gl-opts:4305 · .gl-hist:4315 · .gl-hline:4316 · .gl-hg:4320
.gl-hat:4321 · .gl-harr:4322 · .gl-foot:4323 · .gl-cf:4324 · .reg-gradelock:4344 · #tp-overlay:4354
#tp-board:4356,4360 · .tp-head:4364 · .tp-title:4365 · .tp-stat:4367,4369 · .tp-pts:4371,4374 · .tp-close:4376,4382,4383
.tp-snd:4386,4389,4395,4396 · .tp-snd-ic:4390 · .tp-snd-track:4391 · .tp-snd-thumb:4393 · .tp-prompt:4400 · .tp-word:4402,4416,4417
.tp-ch:4404,4409,4410,4412 · .tp-thai:4420 · .tp-hint:4422 · .tp-empty:4424 · .tp-keys:4427 · .tp-row:4429
.tp-row-fn:4431,4464 · .tp-key:4435,4447,4449,4455(+2) · .tp-key-fn:4462 · .tp-fx:4468 · .tp-coinpop:4469 · .tp-pop-pt:4474

## css/style.css (1,817 บรรทัด · 474 selector)
:root:5 · *:15 · html:16,21 · input:25 · body:29 · #app:35
.screen:38,39 · h1:42 · .subtitle:43 · .egg-grid:46,63 · .egg-card:47,52,53,54(+2) · .pet-price:57,61
.egg:65,71,75 · .d1:76 · .basket:79,80,85,91(+5) · .basket-dog:89,102,103,104 · .basket-cat:90,105,106,107 · .egg-dragon:110
.topbar:125 · .topbar-coins:126 · .coin-pill:127,138,142,147(+2) · .coin-ic:134 · .no-anim:148,563,1481,1774(+2) · .net-coin:150
.q-row:162,163,164,168(+1) · .q-emoji:165 · .q-mid:166 · .q-name:167 · .q-bar:169,170 · .q-right:172,173
.q-foot:174,175 · .tc-open:178,179 · .tc-wrap:180 · .tc-card:181 · .tc-head:185 · .tc-sub:189
.tc-name:190,191 · .tc-badges:192 · .tc-when:193 · .tc-row:194,198 · .tc-pass:199 · .tc-try:200
.tc-sign:201 · .tc-hint:202 · .tc-close:203 · .mb-seller:209 · .mb-buy:210 · .wl-open:213,218
.strip-wrap:221,239 · .strip-x:222,229,230,242(+1) · .strip-arrow:231,237,238 · .craft-toolbar:245,246 · .fc-cols:248,249 · .wl-box:283
.wl-head:284,285,286 · .wl-grid:288 · .dress-overlay:296 · .wl-it:306,310,311,312 · .wl-emoji:313 · .wl-name:314
.wl-h:315 · .hq-card:316,398 · .icon-btn:317 · #settings-badge:323 · .badge-pop:326 · .attn-box:328,329,346
.attn-list:330 · .attn-row:331,336 · .attn-ico:337 · .attn-txt:338,339 · .attn-go:340 · .attn-total:341,345
.rain-banner:349,354,355,356 · .rain-row:358 · .rain-icon:359 · .rain-track:360 · .rain-fill:364 · .rain-note:365
.comp-earn:368,380,384,385(+1) · .comp-earn-label:373 · .comp-earn-num:374,378 · .comp-earn-sub:379 · .farm-sub:391 · .farm-mkt-hint:392
.farm-cols:394,395 · .farm-shop:397 · .farm-hq:399,400,401 · .farm-yield:402,403 · .farm-tree:404,409,414,418 · .farm-tree-emoji:413
.farm-tree-name:416 · .farm-tree-status:417 · .farm-grow-badge:419 · .farm-sell-btn:440,445 · .farm-sellall-btn:446,452,453 · .rank-card:456
.rank-badge-wrap:461 · .rank-badge-img:462 · .rank-badge-emoji:463 · .rank-body:464 · .rank-name:465,466 · .rank-bar:467
.rank-fill:468 · .rank-text:469 · .rankup-overlay:472 · .rankup-rays:478 · .rankup-content:494 · .rankup-title:499
.rankup-badge:504,517 · .rankup-badge-img:516 · .rankup-name:518 · .rankup-en:522 · .rankup-sub:526 · .rankup-btn:527,534,535
.qbp:539,540,541,542(+4) · .cr-btn-row:548 · .rankup-btn-2:549,550 · .thunder-fx:553 · .quake:554 · .pet-tabs:566
.pet-tab:567,573,574 · .pet-card:576 · .pet-stage:581 · .aura:582,588 · .sp1:589 · .pet-wrap:592
.pet-emoji:593 · .pet-img:594 · .egg-img:595 · .feed-pet:596,742 · .pet-baby:597 · .pet-adult:598
.pet-egg-stage:600 · .wear:602 · .wear-head:603 · .wear-face:604 · .wear-neck:605 · .pet-name:607
.stage-label:608 · .level-row:609 · .level-badge:610 · .exp-bar:614 · .exp-fill:615 · .exp-text:616
.ability-box:618,622 · .hunger-bar:625 · .hunger-fill:626,627,628 · .food-item:634,676,680,681(+6) · .hunger-text:638 · .heat-bar:641
.heat-fill:642 · .heat-text:643,644,645 · .care-row:647 · .care-btn:648,652,655 · .btn-feed:653 · .btn-cure:654
.sick-banner:656 · .pet-sick:660 · .pet-asleep:663 · .sleep-badge:664 · .btn-sleep:666 · .dinner-btn:669
.food-box:673,674 · .food-grid:675 · .fav-tag:695 · .fd-exp:699 · .food-sec:701 · .food-sec-human:705
.bad-tag:707 · .fd-toxin:711 · .fd-safe:712 · .fq-box:715,716 · .fq-progress:717 · .fq-pair:718,719
.fq-ask:720 · .fq-why:721 · .fq-btns:725,726,730 · .fq-yes:731 · .fq-no:732 · .fq-next:733
.food-cancel:734 · .feed-box:740,741 · .feed-gain:743 · .sick-badge:747 · .big-btn:753,759,992,993(+6) · .shop-card:762
.shop-title:766 · .shop-grid:767 · .shop-item:768,772,773,774(+4) · .it-tag:779 · .tag-wear:780 · .lock-banner:782
.home-current:788,793,794 · .home-img:795 · .home-emoji:796 · .home-btn:797,819 · .home-layout:799 · .home-pic-col:800,806
.home-img-big:804 · .home-info-col:807,809,812,813 · .home-name-row:810 · .home-desc-row:811 · .home-shop-box:821,822 · .home-list:823
.home-option:824,828,829,830(+1) · .home-opt-img:831 · .home-opt-body:833,834 · .home-price:835 · .reset-link:840 · .login-card:846
.login-pets:847 · .login-status:848 · .google-btn:849,855,856 · .login-note:857 · .install-btn:860,866,867 · .install-guide-overlay:870
.install-guide:874,878,881 · .install-steps:879,880 · .install-guide-close:882 · .login-account:887 · .register-card:890,894,912,916 · .reg-safety:896,898,899
.reg-privacy:901,903,904 · #screen-register:906,907,908,909(+2) · .student-chip:917 · .clock-chip:921 · .online-count:927 · .online-row:934,938,939
.online-dot:943 · .online-name:948 · .online-act:952 · .online-live:956 · .online-note:960 · .lb-empty:963
.lb-list:964 · .lb-row:965,969,970 · .lb-rank:974 · .lb-name:976,980 · .lb-coins:984 · .lb-hint:986
.lb-badgeline:987 · .lb-tabs:989 · .lb-tab:990,991 · .tinv-note:1002 · .cat-card:1008,1029,1108,1113 · .cat-head:1012
.cat-emoji:1013 · .cat-name:1014 · .cat-pass:1015 · .cat-info:1016 · .cat-btns:1017 · .cat-btn:1018,1022,1023,1024(+2)
.band-sec-head:1027,1028 · .band-mine-tag:1030 · .bsp-box:1033,1036 · .bsp-head:1037 · .bsp-prog:1038 · .bsp-retake:1040,1043
.rts-box:1046 · .rts-head:1048 · .rts-sets:1049 · .rts-set:1050,1051,1052 · .rts-sub:1053 · .rts-words:1054
.rts-word:1055,1057,1058 · .rts-foot:1059 · .rts-okbtn:1060,1062 · .bsp-grid:1063 · .bsp-chip:1064,1067,1068,1069(+1) · .bsp-num:1071
.bsp-best:1072 · .bsp-tick:1073 · .bsp-foot:1074 · .vb-box:1077,1079 · .vb-head:1080 · .vb-total:1081
.vb-quizbtn:1082,1084 · .vb-tabs:1085 · .vb-tab:1086,1088,1089 · .vb-words:1090 · .vb-word:1091,1094,1095,1096(+3) · .vb-empty:1100
.vb-foot:1101 · .vb-pg:1102,1104 · #vb-pginfo:1105 · .vb-hint:1106 · .band-lock:1114 · .offline-btn:1115,1116
.quiz-progress:1121 · .quiz-phon:1122 · #quiz-extra:1123,1125,1126,1127 · .quiz-word-card:1128 · .quiz-next:1134,1140,1141,1142(+1) · .quiz-choice:1145,1150,1151,1152
.quiz-score-pill:1153 · .stats-card:1156 · .stats-title:1160,1602 · .stats-row:1161,1162,1163,1164 · .stat-badge-line:1166,1169 · .stat-badge-ic:1167
.game-top:1172 · .back-btn:1173 · .combo-pill:1177 · .timer-wrap:1181 · .timer-fill:1182,1183 · .board-label:1185
.card-grid:1186 · .word-card:1187,1193,1194,1195(+3) · .hint-btn:1201,1206 · .game-endless-note:1209,1214,1216,1220(+6) · .report-btn:1241,1246 · .report-box:1249
.report-close:1250 · .rp-head:1254 · .rp-avatar:1255,1256 · .rp-title:1257 · .rp-sub:1258 · .rp-levelcard:1260
.rp-level-top:1264 · .rp-bar:1265 · .rp-bar-fill:1266 · .rp-level-note:1267,1268 · .rp-grid:1270 · .rp-stat:1271
.rp-ic:1274 · .rp-num:1275 · .rp-lbl:1276 · .rp-section:1278 · .rp-h3:1279 · .rp-badge-mini:1280
.rp-row:1281,1282,1283 · .rp-empty:1284 · .rp-badges:1285 · .rp-badge:1286 · .rp-tline:1289 · .rp-tl-head:1290,1291
.rp-tl-ems:1292 · .rp-em:1293,1294 · .rp-tl-note:1295,1296 · .rp-crown:1298,1299 · .rp-wtitle:1301 · .rp-wnow:1302,1303
.rp-wgraph:1304 · .rp-wcol:1305 · .rp-wval:1306 · .rp-wbar:1307,1308 · .rp-wlbl:1309 · .rp-cheer:1311
.report-ok:1315 · .summary-box:1318,1373,1377,1378(+2) · .sm-burst:1319 · .sm-title:1321 · .sm-line:1322 · .sm-coin:1323
.sm-matches:1329,1330 · .confetti:1332 · .sm-badge:1339 · .sm-badge-all:1343 · .badge-celebrate-overlay:1346,1363 · .badge-celebrate:1352
.bc-emoji:1358,1360 · .bc-emoji-img:1359 · .bc-title:1361 · .bc-sub:1362 · .sm-cheer:1367 · .sm-streak:1368,1369
.sm-sick:1370 · .sm-btns:1371 · .float-fx:1383 · .toast:1390 · .toast-warn:1397,1404,1405,1411 · .toast-clear-all:1413,1420
.alert-box:1422 · .alert-ok:1423,1428 · .settings-box:1430 · .set-row:1431 · .set-hint:1435 · .set-hint-on:1436
.set-hint-off:1437 · .set-lwrap:1438 · .set-label:1439 · .set-desc:1440 · .set-switch:1441,1445,1446,1451(+4) · .set-sw-knob:1447
.set-sw-txt:1454 · .set-close:1460,1465 · .set-help:1466,1471 · .help-box:1473,1474,1479 · .help-item:1475 · .update-banner:1487,1496,1497
#update-reload:1498 · #update-dismiss:1502 · .levelup-overlay:1508 · .levelup-box:1512,1519,1520,1521(+4) · .bill-box:1527,1531,1532 · .tag-off:1533
.home-decayed-img:1534 · .home-dark-img:1535 · .thirst-fill:1536 · .thirst-text:1537,1538 · .toxin-fill:1541 · .toxin-text:1542,1543
.detox-btn:1544,1549 · .shape-text:1552,1553,1554,1555(+1) · .avatar-pick:1559 · .avatar-opt:1560,1564,1565,1566 · .avatar-chip-img:1570 · .avatar-chip-blk:1572
.set-avatar-btns:1573 · .avatar-mini:1574,1578 · .set-blk-row:1580 · .set-sub2:1581 · .blk-grid:1583 · .blk-mini:1584,1587,1588,1589
.game-avatar:1592,1593,1594 · .stats-nick:1603 · .ticket-owned:1606,1610 · .collect-sub:1615 · .mkt-tabs:1616 · .mkt-tab:1617,1621
.mkt-filter:1622 · .mkt-row:1626 · .mkt-emoji:1630,1631 · .mkt-info:1632,1633 · .mkt-tier-stars:1634 · .mkt-buy:1635,1640,1641
.mkt-price-lo:1642 · .mkt-price-hi:1643 · .mkt-empty:1644 · .collect-grid:1647 · .collect-cell:1648 · .cc-emoji:1649,1650
.cc-name:1651 · .cc-count:1652 · .cc-list-btn:1653,1657 · .mkt-listhead:1658 · .mkt-group-head:1660,1666 · .mkt-two-col:1668,1669,1673,1685(+8)
#phone-card:1674,1690 · #computer-card:1675,1691 · #ticket-card:1677 · #haunt-card:1678 · #heli-card:1679 · #drone-card:1680
#drive-card:1681 · #soccer-card:1682 · #moto-card:1683 · #invasion-card:1684 · .mkt-listing:1712 · .ml-cancel:1716
.mkt-sold:1722,1723,1724 · .list-dialog:1731,1732,1737 · .list-hint:1736 · .collect-reveal-frame:1740,1747 · .collect-reveal-img:1746 · .collect-reveal-stars:1748
.craft-box:1751 · .craft-head:1752 · .craft-bar:1753 · .craft-fill:1754 · .craft-text:1755 · .craft-btn-row:1756,1757
.craft-go-btn:1759,1765,1766,1769 · .craft-cancel:1777,1781 · .mkt-catalog:1784,1785,1786 · .mkt-pager:1789 · .pg-btn:1790,1794,1795 · .pg-mid:1796
.pg-dots:1797 · .pg-dot:1798,1799 · .order-head:1800 · .order-row:1801,1806,1808,1810 · .order-deliver:1811,1816 · .order-need:1817
