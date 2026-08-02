# CODE_MAP.md — แผนที่โค้ด:บรรทัด (เจนอัตโนมัติโดย `tools/gen_code_map.py` — **ห้ามแก้มือ** เดี๋ยวโดนเขียนทับ)

> วิธีใช้: หาชื่อฟังก์ชัน/ค่าคงที่/selector ในไฟล์นี้ (Grep หรือกวาดตา) → `Read` ไฟล์จริง `offset=<บรรทัด>` `limit=40`
> 🗂️ ไฟล์อ้วนมี **สารบัญโซน** (`st-end ชื่อโซน`) — งานทั้งระบบ/โลก 3D: Grep ชื่อโซน → Read/Edit เฉพาะช่วงนั้น **ห้ามอ่านทั้งไฟล์** · เพิ่มระบบใหม่ในไฟล์อ้วนต้องครอบ banner `/* ==== */`+ชื่อโซน (สารบัญเจนเอง)
> css = index `selector:บรรทัดทุกจุดที่ประกาศ` (บั๊ก UI เริ่มหาที่นี่) · เจนใหม่ทุกครั้งที่รัน `python tools/rotate_handoff.py` · อัปเดต: 2026-08-02

## js/adv3d_css.js (1,137 บรรทัด · 0 รายการ)

## js/adv3d_intro.js (86 บรรทัด · 0 รายการ)

## js/adv3d_tex.js (245 บรรทัด · 19 รายการ)
TILE_COLORS:9 · letterTexture:10 · letterTextureDark:27 · emojiTexture:40 · GHOST_IMG_MAX:52 · measureGhostBox:58
probeGhostImages:71 · whenGhostsReady:83 · ghostTexture:87 · ghostScareSrc:92 · AD_STYLES:100 · adBoardTexture:109
addAdBillboard:156 · ringAds:167 · BUILDING_TINTS:177 · FACADE_ROWS:179 · buildingFacadeTexture:180 · makePeerSprite:205
bind:241

