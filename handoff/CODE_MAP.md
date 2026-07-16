# CODE_MAP.md — แผนที่โค้ด:บรรทัด (เจนอัตโนมัติโดย `tools/gen_code_map.py` — **ห้ามแก้มือ** เดี๋ยวโดนเขียนทับ)

> วิธีใช้: หาชื่อฟังก์ชัน/ค่าคงที่/selector ในไฟล์นี้ (Grep หรือกวาดตา) → `Read` ไฟล์จริง `offset=<บรรทัด>` `limit=40`
> css = index `selector:บรรทัดทุกจุดที่ประกาศ` (บั๊ก UI เริ่มหาที่นี่) · เจนใหม่ทุกครั้งที่รัน `python tools/rotate_handoff.py` · อัปเดต: 2026-07-17

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

## js/state.js (935 บรรทัด · 83 รายการ)
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
ORDER_MAX:799 · ORDER_LIFE_MS:800 · ORDER_GAP_MIN_MS:801 · ORDER_GAP_SPAN_MS:802 · ORDER_TIER_WEIGHT:803 · newOrder:804
orderTick:817 · careTick:825 · expNeed:906 · addExp:911 · addRP:931

## js/ui.js (6,054 บรรทัด · 237 รายการ)
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
showRankUp:2194 · bindPetPlateButtons:2229 · openPetInfoOverlay:2246 · feedAgo:2269 · renderFeedCard:2282 · alignPetTabs:2335
alignCureBtn:2352 · DICT_FILE_COUNT:2373 · loadDict:2374 · dictSearch:2389 · dictEntryHTML:2402 · openDictOverlay:2413
renderDashboard:2445 · sleepBtnHTML:2826 · sleepHintHTML:2833 · sleepAllPets:2844 · wakeAllPets:2857 · feedPet:2868
openFoodMenu:2881 · feedWith:2952 · AVATAR_UI:2982 · playerAvatarHTML:2985 · SHAPE_UI:2991 · showFeedResult:3000
curePet:3036 · railCureClick:3059 · detoxPet:3071 · openFoodQuiz:3094 · renderShop:3174 · homeVisualHTML:3234
showHomeRuined:3248 · showCutNotice:3269 · renderHomeCard:3287 · payMaint:3371 · trashBillUI:3387 · payTrash:3404
UTILITY_UI:3423 · utilityBillUI:3472 · payUtility:3497 · buyUtilityFix:3523 · renderPhoneCard:3541 · buyPhone:3581
sellPhone:3603 · compLiveTotal:3624 · onlineLiveTotal:3635 · renderOnlineEarnPill:3640 · openPillInfo:3663 · renderComputerCard:3703
buyComputer:3738 · sellComputer:3761 · soldCount:3787 · soldBadge:3788 · renderTicketCard:3793 · loadScriptOnce:3849
enterAdventure3D:3865 · enterHaunted3D:3887 · advHealClick:3909 · buyTicket:3929 · renderHauntCard:3955 · buyHauntTicket:4010
renderHeliCard:4037 · buyHeliTicket:4095 · enterHeli3D:4118 · renderDroneCard:4140 · buyDroneTicket:4195 · enterDrone3D:4218
renderDriveCard:4241 · buyDriveTicket:4314 · enterDrive3D:4337 · renderSoccerCard:4370 · buySoccerTicket:4418 · enterSoccer3D:4441
WORLD3D:4465 · gotoRobotShop:4474 · scrollShopCardIntoView:4479 · railWorldClick:4482 · renderRailWorlds:4503 · tinvNoticeHTML:4562
openTinvPicker:4570 · fruitCountdown:4614 · renderFarmCard:4626 · renderFarmClock:4687 · buyFruit:4703 · sellFruit:4723
sellAllFruit:4740 · collectImg:4766 · renderFactoryCard:4772 · renderMarketCard:4819 · updateWishBadge:4874 · openWishlistDialog:4885
renderMarketBrowse:4922 · carImg:4951 · renderVehicleShop:4952 · CS_CYCLE_MS:5003 · carInteriorImg:5004 · carStatHtml:5006
renderCarShowroom:5013 · csShowBig:5039 · csInit:5066 · RS_CYCLE_MS:5089 · robotImg:5090 · renderRobotShop:5091
rsShowBig:5113 · rsInit:5134 · buyRobot:5153 · enterMecha3D:5175 · pickMechaRobot:5196 · pickDriveCar:5228
openCarBuyDialog:5269 · buyCarInsurance:5330 · payCarLoanMonthly:5349 · payCarLoanFull:5361 · carDriveBlock:5380 · gotoVehicleShop:5385
gotoMyStock:5390 · showNeedCarDialog:5396 · craftDiscount:5408 · renderFactory:5411 · renderOrdersUI:5478 · startProduce:5497
buyCollectible:5525 · cancelProduce:5553 · deliverOrder:5567 · renderOrderClock:5584 · renderCollectMine:5594 · openListDialog:5636
cancelListing:5689 · buyMarketItem:5712 · showCollectReveal:5739 · buyAC:5775 · openHomeShop:5794 · renderPetShop:5853
showLevelUp:5914 · renderStats:5951 · showTeacherCard:6022

