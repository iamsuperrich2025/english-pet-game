# CODE_MAP.md — แผนที่โค้ด:บรรทัด (เจนอัตโนมัติโดย `tools/gen_code_map.py` — **ห้ามแก้มือ** เดี๋ยวโดนเขียนทับ)

> วิธีใช้: หาชื่อฟังก์ชัน/ค่าคงที่/selector ในไฟล์นี้ (Grep หรือกวาดตา) → `Read` ไฟล์จริง `offset=<บรรทัด>` `limit=40`
> css = index `selector:บรรทัดทุกจุดที่ประกาศ` (บั๊ก UI เริ่มหาที่นี่) · เจนใหม่ทุกครั้งที่รัน `python tools/rotate_handoff.py` · อัปเดต: 2026-07-17

## js/adventure3d.js (7,092 บรรทัด · 304 รายการ)
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
flatGeomUV:994 · buildDriveCity:1004 · SKY_IMG:1279 · applySky:1280 · buildScene:1289 · randPos:1555
randRoadPos:1563 · spawnLetter:1575 · spawnLettersForWord:1606 · ensureCoverage:1608 · relocateLetters:1621 · removeLetter:1646
tryCompleteWords:1655 · completeWord:1669 · spawnMonster:1713 · killMonster:1722 · tickMonsters:1730 · damagePlayer:1752
shoot:1768 · tickShots:1782 · spawnGhost:1808 · GHOST_STYLE:1817 · GHOST_H_DEFAULT:1818 · applyGhostSize:1819
respawnGhost:1828 · tickGhosts:1844 · sessionRecapHtml:1889 · hauntRunSec:1896 · fmtSurv:1897 · hauntSurviveFinish:1898
tickSurvive:1908 · renderHearts:1921 · ghostHit:1930 · caught:1952 · knockedOut:1978 · netReady:2142
netJoin:2146 · sendPos:2159 · sendChat:2186 · toggleChatBox:2200 · onPeerData:2210 · removePeer:2288
netLeave:2300 · tickPeers:2308 · RTC_CFG:2379 · tinvLinked:2380 · partyWord:2387 · syncPartyWord:2400
updateVoiceBtns:2552 · PODIUM_BONUS:2577 · podiumJoin:2579 · podiumLeave:2590 · endRound:2591 · showPodium:2602
tinvCheck:2642 · showBanner:2662 · renderHudTop:2668 · renderHudWords:2673 · renderHudInv:2683 · ddTierFromName:2690
renderBoard:2692 · drawBigMap:2716 · openBigMap:2771 · closeBigMap:2779 · drawMinimap:2784 · loadCarDash:2856
loadCarWheel:2868 · buildDom:2878 · confirmExit:4088 · IS_TOUCH:4107 · bindInput:4108 · movePlayer:4193
tickPlayer:4203 · collideDrone:4244 · tickDrone:4262 · nearMissTick:4342 · showNearMiss:4365 · awardDaredevil:4376
comboCheer:4393 · comboFlash:4409 · driveCell:4418 · nearestStreet:4424 · collideCar:4434 · tlDotY:4465
tlSet:4469 · driveArms:4486 · tlTick:4498 · TL_GREEN:4542 · tlRedDur:4544 · tlightPhase:4545
buildTrafficLights:4552 · rlTick:4604 · cellDrivable:4635 · cellCenter:4636 · losClear:4638 · nearestDrivableCell:4648
routeGrid:4657 · pickGpsTarget:4710 · gpsSpeak:4722 · tickGps:4737 · tickDrive:4813 · drawCarDial:4991
drawCarGauges:5021 · RADIO_RECT:5048 · CAR_RADIO_RECT:5050 · carRadioRect:5056 · radioLayout:5058 · radioSetHint:5081
renderRadioList:5087 · radioToggleList:5097 · drawRadioViz:5102 · radioTick:5120 · BOBBLE_FOOT:5133 · BOBBLE_H:5134
BOBBLE_ASPECT:5135 · BOB_OMEGA:5138 · BOB_PITCH_FORCE:5140 · BOBBLE_SKINS:5142 · bobbleSetAvatar:5149 · bobbleLayout:5156
bobbleTick:5169 · bobblePoke:5194 · bobbleApplySkin:5211 · dollOwned:5221 · openDollPicker:5222 · carStartShow:5259
showLawInfo:5277 · lawNotice:5299 · driveFineSettle:5309 · heliFloorAt:5485 · tickHeli:5492 · gaugeBezel:5637
gaugeTicks:5642 · gaugeNeedle:5652 · gaugeText:5659 · drawGauges:5665 · soccerLetterPos:5985 · letterNeeded:5989
soccerNeededSet:5994 · soccerTileGeo:6000 · soccerGoldTexture:6002 · makeSoccerTile:6019 · soccerRefreshSkins:6028 · soccerBuildTargets:6035
soccerRetarget:6044 · soccerCoinPop:6056 · soccerFieldTexture:6068 · soccerNetTexture:6079 · soccerCrowdTexture:6086 · soccerBallMat:6094
buildSoccerGoal:6102 · buildStands:6113 · soccerNumTex:6121 · makeSoccerPlayer:6131 · soccerResetBall:6155 · soccerKick:6160
soccerCheer:6168 · updateSoccerGuide:6169 · soccerCamera:6183 · tickSoccer:6198 · soccerKitShow:6274 · soccerKitGo:6289
emojiSprite:6340 · makeAlien:6345 · startWave:6378 · waveSpawnFill:6389 · waveComplete:6398 · updateWaveHud:6408
checkMechaBossBadge:6410 · alienSpawnPos:6419 · removeAlien:6424 · mechaHudWord:6429 · setMechaHudSkin:6437 · mechaComboPop:6449
mechaShielded:6454 · mechaDamageFx:6456 · mechaHitByAlien:6461 · spawnAlienShot:6467 · removeAlienShot:6477 · tickAlienShots:6482
spawnPowerup:6494 · removePowerup:6507 · collectPowerup:6512 · tickPowerups:6519 · updateMechaHud:6528 · mechaTracer:6568
mechaFire:6577 · explodeAlien:6614 · tickMecha:6643 · loop:6699 · clearEntities:6727 · INTRO_KEY:6741
introSeenObj:6742 · introSeen:6743 · markIntroSeen:6744 · INTRO:6745 · showIntro:6810 · closeIntro:6835
beginPlay:6841 · start:6843 · exitWorld:6987 · mechaRecapLine:7022

