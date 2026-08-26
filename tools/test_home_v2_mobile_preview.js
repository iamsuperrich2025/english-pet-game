"use strict";
const fs = require("fs");
const path = require("path");
const root = path.resolve(__dirname, "..");
const home = fs.readFileSync(path.join(root, "js", "home-v2.js"), "utf8");
const css = fs.readFileSync(path.join(root, "css", "home-v2.css"), "utf8");
const preview = fs.readFileSync(path.join(root, "tools", "VW_MOBILE_DEVICE_PREVIEW.html"), "utf8");
const fail = [];
const must = (ok, msg) => { if(!ok) fail.push(msg); };

/* R5 structural visual rebuild guard. */
must(home.includes("Home V2 R5 Structural Visual Fidelity Rebuild"), "R5 structural presentation stylesheet missing from home-v2.js");
must(css.includes("Home V2 R5 Structural Visual Fidelity Rebuild"), "R5 structural presentation stylesheet missing from css/home-v2.css");
must(!home.includes("Visual Fidelity Pass R4"), "R4 override tail still present; R5 must replace the accumulated presentation pass");
must(home.includes('class="vw2-avatar-frame"'), "R5 premium avatar frame missing");
must(home.includes('class="vw2-house-preview"'), "R5 framed authoritative house preview missing");
must(home.includes('class="vw2-feature-stage"'), "R5 cohesive hero scene missing");
must(!home.includes('class="vw2-player-mini"'), "small user portrait must not return inside the pet scene");
must(home.includes('class="vw2-rail-art"'), "illustrated left rail art wrapper missing");
must(home.includes('class="vw2-rail-label"'), "left rail integrated label wrapper missing");
must(home.includes("scrollbar-width:none!important"), "left rail hidden-scrollbar rule missing");
must(home.includes("function updateLeftRailCue()"), "left rail scroll cue state helper missing");

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

/* SOURCE MARKER GUARD — complete baseline lists from AFTER-R4 task state. */
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
must(home.includes("grid-template-columns:repeat(13,minmax(0,1fr))!important"), "accepted 13-button bottom rail layout missing");
must(home.includes("#62dcff 0%,#2f9df2 54%,#2373d7 100%"), "accepted saturated blue bottom button material missing");
must(home.includes("#ffe66f 0%,#ffaf31 48%,#f06b37 100%"), "accepted primary game CTA material missing");
must(home.includes("#vw-home-v2-root .vw2-top{grid-row:1!important"), "mobile top row pin missing");
must(home.includes("#vw-home-v2-root .vw2-main-grid{grid-row:2!important"), "mobile main row pin missing");
must(home.includes("#vw-home-v2-root .vw2-bottom{grid-row:3!important"), "mobile bottom row pin missing");
must(home.includes("display:flex!important;grid-column:2!important;grid-row:1!important;height:100%!important"), "Global Feed is not restored in fixed mobile composition");
must(home.includes("grid-column:3!important;grid-row:1!important;height:100%!important"), "hero feature is not in mobile column 3");
must(home.includes("grid-column:4!important;grid-row:1!important;height:100%!important"), "right panels are not in mobile column 4");
must(!home.includes("#vw-home-v2-root .vw2-feed{display:none!important}"), "mobile rules still hide Global Feed");
must(home.includes("overflow:hidden!important;overscroll-behavior:none!important"), "root/shell locked overflow rule missing");

/* Local device preview contract. */
must(home.includes("vw-mobile-device-preview-metrics"), "local preview runtime metrics missing");
[[667,375],[800,360],[844,390],[915,412]].forEach(([w,h])=>must(preview.includes(`[${w},${h}]`), `preview preset ${w}x${h} missing`));
must(preview.includes("let selected=2"), "844x390 is not the default preset");
must(preview.includes("iframe.style.width=w+'px'"), "iframe logical width is not assigned directly");
must(preview.includes("iframe.style.height=h+'px'"), "iframe logical height is not assigned directly");
must(preview.includes("Left scrollbar hidden"), "preview hidden-scrollbar check missing");
must(preview.includes("Down-arrow scroll cue"), "preview scroll-cue check missing");
must(!preview.includes("zoom:"), "preview must not use CSS/browser zoom");

if(fail.length){ console.error("FAIL\n- " + fail.join("\n- ")); process.exit(1); }
console.log("PASS Home V2 R5 structural visual fidelity + authoritative bindings + complete marker parity + fixed mobile landscape static checks");
