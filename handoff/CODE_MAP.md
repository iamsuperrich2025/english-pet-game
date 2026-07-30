# CODE_MAP.md — แผนที่โค้ด:บรรทัด (เจนอัตโนมัติโดย `tools/gen_code_map.py` — **ห้ามแก้มือ** เดี๋ยวโดนเขียนทับ)

> วิธีใช้: หาชื่อฟังก์ชัน/ค่าคงที่/selector ในไฟล์นี้ (Grep หรือกวาดตา) → `Read` ไฟล์จริง `offset=<บรรทัด>` `limit=40`
> 🗂️ ไฟล์อ้วนมี **สารบัญโซน** (`st-end ชื่อโซน`) — งานทั้งระบบ/โลก 3D: Grep ชื่อโซน → Read/Edit เฉพาะช่วงนั้น **ห้ามอ่านทั้งไฟล์** · เพิ่มระบบใหม่ในไฟล์อ้วนต้องครอบ banner `/* ==== */`+ชื่อโซน (สารบัญเจนเอง)
> css = index `selector:บรรทัดทุกจุดที่ประกาศ` (บั๊ก UI เริ่มหาที่นี่) · เจนใหม่ทุกครั้งที่รัน `python tools/rotate_handoff.py` · อัปเดต: 2026-07-30

## js/adv3d_css.js (1,087 บรรทัด · 0 รายการ)

## js/adv3d_intro.js (72 บรรทัด · 0 รายการ)

## js/adv3d_tex.js (245 บรรทัด · 19 รายการ)
TILE_COLORS:9 · letterTexture:10 · letterTextureDark:27 · emojiTexture:40 · GHOST_IMG_MAX:52 · measureGhostBox:58
probeGhostImages:71 · whenGhostsReady:83 · ghostTexture:87 · ghostScareSrc:92 · AD_STYLES:100 · adBoardTexture:109
addAdBillboard:156 · ringAds:167 · BUILDING_TINTS:177 · FACADE_ROWS:179 · buildingFacadeTexture:180 · makePeerSprite:205
bind:241

