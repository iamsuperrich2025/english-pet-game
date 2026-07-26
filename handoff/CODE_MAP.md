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

## js/game.js (965 บรรทัด · 64 รายการ)
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
startQuiz:808 · renderQuizQuestion:824 · quizNext:887 · finishQuiz:900

## js/images.js (101 บรรทัด · 14 รายการ)
IMG_FILES:11 · MOODS:12 · startImgKey:14 · petImageKeys:16 · probeImages:27 · probeRankImages:39
probeCollectImages:40 · probeGiftImages:41 · probeHomeImages:42 · equippedItem:48 · petStateImg:58 · happyNow:72
makeHappy:73 · currentPetImg:84

## js/invasion3d.js (9,849 บรรทัด · 599 รายการ)
### 🗂️ สารบัญโซน js/invasion3d.js (Read/Edit เฉพาะช่วง)
- 16-81 ⚙️ ค่ากติกา (จูนฟีลทั้งหมดที่นี่)
- 82-116 🎯 รอบ 419: ปืนกระบอกที่ 2 — R93 สไนเปอร์ (ตามสเปก Delta Force ที่ผู้ใช้ส่งมา)
- 117-162 🎬 รอบ 422: แอนิเมชันยกปืนเล็ง (ADS) ของ R93 — ตามสเปกที่ผู้ใช้ให้มา
- 163-191 🔍🫁 รอบ 504: "ตัวคูณบวกทับ" ท่าเล็ง — ซูมยิ่งแรงปืนยิ่งแนบตา + ท่าประทับแก้มตอนกลั้นหายใจ
- 192-229 🫁🌑 รอบ 505: สัญญาณรับรู้ลมหายใจตอนส่องกล้อง — เสียงสูด/ผ่อน/สั่น + ขอบจอมืดตามลมที่เหลือ
- 230-259 🔭🫨 รอบ 506: "กำลังขยายมีผลกับความนิ่งของภาพ" — ยิ่งซูมแรงยิ่งสั่นมาก ต้องพึ่งการกลั้นหายใจจริง
- 260-410 🫁💨 รอบ 508: "ลมหมดขณะยังกดกลั้นหายใจอยู่" — ปืนตกวูบแล้วหอบ ก่อนกลับสู่ปกติ
- 411-1160 🎨 CSS + DOM overlay (self-contained ไม่แตะ css/style.css)
- 1161-1525 🔊 เสียงสังเคราะห์ Web Audio (ปลอดลิขสิทธิ์ 100%)
- 1526-1690 🚁🔊 เสียงเฮลิคอปเตอร์ Bell 212 — "เหมือนโลก helicopter ทุกประการ" (รอบ 531 — ผู้ใช้สั่ง)
- 1691-1731 🚁🔊🌍 เสียงเฮลิรอบตัว (รอบ 531 — ผู้ใช้สั่ง) — ทุกลำในสนามส่งเสียงใบพัดจริง ดังตามระยะ + ซ้าย/ขวา
- 1732-1794 🖼️ เทกซ์เจอร์วาดเอง (canvas) + ตัวช่วยโหลดภาพจริงถ้ามีไฟล์
- 1795-1842 🌍 สถานะฉาก
- 1843-1902 📦 โหลดโมเดล .glb ถ้ามีไฟล์ (ผู้ใช้เอาของจริงมาใส่แล้ว)
- 1903-2029 🏜️ สร้างฉากทะเลทราย + เมือง
- 2030-2089 🌳 รอบ 580 (ผู้ใช้สั่ง): ต้นไม้จริงจากโมเดล tree.glb ของผู้ใช้
- 2090-2260 🏚️ รอบ 416: ถนนสมรภูมิหน้าจุดเกิด (ผู้ใช้ส่งภาพอ้างอิง Delta Force)
- 2261-2398 🏠 รอบ 431: บ้านหลบซุ่มยิง (โมเดล house_01 ของผู้ใช้) + จุดสูงข่มบนเนินเขา
- 2399-2459 🛸 ยานแม่ลำมหึมา — ทรงลิ่มเหลี่ยมมืด + หนาม + ช่องตัวอักษร (สไตล์ ID4)
- 2460-2526 👾 ยานลูก — 1 ลำต่อ 1 ตัวอักษร (บินเพ่นพ่าน + ปล่อยลำแสงใส่ผู้เล่น)
- 2527-2530 👥 พันธมิตร — หน่วยรบภาคพื้นอาวุธครบมือ + ฝูงเฮลิคอปเตอร์ติดมิสไซล์
- 2531-2635 🪖 รอบ 423: ระบบตัวละครทหารแบบมี "ข้อต่อ" (rig) — รองรับโมเดล .glb ของผู้ใช้
- 2636-3148 🤖 รอบ 424: จับชิ้นส่วนเข้าข้อต่อ "อัตโนมัติจากตำแหน่ง" (ผู้ใช้ไม่ต้องตั้งชื่อ)
- 3149-3294 🚁🅿️ รอบ 434: เฮลิคอปเตอร์จอดในสนามรบ 5 ลำ (โมเดลจริง helicopter.glb — ผู้ใช้สั่ง)
- 3295-3597 🎛️🚁 รอบ 532: ห้องนักบิน "ภาพจริง + เข็มเกจขยับ" (ผู้ใช้สั่ง — เหมือนโลก helicopter ทุกประการ)
- 3598-3622 🔫 อาวุธในมือผู้เล่น (view model ติดกล้อง — เห็นปืนที่ถืออยู่แบบ Delta Force)
- 3623-3729 🎯🔧 TUNE ZONE — ท่าถือปืน (แก้ที่นี่ที่เดียว · 3 บรรทัดล่างนี้เท่านั้น)
- 3730-3785 💪 มือถือปืน มุมมองที่ 1 — รอบ 518 (ผู้ใช้สั่งตรง: เปิดโชว์มือจริง)
- 3786-3923 🧤 รอบ 518: โมเดลมือจริง (GLB จาก Tripo) — ผู้ใช้เจนเอง img/models/hand_grip.glb
- 3924-4072 🔧 รอบ 427: ยืดลำกล้องปืนหลัง export (ผู้ใช้: โมเดล R93 ลำกล้องสั้นไป)
- 4073-4778 🔩 รอบ 447: ชักลูกเลื่อนแบบ SV-98/Delta Force (ผู้ใช้ส่งคลิปอ้างอิงมา)
- 4779-5045 💥 เอฟเฟกต์: ระเบิด · ประกายโดน · ลำแสง · เศษซาก
- 5046-5175 🛡️🔵 รอบ 581 (ผู้ใช้สั่ง): "เกราะยานแม่ที่มองไม่เห็น"
- 5176-5281 🎯📝 รอบ 471: เป้าฝึกยิงในสมรภูมิ (ผู้ใช้สั่ง)
- 5282-5342 🔎 รอบ 473: โจทย์แปลไทย — "ยิงคำที่แปลว่า …"
- 5343-5729 🎯 ระบบยิงของผู้เล่น
- 5730-5743 🎯📡 รอบ 563: เรดาร์ล็อกเป้า + มิสไซล์นำวิถีเข้าเป้าที่ล็อก (ผู้ใช้สั่ง — สไตล์ Ace Combat)
- 5744-5886 🎯🔒 รอบ 564 (ผู้ใช้สั่ง): ล็อกหลายเป้าพร้อมกัน → ยิงมิสไซล์รัวทีละชุด
- 5887-5938 🧭🚀 รอบ 572 (ผู้ใช้สั่ง · ต่อยอดรอบ 569): ลูกศรบอกทิศ "จรวดที่พุ่งเข้าหาเฮลิเรา" บนจอเรดาร์
- 5939-6010 📡⬇️ รอบ 575 (ผู้ใช้สั่ง): เรดาร์ต้องไม่ทับ "แผงสถานะซ้าย" (พลังชีวิต/ความร้อนปืน/ลูกจรวด)
- 6011-6080 ⚔️ ดาเมจ / เงื่อนไขชนะ
- 6081-6171 📖 คำศัพท์ + รอบเล่น
- 6172-6235 🖥️ HUD
- 6236-6369 🕹️ Input — มือถือ (จอย+ปุ่ม) และคอม (WASD + pointer lock)
- 6370-6490 🚶 ผู้เล่น + AI + ลูป
- 6491-6495 🚁 โหมดขับเฮลิคอปเตอร์เอง (รอบ 414 — ผู้ใช้สั่ง)
- 6496-6654 🗺️ รอบ 417: แผนที่เลือกจุดลงสนาม (ผู้ใช้สั่ง) — เข้าเกมแล้วเลือกได้ว่าจะไปเกิดตรงไหน
- 6655-6813 🎖️ รอบ 418: นั่งเฮลิลำเดียวกับเพื่อน — "นักบิน + พลปืนประจำประตู" (ผู้ใช้สั่ง)
- 6814-7174 🔭🚫 รอบ 575 (ผู้ใช้สั่ง): "ซูมปืนค้างไว้ = ขึ้นเฮลิไม่ได้ ต้องเลิกซูมก่อน"
- 7175-7514 🌐 ผู้เล่นออนไลน์ใน map เดียวกัน (รอบ 414) — Firebase /world/invasion
- 7515-7573 💨 ควันตามหลังมิสไซล์ (รอบ 531 — ผู้ใช้สั่ง) — สไปรต์ควันนุ่มปล่อยเป็นระยะ
- 7574-7741 🔥🌀 รอบ 565 (ผู้ใช้สั่ง): ยานลูก "หลบมิสไซล์ที่ล็อกได้" — ปล่อยแฟลร์ + บิดหนี
- 7742-7820 🔫↩️ รอบ 568 (ผู้ใช้สั่ง): ยานลูกที่ "ถูกเรดาร์ล็อก" ยิงสวนกลับใส่เฮลิผู้เล่น
- 7821-8022 🔥🛡️ รอบ 569 (ผู้ใช้สั่ง): แฟลร์ของ "เฮลิผู้เล่น" + เสียงเตือนตอนถูกล็อก
- 8023-8033 🏃🪖 รอบ 530: หน่วยรบเคลื่อนที่เชิงยุทธวิธี (ผู้ใช้สั่ง: "อย่าปักหลักยืนทื่อ
- 8034-8159 🧘🎯 รอบ 586 (ผู้ใช้ส่งคลิป: "ตัวละครดิ้นไปดิ้นมา ไม่เป็นธรรมชาติ")
- 8160-8335 📣 รอบ 471: ทหารฝ่ายเราตะโกนบอกทิศศัตรู (ผู้ใช้สั่ง)
- 8336-8778 🌙 รอบ 471: โหมดกลางคืน — ฉากมืดสลัว + ท้องฟ้าดาว + ไฟฉายติดปืน
- 8779-9045 🔵💀 รอบ 576 (ผู้ใช้สั่ง): ยานแม่ยิง "ลำแสงสีฟ้า" ลงมาใกล้ตัวผู้เล่น — เตือน 3 ครั้ง ครั้งที่ 4 ตายจริง
- 9046-9096 ⚡👾 รอบ 579 (ผู้ใช้สั่ง): "ทุก 5 นาที สุ่มยานลูก 10 ลำ เร่งความเร็ว 10 เท่า นาน 10 วินาที แล้ววนลูป"
- 9097-9169 🔁 ลูปหลัก
- 9170-9849 ▶️ เข้า/ออกโลก
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
PANT_FROM:365 · MIS_MAX:368 · PLAYER_HP:369 · SQUAD_N:372 · SQUAD_GAP:373 · HELI_CHASE_SPD:374
SQUAD_RUN:375 · HELI_MAX:381 · HELI_ACCEL:385 · HELI_LAND_VY:388 · HELI_CRUISE:391 · HELI_SKID:392
HELI_GUN_MUL:395 · PH_GUN_GAP:396 · PH_MIS_MAX:397 · NET_SEND_MS:400 · CHAT_MS:401 · CHAT_PRESETS:402
PEER_COLORS:403 · TAU:405 · CSS:414 · buildDom:951 · HELI_XF:1540 · HELI_OD_AMBER:1541
CHORUS_RANGE:1697 · resumeAudio:1729 · tryTex:1737 · letterSpriteTex:1748 · sandTex:1759 · wallTex:1780
BULLET_SPD_R93:1806 · loadGlb:1852 · tameGlbMaterials:1882 · fitInto:1894 · HILLS:1909 · buildTerrain:1918
baseLow:1952 · buildTown:1958 · TREE_LOD:2039 · buildTreesGlb:2041 · refreshTreeInstances:2067 · tickTreeLod:2085
STREET_Z0:2095 · instancer:2099 · buildWarStreet:2113 · sandbagWalls:2218 · squadCoverSpots:2226 · buildDustMotes:2236
tickDust:2247 · HOUSE_SIZE:2270 · HOUSE_LOD:2271 · HOUSE_COVER:2272 · HOUSE_CELL:2273 · HOUSE_SPOTS:2274
buildHouses:2280 · buildBlockGrid:2306 · gridBlocked:2342 · houseBlocked:2349 · houseCover:2358 · tickHouseLod:2366
findSniperSpots:2375 · buildMothership:2403 · layoutLetterPanels:2456 · makeFighter:2463 · drawFighterBar:2517 · SOLDIER_PARTS:2538
joint:2552 · buildSoldierRig:2556 · loadSoldierGlb:2599 · applySoldierGlb:2600 · BODY_MAP:2644 · mergeMeshList:2656
faceModelForward:2697 · skinSoldierLimb:2752 · autoRigSoldier:2794 · fitSoldierGround:2926 · poseSoldier:2952 · MUZZLE_BY_WEAPON:3073
FLASH_COLOR:3075 · makeSoldierFlash:3076 · makeSoldier:3083 · makeHeli:3114 · HELI_ROTOR_NODES:3157 · HELI_TROTOR_NODES:3158
HELI_LEN:3159 · HELI_DESERT:3160 · BOARD_DIST:3161 · AUTO_BOARD_DIST:3166 · HELI_COL_SENS:3173 · heliPiloting:3174
START_MS:3175 · START_PHASES:3176 · HELI_PADS:3183 · SEAT_VIEWS:3191 · heliModel:3202 · buildHeliPads:3244
padAt:3253 · movePad:3259 · startPhaseText:3264 · setSeatView:3271 · tickPads:3284 · CP_NAT:3305
CP_GAUGES:3306 · CP_LAMP:3317 · FUEL_MAX:3320 · FUEL_WARN:3321 · ENG_AMB:3323 · HOT_FULL:3330
heliLift:3332 · cpRpmNow:3337 · CP_SEAT_FULL:3338 · CP_ZOOM:3339 · CP_DASH_OFF_Y:3340 · CP_DASH_DROP:3341
CP_RPM_MAX:3345 · CP_SHAKE_RPM:3346 · loadCockpitImg:3351 · layoutInvCockpit:3367 · cpNeedle:3395 · cpArc:3412
cpRoundRect:3418 · tickHeliGauges:3425 · tickHeliHot:3450 · heliLampLv:3467 · ALARM_GAP:3476 · ALARM_KEYS:3477
resetHeliAlarm:3479 · tickHeliAlarm:3480 · cpLamps:3496 · drawInvGauges:3530 · ZERO_DIST:3637 · GUN_VIEW:3651
GUN_POS:3716 · GUN_ROT:3717 · GUN_SCALE:3718 · useGunView:3720 · MUZZLE_Y:3726 · buildFist:3739
buildArms:3759 · HAND_POSE:3796 · makeHandTopMat:3805 · FOREARM:3811 · addForearm:3812 · loadHandModel:3820
applyHandPose:3842 · fitArmsToWeapon:3851 · buildRifleModel:3857 · buildR93Model:3878 · GUN_CUT:3933 · GUN_STRETCH:3934
orientGunModel:3939 · stretchGunBarrel:3965 · mergeGunParts:4023 · forceGunForward:4048 · attachBoltHandle:4080 · tickBolt:4108
tickBarrelHeat:4151 · muzzleSmoke:4160 · alignGunMuzzle:4180 · syncMuzzleAnchor:4216 · buildSelfShadow:4224 · SUN_DIR:4237
tickSelfShadow:4238 · renderViewModel:4253 · vmToWorld:4269 · gunSil:4272 · setGunPose:4297 · buildGun:4325
tickSwap:4411 · applyWeapon:4421 · swapWeapon:4431 · setScoped:4445 · smoothstep:4459 · tickSway:4463
tickAds:4488 · applyRecoil:4609 · applyBreath:4615 · scopeRadius:4628 · scopeRadiusNow:4640 · tickRange:4645
layoutScope:4665 · scopeFovDeg:4715 · renderScopePass:4723 · cycleScopeMag:4751 · renderAmmo:4759 · syncWeaponBtns:4770
fxTex:4788 · fxGlow:4796 · fxFire:4804 · fxRing:4821 · fxDisc:4829 · fxStar:4836
boomFlashLight:4854 · tickBoomLight:4866 · boom:4875 · dustPuff:4941 · sparkAt:4951 · tracer:4966
tickFx:4982 · MSH_PAD:5058 · MSH_COL:5059 · MSH_CORE:5060 · MSH_HINT_GAP:5061 · MSH_FX_MAX:5062
msShieldOn:5064 · msShieldPt:5066 · msShieldRay:5077 · msShieldPow:5092 · shieldBurst:5095 · shieldHit:5156
tickShieldFx:5158 · TRG_COIN:5184 · QUIZ_COIN:5185 · targetTexture:5190 · setTargetWord:5208 · targetSpots:5218
buildTargets:5231 · tickTargets:5260 · quizPool:5288 · newQuiz:5291 · tickQuiz:5297 · renderQuiz:5303
targetWord:5310 · hitTarget:5316 · AIM_OFF:5351 · AIM_BY_GUN:5370 · aimOffNow:5371 · adsPosNow:5375
aimPct:5380 · layoutCross:5382 · aimDir:5385 · fireGun:5393 · ENV_BLOCK_D:5493 · solidAt:5494
envHit:5510 · HOLE_MAX:5569 · holeTexture:5570 · bulletHole:5585 · tickBullets:5596 · RECOIL_PAT:5619
RECOIL_RESET:5620 · addRecoil:5622 · startReload:5636 · tickReload:5644 · launchMissile:5650 · misBusyHint:5677
fireMissile:5681 · tickMisQueue:5717 · RDR_RANGE:5739 · RDR_FIND:5740 · RDR_KEEP:5741 · RDR_LOCK_MS:5742
RDR_BEEP:5743 · RDR_MAX_LOCK:5754 · RDR_ADD_GAP:5755 · SALVO_PER_TGT:5756 · SALVO_PAIR_MS:5757 · SALVO_TGT_MS:5758
LK_NUM:5763 · rdrOn:5764 · resetRadar:5765 · radarPick:5772 · radarHolds:5786 · tickRadar:5792
drawLockBoxes:5822 · drawRadar:5844 · AMK_TRACK:5900 · AMK_DECOY:5901 · AMK_BEEP:5902 · amisRel:5904
drawAMisMarks:5909 · RDR_GAP_TOP:5950 · RDR_GAP_JOY:5951 · RDR_SIZE:5952 · RDR_SIZE_MIN:5953 · RDR_SIZE_SIDE:5954
layoutRadar:5955 · lockTarget:5976 · rayTarget:5986 · raySphere:6003 · damageFighter:6018 · dropFighter:6027
updateArmor:6053 · killMother:6060 · flashScreen:6075 · myUid:6085 · leaderUid:6086 · isLeader:6091
pickWord:6092 · setWord:6105 · adoptWord:6115 · applyShared:6124 · startWave:6139 · completeWord:6149
renderWord:6175 · renderTarget:6185 · tickWordTimer:6196 · renderCoins:6206 · renderHp:6207 · renderHeat:6213
renderMissiles:6219 · toastBan:6229 · bindInput:6239 · moveJoy:6360 · unlockMouse:6368 · solidPushOut:6377
tickPlayer:6392 · hurtPlayer:6472 · MAP_VIEW:6501 · mapToWorld:6502 · worldToMap:6503 · zoneName:6504
buildMapShade:6518 · drawSpawnMap:6537 · safeSpawn:6612 · fitSpawnMap:6622 · openSpawnMap:6633 · applySpawnPick:6642
RIDE_DIST:6665 · RIDE_UP:6666 · RIDE_OFF:6667 · rideableHelis:6668 · findRide:6674 · nearestRideable:6675
ridePos:6685 · setRideView:6697 · boardGunner:6706 · dismountGunner:6725 · tickGunner:6741 · updateGunnerBtn:6781
tickAutoBoard:6797 · heliCount:6809 · zoomBlocksBoard:6827 · enterHeli:6837 · exitHeli:6879 · EXT_CAM:6908
EXT_VIEWS:6929 · EXT_SELF:6944 · EXT_RIDE:6945 · extP:6947 · syncExtBtn:6949 · cycleExtView:6955
resetExtCam:6964 · angDiff:6966 · extCamClear:6971 · extCamera:6990 · seatCamera:7013 · tickHeliFlight:7034
heliCrash:7133 · tickGpws:7143 · syncBotHelis:7165 · netReady:7180 · netJoin:7184 · netSend:7197
peerColor:7218 · nameSprite:7220 · bakedSoldierGlb:7234 · loadPeerSoldier:7235 · peerRig:7244 · setPeerWeapon:7249
peerBody:7254 · buildPeer:7283 · onPeer:7292 · dropPeer:7325 · netLeave:7332 · peerTick:7338
renderBoard:7374 · sendChat:7391 · showPeerBubble:7398 · removePeerBubble:7404 · tickFighters:7410 · tickMother:7463
spawnAlienShot:7486 · tickAlienShots:7498 · smokeTex:7520 · spawnPuff:7531 · spawnSmoke:7541 · spawnDust:7543
tickSmoke:7552 · clearSmoke:7562 · tickHeliDust:7565 · EVA_WARN:7587 · EVA_FLARE_D:7588 · EVA_TURN:7589
EVA_SPIN_MUL:7590 · EVA_SPD_MAX:7591 · EVA_ROLL:7594 · EVA_Y:7595 · FLARE_PODS:7596 · FLARE_COOL:7597
FLARE_N:7598 · FLARE_LIFE:7599 · FLARE_TRAP:7600 · FLARE_CH:7601 · incomingMis:7606 · startEvade:7617
dropFlares:7626 · tickEvade:7654 · clearFlares:7686 · tickMissiles:7687 · CTR_REACT:7756 · CTR_WARN:7757
CTR_GAP:7758 · CTR_BURST:7762 · CTR_BURST_MS:7763 · CTR_SPD:7764 · CTR_DMG:7765 · CTR_MAX:7766
CTR_SPREAD:7767 · CTR_LEAD:7768 · ctrAimPoint:7771 · ctrArming:7778 · counterFire:7782 · tickCounter:7787
SPK_RANGE:7838 · SPK_MS:7839 · SPK_GAP:7840 · SPK_WORLD_GAP:7841 · SPK_BEEP:7842 · AMIS_SPD:7843
AMIS_TURN:7844 · AMIS_DMG:7845 · AMIS_LIFE:7846 · AMIS_MAX:7847 · AMIS_PROX:7848 · PH_FLARE_MAX:7849
PH_FLARE_RE:7850 · PH_FLARE_N:7851 · PH_FLARE_COOL:7852 · PH_FLARE_BACK:7853 · PH_FLARE_DOWN:7854 · PH_TRAP:7855
PH_FLARE_CH:7856 · renderFlareBtn:7859 · dropPlayerFlares:7865 · fireAlienMissile:7897 · clearAMis:7912 · resetSpike:7917
spikeStart:7918 · aMisNear:7920 · tickSpike:7928 · tickAMis:7980 · SQUAD_COVERS:8032 · squadCoverPool:8033
SQ_TURN:8043 · angWrap:8048 · turnTo:8050 · easeLook:8055 · squadTarget:8060 · pickSquadDest:8072
tickSquadMove:8086 · tickSquad:8112 · CALL_DIST:8166 · CALL_NEAR:8167 · CALL_GAP_ALL:8168 · CALL_GAP_ONE:8169
CALL_GAP_DIR:8170 · CALL_MS:8171 · CALL_LINES:8172 · CALL_SECTORS:8183 · bearingKey:8186 · clearSquadBubble:8194
callSprite:8200 · squadShout:8212 · tickSquadCalls:8225 · CHAT_GAP_ALL:8252 · CHAT_LINES:8253 · tickSquadChatter:8259
heliFireAt:8276 · nearestFighterTo:8288 · tickHelis:8294 · DAY:8343 · NIGHT:8345 · collectMsMats:8349
CYCLE_MS:8360 · MODE_ICON:8362 · STORM_MS:8369 · buildStars:8376 · buildStreetLamps:8399 · glowTex:8417
tickStreetLamps:8425 · beamPair:8442 · tickSearchBeams:8453 · buildBarrelFires:8490 · tickBarrels:8508 · tickShootingStar:8518
buildMist:8543 · tickMist:8553 · tickNightSound:8596 · tickSneak:8605 · tickStorm:8616 · nvReady:8632
nvEnter:8633 · nvExit:8639 · tickNvHint:8640 · dropGlowStick:8649 · tickGlowSticks:8666 · buildFlashlight:8675
setNight:8680 · setDayMode:8681 · tickNight:8695 · applyNightLook:8727 · tickFlashlight:8767 · MSB_FIRST:8797
MSB_GAP:8798 · MSB_WARN:8799 · MSB_KILL_WARN:8800 · MSB_NEAR:8801 · MSB_FLEE:8802 · MSB_R:8803
MSB_HOLD:8804 · MSB_MAX:8805 · MSB_DEAD_MS:8806 · MSB_BEEP:8807 · MSB_COVER_R:8810 · MSB_PAD_R:8811
MSB_COVER_RECHECK:8812 · msbEnsure:8817 · msbPlace:8834 · msbBarPos:8843 · msbHide:8850 · resetMsBeam:8854
msbCoverAt:8869 · msbAimBeside:8890 · msbBegin:8896 · msbAim:8913 · msbStrike:8944 · msbKill:8983
msbKickOut:8996 · tickMsBeam:9006 · TURBO_EVERY:9059 · TURBO_MS:9060 · TURBO_MUL:9061 · TURBO_N:9062
TURBO_TRACK:9063 · resetTurbo:9065 · turboPick:9070 · turboBegin:9077 · tickTurbo:9089 · fit:9100
tick:9106 · frame:9114 · build:9173 · start:9235 · exitWorld:9361

## js/lobby.js (52 บรรทัด · 3 รายการ)
PANEL_TITLES:9 · openPanel:20 · closePanel:28

## js/lobby3d.js (780 บรรทัด · 0 รายการ)

## js/main.js (222 บรรทัด · 4 รายการ)
syncMusicBtn:84 · showQuizBackPay:120 · fitQbp:162 · bootGame:176

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

## js/online.js (1,121 บรรทัด · 76 รายการ)
ONLINE_STALE_MS:53 · ONLINE_BEAT_MS:54 · LEADERBOARD_SIZE:55 · onlineDisplayName:59 · onlineActivity:67 · ensureOnlineId:83
onlineKey:93 · onlinePushPresence:98 · onlinePushScore:108 · fetchPlayerStats:138 · onlineRerender:160 · notifyFriendBadges:172
FRIEND_ALPHA:198 · friendCode:199 · friendSearch:211 · friendRequest:235 · friendAccept:244 · friendDecline:256
friendsHeal:266 · CHAT_MAX_LEN:290 · CHAT_KEEP:291 · chatPairId:293 · chatRef:296 · chatListen:302
chatSend:318 · chatDeleteMsg:334 · TYPING_TTL:342 · typingRef:344 · chatSetTyping:345 · chatClearTyping:355
chatWatchTyping:363 · chatThemeRef:381 · chatSetTheme:382 · chatWatchTheme:387 · chatPrune:395 · chatSeenTs:412
chatMarkSeen:418 · chatUnreadCount:430 · chatWatchSync:433 · GIFT_EXPIRE_MS:483 · giftSend:486 · greetSend:500
giftAccept:512 · giftDecline:516 · giftInWatch:522 · giftReclaim:553 · giftOutWatchSync:563 · giftOutRebuild:618
salesWatch:648 · salesRerender:656 · sellInc:660 · marketWatch:668 · marketList:701 · marketUnlist:709
marketBuy:718 · marketSoldWatch:731 · tinvSend:760 · tinvClear:767 · tinvWatch:771 · FEED_MAX:800
feedEvent:803 · feedPrune:814 · feedPurgeCat:825 · feedPushAssets:836 · petDescriptor:854 · feedPushPets:860
fetchPlayerPets:874 · followSet:890 · followUnset:901 · feedRebuild:908 · feedWatchSync:920 · fetchPlayerFeed:947
fetchPlayerAssets:960 · fetchFollowers:979 · onlineStart:988 · onlineLoadSDK:1096

## js/state.js (1,017 บรรทัด · 84 รายการ)
STORAGE_KEY:6 · QUIZ_PASS_REWARD:11 · CURE_COST:13 · HUNGRY_SICK_MS:14 · MEAL_HOUR:16 · MEAL_FULL:17
SLEEP_FROM_HOUR:18 · SLEEP_SICK_HOUR:19 · WAKE_HOUR:20 · DINNER_COST:21 · TOXIN_FULL:23 · DETOX_COST:24
FOODQUIZ_Q:26 · FOODQUIZ_COIN:27 · FOODQUIZ_BONUS:28 · SHAPE_JUNK_MEALS:30 · SHAPE_CLEAN_MEALS:31 · SHAPE_MISS_MEALS:32
SHAPE_EXP_BONUS:33 · HEAT_SICK_MS:34 · THIRST_SICK_MS:35 · DEFAULT_STATE:37 · FEED_CATS:173 · SLOT_MS:184
currentSlotStart:185 · nextSlotStart:191 · mealDayKey:193 · nightKeyOf:195 · newPet:201 · loadState:226
saveState:465 · activePet:472 · petStage:473 · isAdult:478 · abilityOn:479 · hasPetType:480
todayStr:483 · dailyTick:487 · addCoins:490 · QUEST_POOL:510 · QUEST_PER_DAY:520 · questsToday:521
questTick:528 · questEvent:532 · assetValue:568 · netWorth:594 · assetCount:596 · refreshRank:613
heatProtected:629 · rainProtected:633 · petHungry:636 · petShapeOf:640 · updatePetShape:646 · shapeMealDone:653
heatPct:663 · ymStr:672 · billOutstanding:676 · UTILITIES:683 · HOME_UTILITIES:689 · homeDecayed:691
billTick:694 · myCar:763 · carLoanDue:768 · carLoanOverdue:773 · carLoanPayable:778 · carLoanPay:785
compTick:798 · ONLINE_RATE:812 · onlineEarnActive:813 · onlineEarnTick:817 · onlineEarnFlush:828 · marketTick:838
addCraft:862 · ORDER_MAX:881 · ORDER_LIFE_MS:882 · ORDER_GAP_MIN_MS:883 · ORDER_GAP_SPAN_MS:884 · ORDER_TIER_WEIGHT:885
newOrder:886 · orderTick:899 · careTick:907 · expNeed:988 · addExp:993 · addRP:1013

## js/ui.js (7,142 บรรทัด · 288 รายการ)
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
- 1088-1459 การ์ด Leaderboard — สลับแท็บในการ์ดเดียว (ประหยัดพื้นที่):
- 1460-1758 การ์ดข้อมูลผู้เล่น 👤 — คลิกชื่อในการ์ดเพื่อน/กระดาน แล้วโชว์
- 1759-1977 แผงเพื่อน 👥 (ข้อ 0.3): รหัสเพื่อน + ค้นหา + คำขอ + รายชื่อเพื่อน
- 1978-2016 แชทกับเพื่อน (ข้อ 0.4) — กล่องแชทลอยกลางจอ + แผง emoji
- 2017-2323 รอบ 179: หน้ารวมข้อความ (inbox แบบ Messenger — ธีมกระจกฟ้า sci-fi ของเกม)
- 2324-2670 ระบบส่งของขวัญ (ข้อ 0.5) — ห้องของขวัญ + กล่องเลือกส่ง + ฉากเปิด
- 2671-2723 RANK CARD + ฉากเลื่อนแรงค์
- 2724-2726 PET DASHBOARD
- 2727-2879 📰 รอบ 155: overlay ข้อมูลน้อง & การดูแล + ฟีดกิจกรรมเพื่อน
- 2880-3422 📖 Dictionary ค้นหาคำศัพท์ (รอบ 254 ผู้ใช้สั่ง 16 ก.ค. 2026)
- 3423-3466 การนอน (คิว 7725691507 ข้อ 1)
- 3467-3845 ให้อาหาร (ระบบมื้อเย็น 18:00 + ความอิ่มสะสม — ข้อ 2+3)
- 3846-3927 🛡️ ควิซอาหารปลอดภัย (ต่อยอดข้อ 5.1)
- 3928-3991 ร้านค้าไอเทมแต่งตัว (ล็อกช่วงแรกเกิด/ไข่ ตามกติกาใหม่)
- 3992-4179 ที่พัก (หลบแดด/หลบฝน) + เครื่องปรับอากาศ
- 4180-4297 บิลสาธารณูปโภค (ค่าไฟ/ค่าน้ำ — เครื่องยนต์อยู่ใน state.js: UTILITIES/billTick)
- 4298-4380 การ์ดมือถือ (ข้อ 7): ซื้อ 10,000 ขายคืน 6,000
- 4381-4391 การ์ดคอมพิวเตอร์ (ข้อ 11): ซื้อ 50,000 ขายคืน 30,000
- 4392-4547 item 8: โบนัสออนไลน์ +0.01 เหรียญ/วิ ฟรีทุกคนที่เปิดเกมออนไลน์อยู่
- 4548-4763 🎫 การ์ดตั๋วโลกผจญภัย (คิว 7725691507 ข้อ 7)
- 4764-4845 🎃 การ์ดตั๋วโลกผีสิงกลางคืน (ต่อยอดข้อ 8 · ผู้ใช้เคาะ 7 ก.ค.)
- 4846-4949 🚁 การ์ดตั๋วโลกเฮลิคอปเตอร์ Bell (รอบ 52)
- 4950-5049 🛸 การ์ดตั๋วโลกโดรน FPV Racing (รอบ 85) — ซื้อได้เมื่อมีตั๋วเฮลิคอปเตอร์
- 5050-5240 🚗 การ์ดตั๋วโลกขับรถกำแพงเพชร (รอบ 113) — ซื้อได้เมื่อมีตั๋วโดรน FPV
- 5241-5333 ⚽ การ์ดตั๋วโลกสนามฟุตบอล (รอบ 196) — ซื้อได้เมื่อมีตั๋วขับรถ
- 5334-5429 🏍️ การ์ดตั๋วโลกมอเตอร์ไซค์บ้านโพธิ์สวัสดิ์ (รอบ 293) — ซื้อได้เมื่อมีตั๋วขับรถ
- 5430-5527 🛸 การ์ดตั๋วโลก "ยานแม่บุกโลก" (Invasion · รอบ 413)
- 5528-5679 🌍 ปุ่มลัดเข้าโลก 3D ในรางเมนูซ้าย (ผู้ใช้สั่ง 9 ก.ค. 2026)
- 5680-5849 การ์ดสวนผลไม้ (ข้อ 12): ซื้อต้นไม้ปลูกได้ไม่จำกัด แต่ละต้นออกผล
- 5850-5859 โรงงานผลิตสินค้า 🏭 + ตลาดขายต่อ (แนวคิดใหม่ 5 ก.ค. 2026)
- 5860-5882 โรงงานผลิต (แผง 🏭) — แยกออกจากตลาด (ผู้ใช้สั่ง 6 ก.ค. 2026)
- 5883-6033 ตลาดขายสินค้า (แผง 🏪) — แยกออกจากโรงงาน
- 6034-6937 🚗 รอบ 131: หมวดยานพาหนะ — โชว์รูมรถ 10 คัน (แคตตาล็อก 5 ช่อง/แถว)
- 6938-6998 ร้านสัตว์เลี้ยง (ซื้อเพิ่มได้ ไม่ลบตัวเดิม)
- 6999-7035 เลเวลอัพ (รายตัว)
- 7036-7105 สถิติผลการเรียนรู้
- 7106-7142 item 4: การ์ดสรุปส่งครู — ใบเดียวจบ ชื่อ/วัน-เวลา/เหรียญวันนี้/แรงค์/สอบล่าสุด
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
bindOnlinePager:857 · renderOnlineCard:890 · bindInviteCards:1002 · bindFriendQuickMenu:1022 · openFriendQuickMenu:1032 · LB_TABS:1094
LB_WS_TOP:1095 · bindLbTabs:1097 · updateRankRailBadge:1120 · rankUpCheck:1139 · rankUpSound:1163 · renderLeaderboardCard:1174
bindLbGroupOpen:1200 · lbRankRows:1212 · lbDemoRows:1247 · lbChar:1269 · openLeaderboardFull:1278 · BLK_PAD:1351
seatPodChars:1353 · lbCoinHtml:1363 · lbBadgeHtml:1379 · lbBossHtml:1405 · lbWordSearchHtml:1428 · bindPlayerClicks:1465
showPlayerCard:1475 · petDescImg:1688 · openImgLightbox:1701 · openPetPeek:1721 · updateBillBadges:1765 · setBadge:1777
updateSettingsBadge:1793 · openAttentionSummary:1807 · updateFriendBadge:1849 · renderFriendPanel:1859 · friendDoSearch:1907 · refreshFriendData:1931
CHAT_EMOJI_CATS:1983 · CHAT_THEMES:2005 · CHAT_SECRET_MS:2014 · chatBadgeSync:2022 · ibTimeStr:2030 · openChatInbox:2037
openChat:2140 · giftImg:2327 · giftDateStr:2329 · GREETS:2337 · GREET_EXP:2345 · greetInfo:2346
openGreetPicker:2350 · giftItemPic:2392 · giftItemName:2400 · updateGiftBadge:2406 · renderGiftPanel:2415 · acceptGift:2473
declineGift:2496 · showGreetReveal:2505 · showGiftReveal:2532 · openGiftPicker:2558 · confirmSendGift:2626 · doSendGift:2650
rankBadgeHTML:2674 · renderRankCard:2679 · showRankUp:2701 · bindPetPlateButtons:2736 · openPetInfoOverlay:2760 · feedAgo:2783
renderFeedCard:2796 · alignPetTabs:2849 · alignCureBtn:2867 · dictRecordLookup:2891 · DICT_FILE_COUNT:2902 · loadDict:2903
dictSearch:2918 · dictTapWords:2933 · dictEntryHTML:2937 · openDictOverlay:2948 · renderDashboard:3032 · sleepBtnHTML:3428
sleepHintHTML:3435 · sleepAllPets:3446 · wakeAllPets:3459 · feedPet:3470 · openFoodMenu:3484 · feedWith:3555
AVATAR_UI:3585 · playerAvatarHTML:3588 · SHAPE_UI:3594 · showFeedResult:3603 · curePet:3644 · heartsFx:3667
PAT_HOLD_MS:3690 · PAT_EXP:3691 · bindPetTap:3692 · petBounce:3710 · petMood:3716 · shortPatPet:3723
longPatPet:3731 · patCalendarHTML:3751 · patStreakTick:3779 · cureCelebrateFx:3805 · railCureClick:3816 · detoxPet:3828
openFoodQuiz:3851 · renderShop:3931 · homeVisualHTML:3995 · showHomeRuined:4009 · showCutNotice:4030 · renderHomeCard:4048
payMaint:4132 · trashBillUI:4148 · payTrash:4165 · UTILITY_UI:4184 · utilityBillUI:4233 · payUtility:4258
buyUtilityFix:4284 · renderPhoneCard:4302 · buyPhone:4342 · sellPhone:4364 · compLiveTotal:4385 · onlineLiveTotal:4396
renderOnlineEarnPill:4401 · openPillInfo:4424 · renderComputerCard:4471 · buyComputer:4506 · sellComputer:4529 · soldCount:4555
soldBadge:4556 · renderTicketCard:4561 · loadScriptOnce:4617 · loadAdv3d:4634 · enterAdventure3D:4641 · pickAdvMap:4666
enterHaunted3D:4701 · advHealClick:4723 · buyTicket:4743 · renderHauntCard:4769 · buyHauntTicket:4824 · renderHeliCard:4851
buyHeliTicket:4909 · enterHeli3D:4932 · renderDroneCard:4954 · buyDroneTicket:5009 · enterDrone3D:5032 · renderDriveCard:5055
buyDriveTicket:5129 · enterDrive3D:5152 · pickDriveMap:5187 · enterMotoMapAsCar:5223 · renderSoccerCard:5245 · buySoccerTicket:5293
enterSoccer3D:5316 · renderMotoCard:5339 · buyMotoTicket:5388 · enterMoto3D:5411 · renderInvasionCard:5434 · INVASION_REWARD:5483
buyInvasionTicket:5485 · enterInvasion3D:5509 · WORLD3D:5534 · gotoRobotShop:5545 · scrollShopCardIntoView:5550 · railWorldClick:5553
renderRailWorlds:5574 · tinvNoticeHTML:5633 · openTinvPicker:5641 · fruitCountdown:5685 · renderFarmCard:5697 · renderFarmClock:5772
buyFruit:5788 · sellFruit:5808 · sellAllFruit:5829 · collectImg:5858 · renderFactoryCard:5864 · renderMarketCard:5887
updateWishBadge:5943 · openWishlistDialog:5954 · bindStripArrows:5999 · renderMarketBrowse:6011 · carImg:6040 · renderVehicleShop:6041
CS_CYCLE_MS:6092 · carInteriorImg:6093 · carStatHtml:6095 · renderCarShowroom:6102 · csShowBig:6128 · csInit:6155
RS_CYCLE_MS:6178 · robotImg:6179 · renderRobotShop:6180 · rsShowBig:6202 · rsInit:6223 · buyRobot:6242
enterMecha3D:6264 · pickMechaRobot:6285 · pickDriveCar:6317 · openCarBuyDialog:6360 · buyCarInsurance:6421 · payCarLoanMonthly:6440
payCarLoanFull:6452 · carDriveBlock:6471 · gotoVehicleShop:6476 · gotoMyStock:6481 · showNeedCarDialog:6487 · craftDiscount:6499
renderFactory:6502 · renderOrdersUI:6564 · startProduce:6583 · buyCollectible:6611 · cancelProduce:6639 · deliverOrder:6653
renderOrderClock:6670 · renderCollectMine:6680 · openListDialog:6722 · cancelListing:6775 · buyMarketItem:6798 · showCollectReveal:6825
buyAC:6863 · openHomeShop:6882 · renderPetShop:6941 · showLevelUp:7002 · renderStats:7039 · showTeacherCard:7110

## js/util.js (745 บรรทัด · 32 รายการ)
shuffle:6 · fmtNum:15 · escapeHTML:19 · seededRand:25 · fmtThaiDT:35 · fmtThaiDate:39
showScreen:44 · TOAST_WARN_RE:52 · restackToasts:55 · toast:77 · floatFx:97 · beep:107
PET_MOOD:166 · petVoiceSynth:173 · sirenSynth:250 · playCashier:274 · cashierSynth:288 · playSpark:321
sparkSynth:335 · thunderFx:370 · wordAudioFile:438 · speakWord:441 · speakLetter:461 · pickSpeakVoice:480
speakWordTTS:491 · askNameDialog:511 · askConfirm:551 · alertBox:569 · applyNoAnim:589 · openSettings:594
openHelp:700 · openTeacherGuide:726

## js/vocabbook.js (207 บรรทัด · 14 รายการ)
VB_MAX:11 · VB_QUIZ_N:12 · VB_QUIZ_MIN:13 · vbGroup:16 · VB_GROUP_UI:21 · vbRecord:24
vbSeen:49 · vbStats:62 · vbList:70 · vbReviewCat:81 · vbStartReview:95 · openVocabBook:106
vbRender:148 · vbCardHTML:194

## js/wordsearch.js (407 บรรทัด · 0 รายการ)

## js/wsaward.js (241 บรรทัด · 0 รายการ)

## css/lobby.css (2,680 บรรทัด · 503 selector)
:root:6 · html:15 · body:16 · *:33,34,35,36 · #app:39 · h1:41
.subtitle:42 · .shop-title:43 · #rotate-overlay:46 · .screen:68 · #screen-select:77,78,79,80(+5) · .egg-need:87
.petshop-topright:89 · .petshop-play-link:90,95 · #screen-quiz:134,135,136,137(+6) · #quiz-choices:146,147 · .word-card:154 · .quiz-choice:155,156,157
.big-btn:160,161,162,163 · #screen-dashboard:168,814,822 · .lobby-top:175,603,604,605(+3) · .top-flex:176 · .profile-plate:177,181,524 · #rain-fx:186
.rain-layer:189,195 · .rain-glass:202 · .glass-drop:203 · .rail-btn:218,614,620,621(+16) · .rail-badge:219 · .fr-code-box:224
.fr-code-label:228 · .fr-code-row:229 · .fr-code:230 · .fr-copy-btn:235,239,244,245 · .fr-search-btn:240 · .fr-add-btn:241
.fr-accept:242 · .fr-decline:243 · #fr-search-input:246 · #fr-search-result:250 · .fr-found:251 · .fr-hint:255
.fr-list-title:256 · .fr-row:257 · .fr-req:261 · .fr-row-name:263,267 · .fr-row-status:271 · .fr-req-btns:272
.online-dot:273 · .fr-chat-btn:274,279,281 · .fr-unread:282 · .chat-overlay:289 · .chat-box:293,402,409,416(+12) · .chat-head:305
.chat-theme-btn:310,314 · .chat-secret-tg:315,316 · .cs-switch:317,318,323,324 · .cs-slider:319,321 · .chat-secret-note:325 · .chat-theme-strip:328
.chat-theme-sw:330,333,334,335(+1) · .chat-head-name:337,338 · .chat-close:339 · .chat-msgs:343 · .chat-empty:347 · .chat-typing:349
.ct-dots:351,352,354,355 · .no-anim:357,370,671,700(+27) · .chat-bubble:358,363,368 · .chat-emoji:371 · .chat-emo:375,379 · .chat-input-row:380
.chat-emoji-btn:384 · #chat-input:388 · .chat-send:392,397,398 · .pl-click:465,467,468 · .pl-overlay:469 · .pl-card:473,2023
.pl-close:479 · .pl-head:483,1929,1932 · .pl-grade:488 · .pl-badges:490 · .pl-badge-chip:491,495 · .pl-body:496
.pl-loading:497 · .pl-none:498 · .pl-me-tag:499 · .pl-blk-wrap:501 · .pl-blk:502 · .pl-stat:503
.pl-lbl:508 · .pl-val:509,510 · .pl-tip:511 · .chip-edit:517,522,523 · .rank-mini:529,535,536,537 · .pass-photo:539,544
.pet-tabs:546 · .dict-box:547,551,552,553(+1) · .dict-card:559,564,568,569(+2) · .dict-head:565,566 · .dict-trail:573,577 · .dt-c:578,582,583
.dt-sep:584 · .dict-today:585 · .di-w:587,588,589 · .dict-list:590 · .dict-item:591,595,596,597(+5) · .lobby-mid:611
.lobby-rail:613 · .rail-worlds:631 · .rail-div:632 · .lobby-stage:674,676,692,819(+1) · .newword-banner:682,689,694 · .coin-fly:705,708
.coin-plus:714 · .nw-pop-coin:729,731,732 · .nw-pop-goal:735,736,740,744 · .nw-goal-head:737,739,741 · .nw-goal-bar:742 · .nw-goal-fill:743
.nw-pop-book:745,746 · .nw-tag:767 · .nw-word:772 · .nw-hint:774,775 · .nw-coin:777,780 · .nw-countdown:785
.nw-bar:787 · .nw-bar-fill:789 · .pet-stage:792,2198 · .nw-box:799,2207 · .nw-pop-word:800 · .nw-speak:801
.nw-pop-phon:802 · .nw-ipa:803 · .nw-pop-sent:804 · .nw-pop-mean:805 · .pet-tab:806,807,808,2532 · .stage-hero:829,844,852,997(+5)
.hero-ground:866,986,992 · .hero-rank-bg:868,871,874,878(+18) · #lobby3d-canvas:891,892 · .hero-scene:896,898,905,906(+8) · .caretaker-fig:945 · .caretaker-img:948
.caretaker-emoji:950 · .blk-rig:957,958,959 · .stage-plate:1019,1027,1038,1039(+30) · .plate-title:1033 · .lobby-side:1076,1112,1117,1120(+22) · .side-sec:1079,2447
.side-label:1080,1085 · .side-label-row:1088,1089 · .lb-tabs-out:1090,1091,1095 · .side-glass:1099,1106 · .side-card:1118,1230 · #quest-card:1130,1154,1155,1156(+6)
.q-bigcard:1131,1160,1161,1164(+1) · .qb-top:1133 · .qb-emoji:1134 · .qb-name:1136 · .qb-bar:1137,1138 · .qb-row:1140
.qb-prog:1141 · .qb-reward:1142 · .qb-go:1143,1147 · .q-dots:1148 · .q-dot:1149,1150,1151 · .q-bonus:1152
.feed-row:1175,1867,1872 · .inv-card:1177,1179,1180 · .inv-btns:1181 · .inv-go:1182,1184 · .inv-x:1185 · #online-card:1189,2455,2456,2457(+1)
.fq-overlay:1190 · .fq-box:1192,2263 · .fq-head:1196,1198 · .fq-close:1199 · .fq-sec:1201 · .fq-worlds:1202
.fq-world:1203,1205 · .fq-acts:1206 · .fq-act:1207,1210,1211 · .lb-prize:1244 · .lb-award-bar:1245,1251,1252 · .lb-award-go:1253
.lbf-award:1255,1261,1262,1263 · .pod-pz:1264 · .wsa-overlay:1267 · .wsa-box:1269 · .wsa-head:1274 · .wsa-title:1275
.wsa-when:1276,1277 · .wsa-close:1278,1281 · .wsa-cols:1282 · .wsa-col:1283 · .wsa-sec-h:1284,1285 · .wsa-msg:1286
.wsa-msg-h:1289 · .wsa-msg-b:1290,1291 · .wsa-msg-none:1292 · .wsa-rules:1294,1295 · .wsa-list:1296 · .wsa-row:1297,1299
.wsa-r:1300 · .wsa-n:1301 · .wsa-s:1302 · .wsa-p:1303 · .wsa-prizes:1304 · .wsa-pz:1305,1308
.wsa-reveal-medal:1309 · .lobby-bottom:1319,1321 · .lobby-quiz-btn:1322 · .lobby-book-btn:1323,1324 · .lobby-foodquiz-btn:1325,1326 · .lobby-play-btn:1327,1331
.lobby-exam-btn:1333,1334,1336 · .panel-overlay:1341,1346 · .panel-box:1347 · .panel-head:1354,1358 · .panel-close:1359,1364 · .panel-body:1365,1369,1370
.panel-page:1367,1368 · .collect-sub:1374 · .mkt-empty:1375 · .craft-box:1376 · .mkt-listing:1377 · .mkt-filter:1378,1722
.hq-grid:1385 · .hq-card:1386,1391,1415 · .hq-head:1392 · .hq-pic:1398,1400 · .hq-emoji:1402 · .hq-badge:1403
.hq-stars:1407 · .hq-price:1408,1413,1414,1417(+6) · .craft-credit:1421,1423,1424 · .car-grid:1431,1433,1434 · .robot-weap:1435 · .dmap-box:1438,1439
.dmap-grid:1445 · .dmap-card:1447,1450,1451,1452(+2) · .dmap-ico:1454 · .dmap-new:1457 · .dcp-grid:1459 · .dcp-card:1461,1464,1465,1466(+10)
.levelup-box:1483,2164,2165,2260 · .dcp-box:1486,1487,1491,1492(+6) · .dcp-lock:1500 · .sold-badge:1504,1506,1507 · .rs-showroom:1509 · .rs-list:1510,1512
.rs-thumb:1513,1515,1516,1517(+1) · .rs-thumb-pic:1518,1519 · .rs-thumb-price:1520 · .rs-stage:1522 · .rs-big:1525 · .rs-big-img:1526
.rs-elec:1530,1534,1539 · .rs-edge:1540,1546 · .rs-info:1549,1550,1551,1552(+1) · .rs-buy:1554,1556,1557 · .cs-showroom:1561 · .cs-list:1562,1564
.cs-thumb:1565,1567,1568,1569(+1) · .cs-thumb-pic:1570,1571 · .cs-thumb-name:1572 · .cs-thumb-price:1573 · .cs-thumb-own:1574 · .cs-stage:1576
.cs-big:1579 · .cs-big-img:1580 · .cs-elec:1584,1588,1592 · .cs-edge:1593,1599 · .cs-interior:1602 · .cs-inr-label:1603,1604
.cs-inr-img:1605 · .cs-info:1607,1608,1609,1610(+6) · .cs-buy:1618,1620,1621,1622 · .car-emoji:1624 · .car-mine:1630 · .car-mine-pic:1635
.car-mine-info:1636 · .car-loan:1637,1638 · .car-mine-btns:1639,1640,1641 · .car-locked:1643 · .car-mine-head:1645 · .car-pick-list:1646,1647
.car-pick:1648,1650,1651 · .car-pick-pic:1652,1653 · .car-pick-name:1654,1655 · .car-pick-od:1656 · .car-buy-box:1658,2267 · .cb-pic:1659,1660,1661
.cb-lines:1662 · .cb-li:1663,1667,1668 · .cb-ins:1669,1673,1674 · .cb-plan:1675 · .cb-pl:1676,1681,1683,1687(+1) · .cb-total:1694
.cb-btns:1695,1700 · .cb-x:1696 · .shop-grid:1703 · .shop-item:1704,1709,1714,1715(+3) · .mkt-tab:1723,1724 · .pg-btn:1725,1726,1727
.pg-dot:1728 · .fr-gift-btn:1750,1755 · .gift-sec-title:1758 · .gift-in-row:1760 · .gift-out-row:1764 · .gift-in-pic:1765,1767,1768
.gift-in-info:1769,1770 · .gift-in-btns:1771 · .gift-accept:1772,1776,1778 · .gift-decline:1777 · .gift-box-card:1779 · .gift-box-from:1780,1781
.gift-note:1782 · .gift-pick-overlay:1785 · .gift-pick-box:1789 · .gift-pick-head:1795,1799 · .gift-pick-close:1800 · .gift-pick-tabs:1802
.gp-tab:1803,1807 · .gift-pick-body:1808 · .gp-chips:1809 · .gp-chip:1810,1814 · .gp-card:1815,1816 · .gp-price:1817
.gp-note:1818 · .gift-cf-pic:1819 · .chat-emoji-cats:1824 · .chat-emoji-cat:1828,1832,1833 · .chat-emoji-wrap:1834,1835 · .stage-left:1843
.pet-info-btn:1847,1854,1855 · .feed-list:1862,1866 · .feed-ico:1873 · .feed-txt:1874 · .feed-name:1875 · .feed-ago:1876
.feed-empty:1877,1880 · .pi-overlay:1882 · .pi-box:1886,1891,1892,1896(+2) · .pi-close:1898,1903,1904 · .pi-close-left:1906 · .pi-portrait:1908
.pi-dress-btn:1915,1919,1920 · .pi-shape-cap:1921,1924,1925,1926 · .greet-card:1933 · .greet-sub:1934 · .greet-grid:1935 · .greet-opt:1936,1939,1940,1941
.greet-e:1942 · .pi-streak:1946 · .pi-streak-head:1948,1950 · .pi-streak-best:1951 · .pi-dots:1952 · .pi-dot:1954,1955,1956
.pi-streak-note:1957 · .pi-care-title:1958 · .lbf-overlay:1961 · .lbf-box:1964 · .lbf-head:1969 · .lbf-title:1970
.lbf-tabs:1971,1974 · .lbf-close:1977 · .lbf-close-l:1978 · .lbf-body:1979 · .lbf-grid:1980 · .lbf-cell:1982,1985,1986,1987(+1)
.lbf-podium:1991 · .pod:1993,2020,2021 · .pod-char:1995 · .pod-base:1997 · .pod-rank:1999 · .pod-label:2001
.pod-name:2003 · .pod-sc:2005 · .pod-1:2010,2011 · .pod-2:2012,2013 · .pod-3:2014,2015 · .pod-4:2016,2017
.pod-5:2018,2019 · .pl-wide:2024,2027,2028,2029 · .pl-follow:2030,2035,2037 · .pl-unfollow:2039,2045,2046 · .pl-followers:2047 · .pl-cols:2048
.pl-col:2049 · .pl-sec-title:2050 · .pl-feed:2051,2054,2061 · .pl-feed-row:2055,2059,2060 · .pl-assets-wrap:2063 · .pl-assets:2064
.pl-asset:2067,2071,2078 · .pl-asset-emoji:2072 · .pl-asset-n:2073 · .pl-pets-wrap:2080 · .pl-pets:2081 · .pl-pet:2082,2087,2089
.pl-pet-nm:2090 · .img-lightbox:2093,2098,2099,2103(+3) · .pl-chat:2116,2121 · .pet-peek:2122,2123 · .pp-chips:2125 · .pp-chip:2126
.pp-gift:2131,2137 · .settings-box:2139,2140,2209,2214(+20) · .set-feed-head:2141 · .set-feed-sub:2145 · .set-feed-row:2146 · .pillinfo-val:2151
.pillinfo-desc:2156,2175 · .pillinfo-box:2167 · .plf-head:2170 · .plf-emoji:2171 · .plf-ht:2172,2173,2174 · .plf-foot:2176
.alert-box:2181,2183 · .ab-emoji:2184 · .ab-title:2185 · .ab-desc:2186 · .ab-btns:2187,2188,2189 · .heal-heart:2191
.attn-box:2206 · .help-box:2238,2239,2240 · .wl-box:2261 · .food-box:2262 · .home-shop-box:2264 · .summary-box:2265
.report-box:2266 · .wl-grid:2269 · .tc-wrap:2271 · .spell-btn:2277,2282 · .sp-hud:2283 · .sp-word:2285
.sp-ch:2286,2291 · .sp-th:2293 · .sp-hint:2295 · .sp-exit:2298,2302 · .sp-banner:2303 · .sp-big:2308
.sp-thb:2310 · .sp-coin:2311 · #spell-confetti:2316 · .sp-rb:2317 · .sp-day:2327 · .sp-perfect:2329
.sp-late:2331 · #spell-coinpop:2334 · .side-sub:2443,2445 · .sec-quest:2448 · .on-page:2459,2460,2461,2462 · .inbox-overlay:2472
.ib-box:2474 · .ib-head:2478 · .ib-close:2482,2484 · .ib-list:2485,2486 · .ib-row:2487,2488,2489,2490 · .ib-ava:2491
.ib-on:2495 · .ib-mid:2497 · .ib-name:2498 · .ib-last:2499 · .ib-meta:2500 · .ib-time:2501
.ib-dot:2503 · .ib-story-badge:2506 · .ib-empty:2510 · .ib-story:2512,2514 · .ib-story-item:2515,2517,2524 · .ib-story-ava:2518
.ib-story-on:2522 · .ib-world:2527,2530 · #btn-music:2535,2538,2539 · #ws-overlay:2554 · #ws-board:2557,2563,2565 · .ws-head:2568
.ws-title:2569 · .ws-findbar:2572 · .ws-tip:2573 · .ws-grade:2575,2576 · .ws-body:2579 · .ws-gridwrap:2580
#ws-grid:2583 · .ws-cell:2588,2593,2596,2599(+2) · .ws-flash:2605,2607 · .ws-coinpop:2611 · .ws-find:2623 · #ws-prog:2624
#ws-words:2628,2632 · .ws-word:2634,2639,2640,2641(+2) · .ws-actions:2647,2648,2657 · .ws-sizes:2652 · .ws-sizes-lb:2654 · .ws-size-now:2655
#ws-new:2658 · #ws-stash:2659 · #ws-clear:2660 · #ws-win:2661,2663 · .ws-win-in:2664,2667

## css/style.css (1,742 บรรทัด · 458 selector)
:root:5 · *:15 · html:16,21 · input:25 · body:29 · #app:35
.screen:38,39 · h1:42 · .subtitle:43 · .egg-grid:46,63 · .egg-card:47,52,53,54(+2) · .pet-price:57,61
.egg:65,71,75 · .d1:76 · .basket:79,80,85,91(+5) · .basket-dog:89,102,103,104 · .basket-cat:90,105,106,107 · .egg-dragon:110
.topbar:125 · .topbar-coins:126 · .coin-pill:127,138,142,147(+2) · .coin-ic:134 · .no-anim:148,550,1459,1699(+2) · .net-coin:150
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
.rankup-badge-img:503 · .rankup-name:505 · .rankup-en:509 · .rankup-sub:513 · .rankup-btn:514,521,522 · .qbp:526,527,528,529(+4)
.cr-btn-row:535 · .rankup-btn-2:536,537 · .thunder-fx:540 · .quake:541 · .pet-tabs:553 · .pet-tab:554,560,561
.pet-card:563 · .pet-stage:568 · .aura:569,575 · .sp1:576 · .pet-wrap:579 · .pet-emoji:580
.pet-img:581 · .egg-img:582 · .feed-pet:583,729 · .pet-baby:584 · .pet-adult:585 · .pet-egg-stage:587
.wear:589 · .wear-head:590 · .wear-face:591 · .wear-neck:592 · .pet-name:594 · .stage-label:595
.level-row:596 · .level-badge:597 · .exp-bar:601 · .exp-fill:602 · .exp-text:603 · .ability-box:605,609
.hunger-bar:612 · .hunger-fill:613,614,615 · .food-item:621,663,667,668(+6) · .hunger-text:625 · .heat-bar:628 · .heat-fill:629
.heat-text:630,631,632 · .care-row:634 · .care-btn:635,639,642 · .btn-feed:640 · .btn-cure:641 · .sick-banner:643
.pet-sick:647 · .pet-asleep:650 · .sleep-badge:651 · .btn-sleep:653 · .dinner-btn:656 · .food-box:660,661
.food-grid:662 · .fav-tag:682 · .fd-exp:686 · .food-sec:688 · .food-sec-human:692 · .bad-tag:694
.fd-toxin:698 · .fd-safe:699 · .fq-box:702,703 · .fq-progress:704 · .fq-pair:705,706 · .fq-ask:707
.fq-why:708 · .fq-btns:712,713,717 · .fq-yes:718 · .fq-no:719 · .fq-next:720 · .food-cancel:721
.feed-box:727,728 · .feed-gain:730 · .sick-badge:734 · .big-btn:740,746,979,980(+6) · .shop-card:749 · .shop-title:753
.shop-grid:754 · .shop-item:755,759,760,761(+4) · .it-tag:766 · .tag-wear:767 · .lock-banner:769 · .home-current:775,780,781
.home-img:782 · .home-emoji:783 · .home-btn:784,806 · .home-layout:786 · .home-pic-col:787,793 · .home-img-big:791
.home-info-col:794,796,799,800 · .home-name-row:797 · .home-desc-row:798 · .home-shop-box:808,809 · .home-list:810 · .home-option:811,815,816,817(+1)
.home-opt-img:818 · .home-opt-body:820,821 · .home-price:822 · .reset-link:827 · .login-card:833 · .login-pets:834
.login-status:835 · .google-btn:836,842,843 · .login-note:844 · .install-btn:847,853,854 · .install-guide-overlay:857 · .install-guide:861,865,868
.install-steps:866,867 · .install-guide-close:869 · .login-account:874 · .register-card:877,881,899,903 · .reg-safety:883,885,886 · .reg-privacy:888,890,891
#screen-register:893,894,895,896(+2) · .student-chip:904 · .clock-chip:908 · .online-count:914 · .online-row:921,925,926 · .online-dot:930
.online-name:935 · .online-act:939 · .online-live:943 · .online-note:947 · .lb-empty:950 · .lb-list:951
.lb-row:952,956,957 · .lb-rank:961 · .lb-name:963,967 · .lb-coins:971 · .lb-hint:973 · .lb-badgeline:974
.lb-tabs:976 · .lb-tab:977,978 · .tinv-note:989 · .cat-card:995,1016,1095,1100 · .cat-head:999 · .cat-emoji:1000
.cat-name:1001 · .cat-pass:1002 · .cat-info:1003 · .cat-btns:1004 · .cat-btn:1005,1009,1010,1011(+2) · .band-sec-head:1014,1015
.band-mine-tag:1017 · .bsp-box:1020,1023 · .bsp-head:1024 · .bsp-prog:1025 · .bsp-retake:1027,1030 · .rts-box:1033
.rts-head:1035 · .rts-sets:1036 · .rts-set:1037,1038,1039 · .rts-sub:1040 · .rts-words:1041 · .rts-word:1042,1044,1045
.rts-foot:1046 · .rts-okbtn:1047,1049 · .bsp-grid:1050 · .bsp-chip:1051,1054,1055,1056(+1) · .bsp-num:1058 · .bsp-best:1059
.bsp-tick:1060 · .bsp-foot:1061 · .vb-box:1064,1066 · .vb-head:1067 · .vb-total:1068 · .vb-quizbtn:1069,1071
.vb-tabs:1072 · .vb-tab:1073,1075,1076 · .vb-words:1077 · .vb-word:1078,1081,1082,1083(+3) · .vb-empty:1087 · .vb-foot:1088
.vb-pg:1089,1091 · #vb-pginfo:1092 · .vb-hint:1093 · .band-lock:1101 · .offline-btn:1102,1103 · .quiz-progress:1108
.quiz-phon:1109 · #quiz-extra:1110,1112,1113,1114 · .quiz-word-card:1115 · .quiz-next:1121,1127,1128,1129(+1) · .quiz-choice:1132,1137,1138,1139 · .quiz-score-pill:1140
.stats-card:1143 · .stats-title:1147,1580 · .stats-row:1148,1149,1150,1151 · .game-top:1154 · .back-btn:1155 · .combo-pill:1159
.timer-wrap:1163 · .timer-fill:1164,1165 · .board-label:1167 · .card-grid:1168 · .word-card:1169,1175,1176,1177(+3) · .hint-btn:1183,1188
.game-endless-note:1191,1196,1198,1202(+6) · .report-btn:1223,1228 · .report-box:1231 · .report-close:1232 · .rp-head:1236 · .rp-avatar:1237,1238
.rp-title:1239 · .rp-sub:1240 · .rp-levelcard:1242 · .rp-level-top:1246 · .rp-bar:1247 · .rp-bar-fill:1248
.rp-level-note:1249,1250 · .rp-grid:1252 · .rp-stat:1253 · .rp-ic:1256 · .rp-num:1257 · .rp-lbl:1258
.rp-section:1260 · .rp-h3:1261 · .rp-badge-mini:1262 · .rp-row:1263,1264,1265 · .rp-empty:1266 · .rp-badges:1267
.rp-badge:1268 · .rp-tline:1271 · .rp-tl-head:1272,1273 · .rp-tl-ems:1274 · .rp-em:1275,1276 · .rp-tl-note:1277,1278
.rp-crown:1280,1281 · .rp-wtitle:1283 · .rp-wnow:1284,1285 · .rp-wgraph:1286 · .rp-wcol:1287 · .rp-wval:1288
.rp-wbar:1289,1290 · .rp-wlbl:1291 · .rp-cheer:1293 · .report-ok:1297 · .summary-box:1300,1351,1355,1356(+2) · .sm-burst:1301
.sm-title:1303 · .sm-line:1304 · .sm-coin:1305 · .sm-matches:1311,1312 · .confetti:1314 · .sm-badge:1321
.sm-badge-all:1325 · .badge-celebrate-overlay:1328,1341 · .badge-celebrate:1332 · .bc-emoji:1338 · .bc-title:1339 · .bc-sub:1340
.sm-cheer:1345 · .sm-streak:1346,1347 · .sm-sick:1348 · .sm-btns:1349 · .float-fx:1361 · .toast:1368
.toast-warn:1375,1382,1383,1389 · .toast-clear-all:1391,1398 · .alert-box:1400 · .alert-ok:1401,1406 · .settings-box:1408 · .set-row:1409
.set-hint:1413 · .set-hint-on:1414 · .set-hint-off:1415 · .set-lwrap:1416 · .set-label:1417 · .set-desc:1418
.set-switch:1419,1423,1424,1429(+4) · .set-sw-knob:1425 · .set-sw-txt:1432 · .set-close:1438,1443 · .set-help:1444,1449 · .help-box:1451,1452,1457
.help-item:1453 · .update-banner:1465,1474,1475 · #update-reload:1476 · #update-dismiss:1480 · .levelup-overlay:1486 · .levelup-box:1490,1497,1498,1499(+4)
.bill-box:1505,1509,1510 · .tag-off:1511 · .home-decayed-img:1512 · .home-dark-img:1513 · .thirst-fill:1514 · .thirst-text:1515,1516
.toxin-fill:1519 · .toxin-text:1520,1521 · .detox-btn:1522,1527 · .shape-text:1530,1531,1532,1533(+1) · .avatar-pick:1537 · .avatar-opt:1538,1542,1543,1544
.avatar-chip-img:1548 · .avatar-chip-blk:1550 · .set-avatar-btns:1551 · .avatar-mini:1552,1556 · .set-blk-row:1558 · .set-sub2:1559
.blk-grid:1561 · .blk-mini:1562,1565,1566,1567 · .game-avatar:1570,1571,1572 · .stats-nick:1581 · .ticket-owned:1584,1588 · .collect-sub:1593
.mkt-tabs:1594 · .mkt-tab:1595,1599 · .mkt-filter:1600 · .mkt-row:1604 · .mkt-emoji:1608,1609 · .mkt-info:1610,1611
.mkt-tier-stars:1612 · .mkt-buy:1613,1618,1619 · .mkt-price-lo:1620 · .mkt-price-hi:1621 · .mkt-empty:1622 · .collect-grid:1625
.collect-cell:1626 · .cc-emoji:1627,1628 · .cc-name:1629 · .cc-count:1630 · .cc-list-btn:1631,1635 · .mkt-listhead:1636
.mkt-listing:1637 · .ml-cancel:1641 · .mkt-sold:1647,1648,1649 · .list-dialog:1656,1657,1662 · .list-hint:1661 · .collect-reveal-frame:1665,1672
.collect-reveal-img:1671 · .collect-reveal-stars:1673 · .craft-box:1676 · .craft-head:1677 · .craft-bar:1678 · .craft-fill:1679
.craft-text:1680 · .craft-btn-row:1681,1682 · .craft-go-btn:1684,1690,1691,1694 · .craft-cancel:1702,1706 · .mkt-catalog:1709,1710,1711 · .mkt-pager:1714
.pg-btn:1715,1719,1720 · .pg-mid:1721 · .pg-dots:1722 · .pg-dot:1723,1724 · .order-head:1725 · .order-row:1726,1731,1733,1735
.order-deliver:1736,1741 · .order-need:1742
