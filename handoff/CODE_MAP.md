# CODE_MAP.md — แผนที่โค้ด:บรรทัด (เจนอัตโนมัติโดย `tools/gen_code_map.py` — **ห้ามแก้มือ** เดี๋ยวโดนเขียนทับ)

> วิธีใช้: หาชื่อฟังก์ชัน/ค่าคงที่/selector ในไฟล์นี้ (Grep หรือกวาดตา) → `Read` ไฟล์จริง `offset=<บรรทัด>` `limit=40`
> 🗂️ ไฟล์อ้วนมี **สารบัญโซน** (`st-end ชื่อโซน`) — งานทั้งระบบ/โลก 3D: Grep ชื่อโซน → Read/Edit เฉพาะช่วงนั้น **ห้ามอ่านทั้งไฟล์** · เพิ่มระบบใหม่ในไฟล์อ้วนต้องครอบ banner `/* ==== */`+ชื่อโซน (สารบัญเจนเอง)
> css = index `selector:บรรทัดทุกจุดที่ประกาศ` (บั๊ก UI เริ่มหาที่นี่) · เจนใหม่ทุกครั้งที่รัน `python tools/rotate_handoff.py` · อัปเดต: 2026-07-28

## js/adv3d_css.js (1,057 บรรทัด · 0 รายการ)

## js/adv3d_intro.js (70 บรรทัด · 0 รายการ)

## js/adv3d_tex.js (229 บรรทัด · 18 รายการ)
TILE_COLORS:9 · letterTexture:10 · emojiTexture:24 · GHOST_IMG_MAX:36 · measureGhostBox:42 · probeGhostImages:55
whenGhostsReady:67 · ghostTexture:71 · ghostScareSrc:76 · AD_STYLES:84 · adBoardTexture:93 · addAdBillboard:140
ringAds:151 · BUILDING_TINTS:161 · FACADE_ROWS:163 · buildingFacadeTexture:164 · makePeerSprite:189 · bind:225

