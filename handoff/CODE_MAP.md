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

## js/ui.js (6,065 บรรทัด · 237 รายการ)
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
openCarBuyDialog:5280 · buyCarInsurance:5341 · payCarLoanMonthly:5360 · payCarLoanFull:5372 · carDriveBlock:5391 · gotoVehicleShop:5396
gotoMyStock:5401 · showNeedCarDialog:5407 · craftDiscount:5419 · renderFactory:5422 · renderOrdersUI:5489 · startProduce:5508
buyCollectible:5536 · cancelProduce:5564 · deliverOrder:5578 · renderOrderClock:5595 · renderCollectMine:5605 · openListDialog:5647
cancelListing:5700 · buyMarketItem:5723 · showCollectReveal:5750 · buyAC:5786 · openHomeShop:5805 · renderPetShop:5864
showLevelUp:5925 · renderStats:5962 · showTeacherCard:6033

## js/util.js (576 บรรทัด · 28 รายการ)
shuffle:6 · fmtNum:15 · escapeHTML:19 · seededRand:25 · fmtThaiDT:35 · fmtThaiDate:39
showScreen:44 · TOAST_WARN_RE:52 · restackToasts:55 · toast:77 · floatFx:97 · beep:107
sirenSynth:133 · playSpark:157 · sparkSynth:171 · thunderFx:206 · wordAudioFile:274 · speakWord:277
speakLetter:297 · pickSpeakVoice:316 · speakWordTTS:327 · askNameDialog:347 · askConfirm:387 · alertBox:404
applyNoAnim:420 · openSettings:425 · openHelp:531 · openTeacherGuide:557

## js/wordsearch.js (235 บรรทัด · 0 รายการ)

