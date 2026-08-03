# CODE_MAP.md — แผนที่โค้ด:บรรทัด (เจนอัตโนมัติโดย `tools/gen_code_map.py` — **ห้ามแก้มือ** เดี๋ยวโดนเขียนทับ)

> วิธีใช้: หาชื่อฟังก์ชัน/ค่าคงที่/selector ในไฟล์นี้ (Grep หรือกวาดตา) → `Read` ไฟล์จริง `offset=<บรรทัด>` `limit=40`
> 🗂️ ไฟล์อ้วนมี **สารบัญโซน** (`st-end ชื่อโซน`) — งานทั้งระบบ/โลก 3D: Grep ชื่อโซน → Read/Edit เฉพาะช่วงนั้น **ห้ามอ่านทั้งไฟล์** · เพิ่มระบบใหม่ในไฟล์อ้วนต้องครอบ banner `/* ==== */`+ชื่อโซน (สารบัญเจนเอง)
> css = index `selector:บรรทัดทุกจุดที่ประกาศ` (บั๊ก UI เริ่มหาที่นี่) · เจนใหม่ทุกครั้งที่รัน `python tools/rotate_handoff.py` · อัปเดต: 2026-08-03

## js/adv3d_css.js (1,192 บรรทัด · 0 รายการ)

## js/adv3d_intro.js (86 บรรทัด · 0 รายการ)

## js/adv3d_tex.js (245 บรรทัด · 19 รายการ)
TILE_COLORS:9 · letterTexture:10 · letterTextureDark:27 · emojiTexture:40 · GHOST_IMG_MAX:52 · measureGhostBox:58
probeGhostImages:71 · whenGhostsReady:83 · ghostTexture:87 · ghostScareSrc:92 · AD_STYLES:100 · adBoardTexture:109
addAdBillboard:156 · ringAds:167 · BUILDING_TINTS:177 · FACADE_ROWS:179 · buildingFacadeTexture:180 · makePeerSprite:205
bind:241

