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

## js/adventure3d.js (11,116 บรรทัด · 554 รายการ)
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
- 1585-1599 🌅 ท้องฟ้าภาพจริง (รอบ 203) — ใส่ภาพ panorama 360° (equirectangular 2:1) เป็นฉากหลังท้องฟ้า
- 1600-1948 🧱 เทกซ์เจอร์ภาพจริง (รอบ 323) — วางไฟล์ `img/tex/<key>.jpg` (หรือ .png) แล้วแปะทับพื้นผิวทันที
- 1949-1987 🏨 โรงแรมผีสิง (รอบ 684) — ตัวตึก 5 ชั้นสร้างใน js/hotel3d.js
- 1988-2106 ตัวอักษรในโลก (8.2)
- 2107-2161 🔠🪙 เก็บตัวอักษร 1 ตัว = ได้ 1 เหรียญ (รอบ 345)
- 2162-2221 ประกอบคำอัตโนมัติเมื่อมีตัวอักษรครบ (8.1/8.4)
- 2222-2316 โหมด adv: monsters ยิงสู้ได้ (สเปกเดิม 8.5)
- 2317-2511 👻 ผีในโรงแรม (รอบ 684 — เขียนใหม่ทั้งชุด · ผู้ใช้สั่งข้อ 10-13, 18)
- 2512-2751 🏨 ระบบโรงแรมผีสิง (รอบ 684) — เดินขึ้นชั้น/ไฟดับ/ไฟฉาย/ตู้เสื้อผ้า/รูปตามอง
- 2752-2965 เสียงหลอนโหมดผีสิง — สังเคราะห์ Web Audio (ปลอดลิขสิทธิ์ 100%)
- 2966-3290 Multiplayer — ผู้เล่นอื่นใน map เดียวกัน (สไตล์ Roblox)
- 3291-3490 Voice chat ใน map — WebRTC P2P mesh (เสียงวิ่งตรงระหว่างเครื่อง)
- 3491-3577 🏁 พิธีประกาศแชมป์ (ครูกด "จบรอบแข่ง") — /class/<map>/podium
- 3578-3783 HUD
- 3784-4407 DOM overlay + CSS (สร้างครั้งเดียว — self-contained ไม่แตะ style.css)
- 4408-4538 Input — เมาส์+คีย์บอร์ด และจอสัมผัส (มือถือ landscape)
- 4539-4543 🚁 โหมดเฮลิคอปเตอร์ Bell — ฟิสิกส์บินแบบอาร์เคด (สไตล์ Helicopter Flight Pilot)
- 4544-4935 🛸 โดรน FPV (โหมด drone) — บินเร็ว/คล่อง ลอดหน้าต่างเข้าตึกร้าง เก็บตัวอักษรในห้อง
- 4936-5058 🚗 โหมดขับรถเมืองกำแพงเพชร — ฟิสิกส์รถอาร์เคด (bicycle model)
- 5059-5152 🚦 รอบ 133: ไฟจราจรจริงที่ทางแยกใหญ่ + ฝ่าไฟแดงโดนใบสั่ง ม.22
- 5153-5580 🧭 GPS นำทาง (โหมด drive) — เลือกตัวอักษรเป้าหมาย + เส้นทางตามถนนจริง (A*) + เสียงอังกฤษเลี้ยว
- 5581-5639 🎛️ เข็มหน้าปัดวิ่งจริง (สปีด 0-180 + วัดรอบ 0-8×1000) — วาดทับวงเกจของภาพ dash.png
- 5640-5724 🎵 รอบ 181: วิทยุในรถ — จอ head-unit กลางคอนโซล (visualizer + เลือกเพลง 3 โหมด)
- 5725-5852 🪆 รอบ 191: ตุ๊กตาดุ๊กดิ๊กหน้ารถ — รูปตัวละครที่ผู้เล่นเลือก (blkN.png)
- 5853-6156 🚔 รอบ 128: แผงเตรียมออกรถ + กฎหมายจราจร + ใบสั่ง
- 6157-6199 🛩️📦 ภารกิจไปรษณีย์กลางคืน (รอบ 353) — เฉพาะช่วงฟ้ามืด (heliNight>.5)
- 6200-7387 🚶🛗🚁🪂 โหมดเดินเท้าในเมืองเฮลิฯ (รอบ 354 — ผู้ใช้สั่ง)
- 7388-7461 🎛️ หน้าปัดเข็มขยับจริง (รอบ 61) — วาดสดทุกเฟรมจากค่าการบินจริง
- 7462-7731 🌧️☀️ ชั้นบนกระจก: ที่ปัดน้ำฝน + แสงแดดสาด (รอบ 346)
- 7732-8136 🔊🌧️ เสียงที่ปัดน้ำฝน (รอบ 537) — สังเคราะห์ล้วน ไม่มีไฟล์เสียง
- 8137-8206 📹 กล้องใต้ท้องเครื่อง (belly cam) — รอบ 348
- 8207-8278 🎯 วงเป้าลงจอด (รอบ 349) — ไฮไลต์ดาดฟ้าที่มีตัวอักษร ให้รู้ว่าควรร่อนลงตรงไหน
- 8279-8894 📏 แถบเตือนความเร็วดิ่ง (รอบ 349) — ลงเร็วเกินกรอบกล้องกะพริบแดง สอนให้ร่อนลงนุ่มๆ
- 8895-8897 Loop หลัก
- 8898-10124 ⚽ โหมดสนามฟุตบอล — ฟิสิกส์บอล + เล็ง + ชาร์จพลัง + กล้อง 1st/3rd + ชุดนักเตะ
- 10125-10577 🤖 โหมดหุ่นยนต์นักรบ — เดินยิงเอเลี่ยนตัวอักษร (ต้องยิงเรียงลำดับในคำ)
- 10578-10590 เข้า/ออกโลก
- 10591-11116 ❓ การ์ด "วิธีเล่น" ตอนเข้าโลกครั้งแรก (จำแยกต่อโลกใน localStorage — ไม่แตะ state.js)
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
makeNameSprite:1272 · flatGeom:1285 · flatGeomUV:1294 · buildDriveCity:1304 · SKY_IMG:1590 · applySky:1591
applyTex:1606 · buildScene:1629 · randPos:1991 · randRoadPos:1999 · hotelSpot:2012 · spawnLetter:2021
spawnLettersForWord:2058 · ensureCoverage:2060 · relocateLetters:2073 · removeLetter:2101 · LETTER_COIN:2112 · pickUpLetter:2113
letterPop:2127 · letterChime:2145 · tryCompleteWords:2165 · completeWord:2179 · spawnMonster:2225 · killMonster:2234
tickMonsters:2242 · damagePlayer:2264 · shoot:2280 · tickShots:2294 · makeGhostSprite:2325 · spawnGhost:2330
GHOST_STYLE:2339 · GHOST_H_DEFAULT:2340 · applyGhostSize:2341 · ghostGoLurk:2351 · ghostGoStalk:2363 · ghostGoBehind:2376
tickGhosts:2383 · sessionRecapHtml:2446 · hauntRunSec:2453 · fmtSurv:2454 · hauntSurviveFinish:2455 · tickSurvive:2465
renderHearts:2479 · hotelScare:2485 · knockedOut:2505 · BLACKOUT_MS:2525 · FLICKER_MS:2526 · DARK_LETTER:2529
tintSprite:2530 · hotelReset:2533 · setTorch:2557 · toggleTorch:2573 · tickTorch:2578 · hotelBlackout:2588
hotelFlicker:2604 · tickHotelPlayer:2616 · tickHotelWorld:2668 · hotelAct:2710 · openWardrobe:2727 · announceTarget:2745
netReady:2971 · netJoin:2977 · sendPos:2997 · sendChat:3039 · toggleChatBox:3053 · onPeerData:3064
disposeHeliMesh:3152 · removePeer:3157 · netLeave:3172 · tickPeers:3178 · RTC_CFG:3299 · tinvLinked:3300
partyWord:3307 · syncPartyWord:3320 · updateVoiceBtns:3472 · PODIUM_BONUS:3497 · podiumJoin:3499 · podiumLeave:3510
endRound:3511 · showPodium:3522 · tinvCheck:3562 · showBanner:3582 · renderHudTop:3588 · renderHudWords:3593
renderHudInv:3603 · ddTierFromName:3610 · renderBoard:3612 · drawBigMap:3649 · openBigMap:3704 · closeBigMap:3712
drawMinimap:3717 · loadCarDash:3789 · loadCarWheel:3801 · buildDom:3811 · confirmExit:4392 · IS_TOUCH:4411
bindInput:4412 · movePlayer:4504 · tickPlayer:4514 · collideDrone:4547 · propStall:4566 · propBreak:4573
propFix:4580 · droneBatAdd:4587 · lightningBolt:4590 · startRain:4601 · stopRain:4615 · smashGlass:4617
awardGlass:4628 · neededLetter:4645 · openDoor:4660 · raceStartRun:4680 · raceStop:4687 · gateHighlight:4705
renderRaceHud:4712 · tickDrone:4721 · nearMissTick:4863 · showNearMiss:4887 · awardDaredevil:4898 · comboCheer:4915
comboFlash:4931 · driveCell:4940 · nearestStreet:4946 · collideCar:4956 · tlDotY:4987 · tlSet:4991
driveArms:5008 · tlTick:5020 · TL_GREEN:5064 · tlRedDur:5066 · tlightPhase:5067 · buildTrafficLights:5074
rlTick:5126 · cellDrivable:5158 · cellCenter:5159 · losClear:5161 · nearestDrivableCell:5171 · routeGrid:5180
pickGpsTarget:5233 · gpsSpeak:5245 · NAVLINE_W:5264 · navLineEnsure:5265 · navLineHide:5275 · navLineUpdate:5276
tickGps:5303 · tickDrive:5379 · drawCarDial:5587 · drawCarGauges:5617 · RADIO_RECT:5645 · CAR_RADIO_RECT:5647
carRadioRect:5653 · radioLayout:5655 · radioSetHint:5678 · renderRadioList:5684 · radioToggleList:5694 · drawRadioViz:5699
radioTick:5717 · BOBBLE_FOOT:5730 · BOBBLE_H:5731 · BOBBLE_ASPECT:5732 · BOB_OMEGA:5735 · BOB_PITCH_FORCE:5737
BOBBLE_SKINS:5739 · bobbleSetAvatar:5746 · bobbleLayout:5753 · bobbleTick:5766 · bobblePoke:5791 · bobbleApplySkin:5808
dollOwned:5818 · openDollPicker:5819 · carStartShow:5856 · showLawInfo:5874 · lawNotice:5896 · driveFineSettle:5906
HELI_PHASES:6085 · heliStartPhase:6092 · heliFloorAt:6099 · SOFT_TIERS:6109 · softLandBonus:6111 · awardPerfLand:6124
setHeliLight:6143 · MAIL_COIN:6162 · mailStart:6164 · mailStop:6187 · mailTick:6188 · FOOT_EYE:6207
doorSlideSfx:6213 · doorLerp:6236 · entLerp:6244 · footStepSfx:6254 · WRING_COIN:6275 · festivalPaint:6279
dustTexture:6291 · dustBurst:6300 · dustTick:6314 · HELI_GLB_URL:6335 · HELI_GLB_TEX_BLUE:6337 · HELI_GLB_ROTOR:6339
HELI_GLB_TROTOR:6340 · heliGlbEnsure:6342 · heliMatBlueGet:6360 · heliGlbAssemble:6373 · heliNavTick:6412 · peerRotorStop:6419
peerRotorTick:6425 · heliCrashSfx:6444 · heliMeshBuild:6472 · heliMeshBuildLegacy:6483 · buildHeliFoot:6613 · footFloorAt:6729
insideTerm:6736 · inDoorZone:6737 · footHint:6741 · setFootBtns:6742 · liftStart:6747 · beginRide:6758
endRide:6781 · beginWing:6792 · awardAirLetter:6805 · paxChoiceShow:6824 · paxChoiceHide:6850 · pilotShipMesh:6854
beginPilot:6855 · endPilot:6887 · drawCabinWindow:6911 · tickHeliFoot:6935 · tickHeli:7144 · CP_NAT:7396
CP_GAUGES:7397 · SEAT_LABEL:7410 · SEAT_P_FULL:7411 · SEAT_ZOOM:7412 · DASH_OFF_Y:7413 · DASH_DROP:7414
setSeat:7416 · layoutCockpit:7428 · WIPER:7467 · WIPER_SPD:7470 · WIPER_LABEL:7471 · INT_GAP:7472
WASH_MS:7476 · WASH_TANK_MAX:7480 · SMEAR_LIFE:7492 · CHOP_MIN:7493 · SUN_RAY_FAR:7497 · sunRayBlocked:7499
sunShadeTick:7518 · applyCockpitShade:7529 · rotorChop:7541 · sunUpdate:7549 · HELI_FOG_N0:7560 · fogUpdate:7564
adGlowPulse:7610 · RAIN_MAX:7619 · VISOR_Y:7620 · RAIN_MIN:7621 · RAIN_DUR:7622 · DROP_ZONE:7626
addDrop:7627 · tickDrops:7635 · addWashDrop:7653 · washStart:7660 · renderWashGauge:7680 · washTick:7691
grimeTick:7708 · WIPE_R:7715 · wipeDrops:7716 · wiperSndOn:7739 · wiperSndOff:7751 · wiperThunk:7757
washSpraySfx:7769 · wiperSqueak:7786 · wiperSndTick:7803 · setWiper:7823 · tickWiper:7835 · SH_SWEEP:7866
shadowSweepTick:7868 · REFL_MAX:7880 · REFL_COL:7882 · cityGlowLevel:7883 · drawCityGlow:7888 · setVisor:7920
rainTick:7926 · drawBlade:7943 · drawSmears:7962 · drawGlass:7982 · drawBellyCam:8144 · drawBellyHud:8167
drawLandingTargets:8213 · VS_HARD:8283 · drawDescentBar:8284 · heliShake:8333 · cpNeedle:8344 · drawGauges:8361
XF_START:8409 · PRELOAD_WAIT:8410 · ALT_QUIET_FROM:8412 · ALT_MAX_DAMP:8413 · ALT_LP_MIN:8414 · ECHO_NEAR:8415
WIND_FULL_SPD:8416 · SHUTDOWN_SEC:8417 · PAN_MAX:8419 · OD_RPM:8420 · SHAKE_RPM:8421 · SHAKE_HIT:8422
soccerLetterPos:8902 · letterNeeded:8910 · soccerNeededSet:8915 · soccerTileGeo:8921 · soccerGoldTexture:8923 · makeSoccerTile:8940
soccerRefreshSkins:8949 · soccerBuildTargets:8956 · soccerNextTile:8966 · soccerRetarget:8979 · soccerCoinPop:8991 · soccerGrassTexture:9004
soccerTurfGrade:9026 · soccerTurfTexture:9049 · grassNormalTexture:9068 · soccerLinesTexture:9097 · soccerNetTexture:9148 · soccerCrowdTexture:9156
soccerBallMat:9175 · buildSoccerGoal:9195 · buildStands:9214 · soccerLedBoards:9249 · soccerGKEnsure:9346 · soccerGKTick:9362
fkBuildWall:9391 · fkToggle:9406 · fkHitTest:9422 · pkHud:9441 · pkStart:9450 · pkEnd:9464
pkTick:9479 · repQualify:9486 · repEnsureEl:9489 · repStart:9500 · repTick:9507 · soccerNumTex:9532
makeSoccerPlayer:9542 · soccerNewSpot:9568 · soccerResetBall:9580 · soccerKick:9587 · soccerCheer:9604 · guideTexture:9607
auraActive:9631 · auraLeftMs:9632 · buildAura:9634 · auraBuy:9655 · auraRender:9665 · auraTick:9679
buildDrill:9699 · drillTick:9712 · buildLandRing:9749 · buildGuideRibbon:9759 · renderSpinPad:9784 · spinPadToggle:9796
spinPadPick:9802 · renderCurl:9814 · kickLaunch:9825 · updateSoccerGuide:9833 · soccerCamera:9897 · tickSoccer:9918
soccerKitShow:10098 · soccerKitGo:10113 · emojiSprite:10166 · makeAlien:10171 · startWave:10204 · waveSpawnFill:10215
waveComplete:10224 · updateWaveHud:10234 · checkMechaBossBadge:10236 · alienSpawnPos:10245 · removeAlien:10250 · mechaHudWord:10255
setMechaHudSkin:10263 · mechaComboPop:10275 · mechaShielded:10280 · mechaDamageFx:10282 · mechaHitByAlien:10287 · spawnAlienShot:10293
removeAlienShot:10303 · tickAlienShots:10308 · spawnPowerup:10320 · removePowerup:10333 · collectPowerup:10338 · tickPowerups:10345
updateMechaHud:10354 · mechaTracer:10394 · mechaFire:10403 · explodeAlien:10440 · tickMecha:10470 · loop:10526
grabShot:10558 · savePhoto:10569 · clearEntities:10581 · INTRO_KEY:10595 · introSeenObj:10596 · introSeen:10597
markIntroSeen:10598 · INTRO:10599 · showIntro:10600 · closeIntro:10625 · beginPlay:10631 · start:10633
exitWorld:10829 · mechaRecapLine:10898

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