## js/adventure3d.js (10,718 บรรทัด · 536 รายการ)
### 🗂️ สารบัญโซน js/adventure3d.js (Read/Edit เฉพาะช่วง)
- 1-213 adventure3d.js — โลก 3D First-person 2 โหมด (คิว 7725691507 ข้อ 8 + ต่อยอด)
- 214-277 ⚽ โหมดสนามฟุตบอล (โหมด soccer · รอบ 196) — เล็ง+ชาร์จพลังเตะบอลใส่ป้ายตัวอักษร
- 278-332 🤖 โหมดหุ่นยนต์นักรบ (โหมด mecha · รอบ 199) — มุมมองในหุ่นสูง 5m เดินยิงเอเลี่ยนตัวอักษร
- 333-475 📻 หอบังคับการบิน (รอบ 64 · รอบ 66 เปลี่ยนเป็นอังกฤษล้วนตามผู้ใช้สั่ง)
- 476-496 คำศัพท์ — ตามระดับชั้น + ไม่ซ้ำคำที่ประกอบแล้ว (8.1/8.6) · แยกคลังต่อโหมด
- 497-633 Texture ตัวอักษร / emoji / ป้ายชื่อผู้เล่น (canvas → sprite)
- 634-804 🧱 ตัวละครบล็อก (โลกขับรถ) — เลือกก่อนออกรถ · เพื่อนใน map เห็นเป็นหุ่นบล็อกขับรถบล็อก
- 805-1111 🚙 รอบ 393: รถเพื่อนในโลกขับรถ = โมเดลจริง img/models/car_01.glb (ผู้ใช้สั่ง)
- 1112-1264 สร้างฉาก static ครั้งเดียวต่อโหมด
- 1265-1582 🚗 เมืองกำแพงเพชรจริง (โหมด drive) — ข้อมูล OpenStreetMap ใน js/data/city_kpp.js
- 1583-1597 🌅 ท้องฟ้าภาพจริง (รอบ 203) — ใส่ภาพ panorama 360° (equirectangular 2:1) เป็นฉากหลังท้องฟ้า
- 1598-1981 🧱 เทกซ์เจอร์ภาพจริง (รอบ 323) — วางไฟล์ `img/tex/<key>.jpg` (หรือ .png) แล้วแปะทับพื้นผิวทันที
- 1982-2081 ตัวอักษรในโลก (8.2)
- 2082-2136 🔠🪙 เก็บตัวอักษร 1 ตัว = ได้ 1 เหรียญ (รอบ 345)
- 2137-2195 ประกอบคำอัตโนมัติเมื่อมีตัวอักษรครบ (8.1/8.4)
- 2196-2290 โหมด adv: monsters ยิงสู้ได้ (สเปกเดิม 8.5)
- 2291-2471 โหมด haunt: ผีโผล่ 3 วิ → ย้ายที่ · สู้ไม่ได้ · โดนจับ = game over
- 2472-2623 เสียงหลอนโหมดผีสิง — สังเคราะห์ Web Audio (ปลอดลิขสิทธิ์ 100%)
- 2624-2943 Multiplayer — ผู้เล่นอื่นใน map เดียวกัน (สไตล์ Roblox)
- 2944-3143 Voice chat ใน map — WebRTC P2P mesh (เสียงวิ่งตรงระหว่างเครื่อง)
- 3144-3230 🏁 พิธีประกาศแชมป์ (ครูกด "จบรอบแข่ง") — /class/<map>/podium
- 3231-3433 HUD
- 3434-4046 DOM overlay + CSS (สร้างครั้งเดียว — self-contained ไม่แตะ style.css)
- 4047-4172 Input — เมาส์+คีย์บอร์ด และจอสัมผัส (มือถือ landscape)
- 4173-4177 🚁 โหมดเฮลิคอปเตอร์ Bell — ฟิสิกส์บินแบบอาร์เคด (สไตล์ Helicopter Flight Pilot)
- 4178-4569 🛸 โดรน FPV (โหมด drone) — บินเร็ว/คล่อง ลอดหน้าต่างเข้าตึกร้าง เก็บตัวอักษรในห้อง
- 4570-4692 🚗 โหมดขับรถเมืองกำแพงเพชร — ฟิสิกส์รถอาร์เคด (bicycle model)
- 4693-4786 🚦 รอบ 133: ไฟจราจรจริงที่ทางแยกใหญ่ + ฝ่าไฟแดงโดนใบสั่ง ม.22
- 4787-5214 🧭 GPS นำทาง (โหมด drive) — เลือกตัวอักษรเป้าหมาย + เส้นทางตามถนนจริง (A*) + เสียงอังกฤษเลี้ยว
- 5215-5273 🎛️ เข็มหน้าปัดวิ่งจริง (สปีด 0-180 + วัดรอบ 0-8×1000) — วาดทับวงเกจของภาพ dash.png
- 5274-5358 🎵 รอบ 181: วิทยุในรถ — จอ head-unit กลางคอนโซล (visualizer + เลือกเพลง 3 โหมด)
- 5359-5486 🪆 รอบ 191: ตุ๊กตาดุ๊กดิ๊กหน้ารถ — รูปตัวละครที่ผู้เล่นเลือก (blkN.png)
- 5487-5790 🚔 รอบ 128: แผงเตรียมออกรถ + กฎหมายจราจร + ใบสั่ง
- 5791-5833 🛩️📦 ภารกิจไปรษณีย์กลางคืน (รอบ 353) — เฉพาะช่วงฟ้ามืด (heliNight>.5)
- 5834-7021 🚶🛗🚁🪂 โหมดเดินเท้าในเมืองเฮลิฯ (รอบ 354 — ผู้ใช้สั่ง)
- 7022-7095 🎛️ หน้าปัดเข็มขยับจริง (รอบ 61) — วาดสดทุกเฟรมจากค่าการบินจริง
- 7096-7365 🌧️☀️ ชั้นบนกระจก: ที่ปัดน้ำฝน + แสงแดดสาด (รอบ 346)
- 7366-7770 🔊🌧️ เสียงที่ปัดน้ำฝน (รอบ 537) — สังเคราะห์ล้วน ไม่มีไฟล์เสียง
- 7771-7840 📹 กล้องใต้ท้องเครื่อง (belly cam) — รอบ 348
- 7841-7912 🎯 วงเป้าลงจอด (รอบ 349) — ไฮไลต์ดาดฟ้าที่มีตัวอักษร ให้รู้ว่าควรร่อนลงตรงไหน
- 7913-8528 📏 แถบเตือนความเร็วดิ่ง (รอบ 349) — ลงเร็วเกินกรอบกล้องกะพริบแดง สอนให้ร่อนลงนุ่มๆ
- 8529-8531 Loop หลัก
- 8532-9758 ⚽ โหมดสนามฟุตบอล — ฟิสิกส์บอล + เล็ง + ชาร์จพลัง + กล้อง 1st/3rd + ชุดนักเตะ
- 9759-10206 🤖 โหมดหุ่นยนต์นักรบ — เดินยิงเอเลี่ยนตัวอักษร (ต้องยิงเรียงลำดับในคำ)
- 10207-10219 เข้า/ออกโลก
- 10220-10718 ❓ การ์ด "วิธีเล่น" ตอนเข้าโลกครั้งแรก (จำแยกต่อโลกใน localStorage — ไม่แตะ state.js)
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
ATC:351 · netUp:469 · CHAT_MAX:472 · doneList:479 · wordPool:480 · pickWords:493
adRenterActive:505 · FACADE_ROWS:512 · adsFetch:518 · adsWatch:530 · adsStop:537 · adsChanged:538
adRentBuy:549 · heliMusicTick:572 · AD_FLYBY_COIN:576 · adFlybyTick:578 · adShopOpen:597 · adShopRender:611
BLOCK_AVATARS:640 · blkGeo:651 · blkMat:652 · blkCyl:653 · blkFaceMat:655 · makeBlockFigure:670
makeBlockCar:710 · blkNameSprite:756 · makeBlockPeer:772 · makeBlockWalkPeer:793 · disposeBlockPeer:801 · CAR_GLB_URL:812
CAR_GLB_LEN:813 · carSplitWheel:817 · carGlbEnsure:844 · carMatGet:863 · carGlbBuild:879 · carAvCode:928
driveCamToggle:935 · SKID_N:954 · skidGeomGet:956 · skidDrop:961 · skidTick:975 · blkBuildThumbs:985
blkBuildPicker:1003 · pickBlockAvatar:1048 · bubbleSprite:1071 · showPeerBubble:1098 · removePeerBubble:1106 · concreteTexture:1116
brokenWindowTexture:1133 · intactGlassTexture:1149 · chargeIconTexture:1167 · rustyDoorTexture:1176 · dAddBox:1190 · buildAbandoned:1197
makeNameSprite:1270 · flatGeom:1283 · flatGeomUV:1292 · buildDriveCity:1302 · SKY_IMG:1588 · applySky:1589
applyTex:1604 · buildScene:1627 · randPos:1985 · randRoadPos:1993 · spawnLetter:2005 · spawnLettersForWord:2036
ensureCoverage:2038 · relocateLetters:2051 · removeLetter:2076 · LETTER_COIN:2087 · pickUpLetter:2088 · letterPop:2102
letterChime:2120 · tryCompleteWords:2140 · completeWord:2154 · spawnMonster:2199 · killMonster:2208 · tickMonsters:2216
damagePlayer:2238 · shoot:2254 · tickShots:2268 · spawnGhost:2294 · GHOST_STYLE:2303 · GHOST_H_DEFAULT:2304
applyGhostSize:2305 · respawnGhost:2314 · tickGhosts:2330 · sessionRecapHtml:2376 · hauntRunSec:2383 · fmtSurv:2384
hauntSurviveFinish:2385 · tickSurvive:2395 · renderHearts:2408 · ghostHit:2417 · caught:2439 · knockedOut:2465
netReady:2629 · netJoin:2635 · sendPos:2650 · sendChat:2692 · toggleChatBox:2706 · onPeerData:2717
disposeHeliMesh:2805 · removePeer:2810 · netLeave:2825 · tickPeers:2831 · RTC_CFG:2952 · tinvLinked:2953
partyWord:2960 · syncPartyWord:2973 · updateVoiceBtns:3125 · PODIUM_BONUS:3150 · podiumJoin:3152 · podiumLeave:3163
endRound:3164 · showPodium:3175 · tinvCheck:3215 · showBanner:3235 · renderHudTop:3241 · renderHudWords:3246
renderHudInv:3256 · ddTierFromName:3263 · renderBoard:3265 · drawBigMap:3299 · openBigMap:3354 · closeBigMap:3362
drawMinimap:3367 · loadCarDash:3439 · loadCarWheel:3451 · buildDom:3461 · confirmExit:4031 · IS_TOUCH:4050
bindInput:4051 · movePlayer:4138 · tickPlayer:4148 · collideDrone:4181 · propStall:4200 · propBreak:4207
propFix:4214 · droneBatAdd:4221 · lightningBolt:4224 · startRain:4235 · stopRain:4249 · smashGlass:4251
awardGlass:4262 · neededLetter:4279 · openDoor:4294 · raceStartRun:4314 · raceStop:4321 · gateHighlight:4339
renderRaceHud:4346 · tickDrone:4355 · nearMissTick:4497 · showNearMiss:4521 · awardDaredevil:4532 · comboCheer:4549
comboFlash:4565 · driveCell:4574 · nearestStreet:4580 · collideCar:4590 · tlDotY:4621 · tlSet:4625
driveArms:4642 · tlTick:4654 · TL_GREEN:4698 · tlRedDur:4700 · tlightPhase:4701 · buildTrafficLights:4708
rlTick:4760 · cellDrivable:4792 · cellCenter:4793 · losClear:4795 · nearestDrivableCell:4805 · routeGrid:4814
pickGpsTarget:4867 · gpsSpeak:4879 · NAVLINE_W:4898 · navLineEnsure:4899 · navLineHide:4909 · navLineUpdate:4910
tickGps:4937 · tickDrive:5013 · drawCarDial:5221 · drawCarGauges:5251 · RADIO_RECT:5279 · CAR_RADIO_RECT:5281
carRadioRect:5287 · radioLayout:5289 · radioSetHint:5312 · renderRadioList:5318 · radioToggleList:5328 · drawRadioViz:5333
radioTick:5351 · BOBBLE_FOOT:5364 · BOBBLE_H:5365 · BOBBLE_ASPECT:5366 · BOB_OMEGA:5369 · BOB_PITCH_FORCE:5371
BOBBLE_SKINS:5373 · bobbleSetAvatar:5380 · bobbleLayout:5387 · bobbleTick:5400 · bobblePoke:5425 · bobbleApplySkin:5442
dollOwned:5452 · openDollPicker:5453 · carStartShow:5490 · showLawInfo:5508 · lawNotice:5530 · driveFineSettle:5540
HELI_PHASES:5719 · heliStartPhase:5726 · heliFloorAt:5733 · SOFT_TIERS:5743 · softLandBonus:5745 · awardPerfLand:5758
setHeliLight:5777 · MAIL_COIN:5796 · mailStart:5798 · mailStop:5821 · mailTick:5822 · FOOT_EYE:5841
doorSlideSfx:5847 · doorLerp:5870 · entLerp:5878 · footStepSfx:5888 · WRING_COIN:5909 · festivalPaint:5913
dustTexture:5925 · dustBurst:5934 · dustTick:5948 · HELI_GLB_URL:5969 · HELI_GLB_TEX_BLUE:5971 · HELI_GLB_ROTOR:5973
HELI_GLB_TROTOR:5974 · heliGlbEnsure:5976 · heliMatBlueGet:5994 · heliGlbAssemble:6007 · heliNavTick:6046 · peerRotorStop:6053
peerRotorTick:6059 · heliCrashSfx:6078 · heliMeshBuild:6106 · heliMeshBuildLegacy:6117 · buildHeliFoot:6247 · footFloorAt:6363
insideTerm:6370 · inDoorZone:6371 · footHint:6375 · setFootBtns:6376 · liftStart:6381 · beginRide:6392
endRide:6415 · beginWing:6426 · awardAirLetter:6439 · paxChoiceShow:6458 · paxChoiceHide:6484 · pilotShipMesh:6488
beginPilot:6489 · endPilot:6521 · drawCabinWindow:6545 · tickHeliFoot:6569 · tickHeli:6778 · CP_NAT:7030
CP_GAUGES:7031 · SEAT_LABEL:7044 · SEAT_P_FULL:7045 · SEAT_ZOOM:7046 · DASH_OFF_Y:7047 · DASH_DROP:7048
setSeat:7050 · layoutCockpit:7062 · WIPER:7101 · WIPER_SPD:7104 · WIPER_LABEL:7105 · INT_GAP:7106
WASH_MS:7110 · WASH_TANK_MAX:7114 · SMEAR_LIFE:7126 · CHOP_MIN:7127 · SUN_RAY_FAR:7131 · sunRayBlocked:7133
sunShadeTick:7152 · applyCockpitShade:7163 · rotorChop:7175 · sunUpdate:7183 · HELI_FOG_N0:7194 · fogUpdate:7198
adGlowPulse:7244 · RAIN_MAX:7253 · VISOR_Y:7254 · RAIN_MIN:7255 · RAIN_DUR:7256 · DROP_ZONE:7260
addDrop:7261 · tickDrops:7269 · addWashDrop:7287 · washStart:7294 · renderWashGauge:7314 · washTick:7325
grimeTick:7342 · WIPE_R:7349 · wipeDrops:7350 · wiperSndOn:7373 · wiperSndOff:7385 · wiperThunk:7391
washSpraySfx:7403 · wiperSqueak:7420 · wiperSndTick:7437 · setWiper:7457 · tickWiper:7469 · SH_SWEEP:7500
shadowSweepTick:7502 · REFL_MAX:7514 · REFL_COL:7516 · cityGlowLevel:7517 · drawCityGlow:7522 · setVisor:7554
rainTick:7560 · drawBlade:7577 · drawSmears:7596 · drawGlass:7616 · drawBellyCam:7778 · drawBellyHud:7801
drawLandingTargets:7847 · VS_HARD:7917 · drawDescentBar:7918 · heliShake:7967 · cpNeedle:7978 · drawGauges:7995
XF_START:8043 · PRELOAD_WAIT:8044 · ALT_QUIET_FROM:8046 · ALT_MAX_DAMP:8047 · ALT_LP_MIN:8048 · ECHO_NEAR:8049
WIND_FULL_SPD:8050 · SHUTDOWN_SEC:8051 · PAN_MAX:8053 · OD_RPM:8054 · SHAKE_RPM:8055 · SHAKE_HIT:8056
soccerLetterPos:8536 · letterNeeded:8544 · soccerNeededSet:8549 · soccerTileGeo:8555 · soccerGoldTexture:8557 · makeSoccerTile:8574
soccerRefreshSkins:8583 · soccerBuildTargets:8590 · soccerNextTile:8600 · soccerRetarget:8613 · soccerCoinPop:8625 · soccerGrassTexture:8638
soccerTurfGrade:8660 · soccerTurfTexture:8683 · grassNormalTexture:8702 · soccerLinesTexture:8731 · soccerNetTexture:8782 · soccerCrowdTexture:8790
soccerBallMat:8809 · buildSoccerGoal:8829 · buildStands:8848 · soccerLedBoards:8883 · soccerGKEnsure:8980 · soccerGKTick:8996
fkBuildWall:9025 · fkToggle:9040 · fkHitTest:9056 · pkHud:9075 · pkStart:9084 · pkEnd:9098
pkTick:9113 · repQualify:9120 · repEnsureEl:9123 · repStart:9134 · repTick:9141 · soccerNumTex:9166
makeSoccerPlayer:9176 · soccerNewSpot:9202 · soccerResetBall:9214 · soccerKick:9221 · soccerCheer:9238 · guideTexture:9241
auraActive:9265 · auraLeftMs:9266 · buildAura:9268 · auraBuy:9289 · auraRender:9299 · auraTick:9313
buildDrill:9333 · drillTick:9346 · buildLandRing:9383 · buildGuideRibbon:9393 · renderSpinPad:9418 · spinPadToggle:9430
spinPadPick:9436 · renderCurl:9448 · kickLaunch:9459 · updateSoccerGuide:9467 · soccerCamera:9531 · tickSoccer:9552
soccerKitShow:9732 · soccerKitGo:9747 · emojiSprite:9800 · makeAlien:9805 · startWave:9838 · waveSpawnFill:9849
waveComplete:9858 · updateWaveHud:9868 · checkMechaBossBadge:9870 · alienSpawnPos:9879 · removeAlien:9884 · mechaHudWord:9889
setMechaHudSkin:9897 · mechaComboPop:9909 · mechaShielded:9914 · mechaDamageFx:9916 · mechaHitByAlien:9921 · spawnAlienShot:9927
removeAlienShot:9937 · tickAlienShots:9942 · spawnPowerup:9954 · removePowerup:9967 · collectPowerup:9972 · tickPowerups:9979
updateMechaHud:9988 · mechaTracer:10028 · mechaFire:10037 · explodeAlien:10074 · tickMecha:10104 · loop:10160
grabShot:10187 · savePhoto:10198 · clearEntities:10210 · INTRO_KEY:10224 · introSeenObj:10225 · introSeen:10226
markIntroSeen:10227 · INTRO:10228 · showIntro:10229 · closeIntro:10254 · beginPlay:10260 · start:10262
exitWorld:10453 · mechaRecapLine:10512

