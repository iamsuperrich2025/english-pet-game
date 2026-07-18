# CODE_MAP.md — แผนที่โค้ด:บรรทัด (เจนอัตโนมัติโดย `tools/gen_code_map.py` — **ห้ามแก้มือ** เดี๋ยวโดนเขียนทับ)

> วิธีใช้: หาชื่อฟังก์ชัน/ค่าคงที่/selector ในไฟล์นี้ (Grep หรือกวาดตา) → `Read` ไฟล์จริง `offset=<บรรทัด>` `limit=40`
> css = index `selector:บรรทัดทุกจุดที่ประกาศ` (บั๊ก UI เริ่มหาที่นี่) · เจนใหม่ทุกครั้งที่รัน `python tools/rotate_handoff.py` · อัปเดต: 2026-07-18

## js/adventure3d.js (7,537 บรรทัด · 331 รายการ)
GUIDE_WORDS:20 · RELOCATE_MS:21 · HALF:22 · PLAYER_SPEED:23 · HAUNT_LIVES:24 · HAUNT_IFRAME:25
PICK_DIST:26 · EYE_H:27 · NET_SEND_MS:28 · MODES:31 · SHOOT_GAP_MS:93 · MONSTER_REWARD:94
AD_COUNT:95 · SHOP_ADS:99 · PILOT_TIERS:101 · pilotEmoji:102 · DRONE_R:114 · DRONE_ACCEL:115
DRONE_VMAX:116 · DRONE_CLIMB:117 · DRONE_YAWSP:118 · DRONE_GRAV:119 · CAR_EYE:123 · CAR_ACCEL:124
CAR_BRAKE:125 · CAR_VMAX:126 · CAR_LEGAL_KMH:127 · CAR_FINE_SPEED:128 · CAR_FINE_BELT:129 · CAR_REPAIR_FEE:130
CAR_FINE_SIGNAL:131 · CAR_RAM_FEE:132 · CAR_FINE_RED:133 · CAR_VMAX_OFF:134 · CAR_VREV:135 · CAR_WB:136
CAR_STEER_MAX:137 · HELI_SKID:169 · PROP_STALL_MS:172 · PROP_BREAK_SPD:175 · PROP_BROKEN_MUL:176 · BAT_DRAIN:179
BAT_LETTER:180 · BAT_LOW:181 · BAT_EMPTY_MUL:182 · CHG_R:185 · GATE_R:188 · SOCCER_SHIRTS:199
BALL_R:204 · GOAL_HW:205 · KICK_SPD_MIN:206 · AIM_YAW_SP:207 · SOCCER_TILES:208 · MECHA_EYE:222
ALIEN_COUNT:223 · MECHA_MAX_HP:224 · MECHA_ATK_RANGE:225 · ALIEN_SHOT_SPD:226 · POWERUP_GAP:227 · BOSS_SCALE:228
COMBO_X2:229 · BOSS_SPECIES:232 · pickBossSpecies:240 · WAVE_BASE_GOAL:242 · waveCfg:243 · MECHA_WEAPONS:252
ATC_REPLIES:281 · ATC_CLOSERS:286 · ATC:291 · CHAT_MAX:410 · doneList:417 · wordPool:418
pickWords:431 · TILE_COLORS:438 · letterTexture:439 · emojiTexture:453 · GHOST_IMG_MAX:465 · measureGhostBox:472
probeGhostImages:485 · whenGhostsReady:497 · ghostTexture:501 · ghostScareSrc:506 · AD_STYLES:514 · adBoardTexture:520
addAdBillboard:559 · ringAds:570 · BUILDING_TINTS:581 · buildingFacadeTexture:582 · makePeerSprite:605 · BLOCK_AVATARS:639
blkGeo:650 · blkMat:651 · blkCyl:652 · blkFaceMat:654 · makeBlockFigure:669 · makeBlockCar:709
blkNameSprite:754 · makeBlockPeer:766 · makeBlockWalkPeer:780 · disposeBlockPeer:788 · blkBuildThumbs:793 · blkBuildPicker:811
pickBlockAvatar:856 · bubbleSprite:879 · showPeerBubble:906 · removePeerBubble:914 · concreteTexture:924 · brokenWindowTexture:941
chargeIconTexture:957 · rustyDoorTexture:966 · dAddBox:980 · buildAbandoned:987 · makeNameSprite:1052 · flatGeom:1065
flatGeomUV:1074 · buildDriveCity:1084 · SKY_IMG:1370 · applySky:1371 · applyTex:1386 · buildScene:1409
randPos:1705 · randRoadPos:1713 · spawnLetter:1725 · spawnLettersForWord:1756 · ensureCoverage:1758 · relocateLetters:1771
removeLetter:1796 · tryCompleteWords:1805 · completeWord:1819 · spawnMonster:1864 · killMonster:1873 · tickMonsters:1881
damagePlayer:1903 · shoot:1919 · tickShots:1933 · spawnGhost:1959 · GHOST_STYLE:1968 · GHOST_H_DEFAULT:1969
applyGhostSize:1970 · respawnGhost:1979 · tickGhosts:1995 · sessionRecapHtml:2041 · hauntRunSec:2048 · fmtSurv:2049
hauntSurviveFinish:2050 · tickSurvive:2060 · renderHearts:2073 · ghostHit:2082 · caught:2104 · knockedOut:2130
netReady:2294 · netJoin:2298 · sendPos:2311 · sendChat:2338 · toggleChatBox:2352 · onPeerData:2362
removePeer:2440 · netLeave:2452 · tickPeers:2460 · RTC_CFG:2531 · tinvLinked:2532 · partyWord:2539
syncPartyWord:2552 · updateVoiceBtns:2704 · PODIUM_BONUS:2729 · podiumJoin:2731 · podiumLeave:2742 · endRound:2743
showPodium:2754 · tinvCheck:2794 · showBanner:2814 · renderHudTop:2820 · renderHudWords:2825 · renderHudInv:2835
ddTierFromName:2842 · renderBoard:2844 · drawBigMap:2868 · openBigMap:2923 · closeBigMap:2931 · drawMinimap:2936
loadCarDash:3008 · loadCarWheel:3020 · buildDom:3030 · confirmExit:4343 · IS_TOUCH:4362 · bindInput:4363
movePlayer:4448 · tickPlayer:4458 · collideDrone:4499 · propStall:4518 · propBreak:4525 · propFix:4532
droneBatAdd:4539 · raceStartRun:4542 · raceStop:4549 · gateHighlight:4567 · renderRaceHud:4574 · tickDrone:4583
nearMissTick:4707 · showNearMiss:4731 · awardDaredevil:4742 · comboCheer:4759 · comboFlash:4775 · driveCell:4784
nearestStreet:4790 · collideCar:4800 · tlDotY:4831 · tlSet:4835 · driveArms:4852 · tlTick:4864
TL_GREEN:4908 · tlRedDur:4910 · tlightPhase:4911 · buildTrafficLights:4918 · rlTick:4970 · cellDrivable:5002
cellCenter:5003 · losClear:5005 · nearestDrivableCell:5015 · routeGrid:5024 · pickGpsTarget:5077 · gpsSpeak:5089
NAVLINE_W:5108 · navLineEnsure:5109 · navLineHide:5119 · navLineUpdate:5120 · tickGps:5147 · tickDrive:5223
drawCarDial:5401 · drawCarGauges:5431 · RADIO_RECT:5459 · CAR_RADIO_RECT:5461 · carRadioRect:5467 · radioLayout:5469
radioSetHint:5492 · renderRadioList:5498 · radioToggleList:5508 · drawRadioViz:5513 · radioTick:5531 · BOBBLE_FOOT:5544
BOBBLE_H:5545 · BOBBLE_ASPECT:5546 · BOB_OMEGA:5549 · BOB_PITCH_FORCE:5551 · BOBBLE_SKINS:5553 · bobbleSetAvatar:5560
bobbleLayout:5567 · bobbleTick:5580 · bobblePoke:5605 · bobbleApplySkin:5622 · dollOwned:5632 · openDollPicker:5633
carStartShow:5670 · showLawInfo:5688 · lawNotice:5710 · driveFineSettle:5720 · heliFloorAt:5896 · tickHeli:5903
gaugeBezel:6048 · gaugeTicks:6053 · gaugeNeedle:6063 · gaugeText:6070 · drawGauges:6076 · soccerLetterPos:6396
letterNeeded:6400 · soccerNeededSet:6405 · soccerTileGeo:6411 · soccerGoldTexture:6413 · makeSoccerTile:6430 · soccerRefreshSkins:6439
soccerBuildTargets:6446 · soccerRetarget:6455 · soccerCoinPop:6467 · soccerFieldTexture:6479 · soccerNetTexture:6490 · soccerCrowdTexture:6497
soccerBallMat:6505 · buildSoccerGoal:6513 · buildStands:6524 · soccerNumTex:6532 · makeSoccerPlayer:6542 · soccerResetBall:6566
soccerKick:6571 · soccerCheer:6579 · updateSoccerGuide:6580 · soccerCamera:6594 · tickSoccer:6609 · soccerKitShow:6685
soccerKitGo:6700 · emojiSprite:6751 · makeAlien:6756 · startWave:6789 · waveSpawnFill:6800 · waveComplete:6809
updateWaveHud:6819 · checkMechaBossBadge:6821 · alienSpawnPos:6830 · removeAlien:6835 · mechaHudWord:6840 · setMechaHudSkin:6848
mechaComboPop:6860 · mechaShielded:6865 · mechaDamageFx:6867 · mechaHitByAlien:6872 · spawnAlienShot:6878 · removeAlienShot:6888
tickAlienShots:6893 · spawnPowerup:6905 · removePowerup:6918 · collectPowerup:6923 · tickPowerups:6930 · updateMechaHud:6939
mechaTracer:6979 · mechaFire:6988 · explodeAlien:7025 · tickMecha:7055 · loop:7111 · grabShot:7137
savePhoto:7148 · clearEntities:7160 · INTRO_KEY:7174 · introSeenObj:7175 · introSeen:7176 · markIntroSeen:7177
INTRO:7178 · showIntro:7243 · closeIntro:7268 · beginPlay:7274 · start:7276 · exitWorld:7428
mechaRecapLine:7465

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

