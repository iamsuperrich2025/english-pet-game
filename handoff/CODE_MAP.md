# CODE_MAP.md — แผนที่โค้ด:บรรทัด (เจนอัตโนมัติโดย `tools/gen_code_map.py` — **ห้ามแก้มือ** เดี๋ยวโดนเขียนทับ)

> วิธีใช้: หาชื่อฟังก์ชัน/ค่าคงที่/selector ในไฟล์นี้ (Grep หรือกวาดตา) → `Read` ไฟล์จริง `offset=<บรรทัด>` `limit=40`
> 🗂️ ไฟล์อ้วนมี **สารบัญโซน** (`st-end ชื่อโซน`) — งานทั้งระบบ/โลก 3D: Grep ชื่อโซน → Read/Edit เฉพาะช่วงนั้น **ห้ามอ่านทั้งไฟล์** · เพิ่มระบบใหม่ในไฟล์อ้วนต้องครอบ banner `/* ==== */`+ชื่อโซน (สารบัญเจนเอง)
> css = index `selector:บรรทัดทุกจุดที่ประกาศ` (บั๊ก UI เริ่มหาที่นี่) · เจนใหม่ทุกครั้งที่รัน `python tools/rotate_handoff.py` · อัปเดต: 2026-07-20

## js/adventure3d.js (10,292 บรรทัด · 467 รายการ)
### 🗂️ สารบัญโซน js/adventure3d.js (Read/Edit เฉพาะช่วง)
- 1-213 adventure3d.js — โลก 3D First-person 2 โหมด (คิว 7725691507 ข้อ 8 + ต่อยอด)
- 214-236 ⚽ โหมดสนามฟุตบอล (โหมด soccer · รอบ 196) — เล็ง+ชาร์จพลังเตะบอลใส่ป้ายตัวอักษร
- 237-291 🤖 โหมดหุ่นยนต์นักรบ (โหมด mecha · รอบ 199) — มุมมองในหุ่นสูง 5m เดินยิงเอเลี่ยนตัวอักษร
- 292-432 📻 หอบังคับการบิน (รอบ 64 · รอบ 66 เปลี่ยนเป็นอังกฤษล้วนตามผู้ใช้สั่ง)
- 433-453 คำศัพท์ — ตามระดับชั้น + ไม่ซ้ำคำที่ประกอบแล้ว (8.1/8.6) · แยกคลังต่อโหมด
- 454-790 Texture ตัวอักษร / emoji / ป้ายชื่อผู้เล่น (canvas → sprite)
- 791-957 🧱 ตัวละครบล็อก (โลกขับรถ) — เลือกก่อนออกรถ · เพื่อนใน map เห็นเป็นหุ่นบล็อกขับรถบล็อก
- 958-1214 🚙 รอบ 393: รถเพื่อนในโลกขับรถ = โมเดลจริง img/models/car_01.glb (ผู้ใช้สั่ง)
- 1215-1367 สร้างฉาก static ครั้งเดียวต่อโหมด
- 1368-1685 🚗 เมืองกำแพงเพชรจริง (โหมด drive) — ข้อมูล OpenStreetMap ใน js/data/city_kpp.js
- 1686-1700 🌅 ท้องฟ้าภาพจริง (รอบ 203) — ใส่ภาพ panorama 360° (equirectangular 2:1) เป็นฉากหลังท้องฟ้า
- 1701-2065 🧱 เทกซ์เจอร์ภาพจริง (รอบ 323) — วางไฟล์ `img/tex/<key>.jpg` (หรือ .png) แล้วแปะทับพื้นผิวทันที
- 2066-2165 ตัวอักษรในโลก (8.2)
- 2166-2220 🔠🪙 เก็บตัวอักษร 1 ตัว = ได้ 1 เหรียญ (รอบ 345)
- 2221-2279 ประกอบคำอัตโนมัติเมื่อมีตัวอักษรครบ (8.1/8.4)
- 2280-2374 โหมด adv: monsters ยิงสู้ได้ (สเปกเดิม 8.5)
- 2375-2555 โหมด haunt: ผีโผล่ 3 วิ → ย้ายที่ · สู้ไม่ได้ · โดนจับ = game over
- 2556-2707 เสียงหลอนโหมดผีสิง — สังเคราะห์ Web Audio (ปลอดลิขสิทธิ์ 100%)
- 2708-3022 Multiplayer — ผู้เล่นอื่นใน map เดียวกัน (สไตล์ Roblox)
- 3023-3222 Voice chat ใน map — WebRTC P2P mesh (เสียงวิ่งตรงระหว่างเครื่อง)
- 3223-3309 🏁 พิธีประกาศแชมป์ (ครูกด "จบรอบแข่ง") — /class/<map>/podium
- 3310-3502 HUD
- 3503-5040 DOM overlay + CSS (สร้างครั้งเดียว — self-contained ไม่แตะ style.css)
- 5041-5166 Input — เมาส์+คีย์บอร์ด และจอสัมผัส (มือถือ landscape)
- 5167-5171 🚁 โหมดเฮลิคอปเตอร์ Bell — ฟิสิกส์บินแบบอาร์เคด (สไตล์ Helicopter Flight Pilot)
- 5172-5563 🛸 โดรน FPV (โหมด drone) — บินเร็ว/คล่อง ลอดหน้าต่างเข้าตึกร้าง เก็บตัวอักษรในห้อง
- 5564-5686 🚗 โหมดขับรถเมืองกำแพงเพชร — ฟิสิกส์รถอาร์เคด (bicycle model)
- 5687-5780 🚦 รอบ 133: ไฟจราจรจริงที่ทางแยกใหญ่ + ฝ่าไฟแดงโดนใบสั่ง ม.22
- 5781-6176 🧭 GPS นำทาง (โหมด drive) — เลือกตัวอักษรเป้าหมาย + เส้นทางตามถนนจริง (A*) + เสียงอังกฤษเลี้ยว
- 6177-6235 🎛️ เข็มหน้าปัดวิ่งจริง (สปีด 0-180 + วัดรอบ 0-8×1000) — วาดทับวงเกจของภาพ dash.png
- 6236-6320 🎵 รอบ 181: วิทยุในรถ — จอ head-unit กลางคอนโซล (visualizer + เลือกเพลง 3 โหมด)
- 6321-6448 🪆 รอบ 191: ตุ๊กตาดุ๊กดิ๊กหน้ารถ — รูปตัวละครที่ผู้เล่นเลือก (blkN.png)
- 6449-6752 🚔 รอบ 128: แผงเตรียมออกรถ + กฎหมายจราจร + ใบสั่ง
- 6753-6795 🛩️📦 ภารกิจไปรษณีย์กลางคืน (รอบ 353) — เฉพาะช่วงฟ้ามืด (heliNight>.5)
- 6796-7980 🚶🛗🚁🪂 โหมดเดินเท้าในเมืองเฮลิฯ (รอบ 354 — ผู้ใช้สั่ง)
- 7981-8054 🎛️ หน้าปัดเข็มขยับจริง (รอบ 61) — วาดสดทุกเฟรมจากค่าการบินจริง
- 8055-8283 🌧️☀️ ชั้นบนกระจก: ที่ปัดน้ำฝน + แสงแดดสาด (รอบ 346)
- 8284-8353 📹 กล้องใต้ท้องเครื่อง (belly cam) — รอบ 348
- 8354-8425 🎯 วงเป้าลงจอด (รอบ 349) — ไฮไลต์ดาดฟ้าที่มีตัวอักษร ให้รู้ว่าควรร่อนลงตรงไหน
- 8426-9040 📏 แถบเตือนความเร็วดิ่ง (รอบ 349) — ลงเร็วเกินกรอบกล้องกะพริบแดง สอนให้ร่อนลงนุ่มๆ
- 9041-9043 Loop หลัก
- 9044-9360 ⚽ โหมดสนามฟุตบอล — ฟิสิกส์บอล + เล็ง + ชาร์จพลัง + กล้อง 1st/3rd + ชุดนักเตะ
- 9361-9808 🤖 โหมดหุ่นยนต์นักรบ — เดินยิงเอเลี่ยนตัวอักษร (ต้องยิงเรียงลำดับในคำ)
- 9809-9821 เข้า/ออกโลก
- 9822-10292 ❓ การ์ด "วิธีเล่น" ตอนเข้าโลกครั้งแรก (จำแยกต่อโลกใน localStorage — ไม่แตะ state.js)
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
AIM_YAW_SP:226 · SOCCER_TILES:227 · MECHA_EYE:241 · ALIEN_COUNT:242 · MECHA_MAX_HP:243 · MECHA_ATK_RANGE:244
ALIEN_SHOT_SPD:245 · POWERUP_GAP:246 · BOSS_SCALE:247 · COMBO_X2:248 · BOSS_SPECIES:251 · pickBossSpecies:259
WAVE_BASE_GOAL:261 · waveCfg:262 · MECHA_WEAPONS:271 · ATC_REPLIES:300 · ATC_CLOSERS:305 · ATC:310
CHAT_MAX:429 · doneList:436 · wordPool:437 · pickWords:450 · TILE_COLORS:457 · letterTexture:458
emojiTexture:472 · GHOST_IMG_MAX:484 · measureGhostBox:491 · probeGhostImages:504 · whenGhostsReady:516 · ghostTexture:520
ghostScareSrc:525 · AD_STYLES:533 · adRenterActive:542 · adBoardTexture:543 · addAdBillboard:590 · ringAds:601
adsFetch:612 · adsWatch:624 · adsStop:631 · adsChanged:632 · adRentBuy:643 · heliMusicTick:666
AD_FLYBY_COIN:670 · adFlybyTick:672 · adShopOpen:691 · adShopRender:705 · BUILDING_TINTS:730 · FACADE_ROWS:732
buildingFacadeTexture:733 · makePeerSprite:757 · BLOCK_AVATARS:797 · blkGeo:808 · blkMat:809 · blkCyl:810
blkFaceMat:812 · makeBlockFigure:827 · makeBlockCar:867 · blkNameSprite:912 · makeBlockPeer:925 · makeBlockWalkPeer:946
disposeBlockPeer:954 · CAR_GLB_URL:965 · CAR_GLB_LEN:966 · carSplitWheel:970 · carGlbEnsure:997 · carMatGet:1016
carGlbBuild:1032 · carAvCode:1081 · blkBuildThumbs:1088 · blkBuildPicker:1106 · pickBlockAvatar:1151 · bubbleSprite:1174
showPeerBubble:1201 · removePeerBubble:1209 · concreteTexture:1219 · brokenWindowTexture:1236 · intactGlassTexture:1252 · chargeIconTexture:1270
rustyDoorTexture:1279 · dAddBox:1293 · buildAbandoned:1300 · makeNameSprite:1373 · flatGeom:1386 · flatGeomUV:1395
buildDriveCity:1405 · SKY_IMG:1691 · applySky:1692 · applyTex:1707 · buildScene:1730 · randPos:2069
randRoadPos:2077 · spawnLetter:2089 · spawnLettersForWord:2120 · ensureCoverage:2122 · relocateLetters:2135 · removeLetter:2160
LETTER_COIN:2171 · pickUpLetter:2172 · letterPop:2186 · letterChime:2204 · tryCompleteWords:2224 · completeWord:2238
spawnMonster:2283 · killMonster:2292 · tickMonsters:2300 · damagePlayer:2322 · shoot:2338 · tickShots:2352
spawnGhost:2378 · GHOST_STYLE:2387 · GHOST_H_DEFAULT:2388 · applyGhostSize:2389 · respawnGhost:2398 · tickGhosts:2414
sessionRecapHtml:2460 · hauntRunSec:2467 · fmtSurv:2468 · hauntSurviveFinish:2469 · tickSurvive:2479 · renderHearts:2492
ghostHit:2501 · caught:2523 · knockedOut:2549 · netReady:2713 · netJoin:2717 · sendPos:2730
sendChat:2773 · toggleChatBox:2787 · onPeerData:2797 · disposeHeliMesh:2883 · removePeer:2888 · netLeave:2903
tickPeers:2911 · RTC_CFG:3031 · tinvLinked:3032 · partyWord:3039 · syncPartyWord:3052 · updateVoiceBtns:3204
PODIUM_BONUS:3229 · podiumJoin:3231 · podiumLeave:3242 · endRound:3243 · showPodium:3254 · tinvCheck:3294
showBanner:3314 · renderHudTop:3320 · renderHudWords:3325 · renderHudInv:3335 · ddTierFromName:3342 · renderBoard:3344
drawBigMap:3368 · openBigMap:3423 · closeBigMap:3431 · drawMinimap:3436 · loadCarDash:3508 · loadCarWheel:3520
buildDom:3530 · confirmExit:5025 · IS_TOUCH:5044 · bindInput:5045 · movePlayer:5132 · tickPlayer:5142
collideDrone:5175 · propStall:5194 · propBreak:5201 · propFix:5208 · droneBatAdd:5215 · lightningBolt:5218
startRain:5229 · stopRain:5243 · smashGlass:5245 · awardGlass:5256 · neededLetter:5273 · openDoor:5288
raceStartRun:5308 · raceStop:5315 · gateHighlight:5333 · renderRaceHud:5340 · tickDrone:5349 · nearMissTick:5491
showNearMiss:5515 · awardDaredevil:5526 · comboCheer:5543 · comboFlash:5559 · driveCell:5568 · nearestStreet:5574
collideCar:5584 · tlDotY:5615 · tlSet:5619 · driveArms:5636 · tlTick:5648 · TL_GREEN:5692
tlRedDur:5694 · tlightPhase:5695 · buildTrafficLights:5702 · rlTick:5754 · cellDrivable:5786 · cellCenter:5787
losClear:5789 · nearestDrivableCell:5799 · routeGrid:5808 · pickGpsTarget:5861 · gpsSpeak:5873 · NAVLINE_W:5892
navLineEnsure:5893 · navLineHide:5903 · navLineUpdate:5904 · tickGps:5931 · tickDrive:6007 · drawCarDial:6183
drawCarGauges:6213 · RADIO_RECT:6241 · CAR_RADIO_RECT:6243 · carRadioRect:6249 · radioLayout:6251 · radioSetHint:6274
renderRadioList:6280 · radioToggleList:6290 · drawRadioViz:6295 · radioTick:6313 · BOBBLE_FOOT:6326 · BOBBLE_H:6327
BOBBLE_ASPECT:6328 · BOB_OMEGA:6331 · BOB_PITCH_FORCE:6333 · BOBBLE_SKINS:6335 · bobbleSetAvatar:6342 · bobbleLayout:6349
bobbleTick:6362 · bobblePoke:6387 · bobbleApplySkin:6404 · dollOwned:6414 · openDollPicker:6415 · carStartShow:6452
showLawInfo:6470 · lawNotice:6492 · driveFineSettle:6502 · HELI_PHASES:6681 · heliStartPhase:6688 · heliFloorAt:6695
SOFT_TIERS:6705 · softLandBonus:6707 · awardPerfLand:6720 · setHeliLight:6739 · MAIL_COIN:6758 · mailStart:6760
mailStop:6783 · mailTick:6784 · FOOT_EYE:6803 · doorSlideSfx:6809 · doorLerp:6832 · entLerp:6840
footStepSfx:6850 · WRING_COIN:6871 · festivalPaint:6875 · dustTexture:6887 · dustBurst:6896 · dustTick:6910
HELI_GLB_URL:6931 · HELI_GLB_TEX_BLUE:6933 · HELI_GLB_ROTOR:6935 · HELI_GLB_TROTOR:6936 · heliGlbEnsure:6938 · heliMatBlueGet:6956
heliGlbAssemble:6969 · heliNavTick:7008 · peerRotorStop:7015 · peerRotorTick:7021 · heliCrashSfx:7040 · heliMeshBuild:7068
heliMeshBuildLegacy:7079 · buildHeliFoot:7209 · footFloorAt:7325 · insideTerm:7332 · inDoorZone:7333 · footHint:7337
setFootBtns:7338 · liftStart:7343 · beginRide:7354 · endRide:7377 · beginWing:7388 · awardAirLetter:7401
paxChoiceShow:7420 · paxChoiceHide:7446 · pilotShipMesh:7450 · beginPilot:7451 · endPilot:7483 · drawCabinWindow:7505
tickHeliFoot:7529 · tickHeli:7738 · CP_NAT:7989 · CP_GAUGES:7990 · SEAT_LABEL:8003 · SEAT_P_FULL:8004
SEAT_ZOOM:8005 · DASH_OFF_Y:8006 · DASH_DROP:8007 · setSeat:8009 · layoutCockpit:8021 · WIPER:8060
WIPER_SPD:8061 · sunUpdate:8067 · HELI_FOG_N0:8078 · fogUpdate:8082 · adGlowPulse:8128 · RAIN_MAX:8137
VISOR_Y:8138 · RAIN_MIN:8139 · RAIN_DUR:8140 · DROP_ZONE:8144 · addDrop:8145 · tickDrops:8153
WIPE_R:8169 · wipeDrops:8170 · setWiper:8186 · setVisor:8192 · rainTick:8198 · drawBlade:8210
drawGlass:8224 · drawBellyCam:8291 · drawBellyHud:8314 · drawLandingTargets:8360 · VS_HARD:8430 · drawDescentBar:8431
heliShake:8480 · cpNeedle:8491 · drawGauges:8508 · XF_START:8555 · PRELOAD_WAIT:8556 · ALT_QUIET_FROM:8558
ALT_MAX_DAMP:8559 · ALT_LP_MIN:8560 · ECHO_NEAR:8561 · WIND_FULL_SPD:8562 · SHUTDOWN_SEC:8563 · PAN_MAX:8565
OD_RPM:8566 · SHAKE_RPM:8567 · SHAKE_HIT:8568 · soccerLetterPos:9047 · letterNeeded:9051 · soccerNeededSet:9056
soccerTileGeo:9062 · soccerGoldTexture:9064 · makeSoccerTile:9081 · soccerRefreshSkins:9090 · soccerBuildTargets:9097 · soccerRetarget:9106
soccerCoinPop:9118 · soccerFieldTexture:9130 · soccerNetTexture:9141 · soccerCrowdTexture:9148 · soccerBallMat:9156 · buildSoccerGoal:9164
buildStands:9175 · soccerNumTex:9183 · makeSoccerPlayer:9193 · soccerResetBall:9217 · soccerKick:9222 · soccerCheer:9230
updateSoccerGuide:9231 · soccerCamera:9245 · tickSoccer:9260 · soccerKitShow:9336 · soccerKitGo:9351 · emojiSprite:9402
makeAlien:9407 · startWave:9440 · waveSpawnFill:9451 · waveComplete:9460 · updateWaveHud:9470 · checkMechaBossBadge:9472
alienSpawnPos:9481 · removeAlien:9486 · mechaHudWord:9491 · setMechaHudSkin:9499 · mechaComboPop:9511 · mechaShielded:9516
mechaDamageFx:9518 · mechaHitByAlien:9523 · spawnAlienShot:9529 · removeAlienShot:9539 · tickAlienShots:9544 · spawnPowerup:9556
removePowerup:9569 · collectPowerup:9574 · tickPowerups:9581 · updateMechaHud:9590 · mechaTracer:9630 · mechaFire:9639
explodeAlien:9676 · tickMecha:9706 · loop:9762 · grabShot:9789 · savePhoto:9800 · clearEntities:9812
INTRO_KEY:9826 · introSeenObj:9827 · introSeen:9828 · markIntroSeen:9829 · INTRO:9830 · showIntro:9895
closeIntro:9920 · beginPlay:9926 · start:9928 · exitWorld:10108 · mechaRecapLine:10153

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

