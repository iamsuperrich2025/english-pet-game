"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const online = fs.readFileSync(path.join(root, "js", "online.js"), "utf8");
const util = fs.readFileSync(path.join(root, "js", "util.js"), "utf8");
const stateJs = fs.readFileSync(path.join(root, "js", "state.js"), "utf8");
const start = online.indexOf("function tinvFingerprint(");
const end = online.indexOf("const FEED_MAX", start);
if(start < 0 || end < 0) throw new Error("tinv watch helper block was not found");
if(!/function toast\(msg, ms=1800, onDismiss\)/.test(util) ||
   !/typeof onDismiss === 'function'\) onDismiss\(\)/.test(util)){
  throw new Error("toast close buttons must invoke the optional dismiss callback");
}
if(!/tinvDismissed:\{\}/.test(stateJs) || !/s\.tinvDismissed/.test(stateJs)){
  throw new Error("dismissed invitation fingerprints must persist in state");
}

function snapshot(invite){
  return {forEach(fn){ if(invite) fn({key:"friend1", val:()=>invite}); }};
}
function runCase(dismissed, invite){
  let watchCallback = null;
  let dismissCallback = null;
  let toastCount = 0;
  let saveCount = 0;
  const context = {
    window:{},
    Online:{db:{ref:()=>({on:(_event, cb)=>{ watchCallback = cb; }})}, tinv:{}, tinvSeen:{}},
    state:{tinvDismissed:dismissed || {}},
    TINV_WORLD_LABEL:{heli:"โลกเฮลิคอปเตอร์ 🚁"},
    TINV_CASHBACK:100,
    onlineKey:()=>"me",
    fmtNum:n=>String(n),
    toast:(_msg, _ms, cb)=>{ toastCount++; dismissCallback = cb; },
    saveState:()=>{ saveCount++; },
    renderRailWorlds:()=>{},
    onlineRerender:()=>{}
  };
  vm.runInNewContext(online.slice(start, end) + "\ntinvWatch();", context);
  watchCallback(snapshot(invite));
  return {context, toastCount, saveCount:()=>saveCount, dismiss:()=>dismissCallback && dismissCallback()};
}

const invite = {map:"heli", n:"Sumpajit", ts:12345};
const fp = "friend1|heli|12345";
let result = runCase({friend1:fp}, invite);
if(result.toastCount !== 0) throw new Error("the same dismissed invitation must not warn again after reload");

result = runCase({friend1:"friend1|heli|111"}, invite);
if(result.toastCount !== 1) throw new Error("a newer invitation from the same friend must still warn");
result.dismiss();
if(result.context.state.tinvDismissed.friend1 !== fp || result.saveCount() !== 1){
  throw new Error("closing the warning must persist the exact invitation fingerprint once");
}

console.log("PASS invitation warning dismissal persists; newer invites still alert");
