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

## js/dictband.js (362 บรรทัด · 25 รายการ)
BAND_EMOJI:12 · BAND_SET_REWARD:13 · BAND_DONE_BONUS:14 · bandLoad:18 · bandShortTH:36 · bandCat:44
bandSets:66 · bandSetId:75 · bandCheckComplete:78 · bandSetCat:92 · BAND_RETAKE_MAX:104 · bandTriedSets:105
bandRetakeCat:116 · bandShowRetakeSummary:150 · bandSetsPassed:178 · openBandSetPicker:186 · bandMine:257 · bandUnlocked:258
bandLockToast:263 · bandExamLobby:269 · updateBandExamBtn:278 · bandLobbyTick:295 · bandPlay:306 · bandPlayLobby:319
bandCardsHTML:331

## js/game.js (866 บรรทัด · 50 รายการ)
REPLAY_BONUS_EVERY:23 · REPLAY_BONUS_TIERS:25 · replayBonusFor:26 · SESSION_MILESTONES:32 · addSessionCoins:35 · updateBestTarget:74
weekKeyStr:87 · rolloverWeekBest:93 · exitGame:99 · showSessionSummary:132 · sprinkleConfetti:179 · VOCAB_PER_LEVEL:198
VOCAB_RANK_NAMES:199 · vocabRankName:200 · showProgressReport:202 · THUNDER_MS:346 · THUNDER_TIERS:350 · THUNDER_TIER_UI:351
thunderEmoji:352 · DAREDEVIL_TIERS:356 · DAREDEVIL_TIER_UI:357 · daredevilEmoji:358 · DILIGENT_TIERS:362 · DILIGENT_TIER_UI:363
diligentEmoji:364 · MECHABOSS_TIERS:368 · MECHABOSS_TIER_UI:369 · mechaBossEmoji:370 · badgeSuffix:375 · BADGE_META:386
NAME_BADGE_RE:394 · splitNameBadges:395 · badgeEmojis:401 · badgeScore:406 · checkCrown:412 · currentBadgeScore:428
rolloverBadgeWeek:432 · addDiligent:445 · celebrateBadge:461 · addThunder:475 · startGame:489 · newRound:524
updateTimerBar:563 · updateComboPill:569 · pickCard:573 · checkMatch:585 · renderCats:695 · startQuiz:729
renderQuizQuestion:745 · finishQuiz:803

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
renderDashboard:2454 · sleepBtnHTML:2826 · sleepHintHTML:2833 · sleepAllPets:2844 · wakeAllPets:2857 · feedPet:2868
openFoodMenu:2881 · feedWith:2952 · AVATAR_UI:2982 · playerAvatarHTML:2985 · SHAPE_UI:2991 · showFeedResult:3000
curePet:3036 · railCureClick:3059 · detoxPet:3071 · openFoodQuiz:3094 · renderShop:3174 · homeVisualHTML:3234
showHomeRuined:3248 · showCutNotice:3269 · renderHomeCard:3287 · payMaint:3371 · trashBillUI:3387 · payTrash:3404
UTILITY_UI:3423 · utilityBillUI:3472 · payUtility:3497 · buyUtilityFix:3523 · renderPhoneCard:3541 · buyPhone:3581
sellPhone:3603 · compLiveTotal:3624 · onlineLiveTotal:3635 · renderOnlineEarnPill:3640 · openPillInfo:3663 · renderComputerCard:3710
buyComputer:3745 · sellComputer:3768 · soldCount:3794 · soldBadge:3795 · renderTicketCard:3800 · loadScriptOnce:3856
enterAdventure3D:3872 · enterHaunted3D:3894 · advHealClick:3916 · buyTicket:3936 · renderHauntCard:3962 · buyHauntTicket:4017
renderHeliCard:4044 · buyHeliTicket:4102 · enterHeli3D:4125 · renderDroneCard:4147 · buyDroneTicket:4202 · enterDrone3D:4225
renderDriveCard:4248 · buyDriveTicket:4321 · enterDrive3D:4344 · renderSoccerCard:4377 · buySoccerTicket:4425 · enterSoccer3D:4448
WORLD3D:4472 · gotoRobotShop:4481 · scrollShopCardIntoView:4486 · railWorldClick:4489 · renderRailWorlds:4510 · tinvNoticeHTML:4569
openTinvPicker:4577 · fruitCountdown:4621 · renderFarmCard:4633 · renderFarmClock:4694 · buyFruit:4710 · sellFruit:4730
sellAllFruit:4747 · collectImg:4773 · renderFactoryCard:4779 · renderMarketCard:4826 · updateWishBadge:4881 · openWishlistDialog:4892
renderMarketBrowse:4929 · carImg:4958 · renderVehicleShop:4959 · CS_CYCLE_MS:5010 · carInteriorImg:5011 · carStatHtml:5013
renderCarShowroom:5020 · csShowBig:5046 · csInit:5073 · RS_CYCLE_MS:5096 · robotImg:5097 · renderRobotShop:5098
rsShowBig:5120 · rsInit:5141 · buyRobot:5160 · enterMecha3D:5182 · pickMechaRobot:5203 · pickDriveCar:5235
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

