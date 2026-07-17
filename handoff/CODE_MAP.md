# CODE_MAP.md — แผนที่โค้ด:บรรทัด (เจนอัตโนมัติโดย `tools/gen_code_map.py` — **ห้ามแก้มือ** เดี๋ยวโดนเขียนทับ)

> วิธีใช้: หาชื่อฟังก์ชัน/ค่าคงที่/selector ในไฟล์นี้ (Grep หรือกวาดตา) → `Read` ไฟล์จริง `offset=<บรรทัด>` `limit=40`
> css = index `selector:บรรทัดทุกจุดที่ประกาศ` (บั๊ก UI เริ่มหาที่นี่) · เจนใหม่ทุกครั้งที่รัน `python tools/rotate_handoff.py` · อัปเดต: 2026-07-17

## js/adventure3d.js (7,150 บรรทัด · 308 รายการ)
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
routeGrid:4671 · pickGpsTarget:4724 · gpsSpeak:4736 · NAVLINE_W:4755 · navLineEnsure:4756 · navLineHide:4766
navLineUpdate:4767 · tickGps:4794 · tickDrive:4870 · drawCarDial:5048 · drawCarGauges:5078 · RADIO_RECT:5106
CAR_RADIO_RECT:5108 · carRadioRect:5114 · radioLayout:5116 · radioSetHint:5139 · renderRadioList:5145 · radioToggleList:5155
drawRadioViz:5160 · radioTick:5178 · BOBBLE_FOOT:5191 · BOBBLE_H:5192 · BOBBLE_ASPECT:5193 · BOB_OMEGA:5196
BOB_PITCH_FORCE:5198 · BOBBLE_SKINS:5200 · bobbleSetAvatar:5207 · bobbleLayout:5214 · bobbleTick:5227 · bobblePoke:5252
bobbleApplySkin:5269 · dollOwned:5279 · openDollPicker:5280 · carStartShow:5317 · showLawInfo:5335 · lawNotice:5357
driveFineSettle:5367 · heliFloorAt:5543 · tickHeli:5550 · gaugeBezel:5695 · gaugeTicks:5700 · gaugeNeedle:5710
gaugeText:5717 · drawGauges:5723 · soccerLetterPos:6043 · letterNeeded:6047 · soccerNeededSet:6052 · soccerTileGeo:6058
soccerGoldTexture:6060 · makeSoccerTile:6077 · soccerRefreshSkins:6086 · soccerBuildTargets:6093 · soccerRetarget:6102 · soccerCoinPop:6114
soccerFieldTexture:6126 · soccerNetTexture:6137 · soccerCrowdTexture:6144 · soccerBallMat:6152 · buildSoccerGoal:6160 · buildStands:6171
soccerNumTex:6179 · makeSoccerPlayer:6189 · soccerResetBall:6213 · soccerKick:6218 · soccerCheer:6226 · updateSoccerGuide:6227
soccerCamera:6241 · tickSoccer:6256 · soccerKitShow:6332 · soccerKitGo:6347 · emojiSprite:6398 · makeAlien:6403
startWave:6436 · waveSpawnFill:6447 · waveComplete:6456 · updateWaveHud:6466 · checkMechaBossBadge:6468 · alienSpawnPos:6477
removeAlien:6482 · mechaHudWord:6487 · setMechaHudSkin:6495 · mechaComboPop:6507 · mechaShielded:6512 · mechaDamageFx:6514
mechaHitByAlien:6519 · spawnAlienShot:6525 · removeAlienShot:6535 · tickAlienShots:6540 · spawnPowerup:6552 · removePowerup:6565
collectPowerup:6570 · tickPowerups:6577 · updateMechaHud:6586 · mechaTracer:6626 · mechaFire:6635 · explodeAlien:6672
tickMecha:6701 · loop:6757 · clearEntities:6785 · INTRO_KEY:6799 · introSeenObj:6800 · introSeen:6801
markIntroSeen:6802 · INTRO:6803 · showIntro:6868 · closeIntro:6893 · beginPlay:6899 · start:6901
exitWorld:7045 · mechaRecapLine:7080

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