## js/auth.js (335 บรรทัด · 29 รายการ)
AUTH_PUSH_MS:23 · AUTH_SDK_TIMEOUT_MS:24 · TEACHER_EMAILS:28 · isTeacher:29 · TESTER_EMAILS:42 · TESTER_COINS:43
isTester:44 · testerBoost:48 · authSetStatus:74 · authShowLogin:83 · authGateOffline:87 · authSaveRef:94
authFetchCloud:95 · authWriteCloud:96 · authDeleteCloud:97 · authWriteProfileName:98 · authPushProfile:105 · authApplyProfileName:113
authAskProfileName:129 · authEditProfileName:140 · authStart:151 · authLoginClick:168 · authOnLogin:187 · authSyncOnLogin:200
authFreshStart:229 · authAskLink:238 · authEnterGame:288 · authPushSave:303 · authLogout:314

## js/game.js (831 บรรทัด · 50 รายการ)
REPLAY_BONUS_EVERY:23 · REPLAY_BONUS_TIERS:25 · replayBonusFor:26 · SESSION_MILESTONES:32 · addSessionCoins:35 · updateBestTarget:74
weekKeyStr:87 · rolloverWeekBest:93 · exitGame:99 · showSessionSummary:132 · sprinkleConfetti:179 · VOCAB_PER_LEVEL:198
VOCAB_RANK_NAMES:199 · vocabRankName:200 · showProgressReport:202 · THUNDER_MS:346 · THUNDER_TIERS:350 · THUNDER_TIER_UI:351
thunderEmoji:352 · DAREDEVIL_TIERS:356 · DAREDEVIL_TIER_UI:357 · daredevilEmoji:358 · DILIGENT_TIERS:362 · DILIGENT_TIER_UI:363
diligentEmoji:364 · MECHABOSS_TIERS:368 · MECHABOSS_TIER_UI:369 · mechaBossEmoji:370 · badgeSuffix:375 · BADGE_META:386
NAME_BADGE_RE:394 · splitNameBadges:395 · badgeEmojis:401 · badgeScore:406 · checkCrown:412 · currentBadgeScore:428
rolloverBadgeWeek:432 · addDiligent:445 · celebrateBadge:461 · addThunder:475 · startGame:489 · newRound:524
updateTimerBar:563 · updateComboPill:569 · pickCard:573 · checkMatch:585 · renderCats:695 · startQuiz:728
renderQuizQuestion:739 · finishQuiz:777

## js/images.js (101 บรรทัด · 14 รายการ)
IMG_FILES:11 · MOODS:12 · startImgKey:14 · petImageKeys:16 · probeImages:27 · probeRankImages:39
probeCollectImages:40 · probeGiftImages:41 · probeHomeImages:42 · equippedItem:48 · petStateImg:58 · happyNow:72
makeHappy:73 · currentPetImg:84

## js/lobby.js (51 บรรทัด · 3 รายการ)
PANEL_TITLES:9 · openPanel:20 · closePanel:28

## js/lobby3d.js (780 บรรทัด · 0 รายการ)

## js/main.js (152 บรรทัด · 2 รายการ)
syncMusicBtn:73 · bootGame:107

## js/music.js (136 บรรทัด · 0 รายการ)

## js/online.js (1,089 บรรทัด · 74 รายการ)
ONLINE_STALE_MS:52 · ONLINE_BEAT_MS:53 · LEADERBOARD_SIZE:54 · onlineDisplayName:58 · onlineActivity:66 · ensureOnlineId:82
onlineKey:92 · onlinePushPresence:97 · onlinePushScore:107 · fetchPlayerStats:133 · onlineRerender:155 · notifyFriendBadges:167
FRIEND_ALPHA:193 · friendCode:194 · friendSearch:206 · friendRequest:230 · friendAccept:239 · friendDecline:251
friendsHeal:261 · CHAT_MAX_LEN:285 · CHAT_KEEP:286 · chatPairId:288 · chatRef:291 · chatListen:297
chatSend:313 · chatDeleteMsg:329 · TYPING_TTL:337 · typingRef:339 · chatSetTyping:340 · chatClearTyping:350
chatWatchTyping:358 · chatThemeRef:376 · chatSetTheme:377 · chatWatchTheme:382 · chatPrune:390 · chatSeenTs:407
chatMarkSeen:413 · chatUnreadCount:425 · chatWatchSync:428 · GIFT_EXPIRE_MS:478 · giftSend:481 · giftAccept:493
giftDecline:497 · giftInWatch:503 · giftReclaim:534 · giftOutWatchSync:544 · giftOutRebuild:599 · salesWatch:629
salesRerender:637 · sellInc:641 · marketWatch:649 · marketList:682 · marketUnlist:690 · marketBuy:699
marketSoldWatch:712 · tinvSend:741 · tinvClear:748 · tinvWatch:752 · FEED_MAX:781 · feedEvent:784
feedPrune:795 · feedPurgeCat:806 · feedPushAssets:817 · petDescriptor:835 · feedPushPets:841 · fetchPlayerPets:855
followSet:871 · followUnset:882 · feedRebuild:889 · feedWatchSync:901 · fetchPlayerFeed:928 · fetchPlayerAssets:941
fetchFollowers:960 · onlineStart:969

