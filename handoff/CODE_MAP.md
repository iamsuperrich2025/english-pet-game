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

## js/adventure3d.js (10,708 บรรทัด · 536 รายการ)
### 🗂️ สารบัญโซน js/adventure3d.js (Read/Edit เฉพาะช่วง)
- 1-213 adventure3d.js — โลก 3D First-person 2 โหมด (คิว 7725691507 ข้อ 8 + ต่อยอด)
- 214-277 ⚽ โหมดสนามฟุตบอล (โหมด soccer · รอบ 196) — เล็ง+ชาร์จพลังเตะบอลใส่ป้ายตัวอักษร
- 278-332 🤖 โหมดหุ่นยนต์นักรบ (โหมด mecha · รอบ 199) — มุมมองในหุ่นสูง 5m เดินยิงเอเลี่ยนตัวอักษร
- 333-475 📻 หอบังคับการบิน (รอบ 64 · รอบ 66 เปลี่ยนเป็นอังกฤษล้วนตามผู้ใช้สั่ง)
- 476-496 คำศัพท์ — ตามระดับชั้น + ไม่ซ้ำคำที่ประกอบแล้ว (8.1/8.6) · แยกคลังต่อโหมด
- 497-633 Texture ตัวอักษร / emoji / ป้ายชื่อผู้เล่น (canvas → sprite)
- 634-800 🧱 ตัวละครบล็อก (โลกขับรถ) — เลือกก่อนออกรถ · เพื่อนใน map เห็นเป็นหุ่นบล็อกขับรถบล็อก
- 801-1107 🚙 รอบ 393: รถเพื่อนในโลกขับรถ = โมเดลจริง img/models/car_01.glb (ผู้ใช้สั่ง)
- 1108-1260 สร้างฉาก static ครั้งเดียวต่อโหมด
- 1261-1578 🚗 เมืองกำแพงเพชรจริง (โหมด drive) — ข้อมูล OpenStreetMap ใน js/data/city_kpp.js
- 1579-1593 🌅 ท้องฟ้าภาพจริง (รอบ 203) — ใส่ภาพ panorama 360° (equirectangular 2:1) เป็นฉากหลังท้องฟ้า
- 1594-1977 🧱 เทกซ์เจอร์ภาพจริง (รอบ 323) — วางไฟล์ `img/tex/<key>.jpg` (หรือ .png) แล้วแปะทับพื้นผิวทันที
- 1978-2077 ตัวอักษรในโลก (8.2)
- 2078-2132 🔠🪙 เก็บตัวอักษร 1 ตัว = ได้ 1 เหรียญ (รอบ 345)
- 2133-2191 ประกอบคำอัตโนมัติเมื่อมีตัวอักษรครบ (8.1/8.4)
- 2192-2286 โหมด adv: monsters ยิงสู้ได้ (สเปกเดิม 8.5)
- 2287-2467 โหมด haunt: ผีโผล่ 3 วิ → ย้ายที่ · สู้ไม่ได้ · โดนจับ = game over
- 2468-2619 เสียงหลอนโหมดผีสิง — สังเคราะห์ Web Audio (ปลอดลิขสิทธิ์ 100%)
- 2620-2936 Multiplayer — ผู้เล่นอื่นใน map เดียวกัน (สไตล์ Roblox)
- 2937-3136 Voice chat ใน map — WebRTC P2P mesh (เสียงวิ่งตรงระหว่างเครื่อง)
- 3137-3223 🏁 พิธีประกาศแชมป์ (ครูกด "จบรอบแข่ง") — /class/<map>/podium
- 3224-3423 HUD
- 3424-4036 DOM overlay + CSS (สร้างครั้งเดียว — self-contained ไม่แตะ style.css)
- 4037-4162 Input — เมาส์+คีย์บอร์ด และจอสัมผัส (มือถือ landscape)
- 4163-4167 🚁 โหมดเฮลิคอปเตอร์ Bell — ฟิสิกส์บินแบบอาร์เคด (สไตล์ Helicopter Flight Pilot)
- 4168-4559 🛸 โดรน FPV (โหมด drone) — บินเร็ว/คล่อง ลอดหน้าต่างเข้าตึกร้าง เก็บตัวอักษรในห้อง
- 4560-4682 🚗 โหมดขับรถเมืองกำแพงเพชร — ฟิสิกส์รถอาร์เคด (bicycle model)
- 4683-4776 🚦 รอบ 133: ไฟจราจรจริงที่ทางแยกใหญ่ + ฝ่าไฟแดงโดนใบสั่ง ม.22
- 4777-5204 🧭 GPS นำทาง (โหมด drive) — เลือกตัวอักษรเป้าหมาย + เส้นทางตามถนนจริง (A*) + เสียงอังกฤษเลี้ยว
- 5205-5263 🎛️ เข็มหน้าปัดวิ่งจริง (สปีด 0-180 + วัดรอบ 0-8×1000) — วาดทับวงเกจของภาพ dash.png
- 5264-5348 🎵 รอบ 181: วิทยุในรถ — จอ head-unit กลางคอนโซล (visualizer + เลือกเพลง 3 โหมด)
- 5349-5476 🪆 รอบ 191: ตุ๊กตาดุ๊กดิ๊กหน้ารถ — รูปตัวละครที่ผู้เล่นเลือก (blkN.png)
- 5477-5780 🚔 รอบ 128: แผงเตรียมออกรถ + กฎหมายจราจร + ใบสั่ง
- 5781-5823 🛩️📦 ภารกิจไปรษณีย์กลางคืน (รอบ 353) — เฉพาะช่วงฟ้ามืด (heliNight>.5)
- 5824-7011 🚶🛗🚁🪂 โหมดเดินเท้าในเมืองเฮลิฯ (รอบ 354 — ผู้ใช้สั่ง)
- 7012-7085 🎛️ หน้าปัดเข็มขยับจริง (รอบ 61) — วาดสดทุกเฟรมจากค่าการบินจริง
- 7086-7355 🌧️☀️ ชั้นบนกระจก: ที่ปัดน้ำฝน + แสงแดดสาด (รอบ 346)
- 7356-7760 🔊🌧️ เสียงที่ปัดน้ำฝน (รอบ 537) — สังเคราะห์ล้วน ไม่มีไฟล์เสียง
- 7761-7830 📹 กล้องใต้ท้องเครื่อง (belly cam) — รอบ 348
- 7831-7902 🎯 วงเป้าลงจอด (รอบ 349) — ไฮไลต์ดาดฟ้าที่มีตัวอักษร ให้รู้ว่าควรร่อนลงตรงไหน
- 7903-8518 📏 แถบเตือนความเร็วดิ่ง (รอบ 349) — ลงเร็วเกินกรอบกล้องกะพริบแดง สอนให้ร่อนลงนุ่มๆ
- 8519-8521 Loop หลัก
- 8522-9748 ⚽ โหมดสนามฟุตบอล — ฟิสิกส์บอล + เล็ง + ชาร์จพลัง + กล้อง 1st/3rd + ชุดนักเตะ
- 9749-10196 🤖 โหมดหุ่นยนต์นักรบ — เดินยิงเอเลี่ยนตัวอักษร (ต้องยิงเรียงลำดับในคำ)
- 10197-10209 เข้า/ออกโลก
- 10210-10708 ❓ การ์ด "วิธีเล่น" ตอนเข้าโลกครั้งแรก (จำแยกต่อโลกใน localStorage — ไม่แตะ state.js)
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
makeBlockCar:710 · blkNameSprite:755 · makeBlockPeer:768 · makeBlockWalkPeer:789 · disposeBlockPeer:797 · CAR_GLB_URL:808
CAR_GLB_LEN:809 · carSplitWheel:813 · carGlbEnsure:840 · carMatGet:859 · carGlbBuild:875 · carAvCode:924
driveCamToggle:931 · SKID_N:950 · skidGeomGet:952 · skidDrop:957 · skidTick:971 · blkBuildThumbs:981
blkBuildPicker:999 · pickBlockAvatar:1044 · bubbleSprite:1067 · showPeerBubble:1094 · removePeerBubble:1102 · concreteTexture:1112
brokenWindowTexture:1129 · intactGlassTexture:1145 · chargeIconTexture:1163 · rustyDoorTexture:1172 · dAddBox:1186 · buildAbandoned:1193
makeNameSprite:1266 · flatGeom:1279 · flatGeomUV:1288 · buildDriveCity:1298 · SKY_IMG:1584 · applySky:1585
applyTex:1600 · buildScene:1623 · randPos:1981 · randRoadPos:1989 · spawnLetter:2001 · spawnLettersForWord:2032
ensureCoverage:2034 · relocateLetters:2047 · removeLetter:2072 · LETTER_COIN:2083 · pickUpLetter:2084 · letterPop:2098
letterChime:2116 · tryCompleteWords:2136 · completeWord:2150 · spawnMonster:2195 · killMonster:2204 · tickMonsters:2212
damagePlayer:2234 · shoot:2250 · tickShots:2264 · spawnGhost:2290 · GHOST_STYLE:2299 · GHOST_H_DEFAULT:2300
applyGhostSize:2301 · respawnGhost:2310 · tickGhosts:2326 · sessionRecapHtml:2372 · hauntRunSec:2379 · fmtSurv:2380
hauntSurviveFinish:2381 · tickSurvive:2391 · renderHearts:2404 · ghostHit:2413 · caught:2435 · knockedOut:2461
netReady:2625 · netJoin:2631 · sendPos:2646 · sendChat:2688 · toggleChatBox:2702 · onPeerData:2713
disposeHeliMesh:2798 · removePeer:2803 · netLeave:2818 · tickPeers:2824 · RTC_CFG:2945 · tinvLinked:2946
partyWord:2953 · syncPartyWord:2966 · updateVoiceBtns:3118 · PODIUM_BONUS:3143 · podiumJoin:3145 · podiumLeave:3156
endRound:3157 · showPodium:3168 · tinvCheck:3208 · showBanner:3228 · renderHudTop:3234 · renderHudWords:3239
renderHudInv:3249 · ddTierFromName:3256 · renderBoard:3258 · drawBigMap:3289 · openBigMap:3344 · closeBigMap:3352
drawMinimap:3357 · loadCarDash:3429 · loadCarWheel:3441 · buildDom:3451 · confirmExit:4021 · IS_TOUCH:4040
bindInput:4041 · movePlayer:4128 · tickPlayer:4138 · collideDrone:4171 · propStall:4190 · propBreak:4197
propFix:4204 · droneBatAdd:4211 · lightningBolt:4214 · startRain:4225 · stopRain:4239 · smashGlass:4241
awardGlass:4252 · neededLetter:4269 · openDoor:4284 · raceStartRun:4304 · raceStop:4311 · gateHighlight:4329
renderRaceHud:4336 · tickDrone:4345 · nearMissTick:4487 · showNearMiss:4511 · awardDaredevil:4522 · comboCheer:4539
comboFlash:4555 · driveCell:4564 · nearestStreet:4570 · collideCar:4580 · tlDotY:4611 · tlSet:4615
driveArms:4632 · tlTick:4644 · TL_GREEN:4688 · tlRedDur:4690 · tlightPhase:4691 · buildTrafficLights:4698
rlTick:4750 · cellDrivable:4782 · cellCenter:4783 · losClear:4785 · nearestDrivableCell:4795 · routeGrid:4804
pickGpsTarget:4857 · gpsSpeak:4869 · NAVLINE_W:4888 · navLineEnsure:4889 · navLineHide:4899 · navLineUpdate:4900
tickGps:4927 · tickDrive:5003 · drawCarDial:5211 · drawCarGauges:5241 · RADIO_RECT:5269 · CAR_RADIO_RECT:5271
carRadioRect:5277 · radioLayout:5279 · radioSetHint:5302 · renderRadioList:5308 · radioToggleList:5318 · drawRadioViz:5323
radioTick:5341 · BOBBLE_FOOT:5354 · BOBBLE_H:5355 · BOBBLE_ASPECT:5356 · BOB_OMEGA:5359 · BOB_PITCH_FORCE:5361
BOBBLE_SKINS:5363 · bobbleSetAvatar:5370 · bobbleLayout:5377 · bobbleTick:5390 · bobblePoke:5415 · bobbleApplySkin:5432
dollOwned:5442 · openDollPicker:5443 · carStartShow:5480 · showLawInfo:5498 · lawNotice:5520 · driveFineSettle:5530
HELI_PHASES:5709 · heliStartPhase:5716 · heliFloorAt:5723 · SOFT_TIERS:5733 · softLandBonus:5735 · awardPerfLand:5748
setHeliLight:5767 · MAIL_COIN:5786 · mailStart:5788 · mailStop:5811 · mailTick:5812 · FOOT_EYE:5831
doorSlideSfx:5837 · doorLerp:5860 · entLerp:5868 · footStepSfx:5878 · WRING_COIN:5899 · festivalPaint:5903
dustTexture:5915 · dustBurst:5924 · dustTick:5938 · HELI_GLB_URL:5959 · HELI_GLB_TEX_BLUE:5961 · HELI_GLB_ROTOR:5963
HELI_GLB_TROTOR:5964 · heliGlbEnsure:5966 · heliMatBlueGet:5984 · heliGlbAssemble:5997 · heliNavTick:6036 · peerRotorStop:6043
peerRotorTick:6049 · heliCrashSfx:6068 · heliMeshBuild:6096 · heliMeshBuildLegacy:6107 · buildHeliFoot:6237 · footFloorAt:6353
insideTerm:6360 · inDoorZone:6361 · footHint:6365 · setFootBtns:6366 · liftStart:6371 · beginRide:6382
endRide:6405 · beginWing:6416 · awardAirLetter:6429 · paxChoiceShow:6448 · paxChoiceHide:6474 · pilotShipMesh:6478
beginPilot:6479 · endPilot:6511 · drawCabinWindow:6535 · tickHeliFoot:6559 · tickHeli:6768 · CP_NAT:7020
CP_GAUGES:7021 · SEAT_LABEL:7034 · SEAT_P_FULL:7035 · SEAT_ZOOM:7036 · DASH_OFF_Y:7037 · DASH_DROP:7038
setSeat:7040 · layoutCockpit:7052 · WIPER:7091 · WIPER_SPD:7094 · WIPER_LABEL:7095 · INT_GAP:7096
WASH_MS:7100 · WASH_TANK_MAX:7104 · SMEAR_LIFE:7116 · CHOP_MIN:7117 · SUN_RAY_FAR:7121 · sunRayBlocked:7123
sunShadeTick:7142 · applyCockpitShade:7153 · rotorChop:7165 · sunUpdate:7173 · HELI_FOG_N0:7184 · fogUpdate:7188
adGlowPulse:7234 · RAIN_MAX:7243 · VISOR_Y:7244 · RAIN_MIN:7245 · RAIN_DUR:7246 · DROP_ZONE:7250
addDrop:7251 · tickDrops:7259 · addWashDrop:7277 · washStart:7284 · renderWashGauge:7304 · washTick:7315
grimeTick:7332 · WIPE_R:7339 · wipeDrops:7340 · wiperSndOn:7363 · wiperSndOff:7375 · wiperThunk:7381
washSpraySfx:7393 · wiperSqueak:7410 · wiperSndTick:7427 · setWiper:7447 · tickWiper:7459 · SH_SWEEP:7490
shadowSweepTick:7492 · REFL_MAX:7504 · REFL_COL:7506 · cityGlowLevel:7507 · drawCityGlow:7512 · setVisor:7544
rainTick:7550 · drawBlade:7567 · drawSmears:7586 · drawGlass:7606 · drawBellyCam:7768 · drawBellyHud:7791
drawLandingTargets:7837 · VS_HARD:7907 · drawDescentBar:7908 · heliShake:7957 · cpNeedle:7968 · drawGauges:7985
XF_START:8033 · PRELOAD_WAIT:8034 · ALT_QUIET_FROM:8036 · ALT_MAX_DAMP:8037 · ALT_LP_MIN:8038 · ECHO_NEAR:8039
WIND_FULL_SPD:8040 · SHUTDOWN_SEC:8041 · PAN_MAX:8043 · OD_RPM:8044 · SHAKE_RPM:8045 · SHAKE_HIT:8046
soccerLetterPos:8526 · letterNeeded:8534 · soccerNeededSet:8539 · soccerTileGeo:8545 · soccerGoldTexture:8547 · makeSoccerTile:8564
soccerRefreshSkins:8573 · soccerBuildTargets:8580 · soccerNextTile:8590 · soccerRetarget:8603 · soccerCoinPop:8615 · soccerGrassTexture:8628
soccerTurfGrade:8650 · soccerTurfTexture:8673 · grassNormalTexture:8692 · soccerLinesTexture:8721 · soccerNetTexture:8772 · soccerCrowdTexture:8780
soccerBallMat:8799 · buildSoccerGoal:8819 · buildStands:8838 · soccerLedBoards:8873 · soccerGKEnsure:8970 · soccerGKTick:8986
fkBuildWall:9015 · fkToggle:9030 · fkHitTest:9046 · pkHud:9065 · pkStart:9074 · pkEnd:9088
pkTick:9103 · repQualify:9110 · repEnsureEl:9113 · repStart:9124 · repTick:9131 · soccerNumTex:9156
makeSoccerPlayer:9166 · soccerNewSpot:9192 · soccerResetBall:9204 · soccerKick:9211 · soccerCheer:9228 · guideTexture:9231
auraActive:9255 · auraLeftMs:9256 · buildAura:9258 · auraBuy:9279 · auraRender:9289 · auraTick:9303
buildDrill:9323 · drillTick:9336 · buildLandRing:9373 · buildGuideRibbon:9383 · renderSpinPad:9408 · spinPadToggle:9420
spinPadPick:9426 · renderCurl:9438 · kickLaunch:9449 · updateSoccerGuide:9457 · soccerCamera:9521 · tickSoccer:9542
soccerKitShow:9722 · soccerKitGo:9737 · emojiSprite:9790 · makeAlien:9795 · startWave:9828 · waveSpawnFill:9839
waveComplete:9848 · updateWaveHud:9858 · checkMechaBossBadge:9860 · alienSpawnPos:9869 · removeAlien:9874 · mechaHudWord:9879
setMechaHudSkin:9887 · mechaComboPop:9899 · mechaShielded:9904 · mechaDamageFx:9906 · mechaHitByAlien:9911 · spawnAlienShot:9917
removeAlienShot:9927 · tickAlienShots:9932 · spawnPowerup:9944 · removePowerup:9957 · collectPowerup:9962 · tickPowerups:9969
updateMechaHud:9978 · mechaTracer:10018 · mechaFire:10027 · explodeAlien:10064 · tickMecha:10094 · loop:10150
grabShot:10177 · savePhoto:10188 · clearEntities:10200 · INTRO_KEY:10214 · introSeenObj:10215 · introSeen:10216
markIntroSeen:10217 · INTRO:10218 · showIntro:10219 · closeIntro:10244 · beginPlay:10250 · start:10252
exitWorld:10443 · mechaRecapLine:10502

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