## js/adventure3d.js (12,812 บรรทัด · 620 รายการ)
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
- 4795-5442 DOM overlay + CSS (สร้างครั้งเดียว — self-contained ไม่แตะ style.css)
- 5443-5578 Input — เมาส์+คีย์บอร์ด และจอสัมผัส (มือถือ landscape)
- 5579-5583 🚁 โหมดเฮลิคอปเตอร์ Bell — ฟิสิกส์บินแบบอาร์เคด (สไตล์ Helicopter Flight Pilot)
- 5584-5976 🛸 โดรน FPV (โหมด drone) — บินเร็ว/คล่อง ลอดหน้าต่างเข้าตึกร้าง เก็บตัวอักษรในห้อง
- 5977-6099 🚗 โหมดขับรถเมืองกำแพงเพชร — ฟิสิกส์รถอาร์เคด (bicycle model)
- 6100-6193 🚦 รอบ 133: ไฟจราจรจริงที่ทางแยกใหญ่ + ฝ่าไฟแดงโดนใบสั่ง ม.22
- 6194-6641 🧭 GPS นำทาง (โหมด drive) — เลือกตัวอักษรเป้าหมาย + เส้นทางตามถนนจริง (A*) · นำทางด้วยภาพล้วน (ไม่มีเสียงพูด ตั
- 6642-6700 🎛️ เข็มหน้าปัดวิ่งจริง (สปีด 0-180 + วัดรอบ 0-8×1000) — วาดทับวงเกจของภาพ dash.png
- 6701-6785 🎵 รอบ 181: วิทยุในรถ — จอ head-unit กลางคอนโซล (visualizer + เลือกเพลง 3 โหมด)
- 6786-6829 🪞📷 รอบ 810: กระจกมองหลัง/ข้าง — เรนเดอร์ฉากเดิมซ้ำด้วยกล้องหันหลัง/เฉียงข้าง แล้วยัดลงกรอบบนจอ (scissor)
- 6830-6909 🪞🧑‍🤝‍🧑 รอบ 970: เพื่อนที่ขับตามมา "เห็นในกระจกมองหลัง" + ป้ายชื่อลอยเหนือรถเขา
- 6910-7037 🪆 รอบ 191: ตุ๊กตาดุ๊กดิ๊กหน้ารถ — รูปตัวละครที่ผู้เล่นเลือก (blkN.png)
- 7038-7341 🚔 รอบ 128: แผงเตรียมออกรถ + กฎหมายจราจร + ใบสั่ง
- 7342-7384 🛩️📦 ภารกิจไปรษณีย์กลางคืน (รอบ 353) — เฉพาะช่วงฟ้ามืด (heliNight>.5)
- 7385-8599 🚶🛗🚁🪂 โหมดเดินเท้าในเมืองเฮลิฯ (รอบ 354 — ผู้ใช้สั่ง)
- 8600-8673 🎛️ หน้าปัดเข็มขยับจริง (รอบ 61) — วาดสดทุกเฟรมจากค่าการบินจริง
- 8674-8945 🌧️☀️ ชั้นบนกระจก: ที่ปัดน้ำฝน + แสงแดดสาด (รอบ 346)
- 8946-9350 🔊🌧️ เสียงที่ปัดน้ำฝน (รอบ 537) — สังเคราะห์ล้วน ไม่มีไฟล์เสียง
- 9351-9420 📹 กล้องใต้ท้องเครื่อง (belly cam) — รอบ 348
- 9421-9492 🎯 วงเป้าลงจอด (รอบ 349) — ไฮไลต์ดาดฟ้าที่มีตัวอักษร ให้รู้ว่าควรร่อนลงตรงไหน
- 9493-10108 📏 แถบเตือนความเร็วดิ่ง (รอบ 349) — ลงเร็วเกินกรอบกล้องกะพริบแดง สอนให้ร่อนลงนุ่มๆ
- 10109-10111 Loop หลัก
- 10112-11739 ⚽ โหมดสนามฟุตบอล — ฟิสิกส์บอล + เล็ง + ชาร์จพลัง + กล้อง 1st/3rd + ชุดนักเตะ
- 11740-12195 🤖 โหมดหุ่นยนต์นักรบ — เดินยิงเอเลี่ยนตัวอักษร (ต้องยิงเรียงลำดับในคำ)
- 12196-12216 เข้า/ออกโลก
- 12217-12812 ❓ การ์ด "วิธีเล่น" ตอนเข้าโลกครั้งแรก (จำแยกต่อโลกใน localStorage — ไม่แตะ state.js)
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
loadCarWheel:4812 · buildDom:4822 · confirmExit:5427 · IS_TOUCH:5446 · HAS_KBD:5448 · bindInput:5449
movePlayer:5544 · tickPlayer:5554 · collideDrone:5587 · propStall:5606 · propBreak:5613 · propFix:5620
droneBatAdd:5627 · lightningBolt:5630 · startRain:5641 · stopRain:5655 · smashGlass:5657 · awardGlass:5668
neededLetter:5685 · openDoor:5700 · raceStartRun:5720 · raceStop:5727 · gateHighlight:5745 · renderRaceHud:5752
tickDrone:5761 · nearMissTick:5904 · showNearMiss:5928 · awardDaredevil:5939 · comboCheer:5956 · comboFlash:5972
driveCell:5981 · nearestStreet:5987 · collideCar:5997 · tlDotY:6028 · tlSet:6032 · driveArms:6049
tlTick:6061 · TL_GREEN:6105 · tlRedDur:6107 · tlightPhase:6108 · buildTrafficLights:6115 · rlTick:6167
cellDrivable:6199 · cellWeight:6202 · cellBlocked:6207 · cellCenter:6208 · posReachable:6210 · losClear:6221
nearestDrivableCell:6232 · routeGrid:6244 · pickGpsTarget:6297 · NAVLINE_W:6320 · NAVLINE_SKIP:6321 · navLineEnsure:6322
navLineHide:6332 · navLineUpdate:6333 · tickGps:6369 · tickDrive:6440 · drawCarDial:6648 · drawCarGauges:6678
RADIO_RECT:6706 · CAR_RADIO_RECT:6708 · carRadioRect:6714 · radioLayout:6716 · radioSetHint:6739 · renderRadioList:6745
radioToggleList:6755 · drawRadioViz:6760 · radioTick:6778 · MIRROR_REAR:6792 · mirrorRearRect:6795 · mirrorPass:6797
toggleMirrorMini:6810 · drawCarMirrors:6817 · MTAG_MAX_D:6839 · mirrorTagsHide:6843 · mirrorTagName:6844 · mirrorTagsTick:6845
BOBBLE_FOOT:6915 · BOBBLE_H:6916 · BOBBLE_ASPECT:6917 · BOB_OMEGA:6920 · BOB_PITCH_FORCE:6922 · BOBBLE_SKINS:6924
bobbleSetAvatar:6931 · bobbleLayout:6938 · bobbleTick:6951 · bobblePoke:6976 · bobbleApplySkin:6993 · dollOwned:7003
openDollPicker:7004 · carStartShow:7041 · showLawInfo:7059 · lawNotice:7081 · driveFineSettle:7091 · HELI_PHASES:7270
heliStartPhase:7277 · heliFloorAt:7284 · SOFT_TIERS:7294 · softLandBonus:7296 · awardPerfLand:7309 · setHeliLight:7328
MAIL_COIN:7347 · mailStart:7349 · mailStop:7372 · mailTick:7373 · FOOT_EYE:7392 · doorSlideSfx:7398
doorLerp:7421 · entLerp:7429 · footStepSfx:7439 · WRING_COIN:7460 · festivalPaint:7464 · dustTexture:7476
dustBurst:7485 · dustTick:7499 · HELI_GLB_URL:7520 · HELI_GLB_TEX_BLUE:7522 · HELI_GLB_ROTOR:7524 · HELI_GLB_TROTOR:7525
heliGlbEnsure:7527 · heliMatBlueGet:7545 · heliGlbAssemble:7558 · heliNavTick:7597 · peerRotorStop:7604 · peerRotorTick:7610
heliCrashSfx:7629 · heliMeshBuild:7657 · heliMeshBuildLegacy:7668 · buildHeliFoot:7798 · footFloorAt:7914 · insideTerm:7921
inDoorZone:7922 · footHint:7926 · setFootBtns:7927 · liftStart:7932 · beginRide:7943 · endRide:7966
beginWing:7977 · awardAirLetter:7990 · paxChoiceShow:8009 · paxChoiceHide:8035 · pilotShipMesh:8039 · beginPilot:8040
endPilot:8072 · drawCabinWindow:8096 · tickHeliFoot:8120 · heliWallPenalty:8331 · tickHeli:8343 · CP_NAT:8608
CP_GAUGES:8609 · SEAT_LABEL:8622 · SEAT_P_FULL:8623 · SEAT_ZOOM:8624 · DASH_OFF_Y:8625 · DASH_DROP:8626
setSeat:8628 · layoutCockpit:8640 · WIPER:8679 · WIPER_SPD:8682 · WIPER_LABEL:8683 · INT_GAP:8684
WASH_MS:8688 · WASH_TANK_MAX:8692 · SMEAR_LIFE:8704 · CHOP_MIN:8705 · SUN_RAY_FAR:8709 · sunRayBlocked:8711
sunShadeTick:8730 · applyCockpitShade:8741 · rotorChop:8753 · sunUpdate:8761 · HELI_FOG_N0:8772 · fogUpdate:8776
adGlowPulse:8824 · RAIN_MAX:8833 · VISOR_Y:8834 · RAIN_MIN:8835 · RAIN_DUR:8836 · DROP_ZONE:8840
addDrop:8841 · tickDrops:8849 · addWashDrop:8867 · washStart:8874 · renderWashGauge:8894 · washTick:8905
grimeTick:8922 · WIPE_R:8929 · wipeDrops:8930 · wiperSndOn:8953 · wiperSndOff:8965 · wiperThunk:8971
washSpraySfx:8983 · wiperSqueak:9000 · wiperSndTick:9017 · setWiper:9037 · tickWiper:9049 · SH_SWEEP:9080
shadowSweepTick:9082 · REFL_MAX:9094 · REFL_COL:9096 · cityGlowLevel:9097 · drawCityGlow:9102 · setVisor:9134
rainTick:9140 · drawBlade:9157 · drawSmears:9176 · drawGlass:9196 · drawBellyCam:9358 · drawBellyHud:9381
drawLandingTargets:9427 · VS_HARD:9497 · drawDescentBar:9498 · heliShake:9547 · cpNeedle:9558 · drawGauges:9575
XF_START:9623 · PRELOAD_WAIT:9624 · ALT_QUIET_FROM:9626 · ALT_MAX_DAMP:9627 · ALT_LP_MIN:9628 · ECHO_NEAR:9629
WIND_FULL_SPD:9630 · SHUTDOWN_SEC:9631 · PAN_MAX:9633 · OD_RPM:9634 · SHAKE_RPM:9635 · SHAKE_HIT:9636
soccerLetterPos:10116 · letterNeeded:10124 · soccerNeededSet:10133 · soccerTileGeo:10141 · soccerGoldTexture:10143 · makeSoccerTile:10160
soccerRefreshSkins:10169 · soccerBuildTargets:10176 · soccerNextTile:10186 · soccerRetarget:10202 · soccerCoinPop:10214 · soccerGrassTexture:10227
soccerTurfGrade:10249 · soccerTurfTexture:10300 · grassNormalTexture:10319 · soccerLinesTexture:10348 · soccerNetTexture:10399 · soccerCrowdTexture:10407
soccerBallMat:10426 · buildSoccerGoal:10446 · buildStands:10465 · soccerLedBoards:10500 · soccerGKEnsure:10597 · soccerGKTick:10613
fkBuildWall:10642 · fkToggle:10657 · fkHitTest:10673 · pkHud:10692 · pkStart:10701 · pkEnd:10715
pkTick:10730 · repQualify:10737 · repEnsureEl:10740 · repStart:10751 · repTick:10758 · soccerNumTex:10783
ssSec:10795 · ssPaintPattern:10800 · soccerShirtTex:10813 · makeSoccerPlayer:10835 · soccerNewSpot:10871 · soccerResetBall:10883
soccerKick:10890 · soccerCheer:10908 · guideTexture:10911 · auraActive:10935 · auraLeftMs:10936 · auraFlameTex:10944
auraCoilTex:10968 · auraCoilRibbon:10992 · auraGlintTex:11016 · buildAura:11027 · auraBuy:11070 · auraRender:11080
auraTick:11094 · buildDrill:11145 · drillTick:11158 · ballFXTex:11198 · buildBallFX:11209 · smokePuff:11225
ballFXTick:11233 · buildLandRing:11279 · buildGuideRibbon:11289 · renderSpinPad:11314 · spinPadToggle:11326 · spinPadPick:11332
renderCurl:11344 · kickLaunch:11355 · updateSoccerGuide:11364 · soccerCamera:11428 · tickSoccer:11451 · ssShirtPath:11645
ssShortsPath:11653 · ssPaintSwatchShirt:11658 · ssPaintSwatchShorts:11663 · ssPreviewDraw:11670 · soccerKitShow:11699 · soccerKitGo:11728
emojiSprite:11781 · makeAlien:11786 · startWave:11819 · waveSpawnFill:11830 · waveComplete:11839 · updateWaveHud:11849
checkMechaBossBadge:11851 · alienSpawnPos:11860 · removeAlien:11865 · mechaHudWord:11870 · setMechaHudSkin:11878 · mechaComboPop:11890
mechaShielded:11895 · mechaDamageFx:11897 · mechaHitByAlien:11902 · spawnAlienShot:11908 · removeAlienShot:11918 · tickAlienShots:11923
spawnPowerup:11935 · removePowerup:11948 · collectPowerup:11953 · tickPowerups:11960 · updateMechaHud:11969 · mechaTracer:12009
mechaFire:12018 · explodeAlien:12055 · tickMecha:12085 · loop:12141 · grabShot:12176 · savePhoto:12187
clearEntities:12199 · INTRO_KEY:12221 · introSeenObj:12222 · introSeen:12223 · markIntroSeen:12224 · INTRO:12225
INTRO_MODE:12227 · showIntro:12229 · HELI_KPP_BANNER:12255 · closeIntro:12257 · beginPlay:12263 · start:12265
exitWorld:12497 · mechaRecapLine:12569

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

## js/game.js (1,140 บรรทัด · 80 รายการ)
REPLAY_BONUS_EVERY:23 · REPLAY_BONUS_TIERS:25 · replayBonusFor:26 · SESSION_MILESTONES:32 · addSessionCoins:35 · updateBestTarget:74
weekKeyStr:87 · rolloverWeekBest:93 · exitGame:99 · showSessionSummary:135 · sprinkleConfetti:182 · VOCAB_PER_LEVEL:201
VOCAB_RANK_NAMES:202 · vocabRankName:203 · showProgressReport:205 · THUNDER_MS:386 · THUNDER_TIERS:390 · THUNDER_TIER_UI:391
thunderEmoji:392 · DAREDEVIL_TIERS:396 · DAREDEVIL_TIER_UI:397 · daredevilEmoji:398 · GLASS_TIERS:402 · GLASS_TIER_UI:403
glassEmoji:404 · DILIGENT_TIERS:408 · DILIGENT_TIER_UI:409 · diligentEmoji:410 · SOFTLAND_TIERS:414 · SOFTLAND_TIER_UI:415
softLandEmoji:416 · AIRL_TIERS:420 · AIRL_TIER_UI:421 · airLetterEmoji:422 · MECHABOSS_TIERS:426 · MECHABOSS_TIER_UI:427
mechaBossEmoji:428 · TYPIST_TIERS:435 · TYPIST_TIER_UI:436 · typistEmoji:438 · checkTypistBadge:440 · BIGEXAM_TIERS:456
BIGEXAM_TIER_UI:457 · bigExamEmoji:458 · bigExamCertCount:460 · checkBigExamBadge:465 · BFF_TIERS:480 · BFF_TIER_UI:481
BFF_COIN:482 · bffEmoji:483 · badgeSuffix:488 · BADGE_META:507 · NAME_BADGE_RE:524 · splitNameBadges:525
badgeEmojis:531 · badgeScore:536 · BADGE_CATS:543 · bcatLevel:556 · checkCrown:563 · currentBadgeScore:579
rolloverBadgeWeek:583 · addDiligent:596 · celebrateBadge:612 · showBadgeInfo:631 · addThunder:649 · startGame:663
newRound:703 · updateTimerBar:742 · updateComboPill:748 · pickCard:752 · checkMatch:764 · renderCats:878
fmtMMSS:928 · quizTimerStop:932 · quizTimerStart:937 · quizElapsed:947 · startQuiz:951 · renderQuizQuestion:969
quizNext:1033 · finishQuiz:1046

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

## js/images.js (216 บรรทัด · 25 รายการ)
IMG_FILES:11 · MOODS:12 · COLLECTIBLES_IMG_V:16 · GIFTS_IMG_V:17 · startImgKey:19 · petImageKeys:21
probeImages:33 · probeRankImages:45 · probeCollectImages:46 · probeGiftImages:47 · probeHomeImages:48 · CLIP_FILES:57
CLIP_SM:63 · clipCanWebm:79 · CLIP_ASSET_V:90 · clipFileFor:92 · petClipKey:101 · petClipUrl:110
equippedItem:121 · petStateImg:131 · petWearOverlay:152 · wearLayerHTML:173 · happyNow:180 · makeHappy:181
currentPetImg:194

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

## js/main.js (425 บรรทัด · 6 รายการ)
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

## js/online.js (1,848 บรรทัด · 97 รายการ)
### 🗂️ สารบัญโซน js/online.js (Read/Edit เฉพาะช่วง)
- 2-206 ENGINE: ระบบออนไลน์จริงผ่าน Firebase Realtime Database
- 207-300 ระบบเพื่อน (ข้อ 0.3): รหัสเพื่อน + ค้นหา + ส่ง/รับคำขอ
- 301-490 ระบบแชทกับเพื่อน (ข้อ 0.4)
- 491-656 ระบบส่งของขวัญ (ข้อ 0.5)
- 657-773 🏪 ตลาดออนไลน์จริง (item 2 backlog): ซื้อ-ขายสินค้าที่เพื่อน "ผลิตเอง" ข้ามผู้เล่น
- 774-838 คำเชิญเล่นโลก 3D ด้วยกัน — /tinv/<toUid>/<fromUid> = {map,n,ts}
- 839-1035 📰 Follow + Feed กิจกรรม (รอบ 155) · 🌍 หน้า Feed ทุกคน + ไลก์/คอมเมนต์ (รอบ 639)
- 1036-1043 🌍 หน้า Feed ทุกคน + ไลก์/คอมเมนต์ (รอบ 639)
- 1044-1261 📰 รอบ 701 — ฟีดล็อบบี้ทีละโพสต์ + รีแอ็กชัน + แจ้งเตือน (ต่อยอดรอบ 639)
- 1262-1848 📞 โทรหาเพื่อน — Voice call / Video call แบบ LINE (รอบ 625 · กลุ่ม 3 คนรอบ 631)
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
gfeedPush:1057 · gfeedPrune:1071 · gfeedParse:1084 · gfeedWatchStart:1113 · gfeedWatchStop:1140 · gfeedNotifDiff:1148
gfeedNotifPush:1181 · uidDisplayName:1188 · gfeedRebuild:1199 · gfeedToggleLike:1216 · gfeedSetReaction:1221 · gfeedToggleCommentLike:1232
gfeedAddComment:1242 · CALL_RTC_CFG:1286 · CALL_RING_MS:1287 · CALL_MAX_MS:1288 · CALL_MAX_PEERS:1289 · onlineStart:1705
onlineLoadSDK:1823

## js/photo.js (361 บรรทัด · 25 รายการ)
PHOTO_LS_KEY:12 · PHOTO_MAX:13 · PHOTO_PREFIX:14 · PHOTO_SIZES:15 · PHOTO_QS:16 · PHOTO_ZMAX:17
photoValid:25 · photoOnline:28 · photoGet:31 · photoHas:32 · photoIsMine:33 · photoOf:36
photoFetch:44 · photoAfterChange:61 · photoPush:65 · photoVerify:83 · photoSaveUrl:93 · photoRemove:99
photoPullMine:106 · photoBlkSrc:122 · photoMiniHTML:129 · openPhotoMenu:137 · photoLoadImgEl:203 · photoLoadFile:211
openPhotoCrop:224

## js/sgaward.js (28 บรรทัด · 0 รายการ)

## js/shootword.js (1,079 บรรทัด · 0 รายการ)

## js/state.js (1,177 บรรทัด · 93 รายการ)
STORAGE_KEY:6 · QUIZ_PASS_REWARD:11 · CURE_COST:13 · HUNGRY_SICK_MS:14 · MEAL_HOUR:16 · MEAL_FULL:17
SLEEP_FROM_HOUR:18 · SLEEP_SICK_HOUR:19 · WAKE_HOUR:20 · DINNER_COST:21 · TOXIN_FULL:23 · DETOX_COST:24
FOODQUIZ_Q:26 · FOODQUIZ_COIN:27 · FOODQUIZ_BONUS:28 · FOODQUIZ_MAX_PLAYS:29 · SHAPE_JUNK_MEALS:31 · SHAPE_CLEAN_MEALS:32
SHAPE_MISS_MEALS:33 · SHAPE_EXP_BONUS:34 · HEAT_SICK_MS:35 · THIRST_SICK_MS:36 · DEFAULT_STATE:38 · FEED_CATS:202
FEED_REACTIONS:216 · feedRx:224 · FEED_QUICK_CM:226 · SLOT_MS:238 · currentSlotStart:239 · nextSlotStart:245
mealDayKey:247 · nightKeyOf:249 · isNightNow:257 · newPet:262 · loadState:286 · saveState:577
activePet:584 · petStage:585 · isAdult:590 · abilityOn:591 · hasPetType:592 · todayStr:595
dailyTick:599 · addCoins:602 · QUEST_POOL:622 · QUEST_PER_DAY:631 · questsToday:632 · questTick:639
questEvent:643 · assetValue:679 · netWorth:699 · assetCount:701 · refreshRank:718 · heatProtected:734
rainProtected:738 · petHungry:741 · hungerSickLock:750 · hungerSickMsg:761 · petShapeOf:769 · updatePetShape:775
shapeMealDone:782 · heatPct:792 · ymStr:801 · billOutstanding:805 · UTILITIES:812 · HOME_UTILITIES:818
homeDecayed:820 · billTick:823 · PET_FOOD_PER_PET:895 · petFoodTick:896 · myCar:922 · carLoanDue:927
carLoanOverdue:932 · carLoanPayable:937 · carLoanPay:944 · compTick:957 · ONLINE_RATE:971 · onlineEarnActive:972
onlineEarnTick:976 · onlineEarnFlush:987 · marketTick:997 · addCraft:1021 · ORDER_MAX:1040 · ORDER_LIFE_MS:1041
ORDER_GAP_MIN_MS:1042 · ORDER_GAP_SPAN_MS:1043 · ORDER_TIER_WEIGHT:1044 · newOrder:1045 · orderTick:1058 · careTick:1066
expNeed:1148 · addExp:1153 · addRP:1173

## js/tpaward.js (41 บรรทัด · 0 รายการ)

## js/typing.js (369 บรรทัด · 0 รายการ)

## js/ui.js (8,952 บรรทัด · 363 รายการ)
### 🗂️ สารบัญโซน js/ui.js (Read/Edit เฉพาะช่วง)
- 2-77 UI: Dashboard / ร้านค้า / ที่พัก / ร้านสัตว์เลี้ยง / แรงค์ / สถิติ
- 78-308 🎬 เวทีน้องน่ารัก (Cute Pet Show) — รอบ 604 (ผู้ใช้สั่ง 26 ก.ค. 2026)
- 309-603 🆕 New Word (รอบ 116): คำศัพท์ใหม่ 1 คำ/การ login ตามระดับชั้น
- 604-627 นาฬิกาใต้ชื่อผู้เล่น (วัน · วันที่ · เวลา อัปเดตทุกวินาที)
- 628-680 ข้าวเย็นของผู้เล่น (คิว 7725691507 ข้อ 6)
- 681-712 แถบฝนประจำวัน: นับถอยหลังถึง 19:00 ทุกวัน (ฝนตก 1 ชม.)
- 713-765 เอฟเฟกต์ฝนเต็มจอ (รอบยี่สิบ): ฝนตกจริง (19:00-20:00) + ไม่มีบ้านสภาพดี
- 766-786 การ์ด "คนที่กำลังทำการบ้านไปพร้อมๆ กับเรา"
- 787-841 รอบ 149: กล่อง aside ขวาเลื่อนวนอัตโนมัติ (ล่าง→บน) ไม่มี scrollbar
- 842-1233 Daily Quest (item 3): การ์ดภารกิจวันนี้ใน aside ขวา
- 1234-1326 รอบ 153: เมนูลัดแตะแถวเพื่อนออนไลน์ในกล่อง aside
- 1327-1911 การ์ด Leaderboard — สลับแท็บในการ์ดเดียว (ประหยัดพื้นที่):
- 1912-2276 การ์ดข้อมูลผู้เล่น 👤 — คลิกชื่อในการ์ดเพื่อน/กระดาน แล้วโชว์
- 2277-2527 แผงเพื่อน 👥 (ข้อ 0.3): รหัสเพื่อน + ค้นหา + คำขอ + รายชื่อเพื่อน
- 2528-2623 🌍 เพื่อนอยู่โลก 3D ไหน + ปุ่ม "ตามเข้าไป" (รอบ 642)
- 2624-2662 แชทกับเพื่อน (ข้อ 0.4) — กล่องแชทลอยกลางจอ + แผง emoji
- 2663-3064 รอบ 179: หน้ารวมข้อความ (inbox แบบ Messenger — ธีมกระจกฟ้า sci-fi ของเกม)
- 3065-3425 ระบบส่งของขวัญ (ข้อ 0.5) — ห้องของขวัญ + กล่องเลือกส่ง + ฉากเปิด
- 3426-3518 RANK CARD + ฉากเลื่อนแรงค์
- 3519-3521 PET DASHBOARD
- 3522-3591 📰 รอบ 155: overlay ข้อมูลน้อง & การดูแล + ฟีดกิจกรรมเพื่อน
- 3592-4176 📰 รอบ 701 — ฟีดล็อบบี้ "ทีละโพสต์" แบบ Facebook (ผู้ใช้สั่ง 29 ก.ค. 2026)
- 4177-4387 🌍 รอบ 639: หน้า Feed เต็มจอ — ทุกคน (ไม่ใช่แค่ follow) + ไลก์/คอมเมนต์
- 4388-5057 📖 Dictionary ค้นหาคำศัพท์ (รอบ 254 ผู้ใช้สั่ง 16 ก.ค. 2026)
- 5058-5101 การนอน (คิว 7725691507 ข้อ 1)
- 5102-5490 ให้อาหาร (ระบบมื้อเย็น 18:00 + ความอิ่มสะสม — ข้อ 2+3)
- 5491-5609 🛡️ ควิซอาหารปลอดภัย (ต่อยอดข้อ 5.1)
- 5610-5695 🎀 ห้องแต่งตัวสัตว์เลี้ยง (รอบ 635: แยกออกจาก "ร้านค้า" เดิม —
- 5696-5883 ที่พัก (หลบแดด/หลบฝน) + เครื่องปรับอากาศ
- 5884-6001 บิลสาธารณูปโภค (ค่าไฟ/ค่าน้ำ — เครื่องยนต์อยู่ใน state.js: UTILITIES/billTick)
- 6002-6084 การ์ดมือถือ (ข้อ 7): ซื้อ 10,000 ขายคืน 6,000
- 6085-6095 การ์ดคอมพิวเตอร์ (ข้อ 11): ซื้อ 50,000 ขายคืน 30,000
- 6096-6140 item 8: โบนัสออนไลน์ +0.01 เหรียญ/วิ ฟรีทุกคนที่เปิดเกมออนไลน์อยู่
- 6141-6734 💻 รอบ 706 (ผู้ใช้สั่ง 29 ก.ค. 2026): ช่องรายได้คอมพิวเตอร์บนแถบบนล็อบบี้
- 6735-6874 🌍 ปุ่มลัดเข้าโลก 3D ในรางเมนูซ้าย (ผู้ใช้สั่ง 9 ก.ค. 2026)
- 6875-7028 🧭 ป้ายบอกทางของรางเมนูซ้าย (รอบ 601 · ผู้ใช้สั่ง 26 ก.ค. 2026)
- 7029-7198 การ์ดสวนผลไม้ (ข้อ 12): ซื้อต้นไม้ปลูกได้ไม่จำกัด แต่ละต้นออกผล
- 7199-7208 โรงงานผลิตสินค้า 🏭 + ตลาดขายต่อ (แนวคิดใหม่ 5 ก.ค. 2026)
- 7209-7231 โรงงานผลิต (แผง 🏭) — แยกออกจากตลาด (ผู้ใช้สั่ง 6 ก.ค. 2026)
- 7232-7384 ตลาดขายสินค้า (แผง 🏪) — แยกออกจากโรงงาน
- 7385-8309 🚗 รอบ 131: หมวดยานพาหนะ — โชว์รูมรถ 10 คัน (แคตตาล็อก 5 ช่อง/แถว)
- 8310-8370 ร้านสัตว์เลี้ยง (ซื้อเพิ่มได้ ไม่ลบตัวเดิม)
- 8371-8407 เลเวลอัพ (รายตัว)
- 8408-8513 สถิติผลการเรียนรู้
- 8514-8551 item 4: การ์ดสรุปส่งครู — ใบเดียวจบ ชื่อ/วัน-เวลา/เหรียญวันนี้/แรงค์/สอบล่าสุด
- 8552-8952 📞 หน้าจอโทรหาเพื่อน — สายเสียง (รอบ 625 · กลุ่ม 3 คน + ปิดวิดีโอ รอบ 631)
### รายการ js/ui.js
startHTML:10 · PET_ANIM:30 · petAnimHTML:35 · petVisualHTML:50 · PET_SHOW:91 · PET_SHOW_STAGE:96
PET_SHOW_H:99 · petShowBgHTML:102 · petClipHint:145 · __clipReady:157 · petShowHTML:165 · PROF_AV_MAX:229
lobbyBlk:230 · caretakerFigureHTML:237 · footAlign:247 · heroRankBgHTML:281 · NEW_WORD_MS:315 · newWordNext:321
renderNewWord:332 · NW_GAP:370 · alignNewWord:371 · startNewWordTimer:388 · nwCountdownTick:405 · PAT_REMIND_HOUR:421
patRemindTick:422 · applyPatRemindGlow:443 · NEW_WORD_COIN:458 · NW_DAILY_GOAL:459 · NW_DAILY_BONUS:460 · newWordReward:461
nwDailyTick:484 · coinFlyFx:503 · nwDailyBarHTML:536 · showNewWordPopup:547 · renamePet:574 · mealLabel:591
fmtMins:598 · renderClock:607 · dinnerDue:633 · renderDinnerChip:638 · dinnerClick:649 · renderRainBar:684
rainFxTick:717 · RAIN_DROP_IMGS:740 · rainFxDrop:741 · selfPronoun:773 · selfTag:778 · idTag:782
SIDE_SCROLL_SPEED:792 · SIDE_SCROLL_RESUME:793 · initSideScroll:796 · sideScrollTick:824 · QUEST_FLASH_HOLD:848 · QUEST_SLIDE_MS:855
QUEST_RESUME_MS:856 · questGo:859 · SIDE_TALL_MIN:871 · sideIsTall:872 · qBigCardHTML:877 · qDeckGo:897
qDeckTick:917 · renderQuestCard:938 · sideFlashRows:998 · FRIEND_FLASH_GRACE:1016 · ONLINE_FLIP_MS:1024 · ONLINE_FLIP_RESUME:1025
ONLINE_SWIPE_STEP:1026 · ONLINE_ROW_H:1033 · onPerPage:1036 · onChunk:1042 · ONLINE_GAP_MAX:1052 · onPageSpread:1053
onPageDraw:1062 · onPageFlip:1073 · bindOnlinePager:1084 · renderOnlineCard:1119 · bindInviteCards:1241 · bindFriendQuickMenu:1261
openFriendQuickMenu:1271 · LB_TABS:1334 · LB_WS_TOP:1335 · LB_TP_TOP:1336 · LB_SG_TOP:1337 · bindLbTabs:1339
updateRankRailBadge:1374 · rankUpCheck:1393 · rankUpSound:1421 · renderLeaderboardCard:1432 · bindLbGroupOpen:1461 · lbRankRows:1473
LB_BCAT_TOP:1521 · lbBadgeSections:1526 · lbDemoRows:1551 · lbChar:1573 · lbfAwardBarHtml:1583 · openLeaderboardFull:1596
BLK_PAD:1728 · BLK_PAD_NEW:1733 · BLK_TOP_FIX:1734 · seatPodChars:1735 · lbCoinHtml:1747 · lbBadgeHtml:1763
lbBossHtml:1789 · lbWordSearchHtml:1812 · lbTypingHtml:1848 · lbShootHtml:1882 · bindPlayerClicks:1917 · showPlayerCard:1927
petDescImg:2206 · openImgLightbox:2219 · openPetPeek:2239 · updateBillBadges:2283 · setBadge:2293 · tinvPendingCount:2309
updateSettingsBadge:2318 · openAttentionSummary:2333 · updateFriendBadge:2391 · renderFriendPanel:2401 · friendDoSearch:2449 · refreshFriendData:2473
FRW_TTL_MS:2538 · FRW_MIN_GAP:2539 · frwWorldOf:2543 · frwPanelOpen:2546 · frwScan:2551 · frwPaint:2573
frwPaintHint:2594 · frwFollow:2608 · CHAT_EMOJI_CATS:2629 · CHAT_THEMES:2651 · CHAT_SECRET_MS:2660 · chatBadgeSync:2668
ibTimeStr:2676 · IB_CALL_RE:2685 · ibCallInfo:2686 · openChatInbox:2691 · chatFitKeyboard:2861 · openChat:2877
giftImg:3068 · giftDateStr:3070 · GREETS:3078 · GREET_EXP:3086 · greetInfo:3087 · openGreetPicker:3091
giftItemPic:3135 · foodGiftBlocked:3145 · giftItemName:3151 · updateGiftBadge:3157 · renderGiftPanel:3166 · acceptGift:3224
declineGift:3247 · showGreetReveal:3256 · showGiftReveal:3283 · openGiftPicker:3309 · confirmSendGift:3377 · doSendGift:3403
rankBadgeHTML:3429 · renderRankCard:3434 · renderRankTab:3468 · showRankUp:3496 · bindPetPlateButtons:3531 · openPetInfoOverlay:3561
feedAgo:3584 · FEED_DECK_MAX:3604 · FEED_SLIDE_MS:3605 · FEED_RESUME_MS:3606 · feedPostImgIndex:3611 · feedPostImg:3622
feedPostByKey:3631 · feedCanReact:3634 · fpStatsHTML:3639 · fpNameBadgesHTML:3655 · fpostHTML:3659 · renderFeedCard:3694
feedDeckGo:3732 · feedDeckTick:3752 · renderFeedBell:3774 · feedNotifText:3782 · feedNotifGo:3794 · feedNotifArrived:3805
openFeedNotif:3812 · closeRxPicker:3854 · openRxPicker:3858 · feedFlyWord:3878 · feedPickRx:3889 · FCM_REP_SHOW:3904
FCM_FOCUS_POST:3905 · openFeedComments:3907 · closeFeedComments:3929 · fcmRowHTML:3938 · showCommentLikers:3961 · fcmTreeHTML:3983
renderFeedComments:4008 · bindFeedPostEvents:4131 · openFeedBoard:4183 · renderFeedBoardLive:4204 · renderFeedBoard:4222 · stageColLeft:4241
alignPetTabs:4250 · alignFeedPlate:4262 · alignProfilePlate:4278 · COIN_K_MIN:4296 · alignCoinBlock:4297 · alignStageLeft:4325
laneModeOn:4337 · alignStageCols:4350 · watchStageCols:4365 · alignCureBtn:4375 · dictRecordLookup:4399 · DICT_FILE_COUNT:4410
loadDict:4411 · dictSearch:4426 · dictTapWords:4441 · dictEntryHTML:4445 · openDictOverlay:4456 · renderDashboard:4540
sleepBtnHTML:5063 · sleepHintHTML:5070 · sleepAllPets:5081 · wakeAllPets:5094 · feedPet:5105 · openFoodMenu:5124
feedWith:5197 · AVATAR_UI:5227 · playerAvatarHTML:5231 · SHAPE_UI:5239 · showFeedResult:5248 · curePet:5289
heartsFx:5312 · PAT_HOLD_MS:5335 · PAT_EXP:5336 · bindPetTap:5337 · petBounce:5355 · petMood:5361
shortPatPet:5368 · longPatPet:5376 · patCalendarHTML:5396 · patStreakTick:5424 · cureCelebrateFx:5450 · railCureClick:5461
detoxPet:5473 · openFoodQuiz:5496 · closeDressUpBoard:5615 · openDressUpBoard:5619 · renderShop:5636 · homeVisualHTML:5699
showHomeRuined:5713 · showCutNotice:5734 · renderHomeCard:5752 · payMaint:5836 · trashBillUI:5852 · payTrash:5869
UTILITY_UI:5888 · utilityBillUI:5937 · payUtility:5962 · buyUtilityFix:5988 · renderPhoneCard:6006 · buyPhone:6046
sellPhone:6068 · compLiveTotal:6089 · onlineLiveTotal:6100 · syncCoinHeader:6107 · flashPillGain:6112 · renderOnlineEarnPill:6121
renderCompEarnPill:6146 · openPillInfo:6179 · renderComputerCard:6262 · buyComputer:6297 · sellComputer:6320 · soldCount:6341
soldBadge:6342 · loadScriptOnce:6348 · advBusyMsg:6373 · advResetLoad:6385 · loadAdv3d:6391 · enterAdventure3D:6399
pickAdvMap:6424 · enterHaunted3D:6459 · enterHeli3D:6481 · pickHeliMap:6507 · enterDrone3D:6543 · enterDrive3D:6562
pickDriveMap:6600 · enterMotoMapAsCar:6636 · enterSoccer3D:6655 · enterMoto3D:6674 · enterF1_3D:6696 · enterInvasion3D:6716
WORLD3D:6742 · gotoRobotShop:6754 · openHealDialog:6760 · world3DFail:6781 · railWorldClick:6812 · openWorldEntryDialog:6827
railScrollHint:6880 · railScrollTop:6888 · initRailScroll:6893 · renderRailWorlds:6913 · tinvNoticeHTML:6982 · openTinvPicker:6990
fruitCountdown:7034 · renderFarmCard:7046 · renderFarmClock:7121 · buyFruit:7137 · sellFruit:7157 · sellAllFruit:7178
collectImg:7207 · renderFactoryCard:7213 · renderMarketCard:7236 · updateWishBadge:7292 · openWishlistDialog:7303 · bindStripArrows:7348
renderMarketBrowse:7362 · carImg:7391 · renderVehicleShop:7392 · CS_CYCLE_MS:7443 · carInteriorImg:7444 · carStatHtml:7446
renderCarShowroom:7453 · csShowBig:7480 · csInit:7507 · RS_CYCLE_MS:7530 · robotImg:7531 · renderRobotShop:7532
rsShowBig:7554 · rsInit:7575 · buyRobot:7594 · enterMecha3D:7619 · pickMechaRobot:7646 · pickDriveCar:7678
openCarBuyDialog:7721 · buyCarInsurance:7782 · payCarLoanMonthly:7801 · payCarLoanFull:7813 · carDriveBlock:7832 · gotoVehicleShop:7837
gotoMyStock:7842 · showNeedCarDialog:7848 · craftDiscount:7860 · renderFactory:7863 · renderOrdersUI:7932 · startProduce:7951
buyCollectible:7979 · cancelProduce:8009 · deliverOrder:8023 · renderOrderClock:8040 · renderCollectMine:8050 · openListDialog:8092
cancelListing:8145 · buyMarketItem:8168 · showCollectReveal:8197 · buyAC:8235 · openHomeShop:8254 · renderPetShop:8313
showLevelUp:8374 · renderStats:8411 · showTeacherCard:8518 · CALL_REACT_EMOS:8562 · CALL_TALK_MIN:8565 · CALL_TALK_HOLD:8566
CALL_ORDER_GAP:8568 · CALL_TONES:8574 · startCall:8948

## js/util.js (1,180 บรรทัด · 47 รายการ)
shuffle:6 · fmtNum:15 · escapeHTML:19 · gradeSymbol:32 · gradeMark:47 · nameWithGrade:55
gradeMarkCanvas:61 · gradeOf:77 · seededRand:92 · fmtThaiDT:102 · fmtThaiDate:106 · showScreen:111
TOAST_WARN_RE:121 · restackToasts:124 · clearWarnToasts:150 · toast:154 · toastLink:181 · floatFx:199
beep:210 · soundStatus:231 · PET_MOOD:344 · petVoiceSynth:351 · sirenSynth:428 · playCashier:452
cashierSynth:466 · keyTapSynth:499 · playSpark:540 · sparkSynth:554 · thunderFx:589 · wordAudioFile:657
speakCutOff:666 · speakWord:670 · speakLetter:694 · pickSpeakVoice:717 · speakWordTTS:728 · askNameDialog:748
askConfirm:793 · alertBox:811 · applyNoAnim:831 · BLK_VOCAB:838 · openSettings:886 · openHelp:1089
openTeacherGuide:1115 · TAPGLOW_SEL:1139 · TOUCH_INPUT_SEEN:1158 · mouseLockOK:1167 · lockMouse3D:1173

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

## css/lobby.css (5,203 บรรทัด · 763 selector)
:root:6,5158 · html:15 · body:16,5122,5164 · *:36,37,38,39 · #app:42 · h1:44
.subtitle:45 · .shop-title:46 · #rotate-overlay:49 · .screen:71 · #screen-select:80,81,82,83(+5) · .egg-need:90
.petshop-topright:92 · .petshop-play-link:93,98 · #screen-login:112,137,138,143(+7) · .login-lux:122 · .login-crest:123 · .login-word:127
.login-rule:133,134,135 · .login-tag:136 · #screen-game:185,186,187,188(+7) · #screen-quiz:199,200,201,202(+6) · #quiz-choices:211,212 · .word-card:219
.quiz-choice:220,221,222 · .big-btn:225,226,227,228 · #screen-dashboard:233,1133,1141 · .lobby-top:240,875,876,877(+36) · .top-flex:241 · .profile-plate:242,246,796,3676(+12)
#rain-fx:251 · .rain-glass:255 · .glass-drop:256 · .rain-vignette:275 · .no-anim:282,444,457,518(+58) · .rail-btn:285,891,897,899(+19)
.rail-badge:286 · .fr-code-box:291 · .fr-code-label:295 · .fr-code-row:296 · .fr-code:297 · .fr-copy-btn:302,306,311,312
.fr-search-btn:307 · .fr-add-btn:308 · .fr-accept:309 · .fr-decline:310 · #fr-search-input:313 · #fr-search-result:317
.fr-found:318 · .fr-hint:322 · .fr-list-title:323 · .fr-row:324 · .fr-req:328 · .fr-row-name:330,334,4862
.fr-row-status:338 · .fr-req-btns:339 · .online-dot:340 · .fr-chat-btn:341,346,348 · .fr-unread:349 · .fr-call-btn:355,361
.chat-overlay:370,376,377 · .chat-box:378,681,688,695(+12) · .chat-head:390 · .chat-theme-btn:395,399 · .chat-secret-tg:400,401 · .cs-switch:402,403,408,409
.cs-slider:404,406 · .chat-secret-note:410 · .chat-theme-strip:413 · .chat-theme-sw:415,418,419,420(+1) · .chat-head-name:422,425 · .chat-head-ava:424
.chat-close:426 · .chat-msgs:430 · .chat-empty:434 · .chat-typing:436 · .ct-dots:438,439,441,442 · .chat-bubble:445,450,455
.chat-emoji:458 · .chat-emo:462,466 · .chat-input-row:467 · .chat-emoji-btn:471 · #chat-input:475 · .chat-send:479,484,485
.chat-call-btn:491,495 · .call-ring:498 · .cr-card:502 · .cr-kind:508 · .cr-av:509 · .cr-name:519
.cr-id:520 · .cr-btns:521 · .cr-btn:522,528,533 · .cr-no:529 · .cr-ok:530 · .cr-safe:534
.call-ov:537,543,565,582(+6) · .call-stage:549 · .ctile:550,561,562 · .ct-face:554 · .ct-me:560 · .ct-nm:575,579
.ct-sub:580 · .call-add:604 · .ca-head:611 · .ca-list:612 · .ca-row:613,617 · .ca-dot:618,619
.ca-nm:620,621 · .ca-go:622 · .ca-empty:623 · .ca-safe:624 · .ca-close:625 · .call-bar:629
.cb-btn:634,639,640 · .cb-end:641,642 · .call-emos:643 · .call-emo:648,649 · .call-fx:651 · .call-fx-emo:652
.pl-click:744,746,747 · .pl-overlay:748 · .pl-card:752,2796 · .pl-close:758 · .pl-head:762,2564,2567 · .pl-grade:767,4868,4869
.pl-body:768 · .pl-loading:769 · .pl-none:770 · .pl-me-tag:771 · .pl-blk-wrap:773 · .pl-blk:774
.pl-stat:775 · .pl-lbl:780 · .pl-val:781,782 · .pl-tip:783 · .chip-edit:789,794,795 · .rank-mini:801,807,808,809
.pass-photo:811,816 · .pet-tabs:818 · .dict-box:819,823,824,825(+1) · .dict-card:831,836,840,841(+2) · .dict-head:837,838 · .dict-trail:845,849
.dt-c:850,854,855 · .dt-sep:856 · .dict-today:857 · .di-w:859,860,861 · .dict-list:862 · .dict-item:863,867,868,869(+5)
.lobby-mid:883 · .rail-wrap:886,930,941,942 · .rail-scroll:889,924,928,929 · .lobby-rail:890 · .rail-pinned:904,905 · .rail-nudge:931,939,940,943(+1)
.rail-worlds:950 · .rail-div:951 · .lobby-stage:993,995,1011,1138(+13) · .newword-banner:1001,1008,1013,4228(+2) · .coin-fly:1024,1027 · .coin-plus:1033
.nw-pop-coin:1048,1050,1051 · .nw-pop-goal:1054,1055,1059,1063 · .nw-goal-head:1056,1058,1060 · .nw-goal-bar:1061 · .nw-goal-fill:1062 · .nw-pop-book:1064,1065
.nw-tag:1086,4234,4256 · .nw-word:1091,4238,4261,4354 · .nw-hint:1093,1094,4239,4263(+1) · .nw-coin:1096,1099,4240,4244 · .nw-countdown:1104,4245 · .nw-bar:1106,4264
.nw-bar-fill:1108 · .pet-stage:1111,3090 · .nw-box:1118,3099 · .nw-pop-word:1119 · .nw-speak:1120 · .nw-pop-phon:1121
.nw-ipa:1122 · .nw-pop-sent:1123 · .nw-pop-mean:1124 · .pet-tab:1125,1126,1127,3482 · .stage-hero:1148,1163,1171,1316(+22) · .hero-ground:1185,1305,1311
.hero-rank-bg:1187,1190,1193,1197(+18) · #lobby3d-canvas:1210,1211 · .hero-scene:1215,1217,1224,1225(+8) · .caretaker-fig:1264 · .caretaker-img:1267 · .caretaker-emoji:1269
.blk-rig:1276,1277,1278 · .stage-plate:1338,1346,1357,1358(+23) · .plate-title:1352 · .lobby-side:1385,1421,1426,1429(+22) · .side-sec:1388,2222,3378,3654 · .side-label:1389,1394
.side-label-row:1397,1398 · .lb-tabs-out:1399,1400,1404 · .side-glass:1408,1415 · .side-card:1427,1538 · #quest-card:1439,1440,1468,1469(+6) · .q-bigcard:1445,1474
.qb-top:1447 · .qb-emoji:1448 · .qb-name:1450 · .qb-bar:1451,1452 · .qb-row:1454 · .qb-prog:1455
.qb-reward:1456 · .qb-go:1457,1461 · .q-dots:1462 · .q-dot:1463,1464,1465 · .q-bonus:1466 · .inv-card:1485,1487,1488
.inv-btns:1489 · .inv-go:1490,1492 · .inv-x:1493 · #online-card:1497,3386,3387,3388(+4) · .fq-overlay:1498 · .fq-box:1500,3192
.fq-head:1504,1506 · .fq-close:1507 · .fq-sec:1509 · .fq-worlds:1510 · .fq-world:1511,1513 · .fq-acts:1514
.fq-act:1515,1518,1519 · .lb-prize:1552 · .lb-coins:1555 · .lbf-cell:1556,2643,2646,2647(+3) · .lb-award-bar:1558,1564,1565 · .lb-award-go:1566
.lbf-award:1568,1574,1575,1576 · .pod-pz:1577 · .wsa-overlay:1580 · .wsa-box:1582 · .wsa-head:1587 · .wsa-title:1588
.wsa-when:1589,1590 · .wsa-close:1591,1594 · .wsa-cols:1595 · .wsa-col:1596 · .wsa-sec-h:1597,1598 · .wsa-msg:1599
.wsa-msg-h:1602 · .wsa-msg-b:1603,1604 · .wsa-msg-none:1605 · .wsa-rules:1607,1608 · .wsa-list:1609 · .wsa-row:1610,1612
.wsa-r:1613 · .wsa-n:1614 · .wsa-s:1615 · .wsa-p:1616 · .wsa-prizes:1617 · .wsa-pz:1618,1621
.wsa-reveal-medal:1622 · .lobby-bottom:1637,1640,1641,1643(+7) · .lobby-quiz-btn:1654 · .lobby-book-btn:1655,1656 · .lobby-play-btn:1658,1662 · .lobby-exam-btn:1664,1665,1667
.panel-overlay:1672,1677,4369,4370(+8) · .panel-box:1678 · .panel-head:1685,1689 · .panel-close:1690,1695 · .panel-body:1696,1700,1701 · .panel-page:1698,1699
.collect-sub:1705 · .mkt-empty:1706 · .craft-box:1707 · .mkt-listing:1708 · .mkt-filter:1709,2053 · .hq-grid:1716
.hq-card:1717,1722,1746 · .hq-head:1723 · .hq-pic:1729,1731 · .hq-emoji:1733 · .hq-badge:1734 · .hq-stars:1738
.hq-price:1739,1744,1745,1748(+6) · .craft-credit:1752,1754,1755 · .car-grid:1762,1764,1765 · .robot-weap:1766 · .dmap-box:1769,1770 · .dmap-grid:1776
.dmap-card:1778,1781,1782,1783(+2) · .dmap-ico:1785 · .dmap-new:1788 · .dcp-grid:1790 · .dcp-card:1792,1795,1796,1797(+10) · .levelup-box:1814,3053,3054,3189
.dcp-box:1817,1818,1822,1823(+6) · .dcp-lock:1831 · .sold-badge:1835,1837,1838 · .rs-showroom:1840,4820,4821 · .rs-list:1841,1843,4801,4804 · .rs-thumb:1844,1846,1847,1848(+1)
.rs-thumb-pic:1849,1850 · .rs-thumb-price:1851 · .rs-stage:1853 · .rs-big:1856 · .rs-big-img:1857 · .rs-elec:1861,1865,1870
.rs-edge:1871,1877 · .rs-info:1880,1881,1882,1883(+1) · .rs-buy:1885,1887,1888 · .cs-showroom:1892,4793,4794,4822(+3) · .cs-list:1893,1895,4795,4800(+9) · .cs-thumb:1896,1898,1899,1900(+1)
.cs-thumb-pic:1901,1902 · .cs-thumb-name:1903 · .cs-thumb-price:1904 · .cs-thumb-own:1905 · .cs-stage:1907 · .cs-big:1910
.cs-big-img:1911 · .cs-elec:1915,1919,1923 · .cs-edge:1924,1930 · .cs-interior:1933 · .cs-inr-label:1934,1935 · .cs-inr-img:1936
.cs-info:1938,1939,1940,1941(+6) · .cs-buy:1949,1951,1952,1953 · .car-emoji:1955 · .car-mine:1961 · .car-mine-pic:1966 · .car-mine-info:1967
.car-loan:1968,1969 · .car-mine-btns:1970,1971,1972 · .car-locked:1974 · .car-mine-head:1976 · .car-pick-list:1977,1978 · .car-pick:1979,1981,1982
.car-pick-pic:1983,1984 · .car-pick-name:1985,1986 · .car-pick-od:1987 · .car-buy-box:1989,3196 · .cb-pic:1990,1991,1992 · .cb-lines:1993
.cb-li:1994,1998,1999 · .cb-ins:2000,2004,2005 · .cb-plan:2006 · .cb-pl:2007,2012,2014,2018(+1) · .cb-total:2025 · .cb-btns:2026,2031
.cb-x:2027 · .shop-grid:2034 · .shop-item:2035,2040,2045,2046(+3) · .mkt-tab:2054,2055 · .pg-btn:2056,2057,2058 · .pg-dot:2059
.fr-gift-btn:2082,2087 · .gift-sec-title:2090 · .gift-in-row:2092 · .gift-out-row:2096 · .gift-in-pic:2097,2099,2100 · .gift-in-info:2101,2102
.gift-in-btns:2103 · .gift-accept:2104,2108,2110 · .gift-decline:2109 · .gift-box-card:2111 · .gift-box-from:2112,2113 · .gift-note:2114
.gift-pick-overlay:2117 · .gift-pick-box:2121 · .gift-pick-head:2127,2131 · .gift-pick-close:2132 · .gift-pick-tabs:2134 · .gp-tab:2135,2139
.gift-pick-body:2140 · .gp-chips:2141 · .gp-chip:2142,2146 · .gp-card:2147,2148 · .gp-price:2149 · .gp-note:2150
.gift-cf-pic:2151 · .chat-emoji-cats:2156 · .chat-emoji-cat:2160,2164,2165 · .chat-emoji-wrap:2166,2167 · .stage-left:2176,4360 · .pet-info-btn:2180,2187,2188
.feed-list:2195,2199,2224,2225(+1) · .feed-empty:2200,2203 · .fd-tools:2209 · .feed-bell:2210,2212,2213,2214 · .fd-prog:2218,2219 · .fpost:2226,2935
.fp-head:2231 · .fp-who:2232 · .fp-name-line:2235 · .fp-name:2236 · .fp-when:2237 · .fp-badges:2239,2242
.fp-badge-ic:2240 · .fp-text:2244 · .fp-media:2247 · .fp-img:2249 · .fp-cap:2251 · .fp-big:2252
.fp-sum:2254,2256 · .fp-sum-rx:2257 · .fp-sum-none:2258 · .fp-en:2259 · .fp-bar:2261 · .fp-act:2262,2266,2268
.fp-like:2267 · .fp-page:2279,2280,2281,2282(+3) · .fp-rxbox:2285 · .fp-rxb:2289,2291,2292,2293(+1) · .fp-rxb-off:2295 · .fp-fly:2297,2300,2301
.fcm-overlay:2304 · .fcm-box:2306 · .fcm-post:2310,2311 · .fcm-rxs:2312 · .fcm-rx:2313 · .fcm-list:2314,2316
.fcm-row:2317,2318,2319 · .fcm-none:2320 · .fcm-item:2322 · .fcm-reps:2323 · .fcm-rep:2325 · .fcm-more:2327,2329
.fcm-arrow:2330 · .fcm-reply:2331,2333 · .fcm-like:2335,2338,2339,2340 · .fcm-likeic:2341 · .fcm-cnt:2343,2345 · .fcm-likers-box:2346
.fcm-likers-list:2347,2349 · .fcm-liker-row:2350 · .fcm-liker-none:2351 · .fcm-repbar:2352,2355 · .fcm-repx:2356 · .fcm-note:2358
.fcm-quick:2360,2362 · .fcm-q:2363,2366,2367 · .fcm-add:2368 · .fcm-input:2369,2371 · .fcm-send:2372,2374 · .fcm-locked:2375
.fnt-overlay:2377 · .fnt-box:2379 · .fnt-list:2383,2385 · .fnt-row:2386,2388 · .fnt-ico:2389 · .fnt-tx:2390,2391
.fnt-sub:2392 · .fnt-hint:2394 · .fnt-go:2395,2398,2399,2400 · .fcm-hl:2402 · .feed-plate:2410 · .feed-all-btn:2411,2416
.fdb-overlay:2421 · .fdb-box:2423 · .fdb-head:2427 · .fdb-close:2431,2433 · .fdb-live:2434 · .fdb-live-title:2435
.fdb-live-rows:2437,2439,2440 · .fdb-live-row:2441,2443,2444,2445 · .fdb-dot:2446 · .fdb-list:2448,2449 · .fdb-empty:2450 · .fdb-row:2451
.fdb-row-top:2453 · .fdb-ico:2454 · .fdb-txt:2455 · .fdb-name:2456 · .fdb-ago:2457 · .fdb-actions:2458
.fdb-like:2459,2462,2463,2464 · .fdb-cm-list:2465 · .fdb-cm-row:2466,2468 · .fdb-cm-empty:2469 · .fdb-cm-add:2470 · .fdb-cm-input:2471,2473
.fdb-cm-send:2474,2476 · .fdb-cm-locked:2477 · .pi-overlay:2480 · .pi-box:2484,2489,2490,2494(+3) · .pi-close:2496,2501,2502 · .pi-close-left:2504
.pi-portrait:2506 · .pet-wear:2513,2516,2518 · .pi-portrait-wrap:2521,2523 · .pi-dress-btn:2531,2535,2536 · .pi-shape-cap:2537,2540,2541,2542 · .pi-shape-toggle-btn:2544,2547
.pi-dress-pip:2549,2554,2555,2556(+1) · .pi-wear-note:2559,2561 · .greet-card:2568 · .greet-sub:2569 · .greet-grid:2570 · .greet-opt:2571,2574,2575,2576
.greet-e:2577 · .pi-streak:2581 · .pi-streak-head:2583,2585 · .pi-streak-best:2586 · .pi-dots:2587 · .pi-dot:2589,2590,2591
.pi-streak-note:2592 · .pi-care-title:2593 · .lbf-overlay:2606 · .lbf-box:2609,2623,2624,2625(+10) · .lbf-head:2614 · .lbf-title:2615
.lbf-tabs:2616,2619 · .lbf-note:2622 · .lbf-close:2638 · .lbf-close-l:2639 · .lbf-body:2640 · .lbf-grid:2641
.lbf-box-bcat:2660 · .lbf-bcat-wrap:2661 · .lbf-bcat:2663,2722,2723,2724(+3) · .lbf-bcat-head:2665,2666,2667 · .lbf-bcat-mid:2674 · .lbf-bcat-badge:2675,2734
.lbcat-ic:2685 · .badge-shine-img:2691 · .badge-shine:2709,2710 · .lbcat-ic-label:2736 · .lbf-bcat-rows:2738 · .lbf-one-row:2742,2743,2744
.lbf-bcat-row:2745,2747,2748,2750 · .lbf-podium:2762 · .pod:2764,2791,2792 · .pod-char:2766 · .pod-base:2768 · .pod-rank:2770
.pod-label:2772,4864 · .pod-name:2774 · .pod-sc:2776 · .pod-1:2781,2782 · .pod-2:2783,2784 · .pod-3:2785,2786
.pod-4:2787,2788 · .pod-5:2789,2790 · .pl-wide:2809,2812,2813,2814(+8) · .pl-follow:2815,2820,2822 · .pl-unfollow:2824,2830,2831 · .pl-followers:2832
.pl-cols:2833,2838,2839,2840 · .pl-col:2834 · .pl-sec-title:2835 · .pl-badges-col:2841 · .pl-feed:2842,2845,2852 · .pl-feed-row:2846,2850,2851
.pl-assets-wrap:2854,4701,4776 · .pl-assets:2855,4704,4709,4715(+4) · .pl-asset:2858,2862,2869 · .pl-asset-emoji:2863 · .pl-asset-n:2864 · .pl-pets-wrap:2871
.pl-pets:2872 · .pl-pet:2873,2878,2880 · .pl-pet-nm:2881 · .img-lightbox:2884,2889,2890,2894(+3) · .cert-svg:2913 · .cert-tap:2914,2919
.cert-chip-sm:2922 · .pl-sec-sub:2942 · .pl-certs:2943,2945 · .cert-mini:2946,2950,2952 · .cert-mini-cap:2953 · .cert-none:2955
.lv-cert-row:2957,2959 · .lv-cert-btn:2960,2965 · .cert-lightbox:2967,2972,2973,2977(+3) · .pl-chat:2997,3002 · .pl-call:3004,3010 · .pet-peek:3011,3012
.pp-chips:3014 · .pp-chip:3015 · .pp-gift:3020,3026 · .settings-box:3028,3029,3102,3113(+30) · .set-feed-head:3030 · .set-feed-sub:3034
.set-feed-row:3035 · .pillinfo-val:3040 · .pillinfo-desc:3045,3064 · .pillinfo-box:3056 · .plf-head:3059 · .plf-emoji:3060
.plf-ht:3061,3062,3063 · .plf-foot:3065,3067,3068 · .alert-box:3073,3075 · .ab-emoji:3076 · .ab-title:3077 · .ab-desc:3078
.ab-btns:3079,3080,3081 · .heal-heart:3083 · .attn-box:3098 · .set-tabs:3123,3125 · .set-panels:3126 · .set-panel:3127,3128
.help-box:3170,3171,3172 · .wl-box:3190 · .food-box:3191 · .home-shop-box:3193 · .summary-box:3194 · .report-box:3195
.wl-grid:3198 · .tc-wrap:3200 · .spell-btn:3206,3211 · .sp-hud:3212 · .sp-word:3214 · .sp-ch:3215,3220
.sp-th:3222 · .sp-hint:3224 · .sp-exit:3227,3231 · .sp-banner:3232 · .sp-big:3237 · .sp-thb:3239
.sp-coin:3240 · #spell-confetti:3245 · .sp-rb:3246 · .sp-day:3256 · .sp-perfect:3258 · .sp-late:3260
#spell-coinpop:3263 · .side-sub:3372,3374 · .sec-quest:3379 · .on-page:3390,3391,3392,3393 · .inbox-overlay:3403 · .ib-box:3405
.ib-head:3409 · .ib-close:3413,3415 · .ib-list:3416,3417 · .ib-row:3418,3419,3420,3421 · .ib-ava:3422,3427,3428 · .ib-on:3429
.ib-mid:3431 · .ib-name:3432 · .ib-last:3433 · .ib-meta:3434 · .ib-time:3435 · .ib-dot:3437
.ib-story-badge:3440 · .ib-empty:3444 · .ib-story:3446,3448 · .ib-story-item:3449,3451,3458 · .ib-story-ava:3452 · .ib-story-on:3456
.ib-world:3461,3464 · .ib-tabs:3466 · .ib-tab:3467,3470,3472 · .ib-tab-dot:3473 · .ib-call-ava:3477 · .ib-call-row:3478,3479
#btn-music:3485,3488,3489 · #ws-overlay:3504 · #ws-board:3507,3513,3515 · .ws-head:3518 · .ws-title:3519 · .ws-findbar:3522
.ws-tip:3523 · .ws-grade:3525,3526 · .ws-body:3529 · .ws-gridwrap:3530 · #ws-grid:3533 · .ws-cell:3538,3543,3546,3549(+2)
.ws-flash:3555,3557 · .ws-coinpop:3561,3585 · .ws-combo:3572,3576,3577,3578 · .ws-find:3589 · #ws-prog:3590 · #ws-words:3594,3598
.ws-word:3600,3605,3606,3607(+2) · .ws-actions:3613,3614,3623 · .ws-sizes:3618 · .ws-sizes-lb:3620 · .ws-size-now:3621 · #ws-new:3624
#ws-stash:3625 · #ws-clear:3626 · #ws-win:3627,3629 · .ws-win-in:3630,3633 · .sec-online:3656 · .rank-tab:3684,3685,3686,3687(+2)
.pet-show-bg:3717,3720,3724,3728(+19) · .ps-night-fx:3820,3822,3834,3839(+1) · .pet-show:3849,3852,3864,3866(+22) · .ps-video:3985 · .ps-worn-pip:4063,4064 · .id-card:4087,4094,4098
.id-chip:4111 · .clock-chip:4120,4121 · .coin-block:4137 · .coin-group:4138 · .coin-pill:4168,4169,4190 · .cp-lb:4193
.cp-v:4194 · .nw-sub:4262 · .top-flex2:4357 · #panel-factory:4376,4377,4381,4382(+39) · #panel-rank:4517,4518,4524,4529(+11) · .grid2x8:4600,4606
.grid1x5:4616,4622 · .pl-badges-strip:4628 · .pl-badge-card:4632,4638,4656,4657(+1) · .pl-badge-card-ic:4644,4653,4655 · .pl-badge-card-nm:4659 · .pl-badges-empty:4665,4667
.mine-strip:4681,4683,4684,4689(+4) · .mb-strip:4695,4734 · .gmark:4842,4846,4847,4848(+1) · .gm-stack:4851,4855 · .gm-row:4857 · .lb-name:4859,4860,4861
.grade-edit:4882,4887,4888 · .gradelock-box:4892,4908,4913,4915 · .gl-head:4893 · .gl-emoji:4894 · .gl-ht:4895 · .gl-cur:4896
.gl-lock:4897,4902 · .gl-ok:4901 · .gl-lock-sub:4903 · .gl-why:4904 · .gl-pick-lb:4905 · .gl-opts:4906
.gl-hist:4916 · .gl-hline:4917 · .gl-hg:4921 · .gl-hat:4922 · .gl-harr:4923 · .gl-foot:4924
.gl-cf:4925 · .reg-gradelock:4947 · #tp-overlay:4957 · #tp-board:4959,4963 · .tp-head:4967 · .tp-title:4968
.tp-stat:4970,4972 · .tp-pts:4974,4977 · .tp-close:4979,4985,4986 · .tp-snd:4989,4992,4998,4999 · .tp-snd-ic:4993 · .tp-snd-track:4994
.tp-snd-thumb:4996 · .tp-prompt:5003 · .tp-word:5005,5019,5020 · .tp-ch:5007,5012,5013,5015 · .tp-thai:5023 · .tp-hint:5025
.tp-empty:5027 · .tp-keys:5030 · .tp-row:5032 · .tp-row-fn:5034,5067 · .tp-key:5038,5050,5052,5058(+2) · .tp-key-fn:5065
.tp-fx:5071 · .tp-coinpop:5072 · .tp-pop-pt:5077 · #city-backdrop:5091,5097 · .city-arrive:5098,5099 · .night:5113,5133,5134,5136(+2)
#night-veil:5159

## css/style.css (2,174 บรรทัด · 549 selector)
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
.pet-wrap:639 · .pet-emoji:640 · .pet-img:641 · .egg-img:642 · .feed-pet:643,802 · .pet-baby:644
.pet-adult:645 · .pet-egg-stage:647 · .wear:649 · .wear-head:650 · .wear-face:651 · .wear-neck:652
.pet-name:654 · .stage-label:655 · .level-row:656 · .level-badge:657 · .exp-bar:661 · .exp-fill:662
.exp-text:663 · .ability-box:665,669 · .hunger-bar:672 · .hunger-fill:673,674,675 · .food-item:681,736,740,741(+6) · .hunger-text:685
.heat-bar:688 · .heat-fill:689 · .heat-text:690,691,692 · .care-row:694 · .care-btn:695,699,705 · .btn-feed:700
.btn-cure:701 · .btn-foodquiz:703 · .care-row-quiz:704 · .sick-banner:706 · .pet-sick:710 · .food-lock-note:713
.pet-asleep:723 · .sleep-badge:724 · .btn-sleep:726 · .dinner-btn:729 · .food-box:733,734 · .food-grid:735
.fav-tag:755 · .fd-exp:759 · .food-sec:761 · .food-sec-human:765 · .bad-tag:767 · .fd-toxin:771
.fd-safe:772 · .fq-box:775,776 · .fq-progress:777 · .fq-pair:778,779 · .fq-ask:780 · .fq-why:781
.fq-btns:785,786,790 · .fq-yes:791 · .fq-no:792 · .fq-next:793 · .food-cancel:794 · .feed-box:800,801
.feed-gain:803 · .sick-badge:807 · .big-btn:813,819,1055,1056(+6) · .shop-card:822 · .shop-title:826 · .shop-grid:827
.shop-item:828,832,833,834(+4) · .it-tag:839 · .tag-wear:840 · .lock-banner:842 · .home-current:848,853,854 · .home-img:855
.home-emoji:856 · .home-btn:857,879 · .home-layout:859 · .home-pic-col:860,866 · .home-img-big:864 · .home-info-col:867,869,872,873
.home-name-row:870 · .home-desc-row:871 · .home-shop-box:881,882 · .home-list:883 · .home-option:884,888,889,890(+1) · .home-opt-img:891
.home-opt-body:893,894 · .home-price:895 · .reset-link:900 · .login-card:906 · .login-pets:907 · .login-status:908
.google-btn:909,915,916 · .login-note:917 · .install-btn:920,926,927 · .install-guide-overlay:930 · .install-guide:934,938,941 · .install-steps:939,940
.install-guide-close:942 · .login-account:947 · .register-card:950,954,972,976 · .reg-safety:956,958,959 · .reg-privacy:961,963,964 · #screen-register:966,967,968,969(+2)
.student-chip:977 · .clock-chip:981 · .online-count:987 · .online-row:994,998,999,1018 · .online-dot:1003 · .online-name:1008
.online-act:1012 · .online-ava:1017 · .online-live:1019 · .online-note:1023 · .lb-empty:1026 · .lb-list:1027
.lb-row:1028,1032,1033 · .lb-rank:1037 · .lb-name:1039,1043 · .lb-coins:1047 · .lb-hint:1049 · .lb-badgeline:1050
.lb-tabs:1052 · .lb-tab:1053,1054 · .tinv-note:1065 · .cat-card:1071,1116,1119,1267(+1) · .cat-head:1075 · .cat-emoji:1076
.cat-name:1077 · .cat-pass:1078 · .cat-info:1079 · .cat-btns:1080 · .cat-btn:1081,1085,1086,1087(+3) · .cats-back-bottom:1090
.tapglow:1095,1096,1104 · .lobby-bottom:1103 · .band-sec-head:1114,1115 · .bax-box:1123,1125 · .bax-head:1126 · .bax-sub:1127,1128
.bax-row:1129 · .bax-lv:1130,1133,1134,1135(+3) · .bax-emoji:1136 · .bax-name:1137 · .bax-q:1138 · .bax-need:1140
.bax-rw:1141 · .bax-foot:1145 · .bax-rank:1146,1149 · .bxr-box:1152,1154 · .bxr-head:1155 · .bxr-sub:1156
.bxr-body:1157 · .bxr-pick:1158 · .bxr-cats:1159 · .bxr-chip:1160,1162,1163,1164(+1) · .bxr-list:1167 · .bxr-row:1168,1170,1172,1176
.bxr-rk:1171 · .bxr-nm:1173,1174 · .bxr-sc:1175 · .bxr-tm:1177 · .bxr-more:1178 · .bxr-none:1179
.bxr-foot:1181 · .band-mine-tag:1182 · .bsp-box:1185,1188 · .bsp-head:1189 · .bsp-prog:1190 · .bsp-retake:1192,1195
.bsp-info:1197,1199 · .rts-box:1202 · .rts-head:1204 · .rts-sets:1205 · .rts-set:1206,1207,1208 · .rts-sub:1209
.rts-words:1210 · .rts-word:1211,1213,1214 · .rts-foot:1215 · .rts-okbtn:1216,1218 · .bsp-grid:1219 · .bsp-chip:1220,1223,1224,1225(+1)
.bsp-num:1227 · .bsp-best:1228 · .bsp-tick:1229 · .bsp-foot:1230 · .vb-box:1233,1235 · .xsp-box:1238
.vb-head:1239 · .vb-total:1240 · .vb-quizbtn:1241,1243 · .vb-tabs:1244 · .vb-tab:1245,1247,1248 · .vb-words:1249
.vb-word:1250,1253,1254,1255(+3) · .vb-empty:1259 · .vb-foot:1260 · .vb-pg:1261,1263 · #vb-pginfo:1264 · .vb-hint:1265
.band-lock:1273 · .offline-btn:1274,1275 · .quiz-progress:1280 · .quiz-phon:1281 · #quiz-extra:1282,1284,1285,1286 · .quiz-word-card:1287
.quiz-next:1293,1299,1300,1301(+1) · .quiz-choice:1304,1309,1310,1311 · .quiz-score-pill:1312 · .quiz-time-pill:1314,1316 · .stats-card:1319 · .stats-title:1323,1847
.stats-row:1324,1325,1326,1327 · .stat-badge-line:1329,1332 · .stat-badge-ic:1330 · .game-top:1335 · .back-btn:1336 · .combo-pill:1340
.timer-wrap:1344 · .timer-fill:1345,1346 · .board-label:1348 · .card-grid:1349 · .word-card:1350,1356,1357,1358(+3) · .hint-btn:1364,1369
.game-endless-note:1372,1377,1379,1383(+6) · .report-btn:1404,1409 · .report-box:1412 · .report-close:1413 · .rp-head:1417 · .rp-avatar:1418,1419
.rp-title:1420 · .rp-sub:1421 · .rp-levelcard:1423 · .rp-level-top:1427 · .rp-bar:1428 · .rp-bar-fill:1429
.rp-level-note:1430,1431 · .rp-grid:1433 · .rp-stat:1434 · .rp-ic:1437 · .rp-num:1438 · .rp-lbl:1439
.rp-section:1441 · .rp-h3:1442 · .rp-badge-mini:1443 · .rp-row:1444,1445,1446 · .rp-empty:1447 · .rp-badges:1448
.rp-badge:1449 · .rp-tline:1452 · .rp-tl-head:1453,1454 · .rp-tl-ems:1455 · .rp-em:1456,1457 · .rp-tl-note:1458,1459
.rp-crown:1461,1462 · .rp-wtitle:1464 · .rp-wnow:1465,1466 · .rp-wgraph:1467 · .rp-wcol:1468 · .rp-wval:1469
.rp-wbar:1470,1471 · .rp-wlbl:1472 · .rp-cheer:1474 · .report-ok:1478 · .summary-box:1481,1572,1576,1577(+2) · .sm-burst:1482
.sm-title:1484 · .sm-line:1485 · .sm-coin:1486 · .sm-matches:1492,1493 · .confetti:1495 · .sm-badge:1502
.sm-badge-all:1506 · .badge-celebrate-overlay:1509,1562 · .badge-celebrate:1515 · .bc-emoji:1521,1559 · .bc-emoji-img:1530 · .badge-clickable:1543,1544,1545
.badge-info-box:1549 · .bi-emoji:1550 · .bi-emoji-img:1551 · .bi-title:1552 · .bi-desc:1553 · .bi-ok:1554
.bc-title:1560 · .bc-sub:1561 · .sm-cheer:1566 · .sm-streak:1567,1568 · .sm-sick:1569 · .sm-btns:1570
.float-fx:1582 · .toast:1589 · .toast-warn:1596,1603,1604,1610 · .toast-link:1612,1619,1620,1625(+4) · .toast-clear-all:1636,1643 · .alert-box:1645
.alert-ok:1646,1651 · .settings-box:1653 · .set-row:1654 · .set-hint:1658 · .set-hint-on:1659 · .set-hint-off:1660
.set-lwrap:1661 · .set-label:1662 · .set-desc:1663 · .set-switch:1664,1668,1669,1674(+4) · .set-sw-knob:1670 · .set-sw-txt:1677
.set-night-row:1686 · .set-seg:1687,1689,1695,1696(+1) · .set-close:1698,1703 · .set-help:1704,1709 · .help-box:1711,1712,1717 · .help-item:1713
.update-banner:1725,1734,1735 · #update-reload:1736 · #update-dismiss:1740 · .levelup-overlay:1746,1752,1753 · .levelup-box:1754,1761,1762,1763(+4) · .bill-box:1769,1773,1774
.tag-off:1775 · .home-decayed-img:1776 · .home-dark-img:1777 · .thirst-fill:1778 · .thirst-text:1779,1780 · .toxin-fill:1783
.toxin-text:1784,1785 · .detox-btn:1786,1791 · .shape-text:1794,1795,1796,1797(+1) · .avatar-pick:1801 · .avatar-opt:1802,1806,1807,1808 · .avatar-chip-img:1812
.mini-av:1814 · .fp-ava:1815 · .avatar-chip-blk:1817 · .set-avatar-btns:1818 · .avatar-mini:1819,1823 · .set-blk-row:1825
.set-sub2:1826 · .blk-grid:1828 · .blk-mini:1829,1832,1833,1834 · .game-avatar:1837,1838,1839 · .stats-nick:1848 · .ticket-owned:1851,1855
.collect-sub:1860 · .mkt-tabs:1861 · .mkt-tab:1862,1866 · .mkt-filter:1867 · .mkt-row:1871 · .mkt-emoji:1875,1876
.mkt-info:1877,1878 · .mkt-tier-stars:1879 · .mkt-buy:1880,1885,1886 · .mkt-price-lo:1887 · .mkt-price-hi:1888 · .mkt-empty:1889
.collect-grid:1892 · .collect-cell:1893 · .cc-emoji:1894,1895 · .cc-name:1896 · .cc-count:1897 · .cc-list-btn:1898,1902
.mkt-listhead:1903 · .mkt-group-head:1905,1911 · .mkt-two-col:1913,1914,1918,1930(+8) · #phone-card:1919,1935 · #computer-card:1920,1936 · #ticket-card:1922
#haunt-card:1923 · #heli-card:1924 · #drone-card:1925 · #drive-card:1926 · #soccer-card:1927 · #moto-card:1928
#invasion-card:1929 · .mkt-listing:1957 · .ml-cancel:1961 · .mkt-sold:1967,1968,1969 · .list-dialog:1976,1977,1982 · .list-hint:1981
.collect-reveal-frame:1985,1992 · .collect-reveal-img:1991 · .collect-reveal-stars:1993 · .craft-box:1996 · .craft-head:1997 · .craft-bar:1998
.craft-fill:1999 · .craft-text:2000 · .craft-btn-row:2001,2002 · .craft-go-btn:2004,2010,2011,2014 · .craft-cancel:2022,2026 · .mkt-catalog:2029,2030,2031
.mkt-pager:2034 · .pg-btn:2035,2039,2040 · .pg-mid:2041 · .pg-dots:2042 · .pg-dot:2043,2044 · .order-head:2045
.order-row:2046,2051,2053,2055 · .order-deliver:2056,2061 · .order-need:2062 · .avatar-chip-photo:2068 · .pass-photo:2069 · .pl-photo:2070
.pp-cam:2075,2083 · .set-photo-row:2086,2092 · .ph-thumb:2093 · .ph-plus:2094 · .photo-box:2100,2101,2122,2126(+4) · .ph-now:2102
.ph-now-img:2103,2107 · .ph-now-cap:2108 · .ph-warn:2109 · .ph-sync:2114,2117 · .ph-sync-wait:2118 · .ph-sync-ok:2119
.ph-sync-bad:2120 · .ph-btns:2121 · .ph-tip:2131 · .ph-stage:2133,2137 · .ph-cv:2138 · .ph-ring:2139,2144
.ph-zoom:2148 · .ph-foot:2149 · .ph-crop-box:2150
