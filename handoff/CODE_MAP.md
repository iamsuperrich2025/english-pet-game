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

## css/lobby.css (2,192 บรรทัด · 408 selector)
:root:7 · html:16 · body:17 · *:34,35,36,37 · #app:40 · h1:42
.subtitle:43 · .shop-title:44 · #rotate-overlay:47 · .screen:69 · #screen-select:78,79,80,81(+5) · .egg-need:88
.petshop-topright:90 · .petshop-play-link:91,96 · .word-card:134 · .quiz-choice:135,136,137 · .big-btn:140,141,142,143 · #screen-dashboard:148,607,615
.lobby-top:155,515,516,517(+2) · .top-flex:156 · .profile-plate:157,161,501 · #rain-fx:166 · .rain-layer:169,175 · .rain-glass:182
.glass-drop:183 · .rail-btn:198,526,532,533(+13) · .rail-badge:199 · .fr-code-box:204 · .fr-code-label:208 · .fr-code-row:209
.fr-code:210 · .fr-copy-btn:215,219,224,225 · .fr-search-btn:220 · .fr-add-btn:221 · .fr-accept:222 · .fr-decline:223
#fr-search-input:226 · #fr-search-result:230 · .fr-found:231 · .fr-hint:235 · .fr-list-title:236 · .fr-row:237
.fr-req:241 · .fr-row-name:243,247 · .fr-row-status:251 · .fr-req-btns:252 · .online-dot:253 · .fr-chat-btn:254,259,261
.fr-unread:262 · .chat-overlay:269 · .chat-box:273,382,389,396(+12) · .chat-head:285 · .chat-theme-btn:290,294 · .chat-secret-tg:295,296
.cs-switch:297,298,303,304 · .cs-slider:299,301 · .chat-secret-note:305 · .chat-theme-strip:308 · .chat-theme-sw:310,313,314,315(+1) · .chat-head-name:317,318
.chat-close:319 · .chat-msgs:323 · .chat-empty:327 · .chat-typing:329 · .ct-dots:331,332,334,335 · .no-anim:337,350,585,656(+22)
.chat-bubble:338,343,348 · .chat-emoji:351 · .chat-emo:355,359 · .chat-input-row:360 · .chat-emoji-btn:364 · #chat-input:368
.chat-send:372,377,378 · .pl-click:445,447,448 · .pl-overlay:449 · .pl-card:453,1627 · .pl-close:459 · .pl-head:463
.pl-grade:468 · .pl-badges:470 · .pl-badge-chip:471,475 · .pl-body:476 · .pl-loading:477 · .pl-none:478
.pl-me-tag:479 · .pl-stat:480 · .pl-lbl:485 · .pl-val:486,487 · .pl-tip:488 · .chip-edit:494,499,500
.rank-mini:506,512,513,514 · .lobby-mid:523 · .lobby-rail:525 · .rail-worlds:543 · .rail-div:544 · .lobby-stage:559,568,612,613
.lobby-bottom:561,566,1033,1034 · .newword-banner:574,581 · .nw-tag:582 · .nw-word:587 · .nw-hint:589,590 · .nw-box:592,1755
.nw-pop-word:593 · .nw-speak:594 · .nw-pop-phon:595 · .nw-ipa:596 · .nw-pop-sent:597 · .nw-pop-mean:598
.pet-tab:599,600,601,2079 · .stage-hero:622,637,645,790(+5) · .hero-ground:659,779,785 · .hero-rank-bg:661,664,667,671(+18) · #lobby3d-canvas:684,685 · .hero-scene:689,691,698,699(+8)
.caretaker-fig:738 · .caretaker-img:741 · .caretaker-emoji:743 · .blk-rig:750,751,752 · .stage-plate:812,820,831,832(+30) · .plate-title:826
.lobby-side:869,904,909,912(+22) · .side-sec:872,1994 · .side-label:873,878 · .side-label-row:880,881 · .lb-tabs-out:882,883,887 · .side-glass:891,898
.side-card:910,1022 · #quest-card:922,946,947,948(+6) · .q-bigcard:923,952,953,956(+1) · .qb-top:925 · .qb-emoji:926 · .qb-name:928
.qb-bar:929,930 · .qb-row:932 · .qb-prog:933 · .qb-reward:934 · .qb-go:935,939 · .q-dots:940
.q-dot:941,942,943 · .q-bonus:944 · .feed-row:967,1518,1523 · .inv-card:969,971,972 · .inv-btns:973 · .inv-go:974,976
.inv-x:977 · #online-card:981,2002,2003,2004(+1) · .fq-overlay:982 · .fq-box:984,1810 · .fq-head:988,990 · .fq-close:991
.fq-sec:993 · .fq-worlds:994 · .fq-world:995,997 · .fq-acts:998 · .fq-act:999,1002,1003 · .lobby-quiz-btn:1035
.lobby-foodquiz-btn:1036,1037 · .lobby-play-btn:1038,1042 · .panel-overlay:1047,1052 · .panel-box:1053 · .panel-head:1060,1064 · .panel-close:1065,1070
.panel-body:1071,1074,1075 · .panel-page:1072,1073 · .collect-sub:1079 · .mkt-empty:1080 · .craft-box:1081 · .mkt-listing:1082
.mkt-filter:1083,1375 · .hq-grid:1090 · .hq-card:1091,1096,1120 · .hq-head:1097 · .hq-pic:1103,1105 · .hq-emoji:1107
.hq-badge:1108 · .hq-stars:1112 · .hq-price:1113,1118,1119,1281(+1) · .car-grid:1125,1127,1128 · .robot-weap:1129 · .dcp-grid:1131
.dcp-card:1133,1136,1137,1138(+10) · .dcp-lock:1153 · .sold-badge:1157,1159,1160 · .rs-showroom:1162 · .rs-list:1163,1165 · .rs-thumb:1166,1168,1169,1170(+1)
.rs-thumb-pic:1171,1172 · .rs-thumb-price:1173 · .rs-stage:1175 · .rs-big:1178 · .rs-big-img:1179 · .rs-elec:1183,1187,1192
.rs-edge:1193,1199 · .rs-info:1202,1203,1204,1205(+1) · .rs-buy:1207,1209,1210 · .cs-showroom:1214 · .cs-list:1215,1217 · .cs-thumb:1218,1220,1221,1222(+1)
.cs-thumb-pic:1223,1224 · .cs-thumb-name:1225 · .cs-thumb-price:1226 · .cs-thumb-own:1227 · .cs-stage:1229 · .cs-big:1232
.cs-big-img:1233 · .cs-elec:1237,1241,1245 · .cs-edge:1246,1252 · .cs-interior:1255 · .cs-inr-label:1256,1257 · .cs-inr-img:1258
.cs-info:1260,1261,1262,1263(+6) · .cs-buy:1271,1273,1274,1275 · .car-emoji:1277 · .car-mine:1283 · .car-mine-pic:1288 · .car-mine-info:1289
.car-loan:1290,1291 · .car-mine-btns:1292,1293,1294 · .car-locked:1296 · .car-mine-head:1298 · .car-pick-list:1299,1300 · .car-pick:1301,1303,1304
.car-pick-pic:1305,1306 · .car-pick-name:1307,1308 · .car-pick-od:1309 · .car-buy-box:1311,1814 · .cb-pic:1312,1313,1314 · .cb-lines:1315
.cb-li:1316,1320,1321 · .cb-ins:1322,1326,1327 · .cb-plan:1328 · .cb-pl:1329,1334,1336,1340(+1) · .cb-total:1347 · .cb-btns:1348,1353
.cb-x:1349 · .shop-grid:1356 · .shop-item:1357,1362,1367,1368(+3) · .mkt-tab:1376,1377 · .pg-btn:1378,1379,1380 · .pg-dot:1381
.fr-gift-btn:1401,1406 · .gift-sec-title:1409 · .gift-in-row:1411 · .gift-out-row:1415 · .gift-in-pic:1416,1418,1419 · .gift-in-info:1420,1421
.gift-in-btns:1422 · .gift-accept:1423,1427,1429 · .gift-decline:1428 · .gift-box-card:1430 · .gift-box-from:1431,1432 · .gift-note:1433
.gift-pick-overlay:1436 · .gift-pick-box:1440 · .gift-pick-head:1446,1450 · .gift-pick-close:1451 · .gift-pick-tabs:1453 · .gp-tab:1454,1458
.gift-pick-body:1459 · .gp-chips:1460 · .gp-chip:1461,1465 · .gp-card:1466,1467 · .gp-price:1468 · .gp-note:1469
.gift-cf-pic:1470 · .chat-emoji-cats:1475 · .chat-emoji-cat:1479,1483,1484 · .chat-emoji-wrap:1485,1486 · .stage-left:1494 · .pet-info-btn:1498,1505,1506
.feed-list:1513,1517 · .feed-ico:1524 · .feed-txt:1525 · .feed-name:1526 · .feed-ago:1527 · .feed-empty:1528,1531
.pi-overlay:1533 · .pi-box:1537,1542,1543,1547(+2) · .pi-close:1549,1554,1555 · .pi-close-left:1557 · .pi-portrait:1559 · .pi-care-title:1565
.lbf-overlay:1568 · .lbf-box:1571 · .lbf-head:1576 · .lbf-title:1577 · .lbf-tabs:1578 · .lbf-close:1581
.lbf-close-l:1582 · .lbf-body:1583 · .lbf-grid:1584 · .lbf-cell:1586,1589,1590,1591(+1) · .lbf-podium:1595 · .pod:1597,1624,1625
.pod-char:1599 · .pod-base:1601 · .pod-rank:1603 · .pod-label:1605 · .pod-name:1607 · .pod-sc:1609
.pod-1:1614,1615 · .pod-2:1616,1617 · .pod-3:1618,1619 · .pod-4:1620,1621 · .pod-5:1622,1623 · .pl-wide:1628,1631,1632,1633
.pl-follow:1634,1639,1641 · .pl-followers:1642 · .pl-cols:1643 · .pl-col:1644 · .pl-sec-title:1645 · .pl-feed:1646,1649,1656
.pl-feed-row:1650,1654,1655 · .pl-assets-wrap:1658 · .pl-assets:1659 · .pl-asset:1662,1666,1673 · .pl-asset-emoji:1667 · .pl-asset-n:1668
.pl-pets-wrap:1675 · .pl-pets:1676 · .pl-pet:1677,1682,1684 · .pl-pet-nm:1685 · .img-lightbox:1688,1693,1694,1698(+3) · .settings-box:1711,1712,1757,1762(+20)
.set-feed-head:1713 · .set-feed-sub:1717 · .set-feed-row:1718 · .pillinfo-val:1723 · .pillinfo-desc:1728,1747 · .levelup-box:1736,1737,1808
.pillinfo-box:1739 · .plf-head:1742 · .plf-emoji:1743 · .plf-ht:1744,1745,1746 · .plf-foot:1748 · .alert-box:1753
.attn-box:1754 · .help-box:1786,1787,1788 · .food-box:1809 · .home-shop-box:1811 · .summary-box:1812 · .report-box:1813
.wl-grid:1816 · .tc-wrap:1818 · .spell-btn:1824,1829 · .sp-hud:1830 · .sp-word:1832 · .sp-ch:1833,1838
.sp-th:1840 · .sp-hint:1842 · .sp-exit:1845,1849 · .sp-banner:1850 · .sp-big:1855 · .sp-thb:1857
.sp-coin:1858 · #spell-confetti:1863 · .sp-rb:1864 · .sp-day:1874 · .sp-perfect:1876 · .sp-late:1878
#spell-coinpop:1881 · .side-sub:1990,1992 · .sec-quest:1995 · .on-page:2006,2007,2008,2009 · .inbox-overlay:2019 · .ib-box:2021
.ib-head:2025 · .ib-close:2029,2031 · .ib-list:2032,2033 · .ib-row:2034,2035,2036,2037 · .ib-ava:2038 · .ib-on:2042
.ib-mid:2044 · .ib-name:2045 · .ib-last:2046 · .ib-meta:2047 · .ib-time:2048 · .ib-dot:2050
.ib-story-badge:2053 · .ib-empty:2057 · .ib-story:2059,2061 · .ib-story-item:2062,2064,2071 · .ib-story-ava:2065 · .ib-story-on:2069
.ib-world:2074,2077 · #btn-music:2082,2085,2086 · #ws-overlay:2101 · #ws-board:2103,2109,2111 · .ws-head:2113 · .ws-title:2114
.ws-grade:2116 · .ws-body:2118 · .ws-gridwrap:2119 · #ws-grid:2120 · .ws-cell:2124,2128,2130,2138(+1) · .ws-flash:2142,2144
.ws-coinpop:2148 · .ws-side:2159 · .ws-find:2160 · #ws-words:2162,2164 · .ws-word:2165,2169,2171 · #ws-prog:2172
.ws-actions:2173,2174,2176 · #ws-new:2177 · #ws-stash:2178 · #ws-clear:2179 · #ws-win:2180,2182 · .ws-win-in:2183,2186

