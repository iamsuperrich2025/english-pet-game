# CODE_MAP.md — แผนที่โค้ด:บรรทัด (เจนอัตโนมัติโดย `tools/gen_code_map.py` — **ห้ามแก้มือ** เดี๋ยวโดนเขียนทับ)

> วิธีใช้: หาชื่อฟังก์ชัน/ค่าคงที่/selector ในไฟล์นี้ (Grep หรือกวาดตา) → `Read` ไฟล์จริง `offset=<บรรทัด>` `limit=40`
> 🗂️ ไฟล์อ้วนมี **สารบัญโซน** (`st-end ชื่อโซน`) — งานทั้งระบบ/โลก 3D: Grep ชื่อโซน → Read/Edit เฉพาะช่วงนั้น **ห้ามอ่านทั้งไฟล์** · เพิ่มระบบใหม่ในไฟล์อ้วนต้องครอบ banner `/* ==== */`+ชื่อโซน (สารบัญเจนเอง)
> css = index `selector:บรรทัดทุกจุดที่ประกาศ` (บั๊ก UI เริ่มหาที่นี่) · เจนใหม่ทุกครั้งที่รัน `python tools/rotate_handoff.py` · อัปเดต: 2026-07-26

## js/adv3d_css.js (1,057 บรรทัด · 0 รายการ)

## js/adv3d_intro.js (70 บรรทัด · 0 รายการ)

## js/adv3d_tex.js (225 บรรทัด · 18 รายการ)
TILE_COLORS:9 · letterTexture:10 · emojiTexture:24 · GHOST_IMG_MAX:36 · measureGhostBox:42 · probeGhostImages:55
whenGhostsReady:67 · ghostTexture:71 · ghostScareSrc:76 · AD_STYLES:84 · adBoardTexture:93 · addAdBillboard:140
ringAds:151 · BUILDING_TINTS:161 · FACADE_ROWS:163 · buildingFacadeTexture:164 · makePeerSprite:188 · bind:221