## js/game.js (879 บรรทัด · 50 รายการ)
REPLAY_BONUS_EVERY:23 · REPLAY_BONUS_TIERS:25 · replayBonusFor:26 · SESSION_MILESTONES:32 · addSessionCoins:35 · updateBestTarget:74
weekKeyStr:87 · rolloverWeekBest:93 · exitGame:99 · showSessionSummary:132 · sprinkleConfetti:179 · VOCAB_PER_LEVEL:198
VOCAB_RANK_NAMES:199 · vocabRankName:200 · showProgressReport:202 · THUNDER_MS:346 · THUNDER_TIERS:350 · THUNDER_TIER_UI:351
thunderEmoji:352 · DAREDEVIL_TIERS:356 · DAREDEVIL_TIER_UI:357 · daredevilEmoji:358 · DILIGENT_TIERS:362 · DILIGENT_TIER_UI:363
diligentEmoji:364 · MECHABOSS_TIERS:368 · MECHABOSS_TIER_UI:369 · mechaBossEmoji:370 · badgeSuffix:375 · BADGE_META:386
NAME_BADGE_RE:394 · splitNameBadges:395 · badgeEmojis:401 · badgeScore:406 · checkCrown:412 · currentBadgeScore:428
rolloverBadgeWeek:432 · addDiligent:445 · celebrateBadge:461 · addThunder:475 · startGame:489 · newRound:529
updateTimerBar:568 · updateComboPill:574 · pickCard:578 · checkMatch:590 · renderCats:704 · startQuiz:739
renderQuizQuestion:755 · finishQuiz:814

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

## js/state.js (939 บรรทัด · 83 รายการ)
STORAGE_KEY:6 · CURE_COST:8 · HUNGRY_SICK_MS:9 · MEAL_HOUR:11 · MEAL_FULL:12 · SLEEP_FROM_HOUR:13
SLEEP_SICK_HOUR:14 · WAKE_HOUR:15 · DINNER_COST:16 · TOXIN_FULL:18 · DETOX_COST:19 · FOODQUIZ_Q:21
FOODQUIZ_COIN:22 · FOODQUIZ_BONUS:23 · SHAPE_JUNK_MEALS:25 · SHAPE_CLEAN_MEALS:26 · SHAPE_MISS_MEALS:27 · SHAPE_EXP_BONUS:28
HEAT_SICK_MS:29 · THIRST_SICK_MS:30 · DEFAULT_STATE:32 · FEED_CATS:140 · SLOT_MS:151 · currentSlotStart:152
nextSlotStart:158 · mealDayKey:160 · nightKeyOf:162 · newPet:168 · loadState:192 · saveState:389
activePet:396 · petStage:397 · isAdult:402 · abilityOn:403 · hasPetType:404 · todayStr:407
dailyTick:411 · addCoins:414 · QUEST_POOL:434 · QUEST_PER_DAY:443 · questsToday:444 · questTick:451
questEvent:455 · assetValue:491 · netWorth:516 · assetCount:518 · refreshRank:535 · heatProtected:551
rainProtected:555 · petHungry:558 · petShapeOf:562 · updatePetShape:568 · shapeMealDone:575 · heatPct:585
ymStr:594 · billOutstanding:598 · UTILITIES:605 · HOME_UTILITIES:611 · homeDecayed:613 · billTick:616
myCar:685 · carLoanDue:690 · carLoanOverdue:695 · carLoanPayable:700 · carLoanPay:707 · compTick:720
ONLINE_RATE:734 · onlineEarnActive:735 · onlineEarnTick:739 · onlineEarnFlush:750 · marketTick:760 · addCraft:784
ORDER_MAX:803 · ORDER_LIFE_MS:804 · ORDER_GAP_MIN_MS:805 · ORDER_GAP_SPAN_MS:806 · ORDER_TIER_WEIGHT:807 · newOrder:808
orderTick:821 · careTick:829 · expNeed:910 · addExp:915 · addRP:935

