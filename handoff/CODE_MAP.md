# CODE_MAP.md — แผนที่โค้ด:บรรทัด (เจนอัตโนมัติโดย `tools/gen_code_map.py` — **ห้ามแก้มือ** เดี๋ยวโดนเขียนทับ)

> วิธีใช้: หาชื่อฟังก์ชัน/ค่าคงที่/selector ในไฟล์นี้ (Grep หรือกวาดตา) → `Read` ไฟล์จริง `offset=<บรรทัด>` `limit=40`
> 🗂️ ไฟล์อ้วนมี **สารบัญโซน** (`st-end ชื่อโซน`) — งานทั้งระบบ/โลก 3D: Grep ชื่อโซน → Read/Edit เฉพาะช่วงนั้น **ห้ามอ่านทั้งไฟล์** · เพิ่มระบบใหม่ในไฟล์อ้วนต้องครอบ banner `/* ==== */`+ชื่อโซน (สารบัญเจนเอง)
> css = index `selector:บรรทัดทุกจุดที่ประกาศ` (บั๊ก UI เริ่มหาที่นี่) · เจนใหม่ทุกครั้งที่รัน `python tools/rotate_handoff.py` · อัปเดต: 2026-07-21

## js/adventure3d.js (11,521 บรรทัด · 521 รายการ)
### 🗂️ สารบัญโซน js/adventure3d.js (Read/Edit เฉพาะช่วง)
- 1-213 adventure3d.js — โลก 3D First-person 2 โหมด (คิว 7725691507 ข้อ 8 + ต่อยอด)
- 214-277 ⚽ โหมดสนามฟุตบอล (โหมด soccer · รอบ 196) — เล็ง+ชาร์จพลังเตะบอลใส่ป้ายตัวอักษร
- 278-332 🤖 โหมดหุ่นยนต์นักรบ (โหมด mecha · รอบ 199) — มุมมองในหุ่นสูง 5m เดินยิงเอเลี่ยนตัวอักษร
- 333-473 📻 หอบังคับการบิน (รอบ 64 · รอบ 66 เปลี่ยนเป็นอังกฤษล้วนตามผู้ใช้สั่ง)
- 474-494 คำศัพท์ — ตามระดับชั้น + ไม่ซ้ำคำที่ประกอบแล้ว (8.1/8.6) · แยกคลังต่อโหมด
- 495-831 Texture ตัวอักษร / emoji / ป้ายชื่อผู้เล่น (canvas → sprite)
- 832-998 🧱 ตัวละครบล็อก (โลกขับรถ) — เลือกก่อนออกรถ · เพื่อนใน map เห็นเป็นหุ่นบล็อกขับรถบล็อก
- 999-1305 🚙 รอบ 393: รถเพื่อนในโลกขับรถ = โมเดลจริง img/models/car_01.glb (ผู้ใช้สั่ง)
- 1306-1458 สร้างฉาก static ครั้งเดียวต่อโหมด
- 1459-1776 🚗 เมืองกำแพงเพชรจริง (โหมด drive) — ข้อมูล OpenStreetMap ใน js/data/city_kpp.js
- 1777-1791 🌅 ท้องฟ้าภาพจริง (รอบ 203) — ใส่ภาพ panorama 360° (equirectangular 2:1) เป็นฉากหลังท้องฟ้า
- 1792-2175 🧱 เทกซ์เจอร์ภาพจริง (รอบ 323) — วางไฟล์ `img/tex/<key>.jpg` (หรือ .png) แล้วแปะทับพื้นผิวทันที
- 2176-2275 ตัวอักษรในโลก (8.2)
- 2276-2330 🔠🪙 เก็บตัวอักษร 1 ตัว = ได้ 1 เหรียญ (รอบ 345)
- 2331-2389 ประกอบคำอัตโนมัติเมื่อมีตัวอักษรครบ (8.1/8.4)
- 2390-2484 โหมด adv: monsters ยิงสู้ได้ (สเปกเดิม 8.5)
- 2485-2665 โหมด haunt: ผีโผล่ 3 วิ → ย้ายที่ · สู้ไม่ได้ · โดนจับ = game over
- 2666-2817 เสียงหลอนโหมดผีสิง — สังเคราะห์ Web Audio (ปลอดลิขสิทธิ์ 100%)
- 2818-3135 Multiplayer — ผู้เล่นอื่นใน map เดียวกัน (สไตล์ Roblox)
- 3136-3335 Voice chat ใน map — WebRTC P2P mesh (เสียงวิ่งตรงระหว่างเครื่อง)
- 3336-3422 🏁 พิธีประกาศแชมป์ (ครูกด "จบรอบแข่ง") — /class/<map>/podium
- 3423-3615 HUD
- 3616-5266 DOM overlay + CSS (สร้างครั้งเดียว — self-contained ไม่แตะ style.css)
- 5267-5392 Input — เมาส์+คีย์บอร์ด และจอสัมผัส (มือถือ landscape)
- 5393-5397 🚁 โหมดเฮลิคอปเตอร์ Bell — ฟิสิกส์บินแบบอาร์เคด (สไตล์ Helicopter Flight Pilot)
- 5398-5789 🛸 โดรน FPV (โหมด drone) — บินเร็ว/คล่อง ลอดหน้าต่างเข้าตึกร้าง เก็บตัวอักษรในห้อง
- 5790-5912 🚗 โหมดขับรถเมืองกำแพงเพชร — ฟิสิกส์รถอาร์เคด (bicycle model)
- 5913-6006 🚦 รอบ 133: ไฟจราจรจริงที่ทางแยกใหญ่ + ฝ่าไฟแดงโดนใบสั่ง ม.22
- 6007-6434 🧭 GPS นำทาง (โหมด drive) — เลือกตัวอักษรเป้าหมาย + เส้นทางตามถนนจริง (A*) + เสียงอังกฤษเลี้ยว
- 6435-6493 🎛️ เข็มหน้าปัดวิ่งจริง (สปีด 0-180 + วัดรอบ 0-8×1000) — วาดทับวงเกจของภาพ dash.png
- 6494-6578 🎵 รอบ 181: วิทยุในรถ — จอ head-unit กลางคอนโซล (visualizer + เลือกเพลง 3 โหมด)
- 6579-6706 🪆 รอบ 191: ตุ๊กตาดุ๊กดิ๊กหน้ารถ — รูปตัวละครที่ผู้เล่นเลือก (blkN.png)
- 6707-7010 🚔 รอบ 128: แผงเตรียมออกรถ + กฎหมายจราจร + ใบสั่ง
- 7011-7053 🛩️📦 ภารกิจไปรษณีย์กลางคืน (รอบ 353) — เฉพาะช่วงฟ้ามืด (heliNight>.5)
- 7054-8238 🚶🛗🚁🪂 โหมดเดินเท้าในเมืองเฮลิฯ (รอบ 354 — ผู้ใช้สั่ง)
- 8239-8312 🎛️ หน้าปัดเข็มขยับจริง (รอบ 61) — วาดสดทุกเฟรมจากค่าการบินจริง
- 8313-8541 🌧️☀️ ชั้นบนกระจก: ที่ปัดน้ำฝน + แสงแดดสาด (รอบ 346)
- 8542-8611 📹 กล้องใต้ท้องเครื่อง (belly cam) — รอบ 348
- 8612-8683 🎯 วงเป้าลงจอด (รอบ 349) — ไฮไลต์ดาดฟ้าที่มีตัวอักษร ให้รู้ว่าควรร่อนลงตรงไหน
- 8684-9298 📏 แถบเตือนความเร็วดิ่ง (รอบ 349) — ลงเร็วเกินกรอบกล้องกะพริบแดง สอนให้ร่อนลงนุ่มๆ
- 9299-9301 Loop หลัก
- 9302-10528 ⚽ โหมดสนามฟุตบอล — ฟิสิกส์บอล + เล็ง + ชาร์จพลัง + กล้อง 1st/3rd + ชุดนักเตะ
- 10529-10976 🤖 โหมดหุ่นยนต์นักรบ — เดินยิงเอเลี่ยนตัวอักษร (ต้องยิงเรียงลำดับในคำ)
- 10977-10989 เข้า/ออกโลก
- 10990-11521 ❓ การ์ด "วิธีเล่น" ตอนเข้าโลกครั้งแรก (จำแยกต่อโลกใน localStorage — ไม่แตะ state.js)
### รายการ js/adventure3d.js
GUIDE_WORDS:20 · RELOCATE_MS:21 · HALF:22 · PLAYER_SPEED:23 · HAUNT_LIVES:24 · HAUNT_IFRAME:25
PICK_DIST:26 · EYE_H:27 · NET_SEND_MS:28 · MODES:31 · SHOOT_GAP_MS:93 · MONSTER_REWARD:94
AD_COUNT:95 · AD_RENT_COIN:96 · AD_RENT_MS:97 · SHOP_ADS:101 · PILOT_TIERS:103 · pilotEmoji:104
DRONE_R:116 · DRONE_ACCEL:117 · DRONE_VMAX:118 · DRONE_CLIMB:119 · DRONE_YAWSP:120 · DRONE_GRAV:121
CAR_EYE:125 · CAR_ACCEL:126 · CAR_BRAKE:127 · CAR_VMAX:128 · CAR_LEGAL_KMH:129 · CAR_FINE_SPEED:130
CAR_FINE_BELT:131 · CAR_REPAIR_FEE:132 · CAR_FINE_SIGNAL:133 · CAR_RAM_FEE:134 · CAR_FINE_RED:135 · CAR_VMAX_OFF:136
CAR_VREV:137 · CAR_WB:138 · CAR_STEER_MAX:139 · HELI_SKID:172 · HELI_CRASH_FINE:173 · HELI_MESH_SCALE:174
ASSIST_R:177 · PROP_STALL_MS:182 · PROP_BREAK_SPD:185 · PROP_BROKEN_MUL:186 · BAT_DRAIN:189 · BAT_LETTER:190
BAT_LOW:191 · BAT_EMPTY_MUL:192 · CHG_R:195 · GATE_R:198 · showHeliSkip:205 · BOLT_MIN:206
GLASS_HIT_R:207 · DOOR_R:208 · SOCCER_SHIRTS:218 · BALL_R:223 · GOAL_HW:224 · KICK_SPD_MIN:225
AIM_YAW_SP:226 · SOCCER_TILES:227 · AIM_STICK:235 · CURL_SWIPE:238 · CURL_SPIN:239 · HIT_LIFT:243
GUIDE_N:244 · FK_SPOT_Z:250 · FK_MAN_R:251 · AURA_COST:256 · SB_DRAG:263 · SPOST_R:264
GK_Z:269 · GK_SPRITES:270 · PK_TIME:272 · MECHA_EYE:282 · ALIEN_COUNT:283 · MECHA_MAX_HP:284
MECHA_ATK_RANGE:285 · ALIEN_SHOT_SPD:286 · POWERUP_GAP:287 · BOSS_SCALE:288 · COMBO_X2:289 · BOSS_SPECIES:292
pickBossSpecies:300 · WAVE_BASE_GOAL:302 · waveCfg:303 · MECHA_WEAPONS:312 · ATC_REPLIES:341 · ATC_CLOSERS:346
ATC:351 · CHAT_MAX:470 · doneList:477 · wordPool:478 · pickWords:491 · TILE_COLORS:498
letterTexture:499 · emojiTexture:513 · GHOST_IMG_MAX:525 · measureGhostBox:532 · probeGhostImages:545 · whenGhostsReady:557
ghostTexture:561 · ghostScareSrc:566 · AD_STYLES:574 · adRenterActive:583 · adBoardTexture:584 · addAdBillboard:631
ringAds:642 · adsFetch:653 · adsWatch:665 · adsStop:672 · adsChanged:673 · adRentBuy:684
heliMusicTick:707 · AD_FLYBY_COIN:711 · adFlybyTick:713 · adShopOpen:732 · adShopRender:746 · BUILDING_TINTS:771
FACADE_ROWS:773 · buildingFacadeTexture:774 · makePeerSprite:798 · BLOCK_AVATARS:838 · blkGeo:849 · blkMat:850
blkCyl:851 · blkFaceMat:853 · makeBlockFigure:868 · makeBlockCar:908 · blkNameSprite:953 · makeBlockPeer:966
makeBlockWalkPeer:987 · disposeBlockPeer:995 · CAR_GLB_URL:1006 · CAR_GLB_LEN:1007 · carSplitWheel:1011 · carGlbEnsure:1038
carMatGet:1057 · carGlbBuild:1073 · carAvCode:1122 · driveCamToggle:1129 · SKID_N:1148 · skidGeomGet:1150
skidDrop:1155 · skidTick:1169 · blkBuildThumbs:1179 · blkBuildPicker:1197 · pickBlockAvatar:1242 · bubbleSprite:1265
showPeerBubble:1292 · removePeerBubble:1300 · concreteTexture:1310 · brokenWindowTexture:1327 · intactGlassTexture:1343 · chargeIconTexture:1361
rustyDoorTexture:1370 · dAddBox:1384 · buildAbandoned:1391 · makeNameSprite:1464 · flatGeom:1477 · flatGeomUV:1486
buildDriveCity:1496 · SKY_IMG:1782 · applySky:1783 · applyTex:1798 · buildScene:1821 · randPos:2179
randRoadPos:2187 · spawnLetter:2199 · spawnLettersForWord:2230 · ensureCoverage:2232 · relocateLetters:2245 · removeLetter:2270
LETTER_COIN:2281 · pickUpLetter:2282 · letterPop:2296 · letterChime:2314 · tryCompleteWords:2334 · completeWord:2348
spawnMonster:2393 · killMonster:2402 · tickMonsters:2410 · damagePlayer:2432 · shoot:2448 · tickShots:2462
spawnGhost:2488 · GHOST_STYLE:2497 · GHOST_H_DEFAULT:2498 · applyGhostSize:2499 · respawnGhost:2508 · tickGhosts:2524
sessionRecapHtml:2570 · hauntRunSec:2577 · fmtSurv:2578 · hauntSurviveFinish:2579 · tickSurvive:2589 · renderHearts:2602
ghostHit:2611 · caught:2633 · knockedOut:2659 · netReady:2823 · netJoin:2827 · sendPos:2840
sendChat:2886 · toggleChatBox:2900 · onPeerData:2910 · disposeHeliMesh:2996 · removePeer:3001 · netLeave:3016
tickPeers:3024 · RTC_CFG:3144 · tinvLinked:3145 · partyWord:3152 · syncPartyWord:3165 · updateVoiceBtns:3317
PODIUM_BONUS:3342 · podiumJoin:3344 · podiumLeave:3355 · endRound:3356 · showPodium:3367 · tinvCheck:3407
showBanner:3427 · renderHudTop:3433 · renderHudWords:3438 · renderHudInv:3448 · ddTierFromName:3455 · renderBoard:3457
drawBigMap:3481 · openBigMap:3536 · closeBigMap:3544 · drawMinimap:3549 · loadCarDash:3621 · loadCarWheel:3633
buildDom:3643 · confirmExit:5251 · IS_TOUCH:5270 · bindInput:5271 · movePlayer:5358 · tickPlayer:5368
collideDrone:5401 · propStall:5420 · propBreak:5427 · propFix:5434 · droneBatAdd:5441 · lightningBolt:5444
startRain:5455 · stopRain:5469 · smashGlass:5471 · awardGlass:5482 · neededLetter:5499 · openDoor:5514
raceStartRun:5534 · raceStop:5541 · gateHighlight:5559 · renderRaceHud:5566 · tickDrone:5575 · nearMissTick:5717
showNearMiss:5741 · awardDaredevil:5752 · comboCheer:5769 · comboFlash:5785 · driveCell:5794 · nearestStreet:5800
collideCar:5810 · tlDotY:5841 · tlSet:5845 · driveArms:5862 · tlTick:5874 · TL_GREEN:5918
tlRedDur:5920 · tlightPhase:5921 · buildTrafficLights:5928 · rlTick:5980 · cellDrivable:6012 · cellCenter:6013
losClear:6015 · nearestDrivableCell:6025 · routeGrid:6034 · pickGpsTarget:6087 · gpsSpeak:6099 · NAVLINE_W:6118
navLineEnsure:6119 · navLineHide:6129 · navLineUpdate:6130 · tickGps:6157 · tickDrive:6233 · drawCarDial:6441
drawCarGauges:6471 · RADIO_RECT:6499 · CAR_RADIO_RECT:6501 · carRadioRect:6507 · radioLayout:6509 · radioSetHint:6532
renderRadioList:6538 · radioToggleList:6548 · drawRadioViz:6553 · radioTick:6571 · BOBBLE_FOOT:6584 · BOBBLE_H:6585
BOBBLE_ASPECT:6586 · BOB_OMEGA:6589 · BOB_PITCH_FORCE:6591 · BOBBLE_SKINS:6593 · bobbleSetAvatar:6600 · bobbleLayout:6607
bobbleTick:6620 · bobblePoke:6645 · bobbleApplySkin:6662 · dollOwned:6672 · openDollPicker:6673 · carStartShow:6710
showLawInfo:6728 · lawNotice:6750 · driveFineSettle:6760 · HELI_PHASES:6939 · heliStartPhase:6946 · heliFloorAt:6953
SOFT_TIERS:6963 · softLandBonus:6965 · awardPerfLand:6978 · setHeliLight:6997 · MAIL_COIN:7016 · mailStart:7018
mailStop:7041 · mailTick:7042 · FOOT_EYE:7061 · doorSlideSfx:7067 · doorLerp:7090 · entLerp:7098
footStepSfx:7108 · WRING_COIN:7129 · festivalPaint:7133 · dustTexture:7145 · dustBurst:7154 · dustTick:7168
HELI_GLB_URL:7189 · HELI_GLB_TEX_BLUE:7191 · HELI_GLB_ROTOR:7193 · HELI_GLB_TROTOR:7194 · heliGlbEnsure:7196 · heliMatBlueGet:7214
heliGlbAssemble:7227 · heliNavTick:7266 · peerRotorStop:7273 · peerRotorTick:7279 · heliCrashSfx:7298 · heliMeshBuild:7326
heliMeshBuildLegacy:7337 · buildHeliFoot:7467 · footFloorAt:7583 · insideTerm:7590 · inDoorZone:7591 · footHint:7595
setFootBtns:7596 · liftStart:7601 · beginRide:7612 · endRide:7635 · beginWing:7646 · awardAirLetter:7659
paxChoiceShow:7678 · paxChoiceHide:7704 · pilotShipMesh:7708 · beginPilot:7709 · endPilot:7741 · drawCabinWindow:7763
tickHeliFoot:7787 · tickHeli:7996 · CP_NAT:8247 · CP_GAUGES:8248 · SEAT_LABEL:8261 · SEAT_P_FULL:8262
SEAT_ZOOM:8263 · DASH_OFF_Y:8264 · DASH_DROP:8265 · setSeat:8267 · layoutCockpit:8279 · WIPER:8318
WIPER_SPD:8319 · sunUpdate:8325 · HELI_FOG_N0:8336 · fogUpdate:8340 · adGlowPulse:8386 · RAIN_MAX:8395
VISOR_Y:8396 · RAIN_MIN:8397 · RAIN_DUR:8398 · DROP_ZONE:8402 · addDrop:8403 · tickDrops:8411
WIPE_R:8427 · wipeDrops:8428 · setWiper:8444 · setVisor:8450 · rainTick:8456 · drawBlade:8468
drawGlass:8482 · drawBellyCam:8549 · drawBellyHud:8572 · drawLandingTargets:8618 · VS_HARD:8688 · drawDescentBar:8689
heliShake:8738 · cpNeedle:8749 · drawGauges:8766 · XF_START:8813 · PRELOAD_WAIT:8814 · ALT_QUIET_FROM:8816
ALT_MAX_DAMP:8817 · ALT_LP_MIN:8818 · ECHO_NEAR:8819 · WIND_FULL_SPD:8820 · SHUTDOWN_SEC:8821 · PAN_MAX:8823
OD_RPM:8824 · SHAKE_RPM:8825 · SHAKE_HIT:8826 · soccerLetterPos:9306 · letterNeeded:9314 · soccerNeededSet:9319
soccerTileGeo:9325 · soccerGoldTexture:9327 · makeSoccerTile:9344 · soccerRefreshSkins:9353 · soccerBuildTargets:9360 · soccerNextTile:9370
soccerRetarget:9383 · soccerCoinPop:9395 · soccerGrassTexture:9408 · soccerTurfGrade:9430 · soccerTurfTexture:9453 · grassNormalTexture:9472
soccerLinesTexture:9501 · soccerNetTexture:9552 · soccerCrowdTexture:9560 · soccerBallMat:9579 · buildSoccerGoal:9599 · buildStands:9618
soccerLedBoards:9653 · soccerGKEnsure:9750 · soccerGKTick:9766 · fkBuildWall:9795 · fkToggle:9810 · fkHitTest:9826
pkHud:9845 · pkStart:9854 · pkEnd:9868 · pkTick:9883 · repQualify:9890 · repEnsureEl:9893
repStart:9904 · repTick:9911 · soccerNumTex:9936 · makeSoccerPlayer:9946 · soccerNewSpot:9972 · soccerResetBall:9984
soccerKick:9991 · soccerCheer:10008 · guideTexture:10011 · auraActive:10035 · auraLeftMs:10036 · buildAura:10038
auraBuy:10059 · auraRender:10069 · auraTick:10083 · buildDrill:10103 · drillTick:10116 · buildLandRing:10153
buildGuideRibbon:10163 · renderSpinPad:10188 · spinPadToggle:10200 · spinPadPick:10206 · renderCurl:10218 · kickLaunch:10229
updateSoccerGuide:10237 · soccerCamera:10301 · tickSoccer:10322 · soccerKitShow:10502 · soccerKitGo:10517 · emojiSprite:10570
makeAlien:10575 · startWave:10608 · waveSpawnFill:10619 · waveComplete:10628 · updateWaveHud:10638 · checkMechaBossBadge:10640
alienSpawnPos:10649 · removeAlien:10654 · mechaHudWord:10659 · setMechaHudSkin:10667 · mechaComboPop:10679 · mechaShielded:10684
mechaDamageFx:10686 · mechaHitByAlien:10691 · spawnAlienShot:10697 · removeAlienShot:10707 · tickAlienShots:10712 · spawnPowerup:10724
removePowerup:10737 · collectPowerup:10742 · tickPowerups:10749 · updateMechaHud:10758 · mechaTracer:10798 · mechaFire:10807
explodeAlien:10844 · tickMecha:10874 · loop:10930 · grabShot:10957 · savePhoto:10968 · clearEntities:10980
INTRO_KEY:10994 · introSeenObj:10995 · introSeen:10996 · markIntroSeen:10997 · INTRO:10998 · showIntro:11064
closeIntro:11089 · beginPlay:11095 · start:11097 · exitWorld:11287 · mechaRecapLine:11344

