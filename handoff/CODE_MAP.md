# CODE_MAP.md — แผนที่โค้ด:บรรทัด (เจนอัตโนมัติโดย `tools/gen_code_map.py` — **ห้ามแก้มือ** เดี๋ยวโดนเขียนทับ)

> วิธีใช้: หาชื่อฟังก์ชัน/ค่าคงที่/selector ในไฟล์นี้ (Grep หรือกวาดตา) → `Read` ไฟล์จริง `offset=<บรรทัด>` `limit=40`
> css = index `selector:บรรทัดทุกจุดที่ประกาศ` (บั๊ก UI เริ่มหาที่นี่) · เจนใหม่ทุกครั้งที่รัน `python tools/rotate_handoff.py` · อัปเดต: 2026-07-16

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

## js/ui.js (5,918 บรรทัด · 230 รายการ)
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
lbCoinHtml:1073 · lbBadgeHtml:1089 · lbBossHtml:1115 · bindPlayerClicks:1141 · showPlayerCard:1151 · petDescImg:1336
openImgLightbox:1349 · updateBillBadges:1371 · setBadge:1383 · updateSettingsBadge:1399 · openAttentionSummary:1413 · updateFriendBadge:1455
renderFriendPanel:1465 · friendDoSearch:1513 · refreshFriendData:1537 · CHAT_EMOJI_CATS:1589 · CHAT_THEMES:1611 · CHAT_SECRET_MS:1620
chatBadgeSync:1628 · ibTimeStr:1636 · openChatInbox:1643 · openChat:1730 · giftImg:1917 · giftDateStr:1919
giftItemPic:1926 · giftItemName:1932 · updateGiftBadge:1937 · renderGiftPanel:1946 · acceptGift:2004 · declineGift:2016
showGiftReveal:2025 · openGiftPicker:2051 · confirmSendGift:2119 · doSendGift:2143 · rankBadgeHTML:2167 · renderRankCard:2172
showRankUp:2197 · bindPetPlateButtons:2232 · openPetInfoOverlay:2249 · feedAgo:2272 · renderFeedCard:2285 · alignPetTabs:2338
renderDashboard:2350 · sleepBtnHTML:2702 · sleepHintHTML:2709 · sleepAllPets:2720 · wakeAllPets:2733 · feedPet:2744
openFoodMenu:2757 · feedWith:2828 · AVATAR_UI:2858 · playerAvatarHTML:2861 · SHAPE_UI:2867 · showFeedResult:2876
curePet:2912 · railCureClick:2935 · detoxPet:2947 · openFoodQuiz:2970 · renderShop:3050 · homeVisualHTML:3110
showHomeRuined:3124 · showCutNotice:3145 · renderHomeCard:3163 · payMaint:3247 · trashBillUI:3263 · payTrash:3280
UTILITY_UI:3299 · utilityBillUI:3348 · payUtility:3373 · buyUtilityFix:3399 · renderPhoneCard:3417 · buyPhone:3457
sellPhone:3479 · compLiveTotal:3500 · onlineLiveTotal:3511 · renderOnlineEarnPill:3516 · openPillInfo:3539 · renderComputerCard:3579
buyComputer:3614 · sellComputer:3637 · soldCount:3663 · soldBadge:3664 · renderTicketCard:3669 · loadScriptOnce:3725
enterAdventure3D:3741 · enterHaunted3D:3763 · advHealClick:3785 · buyTicket:3805 · renderHauntCard:3831 · buyHauntTicket:3886
renderHeliCard:3913 · buyHeliTicket:3971 · enterHeli3D:3994 · renderDroneCard:4016 · buyDroneTicket:4071 · enterDrone3D:4094
renderDriveCard:4117 · buyDriveTicket:4190 · enterDrive3D:4213 · renderSoccerCard:4246 · buySoccerTicket:4294 · enterSoccer3D:4317
WORLD3D:4341 · gotoRobotShop:4350 · scrollShopCardIntoView:4355 · railWorldClick:4358 · renderRailWorlds:4379 · tinvNoticeHTML:4438
openTinvPicker:4446 · fruitCountdown:4490 · renderFarmCard:4502 · renderFarmClock:4563 · buyFruit:4579 · sellFruit:4599
sellAllFruit:4616 · collectImg:4642 · renderFactoryCard:4648 · renderMarketCard:4695 · updateWishBadge:4750 · openWishlistDialog:4761
renderMarketBrowse:4798 · carImg:4827 · renderVehicleShop:4828 · CS_CYCLE_MS:4879 · carInteriorImg:4880 · carStatHtml:4882
renderCarShowroom:4889 · csShowBig:4915 · csInit:4942 · RS_CYCLE_MS:4965 · robotImg:4966 · renderRobotShop:4967
rsShowBig:4989 · rsInit:5010 · buyRobot:5029 · enterMecha3D:5051 · pickMechaRobot:5072 · pickDriveCar:5104
openCarBuyDialog:5145 · buyCarInsurance:5206 · payCarLoanMonthly:5225 · payCarLoanFull:5237 · carDriveBlock:5256 · gotoVehicleShop:5261
gotoMyStock:5266 · showNeedCarDialog:5272 · renderFactory:5284 · renderOrdersUI:5348 · startProduce:5367 · buyCollectible:5395
cancelProduce:5417 · deliverOrder:5431 · renderOrderClock:5448 · renderCollectMine:5458 · openListDialog:5500 · cancelListing:5553
buyMarketItem:5576 · showCollectReveal:5603 · buyAC:5639 · openHomeShop:5658 · renderPetShop:5717 · showLevelUp:5778
renderStats:5815 · showTeacherCard:5886