## js/auth.js (389 บรรทัด · 32 รายการ)
AUTH_PUSH_MS:23 · AUTH_SDK_TIMEOUT_MS:24 · TEACHER_EMAILS:28 · isTeacher:29 · TESTER_EMAILS:42 · TESTER_COINS:43
isTester:44 · testerBoost:48 · authSetStatus:74 · authShowLogin:86 · authGateOffline:90 · authSaveRef:97
authFetchCloud:98 · authWriteCloud:99 · authDeleteCloud:100 · authWriteProfileName:101 · authPushProfile:108 · authApplyProfileName:116
authAskProfileName:132 · authEditProfileName:143 · authStart:154 · updateOfflinePill:184 · authEnterOffline:189 · authLateSync:206
authLoginClick:222 · authOnLogin:241 · authSyncOnLogin:254 · authFreshStart:283 · authAskLink:292 · authEnterGame:342
authPushSave:357 · authLogout:368

## js/award.js (271 บรรทัด · 0 รายการ)

## js/dictband.js (362 บรรทัด · 25 รายการ)
BAND_EMOJI:12 · BAND_SET_REWARD:13 · BAND_DONE_BONUS:14 · bandLoad:18 · bandShortTH:36 · bandCat:44
bandSets:66 · bandSetId:75 · bandCheckComplete:78 · bandSetCat:92 · BAND_RETAKE_MAX:104 · bandTriedSets:105
bandRetakeCat:116 · bandShowRetakeSummary:150 · bandSetsPassed:178 · openBandSetPicker:186 · bandMine:257 · bandUnlocked:258
bandLockToast:263 · bandExamLobby:269 · updateBandExamBtn:278 · bandLobbyTick:295 · bandPlay:306 · bandPlayLobby:319
bandCardsHTML:331

## js/game.js (995 บรรทัด · 68 รายการ)
REPLAY_BONUS_EVERY:23 · REPLAY_BONUS_TIERS:25 · replayBonusFor:26 · SESSION_MILESTONES:32 · addSessionCoins:35 · updateBestTarget:74
weekKeyStr:87 · rolloverWeekBest:93 · exitGame:99 · showSessionSummary:135 · sprinkleConfetti:182 · VOCAB_PER_LEVEL:201
VOCAB_RANK_NAMES:202 · vocabRankName:203 · showProgressReport:205 · THUNDER_MS:384 · THUNDER_TIERS:388 · THUNDER_TIER_UI:389
thunderEmoji:390 · DAREDEVIL_TIERS:394 · DAREDEVIL_TIER_UI:395 · daredevilEmoji:396 · GLASS_TIERS:400 · GLASS_TIER_UI:401
glassEmoji:402 · DILIGENT_TIERS:406 · DILIGENT_TIER_UI:407 · diligentEmoji:408 · SOFTLAND_TIERS:412 · SOFTLAND_TIER_UI:413
softLandEmoji:414 · AIRL_TIERS:418 · AIRL_TIER_UI:419 · airLetterEmoji:420 · MECHABOSS_TIERS:424 · MECHABOSS_TIER_UI:425
mechaBossEmoji:426 · TYPIST_TIERS:433 · TYPIST_TIER_UI:434 · typistEmoji:436 · checkTypistBadge:438 · BFF_TIERS:453
BFF_TIER_UI:454 · BFF_COIN:455 · bffEmoji:456 · badgeSuffix:461 · BADGE_META:477 · NAME_BADGE_RE:493
splitNameBadges:494 · badgeEmojis:500 · badgeScore:505 · checkCrown:511 · currentBadgeScore:527 · rolloverBadgeWeek:531
addDiligent:544 · celebrateBadge:560 · addThunder:574 · startGame:588 · newRound:628 · updateTimerBar:667
updateComboPill:673 · pickCard:677 · checkMatch:689 · renderCats:803 · startQuiz:838 · renderQuizQuestion:854
quizNext:917 · finishQuiz:930

## js/gradelock.js (158 บรรทัด · 14 รายการ)
GRADES:21 · GRADE_LOCK_DAYS:25 · GRADE_LOCK_MS:26 · gradeRank:29 · myGrade:30 · gradeHistList:33
gradeLockLeftMs:43 · gradeLockLeftDays:50 · gradeUnlockAt:51 · gradeLocked:52 · gradeUpOptions:55 · gradeChangeTo:62
gradeLockNote:86 · openGradeChange:94

## js/images.js (174 บรรทัด · 21 รายการ)
IMG_FILES:11 · MOODS:12 · startImgKey:14 · petImageKeys:16 · probeImages:27 · probeRankImages:39
probeCollectImages:40 · probeGiftImages:41 · probeHomeImages:42 · CLIP_FILES:51 · CLIP_SM:57 · clipCanWebm:73
CLIP_ASSET_V:84 · clipFileFor:86 · petClipKey:95 · petClipUrl:104 · equippedItem:115 · petStateImg:125
happyNow:139 · makeHappy:140 · currentPetImg:153

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

## js/netroom.js (771 บรรทัด · 19 รายการ)
CFG:41 · roomsAllowed:59 · HOT_KEYS:66 · COLD_KEYS:67 · HOT_BACK:68 · splitPayload:72
mergeBack:83 · metUids:95 · AIM_TTL_MS:114 · aimAt:116 · aimGet:120 · aimClear:124
MAPS3D:130 · whereFriends:131 · dbOf:155 · envReady:156 · isDenied:159 · create:171
drawBudget:744

## js/online.js (1,684 บรรทัด · 89 รายการ)
### 🗂️ สารบัญโซน js/online.js (Read/Edit เฉพาะช่วง)
- 2-195 ENGINE: ระบบออนไลน์จริงผ่าน Firebase Realtime Database
- 196-289 ระบบเพื่อน (ข้อ 0.3): รหัสเพื่อน + ค้นหา + ส่ง/รับคำขอ
- 290-479 ระบบแชทกับเพื่อน (ข้อ 0.4)
- 480-645 ระบบส่งของขวัญ (ข้อ 0.5)
- 646-762 🏪 ตลาดออนไลน์จริง (item 2 backlog): ซื้อ-ขายสินค้าที่เพื่อน "ผลิตเอง" ข้ามผู้เล่น
- 763-800 คำเชิญเล่นโลก 3D ด้วยกัน — /tinv/<toUid>/<fromUid> = {map,n,ts}
- 801-997 📰 Follow + Feed กิจกรรม (รอบ 155) · 🌍 หน้า Feed ทุกคน + ไลก์/คอมเมนต์ (รอบ 639)
- 998-1100 🌍 หน้า Feed ทุกคน + ไลก์/คอมเมนต์ (รอบ 639)
- 1101-1684 📞 โทรหาเพื่อน — Voice call / Video call แบบ LINE (รอบ 625 · กลุ่ม 3 คนรอบ 631)
### รายการ js/online.js
ONLINE_STALE_MS:57 · ONLINE_BEAT_MS:58 · LEADERBOARD_SIZE:59 · onlineDisplayName:63 · onlineActivity:71 · ensureOnlineId:87
onlineKey:97 · onlinePushPresence:102 · onlinePushScore:112 · fetchPlayerStats:146 · onlineRerender:168 · notifyFriendBadges:180
FRIEND_ALPHA:206 · friendCode:207 · friendSearch:219 · friendRequest:243 · friendAccept:252 · friendDecline:264
friendsHeal:274 · CHAT_MAX_LEN:298 · CHAT_KEEP:299 · chatPairId:301 · chatRef:304 · chatListen:310
chatSend:326 · chatDeleteMsg:342 · TYPING_TTL:350 · typingRef:352 · chatSetTyping:353 · chatClearTyping:363
chatWatchTyping:371 · chatThemeRef:389 · chatSetTheme:390 · chatWatchTheme:395 · chatPrune:403 · chatSeenTs:420
chatMarkSeen:426 · chatUnreadCount:438 · chatWatchSync:441 · GIFT_EXPIRE_MS:491 · giftSend:494 · greetSend:508
giftAccept:520 · giftDecline:524 · giftInWatch:530 · giftReclaim:561 · giftOutWatchSync:571 · giftOutRebuild:626
salesWatch:656 · salesRerender:664 · sellInc:668 · marketWatch:676 · marketList:709 · marketUnlist:717
marketBuy:726 · marketSoldWatch:739 · tinvSend:768 · tinvClear:775 · tinvWatch:779 · FEED_MAX:809
feedEvent:812 · feedPrune:824 · feedPurgeCat:835 · feedPushAssets:846 · petDescriptor:864 · feedPushPets:870
fetchPlayerPets:884 · followSet:900 · followUnset:911 · feedRebuild:918 · feedWatchSync:930 · fetchPlayerFeed:957
fetchPlayerAssets:970 · fetchFollowers:989 · GFEED_READ:1006 · GFEED_KEEP_ME:1007 · gfeedPush:1010 · gfeedPrune:1024
gfeedWatchStart:1037 · gfeedWatchStop:1063 · gfeedRebuild:1069 · gfeedToggleLike:1081 · gfeedAddComment:1087 · CALL_RTC_CFG:1125
CALL_RING_MS:1126 · CALL_MAX_MS:1127 · CALL_MAX_PEERS:1128 · onlineStart:1544 · onlineLoadSDK:1659