## js/auth.js (389 บรรทัด · 32 รายการ)
AUTH_PUSH_MS:23 · AUTH_SDK_TIMEOUT_MS:24 · TEACHER_EMAILS:28 · isTeacher:29 · TESTER_EMAILS:42 · TESTER_COINS:43
isTester:44 · testerBoost:48 · authSetStatus:74 · authShowLogin:86 · authGateOffline:90 · authSaveRef:97
authFetchCloud:98 · authWriteCloud:99 · authDeleteCloud:100 · authWriteProfileName:101 · authPushProfile:108 · authApplyProfileName:116
authAskProfileName:132 · authEditProfileName:143 · authStart:154 · updateOfflinePill:184 · authEnterOffline:189 · authLateSync:206
authLoginClick:222 · authOnLogin:241 · authSyncOnLogin:254 · authFreshStart:283 · authAskLink:292 · authEnterGame:342
authPushSave:357 · authLogout:368

## js/dictband.js (362 บรรทัด · 25 รายการ)
BAND_EMOJI:12 · BAND_SET_REWARD:13 · BAND_DONE_BONUS:14 · bandLoad:18 · bandShortTH:36 · bandCat:44
bandSets:66 · bandSetId:75 · bandCheckComplete:78 · bandSetCat:92 · BAND_RETAKE_MAX:104 · bandTriedSets:105
bandRetakeCat:116 · bandShowRetakeSummary:150 · bandSetsPassed:178 · openBandSetPicker:186 · bandMine:257 · bandUnlocked:258
bandLockToast:263 · bandExamLobby:269 · updateBandExamBtn:278 · bandLobbyTick:295 · bandPlay:306 · bandPlayLobby:319
bandCardsHTML:331

