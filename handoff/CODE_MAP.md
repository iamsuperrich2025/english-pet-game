# CODE_MAP.md — แผนที่โค้ด:บรรทัด (เจนอัตโนมัติโดย `tools/gen_code_map.py` — **ห้ามแก้มือ** เดี๋ยวโดนเขียนทับ)

> วิธีใช้: หาชื่อฟังก์ชัน/ค่าคงที่/selector ในไฟล์นี้ (Grep หรือกวาดตา) → `Read` ไฟล์จริง `offset=<บรรทัด>` `limit=40`
> css = index `selector:บรรทัดทุกจุดที่ประกาศ` (บั๊ก UI เริ่มหาที่นี่) · เจนใหม่ทุกครั้งที่รัน `python tools/rotate_handoff.py` · อัปเดต: 2026-07-17

## js/adventure3d.js (7,107 บรรทัด · 304 รายการ)
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
tryCompleteWords:1666 · completeWord:1680 · spawnMonster:1724 · killMonster:1733 · tickMonsters:1741 · damagePlayer:1763
shoot:1779 · tickShots:1793 · spawnGhost:1819 · GHOST_STYLE:1828 · GHOST_H_DEFAULT:1829 · applyGhostSize:1830
respawnGhost:1839 · tickGhosts:1855 · sessionRecapHtml:1900 · hauntRunSec:1907 · fmtSurv:1908 · hauntSurviveFinish:1909
tickSurvive:1919 · renderHearts:1932 · ghostHit:1941 · caught:1963 · knockedOut:1989 · netReady:2153
netJoin:2157 · sendPos:2170 · sendChat:2197 · toggleChatBox:2211 · onPeerData:2221 · removePeer:2299
netLeave:2311 · tickPeers:2319 · RTC_CFG:2390 · tinvLinked:2391 · partyWord:2398 · syncPartyWord:2411
updateVoiceBtns:2563 · PODIUM_BONUS:2588 · podiumJoin:2590 · podiumLeave:2601 · endRound:2602 · showPodium:2613
tinvCheck:2653 · showBanner:2673 · renderHudTop:2679 · renderHudWords:2684 · renderHudInv:2694 · ddTierFromName:2701
renderBoard:2703 · drawBigMap:2727 · openBigMap:2782 · closeBigMap:2790 · drawMinimap:2795 · loadCarDash:2867
loadCarWheel:2879 · buildDom:2889 · confirmExit:4101 · IS_TOUCH:4120 · bindInput:4121 · movePlayer:4206
tickPlayer:4216 · collideDrone:4257 · tickDrone:4275 · nearMissTick:4355 · showNearMiss:4378 · awardDaredevil:4389
comboCheer:4406 · comboFlash:4422 · driveCell:4431 · nearestStreet:4437 · collideCar:4447 · tlDotY:4478
tlSet:4482 · driveArms:4499 · tlTick:4511 · TL_GREEN:4555 · tlRedDur:4557 · tlightPhase:4558
buildTrafficLights:4565 · rlTick:4617 · cellDrivable:4649 · cellCenter:4650 · losClear:4652 · nearestDrivableCell:4662
routeGrid:4671 · pickGpsTarget:4724 · gpsSpeak:4736 · tickGps:4751 · tickDrive:4827 · drawCarDial:5005
drawCarGauges:5035 · RADIO_RECT:5063 · CAR_RADIO_RECT:5065 · carRadioRect:5071 · radioLayout:5073 · radioSetHint:5096
renderRadioList:5102 · radioToggleList:5112 · drawRadioViz:5117 · radioTick:5135 · BOBBLE_FOOT:5148 · BOBBLE_H:5149
BOBBLE_ASPECT:5150 · BOB_OMEGA:5153 · BOB_PITCH_FORCE:5155 · BOBBLE_SKINS:5157 · bobbleSetAvatar:5164 · bobbleLayout:5171
bobbleTick:5184 · bobblePoke:5209 · bobbleApplySkin:5226 · dollOwned:5236 · openDollPicker:5237 · carStartShow:5274
showLawInfo:5292 · lawNotice:5314 · driveFineSettle:5324 · heliFloorAt:5500 · tickHeli:5507 · gaugeBezel:5652
gaugeTicks:5657 · gaugeNeedle:5667 · gaugeText:5674 · drawGauges:5680 · soccerLetterPos:6000 · letterNeeded:6004
soccerNeededSet:6009 · soccerTileGeo:6015 · soccerGoldTexture:6017 · makeSoccerTile:6034 · soccerRefreshSkins:6043 · soccerBuildTargets:6050
soccerRetarget:6059 · soccerCoinPop:6071 · soccerFieldTexture:6083 · soccerNetTexture:6094 · soccerCrowdTexture:6101 · soccerBallMat:6109
buildSoccerGoal:6117 · buildStands:6128 · soccerNumTex:6136 · makeSoccerPlayer:6146 · soccerResetBall:6170 · soccerKick:6175
soccerCheer:6183 · updateSoccerGuide:6184 · soccerCamera:6198 · tickSoccer:6213 · soccerKitShow:6289 · soccerKitGo:6304
emojiSprite:6355 · makeAlien:6360 · startWave:6393 · waveSpawnFill:6404 · waveComplete:6413 · updateWaveHud:6423
checkMechaBossBadge:6425 · alienSpawnPos:6434 · removeAlien:6439 · mechaHudWord:6444 · setMechaHudSkin:6452 · mechaComboPop:6464
mechaShielded:6469 · mechaDamageFx:6471 · mechaHitByAlien:6476 · spawnAlienShot:6482 · removeAlienShot:6492 · tickAlienShots:6497
spawnPowerup:6509 · removePowerup:6522 · collectPowerup:6527 · tickPowerups:6534 · updateMechaHud:6543 · mechaTracer:6583
mechaFire:6592 · explodeAlien:6629 · tickMecha:6658 · loop:6714 · clearEntities:6742 · INTRO_KEY:6756
introSeenObj:6757 · introSeen:6758 · markIntroSeen:6759 · INTRO:6760 · showIntro:6825 · closeIntro:6850
beginPlay:6856 · start:6858 · exitWorld:7002 · mechaRecapLine:7037

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