## js/game.js (918 บรรทัด · 54 รายการ)
REPLAY_BONUS_EVERY:23 · REPLAY_BONUS_TIERS:25 · replayBonusFor:26 · SESSION_MILESTONES:32 · addSessionCoins:35 · updateBestTarget:74
weekKeyStr:87 · rolloverWeekBest:93 · exitGame:99 · showSessionSummary:132 · sprinkleConfetti:179 · VOCAB_PER_LEVEL:198
VOCAB_RANK_NAMES:199 · vocabRankName:200 · showProgressReport:202 · THUNDER_MS:376 · THUNDER_TIERS:380 · THUNDER_TIER_UI:381
thunderEmoji:382 · DAREDEVIL_TIERS:386 · DAREDEVIL_TIER_UI:387 · daredevilEmoji:388 · DILIGENT_TIERS:392 · DILIGENT_TIER_UI:393
diligentEmoji:394 · MECHABOSS_TIERS:398 · MECHABOSS_TIER_UI:399 · mechaBossEmoji:400 · BFF_TIERS:405 · BFF_TIER_UI:406
BFF_COIN:407 · bffEmoji:408 · badgeSuffix:413 · BADGE_META:425 · NAME_BADGE_RE:433 · splitNameBadges:434
badgeEmojis:440 · badgeScore:445 · checkCrown:451 · currentBadgeScore:467 · rolloverBadgeWeek:471 · addDiligent:484
celebrateBadge:500 · addThunder:514 · startGame:528 · newRound:568 · updateTimerBar:607 · updateComboPill:613
pickCard:617 · checkMatch:629 · renderCats:743 · startQuiz:778 · renderQuizQuestion:794 · finishQuiz:853

## js/images.js (101 บรรทัด · 14 รายการ)
IMG_FILES:11 · MOODS:12 · startImgKey:14 · petImageKeys:16 · probeImages:27 · probeRankImages:39
probeCollectImages:40 · probeGiftImages:41 · probeHomeImages:42 · equippedItem:48 · petStateImg:58 · happyNow:72
makeHappy:73 · currentPetImg:84

## js/lobby.js (52 บรรทัด · 3 รายการ)
PANEL_TITLES:9 · openPanel:20 · closePanel:28

## js/lobby3d.js (780 บรรทัด · 0 รายการ)

## js/main.js (158 บรรทัด · 2 รายการ)
syncMusicBtn:79 · bootGame:113