## js/lobby.js (52 บรรทัด · 3 รายการ)
PANEL_TITLES:9 · openPanel:20 · closePanel:28

## js/lobby3d.js (780 บรรทัด · 0 รายการ)

## js/main.js (158 บรรทัด · 2 รายการ)
syncMusicBtn:79 · bootGame:113

## js/moto3d.js (1,832 บรรทัด · 102 รายการ)
### 🗂️ สารบัญโซน js/moto3d.js (Read/Edit เฉพาะช่วง)
- 144-430 DOM เครื่องเกมพกพา (สร้างครั้งเดียว · CSS ฉีดเอง ไม่แตะ style.css)
- 431-671 ถนนจากแผนที่จริง → geometry + ตารางแฮชชนถนน
- 672-1006 ฉาก: พื้น/โรงเรียน/ป้ายหมู่บ้าน/ต้นไม้/เมฆ/บ้านหมู่บ้าน
- 1007-1059 🐕 รอบ 312: หมาวิ่งตัดถนน — โผล่ข้างถนนข้างหน้ารถ วิ่งตัดผ่านเร็ว · ชน = ปรับ 500 เหรียญ
- 1060-1170 🪙 รอบ 317: เหรียญบนถนน — pool ลอยเหนือเลนซ้าย รีไซเคิลรอบผู้เล่นตลอด
- 1171-1203 🏍️🚗 รอบ 317: โมเดลยานพาหนะ 3D (ใช้ทั้งรถเราเองโหมด car และรถ/มอไซค์ของเพื่อน)
- 1204-1363 🧑‍🤝‍🧑 รอบ 317: เพื่อนในแผนที่เดียวกัน (/world/moto/<uid>)
- 1364-1506 คำศัพท์ + ตัวอักษรบนถนน
- 1507-1718 สร้างโลกครั้งเดียว + ลูปเกม
- 1719-1832 เข้า/ออกโลก
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
netReady:1210 · netJoin:1214 · netSend:1227 · sendChat:1244 · showPeerBubble:1254 · removePeerBubble:1261
renderBoard:1268 · peerColor:1285 · buildPeer:1289 · onPeer:1298 · dropPeer:1326 · netLeave:1333
peerTick:1339 · spawnSlot:1350 · pickWord:1367 · spawnLetters:1377 · renderWordHud:1392 · fitWord:1400
collectTick:1407 · completeWord:1426 · relocTick:1451 · gpsTick:1466 · miniTick:1475 · build:1510
applyVehicleUi:1544 · fit:1562 · tick:1570 · frame:1578 · start:1722 · exitWorld:1773

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