## js/ui.js (6,277 บรรทัด · 242 รายการ)
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
fruitCountdown:4833 · renderFarmCard:4845 · renderFarmClock:4906 · buyFruit:4922 · sellFruit:4942 · sellAllFruit:4959
collectImg:4985 · renderFactoryCard:4991 · renderMarketCard:5038 · updateWishBadge:5093 · openWishlistDialog:5104 · renderMarketBrowse:5141
carImg:5170 · renderVehicleShop:5171 · CS_CYCLE_MS:5222 · carInteriorImg:5223 · carStatHtml:5225 · renderCarShowroom:5232
csShowBig:5258 · csInit:5285 · RS_CYCLE_MS:5308 · robotImg:5309 · renderRobotShop:5310 · rsShowBig:5332
rsInit:5353 · buyRobot:5372 · enterMecha3D:5394 · pickMechaRobot:5415 · pickDriveCar:5447 · openCarBuyDialog:5490
buyCarInsurance:5551 · payCarLoanMonthly:5570 · payCarLoanFull:5582 · carDriveBlock:5601 · gotoVehicleShop:5606 · gotoMyStock:5611
showNeedCarDialog:5617 · craftDiscount:5629 · renderFactory:5632 · renderOrdersUI:5699 · startProduce:5718 · buyCollectible:5746
cancelProduce:5774 · deliverOrder:5788 · renderOrderClock:5805 · renderCollectMine:5815 · openListDialog:5857 · cancelListing:5910
buyMarketItem:5933 · showCollectReveal:5960 · buyAC:5998 · openHomeShop:6017 · renderPetShop:6076 · showLevelUp:6137
renderStats:6174 · showTeacherCard:6245

## js/util.js (629 บรรทัด · 30 รายการ)
shuffle:6 · fmtNum:15 · escapeHTML:19 · seededRand:25 · fmtThaiDT:35 · fmtThaiDate:39
showScreen:44 · TOAST_WARN_RE:52 · restackToasts:55 · toast:77 · floatFx:97 · beep:107
sirenSynth:134 · playCashier:158 · cashierSynth:172 · playSpark:205 · sparkSynth:219 · thunderFx:254
wordAudioFile:322 · speakWord:325 · speakLetter:345 · pickSpeakVoice:364 · speakWordTTS:375 · askNameDialog:395
askConfirm:435 · alertBox:453 · applyNoAnim:473 · openSettings:478 · openHelp:584 · openTeacherGuide:610

## js/vocabbook.js (189 บรรทัด · 13 รายการ)
VB_MAX:11 · VB_QUIZ_N:12 · VB_QUIZ_MIN:13 · vbGroup:16 · VB_GROUP_UI:21 · vbRecord:24
vbStats:45 · vbList:53 · vbReviewCat:64 · vbStartReview:77 · openVocabBook:88 · vbRender:130
vbCardHTML:176

## js/wordsearch.js (235 บรรทัด · 0 รายการ)

