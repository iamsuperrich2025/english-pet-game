"use strict";

const fs = require("fs");
const path = require("path");
const root = path.resolve(__dirname, "..");
const read = (...p) => fs.readFileSync(path.join(root, ...p), "utf8");
const home = read("js", "home-v2.js");
const ui = read("js", "ui.js");
const css = read("css", "home-v2.css");
const preview = read("tools", "VW_MOBILE_DEVICE_PREVIEW.html");
const indexClassic = read("index_classic.html");
const buildWeb = read("tools", "build_web.mjs");
const fail = [];
const must = (ok, msg) => { if(!ok) fail.push(msg); };

/* R11.4 VISUAL MASTER FIDELITY RECONSTRUCTION + authoritative behavior guard. */
must(home.includes("R11.4 Visual Master Fidelity Reconstruction + Premium Depth / Composition Recovery"), "R11.4 Home V2 JS marker missing");
must(css.includes("R11.4 Visual Master Fidelity Reconstruction") && css.includes("--vw2-r111-ready:1") && css.includes("--vw2-r112-ready:1") && css.includes("--vw2-r113-ready:1") && css.includes("--vw2-r114-ready:1"), "R11.4 stylesheet lineage/marker missing");
must(home.includes("--vw2-r114-runtime-ready:1"), "R11.4 runtime marker missing");
must(home.includes("R12 / รอบ 1279") && css.includes("R12 / รอบ 1279") && css.includes("--vw2-r1279-ready:1") && home.includes("--vw2-r1279-runtime-ready:1"), "R12 / รอบ 1279 lineage markers missing");
must(home.includes("R13 / รอบ 1280") && css.includes("R13 / รอบ 1280") && css.includes("--vw2-r1280-ready:1") && home.includes("--vw2-r1280-runtime-ready:1"), "R13 / รอบ 1280 lineage markers missing");
must(css.includes("R14 / รอบ 1281") && css.includes("--vw2-r1281-ready:1") && home.includes("--vw2-r1281-runtime-ready:1"), "R14 / รอบ 1281 lineage markers missing");
must(css.includes("R15 / รอบ 1282") && home.includes("--vw2-r1282-runtime-ready:1"), "R15 lineage marker missing");
must(css.includes("margin-top:-49px") && css.includes("grid-template-columns:repeat(3,minmax(0,1fr))") && css.includes(".vw2-wallet-pill.computer,.vw2-wallet-pill.worth"), "R14 expanded hero / three-primary-card HUD missing");
must(home.includes('<strong></strong>') && css.includes(".vw2-feature-title>strong{display:none!important}") && css.includes(".vw2-word-ribbon{") && css.includes("left:23%;right:23%;top:8px"), "R14 New Word did not replace the Vocab World plaque");
must(home.includes("function marketFeedCardsHTML()") && home.includes("Array.isArray(Online.market)") && home.includes("for(const item of items)"), "R14 Global Feed does not include every authoritative market listing");
must(home.includes('class="vw2-feed-card vw2-market-feed-card') && home.includes('data-vw2-action="market"') && css.includes(".vw2-feed-market-divider") && css.includes(".vw2-market-feed-card"), "R14 market listing presentation/action missing");
must(home.indexOf("html = marketHtml + html;") < home.indexOf("if(host.dataset.vw2Html !== html)"), "R14 market cards are appended after the feed render point");
must(css.includes(".vw2-feed .vw2-section-head,.vw2-mission .vw2-section-head,.vw2-online .vw2-section-head") && css.includes("height:36px") && css.includes(".vw2-online-list{top:50px!important}"), "R14 panel-title alignment missing");
must(css.includes("grid-template-columns:repeat(13,156px)") && css.includes("grid-template-columns:repeat(13,146px)") && css.includes("word-break:keep-all"), "R14 Bottom Rail text geometry missing");
must(css.includes("R15 / รอบ 1282") && css.includes("--vw2-r1282-ready:1") && home.includes("--vw2-r1282-runtime-ready:1"), "R15 / รอบ 1282 lineage markers missing");
must(home.includes("<strong>ผู้เล่นออนไลน์</strong>") && !home.includes("<strong>เพื่อนออนไลน์</strong>"), "R15 online panel title was not renamed");
must(home.includes('data-vw2-action="petProfile" aria-label="เปิดโปรไฟล์สัตว์เลี้ยง"') && home.includes("<span>โปรไฟล์สัตว์เลี้ยง</span>"), "R15 center pet-profile action missing");
must(!home.includes("ตลาดผู้เล่นทั้งหมด ·") && !home.includes("🏪 ตลาดผู้เล่นทั้งหมด"), "R15 removed market wording is still visible");
must(css.includes('r1282_bottom_frame.webp') && css.includes('r1282_filigree.webp') && css.includes(".vw2-mode>span{") && css.includes("display:grid!important"), "R15 generated fantasy buttons/decor are not integrated");
must(css.includes("position:fixed!important") && css.includes("height:100dvh"), "R15 viewport lock is missing; Bottom Rail can be clipped by the dashboard offset");
must(home.includes("document.body.appendChild(root)") && !home.includes("dash.appendChild(root)"), "R15 Home V2 root is still mounted inside the clipped Classic dashboard container");
must(css.includes("R16 / รอบ 1283") && css.includes("--vw2-r1283-ready:1") && home.includes("--vw2-r1283-runtime-ready:1"), "R16 / รอบ 1283 lineage markers missing");
must(css.includes(".vw2-bottom-track .vw2-mode{") && css.includes('background:url("../img/home-v2/r1282_bottom_frame.webp") center/100% 100% no-repeat!important'), "R16 complete frame does not override the higher-specificity legacy colour skins");
must(css.includes("container-type:inline-size") && css.includes("scroll-snap-type:x mandatory!important") && css.includes("scroll-snap-align:start") && css.includes("scroll-snap-stop:always"), "R16 whole-button snap geometry missing");
must(css.includes("calc((100cqw - 64px)/7)") && css.includes("calc((100cqw - 56px)/6)") && css.includes("calc((100cqw - 48px)/5)") && css.includes("calc((100cqw - 40px)/4)"), "R16 full-page responsive button sizing missing");
must(home.includes("R13 / รอบ 1280"), "R13 JS lineage marker missing");
must(css.includes("R17 / รอบ 1284") && css.includes("--vw2-r1284-ready:1") && home.includes("--vw2-r1284-runtime-ready:1"), "R17 / รอบ 1284 lineage markers missing");
must(home.includes("R18 / รอบ 1286") && css.includes("R18 / รอบ 1286") && css.includes("--vw2-r1286-ready:1") && home.includes("--vw2-r1286-runtime-ready:1"), "R18 / รอบ 1286 lineage markers missing");
must(home.includes("R19 / รอบ 1287") && css.includes("R19 / รอบ 1287") && css.includes("--vw2-r1287-ready:1") && home.includes("--vw2-r1287-runtime-ready:1"), "R19 / รอบ 1287 lineage markers missing");
must(home.includes("R20 / รอบ 1288") && css.includes("R20 / รอบ 1288") && css.includes("--vw2-r1288-ready:1") && home.includes("--vw2-r1288-runtime-ready:1"), "R20 / รอบ 1288 lineage markers missing");
must(home.includes("R21 / รอบ 1289") && css.includes("R21 / รอบ 1289") && css.includes("--vw2-r1289-ready:1") && home.includes("--vw2-r1289-runtime-ready:1"), "R21 / รอบ 1289 lineage markers missing");
must(home.includes("R22 / รอบ 1290") && css.includes("R22 / รอบ 1290") && css.includes("--vw2-r1290-ready:1") && home.includes("--vw2-r1290-runtime-ready:1"), "R22 / รอบ 1290 lineage markers missing");
must(home.includes("R23 / รอบ 1291") && css.includes("R23 / รอบ 1291") && css.includes("--vw2-r1291-ready:1") && home.includes("--vw2-r1291-runtime-ready:1"), "R23 / รอบ 1291 lineage markers missing");
must(home.includes("R24 / รอบ 1293") && css.includes("R24 / รอบ 1293") && css.includes("--vw2-r1293-ready:1") && home.includes("--vw2-r1293-runtime-ready:1"), "R24 / รอบ 1293 lineage markers missing");
must(home.includes("R25 / รอบ 1294") && css.includes("R25 / รอบ 1294") && css.includes("--vw2-r1294-ready:1") && home.includes("--vw2-r1294-runtime-ready:1"), "R25 / รอบ 1294 lineage markers missing");
must(home.includes("R26 / รอบ 1295") && css.includes("R26 / รอบ 1295") && css.includes("--vw2-r1295-ready:1") && home.includes("--vw2-r1295-runtime-ready:1"), "R26 / รอบ 1295 lineage markers missing");
must(home.includes("R27 / รอบ 1296") && css.includes("R27 / รอบ 1296") && css.includes("--vw2-r1296-ready:1") && home.includes("--vw2-r1296-runtime-ready:1"), "R27 / รอบ 1296 lineage markers missing");
must(indexClassic.includes("css/home-v2.css?v=1309") && indexClassic.includes("js/home-v2.js?v=1309"), "R30 cache-bust missing from index_classic.html");
must(home.includes("R28 / รอบ 1300") && home.includes("--vw2-r1300-runtime-ready:1") && css.includes("R28 / รอบ 1300") && css.includes("--vw2-r1300-ready:1"), "R28 browser-verified visual contract missing");
must(css.includes("grid-template-areas:\"class id time\" \"date date date\"") && css.includes("top:54px!important") && css.includes("--card-shadow:#075aa8"), "R28 HUD clearance/profile/date/premium rail rules missing");
must(home.includes("R29 / รอบ 1305") && home.includes("--vw2-r1305-runtime-ready:1") && css.includes("R29 / รอบ 1305") && css.includes("--vw2-r1305-ready:1"), "R29 visual-hierarchy lineage markers missing");
must(css.includes("border-width:58px 27px 25px 68px!important") && css.includes("border-width:52px 24px 22px 61px!important") && css.includes("border-width:49px 22px 21px 57px!important"), "R29 uniform-scale Global Feed border slices missing");
must(css.includes(".vw2-feature-title,.vw2-word-ribbon{top:15px!important}") && css.includes(".vw2-speech{top:27%!important}"), "R29 New Word/speech hierarchy correction missing");
must(css.includes("width:84%!important;height:88%!important") && css.includes(".vw2-house-preview-head{display:none!important}") && css.includes(".vw2-house-backdrop{top:4px!important}"), "R29 portrait inset or redundant house caption removal missing");
must(css.includes("@media (min-width:1181px) and (min-height:521px)") && css.includes(".vw2-feature-action-track>button{flex:1 1 0!important}"), "R29 complete desktop pet-action row missing");
must(home.includes("R30 / รอบ 1309") && home.includes("--vw2-r1309-runtime-ready:1") && css.includes("R30 / รอบ 1309") && css.includes("--vw2-r1309-ready:1"), "R30 aligned-profile lineage markers missing");
must(css.includes("grid-template-columns:calc(29.5% + 4px)") && css.includes("grid-template-columns:calc(29.5% + 3px)") && css.includes("grid-template-columns:calc(30% + 3px)"), "R30 profile/feed alignment guides missing");
must(css.includes("grid-template-columns:clamp(106px,30%,118px)") && css.includes("background:linear-gradient(145deg,#fff9df") && css.includes("object-fit:cover!important;border-radius:12px"), "R30 enlarged rectangular profile portrait frame missing");
must(css.includes("overflow-x:auto!important;scroll-snap-type:x proximity!important") && css.includes("flex:0 0 clamp(176px,15vw,205px)!important"), "R30 wide swipeable pet-action rail missing");
must(css.includes("border-image-slice:70 32 14 82!important") && css.includes("border-width:58px 27px 14px 68px!important"), "R30 bottom-aligned Global Feed frame missing");
must(home.includes("VW2_FEED_STEP_MS = 6000") && home.includes("function advanceV2FeedAutoFlow(host)") && home.includes("host.__vw2FeedProgrammaticUntil"), "R30 Global Feed auto-flow contract missing");
must(home.includes("ADMIN PREVIEW · R30 PROFILE QA · FEED FLOW"), "R30 preview badge missing");
must(!home.includes("ADMIN PREVIEW · R21 HEAL ALL PETS"), "stale R21 preview badge remains");
must(css.includes(".vw2-feature-title,.vw2-word-ribbon{top:-25px!important}"), "R17 complete New Word control was not moved into the upper HUD lane");
must(css.includes(".vw2-feature{overflow:visible!important}") && css.includes("left:24%!important;right:24%!important;top:-25px!important"), "R18 New Word plaque is not fully visible in the safe HUD lane");
must(css.includes("-webkit-line-clamp:2") && css.includes("font-size:clamp(10.5px,.74vw,12px)!important") && css.includes(".vw2-feed .vw2-section-head .vw2-head-icon{display:none!important}"), "R18 child-readable mission/feed typography guards missing");
must(home.includes("const marketCard = e.target.closest") && home.includes("openMarketBuyDialog(key)") && home.includes("data-vw2-market-key"), "R17 Global Feed listing does not open the exact authoritative six-digit confirmation directly");
must(home.includes("ดูผู้เล่นออนไลน์ทั้งหมด") && home.includes('data-vw2-action="onlinePlayers"') && home.includes('id="vw2-online-modal-list"') && home.includes("function openOnlinePlayersModal()"), "R17 online-player sheet/action missing");
must(home.includes('class="vw2-online-modal-close top"') && home.includes('class="vw2-online-modal-close bottom"') && css.includes(".vw2-online-modal-list::-webkit-scrollbar{display:none"), "R17 online-player sheet close/hidden-scrollbar contract missing");
must(home.includes("function completeText(") && css.includes("text-overflow:clip!important") && css.includes(".vw2-online-name-line{"), "R17 complete player name/activity presentation missing");
must(home.includes("btn.classList.toggle('is-pet-sick', sick)") && css.includes(".vw2-rail-cure.is-pet-sick"), "R17 sick-pet cure alert missing");
must(css.includes("grid-template-columns:minmax(132px,1.08fr) repeat(2,minmax(112px,1fr))") && css.includes("grid-row:1/3"), "R13 two-row wallet hierarchy missing");
must(css.includes("grid-template-columns:repeat(13,minmax(132px,9.4vw))") && css.includes("grid-template-columns:repeat(13,126px)"), "R13 Bottom Rail label-proportion geometry missing");
must(css.includes("font-size:clamp(11.5px,.86vw,14px)!important") && css.includes("background:linear-gradient(180deg,rgba(255,255,255,.96),rgba(246,231,255,.94))!important"), "R13 Left Navigation caption readability missing");
must(home.includes('data-vw2-action="petProfile"') && home.includes('function openActivePetProfile()') && home.includes("typeof openPetInfoOverlay === 'function'"), "R13 visible pet no longer delegates to the authoritative Classic pet profile");
must(css.includes('.vw2-pet{') && css.includes('pointer-events:auto!important') && css.includes('.vw2-pet:focus-visible'), "R13 pet profile control is not pointer/keyboard accessible");
must(home.includes('id="vw2-pet" data-vw2-pat') && home.includes("function bindVisiblePetPat()") && home.includes("typeof shortPatPet === 'function'") && home.includes("typeof longPatPet === 'function'") && home.includes("bindVisiblePetPat();"), "R27 visible pet pat/hold gestures are not restored through Classic handlers");
must(home.includes("weekday:'short',day:'numeric',month:'long',year:'numeric'") && css.includes("grid-template-columns:clamp(360px,32vw,430px)") && css.includes(".vw2-profile-meta-chip.id b,.vw2-profile-meta-chip.date b"), "R27 full player ID / long Thai date space contract missing");
must(css.includes("border-image-slice:70 32 30 82!important") && css.includes("border-image-source:url(\"../img/home-v2/r115_frame_feed.webp\")!important") && css.includes(".vw2-feed .vw2-head-icon{display:none!important}") && home.includes("feedFrameContained:") && home.includes("feedFrameNineSlice:"), "R27 responsive single-layer nine-slice Global Feed frame contract missing");
must(home.includes('data-vw2-action="newWord"') && home.includes('function syncNewWordCard()') && home.includes("clickExisting('#newword-banner')"), "R13 New Word card is not visible/authoritatively bound");
must(home.includes('id="vw2-newword-word"') && home.includes('id="vw2-newword-hint"') && css.includes('New Word is a primary learning card') && css.includes('.vw2-word-copy strong'), "R13 New Word hierarchy missing");
must(home.includes("typeof renderPetShop === 'function' && typeof showScreen === 'function'") && home.includes("showScreen('screen-select')"), "R13 pet shop does not use the current authoritative route");
must(home.includes('data-vw2-action="shop" data-vw2-source="#screen-select"'), "R13 pet shop source evidence does not match the current screen route");
must(home.includes('function syncMusicState()') && home.includes("Music.isMusicOn === 'function'") && home.includes("label.textContent = on ? 'เพลงเปิด' : 'เพลงปิด'"), "R13 music button state sync missing");
must(css.includes('data-vw2-action="music"].is-music-on') && css.includes('data-vw2-action="music"].is-music-off') && css.includes('background:#c94f72'), "R13 music on/off visual distinction missing");
const r1279Scene = path.join(root, "img", "home-v2", "r1279_fantasy_world.webp");
must(fs.existsSync(r1279Scene) && fs.statSync(r1279Scene).size > 150000 && fs.statSync(r1279Scene).size < 500000, "R12 optimized fantasy scene missing / outside mobile budget");
must(home.includes("img/home-v2/r1279_fantasy_world.webp") && buildWeb.includes("img/home-v2/r1279_fantasy_world.webp"), "R12 fantasy scene is not integrated in runtime/build");
const r1282Assets = ["r1282_bottom_frame.webp", "r1282_filigree.webp"];
r1282Assets.forEach(name => {
  const asset = path.join(root, "img", "home-v2", name);
  must(fs.existsSync(asset) && fs.statSync(asset).size > 10000 && fs.statSync(asset).size < 50000, `R15 lightweight generated asset missing/outside budget: ${name}`);
  must(buildWeb.includes(`img/home-v2/${name}`), `R15 generated asset is not copied by build: ${name}`);
});

