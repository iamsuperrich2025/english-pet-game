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

/* R11.1 VISUAL MASTER FIDELITY RESCUE + authoritative behavior guard. */
must(home.includes("R11.1 Visual Master Fidelity Rescue + Composition Recovery"), "R11.1 Home V2 JS marker missing");
must(css.includes("R11.1 Visual Master Fidelity Rescue + Composition Recovery") && css.includes("--vw2-r111-ready:1"), "R11.1 consolidated stylesheet/marker missing");
must(home.includes("--vw2-r111-runtime-ready:1"), "R11.1 runtime marker missing");
must(home.includes("ADMIN PREVIEW · R11.1 VISUAL MASTER FIDELITY RESCUE"), "R11.1 visible ADMIN PREVIEW marker missing");
must(indexClassic.includes("css/home-v2.css?v=1217") && indexClassic.includes("js/home-v2.js?v=1217"), "R11.1 cache-bust missing from index_classic.html");

const r111Assets = [
  "r111_screen_frame.svg",
  "r111_pet_world_scene.svg",
  "r111_cloud_pedestal.svg",
  "r111_kanok_corner.svg",
  "r111_kanok_band.svg"
];
r111Assets.forEach(name => {
  must(fs.existsSync(path.join(root, "img", "home-v2", name)), `R11.1 visual asset missing: ${name}`);
  must(buildWeb.includes(`img/home-v2/${name}`), `R11.1 build allowlist missing: ${name}`);
});
must(!css.includes("data:image/webp;base64,"), "R11.1 CSS must not embed giant base64 WebP imagery");
const scenicAsset = read("img", "home-v2", "r111_pet_world_scene.svg");
must(scenicAsset.includes("data:image/webp;base64,") && scenicAsset.length < 80000, "R11.1 UTF-8 scenic wrapper must contain one compact optimized WebP raster payload");
must(css.includes('r111_kanok_corner.svg') && css.includes('r111_kanok_band.svg') && home.includes('r111_screen_frame.svg'), "R11.1 refined Kanok / thin frame assets not wired into presentation");
must(home.includes('r111_pet_world_scene.svg') && !home.includes('src="img/home-v2/r11_pet_world.svg"'), "R11.1 detailed scenic raster did not replace the rejected flat center-world SVG");
must(css.includes('.vw2-profile:after') && css.includes('.vw2-feed:before') && css.includes('.vw2-mission:before') && css.includes('.vw2-online:before'), "R11.1 refined Kanok placement is incomplete across major panels");
must(css.includes('.vw2-main-grid{grid-row:2') && css.includes('.vw2-top{grid-row:1'), "R11.1 structural Profile -> main separation missing");

/* Profile, avatar persistence delegation and player card. */
must(home.includes('class="vw2-profile vw2-glass vw2-profile-link"') && home.includes('data-vw2-action="profile"'), "R11 Profile interaction target missing");
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
must(css.includes("scrollbar-width:none") && css.includes(".vw2-left::-webkit-scrollbar"), "left rail hidden-scrollbar behavior missing");

/* Global Feed mirrors real posts, no invented persisted feed. */
must(home.includes("#feed-list .fpost:not(.fp-clone)") && home.includes(".slice(0,5)"), "Global Feed does not mirror multiple authoritative posts");
must(home.includes("photoMiniHTML(fid,'vw2-feed-source-avatar')"), "Global Feed avatar binding missing");
must(home.includes('id="vw2-feed-items"') && css.includes('.vw2-feed-items'), "Global Feed presentation target missing");

/* Center pet/house world is one integrated scene and delegates actions. */
must(home.includes('r111_pet_world_scene.svg') && home.includes('class="vw2-pet-platform"') && home.includes('class="vw2-stage-copy"'), "R11.1 integrated pet showcase missing");
must(home.includes('class="vw2-reward-card"') && home.includes('data-vw2-action="trophy"'), "authoritative reward sign action missing");
must(home.includes('class="vw2-house-preview"') && home.includes('data-vw2-action="home"'), "authoritative house preview action missing");
must(home.includes("function currentHouseVisual()") && home.includes("function syncHouseVisual()"), "authoritative current/owned house resolver missing");
must(home.includes("function petStatusText(p)") && home.includes("petStage(p)") && home.includes("p.hunger"), "real pet-state presentation binding missing");
must(home.includes("img/coins/coin_gold.png"), "real coin asset no longer used in statistics");

