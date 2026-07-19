# CODE_MAP.md — แผนที่โค้ด:บรรทัด (เจนอัตโนมัติโดย `tools/gen_code_map.py` — **ห้ามแก้มือ** เดี๋ยวโดนเขียนทับ)

> วิธีใช้: หาชื่อฟังก์ชัน/ค่าคงที่/selector ในไฟล์นี้ (Grep หรือกวาดตา) → `Read` ไฟล์จริง `offset=<บรรทัด>` `limit=40`
> css = index `selector:บรรทัดทุกจุดที่ประกาศ` (บั๊ก UI เริ่มหาที่นี่) · เจนใหม่ทุกครั้งที่รัน `python tools/rotate_handoff.py` · อัปเดต: 2026-07-19

## js/adventure3d.js (9,632 บรรทัด · 437 รายการ)
GUIDE_WORDS:20 · RELOCATE_MS:21 · HALF:22 · PLAYER_SPEED:23 · HAUNT_LIVES:24 · HAUNT_IFRAME:25
PICK_DIST:26 · EYE_H:27 · NET_SEND_MS:28 · MODES:31 · SHOOT_GAP_MS:93 · MONSTER_REWARD:94
AD_COUNT:95 · AD_RENT_COIN:96 · AD_RENT_MS:97 · SHOP_ADS:101 · PILOT_TIERS:103 · pilotEmoji:104
DRONE_R:116 · DRONE_ACCEL:117 · DRONE_VMAX:118 · DRONE_CLIMB:119 · DRONE_YAWSP:120 · DRONE_GRAV:121
CAR_EYE:125 · CAR_ACCEL:126 · CAR_BRAKE:127 · CAR_VMAX:128 · CAR_LEGAL_KMH:129 · CAR_FINE_SPEED:130
CAR_FINE_BELT:131 · CAR_REPAIR_FEE:132 · CAR_FINE_SIGNAL:133 · CAR_RAM_FEE:134 · CAR_FINE_RED:135 · CAR_VMAX_OFF:136
CAR_VREV:137 · CAR_WB:138 · CAR_STEER_MAX:139 · HELI_SKID:171 · ASSIST_R:174 · PROP_STALL_MS:179
PROP_BREAK_SPD:182 · PROP_BROKEN_MUL:183 · BAT_DRAIN:186 · BAT_LETTER:187 · BAT_LOW:188 · BAT_EMPTY_MUL:189
CHG_R:192 · GATE_R:195 · showHeliSkip:202 · BOLT_MIN:203 · GLASS_HIT_R:204 · DOOR_R:205
SOCCER_SHIRTS:214 · BALL_R:219 · GOAL_HW:220 · KICK_SPD_MIN:221 · AIM_YAW_SP:222 · SOCCER_TILES:223
MECHA_EYE:237 · ALIEN_COUNT:238 · MECHA_MAX_HP:239 · MECHA_ATK_RANGE:240 · ALIEN_SHOT_SPD:241 · POWERUP_GAP:242
BOSS_SCALE:243 · COMBO_X2:244 · BOSS_SPECIES:247 · pickBossSpecies:255 · WAVE_BASE_GOAL:257 · waveCfg:258
MECHA_WEAPONS:267 · ATC_REPLIES:296 · ATC_CLOSERS:301 · ATC:306 · CHAT_MAX:425 · doneList:432
wordPool:433 · pickWords:446 · TILE_COLORS:453 · letterTexture:454 · emojiTexture:468 · GHOST_IMG_MAX:480
measureGhostBox:487 · probeGhostImages:500 · whenGhostsReady:512 · ghostTexture:516 · ghostScareSrc:521 · AD_STYLES:529
adRenterActive:538 · adBoardTexture:539 · addAdBillboard:586 · ringAds:597 · adsFetch:608 · adsWatch:620
adsStop:627 · adsChanged:628 · adRentBuy:639 · AD_FLYBY_COIN:660 · adFlybyTick:662 · adShopOpen:681
adShopRender:695 · BUILDING_TINTS:720 · buildingFacadeTexture:721 · makePeerSprite:744 · BLOCK_AVATARS:782 · blkGeo:793
blkMat:794 · blkCyl:795 · blkFaceMat:797 · makeBlockFigure:812 · makeBlockCar:852 · blkNameSprite:897
makeBlockPeer:909 · makeBlockWalkPeer:923 · disposeBlockPeer:931 · blkBuildThumbs:936 · blkBuildPicker:954 · pickBlockAvatar:999
bubbleSprite:1022 · showPeerBubble:1049 · removePeerBubble:1057 · concreteTexture:1067 · brokenWindowTexture:1084 · intactGlassTexture:1100
chargeIconTexture:1118 · rustyDoorTexture:1127 · dAddBox:1141 · buildAbandoned:1148 · makeNameSprite:1221 · flatGeom:1234
flatGeomUV:1243 · buildDriveCity:1253 · SKY_IMG:1539 · applySky:1540 · applyTex:1555 · buildScene:1578
randPos:1908 · randRoadPos:1916 · spawnLetter:1928 · spawnLettersForWord:1959 · ensureCoverage:1961 · relocateLetters:1974
removeLetter:1999 · LETTER_COIN:2010 · pickUpLetter:2011 · letterPop:2025 · letterChime:2043 · tryCompleteWords:2063
completeWord:2077 · spawnMonster:2122 · killMonster:2131 · tickMonsters:2139 · damagePlayer:2161 · shoot:2177
tickShots:2191 · spawnGhost:2217 · GHOST_STYLE:2226 · GHOST_H_DEFAULT:2227 · applyGhostSize:2228 · respawnGhost:2237
tickGhosts:2253 · sessionRecapHtml:2299 · hauntRunSec:2306 · fmtSurv:2307 · hauntSurviveFinish:2308 · tickSurvive:2318
renderHearts:2331 · ghostHit:2340 · caught:2362 · knockedOut:2388 · netReady:2552 · netJoin:2556
sendPos:2569 · sendChat:2598 · toggleChatBox:2612 · onPeerData:2622 · removePeer:2706 · netLeave:2718
tickPeers:2726 · RTC_CFG:2797 · tinvLinked:2798 · partyWord:2805 · syncPartyWord:2818 · updateVoiceBtns:2970
PODIUM_BONUS:2995 · podiumJoin:2997 · podiumLeave:3008 · endRound:3009 · showPodium:3020 · tinvCheck:3060
showBanner:3080 · renderHudTop:3086 · renderHudWords:3091 · renderHudInv:3101 · ddTierFromName:3108 · renderBoard:3110
drawBigMap:3134 · openBigMap:3189 · closeBigMap:3197 · drawMinimap:3202 · loadCarDash:3274 · loadCarWheel:3286
buildDom:3296 · confirmExit:4779 · IS_TOUCH:4798 · bindInput:4799 · movePlayer:4886 · tickPlayer:4896
collideDrone:4929 · propStall:4948 · propBreak:4955 · propFix:4962 · droneBatAdd:4969 · lightningBolt:4972
startRain:4983 · stopRain:4997 · smashGlass:4999 · awardGlass:5010 · neededLetter:5027 · openDoor:5042
raceStartRun:5062 · raceStop:5069 · gateHighlight:5087 · renderRaceHud:5094 · tickDrone:5103 · nearMissTick:5245
showNearMiss:5269 · awardDaredevil:5280 · comboCheer:5297 · comboFlash:5313 · driveCell:5322 · nearestStreet:5328
collideCar:5338 · tlDotY:5369 · tlSet:5373 · driveArms:5390 · tlTick:5402 · TL_GREEN:5446
tlRedDur:5448 · tlightPhase:5449 · buildTrafficLights:5456 · rlTick:5508 · cellDrivable:5540 · cellCenter:5541
losClear:5543 · nearestDrivableCell:5553 · routeGrid:5562 · pickGpsTarget:5615 · gpsSpeak:5627 · NAVLINE_W:5646
navLineEnsure:5647 · navLineHide:5657 · navLineUpdate:5658 · tickGps:5685 · tickDrive:5761 · drawCarDial:5937
drawCarGauges:5967 · RADIO_RECT:5995 · CAR_RADIO_RECT:5997 · carRadioRect:6003 · radioLayout:6005 · radioSetHint:6028
renderRadioList:6034 · radioToggleList:6044 · drawRadioViz:6049 · radioTick:6067 · BOBBLE_FOOT:6080 · BOBBLE_H:6081
BOBBLE_ASPECT:6082 · BOB_OMEGA:6085 · BOB_PITCH_FORCE:6087 · BOBBLE_SKINS:6089 · bobbleSetAvatar:6096 · bobbleLayout:6103
bobbleTick:6116 · bobblePoke:6141 · bobbleApplySkin:6158 · dollOwned:6168 · openDollPicker:6169 · carStartShow:6206
showLawInfo:6224 · lawNotice:6246 · driveFineSettle:6256 · HELI_PHASES:6435 · heliStartPhase:6442 · heliFloorAt:6449
SOFT_TIERS:6459 · softLandBonus:6461 · awardPerfLand:6474 · setHeliLight:6493 · MAIL_COIN:6512 · mailStart:6514
mailStop:6537 · mailTick:6538 · FOOT_EYE:6557 · doorSlideSfx:6563 · doorLerp:6586 · WRING_COIN:6594
festivalPaint:6598 · dustTexture:6610 · dustBurst:6619 · dustTick:6633 · heliMeshBuild:6651 · buildHeliFoot:6726
footFloorAt:6809 · insideTerm:6816 · inDoorZone:6817 · footHint:6821 · setFootBtns:6822 · liftStart:6827
beginRide:6838 · endRide:6855 · beginWing:6866 · awardAirLetter:6879 · beginPilot:6897 · drawCabinWindow:6923
tickHeliFoot:6943 · tickHeli:7122 · CP_NAT:7334 · CP_GAUGES:7335 · SEAT_LABEL:7348 · SEAT_P_FULL:7349
SEAT_ZOOM:7350 · DASH_OFF_Y:7351 · DASH_DROP:7352 · setSeat:7354 · layoutCockpit:7366 · WIPER:7405
WIPER_SPD:7406 · sunUpdate:7412 · HELI_FOG_N0:7423 · fogUpdate:7427 · adGlowPulse:7473 · RAIN_MAX:7482
VISOR_Y:7483 · RAIN_MIN:7484 · RAIN_DUR:7485 · DROP_ZONE:7489 · addDrop:7490 · tickDrops:7498
WIPE_R:7514 · wipeDrops:7515 · setWiper:7531 · setVisor:7537 · rainTick:7543 · drawBlade:7555
drawGlass:7569 · drawBellyCam:7636 · drawBellyHud:7659 · drawLandingTargets:7705 · VS_HARD:7775 · drawDescentBar:7776
heliShake:7825 · cpNeedle:7836 · drawGauges:7853 · XF_START:7900 · PRELOAD_WAIT:7901 · ALT_QUIET_FROM:7903
ALT_MAX_DAMP:7904 · ALT_LP_MIN:7905 · ECHO_NEAR:7906 · WIND_FULL_SPD:7907 · SHUTDOWN_SEC:7908 · PAN_MAX:7910
OD_RPM:7911 · SHAKE_RPM:7912 · SHAKE_HIT:7913 · soccerLetterPos:8392 · letterNeeded:8396 · soccerNeededSet:8401
soccerTileGeo:8407 · soccerGoldTexture:8409 · makeSoccerTile:8426 · soccerRefreshSkins:8435 · soccerBuildTargets:8442 · soccerRetarget:8451
soccerCoinPop:8463 · soccerFieldTexture:8475 · soccerNetTexture:8486 · soccerCrowdTexture:8493 · soccerBallMat:8501 · buildSoccerGoal:8509
buildStands:8520 · soccerNumTex:8528 · makeSoccerPlayer:8538 · soccerResetBall:8562 · soccerKick:8567 · soccerCheer:8575
updateSoccerGuide:8576 · soccerCamera:8590 · tickSoccer:8605 · soccerKitShow:8681 · soccerKitGo:8696 · emojiSprite:8747
makeAlien:8752 · startWave:8785 · waveSpawnFill:8796 · waveComplete:8805 · updateWaveHud:8815 · checkMechaBossBadge:8817
alienSpawnPos:8826 · removeAlien:8831 · mechaHudWord:8836 · setMechaHudSkin:8844 · mechaComboPop:8856 · mechaShielded:8861
mechaDamageFx:8863 · mechaHitByAlien:8868 · spawnAlienShot:8874 · removeAlienShot:8884 · tickAlienShots:8889 · spawnPowerup:8901
removePowerup:8914 · collectPowerup:8919 · tickPowerups:8926 · updateMechaHud:8935 · mechaTracer:8975 · mechaFire:8984
explodeAlien:9021 · tickMecha:9051 · loop:9107 · grabShot:9134 · savePhoto:9145 · clearEntities:9157
INTRO_KEY:9171 · introSeenObj:9172 · introSeen:9173 · markIntroSeen:9174 · INTRO:9175 · showIntro:9240
closeIntro:9265 · beginPlay:9271 · start:9273 · exitWorld:9451 · mechaRecapLine:9495

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