const r111Assets = [
  "r111_screen_frame.svg",
  "r111_pet_world_scene.svg",
  "r111_cloud_pedestal.svg",
  "r111_kanok_corner.svg",
  "r111_kanok_band.svg"
];
r111Assets.forEach(name => {
  must(fs.existsSync(path.join(root, "img", "home-v2", name)), `retained Home V2 visual asset missing: ${name}`);
  must(buildWeb.includes(`img/home-v2/${name}`), `build allowlist missing retained Home V2 visual asset: ${name}`);
});
must(!css.includes("data:image/webp;base64,"), "R11.4 CSS must not embed heavyweight base64 raster imagery");
const scenicAsset = read("img", "home-v2", "r111_pet_world_scene.svg");
must(scenicAsset.includes("data:image/webp;base64,") && scenicAsset.length < 80000, "optimized scenic wrapper regression");
must(css.includes('r111_kanok_corner.svg') && css.includes('r111_kanok_band.svg'), "integrated Thai/fantasy panel accents missing");
must(!home.includes('r111_screen_frame.svg') && css.includes('.vw2-screen-frame{display:none!important}'), "rejected yellow outer Thai frame returned");
must(home.includes('r1279_fantasy_world.webp'), "R12 authoritative scenic world asset no longer used");


/* R11.5.1 SAFE LIGHTWEIGHT ASSET BRIDGE + ASSET-DRIVEN VISUAL MASTER guard. */
must(css.includes("R11.5.1 Safe Lightweight Asset Bridge Rebase") && css.includes("--vw2-r115-ready:1") && css.includes("--vw2-r1151-ready:1") && css.includes("--vw2-r1152-ready:1") && css.includes("--vw2-r1153-ready:1") && css.includes("--vw2-r1154-ready:1"), "R11.5.4 stylesheet lineage/marker missing");
const r115Assets = [
  "r115_profile_shell.webp",
  "r115_stat_coin.webp",
  "r115_stat_today.webp",
  "r115_stat_online.webp",
  "r115_stat_computer.webp",
  "r115_stat_worth.webp",
  "r115_frame_feed.webp",
  "r115_frame_mission.webp",
  "r115_frame_online.webp",
  "r115_title_plaque.webp",
  "r115_ticker_plaque.webp",
  "r115_nav_frame.webp",
  "r115_nav_racing.webp",
  "r115_hero_world.webp",
  "r115_hero_match.webp",
  "r115_hero_pet.webp",
  "r115_bottom_blue.webp",
  "r115_bottom_pink.webp",
  "r115_bottom_green.webp",
  "r115_bottom_orange.webp",
  "r115_bottom_gold.webp",
  "r115_bottom_lime.webp",
  "r115_bottom_violet.webp",
  "r115_bottom_rose.webp",
  "r115_speech_bubble.webp",
  "r115_pedestal.webp",
  "r115_scene_frame.webp",
  "r115_reward_sign.webp",
  "r115_house_label.webp",
  "r115_clouds.webp",
];
let r115AssetBytes = 0;
r115Assets.forEach(name => {
  const p = path.join(root, "img", "home-v2", name);
  must(fs.existsSync(p), `R11.5 visual asset missing: ${name}`);
  if(fs.existsSync(p)) r115AssetBytes += fs.statSync(p).size;
  must(buildWeb.includes(`img/home-v2/${name}`), `build allowlist missing R11.5 asset: ${name}`);
  must(css.includes(name), `R11.5 stylesheet does not integrate asset: ${name}`);
});
must(r115AssetBytes > 250000 && r115AssetBytes < 700000, `R11.5 asset budget unexpected: ${r115AssetBytes} bytes`);
must(css.includes('r115_profile_shell.webp') && css.includes('r115_stat_coin.webp'), "asset-driven profile/stat skins missing");
must(css.includes('r115_frame_feed.webp') && css.includes('r115_frame_mission.webp') && css.includes('r115_frame_online.webp'), "cohesive Feed/Mission/Online frame family missing");
must(css.includes('r115_title_plaque.webp') && css.includes('r115_ticker_plaque.webp'), "master title/ticker plaques missing");
must(css.includes('r115_nav_frame.webp') && css.includes('r115_nav_racing.webp'), "asset-driven left navigation missing");
must(css.includes('r115_pedestal.webp') && css.includes('r115_speech_bubble.webp') && css.includes('r115_clouds.webp'), "center diorama asset depth recovery missing");
must(css.includes('r115_hero_world.webp') && css.includes('r115_hero_match.webp') && css.includes('r115_hero_pet.webp'), "three hero button skins missing");
must(css.includes('r115_bottom_blue.webp') && css.includes('r115_bottom_violet.webp') && css.includes('r115_bottom_rose.webp'), "collectible bottom-rail skins missing");

