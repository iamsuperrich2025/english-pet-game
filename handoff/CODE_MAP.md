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

## js/main.js (219 บรรทัด · 4 รายการ)
syncMusicBtn:84 · showQuizBackPay:120 · fitQbp:158 · bootGame:173

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

## js/state.js (1,016 บรรทัด · 84 รายการ)
STORAGE_KEY:6 · QUIZ_PASS_REWARD:11 · CURE_COST:13 · HUNGRY_SICK_MS:14 · MEAL_HOUR:16 · MEAL_FULL:17
SLEEP_FROM_HOUR:18 · SLEEP_SICK_HOUR:19 · WAKE_HOUR:20 · DINNER_COST:21 · TOXIN_FULL:23 · DETOX_COST:24
FOODQUIZ_Q:26 · FOODQUIZ_COIN:27 · FOODQUIZ_BONUS:28 · SHAPE_JUNK_MEALS:30 · SHAPE_CLEAN_MEALS:31 · SHAPE_MISS_MEALS:32
SHAPE_EXP_BONUS:33 · HEAT_SICK_MS:34 · THIRST_SICK_MS:35 · DEFAULT_STATE:37 · FEED_CATS:172 · SLOT_MS:183
currentSlotStart:184 · nextSlotStart:190 · mealDayKey:192 · nightKeyOf:194 · newPet:200 · loadState:225
saveState:464 · activePet:471 · petStage:472 · isAdult:477 · abilityOn:478 · hasPetType:479
todayStr:482 · dailyTick:486 · addCoins:489 · QUEST_POOL:509 · QUEST_PER_DAY:519 · questsToday:520
questTick:527 · questEvent:531 · assetValue:567 · netWorth:593 · assetCount:595 · refreshRank:612
heatProtected:628 · rainProtected:632 · petHungry:635 · petShapeOf:639 · updatePetShape:645 · shapeMealDone:652
heatPct:662 · ymStr:671 · billOutstanding:675 · UTILITIES:682 · HOME_UTILITIES:688 · homeDecayed:690
billTick:693 · myCar:762 · carLoanDue:767 · carLoanOverdue:772 · carLoanPayable:777 · carLoanPay:784
compTick:797 · ONLINE_RATE:811 · onlineEarnActive:812 · onlineEarnTick:816 · onlineEarnFlush:827 · marketTick:837
addCraft:861 · ORDER_MAX:880 · ORDER_LIFE_MS:881 · ORDER_GAP_MIN_MS:882 · ORDER_GAP_SPAN_MS:883 · ORDER_TIER_WEIGHT:884
newOrder:885 · orderTick:898 · careTick:906 · expNeed:987 · addExp:992 · addRP:1012

