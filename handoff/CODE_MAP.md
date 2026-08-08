# CODE_MAP.md — แผนที่โค้ด:บรรทัด (เจนอัตโนมัติโดย `tools/gen_code_map.py` — **ห้ามแก้มือ** เดี๋ยวโดนเขียนทับ)

> วิธีใช้: หาชื่อฟังก์ชัน/ค่าคงที่/selector ในไฟล์นี้ (Grep หรือกวาดตา) → `Read` ไฟล์จริง `offset=<บรรทัด>` `limit=40`
> 🗂️ ไฟล์อ้วนมี **สารบัญโซน** (`st-end ชื่อโซน`) — งานทั้งระบบ/โลก 3D: Grep ชื่อโซน → Read/Edit เฉพาะช่วงนั้น **ห้ามอ่านทั้งไฟล์** · เพิ่มระบบใหม่ในไฟล์อ้วนต้องครอบ banner `/* ==== */`+ชื่อโซน (สารบัญเจนเอง)
> css = index `selector:บรรทัดทุกจุดที่ประกาศ` (บั๊ก UI เริ่มหาที่นี่) · เจนใหม่ทุกครั้งที่รัน `python tools/rotate_handoff.py` · อัปเดต: 2026-08-08

## js/adv3d_css.js (1,222 บรรทัด · 0 รายการ)

## js/adv3d_intro.js (86 บรรทัด · 0 รายการ)

## js/adv3d_tex.js (245 บรรทัด · 19 รายการ)
TILE_COLORS:9 · letterTexture:10 · letterTextureDark:27 · emojiTexture:40 · GHOST_IMG_MAX:52 · measureGhostBox:58
probeGhostImages:71 · whenGhostsReady:83 · ghostTexture:87 · ghostScareSrc:92 · AD_STYLES:100 · adBoardTexture:109
addAdBillboard:156 · ringAds:167 · BUILDING_TINTS:177 · FACADE_ROWS:179 · buildingFacadeTexture:180 · makePeerSprite:205
bind:241