/* Structural material system / premium identity HUD. */
must(css.includes('--vw2-pearl:#fffdfd') && css.includes('--vw2-violet-deep:#4e278f') && css.includes('--vw2-gold:#e4b34f'), "R11.4 premium material tokens missing");
must(css.includes('grid-template-rows:clamp(100px,25.5vh,116px)') && css.includes('grid-template-columns:clamp(205px,28.5vw,286px) minmax(0,1fr) clamp(145px,21vw,218px)'), "R11.4 top geometry missing");
must(css.includes('.vw2-profile:before') && css.includes('.vw2-profile:after') && css.includes('.vw2-avatar-frame:before'), "Profile layered material reconstruction incomplete");
must(home.includes('class="vw2-achievement-mark"') && css.includes('.vw2-achievement-mark'), "Profile achievement badge separation missing");
must(css.includes('.vw2-name-row strong{font-size:clamp(16px') || css.includes('.vw2-name-row strong{font-size:clamp(16px,'), "Profile player-name hierarchy too weak");

/* Top stats: coin hierarchy, full values on wide landscape, no important ellipsis. */
must(css.includes('grid-template-columns:minmax(72px,1.28fr) repeat(4,minmax(56px,1fr))'), "R11.4 statistic-card geometry missing");
must(css.includes('.vw2-wallet-pill.coin') && css.includes('.vw2-stat-art-coin') && css.includes('font-variant-numeric:tabular-nums lining-nums'), "coin/stat premium HUD hierarchy missing");
must(home.includes('const wideLandscape = Math.max(window.innerWidth || 0, document.documentElement.clientWidth || 0) >= 820') && home.includes('if(wideLandscape && a < 1e11) return fmt(n)'), "wide-landscape full grouped values rule missing");
must(home.includes("el.dataset.vw2Compact = shown === full ? '0' : '1'"), "top-value compact/full reporting marker missing");
must(/\.vw2-stat-copy b\{[^}]*text-overflow:clip[^}]*font-variant-numeric:tabular-nums/.test(css), "important top values are not protected from ellipsis");
must(!/\.vw2-stat-copy b\{[^}]*text-overflow:ellipsis/.test(css), "important top values can still ellipsize");

