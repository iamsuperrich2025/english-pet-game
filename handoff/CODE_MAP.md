# CODE_MAP.md — แผนที่โค้ด:บรรทัด (เจนอัตโนมัติโดย `tools/gen_code_map.py` — **ห้ามแก้มือ** เดี๋ยวโดนเขียนทับ)

> วิธีใช้: หาชื่อฟังก์ชัน/ค่าคงที่/selector ในไฟล์นี้ (Grep หรือกวาดตา) → `Read` ไฟล์จริง `offset=<บรรทัด>` `limit=40`
> css = index `selector:บรรทัดทุกจุดที่ประกาศ` (บั๊ก UI เริ่มหาที่นี่) · เจนใหม่ทุกครั้งที่รัน `python tools/rotate_handoff.py` · อัปเดต: 2026-07-18

## js/adventure3d.js (7,207 บรรทัด · 309 รายการ)
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
flatGeomUV:994 · buildDriveCity:1004 · SKY_IMG:1290 · applySky:1291 · applyTex:1306 · buildScene:1328
randPos:1597 · randRoadPos:1605 · spawnLetter:1617 · spawnLettersForWord:1648 · ensureCoverage:1650 · relocateLetters:1663
removeLetter:1688 · tryCompleteWords:1697 · completeWord:1711 · spawnMonster:1756 · killMonster:1765 · tickMonsters:1773
damagePlayer:1795 · shoot:1811 · tickShots:1825 · spawnGhost:1851 · GHOST_STYLE:1860 · GHOST_H_DEFAULT:1861
applyGhostSize:1862 · respawnGhost:1871 · tickGhosts:1887 · sessionRecapHtml:1933 · hauntRunSec:1940 · fmtSurv:1941
hauntSurviveFinish:1942 · tickSurvive:1952 · renderHearts:1965 · ghostHit:1974 · caught:1996 · knockedOut:2022
netReady:2186 · netJoin:2190 · sendPos:2203 · sendChat:2230 · toggleChatBox:2244 · onPeerData:2254
removePeer:2332 · netLeave:2344 · tickPeers:2352 · RTC_CFG:2423 · tinvLinked:2424 · partyWord:2431
syncPartyWord:2444 · updateVoiceBtns:2596 · PODIUM_BONUS:2621 · podiumJoin:2623 · podiumLeave:2634 · endRound:2635
showPodium:2646 · tinvCheck:2686 · showBanner:2706 · renderHudTop:2712 · renderHudWords:2717 · renderHudInv:2727
ddTierFromName:2734 · renderBoard:2736 · drawBigMap:2760 · openBigMap:2815 · closeBigMap:2823 · drawMinimap:2828
loadCarDash:2900 · loadCarWheel:2912 · buildDom:2922 · confirmExit:4157 · IS_TOUCH:4176 · bindInput:4177
movePlayer:4262 · tickPlayer:4272 · collideDrone:4313 · tickDrone:4331 · nearMissTick:4411 · showNearMiss:4434
awardDaredevil:4445 · comboCheer:4462 · comboFlash:4478 · driveCell:4487 · nearestStreet:4493 · collideCar:4503
tlDotY:4534 · tlSet:4538 · driveArms:4555 · tlTick:4567 · TL_GREEN:4611 · tlRedDur:4613
tlightPhase:4614 · buildTrafficLights:4621 · rlTick:4673 · cellDrivable:4705 · cellCenter:4706 · losClear:4708
nearestDrivableCell:4718 · routeGrid:4727 · pickGpsTarget:4780 · gpsSpeak:4792 · NAVLINE_W:4811 · navLineEnsure:4812
navLineHide:4822 · navLineUpdate:4823 · tickGps:4850 · tickDrive:4926 · drawCarDial:5104 · drawCarGauges:5134
RADIO_RECT:5162 · CAR_RADIO_RECT:5164 · carRadioRect:5170 · radioLayout:5172 · radioSetHint:5195 · renderRadioList:5201
radioToggleList:5211 · drawRadioViz:5216 · radioTick:5234 · BOBBLE_FOOT:5247 · BOBBLE_H:5248 · BOBBLE_ASPECT:5249
BOB_OMEGA:5252 · BOB_PITCH_FORCE:5254 · BOBBLE_SKINS:5256 · bobbleSetAvatar:5263 · bobbleLayout:5270 · bobbleTick:5283
bobblePoke:5308 · bobbleApplySkin:5325 · dollOwned:5335 · openDollPicker:5336 · carStartShow:5373 · showLawInfo:5391
lawNotice:5413 · driveFineSettle:5423 · heliFloorAt:5599 · tickHeli:5606 · gaugeBezel:5751 · gaugeTicks:5756
gaugeNeedle:5766 · gaugeText:5773 · drawGauges:5779 · soccerLetterPos:6099 · letterNeeded:6103 · soccerNeededSet:6108
soccerTileGeo:6114 · soccerGoldTexture:6116 · makeSoccerTile:6133 · soccerRefreshSkins:6142 · soccerBuildTargets:6149 · soccerRetarget:6158
soccerCoinPop:6170 · soccerFieldTexture:6182 · soccerNetTexture:6193 · soccerCrowdTexture:6200 · soccerBallMat:6208 · buildSoccerGoal:6216
buildStands:6227 · soccerNumTex:6235 · makeSoccerPlayer:6245 · soccerResetBall:6269 · soccerKick:6274 · soccerCheer:6282
updateSoccerGuide:6283 · soccerCamera:6297 · tickSoccer:6312 · soccerKitShow:6388 · soccerKitGo:6403 · emojiSprite:6454
makeAlien:6459 · startWave:6492 · waveSpawnFill:6503 · waveComplete:6512 · updateWaveHud:6522 · checkMechaBossBadge:6524
alienSpawnPos:6533 · removeAlien:6538 · mechaHudWord:6543 · setMechaHudSkin:6551 · mechaComboPop:6563 · mechaShielded:6568
mechaDamageFx:6570 · mechaHitByAlien:6575 · spawnAlienShot:6581 · removeAlienShot:6591 · tickAlienShots:6596 · spawnPowerup:6608
removePowerup:6621 · collectPowerup:6626 · tickPowerups:6633 · updateMechaHud:6642 · mechaTracer:6682 · mechaFire:6691
explodeAlien:6728 · tickMecha:6758 · loop:6814 · clearEntities:6842 · INTRO_KEY:6856 · introSeenObj:6857
introSeen:6858 · markIntroSeen:6859 · INTRO:6860 · showIntro:6925 · closeIntro:6950 · beginPlay:6956
start:6958 · exitWorld:7102 · mechaRecapLine:7137

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

