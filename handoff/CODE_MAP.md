# CODE_MAP.md — แผนที่โค้ด:บรรทัด (เจนอัตโนมัติโดย `tools/gen_code_map.py` — **ห้ามแก้มือ** เดี๋ยวโดนเขียนทับ)

> วิธีใช้: หาชื่อฟังก์ชัน/ค่าคงที่/selector ในไฟล์นี้ (Grep หรือกวาดตา) → `Read` ไฟล์จริง `offset=<บรรทัด>` `limit=40`
> css = index `selector:บรรทัดทุกจุดที่ประกาศ` (บั๊ก UI เริ่มหาที่นี่) · เจนใหม่ทุกครั้งที่รัน `python tools/rotate_handoff.py` · อัปเดต: 2026-07-18

## js/adventure3d.js (7,152 บรรทัด · 308 รายการ)
GUIDE_WORDS:20 · RELOCATE_MS:21 · HALF:22 · PLAYER_SPEED:23 · HAUNT_LIVES:24 · HAUNT_IFRAME:25
PICK_DIST:26 · EYE_H:27 · NET_SEND_MS:28 · MODES:31 · SHOOT_GAP_MS:93 · MONSTER_REWARD:94
AD_COUNT:95 · SHOP_ADS:99 · PILOT_TIERS:101 · pilotEmoji:102 · DRONE_R:114 · DRONE_ACCEL:115
DRONE_VMAX:116 · DRONE_CLIMB:117 · DRONE_YAWSP:118 · DRONE_GRAV:119 · CAR_EYE:123 · CAR_ACCEL:124
CAR_BRAKE:125 · CAR_VMAX:126 · CAR_LEGAL_KMH:127 · CAR_FINE_SPEED:128 · CAR_FINE_BELT:129 · CAR_REPAIR_FEE:130
CAR_FINE_SIGNAL:131 · CAR_RAM_FEE:132 · CAR_FINE_RED:133 · CAR_VMAX_OFF:134 · CAR_VREV:135 · CAR_WB:136
CAR_STEER_MAX:137 · HELI_SKID:169 · SOCCER_SHIRTS:179 · BALL_R:184 · GOAL_HW:185 · KICK_SPD_MIN:186
AIM_YAW_SP:187 · SOCCER_TILES:188 · MECHA_EYE:202 · ALIEN_COUNT:203 · MECHA_MAX_HP:204 · MECHA_ATK_RANGE:205
ALIEN_SHOT_SPD:206 · POWERUP_GAP:207 · BOSS_SCALE:208 · COMBO_X2:209 · BOSS_SPECIES:212 · pickBossSpecies:220
WAVE_BASE_GOAL:222 · waveCfg:223 · MECHA_WEAPONS:232 · ATC_REPLIES:261 · ATC_CLOSERS:266 · ATC:271
CHAT_MAX:390 · doneList:397 · wordPool:398 · pickWords:411 · TILE_COLORS:418 · letterTexture:419
emojiTexture:433 · GHOST_IMG_MAX:445 · measureGhostBox:452 · probeGhostImages:465 · whenGhostsReady:477 · ghostTexture:481
ghostScareSrc:486 · AD_STYLES:494 · adBoardTexture:500 · addAdBillboard:539 · ringAds:550 · BUILDING_TINTS:561
buildingFacadeTexture:562 · makePeerSprite:585 · BLOCK_AVATARS:619 · blkGeo:630 · blkMat:631 · blkCyl:632
blkFaceMat:634 · makeBlockFigure:649 · makeBlockCar:689 · blkNameSprite:734 · makeBlockPeer:746 · makeBlockWalkPeer:760
disposeBlockPeer:768 · blkBuildThumbs:773 · blkBuildPicker:791 · pickBlockAvatar:836 · bubbleSprite:859 · showPeerBubble:886
removePeerBubble:894 · concreteTexture:904 · dAddBox:919 · buildAbandoned:926 · makeNameSprite:972 · flatGeom:985
flatGeomUV:994 · buildDriveCity:1004 · SKY_IMG:1290 · applySky:1291 · buildScene:1300 · randPos:1566
randRoadPos:1574 · spawnLetter:1586 · spawnLettersForWord:1617 · ensureCoverage:1619 · relocateLetters:1632 · removeLetter:1657
tryCompleteWords:1666 · completeWord:1680 · spawnMonster:1725 · killMonster:1734 · tickMonsters:1742 · damagePlayer:1764
shoot:1780 · tickShots:1794 · spawnGhost:1820 · GHOST_STYLE:1829 · GHOST_H_DEFAULT:1830 · applyGhostSize:1831
respawnGhost:1840 · tickGhosts:1856 · sessionRecapHtml:1901 · hauntRunSec:1908 · fmtSurv:1909 · hauntSurviveFinish:1910
tickSurvive:1920 · renderHearts:1933 · ghostHit:1942 · caught:1964 · knockedOut:1990 · netReady:2154
netJoin:2158 · sendPos:2171 · sendChat:2198 · toggleChatBox:2212 · onPeerData:2222 · removePeer:2300
netLeave:2312 · tickPeers:2320 · RTC_CFG:2391 · tinvLinked:2392 · partyWord:2399 · syncPartyWord:2412
updateVoiceBtns:2564 · PODIUM_BONUS:2589 · podiumJoin:2591 · podiumLeave:2602 · endRound:2603 · showPodium:2614
tinvCheck:2654 · showBanner:2674 · renderHudTop:2680 · renderHudWords:2685 · renderHudInv:2695 · ddTierFromName:2702
renderBoard:2704 · drawBigMap:2728 · openBigMap:2783 · closeBigMap:2791 · drawMinimap:2796 · loadCarDash:2868
loadCarWheel:2880 · buildDom:2890 · confirmExit:4102 · IS_TOUCH:4121 · bindInput:4122 · movePlayer:4207
tickPlayer:4217 · collideDrone:4258 · tickDrone:4276 · nearMissTick:4356 · showNearMiss:4379 · awardDaredevil:4390
comboCheer:4407 · comboFlash:4423 · driveCell:4432 · nearestStreet:4438 · collideCar:4448 · tlDotY:4479
tlSet:4483 · driveArms:4500 · tlTick:4512 · TL_GREEN:4556 · tlRedDur:4558 · tlightPhase:4559
buildTrafficLights:4566 · rlTick:4618 · cellDrivable:4650 · cellCenter:4651 · losClear:4653 · nearestDrivableCell:4663
routeGrid:4672 · pickGpsTarget:4725 · gpsSpeak:4737 · NAVLINE_W:4756 · navLineEnsure:4757 · navLineHide:4767
navLineUpdate:4768 · tickGps:4795 · tickDrive:4871 · drawCarDial:5049 · drawCarGauges:5079 · RADIO_RECT:5107
CAR_RADIO_RECT:5109 · carRadioRect:5115 · radioLayout:5117 · radioSetHint:5140 · renderRadioList:5146 · radioToggleList:5156
drawRadioViz:5161 · radioTick:5179 · BOBBLE_FOOT:5192 · BOBBLE_H:5193 · BOBBLE_ASPECT:5194 · BOB_OMEGA:5197
BOB_PITCH_FORCE:5199 · BOBBLE_SKINS:5201 · bobbleSetAvatar:5208 · bobbleLayout:5215 · bobbleTick:5228 · bobblePoke:5253
bobbleApplySkin:5270 · dollOwned:5280 · openDollPicker:5281 · carStartShow:5318 · showLawInfo:5336 · lawNotice:5358
driveFineSettle:5368 · heliFloorAt:5544 · tickHeli:5551 · gaugeBezel:5696 · gaugeTicks:5701 · gaugeNeedle:5711
gaugeText:5718 · drawGauges:5724 · soccerLetterPos:6044 · letterNeeded:6048 · soccerNeededSet:6053 · soccerTileGeo:6059
soccerGoldTexture:6061 · makeSoccerTile:6078 · soccerRefreshSkins:6087 · soccerBuildTargets:6094 · soccerRetarget:6103 · soccerCoinPop:6115
soccerFieldTexture:6127 · soccerNetTexture:6138 · soccerCrowdTexture:6145 · soccerBallMat:6153 · buildSoccerGoal:6161 · buildStands:6172
soccerNumTex:6180 · makeSoccerPlayer:6190 · soccerResetBall:6214 · soccerKick:6219 · soccerCheer:6227 · updateSoccerGuide:6228
soccerCamera:6242 · tickSoccer:6257 · soccerKitShow:6333 · soccerKitGo:6348 · emojiSprite:6399 · makeAlien:6404
startWave:6437 · waveSpawnFill:6448 · waveComplete:6457 · updateWaveHud:6467 · checkMechaBossBadge:6469 · alienSpawnPos:6478
removeAlien:6483 · mechaHudWord:6488 · setMechaHudSkin:6496 · mechaComboPop:6508 · mechaShielded:6513 · mechaDamageFx:6515
mechaHitByAlien:6520 · spawnAlienShot:6526 · removeAlienShot:6536 · tickAlienShots:6541 · spawnPowerup:6553 · removePowerup:6566
collectPowerup:6571 · tickPowerups:6578 · updateMechaHud:6587 · mechaTracer:6627 · mechaFire:6636 · explodeAlien:6673
tickMecha:6703 · loop:6759 · clearEntities:6787 · INTRO_KEY:6801 · introSeenObj:6802 · introSeen:6803
markIntroSeen:6804 · INTRO:6805 · showIntro:6870 · closeIntro:6895 · beginPlay:6901 · start:6903
exitWorld:7047 · mechaRecapLine:7082

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

