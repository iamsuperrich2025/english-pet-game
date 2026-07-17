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

## js/auth.js (389 บรรทัด · 32 รายการ)
AUTH_PUSH_MS:23 · AUTH_SDK_TIMEOUT_MS:24 · TEACHER_EMAILS:28 · isTeacher:29 · TESTER_EMAILS:42 · TESTER_COINS:43
isTester:44 · testerBoost:48 · authSetStatus:74 · authShowLogin:86 · authGateOffline:90 · authSaveRef:97
authFetchCloud:98 · authWriteCloud:99 · authDeleteCloud:100 · authWriteProfileName:101 · authPushProfile:108 · authApplyProfileName:116
authAskProfileName:132 · authEditProfileName:143 · authStart:154 · updateOfflinePill:184 · authEnterOffline:189 · authLateSync:206
authLoginClick:222 · authOnLogin:241 · authSyncOnLogin:254 · authFreshStart:283 · authAskLink:292 · authEnterGame:342
authPushSave:357 · authLogout:368

## js/dictband.js (269 บรรทัด · 20 รายการ)
BAND_EMOJI:12 · BAND_SET_REWARD:13 · BAND_DONE_BONUS:14 · bandLoad:18 · bandShortTH:36 · bandCat:44
bandSets:66 · bandSetId:75 · bandSetCat:78 · bandSetsPassed:97 · openBandSetPicker:105 · bandMine:164
bandUnlocked:165 · bandLockToast:170 · bandExamLobby:176 · updateBandExamBtn:185 · bandLobbyTick:202 · bandPlay:213
bandPlayLobby:226 · bandCardsHTML:238

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

## js/main.js (158 บรรทัด · 2 รายการ)
syncMusicBtn:79 · bootGame:113

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

## js/ui.js (6,073 บรรทัด · 237 รายการ)
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
renderDashboard:2454 · sleepBtnHTML:2836 · sleepHintHTML:2843 · sleepAllPets:2854 · wakeAllPets:2867 · feedPet:2878
openFoodMenu:2891 · feedWith:2962 · AVATAR_UI:2992 · playerAvatarHTML:2995 · SHAPE_UI:3001 · showFeedResult:3010
curePet:3046 · railCureClick:3069 · detoxPet:3081 · openFoodQuiz:3104 · renderShop:3184 · homeVisualHTML:3244
showHomeRuined:3258 · showCutNotice:3279 · renderHomeCard:3297 · payMaint:3381 · trashBillUI:3397 · payTrash:3414
UTILITY_UI:3433 · utilityBillUI:3482 · payUtility:3507 · buyUtilityFix:3533 · renderPhoneCard:3551 · buyPhone:3591
sellPhone:3613 · compLiveTotal:3634 · onlineLiveTotal:3645 · renderOnlineEarnPill:3650 · openPillInfo:3673 · renderComputerCard:3720
buyComputer:3755 · sellComputer:3778 · soldCount:3804 · soldBadge:3805 · renderTicketCard:3810 · loadScriptOnce:3866
enterAdventure3D:3882 · enterHaunted3D:3904 · advHealClick:3926 · buyTicket:3946 · renderHauntCard:3972 · buyHauntTicket:4027
renderHeliCard:4054 · buyHeliTicket:4112 · enterHeli3D:4135 · renderDroneCard:4157 · buyDroneTicket:4212 · enterDrone3D:4235
renderDriveCard:4258 · buyDriveTicket:4331 · enterDrive3D:4354 · renderSoccerCard:4387 · buySoccerTicket:4435 · enterSoccer3D:4458
WORLD3D:4482 · gotoRobotShop:4491 · scrollShopCardIntoView:4496 · railWorldClick:4499 · renderRailWorlds:4520 · tinvNoticeHTML:4579
openTinvPicker:4587 · fruitCountdown:4631 · renderFarmCard:4643 · renderFarmClock:4704 · buyFruit:4720 · sellFruit:4740
sellAllFruit:4757 · collectImg:4783 · renderFactoryCard:4789 · renderMarketCard:4836 · updateWishBadge:4891 · openWishlistDialog:4902
renderMarketBrowse:4939 · carImg:4968 · renderVehicleShop:4969 · CS_CYCLE_MS:5020 · carInteriorImg:5021 · carStatHtml:5023
renderCarShowroom:5030 · csShowBig:5056 · csInit:5083 · RS_CYCLE_MS:5106 · robotImg:5107 · renderRobotShop:5108
rsShowBig:5130 · rsInit:5151 · buyRobot:5170 · enterMecha3D:5192 · pickMechaRobot:5213 · pickDriveCar:5245
openCarBuyDialog:5288 · buyCarInsurance:5349 · payCarLoanMonthly:5368 · payCarLoanFull:5380 · carDriveBlock:5399 · gotoVehicleShop:5404
gotoMyStock:5409 · showNeedCarDialog:5415 · craftDiscount:5427 · renderFactory:5430 · renderOrdersUI:5497 · startProduce:5516
buyCollectible:5544 · cancelProduce:5572 · deliverOrder:5586 · renderOrderClock:5603 · renderCollectMine:5613 · openListDialog:5655
cancelListing:5708 · buyMarketItem:5731 · showCollectReveal:5758 · buyAC:5794 · openHomeShop:5813 · renderPetShop:5872
showLevelUp:5933 · renderStats:5970 · showTeacherCard:6041