## js/state.js (1,089 บรรทัด · 86 รายการ)
STORAGE_KEY:6 · QUIZ_PASS_REWARD:11 · CURE_COST:13 · HUNGRY_SICK_MS:14 · MEAL_HOUR:16 · MEAL_FULL:17
SLEEP_FROM_HOUR:18 · SLEEP_SICK_HOUR:19 · WAKE_HOUR:20 · DINNER_COST:21 · TOXIN_FULL:23 · DETOX_COST:24
FOODQUIZ_Q:26 · FOODQUIZ_COIN:27 · FOODQUIZ_BONUS:28 · SHAPE_JUNK_MEALS:30 · SHAPE_CLEAN_MEALS:31 · SHAPE_MISS_MEALS:32
SHAPE_EXP_BONUS:33 · HEAT_SICK_MS:34 · THIRST_SICK_MS:35 · DEFAULT_STATE:37 · FEED_CATS:188 · SLOT_MS:199
currentSlotStart:200 · nextSlotStart:206 · mealDayKey:208 · nightKeyOf:210 · newPet:216 · loadState:240
saveState:506 · activePet:513 · petStage:514 · isAdult:519 · abilityOn:520 · hasPetType:521
todayStr:524 · dailyTick:528 · addCoins:531 · QUEST_POOL:551 · QUEST_PER_DAY:561 · questsToday:562
questTick:569 · questEvent:573 · assetValue:609 · netWorth:635 · assetCount:637 · refreshRank:654
heatProtected:670 · rainProtected:674 · petHungry:677 · petShapeOf:681 · updatePetShape:687 · shapeMealDone:694
heatPct:704 · ymStr:713 · billOutstanding:717 · UTILITIES:724 · HOME_UTILITIES:730 · homeDecayed:732
billTick:735 · PET_FOOD_PER_PET:807 · petFoodTick:808 · myCar:834 · carLoanDue:839 · carLoanOverdue:844
carLoanPayable:849 · carLoanPay:856 · compTick:869 · ONLINE_RATE:883 · onlineEarnActive:884 · onlineEarnTick:888
onlineEarnFlush:899 · marketTick:909 · addCraft:933 · ORDER_MAX:952 · ORDER_LIFE_MS:953 · ORDER_GAP_MIN_MS:954
ORDER_GAP_SPAN_MS:955 · ORDER_TIER_WEIGHT:956 · newOrder:957 · orderTick:970 · careTick:978 · expNeed:1060
addExp:1065 · addRP:1085

## js/tpaward.js (41 บรรทัด · 0 รายการ)

## js/typing.js (345 บรรทัด · 0 รายการ)

