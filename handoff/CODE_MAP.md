# CODE_MAP.md — แผนที่โค้ด:บรรทัด (เจนอัตโนมัติโดย `tools/gen_code_map.py` — **ห้ามแก้มือ** เดี๋ยวโดนเขียนทับ)

> วิธีใช้: หาชื่อฟังก์ชัน/ค่าคงที่/selector ในไฟล์นี้ (Grep หรือกวาดตา) → `Read` ไฟล์จริง `offset=<บรรทัด>` `limit=40`
> 🗂️ ไฟล์อ้วนมี **สารบัญโซน** (`st-end ชื่อโซน`) — งานทั้งระบบ/โลก 3D: Grep ชื่อโซน → Read/Edit เฉพาะช่วงนั้น **ห้ามอ่านทั้งไฟล์** · เพิ่มระบบใหม่ในไฟล์อ้วนต้องครอบ banner `/* ==== */`+ชื่อโซน (สารบัญเจนเอง)
> css = index `selector:บรรทัดทุกจุดที่ประกาศ` (บั๊ก UI เริ่มหาที่นี่) · เจนใหม่ทุกครั้งที่รัน `python tools/rotate_handoff.py` · อัปเดต: 2026-07-28

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

## js/images.js (168 บรรทัด · 21 รายการ)
IMG_FILES:11 · MOODS:12 · startImgKey:14 · petImageKeys:16 · probeImages:27 · probeRankImages:39
probeCollectImages:40 · probeGiftImages:41 · probeHomeImages:42 · CLIP_FILES:51 · CLIP_SM:57 · clipCanWebm:73
CLIP_ASSET_V:84 · clipFileFor:86 · petClipKey:95 · petClipUrl:104 · equippedItem:115 · petStateImg:125
happyNow:139 · makeHappy:140 · currentPetImg:151