## js/game.js (918 บรรทัด · 54 รายการ)
REPLAY_BONUS_EVERY:23 · REPLAY_BONUS_TIERS:25 · replayBonusFor:26 · SESSION_MILESTONES:32 · addSessionCoins:35 · updateBestTarget:74
weekKeyStr:87 · rolloverWeekBest:93 · exitGame:99 · showSessionSummary:132 · sprinkleConfetti:179 · VOCAB_PER_LEVEL:198
VOCAB_RANK_NAMES:199 · vocabRankName:200 · showProgressReport:202 · THUNDER_MS:376 · THUNDER_TIERS:380 · THUNDER_TIER_UI:381
thunderEmoji:382 · DAREDEVIL_TIERS:386 · DAREDEVIL_TIER_UI:387 · daredevilEmoji:388 · DILIGENT_TIERS:392 · DILIGENT_TIER_UI:393
diligentEmoji:394 · MECHABOSS_TIERS:398 · MECHABOSS_TIER_UI:399 · mechaBossEmoji:400 · BFF_TIERS:405 · BFF_TIER_UI:406
BFF_COIN:407 · bffEmoji:408 · badgeSuffix:413 · BADGE_META:425 · NAME_BADGE_RE:433 · splitNameBadges:434
badgeEmojis:440 · badgeScore:445 · checkCrown:451 · currentBadgeScore:467 · rolloverBadgeWeek:471 · addDiligent:484
celebrateBadge:500 · addThunder:514 · startGame:528 · newRound:568 · updateTimerBar:607 · updateComboPill:613
pickCard:617 · checkMatch:629 · renderCats:743 · startQuiz:778 · renderQuizQuestion:794 · finishQuiz:853

## js/images.js (101 บรรทัด · 14 รายการ)
IMG_FILES:11 · MOODS:12 · startImgKey:14 · petImageKeys:16 · probeImages:27 · probeRankImages:39
probeCollectImages:40 · probeGiftImages:41 · probeHomeImages:42 · equippedItem:48 · petStateImg:58 · happyNow:72
makeHappy:73 · currentPetImg:84

## js/lobby.js (52 บรรทัด · 3 รายการ)
PANEL_TITLES:9 · openPanel:20 · closePanel:28

## js/lobby3d.js (780 บรรทัด · 0 รายการ)

## js/main.js (158 บรรทัด · 2 รายการ)
syncMusicBtn:79 · bootGame:113

## js/moto3d.js (1,782 บรรทัด · 97 รายการ)
REWARD:7 · ACCEL:8 · DASH_LEN:9 · DOG_HIT_COIN:10 · FEAT_SP:12 · DECAL_N:13
GRAV:14 · SUSP_K:15 · ROAD_WIDE:16 · EDGE_M:17 · ROAD_TEX_S:18 · POST_N:19
LEAN_MAX:20 · COLLECT_R:21 · SPAWN_MIN:22 · BUCKET:23 · TILE_COLORS:24 · LETTER_COIN:26
COIN_VAL:30 · COIN_GAP:31 · COIN_TIERS:33 · COIN_CURVE_RAD:38 · NET_SEND_MS:40 · PEER_COLORS:41
CHAT_MS:43 · CHAT_PRESETS:44 · ENG_FILES:85 · CSS:140 · buildDom:325 · segKey:427
smoothPts:430 · featKey:446 · addFeat:447 · genFeatures:452 · terrainAt:471 · roadGroundY:484
decalTex:492 · makeDecals:511 · decalTick:520 · buildRoads:537 · distToSeg:633 · roadInfo:638
onRoad:644 · randomRoadPoint:645 · makeTextSprite:668 · letterTexture:681 · woodTileMat:696 · muralTexture:707
buildSchool:719 · buildScenery:865 · scatterTrees:944 · postTick:964 · scatterClouds:991 · makeDog:1003
spawnDog:1018 · dogHit:1028 · dogTick:1038 · coinTexture:1056 · makeCoins:1067 · addCoin:1069
clearCoins:1077 · coinTierAt:1080 · coinFx:1090 · grabCoin:1099 · coinTick:1116 · placeSpecialCoin:1124
makeVehicle:1136 · netReady:1171 · netJoin:1175 · netSend:1188 · sendChat:1205 · showPeerBubble:1215
removePeerBubble:1222 · renderBoard:1229 · peerColor:1246 · buildPeer:1250 · onPeer:1259 · dropPeer:1287
netLeave:1294 · peerTick:1300 · spawnSlot:1311 · pickWord:1328 · spawnLetters:1338 · renderWordHud:1353
fitWord:1361 · collectTick:1368 · completeWord:1387 · relocTick:1404 · gpsTick:1419 · miniTick:1428
build:1463 · applyVehicleUi:1497 · fit:1515 · tick:1523 · frame:1531 · start:1674
exitWorld:1725

## js/music.js (136 บรรทัด · 0 รายการ)

## js/online.js (1,116 บรรทัด · 76 รายการ)
ONLINE_STALE_MS:53 · ONLINE_BEAT_MS:54 · LEADERBOARD_SIZE:55 · onlineDisplayName:59 · onlineActivity:67 · ensureOnlineId:83
onlineKey:93 · onlinePushPresence:98 · onlinePushScore:108 · fetchPlayerStats:134 · onlineRerender:156 · notifyFriendBadges:168
FRIEND_ALPHA:194 · friendCode:195 · friendSearch:207 · friendRequest:231 · friendAccept:240 · friendDecline:252
friendsHeal:262 · CHAT_MAX_LEN:286 · CHAT_KEEP:287 · chatPairId:289 · chatRef:292 · chatListen:298
chatSend:314 · chatDeleteMsg:330 · TYPING_TTL:338 · typingRef:340 · chatSetTyping:341 · chatClearTyping:351
chatWatchTyping:359 · chatThemeRef:377 · chatSetTheme:378 · chatWatchTheme:383 · chatPrune:391 · chatSeenTs:408
chatMarkSeen:414 · chatUnreadCount:426 · chatWatchSync:429 · GIFT_EXPIRE_MS:479 · giftSend:482 · greetSend:496
giftAccept:508 · giftDecline:512 · giftInWatch:518 · giftReclaim:549 · giftOutWatchSync:559 · giftOutRebuild:614
salesWatch:644 · salesRerender:652 · sellInc:656 · marketWatch:664 · marketList:697 · marketUnlist:705
marketBuy:714 · marketSoldWatch:727 · tinvSend:756 · tinvClear:763 · tinvWatch:767 · FEED_MAX:796
feedEvent:799 · feedPrune:810 · feedPurgeCat:821 · feedPushAssets:832 · petDescriptor:850 · feedPushPets:856
fetchPlayerPets:870 · followSet:886 · followUnset:897 · feedRebuild:904 · feedWatchSync:916 · fetchPlayerFeed:943
fetchPlayerAssets:956 · fetchFollowers:975 · onlineStart:984 · onlineLoadSDK:1091