/* Utility cluster remains readable and breakpoint-aware. */
must(css.includes('grid-template-columns:repeat(2,minmax(66px,1fr))') && css.includes('.vw2-tool-btn{') && css.includes('min-width:66px'), "utility buttons can collapse into narrow strips");
must(css.includes('@media (min-width:1181px) and (min-height:521px)') && css.includes('grid-template-columns:repeat(3,minmax(68px,1fr))'), "wide-layout utility reflow missing");
must(/\.vw2-tool-btn b\{[^}]*font-size:clamp\(8\.5px/.test(css), "utility label readability floor missing");

/* Title/ticker/pet diorama: major R11.4 fidelity targets. */
must(css.includes('.vw2-feature-title{') && css.includes('linear-gradient(180deg,#a86ddd') && css.includes('r111_kanok_band.svg'), "premium Vocab World title plaque missing");
must(css.includes('.vw2-word-ribbon:before') && css.includes('content:"NEW WORD"') && css.includes('.vw2-word-ribbon:after'), "premium NEW WORD ticker treatment missing");
must(home.includes('class="vw2-stage-depth"') && home.includes('class="vw2-stage-castle"') && home.includes('${castleArtwork()}'), "central environment depth layer missing");
must(home.includes('class="vw2-pedestal-aura"') && css.includes('.vw2-pedestal-aura:before') && css.includes('.vw2-pet-platform:before') && css.includes('.vw2-pet-platform:after'), "multi-layer pet pedestal reconstruction missing");
must(css.includes('.vw2-pet{') && css.includes('width:40%;height:73%'), "pet is not visually dominant enough in the central diorama");
must(home.includes('class="vw2-reward-card"') && css.includes('.vw2-reward-card{') && home.includes('data-vw2-action="trophy"'), "integrated reward sign/action missing");
must(home.includes('class="vw2-house-preview"') && css.includes('.vw2-house-preview{') && home.includes('data-vw2-action="home"'), "integrated house preview/action missing");

/* Readable panels use internal scrolling rather than shrinking functional text. */
must(css.includes('.vw2-feed-items{') && css.includes('overflow-y:auto') && css.includes('.vw2-feed-card{min-height:52px'), "Global Feed readable internal-scroll card geometry missing");
must(css.includes('.vw2-quests{') && css.includes('overflow-y:auto') && css.includes('.vw2-quest-row{flex:0 0 43px'), "Missions internal-scroll/readability reconstruction missing");
must(css.includes('.vw2-online-list{') && css.includes('overflow-y:auto') && css.includes('touch-action:pan-y'), "Online panel scrolling/touch behavior missing");
must(!/font-size:(?:3|4)(?:\.\d+)?px/.test(css), "stylesheet reintroduced 3–4px typography collapse");

/* Profile, avatar persistence delegation and player card. */
must(home.includes('class="vw2-profile vw2-glass vw2-profile-link"') && home.includes('data-vw2-action="profile"'), "Profile interaction target missing");
must(home.includes("typeof showPlayerCard === 'function'") && home.includes("showPlayerCard(uid"), "Profile no longer delegates to authoritative player card");
must(home.includes("typeof openPhotoMenu === 'function'") && home.includes("#pass-photo .pp-cam"), "Avatar editor no longer delegates to authoritative photo upload menu/camera");
must(home.includes("ดาวเงิน · ประถม") && home.includes("ดาวทอง · มัธยม") && home.includes("เพชร 1 ดวง · ปริญญาตรี"), "education identity mapping missing");

/* Left destination inventory + Racing bottom-most. */
const expectedRail = [
  ["cure","#btn-rail-cure"],
  ["city","#btn-rail-city"],
  ["worldAdv","#btn-world-adv"], ["worldSky","#btn-world-sky"],
  ["worldHaunt","#btn-world-haunt"], ["worldHeli","#btn-world-heli"],
  ["worldDrone","#btn-world-drone"], ["worldDrive","#btn-world-drive"],
  ["worldSoccer","#btn-world-soccer"], ["worldMoto","#btn-world-moto"],
  ["worldInvasion","#btn-world-invasion"], ["worldMecha","#btn-world-mecha"],
  ["home",'.lobby-rail [data-panel="panel-home"]'], ["invest",'.lobby-rail [data-panel="panel-farm"]'],
  ["factory",'.lobby-rail [data-panel="panel-factory"]'], ["wordsearch","#btn-rail-wordsearch"],
  ["typing","#btn-rail-typing"], ["bubble","#btn-rail-bubble"], ["shoot","#btn-rail-shootword"],
  ["cannon","#btn-rail-lettercannon"], ["examstd","#btn-rail-examstd"], ["onet","#btn-rail-onet"],
  ["rank","#btn-rail-rank"], ["market",'.lobby-rail [data-panel="panel-market"]'],
  ["friends",'.lobby-rail [data-panel="panel-friends"]'], ["gifts",'.lobby-rail [data-panel="panel-gifts"]'],
  ["stats","#btn-stats"], ["trophy","#btn-rail-trophy"], ["racing",""]
];
const tuplePattern = (action, source) => {
  const esc = x => x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`\\['${esc(action)}','[^']+','[^']+'(?:,'[^']+')?,'${esc(source)}'\\]`);
};
expectedRail.forEach(([action, source]) => must(tuplePattern(action, source).test(home), `left rail marker missing: ${action}`));
const railOrder = expectedRail.map(([action]) => home.indexOf(`['${action}',`));
must(expectedRail.length === 29 && railOrder.every((p, i) => p >= 0 && (!i || p > railOrder[i - 1])), "authoritative left rail order changed");
const semanticRailIcons = [
  ['worldAdv','adventure'],['worldSky','skyplay'],['worldHaunt','ghost'],
  ['worldHeli','helicopter'],['worldDrone','drone'],['worldSoccer','soccer'],
  ['worldMoto','motorcycle'],['worldInvasion','mothership'],['worldMecha','mecha'],
  ['trophy','pinboard']
];
semanticRailIcons.forEach(([action, iconName])=>must(home.includes(`['${action}','${iconName}'`), `left rail icon does not explain its destination: ${action}`));
const adminOnlyWorlds = ["worldAdv","worldSky","worldDrive","worldMoto","worldInvasion","worldMecha"];
const publicWorlds = ["worldHaunt","worldHeli","worldDrone","worldSoccer"];
must(home.includes("const ADMIN_ONLY_WORLD_ACTIONS = new Set") && adminOnlyWorlds.every(action=>home.includes(`'${action}'`)), "R19 exact six-world admin set missing");
must(home.includes("btn.hidden = adminOnly && !adminWorldAllowed()") && home.includes("data-vw2-admin-only-world") && css.includes('data-vw2-admin-only-world="1"]:after'), "R19 future public-view admin hiding/badge guard missing");
must(publicWorlds.every(action=>home.includes(`['${action}',`)) && !publicWorlds.some(action=>adminOnlyWorlds.includes(action)), "R19 public world inventory changed");
must(home.includes("worldAdv:'#btn-world-adv'") && home.includes("worldSky:'#btn-world-sky'") && home.includes("startsWith('world')") && css.includes('data-vw2-action^="world"'), "R19 Classic world parity missing");
must(expectedRail.at(-1)[0] === "racing" && home.includes("typeof enterF1_3D === 'function'") && home.includes("enterF1_3D();"), "Vocab World Racing is not bottom-most / authoritative entry is missing");
must(css.includes('r111_cloud_pedestal.svg') && css.includes('.vw2-rail-art:after') && css.includes('scrollbar-width:none'), "premium cloud/pedestal left rail or hidden-scrollbar behavior missing");
must(/\.vw2-rail-btn\{[\s\S]*?flex:0 0 auto!important;[\s\S]*?min-height:92px!important;[\s\S]*?height:auto!important;[\s\S]*?\}/.test(css), "R19 vertical rail controls cannot grow with longer labels");
must(/\.vw2-rail-label,\.vw2-rail-racing \.vw2-rail-label\{[\s\S]*?min-height:30px!important;[\s\S]*?white-space:normal!important;[\s\S]*?overflow:visible!important;[\s\S]*?text-overflow:clip!important;[\s\S]*?\}/.test(css), "R19 vertical rail two-line caption containment guard missing");
must(expectedRail[0][0] === "cure" && home.indexOf("['cure','heart','รักษา'") < home.indexOf("['city','city','เมือง 3D'"), "R20 cure button is not the first left-rail action");