## js/moto3d.js (1,782 บรรทัด · 97 รายการ)
REWARD:7 · ACCEL:8 · DASH_LEN:9 · DOG_HIT_COIN:10 · FEAT_SP:12 · DECAL_N:13
GRAV:14 · SUSP_K:15 · ROAD_WIDE:16 · EDGE_M:17 · ROAD_TEX_S:18 · POST_N:19
LEAN_MAX:20 · COLLECT_R:21 · SPAWN_MIN:22 · BUCKET:23 · TILE_COLORS:24 · LETTER_COIN:26
COIN_VAL:30 · COIN_GAP:31 · COIN_TIERS:33 · COIN_CURVE_RAD:38 · NET_SEND_MS:40 · PEER_COLORS:41
CHAT_MS:43 · CHAT_PRESETS:44 · ENG_FILES:85 · CSS:140 · buildDom:325 · segKey:427
smoothPts:430 · featKey:446 · addFeat:447 · genFeatures:452 · terrainAt:471 · roadGroundY:484
decalTex:492 · makeDecals:511 · decalTick:520 · buildRoads:537 · distToSeg:633 · roadInfo:638
onRoad:644 · randomRoadPoint:645 · makeTextSprite:668 · letterTexture:681 · woodTileMat:696 · muralTexture:707
buildSchool:719 · buildScenery:865 · scatterTrees:944 · postTick:964 · scatterClouds:991 · makeDog:1003
spawnDog:1018 · dogHit:1028 · dogTick:1038 · coinTexture:1056 · makeCoins:1067 · addCoin:1069
clearCoins:1077 · coinTierAt:1080 · coinFx:1090 · grabCoin:1099 · coinTick:1116 · placeSpecialCoin:1124
makeVehicle:1136 · netReady:1171 · netJoin:1175 · netSend:1188 · sendChat:1205 · showPeerBubble:1215
removePeerBubble:1222 · renderBoard:1229 · peerColor:1246 · buildPeer:1250 · onPeer:1259 · dropPeer:1287
netLeave:1294 · peerTick:1300 · spawnSlot:1311 · pickWord:1328 · spawnLetters:1338 · renderWordHud:1353
fitWord:1361 · collectTick:1368 · completeWord:1387 · relocTick:1404 · gpsTick:1419 · miniTick:1428
build:1463 · applyVehicleUi:1497 · fit:1515 · tick:1523 · frame:1531 · start:1674
exitWorld:1725

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

## js/state.js (967 บรรทัด · 83 รายการ)
STORAGE_KEY:6 · CURE_COST:8 · HUNGRY_SICK_MS:9 · MEAL_HOUR:11 · MEAL_FULL:12 · SLEEP_FROM_HOUR:13
SLEEP_SICK_HOUR:14 · WAKE_HOUR:15 · DINNER_COST:16 · TOXIN_FULL:18 · DETOX_COST:19 · FOODQUIZ_Q:21
FOODQUIZ_COIN:22 · FOODQUIZ_BONUS:23 · SHAPE_JUNK_MEALS:25 · SHAPE_CLEAN_MEALS:26 · SHAPE_MISS_MEALS:27 · SHAPE_EXP_BONUS:28
HEAT_SICK_MS:29 · THIRST_SICK_MS:30 · DEFAULT_STATE:32 · FEED_CATS:153 · SLOT_MS:164 · currentSlotStart:165
nextSlotStart:171 · mealDayKey:173 · nightKeyOf:175 · newPet:181 · loadState:206 · saveState:416
activePet:423 · petStage:424 · isAdult:429 · abilityOn:430 · hasPetType:431 · todayStr:434
dailyTick:438 · addCoins:441 · QUEST_POOL:461 · QUEST_PER_DAY:471 · questsToday:472 · questTick:479
questEvent:483 · assetValue:519 · netWorth:544 · assetCount:546 · refreshRank:563 · heatProtected:579
rainProtected:583 · petHungry:586 · petShapeOf:590 · updatePetShape:596 · shapeMealDone:603 · heatPct:613
ymStr:622 · billOutstanding:626 · UTILITIES:633 · HOME_UTILITIES:639 · homeDecayed:641 · billTick:644
myCar:713 · carLoanDue:718 · carLoanOverdue:723 · carLoanPayable:728 · carLoanPay:735 · compTick:748
ONLINE_RATE:762 · onlineEarnActive:763 · onlineEarnTick:767 · onlineEarnFlush:778 · marketTick:788 · addCraft:812
ORDER_MAX:831 · ORDER_LIFE_MS:832 · ORDER_GAP_MIN_MS:833 · ORDER_GAP_SPAN_MS:834 · ORDER_TIER_WEIGHT:835 · newOrder:836
orderTick:849 · careTick:857 · expNeed:938 · addExp:943 · addRP:963