## js/state.js (957 บรรทัด · 83 รายการ)
STORAGE_KEY:6 · CURE_COST:8 · HUNGRY_SICK_MS:9 · MEAL_HOUR:11 · MEAL_FULL:12 · SLEEP_FROM_HOUR:13
SLEEP_SICK_HOUR:14 · WAKE_HOUR:15 · DINNER_COST:16 · TOXIN_FULL:18 · DETOX_COST:19 · FOODQUIZ_Q:21
FOODQUIZ_COIN:22 · FOODQUIZ_BONUS:23 · SHAPE_JUNK_MEALS:25 · SHAPE_CLEAN_MEALS:26 · SHAPE_MISS_MEALS:27 · SHAPE_EXP_BONUS:28
HEAT_SICK_MS:29 · THIRST_SICK_MS:30 · DEFAULT_STATE:32 · FEED_CATS:148 · SLOT_MS:159 · currentSlotStart:160
nextSlotStart:166 · mealDayKey:168 · nightKeyOf:170 · newPet:176 · loadState:201 · saveState:406
activePet:413 · petStage:414 · isAdult:419 · abilityOn:420 · hasPetType:421 · todayStr:424
dailyTick:428 · addCoins:431 · QUEST_POOL:451 · QUEST_PER_DAY:461 · questsToday:462 · questTick:469
questEvent:473 · assetValue:509 · netWorth:534 · assetCount:536 · refreshRank:553 · heatProtected:569
rainProtected:573 · petHungry:576 · petShapeOf:580 · updatePetShape:586 · shapeMealDone:593 · heatPct:603
ymStr:612 · billOutstanding:616 · UTILITIES:623 · HOME_UTILITIES:629 · homeDecayed:631 · billTick:634
myCar:703 · carLoanDue:708 · carLoanOverdue:713 · carLoanPayable:718 · carLoanPay:725 · compTick:738
ONLINE_RATE:752 · onlineEarnActive:753 · onlineEarnTick:757 · onlineEarnFlush:768 · marketTick:778 · addCraft:802
ORDER_MAX:821 · ORDER_LIFE_MS:822 · ORDER_GAP_MIN_MS:823 · ORDER_GAP_SPAN_MS:824 · ORDER_TIER_WEIGHT:825 · newOrder:826
orderTick:839 · careTick:847 · expNeed:928 · addExp:933 · addRP:953

## js/ui.js (6,700 บรรทัด · 265 รายการ)
startHTML:10 · PET_ANIM:30 · petAnimHTML:35 · petVisualHTML:50 · lobbyBlk:81 · caretakerFigureHTML:87
footAlign:97 · heroRankBgHTML:125 · NEW_WORD_MS:159 · newWordNext:165 · renderNewWord:176 · alignNewWord:196
startNewWordTimer:210 · showNewWordPopup:226 · GIANT_MAX:249 · GIANT_COST:250 · GIANT_PET_VH:251 · GIANT_OWNER_VH:252
GIANT_OWNER_X:253 · GIANT_NAMES:254 · giantLevel:255 · giantUnlocked:259 · upgradeGiant:261 · renamePet:284
resetGiant:300 · mealLabel:311 · fmtMins:318 · renderClock:327 · dinnerDue:350 · renderDinnerChip:355
dinnerClick:366 · renderRainBar:401 · rainFxTick:434 · RAIN_DROP_IMGS:451 · rainFxDrop:452 · selfPronoun:482
selfTag:487 · idTag:491 · SIDE_SCROLL_SPEED:501 · SIDE_SCROLL_RESUME:502 · initSideScroll:505 · sideScrollTick:533
QUEST_FLASH_HOLD:557 · QUEST_DECK_FLIP_MS:564 · questGo:567 · qDeckDraw:576 · qDeckNext:599 · renderQuestCard:613
sideFlashRows:651 · FRIEND_FLASH_GRACE:669 · ONLINE_FLIP_MS:677 · ONLINE_FLIP_RESUME:678 · ONLINE_SWIPE_STEP:679 · onPageDraw:683
onPageFlip:691 · bindOnlinePager:702 · renderOnlineCard:735 · bindInviteCards:847 · bindFriendQuickMenu:867 · openFriendQuickMenu:877
bindLbTabs:939 · renderLeaderboardCard:950 · bindLbGroupOpen:973 · lbRankRows:984 · lbDemoRows:1011 · lbChar:1033
openLeaderboardFull:1042 · BLK_PAD:1106 · seatPodChars:1108 · lbCoinHtml:1118 · lbBadgeHtml:1134 · lbBossHtml:1160
bindPlayerClicks:1186 · showPlayerCard:1196 · petDescImg:1409 · openImgLightbox:1422 · openPetPeek:1442 · updateBillBadges:1486
setBadge:1498 · updateSettingsBadge:1514 · openAttentionSummary:1528 · updateFriendBadge:1570 · renderFriendPanel:1580 · friendDoSearch:1628
refreshFriendData:1652 · CHAT_EMOJI_CATS:1704 · CHAT_THEMES:1726 · CHAT_SECRET_MS:1735 · chatBadgeSync:1743 · ibTimeStr:1751
openChatInbox:1758 · openChat:1861 · giftImg:2048 · giftDateStr:2050 · GREETS:2058 · GREET_EXP:2066
greetInfo:2067 · openGreetPicker:2071 · giftItemPic:2113 · giftItemName:2121 · updateGiftBadge:2127 · renderGiftPanel:2136
acceptGift:2194 · declineGift:2217 · showGreetReveal:2226 · showGiftReveal:2253 · openGiftPicker:2279 · confirmSendGift:2347
doSendGift:2371 · rankBadgeHTML:2395 · renderRankCard:2400 · showRankUp:2422 · bindPetPlateButtons:2457 · openPetInfoOverlay:2481
feedAgo:2504 · renderFeedCard:2517 · alignPetTabs:2570 · alignCureBtn:2588 · dictRecordLookup:2612 · DICT_FILE_COUNT:2623
loadDict:2624 · dictSearch:2639 · dictTapWords:2654 · dictEntryHTML:2658 · openDictOverlay:2669 · renderDashboard:2753
sleepBtnHTML:3143 · sleepHintHTML:3150 · sleepAllPets:3161 · wakeAllPets:3174 · feedPet:3185 · openFoodMenu:3199
feedWith:3270 · AVATAR_UI:3300 · playerAvatarHTML:3303 · SHAPE_UI:3309 · showFeedResult:3318 · curePet:3359
heartsFx:3382 · PAT_HOLD_MS:3405 · PAT_EXP:3406 · bindPetTap:3407 · petBounce:3425 · petMood:3431
shortPatPet:3438 · longPatPet:3446 · patCalendarHTML:3466 · patStreakTick:3494 · cureCelebrateFx:3520 · railCureClick:3531
detoxPet:3543 · openFoodQuiz:3566 · renderShop:3646 · homeVisualHTML:3710 · showHomeRuined:3724 · showCutNotice:3745
renderHomeCard:3763 · payMaint:3847 · trashBillUI:3863 · payTrash:3880 · UTILITY_UI:3899 · utilityBillUI:3948
payUtility:3973 · buyUtilityFix:3999 · renderPhoneCard:4017 · buyPhone:4057 · sellPhone:4079 · compLiveTotal:4100
onlineLiveTotal:4111 · renderOnlineEarnPill:4116 · openPillInfo:4139 · renderComputerCard:4186 · buyComputer:4221 · sellComputer:4244
soldCount:4270 · soldBadge:4271 · renderTicketCard:4276 · loadScriptOnce:4332 · enterAdventure3D:4348 · enterHaunted3D:4370
advHealClick:4392 · buyTicket:4412 · renderHauntCard:4438 · buyHauntTicket:4493 · renderHeliCard:4520 · buyHeliTicket:4578
enterHeli3D:4601 · renderDroneCard:4623 · buyDroneTicket:4678 · enterDrone3D:4701 · renderDriveCard:4724 · buyDriveTicket:4798
enterDrive3D:4821 · pickDriveMap:4856 · enterMotoMapAsCar:4892 · renderSoccerCard:4914 · buySoccerTicket:4962 · enterSoccer3D:4985
renderMotoCard:5008 · buyMotoTicket:5057 · enterMoto3D:5080 · WORLD3D:5105 · gotoRobotShop:5115 · scrollShopCardIntoView:5120
railWorldClick:5123 · renderRailWorlds:5144 · tinvNoticeHTML:5203 · openTinvPicker:5211 · fruitCountdown:5255 · renderFarmCard:5267
renderFarmClock:5337 · buyFruit:5353 · sellFruit:5373 · sellAllFruit:5390 · collectImg:5416 · renderFactoryCard:5422
renderMarketCard:5445 · updateWishBadge:5501 · openWishlistDialog:5512 · bindStripArrows:5557 · renderMarketBrowse:5569 · carImg:5598
renderVehicleShop:5599 · CS_CYCLE_MS:5650 · carInteriorImg:5651 · carStatHtml:5653 · renderCarShowroom:5660 · csShowBig:5686
csInit:5713 · RS_CYCLE_MS:5736 · robotImg:5737 · renderRobotShop:5738 · rsShowBig:5760 · rsInit:5781
buyRobot:5800 · enterMecha3D:5822 · pickMechaRobot:5843 · pickDriveCar:5875 · openCarBuyDialog:5918 · buyCarInsurance:5979
payCarLoanMonthly:5998 · payCarLoanFull:6010 · carDriveBlock:6029 · gotoVehicleShop:6034 · gotoMyStock:6039 · showNeedCarDialog:6045
craftDiscount:6057 · renderFactory:6060 · renderOrdersUI:6122 · startProduce:6141 · buyCollectible:6169 · cancelProduce:6197
deliverOrder:6211 · renderOrderClock:6228 · renderCollectMine:6238 · openListDialog:6280 · cancelListing:6333 · buyMarketItem:6356
showCollectReveal:6383 · buyAC:6421 · openHomeShop:6440 · renderPetShop:6499 · showLevelUp:6560 · renderStats:6597
showTeacherCard:6668