## js/game.js (948 บรรทัด · 63 รายการ)
REPLAY_BONUS_EVERY:23 · REPLAY_BONUS_TIERS:25 · replayBonusFor:26 · SESSION_MILESTONES:32 · addSessionCoins:35 · updateBestTarget:74
weekKeyStr:87 · rolloverWeekBest:93 · exitGame:99 · showSessionSummary:132 · sprinkleConfetti:179 · VOCAB_PER_LEVEL:198
VOCAB_RANK_NAMES:199 · vocabRankName:200 · showProgressReport:202 · THUNDER_MS:379 · THUNDER_TIERS:383 · THUNDER_TIER_UI:384
thunderEmoji:385 · DAREDEVIL_TIERS:389 · DAREDEVIL_TIER_UI:390 · daredevilEmoji:391 · GLASS_TIERS:395 · GLASS_TIER_UI:396
glassEmoji:397 · DILIGENT_TIERS:401 · DILIGENT_TIER_UI:402 · diligentEmoji:403 · SOFTLAND_TIERS:407 · SOFTLAND_TIER_UI:408
softLandEmoji:409 · AIRL_TIERS:413 · AIRL_TIER_UI:414 · airLetterEmoji:415 · MECHABOSS_TIERS:419 · MECHABOSS_TIER_UI:420
mechaBossEmoji:421 · BFF_TIERS:426 · BFF_TIER_UI:427 · BFF_COIN:428 · bffEmoji:429 · badgeSuffix:434
BADGE_META:449 · NAME_BADGE_RE:463 · splitNameBadges:464 · badgeEmojis:470 · badgeScore:475 · checkCrown:481
currentBadgeScore:497 · rolloverBadgeWeek:501 · addDiligent:514 · celebrateBadge:530 · addThunder:544 · startGame:558
newRound:598 · updateTimerBar:637 · updateComboPill:643 · pickCard:647 · checkMatch:659 · renderCats:773
startQuiz:808 · renderQuizQuestion:824 · finishQuiz:883

## js/images.js (101 บรรทัด · 14 รายการ)
IMG_FILES:11 · MOODS:12 · startImgKey:14 · petImageKeys:16 · probeImages:27 · probeRankImages:39
probeCollectImages:40 · probeGiftImages:41 · probeHomeImages:42 · equippedItem:48 · petStateImg:58 · happyNow:72
makeHappy:73 · currentPetImg:84

## js/invasion3d.js (4,389 บรรทัด · 242 รายการ)
### 🗂️ สารบัญโซน js/invasion3d.js (Read/Edit เฉพาะช่วง)
- 14-64 ⚙️ ค่ากติกา (จูนฟีลทั้งหมดที่นี่)
- 65-90 🎯 รอบ 419: ปืนกระบอกที่ 2 — R93 สไนเปอร์ (ตามสเปก Delta Force ที่ผู้ใช้ส่งมา)
- 91-139 🎬 รอบ 422: แอนิเมชันยกปืนเล็ง (ADS) ของ R93 — ตามสเปกที่ผู้ใช้ให้มา
- 140-631 🎨 CSS + DOM overlay (self-contained ไม่แตะ css/style.css)
- 632-736 🔊 เสียงสังเคราะห์ Web Audio (ปลอดลิขสิทธิ์ 100%)
- 737-811 🖼️ เทกซ์เจอร์วาดเอง (canvas) + ตัวช่วยโหลดภาพจริงถ้ามีไฟล์
- 812-848 🌍 สถานะฉาก
- 849-908 📦 โหลดโมเดล .glb ถ้ามีไฟล์ (ผู้ใช้เอาของจริงมาใส่แล้ว)
- 909-1028 🏜️ สร้างฉากทะเลทราย + เมือง
- 1029-1199 🏚️ รอบ 416: ถนนสมรภูมิหน้าจุดเกิด (ผู้ใช้ส่งภาพอ้างอิง Delta Force)
- 1200-1337 🏠 รอบ 431: บ้านหลบซุ่มยิง (โมเดล house_01 ของผู้ใช้) + จุดสูงข่มบนเนินเขา
- 1338-1438 🛸 ยานแม่ลำมหึมา — ทรงลิ่มเหลี่ยมมืด + หนาม + ช่องตัวอักษร (สไตล์ ID4)
- 1439-1481 👾 ยานลูก — 1 ลำต่อ 1 ตัวอักษร (บินเพ่นพ่าน + ปล่อยลำแสงใส่ผู้เล่น)
- 1482-1485 👥 พันธมิตร — หน่วยรบภาคพื้นอาวุธครบมือ + ฝูงเฮลิคอปเตอร์ติดมิสไซล์
- 1486-1590 🪖 รอบ 423: ระบบตัวละครทหารแบบมี "ข้อต่อ" (rig) — รองรับโมเดล .glb ของผู้ใช้
- 1591-1894 🤖 รอบ 424: จับชิ้นส่วนเข้าข้อต่อ "อัตโนมัติจากตำแหน่ง" (ผู้ใช้ไม่ต้องตั้งชื่อ)
- 1895-2007 🚁🅿️ รอบ 434: เฮลิคอปเตอร์จอดในสนามรบ 5 ลำ (โมเดลจริง helicopter.glb — ผู้ใช้สั่ง)
- 2008-2124 🔫 อาวุธในมือผู้เล่น (view model ติดกล้อง — เห็นปืนที่ถืออยู่แบบ Delta Force)
- 2125-2268 🔧 รอบ 427: ยืดลำกล้องปืนหลัง export (ผู้ใช้: โมเดล R93 ลำกล้องสั้นไป)
- 2269-2580 🤚 รอบ 443: มือซ้ายประคองลำกล้อง — "ทำยังไงให้เนียนแบบ Delta Force"
- 2581-2646 💥 เอฟเฟกต์: ระเบิด · ประกายโดน · ลำแสง · เศษซาก
- 2647-2787 🎯 ระบบยิงของผู้เล่น
- 2788-2856 ⚔️ ดาเมจ / เงื่อนไขชนะ
- 2857-2958 📖 คำศัพท์ + รอบเล่น
- 2959-3010 🖥️ HUD
- 3011-3139 🕹️ Input — มือถือ (จอย+ปุ่ม) และคอม (WASD + pointer lock)
- 3140-3232 🚶 ผู้เล่น + AI + ลูป
- 3233-3237 🚁 โหมดขับเฮลิคอปเตอร์เอง (รอบ 414 — ผู้ใช้สั่ง)
- 3238-3396 🗺️ รอบ 417: แผนที่เลือกจุดลงสนาม (ผู้ใช้สั่ง) — เข้าเกมแล้วเลือกได้ว่าจะไปเกิดตรงไหน
- 3397-3654 🎖️ รอบ 418: นั่งเฮลิลำเดียวกับเพื่อน — "นักบิน + พลปืนประจำประตู" (ผู้ใช้สั่ง)
- 3655-4112 🌐 ผู้เล่นออนไลน์ใน map เดียวกัน (รอบ 414) — Firebase /world/invasion
- 4113-4150 🔁 ลูปหลัก
- 4151-4389 ▶️ เข้า/ออกโลก
### รายการ js/invasion3d.js
REWARD:17 · WORLD:18 · EYE:19 · FOV:20 · LOOK_SENS:21 · PITCH_MIN:22
MS_Y:44 · MS_HP:49 · MS_DMG_GUN:50 · BOARD_Y:53 · CORE_Y:55 · F_HP:58
FIGHTER_SIZE:59 · F_SHOT_GAP:60 · MS_BEAM_GAP:61 · GUN_GAP:64 · WEAPONS:71 · SNIPER_SENS:78
SCOPE_R:82 · SCOPE_MAGS:85 · ADS_IN:97 · ADS_POS:98 · ADS_ROT:99 · ADS_SCALE:100
ADS_BREATH:101 · REC_RECOVER:104 · REC_RIFLE:105 · REC_R93:106 · BOLT_MS:107 · BREATH_MAX:108
MIS_MAX:111 · PLAYER_HP:112 · SQUAD_N:115 · SQUAD_GAP:116 · HELI_MAX:122 · HELI_ACCEL:123
HELI_SKID:124 · PH_GUN_GAP:125 · PH_MIS_MAX:126 · NET_SEND_MS:129 · CHAT_MS:130 · CHAT_PRESETS:131
PEER_COLORS:132 · TAU:134 · CSS:143 · buildDom:503 · resumeAudio:735 · tryTex:742
letterPanelTex:750 · letterSpriteTex:766 · sandTex:776 · wallTex:797 · loadGlb:858 · tameGlbMaterials:888
fitInto:900 · HILLS:915 · buildTerrain:924 · baseLow:958 · buildTown:964 · STREET_Z0:1034
instancer:1038 · buildWarStreet:1052 · sandbagWalls:1157 · squadCoverSpots:1165 · buildDustMotes:1175 · tickDust:1186
HOUSE_SIZE:1209 · HOUSE_LOD:1210 · HOUSE_COVER:1211 · HOUSE_CELL:1212 · HOUSE_SPOTS:1213 · buildHouses:1219
buildBlockGrid:1245 · gridBlocked:1281 · houseBlocked:1288 · houseCover:1297 · tickHouseLod:1305 · findSniperSpots:1314
buildMothership:1342 · layoutLetterPanels:1414 · setLetterLit:1432 · makeFighter:1442 · SOLDIER_PARTS:1493 · joint:1507
buildSoldierRig:1511 · loadSoldierGlb:1554 · applySoldierGlb:1555 · BODY_MAP:1599 · mergeMeshList:1611 · faceModelForward:1652
autoRigSoldier:1702 · fitSoldierGround:1792 · poseSoldier:1802 · makeSoldier:1844 · makeHeli:1860 · HELI_ROTOR_NODES:1903
HELI_TROTOR_NODES:1904 · HELI_LEN:1905 · HELI_DESERT:1906 · BOARD_DIST:1907 · START_MS:1908 · START_PHASES:1909
HELI_PADS:1916 · SEAT_VIEWS:1924 · heliModel:1931 · buildHeliPads:1964 · padAt:1973 · movePad:1979
startPhaseText:1984 · setSeatView:1991 · tickPads:1997 · GUN_POS:2029 · GUN_ROT:2030 · GUN_SCALE:2031
buildArms:2035 · buildRifleModel:2058 · buildR93Model:2079 · GUN_CUT:2134 · GUN_STRETCH:2135 · orientGunModel:2140
stretchGunBarrel:2166 · mergeGunParts:2224 · forceGunForward:2249 · HAND_GLOVE:2283 · buildSupportHand:2284 · attachSupportHand:2341
buildGun:2347 · swapWeapon:2417 · setScoped:2432 · smoothstep:2446 · tickAds:2448 · applyRecoil:2491
applyBreath:2497 · scopeRadius:2505 · scopeRadiusNow:2507 · layoutScope:2509 · scopeFovDeg:2528 · renderScopePass:2536
cycleScopeMag:2554 · renderAmmo:2562 · syncWeaponBtns:2573 · boom:2584 · sparkAt:2610 · tracer:2617
tickFx:2628 · aimDir:2650 · fireGun:2657 · addRecoil:2704 · startReload:2711 · tickReload:2719
launchMissile:2724 · fireMissile:2739 · lockTarget:2755 · rayTarget:2765 · raySphere:2780 · damageFighter:2792
dropFighter:2798 · openMothership:2823 · damageMother:2832 · killMother:2837 · flashScreen:2851 · myUid:2861
leaderUid:2862 · isLeader:2867 · pickWord:2868 · setWord:2881 · adoptWord:2890 · applyShared:2899
startWave:2920 · completeWord:2934 · renderWord:2962 · renderTarget:2971 · renderCoins:2982 · renderHp:2983
renderHeat:2989 · renderMissiles:2995 · toastBan:3004 · bindInput:3014 · moveJoy:3130 · unlockMouse:3138
tickPlayer:3143 · hurtPlayer:3214 · MAP_VIEW:3243 · mapToWorld:3244 · worldToMap:3245 · zoneName:3246
buildMapShade:3260 · drawSpawnMap:3279 · safeSpawn:3354 · fitSpawnMap:3364 · openSpawnMap:3375 · applySpawnPick:3384
RIDE_DIST:3407 · RIDE_UP:3408 · RIDE_OFF:3409 · rideableHelis:3410 · findRide:3416 · nearestRideable:3417
ridePos:3427 · boardGunner:3434 · dismountGunner:3448 · tickGunner:3460 · updateGunnerBtn:3488 · heliCount:3498
enterHeli:3503 · exitHeli:3534 · seatCamera:3555 · tickHeliFlight:3565 · syncBotHelis:3645 · netReady:3660
netJoin:3664 · netSend:3677 · peerColor:3698 · nameSprite:3700 · peerRifle:3713 · attachPeerGun:3744
peerInCover:3754 · peerRig:3758 · setPeerWeapon:3762 · peerBody:3763 · buildPeer:3795 · onPeer:3804
dropPeer:3837 · netLeave:3844 · peerTick:3850 · renderBoard:3895 · sendChat:3912 · showPeerBubble:3919
removePeerBubble:3925 · tickFighters:3931 · tickMother:3965 · spawnAlienShot:3993 · tickAlienShots:4005 · tickMissiles:4020
tickSquad:4052 · tickHelis:4082 · fit:4116 · tick:4122 · frame:4130 · build:4154
start:4197 · exitWorld:4286