## js/game.js (968 บรรทัด · 64 รายการ)
REPLAY_BONUS_EVERY:23 · REPLAY_BONUS_TIERS:25 · replayBonusFor:26 · SESSION_MILESTONES:32 · addSessionCoins:35 · updateBestTarget:74
weekKeyStr:87 · rolloverWeekBest:93 · exitGame:99 · showSessionSummary:135 · sprinkleConfetti:182 · VOCAB_PER_LEVEL:201
VOCAB_RANK_NAMES:202 · vocabRankName:203 · showProgressReport:205 · THUNDER_MS:382 · THUNDER_TIERS:386 · THUNDER_TIER_UI:387
thunderEmoji:388 · DAREDEVIL_TIERS:392 · DAREDEVIL_TIER_UI:393 · daredevilEmoji:394 · GLASS_TIERS:398 · GLASS_TIER_UI:399
glassEmoji:400 · DILIGENT_TIERS:404 · DILIGENT_TIER_UI:405 · diligentEmoji:406 · SOFTLAND_TIERS:410 · SOFTLAND_TIER_UI:411
softLandEmoji:412 · AIRL_TIERS:416 · AIRL_TIER_UI:417 · airLetterEmoji:418 · MECHABOSS_TIERS:422 · MECHABOSS_TIER_UI:423
mechaBossEmoji:424 · BFF_TIERS:429 · BFF_TIER_UI:430 · BFF_COIN:431 · bffEmoji:432 · badgeSuffix:437
BADGE_META:452 · NAME_BADGE_RE:466 · splitNameBadges:467 · badgeEmojis:473 · badgeScore:478 · checkCrown:484
currentBadgeScore:500 · rolloverBadgeWeek:504 · addDiligent:517 · celebrateBadge:533 · addThunder:547 · startGame:561
newRound:601 · updateTimerBar:640 · updateComboPill:646 · pickCard:650 · checkMatch:662 · renderCats:776
startQuiz:811 · renderQuizQuestion:827 · quizNext:890 · finishQuiz:903

