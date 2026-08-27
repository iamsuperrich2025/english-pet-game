"use strict";

const fs = require("fs");

const path = require("path");

const root = path.resolve(__dirname, "..");

const home = fs.readFileSync(path.join(root, "js", "home-v2.js"), "utf8");

const css = fs.readFileSync(path.join(root, "css", "home-v2.css"), "utf8");

const preview = fs.readFileSync(path.join(root, "tools", "VW_MOBILE_DEVICE_PREVIEW.html"), "utf8");

const indexClassic = fs.readFileSync(path.join(root, "index_classic.html"), "utf8");

const buildWeb = fs.readFileSync(path.join(root, "tools", "build_web.mjs"), "utf8");

const fail = [];

const must = (ok, msg) => { if(!ok) fail.push(msg); };



/* R10 premium cute structural visual-master guard. */

must(home.includes("R10.2a UTF-8 Safe Direct Visual Fidelity Correction"), "R10 Home V2 JS marker missing");

must(css.includes("Home V2 R10.2a UTF-8 Safe Direct Visual Fidelity Correction"), "R10 consolidated stylesheet missing");

must(!css.includes("Home V2 R8 Visual Master Convergence"), "R8 presentation stylesheet header survived R9 consolidation");

must(home.includes('class="vw2-screen-backdrop"') && home.includes('r10_screen_backdrop.svg'), "R10 global illustrated backdrop markup missing");

must(css.includes('url("data:image/webp;base64,'), "R10.2a embedded approved master-world asset is not used by the center scene");

must(css.includes('url("../img/home-v2/r10_cloud_pedestal.svg")') && css.includes('mask:url("../img/home-v2/r10_cloud_pedestal.svg")'), "R10 cloud/pedestal destination rail asset mask missing");

["r10_screen_backdrop.svg","r10_pet_world.svg","r10_cloud_pedestal.svg"].forEach(name=>{
  must(fs.existsSync(path.join(root,"img","home-v2",name)), `R10 visual asset missing: ${name}`);
  must(buildWeb.includes(`img/home-v2/${name}`), `R10 build allowlist missing: ${name}`);
});

must(indexClassic.includes("css/home-v2.css?v=1212") && indexClassic.includes("js/home-v2.js?v=1212"), "R10 Home V2 cache-bust version missing from index_classic.html");

must(home.includes('ADMIN PREVIEW · R10.2a MASTER FIDELITY'), "R10 visible admin-preview marker missing");

must(home.includes('class="vw2-avatar-frame"'), "premium avatar frame missing");

must(home.includes('class="vw2-house-preview"'), "authoritative house preview missing");

must(home.includes('class="vw2-feature-stage"'), "cohesive hero scene missing");

must(!home.includes('class="vw2-player-mini"'), "small user portrait must not return inside the pet scene");

must(home.includes('class="vw2-rail-art"') && home.includes('class="vw2-rail-label"'), "illustrated left rail wrappers missing");

must(css.includes("scrollbar-width:none!important"), "left rail hidden-scrollbar rule missing");

must(home.includes("function updateLeftRailCue()"), "left rail scroll cue state helper missing");

must(home.includes(".i-pink{fill:#ff82ba") || css.includes(".i-pink{fill:#ff82ba"), "accepted pastel SVG palette changed; black fallback icons could return");

must(css.includes("Explicit styling prevents browser-default black silhouettes"), "black-icon regression guard missing from CSS");

must(css.includes("grid-template-columns:clamp(60px,8.8vw,90px) clamp(108px,18.6vw,190px)"), "R10 visual-master main-column proportions missing");

must(css.includes("font-size:clamp(14px,3.2vh,20px)") && css.includes(".vw2-profile-meta-chip.class b{font-size:9.6px}"), "R10 mobile profile typography hierarchy missing");

must(css.includes(".vw2-stage-cloud,#vw-home-v2-root .vw2-rainbow") && css.includes("display:none!important"), "legacy CSS/vector center scenery was not retired behind R9 illustrated world asset");