## js/state.js (971 บรรทัด · 83 รายการ)
STORAGE_KEY:6 · CURE_COST:8 · HUNGRY_SICK_MS:9 · MEAL_HOUR:11 · MEAL_FULL:12 · SLEEP_FROM_HOUR:13
SLEEP_SICK_HOUR:14 · WAKE_HOUR:15 · DINNER_COST:16 · TOXIN_FULL:18 · DETOX_COST:19 · FOODQUIZ_Q:21
FOODQUIZ_COIN:22 · FOODQUIZ_BONUS:23 · SHAPE_JUNK_MEALS:25 · SHAPE_CLEAN_MEALS:26 · SHAPE_MISS_MEALS:27 · SHAPE_EXP_BONUS:28
HEAT_SICK_MS:29 · THIRST_SICK_MS:30 · DEFAULT_STATE:32 · FEED_CATS:155 · SLOT_MS:166 · currentSlotStart:167
nextSlotStart:173 · mealDayKey:175 · nightKeyOf:177 · newPet:183 · loadState:208 · saveState:420
activePet:427 · petStage:428 · isAdult:433 · abilityOn:434 · hasPetType:435 · todayStr:438
dailyTick:442 · addCoins:445 · QUEST_POOL:465 · QUEST_PER_DAY:475 · questsToday:476 · questTick:483
questEvent:487 · assetValue:523 · netWorth:548 · assetCount:550 · refreshRank:567 · heatProtected:583
rainProtected:587 · petHungry:590 · petShapeOf:594 · updatePetShape:600 · shapeMealDone:607 · heatPct:617
ymStr:626 · billOutstanding:630 · UTILITIES:637 · HOME_UTILITIES:643 · homeDecayed:645 · billTick:648
myCar:717 · carLoanDue:722 · carLoanOverdue:727 · carLoanPayable:732 · carLoanPay:739 · compTick:752
ONLINE_RATE:766 · onlineEarnActive:767 · onlineEarnTick:771 · onlineEarnFlush:782 · marketTick:792 · addCraft:816
ORDER_MAX:835 · ORDER_LIFE_MS:836 · ORDER_GAP_MIN_MS:837 · ORDER_GAP_SPAN_MS:838 · ORDER_TIER_WEIGHT:839 · newOrder:840
orderTick:853 · careTick:861 · expNeed:942 · addExp:947 · addRP:967