## js/lobby.js (52 บรรทัด · 3 รายการ)
PANEL_TITLES:9 · openPanel:20 · closePanel:28

## js/lobby3d.js (780 บรรทัด · 0 รายการ)

## js/main.js (158 บรรทัด · 2 รายการ)
syncMusicBtn:79 · bootGame:113

## js/moto3d.js (1,968 บรรทัด · 107 รายการ)
### 🗂️ สารบัญโซน js/moto3d.js (Read/Edit เฉพาะช่วง)
- 144-430 DOM เครื่องเกมพกพา (สร้างครั้งเดียว · CSS ฉีดเอง ไม่แตะ style.css)
- 431-671 ถนนจากแผนที่จริง → geometry + ตารางแฮชชนถนน
- 672-1006 ฉาก: พื้น/โรงเรียน/ป้ายหมู่บ้าน/ต้นไม้/เมฆ/บ้านหมู่บ้าน
- 1007-1059 🐕 รอบ 312: หมาวิ่งตัดถนน — โผล่ข้างถนนข้างหน้ารถ วิ่งตัดผ่านเร็ว · ชน = ปรับ 500 เหรียญ
- 1060-1170 🪙 รอบ 317: เหรียญบนถนน — pool ลอยเหนือเลนซ้าย รีไซเคิลรอบผู้เล่นตลอด
- 1171-1203 🏍️🚗 รอบ 317: โมเดลยานพาหนะ 3D (ใช้ทั้งรถเราเองโหมด car และรถ/มอไซค์ของเพื่อน)
- 1204-1300 🚗 รอบ 394: โมเดลรถจริง img/models/car_01.glb ในแผนที่บ้านโพธิ์สวัสดิ์
- 1301-1485 🧑‍🤝‍🧑 รอบ 317: เพื่อนในแผนที่เดียวกัน (/world/moto/<uid>)
- 1486-1628 คำศัพท์ + ตัวอักษรบนถนน
- 1629-1845 สร้างโลกครั้งเดียว + ลูปเกม
- 1846-1968 เข้า/ออกโลก
### รายการ js/moto3d.js
REWARD:7 · ACCEL:8 · DASH_LEN:9 · DOG_HIT_COIN:10 · FEAT_SP:12 · DECAL_N:13
GRAV:14 · SUSP_K:15 · ROAD_WIDE:16 · EDGE_M:17 · ROAD_TEX_S:18 · POST_N:19
LEAN_MAX:20 · COLLECT_R:21 · SPAWN_MIN:22 · BUCKET:23 · TILE_COLORS:24 · LETTER_COIN:26
COIN_VAL:30 · COIN_GAP:31 · COIN_SPIN_SPD:33 · COIN_TIERS:36 · EMERALD_TIER:43 · HARD_LAND:44
COIN_CURVE_RAD:45 · NET_SEND_MS:47 · PEER_COLORS:48 · CHAT_MS:50 · CHAT_PRESETS:51 · ENG_FILES:92
CSS:147 · buildDom:332 · segKey:434 · smoothPts:437 · featKey:453 · addFeat:454
genFeatures:459 · terrainAt:478 · roadGroundY:491 · decalTex:499 · makeDecals:518 · decalTick:527
buildRoads:544 · distToSeg:640 · roadInfo:645 · onRoad:651 · randomRoadPoint:652 · makeTextSprite:675
letterTexture:688 · woodTileMat:703 · muralTexture:714 · buildSchool:726 · buildScenery:872 · scatterTrees:951
postTick:971 · scatterClouds:998 · makeDog:1010 · spawnDog:1025 · dogHit:1035 · dogTick:1046
coinTexture:1064 · makeCoins:1075 · loadCoinImg:1081 · addCoin:1093 · clearCoins:1101 · addFreeCoin:1105
coinTierAt:1113 · coinFx:1123 · grabCoin:1132 · coinTick:1149 · placeSpecialCoin:1163 · makeVehicle:1175
mCarSplitWheel:1212 · mCarEnsure:1238 · mCarMat:1255 · mCarBuild:1268 · mCarCode:1295 · netReady:1307
netJoin:1311 · netSend:1324 · sendChat:1341 · showPeerBubble:1351 · removePeerBubble:1358 · renderBoard:1365
peerColor:1382 · buildPeer:1386 · onPeer:1407 · dropPeer:1438 · netLeave:1445 · peerTick:1451
spawnSlot:1472 · pickWord:1489 · spawnLetters:1499 · renderWordHud:1514 · fitWord:1522 · collectTick:1529
completeWord:1548 · relocTick:1573 · gpsTick:1588 · miniTick:1597 · build:1632 · applyVehicleUi:1666
fit:1684 · tick:1692 · frame:1700 · start:1849 · exitWorld:1909

## js/music.js (157 บรรทัด · 0 รายการ)

## js/online.js (1,116 บรรทัด · 76 รายการ)
ONLINE_STALE_MS:53 · ONLINE_BEAT_MS:54 · LEADERBOARD_SIZE:55 · onlineDisplayName:59 · onlineActivity:67 · ensureOnlineId:83
onlineKey:93 · onlinePushPresence:98 · onlinePushScore:108 · fetchPlayerStats:134 · onlineRerender:156 · notifyFriendBadges:168
FRIEND_ALPHA:194 · friendCode:195 · friendSearch:207 · friendRequest:231 · friendAccept:240 · friendDecline:252
friendsHeal:262 · CHAT_MAX_LEN:286 · CHAT_KEEP:287 · chatPairId:289 · chatRef:292 · chatListen:298
chatSend:314 · chatDeleteMsg:330 · TYPING_TTL:338 · typingRef:340 · chatSetTyping:341 · chatClearTyping:351
chatWatchTyping:359 · chatThemeRef:377 · chatSetTheme:378 · chatWatchTheme:383 · chatPrune:391 · chatSeenTs:408
chatMarkSeen:414 · chatUnreadCount:426 · chatWatchSync:429 · GIFT_EXPIRE_MS:479 · giftSend:482 · greetSend:496
giftAccept:508 · giftDecline:512 · giftInWatch:518 · giftReclaim:549 · giftOutWatchSync:559 · giftOutRebuild:614
salesWatch:644 · salesRerender:652 · sellInc:656 · marketWatch:664 · marketList:697 · marketUnlist:705
marketBuy:714 · marketSoldWatch:727 · tinvSend:756 · tinvClear:763 · tinvWatch:767 · FEED_MAX:796
feedEvent:799 · feedPrune:810 · feedPurgeCat:821 · feedPushAssets:832 · petDescriptor:850 · feedPushPets:856
fetchPlayerPets:870 · followSet:886 · followUnset:897 · feedRebuild:904 · feedWatchSync:916 · fetchPlayerFeed:943
fetchPlayerAssets:956 · fetchFollowers:975 · onlineStart:984 · onlineLoadSDK:1091