## js/game.js (948 บรรทัด · 63 รายการ)
REPLAY_BONUS_EVERY:23 · REPLAY_BONUS_TIERS:25 · replayBonusFor:26 · SESSION_MILESTONES:32 · addSessionCoins:35 · updateBestTarget:74
weekKeyStr:87 · rolloverWeekBest:93 · exitGame:99 · showSessionSummary:132 · sprinkleConfetti:179 · VOCAB_PER_LEVEL:198
VOCAB_RANK_NAMES:199 · vocabRankName:200 · showProgressReport:202 · THUNDER_MS:379 · THUNDER_TIERS:383 · THUNDER_TIER_UI:384
thunderEmoji:385 · DAREDEVIL_TIERS:389 · DAREDEVIL_TIER_UI:390 · daredevilEmoji:391 · GLASS_TIERS:395 · GLASS_TIER_UI:396
glassEmoji:397 · DILIGENT_TIERS:401 · DILIGENT_TIER_UI:402 · diligentEmoji:403 · SOFTLAND_TIERS:407 · SOFTLAND_TIER_UI:408
softLandEmoji:409 · AIRL_TIERS:413 · AIRL_TIER_UI:414 · airLetterEmoji:415 · MECHABOSS_TIERS:419 · MECHABOSS_TIER_UI:420
mechaBossEmoji:421 · BFF_TIERS:426 · BFF_TIER_UI:427 · BFF_COIN:428 · bffEmoji:429 · badgeSuffix:434
BADGE_META:449 · NAME_BADGE_RE:463 · splitNameBadges:464 · badgeEmojis:470 · badgeScore:475 · checkCrown:481
currentBadgeScore:497 · rolloverBadgeWeek:501 · addDiligent:514 · celebrateBadge:530 · addThunder:544 · startGame:558
newRound:598 · updateTimerBar:637 · updateComboPill:643 · pickCard:647 · checkMatch:659 · renderCats:773
startQuiz:808 · renderQuizQuestion:824 · finishQuiz:883