## js/ui.js (6,897 บรรทัด · 277 รายการ)
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
- 2756-3296 📖 Dictionary ค้นหาคำศัพท์ (รอบ 254 ผู้ใช้สั่ง 16 ก.ค. 2026)
- 3297-3340 การนอน (คิว 7725691507 ข้อ 1)
- 3341-3719 ให้อาหาร (ระบบมื้อเย็น 18:00 + ความอิ่มสะสม — ข้อ 2+3)
- 3720-3801 🛡️ ควิซอาหารปลอดภัย (ต่อยอดข้อ 5.1)
- 3802-3865 ร้านค้าไอเทมแต่งตัว (ล็อกช่วงแรกเกิด/ไข่ ตามกติกาใหม่)
- 3866-4053 ที่พัก (หลบแดด/หลบฝน) + เครื่องปรับอากาศ
- 4054-4171 บิลสาธารณูปโภค (ค่าไฟ/ค่าน้ำ — เครื่องยนต์อยู่ใน state.js: UTILITIES/billTick)
- 4172-4254 การ์ดมือถือ (ข้อ 7): ซื้อ 10,000 ขายคืน 6,000
- 4255-4265 การ์ดคอมพิวเตอร์ (ข้อ 11): ซื้อ 50,000 ขายคืน 30,000
- 4266-4421 item 8: โบนัสออนไลน์ +0.01 เหรียญ/วิ ฟรีทุกคนที่เปิดเกมออนไลน์อยู่
- 4422-4629 🎫 การ์ดตั๋วโลกผจญภัย (คิว 7725691507 ข้อ 7)
- 4630-4711 🎃 การ์ดตั๋วโลกผีสิงกลางคืน (ต่อยอดข้อ 8 · ผู้ใช้เคาะ 7 ก.ค.)
- 4712-4815 🚁 การ์ดตั๋วโลกเฮลิคอปเตอร์ Bell (รอบ 52)
- 4816-4915 🛸 การ์ดตั๋วโลกโดรน FPV Racing (รอบ 85) — ซื้อได้เมื่อมีตั๋วเฮลิคอปเตอร์
- 4916-5106 🚗 การ์ดตั๋วโลกขับรถกำแพงเพชร (รอบ 113) — ซื้อได้เมื่อมีตั๋วโดรน FPV
- 5107-5199 ⚽ การ์ดตั๋วโลกสนามฟุตบอล (รอบ 196) — ซื้อได้เมื่อมีตั๋วขับรถ
- 5200-5295 🏍️ การ์ดตั๋วโลกมอเตอร์ไซค์บ้านโพธิ์สวัสดิ์ (รอบ 293) — ซื้อได้เมื่อมีตั๋วขับรถ
- 5296-5446 🌍 ปุ่มลัดเข้าโลก 3D ในรางเมนูซ้าย (ผู้ใช้สั่ง 9 ก.ค. 2026)
- 5447-5604 การ์ดสวนผลไม้ (ข้อ 12): ซื้อต้นไม้ปลูกได้ไม่จำกัด แต่ละต้นออกผล
- 5605-5614 โรงงานผลิตสินค้า 🏭 + ตลาดขายต่อ (แนวคิดใหม่ 5 ก.ค. 2026)
- 5615-5637 โรงงานผลิต (แผง 🏭) — แยกออกจากตลาด (ผู้ใช้สั่ง 6 ก.ค. 2026)
- 5638-5788 ตลาดขายสินค้า (แผง 🏪) — แยกออกจากโรงงาน
- 5789-6692 🚗 รอบ 131: หมวดยานพาหนะ — โชว์รูมรถ 10 คัน (แคตตาล็อก 5 ช่อง/แถว)
- 6693-6753 ร้านสัตว์เลี้ยง (ซื้อเพิ่มได้ ไม่ลบตัวเดิม)
- 6754-6790 เลเวลอัพ (รายตัว)
- 6791-6860 สถิติผลการเรียนรู้
- 6861-6897 item 4: การ์ดสรุปส่งครู — ใบเดียวจบ ชื่อ/วัน-เวลา/เหรียญวันนี้/แรงค์/สอบล่าสุด
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
dictSearch:2794 · dictTapWords:2809 · dictEntryHTML:2813 · openDictOverlay:2824 · renderDashboard:2908 · sleepBtnHTML:3302
sleepHintHTML:3309 · sleepAllPets:3320 · wakeAllPets:3333 · feedPet:3344 · openFoodMenu:3358 · feedWith:3429
AVATAR_UI:3459 · playerAvatarHTML:3462 · SHAPE_UI:3468 · showFeedResult:3477 · curePet:3518 · heartsFx:3541
PAT_HOLD_MS:3564 · PAT_EXP:3565 · bindPetTap:3566 · petBounce:3584 · petMood:3590 · shortPatPet:3597
longPatPet:3605 · patCalendarHTML:3625 · patStreakTick:3653 · cureCelebrateFx:3679 · railCureClick:3690 · detoxPet:3702
openFoodQuiz:3725 · renderShop:3805 · homeVisualHTML:3869 · showHomeRuined:3883 · showCutNotice:3904 · renderHomeCard:3922
payMaint:4006 · trashBillUI:4022 · payTrash:4039 · UTILITY_UI:4058 · utilityBillUI:4107 · payUtility:4132
buyUtilityFix:4158 · renderPhoneCard:4176 · buyPhone:4216 · sellPhone:4238 · compLiveTotal:4259 · onlineLiveTotal:4270
renderOnlineEarnPill:4275 · openPillInfo:4298 · renderComputerCard:4345 · buyComputer:4380 · sellComputer:4403 · soldCount:4429
soldBadge:4430 · renderTicketCard:4435 · loadScriptOnce:4491 · enterAdventure3D:4507 · pickAdvMap:4532 · enterHaunted3D:4567
advHealClick:4589 · buyTicket:4609 · renderHauntCard:4635 · buyHauntTicket:4690 · renderHeliCard:4717 · buyHeliTicket:4775
enterHeli3D:4798 · renderDroneCard:4820 · buyDroneTicket:4875 · enterDrone3D:4898 · renderDriveCard:4921 · buyDriveTicket:4995
enterDrive3D:5018 · pickDriveMap:5053 · enterMotoMapAsCar:5089 · renderSoccerCard:5111 · buySoccerTicket:5159 · enterSoccer3D:5182
renderMotoCard:5205 · buyMotoTicket:5254 · enterMoto3D:5277 · WORLD3D:5302 · gotoRobotShop:5312 · scrollShopCardIntoView:5317
railWorldClick:5320 · renderRailWorlds:5341 · tinvNoticeHTML:5400 · openTinvPicker:5408 · fruitCountdown:5452 · renderFarmCard:5464
renderFarmClock:5534 · buyFruit:5550 · sellFruit:5570 · sellAllFruit:5587 · collectImg:5613 · renderFactoryCard:5619
renderMarketCard:5642 · updateWishBadge:5698 · openWishlistDialog:5709 · bindStripArrows:5754 · renderMarketBrowse:5766 · carImg:5795
renderVehicleShop:5796 · CS_CYCLE_MS:5847 · carInteriorImg:5848 · carStatHtml:5850 · renderCarShowroom:5857 · csShowBig:5883
csInit:5910 · RS_CYCLE_MS:5933 · robotImg:5934 · renderRobotShop:5935 · rsShowBig:5957 · rsInit:5978
buyRobot:5997 · enterMecha3D:6019 · pickMechaRobot:6040 · pickDriveCar:6072 · openCarBuyDialog:6115 · buyCarInsurance:6176
payCarLoanMonthly:6195 · payCarLoanFull:6207 · carDriveBlock:6226 · gotoVehicleShop:6231 · gotoMyStock:6236 · showNeedCarDialog:6242
craftDiscount:6254 · renderFactory:6257 · renderOrdersUI:6319 · startProduce:6338 · buyCollectible:6366 · cancelProduce:6394
deliverOrder:6408 · renderOrderClock:6425 · renderCollectMine:6435 · openListDialog:6477 · cancelListing:6530 · buyMarketItem:6553
showCollectReveal:6580 · buyAC:6618 · openHomeShop:6637 · renderPetShop:6696 · showLevelUp:6757 · renderStats:6794
showTeacherCard:6865

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