## js/adventure3d.js (10,694 บรรทัด · 535 รายการ)
### 🗂️ สารบัญโซน js/adventure3d.js (Read/Edit เฉพาะช่วง)
- 1-213 adventure3d.js — โลก 3D First-person 2 โหมด (คิว 7725691507 ข้อ 8 + ต่อยอด)
- 214-277 ⚽ โหมดสนามฟุตบอล (โหมด soccer · รอบ 196) — เล็ง+ชาร์จพลังเตะบอลใส่ป้ายตัวอักษร
- 278-332 🤖 โหมดหุ่นยนต์นักรบ (โหมด mecha · รอบ 199) — มุมมองในหุ่นสูง 5m เดินยิงเอเลี่ยนตัวอักษร
- 333-473 📻 หอบังคับการบิน (รอบ 64 · รอบ 66 เปลี่ยนเป็นอังกฤษล้วนตามผู้ใช้สั่ง)
- 474-494 คำศัพท์ — ตามระดับชั้น + ไม่ซ้ำคำที่ประกอบแล้ว (8.1/8.6) · แยกคลังต่อโหมด
- 495-631 Texture ตัวอักษร / emoji / ป้ายชื่อผู้เล่น (canvas → sprite)
- 632-798 🧱 ตัวละครบล็อก (โลกขับรถ) — เลือกก่อนออกรถ · เพื่อนใน map เห็นเป็นหุ่นบล็อกขับรถบล็อก
- 799-1105 🚙 รอบ 393: รถเพื่อนในโลกขับรถ = โมเดลจริง img/models/car_01.glb (ผู้ใช้สั่ง)
- 1106-1258 สร้างฉาก static ครั้งเดียวต่อโหมด
- 1259-1576 🚗 เมืองกำแพงเพชรจริง (โหมด drive) — ข้อมูล OpenStreetMap ใน js/data/city_kpp.js
- 1577-1591 🌅 ท้องฟ้าภาพจริง (รอบ 203) — ใส่ภาพ panorama 360° (equirectangular 2:1) เป็นฉากหลังท้องฟ้า
- 1592-1975 🧱 เทกซ์เจอร์ภาพจริง (รอบ 323) — วางไฟล์ `img/tex/<key>.jpg` (หรือ .png) แล้วแปะทับพื้นผิวทันที
- 1976-2075 ตัวอักษรในโลก (8.2)
- 2076-2130 🔠🪙 เก็บตัวอักษร 1 ตัว = ได้ 1 เหรียญ (รอบ 345)
- 2131-2189 ประกอบคำอัตโนมัติเมื่อมีตัวอักษรครบ (8.1/8.4)
- 2190-2284 โหมด adv: monsters ยิงสู้ได้ (สเปกเดิม 8.5)
- 2285-2465 โหมด haunt: ผีโผล่ 3 วิ → ย้ายที่ · สู้ไม่ได้ · โดนจับ = game over
- 2466-2617 เสียงหลอนโหมดผีสิง — สังเคราะห์ Web Audio (ปลอดลิขสิทธิ์ 100%)
- 2618-2935 Multiplayer — ผู้เล่นอื่นใน map เดียวกัน (สไตล์ Roblox)
- 2936-3135 Voice chat ใน map — WebRTC P2P mesh (เสียงวิ่งตรงระหว่างเครื่อง)
- 3136-3222 🏁 พิธีประกาศแชมป์ (ครูกด "จบรอบแข่ง") — /class/<map>/podium
- 3223-3415 HUD
- 3416-4028 DOM overlay + CSS (สร้างครั้งเดียว — self-contained ไม่แตะ style.css)
- 4029-4154 Input — เมาส์+คีย์บอร์ด และจอสัมผัส (มือถือ landscape)
- 4155-4159 🚁 โหมดเฮลิคอปเตอร์ Bell — ฟิสิกส์บินแบบอาร์เคด (สไตล์ Helicopter Flight Pilot)
- 4160-4551 🛸 โดรน FPV (โหมด drone) — บินเร็ว/คล่อง ลอดหน้าต่างเข้าตึกร้าง เก็บตัวอักษรในห้อง
- 4552-4674 🚗 โหมดขับรถเมืองกำแพงเพชร — ฟิสิกส์รถอาร์เคด (bicycle model)
- 4675-4768 🚦 รอบ 133: ไฟจราจรจริงที่ทางแยกใหญ่ + ฝ่าไฟแดงโดนใบสั่ง ม.22
- 4769-5196 🧭 GPS นำทาง (โหมด drive) — เลือกตัวอักษรเป้าหมาย + เส้นทางตามถนนจริง (A*) + เสียงอังกฤษเลี้ยว
- 5197-5255 🎛️ เข็มหน้าปัดวิ่งจริง (สปีด 0-180 + วัดรอบ 0-8×1000) — วาดทับวงเกจของภาพ dash.png
- 5256-5340 🎵 รอบ 181: วิทยุในรถ — จอ head-unit กลางคอนโซล (visualizer + เลือกเพลง 3 โหมด)
- 5341-5468 🪆 รอบ 191: ตุ๊กตาดุ๊กดิ๊กหน้ารถ — รูปตัวละครที่ผู้เล่นเลือก (blkN.png)
- 5469-5772 🚔 รอบ 128: แผงเตรียมออกรถ + กฎหมายจราจร + ใบสั่ง
- 5773-5815 🛩️📦 ภารกิจไปรษณีย์กลางคืน (รอบ 353) — เฉพาะช่วงฟ้ามืด (heliNight>.5)
- 5816-7003 🚶🛗🚁🪂 โหมดเดินเท้าในเมืองเฮลิฯ (รอบ 354 — ผู้ใช้สั่ง)
- 7004-7077 🎛️ หน้าปัดเข็มขยับจริง (รอบ 61) — วาดสดทุกเฟรมจากค่าการบินจริง
- 7078-7347 🌧️☀️ ชั้นบนกระจก: ที่ปัดน้ำฝน + แสงแดดสาด (รอบ 346)
- 7348-7752 🔊🌧️ เสียงที่ปัดน้ำฝน (รอบ 537) — สังเคราะห์ล้วน ไม่มีไฟล์เสียง
- 7753-7822 📹 กล้องใต้ท้องเครื่อง (belly cam) — รอบ 348
- 7823-7894 🎯 วงเป้าลงจอด (รอบ 349) — ไฮไลต์ดาดฟ้าที่มีตัวอักษร ให้รู้ว่าควรร่อนลงตรงไหน
- 7895-8510 📏 แถบเตือนความเร็วดิ่ง (รอบ 349) — ลงเร็วเกินกรอบกล้องกะพริบแดง สอนให้ร่อนลงนุ่มๆ
- 8511-8513 Loop หลัก
- 8514-9740 ⚽ โหมดสนามฟุตบอล — ฟิสิกส์บอล + เล็ง + ชาร์จพลัง + กล้อง 1st/3rd + ชุดนักเตะ
- 9741-10188 🤖 โหมดหุ่นยนต์นักรบ — เดินยิงเอเลี่ยนตัวอักษร (ต้องยิงเรียงลำดับในคำ)
- 10189-10201 เข้า/ออกโลก
- 10202-10694 ❓ การ์ด "วิธีเล่น" ตอนเข้าโลกครั้งแรก (จำแยกต่อโลกใน localStorage — ไม่แตะ state.js)
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
ATC:351 · CHAT_MAX:470 · doneList:477 · wordPool:478 · pickWords:491 · adRenterActive:503
FACADE_ROWS:510 · adsFetch:516 · adsWatch:528 · adsStop:535 · adsChanged:536 · adRentBuy:547
heliMusicTick:570 · AD_FLYBY_COIN:574 · adFlybyTick:576 · adShopOpen:595 · adShopRender:609 · BLOCK_AVATARS:638
blkGeo:649 · blkMat:650 · blkCyl:651 · blkFaceMat:653 · makeBlockFigure:668 · makeBlockCar:708
blkNameSprite:753 · makeBlockPeer:766 · makeBlockWalkPeer:787 · disposeBlockPeer:795 · CAR_GLB_URL:806 · CAR_GLB_LEN:807
carSplitWheel:811 · carGlbEnsure:838 · carMatGet:857 · carGlbBuild:873 · carAvCode:922 · driveCamToggle:929
SKID_N:948 · skidGeomGet:950 · skidDrop:955 · skidTick:969 · blkBuildThumbs:979 · blkBuildPicker:997
pickBlockAvatar:1042 · bubbleSprite:1065 · showPeerBubble:1092 · removePeerBubble:1100 · concreteTexture:1110 · brokenWindowTexture:1127
intactGlassTexture:1143 · chargeIconTexture:1161 · rustyDoorTexture:1170 · dAddBox:1184 · buildAbandoned:1191 · makeNameSprite:1264
flatGeom:1277 · flatGeomUV:1286 · buildDriveCity:1296 · SKY_IMG:1582 · applySky:1583 · applyTex:1598
buildScene:1621 · randPos:1979 · randRoadPos:1987 · spawnLetter:1999 · spawnLettersForWord:2030 · ensureCoverage:2032
relocateLetters:2045 · removeLetter:2070 · LETTER_COIN:2081 · pickUpLetter:2082 · letterPop:2096 · letterChime:2114
tryCompleteWords:2134 · completeWord:2148 · spawnMonster:2193 · killMonster:2202 · tickMonsters:2210 · damagePlayer:2232
shoot:2248 · tickShots:2262 · spawnGhost:2288 · GHOST_STYLE:2297 · GHOST_H_DEFAULT:2298 · applyGhostSize:2299
respawnGhost:2308 · tickGhosts:2324 · sessionRecapHtml:2370 · hauntRunSec:2377 · fmtSurv:2378 · hauntSurviveFinish:2379
tickSurvive:2389 · renderHearts:2402 · ghostHit:2411 · caught:2433 · knockedOut:2459 · netReady:2623
netJoin:2627 · sendPos:2640 · sendChat:2686 · toggleChatBox:2700 · onPeerData:2710 · disposeHeliMesh:2796
removePeer:2801 · netLeave:2816 · tickPeers:2824 · RTC_CFG:2944 · tinvLinked:2945 · partyWord:2952
syncPartyWord:2965 · updateVoiceBtns:3117 · PODIUM_BONUS:3142 · podiumJoin:3144 · podiumLeave:3155 · endRound:3156
showPodium:3167 · tinvCheck:3207 · showBanner:3227 · renderHudTop:3233 · renderHudWords:3238 · renderHudInv:3248
ddTierFromName:3255 · renderBoard:3257 · drawBigMap:3281 · openBigMap:3336 · closeBigMap:3344 · drawMinimap:3349
loadCarDash:3421 · loadCarWheel:3433 · buildDom:3443 · confirmExit:4013 · IS_TOUCH:4032 · bindInput:4033
movePlayer:4120 · tickPlayer:4130 · collideDrone:4163 · propStall:4182 · propBreak:4189 · propFix:4196
droneBatAdd:4203 · lightningBolt:4206 · startRain:4217 · stopRain:4231 · smashGlass:4233 · awardGlass:4244
neededLetter:4261 · openDoor:4276 · raceStartRun:4296 · raceStop:4303 · gateHighlight:4321 · renderRaceHud:4328
tickDrone:4337 · nearMissTick:4479 · showNearMiss:4503 · awardDaredevil:4514 · comboCheer:4531 · comboFlash:4547
driveCell:4556 · nearestStreet:4562 · collideCar:4572 · tlDotY:4603 · tlSet:4607 · driveArms:4624
tlTick:4636 · TL_GREEN:4680 · tlRedDur:4682 · tlightPhase:4683 · buildTrafficLights:4690 · rlTick:4742
cellDrivable:4774 · cellCenter:4775 · losClear:4777 · nearestDrivableCell:4787 · routeGrid:4796 · pickGpsTarget:4849
gpsSpeak:4861 · NAVLINE_W:4880 · navLineEnsure:4881 · navLineHide:4891 · navLineUpdate:4892 · tickGps:4919
tickDrive:4995 · drawCarDial:5203 · drawCarGauges:5233 · RADIO_RECT:5261 · CAR_RADIO_RECT:5263 · carRadioRect:5269
radioLayout:5271 · radioSetHint:5294 · renderRadioList:5300 · radioToggleList:5310 · drawRadioViz:5315 · radioTick:5333
BOBBLE_FOOT:5346 · BOBBLE_H:5347 · BOBBLE_ASPECT:5348 · BOB_OMEGA:5351 · BOB_PITCH_FORCE:5353 · BOBBLE_SKINS:5355
bobbleSetAvatar:5362 · bobbleLayout:5369 · bobbleTick:5382 · bobblePoke:5407 · bobbleApplySkin:5424 · dollOwned:5434
openDollPicker:5435 · carStartShow:5472 · showLawInfo:5490 · lawNotice:5512 · driveFineSettle:5522 · HELI_PHASES:5701
heliStartPhase:5708 · heliFloorAt:5715 · SOFT_TIERS:5725 · softLandBonus:5727 · awardPerfLand:5740 · setHeliLight:5759
MAIL_COIN:5778 · mailStart:5780 · mailStop:5803 · mailTick:5804 · FOOT_EYE:5823 · doorSlideSfx:5829
doorLerp:5852 · entLerp:5860 · footStepSfx:5870 · WRING_COIN:5891 · festivalPaint:5895 · dustTexture:5907
dustBurst:5916 · dustTick:5930 · HELI_GLB_URL:5951 · HELI_GLB_TEX_BLUE:5953 · HELI_GLB_ROTOR:5955 · HELI_GLB_TROTOR:5956
heliGlbEnsure:5958 · heliMatBlueGet:5976 · heliGlbAssemble:5989 · heliNavTick:6028 · peerRotorStop:6035 · peerRotorTick:6041
heliCrashSfx:6060 · heliMeshBuild:6088 · heliMeshBuildLegacy:6099 · buildHeliFoot:6229 · footFloorAt:6345 · insideTerm:6352
inDoorZone:6353 · footHint:6357 · setFootBtns:6358 · liftStart:6363 · beginRide:6374 · endRide:6397
beginWing:6408 · awardAirLetter:6421 · paxChoiceShow:6440 · paxChoiceHide:6466 · pilotShipMesh:6470 · beginPilot:6471
endPilot:6503 · drawCabinWindow:6527 · tickHeliFoot:6551 · tickHeli:6760 · CP_NAT:7012 · CP_GAUGES:7013
SEAT_LABEL:7026 · SEAT_P_FULL:7027 · SEAT_ZOOM:7028 · DASH_OFF_Y:7029 · DASH_DROP:7030 · setSeat:7032
layoutCockpit:7044 · WIPER:7083 · WIPER_SPD:7086 · WIPER_LABEL:7087 · INT_GAP:7088 · WASH_MS:7092
WASH_TANK_MAX:7096 · SMEAR_LIFE:7108 · CHOP_MIN:7109 · SUN_RAY_FAR:7113 · sunRayBlocked:7115 · sunShadeTick:7134
applyCockpitShade:7145 · rotorChop:7157 · sunUpdate:7165 · HELI_FOG_N0:7176 · fogUpdate:7180 · adGlowPulse:7226
RAIN_MAX:7235 · VISOR_Y:7236 · RAIN_MIN:7237 · RAIN_DUR:7238 · DROP_ZONE:7242 · addDrop:7243
tickDrops:7251 · addWashDrop:7269 · washStart:7276 · renderWashGauge:7296 · washTick:7307 · grimeTick:7324
WIPE_R:7331 · wipeDrops:7332 · wiperSndOn:7355 · wiperSndOff:7367 · wiperThunk:7373 · washSpraySfx:7385
wiperSqueak:7402 · wiperSndTick:7419 · setWiper:7439 · tickWiper:7451 · SH_SWEEP:7482 · shadowSweepTick:7484
REFL_MAX:7496 · REFL_COL:7498 · cityGlowLevel:7499 · drawCityGlow:7504 · setVisor:7536 · rainTick:7542
drawBlade:7559 · drawSmears:7578 · drawGlass:7598 · drawBellyCam:7760 · drawBellyHud:7783 · drawLandingTargets:7829
VS_HARD:7899 · drawDescentBar:7900 · heliShake:7949 · cpNeedle:7960 · drawGauges:7977 · XF_START:8025
PRELOAD_WAIT:8026 · ALT_QUIET_FROM:8028 · ALT_MAX_DAMP:8029 · ALT_LP_MIN:8030 · ECHO_NEAR:8031 · WIND_FULL_SPD:8032
SHUTDOWN_SEC:8033 · PAN_MAX:8035 · OD_RPM:8036 · SHAKE_RPM:8037 · SHAKE_HIT:8038 · soccerLetterPos:8518
letterNeeded:8526 · soccerNeededSet:8531 · soccerTileGeo:8537 · soccerGoldTexture:8539 · makeSoccerTile:8556 · soccerRefreshSkins:8565
soccerBuildTargets:8572 · soccerNextTile:8582 · soccerRetarget:8595 · soccerCoinPop:8607 · soccerGrassTexture:8620 · soccerTurfGrade:8642
soccerTurfTexture:8665 · grassNormalTexture:8684 · soccerLinesTexture:8713 · soccerNetTexture:8764 · soccerCrowdTexture:8772 · soccerBallMat:8791
buildSoccerGoal:8811 · buildStands:8830 · soccerLedBoards:8865 · soccerGKEnsure:8962 · soccerGKTick:8978 · fkBuildWall:9007
fkToggle:9022 · fkHitTest:9038 · pkHud:9057 · pkStart:9066 · pkEnd:9080 · pkTick:9095
repQualify:9102 · repEnsureEl:9105 · repStart:9116 · repTick:9123 · soccerNumTex:9148 · makeSoccerPlayer:9158
soccerNewSpot:9184 · soccerResetBall:9196 · soccerKick:9203 · soccerCheer:9220 · guideTexture:9223 · auraActive:9247
auraLeftMs:9248 · buildAura:9250 · auraBuy:9271 · auraRender:9281 · auraTick:9295 · buildDrill:9315
drillTick:9328 · buildLandRing:9365 · buildGuideRibbon:9375 · renderSpinPad:9400 · spinPadToggle:9412 · spinPadPick:9418
renderCurl:9430 · kickLaunch:9441 · updateSoccerGuide:9449 · soccerCamera:9513 · tickSoccer:9534 · soccerKitShow:9714
soccerKitGo:9729 · emojiSprite:9782 · makeAlien:9787 · startWave:9820 · waveSpawnFill:9831 · waveComplete:9840
updateWaveHud:9850 · checkMechaBossBadge:9852 · alienSpawnPos:9861 · removeAlien:9866 · mechaHudWord:9871 · setMechaHudSkin:9879
mechaComboPop:9891 · mechaShielded:9896 · mechaDamageFx:9898 · mechaHitByAlien:9903 · spawnAlienShot:9909 · removeAlienShot:9919
tickAlienShots:9924 · spawnPowerup:9936 · removePowerup:9949 · collectPowerup:9954 · tickPowerups:9961 · updateMechaHud:9970
mechaTracer:10010 · mechaFire:10019 · explodeAlien:10056 · tickMecha:10086 · loop:10142 · grabShot:10169
savePhoto:10180 · clearEntities:10192 · INTRO_KEY:10206 · introSeenObj:10207 · introSeen:10208 · markIntroSeen:10209
INTRO:10210 · showIntro:10211 · closeIntro:10236 · beginPlay:10242 · start:10244 · exitWorld:10435
mechaRecapLine:10494

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