must(css.includes("vw2-house-backdrop:after") && css.includes('content:"";display:none'), "authoritative in-world house treatment / no fake empty-house icon missing");

must(css.includes("min-height:clamp(35px,7.5vh,44px)") && css.includes("height:9px;flex-basis:9px") && css.includes("font-size:clamp(7.4px,1.6vh,9.2px)"), "R10 mission/friend mobile readability treatment missing");

must(css.includes("vw2-feed-card") && css.includes("grid-template-columns:clamp(30px,7vh,40px) minmax(0,1fr)") && css.includes("-webkit-line-clamp:6"), "R10 Global Feed mobile presentation rebuild missing");

must(home.includes("pageOverflow:") && home.includes("bottomContained:"), "local mobile overflow/locked-bottom runtime metrics missing");

must(home.includes("--vw2-r10-runtime-ready:1") && !home.includes("Home V2 R8 Visual Master Convergence + Mobile-First Composition Pass"), "R10 did not preserve consolidated runtime stylesheet architecture");


/* Authoritative state/binding guards. */

must(home.includes("function currentHouseVisual()"), "authoritative house visual resolver missing");

must(home.includes("function syncHouseVisual()"), "authoritative house visual sync helper missing");

must(home.includes('id="vw2-house-visual"'), "authoritative house visual DOM target missing");

must(home.includes('id="vw2-house-label"'), "authoritative house label binding missing");

must(home.includes("img/coins/coin_gold.png"), "real gold coin asset is not used by Home V2 statistics");

must(home.includes('id="vw2-date"'), "profile DATE field missing");

must(home.includes("textOf('#clock-chip .ck-date'"), "profile DATE is not sourced from the authoritative clock chip");

must(home.includes('id="vw2-coins"') && home.includes('id="vw2-today"') && home.includes('id="vw2-online-earn"') && home.includes('id="vw2-comp-earn"') && home.includes('id="vw2-worth"'), "top statistic bindings changed/missing");

must(home.includes('id="vw2-feed-text"') && home.includes('id="vw2-feed-likes"'), "Global Feed bindings changed/missing");

must(home.includes('id="vw2-quest-count"') && home.includes('id="vw2-quest-bar"') && home.includes('id="vw2-quests"'), "mission bindings changed/missing");

must(home.includes('id="vw2-online-count"') && home.includes('id="vw2-online-name"') && home.includes('id="vw2-online-text"'), "friend/online bindings changed/missing");



/* SOURCE MARKER GUARD — complete baseline lists preserved from CURRENT AFTER-R7 task state. */

const expectedRail = [

  ["city","#btn-rail-city"], ["shop","#tab-addpet"], ["cure","#btn-rail-cure"],

  ["home",'.lobby-rail [data-panel="panel-home"]'], ["invest",'.lobby-rail [data-panel="panel-farm"]'],

  ["factory",'.lobby-rail [data-panel="panel-factory"]'], ["wordsearch","#btn-rail-wordsearch"],

  ["typing","#btn-rail-typing"], ["bubble","#btn-rail-bubble"], ["shoot","#btn-rail-shootword"],

  ["cannon","#btn-rail-lettercannon"], ["examstd","#btn-rail-examstd"], ["onet","#btn-rail-onet"],

  ["rank","#btn-rail-rank"], ["market",'.lobby-rail [data-panel="panel-market"]'],

  ["friends",'.lobby-rail [data-panel="panel-friends"]'], ["gifts",'.lobby-rail [data-panel="panel-gifts"]'],

  ["stats","#btn-stats"], ["trophy","#btn-rail-trophy"]

];