## js/dictband.js (362 บรรทัด · 25 รายการ)
BAND_EMOJI:12 · BAND_SET_REWARD:13 · BAND_DONE_BONUS:14 · bandLoad:18 · bandShortTH:36 · bandCat:44
bandSets:66 · bandSetId:75 · bandCheckComplete:78 · bandSetCat:92 · BAND_RETAKE_MAX:104 · bandTriedSets:105
bandRetakeCat:116 · bandShowRetakeSummary:150 · bandSetsPassed:178 · openBandSetPicker:186 · bandMine:257 · bandUnlocked:258
bandLockToast:263 · bandExamLobby:269 · updateBandExamBtn:278 · bandLobbyTick:295 · bandPlay:306 · bandPlayLobby:319
bandCardsHTML:331

## js/game.js (1,017 บรรทัด · 70 รายการ)
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

## js/hotel3d.js (718 บรรทัด · 35 รายการ)
TEX:25 · FLOOR_H:28 · WEST:31 · SHAFT_E:32 · CORE_E:33 · RZ0:34
LZ0:35 · ROOM_N:36 · DOOR_W:39 · ENTRY_HW:40 · PLAYER_R:41 · floorY:42
Acc:49 · accBox:50 · accGeo:66 · accMesh:74 · makeMats:85 · PORTRAIT_SKIN:118
PORTRAIT_CLOTH:119 · portraitTexture:120 · signTexture:159 · build:173 · inRect:573 · insideHotel:574
surfaceY:577 · collide:595 · roomAt:615 · floorOf:623 · setLights:628 · EYE_X0:641
tick:642 · nearWardrobe:689 · inLift:700 · atLiftDoor:704 · randomHaunt:708

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

