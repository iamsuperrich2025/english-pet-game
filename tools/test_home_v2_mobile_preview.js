"use strict";

const fs = require("fs");
const path = require("path");
const root = path.resolve(__dirname, "..");
const read = (...p) => fs.readFileSync(path.join(root, ...p), "utf8");
const home = read("js", "home-v2.js");
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
must(home.includes("ADMIN PREVIEW · R11.5.3 BOTTOM RAIL RESTORED"), "R11.5.3 visible ADMIN PREVIEW marker missing");
must(indexClassic.includes("css/home-v2.css?v=1222") && indexClassic.includes("js/home-v2.js?v=1222"), "R11.5.3 cache-bust missing from index_classic.html");

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
must(home.includes('r111_pet_world_scene.svg'), "authoritative scenic world asset no longer used");


/* R11.5.1 SAFE LIGHTWEIGHT ASSET BRIDGE + ASSET-DRIVEN VISUAL MASTER guard. */
must(css.includes("R11.5.1 Safe Lightweight Asset Bridge Rebase") && css.includes("--vw2-r115-ready:1") && css.includes("--vw2-r1151-ready:1") && css.includes("--vw2-r1152-ready:1") && css.includes("--vw2-r1153-ready:1"), "R11.5.3 stylesheet lineage/marker missing");
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
  ["city","#btn-rail-city"], ["cure","#btn-rail-cure"],
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
must(expectedRail.length === 19 && railOrder.every((p, i) => p >= 0 && (!i || p > railOrder[i - 1])), "authoritative left rail order changed");
must(expectedRail.at(-1)[0] === "racing" && home.includes("typeof enterF1_3D === 'function'") && home.includes("enterF1_3D();"), "Vocab World Racing is not bottom-most / authoritative entry is missing");
must(css.includes('r111_cloud_pedestal.svg') && css.includes('.vw2-rail-art:after') && css.includes('scrollbar-width:none'), "premium cloud/pedestal left rail or hidden-scrollbar behavior missing");

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

/* Bottom horizontal rail is inventory/order locked and remains readable. */
const expectedBottom = ["vocabbook","ielts","toeic","toefl","onetp6","onetm3","onetm6","cats","play","picmatch","picdict","picquiz","bandexam"];
const bottomOrder = expectedBottom.map(action => home.indexOf(`['${action}',`));
must(expectedBottom.length === 13 && bottomOrder.every((p, i) => p >= 0 && (!i || p > bottomOrder[i - 1])), "accepted bottom rail inventory/order changed");
must(css.includes("R11.5.3 BOTTOM RAIL GEOMETRY RESTORE + WRAPPER-ONLY SCROLL"), "R11.5.3 bottom rail architecture marker missing");
must(home.includes('class="vw2-bottom-scroll"') && home.includes('class="vw2-bottom-track"'), "static outer rail / inner scroll wrapper markup missing");
must(/\.vw2-bottom\{[\s\S]*?display:block!important;[\s\S]*?overflow:hidden!important;[\s\S]*?\}/.test(css), "outer Bottom Rail is not a static clipped frame");
must(/\.vw2-bottom-scroll\{[\s\S]*?overflow-x:auto!important;[\s\S]*?overflow-y:hidden!important;[\s\S]*?touch-action:pan-x;[\s\S]*?\}/.test(css), "inner Bottom Rail scroll wrapper behavior missing");
must(css.includes('grid-template-columns:repeat(13,max(72px,calc((100% - 36px)/13)))') && css.includes('grid-template-columns:repeat(13,max(72px,calc((100% - 24px)/13)))'), "R11.5.1-derived equal-column geometry + narrow anti-squeeze floor missing");
must(!css.includes('flex:0 0 clamp(142px') && !css.includes('min-width:122px!important') && !css.includes('grid-template-rows:100px minmax(0,1fr) 46px'), "R11.5.2 oversized Bottom Rail geometry still present");
must(css.includes('grid-template-rows:100px minmax(0,1fr) 42px'), "R11.5.1 max-height:390 Bottom Rail height was not restored");
must(home.includes("function setupBottomRailScroll()") && home.includes("root.querySelector('.vw2-bottom-scroll')") && home.includes("rail.scrollLeft += e.deltaY") && home.includes("setupBottomRailScroll();"), "Bottom Rail input support is not attached to the inner wrapper");
must(/\.vw2-mode\{[^}]*font-size:clamp\(8px/.test(css), "R11.5.1 bottom rail label scale missing");

/* Mobile landscape targets + regression metrics. */
["915", "844", "800", "667"].forEach(w => must(preview.includes(w), `mobile preview device width missing: ${w}`));
["412", "390", "360", "375"].forEach(h => must(preview.includes(h), `mobile preview device height missing: ${h}`));
must(css.includes("@media (max-width:1180px),(max-height:520px)") && css.includes("@media (max-width:760px)") && css.includes("@media (max-height:390px)"), "R11.4 mobile landscape breakpoints missing");
must(home.includes("pageOverflow:") && home.includes("pageHorizontalOverflow:") && home.includes("outerBottomRailContained:") && home.includes("bottomScrollWrapperScrollable:") && home.includes("bottomScrollWrapperVerticalOverflow:") && home.includes("all13BottomActionsPresent:") && home.includes("bottomButtonGeometryStable"), "R11.5.3 local mobile Bottom Rail metrics missing");
must(home.includes("minReadableFontPx:") && home.includes("importantValueClipped"), "R11.4 readability/value-clipping preview metrics missing");
must(css.includes("overflow:hidden") && css.includes("overscroll-behavior:contain"), "page/rail overflow containment missing");

/* Transient notification safety. */
must(home.includes("document.body.classList.toggle('vw2-home-active', showV2)") && home.includes("document.body.classList.remove('vw2-home-active')"), "Home V2 body-scope class for transient UI safety missing");
must(css.includes('body.vw2-home-active .toast') && css.includes('bottom:auto'), "compact safe-zone toast presentation missing");

/* Admin-only safety. */
must(home.includes("function adminAllowed()") && home.includes("typeof isAdmin === 'function' && isAdmin() === true"), "ADMIN PREVIEW gate changed/missing");
must(!home.includes("firebase deploy") && !home.includes("deploy production"), "Home V2 source contains unexpected deployment action");

if(fail.length){
  console.error("Home V2 R11.5.3 validation FAILED:\n- " + fail.join("\n- "));
  process.exit(1);
}
console.log("Home V2 R11.5.3 validation PASS");
console.log(`Checked R11.5.3 wrapper-only Bottom Rail scroll + R11.5.1 geometry recovery, R11.5.1 asset-driven fantasy skins (${r115Assets.length} optimized assets / ${r115AssetBytes} bytes), pet diorama depth, ${expectedRail.length} left destinations, ${expectedBottom.length} bottom actions, authoritative bindings, and mobile landscape guards.`);