const expectedBottom = [

  ["vocabbook","#btn-vocab-book"], ["ielts",'.lobby-bottom [data-xstd="ielts"]'],

  ["toeic",'.lobby-bottom [data-xstd="toeic"]'], ["toefl",'.lobby-bottom [data-xstd="toefl"]'],

  ["onetp6",'.lobby-bottom [data-xstd="onetp6"]'], ["onetm3",'.lobby-bottom [data-xstd="onetm3"]'],

  ["onetm6",'.lobby-bottom [data-xstd="onetm6"]'], ["cats","#btn-cats"], ["play","#btn-play"],

  ["picmatch","#btn-picmatch"], ["picdict","#btn-picdict"], ["picquiz","#btn-picquiz"], ["bandexam","#btn-band-exam"]

];

const expectedTop = [

  ["chat","#btn-chat"], ["music","#btn-music"], ["night","#btn-night"], ["settings","#btn-settings"],

  ["install","#btn-install-top"], ["logout","#btn-logout"], ["classic",""]

];

const tuplePattern = (action, source) => {

  const esc = x => x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  return new RegExp(`\\['${esc(action)}','[^']+','[^']+'(?:,'[^']+')?,'${esc(source)}'\\]`);

};

expectedRail.forEach(([action,source]) => must(tuplePattern(action,source).test(home), `left rail marker baseline missing: ${action} -> ${source}`));

expectedBottom.forEach(([action,source]) => must(tuplePattern(action,source).test(home), `bottom rail marker baseline missing: ${action} -> ${source}`));

expectedTop.forEach(([action,source]) => {

  if(action === "classic") must(home.includes("toolButton('classic','back','Classic','vw2-classic')"), "top utility baseline missing: classic");

  else must(home.includes(`toolButton('${action}'`) && home.includes(`'${source}'`), `top utility marker baseline missing: ${action} -> ${source}`);

});

must(expectedRail.length === 19, "left rail baseline count changed");

must(expectedBottom.length === 13, "bottom rail baseline count changed");

must(expectedTop.length === 7, "top utility baseline count changed");

/* CURRENT authoritative runtime marker totals preserved by R9.
   44 action markers = coin 1 + top utilities 7 + left rail 19 + feed Classic 1 + center primary 2 + friends 1 + bottom rail 13.
   42 source markers = coin 1 + sourced top utilities 6 + left rail 19 + center primary 2 + friends 1 + bottom rail 13. */
const expectedActionMarkerCount = 44;
const expectedSourceMarkerCount = 42;
must(1 + expectedTop.length + expectedRail.length + 1 + 2 + 1 + expectedBottom.length === expectedActionMarkerCount, "data-vw2-action runtime baseline count changed");
must(1 + expectedTop.filter(([,source]) => source).length + expectedRail.length + 2 + 1 + expectedBottom.length === expectedSourceMarkerCount, "data-vw2-source runtime baseline count changed");

const expectedCenterPrimary = [
  ["city","#btn-rail-city"],
  ["play","#btn-play"]
];
must(expectedCenterPrimary.length === 2, "center primary mapping baseline count changed");

must(home.includes('data-vw2-action="rank" data-vw2-source="#btn-rail-rank"'), "coin/rank source marker changed");

must(home.includes('data-vw2-action="city" data-vw2-source="#btn-rail-city"'), "primary center city marker changed");

must(home.includes('data-vw2-action="play" data-vw2-source="#btn-play"'), "primary center play marker changed");

must(home.includes('data-vw2-action="friends" data-vw2-source=".lobby-rail [data-panel=&quot;panel-friends&quot;]"'), "friends marker changed");

must(home.includes("data-vw2-action=\"${htmlEscape(actionName)}\""), "dynamic action marker generator missing");

must(home.includes("data-vw2-source=\"${htmlEscape(sourceSelector)}\""), "dynamic source marker generator missing");



/* Functional source delegation remains authoritative. */

must(home.includes('clickExisting(`.lobby-rail [data-panel="${panelId}"]`, {classicFirst:true})'), "Classic Lobby panel delegation changed/missing");

must(home.includes("el.click();"), "existing-element delegation click missing");

must(home.includes("if(name === 'shop'){ openPetShop(); return; }"), "pet shop delegation changed/missing");

