# CODE_MAP.md — แผนที่ฟังก์ชัน:บรรทัด (เจนอัตโนมัติโดย `tools/gen_code_map.py` — **ห้ามแก้มือ** เดี๋ยวโดนเขียนทับ)

> วิธีใช้: หาชื่อฟังก์ชัน/ค่าคงที่ในไฟล์นี้ (Grep หรือกวาดตา) → `Read` ไฟล์จริง `offset=<บรรทัด>` `limit=40`
> เจนใหม่อัตโนมัติทุกครั้งที่รัน `python tools/rotate_handoff.py` (จบรอบ) · อัปเดตล่าสุด: 2026-07-16

## js/adventure3d.js (7,061 บรรทัด · 300 รายการ)
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
CHAT_MAX:389 · doneList:396 · wordPool:397 · pickWords:410 · TILE_COLORS:417 · letterTexture:418
emojiTexture:432 · GHOST_IMG_MAX:444 · measureGhostBox:451 · probeGhostImages:464 · whenGhostsReady:476 · ghostTexture:480
ghostScareSrc:485 · AD_STYLES:493 · adBoardTexture:499 · addAdBillboard:538 · ringAds:549 · BUILDING_TINTS:560
buildingFacadeTexture:561 · makePeerSprite:584 · BLOCK_AVATARS:618 · blkGeo:629 · blkMat:630 · blkCyl:631
blkFaceMat:633 · makeBlockFigure:648 · makeBlockCar:688 · blkNameSprite:733 · makeBlockPeer:745 · makeBlockWalkPeer:759
disposeBlockPeer:767 · blkBuildThumbs:772 · blkBuildPicker:790 · pickBlockAvatar:835 · bubbleSprite:858 · showPeerBubble:885
removePeerBubble:893 · concreteTexture:903 · dAddBox:918 · buildAbandoned:925 · makeNameSprite:971 · flatGeom:984
flatGeomUV:993 · buildDriveCity:1003 · SKY_IMG:1278 · applySky:1279 · buildScene:1288 · randPos:1554
randRoadPos:1562 · spawnLetter:1574 · spawnLettersForWord:1605 · ensureCoverage:1607 · relocateLetters:1620 · removeLetter:1645
tryCompleteWords:1654 · completeWord:1668 · spawnMonster:1712 · killMonster:1721 · tickMonsters:1729 · damagePlayer:1751
shoot:1767 · tickShots:1781 · spawnGhost:1807 · GHOST_STYLE:1816 · GHOST_H_DEFAULT:1817 · applyGhostSize:1818
respawnGhost:1827 · tickGhosts:1843 · sessionRecapHtml:1887 · renderHearts:1894 · ghostHit:1901 · caught:1922
knockedOut:1947 · netReady:2117 · netJoin:2121 · sendPos:2134 · sendChat:2161 · toggleChatBox:2175
onPeerData:2185 · removePeer:2263 · netLeave:2275 · tickPeers:2283 · RTC_CFG:2354 · tinvLinked:2355
partyWord:2362 · syncPartyWord:2375 · updateVoiceBtns:2527 · PODIUM_BONUS:2552 · podiumJoin:2554 · podiumLeave:2565
endRound:2566 · showPodium:2577 · tinvCheck:2617 · showBanner:2637 · renderHudTop:2643 · renderHudWords:2648
renderHudInv:2658 · ddTierFromName:2665 · renderBoard:2667 · drawBigMap:2691 · openBigMap:2746 · closeBigMap:2754
drawMinimap:2759 · loadCarDash:2831 · loadCarWheel:2843 · buildDom:2853 · confirmExit:4059 · IS_TOUCH:4078
bindInput:4079 · movePlayer:4164 · tickPlayer:4174 · collideDrone:4215 · tickDrone:4233 · nearMissTick:4313
showNearMiss:4336 · awardDaredevil:4347 · comboCheer:4364 · comboFlash:4380 · driveCell:4389 · nearestStreet:4395
collideCar:4405 · tlDotY:4436 · tlSet:4440 · driveArms:4457 · tlTick:4469 · TL_GREEN:4513
tlRedDur:4515 · tlightPhase:4516 · buildTrafficLights:4523 · rlTick:4575 · cellDrivable:4606 · cellCenter:4607
losClear:4609 · nearestDrivableCell:4619 · routeGrid:4628 · pickGpsTarget:4681 · gpsSpeak:4693 · tickGps:4708
tickDrive:4784 · drawCarDial:4962 · drawCarGauges:4992 · RADIO_RECT:5019 · CAR_RADIO_RECT:5021 · carRadioRect:5027
radioLayout:5029 · radioSetHint:5052 · renderRadioList:5058 · radioToggleList:5068 · drawRadioViz:5073 · radioTick:5091
BOBBLE_FOOT:5104 · BOBBLE_H:5105 · BOBBLE_ASPECT:5106 · BOB_OMEGA:5109 · BOB_PITCH_FORCE:5111 · BOBBLE_SKINS:5113
bobbleSetAvatar:5120 · bobbleLayout:5127 · bobbleTick:5140 · bobblePoke:5165 · bobbleApplySkin:5182 · dollOwned:5192
openDollPicker:5193 · carStartShow:5230 · showLawInfo:5248 · lawNotice:5270 · driveFineSettle:5280 · heliFloorAt:5456
tickHeli:5463 · gaugeBezel:5608 · gaugeTicks:5613 · gaugeNeedle:5623 · gaugeText:5630 · drawGauges:5636
soccerLetterPos:5956 · letterNeeded:5960 · soccerNeededSet:5965 · soccerTileGeo:5971 · soccerGoldTexture:5973 · makeSoccerTile:5990
soccerRefreshSkins:5999 · soccerBuildTargets:6006 · soccerRetarget:6015 · soccerCoinPop:6027 · soccerFieldTexture:6039 · soccerNetTexture:6050
soccerCrowdTexture:6057 · soccerBallMat:6065 · buildSoccerGoal:6073 · buildStands:6084 · soccerNumTex:6092 · makeSoccerPlayer:6102
soccerResetBall:6126 · soccerKick:6131 · soccerCheer:6139 · updateSoccerGuide:6140 · soccerCamera:6154 · tickSoccer:6169
soccerKitShow:6245 · soccerKitGo:6260 · emojiSprite:6311 · makeAlien:6316 · startWave:6349 · waveSpawnFill:6360
waveComplete:6369 · updateWaveHud:6379 · checkMechaBossBadge:6381 · alienSpawnPos:6390 · removeAlien:6395 · mechaHudWord:6400
setMechaHudSkin:6408 · mechaComboPop:6420 · mechaShielded:6425 · mechaDamageFx:6427 · mechaHitByAlien:6432 · spawnAlienShot:6438
removeAlienShot:6448 · tickAlienShots:6453 · spawnPowerup:6465 · removePowerup:6478 · collectPowerup:6483 · tickPowerups:6490
updateMechaHud:6499 · mechaTracer:6539 · mechaFire:6548 · explodeAlien:6585 · tickMecha:6614 · loop:6670
clearEntities:6698 · INTRO_KEY:6712 · introSeenObj:6713 · introSeen:6714 · markIntroSeen:6715 · INTRO:6716
showIntro:6781 · closeIntro:6806 · beginPlay:6812 · start:6814 · exitWorld:6957 · mechaRecapLine:6991

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