## js/images.js (101 บรรทัด · 14 รายการ)
IMG_FILES:11 · MOODS:12 · startImgKey:14 · petImageKeys:16 · probeImages:27 · probeRankImages:39
probeCollectImages:40 · probeGiftImages:41 · probeHomeImages:42 · equippedItem:48 · petStateImg:58 · happyNow:72
makeHappy:73 · currentPetImg:84

## js/lobby.js (52 บรรทัด · 3 รายการ)
PANEL_TITLES:9 · openPanel:20 · closePanel:28

## js/lobby3d.js (780 บรรทัด · 0 รายการ)

## js/main.js (158 บรรทัด · 2 รายการ)
syncMusicBtn:79 · bootGame:113

## js/moto3d.js (1,832 บรรทัด · 102 รายการ)
REWARD:7 · ACCEL:8 · DASH_LEN:9 · DOG_HIT_COIN:10 · FEAT_SP:12 · DECAL_N:13
GRAV:14 · SUSP_K:15 · ROAD_WIDE:16 · EDGE_M:17 · ROAD_TEX_S:18 · POST_N:19
LEAN_MAX:20 · COLLECT_R:21 · SPAWN_MIN:22 · BUCKET:23 · TILE_COLORS:24 · LETTER_COIN:26
COIN_VAL:30 · COIN_GAP:31 · COIN_SPIN_SPD:33 · COIN_TIERS:36 · EMERALD_TIER:43 · HARD_LAND:44
COIN_CURVE_RAD:45 · NET_SEND_MS:47 · PEER_COLORS:48 · CHAT_MS:50 · CHAT_PRESETS:51 · ENG_FILES:92
CSS:147 · buildDom:332 · segKey:434 · smoothPts:437 · featKey:453 · addFeat:454
genFeatures:459 · terrainAt:478 · roadGroundY:491 · decalTex:499 · makeDecals:518 · decalTick:527
buildRoads:544 · distToSeg:640 · roadInfo:645 · onRoad:651 · randomRoadPoint:652 · makeTextSprite:675
letterTexture:688 · woodTileMat:703 · muralTexture:714 · buildSchool:726 · buildScenery:872 · scatterTrees:951
postTick:971 · scatterClouds:998 · makeDog:1010 · spawnDog:1025 · dogHit:1035 · dogTick:1046
coinTexture:1064 · makeCoins:1075 · loadCoinImg:1081 · addCoin:1093 · clearCoins:1101 · addFreeCoin:1105
coinTierAt:1113 · coinFx:1123 · grabCoin:1132 · coinTick:1149 · placeSpecialCoin:1163 · makeVehicle:1175
netReady:1210 · netJoin:1214 · netSend:1227 · sendChat:1244 · showPeerBubble:1254 · removePeerBubble:1261
renderBoard:1268 · peerColor:1285 · buildPeer:1289 · onPeer:1298 · dropPeer:1326 · netLeave:1333
peerTick:1339 · spawnSlot:1350 · pickWord:1367 · spawnLetters:1377 · renderWordHud:1392 · fitWord:1400
collectTick:1407 · completeWord:1426 · relocTick:1451 · gpsTick:1466 · miniTick:1475 · build:1510
applyVehicleUi:1544 · fit:1562 · tick:1570 · frame:1578 · start:1722 · exitWorld:1773

## js/music.js (136 บรรทัด · 0 รายการ)

## js/online.js (1,116 บรรทัด · 76 รายการ)
ONLINE_STALE_MS:53 · ONLINE_BEAT_MS:54 · LEADERBOARD_SIZE:55 · onlineDisplayName:59 · onlineActivity:67 · ensureOnlineId:83
onlineKey:93 · onlinePushPresence:98 · onlinePushScore:108 · fetchPlayerStats:134 · onlineRerender:156 · notifyFriendBadges:168
FRIEND_ALPHA:194 · friendCode:195 · friendSearch:207 · friendRequest:231 · friendAccept:240 · friendDecline:252
friendsHeal:262 · CHAT_MAX_LEN:286 · CHAT_KEEP:287 · chatPairId:289 · chatRef:292 · chatListen:298
chatSend:314 · chatDeleteMsg:330 · TYPING_TTL:338 · typingRef:340 · chatSetTyping:341 · chatClearTyping:351
chatWatchTyping:359 · chatThemeRef:377 · chatSetTheme:378 · chatWatchTheme:383 · chatPrune:391 · chatSeenTs:408
chatMarkSeen:414 · chatUnreadCount:426 · chatWatchSync:429 · GIFT_EXPIRE_MS:479 · giftSend:482 · greetSend:496
giftAccept:508 · giftDecline:512 · giftInWatch:518 · giftReclaim:549 · giftOutWatchSync:559 · giftOutRebuild:614
salesWatch:644 · salesRerender:652 · sellInc:656 · marketWatch:664 · marketList:697 · marketUnlist:705
marketBuy:714 · marketSoldWatch:727 · tinvSend:756 · tinvClear:763 · tinvWatch:767 · FEED_MAX:796
feedEvent:799 · feedPrune:810 · feedPurgeCat:821 · feedPushAssets:832 · petDescriptor:850 · feedPushPets:856
fetchPlayerPets:870 · followSet:886 · followUnset:897 · feedRebuild:904 · feedWatchSync:916 · fetchPlayerFeed:943
fetchPlayerAssets:956 · fetchFollowers:975 · onlineStart:984 · onlineLoadSDK:1091

## js/state.js (971 บรรทัด · 83 รายการ)
STORAGE_KEY:6 · CURE_COST:8 · HUNGRY_SICK_MS:9 · MEAL_HOUR:11 · MEAL_FULL:12 · SLEEP_FROM_HOUR:13
SLEEP_SICK_HOUR:14 · WAKE_HOUR:15 · DINNER_COST:16 · TOXIN_FULL:18 · DETOX_COST:19 · FOODQUIZ_Q:21
FOODQUIZ_COIN:22 · FOODQUIZ_BONUS:23 · SHAPE_JUNK_MEALS:25 · SHAPE_CLEAN_MEALS:26 · SHAPE_MISS_MEALS:27 · SHAPE_EXP_BONUS:28
HEAT_SICK_MS:29 · THIRST_SICK_MS:30 · DEFAULT_STATE:32 · FEED_CATS:155 · SLOT_MS:166 · currentSlotStart:167
nextSlotStart:173 · mealDayKey:175 · nightKeyOf:177 · newPet:183 · loadState:208 · saveState:420
activePet:427 · petStage:428 · isAdult:433 · abilityOn:434 · hasPetType:435 · todayStr:438
dailyTick:442 · addCoins:445 · QUEST_POOL:465 · QUEST_PER_DAY:475 · questsToday:476 · questTick:483
questEvent:487 · assetValue:523 · netWorth:548 · assetCount:550 · refreshRank:567 · heatProtected:583
rainProtected:587 · petHungry:590 · petShapeOf:594 · updatePetShape:600 · shapeMealDone:607 · heatPct:617
ymStr:626 · billOutstanding:630 · UTILITIES:637 · HOME_UTILITIES:643 · homeDecayed:645 · billTick:648
myCar:717 · carLoanDue:722 · carLoanOverdue:727 · carLoanPayable:732 · carLoanPay:739 · compTick:752
ONLINE_RATE:766 · onlineEarnActive:767 · onlineEarnTick:771 · onlineEarnFlush:782 · marketTick:792 · addCraft:816
ORDER_MAX:835 · ORDER_LIFE_MS:836 · ORDER_GAP_MIN_MS:837 · ORDER_GAP_SPAN_MS:838 · ORDER_TIER_WEIGHT:839 · newOrder:840
orderTick:853 · careTick:861 · expNeed:942 · addExp:947 · addRP:967

