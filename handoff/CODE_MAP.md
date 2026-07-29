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

## js/cert.js (382 บรรทัด · 24 รายการ)
CERT_MAX:17 · CERT_ISSUER_EN:18 · CERT_MONTHS:19 · CERT_TOPIC_EN:23 · CERT_LEVEL_EN:44 · CERT_ADV_EN:49
certThIndex:53 · certTitleOf:62 · certSerial:78 · certDateEN:86 · certAward:94 · certMine:110
certBackfill:115 · certCatNameById:143 · certFromPost:163 · certXML:178 · certFit:183 · certHolder:188
certSVG:198 · certChipHTML:330 · openCertBig:337 · openCertMine:353 · certStripHTML:361 · certBindStrip:374

## js/dictband.js (362 บรรทัด · 25 รายการ)
BAND_EMOJI:12 · BAND_SET_REWARD:13 · BAND_DONE_BONUS:14 · bandLoad:18 · bandShortTH:36 · bandCat:44
bandSets:66 · bandSetId:75 · bandCheckComplete:78 · bandSetCat:92 · BAND_RETAKE_MAX:104 · bandTriedSets:105
bandRetakeCat:116 · bandShowRetakeSummary:150 · bandSetsPassed:178 · openBandSetPicker:186 · bandMine:257 · bandUnlocked:258
bandLockToast:263 · bandExamLobby:269 · updateBandExamBtn:278 · bandLobbyTick:295 · bandPlay:306 · bandPlayLobby:319
bandCardsHTML:331

## js/game.js (1,027 บรรทัด · 70 รายการ)
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

## js/main.js (279 บรรทัด · 5 รายการ)
syncMusicBtn:99 · showQuizBackPay:135 · showGiantRefund:179 · fitQbp:218 · bootGame:232

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

## js/photo.js (330 บรรทัด · 24 รายการ)
PHOTO_LS_KEY:12 · PHOTO_MAX:13 · PHOTO_PREFIX:14 · PHOTO_SIZES:15 · PHOTO_QS:16 · PHOTO_ZMAX:17
photoValid:25 · photoOnline:28 · photoGet:31 · photoHas:32 · photoIsMine:33 · photoOf:36
photoFetch:44 · photoAfterChange:61 · photoPush:65 · photoSaveUrl:77 · photoRemove:83 · photoPullMine:90
photoBlkSrc:106 · photoMiniHTML:113 · openPhotoMenu:121 · photoLoadImgEl:172 · photoLoadFile:180 · openPhotoCrop:193

## js/state.js (1,123 บรรทัด · 90 รายการ)
STORAGE_KEY:6 · QUIZ_PASS_REWARD:11 · CURE_COST:13 · HUNGRY_SICK_MS:14 · MEAL_HOUR:16 · MEAL_FULL:17
SLEEP_FROM_HOUR:18 · SLEEP_SICK_HOUR:19 · WAKE_HOUR:20 · DINNER_COST:21 · TOXIN_FULL:23 · DETOX_COST:24
FOODQUIZ_Q:26 · FOODQUIZ_COIN:27 · FOODQUIZ_BONUS:28 · SHAPE_JUNK_MEALS:30 · SHAPE_CLEAN_MEALS:31 · SHAPE_MISS_MEALS:32
SHAPE_EXP_BONUS:33 · HEAT_SICK_MS:34 · THIRST_SICK_MS:35 · DEFAULT_STATE:37 · FEED_CATS:190 · FEED_REACTIONS:204
feedRx:212 · FEED_QUICK_CM:214 · SLOT_MS:226 · currentSlotStart:227 · nextSlotStart:233 · mealDayKey:235
nightKeyOf:237 · isNightNow:245 · newPet:250 · loadState:274 · saveState:540 · activePet:547
petStage:548 · isAdult:553 · abilityOn:554 · hasPetType:555 · todayStr:558 · dailyTick:562
addCoins:565 · QUEST_POOL:585 · QUEST_PER_DAY:595 · questsToday:596 · questTick:603 · questEvent:607
assetValue:643 · netWorth:669 · assetCount:671 · refreshRank:688 · heatProtected:704 · rainProtected:708
petHungry:711 · petShapeOf:715 · updatePetShape:721 · shapeMealDone:728 · heatPct:738 · ymStr:747
billOutstanding:751 · UTILITIES:758 · HOME_UTILITIES:764 · homeDecayed:766 · billTick:769 · PET_FOOD_PER_PET:841
petFoodTick:842 · myCar:868 · carLoanDue:873 · carLoanOverdue:878 · carLoanPayable:883 · carLoanPay:890
compTick:903 · ONLINE_RATE:917 · onlineEarnActive:918 · onlineEarnTick:922 · onlineEarnFlush:933 · marketTick:943
addCraft:967 · ORDER_MAX:986 · ORDER_LIFE_MS:987 · ORDER_GAP_MIN_MS:988 · ORDER_GAP_SPAN_MS:989 · ORDER_TIER_WEIGHT:990
newOrder:991 · orderTick:1004 · careTick:1012 · expNeed:1094 · addExp:1099 · addRP:1119

## js/tpaward.js (41 บรรทัด · 0 รายการ)

## js/typing.js (369 บรรทัด · 0 รายการ)