## js/util.js (576 บรรทัด · 28 รายการ)
shuffle:6 · fmtNum:15 · escapeHTML:19 · seededRand:25 · fmtThaiDT:35 · fmtThaiDate:39
showScreen:44 · TOAST_WARN_RE:52 · restackToasts:55 · toast:77 · floatFx:97 · beep:107
sirenSynth:133 · playSpark:157 · sparkSynth:171 · thunderFx:206 · wordAudioFile:274 · speakWord:277
speakLetter:297 · pickSpeakVoice:316 · speakWordTTS:327 · askNameDialog:347 · askConfirm:387 · alertBox:404
applyNoAnim:420 · openSettings:425 · openHelp:531 · openTeacherGuide:557

## js/wordsearch.js (235 บรรทัด · 0 รายการ)

## css/lobby.css (2,282 บรรทัด · 421 selector)
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
.chat-send:371,376,377 · .pl-click:444,446,447 · .pl-overlay:448 · .pl-card:452,1708 · .pl-close:458 · .pl-head:462
.pl-grade:467 · .pl-badges:469 · .pl-badge-chip:470,474 · .pl-body:475 · .pl-loading:476 · .pl-none:477
.pl-me-tag:478 · .pl-blk-wrap:480 · .pl-blk:481 · .pl-stat:482 · .pl-lbl:487 · .pl-val:488,489
.pl-tip:490 · .chip-edit:496,501,502 · .rank-mini:508,514,515,516 · .pass-photo:518,523 · .pet-tabs:525 · .dict-box:526,530,531,532(+1)
.dict-card:538,543 · .dict-head:544,545 · .dict-list:546 · .dict-item:547,551,552,553(+5) · .lobby-mid:567 · .lobby-rail:569
.rail-worlds:587 · .rail-div:588 · .lobby-stage:603,612,656,657 · .lobby-bottom:605,610,1077,1078 · .newword-banner:618,625 · .nw-tag:626
.nw-word:631 · .nw-hint:633,634 · .nw-box:636,1845 · .nw-pop-word:637 · .nw-speak:638 · .nw-pop-phon:639
.nw-ipa:640 · .nw-pop-sent:641 · .nw-pop-mean:642 · .pet-tab:643,644,645,2169 · .stage-hero:666,681,689,834(+5) · .hero-ground:703,823,829
.hero-rank-bg:705,708,711,715(+18) · #lobby3d-canvas:728,729 · .hero-scene:733,735,742,743(+8) · .caretaker-fig:782 · .caretaker-img:785 · .caretaker-emoji:787
.blk-rig:794,795,796 · .stage-plate:856,864,875,876(+30) · .plate-title:870 · .lobby-side:913,948,953,956(+22) · .side-sec:916,2084 · .side-label:917,922
.side-label-row:924,925 · .lb-tabs-out:926,927,931 · .side-glass:935,942 · .side-card:954,1066 · #quest-card:966,990,991,992(+6) · .q-bigcard:967,996,997,1000(+1)
.qb-top:969 · .qb-emoji:970 · .qb-name:972 · .qb-bar:973,974 · .qb-row:976 · .qb-prog:977
.qb-reward:978 · .qb-go:979,983 · .q-dots:984 · .q-dot:985,986,987 · .q-bonus:988 · .feed-row:1011,1599,1604
.inv-card:1013,1015,1016 · .inv-btns:1017 · .inv-go:1018,1020 · .inv-x:1021 · #online-card:1025,2092,2093,2094(+1) · .fq-overlay:1026
.fq-box:1028,1900 · .fq-head:1032,1034 · .fq-close:1035 · .fq-sec:1037 · .fq-worlds:1038 · .fq-world:1039,1041
.fq-acts:1042 · .fq-act:1043,1046,1047 · .lobby-quiz-btn:1079 · .lobby-foodquiz-btn:1080,1081 · .lobby-play-btn:1082,1086 · .lobby-exam-btn:1088,1089,1091
.panel-overlay:1096,1101 · .panel-box:1102 · .panel-head:1109,1113 · .panel-close:1114,1119 · .panel-body:1120,1123,1124 · .panel-page:1121,1122
.collect-sub:1128 · .mkt-empty:1129 · .craft-box:1130 · .mkt-listing:1131 · .mkt-filter:1132,1454 · .hq-grid:1139
.hq-card:1140,1145,1169 · .hq-head:1146 · .hq-pic:1152,1154 · .hq-emoji:1156 · .hq-badge:1157 · .hq-stars:1161
.hq-price:1162,1167,1168,1171(+6) · .craft-credit:1175,1177,1178 · .car-grid:1185,1187,1188 · .robot-weap:1189 · .dcp-grid:1191 · .dcp-card:1193,1196,1197,1198(+10)
.levelup-box:1215,1826,1827,1898 · .dcp-box:1218,1219,1223,1224(+6) · .dcp-lock:1232 · .sold-badge:1236,1238,1239 · .rs-showroom:1241 · .rs-list:1242,1244
.rs-thumb:1245,1247,1248,1249(+1) · .rs-thumb-pic:1250,1251 · .rs-thumb-price:1252 · .rs-stage:1254 · .rs-big:1257 · .rs-big-img:1258
.rs-elec:1262,1266,1271 · .rs-edge:1272,1278 · .rs-info:1281,1282,1283,1284(+1) · .rs-buy:1286,1288,1289 · .cs-showroom:1293 · .cs-list:1294,1296
.cs-thumb:1297,1299,1300,1301(+1) · .cs-thumb-pic:1302,1303 · .cs-thumb-name:1304 · .cs-thumb-price:1305 · .cs-thumb-own:1306 · .cs-stage:1308
.cs-big:1311 · .cs-big-img:1312 · .cs-elec:1316,1320,1324 · .cs-edge:1325,1331 · .cs-interior:1334 · .cs-inr-label:1335,1336
.cs-inr-img:1337 · .cs-info:1339,1340,1341,1342(+6) · .cs-buy:1350,1352,1353,1354 · .car-emoji:1356 · .car-mine:1362 · .car-mine-pic:1367
.car-mine-info:1368 · .car-loan:1369,1370 · .car-mine-btns:1371,1372,1373 · .car-locked:1375 · .car-mine-head:1377 · .car-pick-list:1378,1379
.car-pick:1380,1382,1383 · .car-pick-pic:1384,1385 · .car-pick-name:1386,1387 · .car-pick-od:1388 · .car-buy-box:1390,1904 · .cb-pic:1391,1392,1393
.cb-lines:1394 · .cb-li:1395,1399,1400 · .cb-ins:1401,1405,1406 · .cb-plan:1407 · .cb-pl:1408,1413,1415,1419(+1) · .cb-total:1426
.cb-btns:1427,1432 · .cb-x:1428 · .shop-grid:1435 · .shop-item:1436,1441,1446,1447(+3) · .mkt-tab:1455,1456 · .pg-btn:1457,1458,1459
.pg-dot:1460 · .fr-gift-btn:1482,1487 · .gift-sec-title:1490 · .gift-in-row:1492 · .gift-out-row:1496 · .gift-in-pic:1497,1499,1500
.gift-in-info:1501,1502 · .gift-in-btns:1503 · .gift-accept:1504,1508,1510 · .gift-decline:1509 · .gift-box-card:1511 · .gift-box-from:1512,1513
.gift-note:1514 · .gift-pick-overlay:1517 · .gift-pick-box:1521 · .gift-pick-head:1527,1531 · .gift-pick-close:1532 · .gift-pick-tabs:1534
.gp-tab:1535,1539 · .gift-pick-body:1540 · .gp-chips:1541 · .gp-chip:1542,1546 · .gp-card:1547,1548 · .gp-price:1549
.gp-note:1550 · .gift-cf-pic:1551 · .chat-emoji-cats:1556 · .chat-emoji-cat:1560,1564,1565 · .chat-emoji-wrap:1566,1567 · .stage-left:1575
.pet-info-btn:1579,1586,1587 · .feed-list:1594,1598 · .feed-ico:1605 · .feed-txt:1606 · .feed-name:1607 · .feed-ago:1608
.feed-empty:1609,1612 · .pi-overlay:1614 · .pi-box:1618,1623,1624,1628(+2) · .pi-close:1630,1635,1636 · .pi-close-left:1638 · .pi-portrait:1640
.pi-care-title:1646 · .lbf-overlay:1649 · .lbf-box:1652 · .lbf-head:1657 · .lbf-title:1658 · .lbf-tabs:1659
.lbf-close:1662 · .lbf-close-l:1663 · .lbf-body:1664 · .lbf-grid:1665 · .lbf-cell:1667,1670,1671,1672(+1) · .lbf-podium:1676
.pod:1678,1705,1706 · .pod-char:1680 · .pod-base:1682 · .pod-rank:1684 · .pod-label:1686 · .pod-name:1688
.pod-sc:1690 · .pod-1:1695,1696 · .pod-2:1697,1698 · .pod-3:1699,1700 · .pod-4:1701,1702 · .pod-5:1703,1704
.pl-wide:1709,1712,1713,1714 · .pl-follow:1715,1720,1722 · .pl-unfollow:1724,1730,1731 · .pl-followers:1732 · .pl-cols:1733 · .pl-col:1734
.pl-sec-title:1735 · .pl-feed:1736,1739,1746 · .pl-feed-row:1740,1744,1745 · .pl-assets-wrap:1748 · .pl-assets:1749 · .pl-asset:1752,1756,1763
.pl-asset-emoji:1757 · .pl-asset-n:1758 · .pl-pets-wrap:1765 · .pl-pets:1766 · .pl-pet:1767,1772,1774 · .pl-pet-nm:1775
.img-lightbox:1778,1783,1784,1788(+3) · .settings-box:1801,1802,1847,1852(+20) · .set-feed-head:1803 · .set-feed-sub:1807 · .set-feed-row:1808 · .pillinfo-val:1813
.pillinfo-desc:1818,1837 · .pillinfo-box:1829 · .plf-head:1832 · .plf-emoji:1833 · .plf-ht:1834,1835,1836 · .plf-foot:1838
.alert-box:1843 · .attn-box:1844 · .help-box:1876,1877,1878 · .food-box:1899 · .home-shop-box:1901 · .summary-box:1902
.report-box:1903 · .wl-grid:1906 · .tc-wrap:1908 · .spell-btn:1914,1919 · .sp-hud:1920 · .sp-word:1922
.sp-ch:1923,1928 · .sp-th:1930 · .sp-hint:1932 · .sp-exit:1935,1939 · .sp-banner:1940 · .sp-big:1945
.sp-thb:1947 · .sp-coin:1948 · #spell-confetti:1953 · .sp-rb:1954 · .sp-day:1964 · .sp-perfect:1966
.sp-late:1968 · #spell-coinpop:1971 · .side-sub:2080,2082 · .sec-quest:2085 · .on-page:2096,2097,2098,2099 · .inbox-overlay:2109
.ib-box:2111 · .ib-head:2115 · .ib-close:2119,2121 · .ib-list:2122,2123 · .ib-row:2124,2125,2126,2127 · .ib-ava:2128
.ib-on:2132 · .ib-mid:2134 · .ib-name:2135 · .ib-last:2136 · .ib-meta:2137 · .ib-time:2138
.ib-dot:2140 · .ib-story-badge:2143 · .ib-empty:2147 · .ib-story:2149,2151 · .ib-story-item:2152,2154,2161 · .ib-story-ava:2155
.ib-story-on:2159 · .ib-world:2164,2167 · #btn-music:2172,2175,2176 · #ws-overlay:2191 · #ws-board:2193,2199,2201 · .ws-head:2203
.ws-title:2204 · .ws-grade:2206 · .ws-body:2208 · .ws-gridwrap:2209 · #ws-grid:2210 · .ws-cell:2214,2218,2220,2228(+1)
.ws-flash:2232,2234 · .ws-coinpop:2238 · .ws-side:2249 · .ws-find:2250 · #ws-words:2252,2254 · .ws-word:2255,2259,2261
#ws-prog:2262 · .ws-actions:2263,2264,2266 · #ws-new:2267 · #ws-stash:2268 · #ws-clear:2269 · #ws-win:2270,2272
.ws-win-in:2273,2276

