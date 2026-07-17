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

## js/auth.js (381 บรรทัด · 31 รายการ)
AUTH_PUSH_MS:23 · AUTH_SDK_TIMEOUT_MS:24 · TEACHER_EMAILS:28 · isTeacher:29 · TESTER_EMAILS:42 · TESTER_COINS:43
isTester:44 · testerBoost:48 · authSetStatus:74 · authShowLogin:86 · authGateOffline:90 · authSaveRef:97
authFetchCloud:98 · authWriteCloud:99 · authDeleteCloud:100 · authWriteProfileName:101 · authPushProfile:108 · authApplyProfileName:116
authAskProfileName:132 · authEditProfileName:143 · authStart:154 · authEnterOffline:183 · authLateSync:199 · authLoginClick:214
authOnLogin:233 · authSyncOnLogin:246 · authFreshStart:275 · authAskLink:284 · authEnterGame:334 · authPushSave:349
authLogout:360

## js/dictband.js (227 บรรทัด · 18 รายการ)
BAND_EMOJI:12 · BAND_SET_REWARD:13 · BAND_DONE_BONUS:14 · bandLoad:18 · bandShortTH:36 · bandCat:44
bandSets:66 · bandSetId:75 · bandSetCat:78 · bandSetsPassed:97 · openBandSetPicker:105 · bandMine:153
bandUnlocked:154 · bandLockToast:159 · bandExamLobby:165 · bandPlay:171 · bandPlayLobby:184 · bandCardsHTML:196

## js/game.js (861 บรรทัด · 50 รายการ)
REPLAY_BONUS_EVERY:23 · REPLAY_BONUS_TIERS:25 · replayBonusFor:26 · SESSION_MILESTONES:32 · addSessionCoins:35 · updateBestTarget:74
weekKeyStr:87 · rolloverWeekBest:93 · exitGame:99 · showSessionSummary:132 · sprinkleConfetti:179 · VOCAB_PER_LEVEL:198
VOCAB_RANK_NAMES:199 · vocabRankName:200 · showProgressReport:202 · THUNDER_MS:346 · THUNDER_TIERS:350 · THUNDER_TIER_UI:351
thunderEmoji:352 · DAREDEVIL_TIERS:356 · DAREDEVIL_TIER_UI:357 · daredevilEmoji:358 · DILIGENT_TIERS:362 · DILIGENT_TIER_UI:363
diligentEmoji:364 · MECHABOSS_TIERS:368 · MECHABOSS_TIER_UI:369 · mechaBossEmoji:370 · badgeSuffix:375 · BADGE_META:386
NAME_BADGE_RE:394 · splitNameBadges:395 · badgeEmojis:401 · badgeScore:406 · checkCrown:412 · currentBadgeScore:428
rolloverBadgeWeek:432 · addDiligent:445 · celebrateBadge:461 · addThunder:475 · startGame:489 · newRound:524
updateTimerBar:563 · updateComboPill:569 · pickCard:573 · checkMatch:585 · renderCats:695 · startQuiz:729
renderQuizQuestion:744 · finishQuiz:801

## js/images.js (101 บรรทัด · 14 รายการ)
IMG_FILES:11 · MOODS:12 · startImgKey:14 · petImageKeys:16 · probeImages:27 · probeRankImages:39
probeCollectImages:40 · probeGiftImages:41 · probeHomeImages:42 · equippedItem:48 · petStateImg:58 · happyNow:72
makeHappy:73 · currentPetImg:84

## js/lobby.js (51 บรรทัด · 3 รายการ)
PANEL_TITLES:9 · openPanel:20 · closePanel:28

## js/lobby3d.js (780 บรรทัด · 0 รายการ)

## js/main.js (157 บรรทัด · 2 รายการ)
syncMusicBtn:78 · bootGame:112

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