## js/netroom.js (807 บรรทัด · 19 รายการ)
CFG:41 · roomsAllowed:63 · HOT_KEYS:71 · COLD_KEYS:72 · HOT_BACK:73 · splitPayload:77
mergeBack:88 · metUids:100 · AIM_TTL_MS:119 · aimAt:121 · aimGet:125 · aimClear:129
MAPS3D:135 · whereFriends:136 · dbOf:160 · envReady:161 · isDenied:164 · create:176
drawBudget:780

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

## js/state.js (1,096 บรรทัด · 87 รายการ)
STORAGE_KEY:6 · QUIZ_PASS_REWARD:11 · CURE_COST:13 · HUNGRY_SICK_MS:14 · MEAL_HOUR:16 · MEAL_FULL:17
SLEEP_FROM_HOUR:18 · SLEEP_SICK_HOUR:19 · WAKE_HOUR:20 · DINNER_COST:21 · TOXIN_FULL:23 · DETOX_COST:24
FOODQUIZ_Q:26 · FOODQUIZ_COIN:27 · FOODQUIZ_BONUS:28 · SHAPE_JUNK_MEALS:30 · SHAPE_CLEAN_MEALS:31 · SHAPE_MISS_MEALS:32
SHAPE_EXP_BONUS:33 · HEAT_SICK_MS:34 · THIRST_SICK_MS:35 · DEFAULT_STATE:37 · FEED_CATS:188 · SLOT_MS:199
currentSlotStart:200 · nextSlotStart:206 · mealDayKey:208 · nightKeyOf:210 · isNightNow:218 · newPet:223
loadState:247 · saveState:513 · activePet:520 · petStage:521 · isAdult:526 · abilityOn:527
hasPetType:528 · todayStr:531 · dailyTick:535 · addCoins:538 · QUEST_POOL:558 · QUEST_PER_DAY:568
questsToday:569 · questTick:576 · questEvent:580 · assetValue:616 · netWorth:642 · assetCount:644
refreshRank:661 · heatProtected:677 · rainProtected:681 · petHungry:684 · petShapeOf:688 · updatePetShape:694
shapeMealDone:701 · heatPct:711 · ymStr:720 · billOutstanding:724 · UTILITIES:731 · HOME_UTILITIES:737
homeDecayed:739 · billTick:742 · PET_FOOD_PER_PET:814 · petFoodTick:815 · myCar:841 · carLoanDue:846
carLoanOverdue:851 · carLoanPayable:856 · carLoanPay:863 · compTick:876 · ONLINE_RATE:890 · onlineEarnActive:891
onlineEarnTick:895 · onlineEarnFlush:906 · marketTick:916 · addCraft:940 · ORDER_MAX:959 · ORDER_LIFE_MS:960
ORDER_GAP_MIN_MS:961 · ORDER_GAP_SPAN_MS:962 · ORDER_TIER_WEIGHT:963 · newOrder:964 · orderTick:977 · careTick:985
expNeed:1067 · addExp:1072 · addRP:1092

## js/tpaward.js (41 บรรทัด · 0 รายการ)

## js/typing.js (369 บรรทัด · 0 รายการ)

