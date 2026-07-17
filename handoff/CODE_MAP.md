# CODE_MAP.md — แผนที่โค้ด:บรรทัด (เจนอัตโนมัติโดย `tools/gen_code_map.py` — **ห้ามแก้มือ** เดี๋ยวโดนเขียนทับ)

> วิธีใช้: หาชื่อฟังก์ชัน/ค่าคงที่/selector ในไฟล์นี้ (Grep หรือกวาดตา) → `Read` ไฟล์จริง `offset=<บรรทัด>` `limit=40`
> css = index `selector:บรรทัดทุกจุดที่ประกาศ` (บั๊ก UI เริ่มหาที่นี่) · เจนใหม่ทุกครั้งที่รัน `python tools/rotate_handoff.py` · อัปเดต: 2026-07-17

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

## js/ui.js (6,306 บรรทัด · 243 รายการ)
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
lbCoinHtml:1073 · lbBadgeHtml:1089 · lbBossHtml:1115 · bindPlayerClicks:1141 · showPlayerCard:1151 · petDescImg:1360
openImgLightbox:1373 · openPetPeek:1393 · updateBillBadges:1437 · setBadge:1449 · updateSettingsBadge:1465 · openAttentionSummary:1479
updateFriendBadge:1521 · renderFriendPanel:1531 · friendDoSearch:1579 · refreshFriendData:1603 · CHAT_EMOJI_CATS:1655 · CHAT_THEMES:1677
CHAT_SECRET_MS:1686 · chatBadgeSync:1694 · ibTimeStr:1702 · openChatInbox:1709 · openChat:1812 · giftImg:1999
giftDateStr:2001 · giftItemPic:2008 · giftItemName:2014 · updateGiftBadge:2019 · renderGiftPanel:2028 · acceptGift:2086
declineGift:2098 · showGiftReveal:2107 · openGiftPicker:2133 · confirmSendGift:2201 · doSendGift:2225 · rankBadgeHTML:2249
renderRankCard:2254 · showRankUp:2276 · bindPetPlateButtons:2311 · openPetInfoOverlay:2335 · feedAgo:2358 · renderFeedCard:2371
alignPetTabs:2424 · alignCureBtn:2441 · dictRecordLookup:2465 · DICT_FILE_COUNT:2476 · loadDict:2477 · dictSearch:2492
dictTapWords:2507 · dictEntryHTML:2511 · openDictOverlay:2522 · renderDashboard:2606 · sleepBtnHTML:2996 · sleepHintHTML:3003
sleepAllPets:3014 · wakeAllPets:3027 · feedPet:3038 · openFoodMenu:3052 · feedWith:3123 · AVATAR_UI:3153
playerAvatarHTML:3156 · SHAPE_UI:3162 · showFeedResult:3171 · curePet:3212 · heartsFx:3235 · cureCelebrateFx:3256
railCureClick:3267 · detoxPet:3279 · openFoodQuiz:3302 · renderShop:3382 · homeVisualHTML:3446 · showHomeRuined:3460
showCutNotice:3481 · renderHomeCard:3499 · payMaint:3583 · trashBillUI:3599 · payTrash:3616 · UTILITY_UI:3635
utilityBillUI:3684 · payUtility:3709 · buyUtilityFix:3735 · renderPhoneCard:3753 · buyPhone:3793 · sellPhone:3815
compLiveTotal:3836 · onlineLiveTotal:3847 · renderOnlineEarnPill:3852 · openPillInfo:3875 · renderComputerCard:3922 · buyComputer:3957
sellComputer:3980 · soldCount:4006 · soldBadge:4007 · renderTicketCard:4012 · loadScriptOnce:4068 · enterAdventure3D:4084
enterHaunted3D:4106 · advHealClick:4128 · buyTicket:4148 · renderHauntCard:4174 · buyHauntTicket:4229 · renderHeliCard:4256
buyHeliTicket:4314 · enterHeli3D:4337 · renderDroneCard:4359 · buyDroneTicket:4414 · enterDrone3D:4437 · renderDriveCard:4460
buyDriveTicket:4533 · enterDrive3D:4556 · renderSoccerCard:4589 · buySoccerTicket:4637 · enterSoccer3D:4660 · WORLD3D:4684
gotoRobotShop:4693 · scrollShopCardIntoView:4698 · railWorldClick:4701 · renderRailWorlds:4722 · tinvNoticeHTML:4781 · openTinvPicker:4789
fruitCountdown:4833 · renderFarmCard:4845 · renderFarmClock:4915 · buyFruit:4931 · sellFruit:4951 · sellAllFruit:4968
collectImg:4994 · renderFactoryCard:5000 · renderMarketCard:5047 · updateWishBadge:5102 · openWishlistDialog:5113 · bindStripArrows:5158
renderMarketBrowse:5170 · carImg:5199 · renderVehicleShop:5200 · CS_CYCLE_MS:5251 · carInteriorImg:5252 · carStatHtml:5254
renderCarShowroom:5261 · csShowBig:5287 · csInit:5314 · RS_CYCLE_MS:5337 · robotImg:5338 · renderRobotShop:5339
rsShowBig:5361 · rsInit:5382 · buyRobot:5401 · enterMecha3D:5423 · pickMechaRobot:5444 · pickDriveCar:5476
openCarBuyDialog:5519 · buyCarInsurance:5580 · payCarLoanMonthly:5599 · payCarLoanFull:5611 · carDriveBlock:5630 · gotoVehicleShop:5635
gotoMyStock:5640 · showNeedCarDialog:5646 · craftDiscount:5658 · renderFactory:5661 · renderOrdersUI:5728 · startProduce:5747
buyCollectible:5775 · cancelProduce:5803 · deliverOrder:5817 · renderOrderClock:5834 · renderCollectMine:5844 · openListDialog:5886
cancelListing:5939 · buyMarketItem:5962 · showCollectReveal:5989 · buyAC:6027 · openHomeShop:6046 · renderPetShop:6105
showLevelUp:6166 · renderStats:6203 · showTeacherCard:6274

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