## css/lobby.css (2,275 บรรทัด · 420 selector)
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
.chat-send:371,376,377 · .pl-click:444,446,447 · .pl-overlay:448 · .pl-card:452,1701 · .pl-close:458 · .pl-head:462
.pl-grade:467 · .pl-badges:469 · .pl-badge-chip:470,474 · .pl-body:475 · .pl-loading:476 · .pl-none:477
.pl-me-tag:478 · .pl-blk-wrap:480 · .pl-blk:481 · .pl-stat:482 · .pl-lbl:487 · .pl-val:488,489
.pl-tip:490 · .chip-edit:496,501,502 · .rank-mini:508,514,515,516 · .pass-photo:518,523 · .pet-tabs:525 · .dict-box:526,530,531,532(+1)
.dict-card:538,543 · .dict-head:544,545 · .dict-list:546 · .dict-item:547,551,552,553(+5) · .lobby-mid:567 · .lobby-rail:569
.rail-worlds:587 · .rail-div:588 · .lobby-stage:603,612,656,657 · .lobby-bottom:605,610,1077,1078 · .newword-banner:618,625 · .nw-tag:626
.nw-word:631 · .nw-hint:633,634 · .nw-box:636,1838 · .nw-pop-word:637 · .nw-speak:638 · .nw-pop-phon:639
.nw-ipa:640 · .nw-pop-sent:641 · .nw-pop-mean:642 · .pet-tab:643,644,645,2162 · .stage-hero:666,681,689,834(+5) · .hero-ground:703,823,829
.hero-rank-bg:705,708,711,715(+18) · #lobby3d-canvas:728,729 · .hero-scene:733,735,742,743(+8) · .caretaker-fig:782 · .caretaker-img:785 · .caretaker-emoji:787
.blk-rig:794,795,796 · .stage-plate:856,864,875,876(+30) · .plate-title:870 · .lobby-side:913,948,953,956(+22) · .side-sec:916,2077 · .side-label:917,922
.side-label-row:924,925 · .lb-tabs-out:926,927,931 · .side-glass:935,942 · .side-card:954,1066 · #quest-card:966,990,991,992(+6) · .q-bigcard:967,996,997,1000(+1)
.qb-top:969 · .qb-emoji:970 · .qb-name:972 · .qb-bar:973,974 · .qb-row:976 · .qb-prog:977
.qb-reward:978 · .qb-go:979,983 · .q-dots:984 · .q-dot:985,986,987 · .q-bonus:988 · .feed-row:1011,1592,1597
.inv-card:1013,1015,1016 · .inv-btns:1017 · .inv-go:1018,1020 · .inv-x:1021 · #online-card:1025,2085,2086,2087(+1) · .fq-overlay:1026
.fq-box:1028,1893 · .fq-head:1032,1034 · .fq-close:1035 · .fq-sec:1037 · .fq-worlds:1038 · .fq-world:1039,1041
.fq-acts:1042 · .fq-act:1043,1046,1047 · .lobby-quiz-btn:1079 · .lobby-foodquiz-btn:1080,1081 · .lobby-play-btn:1082,1086 · .panel-overlay:1091,1096
.panel-box:1097 · .panel-head:1104,1108 · .panel-close:1109,1114 · .panel-body:1115,1118,1119 · .panel-page:1116,1117 · .collect-sub:1123
.mkt-empty:1124 · .craft-box:1125 · .mkt-listing:1126 · .mkt-filter:1127,1449 · .hq-grid:1134 · .hq-card:1135,1140,1164
.hq-head:1141 · .hq-pic:1147,1149 · .hq-emoji:1151 · .hq-badge:1152 · .hq-stars:1156 · .hq-price:1157,1162,1163,1166(+6)
.craft-credit:1170,1172,1173 · .car-grid:1180,1182,1183 · .robot-weap:1184 · .dcp-grid:1186 · .dcp-card:1188,1191,1192,1193(+10) · .levelup-box:1210,1819,1820,1891
.dcp-box:1213,1214,1218,1219(+6) · .dcp-lock:1227 · .sold-badge:1231,1233,1234 · .rs-showroom:1236 · .rs-list:1237,1239 · .rs-thumb:1240,1242,1243,1244(+1)
.rs-thumb-pic:1245,1246 · .rs-thumb-price:1247 · .rs-stage:1249 · .rs-big:1252 · .rs-big-img:1253 · .rs-elec:1257,1261,1266
.rs-edge:1267,1273 · .rs-info:1276,1277,1278,1279(+1) · .rs-buy:1281,1283,1284 · .cs-showroom:1288 · .cs-list:1289,1291 · .cs-thumb:1292,1294,1295,1296(+1)
.cs-thumb-pic:1297,1298 · .cs-thumb-name:1299 · .cs-thumb-price:1300 · .cs-thumb-own:1301 · .cs-stage:1303 · .cs-big:1306
.cs-big-img:1307 · .cs-elec:1311,1315,1319 · .cs-edge:1320,1326 · .cs-interior:1329 · .cs-inr-label:1330,1331 · .cs-inr-img:1332
.cs-info:1334,1335,1336,1337(+6) · .cs-buy:1345,1347,1348,1349 · .car-emoji:1351 · .car-mine:1357 · .car-mine-pic:1362 · .car-mine-info:1363
.car-loan:1364,1365 · .car-mine-btns:1366,1367,1368 · .car-locked:1370 · .car-mine-head:1372 · .car-pick-list:1373,1374 · .car-pick:1375,1377,1378
.car-pick-pic:1379,1380 · .car-pick-name:1381,1382 · .car-pick-od:1383 · .car-buy-box:1385,1897 · .cb-pic:1386,1387,1388 · .cb-lines:1389
.cb-li:1390,1394,1395 · .cb-ins:1396,1400,1401 · .cb-plan:1402 · .cb-pl:1403,1408,1410,1414(+1) · .cb-total:1421 · .cb-btns:1422,1427
.cb-x:1423 · .shop-grid:1430 · .shop-item:1431,1436,1441,1442(+3) · .mkt-tab:1450,1451 · .pg-btn:1452,1453,1454 · .pg-dot:1455
.fr-gift-btn:1475,1480 · .gift-sec-title:1483 · .gift-in-row:1485 · .gift-out-row:1489 · .gift-in-pic:1490,1492,1493 · .gift-in-info:1494,1495
.gift-in-btns:1496 · .gift-accept:1497,1501,1503 · .gift-decline:1502 · .gift-box-card:1504 · .gift-box-from:1505,1506 · .gift-note:1507
.gift-pick-overlay:1510 · .gift-pick-box:1514 · .gift-pick-head:1520,1524 · .gift-pick-close:1525 · .gift-pick-tabs:1527 · .gp-tab:1528,1532
.gift-pick-body:1533 · .gp-chips:1534 · .gp-chip:1535,1539 · .gp-card:1540,1541 · .gp-price:1542 · .gp-note:1543
.gift-cf-pic:1544 · .chat-emoji-cats:1549 · .chat-emoji-cat:1553,1557,1558 · .chat-emoji-wrap:1559,1560 · .stage-left:1568 · .pet-info-btn:1572,1579,1580
.feed-list:1587,1591 · .feed-ico:1598 · .feed-txt:1599 · .feed-name:1600 · .feed-ago:1601 · .feed-empty:1602,1605
.pi-overlay:1607 · .pi-box:1611,1616,1617,1621(+2) · .pi-close:1623,1628,1629 · .pi-close-left:1631 · .pi-portrait:1633 · .pi-care-title:1639
.lbf-overlay:1642 · .lbf-box:1645 · .lbf-head:1650 · .lbf-title:1651 · .lbf-tabs:1652 · .lbf-close:1655
.lbf-close-l:1656 · .lbf-body:1657 · .lbf-grid:1658 · .lbf-cell:1660,1663,1664,1665(+1) · .lbf-podium:1669 · .pod:1671,1698,1699
.pod-char:1673 · .pod-base:1675 · .pod-rank:1677 · .pod-label:1679 · .pod-name:1681 · .pod-sc:1683
.pod-1:1688,1689 · .pod-2:1690,1691 · .pod-3:1692,1693 · .pod-4:1694,1695 · .pod-5:1696,1697 · .pl-wide:1702,1705,1706,1707
.pl-follow:1708,1713,1715 · .pl-unfollow:1717,1723,1724 · .pl-followers:1725 · .pl-cols:1726 · .pl-col:1727 · .pl-sec-title:1728
.pl-feed:1729,1732,1739 · .pl-feed-row:1733,1737,1738 · .pl-assets-wrap:1741 · .pl-assets:1742 · .pl-asset:1745,1749,1756 · .pl-asset-emoji:1750
.pl-asset-n:1751 · .pl-pets-wrap:1758 · .pl-pets:1759 · .pl-pet:1760,1765,1767 · .pl-pet-nm:1768 · .img-lightbox:1771,1776,1777,1781(+3)
.settings-box:1794,1795,1840,1845(+20) · .set-feed-head:1796 · .set-feed-sub:1800 · .set-feed-row:1801 · .pillinfo-val:1806 · .pillinfo-desc:1811,1830
.pillinfo-box:1822 · .plf-head:1825 · .plf-emoji:1826 · .plf-ht:1827,1828,1829 · .plf-foot:1831 · .alert-box:1836
.attn-box:1837 · .help-box:1869,1870,1871 · .food-box:1892 · .home-shop-box:1894 · .summary-box:1895 · .report-box:1896
.wl-grid:1899 · .tc-wrap:1901 · .spell-btn:1907,1912 · .sp-hud:1913 · .sp-word:1915 · .sp-ch:1916,1921
.sp-th:1923 · .sp-hint:1925 · .sp-exit:1928,1932 · .sp-banner:1933 · .sp-big:1938 · .sp-thb:1940
.sp-coin:1941 · #spell-confetti:1946 · .sp-rb:1947 · .sp-day:1957 · .sp-perfect:1959 · .sp-late:1961
#spell-coinpop:1964 · .side-sub:2073,2075 · .sec-quest:2078 · .on-page:2089,2090,2091,2092 · .inbox-overlay:2102 · .ib-box:2104
.ib-head:2108 · .ib-close:2112,2114 · .ib-list:2115,2116 · .ib-row:2117,2118,2119,2120 · .ib-ava:2121 · .ib-on:2125
.ib-mid:2127 · .ib-name:2128 · .ib-last:2129 · .ib-meta:2130 · .ib-time:2131 · .ib-dot:2133
.ib-story-badge:2136 · .ib-empty:2140 · .ib-story:2142,2144 · .ib-story-item:2145,2147,2154 · .ib-story-ava:2148 · .ib-story-on:2152
.ib-world:2157,2160 · #btn-music:2165,2168,2169 · #ws-overlay:2184 · #ws-board:2186,2192,2194 · .ws-head:2196 · .ws-title:2197
.ws-grade:2199 · .ws-body:2201 · .ws-gridwrap:2202 · #ws-grid:2203 · .ws-cell:2207,2211,2213,2221(+1) · .ws-flash:2225,2227
.ws-coinpop:2231 · .ws-side:2242 · .ws-find:2243 · #ws-words:2245,2247 · .ws-word:2248,2252,2254 · #ws-prog:2255
.ws-actions:2256,2257,2259 · #ws-new:2260 · #ws-stash:2261 · #ws-clear:2262 · #ws-win:2263,2265 · .ws-win-in:2266,2269

