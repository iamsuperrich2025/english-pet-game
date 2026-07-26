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

## js/state.js (986 บรรทัด · 83 รายการ)
STORAGE_KEY:6 · CURE_COST:8 · HUNGRY_SICK_MS:9 · MEAL_HOUR:11 · MEAL_FULL:12 · SLEEP_FROM_HOUR:13
SLEEP_SICK_HOUR:14 · WAKE_HOUR:15 · DINNER_COST:16 · TOXIN_FULL:18 · DETOX_COST:19 · FOODQUIZ_Q:21
FOODQUIZ_COIN:22 · FOODQUIZ_BONUS:23 · SHAPE_JUNK_MEALS:25 · SHAPE_CLEAN_MEALS:26 · SHAPE_MISS_MEALS:27 · SHAPE_EXP_BONUS:28
HEAT_SICK_MS:29 · THIRST_SICK_MS:30 · DEFAULT_STATE:32 · FEED_CATS:162 · SLOT_MS:173 · currentSlotStart:174
nextSlotStart:180 · mealDayKey:182 · nightKeyOf:184 · newPet:190 · loadState:215 · saveState:434
activePet:441 · petStage:442 · isAdult:447 · abilityOn:448 · hasPetType:449 · todayStr:452
dailyTick:456 · addCoins:459 · QUEST_POOL:479 · QUEST_PER_DAY:489 · questsToday:490 · questTick:497
questEvent:501 · assetValue:537 · netWorth:563 · assetCount:565 · refreshRank:582 · heatProtected:598
rainProtected:602 · petHungry:605 · petShapeOf:609 · updatePetShape:615 · shapeMealDone:622 · heatPct:632
ymStr:641 · billOutstanding:645 · UTILITIES:652 · HOME_UTILITIES:658 · homeDecayed:660 · billTick:663
myCar:732 · carLoanDue:737 · carLoanOverdue:742 · carLoanPayable:747 · carLoanPay:754 · compTick:767
ONLINE_RATE:781 · onlineEarnActive:782 · onlineEarnTick:786 · onlineEarnFlush:797 · marketTick:807 · addCraft:831
ORDER_MAX:850 · ORDER_LIFE_MS:851 · ORDER_GAP_MIN_MS:852 · ORDER_GAP_SPAN_MS:853 · ORDER_TIER_WEIGHT:854 · newOrder:855
orderTick:868 · careTick:876 · expNeed:957 · addExp:962 · addRP:982