## js/state.js (937 บรรทัด · 83 รายการ)
STORAGE_KEY:6 · CURE_COST:8 · HUNGRY_SICK_MS:9 · MEAL_HOUR:11 · MEAL_FULL:12 · SLEEP_FROM_HOUR:13
SLEEP_SICK_HOUR:14 · WAKE_HOUR:15 · DINNER_COST:16 · TOXIN_FULL:18 · DETOX_COST:19 · FOODQUIZ_Q:21
FOODQUIZ_COIN:22 · FOODQUIZ_BONUS:23 · SHAPE_JUNK_MEALS:25 · SHAPE_CLEAN_MEALS:26 · SHAPE_MISS_MEALS:27 · SHAPE_EXP_BONUS:28
HEAT_SICK_MS:29 · THIRST_SICK_MS:30 · DEFAULT_STATE:32 · FEED_CATS:139 · SLOT_MS:150 · currentSlotStart:151
nextSlotStart:157 · mealDayKey:159 · nightKeyOf:161 · newPet:167 · loadState:191 · saveState:388
activePet:395 · petStage:396 · isAdult:401 · abilityOn:402 · hasPetType:403 · todayStr:406
dailyTick:410 · addCoins:413 · QUEST_POOL:433 · QUEST_PER_DAY:441 · questsToday:442 · questTick:449
questEvent:453 · assetValue:489 · netWorth:514 · assetCount:516 · refreshRank:533 · heatProtected:549
rainProtected:553 · petHungry:556 · petShapeOf:560 · updatePetShape:566 · shapeMealDone:573 · heatPct:583
ymStr:592 · billOutstanding:596 · UTILITIES:603 · HOME_UTILITIES:609 · homeDecayed:611 · billTick:614
myCar:683 · carLoanDue:688 · carLoanOverdue:693 · carLoanPayable:698 · carLoanPay:705 · compTick:718
ONLINE_RATE:732 · onlineEarnActive:733 · onlineEarnTick:737 · onlineEarnFlush:748 · marketTick:758 · addCraft:782
ORDER_MAX:801 · ORDER_LIFE_MS:802 · ORDER_GAP_MIN_MS:803 · ORDER_GAP_SPAN_MS:804 · ORDER_TIER_WEIGHT:805 · newOrder:806
orderTick:819 · careTick:827 · expNeed:908 · addExp:913 · addRP:933

## js/ui.js (6,063 บรรทัด · 237 รายการ)
FACTORY_PAGE_SIZE:10 · startHTML:13 · PET_ANIM:33 · petAnimHTML:38 · petVisualHTML:53 · lobbyBlk:84
caretakerFigureHTML:90 · footAlign:100 · heroRankBgHTML:128 · renderNewWord:162 · showNewWordPopup:181 · GIANT_MAX:204
GIANT_COST:205 · GIANT_PET_VH:206 · GIANT_OWNER_VH:207 · GIANT_OWNER_X:208 · GIANT_NAMES:209 · giantLevel:210
giantUnlocked:214 · upgradeGiant:216 · renamePet:239 · resetGiant:255 · mealLabel:266 · fmtMins:273
renderClock:282 · dinnerDue:305 · renderDinnerChip:310 · dinnerClick:321 · renderRainBar:356 · rainFxTick:389
RAIN_DROP_IMGS:406 · rainFxDrop:407 · selfPronoun:437 · selfTag:442 · idTag:446 · SIDE_SCROLL_SPEED:456
SIDE_SCROLL_RESUME:457 · initSideScroll:460 · sideScrollTick:488 · QUEST_FLASH_HOLD:512 · QUEST_DECK_FLIP_MS:519 · questGo:522
qDeckDraw:531 · qDeckNext:554 · renderQuestCard:568 · sideFlashRows:606 · FRIEND_FLASH_GRACE:624 · ONLINE_FLIP_MS:632
ONLINE_FLIP_RESUME:633 · ONLINE_SWIPE_STEP:634 · onPageDraw:638 · onPageFlip:646 · bindOnlinePager:657 · renderOnlineCard:690
bindInviteCards:802 · bindFriendQuickMenu:822 · openFriendQuickMenu:832 · bindLbTabs:894 · renderLeaderboardCard:905 · bindLbGroupOpen:928
lbRankRows:939 · lbDemoRows:966 · lbChar:988 · openLeaderboardFull:997 · BLK_PAD:1061 · seatPodChars:1063
lbCoinHtml:1073 · lbBadgeHtml:1089 · lbBossHtml:1115 · bindPlayerClicks:1141 · showPlayerCard:1151 · petDescImg:1344
openImgLightbox:1357 · updateBillBadges:1379 · setBadge:1391 · updateSettingsBadge:1407 · openAttentionSummary:1421 · updateFriendBadge:1463
renderFriendPanel:1473 · friendDoSearch:1521 · refreshFriendData:1545 · CHAT_EMOJI_CATS:1597 · CHAT_THEMES:1619 · CHAT_SECRET_MS:1628
chatBadgeSync:1636 · ibTimeStr:1644 · openChatInbox:1651 · openChat:1738 · giftImg:1925 · giftDateStr:1927
giftItemPic:1934 · giftItemName:1940 · updateGiftBadge:1945 · renderGiftPanel:1954 · acceptGift:2012 · declineGift:2024
showGiftReveal:2033 · openGiftPicker:2059 · confirmSendGift:2127 · doSendGift:2151 · rankBadgeHTML:2175 · renderRankCard:2180
showRankUp:2202 · bindPetPlateButtons:2237 · openPetInfoOverlay:2254 · feedAgo:2277 · renderFeedCard:2290 · alignPetTabs:2343
alignCureBtn:2360 · DICT_FILE_COUNT:2382 · loadDict:2383 · dictSearch:2398 · dictEntryHTML:2411 · openDictOverlay:2422
renderDashboard:2454 · sleepBtnHTML:2835 · sleepHintHTML:2842 · sleepAllPets:2853 · wakeAllPets:2866 · feedPet:2877
openFoodMenu:2890 · feedWith:2961 · AVATAR_UI:2991 · playerAvatarHTML:2994 · SHAPE_UI:3000 · showFeedResult:3009
curePet:3045 · railCureClick:3068 · detoxPet:3080 · openFoodQuiz:3103 · renderShop:3183 · homeVisualHTML:3243
showHomeRuined:3257 · showCutNotice:3278 · renderHomeCard:3296 · payMaint:3380 · trashBillUI:3396 · payTrash:3413
UTILITY_UI:3432 · utilityBillUI:3481 · payUtility:3506 · buyUtilityFix:3532 · renderPhoneCard:3550 · buyPhone:3590
sellPhone:3612 · compLiveTotal:3633 · onlineLiveTotal:3644 · renderOnlineEarnPill:3649 · openPillInfo:3672 · renderComputerCard:3712
buyComputer:3747 · sellComputer:3770 · soldCount:3796 · soldBadge:3797 · renderTicketCard:3802 · loadScriptOnce:3858
enterAdventure3D:3874 · enterHaunted3D:3896 · advHealClick:3918 · buyTicket:3938 · renderHauntCard:3964 · buyHauntTicket:4019
renderHeliCard:4046 · buyHeliTicket:4104 · enterHeli3D:4127 · renderDroneCard:4149 · buyDroneTicket:4204 · enterDrone3D:4227
renderDriveCard:4250 · buyDriveTicket:4323 · enterDrive3D:4346 · renderSoccerCard:4379 · buySoccerTicket:4427 · enterSoccer3D:4450
WORLD3D:4474 · gotoRobotShop:4483 · scrollShopCardIntoView:4488 · railWorldClick:4491 · renderRailWorlds:4512 · tinvNoticeHTML:4571
openTinvPicker:4579 · fruitCountdown:4623 · renderFarmCard:4635 · renderFarmClock:4696 · buyFruit:4712 · sellFruit:4732
sellAllFruit:4749 · collectImg:4775 · renderFactoryCard:4781 · renderMarketCard:4828 · updateWishBadge:4883 · openWishlistDialog:4894
renderMarketBrowse:4931 · carImg:4960 · renderVehicleShop:4961 · CS_CYCLE_MS:5012 · carInteriorImg:5013 · carStatHtml:5015
renderCarShowroom:5022 · csShowBig:5048 · csInit:5075 · RS_CYCLE_MS:5098 · robotImg:5099 · renderRobotShop:5100
rsShowBig:5122 · rsInit:5143 · buyRobot:5162 · enterMecha3D:5184 · pickMechaRobot:5205 · pickDriveCar:5237
openCarBuyDialog:5278 · buyCarInsurance:5339 · payCarLoanMonthly:5358 · payCarLoanFull:5370 · carDriveBlock:5389 · gotoVehicleShop:5394
gotoMyStock:5399 · showNeedCarDialog:5405 · craftDiscount:5417 · renderFactory:5420 · renderOrdersUI:5487 · startProduce:5506
buyCollectible:5534 · cancelProduce:5562 · deliverOrder:5576 · renderOrderClock:5593 · renderCollectMine:5603 · openListDialog:5645
cancelListing:5698 · buyMarketItem:5721 · showCollectReveal:5748 · buyAC:5784 · openHomeShop:5803 · renderPetShop:5862
showLevelUp:5923 · renderStats:5960 · showTeacherCard:6031