## js/ui.js (8,979 บรรทัด · 358 รายการ)
### 🗂️ สารบัญโซน js/ui.js (Read/Edit เฉพาะช่วง)
- 2-77 UI: Dashboard / ร้านค้า / ที่พัก / ร้านสัตว์เลี้ยง / แรงค์ / สถิติ
- 78-305 🎬 เวทีน้องน่ารัก (Cute Pet Show) — รอบ 604 (ผู้ใช้สั่ง 26 ก.ค. 2026)
- 306-600 🆕 New Word (รอบ 116): คำศัพท์ใหม่ 1 คำ/การ login ตามระดับชั้น
- 601-624 นาฬิกาใต้ชื่อผู้เล่น (วัน · วันที่ · เวลา อัปเดตทุกวินาที)
- 625-677 ข้าวเย็นของผู้เล่น (คิว 7725691507 ข้อ 6)
- 678-709 แถบฝนประจำวัน: นับถอยหลังถึง 19:00 ทุกวัน (ฝนตก 1 ชม.)
- 710-754 เอฟเฟกต์ฝนเต็มจอ (รอบยี่สิบ): ฝนตกจริง (19:00-20:00) + ไม่มีบ้านสภาพดี
- 755-775 การ์ด "คนที่กำลังทำการบ้านไปพร้อมๆ กับเรา"
- 776-830 รอบ 149: กล่อง aside ขวาเลื่อนวนอัตโนมัติ (ล่าง→บน) ไม่มี scrollbar
- 831-1221 Daily Quest (item 3): การ์ดภารกิจวันนี้ใน aside ขวา
- 1222-1314 รอบ 153: เมนูลัดแตะแถวเพื่อนออนไลน์ในกล่อง aside
- 1315-1807 การ์ด Leaderboard — สลับแท็บในการ์ดเดียว (ประหยัดพื้นที่):
- 1808-2161 การ์ดข้อมูลผู้เล่น 👤 — คลิกชื่อในการ์ดเพื่อน/กระดาน แล้วโชว์
- 2162-2386 แผงเพื่อน 👥 (ข้อ 0.3): รหัสเพื่อน + ค้นหา + คำขอ + รายชื่อเพื่อน
- 2387-2482 🌍 เพื่อนอยู่โลก 3D ไหน + ปุ่ม "ตามเข้าไป" (รอบ 642)
- 2483-2521 แชทกับเพื่อน (ข้อ 0.4) — กล่องแชทลอยกลางจอ + แผง emoji
- 2522-2923 รอบ 179: หน้ารวมข้อความ (inbox แบบ Messenger — ธีมกระจกฟ้า sci-fi ของเกม)
- 2924-3270 ระบบส่งของขวัญ (ข้อ 0.5) — ห้องของขวัญ + กล่องเลือกส่ง + ฉากเปิด
- 3271-3355 RANK CARD + ฉากเลื่อนแรงค์
- 3356-3358 PET DASHBOARD
- 3359-3427 📰 รอบ 155: overlay ข้อมูลน้อง & การดูแล + ฟีดกิจกรรมเพื่อน
- 3428-3834 📰 รอบ 701 — ฟีดล็อบบี้ "ทีละโพสต์" แบบ Facebook (ผู้ใช้สั่ง 29 ก.ค. 2026)
- 3835-3994 🌍 รอบ 639: หน้า Feed เต็มจอ — ทุกคน (ไม่ใช่แค่ follow) + ไลก์/คอมเมนต์
- 3995-4660 📖 Dictionary ค้นหาคำศัพท์ (รอบ 254 ผู้ใช้สั่ง 16 ก.ค. 2026)
- 4661-4704 การนอน (คิว 7725691507 ข้อ 1)
- 4705-5086 ให้อาหาร (ระบบมื้อเย็น 18:00 + ความอิ่มสะสม — ข้อ 2+3)
- 5087-5168 🛡️ ควิซอาหารปลอดภัย (ต่อยอดข้อ 5.1)
- 5169-5254 🎀 ห้องแต่งตัวสัตว์เลี้ยง (รอบ 635: แยกออกจาก "ร้านค้า" เดิม —
- 5255-5442 ที่พัก (หลบแดด/หลบฝน) + เครื่องปรับอากาศ
- 5443-5560 บิลสาธารณูปโภค (ค่าไฟ/ค่าน้ำ — เครื่องยนต์อยู่ใน state.js: UTILITIES/billTick)
- 5561-5643 การ์ดมือถือ (ข้อ 7): ซื้อ 10,000 ขายคืน 6,000
- 5644-5654 การ์ดคอมพิวเตอร์ (ข้อ 11): ซื้อ 50,000 ขายคืน 30,000
- 5655-5699 item 8: โบนัสออนไลน์ +0.01 เหรียญ/วิ ฟรีทุกคนที่เปิดเกมออนไลน์อยู่
- 5700-5897 💻 รอบ 706 (ผู้ใช้สั่ง 29 ก.ค. 2026): ช่องรายได้คอมพิวเตอร์บนแถบบนล็อบบี้
- 5898-6114 🎫 การ์ดตั๋วโลกผจญภัย (คิว 7725691507 ข้อ 7)
- 6115-6197 🎃 การ์ดตั๋วโลกผีสิงกลางคืน (ต่อยอดข้อ 8 · ผู้ใช้เคาะ 7 ก.ค.)
- 6198-6301 🚁 การ์ดตั๋วโลกเฮลิคอปเตอร์ Bell (รอบ 52)
- 6302-6401 🛸 การ์ดตั๋วโลกโดรน FPV Racing (รอบ 85) — ซื้อได้เมื่อมีตั๋วเฮลิคอปเตอร์
- 6402-6592 🚗 การ์ดตั๋วโลกขับรถกำแพงเพชร (รอบ 113) — ซื้อได้เมื่อมีตั๋วโดรน FPV
- 6593-6685 ⚽ การ์ดตั๋วโลกสนามฟุตบอล (รอบ 196) — ซื้อได้เมื่อมีตั๋วขับรถ
- 6686-6781 🏍️ การ์ดตั๋วโลกมอเตอร์ไซค์บ้านโพธิ์สวัสดิ์ (รอบ 293) — ซื้อได้เมื่อมีตั๋วขับรถ
- 6782-6879 🛸 การ์ดตั๋วโลก "ยานแม่บุกโลก" (Invasion · รอบ 413)
- 6880-6924 🌍 ปุ่มลัดเข้าโลก 3D ในรางเมนูซ้าย (ผู้ใช้สั่ง 9 ก.ค. 2026)
- 6925-7070 🧭 ป้ายบอกทางของรางเมนูซ้าย (รอบ 601 · ผู้ใช้สั่ง 26 ก.ค. 2026)
- 7071-7240 การ์ดสวนผลไม้ (ข้อ 12): ซื้อต้นไม้ปลูกได้ไม่จำกัด แต่ละต้นออกผล
- 7241-7250 โรงงานผลิตสินค้า 🏭 + ตลาดขายต่อ (แนวคิดใหม่ 5 ก.ค. 2026)
- 7251-7273 โรงงานผลิต (แผง 🏭) — แยกออกจากตลาด (ผู้ใช้สั่ง 6 ก.ค. 2026)
- 7274-7424 ตลาดขายสินค้า (แผง 🏪) — แยกออกจากโรงงาน
- 7425-8336 🚗 รอบ 131: หมวดยานพาหนะ — โชว์รูมรถ 10 คัน (แคตตาล็อก 5 ช่อง/แถว)
- 8337-8397 ร้านสัตว์เลี้ยง (ซื้อเพิ่มได้ ไม่ลบตัวเดิม)
- 8398-8434 เลเวลอัพ (รายตัว)
- 8435-8540 สถิติผลการเรียนรู้
- 8541-8578 item 4: การ์ดสรุปส่งครู — ใบเดียวจบ ชื่อ/วัน-เวลา/เหรียญวันนี้/แรงค์/สอบล่าสุด
- 8579-8979 📞 หน้าจอโทรหาเพื่อน — สายเสียง (รอบ 625 · กลุ่ม 3 คน + ปิดวิดีโอ รอบ 631)
### รายการ js/ui.js
startHTML:10 · PET_ANIM:30 · petAnimHTML:35 · petVisualHTML:50 · PET_SHOW:91 · PET_SHOW_STAGE:96
PET_SHOW_H:99 · petShowBgHTML:102 · petClipHint:145 · __clipReady:157 · petShowHTML:165 · lobbyBlk:228
caretakerFigureHTML:234 · footAlign:244 · heroRankBgHTML:278 · NEW_WORD_MS:312 · newWordNext:318 · renderNewWord:329
NW_GAP:367 · alignNewWord:368 · startNewWordTimer:385 · nwCountdownTick:402 · PAT_REMIND_HOUR:418 · patRemindTick:419
applyPatRemindGlow:440 · NEW_WORD_COIN:455 · NW_DAILY_GOAL:456 · NW_DAILY_BONUS:457 · newWordReward:458 · nwDailyTick:481
coinFlyFx:500 · nwDailyBarHTML:533 · showNewWordPopup:544 · renamePet:571 · mealLabel:588 · fmtMins:595
renderClock:604 · dinnerDue:630 · renderDinnerChip:635 · dinnerClick:646 · renderRainBar:681 · rainFxTick:714
RAIN_DROP_IMGS:731 · rainFxDrop:732 · selfPronoun:762 · selfTag:767 · idTag:771 · SIDE_SCROLL_SPEED:781
SIDE_SCROLL_RESUME:782 · initSideScroll:785 · sideScrollTick:813 · QUEST_FLASH_HOLD:837 · QUEST_SLIDE_MS:844 · QUEST_RESUME_MS:845
questGo:848 · SIDE_TALL_MIN:860 · sideIsTall:861 · qBigCardHTML:866 · qDeckGo:886 · qDeckTick:906
renderQuestCard:927 · sideFlashRows:987 · FRIEND_FLASH_GRACE:1005 · ONLINE_FLIP_MS:1013 · ONLINE_FLIP_RESUME:1014 · ONLINE_SWIPE_STEP:1015
ONLINE_ROW_H:1022 · onPerPage:1025 · onChunk:1031 · ONLINE_GAP_MAX:1041 · onPageSpread:1042 · onPageDraw:1051
onPageFlip:1062 · bindOnlinePager:1073 · renderOnlineCard:1108 · bindInviteCards:1229 · bindFriendQuickMenu:1249 · openFriendQuickMenu:1259
LB_TABS:1322 · LB_WS_TOP:1323 · LB_TP_TOP:1324 · bindLbTabs:1326 · updateRankRailBadge:1355 · rankUpCheck:1374
rankUpSound:1402 · renderLeaderboardCard:1413 · bindLbGroupOpen:1440 · lbRankRows:1452 · LB_BCAT_TOP:1493 · lbBadgeSections:1498
lbDemoRows:1523 · lbChar:1545 · lbfAwardBarHtml:1555 · openLeaderboardFull:1567 · BLK_PAD:1664 · seatPodChars:1666
lbCoinHtml:1676 · lbBadgeHtml:1692 · lbBossHtml:1718 · lbWordSearchHtml:1741 · lbTypingHtml:1777 · bindPlayerClicks:1813
showPlayerCard:1823 · petDescImg:2091 · openImgLightbox:2104 · openPetPeek:2124 · updateBillBadges:2168 · setBadge:2178
updateSettingsBadge:2194 · openAttentionSummary:2208 · updateFriendBadge:2250 · renderFriendPanel:2260 · friendDoSearch:2308 · refreshFriendData:2332
FRW_TTL_MS:2397 · FRW_MIN_GAP:2398 · frwWorldOf:2402 · frwPanelOpen:2405 · frwScan:2410 · frwPaint:2432
frwPaintHint:2453 · frwFollow:2467 · CHAT_EMOJI_CATS:2488 · CHAT_THEMES:2510 · CHAT_SECRET_MS:2519 · chatBadgeSync:2527
ibTimeStr:2535 · IB_CALL_RE:2544 · ibCallInfo:2545 · openChatInbox:2550 · chatFitKeyboard:2720 · openChat:2736
giftImg:2927 · giftDateStr:2929 · GREETS:2937 · GREET_EXP:2945 · greetInfo:2946 · openGreetPicker:2950
giftItemPic:2992 · giftItemName:3000 · updateGiftBadge:3006 · renderGiftPanel:3015 · acceptGift:3073 · declineGift:3096
showGreetReveal:3105 · showGiftReveal:3132 · openGiftPicker:3158 · confirmSendGift:3226 · doSendGift:3250 · rankBadgeHTML:3274
renderRankCard:3279 · renderRankTab:3305 · showRankUp:3333 · bindPetPlateButtons:3368 · openPetInfoOverlay:3397 · feedAgo:3420
FEED_DECK_MAX:3440 · FEED_SLIDE_MS:3441 · FEED_RESUME_MS:3442 · feedPostImgIndex:3447 · feedPostImg:3458 · feedPostByKey:3467
feedCanReact:3470 · fpStatsHTML:3475 · fpNameBadgesHTML:3491 · fpostHTML:3498 · renderFeedCard:3532 · feedDeckGo:3570
feedDeckTick:3590 · renderFeedBell:3612 · feedNotifArrived:3620 · openFeedNotif:3627 · closeRxPicker:3661 · openRxPicker:3665
feedFlyWord:3685 · feedPickRx:3696 · openFeedComments:3709 · closeFeedComments:3723 · renderFeedComments:3729 · bindFeedPostEvents:3789
openFeedBoard:3841 · renderFeedBoardLive:3862 · renderFeedBoard:3880 · stageColLeft:3899 · alignPetTabs:3908 · alignFeedPlate:3920
alignProfilePlate:3931 · alignStageLeft:3947 · alignStageCols:3958 · watchStageCols:3972 · alignCureBtn:3982 · dictRecordLookup:4006
DICT_FILE_COUNT:4017 · loadDict:4018 · dictSearch:4033 · dictTapWords:4048 · dictEntryHTML:4052 · openDictOverlay:4063
renderDashboard:4147 · sleepBtnHTML:4666 · sleepHintHTML:4673 · sleepAllPets:4684 · wakeAllPets:4697 · feedPet:4708
openFoodMenu:4722 · feedWith:4793 · AVATAR_UI:4823 · playerAvatarHTML:4827 · SHAPE_UI:4835 · showFeedResult:4844
curePet:4885 · heartsFx:4908 · PAT_HOLD_MS:4931 · PAT_EXP:4932 · bindPetTap:4933 · petBounce:4951
petMood:4957 · shortPatPet:4964 · longPatPet:4972 · patCalendarHTML:4992 · patStreakTick:5020 · cureCelebrateFx:5046
railCureClick:5057 · detoxPet:5069 · openFoodQuiz:5092 · closeDressUpBoard:5174 · openDressUpBoard:5178 · renderShop:5195
homeVisualHTML:5258 · showHomeRuined:5272 · showCutNotice:5293 · renderHomeCard:5311 · payMaint:5395 · trashBillUI:5411
payTrash:5428 · UTILITY_UI:5447 · utilityBillUI:5496 · payUtility:5521 · buyUtilityFix:5547 · renderPhoneCard:5565
buyPhone:5605 · sellPhone:5627 · compLiveTotal:5648 · onlineLiveTotal:5659 · syncCoinHeader:5666 · flashPillGain:5671
renderOnlineEarnPill:5680 · renderCompEarnPill:5705 · openPillInfo:5738 · renderComputerCard:5821 · buyComputer:5856 · sellComputer:5879
soldCount:5905 · soldBadge:5906 · renderTicketCard:5911 · loadScriptOnce:5967 · loadAdv3d:5984 · enterAdventure3D:5992
pickAdvMap:6017 · enterHaunted3D:6052 · advHealClick:6074 · buyTicket:6094 · renderHauntCard:6120 · buyHauntTicket:6176
renderHeliCard:6203 · buyHeliTicket:6261 · enterHeli3D:6284 · renderDroneCard:6306 · buyDroneTicket:6361 · enterDrone3D:6384
renderDriveCard:6407 · buyDriveTicket:6481 · enterDrive3D:6504 · pickDriveMap:6539 · enterMotoMapAsCar:6575 · renderSoccerCard:6597
buySoccerTicket:6645 · enterSoccer3D:6668 · renderMotoCard:6691 · buyMotoTicket:6740 · enterMoto3D:6763 · renderInvasionCard:6786
INVASION_REWARD:6835 · buyInvasionTicket:6837 · enterInvasion3D:6861 · WORLD3D:6886 · gotoRobotShop:6897 · scrollShopCardIntoView:6902
railWorldClick:6905 · railScrollHint:6930 · railScrollTop:6938 · initRailScroll:6943 · renderRailWorlds:6963 · tinvNoticeHTML:7024
openTinvPicker:7032 · fruitCountdown:7076 · renderFarmCard:7088 · renderFarmClock:7163 · buyFruit:7179 · sellFruit:7199
sellAllFruit:7220 · collectImg:7249 · renderFactoryCard:7255 · renderMarketCard:7278 · updateWishBadge:7334 · openWishlistDialog:7345
bindStripArrows:7390 · renderMarketBrowse:7402 · carImg:7431 · renderVehicleShop:7432 · CS_CYCLE_MS:7483 · carInteriorImg:7484
carStatHtml:7486 · renderCarShowroom:7493 · csShowBig:7520 · csInit:7547 · RS_CYCLE_MS:7570 · robotImg:7571
renderRobotShop:7572 · rsShowBig:7594 · rsInit:7615 · buyRobot:7634 · enterMecha3D:7656 · pickMechaRobot:7677
pickDriveCar:7709 · openCarBuyDialog:7752 · buyCarInsurance:7813 · payCarLoanMonthly:7832 · payCarLoanFull:7844 · carDriveBlock:7863
gotoVehicleShop:7868 · gotoMyStock:7873 · showNeedCarDialog:7879 · craftDiscount:7891 · renderFactory:7894 · renderOrdersUI:7963
startProduce:7982 · buyCollectible:8010 · cancelProduce:8038 · deliverOrder:8052 · renderOrderClock:8069 · renderCollectMine:8079
openListDialog:8121 · cancelListing:8174 · buyMarketItem:8197 · showCollectReveal:8224 · buyAC:8262 · openHomeShop:8281
renderPetShop:8340 · showLevelUp:8401 · renderStats:8438 · showTeacherCard:8545 · CALL_REACT_EMOS:8589 · CALL_TALK_MIN:8592
CALL_TALK_HOLD:8593 · CALL_ORDER_GAP:8595 · CALL_TONES:8601 · startCall:8975

## js/util.js (910 บรรทัด · 39 รายการ)
shuffle:6 · fmtNum:15 · escapeHTML:19 · gradeSymbol:32 · gradeMark:47 · nameWithGrade:55
gradeMarkCanvas:61 · gradeOf:77 · seededRand:92 · fmtThaiDT:102 · fmtThaiDate:106 · showScreen:111
TOAST_WARN_RE:121 · restackToasts:124 · toast:146 · floatFx:166 · beep:177 · PET_MOOD:253
petVoiceSynth:260 · sirenSynth:337 · playCashier:361 · cashierSynth:375 · keyTapSynth:408 · playSpark:449
sparkSynth:463 · thunderFx:498 · wordAudioFile:566 · speakCutOff:575 · speakWord:579 · speakLetter:603
pickSpeakVoice:626 · speakWordTTS:637 · askNameDialog:657 · askConfirm:697 · alertBox:715 · applyNoAnim:735
openSettings:740 · openHelp:865 · openTeacherGuide:891

## js/vocabbook.js (207 บรรทัด · 14 รายการ)
VB_MAX:11 · VB_QUIZ_N:12 · VB_QUIZ_MIN:13 · vbGroup:16 · VB_GROUP_UI:21 · vbRecord:24
vbSeen:49 · vbStats:62 · vbList:70 · vbReviewCat:81 · vbStartReview:95 · openVocabBook:106
vbRender:148 · vbCardHTML:194

## js/wordsearch.js (414 บรรทัด · 0 รายการ)

## js/wsaward.js (32 บรรทัด · 0 รายการ)

## css/lobby.css (4,625 บรรทัด · 718 selector)
:root:6 · html:15 · body:16 · *:33,34,35,36 · #app:39 · h1:41
.subtitle:42 · .shop-title:43 · #rotate-overlay:46 · .screen:68 · #screen-select:77,78,79,80(+5) · .egg-need:87
.petshop-topright:89 · .petshop-play-link:90,95 · #screen-game:137,138,139,140(+7) · #screen-quiz:151,152,153,154(+6) · #quiz-choices:163,164 · .word-card:171
.quiz-choice:172,173,174 · .big-btn:177,178,179,180 · #screen-dashboard:185,1079,1087 · .lobby-top:192,834,835,836(+27) · .top-flex:193 · .profile-plate:194,198,755,3392(+12)
#rain-fx:203 · .rain-layer:206,212 · .rain-glass:219 · .glass-drop:220 · .rail-btn:235,847,853,854(+16) · .rail-badge:236
.fr-code-box:241 · .fr-code-label:245 · .fr-code-row:246 · .fr-code:247 · .fr-copy-btn:252,256,261,262 · .fr-search-btn:257
.fr-add-btn:258 · .fr-accept:259 · .fr-decline:260 · #fr-search-input:263 · #fr-search-result:267 · .fr-found:268
.fr-hint:272 · .fr-list-title:273 · .fr-row:274 · .fr-req:278 · .fr-row-name:280,284,4409 · .fr-row-status:288
.fr-req-btns:289 · .online-dot:290 · .fr-chat-btn:291,296,298 · .fr-unread:299 · .fr-call-btn:305,311 · .chat-overlay:320,326,327
.chat-box:328,631,638,645(+12) · .chat-head:340 · .chat-theme-btn:345,349 · .chat-secret-tg:350,351 · .cs-switch:352,353,358,359 · .cs-slider:354,356
.chat-secret-note:360 · .chat-theme-strip:363 · .chat-theme-sw:365,368,369,370(+1) · .chat-head-name:372,375 · .chat-head-ava:374 · .chat-close:376
.chat-msgs:380 · .chat-empty:384 · .chat-typing:386 · .ct-dots:388,389,391,392 · .no-anim:394,407,468,482(+49) · .chat-bubble:395,400,405
.chat-emoji:408 · .chat-emo:412,416 · .chat-input-row:417 · .chat-emoji-btn:421 · #chat-input:425 · .chat-send:429,434,435
.chat-call-btn:441,445 · .call-ring:448 · .cr-card:452 · .cr-kind:458 · .cr-av:459 · .cr-name:469
.cr-id:470 · .cr-btns:471 · .cr-btn:472,478,483 · .cr-no:479 · .cr-ok:480 · .cr-safe:484
.call-ov:487,493,515,532(+6) · .call-stage:499 · .ctile:500,511,512 · .ct-face:504 · .ct-me:510 · .ct-nm:525,529
.ct-sub:530 · .call-add:554 · .ca-head:561 · .ca-list:562 · .ca-row:563,567 · .ca-dot:568,569
.ca-nm:570,571 · .ca-go:572 · .ca-empty:573 · .ca-safe:574 · .ca-close:575 · .call-bar:579
.cb-btn:584,589,590 · .cb-end:591,592 · .call-emos:593 · .call-emo:598,599 · .call-fx:601 · .call-fx-emo:602
.pl-click:694,696,697 · .pl-overlay:698 · .pl-card:702,2555 · .pl-close:708 · .pl-head:712,2436,2439 · .pl-grade:717,4415,4416
.pl-badges:719 · .pl-badge-chip:720,724 · .pl-badge-ic:725 · .pl-body:727 · .pl-loading:728 · .pl-none:729
.pl-me-tag:730 · .pl-blk-wrap:732 · .pl-blk:733 · .pl-stat:734 · .pl-lbl:739 · .pl-val:740,741
.pl-tip:742 · .chip-edit:748,753,754 · .rank-mini:760,766,767,768 · .pass-photo:770,775 · .pet-tabs:777 · .dict-box:778,782,783,784(+1)
.dict-card:790,795,799,800(+2) · .dict-head:796,797 · .dict-trail:804,808 · .dt-c:809,813,814 · .dt-sep:815 · .dict-today:816
.di-w:818,819,820 · .dict-list:821 · .dict-item:822,826,827,828(+5) · .lobby-mid:842 · .rail-wrap:845,870,874,875(+3) · .lobby-rail:846
.rail-nudge:877,885,886,889(+1) · .rail-worlds:896 · .rail-div:897 · .lobby-stage:939,941,957,1084(+13) · .newword-banner:947,954,959,3931(+2) · .coin-fly:970,973
.coin-plus:979 · .nw-pop-coin:994,996,997 · .nw-pop-goal:1000,1001,1005,1009 · .nw-goal-head:1002,1004,1006 · .nw-goal-bar:1007 · .nw-goal-fill:1008
.nw-pop-book:1010,1011 · .nw-tag:1032,3937,3959 · .nw-word:1037,3941,3964,4053 · .nw-hint:1039,1040,3942,3966(+1) · .nw-coin:1042,1045,3943,3947 · .nw-countdown:1050,3948
.nw-bar:1052,3967 · .nw-bar-fill:1054 · .pet-stage:1057,2843 · .nw-box:1064,2852 · .nw-pop-word:1065 · .nw-speak:1066
.nw-pop-phon:1067 · .nw-ipa:1068 · .nw-pop-sent:1069 · .nw-pop-mean:1070 · .pet-tab:1071,1072,1073,3198 · .stage-hero:1094,1109,1117,1262(+22)
.hero-ground:1131,1251,1257 · .hero-rank-bg:1133,1136,1139,1143(+18) · #lobby3d-canvas:1156,1157 · .hero-scene:1161,1163,1170,1171(+8) · .caretaker-fig:1210 · .caretaker-img:1213
.caretaker-emoji:1215 · .blk-rig:1222,1223,1224 · .stage-plate:1284,1292,1303,1304(+23) · .plate-title:1298 · .lobby-side:1331,1367,1372,1375(+22) · .side-sec:1334,2150,3094,3370
.side-label:1335,1340 · .side-label-row:1343,1344 · .lb-tabs-out:1345,1346,1350 · .side-glass:1354,1361 · .side-card:1373,1484 · #quest-card:1385,1386,1414,1415(+6)
.q-bigcard:1391,1420 · .qb-top:1393 · .qb-emoji:1394 · .qb-name:1396 · .qb-bar:1397,1398 · .qb-row:1400
.qb-prog:1401 · .qb-reward:1402 · .qb-go:1403,1407 · .q-dots:1408 · .q-dot:1409,1410,1411 · .q-bonus:1412
.inv-card:1431,1433,1434 · .inv-btns:1435 · .inv-go:1436,1438 · .inv-x:1439 · #online-card:1443,3102,3103,3104(+4) · .fq-overlay:1444
.fq-box:1446,2908 · .fq-head:1450,1452 · .fq-close:1453 · .fq-sec:1455 · .fq-worlds:1456 · .fq-world:1457,1459
.fq-acts:1460 · .fq-act:1461,1464,1465 · .lb-prize:1498 · .lb-coins:1501 · .lbf-cell:1502,2489,2492,2493(+3) · .lb-award-bar:1504,1510,1511
.lb-award-go:1512 · .lbf-award:1514,1520,1521,1522 · .pod-pz:1523 · .wsa-overlay:1526 · .wsa-box:1528 · .wsa-head:1533
.wsa-title:1534 · .wsa-when:1535,1536 · .wsa-close:1537,1540 · .wsa-cols:1541 · .wsa-col:1542 · .wsa-sec-h:1543,1544
.wsa-msg:1545 · .wsa-msg-h:1548 · .wsa-msg-b:1549,1550 · .wsa-msg-none:1551 · .wsa-rules:1553,1554 · .wsa-list:1555
.wsa-row:1556,1558 · .wsa-r:1559 · .wsa-n:1560 · .wsa-s:1561 · .wsa-p:1562 · .wsa-prizes:1563
.wsa-pz:1564,1567 · .wsa-reveal-medal:1568 · .lobby-bottom:1578,1580 · .lobby-quiz-btn:1581 · .lobby-book-btn:1582,1583 · .lobby-foodquiz-btn:1584,1585
.lobby-play-btn:1586,1590 · .lobby-exam-btn:1592,1593,1595 · .panel-overlay:1600,1605,4068,4069(+5) · .panel-box:1606 · .panel-head:1613,1617 · .panel-close:1618,1623
.panel-body:1624,1628,1629 · .panel-page:1626,1627 · .collect-sub:1633 · .mkt-empty:1634 · .craft-box:1635 · .mkt-listing:1636
.mkt-filter:1637,1981 · .hq-grid:1644 · .hq-card:1645,1650,1674 · .hq-head:1651 · .hq-pic:1657,1659 · .hq-emoji:1661
.hq-badge:1662 · .hq-stars:1666 · .hq-price:1667,1672,1673,1676(+6) · .craft-credit:1680,1682,1683 · .car-grid:1690,1692,1693 · .robot-weap:1694
.dmap-box:1697,1698 · .dmap-grid:1704 · .dmap-card:1706,1709,1710,1711(+2) · .dmap-ico:1713 · .dmap-new:1716 · .dcp-grid:1718
.dcp-card:1720,1723,1724,1725(+10) · .levelup-box:1742,2806,2807,2905 · .dcp-box:1745,1746,1750,1751(+6) · .dcp-lock:1759 · .sold-badge:1763,1765,1766 · .rs-showroom:1768,4367,4368
.rs-list:1769,1771,4348,4351 · .rs-thumb:1772,1774,1775,1776(+1) · .rs-thumb-pic:1777,1778 · .rs-thumb-price:1779 · .rs-stage:1781 · .rs-big:1784
.rs-big-img:1785 · .rs-elec:1789,1793,1798 · .rs-edge:1799,1805 · .rs-info:1808,1809,1810,1811(+1) · .rs-buy:1813,1815,1816 · .cs-showroom:1820,4340,4341,4369(+3)
.cs-list:1821,1823,4342,4347(+9) · .cs-thumb:1824,1826,1827,1828(+1) · .cs-thumb-pic:1829,1830 · .cs-thumb-name:1831 · .cs-thumb-price:1832 · .cs-thumb-own:1833
.cs-stage:1835 · .cs-big:1838 · .cs-big-img:1839 · .cs-elec:1843,1847,1851 · .cs-edge:1852,1858 · .cs-interior:1861
.cs-inr-label:1862,1863 · .cs-inr-img:1864 · .cs-info:1866,1867,1868,1869(+6) · .cs-buy:1877,1879,1880,1881 · .car-emoji:1883 · .car-mine:1889
.car-mine-pic:1894 · .car-mine-info:1895 · .car-loan:1896,1897 · .car-mine-btns:1898,1899,1900 · .car-locked:1902 · .car-mine-head:1904
.car-pick-list:1905,1906 · .car-pick:1907,1909,1910 · .car-pick-pic:1911,1912 · .car-pick-name:1913,1914 · .car-pick-od:1915 · .car-buy-box:1917,2912
.cb-pic:1918,1919,1920 · .cb-lines:1921 · .cb-li:1922,1926,1927 · .cb-ins:1928,1932,1933 · .cb-plan:1934 · .cb-pl:1935,1940,1942,1946(+1)
.cb-total:1953 · .cb-btns:1954,1959 · .cb-x:1955 · .shop-grid:1962 · .shop-item:1963,1968,1973,1974(+3) · .mkt-tab:1982,1983
.pg-btn:1984,1985,1986 · .pg-dot:1987 · .fr-gift-btn:2010,2015 · .gift-sec-title:2018 · .gift-in-row:2020 · .gift-out-row:2024
.gift-in-pic:2025,2027,2028 · .gift-in-info:2029,2030 · .gift-in-btns:2031 · .gift-accept:2032,2036,2038 · .gift-decline:2037 · .gift-box-card:2039
.gift-box-from:2040,2041 · .gift-note:2042 · .gift-pick-overlay:2045 · .gift-pick-box:2049 · .gift-pick-head:2055,2059 · .gift-pick-close:2060
.gift-pick-tabs:2062 · .gp-tab:2063,2067 · .gift-pick-body:2068 · .gp-chips:2069 · .gp-chip:2070,2074 · .gp-card:2075,2076
.gp-price:2077 · .gp-note:2078 · .gift-cf-pic:2079 · .chat-emoji-cats:2084 · .chat-emoji-cat:2088,2092,2093 · .chat-emoji-wrap:2094,2095
.stage-left:2104,4059 · .pet-info-btn:2108,2115,2116 · .feed-list:2123,2127,2152,2153(+1) · .feed-empty:2128,2131 · .fd-tools:2137 · .feed-bell:2138,2140,2141,2142
.fd-prog:2146,2147 · .fpost:2154,2688 · .fp-head:2159 · .fp-ico:2160 · .fp-who:2161 · .fp-name:2162
.fp-when:2163 · .fp-badges:2165,2168 · .fp-badge-ic:2166 · .fp-text:2170 · .fp-media:2173 · .fp-img:2175
.fp-cap:2177 · .fp-big:2178 · .fp-sum:2180,2182 · .fp-sum-rx:2183 · .fp-sum-none:2184 · .fp-en:2185
.fp-bar:2187 · .fp-act:2188,2192,2194 · .fp-like:2193 · .fp-page:2205,2206,2207,2208(+3) · .fp-rxbox:2211 · .fp-rxb:2215,2217,2218,2219(+1)
.fp-rxb-off:2221 · .fp-fly:2223,2226,2227 · .fcm-overlay:2230 · .fcm-box:2232 · .fcm-post:2236,2237 · .fcm-rxs:2238
.fcm-rx:2239 · .fcm-list:2240,2242 · .fcm-row:2243,2244,2245 · .fcm-none:2246 · .fcm-quick:2248,2250 · .fcm-q:2251,2254,2255
.fcm-add:2256 · .fcm-input:2257,2259 · .fcm-send:2260,2262 · .fcm-locked:2263 · .fnt-overlay:2265 · .fnt-box:2267
.fnt-list:2271,2273 · .fnt-row:2274,2276 · .fnt-ico:2277 · .fnt-tx:2278,2279 · .fnt-sub:2280 · .feed-plate:2282
.feed-all-btn:2283,2288 · .fdb-overlay:2293 · .fdb-box:2295 · .fdb-head:2299 · .fdb-close:2303,2305 · .fdb-live:2306
.fdb-live-title:2307 · .fdb-live-rows:2309,2311,2312 · .fdb-live-row:2313,2315,2316,2317 · .fdb-dot:2318 · .fdb-list:2320,2321 · .fdb-empty:2322
.fdb-row:2323 · .fdb-row-top:2325 · .fdb-ico:2326 · .fdb-txt:2327 · .fdb-name:2328 · .fdb-ago:2329
.fdb-actions:2330 · .fdb-like:2331,2334,2335,2336 · .fdb-cm-list:2337 · .fdb-cm-row:2338,2340 · .fdb-cm-empty:2341 · .fdb-cm-add:2342
.fdb-cm-input:2343,2345 · .fdb-cm-send:2346,2348 · .fdb-cm-locked:2349 · .pi-overlay:2352 · .pi-box:2356,2361,2362,2366(+3) · .pi-close:2368,2373,2374
.pi-close-left:2376 · .pi-portrait:2378 · .pet-wear:2385,2388,2390 · .pi-portrait-wrap:2393,2395 · .pi-dress-btn:2403,2407,2408 · .pi-shape-cap:2409,2412,2413,2414
.pi-shape-toggle-btn:2416,2419 · .pi-dress-pip:2421,2426,2427,2428(+1) · .pi-wear-note:2431,2433 · .greet-card:2440 · .greet-sub:2441 · .greet-grid:2442
.greet-opt:2443,2446,2447,2448 · .greet-e:2449 · .pi-streak:2453 · .pi-streak-head:2455,2457 · .pi-streak-best:2458 · .pi-dots:2459
.pi-dot:2461,2462,2463 · .pi-streak-note:2464 · .pi-care-title:2465 · .lbf-overlay:2468 · .lbf-box:2471 · .lbf-head:2476
.lbf-title:2477 · .lbf-tabs:2478,2481 · .lbf-close:2484 · .lbf-close-l:2485 · .lbf-body:2486 · .lbf-grid:2487
.lbf-bcat-wrap:2500,2502 · .lbf-bcat:2503 · .lbf-bcat-head:2504,2505,2506 · .lbf-bcat-rows:2507 · .lbf-bcat-row:2508,2510,2511,2512(+1) · .bcr-ic:2516
.badge-ic-fallback:2518 · .lbf-podium:2521 · .pod:2523,2550,2551 · .pod-char:2525 · .pod-base:2527 · .pod-rank:2529
.pod-label:2531,4411 · .pod-name:2533 · .pod-sc:2535 · .pod-1:2540,2541 · .pod-2:2542,2543 · .pod-3:2544,2545
.pod-4:2546,2547 · .pod-5:2548,2549 · .pl-wide:2568,2571,2572,2573(+8) · .pl-follow:2574,2579,2581 · .pl-unfollow:2583,2589,2590 · .pl-followers:2591
.pl-cols:2592,2694 · .pl-col:2593 · .pl-sec-title:2594 · .pl-feed:2595,2598,2605 · .pl-feed-row:2599,2603,2604 · .pl-assets-wrap:2607,4248,4323
.pl-assets:2608,4251,4256,4262(+4) · .pl-asset:2611,2615,2622 · .pl-asset-emoji:2616 · .pl-asset-n:2617 · .pl-pets-wrap:2624 · .pl-pets:2625
.pl-pet:2626,2631,2633 · .pl-pet-nm:2634 · .img-lightbox:2637,2642,2643,2647(+3) · .cert-svg:2666 · .cert-tap:2667,2672 · .cert-chip-sm:2675
.pl-sec-sub:2695 · .pl-certs:2696,2698 · .cert-mini:2699,2703,2705 · .cert-mini-cap:2706 · .cert-none:2708 · .lv-cert-row:2710,2712
.lv-cert-btn:2713,2718 · .cert-lightbox:2720,2725,2726,2730(+3) · .pl-chat:2750,2755 · .pl-call:2757,2763 · .pet-peek:2764,2765 · .pp-chips:2767
.pp-chip:2768 · .pp-gift:2773,2779 · .settings-box:2781,2782,2854,2859(+20) · .set-feed-head:2783 · .set-feed-sub:2787 · .set-feed-row:2788
.pillinfo-val:2793 · .pillinfo-desc:2798,2817 · .pillinfo-box:2809 · .plf-head:2812 · .plf-emoji:2813 · .plf-ht:2814,2815,2816
.plf-foot:2818,2820,2821 · .alert-box:2826,2828 · .ab-emoji:2829 · .ab-title:2830 · .ab-desc:2831 · .ab-btns:2832,2833,2834
.heal-heart:2836 · .attn-box:2851 · .help-box:2883,2884,2885 · .wl-box:2906 · .food-box:2907 · .home-shop-box:2909
.summary-box:2910 · .report-box:2911 · .wl-grid:2914 · .tc-wrap:2916 · .spell-btn:2922,2927 · .sp-hud:2928
.sp-word:2930 · .sp-ch:2931,2936 · .sp-th:2938 · .sp-hint:2940 · .sp-exit:2943,2947 · .sp-banner:2948
.sp-big:2953 · .sp-thb:2955 · .sp-coin:2956 · #spell-confetti:2961 · .sp-rb:2962 · .sp-day:2972
.sp-perfect:2974 · .sp-late:2976 · #spell-coinpop:2979 · .side-sub:3088,3090 · .sec-quest:3095 · .on-page:3106,3107,3108,3109
.inbox-overlay:3119 · .ib-box:3121 · .ib-head:3125 · .ib-close:3129,3131 · .ib-list:3132,3133 · .ib-row:3134,3135,3136,3137
.ib-ava:3138,3143,3144 · .ib-on:3145 · .ib-mid:3147 · .ib-name:3148 · .ib-last:3149 · .ib-meta:3150
.ib-time:3151 · .ib-dot:3153 · .ib-story-badge:3156 · .ib-empty:3160 · .ib-story:3162,3164 · .ib-story-item:3165,3167,3174
.ib-story-ava:3168 · .ib-story-on:3172 · .ib-world:3177,3180 · .ib-tabs:3182 · .ib-tab:3183,3186,3188 · .ib-tab-dot:3189
.ib-call-ava:3193 · .ib-call-row:3194,3195 · #btn-music:3201,3204,3205 · #ws-overlay:3220 · #ws-board:3223,3229,3231 · .ws-head:3234
.ws-title:3235 · .ws-findbar:3238 · .ws-tip:3239 · .ws-grade:3241,3242 · .ws-body:3245 · .ws-gridwrap:3246
#ws-grid:3249 · .ws-cell:3254,3259,3262,3265(+2) · .ws-flash:3271,3273 · .ws-coinpop:3277,3301 · .ws-combo:3288,3292,3293,3294 · .ws-find:3305
#ws-prog:3306 · #ws-words:3310,3314 · .ws-word:3316,3321,3322,3323(+2) · .ws-actions:3329,3330,3339 · .ws-sizes:3334 · .ws-sizes-lb:3336
.ws-size-now:3337 · #ws-new:3340 · #ws-stash:3341 · #ws-clear:3342 · #ws-win:3343,3345 · .ws-win-in:3346,3349
.sec-online:3372 · .rank-tab:3400,3401,3402,3403(+2) · .pet-show-bg:3433,3436,3440,3444(+19) · .ps-night-fx:3536,3538,3550,3555(+1) · .pet-show:3565,3568,3580,3582(+22) · .ps-video:3701
.ps-worn-pip:3779,3780 · .id-card:3803,3810,3814 · .id-chip:3827 · .clock-chip:3836,3837 · .coin-block:3853 · .coin-group:3854
.coin-pill:3884,3885,3887 · .cp-lb:3896 · .cp-v:3897 · .nw-sub:3965 · .top-flex2:4056 · #panel-factory:4075,4076,4080,4081(+39)
.grid2x8:4204,4210 · .mine-strip:4228,4230,4231,4236(+4) · .mb-strip:4242,4281 · .gmark:4389,4393,4394,4395(+1) · .gm-stack:4398,4402 · .gm-row:4404
.lb-name:4406,4407,4408 · .grade-edit:4429,4434,4435 · .gradelock-box:4437,4453,4458,4460 · .gl-head:4438 · .gl-emoji:4439 · .gl-ht:4440
.gl-cur:4441 · .gl-lock:4442,4447 · .gl-ok:4446 · .gl-lock-sub:4448 · .gl-why:4449 · .gl-pick-lb:4450
.gl-opts:4451 · .gl-hist:4461 · .gl-hline:4462 · .gl-hg:4466 · .gl-hat:4467 · .gl-harr:4468
.gl-foot:4469 · .gl-cf:4470 · .reg-gradelock:4490 · #tp-overlay:4500 · #tp-board:4502,4506 · .tp-head:4510
.tp-title:4511 · .tp-stat:4513,4515 · .tp-pts:4517,4520 · .tp-close:4522,4528,4529 · .tp-snd:4532,4535,4541,4542 · .tp-snd-ic:4536
.tp-snd-track:4537 · .tp-snd-thumb:4539 · .tp-prompt:4546 · .tp-word:4548,4562,4563 · .tp-ch:4550,4555,4556,4558 · .tp-thai:4566
.tp-hint:4568 · .tp-empty:4570 · .tp-keys:4573 · .tp-row:4575 · .tp-row-fn:4577,4610 · .tp-key:4581,4593,4595,4601(+2)
.tp-key-fn:4608 · .tp-fx:4614 · .tp-coinpop:4615 · .tp-pop-pt:4620

## css/style.css (1,973 บรรทัด · 498 selector)
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
.cat-card:1058,1079,1158,1163 · .cat-head:1062 · .cat-emoji:1063 · .cat-name:1064 · .cat-pass:1065 · .cat-info:1066
.cat-btns:1067 · .cat-btn:1068,1072,1073,1074(+2) · .band-sec-head:1077,1078 · .band-mine-tag:1080 · .bsp-box:1083,1086 · .bsp-head:1087
.bsp-prog:1088 · .bsp-retake:1090,1093 · .rts-box:1096 · .rts-head:1098 · .rts-sets:1099 · .rts-set:1100,1101,1102
.rts-sub:1103 · .rts-words:1104 · .rts-word:1105,1107,1108 · .rts-foot:1109 · .rts-okbtn:1110,1112 · .bsp-grid:1113
.bsp-chip:1114,1117,1118,1119(+1) · .bsp-num:1121 · .bsp-best:1122 · .bsp-tick:1123 · .bsp-foot:1124 · .vb-box:1127,1129
.vb-head:1130 · .vb-total:1131 · .vb-quizbtn:1132,1134 · .vb-tabs:1135 · .vb-tab:1136,1138,1139 · .vb-words:1140
.vb-word:1141,1144,1145,1146(+3) · .vb-empty:1150 · .vb-foot:1151 · .vb-pg:1152,1154 · #vb-pginfo:1155 · .vb-hint:1156
.band-lock:1164 · .offline-btn:1165,1166 · .quiz-progress:1171 · .quiz-phon:1172 · #quiz-extra:1173,1175,1176,1177 · .quiz-word-card:1178
.quiz-next:1184,1190,1191,1192(+1) · .quiz-choice:1195,1200,1201,1202 · .quiz-score-pill:1203 · .stats-card:1206 · .stats-title:1210,1655 · .stats-row:1211,1212,1213,1214
.stat-badge-line:1216,1219 · .stat-badge-ic:1217 · .game-top:1222 · .back-btn:1223 · .combo-pill:1227 · .timer-wrap:1231
.timer-fill:1232,1233 · .board-label:1235 · .card-grid:1236 · .word-card:1237,1243,1244,1245(+3) · .hint-btn:1251,1256 · .game-endless-note:1259,1264,1266,1270(+6)
.report-btn:1291,1296 · .report-box:1299 · .report-close:1300 · .rp-head:1304 · .rp-avatar:1305,1306 · .rp-title:1307
.rp-sub:1308 · .rp-levelcard:1310 · .rp-level-top:1314 · .rp-bar:1315 · .rp-bar-fill:1316 · .rp-level-note:1317,1318
.rp-grid:1320 · .rp-stat:1321 · .rp-ic:1324 · .rp-num:1325 · .rp-lbl:1326 · .rp-section:1328
.rp-h3:1329 · .rp-badge-mini:1330 · .rp-row:1331,1332,1333 · .rp-empty:1334 · .rp-badges:1335 · .rp-badge:1336
.rp-tline:1339 · .rp-tl-head:1340,1341 · .rp-tl-ems:1342 · .rp-em:1343,1344 · .rp-tl-note:1345,1346 · .rp-crown:1348,1349
.rp-wtitle:1351 · .rp-wnow:1352,1353 · .rp-wgraph:1354 · .rp-wcol:1355 · .rp-wval:1356 · .rp-wbar:1357,1358
.rp-wlbl:1359 · .rp-cheer:1361 · .report-ok:1365 · .summary-box:1368,1423,1427,1428(+2) · .sm-burst:1369 · .sm-title:1371
.sm-line:1372 · .sm-coin:1373 · .sm-matches:1379,1380 · .confetti:1382 · .sm-badge:1389 · .sm-badge-all:1393
.badge-celebrate-overlay:1396,1413 · .badge-celebrate:1402 · .bc-emoji:1408,1410 · .bc-emoji-img:1409 · .bc-title:1411 · .bc-sub:1412
.sm-cheer:1417 · .sm-streak:1418,1419 · .sm-sick:1420 · .sm-btns:1421 · .float-fx:1433 · .toast:1440
.toast-warn:1447,1454,1455,1461 · .toast-clear-all:1463,1470 · .alert-box:1472 · .alert-ok:1473,1478 · .settings-box:1480 · .set-row:1481
.set-hint:1485 · .set-hint-on:1486 · .set-hint-off:1487 · .set-lwrap:1488 · .set-label:1489 · .set-desc:1490
.set-switch:1491,1495,1496,1501(+4) · .set-sw-knob:1497 · .set-sw-txt:1504 · .set-close:1510,1515 · .set-help:1516,1521 · .help-box:1523,1524,1529
.help-item:1525 · .update-banner:1537,1546,1547 · #update-reload:1548 · #update-dismiss:1552 · .levelup-overlay:1558 · .levelup-box:1562,1569,1570,1571(+4)
.bill-box:1577,1581,1582 · .tag-off:1583 · .home-decayed-img:1584 · .home-dark-img:1585 · .thirst-fill:1586 · .thirst-text:1587,1588
.toxin-fill:1591 · .toxin-text:1592,1593 · .detox-btn:1594,1599 · .shape-text:1602,1603,1604,1605(+1) · .avatar-pick:1609 · .avatar-opt:1610,1614,1615,1616
.avatar-chip-img:1620 · .mini-av:1622 · .fp-ava:1623 · .avatar-chip-blk:1625 · .set-avatar-btns:1626 · .avatar-mini:1627,1631
.set-blk-row:1633 · .set-sub2:1634 · .blk-grid:1636 · .blk-mini:1637,1640,1641,1642 · .game-avatar:1645,1646,1647 · .stats-nick:1656
.ticket-owned:1659,1663 · .collect-sub:1668 · .mkt-tabs:1669 · .mkt-tab:1670,1674 · .mkt-filter:1675 · .mkt-row:1679
.mkt-emoji:1683,1684 · .mkt-info:1685,1686 · .mkt-tier-stars:1687 · .mkt-buy:1688,1693,1694 · .mkt-price-lo:1695 · .mkt-price-hi:1696
.mkt-empty:1697 · .collect-grid:1700 · .collect-cell:1701 · .cc-emoji:1702,1703 · .cc-name:1704 · .cc-count:1705
.cc-list-btn:1706,1710 · .mkt-listhead:1711 · .mkt-group-head:1713,1719 · .mkt-two-col:1721,1722,1726,1738(+8) · #phone-card:1727,1743 · #computer-card:1728,1744
#ticket-card:1730 · #haunt-card:1731 · #heli-card:1732 · #drone-card:1733 · #drive-card:1734 · #soccer-card:1735
#moto-card:1736 · #invasion-card:1737 · .mkt-listing:1765 · .ml-cancel:1769 · .mkt-sold:1775,1776,1777 · .list-dialog:1784,1785,1790
.list-hint:1789 · .collect-reveal-frame:1793,1800 · .collect-reveal-img:1799 · .collect-reveal-stars:1801 · .craft-box:1804 · .craft-head:1805
.craft-bar:1806 · .craft-fill:1807 · .craft-text:1808 · .craft-btn-row:1809,1810 · .craft-go-btn:1812,1818,1819,1822 · .craft-cancel:1830,1834
.mkt-catalog:1837,1838,1839 · .mkt-pager:1842 · .pg-btn:1843,1847,1848 · .pg-mid:1849 · .pg-dots:1850 · .pg-dot:1851,1852
.order-head:1853 · .order-row:1854,1859,1861,1863 · .order-deliver:1864,1869 · .order-need:1870 · .avatar-chip-photo:1876 · .pass-photo:1877
.pl-photo:1878 · .pp-cam:1883,1891 · .set-photo-row:1894,1900 · .ph-thumb:1901 · .ph-plus:1902 · .photo-box:1908,1909,1922,1926(+4)
.ph-now:1910 · .ph-now-img:1911,1915 · .ph-now-cap:1916 · .ph-warn:1917 · .ph-btns:1921 · .ph-tip:1931
.ph-stage:1933,1937 · .ph-cv:1938 · .ph-ring:1939,1944 · .ph-zoom:1948 · .ph-foot:1949 · .ph-crop-box:1950