## js/game.js (871 บรรทัด · 50 รายการ)
REPLAY_BONUS_EVERY:23 · REPLAY_BONUS_TIERS:25 · replayBonusFor:26 · SESSION_MILESTONES:32 · addSessionCoins:35 · updateBestTarget:74
weekKeyStr:87 · rolloverWeekBest:93 · exitGame:99 · showSessionSummary:132 · sprinkleConfetti:179 · VOCAB_PER_LEVEL:198
VOCAB_RANK_NAMES:199 · vocabRankName:200 · showProgressReport:202 · THUNDER_MS:346 · THUNDER_TIERS:350 · THUNDER_TIER_UI:351
thunderEmoji:352 · DAREDEVIL_TIERS:356 · DAREDEVIL_TIER_UI:357 · daredevilEmoji:358 · DILIGENT_TIERS:362 · DILIGENT_TIER_UI:363
diligentEmoji:364 · MECHABOSS_TIERS:368 · MECHABOSS_TIER_UI:369 · mechaBossEmoji:370 · badgeSuffix:375 · BADGE_META:386
NAME_BADGE_RE:394 · splitNameBadges:395 · badgeEmojis:401 · badgeScore:406 · checkCrown:412 · currentBadgeScore:428
rolloverBadgeWeek:432 · addDiligent:445 · celebrateBadge:461 · addThunder:475 · startGame:489 · newRound:529
updateTimerBar:568 · updateComboPill:574 · pickCard:578 · checkMatch:590 · renderCats:700 · startQuiz:734
renderQuizQuestion:750 · finishQuiz:808

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

