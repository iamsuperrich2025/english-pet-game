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

## js/state.js (959 บรรทัด · 83 รายการ)
STORAGE_KEY:6 · CURE_COST:8 · HUNGRY_SICK_MS:9 · MEAL_HOUR:11 · MEAL_FULL:12 · SLEEP_FROM_HOUR:13
SLEEP_SICK_HOUR:14 · WAKE_HOUR:15 · DINNER_COST:16 · TOXIN_FULL:18 · DETOX_COST:19 · FOODQUIZ_Q:21
FOODQUIZ_COIN:22 · FOODQUIZ_BONUS:23 · SHAPE_JUNK_MEALS:25 · SHAPE_CLEAN_MEALS:26 · SHAPE_MISS_MEALS:27 · SHAPE_EXP_BONUS:28
HEAT_SICK_MS:29 · THIRST_SICK_MS:30 · DEFAULT_STATE:32 · FEED_CATS:149 · SLOT_MS:160 · currentSlotStart:161
nextSlotStart:167 · mealDayKey:169 · nightKeyOf:171 · newPet:177 · loadState:202 · saveState:408
activePet:415 · petStage:416 · isAdult:421 · abilityOn:422 · hasPetType:423 · todayStr:426
dailyTick:430 · addCoins:433 · QUEST_POOL:453 · QUEST_PER_DAY:463 · questsToday:464 · questTick:471
questEvent:475 · assetValue:511 · netWorth:536 · assetCount:538 · refreshRank:555 · heatProtected:571
rainProtected:575 · petHungry:578 · petShapeOf:582 · updatePetShape:588 · shapeMealDone:595 · heatPct:605
ymStr:614 · billOutstanding:618 · UTILITIES:625 · HOME_UTILITIES:631 · homeDecayed:633 · billTick:636
myCar:705 · carLoanDue:710 · carLoanOverdue:715 · carLoanPayable:720 · carLoanPay:727 · compTick:740
ONLINE_RATE:754 · onlineEarnActive:755 · onlineEarnTick:759 · onlineEarnFlush:770 · marketTick:780 · addCraft:804
ORDER_MAX:823 · ORDER_LIFE_MS:824 · ORDER_GAP_MIN_MS:825 · ORDER_GAP_SPAN_MS:826 · ORDER_TIER_WEIGHT:827 · newOrder:828
orderTick:841 · careTick:849 · expNeed:930 · addExp:935 · addRP:955