## js/ui.js (7,060 บรรทัด · 285 รายการ)
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
- 1088-1377 การ์ด Leaderboard — สลับแท็บในการ์ดเดียว (ประหยัดพื้นที่):
- 1378-1676 การ์ดข้อมูลผู้เล่น 👤 — คลิกชื่อในการ์ดเพื่อน/กระดาน แล้วโชว์
- 1677-1895 แผงเพื่อน 👥 (ข้อ 0.3): รหัสเพื่อน + ค้นหา + คำขอ + รายชื่อเพื่อน
- 1896-1934 แชทกับเพื่อน (ข้อ 0.4) — กล่องแชทลอยกลางจอ + แผง emoji
- 1935-2241 รอบ 179: หน้ารวมข้อความ (inbox แบบ Messenger — ธีมกระจกฟ้า sci-fi ของเกม)
- 2242-2588 ระบบส่งของขวัญ (ข้อ 0.5) — ห้องของขวัญ + กล่องเลือกส่ง + ฉากเปิด
- 2589-2641 RANK CARD + ฉากเลื่อนแรงค์
- 2642-2644 PET DASHBOARD
- 2645-2797 📰 รอบ 155: overlay ข้อมูลน้อง & การดูแล + ฟีดกิจกรรมเพื่อน
- 2798-3340 📖 Dictionary ค้นหาคำศัพท์ (รอบ 254 ผู้ใช้สั่ง 16 ก.ค. 2026)
- 3341-3384 การนอน (คิว 7725691507 ข้อ 1)
- 3385-3763 ให้อาหาร (ระบบมื้อเย็น 18:00 + ความอิ่มสะสม — ข้อ 2+3)
- 3764-3845 🛡️ ควิซอาหารปลอดภัย (ต่อยอดข้อ 5.1)
- 3846-3909 ร้านค้าไอเทมแต่งตัว (ล็อกช่วงแรกเกิด/ไข่ ตามกติกาใหม่)
- 3910-4097 ที่พัก (หลบแดด/หลบฝน) + เครื่องปรับอากาศ
- 4098-4215 บิลสาธารณูปโภค (ค่าไฟ/ค่าน้ำ — เครื่องยนต์อยู่ใน state.js: UTILITIES/billTick)
- 4216-4298 การ์ดมือถือ (ข้อ 7): ซื้อ 10,000 ขายคืน 6,000
- 4299-4309 การ์ดคอมพิวเตอร์ (ข้อ 11): ซื้อ 50,000 ขายคืน 30,000
- 4310-4465 item 8: โบนัสออนไลน์ +0.01 เหรียญ/วิ ฟรีทุกคนที่เปิดเกมออนไลน์อยู่
- 4466-4681 🎫 การ์ดตั๋วโลกผจญภัย (คิว 7725691507 ข้อ 7)
- 4682-4763 🎃 การ์ดตั๋วโลกผีสิงกลางคืน (ต่อยอดข้อ 8 · ผู้ใช้เคาะ 7 ก.ค.)
- 4764-4867 🚁 การ์ดตั๋วโลกเฮลิคอปเตอร์ Bell (รอบ 52)
- 4868-4967 🛸 การ์ดตั๋วโลกโดรน FPV Racing (รอบ 85) — ซื้อได้เมื่อมีตั๋วเฮลิคอปเตอร์
- 4968-5158 🚗 การ์ดตั๋วโลกขับรถกำแพงเพชร (รอบ 113) — ซื้อได้เมื่อมีตั๋วโดรน FPV
- 5159-5251 ⚽ การ์ดตั๋วโลกสนามฟุตบอล (รอบ 196) — ซื้อได้เมื่อมีตั๋วขับรถ
- 5252-5347 🏍️ การ์ดตั๋วโลกมอเตอร์ไซค์บ้านโพธิ์สวัสดิ์ (รอบ 293) — ซื้อได้เมื่อมีตั๋วขับรถ
- 5348-5445 🛸 การ์ดตั๋วโลก "ยานแม่บุกโลก" (Invasion · รอบ 413)
- 5446-5597 🌍 ปุ่มลัดเข้าโลก 3D ในรางเมนูซ้าย (ผู้ใช้สั่ง 9 ก.ค. 2026)
- 5598-5767 การ์ดสวนผลไม้ (ข้อ 12): ซื้อต้นไม้ปลูกได้ไม่จำกัด แต่ละต้นออกผล
- 5768-5777 โรงงานผลิตสินค้า 🏭 + ตลาดขายต่อ (แนวคิดใหม่ 5 ก.ค. 2026)
- 5778-5800 โรงงานผลิต (แผง 🏭) — แยกออกจากตลาด (ผู้ใช้สั่ง 6 ก.ค. 2026)
- 5801-5951 ตลาดขายสินค้า (แผง 🏪) — แยกออกจากโรงงาน
- 5952-6855 🚗 รอบ 131: หมวดยานพาหนะ — โชว์รูมรถ 10 คัน (แคตตาล็อก 5 ช่อง/แถว)
- 6856-6916 ร้านสัตว์เลี้ยง (ซื้อเพิ่มได้ ไม่ลบตัวเดิม)
- 6917-6953 เลเวลอัพ (รายตัว)
- 6954-7023 สถิติผลการเรียนรู้
- 7024-7060 item 4: การ์ดสรุปส่งครู — ใบเดียวจบ ชื่อ/วัน-เวลา/เหรียญวันนี้/แรงค์/สอบล่าสุด
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
LB_WS_TOP:1095 · bindLbTabs:1097 · renderLeaderboardCard:1108 · bindLbGroupOpen:1133 · lbRankRows:1144 · lbDemoRows:1177
lbChar:1199 · openLeaderboardFull:1208 · BLK_PAD:1275 · seatPodChars:1277 · lbCoinHtml:1287 · lbBadgeHtml:1303
lbBossHtml:1329 · lbWordSearchHtml:1352 · bindPlayerClicks:1383 · showPlayerCard:1393 · petDescImg:1606 · openImgLightbox:1619
openPetPeek:1639 · updateBillBadges:1683 · setBadge:1695 · updateSettingsBadge:1711 · openAttentionSummary:1725 · updateFriendBadge:1767
renderFriendPanel:1777 · friendDoSearch:1825 · refreshFriendData:1849 · CHAT_EMOJI_CATS:1901 · CHAT_THEMES:1923 · CHAT_SECRET_MS:1932
chatBadgeSync:1940 · ibTimeStr:1948 · openChatInbox:1955 · openChat:2058 · giftImg:2245 · giftDateStr:2247
GREETS:2255 · GREET_EXP:2263 · greetInfo:2264 · openGreetPicker:2268 · giftItemPic:2310 · giftItemName:2318
updateGiftBadge:2324 · renderGiftPanel:2333 · acceptGift:2391 · declineGift:2414 · showGreetReveal:2423 · showGiftReveal:2450
openGiftPicker:2476 · confirmSendGift:2544 · doSendGift:2568 · rankBadgeHTML:2592 · renderRankCard:2597 · showRankUp:2619
bindPetPlateButtons:2654 · openPetInfoOverlay:2678 · feedAgo:2701 · renderFeedCard:2714 · alignPetTabs:2767 · alignCureBtn:2785
dictRecordLookup:2809 · DICT_FILE_COUNT:2820 · loadDict:2821 · dictSearch:2836 · dictTapWords:2851 · dictEntryHTML:2855
openDictOverlay:2866 · renderDashboard:2950 · sleepBtnHTML:3346 · sleepHintHTML:3353 · sleepAllPets:3364 · wakeAllPets:3377
feedPet:3388 · openFoodMenu:3402 · feedWith:3473 · AVATAR_UI:3503 · playerAvatarHTML:3506 · SHAPE_UI:3512
showFeedResult:3521 · curePet:3562 · heartsFx:3585 · PAT_HOLD_MS:3608 · PAT_EXP:3609 · bindPetTap:3610
petBounce:3628 · petMood:3634 · shortPatPet:3641 · longPatPet:3649 · patCalendarHTML:3669 · patStreakTick:3697
cureCelebrateFx:3723 · railCureClick:3734 · detoxPet:3746 · openFoodQuiz:3769 · renderShop:3849 · homeVisualHTML:3913
showHomeRuined:3927 · showCutNotice:3948 · renderHomeCard:3966 · payMaint:4050 · trashBillUI:4066 · payTrash:4083
UTILITY_UI:4102 · utilityBillUI:4151 · payUtility:4176 · buyUtilityFix:4202 · renderPhoneCard:4220 · buyPhone:4260
sellPhone:4282 · compLiveTotal:4303 · onlineLiveTotal:4314 · renderOnlineEarnPill:4319 · openPillInfo:4342 · renderComputerCard:4389
buyComputer:4424 · sellComputer:4447 · soldCount:4473 · soldBadge:4474 · renderTicketCard:4479 · loadScriptOnce:4535
loadAdv3d:4552 · enterAdventure3D:4559 · pickAdvMap:4584 · enterHaunted3D:4619 · advHealClick:4641 · buyTicket:4661
renderHauntCard:4687 · buyHauntTicket:4742 · renderHeliCard:4769 · buyHeliTicket:4827 · enterHeli3D:4850 · renderDroneCard:4872
buyDroneTicket:4927 · enterDrone3D:4950 · renderDriveCard:4973 · buyDriveTicket:5047 · enterDrive3D:5070 · pickDriveMap:5105
enterMotoMapAsCar:5141 · renderSoccerCard:5163 · buySoccerTicket:5211 · enterSoccer3D:5234 · renderMotoCard:5257 · buyMotoTicket:5306
enterMoto3D:5329 · renderInvasionCard:5352 · INVASION_REWARD:5401 · buyInvasionTicket:5403 · enterInvasion3D:5427 · WORLD3D:5452
gotoRobotShop:5463 · scrollShopCardIntoView:5468 · railWorldClick:5471 · renderRailWorlds:5492 · tinvNoticeHTML:5551 · openTinvPicker:5559
fruitCountdown:5603 · renderFarmCard:5615 · renderFarmClock:5690 · buyFruit:5706 · sellFruit:5726 · sellAllFruit:5747
collectImg:5776 · renderFactoryCard:5782 · renderMarketCard:5805 · updateWishBadge:5861 · openWishlistDialog:5872 · bindStripArrows:5917
renderMarketBrowse:5929 · carImg:5958 · renderVehicleShop:5959 · CS_CYCLE_MS:6010 · carInteriorImg:6011 · carStatHtml:6013
renderCarShowroom:6020 · csShowBig:6046 · csInit:6073 · RS_CYCLE_MS:6096 · robotImg:6097 · renderRobotShop:6098
rsShowBig:6120 · rsInit:6141 · buyRobot:6160 · enterMecha3D:6182 · pickMechaRobot:6203 · pickDriveCar:6235
openCarBuyDialog:6278 · buyCarInsurance:6339 · payCarLoanMonthly:6358 · payCarLoanFull:6370 · carDriveBlock:6389 · gotoVehicleShop:6394
gotoMyStock:6399 · showNeedCarDialog:6405 · craftDiscount:6417 · renderFactory:6420 · renderOrdersUI:6482 · startProduce:6501
buyCollectible:6529 · cancelProduce:6557 · deliverOrder:6571 · renderOrderClock:6588 · renderCollectMine:6598 · openListDialog:6640
cancelListing:6693 · buyMarketItem:6716 · showCollectReveal:6743 · buyAC:6781 · openHomeShop:6800 · renderPetShop:6859
showLevelUp:6920 · renderStats:6957 · showTeacherCard:7028

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