## js/ui.js (6,897 บรรทัด · 277 รายการ)
startHTML:10 · PET_ANIM:30 · petAnimHTML:35 · petVisualHTML:50 · lobbyBlk:81 · caretakerFigureHTML:87
footAlign:97 · heroRankBgHTML:125 · NEW_WORD_MS:159 · newWordNext:165 · renderNewWord:176 · alignNewWord:203
startNewWordTimer:217 · nwCountdownTick:234 · PAT_REMIND_HOUR:249 · patRemindTick:250 · applyPatRemindGlow:271 · NEW_WORD_COIN:286
NW_DAILY_GOAL:287 · NW_DAILY_BONUS:288 · newWordReward:289 · nwDailyTick:312 · coinFlyFx:331 · nwDailyBarHTML:364
showNewWordPopup:375 · GIANT_MAX:404 · GIANT_COST:405 · GIANT_PET_VH:406 · GIANT_OWNER_VH:407 · GIANT_OWNER_X:408
GIANT_NAMES:409 · giantLevel:410 · giantUnlocked:414 · upgradeGiant:416 · renamePet:439 · resetGiant:455
mealLabel:466 · fmtMins:473 · renderClock:482 · dinnerDue:505 · renderDinnerChip:510 · dinnerClick:521
renderRainBar:556 · rainFxTick:589 · RAIN_DROP_IMGS:606 · rainFxDrop:607 · selfPronoun:637 · selfTag:642
idTag:646 · SIDE_SCROLL_SPEED:656 · SIDE_SCROLL_RESUME:657 · initSideScroll:660 · sideScrollTick:688 · QUEST_FLASH_HOLD:712
QUEST_DECK_FLIP_MS:719 · questGo:722 · qDeckDraw:731 · qDeckNext:754 · renderQuestCard:768 · sideFlashRows:806
FRIEND_FLASH_GRACE:824 · ONLINE_FLIP_MS:832 · ONLINE_FLIP_RESUME:833 · ONLINE_SWIPE_STEP:834 · onPageDraw:838 · onPageFlip:846
bindOnlinePager:857 · renderOnlineCard:890 · bindInviteCards:1002 · bindFriendQuickMenu:1022 · openFriendQuickMenu:1032 · bindLbTabs:1094
renderLeaderboardCard:1105 · bindLbGroupOpen:1128 · lbRankRows:1139 · lbDemoRows:1166 · lbChar:1188 · openLeaderboardFull:1197
BLK_PAD:1261 · seatPodChars:1263 · lbCoinHtml:1273 · lbBadgeHtml:1289 · lbBossHtml:1315 · bindPlayerClicks:1341
showPlayerCard:1351 · petDescImg:1564 · openImgLightbox:1577 · openPetPeek:1597 · updateBillBadges:1641 · setBadge:1653
updateSettingsBadge:1669 · openAttentionSummary:1683 · updateFriendBadge:1725 · renderFriendPanel:1735 · friendDoSearch:1783 · refreshFriendData:1807
CHAT_EMOJI_CATS:1859 · CHAT_THEMES:1881 · CHAT_SECRET_MS:1890 · chatBadgeSync:1898 · ibTimeStr:1906 · openChatInbox:1913
openChat:2016 · giftImg:2203 · giftDateStr:2205 · GREETS:2213 · GREET_EXP:2221 · greetInfo:2222
openGreetPicker:2226 · giftItemPic:2268 · giftItemName:2276 · updateGiftBadge:2282 · renderGiftPanel:2291 · acceptGift:2349
declineGift:2372 · showGreetReveal:2381 · showGiftReveal:2408 · openGiftPicker:2434 · confirmSendGift:2502 · doSendGift:2526
rankBadgeHTML:2550 · renderRankCard:2555 · showRankUp:2577 · bindPetPlateButtons:2612 · openPetInfoOverlay:2636 · feedAgo:2659
renderFeedCard:2672 · alignPetTabs:2725 · alignCureBtn:2743 · dictRecordLookup:2767 · DICT_FILE_COUNT:2778 · loadDict:2779
dictSearch:2794 · dictTapWords:2809 · dictEntryHTML:2813 · openDictOverlay:2824 · renderDashboard:2908 · sleepBtnHTML:3302
sleepHintHTML:3309 · sleepAllPets:3320 · wakeAllPets:3333 · feedPet:3344 · openFoodMenu:3358 · feedWith:3429
AVATAR_UI:3459 · playerAvatarHTML:3462 · SHAPE_UI:3468 · showFeedResult:3477 · curePet:3518 · heartsFx:3541
PAT_HOLD_MS:3564 · PAT_EXP:3565 · bindPetTap:3566 · petBounce:3584 · petMood:3590 · shortPatPet:3597
longPatPet:3605 · patCalendarHTML:3625 · patStreakTick:3653 · cureCelebrateFx:3679 · railCureClick:3690 · detoxPet:3702
openFoodQuiz:3725 · renderShop:3805 · homeVisualHTML:3869 · showHomeRuined:3883 · showCutNotice:3904 · renderHomeCard:3922
payMaint:4006 · trashBillUI:4022 · payTrash:4039 · UTILITY_UI:4058 · utilityBillUI:4107 · payUtility:4132
buyUtilityFix:4158 · renderPhoneCard:4176 · buyPhone:4216 · sellPhone:4238 · compLiveTotal:4259 · onlineLiveTotal:4270
renderOnlineEarnPill:4275 · openPillInfo:4298 · renderComputerCard:4345 · buyComputer:4380 · sellComputer:4403 · soldCount:4429
soldBadge:4430 · renderTicketCard:4435 · loadScriptOnce:4491 · enterAdventure3D:4507 · pickAdvMap:4532 · enterHaunted3D:4567
advHealClick:4589 · buyTicket:4609 · renderHauntCard:4635 · buyHauntTicket:4690 · renderHeliCard:4717 · buyHeliTicket:4775
enterHeli3D:4798 · renderDroneCard:4820 · buyDroneTicket:4875 · enterDrone3D:4898 · renderDriveCard:4921 · buyDriveTicket:4995
enterDrive3D:5018 · pickDriveMap:5053 · enterMotoMapAsCar:5089 · renderSoccerCard:5111 · buySoccerTicket:5159 · enterSoccer3D:5182
renderMotoCard:5205 · buyMotoTicket:5254 · enterMoto3D:5277 · WORLD3D:5302 · gotoRobotShop:5312 · scrollShopCardIntoView:5317
railWorldClick:5320 · renderRailWorlds:5341 · tinvNoticeHTML:5400 · openTinvPicker:5408 · fruitCountdown:5452 · renderFarmCard:5464
renderFarmClock:5534 · buyFruit:5550 · sellFruit:5570 · sellAllFruit:5587 · collectImg:5613 · renderFactoryCard:5619
renderMarketCard:5642 · updateWishBadge:5698 · openWishlistDialog:5709 · bindStripArrows:5754 · renderMarketBrowse:5766 · carImg:5795
renderVehicleShop:5796 · CS_CYCLE_MS:5847 · carInteriorImg:5848 · carStatHtml:5850 · renderCarShowroom:5857 · csShowBig:5883
csInit:5910 · RS_CYCLE_MS:5933 · robotImg:5934 · renderRobotShop:5935 · rsShowBig:5957 · rsInit:5978
buyRobot:5997 · enterMecha3D:6019 · pickMechaRobot:6040 · pickDriveCar:6072 · openCarBuyDialog:6115 · buyCarInsurance:6176
payCarLoanMonthly:6195 · payCarLoanFull:6207 · carDriveBlock:6226 · gotoVehicleShop:6231 · gotoMyStock:6236 · showNeedCarDialog:6242
craftDiscount:6254 · renderFactory:6257 · renderOrdersUI:6319 · startProduce:6338 · buyCollectible:6366 · cancelProduce:6394
deliverOrder:6408 · renderOrderClock:6425 · renderCollectMine:6435 · openListDialog:6477 · cancelListing:6530 · buyMarketItem:6553
showCollectReveal:6580 · buyAC:6618 · openHomeShop:6637 · renderPetShop:6696 · showLevelUp:6757 · renderStats:6794
showTeacherCard:6865