## js/util.js (576 บรรทัด · 28 รายการ)
shuffle:6 · fmtNum:15 · escapeHTML:19 · seededRand:25 · fmtThaiDT:35 · fmtThaiDate:39
showScreen:44 · TOAST_WARN_RE:52 · restackToasts:55 · toast:77 · floatFx:97 · beep:107
sirenSynth:133 · playSpark:157 · sparkSynth:171 · thunderFx:206 · wordAudioFile:274 · speakWord:277
speakLetter:297 · pickSpeakVoice:316 · speakWordTTS:327 · askNameDialog:347 · askConfirm:387 · alertBox:404
applyNoAnim:420 · openSettings:425 · openHelp:531 · openTeacherGuide:557

## js/wordsearch.js (235 บรรทัด · 0 รายการ)

## css/lobby.css (2,253 บรรทัด · 417 selector)
:root:6 · html:15 · body:16 · *:33,34,35,36 · #app:39 · h1:41
.subtitle:42 · .shop-title:43 · #rotate-overlay:46 · .screen:68 · #screen-select:77,78,79,80(+5) · .egg-need:87
.petshop-topright:89 · .petshop-play-link:90,95 · .word-card:133 · .quiz-choice:134,135,136 · .big-btn:139,140,141,142 · #screen-dashboard:147,648,656
.lobby-top:154,556,557,558(+2) · .top-flex:155 · .profile-plate:156,160,500 · #rain-fx:165 · .rain-layer:168,174 · .rain-glass:181
.glass-drop:182 · .rail-btn:197,567,573,574(+13) · .rail-badge:198 · .fr-code-box:203 · .fr-code-label:207 · .fr-code-row:208
.fr-code:209 · .fr-copy-btn:214,218,223,224 · .fr-search-btn:219 · .fr-add-btn:220 · .fr-accept:221 · .fr-decline:222
#fr-search-input:225 · #fr-search-result:229 · .fr-found:230 · .fr-hint:234 · .fr-list-title:235 · .fr-row:236
.fr-req:240 · .fr-row-name:242,246 · .fr-row-status:250 · .fr-req-btns:251 · .online-dot:252 · .fr-chat-btn:253,258,260
.fr-unread:261 · .chat-overlay:268 · .chat-box:272,381,388,395(+12) · .chat-head:284 · .chat-theme-btn:289,293 · .chat-secret-tg:294,295
.cs-switch:296,297,302,303 · .cs-slider:298,300 · .chat-secret-note:304 · .chat-theme-strip:307 · .chat-theme-sw:309,312,313,314(+1) · .chat-head-name:316,317
.chat-close:318 · .chat-msgs:322 · .chat-empty:326 · .chat-typing:328 · .ct-dots:330,331,333,334 · .no-anim:336,349,626,697(+22)
.chat-bubble:337,342,347 · .chat-emoji:350 · .chat-emo:354,358 · .chat-input-row:359 · .chat-emoji-btn:363 · #chat-input:367
.chat-send:371,376,377 · .pl-click:444,446,447 · .pl-overlay:448 · .pl-card:452,1679 · .pl-close:458 · .pl-head:462
.pl-grade:467 · .pl-badges:469 · .pl-badge-chip:470,474 · .pl-body:475 · .pl-loading:476 · .pl-none:477
.pl-me-tag:478 · .pl-stat:479 · .pl-lbl:484 · .pl-val:485,486 · .pl-tip:487 · .chip-edit:493,498,499
.rank-mini:505,511,512,513 · .pass-photo:515,520 · .pet-tabs:522 · .dict-box:523,527,528,529(+1) · .dict-card:535,540 · .dict-head:541,542
.dict-list:543 · .dict-item:544,548,549,550(+5) · .lobby-mid:564 · .lobby-rail:566 · .rail-worlds:584 · .rail-div:585
.lobby-stage:600,609,653,654 · .lobby-bottom:602,607,1074,1075 · .newword-banner:615,622 · .nw-tag:623 · .nw-word:628 · .nw-hint:630,631
.nw-box:633,1816 · .nw-pop-word:634 · .nw-speak:635 · .nw-pop-phon:636 · .nw-ipa:637 · .nw-pop-sent:638
.nw-pop-mean:639 · .pet-tab:640,641,642,2140 · .stage-hero:663,678,686,831(+5) · .hero-ground:700,820,826 · .hero-rank-bg:702,705,708,712(+18) · #lobby3d-canvas:725,726
.hero-scene:730,732,739,740(+8) · .caretaker-fig:779 · .caretaker-img:782 · .caretaker-emoji:784 · .blk-rig:791,792,793 · .stage-plate:853,861,872,873(+30)
.plate-title:867 · .lobby-side:910,945,950,953(+22) · .side-sec:913,2055 · .side-label:914,919 · .side-label-row:921,922 · .lb-tabs-out:923,924,928
.side-glass:932,939 · .side-card:951,1063 · #quest-card:963,987,988,989(+6) · .q-bigcard:964,993,994,997(+1) · .qb-top:966 · .qb-emoji:967
.qb-name:969 · .qb-bar:970,971 · .qb-row:973 · .qb-prog:974 · .qb-reward:975 · .qb-go:976,980
.q-dots:981 · .q-dot:982,983,984 · .q-bonus:985 · .feed-row:1008,1570,1575 · .inv-card:1010,1012,1013 · .inv-btns:1014
.inv-go:1015,1017 · .inv-x:1018 · #online-card:1022,2063,2064,2065(+1) · .fq-overlay:1023 · .fq-box:1025,1871 · .fq-head:1029,1031
.fq-close:1032 · .fq-sec:1034 · .fq-worlds:1035 · .fq-world:1036,1038 · .fq-acts:1039 · .fq-act:1040,1043,1044
.lobby-quiz-btn:1076 · .lobby-foodquiz-btn:1077,1078 · .lobby-play-btn:1079,1083 · .panel-overlay:1088,1093 · .panel-box:1094 · .panel-head:1101,1105
.panel-close:1106,1111 · .panel-body:1112,1115,1116 · .panel-page:1113,1114 · .collect-sub:1120 · .mkt-empty:1121 · .craft-box:1122
.mkt-listing:1123 · .mkt-filter:1124,1427 · .hq-grid:1131 · .hq-card:1132,1137,1161 · .hq-head:1138 · .hq-pic:1144,1146
.hq-emoji:1148 · .hq-badge:1149 · .hq-stars:1153 · .hq-price:1154,1159,1160,1163(+6) · .craft-credit:1167,1169,1170 · .car-grid:1177,1179,1180
.robot-weap:1181 · .dcp-grid:1183 · .dcp-card:1185,1188,1189,1190(+10) · .dcp-lock:1205 · .sold-badge:1209,1211,1212 · .rs-showroom:1214
.rs-list:1215,1217 · .rs-thumb:1218,1220,1221,1222(+1) · .rs-thumb-pic:1223,1224 · .rs-thumb-price:1225 · .rs-stage:1227 · .rs-big:1230
.rs-big-img:1231 · .rs-elec:1235,1239,1244 · .rs-edge:1245,1251 · .rs-info:1254,1255,1256,1257(+1) · .rs-buy:1259,1261,1262 · .cs-showroom:1266
.cs-list:1267,1269 · .cs-thumb:1270,1272,1273,1274(+1) · .cs-thumb-pic:1275,1276 · .cs-thumb-name:1277 · .cs-thumb-price:1278 · .cs-thumb-own:1279
.cs-stage:1281 · .cs-big:1284 · .cs-big-img:1285 · .cs-elec:1289,1293,1297 · .cs-edge:1298,1304 · .cs-interior:1307
.cs-inr-label:1308,1309 · .cs-inr-img:1310 · .cs-info:1312,1313,1314,1315(+6) · .cs-buy:1323,1325,1326,1327 · .car-emoji:1329 · .car-mine:1335
.car-mine-pic:1340 · .car-mine-info:1341 · .car-loan:1342,1343 · .car-mine-btns:1344,1345,1346 · .car-locked:1348 · .car-mine-head:1350
.car-pick-list:1351,1352 · .car-pick:1353,1355,1356 · .car-pick-pic:1357,1358 · .car-pick-name:1359,1360 · .car-pick-od:1361 · .car-buy-box:1363,1875
.cb-pic:1364,1365,1366 · .cb-lines:1367 · .cb-li:1368,1372,1373 · .cb-ins:1374,1378,1379 · .cb-plan:1380 · .cb-pl:1381,1386,1388,1392(+1)
.cb-total:1399 · .cb-btns:1400,1405 · .cb-x:1401 · .shop-grid:1408 · .shop-item:1409,1414,1419,1420(+3) · .mkt-tab:1428,1429
.pg-btn:1430,1431,1432 · .pg-dot:1433 · .fr-gift-btn:1453,1458 · .gift-sec-title:1461 · .gift-in-row:1463 · .gift-out-row:1467
.gift-in-pic:1468,1470,1471 · .gift-in-info:1472,1473 · .gift-in-btns:1474 · .gift-accept:1475,1479,1481 · .gift-decline:1480 · .gift-box-card:1482
.gift-box-from:1483,1484 · .gift-note:1485 · .gift-pick-overlay:1488 · .gift-pick-box:1492 · .gift-pick-head:1498,1502 · .gift-pick-close:1503
.gift-pick-tabs:1505 · .gp-tab:1506,1510 · .gift-pick-body:1511 · .gp-chips:1512 · .gp-chip:1513,1517 · .gp-card:1518,1519
.gp-price:1520 · .gp-note:1521 · .gift-cf-pic:1522 · .chat-emoji-cats:1527 · .chat-emoji-cat:1531,1535,1536 · .chat-emoji-wrap:1537,1538
.stage-left:1546 · .pet-info-btn:1550,1557,1558 · .feed-list:1565,1569 · .feed-ico:1576 · .feed-txt:1577 · .feed-name:1578
.feed-ago:1579 · .feed-empty:1580,1583 · .pi-overlay:1585 · .pi-box:1589,1594,1595,1599(+2) · .pi-close:1601,1606,1607 · .pi-close-left:1609
.pi-portrait:1611 · .pi-care-title:1617 · .lbf-overlay:1620 · .lbf-box:1623 · .lbf-head:1628 · .lbf-title:1629
.lbf-tabs:1630 · .lbf-close:1633 · .lbf-close-l:1634 · .lbf-body:1635 · .lbf-grid:1636 · .lbf-cell:1638,1641,1642,1643(+1)
.lbf-podium:1647 · .pod:1649,1676,1677 · .pod-char:1651 · .pod-base:1653 · .pod-rank:1655 · .pod-label:1657
.pod-name:1659 · .pod-sc:1661 · .pod-1:1666,1667 · .pod-2:1668,1669 · .pod-3:1670,1671 · .pod-4:1672,1673
.pod-5:1674,1675 · .pl-wide:1680,1683,1684,1685 · .pl-follow:1686,1691,1693 · .pl-unfollow:1695,1701,1702 · .pl-followers:1703 · .pl-cols:1704
.pl-col:1705 · .pl-sec-title:1706 · .pl-feed:1707,1710,1717 · .pl-feed-row:1711,1715,1716 · .pl-assets-wrap:1719 · .pl-assets:1720
.pl-asset:1723,1727,1734 · .pl-asset-emoji:1728 · .pl-asset-n:1729 · .pl-pets-wrap:1736 · .pl-pets:1737 · .pl-pet:1738,1743,1745
.pl-pet-nm:1746 · .img-lightbox:1749,1754,1755,1759(+3) · .settings-box:1772,1773,1818,1823(+20) · .set-feed-head:1774 · .set-feed-sub:1778 · .set-feed-row:1779
.pillinfo-val:1784 · .pillinfo-desc:1789,1808 · .levelup-box:1797,1798,1869 · .pillinfo-box:1800 · .plf-head:1803 · .plf-emoji:1804
.plf-ht:1805,1806,1807 · .plf-foot:1809 · .alert-box:1814 · .attn-box:1815 · .help-box:1847,1848,1849 · .food-box:1870
.home-shop-box:1872 · .summary-box:1873 · .report-box:1874 · .wl-grid:1877 · .tc-wrap:1879 · .spell-btn:1885,1890
.sp-hud:1891 · .sp-word:1893 · .sp-ch:1894,1899 · .sp-th:1901 · .sp-hint:1903 · .sp-exit:1906,1910
.sp-banner:1911 · .sp-big:1916 · .sp-thb:1918 · .sp-coin:1919 · #spell-confetti:1924 · .sp-rb:1925
.sp-day:1935 · .sp-perfect:1937 · .sp-late:1939 · #spell-coinpop:1942 · .side-sub:2051,2053 · .sec-quest:2056
.on-page:2067,2068,2069,2070 · .inbox-overlay:2080 · .ib-box:2082 · .ib-head:2086 · .ib-close:2090,2092 · .ib-list:2093,2094
.ib-row:2095,2096,2097,2098 · .ib-ava:2099 · .ib-on:2103 · .ib-mid:2105 · .ib-name:2106 · .ib-last:2107
.ib-meta:2108 · .ib-time:2109 · .ib-dot:2111 · .ib-story-badge:2114 · .ib-empty:2118 · .ib-story:2120,2122
.ib-story-item:2123,2125,2132 · .ib-story-ava:2126 · .ib-story-on:2130 · .ib-world:2135,2138 · #btn-music:2143,2146,2147 · #ws-overlay:2162
#ws-board:2164,2170,2172 · .ws-head:2174 · .ws-title:2175 · .ws-grade:2177 · .ws-body:2179 · .ws-gridwrap:2180
#ws-grid:2181 · .ws-cell:2185,2189,2191,2199(+1) · .ws-flash:2203,2205 · .ws-coinpop:2209 · .ws-side:2220 · .ws-find:2221
#ws-words:2223,2225 · .ws-word:2226,2230,2232 · #ws-prog:2233 · .ws-actions:2234,2235,2237 · #ws-new:2238 · #ws-stash:2239
#ws-clear:2240 · #ws-win:2241,2243 · .ws-win-in:2244,2247

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