## css/style.css (1,515 บรรทัด · 409 selector)
:root:5 · *:15 · html:16,21 · input:25 · body:29 · #app:35
.screen:38,39 · h1:42 · .subtitle:43 · .egg-grid:46,63 · .egg-card:47,52,53,54(+2) · .pet-price:57,61
.egg:65,71,75 · .d1:76 · .basket:79,80,85,91(+5) · .basket-dog:89,102,103,104 · .basket-cat:90,105,106,107 · .egg-dragon:110
.topbar:125 · .topbar-coins:126 · .coin-pill:127,132,136,141(+1) · .no-anim:142,446,1232,1472(+2) · .net-coin:144 · .q-row:156,157,158,162(+1)
.q-emoji:159 · .q-mid:160 · .q-name:161 · .q-bar:163,164 · .q-right:166,167 · .q-foot:168,169
.tc-open:172,173 · .tc-wrap:174 · .tc-card:175 · .tc-head:179 · .tc-sub:183 · .tc-name:184,185
.tc-badges:186 · .tc-when:187 · .tc-row:188,192 · .tc-pass:193 · .tc-try:194 · .tc-sign:195
.tc-hint:196 · .tc-close:197 · .mb-seller:203 · .mb-buy:204 · .wl-open:207,212 · .wl-box:213
.wl-grid:214 · .wl-it:218,222,223,224 · .wl-emoji:225 · .wl-name:226 · .wl-h:227 · .hq-card:228
.icon-btn:229 · #settings-badge:235 · .badge-pop:238 · .attn-box:240,241,258 · .attn-list:242 · .attn-row:243,248
.attn-ico:249 · .attn-txt:250,251 · .attn-go:252 · .attn-total:253,257 · .weather-banner:261 · .rain-banner:268,273,274,275
.rain-row:277 · .rain-icon:278 · .rain-track:279 · .rain-fill:283 · .rain-note:284 · .comp-earn:287,299,303,304(+1)
.comp-earn-label:292 · .comp-earn-num:293,297 · .comp-earn-sub:298 · .farm-shop:308 · .farm-buy-btn:309,315,317 · .farm-buy-emoji:316
.farm-list:318 · .farm-tree:319,323,328,333 · .farm-tree-emoji:327 · .farm-tree-info:330,331 · .farm-tree-status:332 · .farm-grow-badge:334
.farm-sell-btn:335,339 · .farm-sellall-btn:340,346,347 · .rank-card:350 · .rank-badge-wrap:355 · .rank-badge-img:356 · .rank-badge-emoji:357
.rank-body:358 · .rank-name:359,360 · .rank-bar:361 · .rank-fill:362 · .rank-text:363 · .rankup-overlay:366
.rankup-rays:372 · .rankup-content:388 · .rankup-title:393 · .rankup-badge:398,411 · .rankup-badge-img:410 · .rankup-name:412
.rankup-en:416 · .rankup-sub:420 · .rankup-btn:421,428,429 · .cr-btn-row:431 · .rankup-btn-2:432,433 · .thunder-fx:436
.quake:437 · .pet-tabs:449 · .pet-tab:450,456,457 · .pet-card:459 · .pet-stage:464 · .aura:465,471
.sp1:472 · .pet-wrap:475 · .pet-emoji:476 · .pet-img:477 · .egg-img:478 · .feed-pet:479,625
.pet-baby:480 · .pet-adult:481 · .pet-egg-stage:483 · .wear:485 · .wear-head:486 · .wear-face:487
.wear-neck:488 · .pet-name:490 · .stage-label:491 · .level-row:492 · .level-badge:493 · .exp-bar:497
.exp-fill:498 · .exp-text:499 · .ability-box:501,505 · .hunger-bar:508 · .hunger-fill:509,510,511 · .food-item:517,559,563,564(+6)
.hunger-text:521 · .heat-bar:524 · .heat-fill:525 · .heat-text:526,527,528 · .care-row:530 · .care-btn:531,535,538
.btn-feed:536 · .btn-cure:537 · .sick-banner:539 · .pet-sick:543 · .pet-asleep:546 · .sleep-badge:547
.btn-sleep:549 · .dinner-btn:552 · .food-box:556,557 · .food-grid:558 · .fav-tag:578 · .fd-exp:582
.food-sec:584 · .food-sec-human:588 · .bad-tag:590 · .fd-toxin:594 · .fd-safe:595 · .fq-box:598,599
.fq-progress:600 · .fq-pair:601,602 · .fq-ask:603 · .fq-why:604 · .fq-btns:608,609,613 · .fq-yes:614
.fq-no:615 · .fq-next:616 · .food-cancel:617 · .feed-box:623,624 · .feed-gain:626 · .sick-badge:630
.big-btn:636,642,863,864(+6) · .shop-card:645 · .shop-title:649 · .shop-grid:650 · .shop-item:651,655,656,657(+4) · .it-tag:662
.tag-wear:663 · .lock-banner:665 · .home-current:671,676,677 · .home-img:678 · .home-emoji:679 · .home-btn:680,702
.home-layout:682 · .home-pic-col:683,689 · .home-img-big:687 · .home-info-col:690,692,695,696 · .home-name-row:693 · .home-desc-row:694
.home-shop-box:704,705 · .home-list:706 · .home-option:707,711,712,713(+1) · .home-opt-img:714 · .home-opt-body:716,717 · .home-price:718
.reset-link:723 · .login-card:729 · .login-pets:730 · .login-status:731 · .google-btn:732,738,739 · .login-note:740
.install-btn:743,749,750 · .install-guide-overlay:753 · .install-guide:757,761,764 · .install-steps:762,763 · .install-guide-close:765 · .login-account:770
.register-card:773,777,783,787 · .reg-safety:779,781,782 · .student-chip:788 · .clock-chip:792 · .online-count:798 · .online-row:805,809,810
.online-dot:814 · .online-name:819 · .online-act:823 · .online-live:827 · .online-note:831 · .lb-empty:834
.lb-list:835 · .lb-row:836,840,841 · .lb-rank:845 · .lb-name:847,851 · .lb-coins:855 · .lb-hint:857
.lb-badgeline:858 · .lb-tabs:860 · .lb-tab:861,862 · .tinv-note:873 · .cat-card:879 · .cat-head:883
.cat-emoji:884 · .cat-name:885 · .cat-pass:886 · .cat-info:887 · .cat-btns:888 · .cat-btn:889,893,894,895
.quiz-progress:898 · .quiz-word-card:899 · .quiz-speak:904 · .quiz-choice:905,910,911,912 · .quiz-score-pill:913 · .stats-card:916
.stats-title:920,1353 · .stats-row:921,922,923,924 · .game-top:927 · .back-btn:928 · .combo-pill:932 · .timer-wrap:936
.timer-fill:937,938 · .board-label:940 · .card-grid:941 · .word-card:942,948,949,950(+3) · .hint-btn:956,961 · .game-endless-note:964,969,971,975(+6)
.report-btn:996,1001 · .report-box:1004 · .report-close:1005 · .rp-head:1009 · .rp-avatar:1010,1011 · .rp-title:1012
.rp-sub:1013 · .rp-levelcard:1015 · .rp-level-top:1019 · .rp-bar:1020 · .rp-bar-fill:1021 · .rp-level-note:1022,1023
.rp-grid:1025 · .rp-stat:1026 · .rp-ic:1029 · .rp-num:1030 · .rp-lbl:1031 · .rp-section:1033
.rp-h3:1034 · .rp-badge-mini:1035 · .rp-row:1036,1037,1038 · .rp-empty:1039 · .rp-badges:1040 · .rp-badge:1041
.rp-tline:1044 · .rp-tl-head:1045,1046 · .rp-tl-ems:1047 · .rp-em:1048,1049 · .rp-tl-note:1050,1051 · .rp-crown:1053,1054
.rp-wtitle:1056 · .rp-wnow:1057,1058 · .rp-wgraph:1059 · .rp-wcol:1060 · .rp-wval:1061 · .rp-wbar:1062,1063
.rp-wlbl:1064 · .rp-cheer:1066 · .report-ok:1070 · .summary-box:1073,1124,1128,1129(+2) · .sm-burst:1074 · .sm-title:1076
.sm-line:1077 · .sm-coin:1078 · .sm-matches:1084,1085 · .confetti:1087 · .sm-badge:1094 · .sm-badge-all:1098
.badge-celebrate-overlay:1101,1114 · .badge-celebrate:1105 · .bc-emoji:1111 · .bc-title:1112 · .bc-sub:1113 · .sm-cheer:1118
.sm-streak:1119,1120 · .sm-sick:1121 · .sm-btns:1122 · .float-fx:1134 · .toast:1141 · .toast-warn:1148,1155,1156,1162
.toast-clear-all:1164,1171 · .alert-box:1173 · .alert-ok:1174,1179 · .settings-box:1181 · .set-row:1182 · .set-hint:1186
.set-hint-on:1187 · .set-hint-off:1188 · .set-lwrap:1189 · .set-label:1190 · .set-desc:1191 · .set-switch:1192,1196,1197,1202(+4)
.set-sw-knob:1198 · .set-sw-txt:1205 · .set-close:1211,1216 · .set-help:1217,1222 · .help-box:1224,1225,1230 · .help-item:1226
.update-banner:1238,1247,1248 · #update-reload:1249 · #update-dismiss:1253 · .levelup-overlay:1259 · .levelup-box:1263,1270,1271,1272(+4) · .bill-box:1278,1282,1283
.tag-off:1284 · .home-decayed-img:1285 · .home-dark-img:1286 · .thirst-fill:1287 · .thirst-text:1288,1289 · .toxin-fill:1292
.toxin-text:1293,1294 · .detox-btn:1295,1300 · .shape-text:1303,1304,1305,1306(+1) · .avatar-pick:1310 · .avatar-opt:1311,1315,1316,1317 · .avatar-chip-img:1321
.avatar-chip-blk:1323 · .set-avatar-btns:1324 · .avatar-mini:1325,1329 · .set-blk-row:1331 · .set-sub2:1332 · .blk-grid:1334
.blk-mini:1335,1338,1339,1340 · .game-avatar:1343,1344,1345 · .stats-nick:1354 · .ticket-owned:1357,1361 · .collect-sub:1366 · .mkt-tabs:1367
.mkt-tab:1368,1372 · .mkt-filter:1373 · .mkt-row:1377 · .mkt-emoji:1381,1382 · .mkt-info:1383,1384 · .mkt-tier-stars:1385
.mkt-buy:1386,1391,1392 · .mkt-price-lo:1393 · .mkt-price-hi:1394 · .mkt-empty:1395 · .collect-grid:1398 · .collect-cell:1399
.cc-emoji:1400,1401 · .cc-name:1402 · .cc-count:1403 · .cc-list-btn:1404,1408 · .mkt-listhead:1409 · .mkt-listing:1410
.ml-cancel:1414 · .mkt-sold:1420,1421,1422 · .list-dialog:1429,1430,1435 · .list-hint:1434 · .collect-reveal-frame:1438,1445 · .collect-reveal-img:1444
.collect-reveal-stars:1446 · .craft-box:1449 · .craft-head:1450 · .craft-bar:1451 · .craft-fill:1452 · .craft-text:1453
.craft-btn-row:1454,1455 · .craft-go-btn:1457,1463,1464,1467 · .craft-cancel:1475,1479 · .mkt-catalog:1482,1483,1484 · .mkt-pager:1487 · .pg-btn:1488,1492,1493
.pg-mid:1494 · .pg-dots:1495 · .pg-dot:1496,1497 · .order-head:1498 · .order-row:1499,1504,1506,1508 · .order-deliver:1509,1514
.order-need:1515