## js/invasion3d.js (8,270 บรรทัด · 473 รายการ)
### 🗂️ สารบัญโซน js/invasion3d.js (Read/Edit เฉพาะช่วง)
- 16-77 ⚙️ ค่ากติกา (จูนฟีลทั้งหมดที่นี่)
- 78-112 🎯 รอบ 419: ปืนกระบอกที่ 2 — R93 สไนเปอร์ (ตามสเปก Delta Force ที่ผู้ใช้ส่งมา)
- 113-147 🎬 รอบ 422: แอนิเมชันยกปืนเล็ง (ADS) ของ R93 — ตามสเปกที่ผู้ใช้ให้มา
- 148-176 🔍🫁 รอบ 504: "ตัวคูณบวกทับ" ท่าเล็ง — ซูมยิ่งแรงปืนยิ่งแนบตา + ท่าประทับแก้มตอนกลั้นหายใจ
- 177-214 🫁🌑 รอบ 505: สัญญาณรับรู้ลมหายใจตอนส่องกล้อง — เสียงสูด/ผ่อน/สั่น + ขอบจอมืดตามลมที่เหลือ
- 215-244 🔭🫨 รอบ 506: "กำลังขยายมีผลกับความนิ่งของภาพ" — ยิ่งซูมแรงยิ่งสั่นมาก ต้องพึ่งการกลั้นหายใจจริง
- 245-386 🫁💨 รอบ 508: "ลมหมดขณะยังกดกลั้นหายใจอยู่" — ปืนตกวูบแล้วหอบ ก่อนกลับสู่ปกติ
- 387-1029 🎨 CSS + DOM overlay (self-contained ไม่แตะ css/style.css)
- 1030-1354 🔊 เสียงสังเคราะห์ Web Audio (ปลอดลิขสิทธิ์ 100%)
- 1355-1510 🚁🔊 เสียงเฮลิคอปเตอร์ Bell 212 — "เหมือนโลก helicopter ทุกประการ" (รอบ 531 — ผู้ใช้สั่ง)
- 1511-1551 🚁🔊🌍 เสียงเฮลิรอบตัว (รอบ 531 — ผู้ใช้สั่ง) — ทุกลำในสนามส่งเสียงใบพัดจริง ดังตามระยะ + ซ้าย/ขวา
- 1552-1614 🖼️ เทกซ์เจอร์วาดเอง (canvas) + ตัวช่วยโหลดภาพจริงถ้ามีไฟล์
- 1615-1660 🌍 สถานะฉาก
- 1661-1720 📦 โหลดโมเดล .glb ถ้ามีไฟล์ (ผู้ใช้เอาของจริงมาใส่แล้ว)
- 1721-1841 🏜️ สร้างฉากทะเลทราย + เมือง
- 1842-2012 🏚️ รอบ 416: ถนนสมรภูมิหน้าจุดเกิด (ผู้ใช้ส่งภาพอ้างอิง Delta Force)
- 2013-2150 🏠 รอบ 431: บ้านหลบซุ่มยิง (โมเดล house_01 ของผู้ใช้) + จุดสูงข่มบนเนินเขา
- 2151-2211 🛸 ยานแม่ลำมหึมา — ทรงลิ่มเหลี่ยมมืด + หนาม + ช่องตัวอักษร (สไตล์ ID4)
- 2212-2276 👾 ยานลูก — 1 ลำต่อ 1 ตัวอักษร (บินเพ่นพ่าน + ปล่อยลำแสงใส่ผู้เล่น)
- 2277-2280 👥 พันธมิตร — หน่วยรบภาคพื้นอาวุธครบมือ + ฝูงเฮลิคอปเตอร์ติดมิสไซล์
- 2281-2385 🪖 รอบ 423: ระบบตัวละครทหารแบบมี "ข้อต่อ" (rig) — รองรับโมเดล .glb ของผู้ใช้
- 2386-2898 🤖 รอบ 424: จับชิ้นส่วนเข้าข้อต่อ "อัตโนมัติจากตำแหน่ง" (ผู้ใช้ไม่ต้องตั้งชื่อ)
- 2899-3044 🚁🅿️ รอบ 434: เฮลิคอปเตอร์จอดในสนามรบ 5 ลำ (โมเดลจริง helicopter.glb — ผู้ใช้สั่ง)
- 3045-3338 🎛️🚁 รอบ 532: ห้องนักบิน "ภาพจริง + เข็มเกจขยับ" (ผู้ใช้สั่ง — เหมือนโลก helicopter ทุกประการ)
- 3339-3363 🔫 อาวุธในมือผู้เล่น (view model ติดกล้อง — เห็นปืนที่ถืออยู่แบบ Delta Force)
- 3364-3470 🎯🔧 TUNE ZONE — ท่าถือปืน (แก้ที่นี่ที่เดียว · 3 บรรทัดล่างนี้เท่านั้น)
- 3471-3526 💪 มือถือปืน มุมมองที่ 1 — รอบ 518 (ผู้ใช้สั่งตรง: เปิดโชว์มือจริง)
- 3527-3664 🧤 รอบ 518: โมเดลมือจริง (GLB จาก Tripo) — ผู้ใช้เจนเอง img/models/hand_grip.glb
- 3665-3813 🔧 รอบ 427: ยืดลำกล้องปืนหลัง export (ผู้ใช้: โมเดล R93 ลำกล้องสั้นไป)
- 3814-4519 🔩 รอบ 447: ชักลูกเลื่อนแบบ SV-98/Delta Force (ผู้ใช้ส่งคลิปอ้างอิงมา)
- 4520-4622 💥 เอฟเฟกต์: ระเบิด · ประกายโดน · ลำแสง · เศษซาก
- 4623-4728 🎯📝 รอบ 471: เป้าฝึกยิงในสมรภูมิ (ผู้ใช้สั่ง)
- 4729-4789 🔎 รอบ 473: โจทย์แปลไทย — "ยิงคำที่แปลว่า …"
- 4790-5097 🎯 ระบบยิงของผู้เล่น
- 5098-5111 🎯📡 รอบ 563: เรดาร์ล็อกเป้า + มิสไซล์นำวิถีเข้าเป้าที่ล็อก (ผู้ใช้สั่ง — สไตล์ Ace Combat)
- 5112-5283 🎯🔒 รอบ 564 (ผู้ใช้สั่ง): ล็อกหลายเป้าพร้อมกัน → ยิงมิสไซล์รัวทีละชุด
- 5284-5345 ⚔️ ดาเมจ / เงื่อนไขชนะ
- 5346-5434 📖 คำศัพท์ + รอบเล่น
- 5435-5497 🖥️ HUD
- 5498-5629 🕹️ Input — มือถือ (จอย+ปุ่ม) และคอม (WASD + pointer lock)
- 5630-5750 🚶 ผู้เล่น + AI + ลูป
- 5751-5755 🚁 โหมดขับเฮลิคอปเตอร์เอง (รอบ 414 — ผู้ใช้สั่ง)
- 5756-5914 🗺️ รอบ 417: แผนที่เลือกจุดลงสนาม (ผู้ใช้สั่ง) — เข้าเกมแล้วเลือกได้ว่าจะไปเกิดตรงไหน
- 5915-6404 🎖️ รอบ 418: นั่งเฮลิลำเดียวกับเพื่อน — "นักบิน + พลปืนประจำประตู" (ผู้ใช้สั่ง)
- 6405-6728 🌐 ผู้เล่นออนไลน์ใน map เดียวกัน (รอบ 414) — Firebase /world/invasion
- 6729-6787 💨 ควันตามหลังมิสไซล์ (รอบ 531 — ผู้ใช้สั่ง) — สไปรต์ควันนุ่มปล่อยเป็นระยะ
- 6788-6945 🔥🌀 รอบ 565 (ผู้ใช้สั่ง): ยานลูก "หลบมิสไซล์ที่ล็อกได้" — ปล่อยแฟลร์ + บิดหนี
- 6946-7036 🏃🪖 รอบ 530: หน่วยรบเคลื่อนที่เชิงยุทธวิธี (ผู้ใช้สั่ง: "อย่าปักหลักยืนทื่อ
- 7037-7212 📣 รอบ 471: ทหารฝ่ายเราตะโกนบอกทิศศัตรู (ผู้ใช้สั่ง)
- 7213-7655 🌙 รอบ 471: โหมดกลางคืน — ฉากมืดสลัว + ท้องฟ้าดาว + ไฟฉายติดปืน
- 7656-7723 🔁 ลูปหลัก
- 7724-8270 ▶️ เข้า/ออกโลก
### รายการ js/invasion3d.js
REWARD:19 · WORD_TIME:21 · WORLD:22 · EYE:23 · FOV:24 · LOOK_SENS:25
PITCH_MIN:26 · MS_Y:48 · MS_FLAT:57 · MS_BELLY:58 · MS_HP:59 · MS_DMG_GUN:60
CORE_Y:66 · F_HP:71 · FIGHTER_SIZE:72 · F_SHOT_GAP:73 · MS_BEAM_GAP:74 · GUN_GAP:77
WEAPONS:84 · SNIPER_SENS:91 · SCOPE_R:95 · SCOPE_MAGS:100 · RIFLE_MAGS:107 · magList:110
curMag:111 · ADS_IN:119 · ADS_POS:120 · ADS_ROT:121 · ADS_SCALE:122 · ADS_BY_GUN:143
adsView:147 · ADS_BOOST:160 · tickAdsBoost:169 · BREATH_FX:187 · tickBreathFx:198 · ADS_BREATH:214
SWAY_MAG:227 · tickSwayMag:236 · GASP:260 · fireGasp:272 · clearGasp:273 · tickGasp:275
gaspMul:286 · gaspPitchNow:288 · applyGasp:294 · REC_BY_GUN:310 · REC_DEFAULT:316 · recCfg:318
BOLT_MS:319 · BREATH_MAX:320 · SPRINT_IN:324 · SPRINT_POS:325 · LAG_GAIN:331 · SWAY:337
PANT_FROM:350 · MIS_MAX:353 · PLAYER_HP:354 · SQUAD_N:357 · SQUAD_GAP:358 · HELI_CHASE_SPD:359
SQUAD_RUN:360 · HELI_MAX:366 · HELI_ACCEL:367 · HELI_SKID:368 · HELI_GUN_MUL:371 · PH_GUN_GAP:372
PH_MIS_MAX:373 · NET_SEND_MS:376 · CHAT_MS:377 · CHAT_PRESETS:378 · PEER_COLORS:379 · TAU:381
CSS:390 · buildDom:852 · HELI_XF:1361 · CHORUS_RANGE:1517 · resumeAudio:1549 · tryTex:1557
letterSpriteTex:1568 · sandTex:1579 · wallTex:1600 · BULLET_SPD_R93:1626 · loadGlb:1670 · tameGlbMaterials:1700
fitInto:1712 · HILLS:1727 · buildTerrain:1736 · baseLow:1770 · buildTown:1776 · STREET_Z0:1847
instancer:1851 · buildWarStreet:1865 · sandbagWalls:1970 · squadCoverSpots:1978 · buildDustMotes:1988 · tickDust:1999
HOUSE_SIZE:2022 · HOUSE_LOD:2023 · HOUSE_COVER:2024 · HOUSE_CELL:2025 · HOUSE_SPOTS:2026 · buildHouses:2032
buildBlockGrid:2058 · gridBlocked:2094 · houseBlocked:2101 · houseCover:2110 · tickHouseLod:2118 · findSniperSpots:2127
buildMothership:2155 · layoutLetterPanels:2208 · makeFighter:2215 · drawFighterBar:2267 · SOLDIER_PARTS:2288 · joint:2302
buildSoldierRig:2306 · loadSoldierGlb:2349 · applySoldierGlb:2350 · BODY_MAP:2394 · mergeMeshList:2406 · faceModelForward:2447
skinSoldierLimb:2502 · autoRigSoldier:2544 · fitSoldierGround:2676 · poseSoldier:2702 · MUZZLE_BY_WEAPON:2823 · FLASH_COLOR:2825
makeSoldierFlash:2826 · makeSoldier:2833 · makeHeli:2864 · HELI_ROTOR_NODES:2907 · HELI_TROTOR_NODES:2908 · HELI_LEN:2909
HELI_DESERT:2910 · BOARD_DIST:2911 · AUTO_BOARD_DIST:2916 · HELI_COL_SENS:2923 · heliPiloting:2924 · START_MS:2925
START_PHASES:2926 · HELI_PADS:2933 · SEAT_VIEWS:2941 · heliModel:2952 · buildHeliPads:2994 · padAt:3003
movePad:3009 · startPhaseText:3014 · setSeatView:3021 · tickPads:3034 · CP_NAT:3055 · CP_GAUGES:3056
CP_LAMP:3067 · FUEL_MAX:3070 · FUEL_WARN:3071 · ENG_AMB:3073 · HOT_FULL:3080 · heliLift:3082
cpRpmNow:3087 · CP_SEAT_FULL:3088 · CP_ZOOM:3089 · CP_DASH_OFF_Y:3090 · CP_DASH_DROP:3091 · CP_SHAKE_RPM:3092
loadCockpitImg:3097 · layoutInvCockpit:3113 · cpNeedle:3141 · cpArc:3158 · cpRoundRect:3164 · tickHeliGauges:3171
tickHeliHot:3191 · heliLampLv:3208 · ALARM_GAP:3217 · ALARM_KEYS:3218 · resetHeliAlarm:3220 · tickHeliAlarm:3221
cpLamps:3237 · drawInvGauges:3271 · ZERO_DIST:3378 · GUN_VIEW:3392 · GUN_POS:3457 · GUN_ROT:3458
GUN_SCALE:3459 · useGunView:3461 · MUZZLE_Y:3467 · buildFist:3480 · buildArms:3500 · HAND_POSE:3537
makeHandTopMat:3546 · FOREARM:3552 · addForearm:3553 · loadHandModel:3561 · applyHandPose:3583 · fitArmsToWeapon:3592
buildRifleModel:3598 · buildR93Model:3619 · GUN_CUT:3674 · GUN_STRETCH:3675 · orientGunModel:3680 · stretchGunBarrel:3706
mergeGunParts:3764 · forceGunForward:3789 · attachBoltHandle:3821 · tickBolt:3849 · tickBarrelHeat:3892 · muzzleSmoke:3901
alignGunMuzzle:3921 · syncMuzzleAnchor:3957 · buildSelfShadow:3965 · SUN_DIR:3978 · tickSelfShadow:3979 · renderViewModel:3994
vmToWorld:4010 · gunSil:4013 · setGunPose:4038 · buildGun:4066 · tickSwap:4152 · applyWeapon:4162
swapWeapon:4172 · setScoped:4186 · smoothstep:4200 · tickSway:4204 · tickAds:4229 · applyRecoil:4350
applyBreath:4356 · scopeRadius:4369 · scopeRadiusNow:4381 · tickRange:4386 · layoutScope:4406 · scopeFovDeg:4456
renderScopePass:4464 · cycleScopeMag:4492 · renderAmmo:4500 · syncWeaponBtns:4511 · boom:4523 · dustPuff:4550
sparkAt:4559 · tracer:4566 · tickFx:4582 · TRG_COIN:4631 · QUIZ_COIN:4632 · targetTexture:4637
setTargetWord:4655 · targetSpots:4665 · buildTargets:4678 · tickTargets:4707 · quizPool:4735 · newQuiz:4738
tickQuiz:4744 · renderQuiz:4750 · targetWord:4757 · hitTarget:4763 · AIM_OFF:4798 · AIM_BY_GUN:4817
aimOffNow:4818 · adsPosNow:4822 · aimPct:4827 · layoutCross:4829 · aimDir:4832 · fireGun:4840
envHit:4912 · HOLE_MAX:4945 · holeTexture:4946 · bulletHole:4961 · tickBullets:4972 · RECOIL_PAT:4994
RECOIL_RESET:4995 · addRecoil:4997 · startReload:5011 · tickReload:5019 · launchMissile:5025 · fireMissile:5049
tickMisQueue:5085 · RDR_RANGE:5107 · RDR_FIND:5108 · RDR_KEEP:5109 · RDR_LOCK_MS:5110 · RDR_BEEP:5111
RDR_MAX_LOCK:5122 · RDR_ADD_GAP:5123 · SALVO_PER_TGT:5124 · SALVO_PAIR_MS:5125 · SALVO_TGT_MS:5126 · LK_NUM:5131
rdrOn:5132 · resetRadar:5133 · radarPick:5138 · radarHolds:5152 · tickRadar:5158 · drawLockBoxes:5188
drawRadar:5207 · lockTarget:5249 · rayTarget:5259 · raySphere:5276 · damageFighter:5288 · dropFighter:5296
updateArmor:5318 · killMother:5325 · flashScreen:5340 · myUid:5350 · leaderUid:5351 · isLeader:5356
pickWord:5357 · setWord:5370 · adoptWord:5380 · applyShared:5389 · startWave:5404 · completeWord:5414
renderWord:5438 · renderTarget:5448 · tickWordTimer:5459 · renderCoins:5469 · renderHp:5470 · renderHeat:5476
renderMissiles:5482 · toastBan:5491 · bindInput:5501 · moveJoy:5620 · unlockMouse:5628 · solidPushOut:5637
tickPlayer:5652 · hurtPlayer:5732 · MAP_VIEW:5761 · mapToWorld:5762 · worldToMap:5763 · zoneName:5764
buildMapShade:5778 · drawSpawnMap:5797 · safeSpawn:5872 · fitSpawnMap:5882 · openSpawnMap:5893 · applySpawnPick:5902
RIDE_DIST:5925 · RIDE_UP:5926 · RIDE_OFF:5927 · rideableHelis:5928 · findRide:5934 · nearestRideable:5935
ridePos:5945 · setRideView:5957 · boardGunner:5966 · dismountGunner:5984 · tickGunner:6000 · updateGunnerBtn:6040
tickAutoBoard:6055 · heliCount:6066 · enterHeli:6071 · exitHeli:6111 · EXT_CAM:6140 · EXT_VIEWS:6161
EXT_SELF:6176 · EXT_RIDE:6177 · extP:6179 · syncExtBtn:6181 · cycleExtView:6187 · resetExtCam:6196
angDiff:6198 · extCamClear:6203 · extCamera:6222 · seatCamera:6245 · tickHeliFlight:6266 · heliCrash:6363
tickGpws:6373 · syncBotHelis:6395 · netReady:6410 · netJoin:6414 · netSend:6427 · peerColor:6448
nameSprite:6450 · bakedSoldierGlb:6464 · loadPeerSoldier:6465 · peerRig:6474 · setPeerWeapon:6479 · peerBody:6484
buildPeer:6513 · onPeer:6522 · dropPeer:6555 · netLeave:6562 · peerTick:6568 · renderBoard:6604
sendChat:6621 · showPeerBubble:6628 · removePeerBubble:6634 · tickFighters:6640 · tickMother:6680 · spawnAlienShot:6702
tickAlienShots:6714 · smokeTex:6734 · spawnPuff:6745 · spawnSmoke:6755 · spawnDust:6757 · tickSmoke:6766
clearSmoke:6776 · tickHeliDust:6779 · EVA_WARN:6801 · EVA_FLARE_D:6802 · EVA_TURN:6803 · EVA_SPIN_MUL:6804
EVA_SPD_MAX:6805 · EVA_ROLL:6808 · EVA_Y:6809 · FLARE_PODS:6810 · FLARE_COOL:6811 · FLARE_N:6812
FLARE_LIFE:6813 · FLARE_TRAP:6814 · FLARE_CH:6815 · incomingMis:6820 · startEvade:6831 · dropFlares:6840
tickEvade:6867 · clearFlares:6898 · tickMissiles:6899 · SQUAD_COVERS:6955 · squadCoverPool:6956 · pickSquadDest:6957
tickSquadMove:6971 · tickSquad:6993 · CALL_DIST:7043 · CALL_NEAR:7044 · CALL_GAP_ALL:7045 · CALL_GAP_ONE:7046
CALL_GAP_DIR:7047 · CALL_MS:7048 · CALL_LINES:7049 · CALL_SECTORS:7060 · bearingKey:7063 · clearSquadBubble:7071
callSprite:7077 · squadShout:7089 · tickSquadCalls:7102 · CHAT_GAP_ALL:7129 · CHAT_LINES:7130 · tickSquadChatter:7136
heliFireAt:7153 · nearestFighterTo:7165 · tickHelis:7171 · DAY:7220 · NIGHT:7222 · collectMsMats:7226
CYCLE_MS:7237 · MODE_ICON:7239 · STORM_MS:7246 · buildStars:7253 · buildStreetLamps:7276 · glowTex:7294
tickStreetLamps:7302 · beamPair:7319 · tickSearchBeams:7330 · buildBarrelFires:7367 · tickBarrels:7385 · tickShootingStar:7395
buildMist:7420 · tickMist:7430 · tickNightSound:7473 · tickSneak:7482 · tickStorm:7493 · nvReady:7509
nvEnter:7510 · nvExit:7516 · tickNvHint:7517 · dropGlowStick:7526 · tickGlowSticks:7543 · buildFlashlight:7552
setNight:7557 · setDayMode:7558 · tickNight:7572 · applyNightLook:7604 · tickFlashlight:7644 · fit:7659
tick:7665 · frame:7673 · build:7727 · start:7787 · exitWorld:7901

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

## js/ui.js (7,018 บรรทัด · 282 รายการ)
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
- 4424-4639 🎫 การ์ดตั๋วโลกผจญภัย (คิว 7725691507 ข้อ 7)
- 4640-4721 🎃 การ์ดตั๋วโลกผีสิงกลางคืน (ต่อยอดข้อ 8 · ผู้ใช้เคาะ 7 ก.ค.)
- 4722-4825 🚁 การ์ดตั๋วโลกเฮลิคอปเตอร์ Bell (รอบ 52)
- 4826-4925 🛸 การ์ดตั๋วโลกโดรน FPV Racing (รอบ 85) — ซื้อได้เมื่อมีตั๋วเฮลิคอปเตอร์
- 4926-5116 🚗 การ์ดตั๋วโลกขับรถกำแพงเพชร (รอบ 113) — ซื้อได้เมื่อมีตั๋วโดรน FPV
- 5117-5209 ⚽ การ์ดตั๋วโลกสนามฟุตบอล (รอบ 196) — ซื้อได้เมื่อมีตั๋วขับรถ
- 5210-5305 🏍️ การ์ดตั๋วโลกมอเตอร์ไซค์บ้านโพธิ์สวัสดิ์ (รอบ 293) — ซื้อได้เมื่อมีตั๋วขับรถ
- 5306-5403 🛸 การ์ดตั๋วโลก "ยานแม่บุกโลก" (Invasion · รอบ 413)
- 5404-5555 🌍 ปุ่มลัดเข้าโลก 3D ในรางเมนูซ้าย (ผู้ใช้สั่ง 9 ก.ค. 2026)
- 5556-5725 การ์ดสวนผลไม้ (ข้อ 12): ซื้อต้นไม้ปลูกได้ไม่จำกัด แต่ละต้นออกผล
- 5726-5735 โรงงานผลิตสินค้า 🏭 + ตลาดขายต่อ (แนวคิดใหม่ 5 ก.ค. 2026)
- 5736-5758 โรงงานผลิต (แผง 🏭) — แยกออกจากตลาด (ผู้ใช้สั่ง 6 ก.ค. 2026)
- 5759-5909 ตลาดขายสินค้า (แผง 🏪) — แยกออกจากโรงงาน
- 5910-6813 🚗 รอบ 131: หมวดยานพาหนะ — โชว์รูมรถ 10 คัน (แคตตาล็อก 5 ช่อง/แถว)
- 6814-6874 ร้านสัตว์เลี้ยง (ซื้อเพิ่มได้ ไม่ลบตัวเดิม)
- 6875-6911 เลเวลอัพ (รายตัว)
- 6912-6981 สถิติผลการเรียนรู้
- 6982-7018 item 4: การ์ดสรุปส่งครู — ใบเดียวจบ ชื่อ/วัน-เวลา/เหรียญวันนี้/แรงค์/สอบล่าสุด
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
soldBadge:4432 · renderTicketCard:4437 · loadScriptOnce:4493 · loadAdv3d:4510 · enterAdventure3D:4517 · pickAdvMap:4542
enterHaunted3D:4577 · advHealClick:4599 · buyTicket:4619 · renderHauntCard:4645 · buyHauntTicket:4700 · renderHeliCard:4727
buyHeliTicket:4785 · enterHeli3D:4808 · renderDroneCard:4830 · buyDroneTicket:4885 · enterDrone3D:4908 · renderDriveCard:4931
buyDriveTicket:5005 · enterDrive3D:5028 · pickDriveMap:5063 · enterMotoMapAsCar:5099 · renderSoccerCard:5121 · buySoccerTicket:5169
enterSoccer3D:5192 · renderMotoCard:5215 · buyMotoTicket:5264 · enterMoto3D:5287 · renderInvasionCard:5310 · INVASION_REWARD:5359
buyInvasionTicket:5361 · enterInvasion3D:5385 · WORLD3D:5410 · gotoRobotShop:5421 · scrollShopCardIntoView:5426 · railWorldClick:5429
renderRailWorlds:5450 · tinvNoticeHTML:5509 · openTinvPicker:5517 · fruitCountdown:5561 · renderFarmCard:5573 · renderFarmClock:5648
buyFruit:5664 · sellFruit:5684 · sellAllFruit:5705 · collectImg:5734 · renderFactoryCard:5740 · renderMarketCard:5763
updateWishBadge:5819 · openWishlistDialog:5830 · bindStripArrows:5875 · renderMarketBrowse:5887 · carImg:5916 · renderVehicleShop:5917
CS_CYCLE_MS:5968 · carInteriorImg:5969 · carStatHtml:5971 · renderCarShowroom:5978 · csShowBig:6004 · csInit:6031
RS_CYCLE_MS:6054 · robotImg:6055 · renderRobotShop:6056 · rsShowBig:6078 · rsInit:6099 · buyRobot:6118
enterMecha3D:6140 · pickMechaRobot:6161 · pickDriveCar:6193 · openCarBuyDialog:6236 · buyCarInsurance:6297 · payCarLoanMonthly:6316
payCarLoanFull:6328 · carDriveBlock:6347 · gotoVehicleShop:6352 · gotoMyStock:6357 · showNeedCarDialog:6363 · craftDiscount:6375
renderFactory:6378 · renderOrdersUI:6440 · startProduce:6459 · buyCollectible:6487 · cancelProduce:6515 · deliverOrder:6529
renderOrderClock:6546 · renderCollectMine:6556 · openListDialog:6598 · cancelListing:6651 · buyMarketItem:6674 · showCollectReveal:6701
buyAC:6739 · openHomeShop:6758 · renderPetShop:6817 · showLevelUp:6878 · renderStats:6915 · showTeacherCard:6986

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