## css/lobby.css (2,276 บรรทัด · 421 selector)
:root:6 · html:15 · body:16 · *:33,34,35,36 · #app:39 · h1:41
.subtitle:42 · .shop-title:43 · #rotate-overlay:46 · .screen:68 · #screen-select:77,78,79,80(+5) · .egg-need:87
.petshop-topright:89 · .petshop-play-link:90,95 · .word-card:133 · .quiz-choice:134,135,136 · .big-btn:139,140,141,142 · #screen-dashboard:147,644,652
.lobby-top:154,559,560,561(+2) · .top-flex:155 · .profile-plate:156,160,503 · #rain-fx:165 · .rain-layer:168,174 · .rain-glass:181
.glass-drop:182 · .rail-btn:197,570,576,577(+13) · .rail-badge:198 · .fr-code-box:203 · .fr-code-label:207 · .fr-code-row:208
.fr-code:209 · .fr-copy-btn:214,218,223,224 · .fr-search-btn:219 · .fr-add-btn:220 · .fr-accept:221 · .fr-decline:222
#fr-search-input:225 · #fr-search-result:229 · .fr-found:230 · .fr-hint:234 · .fr-list-title:235 · .fr-row:236
.fr-req:240 · .fr-row-name:242,246 · .fr-row-status:250 · .fr-req-btns:251 · .online-dot:252 · .fr-chat-btn:253,258,260
.fr-unread:261 · .chat-overlay:268 · .chat-box:272,381,388,395(+12) · .chat-head:284 · .chat-theme-btn:289,293 · .chat-secret-tg:294,295
.cs-switch:296,297,302,303 · .cs-slider:298,300 · .chat-secret-note:304 · .chat-theme-strip:307 · .chat-theme-sw:309,312,313,314(+1) · .chat-head-name:316,317
.chat-close:318 · .chat-msgs:322 · .chat-empty:326 · .chat-typing:328 · .ct-dots:330,331,333,334 · .no-anim:336,349,622,693(+22)
.chat-bubble:337,342,347 · .chat-emoji:350 · .chat-emo:354,358 · .chat-input-row:359 · .chat-emoji-btn:363 · #chat-input:367
.chat-send:371,376,377 · .pl-click:444,446,447 · .pl-overlay:448 · .pl-card:452,1702 · .pl-close:458 · .pl-head:462
.pl-grade:467 · .pl-badges:469 · .pl-badge-chip:470,474 · .pl-body:475 · .pl-loading:476 · .pl-none:477
.pl-me-tag:478 · .pl-blk-wrap:480 · .pl-blk:481 · .pl-stat:482 · .pl-lbl:487 · .pl-val:488,489
.pl-tip:490 · .chip-edit:496,501,502 · .rank-mini:508,514,515,516 · .pass-photo:518,523 · .pet-tabs:525 · .dict-box:526,530,531,532(+1)
.dict-card:538,543 · .dict-head:544,545 · .dict-list:546 · .dict-item:547,551,552,553(+5) · .lobby-mid:567 · .lobby-rail:569
.rail-worlds:587 · .rail-div:588 · .lobby-stage:603,605,649,650 · .newword-banner:611,618 · .nw-tag:619 · .nw-word:624
.nw-hint:626,627 · .nw-box:629,1839 · .nw-pop-word:630 · .nw-speak:631 · .nw-pop-phon:632 · .nw-ipa:633
.nw-pop-sent:634 · .nw-pop-mean:635 · .pet-tab:636,637,638,2163 · .stage-hero:659,674,682,827(+5) · .hero-ground:696,816,822 · .hero-rank-bg:698,701,704,708(+18)
#lobby3d-canvas:721,722 · .hero-scene:726,728,735,736(+8) · .caretaker-fig:775 · .caretaker-img:778 · .caretaker-emoji:780 · .blk-rig:787,788,789
.stage-plate:849,857,868,869(+30) · .plate-title:863 · .lobby-side:906,941,946,949(+22) · .side-sec:909,2078 · .side-label:910,915 · .side-label-row:917,918
.lb-tabs-out:919,920,924 · .side-glass:928,935 · .side-card:947,1059 · #quest-card:959,983,984,985(+6) · .q-bigcard:960,989,990,993(+1) · .qb-top:962
.qb-emoji:963 · .qb-name:965 · .qb-bar:966,967 · .qb-row:969 · .qb-prog:970 · .qb-reward:971
.qb-go:972,976 · .q-dots:977 · .q-dot:978,979,980 · .q-bonus:981 · .feed-row:1004,1593,1598 · .inv-card:1006,1008,1009
.inv-btns:1010 · .inv-go:1011,1013 · .inv-x:1014 · #online-card:1018,2086,2087,2088(+1) · .fq-overlay:1019 · .fq-box:1021,1894
.fq-head:1025,1027 · .fq-close:1028 · .fq-sec:1030 · .fq-worlds:1031 · .fq-world:1032,1034 · .fq-acts:1035
.fq-act:1036,1039,1040 · .lobby-bottom:1070,1072 · .lobby-quiz-btn:1073 · .lobby-foodquiz-btn:1074,1075 · .lobby-play-btn:1076,1080 · .lobby-exam-btn:1082,1083,1085
.panel-overlay:1090,1095 · .panel-box:1096 · .panel-head:1103,1107 · .panel-close:1108,1113 · .panel-body:1114,1117,1118 · .panel-page:1115,1116
.collect-sub:1122 · .mkt-empty:1123 · .craft-box:1124 · .mkt-listing:1125 · .mkt-filter:1126,1448 · .hq-grid:1133
.hq-card:1134,1139,1163 · .hq-head:1140 · .hq-pic:1146,1148 · .hq-emoji:1150 · .hq-badge:1151 · .hq-stars:1155
.hq-price:1156,1161,1162,1165(+6) · .craft-credit:1169,1171,1172 · .car-grid:1179,1181,1182 · .robot-weap:1183 · .dcp-grid:1185 · .dcp-card:1187,1190,1191,1192(+10)
.levelup-box:1209,1820,1821,1892 · .dcp-box:1212,1213,1217,1218(+6) · .dcp-lock:1226 · .sold-badge:1230,1232,1233 · .rs-showroom:1235 · .rs-list:1236,1238
.rs-thumb:1239,1241,1242,1243(+1) · .rs-thumb-pic:1244,1245 · .rs-thumb-price:1246 · .rs-stage:1248 · .rs-big:1251 · .rs-big-img:1252
.rs-elec:1256,1260,1265 · .rs-edge:1266,1272 · .rs-info:1275,1276,1277,1278(+1) · .rs-buy:1280,1282,1283 · .cs-showroom:1287 · .cs-list:1288,1290
.cs-thumb:1291,1293,1294,1295(+1) · .cs-thumb-pic:1296,1297 · .cs-thumb-name:1298 · .cs-thumb-price:1299 · .cs-thumb-own:1300 · .cs-stage:1302
.cs-big:1305 · .cs-big-img:1306 · .cs-elec:1310,1314,1318 · .cs-edge:1319,1325 · .cs-interior:1328 · .cs-inr-label:1329,1330
.cs-inr-img:1331 · .cs-info:1333,1334,1335,1336(+6) · .cs-buy:1344,1346,1347,1348 · .car-emoji:1350 · .car-mine:1356 · .car-mine-pic:1361
.car-mine-info:1362 · .car-loan:1363,1364 · .car-mine-btns:1365,1366,1367 · .car-locked:1369 · .car-mine-head:1371 · .car-pick-list:1372,1373
.car-pick:1374,1376,1377 · .car-pick-pic:1378,1379 · .car-pick-name:1380,1381 · .car-pick-od:1382 · .car-buy-box:1384,1898 · .cb-pic:1385,1386,1387
.cb-lines:1388 · .cb-li:1389,1393,1394 · .cb-ins:1395,1399,1400 · .cb-plan:1401 · .cb-pl:1402,1407,1409,1413(+1) · .cb-total:1420
.cb-btns:1421,1426 · .cb-x:1422 · .shop-grid:1429 · .shop-item:1430,1435,1440,1441(+3) · .mkt-tab:1449,1450 · .pg-btn:1451,1452,1453
.pg-dot:1454 · .fr-gift-btn:1476,1481 · .gift-sec-title:1484 · .gift-in-row:1486 · .gift-out-row:1490 · .gift-in-pic:1491,1493,1494
.gift-in-info:1495,1496 · .gift-in-btns:1497 · .gift-accept:1498,1502,1504 · .gift-decline:1503 · .gift-box-card:1505 · .gift-box-from:1506,1507
.gift-note:1508 · .gift-pick-overlay:1511 · .gift-pick-box:1515 · .gift-pick-head:1521,1525 · .gift-pick-close:1526 · .gift-pick-tabs:1528
.gp-tab:1529,1533 · .gift-pick-body:1534 · .gp-chips:1535 · .gp-chip:1536,1540 · .gp-card:1541,1542 · .gp-price:1543
.gp-note:1544 · .gift-cf-pic:1545 · .chat-emoji-cats:1550 · .chat-emoji-cat:1554,1558,1559 · .chat-emoji-wrap:1560,1561 · .stage-left:1569
.pet-info-btn:1573,1580,1581 · .feed-list:1588,1592 · .feed-ico:1599 · .feed-txt:1600 · .feed-name:1601 · .feed-ago:1602
.feed-empty:1603,1606 · .pi-overlay:1608 · .pi-box:1612,1617,1618,1622(+2) · .pi-close:1624,1629,1630 · .pi-close-left:1632 · .pi-portrait:1634
.pi-care-title:1640 · .lbf-overlay:1643 · .lbf-box:1646 · .lbf-head:1651 · .lbf-title:1652 · .lbf-tabs:1653
.lbf-close:1656 · .lbf-close-l:1657 · .lbf-body:1658 · .lbf-grid:1659 · .lbf-cell:1661,1664,1665,1666(+1) · .lbf-podium:1670
.pod:1672,1699,1700 · .pod-char:1674 · .pod-base:1676 · .pod-rank:1678 · .pod-label:1680 · .pod-name:1682
.pod-sc:1684 · .pod-1:1689,1690 · .pod-2:1691,1692 · .pod-3:1693,1694 · .pod-4:1695,1696 · .pod-5:1697,1698
.pl-wide:1703,1706,1707,1708 · .pl-follow:1709,1714,1716 · .pl-unfollow:1718,1724,1725 · .pl-followers:1726 · .pl-cols:1727 · .pl-col:1728
.pl-sec-title:1729 · .pl-feed:1730,1733,1740 · .pl-feed-row:1734,1738,1739 · .pl-assets-wrap:1742 · .pl-assets:1743 · .pl-asset:1746,1750,1757
.pl-asset-emoji:1751 · .pl-asset-n:1752 · .pl-pets-wrap:1759 · .pl-pets:1760 · .pl-pet:1761,1766,1768 · .pl-pet-nm:1769
.img-lightbox:1772,1777,1778,1782(+3) · .settings-box:1795,1796,1841,1846(+20) · .set-feed-head:1797 · .set-feed-sub:1801 · .set-feed-row:1802 · .pillinfo-val:1807
.pillinfo-desc:1812,1831 · .pillinfo-box:1823 · .plf-head:1826 · .plf-emoji:1827 · .plf-ht:1828,1829,1830 · .plf-foot:1832
.alert-box:1837 · .attn-box:1838 · .help-box:1870,1871,1872 · .food-box:1893 · .home-shop-box:1895 · .summary-box:1896
.report-box:1897 · .wl-grid:1900 · .tc-wrap:1902 · .spell-btn:1908,1913 · .sp-hud:1914 · .sp-word:1916
.sp-ch:1917,1922 · .sp-th:1924 · .sp-hint:1926 · .sp-exit:1929,1933 · .sp-banner:1934 · .sp-big:1939
.sp-thb:1941 · .sp-coin:1942 · #spell-confetti:1947 · .sp-rb:1948 · .sp-day:1958 · .sp-perfect:1960
.sp-late:1962 · #spell-coinpop:1965 · .side-sub:2074,2076 · .sec-quest:2079 · .on-page:2090,2091,2092,2093 · .inbox-overlay:2103
.ib-box:2105 · .ib-head:2109 · .ib-close:2113,2115 · .ib-list:2116,2117 · .ib-row:2118,2119,2120,2121 · .ib-ava:2122
.ib-on:2126 · .ib-mid:2128 · .ib-name:2129 · .ib-last:2130 · .ib-meta:2131 · .ib-time:2132
.ib-dot:2134 · .ib-story-badge:2137 · .ib-empty:2141 · .ib-story:2143,2145 · .ib-story-item:2146,2148,2155 · .ib-story-ava:2149
.ib-story-on:2153 · .ib-world:2158,2161 · #btn-music:2166,2169,2170 · #ws-overlay:2185 · #ws-board:2187,2193,2195 · .ws-head:2197
.ws-title:2198 · .ws-grade:2200 · .ws-body:2202 · .ws-gridwrap:2203 · #ws-grid:2204 · .ws-cell:2208,2212,2214,2222(+1)
.ws-flash:2226,2228 · .ws-coinpop:2232 · .ws-side:2243 · .ws-find:2244 · #ws-words:2246,2248 · .ws-word:2249,2253,2255
#ws-prog:2256 · .ws-actions:2257,2258,2260 · #ws-new:2261 · #ws-stash:2262 · #ws-clear:2263 · #ws-win:2264,2266
.ws-win-in:2267,2270

