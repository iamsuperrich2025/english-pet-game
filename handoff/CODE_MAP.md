# CODE_MAP.md — แผนที่โค้ด:บรรทัด (เจนอัตโนมัติโดย `tools/gen_code_map.py` — **ห้ามแก้มือ** เดี๋ยวโดนเขียนทับ)

> วิธีใช้: หาชื่อฟังก์ชัน/ค่าคงที่/selector ในไฟล์นี้ (Grep หรือกวาดตา) → `Read` ไฟล์จริง `offset=<บรรทัด>` `limit=40`
> 🗂️ ไฟล์อ้วนมี **สารบัญโซน** (`st-end ชื่อโซน`) — งานทั้งระบบ/โลก 3D: Grep ชื่อโซน → Read/Edit เฉพาะช่วงนั้น **ห้ามอ่านทั้งไฟล์** · เพิ่มระบบใหม่ในไฟล์อ้วนต้องครอบ banner `/* ==== */`+ชื่อโซน (สารบัญเจนเอง)
> css = index `selector:บรรทัดทุกจุดที่ประกาศ` (บั๊ก UI เริ่มหาที่นี่) · เจนใหม่ทุกครั้งที่รัน `python tools/rotate_handoff.py` · อัปเดต: 2026-08-05

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

## js/city3d.js (3,260 บรรทัด · 204 รายการ)
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
- 2980-3026 🎵 รอบ 873: เพลงประกอบเมือง (BGM) — ปุ่มเปิด/ปิดมุมขวาล่าง
- 3027-3062 🚀 BOOT
- 3063-3260 🎬 รอบ 880: กลับจากล็อบบี้เดิม → จอเปิดคือ "ภาพเมืองใบที่เพิ่งเดินออกไป"
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
openProfile:2932 · refreshChip:2971 · setChip:2975 · BGM_KEY:2986 · bgmWant:2988 · bgmEnsure:2989
BGM_DEV:2998 · bgmPlay:2999 · bgmRefreshBtn:3000 · bgmToggle:3007 · bgmSetup:3012 · boot:3030

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

## js/game.js (1,191 บรรทัด · 84 รายการ)
REPLAY_BONUS_EVERY:23 · REPLAY_BONUS_TIERS:25 · replayBonusFor:26 · SESSION_MILESTONES:32 · addSessionCoins:35 · updateBestTarget:74
weekKeyStr:87 · rolloverWeekBest:94 · exitGame:100 · showSessionSummary:136 · sprinkleConfetti:183 · VOCAB_PER_LEVEL:202
VOCAB_RANK_NAMES:203 · vocabRankName:204 · showProgressReport:206 · THUNDER_MS:387 · THUNDER_TIERS:391 · THUNDER_TIER_UI:392
thunderEmoji:393 · DAREDEVIL_TIERS:397 · DAREDEVIL_TIER_UI:398 · daredevilEmoji:399 · GLASS_TIERS:403 · GLASS_TIER_UI:404
glassEmoji:405 · DILIGENT_TIERS:409 · DILIGENT_TIER_UI:410 · diligentEmoji:411 · SOFTLAND_TIERS:415 · SOFTLAND_TIER_UI:416
softLandEmoji:417 · AIRL_TIERS:421 · AIRL_TIER_UI:422 · airLetterEmoji:423 · MECHABOSS_TIERS:427 · MECHABOSS_TIER_UI:428
mechaBossEmoji:429 · TYPIST_TIERS:436 · TYPIST_TIER_UI:437 · typistEmoji:439 · checkTypistBadge:441 · BIGEXAM_TIERS:457
BIGEXAM_TIER_UI:458 · bigExamEmoji:459 · bigExamCertCount:461 · checkBigExamBadge:466 · BFF_TIERS:481 · BFF_TIER_UI:482
BFF_COIN:483 · bffEmoji:484 · badgeSuffix:489 · BADGE_META:508 · NAME_BADGE_RE:525 · splitNameBadges:526
badgeEmojis:532 · badgeScore:537 · BADGE_CATS:544 · bcatLevel:557 · checkCrown:564 · currentBadgeScore:580
rolloverBadgeWeek:584 · addDiligent:597 · BADGE_COIN:616 · awardBadgeCoin:624 · BC_QUEUE:638 · celebrateBadge:639
bcShow:653 · showBadgeInfo:682 · addThunder:700 · startGame:714 · newRound:754 · updateTimerBar:793
updateComboPill:799 · pickCard:803 · checkMatch:815 · renderCats:929 · fmtMMSS:979 · quizTimerStop:983
quizTimerStart:988 · quizElapsed:998 · startQuiz:1002 · renderQuizQuestion:1020 · quizNext:1084 · finishQuiz:1097

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

