# CODE_MAP.md — แผนที่โค้ด:บรรทัด (เจนอัตโนมัติโดย `tools/gen_code_map.py` — **ห้ามแก้มือ** เดี๋ยวโดนเขียนทับ)

> วิธีใช้: หาชื่อฟังก์ชัน/ค่าคงที่/selector ในไฟล์นี้ (Grep หรือกวาดตา) → `Read` ไฟล์จริง `offset=<บรรทัด>` `limit=40`
> 🗂️ ไฟล์อ้วนมี **สารบัญโซน** (`st-end ชื่อโซน`) — งานทั้งระบบ/โลก 3D: Grep ชื่อโซน → Read/Edit เฉพาะช่วงนั้น **ห้ามอ่านทั้งไฟล์** · เพิ่มระบบใหม่ในไฟล์อ้วนต้องครอบ banner `/* ==== */`+ชื่อโซน (สารบัญเจนเอง)
> css = index `selector:บรรทัดทุกจุดที่ประกาศ` (บั๊ก UI เริ่มหาที่นี่) · เจนใหม่ทุกครั้งที่รัน `python tools/rotate_handoff.py` · อัปเดต: 2026-08-06

## js/adv3d_css.js (1,218 บรรทัด · 0 รายการ)

## js/adv3d_intro.js (86 บรรทัด · 0 รายการ)

## js/adv3d_tex.js (245 บรรทัด · 19 รายการ)
TILE_COLORS:9 · letterTexture:10 · letterTextureDark:27 · emojiTexture:40 · GHOST_IMG_MAX:52 · measureGhostBox:58
probeGhostImages:71 · whenGhostsReady:83 · ghostTexture:87 · ghostScareSrc:92 · AD_STYLES:100 · adBoardTexture:109
addAdBillboard:156 · ringAds:167 · BUILDING_TINTS:177 · FACADE_ROWS:179 · buildingFacadeTexture:180 · makePeerSprite:205
bind:241