## js/game.js (898 บรรทัด · 50 รายการ)
REPLAY_BONUS_EVERY:23 · REPLAY_BONUS_TIERS:25 · replayBonusFor:26 · SESSION_MILESTONES:32 · addSessionCoins:35 · updateBestTarget:74
weekKeyStr:87 · rolloverWeekBest:93 · exitGame:99 · showSessionSummary:132 · sprinkleConfetti:179 · VOCAB_PER_LEVEL:198
VOCAB_RANK_NAMES:199 · vocabRankName:200 · showProgressReport:202 · THUNDER_MS:365 · THUNDER_TIERS:369 · THUNDER_TIER_UI:370
thunderEmoji:371 · DAREDEVIL_TIERS:375 · DAREDEVIL_TIER_UI:376 · daredevilEmoji:377 · DILIGENT_TIERS:381 · DILIGENT_TIER_UI:382
diligentEmoji:383 · MECHABOSS_TIERS:387 · MECHABOSS_TIER_UI:388 · mechaBossEmoji:389 · badgeSuffix:394 · BADGE_META:405
NAME_BADGE_RE:413 · splitNameBadges:414 · badgeEmojis:420 · badgeScore:425 · checkCrown:431 · currentBadgeScore:447
rolloverBadgeWeek:451 · addDiligent:464 · celebrateBadge:480 · addThunder:494 · startGame:508 · newRound:548
updateTimerBar:587 · updateComboPill:593 · pickCard:597 · checkMatch:609 · renderCats:723 · startQuiz:758
renderQuizQuestion:774 · finishQuiz:833