## js/util.js (727 บรรทัด · 32 รายการ)
shuffle:6 · fmtNum:15 · escapeHTML:19 · seededRand:25 · fmtThaiDT:35 · fmtThaiDate:39
showScreen:44 · TOAST_WARN_RE:52 · restackToasts:55 · toast:77 · floatFx:97 · beep:107
PET_MOOD:148 · petVoiceSynth:155 · sirenSynth:232 · playCashier:256 · cashierSynth:270 · playSpark:303
sparkSynth:317 · thunderFx:352 · wordAudioFile:420 · speakWord:423 · speakLetter:443 · pickSpeakVoice:462
speakWordTTS:473 · askNameDialog:493 · askConfirm:533 · alertBox:551 · applyNoAnim:571 · openSettings:576
openHelp:682 · openTeacherGuide:708

## js/vocabbook.js (207 บรรทัด · 14 รายการ)
VB_MAX:11 · VB_QUIZ_N:12 · VB_QUIZ_MIN:13 · vbGroup:16 · VB_GROUP_UI:21 · vbRecord:24
vbSeen:49 · vbStats:62 · vbList:70 · vbReviewCat:81 · vbStartReview:95 · openVocabBook:106
vbRender:148 · vbCardHTML:194

## js/wordsearch.js (236 บรรทัด · 0 รายการ)