## js/ui.js (7,085 บรรทัด · 285 รายการ)
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
- 1088-1402 การ์ด Leaderboard — สลับแท็บในการ์ดเดียว (ประหยัดพื้นที่):
- 1403-1701 การ์ดข้อมูลผู้เล่น 👤 — คลิกชื่อในการ์ดเพื่อน/กระดาน แล้วโชว์
- 1702-1920 แผงเพื่อน 👥 (ข้อ 0.3): รหัสเพื่อน + ค้นหา + คำขอ + รายชื่อเพื่อน
- 1921-1959 แชทกับเพื่อน (ข้อ 0.4) — กล่องแชทลอยกลางจอ + แผง emoji
- 1960-2266 รอบ 179: หน้ารวมข้อความ (inbox แบบ Messenger — ธีมกระจกฟ้า sci-fi ของเกม)
- 2267-2613 ระบบส่งของขวัญ (ข้อ 0.5) — ห้องของขวัญ + กล่องเลือกส่ง + ฉากเปิด
- 2614-2666 RANK CARD + ฉากเลื่อนแรงค์
- 2667-2669 PET DASHBOARD
- 2670-2822 📰 รอบ 155: overlay ข้อมูลน้อง & การดูแล + ฟีดกิจกรรมเพื่อน
- 2823-3365 📖 Dictionary ค้นหาคำศัพท์ (รอบ 254 ผู้ใช้สั่ง 16 ก.ค. 2026)
- 3366-3409 การนอน (คิว 7725691507 ข้อ 1)
- 3410-3788 ให้อาหาร (ระบบมื้อเย็น 18:00 + ความอิ่มสะสม — ข้อ 2+3)
- 3789-3870 🛡️ ควิซอาหารปลอดภัย (ต่อยอดข้อ 5.1)
- 3871-3934 ร้านค้าไอเทมแต่งตัว (ล็อกช่วงแรกเกิด/ไข่ ตามกติกาใหม่)
- 3935-4122 ที่พัก (หลบแดด/หลบฝน) + เครื่องปรับอากาศ
- 4123-4240 บิลสาธารณูปโภค (ค่าไฟ/ค่าน้ำ — เครื่องยนต์อยู่ใน state.js: UTILITIES/billTick)
- 4241-4323 การ์ดมือถือ (ข้อ 7): ซื้อ 10,000 ขายคืน 6,000
- 4324-4334 การ์ดคอมพิวเตอร์ (ข้อ 11): ซื้อ 50,000 ขายคืน 30,000
- 4335-4490 item 8: โบนัสออนไลน์ +0.01 เหรียญ/วิ ฟรีทุกคนที่เปิดเกมออนไลน์อยู่
- 4491-4706 🎫 การ์ดตั๋วโลกผจญภัย (คิว 7725691507 ข้อ 7)
- 4707-4788 🎃 การ์ดตั๋วโลกผีสิงกลางคืน (ต่อยอดข้อ 8 · ผู้ใช้เคาะ 7 ก.ค.)
- 4789-4892 🚁 การ์ดตั๋วโลกเฮลิคอปเตอร์ Bell (รอบ 52)
- 4893-4992 🛸 การ์ดตั๋วโลกโดรน FPV Racing (รอบ 85) — ซื้อได้เมื่อมีตั๋วเฮลิคอปเตอร์
- 4993-5183 🚗 การ์ดตั๋วโลกขับรถกำแพงเพชร (รอบ 113) — ซื้อได้เมื่อมีตั๋วโดรน FPV
- 5184-5276 ⚽ การ์ดตั๋วโลกสนามฟุตบอล (รอบ 196) — ซื้อได้เมื่อมีตั๋วขับรถ
- 5277-5372 🏍️ การ์ดตั๋วโลกมอเตอร์ไซค์บ้านโพธิ์สวัสดิ์ (รอบ 293) — ซื้อได้เมื่อมีตั๋วขับรถ
- 5373-5470 🛸 การ์ดตั๋วโลก "ยานแม่บุกโลก" (Invasion · รอบ 413)
- 5471-5622 🌍 ปุ่มลัดเข้าโลก 3D ในรางเมนูซ้าย (ผู้ใช้สั่ง 9 ก.ค. 2026)
- 5623-5792 การ์ดสวนผลไม้ (ข้อ 12): ซื้อต้นไม้ปลูกได้ไม่จำกัด แต่ละต้นออกผล
- 5793-5802 โรงงานผลิตสินค้า 🏭 + ตลาดขายต่อ (แนวคิดใหม่ 5 ก.ค. 2026)
- 5803-5825 โรงงานผลิต (แผง 🏭) — แยกออกจากตลาด (ผู้ใช้สั่ง 6 ก.ค. 2026)
- 5826-5976 ตลาดขายสินค้า (แผง 🏪) — แยกออกจากโรงงาน
- 5977-6880 🚗 รอบ 131: หมวดยานพาหนะ — โชว์รูมรถ 10 คัน (แคตตาล็อก 5 ช่อง/แถว)
- 6881-6941 ร้านสัตว์เลี้ยง (ซื้อเพิ่มได้ ไม่ลบตัวเดิม)
- 6942-6978 เลเวลอัพ (รายตัว)
- 6979-7048 สถิติผลการเรียนรู้
- 7049-7085 item 4: การ์ดสรุปส่งครู — ใบเดียวจบ ชื่อ/วัน-เวลา/เหรียญวันนี้/แรงค์/สอบล่าสุด
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
LB_WS_TOP:1095 · bindLbTabs:1097 · renderLeaderboardCard:1118 · bindLbGroupOpen:1143 · lbRankRows:1155 · lbDemoRows:1190
lbChar:1212 · openLeaderboardFull:1221 · BLK_PAD:1294 · seatPodChars:1296 · lbCoinHtml:1306 · lbBadgeHtml:1322
lbBossHtml:1348 · lbWordSearchHtml:1371 · bindPlayerClicks:1408 · showPlayerCard:1418 · petDescImg:1631 · openImgLightbox:1644
openPetPeek:1664 · updateBillBadges:1708 · setBadge:1720 · updateSettingsBadge:1736 · openAttentionSummary:1750 · updateFriendBadge:1792
renderFriendPanel:1802 · friendDoSearch:1850 · refreshFriendData:1874 · CHAT_EMOJI_CATS:1926 · CHAT_THEMES:1948 · CHAT_SECRET_MS:1957
chatBadgeSync:1965 · ibTimeStr:1973 · openChatInbox:1980 · openChat:2083 · giftImg:2270 · giftDateStr:2272
GREETS:2280 · GREET_EXP:2288 · greetInfo:2289 · openGreetPicker:2293 · giftItemPic:2335 · giftItemName:2343
updateGiftBadge:2349 · renderGiftPanel:2358 · acceptGift:2416 · declineGift:2439 · showGreetReveal:2448 · showGiftReveal:2475
openGiftPicker:2501 · confirmSendGift:2569 · doSendGift:2593 · rankBadgeHTML:2617 · renderRankCard:2622 · showRankUp:2644
bindPetPlateButtons:2679 · openPetInfoOverlay:2703 · feedAgo:2726 · renderFeedCard:2739 · alignPetTabs:2792 · alignCureBtn:2810
dictRecordLookup:2834 · DICT_FILE_COUNT:2845 · loadDict:2846 · dictSearch:2861 · dictTapWords:2876 · dictEntryHTML:2880
openDictOverlay:2891 · renderDashboard:2975 · sleepBtnHTML:3371 · sleepHintHTML:3378 · sleepAllPets:3389 · wakeAllPets:3402
feedPet:3413 · openFoodMenu:3427 · feedWith:3498 · AVATAR_UI:3528 · playerAvatarHTML:3531 · SHAPE_UI:3537
showFeedResult:3546 · curePet:3587 · heartsFx:3610 · PAT_HOLD_MS:3633 · PAT_EXP:3634 · bindPetTap:3635
petBounce:3653 · petMood:3659 · shortPatPet:3666 · longPatPet:3674 · patCalendarHTML:3694 · patStreakTick:3722
cureCelebrateFx:3748 · railCureClick:3759 · detoxPet:3771 · openFoodQuiz:3794 · renderShop:3874 · homeVisualHTML:3938
showHomeRuined:3952 · showCutNotice:3973 · renderHomeCard:3991 · payMaint:4075 · trashBillUI:4091 · payTrash:4108
UTILITY_UI:4127 · utilityBillUI:4176 · payUtility:4201 · buyUtilityFix:4227 · renderPhoneCard:4245 · buyPhone:4285
sellPhone:4307 · compLiveTotal:4328 · onlineLiveTotal:4339 · renderOnlineEarnPill:4344 · openPillInfo:4367 · renderComputerCard:4414
buyComputer:4449 · sellComputer:4472 · soldCount:4498 · soldBadge:4499 · renderTicketCard:4504 · loadScriptOnce:4560
loadAdv3d:4577 · enterAdventure3D:4584 · pickAdvMap:4609 · enterHaunted3D:4644 · advHealClick:4666 · buyTicket:4686
renderHauntCard:4712 · buyHauntTicket:4767 · renderHeliCard:4794 · buyHeliTicket:4852 · enterHeli3D:4875 · renderDroneCard:4897
buyDroneTicket:4952 · enterDrone3D:4975 · renderDriveCard:4998 · buyDriveTicket:5072 · enterDrive3D:5095 · pickDriveMap:5130
enterMotoMapAsCar:5166 · renderSoccerCard:5188 · buySoccerTicket:5236 · enterSoccer3D:5259 · renderMotoCard:5282 · buyMotoTicket:5331
enterMoto3D:5354 · renderInvasionCard:5377 · INVASION_REWARD:5426 · buyInvasionTicket:5428 · enterInvasion3D:5452 · WORLD3D:5477
gotoRobotShop:5488 · scrollShopCardIntoView:5493 · railWorldClick:5496 · renderRailWorlds:5517 · tinvNoticeHTML:5576 · openTinvPicker:5584
fruitCountdown:5628 · renderFarmCard:5640 · renderFarmClock:5715 · buyFruit:5731 · sellFruit:5751 · sellAllFruit:5772
collectImg:5801 · renderFactoryCard:5807 · renderMarketCard:5830 · updateWishBadge:5886 · openWishlistDialog:5897 · bindStripArrows:5942
renderMarketBrowse:5954 · carImg:5983 · renderVehicleShop:5984 · CS_CYCLE_MS:6035 · carInteriorImg:6036 · carStatHtml:6038
renderCarShowroom:6045 · csShowBig:6071 · csInit:6098 · RS_CYCLE_MS:6121 · robotImg:6122 · renderRobotShop:6123
rsShowBig:6145 · rsInit:6166 · buyRobot:6185 · enterMecha3D:6207 · pickMechaRobot:6228 · pickDriveCar:6260
openCarBuyDialog:6303 · buyCarInsurance:6364 · payCarLoanMonthly:6383 · payCarLoanFull:6395 · carDriveBlock:6414 · gotoVehicleShop:6419
gotoMyStock:6424 · showNeedCarDialog:6430 · craftDiscount:6442 · renderFactory:6445 · renderOrdersUI:6507 · startProduce:6526
buyCollectible:6554 · cancelProduce:6582 · deliverOrder:6596 · renderOrderClock:6613 · renderCollectMine:6623 · openListDialog:6665
cancelListing:6718 · buyMarketItem:6741 · showCollectReveal:6768 · buyAC:6806 · openHomeShop:6825 · renderPetShop:6884
showLevelUp:6945 · renderStats:6982 · showTeacherCard:7053

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