## js/adventure3d.js (12,319 บรรทัด · 597 รายการ)
### 🗂️ สารบัญโซน js/adventure3d.js (Read/Edit เฉพาะช่วง)
- 1-218 adventure3d.js — โลก 3D First-person 2 โหมด (คิว 7725691507 ข้อ 8 + ต่อยอด)
- 219-287 ⚽ โหมดสนามฟุตบอล (โหมด soccer · รอบ 196) — เล็ง+ชาร์จพลังเตะบอลใส่ป้ายตัวอักษร
- 288-342 🤖 โหมดหุ่นยนต์นักรบ (โหมด mecha · รอบ 199) — มุมมองในหุ่นสูง 5m เดินยิงเอเลี่ยนตัวอักษร
- 343-485 📻 หอบังคับการบิน (รอบ 64 · รอบ 66 เปลี่ยนเป็นอังกฤษล้วนตามผู้ใช้สั่ง)
- 486-506 คำศัพท์ — ตามระดับชั้น + ไม่ซ้ำคำที่ประกอบแล้ว (8.1/8.6) · แยกคลังต่อโหมด
- 507-645 Texture ตัวอักษร / emoji / ป้ายชื่อผู้เล่น (canvas → sprite)
- 646-816 🧱 ตัวละครบล็อก (โลกขับรถ) — เลือกก่อนออกรถ · เพื่อนใน map เห็นเป็นหุ่นบล็อกขับรถบล็อก
- 817-1124 🚙 รอบ 393: รถเพื่อนในโลกขับรถ = โมเดลจริง img/models/car_01.glb (ผู้ใช้สั่ง)
- 1125-1277 สร้างฉาก static ครั้งเดียวต่อโหมด
- 1278-1624 🚗 เมืองกำแพงเพชรจริง (โหมด drive) — ข้อมูล OpenStreetMap ใน js/data/city_kpp.js
- 1625-1691 🧭🕳️ รอบ 782 — ปิดช่องขาดของกริดถนน (ผู้ใช้: "GPS พาไปช่วงที่ถนนขาดตอน / ขับต่อไม่ได้")
- 1692-1898 🌉 รอบ 788 — ปูถนนเชื่อม "เกาะถนนโดดเดี่ยว" เข้าโครงข่ายหลัก
- 1899-1956 🌳🚁 รอบ 811: จุด "พื้นที่สีเขียวข้างถนน" (greenPts) — สุ่มออกจากจุดบนถนนแต่ละจุด
- 1957-2008 🚁🌳 รอบ 816 — บินเฮลิคอปเตอร์เหนือ "เมืองกำแพงเพชร" แล้วลงจอดเก็บตัวอักษรบนพื้นที่สีเขียว
- 2009-2025 🌅 ท้องฟ้าภาพจริง (รอบ 203) — ใส่ภาพ panorama 360° (equirectangular 2:1) เป็นฉากหลังท้องฟ้า
- 2026-2065 🧱 เทกซ์เจอร์ภาพจริง (รอบ 323) — วางไฟล์ `img/tex/<key>.jpg` (หรือ .png) แล้วแปะทับพื้นผิวทันที
- 2066-2560 🌌 ท้องฟ้ากลางคืนโรงแรมผีสิง (รอบ 694) — ผู้ใช้: "ข้างนอกโรงแรมยังไม่น่ากลัวพอ"
- 2561-2599 🏨 โรงแรมผีสิง (รอบ 684) — ตัวตึก 5 ชั้นสร้างใน js/hotel3d.js
- 2600-2760 ตัวอักษรในโลก (8.2)
- 2761-2803 🌳🪙 รอบ 811: ความหนาแน่นเสริมเฉพาะโหมดขับรถ — ผู้ใช้: "เพิ่มตัวอักษรและเหรียญบนถนนและ
- 2804-2871 🔠🪙 เก็บตัวอักษร 1 ตัว = ได้ 1 เหรียญ (รอบ 345)
- 2872-2934 ประกอบคำอัตโนมัติเมื่อมีตัวอักษรครบ (8.1/8.4)
- 2935-3029 โหมด adv: monsters ยิงสู้ได้ (สเปกเดิม 8.5)
- 3030-3037 👻 ผีในโรงแรม (รอบ 684 — เขียนใหม่ทั้งชุด · ผู้ใช้สั่งข้อ 10-13, 18)
- 3038-3166 🧟 โมเดลผี 3D (รอบ 689 — ผู้ใช้สั่ง: "ภาพผีแบน ๆ ไม่สมจริง ไม่น่ากลัว ใช้โมเดลแทน")
- 3167-3403 🔦👻 รอบ 778 (ผู้ใช้สั่งข้อ 4) — กติกาใหม่ของผีเดินเพ่นพ่านในโรงแรม
- 3404-3665 🏨 ระบบโรงแรมผีสิง (รอบ 684) — เดินขึ้นชั้น/ไฟดับ/ไฟฉาย/ตู้เสื้อผ้า/รูปตามอง
- 3666-3899 เสียงหลอนโหมดผีสิง — สังเคราะห์ Web Audio (ปลอดลิขสิทธิ์ 100%)
- 3900-4225 Multiplayer — ผู้เล่นอื่นใน map เดียวกัน (สไตล์ Roblox)
- 4226-4425 Voice chat ใน map — WebRTC P2P mesh (เสียงวิ่งตรงระหว่างเครื่อง)
- 4426-4506 🏁 พิธีประกาศแชมป์ (ครูกด "จบรอบแข่ง") — /class/<map>/podium
- 4507-4713 HUD
- 4714-5346 DOM overlay + CSS (สร้างครั้งเดียว — self-contained ไม่แตะ style.css)
- 5347-5482 Input — เมาส์+คีย์บอร์ด และจอสัมผัส (มือถือ landscape)
- 5483-5487 🚁 โหมดเฮลิคอปเตอร์ Bell — ฟิสิกส์บินแบบอาร์เคด (สไตล์ Helicopter Flight Pilot)
- 5488-5880 🛸 โดรน FPV (โหมด drone) — บินเร็ว/คล่อง ลอดหน้าต่างเข้าตึกร้าง เก็บตัวอักษรในห้อง
- 5881-6003 🚗 โหมดขับรถเมืองกำแพงเพชร — ฟิสิกส์รถอาร์เคด (bicycle model)
- 6004-6097 🚦 รอบ 133: ไฟจราจรจริงที่ทางแยกใหญ่ + ฝ่าไฟแดงโดนใบสั่ง ม.22
- 6098-6545 🧭 GPS นำทาง (โหมด drive) — เลือกตัวอักษรเป้าหมาย + เส้นทางตามถนนจริง (A*) · นำทางด้วยภาพล้วน (ไม่มีเสียงพูด ตั
- 6546-6604 🎛️ เข็มหน้าปัดวิ่งจริง (สปีด 0-180 + วัดรอบ 0-8×1000) — วาดทับวงเกจของภาพ dash.png
- 6605-6689 🎵 รอบ 181: วิทยุในรถ — จอ head-unit กลางคอนโซล (visualizer + เลือกเพลง 3 โหมด)
- 6690-6722 🪞📷 รอบ 810: กระจกมองหลัง/ข้าง — เรนเดอร์ฉากเดิมซ้ำด้วยกล้องหันหลัง/เฉียงข้าง แล้วยัดลงกรอบบนจอ (scissor)
- 6723-6850 🪆 รอบ 191: ตุ๊กตาดุ๊กดิ๊กหน้ารถ — รูปตัวละครที่ผู้เล่นเลือก (blkN.png)
- 6851-7154 🚔 รอบ 128: แผงเตรียมออกรถ + กฎหมายจราจร + ใบสั่ง
- 7155-7197 🛩️📦 ภารกิจไปรษณีย์กลางคืน (รอบ 353) — เฉพาะช่วงฟ้ามืด (heliNight>.5)
- 7198-8412 🚶🛗🚁🪂 โหมดเดินเท้าในเมืองเฮลิฯ (รอบ 354 — ผู้ใช้สั่ง)
- 8413-8486 🎛️ หน้าปัดเข็มขยับจริง (รอบ 61) — วาดสดทุกเฟรมจากค่าการบินจริง
- 8487-8758 🌧️☀️ ชั้นบนกระจก: ที่ปัดน้ำฝน + แสงแดดสาด (รอบ 346)
- 8759-9163 🔊🌧️ เสียงที่ปัดน้ำฝน (รอบ 537) — สังเคราะห์ล้วน ไม่มีไฟล์เสียง
- 9164-9233 📹 กล้องใต้ท้องเครื่อง (belly cam) — รอบ 348
- 9234-9305 🎯 วงเป้าลงจอด (รอบ 349) — ไฮไลต์ดาดฟ้าที่มีตัวอักษร ให้รู้ว่าควรร่อนลงตรงไหน
- 9306-9921 📏 แถบเตือนความเร็วดิ่ง (รอบ 349) — ลงเร็วเกินกรอบกล้องกะพริบแดง สอนให้ร่อนลงนุ่มๆ
- 9922-9924 Loop หลัก
- 9925-11259 ⚽ โหมดสนามฟุตบอล — ฟิสิกส์บอล + เล็ง + ชาร์จพลัง + กล้อง 1st/3rd + ชุดนักเตะ
- 11260-11714 🤖 โหมดหุ่นยนต์นักรบ — เดินยิงเอเลี่ยนตัวอักษร (ต้องยิงเรียงลำดับในคำ)
- 11715-11735 เข้า/ออกโลก
- 11736-12319 ❓ การ์ด "วิธีเล่น" ตอนเข้าโลกครั้งแรก (จำแยกต่อโลกใน localStorage — ไม่แตะ state.js)
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
GLASS_HIT_R:212 · DOOR_R:213 · SOCCER_SHIRTS:223 · BALL_R:228 · GOAL_HW:229 · KICK_SPD_MIN:230
AIM_YAW_SP:231 · SOCCER_TILES:232 · AIM_STICK:240 · CURL_SWIPE:243 · CURL_SPIN:244 · HIT_LIFT:248
GUIDE_N:249 · FK_SPOT_Z:255 · FK_MAN_R:256 · AURA_COST:262 · FIRE_CHG:265 · SB_DRAG:273
SPOST_R:274 · GK_Z:279 · GK_SPRITES:280 · PK_TIME:282 · MECHA_EYE:292 · ALIEN_COUNT:293
MECHA_MAX_HP:294 · MECHA_ATK_RANGE:295 · ALIEN_SHOT_SPD:296 · POWERUP_GAP:297 · BOSS_SCALE:298 · COMBO_X2:299
BOSS_SPECIES:302 · pickBossSpecies:310 · WAVE_BASE_GOAL:312 · waveCfg:313 · MECHA_WEAPONS:322 · ATC_REPLIES:351
ATC_CLOSERS:356 · ATC:361 · netUp:479 · CHAT_MAX:482 · doneList:489 · wordPool:490
pickWords:503 · adRenterActive:515 · FACADE_ROWS:524 · adsFetch:530 · adsWatch:542 · adsStop:549
adsChanged:550 · adRentBuy:561 · heliMusicTick:584 · AD_FLYBY_COIN:588 · adFlybyTick:590 · adShopOpen:609
adShopRender:623 · BLOCK_AVATARS:652 · blkGeo:663 · blkMat:664 · blkCyl:665 · blkFaceMat:667
makeBlockFigure:682 · makeBlockCar:722 · blkNameSprite:768 · makeBlockPeer:784 · makeBlockWalkPeer:805 · disposeBlockPeer:813
CAR_GLB_URL:824 · CAR_GLB_LEN:825 · carSplitWheel:829 · carGlbEnsure:856 · carMatGet:875 · carGlbBuild:891
carAvCode:940 · driveCamToggle:947 · SKID_N:966 · skidGeomGet:968 · skidDrop:973 · skidTick:987
blkBuildThumbs:997 · blkBuildPicker:1016 · pickBlockAvatar:1061 · bubbleSprite:1084 · showPeerBubble:1111 · removePeerBubble:1119
concreteTexture:1129 · brokenWindowTexture:1146 · intactGlassTexture:1162 · chargeIconTexture:1180 · rustyDoorTexture:1189 · dAddBox:1203
buildAbandoned:1210 · makeNameSprite:1283 · flatGeom:1296 · flatGeomUV:1305 · buildDriveCity:1315 · HELI_BODY_R:1969
HELI_KPP_CEIL:1970 · heliKppBlocked:1972 · heliKppSpawn:1993 · SKY_IMG:2016 · applySky:2017 · applyTex:2033
HSKY_R:2080 · hskyTex:2082 · buildHauntSky:2087 · tickHauntSky:2217 · buildScene:2235 · randPos:2603
randRoadPos:2611 · randGreenPos:2629 · HOTEL_PER_ROOM:2651 · HOTEL_MIN_GAP:2652 · hotelSpot:2653 · hotelPruneLetters:2688
spawnLetter:2697 · spawnLettersForWord:2743 · ensureCoverage:2745 · DRIVE_LETTER_COPIES:2767 · DRIVE_BONUS_COINS:2768 · ensureDriveAmbience:2769
removeLetter:2782 · spawnLetterAt:2790 · tickLetterRespawns:2798 · LETTER_COIN:2809 · BONUS_COIN_VAL:2810 · pickUpLetter:2811
letterPop:2836 · letterChime:2855 · tryCompleteWords:2875 · completeWord:2889 · spawnMonster:2938 · killMonster:2947
tickMonsters:2955 · damagePlayer:2977 · shoot:2993 · tickShots:3007 · GHOST_GLB_URL:3047 · GHOST_MODEL_H:3048
ghostGlbEnsure:3050 · buildGhostMesh:3076 · makeGhostSprite:3098 · spawnGhost:3116 · applyGhostSize:3141 · faceGhostToPlayer:3152
setGhostVis:3158 · GHOST_MIN_FLOOR:3174 · TORCH_LOCK_S:3175 · BANISH_S:3176 · ghostsAllowed:3178 · hotelCorridorX:3183
torchHitsGhost:3192 · ghostBanish:3199 · ghostGoLurk:3208 · ghostGoStalk:3219 · ghostGoBehind:3232 · tickGhosts:3240
sessionRecapHtml:3338 · hauntRunSec:3345 · fmtSurv:3346 · hauntSurviveFinish:3347 · tickSurvive:3357 · renderHearts:3371
hotelScare:3377 · knockedOut:3397 · BLACKOUT_MS:3419 · FLICKER_MS:3420 · DARK_LETTER:3424 · tintSprite:3425
hotelReset:3428 · setTorch:3452 · toggleTorch:3468 · tickTorch:3473 · hotelBlackout:3483 · hotelFlicker:3499
tickHotelPlayer:3511 · tickHotelWorld:3576 · hotelAct:3619 · openWardrobe:3636 · announceTarget:3659 · netReady:3905
netJoin:3911 · sendPos:3932 · sendChat:3974 · toggleChatBox:3988 · onPeerData:3999 · disposeHeliMesh:4087
removePeer:4092 · netLeave:4107 · tickPeers:4113 · RTC_CFG:4234 · tinvLinked:4235 · partyWord:4242
syncPartyWord:4255 · updateVoiceBtns:4407 · PODIUM_BONUS:4432 · podiumJoin:4434 · podiumLeave:4445 · endRound:4446
showPodium:4457 · tinvCheck:4498 · showBanner:4511 · renderHudTop:4517 · renderHudWords:4522 · renderHudInv:4532
ddTierFromName:4539 · renderBoard:4541 · drawBigMap:4578 · openBigMap:4633 · closeBigMap:4641 · drawMinimap:4646
loadCarDash:4719 · loadCarWheel:4731 · buildDom:4741 · confirmExit:5331 · IS_TOUCH:5350 · HAS_KBD:5352
bindInput:5353 · movePlayer:5448 · tickPlayer:5458 · collideDrone:5491 · propStall:5510 · propBreak:5517
propFix:5524 · droneBatAdd:5531 · lightningBolt:5534 · startRain:5545 · stopRain:5559 · smashGlass:5561
awardGlass:5572 · neededLetter:5589 · openDoor:5604 · raceStartRun:5624 · raceStop:5631 · gateHighlight:5649
renderRaceHud:5656 · tickDrone:5665 · nearMissTick:5808 · showNearMiss:5832 · awardDaredevil:5843 · comboCheer:5860
comboFlash:5876 · driveCell:5885 · nearestStreet:5891 · collideCar:5901 · tlDotY:5932 · tlSet:5936
driveArms:5953 · tlTick:5965 · TL_GREEN:6009 · tlRedDur:6011 · tlightPhase:6012 · buildTrafficLights:6019
rlTick:6071 · cellDrivable:6103 · cellWeight:6106 · cellBlocked:6111 · cellCenter:6112 · posReachable:6114
losClear:6125 · nearestDrivableCell:6136 · routeGrid:6148 · pickGpsTarget:6201 · NAVLINE_W:6224 · NAVLINE_SKIP:6225
navLineEnsure:6226 · navLineHide:6236 · navLineUpdate:6237 · tickGps:6273 · tickDrive:6344 · drawCarDial:6552
drawCarGauges:6582 · RADIO_RECT:6610 · CAR_RADIO_RECT:6612 · carRadioRect:6618 · radioLayout:6620 · radioSetHint:6643
renderRadioList:6649 · radioToggleList:6659 · drawRadioViz:6664 · radioTick:6682 · MIRROR_REAR:6696 · mirrorPass:6698
drawCarMirrors:6710 · BOBBLE_FOOT:6728 · BOBBLE_H:6729 · BOBBLE_ASPECT:6730 · BOB_OMEGA:6733 · BOB_PITCH_FORCE:6735
BOBBLE_SKINS:6737 · bobbleSetAvatar:6744 · bobbleLayout:6751 · bobbleTick:6764 · bobblePoke:6789 · bobbleApplySkin:6806
dollOwned:6816 · openDollPicker:6817 · carStartShow:6854 · showLawInfo:6872 · lawNotice:6894 · driveFineSettle:6904
HELI_PHASES:7083 · heliStartPhase:7090 · heliFloorAt:7097 · SOFT_TIERS:7107 · softLandBonus:7109 · awardPerfLand:7122
setHeliLight:7141 · MAIL_COIN:7160 · mailStart:7162 · mailStop:7185 · mailTick:7186 · FOOT_EYE:7205
doorSlideSfx:7211 · doorLerp:7234 · entLerp:7242 · footStepSfx:7252 · WRING_COIN:7273 · festivalPaint:7277
dustTexture:7289 · dustBurst:7298 · dustTick:7312 · HELI_GLB_URL:7333 · HELI_GLB_TEX_BLUE:7335 · HELI_GLB_ROTOR:7337
HELI_GLB_TROTOR:7338 · heliGlbEnsure:7340 · heliMatBlueGet:7358 · heliGlbAssemble:7371 · heliNavTick:7410 · peerRotorStop:7417
peerRotorTick:7423 · heliCrashSfx:7442 · heliMeshBuild:7470 · heliMeshBuildLegacy:7481 · buildHeliFoot:7611 · footFloorAt:7727
insideTerm:7734 · inDoorZone:7735 · footHint:7739 · setFootBtns:7740 · liftStart:7745 · beginRide:7756
endRide:7779 · beginWing:7790 · awardAirLetter:7803 · paxChoiceShow:7822 · paxChoiceHide:7848 · pilotShipMesh:7852
beginPilot:7853 · endPilot:7885 · drawCabinWindow:7909 · tickHeliFoot:7933 · heliWallPenalty:8144 · tickHeli:8156
CP_NAT:8421 · CP_GAUGES:8422 · SEAT_LABEL:8435 · SEAT_P_FULL:8436 · SEAT_ZOOM:8437 · DASH_OFF_Y:8438
DASH_DROP:8439 · setSeat:8441 · layoutCockpit:8453 · WIPER:8492 · WIPER_SPD:8495 · WIPER_LABEL:8496
INT_GAP:8497 · WASH_MS:8501 · WASH_TANK_MAX:8505 · SMEAR_LIFE:8517 · CHOP_MIN:8518 · SUN_RAY_FAR:8522
sunRayBlocked:8524 · sunShadeTick:8543 · applyCockpitShade:8554 · rotorChop:8566 · sunUpdate:8574 · HELI_FOG_N0:8585
fogUpdate:8589 · adGlowPulse:8637 · RAIN_MAX:8646 · VISOR_Y:8647 · RAIN_MIN:8648 · RAIN_DUR:8649
DROP_ZONE:8653 · addDrop:8654 · tickDrops:8662 · addWashDrop:8680 · washStart:8687 · renderWashGauge:8707
washTick:8718 · grimeTick:8735 · WIPE_R:8742 · wipeDrops:8743 · wiperSndOn:8766 · wiperSndOff:8778
wiperThunk:8784 · washSpraySfx:8796 · wiperSqueak:8813 · wiperSndTick:8830 · setWiper:8850 · tickWiper:8862
SH_SWEEP:8893 · shadowSweepTick:8895 · REFL_MAX:8907 · REFL_COL:8909 · cityGlowLevel:8910 · drawCityGlow:8915
setVisor:8947 · rainTick:8953 · drawBlade:8970 · drawSmears:8989 · drawGlass:9009 · drawBellyCam:9171
drawBellyHud:9194 · drawLandingTargets:9240 · VS_HARD:9310 · drawDescentBar:9311 · heliShake:9360 · cpNeedle:9371
drawGauges:9388 · XF_START:9436 · PRELOAD_WAIT:9437 · ALT_QUIET_FROM:9439 · ALT_MAX_DAMP:9440 · ALT_LP_MIN:9441
ECHO_NEAR:9442 · WIND_FULL_SPD:9443 · SHUTDOWN_SEC:9444 · PAN_MAX:9446 · OD_RPM:9447 · SHAKE_RPM:9448
SHAKE_HIT:9449 · soccerLetterPos:9929 · letterNeeded:9937 · soccerNeededSet:9946 · soccerTileGeo:9954 · soccerGoldTexture:9956
makeSoccerTile:9973 · soccerRefreshSkins:9982 · soccerBuildTargets:9989 · soccerNextTile:9999 · soccerRetarget:10015 · soccerCoinPop:10027
soccerGrassTexture:10040 · soccerTurfGrade:10062 · soccerTurfTexture:10085 · grassNormalTexture:10104 · soccerLinesTexture:10133 · soccerNetTexture:10184
soccerCrowdTexture:10192 · soccerBallMat:10211 · buildSoccerGoal:10231 · buildStands:10250 · soccerLedBoards:10285 · soccerGKEnsure:10382
soccerGKTick:10398 · fkBuildWall:10427 · fkToggle:10442 · fkHitTest:10458 · pkHud:10477 · pkStart:10486
pkEnd:10500 · pkTick:10515 · repQualify:10522 · repEnsureEl:10525 · repStart:10536 · repTick:10543
soccerNumTex:10568 · makeSoccerPlayer:10578 · soccerNewSpot:10605 · soccerResetBall:10617 · soccerKick:10624 · soccerCheer:10642
guideTexture:10645 · auraActive:10669 · auraLeftMs:10670 · buildAura:10672 · auraBuy:10693 · auraRender:10703
auraTick:10717 · buildDrill:10738 · drillTick:10751 · ballFXTex:10791 · buildBallFX:10802 · smokePuff:10818
ballFXTick:10826 · buildLandRing:10871 · buildGuideRibbon:10881 · renderSpinPad:10906 · spinPadToggle:10918 · spinPadPick:10924
renderCurl:10936 · kickLaunch:10947 · updateSoccerGuide:10956 · soccerCamera:11020 · tickSoccer:11041 · soccerKitShow:11233
soccerKitGo:11248 · emojiSprite:11301 · makeAlien:11306 · startWave:11339 · waveSpawnFill:11350 · waveComplete:11359
updateWaveHud:11369 · checkMechaBossBadge:11371 · alienSpawnPos:11380 · removeAlien:11385 · mechaHudWord:11390 · setMechaHudSkin:11398
mechaComboPop:11410 · mechaShielded:11415 · mechaDamageFx:11417 · mechaHitByAlien:11422 · spawnAlienShot:11428 · removeAlienShot:11438
tickAlienShots:11443 · spawnPowerup:11455 · removePowerup:11468 · collectPowerup:11473 · tickPowerups:11480 · updateMechaHud:11489
mechaTracer:11529 · mechaFire:11538 · explodeAlien:11575 · tickMecha:11605 · loop:11661 · grabShot:11695
savePhoto:11706 · clearEntities:11718 · INTRO_KEY:11740 · introSeenObj:11741 · introSeen:11742 · markIntroSeen:11743
INTRO:11744 · INTRO_MODE:11746 · showIntro:11748 · HELI_KPP_BANNER:11774 · closeIntro:11776 · beginPlay:11782
start:11784 · exitWorld:12008 · mechaRecapLine:12080

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

## js/city3d.js (3,043 บรรทัด · 194 รายการ)
### 🗂️ สารบัญโซน js/city3d.js (Read/Edit เฉพาะช่วง)
- 2-18 city3d.js — 🏙️ VOCAB CITY: ล็อบบี้ 3D แบบเมืองลอยฟ้า (index.html = หน้าหลัก · รอบ 861 · สลับเป็นหน้าหลักรอบ 86
- 19-101 ⚙️ CONFIG + เครื่องมือกลาง (รอบ 861)
- 102-204 📷 CAMERA RIG — 1 นิ้วเลื่อน · 2 นิ้วหมุน/เอียง/ซูม (รอบ 861)
- 205-362 🖼️ CANVAS TEXTURE โรงงานผิวสัมผัส (พื้นเกาะ/หน้าต่างตึก/ป้าย)
- 363-423 🏗️ BUILDERS — อาคารแต่ละแบบ (ห้ามกล่องเปล่าแปะ texture — มีชั้นเชิง/ระเบียง/หลังคา/ป้ายจริง)
- 424-812 🚪🌀 รอบ 897: ประตูม้วนเลื่อนขึ้น (โรงรถ/โรงเก็บยาน) — บานพับหมุนไม่ได้เพราะช่องกว้าง 3-5 เมตร
- 813-886 🚗🏍️🚁🛸 ยานพาหนะจิ๋ว (ผู้เล่นจริงจากโลก 3D จะขับ/บินสิ่งเหล่านี้ในเมือง)
- 887-943 🧍 ตัวละครผู้เล่น — blk1-8 = หุ่นบล็อก 3D · blk9-88 = ป้ายภาพ 2D ตั้งในโลก
- 944-1243 🌆 ผังเมือง — อาคารทุกหลังผูก go=<key> (ตัวรับใน js/main.js)
- 1244-1388 🎉 เทศกาลตามวันที่จริง — พลุปีใหม่ / สงกรานต์ / ลอยกระทง (รอบ 863)
- 1389-1647 🧑‍🤝‍🧑 ผู้เล่นจริง (อ่านอย่างเดียว) — presence→ยืนตามอาคาร · world→ขับ/บินในเมือง
- 1648-1804 💬 รอบ 866: บับเบิลแชทสดลอยหัวเพื่อนในเมือง
- 1805-1961 🖊️💬 รอบ 868: พิมพ์ตอบแชทได้จากในเมือง (ไม่ต้องกลับล็อบบี้เดิม)
- 1962-2111 💬🔴 รอบ 873: ไอคอน "มีข้อความค้าง ยังไม่ได้อ่าน" ลอยเหนือหัวเพื่อน
- 2112-2129 🚪 รอบ 870: กลับจากล็อบบี้เดิม → โผล่ที่ "หน้าประตูตึกที่เพิ่งเข้า"
- 2130-2362 🚪🔊 รอบ 890: บานประตูตึกเปิด-ปิดจริง + เสียงประตูสังเคราะห์เอง
- 2363-2528 🚶 รอบ 866: ตัวเราเดินไปหน้าตึกก่อน แล้วค่อยเข้าหน้านั้น
- 2529-2612 🚪🚶 รอบ 886: กลับจากล็อบบี้เดิม → "เดินออกจากตึกมาหน้าประตู" (walkSelfTo ย้อนทาง)
- 2613-2775 👆 แตะ/คลิก: ตัวละคร→การ์ดโปรไฟล์ · อาคาร→เดินทางไปหน้านั้น · พื้น→ประกายดาว
- 2776-2822 🎵 รอบ 873: เพลงประกอบเมือง (BGM) — ปุ่มเปิด/ปิดมุมขวาล่าง
- 2823-2858 🚀 BOOT
- 2859-3043 🎬 รอบ 880: กลับจากล็อบบี้เดิม → จอเปิดคือ "ภาพเมืองใบที่เพิ่งเดินออกไป"
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
bUfo:726 · bHangar:746 · bJungleGate:769 · bDronePad:791 · miniCar:816 · miniMoto:833
miniHeli:853 · miniDrone:873 · makeBlockFigure:891 · makeSpriteFigure:927 · makeFigure:936 · pickBlk:939
bld:947 · BUILDINGS:948 · BLD_AT:1015 · buildCity:1017 · buildPlaza:1068 · buildGreens:1114
_glowTex:1159 · buildSky:1169 · buildAmbientTraffic:1231 · FESTIVAL:1248 · buildFestival:1260 · buildFireworks:1267
buildSongkranDeco:1309 · buildLoiKrathongDeco:1341 · actBuilding:1412 · loadFirebase:1421 · liveStart:1429 · lbGet:1444
watchPresence:1454 · spawnStander:1478 · WORLD_MAPS:1513 · pollWorlds:1520 · spawnVehicle:1571 · removeActor:1631
markPickable:1644 · BUB_MS:1657 · BUB_FRESH:1658 · BUB_MAXCH:1659 · BUB_MAX:1660 · BUB_TEX_KEEP:1661
bubTexture:1667 · bubTexRelease:1679 · bubbleSprite:1684 · bubDraw:1693 · killBubble:1720 · showBubble:1733
flushBubble:1771 · watchFriendChats:1779 · CITY_CHAT_MAX:1818 · CITY_QUICK_REPLIES:1820 · bubSafeText:1823 · actorInfo:1829
chatBoxCanSend:1839 · chatBoxWhy:1843 · chatBoxRefresh:1849 · openChatBox:1886 · closeChatBox:1898 · cbNote:1903
sendCityChatText:1909 · sendCityChat:1939 · cityStopLive:1944 · SAVE_KEY:1973 · saveRead:1976 · pairIdOf:1979
chatSeenTsCity:1981 · chatMarkSeenCity:1987 · unreadTexture:2000 · addUnreadBadge:2018 · removeUnreadBadge:2039 · setUnread:2049
applyUnread:2055 · markReadCity:2057 · unreadCount:2065 · spawnSelf:2071 · DOOR_MEM:2122 · rememberDoor:2123
lastDoorKey:2124 · DOOR_SWING:2146 · DOOR_OPEN_S:2147 · DOOR_SHUT_S:2148 · DOOR_AJAR:2152 · AJAR_QUIET_MS:2153
ROLL_OPEN_S:2158 · ROLL_SHUT_S:2159 · ROLL_LIFT:2160 · ROLL_AJAR:2161 · registerDoor:2164 · doorLeadS:2176
doorSpillTexture:2182 · doorCreakSfx:2193 · doorLatchSfx:2211 · shutterRollSfx:2234 · shutterClunkSfx:2261 · doorMoveSfx:2284
setCityDoor:2291 · openCityDoor:2301 · closeCityDoor:2302 · setDoorRest:2304 · refreshDoorRest:2316 · applyDoorPose:2326
WALK_SPD:2369 · WALK_MIN:2370 · WALK_MAX:2371 · DOOR_GAP:2372 · RECEPTION_SPOT:2376 · doorSpotOf:2377
walkPose:2388 · footCtx:2403 · footStepSfx:2408 · footDustTexture:2429 · footDustPuff:2438 · footDustTick:2452
FOOT_STEP_DIST:2467 · DOOR_OPEN_AT:2468 · walkSelfTo:2470 · EXIT_BACK:2540 · EXIT_DUR:2541 · EXIT_STEP:2542
EXIT_CLEAR:2543 · EXIT_SHUT:2544 · stageExitWalk:2547 · walkSelfOut:2558 · onTap:2616 · captureCityShot:2635
travelTo:2668 · sparkleAt:2704 · openProfile:2728 · refreshChip:2767 · setChip:2771 · BGM_KEY:2782
bgmWant:2784 · bgmEnsure:2785 · BGM_DEV:2794 · bgmPlay:2795 · bgmRefreshBtn:2796 · bgmToggle:2803
bgmSetup:2808 · boot:2826

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

## js/f1_3d.js (2,348 บรรทัด · 168 รายการ)
### 🗂️ สารบัญโซน js/f1_3d.js (Read/Edit เฉพาะช่วง)
- 19-77 ⚙️ ค่าคงที่ (TUNE ZONE)
- 78-115 📦 สถานะโลก
- 116-236 🔊 เสียงสังเคราะห์ (เครื่องยนต์ V6 hybrid / สกิด / kerb / ลม)
- 237-355 🖼️ texture: probe img/f1/*.jpg ก่อน → ไม่มีใช้ canvas วาดเอง
- 356-382 ✏️ sprite ตัวอักษร / ป้ายชื่อ (canvas → sprite)
- 383-473 🛣️ เส้นแทร็ก: F1_MAP.track (จุดจริง OSM) → sample ทุก 5 ม.
- 474-745 🏗️ สร้างฉาก: แทร็ก + kerb + runoff + อาคารจริง + ไฟ + ทะเลทราย
- 746-855 🏎️ โมเดลรถ: GLB ผู้ใช้ (img/models/f1_car.glb) → ไม่มี = ประกอบเอง
- 856-1121 🖥️ DOM + CSS (เต็มจอ ไม่มีกรอบเครื่องเกม)
- 1122-1242 🌍 สร้างโลกครั้งเดียว
- 1243-1328 🪽 รอบ 898: DRS — ปีกหลังเปิดบนทางตรง (ตามรถเพื่อนใกล้ 25 ม.)
- 1329-1486 🏁 ฟิสิกส์ + จับเวลา
- 1487-1574 🏆 รอบ 900: กระดานอันดับ Best Lap ออนไลน์ (/f1Rank)
- 1575-1737 🚦👻 รอบ 899: ลำดับออกสตาร์ท (ไฟแดง 5 ดวง) + รถเงาวิ่งตาม Best Lap
- 1738-1938 🛞🔧 รอบ 900: ยางสึก + พิทสต็อปเปลี่ยนยาง
- 1939-2023 🔤 คำศัพท์บนแทร็ก (แบบเดียวกับโลกมอเตอร์ไซค์ — REWARD สูงกว่า)
- 2024-2166 🧑‍🤝‍🧑 เพื่อนร่วมสนาม (NetRoom map 'f1')
- 2167-2223 📷 กล้องไล่หลัง + ลูปเกม
- 2224-2348 🚪 เข้า/ออกโลก
### รายการ js/f1_3d.js
REWARD:22 · LETTER_COIN:23 · LETTER_COPIES:24 · COLLECT_R:25 · DONE_KEY:26 · HALF_W:27
KERB_W:28 · RUNOFF_W:29 · SAMPLE_M:30 · PWR_A:32 · ACC_CAP:33 · DRAG_K:34
ROLL_A:35 · BRAKE_A:36 · BRAKE_DF:37 · GRIP_BASE:38 · GRIP_DF:39 · GRIP_CAP:40
STEER_MAX:42 · STEER_HI:43 · SURF_RUNOFF:44 · SURF_SAND:45 · NET_SEND_MS:46 · ROOM_MAX:47
CHAT_MS:48 · CHAT_PRESETS:49 · PEER_COLORS:50 · GRID_N:51 · LIGHT_LEAD_S:53 · LIGHT_STEP_S:54
LIGHT_HOLD_MIN:55 · LIGHT_HOLD_MAX:56 · JUMP_PENALTY_S:57 · GHOST_HZ:59 · GHOST_MAX:60 · GHOST_KEY:61
TYRE_W_SLIDE:63 · TYRE_W_ROLL:64 · TYRE_W_KERB:65 · TYRE_W_SAND:66 · TYRE_GRIP_MIN:67 · TYRE_WARN:68
PIT_HALF_W:69 · SURF_PIT:70 · PIT_LIMIT:71 · PIT_BOX_AT:72 · PIT_BOX_R:73 · PIT_STOP_V:74
PIT_CANCEL_V:75 · PIT_STOP_S:76 · LINE:91 · PITL:105 · GEARS:234 · gearOf:235
matLam:244 · matLit:250 · applyTex:255 · texFromCanvas:259 · texProbe:267 · asphaltTex:278
kerbTex:293 · sandTex:299 · crowdTex:308 · garageTex:319 · towerTex:330 · adTex:339
tentTex:346 · letterTexture:359 · makeTextSprite:369 · cr:387 · buildLine:391 · nearIdx:430
surfAt:461 · ribbonGeo:477 · kerbStrips:498 · extrudeFootprint:533 · polyCentroid:544 · buildBuildings:548
buildTrackScene:598 · glbEnsure:749 · buildF1Car:763 · makeCar:835 · CSS:859 · buildDom:1006
build:1125 · mapBounds:1210 · mapXY:1218 · drawMap:1221 · DRS_ZONES_N:1251 · DRS_CURV:1252
DRS_GAP_MAX:1253 · DRS_MIN_M:1254 · DRS_ENTRY_M:1255 · DRS_NEAR_M:1256 · DRS_DRAG_K:1257 · DRS_FLAP_SHUT:1259
DRS_FLAP_OPEN:1260 · findDrsZones:1263 · drsZoneAt:1289 · drsPeerGap:1298 · drsTick:1311 · drsHud:1321
physTick:1332 · progressTick:1413 · fmtLap:1461 · puffSmoke:1467 · smokeTick:1476 · FR_READ:1495
frSubmit:1497 · frMerge:1512 · frFetch:1523 · frRowHTML:1541 · frBodyHTML:1550 · frNote:1559
frMount:1564 · resetLights:1584 · beginLights:1591 · lightsLocked:1592 · paintLights:1593 · lightsTick:1603
ghostEnsure:1652 · ghostHide:1669 · ghostLoad:1674 · ghostSave:1683 · ghostReset:1686 · ghostRecord:1690
ghostKeep:1699 · ghostGapAt:1706 · ghostTick:1714 · buildPitLine:1749 · pitAt:1789 · inPitLane:1800
pitBoxTex:1807 · buildPitBox:1830 · setPitSign:1856 · tyreWear:1861 · tyreGrip:1870 · pitTick:1872
pitHud:1900 · tyreHud:1921 · tyreReset:1931 · trackPointAhead:1942 · pickWord:1948 · spawnLetters:1958
renderWordHud:1971 · collectTick:1977 · completeWord:1995 · relocTick:2012 · netReady:2027 · netJoin:2032
netSend:2045 · sendChat:2055 · peerColor:2062 · buildPeer:2066 · onPeer:2086 · showPeerBubble:2105
removePeerBubble:2112 · dropPeer:2118 · peerTick:2126 · netLeave:2142 · renderBoard:2146 · camTick:2170
hudTick:2188 · frame:2196 · tick:2210 · fit:2217 · start:2227 · exitWorld:2284

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

## js/moto3d.js (2,674 บรรทัด · 141 รายการ)
### 🗂️ สารบัญโซน js/moto3d.js (Read/Edit เฉพาะช่วง)
- 91-296 🚗🏙️ รอบ 785: ยกการขับจาก "โลกขับรถเมืองกำแพงเพชร" มาทั้งชุด (เฉพาะ vehicle==='car')
- 297-484 DOM เครื่องเกมพกพา (สร้างครั้งเดียว · CSS ฉีดเอง ไม่แตะ style.css)
- 485-514 🚗🏙️ รอบ 785: ห้องคนขับ + ปุ่มบังคับชุดโลกเมือง (โผล่เฉพาะ .car — โหมดมอไซค์ไม่เห็นอะไรเลย)
- 515-738 🪞📷 รอบ 810: กระจกมองหลัง+ข้าง (เฉพาะโหมดรถยนต์ในห้องคนขับ) — ภาพจริงจากกล้อง 3D ตัวที่ 2/3/4
- 739-835 🚗🏙️ รอบ 785: ห้องคนขับ (หน้าปัด/พวงมาลัย/เข็มเกจ) + ปุ่มเกียร์ — เฉพาะโหมดรถยนต์
- 836-864 🪞📷 รอบ 810: กระจกมองหลัง/ข้าง — เรนเดอร์ฉากเดิมซ้ำด้วยกล้องหันหลัง/เฉียงข้าง แล้วยัดลงแถบบนจอ (scissor)
- 865-932 🎵📻 รอบ 810: วิทยุในรถ — จอ head-unit (visualizer + แผงเลือกเพลง) พอร์ตจาก adventure3d.js ทั้งชุด
- 933-1173 ถนนจากแผนที่จริง → geometry + ตารางแฮชชนถนน
- 1174-1513 ฉาก: พื้น/โรงเรียน/ป้ายหมู่บ้าน/ต้นไม้/เมฆ/บ้านหมู่บ้าน
- 1514-1566 🐕 รอบ 312: หมาวิ่งตัดถนน — โผล่ข้างถนนข้างหน้ารถ วิ่งตัดผ่านเร็ว · ชน = ปรับ 100 เหรียญ (รอบ 643: ลดจาก 500)
- 1567-1700 🪙 รอบ 317: เหรียญบนถนน — pool ลอยเหนือเลนซ้าย รีไซเคิลรอบผู้เล่นตลอด
- 1701-1733 🏍️🚗 รอบ 317: โมเดลยานพาหนะ 3D (ใช้ทั้งรถเราเองโหมด car และรถ/มอไซค์ของเพื่อน)
- 1734-1830 🚗 รอบ 394: โมเดลรถจริง img/models/car_01.glb ในแผนที่บ้านโพธิ์สวัสดิ์
- 1831-2021 🧑‍🤝‍🧑 รอบ 317: เพื่อนในแผนที่เดียวกัน (/world/moto/<uid>)
- 2022-2063 🏟️👥 รอบ 640: งบวาดตัวเพื่อน (ใช้ NetRoom.drawBudget ร่วมกับโลกอื่น)
- 2064-2214 คำศัพท์ + ตัวอักษรบนถนน
- 2215-2527 สร้างโลกครั้งเดียว + ลูปเกม
- 2528-2674 เข้า/ออกโลก
### รายการ js/moto3d.js
REWARD:7 · ACCEL:8 · DASH_LEN:9 · DOG_HIT_COIN:10 · FEAT_SP:12 · DECAL_N:13
GRAV:14 · SUSP_K:15 · ROAD_WIDE:16 · EDGE_M:17 · ROAD_TEX_S:18 · POST_N:19
LEAN_MAX:20 · COLLECT_R:21 · SPAWN_MIN:22 · SCATTER_MS:23 · LETTER_COPIES:24 · BUCKET:25
TILE_COLORS:26 · LETTER_COIN:28 · COIN_VAL:32 · COIN_GAP:33 · COIN_SPIN_SPD:35 · COIN_TIERS:38
EMERALD_TIER:45 · HARD_LAND:46 · COIN_CURVE_RAD:47 · NET_SEND_MS:49 · PEER_COLORS:50 · CHAT_MS:52
CHAT_PRESETS:53 · CAR_EYE:102 · CAR_ACCEL:103 · CAR_VMAX:104 · CAR_WB:105 · MIRROR_REAR:115
RADIO_RECT:120 · CAR_RADIO_RECT:121 · carRadioRect:127 · sndKick:235 · ENG_FILES:245 · CSS:300
buildDom:587 · loadCarDash:744 · loadCarWheel:756 · setGear:766 · setCam3:772 · syncGearUi:779
carDial:788 · drawCarGauge:818 · mirrorPass:841 · drawCarMirrors:853 · radioLayout:869 · radioSetHint:893
renderRadioList:899 · radioToggleList:909 · drawRadioViz:914 · segKey:936 · smoothPts:939 · featKey:955
addFeat:956 · genFeatures:961 · terrainAt:980 · roadGroundY:993 · decalTex:1001 · makeDecals:1020
decalTick:1029 · buildRoads:1046 · distToSeg:1142 · roadInfo:1147 · onRoad:1153 · randomRoadPoint:1154
TXT_SPR_H:1179 · makeTextSprite:1180 · letterTexture:1195 · woodTileMat:1210 · muralTexture:1221 · buildSchool:1233
buildScenery:1379 · scatterTrees:1458 · postTick:1478 · scatterClouds:1505 · makeDog:1517 · spawnDog:1532
dogHit:1542 · dogTick:1553 · coinTexture:1571 · makeCoins:1582 · loadCoinImg:1588 · addCoin:1600
clearCoins:1608 · addFreeCoin:1612 · coinTierAt:1620 · coinFx:1630 · grabCoin:1639 · coinTick:1656
scatterCoinTick:1672 · placeSpecialCoin:1690 · makeVehicle:1705 · mCarSplitWheel:1742 · mCarEnsure:1768 · mCarMat:1785
mCarBuild:1798 · mCarCode:1825 · netReady:1837 · netJoin:1843 · netSend:1856 · sendChat:1870
showPeerBubble:1880 · removePeerBubble:1887 · renderBoard:1894 · peerColor:1916 · buildPeer:1920 · onPeer:1944
dropPeer:1987 · netLeave:1994 · peerTick:1999 · PEER_DRAW_MAX:2027 · drawnPeers:2028 · drawSlotFree:2029
showPeerAgain:2030 · hidePeer:2037 · tickDrawBudget:2042 · spawnSlot:2050 · pickWord:2067 · spawnLetters:2077
renderWordHud:2095 · fitWord:2103 · collectTick:2110 · completeWord:2134 · relocTick:2159 · gpsTick:2174
miniTick:2183 · build:2218 · applyVehicleUi:2255 · fit:2284 · tick:2293 · carDrive:2303
frame:2352 · start:2531 · exitWorld:2603

## js/music.js (204 บรรทัด · 0 รายการ)

## js/netroom.js (807 บรรทัด · 19 รายการ)
CFG:41 · roomsAllowed:63 · HOT_KEYS:71 · COLD_KEYS:72 · HOT_BACK:73 · splitPayload:77
mergeBack:88 · metUids:100 · AIM_TTL_MS:119 · aimAt:121 · aimGet:125 · aimClear:129
MAPS3D:135 · whereFriends:136 · dbOf:160 · envReady:161 · isDenied:164 · create:176
drawBudget:780

## js/online.js (1,799 บรรทัด · 96 รายการ)
### 🗂️ สารบัญโซน js/online.js (Read/Edit เฉพาะช่วง)
- 2-203 ENGINE: ระบบออนไลน์จริงผ่าน Firebase Realtime Database
- 204-297 ระบบเพื่อน (ข้อ 0.3): รหัสเพื่อน + ค้นหา + ส่ง/รับคำขอ
- 298-487 ระบบแชทกับเพื่อน (ข้อ 0.4)
- 488-653 ระบบส่งของขวัญ (ข้อ 0.5)
- 654-770 🏪 ตลาดออนไลน์จริง (item 2 backlog): ซื้อ-ขายสินค้าที่เพื่อน "ผลิตเอง" ข้ามผู้เล่น
- 771-835 คำเชิญเล่นโลก 3D ด้วยกัน — /tinv/<toUid>/<fromUid> = {map,n,ts}
- 836-1032 📰 Follow + Feed กิจกรรม (รอบ 155) · 🌍 หน้า Feed ทุกคน + ไลก์/คอมเมนต์ (รอบ 639)
- 1033-1040 🌍 หน้า Feed ทุกคน + ไลก์/คอมเมนต์ (รอบ 639)
- 1041-1213 📰 รอบ 701 — ฟีดล็อบบี้ทีละโพสต์ + รีแอ็กชัน + แจ้งเตือน (ต่อยอดรอบ 639)
- 1214-1799 📞 โทรหาเพื่อน — Voice call / Video call แบบ LINE (รอบ 625 · กลุ่ม 3 คนรอบ 631)
### รายการ js/online.js
ONLINE_STALE_MS:65 · ONLINE_BEAT_MS:66 · LEADERBOARD_SIZE:67 · onlineDisplayName:71 · onlineActivity:79 · ensureOnlineId:95
onlineKey:105 · onlinePushPresence:110 · onlinePushScore:120 · fetchPlayerStats:154 · onlineRerender:176 · notifyFriendBadges:188
FRIEND_ALPHA:214 · friendCode:215 · friendSearch:227 · friendRequest:251 · friendAccept:260 · friendDecline:272
friendsHeal:282 · CHAT_MAX_LEN:306 · CHAT_KEEP:307 · chatPairId:309 · chatRef:312 · chatListen:318
chatSend:334 · chatDeleteMsg:350 · TYPING_TTL:358 · typingRef:360 · chatSetTyping:361 · chatClearTyping:371
chatWatchTyping:379 · chatThemeRef:397 · chatSetTheme:398 · chatWatchTheme:403 · chatPrune:411 · chatSeenTs:428
chatMarkSeen:434 · chatUnreadCount:446 · chatWatchSync:449 · GIFT_EXPIRE_MS:499 · giftSend:502 · greetSend:516
giftAccept:528 · giftDecline:532 · giftInWatch:538 · giftReclaim:569 · giftOutWatchSync:579 · giftOutRebuild:634
salesWatch:664 · salesRerender:672 · sellInc:676 · marketWatch:684 · marketList:717 · marketUnlist:725
marketBuy:734 · marketSoldWatch:747 · tinvSend:776 · tinvClear:783 · tinvPartyTick:791 · TINV_WORLD_LABEL:813
tinvWatch:817 · FEED_MAX:844 · feedEvent:847 · feedPrune:859 · feedPurgeCat:870 · feedPushAssets:881
petDescriptor:899 · feedPushPets:905 · fetchPlayerPets:919 · followSet:935 · followUnset:946 · feedRebuild:953
feedWatchSync:965 · fetchPlayerFeed:992 · fetchPlayerAssets:1005 · fetchFollowers:1024 · GFEED_READ:1050 · GFEED_KEEP_ME:1051
gfeedPush:1054 · gfeedPrune:1068 · gfeedParse:1081 · gfeedWatchStart:1103 · gfeedWatchStop:1130 · gfeedNotifDiff:1138
gfeedNotifPush:1152 · uidDisplayName:1159 · gfeedRebuild:1170 · gfeedToggleLike:1187 · gfeedSetReaction:1192 · gfeedAddComment:1200
CALL_RTC_CFG:1238 · CALL_RING_MS:1239 · CALL_MAX_MS:1240 · CALL_MAX_PEERS:1241 · onlineStart:1657 · onlineLoadSDK:1774

## js/photo.js (361 บรรทัด · 25 รายการ)
PHOTO_LS_KEY:12 · PHOTO_MAX:13 · PHOTO_PREFIX:14 · PHOTO_SIZES:15 · PHOTO_QS:16 · PHOTO_ZMAX:17
photoValid:25 · photoOnline:28 · photoGet:31 · photoHas:32 · photoIsMine:33 · photoOf:36
photoFetch:44 · photoAfterChange:61 · photoPush:65 · photoVerify:83 · photoSaveUrl:93 · photoRemove:99
photoPullMine:106 · photoBlkSrc:122 · photoMiniHTML:129 · openPhotoMenu:137 · photoLoadImgEl:203 · photoLoadFile:211
openPhotoCrop:224

## js/state.js (1,142 บรรทัด · 91 รายการ)
STORAGE_KEY:6 · QUIZ_PASS_REWARD:11 · CURE_COST:13 · HUNGRY_SICK_MS:14 · MEAL_HOUR:16 · MEAL_FULL:17
SLEEP_FROM_HOUR:18 · SLEEP_SICK_HOUR:19 · WAKE_HOUR:20 · DINNER_COST:21 · TOXIN_FULL:23 · DETOX_COST:24
FOODQUIZ_Q:26 · FOODQUIZ_COIN:27 · FOODQUIZ_BONUS:28 · FOODQUIZ_MAX_PLAYS:29 · SHAPE_JUNK_MEALS:31 · SHAPE_CLEAN_MEALS:32
SHAPE_MISS_MEALS:33 · SHAPE_EXP_BONUS:34 · HEAT_SICK_MS:35 · THIRST_SICK_MS:36 · DEFAULT_STATE:38 · FEED_CATS:196
FEED_REACTIONS:210 · feedRx:218 · FEED_QUICK_CM:220 · SLOT_MS:232 · currentSlotStart:233 · nextSlotStart:239
mealDayKey:241 · nightKeyOf:243 · isNightNow:251 · newPet:256 · loadState:280 · saveState:566
activePet:573 · petStage:574 · isAdult:579 · abilityOn:580 · hasPetType:581 · todayStr:584
dailyTick:588 · addCoins:591 · QUEST_POOL:611 · QUEST_PER_DAY:620 · questsToday:621 · questTick:628
questEvent:632 · assetValue:668 · netWorth:688 · assetCount:690 · refreshRank:707 · heatProtected:723
rainProtected:727 · petHungry:730 · petShapeOf:734 · updatePetShape:740 · shapeMealDone:747 · heatPct:757
ymStr:766 · billOutstanding:770 · UTILITIES:777 · HOME_UTILITIES:783 · homeDecayed:785 · billTick:788
PET_FOOD_PER_PET:860 · petFoodTick:861 · myCar:887 · carLoanDue:892 · carLoanOverdue:897 · carLoanPayable:902
carLoanPay:909 · compTick:922 · ONLINE_RATE:936 · onlineEarnActive:937 · onlineEarnTick:941 · onlineEarnFlush:952
marketTick:962 · addCraft:986 · ORDER_MAX:1005 · ORDER_LIFE_MS:1006 · ORDER_GAP_MIN_MS:1007 · ORDER_GAP_SPAN_MS:1008
ORDER_TIER_WEIGHT:1009 · newOrder:1010 · orderTick:1023 · careTick:1031 · expNeed:1113 · addExp:1118
addRP:1138

## js/tpaward.js (41 บรรทัด · 0 รายการ)

## js/typing.js (369 บรรทัด · 0 รายการ)

## js/ui.js (8,615 บรรทัด · 350 รายการ)
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
- 1319-1851 การ์ด Leaderboard — สลับแท็บในการ์ดเดียว (ประหยัดพื้นที่):
- 1852-2216 การ์ดข้อมูลผู้เล่น 👤 — คลิกชื่อในการ์ดเพื่อน/กระดาน แล้วโชว์
- 2217-2467 แผงเพื่อน 👥 (ข้อ 0.3): รหัสเพื่อน + ค้นหา + คำขอ + รายชื่อเพื่อน
- 2468-2563 🌍 เพื่อนอยู่โลก 3D ไหน + ปุ่ม "ตามเข้าไป" (รอบ 642)
- 2564-2602 แชทกับเพื่อน (ข้อ 0.4) — กล่องแชทลอยกลางจอ + แผง emoji
- 2603-3004 รอบ 179: หน้ารวมข้อความ (inbox แบบ Messenger — ธีมกระจกฟ้า sci-fi ของเกม)
- 3005-3351 ระบบส่งของขวัญ (ข้อ 0.5) — ห้องของขวัญ + กล่องเลือกส่ง + ฉากเปิด
- 3352-3444 RANK CARD + ฉากเลื่อนแรงค์
- 3445-3447 PET DASHBOARD
- 3448-3516 📰 รอบ 155: overlay ข้อมูลน้อง & การดูแล + ฟีดกิจกรรมเพื่อน
- 3517-3920 📰 รอบ 701 — ฟีดล็อบบี้ "ทีละโพสต์" แบบ Facebook (ผู้ใช้สั่ง 29 ก.ค. 2026)
- 3921-4080 🌍 รอบ 639: หน้า Feed เต็มจอ — ทุกคน (ไม่ใช่แค่ follow) + ไลก์/คอมเมนต์
- 4081-4732 📖 Dictionary ค้นหาคำศัพท์ (รอบ 254 ผู้ใช้สั่ง 16 ก.ค. 2026)
- 4733-4776 การนอน (คิว 7725691507 ข้อ 1)
- 4777-5158 ให้อาหาร (ระบบมื้อเย็น 18:00 + ความอิ่มสะสม — ข้อ 2+3)
- 5159-5277 🛡️ ควิซอาหารปลอดภัย (ต่อยอดข้อ 5.1)
- 5278-5363 🎀 ห้องแต่งตัวสัตว์เลี้ยง (รอบ 635: แยกออกจาก "ร้านค้า" เดิม —
- 5364-5551 ที่พัก (หลบแดด/หลบฝน) + เครื่องปรับอากาศ
- 5552-5669 บิลสาธารณูปโภค (ค่าไฟ/ค่าน้ำ — เครื่องยนต์อยู่ใน state.js: UTILITIES/billTick)
- 5670-5752 การ์ดมือถือ (ข้อ 7): ซื้อ 10,000 ขายคืน 6,000
- 5753-5763 การ์ดคอมพิวเตอร์ (ข้อ 11): ซื้อ 50,000 ขายคืน 30,000
- 5764-5808 item 8: โบนัสออนไลน์ +0.01 เหรียญ/วิ ฟรีทุกคนที่เปิดเกมออนไลน์อยู่
- 5809-6399 💻 รอบ 706 (ผู้ใช้สั่ง 29 ก.ค. 2026): ช่องรายได้คอมพิวเตอร์บนแถบบนล็อบบี้
- 6400-6539 🌍 ปุ่มลัดเข้าโลก 3D ในรางเมนูซ้าย (ผู้ใช้สั่ง 9 ก.ค. 2026)
- 6540-6704 🧭 ป้ายบอกทางของรางเมนูซ้าย (รอบ 601 · ผู้ใช้สั่ง 26 ก.ค. 2026)
- 6705-6874 การ์ดสวนผลไม้ (ข้อ 12): ซื้อต้นไม้ปลูกได้ไม่จำกัด แต่ละต้นออกผล
- 6875-6884 โรงงานผลิตสินค้า 🏭 + ตลาดขายต่อ (แนวคิดใหม่ 5 ก.ค. 2026)
- 6885-6907 โรงงานผลิต (แผง 🏭) — แยกออกจากตลาด (ผู้ใช้สั่ง 6 ก.ค. 2026)
- 6908-7060 ตลาดขายสินค้า (แผง 🏪) — แยกออกจากโรงงาน
- 7061-7972 🚗 รอบ 131: หมวดยานพาหนะ — โชว์รูมรถ 10 คัน (แคตตาล็อก 5 ช่อง/แถว)
- 7973-8033 ร้านสัตว์เลี้ยง (ซื้อเพิ่มได้ ไม่ลบตัวเดิม)
- 8034-8070 เลเวลอัพ (รายตัว)
- 8071-8176 สถิติผลการเรียนรู้
- 8177-8214 item 4: การ์ดสรุปส่งครู — ใบเดียวจบ ชื่อ/วัน-เวลา/เหรียญวันนี้/แรงค์/สอบล่าสุด
- 8215-8615 📞 หน้าจอโทรหาเพื่อน — สายเสียง (รอบ 625 · กลุ่ม 3 คน + ปิดวิดีโอ รอบ 631)
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
openFriendQuickMenu:1263 · LB_TABS:1326 · LB_WS_TOP:1327 · LB_TP_TOP:1328 · bindLbTabs:1330 · updateRankRailBadge:1359
rankUpCheck:1378 · rankUpSound:1406 · renderLeaderboardCard:1417 · bindLbGroupOpen:1444 · lbRankRows:1456 · LB_BCAT_TOP:1497
lbBadgeSections:1502 · lbDemoRows:1527 · lbChar:1549 · lbfAwardBarHtml:1559 · openLeaderboardFull:1571 · BLK_PAD:1701
BLK_PAD_NEW:1706 · BLK_TOP_FIX:1707 · seatPodChars:1708 · lbCoinHtml:1720 · lbBadgeHtml:1736 · lbBossHtml:1762
lbWordSearchHtml:1785 · lbTypingHtml:1821 · bindPlayerClicks:1857 · showPlayerCard:1867 · petDescImg:2146 · openImgLightbox:2159
openPetPeek:2179 · updateBillBadges:2223 · setBadge:2233 · tinvPendingCount:2249 · updateSettingsBadge:2258 · openAttentionSummary:2273
updateFriendBadge:2331 · renderFriendPanel:2341 · friendDoSearch:2389 · refreshFriendData:2413 · FRW_TTL_MS:2478 · FRW_MIN_GAP:2479
frwWorldOf:2483 · frwPanelOpen:2486 · frwScan:2491 · frwPaint:2513 · frwPaintHint:2534 · frwFollow:2548
CHAT_EMOJI_CATS:2569 · CHAT_THEMES:2591 · CHAT_SECRET_MS:2600 · chatBadgeSync:2608 · ibTimeStr:2616 · IB_CALL_RE:2625
ibCallInfo:2626 · openChatInbox:2631 · chatFitKeyboard:2801 · openChat:2817 · giftImg:3008 · giftDateStr:3010
GREETS:3018 · GREET_EXP:3026 · greetInfo:3027 · openGreetPicker:3031 · giftItemPic:3073 · giftItemName:3081
updateGiftBadge:3087 · renderGiftPanel:3096 · acceptGift:3154 · declineGift:3177 · showGreetReveal:3186 · showGiftReveal:3213
openGiftPicker:3239 · confirmSendGift:3307 · doSendGift:3331 · rankBadgeHTML:3355 · renderRankCard:3360 · renderRankTab:3394
showRankUp:3422 · bindPetPlateButtons:3457 · openPetInfoOverlay:3486 · feedAgo:3509 · FEED_DECK_MAX:3529 · FEED_SLIDE_MS:3530
FEED_RESUME_MS:3531 · feedPostImgIndex:3536 · feedPostImg:3547 · feedPostByKey:3556 · feedCanReact:3559 · fpStatsHTML:3564
fpNameBadgesHTML:3580 · fpostHTML:3584 · renderFeedCard:3619 · feedDeckGo:3657 · feedDeckTick:3677 · renderFeedBell:3699
feedNotifArrived:3707 · openFeedNotif:3714 · closeRxPicker:3748 · openRxPicker:3752 · feedFlyWord:3772 · feedPickRx:3783
openFeedComments:3796 · closeFeedComments:3810 · renderFeedComments:3816 · bindFeedPostEvents:3875 · openFeedBoard:3927 · renderFeedBoardLive:3948
renderFeedBoard:3966 · stageColLeft:3985 · alignPetTabs:3994 · alignFeedPlate:4006 · alignProfilePlate:4017 · alignStageLeft:4033
alignStageCols:4044 · watchStageCols:4058 · alignCureBtn:4068 · dictRecordLookup:4092 · DICT_FILE_COUNT:4103 · loadDict:4104
dictSearch:4119 · dictTapWords:4134 · dictEntryHTML:4138 · openDictOverlay:4149 · renderDashboard:4233 · sleepBtnHTML:4738
sleepHintHTML:4745 · sleepAllPets:4756 · wakeAllPets:4769 · feedPet:4780 · openFoodMenu:4794 · feedWith:4865
AVATAR_UI:4895 · playerAvatarHTML:4899 · SHAPE_UI:4907 · showFeedResult:4916 · curePet:4957 · heartsFx:4980
PAT_HOLD_MS:5003 · PAT_EXP:5004 · bindPetTap:5005 · petBounce:5023 · petMood:5029 · shortPatPet:5036
longPatPet:5044 · patCalendarHTML:5064 · patStreakTick:5092 · cureCelebrateFx:5118 · railCureClick:5129 · detoxPet:5141
openFoodQuiz:5164 · closeDressUpBoard:5283 · openDressUpBoard:5287 · renderShop:5304 · homeVisualHTML:5367 · showHomeRuined:5381
showCutNotice:5402 · renderHomeCard:5420 · payMaint:5504 · trashBillUI:5520 · payTrash:5537 · UTILITY_UI:5556
utilityBillUI:5605 · payUtility:5630 · buyUtilityFix:5656 · renderPhoneCard:5674 · buyPhone:5714 · sellPhone:5736
compLiveTotal:5757 · onlineLiveTotal:5768 · syncCoinHeader:5775 · flashPillGain:5780 · renderOnlineEarnPill:5789 · renderCompEarnPill:5814
openPillInfo:5847 · renderComputerCard:5930 · buyComputer:5965 · sellComputer:5988 · soldCount:6009 · soldBadge:6010
loadScriptOnce:6016 · advBusyMsg:6041 · advResetLoad:6053 · loadAdv3d:6059 · enterAdventure3D:6067 · pickAdvMap:6092
enterHaunted3D:6127 · enterHeli3D:6149 · pickHeliMap:6175 · enterDrone3D:6211 · enterDrive3D:6230 · pickDriveMap:6265
enterMotoMapAsCar:6301 · enterSoccer3D:6320 · enterMoto3D:6339 · enterF1_3D:6361 · enterInvasion3D:6381 · WORLD3D:6406
gotoRobotShop:6418 · openHealDialog:6424 · world3DFail:6445 · railWorldClick:6476 · openWorldEntryDialog:6499 · railScrollHint:6545
railScrollTop:6553 · initRailScroll:6558 · renderRailWorlds:6578 · tinvNoticeHTML:6658 · openTinvPicker:6666 · fruitCountdown:6710
renderFarmCard:6722 · renderFarmClock:6797 · buyFruit:6813 · sellFruit:6833 · sellAllFruit:6854 · collectImg:6883
renderFactoryCard:6889 · renderMarketCard:6912 · updateWishBadge:6968 · openWishlistDialog:6979 · bindStripArrows:7024 · renderMarketBrowse:7038
carImg:7067 · renderVehicleShop:7068 · CS_CYCLE_MS:7119 · carInteriorImg:7120 · carStatHtml:7122 · renderCarShowroom:7129
csShowBig:7156 · csInit:7183 · RS_CYCLE_MS:7206 · robotImg:7207 · renderRobotShop:7208 · rsShowBig:7230
rsInit:7251 · buyRobot:7270 · enterMecha3D:7292 · pickMechaRobot:7313 · pickDriveCar:7345 · openCarBuyDialog:7388
buyCarInsurance:7449 · payCarLoanMonthly:7468 · payCarLoanFull:7480 · carDriveBlock:7499 · gotoVehicleShop:7504 · gotoMyStock:7509
showNeedCarDialog:7515 · craftDiscount:7527 · renderFactory:7530 · renderOrdersUI:7599 · startProduce:7618 · buyCollectible:7646
cancelProduce:7674 · deliverOrder:7688 · renderOrderClock:7705 · renderCollectMine:7715 · openListDialog:7757 · cancelListing:7810
buyMarketItem:7833 · showCollectReveal:7860 · buyAC:7898 · openHomeShop:7917 · renderPetShop:7976 · showLevelUp:8037
renderStats:8074 · showTeacherCard:8181 · CALL_REACT_EMOS:8225 · CALL_TALK_MIN:8228 · CALL_TALK_HOLD:8229 · CALL_ORDER_GAP:8231
CALL_TONES:8237 · startCall:8611

## js/util.js (1,094 บรรทัด · 45 รายการ)
shuffle:6 · fmtNum:15 · escapeHTML:19 · gradeSymbol:32 · gradeMark:47 · nameWithGrade:55
gradeMarkCanvas:61 · gradeOf:77 · seededRand:92 · fmtThaiDT:102 · fmtThaiDate:106 · showScreen:111
TOAST_WARN_RE:121 · restackToasts:124 · toast:146 · floatFx:170 · beep:181 · soundStatus:202
PET_MOOD:273 · petVoiceSynth:280 · sirenSynth:357 · playCashier:381 · cashierSynth:395 · keyTapSynth:428
playSpark:469 · sparkSynth:483 · thunderFx:518 · wordAudioFile:586 · speakCutOff:595 · speakWord:599
speakLetter:623 · pickSpeakVoice:646 · speakWordTTS:657 · askNameDialog:677 · askConfirm:722 · alertBox:740
applyNoAnim:760 · BLK_VOCAB:767 · openSettings:815 · openHelp:1003 · openTeacherGuide:1029 · TAPGLOW_SEL:1053
TOUCH_INPUT_SEEN:1072 · mouseLockOK:1081 · lockMouse3D:1087

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

## css/lobby.css (5,008 บรรทัด · 741 selector)
:root:6,4996 · html:15 · body:16,4960,5002 · *:36,37,38,39 · #app:42 · h1:44
.subtitle:45 · .shop-title:46 · #rotate-overlay:49 · .screen:71 · #screen-select:80,81,82,83(+5) · .egg-need:90
.petshop-topright:92 · .petshop-play-link:93,98 · #screen-login:112,137,138,143(+7) · .login-lux:122 · .login-crest:123 · .login-word:127
.login-rule:133,134,135 · .login-tag:136 · #screen-game:185,186,187,188(+7) · #screen-quiz:199,200,201,202(+6) · #quiz-choices:211,212 · .word-card:219
.quiz-choice:220,221,222 · .big-btn:225,226,227,228 · #screen-dashboard:233,1122,1130 · .lobby-top:240,873,874,875(+27) · .top-flex:241 · .profile-plate:242,246,794,3533(+12)
#rain-fx:251 · .rain-layer:254,260 · .rain-glass:267 · .glass-drop:268 · .rail-btn:283,886,892,894(+19) · .rail-badge:284
.fr-code-box:289 · .fr-code-label:293 · .fr-code-row:294 · .fr-code:295 · .fr-copy-btn:300,304,309,310 · .fr-search-btn:305
.fr-add-btn:306 · .fr-accept:307 · .fr-decline:308 · #fr-search-input:311 · #fr-search-result:315 · .fr-found:316
.fr-hint:320 · .fr-list-title:321 · .fr-row:322 · .fr-req:326 · .fr-row-name:328,332,4700 · .fr-row-status:336
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
.pl-click:742,744,745 · .pl-overlay:746 · .pl-card:750,2667 · .pl-close:756 · .pl-head:760,2500,2503 · .pl-grade:765,4706,4707
.pl-body:766 · .pl-loading:767 · .pl-none:768 · .pl-me-tag:769 · .pl-blk-wrap:771 · .pl-blk:772
.pl-stat:773 · .pl-lbl:778 · .pl-val:779,780 · .pl-tip:781 · .chip-edit:787,792,793 · .rank-mini:799,805,806,807
.pass-photo:809,814 · .pet-tabs:816 · .dict-box:817,821,822,823(+1) · .dict-card:829,834,838,839(+2) · .dict-head:835,836 · .dict-trail:843,847
.dt-c:848,852,853 · .dt-sep:854 · .dict-today:855 · .di-w:857,858,859 · .dict-list:860 · .dict-item:861,865,866,867(+5)
.lobby-mid:881 · .rail-wrap:884,913,917,918(+3) · .lobby-rail:885 · .rail-nudge:920,928,929,932(+1) · .rail-worlds:939 · .rail-div:940
.lobby-stage:982,984,1000,1127(+13) · .newword-banner:990,997,1002,4085(+2) · .coin-fly:1013,1016 · .coin-plus:1022 · .nw-pop-coin:1037,1039,1040 · .nw-pop-goal:1043,1044,1048,1052
.nw-goal-head:1045,1047,1049 · .nw-goal-bar:1050 · .nw-goal-fill:1051 · .nw-pop-book:1053,1054 · .nw-tag:1075,4091,4113 · .nw-word:1080,4095,4118,4207
.nw-hint:1082,1083,4096,4120(+1) · .nw-coin:1085,1088,4097,4101 · .nw-countdown:1093,4102 · .nw-bar:1095,4121 · .nw-bar-fill:1097 · .pet-stage:1100,2961
.nw-box:1107,2970 · .nw-pop-word:1108 · .nw-speak:1109 · .nw-pop-phon:1110 · .nw-ipa:1111 · .nw-pop-sent:1112
.nw-pop-mean:1113 · .pet-tab:1114,1115,1116,3339 · .stage-hero:1137,1152,1160,1305(+22) · .hero-ground:1174,1294,1300 · .hero-rank-bg:1176,1179,1182,1186(+18) · #lobby3d-canvas:1199,1200
.hero-scene:1204,1206,1213,1214(+8) · .caretaker-fig:1253 · .caretaker-img:1256 · .caretaker-emoji:1258 · .blk-rig:1265,1266,1267 · .stage-plate:1327,1335,1346,1347(+23)
.plate-title:1341 · .lobby-side:1374,1410,1415,1418(+22) · .side-sec:1377,2212,3235,3511 · .side-label:1378,1383 · .side-label-row:1386,1387 · .lb-tabs-out:1388,1389,1393
.side-glass:1397,1404 · .side-card:1416,1527 · #quest-card:1428,1429,1457,1458(+6) · .q-bigcard:1434,1463 · .qb-top:1436 · .qb-emoji:1437
.qb-name:1439 · .qb-bar:1440,1441 · .qb-row:1443 · .qb-prog:1444 · .qb-reward:1445 · .qb-go:1446,1450
.q-dots:1451 · .q-dot:1452,1453,1454 · .q-bonus:1455 · .inv-card:1474,1476,1477 · .inv-btns:1478 · .inv-go:1479,1481
.inv-x:1482 · #online-card:1486,3243,3244,3245(+4) · .fq-overlay:1487 · .fq-box:1489,3049 · .fq-head:1493,1495 · .fq-close:1496
.fq-sec:1498 · .fq-worlds:1499 · .fq-world:1500,1502 · .fq-acts:1503 · .fq-act:1504,1507,1508 · .lb-prize:1541
.lb-coins:1544 · .lbf-cell:1545,2569,2572,2573(+3) · .lb-award-bar:1547,1553,1554 · .lb-award-go:1555 · .lbf-award:1557,1563,1564,1565 · .pod-pz:1566
.wsa-overlay:1569 · .wsa-box:1571 · .wsa-head:1576 · .wsa-title:1577 · .wsa-when:1578,1579 · .wsa-close:1580,1583
.wsa-cols:1584 · .wsa-col:1585 · .wsa-sec-h:1586,1587 · .wsa-msg:1588 · .wsa-msg-h:1591 · .wsa-msg-b:1592,1593
.wsa-msg-none:1594 · .wsa-rules:1596,1597 · .wsa-list:1598 · .wsa-row:1599,1601 · .wsa-r:1602 · .wsa-n:1603
.wsa-s:1604 · .wsa-p:1605 · .wsa-prizes:1606 · .wsa-pz:1607,1610 · .wsa-reveal-medal:1611 · .lobby-bottom:1626,1629,1630,1632(+7)
.lobby-quiz-btn:1643 · .lobby-book-btn:1644,1645 · .lobby-foodquiz-btn:1646,1647 · .lobby-play-btn:1648,1652 · .lobby-exam-btn:1654,1655,1657 · .panel-overlay:1662,1667,4222,4223(+8)
.panel-box:1668 · .panel-head:1675,1679 · .panel-close:1680,1685 · .panel-body:1686,1690,1691 · .panel-page:1688,1689 · .collect-sub:1695
.mkt-empty:1696 · .craft-box:1697 · .mkt-listing:1698 · .mkt-filter:1699,2043 · .hq-grid:1706 · .hq-card:1707,1712,1736
.hq-head:1713 · .hq-pic:1719,1721 · .hq-emoji:1723 · .hq-badge:1724 · .hq-stars:1728 · .hq-price:1729,1734,1735,1738(+6)
.craft-credit:1742,1744,1745 · .car-grid:1752,1754,1755 · .robot-weap:1756 · .dmap-box:1759,1760 · .dmap-grid:1766 · .dmap-card:1768,1771,1772,1773(+2)
.dmap-ico:1775 · .dmap-new:1778 · .dcp-grid:1780 · .dcp-card:1782,1785,1786,1787(+10) · .levelup-box:1804,2924,2925,3046 · .dcp-box:1807,1808,1812,1813(+6)
.dcp-lock:1821 · .sold-badge:1825,1827,1828 · .rs-showroom:1830,4658,4659 · .rs-list:1831,1833,4639,4642 · .rs-thumb:1834,1836,1837,1838(+1) · .rs-thumb-pic:1839,1840
.rs-thumb-price:1841 · .rs-stage:1843 · .rs-big:1846 · .rs-big-img:1847 · .rs-elec:1851,1855,1860 · .rs-edge:1861,1867
.rs-info:1870,1871,1872,1873(+1) · .rs-buy:1875,1877,1878 · .cs-showroom:1882,4631,4632,4660(+3) · .cs-list:1883,1885,4633,4638(+9) · .cs-thumb:1886,1888,1889,1890(+1) · .cs-thumb-pic:1891,1892
.cs-thumb-name:1893 · .cs-thumb-price:1894 · .cs-thumb-own:1895 · .cs-stage:1897 · .cs-big:1900 · .cs-big-img:1901
.cs-elec:1905,1909,1913 · .cs-edge:1914,1920 · .cs-interior:1923 · .cs-inr-label:1924,1925 · .cs-inr-img:1926 · .cs-info:1928,1929,1930,1931(+6)
.cs-buy:1939,1941,1942,1943 · .car-emoji:1945 · .car-mine:1951 · .car-mine-pic:1956 · .car-mine-info:1957 · .car-loan:1958,1959
.car-mine-btns:1960,1961,1962 · .car-locked:1964 · .car-mine-head:1966 · .car-pick-list:1967,1968 · .car-pick:1969,1971,1972 · .car-pick-pic:1973,1974
.car-pick-name:1975,1976 · .car-pick-od:1977 · .car-buy-box:1979,3053 · .cb-pic:1980,1981,1982 · .cb-lines:1983 · .cb-li:1984,1988,1989
.cb-ins:1990,1994,1995 · .cb-plan:1996 · .cb-pl:1997,2002,2004,2008(+1) · .cb-total:2015 · .cb-btns:2016,2021 · .cb-x:2017
.shop-grid:2024 · .shop-item:2025,2030,2035,2036(+3) · .mkt-tab:2044,2045 · .pg-btn:2046,2047,2048 · .pg-dot:2049 · .fr-gift-btn:2072,2077
.gift-sec-title:2080 · .gift-in-row:2082 · .gift-out-row:2086 · .gift-in-pic:2087,2089,2090 · .gift-in-info:2091,2092 · .gift-in-btns:2093
.gift-accept:2094,2098,2100 · .gift-decline:2099 · .gift-box-card:2101 · .gift-box-from:2102,2103 · .gift-note:2104 · .gift-pick-overlay:2107
.gift-pick-box:2111 · .gift-pick-head:2117,2121 · .gift-pick-close:2122 · .gift-pick-tabs:2124 · .gp-tab:2125,2129 · .gift-pick-body:2130
.gp-chips:2131 · .gp-chip:2132,2136 · .gp-card:2137,2138 · .gp-price:2139 · .gp-note:2140 · .gift-cf-pic:2141
.chat-emoji-cats:2146 · .chat-emoji-cat:2150,2154,2155 · .chat-emoji-wrap:2156,2157 · .stage-left:2166,4213 · .pet-info-btn:2170,2177,2178 · .feed-list:2185,2189,2214,2215(+1)
.feed-empty:2190,2193 · .fd-tools:2199 · .feed-bell:2200,2202,2203,2204 · .fd-prog:2208,2209 · .fpost:2216,2806 · .fp-head:2221
.fp-who:2222 · .fp-name-line:2225 · .fp-name:2226 · .fp-when:2227 · .fp-badges:2229,2232 · .fp-badge-ic:2230
.fp-text:2234 · .fp-media:2237 · .fp-img:2239 · .fp-cap:2241 · .fp-big:2242 · .fp-sum:2244,2246
.fp-sum-rx:2247 · .fp-sum-none:2248 · .fp-en:2249 · .fp-bar:2251 · .fp-act:2252,2256,2258 · .fp-like:2257
.fp-page:2269,2270,2271,2272(+3) · .fp-rxbox:2275 · .fp-rxb:2279,2281,2282,2283(+1) · .fp-rxb-off:2285 · .fp-fly:2287,2290,2291 · .fcm-overlay:2294
.fcm-box:2296 · .fcm-post:2300,2301 · .fcm-rxs:2302 · .fcm-rx:2303 · .fcm-list:2304,2306 · .fcm-row:2307,2308,2309
.fcm-none:2310 · .fcm-quick:2312,2314 · .fcm-q:2315,2318,2319 · .fcm-add:2320 · .fcm-input:2321,2323 · .fcm-send:2324,2326
.fcm-locked:2327 · .fnt-overlay:2329 · .fnt-box:2331 · .fnt-list:2335,2337 · .fnt-row:2338,2340 · .fnt-ico:2341
.fnt-tx:2342,2343 · .fnt-sub:2344 · .feed-plate:2346 · .feed-all-btn:2347,2352 · .fdb-overlay:2357 · .fdb-box:2359
.fdb-head:2363 · .fdb-close:2367,2369 · .fdb-live:2370 · .fdb-live-title:2371 · .fdb-live-rows:2373,2375,2376 · .fdb-live-row:2377,2379,2380,2381
.fdb-dot:2382 · .fdb-list:2384,2385 · .fdb-empty:2386 · .fdb-row:2387 · .fdb-row-top:2389 · .fdb-ico:2390
.fdb-txt:2391 · .fdb-name:2392 · .fdb-ago:2393 · .fdb-actions:2394 · .fdb-like:2395,2398,2399,2400 · .fdb-cm-list:2401
.fdb-cm-row:2402,2404 · .fdb-cm-empty:2405 · .fdb-cm-add:2406 · .fdb-cm-input:2407,2409 · .fdb-cm-send:2410,2412 · .fdb-cm-locked:2413
.pi-overlay:2416 · .pi-box:2420,2425,2426,2430(+3) · .pi-close:2432,2437,2438 · .pi-close-left:2440 · .pi-portrait:2442 · .pet-wear:2449,2452,2454
.pi-portrait-wrap:2457,2459 · .pi-dress-btn:2467,2471,2472 · .pi-shape-cap:2473,2476,2477,2478 · .pi-shape-toggle-btn:2480,2483 · .pi-dress-pip:2485,2490,2491,2492(+1) · .pi-wear-note:2495,2497
.greet-card:2504 · .greet-sub:2505 · .greet-grid:2506 · .greet-opt:2507,2510,2511,2512 · .greet-e:2513 · .pi-streak:2517
.pi-streak-head:2519,2521 · .pi-streak-best:2522 · .pi-dots:2523 · .pi-dot:2525,2526,2527 · .pi-streak-note:2528 · .pi-care-title:2529
.lbf-overlay:2532 · .lbf-box:2535,2549,2550,2551(+10) · .lbf-head:2540 · .lbf-title:2541 · .lbf-tabs:2542,2545 · .lbf-note:2548
.lbf-close:2564 · .lbf-close-l:2565 · .lbf-body:2566 · .lbf-grid:2567 · .lbf-box-bcat:2586 · .lbf-bcat-wrap:2587
.lbf-bcat:2589 · .lbf-bcat-head:2591,2592,2593 · .lbf-bcat-mid:2600 · .lbf-bcat-badge:2601,2605 · .lbcat-ic:2603 · .lbcat-ic-label:2607
.lbf-bcat-rows:2609 · .lbf-one-row:2613,2614,2615 · .lbf-bcat-row:2616,2618,2619,2621 · .lbf-podium:2633 · .pod:2635,2662,2663 · .pod-char:2637
.pod-base:2639 · .pod-rank:2641 · .pod-label:2643,4702 · .pod-name:2645 · .pod-sc:2647 · .pod-1:2652,2653
.pod-2:2654,2655 · .pod-3:2656,2657 · .pod-4:2658,2659 · .pod-5:2660,2661 · .pl-wide:2680,2683,2684,2685(+8) · .pl-follow:2686,2691,2693
.pl-unfollow:2695,2701,2702 · .pl-followers:2703 · .pl-cols:2704,2709,2710,2711 · .pl-col:2705 · .pl-sec-title:2706 · .pl-badges-col:2712
.pl-feed:2713,2716,2723 · .pl-feed-row:2717,2721,2722 · .pl-assets-wrap:2725,4539,4614 · .pl-assets:2726,4542,4547,4553(+4) · .pl-asset:2729,2733,2740 · .pl-asset-emoji:2734
.pl-asset-n:2735 · .pl-pets-wrap:2742 · .pl-pets:2743 · .pl-pet:2744,2749,2751 · .pl-pet-nm:2752 · .img-lightbox:2755,2760,2761,2765(+3)
.cert-svg:2784 · .cert-tap:2785,2790 · .cert-chip-sm:2793 · .pl-sec-sub:2813 · .pl-certs:2814,2816 · .cert-mini:2817,2821,2823
.cert-mini-cap:2824 · .cert-none:2826 · .lv-cert-row:2828,2830 · .lv-cert-btn:2831,2836 · .cert-lightbox:2838,2843,2844,2848(+3) · .pl-chat:2868,2873
.pl-call:2875,2881 · .pet-peek:2882,2883 · .pp-chips:2885 · .pp-chip:2886 · .pp-gift:2891,2897 · .settings-box:2899,2900,2973,2978(+29)
.set-feed-head:2901 · .set-feed-sub:2905 · .set-feed-row:2906 · .pillinfo-val:2911 · .pillinfo-desc:2916,2935 · .pillinfo-box:2927
.plf-head:2930 · .plf-emoji:2931 · .plf-ht:2932,2933,2934 · .plf-foot:2936,2938,2939 · .alert-box:2944,2946 · .ab-emoji:2947
.ab-title:2948 · .ab-desc:2949 · .ab-btns:2950,2951,2952 · .heal-heart:2954 · .attn-box:2969 · .set-tabs:2980,2982
.set-panels:2983 · .set-panel:2984,2985 · .help-box:3027,3028,3029 · .wl-box:3047 · .food-box:3048 · .home-shop-box:3050
.summary-box:3051 · .report-box:3052 · .wl-grid:3055 · .tc-wrap:3057 · .spell-btn:3063,3068 · .sp-hud:3069
.sp-word:3071 · .sp-ch:3072,3077 · .sp-th:3079 · .sp-hint:3081 · .sp-exit:3084,3088 · .sp-banner:3089
.sp-big:3094 · .sp-thb:3096 · .sp-coin:3097 · #spell-confetti:3102 · .sp-rb:3103 · .sp-day:3113
.sp-perfect:3115 · .sp-late:3117 · #spell-coinpop:3120 · .side-sub:3229,3231 · .sec-quest:3236 · .on-page:3247,3248,3249,3250
.inbox-overlay:3260 · .ib-box:3262 · .ib-head:3266 · .ib-close:3270,3272 · .ib-list:3273,3274 · .ib-row:3275,3276,3277,3278
.ib-ava:3279,3284,3285 · .ib-on:3286 · .ib-mid:3288 · .ib-name:3289 · .ib-last:3290 · .ib-meta:3291
.ib-time:3292 · .ib-dot:3294 · .ib-story-badge:3297 · .ib-empty:3301 · .ib-story:3303,3305 · .ib-story-item:3306,3308,3315
.ib-story-ava:3309 · .ib-story-on:3313 · .ib-world:3318,3321 · .ib-tabs:3323 · .ib-tab:3324,3327,3329 · .ib-tab-dot:3330
.ib-call-ava:3334 · .ib-call-row:3335,3336 · #btn-music:3342,3345,3346 · #ws-overlay:3361 · #ws-board:3364,3370,3372 · .ws-head:3375
.ws-title:3376 · .ws-findbar:3379 · .ws-tip:3380 · .ws-grade:3382,3383 · .ws-body:3386 · .ws-gridwrap:3387
#ws-grid:3390 · .ws-cell:3395,3400,3403,3406(+2) · .ws-flash:3412,3414 · .ws-coinpop:3418,3442 · .ws-combo:3429,3433,3434,3435 · .ws-find:3446
#ws-prog:3447 · #ws-words:3451,3455 · .ws-word:3457,3462,3463,3464(+2) · .ws-actions:3470,3471,3480 · .ws-sizes:3475 · .ws-sizes-lb:3477
.ws-size-now:3478 · #ws-new:3481 · #ws-stash:3482 · #ws-clear:3483 · #ws-win:3484,3486 · .ws-win-in:3487,3490
.sec-online:3513 · .rank-tab:3541,3542,3543,3544(+2) · .pet-show-bg:3574,3577,3581,3585(+19) · .ps-night-fx:3677,3679,3691,3696(+1) · .pet-show:3706,3709,3721,3723(+22) · .ps-video:3842
.ps-worn-pip:3920,3921 · .id-card:3944,3951,3955 · .id-chip:3968 · .clock-chip:3977,3978 · .coin-block:3994 · .coin-group:3995
.coin-pill:4025,4026,4047 · .cp-lb:4050 · .cp-v:4051 · .nw-sub:4119 · .top-flex2:4210 · #panel-factory:4229,4230,4234,4235(+39)
#panel-rank:4370,4371,4377,4382(+11) · .grid2x8:4453,4459 · .grid1x5:4469,4475 · .pl-badges-strip:4481 · .pl-badge-card:4485,4491 · .pl-badge-card-ic:4492,4496
.pl-badge-card-nm:4497 · .pl-badges-empty:4503,4505 · .mine-strip:4519,4521,4522,4527(+4) · .mb-strip:4533,4572 · .gmark:4680,4684,4685,4686(+1) · .gm-stack:4689,4693
.gm-row:4695 · .lb-name:4697,4698,4699 · .grade-edit:4720,4725,4726 · .gradelock-box:4730,4746,4751,4753 · .gl-head:4731 · .gl-emoji:4732
.gl-ht:4733 · .gl-cur:4734 · .gl-lock:4735,4740 · .gl-ok:4739 · .gl-lock-sub:4741 · .gl-why:4742
.gl-pick-lb:4743 · .gl-opts:4744 · .gl-hist:4754 · .gl-hline:4755 · .gl-hg:4759 · .gl-hat:4760
.gl-harr:4761 · .gl-foot:4762 · .gl-cf:4763 · .reg-gradelock:4785 · #tp-overlay:4795 · #tp-board:4797,4801
.tp-head:4805 · .tp-title:4806 · .tp-stat:4808,4810 · .tp-pts:4812,4815 · .tp-close:4817,4823,4824 · .tp-snd:4827,4830,4836,4837
.tp-snd-ic:4831 · .tp-snd-track:4832 · .tp-snd-thumb:4834 · .tp-prompt:4841 · .tp-word:4843,4857,4858 · .tp-ch:4845,4850,4851,4853
.tp-thai:4861 · .tp-hint:4863 · .tp-empty:4865 · .tp-keys:4868 · .tp-row:4870 · .tp-row-fn:4872,4905
.tp-key:4876,4888,4890,4896(+2) · .tp-key-fn:4903 · .tp-fx:4909 · .tp-coinpop:4910 · .tp-pop-pt:4915 · #city-backdrop:4929,4935
.city-arrive:4936,4937 · .night:4951,4971,4972,4974(+2) · #night-veil:4997

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
