"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const root = path.resolve(__dirname, "..");
const read = (...p) => fs.readFileSync(path.join(root, ...p), "utf8");
const home = read("js", "home-v2.js");
const util = read("js", "util.js");
const auth = read("js", "auth.js");
const css = read("css", "home-v2.css");
const style = read("css", "style.css");
const lobby = read("css", "lobby.css");
const fail = [];
const must = (ok, msg) => { if (!ok) fail.push(msg); };

must(home.includes("R44 / รอบ 1502") && home.includes("window.HomeTheme") && home.includes("vwHomeTheme"), "HomeTheme API / round marker missing");
must(home.includes("admin:true") && home.includes("id:'noir'") && home.includes("label:'หรูดำ'"), "noir catalog entry missing");
must(util.includes("id=\"set-theme\"") && util.includes("isAdmin()===true") && util.includes("HomeTheme.list()"), "settings theme row is not admin-gated");
must(auth.includes("HomeTheme.paint"), "login/admin sync does not repaint Home theme");
must(css.includes("html.theme-noir") && css.includes("--vw2-r1502-ready:1") && css.includes("#070709"), "Home V2 noir skin missing");
must(css.includes("No mix-blend veil") && !/html\.theme-noir[^{]*\{[^}]*mix-blend-mode/.test(css), "noir skin must not use mix-blend veil");
must(style.includes(".set-theme-row") && style.includes(".set-theme-chip"), "settings swatch CSS missing");
must(lobby.includes("html.theme-noir .settings-box"), "settings overlay noir skin missing");
must(style.includes("--toast-fin-bg") && style.includes(".toast-fin-chip") && util.includes("fillFinancialToastMsg"), "luxury financial toast skin/parser missing");
must(css.includes("html.theme-noir .toast.toast-financial") && css.includes("--toast-fin-bg:linear-gradient(135deg,#1c1c22"), "noir theme does not restyle recap toast");

const html = { className: "", classList: {
  _set: new Set(),
  toggle(name, on){ if (on) this._set.add(name); else this._set.delete(name); html.className = [...this._set].join(" "); },
  remove(...names){ names.forEach(n => this._set.delete(n)); html.className = [...this._set].join(" "); },
  contains(name){ return this._set.has(name); }
}};
const body = { className: "", classList: {
  _set: new Set(),
  toggle(name, on){ if (on) this._set.add(name); else this._set.delete(name); },
  contains(name){ return this._set.has(name); }
}};
const store = {};
const documentStub = {
  documentElement: html,
  body,
  readyState: "complete",
  head: { appendChild(){} },
  getElementById(){ return null; },
  createElement(){ return { id:"", textContent:"", setAttribute(){}, classList:{ toggle(){} } }; },
  addEventListener(){},
  querySelector(){ return null; },
  querySelectorAll(){ return []; }
};
let admin = false;
const sandbox = {
  window: {},
  document: documentStub,
  localStorage: {
    getItem(k){ return Object.prototype.hasOwnProperty.call(store, k) ? store[k] : null; },
    setItem(k, v){ store[k] = String(v); }
  },
  isAdmin(){ return admin === true; },
  navigator: { deviceMemory: 8, hardwareConcurrency: 8 },
  console,
  setTimeout(){ return 0; },
  clearTimeout(){},
  MutationObserver: function(){ return { observe(){}, disconnect(){} }; }
};
sandbox.window = sandbox;
sandbox.window.addEventListener = () => {};
sandbox.window.matchMedia = () => ({ matches: false });
vm.createContext(sandbox);
vm.runInContext(home, sandbox, { filename: "home-v2.js" });
const HT = sandbox.HomeTheme;
must(!!HT, "HomeTheme did not export");
must(HT.get() === "pastel", "default theme is not pastel");
must(HT.list().every(t => t.id === "pastel"), "non-admin must only see pastel");
must(HT.set("noir") === "pastel" && !html.classList.contains("theme-noir"), "non-admin cannot apply noir");

admin = true;
must(HT.list().map(t => t.id).join(",") === "pastel,noir", "admin must see pastel + noir");
must(HT.set("noir") === "noir" && html.classList.contains("theme-noir") && store.vwHomeTheme === "noir", "admin noir not applied");
must(HT.set("pastel") === "pastel" && !html.classList.contains("theme-noir"), "pastel does not clear noir");

admin = false;
store.vwHomeTheme = "noir";
must(HT.get() === "pastel" && HT.paint() === "pastel" && !html.classList.contains("theme-noir"), "stored noir must not leak to non-admin");

const partsFn = util.slice(util.indexOf("function financialToastParts"), util.indexOf("function fillFinancialToastMsg"));
const recapSandbox = {};
vm.createContext(recapSandbox);
vm.runInContext(partsFn + "; this.out = financialToastParts('🤖 จบภารกิจหุ่น! 🌊 ถึงเวฟ 1 · ⭐ คอมโบสูงสุด ×3 · +100 🪙 · รวม 16,364,173');", recapSandbox);
must(recapSandbox.out.title === "🤖 จบภารกิจหุ่น!" && recapSandbox.out.chips[0] === "🌊 ถึงเวฟ 1" && recapSandbox.out.chips.some(x=>x.includes("รวม")), "recap toast does not split title/chips");

if (fail.length) {
  console.error("FAIL " + fail.length + "\n" + fail.map(m => "- " + m).join("\n"));
  process.exit(1);
}
console.log("ok 17 home theme noir");