## css/style.css (1,570 บรรทัด · 433 selector)
:root:5 · *:15 · html:16,21 · input:25 · body:29 · #app:35
.screen:38,39 · h1:42 · .subtitle:43 · .egg-grid:46,63 · .egg-card:47,52,53,54(+2) · .pet-price:57,61
.egg:65,71,75 · .d1:76 · .basket:79,80,85,91(+5) · .basket-dog:89,102,103,104 · .basket-cat:90,105,106,107 · .egg-dragon:110
.topbar:125 · .topbar-coins:126 · .coin-pill:127,132,136,141(+2) · .no-anim:142,439,1287,1527(+2) · .net-coin:144 · .q-row:156,157,158,162(+1)
.q-emoji:159 · .q-mid:160 · .q-name:161 · .q-bar:163,164 · .q-right:166,167 · .q-foot:168,169
.tc-open:172,173 · .tc-wrap:174 · .tc-card:175 · .tc-head:179 · .tc-sub:183 · .tc-name:184,185
.tc-badges:186 · .tc-when:187 · .tc-row:188,192 · .tc-pass:193 · .tc-try:194 · .tc-sign:195
.tc-hint:196 · .tc-close:197 · .mb-seller:203 · .mb-buy:204 · .wl-open:207,212 · .wl-box:213
.wl-grid:214 · .wl-it:218,222,223,224 · .wl-emoji:225 · .wl-name:226 · .wl-h:227 · .hq-card:228
.icon-btn:229 · #settings-badge:235 · .badge-pop:238 · .attn-box:240,241,258 · .attn-list:242 · .attn-row:243,248
.attn-ico:249 · .attn-txt:250,251 · .attn-go:252 · .attn-total:253,257 · .rain-banner:261,266,267,268 · .rain-row:270
.rain-icon:271 · .rain-track:272 · .rain-fill:276 · .rain-note:277 · .comp-earn:280,292,296,297(+1) · .comp-earn-label:285
.comp-earn-num:286,290 · .comp-earn-sub:291 · .farm-shop:301 · .farm-buy-btn:302,308,310 · .farm-buy-emoji:309 · .farm-list:311
.farm-tree:312,316,321,326 · .farm-tree-emoji:320 · .farm-tree-info:323,324 · .farm-tree-status:325 · .farm-grow-badge:327 · .farm-sell-btn:328,332
.farm-sellall-btn:333,339,340 · .rank-card:343 · .rank-badge-wrap:348 · .rank-badge-img:349 · .rank-badge-emoji:350 · .rank-body:351
.rank-name:352,353 · .rank-bar:354 · .rank-fill:355 · .rank-text:356 · .rankup-overlay:359 · .rankup-rays:365
.rankup-content:381 · .rankup-title:386 · .rankup-badge:391,404 · .rankup-badge-img:403 · .rankup-name:405 · .rankup-en:409
.rankup-sub:413 · .rankup-btn:414,421,422 · .cr-btn-row:424 · .rankup-btn-2:425,426 · .thunder-fx:429 · .quake:430
.pet-tabs:442 · .pet-tab:443,449,450 · .pet-card:452 · .pet-stage:457 · .aura:458,464 · .sp1:465
.pet-wrap:468 · .pet-emoji:469 · .pet-img:470 · .egg-img:471 · .feed-pet:472,618 · .pet-baby:473
.pet-adult:474 · .pet-egg-stage:476 · .wear:478 · .wear-head:479 · .wear-face:480 · .wear-neck:481
.pet-name:483 · .stage-label:484 · .level-row:485 · .level-badge:486 · .exp-bar:490 · .exp-fill:491
.exp-text:492 · .ability-box:494,498 · .hunger-bar:501 · .hunger-fill:502,503,504 · .food-item:510,552,556,557(+6) · .hunger-text:514
.heat-bar:517 · .heat-fill:518 · .heat-text:519,520,521 · .care-row:523 · .care-btn:524,528,531 · .btn-feed:529
.btn-cure:530 · .sick-banner:532 · .pet-sick:536 · .pet-asleep:539 · .sleep-badge:540 · .btn-sleep:542
.dinner-btn:545 · .food-box:549,550 · .food-grid:551 · .fav-tag:571 · .fd-exp:575 · .food-sec:577
.food-sec-human:581 · .bad-tag:583 · .fd-toxin:587 · .fd-safe:588 · .fq-box:591,592 · .fq-progress:593
.fq-pair:594,595 · .fq-ask:596 · .fq-why:597 · .fq-btns:601,602,606 · .fq-yes:607 · .fq-no:608
.fq-next:609 · .food-cancel:610 · .feed-box:616,617 · .feed-gain:619 · .sick-badge:623 · .big-btn:629,635,856,857(+6)
.shop-card:638 · .shop-title:642 · .shop-grid:643 · .shop-item:644,648,649,650(+4) · .it-tag:655 · .tag-wear:656
.lock-banner:658 · .home-current:664,669,670 · .home-img:671 · .home-emoji:672 · .home-btn:673,695 · .home-layout:675
.home-pic-col:676,682 · .home-img-big:680 · .home-info-col:683,685,688,689 · .home-name-row:686 · .home-desc-row:687 · .home-shop-box:697,698
.home-list:699 · .home-option:700,704,705,706(+1) · .home-opt-img:707 · .home-opt-body:709,710 · .home-price:711 · .reset-link:716
.login-card:722 · .login-pets:723 · .login-status:724 · .google-btn:725,731,732 · .login-note:733 · .install-btn:736,742,743
.install-guide-overlay:746 · .install-guide:750,754,757 · .install-steps:755,756 · .install-guide-close:758 · .login-account:763 · .register-card:766,770,776,780
.reg-safety:772,774,775 · .student-chip:781 · .clock-chip:785 · .online-count:791 · .online-row:798,802,803 · .online-dot:807
.online-name:812 · .online-act:816 · .online-live:820 · .online-note:824 · .lb-empty:827 · .lb-list:828
.lb-row:829,833,834 · .lb-rank:838 · .lb-name:840,844 · .lb-coins:848 · .lb-hint:850 · .lb-badgeline:851
.lb-tabs:853 · .lb-tab:854,855 · .tinv-note:866 · .cat-card:872,893,939 · .cat-head:876 · .cat-emoji:877
.cat-name:878 · .cat-pass:879 · .cat-info:880 · .cat-btns:881 · .cat-btn:882,886,887,888 · .band-sec-head:891,892
.band-mine-tag:894 · .bsp-box:897 · .bsp-head:899 · .bsp-prog:900 · .bsp-retake:902,905 · .rts-box:908
.rts-head:910 · .rts-sets:911 · .rts-set:912,913,914 · .rts-sub:915 · .rts-words:916 · .rts-word:917,919,920
.rts-foot:921 · .rts-okbtn:922,924 · .bsp-grid:925 · .bsp-chip:926,929,930,931(+1) · .bsp-num:933 · .bsp-best:934
.bsp-tick:935 · .bsp-foot:936 · .band-lock:940 · .offline-btn:941,942 · .quiz-progress:947 · .quiz-phon:948
#quiz-extra:949,951,952,953 · .quiz-word-card:954 · .quiz-speak:959 · .quiz-choice:960,965,966,967 · .quiz-score-pill:968 · .stats-card:971
.stats-title:975,1408 · .stats-row:976,977,978,979 · .game-top:982 · .back-btn:983 · .combo-pill:987 · .timer-wrap:991
.timer-fill:992,993 · .board-label:995 · .card-grid:996 · .word-card:997,1003,1004,1005(+3) · .hint-btn:1011,1016 · .game-endless-note:1019,1024,1026,1030(+6)
.report-btn:1051,1056 · .report-box:1059 · .report-close:1060 · .rp-head:1064 · .rp-avatar:1065,1066 · .rp-title:1067
.rp-sub:1068 · .rp-levelcard:1070 · .rp-level-top:1074 · .rp-bar:1075 · .rp-bar-fill:1076 · .rp-level-note:1077,1078
.rp-grid:1080 · .rp-stat:1081 · .rp-ic:1084 · .rp-num:1085 · .rp-lbl:1086 · .rp-section:1088
.rp-h3:1089 · .rp-badge-mini:1090 · .rp-row:1091,1092,1093 · .rp-empty:1094 · .rp-badges:1095 · .rp-badge:1096
.rp-tline:1099 · .rp-tl-head:1100,1101 · .rp-tl-ems:1102 · .rp-em:1103,1104 · .rp-tl-note:1105,1106 · .rp-crown:1108,1109
.rp-wtitle:1111 · .rp-wnow:1112,1113 · .rp-wgraph:1114 · .rp-wcol:1115 · .rp-wval:1116 · .rp-wbar:1117,1118
.rp-wlbl:1119 · .rp-cheer:1121 · .report-ok:1125 · .summary-box:1128,1179,1183,1184(+2) · .sm-burst:1129 · .sm-title:1131
.sm-line:1132 · .sm-coin:1133 · .sm-matches:1139,1140 · .confetti:1142 · .sm-badge:1149 · .sm-badge-all:1153
.badge-celebrate-overlay:1156,1169 · .badge-celebrate:1160 · .bc-emoji:1166 · .bc-title:1167 · .bc-sub:1168 · .sm-cheer:1173
.sm-streak:1174,1175 · .sm-sick:1176 · .sm-btns:1177 · .float-fx:1189 · .toast:1196 · .toast-warn:1203,1210,1211,1217
.toast-clear-all:1219,1226 · .alert-box:1228 · .alert-ok:1229,1234 · .settings-box:1236 · .set-row:1237 · .set-hint:1241
.set-hint-on:1242 · .set-hint-off:1243 · .set-lwrap:1244 · .set-label:1245 · .set-desc:1246 · .set-switch:1247,1251,1252,1257(+4)
.set-sw-knob:1253 · .set-sw-txt:1260 · .set-close:1266,1271 · .set-help:1272,1277 · .help-box:1279,1280,1285 · .help-item:1281
.update-banner:1293,1302,1303 · #update-reload:1304 · #update-dismiss:1308 · .levelup-overlay:1314 · .levelup-box:1318,1325,1326,1327(+4) · .bill-box:1333,1337,1338
.tag-off:1339 · .home-decayed-img:1340 · .home-dark-img:1341 · .thirst-fill:1342 · .thirst-text:1343,1344 · .toxin-fill:1347
.toxin-text:1348,1349 · .detox-btn:1350,1355 · .shape-text:1358,1359,1360,1361(+1) · .avatar-pick:1365 · .avatar-opt:1366,1370,1371,1372 · .avatar-chip-img:1376
.avatar-chip-blk:1378 · .set-avatar-btns:1379 · .avatar-mini:1380,1384 · .set-blk-row:1386 · .set-sub2:1387 · .blk-grid:1389
.blk-mini:1390,1393,1394,1395 · .game-avatar:1398,1399,1400 · .stats-nick:1409 · .ticket-owned:1412,1416 · .collect-sub:1421 · .mkt-tabs:1422
.mkt-tab:1423,1427 · .mkt-filter:1428 · .mkt-row:1432 · .mkt-emoji:1436,1437 · .mkt-info:1438,1439 · .mkt-tier-stars:1440
.mkt-buy:1441,1446,1447 · .mkt-price-lo:1448 · .mkt-price-hi:1449 · .mkt-empty:1450 · .collect-grid:1453 · .collect-cell:1454
.cc-emoji:1455,1456 · .cc-name:1457 · .cc-count:1458 · .cc-list-btn:1459,1463 · .mkt-listhead:1464 · .mkt-listing:1465
.ml-cancel:1469 · .mkt-sold:1475,1476,1477 · .list-dialog:1484,1485,1490 · .list-hint:1489 · .collect-reveal-frame:1493,1500 · .collect-reveal-img:1499
.collect-reveal-stars:1501 · .craft-box:1504 · .craft-head:1505 · .craft-bar:1506 · .craft-fill:1507 · .craft-text:1508
.craft-btn-row:1509,1510 · .craft-go-btn:1512,1518,1519,1522 · .craft-cancel:1530,1534 · .mkt-catalog:1537,1538,1539 · .mkt-pager:1542 · .pg-btn:1543,1547,1548
.pg-mid:1549 · .pg-dots:1550 · .pg-dot:1551,1552 · .order-head:1553 · .order-row:1554,1559,1561,1563 · .order-deliver:1564,1569
.order-need:1570