/* R20 pet actions reuse Classic ownership/rename paths and scroll independently. */
must(home.includes('class="vw2-feature-action-scroll"') && home.includes('class="vw2-feature-action-track"') && home.includes("function setupFeatureActionScroll()") && css.includes("touch-action:pan-x"), "R20 centre pet-action horizontal rail missing");
must(home.includes('data-vw2-action="petRename"') && home.includes('id="vw2-action-pet-name"') && home.includes("typeof renamePet === 'function'") && home.includes("renamePet(pet)"), "R20 active-pet rename button no longer delegates to Classic renamePet");
must(!home.includes('class="vw2-play" data-vw2-action="play"') && home.includes("['play','controller','จับคู่คำศัพท์'"), "R20 centre matching button was not replaced while Bottom Rail matching game was preserved");
must(home.includes('data-vw2-action="ownedPets"') && home.includes('id="vw2-pet-modal-list"') && home.includes("state.active = index") && home.includes("typeof saveState === 'function'") && home.includes("typeof renderDashboard === 'function'"), "R20 purchased-pet chooser does not reuse authoritative Classic state/selection");
must(home.includes('class="vw2-pet-modal-close top"') && home.includes('class="vw2-pet-modal-close bottom"') && css.includes(".vw2-pet-modal-list::-webkit-scrollbar{display:none"), "R20 purchased-pet chooser close/hidden-scrollbar contract missing");