## js/wordsearch.js (370 บรรทัด · 0 รายการ)

## css/lobby.css (2,572 บรรทัด · 475 selector)
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
.chat-emoji-btn:381 · #chat-input:385 · .chat-send:389,394,395 · .pl-click:462,464,465 · .pl-overlay:466 · .pl-card:470,1915
.pl-close:476 · .pl-head:480,1821,1824 · .pl-grade:485 · .pl-badges:487 · .pl-badge-chip:488,492 · .pl-body:493
.pl-loading:494 · .pl-none:495 · .pl-me-tag:496 · .pl-blk-wrap:498 · .pl-blk:499 · .pl-stat:500
.pl-lbl:505 · .pl-val:506,507 · .pl-tip:508 · .chip-edit:514,519,520 · .rank-mini:526,532,533,534 · .pass-photo:536,541
.pet-tabs:543 · .dict-box:544,548,549,550(+1) · .dict-card:556,561,565,566(+2) · .dict-head:562,563 · .dict-trail:570,574 · .dt-c:575,579,580
.dt-sep:581 · .dict-today:582 · .di-w:584,585,586 · .dict-list:587 · .dict-item:588,592,593,594(+5) · .lobby-mid:608
.lobby-rail:610 · .rail-worlds:628 · .rail-div:629 · .lobby-stage:644,646,662,789(+1) · .newword-banner:652,659,664 · .coin-fly:675,678
.coin-plus:684 · .nw-pop-coin:699,701,702 · .nw-pop-goal:705,706,710,714 · .nw-goal-head:707,709,711 · .nw-goal-bar:712 · .nw-goal-fill:713
.nw-pop-book:715,716 · .nw-tag:737 · .nw-word:742 · .nw-hint:744,745 · .nw-coin:747,750 · .nw-countdown:755
.nw-bar:757 · .nw-bar-fill:759 · .pet-stage:762,2090 · .nw-box:769,2099 · .nw-pop-word:770 · .nw-speak:771
.nw-pop-phon:772 · .nw-ipa:773 · .nw-pop-sent:774 · .nw-pop-mean:775 · .pet-tab:776,777,778,2424 · .stage-hero:799,814,822,967(+5)
.hero-ground:836,956,962 · .hero-rank-bg:838,841,844,848(+18) · #lobby3d-canvas:861,862 · .hero-scene:866,868,875,876(+8) · .caretaker-fig:915 · .caretaker-img:918
.caretaker-emoji:920 · .blk-rig:927,928,929 · .stage-plate:989,997,1008,1009(+30) · .plate-title:1003 · .lobby-side:1046,1082,1087,1090(+22) · .side-sec:1049,2339
.side-label:1050,1055 · .side-label-row:1058,1059 · .lb-tabs-out:1060,1061,1065 · .side-glass:1069,1076 · .side-card:1088,1200 · #quest-card:1100,1124,1125,1126(+6)
.q-bigcard:1101,1130,1131,1134(+1) · .qb-top:1103 · .qb-emoji:1104 · .qb-name:1106 · .qb-bar:1107,1108 · .qb-row:1110
.qb-prog:1111 · .qb-reward:1112 · .qb-go:1113,1117 · .q-dots:1118 · .q-dot:1119,1120,1121 · .q-bonus:1122
.feed-row:1145,1759,1764 · .inv-card:1147,1149,1150 · .inv-btns:1151 · .inv-go:1152,1154 · .inv-x:1155 · #online-card:1159,2347,2348,2349(+1)
.fq-overlay:1160 · .fq-box:1162,2155 · .fq-head:1166,1168 · .fq-close:1169 · .fq-sec:1171 · .fq-worlds:1172
.fq-world:1173,1175 · .fq-acts:1176 · .fq-act:1177,1180,1181 · .lobby-bottom:1211,1213 · .lobby-quiz-btn:1214 · .lobby-book-btn:1215,1216
.lobby-foodquiz-btn:1217,1218 · .lobby-play-btn:1219,1223 · .lobby-exam-btn:1225,1226,1228 · .panel-overlay:1233,1238 · .panel-box:1239 · .panel-head:1246,1250
.panel-close:1251,1256 · .panel-body:1257,1261,1262 · .panel-page:1259,1260 · .collect-sub:1266 · .mkt-empty:1267 · .craft-box:1268
.mkt-listing:1269 · .mkt-filter:1270,1614 · .hq-grid:1277 · .hq-card:1278,1283,1307 · .hq-head:1284 · .hq-pic:1290,1292
.hq-emoji:1294 · .hq-badge:1295 · .hq-stars:1299 · .hq-price:1300,1305,1306,1309(+6) · .craft-credit:1313,1315,1316 · .car-grid:1323,1325,1326
.robot-weap:1327 · .dmap-box:1330,1331 · .dmap-grid:1337 · .dmap-card:1339,1342,1343,1344(+2) · .dmap-ico:1346 · .dmap-new:1349
.dcp-grid:1351 · .dcp-card:1353,1356,1357,1358(+10) · .levelup-box:1375,2056,2057,2152 · .dcp-box:1378,1379,1383,1384(+6) · .dcp-lock:1392 · .sold-badge:1396,1398,1399
.rs-showroom:1401 · .rs-list:1402,1404 · .rs-thumb:1405,1407,1408,1409(+1) · .rs-thumb-pic:1410,1411 · .rs-thumb-price:1412 · .rs-stage:1414
.rs-big:1417 · .rs-big-img:1418 · .rs-elec:1422,1426,1431 · .rs-edge:1432,1438 · .rs-info:1441,1442,1443,1444(+1) · .rs-buy:1446,1448,1449
.cs-showroom:1453 · .cs-list:1454,1456 · .cs-thumb:1457,1459,1460,1461(+1) · .cs-thumb-pic:1462,1463 · .cs-thumb-name:1464 · .cs-thumb-price:1465
.cs-thumb-own:1466 · .cs-stage:1468 · .cs-big:1471 · .cs-big-img:1472 · .cs-elec:1476,1480,1484 · .cs-edge:1485,1491
.cs-interior:1494 · .cs-inr-label:1495,1496 · .cs-inr-img:1497 · .cs-info:1499,1500,1501,1502(+6) · .cs-buy:1510,1512,1513,1514 · .car-emoji:1516
.car-mine:1522 · .car-mine-pic:1527 · .car-mine-info:1528 · .car-loan:1529,1530 · .car-mine-btns:1531,1532,1533 · .car-locked:1535
.car-mine-head:1537 · .car-pick-list:1538,1539 · .car-pick:1540,1542,1543 · .car-pick-pic:1544,1545 · .car-pick-name:1546,1547 · .car-pick-od:1548
.car-buy-box:1550,2159 · .cb-pic:1551,1552,1553 · .cb-lines:1554 · .cb-li:1555,1559,1560 · .cb-ins:1561,1565,1566 · .cb-plan:1567
.cb-pl:1568,1573,1575,1579(+1) · .cb-total:1586 · .cb-btns:1587,1592 · .cb-x:1588 · .shop-grid:1595 · .shop-item:1596,1601,1606,1607(+3)
.mkt-tab:1615,1616 · .pg-btn:1617,1618,1619 · .pg-dot:1620 · .fr-gift-btn:1642,1647 · .gift-sec-title:1650 · .gift-in-row:1652
.gift-out-row:1656 · .gift-in-pic:1657,1659,1660 · .gift-in-info:1661,1662 · .gift-in-btns:1663 · .gift-accept:1664,1668,1670 · .gift-decline:1669
.gift-box-card:1671 · .gift-box-from:1672,1673 · .gift-note:1674 · .gift-pick-overlay:1677 · .gift-pick-box:1681 · .gift-pick-head:1687,1691
.gift-pick-close:1692 · .gift-pick-tabs:1694 · .gp-tab:1695,1699 · .gift-pick-body:1700 · .gp-chips:1701 · .gp-chip:1702,1706
.gp-card:1707,1708 · .gp-price:1709 · .gp-note:1710 · .gift-cf-pic:1711 · .chat-emoji-cats:1716 · .chat-emoji-cat:1720,1724,1725
.chat-emoji-wrap:1726,1727 · .stage-left:1735 · .pet-info-btn:1739,1746,1747 · .feed-list:1754,1758 · .feed-ico:1765 · .feed-txt:1766
.feed-name:1767 · .feed-ago:1768 · .feed-empty:1769,1772 · .pi-overlay:1774 · .pi-box:1778,1783,1784,1788(+2) · .pi-close:1790,1795,1796
.pi-close-left:1798 · .pi-portrait:1800 · .pi-dress-btn:1807,1811,1812 · .pi-shape-cap:1813,1816,1817,1818 · .greet-card:1825 · .greet-sub:1826
.greet-grid:1827 · .greet-opt:1828,1831,1832,1833 · .greet-e:1834 · .pi-streak:1838 · .pi-streak-head:1840,1842 · .pi-streak-best:1843
.pi-dots:1844 · .pi-dot:1846,1847,1848 · .pi-streak-note:1849 · .pi-care-title:1850 · .lbf-overlay:1853 · .lbf-box:1856
.lbf-head:1861 · .lbf-title:1862 · .lbf-tabs:1863,1866 · .lbf-close:1869 · .lbf-close-l:1870 · .lbf-body:1871
.lbf-grid:1872 · .lbf-cell:1874,1877,1878,1879(+1) · .lbf-podium:1883 · .pod:1885,1912,1913 · .pod-char:1887 · .pod-base:1889
.pod-rank:1891 · .pod-label:1893 · .pod-name:1895 · .pod-sc:1897 · .pod-1:1902,1903 · .pod-2:1904,1905
.pod-3:1906,1907 · .pod-4:1908,1909 · .pod-5:1910,1911 · .pl-wide:1916,1919,1920,1921 · .pl-follow:1922,1927,1929 · .pl-unfollow:1931,1937,1938
.pl-followers:1939 · .pl-cols:1940 · .pl-col:1941 · .pl-sec-title:1942 · .pl-feed:1943,1946,1953 · .pl-feed-row:1947,1951,1952
.pl-assets-wrap:1955 · .pl-assets:1956 · .pl-asset:1959,1963,1970 · .pl-asset-emoji:1964 · .pl-asset-n:1965 · .pl-pets-wrap:1972
.pl-pets:1973 · .pl-pet:1974,1979,1981 · .pl-pet-nm:1982 · .img-lightbox:1985,1990,1991,1995(+3) · .pl-chat:2008,2013 · .pet-peek:2014,2015
.pp-chips:2017 · .pp-chip:2018 · .pp-gift:2023,2029 · .settings-box:2031,2032,2101,2106(+20) · .set-feed-head:2033 · .set-feed-sub:2037
.set-feed-row:2038 · .pillinfo-val:2043 · .pillinfo-desc:2048,2067 · .pillinfo-box:2059 · .plf-head:2062 · .plf-emoji:2063
.plf-ht:2064,2065,2066 · .plf-foot:2068 · .alert-box:2073,2075 · .ab-emoji:2076 · .ab-title:2077 · .ab-desc:2078
.ab-btns:2079,2080,2081 · .heal-heart:2083 · .attn-box:2098 · .help-box:2130,2131,2132 · .wl-box:2153 · .food-box:2154
.home-shop-box:2156 · .summary-box:2157 · .report-box:2158 · .wl-grid:2161 · .tc-wrap:2163 · .spell-btn:2169,2174
.sp-hud:2175 · .sp-word:2177 · .sp-ch:2178,2183 · .sp-th:2185 · .sp-hint:2187 · .sp-exit:2190,2194
.sp-banner:2195 · .sp-big:2200 · .sp-thb:2202 · .sp-coin:2203 · #spell-confetti:2208 · .sp-rb:2209
.sp-day:2219 · .sp-perfect:2221 · .sp-late:2223 · #spell-coinpop:2226 · .side-sub:2335,2337 · .sec-quest:2340
.on-page:2351,2352,2353,2354 · .inbox-overlay:2364 · .ib-box:2366 · .ib-head:2370 · .ib-close:2374,2376 · .ib-list:2377,2378
.ib-row:2379,2380,2381,2382 · .ib-ava:2383 · .ib-on:2387 · .ib-mid:2389 · .ib-name:2390 · .ib-last:2391
.ib-meta:2392 · .ib-time:2393 · .ib-dot:2395 · .ib-story-badge:2398 · .ib-empty:2402 · .ib-story:2404,2406
.ib-story-item:2407,2409,2416 · .ib-story-ava:2410 · .ib-story-on:2414 · .ib-world:2419,2422 · #btn-music:2427,2430,2431 · #ws-overlay:2446
#ws-board:2449,2455,2457 · .ws-head:2460 · .ws-title:2461 · .ws-findbar:2464 · .ws-tip:2465 · .ws-grade:2467,2468
.ws-body:2471 · .ws-gridwrap:2472 · #ws-grid:2475 · .ws-cell:2480,2485,2488,2491(+2) · .ws-flash:2497,2499 · .ws-coinpop:2503
.ws-find:2515 · #ws-prog:2516 · #ws-words:2520,2524 · .ws-word:2526,2531,2532,2533(+2) · .ws-actions:2539,2540,2549 · .ws-sizes:2544
.ws-sizes-lb:2546 · .ws-size-now:2547 · #ws-new:2550 · #ws-stash:2551 · #ws-clear:2552 · #ws-win:2553,2555
.ws-win-in:2556,2559