## js/util.js (576 บรรทัด · 28 รายการ)
shuffle:6 · fmtNum:15 · escapeHTML:19 · seededRand:25 · fmtThaiDT:35 · fmtThaiDate:39
showScreen:44 · TOAST_WARN_RE:52 · restackToasts:55 · toast:77 · floatFx:97 · beep:107
sirenSynth:133 · playSpark:157 · sparkSynth:171 · thunderFx:206 · wordAudioFile:274 · speakWord:277
speakLetter:297 · pickSpeakVoice:316 · speakWordTTS:327 · askNameDialog:347 · askConfirm:387 · alertBox:404
applyNoAnim:420 · openSettings:425 · openHelp:531 · openTeacherGuide:557

## js/wordsearch.js (235 บรรทัด · 0 รายการ)

## css/lobby.css (2,256 บรรทัด · 419 selector)
:root:6 · html:15 · body:16 · *:33,34,35,36 · #app:39 · h1:41
.subtitle:42 · .shop-title:43 · #rotate-overlay:46 · .screen:68 · #screen-select:77,78,79,80(+5) · .egg-need:87
.petshop-topright:89 · .petshop-play-link:90,95 · .word-card:133 · .quiz-choice:134,135,136 · .big-btn:139,140,141,142 · #screen-dashboard:147,651,659
.lobby-top:154,559,560,561(+2) · .top-flex:155 · .profile-plate:156,160,503 · #rain-fx:165 · .rain-layer:168,174 · .rain-glass:181
.glass-drop:182 · .rail-btn:197,570,576,577(+13) · .rail-badge:198 · .fr-code-box:203 · .fr-code-label:207 · .fr-code-row:208
.fr-code:209 · .fr-copy-btn:214,218,223,224 · .fr-search-btn:219 · .fr-add-btn:220 · .fr-accept:221 · .fr-decline:222
#fr-search-input:225 · #fr-search-result:229 · .fr-found:230 · .fr-hint:234 · .fr-list-title:235 · .fr-row:236
.fr-req:240 · .fr-row-name:242,246 · .fr-row-status:250 · .fr-req-btns:251 · .online-dot:252 · .fr-chat-btn:253,258,260
.fr-unread:261 · .chat-overlay:268 · .chat-box:272,381,388,395(+12) · .chat-head:284 · .chat-theme-btn:289,293 · .chat-secret-tg:294,295
.cs-switch:296,297,302,303 · .cs-slider:298,300 · .chat-secret-note:304 · .chat-theme-strip:307 · .chat-theme-sw:309,312,313,314(+1) · .chat-head-name:316,317
.chat-close:318 · .chat-msgs:322 · .chat-empty:326 · .chat-typing:328 · .ct-dots:330,331,333,334 · .no-anim:336,349,629,700(+22)
.chat-bubble:337,342,347 · .chat-emoji:350 · .chat-emo:354,358 · .chat-input-row:359 · .chat-emoji-btn:363 · #chat-input:367
.chat-send:371,376,377 · .pl-click:444,446,447 · .pl-overlay:448 · .pl-card:452,1682 · .pl-close:458 · .pl-head:462
.pl-grade:467 · .pl-badges:469 · .pl-badge-chip:470,474 · .pl-body:475 · .pl-loading:476 · .pl-none:477
.pl-me-tag:478 · .pl-blk-wrap:480 · .pl-blk:481 · .pl-stat:482 · .pl-lbl:487 · .pl-val:488,489
.pl-tip:490 · .chip-edit:496,501,502 · .rank-mini:508,514,515,516 · .pass-photo:518,523 · .pet-tabs:525 · .dict-box:526,530,531,532(+1)
.dict-card:538,543 · .dict-head:544,545 · .dict-list:546 · .dict-item:547,551,552,553(+5) · .lobby-mid:567 · .lobby-rail:569
.rail-worlds:587 · .rail-div:588 · .lobby-stage:603,612,656,657 · .lobby-bottom:605,610,1077,1078 · .newword-banner:618,625 · .nw-tag:626
.nw-word:631 · .nw-hint:633,634 · .nw-box:636,1819 · .nw-pop-word:637 · .nw-speak:638 · .nw-pop-phon:639
.nw-ipa:640 · .nw-pop-sent:641 · .nw-pop-mean:642 · .pet-tab:643,644,645,2143 · .stage-hero:666,681,689,834(+5) · .hero-ground:703,823,829
.hero-rank-bg:705,708,711,715(+18) · #lobby3d-canvas:728,729 · .hero-scene:733,735,742,743(+8) · .caretaker-fig:782 · .caretaker-img:785 · .caretaker-emoji:787
.blk-rig:794,795,796 · .stage-plate:856,864,875,876(+30) · .plate-title:870 · .lobby-side:913,948,953,956(+22) · .side-sec:916,2058 · .side-label:917,922
.side-label-row:924,925 · .lb-tabs-out:926,927,931 · .side-glass:935,942 · .side-card:954,1066 · #quest-card:966,990,991,992(+6) · .q-bigcard:967,996,997,1000(+1)
.qb-top:969 · .qb-emoji:970 · .qb-name:972 · .qb-bar:973,974 · .qb-row:976 · .qb-prog:977
.qb-reward:978 · .qb-go:979,983 · .q-dots:984 · .q-dot:985,986,987 · .q-bonus:988 · .feed-row:1011,1573,1578
.inv-card:1013,1015,1016 · .inv-btns:1017 · .inv-go:1018,1020 · .inv-x:1021 · #online-card:1025,2066,2067,2068(+1) · .fq-overlay:1026
.fq-box:1028,1874 · .fq-head:1032,1034 · .fq-close:1035 · .fq-sec:1037 · .fq-worlds:1038 · .fq-world:1039,1041
.fq-acts:1042 · .fq-act:1043,1046,1047 · .lobby-quiz-btn:1079 · .lobby-foodquiz-btn:1080,1081 · .lobby-play-btn:1082,1086 · .panel-overlay:1091,1096
.panel-box:1097 · .panel-head:1104,1108 · .panel-close:1109,1114 · .panel-body:1115,1118,1119 · .panel-page:1116,1117 · .collect-sub:1123
.mkt-empty:1124 · .craft-box:1125 · .mkt-listing:1126 · .mkt-filter:1127,1430 · .hq-grid:1134 · .hq-card:1135,1140,1164
.hq-head:1141 · .hq-pic:1147,1149 · .hq-emoji:1151 · .hq-badge:1152 · .hq-stars:1156 · .hq-price:1157,1162,1163,1166(+6)
.craft-credit:1170,1172,1173 · .car-grid:1180,1182,1183 · .robot-weap:1184 · .dcp-grid:1186 · .dcp-card:1188,1191,1192,1193(+10) · .dcp-lock:1208
.sold-badge:1212,1214,1215 · .rs-showroom:1217 · .rs-list:1218,1220 · .rs-thumb:1221,1223,1224,1225(+1) · .rs-thumb-pic:1226,1227 · .rs-thumb-price:1228
.rs-stage:1230 · .rs-big:1233 · .rs-big-img:1234 · .rs-elec:1238,1242,1247 · .rs-edge:1248,1254 · .rs-info:1257,1258,1259,1260(+1)
.rs-buy:1262,1264,1265 · .cs-showroom:1269 · .cs-list:1270,1272 · .cs-thumb:1273,1275,1276,1277(+1) · .cs-thumb-pic:1278,1279 · .cs-thumb-name:1280
.cs-thumb-price:1281 · .cs-thumb-own:1282 · .cs-stage:1284 · .cs-big:1287 · .cs-big-img:1288 · .cs-elec:1292,1296,1300
.cs-edge:1301,1307 · .cs-interior:1310 · .cs-inr-label:1311,1312 · .cs-inr-img:1313 · .cs-info:1315,1316,1317,1318(+6) · .cs-buy:1326,1328,1329,1330
.car-emoji:1332 · .car-mine:1338 · .car-mine-pic:1343 · .car-mine-info:1344 · .car-loan:1345,1346 · .car-mine-btns:1347,1348,1349
.car-locked:1351 · .car-mine-head:1353 · .car-pick-list:1354,1355 · .car-pick:1356,1358,1359 · .car-pick-pic:1360,1361 · .car-pick-name:1362,1363
.car-pick-od:1364 · .car-buy-box:1366,1878 · .cb-pic:1367,1368,1369 · .cb-lines:1370 · .cb-li:1371,1375,1376 · .cb-ins:1377,1381,1382
.cb-plan:1383 · .cb-pl:1384,1389,1391,1395(+1) · .cb-total:1402 · .cb-btns:1403,1408 · .cb-x:1404 · .shop-grid:1411
.shop-item:1412,1417,1422,1423(+3) · .mkt-tab:1431,1432 · .pg-btn:1433,1434,1435 · .pg-dot:1436 · .fr-gift-btn:1456,1461 · .gift-sec-title:1464
.gift-in-row:1466 · .gift-out-row:1470 · .gift-in-pic:1471,1473,1474 · .gift-in-info:1475,1476 · .gift-in-btns:1477 · .gift-accept:1478,1482,1484
.gift-decline:1483 · .gift-box-card:1485 · .gift-box-from:1486,1487 · .gift-note:1488 · .gift-pick-overlay:1491 · .gift-pick-box:1495
.gift-pick-head:1501,1505 · .gift-pick-close:1506 · .gift-pick-tabs:1508 · .gp-tab:1509,1513 · .gift-pick-body:1514 · .gp-chips:1515
.gp-chip:1516,1520 · .gp-card:1521,1522 · .gp-price:1523 · .gp-note:1524 · .gift-cf-pic:1525 · .chat-emoji-cats:1530
.chat-emoji-cat:1534,1538,1539 · .chat-emoji-wrap:1540,1541 · .stage-left:1549 · .pet-info-btn:1553,1560,1561 · .feed-list:1568,1572 · .feed-ico:1579
.feed-txt:1580 · .feed-name:1581 · .feed-ago:1582 · .feed-empty:1583,1586 · .pi-overlay:1588 · .pi-box:1592,1597,1598,1602(+2)
.pi-close:1604,1609,1610 · .pi-close-left:1612 · .pi-portrait:1614 · .pi-care-title:1620 · .lbf-overlay:1623 · .lbf-box:1626
.lbf-head:1631 · .lbf-title:1632 · .lbf-tabs:1633 · .lbf-close:1636 · .lbf-close-l:1637 · .lbf-body:1638
.lbf-grid:1639 · .lbf-cell:1641,1644,1645,1646(+1) · .lbf-podium:1650 · .pod:1652,1679,1680 · .pod-char:1654 · .pod-base:1656
.pod-rank:1658 · .pod-label:1660 · .pod-name:1662 · .pod-sc:1664 · .pod-1:1669,1670 · .pod-2:1671,1672
.pod-3:1673,1674 · .pod-4:1675,1676 · .pod-5:1677,1678 · .pl-wide:1683,1686,1687,1688 · .pl-follow:1689,1694,1696 · .pl-unfollow:1698,1704,1705
.pl-followers:1706 · .pl-cols:1707 · .pl-col:1708 · .pl-sec-title:1709 · .pl-feed:1710,1713,1720 · .pl-feed-row:1714,1718,1719
.pl-assets-wrap:1722 · .pl-assets:1723 · .pl-asset:1726,1730,1737 · .pl-asset-emoji:1731 · .pl-asset-n:1732 · .pl-pets-wrap:1739
.pl-pets:1740 · .pl-pet:1741,1746,1748 · .pl-pet-nm:1749 · .img-lightbox:1752,1757,1758,1762(+3) · .settings-box:1775,1776,1821,1826(+20) · .set-feed-head:1777
.set-feed-sub:1781 · .set-feed-row:1782 · .pillinfo-val:1787 · .pillinfo-desc:1792,1811 · .levelup-box:1800,1801,1872 · .pillinfo-box:1803
.plf-head:1806 · .plf-emoji:1807 · .plf-ht:1808,1809,1810 · .plf-foot:1812 · .alert-box:1817 · .attn-box:1818
.help-box:1850,1851,1852 · .food-box:1873 · .home-shop-box:1875 · .summary-box:1876 · .report-box:1877 · .wl-grid:1880
.tc-wrap:1882 · .spell-btn:1888,1893 · .sp-hud:1894 · .sp-word:1896 · .sp-ch:1897,1902 · .sp-th:1904
.sp-hint:1906 · .sp-exit:1909,1913 · .sp-banner:1914 · .sp-big:1919 · .sp-thb:1921 · .sp-coin:1922
#spell-confetti:1927 · .sp-rb:1928 · .sp-day:1938 · .sp-perfect:1940 · .sp-late:1942 · #spell-coinpop:1945
.side-sub:2054,2056 · .sec-quest:2059 · .on-page:2070,2071,2072,2073 · .inbox-overlay:2083 · .ib-box:2085 · .ib-head:2089
.ib-close:2093,2095 · .ib-list:2096,2097 · .ib-row:2098,2099,2100,2101 · .ib-ava:2102 · .ib-on:2106 · .ib-mid:2108
.ib-name:2109 · .ib-last:2110 · .ib-meta:2111 · .ib-time:2112 · .ib-dot:2114 · .ib-story-badge:2117
.ib-empty:2121 · .ib-story:2123,2125 · .ib-story-item:2126,2128,2135 · .ib-story-ava:2129 · .ib-story-on:2133 · .ib-world:2138,2141
#btn-music:2146,2149,2150 · #ws-overlay:2165 · #ws-board:2167,2173,2175 · .ws-head:2177 · .ws-title:2178 · .ws-grade:2180
.ws-body:2182 · .ws-gridwrap:2183 · #ws-grid:2184 · .ws-cell:2188,2192,2194,2202(+1) · .ws-flash:2206,2208 · .ws-coinpop:2212
.ws-side:2223 · .ws-find:2224 · #ws-words:2226,2228 · .ws-word:2229,2233,2235 · #ws-prog:2236 · .ws-actions:2237,2238,2240
#ws-new:2241 · #ws-stash:2242 · #ws-clear:2243 · #ws-win:2244,2246 · .ws-win-in:2247,2250