## js/images.js (101 บรรทัด · 14 รายการ)
IMG_FILES:11 · MOODS:12 · startImgKey:14 · petImageKeys:16 · probeImages:27 · probeRankImages:39
probeCollectImages:40 · probeGiftImages:41 · probeHomeImages:42 · equippedItem:48 · petStateImg:58 · happyNow:72
makeHappy:73 · currentPetImg:84

## js/lobby.js (52 บรรทัด · 3 รายการ)
PANEL_TITLES:9 · openPanel:20 · closePanel:28

## js/lobby3d.js (780 บรรทัด · 0 รายการ)

## js/main.js (158 บรรทัด · 2 รายการ)
syncMusicBtn:79 · bootGame:113

## js/moto3d.js (739 บรรทัด · 35 รายการ)
REWARD:7 · ACCEL:8 · LEAN_MAX:9 · COLLECT_R:10 · SPAWN_MIN:11 · BUCKET:12
TILE_COLORS:13 · CSS:56 · buildDom:141 · segKey:215 · buildRoads:216 · distToSeg:260
roadInfo:265 · onRoad:271 · randomRoadPoint:272 · makeTextSprite:289 · letterTexture:302 · buildScenery:316
scatterTrees:394 · scatterClouds:413 · makeBike:426 · pickWord:487 · spawnLetters:497 · renderWordHud:508
collectTick:514 · completeWord:527 · relocTick:543 · gpsTick:554 · miniTick:562 · build:597
fit:621 · tick:628 · frame:636 · start:675 · exitWorld:710

## js/music.js (136 บรรทัด · 0 รายการ)

## js/online.js (1,102 บรรทัด · 75 รายการ)
ONLINE_STALE_MS:53 · ONLINE_BEAT_MS:54 · LEADERBOARD_SIZE:55 · onlineDisplayName:59 · onlineActivity:67 · ensureOnlineId:83
onlineKey:93 · onlinePushPresence:98 · onlinePushScore:108 · fetchPlayerStats:134 · onlineRerender:156 · notifyFriendBadges:168
FRIEND_ALPHA:194 · friendCode:195 · friendSearch:207 · friendRequest:231 · friendAccept:240 · friendDecline:252
friendsHeal:262 · CHAT_MAX_LEN:286 · CHAT_KEEP:287 · chatPairId:289 · chatRef:292 · chatListen:298
chatSend:314 · chatDeleteMsg:330 · TYPING_TTL:338 · typingRef:340 · chatSetTyping:341 · chatClearTyping:351
chatWatchTyping:359 · chatThemeRef:377 · chatSetTheme:378 · chatWatchTheme:383 · chatPrune:391 · chatSeenTs:408
chatMarkSeen:414 · chatUnreadCount:426 · chatWatchSync:429 · GIFT_EXPIRE_MS:479 · giftSend:482 · giftAccept:494
giftDecline:498 · giftInWatch:504 · giftReclaim:535 · giftOutWatchSync:545 · giftOutRebuild:600 · salesWatch:630
salesRerender:638 · sellInc:642 · marketWatch:650 · marketList:683 · marketUnlist:691 · marketBuy:700
marketSoldWatch:713 · tinvSend:742 · tinvClear:749 · tinvWatch:753 · FEED_MAX:782 · feedEvent:785
feedPrune:796 · feedPurgeCat:807 · feedPushAssets:818 · petDescriptor:836 · feedPushPets:842 · fetchPlayerPets:856
followSet:872 · followUnset:883 · feedRebuild:890 · feedWatchSync:902 · fetchPlayerFeed:929 · fetchPlayerAssets:942
fetchFollowers:961 · onlineStart:970 · onlineLoadSDK:1077