## js/state.js (938 บรรทัด · 83 รายการ)
STORAGE_KEY:6 · CURE_COST:8 · HUNGRY_SICK_MS:9 · MEAL_HOUR:11 · MEAL_FULL:12 · SLEEP_FROM_HOUR:13
SLEEP_SICK_HOUR:14 · WAKE_HOUR:15 · DINNER_COST:16 · TOXIN_FULL:18 · DETOX_COST:19 · FOODQUIZ_Q:21
FOODQUIZ_COIN:22 · FOODQUIZ_BONUS:23 · SHAPE_JUNK_MEALS:25 · SHAPE_CLEAN_MEALS:26 · SHAPE_MISS_MEALS:27 · SHAPE_EXP_BONUS:28
HEAT_SICK_MS:29 · THIRST_SICK_MS:30 · DEFAULT_STATE:32 · FEED_CATS:139 · SLOT_MS:150 · currentSlotStart:151
nextSlotStart:157 · mealDayKey:159 · nightKeyOf:161 · newPet:167 · loadState:191 · saveState:388
activePet:395 · petStage:396 · isAdult:401 · abilityOn:402 · hasPetType:403 · todayStr:406
dailyTick:410 · addCoins:413 · QUEST_POOL:433 · QUEST_PER_DAY:442 · questsToday:443 · questTick:450
questEvent:454 · assetValue:490 · netWorth:515 · assetCount:517 · refreshRank:534 · heatProtected:550
rainProtected:554 · petHungry:557 · petShapeOf:561 · updatePetShape:567 · shapeMealDone:574 · heatPct:584
ymStr:593 · billOutstanding:597 · UTILITIES:604 · HOME_UTILITIES:610 · homeDecayed:612 · billTick:615
myCar:684 · carLoanDue:689 · carLoanOverdue:694 · carLoanPayable:699 · carLoanPay:706 · compTick:719
ONLINE_RATE:733 · onlineEarnActive:734 · onlineEarnTick:738 · onlineEarnFlush:749 · marketTick:759 · addCraft:783
ORDER_MAX:802 · ORDER_LIFE_MS:803 · ORDER_GAP_MIN_MS:804 · ORDER_GAP_SPAN_MS:805 · ORDER_TIER_WEIGHT:806 · newOrder:807
orderTick:820 · careTick:828 · expNeed:909 · addExp:914 · addRP:934