## css/style.css (1,506 บรรทัด · 408 selector)
:root:5 · *:15 · html:16,21 · input:25 · body:29 · #app:35
.screen:38,39 · h1:42 · .subtitle:43 · .egg-grid:46,63 · .egg-card:47,52,53,54(+2) · .pet-price:57,61
.egg:65,71,75 · .d1:76 · .basket:79,80,85,91(+5) · .basket-dog:89,102,103,104 · .basket-cat:90,105,106,107 · .egg-dragon:110
.topbar:125 · .topbar-coins:126 · .coin-pill:127,132,136,141 · .no-anim:142,439,1223,1463(+2) · .q-row:149,150,151,155(+1) · .q-emoji:152
.q-mid:153 · .q-name:154 · .q-bar:156,157 · .q-right:159,160 · .q-foot:161,162 · .tc-open:165,166
.tc-wrap:167 · .tc-card:168 · .tc-head:172 · .tc-sub:176 · .tc-name:177,178 · .tc-badges:179
.tc-when:180 · .tc-row:181,185 · .tc-pass:186 · .tc-try:187 · .tc-sign:188 · .tc-hint:189
.tc-close:190 · .mb-seller:196 · .mb-buy:197 · .wl-open:200,205 · .wl-box:206 · .wl-grid:207
.wl-it:211,215,216,217 · .wl-emoji:218 · .wl-name:219 · .wl-h:220 · .hq-card:221 · .icon-btn:222
#settings-badge:228 · .badge-pop:231 · .attn-box:233,234,251 · .attn-list:235 · .attn-row:236,241 · .attn-ico:242
.attn-txt:243,244 · .attn-go:245 · .attn-total:246,250 · .weather-banner:254 · .rain-banner:261,266,267,268 · .rain-row:270
.rain-icon:271 · .rain-track:272 · .rain-fill:276 · .rain-note:277 · .comp-earn:280,292,296,297(+1) · .comp-earn-label:285
.comp-earn-num:286,290 · .comp-earn-sub:291 · .farm-shop:301 · .farm-buy-btn:302,308,310 · .farm-buy-emoji:309 · .farm-list:311
.farm-tree:312,316,321,326 · .farm-tree-emoji:320 · .farm-tree-info:323,324 · .farm-tree-status:325 · .farm-grow-badge:327 · .farm-sell-btn:328,332
.farm-sellall-btn:333,339,340 · .rank-card:343 · .rank-badge-wrap:348 · .rank-badge-img:349 · .rank-badge-emoji:350 · .rank-body:351
.rank-name:352,353 · .rank-bar:354 · .rank-fill:355 · .rank-text:356 · .rankup-overlay:359 · .rankup-rays:365
.rankup-content:381 · .rankup-title:386 · .rankup-badge:391,404 · .rankup-badge-img:403 · .rankup-name:405 · .rankup-en:409
.rankup-sub:413 · .rankup-btn:414,421,422 · .cr-btn-row:424 · .rankup-btn-2:425,426 · .thunder-fx:429 · .quake:430
.pet-tabs:442 · .pet-tab:443,447,448 · .pet-card:450 · .pet-stage:455 · .aura:456,462 · .sp1:463
.pet-wrap:466 · .pet-emoji:467 · .pet-img:468 · .egg-img:469 · .feed-pet:470,616 · .pet-baby:471
.pet-adult:472 · .pet-egg-stage:474 · .wear:476 · .wear-head:477 · .wear-face:478 · .wear-neck:479
.pet-name:481 · .stage-label:482 · .level-row:483 · .level-badge:484 · .exp-bar:488 · .exp-fill:489
.exp-text:490 · .ability-box:492,496 · .hunger-bar:499 · .hunger-fill:500,501,502 · .food-item:508,550,554,555(+6) · .hunger-text:512
.heat-bar:515 · .heat-fill:516 · .heat-text:517,518,519 · .care-row:521 · .care-btn:522,526,529 · .btn-feed:527
.btn-cure:528 · .sick-banner:530 · .pet-sick:534 · .pet-asleep:537 · .sleep-badge:538 · .btn-sleep:540
.dinner-btn:543 · .food-box:547,548 · .food-grid:549 · .fav-tag:569 · .fd-exp:573 · .food-sec:575
.food-sec-human:579 · .bad-tag:581 · .fd-toxin:585 · .fd-safe:586 · .fq-box:589,590 · .fq-progress:591
.fq-pair:592,593 · .fq-ask:594 · .fq-why:595 · .fq-btns:599,600,604 · .fq-yes:605 · .fq-no:606
.fq-next:607 · .food-cancel:608 · .feed-box:614,615 · .feed-gain:617 · .sick-badge:621 · .big-btn:627,633,854,855(+6)
.shop-card:636 · .shop-title:640 · .shop-grid:641 · .shop-item:642,646,647,648(+4) · .it-tag:653 · .tag-wear:654
.lock-banner:656 · .home-current:662,667,668 · .home-img:669 · .home-emoji:670 · .home-btn:671,693 · .home-layout:673
.home-pic-col:674,680 · .home-img-big:678 · .home-info-col:681,683,686,687 · .home-name-row:684 · .home-desc-row:685 · .home-shop-box:695,696
.home-list:697 · .home-option:698,702,703,704(+1) · .home-opt-img:705 · .home-opt-body:707,708 · .home-price:709 · .reset-link:714
.login-card:720 · .login-pets:721 · .login-status:722 · .google-btn:723,729,730 · .login-note:731 · .install-btn:734,740,741
.install-guide-overlay:744 · .install-guide:748,752,755 · .install-steps:753,754 · .install-guide-close:756 · .login-account:761 · .register-card:764,768,774,778
.reg-safety:770,772,773 · .student-chip:779 · .clock-chip:783 · .online-count:789 · .online-row:796,800,801 · .online-dot:805
.online-name:810 · .online-act:814 · .online-live:818 · .online-note:822 · .lb-empty:825 · .lb-list:826
.lb-row:827,831,832 · .lb-rank:836 · .lb-name:838,842 · .lb-coins:846 · .lb-hint:848 · .lb-badgeline:849
.lb-tabs:851 · .lb-tab:852,853 · .tinv-note:864 · .cat-card:870 · .cat-head:874 · .cat-emoji:875
.cat-name:876 · .cat-pass:877 · .cat-info:878 · .cat-btns:879 · .cat-btn:880,884,885,886 · .quiz-progress:889
.quiz-word-card:890 · .quiz-speak:895 · .quiz-choice:896,901,902,903 · .quiz-score-pill:904 · .stats-card:907 · .stats-title:911,1344
.stats-row:912,913,914,915 · .game-top:918 · .back-btn:919 · .combo-pill:923 · .timer-wrap:927 · .timer-fill:928,929
.board-label:931 · .card-grid:932 · .word-card:933,939,940,941(+3) · .hint-btn:947,952 · .game-endless-note:955,960,962,966(+6) · .report-btn:987,992
.report-box:995 · .report-close:996 · .rp-head:1000 · .rp-avatar:1001,1002 · .rp-title:1003 · .rp-sub:1004
.rp-levelcard:1006 · .rp-level-top:1010 · .rp-bar:1011 · .rp-bar-fill:1012 · .rp-level-note:1013,1014 · .rp-grid:1016
.rp-stat:1017 · .rp-ic:1020 · .rp-num:1021 · .rp-lbl:1022 · .rp-section:1024 · .rp-h3:1025
.rp-badge-mini:1026 · .rp-row:1027,1028,1029 · .rp-empty:1030 · .rp-badges:1031 · .rp-badge:1032 · .rp-tline:1035
.rp-tl-head:1036,1037 · .rp-tl-ems:1038 · .rp-em:1039,1040 · .rp-tl-note:1041,1042 · .rp-crown:1044,1045 · .rp-wtitle:1047
.rp-wnow:1048,1049 · .rp-wgraph:1050 · .rp-wcol:1051 · .rp-wval:1052 · .rp-wbar:1053,1054 · .rp-wlbl:1055
.rp-cheer:1057 · .report-ok:1061 · .summary-box:1064,1115,1119,1120(+2) · .sm-burst:1065 · .sm-title:1067 · .sm-line:1068
.sm-coin:1069 · .sm-matches:1075,1076 · .confetti:1078 · .sm-badge:1085 · .sm-badge-all:1089 · .badge-celebrate-overlay:1092,1105
.badge-celebrate:1096 · .bc-emoji:1102 · .bc-title:1103 · .bc-sub:1104 · .sm-cheer:1109 · .sm-streak:1110,1111
.sm-sick:1112 · .sm-btns:1113 · .float-fx:1125 · .toast:1132 · .toast-warn:1139,1146,1147,1153 · .toast-clear-all:1155,1162
.alert-box:1164 · .alert-ok:1165,1170 · .settings-box:1172 · .set-row:1173 · .set-hint:1177 · .set-hint-on:1178
.set-hint-off:1179 · .set-lwrap:1180 · .set-label:1181 · .set-desc:1182 · .set-switch:1183,1187,1188,1193(+4) · .set-sw-knob:1189
.set-sw-txt:1196 · .set-close:1202,1207 · .set-help:1208,1213 · .help-box:1215,1216,1221 · .help-item:1217 · .update-banner:1229,1238,1239
#update-reload:1240 · #update-dismiss:1244 · .levelup-overlay:1250 · .levelup-box:1254,1261,1262,1263(+4) · .bill-box:1269,1273,1274 · .tag-off:1275
.home-decayed-img:1276 · .home-dark-img:1277 · .thirst-fill:1278 · .thirst-text:1279,1280 · .toxin-fill:1283 · .toxin-text:1284,1285
.detox-btn:1286,1291 · .shape-text:1294,1295,1296,1297(+1) · .avatar-pick:1301 · .avatar-opt:1302,1306,1307,1308 · .avatar-chip-img:1312 · .avatar-chip-blk:1314
.set-avatar-btns:1315 · .avatar-mini:1316,1320 · .set-blk-row:1322 · .set-sub2:1323 · .blk-grid:1325 · .blk-mini:1326,1329,1330,1331
.game-avatar:1334,1335,1336 · .stats-nick:1345 · .ticket-owned:1348,1352 · .collect-sub:1357 · .mkt-tabs:1358 · .mkt-tab:1359,1363
.mkt-filter:1364 · .mkt-row:1368 · .mkt-emoji:1372,1373 · .mkt-info:1374,1375 · .mkt-tier-stars:1376 · .mkt-buy:1377,1382,1383
.mkt-price-lo:1384 · .mkt-price-hi:1385 · .mkt-empty:1386 · .collect-grid:1389 · .collect-cell:1390 · .cc-emoji:1391,1392
.cc-name:1393 · .cc-count:1394 · .cc-list-btn:1395,1399 · .mkt-listhead:1400 · .mkt-listing:1401 · .ml-cancel:1405
.mkt-sold:1411,1412,1413 · .list-dialog:1420,1421,1426 · .list-hint:1425 · .collect-reveal-frame:1429,1436 · .collect-reveal-img:1435 · .collect-reveal-stars:1437
.craft-box:1440 · .craft-head:1441 · .craft-bar:1442 · .craft-fill:1443 · .craft-text:1444 · .craft-btn-row:1445,1446
.craft-go-btn:1448,1454,1455,1458 · .craft-cancel:1466,1470 · .mkt-catalog:1473,1474,1475 · .mkt-pager:1478 · .pg-btn:1479,1483,1484 · .pg-mid:1485
.pg-dots:1486 · .pg-dot:1487,1488 · .order-head:1489 · .order-row:1490,1495,1497,1499 · .order-deliver:1500,1505 · .order-need:1506