## css/style.css (1,720 บรรทัด · 457 selector)
:root:5 · *:15 · html:16,21 · input:25 · body:29 · #app:35
.screen:38,39 · h1:42 · .subtitle:43 · .egg-grid:46,63 · .egg-card:47,52,53,54(+2) · .pet-price:57,61
.egg:65,71,75 · .d1:76 · .basket:79,80,85,91(+5) · .basket-dog:89,102,103,104 · .basket-cat:90,105,106,107 · .egg-dragon:110
.topbar:125 · .topbar-coins:126 · .coin-pill:127,138,142,147(+2) · .coin-ic:134 · .no-anim:148,539,1437,1677(+2) · .net-coin:150
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
.feed-gain:719 · .sick-badge:723 · .big-btn:729,735,968,969(+6) · .shop-card:738 · .shop-title:742 · .shop-grid:743
.shop-item:744,748,749,750(+4) · .it-tag:755 · .tag-wear:756 · .lock-banner:758 · .home-current:764,769,770 · .home-img:771
.home-emoji:772 · .home-btn:773,795 · .home-layout:775 · .home-pic-col:776,782 · .home-img-big:780 · .home-info-col:783,785,788,789
.home-name-row:786 · .home-desc-row:787 · .home-shop-box:797,798 · .home-list:799 · .home-option:800,804,805,806(+1) · .home-opt-img:807
.home-opt-body:809,810 · .home-price:811 · .reset-link:816 · .login-card:822 · .login-pets:823 · .login-status:824
.google-btn:825,831,832 · .login-note:833 · .install-btn:836,842,843 · .install-guide-overlay:846 · .install-guide:850,854,857 · .install-steps:855,856
.install-guide-close:858 · .login-account:863 · .register-card:866,870,888,892 · .reg-safety:872,874,875 · .reg-privacy:877,879,880 · #screen-register:882,883,884,885(+2)
.student-chip:893 · .clock-chip:897 · .online-count:903 · .online-row:910,914,915 · .online-dot:919 · .online-name:924
.online-act:928 · .online-live:932 · .online-note:936 · .lb-empty:939 · .lb-list:940 · .lb-row:941,945,946
.lb-rank:950 · .lb-name:952,956 · .lb-coins:960 · .lb-hint:962 · .lb-badgeline:963 · .lb-tabs:965
.lb-tab:966,967 · .tinv-note:978 · .cat-card:984,1005,1084,1089 · .cat-head:988 · .cat-emoji:989 · .cat-name:990
.cat-pass:991 · .cat-info:992 · .cat-btns:993 · .cat-btn:994,998,999,1000(+2) · .band-sec-head:1003,1004 · .band-mine-tag:1006
.bsp-box:1009,1012 · .bsp-head:1013 · .bsp-prog:1014 · .bsp-retake:1016,1019 · .rts-box:1022 · .rts-head:1024
.rts-sets:1025 · .rts-set:1026,1027,1028 · .rts-sub:1029 · .rts-words:1030 · .rts-word:1031,1033,1034 · .rts-foot:1035
.rts-okbtn:1036,1038 · .bsp-grid:1039 · .bsp-chip:1040,1043,1044,1045(+1) · .bsp-num:1047 · .bsp-best:1048 · .bsp-tick:1049
.bsp-foot:1050 · .vb-box:1053,1055 · .vb-head:1056 · .vb-total:1057 · .vb-quizbtn:1058,1060 · .vb-tabs:1061
.vb-tab:1062,1064,1065 · .vb-words:1066 · .vb-word:1067,1070,1071,1072(+3) · .vb-empty:1076 · .vb-foot:1077 · .vb-pg:1078,1080
#vb-pginfo:1081 · .vb-hint:1082 · .band-lock:1090 · .offline-btn:1091,1092 · .quiz-progress:1097 · .quiz-phon:1098
#quiz-extra:1099,1101,1102,1103 · .quiz-word-card:1104 · .quiz-speak:1109 · .quiz-choice:1110,1115,1116,1117 · .quiz-score-pill:1118 · .stats-card:1121
.stats-title:1125,1558 · .stats-row:1126,1127,1128,1129 · .game-top:1132 · .back-btn:1133 · .combo-pill:1137 · .timer-wrap:1141
.timer-fill:1142,1143 · .board-label:1145 · .card-grid:1146 · .word-card:1147,1153,1154,1155(+3) · .hint-btn:1161,1166 · .game-endless-note:1169,1174,1176,1180(+6)
.report-btn:1201,1206 · .report-box:1209 · .report-close:1210 · .rp-head:1214 · .rp-avatar:1215,1216 · .rp-title:1217
.rp-sub:1218 · .rp-levelcard:1220 · .rp-level-top:1224 · .rp-bar:1225 · .rp-bar-fill:1226 · .rp-level-note:1227,1228
.rp-grid:1230 · .rp-stat:1231 · .rp-ic:1234 · .rp-num:1235 · .rp-lbl:1236 · .rp-section:1238
.rp-h3:1239 · .rp-badge-mini:1240 · .rp-row:1241,1242,1243 · .rp-empty:1244 · .rp-badges:1245 · .rp-badge:1246
.rp-tline:1249 · .rp-tl-head:1250,1251 · .rp-tl-ems:1252 · .rp-em:1253,1254 · .rp-tl-note:1255,1256 · .rp-crown:1258,1259
.rp-wtitle:1261 · .rp-wnow:1262,1263 · .rp-wgraph:1264 · .rp-wcol:1265 · .rp-wval:1266 · .rp-wbar:1267,1268
.rp-wlbl:1269 · .rp-cheer:1271 · .report-ok:1275 · .summary-box:1278,1329,1333,1334(+2) · .sm-burst:1279 · .sm-title:1281
.sm-line:1282 · .sm-coin:1283 · .sm-matches:1289,1290 · .confetti:1292 · .sm-badge:1299 · .sm-badge-all:1303
.badge-celebrate-overlay:1306,1319 · .badge-celebrate:1310 · .bc-emoji:1316 · .bc-title:1317 · .bc-sub:1318 · .sm-cheer:1323
.sm-streak:1324,1325 · .sm-sick:1326 · .sm-btns:1327 · .float-fx:1339 · .toast:1346 · .toast-warn:1353,1360,1361,1367
.toast-clear-all:1369,1376 · .alert-box:1378 · .alert-ok:1379,1384 · .settings-box:1386 · .set-row:1387 · .set-hint:1391
.set-hint-on:1392 · .set-hint-off:1393 · .set-lwrap:1394 · .set-label:1395 · .set-desc:1396 · .set-switch:1397,1401,1402,1407(+4)
.set-sw-knob:1403 · .set-sw-txt:1410 · .set-close:1416,1421 · .set-help:1422,1427 · .help-box:1429,1430,1435 · .help-item:1431
.update-banner:1443,1452,1453 · #update-reload:1454 · #update-dismiss:1458 · .levelup-overlay:1464 · .levelup-box:1468,1475,1476,1477(+4) · .bill-box:1483,1487,1488
.tag-off:1489 · .home-decayed-img:1490 · .home-dark-img:1491 · .thirst-fill:1492 · .thirst-text:1493,1494 · .toxin-fill:1497
.toxin-text:1498,1499 · .detox-btn:1500,1505 · .shape-text:1508,1509,1510,1511(+1) · .avatar-pick:1515 · .avatar-opt:1516,1520,1521,1522 · .avatar-chip-img:1526
.avatar-chip-blk:1528 · .set-avatar-btns:1529 · .avatar-mini:1530,1534 · .set-blk-row:1536 · .set-sub2:1537 · .blk-grid:1539
.blk-mini:1540,1543,1544,1545 · .game-avatar:1548,1549,1550 · .stats-nick:1559 · .ticket-owned:1562,1566 · .collect-sub:1571 · .mkt-tabs:1572
.mkt-tab:1573,1577 · .mkt-filter:1578 · .mkt-row:1582 · .mkt-emoji:1586,1587 · .mkt-info:1588,1589 · .mkt-tier-stars:1590
.mkt-buy:1591,1596,1597 · .mkt-price-lo:1598 · .mkt-price-hi:1599 · .mkt-empty:1600 · .collect-grid:1603 · .collect-cell:1604
.cc-emoji:1605,1606 · .cc-name:1607 · .cc-count:1608 · .cc-list-btn:1609,1613 · .mkt-listhead:1614 · .mkt-listing:1615
.ml-cancel:1619 · .mkt-sold:1625,1626,1627 · .list-dialog:1634,1635,1640 · .list-hint:1639 · .collect-reveal-frame:1643,1650 · .collect-reveal-img:1649
.collect-reveal-stars:1651 · .craft-box:1654 · .craft-head:1655 · .craft-bar:1656 · .craft-fill:1657 · .craft-text:1658
.craft-btn-row:1659,1660 · .craft-go-btn:1662,1668,1669,1672 · .craft-cancel:1680,1684 · .mkt-catalog:1687,1688,1689 · .mkt-pager:1692 · .pg-btn:1693,1697,1698
.pg-mid:1699 · .pg-dots:1700 · .pg-dot:1701,1702 · .order-head:1703 · .order-row:1704,1709,1711,1713 · .order-deliver:1714,1719
.order-need:1720