## js/wsaward.js (241 บรรทัด · 0 รายการ)

## css/lobby.css (2,653 บรรทัด · 503 selector)
:root:6 · html:15 · body:16 · *:33,34,35,36 · #app:39 · h1:41
.subtitle:42 · .shop-title:43 · #rotate-overlay:46 · .screen:68 · #screen-select:77,78,79,80(+5) · .egg-need:87
.petshop-topright:89 · .petshop-play-link:90,95 · #screen-quiz:134,135,136,137(+6) · #quiz-choices:146,147 · .word-card:154 · .quiz-choice:155,156,157
.big-btn:160,161,162,163 · #screen-dashboard:168,787,795 · .lobby-top:175,603,604,605(+3) · .top-flex:176 · .profile-plate:177,181,524 · #rain-fx:186
.rain-layer:189,195 · .rain-glass:202 · .glass-drop:203 · .rail-btn:218,614,620,621(+13) · .rail-badge:219 · .fr-code-box:224
.fr-code-label:228 · .fr-code-row:229 · .fr-code:230 · .fr-copy-btn:235,239,244,245 · .fr-search-btn:240 · .fr-add-btn:241
.fr-accept:242 · .fr-decline:243 · #fr-search-input:246 · #fr-search-result:250 · .fr-found:251 · .fr-hint:255
.fr-list-title:256 · .fr-row:257 · .fr-req:261 · .fr-row-name:263,267 · .fr-row-status:271 · .fr-req-btns:272
.online-dot:273 · .fr-chat-btn:274,279,281 · .fr-unread:282 · .chat-overlay:289 · .chat-box:293,402,409,416(+12) · .chat-head:305
.chat-theme-btn:310,314 · .chat-secret-tg:315,316 · .cs-switch:317,318,323,324 · .cs-slider:319,321 · .chat-secret-note:325 · .chat-theme-strip:328
.chat-theme-sw:330,333,334,335(+1) · .chat-head-name:337,338 · .chat-close:339 · .chat-msgs:343 · .chat-empty:347 · .chat-typing:349
.ct-dots:351,352,354,355 · .no-anim:357,370,673,700(+26) · .chat-bubble:358,363,368 · .chat-emoji:371 · .chat-emo:375,379 · .chat-input-row:380
.chat-emoji-btn:384 · #chat-input:388 · .chat-send:392,397,398 · .pl-click:465,467,468 · .pl-overlay:469 · .pl-card:473,1996
.pl-close:479 · .pl-head:483,1902,1905 · .pl-grade:488 · .pl-badges:490 · .pl-badge-chip:491,495 · .pl-body:496
.pl-loading:497 · .pl-none:498 · .pl-me-tag:499 · .pl-blk-wrap:501 · .pl-blk:502 · .pl-stat:503
.pl-lbl:508 · .pl-val:509,510 · .pl-tip:511 · .chip-edit:517,522,523 · .rank-mini:529,535,536,537 · .pass-photo:539,544
.pet-tabs:546 · .dict-box:547,551,552,553(+1) · .dict-card:559,564,568,569(+2) · .dict-head:565,566 · .dict-trail:573,577 · .dt-c:578,582,583
.dt-sep:584 · .dict-today:585 · .di-w:587,588,589 · .dict-list:590 · .dict-item:591,595,596,597(+5) · .lobby-mid:611
.lobby-rail:613 · .rail-worlds:631 · .rail-div:632 · .lobby-stage:647,649,665,792(+1) · .newword-banner:655,662,667 · .coin-fly:678,681
.coin-plus:687 · .nw-pop-coin:702,704,705 · .nw-pop-goal:708,709,713,717 · .nw-goal-head:710,712,714 · .nw-goal-bar:715 · .nw-goal-fill:716
.nw-pop-book:718,719 · .nw-tag:740 · .nw-word:745 · .nw-hint:747,748 · .nw-coin:750,753 · .nw-countdown:758
.nw-bar:760 · .nw-bar-fill:762 · .pet-stage:765,2171 · .nw-box:772,2180 · .nw-pop-word:773 · .nw-speak:774
.nw-pop-phon:775 · .nw-ipa:776 · .nw-pop-sent:777 · .nw-pop-mean:778 · .pet-tab:779,780,781,2505 · .stage-hero:802,817,825,970(+5)
.hero-ground:839,959,965 · .hero-rank-bg:841,844,847,851(+18) · #lobby3d-canvas:864,865 · .hero-scene:869,871,878,879(+8) · .caretaker-fig:918 · .caretaker-img:921
.caretaker-emoji:923 · .blk-rig:930,931,932 · .stage-plate:992,1000,1011,1012(+30) · .plate-title:1006 · .lobby-side:1049,1085,1090,1093(+22) · .side-sec:1052,2420
.side-label:1053,1058 · .side-label-row:1061,1062 · .lb-tabs-out:1063,1064,1068 · .side-glass:1072,1079 · .side-card:1091,1203 · #quest-card:1103,1127,1128,1129(+6)
.q-bigcard:1104,1133,1134,1137(+1) · .qb-top:1106 · .qb-emoji:1107 · .qb-name:1109 · .qb-bar:1110,1111 · .qb-row:1113
.qb-prog:1114 · .qb-reward:1115 · .qb-go:1116,1120 · .q-dots:1121 · .q-dot:1122,1123,1124 · .q-bonus:1125
.feed-row:1148,1840,1845 · .inv-card:1150,1152,1153 · .inv-btns:1154 · .inv-go:1155,1157 · .inv-x:1158 · #online-card:1162,2428,2429,2430(+1)
.fq-overlay:1163 · .fq-box:1165,2236 · .fq-head:1169,1171 · .fq-close:1172 · .fq-sec:1174 · .fq-worlds:1175
.fq-world:1176,1178 · .fq-acts:1179 · .fq-act:1180,1183,1184 · .lb-prize:1217 · .lb-award-bar:1218,1224,1225 · .lb-award-go:1226
.lbf-award:1228,1234,1235,1236 · .pod-pz:1237 · .wsa-overlay:1240 · .wsa-box:1242 · .wsa-head:1247 · .wsa-title:1248
.wsa-when:1249,1250 · .wsa-close:1251,1254 · .wsa-cols:1255 · .wsa-col:1256 · .wsa-sec-h:1257,1258 · .wsa-msg:1259
.wsa-msg-h:1262 · .wsa-msg-b:1263,1264 · .wsa-msg-none:1265 · .wsa-rules:1267,1268 · .wsa-list:1269 · .wsa-row:1270,1272
.wsa-r:1273 · .wsa-n:1274 · .wsa-s:1275 · .wsa-p:1276 · .wsa-prizes:1277 · .wsa-pz:1278,1281
.wsa-reveal-medal:1282 · .lobby-bottom:1292,1294 · .lobby-quiz-btn:1295 · .lobby-book-btn:1296,1297 · .lobby-foodquiz-btn:1298,1299 · .lobby-play-btn:1300,1304
.lobby-exam-btn:1306,1307,1309 · .panel-overlay:1314,1319 · .panel-box:1320 · .panel-head:1327,1331 · .panel-close:1332,1337 · .panel-body:1338,1342,1343
.panel-page:1340,1341 · .collect-sub:1347 · .mkt-empty:1348 · .craft-box:1349 · .mkt-listing:1350 · .mkt-filter:1351,1695
.hq-grid:1358 · .hq-card:1359,1364,1388 · .hq-head:1365 · .hq-pic:1371,1373 · .hq-emoji:1375 · .hq-badge:1376
.hq-stars:1380 · .hq-price:1381,1386,1387,1390(+6) · .craft-credit:1394,1396,1397 · .car-grid:1404,1406,1407 · .robot-weap:1408 · .dmap-box:1411,1412
.dmap-grid:1418 · .dmap-card:1420,1423,1424,1425(+2) · .dmap-ico:1427 · .dmap-new:1430 · .dcp-grid:1432 · .dcp-card:1434,1437,1438,1439(+10)
.levelup-box:1456,2137,2138,2233 · .dcp-box:1459,1460,1464,1465(+6) · .dcp-lock:1473 · .sold-badge:1477,1479,1480 · .rs-showroom:1482 · .rs-list:1483,1485
.rs-thumb:1486,1488,1489,1490(+1) · .rs-thumb-pic:1491,1492 · .rs-thumb-price:1493 · .rs-stage:1495 · .rs-big:1498 · .rs-big-img:1499
.rs-elec:1503,1507,1512 · .rs-edge:1513,1519 · .rs-info:1522,1523,1524,1525(+1) · .rs-buy:1527,1529,1530 · .cs-showroom:1534 · .cs-list:1535,1537
.cs-thumb:1538,1540,1541,1542(+1) · .cs-thumb-pic:1543,1544 · .cs-thumb-name:1545 · .cs-thumb-price:1546 · .cs-thumb-own:1547 · .cs-stage:1549
.cs-big:1552 · .cs-big-img:1553 · .cs-elec:1557,1561,1565 · .cs-edge:1566,1572 · .cs-interior:1575 · .cs-inr-label:1576,1577
.cs-inr-img:1578 · .cs-info:1580,1581,1582,1583(+6) · .cs-buy:1591,1593,1594,1595 · .car-emoji:1597 · .car-mine:1603 · .car-mine-pic:1608
.car-mine-info:1609 · .car-loan:1610,1611 · .car-mine-btns:1612,1613,1614 · .car-locked:1616 · .car-mine-head:1618 · .car-pick-list:1619,1620
.car-pick:1621,1623,1624 · .car-pick-pic:1625,1626 · .car-pick-name:1627,1628 · .car-pick-od:1629 · .car-buy-box:1631,2240 · .cb-pic:1632,1633,1634
.cb-lines:1635 · .cb-li:1636,1640,1641 · .cb-ins:1642,1646,1647 · .cb-plan:1648 · .cb-pl:1649,1654,1656,1660(+1) · .cb-total:1667
.cb-btns:1668,1673 · .cb-x:1669 · .shop-grid:1676 · .shop-item:1677,1682,1687,1688(+3) · .mkt-tab:1696,1697 · .pg-btn:1698,1699,1700
.pg-dot:1701 · .fr-gift-btn:1723,1728 · .gift-sec-title:1731 · .gift-in-row:1733 · .gift-out-row:1737 · .gift-in-pic:1738,1740,1741
.gift-in-info:1742,1743 · .gift-in-btns:1744 · .gift-accept:1745,1749,1751 · .gift-decline:1750 · .gift-box-card:1752 · .gift-box-from:1753,1754
.gift-note:1755 · .gift-pick-overlay:1758 · .gift-pick-box:1762 · .gift-pick-head:1768,1772 · .gift-pick-close:1773 · .gift-pick-tabs:1775
.gp-tab:1776,1780 · .gift-pick-body:1781 · .gp-chips:1782 · .gp-chip:1783,1787 · .gp-card:1788,1789 · .gp-price:1790
.gp-note:1791 · .gift-cf-pic:1792 · .chat-emoji-cats:1797 · .chat-emoji-cat:1801,1805,1806 · .chat-emoji-wrap:1807,1808 · .stage-left:1816
.pet-info-btn:1820,1827,1828 · .feed-list:1835,1839 · .feed-ico:1846 · .feed-txt:1847 · .feed-name:1848 · .feed-ago:1849
.feed-empty:1850,1853 · .pi-overlay:1855 · .pi-box:1859,1864,1865,1869(+2) · .pi-close:1871,1876,1877 · .pi-close-left:1879 · .pi-portrait:1881
.pi-dress-btn:1888,1892,1893 · .pi-shape-cap:1894,1897,1898,1899 · .greet-card:1906 · .greet-sub:1907 · .greet-grid:1908 · .greet-opt:1909,1912,1913,1914
.greet-e:1915 · .pi-streak:1919 · .pi-streak-head:1921,1923 · .pi-streak-best:1924 · .pi-dots:1925 · .pi-dot:1927,1928,1929
.pi-streak-note:1930 · .pi-care-title:1931 · .lbf-overlay:1934 · .lbf-box:1937 · .lbf-head:1942 · .lbf-title:1943
.lbf-tabs:1944,1947 · .lbf-close:1950 · .lbf-close-l:1951 · .lbf-body:1952 · .lbf-grid:1953 · .lbf-cell:1955,1958,1959,1960(+1)
.lbf-podium:1964 · .pod:1966,1993,1994 · .pod-char:1968 · .pod-base:1970 · .pod-rank:1972 · .pod-label:1974
.pod-name:1976 · .pod-sc:1978 · .pod-1:1983,1984 · .pod-2:1985,1986 · .pod-3:1987,1988 · .pod-4:1989,1990
.pod-5:1991,1992 · .pl-wide:1997,2000,2001,2002 · .pl-follow:2003,2008,2010 · .pl-unfollow:2012,2018,2019 · .pl-followers:2020 · .pl-cols:2021
.pl-col:2022 · .pl-sec-title:2023 · .pl-feed:2024,2027,2034 · .pl-feed-row:2028,2032,2033 · .pl-assets-wrap:2036 · .pl-assets:2037
.pl-asset:2040,2044,2051 · .pl-asset-emoji:2045 · .pl-asset-n:2046 · .pl-pets-wrap:2053 · .pl-pets:2054 · .pl-pet:2055,2060,2062
.pl-pet-nm:2063 · .img-lightbox:2066,2071,2072,2076(+3) · .pl-chat:2089,2094 · .pet-peek:2095,2096 · .pp-chips:2098 · .pp-chip:2099
.pp-gift:2104,2110 · .settings-box:2112,2113,2182,2187(+20) · .set-feed-head:2114 · .set-feed-sub:2118 · .set-feed-row:2119 · .pillinfo-val:2124
.pillinfo-desc:2129,2148 · .pillinfo-box:2140 · .plf-head:2143 · .plf-emoji:2144 · .plf-ht:2145,2146,2147 · .plf-foot:2149
.alert-box:2154,2156 · .ab-emoji:2157 · .ab-title:2158 · .ab-desc:2159 · .ab-btns:2160,2161,2162 · .heal-heart:2164
.attn-box:2179 · .help-box:2211,2212,2213 · .wl-box:2234 · .food-box:2235 · .home-shop-box:2237 · .summary-box:2238
.report-box:2239 · .wl-grid:2242 · .tc-wrap:2244 · .spell-btn:2250,2255 · .sp-hud:2256 · .sp-word:2258
.sp-ch:2259,2264 · .sp-th:2266 · .sp-hint:2268 · .sp-exit:2271,2275 · .sp-banner:2276 · .sp-big:2281
.sp-thb:2283 · .sp-coin:2284 · #spell-confetti:2289 · .sp-rb:2290 · .sp-day:2300 · .sp-perfect:2302
.sp-late:2304 · #spell-coinpop:2307 · .side-sub:2416,2418 · .sec-quest:2421 · .on-page:2432,2433,2434,2435 · .inbox-overlay:2445
.ib-box:2447 · .ib-head:2451 · .ib-close:2455,2457 · .ib-list:2458,2459 · .ib-row:2460,2461,2462,2463 · .ib-ava:2464
.ib-on:2468 · .ib-mid:2470 · .ib-name:2471 · .ib-last:2472 · .ib-meta:2473 · .ib-time:2474
.ib-dot:2476 · .ib-story-badge:2479 · .ib-empty:2483 · .ib-story:2485,2487 · .ib-story-item:2488,2490,2497 · .ib-story-ava:2491
.ib-story-on:2495 · .ib-world:2500,2503 · #btn-music:2508,2511,2512 · #ws-overlay:2527 · #ws-board:2530,2536,2538 · .ws-head:2541
.ws-title:2542 · .ws-findbar:2545 · .ws-tip:2546 · .ws-grade:2548,2549 · .ws-body:2552 · .ws-gridwrap:2553
#ws-grid:2556 · .ws-cell:2561,2566,2569,2572(+2) · .ws-flash:2578,2580 · .ws-coinpop:2584 · .ws-find:2596 · #ws-prog:2597
#ws-words:2601,2605 · .ws-word:2607,2612,2613,2614(+2) · .ws-actions:2620,2621,2630 · .ws-sizes:2625 · .ws-sizes-lb:2627 · .ws-size-now:2628
#ws-new:2631 · #ws-stash:2632 · #ws-clear:2633 · #ws-win:2634,2636 · .ws-win-in:2637,2640

