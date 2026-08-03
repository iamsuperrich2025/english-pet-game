# CODE_MAP.md — แผนที่โค้ด:บรรทัด (เจนอัตโนมัติโดย `tools/gen_code_map.py` — **ห้ามแก้มือ** เดี๋ยวโดนเขียนทับ)

> วิธีใช้: หาชื่อฟังก์ชัน/ค่าคงที่/selector ในไฟล์นี้ (Grep หรือกวาดตา) → `Read` ไฟล์จริง `offset=<บรรทัด>` `limit=40`
> 🗂️ ไฟล์อ้วนมี **สารบัญโซน** (`st-end ชื่อโซน`) — งานทั้งระบบ/โลก 3D: Grep ชื่อโซน → Read/Edit เฉพาะช่วงนั้น **ห้ามอ่านทั้งไฟล์** · เพิ่มระบบใหม่ในไฟล์อ้วนต้องครอบ banner `/* ==== */`+ชื่อโซน (สารบัญเจนเอง)
> css = index `selector:บรรทัดทุกจุดที่ประกาศ` (บั๊ก UI เริ่มหาที่นี่) · เจนใหม่ทุกครั้งที่รัน `python tools/rotate_handoff.py` · อัปเดต: 2026-08-03

## js/adv3d_css.js (1,151 บรรทัด · 0 รายการ)

## js/adv3d_intro.js (86 บรรทัด · 0 รายการ)

## js/adv3d_tex.js (245 บรรทัด · 19 รายการ)
TILE_COLORS:9 · letterTexture:10 · letterTextureDark:27 · emojiTexture:40 · GHOST_IMG_MAX:52 · measureGhostBox:58
probeGhostImages:71 · whenGhostsReady:83 · ghostTexture:87 · ghostScareSrc:92 · AD_STYLES:100 · adBoardTexture:109
addAdBillboard:156 · ringAds:167 · BUILDING_TINTS:177 · FACADE_ROWS:179 · buildingFacadeTexture:180 · makePeerSprite:205
bind:241