/* R21 one-tap heal-all is atomic, visible and reuses the Classic cure rules. */
must(ui.includes("function applyCureState(") && ui.includes("function cureAllPets()"), "R21 shared Classic heal rule / bulk entry missing");
must(ui.indexOf("if(state.coins < totalCost)") < ui.indexOf("state.coins -= totalCost") && ui.includes("sickPets.forEach(p=>{ if(applyCureState(p, slotNow, now)) hungry++; })"), "R21 heal-all is not atomic or does not apply the shared cure rule to every sick pet");
must(ui.includes("ยังขาด 🪙") && ui.includes("จึงยังไม่ได้รักษาน้องตัวใด") && ui.includes("รักษาน้องครบ"), "R21 heal-all success/insufficient-funds feedback missing");
must(home.includes('id="vw2-heal-all"') && home.includes("data-vw2-heal-all") && home.includes("function healAllOwnedPets()") && home.includes("typeof cureAllPets !== 'function'"), "R21 owned-pet sheet heal-all control is not bound to Classic cureAllPets");
must(home.includes("const sickCount = pets.filter(p=>p && p.sick).length") && home.includes("const totalCost = sickCount * unitCost") && home.includes("const coinShort = Math.max(0, totalCost - coins)") && home.includes("healAll.disabled = sickCount === 0") && home.includes("ขาด 🪙${fmt(coinShort)}"), "R21 heal-all live count/cost/shortfall/disabled state missing");
must(css.includes(".vw2-heal-all.is-ready") && css.includes(".vw2-heal-all:disabled") && css.includes("grid-template-rows:auto auto minmax(0,1fr) auto"), "R21 heal-all visual hierarchy/responsive modal row missing");
must(home.includes("featureActionCount:") && home.includes("featureActionScrollable:") && home.includes("featureActionVerticalOverflow:") && home.includes("layoutProfile:"), "R20 action-rail/device-profile preview metrics missing");
["phone-compact","phone-standard","phone-wide","tablet-landscape"].forEach(profile=>{
  must(home.includes(`profile = '${profile}'`) && css.includes(`data-vw2-layout-profile="${profile}"`), `R20 layout profile missing: ${profile}`);
});