## css/lobby.css (2,533 บรรทัด · 471 selector)
:root:6 · html:15 · body:16 · *:33,34,35,36 · #app:39 · h1:41
.subtitle:42 · .shop-title:43 · #rotate-overlay:46 · .screen:68 · #screen-select:77,78,79,80(+5) · .egg-need:87
.petshop-topright:89 · .petshop-play-link:90,95 · #screen-quiz:134,135,136,137(+4) · #quiz-choices:143,144 · .word-card:151 · .quiz-choice:152,153,154
.big-btn:157,158,159,160 · #screen-dashboard:165,784,792 · .lobby-top:172,600,601,602(+3) · .top-flex:173 · .profile-plate:174,178,521 · #rain-fx:183
.rain-layer:186,192 · .rain-glass:199 · .glass-drop:200 · .rail-btn:215,611,617,618(+13) · .rail-badge:216 · .fr-code-box:221
.fr-code-label:225 · .fr-code-row:226 · .fr-code:227 · .fr-copy-btn:232,236,241,242 · .fr-search-btn:237 · .fr-add-btn:238
.fr-accept:239 · .fr-decline:240 · #fr-search-input:243 · #fr-search-result:247 · .fr-found:248 · .fr-hint:252
.fr-list-title:253 · .fr-row:254 · .fr-req:258 · .fr-row-name:260,264 · .fr-row-status:268 · .fr-req-btns:269
.online-dot:270 · .fr-chat-btn:271,276,278 · .fr-unread:279 · .chat-overlay:286 · .chat-box:290,399,406,413(+12) · .chat-head:302
.chat-theme-btn:307,311 · .chat-secret-tg:312,313 · .cs-switch:314,315,320,321 · .cs-slider:316,318 · .chat-secret-note:322 · .chat-theme-strip:325
.chat-theme-sw:327,330,331,332(+1) · .chat-head-name:334,335 · .chat-close:336 · .chat-msgs:340 · .chat-empty:344 · .chat-typing:346
.ct-dots:348,349,351,352 · .no-anim:354,367,670,697(+26) · .chat-bubble:355,360,365 · .chat-emoji:368 · .chat-emo:372,376 · .chat-input-row:377
.chat-emoji-btn:381 · #chat-input:385 · .chat-send:389,394,395 · .pl-click:462,464,465 · .pl-overlay:466 · .pl-card:470,1911
.pl-close:476 · .pl-head:480,1820,1823 · .pl-grade:485 · .pl-badges:487 · .pl-badge-chip:488,492 · .pl-body:493
.pl-loading:494 · .pl-none:495 · .pl-me-tag:496 · .pl-blk-wrap:498 · .pl-blk:499 · .pl-stat:500
.pl-lbl:505 · .pl-val:506,507 · .pl-tip:508 · .chip-edit:514,519,520 · .rank-mini:526,532,533,534 · .pass-photo:536,541
.pet-tabs:543 · .dict-box:544,548,549,550(+1) · .dict-card:556,561,565,566(+2) · .dict-head:562,563 · .dict-trail:570,574 · .dt-c:575,579,580
.dt-sep:581 · .dict-today:582 · .di-w:584,585,586 · .dict-list:587 · .dict-item:588,592,593,594(+5) · .lobby-mid:608
.lobby-rail:610 · .rail-worlds:628 · .rail-div:629 · .lobby-stage:644,646,662,789(+1) · .newword-banner:652,659,664 · .coin-fly:675,678
.coin-plus:684 · .nw-pop-coin:699,701,702 · .nw-pop-goal:705,706,710,714 · .nw-goal-head:707,709,711 · .nw-goal-bar:712 · .nw-goal-fill:713
.nw-pop-book:715,716 · .nw-tag:737 · .nw-word:742 · .nw-hint:744,745 · .nw-coin:747,750 · .nw-countdown:755
.nw-bar:757 · .nw-bar-fill:759 · .pet-stage:762,2086 · .nw-box:769,2095 · .nw-pop-word:770 · .nw-speak:771
.nw-pop-phon:772 · .nw-ipa:773 · .nw-pop-sent:774 · .nw-pop-mean:775 · .pet-tab:776,777,778,2420 · .stage-hero:799,814,822,967(+5)
.hero-ground:836,956,962 · .hero-rank-bg:838,841,844,848(+18) · #lobby3d-canvas:861,862 · .hero-scene:866,868,875,876(+8) · .caretaker-fig:915 · .caretaker-img:918
.caretaker-emoji:920 · .blk-rig:927,928,929 · .stage-plate:989,997,1008,1009(+30) · .plate-title:1003 · .lobby-side:1046,1081,1086,1089(+22) · .side-sec:1049,2335
.side-label:1050,1055 · .side-label-row:1057,1058 · .lb-tabs-out:1059,1060,1064 · .side-glass:1068,1075 · .side-card:1087,1199 · #quest-card:1099,1123,1124,1125(+6)
.q-bigcard:1100,1129,1130,1133(+1) · .qb-top:1102 · .qb-emoji:1103 · .qb-name:1105 · .qb-bar:1106,1107 · .qb-row:1109
.qb-prog:1110 · .qb-reward:1111 · .qb-go:1112,1116 · .q-dots:1117 · .q-dot:1118,1119,1120 · .q-bonus:1121
.feed-row:1144,1758,1763 · .inv-card:1146,1148,1149 · .inv-btns:1150 · .inv-go:1151,1153 · .inv-x:1154 · #online-card:1158,2343,2344,2345(+1)
.fq-overlay:1159 · .fq-box:1161,2151 · .fq-head:1165,1167 · .fq-close:1168 · .fq-sec:1170 · .fq-worlds:1171
.fq-world:1172,1174 · .fq-acts:1175 · .fq-act:1176,1179,1180 · .lobby-bottom:1210,1212 · .lobby-quiz-btn:1213 · .lobby-book-btn:1214,1215
.lobby-foodquiz-btn:1216,1217 · .lobby-play-btn:1218,1222 · .lobby-exam-btn:1224,1225,1227 · .panel-overlay:1232,1237 · .panel-box:1238 · .panel-head:1245,1249
.panel-close:1250,1255 · .panel-body:1256,1260,1261 · .panel-page:1258,1259 · .collect-sub:1265 · .mkt-empty:1266 · .craft-box:1267
.mkt-listing:1268 · .mkt-filter:1269,1613 · .hq-grid:1276 · .hq-card:1277,1282,1306 · .hq-head:1283 · .hq-pic:1289,1291
.hq-emoji:1293 · .hq-badge:1294 · .hq-stars:1298 · .hq-price:1299,1304,1305,1308(+6) · .craft-credit:1312,1314,1315 · .car-grid:1322,1324,1325
.robot-weap:1326 · .dmap-box:1329,1330 · .dmap-grid:1336 · .dmap-card:1338,1341,1342,1343(+2) · .dmap-ico:1345 · .dmap-new:1348
.dcp-grid:1350 · .dcp-card:1352,1355,1356,1357(+10) · .levelup-box:1374,2052,2053,2148 · .dcp-box:1377,1378,1382,1383(+6) · .dcp-lock:1391 · .sold-badge:1395,1397,1398
.rs-showroom:1400 · .rs-list:1401,1403 · .rs-thumb:1404,1406,1407,1408(+1) · .rs-thumb-pic:1409,1410 · .rs-thumb-price:1411 · .rs-stage:1413
.rs-big:1416 · .rs-big-img:1417 · .rs-elec:1421,1425,1430 · .rs-edge:1431,1437 · .rs-info:1440,1441,1442,1443(+1) · .rs-buy:1445,1447,1448
.cs-showroom:1452 · .cs-list:1453,1455 · .cs-thumb:1456,1458,1459,1460(+1) · .cs-thumb-pic:1461,1462 · .cs-thumb-name:1463 · .cs-thumb-price:1464
.cs-thumb-own:1465 · .cs-stage:1467 · .cs-big:1470 · .cs-big-img:1471 · .cs-elec:1475,1479,1483 · .cs-edge:1484,1490
.cs-interior:1493 · .cs-inr-label:1494,1495 · .cs-inr-img:1496 · .cs-info:1498,1499,1500,1501(+6) · .cs-buy:1509,1511,1512,1513 · .car-emoji:1515
.car-mine:1521 · .car-mine-pic:1526 · .car-mine-info:1527 · .car-loan:1528,1529 · .car-mine-btns:1530,1531,1532 · .car-locked:1534
.car-mine-head:1536 · .car-pick-list:1537,1538 · .car-pick:1539,1541,1542 · .car-pick-pic:1543,1544 · .car-pick-name:1545,1546 · .car-pick-od:1547
.car-buy-box:1549,2155 · .cb-pic:1550,1551,1552 · .cb-lines:1553 · .cb-li:1554,1558,1559 · .cb-ins:1560,1564,1565 · .cb-plan:1566
.cb-pl:1567,1572,1574,1578(+1) · .cb-total:1585 · .cb-btns:1586,1591 · .cb-x:1587 · .shop-grid:1594 · .shop-item:1595,1600,1605,1606(+3)
.mkt-tab:1614,1615 · .pg-btn:1616,1617,1618 · .pg-dot:1619 · .fr-gift-btn:1641,1646 · .gift-sec-title:1649 · .gift-in-row:1651
.gift-out-row:1655 · .gift-in-pic:1656,1658,1659 · .gift-in-info:1660,1661 · .gift-in-btns:1662 · .gift-accept:1663,1667,1669 · .gift-decline:1668
.gift-box-card:1670 · .gift-box-from:1671,1672 · .gift-note:1673 · .gift-pick-overlay:1676 · .gift-pick-box:1680 · .gift-pick-head:1686,1690
.gift-pick-close:1691 · .gift-pick-tabs:1693 · .gp-tab:1694,1698 · .gift-pick-body:1699 · .gp-chips:1700 · .gp-chip:1701,1705
.gp-card:1706,1707 · .gp-price:1708 · .gp-note:1709 · .gift-cf-pic:1710 · .chat-emoji-cats:1715 · .chat-emoji-cat:1719,1723,1724
.chat-emoji-wrap:1725,1726 · .stage-left:1734 · .pet-info-btn:1738,1745,1746 · .feed-list:1753,1757 · .feed-ico:1764 · .feed-txt:1765
.feed-name:1766 · .feed-ago:1767 · .feed-empty:1768,1771 · .pi-overlay:1773 · .pi-box:1777,1782,1783,1787(+2) · .pi-close:1789,1794,1795
.pi-close-left:1797 · .pi-portrait:1799 · .pi-dress-btn:1806,1810,1811 · .pi-shape-cap:1812,1815,1816,1817 · .greet-card:1824 · .greet-sub:1825
.greet-grid:1826 · .greet-opt:1827,1830,1831,1832 · .greet-e:1833 · .pi-streak:1837 · .pi-streak-head:1839,1841 · .pi-streak-best:1842
.pi-dots:1843 · .pi-dot:1845,1846,1847 · .pi-streak-note:1848 · .pi-care-title:1849 · .lbf-overlay:1852 · .lbf-box:1855
.lbf-head:1860 · .lbf-title:1861 · .lbf-tabs:1862 · .lbf-close:1865 · .lbf-close-l:1866 · .lbf-body:1867
.lbf-grid:1868 · .lbf-cell:1870,1873,1874,1875(+1) · .lbf-podium:1879 · .pod:1881,1908,1909 · .pod-char:1883 · .pod-base:1885
.pod-rank:1887 · .pod-label:1889 · .pod-name:1891 · .pod-sc:1893 · .pod-1:1898,1899 · .pod-2:1900,1901
.pod-3:1902,1903 · .pod-4:1904,1905 · .pod-5:1906,1907 · .pl-wide:1912,1915,1916,1917 · .pl-follow:1918,1923,1925 · .pl-unfollow:1927,1933,1934
.pl-followers:1935 · .pl-cols:1936 · .pl-col:1937 · .pl-sec-title:1938 · .pl-feed:1939,1942,1949 · .pl-feed-row:1943,1947,1948
.pl-assets-wrap:1951 · .pl-assets:1952 · .pl-asset:1955,1959,1966 · .pl-asset-emoji:1960 · .pl-asset-n:1961 · .pl-pets-wrap:1968
.pl-pets:1969 · .pl-pet:1970,1975,1977 · .pl-pet-nm:1978 · .img-lightbox:1981,1986,1987,1991(+3) · .pl-chat:2004,2009 · .pet-peek:2010,2011
.pp-chips:2013 · .pp-chip:2014 · .pp-gift:2019,2025 · .settings-box:2027,2028,2097,2102(+20) · .set-feed-head:2029 · .set-feed-sub:2033
.set-feed-row:2034 · .pillinfo-val:2039 · .pillinfo-desc:2044,2063 · .pillinfo-box:2055 · .plf-head:2058 · .plf-emoji:2059
.plf-ht:2060,2061,2062 · .plf-foot:2064 · .alert-box:2069,2071 · .ab-emoji:2072 · .ab-title:2073 · .ab-desc:2074
.ab-btns:2075,2076,2077 · .heal-heart:2079 · .attn-box:2094 · .help-box:2126,2127,2128 · .wl-box:2149 · .food-box:2150
.home-shop-box:2152 · .summary-box:2153 · .report-box:2154 · .wl-grid:2157 · .tc-wrap:2159 · .spell-btn:2165,2170
.sp-hud:2171 · .sp-word:2173 · .sp-ch:2174,2179 · .sp-th:2181 · .sp-hint:2183 · .sp-exit:2186,2190
.sp-banner:2191 · .sp-big:2196 · .sp-thb:2198 · .sp-coin:2199 · #spell-confetti:2204 · .sp-rb:2205
.sp-day:2215 · .sp-perfect:2217 · .sp-late:2219 · #spell-coinpop:2222 · .side-sub:2331,2333 · .sec-quest:2336
.on-page:2347,2348,2349,2350 · .inbox-overlay:2360 · .ib-box:2362 · .ib-head:2366 · .ib-close:2370,2372 · .ib-list:2373,2374
.ib-row:2375,2376,2377,2378 · .ib-ava:2379 · .ib-on:2383 · .ib-mid:2385 · .ib-name:2386 · .ib-last:2387
.ib-meta:2388 · .ib-time:2389 · .ib-dot:2391 · .ib-story-badge:2394 · .ib-empty:2398 · .ib-story:2400,2402
.ib-story-item:2403,2405,2412 · .ib-story-ava:2406 · .ib-story-on:2410 · .ib-world:2415,2418 · #btn-music:2423,2426,2427 · #ws-overlay:2442
#ws-board:2444,2450,2452 · .ws-head:2454 · .ws-title:2455 · .ws-grade:2457 · .ws-body:2459 · .ws-gridwrap:2460
#ws-grid:2461 · .ws-cell:2465,2469,2471,2479(+1) · .ws-flash:2483,2485 · .ws-coinpop:2489 · .ws-side:2500 · .ws-find:2501
#ws-words:2503,2505 · .ws-word:2506,2510,2512 · #ws-prog:2513 · .ws-actions:2514,2515,2517 · #ws-new:2518 · #ws-stash:2519
#ws-clear:2520 · #ws-win:2521,2523 · .ws-win-in:2524,2527