## css/lobby.css (2,278 บรรทัด · 421 selector)
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
.chat-send:371,376,377 · .pl-click:444,446,447 · .pl-overlay:448 · .pl-card:452,1704 · .pl-close:458 · .pl-head:462
.pl-grade:467 · .pl-badges:469 · .pl-badge-chip:470,474 · .pl-body:475 · .pl-loading:476 · .pl-none:477
.pl-me-tag:478 · .pl-blk-wrap:480 · .pl-blk:481 · .pl-stat:482 · .pl-lbl:487 · .pl-val:488,489
.pl-tip:490 · .chip-edit:496,501,502 · .rank-mini:508,514,515,516 · .pass-photo:518,523 · .pet-tabs:525 · .dict-box:526,530,531,532(+1)
.dict-card:538,543 · .dict-head:544,545 · .dict-list:546 · .dict-item:547,551,552,553(+5) · .lobby-mid:567 · .lobby-rail:569
.rail-worlds:587 · .rail-div:588 · .lobby-stage:603,612,656,657 · .lobby-bottom:605,610,1077,1078 · .newword-banner:618,625 · .nw-tag:626
.nw-word:631 · .nw-hint:633,634 · .nw-box:636,1841 · .nw-pop-word:637 · .nw-speak:638 · .nw-pop-phon:639
.nw-ipa:640 · .nw-pop-sent:641 · .nw-pop-mean:642 · .pet-tab:643,644,645,2165 · .stage-hero:666,681,689,834(+5) · .hero-ground:703,823,829
.hero-rank-bg:705,708,711,715(+18) · #lobby3d-canvas:728,729 · .hero-scene:733,735,742,743(+8) · .caretaker-fig:782 · .caretaker-img:785 · .caretaker-emoji:787
.blk-rig:794,795,796 · .stage-plate:856,864,875,876(+30) · .plate-title:870 · .lobby-side:913,948,953,956(+22) · .side-sec:916,2080 · .side-label:917,922
.side-label-row:924,925 · .lb-tabs-out:926,927,931 · .side-glass:935,942 · .side-card:954,1066 · #quest-card:966,990,991,992(+6) · .q-bigcard:967,996,997,1000(+1)
.qb-top:969 · .qb-emoji:970 · .qb-name:972 · .qb-bar:973,974 · .qb-row:976 · .qb-prog:977
.qb-reward:978 · .qb-go:979,983 · .q-dots:984 · .q-dot:985,986,987 · .q-bonus:988 · .feed-row:1011,1595,1600
.inv-card:1013,1015,1016 · .inv-btns:1017 · .inv-go:1018,1020 · .inv-x:1021 · #online-card:1025,2088,2089,2090(+1) · .fq-overlay:1026
.fq-box:1028,1896 · .fq-head:1032,1034 · .fq-close:1035 · .fq-sec:1037 · .fq-worlds:1038 · .fq-world:1039,1041
.fq-acts:1042 · .fq-act:1043,1046,1047 · .lobby-quiz-btn:1079 · .lobby-foodquiz-btn:1080,1081 · .lobby-play-btn:1082,1086 · .lobby-exam-btn:1088,1089
.panel-overlay:1094,1099 · .panel-box:1100 · .panel-head:1107,1111 · .panel-close:1112,1117 · .panel-body:1118,1121,1122 · .panel-page:1119,1120
.collect-sub:1126 · .mkt-empty:1127 · .craft-box:1128 · .mkt-listing:1129 · .mkt-filter:1130,1452 · .hq-grid:1137
.hq-card:1138,1143,1167 · .hq-head:1144 · .hq-pic:1150,1152 · .hq-emoji:1154 · .hq-badge:1155 · .hq-stars:1159
.hq-price:1160,1165,1166,1169(+6) · .craft-credit:1173,1175,1176 · .car-grid:1183,1185,1186 · .robot-weap:1187 · .dcp-grid:1189 · .dcp-card:1191,1194,1195,1196(+10)
.levelup-box:1213,1822,1823,1894 · .dcp-box:1216,1217,1221,1222(+6) · .dcp-lock:1230 · .sold-badge:1234,1236,1237 · .rs-showroom:1239 · .rs-list:1240,1242
.rs-thumb:1243,1245,1246,1247(+1) · .rs-thumb-pic:1248,1249 · .rs-thumb-price:1250 · .rs-stage:1252 · .rs-big:1255 · .rs-big-img:1256
.rs-elec:1260,1264,1269 · .rs-edge:1270,1276 · .rs-info:1279,1280,1281,1282(+1) · .rs-buy:1284,1286,1287 · .cs-showroom:1291 · .cs-list:1292,1294
.cs-thumb:1295,1297,1298,1299(+1) · .cs-thumb-pic:1300,1301 · .cs-thumb-name:1302 · .cs-thumb-price:1303 · .cs-thumb-own:1304 · .cs-stage:1306
.cs-big:1309 · .cs-big-img:1310 · .cs-elec:1314,1318,1322 · .cs-edge:1323,1329 · .cs-interior:1332 · .cs-inr-label:1333,1334
.cs-inr-img:1335 · .cs-info:1337,1338,1339,1340(+6) · .cs-buy:1348,1350,1351,1352 · .car-emoji:1354 · .car-mine:1360 · .car-mine-pic:1365
.car-mine-info:1366 · .car-loan:1367,1368 · .car-mine-btns:1369,1370,1371 · .car-locked:1373 · .car-mine-head:1375 · .car-pick-list:1376,1377
.car-pick:1378,1380,1381 · .car-pick-pic:1382,1383 · .car-pick-name:1384,1385 · .car-pick-od:1386 · .car-buy-box:1388,1900 · .cb-pic:1389,1390,1391
.cb-lines:1392 · .cb-li:1393,1397,1398 · .cb-ins:1399,1403,1404 · .cb-plan:1405 · .cb-pl:1406,1411,1413,1417(+1) · .cb-total:1424
.cb-btns:1425,1430 · .cb-x:1426 · .shop-grid:1433 · .shop-item:1434,1439,1444,1445(+3) · .mkt-tab:1453,1454 · .pg-btn:1455,1456,1457
.pg-dot:1458 · .fr-gift-btn:1478,1483 · .gift-sec-title:1486 · .gift-in-row:1488 · .gift-out-row:1492 · .gift-in-pic:1493,1495,1496
.gift-in-info:1497,1498 · .gift-in-btns:1499 · .gift-accept:1500,1504,1506 · .gift-decline:1505 · .gift-box-card:1507 · .gift-box-from:1508,1509
.gift-note:1510 · .gift-pick-overlay:1513 · .gift-pick-box:1517 · .gift-pick-head:1523,1527 · .gift-pick-close:1528 · .gift-pick-tabs:1530
.gp-tab:1531,1535 · .gift-pick-body:1536 · .gp-chips:1537 · .gp-chip:1538,1542 · .gp-card:1543,1544 · .gp-price:1545
.gp-note:1546 · .gift-cf-pic:1547 · .chat-emoji-cats:1552 · .chat-emoji-cat:1556,1560,1561 · .chat-emoji-wrap:1562,1563 · .stage-left:1571
.pet-info-btn:1575,1582,1583 · .feed-list:1590,1594 · .feed-ico:1601 · .feed-txt:1602 · .feed-name:1603 · .feed-ago:1604
.feed-empty:1605,1608 · .pi-overlay:1610 · .pi-box:1614,1619,1620,1624(+2) · .pi-close:1626,1631,1632 · .pi-close-left:1634 · .pi-portrait:1636
.pi-care-title:1642 · .lbf-overlay:1645 · .lbf-box:1648 · .lbf-head:1653 · .lbf-title:1654 · .lbf-tabs:1655
.lbf-close:1658 · .lbf-close-l:1659 · .lbf-body:1660 · .lbf-grid:1661 · .lbf-cell:1663,1666,1667,1668(+1) · .lbf-podium:1672
.pod:1674,1701,1702 · .pod-char:1676 · .pod-base:1678 · .pod-rank:1680 · .pod-label:1682 · .pod-name:1684
.pod-sc:1686 · .pod-1:1691,1692 · .pod-2:1693,1694 · .pod-3:1695,1696 · .pod-4:1697,1698 · .pod-5:1699,1700
.pl-wide:1705,1708,1709,1710 · .pl-follow:1711,1716,1718 · .pl-unfollow:1720,1726,1727 · .pl-followers:1728 · .pl-cols:1729 · .pl-col:1730
.pl-sec-title:1731 · .pl-feed:1732,1735,1742 · .pl-feed-row:1736,1740,1741 · .pl-assets-wrap:1744 · .pl-assets:1745 · .pl-asset:1748,1752,1759
.pl-asset-emoji:1753 · .pl-asset-n:1754 · .pl-pets-wrap:1761 · .pl-pets:1762 · .pl-pet:1763,1768,1770 · .pl-pet-nm:1771
.img-lightbox:1774,1779,1780,1784(+3) · .settings-box:1797,1798,1843,1848(+20) · .set-feed-head:1799 · .set-feed-sub:1803 · .set-feed-row:1804 · .pillinfo-val:1809
.pillinfo-desc:1814,1833 · .pillinfo-box:1825 · .plf-head:1828 · .plf-emoji:1829 · .plf-ht:1830,1831,1832 · .plf-foot:1834
.alert-box:1839 · .attn-box:1840 · .help-box:1872,1873,1874 · .food-box:1895 · .home-shop-box:1897 · .summary-box:1898
.report-box:1899 · .wl-grid:1902 · .tc-wrap:1904 · .spell-btn:1910,1915 · .sp-hud:1916 · .sp-word:1918
.sp-ch:1919,1924 · .sp-th:1926 · .sp-hint:1928 · .sp-exit:1931,1935 · .sp-banner:1936 · .sp-big:1941
.sp-thb:1943 · .sp-coin:1944 · #spell-confetti:1949 · .sp-rb:1950 · .sp-day:1960 · .sp-perfect:1962
.sp-late:1964 · #spell-coinpop:1967 · .side-sub:2076,2078 · .sec-quest:2081 · .on-page:2092,2093,2094,2095 · .inbox-overlay:2105
.ib-box:2107 · .ib-head:2111 · .ib-close:2115,2117 · .ib-list:2118,2119 · .ib-row:2120,2121,2122,2123 · .ib-ava:2124
.ib-on:2128 · .ib-mid:2130 · .ib-name:2131 · .ib-last:2132 · .ib-meta:2133 · .ib-time:2134
.ib-dot:2136 · .ib-story-badge:2139 · .ib-empty:2143 · .ib-story:2145,2147 · .ib-story-item:2148,2150,2157 · .ib-story-ava:2151
.ib-story-on:2155 · .ib-world:2160,2163 · #btn-music:2168,2171,2172 · #ws-overlay:2187 · #ws-board:2189,2195,2197 · .ws-head:2199
.ws-title:2200 · .ws-grade:2202 · .ws-body:2204 · .ws-gridwrap:2205 · #ws-grid:2206 · .ws-cell:2210,2214,2216,2224(+1)
.ws-flash:2228,2230 · .ws-coinpop:2234 · .ws-side:2245 · .ws-find:2246 · #ws-words:2248,2250 · .ws-word:2251,2255,2257
#ws-prog:2258 · .ws-actions:2259,2260,2262 · #ws-new:2263 · #ws-stash:2264 · #ws-clear:2265 · #ws-win:2266,2268
.ws-win-in:2269,2272