/* Global Feed mirrors real posts, no invented persisted feed. */
must(home.includes("#feed-list .fpost:not(.fp-clone)") && home.includes(".slice(0,5)"), "Global Feed does not mirror authoritative posts");
must(home.includes("photoMiniHTML(fid,'vw2-feed-source-avatar')"), "Global Feed avatar binding missing");
must(home.includes('id="vw2-feed-items"'), "Global Feed presentation target missing");

/* Authoritative pet/house state remains delegated. */
must(home.includes("function currentHouseVisual()") && home.includes("function syncHouseVisual()"), "authoritative current/owned house resolver missing");
must(home.includes("function petStatusText(p)") && home.includes("petStage(p)") && home.includes("p.hunger"), "real pet-state presentation binding missing");
must(home.includes("img/coins/coin_gold.png"), "real coin asset no longer used in statistics");

/* Online friends: authoritative presence + all users + original upward scroll helper. */
must(home.includes("function syncOnlineUsers()"), "authoritative online sync helper missing");
must(home.includes("Online.ready") && home.includes("Online.friends"), "online list is not sourced from authoritative Online presence");
must(home.includes("users.push({id:meUid") && home.includes("for(const f of friends) users.push"), "online list does not include self + all authoritative online friends");
must(home.includes("initSideScroll(host)"), "online list no longer delegates to original upward scroll mechanism");
must(home.includes("photoMiniHTML(uid,'vw2-online-avatar')") && home.includes("gradeMark(resolved, 'vw2-online-grade')"), "online avatar/rank bindings missing");
must(home.includes("openFriendQuickMenu") && home.includes("showPlayerCard"), "online-player row interaction no longer delegates to authoritative menu/profile");
must(!/firebase\s*\.\s*database\s*\(/.test(home) && !/\.ref\s*\(\s*['"]\/?presence/.test(home), "Home V2 must not duplicate Firebase presence implementation");

/* Mission/stat/action bindings stay authoritative. */
["vw2-coins","vw2-today","vw2-online-earn","vw2-comp-earn","vw2-worth","vw2-quest-count","vw2-quest-bar","vw2-quests","vw2-online-count"].forEach(id => must(home.includes(`id="${id}"`), `binding missing: ${id}`));
must(home.includes("typeof questsToday === 'function'") && home.includes("state.quests"), "mission logic binding changed");
must(home.includes("textOf('#clock-chip .ck-date'") && home.includes("textOf('#rank-tab'"), "Profile date/rank source binding changed");

/* R24 restores the complete legacy inventory to one cute horizontal row. */
const expectedBottom = ["vocabbook","ielts","toeic","toefl","onetp6","onetm3","onetm6","cats","play","picmatch","picdict","picquiz","bandexam"];
const bottomOrder = expectedBottom.map(action => home.indexOf(`['${action}',`));
must(expectedBottom.length === 13 && bottomOrder.every((p, i) => p >= 0 && (!i || p > bottomOrder[i - 1])), "accepted bottom rail inventory/order changed");
must(home.includes("const learningModeButtons = learningModes.map") && home.includes('class="vw2-bottom-track">${learningModeButtons}'), "R24 complete learning inventory is not rendered in the single row");
must(!home.includes('id="vw2-adventure-menu"') && !home.includes("function setAdventureMenu") && !home.includes("function toggleAdventureMenu") && !home.includes("adventureDockButtons") && !home.includes("adventureMenus"), "R24 pet-obscuring flyout still exists in runtime");
must(css.includes("CUTE SINGLE-ROW LEARNING RAIL") && css.includes("grid-template-columns:repeat(13,minmax(138px,9.7vw))!important") && css.includes("grid-template-rows:minmax(0,1fr)!important") && css.includes("grid-auto-flow:column!important"), "R24 cute single-row visual contract missing");
must(css.includes(".vw2-adventure-menu{display:none!important}") && css.includes(".vw2-bottom-track .vw2-mode>span{") && css.includes("background-image:none!important"), "R24 no-flyout/new-button skin guard missing");
must(home.includes("if(!allowed)") && home.includes("if(!showV2) closeOwnedPetsModal();"), "R24 admin visibility guard missing");
must(css.includes("BOTTOM GEOMETRY RESET") && css.includes("transform:none!important;translate:none!important") && css.includes("height:auto!important;min-height:0!important"), "R25 inherited icon/label geometry is not fully reset");
must(home.includes("frame?.classList.toggle('can-scroll-right'") && css.includes(".vw2-bottom.can-scroll-left:before,.vw2-bottom.can-scroll-right:after"), "R25 horizontal scroll affordance missing");
must(home.includes("bottomIconMaxCenterErrorPx:") && home.includes("bottomLabelMaxCenterErrorPx:") && home.includes("bottomScrollCueCorrect:"), "R25 alignment/cue preview metrics missing");
must(css.includes("FULL-CARD PAGED LEARNING RAIL") && css.includes("scroll-snap-type:x mandatory!important") && css.includes("scroll-padding-inline:0!important") && css.includes("scroll-snap-stop:always!important"), "R26 whole-card paging/snap contract missing");
['calc((100cqw - 36px)/7)','calc((100cqw - 25px)/6)','calc((100cqw - 20px)/5)','calc((100cqw - 12px)/4)'].forEach(formula=>must(css.includes(formula), `R26 responsive whole-card formula missing: ${formula}`));
must(css.includes("grid-template-columns:24px minmax(0,1fr) 24px!important") && css.includes("padding:3px 0!important") && home.includes("bottomWholeCardPageAligned:") && home.includes("bottomPartiallyVisibleActions") && home.includes("bottomFullyVisibleActionCount"), "R26 separate cue columns / whole-card evidence metrics missing");
must(!css.includes("R26 / รอบ 1295 — FULL-CARD PAGED LEARNING RAIL") || css.lastIndexOf("scroll-snap-align:start!important") > css.lastIndexOf("scroll-snap-align:none!important"), "R26 whole-card snap is not the final rail authority");
must(css.includes("R11.5.3 BOTTOM RAIL GEOMETRY RESTORE + WRAPPER-ONLY SCROLL"), "R11.5.3 wrapper-only Bottom Rail architecture was lost");
must(css.includes("R11.5.4 EVIDENCE-DRIVEN GEOMETRY CORRECTION"), "R11.5.4 geometry-correction marker missing");
must(home.includes('class="vw2-bottom-scroll"') && home.includes('class="vw2-bottom-track"'), "static outer rail / inner scroll wrapper markup missing");
must(/\.vw2-bottom\{[\s\S]*?display:block!important;[\s\S]*?overflow:hidden!important;[\s\S]*?\}/.test(css), "outer Bottom Rail is not a static clipped frame");
must(/\.vw2-bottom-scroll\{[\s\S]*?overflow-x:auto!important;[\s\S]*?overflow-y:hidden!important;[\s\S]*?touch-action:pan-x;[\s\S]*?\}/.test(css), "inner Bottom Rail scroll wrapper behavior missing");
must(css.includes('grid-template-columns:repeat(13,minmax(104px,8.4vw))') && css.includes('width:max-content') && css.includes('grid-template-columns:repeat(13,96px)'), "R12 Classic-like horizontal Bottom Rail width/scroll geometry missing");
must(!css.includes('flex:0 0 clamp(142px') && !css.includes('min-width:122px!important'), "R11.5.2 oversized Bottom Rail width geometry still present");
must(css.includes('grid-template-rows:clamp(100px,25.5vh,110px) minmax(0,1fr) clamp(56px,14vh,60px)'), "R11.5.4 mobile Bottom Rail vertical budget missing");
must(css.includes('grid-template-rows:100px minmax(0,1fr) 56px') && !css.includes('grid-template-rows:100px minmax(0,1fr) 42px'), "R11.5.4 max-height:390 Bottom Rail vertical recovery missing");
must(home.includes("function setupBottomRailScroll()") && home.includes("root.querySelector('.vw2-bottom-scroll')") && home.includes("rail.scrollLeft = next") && home.includes("setupBottomRailScroll();"), "Bottom Rail input support is not attached to the inner wrapper");
must(css.includes("scroll-snap-type:none") && css.includes("scroll-snap-align:none"), "Bottom Rail must not snap wheel/touch scrolling back to the first button");
must(css.includes('.vw2-left{padding-bottom:30px!important') && css.includes('.vw2-rail-racing{scroll-margin-bottom:26px}') && css.includes('.vw2-left-scroll-cue{bottom:0!important}'), "R11.5.4 Left Navigation bottom-clearance/internal-scroll correction missing");
must(css.includes('z-index:20!important') && css.includes('.vw2-friends-btn') && css.includes('white-space:nowrap!important') && css.includes('.vw2-online-list{bottom:39px!important}'), "R11.5.4 Online Friends footer containment correction missing");
must(home.includes('function syncRewardPlaque()') && home.includes("textOf('#rank-tab','')") && home.includes("card.dataset.vw2AuthoritativeInfo") && !home.includes('สะสมดาวและปลดล็อกเกียรติยศ'), "R11.5.4 authoritative Center World reward plaque correction missing / fake copy remains");
must(/\.vw2-mode\{[^}]*font-size:clamp\(8px/.test(css) && css.includes('font-size:clamp(8.5px,1.02vw,10px)!important'), "R11.5.4 compact/readable bottom rail label scale missing");

/* Mobile landscape targets + regression metrics. */
["915", "844", "800", "667"].forEach(w => must(preview.includes(w), `mobile preview device width missing: ${w}`));
["412", "390", "360", "375"].forEach(h => must(preview.includes(h), `mobile preview device height missing: ${h}`));
must(css.includes("@media (max-width:1180px),(max-height:520px)") && css.includes("@media (max-width:760px)") && css.includes("@media (max-height:390px)"), "R11.4 mobile landscape breakpoints missing");
must(home.includes("pageOverflow:") && home.includes("pageHorizontalOverflow:") && home.includes("outerBottomRailContained:") && home.includes("bottomScrollWrapperScrollable:") && home.includes("bottomScrollWrapperVerticalOverflow:") && home.includes("singleRowLearningModesPresent:") && home.includes("all13BottomActionsPresent:") && home.includes("adventureFlyoutPresent:") && home.includes("bottomButtonGeometryStable"), "R24 local single-row learning-rail metrics missing");
must(home.includes("clippingOffenders:") && home.includes("bottomClipOffenders") && home.includes("bottomMinButtonHeightPx:") && home.includes("leftBottomCollision:") && home.includes("leftLastAction:") && home.includes("onlineFooterContained") && home.includes("importantTextBelow14:") && home.includes("extremeInteractiveAspectElements:") && home.includes("rewardPlaque:"), "R11.5.4 precise Geometry Guard evidence metrics missing");
must(home.includes("minReadableFontPx:") && home.includes("importantValueClipped"), "R11.4 readability/value-clipping preview metrics missing");
must(home.includes("width <= 700 || height <= 390") && home.includes("width <= 850 || height <= 430") && home.includes("width <= 960 || height <= 500") && home.includes("width <= 1180 || height <= 600"), "R20 device profile width/height coverage missing");
must(css.includes("overflow:hidden") && css.includes("overscroll-behavior:contain"), "page/rail overflow containment missing");

/* Transient notification safety. */
must(home.includes("document.body.classList.toggle('vw2-home-active', showV2)") && home.includes("document.body.classList.remove('vw2-home-active')"), "Home V2 body-scope class for transient UI safety missing");
must(css.includes('body.vw2-home-active .toast') && css.includes('bottom:auto'), "compact safe-zone toast presentation missing");

/* Admin-only safety. */
must(home.includes("function adminAllowed()") && home.includes("typeof isAdmin === 'function' && isAdmin() === true"), "ADMIN PREVIEW gate changed/missing");
must(!home.includes("firebase deploy") && !home.includes("deploy production"), "Home V2 source contains unexpected deployment action");

if(fail.length){
  console.error("Home V2 R11.5.4 validation FAILED:\n- " + fail.join("\n- "));
  process.exit(1);
}
console.log("Home V2 R30 / รอบ 1309 validation PASS");
console.log(`Checked profile/feed edge alignment, enlarged rectangular portrait frame, wide swipeable pet actions, bottom-aligned and auto-flowing Global Feed, clean New Word/speech hierarchy, caption-free house art, ${expectedRail.length} left destinations, all ${expectedBottom.length} learning actions, and admin gate.`);