## js/ui.js (6,758 บรรทัด · 268 รายการ)
startHTML:10 · PET_ANIM:30 · petAnimHTML:35 · petVisualHTML:50 · lobbyBlk:81 · caretakerFigureHTML:87
footAlign:97 · heroRankBgHTML:125 · NEW_WORD_MS:159 · newWordNext:165 · renderNewWord:176 · alignNewWord:200
startNewWordTimer:214 · NEW_WORD_COIN:233 · newWordReward:234 · coinFlyFx:252 · showNewWordPopup:280 · GIANT_MAX:307
GIANT_COST:308 · GIANT_PET_VH:309 · GIANT_OWNER_VH:310 · GIANT_OWNER_X:311 · GIANT_NAMES:312 · giantLevel:313
giantUnlocked:317 · upgradeGiant:319 · renamePet:342 · resetGiant:358 · mealLabel:369 · fmtMins:376
renderClock:385 · dinnerDue:408 · renderDinnerChip:413 · dinnerClick:424 · renderRainBar:459 · rainFxTick:492
RAIN_DROP_IMGS:509 · rainFxDrop:510 · selfPronoun:540 · selfTag:545 · idTag:549 · SIDE_SCROLL_SPEED:559
SIDE_SCROLL_RESUME:560 · initSideScroll:563 · sideScrollTick:591 · QUEST_FLASH_HOLD:615 · QUEST_DECK_FLIP_MS:622 · questGo:625
qDeckDraw:634 · qDeckNext:657 · renderQuestCard:671 · sideFlashRows:709 · FRIEND_FLASH_GRACE:727 · ONLINE_FLIP_MS:735
ONLINE_FLIP_RESUME:736 · ONLINE_SWIPE_STEP:737 · onPageDraw:741 · onPageFlip:749 · bindOnlinePager:760 · renderOnlineCard:793
bindInviteCards:905 · bindFriendQuickMenu:925 · openFriendQuickMenu:935 · bindLbTabs:997 · renderLeaderboardCard:1008 · bindLbGroupOpen:1031
lbRankRows:1042 · lbDemoRows:1069 · lbChar:1091 · openLeaderboardFull:1100 · BLK_PAD:1164 · seatPodChars:1166
lbCoinHtml:1176 · lbBadgeHtml:1192 · lbBossHtml:1218 · bindPlayerClicks:1244 · showPlayerCard:1254 · petDescImg:1467
openImgLightbox:1480 · openPetPeek:1500 · updateBillBadges:1544 · setBadge:1556 · updateSettingsBadge:1572 · openAttentionSummary:1586
updateFriendBadge:1628 · renderFriendPanel:1638 · friendDoSearch:1686 · refreshFriendData:1710 · CHAT_EMOJI_CATS:1762 · CHAT_THEMES:1784
CHAT_SECRET_MS:1793 · chatBadgeSync:1801 · ibTimeStr:1809 · openChatInbox:1816 · openChat:1919 · giftImg:2106
giftDateStr:2108 · GREETS:2116 · GREET_EXP:2124 · greetInfo:2125 · openGreetPicker:2129 · giftItemPic:2171
giftItemName:2179 · updateGiftBadge:2185 · renderGiftPanel:2194 · acceptGift:2252 · declineGift:2275 · showGreetReveal:2284
showGiftReveal:2311 · openGiftPicker:2337 · confirmSendGift:2405 · doSendGift:2429 · rankBadgeHTML:2453 · renderRankCard:2458
showRankUp:2480 · bindPetPlateButtons:2515 · openPetInfoOverlay:2539 · feedAgo:2562 · renderFeedCard:2575 · alignPetTabs:2628
alignCureBtn:2646 · dictRecordLookup:2670 · DICT_FILE_COUNT:2681 · loadDict:2682 · dictSearch:2697 · dictTapWords:2712
dictEntryHTML:2716 · openDictOverlay:2727 · renderDashboard:2811 · sleepBtnHTML:3201 · sleepHintHTML:3208 · sleepAllPets:3219
wakeAllPets:3232 · feedPet:3243 · openFoodMenu:3257 · feedWith:3328 · AVATAR_UI:3358 · playerAvatarHTML:3361
SHAPE_UI:3367 · showFeedResult:3376 · curePet:3417 · heartsFx:3440 · PAT_HOLD_MS:3463 · PAT_EXP:3464
bindPetTap:3465 · petBounce:3483 · petMood:3489 · shortPatPet:3496 · longPatPet:3504 · patCalendarHTML:3524
patStreakTick:3552 · cureCelebrateFx:3578 · railCureClick:3589 · detoxPet:3601 · openFoodQuiz:3624 · renderShop:3704
homeVisualHTML:3768 · showHomeRuined:3782 · showCutNotice:3803 · renderHomeCard:3821 · payMaint:3905 · trashBillUI:3921
payTrash:3938 · UTILITY_UI:3957 · utilityBillUI:4006 · payUtility:4031 · buyUtilityFix:4057 · renderPhoneCard:4075
buyPhone:4115 · sellPhone:4137 · compLiveTotal:4158 · onlineLiveTotal:4169 · renderOnlineEarnPill:4174 · openPillInfo:4197
renderComputerCard:4244 · buyComputer:4279 · sellComputer:4302 · soldCount:4328 · soldBadge:4329 · renderTicketCard:4334
loadScriptOnce:4390 · enterAdventure3D:4406 · enterHaunted3D:4428 · advHealClick:4450 · buyTicket:4470 · renderHauntCard:4496
buyHauntTicket:4551 · renderHeliCard:4578 · buyHeliTicket:4636 · enterHeli3D:4659 · renderDroneCard:4681 · buyDroneTicket:4736
enterDrone3D:4759 · renderDriveCard:4782 · buyDriveTicket:4856 · enterDrive3D:4879 · pickDriveMap:4914 · enterMotoMapAsCar:4950
renderSoccerCard:4972 · buySoccerTicket:5020 · enterSoccer3D:5043 · renderMotoCard:5066 · buyMotoTicket:5115 · enterMoto3D:5138
WORLD3D:5163 · gotoRobotShop:5173 · scrollShopCardIntoView:5178 · railWorldClick:5181 · renderRailWorlds:5202 · tinvNoticeHTML:5261
openTinvPicker:5269 · fruitCountdown:5313 · renderFarmCard:5325 · renderFarmClock:5395 · buyFruit:5411 · sellFruit:5431
sellAllFruit:5448 · collectImg:5474 · renderFactoryCard:5480 · renderMarketCard:5503 · updateWishBadge:5559 · openWishlistDialog:5570
bindStripArrows:5615 · renderMarketBrowse:5627 · carImg:5656 · renderVehicleShop:5657 · CS_CYCLE_MS:5708 · carInteriorImg:5709
carStatHtml:5711 · renderCarShowroom:5718 · csShowBig:5744 · csInit:5771 · RS_CYCLE_MS:5794 · robotImg:5795
renderRobotShop:5796 · rsShowBig:5818 · rsInit:5839 · buyRobot:5858 · enterMecha3D:5880 · pickMechaRobot:5901
pickDriveCar:5933 · openCarBuyDialog:5976 · buyCarInsurance:6037 · payCarLoanMonthly:6056 · payCarLoanFull:6068 · carDriveBlock:6087
gotoVehicleShop:6092 · gotoMyStock:6097 · showNeedCarDialog:6103 · craftDiscount:6115 · renderFactory:6118 · renderOrdersUI:6180
startProduce:6199 · buyCollectible:6227 · cancelProduce:6255 · deliverOrder:6269 · renderOrderClock:6286 · renderCollectMine:6296
openListDialog:6338 · cancelListing:6391 · buyMarketItem:6414 · showCollectReveal:6441 · buyAC:6479 · openHomeShop:6498
renderPetShop:6557 · showLevelUp:6618 · renderStats:6655 · showTeacherCard:6726