## js/state.js (980 บรรทัด · 83 รายการ)
STORAGE_KEY:6 · CURE_COST:8 · HUNGRY_SICK_MS:9 · MEAL_HOUR:11 · MEAL_FULL:12 · SLEEP_FROM_HOUR:13
SLEEP_SICK_HOUR:14 · WAKE_HOUR:15 · DINNER_COST:16 · TOXIN_FULL:18 · DETOX_COST:19 · FOODQUIZ_Q:21
FOODQUIZ_COIN:22 · FOODQUIZ_BONUS:23 · SHAPE_JUNK_MEALS:25 · SHAPE_CLEAN_MEALS:26 · SHAPE_MISS_MEALS:27 · SHAPE_EXP_BONUS:28
HEAT_SICK_MS:29 · THIRST_SICK_MS:30 · DEFAULT_STATE:32 · FEED_CATS:159 · SLOT_MS:170 · currentSlotStart:171
nextSlotStart:177 · mealDayKey:179 · nightKeyOf:181 · newPet:187 · loadState:212 · saveState:428
activePet:435 · petStage:436 · isAdult:441 · abilityOn:442 · hasPetType:443 · todayStr:446
dailyTick:450 · addCoins:453 · QUEST_POOL:473 · QUEST_PER_DAY:483 · questsToday:484 · questTick:491
questEvent:495 · assetValue:531 · netWorth:557 · assetCount:559 · refreshRank:576 · heatProtected:592
rainProtected:596 · petHungry:599 · petShapeOf:603 · updatePetShape:609 · shapeMealDone:616 · heatPct:626
ymStr:635 · billOutstanding:639 · UTILITIES:646 · HOME_UTILITIES:652 · homeDecayed:654 · billTick:657
myCar:726 · carLoanDue:731 · carLoanOverdue:736 · carLoanPayable:741 · carLoanPay:748 · compTick:761
ONLINE_RATE:775 · onlineEarnActive:776 · onlineEarnTick:780 · onlineEarnFlush:791 · marketTick:801 · addCraft:825
ORDER_MAX:844 · ORDER_LIFE_MS:845 · ORDER_GAP_MIN_MS:846 · ORDER_GAP_SPAN_MS:847 · ORDER_TIER_WEIGHT:848 · newOrder:849
orderTick:862 · careTick:870 · expNeed:951 · addExp:956 · addRP:976

## js/ui.js (7,010 บรรทัด · 281 รายการ)
### 🗂️ สารบัญโซน js/ui.js (Read/Edit เฉพาะช่วง)
- 2-152 UI: Dashboard / ร้านค้า / ที่พัก / ร้านสัตว์เลี้ยง / แรงค์ / สถิติ
- 153-478 🆕 New Word (รอบ 116): คำศัพท์ใหม่ 1 คำ/การ login ตามระดับชั้น
- 479-499 นาฬิกาใต้ชื่อผู้เล่น (วัน · วันที่ · เวลา อัปเดตทุกวินาที)
- 500-552 ข้าวเย็นของผู้เล่น (คิว 7725691507 ข้อ 6)
- 553-584 แถบฝนประจำวัน: นับถอยหลังถึง 19:00 ทุกวัน (ฝนตก 1 ชม.)
- 585-629 เอฟเฟกต์ฝนเต็มจอ (รอบยี่สิบ): ฝนตกจริง (19:00-20:00) + ไม่มีบ้านสภาพดี
- 630-650 การ์ด "คนที่กำลังทำการบ้านไปพร้อมๆ กับเรา"
- 651-705 รอบ 149: กล่อง aside ขวาเลื่อนวนอัตโนมัติ (ล่าง→บน) ไม่มี scrollbar
- 706-994 Daily Quest (item 3): การ์ดภารกิจวันนี้ใน aside ขวา
- 995-1087 รอบ 153: เมนูลัดแตะแถวเพื่อนออนไลน์ในกล่อง aside
- 1088-1335 การ์ด Leaderboard — สลับ 2 แท็บในการ์ดเดียว (ประหยัดพื้นที่):
- 1336-1634 การ์ดข้อมูลผู้เล่น 👤 — คลิกชื่อในการ์ดเพื่อน/กระดาน แล้วโชว์
- 1635-1853 แผงเพื่อน 👥 (ข้อ 0.3): รหัสเพื่อน + ค้นหา + คำขอ + รายชื่อเพื่อน
- 1854-1892 แชทกับเพื่อน (ข้อ 0.4) — กล่องแชทลอยกลางจอ + แผง emoji
- 1893-2199 รอบ 179: หน้ารวมข้อความ (inbox แบบ Messenger — ธีมกระจกฟ้า sci-fi ของเกม)
- 2200-2546 ระบบส่งของขวัญ (ข้อ 0.5) — ห้องของขวัญ + กล่องเลือกส่ง + ฉากเปิด
- 2547-2599 RANK CARD + ฉากเลื่อนแรงค์
- 2600-2602 PET DASHBOARD
- 2603-2755 📰 รอบ 155: overlay ข้อมูลน้อง & การดูแล + ฟีดกิจกรรมเพื่อน
- 2756-3298 📖 Dictionary ค้นหาคำศัพท์ (รอบ 254 ผู้ใช้สั่ง 16 ก.ค. 2026)
- 3299-3342 การนอน (คิว 7725691507 ข้อ 1)
- 3343-3721 ให้อาหาร (ระบบมื้อเย็น 18:00 + ความอิ่มสะสม — ข้อ 2+3)
- 3722-3803 🛡️ ควิซอาหารปลอดภัย (ต่อยอดข้อ 5.1)
- 3804-3867 ร้านค้าไอเทมแต่งตัว (ล็อกช่วงแรกเกิด/ไข่ ตามกติกาใหม่)
- 3868-4055 ที่พัก (หลบแดด/หลบฝน) + เครื่องปรับอากาศ
- 4056-4173 บิลสาธารณูปโภค (ค่าไฟ/ค่าน้ำ — เครื่องยนต์อยู่ใน state.js: UTILITIES/billTick)
- 4174-4256 การ์ดมือถือ (ข้อ 7): ซื้อ 10,000 ขายคืน 6,000
- 4257-4267 การ์ดคอมพิวเตอร์ (ข้อ 11): ซื้อ 50,000 ขายคืน 30,000
- 4268-4423 item 8: โบนัสออนไลน์ +0.01 เหรียญ/วิ ฟรีทุกคนที่เปิดเกมออนไลน์อยู่
- 4424-4631 🎫 การ์ดตั๋วโลกผจญภัย (คิว 7725691507 ข้อ 7)
- 4632-4713 🎃 การ์ดตั๋วโลกผีสิงกลางคืน (ต่อยอดข้อ 8 · ผู้ใช้เคาะ 7 ก.ค.)
- 4714-4817 🚁 การ์ดตั๋วโลกเฮลิคอปเตอร์ Bell (รอบ 52)
- 4818-4917 🛸 การ์ดตั๋วโลกโดรน FPV Racing (รอบ 85) — ซื้อได้เมื่อมีตั๋วเฮลิคอปเตอร์
- 4918-5108 🚗 การ์ดตั๋วโลกขับรถกำแพงเพชร (รอบ 113) — ซื้อได้เมื่อมีตั๋วโดรน FPV
- 5109-5201 ⚽ การ์ดตั๋วโลกสนามฟุตบอล (รอบ 196) — ซื้อได้เมื่อมีตั๋วขับรถ
- 5202-5297 🏍️ การ์ดตั๋วโลกมอเตอร์ไซค์บ้านโพธิ์สวัสดิ์ (รอบ 293) — ซื้อได้เมื่อมีตั๋วขับรถ
- 5298-5395 🛸 การ์ดตั๋วโลก "ยานแม่บุกโลก" (Invasion · รอบ 413)
- 5396-5547 🌍 ปุ่มลัดเข้าโลก 3D ในรางเมนูซ้าย (ผู้ใช้สั่ง 9 ก.ค. 2026)
- 5548-5717 การ์ดสวนผลไม้ (ข้อ 12): ซื้อต้นไม้ปลูกได้ไม่จำกัด แต่ละต้นออกผล
- 5718-5727 โรงงานผลิตสินค้า 🏭 + ตลาดขายต่อ (แนวคิดใหม่ 5 ก.ค. 2026)
- 5728-5750 โรงงานผลิต (แผง 🏭) — แยกออกจากตลาด (ผู้ใช้สั่ง 6 ก.ค. 2026)
- 5751-5901 ตลาดขายสินค้า (แผง 🏪) — แยกออกจากโรงงาน
- 5902-6805 🚗 รอบ 131: หมวดยานพาหนะ — โชว์รูมรถ 10 คัน (แคตตาล็อก 5 ช่อง/แถว)
- 6806-6866 ร้านสัตว์เลี้ยง (ซื้อเพิ่มได้ ไม่ลบตัวเดิม)
- 6867-6903 เลเวลอัพ (รายตัว)
- 6904-6973 สถิติผลการเรียนรู้
- 6974-7010 item 4: การ์ดสรุปส่งครู — ใบเดียวจบ ชื่อ/วัน-เวลา/เหรียญวันนี้/แรงค์/สอบล่าสุด
### รายการ js/ui.js
startHTML:10 · PET_ANIM:30 · petAnimHTML:35 · petVisualHTML:50 · lobbyBlk:81 · caretakerFigureHTML:87
footAlign:97 · heroRankBgHTML:125 · NEW_WORD_MS:159 · newWordNext:165 · renderNewWord:176 · alignNewWord:203
startNewWordTimer:217 · nwCountdownTick:234 · PAT_REMIND_HOUR:249 · patRemindTick:250 · applyPatRemindGlow:271 · NEW_WORD_COIN:286
NW_DAILY_GOAL:287 · NW_DAILY_BONUS:288 · newWordReward:289 · nwDailyTick:312 · coinFlyFx:331 · nwDailyBarHTML:364
showNewWordPopup:375 · GIANT_MAX:404 · GIANT_COST:405 · GIANT_PET_VH:406 · GIANT_OWNER_VH:407 · GIANT_OWNER_X:408
GIANT_NAMES:409 · giantLevel:410 · giantUnlocked:414 · upgradeGiant:416 · renamePet:439 · resetGiant:455
mealLabel:466 · fmtMins:473 · renderClock:482 · dinnerDue:505 · renderDinnerChip:510 · dinnerClick:521
renderRainBar:556 · rainFxTick:589 · RAIN_DROP_IMGS:606 · rainFxDrop:607 · selfPronoun:637 · selfTag:642
idTag:646 · SIDE_SCROLL_SPEED:656 · SIDE_SCROLL_RESUME:657 · initSideScroll:660 · sideScrollTick:688 · QUEST_FLASH_HOLD:712
QUEST_DECK_FLIP_MS:719 · questGo:722 · qDeckDraw:731 · qDeckNext:754 · renderQuestCard:768 · sideFlashRows:806
FRIEND_FLASH_GRACE:824 · ONLINE_FLIP_MS:832 · ONLINE_FLIP_RESUME:833 · ONLINE_SWIPE_STEP:834 · onPageDraw:838 · onPageFlip:846
bindOnlinePager:857 · renderOnlineCard:890 · bindInviteCards:1002 · bindFriendQuickMenu:1022 · openFriendQuickMenu:1032 · bindLbTabs:1094
renderLeaderboardCard:1105 · bindLbGroupOpen:1128 · lbRankRows:1139 · lbDemoRows:1166 · lbChar:1188 · openLeaderboardFull:1197
BLK_PAD:1261 · seatPodChars:1263 · lbCoinHtml:1273 · lbBadgeHtml:1289 · lbBossHtml:1315 · bindPlayerClicks:1341
showPlayerCard:1351 · petDescImg:1564 · openImgLightbox:1577 · openPetPeek:1597 · updateBillBadges:1641 · setBadge:1653
updateSettingsBadge:1669 · openAttentionSummary:1683 · updateFriendBadge:1725 · renderFriendPanel:1735 · friendDoSearch:1783 · refreshFriendData:1807
CHAT_EMOJI_CATS:1859 · CHAT_THEMES:1881 · CHAT_SECRET_MS:1890 · chatBadgeSync:1898 · ibTimeStr:1906 · openChatInbox:1913
openChat:2016 · giftImg:2203 · giftDateStr:2205 · GREETS:2213 · GREET_EXP:2221 · greetInfo:2222
openGreetPicker:2226 · giftItemPic:2268 · giftItemName:2276 · updateGiftBadge:2282 · renderGiftPanel:2291 · acceptGift:2349
declineGift:2372 · showGreetReveal:2381 · showGiftReveal:2408 · openGiftPicker:2434 · confirmSendGift:2502 · doSendGift:2526
rankBadgeHTML:2550 · renderRankCard:2555 · showRankUp:2577 · bindPetPlateButtons:2612 · openPetInfoOverlay:2636 · feedAgo:2659
renderFeedCard:2672 · alignPetTabs:2725 · alignCureBtn:2743 · dictRecordLookup:2767 · DICT_FILE_COUNT:2778 · loadDict:2779
dictSearch:2794 · dictTapWords:2809 · dictEntryHTML:2813 · openDictOverlay:2824 · renderDashboard:2908 · sleepBtnHTML:3304
sleepHintHTML:3311 · sleepAllPets:3322 · wakeAllPets:3335 · feedPet:3346 · openFoodMenu:3360 · feedWith:3431
AVATAR_UI:3461 · playerAvatarHTML:3464 · SHAPE_UI:3470 · showFeedResult:3479 · curePet:3520 · heartsFx:3543
PAT_HOLD_MS:3566 · PAT_EXP:3567 · bindPetTap:3568 · petBounce:3586 · petMood:3592 · shortPatPet:3599
longPatPet:3607 · patCalendarHTML:3627 · patStreakTick:3655 · cureCelebrateFx:3681 · railCureClick:3692 · detoxPet:3704
openFoodQuiz:3727 · renderShop:3807 · homeVisualHTML:3871 · showHomeRuined:3885 · showCutNotice:3906 · renderHomeCard:3924
payMaint:4008 · trashBillUI:4024 · payTrash:4041 · UTILITY_UI:4060 · utilityBillUI:4109 · payUtility:4134
buyUtilityFix:4160 · renderPhoneCard:4178 · buyPhone:4218 · sellPhone:4240 · compLiveTotal:4261 · onlineLiveTotal:4272
renderOnlineEarnPill:4277 · openPillInfo:4300 · renderComputerCard:4347 · buyComputer:4382 · sellComputer:4405 · soldCount:4431
soldBadge:4432 · renderTicketCard:4437 · loadScriptOnce:4493 · enterAdventure3D:4509 · pickAdvMap:4534 · enterHaunted3D:4569
advHealClick:4591 · buyTicket:4611 · renderHauntCard:4637 · buyHauntTicket:4692 · renderHeliCard:4719 · buyHeliTicket:4777
enterHeli3D:4800 · renderDroneCard:4822 · buyDroneTicket:4877 · enterDrone3D:4900 · renderDriveCard:4923 · buyDriveTicket:4997
enterDrive3D:5020 · pickDriveMap:5055 · enterMotoMapAsCar:5091 · renderSoccerCard:5113 · buySoccerTicket:5161 · enterSoccer3D:5184
renderMotoCard:5207 · buyMotoTicket:5256 · enterMoto3D:5279 · renderInvasionCard:5302 · INVASION_REWARD:5351 · buyInvasionTicket:5353
enterInvasion3D:5377 · WORLD3D:5402 · gotoRobotShop:5413 · scrollShopCardIntoView:5418 · railWorldClick:5421 · renderRailWorlds:5442
tinvNoticeHTML:5501 · openTinvPicker:5509 · fruitCountdown:5553 · renderFarmCard:5565 · renderFarmClock:5640 · buyFruit:5656
sellFruit:5676 · sellAllFruit:5697 · collectImg:5726 · renderFactoryCard:5732 · renderMarketCard:5755 · updateWishBadge:5811
openWishlistDialog:5822 · bindStripArrows:5867 · renderMarketBrowse:5879 · carImg:5908 · renderVehicleShop:5909 · CS_CYCLE_MS:5960
carInteriorImg:5961 · carStatHtml:5963 · renderCarShowroom:5970 · csShowBig:5996 · csInit:6023 · RS_CYCLE_MS:6046
robotImg:6047 · renderRobotShop:6048 · rsShowBig:6070 · rsInit:6091 · buyRobot:6110 · enterMecha3D:6132
pickMechaRobot:6153 · pickDriveCar:6185 · openCarBuyDialog:6228 · buyCarInsurance:6289 · payCarLoanMonthly:6308 · payCarLoanFull:6320
carDriveBlock:6339 · gotoVehicleShop:6344 · gotoMyStock:6349 · showNeedCarDialog:6355 · craftDiscount:6367 · renderFactory:6370
renderOrdersUI:6432 · startProduce:6451 · buyCollectible:6479 · cancelProduce:6507 · deliverOrder:6521 · renderOrderClock:6538
renderCollectMine:6548 · openListDialog:6590 · cancelListing:6643 · buyMarketItem:6666 · showCollectReveal:6693 · buyAC:6731
openHomeShop:6750 · renderPetShop:6809 · showLevelUp:6870 · renderStats:6907 · showTeacherCard:6978