## css/style.css (1,659 บรรทัด · 451 selector)
:root:5 · *:15 · html:16,21 · input:25 · body:29 · #app:35
.screen:38,39 · h1:42 · .subtitle:43 · .egg-grid:46,63 · .egg-card:47,52,53,54(+2) · .pet-price:57,61
.egg:65,71,75 · .d1:76 · .basket:79,80,85,91(+5) · .basket-dog:89,102,103,104 · .basket-cat:90,105,106,107 · .egg-dragon:110
.topbar:125 · .topbar-coins:126 · .coin-pill:127,132,136,141(+2) · .no-anim:142,490,1376,1616(+2) · .net-coin:144 · .q-row:156,157,158,162(+1)
.q-emoji:159 · .q-mid:160 · .q-name:161 · .q-bar:163,164 · .q-right:166,167 · .q-foot:168,169
.tc-open:172,173 · .tc-wrap:174 · .tc-card:175 · .tc-head:179 · .tc-sub:183 · .tc-name:184,185
.tc-badges:186 · .tc-when:187 · .tc-row:188,192 · .tc-pass:193 · .tc-try:194 · .tc-sign:195
.tc-hint:196 · .tc-close:197 · .mb-seller:203 · .mb-buy:204 · .wl-open:207,212 · .strip-wrap:215,233
.strip-x:216,223,224 · .strip-arrow:225,231,232 · .wl-box:235 · .wl-head:236,237,238 · .wl-grid:240 · .wl-it:245,249,250,251
.wl-emoji:252 · .wl-name:253 · .wl-h:254 · .hq-card:255,336 · .icon-btn:256 · #settings-badge:262
.badge-pop:265 · .attn-box:267,268,285 · .attn-list:269 · .attn-row:270,275 · .attn-ico:276 · .attn-txt:277,278
.attn-go:279 · .attn-total:280,284 · .rain-banner:288,293,294,295 · .rain-row:297 · .rain-icon:298 · .rain-track:299
.rain-fill:303 · .rain-note:304 · .comp-earn:307,319,323,324(+1) · .comp-earn-label:312 · .comp-earn-num:313,317 · .comp-earn-sub:318
.farm-sub:330 · .farm-cols:332,333 · .farm-shop:335 · .farm-hq:337,338,339 · .farm-yield:340,341 · .farm-tree:342,347,352,356
.farm-tree-emoji:351 · .farm-tree-name:354 · .farm-tree-status:355 · .farm-grow-badge:357 · .farm-sell-btn:378,383 · .farm-sellall-btn:384,390,391
.rank-card:394 · .rank-badge-wrap:399 · .rank-badge-img:400 · .rank-badge-emoji:401 · .rank-body:402 · .rank-name:403,404
.rank-bar:405 · .rank-fill:406 · .rank-text:407 · .rankup-overlay:410 · .rankup-rays:416 · .rankup-content:432
.rankup-title:437 · .rankup-badge:442,455 · .rankup-badge-img:454 · .rankup-name:456 · .rankup-en:460 · .rankup-sub:464
.rankup-btn:465,472,473 · .cr-btn-row:475 · .rankup-btn-2:476,477 · .thunder-fx:480 · .quake:481 · .pet-tabs:493
.pet-tab:494,500,501 · .pet-card:503 · .pet-stage:508 · .aura:509,515 · .sp1:516 · .pet-wrap:519
.pet-emoji:520 · .pet-img:521 · .egg-img:522 · .feed-pet:523,669 · .pet-baby:524 · .pet-adult:525
.pet-egg-stage:527 · .wear:529 · .wear-head:530 · .wear-face:531 · .wear-neck:532 · .pet-name:534
.stage-label:535 · .level-row:536 · .level-badge:537 · .exp-bar:541 · .exp-fill:542 · .exp-text:543
.ability-box:545,549 · .hunger-bar:552 · .hunger-fill:553,554,555 · .food-item:561,603,607,608(+6) · .hunger-text:565 · .heat-bar:568
.heat-fill:569 · .heat-text:570,571,572 · .care-row:574 · .care-btn:575,579,582 · .btn-feed:580 · .btn-cure:581
.sick-banner:583 · .pet-sick:587 · .pet-asleep:590 · .sleep-badge:591 · .btn-sleep:593 · .dinner-btn:596
.food-box:600,601 · .food-grid:602 · .fav-tag:622 · .fd-exp:626 · .food-sec:628 · .food-sec-human:632
.bad-tag:634 · .fd-toxin:638 · .fd-safe:639 · .fq-box:642,643 · .fq-progress:644 · .fq-pair:645,646
.fq-ask:647 · .fq-why:648 · .fq-btns:652,653,657 · .fq-yes:658 · .fq-no:659 · .fq-next:660
.food-cancel:661 · .feed-box:667,668 · .feed-gain:670 · .sick-badge:674 · .big-btn:680,686,907,908(+6) · .shop-card:689
.shop-title:693 · .shop-grid:694 · .shop-item:695,699,700,701(+4) · .it-tag:706 · .tag-wear:707 · .lock-banner:709
.home-current:715,720,721 · .home-img:722 · .home-emoji:723 · .home-btn:724,746 · .home-layout:726 · .home-pic-col:727,733
.home-img-big:731 · .home-info-col:734,736,739,740 · .home-name-row:737 · .home-desc-row:738 · .home-shop-box:748,749 · .home-list:750
.home-option:751,755,756,757(+1) · .home-opt-img:758 · .home-opt-body:760,761 · .home-price:762 · .reset-link:767 · .login-card:773
.login-pets:774 · .login-status:775 · .google-btn:776,782,783 · .login-note:784 · .install-btn:787,793,794 · .install-guide-overlay:797
.install-guide:801,805,808 · .install-steps:806,807 · .install-guide-close:809 · .login-account:814 · .register-card:817,821,827,831 · .reg-safety:823,825,826
.student-chip:832 · .clock-chip:836 · .online-count:842 · .online-row:849,853,854 · .online-dot:858 · .online-name:863
.online-act:867 · .online-live:871 · .online-note:875 · .lb-empty:878 · .lb-list:879 · .lb-row:880,884,885
.lb-rank:889 · .lb-name:891,895 · .lb-coins:899 · .lb-hint:901 · .lb-badgeline:902 · .lb-tabs:904
.lb-tab:905,906 · .tinv-note:917 · .cat-card:923,944,1023,1028 · .cat-head:927 · .cat-emoji:928 · .cat-name:929
.cat-pass:930 · .cat-info:931 · .cat-btns:932 · .cat-btn:933,937,938,939(+2) · .band-sec-head:942,943 · .band-mine-tag:945
.bsp-box:948,951 · .bsp-head:952 · .bsp-prog:953 · .bsp-retake:955,958 · .rts-box:961 · .rts-head:963
.rts-sets:964 · .rts-set:965,966,967 · .rts-sub:968 · .rts-words:969 · .rts-word:970,972,973 · .rts-foot:974
.rts-okbtn:975,977 · .bsp-grid:978 · .bsp-chip:979,982,983,984(+1) · .bsp-num:986 · .bsp-best:987 · .bsp-tick:988
.bsp-foot:989 · .vb-box:992,994 · .vb-head:995 · .vb-total:996 · .vb-quizbtn:997,999 · .vb-tabs:1000
.vb-tab:1001,1003,1004 · .vb-words:1005 · .vb-word:1006,1009,1010,1011(+3) · .vb-empty:1015 · .vb-foot:1016 · .vb-pg:1017,1019
#vb-pginfo:1020 · .vb-hint:1021 · .band-lock:1029 · .offline-btn:1030,1031 · .quiz-progress:1036 · .quiz-phon:1037
#quiz-extra:1038,1040,1041,1042 · .quiz-word-card:1043 · .quiz-speak:1048 · .quiz-choice:1049,1054,1055,1056 · .quiz-score-pill:1057 · .stats-card:1060
.stats-title:1064,1497 · .stats-row:1065,1066,1067,1068 · .game-top:1071 · .back-btn:1072 · .combo-pill:1076 · .timer-wrap:1080
.timer-fill:1081,1082 · .board-label:1084 · .card-grid:1085 · .word-card:1086,1092,1093,1094(+3) · .hint-btn:1100,1105 · .game-endless-note:1108,1113,1115,1119(+6)
.report-btn:1140,1145 · .report-box:1148 · .report-close:1149 · .rp-head:1153 · .rp-avatar:1154,1155 · .rp-title:1156
.rp-sub:1157 · .rp-levelcard:1159 · .rp-level-top:1163 · .rp-bar:1164 · .rp-bar-fill:1165 · .rp-level-note:1166,1167
.rp-grid:1169 · .rp-stat:1170 · .rp-ic:1173 · .rp-num:1174 · .rp-lbl:1175 · .rp-section:1177
.rp-h3:1178 · .rp-badge-mini:1179 · .rp-row:1180,1181,1182 · .rp-empty:1183 · .rp-badges:1184 · .rp-badge:1185
.rp-tline:1188 · .rp-tl-head:1189,1190 · .rp-tl-ems:1191 · .rp-em:1192,1193 · .rp-tl-note:1194,1195 · .rp-crown:1197,1198
.rp-wtitle:1200 · .rp-wnow:1201,1202 · .rp-wgraph:1203 · .rp-wcol:1204 · .rp-wval:1205 · .rp-wbar:1206,1207
.rp-wlbl:1208 · .rp-cheer:1210 · .report-ok:1214 · .summary-box:1217,1268,1272,1273(+2) · .sm-burst:1218 · .sm-title:1220
.sm-line:1221 · .sm-coin:1222 · .sm-matches:1228,1229 · .confetti:1231 · .sm-badge:1238 · .sm-badge-all:1242
.badge-celebrate-overlay:1245,1258 · .badge-celebrate:1249 · .bc-emoji:1255 · .bc-title:1256 · .bc-sub:1257 · .sm-cheer:1262
.sm-streak:1263,1264 · .sm-sick:1265 · .sm-btns:1266 · .float-fx:1278 · .toast:1285 · .toast-warn:1292,1299,1300,1306
.toast-clear-all:1308,1315 · .alert-box:1317 · .alert-ok:1318,1323 · .settings-box:1325 · .set-row:1326 · .set-hint:1330
.set-hint-on:1331 · .set-hint-off:1332 · .set-lwrap:1333 · .set-label:1334 · .set-desc:1335 · .set-switch:1336,1340,1341,1346(+4)
.set-sw-knob:1342 · .set-sw-txt:1349 · .set-close:1355,1360 · .set-help:1361,1366 · .help-box:1368,1369,1374 · .help-item:1370
.update-banner:1382,1391,1392 · #update-reload:1393 · #update-dismiss:1397 · .levelup-overlay:1403 · .levelup-box:1407,1414,1415,1416(+4) · .bill-box:1422,1426,1427
.tag-off:1428 · .home-decayed-img:1429 · .home-dark-img:1430 · .thirst-fill:1431 · .thirst-text:1432,1433 · .toxin-fill:1436
.toxin-text:1437,1438 · .detox-btn:1439,1444 · .shape-text:1447,1448,1449,1450(+1) · .avatar-pick:1454 · .avatar-opt:1455,1459,1460,1461 · .avatar-chip-img:1465
.avatar-chip-blk:1467 · .set-avatar-btns:1468 · .avatar-mini:1469,1473 · .set-blk-row:1475 · .set-sub2:1476 · .blk-grid:1478
.blk-mini:1479,1482,1483,1484 · .game-avatar:1487,1488,1489 · .stats-nick:1498 · .ticket-owned:1501,1505 · .collect-sub:1510 · .mkt-tabs:1511
.mkt-tab:1512,1516 · .mkt-filter:1517 · .mkt-row:1521 · .mkt-emoji:1525,1526 · .mkt-info:1527,1528 · .mkt-tier-stars:1529
.mkt-buy:1530,1535,1536 · .mkt-price-lo:1537 · .mkt-price-hi:1538 · .mkt-empty:1539 · .collect-grid:1542 · .collect-cell:1543
.cc-emoji:1544,1545 · .cc-name:1546 · .cc-count:1547 · .cc-list-btn:1548,1552 · .mkt-listhead:1553 · .mkt-listing:1554
.ml-cancel:1558 · .mkt-sold:1564,1565,1566 · .list-dialog:1573,1574,1579 · .list-hint:1578 · .collect-reveal-frame:1582,1589 · .collect-reveal-img:1588
.collect-reveal-stars:1590 · .craft-box:1593 · .craft-head:1594 · .craft-bar:1595 · .craft-fill:1596 · .craft-text:1597
.craft-btn-row:1598,1599 · .craft-go-btn:1601,1607,1608,1611 · .craft-cancel:1619,1623 · .mkt-catalog:1626,1627,1628 · .mkt-pager:1631 · .pg-btn:1632,1636,1637
.pg-mid:1638 · .pg-dots:1639 · .pg-dot:1640,1641 · .order-head:1642 · .order-row:1643,1648,1650,1652 · .order-deliver:1653,1658
.order-need:1659