## js/adventure3d.js (12,713 บรรทัด · 614 รายการ)
### 🗂️ สารบัญโซน js/adventure3d.js (Read/Edit เฉพาะช่วง)
- 1-218 adventure3d.js — โลก 3D First-person 2 โหมด (คิว 7725691507 ข้อ 8 + ต่อยอด)
- 219-317 ⚽ โหมดสนามฟุตบอล (โหมด soccer · รอบ 196) — เล็ง+ชาร์จพลังเตะบอลใส่ป้ายตัวอักษร
- 318-372 🤖 โหมดหุ่นยนต์นักรบ (โหมด mecha · รอบ 199) — มุมมองในหุ่นสูง 5m เดินยิงเอเลี่ยนตัวอักษร
- 373-515 📻 หอบังคับการบิน (รอบ 64 · รอบ 66 เปลี่ยนเป็นอังกฤษล้วนตามผู้ใช้สั่ง)
- 516-536 คำศัพท์ — ตามระดับชั้น + ไม่ซ้ำคำที่ประกอบแล้ว (8.1/8.6) · แยกคลังต่อโหมด
- 537-675 Texture ตัวอักษร / emoji / ป้ายชื่อผู้เล่น (canvas → sprite)
- 676-893 🧱 ตัวละครบล็อก (โลกขับรถ) — เลือกก่อนออกรถ · เพื่อนใน map เห็นเป็นหุ่นบล็อกขับรถบล็อก
- 894-1201 🚙 รอบ 393: รถเพื่อนในโลกขับรถ = โมเดลจริง img/models/car_01.glb (ผู้ใช้สั่ง)
- 1202-1354 สร้างฉาก static ครั้งเดียวต่อโหมด
- 1355-1701 🚗 เมืองกำแพงเพชรจริง (โหมด drive) — ข้อมูล OpenStreetMap ใน js/data/city_kpp.js
- 1702-1768 🧭🕳️ รอบ 782 — ปิดช่องขาดของกริดถนน (ผู้ใช้: "GPS พาไปช่วงที่ถนนขาดตอน / ขับต่อไม่ได้")
- 1769-1975 🌉 รอบ 788 — ปูถนนเชื่อม "เกาะถนนโดดเดี่ยว" เข้าโครงข่ายหลัก
- 1976-2033 🌳🚁 รอบ 811: จุด "พื้นที่สีเขียวข้างถนน" (greenPts) — สุ่มออกจากจุดบนถนนแต่ละจุด
- 2034-2085 🚁🌳 รอบ 816 — บินเฮลิคอปเตอร์เหนือ "เมืองกำแพงเพชร" แล้วลงจอดเก็บตัวอักษรบนพื้นที่สีเขียว
- 2086-2102 🌅 ท้องฟ้าภาพจริง (รอบ 203) — ใส่ภาพ panorama 360° (equirectangular 2:1) เป็นฉากหลังท้องฟ้า
- 2103-2142 🧱 เทกซ์เจอร์ภาพจริง (รอบ 323) — วางไฟล์ `img/tex/<key>.jpg` (หรือ .png) แล้วแปะทับพื้นผิวทันที
- 2143-2637 🌌 ท้องฟ้ากลางคืนโรงแรมผีสิง (รอบ 694) — ผู้ใช้: "ข้างนอกโรงแรมยังไม่น่ากลัวพอ"
- 2638-2676 🏨 โรงแรมผีสิง (รอบ 684) — ตัวตึก 5 ชั้นสร้างใน js/hotel3d.js
- 2677-2837 ตัวอักษรในโลก (8.2)
- 2838-2880 🌳🪙 รอบ 811: ความหนาแน่นเสริมเฉพาะโหมดขับรถ — ผู้ใช้: "เพิ่มตัวอักษรและเหรียญบนถนนและ
- 2881-2948 🔠🪙 เก็บตัวอักษร 1 ตัว = ได้ 1 เหรียญ (รอบ 345)
- 2949-3011 ประกอบคำอัตโนมัติเมื่อมีตัวอักษรครบ (8.1/8.4)
- 3012-3106 โหมด adv: monsters ยิงสู้ได้ (สเปกเดิม 8.5)
- 3107-3114 👻 ผีในโรงแรม (รอบ 684 — เขียนใหม่ทั้งชุด · ผู้ใช้สั่งข้อ 10-13, 18)
- 3115-3243 🧟 โมเดลผี 3D (รอบ 689 — ผู้ใช้สั่ง: "ภาพผีแบน ๆ ไม่สมจริง ไม่น่ากลัว ใช้โมเดลแทน")
- 3244-3480 🔦👻 รอบ 778 (ผู้ใช้สั่งข้อ 4) — กติกาใหม่ของผีเดินเพ่นพ่านในโรงแรม
- 3481-3742 🏨 ระบบโรงแรมผีสิง (รอบ 684) — เดินขึ้นชั้น/ไฟดับ/ไฟฉาย/ตู้เสื้อผ้า/รูปตามอง
- 3743-3976 เสียงหลอนโหมดผีสิง — สังเคราะห์ Web Audio (ปลอดลิขสิทธิ์ 100%)
- 3977-4306 Multiplayer — ผู้เล่นอื่นใน map เดียวกัน (สไตล์ Roblox)
- 4307-4506 Voice chat ใน map — WebRTC P2P mesh (เสียงวิ่งตรงระหว่างเครื่อง)
- 4507-4587 🏁 พิธีประกาศแชมป์ (ครูกด "จบรอบแข่ง") — /class/<map>/podium
- 4588-4794 HUD
- 4795-5441 DOM overlay + CSS (สร้างครั้งเดียว — self-contained ไม่แตะ style.css)
- 5442-5577 Input — เมาส์+คีย์บอร์ด และจอสัมผัส (มือถือ landscape)
- 5578-5582 🚁 โหมดเฮลิคอปเตอร์ Bell — ฟิสิกส์บินแบบอาร์เคด (สไตล์ Helicopter Flight Pilot)
- 5583-5975 🛸 โดรน FPV (โหมด drone) — บินเร็ว/คล่อง ลอดหน้าต่างเข้าตึกร้าง เก็บตัวอักษรในห้อง
- 5976-6098 🚗 โหมดขับรถเมืองกำแพงเพชร — ฟิสิกส์รถอาร์เคด (bicycle model)
- 6099-6192 🚦 รอบ 133: ไฟจราจรจริงที่ทางแยกใหญ่ + ฝ่าไฟแดงโดนใบสั่ง ม.22
- 6193-6640 🧭 GPS นำทาง (โหมด drive) — เลือกตัวอักษรเป้าหมาย + เส้นทางตามถนนจริง (A*) · นำทางด้วยภาพล้วน (ไม่มีเสียงพูด ตั
- 6641-6699 🎛️ เข็มหน้าปัดวิ่งจริง (สปีด 0-180 + วัดรอบ 0-8×1000) — วาดทับวงเกจของภาพ dash.png
- 6700-6784 🎵 รอบ 181: วิทยุในรถ — จอ head-unit กลางคอนโซล (visualizer + เลือกเพลง 3 โหมด)
- 6785-6817 🪞📷 รอบ 810: กระจกมองหลัง/ข้าง — เรนเดอร์ฉากเดิมซ้ำด้วยกล้องหันหลัง/เฉียงข้าง แล้วยัดลงกรอบบนจอ (scissor)
- 6818-6945 🪆 รอบ 191: ตุ๊กตาดุ๊กดิ๊กหน้ารถ — รูปตัวละครที่ผู้เล่นเลือก (blkN.png)
- 6946-7249 🚔 รอบ 128: แผงเตรียมออกรถ + กฎหมายจราจร + ใบสั่ง
- 7250-7292 🛩️📦 ภารกิจไปรษณีย์กลางคืน (รอบ 353) — เฉพาะช่วงฟ้ามืด (heliNight>.5)
- 7293-8507 🚶🛗🚁🪂 โหมดเดินเท้าในเมืองเฮลิฯ (รอบ 354 — ผู้ใช้สั่ง)
- 8508-8581 🎛️ หน้าปัดเข็มขยับจริง (รอบ 61) — วาดสดทุกเฟรมจากค่าการบินจริง
- 8582-8853 🌧️☀️ ชั้นบนกระจก: ที่ปัดน้ำฝน + แสงแดดสาด (รอบ 346)
- 8854-9258 🔊🌧️ เสียงที่ปัดน้ำฝน (รอบ 537) — สังเคราะห์ล้วน ไม่มีไฟล์เสียง
- 9259-9328 📹 กล้องใต้ท้องเครื่อง (belly cam) — รอบ 348
- 9329-9400 🎯 วงเป้าลงจอด (รอบ 349) — ไฮไลต์ดาดฟ้าที่มีตัวอักษร ให้รู้ว่าควรร่อนลงตรงไหน
- 9401-10016 📏 แถบเตือนความเร็วดิ่ง (รอบ 349) — ลงเร็วเกินกรอบกล้องกะพริบแดง สอนให้ร่อนลงนุ่มๆ
- 10017-10019 Loop หลัก
- 10020-11647 ⚽ โหมดสนามฟุตบอล — ฟิสิกส์บอล + เล็ง + ชาร์จพลัง + กล้อง 1st/3rd + ชุดนักเตะ
- 11648-12102 🤖 โหมดหุ่นยนต์นักรบ — เดินยิงเอเลี่ยนตัวอักษร (ต้องยิงเรียงลำดับในคำ)
- 12103-12123 เข้า/ออกโลก
- 12124-12713 ❓ การ์ด "วิธีเล่น" ตอนเข้าโลกครั้งแรก (จำแยกต่อโลกใน localStorage — ไม่แตะ state.js)
### รายการ js/adventure3d.js
GUIDE_WORDS:20 · LETTER_RESPAWN_MS:21 · HALF:22 · PLAYER_SPEED:23 · HAUNT_LIVES:24 · HAUNT_IFRAME:25
PICK_DIST:26 · EYE_H:27 · NET_SEND_MS:28 · MODES:31 · SHOOT_GAP_MS:95 · MONSTER_REWARD:96
AD_COUNT:97 · AD_RENT_COIN:98 · AD_RENT_MS:99 · SHOP_ADS:103 · PILOT_TIERS:105 · pilotEmoji:106
DRONE_R:118 · DRONE_ACCEL:119 · DRONE_VMAX:120 · DRONE_CLIMB:121 · DRONE_YAWSP:122 · DRONE_GRAV:123
CAR_EYE:127 · CAR_ACCEL:128 · CAR_BRAKE:129 · CAR_VMAX:130 · CAR_LEGAL_KMH:131 · CAR_FINE_SPEED:132
CAR_FINE_BELT:133 · CAR_REPAIR_FEE:134 · CAR_FINE_SIGNAL:135 · CAR_RAM_FEE:136 · CAR_FINE_RED:137 · CAR_VMAX_OFF:138
CAR_VREV:139 · CAR_WB:140 · CAR_STEER_MAX:141 · HELI_SKID:176 · HELI_CRASH_FINE:177 · HELI_MESH_SCALE:178
ASSIST_R:182 · PROP_STALL_MS:187 · PROP_BREAK_SPD:190 · PROP_BROKEN_MUL:191 · BAT_DRAIN:194 · BAT_LETTER:195
BAT_LOW:196 · BAT_EMPTY_MUL:197 · CHG_R:200 · GATE_R:203 · showHeliSkip:210 · BOLT_MIN:211
GLASS_HIT_R:212 · DOOR_R:213 · SOCCER_SHIRTS:223 · SOCCER_SHORTS:232 · SOCCER_PATTERNS:237 · BALL_R:256
GOAL_HW:257 · KICK_SPD_MIN:258 · AIM_YAW_SP:259 · SOCCER_TILES:260 · AIM_STICK:268 · CURL_SWIPE:271
CURL_SPIN:272 · HIT_LIFT:276 · GUIDE_N:277 · FK_SPOT_Z:283 · FK_MAN_R:284 · AURA_COST:292
FIRE_CHG:295 · SB_DRAG:303 · SPOST_R:304 · GK_Z:309 · GK_SPRITES:310 · PK_TIME:312
MECHA_EYE:322 · ALIEN_COUNT:323 · MECHA_MAX_HP:324 · MECHA_ATK_RANGE:325 · ALIEN_SHOT_SPD:326 · POWERUP_GAP:327
BOSS_SCALE:328 · COMBO_X2:329 · BOSS_SPECIES:332 · pickBossSpecies:340 · WAVE_BASE_GOAL:342 · waveCfg:343
MECHA_WEAPONS:352 · ATC_REPLIES:381 · ATC_CLOSERS:386 · ATC:391 · netUp:509 · CHAT_MAX:512
doneList:519 · wordPool:520 · pickWords:533 · adRenterActive:545 · FACADE_ROWS:554 · adsFetch:560
adsWatch:572 · adsStop:579 · adsChanged:580 · adRentBuy:591 · heliMusicTick:614 · AD_FLYBY_COIN:618
adFlybyTick:620 · adShopOpen:639 · adShopRender:653 · BLOCK_AVATARS:682 · blkGeo:693 · blkMat:694
blkCyl:695 · blkFaceMat:697 · makeBlockFigure:712 · makeBlockCar:752 · blkNameSprite:798 · makeBlockPeer:814
makeBlockWalkPeer:835 · disposeBlockPeer:843 · mechGlowMat:850 · makeMechaFigure:851 · makeMechaPeer:881 · CAR_GLB_URL:901
CAR_GLB_LEN:902 · carSplitWheel:906 · carGlbEnsure:933 · carMatGet:952 · carGlbBuild:968 · carAvCode:1017
driveCamToggle:1024 · SKID_N:1043 · skidGeomGet:1045 · skidDrop:1050 · skidTick:1064 · blkBuildThumbs:1074
blkBuildPicker:1093 · pickBlockAvatar:1138 · bubbleSprite:1161 · showPeerBubble:1188 · removePeerBubble:1196 · concreteTexture:1206
brokenWindowTexture:1223 · intactGlassTexture:1239 · chargeIconTexture:1257 · rustyDoorTexture:1266 · dAddBox:1280 · buildAbandoned:1287
makeNameSprite:1360 · flatGeom:1373 · flatGeomUV:1382 · buildDriveCity:1392 · HELI_BODY_R:2046 · HELI_KPP_CEIL:2047
heliKppBlocked:2049 · heliKppSpawn:2070 · SKY_IMG:2093 · applySky:2094 · applyTex:2110 · HSKY_R:2157
hskyTex:2159 · buildHauntSky:2164 · tickHauntSky:2294 · buildScene:2312 · randPos:2680 · randRoadPos:2688
randGreenPos:2706 · HOTEL_PER_ROOM:2728 · HOTEL_MIN_GAP:2729 · hotelSpot:2730 · hotelPruneLetters:2765 · spawnLetter:2774
spawnLettersForWord:2820 · ensureCoverage:2822 · DRIVE_LETTER_COPIES:2844 · DRIVE_BONUS_COINS:2845 · ensureDriveAmbience:2846 · removeLetter:2859
spawnLetterAt:2867 · tickLetterRespawns:2875 · LETTER_COIN:2886 · BONUS_COIN_VAL:2887 · pickUpLetter:2888 · letterPop:2913
letterChime:2932 · tryCompleteWords:2952 · completeWord:2966 · spawnMonster:3015 · killMonster:3024 · tickMonsters:3032
damagePlayer:3054 · shoot:3070 · tickShots:3084 · GHOST_GLB_URL:3124 · GHOST_MODEL_H:3125 · ghostGlbEnsure:3127
buildGhostMesh:3153 · makeGhostSprite:3175 · spawnGhost:3193 · applyGhostSize:3218 · faceGhostToPlayer:3229 · setGhostVis:3235
GHOST_MIN_FLOOR:3251 · TORCH_LOCK_S:3252 · BANISH_S:3253 · ghostsAllowed:3255 · hotelCorridorX:3260 · torchHitsGhost:3269
ghostBanish:3276 · ghostGoLurk:3285 · ghostGoStalk:3296 · ghostGoBehind:3309 · tickGhosts:3317 · sessionRecapHtml:3415
hauntRunSec:3422 · fmtSurv:3423 · hauntSurviveFinish:3424 · tickSurvive:3434 · renderHearts:3448 · hotelScare:3454
knockedOut:3474 · BLACKOUT_MS:3496 · FLICKER_MS:3497 · DARK_LETTER:3501 · tintSprite:3502 · hotelReset:3505
setTorch:3529 · toggleTorch:3545 · tickTorch:3550 · hotelBlackout:3560 · hotelFlicker:3576 · tickHotelPlayer:3588
tickHotelWorld:3653 · hotelAct:3696 · openWardrobe:3713 · announceTarget:3736 · netReady:3982 · netJoin:3988
sendPos:4009 · sendChat:4052 · toggleChatBox:4066 · onPeerData:4077 · disposeHeliMesh:4166 · removePeer:4171
netLeave:4186 · tickPeers:4192 · RTC_CFG:4315 · tinvLinked:4316 · partyWord:4323 · syncPartyWord:4336
updateVoiceBtns:4488 · PODIUM_BONUS:4513 · podiumJoin:4515 · podiumLeave:4526 · endRound:4527 · showPodium:4538
tinvCheck:4579 · showBanner:4592 · renderHudTop:4598 · renderHudWords:4603 · renderHudInv:4613 · ddTierFromName:4620
renderBoard:4622 · drawBigMap:4659 · openBigMap:4714 · closeBigMap:4722 · drawMinimap:4727 · loadCarDash:4800
loadCarWheel:4812 · buildDom:4822 · confirmExit:5426 · IS_TOUCH:5445 · HAS_KBD:5447 · bindInput:5448
movePlayer:5543 · tickPlayer:5553 · collideDrone:5586 · propStall:5605 · propBreak:5612 · propFix:5619
droneBatAdd:5626 · lightningBolt:5629 · startRain:5640 · stopRain:5654 · smashGlass:5656 · awardGlass:5667
neededLetter:5684 · openDoor:5699 · raceStartRun:5719 · raceStop:5726 · gateHighlight:5744 · renderRaceHud:5751
tickDrone:5760 · nearMissTick:5903 · showNearMiss:5927 · awardDaredevil:5938 · comboCheer:5955 · comboFlash:5971
driveCell:5980 · nearestStreet:5986 · collideCar:5996 · tlDotY:6027 · tlSet:6031 · driveArms:6048
tlTick:6060 · TL_GREEN:6104 · tlRedDur:6106 · tlightPhase:6107 · buildTrafficLights:6114 · rlTick:6166
cellDrivable:6198 · cellWeight:6201 · cellBlocked:6206 · cellCenter:6207 · posReachable:6209 · losClear:6220
nearestDrivableCell:6231 · routeGrid:6243 · pickGpsTarget:6296 · NAVLINE_W:6319 · NAVLINE_SKIP:6320 · navLineEnsure:6321
navLineHide:6331 · navLineUpdate:6332 · tickGps:6368 · tickDrive:6439 · drawCarDial:6647 · drawCarGauges:6677
RADIO_RECT:6705 · CAR_RADIO_RECT:6707 · carRadioRect:6713 · radioLayout:6715 · radioSetHint:6738 · renderRadioList:6744
radioToggleList:6754 · drawRadioViz:6759 · radioTick:6777 · MIRROR_REAR:6791 · mirrorPass:6793 · drawCarMirrors:6805
BOBBLE_FOOT:6823 · BOBBLE_H:6824 · BOBBLE_ASPECT:6825 · BOB_OMEGA:6828 · BOB_PITCH_FORCE:6830 · BOBBLE_SKINS:6832
bobbleSetAvatar:6839 · bobbleLayout:6846 · bobbleTick:6859 · bobblePoke:6884 · bobbleApplySkin:6901 · dollOwned:6911
openDollPicker:6912 · carStartShow:6949 · showLawInfo:6967 · lawNotice:6989 · driveFineSettle:6999 · HELI_PHASES:7178
heliStartPhase:7185 · heliFloorAt:7192 · SOFT_TIERS:7202 · softLandBonus:7204 · awardPerfLand:7217 · setHeliLight:7236
MAIL_COIN:7255 · mailStart:7257 · mailStop:7280 · mailTick:7281 · FOOT_EYE:7300 · doorSlideSfx:7306
doorLerp:7329 · entLerp:7337 · footStepSfx:7347 · WRING_COIN:7368 · festivalPaint:7372 · dustTexture:7384
dustBurst:7393 · dustTick:7407 · HELI_GLB_URL:7428 · HELI_GLB_TEX_BLUE:7430 · HELI_GLB_ROTOR:7432 · HELI_GLB_TROTOR:7433
heliGlbEnsure:7435 · heliMatBlueGet:7453 · heliGlbAssemble:7466 · heliNavTick:7505 · peerRotorStop:7512 · peerRotorTick:7518
heliCrashSfx:7537 · heliMeshBuild:7565 · heliMeshBuildLegacy:7576 · buildHeliFoot:7706 · footFloorAt:7822 · insideTerm:7829
inDoorZone:7830 · footHint:7834 · setFootBtns:7835 · liftStart:7840 · beginRide:7851 · endRide:7874
beginWing:7885 · awardAirLetter:7898 · paxChoiceShow:7917 · paxChoiceHide:7943 · pilotShipMesh:7947 · beginPilot:7948
endPilot:7980 · drawCabinWindow:8004 · tickHeliFoot:8028 · heliWallPenalty:8239 · tickHeli:8251 · CP_NAT:8516
CP_GAUGES:8517 · SEAT_LABEL:8530 · SEAT_P_FULL:8531 · SEAT_ZOOM:8532 · DASH_OFF_Y:8533 · DASH_DROP:8534
setSeat:8536 · layoutCockpit:8548 · WIPER:8587 · WIPER_SPD:8590 · WIPER_LABEL:8591 · INT_GAP:8592
WASH_MS:8596 · WASH_TANK_MAX:8600 · SMEAR_LIFE:8612 · CHOP_MIN:8613 · SUN_RAY_FAR:8617 · sunRayBlocked:8619
sunShadeTick:8638 · applyCockpitShade:8649 · rotorChop:8661 · sunUpdate:8669 · HELI_FOG_N0:8680 · fogUpdate:8684
adGlowPulse:8732 · RAIN_MAX:8741 · VISOR_Y:8742 · RAIN_MIN:8743 · RAIN_DUR:8744 · DROP_ZONE:8748
addDrop:8749 · tickDrops:8757 · addWashDrop:8775 · washStart:8782 · renderWashGauge:8802 · washTick:8813
grimeTick:8830 · WIPE_R:8837 · wipeDrops:8838 · wiperSndOn:8861 · wiperSndOff:8873 · wiperThunk:8879
washSpraySfx:8891 · wiperSqueak:8908 · wiperSndTick:8925 · setWiper:8945 · tickWiper:8957 · SH_SWEEP:8988
shadowSweepTick:8990 · REFL_MAX:9002 · REFL_COL:9004 · cityGlowLevel:9005 · drawCityGlow:9010 · setVisor:9042
rainTick:9048 · drawBlade:9065 · drawSmears:9084 · drawGlass:9104 · drawBellyCam:9266 · drawBellyHud:9289
drawLandingTargets:9335 · VS_HARD:9405 · drawDescentBar:9406 · heliShake:9455 · cpNeedle:9466 · drawGauges:9483
XF_START:9531 · PRELOAD_WAIT:9532 · ALT_QUIET_FROM:9534 · ALT_MAX_DAMP:9535 · ALT_LP_MIN:9536 · ECHO_NEAR:9537
WIND_FULL_SPD:9538 · SHUTDOWN_SEC:9539 · PAN_MAX:9541 · OD_RPM:9542 · SHAKE_RPM:9543 · SHAKE_HIT:9544
soccerLetterPos:10024 · letterNeeded:10032 · soccerNeededSet:10041 · soccerTileGeo:10049 · soccerGoldTexture:10051 · makeSoccerTile:10068
soccerRefreshSkins:10077 · soccerBuildTargets:10084 · soccerNextTile:10094 · soccerRetarget:10110 · soccerCoinPop:10122 · soccerGrassTexture:10135
soccerTurfGrade:10157 · soccerTurfTexture:10208 · grassNormalTexture:10227 · soccerLinesTexture:10256 · soccerNetTexture:10307 · soccerCrowdTexture:10315
soccerBallMat:10334 · buildSoccerGoal:10354 · buildStands:10373 · soccerLedBoards:10408 · soccerGKEnsure:10505 · soccerGKTick:10521
fkBuildWall:10550 · fkToggle:10565 · fkHitTest:10581 · pkHud:10600 · pkStart:10609 · pkEnd:10623
pkTick:10638 · repQualify:10645 · repEnsureEl:10648 · repStart:10659 · repTick:10666 · soccerNumTex:10691
ssSec:10703 · ssPaintPattern:10708 · soccerShirtTex:10721 · makeSoccerPlayer:10743 · soccerNewSpot:10779 · soccerResetBall:10791
soccerKick:10798 · soccerCheer:10816 · guideTexture:10819 · auraActive:10843 · auraLeftMs:10844 · auraFlameTex:10852
auraCoilTex:10876 · auraCoilRibbon:10900 · auraGlintTex:10924 · buildAura:10935 · auraBuy:10978 · auraRender:10988
auraTick:11002 · buildDrill:11053 · drillTick:11066 · ballFXTex:11106 · buildBallFX:11117 · smokePuff:11133
ballFXTick:11141 · buildLandRing:11187 · buildGuideRibbon:11197 · renderSpinPad:11222 · spinPadToggle:11234 · spinPadPick:11240
renderCurl:11252 · kickLaunch:11263 · updateSoccerGuide:11272 · soccerCamera:11336 · tickSoccer:11359 · ssShirtPath:11553
ssShortsPath:11561 · ssPaintSwatchShirt:11566 · ssPaintSwatchShorts:11571 · ssPreviewDraw:11578 · soccerKitShow:11607 · soccerKitGo:11636
emojiSprite:11689 · makeAlien:11694 · startWave:11727 · waveSpawnFill:11738 · waveComplete:11747 · updateWaveHud:11757
checkMechaBossBadge:11759 · alienSpawnPos:11768 · removeAlien:11773 · mechaHudWord:11778 · setMechaHudSkin:11786 · mechaComboPop:11798
mechaShielded:11803 · mechaDamageFx:11805 · mechaHitByAlien:11810 · spawnAlienShot:11816 · removeAlienShot:11826 · tickAlienShots:11831
spawnPowerup:11843 · removePowerup:11856 · collectPowerup:11861 · tickPowerups:11868 · updateMechaHud:11877 · mechaTracer:11917
mechaFire:11926 · explodeAlien:11963 · tickMecha:11993 · loop:12049 · grabShot:12083 · savePhoto:12094
clearEntities:12106 · INTRO_KEY:12128 · introSeenObj:12129 · introSeen:12130 · markIntroSeen:12131 · INTRO:12132
INTRO_MODE:12134 · showIntro:12136 · HELI_KPP_BANNER:12162 · closeIntro:12164 · beginPlay:12170 · start:12172
exitWorld:12399 · mechaRecapLine:12471

## js/auth.js (404 บรรทัด · 34 รายการ)
AUTH_PUSH_MS:23 · AUTH_SDK_TIMEOUT_MS:24 · TEACHER_EMAILS:28 · isTeacher:29 · TESTER_EMAILS:42 · TESTER_COINS:43
isTester:44 · testerBoost:48 · authSetStatus:74 · authShowLogin:86 · authGateOffline:90 · authSaveRef:97
authFetchCloud:98 · authWriteCloud:99 · authDeleteCloud:100 · authWriteProfileName:101 · authPushProfile:108 · authApplyProfileName:116
authAskProfileName:132 · authEditProfileName:143 · authStart:154 · updateOfflinePill:184 · authEnterOffline:189 · authLateSync:206
authIsAppMode:226 · AUTH_REDIRECT_CODES:234 · authLoginClick:236 · authOnLogin:256 · authSyncOnLogin:269 · authFreshStart:298
authAskLink:307 · authEnterGame:357 · authPushSave:372 · authLogout:383

## js/award.js (271 บรรทัด · 0 รายการ)

## js/bandadv.js (447 บรรทัด · 28 รายการ)
BAND_ADV_REWARD:9 · bandAdvFailMsg:16 · bandAdvLoad:23 · bandAdvPlay:61 · BAND_ADV_EXAM:76 · bandAdvExamId:81
bandAdvExamName:83 · BAND_ADV_SUPREME_BONUS:90 · bandAdvCheckSupreme:91 · bandAdvExamLock:107 · bandAdvExamBest:116 · bandAdvExamCat:129
bandAdvShowExamSummary:150 · bigExamBadgeNote:178 · BXR_TOP:197 · BXR_READ:198 · bxrKey:202 · bxrSubmit:206
bxrMerge:233 · bxrFetch:249 · bxrRowHTML:270 · bxRankBodyHTML:282 · bxRankMount:297 · bxRankNote:329
bxRankNoteRefresh:338 · openBigExamRank:345 · bandAdvExamOpen:362 · bandAdvCardsHTML:416

## js/cert.js (655 บรรทัด · 32 รายการ)
CERT_MAX:17 · CERT_ISSUER_EN:18 · CERT_MONTHS:19 · CERT_TOPIC_EN:23 · CERT_LEVEL_EN:44 · CERT_ADV_EN:49
CERT_BIG_LV:56 · CERT_STD_EN:59 · certThIndex:67 · certTitleOf:76 · certSerial:102 · certDateEN:110
certTier:118 · CERT_TIER_META:125 · CERT_LOGO_SRC:131 · certAward:140 · certMine:166 · certAwardGold:173
certAwardAdvSupreme:194 · certBackfill:210 · certCatNameById:238 · certFromPost:263 · certXML:281 · certFit:286
certFitMeasured:292 · certHolder:301 · certSVG:311 · certChipHTML:593 · openCertBig:609 · openCertMine:625
certStripHTML:633 · certBindStrip:647

## js/city3d.js (3,228 บรรทัด · 204 รายการ)
### 🗂️ สารบัญโซน js/city3d.js (Read/Edit เฉพาะช่วง)
- 2-18 city3d.js — 🏙️ VOCAB CITY: ล็อบบี้ 3D แบบเมืองลอยฟ้า (index.html = หน้าหลัก · รอบ 861 · สลับเป็นหน้าหลักรอบ 86
- 19-101 ⚙️ CONFIG + เครื่องมือกลาง (รอบ 861)
- 102-204 📷 CAMERA RIG — 1 นิ้วเลื่อน · 2 นิ้วหมุน/เอียง/ซูม (รอบ 861)
- 205-362 🖼️ CANVAS TEXTURE โรงงานผิวสัมผัส (พื้นเกาะ/หน้าต่างตึก/ป้าย)
- 363-423 🏗️ BUILDERS — อาคารแต่ละแบบ (ห้ามกล่องเปล่าแปะ texture — มีชั้นเชิง/ระเบียง/หลังคา/ป้ายจริง)
- 424-812 🚪🌀 รอบ 897: ประตูม้วนเลื่อนขึ้น (โรงรถ/โรงเก็บยาน) — บานพับหมุนไม่ได้เพราะช่องกว้าง 3-5 เมตร
- 813-909 🚗🏍️🚁🛸 ยานพาหนะจิ๋ว (ผู้เล่นจริงจากโลก 3D จะขับ/บินสิ่งเหล่านี้ในเมือง)
- 910-966 🧍 ตัวละครผู้เล่น — blk1-8 = หุ่นบล็อก 3D · blk9-88 = ป้ายภาพ 2D ตั้งในโลก
- 967-1278 🌆 ผังเมือง — อาคารทุกหลังผูก go=<key> (ตัวรับใน js/main.js)
- 1279-1423 🎉 เทศกาลตามวันที่จริง — พลุปีใหม่ / สงกรานต์ / ลอยกระทง (รอบ 863)
- 1424-1682 🧑‍🤝‍🧑 ผู้เล่นจริง (อ่านอย่างเดียว) — presence→ยืนตามอาคาร · world→ขับ/บินในเมือง
- 1683-1839 💬 รอบ 866: บับเบิลแชทสดลอยหัวเพื่อนในเมือง
- 1840-1996 🖊️💬 รอบ 868: พิมพ์ตอบแชทได้จากในเมือง (ไม่ต้องกลับล็อบบี้เดิม)
- 1997-2146 💬🔴 รอบ 873: ไอคอน "มีข้อความค้าง ยังไม่ได้อ่าน" ลอยเหนือหัวเพื่อน
- 2147-2164 🚪 รอบ 870: กลับจากล็อบบี้เดิม → โผล่ที่ "หน้าประตูตึกที่เพิ่งเข้า"
- 2165-2399 🚪🔊 รอบ 890: บานประตูตึกเปิด-ปิดจริง + เสียงประตูสังเคราะห์เอง
- 2400-2531 🚗🤖🛸 รอบ 900: ยานพาหนะแล่นออกจากช่องประตูม้วนที่เพิ่งเปิด → จอดรอหน้าประตู
- 2532-2699 🚶 รอบ 866: ตัวเราเดินไปหน้าตึกก่อน แล้วค่อยเข้าหน้านั้น
- 2700-2784 🚪🚶 รอบ 886: กลับจากล็อบบี้เดิม → "เดินออกจากตึกมาหน้าประตู" (walkSelfTo ย้อนทาง)
- 2785-2947 👆 แตะ/คลิก: ตัวละคร→การ์ดโปรไฟล์ · อาคาร→เดินทางไปหน้านั้น · พื้น→ประกายดาว
- 2948-2994 🎵 รอบ 873: เพลงประกอบเมือง (BGM) — ปุ่มเปิด/ปิดมุมขวาล่าง
- 2995-3030 🚀 BOOT
- 3031-3228 🎬 รอบ 880: กลับจากล็อบบี้เดิม → จอเปิดคือ "ภาพเมืองใบที่เพิ่งเดินออกไป"
### รายการ js/city3d.js
ISLAND_R:22 · RING_IN:23 · BAND1_R:24 · GROUND_TEX_PX:25 · NIGHT:26 · esc:45
hash:46 · rnd:47 · clamp:48 · TAU:49 · BLK8:53 · CAR_COL:64
gradeStars:69 · MAT:87 · mat:88 · GEO:92 · box:93 · cyl:94
M:95 · groundAt:126 · setupInput:135 · twoState:197 · cvs:208 · ctex:209
groundTexture:216 · wallTex:270 · wallMat:289 · shopSign:294 · roundRect:304 · iconSprite:311
nameSprite:327 · blobShadow:349 · parapet:371 · roofProps:376 · DOOR_W:388 · doorNightFx:392
doorAt:409 · ROLL_Z_HOLE:433 · slatTexture:436 · rollAt:446 · awning:470 · bTower:482
bShop:502 · bHouse:520 · bLibrary:536 · bFactory:554 · bArcade:581 · bObservatory:598
bHallOfFame:612 · bHaunted:633 · bHeliport:651 · bGarage:668 · bStadium:683 · bMotoTrack:705
bUfo:726 · bHangar:746 · bJungleGate:769 · bDronePad:791 · miniCar:816 · miniMoto:835
miniHeli:855 · miniDrone:875 · miniMecha:890 · makeBlockFigure:914 · makeSpriteFigure:950 · makeFigure:959
pickBlk:962 · bld:970 · BUILDINGS:971 · BLD_AT:1050 · buildCity:1052 · buildPlaza:1103
buildGreens:1149 · _glowTex:1194 · buildSky:1204 · buildAmbientTraffic:1266 · FESTIVAL:1283 · buildFestival:1295
buildFireworks:1302 · buildSongkranDeco:1344 · buildLoiKrathongDeco:1376 · actBuilding:1447 · loadFirebase:1456 · liveStart:1464
lbGet:1479 · watchPresence:1489 · spawnStander:1513 · WORLD_MAPS:1548 · pollWorlds:1555 · spawnVehicle:1606
removeActor:1666 · markPickable:1679 · BUB_MS:1692 · BUB_FRESH:1693 · BUB_MAXCH:1694 · BUB_MAX:1695
BUB_TEX_KEEP:1696 · bubTexture:1702 · bubTexRelease:1714 · bubbleSprite:1719 · bubDraw:1728 · killBubble:1755
showBubble:1768 · flushBubble:1806 · watchFriendChats:1814 · CITY_CHAT_MAX:1853 · CITY_QUICK_REPLIES:1855 · bubSafeText:1858
actorInfo:1864 · chatBoxCanSend:1874 · chatBoxWhy:1878 · chatBoxRefresh:1884 · openChatBox:1921 · closeChatBox:1933
cbNote:1938 · sendCityChatText:1944 · sendCityChat:1974 · cityStopLive:1979 · SAVE_KEY:2008 · saveRead:2011
pairIdOf:2014 · chatSeenTsCity:2016 · chatMarkSeenCity:2022 · unreadTexture:2035 · addUnreadBadge:2053 · removeUnreadBadge:2074
setUnread:2084 · applyUnread:2090 · markReadCity:2092 · unreadCount:2100 · spawnSelf:2106 · DOOR_MEM:2157
rememberDoor:2158 · lastDoorKey:2159 · DOOR_SWING:2181 · DOOR_OPEN_S:2182 · DOOR_SHUT_S:2183 · DOOR_AJAR:2187
AJAR_QUIET_MS:2188 · ROLL_OPEN_S:2193 · ROLL_SHUT_S:2194 · ROLL_LIFT:2195 · ROLL_AJAR:2196 · registerDoor:2199
doorLeadS:2212 · doorSpillTexture:2218 · doorCreakSfx:2229 · doorLatchSfx:2247 · shutterRollSfx:2270 · shutterClunkSfx:2297
doorMoveSfx:2320 · setCityDoor:2327 · openCityDoor:2338 · closeCityDoor:2339 · setDoorRest:2341 · refreshDoorRest:2353
applyDoorPose:2363 · RIDE_GATE:2415 · RIDE_OUT_S:2416 · RIDE_PARK_S:2417 · DOOR_RIDES:2420 · rideLeadS:2430
rideSfx:2435 · ridePose:2460 · launchRide:2477 · releaseRide:2489 · WALK_SPD:2538 · WALK_MIN:2539
WALK_MAX:2540 · DOOR_GAP:2541 · RECEPTION_SPOT:2545 · doorSpotOf:2546 · walkPose:2557 · footCtx:2572
footStepSfx:2577 · footDustTexture:2598 · footDustPuff:2607 · footDustTick:2621 · FOOT_STEP_DIST:2636 · DOOR_OPEN_AT:2637
walkSelfTo:2639 · EXIT_BACK:2711 · EXIT_DUR:2712 · EXIT_STEP:2713 · EXIT_CLEAR:2714 · EXIT_SHUT:2715
stageExitWalk:2718 · walkSelfOut:2730 · onTap:2788 · captureCityShot:2807 · travelTo:2840 · sparkleAt:2876
openProfile:2900 · refreshChip:2939 · setChip:2943 · BGM_KEY:2954 · bgmWant:2956 · bgmEnsure:2957
BGM_DEV:2966 · bgmPlay:2967 · bgmRefreshBtn:2968 · bgmToggle:2975 · bgmSetup:2980 · boot:2998

## js/dictband.js (410 บรรทัด · 27 รายการ)
BAND_EMOJI:12 · BAND_SET_REWARD:13 · BAND_DONE_BONUS:14 · bandFailMsg:21 · bandLoad:28 · bandShortTH:60
bandCat:68 · bandSets:90 · bandSetId:99 · bandCheckComplete:102 · bandSetCat:119 · BAND_RETAKE_MAX:131
bandTriedSets:132 · bandRetakeCat:143 · bandShowRetakeSummary:177 · bandSetsPassed:205 · openBandSetPicker:213 · bandMine:285
bandUnlocked:286 · bandLockToast:291 · bandExamLobby:297 · updateBandExamBtn:306 · bandLobbyTick:323 · bandPlay:334
bandSpeakSample:346 · bandPlayLobby:366 · bandCardsHTML:378

## js/examstd.js (942 บรรทัด · 49 รายการ)
XS_PASS_PCT:15 · XS_REWARD:16 · XS_REWARD_AGAIN:17 · XS_TIME_HINT:21 · XS_TIME_FALLBACK:22 · xsLimitSec:23
XS_SCALE:27 · xsScaleText:33 · xsFindSet:44 · examStdLoad:56 · xsFailMsg:91 · xsQuizId:99
xsBest:101 · XS_HIST_MAX:116 · xsHistory:117 · xsHistorySVG:126 · xsIsPractice:158 · xsTimerStop:160
xsElapsed:161 · xsFmt:162 · xsMark:169 · xsSecStats:175 · examStdStart:189 · xsBuildScreen:209
xsTimeUp:281 · xsRender:290 · xsChoose:366 · xsGo:378 · xsQuitAsk:394 · xsClose:402
xsSubmitAsk:408 · xsFinish:423 · xsTimeTableHTML:517 · xsShowReview:541 · openExamStdPicker:607 · XRK_READ:673
XRK_ALL:674 · xrkSubmit:682 · xrkMerge:710 · xrkAllRows:729 · xrkFetch:747 · xrkNote:773
xrkNoteRefresh:784 · xrkAllRowHTML:793 · xrkBodyHTML:797 · xrkMount:812 · openExamStdRank:851 · examStdCardsHTML:868
openExamStdBoard:903

## js/f1_3d.js (3,227 บรรทัด · 255 รายการ)
### 🗂️ สารบัญโซน js/f1_3d.js (Read/Edit เฉพาะช่วง)
- 19-139 ⚙️ ค่าคงที่ (TUNE ZONE)
- 140-183 📦 สถานะโลก
- 184-328 🔊 เสียงสังเคราะห์ (เครื่องยนต์ V6 hybrid / สกิด / kerb / ลม)
- 329-447 🖼️ texture: probe img/f1/*.jpg ก่อน → ไม่มีใช้ canvas วาดเอง
- 448-474 ✏️ sprite ตัวอักษร / ป้ายชื่อ (canvas → sprite)
- 475-565 🛣️ เส้นแทร็ก: F1_MAP.track (จุดจริง OSM) → sample ทุก 5 ม.
- 566-840 🏗️ สร้างฉาก: แทร็ก + kerb + runoff + อาคารจริง + ไฟ + ทะเลทราย
- 841-950 🏎️ โมเดลรถ: GLB ผู้ใช้ (img/models/f1_car.glb) → ไม่มี = ประกอบเอง
- 951-1305 🖥️ DOM + CSS (เต็มจอ ไม่มีกรอบเครื่องเกม)
- 1306-1463 🌍 สร้างโลกครั้งเดียว
- 1464-1647 🪽 รอบ 904: DRS — ปีกหลังเปิดบนทางตรง (ตามรถเพื่อนใกล้ 25 ม.)
- 1648-1804 🤖🏎️ รอบ 912: รถบอต 4 คันวิ่งตามเส้น LINE — ให้ผู้เล่นไล่แซง + นับเป็น "รถข้างหน้า" ของ DRS (รอบ 904)
- 1805-1989 🏁 ฟิสิกส์ + จับเวลา
- 1990-2077 🏆 รอบ 903: กระดานอันดับ Best Lap ออนไลน์ (/f1Rank)
- 2078-2240 🚦👻 รอบ 902: ลำดับออกสตาร์ท (ไฟแดง 5 ดวง) + รถเงาวิ่งตาม Best Lap
- 2241-2443 🛞🔧 รอบ 905: ยางสึก + พิทสต็อปเปลี่ยนยาง
- 2444-2528 🔤 คำศัพท์บนแทร็ก (แบบเดียวกับโลกมอเตอร์ไซค์ — REWARD สูงกว่า)
- 2529-2678 🧑‍🤝‍🧑 เพื่อนร่วมสนาม (NetRoom map 'f1')
- 2679-2802 📷 กล้องไล่หลัง + ลูปเกม
- 2803-2909 🔢 รอบ 916 — จอบนพวงมาลัยเป็น "ของจริง"
- 2910-3038 🚥 รอบ 918: แถบไฟ LED รอบเครื่องบนพวงมาลัย (เขียว → เหลือง → แดง ตอนใกล้เปลี่ยนเกียร์)
- 3039-3227 🚪 เข้า/ออกโลก
### รายการ js/f1_3d.js
REWARD:22 · LETTER_COIN:23 · LETTER_COPIES:24 · COLLECT_R:25 · DONE_KEY:26 · HALF_W:27
KERB_W:28 · RUNOFF_W:29 · SAMPLE_M:30 · FP_EYE:32 · FP_FWD:33 · FP_LOOK:34
FP_DROP:35 · FP_FOV:36 · ROAD_EYE:39 · ROAD_DROP:40 · ROAD_FOV:41 · REV_A:43
REV_MAX:44 · OFFTRACK_S:45 · FPW_F:46 · FPW_S:47 · FPW_R:48 · FPW_H:49
WHEEL_HUB_X:52 · WHEEL_HUB_Y:53 · WHEEL_RATIO:54 · WHEEL_MAX_DEG:55 · LED_GREEN_N:59 · LED_AMBER_N:60
LED_SHIFT_R:61 · LED_FLASH_HZ:63 · LED_K_LO:64 · LED_K_SPAN:65 · LED_RPM_LERP:66 · F1_LEDS:67
WHEEL_IMG_W:76 · DASH_PX:77 · DASH_LED_N:78 · DASH_RPM_MIN:79 · DASH_RPM_MAX:80 · SHAKE_KERB_AMP:82
SHAKE_SAND_AMP:83 · SHAKE_SPD_REF:84 · SHAKE_HZ:85 · WHEEL_SHAKE_KERB_PX:87 · WHEEL_SHAKE_SAND_PX:88 · PWR_A:90
ACC_CAP:91 · DRAG_K:92 · ROLL_A:93 · BRAKE_A:94 · BRAKE_DF:95 · COAST_A:98
COAST_STOP:99 · GRIP_BASE:100 · GRIP_DF:101 · GRIP_CAP:102 · STEER_MAX:104 · STEER_HI:105
SURF_RUNOFF:106 · SURF_SAND:107 · NET_SEND_MS:108 · ROOM_MAX:109 · CHAT_MS:110 · CHAT_PRESETS:111
PEER_COLORS:112 · GRID_N:113 · LIGHT_LEAD_S:115 · LIGHT_STEP_S:116 · LIGHT_HOLD_MIN:117 · LIGHT_HOLD_MAX:118
JUMP_PENALTY_S:119 · GHOST_HZ:121 · GHOST_MAX:122 · GHOST_KEY:123 · TYRE_W_SLIDE:125 · TYRE_W_ROLL:126
TYRE_W_KERB:127 · TYRE_W_SAND:128 · TYRE_GRIP_MIN:129 · TYRE_WARN:130 · PIT_HALF_W:131 · SURF_PIT:132
PIT_LIMIT:133 · PIT_BOX_AT:134 · PIT_BOX_R:135 · PIT_STOP_V:136 · PIT_CANCEL_V:137 · PIT_STOP_S:138
LINE:159 · PITL:173 · GEARS:326 · gearOf:327 · matLam:336 · matLit:342
applyTex:347 · texFromCanvas:351 · texProbe:359 · asphaltTex:370 · kerbTex:385 · sandTex:391
crowdTex:400 · garageTex:411 · towerTex:422 · adTex:431 · tentTex:438 · letterTexture:451
makeTextSprite:461 · cr:479 · buildLine:483 · nearIdx:522 · surfAt:553 · ribbonGeo:569
kerbStrips:590 · extrudeFootprint:625 · polyCentroid:636 · buildBuildings:640 · buildTrackScene:690 · glbEnsure:844
buildF1Car:858 · makeCar:930 · CSS:954 · buildDom:1154 · build:1309 · mapBounds:1425
mapXY:1433 · drawMap:1436 · DRS_ZONES_N:1472 · DRS_CURV:1473 · DRS_GAP_MAX:1474 · DRS_MIN_M:1475
DRS_ENTRY_M:1476 · DRS_NEAR_M:1477 · DRS_DRAG_K:1478 · DRS_FLAP_SHUT:1480 · DRS_FLAP_OPEN:1481 · attachDrsGlow:1486
findDrsZones:1496 · DRS_DET_M:1527 · DRS_SIGN_KIND:1528 · drsDetIdx:1535 · drsSignTex:1539 · buildDrsBoards:1551
drsZoneAt:1593 · drsPeerGap:1602 · drsTick:1623 · drsHud:1638 · BOT_N:1658 · BOT_SKILL:1659
BOT_NAMES:1660 · BOT_COLORS:1661 · BOT_LANE:1662 · BOT_VMAX:1663 · BOT_GRIP:1664 · BOT_ACC_K:1665
BOT_BRAKE:1666 · BOT_START_GAP:1667 · BOT_REACT:1668 · BOT_WOB:1669 · BOT_PASS_R:1670 · botProfileBuild:1674
botEnsure:1703 · botIdxAt:1721 · botPlace:1730 · botRel:1749 · botBanner:1753 · botReset:1761
botHide:1775 · botTick:1778 · respawnOnTrack:1809 · physTick:1821 · progressTick:1916 · fmtLap:1964
puffSmoke:1970 · smokeTick:1979 · FR_READ:1998 · frSubmit:2000 · frMerge:2015 · frFetch:2026
frRowHTML:2044 · frBodyHTML:2053 · frNote:2062 · frMount:2067 · resetLights:2087 · beginLights:2094
lightsLocked:2095 · paintLights:2096 · lightsTick:2106 · ghostEnsure:2155 · ghostHide:2172 · ghostLoad:2177
ghostSave:2186 · ghostReset:2189 · ghostRecord:2193 · ghostKeep:2202 · ghostGapAt:2209 · ghostTick:2217
buildPitLine:2252 · pitAt:2292 · inPitLane:2303 · pitBoxTex:2310 · buildPitBox:2333 · setPitSign:2359
tyreWear:2364 · tyreGrip:2373 · pitTick:2375 · pitHud:2405 · tyreHud:2426 · tyreReset:2436
trackPointAhead:2447 · pickWord:2453 · spawnLetters:2463 · renderWordHud:2476 · collectTick:2482 · completeWord:2500
relocTick:2517 · netReady:2532 · netJoin:2537 · netSend:2550 · sendChat:2561 · peerColor:2568
buildPeer:2572 · onPeer:2593 · showPeerBubble:2613 · removePeerBubble:2620 · dropPeer:2626 · peerTick:2634
netLeave:2654 · renderBoard:2658 · CAM_MODES:2684 · CAM_NEXT_LABEL:2685 · cycleCamMode:2686 · applyCamMode:2690
buildFpWheels:2701 · fpWheelTick:2732 · cockpitBox:2745 · layoutWheel:2760 · wheelTick:2782 · DASH_FONT:2809
layoutDash:2810 · dashRR:2824 · dashRpmTick:2831 · dashTick:2841 · drawDash:2857 · buildLeds:2915
ledsOff:2923 · ledTick:2927 · camTick:2954 · hudTick:2994 · frame:3005 · tick:3024
fit:3031 · start:3042 · exitWorld:3106

## js/game.js (1,115 บรรทัด · 79 รายการ)
REPLAY_BONUS_EVERY:23 · REPLAY_BONUS_TIERS:25 · replayBonusFor:26 · SESSION_MILESTONES:32 · addSessionCoins:35 · updateBestTarget:74
weekKeyStr:87 · rolloverWeekBest:93 · exitGame:99 · showSessionSummary:135 · sprinkleConfetti:182 · VOCAB_PER_LEVEL:201
VOCAB_RANK_NAMES:202 · vocabRankName:203 · showProgressReport:205 · THUNDER_MS:386 · THUNDER_TIERS:390 · THUNDER_TIER_UI:391
thunderEmoji:392 · DAREDEVIL_TIERS:396 · DAREDEVIL_TIER_UI:397 · daredevilEmoji:398 · GLASS_TIERS:402 · GLASS_TIER_UI:403
glassEmoji:404 · DILIGENT_TIERS:408 · DILIGENT_TIER_UI:409 · diligentEmoji:410 · SOFTLAND_TIERS:414 · SOFTLAND_TIER_UI:415
softLandEmoji:416 · AIRL_TIERS:420 · AIRL_TIER_UI:421 · airLetterEmoji:422 · MECHABOSS_TIERS:426 · MECHABOSS_TIER_UI:427
mechaBossEmoji:428 · TYPIST_TIERS:435 · TYPIST_TIER_UI:436 · typistEmoji:438 · checkTypistBadge:440 · BIGEXAM_TIERS:456
BIGEXAM_TIER_UI:457 · bigExamEmoji:458 · bigExamCertCount:460 · checkBigExamBadge:465 · BFF_TIERS:480 · BFF_TIER_UI:481
BFF_COIN:482 · bffEmoji:483 · badgeSuffix:488 · BADGE_META:505 · NAME_BADGE_RE:522 · splitNameBadges:523
badgeEmojis:529 · badgeScore:534 · BADGE_CATS:541 · bcatLevel:554 · checkCrown:561 · currentBadgeScore:577
rolloverBadgeWeek:581 · addDiligent:594 · celebrateBadge:610 · addThunder:624 · startGame:638 · newRound:678
updateTimerBar:717 · updateComboPill:723 · pickCard:727 · checkMatch:739 · renderCats:853 · fmtMMSS:903
quizTimerStop:907 · quizTimerStart:912 · quizElapsed:922 · startQuiz:926 · renderQuizQuestion:944 · quizNext:1008
finishQuiz:1021

## js/gradelock.js (158 บรรทัด · 14 รายการ)
GRADES:21 · GRADE_LOCK_DAYS:25 · GRADE_LOCK_MS:26 · gradeRank:29 · myGrade:30 · gradeHistList:33
gradeLockLeftMs:43 · gradeLockLeftDays:50 · gradeUnlockAt:51 · gradeLocked:52 · gradeUpOptions:55 · gradeChangeTo:62
gradeLockNote:86 · openGradeChange:94

## js/hotel3d.js (888 บรรทัด · 47 รายการ)
TEX:25 · FLOOR_H:28 · WEST:31 · SHAFT_E:32 · CORE_E:33 · RZ0:34
LZ0:35 · ST_LAND:43 · ST_XW:44 · ST_XE:45 · ST_RUN:46 · ST_RISE:47
ST_STEPS:48 · ST_GAP0:49 · ST_ZMID:50 · ROOM_N:51 · DOOR_W:54 · ENTRY_HW:55
PLAYER_R:56 · floorY:57 · Acc:64 · accBox:65 · accGeo:81 · accMesh:89
makeMats:100 · PORTRAIT_PHOTOS:145 · EYE_R0:154 · PORTRAIT_EYE:155 · PORTRAIT_SKIN:163 · PORTRAIT_CLOTH:164
portraitTexture:165 · signTexture:204 · build:218 · inRect:703 · insideHotel:704 · surfaceY:707
collide:739 · roomAt:759 · floorOf:767 · setLights:772 · BLINK_DUR:785 · BLINK_MIN:786
tick:788 · nearWardrobe:859 · inLift:870 · atLiftDoor:874 · randomHaunt:878

## js/images.js (211 บรรทัด · 23 รายการ)
IMG_FILES:11 · MOODS:12 · startImgKey:14 · petImageKeys:16 · probeImages:28 · probeRankImages:40
probeCollectImages:41 · probeGiftImages:42 · probeHomeImages:43 · CLIP_FILES:52 · CLIP_SM:58 · clipCanWebm:74
CLIP_ASSET_V:85 · clipFileFor:87 · petClipKey:96 · petClipUrl:105 · equippedItem:116 · petStateImg:126
petWearOverlay:147 · wearLayerHTML:168 · happyNow:175 · makeHappy:176 · currentPetImg:189

## js/invasion3d.js (9,961 บรรทัด · 612 รายการ)
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
- 6251-6386 🕹️ Input — มือถือ (จอย+ปุ่ม) และคอม (WASD + pointer lock)
- 6387-6507 🚶 ผู้เล่น + AI + ลูป
- 6508-6512 🚁 โหมดขับเฮลิคอปเตอร์เอง (รอบ 414 — ผู้ใช้สั่ง)
- 6513-6671 🗺️ รอบ 417: แผนที่เลือกจุดลงสนาม (ผู้ใช้สั่ง) — เข้าเกมแล้วเลือกได้ว่าจะไปเกิดตรงไหน
- 6672-6830 🎖️ รอบ 418: นั่งเฮลิลำเดียวกับเพื่อน — "นักบิน + พลปืนประจำประตู" (ผู้ใช้สั่ง)
- 6831-7192 🔭🚫 รอบ 575 (ผู้ใช้สั่ง): "ซูมปืนค้างไว้ = ขึ้นเฮลิไม่ได้ ต้องเลิกซูมก่อน"
- 7193-7456 🌐 ผู้เล่นออนไลน์ใน map เดียวกัน (รอบ 414) — Firebase /world/invasion
- 7457-7606 🧯👥 กันผู้เล่นล้น — ฝั่งเรนเดอร์ของโลกนี้ (รอบ 637 · ยกส่วนกลางออกไป js/netroom.js รอบ 640)
- 7607-7665 💨 ควันตามหลังมิสไซล์ (รอบ 531 — ผู้ใช้สั่ง) — สไปรต์ควันนุ่มปล่อยเป็นระยะ
- 7666-7833 🔥🌀 รอบ 565 (ผู้ใช้สั่ง): ยานลูก "หลบมิสไซล์ที่ล็อกได้" — ปล่อยแฟลร์ + บิดหนี
- 7834-7912 🔫↩️ รอบ 568 (ผู้ใช้สั่ง): ยานลูกที่ "ถูกเรดาร์ล็อก" ยิงสวนกลับใส่เฮลิผู้เล่น
- 7913-8114 🔥🛡️ รอบ 569 (ผู้ใช้สั่ง): แฟลร์ของ "เฮลิผู้เล่น" + เสียงเตือนตอนถูกล็อก
- 8115-8125 🏃🪖 รอบ 530: หน่วยรบเคลื่อนที่เชิงยุทธวิธี (ผู้ใช้สั่ง: "อย่าปักหลักยืนทื่อ
- 8126-8251 🧘🎯 รอบ 586 (ผู้ใช้ส่งคลิป: "ตัวละครดิ้นไปดิ้นมา ไม่เป็นธรรมชาติ")
- 8252-8427 📣 รอบ 471: ทหารฝ่ายเราตะโกนบอกทิศศัตรู (ผู้ใช้สั่ง)
- 8428-8870 🌙 รอบ 471: โหมดกลางคืน — ฉากมืดสลัว + ท้องฟ้าดาว + ไฟฉายติดปืน
- 8871-9137 🔵💀 รอบ 576 (ผู้ใช้สั่ง): ยานแม่ยิง "ลำแสงสีฟ้า" ลงมาใกล้ตัวผู้เล่น — เตือน 3 ครั้ง ครั้งที่ 4 ตายจริง
- 9138-9188 ⚡👾 รอบ 579 (ผู้ใช้สั่ง): "ทุก 5 นาที สุ่มยานลูก 10 ลำ เร่งความเร็ว 10 เท่า นาน 10 วินาที แล้ววนลูป"
- 9189-9262 🔁 ลูปหลัก
- 9263-9961 ▶️ เข้า/ออกโลก
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
renderHeat:6228 · renderMissiles:6234 · toastBan:6244 · bindInput:6254 · moveJoy:6377 · unlockMouse:6385
solidPushOut:6394 · tickPlayer:6409 · hurtPlayer:6489 · MAP_VIEW:6518 · mapToWorld:6519 · worldToMap:6520
zoneName:6521 · buildMapShade:6535 · drawSpawnMap:6554 · safeSpawn:6629 · fitSpawnMap:6639 · openSpawnMap:6650
applySpawnPick:6659 · RIDE_DIST:6682 · RIDE_UP:6683 · RIDE_OFF:6684 · rideableHelis:6685 · findRide:6691
nearestRideable:6692 · ridePos:6702 · setRideView:6714 · boardGunner:6723 · dismountGunner:6742 · tickGunner:6758
updateGunnerBtn:6798 · tickAutoBoard:6814 · heliCount:6826 · zoomBlocksBoard:6844 · enterHeli:6854 · exitHeli:6896
EXT_CAM:6925 · EXT_VIEWS:6946 · EXT_SELF:6961 · EXT_RIDE:6962 · extP:6964 · syncExtBtn:6966
cycleExtView:6972 · resetExtCam:6981 · angDiff:6983 · extCamClear:6988 · extCamera:7007 · seatCamera:7030
tickHeliFlight:7051 · heliCrash:7150 · tickGpws:7160 · syncBotHelis:7182 · netReady:7198 · netJoin:7204
netSend:7215 · peerColor:7237 · NAME_SPR_H:7241 · nameSprite:7242 · bakedSoldierGlb:7258 · loadPeerSoldier:7259
peerRig:7268 · setPeerWeapon:7273 · peerBody:7278 · buildPeer:7307 · onPeer:7320 · dropPeer:7365
netLeave:7372 · peerTick:7377 · renderBoard:7413 · sendChat:7438 · showPeerBubble:7445 · removePeerBubble:7451
PEER_DRAW_MAX:7464 · PEER_DRAW_SLACK:7465 · DRAW_SWAP_MARGIN:7466 · JOIN_TOAST_MAX:7467 · drawnPeers:7470 · drawSlotFree:7471
showPeerAgain:7474 · hidePeer:7481 · tickDrawBudget:7486 · tickCrowdGuard:7496 · resetCrowdGuard:7500 · tickFighters:7502
tickMother:7555 · spawnAlienShot:7578 · tickAlienShots:7590 · smokeTex:7612 · spawnPuff:7623 · spawnSmoke:7633
spawnDust:7635 · tickSmoke:7644 · clearSmoke:7654 · tickHeliDust:7657 · EVA_WARN:7679 · EVA_FLARE_D:7680
EVA_TURN:7681 · EVA_SPIN_MUL:7682 · EVA_SPD_MAX:7683 · EVA_ROLL:7686 · EVA_Y:7687 · FLARE_PODS:7688
FLARE_COOL:7689 · FLARE_N:7690 · FLARE_LIFE:7691 · FLARE_TRAP:7692 · FLARE_CH:7693 · incomingMis:7698
startEvade:7709 · dropFlares:7718 · tickEvade:7746 · clearFlares:7778 · tickMissiles:7779 · CTR_REACT:7848
CTR_WARN:7849 · CTR_GAP:7850 · CTR_BURST:7854 · CTR_BURST_MS:7855 · CTR_SPD:7856 · CTR_DMG:7857
CTR_MAX:7858 · CTR_SPREAD:7859 · CTR_LEAD:7860 · ctrAimPoint:7863 · ctrArming:7870 · counterFire:7874
tickCounter:7879 · SPK_RANGE:7930 · SPK_MS:7931 · SPK_GAP:7932 · SPK_WORLD_GAP:7933 · SPK_BEEP:7934
AMIS_SPD:7935 · AMIS_TURN:7936 · AMIS_DMG:7937 · AMIS_LIFE:7938 · AMIS_MAX:7939 · AMIS_PROX:7940
PH_FLARE_MAX:7941 · PH_FLARE_RE:7942 · PH_FLARE_N:7943 · PH_FLARE_COOL:7944 · PH_FLARE_BACK:7945 · PH_FLARE_DOWN:7946
PH_TRAP:7947 · PH_FLARE_CH:7948 · renderFlareBtn:7951 · dropPlayerFlares:7957 · fireAlienMissile:7989 · clearAMis:8004
resetSpike:8009 · spikeStart:8010 · aMisNear:8012 · tickSpike:8020 · tickAMis:8072 · SQUAD_COVERS:8124
squadCoverPool:8125 · SQ_TURN:8135 · angWrap:8140 · turnTo:8142 · easeLook:8147 · squadTarget:8152
pickSquadDest:8164 · tickSquadMove:8178 · tickSquad:8204 · CALL_DIST:8258 · CALL_NEAR:8259 · CALL_GAP_ALL:8260
CALL_GAP_ONE:8261 · CALL_GAP_DIR:8262 · CALL_MS:8263 · CALL_LINES:8264 · CALL_SECTORS:8275 · bearingKey:8278
clearSquadBubble:8286 · callSprite:8292 · squadShout:8304 · tickSquadCalls:8317 · CHAT_GAP_ALL:8344 · CHAT_LINES:8345
tickSquadChatter:8351 · heliFireAt:8368 · nearestFighterTo:8380 · tickHelis:8386 · DAY:8435 · NIGHT:8437
collectMsMats:8441 · CYCLE_MS:8452 · MODE_ICON:8454 · STORM_MS:8461 · buildStars:8468 · buildStreetLamps:8491
glowTex:8509 · tickStreetLamps:8517 · beamPair:8534 · tickSearchBeams:8545 · buildBarrelFires:8582 · tickBarrels:8600
tickShootingStar:8610 · buildMist:8635 · tickMist:8645 · tickNightSound:8688 · tickSneak:8697 · tickStorm:8708
nvReady:8724 · nvEnter:8725 · nvExit:8731 · tickNvHint:8732 · dropGlowStick:8741 · tickGlowSticks:8758
buildFlashlight:8767 · setNight:8772 · setDayMode:8773 · tickNight:8787 · applyNightLook:8819 · tickFlashlight:8859
MSB_FIRST:8889 · MSB_GAP:8890 · MSB_WARN:8891 · MSB_KILL_WARN:8892 · MSB_NEAR:8893 · MSB_FLEE:8894
MSB_R:8895 · MSB_HOLD:8896 · MSB_MAX:8897 · MSB_DEAD_MS:8898 · MSB_BEEP:8899 · MSB_COVER_R:8902
MSB_PAD_R:8903 · MSB_COVER_RECHECK:8904 · msbEnsure:8909 · msbPlace:8926 · msbBarPos:8935 · msbHide:8942
resetMsBeam:8946 · msbCoverAt:8961 · msbAimBeside:8982 · msbBegin:8988 · msbAim:9005 · msbStrike:9036
msbKill:9075 · msbKickOut:9088 · tickMsBeam:9098 · TURBO_EVERY:9151 · TURBO_MS:9152 · TURBO_MUL:9153
TURBO_N:9154 · TURBO_TRACK:9155 · resetTurbo:9157 · turboPick:9162 · turboBegin:9169 · tickTurbo:9181
fit:9192 · tick:9198 · frame:9206 · build:9266 · start:9334 · exitWorld:9461

## js/lobby.js (52 บรรทัด · 3 รายการ)
PANEL_TITLES:9 · openPanel:19 · closePanel:29

## js/lobby3d.js (780 บรรทัด · 0 รายการ)

## js/main.js (421 บรรทัด · 6 รายการ)
syncMusicBtn:110 · showQuizBackPay:146 · showGiantRefund:191 · showTicketRefund:232 · fitQbp:272 · bootGame:286

## js/moto3d.js (2,758 บรรทัด · 143 รายการ)
### 🗂️ สารบัญโซน js/moto3d.js (Read/Edit เฉพาะช่วง)
- 91-296 🚗🏙️ รอบ 785: ยกการขับจาก "โลกขับรถเมืองกำแพงเพชร" มาทั้งชุด (เฉพาะ vehicle==='car')
- 297-498 DOM เครื่องเกมพกพา (สร้างครั้งเดียว · CSS ฉีดเอง ไม่แตะ style.css)
- 499-528 🚗🏙️ รอบ 785: ห้องคนขับ + ปุ่มบังคับชุดโลกเมือง (โผล่เฉพาะ .car — โหมดมอไซค์ไม่เห็นอะไรเลย)
- 529-752 🪞📷 รอบ 810: กระจกมองหลัง+ข้าง (เฉพาะโหมดรถยนต์ในห้องคนขับ) — ภาพจริงจากกล้อง 3D ตัวที่ 2/3/4
- 753-849 🚗🏙️ รอบ 785: ห้องคนขับ (หน้าปัด/พวงมาลัย/เข็มเกจ) + ปุ่มเกียร์ — เฉพาะโหมดรถยนต์
- 850-878 🪞📷 รอบ 810: กระจกมองหลัง/ข้าง — เรนเดอร์ฉากเดิมซ้ำด้วยกล้องหันหลัง/เฉียงข้าง แล้วยัดลงแถบบนจอ (scissor)
- 879-946 🎵📻 รอบ 810: วิทยุในรถ — จอ head-unit (visualizer + แผงเลือกเพลง) พอร์ตจาก adventure3d.js ทั้งชุด
- 947-1187 ถนนจากแผนที่จริง → geometry + ตารางแฮชชนถนน
- 1188-1527 ฉาก: พื้น/โรงเรียน/ป้ายหมู่บ้าน/ต้นไม้/เมฆ/บ้านหมู่บ้าน
- 1528-1585 🐕 รอบ 312: หมาวิ่งตัดถนน — โผล่ข้างถนนข้างหน้ารถ วิ่งตัดผ่านเร็ว · ชน = ปรับ 100 เหรียญ (รอบ 643: ลดจาก 500)
- 1586-1719 🪙 รอบ 317: เหรียญบนถนน — pool ลอยเหนือเลนซ้าย รีไซเคิลรอบผู้เล่นตลอด
- 1720-1752 🏍️🚗 รอบ 317: โมเดลยานพาหนะ 3D (ใช้ทั้งรถเราเองโหมด car และรถ/มอไซค์ของเพื่อน)
- 1753-1849 🚗 รอบ 394: โมเดลรถจริง img/models/car_01.glb ในแผนที่บ้านโพธิ์สวัสดิ์
- 1850-2077 🧑‍🤝‍🧑 รอบ 317: เพื่อนในแผนที่เดียวกัน (/world/moto/<uid>)
- 2078-2119 🏟️👥 รอบ 640: งบวาดตัวเพื่อน (ใช้ NetRoom.drawBudget ร่วมกับโลกอื่น)
- 2120-2294 คำศัพท์ + ตัวอักษรบนถนน
- 2295-2608 สร้างโลกครั้งเดียว + ลูปเกม
- 2609-2758 เข้า/ออกโลก
### รายการ js/moto3d.js
REWARD:7 · ACCEL:8 · DASH_LEN:9 · DOG_HIT_COIN:10 · FEAT_SP:12 · DECAL_N:13
GRAV:14 · SUSP_K:15 · ROAD_WIDE:16 · EDGE_M:17 · ROAD_TEX_S:18 · POST_N:19
LEAN_MAX:20 · COLLECT_R:21 · SPAWN_MIN:22 · SCATTER_MS:23 · LETTER_COPIES:24 · BUCKET:25
TILE_COLORS:26 · LETTER_COIN:28 · COIN_VAL:32 · COIN_GAP:33 · COIN_SPIN_SPD:35 · COIN_TIERS:38
EMERALD_TIER:45 · HARD_LAND:46 · COIN_CURVE_RAD:47 · NET_SEND_MS:49 · PEER_COLORS:50 · CHAT_MS:52
CHAT_PRESETS:53 · CAR_EYE:102 · CAR_ACCEL:103 · CAR_VMAX:104 · CAR_WB:105 · MIRROR_REAR:115
RADIO_RECT:120 · CAR_RADIO_RECT:121 · carRadioRect:127 · sndKick:235 · ENG_FILES:245 · CSS:300
buildDom:601 · loadCarDash:758 · loadCarWheel:770 · setGear:780 · setCam3:786 · syncGearUi:793
carDial:802 · drawCarGauge:832 · mirrorPass:855 · drawCarMirrors:867 · radioLayout:883 · radioSetHint:907
renderRadioList:913 · radioToggleList:923 · drawRadioViz:928 · segKey:950 · smoothPts:953 · featKey:969
addFeat:970 · genFeatures:975 · terrainAt:994 · roadGroundY:1007 · decalTex:1015 · makeDecals:1034
decalTick:1043 · buildRoads:1060 · distToSeg:1156 · roadInfo:1161 · onRoad:1167 · randomRoadPoint:1168
TXT_SPR_H:1193 · makeTextSprite:1194 · letterTexture:1209 · woodTileMat:1224 · muralTexture:1235 · buildSchool:1247
buildScenery:1393 · scatterTrees:1472 · postTick:1492 · scatterClouds:1519 · makeDog:1531 · spawnDog:1546
dogHit:1556 · dogTick:1572 · coinTexture:1590 · makeCoins:1601 · loadCoinImg:1607 · addCoin:1619
clearCoins:1627 · addFreeCoin:1631 · coinTierAt:1639 · coinFx:1649 · grabCoin:1658 · coinTick:1675
scatterCoinTick:1691 · placeSpecialCoin:1709 · makeVehicle:1724 · mCarSplitWheel:1761 · mCarEnsure:1787 · mCarMat:1804
mCarBuild:1817 · mCarCode:1844 · netReady:1856 · netJoin:1862 · netSend:1875 · sendChat:1889
showPeerBubble:1899 · removePeerBubble:1906 · BOARD_MS:1919 · renderBoard:1921 · peerColor:1972 · buildPeer:1976
onPeer:2000 · dropPeer:2043 · netLeave:2050 · peerTick:2055 · PEER_DRAW_MAX:2083 · drawnPeers:2084
drawSlotFree:2085 · showPeerAgain:2086 · hidePeer:2093 · tickDrawBudget:2098 · spawnSlot:2106 · pickWord:2123
spawnLetters:2133 · renderWordHud:2151 · WORD_MIN_K:2162 · fitWord:2163 · collectTick:2190 · completeWord:2214
relocTick:2239 · gpsTick:2254 · miniTick:2263 · build:2298 · applyVehicleUi:2335 · fit:2364
tick:2374 · carDrive:2384 · frame:2433 · start:2612 · exitWorld:2685

## js/music.js (204 บรรทัด · 0 รายการ)

## js/netroom.js (807 บรรทัด · 19 รายการ)
CFG:41 · roomsAllowed:63 · HOT_KEYS:71 · COLD_KEYS:72 · HOT_BACK:73 · splitPayload:77
mergeBack:88 · metUids:100 · AIM_TTL_MS:119 · aimAt:121 · aimGet:125 · aimClear:129
MAPS3D:135 · whereFriends:136 · dbOf:160 · envReady:161 · isDenied:164 · create:176
drawBudget:780

## js/online.js (1,803 บรรทัด · 96 รายการ)
### 🗂️ สารบัญโซน js/online.js (Read/Edit เฉพาะช่วง)
- 2-206 ENGINE: ระบบออนไลน์จริงผ่าน Firebase Realtime Database
- 207-300 ระบบเพื่อน (ข้อ 0.3): รหัสเพื่อน + ค้นหา + ส่ง/รับคำขอ
- 301-490 ระบบแชทกับเพื่อน (ข้อ 0.4)
- 491-656 ระบบส่งของขวัญ (ข้อ 0.5)
- 657-773 🏪 ตลาดออนไลน์จริง (item 2 backlog): ซื้อ-ขายสินค้าที่เพื่อน "ผลิตเอง" ข้ามผู้เล่น
- 774-838 คำเชิญเล่นโลก 3D ด้วยกัน — /tinv/<toUid>/<fromUid> = {map,n,ts}
- 839-1035 📰 Follow + Feed กิจกรรม (รอบ 155) · 🌍 หน้า Feed ทุกคน + ไลก์/คอมเมนต์ (รอบ 639)
- 1036-1043 🌍 หน้า Feed ทุกคน + ไลก์/คอมเมนต์ (รอบ 639)
- 1044-1216 📰 รอบ 701 — ฟีดล็อบบี้ทีละโพสต์ + รีแอ็กชัน + แจ้งเตือน (ต่อยอดรอบ 639)
- 1217-1803 📞 โทรหาเพื่อน — Voice call / Video call แบบ LINE (รอบ 625 · กลุ่ม 3 คนรอบ 631)
### รายการ js/online.js
ONLINE_STALE_MS:65 · ONLINE_BEAT_MS:66 · LEADERBOARD_SIZE:67 · onlineDisplayName:71 · onlineActivity:79 · ensureOnlineId:95
onlineKey:105 · onlinePushPresence:110 · onlinePushScore:120 · fetchPlayerStats:157 · onlineRerender:179 · notifyFriendBadges:191
FRIEND_ALPHA:217 · friendCode:218 · friendSearch:230 · friendRequest:254 · friendAccept:263 · friendDecline:275
friendsHeal:285 · CHAT_MAX_LEN:309 · CHAT_KEEP:310 · chatPairId:312 · chatRef:315 · chatListen:321
chatSend:337 · chatDeleteMsg:353 · TYPING_TTL:361 · typingRef:363 · chatSetTyping:364 · chatClearTyping:374
chatWatchTyping:382 · chatThemeRef:400 · chatSetTheme:401 · chatWatchTheme:406 · chatPrune:414 · chatSeenTs:431
chatMarkSeen:437 · chatUnreadCount:449 · chatWatchSync:452 · GIFT_EXPIRE_MS:502 · giftSend:505 · greetSend:519
giftAccept:531 · giftDecline:535 · giftInWatch:541 · giftReclaim:572 · giftOutWatchSync:582 · giftOutRebuild:637
salesWatch:667 · salesRerender:675 · sellInc:679 · marketWatch:687 · marketList:720 · marketUnlist:728
marketBuy:737 · marketSoldWatch:750 · tinvSend:779 · tinvClear:786 · tinvPartyTick:794 · TINV_WORLD_LABEL:816
tinvWatch:820 · FEED_MAX:847 · feedEvent:850 · feedPrune:862 · feedPurgeCat:873 · feedPushAssets:884
petDescriptor:902 · feedPushPets:908 · fetchPlayerPets:922 · followSet:938 · followUnset:949 · feedRebuild:956
feedWatchSync:968 · fetchPlayerFeed:995 · fetchPlayerAssets:1008 · fetchFollowers:1027 · GFEED_READ:1053 · GFEED_KEEP_ME:1054
gfeedPush:1057 · gfeedPrune:1071 · gfeedParse:1084 · gfeedWatchStart:1106 · gfeedWatchStop:1133 · gfeedNotifDiff:1141
gfeedNotifPush:1155 · uidDisplayName:1162 · gfeedRebuild:1173 · gfeedToggleLike:1190 · gfeedSetReaction:1195 · gfeedAddComment:1203
CALL_RTC_CFG:1241 · CALL_RING_MS:1242 · CALL_MAX_MS:1243 · CALL_MAX_PEERS:1244 · onlineStart:1660 · onlineLoadSDK:1778

## js/photo.js (361 บรรทัด · 25 รายการ)
PHOTO_LS_KEY:12 · PHOTO_MAX:13 · PHOTO_PREFIX:14 · PHOTO_SIZES:15 · PHOTO_QS:16 · PHOTO_ZMAX:17
photoValid:25 · photoOnline:28 · photoGet:31 · photoHas:32 · photoIsMine:33 · photoOf:36
photoFetch:44 · photoAfterChange:61 · photoPush:65 · photoVerify:83 · photoSaveUrl:93 · photoRemove:99
photoPullMine:106 · photoBlkSrc:122 · photoMiniHTML:129 · openPhotoMenu:137 · photoLoadImgEl:203 · photoLoadFile:211
openPhotoCrop:224

## js/sgaward.js (28 บรรทัด · 0 รายการ)

## js/shootword.js (1,066 บรรทัด · 0 รายการ)

## js/state.js (1,153 บรรทัด · 91 รายการ)
STORAGE_KEY:6 · QUIZ_PASS_REWARD:11 · CURE_COST:13 · HUNGRY_SICK_MS:14 · MEAL_HOUR:16 · MEAL_FULL:17
SLEEP_FROM_HOUR:18 · SLEEP_SICK_HOUR:19 · WAKE_HOUR:20 · DINNER_COST:21 · TOXIN_FULL:23 · DETOX_COST:24
FOODQUIZ_Q:26 · FOODQUIZ_COIN:27 · FOODQUIZ_BONUS:28 · FOODQUIZ_MAX_PLAYS:29 · SHAPE_JUNK_MEALS:31 · SHAPE_CLEAN_MEALS:32
SHAPE_MISS_MEALS:33 · SHAPE_EXP_BONUS:34 · HEAT_SICK_MS:35 · THIRST_SICK_MS:36 · DEFAULT_STATE:38 · FEED_CATS:202
FEED_REACTIONS:216 · feedRx:224 · FEED_QUICK_CM:226 · SLOT_MS:238 · currentSlotStart:239 · nextSlotStart:245
mealDayKey:247 · nightKeyOf:249 · isNightNow:257 · newPet:262 · loadState:286 · saveState:577
activePet:584 · petStage:585 · isAdult:590 · abilityOn:591 · hasPetType:592 · todayStr:595
dailyTick:599 · addCoins:602 · QUEST_POOL:622 · QUEST_PER_DAY:631 · questsToday:632 · questTick:639
questEvent:643 · assetValue:679 · netWorth:699 · assetCount:701 · refreshRank:718 · heatProtected:734
rainProtected:738 · petHungry:741 · petShapeOf:745 · updatePetShape:751 · shapeMealDone:758 · heatPct:768
ymStr:777 · billOutstanding:781 · UTILITIES:788 · HOME_UTILITIES:794 · homeDecayed:796 · billTick:799
PET_FOOD_PER_PET:871 · petFoodTick:872 · myCar:898 · carLoanDue:903 · carLoanOverdue:908 · carLoanPayable:913
carLoanPay:920 · compTick:933 · ONLINE_RATE:947 · onlineEarnActive:948 · onlineEarnTick:952 · onlineEarnFlush:963
marketTick:973 · addCraft:997 · ORDER_MAX:1016 · ORDER_LIFE_MS:1017 · ORDER_GAP_MIN_MS:1018 · ORDER_GAP_SPAN_MS:1019
ORDER_TIER_WEIGHT:1020 · newOrder:1021 · orderTick:1034 · careTick:1042 · expNeed:1124 · addExp:1129
addRP:1149

## js/tpaward.js (41 บรรทัด · 0 รายการ)

## js/typing.js (369 บรรทัด · 0 รายการ)

## js/ui.js (8,668 บรรทัด · 352 รายการ)
### 🗂️ สารบัญโซน js/ui.js (Read/Edit เฉพาะช่วง)
- 2-77 UI: Dashboard / ร้านค้า / ที่พัก / ร้านสัตว์เลี้ยง / แรงค์ / สถิติ
- 78-308 🎬 เวทีน้องน่ารัก (Cute Pet Show) — รอบ 604 (ผู้ใช้สั่ง 26 ก.ค. 2026)
- 309-603 🆕 New Word (รอบ 116): คำศัพท์ใหม่ 1 คำ/การ login ตามระดับชั้น
- 604-627 นาฬิกาใต้ชื่อผู้เล่น (วัน · วันที่ · เวลา อัปเดตทุกวินาที)
- 628-680 ข้าวเย็นของผู้เล่น (คิว 7725691507 ข้อ 6)
- 681-712 แถบฝนประจำวัน: นับถอยหลังถึง 19:00 ทุกวัน (ฝนตก 1 ชม.)
- 713-757 เอฟเฟกต์ฝนเต็มจอ (รอบยี่สิบ): ฝนตกจริง (19:00-20:00) + ไม่มีบ้านสภาพดี
- 758-778 การ์ด "คนที่กำลังทำการบ้านไปพร้อมๆ กับเรา"
- 779-833 รอบ 149: กล่อง aside ขวาเลื่อนวนอัตโนมัติ (ล่าง→บน) ไม่มี scrollbar
- 834-1225 Daily Quest (item 3): การ์ดภารกิจวันนี้ใน aside ขวา
- 1226-1318 รอบ 153: เมนูลัดแตะแถวเพื่อนออนไลน์ในกล่อง aside
- 1319-1903 การ์ด Leaderboard — สลับแท็บในการ์ดเดียว (ประหยัดพื้นที่):
- 1904-2268 การ์ดข้อมูลผู้เล่น 👤 — คลิกชื่อในการ์ดเพื่อน/กระดาน แล้วโชว์
- 2269-2519 แผงเพื่อน 👥 (ข้อ 0.3): รหัสเพื่อน + ค้นหา + คำขอ + รายชื่อเพื่อน
- 2520-2615 🌍 เพื่อนอยู่โลก 3D ไหน + ปุ่ม "ตามเข้าไป" (รอบ 642)
- 2616-2654 แชทกับเพื่อน (ข้อ 0.4) — กล่องแชทลอยกลางจอ + แผง emoji
- 2655-3056 รอบ 179: หน้ารวมข้อความ (inbox แบบ Messenger — ธีมกระจกฟ้า sci-fi ของเกม)
- 3057-3403 ระบบส่งของขวัญ (ข้อ 0.5) — ห้องของขวัญ + กล่องเลือกส่ง + ฉากเปิด
- 3404-3496 RANK CARD + ฉากเลื่อนแรงค์
- 3497-3499 PET DASHBOARD
- 3500-3568 📰 รอบ 155: overlay ข้อมูลน้อง & การดูแล + ฟีดกิจกรรมเพื่อน
- 3569-3972 📰 รอบ 701 — ฟีดล็อบบี้ "ทีละโพสต์" แบบ Facebook (ผู้ใช้สั่ง 29 ก.ค. 2026)
- 3973-4132 🌍 รอบ 639: หน้า Feed เต็มจอ — ทุกคน (ไม่ใช่แค่ follow) + ไลก์/คอมเมนต์
- 4133-4784 📖 Dictionary ค้นหาคำศัพท์ (รอบ 254 ผู้ใช้สั่ง 16 ก.ค. 2026)
- 4785-4828 การนอน (คิว 7725691507 ข้อ 1)
- 4829-5210 ให้อาหาร (ระบบมื้อเย็น 18:00 + ความอิ่มสะสม — ข้อ 2+3)
- 5211-5329 🛡️ ควิซอาหารปลอดภัย (ต่อยอดข้อ 5.1)
- 5330-5415 🎀 ห้องแต่งตัวสัตว์เลี้ยง (รอบ 635: แยกออกจาก "ร้านค้า" เดิม —
- 5416-5603 ที่พัก (หลบแดด/หลบฝน) + เครื่องปรับอากาศ
- 5604-5721 บิลสาธารณูปโภค (ค่าไฟ/ค่าน้ำ — เครื่องยนต์อยู่ใน state.js: UTILITIES/billTick)
- 5722-5804 การ์ดมือถือ (ข้อ 7): ซื้อ 10,000 ขายคืน 6,000
- 5805-5815 การ์ดคอมพิวเตอร์ (ข้อ 11): ซื้อ 50,000 ขายคืน 30,000
- 5816-5860 item 8: โบนัสออนไลน์ +0.01 เหรียญ/วิ ฟรีทุกคนที่เปิดเกมออนไลน์อยู่
- 5861-6454 💻 รอบ 706 (ผู้ใช้สั่ง 29 ก.ค. 2026): ช่องรายได้คอมพิวเตอร์บนแถบบนล็อบบี้
- 6455-6594 🌍 ปุ่มลัดเข้าโลก 3D ในรางเมนูซ้าย (ผู้ใช้สั่ง 9 ก.ค. 2026)
- 6595-6748 🧭 ป้ายบอกทางของรางเมนูซ้าย (รอบ 601 · ผู้ใช้สั่ง 26 ก.ค. 2026)
- 6749-6918 การ์ดสวนผลไม้ (ข้อ 12): ซื้อต้นไม้ปลูกได้ไม่จำกัด แต่ละต้นออกผล
- 6919-6928 โรงงานผลิตสินค้า 🏭 + ตลาดขายต่อ (แนวคิดใหม่ 5 ก.ค. 2026)
- 6929-6951 โรงงานผลิต (แผง 🏭) — แยกออกจากตลาด (ผู้ใช้สั่ง 6 ก.ค. 2026)
- 6952-7104 ตลาดขายสินค้า (แผง 🏪) — แยกออกจากโรงงาน
- 7105-8025 🚗 รอบ 131: หมวดยานพาหนะ — โชว์รูมรถ 10 คัน (แคตตาล็อก 5 ช่อง/แถว)
- 8026-8086 ร้านสัตว์เลี้ยง (ซื้อเพิ่มได้ ไม่ลบตัวเดิม)
- 8087-8123 เลเวลอัพ (รายตัว)
- 8124-8229 สถิติผลการเรียนรู้
- 8230-8267 item 4: การ์ดสรุปส่งครู — ใบเดียวจบ ชื่อ/วัน-เวลา/เหรียญวันนี้/แรงค์/สอบล่าสุด
- 8268-8668 📞 หน้าจอโทรหาเพื่อน — สายเสียง (รอบ 625 · กลุ่ม 3 คน + ปิดวิดีโอ รอบ 631)
### รายการ js/ui.js
startHTML:10 · PET_ANIM:30 · petAnimHTML:35 · petVisualHTML:50 · PET_SHOW:91 · PET_SHOW_STAGE:96
PET_SHOW_H:99 · petShowBgHTML:102 · petClipHint:145 · __clipReady:157 · petShowHTML:165 · PROF_AV_MAX:229
lobbyBlk:230 · caretakerFigureHTML:237 · footAlign:247 · heroRankBgHTML:281 · NEW_WORD_MS:315 · newWordNext:321
renderNewWord:332 · NW_GAP:370 · alignNewWord:371 · startNewWordTimer:388 · nwCountdownTick:405 · PAT_REMIND_HOUR:421
patRemindTick:422 · applyPatRemindGlow:443 · NEW_WORD_COIN:458 · NW_DAILY_GOAL:459 · NW_DAILY_BONUS:460 · newWordReward:461
nwDailyTick:484 · coinFlyFx:503 · nwDailyBarHTML:536 · showNewWordPopup:547 · renamePet:574 · mealLabel:591
fmtMins:598 · renderClock:607 · dinnerDue:633 · renderDinnerChip:638 · dinnerClick:649 · renderRainBar:684
rainFxTick:717 · RAIN_DROP_IMGS:734 · rainFxDrop:735 · selfPronoun:765 · selfTag:770 · idTag:774
SIDE_SCROLL_SPEED:784 · SIDE_SCROLL_RESUME:785 · initSideScroll:788 · sideScrollTick:816 · QUEST_FLASH_HOLD:840 · QUEST_SLIDE_MS:847
QUEST_RESUME_MS:848 · questGo:851 · SIDE_TALL_MIN:863 · sideIsTall:864 · qBigCardHTML:869 · qDeckGo:889
qDeckTick:909 · renderQuestCard:930 · sideFlashRows:990 · FRIEND_FLASH_GRACE:1008 · ONLINE_FLIP_MS:1016 · ONLINE_FLIP_RESUME:1017
ONLINE_SWIPE_STEP:1018 · ONLINE_ROW_H:1025 · onPerPage:1028 · onChunk:1034 · ONLINE_GAP_MAX:1044 · onPageSpread:1045
onPageDraw:1054 · onPageFlip:1065 · bindOnlinePager:1076 · renderOnlineCard:1111 · bindInviteCards:1233 · bindFriendQuickMenu:1253
openFriendQuickMenu:1263 · LB_TABS:1326 · LB_WS_TOP:1327 · LB_TP_TOP:1328 · LB_SG_TOP:1329 · bindLbTabs:1331
updateRankRailBadge:1366 · rankUpCheck:1385 · rankUpSound:1413 · renderLeaderboardCard:1424 · bindLbGroupOpen:1453 · lbRankRows:1465
LB_BCAT_TOP:1513 · lbBadgeSections:1518 · lbDemoRows:1543 · lbChar:1565 · lbfAwardBarHtml:1575 · openLeaderboardFull:1588
BLK_PAD:1720 · BLK_PAD_NEW:1725 · BLK_TOP_FIX:1726 · seatPodChars:1727 · lbCoinHtml:1739 · lbBadgeHtml:1755
lbBossHtml:1781 · lbWordSearchHtml:1804 · lbTypingHtml:1840 · lbShootHtml:1874 · bindPlayerClicks:1909 · showPlayerCard:1919
petDescImg:2198 · openImgLightbox:2211 · openPetPeek:2231 · updateBillBadges:2275 · setBadge:2285 · tinvPendingCount:2301
updateSettingsBadge:2310 · openAttentionSummary:2325 · updateFriendBadge:2383 · renderFriendPanel:2393 · friendDoSearch:2441 · refreshFriendData:2465
FRW_TTL_MS:2530 · FRW_MIN_GAP:2531 · frwWorldOf:2535 · frwPanelOpen:2538 · frwScan:2543 · frwPaint:2565
frwPaintHint:2586 · frwFollow:2600 · CHAT_EMOJI_CATS:2621 · CHAT_THEMES:2643 · CHAT_SECRET_MS:2652 · chatBadgeSync:2660
ibTimeStr:2668 · IB_CALL_RE:2677 · ibCallInfo:2678 · openChatInbox:2683 · chatFitKeyboard:2853 · openChat:2869
giftImg:3060 · giftDateStr:3062 · GREETS:3070 · GREET_EXP:3078 · greetInfo:3079 · openGreetPicker:3083
giftItemPic:3125 · giftItemName:3133 · updateGiftBadge:3139 · renderGiftPanel:3148 · acceptGift:3206 · declineGift:3229
showGreetReveal:3238 · showGiftReveal:3265 · openGiftPicker:3291 · confirmSendGift:3359 · doSendGift:3383 · rankBadgeHTML:3407
renderRankCard:3412 · renderRankTab:3446 · showRankUp:3474 · bindPetPlateButtons:3509 · openPetInfoOverlay:3538 · feedAgo:3561
FEED_DECK_MAX:3581 · FEED_SLIDE_MS:3582 · FEED_RESUME_MS:3583 · feedPostImgIndex:3588 · feedPostImg:3599 · feedPostByKey:3608
feedCanReact:3611 · fpStatsHTML:3616 · fpNameBadgesHTML:3632 · fpostHTML:3636 · renderFeedCard:3671 · feedDeckGo:3709
feedDeckTick:3729 · renderFeedBell:3751 · feedNotifArrived:3759 · openFeedNotif:3766 · closeRxPicker:3800 · openRxPicker:3804
feedFlyWord:3824 · feedPickRx:3835 · openFeedComments:3848 · closeFeedComments:3862 · renderFeedComments:3868 · bindFeedPostEvents:3927
openFeedBoard:3979 · renderFeedBoardLive:4000 · renderFeedBoard:4018 · stageColLeft:4037 · alignPetTabs:4046 · alignFeedPlate:4058
alignProfilePlate:4069 · alignStageLeft:4085 · alignStageCols:4096 · watchStageCols:4110 · alignCureBtn:4120 · dictRecordLookup:4144
DICT_FILE_COUNT:4155 · loadDict:4156 · dictSearch:4171 · dictTapWords:4186 · dictEntryHTML:4190 · openDictOverlay:4201
renderDashboard:4285 · sleepBtnHTML:4790 · sleepHintHTML:4797 · sleepAllPets:4808 · wakeAllPets:4821 · feedPet:4832
openFoodMenu:4846 · feedWith:4917 · AVATAR_UI:4947 · playerAvatarHTML:4951 · SHAPE_UI:4959 · showFeedResult:4968
curePet:5009 · heartsFx:5032 · PAT_HOLD_MS:5055 · PAT_EXP:5056 · bindPetTap:5057 · petBounce:5075
petMood:5081 · shortPatPet:5088 · longPatPet:5096 · patCalendarHTML:5116 · patStreakTick:5144 · cureCelebrateFx:5170
railCureClick:5181 · detoxPet:5193 · openFoodQuiz:5216 · closeDressUpBoard:5335 · openDressUpBoard:5339 · renderShop:5356
homeVisualHTML:5419 · showHomeRuined:5433 · showCutNotice:5454 · renderHomeCard:5472 · payMaint:5556 · trashBillUI:5572
payTrash:5589 · UTILITY_UI:5608 · utilityBillUI:5657 · payUtility:5682 · buyUtilityFix:5708 · renderPhoneCard:5726
buyPhone:5766 · sellPhone:5788 · compLiveTotal:5809 · onlineLiveTotal:5820 · syncCoinHeader:5827 · flashPillGain:5832
renderOnlineEarnPill:5841 · renderCompEarnPill:5866 · openPillInfo:5899 · renderComputerCard:5982 · buyComputer:6017 · sellComputer:6040
soldCount:6061 · soldBadge:6062 · loadScriptOnce:6068 · advBusyMsg:6093 · advResetLoad:6105 · loadAdv3d:6111
enterAdventure3D:6119 · pickAdvMap:6144 · enterHaunted3D:6179 · enterHeli3D:6201 · pickHeliMap:6227 · enterDrone3D:6263
enterDrive3D:6282 · pickDriveMap:6320 · enterMotoMapAsCar:6356 · enterSoccer3D:6375 · enterMoto3D:6394 · enterF1_3D:6416
enterInvasion3D:6436 · WORLD3D:6462 · gotoRobotShop:6474 · openHealDialog:6480 · world3DFail:6501 · railWorldClick:6532
openWorldEntryDialog:6547 · railScrollHint:6600 · railScrollTop:6608 · initRailScroll:6613 · renderRailWorlds:6633 · tinvNoticeHTML:6702
openTinvPicker:6710 · fruitCountdown:6754 · renderFarmCard:6766 · renderFarmClock:6841 · buyFruit:6857 · sellFruit:6877
sellAllFruit:6898 · collectImg:6927 · renderFactoryCard:6933 · renderMarketCard:6956 · updateWishBadge:7012 · openWishlistDialog:7023
bindStripArrows:7068 · renderMarketBrowse:7082 · carImg:7111 · renderVehicleShop:7112 · CS_CYCLE_MS:7163 · carInteriorImg:7164
carStatHtml:7166 · renderCarShowroom:7173 · csShowBig:7200 · csInit:7227 · RS_CYCLE_MS:7250 · robotImg:7251
renderRobotShop:7252 · rsShowBig:7274 · rsInit:7295 · buyRobot:7314 · enterMecha3D:7339 · pickMechaRobot:7366
pickDriveCar:7398 · openCarBuyDialog:7441 · buyCarInsurance:7502 · payCarLoanMonthly:7521 · payCarLoanFull:7533 · carDriveBlock:7552
gotoVehicleShop:7557 · gotoMyStock:7562 · showNeedCarDialog:7568 · craftDiscount:7580 · renderFactory:7583 · renderOrdersUI:7652
startProduce:7671 · buyCollectible:7699 · cancelProduce:7727 · deliverOrder:7741 · renderOrderClock:7758 · renderCollectMine:7768
openListDialog:7810 · cancelListing:7863 · buyMarketItem:7886 · showCollectReveal:7913 · buyAC:7951 · openHomeShop:7970
renderPetShop:8029 · showLevelUp:8090 · renderStats:8127 · showTeacherCard:8234 · CALL_REACT_EMOS:8278 · CALL_TALK_MIN:8281
CALL_TALK_HOLD:8282 · CALL_ORDER_GAP:8284 · CALL_TONES:8290 · startCall:8664

## js/util.js (1,100 บรรทัด · 46 รายการ)
shuffle:6 · fmtNum:15 · escapeHTML:19 · gradeSymbol:32 · gradeMark:47 · nameWithGrade:55
gradeMarkCanvas:61 · gradeOf:77 · seededRand:92 · fmtThaiDT:102 · fmtThaiDate:106 · showScreen:111
TOAST_WARN_RE:121 · restackToasts:124 · clearWarnToasts:148 · toast:152 · floatFx:176 · beep:187
soundStatus:208 · PET_MOOD:279 · petVoiceSynth:286 · sirenSynth:363 · playCashier:387 · cashierSynth:401
keyTapSynth:434 · playSpark:475 · sparkSynth:489 · thunderFx:524 · wordAudioFile:592 · speakCutOff:601
speakWord:605 · speakLetter:629 · pickSpeakVoice:652 · speakWordTTS:663 · askNameDialog:683 · askConfirm:728
alertBox:746 · applyNoAnim:766 · BLK_VOCAB:773 · openSettings:821 · openHelp:1009 · openTeacherGuide:1035
TAPGLOW_SEL:1059 · TOUCH_INPUT_SEEN:1078 · mouseLockOK:1087 · lockMouse3D:1093

## js/vocabbook.js (207 บรรทัด · 14 รายการ)
VB_MAX:11 · VB_QUIZ_N:12 · VB_QUIZ_MIN:13 · vbGroup:16 · VB_GROUP_UI:21 · vbRecord:24
vbSeen:49 · vbStats:62 · vbList:70 · vbReviewCat:81 · vbStartReview:95 · openVocabBook:106
vbRender:148 · vbCardHTML:194

## js/wordsearch.js (414 บรรทัด · 0 รายการ)

## js/wsaward.js (32 บรรทัด · 0 รายการ)

## css/exam.css (352 บรรทัด · 75 selector)
#xs-screen:8,33 · .xs-top:12 · .xs-badge:16 · .xs-mode:17 · .xs-time:18,19,21,22 · .no-anim:24
.xs-score:25 · .xs-quit:26 · .xs-nav:36 · .xs-dot:40,44,45,46(+1) · .xs-body:50 · .xs-pass:51,55,62
.xs-ptitle:56 · .xs-para:57 · .xs-pn:58 · .xs-qside:63 · .xs-sec:67,68 · .xs-q:69
.xs-qno:70 · .xs-choices:74 · .xs-ch:75,80,81,86(+5) · .xs-ab:82 · .xs-ex:94,95,99 · .xs-exh:100
.xs-exref:101 · .xs-foot:104 · .xs-count:108 · .xs-btn:109,113,114,115(+1) · .levelup-box:121 · .xs-result:122,123,124,125(+4)
.xsr-box:142 · .xsr-head:147,148 · .xsr-tabs:149 · .xsr-tab:150,154 · .xsr-list:155 · .xsr-none:156
.xsr-item:157,161 · .xsr-qh:162,163,164 · .xsr-q:168 · .xsr-ans:169 · .xsr-you:170,171,172 · .xsr-ex:173
.xsr-ref:174 · .xst-wrap:176 · .xst-note:177 · .xst-row:180,181,182,190(+1) · .xst-h:183 · .xst-tag:184
.xst-bar:186,189,192 · .xst-n:193 · .xst-sum:194 · .xsr-foot:198 · .xsr-ok:199 · .xsp-box:205
.xsp-head:210,211 · .xsp-rows:212 · .xsp-set:213,214 · .xsp-name:215 · .xsp-tick:216 · .xsp-info:217
.xsp-best-row:218 · .xsp-best:219 · .xsp-hist:221,222 · .xsp-hist-svg:223 · .xsp-btns:224 · .xsp-go:225,229,230,233(+1)
.xsp-foot:235 · .xsb-box:250 · .xsb-head:255,256 · .xsb-grid:257 · .xsb-card:258,262 · .xsb-emoji:263
.xsb-name:264 · .xsb-info:265 · .xsb-done:266

## css/lobby.css (5,016 บรรทัด · 742 selector)
:root:6,5004 · html:15 · body:16,4968,5010 · *:36,37,38,39 · #app:42 · h1:44
.subtitle:45 · .shop-title:46 · #rotate-overlay:49 · .screen:71 · #screen-select:80,81,82,83(+5) · .egg-need:90
.petshop-topright:92 · .petshop-play-link:93,98 · #screen-login:112,137,138,143(+7) · .login-lux:122 · .login-crest:123 · .login-word:127
.login-rule:133,134,135 · .login-tag:136 · #screen-game:185,186,187,188(+7) · #screen-quiz:199,200,201,202(+6) · #quiz-choices:211,212 · .word-card:219
.quiz-choice:220,221,222 · .big-btn:225,226,227,228 · #screen-dashboard:233,1130,1138 · .lobby-top:240,873,874,875(+27) · .top-flex:241 · .profile-plate:242,246,794,3541(+12)
#rain-fx:251 · .rain-layer:254,260 · .rain-glass:267 · .glass-drop:268 · .rail-btn:283,889,895,897(+19) · .rail-badge:284
.fr-code-box:289 · .fr-code-label:293 · .fr-code-row:294 · .fr-code:295 · .fr-copy-btn:300,304,309,310 · .fr-search-btn:305
.fr-add-btn:306 · .fr-accept:307 · .fr-decline:308 · #fr-search-input:311 · #fr-search-result:315 · .fr-found:316
.fr-hint:320 · .fr-list-title:321 · .fr-row:322 · .fr-req:326 · .fr-row-name:328,332,4708 · .fr-row-status:336
.fr-req-btns:337 · .online-dot:338 · .fr-chat-btn:339,344,346 · .fr-unread:347 · .fr-call-btn:353,359 · .chat-overlay:368,374,375
.chat-box:376,679,686,693(+12) · .chat-head:388 · .chat-theme-btn:393,397 · .chat-secret-tg:398,399 · .cs-switch:400,401,406,407 · .cs-slider:402,404
.chat-secret-note:408 · .chat-theme-strip:411 · .chat-theme-sw:413,416,417,418(+1) · .chat-head-name:420,423 · .chat-head-ava:422 · .chat-close:424
.chat-msgs:428 · .chat-empty:432 · .chat-typing:434 · .ct-dots:436,437,439,440 · .no-anim:442,455,516,530(+56) · .chat-bubble:443,448,453
.chat-emoji:456 · .chat-emo:460,464 · .chat-input-row:465 · .chat-emoji-btn:469 · #chat-input:473 · .chat-send:477,482,483
.chat-call-btn:489,493 · .call-ring:496 · .cr-card:500 · .cr-kind:506 · .cr-av:507 · .cr-name:517
.cr-id:518 · .cr-btns:519 · .cr-btn:520,526,531 · .cr-no:527 · .cr-ok:528 · .cr-safe:532
.call-ov:535,541,563,580(+6) · .call-stage:547 · .ctile:548,559,560 · .ct-face:552 · .ct-me:558 · .ct-nm:573,577
.ct-sub:578 · .call-add:602 · .ca-head:609 · .ca-list:610 · .ca-row:611,615 · .ca-dot:616,617
.ca-nm:618,619 · .ca-go:620 · .ca-empty:621 · .ca-safe:622 · .ca-close:623 · .call-bar:627
.cb-btn:632,637,638 · .cb-end:639,640 · .call-emos:641 · .call-emo:646,647 · .call-fx:649 · .call-fx-emo:650
.pl-click:742,744,745 · .pl-overlay:746 · .pl-card:750,2675 · .pl-close:756 · .pl-head:760,2508,2511 · .pl-grade:765,4714,4715
.pl-body:766 · .pl-loading:767 · .pl-none:768 · .pl-me-tag:769 · .pl-blk-wrap:771 · .pl-blk:772
.pl-stat:773 · .pl-lbl:778 · .pl-val:779,780 · .pl-tip:781 · .chip-edit:787,792,793 · .rank-mini:799,805,806,807
.pass-photo:809,814 · .pet-tabs:816 · .dict-box:817,821,822,823(+1) · .dict-card:829,834,838,839(+2) · .dict-head:835,836 · .dict-trail:843,847
.dt-c:848,852,853 · .dt-sep:854 · .dict-today:855 · .di-w:857,858,859 · .dict-list:860 · .dict-item:861,865,866,867(+5)
.lobby-mid:881 · .rail-wrap:884,902,927,938(+1) · .rail-scroll:887,921,925,926 · .lobby-rail:888 · .rail-nudge:928,936,937,940(+1) · .rail-worlds:947
.rail-div:948 · .lobby-stage:990,992,1008,1135(+13) · .newword-banner:998,1005,1010,4093(+2) · .coin-fly:1021,1024 · .coin-plus:1030 · .nw-pop-coin:1045,1047,1048
.nw-pop-goal:1051,1052,1056,1060 · .nw-goal-head:1053,1055,1057 · .nw-goal-bar:1058 · .nw-goal-fill:1059 · .nw-pop-book:1061,1062 · .nw-tag:1083,4099,4121
.nw-word:1088,4103,4126,4215 · .nw-hint:1090,1091,4104,4128(+1) · .nw-coin:1093,1096,4105,4109 · .nw-countdown:1101,4110 · .nw-bar:1103,4129 · .nw-bar-fill:1105
.pet-stage:1108,2969 · .nw-box:1115,2978 · .nw-pop-word:1116 · .nw-speak:1117 · .nw-pop-phon:1118 · .nw-ipa:1119
.nw-pop-sent:1120 · .nw-pop-mean:1121 · .pet-tab:1122,1123,1124,3347 · .stage-hero:1145,1160,1168,1313(+22) · .hero-ground:1182,1302,1308 · .hero-rank-bg:1184,1187,1190,1194(+18)
#lobby3d-canvas:1207,1208 · .hero-scene:1212,1214,1221,1222(+8) · .caretaker-fig:1261 · .caretaker-img:1264 · .caretaker-emoji:1266 · .blk-rig:1273,1274,1275
.stage-plate:1335,1343,1354,1355(+23) · .plate-title:1349 · .lobby-side:1382,1418,1423,1426(+22) · .side-sec:1385,2220,3243,3519 · .side-label:1386,1391 · .side-label-row:1394,1395
.lb-tabs-out:1396,1397,1401 · .side-glass:1405,1412 · .side-card:1424,1535 · #quest-card:1436,1437,1465,1466(+6) · .q-bigcard:1442,1471 · .qb-top:1444
.qb-emoji:1445 · .qb-name:1447 · .qb-bar:1448,1449 · .qb-row:1451 · .qb-prog:1452 · .qb-reward:1453
.qb-go:1454,1458 · .q-dots:1459 · .q-dot:1460,1461,1462 · .q-bonus:1463 · .inv-card:1482,1484,1485 · .inv-btns:1486
.inv-go:1487,1489 · .inv-x:1490 · #online-card:1494,3251,3252,3253(+4) · .fq-overlay:1495 · .fq-box:1497,3057 · .fq-head:1501,1503
.fq-close:1504 · .fq-sec:1506 · .fq-worlds:1507 · .fq-world:1508,1510 · .fq-acts:1511 · .fq-act:1512,1515,1516
.lb-prize:1549 · .lb-coins:1552 · .lbf-cell:1553,2577,2580,2581(+3) · .lb-award-bar:1555,1561,1562 · .lb-award-go:1563 · .lbf-award:1565,1571,1572,1573
.pod-pz:1574 · .wsa-overlay:1577 · .wsa-box:1579 · .wsa-head:1584 · .wsa-title:1585 · .wsa-when:1586,1587
.wsa-close:1588,1591 · .wsa-cols:1592 · .wsa-col:1593 · .wsa-sec-h:1594,1595 · .wsa-msg:1596 · .wsa-msg-h:1599
.wsa-msg-b:1600,1601 · .wsa-msg-none:1602 · .wsa-rules:1604,1605 · .wsa-list:1606 · .wsa-row:1607,1609 · .wsa-r:1610
.wsa-n:1611 · .wsa-s:1612 · .wsa-p:1613 · .wsa-prizes:1614 · .wsa-pz:1615,1618 · .wsa-reveal-medal:1619
.lobby-bottom:1634,1637,1638,1640(+7) · .lobby-quiz-btn:1651 · .lobby-book-btn:1652,1653 · .lobby-foodquiz-btn:1654,1655 · .lobby-play-btn:1656,1660 · .lobby-exam-btn:1662,1663,1665
.panel-overlay:1670,1675,4230,4231(+8) · .panel-box:1676 · .panel-head:1683,1687 · .panel-close:1688,1693 · .panel-body:1694,1698,1699 · .panel-page:1696,1697
.collect-sub:1703 · .mkt-empty:1704 · .craft-box:1705 · .mkt-listing:1706 · .mkt-filter:1707,2051 · .hq-grid:1714
.hq-card:1715,1720,1744 · .hq-head:1721 · .hq-pic:1727,1729 · .hq-emoji:1731 · .hq-badge:1732 · .hq-stars:1736
.hq-price:1737,1742,1743,1746(+6) · .craft-credit:1750,1752,1753 · .car-grid:1760,1762,1763 · .robot-weap:1764 · .dmap-box:1767,1768 · .dmap-grid:1774
.dmap-card:1776,1779,1780,1781(+2) · .dmap-ico:1783 · .dmap-new:1786 · .dcp-grid:1788 · .dcp-card:1790,1793,1794,1795(+10) · .levelup-box:1812,2932,2933,3054
.dcp-box:1815,1816,1820,1821(+6) · .dcp-lock:1829 · .sold-badge:1833,1835,1836 · .rs-showroom:1838,4666,4667 · .rs-list:1839,1841,4647,4650 · .rs-thumb:1842,1844,1845,1846(+1)
.rs-thumb-pic:1847,1848 · .rs-thumb-price:1849 · .rs-stage:1851 · .rs-big:1854 · .rs-big-img:1855 · .rs-elec:1859,1863,1868
.rs-edge:1869,1875 · .rs-info:1878,1879,1880,1881(+1) · .rs-buy:1883,1885,1886 · .cs-showroom:1890,4639,4640,4668(+3) · .cs-list:1891,1893,4641,4646(+9) · .cs-thumb:1894,1896,1897,1898(+1)
.cs-thumb-pic:1899,1900 · .cs-thumb-name:1901 · .cs-thumb-price:1902 · .cs-thumb-own:1903 · .cs-stage:1905 · .cs-big:1908
.cs-big-img:1909 · .cs-elec:1913,1917,1921 · .cs-edge:1922,1928 · .cs-interior:1931 · .cs-inr-label:1932,1933 · .cs-inr-img:1934
.cs-info:1936,1937,1938,1939(+6) · .cs-buy:1947,1949,1950,1951 · .car-emoji:1953 · .car-mine:1959 · .car-mine-pic:1964 · .car-mine-info:1965
.car-loan:1966,1967 · .car-mine-btns:1968,1969,1970 · .car-locked:1972 · .car-mine-head:1974 · .car-pick-list:1975,1976 · .car-pick:1977,1979,1980
.car-pick-pic:1981,1982 · .car-pick-name:1983,1984 · .car-pick-od:1985 · .car-buy-box:1987,3061 · .cb-pic:1988,1989,1990 · .cb-lines:1991
.cb-li:1992,1996,1997 · .cb-ins:1998,2002,2003 · .cb-plan:2004 · .cb-pl:2005,2010,2012,2016(+1) · .cb-total:2023 · .cb-btns:2024,2029
.cb-x:2025 · .shop-grid:2032 · .shop-item:2033,2038,2043,2044(+3) · .mkt-tab:2052,2053 · .pg-btn:2054,2055,2056 · .pg-dot:2057
.fr-gift-btn:2080,2085 · .gift-sec-title:2088 · .gift-in-row:2090 · .gift-out-row:2094 · .gift-in-pic:2095,2097,2098 · .gift-in-info:2099,2100
.gift-in-btns:2101 · .gift-accept:2102,2106,2108 · .gift-decline:2107 · .gift-box-card:2109 · .gift-box-from:2110,2111 · .gift-note:2112
.gift-pick-overlay:2115 · .gift-pick-box:2119 · .gift-pick-head:2125,2129 · .gift-pick-close:2130 · .gift-pick-tabs:2132 · .gp-tab:2133,2137
.gift-pick-body:2138 · .gp-chips:2139 · .gp-chip:2140,2144 · .gp-card:2145,2146 · .gp-price:2147 · .gp-note:2148
.gift-cf-pic:2149 · .chat-emoji-cats:2154 · .chat-emoji-cat:2158,2162,2163 · .chat-emoji-wrap:2164,2165 · .stage-left:2174,4221 · .pet-info-btn:2178,2185,2186
.feed-list:2193,2197,2222,2223(+1) · .feed-empty:2198,2201 · .fd-tools:2207 · .feed-bell:2208,2210,2211,2212 · .fd-prog:2216,2217 · .fpost:2224,2814
.fp-head:2229 · .fp-who:2230 · .fp-name-line:2233 · .fp-name:2234 · .fp-when:2235 · .fp-badges:2237,2240
.fp-badge-ic:2238 · .fp-text:2242 · .fp-media:2245 · .fp-img:2247 · .fp-cap:2249 · .fp-big:2250
.fp-sum:2252,2254 · .fp-sum-rx:2255 · .fp-sum-none:2256 · .fp-en:2257 · .fp-bar:2259 · .fp-act:2260,2264,2266
.fp-like:2265 · .fp-page:2277,2278,2279,2280(+3) · .fp-rxbox:2283 · .fp-rxb:2287,2289,2290,2291(+1) · .fp-rxb-off:2293 · .fp-fly:2295,2298,2299
.fcm-overlay:2302 · .fcm-box:2304 · .fcm-post:2308,2309 · .fcm-rxs:2310 · .fcm-rx:2311 · .fcm-list:2312,2314
.fcm-row:2315,2316,2317 · .fcm-none:2318 · .fcm-quick:2320,2322 · .fcm-q:2323,2326,2327 · .fcm-add:2328 · .fcm-input:2329,2331
.fcm-send:2332,2334 · .fcm-locked:2335 · .fnt-overlay:2337 · .fnt-box:2339 · .fnt-list:2343,2345 · .fnt-row:2346,2348
.fnt-ico:2349 · .fnt-tx:2350,2351 · .fnt-sub:2352 · .feed-plate:2354 · .feed-all-btn:2355,2360 · .fdb-overlay:2365
.fdb-box:2367 · .fdb-head:2371 · .fdb-close:2375,2377 · .fdb-live:2378 · .fdb-live-title:2379 · .fdb-live-rows:2381,2383,2384
.fdb-live-row:2385,2387,2388,2389 · .fdb-dot:2390 · .fdb-list:2392,2393 · .fdb-empty:2394 · .fdb-row:2395 · .fdb-row-top:2397
.fdb-ico:2398 · .fdb-txt:2399 · .fdb-name:2400 · .fdb-ago:2401 · .fdb-actions:2402 · .fdb-like:2403,2406,2407,2408
.fdb-cm-list:2409 · .fdb-cm-row:2410,2412 · .fdb-cm-empty:2413 · .fdb-cm-add:2414 · .fdb-cm-input:2415,2417 · .fdb-cm-send:2418,2420
.fdb-cm-locked:2421 · .pi-overlay:2424 · .pi-box:2428,2433,2434,2438(+3) · .pi-close:2440,2445,2446 · .pi-close-left:2448 · .pi-portrait:2450
.pet-wear:2457,2460,2462 · .pi-portrait-wrap:2465,2467 · .pi-dress-btn:2475,2479,2480 · .pi-shape-cap:2481,2484,2485,2486 · .pi-shape-toggle-btn:2488,2491 · .pi-dress-pip:2493,2498,2499,2500(+1)
.pi-wear-note:2503,2505 · .greet-card:2512 · .greet-sub:2513 · .greet-grid:2514 · .greet-opt:2515,2518,2519,2520 · .greet-e:2521
.pi-streak:2525 · .pi-streak-head:2527,2529 · .pi-streak-best:2530 · .pi-dots:2531 · .pi-dot:2533,2534,2535 · .pi-streak-note:2536
.pi-care-title:2537 · .lbf-overlay:2540 · .lbf-box:2543,2557,2558,2559(+10) · .lbf-head:2548 · .lbf-title:2549 · .lbf-tabs:2550,2553
.lbf-note:2556 · .lbf-close:2572 · .lbf-close-l:2573 · .lbf-body:2574 · .lbf-grid:2575 · .lbf-box-bcat:2594
.lbf-bcat-wrap:2595 · .lbf-bcat:2597 · .lbf-bcat-head:2599,2600,2601 · .lbf-bcat-mid:2608 · .lbf-bcat-badge:2609,2613 · .lbcat-ic:2611
.lbcat-ic-label:2615 · .lbf-bcat-rows:2617 · .lbf-one-row:2621,2622,2623 · .lbf-bcat-row:2624,2626,2627,2629 · .lbf-podium:2641 · .pod:2643,2670,2671
.pod-char:2645 · .pod-base:2647 · .pod-rank:2649 · .pod-label:2651,4710 · .pod-name:2653 · .pod-sc:2655
.pod-1:2660,2661 · .pod-2:2662,2663 · .pod-3:2664,2665 · .pod-4:2666,2667 · .pod-5:2668,2669 · .pl-wide:2688,2691,2692,2693(+8)
.pl-follow:2694,2699,2701 · .pl-unfollow:2703,2709,2710 · .pl-followers:2711 · .pl-cols:2712,2717,2718,2719 · .pl-col:2713 · .pl-sec-title:2714
.pl-badges-col:2720 · .pl-feed:2721,2724,2731 · .pl-feed-row:2725,2729,2730 · .pl-assets-wrap:2733,4547,4622 · .pl-assets:2734,4550,4555,4561(+4) · .pl-asset:2737,2741,2748
.pl-asset-emoji:2742 · .pl-asset-n:2743 · .pl-pets-wrap:2750 · .pl-pets:2751 · .pl-pet:2752,2757,2759 · .pl-pet-nm:2760
.img-lightbox:2763,2768,2769,2773(+3) · .cert-svg:2792 · .cert-tap:2793,2798 · .cert-chip-sm:2801 · .pl-sec-sub:2821 · .pl-certs:2822,2824
.cert-mini:2825,2829,2831 · .cert-mini-cap:2832 · .cert-none:2834 · .lv-cert-row:2836,2838 · .lv-cert-btn:2839,2844 · .cert-lightbox:2846,2851,2852,2856(+3)
.pl-chat:2876,2881 · .pl-call:2883,2889 · .pet-peek:2890,2891 · .pp-chips:2893 · .pp-chip:2894 · .pp-gift:2899,2905
.settings-box:2907,2908,2981,2986(+29) · .set-feed-head:2909 · .set-feed-sub:2913 · .set-feed-row:2914 · .pillinfo-val:2919 · .pillinfo-desc:2924,2943
.pillinfo-box:2935 · .plf-head:2938 · .plf-emoji:2939 · .plf-ht:2940,2941,2942 · .plf-foot:2944,2946,2947 · .alert-box:2952,2954
.ab-emoji:2955 · .ab-title:2956 · .ab-desc:2957 · .ab-btns:2958,2959,2960 · .heal-heart:2962 · .attn-box:2977
.set-tabs:2988,2990 · .set-panels:2991 · .set-panel:2992,2993 · .help-box:3035,3036,3037 · .wl-box:3055 · .food-box:3056
.home-shop-box:3058 · .summary-box:3059 · .report-box:3060 · .wl-grid:3063 · .tc-wrap:3065 · .spell-btn:3071,3076
.sp-hud:3077 · .sp-word:3079 · .sp-ch:3080,3085 · .sp-th:3087 · .sp-hint:3089 · .sp-exit:3092,3096
.sp-banner:3097 · .sp-big:3102 · .sp-thb:3104 · .sp-coin:3105 · #spell-confetti:3110 · .sp-rb:3111
.sp-day:3121 · .sp-perfect:3123 · .sp-late:3125 · #spell-coinpop:3128 · .side-sub:3237,3239 · .sec-quest:3244
.on-page:3255,3256,3257,3258 · .inbox-overlay:3268 · .ib-box:3270 · .ib-head:3274 · .ib-close:3278,3280 · .ib-list:3281,3282
.ib-row:3283,3284,3285,3286 · .ib-ava:3287,3292,3293 · .ib-on:3294 · .ib-mid:3296 · .ib-name:3297 · .ib-last:3298
.ib-meta:3299 · .ib-time:3300 · .ib-dot:3302 · .ib-story-badge:3305 · .ib-empty:3309 · .ib-story:3311,3313
.ib-story-item:3314,3316,3323 · .ib-story-ava:3317 · .ib-story-on:3321 · .ib-world:3326,3329 · .ib-tabs:3331 · .ib-tab:3332,3335,3337
.ib-tab-dot:3338 · .ib-call-ava:3342 · .ib-call-row:3343,3344 · #btn-music:3350,3353,3354 · #ws-overlay:3369 · #ws-board:3372,3378,3380
.ws-head:3383 · .ws-title:3384 · .ws-findbar:3387 · .ws-tip:3388 · .ws-grade:3390,3391 · .ws-body:3394
.ws-gridwrap:3395 · #ws-grid:3398 · .ws-cell:3403,3408,3411,3414(+2) · .ws-flash:3420,3422 · .ws-coinpop:3426,3450 · .ws-combo:3437,3441,3442,3443
.ws-find:3454 · #ws-prog:3455 · #ws-words:3459,3463 · .ws-word:3465,3470,3471,3472(+2) · .ws-actions:3478,3479,3488 · .ws-sizes:3483
.ws-sizes-lb:3485 · .ws-size-now:3486 · #ws-new:3489 · #ws-stash:3490 · #ws-clear:3491 · #ws-win:3492,3494
.ws-win-in:3495,3498 · .sec-online:3521 · .rank-tab:3549,3550,3551,3552(+2) · .pet-show-bg:3582,3585,3589,3593(+19) · .ps-night-fx:3685,3687,3699,3704(+1) · .pet-show:3714,3717,3729,3731(+22)
.ps-video:3850 · .ps-worn-pip:3928,3929 · .id-card:3952,3959,3963 · .id-chip:3976 · .clock-chip:3985,3986 · .coin-block:4002
.coin-group:4003 · .coin-pill:4033,4034,4055 · .cp-lb:4058 · .cp-v:4059 · .nw-sub:4127 · .top-flex2:4218
#panel-factory:4237,4238,4242,4243(+39) · #panel-rank:4378,4379,4385,4390(+11) · .grid2x8:4461,4467 · .grid1x5:4477,4483 · .pl-badges-strip:4489 · .pl-badge-card:4493,4499
.pl-badge-card-ic:4500,4504 · .pl-badge-card-nm:4505 · .pl-badges-empty:4511,4513 · .mine-strip:4527,4529,4530,4535(+4) · .mb-strip:4541,4580 · .gmark:4688,4692,4693,4694(+1)
.gm-stack:4697,4701 · .gm-row:4703 · .lb-name:4705,4706,4707 · .grade-edit:4728,4733,4734 · .gradelock-box:4738,4754,4759,4761 · .gl-head:4739
.gl-emoji:4740 · .gl-ht:4741 · .gl-cur:4742 · .gl-lock:4743,4748 · .gl-ok:4747 · .gl-lock-sub:4749
.gl-why:4750 · .gl-pick-lb:4751 · .gl-opts:4752 · .gl-hist:4762 · .gl-hline:4763 · .gl-hg:4767
.gl-hat:4768 · .gl-harr:4769 · .gl-foot:4770 · .gl-cf:4771 · .reg-gradelock:4793 · #tp-overlay:4803
#tp-board:4805,4809 · .tp-head:4813 · .tp-title:4814 · .tp-stat:4816,4818 · .tp-pts:4820,4823 · .tp-close:4825,4831,4832
.tp-snd:4835,4838,4844,4845 · .tp-snd-ic:4839 · .tp-snd-track:4840 · .tp-snd-thumb:4842 · .tp-prompt:4849 · .tp-word:4851,4865,4866
.tp-ch:4853,4858,4859,4861 · .tp-thai:4869 · .tp-hint:4871 · .tp-empty:4873 · .tp-keys:4876 · .tp-row:4878
.tp-row-fn:4880,4913 · .tp-key:4884,4896,4898,4904(+2) · .tp-key-fn:4911 · .tp-fx:4917 · .tp-coinpop:4918 · .tp-pop-pt:4923
#city-backdrop:4937,4943 · .city-arrive:4944,4945 · .night:4959,4979,4980,4982(+2) · #night-veil:5005

## css/style.css (2,101 บรรทัด · 538 selector)
:root:5 · *:15 · html:16,21 · input:25 · body:29 · #app:35
.screen:38,39 · h1:42 · .subtitle:43 · .egg-grid:46,63 · .egg-card:47,52,53,54(+2) · .pet-price:57,61
.egg:65,71,75 · .d1:76 · .basket:79,80,85,91(+5) · .basket-dog:89,102,103,104 · .basket-cat:90,105,106,107 · .egg-dragon:110
.topbar:125 · .topbar-coins:126 · .coin-pill:127,138,142,147(+4) · .coin-ic:134 · .no-anim:148,179,183,184(+6) · .coin-flow:152,153,157,164(+1)
.pill-gain:193 · .q-row:209,210,211,215(+1) · .q-emoji:212 · .q-mid:213 · .q-name:214 · .q-bar:216,217
.q-right:219,220 · .q-foot:221,222 · .tc-open:225,226 · .tc-wrap:227 · .tc-card:228 · .tc-head:232
.tc-sub:236 · .tc-name:237,238 · .tc-badges:239 · .tc-when:240 · .tc-row:241,245 · .tc-pass:246
.tc-try:247 · .tc-sign:248 · .tc-hint:249 · .tc-close:250 · .mb-seller:256 · .mb-buy:257
.wl-open:260,265 · .strip-wrap:268,286 · .strip-x:269,276,277,289(+1) · .strip-arrow:278,284,285 · .craft-toolbar:292,293 · .fc-cols:295,296
.wl-box:330 · .wl-head:331,332,333 · .wl-grid:335 · .dress-overlay:343 · .wl-it:353,357,358,359 · .wl-emoji:360
.wl-name:361 · .wl-h:362 · .hq-card:363,445 · .icon-btn:364 · #settings-badge:370 · .badge-pop:373
.attn-box:375,376,393 · .attn-list:377 · .attn-row:378,383 · .attn-ico:384 · .attn-txt:385,386 · .attn-go:387
.attn-total:388,392 · .rain-banner:396,401,402,403 · .rain-row:405 · .rain-icon:406 · .rain-track:407 · .rain-fill:411
.rain-note:412 · .comp-earn:415,427,431,432(+1) · .comp-earn-label:420 · .comp-earn-num:421,425 · .comp-earn-sub:426 · .farm-sub:438
.farm-mkt-hint:439 · .farm-cols:441,442 · .farm-shop:444 · .farm-hq:446,447,448 · .farm-yield:449,450 · .farm-tree:451,456,461,465
.farm-tree-emoji:460 · .farm-tree-name:463 · .farm-tree-status:464 · .farm-grow-badge:466 · .farm-sell-btn:487,492 · .farm-sellall-btn:493,499,500
.rank-card:503 · .rank-badge-wrap:508 · .rank-badge-img:509 · .rank-badge-emoji:510 · .rank-body:511 · .rank-name:512,513
.rank-bar:514 · .rank-fill:515 · .rank-text:516 · .rankup-overlay:519 · .rankup-rays:525 · .rankup-content:541
.rankup-title:546 · .rankup-badge:551,564 · .rankup-badge-img:563 · .rankup-name:565 · .rankup-en:569 · .rankup-sub:573
.rankup-btn:574,581,582 · .qbp:586,587,588,589(+4) · .cr-btn-row:595 · .rankup-btn-2:596,597 · .thunder-fx:600 · .quake:601
.pet-tabs:613 · .pet-tab:614,620,621 · .pet-card:623 · .pet-stage:628 · .aura:629,635 · .sp1:636
.pet-wrap:639 · .pet-emoji:640 · .pet-img:641 · .egg-img:642 · .feed-pet:643,789 · .pet-baby:644
.pet-adult:645 · .pet-egg-stage:647 · .wear:649 · .wear-head:650 · .wear-face:651 · .wear-neck:652
.pet-name:654 · .stage-label:655 · .level-row:656 · .level-badge:657 · .exp-bar:661 · .exp-fill:662
.exp-text:663 · .ability-box:665,669 · .hunger-bar:672 · .hunger-fill:673,674,675 · .food-item:681,723,727,728(+6) · .hunger-text:685
.heat-bar:688 · .heat-fill:689 · .heat-text:690,691,692 · .care-row:694 · .care-btn:695,699,702 · .btn-feed:700
.btn-cure:701 · .sick-banner:703 · .pet-sick:707 · .pet-asleep:710 · .sleep-badge:711 · .btn-sleep:713
.dinner-btn:716 · .food-box:720,721 · .food-grid:722 · .fav-tag:742 · .fd-exp:746 · .food-sec:748
.food-sec-human:752 · .bad-tag:754 · .fd-toxin:758 · .fd-safe:759 · .fq-box:762,763 · .fq-progress:764
.fq-pair:765,766 · .fq-ask:767 · .fq-why:768 · .fq-btns:772,773,777 · .fq-yes:778 · .fq-no:779
.fq-next:780 · .food-cancel:781 · .feed-box:787,788 · .feed-gain:790 · .sick-badge:794 · .big-btn:800,806,1042,1043(+6)
.shop-card:809 · .shop-title:813 · .shop-grid:814 · .shop-item:815,819,820,821(+4) · .it-tag:826 · .tag-wear:827
.lock-banner:829 · .home-current:835,840,841 · .home-img:842 · .home-emoji:843 · .home-btn:844,866 · .home-layout:846
.home-pic-col:847,853 · .home-img-big:851 · .home-info-col:854,856,859,860 · .home-name-row:857 · .home-desc-row:858 · .home-shop-box:868,869
.home-list:870 · .home-option:871,875,876,877(+1) · .home-opt-img:878 · .home-opt-body:880,881 · .home-price:882 · .reset-link:887
.login-card:893 · .login-pets:894 · .login-status:895 · .google-btn:896,902,903 · .login-note:904 · .install-btn:907,913,914
.install-guide-overlay:917 · .install-guide:921,925,928 · .install-steps:926,927 · .install-guide-close:929 · .login-account:934 · .register-card:937,941,959,963
.reg-safety:943,945,946 · .reg-privacy:948,950,951 · #screen-register:953,954,955,956(+2) · .student-chip:964 · .clock-chip:968 · .online-count:974
.online-row:981,985,986,1005 · .online-dot:990 · .online-name:995 · .online-act:999 · .online-ava:1004 · .online-live:1006
.online-note:1010 · .lb-empty:1013 · .lb-list:1014 · .lb-row:1015,1019,1020 · .lb-rank:1024 · .lb-name:1026,1030
.lb-coins:1034 · .lb-hint:1036 · .lb-badgeline:1037 · .lb-tabs:1039 · .lb-tab:1040,1041 · .tinv-note:1052
.cat-card:1058,1103,1106,1254(+1) · .cat-head:1062 · .cat-emoji:1063 · .cat-name:1064 · .cat-pass:1065 · .cat-info:1066
.cat-btns:1067 · .cat-btn:1068,1072,1073,1074(+3) · .cats-back-bottom:1077 · .tapglow:1082,1083,1091 · .lobby-bottom:1090 · .band-sec-head:1101,1102
.bax-box:1110,1112 · .bax-head:1113 · .bax-sub:1114,1115 · .bax-row:1116 · .bax-lv:1117,1120,1121,1122(+3) · .bax-emoji:1123
.bax-name:1124 · .bax-q:1125 · .bax-need:1127 · .bax-rw:1128 · .bax-foot:1132 · .bax-rank:1133,1136
.bxr-box:1139,1141 · .bxr-head:1142 · .bxr-sub:1143 · .bxr-body:1144 · .bxr-pick:1145 · .bxr-cats:1146
.bxr-chip:1147,1149,1150,1151(+1) · .bxr-list:1154 · .bxr-row:1155,1157,1159,1163 · .bxr-rk:1158 · .bxr-nm:1160,1161 · .bxr-sc:1162
.bxr-tm:1164 · .bxr-more:1165 · .bxr-none:1166 · .bxr-foot:1168 · .band-mine-tag:1169 · .bsp-box:1172,1175
.bsp-head:1176 · .bsp-prog:1177 · .bsp-retake:1179,1182 · .bsp-info:1184,1186 · .rts-box:1189 · .rts-head:1191
.rts-sets:1192 · .rts-set:1193,1194,1195 · .rts-sub:1196 · .rts-words:1197 · .rts-word:1198,1200,1201 · .rts-foot:1202
.rts-okbtn:1203,1205 · .bsp-grid:1206 · .bsp-chip:1207,1210,1211,1212(+1) · .bsp-num:1214 · .bsp-best:1215 · .bsp-tick:1216
.bsp-foot:1217 · .vb-box:1220,1222 · .xsp-box:1225 · .vb-head:1226 · .vb-total:1227 · .vb-quizbtn:1228,1230
.vb-tabs:1231 · .vb-tab:1232,1234,1235 · .vb-words:1236 · .vb-word:1237,1240,1241,1242(+3) · .vb-empty:1246 · .vb-foot:1247
.vb-pg:1248,1250 · #vb-pginfo:1251 · .vb-hint:1252 · .band-lock:1260 · .offline-btn:1261,1262 · .quiz-progress:1267
.quiz-phon:1268 · #quiz-extra:1269,1271,1272,1273 · .quiz-word-card:1274 · .quiz-next:1280,1286,1287,1288(+1) · .quiz-choice:1291,1296,1297,1298 · .quiz-score-pill:1299
.quiz-time-pill:1301,1303 · .stats-card:1306 · .stats-title:1310,1774 · .stats-row:1311,1312,1313,1314 · .stat-badge-line:1316,1319 · .stat-badge-ic:1317
.game-top:1322 · .back-btn:1323 · .combo-pill:1327 · .timer-wrap:1331 · .timer-fill:1332,1333 · .board-label:1335
.card-grid:1336 · .word-card:1337,1343,1344,1345(+3) · .hint-btn:1351,1356 · .game-endless-note:1359,1364,1366,1370(+6) · .report-btn:1391,1396 · .report-box:1399
.report-close:1400 · .rp-head:1404 · .rp-avatar:1405,1406 · .rp-title:1407 · .rp-sub:1408 · .rp-levelcard:1410
.rp-level-top:1414 · .rp-bar:1415 · .rp-bar-fill:1416 · .rp-level-note:1417,1418 · .rp-grid:1420 · .rp-stat:1421
.rp-ic:1424 · .rp-num:1425 · .rp-lbl:1426 · .rp-section:1428 · .rp-h3:1429 · .rp-badge-mini:1430
.rp-row:1431,1432,1433 · .rp-empty:1434 · .rp-badges:1435 · .rp-badge:1436 · .rp-tline:1439 · .rp-tl-head:1440,1441
.rp-tl-ems:1442 · .rp-em:1443,1444 · .rp-tl-note:1445,1446 · .rp-crown:1448,1449 · .rp-wtitle:1451 · .rp-wnow:1452,1453
.rp-wgraph:1454 · .rp-wcol:1455 · .rp-wval:1456 · .rp-wbar:1457,1458 · .rp-wlbl:1459 · .rp-cheer:1461
.report-ok:1465 · .summary-box:1468,1523,1527,1528(+2) · .sm-burst:1469 · .sm-title:1471 · .sm-line:1472 · .sm-coin:1473
.sm-matches:1479,1480 · .confetti:1482 · .sm-badge:1489 · .sm-badge-all:1493 · .badge-celebrate-overlay:1496,1513 · .badge-celebrate:1502
.bc-emoji:1508,1510 · .bc-emoji-img:1509 · .bc-title:1511 · .bc-sub:1512 · .sm-cheer:1517 · .sm-streak:1518,1519
.sm-sick:1520 · .sm-btns:1521 · .float-fx:1533 · .toast:1540 · .toast-warn:1547,1554,1555,1561 · .toast-clear-all:1563,1570
.alert-box:1572 · .alert-ok:1573,1578 · .settings-box:1580 · .set-row:1581 · .set-hint:1585 · .set-hint-on:1586
.set-hint-off:1587 · .set-lwrap:1588 · .set-label:1589 · .set-desc:1590 · .set-switch:1591,1595,1596,1601(+4) · .set-sw-knob:1597
.set-sw-txt:1604 · .set-night-row:1613 · .set-seg:1614,1616,1622,1623(+1) · .set-close:1625,1630 · .set-help:1631,1636 · .help-box:1638,1639,1644
.help-item:1640 · .update-banner:1652,1661,1662 · #update-reload:1663 · #update-dismiss:1667 · .levelup-overlay:1673,1679,1680 · .levelup-box:1681,1688,1689,1690(+4)
.bill-box:1696,1700,1701 · .tag-off:1702 · .home-decayed-img:1703 · .home-dark-img:1704 · .thirst-fill:1705 · .thirst-text:1706,1707
.toxin-fill:1710 · .toxin-text:1711,1712 · .detox-btn:1713,1718 · .shape-text:1721,1722,1723,1724(+1) · .avatar-pick:1728 · .avatar-opt:1729,1733,1734,1735
.avatar-chip-img:1739 · .mini-av:1741 · .fp-ava:1742 · .avatar-chip-blk:1744 · .set-avatar-btns:1745 · .avatar-mini:1746,1750
.set-blk-row:1752 · .set-sub2:1753 · .blk-grid:1755 · .blk-mini:1756,1759,1760,1761 · .game-avatar:1764,1765,1766 · .stats-nick:1775
.ticket-owned:1778,1782 · .collect-sub:1787 · .mkt-tabs:1788 · .mkt-tab:1789,1793 · .mkt-filter:1794 · .mkt-row:1798
.mkt-emoji:1802,1803 · .mkt-info:1804,1805 · .mkt-tier-stars:1806 · .mkt-buy:1807,1812,1813 · .mkt-price-lo:1814 · .mkt-price-hi:1815
.mkt-empty:1816 · .collect-grid:1819 · .collect-cell:1820 · .cc-emoji:1821,1822 · .cc-name:1823 · .cc-count:1824
.cc-list-btn:1825,1829 · .mkt-listhead:1830 · .mkt-group-head:1832,1838 · .mkt-two-col:1840,1841,1845,1857(+8) · #phone-card:1846,1862 · #computer-card:1847,1863
#ticket-card:1849 · #haunt-card:1850 · #heli-card:1851 · #drone-card:1852 · #drive-card:1853 · #soccer-card:1854
#moto-card:1855 · #invasion-card:1856 · .mkt-listing:1884 · .ml-cancel:1888 · .mkt-sold:1894,1895,1896 · .list-dialog:1903,1904,1909
.list-hint:1908 · .collect-reveal-frame:1912,1919 · .collect-reveal-img:1918 · .collect-reveal-stars:1920 · .craft-box:1923 · .craft-head:1924
.craft-bar:1925 · .craft-fill:1926 · .craft-text:1927 · .craft-btn-row:1928,1929 · .craft-go-btn:1931,1937,1938,1941 · .craft-cancel:1949,1953
.mkt-catalog:1956,1957,1958 · .mkt-pager:1961 · .pg-btn:1962,1966,1967 · .pg-mid:1968 · .pg-dots:1969 · .pg-dot:1970,1971
.order-head:1972 · .order-row:1973,1978,1980,1982 · .order-deliver:1983,1988 · .order-need:1989 · .avatar-chip-photo:1995 · .pass-photo:1996
.pl-photo:1997 · .pp-cam:2002,2010 · .set-photo-row:2013,2019 · .ph-thumb:2020 · .ph-plus:2021 · .photo-box:2027,2028,2049,2053(+4)
.ph-now:2029 · .ph-now-img:2030,2034 · .ph-now-cap:2035 · .ph-warn:2036 · .ph-sync:2041,2044 · .ph-sync-wait:2045
.ph-sync-ok:2046 · .ph-sync-bad:2047 · .ph-btns:2048 · .ph-tip:2058 · .ph-stage:2060,2064 · .ph-cv:2065
.ph-ring:2066,2071 · .ph-zoom:2075 · .ph-foot:2076 · .ph-crop-box:2077