## js/state.js (940 บรรทัด · 83 รายการ)
STORAGE_KEY:6 · CURE_COST:8 · HUNGRY_SICK_MS:9 · MEAL_HOUR:11 · MEAL_FULL:12 · SLEEP_FROM_HOUR:13
SLEEP_SICK_HOUR:14 · WAKE_HOUR:15 · DINNER_COST:16 · TOXIN_FULL:18 · DETOX_COST:19 · FOODQUIZ_Q:21
FOODQUIZ_COIN:22 · FOODQUIZ_BONUS:23 · SHAPE_JUNK_MEALS:25 · SHAPE_CLEAN_MEALS:26 · SHAPE_MISS_MEALS:27 · SHAPE_EXP_BONUS:28
HEAT_SICK_MS:29 · THIRST_SICK_MS:30 · DEFAULT_STATE:32 · FEED_CATS:140 · SLOT_MS:151 · currentSlotStart:152
nextSlotStart:158 · mealDayKey:160 · nightKeyOf:162 · newPet:168 · loadState:192 · saveState:389
activePet:396 · petStage:397 · isAdult:402 · abilityOn:403 · hasPetType:404 · todayStr:407
dailyTick:411 · addCoins:414 · QUEST_POOL:434 · QUEST_PER_DAY:444 · questsToday:445 · questTick:452
questEvent:456 · assetValue:492 · netWorth:517 · assetCount:519 · refreshRank:536 · heatProtected:552
rainProtected:556 · petHungry:559 · petShapeOf:563 · updatePetShape:569 · shapeMealDone:576 · heatPct:586
ymStr:595 · billOutstanding:599 · UTILITIES:606 · HOME_UTILITIES:612 · homeDecayed:614 · billTick:617
myCar:686 · carLoanDue:691 · carLoanOverdue:696 · carLoanPayable:701 · carLoanPay:708 · compTick:721
ONLINE_RATE:735 · onlineEarnActive:736 · onlineEarnTick:740 · onlineEarnFlush:751 · marketTick:761 · addCraft:785
ORDER_MAX:804 · ORDER_LIFE_MS:805 · ORDER_GAP_MIN_MS:806 · ORDER_GAP_SPAN_MS:807 · ORDER_TIER_WEIGHT:808 · newOrder:809
orderTick:822 · careTick:830 · expNeed:911 · addExp:916 · addRP:936