## js/util.js (727 บรรทัด · 32 รายการ)
shuffle:6 · fmtNum:15 · escapeHTML:19 · seededRand:25 · fmtThaiDT:35 · fmtThaiDate:39
showScreen:44 · TOAST_WARN_RE:52 · restackToasts:55 · toast:77 · floatFx:97 · beep:107
PET_MOOD:148 · petVoiceSynth:155 · sirenSynth:232 · playCashier:256 · cashierSynth:270 · playSpark:303
sparkSynth:317 · thunderFx:352 · wordAudioFile:420 · speakWord:423 · speakLetter:443 · pickSpeakVoice:462
speakWordTTS:473 · askNameDialog:493 · askConfirm:533 · alertBox:551 · applyNoAnim:571 · openSettings:576
openHelp:682 · openTeacherGuide:708

## js/vocabbook.js (190 บรรทัด · 13 รายการ)
VB_MAX:11 · VB_QUIZ_N:12 · VB_QUIZ_MIN:13 · vbGroup:16 · VB_GROUP_UI:21 · vbRecord:24
vbStats:45 · vbList:53 · vbReviewCat:64 · vbStartReview:78 · openVocabBook:89 · vbRender:131
vbCardHTML:177

## js/wordsearch.js (236 บรรทัด · 0 รายการ)