## js/util.js (727 บรรทัด · 32 รายการ)
shuffle:6 · fmtNum:15 · escapeHTML:19 · seededRand:25 · fmtThaiDT:35 · fmtThaiDate:39
showScreen:44 · TOAST_WARN_RE:52 · restackToasts:55 · toast:77 · floatFx:97 · beep:107
PET_MOOD:148 · petVoiceSynth:155 · sirenSynth:232 · playCashier:256 · cashierSynth:270 · playSpark:303
sparkSynth:317 · thunderFx:352 · wordAudioFile:420 · speakWord:423 · speakLetter:443 · pickSpeakVoice:462
speakWordTTS:473 · askNameDialog:493 · askConfirm:533 · alertBox:551 · applyNoAnim:571 · openSettings:576
openHelp:682 · openTeacherGuide:708

## js/vocabbook.js (207 บรรทัด · 14 รายการ)
VB_MAX:11 · VB_QUIZ_N:12 · VB_QUIZ_MIN:13 · vbGroup:16 · VB_GROUP_UI:21 · vbRecord:24
vbSeen:49 · vbStats:62 · vbList:70 · vbReviewCat:81 · vbStartReview:95 · openVocabBook:106
vbRender:148 · vbCardHTML:194

## js/wordsearch.js (236 บรรทัด · 0 รายการ)