## css/style.css (1,741 บรรทัด · 458 selector)
:root:5 · *:15 · html:16,21 · input:25 · body:29 · #app:35
.screen:38,39 · h1:42 · .subtitle:43 · .egg-grid:46,63 · .egg-card:47,52,53,54(+2) · .pet-price:57,61
.egg:65,71,75 · .d1:76 · .basket:79,80,85,91(+5) · .basket-dog:89,102,103,104 · .basket-cat:90,105,106,107 · .egg-dragon:110
.topbar:125 · .topbar-coins:126 · .coin-pill:127,138,142,147(+2) · .coin-ic:134 · .no-anim:148,549,1458,1698(+2) · .net-coin:150
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
.rankup-badge-img:503 · .rankup-name:505 · .rankup-en:509 · .rankup-sub:513 · .rankup-btn:514,521,522 · .qbp:525,526,527,528(+4)
.cr-btn-row:534 · .rankup-btn-2:535,536 · .thunder-fx:539 · .quake:540 · .pet-tabs:552 · .pet-tab:553,559,560
.pet-card:562 · .pet-stage:567 · .aura:568,574 · .sp1:575 · .pet-wrap:578 · .pet-emoji:579
.pet-img:580 · .egg-img:581 · .feed-pet:582,728 · .pet-baby:583 · .pet-adult:584 · .pet-egg-stage:586
.wear:588 · .wear-head:589 · .wear-face:590 · .wear-neck:591 · .pet-name:593 · .stage-label:594
.level-row:595 · .level-badge:596 · .exp-bar:600 · .exp-fill:601 · .exp-text:602 · .ability-box:604,608
.hunger-bar:611 · .hunger-fill:612,613,614 · .food-item:620,662,666,667(+6) · .hunger-text:624 · .heat-bar:627 · .heat-fill:628
.heat-text:629,630,631 · .care-row:633 · .care-btn:634,638,641 · .btn-feed:639 · .btn-cure:640 · .sick-banner:642
.pet-sick:646 · .pet-asleep:649 · .sleep-badge:650 · .btn-sleep:652 · .dinner-btn:655 · .food-box:659,660
.food-grid:661 · .fav-tag:681 · .fd-exp:685 · .food-sec:687 · .food-sec-human:691 · .bad-tag:693
.fd-toxin:697 · .fd-safe:698 · .fq-box:701,702 · .fq-progress:703 · .fq-pair:704,705 · .fq-ask:706
.fq-why:707 · .fq-btns:711,712,716 · .fq-yes:717 · .fq-no:718 · .fq-next:719 · .food-cancel:720
.feed-box:726,727 · .feed-gain:729 · .sick-badge:733 · .big-btn:739,745,978,979(+6) · .shop-card:748 · .shop-title:752
.shop-grid:753 · .shop-item:754,758,759,760(+4) · .it-tag:765 · .tag-wear:766 · .lock-banner:768 · .home-current:774,779,780
.home-img:781 · .home-emoji:782 · .home-btn:783,805 · .home-layout:785 · .home-pic-col:786,792 · .home-img-big:790
.home-info-col:793,795,798,799 · .home-name-row:796 · .home-desc-row:797 · .home-shop-box:807,808 · .home-list:809 · .home-option:810,814,815,816(+1)
.home-opt-img:817 · .home-opt-body:819,820 · .home-price:821 · .reset-link:826 · .login-card:832 · .login-pets:833
.login-status:834 · .google-btn:835,841,842 · .login-note:843 · .install-btn:846,852,853 · .install-guide-overlay:856 · .install-guide:860,864,867
.install-steps:865,866 · .install-guide-close:868 · .login-account:873 · .register-card:876,880,898,902 · .reg-safety:882,884,885 · .reg-privacy:887,889,890
#screen-register:892,893,894,895(+2) · .student-chip:903 · .clock-chip:907 · .online-count:913 · .online-row:920,924,925 · .online-dot:929
.online-name:934 · .online-act:938 · .online-live:942 · .online-note:946 · .lb-empty:949 · .lb-list:950
.lb-row:951,955,956 · .lb-rank:960 · .lb-name:962,966 · .lb-coins:970 · .lb-hint:972 · .lb-badgeline:973
.lb-tabs:975 · .lb-tab:976,977 · .tinv-note:988 · .cat-card:994,1015,1094,1099 · .cat-head:998 · .cat-emoji:999
.cat-name:1000 · .cat-pass:1001 · .cat-info:1002 · .cat-btns:1003 · .cat-btn:1004,1008,1009,1010(+2) · .band-sec-head:1013,1014
.band-mine-tag:1016 · .bsp-box:1019,1022 · .bsp-head:1023 · .bsp-prog:1024 · .bsp-retake:1026,1029 · .rts-box:1032
.rts-head:1034 · .rts-sets:1035 · .rts-set:1036,1037,1038 · .rts-sub:1039 · .rts-words:1040 · .rts-word:1041,1043,1044
.rts-foot:1045 · .rts-okbtn:1046,1048 · .bsp-grid:1049 · .bsp-chip:1050,1053,1054,1055(+1) · .bsp-num:1057 · .bsp-best:1058
.bsp-tick:1059 · .bsp-foot:1060 · .vb-box:1063,1065 · .vb-head:1066 · .vb-total:1067 · .vb-quizbtn:1068,1070
.vb-tabs:1071 · .vb-tab:1072,1074,1075 · .vb-words:1076 · .vb-word:1077,1080,1081,1082(+3) · .vb-empty:1086 · .vb-foot:1087
.vb-pg:1088,1090 · #vb-pginfo:1091 · .vb-hint:1092 · .band-lock:1100 · .offline-btn:1101,1102 · .quiz-progress:1107
.quiz-phon:1108 · #quiz-extra:1109,1111,1112,1113 · .quiz-word-card:1114 · .quiz-next:1120,1126,1127,1128(+1) · .quiz-choice:1131,1136,1137,1138 · .quiz-score-pill:1139
.stats-card:1142 · .stats-title:1146,1579 · .stats-row:1147,1148,1149,1150 · .game-top:1153 · .back-btn:1154 · .combo-pill:1158
.timer-wrap:1162 · .timer-fill:1163,1164 · .board-label:1166 · .card-grid:1167 · .word-card:1168,1174,1175,1176(+3) · .hint-btn:1182,1187
.game-endless-note:1190,1195,1197,1201(+6) · .report-btn:1222,1227 · .report-box:1230 · .report-close:1231 · .rp-head:1235 · .rp-avatar:1236,1237
.rp-title:1238 · .rp-sub:1239 · .rp-levelcard:1241 · .rp-level-top:1245 · .rp-bar:1246 · .rp-bar-fill:1247
.rp-level-note:1248,1249 · .rp-grid:1251 · .rp-stat:1252 · .rp-ic:1255 · .rp-num:1256 · .rp-lbl:1257
.rp-section:1259 · .rp-h3:1260 · .rp-badge-mini:1261 · .rp-row:1262,1263,1264 · .rp-empty:1265 · .rp-badges:1266
.rp-badge:1267 · .rp-tline:1270 · .rp-tl-head:1271,1272 · .rp-tl-ems:1273 · .rp-em:1274,1275 · .rp-tl-note:1276,1277
.rp-crown:1279,1280 · .rp-wtitle:1282 · .rp-wnow:1283,1284 · .rp-wgraph:1285 · .rp-wcol:1286 · .rp-wval:1287
.rp-wbar:1288,1289 · .rp-wlbl:1290 · .rp-cheer:1292 · .report-ok:1296 · .summary-box:1299,1350,1354,1355(+2) · .sm-burst:1300
.sm-title:1302 · .sm-line:1303 · .sm-coin:1304 · .sm-matches:1310,1311 · .confetti:1313 · .sm-badge:1320
.sm-badge-all:1324 · .badge-celebrate-overlay:1327,1340 · .badge-celebrate:1331 · .bc-emoji:1337 · .bc-title:1338 · .bc-sub:1339
.sm-cheer:1344 · .sm-streak:1345,1346 · .sm-sick:1347 · .sm-btns:1348 · .float-fx:1360 · .toast:1367
.toast-warn:1374,1381,1382,1388 · .toast-clear-all:1390,1397 · .alert-box:1399 · .alert-ok:1400,1405 · .settings-box:1407 · .set-row:1408
.set-hint:1412 · .set-hint-on:1413 · .set-hint-off:1414 · .set-lwrap:1415 · .set-label:1416 · .set-desc:1417
.set-switch:1418,1422,1423,1428(+4) · .set-sw-knob:1424 · .set-sw-txt:1431 · .set-close:1437,1442 · .set-help:1443,1448 · .help-box:1450,1451,1456
.help-item:1452 · .update-banner:1464,1473,1474 · #update-reload:1475 · #update-dismiss:1479 · .levelup-overlay:1485 · .levelup-box:1489,1496,1497,1498(+4)
.bill-box:1504,1508,1509 · .tag-off:1510 · .home-decayed-img:1511 · .home-dark-img:1512 · .thirst-fill:1513 · .thirst-text:1514,1515
.toxin-fill:1518 · .toxin-text:1519,1520 · .detox-btn:1521,1526 · .shape-text:1529,1530,1531,1532(+1) · .avatar-pick:1536 · .avatar-opt:1537,1541,1542,1543
.avatar-chip-img:1547 · .avatar-chip-blk:1549 · .set-avatar-btns:1550 · .avatar-mini:1551,1555 · .set-blk-row:1557 · .set-sub2:1558
.blk-grid:1560 · .blk-mini:1561,1564,1565,1566 · .game-avatar:1569,1570,1571 · .stats-nick:1580 · .ticket-owned:1583,1587 · .collect-sub:1592
.mkt-tabs:1593 · .mkt-tab:1594,1598 · .mkt-filter:1599 · .mkt-row:1603 · .mkt-emoji:1607,1608 · .mkt-info:1609,1610
.mkt-tier-stars:1611 · .mkt-buy:1612,1617,1618 · .mkt-price-lo:1619 · .mkt-price-hi:1620 · .mkt-empty:1621 · .collect-grid:1624
.collect-cell:1625 · .cc-emoji:1626,1627 · .cc-name:1628 · .cc-count:1629 · .cc-list-btn:1630,1634 · .mkt-listhead:1635
.mkt-listing:1636 · .ml-cancel:1640 · .mkt-sold:1646,1647,1648 · .list-dialog:1655,1656,1661 · .list-hint:1660 · .collect-reveal-frame:1664,1671
.collect-reveal-img:1670 · .collect-reveal-stars:1672 · .craft-box:1675 · .craft-head:1676 · .craft-bar:1677 · .craft-fill:1678
.craft-text:1679 · .craft-btn-row:1680,1681 · .craft-go-btn:1683,1689,1690,1693 · .craft-cancel:1701,1705 · .mkt-catalog:1708,1709,1710 · .mkt-pager:1713
.pg-btn:1714,1718,1719 · .pg-mid:1720 · .pg-dots:1721 · .pg-dot:1722,1723 · .order-head:1724 · .order-row:1725,1730,1732,1734
.order-deliver:1735,1740 · .order-need:1741