## js/online.js (1,082 บรรทัด · 74 รายการ)
ONLINE_STALE_MS:52 · ONLINE_BEAT_MS:53 · LEADERBOARD_SIZE:54 · onlineDisplayName:58 · onlineActivity:66 · ensureOnlineId:82
onlineKey:92 · onlinePushPresence:97 · onlinePushScore:107 · fetchPlayerStats:129 · onlineRerender:148 · notifyFriendBadges:160
FRIEND_ALPHA:186 · friendCode:187 · friendSearch:199 · friendRequest:223 · friendAccept:232 · friendDecline:244
friendsHeal:254 · CHAT_MAX_LEN:278 · CHAT_KEEP:279 · chatPairId:281 · chatRef:284 · chatListen:290
chatSend:306 · chatDeleteMsg:322 · TYPING_TTL:330 · typingRef:332 · chatSetTyping:333 · chatClearTyping:343
chatWatchTyping:351 · chatThemeRef:369 · chatSetTheme:370 · chatWatchTheme:375 · chatPrune:383 · chatSeenTs:400
chatMarkSeen:406 · chatUnreadCount:418 · chatWatchSync:421 · GIFT_EXPIRE_MS:471 · giftSend:474 · giftAccept:486
giftDecline:490 · giftInWatch:496 · giftReclaim:527 · giftOutWatchSync:537 · giftOutRebuild:592 · salesWatch:622
salesRerender:630 · sellInc:634 · marketWatch:642 · marketList:675 · marketUnlist:683 · marketBuy:692
marketSoldWatch:705 · tinvSend:734 · tinvClear:741 · tinvWatch:745 · FEED_MAX:774 · feedEvent:777
feedPrune:788 · feedPurgeCat:799 · feedPushAssets:810 · petDescriptor:828 · feedPushPets:834 · fetchPlayerPets:848
followSet:864 · followUnset:875 · feedRebuild:882 · feedWatchSync:894 · fetchPlayerFeed:921 · fetchPlayerAssets:934
fetchFollowers:953 · onlineStart:962