## js/ui.js (8,462 บรรทัด · 329 รายการ)
### 🗂️ สารบัญโซน js/ui.js (Read/Edit เฉพาะช่วง)
- 2-77 UI: Dashboard / ร้านค้า / ที่พัก / ร้านสัตว์เลี้ยง / แรงค์ / สถิติ
- 78-305 🎬 เวทีน้องน่ารัก (Cute Pet Show) — รอบ 604 (ผู้ใช้สั่ง 26 ก.ค. 2026)
- 306-590 🆕 New Word (รอบ 116): คำศัพท์ใหม่ 1 คำ/การ login ตามระดับชั้น
- 591-613 นาฬิกาใต้ชื่อผู้เล่น (วัน · วันที่ · เวลา อัปเดตทุกวินาที)
- 614-666 ข้าวเย็นของผู้เล่น (คิว 7725691507 ข้อ 6)
- 667-698 แถบฝนประจำวัน: นับถอยหลังถึง 19:00 ทุกวัน (ฝนตก 1 ชม.)
- 699-743 เอฟเฟกต์ฝนเต็มจอ (รอบยี่สิบ): ฝนตกจริง (19:00-20:00) + ไม่มีบ้านสภาพดี
- 744-764 การ์ด "คนที่กำลังทำการบ้านไปพร้อมๆ กับเรา"
- 765-819 รอบ 149: กล่อง aside ขวาเลื่อนวนอัตโนมัติ (ล่าง→บน) ไม่มี scrollbar
- 820-1159 Daily Quest (item 3): การ์ดภารกิจวันนี้ใน aside ขวา
- 1160-1252 รอบ 153: เมนูลัดแตะแถวเพื่อนออนไลน์ในกล่อง aside
- 1253-1745 การ์ด Leaderboard — สลับแท็บในการ์ดเดียว (ประหยัดพื้นที่):
- 1746-2057 การ์ดข้อมูลผู้เล่น 👤 — คลิกชื่อในการ์ดเพื่อน/กระดาน แล้วโชว์
- 2058-2282 แผงเพื่อน 👥 (ข้อ 0.3): รหัสเพื่อน + ค้นหา + คำขอ + รายชื่อเพื่อน
- 2283-2378 🌍 เพื่อนอยู่โลก 3D ไหน + ปุ่ม "ตามเข้าไป" (รอบ 642)
- 2379-2417 แชทกับเพื่อน (ข้อ 0.4) — กล่องแชทลอยกลางจอ + แผง emoji
- 2418-2814 รอบ 179: หน้ารวมข้อความ (inbox แบบ Messenger — ธีมกระจกฟ้า sci-fi ของเกม)
- 2815-3161 ระบบส่งของขวัญ (ข้อ 0.5) — ห้องของขวัญ + กล่องเลือกส่ง + ฉากเปิด
- 3162-3246 RANK CARD + ฉากเลื่อนแรงค์
- 3247-3249 PET DASHBOARD
- 3250-3373 📰 รอบ 155: overlay ข้อมูลน้อง & การดูแล + ฟีดกิจกรรมเพื่อน
- 3374-3582 🌍 รอบ 639: หน้า Feed เต็มจอ — ทุกคน (ไม่ใช่แค่ follow) + ไลก์/คอมเมนต์
- 3583-4233 📖 Dictionary ค้นหาคำศัพท์ (รอบ 254 ผู้ใช้สั่ง 16 ก.ค. 2026)
- 4234-4277 การนอน (คิว 7725691507 ข้อ 1)
- 4278-4656 ให้อาหาร (ระบบมื้อเย็น 18:00 + ความอิ่มสะสม — ข้อ 2+3)
- 4657-4738 🛡️ ควิซอาหารปลอดภัย (ต่อยอดข้อ 5.1)
- 4739-4824 🎀 ห้องแต่งตัวสัตว์เลี้ยง (รอบ 635: แยกออกจาก "ร้านค้า" เดิม —
- 4825-5012 ที่พัก (หลบแดด/หลบฝน) + เครื่องปรับอากาศ
- 5013-5130 บิลสาธารณูปโภค (ค่าไฟ/ค่าน้ำ — เครื่องยนต์อยู่ใน state.js: UTILITIES/billTick)
- 5131-5213 การ์ดมือถือ (ข้อ 7): ซื้อ 10,000 ขายคืน 6,000
- 5214-5224 การ์ดคอมพิวเตอร์ (ข้อ 11): ซื้อ 50,000 ขายคืน 30,000
- 5225-5380 item 8: โบนัสออนไลน์ +0.01 เหรียญ/วิ ฟรีทุกคนที่เปิดเกมออนไลน์อยู่
- 5381-5597 🎫 การ์ดตั๋วโลกผจญภัย (คิว 7725691507 ข้อ 7)
- 5598-5680 🎃 การ์ดตั๋วโลกผีสิงกลางคืน (ต่อยอดข้อ 8 · ผู้ใช้เคาะ 7 ก.ค.)
- 5681-5784 🚁 การ์ดตั๋วโลกเฮลิคอปเตอร์ Bell (รอบ 52)
- 5785-5884 🛸 การ์ดตั๋วโลกโดรน FPV Racing (รอบ 85) — ซื้อได้เมื่อมีตั๋วเฮลิคอปเตอร์
- 5885-6075 🚗 การ์ดตั๋วโลกขับรถกำแพงเพชร (รอบ 113) — ซื้อได้เมื่อมีตั๋วโดรน FPV
- 6076-6168 ⚽ การ์ดตั๋วโลกสนามฟุตบอล (รอบ 196) — ซื้อได้เมื่อมีตั๋วขับรถ
- 6169-6264 🏍️ การ์ดตั๋วโลกมอเตอร์ไซค์บ้านโพธิ์สวัสดิ์ (รอบ 293) — ซื้อได้เมื่อมีตั๋วขับรถ
- 6265-6362 🛸 การ์ดตั๋วโลก "ยานแม่บุกโลก" (Invasion · รอบ 413)
- 6363-6407 🌍 ปุ่มลัดเข้าโลก 3D ในรางเมนูซ้าย (ผู้ใช้สั่ง 9 ก.ค. 2026)
- 6408-6553 🧭 ป้ายบอกทางของรางเมนูซ้าย (รอบ 601 · ผู้ใช้สั่ง 26 ก.ค. 2026)
- 6554-6723 การ์ดสวนผลไม้ (ข้อ 12): ซื้อต้นไม้ปลูกได้ไม่จำกัด แต่ละต้นออกผล
- 6724-6733 โรงงานผลิตสินค้า 🏭 + ตลาดขายต่อ (แนวคิดใหม่ 5 ก.ค. 2026)
- 6734-6756 โรงงานผลิต (แผง 🏭) — แยกออกจากตลาด (ผู้ใช้สั่ง 6 ก.ค. 2026)
- 6757-6907 ตลาดขายสินค้า (แผง 🏪) — แยกออกจากโรงงาน
- 6908-7819 🚗 รอบ 131: หมวดยานพาหนะ — โชว์รูมรถ 10 คัน (แคตตาล็อก 5 ช่อง/แถว)
- 7820-7880 ร้านสัตว์เลี้ยง (ซื้อเพิ่มได้ ไม่ลบตัวเดิม)
- 7881-7917 เลเวลอัพ (รายตัว)
- 7918-8023 สถิติผลการเรียนรู้
- 8024-8061 item 4: การ์ดสรุปส่งครู — ใบเดียวจบ ชื่อ/วัน-เวลา/เหรียญวันนี้/แรงค์/สอบล่าสุด
- 8062-8462 📞 หน้าจอโทรหาเพื่อน — สายเสียง (รอบ 625 · กลุ่ม 3 คน + ปิดวิดีโอ รอบ 631)
### รายการ js/ui.js
startHTML:10 · PET_ANIM:30 · petAnimHTML:35 · petVisualHTML:50 · PET_SHOW:91 · PET_SHOW_STAGE:96
PET_SHOW_H:99 · petShowBgHTML:102 · petClipHint:145 · __clipReady:157 · petShowHTML:165 · lobbyBlk:228
caretakerFigureHTML:234 · footAlign:244 · heroRankBgHTML:278 · NEW_WORD_MS:312 · newWordNext:318 · renderNewWord:329
alignNewWord:364 · startNewWordTimer:375 · nwCountdownTick:392 · PAT_REMIND_HOUR:408 · patRemindTick:409 · applyPatRemindGlow:430
NEW_WORD_COIN:445 · NW_DAILY_GOAL:446 · NW_DAILY_BONUS:447 · newWordReward:448 · nwDailyTick:471 · coinFlyFx:490
nwDailyBarHTML:523 · showNewWordPopup:534 · renamePet:561 · mealLabel:578 · fmtMins:585 · renderClock:594
dinnerDue:619 · renderDinnerChip:624 · dinnerClick:635 · renderRainBar:670 · rainFxTick:703 · RAIN_DROP_IMGS:720
rainFxDrop:721 · selfPronoun:751 · selfTag:756 · idTag:760 · SIDE_SCROLL_SPEED:770 · SIDE_SCROLL_RESUME:771
initSideScroll:774 · sideScrollTick:802 · QUEST_FLASH_HOLD:826 · QUEST_DECK_FLIP_MS:833 · questGo:836 · SIDE_TALL_MIN:848
sideIsTall:849 · qDeckDraw:854 · qDeckNext:877 · renderQuestCard:891 · sideFlashRows:929 · FRIEND_FLASH_GRACE:947
ONLINE_FLIP_MS:955 · ONLINE_FLIP_RESUME:956 · ONLINE_SWIPE_STEP:957 · ONLINE_ROW_H:964 · onPerPage:967 · onChunk:973
ONLINE_GAP_MAX:983 · onPageSpread:984 · onPageDraw:993 · onPageFlip:1004 · bindOnlinePager:1015 · renderOnlineCard:1050
bindInviteCards:1167 · bindFriendQuickMenu:1187 · openFriendQuickMenu:1197 · LB_TABS:1260 · LB_WS_TOP:1261 · LB_TP_TOP:1262
bindLbTabs:1264 · updateRankRailBadge:1293 · rankUpCheck:1312 · rankUpSound:1340 · renderLeaderboardCard:1351 · bindLbGroupOpen:1378
lbRankRows:1390 · LB_BCAT_TOP:1431 · lbBadgeSections:1436 · lbDemoRows:1461 · lbChar:1483 · lbfAwardBarHtml:1493
openLeaderboardFull:1505 · BLK_PAD:1602 · seatPodChars:1604 · lbCoinHtml:1614 · lbBadgeHtml:1630 · lbBossHtml:1656
lbWordSearchHtml:1679 · lbTypingHtml:1715 · bindPlayerClicks:1751 · showPlayerCard:1761 · petDescImg:1987 · openImgLightbox:2000
openPetPeek:2020 · updateBillBadges:2064 · setBadge:2074 · updateSettingsBadge:2090 · openAttentionSummary:2104 · updateFriendBadge:2146
renderFriendPanel:2156 · friendDoSearch:2204 · refreshFriendData:2228 · FRW_TTL_MS:2293 · FRW_MIN_GAP:2294 · frwWorldOf:2298
frwPanelOpen:2301 · frwScan:2306 · frwPaint:2328 · frwPaintHint:2349 · frwFollow:2363 · CHAT_EMOJI_CATS:2384
CHAT_THEMES:2406 · CHAT_SECRET_MS:2415 · chatBadgeSync:2423 · ibTimeStr:2431 · IB_CALL_RE:2440 · ibCallInfo:2441
openChatInbox:2446 · chatFitKeyboard:2611 · openChat:2627 · giftImg:2818 · giftDateStr:2820 · GREETS:2828
GREET_EXP:2836 · greetInfo:2837 · openGreetPicker:2841 · giftItemPic:2883 · giftItemName:2891 · updateGiftBadge:2897
renderGiftPanel:2906 · acceptGift:2964 · declineGift:2987 · showGreetReveal:2996 · showGiftReveal:3023 · openGiftPicker:3049
confirmSendGift:3117 · doSendGift:3141 · rankBadgeHTML:3165 · renderRankCard:3170 · renderRankTab:3196 · showRankUp:3224
bindPetPlateButtons:3259 · openPetInfoOverlay:3288 · feedAgo:3311 · renderFeedCard:3324 · openFeedBoard:3384 · renderFeedBoardLive:3405
renderFeedBoard:3421 · bindFeedBoardEvents:3459 · stageColLeft:3503 · alignPetTabs:3512 · alignCoinGroup:3521 · alignStageLeft:3535
alignStageCols:3546 · watchStageCols:3560 · alignCureBtn:3570 · dictRecordLookup:3594 · DICT_FILE_COUNT:3605 · loadDict:3606
dictSearch:3621 · dictTapWords:3636 · dictEntryHTML:3640 · openDictOverlay:3651 · renderDashboard:3735 · sleepBtnHTML:4239
sleepHintHTML:4246 · sleepAllPets:4257 · wakeAllPets:4270 · feedPet:4281 · openFoodMenu:4295 · feedWith:4366
AVATAR_UI:4396 · playerAvatarHTML:4399 · SHAPE_UI:4405 · showFeedResult:4414 · curePet:4455 · heartsFx:4478
PAT_HOLD_MS:4501 · PAT_EXP:4502 · bindPetTap:4503 · petBounce:4521 · petMood:4527 · shortPatPet:4534
longPatPet:4542 · patCalendarHTML:4562 · patStreakTick:4590 · cureCelebrateFx:4616 · railCureClick:4627 · detoxPet:4639
openFoodQuiz:4662 · closeDressUpBoard:4744 · openDressUpBoard:4748 · renderShop:4765 · homeVisualHTML:4828 · showHomeRuined:4842
showCutNotice:4863 · renderHomeCard:4881 · payMaint:4965 · trashBillUI:4981 · payTrash:4998 · UTILITY_UI:5017
utilityBillUI:5066 · payUtility:5091 · buyUtilityFix:5117 · renderPhoneCard:5135 · buyPhone:5175 · sellPhone:5197
compLiveTotal:5218 · onlineLiveTotal:5229 · renderOnlineEarnPill:5234 · openPillInfo:5257 · renderComputerCard:5304 · buyComputer:5339
sellComputer:5362 · soldCount:5388 · soldBadge:5389 · renderTicketCard:5394 · loadScriptOnce:5450 · loadAdv3d:5467
enterAdventure3D:5475 · pickAdvMap:5500 · enterHaunted3D:5535 · advHealClick:5557 · buyTicket:5577 · renderHauntCard:5603
buyHauntTicket:5659 · renderHeliCard:5686 · buyHeliTicket:5744 · enterHeli3D:5767 · renderDroneCard:5789 · buyDroneTicket:5844
enterDrone3D:5867 · renderDriveCard:5890 · buyDriveTicket:5964 · enterDrive3D:5987 · pickDriveMap:6022 · enterMotoMapAsCar:6058
renderSoccerCard:6080 · buySoccerTicket:6128 · enterSoccer3D:6151 · renderMotoCard:6174 · buyMotoTicket:6223 · enterMoto3D:6246
renderInvasionCard:6269 · INVASION_REWARD:6318 · buyInvasionTicket:6320 · enterInvasion3D:6344 · WORLD3D:6369 · gotoRobotShop:6380
scrollShopCardIntoView:6385 · railWorldClick:6388 · railScrollHint:6413 · railScrollTop:6421 · initRailScroll:6426 · renderRailWorlds:6446
tinvNoticeHTML:6507 · openTinvPicker:6515 · fruitCountdown:6559 · renderFarmCard:6571 · renderFarmClock:6646 · buyFruit:6662
sellFruit:6682 · sellAllFruit:6703 · collectImg:6732 · renderFactoryCard:6738 · renderMarketCard:6761 · updateWishBadge:6817
openWishlistDialog:6828 · bindStripArrows:6873 · renderMarketBrowse:6885 · carImg:6914 · renderVehicleShop:6915 · CS_CYCLE_MS:6966
carInteriorImg:6967 · carStatHtml:6969 · renderCarShowroom:6976 · csShowBig:7003 · csInit:7030 · RS_CYCLE_MS:7053
robotImg:7054 · renderRobotShop:7055 · rsShowBig:7077 · rsInit:7098 · buyRobot:7117 · enterMecha3D:7139
pickMechaRobot:7160 · pickDriveCar:7192 · openCarBuyDialog:7235 · buyCarInsurance:7296 · payCarLoanMonthly:7315 · payCarLoanFull:7327
carDriveBlock:7346 · gotoVehicleShop:7351 · gotoMyStock:7356 · showNeedCarDialog:7362 · craftDiscount:7374 · renderFactory:7377
renderOrdersUI:7446 · startProduce:7465 · buyCollectible:7493 · cancelProduce:7521 · deliverOrder:7535 · renderOrderClock:7552
renderCollectMine:7562 · openListDialog:7604 · cancelListing:7657 · buyMarketItem:7680 · showCollectReveal:7707 · buyAC:7745
openHomeShop:7764 · renderPetShop:7823 · showLevelUp:7884 · renderStats:7921 · showTeacherCard:8028 · CALL_REACT_EMOS:8072
CALL_TALK_MIN:8075 · CALL_TALK_HOLD:8076 · CALL_ORDER_GAP:8078 · CALL_TONES:8084 · startCall:8458

## js/util.js (891 บรรทัด · 39 รายการ)
shuffle:6 · fmtNum:15 · escapeHTML:19 · gradeSymbol:32 · gradeMark:47 · nameWithGrade:55
gradeMarkCanvas:61 · gradeOf:77 · seededRand:92 · fmtThaiDT:102 · fmtThaiDate:106 · showScreen:111
TOAST_WARN_RE:121 · restackToasts:124 · toast:146 · floatFx:166 · beep:177 · PET_MOOD:253
petVoiceSynth:260 · sirenSynth:337 · playCashier:361 · cashierSynth:375 · keyTapSynth:408 · playSpark:449
sparkSynth:463 · thunderFx:498 · wordAudioFile:566 · speakCutOff:575 · speakWord:579 · speakLetter:603
pickSpeakVoice:626 · speakWordTTS:637 · askNameDialog:657 · askConfirm:697 · alertBox:715 · applyNoAnim:735
openSettings:740 · openHelp:846 · openTeacherGuide:872

## js/vocabbook.js (207 บรรทัด · 14 รายการ)
VB_MAX:11 · VB_QUIZ_N:12 · VB_QUIZ_MIN:13 · vbGroup:16 · VB_GROUP_UI:21 · vbRecord:24
vbSeen:49 · vbStats:62 · vbList:70 · vbReviewCat:81 · vbStartReview:95 · openVocabBook:106
vbRender:148 · vbCardHTML:194

## js/wordsearch.js (414 บรรทัด · 0 รายการ)

## js/wsaward.js (32 บรรทัด · 0 รายการ)

## css/lobby.css (4,320 บรรทัด · 660 selector)
:root:6 · html:15 · body:16 · *:33,34,35,36 · #app:39 · h1:41
.subtitle:42 · .shop-title:43 · #rotate-overlay:46 · .screen:68 · #screen-select:77,78,79,80(+5) · .egg-need:87
.petshop-topright:89 · .petshop-play-link:90,95 · #screen-quiz:134,135,136,137(+6) · #quiz-choices:146,147 · .word-card:154 · .quiz-choice:155,156,157
.big-btn:160,161,162,163 · #screen-dashboard:168,1060,1068 · .lobby-top:175,815,816,817(+21) · .top-flex:176 · .profile-plate:177,181,736,3137(+12) · #rain-fx:186
.rain-layer:189,195 · .rain-glass:202 · .glass-drop:203 · .rail-btn:218,828,834,835(+16) · .rail-badge:219 · .fr-code-box:224
.fr-code-label:228 · .fr-code-row:229 · .fr-code:230 · .fr-copy-btn:235,239,244,245 · .fr-search-btn:240 · .fr-add-btn:241
.fr-accept:242 · .fr-decline:243 · #fr-search-input:246 · #fr-search-result:250 · .fr-found:251 · .fr-hint:255
.fr-list-title:256 · .fr-row:257 · .fr-req:261 · .fr-row-name:263,267,4099 · .fr-row-status:271 · .fr-req-btns:272
.online-dot:273 · .fr-chat-btn:274,279,281 · .fr-unread:282 · .fr-call-btn:288,294 · .chat-overlay:303,309,310 · .chat-box:311,612,619,626(+12)
.chat-head:323 · .chat-theme-btn:328,332 · .chat-secret-tg:333,334 · .cs-switch:335,336,341,342 · .cs-slider:337,339 · .chat-secret-note:343
.chat-theme-strip:346 · .chat-theme-sw:348,351,352,353(+1) · .chat-head-name:355,356 · .chat-close:357 · .chat-msgs:361 · .chat-empty:365
.chat-typing:367 · .ct-dots:369,370,372,373 · .no-anim:375,388,449,463(+47) · .chat-bubble:376,381,386 · .chat-emoji:389 · .chat-emo:393,397
.chat-input-row:398 · .chat-emoji-btn:402 · #chat-input:406 · .chat-send:410,415,416 · .chat-call-btn:422,426 · .call-ring:429
.cr-card:433 · .cr-kind:439 · .cr-av:440 · .cr-name:450 · .cr-id:451 · .cr-btns:452
.cr-btn:453,459,464 · .cr-no:460 · .cr-ok:461 · .cr-safe:465 · .call-ov:468,474,496,513(+6) · .call-stage:480
.ctile:481,492,493 · .ct-face:485 · .ct-me:491 · .ct-nm:506,510 · .ct-sub:511 · .call-add:535
.ca-head:542 · .ca-list:543 · .ca-row:544,548 · .ca-dot:549,550 · .ca-nm:551,552 · .ca-go:553
.ca-empty:554 · .ca-safe:555 · .ca-close:556 · .call-bar:560 · .cb-btn:565,570,571 · .cb-end:572,573
.call-emos:574 · .call-emo:579,580 · .call-fx:582 · .call-fx-emo:583 · .pl-click:675,677,678 · .pl-overlay:679
.pl-card:683,2396 · .pl-close:689 · .pl-head:693,2277,2280 · .pl-grade:698,4105,4106 · .pl-badges:700 · .pl-badge-chip:701,705
.pl-badge-ic:706 · .pl-body:708 · .pl-loading:709 · .pl-none:710 · .pl-me-tag:711 · .pl-blk-wrap:713
.pl-blk:714 · .pl-stat:715 · .pl-lbl:720 · .pl-val:721,722 · .pl-tip:723 · .chip-edit:729,734,735
.rank-mini:741,747,748,749 · .pass-photo:751,756 · .pet-tabs:758 · .dict-box:759,763,764,765(+1) · .dict-card:771,776,780,781(+2) · .dict-head:777,778
.dict-trail:785,789 · .dt-c:790,794,795 · .dt-sep:796 · .dict-today:797 · .di-w:799,800,801 · .dict-list:802
.dict-item:803,807,808,809(+5) · .lobby-mid:823 · .rail-wrap:826,851,855,856(+3) · .lobby-rail:827 · .rail-nudge:858,866,867,870(+1) · .rail-worlds:877
.rail-div:878 · .lobby-stage:920,922,938,1065(+13) · .newword-banner:928,935,940,3644(+2) · .coin-fly:951,954 · .coin-plus:960 · .nw-pop-coin:975,977,978
.nw-pop-goal:981,982,986,990 · .nw-goal-head:983,985,987 · .nw-goal-bar:988 · .nw-goal-fill:989 · .nw-pop-book:991,992 · .nw-tag:1013,3650,3669
.nw-word:1018,3654,3670,3745 · .nw-hint:1020,1021,3655,3744 · .nw-coin:1023,1026,3656,3660 · .nw-countdown:1031,3661 · .nw-bar:1033,3671 · .nw-bar-fill:1035
.pet-stage:1038,2591 · .nw-box:1045,2600 · .nw-pop-word:1046 · .nw-speak:1047 · .nw-pop-phon:1048 · .nw-ipa:1049
.nw-pop-sent:1050 · .nw-pop-mean:1051 · .pet-tab:1052,1053,1054,2943 · .stage-hero:1075,1090,1098,1243(+22) · .hero-ground:1112,1232,1238 · .hero-rank-bg:1114,1117,1120,1124(+18)
#lobby3d-canvas:1137,1138 · .hero-scene:1142,1144,1151,1152(+8) · .caretaker-fig:1191 · .caretaker-img:1194 · .caretaker-emoji:1196 · .blk-rig:1203,1204,1205
.stage-plate:1265,1273,1284,1285(+23) · .plate-title:1279 · .lobby-side:1312,1348,1353,1356(+22) · .side-sec:1315,2842,3115 · .side-label:1316,1321 · .side-label-row:1324,1325
.lb-tabs-out:1326,1327,1331 · .side-glass:1335,1342 · .side-card:1354,1466 · #quest-card:1366,1390,1391,1392(+6) · .q-bigcard:1367,1396,1397,1400(+1) · .qb-top:1369
.qb-emoji:1370 · .qb-name:1372 · .qb-bar:1373,1374 · .qb-row:1376 · .qb-prog:1377 · .qb-reward:1378
.qb-go:1379,1383 · .q-dots:1384 · .q-dot:1385,1386,1387 · .q-bonus:1388 · .feed-row:1411,2110,2115 · .inv-card:1413,1415,1416
.inv-btns:1417 · .inv-go:1418,1420 · .inv-x:1421 · #online-card:1425,2850,2851,2852(+4) · .fq-overlay:1426 · .fq-box:1428,2656
.fq-head:1432,1434 · .fq-close:1435 · .fq-sec:1437 · .fq-worlds:1438 · .fq-world:1439,1441 · .fq-acts:1442
.fq-act:1443,1446,1447 · .lb-prize:1480 · .lb-coins:1483 · .lbf-cell:1484,2330,2333,2334(+3) · .lb-award-bar:1486,1492,1493 · .lb-award-go:1494
.lbf-award:1496,1502,1503,1504 · .pod-pz:1505 · .wsa-overlay:1508 · .wsa-box:1510 · .wsa-head:1515 · .wsa-title:1516
.wsa-when:1517,1518 · .wsa-close:1519,1522 · .wsa-cols:1523 · .wsa-col:1524 · .wsa-sec-h:1525,1526 · .wsa-msg:1527
.wsa-msg-h:1530 · .wsa-msg-b:1531,1532 · .wsa-msg-none:1533 · .wsa-rules:1535,1536 · .wsa-list:1537 · .wsa-row:1538,1540
.wsa-r:1541 · .wsa-n:1542 · .wsa-s:1543 · .wsa-p:1544 · .wsa-prizes:1545 · .wsa-pz:1546,1549
.wsa-reveal-medal:1550 · .lobby-bottom:1560,1562 · .lobby-quiz-btn:1563 · .lobby-book-btn:1564,1565 · .lobby-foodquiz-btn:1566,1567 · .lobby-play-btn:1568,1572
.lobby-exam-btn:1574,1575,1577 · .panel-overlay:1582,1587,3758,3759(+5) · .panel-box:1588 · .panel-head:1595,1599 · .panel-close:1600,1605 · .panel-body:1606,1610,1611
.panel-page:1608,1609 · .collect-sub:1615 · .mkt-empty:1616 · .craft-box:1617 · .mkt-listing:1618 · .mkt-filter:1619,1963
.hq-grid:1626 · .hq-card:1627,1632,1656 · .hq-head:1633 · .hq-pic:1639,1641 · .hq-emoji:1643 · .hq-badge:1644
.hq-stars:1648 · .hq-price:1649,1654,1655,1658(+6) · .craft-credit:1662,1664,1665 · .car-grid:1672,1674,1675 · .robot-weap:1676 · .dmap-box:1679,1680
.dmap-grid:1686 · .dmap-card:1688,1691,1692,1693(+2) · .dmap-ico:1695 · .dmap-new:1698 · .dcp-grid:1700 · .dcp-card:1702,1705,1706,1707(+10)
.levelup-box:1724,2557,2558,2653 · .dcp-box:1727,1728,1732,1733(+6) · .dcp-lock:1741 · .sold-badge:1745,1747,1748 · .rs-showroom:1750,4057,4058 · .rs-list:1751,1753,4038,4041
.rs-thumb:1754,1756,1757,1758(+1) · .rs-thumb-pic:1759,1760 · .rs-thumb-price:1761 · .rs-stage:1763 · .rs-big:1766 · .rs-big-img:1767
.rs-elec:1771,1775,1780 · .rs-edge:1781,1787 · .rs-info:1790,1791,1792,1793(+1) · .rs-buy:1795,1797,1798 · .cs-showroom:1802,4030,4031,4059(+3) · .cs-list:1803,1805,4032,4037(+9)
.cs-thumb:1806,1808,1809,1810(+1) · .cs-thumb-pic:1811,1812 · .cs-thumb-name:1813 · .cs-thumb-price:1814 · .cs-thumb-own:1815 · .cs-stage:1817
.cs-big:1820 · .cs-big-img:1821 · .cs-elec:1825,1829,1833 · .cs-edge:1834,1840 · .cs-interior:1843 · .cs-inr-label:1844,1845
.cs-inr-img:1846 · .cs-info:1848,1849,1850,1851(+6) · .cs-buy:1859,1861,1862,1863 · .car-emoji:1865 · .car-mine:1871 · .car-mine-pic:1876
.car-mine-info:1877 · .car-loan:1878,1879 · .car-mine-btns:1880,1881,1882 · .car-locked:1884 · .car-mine-head:1886 · .car-pick-list:1887,1888
.car-pick:1889,1891,1892 · .car-pick-pic:1893,1894 · .car-pick-name:1895,1896 · .car-pick-od:1897 · .car-buy-box:1899,2660 · .cb-pic:1900,1901,1902
.cb-lines:1903 · .cb-li:1904,1908,1909 · .cb-ins:1910,1914,1915 · .cb-plan:1916 · .cb-pl:1917,1922,1924,1928(+1) · .cb-total:1935
.cb-btns:1936,1941 · .cb-x:1937 · .shop-grid:1944 · .shop-item:1945,1950,1955,1956(+3) · .mkt-tab:1964,1965 · .pg-btn:1966,1967,1968
.pg-dot:1969 · .fr-gift-btn:1992,1997 · .gift-sec-title:2000 · .gift-in-row:2002 · .gift-out-row:2006 · .gift-in-pic:2007,2009,2010
.gift-in-info:2011,2012 · .gift-in-btns:2013 · .gift-accept:2014,2018,2020 · .gift-decline:2019 · .gift-box-card:2021 · .gift-box-from:2022,2023
.gift-note:2024 · .gift-pick-overlay:2027 · .gift-pick-box:2031 · .gift-pick-head:2037,2041 · .gift-pick-close:2042 · .gift-pick-tabs:2044
.gp-tab:2045,2049 · .gift-pick-body:2050 · .gp-chips:2051 · .gp-chip:2052,2056 · .gp-card:2057,2058 · .gp-price:2059
.gp-note:2060 · .gift-cf-pic:2061 · .chat-emoji-cats:2066 · .chat-emoji-cat:2070,2074,2075 · .chat-emoji-wrap:2076,2077 · .stage-left:2086,3749
.pet-info-btn:2090,2097,2098 · .feed-list:2105,2109 · .feed-ico:2116 · .feed-txt:2117 · .feed-name:2118 · .feed-ago:2119
.feed-empty:2120,2123 · .feed-plate:2125 · .feed-all-btn:2126,2131 · .fdb-overlay:2136 · .fdb-box:2138 · .fdb-head:2142
.fdb-close:2146,2148 · .fdb-live:2149,2151 · .fdb-live-title:2152 · .fdb-live-rows:2153 · .fdb-live-row:2154,2156,2157,2158 · .fdb-dot:2159
.fdb-list:2161,2162 · .fdb-empty:2163 · .fdb-row:2164 · .fdb-row-top:2166 · .fdb-ico:2167 · .fdb-txt:2168
.fdb-name:2169 · .fdb-ago:2170 · .fdb-actions:2171 · .fdb-like:2172,2175,2176,2177 · .fdb-cm-list:2178 · .fdb-cm-row:2179,2181
.fdb-cm-empty:2182 · .fdb-cm-add:2183 · .fdb-cm-input:2184,2186 · .fdb-cm-send:2187,2189 · .fdb-cm-locked:2190 · .pi-overlay:2193
.pi-box:2197,2202,2203,2207(+3) · .pi-close:2209,2214,2215 · .pi-close-left:2217 · .pi-portrait:2219 · .pet-wear:2226,2229,2231 · .pi-portrait-wrap:2234,2236
.pi-dress-btn:2244,2248,2249 · .pi-shape-cap:2250,2253,2254,2255 · .pi-shape-toggle-btn:2257,2260 · .pi-dress-pip:2262,2267,2268,2269(+1) · .pi-wear-note:2272,2274 · .greet-card:2281
.greet-sub:2282 · .greet-grid:2283 · .greet-opt:2284,2287,2288,2289 · .greet-e:2290 · .pi-streak:2294 · .pi-streak-head:2296,2298
.pi-streak-best:2299 · .pi-dots:2300 · .pi-dot:2302,2303,2304 · .pi-streak-note:2305 · .pi-care-title:2306 · .lbf-overlay:2309
.lbf-box:2312 · .lbf-head:2317 · .lbf-title:2318 · .lbf-tabs:2319,2322 · .lbf-close:2325 · .lbf-close-l:2326
.lbf-body:2327 · .lbf-grid:2328 · .lbf-bcat-wrap:2341,2343 · .lbf-bcat:2344 · .lbf-bcat-head:2345,2346,2347 · .lbf-bcat-rows:2348
.lbf-bcat-row:2349,2351,2352,2353(+1) · .bcr-ic:2357 · .badge-ic-fallback:2359 · .lbf-podium:2362 · .pod:2364,2391,2392 · .pod-char:2366
.pod-base:2368 · .pod-rank:2370 · .pod-label:2372,4101 · .pod-name:2374 · .pod-sc:2376 · .pod-1:2381,2382
.pod-2:2383,2384 · .pod-3:2385,2386 · .pod-4:2387,2388 · .pod-5:2389,2390 · .pl-wide:2409,2412,2413,2414(+8) · .pl-follow:2415,2420,2422
.pl-unfollow:2424,2430,2431 · .pl-followers:2432 · .pl-cols:2433 · .pl-col:2434 · .pl-sec-title:2435 · .pl-feed:2436,2439,2446
.pl-feed-row:2440,2444,2445 · .pl-assets-wrap:2448,3938,4013 · .pl-assets:2449,3941,3946,3952(+4) · .pl-asset:2452,2456,2463 · .pl-asset-emoji:2457 · .pl-asset-n:2458
.pl-pets-wrap:2465 · .pl-pets:2466 · .pl-pet:2467,2472,2474 · .pl-pet-nm:2475 · .img-lightbox:2478,2483,2484,2488(+3) · .pl-chat:2501,2506
.pl-call:2508,2514 · .pet-peek:2515,2516 · .pp-chips:2518 · .pp-chip:2519 · .pp-gift:2524,2530 · .settings-box:2532,2533,2602,2607(+20)
.set-feed-head:2534 · .set-feed-sub:2538 · .set-feed-row:2539 · .pillinfo-val:2544 · .pillinfo-desc:2549,2568 · .pillinfo-box:2560
.plf-head:2563 · .plf-emoji:2564 · .plf-ht:2565,2566,2567 · .plf-foot:2569 · .alert-box:2574,2576 · .ab-emoji:2577
.ab-title:2578 · .ab-desc:2579 · .ab-btns:2580,2581,2582 · .heal-heart:2584 · .attn-box:2599 · .help-box:2631,2632,2633
.wl-box:2654 · .food-box:2655 · .home-shop-box:2657 · .summary-box:2658 · .report-box:2659 · .wl-grid:2662
.tc-wrap:2664 · .spell-btn:2670,2675 · .sp-hud:2676 · .sp-word:2678 · .sp-ch:2679,2684 · .sp-th:2686
.sp-hint:2688 · .sp-exit:2691,2695 · .sp-banner:2696 · .sp-big:2701 · .sp-thb:2703 · .sp-coin:2704
#spell-confetti:2709 · .sp-rb:2710 · .sp-day:2720 · .sp-perfect:2722 · .sp-late:2724 · #spell-coinpop:2727
.side-sub:2836,2838 · .sec-quest:2843 · .on-page:2854,2855,2856,2857 · .inbox-overlay:2867 · .ib-box:2869 · .ib-head:2873
.ib-close:2877,2879 · .ib-list:2880,2881 · .ib-row:2882,2883,2884,2885 · .ib-ava:2886 · .ib-on:2890 · .ib-mid:2892
.ib-name:2893 · .ib-last:2894 · .ib-meta:2895 · .ib-time:2896 · .ib-dot:2898 · .ib-story-badge:2901
.ib-empty:2905 · .ib-story:2907,2909 · .ib-story-item:2910,2912,2919 · .ib-story-ava:2913 · .ib-story-on:2917 · .ib-world:2922,2925
.ib-tabs:2927 · .ib-tab:2928,2931,2933 · .ib-tab-dot:2934 · .ib-call-ava:2938 · .ib-call-row:2939,2940 · #btn-music:2946,2949,2950
#ws-overlay:2965 · #ws-board:2968,2974,2976 · .ws-head:2979 · .ws-title:2980 · .ws-findbar:2983 · .ws-tip:2984
.ws-grade:2986,2987 · .ws-body:2990 · .ws-gridwrap:2991 · #ws-grid:2994 · .ws-cell:2999,3004,3007,3010(+2) · .ws-flash:3016,3018
.ws-coinpop:3022,3046 · .ws-combo:3033,3037,3038,3039 · .ws-find:3050 · #ws-prog:3051 · #ws-words:3055,3059 · .ws-word:3061,3066,3067,3068(+2)
.ws-actions:3074,3075,3084 · .ws-sizes:3079 · .ws-sizes-lb:3081 · .ws-size-now:3082 · #ws-new:3085 · #ws-stash:3086
#ws-clear:3087 · #ws-win:3088,3090 · .ws-win-in:3091,3094 · .sec-online:3117 · .rank-tab:3145,3146,3147,3148(+2) · .pet-show-bg:3178,3181,3185,3189(+19)
.ps-night-fx:3281,3283,3295,3300(+1) · .pet-show:3310,3313,3325,3327(+22) · .ps-video:3446 · .ps-worn-pip:3524,3525 · .id-card:3548,3554,3558 · .id-chip:3571
.clock-chip:3580,3581 · .coin-group:3596 · .cp-lb:3620 · .cp-v:3621 · .nw-row1:3667 · .nw-row2:3668
.top-flex2:3746 · #panel-factory:3765,3766,3770,3771(+39) · .grid2x8:3894,3900 · .mine-strip:3918,3920,3921,3926(+4) · .mb-strip:3932,3971 · .gmark:4079,4083,4084,4085(+1)
.gm-stack:4088,4092 · .gm-row:4094 · .lb-name:4096,4097,4098 · .grade-edit:4124,4129,4130 · .gradelock-box:4132,4148,4153,4155 · .gl-head:4133
.gl-emoji:4134 · .gl-ht:4135 · .gl-cur:4136 · .gl-lock:4137,4142 · .gl-ok:4141 · .gl-lock-sub:4143
.gl-why:4144 · .gl-pick-lb:4145 · .gl-opts:4146 · .gl-hist:4156 · .gl-hline:4157 · .gl-hg:4161
.gl-hat:4162 · .gl-harr:4163 · .gl-foot:4164 · .gl-cf:4165 · .reg-gradelock:4185 · #tp-overlay:4195
#tp-board:4197,4201 · .tp-head:4205 · .tp-title:4206 · .tp-stat:4208,4210 · .tp-pts:4212,4215 · .tp-close:4217,4223,4224
.tp-snd:4227,4230,4236,4237 · .tp-snd-ic:4231 · .tp-snd-track:4232 · .tp-snd-thumb:4234 · .tp-prompt:4241 · .tp-word:4243,4257,4258
.tp-ch:4245,4250,4251,4253 · .tp-thai:4261 · .tp-hint:4263 · .tp-empty:4265 · .tp-keys:4268 · .tp-row:4270
.tp-row-fn:4272,4305 · .tp-key:4276,4288,4290,4296(+2) · .tp-key-fn:4303 · .tp-fx:4309 · .tp-coinpop:4310 · .tp-pop-pt:4315

## css/style.css (1,817 บรรทัด · 474 selector)
:root:5 · *:15 · html:16,21 · input:25 · body:29 · #app:35
.screen:38,39 · h1:42 · .subtitle:43 · .egg-grid:46,63 · .egg-card:47,52,53,54(+2) · .pet-price:57,61
.egg:65,71,75 · .d1:76 · .basket:79,80,85,91(+5) · .basket-dog:89,102,103,104 · .basket-cat:90,105,106,107 · .egg-dragon:110
.topbar:125 · .topbar-coins:126 · .coin-pill:127,138,142,147(+2) · .coin-ic:134 · .no-anim:148,563,1481,1774(+2) · .net-coin:150
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
.quiz-score-pill:1153 · .stats-card:1156 · .stats-title:1160,1602 · .stats-row:1161,1162,1163,1164 · .stat-badge-line:1166,1169 · .stat-badge-ic:1167
.game-top:1172 · .back-btn:1173 · .combo-pill:1177 · .timer-wrap:1181 · .timer-fill:1182,1183 · .board-label:1185
.card-grid:1186 · .word-card:1187,1193,1194,1195(+3) · .hint-btn:1201,1206 · .game-endless-note:1209,1214,1216,1220(+6) · .report-btn:1241,1246 · .report-box:1249
.report-close:1250 · .rp-head:1254 · .rp-avatar:1255,1256 · .rp-title:1257 · .rp-sub:1258 · .rp-levelcard:1260
.rp-level-top:1264 · .rp-bar:1265 · .rp-bar-fill:1266 · .rp-level-note:1267,1268 · .rp-grid:1270 · .rp-stat:1271
.rp-ic:1274 · .rp-num:1275 · .rp-lbl:1276 · .rp-section:1278 · .rp-h3:1279 · .rp-badge-mini:1280
.rp-row:1281,1282,1283 · .rp-empty:1284 · .rp-badges:1285 · .rp-badge:1286 · .rp-tline:1289 · .rp-tl-head:1290,1291
.rp-tl-ems:1292 · .rp-em:1293,1294 · .rp-tl-note:1295,1296 · .rp-crown:1298,1299 · .rp-wtitle:1301 · .rp-wnow:1302,1303
.rp-wgraph:1304 · .rp-wcol:1305 · .rp-wval:1306 · .rp-wbar:1307,1308 · .rp-wlbl:1309 · .rp-cheer:1311
.report-ok:1315 · .summary-box:1318,1373,1377,1378(+2) · .sm-burst:1319 · .sm-title:1321 · .sm-line:1322 · .sm-coin:1323
.sm-matches:1329,1330 · .confetti:1332 · .sm-badge:1339 · .sm-badge-all:1343 · .badge-celebrate-overlay:1346,1363 · .badge-celebrate:1352
.bc-emoji:1358,1360 · .bc-emoji-img:1359 · .bc-title:1361 · .bc-sub:1362 · .sm-cheer:1367 · .sm-streak:1368,1369
.sm-sick:1370 · .sm-btns:1371 · .float-fx:1383 · .toast:1390 · .toast-warn:1397,1404,1405,1411 · .toast-clear-all:1413,1420
.alert-box:1422 · .alert-ok:1423,1428 · .settings-box:1430 · .set-row:1431 · .set-hint:1435 · .set-hint-on:1436
.set-hint-off:1437 · .set-lwrap:1438 · .set-label:1439 · .set-desc:1440 · .set-switch:1441,1445,1446,1451(+4) · .set-sw-knob:1447
.set-sw-txt:1454 · .set-close:1460,1465 · .set-help:1466,1471 · .help-box:1473,1474,1479 · .help-item:1475 · .update-banner:1487,1496,1497
#update-reload:1498 · #update-dismiss:1502 · .levelup-overlay:1508 · .levelup-box:1512,1519,1520,1521(+4) · .bill-box:1527,1531,1532 · .tag-off:1533
.home-decayed-img:1534 · .home-dark-img:1535 · .thirst-fill:1536 · .thirst-text:1537,1538 · .toxin-fill:1541 · .toxin-text:1542,1543
.detox-btn:1544,1549 · .shape-text:1552,1553,1554,1555(+1) · .avatar-pick:1559 · .avatar-opt:1560,1564,1565,1566 · .avatar-chip-img:1570 · .avatar-chip-blk:1572
.set-avatar-btns:1573 · .avatar-mini:1574,1578 · .set-blk-row:1580 · .set-sub2:1581 · .blk-grid:1583 · .blk-mini:1584,1587,1588,1589
.game-avatar:1592,1593,1594 · .stats-nick:1603 · .ticket-owned:1606,1610 · .collect-sub:1615 · .mkt-tabs:1616 · .mkt-tab:1617,1621
.mkt-filter:1622 · .mkt-row:1626 · .mkt-emoji:1630,1631 · .mkt-info:1632,1633 · .mkt-tier-stars:1634 · .mkt-buy:1635,1640,1641
.mkt-price-lo:1642 · .mkt-price-hi:1643 · .mkt-empty:1644 · .collect-grid:1647 · .collect-cell:1648 · .cc-emoji:1649,1650
.cc-name:1651 · .cc-count:1652 · .cc-list-btn:1653,1657 · .mkt-listhead:1658 · .mkt-group-head:1660,1666 · .mkt-two-col:1668,1669,1673,1685(+8)
#phone-card:1674,1690 · #computer-card:1675,1691 · #ticket-card:1677 · #haunt-card:1678 · #heli-card:1679 · #drone-card:1680
#drive-card:1681 · #soccer-card:1682 · #moto-card:1683 · #invasion-card:1684 · .mkt-listing:1712 · .ml-cancel:1716
.mkt-sold:1722,1723,1724 · .list-dialog:1731,1732,1737 · .list-hint:1736 · .collect-reveal-frame:1740,1747 · .collect-reveal-img:1746 · .collect-reveal-stars:1748
.craft-box:1751 · .craft-head:1752 · .craft-bar:1753 · .craft-fill:1754 · .craft-text:1755 · .craft-btn-row:1756,1757
.craft-go-btn:1759,1765,1766,1769 · .craft-cancel:1777,1781 · .mkt-catalog:1784,1785,1786 · .mkt-pager:1789 · .pg-btn:1790,1794,1795 · .pg-mid:1796
.pg-dots:1797 · .pg-dot:1798,1799 · .order-head:1800 · .order-row:1801,1806,1808,1810 · .order-deliver:1811,1816 · .order-need:1817