## css/style.css (1,553 บรรทัด · 424 selector)
:root:5 · *:15 · html:16,21 · input:25 · body:29 · #app:35
.screen:38,39 · h1:42 · .subtitle:43 · .egg-grid:46,63 · .egg-card:47,52,53,54(+2) · .pet-price:57,61
.egg:65,71,75 · .d1:76 · .basket:79,80,85,91(+5) · .basket-dog:89,102,103,104 · .basket-cat:90,105,106,107 · .egg-dragon:110
.topbar:125 · .topbar-coins:126 · .coin-pill:127,132,136,141(+2) · .no-anim:142,446,1270,1510(+2) · .net-coin:144 · .q-row:156,157,158,162(+1)
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
.lb-badgeline:858 · .lb-tabs:860 · .lb-tab:861,862 · .tinv-note:873 · .cat-card:879,900,922 · .cat-head:883
.cat-emoji:884 · .cat-name:885 · .cat-pass:886 · .cat-info:887 · .cat-btns:888 · .cat-btn:889,893,894,895
.band-sec-head:898,899 · .band-mine-tag:901 · .bsp-box:904 · .bsp-head:906 · .bsp-prog:907 · .bsp-grid:908
.bsp-chip:909,912,913,914(+1) · .bsp-num:916 · .bsp-best:917 · .bsp-tick:918 · .bsp-foot:919 · .band-lock:923
.offline-btn:924,925 · .quiz-progress:930 · .quiz-phon:931 · #quiz-extra:932,934,935,936 · .quiz-word-card:937 · .quiz-speak:942
.quiz-choice:943,948,949,950 · .quiz-score-pill:951 · .stats-card:954 · .stats-title:958,1391 · .stats-row:959,960,961,962 · .game-top:965
.back-btn:966 · .combo-pill:970 · .timer-wrap:974 · .timer-fill:975,976 · .board-label:978 · .card-grid:979
.word-card:980,986,987,988(+3) · .hint-btn:994,999 · .game-endless-note:1002,1007,1009,1013(+6) · .report-btn:1034,1039 · .report-box:1042 · .report-close:1043
.rp-head:1047 · .rp-avatar:1048,1049 · .rp-title:1050 · .rp-sub:1051 · .rp-levelcard:1053 · .rp-level-top:1057
.rp-bar:1058 · .rp-bar-fill:1059 · .rp-level-note:1060,1061 · .rp-grid:1063 · .rp-stat:1064 · .rp-ic:1067
.rp-num:1068 · .rp-lbl:1069 · .rp-section:1071 · .rp-h3:1072 · .rp-badge-mini:1073 · .rp-row:1074,1075,1076
.rp-empty:1077 · .rp-badges:1078 · .rp-badge:1079 · .rp-tline:1082 · .rp-tl-head:1083,1084 · .rp-tl-ems:1085
.rp-em:1086,1087 · .rp-tl-note:1088,1089 · .rp-crown:1091,1092 · .rp-wtitle:1094 · .rp-wnow:1095,1096 · .rp-wgraph:1097
.rp-wcol:1098 · .rp-wval:1099 · .rp-wbar:1100,1101 · .rp-wlbl:1102 · .rp-cheer:1104 · .report-ok:1108
.summary-box:1111,1162,1166,1167(+2) · .sm-burst:1112 · .sm-title:1114 · .sm-line:1115 · .sm-coin:1116 · .sm-matches:1122,1123
.confetti:1125 · .sm-badge:1132 · .sm-badge-all:1136 · .badge-celebrate-overlay:1139,1152 · .badge-celebrate:1143 · .bc-emoji:1149
.bc-title:1150 · .bc-sub:1151 · .sm-cheer:1156 · .sm-streak:1157,1158 · .sm-sick:1159 · .sm-btns:1160
.float-fx:1172 · .toast:1179 · .toast-warn:1186,1193,1194,1200 · .toast-clear-all:1202,1209 · .alert-box:1211 · .alert-ok:1212,1217
.settings-box:1219 · .set-row:1220 · .set-hint:1224 · .set-hint-on:1225 · .set-hint-off:1226 · .set-lwrap:1227
.set-label:1228 · .set-desc:1229 · .set-switch:1230,1234,1235,1240(+4) · .set-sw-knob:1236 · .set-sw-txt:1243 · .set-close:1249,1254
.set-help:1255,1260 · .help-box:1262,1263,1268 · .help-item:1264 · .update-banner:1276,1285,1286 · #update-reload:1287 · #update-dismiss:1291
.levelup-overlay:1297 · .levelup-box:1301,1308,1309,1310(+4) · .bill-box:1316,1320,1321 · .tag-off:1322 · .home-decayed-img:1323 · .home-dark-img:1324
.thirst-fill:1325 · .thirst-text:1326,1327 · .toxin-fill:1330 · .toxin-text:1331,1332 · .detox-btn:1333,1338 · .shape-text:1341,1342,1343,1344(+1)
.avatar-pick:1348 · .avatar-opt:1349,1353,1354,1355 · .avatar-chip-img:1359 · .avatar-chip-blk:1361 · .set-avatar-btns:1362 · .avatar-mini:1363,1367
.set-blk-row:1369 · .set-sub2:1370 · .blk-grid:1372 · .blk-mini:1373,1376,1377,1378 · .game-avatar:1381,1382,1383 · .stats-nick:1392
.ticket-owned:1395,1399 · .collect-sub:1404 · .mkt-tabs:1405 · .mkt-tab:1406,1410 · .mkt-filter:1411 · .mkt-row:1415
.mkt-emoji:1419,1420 · .mkt-info:1421,1422 · .mkt-tier-stars:1423 · .mkt-buy:1424,1429,1430 · .mkt-price-lo:1431 · .mkt-price-hi:1432
.mkt-empty:1433 · .collect-grid:1436 · .collect-cell:1437 · .cc-emoji:1438,1439 · .cc-name:1440 · .cc-count:1441
.cc-list-btn:1442,1446 · .mkt-listhead:1447 · .mkt-listing:1448 · .ml-cancel:1452 · .mkt-sold:1458,1459,1460 · .list-dialog:1467,1468,1473
.list-hint:1472 · .collect-reveal-frame:1476,1483 · .collect-reveal-img:1482 · .collect-reveal-stars:1484 · .craft-box:1487 · .craft-head:1488
.craft-bar:1489 · .craft-fill:1490 · .craft-text:1491 · .craft-btn-row:1492,1493 · .craft-go-btn:1495,1501,1502,1505 · .craft-cancel:1513,1517
.mkt-catalog:1520,1521,1522 · .mkt-pager:1525 · .pg-btn:1526,1530,1531 · .pg-mid:1532 · .pg-dots:1533 · .pg-dot:1534,1535
.order-head:1536 · .order-row:1537,1542,1544,1546 · .order-deliver:1547,1552 · .order-need:1553