## js/adventure3d.js (11,885 บรรทัด · 578 รายการ)
### 🗂️ สารบัญโซน js/adventure3d.js (Read/Edit เฉพาะช่วง)
- 1-217 adventure3d.js — โลก 3D First-person 2 โหมด (คิว 7725691507 ข้อ 8 + ต่อยอด)
- 218-281 ⚽ โหมดสนามฟุตบอล (โหมด soccer · รอบ 196) — เล็ง+ชาร์จพลังเตะบอลใส่ป้ายตัวอักษร
- 282-336 🤖 โหมดหุ่นยนต์นักรบ (โหมด mecha · รอบ 199) — มุมมองในหุ่นสูง 5m เดินยิงเอเลี่ยนตัวอักษร
- 337-479 📻 หอบังคับการบิน (รอบ 64 · รอบ 66 เปลี่ยนเป็นอังกฤษล้วนตามผู้ใช้สั่ง)
- 480-500 คำศัพท์ — ตามระดับชั้น + ไม่ซ้ำคำที่ประกอบแล้ว (8.1/8.6) · แยกคลังต่อโหมด
- 501-639 Texture ตัวอักษร / emoji / ป้ายชื่อผู้เล่น (canvas → sprite)
- 640-810 🧱 ตัวละครบล็อก (โลกขับรถ) — เลือกก่อนออกรถ · เพื่อนใน map เห็นเป็นหุ่นบล็อกขับรถบล็อก
- 811-1117 🚙 รอบ 393: รถเพื่อนในโลกขับรถ = โมเดลจริง img/models/car_01.glb (ผู้ใช้สั่ง)
- 1118-1270 สร้างฉาก static ครั้งเดียวต่อโหมด
- 1271-1586 🚗 เมืองกำแพงเพชรจริง (โหมด drive) — ข้อมูล OpenStreetMap ใน js/data/city_kpp.js
- 1587-1653 🧭🕳️ รอบ 782 — ปิดช่องขาดของกริดถนน (ผู้ใช้: "GPS พาไปช่วงที่ถนนขาดตอน / ขับต่อไม่ได้")
- 1654-1875 🌉 รอบ 788 — ปูถนนเชื่อม "เกาะถนนโดดเดี่ยว" เข้าโครงข่ายหลัก
- 1876-1892 🌅 ท้องฟ้าภาพจริง (รอบ 203) — ใส่ภาพ panorama 360° (equirectangular 2:1) เป็นฉากหลังท้องฟ้า
- 1893-1932 🧱 เทกซ์เจอร์ภาพจริง (รอบ 323) — วางไฟล์ `img/tex/<key>.jpg` (หรือ .png) แล้วแปะทับพื้นผิวทันที
- 1933-2426 🌌 ท้องฟ้ากลางคืนโรงแรมผีสิง (รอบ 694) — ผู้ใช้: "ข้างนอกโรงแรมยังไม่น่ากลัวพอ"
- 2427-2465 🏨 โรงแรมผีสิง (รอบ 684) — ตัวตึก 5 ชั้นสร้างใน js/hotel3d.js
- 2466-2629 ตัวอักษรในโลก (8.2)
- 2630-2684 🔠🪙 เก็บตัวอักษร 1 ตัว = ได้ 1 เหรียญ (รอบ 345)
- 2685-2747 ประกอบคำอัตโนมัติเมื่อมีตัวอักษรครบ (8.1/8.4)
- 2748-2842 โหมด adv: monsters ยิงสู้ได้ (สเปกเดิม 8.5)
- 2843-2850 👻 ผีในโรงแรม (รอบ 684 — เขียนใหม่ทั้งชุด · ผู้ใช้สั่งข้อ 10-13, 18)
- 2851-2979 🧟 โมเดลผี 3D (รอบ 689 — ผู้ใช้สั่ง: "ภาพผีแบน ๆ ไม่สมจริง ไม่น่ากลัว ใช้โมเดลแทน")
- 2980-3206 🔦👻 รอบ 778 (ผู้ใช้สั่งข้อ 4) — กติกาใหม่ของผีเดินเพ่นพ่านในโรงแรม
- 3207-3453 🏨 ระบบโรงแรมผีสิง (รอบ 684) — เดินขึ้นชั้น/ไฟดับ/ไฟฉาย/ตู้เสื้อผ้า/รูปตามอง
- 3454-3667 เสียงหลอนโหมดผีสิง — สังเคราะห์ Web Audio (ปลอดลิขสิทธิ์ 100%)
- 3668-3992 Multiplayer — ผู้เล่นอื่นใน map เดียวกัน (สไตล์ Roblox)
- 3993-4192 Voice chat ใน map — WebRTC P2P mesh (เสียงวิ่งตรงระหว่างเครื่อง)
- 4193-4279 🏁 พิธีประกาศแชมป์ (ครูกด "จบรอบแข่ง") — /class/<map>/podium
- 4280-4485 HUD
- 4486-5113 DOM overlay + CSS (สร้างครั้งเดียว — self-contained ไม่แตะ style.css)
- 5114-5244 Input — เมาส์+คีย์บอร์ด และจอสัมผัส (มือถือ landscape)
- 5245-5249 🚁 โหมดเฮลิคอปเตอร์ Bell — ฟิสิกส์บินแบบอาร์เคด (สไตล์ Helicopter Flight Pilot)
- 5250-5641 🛸 โดรน FPV (โหมด drone) — บินเร็ว/คล่อง ลอดหน้าต่างเข้าตึกร้าง เก็บตัวอักษรในห้อง
- 5642-5764 🚗 โหมดขับรถเมืองกำแพงเพชร — ฟิสิกส์รถอาร์เคด (bicycle model)
- 5765-5858 🚦 รอบ 133: ไฟจราจรจริงที่ทางแยกใหญ่ + ฝ่าไฟแดงโดนใบสั่ง ม.22
- 5859-6306 🧭 GPS นำทาง (โหมด drive) — เลือกตัวอักษรเป้าหมาย + เส้นทางตามถนนจริง (A*) · นำทางด้วยภาพล้วน (ไม่มีเสียงพูด ตั
- 6307-6365 🎛️ เข็มหน้าปัดวิ่งจริง (สปีด 0-180 + วัดรอบ 0-8×1000) — วาดทับวงเกจของภาพ dash.png
- 6366-6450 🎵 รอบ 181: วิทยุในรถ — จอ head-unit กลางคอนโซล (visualizer + เลือกเพลง 3 โหมด)
- 6451-6483 🪞📷 รอบ 806: กระจกมองหลัง/ข้าง — เรนเดอร์ฉากเดิมซ้ำด้วยกล้องหันหลัง/เฉียงข้าง แล้วยัดลงกรอบบนจอ (scissor)
- 6484-6611 🪆 รอบ 191: ตุ๊กตาดุ๊กดิ๊กหน้ารถ — รูปตัวละครที่ผู้เล่นเลือก (blkN.png)
- 6612-6915 🚔 รอบ 128: แผงเตรียมออกรถ + กฎหมายจราจร + ใบสั่ง
- 6916-6958 🛩️📦 ภารกิจไปรษณีย์กลางคืน (รอบ 353) — เฉพาะช่วงฟ้ามืด (heliNight>.5)
- 6959-8146 🚶🛗🚁🪂 โหมดเดินเท้าในเมืองเฮลิฯ (รอบ 354 — ผู้ใช้สั่ง)
- 8147-8220 🎛️ หน้าปัดเข็มขยับจริง (รอบ 61) — วาดสดทุกเฟรมจากค่าการบินจริง
- 8221-8490 🌧️☀️ ชั้นบนกระจก: ที่ปัดน้ำฝน + แสงแดดสาด (รอบ 346)
- 8491-8895 🔊🌧️ เสียงที่ปัดน้ำฝน (รอบ 537) — สังเคราะห์ล้วน ไม่มีไฟล์เสียง
- 8896-8965 📹 กล้องใต้ท้องเครื่อง (belly cam) — รอบ 348
- 8966-9037 🎯 วงเป้าลงจอด (รอบ 349) — ไฮไลต์ดาดฟ้าที่มีตัวอักษร ให้รู้ว่าควรร่อนลงตรงไหน
- 9038-9653 📏 แถบเตือนความเร็วดิ่ง (รอบ 349) — ลงเร็วเกินกรอบกล้องกะพริบแดง สอนให้ร่อนลงนุ่มๆ
- 9654-9656 Loop หลัก
- 9657-10883 ⚽ โหมดสนามฟุตบอล — ฟิสิกส์บอล + เล็ง + ชาร์จพลัง + กล้อง 1st/3rd + ชุดนักเตะ
- 10884-11337 🤖 โหมดหุ่นยนต์นักรบ — เดินยิงเอเลี่ยนตัวอักษร (ต้องยิงเรียงลำดับในคำ)
- 11338-11357 เข้า/ออกโลก
- 11358-11885 ❓ การ์ด "วิธีเล่น" ตอนเข้าโลกครั้งแรก (จำแยกต่อโลกใน localStorage — ไม่แตะ state.js)
### รายการ js/adventure3d.js
GUIDE_WORDS:20 · RELOCATE_MS:21 · HALF:22 · PLAYER_SPEED:23 · HAUNT_LIVES:24 · HAUNT_IFRAME:25
PICK_DIST:26 · EYE_H:27 · NET_SEND_MS:28 · MODES:31 · SHOOT_GAP_MS:95 · MONSTER_REWARD:96
AD_COUNT:97 · AD_RENT_COIN:98 · AD_RENT_MS:99 · SHOP_ADS:103 · PILOT_TIERS:105 · pilotEmoji:106
DRONE_R:118 · DRONE_ACCEL:119 · DRONE_VMAX:120 · DRONE_CLIMB:121 · DRONE_YAWSP:122 · DRONE_GRAV:123
CAR_EYE:127 · CAR_ACCEL:128 · CAR_BRAKE:129 · CAR_VMAX:130 · CAR_LEGAL_KMH:131 · CAR_FINE_SPEED:132
CAR_FINE_BELT:133 · CAR_REPAIR_FEE:134 · CAR_FINE_SIGNAL:135 · CAR_RAM_FEE:136 · CAR_FINE_RED:137 · CAR_VMAX_OFF:138
CAR_VREV:139 · CAR_WB:140 · CAR_STEER_MAX:141 · HELI_SKID:176 · HELI_CRASH_FINE:177 · HELI_MESH_SCALE:178
ASSIST_R:181 · PROP_STALL_MS:186 · PROP_BREAK_SPD:189 · PROP_BROKEN_MUL:190 · BAT_DRAIN:193 · BAT_LETTER:194
BAT_LOW:195 · BAT_EMPTY_MUL:196 · CHG_R:199 · GATE_R:202 · showHeliSkip:209 · BOLT_MIN:210
GLASS_HIT_R:211 · DOOR_R:212 · SOCCER_SHIRTS:222 · BALL_R:227 · GOAL_HW:228 · KICK_SPD_MIN:229
AIM_YAW_SP:230 · SOCCER_TILES:231 · AIM_STICK:239 · CURL_SWIPE:242 · CURL_SPIN:243 · HIT_LIFT:247
GUIDE_N:248 · FK_SPOT_Z:254 · FK_MAN_R:255 · AURA_COST:260 · SB_DRAG:267 · SPOST_R:268
GK_Z:273 · GK_SPRITES:274 · PK_TIME:276 · MECHA_EYE:286 · ALIEN_COUNT:287 · MECHA_MAX_HP:288
MECHA_ATK_RANGE:289 · ALIEN_SHOT_SPD:290 · POWERUP_GAP:291 · BOSS_SCALE:292 · COMBO_X2:293 · BOSS_SPECIES:296
pickBossSpecies:304 · WAVE_BASE_GOAL:306 · waveCfg:307 · MECHA_WEAPONS:316 · ATC_REPLIES:345 · ATC_CLOSERS:350
ATC:355 · netUp:473 · CHAT_MAX:476 · doneList:483 · wordPool:484 · pickWords:497
adRenterActive:509 · FACADE_ROWS:518 · adsFetch:524 · adsWatch:536 · adsStop:543 · adsChanged:544
adRentBuy:555 · heliMusicTick:578 · AD_FLYBY_COIN:582 · adFlybyTick:584 · adShopOpen:603 · adShopRender:617
BLOCK_AVATARS:646 · blkGeo:657 · blkMat:658 · blkCyl:659 · blkFaceMat:661 · makeBlockFigure:676
makeBlockCar:716 · blkNameSprite:762 · makeBlockPeer:778 · makeBlockWalkPeer:799 · disposeBlockPeer:807 · CAR_GLB_URL:818
CAR_GLB_LEN:819 · carSplitWheel:823 · carGlbEnsure:850 · carMatGet:869 · carGlbBuild:885 · carAvCode:934
driveCamToggle:941 · SKID_N:960 · skidGeomGet:962 · skidDrop:967 · skidTick:981 · blkBuildThumbs:991
blkBuildPicker:1009 · pickBlockAvatar:1054 · bubbleSprite:1077 · showPeerBubble:1104 · removePeerBubble:1112 · concreteTexture:1122
brokenWindowTexture:1139 · intactGlassTexture:1155 · chargeIconTexture:1173 · rustyDoorTexture:1182 · dAddBox:1196 · buildAbandoned:1203
makeNameSprite:1276 · flatGeom:1289 · flatGeomUV:1298 · buildDriveCity:1308 · SKY_IMG:1883 · applySky:1884
applyTex:1900 · HSKY_R:1947 · hskyTex:1949 · buildHauntSky:1954 · tickHauntSky:2084 · buildScene:2102
randPos:2469 · randRoadPos:2477 · HOTEL_PER_ROOM:2492 · HOTEL_MIN_GAP:2493 · hotelSpot:2494 · hotelPruneLetters:2529
spawnLetter:2538 · spawnLettersForWord:2577 · ensureCoverage:2579 · relocateLetters:2595 · removeLetter:2624 · LETTER_COIN:2635
pickUpLetter:2636 · letterPop:2650 · letterChime:2668 · tryCompleteWords:2688 · completeWord:2702 · spawnMonster:2751
killMonster:2760 · tickMonsters:2768 · damagePlayer:2790 · shoot:2806 · tickShots:2820 · GHOST_GLB_URL:2860
GHOST_MODEL_H:2861 · ghostGlbEnsure:2863 · buildGhostMesh:2889 · makeGhostSprite:2911 · spawnGhost:2929 · applyGhostSize:2954
faceGhostToPlayer:2965 · setGhostVis:2971 · GHOST_MIN_FLOOR:2987 · TORCH_LOCK_S:2988 · BANISH_S:2989 · ghostsAllowed:2991
hotelCorridorX:2996 · torchHitsGhost:3005 · ghostBanish:3012 · ghostGoLurk:3021 · ghostGoStalk:3031 · ghostGoBehind:3043
tickGhosts:3051 · sessionRecapHtml:3141 · hauntRunSec:3148 · fmtSurv:3149 · hauntSurviveFinish:3150 · tickSurvive:3160
renderHearts:3174 · hotelScare:3180 · knockedOut:3200 · BLACKOUT_MS:3220 · FLICKER_MS:3221 · DARK_LETTER:3225
tintSprite:3226 · hotelReset:3229 · setTorch:3253 · toggleTorch:3269 · tickTorch:3274 · hotelBlackout:3284
hotelFlicker:3300 · tickHotelPlayer:3312 · tickHotelWorld:3364 · hotelAct:3407 · openWardrobe:3424 · announceTarget:3447
netReady:3673 · netJoin:3679 · sendPos:3699 · sendChat:3741 · toggleChatBox:3755 · onPeerData:3766
disposeHeliMesh:3854 · removePeer:3859 · netLeave:3874 · tickPeers:3880 · RTC_CFG:4001 · tinvLinked:4002
partyWord:4009 · syncPartyWord:4022 · updateVoiceBtns:4174 · PODIUM_BONUS:4199 · podiumJoin:4201 · podiumLeave:4212
endRound:4213 · showPodium:4224 · tinvCheck:4264 · showBanner:4284 · renderHudTop:4290 · renderHudWords:4295
renderHudInv:4305 · ddTierFromName:4312 · renderBoard:4314 · drawBigMap:4351 · openBigMap:4406 · closeBigMap:4414
drawMinimap:4419 · loadCarDash:4491 · loadCarWheel:4503 · buildDom:4513 · confirmExit:5098 · IS_TOUCH:5117
bindInput:5118 · movePlayer:5210 · tickPlayer:5220 · collideDrone:5253 · propStall:5272 · propBreak:5279
propFix:5286 · droneBatAdd:5293 · lightningBolt:5296 · startRain:5307 · stopRain:5321 · smashGlass:5323
awardGlass:5334 · neededLetter:5351 · openDoor:5366 · raceStartRun:5386 · raceStop:5393 · gateHighlight:5411
renderRaceHud:5418 · tickDrone:5427 · nearMissTick:5569 · showNearMiss:5593 · awardDaredevil:5604 · comboCheer:5621
comboFlash:5637 · driveCell:5646 · nearestStreet:5652 · collideCar:5662 · tlDotY:5693 · tlSet:5697
driveArms:5714 · tlTick:5726 · TL_GREEN:5770 · tlRedDur:5772 · tlightPhase:5773 · buildTrafficLights:5780
rlTick:5832 · cellDrivable:5864 · cellWeight:5867 · cellBlocked:5872 · cellCenter:5873 · posReachable:5875
losClear:5886 · nearestDrivableCell:5897 · routeGrid:5909 · pickGpsTarget:5962 · NAVLINE_W:5985 · NAVLINE_SKIP:5986
navLineEnsure:5987 · navLineHide:5997 · navLineUpdate:5998 · tickGps:6034 · tickDrive:6105 · drawCarDial:6313
drawCarGauges:6343 · RADIO_RECT:6371 · CAR_RADIO_RECT:6373 · carRadioRect:6379 · radioLayout:6381 · radioSetHint:6404
renderRadioList:6410 · radioToggleList:6420 · drawRadioViz:6425 · radioTick:6443 · MIRROR_REAR:6457 · mirrorPass:6459
drawCarMirrors:6471 · BOBBLE_FOOT:6489 · BOBBLE_H:6490 · BOBBLE_ASPECT:6491 · BOB_OMEGA:6494 · BOB_PITCH_FORCE:6496
BOBBLE_SKINS:6498 · bobbleSetAvatar:6505 · bobbleLayout:6512 · bobbleTick:6525 · bobblePoke:6550 · bobbleApplySkin:6567
dollOwned:6577 · openDollPicker:6578 · carStartShow:6615 · showLawInfo:6633 · lawNotice:6655 · driveFineSettle:6665
HELI_PHASES:6844 · heliStartPhase:6851 · heliFloorAt:6858 · SOFT_TIERS:6868 · softLandBonus:6870 · awardPerfLand:6883
setHeliLight:6902 · MAIL_COIN:6921 · mailStart:6923 · mailStop:6946 · mailTick:6947 · FOOT_EYE:6966
doorSlideSfx:6972 · doorLerp:6995 · entLerp:7003 · footStepSfx:7013 · WRING_COIN:7034 · festivalPaint:7038
dustTexture:7050 · dustBurst:7059 · dustTick:7073 · HELI_GLB_URL:7094 · HELI_GLB_TEX_BLUE:7096 · HELI_GLB_ROTOR:7098
HELI_GLB_TROTOR:7099 · heliGlbEnsure:7101 · heliMatBlueGet:7119 · heliGlbAssemble:7132 · heliNavTick:7171 · peerRotorStop:7178
peerRotorTick:7184 · heliCrashSfx:7203 · heliMeshBuild:7231 · heliMeshBuildLegacy:7242 · buildHeliFoot:7372 · footFloorAt:7488
insideTerm:7495 · inDoorZone:7496 · footHint:7500 · setFootBtns:7501 · liftStart:7506 · beginRide:7517
endRide:7540 · beginWing:7551 · awardAirLetter:7564 · paxChoiceShow:7583 · paxChoiceHide:7609 · pilotShipMesh:7613
beginPilot:7614 · endPilot:7646 · drawCabinWindow:7670 · tickHeliFoot:7694 · tickHeli:7903 · CP_NAT:8155
CP_GAUGES:8156 · SEAT_LABEL:8169 · SEAT_P_FULL:8170 · SEAT_ZOOM:8171 · DASH_OFF_Y:8172 · DASH_DROP:8173
setSeat:8175 · layoutCockpit:8187 · WIPER:8226 · WIPER_SPD:8229 · WIPER_LABEL:8230 · INT_GAP:8231
WASH_MS:8235 · WASH_TANK_MAX:8239 · SMEAR_LIFE:8251 · CHOP_MIN:8252 · SUN_RAY_FAR:8256 · sunRayBlocked:8258
sunShadeTick:8277 · applyCockpitShade:8288 · rotorChop:8300 · sunUpdate:8308 · HELI_FOG_N0:8319 · fogUpdate:8323
adGlowPulse:8369 · RAIN_MAX:8378 · VISOR_Y:8379 · RAIN_MIN:8380 · RAIN_DUR:8381 · DROP_ZONE:8385
addDrop:8386 · tickDrops:8394 · addWashDrop:8412 · washStart:8419 · renderWashGauge:8439 · washTick:8450
grimeTick:8467 · WIPE_R:8474 · wipeDrops:8475 · wiperSndOn:8498 · wiperSndOff:8510 · wiperThunk:8516
washSpraySfx:8528 · wiperSqueak:8545 · wiperSndTick:8562 · setWiper:8582 · tickWiper:8594 · SH_SWEEP:8625
shadowSweepTick:8627 · REFL_MAX:8639 · REFL_COL:8641 · cityGlowLevel:8642 · drawCityGlow:8647 · setVisor:8679
rainTick:8685 · drawBlade:8702 · drawSmears:8721 · drawGlass:8741 · drawBellyCam:8903 · drawBellyHud:8926
drawLandingTargets:8972 · VS_HARD:9042 · drawDescentBar:9043 · heliShake:9092 · cpNeedle:9103 · drawGauges:9120
XF_START:9168 · PRELOAD_WAIT:9169 · ALT_QUIET_FROM:9171 · ALT_MAX_DAMP:9172 · ALT_LP_MIN:9173 · ECHO_NEAR:9174
WIND_FULL_SPD:9175 · SHUTDOWN_SEC:9176 · PAN_MAX:9178 · OD_RPM:9179 · SHAKE_RPM:9180 · SHAKE_HIT:9181
soccerLetterPos:9661 · letterNeeded:9669 · soccerNeededSet:9674 · soccerTileGeo:9680 · soccerGoldTexture:9682 · makeSoccerTile:9699
soccerRefreshSkins:9708 · soccerBuildTargets:9715 · soccerNextTile:9725 · soccerRetarget:9738 · soccerCoinPop:9750 · soccerGrassTexture:9763
soccerTurfGrade:9785 · soccerTurfTexture:9808 · grassNormalTexture:9827 · soccerLinesTexture:9856 · soccerNetTexture:9907 · soccerCrowdTexture:9915
soccerBallMat:9934 · buildSoccerGoal:9954 · buildStands:9973 · soccerLedBoards:10008 · soccerGKEnsure:10105 · soccerGKTick:10121
fkBuildWall:10150 · fkToggle:10165 · fkHitTest:10181 · pkHud:10200 · pkStart:10209 · pkEnd:10223
pkTick:10238 · repQualify:10245 · repEnsureEl:10248 · repStart:10259 · repTick:10266 · soccerNumTex:10291
makeSoccerPlayer:10301 · soccerNewSpot:10327 · soccerResetBall:10339 · soccerKick:10346 · soccerCheer:10363 · guideTexture:10366
auraActive:10390 · auraLeftMs:10391 · buildAura:10393 · auraBuy:10414 · auraRender:10424 · auraTick:10438
buildDrill:10458 · drillTick:10471 · buildLandRing:10508 · buildGuideRibbon:10518 · renderSpinPad:10543 · spinPadToggle:10555
spinPadPick:10561 · renderCurl:10573 · kickLaunch:10584 · updateSoccerGuide:10592 · soccerCamera:10656 · tickSoccer:10677
soccerKitShow:10857 · soccerKitGo:10872 · emojiSprite:10925 · makeAlien:10930 · startWave:10963 · waveSpawnFill:10974
waveComplete:10983 · updateWaveHud:10993 · checkMechaBossBadge:10995 · alienSpawnPos:11004 · removeAlien:11009 · mechaHudWord:11014
setMechaHudSkin:11022 · mechaComboPop:11034 · mechaShielded:11039 · mechaDamageFx:11041 · mechaHitByAlien:11046 · spawnAlienShot:11052
removeAlienShot:11062 · tickAlienShots:11067 · spawnPowerup:11079 · removePowerup:11092 · collectPowerup:11097 · tickPowerups:11104
updateMechaHud:11113 · mechaTracer:11153 · mechaFire:11162 · explodeAlien:11199 · tickMecha:11229 · loop:11285
grabShot:11318 · savePhoto:11329 · clearEntities:11341 · INTRO_KEY:11362 · introSeenObj:11363 · introSeen:11364
markIntroSeen:11365 · INTRO:11366 · showIntro:11367 · closeIntro:11392 · beginPlay:11398 · start:11400
exitWorld:11598 · mechaRecapLine:11667

## js/auth.js (389 บรรทัด · 32 รายการ)
AUTH_PUSH_MS:23 · AUTH_SDK_TIMEOUT_MS:24 · TEACHER_EMAILS:28 · isTeacher:29 · TESTER_EMAILS:42 · TESTER_COINS:43
isTester:44 · testerBoost:48 · authSetStatus:74 · authShowLogin:86 · authGateOffline:90 · authSaveRef:97
authFetchCloud:98 · authWriteCloud:99 · authDeleteCloud:100 · authWriteProfileName:101 · authPushProfile:108 · authApplyProfileName:116
authAskProfileName:132 · authEditProfileName:143 · authStart:154 · updateOfflinePill:184 · authEnterOffline:189 · authLateSync:206
authLoginClick:222 · authOnLogin:241 · authSyncOnLogin:254 · authFreshStart:283 · authAskLink:292 · authEnterGame:342
authPushSave:357 · authLogout:368

## js/award.js (271 บรรทัด · 0 รายการ)

## js/bandadv.js (394 บรรทัด · 24 รายการ)
BAND_ADV_REWARD:9 · bandAdvFailMsg:16 · bandAdvLoad:23 · bandAdvPlay:61 · BAND_ADV_EXAM:76 · bandAdvExamId:81
bandAdvExamName:83 · BAND_ADV_SUPREME_BONUS:90 · bandAdvCheckSupreme:91 · bandAdvExamLock:107 · bandAdvExamBest:116 · bandAdvExamCat:129
bandAdvShowExamSummary:146 · bigExamBadgeNote:174 · BXR_TOP:192 · bxrIdByLabel:196 · bxRankRows:202 · bxrRowHTML:235
bxRankBodyHTML:247 · bxRankMount:261 · bxRankNote:286 · openBigExamRank:292 · bandAdvExamOpen:309 · bandAdvCardsHTML:363

## js/cert.js (620 บรรทัด · 30 รายการ)
CERT_MAX:17 · CERT_ISSUER_EN:18 · CERT_MONTHS:19 · CERT_TOPIC_EN:23 · CERT_LEVEL_EN:44 · CERT_ADV_EN:49
CERT_BIG_LV:56 · certThIndex:60 · certTitleOf:69 · certSerial:91 · certDateEN:99 · certTier:107
CERT_TIER_META:114 · CERT_LOGO_SRC:120 · certAward:129 · certMine:152 · certAwardGold:159 · certAwardAdvSupreme:180
certBackfill:196 · certCatNameById:224 · certFromPost:249 · certXML:267 · certFit:272 · certHolder:277
certSVG:287 · certChipHTML:559 · openCertBig:574 · openCertMine:590 · certStripHTML:598 · certBindStrip:612

## js/dictband.js (410 บรรทัด · 27 รายการ)
BAND_EMOJI:12 · BAND_SET_REWARD:13 · BAND_DONE_BONUS:14 · bandFailMsg:21 · bandLoad:28 · bandShortTH:60
bandCat:68 · bandSets:90 · bandSetId:99 · bandCheckComplete:102 · bandSetCat:119 · BAND_RETAKE_MAX:131
bandTriedSets:132 · bandRetakeCat:143 · bandShowRetakeSummary:177 · bandSetsPassed:205 · openBandSetPicker:213 · bandMine:285
bandUnlocked:286 · bandLockToast:291 · bandExamLobby:297 · updateBandExamBtn:306 · bandLobbyTick:323 · bandPlay:334
bandSpeakSample:346 · bandPlayLobby:366 · bandCardsHTML:378

## js/game.js (1,111 บรรทัด · 79 รายการ)
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
updateTimerBar:717 · updateComboPill:723 · pickCard:727 · checkMatch:739 · renderCats:853 · fmtMMSS:899
quizTimerStop:903 · quizTimerStart:908 · quizElapsed:918 · startQuiz:922 · renderQuizQuestion:940 · quizNext:1004
finishQuiz:1017

## js/gradelock.js (158 บรรทัด · 14 รายการ)
GRADES:21 · GRADE_LOCK_DAYS:25 · GRADE_LOCK_MS:26 · gradeRank:29 · myGrade:30 · gradeHistList:33
gradeLockLeftMs:43 · gradeLockLeftDays:50 · gradeUnlockAt:51 · gradeLocked:52 · gradeUpOptions:55 · gradeChangeTo:62
gradeLockNote:86 · openGradeChange:94

## js/hotel3d.js (849 บรรทัด · 44 รายการ)
TEX:25 · FLOOR_H:28 · WEST:31 · SHAFT_E:32 · CORE_E:33 · RZ0:34
LZ0:35 · STAIR_TOP_D:38 · STAIR_BOT_D:39 · RAMP_X0:40 · RAMP_X1:41 · RAMP_RUN:42
ROOM_N:43 · DOOR_W:46 · ENTRY_HW:47 · PLAYER_R:48 · floorY:49 · Acc:56
accBox:57 · accGeo:73 · accMesh:81 · makeMats:92 · PORTRAIT_PHOTOS:137 · EYE_R0:146
PORTRAIT_EYE:147 · PORTRAIT_SKIN:155 · PORTRAIT_CLOTH:156 · portraitTexture:157 · signTexture:196 · build:210
inRect:677 · insideHotel:678 · surfaceY:681 · collide:700 · roomAt:720 · floorOf:728
setLights:733 · BLINK_DUR:746 · BLINK_MIN:747 · tick:749 · nearWardrobe:820 · inLift:831
atLiftDoor:835 · randomHaunt:839

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

## js/main.js (282 บรรทัด · 5 รายการ)
syncMusicBtn:102 · showQuizBackPay:138 · showGiantRefund:182 · fitQbp:221 · bootGame:235

## js/moto3d.js (2,633 บรรทัด · 140 รายการ)
### 🗂️ สารบัญโซน js/moto3d.js (Read/Edit เฉพาะช่วง)
- 90-295 🚗🏙️ รอบ 785: ยกการขับจาก "โลกขับรถเมืองกำแพงเพชร" มาทั้งชุด (เฉพาะ vehicle==='car')
- 296-481 DOM เครื่องเกมพกพา (สร้างครั้งเดียว · CSS ฉีดเอง ไม่แตะ style.css)
- 482-511 🚗🏙️ รอบ 785: ห้องคนขับ + ปุ่มบังคับชุดโลกเมือง (โผล่เฉพาะ .car — โหมดมอไซค์ไม่เห็นอะไรเลย)
- 512-733 🪞📷 รอบ 806: กระจกมองหลัง+ข้าง (เฉพาะโหมดรถยนต์ในห้องคนขับ) — ภาพจริงจากกล้อง 3D ตัวที่ 2/3/4
- 734-830 🚗🏙️ รอบ 785: ห้องคนขับ (หน้าปัด/พวงมาลัย/เข็มเกจ) + ปุ่มเกียร์ — เฉพาะโหมดรถยนต์
- 831-859 🪞📷 รอบ 806: กระจกมองหลัง/ข้าง — เรนเดอร์ฉากเดิมซ้ำด้วยกล้องหันหลัง/เฉียงข้าง แล้วยัดลงแถบบนจอ (scissor)
- 860-927 🎵📻 รอบ 806: วิทยุในรถ — จอ head-unit (visualizer + แผงเลือกเพลง) พอร์ตจาก adventure3d.js ทั้งชุด
- 928-1168 ถนนจากแผนที่จริง → geometry + ตารางแฮชชนถนน
- 1169-1508 ฉาก: พื้น/โรงเรียน/ป้ายหมู่บ้าน/ต้นไม้/เมฆ/บ้านหมู่บ้าน
- 1509-1561 🐕 รอบ 312: หมาวิ่งตัดถนน — โผล่ข้างถนนข้างหน้ารถ วิ่งตัดผ่านเร็ว · ชน = ปรับ 100 เหรียญ (รอบ 643: ลดจาก 500)
- 1562-1679 🪙 รอบ 317: เหรียญบนถนน — pool ลอยเหนือเลนซ้าย รีไซเคิลรอบผู้เล่นตลอด
- 1680-1712 🏍️🚗 รอบ 317: โมเดลยานพาหนะ 3D (ใช้ทั้งรถเราเองโหมด car และรถ/มอไซค์ของเพื่อน)
- 1713-1809 🚗 รอบ 394: โมเดลรถจริง img/models/car_01.glb ในแผนที่บ้านโพธิ์สวัสดิ์
- 1810-1992 🧑‍🤝‍🧑 รอบ 317: เพื่อนในแผนที่เดียวกัน (/world/moto/<uid>)
- 1993-2034 🏟️👥 รอบ 640: งบวาดตัวเพื่อน (ใช้ NetRoom.drawBudget ร่วมกับโลกอื่น)
- 2035-2177 คำศัพท์ + ตัวอักษรบนถนน
- 2178-2487 สร้างโลกครั้งเดียว + ลูปเกม
- 2488-2633 เข้า/ออกโลก
### รายการ js/moto3d.js
REWARD:7 · ACCEL:8 · DASH_LEN:9 · DOG_HIT_COIN:10 · FEAT_SP:12 · DECAL_N:13
GRAV:14 · SUSP_K:15 · ROAD_WIDE:16 · EDGE_M:17 · ROAD_TEX_S:18 · POST_N:19
LEAN_MAX:20 · COLLECT_R:21 · SPAWN_MIN:22 · SCATTER_MS:23 · BUCKET:24 · TILE_COLORS:25
LETTER_COIN:27 · COIN_VAL:31 · COIN_GAP:32 · COIN_SPIN_SPD:34 · COIN_TIERS:37 · EMERALD_TIER:44
HARD_LAND:45 · COIN_CURVE_RAD:46 · NET_SEND_MS:48 · PEER_COLORS:49 · CHAT_MS:51 · CHAT_PRESETS:52
CAR_EYE:101 · CAR_ACCEL:102 · CAR_VMAX:103 · CAR_WB:104 · MIRROR_REAR:114 · RADIO_RECT:119
CAR_RADIO_RECT:120 · carRadioRect:126 · sndKick:234 · ENG_FILES:244 · CSS:299 · buildDom:584
loadCarDash:739 · loadCarWheel:751 · setGear:761 · setCam3:767 · syncGearUi:774 · carDial:783
drawCarGauge:813 · mirrorPass:836 · drawCarMirrors:848 · radioLayout:864 · radioSetHint:888 · renderRadioList:894
radioToggleList:904 · drawRadioViz:909 · segKey:931 · smoothPts:934 · featKey:950 · addFeat:951
genFeatures:956 · terrainAt:975 · roadGroundY:988 · decalTex:996 · makeDecals:1015 · decalTick:1024
buildRoads:1041 · distToSeg:1137 · roadInfo:1142 · onRoad:1148 · randomRoadPoint:1149 · TXT_SPR_H:1174
makeTextSprite:1175 · letterTexture:1190 · woodTileMat:1205 · muralTexture:1216 · buildSchool:1228 · buildScenery:1374
scatterTrees:1453 · postTick:1473 · scatterClouds:1500 · makeDog:1512 · spawnDog:1527 · dogHit:1537
dogTick:1548 · coinTexture:1566 · makeCoins:1577 · loadCoinImg:1583 · addCoin:1595 · clearCoins:1603
addFreeCoin:1607 · coinTierAt:1615 · coinFx:1625 · grabCoin:1634 · coinTick:1651 · scatterCoinTick:1665
placeSpecialCoin:1672 · makeVehicle:1684 · mCarSplitWheel:1721 · mCarEnsure:1747 · mCarMat:1764 · mCarBuild:1777
mCarCode:1804 · netReady:1816 · netJoin:1822 · netSend:1835 · sendChat:1849 · showPeerBubble:1859
removePeerBubble:1866 · renderBoard:1873 · peerColor:1895 · buildPeer:1899 · onPeer:1923 · dropPeer:1958
netLeave:1965 · peerTick:1970 · PEER_DRAW_MAX:1998 · drawnPeers:1999 · drawSlotFree:2000 · showPeerAgain:2001
hidePeer:2008 · tickDrawBudget:2013 · spawnSlot:2021 · pickWord:2038 · spawnLetters:2048 · renderWordHud:2063
fitWord:2071 · collectTick:2078 · completeWord:2097 · relocTick:2122 · gpsTick:2137 · miniTick:2146
build:2181 · applyVehicleUi:2215 · fit:2244 · tick:2253 · carDrive:2263 · frame:2312
start:2491 · exitWorld:2563

## js/music.js (169 บรรทัด · 0 รายการ)

## js/netroom.js (807 บรรทัด · 19 รายการ)
CFG:41 · roomsAllowed:63 · HOT_KEYS:71 · COLD_KEYS:72 · HOT_BACK:73 · splitPayload:77
mergeBack:88 · metUids:100 · AIM_TTL_MS:119 · aimAt:121 · aimGet:125 · aimClear:129
MAPS3D:135 · whereFriends:136 · dbOf:160 · envReady:161 · isDenied:164 · create:176
drawBudget:780

## js/online.js (1,770 บรรทัด · 94 รายการ)
### 🗂️ สารบัญโซน js/online.js (Read/Edit เฉพาะช่วง)
- 2-201 ENGINE: ระบบออนไลน์จริงผ่าน Firebase Realtime Database
- 202-295 ระบบเพื่อน (ข้อ 0.3): รหัสเพื่อน + ค้นหา + ส่ง/รับคำขอ
- 296-485 ระบบแชทกับเพื่อน (ข้อ 0.4)
- 486-651 ระบบส่งของขวัญ (ข้อ 0.5)
- 652-768 🏪 ตลาดออนไลน์จริง (item 2 backlog): ซื้อ-ขายสินค้าที่เพื่อน "ผลิตเอง" ข้ามผู้เล่น
- 769-806 คำเชิญเล่นโลก 3D ด้วยกัน — /tinv/<toUid>/<fromUid> = {map,n,ts}
- 807-1003 📰 Follow + Feed กิจกรรม (รอบ 155) · 🌍 หน้า Feed ทุกคน + ไลก์/คอมเมนต์ (รอบ 639)
- 1004-1011 🌍 หน้า Feed ทุกคน + ไลก์/คอมเมนต์ (รอบ 639)
- 1012-1184 📰 รอบ 701 — ฟีดล็อบบี้ทีละโพสต์ + รีแอ็กชัน + แจ้งเตือน (ต่อยอดรอบ 639)
- 1185-1770 📞 โทรหาเพื่อน — Voice call / Video call แบบ LINE (รอบ 625 · กลุ่ม 3 คนรอบ 631)
### รายการ js/online.js
ONLINE_STALE_MS:63 · ONLINE_BEAT_MS:64 · LEADERBOARD_SIZE:65 · onlineDisplayName:69 · onlineActivity:77 · ensureOnlineId:93
onlineKey:103 · onlinePushPresence:108 · onlinePushScore:118 · fetchPlayerStats:152 · onlineRerender:174 · notifyFriendBadges:186
FRIEND_ALPHA:212 · friendCode:213 · friendSearch:225 · friendRequest:249 · friendAccept:258 · friendDecline:270
friendsHeal:280 · CHAT_MAX_LEN:304 · CHAT_KEEP:305 · chatPairId:307 · chatRef:310 · chatListen:316
chatSend:332 · chatDeleteMsg:348 · TYPING_TTL:356 · typingRef:358 · chatSetTyping:359 · chatClearTyping:369
chatWatchTyping:377 · chatThemeRef:395 · chatSetTheme:396 · chatWatchTheme:401 · chatPrune:409 · chatSeenTs:426
chatMarkSeen:432 · chatUnreadCount:444 · chatWatchSync:447 · GIFT_EXPIRE_MS:497 · giftSend:500 · greetSend:514
giftAccept:526 · giftDecline:530 · giftInWatch:536 · giftReclaim:567 · giftOutWatchSync:577 · giftOutRebuild:632
salesWatch:662 · salesRerender:670 · sellInc:674 · marketWatch:682 · marketList:715 · marketUnlist:723
marketBuy:732 · marketSoldWatch:745 · tinvSend:774 · tinvClear:781 · tinvWatch:785 · FEED_MAX:815
feedEvent:818 · feedPrune:830 · feedPurgeCat:841 · feedPushAssets:852 · petDescriptor:870 · feedPushPets:876
fetchPlayerPets:890 · followSet:906 · followUnset:917 · feedRebuild:924 · feedWatchSync:936 · fetchPlayerFeed:963
fetchPlayerAssets:976 · fetchFollowers:995 · GFEED_READ:1021 · GFEED_KEEP_ME:1022 · gfeedPush:1025 · gfeedPrune:1039
gfeedParse:1052 · gfeedWatchStart:1074 · gfeedWatchStop:1101 · gfeedNotifDiff:1109 · gfeedNotifPush:1123 · uidDisplayName:1130
gfeedRebuild:1141 · gfeedToggleLike:1158 · gfeedSetReaction:1163 · gfeedAddComment:1171 · CALL_RTC_CFG:1209 · CALL_RING_MS:1210
CALL_MAX_MS:1211 · CALL_MAX_PEERS:1212 · onlineStart:1628 · onlineLoadSDK:1745

## js/photo.js (361 บรรทัด · 25 รายการ)
PHOTO_LS_KEY:12 · PHOTO_MAX:13 · PHOTO_PREFIX:14 · PHOTO_SIZES:15 · PHOTO_QS:16 · PHOTO_ZMAX:17
photoValid:25 · photoOnline:28 · photoGet:31 · photoHas:32 · photoIsMine:33 · photoOf:36
photoFetch:44 · photoAfterChange:61 · photoPush:65 · photoVerify:83 · photoSaveUrl:93 · photoRemove:99
photoPullMine:106 · photoBlkSrc:122 · photoMiniHTML:129 · openPhotoMenu:137 · photoLoadImgEl:203 · photoLoadFile:211
openPhotoCrop:224

## js/state.js (1,129 บรรทัด · 91 รายการ)
STORAGE_KEY:6 · QUIZ_PASS_REWARD:11 · CURE_COST:13 · HUNGRY_SICK_MS:14 · MEAL_HOUR:16 · MEAL_FULL:17
SLEEP_FROM_HOUR:18 · SLEEP_SICK_HOUR:19 · WAKE_HOUR:20 · DINNER_COST:21 · TOXIN_FULL:23 · DETOX_COST:24
FOODQUIZ_Q:26 · FOODQUIZ_COIN:27 · FOODQUIZ_BONUS:28 · FOODQUIZ_MAX_PLAYS:29 · SHAPE_JUNK_MEALS:31 · SHAPE_CLEAN_MEALS:32
SHAPE_MISS_MEALS:33 · SHAPE_EXP_BONUS:34 · HEAT_SICK_MS:35 · THIRST_SICK_MS:36 · DEFAULT_STATE:38 · FEED_CATS:194
FEED_REACTIONS:208 · feedRx:216 · FEED_QUICK_CM:218 · SLOT_MS:230 · currentSlotStart:231 · nextSlotStart:237
mealDayKey:239 · nightKeyOf:241 · isNightNow:249 · newPet:254 · loadState:278 · saveState:547
activePet:554 · petStage:555 · isAdult:560 · abilityOn:561 · hasPetType:562 · todayStr:565
dailyTick:569 · addCoins:572 · QUEST_POOL:592 · QUEST_PER_DAY:601 · questsToday:602 · questTick:609
questEvent:613 · assetValue:649 · netWorth:675 · assetCount:677 · refreshRank:694 · heatProtected:710
rainProtected:714 · petHungry:717 · petShapeOf:721 · updatePetShape:727 · shapeMealDone:734 · heatPct:744
ymStr:753 · billOutstanding:757 · UTILITIES:764 · HOME_UTILITIES:770 · homeDecayed:772 · billTick:775
PET_FOOD_PER_PET:847 · petFoodTick:848 · myCar:874 · carLoanDue:879 · carLoanOverdue:884 · carLoanPayable:889
carLoanPay:896 · compTick:909 · ONLINE_RATE:923 · onlineEarnActive:924 · onlineEarnTick:928 · onlineEarnFlush:939
marketTick:949 · addCraft:973 · ORDER_MAX:992 · ORDER_LIFE_MS:993 · ORDER_GAP_MIN_MS:994 · ORDER_GAP_SPAN_MS:995
ORDER_TIER_WEIGHT:996 · newOrder:997 · orderTick:1010 · careTick:1018 · expNeed:1100 · addExp:1105
addRP:1125

## js/tpaward.js (41 บรรทัด · 0 รายการ)

## js/typing.js (369 บรรทัด · 0 รายการ)

## js/ui.js (9,060 บรรทัด · 361 รายการ)
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
- 1319-1835 การ์ด Leaderboard — สลับแท็บในการ์ดเดียว (ประหยัดพื้นที่):
- 1836-2200 การ์ดข้อมูลผู้เล่น 👤 — คลิกชื่อในการ์ดเพื่อน/กระดาน แล้วโชว์
- 2201-2425 แผงเพื่อน 👥 (ข้อ 0.3): รหัสเพื่อน + ค้นหา + คำขอ + รายชื่อเพื่อน
- 2426-2521 🌍 เพื่อนอยู่โลก 3D ไหน + ปุ่ม "ตามเข้าไป" (รอบ 642)
- 2522-2560 แชทกับเพื่อน (ข้อ 0.4) — กล่องแชทลอยกลางจอ + แผง emoji
- 2561-2962 รอบ 179: หน้ารวมข้อความ (inbox แบบ Messenger — ธีมกระจกฟ้า sci-fi ของเกม)
- 2963-3309 ระบบส่งของขวัญ (ข้อ 0.5) — ห้องของขวัญ + กล่องเลือกส่ง + ฉากเปิด
- 3310-3402 RANK CARD + ฉากเลื่อนแรงค์
- 3403-3405 PET DASHBOARD
- 3406-3474 📰 รอบ 155: overlay ข้อมูลน้อง & การดูแล + ฟีดกิจกรรมเพื่อน
- 3475-3878 📰 รอบ 701 — ฟีดล็อบบี้ "ทีละโพสต์" แบบ Facebook (ผู้ใช้สั่ง 29 ก.ค. 2026)
- 3879-4038 🌍 รอบ 639: หน้า Feed เต็มจอ — ทุกคน (ไม่ใช่แค่ follow) + ไลก์/คอมเมนต์
- 4039-4704 📖 Dictionary ค้นหาคำศัพท์ (รอบ 254 ผู้ใช้สั่ง 16 ก.ค. 2026)
- 4705-4748 การนอน (คิว 7725691507 ข้อ 1)
- 4749-5130 ให้อาหาร (ระบบมื้อเย็น 18:00 + ความอิ่มสะสม — ข้อ 2+3)
- 5131-5249 🛡️ ควิซอาหารปลอดภัย (ต่อยอดข้อ 5.1)
- 5250-5335 🎀 ห้องแต่งตัวสัตว์เลี้ยง (รอบ 635: แยกออกจาก "ร้านค้า" เดิม —
- 5336-5523 ที่พัก (หลบแดด/หลบฝน) + เครื่องปรับอากาศ
- 5524-5641 บิลสาธารณูปโภค (ค่าไฟ/ค่าน้ำ — เครื่องยนต์อยู่ใน state.js: UTILITIES/billTick)
- 5642-5724 การ์ดมือถือ (ข้อ 7): ซื้อ 10,000 ขายคืน 6,000
- 5725-5735 การ์ดคอมพิวเตอร์ (ข้อ 11): ซื้อ 50,000 ขายคืน 30,000
- 5736-5780 item 8: โบนัสออนไลน์ +0.01 เหรียญ/วิ ฟรีทุกคนที่เปิดเกมออนไลน์อยู่
- 5781-5978 💻 รอบ 706 (ผู้ใช้สั่ง 29 ก.ค. 2026): ช่องรายได้คอมพิวเตอร์บนแถบบนล็อบบี้
- 5979-6195 🎫 การ์ดตั๋วโลกผจญภัย (คิว 7725691507 ข้อ 7)
- 6196-6278 🎃 การ์ดตั๋วโลกผีสิงกลางคืน (ต่อยอดข้อ 8 · ผู้ใช้เคาะ 7 ก.ค.)
- 6279-6382 🚁 การ์ดตั๋วโลกเฮลิคอปเตอร์ Bell (รอบ 52)
- 6383-6482 🛸 การ์ดตั๋วโลกโดรน FPV Racing (รอบ 85) — ซื้อได้เมื่อมีตั๋วเฮลิคอปเตอร์
- 6483-6673 🚗 การ์ดตั๋วโลกขับรถกำแพงเพชร (รอบ 113) — ซื้อได้เมื่อมีตั๋วโดรน FPV
- 6674-6766 ⚽ การ์ดตั๋วโลกสนามฟุตบอล (รอบ 196) — ซื้อได้เมื่อมีตั๋วขับรถ
- 6767-6862 🏍️ การ์ดตั๋วโลกมอเตอร์ไซค์บ้านโพธิ์สวัสดิ์ (รอบ 293) — ซื้อได้เมื่อมีตั๋วขับรถ
- 6863-6960 🛸 การ์ดตั๋วโลก "ยานแม่บุกโลก" (Invasion · รอบ 413)
- 6961-7005 🌍 ปุ่มลัดเข้าโลก 3D ในรางเมนูซ้าย (ผู้ใช้สั่ง 9 ก.ค. 2026)
- 7006-7151 🧭 ป้ายบอกทางของรางเมนูซ้าย (รอบ 601 · ผู้ใช้สั่ง 26 ก.ค. 2026)
- 7152-7321 การ์ดสวนผลไม้ (ข้อ 12): ซื้อต้นไม้ปลูกได้ไม่จำกัด แต่ละต้นออกผล
- 7322-7331 โรงงานผลิตสินค้า 🏭 + ตลาดขายต่อ (แนวคิดใหม่ 5 ก.ค. 2026)
- 7332-7354 โรงงานผลิต (แผง 🏭) — แยกออกจากตลาด (ผู้ใช้สั่ง 6 ก.ค. 2026)
- 7355-7505 ตลาดขายสินค้า (แผง 🏪) — แยกออกจากโรงงาน
- 7506-8417 🚗 รอบ 131: หมวดยานพาหนะ — โชว์รูมรถ 10 คัน (แคตตาล็อก 5 ช่อง/แถว)
- 8418-8478 ร้านสัตว์เลี้ยง (ซื้อเพิ่มได้ ไม่ลบตัวเดิม)
- 8479-8515 เลเวลอัพ (รายตัว)
- 8516-8621 สถิติผลการเรียนรู้
- 8622-8659 item 4: การ์ดสรุปส่งครู — ใบเดียวจบ ชื่อ/วัน-เวลา/เหรียญวันนี้/แรงค์/สอบล่าสุด
- 8660-9060 📞 หน้าจอโทรหาเพื่อน — สายเสียง (รอบ 625 · กลุ่ม 3 คน + ปิดวิดีโอ รอบ 631)
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
lbBadgeSections:1502 · lbDemoRows:1527 · lbChar:1549 · lbfAwardBarHtml:1559 · openLeaderboardFull:1571 · BLK_PAD:1685
BLK_PAD_NEW:1690 · BLK_TOP_FIX:1691 · seatPodChars:1692 · lbCoinHtml:1704 · lbBadgeHtml:1720 · lbBossHtml:1746
lbWordSearchHtml:1769 · lbTypingHtml:1805 · bindPlayerClicks:1841 · showPlayerCard:1851 · petDescImg:2130 · openImgLightbox:2143
openPetPeek:2163 · updateBillBadges:2207 · setBadge:2217 · updateSettingsBadge:2233 · openAttentionSummary:2247 · updateFriendBadge:2289
renderFriendPanel:2299 · friendDoSearch:2347 · refreshFriendData:2371 · FRW_TTL_MS:2436 · FRW_MIN_GAP:2437 · frwWorldOf:2441
frwPanelOpen:2444 · frwScan:2449 · frwPaint:2471 · frwPaintHint:2492 · frwFollow:2506 · CHAT_EMOJI_CATS:2527
CHAT_THEMES:2549 · CHAT_SECRET_MS:2558 · chatBadgeSync:2566 · ibTimeStr:2574 · IB_CALL_RE:2583 · ibCallInfo:2584
openChatInbox:2589 · chatFitKeyboard:2759 · openChat:2775 · giftImg:2966 · giftDateStr:2968 · GREETS:2976
GREET_EXP:2984 · greetInfo:2985 · openGreetPicker:2989 · giftItemPic:3031 · giftItemName:3039 · updateGiftBadge:3045
renderGiftPanel:3054 · acceptGift:3112 · declineGift:3135 · showGreetReveal:3144 · showGiftReveal:3171 · openGiftPicker:3197
confirmSendGift:3265 · doSendGift:3289 · rankBadgeHTML:3313 · renderRankCard:3318 · renderRankTab:3352 · showRankUp:3380
bindPetPlateButtons:3415 · openPetInfoOverlay:3444 · feedAgo:3467 · FEED_DECK_MAX:3487 · FEED_SLIDE_MS:3488 · FEED_RESUME_MS:3489
feedPostImgIndex:3494 · feedPostImg:3505 · feedPostByKey:3514 · feedCanReact:3517 · fpStatsHTML:3522 · fpNameBadgesHTML:3538
fpostHTML:3542 · renderFeedCard:3577 · feedDeckGo:3615 · feedDeckTick:3635 · renderFeedBell:3657 · feedNotifArrived:3665
openFeedNotif:3672 · closeRxPicker:3706 · openRxPicker:3710 · feedFlyWord:3730 · feedPickRx:3741 · openFeedComments:3754
closeFeedComments:3768 · renderFeedComments:3774 · bindFeedPostEvents:3833 · openFeedBoard:3885 · renderFeedBoardLive:3906 · renderFeedBoard:3924
stageColLeft:3943 · alignPetTabs:3952 · alignFeedPlate:3964 · alignProfilePlate:3975 · alignStageLeft:3991 · alignStageCols:4002
watchStageCols:4016 · alignCureBtn:4026 · dictRecordLookup:4050 · DICT_FILE_COUNT:4061 · loadDict:4062 · dictSearch:4077
dictTapWords:4092 · dictEntryHTML:4096 · openDictOverlay:4107 · renderDashboard:4191 · sleepBtnHTML:4710 · sleepHintHTML:4717
sleepAllPets:4728 · wakeAllPets:4741 · feedPet:4752 · openFoodMenu:4766 · feedWith:4837 · AVATAR_UI:4867
playerAvatarHTML:4871 · SHAPE_UI:4879 · showFeedResult:4888 · curePet:4929 · heartsFx:4952 · PAT_HOLD_MS:4975
PAT_EXP:4976 · bindPetTap:4977 · petBounce:4995 · petMood:5001 · shortPatPet:5008 · longPatPet:5016
patCalendarHTML:5036 · patStreakTick:5064 · cureCelebrateFx:5090 · railCureClick:5101 · detoxPet:5113 · openFoodQuiz:5136
closeDressUpBoard:5255 · openDressUpBoard:5259 · renderShop:5276 · homeVisualHTML:5339 · showHomeRuined:5353 · showCutNotice:5374
renderHomeCard:5392 · payMaint:5476 · trashBillUI:5492 · payTrash:5509 · UTILITY_UI:5528 · utilityBillUI:5577
payUtility:5602 · buyUtilityFix:5628 · renderPhoneCard:5646 · buyPhone:5686 · sellPhone:5708 · compLiveTotal:5729
onlineLiveTotal:5740 · syncCoinHeader:5747 · flashPillGain:5752 · renderOnlineEarnPill:5761 · renderCompEarnPill:5786 · openPillInfo:5819
renderComputerCard:5902 · buyComputer:5937 · sellComputer:5960 · soldCount:5986 · soldBadge:5987 · renderTicketCard:5992
loadScriptOnce:6048 · loadAdv3d:6065 · enterAdventure3D:6073 · pickAdvMap:6098 · enterHaunted3D:6133 · advHealClick:6155
buyTicket:6175 · renderHauntCard:6201 · buyHauntTicket:6257 · renderHeliCard:6284 · buyHeliTicket:6342 · enterHeli3D:6365
renderDroneCard:6387 · buyDroneTicket:6442 · enterDrone3D:6465 · renderDriveCard:6488 · buyDriveTicket:6562 · enterDrive3D:6585
pickDriveMap:6620 · enterMotoMapAsCar:6656 · renderSoccerCard:6678 · buySoccerTicket:6726 · enterSoccer3D:6749 · renderMotoCard:6772
buyMotoTicket:6821 · enterMoto3D:6844 · renderInvasionCard:6867 · INVASION_REWARD:6916 · buyInvasionTicket:6918 · enterInvasion3D:6942
WORLD3D:6967 · gotoRobotShop:6978 · scrollShopCardIntoView:6983 · railWorldClick:6986 · railScrollHint:7011 · railScrollTop:7019
initRailScroll:7024 · renderRailWorlds:7044 · tinvNoticeHTML:7105 · openTinvPicker:7113 · fruitCountdown:7157 · renderFarmCard:7169
renderFarmClock:7244 · buyFruit:7260 · sellFruit:7280 · sellAllFruit:7301 · collectImg:7330 · renderFactoryCard:7336
renderMarketCard:7359 · updateWishBadge:7415 · openWishlistDialog:7426 · bindStripArrows:7471 · renderMarketBrowse:7483 · carImg:7512
renderVehicleShop:7513 · CS_CYCLE_MS:7564 · carInteriorImg:7565 · carStatHtml:7567 · renderCarShowroom:7574 · csShowBig:7601
csInit:7628 · RS_CYCLE_MS:7651 · robotImg:7652 · renderRobotShop:7653 · rsShowBig:7675 · rsInit:7696
buyRobot:7715 · enterMecha3D:7737 · pickMechaRobot:7758 · pickDriveCar:7790 · openCarBuyDialog:7833 · buyCarInsurance:7894
payCarLoanMonthly:7913 · payCarLoanFull:7925 · carDriveBlock:7944 · gotoVehicleShop:7949 · gotoMyStock:7954 · showNeedCarDialog:7960
craftDiscount:7972 · renderFactory:7975 · renderOrdersUI:8044 · startProduce:8063 · buyCollectible:8091 · cancelProduce:8119
deliverOrder:8133 · renderOrderClock:8150 · renderCollectMine:8160 · openListDialog:8202 · cancelListing:8255 · buyMarketItem:8278
showCollectReveal:8305 · buyAC:8343 · openHomeShop:8362 · renderPetShop:8421 · showLevelUp:8482 · renderStats:8519
showTeacherCard:8626 · CALL_REACT_EMOS:8670 · CALL_TALK_MIN:8673 · CALL_TALK_HOLD:8674 · CALL_ORDER_GAP:8676 · CALL_TONES:8682
startCall:9056

## js/util.js (997 บรรทัด · 41 รายการ)
shuffle:6 · fmtNum:15 · escapeHTML:19 · gradeSymbol:32 · gradeMark:47 · nameWithGrade:55
gradeMarkCanvas:61 · gradeOf:77 · seededRand:92 · fmtThaiDT:102 · fmtThaiDate:106 · showScreen:111
TOAST_WARN_RE:121 · restackToasts:124 · toast:146 · floatFx:166 · beep:177 · soundStatus:198
PET_MOOD:269 · petVoiceSynth:276 · sirenSynth:353 · playCashier:377 · cashierSynth:391 · keyTapSynth:424
playSpark:465 · sparkSynth:479 · thunderFx:514 · wordAudioFile:582 · speakCutOff:591 · speakWord:595
speakLetter:619 · pickSpeakVoice:642 · speakWordTTS:653 · askNameDialog:673 · askConfirm:718 · alertBox:736
applyNoAnim:756 · BLK_VOCAB:763 · openSettings:811 · openHelp:952 · openTeacherGuide:978

## js/vocabbook.js (207 บรรทัด · 14 รายการ)
VB_MAX:11 · VB_QUIZ_N:12 · VB_QUIZ_MIN:13 · vbGroup:16 · VB_GROUP_UI:21 · vbRecord:24
vbSeen:49 · vbStats:62 · vbList:70 · vbReviewCat:81 · vbStartReview:95 · openVocabBook:106
vbRender:148 · vbCardHTML:194

## js/wordsearch.js (414 บรรทัด · 0 รายการ)

## js/wsaward.js (32 บรรทัด · 0 รายการ)

## css/lobby.css (4,820 บรรทัด · 725 selector)
:root:6 · html:15 · body:16 · *:33,34,35,36 · #app:39 · h1:41
.subtitle:42 · .shop-title:43 · #rotate-overlay:46 · .screen:68 · #screen-select:77,78,79,80(+5) · .egg-need:87
.petshop-topright:89 · .petshop-play-link:90,95 · #screen-game:137,138,139,140(+7) · #screen-quiz:151,152,153,154(+6) · #quiz-choices:163,164 · .word-card:171
.quiz-choice:172,173,174 · .big-btn:177,178,179,180 · #screen-dashboard:185,1070,1078 · .lobby-top:192,825,826,827(+27) · .top-flex:193 · .profile-plate:194,198,746,3433(+12)
#rain-fx:203 · .rain-layer:206,212 · .rain-glass:219 · .glass-drop:220 · .rail-btn:235,838,844,845(+16) · .rail-badge:236
.fr-code-box:241 · .fr-code-label:245 · .fr-code-row:246 · .fr-code:247 · .fr-copy-btn:252,256,261,262 · .fr-search-btn:257
.fr-add-btn:258 · .fr-accept:259 · .fr-decline:260 · #fr-search-input:263 · #fr-search-result:267 · .fr-found:268
.fr-hint:272 · .fr-list-title:273 · .fr-row:274 · .fr-req:278 · .fr-row-name:280,284,4600 · .fr-row-status:288
.fr-req-btns:289 · .online-dot:290 · .fr-chat-btn:291,296,298 · .fr-unread:299 · .fr-call-btn:305,311 · .chat-overlay:320,326,327
.chat-box:328,631,638,645(+12) · .chat-head:340 · .chat-theme-btn:345,349 · .chat-secret-tg:350,351 · .cs-switch:352,353,358,359 · .cs-slider:354,356
.chat-secret-note:360 · .chat-theme-strip:363 · .chat-theme-sw:365,368,369,370(+1) · .chat-head-name:372,375 · .chat-head-ava:374 · .chat-close:376
.chat-msgs:380 · .chat-empty:384 · .chat-typing:386 · .ct-dots:388,389,391,392 · .no-anim:394,407,468,482(+55) · .chat-bubble:395,400,405
.chat-emoji:408 · .chat-emo:412,416 · .chat-input-row:417 · .chat-emoji-btn:421 · #chat-input:425 · .chat-send:429,434,435
.chat-call-btn:441,445 · .call-ring:448 · .cr-card:452 · .cr-kind:458 · .cr-av:459 · .cr-name:469
.cr-id:470 · .cr-btns:471 · .cr-btn:472,478,483 · .cr-no:479 · .cr-ok:480 · .cr-safe:484
.call-ov:487,493,515,532(+6) · .call-stage:499 · .ctile:500,511,512 · .ct-face:504 · .ct-me:510 · .ct-nm:525,529
.ct-sub:530 · .call-add:554 · .ca-head:561 · .ca-list:562 · .ca-row:563,567 · .ca-dot:568,569
.ca-nm:570,571 · .ca-go:572 · .ca-empty:573 · .ca-safe:574 · .ca-close:575 · .call-bar:579
.cb-btn:584,589,590 · .cb-end:591,592 · .call-emos:593 · .call-emo:598,599 · .call-fx:601 · .call-fx-emo:602
.pl-click:694,696,697 · .pl-overlay:698 · .pl-card:702,2571 · .pl-close:708 · .pl-head:712,2429,2432 · .pl-grade:717,4606,4607
.pl-body:718 · .pl-loading:719 · .pl-none:720 · .pl-me-tag:721 · .pl-blk-wrap:723 · .pl-blk:724
.pl-stat:725 · .pl-lbl:730 · .pl-val:731,732 · .pl-tip:733 · .chip-edit:739,744,745 · .rank-mini:751,757,758,759
.pass-photo:761,766 · .pet-tabs:768 · .dict-box:769,773,774,775(+1) · .dict-card:781,786,790,791(+2) · .dict-head:787,788 · .dict-trail:795,799
.dt-c:800,804,805 · .dt-sep:806 · .dict-today:807 · .di-w:809,810,811 · .dict-list:812 · .dict-item:813,817,818,819(+5)
.lobby-mid:833 · .rail-wrap:836,861,865,866(+3) · .lobby-rail:837 · .rail-nudge:868,876,877,880(+1) · .rail-worlds:887 · .rail-div:888
.lobby-stage:930,932,948,1075(+13) · .newword-banner:938,945,950,3985(+2) · .coin-fly:961,964 · .coin-plus:970 · .nw-pop-coin:985,987,988 · .nw-pop-goal:991,992,996,1000
.nw-goal-head:993,995,997 · .nw-goal-bar:998 · .nw-goal-fill:999 · .nw-pop-book:1001,1002 · .nw-tag:1023,3991,4013 · .nw-word:1028,3995,4018,4107
.nw-hint:1030,1031,3996,4020(+1) · .nw-coin:1033,1036,3997,4001 · .nw-countdown:1041,4002 · .nw-bar:1043,4021 · .nw-bar-fill:1045 · .pet-stage:1048,2865
.nw-box:1055,2874 · .nw-pop-word:1056 · .nw-speak:1057 · .nw-pop-phon:1058 · .nw-ipa:1059 · .nw-pop-sent:1060
.nw-pop-mean:1061 · .pet-tab:1062,1063,1064,3239 · .stage-hero:1085,1100,1108,1253(+22) · .hero-ground:1122,1242,1248 · .hero-rank-bg:1124,1127,1130,1134(+18) · #lobby3d-canvas:1147,1148
.hero-scene:1152,1154,1161,1162(+8) · .caretaker-fig:1201 · .caretaker-img:1204 · .caretaker-emoji:1206 · .blk-rig:1213,1214,1215 · .stage-plate:1275,1283,1294,1295(+23)
.plate-title:1289 · .lobby-side:1322,1358,1363,1366(+22) · .side-sec:1325,2141,3135,3411 · .side-label:1326,1331 · .side-label-row:1334,1335 · .lb-tabs-out:1336,1337,1341
.side-glass:1345,1352 · .side-card:1364,1475 · #quest-card:1376,1377,1405,1406(+6) · .q-bigcard:1382,1411 · .qb-top:1384 · .qb-emoji:1385
.qb-name:1387 · .qb-bar:1388,1389 · .qb-row:1391 · .qb-prog:1392 · .qb-reward:1393 · .qb-go:1394,1398
.q-dots:1399 · .q-dot:1400,1401,1402 · .q-bonus:1403 · .inv-card:1422,1424,1425 · .inv-btns:1426 · .inv-go:1427,1429
.inv-x:1430 · #online-card:1434,3143,3144,3145(+4) · .fq-overlay:1435 · .fq-box:1437,2949 · .fq-head:1441,1443 · .fq-close:1444
.fq-sec:1446 · .fq-worlds:1447 · .fq-world:1448,1450 · .fq-acts:1451 · .fq-act:1452,1455,1456 · .lb-prize:1489
.lb-coins:1492 · .lbf-cell:1493,2498,2501,2502(+3) · .lb-award-bar:1495,1501,1502 · .lb-award-go:1503 · .lbf-award:1505,1511,1512,1513 · .pod-pz:1514
.wsa-overlay:1517 · .wsa-box:1519 · .wsa-head:1524 · .wsa-title:1525 · .wsa-when:1526,1527 · .wsa-close:1528,1531
.wsa-cols:1532 · .wsa-col:1533 · .wsa-sec-h:1534,1535 · .wsa-msg:1536 · .wsa-msg-h:1539 · .wsa-msg-b:1540,1541
.wsa-msg-none:1542 · .wsa-rules:1544,1545 · .wsa-list:1546 · .wsa-row:1547,1549 · .wsa-r:1550 · .wsa-n:1551
.wsa-s:1552 · .wsa-p:1553 · .wsa-prizes:1554 · .wsa-pz:1555,1558 · .wsa-reveal-medal:1559 · .lobby-bottom:1569,1571
.lobby-quiz-btn:1572 · .lobby-book-btn:1573,1574 · .lobby-foodquiz-btn:1575,1576 · .lobby-play-btn:1577,1581 · .lobby-exam-btn:1583,1584,1586 · .panel-overlay:1591,1596,4122,4123(+8)
.panel-box:1597 · .panel-head:1604,1608 · .panel-close:1609,1614 · .panel-body:1615,1619,1620 · .panel-page:1617,1618 · .collect-sub:1624
.mkt-empty:1625 · .craft-box:1626 · .mkt-listing:1627 · .mkt-filter:1628,1972 · .hq-grid:1635 · .hq-card:1636,1641,1665
.hq-head:1642 · .hq-pic:1648,1650 · .hq-emoji:1652 · .hq-badge:1653 · .hq-stars:1657 · .hq-price:1658,1663,1664,1667(+6)
.craft-credit:1671,1673,1674 · .car-grid:1681,1683,1684 · .robot-weap:1685 · .dmap-box:1688,1689 · .dmap-grid:1695 · .dmap-card:1697,1700,1701,1702(+2)
.dmap-ico:1704 · .dmap-new:1707 · .dcp-grid:1709 · .dcp-card:1711,1714,1715,1716(+10) · .levelup-box:1733,2828,2829,2946 · .dcp-box:1736,1737,1741,1742(+6)
.dcp-lock:1750 · .sold-badge:1754,1756,1757 · .rs-showroom:1759,4558,4559 · .rs-list:1760,1762,4539,4542 · .rs-thumb:1763,1765,1766,1767(+1) · .rs-thumb-pic:1768,1769
.rs-thumb-price:1770 · .rs-stage:1772 · .rs-big:1775 · .rs-big-img:1776 · .rs-elec:1780,1784,1789 · .rs-edge:1790,1796
.rs-info:1799,1800,1801,1802(+1) · .rs-buy:1804,1806,1807 · .cs-showroom:1811,4531,4532,4560(+3) · .cs-list:1812,1814,4533,4538(+9) · .cs-thumb:1815,1817,1818,1819(+1) · .cs-thumb-pic:1820,1821
.cs-thumb-name:1822 · .cs-thumb-price:1823 · .cs-thumb-own:1824 · .cs-stage:1826 · .cs-big:1829 · .cs-big-img:1830
.cs-elec:1834,1838,1842 · .cs-edge:1843,1849 · .cs-interior:1852 · .cs-inr-label:1853,1854 · .cs-inr-img:1855 · .cs-info:1857,1858,1859,1860(+6)
.cs-buy:1868,1870,1871,1872 · .car-emoji:1874 · .car-mine:1880 · .car-mine-pic:1885 · .car-mine-info:1886 · .car-loan:1887,1888
.car-mine-btns:1889,1890,1891 · .car-locked:1893 · .car-mine-head:1895 · .car-pick-list:1896,1897 · .car-pick:1898,1900,1901 · .car-pick-pic:1902,1903
.car-pick-name:1904,1905 · .car-pick-od:1906 · .car-buy-box:1908,2953 · .cb-pic:1909,1910,1911 · .cb-lines:1912 · .cb-li:1913,1917,1918
.cb-ins:1919,1923,1924 · .cb-plan:1925 · .cb-pl:1926,1931,1933,1937(+1) · .cb-total:1944 · .cb-btns:1945,1950 · .cb-x:1946
.shop-grid:1953 · .shop-item:1954,1959,1964,1965(+3) · .mkt-tab:1973,1974 · .pg-btn:1975,1976,1977 · .pg-dot:1978 · .fr-gift-btn:2001,2006
.gift-sec-title:2009 · .gift-in-row:2011 · .gift-out-row:2015 · .gift-in-pic:2016,2018,2019 · .gift-in-info:2020,2021 · .gift-in-btns:2022
.gift-accept:2023,2027,2029 · .gift-decline:2028 · .gift-box-card:2030 · .gift-box-from:2031,2032 · .gift-note:2033 · .gift-pick-overlay:2036
.gift-pick-box:2040 · .gift-pick-head:2046,2050 · .gift-pick-close:2051 · .gift-pick-tabs:2053 · .gp-tab:2054,2058 · .gift-pick-body:2059
.gp-chips:2060 · .gp-chip:2061,2065 · .gp-card:2066,2067 · .gp-price:2068 · .gp-note:2069 · .gift-cf-pic:2070
.chat-emoji-cats:2075 · .chat-emoji-cat:2079,2083,2084 · .chat-emoji-wrap:2085,2086 · .stage-left:2095,4113 · .pet-info-btn:2099,2106,2107 · .feed-list:2114,2118,2143,2144(+1)
.feed-empty:2119,2122 · .fd-tools:2128 · .feed-bell:2129,2131,2132,2133 · .fd-prog:2137,2138 · .fpost:2145,2710 · .fp-head:2150
.fp-who:2151 · .fp-name-line:2154 · .fp-name:2155 · .fp-when:2156 · .fp-badges:2158,2161 · .fp-badge-ic:2159
.fp-text:2163 · .fp-media:2166 · .fp-img:2168 · .fp-cap:2170 · .fp-big:2171 · .fp-sum:2173,2175
.fp-sum-rx:2176 · .fp-sum-none:2177 · .fp-en:2178 · .fp-bar:2180 · .fp-act:2181,2185,2187 · .fp-like:2186
.fp-page:2198,2199,2200,2201(+3) · .fp-rxbox:2204 · .fp-rxb:2208,2210,2211,2212(+1) · .fp-rxb-off:2214 · .fp-fly:2216,2219,2220 · .fcm-overlay:2223
.fcm-box:2225 · .fcm-post:2229,2230 · .fcm-rxs:2231 · .fcm-rx:2232 · .fcm-list:2233,2235 · .fcm-row:2236,2237,2238
.fcm-none:2239 · .fcm-quick:2241,2243 · .fcm-q:2244,2247,2248 · .fcm-add:2249 · .fcm-input:2250,2252 · .fcm-send:2253,2255
.fcm-locked:2256 · .fnt-overlay:2258 · .fnt-box:2260 · .fnt-list:2264,2266 · .fnt-row:2267,2269 · .fnt-ico:2270
.fnt-tx:2271,2272 · .fnt-sub:2273 · .feed-plate:2275 · .feed-all-btn:2276,2281 · .fdb-overlay:2286 · .fdb-box:2288
.fdb-head:2292 · .fdb-close:2296,2298 · .fdb-live:2299 · .fdb-live-title:2300 · .fdb-live-rows:2302,2304,2305 · .fdb-live-row:2306,2308,2309,2310
.fdb-dot:2311 · .fdb-list:2313,2314 · .fdb-empty:2315 · .fdb-row:2316 · .fdb-row-top:2318 · .fdb-ico:2319
.fdb-txt:2320 · .fdb-name:2321 · .fdb-ago:2322 · .fdb-actions:2323 · .fdb-like:2324,2327,2328,2329 · .fdb-cm-list:2330
.fdb-cm-row:2331,2333 · .fdb-cm-empty:2334 · .fdb-cm-add:2335 · .fdb-cm-input:2336,2338 · .fdb-cm-send:2339,2341 · .fdb-cm-locked:2342
.pi-overlay:2345 · .pi-box:2349,2354,2355,2359(+3) · .pi-close:2361,2366,2367 · .pi-close-left:2369 · .pi-portrait:2371 · .pet-wear:2378,2381,2383
.pi-portrait-wrap:2386,2388 · .pi-dress-btn:2396,2400,2401 · .pi-shape-cap:2402,2405,2406,2407 · .pi-shape-toggle-btn:2409,2412 · .pi-dress-pip:2414,2419,2420,2421(+1) · .pi-wear-note:2424,2426
.greet-card:2433 · .greet-sub:2434 · .greet-grid:2435 · .greet-opt:2436,2439,2440,2441 · .greet-e:2442 · .pi-streak:2446
.pi-streak-head:2448,2450 · .pi-streak-best:2451 · .pi-dots:2452 · .pi-dot:2454,2455,2456 · .pi-streak-note:2457 · .pi-care-title:2458
.lbf-overlay:2461 · .lbf-box:2464,2478,2479,2480(+10) · .lbf-head:2469 · .lbf-title:2470 · .lbf-tabs:2471,2474 · .lbf-note:2477
.lbf-close:2493 · .lbf-close-l:2494 · .lbf-body:2495 · .lbf-grid:2496 · .lbf-bcat-wrap:2511,2513 · .lbf-bcat:2514
.lbf-bcat-head:2515,2516,2517 · .lbf-bcat-badge:2522,2525 · .lbcat-ic:2523 · .lbcat-ic-label:2526 · .lbf-bcat-rows:2527 · .lbf-bcat-row:2528,2530,2531,2533
.lbf-podium:2537 · .pod:2539,2566,2567 · .pod-char:2541 · .pod-base:2543 · .pod-rank:2545 · .pod-label:2547,4602
.pod-name:2549 · .pod-sc:2551 · .pod-1:2556,2557 · .pod-2:2558,2559 · .pod-3:2560,2561 · .pod-4:2562,2563
.pod-5:2564,2565 · .pl-wide:2584,2587,2588,2589(+8) · .pl-follow:2590,2595,2597 · .pl-unfollow:2599,2605,2606 · .pl-followers:2607 · .pl-cols:2608,2613,2614,2615
.pl-col:2609 · .pl-sec-title:2610 · .pl-badges-col:2616 · .pl-feed:2617,2620,2627 · .pl-feed-row:2621,2625,2626 · .pl-assets-wrap:2629,4439,4514
.pl-assets:2630,4442,4447,4453(+4) · .pl-asset:2633,2637,2644 · .pl-asset-emoji:2638 · .pl-asset-n:2639 · .pl-pets-wrap:2646 · .pl-pets:2647
.pl-pet:2648,2653,2655 · .pl-pet-nm:2656 · .img-lightbox:2659,2664,2665,2669(+3) · .cert-svg:2688 · .cert-tap:2689,2694 · .cert-chip-sm:2697
.pl-sec-sub:2717 · .pl-certs:2718,2720 · .cert-mini:2721,2725,2727 · .cert-mini-cap:2728 · .cert-none:2730 · .lv-cert-row:2732,2734
.lv-cert-btn:2735,2740 · .cert-lightbox:2742,2747,2748,2752(+3) · .pl-chat:2772,2777 · .pl-call:2779,2785 · .pet-peek:2786,2787 · .pp-chips:2789
.pp-chip:2790 · .pp-gift:2795,2801 · .settings-box:2803,2804,2878,2883(+27) · .set-feed-head:2805 · .set-feed-sub:2809 · .set-feed-row:2810
.pillinfo-val:2815 · .pillinfo-desc:2820,2839 · .pillinfo-box:2831 · .plf-head:2834 · .plf-emoji:2835 · .plf-ht:2836,2837,2838
.plf-foot:2840,2842,2843 · .alert-box:2848,2850 · .ab-emoji:2851 · .ab-title:2852 · .ab-desc:2853 · .ab-btns:2854,2855,2856
.heal-heart:2858 · .attn-box:2873 · .help-box:2924,2925,2926 · .wl-box:2947 · .food-box:2948 · .home-shop-box:2950
.summary-box:2951 · .report-box:2952 · .wl-grid:2955 · .tc-wrap:2957 · .spell-btn:2963,2968 · .sp-hud:2969
.sp-word:2971 · .sp-ch:2972,2977 · .sp-th:2979 · .sp-hint:2981 · .sp-exit:2984,2988 · .sp-banner:2989
.sp-big:2994 · .sp-thb:2996 · .sp-coin:2997 · #spell-confetti:3002 · .sp-rb:3003 · .sp-day:3013
.sp-perfect:3015 · .sp-late:3017 · #spell-coinpop:3020 · .side-sub:3129,3131 · .sec-quest:3136 · .on-page:3147,3148,3149,3150
.inbox-overlay:3160 · .ib-box:3162 · .ib-head:3166 · .ib-close:3170,3172 · .ib-list:3173,3174 · .ib-row:3175,3176,3177,3178
.ib-ava:3179,3184,3185 · .ib-on:3186 · .ib-mid:3188 · .ib-name:3189 · .ib-last:3190 · .ib-meta:3191
.ib-time:3192 · .ib-dot:3194 · .ib-story-badge:3197 · .ib-empty:3201 · .ib-story:3203,3205 · .ib-story-item:3206,3208,3215
.ib-story-ava:3209 · .ib-story-on:3213 · .ib-world:3218,3221 · .ib-tabs:3223 · .ib-tab:3224,3227,3229 · .ib-tab-dot:3230
.ib-call-ava:3234 · .ib-call-row:3235,3236 · #btn-music:3242,3245,3246 · #ws-overlay:3261 · #ws-board:3264,3270,3272 · .ws-head:3275
.ws-title:3276 · .ws-findbar:3279 · .ws-tip:3280 · .ws-grade:3282,3283 · .ws-body:3286 · .ws-gridwrap:3287
#ws-grid:3290 · .ws-cell:3295,3300,3303,3306(+2) · .ws-flash:3312,3314 · .ws-coinpop:3318,3342 · .ws-combo:3329,3333,3334,3335 · .ws-find:3346
#ws-prog:3347 · #ws-words:3351,3355 · .ws-word:3357,3362,3363,3364(+2) · .ws-actions:3370,3371,3380 · .ws-sizes:3375 · .ws-sizes-lb:3377
.ws-size-now:3378 · #ws-new:3381 · #ws-stash:3382 · #ws-clear:3383 · #ws-win:3384,3386 · .ws-win-in:3387,3390
.sec-online:3413 · .rank-tab:3441,3442,3443,3444(+2) · .pet-show-bg:3474,3477,3481,3485(+19) · .ps-night-fx:3577,3579,3591,3596(+1) · .pet-show:3606,3609,3621,3623(+22) · .ps-video:3742
.ps-worn-pip:3820,3821 · .id-card:3844,3851,3855 · .id-chip:3868 · .clock-chip:3877,3878 · .coin-block:3894 · .coin-group:3895
.coin-pill:3925,3926,3947 · .cp-lb:3950 · .cp-v:3951 · .nw-sub:4019 · .top-flex2:4110 · #panel-factory:4129,4130,4134,4135(+39)
#panel-rank:4270,4271,4277,4282(+11) · .grid2x8:4353,4359 · .grid1x5:4369,4375 · .pl-badges-strip:4381 · .pl-badge-card:4385,4391 · .pl-badge-card-ic:4392,4396
.pl-badge-card-nm:4397 · .pl-badges-empty:4403,4405 · .mine-strip:4419,4421,4422,4427(+4) · .mb-strip:4433,4472 · .gmark:4580,4584,4585,4586(+1) · .gm-stack:4589,4593
.gm-row:4595 · .lb-name:4597,4598,4599 · .grade-edit:4620,4625,4626 · .gradelock-box:4630,4646,4651,4653 · .gl-head:4631 · .gl-emoji:4632
.gl-ht:4633 · .gl-cur:4634 · .gl-lock:4635,4640 · .gl-ok:4639 · .gl-lock-sub:4641 · .gl-why:4642
.gl-pick-lb:4643 · .gl-opts:4644 · .gl-hist:4654 · .gl-hline:4655 · .gl-hg:4659 · .gl-hat:4660
.gl-harr:4661 · .gl-foot:4662 · .gl-cf:4663 · .reg-gradelock:4685 · #tp-overlay:4695 · #tp-board:4697,4701
.tp-head:4705 · .tp-title:4706 · .tp-stat:4708,4710 · .tp-pts:4712,4715 · .tp-close:4717,4723,4724 · .tp-snd:4727,4730,4736,4737
.tp-snd-ic:4731 · .tp-snd-track:4732 · .tp-snd-thumb:4734 · .tp-prompt:4741 · .tp-word:4743,4757,4758 · .tp-ch:4745,4750,4751,4753
.tp-thai:4761 · .tp-hint:4763 · .tp-empty:4765 · .tp-keys:4768 · .tp-row:4770 · .tp-row-fn:4772,4805
.tp-key:4776,4788,4790,4796(+2) · .tp-key-fn:4803 · .tp-fx:4809 · .tp-coinpop:4810 · .tp-pop-pt:4815

## css/style.css (2,058 บรรทัด · 532 selector)
:root:5 · *:15 · html:16,21 · input:25 · body:29 · #app:35
.screen:38,39 · h1:42 · .subtitle:43 · .egg-grid:46,63 · .egg-card:47,52,53,54(+2) · .pet-price:57,61
.egg:65,71,75 · .d1:76 · .basket:79,80,85,91(+5) · .basket-dog:89,102,103,104 · .basket-cat:90,105,106,107 · .egg-dragon:110
.topbar:125 · .topbar-coins:126 · .coin-pill:127,138,142,147(+4) · .coin-ic:134 · .no-anim:148,179,183,184(+5) · .coin-flow:152,153,157,164(+1)
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
.cat-card:1058,1079,1082,1226(+1) · .cat-head:1062 · .cat-emoji:1063 · .cat-name:1064 · .cat-pass:1065 · .cat-info:1066
.cat-btns:1067 · .cat-btn:1068,1072,1073,1074(+3) · .band-sec-head:1077,1078 · .bax-box:1086,1088 · .bax-head:1089 · .bax-sub:1090,1091
.bax-row:1092 · .bax-lv:1093,1096,1097,1098(+3) · .bax-emoji:1099 · .bax-name:1100 · .bax-q:1101 · .bax-need:1103
.bax-rw:1104 · .bax-foot:1108 · .bax-rank:1109,1112 · .bxr-box:1115,1117 · .bxr-head:1118 · .bxr-sub:1119
.bxr-body:1120 · .bxr-pick:1121 · .bxr-cats:1122 · .bxr-chip:1123,1125,1126,1127(+1) · .bxr-list:1129 · .bxr-row:1130,1132,1134,1138
.bxr-rk:1133 · .bxr-nm:1135,1136 · .bxr-sc:1137 · .bxr-tm:1139 · .bxr-more:1140 · .bxr-none:1141
.bxr-foot:1143 · .band-mine-tag:1144 · .bsp-box:1147,1150 · .bsp-head:1151 · .bsp-prog:1152 · .bsp-retake:1154,1157
.bsp-info:1159,1161 · .rts-box:1164 · .rts-head:1166 · .rts-sets:1167 · .rts-set:1168,1169,1170 · .rts-sub:1171
.rts-words:1172 · .rts-word:1173,1175,1176 · .rts-foot:1177 · .rts-okbtn:1178,1180 · .bsp-grid:1181 · .bsp-chip:1182,1185,1186,1187(+1)
.bsp-num:1189 · .bsp-best:1190 · .bsp-tick:1191 · .bsp-foot:1192 · .vb-box:1195,1197 · .vb-head:1198
.vb-total:1199 · .vb-quizbtn:1200,1202 · .vb-tabs:1203 · .vb-tab:1204,1206,1207 · .vb-words:1208 · .vb-word:1209,1212,1213,1214(+3)
.vb-empty:1218 · .vb-foot:1219 · .vb-pg:1220,1222 · #vb-pginfo:1223 · .vb-hint:1224 · .band-lock:1232
.offline-btn:1233,1234 · .quiz-progress:1239 · .quiz-phon:1240 · #quiz-extra:1241,1243,1244,1245 · .quiz-word-card:1246 · .quiz-next:1252,1258,1259,1260(+1)
.quiz-choice:1263,1268,1269,1270 · .quiz-score-pill:1271 · .quiz-time-pill:1273,1275 · .stats-card:1278 · .stats-title:1282,1731 · .stats-row:1283,1284,1285,1286
.stat-badge-line:1288,1291 · .stat-badge-ic:1289 · .game-top:1294 · .back-btn:1295 · .combo-pill:1299 · .timer-wrap:1303
.timer-fill:1304,1305 · .board-label:1307 · .card-grid:1308 · .word-card:1309,1315,1316,1317(+3) · .hint-btn:1323,1328 · .game-endless-note:1331,1336,1338,1342(+6)
.report-btn:1363,1368 · .report-box:1371 · .report-close:1372 · .rp-head:1376 · .rp-avatar:1377,1378 · .rp-title:1379
.rp-sub:1380 · .rp-levelcard:1382 · .rp-level-top:1386 · .rp-bar:1387 · .rp-bar-fill:1388 · .rp-level-note:1389,1390
.rp-grid:1392 · .rp-stat:1393 · .rp-ic:1396 · .rp-num:1397 · .rp-lbl:1398 · .rp-section:1400
.rp-h3:1401 · .rp-badge-mini:1402 · .rp-row:1403,1404,1405 · .rp-empty:1406 · .rp-badges:1407 · .rp-badge:1408
.rp-tline:1411 · .rp-tl-head:1412,1413 · .rp-tl-ems:1414 · .rp-em:1415,1416 · .rp-tl-note:1417,1418 · .rp-crown:1420,1421
.rp-wtitle:1423 · .rp-wnow:1424,1425 · .rp-wgraph:1426 · .rp-wcol:1427 · .rp-wval:1428 · .rp-wbar:1429,1430
.rp-wlbl:1431 · .rp-cheer:1433 · .report-ok:1437 · .summary-box:1440,1495,1499,1500(+2) · .sm-burst:1441 · .sm-title:1443
.sm-line:1444 · .sm-coin:1445 · .sm-matches:1451,1452 · .confetti:1454 · .sm-badge:1461 · .sm-badge-all:1465
.badge-celebrate-overlay:1468,1485 · .badge-celebrate:1474 · .bc-emoji:1480,1482 · .bc-emoji-img:1481 · .bc-title:1483 · .bc-sub:1484
.sm-cheer:1489 · .sm-streak:1490,1491 · .sm-sick:1492 · .sm-btns:1493 · .float-fx:1505 · .toast:1512
.toast-warn:1519,1526,1527,1533 · .toast-clear-all:1535,1542 · .alert-box:1544 · .alert-ok:1545,1550 · .settings-box:1552 · .set-row:1553
.set-hint:1557 · .set-hint-on:1558 · .set-hint-off:1559 · .set-lwrap:1560 · .set-label:1561 · .set-desc:1562
.set-switch:1563,1567,1568,1573(+4) · .set-sw-knob:1569 · .set-sw-txt:1576 · .set-close:1582,1587 · .set-help:1588,1593 · .help-box:1595,1596,1601
.help-item:1597 · .update-banner:1609,1618,1619 · #update-reload:1620 · #update-dismiss:1624 · .levelup-overlay:1630,1636,1637 · .levelup-box:1638,1645,1646,1647(+4)
.bill-box:1653,1657,1658 · .tag-off:1659 · .home-decayed-img:1660 · .home-dark-img:1661 · .thirst-fill:1662 · .thirst-text:1663,1664
.toxin-fill:1667 · .toxin-text:1668,1669 · .detox-btn:1670,1675 · .shape-text:1678,1679,1680,1681(+1) · .avatar-pick:1685 · .avatar-opt:1686,1690,1691,1692
.avatar-chip-img:1696 · .mini-av:1698 · .fp-ava:1699 · .avatar-chip-blk:1701 · .set-avatar-btns:1702 · .avatar-mini:1703,1707
.set-blk-row:1709 · .set-sub2:1710 · .blk-grid:1712 · .blk-mini:1713,1716,1717,1718 · .game-avatar:1721,1722,1723 · .stats-nick:1732
.ticket-owned:1735,1739 · .collect-sub:1744 · .mkt-tabs:1745 · .mkt-tab:1746,1750 · .mkt-filter:1751 · .mkt-row:1755
.mkt-emoji:1759,1760 · .mkt-info:1761,1762 · .mkt-tier-stars:1763 · .mkt-buy:1764,1769,1770 · .mkt-price-lo:1771 · .mkt-price-hi:1772
.mkt-empty:1773 · .collect-grid:1776 · .collect-cell:1777 · .cc-emoji:1778,1779 · .cc-name:1780 · .cc-count:1781
.cc-list-btn:1782,1786 · .mkt-listhead:1787 · .mkt-group-head:1789,1795 · .mkt-two-col:1797,1798,1802,1814(+8) · #phone-card:1803,1819 · #computer-card:1804,1820
#ticket-card:1806 · #haunt-card:1807 · #heli-card:1808 · #drone-card:1809 · #drive-card:1810 · #soccer-card:1811
#moto-card:1812 · #invasion-card:1813 · .mkt-listing:1841 · .ml-cancel:1845 · .mkt-sold:1851,1852,1853 · .list-dialog:1860,1861,1866
.list-hint:1865 · .collect-reveal-frame:1869,1876 · .collect-reveal-img:1875 · .collect-reveal-stars:1877 · .craft-box:1880 · .craft-head:1881
.craft-bar:1882 · .craft-fill:1883 · .craft-text:1884 · .craft-btn-row:1885,1886 · .craft-go-btn:1888,1894,1895,1898 · .craft-cancel:1906,1910
.mkt-catalog:1913,1914,1915 · .mkt-pager:1918 · .pg-btn:1919,1923,1924 · .pg-mid:1925 · .pg-dots:1926 · .pg-dot:1927,1928
.order-head:1929 · .order-row:1930,1935,1937,1939 · .order-deliver:1940,1945 · .order-need:1946 · .avatar-chip-photo:1952 · .pass-photo:1953
.pl-photo:1954 · .pp-cam:1959,1967 · .set-photo-row:1970,1976 · .ph-thumb:1977 · .ph-plus:1978 · .photo-box:1984,1985,2006,2010(+4)
.ph-now:1986 · .ph-now-img:1987,1991 · .ph-now-cap:1992 · .ph-warn:1993 · .ph-sync:1998,2001 · .ph-sync-wait:2002
.ph-sync-ok:2003 · .ph-sync-bad:2004 · .ph-btns:2005 · .ph-tip:2015 · .ph-stage:2017,2021 · .ph-cv:2022
.ph-ring:2023,2028 · .ph-zoom:2032 · .ph-foot:2033 · .ph-crop-box:2034