## css/style.css (1,547 บรรทัด · 422 selector)
:root:5 · *:15 · html:16,21 · input:25 · body:29 · #app:35
.screen:38,39 · h1:42 · .subtitle:43 · .egg-grid:46,63 · .egg-card:47,52,53,54(+2) · .pet-price:57,61
.egg:65,71,75 · .d1:76 · .basket:79,80,85,91(+5) · .basket-dog:89,102,103,104 · .basket-cat:90,105,106,107 · .egg-dragon:110
.topbar:125 · .topbar-coins:126 · .coin-pill:127,132,136,141(+1) · .no-anim:142,446,1264,1504(+2) · .net-coin:144 · .q-row:156,157,158,162(+1)
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
.lb-badgeline:858 · .lb-tabs:860 · .lb-tab:861,862 · .tinv-note:873 · .cat-card:879,900,918 · .cat-head:883
.cat-emoji:884 · .cat-name:885 · .cat-pass:886 · .cat-info:887 · .cat-btns:888 · .cat-btn:889,893,894,895
.band-sec-head:898,899 · .band-mine-tag:901 · .bsp-box:904 · .bsp-head:906 · .bsp-prog:907 · .bsp-grid:908
.bsp-chip:909,911,912,913 · .bsp-tick:914 · .bsp-foot:915 · .band-lock:919 · .offline-btn:920,921 · .quiz-progress:924
.quiz-phon:925 · #quiz-extra:926,928,929,930 · .quiz-word-card:931 · .quiz-speak:936 · .quiz-choice:937,942,943,944 · .quiz-score-pill:945
.stats-card:948 · .stats-title:952,1385 · .stats-row:953,954,955,956 · .game-top:959 · .back-btn:960 · .combo-pill:964
.timer-wrap:968 · .timer-fill:969,970 · .board-label:972 · .card-grid:973 · .word-card:974,980,981,982(+3) · .hint-btn:988,993
.game-endless-note:996,1001,1003,1007(+6) · .report-btn:1028,1033 · .report-box:1036 · .report-close:1037 · .rp-head:1041 · .rp-avatar:1042,1043
.rp-title:1044 · .rp-sub:1045 · .rp-levelcard:1047 · .rp-level-top:1051 · .rp-bar:1052 · .rp-bar-fill:1053
.rp-level-note:1054,1055 · .rp-grid:1057 · .rp-stat:1058 · .rp-ic:1061 · .rp-num:1062 · .rp-lbl:1063
.rp-section:1065 · .rp-h3:1066 · .rp-badge-mini:1067 · .rp-row:1068,1069,1070 · .rp-empty:1071 · .rp-badges:1072
.rp-badge:1073 · .rp-tline:1076 · .rp-tl-head:1077,1078 · .rp-tl-ems:1079 · .rp-em:1080,1081 · .rp-tl-note:1082,1083
.rp-crown:1085,1086 · .rp-wtitle:1088 · .rp-wnow:1089,1090 · .rp-wgraph:1091 · .rp-wcol:1092 · .rp-wval:1093
.rp-wbar:1094,1095 · .rp-wlbl:1096 · .rp-cheer:1098 · .report-ok:1102 · .summary-box:1105,1156,1160,1161(+2) · .sm-burst:1106
.sm-title:1108 · .sm-line:1109 · .sm-coin:1110 · .sm-matches:1116,1117 · .confetti:1119 · .sm-badge:1126
.sm-badge-all:1130 · .badge-celebrate-overlay:1133,1146 · .badge-celebrate:1137 · .bc-emoji:1143 · .bc-title:1144 · .bc-sub:1145
.sm-cheer:1150 · .sm-streak:1151,1152 · .sm-sick:1153 · .sm-btns:1154 · .float-fx:1166 · .toast:1173
.toast-warn:1180,1187,1188,1194 · .toast-clear-all:1196,1203 · .alert-box:1205 · .alert-ok:1206,1211 · .settings-box:1213 · .set-row:1214
.set-hint:1218 · .set-hint-on:1219 · .set-hint-off:1220 · .set-lwrap:1221 · .set-label:1222 · .set-desc:1223
.set-switch:1224,1228,1229,1234(+4) · .set-sw-knob:1230 · .set-sw-txt:1237 · .set-close:1243,1248 · .set-help:1249,1254 · .help-box:1256,1257,1262
.help-item:1258 · .update-banner:1270,1279,1280 · #update-reload:1281 · #update-dismiss:1285 · .levelup-overlay:1291 · .levelup-box:1295,1302,1303,1304(+4)
.bill-box:1310,1314,1315 · .tag-off:1316 · .home-decayed-img:1317 · .home-dark-img:1318 · .thirst-fill:1319 · .thirst-text:1320,1321
.toxin-fill:1324 · .toxin-text:1325,1326 · .detox-btn:1327,1332 · .shape-text:1335,1336,1337,1338(+1) · .avatar-pick:1342 · .avatar-opt:1343,1347,1348,1349
.avatar-chip-img:1353 · .avatar-chip-blk:1355 · .set-avatar-btns:1356 · .avatar-mini:1357,1361 · .set-blk-row:1363 · .set-sub2:1364
.blk-grid:1366 · .blk-mini:1367,1370,1371,1372 · .game-avatar:1375,1376,1377 · .stats-nick:1386 · .ticket-owned:1389,1393 · .collect-sub:1398
.mkt-tabs:1399 · .mkt-tab:1400,1404 · .mkt-filter:1405 · .mkt-row:1409 · .mkt-emoji:1413,1414 · .mkt-info:1415,1416
.mkt-tier-stars:1417 · .mkt-buy:1418,1423,1424 · .mkt-price-lo:1425 · .mkt-price-hi:1426 · .mkt-empty:1427 · .collect-grid:1430
.collect-cell:1431 · .cc-emoji:1432,1433 · .cc-name:1434 · .cc-count:1435 · .cc-list-btn:1436,1440 · .mkt-listhead:1441
.mkt-listing:1442 · .ml-cancel:1446 · .mkt-sold:1452,1453,1454 · .list-dialog:1461,1462,1467 · .list-hint:1466 · .collect-reveal-frame:1470,1477
.collect-reveal-img:1476 · .collect-reveal-stars:1478 · .craft-box:1481 · .craft-head:1482 · .craft-bar:1483 · .craft-fill:1484
.craft-text:1485 · .craft-btn-row:1486,1487 · .craft-go-btn:1489,1495,1496,1499 · .craft-cancel:1507,1511 · .mkt-catalog:1514,1515,1516 · .mkt-pager:1519
.pg-btn:1520,1524,1525 · .pg-mid:1526 · .pg-dots:1527 · .pg-dot:1528,1529 · .order-head:1530 · .order-row:1531,1536,1538,1540
.order-deliver:1541,1546 · .order-need:1547