## css/lobby.css (2,483 บรรทัด · 463 selector)
:root:6 · html:15 · body:16 · *:33,34,35,36 · #app:39 · h1:41
.subtitle:42 · .shop-title:43 · #rotate-overlay:46 · .screen:68 · #screen-select:77,78,79,80(+5) · .egg-need:87
.petshop-topright:89 · .petshop-play-link:90,95 · #screen-quiz:134,135,136,137(+4) · #quiz-choices:143,144 · .word-card:151 · .quiz-choice:152,153,154
.big-btn:157,158,159,160 · #screen-dashboard:165,734,742 · .lobby-top:172,600,601,602(+3) · .top-flex:173 · .profile-plate:174,178,521 · #rain-fx:183
.rain-layer:186,192 · .rain-glass:199 · .glass-drop:200 · .rail-btn:215,611,617,618(+13) · .rail-badge:216 · .fr-code-box:221
.fr-code-label:225 · .fr-code-row:226 · .fr-code:227 · .fr-copy-btn:232,236,241,242 · .fr-search-btn:237 · .fr-add-btn:238
.fr-accept:239 · .fr-decline:240 · #fr-search-input:243 · #fr-search-result:247 · .fr-found:248 · .fr-hint:252
.fr-list-title:253 · .fr-row:254 · .fr-req:258 · .fr-row-name:260,264 · .fr-row-status:268 · .fr-req-btns:269
.online-dot:270 · .fr-chat-btn:271,276,278 · .fr-unread:279 · .chat-overlay:286 · .chat-box:290,399,406,413(+12) · .chat-head:302
.chat-theme-btn:307,311 · .chat-secret-tg:312,313 · .cs-switch:314,315,320,321 · .cs-slider:316,318 · .chat-secret-note:322 · .chat-theme-strip:325
.chat-theme-sw:327,330,331,332(+1) · .chat-head-name:334,335 · .chat-close:336 · .chat-msgs:340 · .chat-empty:344 · .chat-typing:346
.ct-dots:348,349,351,352 · .no-anim:354,367,670,696(+25) · .chat-bubble:355,360,365 · .chat-emoji:368 · .chat-emo:372,376 · .chat-input-row:377
.chat-emoji-btn:381 · #chat-input:385 · .chat-send:389,394,395 · .pl-click:462,464,465 · .pl-overlay:466 · .pl-card:470,1861
.pl-close:476 · .pl-head:480,1770,1773 · .pl-grade:485 · .pl-badges:487 · .pl-badge-chip:488,492 · .pl-body:493
.pl-loading:494 · .pl-none:495 · .pl-me-tag:496 · .pl-blk-wrap:498 · .pl-blk:499 · .pl-stat:500
.pl-lbl:505 · .pl-val:506,507 · .pl-tip:508 · .chip-edit:514,519,520 · .rank-mini:526,532,533,534 · .pass-photo:536,541
.pet-tabs:543 · .dict-box:544,548,549,550(+1) · .dict-card:556,561,565,566(+2) · .dict-head:562,563 · .dict-trail:570,574 · .dt-c:575,579,580
.dt-sep:581 · .dict-today:582 · .di-w:584,585,586 · .dict-list:587 · .dict-item:588,592,593,594(+5) · .lobby-mid:608
.lobby-rail:610 · .rail-worlds:628 · .rail-div:629 · .lobby-stage:644,646,662,739(+1) · .newword-banner:652,659,664 · .coin-fly:675
.coin-plus:683 · .nw-pop-coin:698,700,701 · .nw-tag:702 · .nw-word:707 · .nw-hint:709,710 · .nw-coin:712,715
.nw-box:719,2045 · .nw-pop-word:720 · .nw-speak:721 · .nw-pop-phon:722 · .nw-ipa:723 · .nw-pop-sent:724
.nw-pop-mean:725 · .pet-tab:726,727,728,2370 · .stage-hero:749,764,772,917(+5) · .hero-ground:786,906,912 · .hero-rank-bg:788,791,794,798(+18) · #lobby3d-canvas:811,812
.hero-scene:816,818,825,826(+8) · .caretaker-fig:865 · .caretaker-img:868 · .caretaker-emoji:870 · .blk-rig:877,878,879 · .stage-plate:939,947,958,959(+30)
.plate-title:953 · .lobby-side:996,1031,1036,1039(+22) · .side-sec:999,2285 · .side-label:1000,1005 · .side-label-row:1007,1008 · .lb-tabs-out:1009,1010,1014
.side-glass:1018,1025 · .side-card:1037,1149 · #quest-card:1049,1073,1074,1075(+6) · .q-bigcard:1050,1079,1080,1083(+1) · .qb-top:1052 · .qb-emoji:1053
.qb-name:1055 · .qb-bar:1056,1057 · .qb-row:1059 · .qb-prog:1060 · .qb-reward:1061 · .qb-go:1062,1066
.q-dots:1067 · .q-dot:1068,1069,1070 · .q-bonus:1071 · .feed-row:1094,1708,1713 · .inv-card:1096,1098,1099 · .inv-btns:1100
.inv-go:1101,1103 · .inv-x:1104 · #online-card:1108,2293,2294,2295(+1) · .fq-overlay:1109 · .fq-box:1111,2101 · .fq-head:1115,1117
.fq-close:1118 · .fq-sec:1120 · .fq-worlds:1121 · .fq-world:1122,1124 · .fq-acts:1125 · .fq-act:1126,1129,1130
.lobby-bottom:1160,1162 · .lobby-quiz-btn:1163 · .lobby-book-btn:1164,1165 · .lobby-foodquiz-btn:1166,1167 · .lobby-play-btn:1168,1172 · .lobby-exam-btn:1174,1175,1177
.panel-overlay:1182,1187 · .panel-box:1188 · .panel-head:1195,1199 · .panel-close:1200,1205 · .panel-body:1206,1210,1211 · .panel-page:1208,1209
.collect-sub:1215 · .mkt-empty:1216 · .craft-box:1217 · .mkt-listing:1218 · .mkt-filter:1219,1563 · .hq-grid:1226
.hq-card:1227,1232,1256 · .hq-head:1233 · .hq-pic:1239,1241 · .hq-emoji:1243 · .hq-badge:1244 · .hq-stars:1248
.hq-price:1249,1254,1255,1258(+6) · .craft-credit:1262,1264,1265 · .car-grid:1272,1274,1275 · .robot-weap:1276 · .dmap-box:1279,1280 · .dmap-grid:1286
.dmap-card:1288,1291,1292,1293(+2) · .dmap-ico:1295 · .dmap-new:1298 · .dcp-grid:1300 · .dcp-card:1302,1305,1306,1307(+10) · .levelup-box:1324,2002,2003,2098
.dcp-box:1327,1328,1332,1333(+6) · .dcp-lock:1341 · .sold-badge:1345,1347,1348 · .rs-showroom:1350 · .rs-list:1351,1353 · .rs-thumb:1354,1356,1357,1358(+1)
.rs-thumb-pic:1359,1360 · .rs-thumb-price:1361 · .rs-stage:1363 · .rs-big:1366 · .rs-big-img:1367 · .rs-elec:1371,1375,1380
.rs-edge:1381,1387 · .rs-info:1390,1391,1392,1393(+1) · .rs-buy:1395,1397,1398 · .cs-showroom:1402 · .cs-list:1403,1405 · .cs-thumb:1406,1408,1409,1410(+1)
.cs-thumb-pic:1411,1412 · .cs-thumb-name:1413 · .cs-thumb-price:1414 · .cs-thumb-own:1415 · .cs-stage:1417 · .cs-big:1420
.cs-big-img:1421 · .cs-elec:1425,1429,1433 · .cs-edge:1434,1440 · .cs-interior:1443 · .cs-inr-label:1444,1445 · .cs-inr-img:1446
.cs-info:1448,1449,1450,1451(+6) · .cs-buy:1459,1461,1462,1463 · .car-emoji:1465 · .car-mine:1471 · .car-mine-pic:1476 · .car-mine-info:1477
.car-loan:1478,1479 · .car-mine-btns:1480,1481,1482 · .car-locked:1484 · .car-mine-head:1486 · .car-pick-list:1487,1488 · .car-pick:1489,1491,1492
.car-pick-pic:1493,1494 · .car-pick-name:1495,1496 · .car-pick-od:1497 · .car-buy-box:1499,2105 · .cb-pic:1500,1501,1502 · .cb-lines:1503
.cb-li:1504,1508,1509 · .cb-ins:1510,1514,1515 · .cb-plan:1516 · .cb-pl:1517,1522,1524,1528(+1) · .cb-total:1535 · .cb-btns:1536,1541
.cb-x:1537 · .shop-grid:1544 · .shop-item:1545,1550,1555,1556(+3) · .mkt-tab:1564,1565 · .pg-btn:1566,1567,1568 · .pg-dot:1569
.fr-gift-btn:1591,1596 · .gift-sec-title:1599 · .gift-in-row:1601 · .gift-out-row:1605 · .gift-in-pic:1606,1608,1609 · .gift-in-info:1610,1611
.gift-in-btns:1612 · .gift-accept:1613,1617,1619 · .gift-decline:1618 · .gift-box-card:1620 · .gift-box-from:1621,1622 · .gift-note:1623
.gift-pick-overlay:1626 · .gift-pick-box:1630 · .gift-pick-head:1636,1640 · .gift-pick-close:1641 · .gift-pick-tabs:1643 · .gp-tab:1644,1648
.gift-pick-body:1649 · .gp-chips:1650 · .gp-chip:1651,1655 · .gp-card:1656,1657 · .gp-price:1658 · .gp-note:1659
.gift-cf-pic:1660 · .chat-emoji-cats:1665 · .chat-emoji-cat:1669,1673,1674 · .chat-emoji-wrap:1675,1676 · .stage-left:1684 · .pet-info-btn:1688,1695,1696
.feed-list:1703,1707 · .feed-ico:1714 · .feed-txt:1715 · .feed-name:1716 · .feed-ago:1717 · .feed-empty:1718,1721
.pi-overlay:1723 · .pi-box:1727,1732,1733,1737(+2) · .pi-close:1739,1744,1745 · .pi-close-left:1747 · .pi-portrait:1749 · .pi-dress-btn:1756,1760,1761
.pi-shape-cap:1762,1765,1766,1767 · .greet-card:1774 · .greet-sub:1775 · .greet-grid:1776 · .greet-opt:1777,1780,1781,1782 · .greet-e:1783
.pi-streak:1787 · .pi-streak-head:1789,1791 · .pi-streak-best:1792 · .pi-dots:1793 · .pi-dot:1795,1796,1797 · .pi-streak-note:1798
.pi-care-title:1799 · .lbf-overlay:1802 · .lbf-box:1805 · .lbf-head:1810 · .lbf-title:1811 · .lbf-tabs:1812
.lbf-close:1815 · .lbf-close-l:1816 · .lbf-body:1817 · .lbf-grid:1818 · .lbf-cell:1820,1823,1824,1825(+1) · .lbf-podium:1829
.pod:1831,1858,1859 · .pod-char:1833 · .pod-base:1835 · .pod-rank:1837 · .pod-label:1839 · .pod-name:1841
.pod-sc:1843 · .pod-1:1848,1849 · .pod-2:1850,1851 · .pod-3:1852,1853 · .pod-4:1854,1855 · .pod-5:1856,1857
.pl-wide:1862,1865,1866,1867 · .pl-follow:1868,1873,1875 · .pl-unfollow:1877,1883,1884 · .pl-followers:1885 · .pl-cols:1886 · .pl-col:1887
.pl-sec-title:1888 · .pl-feed:1889,1892,1899 · .pl-feed-row:1893,1897,1898 · .pl-assets-wrap:1901 · .pl-assets:1902 · .pl-asset:1905,1909,1916
.pl-asset-emoji:1910 · .pl-asset-n:1911 · .pl-pets-wrap:1918 · .pl-pets:1919 · .pl-pet:1920,1925,1927 · .pl-pet-nm:1928
.img-lightbox:1931,1936,1937,1941(+3) · .pl-chat:1954,1959 · .pet-peek:1960,1961 · .pp-chips:1963 · .pp-chip:1964 · .pp-gift:1969,1975
.settings-box:1977,1978,2047,2052(+20) · .set-feed-head:1979 · .set-feed-sub:1983 · .set-feed-row:1984 · .pillinfo-val:1989 · .pillinfo-desc:1994,2013
.pillinfo-box:2005 · .plf-head:2008 · .plf-emoji:2009 · .plf-ht:2010,2011,2012 · .plf-foot:2014 · .alert-box:2019,2021
.ab-emoji:2022 · .ab-title:2023 · .ab-desc:2024 · .ab-btns:2025,2026,2027 · .heal-heart:2029 · .pet-stage:2036
.attn-box:2044 · .help-box:2076,2077,2078 · .wl-box:2099 · .food-box:2100 · .home-shop-box:2102 · .summary-box:2103
.report-box:2104 · .wl-grid:2107 · .tc-wrap:2109 · .spell-btn:2115,2120 · .sp-hud:2121 · .sp-word:2123
.sp-ch:2124,2129 · .sp-th:2131 · .sp-hint:2133 · .sp-exit:2136,2140 · .sp-banner:2141 · .sp-big:2146
.sp-thb:2148 · .sp-coin:2149 · #spell-confetti:2154 · .sp-rb:2155 · .sp-day:2165 · .sp-perfect:2167
.sp-late:2169 · #spell-coinpop:2172 · .side-sub:2281,2283 · .sec-quest:2286 · .on-page:2297,2298,2299,2300 · .inbox-overlay:2310
.ib-box:2312 · .ib-head:2316 · .ib-close:2320,2322 · .ib-list:2323,2324 · .ib-row:2325,2326,2327,2328 · .ib-ava:2329
.ib-on:2333 · .ib-mid:2335 · .ib-name:2336 · .ib-last:2337 · .ib-meta:2338 · .ib-time:2339
.ib-dot:2341 · .ib-story-badge:2344 · .ib-empty:2348 · .ib-story:2350,2352 · .ib-story-item:2353,2355,2362 · .ib-story-ava:2356
.ib-story-on:2360 · .ib-world:2365,2368 · #btn-music:2373,2376,2377 · #ws-overlay:2392 · #ws-board:2394,2400,2402 · .ws-head:2404
.ws-title:2405 · .ws-grade:2407 · .ws-body:2409 · .ws-gridwrap:2410 · #ws-grid:2411 · .ws-cell:2415,2419,2421,2429(+1)
.ws-flash:2433,2435 · .ws-coinpop:2439 · .ws-side:2450 · .ws-find:2451 · #ws-words:2453,2455 · .ws-word:2456,2460,2462
#ws-prog:2463 · .ws-actions:2464,2465,2467 · #ws-new:2468 · #ws-stash:2469 · #ws-clear:2470 · #ws-win:2471,2473
.ws-win-in:2474,2477

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