## js/invasion3d.js (10,021 บรรทัด · 622 รายการ)
### 🗂️ สารบัญโซน js/invasion3d.js (Read/Edit เฉพาะช่วง)
- 16-81 ⚙️ ค่ากติกา (จูนฟีลทั้งหมดที่นี่)
- 82-116 🎯 รอบ 419: ปืนกระบอกที่ 2 — R93 สไนเปอร์ (ตามสเปก Delta Force ที่ผู้ใช้ส่งมา)
- 117-162 🎬 รอบ 422: แอนิเมชันยกปืนเล็ง (ADS) ของ R93 — ตามสเปกที่ผู้ใช้ให้มา
- 163-191 🔍🫁 รอบ 504: "ตัวคูณบวกทับ" ท่าเล็ง — ซูมยิ่งแรงปืนยิ่งแนบตา + ท่าประทับแก้มตอนกลั้นหายใจ
- 192-229 🫁🌑 รอบ 505: สัญญาณรับรู้ลมหายใจตอนส่องกล้อง — เสียงสูด/ผ่อน/สั่น + ขอบจอมืดตามลมที่เหลือ
- 230-259 🔭🫨 รอบ 506: "กำลังขยายมีผลกับความนิ่งของภาพ" — ยิ่งซูมแรงยิ่งสั่นมาก ต้องพึ่งการกลั้นหายใจจริง
- 260-370 🫁💨 รอบ 508: "ลมหมดขณะยังกดกลั้นหายใจอยู่" — ปืนตกวูบแล้วหอบ ก่อนกลับสู่ปกติ
- 371-419 🚫🤖 รอบ 635 (ผู้ใช้สั่ง): ปิดบอทที่ช่วยผู้เล่นยิง — สนามนี้เหลือแต่ "ผู้เล่นจริง" เท่านั้น
- 420-1173 🎨 CSS + DOM overlay (self-contained ไม่แตะ css/style.css)
- 1174-1538 🔊 เสียงสังเคราะห์ Web Audio (ปลอดลิขสิทธิ์ 100%)
- 1539-1703 🚁🔊 เสียงเฮลิคอปเตอร์ Bell 212 — "เหมือนโลก helicopter ทุกประการ" (รอบ 531 — ผู้ใช้สั่ง)
- 1704-1744 🚁🔊🌍 เสียงเฮลิรอบตัว (รอบ 531 — ผู้ใช้สั่ง) — ทุกลำในสนามส่งเสียงใบพัดจริง ดังตามระยะ + ซ้าย/ขวา
- 1745-1807 🖼️ เทกซ์เจอร์วาดเอง (canvas) + ตัวช่วยโหลดภาพจริงถ้ามีไฟล์
- 1808-1855 🌍 สถานะฉาก
- 1856-1915 📦 โหลดโมเดล .glb ถ้ามีไฟล์ (ผู้ใช้เอาของจริงมาใส่แล้ว)
- 1916-2042 🏜️ สร้างฉากทะเลทราย + เมือง
- 2043-2102 🌳 รอบ 580 (ผู้ใช้สั่ง): ต้นไม้จริงจากโมเดล tree.glb ของผู้ใช้
- 2103-2273 🏚️ รอบ 416: ถนนสมรภูมิหน้าจุดเกิด (ผู้ใช้ส่งภาพอ้างอิง Delta Force)
- 2274-2411 🏠 รอบ 431: บ้านหลบซุ่มยิง (โมเดล house_01 ของผู้ใช้) + จุดสูงข่มบนเนินเขา
- 2412-2472 🛸 ยานแม่ลำมหึมา — ทรงลิ่มเหลี่ยมมืด + หนาม + ช่องตัวอักษร (สไตล์ ID4)
- 2473-2539 👾 ยานลูก — 1 ลำต่อ 1 ตัวอักษร (บินเพ่นพ่าน + ปล่อยลำแสงใส่ผู้เล่น)
- 2540-2543 👥 พันธมิตร — หน่วยรบภาคพื้นอาวุธครบมือ + ฝูงเฮลิคอปเตอร์ติดมิสไซล์
- 2544-2648 🪖 รอบ 423: ระบบตัวละครทหารแบบมี "ข้อต่อ" (rig) — รองรับโมเดล .glb ของผู้ใช้
- 2649-3161 🤖 รอบ 424: จับชิ้นส่วนเข้าข้อต่อ "อัตโนมัติจากตำแหน่ง" (ผู้ใช้ไม่ต้องตั้งชื่อ)
- 3162-3307 🚁🅿️ รอบ 434: เฮลิคอปเตอร์จอดในสนามรบ 5 ลำ (โมเดลจริง helicopter.glb — ผู้ใช้สั่ง)
- 3308-3610 🎛️🚁 รอบ 532: ห้องนักบิน "ภาพจริง + เข็มเกจขยับ" (ผู้ใช้สั่ง — เหมือนโลก helicopter ทุกประการ)
- 3611-3635 🔫 อาวุธในมือผู้เล่น (view model ติดกล้อง — เห็นปืนที่ถืออยู่แบบ Delta Force)
- 3636-3742 🎯🔧 TUNE ZONE — ท่าถือปืน (แก้ที่นี่ที่เดียว · 3 บรรทัดล่างนี้เท่านั้น)
- 3743-3798 💪 มือถือปืน มุมมองที่ 1 — รอบ 518 (ผู้ใช้สั่งตรง: เปิดโชว์มือจริง)
- 3799-3936 🧤 รอบ 518: โมเดลมือจริง (GLB จาก Tripo) — ผู้ใช้เจนเอง img/models/hand_grip.glb
- 3937-4085 🔧 รอบ 427: ยืดลำกล้องปืนหลัง export (ผู้ใช้: โมเดล R93 ลำกล้องสั้นไป)
- 4086-4791 🔩 รอบ 447: ชักลูกเลื่อนแบบ SV-98/Delta Force (ผู้ใช้ส่งคลิปอ้างอิงมา)
- 4792-5058 💥 เอฟเฟกต์: ระเบิด · ประกายโดน · ลำแสง · เศษซาก
- 5059-5188 🛡️🔵 รอบ 581 (ผู้ใช้สั่ง): "เกราะยานแม่ที่มองไม่เห็น"
- 5189-5294 🎯📝 รอบ 471: เป้าฝึกยิงในสมรภูมิ (ผู้ใช้สั่ง)
- 5295-5355 🔎 รอบ 473: โจทย์แปลไทย — "ยิงคำที่แปลว่า …"
- 5356-5742 🎯 ระบบยิงของผู้เล่น
- 5743-5756 🎯📡 รอบ 563: เรดาร์ล็อกเป้า + มิสไซล์นำวิถีเข้าเป้าที่ล็อก (ผู้ใช้สั่ง — สไตล์ Ace Combat)
- 5757-5899 🎯🔒 รอบ 564 (ผู้ใช้สั่ง): ล็อกหลายเป้าพร้อมกัน → ยิงมิสไซล์รัวทีละชุด
- 5900-5951 🧭🚀 รอบ 572 (ผู้ใช้สั่ง · ต่อยอดรอบ 569): ลูกศรบอกทิศ "จรวดที่พุ่งเข้าหาเฮลิเรา" บนจอเรดาร์
- 5952-6023 📡⬇️ รอบ 575 (ผู้ใช้สั่ง): เรดาร์ต้องไม่ทับ "แผงสถานะซ้าย" (พลังชีวิต/ความร้อนปืน/ลูกจรวด)
- 6024-6093 ⚔️ ดาเมจ / เงื่อนไขชนะ
- 6094-6184 📖 คำศัพท์ + รอบเล่น
- 6185-6248 🖥️ HUD
- 6249-6382 🕹️ Input — มือถือ (จอย+ปุ่ม) และคอม (WASD + pointer lock)
- 6383-6503 🚶 ผู้เล่น + AI + ลูป
- 6504-6508 🚁 โหมดขับเฮลิคอปเตอร์เอง (รอบ 414 — ผู้ใช้สั่ง)
- 6509-6667 🗺️ รอบ 417: แผนที่เลือกจุดลงสนาม (ผู้ใช้สั่ง) — เข้าเกมแล้วเลือกได้ว่าจะไปเกิดตรงไหน
- 6668-6826 🎖️ รอบ 418: นั่งเฮลิลำเดียวกับเพื่อน — "นักบิน + พลปืนประจำประตู" (ผู้ใช้สั่ง)
- 6827-7188 🔭🚫 รอบ 575 (ผู้ใช้สั่ง): "ซูมปืนค้างไว้ = ขึ้นเฮลิไม่ได้ ต้องเลิกซูมก่อน"
- 7189-7451 🌐 ผู้เล่นออนไลน์ใน map เดียวกัน (รอบ 414) — Firebase /world/invasion
- 7452-7673 🧯👥 รอบ 635 (ผู้ใช้สั่ง): กัน "คนเข้าเล่นเยอะเกินกว่าระบบจะรับไหว" — 4 ชั้น ไม่ต้องแก้ rules เลย
- 7674-7732 💨 ควันตามหลังมิสไซล์ (รอบ 531 — ผู้ใช้สั่ง) — สไปรต์ควันนุ่มปล่อยเป็นระยะ
- 7733-7900 🔥🌀 รอบ 565 (ผู้ใช้สั่ง): ยานลูก "หลบมิสไซล์ที่ล็อกได้" — ปล่อยแฟลร์ + บิดหนี
- 7901-7979 🔫↩️ รอบ 568 (ผู้ใช้สั่ง): ยานลูกที่ "ถูกเรดาร์ล็อก" ยิงสวนกลับใส่เฮลิผู้เล่น
- 7980-8181 🔥🛡️ รอบ 569 (ผู้ใช้สั่ง): แฟลร์ของ "เฮลิผู้เล่น" + เสียงเตือนตอนถูกล็อก
- 8182-8192 🏃🪖 รอบ 530: หน่วยรบเคลื่อนที่เชิงยุทธวิธี (ผู้ใช้สั่ง: "อย่าปักหลักยืนทื่อ
- 8193-8318 🧘🎯 รอบ 586 (ผู้ใช้ส่งคลิป: "ตัวละครดิ้นไปดิ้นมา ไม่เป็นธรรมชาติ")
- 8319-8494 📣 รอบ 471: ทหารฝ่ายเราตะโกนบอกทิศศัตรู (ผู้ใช้สั่ง)
- 8495-8937 🌙 รอบ 471: โหมดกลางคืน — ฉากมืดสลัว + ท้องฟ้าดาว + ไฟฉายติดปืน
- 8938-9204 🔵💀 รอบ 576 (ผู้ใช้สั่ง): ยานแม่ยิง "ลำแสงสีฟ้า" ลงมาใกล้ตัวผู้เล่น — เตือน 3 ครั้ง ครั้งที่ 4 ตายจริง
- 9205-9255 ⚡👾 รอบ 579 (ผู้ใช้สั่ง): "ทุก 5 นาที สุ่มยานลูก 10 ลำ เร่งความเร็ว 10 เท่า นาน 10 วินาที แล้ววนลูป"
- 9256-9329 🔁 ลูปหลัก
- 9330-10021 ▶️ เข้า/ออกโลก
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
CHAT_PRESETS:411 · PEER_COLORS:412 · TAU:414 · CSS:423 · buildDom:964 · HELI_XF:1553
HELI_OD_AMBER:1554 · CHORUS_RANGE:1710 · resumeAudio:1742 · tryTex:1750 · letterSpriteTex:1761 · sandTex:1772
wallTex:1793 · BULLET_SPD_R93:1819 · loadGlb:1865 · tameGlbMaterials:1895 · fitInto:1907 · HILLS:1922
buildTerrain:1931 · baseLow:1965 · buildTown:1971 · TREE_LOD:2052 · buildTreesGlb:2054 · refreshTreeInstances:2080
tickTreeLod:2098 · STREET_Z0:2108 · instancer:2112 · buildWarStreet:2126 · sandbagWalls:2231 · squadCoverSpots:2239
buildDustMotes:2249 · tickDust:2260 · HOUSE_SIZE:2283 · HOUSE_LOD:2284 · HOUSE_COVER:2285 · HOUSE_CELL:2286
HOUSE_SPOTS:2287 · buildHouses:2293 · buildBlockGrid:2319 · gridBlocked:2355 · houseBlocked:2362 · houseCover:2371
tickHouseLod:2379 · findSniperSpots:2388 · buildMothership:2416 · layoutLetterPanels:2469 · makeFighter:2476 · drawFighterBar:2530
SOLDIER_PARTS:2551 · joint:2565 · buildSoldierRig:2569 · loadSoldierGlb:2612 · applySoldierGlb:2613 · BODY_MAP:2657
mergeMeshList:2669 · faceModelForward:2710 · skinSoldierLimb:2765 · autoRigSoldier:2807 · fitSoldierGround:2939 · poseSoldier:2965
MUZZLE_BY_WEAPON:3086 · FLASH_COLOR:3088 · makeSoldierFlash:3089 · makeSoldier:3096 · makeHeli:3127 · HELI_ROTOR_NODES:3170
HELI_TROTOR_NODES:3171 · HELI_LEN:3172 · HELI_DESERT:3173 · BOARD_DIST:3174 · AUTO_BOARD_DIST:3179 · HELI_COL_SENS:3186
heliPiloting:3187 · START_MS:3188 · START_PHASES:3189 · HELI_PADS:3196 · SEAT_VIEWS:3204 · heliModel:3215
buildHeliPads:3257 · padAt:3266 · movePad:3272 · startPhaseText:3277 · setSeatView:3284 · tickPads:3297
CP_NAT:3318 · CP_GAUGES:3319 · CP_LAMP:3330 · FUEL_MAX:3333 · FUEL_WARN:3334 · ENG_AMB:3336
HOT_FULL:3343 · heliLift:3345 · cpRpmNow:3350 · CP_SEAT_FULL:3351 · CP_ZOOM:3352 · CP_DASH_OFF_Y:3353
CP_DASH_DROP:3354 · CP_RPM_MAX:3358 · CP_SHAKE_RPM:3359 · loadCockpitImg:3364 · layoutInvCockpit:3380 · cpNeedle:3408
cpArc:3425 · cpRoundRect:3431 · tickHeliGauges:3438 · tickHeliHot:3463 · heliLampLv:3480 · ALARM_GAP:3489
ALARM_KEYS:3490 · resetHeliAlarm:3492 · tickHeliAlarm:3493 · cpLamps:3509 · drawInvGauges:3543 · ZERO_DIST:3650
GUN_VIEW:3664 · GUN_POS:3729 · GUN_ROT:3730 · GUN_SCALE:3731 · useGunView:3733 · MUZZLE_Y:3739
buildFist:3752 · buildArms:3772 · HAND_POSE:3809 · makeHandTopMat:3818 · FOREARM:3824 · addForearm:3825
loadHandModel:3833 · applyHandPose:3855 · fitArmsToWeapon:3864 · buildRifleModel:3870 · buildR93Model:3891 · GUN_CUT:3946
GUN_STRETCH:3947 · orientGunModel:3952 · stretchGunBarrel:3978 · mergeGunParts:4036 · forceGunForward:4061 · attachBoltHandle:4093
tickBolt:4121 · tickBarrelHeat:4164 · muzzleSmoke:4173 · alignGunMuzzle:4193 · syncMuzzleAnchor:4229 · buildSelfShadow:4237
SUN_DIR:4250 · tickSelfShadow:4251 · renderViewModel:4266 · vmToWorld:4282 · gunSil:4285 · setGunPose:4310
buildGun:4338 · tickSwap:4424 · applyWeapon:4434 · swapWeapon:4444 · setScoped:4458 · smoothstep:4472
tickSway:4476 · tickAds:4501 · applyRecoil:4622 · applyBreath:4628 · scopeRadius:4641 · scopeRadiusNow:4653
tickRange:4658 · layoutScope:4678 · scopeFovDeg:4728 · renderScopePass:4736 · cycleScopeMag:4764 · renderAmmo:4772
syncWeaponBtns:4783 · fxTex:4801 · fxGlow:4809 · fxFire:4817 · fxRing:4834 · fxDisc:4842
fxStar:4849 · boomFlashLight:4867 · tickBoomLight:4879 · boom:4888 · dustPuff:4954 · sparkAt:4964
tracer:4979 · tickFx:4995 · MSH_PAD:5071 · MSH_COL:5072 · MSH_CORE:5073 · MSH_HINT_GAP:5074
MSH_FX_MAX:5075 · msShieldOn:5077 · msShieldPt:5079 · msShieldRay:5090 · msShieldPow:5105 · shieldBurst:5108
shieldHit:5169 · tickShieldFx:5171 · TRG_COIN:5197 · QUIZ_COIN:5198 · targetTexture:5203 · setTargetWord:5221
targetSpots:5231 · buildTargets:5244 · tickTargets:5273 · quizPool:5301 · newQuiz:5304 · tickQuiz:5310
renderQuiz:5316 · targetWord:5323 · hitTarget:5329 · AIM_OFF:5364 · AIM_BY_GUN:5383 · aimOffNow:5384
adsPosNow:5388 · aimPct:5393 · layoutCross:5395 · aimDir:5398 · fireGun:5406 · ENV_BLOCK_D:5506
solidAt:5507 · envHit:5523 · HOLE_MAX:5582 · holeTexture:5583 · bulletHole:5598 · tickBullets:5609
RECOIL_PAT:5632 · RECOIL_RESET:5633 · addRecoil:5635 · startReload:5649 · tickReload:5657 · launchMissile:5663
misBusyHint:5690 · fireMissile:5694 · tickMisQueue:5730 · RDR_RANGE:5752 · RDR_FIND:5753 · RDR_KEEP:5754
RDR_LOCK_MS:5755 · RDR_BEEP:5756 · RDR_MAX_LOCK:5767 · RDR_ADD_GAP:5768 · SALVO_PER_TGT:5769 · SALVO_PAIR_MS:5770
SALVO_TGT_MS:5771 · LK_NUM:5776 · rdrOn:5777 · resetRadar:5778 · radarPick:5785 · radarHolds:5799
tickRadar:5805 · drawLockBoxes:5835 · drawRadar:5857 · AMK_TRACK:5913 · AMK_DECOY:5914 · AMK_BEEP:5915
amisRel:5917 · drawAMisMarks:5922 · RDR_GAP_TOP:5963 · RDR_GAP_JOY:5964 · RDR_SIZE:5965 · RDR_SIZE_MIN:5966
RDR_SIZE_SIDE:5967 · layoutRadar:5968 · lockTarget:5989 · rayTarget:5999 · raySphere:6016 · damageFighter:6031
dropFighter:6040 · updateArmor:6066 · killMother:6073 · flashScreen:6088 · myUid:6098 · leaderUid:6099
isLeader:6104 · pickWord:6105 · setWord:6118 · adoptWord:6128 · applyShared:6137 · startWave:6152
completeWord:6162 · renderWord:6188 · renderTarget:6198 · tickWordTimer:6209 · renderCoins:6219 · renderHp:6220
renderHeat:6226 · renderMissiles:6232 · toastBan:6242 · bindInput:6252 · moveJoy:6373 · unlockMouse:6381
solidPushOut:6390 · tickPlayer:6405 · hurtPlayer:6485 · MAP_VIEW:6514 · mapToWorld:6515 · worldToMap:6516
zoneName:6517 · buildMapShade:6531 · drawSpawnMap:6550 · safeSpawn:6625 · fitSpawnMap:6635 · openSpawnMap:6646
applySpawnPick:6655 · RIDE_DIST:6678 · RIDE_UP:6679 · RIDE_OFF:6680 · rideableHelis:6681 · findRide:6687
nearestRideable:6688 · ridePos:6698 · setRideView:6710 · boardGunner:6719 · dismountGunner:6738 · tickGunner:6754
updateGunnerBtn:6794 · tickAutoBoard:6810 · heliCount:6822 · zoomBlocksBoard:6840 · enterHeli:6850 · exitHeli:6892
EXT_CAM:6921 · EXT_VIEWS:6942 · EXT_SELF:6957 · EXT_RIDE:6958 · extP:6960 · syncExtBtn:6962
cycleExtView:6968 · resetExtCam:6977 · angDiff:6979 · extCamClear:6984 · extCamera:7003 · seatCamera:7026
tickHeliFlight:7047 · heliCrash:7146 · tickGpws:7156 · syncBotHelis:7178 · netReady:7194 · netJoin:7198
roomAttach:7206 · netSend:7219 · peerColor:7240 · nameSprite:7242 · bakedSoldierGlb:7256 · loadPeerSoldier:7257
peerRig:7266 · setPeerWeapon:7271 · peerBody:7276 · buildPeer:7305 · onPeer:7314 · dropPeer:7355
netLeave:7362 · peerTick:7369 · renderBoard:7405 · sendChat:7433 · showPeerBubble:7440 · removePeerBubble:7446
ROOM_MAX:7466 · ROOM_GHOST_MS:7467 · ROOM_RETRY_MS:7468 · PEER_DRAW_MAX:7469 · PEER_DRAW_SLACK:7470 · DRAW_SWAP_MARGIN:7471
PEER_STALE_MS:7472 · JOIN_TOAST_MAX:7473 · CROWD_PER:7474 · peerCount:7478 · drawnPeers:7479 · drawSlotFree:7480
netSendGap:7482 · tryEnterRoom:7485 · enterTrainingField:7512 · showPeerAgain:7521 · hidePeer:7528 · tickDrawBudget:7533
sweepGhostPeers:7555 · tickCrowdGuard:7559 · resetCrowdGuard:7565 · tickFighters:7569 · tickMother:7622 · spawnAlienShot:7645
tickAlienShots:7657 · smokeTex:7679 · spawnPuff:7690 · spawnSmoke:7700 · spawnDust:7702 · tickSmoke:7711
clearSmoke:7721 · tickHeliDust:7724 · EVA_WARN:7746 · EVA_FLARE_D:7747 · EVA_TURN:7748 · EVA_SPIN_MUL:7749
EVA_SPD_MAX:7750 · EVA_ROLL:7753 · EVA_Y:7754 · FLARE_PODS:7755 · FLARE_COOL:7756 · FLARE_N:7757
FLARE_LIFE:7758 · FLARE_TRAP:7759 · FLARE_CH:7760 · incomingMis:7765 · startEvade:7776 · dropFlares:7785
tickEvade:7813 · clearFlares:7845 · tickMissiles:7846 · CTR_REACT:7915 · CTR_WARN:7916 · CTR_GAP:7917
CTR_BURST:7921 · CTR_BURST_MS:7922 · CTR_SPD:7923 · CTR_DMG:7924 · CTR_MAX:7925 · CTR_SPREAD:7926
CTR_LEAD:7927 · ctrAimPoint:7930 · ctrArming:7937 · counterFire:7941 · tickCounter:7946 · SPK_RANGE:7997
SPK_MS:7998 · SPK_GAP:7999 · SPK_WORLD_GAP:8000 · SPK_BEEP:8001 · AMIS_SPD:8002 · AMIS_TURN:8003
AMIS_DMG:8004 · AMIS_LIFE:8005 · AMIS_MAX:8006 · AMIS_PROX:8007 · PH_FLARE_MAX:8008 · PH_FLARE_RE:8009
PH_FLARE_N:8010 · PH_FLARE_COOL:8011 · PH_FLARE_BACK:8012 · PH_FLARE_DOWN:8013 · PH_TRAP:8014 · PH_FLARE_CH:8015
renderFlareBtn:8018 · dropPlayerFlares:8024 · fireAlienMissile:8056 · clearAMis:8071 · resetSpike:8076 · spikeStart:8077
aMisNear:8079 · tickSpike:8087 · tickAMis:8139 · SQUAD_COVERS:8191 · squadCoverPool:8192 · SQ_TURN:8202
angWrap:8207 · turnTo:8209 · easeLook:8214 · squadTarget:8219 · pickSquadDest:8231 · tickSquadMove:8245
tickSquad:8271 · CALL_DIST:8325 · CALL_NEAR:8326 · CALL_GAP_ALL:8327 · CALL_GAP_ONE:8328 · CALL_GAP_DIR:8329
CALL_MS:8330 · CALL_LINES:8331 · CALL_SECTORS:8342 · bearingKey:8345 · clearSquadBubble:8353 · callSprite:8359
squadShout:8371 · tickSquadCalls:8384 · CHAT_GAP_ALL:8411 · CHAT_LINES:8412 · tickSquadChatter:8418 · heliFireAt:8435
nearestFighterTo:8447 · tickHelis:8453 · DAY:8502 · NIGHT:8504 · collectMsMats:8508 · CYCLE_MS:8519
MODE_ICON:8521 · STORM_MS:8528 · buildStars:8535 · buildStreetLamps:8558 · glowTex:8576 · tickStreetLamps:8584
beamPair:8601 · tickSearchBeams:8612 · buildBarrelFires:8649 · tickBarrels:8667 · tickShootingStar:8677 · buildMist:8702
tickMist:8712 · tickNightSound:8755 · tickSneak:8764 · tickStorm:8775 · nvReady:8791 · nvEnter:8792
nvExit:8798 · tickNvHint:8799 · dropGlowStick:8808 · tickGlowSticks:8825 · buildFlashlight:8834 · setNight:8839
setDayMode:8840 · tickNight:8854 · applyNightLook:8886 · tickFlashlight:8926 · MSB_FIRST:8956 · MSB_GAP:8957
MSB_WARN:8958 · MSB_KILL_WARN:8959 · MSB_NEAR:8960 · MSB_FLEE:8961 · MSB_R:8962 · MSB_HOLD:8963
MSB_MAX:8964 · MSB_DEAD_MS:8965 · MSB_BEEP:8966 · MSB_COVER_R:8969 · MSB_PAD_R:8970 · MSB_COVER_RECHECK:8971
msbEnsure:8976 · msbPlace:8993 · msbBarPos:9002 · msbHide:9009 · resetMsBeam:9013 · msbCoverAt:9028
msbAimBeside:9049 · msbBegin:9055 · msbAim:9072 · msbStrike:9103 · msbKill:9142 · msbKickOut:9155
tickMsBeam:9165 · TURBO_EVERY:9218 · TURBO_MS:9219 · TURBO_MUL:9220 · TURBO_N:9221 · TURBO_TRACK:9222
resetTurbo:9224 · turboPick:9229 · turboBegin:9236 · tickTurbo:9248 · fit:9259 · tick:9265
frame:9273 · build:9333 · start:9398 · exitWorld:9525

## js/lobby.js (52 บรรทัด · 3 รายการ)
PANEL_TITLES:9 · openPanel:19 · closePanel:29

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

## js/online.js (1,567 บรรทัด · 80 รายการ)
### 🗂️ สารบัญโซน js/online.js (Read/Edit เฉพาะช่วง)
- 2-187 ENGINE: ระบบออนไลน์จริงผ่าน Firebase Realtime Database
- 188-281 ระบบเพื่อน (ข้อ 0.3): รหัสเพื่อน + ค้นหา + ส่ง/รับคำขอ
- 282-471 ระบบแชทกับเพื่อน (ข้อ 0.4)
- 472-637 ระบบส่งของขวัญ (ข้อ 0.5)
- 638-754 🏪 ตลาดออนไลน์จริง (item 2 backlog): ซื้อ-ขายสินค้าที่เพื่อน "ผลิตเอง" ข้ามผู้เล่น
- 755-792 คำเชิญเล่นโลก 3D ด้วยกัน — /tinv/<toUid>/<fromUid> = {map,n,ts}
- 793-987 📰 Follow + Feed กิจกรรม (รอบ 155)
- 988-1567 📞 โทรหาเพื่อน — Voice call / Video call แบบ LINE (รอบ 625 · กลุ่ม 3 คนรอบ 631)
### รายการ js/online.js
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
fetchPlayerAssets:960 · fetchFollowers:979 · CALL_RTC_CFG:1012 · CALL_RING_MS:1013 · CALL_MAX_MS:1014 · CALL_MAX_PEERS:1015
onlineStart:1431 · onlineLoadSDK:1542

## js/state.js (1,018 บรรทัด · 84 รายการ)
STORAGE_KEY:6 · QUIZ_PASS_REWARD:11 · CURE_COST:13 · HUNGRY_SICK_MS:14 · MEAL_HOUR:16 · MEAL_FULL:17
SLEEP_FROM_HOUR:18 · SLEEP_SICK_HOUR:19 · WAKE_HOUR:20 · DINNER_COST:21 · TOXIN_FULL:23 · DETOX_COST:24
FOODQUIZ_Q:26 · FOODQUIZ_COIN:27 · FOODQUIZ_BONUS:28 · SHAPE_JUNK_MEALS:30 · SHAPE_CLEAN_MEALS:31 · SHAPE_MISS_MEALS:32
SHAPE_EXP_BONUS:33 · HEAT_SICK_MS:34 · THIRST_SICK_MS:35 · DEFAULT_STATE:37 · FEED_CATS:174 · SLOT_MS:185
currentSlotStart:186 · nextSlotStart:192 · mealDayKey:194 · nightKeyOf:196 · newPet:202 · loadState:227
saveState:466 · activePet:473 · petStage:474 · isAdult:479 · abilityOn:480 · hasPetType:481
todayStr:484 · dailyTick:488 · addCoins:491 · QUEST_POOL:511 · QUEST_PER_DAY:521 · questsToday:522
questTick:529 · questEvent:533 · assetValue:569 · netWorth:595 · assetCount:597 · refreshRank:614
heatProtected:630 · rainProtected:634 · petHungry:637 · petShapeOf:641 · updatePetShape:647 · shapeMealDone:654
heatPct:664 · ymStr:673 · billOutstanding:677 · UTILITIES:684 · HOME_UTILITIES:690 · homeDecayed:692
billTick:695 · myCar:764 · carLoanDue:769 · carLoanOverdue:774 · carLoanPayable:779 · carLoanPay:786
compTick:799 · ONLINE_RATE:813 · onlineEarnActive:814 · onlineEarnTick:818 · onlineEarnFlush:829 · marketTick:839
addCraft:863 · ORDER_MAX:882 · ORDER_LIFE_MS:883 · ORDER_GAP_MIN_MS:884 · ORDER_GAP_SPAN_MS:885 · ORDER_TIER_WEIGHT:886
newOrder:887 · orderTick:900 · careTick:908 · expNeed:989 · addExp:994 · addRP:1014

## js/ui.js (8,025 บรรทัด · 321 รายการ)
### 🗂️ สารบัญโซน js/ui.js (Read/Edit เฉพาะช่วง)
- 2-77 UI: Dashboard / ร้านค้า / ที่พัก / ร้านสัตว์เลี้ยง / แรงค์ / สถิติ
- 78-268 🎬 เวทีน้องน่ารัก (Cute Pet Show) — รอบ 604 (ผู้ใช้สั่ง 26 ก.ค. 2026)
- 269-595 🆕 New Word (รอบ 116): คำศัพท์ใหม่ 1 คำ/การ login ตามระดับชั้น
- 596-618 นาฬิกาใต้ชื่อผู้เล่น (วัน · วันที่ · เวลา อัปเดตทุกวินาที)
- 619-671 ข้าวเย็นของผู้เล่น (คิว 7725691507 ข้อ 6)
- 672-703 แถบฝนประจำวัน: นับถอยหลังถึง 19:00 ทุกวัน (ฝนตก 1 ชม.)
- 704-748 เอฟเฟกต์ฝนเต็มจอ (รอบยี่สิบ): ฝนตกจริง (19:00-20:00) + ไม่มีบ้านสภาพดี
- 749-769 การ์ด "คนที่กำลังทำการบ้านไปพร้อมๆ กับเรา"
- 770-824 รอบ 149: กล่อง aside ขวาเลื่อนวนอัตโนมัติ (ล่าง→บน) ไม่มี scrollbar
- 825-1162 Daily Quest (item 3): การ์ดภารกิจวันนี้ใน aside ขวา
- 1163-1255 รอบ 153: เมนูลัดแตะแถวเพื่อนออนไลน์ในกล่อง aside
- 1256-1631 การ์ด Leaderboard — สลับแท็บในการ์ดเดียว (ประหยัดพื้นที่):
- 1632-1940 การ์ดข้อมูลผู้เล่น 👤 — คลิกชื่อในการ์ดเพื่อน/กระดาน แล้วโชว์
- 1941-2162 แผงเพื่อน 👥 (ข้อ 0.3): รหัสเพื่อน + ค้นหา + คำขอ + รายชื่อเพื่อน
- 2163-2201 แชทกับเพื่อน (ข้อ 0.4) — กล่องแชทลอยกลางจอ + แผง emoji
- 2202-2579 รอบ 179: หน้ารวมข้อความ (inbox แบบ Messenger — ธีมกระจกฟ้า sci-fi ของเกม)
- 2580-2926 ระบบส่งของขวัญ (ข้อ 0.5) — ห้องของขวัญ + กล่องเลือกส่ง + ฉากเปิด
- 2927-3011 RANK CARD + ฉากเลื่อนแรงค์
- 3012-3014 PET DASHBOARD
- 3015-3219 📰 รอบ 155: overlay ข้อมูลน้อง & การดูแล + ฟีดกิจกรรมเพื่อน
- 3220-3829 📖 Dictionary ค้นหาคำศัพท์ (รอบ 254 ผู้ใช้สั่ง 16 ก.ค. 2026)
- 3830-3873 การนอน (คิว 7725691507 ข้อ 1)
- 3874-4252 ให้อาหาร (ระบบมื้อเย็น 18:00 + ความอิ่มสะสม — ข้อ 2+3)
- 4253-4334 🛡️ ควิซอาหารปลอดภัย (ต่อยอดข้อ 5.1)
- 4335-4420 🎀 ห้องแต่งตัวสัตว์เลี้ยง (รอบ 635: แยกออกจาก "ร้านค้า" เดิม —
- 4421-4608 ที่พัก (หลบแดด/หลบฝน) + เครื่องปรับอากาศ
- 4609-4726 บิลสาธารณูปโภค (ค่าไฟ/ค่าน้ำ — เครื่องยนต์อยู่ใน state.js: UTILITIES/billTick)
- 4727-4809 การ์ดมือถือ (ข้อ 7): ซื้อ 10,000 ขายคืน 6,000
- 4810-4820 การ์ดคอมพิวเตอร์ (ข้อ 11): ซื้อ 50,000 ขายคืน 30,000
- 4821-4976 item 8: โบนัสออนไลน์ +0.01 เหรียญ/วิ ฟรีทุกคนที่เปิดเกมออนไลน์อยู่
- 4977-5192 🎫 การ์ดตั๋วโลกผจญภัย (คิว 7725691507 ข้อ 7)
- 5193-5274 🎃 การ์ดตั๋วโลกผีสิงกลางคืน (ต่อยอดข้อ 8 · ผู้ใช้เคาะ 7 ก.ค.)
- 5275-5378 🚁 การ์ดตั๋วโลกเฮลิคอปเตอร์ Bell (รอบ 52)
- 5379-5478 🛸 การ์ดตั๋วโลกโดรน FPV Racing (รอบ 85) — ซื้อได้เมื่อมีตั๋วเฮลิคอปเตอร์
- 5479-5669 🚗 การ์ดตั๋วโลกขับรถกำแพงเพชร (รอบ 113) — ซื้อได้เมื่อมีตั๋วโดรน FPV
- 5670-5762 ⚽ การ์ดตั๋วโลกสนามฟุตบอล (รอบ 196) — ซื้อได้เมื่อมีตั๋วขับรถ
- 5763-5858 🏍️ การ์ดตั๋วโลกมอเตอร์ไซค์บ้านโพธิ์สวัสดิ์ (รอบ 293) — ซื้อได้เมื่อมีตั๋วขับรถ
- 5859-5956 🛸 การ์ดตั๋วโลก "ยานแม่บุกโลก" (Invasion · รอบ 413)
- 5957-6001 🌍 ปุ่มลัดเข้าโลก 3D ในรางเมนูซ้าย (ผู้ใช้สั่ง 9 ก.ค. 2026)
- 6002-6147 🧭 ป้ายบอกทางของรางเมนูซ้าย (รอบ 601 · ผู้ใช้สั่ง 26 ก.ค. 2026)
- 6148-6317 การ์ดสวนผลไม้ (ข้อ 12): ซื้อต้นไม้ปลูกได้ไม่จำกัด แต่ละต้นออกผล
- 6318-6327 โรงงานผลิตสินค้า 🏭 + ตลาดขายต่อ (แนวคิดใหม่ 5 ก.ค. 2026)
- 6328-6350 โรงงานผลิต (แผง 🏭) — แยกออกจากตลาด (ผู้ใช้สั่ง 6 ก.ค. 2026)
- 6351-6501 ตลาดขายสินค้า (แผง 🏪) — แยกออกจากโรงงาน
- 6502-7413 🚗 รอบ 131: หมวดยานพาหนะ — โชว์รูมรถ 10 คัน (แคตตาล็อก 5 ช่อง/แถว)
- 7414-7474 ร้านสัตว์เลี้ยง (ซื้อเพิ่มได้ ไม่ลบตัวเดิม)
- 7475-7511 เลเวลอัพ (รายตัว)
- 7512-7586 สถิติผลการเรียนรู้
- 7587-7624 item 4: การ์ดสรุปส่งครู — ใบเดียวจบ ชื่อ/วัน-เวลา/เหรียญวันนี้/แรงค์/สอบล่าสุด
- 7625-8025 📞 หน้าจอโทรหาเพื่อน — สายเสียง (รอบ 625 · กลุ่ม 3 คน + ปิดวิดีโอ รอบ 631)
### รายการ js/ui.js
startHTML:10 · PET_ANIM:30 · petAnimHTML:35 · petVisualHTML:50 · PET_SHOW:91 · PET_SHOW_STAGE:96
PET_SHOW_H:98 · petShowBgHTML:101 · petClipHint:128 · __clipReady:140 · petShowHTML:148 · lobbyBlk:194
caretakerFigureHTML:200 · footAlign:210 · heroRankBgHTML:241 · NEW_WORD_MS:275 · newWordNext:281 · renderNewWord:292
alignNewWord:322 · startNewWordTimer:333 · nwCountdownTick:350 · PAT_REMIND_HOUR:366 · patRemindTick:367 · applyPatRemindGlow:388
NEW_WORD_COIN:403 · NW_DAILY_GOAL:404 · NW_DAILY_BONUS:405 · newWordReward:406 · nwDailyTick:429 · coinFlyFx:448
nwDailyBarHTML:481 · showNewWordPopup:492 · GIANT_MAX:521 · GIANT_COST:522 · GIANT_PET_VH:523 · GIANT_OWNER_VH:524
GIANT_OWNER_X:525 · GIANT_NAMES:526 · giantLevel:527 · giantUnlocked:531 · upgradeGiant:533 · renamePet:556
resetGiant:572 · mealLabel:583 · fmtMins:590 · renderClock:599 · dinnerDue:624 · renderDinnerChip:629
dinnerClick:640 · renderRainBar:675 · rainFxTick:708 · RAIN_DROP_IMGS:725 · rainFxDrop:726 · selfPronoun:756
selfTag:761 · idTag:765 · SIDE_SCROLL_SPEED:775 · SIDE_SCROLL_RESUME:776 · initSideScroll:779 · sideScrollTick:807
QUEST_FLASH_HOLD:831 · QUEST_DECK_FLIP_MS:838 · questGo:841 · SIDE_TALL_MIN:853 · sideIsTall:854 · qDeckDraw:859
qDeckNext:882 · renderQuestCard:896 · sideFlashRows:934 · FRIEND_FLASH_GRACE:952 · ONLINE_FLIP_MS:960 · ONLINE_FLIP_RESUME:961
ONLINE_SWIPE_STEP:962 · ONLINE_ROW_H:969 · onPerPage:972 · onChunk:978 · ONLINE_GAP_MAX:988 · onPageSpread:989
onPageDraw:998 · onPageFlip:1009 · bindOnlinePager:1020 · renderOnlineCard:1055 · bindInviteCards:1170 · bindFriendQuickMenu:1190
openFriendQuickMenu:1200 · LB_TABS:1262 · LB_WS_TOP:1263 · bindLbTabs:1265 · updateRankRailBadge:1288 · rankUpCheck:1307
rankUpSound:1335 · renderLeaderboardCard:1346 · bindLbGroupOpen:1372 · lbRankRows:1384 · lbDemoRows:1419 · lbChar:1441
openLeaderboardFull:1450 · BLK_PAD:1523 · seatPodChars:1525 · lbCoinHtml:1535 · lbBadgeHtml:1551 · lbBossHtml:1577
lbWordSearchHtml:1600 · bindPlayerClicks:1637 · showPlayerCard:1647 · petDescImg:1870 · openImgLightbox:1883 · openPetPeek:1903
updateBillBadges:1947 · setBadge:1957 · updateSettingsBadge:1973 · openAttentionSummary:1987 · updateFriendBadge:2029 · renderFriendPanel:2039
friendDoSearch:2087 · refreshFriendData:2111 · CHAT_EMOJI_CATS:2168 · CHAT_THEMES:2190 · CHAT_SECRET_MS:2199 · chatBadgeSync:2207
ibTimeStr:2215 · IB_CALL_RE:2224 · ibCallInfo:2225 · openChatInbox:2230 · openChat:2393 · giftImg:2583
giftDateStr:2585 · GREETS:2593 · GREET_EXP:2601 · greetInfo:2602 · openGreetPicker:2606 · giftItemPic:2648
giftItemName:2656 · updateGiftBadge:2662 · renderGiftPanel:2671 · acceptGift:2729 · declineGift:2752 · showGreetReveal:2761
showGiftReveal:2788 · openGiftPicker:2814 · confirmSendGift:2882 · doSendGift:2906 · rankBadgeHTML:2930 · renderRankCard:2935
renderRankTab:2961 · showRankUp:2989 · bindPetPlateButtons:3024 · openPetInfoOverlay:3047 · feedAgo:3070 · renderFeedCard:3083
stageColLeft:3140 · alignPetTabs:3149 · alignCoinGroup:3158 · alignStageLeft:3172 · alignStageCols:3183 · watchStageCols:3197
alignCureBtn:3207 · dictRecordLookup:3231 · DICT_FILE_COUNT:3242 · loadDict:3243 · dictSearch:3258 · dictTapWords:3273
dictEntryHTML:3277 · openDictOverlay:3288 · renderDashboard:3372 · sleepBtnHTML:3835 · sleepHintHTML:3842 · sleepAllPets:3853
wakeAllPets:3866 · feedPet:3877 · openFoodMenu:3891 · feedWith:3962 · AVATAR_UI:3992 · playerAvatarHTML:3995
SHAPE_UI:4001 · showFeedResult:4010 · curePet:4051 · heartsFx:4074 · PAT_HOLD_MS:4097 · PAT_EXP:4098
bindPetTap:4099 · petBounce:4117 · petMood:4123 · shortPatPet:4130 · longPatPet:4138 · patCalendarHTML:4158
patStreakTick:4186 · cureCelebrateFx:4212 · railCureClick:4223 · detoxPet:4235 · openFoodQuiz:4258 · closeDressUpBoard:4340
openDressUpBoard:4344 · renderShop:4361 · homeVisualHTML:4424 · showHomeRuined:4438 · showCutNotice:4459 · renderHomeCard:4477
payMaint:4561 · trashBillUI:4577 · payTrash:4594 · UTILITY_UI:4613 · utilityBillUI:4662 · payUtility:4687
buyUtilityFix:4713 · renderPhoneCard:4731 · buyPhone:4771 · sellPhone:4793 · compLiveTotal:4814 · onlineLiveTotal:4825
renderOnlineEarnPill:4830 · openPillInfo:4853 · renderComputerCard:4900 · buyComputer:4935 · sellComputer:4958 · soldCount:4984
soldBadge:4985 · renderTicketCard:4990 · loadScriptOnce:5046 · loadAdv3d:5063 · enterAdventure3D:5070 · pickAdvMap:5095
enterHaunted3D:5130 · advHealClick:5152 · buyTicket:5172 · renderHauntCard:5198 · buyHauntTicket:5253 · renderHeliCard:5280
buyHeliTicket:5338 · enterHeli3D:5361 · renderDroneCard:5383 · buyDroneTicket:5438 · enterDrone3D:5461 · renderDriveCard:5484
buyDriveTicket:5558 · enterDrive3D:5581 · pickDriveMap:5616 · enterMotoMapAsCar:5652 · renderSoccerCard:5674 · buySoccerTicket:5722
enterSoccer3D:5745 · renderMotoCard:5768 · buyMotoTicket:5817 · enterMoto3D:5840 · renderInvasionCard:5863 · INVASION_REWARD:5912
buyInvasionTicket:5914 · enterInvasion3D:5938 · WORLD3D:5963 · gotoRobotShop:5974 · scrollShopCardIntoView:5979 · railWorldClick:5982
railScrollHint:6007 · railScrollTop:6015 · initRailScroll:6020 · renderRailWorlds:6040 · tinvNoticeHTML:6101 · openTinvPicker:6109
fruitCountdown:6153 · renderFarmCard:6165 · renderFarmClock:6240 · buyFruit:6256 · sellFruit:6276 · sellAllFruit:6297
collectImg:6326 · renderFactoryCard:6332 · renderMarketCard:6355 · updateWishBadge:6411 · openWishlistDialog:6422 · bindStripArrows:6467
renderMarketBrowse:6479 · carImg:6508 · renderVehicleShop:6509 · CS_CYCLE_MS:6560 · carInteriorImg:6561 · carStatHtml:6563
renderCarShowroom:6570 · csShowBig:6597 · csInit:6624 · RS_CYCLE_MS:6647 · robotImg:6648 · renderRobotShop:6649
rsShowBig:6671 · rsInit:6692 · buyRobot:6711 · enterMecha3D:6733 · pickMechaRobot:6754 · pickDriveCar:6786
openCarBuyDialog:6829 · buyCarInsurance:6890 · payCarLoanMonthly:6909 · payCarLoanFull:6921 · carDriveBlock:6940 · gotoVehicleShop:6945
gotoMyStock:6950 · showNeedCarDialog:6956 · craftDiscount:6968 · renderFactory:6971 · renderOrdersUI:7040 · startProduce:7059
buyCollectible:7087 · cancelProduce:7115 · deliverOrder:7129 · renderOrderClock:7146 · renderCollectMine:7156 · openListDialog:7198
cancelListing:7251 · buyMarketItem:7274 · showCollectReveal:7301 · buyAC:7339 · openHomeShop:7358 · renderPetShop:7417
showLevelUp:7478 · renderStats:7515 · showTeacherCard:7591 · CALL_REACT_EMOS:7635 · CALL_TALK_MIN:7638 · CALL_TALK_HOLD:7639
CALL_ORDER_GAP:7641 · CALL_TONES:7647 · startCall:8021

## js/util.js (760 บรรทัด · 32 รายการ)
shuffle:6 · fmtNum:15 · escapeHTML:19 · seededRand:25 · fmtThaiDT:35 · fmtThaiDate:39
showScreen:44 · TOAST_WARN_RE:54 · restackToasts:57 · toast:79 · floatFx:99 · beep:109
PET_MOOD:181 · petVoiceSynth:188 · sirenSynth:265 · playCashier:289 · cashierSynth:303 · playSpark:336
sparkSynth:350 · thunderFx:385 · wordAudioFile:453 · speakWord:456 · speakLetter:476 · pickSpeakVoice:495
speakWordTTS:506 · askNameDialog:526 · askConfirm:566 · alertBox:584 · applyNoAnim:604 · openSettings:609
openHelp:715 · openTeacherGuide:741

## js/vocabbook.js (207 บรรทัด · 14 รายการ)
VB_MAX:11 · VB_QUIZ_N:12 · VB_QUIZ_MIN:13 · vbGroup:16 · VB_GROUP_UI:21 · vbRecord:24
vbSeen:49 · vbStats:62 · vbList:70 · vbReviewCat:81 · vbStartReview:95 · openVocabBook:106
vbRender:148 · vbCardHTML:194

## js/wordsearch.js (414 บรรทัด · 0 รายการ)

## js/wsaward.js (256 บรรทัด · 0 รายการ)

## css/lobby.css (3,807 บรรทัด · 565 selector)
:root:6 · html:15 · body:16 · *:33,34,35,36 · #app:39 · h1:41
.subtitle:42 · .shop-title:43 · #rotate-overlay:46 · .screen:68 · #screen-select:77,78,79,80(+5) · .egg-need:87
.petshop-topright:89 · .petshop-play-link:90,95 · #screen-quiz:134,135,136,137(+6) · #quiz-choices:146,147 · .word-card:154 · .quiz-choice:155,156,157
.big-btn:160,161,162,163 · #screen-dashboard:168,1054,1062 · .lobby-top:175,809,810,811(+16) · .top-flex:176 · .profile-plate:177,181,730,3007(+12) · #rain-fx:186
.rain-layer:189,195 · .rain-glass:202 · .glass-drop:203 · .rail-btn:218,822,828,829(+16) · .rail-badge:219 · .fr-code-box:224
.fr-code-label:228 · .fr-code-row:229 · .fr-code:230 · .fr-copy-btn:235,239,244,245 · .fr-search-btn:240 · .fr-add-btn:241
.fr-accept:242 · .fr-decline:243 · #fr-search-input:246 · #fr-search-result:250 · .fr-found:251 · .fr-hint:255
.fr-list-title:256 · .fr-row:257 · .fr-req:261 · .fr-row-name:263,267 · .fr-row-status:271 · .fr-req-btns:272
.online-dot:273 · .fr-chat-btn:274,279,281 · .fr-unread:282 · .fr-call-btn:288,294 · .chat-overlay:303 · .chat-box:307,608,615,622(+12)
.chat-head:319 · .chat-theme-btn:324,328 · .chat-secret-tg:329,330 · .cs-switch:331,332,337,338 · .cs-slider:333,335 · .chat-secret-note:339
.chat-theme-strip:342 · .chat-theme-sw:344,347,348,349(+1) · .chat-head-name:351,352 · .chat-close:353 · .chat-msgs:357 · .chat-empty:361
.chat-typing:363 · .ct-dots:365,366,368,369 · .no-anim:371,384,445,459(+40) · .chat-bubble:372,377,382 · .chat-emoji:385 · .chat-emo:389,393
.chat-input-row:394 · .chat-emoji-btn:398 · #chat-input:402 · .chat-send:406,411,412 · .chat-call-btn:418,422 · .call-ring:425
.cr-card:429 · .cr-kind:435 · .cr-av:436 · .cr-name:446 · .cr-id:447 · .cr-btns:448
.cr-btn:449,455,460 · .cr-no:456 · .cr-ok:457 · .cr-safe:461 · .call-ov:464,470,492,509(+6) · .call-stage:476
.ctile:477,488,489 · .ct-face:481 · .ct-me:487 · .ct-nm:502,506 · .ct-sub:507 · .call-add:531
.ca-head:538 · .ca-list:539 · .ca-row:540,544 · .ca-dot:545,546 · .ca-nm:547,548 · .ca-go:549
.ca-empty:550 · .ca-safe:551 · .ca-close:552 · .call-bar:556 · .cb-btn:561,566,567 · .cb-end:568,569
.call-emos:570 · .call-emo:575,576 · .call-fx:578 · .call-fx-emo:579 · .pl-click:671,673,674 · .pl-overlay:675
.pl-card:679,2266 · .pl-close:685 · .pl-head:689,2170,2173 · .pl-grade:694 · .pl-badges:696 · .pl-badge-chip:697,701
.pl-body:702 · .pl-loading:703 · .pl-none:704 · .pl-me-tag:705 · .pl-blk-wrap:707 · .pl-blk:708
.pl-stat:709 · .pl-lbl:714 · .pl-val:715,716 · .pl-tip:717 · .chip-edit:723,728,729 · .rank-mini:735,741,742,743
.pass-photo:745,750 · .pet-tabs:752 · .dict-box:753,757,758,759(+1) · .dict-card:765,770,774,775(+2) · .dict-head:771,772 · .dict-trail:779,783
.dt-c:784,788,789 · .dt-sep:790 · .dict-today:791 · .di-w:793,794,795 · .dict-list:796 · .dict-item:797,801,802,803(+5)
.lobby-mid:817 · .rail-wrap:820,845,849,850(+3) · .lobby-rail:821 · .rail-nudge:852,860,861,864(+1) · .rail-worlds:871 · .rail-div:872
.lobby-stage:914,916,932,1059(+13) · .newword-banner:922,929,934,3391(+1) · .coin-fly:945,948 · .coin-plus:954 · .nw-pop-coin:969,971,972 · .nw-pop-goal:975,976,980,984
.nw-goal-head:977,979,981 · .nw-goal-bar:982 · .nw-goal-fill:983 · .nw-pop-book:985,986 · .nw-tag:1007,3397 · .nw-word:1012,3401,3483
.nw-hint:1014,1015,3402,3482 · .nw-coin:1017,1020,3403,3407 · .nw-countdown:1025,3408 · .nw-bar:1027,3410 · .nw-bar-fill:1029 · .pet-stage:1032,2461
.nw-box:1039,2470 · .nw-pop-word:1040 · .nw-speak:1041 · .nw-pop-phon:1042 · .nw-ipa:1043 · .nw-pop-sent:1044
.nw-pop-mean:1045 · .pet-tab:1046,1047,1048,2813 · .stage-hero:1069,1084,1092,1237(+19) · .hero-ground:1106,1226,1232 · .hero-rank-bg:1108,1111,1114,1118(+18) · #lobby3d-canvas:1131,1132
.hero-scene:1136,1138,1145,1146(+8) · .caretaker-fig:1185 · .caretaker-img:1188 · .caretaker-emoji:1190 · .blk-rig:1197,1198,1199 · .stage-plate:1259,1267,1278,1279(+31)
.plate-title:1273 · .lobby-side:1316,1352,1357,1360(+22) · .side-sec:1319,2712,2985 · .side-label:1320,1325 · .side-label-row:1328,1329 · .lb-tabs-out:1330,1331,1335
.side-glass:1339,1346 · .side-card:1358,1470 · #quest-card:1370,1394,1395,1396(+6) · .q-bigcard:1371,1400,1401,1404(+1) · .qb-top:1373 · .qb-emoji:1374
.qb-name:1376 · .qb-bar:1377,1378 · .qb-row:1380 · .qb-prog:1381 · .qb-reward:1382 · .qb-go:1383,1387
.q-dots:1388 · .q-dot:1389,1390,1391 · .q-bonus:1392 · .feed-row:1415,2108,2113 · .inv-card:1417,1419,1420 · .inv-btns:1421
.inv-go:1422,1424 · .inv-x:1425 · #online-card:1429,2720,2721,2722(+4) · .fq-overlay:1430 · .fq-box:1432,2526 · .fq-head:1436,1438
.fq-close:1439 · .fq-sec:1441 · .fq-worlds:1442 · .fq-world:1443,1445 · .fq-acts:1446 · .fq-act:1447,1450,1451
.lb-prize:1484 · .lb-award-bar:1485,1491,1492 · .lb-award-go:1493 · .lbf-award:1495,1501,1502,1503 · .pod-pz:1504 · .wsa-overlay:1507
.wsa-box:1509 · .wsa-head:1514 · .wsa-title:1515 · .wsa-when:1516,1517 · .wsa-close:1518,1521 · .wsa-cols:1522
.wsa-col:1523 · .wsa-sec-h:1524,1525 · .wsa-msg:1526 · .wsa-msg-h:1529 · .wsa-msg-b:1530,1531 · .wsa-msg-none:1532
.wsa-rules:1534,1535 · .wsa-list:1536 · .wsa-row:1537,1539 · .wsa-r:1540 · .wsa-n:1541 · .wsa-s:1542
.wsa-p:1543 · .wsa-prizes:1544 · .wsa-pz:1545,1548 · .wsa-reveal-medal:1549 · .lobby-bottom:1559,1561 · .lobby-quiz-btn:1562
.lobby-book-btn:1563,1564 · .lobby-foodquiz-btn:1565,1566 · .lobby-play-btn:1567,1571 · .lobby-exam-btn:1573,1574,1576 · .panel-overlay:1581,1586,3496,3497(+5) · .panel-box:1587
.panel-head:1594,1598 · .panel-close:1599,1604 · .panel-body:1605,1609,1610 · .panel-page:1607,1608 · .collect-sub:1614 · .mkt-empty:1615
.craft-box:1616 · .mkt-listing:1617 · .mkt-filter:1618,1962 · .hq-grid:1625 · .hq-card:1626,1631,1655 · .hq-head:1632
.hq-pic:1638,1640 · .hq-emoji:1642 · .hq-badge:1643 · .hq-stars:1647 · .hq-price:1648,1653,1654,1657(+6) · .craft-credit:1661,1663,1664
.car-grid:1671,1673,1674 · .robot-weap:1675 · .dmap-box:1678,1679 · .dmap-grid:1685 · .dmap-card:1687,1690,1691,1692(+2) · .dmap-ico:1694
.dmap-new:1697 · .dcp-grid:1699 · .dcp-card:1701,1704,1705,1706(+10) · .levelup-box:1723,2427,2428,2523 · .dcp-box:1726,1727,1731,1732(+6) · .dcp-lock:1740
.sold-badge:1744,1746,1747 · .rs-showroom:1749,3795,3796 · .rs-list:1750,1752,3776,3779 · .rs-thumb:1753,1755,1756,1757(+1) · .rs-thumb-pic:1758,1759 · .rs-thumb-price:1760
.rs-stage:1762 · .rs-big:1765 · .rs-big-img:1766 · .rs-elec:1770,1774,1779 · .rs-edge:1780,1786 · .rs-info:1789,1790,1791,1792(+1)
.rs-buy:1794,1796,1797 · .cs-showroom:1801,3768,3769,3797(+3) · .cs-list:1802,1804,3770,3775(+9) · .cs-thumb:1805,1807,1808,1809(+1) · .cs-thumb-pic:1810,1811 · .cs-thumb-name:1812
.cs-thumb-price:1813 · .cs-thumb-own:1814 · .cs-stage:1816 · .cs-big:1819 · .cs-big-img:1820 · .cs-elec:1824,1828,1832
.cs-edge:1833,1839 · .cs-interior:1842 · .cs-inr-label:1843,1844 · .cs-inr-img:1845 · .cs-info:1847,1848,1849,1850(+6) · .cs-buy:1858,1860,1861,1862
.car-emoji:1864 · .car-mine:1870 · .car-mine-pic:1875 · .car-mine-info:1876 · .car-loan:1877,1878 · .car-mine-btns:1879,1880,1881
.car-locked:1883 · .car-mine-head:1885 · .car-pick-list:1886,1887 · .car-pick:1888,1890,1891 · .car-pick-pic:1892,1893 · .car-pick-name:1894,1895
.car-pick-od:1896 · .car-buy-box:1898,2530 · .cb-pic:1899,1900,1901 · .cb-lines:1902 · .cb-li:1903,1907,1908 · .cb-ins:1909,1913,1914
.cb-plan:1915 · .cb-pl:1916,1921,1923,1927(+1) · .cb-total:1934 · .cb-btns:1935,1940 · .cb-x:1936 · .shop-grid:1943
.shop-item:1944,1949,1954,1955(+3) · .mkt-tab:1963,1964 · .pg-btn:1965,1966,1967 · .pg-dot:1968 · .fr-gift-btn:1991,1996 · .gift-sec-title:1999
.gift-in-row:2001 · .gift-out-row:2005 · .gift-in-pic:2006,2008,2009 · .gift-in-info:2010,2011 · .gift-in-btns:2012 · .gift-accept:2013,2017,2019
.gift-decline:2018 · .gift-box-card:2020 · .gift-box-from:2021,2022 · .gift-note:2023 · .gift-pick-overlay:2026 · .gift-pick-box:2030
.gift-pick-head:2036,2040 · .gift-pick-close:2041 · .gift-pick-tabs:2043 · .gp-tab:2044,2048 · .gift-pick-body:2049 · .gp-chips:2050
.gp-chip:2051,2055 · .gp-card:2056,2057 · .gp-price:2058 · .gp-note:2059 · .gift-cf-pic:2060 · .chat-emoji-cats:2065
.chat-emoji-cat:2069,2073,2074 · .chat-emoji-wrap:2075,2076 · .stage-left:2084,3487 · .pet-info-btn:2088,2095,2096 · .feed-list:2103,2107 · .feed-ico:2114
.feed-txt:2115 · .feed-name:2116 · .feed-ago:2117 · .feed-empty:2118,2121 · .pi-overlay:2123 · .pi-box:2127,2132,2133,2137(+2)
.pi-close:2139,2144,2145 · .pi-close-left:2147 · .pi-portrait:2149 · .pi-dress-btn:2156,2160,2161 · .pi-shape-cap:2162,2165,2166,2167 · .greet-card:2174
.greet-sub:2175 · .greet-grid:2176 · .greet-opt:2177,2180,2181,2182 · .greet-e:2183 · .pi-streak:2187 · .pi-streak-head:2189,2191
.pi-streak-best:2192 · .pi-dots:2193 · .pi-dot:2195,2196,2197 · .pi-streak-note:2198 · .pi-care-title:2199 · .lbf-overlay:2202
.lbf-box:2205 · .lbf-head:2210 · .lbf-title:2211 · .lbf-tabs:2212,2215 · .lbf-close:2218 · .lbf-close-l:2219
.lbf-body:2220 · .lbf-grid:2221 · .lbf-cell:2223,2226,2227,2228(+1) · .lbf-podium:2232 · .pod:2234,2261,2262 · .pod-char:2236
.pod-base:2238 · .pod-rank:2240 · .pod-label:2242 · .pod-name:2244 · .pod-sc:2246 · .pod-1:2251,2252
.pod-2:2253,2254 · .pod-3:2255,2256 · .pod-4:2257,2258 · .pod-5:2259,2260 · .pl-wide:2279,2282,2283,2284(+8) · .pl-follow:2285,2290,2292
.pl-unfollow:2294,2300,2301 · .pl-followers:2302 · .pl-cols:2303 · .pl-col:2304 · .pl-sec-title:2305 · .pl-feed:2306,2309,2316
.pl-feed-row:2310,2314,2315 · .pl-assets-wrap:2318,3676,3751 · .pl-assets:2319,3679,3684,3690(+4) · .pl-asset:2322,2326,2333 · .pl-asset-emoji:2327 · .pl-asset-n:2328
.pl-pets-wrap:2335 · .pl-pets:2336 · .pl-pet:2337,2342,2344 · .pl-pet-nm:2345 · .img-lightbox:2348,2353,2354,2358(+3) · .pl-chat:2371,2376
.pl-call:2378,2384 · .pet-peek:2385,2386 · .pp-chips:2388 · .pp-chip:2389 · .pp-gift:2394,2400 · .settings-box:2402,2403,2472,2477(+20)
.set-feed-head:2404 · .set-feed-sub:2408 · .set-feed-row:2409 · .pillinfo-val:2414 · .pillinfo-desc:2419,2438 · .pillinfo-box:2430
.plf-head:2433 · .plf-emoji:2434 · .plf-ht:2435,2436,2437 · .plf-foot:2439 · .alert-box:2444,2446 · .ab-emoji:2447
.ab-title:2448 · .ab-desc:2449 · .ab-btns:2450,2451,2452 · .heal-heart:2454 · .attn-box:2469 · .help-box:2501,2502,2503
.wl-box:2524 · .food-box:2525 · .home-shop-box:2527 · .summary-box:2528 · .report-box:2529 · .wl-grid:2532
.tc-wrap:2534 · .spell-btn:2540,2545 · .sp-hud:2546 · .sp-word:2548 · .sp-ch:2549,2554 · .sp-th:2556
.sp-hint:2558 · .sp-exit:2561,2565 · .sp-banner:2566 · .sp-big:2571 · .sp-thb:2573 · .sp-coin:2574
#spell-confetti:2579 · .sp-rb:2580 · .sp-day:2590 · .sp-perfect:2592 · .sp-late:2594 · #spell-coinpop:2597
.side-sub:2706,2708 · .sec-quest:2713 · .on-page:2724,2725,2726,2727 · .inbox-overlay:2737 · .ib-box:2739 · .ib-head:2743
.ib-close:2747,2749 · .ib-list:2750,2751 · .ib-row:2752,2753,2754,2755 · .ib-ava:2756 · .ib-on:2760 · .ib-mid:2762
.ib-name:2763 · .ib-last:2764 · .ib-meta:2765 · .ib-time:2766 · .ib-dot:2768 · .ib-story-badge:2771
.ib-empty:2775 · .ib-story:2777,2779 · .ib-story-item:2780,2782,2789 · .ib-story-ava:2783 · .ib-story-on:2787 · .ib-world:2792,2795
.ib-tabs:2797 · .ib-tab:2798,2801,2803 · .ib-tab-dot:2804 · .ib-call-ava:2808 · .ib-call-row:2809,2810 · #btn-music:2816,2819,2820
#ws-overlay:2835 · #ws-board:2838,2844,2846 · .ws-head:2849 · .ws-title:2850 · .ws-findbar:2853 · .ws-tip:2854
.ws-grade:2856,2857 · .ws-body:2860 · .ws-gridwrap:2861 · #ws-grid:2864 · .ws-cell:2869,2874,2877,2880(+2) · .ws-flash:2886,2888
.ws-coinpop:2892,2916 · .ws-combo:2903,2907,2908,2909 · .ws-find:2920 · #ws-prog:2921 · #ws-words:2925,2929 · .ws-word:2931,2936,2937,2938(+2)
.ws-actions:2944,2945,2954 · .ws-sizes:2949 · .ws-sizes-lb:2951 · .ws-size-now:2952 · #ws-new:2955 · #ws-stash:2956
#ws-clear:2957 · #ws-win:2958,2960 · .ws-win-in:2961,2964 · .sec-online:2987 · .rank-tab:3015,3016,3017,3018(+2) · .pet-show-bg:3045,3048,3052,3056(+14)
.pet-show:3107,3110,3122,3124(+15) · .ps-video:3243 · .id-card:3297,3303,3307 · .id-chip:3320 · .clock-chip:3329,3330 · .coin-group:3345
.cp-lb:3367 · .cp-v:3368 · .top-flex2:3484 · #panel-factory:3503,3504,3508,3509(+39) · .grid2x8:3632,3638 · .mine-strip:3656,3658,3659,3664(+4)
.mb-strip:3670,3709

## css/style.css (1,763 บรรทัด · 460 selector)
:root:5 · *:15 · html:16,21 · input:25 · body:29 · #app:35
.screen:38,39 · h1:42 · .subtitle:43 · .egg-grid:46,63 · .egg-card:47,52,53,54(+2) · .pet-price:57,61
.egg:65,71,75 · .d1:76 · .basket:79,80,85,91(+5) · .basket-dog:89,102,103,104 · .basket-cat:90,105,106,107 · .egg-dragon:110
.topbar:125 · .topbar-coins:126 · .coin-pill:127,138,142,147(+2) · .coin-ic:134 · .no-anim:148,563,1472,1720(+2) · .net-coin:150
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
.quiz-score-pill:1153 · .stats-card:1156 · .stats-title:1160,1593 · .stats-row:1161,1162,1163,1164 · .game-top:1167 · .back-btn:1168
.combo-pill:1172 · .timer-wrap:1176 · .timer-fill:1177,1178 · .board-label:1180 · .card-grid:1181 · .word-card:1182,1188,1189,1190(+3)
.hint-btn:1196,1201 · .game-endless-note:1204,1209,1211,1215(+6) · .report-btn:1236,1241 · .report-box:1244 · .report-close:1245 · .rp-head:1249
.rp-avatar:1250,1251 · .rp-title:1252 · .rp-sub:1253 · .rp-levelcard:1255 · .rp-level-top:1259 · .rp-bar:1260
.rp-bar-fill:1261 · .rp-level-note:1262,1263 · .rp-grid:1265 · .rp-stat:1266 · .rp-ic:1269 · .rp-num:1270
.rp-lbl:1271 · .rp-section:1273 · .rp-h3:1274 · .rp-badge-mini:1275 · .rp-row:1276,1277,1278 · .rp-empty:1279
.rp-badges:1280 · .rp-badge:1281 · .rp-tline:1284 · .rp-tl-head:1285,1286 · .rp-tl-ems:1287 · .rp-em:1288,1289
.rp-tl-note:1290,1291 · .rp-crown:1293,1294 · .rp-wtitle:1296 · .rp-wnow:1297,1298 · .rp-wgraph:1299 · .rp-wcol:1300
.rp-wval:1301 · .rp-wbar:1302,1303 · .rp-wlbl:1304 · .rp-cheer:1306 · .report-ok:1310 · .summary-box:1313,1364,1368,1369(+2)
.sm-burst:1314 · .sm-title:1316 · .sm-line:1317 · .sm-coin:1318 · .sm-matches:1324,1325 · .confetti:1327
.sm-badge:1334 · .sm-badge-all:1338 · .badge-celebrate-overlay:1341,1354 · .badge-celebrate:1345 · .bc-emoji:1351 · .bc-title:1352
.bc-sub:1353 · .sm-cheer:1358 · .sm-streak:1359,1360 · .sm-sick:1361 · .sm-btns:1362 · .float-fx:1374
.toast:1381 · .toast-warn:1388,1395,1396,1402 · .toast-clear-all:1404,1411 · .alert-box:1413 · .alert-ok:1414,1419 · .settings-box:1421
.set-row:1422 · .set-hint:1426 · .set-hint-on:1427 · .set-hint-off:1428 · .set-lwrap:1429 · .set-label:1430
.set-desc:1431 · .set-switch:1432,1436,1437,1442(+4) · .set-sw-knob:1438 · .set-sw-txt:1445 · .set-close:1451,1456 · .set-help:1457,1462
.help-box:1464,1465,1470 · .help-item:1466 · .update-banner:1478,1487,1488 · #update-reload:1489 · #update-dismiss:1493 · .levelup-overlay:1499
.levelup-box:1503,1510,1511,1512(+4) · .bill-box:1518,1522,1523 · .tag-off:1524 · .home-decayed-img:1525 · .home-dark-img:1526 · .thirst-fill:1527
.thirst-text:1528,1529 · .toxin-fill:1532 · .toxin-text:1533,1534 · .detox-btn:1535,1540 · .shape-text:1543,1544,1545,1546(+1) · .avatar-pick:1550
.avatar-opt:1551,1555,1556,1557 · .avatar-chip-img:1561 · .avatar-chip-blk:1563 · .set-avatar-btns:1564 · .avatar-mini:1565,1569 · .set-blk-row:1571
.set-sub2:1572 · .blk-grid:1574 · .blk-mini:1575,1578,1579,1580 · .game-avatar:1583,1584,1585 · .stats-nick:1594 · .ticket-owned:1597,1601
.collect-sub:1606 · .mkt-tabs:1607 · .mkt-tab:1608,1612 · .mkt-filter:1613 · .mkt-row:1617 · .mkt-emoji:1621,1622
.mkt-info:1623,1624 · .mkt-tier-stars:1625 · .mkt-buy:1626,1631,1632 · .mkt-price-lo:1633 · .mkt-price-hi:1634 · .mkt-empty:1635
.collect-grid:1638 · .collect-cell:1639 · .cc-emoji:1640,1641 · .cc-name:1642 · .cc-count:1643 · .cc-list-btn:1644,1648
.mkt-listhead:1649 · .mkt-group-head:1651,1657 · .mkt-listing:1658 · .ml-cancel:1662 · .mkt-sold:1668,1669,1670 · .list-dialog:1677,1678,1683
.list-hint:1682 · .collect-reveal-frame:1686,1693 · .collect-reveal-img:1692 · .collect-reveal-stars:1694 · .craft-box:1697 · .craft-head:1698
.craft-bar:1699 · .craft-fill:1700 · .craft-text:1701 · .craft-btn-row:1702,1703 · .craft-go-btn:1705,1711,1712,1715 · .craft-cancel:1723,1727
.mkt-catalog:1730,1731,1732 · .mkt-pager:1735 · .pg-btn:1736,1740,1741 · .pg-mid:1742 · .pg-dots:1743 · .pg-dot:1744,1745
.order-head:1746 · .order-row:1747,1752,1754,1756 · .order-deliver:1757,1762 · .order-need:1763