## js/util.js (576 บรรทัด · 28 รายการ)
shuffle:6 · fmtNum:15 · escapeHTML:19 · seededRand:25 · fmtThaiDT:35 · fmtThaiDate:39
showScreen:44 · TOAST_WARN_RE:52 · restackToasts:55 · toast:77 · floatFx:97 · beep:107
sirenSynth:133 · playSpark:157 · sparkSynth:171 · thunderFx:206 · wordAudioFile:274 · speakWord:277
speakLetter:297 · pickSpeakVoice:316 · speakWordTTS:327 · askNameDialog:347 · askConfirm:387 · alertBox:404
applyNoAnim:420 · openSettings:425 · openHelp:531 · openTeacherGuide:557

## js/wordsearch.js (235 บรรทัด · 0 รายการ)

## css/lobby.css (2,204 บรรทัด · 409 selector)
:root:6 · html:15 · body:16 · *:33,34,35,36 · #app:39 · h1:41
.subtitle:42 · .shop-title:43 · #rotate-overlay:46 · .screen:68 · #screen-select:77,78,79,80(+5) · .egg-need:87
.petshop-topright:89 · .petshop-play-link:90,95 · .word-card:133 · .quiz-choice:134,135,136 · .big-btn:139,140,141,142 · #screen-dashboard:147,606,614
.lobby-top:154,514,515,516(+2) · .top-flex:155 · .profile-plate:156,160,500 · #rain-fx:165 · .rain-layer:168,174 · .rain-glass:181
.glass-drop:182 · .rail-btn:197,525,531,532(+13) · .rail-badge:198 · .fr-code-box:203 · .fr-code-label:207 · .fr-code-row:208
.fr-code:209 · .fr-copy-btn:214,218,223,224 · .fr-search-btn:219 · .fr-add-btn:220 · .fr-accept:221 · .fr-decline:222
#fr-search-input:225 · #fr-search-result:229 · .fr-found:230 · .fr-hint:234 · .fr-list-title:235 · .fr-row:236
.fr-req:240 · .fr-row-name:242,246 · .fr-row-status:250 · .fr-req-btns:251 · .online-dot:252 · .fr-chat-btn:253,258,260
.fr-unread:261 · .chat-overlay:268 · .chat-box:272,381,388,395(+12) · .chat-head:284 · .chat-theme-btn:289,293 · .chat-secret-tg:294,295
.cs-switch:296,297,302,303 · .cs-slider:298,300 · .chat-secret-note:304 · .chat-theme-strip:307 · .chat-theme-sw:309,312,313,314(+1) · .chat-head-name:316,317
.chat-close:318 · .chat-msgs:322 · .chat-empty:326 · .chat-typing:328 · .ct-dots:330,331,333,334 · .no-anim:336,349,584,655(+22)
.chat-bubble:337,342,347 · .chat-emoji:350 · .chat-emo:354,358 · .chat-input-row:359 · .chat-emoji-btn:363 · #chat-input:367
.chat-send:371,376,377 · .pl-click:444,446,447 · .pl-overlay:448 · .pl-card:452,1630 · .pl-close:458 · .pl-head:462
.pl-grade:467 · .pl-badges:469 · .pl-badge-chip:470,474 · .pl-body:475 · .pl-loading:476 · .pl-none:477
.pl-me-tag:478 · .pl-stat:479 · .pl-lbl:484 · .pl-val:485,486 · .pl-tip:487 · .chip-edit:493,498,499
.rank-mini:505,511,512,513 · .lobby-mid:522 · .lobby-rail:524 · .rail-worlds:542 · .rail-div:543 · .lobby-stage:558,567,611,612
.lobby-bottom:560,565,1032,1033 · .newword-banner:573,580 · .nw-tag:581 · .nw-word:586 · .nw-hint:588,589 · .nw-box:591,1767
.nw-pop-word:592 · .nw-speak:593 · .nw-pop-phon:594 · .nw-ipa:595 · .nw-pop-sent:596 · .nw-pop-mean:597
.pet-tab:598,599,600,2091 · .stage-hero:621,636,644,789(+5) · .hero-ground:658,778,784 · .hero-rank-bg:660,663,666,670(+18) · #lobby3d-canvas:683,684 · .hero-scene:688,690,697,698(+8)
.caretaker-fig:737 · .caretaker-img:740 · .caretaker-emoji:742 · .blk-rig:749,750,751 · .stage-plate:811,819,830,831(+30) · .plate-title:825
.lobby-side:868,903,908,911(+22) · .side-sec:871,2006 · .side-label:872,877 · .side-label-row:879,880 · .lb-tabs-out:881,882,886 · .side-glass:890,897
.side-card:909,1021 · #quest-card:921,945,946,947(+6) · .q-bigcard:922,951,952,955(+1) · .qb-top:924 · .qb-emoji:925 · .qb-name:927
.qb-bar:928,929 · .qb-row:931 · .qb-prog:932 · .qb-reward:933 · .qb-go:934,938 · .q-dots:939
.q-dot:940,941,942 · .q-bonus:943 · .feed-row:966,1521,1526 · .inv-card:968,970,971 · .inv-btns:972 · .inv-go:973,975
.inv-x:976 · #online-card:980,2014,2015,2016(+1) · .fq-overlay:981 · .fq-box:983,1822 · .fq-head:987,989 · .fq-close:990
.fq-sec:992 · .fq-worlds:993 · .fq-world:994,996 · .fq-acts:997 · .fq-act:998,1001,1002 · .lobby-quiz-btn:1034
.lobby-foodquiz-btn:1035,1036 · .lobby-play-btn:1037,1041 · .panel-overlay:1046,1051 · .panel-box:1052 · .panel-head:1059,1063 · .panel-close:1064,1069
.panel-body:1070,1073,1074 · .panel-page:1071,1072 · .collect-sub:1078 · .mkt-empty:1079 · .craft-box:1080 · .mkt-listing:1081
.mkt-filter:1082,1378 · .hq-grid:1089 · .hq-card:1090,1095,1119 · .hq-head:1096 · .hq-pic:1102,1104 · .hq-emoji:1106
.hq-badge:1107 · .hq-stars:1111 · .hq-price:1112,1117,1118,1121(+4) · .car-grid:1128,1130,1131 · .robot-weap:1132 · .dcp-grid:1134
.dcp-card:1136,1139,1140,1141(+10) · .dcp-lock:1156 · .sold-badge:1160,1162,1163 · .rs-showroom:1165 · .rs-list:1166,1168 · .rs-thumb:1169,1171,1172,1173(+1)
.rs-thumb-pic:1174,1175 · .rs-thumb-price:1176 · .rs-stage:1178 · .rs-big:1181 · .rs-big-img:1182 · .rs-elec:1186,1190,1195
.rs-edge:1196,1202 · .rs-info:1205,1206,1207,1208(+1) · .rs-buy:1210,1212,1213 · .cs-showroom:1217 · .cs-list:1218,1220 · .cs-thumb:1221,1223,1224,1225(+1)
.cs-thumb-pic:1226,1227 · .cs-thumb-name:1228 · .cs-thumb-price:1229 · .cs-thumb-own:1230 · .cs-stage:1232 · .cs-big:1235
.cs-big-img:1236 · .cs-elec:1240,1244,1248 · .cs-edge:1249,1255 · .cs-interior:1258 · .cs-inr-label:1259,1260 · .cs-inr-img:1261
.cs-info:1263,1264,1265,1266(+6) · .cs-buy:1274,1276,1277,1278 · .car-emoji:1280 · .car-mine:1286 · .car-mine-pic:1291 · .car-mine-info:1292
.car-loan:1293,1294 · .car-mine-btns:1295,1296,1297 · .car-locked:1299 · .car-mine-head:1301 · .car-pick-list:1302,1303 · .car-pick:1304,1306,1307
.car-pick-pic:1308,1309 · .car-pick-name:1310,1311 · .car-pick-od:1312 · .car-buy-box:1314,1826 · .cb-pic:1315,1316,1317 · .cb-lines:1318
.cb-li:1319,1323,1324 · .cb-ins:1325,1329,1330 · .cb-plan:1331 · .cb-pl:1332,1337,1339,1343(+1) · .cb-total:1350 · .cb-btns:1351,1356
.cb-x:1352 · .shop-grid:1359 · .shop-item:1360,1365,1370,1371(+3) · .mkt-tab:1379,1380 · .pg-btn:1381,1382,1383 · .pg-dot:1384
.fr-gift-btn:1404,1409 · .gift-sec-title:1412 · .gift-in-row:1414 · .gift-out-row:1418 · .gift-in-pic:1419,1421,1422 · .gift-in-info:1423,1424
.gift-in-btns:1425 · .gift-accept:1426,1430,1432 · .gift-decline:1431 · .gift-box-card:1433 · .gift-box-from:1434,1435 · .gift-note:1436
.gift-pick-overlay:1439 · .gift-pick-box:1443 · .gift-pick-head:1449,1453 · .gift-pick-close:1454 · .gift-pick-tabs:1456 · .gp-tab:1457,1461
.gift-pick-body:1462 · .gp-chips:1463 · .gp-chip:1464,1468 · .gp-card:1469,1470 · .gp-price:1471 · .gp-note:1472
.gift-cf-pic:1473 · .chat-emoji-cats:1478 · .chat-emoji-cat:1482,1486,1487 · .chat-emoji-wrap:1488,1489 · .stage-left:1497 · .pet-info-btn:1501,1508,1509
.feed-list:1516,1520 · .feed-ico:1527 · .feed-txt:1528 · .feed-name:1529 · .feed-ago:1530 · .feed-empty:1531,1534
.pi-overlay:1536 · .pi-box:1540,1545,1546,1550(+2) · .pi-close:1552,1557,1558 · .pi-close-left:1560 · .pi-portrait:1562 · .pi-care-title:1568
.lbf-overlay:1571 · .lbf-box:1574 · .lbf-head:1579 · .lbf-title:1580 · .lbf-tabs:1581 · .lbf-close:1584
.lbf-close-l:1585 · .lbf-body:1586 · .lbf-grid:1587 · .lbf-cell:1589,1592,1593,1594(+1) · .lbf-podium:1598 · .pod:1600,1627,1628
.pod-char:1602 · .pod-base:1604 · .pod-rank:1606 · .pod-label:1608 · .pod-name:1610 · .pod-sc:1612
.pod-1:1617,1618 · .pod-2:1619,1620 · .pod-3:1621,1622 · .pod-4:1623,1624 · .pod-5:1625,1626 · .pl-wide:1631,1634,1635,1636
.pl-follow:1637,1642,1644 · .pl-unfollow:1646,1652,1653 · .pl-followers:1654 · .pl-cols:1655 · .pl-col:1656 · .pl-sec-title:1657
.pl-feed:1658,1661,1668 · .pl-feed-row:1662,1666,1667 · .pl-assets-wrap:1670 · .pl-assets:1671 · .pl-asset:1674,1678,1685 · .pl-asset-emoji:1679
.pl-asset-n:1680 · .pl-pets-wrap:1687 · .pl-pets:1688 · .pl-pet:1689,1694,1696 · .pl-pet-nm:1697 · .img-lightbox:1700,1705,1706,1710(+3)
.settings-box:1723,1724,1769,1774(+20) · .set-feed-head:1725 · .set-feed-sub:1729 · .set-feed-row:1730 · .pillinfo-val:1735 · .pillinfo-desc:1740,1759
.levelup-box:1748,1749,1820 · .pillinfo-box:1751 · .plf-head:1754 · .plf-emoji:1755 · .plf-ht:1756,1757,1758 · .plf-foot:1760
.alert-box:1765 · .attn-box:1766 · .help-box:1798,1799,1800 · .food-box:1821 · .home-shop-box:1823 · .summary-box:1824
.report-box:1825 · .wl-grid:1828 · .tc-wrap:1830 · .spell-btn:1836,1841 · .sp-hud:1842 · .sp-word:1844
.sp-ch:1845,1850 · .sp-th:1852 · .sp-hint:1854 · .sp-exit:1857,1861 · .sp-banner:1862 · .sp-big:1867
.sp-thb:1869 · .sp-coin:1870 · #spell-confetti:1875 · .sp-rb:1876 · .sp-day:1886 · .sp-perfect:1888
.sp-late:1890 · #spell-coinpop:1893 · .side-sub:2002,2004 · .sec-quest:2007 · .on-page:2018,2019,2020,2021 · .inbox-overlay:2031
.ib-box:2033 · .ib-head:2037 · .ib-close:2041,2043 · .ib-list:2044,2045 · .ib-row:2046,2047,2048,2049 · .ib-ava:2050
.ib-on:2054 · .ib-mid:2056 · .ib-name:2057 · .ib-last:2058 · .ib-meta:2059 · .ib-time:2060
.ib-dot:2062 · .ib-story-badge:2065 · .ib-empty:2069 · .ib-story:2071,2073 · .ib-story-item:2074,2076,2083 · .ib-story-ava:2077
.ib-story-on:2081 · .ib-world:2086,2089 · #btn-music:2094,2097,2098 · #ws-overlay:2113 · #ws-board:2115,2121,2123 · .ws-head:2125
.ws-title:2126 · .ws-grade:2128 · .ws-body:2130 · .ws-gridwrap:2131 · #ws-grid:2132 · .ws-cell:2136,2140,2142,2150(+1)
.ws-flash:2154,2156 · .ws-coinpop:2160 · .ws-side:2171 · .ws-find:2172 · #ws-words:2174,2176 · .ws-word:2177,2181,2183
#ws-prog:2184 · .ws-actions:2185,2186,2188 · #ws-new:2189 · #ws-stash:2190 · #ws-clear:2191 · #ws-win:2192,2194
.ws-win-in:2195,2198

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