## css/lobby.css (2,533 บรรทัด · 471 selector)
:root:6 · html:15 · body:16 · *:33,34,35,36 · #app:39 · h1:41
.subtitle:42 · .shop-title:43 · #rotate-overlay:46 · .screen:68 · #screen-select:77,78,79,80(+5) · .egg-need:87
.petshop-topright:89 · .petshop-play-link:90,95 · #screen-quiz:134,135,136,137(+4) · #quiz-choices:143,144 · .word-card:151 · .quiz-choice:152,153,154
.big-btn:157,158,159,160 · #screen-dashboard:165,784,792 · .lobby-top:172,600,601,602(+3) · .top-flex:173 · .profile-plate:174,178,521 · #rain-fx:183
.rain-layer:186,192 · .rain-glass:199 · .glass-drop:200 · .rail-btn:215,611,617,618(+13) · .rail-badge:216 · .fr-code-box:221
.fr-code-label:225 · .fr-code-row:226 · .fr-code:227 · .fr-copy-btn:232,236,241,242 · .fr-search-btn:237 · .fr-add-btn:238
.fr-accept:239 · .fr-decline:240 · #fr-search-input:243 · #fr-search-result:247 · .fr-found:248 · .fr-hint:252
.fr-list-title:253 · .fr-row:254 · .fr-req:258 · .fr-row-name:260,264 · .fr-row-status:268 · .fr-req-btns:269
.online-dot:270 · .fr-chat-btn:271,276,278 · .fr-unread:279 · .chat-overlay:286 · .chat-box:290,399,406,413(+12) · .chat-head:302
.chat-theme-btn:307,311 · .chat-secret-tg:312,313 · .cs-switch:314,315,320,321 · .cs-slider:316,318 · .chat-secret-note:322 · .chat-theme-strip:325
.chat-theme-sw:327,330,331,332(+1) · .chat-head-name:334,335 · .chat-close:336 · .chat-msgs:340 · .chat-empty:344 · .chat-typing:346
.ct-dots:348,349,351,352 · .no-anim:354,367,670,697(+26) · .chat-bubble:355,360,365 · .chat-emoji:368 · .chat-emo:372,376 · .chat-input-row:377
.chat-emoji-btn:381 · #chat-input:385 · .chat-send:389,394,395 · .pl-click:462,464,465 · .pl-overlay:466 · .pl-card:470,1911
.pl-close:476 · .pl-head:480,1820,1823 · .pl-grade:485 · .pl-badges:487 · .pl-badge-chip:488,492 · .pl-body:493
.pl-loading:494 · .pl-none:495 · .pl-me-tag:496 · .pl-blk-wrap:498 · .pl-blk:499 · .pl-stat:500
.pl-lbl:505 · .pl-val:506,507 · .pl-tip:508 · .chip-edit:514,519,520 · .rank-mini:526,532,533,534 · .pass-photo:536,541
.pet-tabs:543 · .dict-box:544,548,549,550(+1) · .dict-card:556,561,565,566(+2) · .dict-head:562,563 · .dict-trail:570,574 · .dt-c:575,579,580
.dt-sep:581 · .dict-today:582 · .di-w:584,585,586 · .dict-list:587 · .dict-item:588,592,593,594(+5) · .lobby-mid:608
.lobby-rail:610 · .rail-worlds:628 · .rail-div:629 · .lobby-stage:644,646,662,789(+1) · .newword-banner:652,659,664 · .coin-fly:675,678
.coin-plus:684 · .nw-pop-coin:699,701,702 · .nw-pop-goal:705,706,710,714 · .nw-goal-head:707,709,711 · .nw-goal-bar:712 · .nw-goal-fill:713
.nw-pop-book:715,716 · .nw-tag:737 · .nw-word:742 · .nw-hint:744,745 · .nw-coin:747,750 · .nw-countdown:755
.nw-bar:757 · .nw-bar-fill:759 · .pet-stage:762,2086 · .nw-box:769,2095 · .nw-pop-word:770 · .nw-speak:771
.nw-pop-phon:772 · .nw-ipa:773 · .nw-pop-sent:774 · .nw-pop-mean:775 · .pet-tab:776,777,778,2420 · .stage-hero:799,814,822,967(+5)
.hero-ground:836,956,962 · .hero-rank-bg:838,841,844,848(+18) · #lobby3d-canvas:861,862 · .hero-scene:866,868,875,876(+8) · .caretaker-fig:915 · .caretaker-img:918
.caretaker-emoji:920 · .blk-rig:927,928,929 · .stage-plate:989,997,1008,1009(+30) · .plate-title:1003 · .lobby-side:1046,1081,1086,1089(+22) · .side-sec:1049,2335
.side-label:1050,1055 · .side-label-row:1057,1058 · .lb-tabs-out:1059,1060,1064 · .side-glass:1068,1075 · .side-card:1087,1199 · #quest-card:1099,1123,1124,1125(+6)
.q-bigcard:1100,1129,1130,1133(+1) · .qb-top:1102 · .qb-emoji:1103 · .qb-name:1105 · .qb-bar:1106,1107 · .qb-row:1109
.qb-prog:1110 · .qb-reward:1111 · .qb-go:1112,1116 · .q-dots:1117 · .q-dot:1118,1119,1120 · .q-bonus:1121
.feed-row:1144,1758,1763 · .inv-card:1146,1148,1149 · .inv-btns:1150 · .inv-go:1151,1153 · .inv-x:1154 · #online-card:1158,2343,2344,2345(+1)
.fq-overlay:1159 · .fq-box:1161,2151 · .fq-head:1165,1167 · .fq-close:1168 · .fq-sec:1170 · .fq-worlds:1171
.fq-world:1172,1174 · .fq-acts:1175 · .fq-act:1176,1179,1180 · .lobby-bottom:1210,1212 · .lobby-quiz-btn:1213 · .lobby-book-btn:1214,1215
.lobby-foodquiz-btn:1216,1217 · .lobby-play-btn:1218,1222 · .lobby-exam-btn:1224,1225,1227 · .panel-overlay:1232,1237 · .panel-box:1238 · .panel-head:1245,1249
.panel-close:1250,1255 · .panel-body:1256,1260,1261 · .panel-page:1258,1259 · .collect-sub:1265 · .mkt-empty:1266 · .craft-box:1267
.mkt-listing:1268 · .mkt-filter:1269,1613 · .hq-grid:1276 · .hq-card:1277,1282,1306 · .hq-head:1283 · .hq-pic:1289,1291
.hq-emoji:1293 · .hq-badge:1294 · .hq-stars:1298 · .hq-price:1299,1304,1305,1308(+6) · .craft-credit:1312,1314,1315 · .car-grid:1322,1324,1325
.robot-weap:1326 · .dmap-box:1329,1330 · .dmap-grid:1336 · .dmap-card:1338,1341,1342,1343(+2) · .dmap-ico:1345 · .dmap-new:1348
.dcp-grid:1350 · .dcp-card:1352,1355,1356,1357(+10) · .levelup-box:1374,2052,2053,2148 · .dcp-box:1377,1378,1382,1383(+6) · .dcp-lock:1391 · .sold-badge:1395,1397,1398
.rs-showroom:1400 · .rs-list:1401,1403 · .rs-thumb:1404,1406,1407,1408(+1) · .rs-thumb-pic:1409,1410 · .rs-thumb-price:1411 · .rs-stage:1413
.rs-big:1416 · .rs-big-img:1417 · .rs-elec:1421,1425,1430 · .rs-edge:1431,1437 · .rs-info:1440,1441,1442,1443(+1) · .rs-buy:1445,1447,1448
.cs-showroom:1452 · .cs-list:1453,1455 · .cs-thumb:1456,1458,1459,1460(+1) · .cs-thumb-pic:1461,1462 · .cs-thumb-name:1463 · .cs-thumb-price:1464
.cs-thumb-own:1465 · .cs-stage:1467 · .cs-big:1470 · .cs-big-img:1471 · .cs-elec:1475,1479,1483 · .cs-edge:1484,1490
.cs-interior:1493 · .cs-inr-label:1494,1495 · .cs-inr-img:1496 · .cs-info:1498,1499,1500,1501(+6) · .cs-buy:1509,1511,1512,1513 · .car-emoji:1515
.car-mine:1521 · .car-mine-pic:1526 · .car-mine-info:1527 · .car-loan:1528,1529 · .car-mine-btns:1530,1531,1532 · .car-locked:1534
.car-mine-head:1536 · .car-pick-list:1537,1538 · .car-pick:1539,1541,1542 · .car-pick-pic:1543,1544 · .car-pick-name:1545,1546 · .car-pick-od:1547
.car-buy-box:1549,2155 · .cb-pic:1550,1551,1552 · .cb-lines:1553 · .cb-li:1554,1558,1559 · .cb-ins:1560,1564,1565 · .cb-plan:1566
.cb-pl:1567,1572,1574,1578(+1) · .cb-total:1585 · .cb-btns:1586,1591 · .cb-x:1587 · .shop-grid:1594 · .shop-item:1595,1600,1605,1606(+3)
.mkt-tab:1614,1615 · .pg-btn:1616,1617,1618 · .pg-dot:1619 · .fr-gift-btn:1641,1646 · .gift-sec-title:1649 · .gift-in-row:1651
.gift-out-row:1655 · .gift-in-pic:1656,1658,1659 · .gift-in-info:1660,1661 · .gift-in-btns:1662 · .gift-accept:1663,1667,1669 · .gift-decline:1668
.gift-box-card:1670 · .gift-box-from:1671,1672 · .gift-note:1673 · .gift-pick-overlay:1676 · .gift-pick-box:1680 · .gift-pick-head:1686,1690
.gift-pick-close:1691 · .gift-pick-tabs:1693 · .gp-tab:1694,1698 · .gift-pick-body:1699 · .gp-chips:1700 · .gp-chip:1701,1705
.gp-card:1706,1707 · .gp-price:1708 · .gp-note:1709 · .gift-cf-pic:1710 · .chat-emoji-cats:1715 · .chat-emoji-cat:1719,1723,1724
.chat-emoji-wrap:1725,1726 · .stage-left:1734 · .pet-info-btn:1738,1745,1746 · .feed-list:1753,1757 · .feed-ico:1764 · .feed-txt:1765
.feed-name:1766 · .feed-ago:1767 · .feed-empty:1768,1771 · .pi-overlay:1773 · .pi-box:1777,1782,1783,1787(+2) · .pi-close:1789,1794,1795
.pi-close-left:1797 · .pi-portrait:1799 · .pi-dress-btn:1806,1810,1811 · .pi-shape-cap:1812,1815,1816,1817 · .greet-card:1824 · .greet-sub:1825
.greet-grid:1826 · .greet-opt:1827,1830,1831,1832 · .greet-e:1833 · .pi-streak:1837 · .pi-streak-head:1839,1841 · .pi-streak-best:1842
.pi-dots:1843 · .pi-dot:1845,1846,1847 · .pi-streak-note:1848 · .pi-care-title:1849 · .lbf-overlay:1852 · .lbf-box:1855
.lbf-head:1860 · .lbf-title:1861 · .lbf-tabs:1862 · .lbf-close:1865 · .lbf-close-l:1866 · .lbf-body:1867
.lbf-grid:1868 · .lbf-cell:1870,1873,1874,1875(+1) · .lbf-podium:1879 · .pod:1881,1908,1909 · .pod-char:1883 · .pod-base:1885
.pod-rank:1887 · .pod-label:1889 · .pod-name:1891 · .pod-sc:1893 · .pod-1:1898,1899 · .pod-2:1900,1901
.pod-3:1902,1903 · .pod-4:1904,1905 · .pod-5:1906,1907 · .pl-wide:1912,1915,1916,1917 · .pl-follow:1918,1923,1925 · .pl-unfollow:1927,1933,1934
.pl-followers:1935 · .pl-cols:1936 · .pl-col:1937 · .pl-sec-title:1938 · .pl-feed:1939,1942,1949 · .pl-feed-row:1943,1947,1948
.pl-assets-wrap:1951 · .pl-assets:1952 · .pl-asset:1955,1959,1966 · .pl-asset-emoji:1960 · .pl-asset-n:1961 · .pl-pets-wrap:1968
.pl-pets:1969 · .pl-pet:1970,1975,1977 · .pl-pet-nm:1978 · .img-lightbox:1981,1986,1987,1991(+3) · .pl-chat:2004,2009 · .pet-peek:2010,2011
.pp-chips:2013 · .pp-chip:2014 · .pp-gift:2019,2025 · .settings-box:2027,2028,2097,2102(+20) · .set-feed-head:2029 · .set-feed-sub:2033
.set-feed-row:2034 · .pillinfo-val:2039 · .pillinfo-desc:2044,2063 · .pillinfo-box:2055 · .plf-head:2058 · .plf-emoji:2059
.plf-ht:2060,2061,2062 · .plf-foot:2064 · .alert-box:2069,2071 · .ab-emoji:2072 · .ab-title:2073 · .ab-desc:2074
.ab-btns:2075,2076,2077 · .heal-heart:2079 · .attn-box:2094 · .help-box:2126,2127,2128 · .wl-box:2149 · .food-box:2150
.home-shop-box:2152 · .summary-box:2153 · .report-box:2154 · .wl-grid:2157 · .tc-wrap:2159 · .spell-btn:2165,2170
.sp-hud:2171 · .sp-word:2173 · .sp-ch:2174,2179 · .sp-th:2181 · .sp-hint:2183 · .sp-exit:2186,2190
.sp-banner:2191 · .sp-big:2196 · .sp-thb:2198 · .sp-coin:2199 · #spell-confetti:2204 · .sp-rb:2205
.sp-day:2215 · .sp-perfect:2217 · .sp-late:2219 · #spell-coinpop:2222 · .side-sub:2331,2333 · .sec-quest:2336
.on-page:2347,2348,2349,2350 · .inbox-overlay:2360 · .ib-box:2362 · .ib-head:2366 · .ib-close:2370,2372 · .ib-list:2373,2374
.ib-row:2375,2376,2377,2378 · .ib-ava:2379 · .ib-on:2383 · .ib-mid:2385 · .ib-name:2386 · .ib-last:2387
.ib-meta:2388 · .ib-time:2389 · .ib-dot:2391 · .ib-story-badge:2394 · .ib-empty:2398 · .ib-story:2400,2402
.ib-story-item:2403,2405,2412 · .ib-story-ava:2406 · .ib-story-on:2410 · .ib-world:2415,2418 · #btn-music:2423,2426,2427 · #ws-overlay:2442
#ws-board:2444,2450,2452 · .ws-head:2454 · .ws-title:2455 · .ws-grade:2457 · .ws-body:2459 · .ws-gridwrap:2460
#ws-grid:2461 · .ws-cell:2465,2469,2471,2479(+1) · .ws-flash:2483,2485 · .ws-coinpop:2489 · .ws-side:2500 · .ws-find:2501
#ws-words:2503,2505 · .ws-word:2506,2510,2512 · #ws-prog:2513 · .ws-actions:2514,2515,2517 · #ws-new:2518 · #ws-stash:2519
#ws-clear:2520 · #ws-win:2521,2523 · .ws-win-in:2524,2527