## js/util.js (723 บรรทัด · 32 รายการ)
shuffle:6 · fmtNum:15 · escapeHTML:19 · seededRand:25 · fmtThaiDT:35 · fmtThaiDate:39
showScreen:44 · TOAST_WARN_RE:52 · restackToasts:55 · toast:77 · floatFx:97 · beep:107
PET_MOOD:144 · petVoiceSynth:151 · sirenSynth:228 · playCashier:252 · cashierSynth:266 · playSpark:299
sparkSynth:313 · thunderFx:348 · wordAudioFile:416 · speakWord:419 · speakLetter:439 · pickSpeakVoice:458
speakWordTTS:469 · askNameDialog:489 · askConfirm:529 · alertBox:547 · applyNoAnim:567 · openSettings:572
openHelp:678 · openTeacherGuide:704

## js/vocabbook.js (190 บรรทัด · 13 รายการ)
VB_MAX:11 · VB_QUIZ_N:12 · VB_QUIZ_MIN:13 · vbGroup:16 · VB_GROUP_UI:21 · vbRecord:24
vbStats:45 · vbList:53 · vbReviewCat:64 · vbStartReview:78 · openVocabBook:89 · vbRender:131
vbCardHTML:177

## js/wordsearch.js (236 บรรทัด · 0 รายการ)