## css/lobby.css (2,379 บรรทัด · 442 selector)
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
.chat-emoji-btn:381 · #chat-input:385 · .chat-send:389,394,395 · .pl-click:462,464,465 · .pl-overlay:466 · .pl-card:470,1758
.pl-close:476 · .pl-head:480 · .pl-grade:485 · .pl-badges:487 · .pl-badge-chip:488,492 · .pl-body:493
.pl-loading:494 · .pl-none:495 · .pl-me-tag:496 · .pl-blk-wrap:498 · .pl-blk:499 · .pl-stat:500
.pl-lbl:505 · .pl-val:506,507 · .pl-tip:508 · .chip-edit:514,519,520 · .rank-mini:526,532,533,534 · .pass-photo:536,541
.pet-tabs:543 · .dict-box:544,548,549,550(+1) · .dict-card:556,561,565,566(+2) · .dict-head:562,563 · .dict-trail:570,574 · .dt-c:575,579,580
.dt-sep:581 · .dict-today:582 · .di-w:584,585,586 · .dict-list:587 · .dict-item:588,592,593,594(+5) · .lobby-mid:608
.lobby-rail:610 · .rail-worlds:628 · .rail-div:629 · .lobby-stage:644,646,690,691 · .newword-banner:652,659 · .nw-tag:660
.nw-word:665 · .nw-hint:667,668 · .nw-box:670,1942 · .nw-pop-word:671 · .nw-speak:672 · .nw-pop-phon:673
.nw-ipa:674 · .nw-pop-sent:675 · .nw-pop-mean:676 · .pet-tab:677,678,679,2266 · .stage-hero:700,715,723,868(+5) · .hero-ground:737,857,863
.hero-rank-bg:739,742,745,749(+18) · #lobby3d-canvas:762,763 · .hero-scene:767,769,776,777(+8) · .caretaker-fig:816 · .caretaker-img:819 · .caretaker-emoji:821
.blk-rig:828,829,830 · .stage-plate:890,898,909,910(+30) · .plate-title:904 · .lobby-side:947,982,987,990(+22) · .side-sec:950,2181 · .side-label:951,956
.side-label-row:958,959 · .lb-tabs-out:960,961,965 · .side-glass:969,976 · .side-card:988,1100 · #quest-card:1000,1024,1025,1026(+6) · .q-bigcard:1001,1030,1031,1034(+1)
.qb-top:1003 · .qb-emoji:1004 · .qb-name:1006 · .qb-bar:1007,1008 · .qb-row:1010 · .qb-prog:1011
.qb-reward:1012 · .qb-go:1013,1017 · .q-dots:1018 · .q-dot:1019,1020,1021 · .q-bonus:1022 · .feed-row:1045,1636,1641
.inv-card:1047,1049,1050 · .inv-btns:1051 · .inv-go:1052,1054 · .inv-x:1055 · #online-card:1059,2189,2190,2191(+1) · .fq-overlay:1060
.fq-box:1062,1997 · .fq-head:1066,1068 · .fq-close:1069 · .fq-sec:1071 · .fq-worlds:1072 · .fq-world:1073,1075
.fq-acts:1076 · .fq-act:1077,1080,1081 · .lobby-bottom:1111,1113 · .lobby-quiz-btn:1114 · .lobby-book-btn:1115,1116 · .lobby-foodquiz-btn:1117,1118
.lobby-play-btn:1119,1123 · .lobby-exam-btn:1125,1126,1128 · .panel-overlay:1133,1138 · .panel-box:1139 · .panel-head:1146,1150 · .panel-close:1151,1156
.panel-body:1157,1160,1161 · .panel-page:1158,1159 · .collect-sub:1165 · .mkt-empty:1166 · .craft-box:1167 · .mkt-listing:1168
.mkt-filter:1169,1491 · .hq-grid:1176 · .hq-card:1177,1182,1206 · .hq-head:1183 · .hq-pic:1189,1191 · .hq-emoji:1193
.hq-badge:1194 · .hq-stars:1198 · .hq-price:1199,1204,1205,1208(+6) · .craft-credit:1212,1214,1215 · .car-grid:1222,1224,1225 · .robot-weap:1226
.dcp-grid:1228 · .dcp-card:1230,1233,1234,1235(+10) · .levelup-box:1252,1899,1900,1995 · .dcp-box:1255,1256,1260,1261(+6) · .dcp-lock:1269 · .sold-badge:1273,1275,1276
.rs-showroom:1278 · .rs-list:1279,1281 · .rs-thumb:1282,1284,1285,1286(+1) · .rs-thumb-pic:1287,1288 · .rs-thumb-price:1289 · .rs-stage:1291
.rs-big:1294 · .rs-big-img:1295 · .rs-elec:1299,1303,1308 · .rs-edge:1309,1315 · .rs-info:1318,1319,1320,1321(+1) · .rs-buy:1323,1325,1326
.cs-showroom:1330 · .cs-list:1331,1333 · .cs-thumb:1334,1336,1337,1338(+1) · .cs-thumb-pic:1339,1340 · .cs-thumb-name:1341 · .cs-thumb-price:1342
.cs-thumb-own:1343 · .cs-stage:1345 · .cs-big:1348 · .cs-big-img:1349 · .cs-elec:1353,1357,1361 · .cs-edge:1362,1368
.cs-interior:1371 · .cs-inr-label:1372,1373 · .cs-inr-img:1374 · .cs-info:1376,1377,1378,1379(+6) · .cs-buy:1387,1389,1390,1391 · .car-emoji:1393
.car-mine:1399 · .car-mine-pic:1404 · .car-mine-info:1405 · .car-loan:1406,1407 · .car-mine-btns:1408,1409,1410 · .car-locked:1412
.car-mine-head:1414 · .car-pick-list:1415,1416 · .car-pick:1417,1419,1420 · .car-pick-pic:1421,1422 · .car-pick-name:1423,1424 · .car-pick-od:1425
.car-buy-box:1427,2001 · .cb-pic:1428,1429,1430 · .cb-lines:1431 · .cb-li:1432,1436,1437 · .cb-ins:1438,1442,1443 · .cb-plan:1444
.cb-pl:1445,1450,1452,1456(+1) · .cb-total:1463 · .cb-btns:1464,1469 · .cb-x:1465 · .shop-grid:1472 · .shop-item:1473,1478,1483,1484(+3)
.mkt-tab:1492,1493 · .pg-btn:1494,1495,1496 · .pg-dot:1497 · .fr-gift-btn:1519,1524 · .gift-sec-title:1527 · .gift-in-row:1529
.gift-out-row:1533 · .gift-in-pic:1534,1536,1537 · .gift-in-info:1538,1539 · .gift-in-btns:1540 · .gift-accept:1541,1545,1547 · .gift-decline:1546
.gift-box-card:1548 · .gift-box-from:1549,1550 · .gift-note:1551 · .gift-pick-overlay:1554 · .gift-pick-box:1558 · .gift-pick-head:1564,1568
.gift-pick-close:1569 · .gift-pick-tabs:1571 · .gp-tab:1572,1576 · .gift-pick-body:1577 · .gp-chips:1578 · .gp-chip:1579,1583
.gp-card:1584,1585 · .gp-price:1586 · .gp-note:1587 · .gift-cf-pic:1588 · .chat-emoji-cats:1593 · .chat-emoji-cat:1597,1601,1602
.chat-emoji-wrap:1603,1604 · .stage-left:1612 · .pet-info-btn:1616,1623,1624 · .feed-list:1631,1635 · .feed-ico:1642 · .feed-txt:1643
.feed-name:1644 · .feed-ago:1645 · .feed-empty:1646,1649 · .pi-overlay:1651 · .pi-box:1655,1660,1661,1665(+2) · .pi-close:1667,1672,1673
.pi-close-left:1675 · .pi-portrait:1677 · .pi-dress-btn:1684,1688,1689 · .pi-shape-cap:1690,1693,1694,1695 · .pi-care-title:1696 · .lbf-overlay:1699
.lbf-box:1702 · .lbf-head:1707 · .lbf-title:1708 · .lbf-tabs:1709 · .lbf-close:1712 · .lbf-close-l:1713
.lbf-body:1714 · .lbf-grid:1715 · .lbf-cell:1717,1720,1721,1722(+1) · .lbf-podium:1726 · .pod:1728,1755,1756 · .pod-char:1730
.pod-base:1732 · .pod-rank:1734 · .pod-label:1736 · .pod-name:1738 · .pod-sc:1740 · .pod-1:1745,1746
.pod-2:1747,1748 · .pod-3:1749,1750 · .pod-4:1751,1752 · .pod-5:1753,1754 · .pl-wide:1759,1762,1763,1764 · .pl-follow:1765,1770,1772
.pl-unfollow:1774,1780,1781 · .pl-followers:1782 · .pl-cols:1783 · .pl-col:1784 · .pl-sec-title:1785 · .pl-feed:1786,1789,1796
.pl-feed-row:1790,1794,1795 · .pl-assets-wrap:1798 · .pl-assets:1799 · .pl-asset:1802,1806,1813 · .pl-asset-emoji:1807 · .pl-asset-n:1808
.pl-pets-wrap:1815 · .pl-pets:1816 · .pl-pet:1817,1822,1824 · .pl-pet-nm:1825 · .img-lightbox:1828,1833,1834,1838(+3) · .pl-chat:1851,1856
.pet-peek:1857,1858 · .pp-chips:1860 · .pp-chip:1861 · .pp-gift:1866,1872 · .settings-box:1874,1875,1944,1949(+20) · .set-feed-head:1876
.set-feed-sub:1880 · .set-feed-row:1881 · .pillinfo-val:1886 · .pillinfo-desc:1891,1910 · .pillinfo-box:1902 · .plf-head:1905
.plf-emoji:1906 · .plf-ht:1907,1908,1909 · .plf-foot:1911 · .alert-box:1916,1918 · .ab-emoji:1919 · .ab-title:1920
.ab-desc:1921 · .ab-btns:1922,1923,1924 · .heal-heart:1926 · .pet-stage:1933 · .attn-box:1941 · .help-box:1973,1974,1975
.food-box:1996 · .home-shop-box:1998 · .summary-box:1999 · .report-box:2000 · .wl-grid:2003 · .tc-wrap:2005
.spell-btn:2011,2016 · .sp-hud:2017 · .sp-word:2019 · .sp-ch:2020,2025 · .sp-th:2027 · .sp-hint:2029
.sp-exit:2032,2036 · .sp-banner:2037 · .sp-big:2042 · .sp-thb:2044 · .sp-coin:2045 · #spell-confetti:2050
.sp-rb:2051 · .sp-day:2061 · .sp-perfect:2063 · .sp-late:2065 · #spell-coinpop:2068 · .side-sub:2177,2179
.sec-quest:2182 · .on-page:2193,2194,2195,2196 · .inbox-overlay:2206 · .ib-box:2208 · .ib-head:2212 · .ib-close:2216,2218
.ib-list:2219,2220 · .ib-row:2221,2222,2223,2224 · .ib-ava:2225 · .ib-on:2229 · .ib-mid:2231 · .ib-name:2232
.ib-last:2233 · .ib-meta:2234 · .ib-time:2235 · .ib-dot:2237 · .ib-story-badge:2240 · .ib-empty:2244
.ib-story:2246,2248 · .ib-story-item:2249,2251,2258 · .ib-story-ava:2252 · .ib-story-on:2256 · .ib-world:2261,2264 · #btn-music:2269,2272,2273
#ws-overlay:2288 · #ws-board:2290,2296,2298 · .ws-head:2300 · .ws-title:2301 · .ws-grade:2303 · .ws-body:2305
.ws-gridwrap:2306 · #ws-grid:2307 · .ws-cell:2311,2315,2317,2325(+1) · .ws-flash:2329,2331 · .ws-coinpop:2335 · .ws-side:2346
.ws-find:2347 · #ws-words:2349,2351 · .ws-word:2352,2356,2358 · #ws-prog:2359 · .ws-actions:2360,2361,2363 · #ws-new:2364
#ws-stash:2365 · #ws-clear:2366 · #ws-win:2367,2369 · .ws-win-in:2370,2373

