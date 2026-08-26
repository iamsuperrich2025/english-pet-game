"use strict";
const fs = require("fs");
const path = require("path");
const root = path.resolve(__dirname, "..");
const home = fs.readFileSync(path.join(root, "js", "home-v2.js"), "utf8");
const preview = fs.readFileSync(path.join(root, "tools", "VW_MOBILE_DEVICE_PREVIEW.html"), "utf8");
const fail = [];
const must = (ok, msg) => { if(!ok) fail.push(msg); };

must(!home.includes("Home V2 Mobile Responsiveness + Usability Recovery Pass"), "old website-like responsive pass still present");
must(!home.includes("Home V2 Mobile Landscape Emergency Correction Pass"), "old emergency long-scroll pass still present");
must(home.includes("Home V2 Locked Mobile Landscape Recovery"), "locked mobile recovery CSS missing");
must(home.includes("overflow:hidden!important;overscroll-behavior:none!important"), "root locked overflow rule missing");
must(home.includes("data-vw2-action"), "Home V2 authoritative action attributes missing");
must(home.includes("clickExisting(`.lobby-rail [data-panel=\"${panelId}\"]`, {classicFirst:true})"), "Classic Lobby panel delegation changed/missing");
must(home.includes("el.click();"), "existing-element delegation click missing");
must(home.includes("vw-mobile-device-preview-metrics"), "local preview runtime metrics missing");
[[667,375],[800,360],[844,390],[915,412]].forEach(([w,h])=>must(preview.includes(`[${w},${h}]`), `preview preset ${w}x${h} missing`));
must(preview.includes("let selected=2"), "844x390 is not the default preset");
must(preview.includes("iframe.style.width=w+'px'"), "iframe logical width is not assigned directly");
must(preview.includes("iframe.style.height=h+'px'"), "iframe logical height is not assigned directly");
must(!preview.includes("zoom:"), "preview must not use CSS/browser zoom");

if(fail.length){ console.error("FAIL\n- " + fail.join("\n- ")); process.exit(1); }
console.log("PASS Home V2 locked-mobile recovery + local device preview static checks");