## js/adventure3d.js (13,201 บรรทัด · 637 รายการ)
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
- 2103-2145 🧱 เทกซ์เจอร์ภาพจริง (รอบ 323) — วางไฟล์ `img/tex/<key>.jpg` (หรือ .png) แล้วแปะทับพื้นผิวทันที
- 2146-2645 🌌 ท้องฟ้ากลางคืนโรงแรมผีสิง (รอบ 694) — ผู้ใช้: "ข้างนอกโรงแรมยังไม่น่ากลัวพอ"
- 2646-2684 🏨 โรงแรมผีสิง (รอบ 684) — ตัวตึก 5 ชั้นสร้างใน js/hotel3d.js
- 2685-2783 ตัวอักษรในโลก (8.2)
- 2784-2966 ⚰️🔤 รอบ 1060 — เส้นทางภารกิจโรงแรมผีสิง 4 คำ
- 2967-3009 🌳🪙 รอบ 811: ความหนาแน่นเสริมเฉพาะโหมดขับรถ — ผู้ใช้: "เพิ่มตัวอักษรและเหรียญบนถนนและ
- 3010-3088 🔠🪙 เก็บตัวอักษร 1 ตัว = ได้ 1 เหรียญ (รอบ 345)
- 3089-3163 ประกอบคำอัตโนมัติเมื่อมีตัวอักษรครบ (8.1/8.4)
- 3164-3258 โหมด adv: monsters ยิงสู้ได้ (สเปกเดิม 8.5)
- 3259-3266 👻 ผีในโรงแรม (รอบ 684 — เขียนใหม่ทั้งชุด · ผู้ใช้สั่งข้อ 10-13, 18)
- 3267-3395 🧟 โมเดลผี 3D (รอบ 689 — ผู้ใช้สั่ง: "ภาพผีแบน ๆ ไม่สมจริง ไม่น่ากลัว ใช้โมเดลแทน")
- 3396-3658 🔦👻 รอบ 778 (ผู้ใช้สั่งข้อ 4) — กติกาใหม่ของผีเดินเพ่นพ่านในโรงแรม
- 3659-3965 🏨 ระบบโรงแรมผีสิง (รอบ 684) — เดินขึ้นชั้น/ไฟดับ/ไฟฉาย/ตู้เสื้อผ้า/รูปตามอง
- 3966-4199 เสียงหลอนโหมดผีสิง — สังเคราะห์ Web Audio (ปลอดลิขสิทธิ์ 100%)
- 4200-4304 🔊 รอบ 1071 — เสียงโรงแรมจากไฟล์จริง + ฝีเท้าแยกทุกตัวละคร
- 4305-4655 Multiplayer — ผู้เล่นอื่นใน map เดียวกัน (สไตล์ Roblox)
- 4656-4873 Voice chat ใน map — WebRTC P2P mesh (เสียงวิ่งตรงระหว่างเครื่อง)
- 4874-4954 🏁 พิธีประกาศแชมป์ (ครูกด "จบรอบแข่ง") — /class/<map>/podium
- 4955-5161 HUD
- 5162-5809 DOM overlay + CSS (สร้างครั้งเดียว — self-contained ไม่แตะ style.css)
- 5810-5945 Input — เมาส์+คีย์บอร์ด และจอสัมผัส (มือถือ landscape)
- 5946-5950 🚁 โหมดเฮลิคอปเตอร์ Bell — ฟิสิกส์บินแบบอาร์เคด (สไตล์ Helicopter Flight Pilot)
- 5951-6343 🛸 โดรน FPV (โหมด drone) — บินเร็ว/คล่อง ลอดหน้าต่างเข้าตึกร้าง เก็บตัวอักษรในห้อง
- 6344-6466 🚗 โหมดขับรถเมืองกำแพงเพชร — ฟิสิกส์รถอาร์เคด (bicycle model)
- 6467-6560 🚦 รอบ 133: ไฟจราจรจริงที่ทางแยกใหญ่ + ฝ่าไฟแดงโดนใบสั่ง ม.22
- 6561-7008 🧭 GPS นำทาง (โหมด drive) — เลือกตัวอักษรเป้าหมาย + เส้นทางตามถนนจริง (A*) · นำทางด้วยภาพล้วน (ไม่มีเสียงพูด ตั
- 7009-7067 🎛️ เข็มหน้าปัดวิ่งจริง (สปีด 0-180 + วัดรอบ 0-8×1000) — วาดทับวงเกจของภาพ dash.png
- 7068-7152 🎵 รอบ 181: วิทยุในรถ — จอ head-unit กลางคอนโซล (visualizer + เลือกเพลง 3 โหมด)
- 7153-7196 🪞📷 รอบ 810: กระจกมองหลัง/ข้าง — เรนเดอร์ฉากเดิมซ้ำด้วยกล้องหันหลัง/เฉียงข้าง แล้วยัดลงกรอบบนจอ (scissor)
- 7197-7280 🪞🧑‍🤝‍🧑 รอบ 973: เพื่อนที่ขับตามมา "เห็นในกระจกมองหลัง" + ป้ายชื่อลอยเหนือรถเขา
- 7281-7408 🪆 รอบ 191: ตุ๊กตาดุ๊กดิ๊กหน้ารถ — รูปตัวละครที่ผู้เล่นเลือก (blkN.png)
- 7409-7712 🚔 รอบ 128: แผงเตรียมออกรถ + กฎหมายจราจร + ใบสั่ง
- 7713-7755 🛩️📦 ภารกิจไปรษณีย์กลางคืน (รอบ 353) — เฉพาะช่วงฟ้ามืด (heliNight>.5)
- 7756-8970 🚶🛗🚁🪂 โหมดเดินเท้าในเมืองเฮลิฯ (รอบ 354 — ผู้ใช้สั่ง)
- 8971-9044 🎛️ หน้าปัดเข็มขยับจริง (รอบ 61) — วาดสดทุกเฟรมจากค่าการบินจริง
- 9045-9316 🌧️☀️ ชั้นบนกระจก: ที่ปัดน้ำฝน + แสงแดดสาด (รอบ 346)
- 9317-9721 🔊🌧️ เสียงที่ปัดน้ำฝน (รอบ 537) — สังเคราะห์ล้วน ไม่มีไฟล์เสียง
- 9722-9791 📹 กล้องใต้ท้องเครื่อง (belly cam) — รอบ 348
- 9792-9863 🎯 วงเป้าลงจอด (รอบ 349) — ไฮไลต์ดาดฟ้าที่มีตัวอักษร ให้รู้ว่าควรร่อนลงตรงไหน
- 9864-10479 📏 แถบเตือนความเร็วดิ่ง (รอบ 349) — ลงเร็วเกินกรอบกล้องกะพริบแดง สอนให้ร่อนลงนุ่มๆ
- 10480-10482 Loop หลัก
- 10483-12110 ⚽ โหมดสนามฟุตบอล — ฟิสิกส์บอล + เล็ง + ชาร์จพลัง + กล้อง 1st/3rd + ชุดนักเตะ
- 12111-12566 🤖 โหมดหุ่นยนต์นักรบ — เดินยิงเอเลี่ยนตัวอักษร (ต้องยิงเรียงลำดับในคำ)
- 12567-12587 เข้า/ออกโลก
- 12588-13201 ❓ การ์ด "วิธีเล่น" ตอนเข้าโลกครั้งแรก (จำแยกต่อโลกใน localStorage — ไม่แตะ state.js)
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
heliKppBlocked:2049 · heliKppSpawn:2070 · SKY_IMG:2093 · applySky:2094 · applyTex:2110 · HSKY_R:2160
hskyTex:2162 · buildHauntSky:2167 · tickHauntSky:2297 · buildScene:2315 · randPos:2688 · randRoadPos:2696
randGreenPos:2714 · HOTEL_PER_ROOM:2736 · HOTEL_MIN_GAP:2737 · hotelSpot:2738 · hotelPruneLetters:2774 · HOTEL_QUEST_WORDS:2792
HOTEL_SEARCH_FLOORS:2793 · hotelQuestReset:2795 · hotelClearQuestLetters:2800 · hotelQuestWordLetters:2804 · hotelStartQuestWord:2808 · hotelQuestMask:2831
hotelQuestWire:2835 · hotelQuestMeta:2841 · hotelFinalHint:2848 · hotelRevealFinal:2856 · hotelAfterQuestPickup:2869 · hotelApplyPeerProgress:2881
spawnLetter:2894 · spawnLettersForWord:2945 · ensureCoverage:2947 · DRIVE_LETTER_COPIES:2973 · DRIVE_BONUS_COINS:2974 · ensureDriveAmbience:2975
removeLetter:2988 · spawnLetterAt:2996 · tickLetterRespawns:3004 · LETTER_COIN:3015 · BONUS_COIN_VAL:3016 · pickUpLetter:3017
letterPop:3053 · letterChime:3072 · tryCompleteWords:3092 · completeWord:3106 · spawnMonster:3167 · killMonster:3176
tickMonsters:3184 · damagePlayer:3206 · shoot:3222 · tickShots:3236 · GHOST_GLB_URL:3276 · GHOST_MODEL_H:3277
ghostGlbEnsure:3279 · buildGhostMesh:3305 · makeGhostSprite:3327 · spawnGhost:3345 · applyGhostSize:3370 · faceGhostToPlayer:3381
setGhostVis:3387 · GHOST_MIN_FLOOR:3403 · TORCH_LOCK_S:3404 · BANISH_S:3405 · ghostsAllowed:3407 · hotelCorridorX:3412
torchHitsGhost:3421 · ghostBanish:3428 · ghostGoLurk:3437 · ghostGoStalk:3448 · ghostGoBehind:3461 · hotelGhostCueStart:3471
tickHotelGhostCue:3482 · tickGhosts:3494 · sessionRecapHtml:3593 · hauntRunSec:3600 · fmtSurv:3601 · hauntSurviveFinish:3602
tickSurvive:3612 · renderHearts:3626 · hotelScare:3632 · knockedOut:3652 · DARK_LETTER:3678 · tintSprite:3679
hotelReset:3682 · setTorch:3708 · toggleTorch:3724 · tickTorch:3729 · hotelBlackout:3739 · hotelLightsOn:3759
hotelStartFlicker:3771 · hotelFlicker:3779 · tickHotelPlayer:3791 · tickHotelWorld:3860 · hotelAct:3905 · openWardrobe:3922
announceTarget:3945 · hotelFinishRound:3955 · netReady:4310 · netJoin:4316 · sendPos:4337 · netHonk:4388
sendChat:4394 · toggleChatBox:4408 · onPeerData:4419 · disposeHeliMesh:4509 · removePeer:4514 · netLeave:4530
tickPeers:4536 · RTC_CFG:4664 · tinvLinked:4665 · partyWord:4672 · syncPartyWord:4687 · updateVoiceBtns:4855
PODIUM_BONUS:4880 · podiumJoin:4882 · podiumLeave:4893 · endRound:4894 · showPodium:4905 · tinvCheck:4946
showBanner:4959 · renderHudTop:4965 · renderHudWords:4970 · renderHudInv:4980 · ddTierFromName:4987 · renderBoard:4989
drawBigMap:5026 · openBigMap:5081 · closeBigMap:5089 · drawMinimap:5094 · loadCarDash:5167 · loadCarWheel:5179
buildDom:5189 · confirmExit:5794 · IS_TOUCH:5813 · HAS_KBD:5815 · bindInput:5816 · movePlayer:5911
tickPlayer:5921 · collideDrone:5954 · propStall:5973 · propBreak:5980 · propFix:5987 · droneBatAdd:5994
lightningBolt:5997 · startRain:6008 · stopRain:6022 · smashGlass:6024 · awardGlass:6035 · neededLetter:6052
openDoor:6067 · raceStartRun:6087 · raceStop:6094 · gateHighlight:6112 · renderRaceHud:6119 · tickDrone:6128
nearMissTick:6271 · showNearMiss:6295 · awardDaredevil:6306 · comboCheer:6323 · comboFlash:6339 · driveCell:6348
nearestStreet:6354 · collideCar:6364 · tlDotY:6395 · tlSet:6399 · driveArms:6416 · tlTick:6428
TL_GREEN:6472 · tlRedDur:6474 · tlightPhase:6475 · buildTrafficLights:6482 · rlTick:6534 · cellDrivable:6566
cellWeight:6569 · cellBlocked:6574 · cellCenter:6575 · posReachable:6577 · losClear:6588 · nearestDrivableCell:6599
routeGrid:6611 · pickGpsTarget:6664 · NAVLINE_W:6687 · NAVLINE_SKIP:6688 · navLineEnsure:6689 · navLineHide:6699
navLineUpdate:6700 · tickGps:6736 · tickDrive:6807 · drawCarDial:7015 · drawCarGauges:7045 · RADIO_RECT:7073
CAR_RADIO_RECT:7075 · carRadioRect:7081 · radioLayout:7083 · radioSetHint:7106 · renderRadioList:7112 · radioToggleList:7122
drawRadioViz:7127 · radioTick:7145 · MIRROR_REAR:7159 · mirrorRearRect:7162 · mirrorPass:7164 · toggleMirrorMini:7177
drawCarMirrors:7184 · MTAG_MAX_D:7206 · mirrorTagsHide:7210 · mirrorTagName:7211 · mirrorTagsTick:7212 · BOBBLE_FOOT:7286
BOBBLE_H:7287 · BOBBLE_ASPECT:7288 · BOB_OMEGA:7291 · BOB_PITCH_FORCE:7293 · BOBBLE_SKINS:7295 · bobbleSetAvatar:7302
bobbleLayout:7309 · bobbleTick:7322 · bobblePoke:7347 · bobbleApplySkin:7364 · dollOwned:7374 · openDollPicker:7375
carStartShow:7412 · showLawInfo:7430 · lawNotice:7452 · driveFineSettle:7462 · HELI_PHASES:7641 · heliStartPhase:7648
heliFloorAt:7655 · SOFT_TIERS:7665 · softLandBonus:7667 · awardPerfLand:7680 · setHeliLight:7699 · MAIL_COIN:7718
mailStart:7720 · mailStop:7743 · mailTick:7744 · FOOT_EYE:7763 · doorSlideSfx:7769 · doorLerp:7792
entLerp:7800 · footStepSfx:7810 · WRING_COIN:7831 · festivalPaint:7835 · dustTexture:7847 · dustBurst:7856
dustTick:7870 · HELI_GLB_URL:7891 · HELI_GLB_TEX_BLUE:7893 · HELI_GLB_ROTOR:7895 · HELI_GLB_TROTOR:7896 · heliGlbEnsure:7898
heliMatBlueGet:7916 · heliGlbAssemble:7929 · heliNavTick:7968 · peerRotorStop:7975 · peerRotorTick:7981 · heliCrashSfx:8000
heliMeshBuild:8028 · heliMeshBuildLegacy:8039 · buildHeliFoot:8169 · footFloorAt:8285 · insideTerm:8292 · inDoorZone:8293
footHint:8297 · setFootBtns:8298 · liftStart:8303 · beginRide:8314 · endRide:8337 · beginWing:8348
awardAirLetter:8361 · paxChoiceShow:8380 · paxChoiceHide:8406 · pilotShipMesh:8410 · beginPilot:8411 · endPilot:8443
drawCabinWindow:8467 · tickHeliFoot:8491 · heliWallPenalty:8702 · tickHeli:8714 · CP_NAT:8979 · CP_GAUGES:8980
SEAT_LABEL:8993 · SEAT_P_FULL:8994 · SEAT_ZOOM:8995 · DASH_OFF_Y:8996 · DASH_DROP:8997 · setSeat:8999
layoutCockpit:9011 · WIPER:9050 · WIPER_SPD:9053 · WIPER_LABEL:9054 · INT_GAP:9055 · WASH_MS:9059
WASH_TANK_MAX:9063 · SMEAR_LIFE:9075 · CHOP_MIN:9076 · SUN_RAY_FAR:9080 · sunRayBlocked:9082 · sunShadeTick:9101
applyCockpitShade:9112 · rotorChop:9124 · sunUpdate:9132 · HELI_FOG_N0:9143 · fogUpdate:9147 · adGlowPulse:9195
RAIN_MAX:9204 · VISOR_Y:9205 · RAIN_MIN:9206 · RAIN_DUR:9207 · DROP_ZONE:9211 · addDrop:9212
tickDrops:9220 · addWashDrop:9238 · washStart:9245 · renderWashGauge:9265 · washTick:9276 · grimeTick:9293
WIPE_R:9300 · wipeDrops:9301 · wiperSndOn:9324 · wiperSndOff:9336 · wiperThunk:9342 · washSpraySfx:9354
wiperSqueak:9371 · wiperSndTick:9388 · setWiper:9408 · tickWiper:9420 · SH_SWEEP:9451 · shadowSweepTick:9453
REFL_MAX:9465 · REFL_COL:9467 · cityGlowLevel:9468 · drawCityGlow:9473 · setVisor:9505 · rainTick:9511
drawBlade:9528 · drawSmears:9547 · drawGlass:9567 · drawBellyCam:9729 · drawBellyHud:9752 · drawLandingTargets:9798
VS_HARD:9868 · drawDescentBar:9869 · heliShake:9918 · cpNeedle:9929 · drawGauges:9946 · XF_START:9994
PRELOAD_WAIT:9995 · ALT_QUIET_FROM:9997 · ALT_MAX_DAMP:9998 · ALT_LP_MIN:9999 · ECHO_NEAR:10000 · WIND_FULL_SPD:10001
SHUTDOWN_SEC:10002 · PAN_MAX:10004 · OD_RPM:10005 · SHAKE_RPM:10006 · SHAKE_HIT:10007 · soccerLetterPos:10487
letterNeeded:10495 · soccerNeededSet:10504 · soccerTileGeo:10512 · soccerGoldTexture:10514 · makeSoccerTile:10531 · soccerRefreshSkins:10540
soccerBuildTargets:10547 · soccerNextTile:10557 · soccerRetarget:10573 · soccerCoinPop:10585 · soccerGrassTexture:10598 · soccerTurfGrade:10620
soccerTurfTexture:10671 · grassNormalTexture:10690 · soccerLinesTexture:10719 · soccerNetTexture:10770 · soccerCrowdTexture:10778 · soccerBallMat:10797
buildSoccerGoal:10817 · buildStands:10836 · soccerLedBoards:10871 · soccerGKEnsure:10968 · soccerGKTick:10984 · fkBuildWall:11013
fkToggle:11028 · fkHitTest:11044 · pkHud:11063 · pkStart:11072 · pkEnd:11086 · pkTick:11101
repQualify:11108 · repEnsureEl:11111 · repStart:11122 · repTick:11129 · soccerNumTex:11154 · ssSec:11166
ssPaintPattern:11171 · soccerShirtTex:11184 · makeSoccerPlayer:11206 · soccerNewSpot:11242 · soccerResetBall:11254 · soccerKick:11261
soccerCheer:11279 · guideTexture:11282 · auraActive:11306 · auraLeftMs:11307 · auraFlameTex:11315 · auraCoilTex:11339
auraCoilRibbon:11363 · auraGlintTex:11387 · buildAura:11398 · auraBuy:11441 · auraRender:11451 · auraTick:11465
buildDrill:11516 · drillTick:11529 · ballFXTex:11569 · buildBallFX:11580 · smokePuff:11596 · ballFXTick:11604
buildLandRing:11650 · buildGuideRibbon:11660 · renderSpinPad:11685 · spinPadToggle:11697 · spinPadPick:11703 · renderCurl:11715
kickLaunch:11726 · updateSoccerGuide:11735 · soccerCamera:11799 · tickSoccer:11822 · ssShirtPath:12016 · ssShortsPath:12024
ssPaintSwatchShirt:12029 · ssPaintSwatchShorts:12034 · ssPreviewDraw:12041 · soccerKitShow:12070 · soccerKitGo:12099 · emojiSprite:12152
makeAlien:12157 · startWave:12190 · waveSpawnFill:12201 · waveComplete:12210 · updateWaveHud:12220 · checkMechaBossBadge:12222
alienSpawnPos:12231 · removeAlien:12236 · mechaHudWord:12241 · setMechaHudSkin:12249 · mechaComboPop:12261 · mechaShielded:12266
mechaDamageFx:12268 · mechaHitByAlien:12273 · spawnAlienShot:12279 · removeAlienShot:12289 · tickAlienShots:12294 · spawnPowerup:12306
removePowerup:12319 · collectPowerup:12324 · tickPowerups:12331 · updateMechaHud:12340 · mechaTracer:12380 · mechaFire:12389
explodeAlien:12426 · tickMecha:12456 · loop:12512 · grabShot:12547 · savePhoto:12558 · clearEntities:12570
INTRO_KEY:12592 · introSeenObj:12593 · introSeen:12594 · markIntroSeen:12595 · INTRO:12596 · INTRO_MODE:12598
showIntro:12600 · HELI_KPP_BANNER:12626 · closeIntro:12628 · beginPlay:12634 · start:12636 · exitWorld:12872
mechaRecapLine:12944

## js/arena3d.js (724 บรรทัด · 0 รายการ)

## js/auth.js (420 บรรทัด · 36 รายการ)
AUTH_PUSH_MS:23 · AUTH_SDK_TIMEOUT_MS:24 · TEACHER_EMAILS:28 · isTeacher:29 · TESTER_EMAILS:42 · TESTER_COINS:43
isTester:44 · RANK_EXCLUDED_TESTER_NAMES:50 · rankUserExcluded:51 · testerBoost:57 · authSetStatus:90 · authShowLogin:102
authGateOffline:106 · authSaveRef:113 · authFetchCloud:114 · authWriteCloud:115 · authDeleteCloud:116 · authWriteProfileName:117
authPushProfile:124 · authApplyProfileName:132 · authAskProfileName:148 · authEditProfileName:159 · authStart:170 · updateOfflinePill:200
authEnterOffline:205 · authLateSync:222 · authIsAppMode:242 · AUTH_REDIRECT_CODES:250 · authLoginClick:252 · authOnLogin:272
authSyncOnLogin:285 · authFreshStart:314 · authAskLink:323 · authEnterGame:373 · authPushSave:388 · authLogout:399

## js/award.js (275 บรรทัด · 0 รายการ)

## js/bandadv.js (452 บรรทัด · 28 รายการ)
BAND_ADV_REWARD:9 · bandAdvFailMsg:16 · bandAdvLoad:23 · bandAdvPlay:61 · BAND_ADV_EXAM:76 · bandAdvExamId:81
bandAdvExamName:83 · BAND_ADV_SUPREME_BONUS:90 · bandAdvCheckSupreme:91 · bandAdvExamLock:107 · bandAdvExamBest:116 · bandAdvExamCat:129
bandAdvShowExamSummary:150 · bigExamBadgeNote:178 · BXR_TOP:197 · BXR_READ:198 · bxrKey:202 · bxrSubmit:206
bxrMerge:237 · bxrFetch:254 · bxrRowHTML:275 · bxRankBodyHTML:287 · bxRankMount:302 · bxRankNote:334
bxRankNoteRefresh:343 · openBigExamRank:350 · bandAdvExamOpen:367 · bandAdvCardsHTML:421

## js/bbaward.js (14 บรรทัด · 0 รายการ)

## js/bubble.js (200 บรรทัด · 0 รายการ)

## js/cert.js (655 บรรทัด · 32 รายการ)
CERT_MAX:17 · CERT_ISSUER_EN:18 · CERT_MONTHS:19 · CERT_TOPIC_EN:23 · CERT_LEVEL_EN:44 · CERT_ADV_EN:49
CERT_BIG_LV:56 · CERT_STD_EN:59 · certThIndex:67 · certTitleOf:76 · certSerial:102 · certDateEN:110
certTier:118 · CERT_TIER_META:125 · CERT_LOGO_SRC:131 · certAward:140 · certMine:166 · certAwardGold:173
certAwardAdvSupreme:194 · certBackfill:210 · certCatNameById:238 · certFromPost:263 · certXML:281 · certFit:286
certFitMeasured:292 · certHolder:301 · certSVG:311 · certChipHTML:593 · openCertBig:609 · openCertMine:625
certStripHTML:633 · certBindStrip:647

## js/city3d.js (3,313 บรรทัด · 210 รายการ)
### 🗂️ สารบัญโซน js/city3d.js (Read/Edit เฉพาะช่วง)
- 2-18 city3d.js — 🏙️ VOCAB CITY: ล็อบบี้ 3D แบบเมืองลอยฟ้า (index.html = หน้าหลัก · รอบ 861 · สลับเป็นหน้าหลักรอบ 86
- 19-51 ⚙️ CONFIG + เครื่องมือกลาง (รอบ 861)
- 52-126 🔒 รอบ 1070: ประตูโลกที่ยัง Coming soon — สิทธิ์ทดสอบมาจาก Auth ที่ฝังในเซฟ Lobby เดิม
- 127-229 📷 CAMERA RIG — 1 นิ้วเลื่อน · 2 นิ้วหมุน/เอียง/ซูม (รอบ 861)
- 230-393 🖼️ CANVAS TEXTURE โรงงานผิวสัมผัส (พื้นเกาะ/หน้าต่างตึก/ป้าย)
- 394-454 🏗️ BUILDERS — อาคารแต่ละแบบ (ห้ามกล่องเปล่าแปะ texture — มีชั้นเชิง/ระเบียง/หลังคา/ป้ายจริง)
- 455-843 🚪🌀 รอบ 897: ประตูม้วนเลื่อนขึ้น (โรงรถ/โรงเก็บยาน) — บานพับหมุนไม่ได้เพราะช่องกว้าง 3-5 เมตร
- 844-940 🚗🏍️🚁🛸 ยานพาหนะจิ๋ว (ผู้เล่นจริงจากโลก 3D จะขับ/บินสิ่งเหล่านี้ในเมือง)
- 941-997 🧍 ตัวละครผู้เล่น — blk1-8 = หุ่นบล็อก 3D · blk9-88 = ป้ายภาพ 2D ตั้งในโลก
- 998-1349 🌆 ผังเมือง — อาคารทุกหลังผูก go=<key> (ตัวรับใน js/main.js)
- 1350-1494 🎉 เทศกาลตามวันที่จริง — พลุปีใหม่ / สงกรานต์ / ลอยกระทง (รอบ 863)
- 1495-1755 🧑‍🤝‍🧑 ผู้เล่นจริง (อ่านอย่างเดียว) — presence→ยืนตามอาคาร · world→ขับ/บินในเมือง
- 1756-1912 💬 รอบ 866: บับเบิลแชทสดลอยหัวเพื่อนในเมือง
- 1913-2069 🖊️💬 รอบ 868: พิมพ์ตอบแชทได้จากในเมือง (ไม่ต้องกลับล็อบบี้เดิม)
- 2070-2219 💬🔴 รอบ 873: ไอคอน "มีข้อความค้าง ยังไม่ได้อ่าน" ลอยเหนือหัวเพื่อน
- 2220-2237 🚪 รอบ 870: กลับจากล็อบบี้เดิม → โผล่ที่ "หน้าประตูตึกที่เพิ่งเข้า"
- 2238-2472 🚪🔊 รอบ 890: บานประตูตึกเปิด-ปิดจริง + เสียงประตูสังเคราะห์เอง
- 2473-2604 🚗🤖🛸 รอบ 900: ยานพาหนะแล่นออกจากช่องประตูม้วนที่เพิ่งเปิด → จอดรอหน้าประตู
- 2605-2772 🚶 รอบ 866: ตัวเราเดินไปหน้าตึกก่อน แล้วค่อยเข้าหน้านั้น
- 2773-2857 🚪🚶 รอบ 886: กลับจากล็อบบี้เดิม → "เดินออกจากตึกมาหน้าประตู" (walkSelfTo ย้อนทาง)
- 2858-3025 👆 แตะ/คลิก: ตัวละคร→การ์ดโปรไฟล์ · อาคาร→เดินทางไปหน้านั้น · พื้น→ประกายดาว
- 3026-3079 🎵 รอบ 873: เพลงประกอบเมือง (BGM) — ปุ่มเปิด/ปิดมุมขวาล่าง
- 3080-3115 🚀 BOOT
- 3116-3313 🎬 รอบ 880: กลับจากล็อบบี้เดิม → จอเปิดคือ "ภาพเมืองใบที่เพิ่งเดินออกไป"
### รายการ js/city3d.js
ISLAND_R:22 · RING_IN:23 · BAND1_R:24 · GROUND_TEX_PX:25 · NIGHT:26 · esc:46
hash:47 · rnd:48 · clamp:49 · TAU:50 · CITY_WORLD_COMING_SOON:55 · CITY_WORLD_TESTER_NAMES:56
cityWorldTester:57 · cityWorldComingSoon:72 · BLK8:78 · CAR_COL:89 · gradeStars:94 · MAT:112
mat:113 · GEO:117 · box:118 · cyl:119 · M:120 · groundAt:151
setupInput:160 · twoState:222 · cvs:233 · ctex:234 · groundTexture:241 · wallTex:295
wallMat:314 · shopSign:319 · roundRect:329 · iconSprite:336 · nameSprite:358 · blobShadow:380
parapet:402 · roofProps:407 · DOOR_W:419 · doorNightFx:423 · doorAt:440 · ROLL_Z_HOLE:464
slatTexture:467 · rollAt:477 · awning:501 · bTower:513 · bShop:533 · bHouse:551
bLibrary:567 · bFactory:585 · bArcade:612 · bObservatory:629 · bHallOfFame:643 · bHaunted:664
bHeliport:682 · bGarage:699 · bStadium:714 · bMotoTrack:736 · bUfo:757 · bHangar:777
bJungleGate:800 · bDronePad:822 · miniCar:847 · miniMoto:866 · miniHeli:886 · miniDrone:906
miniMecha:921 · makeBlockFigure:945 · makeSpriteFigure:981 · makeFigure:990 · pickBlk:993 · bld:1001
BUILDINGS:1002 · BLD_AT:1121 · buildCity:1123 · buildPlaza:1174 · buildGreens:1220 · _glowTex:1265
buildSky:1275 · buildAmbientTraffic:1337 · FESTIVAL:1354 · buildFestival:1366 · buildFireworks:1373 · buildSongkranDeco:1415
buildLoiKrathongDeco:1447 · actBuilding:1518 · loadFirebase:1529 · liveStart:1537 · lbGet:1552 · watchPresence:1562
spawnStander:1586 · WORLD_MAPS:1621 · pollWorlds:1628 · spawnVehicle:1679 · removeActor:1739 · markPickable:1752
BUB_MS:1765 · BUB_FRESH:1766 · BUB_MAXCH:1767 · BUB_MAX:1768 · BUB_TEX_KEEP:1769 · bubTexture:1775
bubTexRelease:1787 · bubbleSprite:1792 · bubDraw:1801 · killBubble:1828 · showBubble:1841 · flushBubble:1879
watchFriendChats:1887 · CITY_CHAT_MAX:1926 · CITY_QUICK_REPLIES:1928 · bubSafeText:1931 · actorInfo:1937 · chatBoxCanSend:1947
chatBoxWhy:1951 · chatBoxRefresh:1957 · openChatBox:1994 · closeChatBox:2006 · cbNote:2011 · sendCityChatText:2017
sendCityChat:2047 · cityStopLive:2052 · SAVE_KEY:2081 · saveRead:2084 · pairIdOf:2087 · chatSeenTsCity:2089
chatMarkSeenCity:2095 · unreadTexture:2108 · addUnreadBadge:2126 · removeUnreadBadge:2147 · setUnread:2157 · applyUnread:2163
markReadCity:2165 · unreadCount:2173 · spawnSelf:2179 · DOOR_MEM:2230 · rememberDoor:2231 · lastDoorKey:2232
DOOR_SWING:2254 · DOOR_OPEN_S:2255 · DOOR_SHUT_S:2256 · DOOR_AJAR:2260 · AJAR_QUIET_MS:2261 · ROLL_OPEN_S:2266
ROLL_SHUT_S:2267 · ROLL_LIFT:2268 · ROLL_AJAR:2269 · registerDoor:2272 · doorLeadS:2285 · doorSpillTexture:2291
doorCreakSfx:2302 · doorLatchSfx:2320 · shutterRollSfx:2343 · shutterClunkSfx:2370 · doorMoveSfx:2393 · setCityDoor:2400
openCityDoor:2411 · closeCityDoor:2412 · setDoorRest:2414 · refreshDoorRest:2426 · applyDoorPose:2436 · RIDE_GATE:2488
RIDE_OUT_S:2489 · RIDE_PARK_S:2490 · DOOR_RIDES:2493 · rideLeadS:2503 · rideSfx:2508 · ridePose:2533
launchRide:2550 · releaseRide:2562 · WALK_SPD:2611 · WALK_MIN:2612 · WALK_MAX:2613 · DOOR_GAP:2614
RECEPTION_SPOT:2618 · doorSpotOf:2619 · walkPose:2630 · footCtx:2645 · footStepSfx:2650 · footDustTexture:2671
footDustPuff:2680 · footDustTick:2694 · FOOT_STEP_DIST:2709 · DOOR_OPEN_AT:2710 · walkSelfTo:2712 · EXIT_BACK:2784
EXIT_DUR:2785 · EXIT_STEP:2786 · EXIT_CLEAR:2787 · EXIT_SHUT:2788 · stageExitWalk:2791 · walkSelfOut:2803
onTap:2861 · captureCityShot:2880 · travelTo:2913 · sparkleAt:2954 · openProfile:2978 · refreshChip:3017
setChip:3021 · BGM_KEY:3032 · BGM_DUCK_PICTURE_DICTIONARY:3033 · bgmWant:3035 · bgmEnsure:3036 · BGM_DEV:3045
bgmPlay:3046 · bgmDuckForPictureDictionary:3048 · bgmRefreshBtn:3053 · bgmToggle:3060 · bgmSetup:3065 · boot:3083

## js/dictband.js (410 บรรทัด · 27 รายการ)
BAND_EMOJI:12 · BAND_SET_REWARD:13 · BAND_DONE_BONUS:14 · bandFailMsg:21 · bandLoad:28 · bandShortTH:60
bandCat:68 · bandSets:90 · bandSetId:99 · bandCheckComplete:102 · bandSetCat:119 · BAND_RETAKE_MAX:131
bandTriedSets:132 · bandRetakeCat:143 · bandShowRetakeSummary:177 · bandSetsPassed:205 · openBandSetPicker:213 · bandMine:285
bandUnlocked:286 · bandLockToast:291 · bandExamLobby:297 · updateBandExamBtn:306 · bandLobbyTick:323 · bandPlay:334
bandSpeakSample:346 · bandPlayLobby:366 · bandCardsHTML:378

## js/examstd.js (945 บรรทัด · 49 รายการ)
XS_PASS_PCT:15 · XS_REWARD:16 · XS_REWARD_AGAIN:17 · XS_TIME_HINT:21 · XS_TIME_FALLBACK:22 · xsLimitSec:23
XS_SCALE:27 · xsScaleText:33 · xsFindSet:44 · examStdLoad:56 · xsFailMsg:91 · xsQuizId:99
xsBest:101 · XS_HIST_MAX:116 · xsHistory:117 · xsHistorySVG:126 · xsIsPractice:158 · xsTimerStop:160
xsElapsed:161 · xsFmt:162 · xsMark:169 · xsSecStats:175 · examStdStart:189 · xsBuildScreen:209
xsTimeUp:281 · xsRender:290 · xsChoose:366 · xsGo:378 · xsQuitAsk:394 · xsClose:402
xsSubmitAsk:408 · xsFinish:423 · xsTimeTableHTML:517 · xsShowReview:541 · openExamStdPicker:607 · XRK_READ:673
XRK_ALL:674 · xrkSubmit:682 · xrkMerge:712 · xrkAllRows:732 · xrkFetch:750 · xrkNote:776
xrkNoteRefresh:787 · xrkAllRowHTML:796 · xrkBodyHTML:800 · xrkMount:815 · openExamStdRank:854 · examStdCardsHTML:871
openExamStdBoard:906

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

## js/game.js (1,192 บรรทัด · 84 รายการ)
REPLAY_BONUS_EVERY:23 · REPLAY_BONUS_TIERS:25 · replayBonusFor:26 · SESSION_MILESTONES:32 · addSessionCoins:35 · updateBestTarget:74
weekKeyStr:87 · rolloverWeekBest:94 · exitGame:100 · showSessionSummary:136 · sprinkleConfetti:183 · VOCAB_PER_LEVEL:202
VOCAB_RANK_NAMES:203 · vocabRankName:204 · showProgressReport:206 · THUNDER_MS:388 · THUNDER_TIERS:392 · THUNDER_TIER_UI:393
thunderEmoji:394 · DAREDEVIL_TIERS:398 · DAREDEVIL_TIER_UI:399 · daredevilEmoji:400 · GLASS_TIERS:404 · GLASS_TIER_UI:405
glassEmoji:406 · DILIGENT_TIERS:410 · DILIGENT_TIER_UI:411 · diligentEmoji:412 · SOFTLAND_TIERS:416 · SOFTLAND_TIER_UI:417
softLandEmoji:418 · AIRL_TIERS:422 · AIRL_TIER_UI:423 · airLetterEmoji:424 · MECHABOSS_TIERS:428 · MECHABOSS_TIER_UI:429
mechaBossEmoji:430 · TYPIST_TIERS:437 · TYPIST_TIER_UI:438 · typistEmoji:440 · checkTypistBadge:442 · BIGEXAM_TIERS:458
BIGEXAM_TIER_UI:459 · bigExamEmoji:460 · bigExamCertCount:462 · checkBigExamBadge:467 · BFF_TIERS:482 · BFF_TIER_UI:483
BFF_COIN:484 · bffEmoji:485 · badgeSuffix:490 · BADGE_META:509 · NAME_BADGE_RE:526 · splitNameBadges:527
badgeEmojis:533 · badgeScore:538 · BADGE_CATS:545 · bcatLevel:558 · checkCrown:565 · currentBadgeScore:581
rolloverBadgeWeek:585 · addDiligent:598 · BADGE_COIN:617 · awardBadgeCoin:625 · BC_QUEUE:639 · celebrateBadge:640
bcShow:654 · showBadgeInfo:683 · addThunder:701 · startGame:715 · newRound:755 · updateTimerBar:794
updateComboPill:800 · pickCard:804 · checkMatch:816 · renderCats:930 · fmtMMSS:980 · quizTimerStop:984
quizTimerStart:989 · quizElapsed:999 · startQuiz:1003 · renderQuizQuestion:1021 · quizNext:1085 · finishQuiz:1098

## js/gradelock.js (169 บรรทัด · 15 รายการ)
GRADES:21 · GRADE_LOCK_DAYS:25 · GRADE_LOCK_MS:26 · gradeRank:29 · myGrade:30 · gradeTester:31
gradeHistList:34 · gradeLockLeftMs:44 · gradeLockLeftDays:51 · gradeUnlockAt:52 · gradeLocked:53 · gradeUpOptions:56
gradeChangeTo:64 · gradeLockNote:91 · openGradeChange:100

## js/hotel3d.js (1,169 บรรทัด · 53 รายการ)
TEX:25 · FLOOR_H:28 · WEST:31 · SHAFT_E:32 · CORE_E:33 · HOTEL_LENGTH_SCALE:37
BASE_CORRIDOR_LEN:38 · WORLD_X_MIN:40 · RZ0:41 · LZ0:42 · ST_LAND:50 · ST_XW:51
ST_XE:52 · ST_RUN:53 · ST_RISE:54 · ST_STEPS:55 · ST_GAP0:56 · ST_ZMID:57
ROOM_N:58 · DOOR_W:61 · ENTRY_HW:62 · PLAYER_R:63 · floorY:64 · Acc:71
accBox:72 · accGeo:88 · accMesh:96 · makeMats:107 · PORTRAIT_PHOTOS:174 · EYE_R0:183
PORTRAIT_EYE:184 · PORTRAIT_SKIN:192 · PORTRAIT_CLOTH:193 · portraitTexture:194 · signTexture:233 · build:247
inRect:941 · insideHotel:942 · surfaceY:945 · collide:977 · roomAt:997 · floorOf:1005
updateFloorVisibility:1012 · setLights:1034 · shuffleSpecialWardrobes:1047 · BLINK_DUR:1061 · BLINK_MIN:1062 · tick:1064
nearWardrobe:1134 · nearFuneral:1145 · inLift:1150 · atLiftDoor:1154 · randomHaunt:1158

## js/images.js (216 บรรทัด · 25 รายการ)
IMG_FILES:11 · MOODS:12 · COLLECTIBLES_IMG_V:16 · GIFTS_IMG_V:17 · startImgKey:19 · petImageKeys:21
probeImages:33 · probeRankImages:45 · probeCollectImages:46 · probeGiftImages:47 · probeHomeImages:48 · CLIP_FILES:57
CLIP_SM:63 · clipCanWebm:79 · CLIP_ASSET_V:90 · clipFileFor:92 · petClipKey:101 · petClipUrl:110
equippedItem:121 · petStateImg:131 · petWearOverlay:152 · wearLayerHTML:173 · happyNow:180 · makeHappy:181
currentPetImg:194

## js/invasion3d.js (10,435 บรรทัด · 641 รายการ)
### 🗂️ สารบัญโซน js/invasion3d.js (Read/Edit เฉพาะช่วง)
- 16-79 ⚙️ ค่ากติกา (จูนฟีลทั้งหมดที่นี่)
- 80-114 🎯 รอบ 419: ปืนกระบอกที่ 2 — R93 สไนเปอร์ (ตามสเปก Delta Force ที่ผู้ใช้ส่งมา)
- 115-160 🎬 รอบ 422: แอนิเมชันยกปืนเล็ง (ADS) ของ R93 — ตามสเปกที่ผู้ใช้ให้มา
- 161-189 🔍🫁 รอบ 504: "ตัวคูณบวกทับ" ท่าเล็ง — ซูมยิ่งแรงปืนยิ่งแนบตา + ท่าประทับแก้มตอนกลั้นหายใจ
- 190-227 🫁🌑 รอบ 505: สัญญาณรับรู้ลมหายใจตอนส่องกล้อง — เสียงสูด/ผ่อน/สั่น + ขอบจอมืดตามลมที่เหลือ
- 228-257 🔭🫨 รอบ 506: "กำลังขยายมีผลกับความนิ่งของภาพ" — ยิ่งซูมแรงยิ่งสั่นมาก ต้องพึ่งการกลั้นหายใจจริง
- 258-368 🫁💨 รอบ 508: "ลมหมดขณะยังกดกลั้นหายใจอยู่" — ปืนตกวูบแล้วหอบ ก่อนกลับสู่ปกติ
- 369-417 🚫🤖 รอบ 637 (ผู้ใช้สั่ง): ปิดบอทที่ช่วยผู้เล่นยิง — สนามนี้เหลือแต่ "ผู้เล่นจริง" เท่านั้น
- 418-449 🎛️ รอบ 1041: ภาษาภาพ HUD ยุทธวิธี — ไอคอนเวกเตอร์ต้นฉบับ
- 450-988 🎨 CSS + DOM overlay (self-contained ไม่แตะ css/style.css)
- 989-1288 🎛️ รอบ 1041: HUD ยุทธวิธี + ตัวแก้ตำแหน่งแบบเกมยิงมือถือ
- 1289-1418 🎛️🧭 รอบ 1041: HUD LAYOUT EDITOR — ลาก/ย่อขยาย/ความทึบ/บันทึก
- 1419-1783 🔊 เสียงสังเคราะห์ Web Audio (ปลอดลิขสิทธิ์ 100%)
- 1784-1948 🚁🔊 เสียงเฮลิคอปเตอร์ Bell 212 — "เหมือนโลก helicopter ทุกประการ" (รอบ 531 — ผู้ใช้สั่ง)
- 1949-1989 🚁🔊🌍 เสียงเฮลิรอบตัว (รอบ 531 — ผู้ใช้สั่ง) — ทุกลำในสนามส่งเสียงใบพัดจริง ดังตามระยะ + ซ้าย/ขวา
- 1990-2056 🖼️ เทกซ์เจอร์วาดเอง (canvas) + ตัวช่วยโหลดภาพจริงถ้ามีไฟล์
- 2057-2105 🌍 สถานะฉาก
- 2106-2165 📦 โหลดโมเดล .glb ถ้ามีไฟล์ (ผู้ใช้เอาของจริงมาใส่แล้ว)
- 2166-2293 🏜️ สร้างฉากทะเลทราย + เมือง
- 2294-2353 🌳 รอบ 580 (ผู้ใช้สั่ง): ต้นไม้จริงจากโมเดล tree.glb ของผู้ใช้
- 2354-2493 🏚️ รอบ 416: ถนนสมรภูมิหน้าจุดเกิด (ผู้ใช้ส่งภาพอ้างอิง Delta Force)
- 2494-2670 🏜️🪖 รอบ 1040: ภูมิทัศน์สมรภูมิสมัยใหม่ — PBR + ร่องรอยการรบ (ต้นฉบับ)
- 2671-2808 🏠 รอบ 431: บ้านหลบซุ่มยิง (โมเดล house_01 ของผู้ใช้) + จุดสูงข่มบนเนินเขา
- 2809-2869 🛸 ยานแม่ลำมหึมา — ทรงลิ่มเหลี่ยมมืด + หนาม + ช่องตัวอักษร (สไตล์ ID4)
- 2870-2942 👾 ยานลูก — 1 ลำต่อ 1 ตัวอักษร (บินเพ่นพ่าน + ยิงตอบเฉพาะผู้เล่นที่ยิงโดนลำนั้นก่อน)
- 2943-2946 👥 พันธมิตร — หน่วยรบภาคพื้นอาวุธครบมือ + ฝูงเฮลิคอปเตอร์ติดมิสไซล์
- 2947-3051 🪖 รอบ 423: ระบบตัวละครทหารแบบมี "ข้อต่อ" (rig) — รองรับโมเดล .glb ของผู้ใช้
- 3052-3564 🤖 รอบ 424: จับชิ้นส่วนเข้าข้อต่อ "อัตโนมัติจากตำแหน่ง" (ผู้ใช้ไม่ต้องตั้งชื่อ)
- 3565-3710 🚁🅿️ รอบ 434: เฮลิคอปเตอร์จอดในสนามรบ 5 ลำ (โมเดลจริง helicopter.glb — ผู้ใช้สั่ง)
- 3711-4013 🎛️🚁 รอบ 532: ห้องนักบิน "ภาพจริง + เข็มเกจขยับ" (ผู้ใช้สั่ง — เหมือนโลก helicopter ทุกประการ)
- 4014-4038 🔫 อาวุธในมือผู้เล่น (view model ติดกล้อง — เห็นปืนที่ถืออยู่แบบ Delta Force)
- 4039-4145 🎯🔧 TUNE ZONE — ท่าถือปืน (แก้ที่นี่ที่เดียว · 3 บรรทัดล่างนี้เท่านั้น)
- 4146-4201 💪 มือถือปืน มุมมองที่ 1 — รอบ 518 (ผู้ใช้สั่งตรง: เปิดโชว์มือจริง)
- 4202-4339 🧤 รอบ 518: โมเดลมือจริง (GLB จาก Tripo) — ผู้ใช้เจนเอง img/models/hand_grip.glb
- 4340-4488 🔧 รอบ 427: ยืดลำกล้องปืนหลัง export (ผู้ใช้: โมเดล R93 ลำกล้องสั้นไป)
- 4489-5194 🔩 รอบ 447: ชักลูกเลื่อนแบบ SV-98/Delta Force (ผู้ใช้ส่งคลิปอ้างอิงมา)
- 5195-5461 💥 เอฟเฟกต์: ระเบิด · ประกายโดน · ลำแสง · เศษซาก
- 5462-5591 🛡️🔵 รอบ 581 (ผู้ใช้สั่ง): "เกราะยานแม่ที่มองไม่เห็น"
- 5592-5697 🎯📝 รอบ 471: เป้าฝึกยิงในสมรภูมิ (ผู้ใช้สั่ง)
- 5698-5758 🔎 รอบ 473: โจทย์แปลไทย — "ยิงคำที่แปลว่า …"
- 5759-6145 🎯 ระบบยิงของผู้เล่น
- 6146-6159 🎯📡 รอบ 563: เรดาร์ล็อกเป้า + มิสไซล์นำวิถีเข้าเป้าที่ล็อก (ผู้ใช้สั่ง — สไตล์ Ace Combat)
- 6160-6302 🎯🔒 รอบ 564 (ผู้ใช้สั่ง): ล็อกหลายเป้าพร้อมกัน → ยิงมิสไซล์รัวทีละชุด
- 6303-6354 🧭🚀 รอบ 572 (ผู้ใช้สั่ง · ต่อยอดรอบ 569): ลูกศรบอกทิศ "จรวดที่พุ่งเข้าหาเฮลิเรา" บนจอเรดาร์
- 6355-6426 📡⬇️ รอบ 575 (ผู้ใช้สั่ง): เรดาร์ต้องไม่ทับ "แผงสถานะซ้าย" (พลังชีวิต/ความร้อนปืน/ลูกจรวด)
- 6427-6499 ⚔️ ดาเมจ / เงื่อนไขชนะ
- 6500-6590 📖 คำศัพท์ + รอบเล่น
- 6591-6654 🖥️ HUD
- 6655-6841 🕹️ Input — มือถือ (จอย+ปุ่ม) และคอม (WASD + pointer lock)
- 6842-6962 🚶 ผู้เล่น + AI + ลูป
- 6963-6967 🚁 โหมดขับเฮลิคอปเตอร์เอง (รอบ 414 — ผู้ใช้สั่ง)
- 6968-7126 🗺️ รอบ 417: แผนที่เลือกจุดลงสนาม (ผู้ใช้สั่ง) — เข้าเกมแล้วเลือกได้ว่าจะไปเกิดตรงไหน
- 7127-7285 🎖️ รอบ 418: นั่งเฮลิลำเดียวกับเพื่อน — "นักบิน + พลปืนประจำประตู" (ผู้ใช้สั่ง)
- 7286-7647 🔭🚫 รอบ 575 (ผู้ใช้สั่ง): "ซูมปืนค้างไว้ = ขึ้นเฮลิไม่ได้ ต้องเลิกซูมก่อน"
- 7648-7911 🌐 ผู้เล่นออนไลน์ใน map เดียวกัน (รอบ 414) — Firebase /world/invasion
- 7912-8057 🧯👥 กันผู้เล่นล้น — ฝั่งเรนเดอร์ของโลกนี้ (รอบ 637 · ยกส่วนกลางออกไป js/netroom.js รอบ 640)
- 8058-8116 💨 ควันตามหลังมิสไซล์ (รอบ 531 — ผู้ใช้สั่ง) — สไปรต์ควันนุ่มปล่อยเป็นระยะ
- 8117-8284 🔥🌀 รอบ 565 (ผู้ใช้สั่ง): ยานลูก "หลบมิสไซล์ที่ล็อกได้" — ปล่อยแฟลร์ + บิดหนี
- 8285-8364 🔫↩️ รอบ 568/1043: ยานลูกที่ถูกผู้เล่นยิงโดนแล้ว และกำลัง "ถูกเรดาร์ล็อก" จึงยิงสวนใส่เฮลิผู้เล่น
- 8365-8566 🔥🛡️ รอบ 569 (ผู้ใช้สั่ง): แฟลร์ของ "เฮลิผู้เล่น" + เสียงเตือนตอนถูกล็อก
- 8567-8577 🏃🪖 รอบ 530: หน่วยรบเคลื่อนที่เชิงยุทธวิธี (ผู้ใช้สั่ง: "อย่าปักหลักยืนทื่อ
- 8578-8703 🧘🎯 รอบ 586 (ผู้ใช้ส่งคลิป: "ตัวละครดิ้นไปดิ้นมา ไม่เป็นธรรมชาติ")
- 8704-8879 📣 รอบ 471: ทหารฝ่ายเราตะโกนบอกทิศศัตรู (ผู้ใช้สั่ง)
- 8880-9322 🌙 รอบ 471: โหมดกลางคืน — ฉากมืดสลัว + ท้องฟ้าดาว + ไฟฉายติดปืน
- 9323-9589 🔵💀 รอบ 576 (ผู้ใช้สั่ง): ยานแม่ยิง "ลำแสงสีฟ้า" ลงมาใกล้ตัวผู้เล่น — เตือน 3 ครั้ง ครั้งที่ 4 ตายจริง
- 9590-9640 ⚡👾 รอบ 579 (ผู้ใช้สั่ง): "ทุก 5 นาที สุ่มยานลูก 10 ลำ เร่งความเร็ว 10 เท่า นาน 10 วินาที แล้ววนลูป"
- 9641-9718 🔁 ลูปหลัก
- 9719-10435 ▶️ เข้า/ออกโลก
### รายการ js/invasion3d.js
WORD_COIN:23 · WORD_TIME:25 · WORLD:26 · EYE:27 · FOV:28 · LOOK_SENS:29
PITCH_MIN:30 · MS_Y:52 · MS_FLAT:61 · MS_BELLY:62 · MS_HP:63 · MS_DMG_GUN:64
CORE_Y:70 · F_HP:75 · FIGHTER_SIZE:76 · F_SHOT_GAP:77 · GUN_GAP:79 · WEAPONS:86
SNIPER_SENS:93 · SCOPE_R:97 · SCOPE_MAGS:102 · RIFLE_MAGS:109 · magList:112 · curMag:113
ADS_IN:121 · ADS_POS:122 · ADS_ROT:123 · ADS_SCALE:124 · ADS_BY_GUN:156 · adsView:160
ADS_BOOST:173 · tickAdsBoost:182 · BREATH_FX:200 · tickBreathFx:211 · ADS_BREATH:227 · SWAY_MAG:240
tickSwayMag:249 · GASP:273 · fireGasp:285 · clearGasp:286 · tickGasp:288 · gaspMul:299
gaspPitchNow:301 · applyGasp:307 · REC_BY_GUN:323 · REC_DEFAULT:329 · recCfg:331 · BOLT_MS:332
BREATH_MAX:333 · SPRINT_IN:337 · SPRINT_POS:338 · LAG_GAIN:344 · SWAY:350 · PANT_FROM:363
MIS_MAX:366 · PLAYER_HP:367 · ALLY_BOTS:376 · SQUAD_N:379 · SQUAD_GAP:380 · HELI_CHASE_SPD:381
SQUAD_RUN:382 · HELI_MAX:388 · HELI_ACCEL:392 · HELI_LAND_VY:395 · HELI_CRUISE:398 · HELI_SKID:399
HELI_GUN_MUL:402 · PH_GUN_GAP:403 · PH_MIS_MAX:404 · NET_SEND_MS:407 · CHAT_MS:408 · CHAT_PRESETS:409
PEER_COLORS:410 · TAU:412 · HUD_ICON:422 · hudIcon:445 · CSS:453 · buildDom:1063
HUD_LAYOUT_KEY:1293 · HUD_TARGETS:1294 · HUD_PRESET_RIGHT:1305 · HUD_PRESET_LEFT:1314 · HUD_PRESET_TABLET:1316 · HUD_PRESETS:1325
hudCopy:1327 · hudRead:1328 · hudEl:1334 · hudSame:1335 · syncHudPreset:1338 · markHudCustom:1342
clearHudStyle:1343 · applyHudOne:1347 · applyHudLayout:1355 · applyHudPreset:1356 · ensureHudEntry:1361 · pickHudControl:1366
closeHudEditor:1373 · openHudEditor:1383 · initHudEditor:1389 · HELI_XF:1798 · HELI_OD_AMBER:1799 · CHORUS_RANGE:1955
resumeAudio:1987 · tryTex:1995 · letterSpriteTex:2008 · sandTex:2019 · wallTex:2041 · BULLET_SPD_R93:2069
loadGlb:2115 · tameGlbMaterials:2145 · fitInto:2157 · HILLS:2172 · buildTerrain:2181 · baseLow:2215
buildTown:2221 · TREE_LOD:2303 · buildTreesGlb:2305 · refreshTreeInstances:2331 · tickTreeLod:2349 · STREET_Z0:2359
instancer:2363 · buildWarStreet:2380 · roadSurfaceTex:2499 · fieldDecalTex:2521 · buildGroundDetail:2535 · buildMilitarySetDressing:2553
smokePointTex:2599 · buildBattlefieldAtmos:2605 · tickBattlefieldAtmos:2618 · sandbagWalls:2628 · squadCoverSpots:2636 · buildDustMotes:2646
tickDust:2657 · HOUSE_SIZE:2680 · HOUSE_LOD:2681 · HOUSE_COVER:2682 · HOUSE_CELL:2683 · HOUSE_SPOTS:2684
buildHouses:2690 · buildBlockGrid:2716 · gridBlocked:2752 · houseBlocked:2759 · houseCover:2768 · tickHouseLod:2776
findSniperSpots:2785 · buildMothership:2813 · layoutLetterPanels:2866 · makeFighter:2873 · drawFighterBar:2933 · SOLDIER_PARTS:2954
joint:2968 · buildSoldierRig:2972 · loadSoldierGlb:3015 · applySoldierGlb:3016 · BODY_MAP:3060 · mergeMeshList:3072
faceModelForward:3113 · skinSoldierLimb:3168 · autoRigSoldier:3210 · fitSoldierGround:3342 · poseSoldier:3368 · MUZZLE_BY_WEAPON:3489
FLASH_COLOR:3491 · makeSoldierFlash:3492 · makeSoldier:3499 · makeHeli:3530 · HELI_ROTOR_NODES:3573 · HELI_TROTOR_NODES:3574
HELI_LEN:3575 · HELI_DESERT:3576 · BOARD_DIST:3577 · AUTO_BOARD_DIST:3582 · HELI_COL_SENS:3589 · heliPiloting:3590
START_MS:3591 · START_PHASES:3592 · HELI_PADS:3599 · SEAT_VIEWS:3607 · heliModel:3618 · buildHeliPads:3660
padAt:3669 · movePad:3675 · startPhaseText:3680 · setSeatView:3687 · tickPads:3700 · CP_NAT:3721
CP_GAUGES:3722 · CP_LAMP:3733 · FUEL_MAX:3736 · FUEL_WARN:3737 · ENG_AMB:3739 · HOT_FULL:3746
heliLift:3748 · cpRpmNow:3753 · CP_SEAT_FULL:3754 · CP_ZOOM:3755 · CP_DASH_OFF_Y:3756 · CP_DASH_DROP:3757
CP_RPM_MAX:3761 · CP_SHAKE_RPM:3762 · loadCockpitImg:3767 · layoutInvCockpit:3783 · cpNeedle:3811 · cpArc:3828
cpRoundRect:3834 · tickHeliGauges:3841 · tickHeliHot:3866 · heliLampLv:3883 · ALARM_GAP:3892 · ALARM_KEYS:3893
resetHeliAlarm:3895 · tickHeliAlarm:3896 · cpLamps:3912 · drawInvGauges:3946 · ZERO_DIST:4053 · GUN_VIEW:4067
GUN_POS:4132 · GUN_ROT:4133 · GUN_SCALE:4134 · useGunView:4136 · MUZZLE_Y:4142 · buildFist:4155
buildArms:4175 · HAND_POSE:4212 · makeHandTopMat:4221 · FOREARM:4227 · addForearm:4228 · loadHandModel:4236
applyHandPose:4258 · fitArmsToWeapon:4267 · buildRifleModel:4273 · buildR93Model:4294 · GUN_CUT:4349 · GUN_STRETCH:4350
orientGunModel:4355 · stretchGunBarrel:4381 · mergeGunParts:4439 · forceGunForward:4464 · attachBoltHandle:4496 · tickBolt:4524
tickBarrelHeat:4567 · muzzleSmoke:4576 · alignGunMuzzle:4596 · syncMuzzleAnchor:4632 · buildSelfShadow:4640 · SUN_DIR:4653
tickSelfShadow:4654 · renderViewModel:4669 · vmToWorld:4685 · gunSil:4688 · setGunPose:4713 · buildGun:4741
tickSwap:4827 · applyWeapon:4837 · swapWeapon:4847 · setScoped:4861 · smoothstep:4875 · tickSway:4879
tickAds:4904 · applyRecoil:5025 · applyBreath:5031 · scopeRadius:5044 · scopeRadiusNow:5056 · tickRange:5061
layoutScope:5081 · scopeFovDeg:5131 · renderScopePass:5139 · cycleScopeMag:5167 · renderAmmo:5175 · syncWeaponBtns:5186
fxTex:5204 · fxGlow:5212 · fxFire:5220 · fxRing:5237 · fxDisc:5245 · fxStar:5252
boomFlashLight:5270 · tickBoomLight:5282 · boom:5291 · dustPuff:5357 · sparkAt:5367 · tracer:5382
tickFx:5398 · MSH_PAD:5474 · MSH_COL:5475 · MSH_CORE:5476 · MSH_HINT_GAP:5477 · MSH_FX_MAX:5478
msShieldOn:5480 · msShieldPt:5482 · msShieldRay:5493 · msShieldPow:5508 · shieldBurst:5511 · shieldHit:5572
tickShieldFx:5574 · TRG_COIN:5600 · QUIZ_COIN:5601 · targetTexture:5606 · setTargetWord:5624 · targetSpots:5634
buildTargets:5647 · tickTargets:5676 · quizPool:5704 · newQuiz:5707 · tickQuiz:5713 · renderQuiz:5719
targetWord:5726 · hitTarget:5732 · AIM_OFF:5767 · AIM_BY_GUN:5786 · aimOffNow:5787 · adsPosNow:5791
aimPct:5796 · layoutCross:5798 · aimDir:5801 · fireGun:5809 · ENV_BLOCK_D:5909 · solidAt:5910
envHit:5926 · HOLE_MAX:5985 · holeTexture:5986 · bulletHole:6001 · tickBullets:6012 · RECOIL_PAT:6035
RECOIL_RESET:6036 · addRecoil:6038 · startReload:6052 · tickReload:6060 · launchMissile:6066 · misBusyHint:6093
fireMissile:6097 · tickMisQueue:6133 · RDR_RANGE:6155 · RDR_FIND:6156 · RDR_KEEP:6157 · RDR_LOCK_MS:6158
RDR_BEEP:6159 · RDR_MAX_LOCK:6170 · RDR_ADD_GAP:6171 · SALVO_PER_TGT:6172 · SALVO_PAIR_MS:6173 · SALVO_TGT_MS:6174
LK_NUM:6179 · rdrOn:6180 · resetRadar:6181 · radarPick:6188 · radarHolds:6202 · tickRadar:6208
drawLockBoxes:6238 · drawRadar:6260 · AMK_TRACK:6316 · AMK_DECOY:6317 · AMK_BEEP:6318 · amisRel:6320
drawAMisMarks:6325 · RDR_GAP_TOP:6366 · RDR_GAP_JOY:6367 · RDR_SIZE:6368 · RDR_SIZE_MIN:6369 · RDR_SIZE_SIDE:6370
layoutRadar:6371 · lockTarget:6392 · rayTarget:6402 · raySphere:6419 · damageFighter:6434 · dropFighter:6446
updateArmor:6472 · killMother:6479 · flashScreen:6494 · myUid:6504 · leaderUid:6505 · isLeader:6510
pickWord:6511 · setWord:6524 · adoptWord:6534 · applyShared:6543 · startWave:6558 · completeWord:6568
renderWord:6594 · renderTarget:6604 · tickWordTimer:6615 · renderCoins:6625 · renderHp:6626 · renderHeat:6632
renderMissiles:6638 · toastBan:6648 · bindInput:6658 · moveJoy:6832 · unlockMouse:6840 · solidPushOut:6849
tickPlayer:6864 · hurtPlayer:6944 · MAP_VIEW:6973 · mapToWorld:6974 · worldToMap:6975 · zoneName:6976
buildMapShade:6990 · drawSpawnMap:7009 · safeSpawn:7084 · fitSpawnMap:7094 · openSpawnMap:7105 · applySpawnPick:7114
RIDE_DIST:7137 · RIDE_UP:7138 · RIDE_OFF:7139 · rideableHelis:7140 · findRide:7146 · nearestRideable:7147
ridePos:7157 · setRideView:7169 · boardGunner:7178 · dismountGunner:7197 · tickGunner:7213 · updateGunnerBtn:7253
tickAutoBoard:7269 · heliCount:7281 · zoomBlocksBoard:7299 · enterHeli:7309 · exitHeli:7351 · EXT_CAM:7380
EXT_VIEWS:7401 · EXT_SELF:7416 · EXT_RIDE:7417 · extP:7419 · syncExtBtn:7421 · cycleExtView:7427
resetExtCam:7436 · angDiff:7438 · extCamClear:7443 · extCamera:7462 · seatCamera:7485 · tickHeliFlight:7506
heliCrash:7605 · tickGpws:7615 · syncBotHelis:7637 · netReady:7653 · netJoin:7659 · netSend:7670
peerColor:7692 · NAME_SPR_H:7696 · nameSprite:7697 · bakedSoldierGlb:7713 · loadPeerSoldier:7714 · peerRig:7723
setPeerWeapon:7728 · peerBody:7733 · buildPeer:7762 · onPeer:7775 · dropPeer:7820 · netLeave:7827
peerTick:7832 · renderBoard:7868 · sendChat:7893 · showPeerBubble:7900 · removePeerBubble:7906 · PEER_DRAW_MAX:7919
PEER_DRAW_SLACK:7920 · DRAW_SWAP_MARGIN:7921 · JOIN_TOAST_MAX:7922 · drawnPeers:7925 · drawSlotFree:7926 · showPeerAgain:7929
hidePeer:7936 · tickDrawBudget:7941 · tickCrowdGuard:7951 · resetCrowdGuard:7955 · tickFighters:7957 · tickMother:8012
spawnAlienShot:8029 · tickAlienShots:8041 · smokeTex:8063 · spawnPuff:8074 · spawnSmoke:8084 · spawnDust:8086
tickSmoke:8095 · clearSmoke:8105 · tickHeliDust:8108 · EVA_WARN:8130 · EVA_FLARE_D:8131 · EVA_TURN:8132
EVA_SPIN_MUL:8133 · EVA_SPD_MAX:8134 · EVA_ROLL:8137 · EVA_Y:8138 · FLARE_PODS:8139 · FLARE_COOL:8140
FLARE_N:8141 · FLARE_LIFE:8142 · FLARE_TRAP:8143 · FLARE_CH:8144 · incomingMis:8149 · startEvade:8160
dropFlares:8169 · tickEvade:8197 · clearFlares:8229 · tickMissiles:8230 · CTR_REACT:8299 · CTR_WARN:8300
CTR_GAP:8301 · CTR_BURST:8305 · CTR_BURST_MS:8306 · CTR_SPD:8307 · CTR_DMG:8308 · CTR_MAX:8309
CTR_SPREAD:8310 · CTR_LEAD:8311 · ctrAimPoint:8314 · ctrArming:8321 · counterFire:8325 · tickCounter:8330
SPK_RANGE:8382 · SPK_MS:8383 · SPK_GAP:8384 · SPK_WORLD_GAP:8385 · SPK_BEEP:8386 · AMIS_SPD:8387
AMIS_TURN:8388 · AMIS_DMG:8389 · AMIS_LIFE:8390 · AMIS_MAX:8391 · AMIS_PROX:8392 · PH_FLARE_MAX:8393
PH_FLARE_RE:8394 · PH_FLARE_N:8395 · PH_FLARE_COOL:8396 · PH_FLARE_BACK:8397 · PH_FLARE_DOWN:8398 · PH_TRAP:8399
PH_FLARE_CH:8400 · renderFlareBtn:8403 · dropPlayerFlares:8409 · fireAlienMissile:8441 · clearAMis:8456 · resetSpike:8461
spikeStart:8462 · aMisNear:8464 · tickSpike:8472 · tickAMis:8524 · SQUAD_COVERS:8576 · squadCoverPool:8577
SQ_TURN:8587 · angWrap:8592 · turnTo:8594 · easeLook:8599 · squadTarget:8604 · pickSquadDest:8616
tickSquadMove:8630 · tickSquad:8656 · CALL_DIST:8710 · CALL_NEAR:8711 · CALL_GAP_ALL:8712 · CALL_GAP_ONE:8713
CALL_GAP_DIR:8714 · CALL_MS:8715 · CALL_LINES:8716 · CALL_SECTORS:8727 · bearingKey:8730 · clearSquadBubble:8738
callSprite:8744 · squadShout:8756 · tickSquadCalls:8769 · CHAT_GAP_ALL:8796 · CHAT_LINES:8797 · tickSquadChatter:8803
heliFireAt:8820 · nearestFighterTo:8832 · tickHelis:8838 · DAY:8887 · NIGHT:8889 · collectMsMats:8893
CYCLE_MS:8904 · MODE_ICON:8906 · STORM_MS:8913 · buildStars:8920 · buildStreetLamps:8943 · glowTex:8961
tickStreetLamps:8969 · beamPair:8986 · tickSearchBeams:8997 · buildBarrelFires:9034 · tickBarrels:9052 · tickShootingStar:9062
buildMist:9087 · tickMist:9097 · tickNightSound:9140 · tickSneak:9149 · tickStorm:9160 · nvReady:9176
nvEnter:9177 · nvExit:9183 · tickNvHint:9184 · dropGlowStick:9193 · tickGlowSticks:9210 · buildFlashlight:9219
setNight:9224 · setDayMode:9225 · tickNight:9239 · applyNightLook:9271 · tickFlashlight:9311 · MSB_FIRST:9341
MSB_GAP:9342 · MSB_WARN:9343 · MSB_KILL_WARN:9344 · MSB_NEAR:9345 · MSB_FLEE:9346 · MSB_R:9347
MSB_HOLD:9348 · MSB_MAX:9349 · MSB_DEAD_MS:9350 · MSB_BEEP:9351 · MSB_COVER_R:9354 · MSB_PAD_R:9355
MSB_COVER_RECHECK:9356 · msbEnsure:9361 · msbPlace:9378 · msbBarPos:9387 · msbHide:9394 · resetMsBeam:9398
msbCoverAt:9413 · msbAimBeside:9434 · msbBegin:9440 · msbAim:9457 · msbStrike:9488 · msbKill:9527
msbKickOut:9540 · tickMsBeam:9550 · TURBO_EVERY:9603 · TURBO_MS:9604 · TURBO_MUL:9605 · TURBO_N:9606
TURBO_TRACK:9607 · resetTurbo:9609 · turboPick:9614 · turboBegin:9621 · tickTurbo:9633 · fit:9644
tick:9650 · frame:9658 · build:9722 · start:9803 · exitWorld:9929

## js/lobby.js (52 บรรทัด · 3 รายการ)
PANEL_TITLES:9 · openPanel:19 · closePanel:29

## js/lobby3d.js (780 บรรทัด · 0 รายการ)

## js/main.js (428 บรรทัด · 6 รายการ)
syncMusicBtn:110 · showQuizBackPay:146 · showGiantRefund:191 · showTicketRefund:232 · fitQbp:272 · bootGame:286

## js/moto3d.js (2,776 บรรทัด · 143 รายการ)
### 🗂️ สารบัญโซน js/moto3d.js (Read/Edit เฉพาะช่วง)
- 91-296 🚗🏙️ รอบ 785: ยกการขับจาก "โลกขับรถเมืองกำแพงเพชร" มาทั้งชุด (เฉพาะ vehicle==='car')
- 297-514 DOM เครื่องเกมพกพา (สร้างครั้งเดียว · CSS ฉีดเอง ไม่แตะ style.css)
- 515-544 🚗🏙️ รอบ 785: ห้องคนขับ + ปุ่มบังคับชุดโลกเมือง (โผล่เฉพาะ .car — โหมดมอไซค์ไม่เห็นอะไรเลย)
- 545-770 🪞📷 รอบ 810: กระจกมองหลัง+ข้าง (เฉพาะโหมดรถยนต์ในห้องคนขับ) — ภาพจริงจากกล้อง 3D ตัวที่ 2/3/4
- 771-867 🚗🏙️ รอบ 785: ห้องคนขับ (หน้าปัด/พวงมาลัย/เข็มเกจ) + ปุ่มเกียร์ — เฉพาะโหมดรถยนต์
- 868-896 🪞📷 รอบ 810: กระจกมองหลัง/ข้าง — เรนเดอร์ฉากเดิมซ้ำด้วยกล้องหันหลัง/เฉียงข้าง แล้วยัดลงแถบบนจอ (scissor)
- 897-964 🎵📻 รอบ 810: วิทยุในรถ — จอ head-unit (visualizer + แผงเลือกเพลง) พอร์ตจาก adventure3d.js ทั้งชุด
- 965-1205 ถนนจากแผนที่จริง → geometry + ตารางแฮชชนถนน
- 1206-1545 ฉาก: พื้น/โรงเรียน/ป้ายหมู่บ้าน/ต้นไม้/เมฆ/บ้านหมู่บ้าน
- 1546-1603 🐕 รอบ 312: หมาวิ่งตัดถนน — โผล่ข้างถนนข้างหน้ารถ วิ่งตัดผ่านเร็ว · ชน = ปรับ 100 เหรียญ (รอบ 643: ลดจาก 500)
- 1604-1737 🪙 รอบ 317: เหรียญบนถนน — pool ลอยเหนือเลนซ้าย รีไซเคิลรอบผู้เล่นตลอด
- 1738-1770 🏍️🚗 รอบ 317: โมเดลยานพาหนะ 3D (ใช้ทั้งรถเราเองโหมด car และรถ/มอไซค์ของเพื่อน)
- 1771-1867 🚗 รอบ 394: โมเดลรถจริง img/models/car_01.glb ในแผนที่บ้านโพธิ์สวัสดิ์
- 1868-2095 🧑‍🤝‍🧑 รอบ 317: เพื่อนในแผนที่เดียวกัน (/world/moto/<uid>)
- 2096-2137 🏟️👥 รอบ 640: งบวาดตัวเพื่อน (ใช้ NetRoom.drawBudget ร่วมกับโลกอื่น)
- 2138-2312 คำศัพท์ + ตัวอักษรบนถนน
- 2313-2626 สร้างโลกครั้งเดียว + ลูปเกม
- 2627-2776 เข้า/ออกโลก
### รายการ js/moto3d.js
REWARD:7 · ACCEL:8 · DASH_LEN:9 · DOG_HIT_COIN:10 · FEAT_SP:12 · DECAL_N:13
GRAV:14 · SUSP_K:15 · ROAD_WIDE:16 · EDGE_M:17 · ROAD_TEX_S:18 · POST_N:19
LEAN_MAX:20 · COLLECT_R:21 · SPAWN_MIN:22 · SCATTER_MS:23 · LETTER_COPIES:24 · BUCKET:25
TILE_COLORS:26 · LETTER_COIN:28 · COIN_VAL:32 · COIN_GAP:33 · COIN_SPIN_SPD:35 · COIN_TIERS:38
EMERALD_TIER:45 · HARD_LAND:46 · COIN_CURVE_RAD:47 · NET_SEND_MS:49 · PEER_COLORS:50 · CHAT_MS:52
CHAT_PRESETS:53 · CAR_EYE:102 · CAR_ACCEL:103 · CAR_VMAX:104 · CAR_WB:105 · MIRROR_REAR:115
RADIO_RECT:120 · CAR_RADIO_RECT:121 · carRadioRect:127 · sndKick:235 · ENG_FILES:245 · CSS:300
buildDom:617 · loadCarDash:776 · loadCarWheel:788 · setGear:798 · setCam3:804 · syncGearUi:811
carDial:820 · drawCarGauge:850 · mirrorPass:873 · drawCarMirrors:885 · radioLayout:901 · radioSetHint:925
renderRadioList:931 · radioToggleList:941 · drawRadioViz:946 · segKey:968 · smoothPts:971 · featKey:987
addFeat:988 · genFeatures:993 · terrainAt:1012 · roadGroundY:1025 · decalTex:1033 · makeDecals:1052
decalTick:1061 · buildRoads:1078 · distToSeg:1174 · roadInfo:1179 · onRoad:1185 · randomRoadPoint:1186
TXT_SPR_H:1211 · makeTextSprite:1212 · letterTexture:1227 · woodTileMat:1242 · muralTexture:1253 · buildSchool:1265
buildScenery:1411 · scatterTrees:1490 · postTick:1510 · scatterClouds:1537 · makeDog:1549 · spawnDog:1564
dogHit:1574 · dogTick:1590 · coinTexture:1608 · makeCoins:1619 · loadCoinImg:1625 · addCoin:1637
clearCoins:1645 · addFreeCoin:1649 · coinTierAt:1657 · coinFx:1667 · grabCoin:1676 · coinTick:1693
scatterCoinTick:1709 · placeSpecialCoin:1727 · makeVehicle:1742 · mCarSplitWheel:1779 · mCarEnsure:1805 · mCarMat:1822
mCarBuild:1835 · mCarCode:1862 · netReady:1874 · netJoin:1880 · netSend:1893 · sendChat:1907
showPeerBubble:1917 · removePeerBubble:1924 · BOARD_MS:1937 · renderBoard:1939 · peerColor:1990 · buildPeer:1994
onPeer:2018 · dropPeer:2061 · netLeave:2068 · peerTick:2073 · PEER_DRAW_MAX:2101 · drawnPeers:2102
drawSlotFree:2103 · showPeerAgain:2104 · hidePeer:2111 · tickDrawBudget:2116 · spawnSlot:2124 · pickWord:2141
spawnLetters:2151 · renderWordHud:2169 · WORD_MIN_K:2180 · fitWord:2181 · collectTick:2208 · completeWord:2232
relocTick:2257 · gpsTick:2272 · miniTick:2281 · build:2316 · applyVehicleUi:2353 · fit:2382
tick:2392 · carDrive:2402 · frame:2451 · start:2630 · exitWorld:2703

## js/music.js (205 บรรทัด · 0 รายการ)

## js/netroom.js (807 บรรทัด · 19 รายการ)
CFG:41 · roomsAllowed:63 · HOT_KEYS:71 · COLD_KEYS:72 · HOT_BACK:73 · splitPayload:77
mergeBack:88 · metUids:100 · AIM_TTL_MS:119 · aimAt:121 · aimGet:125 · aimClear:129
MAPS3D:135 · whereFriends:136 · dbOf:160 · envReady:161 · isDenied:164 · create:176
drawBudget:780

## js/online.js (2,050 บรรทัด · 110 รายการ)
### 🗂️ สารบัญโซน js/online.js (Read/Edit เฉพาะช่วง)
- 2-229 ENGINE: ระบบออนไลน์จริงผ่าน Firebase Realtime Database
- 230-325 ระบบเพื่อน (ข้อ 0.3): รหัสเพื่อน + ค้นหา + ส่ง/รับคำขอ
- 326-515 ระบบแชทกับเพื่อน (ข้อ 0.4)
- 516-687 ระบบส่งของขวัญ (ข้อ 0.5)
- 688-804 🏪 ตลาดออนไลน์จริง (item 2 backlog): ซื้อ-ขายสินค้าที่เพื่อน "ผลิตเอง" ข้ามผู้เล่น
- 805-869 คำเชิญเล่นโลก 3D ด้วยกัน — /tinv/<toUid>/<fromUid> = {map,n,ts}
- 870-1066 📰 Follow + Feed กิจกรรม (รอบ 155) · 🌍 หน้า Feed ทุกคน + ไลก์/คอมเมนต์ (รอบ 639)
- 1067-1074 🌍 หน้า Feed ทุกคน + ไลก์/คอมเมนต์ (รอบ 639)
- 1075-1217 📰 รอบ 701 — ฟีดล็อบบี้ทีละโพสต์ + รีแอ็กชัน + แจ้งเตือน (ต่อยอดรอบ 639)
- 1218-1450 🔔📥 รอบ 976 — เก็บแจ้งเตือนไลก์/คอมเมนต์ลง DB โซนใหม่ /gnotif/<uid>
- 1451-2050 📞 โทรหาเพื่อน — Voice call / Video call แบบ LINE (รอบ 625 · กลุ่ม 3 คนรอบ 631)
### รายการ js/online.js
ONLINE_STALE_MS:72 · ONLINE_BEAT_MS:73 · LEADERBOARD_SIZE:74 · LEADERBOARD_QUERY_SIZE:75 · onlineDisplayName:79 · onlineActivity:87
ensureOnlineId:107 · onlineKey:117 · onlinePushPresence:122 · onlinePushScore:132 · fetchPlayerStats:180 · onlineRerender:202
notifyFriendBadges:214 · FRIEND_ALPHA:240 · friendCode:241 · friendSearch:253 · friendRequest:277 · friendAccept:288
friendDecline:300 · friendsHeal:310 · CHAT_MAX_LEN:334 · CHAT_KEEP:335 · chatPairId:337 · chatRef:340
chatListen:346 · chatSend:362 · chatDeleteMsg:378 · TYPING_TTL:386 · typingRef:388 · chatSetTyping:389
chatClearTyping:399 · chatWatchTyping:407 · chatThemeRef:425 · chatSetTheme:426 · chatWatchTheme:431 · chatPrune:439
chatSeenTs:456 · chatMarkSeen:462 · chatUnreadCount:474 · chatWatchSync:477 · GIFT_EXPIRE_MS:527 · giftSend:530
greetSend:548 · giftAccept:562 · giftDecline:566 · giftInWatch:572 · giftReclaim:603 · giftOutWatchSync:613
giftOutRebuild:668 · salesWatch:698 · salesRerender:706 · sellInc:710 · marketWatch:718 · marketList:751
marketUnlist:759 · marketBuy:768 · marketSoldWatch:781 · tinvSend:810 · tinvClear:817 · tinvPartyTick:825
TINV_WORLD_LABEL:847 · tinvWatch:851 · FEED_MAX:878 · feedEvent:881 · feedPrune:893 · feedPurgeCat:904
feedPushAssets:915 · petDescriptor:933 · feedPushPets:939 · fetchPlayerPets:953 · followSet:969 · followUnset:980
feedRebuild:987 · feedWatchSync:999 · fetchPlayerFeed:1026 · fetchPlayerAssets:1039 · fetchFollowers:1058 · GFEED_READ:1084
GFEED_KEEP_ME:1085 · gfeedPush:1088 · gfeedPrune:1102 · gfeedParse:1115 · gfeedWatchStart:1144 · gfeedWatchStop:1171
gfeedNotifDiff:1179 · gfeedNotifPush:1214 · GNOTIF_KEEP:1242 · GNOTIF_QUIET:1244 · gnotifKeyOf:1247 · gnotifSend:1254
gnotifAdd:1267 · gnotifRecount:1287 · gnotifMarkSeen:1292 · gnotifWatchStart:1303 · gnotifListen:1312 · gnotifWatchStop:1330
gnotifPrune:1335 · uidDisplayName:1348 · gfeedRebuild:1359 · gfeedToggleLike:1376 · gfeedSetReaction:1381 · gfeedToggleCommentLike:1397
gnotifTellComment:1415 · gfeedAddComment:1427 · CALL_RTC_CFG:1475 · CALL_RING_MS:1476 · CALL_MAX_MS:1477 · CALL_MAX_PEERS:1478
onlineStart:1894 · onlineLoadSDK:2025

## js/petbehavior.js (182 บรรทัด · 0 รายการ)

## js/photo.js (361 บรรทัด · 25 รายการ)
PHOTO_LS_KEY:12 · PHOTO_MAX:13 · PHOTO_PREFIX:14 · PHOTO_SIZES:15 · PHOTO_QS:16 · PHOTO_ZMAX:17
photoValid:25 · photoOnline:28 · photoGet:31 · photoHas:32 · photoIsMine:33 · photoOf:36
photoFetch:44 · photoAfterChange:61 · photoPush:65 · photoVerify:83 · photoSaveUrl:93 · photoRemove:99
photoPullMine:106 · photoBlkSrc:122 · photoMiniHTML:129 · openPhotoMenu:137 · photoLoadImgEl:203 · photoLoadFile:211
openPhotoCrop:224

## js/picdict.js (1,102 บรรทัด · 0 รายการ)

## js/picmatch.js (592 บรรทัด · 0 รายการ)

## js/picquiz_online.js (603 บรรทัด · 0 รายการ)

## js/pmaward.js (28 บรรทัด · 0 รายการ)

## js/sgaward.js (28 บรรทัด · 0 รายการ)

## js/shootword.js (1,085 บรรทัด · 0 รายการ)

## js/state.js (1,214 บรรทัด · 94 รายการ)
### 🗂️ สารบัญโซน js/state.js (Read/Edit เฉพาะช่วง)
- 2-219 STATE + LocalStorage + กติกากลางของเกม
- 220-655 👍 รอบ 701: รีแอ็กชันฟีด (กดค้างปุ่มถูกใจแล้วเลือกได้เหมือน Facebook)
- 656-711 Daily Quest (item 3 backlog): ภารกิจรายวัน 3 อย่าง สุ่มตามวันที่
- 712-785 มูลค่าทรัพย์สินสุทธิ (net worth) — ฐานของระบบแรงค์
- 786-835 🚫🍽️ สัตว์ป่วยเพราะหิว = ซื้อของกินไม่ได้ (รอบ 952)
- 836-929 เครื่องยนต์บิลรายเดือน (กลาง — ค่าบำรุงบ้านตอนนี้ / ค่าไฟ-น้ำ-เน็ต เสียบเพิ่มได้)
- 930-1054 🍖 เงินค่าอาหารสัตว์รายเดือน — ทุกวันที่ 1 ของเดือน จ่ายตามจำนวนสัตว์ที่เลี้ยงอยู่
- 1055-1214 โรงงานผลิตสินค้า: จ่ายค่าผลิตด้วย "แต้มคำศัพท์"
### รายการ js/state.js
STORAGE_KEY:6 · QUIZ_PASS_REWARD:11 · CURE_COST:13 · HUNGRY_SICK_MS:14 · MEAL_HOUR:16 · MEAL_FULL:17
SLEEP_FROM_HOUR:18 · SLEEP_SICK_HOUR:19 · WAKE_HOUR:20 · DINNER_COST:21 · TOXIN_FULL:23 · DETOX_COST:24
FOODQUIZ_Q:26 · FOODQUIZ_COIN:27 · FOODQUIZ_BONUS:28 · FOODQUIZ_MAX_PLAYS:29 · SHAPE_JUNK_MEALS:31 · SHAPE_CLEAN_MEALS:32
SHAPE_MISS_MEALS:33 · SHAPE_EXP_BONUS:34 · HEAT_SICK_MS:35 · THIRST_SICK_MS:36 · DEFAULT_STATE:38 · FEED_CATS:212
FEED_REACTIONS:226 · feedRx:234 · FEED_QUICK_CM:236 · SLOT_MS:248 · currentSlotStart:249 · nextSlotStart:255
mealDayKey:257 · nightKeyOf:259 · isNightNow:267 · newPet:272 · loadState:297 · saveState:616
activePet:623 · petStage:624 · isAdult:629 · abilityOn:630 · hasPetType:631 · todayStr:634
dailyTick:638 · addCoins:641 · QUEST_POOL:661 · QUEST_PER_DAY:670 · questsToday:671 · questTick:678
questEvent:682 · assetValue:718 · netWorth:738 · assetCount:740 · refreshRank:757 · heatProtected:773
rainProtected:777 · petHungry:780 · petCanEat:784 · hungerSickLock:792 · hungerSickMsg:800 · petShapeOf:808
updatePetShape:814 · shapeMealDone:821 · heatPct:831 · ymStr:840 · billOutstanding:844 · UTILITIES:851
HOME_UTILITIES:857 · homeDecayed:859 · billTick:862 · PET_FOOD_PER_PET:934 · petFoodTick:935 · myCar:961
carLoanDue:966 · carLoanOverdue:971 · carLoanPayable:976 · carLoanPay:983 · compTick:996 · ONLINE_RATE:1010
onlineEarnActive:1011 · onlineEarnTick:1015 · onlineEarnFlush:1026 · marketTick:1036 · addCraft:1060 · ORDER_MAX:1079
ORDER_LIFE_MS:1080 · ORDER_GAP_MIN_MS:1081 · ORDER_GAP_SPAN_MS:1082 · ORDER_TIER_WEIGHT:1083 · newOrder:1084 · orderTick:1097
careTick:1105 · expNeed:1185 · addExp:1190 · addRP:1210

## js/thaitime.js (52 บรรทัด · 13 รายการ)
TH_TZ_MIN:22 · TH_DAY_MS:23 · thShift:28 · thMs:30 · thDate:31 · thHour:32
thHourF:33 · thDayKey:34 · thDayStart:35 · thAtHour:39 · thTs:40 · TH_TZ_OPT:45
thLocaleOpt:46

## js/tpaward.js (41 บรรทัด · 0 รายการ)

## js/typing.js (370 บรรทัด · 0 รายการ)

## js/ui.js (9,117 บรรทัด · 376 รายการ)
### 🗂️ สารบัญโซน js/ui.js (Read/Edit เฉพาะช่วง)
- 2-77 UI: Dashboard / ร้านค้า / ที่พัก / ร้านสัตว์เลี้ยง / แรงค์ / สถิติ
- 78-344 🎬 เวทีน้องน่ารัก (Cute Pet Show) — รอบ 604 (ผู้ใช้สั่ง 26 ก.ค. 2026)
- 345-638 🆕 New Word (รอบ 116): คำศัพท์ใหม่ 1 คำ/การ login ตามระดับชั้น
- 639-663 นาฬิกาใต้ชื่อผู้เล่น (วัน · วันที่ · เวลา อัปเดตทุกวินาที)
- 664-703 ข้าวเย็นของผู้เล่น (กิจกรรมเสริม)
- 704-735 แถบฝนประจำวัน: นับถอยหลังถึง 19:00 ทุกวัน (ฝนตก 1 ชม.)
- 736-788 เอฟเฟกต์ฝนเต็มจอ (รอบยี่สิบ): ฝนตกจริง (19:00-20:00) + ไม่มีบ้านสภาพดี
- 789-809 การ์ด "คนที่กำลังทำการบ้านไปพร้อมๆ กับเรา"
- 810-864 รอบ 149: กล่อง aside ขวาเลื่อนวนอัตโนมัติ (ล่าง→บน) ไม่มี scrollbar
- 865-1256 Daily Quest (item 3): การ์ดภารกิจวันนี้ใน aside ขวา
- 1257-1349 รอบ 153: เมนูลัดแตะแถวเพื่อนออนไลน์ในกล่อง aside
- 1350-1988 การ์ด Leaderboard — สลับแท็บในการ์ดเดียว (ประหยัดพื้นที่):
- 1989-2353 การ์ดข้อมูลผู้เล่น 👤 — คลิกชื่อในการ์ดเพื่อน/กระดาน แล้วโชว์
- 2354-2603 แผงเพื่อน 👥 (ข้อ 0.3): รหัสเพื่อน + ค้นหา + คำขอ + รายชื่อเพื่อน
- 2604-2699 🌍 เพื่อนอยู่โลก 3D ไหน + ปุ่ม "ตามเข้าไป" (รอบ 642)
- 2700-2738 แชทกับเพื่อน (ข้อ 0.4) — กล่องแชทลอยกลางจอ + แผง emoji
- 2739-3140 รอบ 179: หน้ารวมข้อความ (inbox แบบ Messenger — ธีมกระจกฟ้า sci-fi ของเกม)
- 3141-3501 ระบบส่งของขวัญ (ข้อ 0.5) — ห้องของขวัญ + กล่องเลือกส่ง + ฉากเปิด
- 3502-3594 RANK CARD + ฉากเลื่อนแรงค์
- 3595-3597 PET DASHBOARD
- 3598-3667 📰 รอบ 155: overlay ข้อมูลน้อง & การดูแล + ฟีดกิจกรรมเพื่อน
- 3668-4289 📰 รอบ 701 — ฟีดล็อบบี้ "ทีละโพสต์" แบบ Facebook (ผู้ใช้สั่ง 29 ก.ค. 2026)
- 4290-4484 🌍 รอบ 639: หน้า Feed เต็มจอ — ทุกคน (ไม่ใช่แค่ follow) + ไลก์/คอมเมนต์
- 4485-5162 📖 Dictionary ค้นหาคำศัพท์ (รอบ 254 ผู้ใช้สั่ง 16 ก.ค. 2026)
- 5163-5206 การนอน (คิว 7725691507 ข้อ 1)
- 5207-5629 ให้อาหาร (ระบบมื้อเย็น 18:00 + ความอิ่มสะสม — ข้อ 2+3)
- 5630-5748 🛡️ ควิซอาหารปลอดภัย (ต่อยอดข้อ 5.1)
- 5749-5834 🎀 ห้องแต่งตัวสัตว์เลี้ยง (รอบ 635: แยกออกจาก "ร้านค้า" เดิม —
- 5835-6022 ที่พัก (หลบแดด/หลบฝน) + เครื่องปรับอากาศ
- 6023-6140 บิลสาธารณูปโภค (ค่าไฟ/ค่าน้ำ — เครื่องยนต์อยู่ใน state.js: UTILITIES/billTick)
- 6141-6223 การ์ดมือถือ (ข้อ 7): ซื้อ 10,000 ขายคืน 6,000
- 6224-6234 การ์ดคอมพิวเตอร์ (ข้อ 11): ซื้อ 50,000 ขายคืน 30,000
- 6235-6279 item 8: โบนัสออนไลน์ +0.01 เหรียญ/วิ ฟรีทุกคนที่เปิดเกมออนไลน์อยู่
- 6280-6536 💻 รอบ 706 (ผู้ใช้สั่ง 29 ก.ค. 2026): ช่องรายได้คอมพิวเตอร์บนแถบบนล็อบบี้
- 6537-6878 🌀🔤 รอบ 1045 — Vocab Arena (โลกผจญภัยฉบับใหม่)
- 6879-6897 🌍 ปุ่มลัดเข้าโลก 3D ในรางเมนูซ้าย (ผู้ใช้สั่ง 9 ก.ค. 2026)
- 6898-7029 🔒 รอบ 1070: โลกที่ยังไม่เปิดสาธารณะ — เปิดให้บัญชีทดสอบ 2 ชื่อเท่านั้น
- 7030-7193 🧭 ป้ายบอกทางของรางเมนูซ้าย (รอบ 601 · ผู้ใช้สั่ง 26 ก.ค. 2026)
- 7194-7363 การ์ดสวนผลไม้ (ข้อ 12): ซื้อต้นไม้ปลูกได้ไม่จำกัด แต่ละต้นออกผล
- 7364-7373 โรงงานผลิตสินค้า 🏭 + ตลาดขายต่อ (แนวคิดใหม่ 5 ก.ค. 2026)
- 7374-7396 โรงงานผลิต (แผง 🏭) — แยกออกจากตลาด (ผู้ใช้สั่ง 6 ก.ค. 2026)
- 7397-7549 ตลาดขายสินค้า (แผง 🏪) — แยกออกจากโรงงาน
- 7550-8474 🚗 รอบ 131: หมวดยานพาหนะ — โชว์รูมรถ 10 คัน (แคตตาล็อก 5 ช่อง/แถว)
- 8475-8535 ร้านสัตว์เลี้ยง (ซื้อเพิ่มได้ ไม่ลบตัวเดิม)
- 8536-8572 เลเวลอัพ (รายตัว)
- 8573-8678 สถิติผลการเรียนรู้
- 8679-8716 item 4: การ์ดสรุปส่งครู — ใบเดียวจบ ชื่อ/วัน-เวลา/เหรียญวันนี้/แรงค์/สอบล่าสุด
- 8717-9117 📞 หน้าจอโทรหาเพื่อน — สายเสียง (รอบ 625 · กลุ่ม 3 คน + ปิดวิดีโอ รอบ 631)
### รายการ js/ui.js
startHTML:10 · PET_ANIM:30 · petAnimHTML:35 · petVisualHTML:50 · PET_SHOW:91 · PET_SHOW_STAGE:96
PET_SHOW_H:99 · petShowBgHTML:102 · petClipHint:145 · __clipReady:157 · PET_SHOW_SEQ:165 · petShowSeqHTML:180
petShowHTML:199 · PROF_AV_MAX:265 · lobbyBlk:266 · caretakerFigureHTML:273 · footAlign:283 · heroRankBgHTML:317
NEW_WORD_MS:351 · newWordNext:357 · renderNewWord:368 · NW_GAP:406 · alignNewWord:407 · startNewWordTimer:424
nwCountdownTick:441 · PAT_REMIND_HOUR:457 · patRemindTick:458 · applyPatRemindGlow:479 · NEW_WORD_COIN:494 · NW_DAILY_GOAL:495
NW_DAILY_BONUS:496 · newWordReward:497 · nwDailyTick:520 · coinFlyFx:539 · nwDailyBarHTML:572 · showNewWordPopup:583
renamePet:610 · mealLabel:627 · fmtMins:633 · renderClock:642 · selfName:668 · selfNameHTML:673
dinnerDue:674 · renderDinnerChip:679 · dinnerClick:687 · renderRainBar:707 · rainFxTick:740 · RAIN_DROP_IMGS:763
rainFxDrop:764 · selfPronoun:796 · selfTag:801 · idTag:805 · SIDE_SCROLL_SPEED:815 · SIDE_SCROLL_RESUME:816
initSideScroll:819 · sideScrollTick:847 · QUEST_FLASH_HOLD:871 · QUEST_SLIDE_MS:878 · QUEST_RESUME_MS:879 · questGo:882
SIDE_TALL_MIN:894 · sideIsTall:895 · qBigCardHTML:900 · qDeckGo:920 · qDeckTick:940 · renderQuestCard:961
sideFlashRows:1021 · FRIEND_FLASH_GRACE:1039 · ONLINE_FLIP_MS:1047 · ONLINE_FLIP_RESUME:1048 · ONLINE_SWIPE_STEP:1049 · ONLINE_ROW_H:1056
onPerPage:1059 · onChunk:1065 · ONLINE_GAP_MAX:1075 · onPageSpread:1076 · onPageDraw:1085 · onPageFlip:1096
bindOnlinePager:1107 · renderOnlineCard:1142 · bindInviteCards:1264 · bindFriendQuickMenu:1284 · openFriendQuickMenu:1294 · LB_TABS:1357
LB_WS_TOP:1358 · LB_PM_TOP:1359 · LB_TP_TOP:1360 · LB_BB_TOP:1361 · LB_SG_TOP:1362 · bindLbTabs:1364
updateRankRailBadge:1410 · rankUpCheck:1429 · rankUpSound:1457 · renderLeaderboardCard:1468 · bindLbGroupOpen:1498 · lbRankRows:1510
LB_BCAT_TOP:1573 · lbBadgeSections:1578 · lbDemoRows:1604 · lbChar:1626 · lbfAwardBarHtml:1636 · openLeaderboardFull:1651
BLK_PAD:1785 · BLK_PAD_NEW:1790 · BLK_TOP_FIX:1791 · seatPodChars:1792 · lbCoinHtml:1804 · lbBadgeHtml:1820
lbBossHtml:1846 · lbWordSearchHtml:1869 · lbTypingHtml:1905 · lbBubbleHtml:1937 · lbShootHtml:1959 · bindPlayerClicks:1994
showPlayerCard:2004 · petDescImg:2283 · openImgLightbox:2296 · openPetPeek:2316 · updateBillBadges:2360 · setBadge:2370
tinvPendingCount:2386 · updateSettingsBadge:2395 · openAttentionSummary:2410 · updateFriendBadge:2467 · renderFriendPanel:2477 · friendDoSearch:2525
refreshFriendData:2549 · FRW_TTL_MS:2614 · FRW_MIN_GAP:2615 · frwWorldOf:2619 · frwPanelOpen:2622 · frwScan:2627
frwPaint:2649 · frwPaintHint:2670 · frwFollow:2684 · CHAT_EMOJI_CATS:2705 · CHAT_THEMES:2727 · CHAT_SECRET_MS:2736
chatBadgeSync:2744 · ibTimeStr:2752 · IB_CALL_RE:2761 · ibCallInfo:2762 · openChatInbox:2767 · chatFitKeyboard:2937
openChat:2953 · giftImg:3144 · giftDateStr:3146 · GREETS:3154 · GREET_EXP:3162 · greetInfo:3163
openGreetPicker:3167 · giftItemPic:3211 · foodGiftBlocked:3221 · giftItemName:3227 · updateGiftBadge:3233 · renderGiftPanel:3242
acceptGift:3300 · declineGift:3323 · showGreetReveal:3332 · showGiftReveal:3359 · openGiftPicker:3385 · confirmSendGift:3453
doSendGift:3479 · rankBadgeHTML:3505 · renderRankCard:3510 · renderRankTab:3544 · showRankUp:3572 · bindPetPlateButtons:3607
openPetInfoOverlay:3637 · feedAgo:3660 · FEED_DECK_MAX:3680 · FEED_SLIDE_MS:3681 · FEED_RESUME_MS:3682 · feedPostImgIndex:3687
feedPostImg:3698 · feedPostByKey:3707 · feedCanReact:3710 · fpStatsHTML:3715 · fpNameBadgesHTML:3731 · fpostHTML:3735
renderFeedCard:3770 · feedDeckGo:3808 · feedDeckTick:3828 · renderFeedBell:3850 · FNT_JUMP:3859 · fntGiftName:3865
feedNotifText:3869 · feedNotifGo:3884 · feedNotifArrived:3899 · openFeedNotif:3906 · closeRxPicker:3961 · openRxPicker:3965
feedFlyWord:3985 · feedPickRx:3996 · FCM_REP_SHOW:4011 · FCM_FOCUS_POST:4012 · openFeedComments:4014 · closeFeedComments:4036
fcmRowHTML:4045 · showCommentLikers:4068 · fcmTreeHTML:4090 · renderFeedComments:4115 · bindFeedPostEvents:4243 · openFeedBoard:4296
renderFeedBoardLive:4317 · renderFeedBoard:4335 · stageColLeft:4354 · alignPetTabs:4363 · alignFeedPlate:4375 · alignProfilePlate:4391
COIN_K_MIN:4409 · alignCoinBlock:4410 · alignStageLeft:4438 · laneModeOn:4450 · alignStageCols:4463 · watchStageCols:4477
dictRecordLookup:4496 · DICT_FILE_COUNT:4507 · loadDict:4508 · dictSearch:4523 · dictTapWords:4538 · dictEntryHTML:4542
openDictOverlay:4553 · renderDashboard:4637 · sleepBtnHTML:5168 · sleepHintHTML:5175 · sleepAllPets:5186 · wakeAllPets:5199
feedPet:5210 · openFoodMenu:5224 · feedWith:5315 · AVATAR_UI:5345 · playerAvatarHTML:5349 · SHAPE_UI:5357
showFeedResult:5366 · curePet:5407 · heartsFx:5437 · PAT_HOLD_MS:5460 · PAT_EXP:5461 · bindPetTap:5462
petBounce:5480 · petMood:5486 · shortPatPet:5493 · longPatPet:5501 · patCalendarHTML:5521 · patDayKey:5555
patStreakNow:5559 · patStreakTick:5564 · cureCelebrateFx:5589 · railCureClick:5600 · detoxPet:5612 · openFoodQuiz:5635
closeDressUpBoard:5754 · openDressUpBoard:5758 · renderShop:5775 · homeVisualHTML:5838 · showHomeRuined:5852 · showCutNotice:5873
renderHomeCard:5891 · payMaint:5975 · trashBillUI:5991 · payTrash:6008 · UTILITY_UI:6027 · utilityBillUI:6076
payUtility:6101 · buyUtilityFix:6127 · renderPhoneCard:6145 · buyPhone:6185 · sellPhone:6207 · compLiveTotal:6228
onlineLiveTotal:6239 · syncCoinHeader:6246 · flashPillGain:6251 · renderOnlineEarnPill:6260 · renderCompEarnPill:6285 · openPillInfo:6318
renderComputerCard:6401 · buyComputer:6436 · sellComputer:6459 · soldCount:6480 · soldBadge:6481 · loadScriptOnce:6487
advBusyMsg:6512 · advResetLoad:6524 · loadAdv3d:6530 · loadVocabArena3d:6542 · enterAdventure3D:6546 · pickAdvMap:6568
enterHaunted3D:6603 · enterHeli3D:6625 · pickHeliMap:6651 · enterDrone3D:6687 · enterDrive3D:6706 · pickDriveMap:6744
enterMotoMapAsCar:6780 · enterSoccer3D:6799 · enterMoto3D:6818 · enterF1_3D:6840 · enterInvasion3D:6860 · WORLD3D:6886
WORLD3D_COMING_SOON:6902 · world3DComingSoon:6903 · gotoRobotShop:6906 · openHealDialog:6912 · world3DFail:6933 · railWorldClick:6964
openWorldEntryDialog:6982 · railScrollHint:7035 · railScrollTop:7043 · initRailScroll:7048 · renderRailWorlds:7068 · tinvNoticeHTML:7147
openTinvPicker:7155 · fruitCountdown:7199 · renderFarmCard:7211 · renderFarmClock:7286 · buyFruit:7302 · sellFruit:7322
sellAllFruit:7343 · collectImg:7372 · renderFactoryCard:7378 · renderMarketCard:7401 · updateWishBadge:7457 · openWishlistDialog:7468
bindStripArrows:7513 · renderMarketBrowse:7527 · carImg:7556 · renderVehicleShop:7557 · CS_CYCLE_MS:7608 · carInteriorImg:7609
carStatHtml:7611 · renderCarShowroom:7618 · csShowBig:7645 · csInit:7672 · RS_CYCLE_MS:7695 · robotImg:7696
renderRobotShop:7697 · rsShowBig:7719 · rsInit:7740 · buyRobot:7759 · enterMecha3D:7784 · pickMechaRobot:7811
pickDriveCar:7843 · openCarBuyDialog:7886 · buyCarInsurance:7947 · payCarLoanMonthly:7966 · payCarLoanFull:7978 · carDriveBlock:7997
gotoVehicleShop:8002 · gotoMyStock:8007 · showNeedCarDialog:8013 · craftDiscount:8025 · renderFactory:8028 · renderOrdersUI:8097
startProduce:8116 · buyCollectible:8144 · cancelProduce:8174 · deliverOrder:8188 · renderOrderClock:8205 · renderCollectMine:8215
openListDialog:8257 · cancelListing:8310 · buyMarketItem:8333 · showCollectReveal:8362 · buyAC:8400 · openHomeShop:8419
renderPetShop:8478 · showLevelUp:8539 · renderStats:8576 · showTeacherCard:8683 · CALL_REACT_EMOS:8727 · CALL_TALK_MIN:8730
CALL_TALK_HOLD:8731 · CALL_ORDER_GAP:8733 · CALL_TONES:8739 · startCall:9113

## js/util.js (1,270 บรรทัด · 51 รายการ)
### 🗂️ สารบัญโซน js/util.js (Read/Edit เฉพาะช่วง)
- 2-23 UTIL: เสียง / เอฟเฟกต์ / เครื่องมือทั่วไป
- 24-1239 🎖️ รอบ 643: สัญลักษณ์ระดับชั้น (ผู้ใช้สั่ง 28 ก.ค. 2026)
- 1240-1270 🖱️🚫 รอบ 833: กันกล่องดำ "To show your cursor, switch apps, reload the page…"
### รายการ js/util.js
shuffle:6 · fmtNum:15 · escapeHTML:19 · gradeSymbol:32 · gradeMark:47 · nameWithGrade:55
gradeMarkCanvas:61 · gradeOf:77 · seededRand:92 · fmtThaiDT:104 · fmtThaiDate:108 · IPHONE_LOBBY_VIEWPORT:118
fitIPhoneLobbyViewport:129 · showScreen:148 · TOAST_WARN_RE:159 · restackToasts:162 · clearWarnToasts:188 · toast:192
toastLink:219 · floatFx:237 · beep:248 · soundStatus:269 · PET_MOOD:385 · petVoiceSynth:392
sirenSynth:469 · playCashier:493 · cashierSynth:507 · keyTapSynth:540 · bubblePopSynth:578 · bubbleTapSynth:597
playSpark:608 · sparkSynth:622 · thunderFx:657 · wordAudioFile:725 · speakCutOff:734 · speakWord:738
speakLetter:777 · pickSpeakVoice:800 · speakWordTTS:811 · askNameDialog:838 · askConfirm:883 · alertBox:901
applyNoAnim:921 · BLK_VOCAB:928 · openSettings:976 · openHelp:1179 · openTeacherGuide:1205 · TAPGLOW_SEL:1229
TOUCH_INPUT_SEEN:1248 · mouseLockOK:1257 · lockMouse3D:1263

## js/vocabbook.js (207 บรรทัด · 14 รายการ)
VB_MAX:11 · VB_QUIZ_N:12 · VB_QUIZ_MIN:13 · vbGroup:16 · VB_GROUP_UI:21 · vbRecord:24
vbSeen:49 · vbStats:62 · vbList:70 · vbReviewCat:81 · vbStartReview:95 · openVocabBook:106
vbRender:148 · vbCardHTML:194

## js/wordsearch.js (455 บรรทัด · 0 รายการ)

## js/wsaward.js (32 บรรทัด · 0 รายการ)

## css/arena3d.css (201 บรรทัด · 62 selector)
#va-root:5,7,9 · #va-canvas:8 · .va-vignette:11 · .va-scan:15 · .va-top:18 · .va-glass:20
.va-exit:23,26 · .va-player-card:27,29 · .va-player-name:30 · .va-online:31 · .va-word-card:32,34,36 · .va-word-th:37
.va-word-en:38 · .va-word-slots:40,41,43 · .va-coins:44 · .va-shop-btn:46 · .va-energy:48,54 · .va-energy-label:50
.va-energy-track:51 · .va-energy-fill:52 · .va-energy-power:55 · .va-bag:57 · .va-bag-label:59 · .va-bag-list:60
.va-bag-letter:61 · .va-party:68,72,73 · .va-party-find:70 · .va-party-list:74,76 · .va-boss:78,80 · .va-boss-head:81,82
.va-boss-track:83 · .va-boss-fill:84 · .va-boss-word:85 · .va-downed:87,90,91 · .va-revive:92,94,95 · .va-skill:96,117,120,121(+9)
.va-hp:98,100,103 · .va-hp-track:101 · .va-hp-fill:102 · .va-stick:105,109,110 · .va-stick-knob:111 · .va-skills:115
.va-feed:136 · .va-feed-line:138,140 · .va-pop:142,144,145,148 · .va-modal:150,152 · .va-panel:153 · .va-panel-head:156
.va-panel-title:157 · .va-panel-coins:158 · .va-store-grid:160 · .va-store-item:161,163,164 · .va-store-ico:165 · .va-store-name:167
.va-store-price:168 · .va-intro-panel:169 · .va-intro-logo:170 · .va-intro-sub:172 · .va-intro-steps:173 · .va-intro-step:174
.va-start:176,178 · .va-portrait:180

## css/bubble.css (54 บรรทัด · 23 selector)
#bb-overlay:4 · #bb-board:5,9,10 · .no-anim:11,44 · .bb-head:12 · .bb-title:13 · .bb-stat:14,15
.bb-score:16,17 · .bb-close:18,19 · .bb-snd:20,23 · .bb-snd-track:21 · .bb-snd-thumb:22 · .bb-prompt:24
.bb-word:25,28 · .bb-ch:26,27 · .bb-thai:29 · .bb-hint:30 · .bb-stage:31 · .bb-bubble:32,36,37,38(+2)
.bb-tools:45 · .bb-tool:46,47 · .bb-fx:48 · .bb-coinpop:49,50 · .bb-empty:52

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

## css/lobby.css (5,629 บรรทัด · 786 selector)
:root:6,5357 · html:15 · body:21,5321,5363 · *:41,42,43,44 · #app:47 · h1:49
.subtitle:50 · .shop-title:51 · #rotate-overlay:54 · .screen:76 · #screen-select:85,86,87,88(+5) · .egg-need:95
.petshop-topright:97 · .petshop-play-link:98,103 · #screen-login:117,142,143,148(+7) · .login-lux:127 · .login-crest:128 · .login-word:132
.login-rule:138,139,140 · .login-tag:141 · #screen-game:190,191,192,193(+7) · #screen-quiz:204,205,206,207(+6) · #quiz-choices:216,217 · .word-card:224
.quiz-choice:225,226,227 · .big-btn:230,231,232,233 · #screen-dashboard:238,1148,1156 · .lobby-top:252,887,888,889(+36) · .top-flex:253 · .profile-plate:254,258,808,3762(+12)
#rain-fx:263 · .rain-glass:267 · .glass-drop:268 · .rain-vignette:287 · .no-anim:294,456,469,530(+59) · .rail-btn:297,909,915,917(+21)
.rail-badge:298 · .fr-code-box:303 · .fr-code-label:307 · .fr-code-row:308 · .fr-code:309 · .fr-copy-btn:314,318,323,324
.fr-search-btn:319 · .fr-add-btn:320 · .fr-accept:321 · .fr-decline:322 · #fr-search-input:325 · #fr-search-result:329
.fr-found:330 · .fr-hint:334 · .fr-list-title:335 · .fr-row:336 · .fr-req:340 · .fr-row-name:342,346,5061
.fr-row-status:350 · .fr-req-btns:351 · .online-dot:352 · .fr-chat-btn:353,358,360 · .fr-unread:361 · .fr-call-btn:367,373
.chat-overlay:382,388,389 · .chat-box:390,693,700,707(+12) · .chat-head:402 · .chat-theme-btn:407,411 · .chat-secret-tg:412,413 · .cs-switch:414,415,420,421
.cs-slider:416,418 · .chat-secret-note:422 · .chat-theme-strip:425 · .chat-theme-sw:427,430,431,432(+1) · .chat-head-name:434,437 · .chat-head-ava:436
.chat-close:438 · .chat-msgs:442 · .chat-empty:446 · .chat-typing:448 · .ct-dots:450,451,453,454 · .chat-bubble:457,462,467
.chat-emoji:470 · .chat-emo:474,478 · .chat-input-row:479 · .chat-emoji-btn:483 · #chat-input:487 · .chat-send:491,496,497
.chat-call-btn:503,507 · .call-ring:510 · .cr-card:514 · .cr-kind:520 · .cr-av:521 · .cr-name:531
.cr-id:532 · .cr-btns:533 · .cr-btn:534,540,545 · .cr-no:541 · .cr-ok:542 · .cr-safe:546
.call-ov:549,555,577,594(+6) · .call-stage:561 · .ctile:562,573,574 · .ct-face:566 · .ct-me:572 · .ct-nm:587,591
.ct-sub:592 · .call-add:616 · .ca-head:623 · .ca-list:624 · .ca-row:625,629 · .ca-dot:630,631
.ca-nm:632,633 · .ca-go:634 · .ca-empty:635 · .ca-safe:636 · .ca-close:637 · .call-bar:641
.cb-btn:646,651,652 · .cb-end:653,654 · .call-emos:655 · .call-emo:660,661 · .call-fx:663 · .call-fx-emo:664
.pl-click:756,758,759 · .pl-overlay:760 · .pl-card:764,2829 · .pl-close:770 · .pl-head:774,2597,2600 · .pl-grade:779,5067,5068
.pl-body:780 · .pl-loading:781 · .pl-none:782 · .pl-me-tag:783 · .pl-blk-wrap:785 · .pl-blk:786
.pl-stat:787 · .pl-lbl:792 · .pl-val:793,794 · .pl-tip:795 · .chip-edit:801,806,807 · .rank-mini:813,819,820,821
.pass-photo:823,828 · .pet-tabs:830 · .dict-box:831,835,836,837(+1) · .dict-card:843,848,852,853(+2) · .dict-head:849,850 · .dict-trail:857,861
.dt-c:862,866,867 · .dt-sep:868 · .dict-today:869 · .di-w:871,872,873 · .dict-list:874 · .dict-item:875,879,880,881(+5)
.lobby-mid:895 · .rail-wrap:898,943,954,955 · .rail-scroll:900,937,941,942 · .lobby-rail:901,908 · .rail-nudge:944,952,953,956(+1) · .rail-worlds:963
.rail-div:964 · .lobby-stage:1008,1010,1026,1153(+13) · .newword-banner:1016,1023,1028,4427(+2) · .coin-fly:1039,1042 · .coin-plus:1048 · .nw-pop-coin:1063,1065,1066
.nw-pop-goal:1069,1070,1074,1078 · .nw-goal-head:1071,1073,1075 · .nw-goal-bar:1076 · .nw-goal-fill:1077 · .nw-pop-book:1079,1080 · .nw-tag:1101,4433,4455
.nw-word:1106,4437,4460,4553 · .nw-hint:1108,1109,4438,4462(+1) · .nw-coin:1111,1114,4439,4443 · .nw-countdown:1119,4444 · .nw-bar:1121,4463 · .nw-bar-fill:1123
.pet-stage:1126,3123 · .nw-box:1133,3132 · .nw-pop-word:1134 · .nw-speak:1135 · .nw-pop-phon:1136 · .nw-ipa:1137
.nw-pop-sent:1138 · .nw-pop-mean:1139 · .pet-tab:1140,1141,1142,3567 · .stage-hero:1163,1178,1186,1331(+25) · .hero-ground:1200,1320,1326 · .hero-rank-bg:1202,1205,1208,1212(+18)
#lobby3d-canvas:1225,1226 · .hero-scene:1230,1232,1239,1240(+8) · .caretaker-fig:1279 · .caretaker-img:1282 · .caretaker-emoji:1284 · .blk-rig:1291,1292,1293
.stage-plate:1353,1361,1372,1373(+23) · .plate-title:1367 · .lobby-side:1400,1436,1441,1444(+22) · .side-sec:1403,2248,3463,3740 · .side-label:1404,1409 · .side-label-row:1412,1413
.lb-tabs-out:1414,1415,1419 · .side-glass:1423,1430 · .side-card:1442,1553 · #quest-card:1454,1455,1483,1484(+6) · .q-bigcard:1460,1489 · .qb-top:1462
.qb-emoji:1463 · .qb-name:1465 · .qb-bar:1466,1467 · .qb-row:1469 · .qb-prog:1470 · .qb-reward:1471
.qb-go:1472,1476 · .q-dots:1477 · .q-dot:1478,1479,1480 · .q-bonus:1481 · .inv-card:1500,1502,1503 · .inv-btns:1504
.inv-go:1505,1507 · .inv-x:1508 · #online-card:1512,3471,3472,3473(+4) · .fq-overlay:1513 · .fq-box:1515,3277 · .fq-head:1519,1521
.fq-close:1522 · .fq-sec:1524 · .fq-worlds:1525 · .fq-world:1526,1528 · .fq-acts:1529 · .fq-act:1530,1533,1534
.lb-prize:1567 · .lb-coins:1570 · .lbf-cell:1571,2676,2679,2680(+3) · .lb-award-bar:1573,1579,1580 · .lb-award-go:1581 · .lbf-award:1583,1589,1590,1591
.pod-pz:1592 · .wsa-overlay:1595 · .wsa-box:1597 · .wsa-head:1602 · .wsa-title:1603 · .wsa-when:1604,1605
.wsa-close:1606,1609 · .wsa-cols:1610 · .wsa-col:1611 · .wsa-sec-h:1612,1613 · .wsa-msg:1614 · .wsa-msg-h:1617
.wsa-msg-b:1618,1619 · .wsa-msg-none:1620 · .wsa-rules:1622,1623 · .wsa-list:1624 · .wsa-row:1625,1627 · .wsa-r:1628
.wsa-n:1629 · .wsa-s:1630 · .wsa-p:1631 · .wsa-prizes:1632 · .wsa-pz:1633,1636 · .wsa-reveal-medal:1637
.lobby-bottom:1652,1655,1656,1658(+7) · .lobby-quiz-btn:1669 · .lobby-book-btn:1670,1671 · .lobby-play-btn:1673,1677 · .lobby-exam-btn:1679,1680,1682 · .panel-overlay:1687,1692,4568,4569(+8)
.panel-box:1693 · .panel-head:1700,1704 · .panel-close:1705,1710 · .panel-body:1711,1715,1716 · .panel-page:1713,1714 · .collect-sub:1720
.mkt-empty:1721 · .craft-box:1722 · .mkt-listing:1723 · .mkt-filter:1724,2068 · .hq-grid:1731 · .hq-card:1732,1737,1761
.hq-head:1738 · .hq-pic:1744,1746 · .hq-emoji:1748 · .hq-badge:1749 · .hq-stars:1753 · .hq-price:1754,1759,1760,1763(+6)
.craft-credit:1767,1769,1770 · .car-grid:1777,1779,1780 · .robot-weap:1781 · .dmap-box:1784,1785 · .dmap-grid:1791 · .dmap-card:1793,1796,1797,1798(+2)
.dmap-ico:1800 · .dmap-new:1803 · .dcp-grid:1805 · .dcp-card:1807,1810,1811,1812(+10) · .levelup-box:1829,3086,3087,3274 · .dcp-box:1832,1833,1837,1838(+6)
.dcp-lock:1846 · .sold-badge:1850,1852,1853 · .rs-showroom:1855,5019,5020 · .rs-list:1856,1858,5000,5003 · .rs-thumb:1859,1861,1862,1863(+1) · .rs-thumb-pic:1864,1865
.rs-thumb-price:1866 · .rs-stage:1868 · .rs-big:1871 · .rs-big-img:1872 · .rs-elec:1876,1880,1885 · .rs-edge:1886,1892
.rs-info:1895,1896,1897,1898(+1) · .rs-buy:1900,1902,1903 · .cs-showroom:1907,4992,4993,5021(+3) · .cs-list:1908,1910,4994,4999(+9) · .cs-thumb:1911,1913,1914,1915(+1) · .cs-thumb-pic:1916,1917
.cs-thumb-name:1918 · .cs-thumb-price:1919 · .cs-thumb-own:1920 · .cs-stage:1922 · .cs-big:1925 · .cs-big-img:1926
.cs-elec:1930,1934,1938 · .cs-edge:1939,1945 · .cs-interior:1948 · .cs-inr-label:1949,1950 · .cs-inr-img:1951 · .cs-info:1953,1954,1955,1956(+6)
.cs-buy:1964,1966,1967,1968 · .car-emoji:1970 · .car-mine:1976 · .car-mine-pic:1981 · .car-mine-info:1982 · .car-loan:1983,1984
.car-mine-btns:1985,1986,1987 · .car-locked:1989 · .car-mine-head:1991 · .car-pick-list:1992,1993 · .car-pick:1994,1996,1997 · .car-pick-pic:1998,1999
.car-pick-name:2000,2001 · .car-pick-od:2002 · .car-buy-box:2004,3281 · .cb-pic:2005,2006,2007 · .cb-lines:2008 · .cb-li:2009,2013,2014
.cb-ins:2015,2019,2020 · .cb-plan:2021 · .cb-pl:2022,2027,2029,2033(+1) · .cb-total:2040 · .cb-btns:2041,2046 · .cb-x:2042
.shop-grid:2049 · .shop-item:2050,2055,2060,2061(+3) · .mkt-tab:2069,2070 · .pg-btn:2071,2072,2073 · .pg-dot:2074 · .fr-gift-btn:2108,2113
.gift-sec-title:2116 · .gift-in-row:2118 · .gift-out-row:2122 · .gift-in-pic:2123,2125,2126 · .gift-in-info:2127,2128 · .gift-in-btns:2129
.gift-accept:2130,2134,2136 · .gift-decline:2135 · .gift-box-card:2137 · .gift-box-from:2138,2139 · .gift-note:2140 · .gift-pick-overlay:2143
.gift-pick-box:2147 · .gift-pick-head:2153,2157 · .gift-pick-close:2158 · .gift-pick-tabs:2160 · .gp-tab:2161,2165 · .gift-pick-body:2166
.gp-chips:2167 · .gp-chip:2168,2172 · .gp-card:2173,2174 · .gp-price:2175 · .gp-note:2176 · .gift-cf-pic:2177
.chat-emoji-cats:2182 · .chat-emoji-cat:2186,2190,2191 · .chat-emoji-wrap:2192,2193 · .stage-left:2202,4559 · .pet-info-btn:2206,2213,2214 · .feed-list:2221,2225,2250,2251(+1)
.feed-empty:2226,2229 · .fd-tools:2235 · .feed-bell:2236,2238,2239,2240 · .fd-prog:2244,2245 · .fpost:2252,2968 · .fp-head:2257
.fp-who:2258 · .fp-name-line:2261 · .fp-name:2262 · .fp-when:2263 · .fp-badges:2265,2268 · .fp-badge-ic:2266
.fp-text:2270 · .fp-media:2273 · .fp-img:2275 · .fp-cap:2277 · .fp-big:2278 · .fp-sum:2280,2282
.fp-sum-rx:2283 · .fp-sum-none:2284 · .fp-en:2285 · .fp-bar:2287 · .fp-act:2288,2292,2294 · .fp-like:2293
.fp-page:2305,2306,2307,2308(+3) · .fp-rxbox:2311 · .fp-rxb:2315,2317,2318,2319(+1) · .fp-rxb-off:2321 · .fp-fly:2323,2326,2327 · .fcm-overlay:2330
.fcm-box:2332 · .fcm-post:2336,2337 · .fcm-rxs:2338 · .fcm-rx:2339 · .fcm-list:2340,2342 · .fcm-row:2343,2344,2345
.fcm-none:2346 · .fcm-item:2348 · .fcm-reps:2349 · .fcm-rep:2351 · .fcm-more:2353,2355 · .fcm-arrow:2356
.fcm-reply:2357,2359 · .fcm-like:2361,2364,2365,2366 · .fcm-likeic:2367 · .fcm-cnt:2369,2371 · .fcm-likers-box:2372 · .fcm-likers-list:2373,2375
.fcm-liker-row:2376 · .fcm-liker-none:2377 · .fcm-repbar:2378,2381 · .fcm-repx:2382 · .fcm-note:2384 · .fcm-quick:2386,2388
.fcm-q:2389,2392,2393 · .fcm-add:2394 · .fcm-input:2395,2397 · .fcm-send:2398,2400 · .fcm-locked:2401 · .fnt-overlay:2403
.fnt-box:2405 · .fnt-list:2409,2411 · .fnt-row:2412,2414,2427 · .fnt-ico:2415 · .fnt-tx:2416,2417 · .fnt-sub:2418
.fnt-hint:2420 · .fnt-go:2421,2424,2425,2433 · .fnt-tag:2428 · .fnt-note:2430 · .fcm-hl:2435 · .feed-plate:2443
.feed-all-btn:2444,2449 · .fdb-overlay:2454 · .fdb-box:2456 · .fdb-head:2460 · .fdb-close:2464,2466 · .fdb-live:2467
.fdb-live-title:2468 · .fdb-live-rows:2470,2472,2473 · .fdb-live-row:2474,2476,2477,2478 · .fdb-dot:2479 · .fdb-list:2481,2482 · .fdb-empty:2483
.fdb-row:2484 · .fdb-row-top:2486 · .fdb-ico:2487 · .fdb-txt:2488 · .fdb-name:2489 · .fdb-ago:2490
.fdb-actions:2491 · .fdb-like:2492,2495,2496,2497 · .fdb-cm-list:2498 · .fdb-cm-row:2499,2501 · .fdb-cm-empty:2502 · .fdb-cm-add:2503
.fdb-cm-input:2504,2506 · .fdb-cm-send:2507,2509 · .fdb-cm-locked:2510 · .pi-overlay:2513 · .pi-box:2517,2522,2523,2527(+3) · .pi-close:2529,2534,2535
.pi-close-left:2537 · .pi-portrait:2539 · .pet-wear:2546,2549,2551 · .pi-portrait-wrap:2554,2556 · .pi-dress-btn:2564,2568,2569 · .pi-shape-cap:2570,2573,2574,2575
.pi-shape-toggle-btn:2577,2580 · .pi-dress-pip:2582,2587,2588,2589(+1) · .pi-wear-note:2592,2594 · .greet-card:2601 · .greet-sub:2602 · .greet-grid:2603
.greet-opt:2604,2607,2608,2609 · .greet-e:2610 · .pi-streak:2614 · .pi-streak-head:2616,2618 · .pi-streak-best:2619 · .pi-dots:2620
.pi-dot:2622,2623,2624 · .pi-streak-note:2625 · .pi-care-title:2626 · .lbf-overlay:2639 · .lbf-box:2642,2656,2657,2658(+10) · .lbf-head:2647
.lbf-title:2648 · .lbf-tabs:2649,2652 · .lbf-note:2655 · .lbf-close:2671 · .lbf-close-l:2672 · .lbf-body:2673
.lbf-grid:2674 · .lbf-box-bcat:2693 · .lbf-bcat-wrap:2694 · .lbf-bcat:2696,2755,2756,2757(+3) · .lbf-bcat-head:2698,2699,2700 · .lbf-bcat-mid:2707
.lbf-bcat-badge:2708,2767 · .lbcat-ic:2718 · .badge-shine-img:2724 · .badge-shine:2742,2743 · .lbcat-ic-label:2769 · .lbf-bcat-rows:2771
.lbf-one-row:2775,2776,2777 · .lbf-bcat-row:2778,2780,2781,2783 · .lbf-podium:2795 · .pod:2797,2824,2825 · .pod-char:2799 · .pod-base:2801
.pod-rank:2803 · .pod-label:2805,5063 · .pod-name:2807 · .pod-sc:2809 · .pod-1:2814,2815 · .pod-2:2816,2817
.pod-3:2818,2819 · .pod-4:2820,2821 · .pod-5:2822,2823 · .pl-wide:2842,2845,2846,2847(+8) · .pl-follow:2848,2853,2855 · .pl-unfollow:2857,2863,2864
.pl-followers:2865 · .pl-cols:2866,2871,2872,2873 · .pl-col:2867 · .pl-sec-title:2868 · .pl-badges-col:2874 · .pl-feed:2875,2878,2885
.pl-feed-row:2879,2883,2884 · .pl-assets-wrap:2887,4900,4975 · .pl-assets:2888,4903,4908,4914(+4) · .pl-asset:2891,2895,2902 · .pl-asset-emoji:2896 · .pl-asset-n:2897
.pl-pets-wrap:2904 · .pl-pets:2905 · .pl-pet:2906,2911,2913 · .pl-pet-nm:2914 · .img-lightbox:2917,2922,2923,2927(+3) · .cert-svg:2946
.cert-tap:2947,2952 · .cert-chip-sm:2955 · .pl-sec-sub:2975 · .pl-certs:2976,2978 · .cert-mini:2979,2983,2985 · .cert-mini-cap:2986
.cert-none:2988 · .lv-cert-row:2990,2992 · .lv-cert-btn:2993,2998 · .cert-lightbox:3000,3005,3006,3010(+3) · .pl-chat:3030,3035 · .pl-call:3037,3043
.pet-peek:3044,3045 · .pp-chips:3047 · .pp-chip:3048 · .pp-gift:3053,3059 · .settings-box:3061,3062,3135,3146(+30) · .set-feed-head:3063
.set-feed-sub:3067 · .set-feed-row:3068 · .pillinfo-val:3073 · .pillinfo-desc:3078,3097 · .pillinfo-box:3089 · .plf-head:3092
.plf-emoji:3093 · .plf-ht:3094,3095,3096 · .plf-foot:3098,3100,3101 · .alert-box:3106,3108 · .ab-emoji:3109 · .ab-title:3110
.ab-desc:3111 · .ab-btns:3112,3113,3114 · .heal-heart:3116 · .attn-box:3131 · .set-tabs:3156,3160,3163,3164 · .set-panels:3166
.set-panel:3167,3170,3171 · .help-box:3255,3256,3257 · .wl-box:3275 · .food-box:3276 · .home-shop-box:3278 · .summary-box:3279
.report-box:3280 · .wl-grid:3283 · .tc-wrap:3285 · .spell-btn:3291,3296 · .sp-hud:3297 · .sp-word:3299
.sp-ch:3300,3305 · .sp-th:3307 · .sp-hint:3309 · .sp-exit:3312,3316 · .sp-banner:3317 · .sp-big:3322
.sp-thb:3324 · .sp-coin:3325 · #spell-confetti:3330 · .sp-rb:3331 · .sp-day:3341 · .sp-perfect:3343
.sp-late:3345 · #spell-coinpop:3348 · .side-sub:3457,3459 · .sec-quest:3464 · .on-page:3475,3476,3477,3478 · .inbox-overlay:3488
.ib-box:3490 · .ib-head:3494 · .ib-close:3498,3500 · .ib-list:3501,3502 · .ib-row:3503,3504,3505,3506 · .ib-ava:3507,3512,3513
.ib-on:3514 · .ib-mid:3516 · .ib-name:3517 · .ib-last:3518 · .ib-meta:3519 · .ib-time:3520
.ib-dot:3522 · .ib-story-badge:3525 · .ib-empty:3529 · .ib-story:3531,3533 · .ib-story-item:3534,3536,3543 · .ib-story-ava:3537
.ib-story-on:3541 · .ib-world:3546,3549 · .ib-tabs:3551 · .ib-tab:3552,3555,3557 · .ib-tab-dot:3558 · .ib-call-ava:3562
.ib-call-row:3563,3564 · #btn-music:3570,3573,3574 · #ws-overlay:3589 · #ws-board:3592,3598,3600 · .ws-head:3603 · .ws-title:3604
.ws-findbar:3607 · .ws-tip:3608 · .ws-grade:3610,3611 · .ws-body:3614 · .ws-gridwrap:3615 · #ws-grid:3618
.ws-cell:3623,3628,3630,3633(+2) · .ws-flash:3639,3641 · .ws-coinpop:3645,3669 · .ws-combo:3656,3660,3661,3662 · .ws-find:3673 · #ws-prog:3674
#ws-words:3678,3682 · .ws-word:3684,3689,3690,3691(+2) · .ws-actions:3699,3700,3709 · .ws-sizes:3704 · .ws-sizes-lb:3706 · .ws-size-now:3707
#ws-new:3710 · #ws-stash:3711 · #ws-clear:3712 · #ws-win:3713,3715 · .ws-win-in:3716,3719 · .sec-online:3742
.rank-tab:3770,3771,3772,3773(+2) · .pet-show-bg:3803,3806,3810,3814(+19) · .ps-night-fx:3906,3908,3920,3925(+1) · .pet-show:3935,3938,3950,3952(+48) · .ps-video:4166 · .ps-worn-pip:4244,4245
.id-card:4268,4275,4279 · .id-chip:4292 · .clock-chip:4301,4302 · .coin-block:4318 · .coin-group:4319 · .coin-pill:4349,4350,4371
.cp-lb:4374 · .cp-v:4375 · .topbar-icons:4411 · .topbar-icons-row:4412 · .topbar-theme-row:4413 · .theme-swatch:4414,4419,4420
#theme-navy:4422 · #theme-emerald:4423 · #theme-plum:4424 · .nw-sub:4461 · .top-flex2:4556 · #panel-factory:4575,4576,4580,4581(+39)
#panel-rank:4716,4717,4723,4728(+11) · .grid2x8:4799,4805 · .grid1x5:4815,4821 · .pl-badges-strip:4827 · .pl-badge-card:4831,4837,4855,4856(+1) · .pl-badge-card-ic:4843,4852,4854
.pl-badge-card-nm:4858 · .pl-badges-empty:4864,4866 · .mine-strip:4880,4882,4883,4888(+4) · .mb-strip:4894,4933 · .gmark:5041,5045,5046,5047(+1) · .gm-stack:5050,5054
.gm-row:5056 · .lb-name:5058,5059,5060 · .grade-edit:5081,5086,5087 · .gradelock-box:5091,5107,5112,5114 · .gl-head:5092 · .gl-emoji:5093
.gl-ht:5094 · .gl-cur:5095 · .gl-lock:5096,5101 · .gl-ok:5100 · .gl-lock-sub:5102 · .gl-why:5103
.gl-pick-lb:5104 · .gl-opts:5105 · .gl-hist:5115 · .gl-hline:5116 · .gl-hg:5120 · .gl-hat:5121
.gl-harr:5122 · .gl-foot:5123 · .gl-cf:5124 · .reg-gradelock:5146 · #tp-overlay:5156 · #tp-board:5158,5162
.tp-head:5166 · .tp-title:5167 · .tp-stat:5169,5171 · .tp-pts:5173,5176 · .tp-close:5178,5184,5185 · .tp-snd:5188,5191,5197,5198
.tp-snd-ic:5192 · .tp-snd-track:5193 · .tp-snd-thumb:5195 · .tp-prompt:5202 · .tp-word:5204,5218,5219 · .tp-ch:5206,5211,5212,5214
.tp-thai:5222 · .tp-hint:5224 · .tp-empty:5226 · .tp-keys:5229 · .tp-row:5231 · .tp-row-fn:5233,5266
.tp-key:5237,5249,5251,5257(+2) · .tp-key-fn:5264 · .tp-fx:5270 · .tp-coinpop:5271 · .tp-pop-pt:5276 · #city-backdrop:5290,5296
.city-arrive:5297,5298 · .night:5312,5332,5333,5335(+2) · #night-veil:5358 · .theme-emerald:5387,5399,5406,5409(+7) · .theme-plum:5392,5403,5407,5410(+3) · #theme-veil:5420
#screen-picmatch:5473,5479,5480,5481(+29) · .pm-category-btn:5506,5509 · .pm-sheet-card-img:5510 · .pm-card:5513,5518,5522,5524(+9) · .pm-grid:5516 · .pm-right:5546
.pm-now:5547,5553 · #pm-now-en:5554 · .pm-now-th:5555 · .pm-lobby-btn:5563,5567 · .pm-mode-btn:5592,5595 · .pm-wordcard:5596,5597,5599

## css/picdict.css (317 บรรทัด · 1 selector)
#screen-picdict:9,16,17,22(+104)

## css/picquiz_online.css (119 บรรทัด · 37 selector)
#pqr-root:5,6,7,8(+3) · .pqr-shade:13 · .pqr-card:15 · .pqr-mode-card:17,18,19 · .pqr-x:20 · .pqr-mode-grid:21
.pqr-mode-btn:22,24,25,26 · .pqr-full:28,30,32,33 · .pqr-net:34 · .pqr-hub-body:35,36,37,39(+3) · .pqr-bigicon:38 · .pqr-code-input:42
.pqr-primary:43,44 · .pqr-room-head:47 · .pqr-code-chip:48 · .pqr-head-actions:49,50 · .pqr-call:51 · .pqr-room-grid:52,53,54
.pqr-members:55 · .pqr-member:56,57,58 · .pqr-wait:59 · .pqr-room-hero:60 · .pqr-start:61 · .pqr-voice-note:62
.pqr-chat:63 · .pqr-msg:64,65,66 · .pqr-chat-form:67,68 · .pqr-hud:70 · .pqr-hud-main:72,73,74,75 · .pqr-hud-actions:76,77,78
.pqr-drawer:80 · .pqr-drawer-card:81 · #pqr-drawer-body:82 · .pqr-chat-draw:83 · .pqr-score-row:84,85 · .pqr-incoming:87,88,89,90
#screen-picdict:97,98,99,100(+2)

## css/style.css (2,254 บรรทัด · 557 selector)
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
.pet-wrap:639 · .pet-emoji:640 · .pet-img:641 · .egg-img:642 · .feed-pet:643,833 · .pet-baby:644
.pet-adult:645 · .pet-egg-stage:647 · .wear:649 · .wear-head:650 · .wear-face:651 · .wear-neck:652
.pet-name:654 · .stage-label:655 · .level-row:656 · .level-badge:657 · .exp-bar:661 · .exp-fill:662
.exp-text:663 · .ability-box:665,669 · .hunger-bar:672 · .hunger-fill:673,674,675 · .food-item:681,745,749,750(+9) · .hunger-text:685
.heat-bar:688 · .heat-fill:689 · .heat-text:690,691,692 · .care-row:694 · .care-btn:695,699,705 · .btn-feed:700
.btn-cure:701 · .btn-foodquiz:703 · .care-row-quiz:704 · .sick-banner:706 · .pet-sick:710 · .food-lock-note:713
.pet-asleep:723 · .sleep-badge:724 · .btn-sleep:726 · .dinner-btn:729 · .food-box:733,734 · .food-x:736,742
.food-hunger-bar:743 · .food-grid:744 · .fd-lock:758 · .fd-lock-when:782 · .fd-nowok:783 · .fav-tag:786
.fd-exp:790 · .food-sec:792 · .food-sec-human:796 · .bad-tag:798 · .fd-toxin:802 · .fd-safe:803
.fq-box:806,807 · .fq-progress:808 · .fq-pair:809,810 · .fq-ask:811 · .fq-why:812 · .fq-btns:816,817,821
.fq-yes:822 · .fq-no:823 · .fq-next:824 · .food-cancel:825 · .feed-box:831,832 · .feed-gain:834
.sick-badge:838 · .big-btn:844,850,1103,1104(+6) · .shop-card:853 · .shop-title:857 · .shop-grid:858 · .shop-item:859,863,864,865(+4)
.it-tag:870 · .tag-wear:871 · .lock-banner:873 · .home-current:879,884,885 · .home-img:886 · .home-emoji:887
.home-btn:888,910 · .home-layout:890 · .home-pic-col:891,897 · .home-img-big:895 · .home-info-col:898,900,903,904 · .home-name-row:901
.home-desc-row:902 · .home-shop-box:912,913 · .home-list:914 · .home-option:915,919,920,921(+1) · .home-opt-img:924 · .home-opt-body:926,927
.home-price:928 · .reset-link:948 · .login-card:954 · .login-pets:955 · .login-status:956 · .google-btn:957,963,964
.login-note:965 · .install-btn:968,974,975 · .install-guide-overlay:978 · .install-guide:982,986,989 · .install-steps:987,988 · .install-guide-close:990
.login-account:995 · .register-card:998,1002,1020,1024 · .reg-safety:1004,1006,1007 · .reg-privacy:1009,1011,1012 · #screen-register:1014,1015,1016,1017(+2) · .student-chip:1025
.clock-chip:1029 · .online-count:1035 · .online-row:1042,1046,1047,1066 · .online-dot:1051 · .online-name:1056 · .online-act:1060
.online-ava:1065 · .online-live:1067 · .online-note:1071 · .lb-empty:1074 · .lb-list:1075 · .lb-row:1076,1080,1081
.lb-rank:1085 · .lb-name:1087,1091 · .lb-coins:1095 · .lb-hint:1097 · .lb-badgeline:1098 · .lb-tabs:1100
.lb-tab:1101,1102 · .tinv-note:1113 · .cat-card:1119,1164,1167,1315(+1) · .cat-head:1123 · .cat-emoji:1124 · .cat-name:1125
.cat-pass:1126 · .cat-info:1127 · .cat-btns:1128 · .cat-btn:1129,1133,1134,1135(+3) · .cats-back-bottom:1138 · .tapglow:1143,1144,1152
.lobby-bottom:1151 · .band-sec-head:1162,1163 · .bax-box:1171,1173 · .bax-head:1174 · .bax-sub:1175,1176 · .bax-row:1177
.bax-lv:1178,1181,1182,1183(+3) · .bax-emoji:1184 · .bax-name:1185 · .bax-q:1186 · .bax-need:1188 · .bax-rw:1189
.bax-foot:1193 · .bax-rank:1194,1197 · .bxr-box:1200,1202 · .bxr-head:1203 · .bxr-sub:1204 · .bxr-body:1205
.bxr-pick:1206 · .bxr-cats:1207 · .bxr-chip:1208,1210,1211,1212(+1) · .bxr-list:1215 · .bxr-row:1216,1218,1220,1224 · .bxr-rk:1219
.bxr-nm:1221,1222 · .bxr-sc:1223 · .bxr-tm:1225 · .bxr-more:1226 · .bxr-none:1227 · .bxr-foot:1229
.band-mine-tag:1230 · .bsp-box:1233,1236 · .bsp-head:1237 · .bsp-prog:1238 · .bsp-retake:1240,1243 · .bsp-info:1245,1247
.rts-box:1250 · .rts-head:1252 · .rts-sets:1253 · .rts-set:1254,1255,1256 · .rts-sub:1257 · .rts-words:1258
.rts-word:1259,1261,1262 · .rts-foot:1263 · .rts-okbtn:1264,1266 · .bsp-grid:1267 · .bsp-chip:1268,1271,1272,1273(+1) · .bsp-num:1275
.bsp-best:1276 · .bsp-tick:1277 · .bsp-foot:1278 · .vb-box:1281,1283 · .xsp-box:1286 · .vb-head:1287
.vb-total:1288 · .vb-quizbtn:1289,1291 · .vb-tabs:1292 · .vb-tab:1293,1295,1296 · .vb-words:1297 · .vb-word:1298,1301,1302,1303(+3)
.vb-empty:1307 · .vb-foot:1308 · .vb-pg:1309,1311 · #vb-pginfo:1312 · .vb-hint:1313 · .band-lock:1321
.offline-btn:1322,1323 · .quiz-progress:1328 · .quiz-phon:1329 · #quiz-extra:1330,1332,1333,1334 · .quiz-word-card:1335 · .quiz-next:1341,1347,1348,1349(+1)
.quiz-choice:1352,1357,1358,1359 · .quiz-score-pill:1360 · .quiz-time-pill:1362,1364 · .stats-card:1367 · .stats-title:1371,1927 · .stats-row:1372,1373,1374,1375
.stat-badge-line:1377,1380 · .stat-badge-ic:1378 · .game-top:1383 · .back-btn:1384 · .combo-pill:1388 · .timer-wrap:1392
.timer-fill:1393,1394 · .board-label:1396 · .card-grid:1397 · .word-card:1398,1404,1405,1406(+3) · .hint-btn:1412,1417 · .game-endless-note:1420,1425,1427,1431(+6)
.report-btn:1452,1457 · .report-box:1460 · .report-close:1461 · .rp-head:1465 · .rp-avatar:1466,1467 · .rp-title:1468
.rp-sub:1469 · .rp-levelcard:1471 · .rp-level-top:1475 · .rp-bar:1476 · .rp-bar-fill:1477 · .rp-level-note:1478,1479
.rp-grid:1481 · .rp-stat:1482 · .rp-ic:1485 · .rp-num:1486 · .rp-lbl:1487 · .rp-section:1489
.rp-h3:1490 · .rp-badge-mini:1491 · .rp-row:1492,1493,1494 · .rp-empty:1495 · .rp-badges:1496 · .rp-badge:1497
.rp-tline:1500 · .rp-tl-head:1501,1502 · .rp-tl-ems:1503 · .rp-em:1504,1505 · .rp-tl-note:1506,1507 · .rp-crown:1509,1510
.rp-wtitle:1512 · .rp-wnow:1513,1514 · .rp-wgraph:1515 · .rp-wcol:1516 · .rp-wval:1517 · .rp-wbar:1518,1519
.rp-wlbl:1520 · .rp-cheer:1522 · .report-ok:1526 · .summary-box:1529,1652,1656,1657(+2) · .sm-burst:1530 · .sm-title:1532
.sm-line:1533 · .sm-coin:1534 · .sm-matches:1540,1541 · .confetti:1543 · .sm-badge:1550 · .sm-badge-all:1554
.badge-celebrate-overlay:1557,1610,1618 · .badge-celebrate:1563 · .bc-emoji:1569,1607 · .bc-emoji-img:1578 · .badge-clickable:1591,1592,1593 · .badge-info-box:1597
.bi-emoji:1598 · .bi-emoji-img:1599 · .bi-title:1600 · .bi-desc:1601 · .bi-ok:1602 · .bc-title:1608
.bc-sub:1609 · .bc-sticky:1619 · .bc-coin:1620,1625 · .bc-ok:1626,1631 · .sm-cheer:1646 · .sm-streak:1647,1648
.sm-sick:1649 · .sm-btns:1650 · .float-fx:1662 · .toast:1669 · .toast-warn:1676,1683,1684,1690 · .toast-link:1692,1699,1700,1705(+4)
.toast-clear-all:1716,1723 · .alert-box:1725 · .alert-ok:1726,1731 · .settings-box:1733 · .set-row:1734 · .set-hint:1738
.set-hint-on:1739 · .set-hint-off:1740 · .set-lwrap:1741 · .set-label:1742 · .set-desc:1743 · .set-switch:1744,1748,1749,1754(+4)
.set-sw-knob:1750 · .set-sw-txt:1757 · .set-night-row:1766 · .set-seg:1767,1769,1775,1776(+1) · .set-close:1778,1783 · .set-help:1784,1789
.help-box:1791,1792,1797 · .help-item:1793 · .update-banner:1805,1814,1815 · #update-reload:1816 · #update-dismiss:1820 · .levelup-overlay:1826,1832,1833
.levelup-box:1834,1841,1842,1843(+4) · .bill-box:1849,1853,1854 · .tag-off:1855 · .home-decayed-img:1856 · .home-dark-img:1857 · .thirst-fill:1858
.thirst-text:1859,1860 · .toxin-fill:1863 · .toxin-text:1864,1865 · .detox-btn:1866,1871 · .shape-text:1874,1875,1876,1877(+1) · .avatar-pick:1881
.avatar-opt:1882,1886,1887,1888 · .avatar-chip-img:1892 · .mini-av:1894 · .fp-ava:1895 · .avatar-chip-blk:1897 · .set-avatar-btns:1898
.avatar-mini:1899,1903 · .set-blk-row:1905 · .set-sub2:1906 · .blk-grid:1908 · .blk-mini:1909,1912,1913,1914 · .game-avatar:1917,1918,1919
.stats-nick:1928 · .ticket-owned:1931,1935 · .collect-sub:1940 · .mkt-tabs:1941 · .mkt-tab:1942,1946 · .mkt-filter:1947
.mkt-row:1951 · .mkt-emoji:1955,1956 · .mkt-info:1957,1958 · .mkt-tier-stars:1959 · .mkt-buy:1960,1965,1966 · .mkt-price-lo:1967
.mkt-price-hi:1968 · .mkt-empty:1969 · .collect-grid:1972 · .collect-cell:1973 · .cc-emoji:1974,1975 · .cc-name:1976
.cc-count:1977 · .cc-list-btn:1978,1982 · .mkt-listhead:1983 · .mkt-group-head:1985,1991 · .mkt-two-col:1993,1994,1998,2010(+8) · #phone-card:1999,2015
#computer-card:2000,2016 · #ticket-card:2002 · #haunt-card:2003 · #heli-card:2004 · #drone-card:2005 · #drive-card:2006
#soccer-card:2007 · #moto-card:2008 · #invasion-card:2009 · .mkt-listing:2037 · .ml-cancel:2041 · .mkt-sold:2047,2048,2049
.list-dialog:2056,2057,2062 · .list-hint:2061 · .collect-reveal-frame:2065,2072 · .collect-reveal-img:2071 · .collect-reveal-stars:2073 · .craft-box:2076
.craft-head:2077 · .craft-bar:2078 · .craft-fill:2079 · .craft-text:2080 · .craft-btn-row:2081,2082 · .craft-go-btn:2084,2090,2091,2094
.craft-cancel:2102,2106 · .mkt-catalog:2109,2110,2111 · .mkt-pager:2114 · .pg-btn:2115,2119,2120 · .pg-mid:2121 · .pg-dots:2122
.pg-dot:2123,2124 · .order-head:2125 · .order-row:2126,2131,2133,2135 · .order-deliver:2136,2141 · .order-need:2142 · .avatar-chip-photo:2148
.pass-photo:2149 · .pl-photo:2150 · .pp-cam:2155,2163 · .set-photo-row:2166,2172 · .ph-thumb:2173 · .ph-plus:2174
.photo-box:2180,2181,2202,2206(+4) · .ph-now:2182 · .ph-now-img:2183,2187 · .ph-now-cap:2188 · .ph-warn:2189 · .ph-sync:2194,2197
.ph-sync-wait:2198 · .ph-sync-ok:2199 · .ph-sync-bad:2200 · .ph-btns:2201 · .ph-tip:2211 · .ph-stage:2213,2217
.ph-cv:2218 · .ph-ring:2219,2224 · .ph-zoom:2228 · .ph-foot:2229 · .ph-crop-box:2230