## css/style.css (1,708 บรรทัด · 455 selector)
:root:5 · *:15 · html:16,21 · input:25 · body:29 · #app:35
.screen:38,39 · h1:42 · .subtitle:43 · .egg-grid:46,63 · .egg-card:47,52,53,54(+2) · .pet-price:57,61
.egg:65,71,75 · .d1:76 · .basket:79,80,85,91(+5) · .basket-dog:89,102,103,104 · .basket-cat:90,105,106,107 · .egg-dragon:110
.topbar:125 · .topbar-coins:126 · .coin-pill:127,138,142,147(+2) · .coin-ic:134 · .no-anim:148,539,1425,1665(+2) · .net-coin:150
.q-row:162,163,164,168(+1) · .q-emoji:165 · .q-mid:166 · .q-name:167 · .q-bar:169,170 · .q-right:172,173
.q-foot:174,175 · .tc-open:178,179 · .tc-wrap:180 · .tc-card:181 · .tc-head:185 · .tc-sub:189
.tc-name:190,191 · .tc-badges:192 · .tc-when:193 · .tc-row:194,198 · .tc-pass:199 · .tc-try:200
.tc-sign:201 · .tc-hint:202 · .tc-close:203 · .mb-seller:209 · .mb-buy:210 · .wl-open:213,218
.strip-wrap:221,239 · .strip-x:222,229,230,242(+1) · .strip-arrow:231,237,238 · .craft-toolbar:245,246 · .fc-cols:248,249 · .wl-box:283
.wl-head:284,285,286 · .wl-grid:288 · .wl-it:293,297,298,299 · .wl-emoji:300 · .wl-name:301 · .wl-h:302
.hq-card:303,385 · .icon-btn:304 · #settings-badge:310 · .badge-pop:313 · .attn-box:315,316,333 · .attn-list:317
.attn-row:318,323 · .attn-ico:324 · .attn-txt:325,326 · .attn-go:327 · .attn-total:328,332 · .rain-banner:336,341,342,343
.rain-row:345 · .rain-icon:346 · .rain-track:347 · .rain-fill:351 · .rain-note:352 · .comp-earn:355,367,371,372(+1)
.comp-earn-label:360 · .comp-earn-num:361,365 · .comp-earn-sub:366 · .farm-sub:378 · .farm-mkt-hint:379 · .farm-cols:381,382
.farm-shop:384 · .farm-hq:386,387,388 · .farm-yield:389,390 · .farm-tree:391,396,401,405 · .farm-tree-emoji:400 · .farm-tree-name:403
.farm-tree-status:404 · .farm-grow-badge:406 · .farm-sell-btn:427,432 · .farm-sellall-btn:433,439,440 · .rank-card:443 · .rank-badge-wrap:448
.rank-badge-img:449 · .rank-badge-emoji:450 · .rank-body:451 · .rank-name:452,453 · .rank-bar:454 · .rank-fill:455
.rank-text:456 · .rankup-overlay:459 · .rankup-rays:465 · .rankup-content:481 · .rankup-title:486 · .rankup-badge:491,504
.rankup-badge-img:503 · .rankup-name:505 · .rankup-en:509 · .rankup-sub:513 · .rankup-btn:514,521,522 · .cr-btn-row:524
.rankup-btn-2:525,526 · .thunder-fx:529 · .quake:530 · .pet-tabs:542 · .pet-tab:543,549,550 · .pet-card:552
.pet-stage:557 · .aura:558,564 · .sp1:565 · .pet-wrap:568 · .pet-emoji:569 · .pet-img:570
.egg-img:571 · .feed-pet:572,718 · .pet-baby:573 · .pet-adult:574 · .pet-egg-stage:576 · .wear:578
.wear-head:579 · .wear-face:580 · .wear-neck:581 · .pet-name:583 · .stage-label:584 · .level-row:585
.level-badge:586 · .exp-bar:590 · .exp-fill:591 · .exp-text:592 · .ability-box:594,598 · .hunger-bar:601
.hunger-fill:602,603,604 · .food-item:610,652,656,657(+6) · .hunger-text:614 · .heat-bar:617 · .heat-fill:618 · .heat-text:619,620,621
.care-row:623 · .care-btn:624,628,631 · .btn-feed:629 · .btn-cure:630 · .sick-banner:632 · .pet-sick:636
.pet-asleep:639 · .sleep-badge:640 · .btn-sleep:642 · .dinner-btn:645 · .food-box:649,650 · .food-grid:651
.fav-tag:671 · .fd-exp:675 · .food-sec:677 · .food-sec-human:681 · .bad-tag:683 · .fd-toxin:687
.fd-safe:688 · .fq-box:691,692 · .fq-progress:693 · .fq-pair:694,695 · .fq-ask:696 · .fq-why:697
.fq-btns:701,702,706 · .fq-yes:707 · .fq-no:708 · .fq-next:709 · .food-cancel:710 · .feed-box:716,717
.feed-gain:719 · .sick-badge:723 · .big-btn:729,735,956,957(+6) · .shop-card:738 · .shop-title:742 · .shop-grid:743
.shop-item:744,748,749,750(+4) · .it-tag:755 · .tag-wear:756 · .lock-banner:758 · .home-current:764,769,770 · .home-img:771
.home-emoji:772 · .home-btn:773,795 · .home-layout:775 · .home-pic-col:776,782 · .home-img-big:780 · .home-info-col:783,785,788,789
.home-name-row:786 · .home-desc-row:787 · .home-shop-box:797,798 · .home-list:799 · .home-option:800,804,805,806(+1) · .home-opt-img:807
.home-opt-body:809,810 · .home-price:811 · .reset-link:816 · .login-card:822 · .login-pets:823 · .login-status:824
.google-btn:825,831,832 · .login-note:833 · .install-btn:836,842,843 · .install-guide-overlay:846 · .install-guide:850,854,857 · .install-steps:855,856
.install-guide-close:858 · .login-account:863 · .register-card:866,870,876,880 · .reg-safety:872,874,875 · .student-chip:881 · .clock-chip:885
.online-count:891 · .online-row:898,902,903 · .online-dot:907 · .online-name:912 · .online-act:916 · .online-live:920
.online-note:924 · .lb-empty:927 · .lb-list:928 · .lb-row:929,933,934 · .lb-rank:938 · .lb-name:940,944
.lb-coins:948 · .lb-hint:950 · .lb-badgeline:951 · .lb-tabs:953 · .lb-tab:954,955 · .tinv-note:966
.cat-card:972,993,1072,1077 · .cat-head:976 · .cat-emoji:977 · .cat-name:978 · .cat-pass:979 · .cat-info:980
.cat-btns:981 · .cat-btn:982,986,987,988(+2) · .band-sec-head:991,992 · .band-mine-tag:994 · .bsp-box:997,1000 · .bsp-head:1001
.bsp-prog:1002 · .bsp-retake:1004,1007 · .rts-box:1010 · .rts-head:1012 · .rts-sets:1013 · .rts-set:1014,1015,1016
.rts-sub:1017 · .rts-words:1018 · .rts-word:1019,1021,1022 · .rts-foot:1023 · .rts-okbtn:1024,1026 · .bsp-grid:1027
.bsp-chip:1028,1031,1032,1033(+1) · .bsp-num:1035 · .bsp-best:1036 · .bsp-tick:1037 · .bsp-foot:1038 · .vb-box:1041,1043
.vb-head:1044 · .vb-total:1045 · .vb-quizbtn:1046,1048 · .vb-tabs:1049 · .vb-tab:1050,1052,1053 · .vb-words:1054
.vb-word:1055,1058,1059,1060(+3) · .vb-empty:1064 · .vb-foot:1065 · .vb-pg:1066,1068 · #vb-pginfo:1069 · .vb-hint:1070
.band-lock:1078 · .offline-btn:1079,1080 · .quiz-progress:1085 · .quiz-phon:1086 · #quiz-extra:1087,1089,1090,1091 · .quiz-word-card:1092
.quiz-speak:1097 · .quiz-choice:1098,1103,1104,1105 · .quiz-score-pill:1106 · .stats-card:1109 · .stats-title:1113,1546 · .stats-row:1114,1115,1116,1117
.game-top:1120 · .back-btn:1121 · .combo-pill:1125 · .timer-wrap:1129 · .timer-fill:1130,1131 · .board-label:1133
.card-grid:1134 · .word-card:1135,1141,1142,1143(+3) · .hint-btn:1149,1154 · .game-endless-note:1157,1162,1164,1168(+6) · .report-btn:1189,1194 · .report-box:1197
.report-close:1198 · .rp-head:1202 · .rp-avatar:1203,1204 · .rp-title:1205 · .rp-sub:1206 · .rp-levelcard:1208
.rp-level-top:1212 · .rp-bar:1213 · .rp-bar-fill:1214 · .rp-level-note:1215,1216 · .rp-grid:1218 · .rp-stat:1219
.rp-ic:1222 · .rp-num:1223 · .rp-lbl:1224 · .rp-section:1226 · .rp-h3:1227 · .rp-badge-mini:1228
.rp-row:1229,1230,1231 · .rp-empty:1232 · .rp-badges:1233 · .rp-badge:1234 · .rp-tline:1237 · .rp-tl-head:1238,1239
.rp-tl-ems:1240 · .rp-em:1241,1242 · .rp-tl-note:1243,1244 · .rp-crown:1246,1247 · .rp-wtitle:1249 · .rp-wnow:1250,1251
.rp-wgraph:1252 · .rp-wcol:1253 · .rp-wval:1254 · .rp-wbar:1255,1256 · .rp-wlbl:1257 · .rp-cheer:1259
.report-ok:1263 · .summary-box:1266,1317,1321,1322(+2) · .sm-burst:1267 · .sm-title:1269 · .sm-line:1270 · .sm-coin:1271
.sm-matches:1277,1278 · .confetti:1280 · .sm-badge:1287 · .sm-badge-all:1291 · .badge-celebrate-overlay:1294,1307 · .badge-celebrate:1298
.bc-emoji:1304 · .bc-title:1305 · .bc-sub:1306 · .sm-cheer:1311 · .sm-streak:1312,1313 · .sm-sick:1314
.sm-btns:1315 · .float-fx:1327 · .toast:1334 · .toast-warn:1341,1348,1349,1355 · .toast-clear-all:1357,1364 · .alert-box:1366
.alert-ok:1367,1372 · .settings-box:1374 · .set-row:1375 · .set-hint:1379 · .set-hint-on:1380 · .set-hint-off:1381
.set-lwrap:1382 · .set-label:1383 · .set-desc:1384 · .set-switch:1385,1389,1390,1395(+4) · .set-sw-knob:1391 · .set-sw-txt:1398
.set-close:1404,1409 · .set-help:1410,1415 · .help-box:1417,1418,1423 · .help-item:1419 · .update-banner:1431,1440,1441 · #update-reload:1442
#update-dismiss:1446 · .levelup-overlay:1452 · .levelup-box:1456,1463,1464,1465(+4) · .bill-box:1471,1475,1476 · .tag-off:1477 · .home-decayed-img:1478
.home-dark-img:1479 · .thirst-fill:1480 · .thirst-text:1481,1482 · .toxin-fill:1485 · .toxin-text:1486,1487 · .detox-btn:1488,1493
.shape-text:1496,1497,1498,1499(+1) · .avatar-pick:1503 · .avatar-opt:1504,1508,1509,1510 · .avatar-chip-img:1514 · .avatar-chip-blk:1516 · .set-avatar-btns:1517
.avatar-mini:1518,1522 · .set-blk-row:1524 · .set-sub2:1525 · .blk-grid:1527 · .blk-mini:1528,1531,1532,1533 · .game-avatar:1536,1537,1538
.stats-nick:1547 · .ticket-owned:1550,1554 · .collect-sub:1559 · .mkt-tabs:1560 · .mkt-tab:1561,1565 · .mkt-filter:1566
.mkt-row:1570 · .mkt-emoji:1574,1575 · .mkt-info:1576,1577 · .mkt-tier-stars:1578 · .mkt-buy:1579,1584,1585 · .mkt-price-lo:1586
.mkt-price-hi:1587 · .mkt-empty:1588 · .collect-grid:1591 · .collect-cell:1592 · .cc-emoji:1593,1594 · .cc-name:1595
.cc-count:1596 · .cc-list-btn:1597,1601 · .mkt-listhead:1602 · .mkt-listing:1603 · .ml-cancel:1607 · .mkt-sold:1613,1614,1615
.list-dialog:1622,1623,1628 · .list-hint:1627 · .collect-reveal-frame:1631,1638 · .collect-reveal-img:1637 · .collect-reveal-stars:1639 · .craft-box:1642
.craft-head:1643 · .craft-bar:1644 · .craft-fill:1645 · .craft-text:1646 · .craft-btn-row:1647,1648 · .craft-go-btn:1650,1656,1657,1660
.craft-cancel:1668,1672 · .mkt-catalog:1675,1676,1677 · .mkt-pager:1680 · .pg-btn:1681,1685,1686 · .pg-mid:1687 · .pg-dots:1688
.pg-dot:1689,1690 · .order-head:1691 · .order-row:1692,1697,1699,1701 · .order-deliver:1702,1707 · .order-need:1708