## js/invasion3d.js (9,985 บรรทัด · 612 รายการ)
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
- 6251-6410 🕹️ Input — มือถือ (จอย+ปุ่ม) และคอม (WASD + pointer lock)
- 6411-6531 🚶 ผู้เล่น + AI + ลูป
- 6532-6536 🚁 โหมดขับเฮลิคอปเตอร์เอง (รอบ 414 — ผู้ใช้สั่ง)
- 6537-6695 🗺️ รอบ 417: แผนที่เลือกจุดลงสนาม (ผู้ใช้สั่ง) — เข้าเกมแล้วเลือกได้ว่าจะไปเกิดตรงไหน
- 6696-6854 🎖️ รอบ 418: นั่งเฮลิลำเดียวกับเพื่อน — "นักบิน + พลปืนประจำประตู" (ผู้ใช้สั่ง)
- 6855-7216 🔭🚫 รอบ 575 (ผู้ใช้สั่ง): "ซูมปืนค้างไว้ = ขึ้นเฮลิไม่ได้ ต้องเลิกซูมก่อน"
- 7217-7480 🌐 ผู้เล่นออนไลน์ใน map เดียวกัน (รอบ 414) — Firebase /world/invasion
- 7481-7630 🧯👥 กันผู้เล่นล้น — ฝั่งเรนเดอร์ของโลกนี้ (รอบ 637 · ยกส่วนกลางออกไป js/netroom.js รอบ 640)
- 7631-7689 💨 ควันตามหลังมิสไซล์ (รอบ 531 — ผู้ใช้สั่ง) — สไปรต์ควันนุ่มปล่อยเป็นระยะ
- 7690-7857 🔥🌀 รอบ 565 (ผู้ใช้สั่ง): ยานลูก "หลบมิสไซล์ที่ล็อกได้" — ปล่อยแฟลร์ + บิดหนี
- 7858-7936 🔫↩️ รอบ 568 (ผู้ใช้สั่ง): ยานลูกที่ "ถูกเรดาร์ล็อก" ยิงสวนกลับใส่เฮลิผู้เล่น
- 7937-8138 🔥🛡️ รอบ 569 (ผู้ใช้สั่ง): แฟลร์ของ "เฮลิผู้เล่น" + เสียงเตือนตอนถูกล็อก
- 8139-8149 🏃🪖 รอบ 530: หน่วยรบเคลื่อนที่เชิงยุทธวิธี (ผู้ใช้สั่ง: "อย่าปักหลักยืนทื่อ
- 8150-8275 🧘🎯 รอบ 586 (ผู้ใช้ส่งคลิป: "ตัวละครดิ้นไปดิ้นมา ไม่เป็นธรรมชาติ")
- 8276-8451 📣 รอบ 471: ทหารฝ่ายเราตะโกนบอกทิศศัตรู (ผู้ใช้สั่ง)
- 8452-8894 🌙 รอบ 471: โหมดกลางคืน — ฉากมืดสลัว + ท้องฟ้าดาว + ไฟฉายติดปืน
- 8895-9161 🔵💀 รอบ 576 (ผู้ใช้สั่ง): ยานแม่ยิง "ลำแสงสีฟ้า" ลงมาใกล้ตัวผู้เล่น — เตือน 3 ครั้ง ครั้งที่ 4 ตายจริง
- 9162-9212 ⚡👾 รอบ 579 (ผู้ใช้สั่ง): "ทุก 5 นาที สุ่มยานลูก 10 ลำ เร่งความเร็ว 10 เท่า นาน 10 วินาที แล้ววนลูป"
- 9213-9286 🔁 ลูปหลัก
- 9287-9985 ▶️ เข้า/ออกโลก
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
renderHeat:6228 · renderMissiles:6234 · toastBan:6244 · bindInput:6254 · moveJoy:6401 · unlockMouse:6409
solidPushOut:6418 · tickPlayer:6433 · hurtPlayer:6513 · MAP_VIEW:6542 · mapToWorld:6543 · worldToMap:6544
zoneName:6545 · buildMapShade:6559 · drawSpawnMap:6578 · safeSpawn:6653 · fitSpawnMap:6663 · openSpawnMap:6674
applySpawnPick:6683 · RIDE_DIST:6706 · RIDE_UP:6707 · RIDE_OFF:6708 · rideableHelis:6709 · findRide:6715
nearestRideable:6716 · ridePos:6726 · setRideView:6738 · boardGunner:6747 · dismountGunner:6766 · tickGunner:6782
updateGunnerBtn:6822 · tickAutoBoard:6838 · heliCount:6850 · zoomBlocksBoard:6868 · enterHeli:6878 · exitHeli:6920
EXT_CAM:6949 · EXT_VIEWS:6970 · EXT_SELF:6985 · EXT_RIDE:6986 · extP:6988 · syncExtBtn:6990
cycleExtView:6996 · resetExtCam:7005 · angDiff:7007 · extCamClear:7012 · extCamera:7031 · seatCamera:7054
tickHeliFlight:7075 · heliCrash:7174 · tickGpws:7184 · syncBotHelis:7206 · netReady:7222 · netJoin:7228
netSend:7239 · peerColor:7261 · NAME_SPR_H:7265 · nameSprite:7266 · bakedSoldierGlb:7282 · loadPeerSoldier:7283
peerRig:7292 · setPeerWeapon:7297 · peerBody:7302 · buildPeer:7331 · onPeer:7344 · dropPeer:7389
netLeave:7396 · peerTick:7401 · renderBoard:7437 · sendChat:7462 · showPeerBubble:7469 · removePeerBubble:7475
PEER_DRAW_MAX:7488 · PEER_DRAW_SLACK:7489 · DRAW_SWAP_MARGIN:7490 · JOIN_TOAST_MAX:7491 · drawnPeers:7494 · drawSlotFree:7495
showPeerAgain:7498 · hidePeer:7505 · tickDrawBudget:7510 · tickCrowdGuard:7520 · resetCrowdGuard:7524 · tickFighters:7526
tickMother:7579 · spawnAlienShot:7602 · tickAlienShots:7614 · smokeTex:7636 · spawnPuff:7647 · spawnSmoke:7657
spawnDust:7659 · tickSmoke:7668 · clearSmoke:7678 · tickHeliDust:7681 · EVA_WARN:7703 · EVA_FLARE_D:7704
EVA_TURN:7705 · EVA_SPIN_MUL:7706 · EVA_SPD_MAX:7707 · EVA_ROLL:7710 · EVA_Y:7711 · FLARE_PODS:7712
FLARE_COOL:7713 · FLARE_N:7714 · FLARE_LIFE:7715 · FLARE_TRAP:7716 · FLARE_CH:7717 · incomingMis:7722
startEvade:7733 · dropFlares:7742 · tickEvade:7770 · clearFlares:7802 · tickMissiles:7803 · CTR_REACT:7872
CTR_WARN:7873 · CTR_GAP:7874 · CTR_BURST:7878 · CTR_BURST_MS:7879 · CTR_SPD:7880 · CTR_DMG:7881
CTR_MAX:7882 · CTR_SPREAD:7883 · CTR_LEAD:7884 · ctrAimPoint:7887 · ctrArming:7894 · counterFire:7898
tickCounter:7903 · SPK_RANGE:7954 · SPK_MS:7955 · SPK_GAP:7956 · SPK_WORLD_GAP:7957 · SPK_BEEP:7958
AMIS_SPD:7959 · AMIS_TURN:7960 · AMIS_DMG:7961 · AMIS_LIFE:7962 · AMIS_MAX:7963 · AMIS_PROX:7964
PH_FLARE_MAX:7965 · PH_FLARE_RE:7966 · PH_FLARE_N:7967 · PH_FLARE_COOL:7968 · PH_FLARE_BACK:7969 · PH_FLARE_DOWN:7970
PH_TRAP:7971 · PH_FLARE_CH:7972 · renderFlareBtn:7975 · dropPlayerFlares:7981 · fireAlienMissile:8013 · clearAMis:8028
resetSpike:8033 · spikeStart:8034 · aMisNear:8036 · tickSpike:8044 · tickAMis:8096 · SQUAD_COVERS:8148
squadCoverPool:8149 · SQ_TURN:8159 · angWrap:8164 · turnTo:8166 · easeLook:8171 · squadTarget:8176
pickSquadDest:8188 · tickSquadMove:8202 · tickSquad:8228 · CALL_DIST:8282 · CALL_NEAR:8283 · CALL_GAP_ALL:8284
CALL_GAP_ONE:8285 · CALL_GAP_DIR:8286 · CALL_MS:8287 · CALL_LINES:8288 · CALL_SECTORS:8299 · bearingKey:8302
clearSquadBubble:8310 · callSprite:8316 · squadShout:8328 · tickSquadCalls:8341 · CHAT_GAP_ALL:8368 · CHAT_LINES:8369
tickSquadChatter:8375 · heliFireAt:8392 · nearestFighterTo:8404 · tickHelis:8410 · DAY:8459 · NIGHT:8461
collectMsMats:8465 · CYCLE_MS:8476 · MODE_ICON:8478 · STORM_MS:8485 · buildStars:8492 · buildStreetLamps:8515
glowTex:8533 · tickStreetLamps:8541 · beamPair:8558 · tickSearchBeams:8569 · buildBarrelFires:8606 · tickBarrels:8624
tickShootingStar:8634 · buildMist:8659 · tickMist:8669 · tickNightSound:8712 · tickSneak:8721 · tickStorm:8732
nvReady:8748 · nvEnter:8749 · nvExit:8755 · tickNvHint:8756 · dropGlowStick:8765 · tickGlowSticks:8782
buildFlashlight:8791 · setNight:8796 · setDayMode:8797 · tickNight:8811 · applyNightLook:8843 · tickFlashlight:8883
MSB_FIRST:8913 · MSB_GAP:8914 · MSB_WARN:8915 · MSB_KILL_WARN:8916 · MSB_NEAR:8917 · MSB_FLEE:8918
MSB_R:8919 · MSB_HOLD:8920 · MSB_MAX:8921 · MSB_DEAD_MS:8922 · MSB_BEEP:8923 · MSB_COVER_R:8926
MSB_PAD_R:8927 · MSB_COVER_RECHECK:8928 · msbEnsure:8933 · msbPlace:8950 · msbBarPos:8959 · msbHide:8966
resetMsBeam:8970 · msbCoverAt:8985 · msbAimBeside:9006 · msbBegin:9012 · msbAim:9029 · msbStrike:9060
msbKill:9099 · msbKickOut:9112 · tickMsBeam:9122 · TURBO_EVERY:9175 · TURBO_MS:9176 · TURBO_MUL:9177
TURBO_N:9178 · TURBO_TRACK:9179 · resetTurbo:9181 · turboPick:9186 · turboBegin:9193 · tickTurbo:9205
fit:9216 · tick:9222 · frame:9230 · build:9290 · start:9358 · exitWorld:9485

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

## js/music.js (204 บรรทัด · 0 รายการ)

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

## js/photo.js (361 บรรทัด · 25 รายการ)
PHOTO_LS_KEY:12 · PHOTO_MAX:13 · PHOTO_PREFIX:14 · PHOTO_SIZES:15 · PHOTO_QS:16 · PHOTO_ZMAX:17
photoValid:25 · photoOnline:28 · photoGet:31 · photoHas:32 · photoIsMine:33 · photoOf:36
photoFetch:44 · photoAfterChange:61 · photoPush:65 · photoVerify:83 · photoSaveUrl:93 · photoRemove:99
photoPullMine:106 · photoBlkSrc:122 · photoMiniHTML:129 · openPhotoMenu:137 · photoLoadImgEl:203 · photoLoadFile:211
openPhotoCrop:224

## js/picdict.js (1,100 บรรทัด · 0 รายการ)

## js/picmatch.js (460 บรรทัด · 0 รายการ)

## js/picquiz_online.js (603 บรรทัด · 0 รายการ)

## js/pmaward.js (28 บรรทัด · 0 รายการ)

## js/sgaward.js (28 บรรทัด · 0 รายการ)

## js/shootword.js (1,085 บรรทัด · 0 รายการ)

## js/state.js (1,183 บรรทัด · 94 รายการ)
STORAGE_KEY:6 · QUIZ_PASS_REWARD:11 · CURE_COST:13 · HUNGRY_SICK_MS:14 · MEAL_HOUR:16 · MEAL_FULL:17
SLEEP_FROM_HOUR:18 · SLEEP_SICK_HOUR:19 · WAKE_HOUR:20 · DINNER_COST:21 · TOXIN_FULL:23 · DETOX_COST:24
FOODQUIZ_Q:26 · FOODQUIZ_COIN:27 · FOODQUIZ_BONUS:28 · FOODQUIZ_MAX_PLAYS:29 · SHAPE_JUNK_MEALS:31 · SHAPE_CLEAN_MEALS:32
SHAPE_MISS_MEALS:33 · SHAPE_EXP_BONUS:34 · HEAT_SICK_MS:35 · THIRST_SICK_MS:36 · DEFAULT_STATE:38 · FEED_CATS:202
FEED_REACTIONS:216 · feedRx:224 · FEED_QUICK_CM:226 · SLOT_MS:238 · currentSlotStart:239 · nextSlotStart:245
mealDayKey:247 · nightKeyOf:249 · isNightNow:257 · newPet:262 · loadState:286 · saveState:577
activePet:584 · petStage:585 · isAdult:590 · abilityOn:591 · hasPetType:592 · todayStr:595
dailyTick:599 · addCoins:602 · QUEST_POOL:622 · QUEST_PER_DAY:631 · questsToday:632 · questTick:639
questEvent:643 · assetValue:679 · netWorth:699 · assetCount:701 · refreshRank:718 · heatProtected:734
rainProtected:738 · petHungry:741 · petCanEat:745 · hungerSickLock:754 · hungerSickMsg:765 · petShapeOf:773
updatePetShape:779 · shapeMealDone:786 · heatPct:796 · ymStr:805 · billOutstanding:809 · UTILITIES:816
HOME_UTILITIES:822 · homeDecayed:824 · billTick:827 · PET_FOOD_PER_PET:899 · petFoodTick:900 · myCar:926
carLoanDue:931 · carLoanOverdue:936 · carLoanPayable:941 · carLoanPay:948 · compTick:961 · ONLINE_RATE:975
onlineEarnActive:976 · onlineEarnTick:980 · onlineEarnFlush:991 · marketTick:1001 · addCraft:1025 · ORDER_MAX:1044
ORDER_LIFE_MS:1045 · ORDER_GAP_MIN_MS:1046 · ORDER_GAP_SPAN_MS:1047 · ORDER_TIER_WEIGHT:1048 · newOrder:1049 · orderTick:1062
careTick:1070 · expNeed:1154 · addExp:1159 · addRP:1179

## js/thaitime.js (52 บรรทัด · 13 รายการ)
TH_TZ_MIN:22 · TH_DAY_MS:23 · thShift:28 · thMs:30 · thDate:31 · thHour:32
thHourF:33 · thDayKey:34 · thDayStart:35 · thAtHour:39 · thTs:40 · TH_TZ_OPT:45
thLocaleOpt:46

## js/tpaward.js (41 บรรทัด · 0 รายการ)

## js/typing.js (369 บรรทัด · 0 รายการ)

## js/ui.js (9,049 บรรทัด · 368 รายการ)
### 🗂️ สารบัญโซน js/ui.js (Read/Edit เฉพาะช่วง)
- 2-77 UI: Dashboard / ร้านค้า / ที่พัก / ร้านสัตว์เลี้ยง / แรงค์ / สถิติ
- 78-344 🎬 เวทีน้องน่ารัก (Cute Pet Show) — รอบ 604 (ผู้ใช้สั่ง 26 ก.ค. 2026)
- 345-638 🆕 New Word (รอบ 116): คำศัพท์ใหม่ 1 คำ/การ login ตามระดับชั้น
- 639-663 นาฬิกาใต้ชื่อผู้เล่น (วัน · วันที่ · เวลา อัปเดตทุกวินาที)
- 664-716 ข้าวเย็นของผู้เล่น (คิว 7725691507 ข้อ 6)
- 717-748 แถบฝนประจำวัน: นับถอยหลังถึง 19:00 ทุกวัน (ฝนตก 1 ชม.)
- 749-801 เอฟเฟกต์ฝนเต็มจอ (รอบยี่สิบ): ฝนตกจริง (19:00-20:00) + ไม่มีบ้านสภาพดี
- 802-822 การ์ด "คนที่กำลังทำการบ้านไปพร้อมๆ กับเรา"
- 823-877 รอบ 149: กล่อง aside ขวาเลื่อนวนอัตโนมัติ (ล่าง→บน) ไม่มี scrollbar
- 878-1269 Daily Quest (item 3): การ์ดภารกิจวันนี้ใน aside ขวา
- 1270-1362 รอบ 153: เมนูลัดแตะแถวเพื่อนออนไลน์ในกล่อง aside
- 1363-1963 การ์ด Leaderboard — สลับแท็บในการ์ดเดียว (ประหยัดพื้นที่):
- 1964-2328 การ์ดข้อมูลผู้เล่น 👤 — คลิกชื่อในการ์ดเพื่อน/กระดาน แล้วโชว์
- 2329-2579 แผงเพื่อน 👥 (ข้อ 0.3): รหัสเพื่อน + ค้นหา + คำขอ + รายชื่อเพื่อน
- 2580-2675 🌍 เพื่อนอยู่โลก 3D ไหน + ปุ่ม "ตามเข้าไป" (รอบ 642)
- 2676-2714 แชทกับเพื่อน (ข้อ 0.4) — กล่องแชทลอยกลางจอ + แผง emoji
- 2715-3116 รอบ 179: หน้ารวมข้อความ (inbox แบบ Messenger — ธีมกระจกฟ้า sci-fi ของเกม)
- 3117-3477 ระบบส่งของขวัญ (ข้อ 0.5) — ห้องของขวัญ + กล่องเลือกส่ง + ฉากเปิด
- 3478-3570 RANK CARD + ฉากเลื่อนแรงค์
- 3571-3573 PET DASHBOARD
- 3574-3643 📰 รอบ 155: overlay ข้อมูลน้อง & การดูแล + ฟีดกิจกรรมเพื่อน
- 3644-4265 📰 รอบ 701 — ฟีดล็อบบี้ "ทีละโพสต์" แบบ Facebook (ผู้ใช้สั่ง 29 ก.ค. 2026)
- 4266-4476 🌍 รอบ 639: หน้า Feed เต็มจอ — ทุกคน (ไม่ใช่แค่ follow) + ไลก์/คอมเมนต์
- 4477-5146 📖 Dictionary ค้นหาคำศัพท์ (รอบ 254 ผู้ใช้สั่ง 16 ก.ค. 2026)
- 5147-5190 การนอน (คิว 7725691507 ข้อ 1)
- 5191-5587 ให้อาหาร (ระบบมื้อเย็น 18:00 + ความอิ่มสะสม — ข้อ 2+3)
- 5588-5706 🛡️ ควิซอาหารปลอดภัย (ต่อยอดข้อ 5.1)
- 5707-5792 🎀 ห้องแต่งตัวสัตว์เลี้ยง (รอบ 635: แยกออกจาก "ร้านค้า" เดิม —
- 5793-5980 ที่พัก (หลบแดด/หลบฝน) + เครื่องปรับอากาศ
- 5981-6098 บิลสาธารณูปโภค (ค่าไฟ/ค่าน้ำ — เครื่องยนต์อยู่ใน state.js: UTILITIES/billTick)
- 6099-6181 การ์ดมือถือ (ข้อ 7): ซื้อ 10,000 ขายคืน 6,000
- 6182-6192 การ์ดคอมพิวเตอร์ (ข้อ 11): ซื้อ 50,000 ขายคืน 30,000
- 6193-6237 item 8: โบนัสออนไลน์ +0.01 เหรียญ/วิ ฟรีทุกคนที่เปิดเกมออนไลน์อยู่
- 6238-6831 💻 รอบ 706 (ผู้ใช้สั่ง 29 ก.ค. 2026): ช่องรายได้คอมพิวเตอร์บนแถบบนล็อบบี้
- 6832-6971 🌍 ปุ่มลัดเข้าโลก 3D ในรางเมนูซ้าย (ผู้ใช้สั่ง 9 ก.ค. 2026)
- 6972-7125 🧭 ป้ายบอกทางของรางเมนูซ้าย (รอบ 601 · ผู้ใช้สั่ง 26 ก.ค. 2026)
- 7126-7295 การ์ดสวนผลไม้ (ข้อ 12): ซื้อต้นไม้ปลูกได้ไม่จำกัด แต่ละต้นออกผล
- 7296-7305 โรงงานผลิตสินค้า 🏭 + ตลาดขายต่อ (แนวคิดใหม่ 5 ก.ค. 2026)
- 7306-7328 โรงงานผลิต (แผง 🏭) — แยกออกจากตลาด (ผู้ใช้สั่ง 6 ก.ค. 2026)
- 7329-7481 ตลาดขายสินค้า (แผง 🏪) — แยกออกจากโรงงาน
- 7482-8406 🚗 รอบ 131: หมวดยานพาหนะ — โชว์รูมรถ 10 คัน (แคตตาล็อก 5 ช่อง/แถว)
- 8407-8467 ร้านสัตว์เลี้ยง (ซื้อเพิ่มได้ ไม่ลบตัวเดิม)
- 8468-8504 เลเวลอัพ (รายตัว)
- 8505-8610 สถิติผลการเรียนรู้
- 8611-8648 item 4: การ์ดสรุปส่งครู — ใบเดียวจบ ชื่อ/วัน-เวลา/เหรียญวันนี้/แรงค์/สอบล่าสุด
- 8649-9049 📞 หน้าจอโทรหาเพื่อน — สายเสียง (รอบ 625 · กลุ่ม 3 คน + ปิดวิดีโอ รอบ 631)
### รายการ js/ui.js
startHTML:10 · PET_ANIM:30 · petAnimHTML:35 · petVisualHTML:50 · PET_SHOW:91 · PET_SHOW_STAGE:96
PET_SHOW_H:99 · petShowBgHTML:102 · petClipHint:145 · __clipReady:157 · PET_SHOW_SEQ:165 · petShowSeqHTML:180
petShowHTML:199 · PROF_AV_MAX:265 · lobbyBlk:266 · caretakerFigureHTML:273 · footAlign:283 · heroRankBgHTML:317
NEW_WORD_MS:351 · newWordNext:357 · renderNewWord:368 · NW_GAP:406 · alignNewWord:407 · startNewWordTimer:424
nwCountdownTick:441 · PAT_REMIND_HOUR:457 · patRemindTick:458 · applyPatRemindGlow:479 · NEW_WORD_COIN:494 · NW_DAILY_GOAL:495
NW_DAILY_BONUS:496 · newWordReward:497 · nwDailyTick:520 · coinFlyFx:539 · nwDailyBarHTML:572 · showNewWordPopup:583
renamePet:610 · mealLabel:627 · fmtMins:633 · renderClock:642 · dinnerDue:669 · renderDinnerChip:674
dinnerClick:685 · renderRainBar:720 · rainFxTick:753 · RAIN_DROP_IMGS:776 · rainFxDrop:777 · selfPronoun:809
selfTag:814 · idTag:818 · SIDE_SCROLL_SPEED:828 · SIDE_SCROLL_RESUME:829 · initSideScroll:832 · sideScrollTick:860
QUEST_FLASH_HOLD:884 · QUEST_SLIDE_MS:891 · QUEST_RESUME_MS:892 · questGo:895 · SIDE_TALL_MIN:907 · sideIsTall:908
qBigCardHTML:913 · qDeckGo:933 · qDeckTick:953 · renderQuestCard:974 · sideFlashRows:1034 · FRIEND_FLASH_GRACE:1052
ONLINE_FLIP_MS:1060 · ONLINE_FLIP_RESUME:1061 · ONLINE_SWIPE_STEP:1062 · ONLINE_ROW_H:1069 · onPerPage:1072 · onChunk:1078
ONLINE_GAP_MAX:1088 · onPageSpread:1089 · onPageDraw:1098 · onPageFlip:1109 · bindOnlinePager:1120 · renderOnlineCard:1155
bindInviteCards:1277 · bindFriendQuickMenu:1297 · openFriendQuickMenu:1307 · LB_TABS:1370 · LB_WS_TOP:1371 · LB_PM_TOP:1372
LB_TP_TOP:1373 · LB_SG_TOP:1374 · bindLbTabs:1376 · updateRankRailBadge:1417 · rankUpCheck:1436 · rankUpSound:1464
renderLeaderboardCard:1475 · bindLbGroupOpen:1504 · lbRankRows:1516 · LB_BCAT_TOP:1571 · lbBadgeSections:1576 · lbDemoRows:1601
lbChar:1623 · lbfAwardBarHtml:1633 · openLeaderboardFull:1647 · BLK_PAD:1780 · BLK_PAD_NEW:1785 · BLK_TOP_FIX:1786
seatPodChars:1787 · lbCoinHtml:1799 · lbBadgeHtml:1815 · lbBossHtml:1841 · lbWordSearchHtml:1864 · lbTypingHtml:1900
lbShootHtml:1934 · bindPlayerClicks:1969 · showPlayerCard:1979 · petDescImg:2258 · openImgLightbox:2271 · openPetPeek:2291
updateBillBadges:2335 · setBadge:2345 · tinvPendingCount:2361 · updateSettingsBadge:2370 · openAttentionSummary:2385 · updateFriendBadge:2443
renderFriendPanel:2453 · friendDoSearch:2501 · refreshFriendData:2525 · FRW_TTL_MS:2590 · FRW_MIN_GAP:2591 · frwWorldOf:2595
frwPanelOpen:2598 · frwScan:2603 · frwPaint:2625 · frwPaintHint:2646 · frwFollow:2660 · CHAT_EMOJI_CATS:2681
CHAT_THEMES:2703 · CHAT_SECRET_MS:2712 · chatBadgeSync:2720 · ibTimeStr:2728 · IB_CALL_RE:2737 · ibCallInfo:2738
openChatInbox:2743 · chatFitKeyboard:2913 · openChat:2929 · giftImg:3120 · giftDateStr:3122 · GREETS:3130
GREET_EXP:3138 · greetInfo:3139 · openGreetPicker:3143 · giftItemPic:3187 · foodGiftBlocked:3197 · giftItemName:3203
updateGiftBadge:3209 · renderGiftPanel:3218 · acceptGift:3276 · declineGift:3299 · showGreetReveal:3308 · showGiftReveal:3335
openGiftPicker:3361 · confirmSendGift:3429 · doSendGift:3455 · rankBadgeHTML:3481 · renderRankCard:3486 · renderRankTab:3520
showRankUp:3548 · bindPetPlateButtons:3583 · openPetInfoOverlay:3613 · feedAgo:3636 · FEED_DECK_MAX:3656 · FEED_SLIDE_MS:3657
FEED_RESUME_MS:3658 · feedPostImgIndex:3663 · feedPostImg:3674 · feedPostByKey:3683 · feedCanReact:3686 · fpStatsHTML:3691
fpNameBadgesHTML:3707 · fpostHTML:3711 · renderFeedCard:3746 · feedDeckGo:3784 · feedDeckTick:3804 · renderFeedBell:3826
FNT_JUMP:3835 · fntGiftName:3841 · feedNotifText:3845 · feedNotifGo:3860 · feedNotifArrived:3875 · openFeedNotif:3882
closeRxPicker:3937 · openRxPicker:3941 · feedFlyWord:3961 · feedPickRx:3972 · FCM_REP_SHOW:3987 · FCM_FOCUS_POST:3988
openFeedComments:3990 · closeFeedComments:4012 · fcmRowHTML:4021 · showCommentLikers:4044 · fcmTreeHTML:4066 · renderFeedComments:4091
bindFeedPostEvents:4219 · openFeedBoard:4272 · renderFeedBoardLive:4293 · renderFeedBoard:4311 · stageColLeft:4330 · alignPetTabs:4339
alignFeedPlate:4351 · alignProfilePlate:4367 · COIN_K_MIN:4385 · alignCoinBlock:4386 · alignStageLeft:4414 · laneModeOn:4426
alignStageCols:4439 · watchStageCols:4454 · alignCureBtn:4464 · dictRecordLookup:4488 · DICT_FILE_COUNT:4499 · loadDict:4500
dictSearch:4515 · dictTapWords:4530 · dictEntryHTML:4534 · openDictOverlay:4545 · renderDashboard:4629 · sleepBtnHTML:5152
sleepHintHTML:5159 · sleepAllPets:5170 · wakeAllPets:5183 · feedPet:5194 · openFoodMenu:5213 · feedWith:5296
AVATAR_UI:5326 · playerAvatarHTML:5330 · SHAPE_UI:5338 · showFeedResult:5347 · curePet:5388 · heartsFx:5411
PAT_HOLD_MS:5434 · PAT_EXP:5435 · bindPetTap:5436 · petBounce:5454 · petMood:5460 · shortPatPet:5467
longPatPet:5475 · patCalendarHTML:5495 · patStreakTick:5522 · cureCelebrateFx:5547 · railCureClick:5558 · detoxPet:5570
openFoodQuiz:5593 · closeDressUpBoard:5712 · openDressUpBoard:5716 · renderShop:5733 · homeVisualHTML:5796 · showHomeRuined:5810
showCutNotice:5831 · renderHomeCard:5849 · payMaint:5933 · trashBillUI:5949 · payTrash:5966 · UTILITY_UI:5985
utilityBillUI:6034 · payUtility:6059 · buyUtilityFix:6085 · renderPhoneCard:6103 · buyPhone:6143 · sellPhone:6165
compLiveTotal:6186 · onlineLiveTotal:6197 · syncCoinHeader:6204 · flashPillGain:6209 · renderOnlineEarnPill:6218 · renderCompEarnPill:6243
openPillInfo:6276 · renderComputerCard:6359 · buyComputer:6394 · sellComputer:6417 · soldCount:6438 · soldBadge:6439
loadScriptOnce:6445 · advBusyMsg:6470 · advResetLoad:6482 · loadAdv3d:6488 · enterAdventure3D:6496 · pickAdvMap:6521
enterHaunted3D:6556 · enterHeli3D:6578 · pickHeliMap:6604 · enterDrone3D:6640 · enterDrive3D:6659 · pickDriveMap:6697
enterMotoMapAsCar:6733 · enterSoccer3D:6752 · enterMoto3D:6771 · enterF1_3D:6793 · enterInvasion3D:6813 · WORLD3D:6839
gotoRobotShop:6851 · openHealDialog:6857 · world3DFail:6878 · railWorldClick:6909 · openWorldEntryDialog:6924 · railScrollHint:6977
railScrollTop:6985 · initRailScroll:6990 · renderRailWorlds:7010 · tinvNoticeHTML:7079 · openTinvPicker:7087 · fruitCountdown:7131
renderFarmCard:7143 · renderFarmClock:7218 · buyFruit:7234 · sellFruit:7254 · sellAllFruit:7275 · collectImg:7304
renderFactoryCard:7310 · renderMarketCard:7333 · updateWishBadge:7389 · openWishlistDialog:7400 · bindStripArrows:7445 · renderMarketBrowse:7459
carImg:7488 · renderVehicleShop:7489 · CS_CYCLE_MS:7540 · carInteriorImg:7541 · carStatHtml:7543 · renderCarShowroom:7550
csShowBig:7577 · csInit:7604 · RS_CYCLE_MS:7627 · robotImg:7628 · renderRobotShop:7629 · rsShowBig:7651
rsInit:7672 · buyRobot:7691 · enterMecha3D:7716 · pickMechaRobot:7743 · pickDriveCar:7775 · openCarBuyDialog:7818
buyCarInsurance:7879 · payCarLoanMonthly:7898 · payCarLoanFull:7910 · carDriveBlock:7929 · gotoVehicleShop:7934 · gotoMyStock:7939
showNeedCarDialog:7945 · craftDiscount:7957 · renderFactory:7960 · renderOrdersUI:8029 · startProduce:8048 · buyCollectible:8076
cancelProduce:8106 · deliverOrder:8120 · renderOrderClock:8137 · renderCollectMine:8147 · openListDialog:8189 · cancelListing:8242
buyMarketItem:8265 · showCollectReveal:8294 · buyAC:8332 · openHomeShop:8351 · renderPetShop:8410 · showLevelUp:8471
renderStats:8508 · showTeacherCard:8615 · CALL_REACT_EMOS:8659 · CALL_TALK_MIN:8662 · CALL_TALK_HOLD:8663 · CALL_ORDER_GAP:8665
CALL_TONES:8671 · startCall:9045

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

## css/lobby.css (5,464 บรรทัด · 784 selector)
:root:6,5252 · html:15 · body:16,5216,5258 · *:36,37,38,39 · #app:42 · h1:44
.subtitle:45 · .shop-title:46 · #rotate-overlay:49 · .screen:71 · #screen-select:80,81,82,83(+5) · .egg-need:90
.petshop-topright:92 · .petshop-play-link:93,98 · #screen-login:112,137,138,143(+7) · .login-lux:122 · .login-crest:123 · .login-word:127
.login-rule:133,134,135 · .login-tag:136 · #screen-game:185,186,187,188(+7) · #screen-quiz:199,200,201,202(+6) · #quiz-choices:211,212 · .word-card:219
.quiz-choice:220,221,222 · .big-btn:225,226,227,228 · #screen-dashboard:233,1133,1141 · .lobby-top:240,875,876,877(+36) · .top-flex:241 · .profile-plate:242,246,796,3735(+12)
#rain-fx:251 · .rain-glass:255 · .glass-drop:256 · .rain-vignette:275 · .no-anim:282,444,457,518(+58) · .rail-btn:285,891,897,899(+19)
.rail-badge:286 · .fr-code-box:291 · .fr-code-label:295 · .fr-code-row:296 · .fr-code:297 · .fr-copy-btn:302,306,311,312
.fr-search-btn:307 · .fr-add-btn:308 · .fr-accept:309 · .fr-decline:310 · #fr-search-input:313 · #fr-search-result:317
.fr-found:318 · .fr-hint:322 · .fr-list-title:323 · .fr-row:324 · .fr-req:328 · .fr-row-name:330,334,4956
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
.pl-click:744,746,747 · .pl-overlay:748 · .pl-card:752,2803 · .pl-close:758 · .pl-head:762,2571,2574 · .pl-grade:767,4962,4963
.pl-body:768 · .pl-loading:769 · .pl-none:770 · .pl-me-tag:771 · .pl-blk-wrap:773 · .pl-blk:774
.pl-stat:775 · .pl-lbl:780 · .pl-val:781,782 · .pl-tip:783 · .chip-edit:789,794,795 · .rank-mini:801,807,808,809
.pass-photo:811,816 · .pet-tabs:818 · .dict-box:819,823,824,825(+1) · .dict-card:831,836,840,841(+2) · .dict-head:837,838 · .dict-trail:845,849
.dt-c:850,854,855 · .dt-sep:856 · .dict-today:857 · .di-w:859,860,861 · .dict-list:862 · .dict-item:863,867,868,869(+5)
.lobby-mid:883 · .rail-wrap:886,930,941,942 · .rail-scroll:889,924,928,929 · .lobby-rail:890 · .rail-pinned:904,905 · .rail-nudge:931,939,940,943(+1)
.rail-worlds:950 · .rail-div:951 · .lobby-stage:993,995,1011,1138(+13) · .newword-banner:1001,1008,1013,4322(+2) · .coin-fly:1024,1027 · .coin-plus:1033
.nw-pop-coin:1048,1050,1051 · .nw-pop-goal:1054,1055,1059,1063 · .nw-goal-head:1056,1058,1060 · .nw-goal-bar:1061 · .nw-goal-fill:1062 · .nw-pop-book:1064,1065
.nw-tag:1086,4328,4350 · .nw-word:1091,4332,4355,4448 · .nw-hint:1093,1094,4333,4357(+1) · .nw-coin:1096,1099,4334,4338 · .nw-countdown:1104,4339 · .nw-bar:1106,4358
.nw-bar-fill:1108 · .pet-stage:1111,3097 · .nw-box:1118,3106 · .nw-pop-word:1119 · .nw-speak:1120 · .nw-pop-phon:1121
.nw-ipa:1122 · .nw-pop-sent:1123 · .nw-pop-mean:1124 · .pet-tab:1125,1126,1127,3541 · .stage-hero:1148,1163,1171,1316(+22) · .hero-ground:1185,1305,1311
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
.panel-overlay:1672,1677,4463,4464(+8) · .panel-box:1678 · .panel-head:1685,1689 · .panel-close:1690,1695 · .panel-body:1696,1700,1701 · .panel-page:1698,1699
.collect-sub:1705 · .mkt-empty:1706 · .craft-box:1707 · .mkt-listing:1708 · .mkt-filter:1709,2053 · .hq-grid:1716
.hq-card:1717,1722,1746 · .hq-head:1723 · .hq-pic:1729,1731 · .hq-emoji:1733 · .hq-badge:1734 · .hq-stars:1738
.hq-price:1739,1744,1745,1748(+6) · .craft-credit:1752,1754,1755 · .car-grid:1762,1764,1765 · .robot-weap:1766 · .dmap-box:1769,1770 · .dmap-grid:1776
.dmap-card:1778,1781,1782,1783(+2) · .dmap-ico:1785 · .dmap-new:1788 · .dcp-grid:1790 · .dcp-card:1792,1795,1796,1797(+10) · .levelup-box:1814,3060,3061,3248
.dcp-box:1817,1818,1822,1823(+6) · .dcp-lock:1831 · .sold-badge:1835,1837,1838 · .rs-showroom:1840,4914,4915 · .rs-list:1841,1843,4895,4898 · .rs-thumb:1844,1846,1847,1848(+1)
.rs-thumb-pic:1849,1850 · .rs-thumb-price:1851 · .rs-stage:1853 · .rs-big:1856 · .rs-big-img:1857 · .rs-elec:1861,1865,1870
.rs-edge:1871,1877 · .rs-info:1880,1881,1882,1883(+1) · .rs-buy:1885,1887,1888 · .cs-showroom:1892,4887,4888,4916(+3) · .cs-list:1893,1895,4889,4894(+9) · .cs-thumb:1896,1898,1899,1900(+1)
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
.gift-cf-pic:2151 · .chat-emoji-cats:2156 · .chat-emoji-cat:2160,2164,2165 · .chat-emoji-wrap:2166,2167 · .stage-left:2176,4454 · .pet-info-btn:2180,2187,2188
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
.pod-base:2775 · .pod-rank:2777 · .pod-label:2779,4958 · .pod-name:2781 · .pod-sc:2783 · .pod-1:2788,2789
.pod-2:2790,2791 · .pod-3:2792,2793 · .pod-4:2794,2795 · .pod-5:2796,2797 · .pl-wide:2816,2819,2820,2821(+8) · .pl-follow:2822,2827,2829
.pl-unfollow:2831,2837,2838 · .pl-followers:2839 · .pl-cols:2840,2845,2846,2847 · .pl-col:2841 · .pl-sec-title:2842 · .pl-badges-col:2848
.pl-feed:2849,2852,2859 · .pl-feed-row:2853,2857,2858 · .pl-assets-wrap:2861,4795,4870 · .pl-assets:2862,4798,4803,4809(+4) · .pl-asset:2865,2869,2876 · .pl-asset-emoji:2870
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
.sec-online:3715 · .rank-tab:3743,3744,3745,3746(+2) · .pet-show-bg:3776,3779,3783,3787(+19) · .ps-night-fx:3879,3881,3893,3898(+1) · .pet-show:3908,3911,3923,3925(+30) · .ps-video:4061
.ps-worn-pip:4139,4140 · .id-card:4163,4170,4174 · .id-chip:4187 · .clock-chip:4196,4197 · .coin-block:4213 · .coin-group:4214
.coin-pill:4244,4245,4266 · .cp-lb:4269 · .cp-v:4270 · .topbar-icons:4306 · .topbar-icons-row:4307 · .topbar-theme-row:4308
.theme-swatch:4309,4314,4315 · #theme-navy:4317 · #theme-emerald:4318 · #theme-plum:4319 · .nw-sub:4356 · .top-flex2:4451
#panel-factory:4470,4471,4475,4476(+39) · #panel-rank:4611,4612,4618,4623(+11) · .grid2x8:4694,4700 · .grid1x5:4710,4716 · .pl-badges-strip:4722 · .pl-badge-card:4726,4732,4750,4751(+1)
.pl-badge-card-ic:4738,4747,4749 · .pl-badge-card-nm:4753 · .pl-badges-empty:4759,4761 · .mine-strip:4775,4777,4778,4783(+4) · .mb-strip:4789,4828 · .gmark:4936,4940,4941,4942(+1)
.gm-stack:4945,4949 · .gm-row:4951 · .lb-name:4953,4954,4955 · .grade-edit:4976,4981,4982 · .gradelock-box:4986,5002,5007,5009 · .gl-head:4987
.gl-emoji:4988 · .gl-ht:4989 · .gl-cur:4990 · .gl-lock:4991,4996 · .gl-ok:4995 · .gl-lock-sub:4997
.gl-why:4998 · .gl-pick-lb:4999 · .gl-opts:5000 · .gl-hist:5010 · .gl-hline:5011 · .gl-hg:5015
.gl-hat:5016 · .gl-harr:5017 · .gl-foot:5018 · .gl-cf:5019 · .reg-gradelock:5041 · #tp-overlay:5051
#tp-board:5053,5057 · .tp-head:5061 · .tp-title:5062 · .tp-stat:5064,5066 · .tp-pts:5068,5071 · .tp-close:5073,5079,5080
.tp-snd:5083,5086,5092,5093 · .tp-snd-ic:5087 · .tp-snd-track:5088 · .tp-snd-thumb:5090 · .tp-prompt:5097 · .tp-word:5099,5113,5114
.tp-ch:5101,5106,5107,5109 · .tp-thai:5117 · .tp-hint:5119 · .tp-empty:5121 · .tp-keys:5124 · .tp-row:5126
.tp-row-fn:5128,5161 · .tp-key:5132,5144,5146,5152(+2) · .tp-key-fn:5159 · .tp-fx:5165 · .tp-coinpop:5166 · .tp-pop-pt:5171
#city-backdrop:5185,5191 · .city-arrive:5192,5193 · .night:5207,5227,5228,5230(+2) · #night-veil:5253 · .theme-emerald:5282,5294,5301,5304(+7) · .theme-plum:5287,5298,5302,5305(+3)
#theme-veil:5315 · #screen-picmatch:5368,5369,5393,5394(+11) · .pm-grid:5370 · .pm-card:5372,5376,5377,5380(+7) · .pm-right:5398 · .pm-now:5399,5405
#pm-now-en:5406 · .pm-now-th:5407 · .pm-mode-btn:5438,5441 · .pm-wordcard:5442,5443,5445

## css/picdict.css (314 บรรทัด · 1 selector)
#screen-picdict:9,16,17,22(+104)

## css/picquiz_online.css (119 บรรทัด · 37 selector)
#pqr-root:5,6,7,8(+3) · .pqr-shade:13 · .pqr-card:15 · .pqr-mode-card:17,18,19 · .pqr-x:20 · .pqr-mode-grid:21
.pqr-mode-btn:22,24,25,26 · .pqr-full:28,30,32,33 · .pqr-net:34 · .pqr-hub-body:35,36,37,39(+3) · .pqr-bigicon:38 · .pqr-code-input:42
.pqr-primary:43,44 · .pqr-room-head:47 · .pqr-code-chip:48 · .pqr-head-actions:49,50 · .pqr-call:51 · .pqr-room-grid:52,53,54
.pqr-members:55 · .pqr-member:56,57,58 · .pqr-wait:59 · .pqr-room-hero:60 · .pqr-start:61 · .pqr-voice-note:62
.pqr-chat:63 · .pqr-msg:64,65,66 · .pqr-chat-form:67,68 · .pqr-hud:70 · .pqr-hud-main:72,73,74,75 · .pqr-hud-actions:76,77,78
.pqr-drawer:80 · .pqr-drawer-card:81 · #pqr-drawer-body:82 · .pqr-chat-draw:83 · .pqr-score-row:84,85 · .pqr-incoming:87,88,89,90
#screen-picdict:97,98,99,100(+2)

## css/style.css (2,235 บรรทัด · 554 selector)
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
.pet-wrap:639 · .pet-emoji:640 · .pet-img:641 · .egg-img:642 · .feed-pet:643,814 · .pet-baby:644
.pet-adult:645 · .pet-egg-stage:647 · .wear:649 · .wear-head:650 · .wear-face:651 · .wear-neck:652
.pet-name:654 · .stage-label:655 · .level-row:656 · .level-badge:657 · .exp-bar:661 · .exp-fill:662
.exp-text:663 · .ability-box:665,669 · .hunger-bar:672 · .hunger-fill:673,674,675 · .food-item:681,737,741,742(+8) · .hunger-text:685
.heat-bar:688 · .heat-fill:689 · .heat-text:690,691,692 · .care-row:694 · .care-btn:695,699,705 · .btn-feed:700
.btn-cure:701 · .btn-foodquiz:703 · .care-row-quiz:704 · .sick-banner:706 · .pet-sick:710 · .food-lock-note:713
.pet-asleep:723 · .sleep-badge:724 · .btn-sleep:726 · .dinner-btn:729 · .food-box:733,734 · .food-hunger-bar:735
.food-grid:736 · .fd-lock:750 · .fav-tag:767 · .fd-exp:771 · .food-sec:773 · .food-sec-human:777
.bad-tag:779 · .fd-toxin:783 · .fd-safe:784 · .fq-box:787,788 · .fq-progress:789 · .fq-pair:790,791
.fq-ask:792 · .fq-why:793 · .fq-btns:797,798,802 · .fq-yes:803 · .fq-no:804 · .fq-next:805
.food-cancel:806 · .feed-box:812,813 · .feed-gain:815 · .sick-badge:819 · .big-btn:825,831,1084,1085(+6) · .shop-card:834
.shop-title:838 · .shop-grid:839 · .shop-item:840,844,845,846(+4) · .it-tag:851 · .tag-wear:852 · .lock-banner:854
.home-current:860,865,866 · .home-img:867 · .home-emoji:868 · .home-btn:869,891 · .home-layout:871 · .home-pic-col:872,878
.home-img-big:876 · .home-info-col:879,881,884,885 · .home-name-row:882 · .home-desc-row:883 · .home-shop-box:893,894 · .home-list:895
.home-option:896,900,901,902(+1) · .home-opt-img:905 · .home-opt-body:907,908 · .home-price:909 · .reset-link:929 · .login-card:935
.login-pets:936 · .login-status:937 · .google-btn:938,944,945 · .login-note:946 · .install-btn:949,955,956 · .install-guide-overlay:959
.install-guide:963,967,970 · .install-steps:968,969 · .install-guide-close:971 · .login-account:976 · .register-card:979,983,1001,1005 · .reg-safety:985,987,988
.reg-privacy:990,992,993 · #screen-register:995,996,997,998(+2) · .student-chip:1006 · .clock-chip:1010 · .online-count:1016 · .online-row:1023,1027,1028,1047
.online-dot:1032 · .online-name:1037 · .online-act:1041 · .online-ava:1046 · .online-live:1048 · .online-note:1052
.lb-empty:1055 · .lb-list:1056 · .lb-row:1057,1061,1062 · .lb-rank:1066 · .lb-name:1068,1072 · .lb-coins:1076
.lb-hint:1078 · .lb-badgeline:1079 · .lb-tabs:1081 · .lb-tab:1082,1083 · .tinv-note:1094 · .cat-card:1100,1145,1148,1296(+1)
.cat-head:1104 · .cat-emoji:1105 · .cat-name:1106 · .cat-pass:1107 · .cat-info:1108 · .cat-btns:1109
.cat-btn:1110,1114,1115,1116(+3) · .cats-back-bottom:1119 · .tapglow:1124,1125,1133 · .lobby-bottom:1132 · .band-sec-head:1143,1144 · .bax-box:1152,1154
.bax-head:1155 · .bax-sub:1156,1157 · .bax-row:1158 · .bax-lv:1159,1162,1163,1164(+3) · .bax-emoji:1165 · .bax-name:1166
.bax-q:1167 · .bax-need:1169 · .bax-rw:1170 · .bax-foot:1174 · .bax-rank:1175,1178 · .bxr-box:1181,1183
.bxr-head:1184 · .bxr-sub:1185 · .bxr-body:1186 · .bxr-pick:1187 · .bxr-cats:1188 · .bxr-chip:1189,1191,1192,1193(+1)
.bxr-list:1196 · .bxr-row:1197,1199,1201,1205 · .bxr-rk:1200 · .bxr-nm:1202,1203 · .bxr-sc:1204 · .bxr-tm:1206
.bxr-more:1207 · .bxr-none:1208 · .bxr-foot:1210 · .band-mine-tag:1211 · .bsp-box:1214,1217 · .bsp-head:1218
.bsp-prog:1219 · .bsp-retake:1221,1224 · .bsp-info:1226,1228 · .rts-box:1231 · .rts-head:1233 · .rts-sets:1234
.rts-set:1235,1236,1237 · .rts-sub:1238 · .rts-words:1239 · .rts-word:1240,1242,1243 · .rts-foot:1244 · .rts-okbtn:1245,1247
.bsp-grid:1248 · .bsp-chip:1249,1252,1253,1254(+1) · .bsp-num:1256 · .bsp-best:1257 · .bsp-tick:1258 · .bsp-foot:1259
.vb-box:1262,1264 · .xsp-box:1267 · .vb-head:1268 · .vb-total:1269 · .vb-quizbtn:1270,1272 · .vb-tabs:1273
.vb-tab:1274,1276,1277 · .vb-words:1278 · .vb-word:1279,1282,1283,1284(+3) · .vb-empty:1288 · .vb-foot:1289 · .vb-pg:1290,1292
#vb-pginfo:1293 · .vb-hint:1294 · .band-lock:1302 · .offline-btn:1303,1304 · .quiz-progress:1309 · .quiz-phon:1310
#quiz-extra:1311,1313,1314,1315 · .quiz-word-card:1316 · .quiz-next:1322,1328,1329,1330(+1) · .quiz-choice:1333,1338,1339,1340 · .quiz-score-pill:1341 · .quiz-time-pill:1343,1345
.stats-card:1348 · .stats-title:1352,1908 · .stats-row:1353,1354,1355,1356 · .stat-badge-line:1358,1361 · .stat-badge-ic:1359 · .game-top:1364
.back-btn:1365 · .combo-pill:1369 · .timer-wrap:1373 · .timer-fill:1374,1375 · .board-label:1377 · .card-grid:1378
.word-card:1379,1385,1386,1387(+3) · .hint-btn:1393,1398 · .game-endless-note:1401,1406,1408,1412(+6) · .report-btn:1433,1438 · .report-box:1441 · .report-close:1442
.rp-head:1446 · .rp-avatar:1447,1448 · .rp-title:1449 · .rp-sub:1450 · .rp-levelcard:1452 · .rp-level-top:1456
.rp-bar:1457 · .rp-bar-fill:1458 · .rp-level-note:1459,1460 · .rp-grid:1462 · .rp-stat:1463 · .rp-ic:1466
.rp-num:1467 · .rp-lbl:1468 · .rp-section:1470 · .rp-h3:1471 · .rp-badge-mini:1472 · .rp-row:1473,1474,1475
.rp-empty:1476 · .rp-badges:1477 · .rp-badge:1478 · .rp-tline:1481 · .rp-tl-head:1482,1483 · .rp-tl-ems:1484
.rp-em:1485,1486 · .rp-tl-note:1487,1488 · .rp-crown:1490,1491 · .rp-wtitle:1493 · .rp-wnow:1494,1495 · .rp-wgraph:1496
.rp-wcol:1497 · .rp-wval:1498 · .rp-wbar:1499,1500 · .rp-wlbl:1501 · .rp-cheer:1503 · .report-ok:1507
.summary-box:1510,1633,1637,1638(+2) · .sm-burst:1511 · .sm-title:1513 · .sm-line:1514 · .sm-coin:1515 · .sm-matches:1521,1522
.confetti:1524 · .sm-badge:1531 · .sm-badge-all:1535 · .badge-celebrate-overlay:1538,1591,1599 · .badge-celebrate:1544 · .bc-emoji:1550,1588
.bc-emoji-img:1559 · .badge-clickable:1572,1573,1574 · .badge-info-box:1578 · .bi-emoji:1579 · .bi-emoji-img:1580 · .bi-title:1581
.bi-desc:1582 · .bi-ok:1583 · .bc-title:1589 · .bc-sub:1590 · .bc-sticky:1600 · .bc-coin:1601,1606
.bc-ok:1607,1612 · .sm-cheer:1627 · .sm-streak:1628,1629 · .sm-sick:1630 · .sm-btns:1631 · .float-fx:1643
.toast:1650 · .toast-warn:1657,1664,1665,1671 · .toast-link:1673,1680,1681,1686(+4) · .toast-clear-all:1697,1704 · .alert-box:1706 · .alert-ok:1707,1712
.settings-box:1714 · .set-row:1715 · .set-hint:1719 · .set-hint-on:1720 · .set-hint-off:1721 · .set-lwrap:1722
.set-label:1723 · .set-desc:1724 · .set-switch:1725,1729,1730,1735(+4) · .set-sw-knob:1731 · .set-sw-txt:1738 · .set-night-row:1747
.set-seg:1748,1750,1756,1757(+1) · .set-close:1759,1764 · .set-help:1765,1770 · .help-box:1772,1773,1778 · .help-item:1774 · .update-banner:1786,1795,1796
#update-reload:1797 · #update-dismiss:1801 · .levelup-overlay:1807,1813,1814 · .levelup-box:1815,1822,1823,1824(+4) · .bill-box:1830,1834,1835 · .tag-off:1836
.home-decayed-img:1837 · .home-dark-img:1838 · .thirst-fill:1839 · .thirst-text:1840,1841 · .toxin-fill:1844 · .toxin-text:1845,1846
.detox-btn:1847,1852 · .shape-text:1855,1856,1857,1858(+1) · .avatar-pick:1862 · .avatar-opt:1863,1867,1868,1869 · .avatar-chip-img:1873 · .mini-av:1875
.fp-ava:1876 · .avatar-chip-blk:1878 · .set-avatar-btns:1879 · .avatar-mini:1880,1884 · .set-blk-row:1886 · .set-sub2:1887
.blk-grid:1889 · .blk-mini:1890,1893,1894,1895 · .game-avatar:1898,1899,1900 · .stats-nick:1909 · .ticket-owned:1912,1916 · .collect-sub:1921
.mkt-tabs:1922 · .mkt-tab:1923,1927 · .mkt-filter:1928 · .mkt-row:1932 · .mkt-emoji:1936,1937 · .mkt-info:1938,1939
.mkt-tier-stars:1940 · .mkt-buy:1941,1946,1947 · .mkt-price-lo:1948 · .mkt-price-hi:1949 · .mkt-empty:1950 · .collect-grid:1953
.collect-cell:1954 · .cc-emoji:1955,1956 · .cc-name:1957 · .cc-count:1958 · .cc-list-btn:1959,1963 · .mkt-listhead:1964
.mkt-group-head:1966,1972 · .mkt-two-col:1974,1975,1979,1991(+8) · #phone-card:1980,1996 · #computer-card:1981,1997 · #ticket-card:1983 · #haunt-card:1984
#heli-card:1985 · #drone-card:1986 · #drive-card:1987 · #soccer-card:1988 · #moto-card:1989 · #invasion-card:1990
.mkt-listing:2018 · .ml-cancel:2022 · .mkt-sold:2028,2029,2030 · .list-dialog:2037,2038,2043 · .list-hint:2042 · .collect-reveal-frame:2046,2053
.collect-reveal-img:2052 · .collect-reveal-stars:2054 · .craft-box:2057 · .craft-head:2058 · .craft-bar:2059 · .craft-fill:2060
.craft-text:2061 · .craft-btn-row:2062,2063 · .craft-go-btn:2065,2071,2072,2075 · .craft-cancel:2083,2087 · .mkt-catalog:2090,2091,2092 · .mkt-pager:2095
.pg-btn:2096,2100,2101 · .pg-mid:2102 · .pg-dots:2103 · .pg-dot:2104,2105 · .order-head:2106 · .order-row:2107,2112,2114,2116
.order-deliver:2117,2122 · .order-need:2123 · .avatar-chip-photo:2129 · .pass-photo:2130 · .pl-photo:2131 · .pp-cam:2136,2144
.set-photo-row:2147,2153 · .ph-thumb:2154 · .ph-plus:2155 · .photo-box:2161,2162,2183,2187(+4) · .ph-now:2163 · .ph-now-img:2164,2168
.ph-now-cap:2169 · .ph-warn:2170 · .ph-sync:2175,2178 · .ph-sync-wait:2179 · .ph-sync-ok:2180 · .ph-sync-bad:2181
.ph-btns:2182 · .ph-tip:2192 · .ph-stage:2194,2198 · .ph-cv:2199 · .ph-ring:2200,2205 · .ph-zoom:2209
.ph-foot:2210 · .ph-crop-box:2211