## js/state.js (933 บรรทัด · 83 รายการ)
STORAGE_KEY:6 · CURE_COST:8 · HUNGRY_SICK_MS:9 · MEAL_HOUR:11 · MEAL_FULL:12 · SLEEP_FROM_HOUR:13
SLEEP_SICK_HOUR:14 · WAKE_HOUR:15 · DINNER_COST:16 · TOXIN_FULL:18 · DETOX_COST:19 · FOODQUIZ_Q:21
FOODQUIZ_COIN:22 · FOODQUIZ_BONUS:23 · SHAPE_JUNK_MEALS:25 · SHAPE_CLEAN_MEALS:26 · SHAPE_MISS_MEALS:27 · SHAPE_EXP_BONUS:28
HEAT_SICK_MS:29 · THIRST_SICK_MS:30 · DEFAULT_STATE:32 · FEED_CATS:138 · SLOT_MS:149 · currentSlotStart:150
nextSlotStart:156 · mealDayKey:158 · nightKeyOf:160 · newPet:166 · loadState:190 · saveState:386
activePet:393 · petStage:394 · isAdult:399 · abilityOn:400 · hasPetType:401 · todayStr:404
dailyTick:408 · addCoins:411 · QUEST_POOL:431 · QUEST_PER_DAY:439 · questsToday:440 · questTick:447
questEvent:451 · assetValue:487 · netWorth:512 · assetCount:514 · refreshRank:531 · heatProtected:547
rainProtected:551 · petHungry:554 · petShapeOf:558 · updatePetShape:564 · shapeMealDone:571 · heatPct:581
ymStr:590 · billOutstanding:594 · UTILITIES:601 · HOME_UTILITIES:607 · homeDecayed:609 · billTick:612
myCar:681 · carLoanDue:686 · carLoanOverdue:691 · carLoanPayable:696 · carLoanPay:703 · compTick:716
ONLINE_RATE:730 · onlineEarnActive:731 · onlineEarnTick:735 · onlineEarnFlush:746 · marketTick:756 · addCraft:780
ORDER_MAX:797 · ORDER_LIFE_MS:798 · ORDER_GAP_MIN_MS:799 · ORDER_GAP_SPAN_MS:800 · ORDER_TIER_WEIGHT:801 · newOrder:802
orderTick:815 · careTick:823 · expNeed:904 · addExp:909 · addRP:929