## js/ui.js (6,265 บรรทัด · 241 รายการ)
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
dictTapWords:2507 · dictEntryHTML:2511 · openDictOverlay:2522 · renderDashboard:2606 · sleepBtnHTML:2995 · sleepHintHTML:3002
sleepAllPets:3013 · wakeAllPets:3026 · feedPet:3037 · openFoodMenu:3051 · feedWith:3122 · AVATAR_UI:3152
playerAvatarHTML:3155 · SHAPE_UI:3161 · showFeedResult:3170 · curePet:3206 · cureCelebrateFx:3230 · railCureClick:3257
detoxPet:3269 · openFoodQuiz:3292 · renderShop:3372 · homeVisualHTML:3436 · showHomeRuined:3450 · showCutNotice:3471
renderHomeCard:3489 · payMaint:3573 · trashBillUI:3589 · payTrash:3606 · UTILITY_UI:3625 · utilityBillUI:3674
payUtility:3699 · buyUtilityFix:3725 · renderPhoneCard:3743 · buyPhone:3783 · sellPhone:3805 · compLiveTotal:3826
onlineLiveTotal:3837 · renderOnlineEarnPill:3842 · openPillInfo:3865 · renderComputerCard:3912 · buyComputer:3947 · sellComputer:3970
soldCount:3996 · soldBadge:3997 · renderTicketCard:4002 · loadScriptOnce:4058 · enterAdventure3D:4074 · enterHaunted3D:4096
advHealClick:4118 · buyTicket:4138 · renderHauntCard:4164 · buyHauntTicket:4219 · renderHeliCard:4246 · buyHeliTicket:4304
enterHeli3D:4327 · renderDroneCard:4349 · buyDroneTicket:4404 · enterDrone3D:4427 · renderDriveCard:4450 · buyDriveTicket:4523
enterDrive3D:4546 · renderSoccerCard:4579 · buySoccerTicket:4627 · enterSoccer3D:4650 · WORLD3D:4674 · gotoRobotShop:4683
scrollShopCardIntoView:4688 · railWorldClick:4691 · renderRailWorlds:4712 · tinvNoticeHTML:4771 · openTinvPicker:4779 · fruitCountdown:4823
renderFarmCard:4835 · renderFarmClock:4896 · buyFruit:4912 · sellFruit:4932 · sellAllFruit:4949 · collectImg:4975
renderFactoryCard:4981 · renderMarketCard:5028 · updateWishBadge:5083 · openWishlistDialog:5094 · renderMarketBrowse:5131 · carImg:5160
renderVehicleShop:5161 · CS_CYCLE_MS:5212 · carInteriorImg:5213 · carStatHtml:5215 · renderCarShowroom:5222 · csShowBig:5248
csInit:5275 · RS_CYCLE_MS:5298 · robotImg:5299 · renderRobotShop:5300 · rsShowBig:5322 · rsInit:5343
buyRobot:5362 · enterMecha3D:5384 · pickMechaRobot:5405 · pickDriveCar:5437 · openCarBuyDialog:5480 · buyCarInsurance:5541
payCarLoanMonthly:5560 · payCarLoanFull:5572 · carDriveBlock:5591 · gotoVehicleShop:5596 · gotoMyStock:5601 · showNeedCarDialog:5607
craftDiscount:5619 · renderFactory:5622 · renderOrdersUI:5689 · startProduce:5708 · buyCollectible:5736 · cancelProduce:5764
deliverOrder:5778 · renderOrderClock:5795 · renderCollectMine:5805 · openListDialog:5847 · cancelListing:5900 · buyMarketItem:5923
showCollectReveal:5950 · buyAC:5986 · openHomeShop:6005 · renderPetShop:6064 · showLevelUp:6125 · renderStats:6162
showTeacherCard:6233

## js/util.js (581 บรรทัด · 28 รายการ)
shuffle:6 · fmtNum:15 · escapeHTML:19 · seededRand:25 · fmtThaiDT:35 · fmtThaiDate:39
showScreen:44 · TOAST_WARN_RE:52 · restackToasts:55 · toast:77 · floatFx:97 · beep:107
sirenSynth:133 · playSpark:157 · sparkSynth:171 · thunderFx:206 · wordAudioFile:274 · speakWord:277
speakLetter:297 · pickSpeakVoice:316 · speakWordTTS:327 · askNameDialog:347 · askConfirm:387 · alertBox:405
applyNoAnim:425 · openSettings:430 · openHelp:536 · openTeacherGuide:562

## js/wordsearch.js (235 บรรทัด · 0 รายการ)