must(home.includes("if(standards[name]){ clickExisting(`.lobby-bottom [data-xstd=\"${standards[name]}\"]`); return; }"), "standard-button delegation changed/missing");



/* Accepted bottom rail look + fixed mobile landscape composition. */

must(css.includes("grid-template-columns:repeat(13,minmax(0,1fr))!important"), "accepted 13-button bottom rail layout missing");

must(css.includes("#62dcff 0%,#2f9df2 54%,#2373d7 100%"), "accepted saturated blue bottom button material missing");

must(css.includes("#ffe66f 0%,#ffaf31 48%,#f06b37 100%"), "accepted primary game CTA material missing");

must(css.includes("#vw-home-v2-root .vw2-top{grid-row:1!important"), "mobile top row pin missing");

must(css.includes("#vw-home-v2-root .vw2-main-grid{grid-row:2!important"), "mobile main row pin missing");

must(css.includes("#vw-home-v2-root .vw2-bottom{grid-row:3!important"), "mobile bottom row pin missing");

must(css.includes("display:flex!important;grid-column:2!important;grid-row:1!important;height:100%!important"), "Global Feed is not restored in fixed mobile composition");

must(css.includes("grid-column:3!important;grid-row:1!important;height:100%!important"), "hero feature is not in mobile column 3");

must(css.includes("grid-column:4!important;grid-row:1!important;height:100%!important"), "right panels are not in mobile column 4");

must(!css.includes("#vw-home-v2-root .vw2-feed{display:none!important}"), "mobile rules still hide Global Feed");

must(css.includes("overflow:hidden!important;overscroll-behavior:none!important"), "root/shell locked overflow rule missing");



/* Local device preview contract. */

must(home.includes("vw-mobile-device-preview-metrics"), "local preview runtime metrics missing");

[[667,375],[800,360],[844,390],[915,412]].forEach(([w,h])=>must(preview.includes(`[${w},${h}]`), `preview preset ${w}x${h} missing`));

must(preview.includes("let selected=3"), "iQOO-style 915x412 is not the default preset");

must(preview.includes("iQOO-style 20:9") && preview.includes("i===3?`${w}×${h} · iQOO-style`"), "clearly labeled iQOO-style landscape preset missing");

must(preview.includes("iframe.style.width=w+'px'"), "iframe logical width is not assigned directly");

must(preview.includes("iframe.style.height=h+'px'"), "iframe logical height is not assigned directly");

must(preview.includes("Left scrollbar hidden"), "preview hidden-scrollbar check missing");

must(preview.includes("Down-arrow scroll cue"), "preview scroll-cue check missing");

must(preview.includes("No page scrollbar"), "preview page-scrollbar check missing");

must(preview.includes("Bottom rail contained"), "preview accepted-bottom-rail containment check missing");

must(!preview.includes("zoom:"), "preview must not use CSS/browser zoom");



if(fail.length){ console.error("FAIL\n- " + fail.join("\n- ")); process.exit(1); }

console.log("PASS Home V2 R10 premium cute visual-master structure + richer fantasy world asset + one-row top utilities + compact cloud rail + premium profile/feed/quest/friend hierarchy + locked coin/bottom rail + authoritative bindings + exact mobile landscape/iQOO-style preview checks");


// R10.2a UTF-8-safe current-source direct-fidelity guard
{
  must(css.includes('data:image/webp;base64,'), 'R10.2a embedded approved master-world asset missing from CSS');
  must(!css.includes('r10_master_world_clean.webp'), 'R10.2a must not depend on a binary patch file');
  must(home.includes('vw2-feed-items') && home.includes('feedCardsFromAuthoritativeSource'), 'R10.2a real multi-card Global Feed presentation missing');
  must(home.includes('id="vw2-feed-text"') && home.includes('id="vw2-feed-likes"'), 'R10.2a legacy feed binding IDs were not preserved');
  must(css.includes('.vw2-pet-platform{opacity:0!important}'), 'R10.2a duplicate live pedestal suppression missing');
}