## js/ui.js (6,855 บรรทัด · 276 รายการ)
startHTML:10 · PET_ANIM:30 · petAnimHTML:35 · petVisualHTML:50 · lobbyBlk:81 · caretakerFigureHTML:87
footAlign:97 · heroRankBgHTML:125 · NEW_WORD_MS:159 · newWordNext:165 · renderNewWord:176 · alignNewWord:203
startNewWordTimer:217 · nwCountdownTick:234 · PAT_REMIND_HOUR:249 · patRemindTick:250 · applyPatRemindGlow:271 · NEW_WORD_COIN:286
NW_DAILY_GOAL:287 · NW_DAILY_BONUS:288 · newWordReward:289 · nwDailyTick:312 · coinFlyFx:331 · nwDailyBarHTML:360
showNewWordPopup:371 · GIANT_MAX:400 · GIANT_COST:401 · GIANT_PET_VH:402 · GIANT_OWNER_VH:403 · GIANT_OWNER_X:404
GIANT_NAMES:405 · giantLevel:406 · giantUnlocked:410 · upgradeGiant:412 · renamePet:435 · resetGiant:451
mealLabel:462 · fmtMins:469 · renderClock:478 · dinnerDue:501 · renderDinnerChip:506 · dinnerClick:517
renderRainBar:552 · rainFxTick:585 · RAIN_DROP_IMGS:602 · rainFxDrop:603 · selfPronoun:633 · selfTag:638
idTag:642 · SIDE_SCROLL_SPEED:652 · SIDE_SCROLL_RESUME:653 · initSideScroll:656 · sideScrollTick:684 · QUEST_FLASH_HOLD:708
QUEST_DECK_FLIP_MS:715 · questGo:718 · qDeckDraw:727 · qDeckNext:750 · renderQuestCard:764 · sideFlashRows:802
FRIEND_FLASH_GRACE:820 · ONLINE_FLIP_MS:828 · ONLINE_FLIP_RESUME:829 · ONLINE_SWIPE_STEP:830 · onPageDraw:834 · onPageFlip:842
bindOnlinePager:853 · renderOnlineCard:886 · bindInviteCards:998 · bindFriendQuickMenu:1018 · openFriendQuickMenu:1028 · bindLbTabs:1090
renderLeaderboardCard:1101 · bindLbGroupOpen:1124 · lbRankRows:1135 · lbDemoRows:1162 · lbChar:1184 · openLeaderboardFull:1193
BLK_PAD:1257 · seatPodChars:1259 · lbCoinHtml:1269 · lbBadgeHtml:1285 · lbBossHtml:1311 · bindPlayerClicks:1337
showPlayerCard:1347 · petDescImg:1560 · openImgLightbox:1573 · openPetPeek:1593 · updateBillBadges:1637 · setBadge:1649
updateSettingsBadge:1665 · openAttentionSummary:1679 · updateFriendBadge:1721 · renderFriendPanel:1731 · friendDoSearch:1779 · refreshFriendData:1803
CHAT_EMOJI_CATS:1855 · CHAT_THEMES:1877 · CHAT_SECRET_MS:1886 · chatBadgeSync:1894 · ibTimeStr:1902 · openChatInbox:1909
openChat:2012 · giftImg:2199 · giftDateStr:2201 · GREETS:2209 · GREET_EXP:2217 · greetInfo:2218
openGreetPicker:2222 · giftItemPic:2264 · giftItemName:2272 · updateGiftBadge:2278 · renderGiftPanel:2287 · acceptGift:2345
declineGift:2368 · showGreetReveal:2377 · showGiftReveal:2404 · openGiftPicker:2430 · confirmSendGift:2498 · doSendGift:2522
rankBadgeHTML:2546 · renderRankCard:2551 · showRankUp:2573 · bindPetPlateButtons:2608 · openPetInfoOverlay:2632 · feedAgo:2655
renderFeedCard:2668 · alignPetTabs:2721 · alignCureBtn:2739 · dictRecordLookup:2763 · DICT_FILE_COUNT:2774 · loadDict:2775
dictSearch:2790 · dictTapWords:2805 · dictEntryHTML:2809 · openDictOverlay:2820 · renderDashboard:2904 · sleepBtnHTML:3298
sleepHintHTML:3305 · sleepAllPets:3316 · wakeAllPets:3329 · feedPet:3340 · openFoodMenu:3354 · feedWith:3425
AVATAR_UI:3455 · playerAvatarHTML:3458 · SHAPE_UI:3464 · showFeedResult:3473 · curePet:3514 · heartsFx:3537
PAT_HOLD_MS:3560 · PAT_EXP:3561 · bindPetTap:3562 · petBounce:3580 · petMood:3586 · shortPatPet:3593
longPatPet:3601 · patCalendarHTML:3621 · patStreakTick:3649 · cureCelebrateFx:3675 · railCureClick:3686 · detoxPet:3698
openFoodQuiz:3721 · renderShop:3801 · homeVisualHTML:3865 · showHomeRuined:3879 · showCutNotice:3900 · renderHomeCard:3918
payMaint:4002 · trashBillUI:4018 · payTrash:4035 · UTILITY_UI:4054 · utilityBillUI:4103 · payUtility:4128
buyUtilityFix:4154 · renderPhoneCard:4172 · buyPhone:4212 · sellPhone:4234 · compLiveTotal:4255 · onlineLiveTotal:4266
renderOnlineEarnPill:4271 · openPillInfo:4294 · renderComputerCard:4341 · buyComputer:4376 · sellComputer:4399 · soldCount:4425
soldBadge:4426 · renderTicketCard:4431 · loadScriptOnce:4487 · enterAdventure3D:4503 · enterHaunted3D:4525 · advHealClick:4547
buyTicket:4567 · renderHauntCard:4593 · buyHauntTicket:4648 · renderHeliCard:4675 · buyHeliTicket:4733 · enterHeli3D:4756
renderDroneCard:4778 · buyDroneTicket:4833 · enterDrone3D:4856 · renderDriveCard:4879 · buyDriveTicket:4953 · enterDrive3D:4976
pickDriveMap:5011 · enterMotoMapAsCar:5047 · renderSoccerCard:5069 · buySoccerTicket:5117 · enterSoccer3D:5140 · renderMotoCard:5163
buyMotoTicket:5212 · enterMoto3D:5235 · WORLD3D:5260 · gotoRobotShop:5270 · scrollShopCardIntoView:5275 · railWorldClick:5278
renderRailWorlds:5299 · tinvNoticeHTML:5358 · openTinvPicker:5366 · fruitCountdown:5410 · renderFarmCard:5422 · renderFarmClock:5492
buyFruit:5508 · sellFruit:5528 · sellAllFruit:5545 · collectImg:5571 · renderFactoryCard:5577 · renderMarketCard:5600
updateWishBadge:5656 · openWishlistDialog:5667 · bindStripArrows:5712 · renderMarketBrowse:5724 · carImg:5753 · renderVehicleShop:5754
CS_CYCLE_MS:5805 · carInteriorImg:5806 · carStatHtml:5808 · renderCarShowroom:5815 · csShowBig:5841 · csInit:5868
RS_CYCLE_MS:5891 · robotImg:5892 · renderRobotShop:5893 · rsShowBig:5915 · rsInit:5936 · buyRobot:5955
enterMecha3D:5977 · pickMechaRobot:5998 · pickDriveCar:6030 · openCarBuyDialog:6073 · buyCarInsurance:6134 · payCarLoanMonthly:6153
payCarLoanFull:6165 · carDriveBlock:6184 · gotoVehicleShop:6189 · gotoMyStock:6194 · showNeedCarDialog:6200 · craftDiscount:6212
renderFactory:6215 · renderOrdersUI:6277 · startProduce:6296 · buyCollectible:6324 · cancelProduce:6352 · deliverOrder:6366
renderOrderClock:6383 · renderCollectMine:6393 · openListDialog:6435 · cancelListing:6488 · buyMarketItem:6511 · showCollectReveal:6538
buyAC:6576 · openHomeShop:6595 · renderPetShop:6654 · showLevelUp:6715 · renderStats:6752 · showTeacherCard:6823

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