/* Online friends: authoritative presence + all users + original upward scroll helper. */
must(home.includes("function syncOnlineUsers()"), "R11.1 authoritative online sync helper missing");
must(home.includes("Online.ready") && home.includes("Online.friends"), "online list is not sourced from authoritative Online presence");
must(home.includes("users.push({id:meUid") && home.includes("for(const f of friends) users.push"), "online list does not include self + all authoritative online friends");
must(home.includes("initSideScroll(host)"), "online list no longer delegates to original upward scroll mechanism");
must(home.includes("photoMiniHTML(uid,'vw2-online-avatar')") && home.includes("gradeMark(resolved, 'vw2-online-grade')"), "online avatar/rank bindings missing");
must(home.includes("openFriendQuickMenu") && home.includes("showPlayerCard"), "online-player row interaction no longer delegates to authoritative menu/profile");
must(!/firebase\s*\.\s*database\s*\(/.test(home) && !/\.ref\s*\(\s*['\"]\/?presence/.test(home), "Home V2 must not duplicate Firebase presence implementation");
must(css.includes('.vw2-online-list>.ss-chunk') && css.includes('touch-action:pan-y'), "online upward-scroll UX / touch handling missing");

/* Mission/stat/action bindings stay authoritative. */
["vw2-coins","vw2-today","vw2-online-earn","vw2-comp-earn","vw2-worth","vw2-quest-count","vw2-quest-bar","vw2-quests","vw2-online-count"].forEach(id => must(home.includes(`id="${id}"`), `binding missing: ${id}`));
must(home.includes("typeof questsToday === 'function'") && home.includes("state.quests"), "mission logic binding changed");
must(home.includes("textOf('#clock-chip .ck-date'") && home.includes("textOf('#rank-tab'"), "Profile date/rank source binding changed");

/* Bottom horizontal rail is inventory/order locked. */
const expectedBottom = ["vocabbook","ielts","toeic","toefl","onetp6","onetm3","onetm6","cats","play","picmatch","picdict","picquiz","bandexam"];
const bottomOrder = expectedBottom.map(action => home.indexOf(`['${action}',`));
must(expectedBottom.length === 13 && bottomOrder.every((p, i) => p >= 0 && (!i || p > bottomOrder[i - 1])), "accepted bottom rail inventory/order changed");
must(css.includes('grid-template-columns:repeat(13,minmax(0,1fr))'), "bottom rail 13-slot locked layout missing");

/* Mobile landscape targets + no page scroll regression metrics. */
["915", "844", "800", "667"].forEach(w => must(preview.includes(w), `mobile preview device width missing: ${w}`));
["412", "390", "360", "375"].forEach(h => must(preview.includes(h), `mobile preview device height missing: ${h}`));
must(css.includes("@media (max-width:1180px),(max-height:520px)") && css.includes("@media (max-width:850px)") && css.includes("@media (max-width:700px)"), "R11.1 mobile landscape tuning breakpoints missing");
must(home.includes("pageOverflow:") && home.includes("panelOverlaps:") && home.includes("bottomContained:"), "local mobile overflow/collision metrics missing");
must(css.includes("overflow:hidden") && css.includes("overscroll-behavior:contain"), "R11.1 page/rail overflow containment missing");

/* Transient notification safety: behavior stays authoritative, presentation is scoped only while V2 is visible. */
must(home.includes("document.body.classList.toggle('vw2-home-active', showV2)") && home.includes("document.body.classList.remove('vw2-home-active')"), "R11.1 Home V2 body-scope class for transient UI safety missing");
must(css.includes('body.vw2-home-active .toast') && css.includes('top:calc(23.5vh + 12px)') && css.includes('bottom:auto'), "R11.1 compact safe-zone toast presentation missing");

/* Admin-only safety. */
must(home.includes("function adminAllowed()") && home.includes("typeof isAdmin === 'function' && isAdmin() === true"), "ADMIN PREVIEW gate changed/missing");
must(!home.includes("firebase deploy") && !home.includes("deploy production"), "Home V2 source contains unexpected deployment action");

if(fail.length){
  console.error("Home V2 R11.1 validation FAILED:\n- " + fail.join("\n- "));
  process.exit(1);
}
console.log("Home V2 R11.1 validation PASS");
console.log(`Checked ${expectedRail.length} left destinations, ${expectedBottom.length} bottom actions, ${r111Assets.length} R11.1 optimized visual assets, authoritative online/feed/pet/house/profile bindings, and mobile landscape guards.`);