## css/style.css (1,707 บรรทัด · 454 selector)
:root:5 · *:15 · html:16,21 · input:25 · body:29 · #app:35
.screen:38,39 · h1:42 · .subtitle:43 · .egg-grid:46,63 · .egg-card:47,52,53,54(+2) · .pet-price:57,61
.egg:65,71,75 · .d1:76 · .basket:79,80,85,91(+5) · .basket-dog:89,102,103,104 · .basket-cat:90,105,106,107 · .egg-dragon:110
.topbar:125 · .topbar-coins:126 · .coin-pill:127,138,142,147(+2) · .coin-ic:134 · .no-anim:148,538,1424,1664(+2) · .net-coin:150
.q-row:162,163,164,168(+1) · .q-emoji:165 · .q-mid:166 · .q-name:167 · .q-bar:169,170 · .q-right:172,173
.q-foot:174,175 · .tc-open:178,179 · .tc-wrap:180 · .tc-card:181 · .tc-head:185 · .tc-sub:189
.tc-name:190,191 · .tc-badges:192 · .tc-when:193 · .tc-row:194,198 · .tc-pass:199 · .tc-try:200
.tc-sign:201 · .tc-hint:202 · .tc-close:203 · .mb-seller:209 · .mb-buy:210 · .wl-open:213,218
.strip-wrap:221,239 · .strip-x:222,229,230,242(+1) · .strip-arrow:231,237,238 · .craft-toolbar:245,246 · .fc-cols:248,249 · .wl-box:283
.wl-head:284,285,286 · .wl-grid:288 · .wl-it:293,297,298,299 · .wl-emoji:300 · .wl-name:301 · .wl-h:302
.hq-card:303,384 · .icon-btn:304 · #settings-badge:310 · .badge-pop:313 · .attn-box:315,316,333 · .attn-list:317
.attn-row:318,323 · .attn-ico:324 · .attn-txt:325,326 · .attn-go:327 · .attn-total:328,332 · .rain-banner:336,341,342,343
.rain-row:345 · .rain-icon:346 · .rain-track:347 · .rain-fill:351 · .rain-note:352 · .comp-earn:355,367,371,372(+1)
.comp-earn-label:360 · .comp-earn-num:361,365 · .comp-earn-sub:366 · .farm-sub:378 · .farm-cols:380,381 · .farm-shop:383
.farm-hq:385,386,387 · .farm-yield:388,389 · .farm-tree:390,395,400,404 · .farm-tree-emoji:399 · .farm-tree-name:402 · .farm-tree-status:403
.farm-grow-badge:405 · .farm-sell-btn:426,431 · .farm-sellall-btn:432,438,439 · .rank-card:442 · .rank-badge-wrap:447 · .rank-badge-img:448
.rank-badge-emoji:449 · .rank-body:450 · .rank-name:451,452 · .rank-bar:453 · .rank-fill:454 · .rank-text:455
.rankup-overlay:458 · .rankup-rays:464 · .rankup-content:480 · .rankup-title:485 · .rankup-badge:490,503 · .rankup-badge-img:502
.rankup-name:504 · .rankup-en:508 · .rankup-sub:512 · .rankup-btn:513,520,521 · .cr-btn-row:523 · .rankup-btn-2:524,525
.thunder-fx:528 · .quake:529 · .pet-tabs:541 · .pet-tab:542,548,549 · .pet-card:551 · .pet-stage:556
.aura:557,563 · .sp1:564 · .pet-wrap:567 · .pet-emoji:568 · .pet-img:569 · .egg-img:570
.feed-pet:571,717 · .pet-baby:572 · .pet-adult:573 · .pet-egg-stage:575 · .wear:577 · .wear-head:578
.wear-face:579 · .wear-neck:580 · .pet-name:582 · .stage-label:583 · .level-row:584 · .level-badge:585
.exp-bar:589 · .exp-fill:590 · .exp-text:591 · .ability-box:593,597 · .hunger-bar:600 · .hunger-fill:601,602,603
.food-item:609,651,655,656(+6) · .hunger-text:613 · .heat-bar:616 · .heat-fill:617 · .heat-text:618,619,620 · .care-row:622
.care-btn:623,627,630 · .btn-feed:628 · .btn-cure:629 · .sick-banner:631 · .pet-sick:635 · .pet-asleep:638
.sleep-badge:639 · .btn-sleep:641 · .dinner-btn:644 · .food-box:648,649 · .food-grid:650 · .fav-tag:670
.fd-exp:674 · .food-sec:676 · .food-sec-human:680 · .bad-tag:682 · .fd-toxin:686 · .fd-safe:687
.fq-box:690,691 · .fq-progress:692 · .fq-pair:693,694 · .fq-ask:695 · .fq-why:696 · .fq-btns:700,701,705
.fq-yes:706 · .fq-no:707 · .fq-next:708 · .food-cancel:709 · .feed-box:715,716 · .feed-gain:718
.sick-badge:722 · .big-btn:728,734,955,956(+6) · .shop-card:737 · .shop-title:741 · .shop-grid:742 · .shop-item:743,747,748,749(+4)
.it-tag:754 · .tag-wear:755 · .lock-banner:757 · .home-current:763,768,769 · .home-img:770 · .home-emoji:771
.home-btn:772,794 · .home-layout:774 · .home-pic-col:775,781 · .home-img-big:779 · .home-info-col:782,784,787,788 · .home-name-row:785
.home-desc-row:786 · .home-shop-box:796,797 · .home-list:798 · .home-option:799,803,804,805(+1) · .home-opt-img:806 · .home-opt-body:808,809
.home-price:810 · .reset-link:815 · .login-card:821 · .login-pets:822 · .login-status:823 · .google-btn:824,830,831
.login-note:832 · .install-btn:835,841,842 · .install-guide-overlay:845 · .install-guide:849,853,856 · .install-steps:854,855 · .install-guide-close:857
.login-account:862 · .register-card:865,869,875,879 · .reg-safety:871,873,874 · .student-chip:880 · .clock-chip:884 · .online-count:890
.online-row:897,901,902 · .online-dot:906 · .online-name:911 · .online-act:915 · .online-live:919 · .online-note:923
.lb-empty:926 · .lb-list:927 · .lb-row:928,932,933 · .lb-rank:937 · .lb-name:939,943 · .lb-coins:947
.lb-hint:949 · .lb-badgeline:950 · .lb-tabs:952 · .lb-tab:953,954 · .tinv-note:965 · .cat-card:971,992,1071,1076
.cat-head:975 · .cat-emoji:976 · .cat-name:977 · .cat-pass:978 · .cat-info:979 · .cat-btns:980
.cat-btn:981,985,986,987(+2) · .band-sec-head:990,991 · .band-mine-tag:993 · .bsp-box:996,999 · .bsp-head:1000 · .bsp-prog:1001
.bsp-retake:1003,1006 · .rts-box:1009 · .rts-head:1011 · .rts-sets:1012 · .rts-set:1013,1014,1015 · .rts-sub:1016
.rts-words:1017 · .rts-word:1018,1020,1021 · .rts-foot:1022 · .rts-okbtn:1023,1025 · .bsp-grid:1026 · .bsp-chip:1027,1030,1031,1032(+1)
.bsp-num:1034 · .bsp-best:1035 · .bsp-tick:1036 · .bsp-foot:1037 · .vb-box:1040,1042 · .vb-head:1043
.vb-total:1044 · .vb-quizbtn:1045,1047 · .vb-tabs:1048 · .vb-tab:1049,1051,1052 · .vb-words:1053 · .vb-word:1054,1057,1058,1059(+3)
.vb-empty:1063 · .vb-foot:1064 · .vb-pg:1065,1067 · #vb-pginfo:1068 · .vb-hint:1069 · .band-lock:1077
.offline-btn:1078,1079 · .quiz-progress:1084 · .quiz-phon:1085 · #quiz-extra:1086,1088,1089,1090 · .quiz-word-card:1091 · .quiz-speak:1096
.quiz-choice:1097,1102,1103,1104 · .quiz-score-pill:1105 · .stats-card:1108 · .stats-title:1112,1545 · .stats-row:1113,1114,1115,1116 · .game-top:1119
.back-btn:1120 · .combo-pill:1124 · .timer-wrap:1128 · .timer-fill:1129,1130 · .board-label:1132 · .card-grid:1133
.word-card:1134,1140,1141,1142(+3) · .hint-btn:1148,1153 · .game-endless-note:1156,1161,1163,1167(+6) · .report-btn:1188,1193 · .report-box:1196 · .report-close:1197
.rp-head:1201 · .rp-avatar:1202,1203 · .rp-title:1204 · .rp-sub:1205 · .rp-levelcard:1207 · .rp-level-top:1211
.rp-bar:1212 · .rp-bar-fill:1213 · .rp-level-note:1214,1215 · .rp-grid:1217 · .rp-stat:1218 · .rp-ic:1221
.rp-num:1222 · .rp-lbl:1223 · .rp-section:1225 · .rp-h3:1226 · .rp-badge-mini:1227 · .rp-row:1228,1229,1230
.rp-empty:1231 · .rp-badges:1232 · .rp-badge:1233 · .rp-tline:1236 · .rp-tl-head:1237,1238 · .rp-tl-ems:1239
.rp-em:1240,1241 · .rp-tl-note:1242,1243 · .rp-crown:1245,1246 · .rp-wtitle:1248 · .rp-wnow:1249,1250 · .rp-wgraph:1251
.rp-wcol:1252 · .rp-wval:1253 · .rp-wbar:1254,1255 · .rp-wlbl:1256 · .rp-cheer:1258 · .report-ok:1262
.summary-box:1265,1316,1320,1321(+2) · .sm-burst:1266 · .sm-title:1268 · .sm-line:1269 · .sm-coin:1270 · .sm-matches:1276,1277
.confetti:1279 · .sm-badge:1286 · .sm-badge-all:1290 · .badge-celebrate-overlay:1293,1306 · .badge-celebrate:1297 · .bc-emoji:1303
.bc-title:1304 · .bc-sub:1305 · .sm-cheer:1310 · .sm-streak:1311,1312 · .sm-sick:1313 · .sm-btns:1314
.float-fx:1326 · .toast:1333 · .toast-warn:1340,1347,1348,1354 · .toast-clear-all:1356,1363 · .alert-box:1365 · .alert-ok:1366,1371
.settings-box:1373 · .set-row:1374 · .set-hint:1378 · .set-hint-on:1379 · .set-hint-off:1380 · .set-lwrap:1381
.set-label:1382 · .set-desc:1383 · .set-switch:1384,1388,1389,1394(+4) · .set-sw-knob:1390 · .set-sw-txt:1397 · .set-close:1403,1408
.set-help:1409,1414 · .help-box:1416,1417,1422 · .help-item:1418 · .update-banner:1430,1439,1440 · #update-reload:1441 · #update-dismiss:1445
.levelup-overlay:1451 · .levelup-box:1455,1462,1463,1464(+4) · .bill-box:1470,1474,1475 · .tag-off:1476 · .home-decayed-img:1477 · .home-dark-img:1478
.thirst-fill:1479 · .thirst-text:1480,1481 · .toxin-fill:1484 · .toxin-text:1485,1486 · .detox-btn:1487,1492 · .shape-text:1495,1496,1497,1498(+1)
.avatar-pick:1502 · .avatar-opt:1503,1507,1508,1509 · .avatar-chip-img:1513 · .avatar-chip-blk:1515 · .set-avatar-btns:1516 · .avatar-mini:1517,1521
.set-blk-row:1523 · .set-sub2:1524 · .blk-grid:1526 · .blk-mini:1527,1530,1531,1532 · .game-avatar:1535,1536,1537 · .stats-nick:1546
.ticket-owned:1549,1553 · .collect-sub:1558 · .mkt-tabs:1559 · .mkt-tab:1560,1564 · .mkt-filter:1565 · .mkt-row:1569
.mkt-emoji:1573,1574 · .mkt-info:1575,1576 · .mkt-tier-stars:1577 · .mkt-buy:1578,1583,1584 · .mkt-price-lo:1585 · .mkt-price-hi:1586
.mkt-empty:1587 · .collect-grid:1590 · .collect-cell:1591 · .cc-emoji:1592,1593 · .cc-name:1594 · .cc-count:1595
.cc-list-btn:1596,1600 · .mkt-listhead:1601 · .mkt-listing:1602 · .ml-cancel:1606 · .mkt-sold:1612,1613,1614 · .list-dialog:1621,1622,1627
.list-hint:1626 · .collect-reveal-frame:1630,1637 · .collect-reveal-img:1636 · .collect-reveal-stars:1638 · .craft-box:1641 · .craft-head:1642
.craft-bar:1643 · .craft-fill:1644 · .craft-text:1645 · .craft-btn-row:1646,1647 · .craft-go-btn:1649,1655,1656,1659 · .craft-cancel:1667,1671
.mkt-catalog:1674,1675,1676 · .mkt-pager:1679 · .pg-btn:1680,1684,1685 · .pg-mid:1686 · .pg-dots:1687 · .pg-dot:1688,1689
.order-head:1690 · .order-row:1691,1696,1698,1700 · .order-deliver:1701,1706 · .order-need:1707