## css/lobby.css (2,445 บรรทัด · 459 selector)
:root:6 · html:15 · body:16 · *:33,34,35,36 · #app:39 · h1:41
.subtitle:42 · .shop-title:43 · #rotate-overlay:46 · .screen:68 · #screen-select:77,78,79,80(+5) · .egg-need:87
.petshop-topright:89 · .petshop-play-link:90,95 · #screen-quiz:134,135,136,137(+4) · #quiz-choices:143,144 · .word-card:151 · .quiz-choice:152,153,154
.big-btn:157,158,159,160 · #screen-dashboard:165,696,704 · .lobby-top:172,600,601,602(+2) · .top-flex:173 · .profile-plate:174,178,521 · #rain-fx:183
.rain-layer:186,192 · .rain-glass:199 · .glass-drop:200 · .rail-btn:215,611,617,618(+13) · .rail-badge:216 · .fr-code-box:221
.fr-code-label:225 · .fr-code-row:226 · .fr-code:227 · .fr-copy-btn:232,236,241,242 · .fr-search-btn:237 · .fr-add-btn:238
.fr-accept:239 · .fr-decline:240 · #fr-search-input:243 · #fr-search-result:247 · .fr-found:248 · .fr-hint:252
.fr-list-title:253 · .fr-row:254 · .fr-req:258 · .fr-row-name:260,264 · .fr-row-status:268 · .fr-req-btns:269
.online-dot:270 · .fr-chat-btn:271,276,278 · .fr-unread:279 · .chat-overlay:286 · .chat-box:290,399,406,413(+12) · .chat-head:302
.chat-theme-btn:307,311 · .chat-secret-tg:312,313 · .cs-switch:314,315,320,321 · .cs-slider:316,318 · .chat-secret-note:322 · .chat-theme-strip:325
.chat-theme-sw:327,330,331,332(+1) · .chat-head-name:334,335 · .chat-close:336 · .chat-msgs:340 · .chat-empty:344 · .chat-typing:346
.ct-dots:348,349,351,352 · .no-anim:354,367,670,674(+23) · .chat-bubble:355,360,365 · .chat-emoji:368 · .chat-emo:372,376 · .chat-input-row:377
.chat-emoji-btn:381 · #chat-input:385 · .chat-send:389,394,395 · .pl-click:462,464,465 · .pl-overlay:466 · .pl-card:470,1823
.pl-close:476 · .pl-head:480,1732,1735 · .pl-grade:485 · .pl-badges:487 · .pl-badge-chip:488,492 · .pl-body:493
.pl-loading:494 · .pl-none:495 · .pl-me-tag:496 · .pl-blk-wrap:498 · .pl-blk:499 · .pl-stat:500
.pl-lbl:505 · .pl-val:506,507 · .pl-tip:508 · .chip-edit:514,519,520 · .rank-mini:526,532,533,534 · .pass-photo:536,541
.pet-tabs:543 · .dict-box:544,548,549,550(+1) · .dict-card:556,561,565,566(+2) · .dict-head:562,563 · .dict-trail:570,574 · .dt-c:575,579,580
.dt-sep:581 · .dict-today:582 · .di-w:584,585,586 · .dict-list:587 · .dict-item:588,592,593,594(+5) · .lobby-mid:608
.lobby-rail:610 · .rail-worlds:628 · .rail-div:629 · .lobby-stage:644,646,662,701(+1) · .newword-banner:652,659,664 · .nw-tag:671
.nw-word:676 · .nw-hint:678,679 · .nw-box:681,2007 · .nw-pop-word:682 · .nw-speak:683 · .nw-pop-phon:684
.nw-ipa:685 · .nw-pop-sent:686 · .nw-pop-mean:687 · .pet-tab:688,689,690,2332 · .stage-hero:711,726,734,879(+5) · .hero-ground:748,868,874
.hero-rank-bg:750,753,756,760(+18) · #lobby3d-canvas:773,774 · .hero-scene:778,780,787,788(+8) · .caretaker-fig:827 · .caretaker-img:830 · .caretaker-emoji:832
.blk-rig:839,840,841 · .stage-plate:901,909,920,921(+30) · .plate-title:915 · .lobby-side:958,993,998,1001(+22) · .side-sec:961,2247 · .side-label:962,967
.side-label-row:969,970 · .lb-tabs-out:971,972,976 · .side-glass:980,987 · .side-card:999,1111 · #quest-card:1011,1035,1036,1037(+6) · .q-bigcard:1012,1041,1042,1045(+1)
.qb-top:1014 · .qb-emoji:1015 · .qb-name:1017 · .qb-bar:1018,1019 · .qb-row:1021 · .qb-prog:1022
.qb-reward:1023 · .qb-go:1024,1028 · .q-dots:1029 · .q-dot:1030,1031,1032 · .q-bonus:1033 · .feed-row:1056,1670,1675
.inv-card:1058,1060,1061 · .inv-btns:1062 · .inv-go:1063,1065 · .inv-x:1066 · #online-card:1070,2255,2256,2257(+1) · .fq-overlay:1071
.fq-box:1073,2063 · .fq-head:1077,1079 · .fq-close:1080 · .fq-sec:1082 · .fq-worlds:1083 · .fq-world:1084,1086
.fq-acts:1087 · .fq-act:1088,1091,1092 · .lobby-bottom:1122,1124 · .lobby-quiz-btn:1125 · .lobby-book-btn:1126,1127 · .lobby-foodquiz-btn:1128,1129
.lobby-play-btn:1130,1134 · .lobby-exam-btn:1136,1137,1139 · .panel-overlay:1144,1149 · .panel-box:1150 · .panel-head:1157,1161 · .panel-close:1162,1167
.panel-body:1168,1172,1173 · .panel-page:1170,1171 · .collect-sub:1177 · .mkt-empty:1178 · .craft-box:1179 · .mkt-listing:1180
.mkt-filter:1181,1525 · .hq-grid:1188 · .hq-card:1189,1194,1218 · .hq-head:1195 · .hq-pic:1201,1203 · .hq-emoji:1205
.hq-badge:1206 · .hq-stars:1210 · .hq-price:1211,1216,1217,1220(+6) · .craft-credit:1224,1226,1227 · .car-grid:1234,1236,1237 · .robot-weap:1238
.dmap-box:1241,1242 · .dmap-grid:1248 · .dmap-card:1250,1253,1254,1255(+2) · .dmap-ico:1257 · .dmap-new:1260 · .dcp-grid:1262
.dcp-card:1264,1267,1268,1269(+10) · .levelup-box:1286,1964,1965,2060 · .dcp-box:1289,1290,1294,1295(+6) · .dcp-lock:1303 · .sold-badge:1307,1309,1310 · .rs-showroom:1312
.rs-list:1313,1315 · .rs-thumb:1316,1318,1319,1320(+1) · .rs-thumb-pic:1321,1322 · .rs-thumb-price:1323 · .rs-stage:1325 · .rs-big:1328
.rs-big-img:1329 · .rs-elec:1333,1337,1342 · .rs-edge:1343,1349 · .rs-info:1352,1353,1354,1355(+1) · .rs-buy:1357,1359,1360 · .cs-showroom:1364
.cs-list:1365,1367 · .cs-thumb:1368,1370,1371,1372(+1) · .cs-thumb-pic:1373,1374 · .cs-thumb-name:1375 · .cs-thumb-price:1376 · .cs-thumb-own:1377
.cs-stage:1379 · .cs-big:1382 · .cs-big-img:1383 · .cs-elec:1387,1391,1395 · .cs-edge:1396,1402 · .cs-interior:1405
.cs-inr-label:1406,1407 · .cs-inr-img:1408 · .cs-info:1410,1411,1412,1413(+6) · .cs-buy:1421,1423,1424,1425 · .car-emoji:1427 · .car-mine:1433
.car-mine-pic:1438 · .car-mine-info:1439 · .car-loan:1440,1441 · .car-mine-btns:1442,1443,1444 · .car-locked:1446 · .car-mine-head:1448
.car-pick-list:1449,1450 · .car-pick:1451,1453,1454 · .car-pick-pic:1455,1456 · .car-pick-name:1457,1458 · .car-pick-od:1459 · .car-buy-box:1461,2067
.cb-pic:1462,1463,1464 · .cb-lines:1465 · .cb-li:1466,1470,1471 · .cb-ins:1472,1476,1477 · .cb-plan:1478 · .cb-pl:1479,1484,1486,1490(+1)
.cb-total:1497 · .cb-btns:1498,1503 · .cb-x:1499 · .shop-grid:1506 · .shop-item:1507,1512,1517,1518(+3) · .mkt-tab:1526,1527
.pg-btn:1528,1529,1530 · .pg-dot:1531 · .fr-gift-btn:1553,1558 · .gift-sec-title:1561 · .gift-in-row:1563 · .gift-out-row:1567
.gift-in-pic:1568,1570,1571 · .gift-in-info:1572,1573 · .gift-in-btns:1574 · .gift-accept:1575,1579,1581 · .gift-decline:1580 · .gift-box-card:1582
.gift-box-from:1583,1584 · .gift-note:1585 · .gift-pick-overlay:1588 · .gift-pick-box:1592 · .gift-pick-head:1598,1602 · .gift-pick-close:1603
.gift-pick-tabs:1605 · .gp-tab:1606,1610 · .gift-pick-body:1611 · .gp-chips:1612 · .gp-chip:1613,1617 · .gp-card:1618,1619
.gp-price:1620 · .gp-note:1621 · .gift-cf-pic:1622 · .chat-emoji-cats:1627 · .chat-emoji-cat:1631,1635,1636 · .chat-emoji-wrap:1637,1638
.stage-left:1646 · .pet-info-btn:1650,1657,1658 · .feed-list:1665,1669 · .feed-ico:1676 · .feed-txt:1677 · .feed-name:1678
.feed-ago:1679 · .feed-empty:1680,1683 · .pi-overlay:1685 · .pi-box:1689,1694,1695,1699(+2) · .pi-close:1701,1706,1707 · .pi-close-left:1709
.pi-portrait:1711 · .pi-dress-btn:1718,1722,1723 · .pi-shape-cap:1724,1727,1728,1729 · .greet-card:1736 · .greet-sub:1737 · .greet-grid:1738
.greet-opt:1739,1742,1743,1744 · .greet-e:1745 · .pi-streak:1749 · .pi-streak-head:1751,1753 · .pi-streak-best:1754 · .pi-dots:1755
.pi-dot:1757,1758,1759 · .pi-streak-note:1760 · .pi-care-title:1761 · .lbf-overlay:1764 · .lbf-box:1767 · .lbf-head:1772
.lbf-title:1773 · .lbf-tabs:1774 · .lbf-close:1777 · .lbf-close-l:1778 · .lbf-body:1779 · .lbf-grid:1780
.lbf-cell:1782,1785,1786,1787(+1) · .lbf-podium:1791 · .pod:1793,1820,1821 · .pod-char:1795 · .pod-base:1797 · .pod-rank:1799
.pod-label:1801 · .pod-name:1803 · .pod-sc:1805 · .pod-1:1810,1811 · .pod-2:1812,1813 · .pod-3:1814,1815
.pod-4:1816,1817 · .pod-5:1818,1819 · .pl-wide:1824,1827,1828,1829 · .pl-follow:1830,1835,1837 · .pl-unfollow:1839,1845,1846 · .pl-followers:1847
.pl-cols:1848 · .pl-col:1849 · .pl-sec-title:1850 · .pl-feed:1851,1854,1861 · .pl-feed-row:1855,1859,1860 · .pl-assets-wrap:1863
.pl-assets:1864 · .pl-asset:1867,1871,1878 · .pl-asset-emoji:1872 · .pl-asset-n:1873 · .pl-pets-wrap:1880 · .pl-pets:1881
.pl-pet:1882,1887,1889 · .pl-pet-nm:1890 · .img-lightbox:1893,1898,1899,1903(+3) · .pl-chat:1916,1921 · .pet-peek:1922,1923 · .pp-chips:1925
.pp-chip:1926 · .pp-gift:1931,1937 · .settings-box:1939,1940,2009,2014(+20) · .set-feed-head:1941 · .set-feed-sub:1945 · .set-feed-row:1946
.pillinfo-val:1951 · .pillinfo-desc:1956,1975 · .pillinfo-box:1967 · .plf-head:1970 · .plf-emoji:1971 · .plf-ht:1972,1973,1974
.plf-foot:1976 · .alert-box:1981,1983 · .ab-emoji:1984 · .ab-title:1985 · .ab-desc:1986 · .ab-btns:1987,1988,1989
.heal-heart:1991 · .pet-stage:1998 · .attn-box:2006 · .help-box:2038,2039,2040 · .wl-box:2061 · .food-box:2062
.home-shop-box:2064 · .summary-box:2065 · .report-box:2066 · .wl-grid:2069 · .tc-wrap:2071 · .spell-btn:2077,2082
.sp-hud:2083 · .sp-word:2085 · .sp-ch:2086,2091 · .sp-th:2093 · .sp-hint:2095 · .sp-exit:2098,2102
.sp-banner:2103 · .sp-big:2108 · .sp-thb:2110 · .sp-coin:2111 · #spell-confetti:2116 · .sp-rb:2117
.sp-day:2127 · .sp-perfect:2129 · .sp-late:2131 · #spell-coinpop:2134 · .side-sub:2243,2245 · .sec-quest:2248
.on-page:2259,2260,2261,2262 · .inbox-overlay:2272 · .ib-box:2274 · .ib-head:2278 · .ib-close:2282,2284 · .ib-list:2285,2286
.ib-row:2287,2288,2289,2290 · .ib-ava:2291 · .ib-on:2295 · .ib-mid:2297 · .ib-name:2298 · .ib-last:2299
.ib-meta:2300 · .ib-time:2301 · .ib-dot:2303 · .ib-story-badge:2306 · .ib-empty:2310 · .ib-story:2312,2314
.ib-story-item:2315,2317,2324 · .ib-story-ava:2318 · .ib-story-on:2322 · .ib-world:2327,2330 · #btn-music:2335,2338,2339 · #ws-overlay:2354
#ws-board:2356,2362,2364 · .ws-head:2366 · .ws-title:2367 · .ws-grade:2369 · .ws-body:2371 · .ws-gridwrap:2372
#ws-grid:2373 · .ws-cell:2377,2381,2383,2391(+1) · .ws-flash:2395,2397 · .ws-coinpop:2401 · .ws-side:2412 · .ws-find:2413
#ws-words:2415,2417 · .ws-word:2418,2422,2424 · #ws-prog:2425 · .ws-actions:2426,2427,2429 · #ws-new:2430 · #ws-stash:2431
#ws-clear:2432 · #ws-win:2433,2435 · .ws-win-in:2436,2439

