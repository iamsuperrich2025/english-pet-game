"use strict";
const fs = require("fs");
const vm = require("vm");
const path = require("path");

const root = path.resolve(__dirname, "..");
const homesSource = fs.readFileSync(path.join(root, "js", "data", "homes.js"), "utf8");
const context = vm.createContext({
  thAtHour: () => 0,
  thDate: () => new Date(0),
  Date,
  Math,
});
vm.runInContext(homesSource, context, {filename: "homes.js"});

function locked(from, to){
  return vm.runInContext(`homeDowngradeLocked(${JSON.stringify(from)}, ${JSON.stringify(to)})`, context);
}
function expect(actual, expected, label){
  if(actual !== expected) throw new Error(`${label}: expected ${expected}, got ${actual}`);
}

expect(locked(null, "basic"), false, "homeless may buy basic");
expect(locked("basic", "medium"), false, "basic may upgrade to medium");
expect(locked("medium", "castle"), false, "medium may upgrade to castle");
expect(locked("medium", "basic"), true, "medium may not downgrade to basic");
expect(locked("castle", "medium"), true, "castle may not downgrade to medium");
expect(locked("castle", "basic"), true, "castle may not downgrade to basic");
expect(locked("medium", "medium"), false, "current home is not a downgrade");
expect(locked("unknown", "basic"), false, "bad current id fails safe");

const uiSource = fs.readFileSync(path.join(root, "js", "ui.js"), "utf8");
const guardCalls = (uiSource.match(/homeDowngradeLocked\(state\.home, h\.id\)/g) || []).length;
if(guardCalls < 3) throw new Error(`UI must guard render, click and confirm; found ${guardCalls}`);
if(!uiSource.includes('aria-disabled="true"')) throw new Error("locked home card must expose aria-disabled");
if(!uiSource.includes("ต่ำกว่าบ้านปัจจุบัน")) throw new Error("locked home card must explain why");
if(!uiSource.includes("state.homePurchaseLog.push")) throw new Error("successful purchases must leave an audit trail");

const stateSource = fs.readFileSync(path.join(root, "js", "state.js"), "utf8");
if(!stateSource.includes("homePurchaseLog:[]")) throw new Error("default state must include home purchase history");
if(!stateSource.includes("s.homePurchaseLog = s.homePurchaseLog.filter")) throw new Error("migration must sanitize and bound home purchase history");

console.log("PASS home downgrade guard: 8 policy cases + render/click/confirm protection + audit trail");