## css/lobby.css (2,377 บรรทัด · 441 selector)
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
.chat-emoji-btn:381 · #chat-input:385 · .chat-send:389,394,395 · .pl-click:462,464,465 · .pl-overlay:466 · .pl-card:470,1756
.pl-close:476 · .pl-head:480 · .pl-grade:485 · .pl-badges:487 · .pl-badge-chip:488,492 · .pl-body:493
.pl-loading:494 · .pl-none:495 · .pl-me-tag:496 · .pl-blk-wrap:498 · .pl-blk:499 · .pl-stat:500
.pl-lbl:505 · .pl-val:506,507 · .pl-tip:508 · .chip-edit:514,519,520 · .rank-mini:526,532,533,534 · .pass-photo:536,541
.pet-tabs:543 · .dict-box:544,548,549,550(+1) · .dict-card:556,561,565,566(+2) · .dict-head:562,563 · .dict-trail:570,574 · .dt-c:575,579,580
.dt-sep:581 · .dict-today:582 · .di-w:584,585,586 · .dict-list:587 · .dict-item:588,592,593,594(+5) · .lobby-mid:608
.lobby-rail:610 · .rail-worlds:628 · .rail-div:629 · .lobby-stage:644,646,690,691 · .newword-banner:652,659 · .nw-tag:660
.nw-word:665 · .nw-hint:667,668 · .nw-box:670,1940 · .nw-pop-word:671 · .nw-speak:672 · .nw-pop-phon:673
.nw-ipa:674 · .nw-pop-sent:675 · .nw-pop-mean:676 · .pet-tab:677,678,679,2264 · .stage-hero:700,715,723,868(+5) · .hero-ground:737,857,863
.hero-rank-bg:739,742,745,749(+18) · #lobby3d-canvas:762,763 · .hero-scene:767,769,776,777(+8) · .caretaker-fig:816 · .caretaker-img:819 · .caretaker-emoji:821
.blk-rig:828,829,830 · .stage-plate:890,898,909,910(+30) · .plate-title:904 · .lobby-side:947,982,987,990(+22) · .side-sec:950,2179 · .side-label:951,956
.side-label-row:958,959 · .lb-tabs-out:960,961,965 · .side-glass:969,976 · .side-card:988,1100 · #quest-card:1000,1024,1025,1026(+6) · .q-bigcard:1001,1030,1031,1034(+1)
.qb-top:1003 · .qb-emoji:1004 · .qb-name:1006 · .qb-bar:1007,1008 · .qb-row:1010 · .qb-prog:1011
.qb-reward:1012 · .qb-go:1013,1017 · .q-dots:1018 · .q-dot:1019,1020,1021 · .q-bonus:1022 · .feed-row:1045,1634,1639
.inv-card:1047,1049,1050 · .inv-btns:1051 · .inv-go:1052,1054 · .inv-x:1055 · #online-card:1059,2187,2188,2189(+1) · .fq-overlay:1060
.fq-box:1062,1995 · .fq-head:1066,1068 · .fq-close:1069 · .fq-sec:1071 · .fq-worlds:1072 · .fq-world:1073,1075
.fq-acts:1076 · .fq-act:1077,1080,1081 · .lobby-bottom:1111,1113 · .lobby-quiz-btn:1114 · .lobby-foodquiz-btn:1115,1116 · .lobby-play-btn:1117,1121
.lobby-exam-btn:1123,1124,1126 · .panel-overlay:1131,1136 · .panel-box:1137 · .panel-head:1144,1148 · .panel-close:1149,1154 · .panel-body:1155,1158,1159
.panel-page:1156,1157 · .collect-sub:1163 · .mkt-empty:1164 · .craft-box:1165 · .mkt-listing:1166 · .mkt-filter:1167,1489
.hq-grid:1174 · .hq-card:1175,1180,1204 · .hq-head:1181 · .hq-pic:1187,1189 · .hq-emoji:1191 · .hq-badge:1192
.hq-stars:1196 · .hq-price:1197,1202,1203,1206(+6) · .craft-credit:1210,1212,1213 · .car-grid:1220,1222,1223 · .robot-weap:1224 · .dcp-grid:1226
.dcp-card:1228,1231,1232,1233(+10) · .levelup-box:1250,1897,1898,1993 · .dcp-box:1253,1254,1258,1259(+6) · .dcp-lock:1267 · .sold-badge:1271,1273,1274 · .rs-showroom:1276
.rs-list:1277,1279 · .rs-thumb:1280,1282,1283,1284(+1) · .rs-thumb-pic:1285,1286 · .rs-thumb-price:1287 · .rs-stage:1289 · .rs-big:1292
.rs-big-img:1293 · .rs-elec:1297,1301,1306 · .rs-edge:1307,1313 · .rs-info:1316,1317,1318,1319(+1) · .rs-buy:1321,1323,1324 · .cs-showroom:1328
.cs-list:1329,1331 · .cs-thumb:1332,1334,1335,1336(+1) · .cs-thumb-pic:1337,1338 · .cs-thumb-name:1339 · .cs-thumb-price:1340 · .cs-thumb-own:1341
.cs-stage:1343 · .cs-big:1346 · .cs-big-img:1347 · .cs-elec:1351,1355,1359 · .cs-edge:1360,1366 · .cs-interior:1369
.cs-inr-label:1370,1371 · .cs-inr-img:1372 · .cs-info:1374,1375,1376,1377(+6) · .cs-buy:1385,1387,1388,1389 · .car-emoji:1391 · .car-mine:1397
.car-mine-pic:1402 · .car-mine-info:1403 · .car-loan:1404,1405 · .car-mine-btns:1406,1407,1408 · .car-locked:1410 · .car-mine-head:1412
.car-pick-list:1413,1414 · .car-pick:1415,1417,1418 · .car-pick-pic:1419,1420 · .car-pick-name:1421,1422 · .car-pick-od:1423 · .car-buy-box:1425,1999
.cb-pic:1426,1427,1428 · .cb-lines:1429 · .cb-li:1430,1434,1435 · .cb-ins:1436,1440,1441 · .cb-plan:1442 · .cb-pl:1443,1448,1450,1454(+1)
.cb-total:1461 · .cb-btns:1462,1467 · .cb-x:1463 · .shop-grid:1470 · .shop-item:1471,1476,1481,1482(+3) · .mkt-tab:1490,1491
.pg-btn:1492,1493,1494 · .pg-dot:1495 · .fr-gift-btn:1517,1522 · .gift-sec-title:1525 · .gift-in-row:1527 · .gift-out-row:1531
.gift-in-pic:1532,1534,1535 · .gift-in-info:1536,1537 · .gift-in-btns:1538 · .gift-accept:1539,1543,1545 · .gift-decline:1544 · .gift-box-card:1546
.gift-box-from:1547,1548 · .gift-note:1549 · .gift-pick-overlay:1552 · .gift-pick-box:1556 · .gift-pick-head:1562,1566 · .gift-pick-close:1567
.gift-pick-tabs:1569 · .gp-tab:1570,1574 · .gift-pick-body:1575 · .gp-chips:1576 · .gp-chip:1577,1581 · .gp-card:1582,1583
.gp-price:1584 · .gp-note:1585 · .gift-cf-pic:1586 · .chat-emoji-cats:1591 · .chat-emoji-cat:1595,1599,1600 · .chat-emoji-wrap:1601,1602
.stage-left:1610 · .pet-info-btn:1614,1621,1622 · .feed-list:1629,1633 · .feed-ico:1640 · .feed-txt:1641 · .feed-name:1642
.feed-ago:1643 · .feed-empty:1644,1647 · .pi-overlay:1649 · .pi-box:1653,1658,1659,1663(+2) · .pi-close:1665,1670,1671 · .pi-close-left:1673
.pi-portrait:1675 · .pi-dress-btn:1682,1686,1687 · .pi-shape-cap:1688,1691,1692,1693 · .pi-care-title:1694 · .lbf-overlay:1697 · .lbf-box:1700
.lbf-head:1705 · .lbf-title:1706 · .lbf-tabs:1707 · .lbf-close:1710 · .lbf-close-l:1711 · .lbf-body:1712
.lbf-grid:1713 · .lbf-cell:1715,1718,1719,1720(+1) · .lbf-podium:1724 · .pod:1726,1753,1754 · .pod-char:1728 · .pod-base:1730
.pod-rank:1732 · .pod-label:1734 · .pod-name:1736 · .pod-sc:1738 · .pod-1:1743,1744 · .pod-2:1745,1746
.pod-3:1747,1748 · .pod-4:1749,1750 · .pod-5:1751,1752 · .pl-wide:1757,1760,1761,1762 · .pl-follow:1763,1768,1770 · .pl-unfollow:1772,1778,1779
.pl-followers:1780 · .pl-cols:1781 · .pl-col:1782 · .pl-sec-title:1783 · .pl-feed:1784,1787,1794 · .pl-feed-row:1788,1792,1793
.pl-assets-wrap:1796 · .pl-assets:1797 · .pl-asset:1800,1804,1811 · .pl-asset-emoji:1805 · .pl-asset-n:1806 · .pl-pets-wrap:1813
.pl-pets:1814 · .pl-pet:1815,1820,1822 · .pl-pet-nm:1823 · .img-lightbox:1826,1831,1832,1836(+3) · .pl-chat:1849,1854 · .pet-peek:1855,1856
.pp-chips:1858 · .pp-chip:1859 · .pp-gift:1864,1870 · .settings-box:1872,1873,1942,1947(+20) · .set-feed-head:1874 · .set-feed-sub:1878
.set-feed-row:1879 · .pillinfo-val:1884 · .pillinfo-desc:1889,1908 · .pillinfo-box:1900 · .plf-head:1903 · .plf-emoji:1904
.plf-ht:1905,1906,1907 · .plf-foot:1909 · .alert-box:1914,1916 · .ab-emoji:1917 · .ab-title:1918 · .ab-desc:1919
.ab-btns:1920,1921,1922 · .heal-heart:1924 · .pet-stage:1931 · .attn-box:1939 · .help-box:1971,1972,1973 · .food-box:1994
.home-shop-box:1996 · .summary-box:1997 · .report-box:1998 · .wl-grid:2001 · .tc-wrap:2003 · .spell-btn:2009,2014
.sp-hud:2015 · .sp-word:2017 · .sp-ch:2018,2023 · .sp-th:2025 · .sp-hint:2027 · .sp-exit:2030,2034
.sp-banner:2035 · .sp-big:2040 · .sp-thb:2042 · .sp-coin:2043 · #spell-confetti:2048 · .sp-rb:2049
.sp-day:2059 · .sp-perfect:2061 · .sp-late:2063 · #spell-coinpop:2066 · .side-sub:2175,2177 · .sec-quest:2180
.on-page:2191,2192,2193,2194 · .inbox-overlay:2204 · .ib-box:2206 · .ib-head:2210 · .ib-close:2214,2216 · .ib-list:2217,2218
.ib-row:2219,2220,2221,2222 · .ib-ava:2223 · .ib-on:2227 · .ib-mid:2229 · .ib-name:2230 · .ib-last:2231
.ib-meta:2232 · .ib-time:2233 · .ib-dot:2235 · .ib-story-badge:2238 · .ib-empty:2242 · .ib-story:2244,2246
.ib-story-item:2247,2249,2256 · .ib-story-ava:2250 · .ib-story-on:2254 · .ib-world:2259,2262 · #btn-music:2267,2270,2271 · #ws-overlay:2286
#ws-board:2288,2294,2296 · .ws-head:2298 · .ws-title:2299 · .ws-grade:2301 · .ws-body:2303 · .ws-gridwrap:2304
#ws-grid:2305 · .ws-cell:2309,2313,2315,2323(+1) · .ws-flash:2327,2329 · .ws-coinpop:2333 · .ws-side:2344 · .ws-find:2345
#ws-words:2347,2349 · .ws-word:2350,2354,2356 · #ws-prog:2357 · .ws-actions:2358,2359,2361 · #ws-new:2362 · #ws-stash:2363
#ws-clear:2364 · #ws-win:2365,2367 · .ws-win-in:2368,2371

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