## js/images.js (168 บรรทัด · 21 รายการ)
IMG_FILES:11 · MOODS:12 · startImgKey:14 · petImageKeys:16 · probeImages:27 · probeRankImages:39
probeCollectImages:40 · probeGiftImages:41 · probeHomeImages:42 · CLIP_FILES:51 · CLIP_SM:57 · clipCanWebm:73
CLIP_ASSET_V:84 · clipFileFor:86 · petClipKey:95 · petClipUrl:104 · equippedItem:115 · petStateImg:125
happyNow:139 · makeHappy:140 · currentPetImg:151

## js/invasion3d.js (9,940 บรรทัด · 611 รายการ)
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
- 7191-7439 🌐 ผู้เล่นออนไลน์ใน map เดียวกัน (รอบ 414) — Firebase /world/invasion
- 7440-7589 🧯👥 กันผู้เล่นล้น — ฝั่งเรนเดอร์ของโลกนี้ (รอบ 637 · ยกส่วนกลางออกไป js/netroom.js รอบ 640)
- 7590-7648 💨 ควันตามหลังมิสไซล์ (รอบ 531 — ผู้ใช้สั่ง) — สไปรต์ควันนุ่มปล่อยเป็นระยะ
- 7649-7816 🔥🌀 รอบ 565 (ผู้ใช้สั่ง): ยานลูก "หลบมิสไซล์ที่ล็อกได้" — ปล่อยแฟลร์ + บิดหนี
- 7817-7895 🔫↩️ รอบ 568 (ผู้ใช้สั่ง): ยานลูกที่ "ถูกเรดาร์ล็อก" ยิงสวนกลับใส่เฮลิผู้เล่น
- 7896-8097 🔥🛡️ รอบ 569 (ผู้ใช้สั่ง): แฟลร์ของ "เฮลิผู้เล่น" + เสียงเตือนตอนถูกล็อก
- 8098-8108 🏃🪖 รอบ 530: หน่วยรบเคลื่อนที่เชิงยุทธวิธี (ผู้ใช้สั่ง: "อย่าปักหลักยืนทื่อ
- 8109-8234 🧘🎯 รอบ 586 (ผู้ใช้ส่งคลิป: "ตัวละครดิ้นไปดิ้นมา ไม่เป็นธรรมชาติ")
- 8235-8410 📣 รอบ 471: ทหารฝ่ายเราตะโกนบอกทิศศัตรู (ผู้ใช้สั่ง)
- 8411-8853 🌙 รอบ 471: โหมดกลางคืน — ฉากมืดสลัว + ท้องฟ้าดาว + ไฟฉายติดปืน
- 8854-9120 🔵💀 รอบ 576 (ผู้ใช้สั่ง): ยานแม่ยิง "ลำแสงสีฟ้า" ลงมาใกล้ตัวผู้เล่น — เตือน 3 ครั้ง ครั้งที่ 4 ตายจริง
- 9121-9171 ⚡👾 รอบ 579 (ผู้ใช้สั่ง): "ทุก 5 นาที สุ่มยานลูก 10 ลำ เร่งความเร็ว 10 เท่า นาน 10 วินาที แล้ววนลูป"
- 9172-9245 🔁 ลูปหลัก
- 9246-9940 ▶️ เข้า/ออกโลก
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
netSend:7213 · peerColor:7235 · nameSprite:7237 · bakedSoldierGlb:7251 · loadPeerSoldier:7252 · peerRig:7261
setPeerWeapon:7266 · peerBody:7271 · buildPeer:7300 · onPeer:7311 · dropPeer:7351 · netLeave:7358
peerTick:7363 · renderBoard:7399 · sendChat:7421 · showPeerBubble:7428 · removePeerBubble:7434 · PEER_DRAW_MAX:7447
PEER_DRAW_SLACK:7448 · DRAW_SWAP_MARGIN:7449 · JOIN_TOAST_MAX:7450 · drawnPeers:7453 · drawSlotFree:7454 · showPeerAgain:7457
hidePeer:7464 · tickDrawBudget:7469 · tickCrowdGuard:7479 · resetCrowdGuard:7483 · tickFighters:7485 · tickMother:7538
spawnAlienShot:7561 · tickAlienShots:7573 · smokeTex:7595 · spawnPuff:7606 · spawnSmoke:7616 · spawnDust:7618
tickSmoke:7627 · clearSmoke:7637 · tickHeliDust:7640 · EVA_WARN:7662 · EVA_FLARE_D:7663 · EVA_TURN:7664
EVA_SPIN_MUL:7665 · EVA_SPD_MAX:7666 · EVA_ROLL:7669 · EVA_Y:7670 · FLARE_PODS:7671 · FLARE_COOL:7672
FLARE_N:7673 · FLARE_LIFE:7674 · FLARE_TRAP:7675 · FLARE_CH:7676 · incomingMis:7681 · startEvade:7692
dropFlares:7701 · tickEvade:7729 · clearFlares:7761 · tickMissiles:7762 · CTR_REACT:7831 · CTR_WARN:7832
CTR_GAP:7833 · CTR_BURST:7837 · CTR_BURST_MS:7838 · CTR_SPD:7839 · CTR_DMG:7840 · CTR_MAX:7841
CTR_SPREAD:7842 · CTR_LEAD:7843 · ctrAimPoint:7846 · ctrArming:7853 · counterFire:7857 · tickCounter:7862
SPK_RANGE:7913 · SPK_MS:7914 · SPK_GAP:7915 · SPK_WORLD_GAP:7916 · SPK_BEEP:7917 · AMIS_SPD:7918
AMIS_TURN:7919 · AMIS_DMG:7920 · AMIS_LIFE:7921 · AMIS_MAX:7922 · AMIS_PROX:7923 · PH_FLARE_MAX:7924
PH_FLARE_RE:7925 · PH_FLARE_N:7926 · PH_FLARE_COOL:7927 · PH_FLARE_BACK:7928 · PH_FLARE_DOWN:7929 · PH_TRAP:7930
PH_FLARE_CH:7931 · renderFlareBtn:7934 · dropPlayerFlares:7940 · fireAlienMissile:7972 · clearAMis:7987 · resetSpike:7992
spikeStart:7993 · aMisNear:7995 · tickSpike:8003 · tickAMis:8055 · SQUAD_COVERS:8107 · squadCoverPool:8108
SQ_TURN:8118 · angWrap:8123 · turnTo:8125 · easeLook:8130 · squadTarget:8135 · pickSquadDest:8147
tickSquadMove:8161 · tickSquad:8187 · CALL_DIST:8241 · CALL_NEAR:8242 · CALL_GAP_ALL:8243 · CALL_GAP_ONE:8244
CALL_GAP_DIR:8245 · CALL_MS:8246 · CALL_LINES:8247 · CALL_SECTORS:8258 · bearingKey:8261 · clearSquadBubble:8269
callSprite:8275 · squadShout:8287 · tickSquadCalls:8300 · CHAT_GAP_ALL:8327 · CHAT_LINES:8328 · tickSquadChatter:8334
heliFireAt:8351 · nearestFighterTo:8363 · tickHelis:8369 · DAY:8418 · NIGHT:8420 · collectMsMats:8424
CYCLE_MS:8435 · MODE_ICON:8437 · STORM_MS:8444 · buildStars:8451 · buildStreetLamps:8474 · glowTex:8492
tickStreetLamps:8500 · beamPair:8517 · tickSearchBeams:8528 · buildBarrelFires:8565 · tickBarrels:8583 · tickShootingStar:8593
buildMist:8618 · tickMist:8628 · tickNightSound:8671 · tickSneak:8680 · tickStorm:8691 · nvReady:8707
nvEnter:8708 · nvExit:8714 · tickNvHint:8715 · dropGlowStick:8724 · tickGlowSticks:8741 · buildFlashlight:8750
setNight:8755 · setDayMode:8756 · tickNight:8770 · applyNightLook:8802 · tickFlashlight:8842 · MSB_FIRST:8872
MSB_GAP:8873 · MSB_WARN:8874 · MSB_KILL_WARN:8875 · MSB_NEAR:8876 · MSB_FLEE:8877 · MSB_R:8878
MSB_HOLD:8879 · MSB_MAX:8880 · MSB_DEAD_MS:8881 · MSB_BEEP:8882 · MSB_COVER_R:8885 · MSB_PAD_R:8886
MSB_COVER_RECHECK:8887 · msbEnsure:8892 · msbPlace:8909 · msbBarPos:8918 · msbHide:8925 · resetMsBeam:8929
msbCoverAt:8944 · msbAimBeside:8965 · msbBegin:8971 · msbAim:8988 · msbStrike:9019 · msbKill:9058
msbKickOut:9071 · tickMsBeam:9081 · TURBO_EVERY:9134 · TURBO_MS:9135 · TURBO_MUL:9136 · TURBO_N:9137
TURBO_TRACK:9138 · resetTurbo:9140 · turboPick:9145 · turboBegin:9152 · tickTurbo:9164 · fit:9175
tick:9181 · frame:9189 · build:9249 · start:9314 · exitWorld:9441

## js/lobby.js (52 บรรทัด · 3 รายการ)
PANEL_TITLES:9 · openPanel:19 · closePanel:29

## js/lobby3d.js (780 บรรทัด · 0 รายการ)

## js/main.js (222 บรรทัด · 4 รายการ)
syncMusicBtn:84 · showQuizBackPay:120 · fitQbp:162 · bootGame:176

## js/moto3d.js (2,012 บรรทัด · 113 รายการ)
### 🗂️ สารบัญโซน js/moto3d.js (Read/Edit เฉพาะช่วง)
- 145-433 DOM เครื่องเกมพกพา (สร้างครั้งเดียว · CSS ฉีดเอง ไม่แตะ style.css)
- 434-674 ถนนจากแผนที่จริง → geometry + ตารางแฮชชนถนน
- 675-1009 ฉาก: พื้น/โรงเรียน/ป้ายหมู่บ้าน/ต้นไม้/เมฆ/บ้านหมู่บ้าน
- 1010-1062 🐕 รอบ 312: หมาวิ่งตัดถนน — โผล่ข้างถนนข้างหน้ารถ วิ่งตัดผ่านเร็ว · ชน = ปรับ 500 เหรียญ
- 1063-1173 🪙 รอบ 317: เหรียญบนถนน — pool ลอยเหนือเลนซ้าย รีไซเคิลรอบผู้เล่นตลอด
- 1174-1206 🏍️🚗 รอบ 317: โมเดลยานพาหนะ 3D (ใช้ทั้งรถเราเองโหมด car และรถ/มอไซค์ของเพื่อน)
- 1207-1303 🚗 รอบ 394: โมเดลรถจริง img/models/car_01.glb ในแผนที่บ้านโพธิ์สวัสดิ์
- 1304-1482 🧑‍🤝‍🧑 รอบ 317: เพื่อนในแผนที่เดียวกัน (/world/moto/<uid>)
- 1483-1524 🏟️👥 รอบ 640: งบวาดตัวเพื่อน (ใช้ NetRoom.drawBudget ร่วมกับโลกอื่น)
- 1525-1667 คำศัพท์ + ตัวอักษรบนถนน
- 1668-1884 สร้างโลกครั้งเดียว + ลูปเกม
- 1885-2012 เข้า/ออกโลก
### รายการ js/moto3d.js
REWARD:7 · ACCEL:8 · DASH_LEN:9 · DOG_HIT_COIN:10 · FEAT_SP:12 · DECAL_N:13
GRAV:14 · SUSP_K:15 · ROAD_WIDE:16 · EDGE_M:17 · ROAD_TEX_S:18 · POST_N:19
LEAN_MAX:20 · COLLECT_R:21 · SPAWN_MIN:22 · BUCKET:23 · TILE_COLORS:24 · LETTER_COIN:26
COIN_VAL:30 · COIN_GAP:31 · COIN_SPIN_SPD:33 · COIN_TIERS:36 · EMERALD_TIER:43 · HARD_LAND:44
COIN_CURVE_RAD:45 · NET_SEND_MS:47 · PEER_COLORS:48 · CHAT_MS:50 · CHAT_PRESETS:51 · ENG_FILES:93
CSS:148 · buildDom:333 · segKey:437 · smoothPts:440 · featKey:456 · addFeat:457
genFeatures:462 · terrainAt:481 · roadGroundY:494 · decalTex:502 · makeDecals:521 · decalTick:530
buildRoads:547 · distToSeg:643 · roadInfo:648 · onRoad:654 · randomRoadPoint:655 · makeTextSprite:678
letterTexture:691 · woodTileMat:706 · muralTexture:717 · buildSchool:729 · buildScenery:875 · scatterTrees:954
postTick:974 · scatterClouds:1001 · makeDog:1013 · spawnDog:1028 · dogHit:1038 · dogTick:1049
coinTexture:1067 · makeCoins:1078 · loadCoinImg:1084 · addCoin:1096 · clearCoins:1104 · addFreeCoin:1108
coinTierAt:1116 · coinFx:1126 · grabCoin:1135 · coinTick:1152 · placeSpecialCoin:1166 · makeVehicle:1178
mCarSplitWheel:1215 · mCarEnsure:1241 · mCarMat:1258 · mCarBuild:1271 · mCarCode:1298 · netReady:1310
netJoin:1316 · netSend:1329 · sendChat:1343 · showPeerBubble:1353 · removePeerBubble:1360 · renderBoard:1367
peerColor:1387 · buildPeer:1391 · onPeer:1413 · dropPeer:1448 · netLeave:1455 · peerTick:1460
PEER_DRAW_MAX:1488 · drawnPeers:1489 · drawSlotFree:1490 · showPeerAgain:1491 · hidePeer:1498 · tickDrawBudget:1503
spawnSlot:1511 · pickWord:1528 · spawnLetters:1538 · renderWordHud:1553 · fitWord:1561 · collectTick:1568
completeWord:1587 · relocTick:1612 · gpsTick:1627 · miniTick:1636 · build:1671 · applyVehicleUi:1705
fit:1723 · tick:1731 · frame:1739 · start:1888 · exitWorld:1948

## js/music.js (157 บรรทัด · 0 รายการ)

## js/netroom.js (771 บรรทัด · 19 รายการ)
CFG:41 · roomsAllowed:59 · HOT_KEYS:66 · COLD_KEYS:67 · HOT_BACK:68 · splitPayload:72
mergeBack:83 · metUids:95 · AIM_TTL_MS:114 · aimAt:116 · aimGet:120 · aimClear:124
MAPS3D:130 · whereFriends:131 · dbOf:155 · envReady:156 · isDenied:159 · create:171
drawBudget:744

## js/online.js (1,678 บรรทัด · 89 รายการ)
### 🗂️ สารบัญโซน js/online.js (Read/Edit เฉพาะช่วง)
- 2-191 ENGINE: ระบบออนไลน์จริงผ่าน Firebase Realtime Database
- 192-285 ระบบเพื่อน (ข้อ 0.3): รหัสเพื่อน + ค้นหา + ส่ง/รับคำขอ
- 286-475 ระบบแชทกับเพื่อน (ข้อ 0.4)
- 476-641 ระบบส่งของขวัญ (ข้อ 0.5)
- 642-758 🏪 ตลาดออนไลน์จริง (item 2 backlog): ซื้อ-ขายสินค้าที่เพื่อน "ผลิตเอง" ข้ามผู้เล่น
- 759-796 คำเชิญเล่นโลก 3D ด้วยกัน — /tinv/<toUid>/<fromUid> = {map,n,ts}
- 797-993 📰 Follow + Feed กิจกรรม (รอบ 155) · 🌍 หน้า Feed ทุกคน + ไลก์/คอมเมนต์ (รอบ 639)
- 994-1096 🌍 หน้า Feed ทุกคน + ไลก์/คอมเมนต์ (รอบ 639)
- 1097-1678 📞 โทรหาเพื่อน — Voice call / Video call แบบ LINE (รอบ 625 · กลุ่ม 3 คนรอบ 631)
### รายการ js/online.js
ONLINE_STALE_MS:57 · ONLINE_BEAT_MS:58 · LEADERBOARD_SIZE:59 · onlineDisplayName:63 · onlineActivity:71 · ensureOnlineId:87
onlineKey:97 · onlinePushPresence:102 · onlinePushScore:112 · fetchPlayerStats:142 · onlineRerender:164 · notifyFriendBadges:176
FRIEND_ALPHA:202 · friendCode:203 · friendSearch:215 · friendRequest:239 · friendAccept:248 · friendDecline:260
friendsHeal:270 · CHAT_MAX_LEN:294 · CHAT_KEEP:295 · chatPairId:297 · chatRef:300 · chatListen:306
chatSend:322 · chatDeleteMsg:338 · TYPING_TTL:346 · typingRef:348 · chatSetTyping:349 · chatClearTyping:359
chatWatchTyping:367 · chatThemeRef:385 · chatSetTheme:386 · chatWatchTheme:391 · chatPrune:399 · chatSeenTs:416
chatMarkSeen:422 · chatUnreadCount:434 · chatWatchSync:437 · GIFT_EXPIRE_MS:487 · giftSend:490 · greetSend:504
giftAccept:516 · giftDecline:520 · giftInWatch:526 · giftReclaim:557 · giftOutWatchSync:567 · giftOutRebuild:622
salesWatch:652 · salesRerender:660 · sellInc:664 · marketWatch:672 · marketList:705 · marketUnlist:713
marketBuy:722 · marketSoldWatch:735 · tinvSend:764 · tinvClear:771 · tinvWatch:775 · FEED_MAX:805
feedEvent:808 · feedPrune:820 · feedPurgeCat:831 · feedPushAssets:842 · petDescriptor:860 · feedPushPets:866
fetchPlayerPets:880 · followSet:896 · followUnset:907 · feedRebuild:914 · feedWatchSync:926 · fetchPlayerFeed:953
fetchPlayerAssets:966 · fetchFollowers:985 · GFEED_READ:1002 · GFEED_KEEP_ME:1003 · gfeedPush:1006 · gfeedPrune:1020
gfeedWatchStart:1033 · gfeedWatchStop:1059 · gfeedRebuild:1065 · gfeedToggleLike:1077 · gfeedAddComment:1083 · CALL_RTC_CFG:1121
CALL_RING_MS:1122 · CALL_MAX_MS:1123 · CALL_MAX_PEERS:1124 · onlineStart:1540 · onlineLoadSDK:1653

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

## js/ui.js (8,261 บรรทัด · 333 รายการ)
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
- 825-1164 Daily Quest (item 3): การ์ดภารกิจวันนี้ใน aside ขวา
- 1165-1257 รอบ 153: เมนูลัดแตะแถวเพื่อนออนไลน์ในกล่อง aside
- 1258-1634 การ์ด Leaderboard — สลับแท็บในการ์ดเดียว (ประหยัดพื้นที่):
- 1635-1946 การ์ดข้อมูลผู้เล่น 👤 — คลิกชื่อในการ์ดเพื่อน/กระดาน แล้วโชว์
- 1947-2171 แผงเพื่อน 👥 (ข้อ 0.3): รหัสเพื่อน + ค้นหา + คำขอ + รายชื่อเพื่อน
- 2172-2267 🌍 เพื่อนอยู่โลก 3D ไหน + ปุ่ม "ตามเข้าไป" (รอบ 642)
- 2268-2306 แชทกับเพื่อน (ข้อ 0.4) — กล่องแชทลอยกลางจอ + แผง emoji
- 2307-2684 รอบ 179: หน้ารวมข้อความ (inbox แบบ Messenger — ธีมกระจกฟ้า sci-fi ของเกม)
- 2685-3031 ระบบส่งของขวัญ (ข้อ 0.5) — ห้องของขวัญ + กล่องเลือกส่ง + ฉากเปิด
- 3032-3116 RANK CARD + ฉากเลื่อนแรงค์
- 3117-3119 PET DASHBOARD
- 3120-3237 📰 รอบ 155: overlay ข้อมูลน้อง & การดูแล + ฟีดกิจกรรมเพื่อน
- 3238-3446 🌍 รอบ 639: หน้า Feed เต็มจอ — ทุกคน (ไม่ใช่แค่ follow) + ไลก์/คอมเมนต์
- 3447-4065 📖 Dictionary ค้นหาคำศัพท์ (รอบ 254 ผู้ใช้สั่ง 16 ก.ค. 2026)
- 4066-4109 การนอน (คิว 7725691507 ข้อ 1)
- 4110-4488 ให้อาหาร (ระบบมื้อเย็น 18:00 + ความอิ่มสะสม — ข้อ 2+3)
- 4489-4570 🛡️ ควิซอาหารปลอดภัย (ต่อยอดข้อ 5.1)
- 4571-4656 🎀 ห้องแต่งตัวสัตว์เลี้ยง (รอบ 635: แยกออกจาก "ร้านค้า" เดิม —
- 4657-4844 ที่พัก (หลบแดด/หลบฝน) + เครื่องปรับอากาศ
- 4845-4962 บิลสาธารณูปโภค (ค่าไฟ/ค่าน้ำ — เครื่องยนต์อยู่ใน state.js: UTILITIES/billTick)
- 4963-5045 การ์ดมือถือ (ข้อ 7): ซื้อ 10,000 ขายคืน 6,000
- 5046-5056 การ์ดคอมพิวเตอร์ (ข้อ 11): ซื้อ 50,000 ขายคืน 30,000
- 5057-5212 item 8: โบนัสออนไลน์ +0.01 เหรียญ/วิ ฟรีทุกคนที่เปิดเกมออนไลน์อยู่
- 5213-5428 🎫 การ์ดตั๋วโลกผจญภัย (คิว 7725691507 ข้อ 7)
- 5429-5510 🎃 การ์ดตั๋วโลกผีสิงกลางคืน (ต่อยอดข้อ 8 · ผู้ใช้เคาะ 7 ก.ค.)
- 5511-5614 🚁 การ์ดตั๋วโลกเฮลิคอปเตอร์ Bell (รอบ 52)
- 5615-5714 🛸 การ์ดตั๋วโลกโดรน FPV Racing (รอบ 85) — ซื้อได้เมื่อมีตั๋วเฮลิคอปเตอร์
- 5715-5905 🚗 การ์ดตั๋วโลกขับรถกำแพงเพชร (รอบ 113) — ซื้อได้เมื่อมีตั๋วโดรน FPV
- 5906-5998 ⚽ การ์ดตั๋วโลกสนามฟุตบอล (รอบ 196) — ซื้อได้เมื่อมีตั๋วขับรถ
- 5999-6094 🏍️ การ์ดตั๋วโลกมอเตอร์ไซค์บ้านโพธิ์สวัสดิ์ (รอบ 293) — ซื้อได้เมื่อมีตั๋วขับรถ
- 6095-6192 🛸 การ์ดตั๋วโลก "ยานแม่บุกโลก" (Invasion · รอบ 413)
- 6193-6237 🌍 ปุ่มลัดเข้าโลก 3D ในรางเมนูซ้าย (ผู้ใช้สั่ง 9 ก.ค. 2026)
- 6238-6383 🧭 ป้ายบอกทางของรางเมนูซ้าย (รอบ 601 · ผู้ใช้สั่ง 26 ก.ค. 2026)
- 6384-6553 การ์ดสวนผลไม้ (ข้อ 12): ซื้อต้นไม้ปลูกได้ไม่จำกัด แต่ละต้นออกผล
- 6554-6563 โรงงานผลิตสินค้า 🏭 + ตลาดขายต่อ (แนวคิดใหม่ 5 ก.ค. 2026)
- 6564-6586 โรงงานผลิต (แผง 🏭) — แยกออกจากตลาด (ผู้ใช้สั่ง 6 ก.ค. 2026)
- 6587-6737 ตลาดขายสินค้า (แผง 🏪) — แยกออกจากโรงงาน
- 6738-7649 🚗 รอบ 131: หมวดยานพาหนะ — โชว์รูมรถ 10 คัน (แคตตาล็อก 5 ช่อง/แถว)
- 7650-7710 ร้านสัตว์เลี้ยง (ซื้อเพิ่มได้ ไม่ลบตัวเดิม)
- 7711-7747 เลเวลอัพ (รายตัว)
- 7748-7822 สถิติผลการเรียนรู้
- 7823-7860 item 4: การ์ดสรุปส่งครู — ใบเดียวจบ ชื่อ/วัน-เวลา/เหรียญวันนี้/แรงค์/สอบล่าสุด
- 7861-8261 📞 หน้าจอโทรหาเพื่อน — สายเสียง (รอบ 625 · กลุ่ม 3 คน + ปิดวิดีโอ รอบ 631)
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
onPageDraw:998 · onPageFlip:1009 · bindOnlinePager:1020 · renderOnlineCard:1055 · bindInviteCards:1172 · bindFriendQuickMenu:1192
openFriendQuickMenu:1202 · LB_TABS:1264 · LB_WS_TOP:1265 · bindLbTabs:1267 · updateRankRailBadge:1290 · rankUpCheck:1309
rankUpSound:1337 · renderLeaderboardCard:1348 · bindLbGroupOpen:1374 · lbRankRows:1386 · lbDemoRows:1421 · lbChar:1443
openLeaderboardFull:1452 · BLK_PAD:1526 · seatPodChars:1528 · lbCoinHtml:1538 · lbBadgeHtml:1554 · lbBossHtml:1580
lbWordSearchHtml:1603 · bindPlayerClicks:1640 · showPlayerCard:1650 · petDescImg:1876 · openImgLightbox:1889 · openPetPeek:1909
updateBillBadges:1953 · setBadge:1963 · updateSettingsBadge:1979 · openAttentionSummary:1993 · updateFriendBadge:2035 · renderFriendPanel:2045
friendDoSearch:2093 · refreshFriendData:2117 · FRW_TTL_MS:2182 · FRW_MIN_GAP:2183 · frwWorldOf:2187 · frwPanelOpen:2190
frwScan:2195 · frwPaint:2217 · frwPaintHint:2238 · frwFollow:2252 · CHAT_EMOJI_CATS:2273 · CHAT_THEMES:2295
CHAT_SECRET_MS:2304 · chatBadgeSync:2312 · ibTimeStr:2320 · IB_CALL_RE:2329 · ibCallInfo:2330 · openChatInbox:2335
openChat:2498 · giftImg:2688 · giftDateStr:2690 · GREETS:2698 · GREET_EXP:2706 · greetInfo:2707
openGreetPicker:2711 · giftItemPic:2753 · giftItemName:2761 · updateGiftBadge:2767 · renderGiftPanel:2776 · acceptGift:2834
declineGift:2857 · showGreetReveal:2866 · showGiftReveal:2893 · openGiftPicker:2919 · confirmSendGift:2987 · doSendGift:3011
rankBadgeHTML:3035 · renderRankCard:3040 · renderRankTab:3066 · showRankUp:3094 · bindPetPlateButtons:3129 · openPetInfoOverlay:3152
feedAgo:3175 · renderFeedCard:3188 · openFeedBoard:3248 · renderFeedBoardLive:3269 · renderFeedBoard:3285 · bindFeedBoardEvents:3323
stageColLeft:3367 · alignPetTabs:3376 · alignCoinGroup:3385 · alignStageLeft:3399 · alignStageCols:3410 · watchStageCols:3424
alignCureBtn:3434 · dictRecordLookup:3458 · DICT_FILE_COUNT:3469 · loadDict:3470 · dictSearch:3485 · dictTapWords:3500
dictEntryHTML:3504 · openDictOverlay:3515 · renderDashboard:3599 · sleepBtnHTML:4071 · sleepHintHTML:4078 · sleepAllPets:4089
wakeAllPets:4102 · feedPet:4113 · openFoodMenu:4127 · feedWith:4198 · AVATAR_UI:4228 · playerAvatarHTML:4231
SHAPE_UI:4237 · showFeedResult:4246 · curePet:4287 · heartsFx:4310 · PAT_HOLD_MS:4333 · PAT_EXP:4334
bindPetTap:4335 · petBounce:4353 · petMood:4359 · shortPatPet:4366 · longPatPet:4374 · patCalendarHTML:4394
patStreakTick:4422 · cureCelebrateFx:4448 · railCureClick:4459 · detoxPet:4471 · openFoodQuiz:4494 · closeDressUpBoard:4576
openDressUpBoard:4580 · renderShop:4597 · homeVisualHTML:4660 · showHomeRuined:4674 · showCutNotice:4695 · renderHomeCard:4713
payMaint:4797 · trashBillUI:4813 · payTrash:4830 · UTILITY_UI:4849 · utilityBillUI:4898 · payUtility:4923
buyUtilityFix:4949 · renderPhoneCard:4967 · buyPhone:5007 · sellPhone:5029 · compLiveTotal:5050 · onlineLiveTotal:5061
renderOnlineEarnPill:5066 · openPillInfo:5089 · renderComputerCard:5136 · buyComputer:5171 · sellComputer:5194 · soldCount:5220
soldBadge:5221 · renderTicketCard:5226 · loadScriptOnce:5282 · loadAdv3d:5299 · enterAdventure3D:5306 · pickAdvMap:5331
enterHaunted3D:5366 · advHealClick:5388 · buyTicket:5408 · renderHauntCard:5434 · buyHauntTicket:5489 · renderHeliCard:5516
buyHeliTicket:5574 · enterHeli3D:5597 · renderDroneCard:5619 · buyDroneTicket:5674 · enterDrone3D:5697 · renderDriveCard:5720
buyDriveTicket:5794 · enterDrive3D:5817 · pickDriveMap:5852 · enterMotoMapAsCar:5888 · renderSoccerCard:5910 · buySoccerTicket:5958
enterSoccer3D:5981 · renderMotoCard:6004 · buyMotoTicket:6053 · enterMoto3D:6076 · renderInvasionCard:6099 · INVASION_REWARD:6148
buyInvasionTicket:6150 · enterInvasion3D:6174 · WORLD3D:6199 · gotoRobotShop:6210 · scrollShopCardIntoView:6215 · railWorldClick:6218
railScrollHint:6243 · railScrollTop:6251 · initRailScroll:6256 · renderRailWorlds:6276 · tinvNoticeHTML:6337 · openTinvPicker:6345
fruitCountdown:6389 · renderFarmCard:6401 · renderFarmClock:6476 · buyFruit:6492 · sellFruit:6512 · sellAllFruit:6533
collectImg:6562 · renderFactoryCard:6568 · renderMarketCard:6591 · updateWishBadge:6647 · openWishlistDialog:6658 · bindStripArrows:6703
renderMarketBrowse:6715 · carImg:6744 · renderVehicleShop:6745 · CS_CYCLE_MS:6796 · carInteriorImg:6797 · carStatHtml:6799
renderCarShowroom:6806 · csShowBig:6833 · csInit:6860 · RS_CYCLE_MS:6883 · robotImg:6884 · renderRobotShop:6885
rsShowBig:6907 · rsInit:6928 · buyRobot:6947 · enterMecha3D:6969 · pickMechaRobot:6990 · pickDriveCar:7022
openCarBuyDialog:7065 · buyCarInsurance:7126 · payCarLoanMonthly:7145 · payCarLoanFull:7157 · carDriveBlock:7176 · gotoVehicleShop:7181
gotoMyStock:7186 · showNeedCarDialog:7192 · craftDiscount:7204 · renderFactory:7207 · renderOrdersUI:7276 · startProduce:7295
buyCollectible:7323 · cancelProduce:7351 · deliverOrder:7365 · renderOrderClock:7382 · renderCollectMine:7392 · openListDialog:7434
cancelListing:7487 · buyMarketItem:7510 · showCollectReveal:7537 · buyAC:7575 · openHomeShop:7594 · renderPetShop:7653
showLevelUp:7714 · renderStats:7751 · showTeacherCard:7827 · CALL_REACT_EMOS:7871 · CALL_TALK_MIN:7874 · CALL_TALK_HOLD:7875
CALL_ORDER_GAP:7877 · CALL_TONES:7883 · startCall:8257

## js/util.js (811 บรรทัด · 36 รายการ)
shuffle:6 · fmtNum:15 · escapeHTML:19 · gradeSymbol:32 · gradeMark:47 · nameWithGrade:55
gradeOf:61 · seededRand:76 · fmtThaiDT:86 · fmtThaiDate:90 · showScreen:95 · TOAST_WARN_RE:105
restackToasts:108 · toast:130 · floatFx:150 · beep:160 · PET_MOOD:232 · petVoiceSynth:239
sirenSynth:316 · playCashier:340 · cashierSynth:354 · playSpark:387 · sparkSynth:401 · thunderFx:436
wordAudioFile:504 · speakWord:507 · speakLetter:527 · pickSpeakVoice:546 · speakWordTTS:557 · askNameDialog:577
askConfirm:617 · alertBox:635 · applyNoAnim:655 · openSettings:660 · openHelp:766 · openTeacherGuide:792

## js/vocabbook.js (207 บรรทัด · 14 รายการ)
VB_MAX:11 · VB_QUIZ_N:12 · VB_QUIZ_MIN:13 · vbGroup:16 · VB_GROUP_UI:21 · vbRecord:24
vbSeen:49 · vbStats:62 · vbList:70 · vbReviewCat:81 · vbStartReview:95 · openVocabBook:106
vbRender:148 · vbCardHTML:194

## js/wordsearch.js (414 บรรทัด · 0 รายการ)

## js/wsaward.js (256 บรรทัด · 0 รายการ)

## css/lobby.css (3,929 บรรทัด · 599 selector)
:root:6 · html:15 · body:16 · *:33,34,35,36 · #app:39 · h1:41
.subtitle:42 · .shop-title:43 · #rotate-overlay:46 · .screen:68 · #screen-select:77,78,79,80(+5) · .egg-need:87
.petshop-topright:89 · .petshop-play-link:90,95 · #screen-quiz:134,135,136,137(+6) · #quiz-choices:146,147 · .word-card:154 · .quiz-choice:155,156,157
.big-btn:160,161,162,163 · #screen-dashboard:168,1054,1062 · .lobby-top:175,809,810,811(+17) · .top-flex:176 · .profile-plate:177,181,730,3075(+12) · #rain-fx:186
.rain-layer:189,195 · .rain-glass:202 · .glass-drop:203 · .rail-btn:218,822,828,829(+16) · .rail-badge:219 · .fr-code-box:224
.fr-code-label:228 · .fr-code-row:229 · .fr-code:230 · .fr-copy-btn:235,239,244,245 · .fr-search-btn:240 · .fr-add-btn:241
.fr-accept:242 · .fr-decline:243 · #fr-search-input:246 · #fr-search-result:250 · .fr-found:251 · .fr-hint:255
.fr-list-title:256 · .fr-row:257 · .fr-req:261 · .fr-row-name:263,267,3904 · .fr-row-status:271 · .fr-req-btns:272
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
.pl-card:679,2334 · .pl-close:685 · .pl-head:689,2238,2241 · .pl-grade:694,3910,3911 · .pl-badges:696 · .pl-badge-chip:697,701
.pl-body:702 · .pl-loading:703 · .pl-none:704 · .pl-me-tag:705 · .pl-blk-wrap:707 · .pl-blk:708
.pl-stat:709 · .pl-lbl:714 · .pl-val:715,716 · .pl-tip:717 · .chip-edit:723,728,729 · .rank-mini:735,741,742,743
.pass-photo:745,750 · .pet-tabs:752 · .dict-box:753,757,758,759(+1) · .dict-card:765,770,774,775(+2) · .dict-head:771,772 · .dict-trail:779,783
.dt-c:784,788,789 · .dt-sep:790 · .dict-today:791 · .di-w:793,794,795 · .dict-list:796 · .dict-item:797,801,802,803(+5)
.lobby-mid:817 · .rail-wrap:820,845,849,850(+3) · .lobby-rail:821 · .rail-nudge:852,860,861,864(+1) · .rail-worlds:871 · .rail-div:872
.lobby-stage:914,916,932,1059(+13) · .newword-banner:922,929,934,3459(+1) · .coin-fly:945,948 · .coin-plus:954 · .nw-pop-coin:969,971,972 · .nw-pop-goal:975,976,980,984
.nw-goal-head:977,979,981 · .nw-goal-bar:982 · .nw-goal-fill:983 · .nw-pop-book:985,986 · .nw-tag:1007,3465 · .nw-word:1012,3469,3551
.nw-hint:1014,1015,3470,3550 · .nw-coin:1017,1020,3471,3475 · .nw-countdown:1025,3476 · .nw-bar:1027,3478 · .nw-bar-fill:1029 · .pet-stage:1032,2529
.nw-box:1039,2538 · .nw-pop-word:1040 · .nw-speak:1041 · .nw-pop-phon:1042 · .nw-ipa:1043 · .nw-pop-sent:1044
.nw-pop-mean:1045 · .pet-tab:1046,1047,1048,2881 · .stage-hero:1069,1084,1092,1237(+19) · .hero-ground:1106,1226,1232 · .hero-rank-bg:1108,1111,1114,1118(+18) · #lobby3d-canvas:1131,1132
.hero-scene:1136,1138,1145,1146(+8) · .caretaker-fig:1185 · .caretaker-img:1188 · .caretaker-emoji:1190 · .blk-rig:1197,1198,1199 · .stage-plate:1259,1267,1278,1279(+31)
.plate-title:1273 · .lobby-side:1316,1352,1357,1360(+22) · .side-sec:1319,2780,3053 · .side-label:1320,1325 · .side-label-row:1328,1329 · .lb-tabs-out:1330,1331,1335
.side-glass:1339,1346 · .side-card:1358,1470 · #quest-card:1370,1394,1395,1396(+6) · .q-bigcard:1371,1400,1401,1404(+1) · .qb-top:1373 · .qb-emoji:1374
.qb-name:1376 · .qb-bar:1377,1378 · .qb-row:1380 · .qb-prog:1381 · .qb-reward:1382 · .qb-go:1383,1387
.q-dots:1388 · .q-dot:1389,1390,1391 · .q-bonus:1392 · .feed-row:1415,2108,2113 · .inv-card:1417,1419,1420 · .inv-btns:1421
.inv-go:1422,1424 · .inv-x:1425 · #online-card:1429,2788,2789,2790(+4) · .fq-overlay:1430 · .fq-box:1432,2594 · .fq-head:1436,1438
.fq-close:1439 · .fq-sec:1441 · .fq-worlds:1442 · .fq-world:1443,1445 · .fq-acts:1446 · .fq-act:1447,1450,1451
.lb-prize:1484 · .lb-award-bar:1485,1491,1492 · .lb-award-go:1493 · .lbf-award:1495,1501,1502,1503 · .pod-pz:1504 · .wsa-overlay:1507
.wsa-box:1509 · .wsa-head:1514 · .wsa-title:1515 · .wsa-when:1516,1517 · .wsa-close:1518,1521 · .wsa-cols:1522
.wsa-col:1523 · .wsa-sec-h:1524,1525 · .wsa-msg:1526 · .wsa-msg-h:1529 · .wsa-msg-b:1530,1531 · .wsa-msg-none:1532
.wsa-rules:1534,1535 · .wsa-list:1536 · .wsa-row:1537,1539 · .wsa-r:1540 · .wsa-n:1541 · .wsa-s:1542
.wsa-p:1543 · .wsa-prizes:1544 · .wsa-pz:1545,1548 · .wsa-reveal-medal:1549 · .lobby-bottom:1559,1561 · .lobby-quiz-btn:1562
.lobby-book-btn:1563,1564 · .lobby-foodquiz-btn:1565,1566 · .lobby-play-btn:1567,1571 · .lobby-exam-btn:1573,1574,1576 · .panel-overlay:1581,1586,3564,3565(+5) · .panel-box:1587
.panel-head:1594,1598 · .panel-close:1599,1604 · .panel-body:1605,1609,1610 · .panel-page:1607,1608 · .collect-sub:1614 · .mkt-empty:1615
.craft-box:1616 · .mkt-listing:1617 · .mkt-filter:1618,1962 · .hq-grid:1625 · .hq-card:1626,1631,1655 · .hq-head:1632
.hq-pic:1638,1640 · .hq-emoji:1642 · .hq-badge:1643 · .hq-stars:1647 · .hq-price:1648,1653,1654,1657(+6) · .craft-credit:1661,1663,1664
.car-grid:1671,1673,1674 · .robot-weap:1675 · .dmap-box:1678,1679 · .dmap-grid:1685 · .dmap-card:1687,1690,1691,1692(+2) · .dmap-ico:1694
.dmap-new:1697 · .dcp-grid:1699 · .dcp-card:1701,1704,1705,1706(+10) · .levelup-box:1723,2495,2496,2591 · .dcp-box:1726,1727,1731,1732(+6) · .dcp-lock:1740
.sold-badge:1744,1746,1747 · .rs-showroom:1749,3863,3864 · .rs-list:1750,1752,3844,3847 · .rs-thumb:1753,1755,1756,1757(+1) · .rs-thumb-pic:1758,1759 · .rs-thumb-price:1760
.rs-stage:1762 · .rs-big:1765 · .rs-big-img:1766 · .rs-elec:1770,1774,1779 · .rs-edge:1780,1786 · .rs-info:1789,1790,1791,1792(+1)
.rs-buy:1794,1796,1797 · .cs-showroom:1801,3836,3837,3865(+3) · .cs-list:1802,1804,3838,3843(+9) · .cs-thumb:1805,1807,1808,1809(+1) · .cs-thumb-pic:1810,1811 · .cs-thumb-name:1812
.cs-thumb-price:1813 · .cs-thumb-own:1814 · .cs-stage:1816 · .cs-big:1819 · .cs-big-img:1820 · .cs-elec:1824,1828,1832
.cs-edge:1833,1839 · .cs-interior:1842 · .cs-inr-label:1843,1844 · .cs-inr-img:1845 · .cs-info:1847,1848,1849,1850(+6) · .cs-buy:1858,1860,1861,1862
.car-emoji:1864 · .car-mine:1870 · .car-mine-pic:1875 · .car-mine-info:1876 · .car-loan:1877,1878 · .car-mine-btns:1879,1880,1881
.car-locked:1883 · .car-mine-head:1885 · .car-pick-list:1886,1887 · .car-pick:1888,1890,1891 · .car-pick-pic:1892,1893 · .car-pick-name:1894,1895
.car-pick-od:1896 · .car-buy-box:1898,2598 · .cb-pic:1899,1900,1901 · .cb-lines:1902 · .cb-li:1903,1907,1908 · .cb-ins:1909,1913,1914
.cb-plan:1915 · .cb-pl:1916,1921,1923,1927(+1) · .cb-total:1934 · .cb-btns:1935,1940 · .cb-x:1936 · .shop-grid:1943
.shop-item:1944,1949,1954,1955(+3) · .mkt-tab:1963,1964 · .pg-btn:1965,1966,1967 · .pg-dot:1968 · .fr-gift-btn:1991,1996 · .gift-sec-title:1999
.gift-in-row:2001 · .gift-out-row:2005 · .gift-in-pic:2006,2008,2009 · .gift-in-info:2010,2011 · .gift-in-btns:2012 · .gift-accept:2013,2017,2019
.gift-decline:2018 · .gift-box-card:2020 · .gift-box-from:2021,2022 · .gift-note:2023 · .gift-pick-overlay:2026 · .gift-pick-box:2030
.gift-pick-head:2036,2040 · .gift-pick-close:2041 · .gift-pick-tabs:2043 · .gp-tab:2044,2048 · .gift-pick-body:2049 · .gp-chips:2050
.gp-chip:2051,2055 · .gp-card:2056,2057 · .gp-price:2058 · .gp-note:2059 · .gift-cf-pic:2060 · .chat-emoji-cats:2065
.chat-emoji-cat:2069,2073,2074 · .chat-emoji-wrap:2075,2076 · .stage-left:2084,3555 · .pet-info-btn:2088,2095,2096 · .feed-list:2103,2107 · .feed-ico:2114
.feed-txt:2115 · .feed-name:2116 · .feed-ago:2117 · .feed-empty:2118,2121 · .feed-plate:2123 · .feed-all-btn:2124,2129
.fdb-overlay:2134 · .fdb-box:2136 · .fdb-head:2140 · .fdb-close:2144,2146 · .fdb-live:2147,2149 · .fdb-live-title:2150
.fdb-live-rows:2151 · .fdb-live-row:2152,2154,2155,2156 · .fdb-dot:2157 · .fdb-list:2159,2160 · .fdb-empty:2161 · .fdb-row:2162
.fdb-row-top:2164 · .fdb-ico:2165 · .fdb-txt:2166 · .fdb-name:2167 · .fdb-ago:2168 · .fdb-actions:2169
.fdb-like:2170,2173,2174,2175 · .fdb-cm-list:2176 · .fdb-cm-row:2177,2179 · .fdb-cm-empty:2180 · .fdb-cm-add:2181 · .fdb-cm-input:2182,2184
.fdb-cm-send:2185,2187 · .fdb-cm-locked:2188 · .pi-overlay:2191 · .pi-box:2195,2200,2201,2205(+2) · .pi-close:2207,2212,2213 · .pi-close-left:2215
.pi-portrait:2217 · .pi-dress-btn:2224,2228,2229 · .pi-shape-cap:2230,2233,2234,2235 · .greet-card:2242 · .greet-sub:2243 · .greet-grid:2244
.greet-opt:2245,2248,2249,2250 · .greet-e:2251 · .pi-streak:2255 · .pi-streak-head:2257,2259 · .pi-streak-best:2260 · .pi-dots:2261
.pi-dot:2263,2264,2265 · .pi-streak-note:2266 · .pi-care-title:2267 · .lbf-overlay:2270 · .lbf-box:2273 · .lbf-head:2278
.lbf-title:2279 · .lbf-tabs:2280,2283 · .lbf-close:2286 · .lbf-close-l:2287 · .lbf-body:2288 · .lbf-grid:2289
.lbf-cell:2291,2294,2295,2296(+2) · .lbf-podium:2300 · .pod:2302,2329,2330 · .pod-char:2304 · .pod-base:2306 · .pod-rank:2308
.pod-label:2310,3906 · .pod-name:2312 · .pod-sc:2314 · .pod-1:2319,2320 · .pod-2:2321,2322 · .pod-3:2323,2324
.pod-4:2325,2326 · .pod-5:2327,2328 · .pl-wide:2347,2350,2351,2352(+8) · .pl-follow:2353,2358,2360 · .pl-unfollow:2362,2368,2369 · .pl-followers:2370
.pl-cols:2371 · .pl-col:2372 · .pl-sec-title:2373 · .pl-feed:2374,2377,2384 · .pl-feed-row:2378,2382,2383 · .pl-assets-wrap:2386,3744,3819
.pl-assets:2387,3747,3752,3758(+4) · .pl-asset:2390,2394,2401 · .pl-asset-emoji:2395 · .pl-asset-n:2396 · .pl-pets-wrap:2403 · .pl-pets:2404
.pl-pet:2405,2410,2412 · .pl-pet-nm:2413 · .img-lightbox:2416,2421,2422,2426(+3) · .pl-chat:2439,2444 · .pl-call:2446,2452 · .pet-peek:2453,2454
.pp-chips:2456 · .pp-chip:2457 · .pp-gift:2462,2468 · .settings-box:2470,2471,2540,2545(+20) · .set-feed-head:2472 · .set-feed-sub:2476
.set-feed-row:2477 · .pillinfo-val:2482 · .pillinfo-desc:2487,2506 · .pillinfo-box:2498 · .plf-head:2501 · .plf-emoji:2502
.plf-ht:2503,2504,2505 · .plf-foot:2507 · .alert-box:2512,2514 · .ab-emoji:2515 · .ab-title:2516 · .ab-desc:2517
.ab-btns:2518,2519,2520 · .heal-heart:2522 · .attn-box:2537 · .help-box:2569,2570,2571 · .wl-box:2592 · .food-box:2593
.home-shop-box:2595 · .summary-box:2596 · .report-box:2597 · .wl-grid:2600 · .tc-wrap:2602 · .spell-btn:2608,2613
.sp-hud:2614 · .sp-word:2616 · .sp-ch:2617,2622 · .sp-th:2624 · .sp-hint:2626 · .sp-exit:2629,2633
.sp-banner:2634 · .sp-big:2639 · .sp-thb:2641 · .sp-coin:2642 · #spell-confetti:2647 · .sp-rb:2648
.sp-day:2658 · .sp-perfect:2660 · .sp-late:2662 · #spell-coinpop:2665 · .side-sub:2774,2776 · .sec-quest:2781
.on-page:2792,2793,2794,2795 · .inbox-overlay:2805 · .ib-box:2807 · .ib-head:2811 · .ib-close:2815,2817 · .ib-list:2818,2819
.ib-row:2820,2821,2822,2823 · .ib-ava:2824 · .ib-on:2828 · .ib-mid:2830 · .ib-name:2831 · .ib-last:2832
.ib-meta:2833 · .ib-time:2834 · .ib-dot:2836 · .ib-story-badge:2839 · .ib-empty:2843 · .ib-story:2845,2847
.ib-story-item:2848,2850,2857 · .ib-story-ava:2851 · .ib-story-on:2855 · .ib-world:2860,2863 · .ib-tabs:2865 · .ib-tab:2866,2869,2871
.ib-tab-dot:2872 · .ib-call-ava:2876 · .ib-call-row:2877,2878 · #btn-music:2884,2887,2888 · #ws-overlay:2903 · #ws-board:2906,2912,2914
.ws-head:2917 · .ws-title:2918 · .ws-findbar:2921 · .ws-tip:2922 · .ws-grade:2924,2925 · .ws-body:2928
.ws-gridwrap:2929 · #ws-grid:2932 · .ws-cell:2937,2942,2945,2948(+2) · .ws-flash:2954,2956 · .ws-coinpop:2960,2984 · .ws-combo:2971,2975,2976,2977
.ws-find:2988 · #ws-prog:2989 · #ws-words:2993,2997 · .ws-word:2999,3004,3005,3006(+2) · .ws-actions:3012,3013,3022 · .ws-sizes:3017
.ws-sizes-lb:3019 · .ws-size-now:3020 · #ws-new:3023 · #ws-stash:3024 · #ws-clear:3025 · #ws-win:3026,3028
.ws-win-in:3029,3032 · .sec-online:3055 · .rank-tab:3083,3084,3085,3086(+2) · .pet-show-bg:3113,3116,3120,3124(+14) · .pet-show:3175,3178,3190,3192(+15) · .ps-video:3311
.id-card:3365,3371,3375 · .id-chip:3388 · .clock-chip:3397,3398 · .coin-group:3413 · .cp-lb:3435 · .cp-v:3436
.top-flex2:3552 · #panel-factory:3571,3572,3576,3577(+39) · .grid2x8:3700,3706 · .mine-strip:3724,3726,3727,3732(+4) · .mb-strip:3738,3777 · .gmark:3884,3888,3889,3890(+1)
.gm-stack:3893,3897 · .gm-row:3899 · .lb-name:3901,3902,3903 · .coin-stack:3917 · .grade-line:3921,3928,3929

## css/style.css (1,799 บรรทัด · 463 selector)
:root:5 · *:15 · html:16,21 · input:25 · body:29 · #app:35
.screen:38,39 · h1:42 · .subtitle:43 · .egg-grid:46,63 · .egg-card:47,52,53,54(+2) · .pet-price:57,61
.egg:65,71,75 · .d1:76 · .basket:79,80,85,91(+5) · .basket-dog:89,102,103,104 · .basket-cat:90,105,106,107 · .egg-dragon:110
.topbar:125 · .topbar-coins:126 · .coin-pill:127,138,142,147(+2) · .coin-ic:134 · .no-anim:148,563,1472,1756(+2) · .net-coin:150
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
.mkt-listhead:1649 · .mkt-group-head:1651,1657 · .mkt-two-col:1659,1660,1664,1667(+8) · #phone-card:1665,1672 · #computer-card:1666,1673 · .mkt-listing:1694
.ml-cancel:1698 · .mkt-sold:1704,1705,1706 · .list-dialog:1713,1714,1719 · .list-hint:1718 · .collect-reveal-frame:1722,1729 · .collect-reveal-img:1728
.collect-reveal-stars:1730 · .craft-box:1733 · .craft-head:1734 · .craft-bar:1735 · .craft-fill:1736 · .craft-text:1737
.craft-btn-row:1738,1739 · .craft-go-btn:1741,1747,1748,1751 · .craft-cancel:1759,1763 · .mkt-catalog:1766,1767,1768 · .mkt-pager:1771 · .pg-btn:1772,1776,1777
.pg-mid:1778 · .pg-dots:1779 · .pg-dot:1780,1781 · .order-head:1782 · .order-row:1783,1788,1790,1792 · .order-deliver:1793,1798
.order-need:1799