## css/lobby.css (2,532 บรรทัด · 471 selector)
:root:6 · html:15 · body:16 · *:33,34,35,36 · #app:39 · h1:41
.subtitle:42 · .shop-title:43 · #rotate-overlay:46 · .screen:68 · #screen-select:77,78,79,80(+5) · .egg-need:87
.petshop-topright:89 · .petshop-play-link:90,95 · #screen-quiz:134,135,136,137(+4) · #quiz-choices:143,144 · .word-card:151 · .quiz-choice:152,153,154
.big-btn:157,158,159,160 · #screen-dashboard:165,783,791 · .lobby-top:172,600,601,602(+3) · .top-flex:173 · .profile-plate:174,178,521 · #rain-fx:183
.rain-layer:186,192 · .rain-glass:199 · .glass-drop:200 · .rail-btn:215,611,617,618(+13) · .rail-badge:216 · .fr-code-box:221
.fr-code-label:225 · .fr-code-row:226 · .fr-code:227 · .fr-copy-btn:232,236,241,242 · .fr-search-btn:237 · .fr-add-btn:238
.fr-accept:239 · .fr-decline:240 · #fr-search-input:243 · #fr-search-result:247 · .fr-found:248 · .fr-hint:252
.fr-list-title:253 · .fr-row:254 · .fr-req:258 · .fr-row-name:260,264 · .fr-row-status:268 · .fr-req-btns:269
.online-dot:270 · .fr-chat-btn:271,276,278 · .fr-unread:279 · .chat-overlay:286 · .chat-box:290,399,406,413(+12) · .chat-head:302
.chat-theme-btn:307,311 · .chat-secret-tg:312,313 · .cs-switch:314,315,320,321 · .cs-slider:316,318 · .chat-secret-note:322 · .chat-theme-strip:325
.chat-theme-sw:327,330,331,332(+1) · .chat-head-name:334,335 · .chat-close:336 · .chat-msgs:340 · .chat-empty:344 · .chat-typing:346
.ct-dots:348,349,351,352 · .no-anim:354,367,670,696(+26) · .chat-bubble:355,360,365 · .chat-emoji:368 · .chat-emo:372,376 · .chat-input-row:377
.chat-emoji-btn:381 · #chat-input:385 · .chat-send:389,394,395 · .pl-click:462,464,465 · .pl-overlay:466 · .pl-card:470,1910
.pl-close:476 · .pl-head:480,1819,1822 · .pl-grade:485 · .pl-badges:487 · .pl-badge-chip:488,492 · .pl-body:493
.pl-loading:494 · .pl-none:495 · .pl-me-tag:496 · .pl-blk-wrap:498 · .pl-blk:499 · .pl-stat:500
.pl-lbl:505 · .pl-val:506,507 · .pl-tip:508 · .chip-edit:514,519,520 · .rank-mini:526,532,533,534 · .pass-photo:536,541
.pet-tabs:543 · .dict-box:544,548,549,550(+1) · .dict-card:556,561,565,566(+2) · .dict-head:562,563 · .dict-trail:570,574 · .dt-c:575,579,580
.dt-sep:581 · .dict-today:582 · .di-w:584,585,586 · .dict-list:587 · .dict-item:588,592,593,594(+5) · .lobby-mid:608
.lobby-rail:610 · .rail-worlds:628 · .rail-div:629 · .lobby-stage:644,646,662,788(+1) · .newword-banner:652,659,664 · .coin-fly:675
.coin-plus:683 · .nw-pop-coin:698,700,701 · .nw-pop-goal:704,705,709,713 · .nw-goal-head:706,708,710 · .nw-goal-bar:711 · .nw-goal-fill:712
.nw-pop-book:714,715 · .nw-tag:736 · .nw-word:741 · .nw-hint:743,744 · .nw-coin:746,749 · .nw-countdown:754
.nw-bar:756 · .nw-bar-fill:758 · .pet-stage:761,2085 · .nw-box:768,2094 · .nw-pop-word:769 · .nw-speak:770
.nw-pop-phon:771 · .nw-ipa:772 · .nw-pop-sent:773 · .nw-pop-mean:774 · .pet-tab:775,776,777,2419 · .stage-hero:798,813,821,966(+5)
.hero-ground:835,955,961 · .hero-rank-bg:837,840,843,847(+18) · #lobby3d-canvas:860,861 · .hero-scene:865,867,874,875(+8) · .caretaker-fig:914 · .caretaker-img:917
.caretaker-emoji:919 · .blk-rig:926,927,928 · .stage-plate:988,996,1007,1008(+30) · .plate-title:1002 · .lobby-side:1045,1080,1085,1088(+22) · .side-sec:1048,2334
.side-label:1049,1054 · .side-label-row:1056,1057 · .lb-tabs-out:1058,1059,1063 · .side-glass:1067,1074 · .side-card:1086,1198 · #quest-card:1098,1122,1123,1124(+6)
.q-bigcard:1099,1128,1129,1132(+1) · .qb-top:1101 · .qb-emoji:1102 · .qb-name:1104 · .qb-bar:1105,1106 · .qb-row:1108
.qb-prog:1109 · .qb-reward:1110 · .qb-go:1111,1115 · .q-dots:1116 · .q-dot:1117,1118,1119 · .q-bonus:1120
.feed-row:1143,1757,1762 · .inv-card:1145,1147,1148 · .inv-btns:1149 · .inv-go:1150,1152 · .inv-x:1153 · #online-card:1157,2342,2343,2344(+1)
.fq-overlay:1158 · .fq-box:1160,2150 · .fq-head:1164,1166 · .fq-close:1167 · .fq-sec:1169 · .fq-worlds:1170
.fq-world:1171,1173 · .fq-acts:1174 · .fq-act:1175,1178,1179 · .lobby-bottom:1209,1211 · .lobby-quiz-btn:1212 · .lobby-book-btn:1213,1214
.lobby-foodquiz-btn:1215,1216 · .lobby-play-btn:1217,1221 · .lobby-exam-btn:1223,1224,1226 · .panel-overlay:1231,1236 · .panel-box:1237 · .panel-head:1244,1248
.panel-close:1249,1254 · .panel-body:1255,1259,1260 · .panel-page:1257,1258 · .collect-sub:1264 · .mkt-empty:1265 · .craft-box:1266
.mkt-listing:1267 · .mkt-filter:1268,1612 · .hq-grid:1275 · .hq-card:1276,1281,1305 · .hq-head:1282 · .hq-pic:1288,1290
.hq-emoji:1292 · .hq-badge:1293 · .hq-stars:1297 · .hq-price:1298,1303,1304,1307(+6) · .craft-credit:1311,1313,1314 · .car-grid:1321,1323,1324
.robot-weap:1325 · .dmap-box:1328,1329 · .dmap-grid:1335 · .dmap-card:1337,1340,1341,1342(+2) · .dmap-ico:1344 · .dmap-new:1347
.dcp-grid:1349 · .dcp-card:1351,1354,1355,1356(+10) · .levelup-box:1373,2051,2052,2147 · .dcp-box:1376,1377,1381,1382(+6) · .dcp-lock:1390 · .sold-badge:1394,1396,1397
.rs-showroom:1399 · .rs-list:1400,1402 · .rs-thumb:1403,1405,1406,1407(+1) · .rs-thumb-pic:1408,1409 · .rs-thumb-price:1410 · .rs-stage:1412
.rs-big:1415 · .rs-big-img:1416 · .rs-elec:1420,1424,1429 · .rs-edge:1430,1436 · .rs-info:1439,1440,1441,1442(+1) · .rs-buy:1444,1446,1447
.cs-showroom:1451 · .cs-list:1452,1454 · .cs-thumb:1455,1457,1458,1459(+1) · .cs-thumb-pic:1460,1461 · .cs-thumb-name:1462 · .cs-thumb-price:1463
.cs-thumb-own:1464 · .cs-stage:1466 · .cs-big:1469 · .cs-big-img:1470 · .cs-elec:1474,1478,1482 · .cs-edge:1483,1489
.cs-interior:1492 · .cs-inr-label:1493,1494 · .cs-inr-img:1495 · .cs-info:1497,1498,1499,1500(+6) · .cs-buy:1508,1510,1511,1512 · .car-emoji:1514
.car-mine:1520 · .car-mine-pic:1525 · .car-mine-info:1526 · .car-loan:1527,1528 · .car-mine-btns:1529,1530,1531 · .car-locked:1533
.car-mine-head:1535 · .car-pick-list:1536,1537 · .car-pick:1538,1540,1541 · .car-pick-pic:1542,1543 · .car-pick-name:1544,1545 · .car-pick-od:1546
.car-buy-box:1548,2154 · .cb-pic:1549,1550,1551 · .cb-lines:1552 · .cb-li:1553,1557,1558 · .cb-ins:1559,1563,1564 · .cb-plan:1565
.cb-pl:1566,1571,1573,1577(+1) · .cb-total:1584 · .cb-btns:1585,1590 · .cb-x:1586 · .shop-grid:1593 · .shop-item:1594,1599,1604,1605(+3)
.mkt-tab:1613,1614 · .pg-btn:1615,1616,1617 · .pg-dot:1618 · .fr-gift-btn:1640,1645 · .gift-sec-title:1648 · .gift-in-row:1650
.gift-out-row:1654 · .gift-in-pic:1655,1657,1658 · .gift-in-info:1659,1660 · .gift-in-btns:1661 · .gift-accept:1662,1666,1668 · .gift-decline:1667
.gift-box-card:1669 · .gift-box-from:1670,1671 · .gift-note:1672 · .gift-pick-overlay:1675 · .gift-pick-box:1679 · .gift-pick-head:1685,1689
.gift-pick-close:1690 · .gift-pick-tabs:1692 · .gp-tab:1693,1697 · .gift-pick-body:1698 · .gp-chips:1699 · .gp-chip:1700,1704
.gp-card:1705,1706 · .gp-price:1707 · .gp-note:1708 · .gift-cf-pic:1709 · .chat-emoji-cats:1714 · .chat-emoji-cat:1718,1722,1723
.chat-emoji-wrap:1724,1725 · .stage-left:1733 · .pet-info-btn:1737,1744,1745 · .feed-list:1752,1756 · .feed-ico:1763 · .feed-txt:1764
.feed-name:1765 · .feed-ago:1766 · .feed-empty:1767,1770 · .pi-overlay:1772 · .pi-box:1776,1781,1782,1786(+2) · .pi-close:1788,1793,1794
.pi-close-left:1796 · .pi-portrait:1798 · .pi-dress-btn:1805,1809,1810 · .pi-shape-cap:1811,1814,1815,1816 · .greet-card:1823 · .greet-sub:1824
.greet-grid:1825 · .greet-opt:1826,1829,1830,1831 · .greet-e:1832 · .pi-streak:1836 · .pi-streak-head:1838,1840 · .pi-streak-best:1841
.pi-dots:1842 · .pi-dot:1844,1845,1846 · .pi-streak-note:1847 · .pi-care-title:1848 · .lbf-overlay:1851 · .lbf-box:1854
.lbf-head:1859 · .lbf-title:1860 · .lbf-tabs:1861 · .lbf-close:1864 · .lbf-close-l:1865 · .lbf-body:1866
.lbf-grid:1867 · .lbf-cell:1869,1872,1873,1874(+1) · .lbf-podium:1878 · .pod:1880,1907,1908 · .pod-char:1882 · .pod-base:1884
.pod-rank:1886 · .pod-label:1888 · .pod-name:1890 · .pod-sc:1892 · .pod-1:1897,1898 · .pod-2:1899,1900
.pod-3:1901,1902 · .pod-4:1903,1904 · .pod-5:1905,1906 · .pl-wide:1911,1914,1915,1916 · .pl-follow:1917,1922,1924 · .pl-unfollow:1926,1932,1933
.pl-followers:1934 · .pl-cols:1935 · .pl-col:1936 · .pl-sec-title:1937 · .pl-feed:1938,1941,1948 · .pl-feed-row:1942,1946,1947
.pl-assets-wrap:1950 · .pl-assets:1951 · .pl-asset:1954,1958,1965 · .pl-asset-emoji:1959 · .pl-asset-n:1960 · .pl-pets-wrap:1967
.pl-pets:1968 · .pl-pet:1969,1974,1976 · .pl-pet-nm:1977 · .img-lightbox:1980,1985,1986,1990(+3) · .pl-chat:2003,2008 · .pet-peek:2009,2010
.pp-chips:2012 · .pp-chip:2013 · .pp-gift:2018,2024 · .settings-box:2026,2027,2096,2101(+20) · .set-feed-head:2028 · .set-feed-sub:2032
.set-feed-row:2033 · .pillinfo-val:2038 · .pillinfo-desc:2043,2062 · .pillinfo-box:2054 · .plf-head:2057 · .plf-emoji:2058
.plf-ht:2059,2060,2061 · .plf-foot:2063 · .alert-box:2068,2070 · .ab-emoji:2071 · .ab-title:2072 · .ab-desc:2073
.ab-btns:2074,2075,2076 · .heal-heart:2078 · .attn-box:2093 · .help-box:2125,2126,2127 · .wl-box:2148 · .food-box:2149
.home-shop-box:2151 · .summary-box:2152 · .report-box:2153 · .wl-grid:2156 · .tc-wrap:2158 · .spell-btn:2164,2169
.sp-hud:2170 · .sp-word:2172 · .sp-ch:2173,2178 · .sp-th:2180 · .sp-hint:2182 · .sp-exit:2185,2189
.sp-banner:2190 · .sp-big:2195 · .sp-thb:2197 · .sp-coin:2198 · #spell-confetti:2203 · .sp-rb:2204
.sp-day:2214 · .sp-perfect:2216 · .sp-late:2218 · #spell-coinpop:2221 · .side-sub:2330,2332 · .sec-quest:2335
.on-page:2346,2347,2348,2349 · .inbox-overlay:2359 · .ib-box:2361 · .ib-head:2365 · .ib-close:2369,2371 · .ib-list:2372,2373
.ib-row:2374,2375,2376,2377 · .ib-ava:2378 · .ib-on:2382 · .ib-mid:2384 · .ib-name:2385 · .ib-last:2386
.ib-meta:2387 · .ib-time:2388 · .ib-dot:2390 · .ib-story-badge:2393 · .ib-empty:2397 · .ib-story:2399,2401
.ib-story-item:2402,2404,2411 · .ib-story-ava:2405 · .ib-story-on:2409 · .ib-world:2414,2417 · #btn-music:2422,2425,2426 · #ws-overlay:2441
#ws-board:2443,2449,2451 · .ws-head:2453 · .ws-title:2454 · .ws-grade:2456 · .ws-body:2458 · .ws-gridwrap:2459
#ws-grid:2460 · .ws-cell:2464,2468,2470,2478(+1) · .ws-flash:2482,2484 · .ws-coinpop:2488 · .ws-side:2499 · .ws-find:2500
#ws-words:2502,2504 · .ws-word:2505,2509,2511 · #ws-prog:2512 · .ws-actions:2513,2514,2516 · #ws-new:2517 · #ws-stash:2518
#ws-clear:2519 · #ws-win:2520,2522 · .ws-win-in:2523,2526