## js/ui.js (6,374 บรรทัด · 245 รายการ)
startHTML:10 · PET_ANIM:30 · petAnimHTML:35 · petVisualHTML:50 · lobbyBlk:81 · caretakerFigureHTML:87
footAlign:97 · heroRankBgHTML:125 · renderNewWord:159 · showNewWordPopup:178 · GIANT_MAX:201 · GIANT_COST:202
GIANT_PET_VH:203 · GIANT_OWNER_VH:204 · GIANT_OWNER_X:205 · GIANT_NAMES:206 · giantLevel:207 · giantUnlocked:211
upgradeGiant:213 · renamePet:236 · resetGiant:252 · mealLabel:263 · fmtMins:270 · renderClock:279
dinnerDue:302 · renderDinnerChip:307 · dinnerClick:318 · renderRainBar:353 · rainFxTick:386 · RAIN_DROP_IMGS:403
rainFxDrop:404 · selfPronoun:434 · selfTag:439 · idTag:443 · SIDE_SCROLL_SPEED:453 · SIDE_SCROLL_RESUME:454
initSideScroll:457 · sideScrollTick:485 · QUEST_FLASH_HOLD:509 · QUEST_DECK_FLIP_MS:516 · questGo:519 · qDeckDraw:528
qDeckNext:551 · renderQuestCard:565 · sideFlashRows:603 · FRIEND_FLASH_GRACE:621 · ONLINE_FLIP_MS:629 · ONLINE_FLIP_RESUME:630
ONLINE_SWIPE_STEP:631 · onPageDraw:635 · onPageFlip:643 · bindOnlinePager:654 · renderOnlineCard:687 · bindInviteCards:799
bindFriendQuickMenu:819 · openFriendQuickMenu:829 · bindLbTabs:891 · renderLeaderboardCard:902 · bindLbGroupOpen:925 · lbRankRows:936
lbDemoRows:963 · lbChar:985 · openLeaderboardFull:994 · BLK_PAD:1058 · seatPodChars:1060 · lbCoinHtml:1070
lbBadgeHtml:1086 · lbBossHtml:1112 · bindPlayerClicks:1138 · showPlayerCard:1148 · petDescImg:1357 · openImgLightbox:1370
openPetPeek:1390 · updateBillBadges:1434 · setBadge:1446 · updateSettingsBadge:1462 · openAttentionSummary:1476 · updateFriendBadge:1518
renderFriendPanel:1528 · friendDoSearch:1576 · refreshFriendData:1600 · CHAT_EMOJI_CATS:1652 · CHAT_THEMES:1674 · CHAT_SECRET_MS:1683
chatBadgeSync:1691 · ibTimeStr:1699 · openChatInbox:1706 · openChat:1809 · giftImg:1996 · giftDateStr:1998
giftItemPic:2005 · giftItemName:2011 · updateGiftBadge:2016 · renderGiftPanel:2025 · acceptGift:2083 · declineGift:2095
showGiftReveal:2104 · openGiftPicker:2130 · confirmSendGift:2198 · doSendGift:2222 · rankBadgeHTML:2246 · renderRankCard:2251
showRankUp:2273 · bindPetPlateButtons:2308 · openPetInfoOverlay:2332 · feedAgo:2355 · renderFeedCard:2368 · alignPetTabs:2421
alignCureBtn:2438 · dictRecordLookup:2462 · DICT_FILE_COUNT:2473 · loadDict:2474 · dictSearch:2489 · dictTapWords:2504
dictEntryHTML:2508 · openDictOverlay:2519 · renderDashboard:2603 · sleepBtnHTML:2995 · sleepHintHTML:3002 · sleepAllPets:3013
wakeAllPets:3026 · feedPet:3037 · openFoodMenu:3051 · feedWith:3122 · AVATAR_UI:3152 · playerAvatarHTML:3155
SHAPE_UI:3161 · showFeedResult:3170 · curePet:3211 · heartsFx:3234 · cureCelebrateFx:3255 · railCureClick:3266
detoxPet:3278 · openFoodQuiz:3301 · renderShop:3381 · homeVisualHTML:3445 · showHomeRuined:3459 · showCutNotice:3480
renderHomeCard:3498 · payMaint:3582 · trashBillUI:3598 · payTrash:3615 · UTILITY_UI:3634 · utilityBillUI:3683
payUtility:3708 · buyUtilityFix:3734 · renderPhoneCard:3752 · buyPhone:3792 · sellPhone:3814 · compLiveTotal:3835
onlineLiveTotal:3846 · renderOnlineEarnPill:3851 · openPillInfo:3874 · renderComputerCard:3921 · buyComputer:3956 · sellComputer:3979
soldCount:4005 · soldBadge:4006 · renderTicketCard:4011 · loadScriptOnce:4067 · enterAdventure3D:4083 · enterHaunted3D:4105
advHealClick:4127 · buyTicket:4147 · renderHauntCard:4173 · buyHauntTicket:4228 · renderHeliCard:4255 · buyHeliTicket:4313
enterHeli3D:4336 · renderDroneCard:4358 · buyDroneTicket:4413 · enterDrone3D:4436 · renderDriveCard:4459 · buyDriveTicket:4532
enterDrive3D:4555 · renderSoccerCard:4588 · buySoccerTicket:4636 · enterSoccer3D:4659 · renderMotoCard:4682 · buyMotoTicket:4731
enterMoto3D:4754 · WORLD3D:4779 · gotoRobotShop:4789 · scrollShopCardIntoView:4794 · railWorldClick:4797 · renderRailWorlds:4818
tinvNoticeHTML:4877 · openTinvPicker:4885 · fruitCountdown:4929 · renderFarmCard:4941 · renderFarmClock:5011 · buyFruit:5027
sellFruit:5047 · sellAllFruit:5064 · collectImg:5090 · renderFactoryCard:5096 · renderMarketCard:5119 · updateWishBadge:5175
openWishlistDialog:5186 · bindStripArrows:5231 · renderMarketBrowse:5243 · carImg:5272 · renderVehicleShop:5273 · CS_CYCLE_MS:5324
carInteriorImg:5325 · carStatHtml:5327 · renderCarShowroom:5334 · csShowBig:5360 · csInit:5387 · RS_CYCLE_MS:5410
robotImg:5411 · renderRobotShop:5412 · rsShowBig:5434 · rsInit:5455 · buyRobot:5474 · enterMecha3D:5496
pickMechaRobot:5517 · pickDriveCar:5549 · openCarBuyDialog:5592 · buyCarInsurance:5653 · payCarLoanMonthly:5672 · payCarLoanFull:5684
carDriveBlock:5703 · gotoVehicleShop:5708 · gotoMyStock:5713 · showNeedCarDialog:5719 · craftDiscount:5731 · renderFactory:5734
renderOrdersUI:5796 · startProduce:5815 · buyCollectible:5843 · cancelProduce:5871 · deliverOrder:5885 · renderOrderClock:5902
renderCollectMine:5912 · openListDialog:5954 · cancelListing:6007 · buyMarketItem:6030 · showCollectReveal:6057 · buyAC:6095
openHomeShop:6114 · renderPetShop:6173 · showLevelUp:6234 · renderStats:6271 · showTeacherCard:6342

## js/util.js (629 บรรทัด · 30 รายการ)
shuffle:6 · fmtNum:15 · escapeHTML:19 · seededRand:25 · fmtThaiDT:35 · fmtThaiDate:39
showScreen:44 · TOAST_WARN_RE:52 · restackToasts:55 · toast:77 · floatFx:97 · beep:107
sirenSynth:134 · playCashier:158 · cashierSynth:172 · playSpark:205 · sparkSynth:219 · thunderFx:254
wordAudioFile:322 · speakWord:325 · speakLetter:345 · pickSpeakVoice:364 · speakWordTTS:375 · askNameDialog:395
askConfirm:435 · alertBox:453 · applyNoAnim:473 · openSettings:478 · openHelp:584 · openTeacherGuide:610

