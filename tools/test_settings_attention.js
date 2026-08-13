"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const main = fs.readFileSync(path.join(root, "js", "main.js"), "utf8");
const appUpdate = fs.readFileSync(path.join(root, "js", "app-update.js"), "utf8");
const stateJs = fs.readFileSync(path.join(root, "js", "state.js"), "utf8");
const util = fs.readFileSync(path.join(root, "js", "util.js"), "utf8");
const ui = fs.readFileSync(path.join(root, "js", "ui.js"), "utf8");
const lobbyCss = fs.readFileSync(path.join(root, "css", "lobby.css"), "utf8");
const classic = fs.readFileSync(path.join(root, "index_classic.html"), "utf8");
const city = fs.readFileSync(path.join(root, "index.html"), "utf8");

function must(re, message){
  if(!re.test(main)) throw new Error(message);
}

must(/function\s+settingsButtonClick\s*\(\)\s*\{[\s\S]*?Number\(badge\.textContent\)\s*>\s*0[\s\S]*?if\(hasAttention\)\s*openAttentionSummary\(\);[\s\S]*?else\s*openSettings\(\);[\s\S]*?\}/,
  "settings button must route a visible numeric badge to the attention summary and otherwise open settings");
must(/getElementById\('btn-settings'\)\.addEventListener\('click',\s*settingsButtonClick\)/,
  "the full settings button must use the attention-aware click handler");
if(/getElementById\('settings-badge'\)\.addEventListener\('click'/.test(main)){
  throw new Error("the tiny badge must not be the only separate click target");
}

const fnSource = main.match(/function\s+settingsButtonClick\s*\(\)\s*\{[\s\S]*?\n\}/);
if(!fnSource) throw new Error("settingsButtonClick function was not found");
function runCase(badge){
  const calls = {attention:0, settings:0};
  const context = {
    document:{getElementById:id=>id === "settings-badge" ? badge : null},
    openAttentionSummary:()=>calls.attention++,
    openSettings:()=>calls.settings++
  };
  vm.runInNewContext(`${fnSource[0]}; settingsButtonClick();`, context);
  return calls;
}

let calls = runCase({style:{display:""}, textContent:"1"});
if(calls.attention !== 1 || calls.settings !== 0) throw new Error("visible badge must open the attention summary");
calls = runCase({style:{display:"none"}, textContent:"1"});
if(calls.attention !== 0 || calls.settings !== 1) throw new Error("hidden badge must open settings");
calls = runCase({style:{display:""}, textContent:""});
if(calls.attention !== 0 || calls.settings !== 1) throw new Error("empty badge must open settings");

for(const [name, html] of [["classic", classic], ["city", city]]){
  const bootstrapAt = html.indexOf("window.__vwLocalPreview = true");
  const updaterAt = html.search(/<script src="js\/app-update\.js(?:\?[^\"]*)?"><\/script>/);
  if(bootstrapAt < 0 || updaterAt < 0 || bootstrapAt > updaterAt){
    throw new Error(`${name} must run the localhost SW cleanup before app-update.js`);
  }
  if(!html.includes("navigator.serviceWorker.getRegistrations()") || !html.includes("r.unregister()")){
    throw new Error(`${name} must unregister stale localhost service workers`);
  }
  if(!html.includes("navigator.serviceWorker.register = function()")){
    throw new Error(`${name} must block an older cached updater from re-registering during cleanup`);
  }
}
if(!/function\s+start\s*\(\)\s*\{[\s\S]*?if\s*\(window\.__vwLocalPreview\)\s*return;/.test(appUpdate)){
  throw new Error("app-update must not register the production service worker during local preview");
}
if(!/<script src="js\/main\.js\?[^\"]+"><\/script>/.test(classic)){
  throw new Error("classic localhost must cache-bust main.js while this fix is awaiting a production build");
}
for(const asset of ["css/lobby.css", "js/util.js", "js/state.js", "js/ui.js"]){
  if(!classic.includes(`${asset}?v=1126`)) throw new Error(`${asset} must be cache-busted for local acceptance`);
}
if(!/function\s+attentionSummaryData\s*\(\)/.test(ui) || !/return\s*\{rows,\s*billTotal\}/.test(ui)){
  throw new Error("badge and settings must share one attention summary data source");
}
if(/const\s+meal\s*=\s*dinnerDue\(\)/.test(ui) || /rows\.push\(\{ico:'🍚'/.test(ui)){
  throw new Error("optional dinner must not appear as a red problem badge");
}
if(!/function\s+attentionPendingItems\s*\(\)/.test(ui) || !/function\s+attentionAcknowledge\s*\(\)/.test(ui)){
  throw new Error("attention must track pending item fingerprints separately from completion");
}
if(!/document\.body\.appendChild\(overlay\);\s*attentionAcknowledge\(\)/.test(ui)){
  throw new Error("showing the attention summary must immediately clear the red unread count");
}
if(!/attentionSeen:\s*\{\}/.test(stateJs) || !/s\.attentionSeen/.test(stateJs)){
  throw new Error("seen attention fingerprints must persist across reloads");
}
const attentionStart = ui.indexOf("function attentionPendingItems()");
const attentionEnd = ui.indexOf("/* เลขรวมบนปุ่ม", attentionStart);
if(attentionStart < 0 || attentionEnd < 0) throw new Error("attention helper block was not found");
let saveCalls = 0, badgeCalls = 0;
const attentionContext = {
  state:{attentionSeen:{}},
  Online:{reqs:[], chatUnread:{}, giftIn:[], tinv:{friend1:{map:"soccer",ts:100}}, tinvHidden:{}},
  billOutstanding:()=>0,
  saveState:()=>{ saveCalls++; },
  updateSettingsBadge:()=>{ badgeCalls++; }
};
vm.runInNewContext(`${ui.slice(attentionStart, attentionEnd)}
  resultBefore = attentionUnseenCount();
  attentionAcknowledge();
  resultAfter = attentionUnseenCount();
  inviteStillExists = !!Online.tinv.friend1;
  Online.tinv.friend1.ts = 200;
  resultNewInvite = attentionUnseenCount();`, attentionContext);
if(attentionContext.resultBefore !== 1 || attentionContext.resultAfter !== 0){
  throw new Error("viewing the summary must clear the current red count");
}
if(!attentionContext.inviteStillExists) throw new Error("acknowledging must not delete the invitation");
if(attentionContext.resultNewInvite !== 1) throw new Error("an updated invitation must alert again");
if(saveCalls !== 1 || badgeCalls !== 1){
  throw new Error("acknowledging must persist once and repaint the badge once");
}
if(!util.includes('class="set-attention-bar"') || !util.includes('มี ${attn.rows.length} รายการต้องจัดการ · ${attnFirst.txt}')){
  throw new Error("settings must visibly explain the pending attention count");
}
if(!/set-attention-bar[\s\S]*openAttentionSummary\(\)/.test(util)){
  throw new Error("the settings attention bar must open the actionable summary");
}
if(!/\.settings-box\s+\.set-attention-bar\s*\{/.test(lobbyCss)){
  throw new Error("the settings attention bar must be styled");
}

console.log("PASS settings attention routing + visible reason + fresh localhost source");