## css/style.css (1,505 บรรทัด · 408 selector)
:root:4 · *:14 · html:15,20 · input:24 · body:28 · #app:34
.screen:37,38 · h1:41 · .subtitle:42 · .egg-grid:45,62 · .egg-card:46,51,52,53(+2) · .pet-price:56,60
.egg:64,70,74 · .d1:75 · .basket:78,79,84,90(+5) · .basket-dog:88,101,102,103 · .basket-cat:89,104,105,106 · .egg-dragon:109
.topbar:124 · .topbar-coins:125 · .coin-pill:126,131,135,140 · .no-anim:141,438,1222,1462(+2) · .q-row:148,149,150,154(+1) · .q-emoji:151
.q-mid:152 · .q-name:153 · .q-bar:155,156 · .q-right:158,159 · .q-foot:160,161 · .tc-open:164,165
.tc-wrap:166 · .tc-card:167 · .tc-head:171 · .tc-sub:175 · .tc-name:176,177 · .tc-badges:178
.tc-when:179 · .tc-row:180,184 · .tc-pass:185 · .tc-try:186 · .tc-sign:187 · .tc-hint:188
.tc-close:189 · .mb-seller:195 · .mb-buy:196 · .wl-open:199,204 · .wl-box:205 · .wl-grid:206
.wl-it:210,214,215,216 · .wl-emoji:217 · .wl-name:218 · .wl-h:219 · .hq-card:220 · .icon-btn:221
#settings-badge:227 · .badge-pop:230 · .attn-box:232,233,250 · .attn-list:234 · .attn-row:235,240 · .attn-ico:241
.attn-txt:242,243 · .attn-go:244 · .attn-total:245,249 · .weather-banner:253 · .rain-banner:260,265,266,267 · .rain-row:269
.rain-icon:270 · .rain-track:271 · .rain-fill:275 · .rain-note:276 · .comp-earn:279,291,295,296(+1) · .comp-earn-label:284
.comp-earn-num:285,289 · .comp-earn-sub:290 · .farm-shop:300 · .farm-buy-btn:301,307,309 · .farm-buy-emoji:308 · .farm-list:310
.farm-tree:311,315,320,325 · .farm-tree-emoji:319 · .farm-tree-info:322,323 · .farm-tree-status:324 · .farm-grow-badge:326 · .farm-sell-btn:327,331
.farm-sellall-btn:332,338,339 · .rank-card:342 · .rank-badge-wrap:347 · .rank-badge-img:348 · .rank-badge-emoji:349 · .rank-body:350
.rank-name:351,352 · .rank-bar:353 · .rank-fill:354 · .rank-text:355 · .rankup-overlay:358 · .rankup-rays:364
.rankup-content:380 · .rankup-title:385 · .rankup-badge:390,403 · .rankup-badge-img:402 · .rankup-name:404 · .rankup-en:408
.rankup-sub:412 · .rankup-btn:413,420,421 · .cr-btn-row:423 · .rankup-btn-2:424,425 · .thunder-fx:428 · .quake:429
.pet-tabs:441 · .pet-tab:442,446,447 · .pet-card:449 · .pet-stage:454 · .aura:455,461 · .sp1:462
.pet-wrap:465 · .pet-emoji:466 · .pet-img:467 · .egg-img:468 · .feed-pet:469,615 · .pet-baby:470
.pet-adult:471 · .pet-egg-stage:473 · .wear:475 · .wear-head:476 · .wear-face:477 · .wear-neck:478
.pet-name:480 · .stage-label:481 · .level-row:482 · .level-badge:483 · .exp-bar:487 · .exp-fill:488
.exp-text:489 · .ability-box:491,495 · .hunger-bar:498 · .hunger-fill:499,500,501 · .food-item:507,549,553,554(+6) · .hunger-text:511
.heat-bar:514 · .heat-fill:515 · .heat-text:516,517,518 · .care-row:520 · .care-btn:521,525,528 · .btn-feed:526
.btn-cure:527 · .sick-banner:529 · .pet-sick:533 · .pet-asleep:536 · .sleep-badge:537 · .btn-sleep:539
.dinner-btn:542 · .food-box:546,547 · .food-grid:548 · .fav-tag:568 · .fd-exp:572 · .food-sec:574
.food-sec-human:578 · .bad-tag:580 · .fd-toxin:584 · .fd-safe:585 · .fq-box:588,589 · .fq-progress:590
.fq-pair:591,592 · .fq-ask:593 · .fq-why:594 · .fq-btns:598,599,603 · .fq-yes:604 · .fq-no:605
.fq-next:606 · .food-cancel:607 · .feed-box:613,614 · .feed-gain:616 · .sick-badge:620 · .big-btn:626,632,853,854(+6)
.shop-card:635 · .shop-title:639 · .shop-grid:640 · .shop-item:641,645,646,647(+4) · .it-tag:652 · .tag-wear:653
.lock-banner:655 · .home-current:661,666,667 · .home-img:668 · .home-emoji:669 · .home-btn:670,692 · .home-layout:672
.home-pic-col:673,679 · .home-img-big:677 · .home-info-col:680,682,685,686 · .home-name-row:683 · .home-desc-row:684 · .home-shop-box:694,695
.home-list:696 · .home-option:697,701,702,703(+1) · .home-opt-img:704 · .home-opt-body:706,707 · .home-price:708 · .reset-link:713
.login-card:719 · .login-pets:720 · .login-status:721 · .google-btn:722,728,729 · .login-note:730 · .install-btn:733,739,740
.install-guide-overlay:743 · .install-guide:747,751,754 · .install-steps:752,753 · .install-guide-close:755 · .login-account:760 · .register-card:763,767,773,777
.reg-safety:769,771,772 · .student-chip:778 · .clock-chip:782 · .online-count:788 · .online-row:795,799,800 · .online-dot:804
.online-name:809 · .online-act:813 · .online-live:817 · .online-note:821 · .lb-empty:824 · .lb-list:825
.lb-row:826,830,831 · .lb-rank:835 · .lb-name:837,841 · .lb-coins:845 · .lb-hint:847 · .lb-badgeline:848
.lb-tabs:850 · .lb-tab:851,852 · .tinv-note:863 · .cat-card:869 · .cat-head:873 · .cat-emoji:874
.cat-name:875 · .cat-pass:876 · .cat-info:877 · .cat-btns:878 · .cat-btn:879,883,884,885 · .quiz-progress:888
.quiz-word-card:889 · .quiz-speak:894 · .quiz-choice:895,900,901,902 · .quiz-score-pill:903 · .stats-card:906 · .stats-title:910,1343
.stats-row:911,912,913,914 · .game-top:917 · .back-btn:918 · .combo-pill:922 · .timer-wrap:926 · .timer-fill:927,928
.board-label:930 · .card-grid:931 · .word-card:932,938,939,940(+3) · .hint-btn:946,951 · .game-endless-note:954,959,961,965(+6) · .report-btn:986,991
.report-box:994 · .report-close:995 · .rp-head:999 · .rp-avatar:1000,1001 · .rp-title:1002 · .rp-sub:1003
.rp-levelcard:1005 · .rp-level-top:1009 · .rp-bar:1010 · .rp-bar-fill:1011 · .rp-level-note:1012,1013 · .rp-grid:1015
.rp-stat:1016 · .rp-ic:1019 · .rp-num:1020 · .rp-lbl:1021 · .rp-section:1023 · .rp-h3:1024
.rp-badge-mini:1025 · .rp-row:1026,1027,1028 · .rp-empty:1029 · .rp-badges:1030 · .rp-badge:1031 · .rp-tline:1034
.rp-tl-head:1035,1036 · .rp-tl-ems:1037 · .rp-em:1038,1039 · .rp-tl-note:1040,1041 · .rp-crown:1043,1044 · .rp-wtitle:1046
.rp-wnow:1047,1048 · .rp-wgraph:1049 · .rp-wcol:1050 · .rp-wval:1051 · .rp-wbar:1052,1053 · .rp-wlbl:1054
.rp-cheer:1056 · .report-ok:1060 · .summary-box:1063,1114,1118,1119(+2) · .sm-burst:1064 · .sm-title:1066 · .sm-line:1067
.sm-coin:1068 · .sm-matches:1074,1075 · .confetti:1077 · .sm-badge:1084 · .sm-badge-all:1088 · .badge-celebrate-overlay:1091,1104
.badge-celebrate:1095 · .bc-emoji:1101 · .bc-title:1102 · .bc-sub:1103 · .sm-cheer:1108 · .sm-streak:1109,1110
.sm-sick:1111 · .sm-btns:1112 · .float-fx:1124 · .toast:1131 · .toast-warn:1138,1145,1146,1152 · .toast-clear-all:1154,1161
.alert-box:1163 · .alert-ok:1164,1169 · .settings-box:1171 · .set-row:1172 · .set-hint:1176 · .set-hint-on:1177
.set-hint-off:1178 · .set-lwrap:1179 · .set-label:1180 · .set-desc:1181 · .set-switch:1182,1186,1187,1192(+4) · .set-sw-knob:1188
.set-sw-txt:1195 · .set-close:1201,1206 · .set-help:1207,1212 · .help-box:1214,1215,1220 · .help-item:1216 · .update-banner:1228,1237,1238
#update-reload:1239 · #update-dismiss:1243 · .levelup-overlay:1249 · .levelup-box:1253,1260,1261,1262(+4) · .bill-box:1268,1272,1273 · .tag-off:1274
.home-decayed-img:1275 · .home-dark-img:1276 · .thirst-fill:1277 · .thirst-text:1278,1279 · .toxin-fill:1282 · .toxin-text:1283,1284
.detox-btn:1285,1290 · .shape-text:1293,1294,1295,1296(+1) · .avatar-pick:1300 · .avatar-opt:1301,1305,1306,1307 · .avatar-chip-img:1311 · .avatar-chip-blk:1313
.set-avatar-btns:1314 · .avatar-mini:1315,1319 · .set-blk-row:1321 · .set-sub2:1322 · .blk-grid:1324 · .blk-mini:1325,1328,1329,1330
.game-avatar:1333,1334,1335 · .stats-nick:1344 · .ticket-owned:1347,1351 · .collect-sub:1356 · .mkt-tabs:1357 · .mkt-tab:1358,1362
.mkt-filter:1363 · .mkt-row:1367 · .mkt-emoji:1371,1372 · .mkt-info:1373,1374 · .mkt-tier-stars:1375 · .mkt-buy:1376,1381,1382
.mkt-price-lo:1383 · .mkt-price-hi:1384 · .mkt-empty:1385 · .collect-grid:1388 · .collect-cell:1389 · .cc-emoji:1390,1391
.cc-name:1392 · .cc-count:1393 · .cc-list-btn:1394,1398 · .mkt-listhead:1399 · .mkt-listing:1400 · .ml-cancel:1404
.mkt-sold:1410,1411,1412 · .list-dialog:1419,1420,1425 · .list-hint:1424 · .collect-reveal-frame:1428,1435 · .collect-reveal-img:1434 · .collect-reveal-stars:1436
.craft-box:1439 · .craft-head:1440 · .craft-bar:1441 · .craft-fill:1442 · .craft-text:1443 · .craft-btn-row:1444,1445
.craft-go-btn:1447,1453,1454,1457 · .craft-cancel:1465,1469 · .mkt-catalog:1472,1473,1474 · .mkt-pager:1477 · .pg-btn:1478,1482,1483 · .pg-mid:1484
.pg-dots:1485 · .pg-dot:1486,1487 · .order-head:1488 · .order-row:1489,1494,1496,1498 · .order-deliver:1499,1504 · .order-need:1505