## js/ui.js (5,872 บรรทัด · 229 รายการ)
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
lbCoinHtml:1073 · lbBadgeHtml:1089 · lbBossHtml:1115 · bindPlayerClicks:1141 · showPlayerCard:1151 · petDescImg:1324
openImgLightbox:1337 · updateBillBadges:1359 · setBadge:1371 · updateSettingsBadge:1387 · openAttentionSummary:1401 · updateFriendBadge:1443
renderFriendPanel:1453 · friendDoSearch:1501 · refreshFriendData:1525 · CHAT_EMOJI_CATS:1577 · CHAT_THEMES:1599 · CHAT_SECRET_MS:1608
chatBadgeSync:1616 · ibTimeStr:1624 · openChatInbox:1631 · openChat:1718 · giftImg:1905 · giftDateStr:1907
giftItemPic:1914 · giftItemName:1920 · updateGiftBadge:1925 · renderGiftPanel:1934 · acceptGift:1992 · declineGift:2004
showGiftReveal:2013 · openGiftPicker:2039 · confirmSendGift:2107 · doSendGift:2131 · rankBadgeHTML:2155 · renderRankCard:2160
showRankUp:2185 · bindPetPlateButtons:2220 · openPetInfoOverlay:2237 · feedAgo:2260 · renderFeedCard:2273 · alignPetTabs:2326
renderDashboard:2338 · sleepBtnHTML:2690 · sleepHintHTML:2697 · sleepAllPets:2708 · wakeAllPets:2721 · feedPet:2732
openFoodMenu:2745 · feedWith:2816 · AVATAR_UI:2846 · playerAvatarHTML:2849 · SHAPE_UI:2855 · showFeedResult:2864
curePet:2900 · railCureClick:2923 · detoxPet:2935 · openFoodQuiz:2958 · renderShop:3038 · homeVisualHTML:3098
showHomeRuined:3112 · showCutNotice:3133 · renderHomeCard:3151 · payMaint:3235 · trashBillUI:3251 · payTrash:3268
UTILITY_UI:3287 · utilityBillUI:3336 · payUtility:3361 · buyUtilityFix:3387 · renderPhoneCard:3405 · buyPhone:3445
sellPhone:3467 · compLiveTotal:3488 · onlineLiveTotal:3499 · renderOnlineEarnPill:3504 · openPillInfo:3527 · renderComputerCard:3567
buyComputer:3602 · sellComputer:3625 · soldCount:3651 · soldBadge:3652 · renderTicketCard:3657 · loadScriptOnce:3713
enterAdventure3D:3729 · enterHaunted3D:3751 · advHealClick:3773 · buyTicket:3793 · renderHauntCard:3819 · buyHauntTicket:3874
renderHeliCard:3901 · buyHeliTicket:3959 · enterHeli3D:3982 · renderDroneCard:4004 · buyDroneTicket:4059 · enterDrone3D:4082
renderDriveCard:4105 · buyDriveTicket:4178 · enterDrive3D:4201 · renderSoccerCard:4234 · buySoccerTicket:4282 · enterSoccer3D:4305
WORLD3D:4329 · gotoRobotShop:4338 · scrollShopCardIntoView:4343 · railWorldClick:4346 · renderRailWorlds:4367 · tinvNoticeHTML:4426
openTinvPicker:4434 · fruitCountdown:4478 · renderFarmCard:4490 · renderFarmClock:4551 · buyFruit:4567 · sellFruit:4587
sellAllFruit:4604 · collectImg:4630 · renderFactoryCard:4636 · renderMarketCard:4682 · updateWishBadge:4737 · openWishlistDialog:4748
renderMarketBrowse:4785 · carImg:4814 · renderVehicleShop:4815 · CS_CYCLE_MS:4866 · carInteriorImg:4867 · carStatHtml:4869
renderCarShowroom:4876 · csShowBig:4902 · csInit:4929 · RS_CYCLE_MS:4952 · robotImg:4953 · renderRobotShop:4954
rsShowBig:4976 · rsInit:4997 · buyRobot:5016 · enterMecha3D:5038 · pickMechaRobot:5059 · pickDriveCar:5091
openCarBuyDialog:5132 · buyCarInsurance:5193 · payCarLoanMonthly:5212 · payCarLoanFull:5224 · carDriveBlock:5243 · gotoVehicleShop:5248
gotoMyStock:5253 · showNeedCarDialog:5259 · renderFactory:5271 · renderOrdersUI:5329 · startProduce:5348 · cancelProduce:5371
deliverOrder:5385 · renderOrderClock:5402 · renderCollectMine:5412 · openListDialog:5454 · cancelListing:5507 · buyMarketItem:5530
showCollectReveal:5557 · buyAC:5593 · openHomeShop:5612 · renderPetShop:5671 · showLevelUp:5732 · renderStats:5769
showTeacherCard:5840

## js/util.js (576 บรรทัด · 28 รายการ)
shuffle:6 · fmtNum:15 · escapeHTML:19 · seededRand:25 · fmtThaiDT:35 · fmtThaiDate:39
showScreen:44 · TOAST_WARN_RE:52 · restackToasts:55 · toast:77 · floatFx:97 · beep:107
sirenSynth:133 · playSpark:157 · sparkSynth:171 · thunderFx:206 · wordAudioFile:274 · speakWord:277
speakLetter:297 · pickSpeakVoice:316 · speakWordTTS:327 · askNameDialog:347 · askConfirm:387 · alertBox:404
applyNoAnim:420 · openSettings:425 · openHelp:531 · openTeacherGuide:557

## js/wordsearch.js (235 บรรทัด · 0 รายการ)
