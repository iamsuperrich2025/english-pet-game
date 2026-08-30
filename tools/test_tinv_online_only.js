"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const online = fs.readFileSync(path.join(root, "js", "online.js"), "utf8");
const start = online.indexOf("function tinvFingerprint(");
const end = online.indexOf("const FEED_MAX", start);
if(start < 0 || end < 0) throw new Error("tinv helper block was not found");

function snapshot(entries){
  return {forEach(fn){ Object.entries(entries || {}).forEach(([key,value])=>fn({key,val:()=>value})); }};
}
function setup({presenceMap, sessionStartedAt=10000, serverTimeOffset=0, sent={}}={}){
  let watchCallback = null;
  const removed = [];
  const context = {
    window:{},
    Online:{
      db:{ref:p=>({on:(_event,cb)=>{ watchCallback=cb; },remove:()=>{ removed.push(p); return Promise.resolve(); }})},
      ready:true, presenceReady:true, presenceMap:presenceMap || {}, sessionStartedAt,
      serverTimeOffset, serverTimeReady:true, tinv:{}, tinvRaw:{}, tinvSeen:{}
    },
    state:{tinvDismissed:{},tinvSent:JSON.parse(JSON.stringify(sent))},
    TINV_WORLD_LABEL:{heli:"โลกเฮลิคอปเตอร์ 🚁"}, TINV_CASHBACK:100,
    onlineKey:()=>"me", fmtNum:n=>String(n), toast:()=>{}, saveState:()=>{},
    tinvClear:uid=>{ removed.push("tinv/me/"+uid); return Promise.resolve(); },
    renderRailWorlds:()=>{}, onlineRerender:()=>{}
  };
  vm.runInNewContext(online.slice(start,end)+"\ntinvWatch();",context);
  return {context,removed,emit:entries=>watchCallback(snapshot(entries))};
}

let run=setup({presenceMap:{friend1:true},sessionStartedAt:10000});
run.emit({friend1:{map:"heli",n:"Online friend",ts:12000}});
if(!run.context.Online.tinv.friend1) throw new Error("current-session invite from an online peer must remain visible");

run=setup({presenceMap:{},sessionStartedAt:10000,sent:{friend1:{map:"heli",ts:12000}}});
run.emit({friend1:{map:"heli",n:"Offline friend",ts:12000}});
if(run.context.Online.tinv.friend1 || run.context.state.tinvSent.friend1) throw new Error("offline peer invitations must be removed from both directions");
if(!run.removed.includes("tinv/me/friend1") || !run.removed.includes("tinv/friend1/me")) throw new Error("offline cleanup must remove incoming and outgoing Firebase nodes");

run=setup({presenceMap:{friend1:true},sessionStartedAt:20000,sent:{friend1:{map:"heli",ts:12000}}});
run.emit({friend1:{map:"heli",n:"Reconnected friend",ts:12000}});
if(run.context.Online.tinv.friend1 || run.context.state.tinvSent.friend1) throw new Error("invites from an older online session must not return after reconnect");

const ui=fs.readFileSync(path.join(root,"js","ui.js"),"utf8");
if(!/const friends = tinvOnlineFriends\(\)/.test(ui)) throw new Error("invite picker must list online friends only");
if(!/onlineIds\.has\(String\(f\.uid\)\) \? \`<button class="ib-world"/.test(ui)) throw new Error("chat inbox invite button must render only for online friends");
if(!/tinvOnlineFriends\(\)\.length \? \`<button class="big-btn blue home-btn" id="we-invite"/.test(ui)) throw new Error("world entry invite button must be absent with no online friends");

console.log("PASS invitations exist only while both players share the current online session");