## css/style.css (1,701 บรรทัด · 453 selector)
:root:5 · *:15 · html:16,21 · input:25 · body:29 · #app:35
.screen:38,39 · h1:42 · .subtitle:43 · .egg-grid:46,63 · .egg-card:47,52,53,54(+2) · .pet-price:57,61
.egg:65,71,75 · .d1:76 · .basket:79,80,85,91(+5) · .basket-dog:89,102,103,104 · .basket-cat:90,105,106,107 · .egg-dragon:110
.topbar:125 · .topbar-coins:126 · .coin-pill:127,132,136,141(+2) · .no-anim:142,532,1418,1658(+2) · .net-coin:144 · .q-row:156,157,158,162(+1)
.q-emoji:159 · .q-mid:160 · .q-name:161 · .q-bar:163,164 · .q-right:166,167 · .q-foot:168,169
.tc-open:172,173 · .tc-wrap:174 · .tc-card:175 · .tc-head:179 · .tc-sub:183 · .tc-name:184,185
.tc-badges:186 · .tc-when:187 · .tc-row:188,192 · .tc-pass:193 · .tc-try:194 · .tc-sign:195
.tc-hint:196 · .tc-close:197 · .mb-seller:203 · .mb-buy:204 · .wl-open:207,212 · .strip-wrap:215,233
.strip-x:216,223,224,236(+1) · .strip-arrow:225,231,232 · .craft-toolbar:239,240 · .fc-cols:242,243 · .wl-box:277 · .wl-head:278,279,280
.wl-grid:282 · .wl-it:287,291,292,293 · .wl-emoji:294 · .wl-name:295 · .wl-h:296 · .hq-card:297,378
.icon-btn:298 · #settings-badge:304 · .badge-pop:307 · .attn-box:309,310,327 · .attn-list:311 · .attn-row:312,317
.attn-ico:318 · .attn-txt:319,320 · .attn-go:321 · .attn-total:322,326 · .rain-banner:330,335,336,337 · .rain-row:339
.rain-icon:340 · .rain-track:341 · .rain-fill:345 · .rain-note:346 · .comp-earn:349,361,365,366(+1) · .comp-earn-label:354
.comp-earn-num:355,359 · .comp-earn-sub:360 · .farm-sub:372 · .farm-cols:374,375 · .farm-shop:377 · .farm-hq:379,380,381
.farm-yield:382,383 · .farm-tree:384,389,394,398 · .farm-tree-emoji:393 · .farm-tree-name:396 · .farm-tree-status:397 · .farm-grow-badge:399
.farm-sell-btn:420,425 · .farm-sellall-btn:426,432,433 · .rank-card:436 · .rank-badge-wrap:441 · .rank-badge-img:442 · .rank-badge-emoji:443
.rank-body:444 · .rank-name:445,446 · .rank-bar:447 · .rank-fill:448 · .rank-text:449 · .rankup-overlay:452
.rankup-rays:458 · .rankup-content:474 · .rankup-title:479 · .rankup-badge:484,497 · .rankup-badge-img:496 · .rankup-name:498
.rankup-en:502 · .rankup-sub:506 · .rankup-btn:507,514,515 · .cr-btn-row:517 · .rankup-btn-2:518,519 · .thunder-fx:522
.quake:523 · .pet-tabs:535 · .pet-tab:536,542,543 · .pet-card:545 · .pet-stage:550 · .aura:551,557
.sp1:558 · .pet-wrap:561 · .pet-emoji:562 · .pet-img:563 · .egg-img:564 · .feed-pet:565,711
.pet-baby:566 · .pet-adult:567 · .pet-egg-stage:569 · .wear:571 · .wear-head:572 · .wear-face:573
.wear-neck:574 · .pet-name:576 · .stage-label:577 · .level-row:578 · .level-badge:579 · .exp-bar:583
.exp-fill:584 · .exp-text:585 · .ability-box:587,591 · .hunger-bar:594 · .hunger-fill:595,596,597 · .food-item:603,645,649,650(+6)
.hunger-text:607 · .heat-bar:610 · .heat-fill:611 · .heat-text:612,613,614 · .care-row:616 · .care-btn:617,621,624
.btn-feed:622 · .btn-cure:623 · .sick-banner:625 · .pet-sick:629 · .pet-asleep:632 · .sleep-badge:633
.btn-sleep:635 · .dinner-btn:638 · .food-box:642,643 · .food-grid:644 · .fav-tag:664 · .fd-exp:668
.food-sec:670 · .food-sec-human:674 · .bad-tag:676 · .fd-toxin:680 · .fd-safe:681 · .fq-box:684,685
.fq-progress:686 · .fq-pair:687,688 · .fq-ask:689 · .fq-why:690 · .fq-btns:694,695,699 · .fq-yes:700
.fq-no:701 · .fq-next:702 · .food-cancel:703 · .feed-box:709,710 · .feed-gain:712 · .sick-badge:716
.big-btn:722,728,949,950(+6) · .shop-card:731 · .shop-title:735 · .shop-grid:736 · .shop-item:737,741,742,743(+4) · .it-tag:748
.tag-wear:749 · .lock-banner:751 · .home-current:757,762,763 · .home-img:764 · .home-emoji:765 · .home-btn:766,788
.home-layout:768 · .home-pic-col:769,775 · .home-img-big:773 · .home-info-col:776,778,781,782 · .home-name-row:779 · .home-desc-row:780
.home-shop-box:790,791 · .home-list:792 · .home-option:793,797,798,799(+1) · .home-opt-img:800 · .home-opt-body:802,803 · .home-price:804
.reset-link:809 · .login-card:815 · .login-pets:816 · .login-status:817 · .google-btn:818,824,825 · .login-note:826
.install-btn:829,835,836 · .install-guide-overlay:839 · .install-guide:843,847,850 · .install-steps:848,849 · .install-guide-close:851 · .login-account:856
.register-card:859,863,869,873 · .reg-safety:865,867,868 · .student-chip:874 · .clock-chip:878 · .online-count:884 · .online-row:891,895,896
.online-dot:900 · .online-name:905 · .online-act:909 · .online-live:913 · .online-note:917 · .lb-empty:920
.lb-list:921 · .lb-row:922,926,927 · .lb-rank:931 · .lb-name:933,937 · .lb-coins:941 · .lb-hint:943
.lb-badgeline:944 · .lb-tabs:946 · .lb-tab:947,948 · .tinv-note:959 · .cat-card:965,986,1065,1070 · .cat-head:969
.cat-emoji:970 · .cat-name:971 · .cat-pass:972 · .cat-info:973 · .cat-btns:974 · .cat-btn:975,979,980,981(+2)
.band-sec-head:984,985 · .band-mine-tag:987 · .bsp-box:990,993 · .bsp-head:994 · .bsp-prog:995 · .bsp-retake:997,1000
.rts-box:1003 · .rts-head:1005 · .rts-sets:1006 · .rts-set:1007,1008,1009 · .rts-sub:1010 · .rts-words:1011
.rts-word:1012,1014,1015 · .rts-foot:1016 · .rts-okbtn:1017,1019 · .bsp-grid:1020 · .bsp-chip:1021,1024,1025,1026(+1) · .bsp-num:1028
.bsp-best:1029 · .bsp-tick:1030 · .bsp-foot:1031 · .vb-box:1034,1036 · .vb-head:1037 · .vb-total:1038
.vb-quizbtn:1039,1041 · .vb-tabs:1042 · .vb-tab:1043,1045,1046 · .vb-words:1047 · .vb-word:1048,1051,1052,1053(+3) · .vb-empty:1057
.vb-foot:1058 · .vb-pg:1059,1061 · #vb-pginfo:1062 · .vb-hint:1063 · .band-lock:1071 · .offline-btn:1072,1073
.quiz-progress:1078 · .quiz-phon:1079 · #quiz-extra:1080,1082,1083,1084 · .quiz-word-card:1085 · .quiz-speak:1090 · .quiz-choice:1091,1096,1097,1098
.quiz-score-pill:1099 · .stats-card:1102 · .stats-title:1106,1539 · .stats-row:1107,1108,1109,1110 · .game-top:1113 · .back-btn:1114
.combo-pill:1118 · .timer-wrap:1122 · .timer-fill:1123,1124 · .board-label:1126 · .card-grid:1127 · .word-card:1128,1134,1135,1136(+3)
.hint-btn:1142,1147 · .game-endless-note:1150,1155,1157,1161(+6) · .report-btn:1182,1187 · .report-box:1190 · .report-close:1191 · .rp-head:1195
.rp-avatar:1196,1197 · .rp-title:1198 · .rp-sub:1199 · .rp-levelcard:1201 · .rp-level-top:1205 · .rp-bar:1206
.rp-bar-fill:1207 · .rp-level-note:1208,1209 · .rp-grid:1211 · .rp-stat:1212 · .rp-ic:1215 · .rp-num:1216
.rp-lbl:1217 · .rp-section:1219 · .rp-h3:1220 · .rp-badge-mini:1221 · .rp-row:1222,1223,1224 · .rp-empty:1225
.rp-badges:1226 · .rp-badge:1227 · .rp-tline:1230 · .rp-tl-head:1231,1232 · .rp-tl-ems:1233 · .rp-em:1234,1235
.rp-tl-note:1236,1237 · .rp-crown:1239,1240 · .rp-wtitle:1242 · .rp-wnow:1243,1244 · .rp-wgraph:1245 · .rp-wcol:1246
.rp-wval:1247 · .rp-wbar:1248,1249 · .rp-wlbl:1250 · .rp-cheer:1252 · .report-ok:1256 · .summary-box:1259,1310,1314,1315(+2)
.sm-burst:1260 · .sm-title:1262 · .sm-line:1263 · .sm-coin:1264 · .sm-matches:1270,1271 · .confetti:1273
.sm-badge:1280 · .sm-badge-all:1284 · .badge-celebrate-overlay:1287,1300 · .badge-celebrate:1291 · .bc-emoji:1297 · .bc-title:1298
.bc-sub:1299 · .sm-cheer:1304 · .sm-streak:1305,1306 · .sm-sick:1307 · .sm-btns:1308 · .float-fx:1320
.toast:1327 · .toast-warn:1334,1341,1342,1348 · .toast-clear-all:1350,1357 · .alert-box:1359 · .alert-ok:1360,1365 · .settings-box:1367
.set-row:1368 · .set-hint:1372 · .set-hint-on:1373 · .set-hint-off:1374 · .set-lwrap:1375 · .set-label:1376
.set-desc:1377 · .set-switch:1378,1382,1383,1388(+4) · .set-sw-knob:1384 · .set-sw-txt:1391 · .set-close:1397,1402 · .set-help:1403,1408
.help-box:1410,1411,1416 · .help-item:1412 · .update-banner:1424,1433,1434 · #update-reload:1435 · #update-dismiss:1439 · .levelup-overlay:1445
.levelup-box:1449,1456,1457,1458(+4) · .bill-box:1464,1468,1469 · .tag-off:1470 · .home-decayed-img:1471 · .home-dark-img:1472 · .thirst-fill:1473
.thirst-text:1474,1475 · .toxin-fill:1478 · .toxin-text:1479,1480 · .detox-btn:1481,1486 · .shape-text:1489,1490,1491,1492(+1) · .avatar-pick:1496
.avatar-opt:1497,1501,1502,1503 · .avatar-chip-img:1507 · .avatar-chip-blk:1509 · .set-avatar-btns:1510 · .avatar-mini:1511,1515 · .set-blk-row:1517
.set-sub2:1518 · .blk-grid:1520 · .blk-mini:1521,1524,1525,1526 · .game-avatar:1529,1530,1531 · .stats-nick:1540 · .ticket-owned:1543,1547
.collect-sub:1552 · .mkt-tabs:1553 · .mkt-tab:1554,1558 · .mkt-filter:1559 · .mkt-row:1563 · .mkt-emoji:1567,1568
.mkt-info:1569,1570 · .mkt-tier-stars:1571 · .mkt-buy:1572,1577,1578 · .mkt-price-lo:1579 · .mkt-price-hi:1580 · .mkt-empty:1581
.collect-grid:1584 · .collect-cell:1585 · .cc-emoji:1586,1587 · .cc-name:1588 · .cc-count:1589 · .cc-list-btn:1590,1594
.mkt-listhead:1595 · .mkt-listing:1596 · .ml-cancel:1600 · .mkt-sold:1606,1607,1608 · .list-dialog:1615,1616,1621 · .list-hint:1620
.collect-reveal-frame:1624,1631 · .collect-reveal-img:1630 · .collect-reveal-stars:1632 · .craft-box:1635 · .craft-head:1636 · .craft-bar:1637
.craft-fill:1638 · .craft-text:1639 · .craft-btn-row:1640,1641 · .craft-go-btn:1643,1649,1650,1653 · .craft-cancel:1661,1665 · .mkt-catalog:1668,1669,1670
.mkt-pager:1673 · .pg-btn:1674,1678,1679 · .pg-mid:1680 · .pg-dots:1681 · .pg-dot:1682,1683 · .order-head:1684
.order-row:1685,1690,1692,1694 · .order-deliver:1695,1700 · .order-need:1701