## css/style.css (1,707 บรรทัด · 454 selector)
:root:5 · *:15 · html:16,21 · input:25 · body:29 · #app:35
.screen:38,39 · h1:42 · .subtitle:43 · .egg-grid:46,63 · .egg-card:47,52,53,54(+2) · .pet-price:57,61
.egg:65,71,75 · .d1:76 · .basket:79,80,85,91(+5) · .basket-dog:89,102,103,104 · .basket-cat:90,105,106,107 · .egg-dragon:110
.topbar:125 · .topbar-coins:126 · .coin-pill:127,138,142,147(+2) · .coin-ic:134 · .no-anim:148,538,1424,1664(+2) · .net-coin:150
.q-row:162,163,164,168(+1) · .q-emoji:165 · .q-mid:166 · .q-name:167 · .q-bar:169,170 · .q-right:172,173
.q-foot:174,175 · .tc-open:178,179 · .tc-wrap:180 · .tc-card:181 · .tc-head:185 · .tc-sub:189
.tc-name:190,191 · .tc-badges:192 · .tc-when:193 · .tc-row:194,198 · .tc-pass:199 · .tc-try:200
.tc-sign:201 · .tc-hint:202 · .tc-close:203 · .mb-seller:209 · .mb-buy:210 · .wl-open:213,218
.strip-wrap:221,239 · .strip-x:222,229,230,242(+1) · .strip-arrow:231,237,238 · .craft-toolbar:245,246 · .fc-cols:248,249 · .wl-box:283
.wl-head:284,285,286 · .wl-grid:288 · .wl-it:293,297,298,299 · .wl-emoji:300 · .wl-name:301 · .wl-h:302
.hq-card:303,384 · .icon-btn:304 · #settings-badge:310 · .badge-pop:313 · .attn-box:315,316,333 · .attn-list:317
.attn-row:318,323 · .attn-ico:324 · .attn-txt:325,326 · .attn-go:327 · .attn-total:328,332 · .rain-banner:336,341,342,343
.rain-row:345 · .rain-icon:346 · .rain-track:347 · .rain-fill:351 · .rain-note:352 · .comp-earn:355,367,371,372(+1)
.comp-earn-label:360 · .comp-earn-num:361,365 · .comp-earn-sub:366 · .farm-sub:378 · .farm-cols:380,381 · .farm-shop:383
.farm-hq:385,386,387 · .farm-yield:388,389 · .farm-tree:390,395,400,404 · .farm-tree-emoji:399 · .farm-tree-name:402 · .farm-tree-status:403
.farm-grow-badge:405 · .farm-sell-btn:426,431 · .farm-sellall-btn:432,438,439 · .rank-card:442 · .rank-badge-wrap:447 · .rank-badge-img:448
.rank-badge-emoji:449 · .rank-body:450 · .rank-name:451,452 · .rank-bar:453 · .rank-fill:454 · .rank-text:455
.rankup-overlay:458 · .rankup-rays:464 · .rankup-content:480 · .rankup-title:485 · .rankup-badge:490,503 · .rankup-badge-img:502
.rankup-name:504 · .rankup-en:508 · .rankup-sub:512 · .rankup-btn:513,520,521 · .cr-btn-row:523 · .rankup-btn-2:524,525
.thunder-fx:528 · .quake:529 · .pet-tabs:541 · .pet-tab:542,548,549 · .pet-card:551 · .pet-stage:556
.aura:557,563 · .sp1:564 · .pet-wrap:567 · .pet-emoji:568 · .pet-img:569 · .egg-img:570
.feed-pet:571,717 · .pet-baby:572 · .pet-adult:573 · .pet-egg-stage:575 · .wear:577 · .wear-head:578
.wear-face:579 · .wear-neck:580 · .pet-name:582 · .stage-label:583 · .level-row:584 · .level-badge:585
.exp-bar:589 · .exp-fill:590 · .exp-text:591 · .ability-box:593,597 · .hunger-bar:600 · .hunger-fill:601,602,603
.food-item:609,651,655,656(+6) · .hunger-text:613 · .heat-bar:616 · .heat-fill:617 · .heat-text:618,619,620 · .care-row:622
.care-btn:623,627,630 · .btn-feed:628 · .btn-cure:629 · .sick-banner:631 · .pet-sick:635 · .pet-asleep:638
.sleep-badge:639 · .btn-sleep:641 · .dinner-btn:644 · .food-box:648,649 · .food-grid:650 · .fav-tag:670
.fd-exp:674 · .food-sec:676 · .food-sec-human:680 · .bad-tag:682 · .fd-toxin:686 · .fd-safe:687
.fq-box:690,691 · .fq-progress:692 · .fq-pair:693,694 · .fq-ask:695 · .fq-why:696 · .fq-btns:700,701,705
.fq-yes:706 · .fq-no:707 · .fq-next:708 · .food-cancel:709 · .feed-box:715,716 · .feed-gain:718
.sick-badge:722 · .big-btn:728,734,955,956(+6) · .shop-card:737 · .shop-title:741 · .shop-grid:742 · .shop-item:743,747,748,749(+4)
.it-tag:754 · .tag-wear:755 · .lock-banner:757 · .home-current:763,768,769 · .home-img:770 · .home-emoji:771
.home-btn:772,794 · .home-layout:774 · .home-pic-col:775,781 · .home-img-big:779 · .home-info-col:782,784,787,788 · .home-name-row:785
.home-desc-row:786 · .home-shop-box:796,797 · .home-list:798 · .home-option:799,803,804,805(+1) · .home-opt-img:806 · .home-opt-body:808,809
.home-price:810 · .reset-link:815 · .login-card:821 · .login-pets:822 · .login-status:823 · .google-btn:824,830,831
.login-note:832 · .install-btn:835,841,842 · .install-guide-overlay:845 · .install-guide:849,853,856 · .install-steps:854,855 · .install-guide-close:857
.login-account:862 · .register-card:865,869,875,879 · .reg-safety:871,873,874 · .student-chip:880 · .clock-chip:884 · .online-count:890
.online-row:897,901,902 · .online-dot:906 · .online-name:911 · .online-act:915 · .online-live:919 · .online-note:923
.lb-empty:926 · .lb-list:927 · .lb-row:928,932,933 · .lb-rank:937 · .lb-name:939,943 · .lb-coins:947
.lb-hint:949 · .lb-badgeline:950 · .lb-tabs:952 · .lb-tab:953,954 · .tinv-note:965 · .cat-card:971,992,1071,1076
.cat-head:975 · .cat-emoji:976 · .cat-name:977 · .cat-pass:978 · .cat-info:979 · .cat-btns:980
.cat-btn:981,985,986,987(+2) · .band-sec-head:990,991 · .band-mine-tag:993 · .bsp-box:996,999 · .bsp-head:1000 · .bsp-prog:1001
.bsp-retake:1003,1006 · .rts-box:1009 · .rts-head:1011 · .rts-sets:1012 · .rts-set:1013,1014,1015 · .rts-sub:1016
.rts-words:1017 · .rts-word:1018,1020,1021 · .rts-foot:1022 · .rts-okbtn:1023,1025 · .bsp-grid:1026 · .bsp-chip:1027,1030,1031,1032(+1)
.bsp-num:1034 · .bsp-best:1035 · .bsp-tick:1036 · .bsp-foot:1037 · .vb-box:1040,1042 · .vb-head:1043
.vb-total:1044 · .vb-quizbtn:1045,1047 · .vb-tabs:1048 · .vb-tab:1049,1051,1052 · .vb-words:1053 · .vb-word:1054,1057,1058,1059(+3)
.vb-empty:1063 · .vb-foot:1064 · .vb-pg:1065,1067 · #vb-pginfo:1068 · .vb-hint:1069 · .band-lock:1077
.offline-btn:1078,1079 · .quiz-progress:1084 · .quiz-phon:1085 · #quiz-extra:1086,1088,1089,1090 · .quiz-word-card:1091 · .quiz-speak:1096
.quiz-choice:1097,1102,1103,1104 · .quiz-score-pill:1105 · .stats-card:1108 · .stats-title:1112,1545 · .stats-row:1113,1114,1115,1116 · .game-top:1119
.back-btn:1120 · .combo-pill:1124 · .timer-wrap:1128 · .timer-fill:1129,1130 · .board-label:1132 · .card-grid:1133
.word-card:1134,1140,1141,1142(+3) · .hint-btn:1148,1153 · .game-endless-note:1156,1161,1163,1167(+6) · .report-btn:1188,1193 · .report-box:1196 · .report-close:1197
.rp-head:1201 · .rp-avatar:1202,1203 · .rp-title:1204 · .rp-sub:1205 · .rp-levelcard:1207 · .rp-level-top:1211
.rp-bar:1212 · .rp-bar-fill:1213 · .rp-level-note:1214,1215 · .rp-grid:1217 · .rp-stat:1218 · .rp-ic:1221
.rp-num:1222 · .rp-lbl:1223 · .rp-section:1225 · .rp-h3:1226 · .rp-badge-mini:1227 · .rp-row:1228,1229,1230
.rp-empty:1231 · .rp-badges:1232 · .rp-badge:1233 · .rp-tline:1236 · .rp-tl-head:1237,1238 · .rp-tl-ems:1239
.rp-em:1240,1241 · .rp-tl-note:1242,1243 · .rp-crown:1245,1246 · .rp-wtitle:1248 · .rp-wnow:1249,1250 · .rp-wgraph:1251
.rp-wcol:1252 · .rp-wval:1253 · .rp-wbar:1254,1255 · .rp-wlbl:1256 · .rp-cheer:1258 · .report-ok:1262
.summary-box:1265,1316,1320,1321(+2) · .sm-burst:1266 · .sm-title:1268 · .sm-line:1269 · .sm-coin:1270 · .sm-matches:1276,1277
.confetti:1279 · .sm-badge:1286 · .sm-badge-all:1290 · .badge-celebrate-overlay:1293,1306 · .badge-celebrate:1297 · .bc-emoji:1303
.bc-title:1304 · .bc-sub:1305 · .sm-cheer:1310 · .sm-streak:1311,1312 · .sm-sick:1313 · .sm-btns:1314
.float-fx:1326 · .toast:1333 · .toast-warn:1340,1347,1348,1354 · .toast-clear-all:1356,1363 · .alert-box:1365 · .alert-ok:1366,1371
.settings-box:1373 · .set-row:1374 · .set-hint:1378 · .set-hint-on:1379 · .set-hint-off:1380 · .set-lwrap:1381
.set-label:1382 · .set-desc:1383 · .set-switch:1384,1388,1389,1394(+4) · .set-sw-knob:1390 · .set-sw-txt:1397 · .set-close:1403,1408
.set-help:1409,1414 · .help-box:1416,1417,1422 · .help-item:1418 · .update-banner:1430,1439,1440 · #update-reload:1441 · #update-dismiss:1445
.levelup-overlay:1451 · .levelup-box:1455,1462,1463,1464(+4) · .bill-box:1470,1474,1475 · .tag-off:1476 · .home-decayed-img:1477 · .home-dark-img:1478
.thirst-fill:1479 · .thirst-text:1480,1481 · .toxin-fill:1484 · .toxin-text:1485,1486 · .detox-btn:1487,1492 · .shape-text:1495,1496,1497,1498(+1)
.avatar-pick:1502 · .avatar-opt:1503,1507,1508,1509 · .avatar-chip-img:1513 · .avatar-chip-blk:1515 · .set-avatar-btns:1516 · .avatar-mini:1517,1521
.set-blk-row:1523 · .set-sub2:1524 · .blk-grid:1526 · .blk-mini:1527,1530,1531,1532 · .game-avatar:1535,1536,1537 · .stats-nick:1546
.ticket-owned:1549,1553 · .collect-sub:1558 · .mkt-tabs:1559 · .mkt-tab:1560,1564 · .mkt-filter:1565 · .mkt-row:1569
.mkt-emoji:1573,1574 · .mkt-info:1575,1576 · .mkt-tier-stars:1577 · .mkt-buy:1578,1583,1584 · .mkt-price-lo:1585 · .mkt-price-hi:1586
.mkt-empty:1587 · .collect-grid:1590 · .collect-cell:1591 · .cc-emoji:1592,1593 · .cc-name:1594 · .cc-count:1595
.cc-list-btn:1596,1600 · .mkt-listhead:1601 · .mkt-listing:1602 · .ml-cancel:1606 · .mkt-sold:1612,1613,1614 · .list-dialog:1621,1622,1627
.list-hint:1626 · .collect-reveal-frame:1630,1637 · .collect-reveal-img:1636 · .collect-reveal-stars:1638 · .craft-box:1641 · .craft-head:1642
.craft-bar:1643 · .craft-fill:1644 · .craft-text:1645 · .craft-btn-row:1646,1647 · .craft-go-btn:1649,1655,1656,1659 · .craft-cancel:1667,1671
.mkt-catalog:1674,1675,1676 · .mkt-pager:1679 · .pg-btn:1680,1684,1685 · .pg-mid:1686 · .pg-dots:1687 · .pg-dot:1688,1689
.order-head:1690 · .order-row:1691,1696,1698,1700 · .order-deliver:1701,1706 · .order-need:1707