## css/style.css (1,701 บรรทัด · 453 selector)
:root:5 · *:15 · html:16,21 · input:25 · body:29 · #app:35
.screen:38,39 · h1:42 · .subtitle:43 · .egg-grid:46,63 · .egg-card:47,52,53,54(+2) · .pet-price:57,61
.egg:65,71,75 · .d1:76 · .basket:79,80,85,91(+5) · .basket-dog:89,102,103,104 · .basket-cat:90,105,106,107 · .egg-dragon:110
.topbar:125 · .topbar-coins:126 · .coin-pill:127,132,136,141(+2) · .no-anim:142,532,1418,1658(+2) · .net-coin:144 · .q-row:156,157,158,162(+1)
.q-emoji:159 · .q-mid:160 · .q-name:161 · .q-bar:163,164 · .q-right:166,167 · .q-foot:168,169
.tc-open:172,173 · .tc-wrap:174 · .tc-card:175 · .tc-head:179 · .tc-sub:183 · .tc-name:184,185
.tc-badges:186 · .tc-when:187 · .tc-row:188,192 · .tc-pass:193 · .tc-try:194 · .tc-sign:195
.tc-hint:196 · .tc-close:197 · .mb-seller:203 · .mb-buy:204 · .wl-open:207,212 · .strip-wrap:215,233
.strip-x:216,223,224,236(+1) · .strip-arrow:225,231,232 · .craft-toolbar:239,240 · .fc-cols:242,243 · .wl-box:277 · .wl-head:278,279,280
.wl-grid:282 · .wl-it:287,291,292,293 · .wl-emoji:294 · .wl-name:295 · .wl-h:296 · .hq-card:297,378
.icon-btn:298 · #settings-badge:304 · .badge-pop:307 · .attn-box:309,310,327 · .attn-list:311 · .attn-row:312,317
.attn-ico:318 · .attn-txt:319,320 · .attn-go:321 · .attn-total:322,326 · .rain-banner:330,335,336,337 · .rain-row:339
.rain-icon:340 · .rain-track:341 · .rain-fill:345 · .rain-note:346 · .comp-earn:349,361,365,366(+1) · .comp-earn-label:354
.comp-earn-num:355,359 · .comp-earn-sub:360 · .farm-sub:372 · .farm-cols:374,375 · .farm-shop:377 · .farm-hq:379,380,381
.farm-yield:382,383 · .farm-tree:384,389,394,398 · .farm-tree-emoji:393 · .farm-tree-name:396 · .farm-tree-status:397 · .farm-grow-badge:399
.farm-sell-btn:420,425 · .farm-sellall-btn:426,432,433 · .rank-card:436 · .rank-badge-wrap:441 · .rank-badge-img:442 · .rank-badge-emoji:443
.rank-body:444 · .rank-name:445,446 · .rank-bar:447 · .rank-fill:448 · .rank-text:449 · .rankup-overlay:452
.rankup-rays:458 · .rankup-content:474 · .rankup-title:479 · .rankup-badge:484,497 · .rankup-badge-img:496 · .rankup-name:498
.rankup-en:502 · .rankup-sub:506 · .rankup-btn:507,514,515 · .cr-btn-row:517 · .rankup-btn-2:518,519 · .thunder-fx:522
.quake:523 · .pet-tabs:535 · .pet-tab:536,542,543 · .pet-card:545 · .pet-stage:550 · .aura:551,557
.sp1:558 · .pet-wrap:561 · .pet-emoji:562 · .pet-img:563 · .egg-img:564 · .feed-pet:565,711
.pet-baby:566 · .pet-adult:567 · .pet-egg-stage:569 · .wear:571 · .wear-head:572 · .wear-face:573
.wear-neck:574 · .pet-name:576 · .stage-label:577 · .level-row:578 · .level-badge:579 · .exp-bar:583
.exp-fill:584 · .exp-text:585 · .ability-box:587,591 · .hunger-bar:594 · .hunger-fill:595,596,597 · .food-item:603,645,649,650(+6)
.hunger-text:607 · .heat-bar:610 · .heat-fill:611 · .heat-text:612,613,614 · .care-row:616 · .care-btn:617,621,624
.btn-feed:622 · .btn-cure:623 · .sick-banner:625 · .pet-sick:629 · .pet-asleep:632 · .sleep-badge:633
.btn-sleep:635 · .dinner-btn:638 · .food-box:642,643 · .food-grid:644 · .fav-tag:664 · .fd-exp:668
.food-sec:670 · .food-sec-human:674 · .bad-tag:676 · .fd-toxin:680 · .fd-safe:681 · .fq-box:684,685
.fq-progress:686 · .fq-pair:687,688 · .fq-ask:689 · .fq-why:690 · .fq-btns:694,695,699 · .fq-yes:700
.fq-no:701 · .fq-next:702 · .food-cancel:703 · .feed-box:709,710 · .feed-gain:712 · .sick-badge:716
.big-btn:722,728,949,950(+6) · .shop-card:731 · .shop-title:735 · .shop-grid:736 · .shop-item:737,741,742,743(+4) · .it-tag:748
.tag-wear:749 · .lock-banner:751 · .home-current:757,762,763 · .home-img:764 · .home-emoji:765 · .home-btn:766,788
.home-layout:768 · .home-pic-col:769,775 · .home-img-big:773 · .home-info-col:776,778,781,782 · .home-name-row:779 · .home-desc-row:780
.home-shop-box:790,791 · .home-list:792 · .home-option:793,797,798,799(+1) · .home-opt-img:800 · .home-opt-body:802,803 · .home-price:804
.reset-link:809 · .login-card:815 · .login-pets:816 · .login-status:817 · .google-btn:818,824,825 · .login-note:826
.install-btn:829,835,836 · .install-guide-overlay:839 · .install-guide:843,847,850 · .install-steps:848,849 · .install-guide-close:851 · .login-account:856
.register-card:859,863,869,873 · .reg-safety:865,867,868 · .student-chip:874 · .clock-chip:878 · .online-count:884 · .online-row:891,895,896
.online-dot:900 · .online-name:905 · .online-act:909 · .online-live:913 · .online-note:917 · .lb-empty:920
.lb-list:921 · .lb-row:922,926,927 · .lb-rank:931 · .lb-name:933,937 · .lb-coins:941 · .lb-hint:943
.lb-badgeline:944 · .lb-tabs:946 · .lb-tab:947,948 · .tinv-note:959 · .cat-card:965,986,1065,1070 · .cat-head:969
.cat-emoji:970 · .cat-name:971 · .cat-pass:972 · .cat-info:973 · .cat-btns:974 · .cat-btn:975,979,980,981(+2)
.band-sec-head:984,985 · .band-mine-tag:987 · .bsp-box:990,993 · .bsp-head:994 · .bsp-prog:995 · .bsp-retake:997,1000
.rts-box:1003 · .rts-head:1005 · .rts-sets:1006 · .rts-set:1007,1008,1009 · .rts-sub:1010 · .rts-words:1011
.rts-word:1012,1014,1015 · .rts-foot:1016 · .rts-okbtn:1017,1019 · .bsp-grid:1020 · .bsp-chip:1021,1024,1025,1026(+1) · .bsp-num:1028
.bsp-best:1029 · .bsp-tick:1030 · .bsp-foot:1031 · .vb-box:1034,1036 · .vb-head:1037 · .vb-total:1038
.vb-quizbtn:1039,1041 · .vb-tabs:1042 · .vb-tab:1043,1045,1046 · .vb-words:1047 · .vb-word:1048,1051,1052,1053(+3) · .vb-empty:1057
.vb-foot:1058 · .vb-pg:1059,1061 · #vb-pginfo:1062 · .vb-hint:1063 · .band-lock:1071 · .offline-btn:1072,1073
.quiz-progress:1078 · .quiz-phon:1079 · #quiz-extra:1080,1082,1083,1084 · .quiz-word-card:1085 · .quiz-speak:1090 · .quiz-choice:1091,1096,1097,1098
.quiz-score-pill:1099 · .stats-card:1102 · .stats-title:1106,1539 · .stats-row:1107,1108,1109,1110 · .game-top:1113 · .back-btn:1114
.combo-pill:1118 · .timer-wrap:1122 · .timer-fill:1123,1124 · .board-label:1126 · .card-grid:1127 · .word-card:1128,1134,1135,1136(+3)
.hint-btn:1142,1147 · .game-endless-note:1150,1155,1157,1161(+6) · .report-btn:1182,1187 · .report-box:1190 · .report-close:1191 · .rp-head:1195
.rp-avatar:1196,1197 · .rp-title:1198 · .rp-sub:1199 · .rp-levelcard:1201 · .rp-level-top:1205 · .rp-bar:1206
.rp-bar-fill:1207 · .rp-level-note:1208,1209 · .rp-grid:1211 · .rp-stat:1212 · .rp-ic:1215 · .rp-num:1216
.rp-lbl:1217 · .rp-section:1219 · .rp-h3:1220 · .rp-badge-mini:1221 · .rp-row:1222,1223,1224 · .rp-empty:1225
.rp-badges:1226 · .rp-badge:1227 · .rp-tline:1230 · .rp-tl-head:1231,1232 · .rp-tl-ems:1233 · .rp-em:1234,1235
.rp-tl-note:1236,1237 · .rp-crown:1239,1240 · .rp-wtitle:1242 · .rp-wnow:1243,1244 · .rp-wgraph:1245 · .rp-wcol:1246
.rp-wval:1247 · .rp-wbar:1248,1249 · .rp-wlbl:1250 · .rp-cheer:1252 · .report-ok:1256 · .summary-box:1259,1310,1314,1315(+2)
.sm-burst:1260 · .sm-title:1262 · .sm-line:1263 · .sm-coin:1264 · .sm-matches:1270,1271 · .confetti:1273
.sm-badge:1280 · .sm-badge-all:1284 · .badge-celebrate-overlay:1287,1300 · .badge-celebrate:1291 · .bc-emoji:1297 · .bc-title:1298
.bc-sub:1299 · .sm-cheer:1304 · .sm-streak:1305,1306 · .sm-sick:1307 · .sm-btns:1308 · .float-fx:1320
.toast:1327 · .toast-warn:1334,1341,1342,1348 · .toast-clear-all:1350,1357 · .alert-box:1359 · .alert-ok:1360,1365 · .settings-box:1367
.set-row:1368 · .set-hint:1372 · .set-hint-on:1373 · .set-hint-off:1374 · .set-lwrap:1375 · .set-label:1376
.set-desc:1377 · .set-switch:1378,1382,1383,1388(+4) · .set-sw-knob:1384 · .set-sw-txt:1391 · .set-close:1397,1402 · .set-help:1403,1408
.help-box:1410,1411,1416 · .help-item:1412 · .update-banner:1424,1433,1434 · #update-reload:1435 · #update-dismiss:1439 · .levelup-overlay:1445
.levelup-box:1449,1456,1457,1458(+4) · .bill-box:1464,1468,1469 · .tag-off:1470 · .home-decayed-img:1471 · .home-dark-img:1472 · .thirst-fill:1473
.thirst-text:1474,1475 · .toxin-fill:1478 · .toxin-text:1479,1480 · .detox-btn:1481,1486 · .shape-text:1489,1490,1491,1492(+1) · .avatar-pick:1496
.avatar-opt:1497,1501,1502,1503 · .avatar-chip-img:1507 · .avatar-chip-blk:1509 · .set-avatar-btns:1510 · .avatar-mini:1511,1515 · .set-blk-row:1517
.set-sub2:1518 · .blk-grid:1520 · .blk-mini:1521,1524,1525,1526 · .game-avatar:1529,1530,1531 · .stats-nick:1540 · .ticket-owned:1543,1547
.collect-sub:1552 · .mkt-tabs:1553 · .mkt-tab:1554,1558 · .mkt-filter:1559 · .mkt-row:1563 · .mkt-emoji:1567,1568
.mkt-info:1569,1570 · .mkt-tier-stars:1571 · .mkt-buy:1572,1577,1578 · .mkt-price-lo:1579 · .mkt-price-hi:1580 · .mkt-empty:1581
.collect-grid:1584 · .collect-cell:1585 · .cc-emoji:1586,1587 · .cc-name:1588 · .cc-count:1589 · .cc-list-btn:1590,1594
.mkt-listhead:1595 · .mkt-listing:1596 · .ml-cancel:1600 · .mkt-sold:1606,1607,1608 · .list-dialog:1615,1616,1621 · .list-hint:1620
.collect-reveal-frame:1624,1631 · .collect-reveal-img:1630 · .collect-reveal-stars:1632 · .craft-box:1635 · .craft-head:1636 · .craft-bar:1637
.craft-fill:1638 · .craft-text:1639 · .craft-btn-row:1640,1641 · .craft-go-btn:1643,1649,1650,1653 · .craft-cancel:1661,1665 · .mkt-catalog:1668,1669,1670
.mkt-pager:1673 · .pg-btn:1674,1678,1679 · .pg-mid:1680 · .pg-dots:1681 · .pg-dot:1682,1683 · .order-head:1684
.order-row:1685,1690,1692,1694 · .order-deliver:1695,1700 · .order-need:1701