## js/adventure3d.js (12,828 บรรทัด · 621 รายการ)
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
- 3977-4318 Multiplayer — ผู้เล่นอื่นใน map เดียวกัน (สไตล์ Roblox)
- 4319-4518 Voice chat ใน map — WebRTC P2P mesh (เสียงวิ่งตรงระหว่างเครื่อง)
- 4519-4599 🏁 พิธีประกาศแชมป์ (ครูกด "จบรอบแข่ง") — /class/<map>/podium
- 4600-4806 HUD
- 4807-5454 DOM overlay + CSS (สร้างครั้งเดียว — self-contained ไม่แตะ style.css)
- 5455-5590 Input — เมาส์+คีย์บอร์ด และจอสัมผัส (มือถือ landscape)
- 5591-5595 🚁 โหมดเฮลิคอปเตอร์ Bell — ฟิสิกส์บินแบบอาร์เคด (สไตล์ Helicopter Flight Pilot)
- 5596-5988 🛸 โดรน FPV (โหมด drone) — บินเร็ว/คล่อง ลอดหน้าต่างเข้าตึกร้าง เก็บตัวอักษรในห้อง
- 5989-6111 🚗 โหมดขับรถเมืองกำแพงเพชร — ฟิสิกส์รถอาร์เคด (bicycle model)
- 6112-6205 🚦 รอบ 133: ไฟจราจรจริงที่ทางแยกใหญ่ + ฝ่าไฟแดงโดนใบสั่ง ม.22
- 6206-6653 🧭 GPS นำทาง (โหมด drive) — เลือกตัวอักษรเป้าหมาย + เส้นทางตามถนนจริง (A*) · นำทางด้วยภาพล้วน (ไม่มีเสียงพูด ตั
- 6654-6712 🎛️ เข็มหน้าปัดวิ่งจริง (สปีด 0-180 + วัดรอบ 0-8×1000) — วาดทับวงเกจของภาพ dash.png
- 6713-6797 🎵 รอบ 181: วิทยุในรถ — จอ head-unit กลางคอนโซล (visualizer + เลือกเพลง 3 โหมด)
- 6798-6841 🪞📷 รอบ 810: กระจกมองหลัง/ข้าง — เรนเดอร์ฉากเดิมซ้ำด้วยกล้องหันหลัง/เฉียงข้าง แล้วยัดลงกรอบบนจอ (scissor)
- 6842-6925 🪞🧑‍🤝‍🧑 รอบ 973: เพื่อนที่ขับตามมา "เห็นในกระจกมองหลัง" + ป้ายชื่อลอยเหนือรถเขา
- 6926-7053 🪆 รอบ 191: ตุ๊กตาดุ๊กดิ๊กหน้ารถ — รูปตัวละครที่ผู้เล่นเลือก (blkN.png)
- 7054-7357 🚔 รอบ 128: แผงเตรียมออกรถ + กฎหมายจราจร + ใบสั่ง
- 7358-7400 🛩️📦 ภารกิจไปรษณีย์กลางคืน (รอบ 353) — เฉพาะช่วงฟ้ามืด (heliNight>.5)
- 7401-8615 🚶🛗🚁🪂 โหมดเดินเท้าในเมืองเฮลิฯ (รอบ 354 — ผู้ใช้สั่ง)
- 8616-8689 🎛️ หน้าปัดเข็มขยับจริง (รอบ 61) — วาดสดทุกเฟรมจากค่าการบินจริง
- 8690-8961 🌧️☀️ ชั้นบนกระจก: ที่ปัดน้ำฝน + แสงแดดสาด (รอบ 346)
- 8962-9366 🔊🌧️ เสียงที่ปัดน้ำฝน (รอบ 537) — สังเคราะห์ล้วน ไม่มีไฟล์เสียง
- 9367-9436 📹 กล้องใต้ท้องเครื่อง (belly cam) — รอบ 348
- 9437-9508 🎯 วงเป้าลงจอด (รอบ 349) — ไฮไลต์ดาดฟ้าที่มีตัวอักษร ให้รู้ว่าควรร่อนลงตรงไหน
- 9509-10124 📏 แถบเตือนความเร็วดิ่ง (รอบ 349) — ลงเร็วเกินกรอบกล้องกะพริบแดง สอนให้ร่อนลงนุ่มๆ
- 10125-10127 Loop หลัก
- 10128-11755 ⚽ โหมดสนามฟุตบอล — ฟิสิกส์บอล + เล็ง + ชาร์จพลัง + กล้อง 1st/3rd + ชุดนักเตะ
- 11756-12211 🤖 โหมดหุ่นยนต์นักรบ — เดินยิงเอเลี่ยนตัวอักษร (ต้องยิงเรียงลำดับในคำ)
- 12212-12232 เข้า/ออกโลก
- 12233-12828 ❓ การ์ด "วิธีเล่น" ตอนเข้าโลกครั้งแรก (จำแยกต่อโลกใน localStorage — ไม่แตะ state.js)
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
sendPos:4009 · netHonk:4057 · sendChat:4063 · toggleChatBox:4077 · onPeerData:4088 · disposeHeliMesh:4178
removePeer:4183 · netLeave:4198 · tickPeers:4204 · RTC_CFG:4327 · tinvLinked:4328 · partyWord:4335
syncPartyWord:4348 · updateVoiceBtns:4500 · PODIUM_BONUS:4525 · podiumJoin:4527 · podiumLeave:4538 · endRound:4539
showPodium:4550 · tinvCheck:4591 · showBanner:4604 · renderHudTop:4610 · renderHudWords:4615 · renderHudInv:4625
ddTierFromName:4632 · renderBoard:4634 · drawBigMap:4671 · openBigMap:4726 · closeBigMap:4734 · drawMinimap:4739
loadCarDash:4812 · loadCarWheel:4824 · buildDom:4834 · confirmExit:5439 · IS_TOUCH:5458 · HAS_KBD:5460
bindInput:5461 · movePlayer:5556 · tickPlayer:5566 · collideDrone:5599 · propStall:5618 · propBreak:5625
propFix:5632 · droneBatAdd:5639 · lightningBolt:5642 · startRain:5653 · stopRain:5667 · smashGlass:5669
awardGlass:5680 · neededLetter:5697 · openDoor:5712 · raceStartRun:5732 · raceStop:5739 · gateHighlight:5757
renderRaceHud:5764 · tickDrone:5773 · nearMissTick:5916 · showNearMiss:5940 · awardDaredevil:5951 · comboCheer:5968
comboFlash:5984 · driveCell:5993 · nearestStreet:5999 · collideCar:6009 · tlDotY:6040 · tlSet:6044
driveArms:6061 · tlTick:6073 · TL_GREEN:6117 · tlRedDur:6119 · tlightPhase:6120 · buildTrafficLights:6127
rlTick:6179 · cellDrivable:6211 · cellWeight:6214 · cellBlocked:6219 · cellCenter:6220 · posReachable:6222
losClear:6233 · nearestDrivableCell:6244 · routeGrid:6256 · pickGpsTarget:6309 · NAVLINE_W:6332 · NAVLINE_SKIP:6333
navLineEnsure:6334 · navLineHide:6344 · navLineUpdate:6345 · tickGps:6381 · tickDrive:6452 · drawCarDial:6660
drawCarGauges:6690 · RADIO_RECT:6718 · CAR_RADIO_RECT:6720 · carRadioRect:6726 · radioLayout:6728 · radioSetHint:6751
renderRadioList:6757 · radioToggleList:6767 · drawRadioViz:6772 · radioTick:6790 · MIRROR_REAR:6804 · mirrorRearRect:6807
mirrorPass:6809 · toggleMirrorMini:6822 · drawCarMirrors:6829 · MTAG_MAX_D:6851 · mirrorTagsHide:6855 · mirrorTagName:6856
mirrorTagsTick:6857 · BOBBLE_FOOT:6931 · BOBBLE_H:6932 · BOBBLE_ASPECT:6933 · BOB_OMEGA:6936 · BOB_PITCH_FORCE:6938
BOBBLE_SKINS:6940 · bobbleSetAvatar:6947 · bobbleLayout:6954 · bobbleTick:6967 · bobblePoke:6992 · bobbleApplySkin:7009
dollOwned:7019 · openDollPicker:7020 · carStartShow:7057 · showLawInfo:7075 · lawNotice:7097 · driveFineSettle:7107
HELI_PHASES:7286 · heliStartPhase:7293 · heliFloorAt:7300 · SOFT_TIERS:7310 · softLandBonus:7312 · awardPerfLand:7325
setHeliLight:7344 · MAIL_COIN:7363 · mailStart:7365 · mailStop:7388 · mailTick:7389 · FOOT_EYE:7408
doorSlideSfx:7414 · doorLerp:7437 · entLerp:7445 · footStepSfx:7455 · WRING_COIN:7476 · festivalPaint:7480
dustTexture:7492 · dustBurst:7501 · dustTick:7515 · HELI_GLB_URL:7536 · HELI_GLB_TEX_BLUE:7538 · HELI_GLB_ROTOR:7540
HELI_GLB_TROTOR:7541 · heliGlbEnsure:7543 · heliMatBlueGet:7561 · heliGlbAssemble:7574 · heliNavTick:7613 · peerRotorStop:7620
peerRotorTick:7626 · heliCrashSfx:7645 · heliMeshBuild:7673 · heliMeshBuildLegacy:7684 · buildHeliFoot:7814 · footFloorAt:7930
insideTerm:7937 · inDoorZone:7938 · footHint:7942 · setFootBtns:7943 · liftStart:7948 · beginRide:7959
endRide:7982 · beginWing:7993 · awardAirLetter:8006 · paxChoiceShow:8025 · paxChoiceHide:8051 · pilotShipMesh:8055
beginPilot:8056 · endPilot:8088 · drawCabinWindow:8112 · tickHeliFoot:8136 · heliWallPenalty:8347 · tickHeli:8359
CP_NAT:8624 · CP_GAUGES:8625 · SEAT_LABEL:8638 · SEAT_P_FULL:8639 · SEAT_ZOOM:8640 · DASH_OFF_Y:8641
DASH_DROP:8642 · setSeat:8644 · layoutCockpit:8656 · WIPER:8695 · WIPER_SPD:8698 · WIPER_LABEL:8699
INT_GAP:8700 · WASH_MS:8704 · WASH_TANK_MAX:8708 · SMEAR_LIFE:8720 · CHOP_MIN:8721 · SUN_RAY_FAR:8725
sunRayBlocked:8727 · sunShadeTick:8746 · applyCockpitShade:8757 · rotorChop:8769 · sunUpdate:8777 · HELI_FOG_N0:8788
fogUpdate:8792 · adGlowPulse:8840 · RAIN_MAX:8849 · VISOR_Y:8850 · RAIN_MIN:8851 · RAIN_DUR:8852
DROP_ZONE:8856 · addDrop:8857 · tickDrops:8865 · addWashDrop:8883 · washStart:8890 · renderWashGauge:8910
washTick:8921 · grimeTick:8938 · WIPE_R:8945 · wipeDrops:8946 · wiperSndOn:8969 · wiperSndOff:8981
wiperThunk:8987 · washSpraySfx:8999 · wiperSqueak:9016 · wiperSndTick:9033 · setWiper:9053 · tickWiper:9065
SH_SWEEP:9096 · shadowSweepTick:9098 · REFL_MAX:9110 · REFL_COL:9112 · cityGlowLevel:9113 · drawCityGlow:9118
setVisor:9150 · rainTick:9156 · drawBlade:9173 · drawSmears:9192 · drawGlass:9212 · drawBellyCam:9374
drawBellyHud:9397 · drawLandingTargets:9443 · VS_HARD:9513 · drawDescentBar:9514 · heliShake:9563 · cpNeedle:9574
drawGauges:9591 · XF_START:9639 · PRELOAD_WAIT:9640 · ALT_QUIET_FROM:9642 · ALT_MAX_DAMP:9643 · ALT_LP_MIN:9644
ECHO_NEAR:9645 · WIND_FULL_SPD:9646 · SHUTDOWN_SEC:9647 · PAN_MAX:9649 · OD_RPM:9650 · SHAKE_RPM:9651
SHAKE_HIT:9652 · soccerLetterPos:10132 · letterNeeded:10140 · soccerNeededSet:10149 · soccerTileGeo:10157 · soccerGoldTexture:10159
makeSoccerTile:10176 · soccerRefreshSkins:10185 · soccerBuildTargets:10192 · soccerNextTile:10202 · soccerRetarget:10218 · soccerCoinPop:10230
soccerGrassTexture:10243 · soccerTurfGrade:10265 · soccerTurfTexture:10316 · grassNormalTexture:10335 · soccerLinesTexture:10364 · soccerNetTexture:10415
soccerCrowdTexture:10423 · soccerBallMat:10442 · buildSoccerGoal:10462 · buildStands:10481 · soccerLedBoards:10516 · soccerGKEnsure:10613
soccerGKTick:10629 · fkBuildWall:10658 · fkToggle:10673 · fkHitTest:10689 · pkHud:10708 · pkStart:10717
pkEnd:10731 · pkTick:10746 · repQualify:10753 · repEnsureEl:10756 · repStart:10767 · repTick:10774
soccerNumTex:10799 · ssSec:10811 · ssPaintPattern:10816 · soccerShirtTex:10829 · makeSoccerPlayer:10851 · soccerNewSpot:10887
soccerResetBall:10899 · soccerKick:10906 · soccerCheer:10924 · guideTexture:10927 · auraActive:10951 · auraLeftMs:10952
auraFlameTex:10960 · auraCoilTex:10984 · auraCoilRibbon:11008 · auraGlintTex:11032 · buildAura:11043 · auraBuy:11086
auraRender:11096 · auraTick:11110 · buildDrill:11161 · drillTick:11174 · ballFXTex:11214 · buildBallFX:11225
smokePuff:11241 · ballFXTick:11249 · buildLandRing:11295 · buildGuideRibbon:11305 · renderSpinPad:11330 · spinPadToggle:11342
spinPadPick:11348 · renderCurl:11360 · kickLaunch:11371 · updateSoccerGuide:11380 · soccerCamera:11444 · tickSoccer:11467
ssShirtPath:11661 · ssShortsPath:11669 · ssPaintSwatchShirt:11674 · ssPaintSwatchShorts:11679 · ssPreviewDraw:11686 · soccerKitShow:11715
soccerKitGo:11744 · emojiSprite:11797 · makeAlien:11802 · startWave:11835 · waveSpawnFill:11846 · waveComplete:11855
updateWaveHud:11865 · checkMechaBossBadge:11867 · alienSpawnPos:11876 · removeAlien:11881 · mechaHudWord:11886 · setMechaHudSkin:11894
mechaComboPop:11906 · mechaShielded:11911 · mechaDamageFx:11913 · mechaHitByAlien:11918 · spawnAlienShot:11924 · removeAlienShot:11934
tickAlienShots:11939 · spawnPowerup:11951 · removePowerup:11964 · collectPowerup:11969 · tickPowerups:11976 · updateMechaHud:11985
mechaTracer:12025 · mechaFire:12034 · explodeAlien:12071 · tickMecha:12101 · loop:12157 · grabShot:12192
savePhoto:12203 · clearEntities:12215 · INTRO_KEY:12237 · introSeenObj:12238 · introSeen:12239 · markIntroSeen:12240
INTRO:12241 · INTRO_MODE:12243 · showIntro:12245 · HELI_KPP_BANNER:12271 · closeIntro:12273 · beginPlay:12279
start:12281 · exitWorld:12513 · mechaRecapLine:12585

## js/arena3d.js (724 บรรทัด · 0 รายการ)

## js/auth.js (404 บรรทัด · 34 รายการ)
AUTH_PUSH_MS:23 · AUTH_SDK_TIMEOUT_MS:24 · TEACHER_EMAILS:28 · isTeacher:29 · TESTER_EMAILS:42 · TESTER_COINS:43
isTester:44 · testerBoost:48 · authSetStatus:74 · authShowLogin:86 · authGateOffline:90 · authSaveRef:97
authFetchCloud:98 · authWriteCloud:99 · authDeleteCloud:100 · authWriteProfileName:101 · authPushProfile:108 · authApplyProfileName:116
authAskProfileName:132 · authEditProfileName:143 · authStart:154 · updateOfflinePill:184 · authEnterOffline:189 · authLateSync:206
authIsAppMode:226 · AUTH_REDIRECT_CODES:234 · authLoginClick:236 · authOnLogin:256 · authSyncOnLogin:269 · authFreshStart:298
authAskLink:307 · authEnterGame:357 · authPushSave:372 · authLogout:383

## js/award.js (274 บรรทัด · 0 รายการ)

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

## js/city3d.js (3,267 บรรทัด · 206 รายการ)
### 🗂️ สารบัญโซน js/city3d.js (Read/Edit เฉพาะช่วง)
- 2-18 city3d.js — 🏙️ VOCAB CITY: ล็อบบี้ 3D แบบเมืองลอยฟ้า (index.html = หน้าหลัก · รอบ 861 · สลับเป็นหน้าหลักรอบ 86
- 19-102 ⚙️ CONFIG + เครื่องมือกลาง (รอบ 861)
- 103-205 📷 CAMERA RIG — 1 นิ้วเลื่อน · 2 นิ้วหมุน/เอียง/ซูม (รอบ 861)
- 206-363 🖼️ CANVAS TEXTURE โรงงานผิวสัมผัส (พื้นเกาะ/หน้าต่างตึก/ป้าย)
- 364-424 🏗️ BUILDERS — อาคารแต่ละแบบ (ห้ามกล่องเปล่าแปะ texture — มีชั้นเชิง/ระเบียง/หลังคา/ป้ายจริง)
- 425-813 🚪🌀 รอบ 897: ประตูม้วนเลื่อนขึ้น (โรงรถ/โรงเก็บยาน) — บานพับหมุนไม่ได้เพราะช่องกว้าง 3-5 เมตร
- 814-910 🚗🏍️🚁🛸 ยานพาหนะจิ๋ว (ผู้เล่นจริงจากโลก 3D จะขับ/บินสิ่งเหล่านี้ในเมือง)
- 911-967 🧍 ตัวละครผู้เล่น — blk1-8 = หุ่นบล็อก 3D · blk9-88 = ป้ายภาพ 2D ตั้งในโลก
- 968-1308 🌆 ผังเมือง — อาคารทุกหลังผูก go=<key> (ตัวรับใน js/main.js)
- 1309-1453 🎉 เทศกาลตามวันที่จริง — พลุปีใหม่ / สงกรานต์ / ลอยกระทง (รอบ 863)
- 1454-1714 🧑‍🤝‍🧑 ผู้เล่นจริง (อ่านอย่างเดียว) — presence→ยืนตามอาคาร · world→ขับ/บินในเมือง
- 1715-1871 💬 รอบ 866: บับเบิลแชทสดลอยหัวเพื่อนในเมือง
- 1872-2028 🖊️💬 รอบ 868: พิมพ์ตอบแชทได้จากในเมือง (ไม่ต้องกลับล็อบบี้เดิม)
- 2029-2178 💬🔴 รอบ 873: ไอคอน "มีข้อความค้าง ยังไม่ได้อ่าน" ลอยเหนือหัวเพื่อน
- 2179-2196 🚪 รอบ 870: กลับจากล็อบบี้เดิม → โผล่ที่ "หน้าประตูตึกที่เพิ่งเข้า"
- 2197-2431 🚪🔊 รอบ 890: บานประตูตึกเปิด-ปิดจริง + เสียงประตูสังเคราะห์เอง
- 2432-2563 🚗🤖🛸 รอบ 900: ยานพาหนะแล่นออกจากช่องประตูม้วนที่เพิ่งเปิด → จอดรอหน้าประตู
- 2564-2731 🚶 รอบ 866: ตัวเราเดินไปหน้าตึกก่อน แล้วค่อยเข้าหน้านั้น
- 2732-2816 🚪🚶 รอบ 886: กลับจากล็อบบี้เดิม → "เดินออกจากตึกมาหน้าประตู" (walkSelfTo ย้อนทาง)
- 2817-2979 👆 แตะ/คลิก: ตัวละคร→การ์ดโปรไฟล์ · อาคาร→เดินทางไปหน้านั้น · พื้น→ประกายดาว
- 2980-3033 🎵 รอบ 873: เพลงประกอบเมือง (BGM) — ปุ่มเปิด/ปิดมุมขวาล่าง
- 3034-3069 🚀 BOOT
- 3070-3267 🎬 รอบ 880: กลับจากล็อบบี้เดิม → จอเปิดคือ "ภาพเมืองใบที่เพิ่งเดินออกไป"
### รายการ js/city3d.js
ISLAND_R:22 · RING_IN:23 · BAND1_R:24 · GROUND_TEX_PX:25 · NIGHT:26 · esc:46
hash:47 · rnd:48 · clamp:49 · TAU:50 · BLK8:54 · CAR_COL:65
gradeStars:70 · MAT:88 · mat:89 · GEO:93 · box:94 · cyl:95
M:96 · groundAt:127 · setupInput:136 · twoState:198 · cvs:209 · ctex:210
groundTexture:217 · wallTex:271 · wallMat:290 · shopSign:295 · roundRect:305 · iconSprite:312
nameSprite:328 · blobShadow:350 · parapet:372 · roofProps:377 · DOOR_W:389 · doorNightFx:393
doorAt:410 · ROLL_Z_HOLE:434 · slatTexture:437 · rollAt:447 · awning:471 · bTower:483
bShop:503 · bHouse:521 · bLibrary:537 · bFactory:555 · bArcade:582 · bObservatory:599
bHallOfFame:613 · bHaunted:634 · bHeliport:652 · bGarage:669 · bStadium:684 · bMotoTrack:706
bUfo:727 · bHangar:747 · bJungleGate:770 · bDronePad:792 · miniCar:817 · miniMoto:836
miniHeli:856 · miniDrone:876 · miniMecha:891 · makeBlockFigure:915 · makeSpriteFigure:951 · makeFigure:960
pickBlk:963 · bld:971 · BUILDINGS:972 · BLD_AT:1080 · buildCity:1082 · buildPlaza:1133
buildGreens:1179 · _glowTex:1224 · buildSky:1234 · buildAmbientTraffic:1296 · FESTIVAL:1313 · buildFestival:1325
buildFireworks:1332 · buildSongkranDeco:1374 · buildLoiKrathongDeco:1406 · actBuilding:1477 · loadFirebase:1488 · liveStart:1496
lbGet:1511 · watchPresence:1521 · spawnStander:1545 · WORLD_MAPS:1580 · pollWorlds:1587 · spawnVehicle:1638
removeActor:1698 · markPickable:1711 · BUB_MS:1724 · BUB_FRESH:1725 · BUB_MAXCH:1726 · BUB_MAX:1727
BUB_TEX_KEEP:1728 · bubTexture:1734 · bubTexRelease:1746 · bubbleSprite:1751 · bubDraw:1760 · killBubble:1787
showBubble:1800 · flushBubble:1838 · watchFriendChats:1846 · CITY_CHAT_MAX:1885 · CITY_QUICK_REPLIES:1887 · bubSafeText:1890
actorInfo:1896 · chatBoxCanSend:1906 · chatBoxWhy:1910 · chatBoxRefresh:1916 · openChatBox:1953 · closeChatBox:1965
cbNote:1970 · sendCityChatText:1976 · sendCityChat:2006 · cityStopLive:2011 · SAVE_KEY:2040 · saveRead:2043
pairIdOf:2046 · chatSeenTsCity:2048 · chatMarkSeenCity:2054 · unreadTexture:2067 · addUnreadBadge:2085 · removeUnreadBadge:2106
setUnread:2116 · applyUnread:2122 · markReadCity:2124 · unreadCount:2132 · spawnSelf:2138 · DOOR_MEM:2189
rememberDoor:2190 · lastDoorKey:2191 · DOOR_SWING:2213 · DOOR_OPEN_S:2214 · DOOR_SHUT_S:2215 · DOOR_AJAR:2219
AJAR_QUIET_MS:2220 · ROLL_OPEN_S:2225 · ROLL_SHUT_S:2226 · ROLL_LIFT:2227 · ROLL_AJAR:2228 · registerDoor:2231
doorLeadS:2244 · doorSpillTexture:2250 · doorCreakSfx:2261 · doorLatchSfx:2279 · shutterRollSfx:2302 · shutterClunkSfx:2329
doorMoveSfx:2352 · setCityDoor:2359 · openCityDoor:2370 · closeCityDoor:2371 · setDoorRest:2373 · refreshDoorRest:2385
applyDoorPose:2395 · RIDE_GATE:2447 · RIDE_OUT_S:2448 · RIDE_PARK_S:2449 · DOOR_RIDES:2452 · rideLeadS:2462
rideSfx:2467 · ridePose:2492 · launchRide:2509 · releaseRide:2521 · WALK_SPD:2570 · WALK_MIN:2571
WALK_MAX:2572 · DOOR_GAP:2573 · RECEPTION_SPOT:2577 · doorSpotOf:2578 · walkPose:2589 · footCtx:2604
footStepSfx:2609 · footDustTexture:2630 · footDustPuff:2639 · footDustTick:2653 · FOOT_STEP_DIST:2668 · DOOR_OPEN_AT:2669
walkSelfTo:2671 · EXIT_BACK:2743 · EXIT_DUR:2744 · EXIT_STEP:2745 · EXIT_CLEAR:2746 · EXIT_SHUT:2747
stageExitWalk:2750 · walkSelfOut:2762 · onTap:2820 · captureCityShot:2839 · travelTo:2872 · sparkleAt:2908
openProfile:2932 · refreshChip:2971 · setChip:2975 · BGM_KEY:2986 · BGM_DUCK_PICTURE_DICTIONARY:2987 · bgmWant:2989
bgmEnsure:2990 · BGM_DEV:2999 · bgmPlay:3000 · bgmDuckForPictureDictionary:3002 · bgmRefreshBtn:3007 · bgmToggle:3014
bgmSetup:3019 · boot:3037

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

## js/online.js (2,027 บรรทัด · 109 รายการ)
### 🗂️ สารบัญโซน js/online.js (Read/Edit เฉพาะช่วง)
- 2-217 ENGINE: ระบบออนไลน์จริงผ่าน Firebase Realtime Database
- 218-313 ระบบเพื่อน (ข้อ 0.3): รหัสเพื่อน + ค้นหา + ส่ง/รับคำขอ
- 314-503 ระบบแชทกับเพื่อน (ข้อ 0.4)
- 504-675 ระบบส่งของขวัญ (ข้อ 0.5)
- 676-792 🏪 ตลาดออนไลน์จริง (item 2 backlog): ซื้อ-ขายสินค้าที่เพื่อน "ผลิตเอง" ข้ามผู้เล่น
- 793-857 คำเชิญเล่นโลก 3D ด้วยกัน — /tinv/<toUid>/<fromUid> = {map,n,ts}
- 858-1054 📰 Follow + Feed กิจกรรม (รอบ 155) · 🌍 หน้า Feed ทุกคน + ไลก์/คอมเมนต์ (รอบ 639)
- 1055-1062 🌍 หน้า Feed ทุกคน + ไลก์/คอมเมนต์ (รอบ 639)
- 1063-1205 📰 รอบ 701 — ฟีดล็อบบี้ทีละโพสต์ + รีแอ็กชัน + แจ้งเตือน (ต่อยอดรอบ 639)
- 1206-1438 🔔📥 รอบ 976 — เก็บแจ้งเตือนไลก์/คอมเมนต์ลง DB โซนใหม่ /gnotif/<uid>
- 1439-2027 📞 โทรหาเพื่อน — Voice call / Video call แบบ LINE (รอบ 625 · กลุ่ม 3 คนรอบ 631)
### รายการ js/online.js
ONLINE_STALE_MS:71 · ONLINE_BEAT_MS:72 · LEADERBOARD_SIZE:73 · onlineDisplayName:77 · onlineActivity:85 · ensureOnlineId:103
onlineKey:113 · onlinePushPresence:118 · onlinePushScore:128 · fetchPlayerStats:168 · onlineRerender:190 · notifyFriendBadges:202
FRIEND_ALPHA:228 · friendCode:229 · friendSearch:241 · friendRequest:265 · friendAccept:276 · friendDecline:288
friendsHeal:298 · CHAT_MAX_LEN:322 · CHAT_KEEP:323 · chatPairId:325 · chatRef:328 · chatListen:334
chatSend:350 · chatDeleteMsg:366 · TYPING_TTL:374 · typingRef:376 · chatSetTyping:377 · chatClearTyping:387
chatWatchTyping:395 · chatThemeRef:413 · chatSetTheme:414 · chatWatchTheme:419 · chatPrune:427 · chatSeenTs:444
chatMarkSeen:450 · chatUnreadCount:462 · chatWatchSync:465 · GIFT_EXPIRE_MS:515 · giftSend:518 · greetSend:536
giftAccept:550 · giftDecline:554 · giftInWatch:560 · giftReclaim:591 · giftOutWatchSync:601 · giftOutRebuild:656
salesWatch:686 · salesRerender:694 · sellInc:698 · marketWatch:706 · marketList:739 · marketUnlist:747
marketBuy:756 · marketSoldWatch:769 · tinvSend:798 · tinvClear:805 · tinvPartyTick:813 · TINV_WORLD_LABEL:835
tinvWatch:839 · FEED_MAX:866 · feedEvent:869 · feedPrune:881 · feedPurgeCat:892 · feedPushAssets:903
petDescriptor:921 · feedPushPets:927 · fetchPlayerPets:941 · followSet:957 · followUnset:968 · feedRebuild:975
feedWatchSync:987 · fetchPlayerFeed:1014 · fetchPlayerAssets:1027 · fetchFollowers:1046 · GFEED_READ:1072 · GFEED_KEEP_ME:1073
gfeedPush:1076 · gfeedPrune:1090 · gfeedParse:1103 · gfeedWatchStart:1132 · gfeedWatchStop:1159 · gfeedNotifDiff:1167
gfeedNotifPush:1202 · GNOTIF_KEEP:1230 · GNOTIF_QUIET:1232 · gnotifKeyOf:1235 · gnotifSend:1242 · gnotifAdd:1255
gnotifRecount:1275 · gnotifMarkSeen:1280 · gnotifWatchStart:1291 · gnotifListen:1300 · gnotifWatchStop:1318 · gnotifPrune:1323
uidDisplayName:1336 · gfeedRebuild:1347 · gfeedToggleLike:1364 · gfeedSetReaction:1369 · gfeedToggleCommentLike:1385 · gnotifTellComment:1403
gfeedAddComment:1415 · CALL_RTC_CFG:1463 · CALL_RING_MS:1464 · CALL_MAX_MS:1465 · CALL_MAX_PEERS:1466 · onlineStart:1882
onlineLoadSDK:2002

## js/petbehavior.js (182 บรรทัด · 0 รายการ)

## js/photo.js (361 บรรทัด · 25 รายการ)
PHOTO_LS_KEY:12 · PHOTO_MAX:13 · PHOTO_PREFIX:14 · PHOTO_SIZES:15 · PHOTO_QS:16 · PHOTO_ZMAX:17
photoValid:25 · photoOnline:28 · photoGet:31 · photoHas:32 · photoIsMine:33 · photoOf:36
photoFetch:44 · photoAfterChange:61 · photoPush:65 · photoVerify:83 · photoSaveUrl:93 · photoRemove:99
photoPullMine:106 · photoBlkSrc:122 · photoMiniHTML:129 · openPhotoMenu:137 · photoLoadImgEl:203 · photoLoadFile:211
openPhotoCrop:224

## js/picdict.js (1,102 บรรทัด · 0 รายการ)

## js/picmatch.js (460 บรรทัด · 0 รายการ)

## js/picquiz_online.js (603 บรรทัด · 0 รายการ)

## js/pmaward.js (28 บรรทัด · 0 รายการ)

## js/sgaward.js (28 บรรทัด · 0 รายการ)

## js/shootword.js (1,085 บรรทัด · 0 รายการ)

## js/state.js (1,213 บรรทัด · 94 รายการ)
### 🗂️ สารบัญโซน js/state.js (Read/Edit เฉพาะช่วง)
- 2-214 STATE + LocalStorage + กติกากลางของเกม
- 215-640 👍 รอบ 701: รีแอ็กชันฟีด (กดค้างปุ่มถูกใจแล้วเลือกได้เหมือน Facebook)
- 641-696 Daily Quest (item 3 backlog): ภารกิจรายวัน 3 อย่าง สุ่มตามวันที่
- 697-770 มูลค่าทรัพย์สินสุทธิ (net worth) — ฐานของระบบแรงค์
- 771-827 🚫🍽️ ป่วยเพราะหิว = ซื้อของกินไม่ได้ (รอบ 952 · ผู้ใช้สั่ง 3 ส.ค. 2026)
- 828-921 เครื่องยนต์บิลรายเดือน (กลาง — ค่าบำรุงบ้านตอนนี้ / ค่าไฟ-น้ำ-เน็ต เสียบเพิ่มได้)
- 922-1046 🍖 เงินค่าอาหารสัตว์รายเดือน — ทุกวันที่ 1 ของเดือน จ่ายตามจำนวนสัตว์ที่เลี้ยงอยู่
- 1047-1213 โรงงานผลิตสินค้า: จ่ายค่าผลิตด้วย "แต้มคำศัพท์"
### รายการ js/state.js
STORAGE_KEY:6 · QUIZ_PASS_REWARD:11 · CURE_COST:13 · HUNGRY_SICK_MS:14 · MEAL_HOUR:16 · MEAL_FULL:17
SLEEP_FROM_HOUR:18 · SLEEP_SICK_HOUR:19 · WAKE_HOUR:20 · DINNER_COST:21 · TOXIN_FULL:23 · DETOX_COST:24
FOODQUIZ_Q:26 · FOODQUIZ_COIN:27 · FOODQUIZ_BONUS:28 · FOODQUIZ_MAX_PLAYS:29 · SHAPE_JUNK_MEALS:31 · SHAPE_CLEAN_MEALS:32
SHAPE_MISS_MEALS:33 · SHAPE_EXP_BONUS:34 · HEAT_SICK_MS:35 · THIRST_SICK_MS:36 · DEFAULT_STATE:38 · FEED_CATS:207
FEED_REACTIONS:221 · feedRx:229 · FEED_QUICK_CM:231 · SLOT_MS:243 · currentSlotStart:244 · nextSlotStart:250
mealDayKey:252 · nightKeyOf:254 · isNightNow:262 · newPet:267 · loadState:292 · saveState:601
activePet:608 · petStage:609 · isAdult:614 · abilityOn:615 · hasPetType:616 · todayStr:619
dailyTick:623 · addCoins:626 · QUEST_POOL:646 · QUEST_PER_DAY:655 · questsToday:656 · questTick:663
questEvent:667 · assetValue:703 · netWorth:723 · assetCount:725 · refreshRank:742 · heatProtected:758
rainProtected:762 · petHungry:765 · petCanEat:769 · hungerSickLock:778 · hungerSickMsg:792 · petShapeOf:800
updatePetShape:806 · shapeMealDone:813 · heatPct:823 · ymStr:832 · billOutstanding:836 · UTILITIES:843
HOME_UTILITIES:849 · homeDecayed:851 · billTick:854 · PET_FOOD_PER_PET:926 · petFoodTick:927 · myCar:953
carLoanDue:958 · carLoanOverdue:963 · carLoanPayable:968 · carLoanPay:975 · compTick:988 · ONLINE_RATE:1002
onlineEarnActive:1003 · onlineEarnTick:1007 · onlineEarnFlush:1018 · marketTick:1028 · addCraft:1052 · ORDER_MAX:1071
ORDER_LIFE_MS:1072 · ORDER_GAP_MIN_MS:1073 · ORDER_GAP_SPAN_MS:1074 · ORDER_TIER_WEIGHT:1075 · newOrder:1076 · orderTick:1089
careTick:1097 · expNeed:1184 · addExp:1189 · addRP:1209

## js/thaitime.js (52 บรรทัด · 13 รายการ)
TH_TZ_MIN:22 · TH_DAY_MS:23 · thShift:28 · thMs:30 · thDate:31 · thHour:32
thHourF:33 · thDayKey:34 · thDayStart:35 · thAtHour:39 · thTs:40 · TH_TZ_OPT:45
thLocaleOpt:46

## js/tpaward.js (41 บรรทัด · 0 รายการ)

## js/typing.js (369 บรรทัด · 0 รายการ)

## js/ui.js (9,110 บรรทัด · 373 รายการ)
### 🗂️ สารบัญโซน js/ui.js (Read/Edit เฉพาะช่วง)
- 2-77 UI: Dashboard / ร้านค้า / ที่พัก / ร้านสัตว์เลี้ยง / แรงค์ / สถิติ
- 78-344 🎬 เวทีน้องน่ารัก (Cute Pet Show) — รอบ 604 (ผู้ใช้สั่ง 26 ก.ค. 2026)
- 345-638 🆕 New Word (รอบ 116): คำศัพท์ใหม่ 1 คำ/การ login ตามระดับชั้น
- 639-663 นาฬิกาใต้ชื่อผู้เล่น (วัน · วันที่ · เวลา อัปเดตทุกวินาที)
- 664-724 ข้าวเย็นของผู้เล่น (คิว 7725691507 ข้อ 6)
- 725-756 แถบฝนประจำวัน: นับถอยหลังถึง 19:00 ทุกวัน (ฝนตก 1 ชม.)
- 757-809 เอฟเฟกต์ฝนเต็มจอ (รอบยี่สิบ): ฝนตกจริง (19:00-20:00) + ไม่มีบ้านสภาพดี
- 810-830 การ์ด "คนที่กำลังทำการบ้านไปพร้อมๆ กับเรา"
- 831-885 รอบ 149: กล่อง aside ขวาเลื่อนวนอัตโนมัติ (ล่าง→บน) ไม่มี scrollbar
- 886-1277 Daily Quest (item 3): การ์ดภารกิจวันนี้ใน aside ขวา
- 1278-1370 รอบ 153: เมนูลัดแตะแถวเพื่อนออนไลน์ในกล่อง aside
- 1371-1971 การ์ด Leaderboard — สลับแท็บในการ์ดเดียว (ประหยัดพื้นที่):
- 1972-2336 การ์ดข้อมูลผู้เล่น 👤 — คลิกชื่อในการ์ดเพื่อน/กระดาน แล้วโชว์
- 2337-2587 แผงเพื่อน 👥 (ข้อ 0.3): รหัสเพื่อน + ค้นหา + คำขอ + รายชื่อเพื่อน
- 2588-2683 🌍 เพื่อนอยู่โลก 3D ไหน + ปุ่ม "ตามเข้าไป" (รอบ 642)
- 2684-2722 แชทกับเพื่อน (ข้อ 0.4) — กล่องแชทลอยกลางจอ + แผง emoji
- 2723-3124 รอบ 179: หน้ารวมข้อความ (inbox แบบ Messenger — ธีมกระจกฟ้า sci-fi ของเกม)
- 3125-3485 ระบบส่งของขวัญ (ข้อ 0.5) — ห้องของขวัญ + กล่องเลือกส่ง + ฉากเปิด
- 3486-3578 RANK CARD + ฉากเลื่อนแรงค์
- 3579-3581 PET DASHBOARD
- 3582-3651 📰 รอบ 155: overlay ข้อมูลน้อง & การดูแล + ฟีดกิจกรรมเพื่อน
- 3652-4273 📰 รอบ 701 — ฟีดล็อบบี้ "ทีละโพสต์" แบบ Facebook (ผู้ใช้สั่ง 29 ก.ค. 2026)
- 4274-4484 🌍 รอบ 639: หน้า Feed เต็มจอ — ทุกคน (ไม่ใช่แค่ follow) + ไลก์/คอมเมนต์
- 4485-5171 📖 Dictionary ค้นหาคำศัพท์ (รอบ 254 ผู้ใช้สั่ง 16 ก.ค. 2026)
- 5172-5215 การนอน (คิว 7725691507 ข้อ 1)
- 5216-5643 ให้อาหาร (ระบบมื้อเย็น 18:00 + ความอิ่มสะสม — ข้อ 2+3)
- 5644-5762 🛡️ ควิซอาหารปลอดภัย (ต่อยอดข้อ 5.1)
- 5763-5848 🎀 ห้องแต่งตัวสัตว์เลี้ยง (รอบ 635: แยกออกจาก "ร้านค้า" เดิม —
- 5849-6036 ที่พัก (หลบแดด/หลบฝน) + เครื่องปรับอากาศ
- 6037-6154 บิลสาธารณูปโภค (ค่าไฟ/ค่าน้ำ — เครื่องยนต์อยู่ใน state.js: UTILITIES/billTick)
- 6155-6237 การ์ดมือถือ (ข้อ 7): ซื้อ 10,000 ขายคืน 6,000
- 6238-6248 การ์ดคอมพิวเตอร์ (ข้อ 11): ซื้อ 50,000 ขายคืน 30,000
- 6249-6293 item 8: โบนัสออนไลน์ +0.01 เหรียญ/วิ ฟรีทุกคนที่เปิดเกมออนไลน์อยู่
- 6294-6550 💻 รอบ 706 (ผู้ใช้สั่ง 29 ก.ค. 2026): ช่องรายได้คอมพิวเตอร์บนแถบบนล็อบบี้
- 6551-6892 🌀🔤 รอบ 1045 — Vocab Arena (โลกผจญภัยฉบับใหม่)
- 6893-7032 🌍 ปุ่มลัดเข้าโลก 3D ในรางเมนูซ้าย (ผู้ใช้สั่ง 9 ก.ค. 2026)
- 7033-7186 🧭 ป้ายบอกทางของรางเมนูซ้าย (รอบ 601 · ผู้ใช้สั่ง 26 ก.ค. 2026)
- 7187-7356 การ์ดสวนผลไม้ (ข้อ 12): ซื้อต้นไม้ปลูกได้ไม่จำกัด แต่ละต้นออกผล
- 7357-7366 โรงงานผลิตสินค้า 🏭 + ตลาดขายต่อ (แนวคิดใหม่ 5 ก.ค. 2026)
- 7367-7389 โรงงานผลิต (แผง 🏭) — แยกออกจากตลาด (ผู้ใช้สั่ง 6 ก.ค. 2026)
- 7390-7542 ตลาดขายสินค้า (แผง 🏪) — แยกออกจากโรงงาน
- 7543-8467 🚗 รอบ 131: หมวดยานพาหนะ — โชว์รูมรถ 10 คัน (แคตตาล็อก 5 ช่อง/แถว)
- 8468-8528 ร้านสัตว์เลี้ยง (ซื้อเพิ่มได้ ไม่ลบตัวเดิม)
- 8529-8565 เลเวลอัพ (รายตัว)
- 8566-8671 สถิติผลการเรียนรู้
- 8672-8709 item 4: การ์ดสรุปส่งครู — ใบเดียวจบ ชื่อ/วัน-เวลา/เหรียญวันนี้/แรงค์/สอบล่าสุด
- 8710-9110 📞 หน้าจอโทรหาเพื่อน — สายเสียง (รอบ 625 · กลุ่ม 3 คน + ปิดวิดีโอ รอบ 631)
### รายการ js/ui.js
startHTML:10 · PET_ANIM:30 · petAnimHTML:35 · petVisualHTML:50 · PET_SHOW:91 · PET_SHOW_STAGE:96
PET_SHOW_H:99 · petShowBgHTML:102 · petClipHint:145 · __clipReady:157 · PET_SHOW_SEQ:165 · petShowSeqHTML:180
petShowHTML:199 · PROF_AV_MAX:265 · lobbyBlk:266 · caretakerFigureHTML:273 · footAlign:283 · heroRankBgHTML:317
NEW_WORD_MS:351 · newWordNext:357 · renderNewWord:368 · NW_GAP:406 · alignNewWord:407 · startNewWordTimer:424
nwCountdownTick:441 · PAT_REMIND_HOUR:457 · patRemindTick:458 · applyPatRemindGlow:479 · NEW_WORD_COIN:494 · NW_DAILY_GOAL:495
NW_DAILY_BONUS:496 · newWordReward:497 · nwDailyTick:520 · coinFlyFx:539 · nwDailyBarHTML:572 · showNewWordPopup:583
renamePet:610 · mealLabel:627 · fmtMins:633 · renderClock:642 · selfName:671 · selfNameHTML:676
dinnerDue:677 · renderDinnerChip:682 · dinnerClick:693 · renderRainBar:728 · rainFxTick:761 · RAIN_DROP_IMGS:784
rainFxDrop:785 · selfPronoun:817 · selfTag:822 · idTag:826 · SIDE_SCROLL_SPEED:836 · SIDE_SCROLL_RESUME:837
initSideScroll:840 · sideScrollTick:868 · QUEST_FLASH_HOLD:892 · QUEST_SLIDE_MS:899 · QUEST_RESUME_MS:900 · questGo:903
SIDE_TALL_MIN:915 · sideIsTall:916 · qBigCardHTML:921 · qDeckGo:941 · qDeckTick:961 · renderQuestCard:982
sideFlashRows:1042 · FRIEND_FLASH_GRACE:1060 · ONLINE_FLIP_MS:1068 · ONLINE_FLIP_RESUME:1069 · ONLINE_SWIPE_STEP:1070 · ONLINE_ROW_H:1077
onPerPage:1080 · onChunk:1086 · ONLINE_GAP_MAX:1096 · onPageSpread:1097 · onPageDraw:1106 · onPageFlip:1117
bindOnlinePager:1128 · renderOnlineCard:1163 · bindInviteCards:1285 · bindFriendQuickMenu:1305 · openFriendQuickMenu:1315 · LB_TABS:1378
LB_WS_TOP:1379 · LB_PM_TOP:1380 · LB_TP_TOP:1381 · LB_SG_TOP:1382 · bindLbTabs:1384 · updateRankRailBadge:1425
rankUpCheck:1444 · rankUpSound:1472 · renderLeaderboardCard:1483 · bindLbGroupOpen:1512 · lbRankRows:1524 · LB_BCAT_TOP:1579
lbBadgeSections:1584 · lbDemoRows:1609 · lbChar:1631 · lbfAwardBarHtml:1641 · openLeaderboardFull:1655 · BLK_PAD:1788
BLK_PAD_NEW:1793 · BLK_TOP_FIX:1794 · seatPodChars:1795 · lbCoinHtml:1807 · lbBadgeHtml:1823 · lbBossHtml:1849
lbWordSearchHtml:1872 · lbTypingHtml:1908 · lbShootHtml:1942 · bindPlayerClicks:1977 · showPlayerCard:1987 · petDescImg:2266
openImgLightbox:2279 · openPetPeek:2299 · updateBillBadges:2343 · setBadge:2353 · tinvPendingCount:2369 · updateSettingsBadge:2378
openAttentionSummary:2393 · updateFriendBadge:2451 · renderFriendPanel:2461 · friendDoSearch:2509 · refreshFriendData:2533 · FRW_TTL_MS:2598
FRW_MIN_GAP:2599 · frwWorldOf:2603 · frwPanelOpen:2606 · frwScan:2611 · frwPaint:2633 · frwPaintHint:2654
frwFollow:2668 · CHAT_EMOJI_CATS:2689 · CHAT_THEMES:2711 · CHAT_SECRET_MS:2720 · chatBadgeSync:2728 · ibTimeStr:2736
IB_CALL_RE:2745 · ibCallInfo:2746 · openChatInbox:2751 · chatFitKeyboard:2921 · openChat:2937 · giftImg:3128
giftDateStr:3130 · GREETS:3138 · GREET_EXP:3146 · greetInfo:3147 · openGreetPicker:3151 · giftItemPic:3195
foodGiftBlocked:3205 · giftItemName:3211 · updateGiftBadge:3217 · renderGiftPanel:3226 · acceptGift:3284 · declineGift:3307
showGreetReveal:3316 · showGiftReveal:3343 · openGiftPicker:3369 · confirmSendGift:3437 · doSendGift:3463 · rankBadgeHTML:3489
renderRankCard:3494 · renderRankTab:3528 · showRankUp:3556 · bindPetPlateButtons:3591 · openPetInfoOverlay:3621 · feedAgo:3644
FEED_DECK_MAX:3664 · FEED_SLIDE_MS:3665 · FEED_RESUME_MS:3666 · feedPostImgIndex:3671 · feedPostImg:3682 · feedPostByKey:3691
feedCanReact:3694 · fpStatsHTML:3699 · fpNameBadgesHTML:3715 · fpostHTML:3719 · renderFeedCard:3754 · feedDeckGo:3792
feedDeckTick:3812 · renderFeedBell:3834 · FNT_JUMP:3843 · fntGiftName:3849 · feedNotifText:3853 · feedNotifGo:3868
feedNotifArrived:3883 · openFeedNotif:3890 · closeRxPicker:3945 · openRxPicker:3949 · feedFlyWord:3969 · feedPickRx:3980
FCM_REP_SHOW:3995 · FCM_FOCUS_POST:3996 · openFeedComments:3998 · closeFeedComments:4020 · fcmRowHTML:4029 · showCommentLikers:4052
fcmTreeHTML:4074 · renderFeedComments:4099 · bindFeedPostEvents:4227 · openFeedBoard:4280 · renderFeedBoardLive:4301 · renderFeedBoard:4319
stageColLeft:4338 · alignPetTabs:4347 · alignFeedPlate:4359 · alignProfilePlate:4375 · COIN_K_MIN:4393 · alignCoinBlock:4394
alignStageLeft:4422 · laneModeOn:4434 · alignStageCols:4447 · watchStageCols:4462 · alignCureBtn:4472 · dictRecordLookup:4496
DICT_FILE_COUNT:4507 · loadDict:4508 · dictSearch:4523 · dictTapWords:4538 · dictEntryHTML:4542 · openDictOverlay:4553
renderDashboard:4637 · sleepBtnHTML:5177 · sleepHintHTML:5184 · sleepAllPets:5195 · wakeAllPets:5208 · feedPet:5219
openFoodMenu:5238 · feedWith:5329 · AVATAR_UI:5359 · playerAvatarHTML:5363 · SHAPE_UI:5371 · showFeedResult:5380
curePet:5421 · heartsFx:5451 · PAT_HOLD_MS:5474 · PAT_EXP:5475 · bindPetTap:5476 · petBounce:5494
petMood:5500 · shortPatPet:5507 · longPatPet:5515 · patCalendarHTML:5535 · patDayKey:5569 · patStreakNow:5573
patStreakTick:5578 · cureCelebrateFx:5603 · railCureClick:5614 · detoxPet:5626 · openFoodQuiz:5649 · closeDressUpBoard:5768
openDressUpBoard:5772 · renderShop:5789 · homeVisualHTML:5852 · showHomeRuined:5866 · showCutNotice:5887 · renderHomeCard:5905
payMaint:5989 · trashBillUI:6005 · payTrash:6022 · UTILITY_UI:6041 · utilityBillUI:6090 · payUtility:6115
buyUtilityFix:6141 · renderPhoneCard:6159 · buyPhone:6199 · sellPhone:6221 · compLiveTotal:6242 · onlineLiveTotal:6253
syncCoinHeader:6260 · flashPillGain:6265 · renderOnlineEarnPill:6274 · renderCompEarnPill:6299 · openPillInfo:6332 · renderComputerCard:6415
buyComputer:6450 · sellComputer:6473 · soldCount:6494 · soldBadge:6495 · loadScriptOnce:6501 · advBusyMsg:6526
advResetLoad:6538 · loadAdv3d:6544 · loadVocabArena3d:6556 · enterAdventure3D:6560 · pickAdvMap:6582 · enterHaunted3D:6617
enterHeli3D:6639 · pickHeliMap:6665 · enterDrone3D:6701 · enterDrive3D:6720 · pickDriveMap:6758 · enterMotoMapAsCar:6794
enterSoccer3D:6813 · enterMoto3D:6832 · enterF1_3D:6854 · enterInvasion3D:6874 · WORLD3D:6900 · gotoRobotShop:6912
openHealDialog:6918 · world3DFail:6939 · railWorldClick:6970 · openWorldEntryDialog:6985 · railScrollHint:7038 · railScrollTop:7046
initRailScroll:7051 · renderRailWorlds:7071 · tinvNoticeHTML:7140 · openTinvPicker:7148 · fruitCountdown:7192 · renderFarmCard:7204
renderFarmClock:7279 · buyFruit:7295 · sellFruit:7315 · sellAllFruit:7336 · collectImg:7365 · renderFactoryCard:7371
renderMarketCard:7394 · updateWishBadge:7450 · openWishlistDialog:7461 · bindStripArrows:7506 · renderMarketBrowse:7520 · carImg:7549
renderVehicleShop:7550 · CS_CYCLE_MS:7601 · carInteriorImg:7602 · carStatHtml:7604 · renderCarShowroom:7611 · csShowBig:7638
csInit:7665 · RS_CYCLE_MS:7688 · robotImg:7689 · renderRobotShop:7690 · rsShowBig:7712 · rsInit:7733
buyRobot:7752 · enterMecha3D:7777 · pickMechaRobot:7804 · pickDriveCar:7836 · openCarBuyDialog:7879 · buyCarInsurance:7940
payCarLoanMonthly:7959 · payCarLoanFull:7971 · carDriveBlock:7990 · gotoVehicleShop:7995 · gotoMyStock:8000 · showNeedCarDialog:8006
craftDiscount:8018 · renderFactory:8021 · renderOrdersUI:8090 · startProduce:8109 · buyCollectible:8137 · cancelProduce:8167
deliverOrder:8181 · renderOrderClock:8198 · renderCollectMine:8208 · openListDialog:8250 · cancelListing:8303 · buyMarketItem:8326
showCollectReveal:8355 · buyAC:8393 · openHomeShop:8412 · renderPetShop:8471 · showLevelUp:8532 · renderStats:8569
showTeacherCard:8676 · CALL_REACT_EMOS:8720 · CALL_TALK_MIN:8723 · CALL_TALK_HOLD:8724 · CALL_ORDER_GAP:8726 · CALL_TONES:8732
startCall:9106

## js/util.js (1,204 บรรทัด · 47 รายการ)
### 🗂️ สารบัญโซน js/util.js (Read/Edit เฉพาะช่วง)
- 2-23 UTIL: เสียง / เอฟเฟกต์ / เครื่องมือทั่วไป
- 24-1173 🎖️ รอบ 643: สัญลักษณ์ระดับชั้น (ผู้ใช้สั่ง 28 ก.ค. 2026)
- 1174-1204 🖱️🚫 รอบ 833: กันกล่องดำ "To show your cursor, switch apps, reload the page…"
### รายการ js/util.js
shuffle:6 · fmtNum:15 · escapeHTML:19 · gradeSymbol:32 · gradeMark:47 · nameWithGrade:55
gradeMarkCanvas:61 · gradeOf:77 · seededRand:92 · fmtThaiDT:104 · fmtThaiDate:108 · showScreen:113
TOAST_WARN_RE:123 · restackToasts:126 · clearWarnToasts:152 · toast:156 · toastLink:183 · floatFx:201
beep:212 · soundStatus:233 · PET_MOOD:346 · petVoiceSynth:353 · sirenSynth:430 · playCashier:454
cashierSynth:468 · keyTapSynth:501 · playSpark:542 · sparkSynth:556 · thunderFx:591 · wordAudioFile:659
speakCutOff:668 · speakWord:672 · speakLetter:711 · pickSpeakVoice:734 · speakWordTTS:745 · askNameDialog:772
askConfirm:817 · alertBox:835 · applyNoAnim:855 · BLK_VOCAB:862 · openSettings:910 · openHelp:1113
openTeacherGuide:1139 · TAPGLOW_SEL:1163 · TOUCH_INPUT_SEEN:1182 · mouseLockOK:1191 · lockMouse3D:1197

## js/vocabbook.js (207 บรรทัด · 14 รายการ)
VB_MAX:11 · VB_QUIZ_N:12 · VB_QUIZ_MIN:13 · vbGroup:16 · VB_GROUP_UI:21 · vbRecord:24
vbSeen:49 · vbStats:62 · vbList:70 · vbReviewCat:81 · vbStartReview:95 · openVocabBook:106
vbRender:148 · vbCardHTML:194

## js/wordsearch.js (414 บรรทัด · 0 รายการ)

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

## css/lobby.css (5,544 บรรทัด · 784 selector)
:root:6,5330 · html:15 · body:16,5294,5336 · *:36,37,38,39 · #app:42 · h1:44
.subtitle:45 · .shop-title:46 · #rotate-overlay:49 · .screen:71 · #screen-select:80,81,82,83(+5) · .egg-need:90
.petshop-topright:92 · .petshop-play-link:93,98 · #screen-login:112,137,138,143(+7) · .login-lux:122 · .login-crest:123 · .login-word:127
.login-rule:133,134,135 · .login-tag:136 · #screen-game:185,186,187,188(+7) · #screen-quiz:199,200,201,202(+6) · #quiz-choices:211,212 · .word-card:219
.quiz-choice:220,221,222 · .big-btn:225,226,227,228 · #screen-dashboard:233,1133,1141 · .lobby-top:240,875,876,877(+36) · .top-flex:241 · .profile-plate:242,246,796,3735(+12)
#rain-fx:251 · .rain-glass:255 · .glass-drop:256 · .rain-vignette:275 · .no-anim:282,444,457,518(+59) · .rail-btn:285,891,897,899(+19)
.rail-badge:286 · .fr-code-box:291 · .fr-code-label:295 · .fr-code-row:296 · .fr-code:297 · .fr-copy-btn:302,306,311,312
.fr-search-btn:307 · .fr-add-btn:308 · .fr-accept:309 · .fr-decline:310 · #fr-search-input:313 · #fr-search-result:317
.fr-found:318 · .fr-hint:322 · .fr-list-title:323 · .fr-row:324 · .fr-req:328 · .fr-row-name:330,334,5034
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
.pl-click:744,746,747 · .pl-overlay:748 · .pl-card:752,2803 · .pl-close:758 · .pl-head:762,2571,2574 · .pl-grade:767,5040,5041
.pl-body:768 · .pl-loading:769 · .pl-none:770 · .pl-me-tag:771 · .pl-blk-wrap:773 · .pl-blk:774
.pl-stat:775 · .pl-lbl:780 · .pl-val:781,782 · .pl-tip:783 · .chip-edit:789,794,795 · .rank-mini:801,807,808,809
.pass-photo:811,816 · .pet-tabs:818 · .dict-box:819,823,824,825(+1) · .dict-card:831,836,840,841(+2) · .dict-head:837,838 · .dict-trail:845,849
.dt-c:850,854,855 · .dt-sep:856 · .dict-today:857 · .di-w:859,860,861 · .dict-list:862 · .dict-item:863,867,868,869(+5)
.lobby-mid:883 · .rail-wrap:886,930,941,942 · .rail-scroll:889,924,928,929 · .lobby-rail:890 · .rail-pinned:904,905 · .rail-nudge:931,939,940,943(+1)
.rail-worlds:950 · .rail-div:951 · .lobby-stage:993,995,1011,1138(+13) · .newword-banner:1001,1008,1013,4400(+2) · .coin-fly:1024,1027 · .coin-plus:1033
.nw-pop-coin:1048,1050,1051 · .nw-pop-goal:1054,1055,1059,1063 · .nw-goal-head:1056,1058,1060 · .nw-goal-bar:1061 · .nw-goal-fill:1062 · .nw-pop-book:1064,1065
.nw-tag:1086,4406,4428 · .nw-word:1091,4410,4433,4526 · .nw-hint:1093,1094,4411,4435(+1) · .nw-coin:1096,1099,4412,4416 · .nw-countdown:1104,4417 · .nw-bar:1106,4436
.nw-bar-fill:1108 · .pet-stage:1111,3097 · .nw-box:1118,3106 · .nw-pop-word:1119 · .nw-speak:1120 · .nw-pop-phon:1121
.nw-ipa:1122 · .nw-pop-sent:1123 · .nw-pop-mean:1124 · .pet-tab:1125,1126,1127,3541 · .stage-hero:1148,1163,1171,1316(+25) · .hero-ground:1185,1305,1311
.hero-rank-bg:1187,1190,1193,1197(+18) · #lobby3d-canvas:1210,1211 · .hero-scene:1215,1217,1224,1225(+8) · .caretaker-fig:1264 · .caretaker-img:1267 · .caretaker-emoji:1269
.blk-rig:1276,1277,1278 · .stage-plate:1338,1346,1357,1358(+23) · .plate-title:1352 · .lobby-side:1385,1421,1426,1429(+22) · .side-sec:1388,2222,3437,3713 · .side-label:1389,1394
.side-label-row:1397,1398 · .lb-tabs-out:1399,1400,1404 · .side-glass:1408,1415 · .side-card:1427,1538 · #quest-card:1439,1440,1468,1469(+6) · .q-bigcard:1445,1474
.qb-top:1447 · .qb-emoji:1448 · .qb-name:1450 · .qb-bar:1451,1452 · .qb-row:1454 · .qb-prog:1455
.qb-reward:1456 · .qb-go:1457,1461 · .q-dots:1462 · .q-dot:1463,1464,1465 · .q-bonus:1466 · .inv-card:1485,1487,1488
.inv-btns:1489 · .inv-go:1490,1492 · .inv-x:1493 · #online-card:1497,3445,3446,3447(+4) · .fq-overlay:1498 · .fq-box:1500,3251
.fq-head:1504,1506 · .fq-close:1507 · .fq-sec:1509 · .fq-worlds:1510 · .fq-world:1511,1513 · .fq-acts:1514
.fq-act:1515,1518,1519 · .lb-prize:1552 · .lb-coins:1555 · .lbf-cell:1556,2650,2653,2654(+3) · .lb-award-bar:1558,1564,1565 · .lb-award-go:1566
.lbf-award:1568,1574,1575,1576 · .pod-pz:1577 · .wsa-overlay:1580 · .wsa-box:1582 · .wsa-head:1587 · .wsa-title:1588
.wsa-when:1589,1590 · .wsa-close:1591,1594 · .wsa-cols:1595 · .wsa-col:1596 · .wsa-sec-h:1597,1598 · .wsa-msg:1599
.wsa-msg-h:1602 · .wsa-msg-b:1603,1604 · .wsa-msg-none:1605 · .wsa-rules:1607,1608 · .wsa-list:1609 · .wsa-row:1610,1612
.wsa-r:1613 · .wsa-n:1614 · .wsa-s:1615 · .wsa-p:1616 · .wsa-prizes:1617 · .wsa-pz:1618,1621
.wsa-reveal-medal:1622 · .lobby-bottom:1637,1640,1641,1643(+7) · .lobby-quiz-btn:1654 · .lobby-book-btn:1655,1656 · .lobby-play-btn:1658,1662 · .lobby-exam-btn:1664,1665,1667
.panel-overlay:1672,1677,4541,4542(+8) · .panel-box:1678 · .panel-head:1685,1689 · .panel-close:1690,1695 · .panel-body:1696,1700,1701 · .panel-page:1698,1699
.collect-sub:1705 · .mkt-empty:1706 · .craft-box:1707 · .mkt-listing:1708 · .mkt-filter:1709,2053 · .hq-grid:1716
.hq-card:1717,1722,1746 · .hq-head:1723 · .hq-pic:1729,1731 · .hq-emoji:1733 · .hq-badge:1734 · .hq-stars:1738
.hq-price:1739,1744,1745,1748(+6) · .craft-credit:1752,1754,1755 · .car-grid:1762,1764,1765 · .robot-weap:1766 · .dmap-box:1769,1770 · .dmap-grid:1776
.dmap-card:1778,1781,1782,1783(+2) · .dmap-ico:1785 · .dmap-new:1788 · .dcp-grid:1790 · .dcp-card:1792,1795,1796,1797(+10) · .levelup-box:1814,3060,3061,3248
.dcp-box:1817,1818,1822,1823(+6) · .dcp-lock:1831 · .sold-badge:1835,1837,1838 · .rs-showroom:1840,4992,4993 · .rs-list:1841,1843,4973,4976 · .rs-thumb:1844,1846,1847,1848(+1)
.rs-thumb-pic:1849,1850 · .rs-thumb-price:1851 · .rs-stage:1853 · .rs-big:1856 · .rs-big-img:1857 · .rs-elec:1861,1865,1870
.rs-edge:1871,1877 · .rs-info:1880,1881,1882,1883(+1) · .rs-buy:1885,1887,1888 · .cs-showroom:1892,4965,4966,4994(+3) · .cs-list:1893,1895,4967,4972(+9) · .cs-thumb:1896,1898,1899,1900(+1)
.cs-thumb-pic:1901,1902 · .cs-thumb-name:1903 · .cs-thumb-price:1904 · .cs-thumb-own:1905 · .cs-stage:1907 · .cs-big:1910
.cs-big-img:1911 · .cs-elec:1915,1919,1923 · .cs-edge:1924,1930 · .cs-interior:1933 · .cs-inr-label:1934,1935 · .cs-inr-img:1936
.cs-info:1938,1939,1940,1941(+6) · .cs-buy:1949,1951,1952,1953 · .car-emoji:1955 · .car-mine:1961 · .car-mine-pic:1966 · .car-mine-info:1967
.car-loan:1968,1969 · .car-mine-btns:1970,1971,1972 · .car-locked:1974 · .car-mine-head:1976 · .car-pick-list:1977,1978 · .car-pick:1979,1981,1982
.car-pick-pic:1983,1984 · .car-pick-name:1985,1986 · .car-pick-od:1987 · .car-buy-box:1989,3255 · .cb-pic:1990,1991,1992 · .cb-lines:1993
.cb-li:1994,1998,1999 · .cb-ins:2000,2004,2005 · .cb-plan:2006 · .cb-pl:2007,2012,2014,2018(+1) · .cb-total:2025 · .cb-btns:2026,2031
.cb-x:2027 · .shop-grid:2034 · .shop-item:2035,2040,2045,2046(+3) · .mkt-tab:2054,2055 · .pg-btn:2056,2057,2058 · .pg-dot:2059
.fr-gift-btn:2082,2087 · .gift-sec-title:2090 · .gift-in-row:2092 · .gift-out-row:2096 · .gift-in-pic:2097,2099,2100 · .gift-in-info:2101,2102
.gift-in-btns:2103 · .gift-accept:2104,2108,2110 · .gift-decline:2109 · .gift-box-card:2111 · .gift-box-from:2112,2113 · .gift-note:2114
.gift-pick-overlay:2117 · .gift-pick-box:2121 · .gift-pick-head:2127,2131 · .gift-pick-close:2132 · .gift-pick-tabs:2134 · .gp-tab:2135,2139
.gift-pick-body:2140 · .gp-chips:2141 · .gp-chip:2142,2146 · .gp-card:2147,2148 · .gp-price:2149 · .gp-note:2150
.gift-cf-pic:2151 · .chat-emoji-cats:2156 · .chat-emoji-cat:2160,2164,2165 · .chat-emoji-wrap:2166,2167 · .stage-left:2176,4532 · .pet-info-btn:2180,2187,2188
.feed-list:2195,2199,2224,2225(+1) · .feed-empty:2200,2203 · .fd-tools:2209 · .feed-bell:2210,2212,2213,2214 · .fd-prog:2218,2219 · .fpost:2226,2942
.fp-head:2231 · .fp-who:2232 · .fp-name-line:2235 · .fp-name:2236 · .fp-when:2237 · .fp-badges:2239,2242
.fp-badge-ic:2240 · .fp-text:2244 · .fp-media:2247 · .fp-img:2249 · .fp-cap:2251 · .fp-big:2252
.fp-sum:2254,2256 · .fp-sum-rx:2257 · .fp-sum-none:2258 · .fp-en:2259 · .fp-bar:2261 · .fp-act:2262,2266,2268
.fp-like:2267 · .fp-page:2279,2280,2281,2282(+3) · .fp-rxbox:2285 · .fp-rxb:2289,2291,2292,2293(+1) · .fp-rxb-off:2295 · .fp-fly:2297,2300,2301
.fcm-overlay:2304 · .fcm-box:2306 · .fcm-post:2310,2311 · .fcm-rxs:2312 · .fcm-rx:2313 · .fcm-list:2314,2316
.fcm-row:2317,2318,2319 · .fcm-none:2320 · .fcm-item:2322 · .fcm-reps:2323 · .fcm-rep:2325 · .fcm-more:2327,2329
.fcm-arrow:2330 · .fcm-reply:2331,2333 · .fcm-like:2335,2338,2339,2340 · .fcm-likeic:2341 · .fcm-cnt:2343,2345 · .fcm-likers-box:2346
.fcm-likers-list:2347,2349 · .fcm-liker-row:2350 · .fcm-liker-none:2351 · .fcm-repbar:2352,2355 · .fcm-repx:2356 · .fcm-note:2358
.fcm-quick:2360,2362 · .fcm-q:2363,2366,2367 · .fcm-add:2368 · .fcm-input:2369,2371 · .fcm-send:2372,2374 · .fcm-locked:2375
.fnt-overlay:2377 · .fnt-box:2379 · .fnt-list:2383,2385 · .fnt-row:2386,2388,2401 · .fnt-ico:2389 · .fnt-tx:2390,2391
.fnt-sub:2392 · .fnt-hint:2394 · .fnt-go:2395,2398,2399,2407 · .fnt-tag:2402 · .fnt-note:2404 · .fcm-hl:2409
.feed-plate:2417 · .feed-all-btn:2418,2423 · .fdb-overlay:2428 · .fdb-box:2430 · .fdb-head:2434 · .fdb-close:2438,2440
.fdb-live:2441 · .fdb-live-title:2442 · .fdb-live-rows:2444,2446,2447 · .fdb-live-row:2448,2450,2451,2452 · .fdb-dot:2453 · .fdb-list:2455,2456
.fdb-empty:2457 · .fdb-row:2458 · .fdb-row-top:2460 · .fdb-ico:2461 · .fdb-txt:2462 · .fdb-name:2463
.fdb-ago:2464 · .fdb-actions:2465 · .fdb-like:2466,2469,2470,2471 · .fdb-cm-list:2472 · .fdb-cm-row:2473,2475 · .fdb-cm-empty:2476
.fdb-cm-add:2477 · .fdb-cm-input:2478,2480 · .fdb-cm-send:2481,2483 · .fdb-cm-locked:2484 · .pi-overlay:2487 · .pi-box:2491,2496,2497,2501(+3)
.pi-close:2503,2508,2509 · .pi-close-left:2511 · .pi-portrait:2513 · .pet-wear:2520,2523,2525 · .pi-portrait-wrap:2528,2530 · .pi-dress-btn:2538,2542,2543
.pi-shape-cap:2544,2547,2548,2549 · .pi-shape-toggle-btn:2551,2554 · .pi-dress-pip:2556,2561,2562,2563(+1) · .pi-wear-note:2566,2568 · .greet-card:2575 · .greet-sub:2576
.greet-grid:2577 · .greet-opt:2578,2581,2582,2583 · .greet-e:2584 · .pi-streak:2588 · .pi-streak-head:2590,2592 · .pi-streak-best:2593
.pi-dots:2594 · .pi-dot:2596,2597,2598 · .pi-streak-note:2599 · .pi-care-title:2600 · .lbf-overlay:2613 · .lbf-box:2616,2630,2631,2632(+10)
.lbf-head:2621 · .lbf-title:2622 · .lbf-tabs:2623,2626 · .lbf-note:2629 · .lbf-close:2645 · .lbf-close-l:2646
.lbf-body:2647 · .lbf-grid:2648 · .lbf-box-bcat:2667 · .lbf-bcat-wrap:2668 · .lbf-bcat:2670,2729,2730,2731(+3) · .lbf-bcat-head:2672,2673,2674
.lbf-bcat-mid:2681 · .lbf-bcat-badge:2682,2741 · .lbcat-ic:2692 · .badge-shine-img:2698 · .badge-shine:2716,2717 · .lbcat-ic-label:2743
.lbf-bcat-rows:2745 · .lbf-one-row:2749,2750,2751 · .lbf-bcat-row:2752,2754,2755,2757 · .lbf-podium:2769 · .pod:2771,2798,2799 · .pod-char:2773
.pod-base:2775 · .pod-rank:2777 · .pod-label:2779,5036 · .pod-name:2781 · .pod-sc:2783 · .pod-1:2788,2789
.pod-2:2790,2791 · .pod-3:2792,2793 · .pod-4:2794,2795 · .pod-5:2796,2797 · .pl-wide:2816,2819,2820,2821(+8) · .pl-follow:2822,2827,2829
.pl-unfollow:2831,2837,2838 · .pl-followers:2839 · .pl-cols:2840,2845,2846,2847 · .pl-col:2841 · .pl-sec-title:2842 · .pl-badges-col:2848
.pl-feed:2849,2852,2859 · .pl-feed-row:2853,2857,2858 · .pl-assets-wrap:2861,4873,4948 · .pl-assets:2862,4876,4881,4887(+4) · .pl-asset:2865,2869,2876 · .pl-asset-emoji:2870
.pl-asset-n:2871 · .pl-pets-wrap:2878 · .pl-pets:2879 · .pl-pet:2880,2885,2887 · .pl-pet-nm:2888 · .img-lightbox:2891,2896,2897,2901(+3)
.cert-svg:2920 · .cert-tap:2921,2926 · .cert-chip-sm:2929 · .pl-sec-sub:2949 · .pl-certs:2950,2952 · .cert-mini:2953,2957,2959
.cert-mini-cap:2960 · .cert-none:2962 · .lv-cert-row:2964,2966 · .lv-cert-btn:2967,2972 · .cert-lightbox:2974,2979,2980,2984(+3) · .pl-chat:3004,3009
.pl-call:3011,3017 · .pet-peek:3018,3019 · .pp-chips:3021 · .pp-chip:3022 · .pp-gift:3027,3033 · .settings-box:3035,3036,3109,3120(+30)
.set-feed-head:3037 · .set-feed-sub:3041 · .set-feed-row:3042 · .pillinfo-val:3047 · .pillinfo-desc:3052,3071 · .pillinfo-box:3063
.plf-head:3066 · .plf-emoji:3067 · .plf-ht:3068,3069,3070 · .plf-foot:3072,3074,3075 · .alert-box:3080,3082 · .ab-emoji:3083
.ab-title:3084 · .ab-desc:3085 · .ab-btns:3086,3087,3088 · .heal-heart:3090 · .attn-box:3105 · .set-tabs:3130,3134,3137,3138
.set-panels:3140 · .set-panel:3141,3144,3145 · .help-box:3229,3230,3231 · .wl-box:3249 · .food-box:3250 · .home-shop-box:3252
.summary-box:3253 · .report-box:3254 · .wl-grid:3257 · .tc-wrap:3259 · .spell-btn:3265,3270 · .sp-hud:3271
.sp-word:3273 · .sp-ch:3274,3279 · .sp-th:3281 · .sp-hint:3283 · .sp-exit:3286,3290 · .sp-banner:3291
.sp-big:3296 · .sp-thb:3298 · .sp-coin:3299 · #spell-confetti:3304 · .sp-rb:3305 · .sp-day:3315
.sp-perfect:3317 · .sp-late:3319 · #spell-coinpop:3322 · .side-sub:3431,3433 · .sec-quest:3438 · .on-page:3449,3450,3451,3452
.inbox-overlay:3462 · .ib-box:3464 · .ib-head:3468 · .ib-close:3472,3474 · .ib-list:3475,3476 · .ib-row:3477,3478,3479,3480
.ib-ava:3481,3486,3487 · .ib-on:3488 · .ib-mid:3490 · .ib-name:3491 · .ib-last:3492 · .ib-meta:3493
.ib-time:3494 · .ib-dot:3496 · .ib-story-badge:3499 · .ib-empty:3503 · .ib-story:3505,3507 · .ib-story-item:3508,3510,3517
.ib-story-ava:3511 · .ib-story-on:3515 · .ib-world:3520,3523 · .ib-tabs:3525 · .ib-tab:3526,3529,3531 · .ib-tab-dot:3532
.ib-call-ava:3536 · .ib-call-row:3537,3538 · #btn-music:3544,3547,3548 · #ws-overlay:3563 · #ws-board:3566,3572,3574 · .ws-head:3577
.ws-title:3578 · .ws-findbar:3581 · .ws-tip:3582 · .ws-grade:3584,3585 · .ws-body:3588 · .ws-gridwrap:3589
#ws-grid:3592 · .ws-cell:3597,3602,3605,3608(+2) · .ws-flash:3614,3616 · .ws-coinpop:3620,3644 · .ws-combo:3631,3635,3636,3637 · .ws-find:3648
#ws-prog:3649 · #ws-words:3653,3657 · .ws-word:3659,3664,3665,3666(+2) · .ws-actions:3672,3673,3682 · .ws-sizes:3677 · .ws-sizes-lb:3679
.ws-size-now:3680 · #ws-new:3683 · #ws-stash:3684 · #ws-clear:3685 · #ws-win:3686,3688 · .ws-win-in:3689,3692
.sec-online:3715 · .rank-tab:3743,3744,3745,3746(+2) · .pet-show-bg:3776,3779,3783,3787(+19) · .ps-night-fx:3879,3881,3893,3898(+1) · .pet-show:3908,3911,3923,3925(+48) · .ps-video:4139
.ps-worn-pip:4217,4218 · .id-card:4241,4248,4252 · .id-chip:4265 · .clock-chip:4274,4275 · .coin-block:4291 · .coin-group:4292
.coin-pill:4322,4323,4344 · .cp-lb:4347 · .cp-v:4348 · .topbar-icons:4384 · .topbar-icons-row:4385 · .topbar-theme-row:4386
.theme-swatch:4387,4392,4393 · #theme-navy:4395 · #theme-emerald:4396 · #theme-plum:4397 · .nw-sub:4434 · .top-flex2:4529
#panel-factory:4548,4549,4553,4554(+39) · #panel-rank:4689,4690,4696,4701(+11) · .grid2x8:4772,4778 · .grid1x5:4788,4794 · .pl-badges-strip:4800 · .pl-badge-card:4804,4810,4828,4829(+1)
.pl-badge-card-ic:4816,4825,4827 · .pl-badge-card-nm:4831 · .pl-badges-empty:4837,4839 · .mine-strip:4853,4855,4856,4861(+4) · .mb-strip:4867,4906 · .gmark:5014,5018,5019,5020(+1)
.gm-stack:5023,5027 · .gm-row:5029 · .lb-name:5031,5032,5033 · .grade-edit:5054,5059,5060 · .gradelock-box:5064,5080,5085,5087 · .gl-head:5065
.gl-emoji:5066 · .gl-ht:5067 · .gl-cur:5068 · .gl-lock:5069,5074 · .gl-ok:5073 · .gl-lock-sub:5075
.gl-why:5076 · .gl-pick-lb:5077 · .gl-opts:5078 · .gl-hist:5088 · .gl-hline:5089 · .gl-hg:5093
.gl-hat:5094 · .gl-harr:5095 · .gl-foot:5096 · .gl-cf:5097 · .reg-gradelock:5119 · #tp-overlay:5129
#tp-board:5131,5135 · .tp-head:5139 · .tp-title:5140 · .tp-stat:5142,5144 · .tp-pts:5146,5149 · .tp-close:5151,5157,5158
.tp-snd:5161,5164,5170,5171 · .tp-snd-ic:5165 · .tp-snd-track:5166 · .tp-snd-thumb:5168 · .tp-prompt:5175 · .tp-word:5177,5191,5192
.tp-ch:5179,5184,5185,5187 · .tp-thai:5195 · .tp-hint:5197 · .tp-empty:5199 · .tp-keys:5202 · .tp-row:5204
.tp-row-fn:5206,5239 · .tp-key:5210,5222,5224,5230(+2) · .tp-key-fn:5237 · .tp-fx:5243 · .tp-coinpop:5244 · .tp-pop-pt:5249
#city-backdrop:5263,5269 · .city-arrive:5270,5271 · .night:5285,5305,5306,5308(+2) · #night-veil:5331 · .theme-emerald:5360,5372,5379,5382(+7) · .theme-plum:5365,5376,5380,5383(+3)
#theme-veil:5393 · #screen-picmatch:5446,5447,5473,5474(+11) · .pm-grid:5448 · .pm-card:5450,5454,5456,5457(+8) · .pm-right:5478 · .pm-now:5479,5485
#pm-now-en:5486 · .pm-now-th:5487 · .pm-mode-btn:5518,5521 · .pm-wordcard:5522,5523,5525

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
