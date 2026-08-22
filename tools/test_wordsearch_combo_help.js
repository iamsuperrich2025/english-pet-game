"use strict";

const fs=require("fs");
const path=require("path");
const root=path.resolve(__dirname,"..");
const js=fs.readFileSync(path.join(root,"js","wordsearch.js"),"utf8");
const css=fs.readFileSync(path.join(root,"css","lobby.css"),"utf8");

function has(source, pattern, message){
  if(!pattern.test(source)) throw new Error(message);
}

has(js,/id="ws-combo-help"[^>]*aria-haspopup="dialog"/,"missing accessible Combo help button");
has(js,/id="ws-combo-dialog"[^>]*role="dialog"[^>]*aria-modal="true"[^>]*hidden/,"missing modal Combo dialog");
has(js,/คำแรก[\s\S]*×1[\s\S]*ภายใน 3 วิ[\s\S]*×2[\s\S]*×3/,"Combo progression is not explained");
has(js,/ลากคำผิดไม่ทำให้ Combo หาย/,"wrong-drag rule is not explained");
has(js,/จำนวนตัวอักษร ×2 แล้วคูณด้วย Combo/,"coin formula is not explained");
has(js,/if\(dialog&&!dialog\.hidden\)\{ dialog\.hidden=true; return; \}/,"Escape must close help before leaving Word Search");
has(css,/#ws-combo-dialog\[hidden\]\{display:none;\}/,"hidden dialog CSS is missing");
has(css,/\.ws-combo-card\{[^}]*max-height:calc\(100vh - 16px\)/,"dialog must stay inside short viewports");
has(js,/id="ws-combo-clock"[\s\S]*<b><\/b><i><em><\/em><\/i>/,"missing Combo countdown bar DOM");
has(js,/comboDeadline=foundAt\+COMBO_MS/,'countdown deadline must use the reward Combo window');
has(js,/Math\.ceil\(left\/100\)\/10/,'countdown must display tenths of a second');
has(js,/หมดเวลา Combo · คำถัดไปเริ่ม ×1/,'countdown must explain an expired Combo');
has(js,/resetCombo\(\)\{[\s\S]{0,90}stopComboTimer\(\)/,'resetCombo must stop and hide the countdown');
has(css,/#ws-combo-clock\{[^}]*width:clamp\(170px,24vw,300px\)/,'countdown must remain compact on short screens');

console.log("PASS wordsearch Combo help regression");