## js/vocabbook.js (190 บรรทัด · 13 รายการ)
VB_MAX:11 · VB_QUIZ_N:12 · VB_QUIZ_MIN:13 · vbGroup:16 · VB_GROUP_UI:21 · vbRecord:24
vbStats:45 · vbList:53 · vbReviewCat:64 · vbStartReview:78 · openVocabBook:89 · vbRender:131
vbCardHTML:177

## js/wordsearch.js (236 บรรทัด · 0 รายการ)

## css/lobby.css (2,381 บรรทัด · 443 selector)
:root:6 · html:15 · body:16 · *:33,34,35,36 · #app:39 · h1:41
.subtitle:42 · .shop-title:43 · #rotate-overlay:46 · .screen:68 · #screen-select:77,78,79,80(+5) · .egg-need:87
.petshop-topright:89 · .petshop-play-link:90,95 · #screen-quiz:134,135,136,137(+4) · #quiz-choices:143,144 · .word-card:151 · .quiz-choice:152,153,154
.big-btn:157,158,159,160 · #screen-dashboard:165,685,693 · .lobby-top:172,600,601,602(+2) · .top-flex:173 · .profile-plate:174,178,521 · #rain-fx:183
.rain-layer:186,192 · .rain-glass:199 · .glass-drop:200 · .rail-btn:215,611,617,618(+13) · .rail-badge:216 · .fr-code-box:221
.fr-code-label:225 · .fr-code-row:226 · .fr-code:227 · .fr-copy-btn:232,236,241,242 · .fr-search-btn:237 · .fr-add-btn:238
.fr-accept:239 · .fr-decline:240 · #fr-search-input:243 · #fr-search-result:247 · .fr-found:248 · .fr-hint:252
.fr-list-title:253 · .fr-row:254 · .fr-req:258 · .fr-row-name:260,264 · .fr-row-status:268 · .fr-req-btns:269
.online-dot:270 · .fr-chat-btn:271,276,278 · .fr-unread:279 · .chat-overlay:286 · .chat-box:290,399,406,413(+12) · .chat-head:302
.chat-theme-btn:307,311 · .chat-secret-tg:312,313 · .cs-switch:314,315,320,321 · .cs-slider:316,318 · .chat-secret-note:322 · .chat-theme-strip:325
.chat-theme-sw:327,330,331,332(+1) · .chat-head-name:334,335 · .chat-close:336 · .chat-msgs:340 · .chat-empty:344 · .chat-typing:346
.ct-dots:348,349,351,352 · .no-anim:354,367,663,734(+22) · .chat-bubble:355,360,365 · .chat-emoji:368 · .chat-emo:372,376 · .chat-input-row:377
.chat-emoji-btn:381 · #chat-input:385 · .chat-send:389,394,395 · .pl-click:462,464,465 · .pl-overlay:466 · .pl-card:470,1759
.pl-close:476 · .pl-head:480 · .pl-grade:485 · .pl-badges:487 · .pl-badge-chip:488,492 · .pl-body:493
.pl-loading:494 · .pl-none:495 · .pl-me-tag:496 · .pl-blk-wrap:498 · .pl-blk:499 · .pl-stat:500
.pl-lbl:505 · .pl-val:506,507 · .pl-tip:508 · .chip-edit:514,519,520 · .rank-mini:526,532,533,534 · .pass-photo:536,541
.pet-tabs:543 · .dict-box:544,548,549,550(+1) · .dict-card:556,561,565,566(+2) · .dict-head:562,563 · .dict-trail:570,574 · .dt-c:575,579,580
.dt-sep:581 · .dict-today:582 · .di-w:584,585,586 · .dict-list:587 · .dict-item:588,592,593,594(+5) · .lobby-mid:608
.lobby-rail:610 · .rail-worlds:628 · .rail-div:629 · .lobby-stage:644,646,690,691 · .newword-banner:652,659 · .nw-tag:660
.nw-word:665 · .nw-hint:667,668 · .nw-box:670,1943 · .nw-pop-word:671 · .nw-speak:672 · .nw-pop-phon:673
.nw-ipa:674 · .nw-pop-sent:675 · .nw-pop-mean:676 · .pet-tab:677,678,679,2268 · .stage-hero:700,715,723,868(+5) · .hero-ground:737,857,863
.hero-rank-bg:739,742,745,749(+18) · #lobby3d-canvas:762,763 · .hero-scene:767,769,776,777(+8) · .caretaker-fig:816 · .caretaker-img:819 · .caretaker-emoji:821
.blk-rig:828,829,830 · .stage-plate:890,898,909,910(+30) · .plate-title:904 · .lobby-side:947,982,987,990(+22) · .side-sec:950,2183 · .side-label:951,956
.side-label-row:958,959 · .lb-tabs-out:960,961,965 · .side-glass:969,976 · .side-card:988,1100 · #quest-card:1000,1024,1025,1026(+6) · .q-bigcard:1001,1030,1031,1034(+1)
.qb-top:1003 · .qb-emoji:1004 · .qb-name:1006 · .qb-bar:1007,1008 · .qb-row:1010 · .qb-prog:1011
.qb-reward:1012 · .qb-go:1013,1017 · .q-dots:1018 · .q-dot:1019,1020,1021 · .q-bonus:1022 · .feed-row:1045,1637,1642
.inv-card:1047,1049,1050 · .inv-btns:1051 · .inv-go:1052,1054 · .inv-x:1055 · #online-card:1059,2191,2192,2193(+1) · .fq-overlay:1060
.fq-box:1062,1999 · .fq-head:1066,1068 · .fq-close:1069 · .fq-sec:1071 · .fq-worlds:1072 · .fq-world:1073,1075
.fq-acts:1076 · .fq-act:1077,1080,1081 · .lobby-bottom:1111,1113 · .lobby-quiz-btn:1114 · .lobby-book-btn:1115,1116 · .lobby-foodquiz-btn:1117,1118
.lobby-play-btn:1119,1123 · .lobby-exam-btn:1125,1126,1128 · .panel-overlay:1133,1138 · .panel-box:1139 · .panel-head:1146,1150 · .panel-close:1151,1156
.panel-body:1157,1161,1162 · .panel-page:1159,1160 · .collect-sub:1166 · .mkt-empty:1167 · .craft-box:1168 · .mkt-listing:1169
.mkt-filter:1170,1492 · .hq-grid:1177 · .hq-card:1178,1183,1207 · .hq-head:1184 · .hq-pic:1190,1192 · .hq-emoji:1194
.hq-badge:1195 · .hq-stars:1199 · .hq-price:1200,1205,1206,1209(+6) · .craft-credit:1213,1215,1216 · .car-grid:1223,1225,1226 · .robot-weap:1227
.dcp-grid:1229 · .dcp-card:1231,1234,1235,1236(+10) · .levelup-box:1253,1900,1901,1996 · .dcp-box:1256,1257,1261,1262(+6) · .dcp-lock:1270 · .sold-badge:1274,1276,1277
.rs-showroom:1279 · .rs-list:1280,1282 · .rs-thumb:1283,1285,1286,1287(+1) · .rs-thumb-pic:1288,1289 · .rs-thumb-price:1290 · .rs-stage:1292
.rs-big:1295 · .rs-big-img:1296 · .rs-elec:1300,1304,1309 · .rs-edge:1310,1316 · .rs-info:1319,1320,1321,1322(+1) · .rs-buy:1324,1326,1327
.cs-showroom:1331 · .cs-list:1332,1334 · .cs-thumb:1335,1337,1338,1339(+1) · .cs-thumb-pic:1340,1341 · .cs-thumb-name:1342 · .cs-thumb-price:1343
.cs-thumb-own:1344 · .cs-stage:1346 · .cs-big:1349 · .cs-big-img:1350 · .cs-elec:1354,1358,1362 · .cs-edge:1363,1369
.cs-interior:1372 · .cs-inr-label:1373,1374 · .cs-inr-img:1375 · .cs-info:1377,1378,1379,1380(+6) · .cs-buy:1388,1390,1391,1392 · .car-emoji:1394
.car-mine:1400 · .car-mine-pic:1405 · .car-mine-info:1406 · .car-loan:1407,1408 · .car-mine-btns:1409,1410,1411 · .car-locked:1413
.car-mine-head:1415 · .car-pick-list:1416,1417 · .car-pick:1418,1420,1421 · .car-pick-pic:1422,1423 · .car-pick-name:1424,1425 · .car-pick-od:1426
.car-buy-box:1428,2003 · .cb-pic:1429,1430,1431 · .cb-lines:1432 · .cb-li:1433,1437,1438 · .cb-ins:1439,1443,1444 · .cb-plan:1445
.cb-pl:1446,1451,1453,1457(+1) · .cb-total:1464 · .cb-btns:1465,1470 · .cb-x:1466 · .shop-grid:1473 · .shop-item:1474,1479,1484,1485(+3)
.mkt-tab:1493,1494 · .pg-btn:1495,1496,1497 · .pg-dot:1498 · .fr-gift-btn:1520,1525 · .gift-sec-title:1528 · .gift-in-row:1530
.gift-out-row:1534 · .gift-in-pic:1535,1537,1538 · .gift-in-info:1539,1540 · .gift-in-btns:1541 · .gift-accept:1542,1546,1548 · .gift-decline:1547
.gift-box-card:1549 · .gift-box-from:1550,1551 · .gift-note:1552 · .gift-pick-overlay:1555 · .gift-pick-box:1559 · .gift-pick-head:1565,1569
.gift-pick-close:1570 · .gift-pick-tabs:1572 · .gp-tab:1573,1577 · .gift-pick-body:1578 · .gp-chips:1579 · .gp-chip:1580,1584
.gp-card:1585,1586 · .gp-price:1587 · .gp-note:1588 · .gift-cf-pic:1589 · .chat-emoji-cats:1594 · .chat-emoji-cat:1598,1602,1603
.chat-emoji-wrap:1604,1605 · .stage-left:1613 · .pet-info-btn:1617,1624,1625 · .feed-list:1632,1636 · .feed-ico:1643 · .feed-txt:1644
.feed-name:1645 · .feed-ago:1646 · .feed-empty:1647,1650 · .pi-overlay:1652 · .pi-box:1656,1661,1662,1666(+2) · .pi-close:1668,1673,1674
.pi-close-left:1676 · .pi-portrait:1678 · .pi-dress-btn:1685,1689,1690 · .pi-shape-cap:1691,1694,1695,1696 · .pi-care-title:1697 · .lbf-overlay:1700
.lbf-box:1703 · .lbf-head:1708 · .lbf-title:1709 · .lbf-tabs:1710 · .lbf-close:1713 · .lbf-close-l:1714
.lbf-body:1715 · .lbf-grid:1716 · .lbf-cell:1718,1721,1722,1723(+1) · .lbf-podium:1727 · .pod:1729,1756,1757 · .pod-char:1731
.pod-base:1733 · .pod-rank:1735 · .pod-label:1737 · .pod-name:1739 · .pod-sc:1741 · .pod-1:1746,1747
.pod-2:1748,1749 · .pod-3:1750,1751 · .pod-4:1752,1753 · .pod-5:1754,1755 · .pl-wide:1760,1763,1764,1765 · .pl-follow:1766,1771,1773
.pl-unfollow:1775,1781,1782 · .pl-followers:1783 · .pl-cols:1784 · .pl-col:1785 · .pl-sec-title:1786 · .pl-feed:1787,1790,1797
.pl-feed-row:1791,1795,1796 · .pl-assets-wrap:1799 · .pl-assets:1800 · .pl-asset:1803,1807,1814 · .pl-asset-emoji:1808 · .pl-asset-n:1809
.pl-pets-wrap:1816 · .pl-pets:1817 · .pl-pet:1818,1823,1825 · .pl-pet-nm:1826 · .img-lightbox:1829,1834,1835,1839(+3) · .pl-chat:1852,1857
.pet-peek:1858,1859 · .pp-chips:1861 · .pp-chip:1862 · .pp-gift:1867,1873 · .settings-box:1875,1876,1945,1950(+20) · .set-feed-head:1877
.set-feed-sub:1881 · .set-feed-row:1882 · .pillinfo-val:1887 · .pillinfo-desc:1892,1911 · .pillinfo-box:1903 · .plf-head:1906
.plf-emoji:1907 · .plf-ht:1908,1909,1910 · .plf-foot:1912 · .alert-box:1917,1919 · .ab-emoji:1920 · .ab-title:1921
.ab-desc:1922 · .ab-btns:1923,1924,1925 · .heal-heart:1927 · .pet-stage:1934 · .attn-box:1942 · .help-box:1974,1975,1976
.wl-box:1997 · .food-box:1998 · .home-shop-box:2000 · .summary-box:2001 · .report-box:2002 · .wl-grid:2005
.tc-wrap:2007 · .spell-btn:2013,2018 · .sp-hud:2019 · .sp-word:2021 · .sp-ch:2022,2027 · .sp-th:2029
.sp-hint:2031 · .sp-exit:2034,2038 · .sp-banner:2039 · .sp-big:2044 · .sp-thb:2046 · .sp-coin:2047
#spell-confetti:2052 · .sp-rb:2053 · .sp-day:2063 · .sp-perfect:2065 · .sp-late:2067 · #spell-coinpop:2070
.side-sub:2179,2181 · .sec-quest:2184 · .on-page:2195,2196,2197,2198 · .inbox-overlay:2208 · .ib-box:2210 · .ib-head:2214
.ib-close:2218,2220 · .ib-list:2221,2222 · .ib-row:2223,2224,2225,2226 · .ib-ava:2227 · .ib-on:2231 · .ib-mid:2233
.ib-name:2234 · .ib-last:2235 · .ib-meta:2236 · .ib-time:2237 · .ib-dot:2239 · .ib-story-badge:2242
.ib-empty:2246 · .ib-story:2248,2250 · .ib-story-item:2251,2253,2260 · .ib-story-ava:2254 · .ib-story-on:2258 · .ib-world:2263,2266
#btn-music:2271,2274,2275 · #ws-overlay:2290 · #ws-board:2292,2298,2300 · .ws-head:2302 · .ws-title:2303 · .ws-grade:2305
.ws-body:2307 · .ws-gridwrap:2308 · #ws-grid:2309 · .ws-cell:2313,2317,2319,2327(+1) · .ws-flash:2331,2333 · .ws-coinpop:2337
.ws-side:2348 · .ws-find:2349 · #ws-words:2351,2353 · .ws-word:2354,2358,2360 · #ws-prog:2361 · .ws-actions:2362,2363,2365
#ws-new:2366 · #ws-stash:2367 · #ws-clear:2368 · #ws-win:2369,2371 · .ws-win-in:2372,2375

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