## css/style.css (1,608 บรรทัด · 446 selector)
:root:5 · *:15 · html:16,21 · input:25 · body:29 · #app:35
.screen:38,39 · h1:42 · .subtitle:43 · .egg-grid:46,63 · .egg-card:47,52,53,54(+2) · .pet-price:57,61
.egg:65,71,75 · .d1:76 · .basket:79,80,85,91(+5) · .basket-dog:89,102,103,104 · .basket-cat:90,105,106,107 · .egg-dragon:110
.topbar:125 · .topbar-coins:126 · .coin-pill:127,132,136,141(+2) · .no-anim:142,439,1325,1565(+2) · .net-coin:144 · .q-row:156,157,158,162(+1)
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
.lb-tabs:853 · .lb-tab:854,855 · .tinv-note:866 · .cat-card:872,893,972,977 · .cat-head:876 · .cat-emoji:877
.cat-name:878 · .cat-pass:879 · .cat-info:880 · .cat-btns:881 · .cat-btn:882,886,887,888(+2) · .band-sec-head:891,892
.band-mine-tag:894 · .bsp-box:897,900 · .bsp-head:901 · .bsp-prog:902 · .bsp-retake:904,907 · .rts-box:910
.rts-head:912 · .rts-sets:913 · .rts-set:914,915,916 · .rts-sub:917 · .rts-words:918 · .rts-word:919,921,922
.rts-foot:923 · .rts-okbtn:924,926 · .bsp-grid:927 · .bsp-chip:928,931,932,933(+1) · .bsp-num:935 · .bsp-best:936
.bsp-tick:937 · .bsp-foot:938 · .vb-box:941,943 · .vb-head:944 · .vb-total:945 · .vb-quizbtn:946,948
.vb-tabs:949 · .vb-tab:950,952,953 · .vb-words:954 · .vb-word:955,958,959,960(+3) · .vb-empty:964 · .vb-foot:965
.vb-pg:966,968 · #vb-pginfo:969 · .vb-hint:970 · .band-lock:978 · .offline-btn:979,980 · .quiz-progress:985
.quiz-phon:986 · #quiz-extra:987,989,990,991 · .quiz-word-card:992 · .quiz-speak:997 · .quiz-choice:998,1003,1004,1005 · .quiz-score-pill:1006
.stats-card:1009 · .stats-title:1013,1446 · .stats-row:1014,1015,1016,1017 · .game-top:1020 · .back-btn:1021 · .combo-pill:1025
.timer-wrap:1029 · .timer-fill:1030,1031 · .board-label:1033 · .card-grid:1034 · .word-card:1035,1041,1042,1043(+3) · .hint-btn:1049,1054
.game-endless-note:1057,1062,1064,1068(+6) · .report-btn:1089,1094 · .report-box:1097 · .report-close:1098 · .rp-head:1102 · .rp-avatar:1103,1104
.rp-title:1105 · .rp-sub:1106 · .rp-levelcard:1108 · .rp-level-top:1112 · .rp-bar:1113 · .rp-bar-fill:1114
.rp-level-note:1115,1116 · .rp-grid:1118 · .rp-stat:1119 · .rp-ic:1122 · .rp-num:1123 · .rp-lbl:1124
.rp-section:1126 · .rp-h3:1127 · .rp-badge-mini:1128 · .rp-row:1129,1130,1131 · .rp-empty:1132 · .rp-badges:1133
.rp-badge:1134 · .rp-tline:1137 · .rp-tl-head:1138,1139 · .rp-tl-ems:1140 · .rp-em:1141,1142 · .rp-tl-note:1143,1144
.rp-crown:1146,1147 · .rp-wtitle:1149 · .rp-wnow:1150,1151 · .rp-wgraph:1152 · .rp-wcol:1153 · .rp-wval:1154
.rp-wbar:1155,1156 · .rp-wlbl:1157 · .rp-cheer:1159 · .report-ok:1163 · .summary-box:1166,1217,1221,1222(+2) · .sm-burst:1167
.sm-title:1169 · .sm-line:1170 · .sm-coin:1171 · .sm-matches:1177,1178 · .confetti:1180 · .sm-badge:1187
.sm-badge-all:1191 · .badge-celebrate-overlay:1194,1207 · .badge-celebrate:1198 · .bc-emoji:1204 · .bc-title:1205 · .bc-sub:1206
.sm-cheer:1211 · .sm-streak:1212,1213 · .sm-sick:1214 · .sm-btns:1215 · .float-fx:1227 · .toast:1234
.toast-warn:1241,1248,1249,1255 · .toast-clear-all:1257,1264 · .alert-box:1266 · .alert-ok:1267,1272 · .settings-box:1274 · .set-row:1275
.set-hint:1279 · .set-hint-on:1280 · .set-hint-off:1281 · .set-lwrap:1282 · .set-label:1283 · .set-desc:1284
.set-switch:1285,1289,1290,1295(+4) · .set-sw-knob:1291 · .set-sw-txt:1298 · .set-close:1304,1309 · .set-help:1310,1315 · .help-box:1317,1318,1323
.help-item:1319 · .update-banner:1331,1340,1341 · #update-reload:1342 · #update-dismiss:1346 · .levelup-overlay:1352 · .levelup-box:1356,1363,1364,1365(+4)
.bill-box:1371,1375,1376 · .tag-off:1377 · .home-decayed-img:1378 · .home-dark-img:1379 · .thirst-fill:1380 · .thirst-text:1381,1382
.toxin-fill:1385 · .toxin-text:1386,1387 · .detox-btn:1388,1393 · .shape-text:1396,1397,1398,1399(+1) · .avatar-pick:1403 · .avatar-opt:1404,1408,1409,1410
.avatar-chip-img:1414 · .avatar-chip-blk:1416 · .set-avatar-btns:1417 · .avatar-mini:1418,1422 · .set-blk-row:1424 · .set-sub2:1425
.blk-grid:1427 · .blk-mini:1428,1431,1432,1433 · .game-avatar:1436,1437,1438 · .stats-nick:1447 · .ticket-owned:1450,1454 · .collect-sub:1459
.mkt-tabs:1460 · .mkt-tab:1461,1465 · .mkt-filter:1466 · .mkt-row:1470 · .mkt-emoji:1474,1475 · .mkt-info:1476,1477
.mkt-tier-stars:1478 · .mkt-buy:1479,1484,1485 · .mkt-price-lo:1486 · .mkt-price-hi:1487 · .mkt-empty:1488 · .collect-grid:1491
.collect-cell:1492 · .cc-emoji:1493,1494 · .cc-name:1495 · .cc-count:1496 · .cc-list-btn:1497,1501 · .mkt-listhead:1502
.mkt-listing:1503 · .ml-cancel:1507 · .mkt-sold:1513,1514,1515 · .list-dialog:1522,1523,1528 · .list-hint:1527 · .collect-reveal-frame:1531,1538
.collect-reveal-img:1537 · .collect-reveal-stars:1539 · .craft-box:1542 · .craft-head:1543 · .craft-bar:1544 · .craft-fill:1545
.craft-text:1546 · .craft-btn-row:1547,1548 · .craft-go-btn:1550,1556,1557,1560 · .craft-cancel:1568,1572 · .mkt-catalog:1575,1576,1577 · .mkt-pager:1580
.pg-btn:1581,1585,1586 · .pg-mid:1587 · .pg-dots:1588 · .pg-dot:1589,1590 · .order-head:1591 · .order-row:1592,1597,1599,1601
.order-deliver:1602,1607 · .order-need:1608