## js/ui.js (8,357 บรรทัด · 326 รายการ)
### 🗂️ สารบัญโซน js/ui.js (Read/Edit เฉพาะช่วง)
- 2-77 UI: Dashboard / ร้านค้า / ที่พัก / ร้านสัตว์เลี้ยง / แรงค์ / สถิติ
- 78-281 🎬 เวทีน้องน่ารัก (Cute Pet Show) — รอบ 604 (ผู้ใช้สั่ง 26 ก.ค. 2026)
- 282-566 🆕 New Word (รอบ 116): คำศัพท์ใหม่ 1 คำ/การ login ตามระดับชั้น
- 567-589 นาฬิกาใต้ชื่อผู้เล่น (วัน · วันที่ · เวลา อัปเดตทุกวินาที)
- 590-642 ข้าวเย็นของผู้เล่น (คิว 7725691507 ข้อ 6)
- 643-674 แถบฝนประจำวัน: นับถอยหลังถึง 19:00 ทุกวัน (ฝนตก 1 ชม.)
- 675-719 เอฟเฟกต์ฝนเต็มจอ (รอบยี่สิบ): ฝนตกจริง (19:00-20:00) + ไม่มีบ้านสภาพดี
- 720-740 การ์ด "คนที่กำลังทำการบ้านไปพร้อมๆ กับเรา"
- 741-795 รอบ 149: กล่อง aside ขวาเลื่อนวนอัตโนมัติ (ล่าง→บน) ไม่มี scrollbar
- 796-1135 Daily Quest (item 3): การ์ดภารกิจวันนี้ใน aside ขวา
- 1136-1228 รอบ 153: เมนูลัดแตะแถวเพื่อนออนไลน์ในกล่อง aside
- 1229-1669 การ์ด Leaderboard — สลับแท็บในการ์ดเดียว (ประหยัดพื้นที่):
- 1670-1981 การ์ดข้อมูลผู้เล่น 👤 — คลิกชื่อในการ์ดเพื่อน/กระดาน แล้วโชว์
- 1982-2206 แผงเพื่อน 👥 (ข้อ 0.3): รหัสเพื่อน + ค้นหา + คำขอ + รายชื่อเพื่อน
- 2207-2302 🌍 เพื่อนอยู่โลก 3D ไหน + ปุ่ม "ตามเข้าไป" (รอบ 642)
- 2303-2341 แชทกับเพื่อน (ข้อ 0.4) — กล่องแชทลอยกลางจอ + แผง emoji
- 2342-2719 รอบ 179: หน้ารวมข้อความ (inbox แบบ Messenger — ธีมกระจกฟ้า sci-fi ของเกม)
- 2720-3066 ระบบส่งของขวัญ (ข้อ 0.5) — ห้องของขวัญ + กล่องเลือกส่ง + ฉากเปิด
- 3067-3151 RANK CARD + ฉากเลื่อนแรงค์
- 3152-3154 PET DASHBOARD
- 3155-3278 📰 รอบ 155: overlay ข้อมูลน้อง & การดูแล + ฟีดกิจกรรมเพื่อน
- 3279-3487 🌍 รอบ 639: หน้า Feed เต็มจอ — ทุกคน (ไม่ใช่แค่ follow) + ไลก์/คอมเมนต์
- 3488-4130 📖 Dictionary ค้นหาคำศัพท์ (รอบ 254 ผู้ใช้สั่ง 16 ก.ค. 2026)
- 4131-4174 การนอน (คิว 7725691507 ข้อ 1)
- 4175-4553 ให้อาหาร (ระบบมื้อเย็น 18:00 + ความอิ่มสะสม — ข้อ 2+3)
- 4554-4635 🛡️ ควิซอาหารปลอดภัย (ต่อยอดข้อ 5.1)
- 4636-4721 🎀 ห้องแต่งตัวสัตว์เลี้ยง (รอบ 635: แยกออกจาก "ร้านค้า" เดิม —
- 4722-4909 ที่พัก (หลบแดด/หลบฝน) + เครื่องปรับอากาศ
- 4910-5027 บิลสาธารณูปโภค (ค่าไฟ/ค่าน้ำ — เครื่องยนต์อยู่ใน state.js: UTILITIES/billTick)
- 5028-5110 การ์ดมือถือ (ข้อ 7): ซื้อ 10,000 ขายคืน 6,000
- 5111-5121 การ์ดคอมพิวเตอร์ (ข้อ 11): ซื้อ 50,000 ขายคืน 30,000
- 5122-5277 item 8: โบนัสออนไลน์ +0.01 เหรียญ/วิ ฟรีทุกคนที่เปิดเกมออนไลน์อยู่
- 5278-5493 🎫 การ์ดตั๋วโลกผจญภัย (คิว 7725691507 ข้อ 7)
- 5494-5575 🎃 การ์ดตั๋วโลกผีสิงกลางคืน (ต่อยอดข้อ 8 · ผู้ใช้เคาะ 7 ก.ค.)
- 5576-5679 🚁 การ์ดตั๋วโลกเฮลิคอปเตอร์ Bell (รอบ 52)
- 5680-5779 🛸 การ์ดตั๋วโลกโดรน FPV Racing (รอบ 85) — ซื้อได้เมื่อมีตั๋วเฮลิคอปเตอร์
- 5780-5970 🚗 การ์ดตั๋วโลกขับรถกำแพงเพชร (รอบ 113) — ซื้อได้เมื่อมีตั๋วโดรน FPV
- 5971-6063 ⚽ การ์ดตั๋วโลกสนามฟุตบอล (รอบ 196) — ซื้อได้เมื่อมีตั๋วขับรถ
- 6064-6159 🏍️ การ์ดตั๋วโลกมอเตอร์ไซค์บ้านโพธิ์สวัสดิ์ (รอบ 293) — ซื้อได้เมื่อมีตั๋วขับรถ
- 6160-6257 🛸 การ์ดตั๋วโลก "ยานแม่บุกโลก" (Invasion · รอบ 413)
- 6258-6302 🌍 ปุ่มลัดเข้าโลก 3D ในรางเมนูซ้าย (ผู้ใช้สั่ง 9 ก.ค. 2026)
- 6303-6448 🧭 ป้ายบอกทางของรางเมนูซ้าย (รอบ 601 · ผู้ใช้สั่ง 26 ก.ค. 2026)
- 6449-6618 การ์ดสวนผลไม้ (ข้อ 12): ซื้อต้นไม้ปลูกได้ไม่จำกัด แต่ละต้นออกผล
- 6619-6628 โรงงานผลิตสินค้า 🏭 + ตลาดขายต่อ (แนวคิดใหม่ 5 ก.ค. 2026)
- 6629-6651 โรงงานผลิต (แผง 🏭) — แยกออกจากตลาด (ผู้ใช้สั่ง 6 ก.ค. 2026)
- 6652-6802 ตลาดขายสินค้า (แผง 🏪) — แยกออกจากโรงงาน
- 6803-7714 🚗 รอบ 131: หมวดยานพาหนะ — โชว์รูมรถ 10 คัน (แคตตาล็อก 5 ช่อง/แถว)
- 7715-7775 ร้านสัตว์เลี้ยง (ซื้อเพิ่มได้ ไม่ลบตัวเดิม)
- 7776-7812 เลเวลอัพ (รายตัว)
- 7813-7918 สถิติผลการเรียนรู้
- 7919-7956 item 4: การ์ดสรุปส่งครู — ใบเดียวจบ ชื่อ/วัน-เวลา/เหรียญวันนี้/แรงค์/สอบล่าสุด
- 7957-8357 📞 หน้าจอโทรหาเพื่อน — สายเสียง (รอบ 625 · กลุ่ม 3 คน + ปิดวิดีโอ รอบ 631)
### รายการ js/ui.js
startHTML:10 · PET_ANIM:30 · petAnimHTML:35 · petVisualHTML:50 · PET_SHOW:91 · PET_SHOW_STAGE:96
PET_SHOW_H:99 · petShowBgHTML:102 · petClipHint:129 · __clipReady:141 · petShowHTML:149 · lobbyBlk:207
caretakerFigureHTML:213 · footAlign:223 · heroRankBgHTML:254 · NEW_WORD_MS:288 · newWordNext:294 · renderNewWord:305
alignNewWord:340 · startNewWordTimer:351 · nwCountdownTick:368 · PAT_REMIND_HOUR:384 · patRemindTick:385 · applyPatRemindGlow:406
NEW_WORD_COIN:421 · NW_DAILY_GOAL:422 · NW_DAILY_BONUS:423 · newWordReward:424 · nwDailyTick:447 · coinFlyFx:466
nwDailyBarHTML:499 · showNewWordPopup:510 · renamePet:537 · mealLabel:554 · fmtMins:561 · renderClock:570
dinnerDue:595 · renderDinnerChip:600 · dinnerClick:611 · renderRainBar:646 · rainFxTick:679 · RAIN_DROP_IMGS:696
rainFxDrop:697 · selfPronoun:727 · selfTag:732 · idTag:736 · SIDE_SCROLL_SPEED:746 · SIDE_SCROLL_RESUME:747
initSideScroll:750 · sideScrollTick:778 · QUEST_FLASH_HOLD:802 · QUEST_DECK_FLIP_MS:809 · questGo:812 · SIDE_TALL_MIN:824
sideIsTall:825 · qDeckDraw:830 · qDeckNext:853 · renderQuestCard:867 · sideFlashRows:905 · FRIEND_FLASH_GRACE:923
ONLINE_FLIP_MS:931 · ONLINE_FLIP_RESUME:932 · ONLINE_SWIPE_STEP:933 · ONLINE_ROW_H:940 · onPerPage:943 · onChunk:949
ONLINE_GAP_MAX:959 · onPageSpread:960 · onPageDraw:969 · onPageFlip:980 · bindOnlinePager:991 · renderOnlineCard:1026
bindInviteCards:1143 · bindFriendQuickMenu:1163 · openFriendQuickMenu:1173 · LB_TABS:1236 · LB_WS_TOP:1237 · LB_TP_TOP:1238
bindLbTabs:1240 · updateRankRailBadge:1269 · rankUpCheck:1288 · rankUpSound:1316 · renderLeaderboardCard:1327 · bindLbGroupOpen:1354
lbRankRows:1366 · lbDemoRows:1409 · lbChar:1431 · lbfAwardBarHtml:1441 · openLeaderboardFull:1453 · BLK_PAD:1526
seatPodChars:1528 · lbCoinHtml:1538 · lbBadgeHtml:1554 · lbBossHtml:1580 · lbWordSearchHtml:1603 · lbTypingHtml:1639
bindPlayerClicks:1675 · showPlayerCard:1685 · petDescImg:1911 · openImgLightbox:1924 · openPetPeek:1944 · updateBillBadges:1988
setBadge:1998 · updateSettingsBadge:2014 · openAttentionSummary:2028 · updateFriendBadge:2070 · renderFriendPanel:2080 · friendDoSearch:2128
refreshFriendData:2152 · FRW_TTL_MS:2217 · FRW_MIN_GAP:2218 · frwWorldOf:2222 · frwPanelOpen:2225 · frwScan:2230
frwPaint:2252 · frwPaintHint:2273 · frwFollow:2287 · CHAT_EMOJI_CATS:2308 · CHAT_THEMES:2330 · CHAT_SECRET_MS:2339
chatBadgeSync:2347 · ibTimeStr:2355 · IB_CALL_RE:2364 · ibCallInfo:2365 · openChatInbox:2370 · openChat:2533
giftImg:2723 · giftDateStr:2725 · GREETS:2733 · GREET_EXP:2741 · greetInfo:2742 · openGreetPicker:2746
giftItemPic:2788 · giftItemName:2796 · updateGiftBadge:2802 · renderGiftPanel:2811 · acceptGift:2869 · declineGift:2892
showGreetReveal:2901 · showGiftReveal:2928 · openGiftPicker:2954 · confirmSendGift:3022 · doSendGift:3046 · rankBadgeHTML:3070
renderRankCard:3075 · renderRankTab:3101 · showRankUp:3129 · bindPetPlateButtons:3164 · openPetInfoOverlay:3193 · feedAgo:3216
renderFeedCard:3229 · openFeedBoard:3289 · renderFeedBoardLive:3310 · renderFeedBoard:3326 · bindFeedBoardEvents:3364 · stageColLeft:3408
alignPetTabs:3417 · alignCoinGroup:3426 · alignStageLeft:3440 · alignStageCols:3451 · watchStageCols:3465 · alignCureBtn:3475
dictRecordLookup:3499 · DICT_FILE_COUNT:3510 · loadDict:3511 · dictSearch:3526 · dictTapWords:3541 · dictEntryHTML:3545
openDictOverlay:3556 · renderDashboard:3640 · sleepBtnHTML:4136 · sleepHintHTML:4143 · sleepAllPets:4154 · wakeAllPets:4167
feedPet:4178 · openFoodMenu:4192 · feedWith:4263 · AVATAR_UI:4293 · playerAvatarHTML:4296 · SHAPE_UI:4302
showFeedResult:4311 · curePet:4352 · heartsFx:4375 · PAT_HOLD_MS:4398 · PAT_EXP:4399 · bindPetTap:4400
petBounce:4418 · petMood:4424 · shortPatPet:4431 · longPatPet:4439 · patCalendarHTML:4459 · patStreakTick:4487
cureCelebrateFx:4513 · railCureClick:4524 · detoxPet:4536 · openFoodQuiz:4559 · closeDressUpBoard:4641 · openDressUpBoard:4645
renderShop:4662 · homeVisualHTML:4725 · showHomeRuined:4739 · showCutNotice:4760 · renderHomeCard:4778 · payMaint:4862
trashBillUI:4878 · payTrash:4895 · UTILITY_UI:4914 · utilityBillUI:4963 · payUtility:4988 · buyUtilityFix:5014
renderPhoneCard:5032 · buyPhone:5072 · sellPhone:5094 · compLiveTotal:5115 · onlineLiveTotal:5126 · renderOnlineEarnPill:5131
openPillInfo:5154 · renderComputerCard:5201 · buyComputer:5236 · sellComputer:5259 · soldCount:5285 · soldBadge:5286
renderTicketCard:5291 · loadScriptOnce:5347 · loadAdv3d:5364 · enterAdventure3D:5371 · pickAdvMap:5396 · enterHaunted3D:5431
advHealClick:5453 · buyTicket:5473 · renderHauntCard:5499 · buyHauntTicket:5554 · renderHeliCard:5581 · buyHeliTicket:5639
enterHeli3D:5662 · renderDroneCard:5684 · buyDroneTicket:5739 · enterDrone3D:5762 · renderDriveCard:5785 · buyDriveTicket:5859
enterDrive3D:5882 · pickDriveMap:5917 · enterMotoMapAsCar:5953 · renderSoccerCard:5975 · buySoccerTicket:6023 · enterSoccer3D:6046
renderMotoCard:6069 · buyMotoTicket:6118 · enterMoto3D:6141 · renderInvasionCard:6164 · INVASION_REWARD:6213 · buyInvasionTicket:6215
enterInvasion3D:6239 · WORLD3D:6264 · gotoRobotShop:6275 · scrollShopCardIntoView:6280 · railWorldClick:6283 · railScrollHint:6308
railScrollTop:6316 · initRailScroll:6321 · renderRailWorlds:6341 · tinvNoticeHTML:6402 · openTinvPicker:6410 · fruitCountdown:6454
renderFarmCard:6466 · renderFarmClock:6541 · buyFruit:6557 · sellFruit:6577 · sellAllFruit:6598 · collectImg:6627
renderFactoryCard:6633 · renderMarketCard:6656 · updateWishBadge:6712 · openWishlistDialog:6723 · bindStripArrows:6768 · renderMarketBrowse:6780
carImg:6809 · renderVehicleShop:6810 · CS_CYCLE_MS:6861 · carInteriorImg:6862 · carStatHtml:6864 · renderCarShowroom:6871
csShowBig:6898 · csInit:6925 · RS_CYCLE_MS:6948 · robotImg:6949 · renderRobotShop:6950 · rsShowBig:6972
rsInit:6993 · buyRobot:7012 · enterMecha3D:7034 · pickMechaRobot:7055 · pickDriveCar:7087 · openCarBuyDialog:7130
buyCarInsurance:7191 · payCarLoanMonthly:7210 · payCarLoanFull:7222 · carDriveBlock:7241 · gotoVehicleShop:7246 · gotoMyStock:7251
showNeedCarDialog:7257 · craftDiscount:7269 · renderFactory:7272 · renderOrdersUI:7341 · startProduce:7360 · buyCollectible:7388
cancelProduce:7416 · deliverOrder:7430 · renderOrderClock:7447 · renderCollectMine:7457 · openListDialog:7499 · cancelListing:7552
buyMarketItem:7575 · showCollectReveal:7602 · buyAC:7640 · openHomeShop:7659 · renderPetShop:7718 · showLevelUp:7779
renderStats:7816 · showTeacherCard:7923 · CALL_REACT_EMOS:7967 · CALL_TALK_MIN:7970 · CALL_TALK_HOLD:7971 · CALL_ORDER_GAP:7973
CALL_TONES:7979 · startCall:8353

## js/util.js (866 บรรทัด · 38 รายการ)
shuffle:6 · fmtNum:15 · escapeHTML:19 · gradeSymbol:32 · gradeMark:47 · nameWithGrade:55
gradeMarkCanvas:61 · gradeOf:77 · seededRand:92 · fmtThaiDT:102 · fmtThaiDate:106 · showScreen:111
TOAST_WARN_RE:121 · restackToasts:124 · toast:146 · floatFx:166 · beep:176 · PET_MOOD:252
petVoiceSynth:259 · sirenSynth:336 · playCashier:360 · cashierSynth:374 · keyTapSynth:407 · playSpark:442
sparkSynth:456 · thunderFx:491 · wordAudioFile:559 · speakWord:562 · speakLetter:582 · pickSpeakVoice:601
speakWordTTS:612 · askNameDialog:632 · askConfirm:672 · alertBox:690 · applyNoAnim:710 · openSettings:715
openHelp:821 · openTeacherGuide:847

## js/vocabbook.js (207 บรรทัด · 14 รายการ)
VB_MAX:11 · VB_QUIZ_N:12 · VB_QUIZ_MIN:13 · vbGroup:16 · VB_GROUP_UI:21 · vbRecord:24
vbSeen:49 · vbStats:62 · vbList:70 · vbReviewCat:81 · vbStartReview:95 · openVocabBook:106
vbRender:148 · vbCardHTML:194

## js/wordsearch.js (414 บรรทัด · 0 รายการ)

## js/wsaward.js (32 บรรทัด · 0 รายการ)

## css/lobby.css (4,146 บรรทัด · 644 selector)
:root:6 · html:15 · body:16 · *:33,34,35,36 · #app:39 · h1:41
.subtitle:42 · .shop-title:43 · #rotate-overlay:46 · .screen:68 · #screen-select:77,78,79,80(+5) · .egg-need:87
.petshop-topright:89 · .petshop-play-link:90,95 · #screen-quiz:134,135,136,137(+6) · #quiz-choices:146,147 · .word-card:154 · .quiz-choice:155,156,157
.big-btn:160,161,162,163 · #screen-dashboard:168,1054,1062 · .lobby-top:175,809,810,811(+21) · .top-flex:176 · .profile-plate:177,181,730,3082(+12) · #rain-fx:186
.rain-layer:189,195 · .rain-glass:202 · .glass-drop:203 · .rail-btn:218,822,828,829(+16) · .rail-badge:219 · .fr-code-box:224
.fr-code-label:228 · .fr-code-row:229 · .fr-code:230 · .fr-copy-btn:235,239,244,245 · .fr-search-btn:240 · .fr-add-btn:241
.fr-accept:242 · .fr-decline:243 · #fr-search-input:246 · #fr-search-result:250 · .fr-found:251 · .fr-hint:255
.fr-list-title:256 · .fr-row:257 · .fr-req:261 · .fr-row-name:263,267,3939 · .fr-row-status:271 · .fr-req-btns:272
.online-dot:273 · .fr-chat-btn:274,279,281 · .fr-unread:282 · .fr-call-btn:288,294 · .chat-overlay:303 · .chat-box:307,608,615,622(+12)
.chat-head:319 · .chat-theme-btn:324,328 · .chat-secret-tg:329,330 · .cs-switch:331,332,337,338 · .cs-slider:333,335 · .chat-secret-note:339
.chat-theme-strip:342 · .chat-theme-sw:344,347,348,349(+1) · .chat-head-name:351,352 · .chat-close:353 · .chat-msgs:357 · .chat-empty:361
.chat-typing:363 · .ct-dots:365,366,368,369 · .no-anim:371,384,445,459(+44) · .chat-bubble:372,377,382 · .chat-emoji:385 · .chat-emo:389,393
.chat-input-row:394 · .chat-emoji-btn:398 · #chat-input:402 · .chat-send:406,411,412 · .chat-call-btn:418,422 · .call-ring:425
.cr-card:429 · .cr-kind:435 · .cr-av:436 · .cr-name:446 · .cr-id:447 · .cr-btns:448
.cr-btn:449,455,460 · .cr-no:456 · .cr-ok:457 · .cr-safe:461 · .call-ov:464,470,492,509(+6) · .call-stage:476
.ctile:477,488,489 · .ct-face:481 · .ct-me:487 · .ct-nm:502,506 · .ct-sub:507 · .call-add:531
.ca-head:538 · .ca-list:539 · .ca-row:540,544 · .ca-dot:545,546 · .ca-nm:547,548 · .ca-go:549
.ca-empty:550 · .ca-safe:551 · .ca-close:552 · .call-bar:556 · .cb-btn:561,566,567 · .cb-end:568,569
.call-emos:570 · .call-emo:575,576 · .call-fx:578 · .call-fx-emo:579 · .pl-click:671,673,674 · .pl-overlay:675
.pl-card:679,2341 · .pl-close:685 · .pl-head:689,2245,2248 · .pl-grade:694,3945,3946 · .pl-badges:696 · .pl-badge-chip:697,701
.pl-body:702 · .pl-loading:703 · .pl-none:704 · .pl-me-tag:705 · .pl-blk-wrap:707 · .pl-blk:708
.pl-stat:709 · .pl-lbl:714 · .pl-val:715,716 · .pl-tip:717 · .chip-edit:723,728,729 · .rank-mini:735,741,742,743
.pass-photo:745,750 · .pet-tabs:752 · .dict-box:753,757,758,759(+1) · .dict-card:765,770,774,775(+2) · .dict-head:771,772 · .dict-trail:779,783
.dt-c:784,788,789 · .dt-sep:790 · .dict-today:791 · .di-w:793,794,795 · .dict-list:796 · .dict-item:797,801,802,803(+5)
.lobby-mid:817 · .rail-wrap:820,845,849,850(+3) · .lobby-rail:821 · .rail-nudge:852,860,861,864(+1) · .rail-worlds:871 · .rail-div:872
.lobby-stage:914,916,932,1059(+13) · .newword-banner:922,929,934,3484(+2) · .coin-fly:945,948 · .coin-plus:954 · .nw-pop-coin:969,971,972 · .nw-pop-goal:975,976,980,984
.nw-goal-head:977,979,981 · .nw-goal-bar:982 · .nw-goal-fill:983 · .nw-pop-book:985,986 · .nw-tag:1007,3490,3509 · .nw-word:1012,3494,3510,3585
.nw-hint:1014,1015,3495,3584 · .nw-coin:1017,1020,3496,3500 · .nw-countdown:1025,3501 · .nw-bar:1027,3511 · .nw-bar-fill:1029 · .pet-stage:1032,2536
.nw-box:1039,2545 · .nw-pop-word:1040 · .nw-speak:1041 · .nw-pop-phon:1042 · .nw-ipa:1043 · .nw-pop-sent:1044
.nw-pop-mean:1045 · .pet-tab:1046,1047,1048,2888 · .stage-hero:1069,1084,1092,1237(+21) · .hero-ground:1106,1226,1232 · .hero-rank-bg:1108,1111,1114,1118(+18) · #lobby3d-canvas:1131,1132
.hero-scene:1136,1138,1145,1146(+8) · .caretaker-fig:1185 · .caretaker-img:1188 · .caretaker-emoji:1190 · .blk-rig:1197,1198,1199 · .stage-plate:1259,1267,1278,1279(+19)
.plate-title:1273 · .lobby-side:1302,1338,1343,1346(+22) · .side-sec:1305,2787,3060 · .side-label:1306,1311 · .side-label-row:1314,1315 · .lb-tabs-out:1316,1317,1321
.side-glass:1325,1332 · .side-card:1344,1456 · #quest-card:1356,1380,1381,1382(+6) · .q-bigcard:1357,1386,1387,1390(+1) · .qb-top:1359 · .qb-emoji:1360
.qb-name:1362 · .qb-bar:1363,1364 · .qb-row:1366 · .qb-prog:1367 · .qb-reward:1368 · .qb-go:1369,1373
.q-dots:1374 · .q-dot:1375,1376,1377 · .q-bonus:1378 · .feed-row:1401,2100,2105 · .inv-card:1403,1405,1406 · .inv-btns:1407
.inv-go:1408,1410 · .inv-x:1411 · #online-card:1415,2795,2796,2797(+4) · .fq-overlay:1416 · .fq-box:1418,2601 · .fq-head:1422,1424
.fq-close:1425 · .fq-sec:1427 · .fq-worlds:1428 · .fq-world:1429,1431 · .fq-acts:1432 · .fq-act:1433,1436,1437
.lb-prize:1470 · .lb-coins:1473 · .lbf-cell:1474,2298,2301,2302(+3) · .lb-award-bar:1476,1482,1483 · .lb-award-go:1484 · .lbf-award:1486,1492,1493,1494
.pod-pz:1495 · .wsa-overlay:1498 · .wsa-box:1500 · .wsa-head:1505 · .wsa-title:1506 · .wsa-when:1507,1508
.wsa-close:1509,1512 · .wsa-cols:1513 · .wsa-col:1514 · .wsa-sec-h:1515,1516 · .wsa-msg:1517 · .wsa-msg-h:1520
.wsa-msg-b:1521,1522 · .wsa-msg-none:1523 · .wsa-rules:1525,1526 · .wsa-list:1527 · .wsa-row:1528,1530 · .wsa-r:1531
.wsa-n:1532 · .wsa-s:1533 · .wsa-p:1534 · .wsa-prizes:1535 · .wsa-pz:1536,1539 · .wsa-reveal-medal:1540
.lobby-bottom:1550,1552 · .lobby-quiz-btn:1553 · .lobby-book-btn:1554,1555 · .lobby-foodquiz-btn:1556,1557 · .lobby-play-btn:1558,1562 · .lobby-exam-btn:1564,1565,1567
.panel-overlay:1572,1577,3598,3599(+5) · .panel-box:1578 · .panel-head:1585,1589 · .panel-close:1590,1595 · .panel-body:1596,1600,1601 · .panel-page:1598,1599
.collect-sub:1605 · .mkt-empty:1606 · .craft-box:1607 · .mkt-listing:1608 · .mkt-filter:1609,1953 · .hq-grid:1616
.hq-card:1617,1622,1646 · .hq-head:1623 · .hq-pic:1629,1631 · .hq-emoji:1633 · .hq-badge:1634 · .hq-stars:1638
.hq-price:1639,1644,1645,1648(+6) · .craft-credit:1652,1654,1655 · .car-grid:1662,1664,1665 · .robot-weap:1666 · .dmap-box:1669,1670 · .dmap-grid:1676
.dmap-card:1678,1681,1682,1683(+2) · .dmap-ico:1685 · .dmap-new:1688 · .dcp-grid:1690 · .dcp-card:1692,1695,1696,1697(+10) · .levelup-box:1714,2502,2503,2598
.dcp-box:1717,1718,1722,1723(+6) · .dcp-lock:1731 · .sold-badge:1735,1737,1738 · .rs-showroom:1740,3897,3898 · .rs-list:1741,1743,3878,3881 · .rs-thumb:1744,1746,1747,1748(+1)
.rs-thumb-pic:1749,1750 · .rs-thumb-price:1751 · .rs-stage:1753 · .rs-big:1756 · .rs-big-img:1757 · .rs-elec:1761,1765,1770
.rs-edge:1771,1777 · .rs-info:1780,1781,1782,1783(+1) · .rs-buy:1785,1787,1788 · .cs-showroom:1792,3870,3871,3899(+3) · .cs-list:1793,1795,3872,3877(+9) · .cs-thumb:1796,1798,1799,1800(+1)
.cs-thumb-pic:1801,1802 · .cs-thumb-name:1803 · .cs-thumb-price:1804 · .cs-thumb-own:1805 · .cs-stage:1807 · .cs-big:1810
.cs-big-img:1811 · .cs-elec:1815,1819,1823 · .cs-edge:1824,1830 · .cs-interior:1833 · .cs-inr-label:1834,1835 · .cs-inr-img:1836
.cs-info:1838,1839,1840,1841(+6) · .cs-buy:1849,1851,1852,1853 · .car-emoji:1855 · .car-mine:1861 · .car-mine-pic:1866 · .car-mine-info:1867
.car-loan:1868,1869 · .car-mine-btns:1870,1871,1872 · .car-locked:1874 · .car-mine-head:1876 · .car-pick-list:1877,1878 · .car-pick:1879,1881,1882
.car-pick-pic:1883,1884 · .car-pick-name:1885,1886 · .car-pick-od:1887 · .car-buy-box:1889,2605 · .cb-pic:1890,1891,1892 · .cb-lines:1893
.cb-li:1894,1898,1899 · .cb-ins:1900,1904,1905 · .cb-plan:1906 · .cb-pl:1907,1912,1914,1918(+1) · .cb-total:1925 · .cb-btns:1926,1931
.cb-x:1927 · .shop-grid:1934 · .shop-item:1935,1940,1945,1946(+3) · .mkt-tab:1954,1955 · .pg-btn:1956,1957,1958 · .pg-dot:1959
.fr-gift-btn:1982,1987 · .gift-sec-title:1990 · .gift-in-row:1992 · .gift-out-row:1996 · .gift-in-pic:1997,1999,2000 · .gift-in-info:2001,2002
.gift-in-btns:2003 · .gift-accept:2004,2008,2010 · .gift-decline:2009 · .gift-box-card:2011 · .gift-box-from:2012,2013 · .gift-note:2014
.gift-pick-overlay:2017 · .gift-pick-box:2021 · .gift-pick-head:2027,2031 · .gift-pick-close:2032 · .gift-pick-tabs:2034 · .gp-tab:2035,2039
.gift-pick-body:2040 · .gp-chips:2041 · .gp-chip:2042,2046 · .gp-card:2047,2048 · .gp-price:2049 · .gp-note:2050
.gift-cf-pic:2051 · .chat-emoji-cats:2056 · .chat-emoji-cat:2060,2064,2065 · .chat-emoji-wrap:2066,2067 · .stage-left:2076,3589 · .pet-info-btn:2080,2087,2088
.feed-list:2095,2099 · .feed-ico:2106 · .feed-txt:2107 · .feed-name:2108 · .feed-ago:2109 · .feed-empty:2110,2113
.feed-plate:2115 · .feed-all-btn:2116,2121 · .fdb-overlay:2126 · .fdb-box:2128 · .fdb-head:2132 · .fdb-close:2136,2138
.fdb-live:2139,2141 · .fdb-live-title:2142 · .fdb-live-rows:2143 · .fdb-live-row:2144,2146,2147,2148 · .fdb-dot:2149 · .fdb-list:2151,2152
.fdb-empty:2153 · .fdb-row:2154 · .fdb-row-top:2156 · .fdb-ico:2157 · .fdb-txt:2158 · .fdb-name:2159
.fdb-ago:2160 · .fdb-actions:2161 · .fdb-like:2162,2165,2166,2167 · .fdb-cm-list:2168 · .fdb-cm-row:2169,2171 · .fdb-cm-empty:2172
.fdb-cm-add:2173 · .fdb-cm-input:2174,2176 · .fdb-cm-send:2177,2179 · .fdb-cm-locked:2180 · .pi-overlay:2183 · .pi-box:2187,2192,2193,2197(+2)
.pi-close:2199,2204,2205 · .pi-close-left:2207 · .pi-portrait:2209 · .pi-dress-btn:2216,2220,2221 · .pi-shape-cap:2222,2225,2226,2227 · .pi-shape-toggle-btn:2229,2232
.pi-dress-pip:2234,2239,2240,2241(+1) · .greet-card:2249 · .greet-sub:2250 · .greet-grid:2251 · .greet-opt:2252,2255,2256,2257 · .greet-e:2258
.pi-streak:2262 · .pi-streak-head:2264,2266 · .pi-streak-best:2267 · .pi-dots:2268 · .pi-dot:2270,2271,2272 · .pi-streak-note:2273
.pi-care-title:2274 · .lbf-overlay:2277 · .lbf-box:2280 · .lbf-head:2285 · .lbf-title:2286 · .lbf-tabs:2287,2290
.lbf-close:2293 · .lbf-close-l:2294 · .lbf-body:2295 · .lbf-grid:2296 · .lbf-podium:2307 · .pod:2309,2336,2337
.pod-char:2311 · .pod-base:2313 · .pod-rank:2315 · .pod-label:2317,3941 · .pod-name:2319 · .pod-sc:2321
.pod-1:2326,2327 · .pod-2:2328,2329 · .pod-3:2330,2331 · .pod-4:2332,2333 · .pod-5:2334,2335 · .pl-wide:2354,2357,2358,2359(+8)
.pl-follow:2360,2365,2367 · .pl-unfollow:2369,2375,2376 · .pl-followers:2377 · .pl-cols:2378 · .pl-col:2379 · .pl-sec-title:2380
.pl-feed:2381,2384,2391 · .pl-feed-row:2385,2389,2390 · .pl-assets-wrap:2393,3778,3853 · .pl-assets:2394,3781,3786,3792(+4) · .pl-asset:2397,2401,2408 · .pl-asset-emoji:2402
.pl-asset-n:2403 · .pl-pets-wrap:2410 · .pl-pets:2411 · .pl-pet:2412,2417,2419 · .pl-pet-nm:2420 · .img-lightbox:2423,2428,2429,2433(+3)
.pl-chat:2446,2451 · .pl-call:2453,2459 · .pet-peek:2460,2461 · .pp-chips:2463 · .pp-chip:2464 · .pp-gift:2469,2475
.settings-box:2477,2478,2547,2552(+20) · .set-feed-head:2479 · .set-feed-sub:2483 · .set-feed-row:2484 · .pillinfo-val:2489 · .pillinfo-desc:2494,2513
.pillinfo-box:2505 · .plf-head:2508 · .plf-emoji:2509 · .plf-ht:2510,2511,2512 · .plf-foot:2514 · .alert-box:2519,2521
.ab-emoji:2522 · .ab-title:2523 · .ab-desc:2524 · .ab-btns:2525,2526,2527 · .heal-heart:2529 · .attn-box:2544
.help-box:2576,2577,2578 · .wl-box:2599 · .food-box:2600 · .home-shop-box:2602 · .summary-box:2603 · .report-box:2604
.wl-grid:2607 · .tc-wrap:2609 · .spell-btn:2615,2620 · .sp-hud:2621 · .sp-word:2623 · .sp-ch:2624,2629
.sp-th:2631 · .sp-hint:2633 · .sp-exit:2636,2640 · .sp-banner:2641 · .sp-big:2646 · .sp-thb:2648
.sp-coin:2649 · #spell-confetti:2654 · .sp-rb:2655 · .sp-day:2665 · .sp-perfect:2667 · .sp-late:2669
#spell-coinpop:2672 · .side-sub:2781,2783 · .sec-quest:2788 · .on-page:2799,2800,2801,2802 · .inbox-overlay:2812 · .ib-box:2814
.ib-head:2818 · .ib-close:2822,2824 · .ib-list:2825,2826 · .ib-row:2827,2828,2829,2830 · .ib-ava:2831 · .ib-on:2835
.ib-mid:2837 · .ib-name:2838 · .ib-last:2839 · .ib-meta:2840 · .ib-time:2841 · .ib-dot:2843
.ib-story-badge:2846 · .ib-empty:2850 · .ib-story:2852,2854 · .ib-story-item:2855,2857,2864 · .ib-story-ava:2858 · .ib-story-on:2862
.ib-world:2867,2870 · .ib-tabs:2872 · .ib-tab:2873,2876,2878 · .ib-tab-dot:2879 · .ib-call-ava:2883 · .ib-call-row:2884,2885
#btn-music:2891,2894,2895 · #ws-overlay:2910 · #ws-board:2913,2919,2921 · .ws-head:2924 · .ws-title:2925 · .ws-findbar:2928
.ws-tip:2929 · .ws-grade:2931,2932 · .ws-body:2935 · .ws-gridwrap:2936 · #ws-grid:2939 · .ws-cell:2944,2949,2952,2955(+2)
.ws-flash:2961,2963 · .ws-coinpop:2967,2991 · .ws-combo:2978,2982,2983,2984 · .ws-find:2995 · #ws-prog:2996 · #ws-words:3000,3004
.ws-word:3006,3011,3012,3013(+2) · .ws-actions:3019,3020,3029 · .ws-sizes:3024 · .ws-sizes-lb:3026 · .ws-size-now:3027 · #ws-new:3030
#ws-stash:3031 · #ws-clear:3032 · #ws-win:3033,3035 · .ws-win-in:3036,3039 · .sec-online:3062 · .rank-tab:3090,3091,3092,3093(+2)
.pet-show-bg:3120,3123,3127,3131(+14) · .pet-show:3182,3185,3197,3199(+18) · .ps-video:3318 · .ps-worn-pip:3364,3365 · .id-card:3388,3394,3398 · .id-chip:3411
.clock-chip:3420,3421 · .coin-group:3436 · .cp-lb:3460 · .cp-v:3461 · .nw-row1:3507 · .nw-row2:3508
.top-flex2:3586 · #panel-factory:3605,3606,3610,3611(+39) · .grid2x8:3734,3740 · .mine-strip:3758,3760,3761,3766(+4) · .mb-strip:3772,3811 · .gmark:3919,3923,3924,3925(+1)
.gm-stack:3928,3932 · .gm-row:3934 · .lb-name:3936,3937,3938 · .grade-edit:3964,3969,3970 · .gradelock-box:3972,3988,3993,3995 · .gl-head:3973
.gl-emoji:3974 · .gl-ht:3975 · .gl-cur:3976 · .gl-lock:3977,3982 · .gl-ok:3981 · .gl-lock-sub:3983
.gl-why:3984 · .gl-pick-lb:3985 · .gl-opts:3986 · .gl-hist:3996 · .gl-hline:3997 · .gl-hg:4001
.gl-hat:4002 · .gl-harr:4003 · .gl-foot:4004 · .gl-cf:4005 · .reg-gradelock:4025 · #tp-overlay:4035
#tp-board:4037,4041 · .tp-head:4045 · .tp-title:4046 · .tp-stat:4048,4050 · .tp-pts:4052,4055 · .tp-close:4057,4063,4064
.tp-prompt:4067 · .tp-word:4069,4083,4084 · .tp-ch:4071,4076,4077,4079 · .tp-thai:4087 · .tp-hint:4089 · .tp-empty:4091
.tp-keys:4094 · .tp-row:4096 · .tp-row-fn:4098,4131 · .tp-key:4102,4114,4116,4122(+2) · .tp-key-fn:4129 · .tp-fx:4135
.tp-coinpop:4136 · .tp-pop-pt:4141

## css/style.css (1,810 บรรทัด · 471 selector)
:root:5 · *:15 · html:16,21 · input:25 · body:29 · #app:35
.screen:38,39 · h1:42 · .subtitle:43 · .egg-grid:46,63 · .egg-card:47,52,53,54(+2) · .pet-price:57,61
.egg:65,71,75 · .d1:76 · .basket:79,80,85,91(+5) · .basket-dog:89,102,103,104 · .basket-cat:90,105,106,107 · .egg-dragon:110
.topbar:125 · .topbar-coins:126 · .coin-pill:127,138,142,147(+2) · .coin-ic:134 · .no-anim:148,563,1474,1767(+2) · .net-coin:150
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
.quiz-score-pill:1153 · .stats-card:1156 · .stats-title:1160,1595 · .stats-row:1161,1162,1163,1164 · .game-top:1167 · .back-btn:1168
.combo-pill:1172 · .timer-wrap:1176 · .timer-fill:1177,1178 · .board-label:1180 · .card-grid:1181 · .word-card:1182,1188,1189,1190(+3)
.hint-btn:1196,1201 · .game-endless-note:1204,1209,1211,1215(+6) · .report-btn:1236,1241 · .report-box:1244 · .report-close:1245 · .rp-head:1249
.rp-avatar:1250,1251 · .rp-title:1252 · .rp-sub:1253 · .rp-levelcard:1255 · .rp-level-top:1259 · .rp-bar:1260
.rp-bar-fill:1261 · .rp-level-note:1262,1263 · .rp-grid:1265 · .rp-stat:1266 · .rp-ic:1269 · .rp-num:1270
.rp-lbl:1271 · .rp-section:1273 · .rp-h3:1274 · .rp-badge-mini:1275 · .rp-row:1276,1277,1278 · .rp-empty:1279
.rp-badges:1280 · .rp-badge:1281 · .rp-tline:1284 · .rp-tl-head:1285,1286 · .rp-tl-ems:1287 · .rp-em:1288,1289
.rp-tl-note:1290,1291 · .rp-crown:1293,1294 · .rp-wtitle:1296 · .rp-wnow:1297,1298 · .rp-wgraph:1299 · .rp-wcol:1300
.rp-wval:1301 · .rp-wbar:1302,1303 · .rp-wlbl:1304 · .rp-cheer:1306 · .report-ok:1310 · .summary-box:1313,1366,1370,1371(+2)
.sm-burst:1314 · .sm-title:1316 · .sm-line:1317 · .sm-coin:1318 · .sm-matches:1324,1325 · .confetti:1327
.sm-badge:1334 · .sm-badge-all:1338 · .badge-celebrate-overlay:1341,1356 · .badge-celebrate:1347 · .bc-emoji:1353 · .bc-title:1354
.bc-sub:1355 · .sm-cheer:1360 · .sm-streak:1361,1362 · .sm-sick:1363 · .sm-btns:1364 · .float-fx:1376
.toast:1383 · .toast-warn:1390,1397,1398,1404 · .toast-clear-all:1406,1413 · .alert-box:1415 · .alert-ok:1416,1421 · .settings-box:1423
.set-row:1424 · .set-hint:1428 · .set-hint-on:1429 · .set-hint-off:1430 · .set-lwrap:1431 · .set-label:1432
.set-desc:1433 · .set-switch:1434,1438,1439,1444(+4) · .set-sw-knob:1440 · .set-sw-txt:1447 · .set-close:1453,1458 · .set-help:1459,1464
.help-box:1466,1467,1472 · .help-item:1468 · .update-banner:1480,1489,1490 · #update-reload:1491 · #update-dismiss:1495 · .levelup-overlay:1501
.levelup-box:1505,1512,1513,1514(+4) · .bill-box:1520,1524,1525 · .tag-off:1526 · .home-decayed-img:1527 · .home-dark-img:1528 · .thirst-fill:1529
.thirst-text:1530,1531 · .toxin-fill:1534 · .toxin-text:1535,1536 · .detox-btn:1537,1542 · .shape-text:1545,1546,1547,1548(+1) · .avatar-pick:1552
.avatar-opt:1553,1557,1558,1559 · .avatar-chip-img:1563 · .avatar-chip-blk:1565 · .set-avatar-btns:1566 · .avatar-mini:1567,1571 · .set-blk-row:1573
.set-sub2:1574 · .blk-grid:1576 · .blk-mini:1577,1580,1581,1582 · .game-avatar:1585,1586,1587 · .stats-nick:1596 · .ticket-owned:1599,1603
.collect-sub:1608 · .mkt-tabs:1609 · .mkt-tab:1610,1614 · .mkt-filter:1615 · .mkt-row:1619 · .mkt-emoji:1623,1624
.mkt-info:1625,1626 · .mkt-tier-stars:1627 · .mkt-buy:1628,1633,1634 · .mkt-price-lo:1635 · .mkt-price-hi:1636 · .mkt-empty:1637
.collect-grid:1640 · .collect-cell:1641 · .cc-emoji:1642,1643 · .cc-name:1644 · .cc-count:1645 · .cc-list-btn:1646,1650
.mkt-listhead:1651 · .mkt-group-head:1653,1659 · .mkt-two-col:1661,1662,1666,1678(+8) · #phone-card:1667,1683 · #computer-card:1668,1684 · #ticket-card:1670
#haunt-card:1671 · #heli-card:1672 · #drone-card:1673 · #drive-card:1674 · #soccer-card:1675 · #moto-card:1676
#invasion-card:1677 · .mkt-listing:1705 · .ml-cancel:1709 · .mkt-sold:1715,1716,1717 · .list-dialog:1724,1725,1730 · .list-hint:1729
.collect-reveal-frame:1733,1740 · .collect-reveal-img:1739 · .collect-reveal-stars:1741 · .craft-box:1744 · .craft-head:1745 · .craft-bar:1746
.craft-fill:1747 · .craft-text:1748 · .craft-btn-row:1749,1750 · .craft-go-btn:1752,1758,1759,1762 · .craft-cancel:1770,1774 · .mkt-catalog:1777,1778,1779
.mkt-pager:1782 · .pg-btn:1783,1787,1788 · .pg-mid:1789 · .pg-dots:1790 · .pg-dot:1791,1792 · .order-head:1793
.order-row:1794,1799,1801,1803 · .order-deliver:1804,1809 · .order-need:1810
