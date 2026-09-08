"use strict";



const fs = require("fs");

const path = require("path");



// The CURRENT historical suite is stored as ordered source fragments so the

// authoritative entry point stays tiny while local execution still evaluates

// the exact complete test source in its original order. Numeric prefixes are

// intentional; future ChatGPT Tasks can include only the relevant fragments.

const moduleDir = path.join(__dirname, "frontline1944_tests");

const moduleNames = fs.readdirSync(moduleDir)

  .filter((name) => /^\d{2}_.+\.suite-fragment\.js$/.test(name))

  .sort();



if (!moduleNames.length) {

  throw new Error("Frontline 1944 test modules are missing: " + moduleDir);

}



let completeSuiteSource = "";

const currentFrontlineSourceForModules = fs.readFileSync(path.join(__dirname, "..", "js", "frontline1944.js"), "utf8");

for (const name of moduleNames) {

  const fragment = fs.readFileSync(path.join(moduleDir, name), "utf8");

  if (name === "58_phase21_r16.suite-fragment.js" && !currentFrontlineSourceForModules.includes("const R16_SYSTEM=Object.freeze(")) {

    console.log("SKIP historical R16 mirrored-left-controls fragment: CURRENT R17/R18 intentionally removed LEFT FIRE / LEFT MG.");

    continue;

  }

  completeSuiteSource += fragment;

}



// Direct eval deliberately preserves the original CommonJS lexical environment

// (require/__dirname/process) used by the historical monolithic test script.

// eslint-disable-next-line no-eval

eval(completeSuiteSource);



// Phase 2.1 R17 e2e9bd — CURRENT-source revision guards.

// These are additive to the historical modular suite above.

function runR17CurrentSourceGuards() {

  const assert = require("assert");

  const frontlineSource = fs.readFileSync(path.join(__dirname, "..", "js", "frontline1944.js"), "utf8");

  const frontlineCss = fs.readFileSync(path.join(__dirname, "..", "css", "frontline1944.css"), "utf8");

  let checks = 0;

  const check = (name, fn) => {

    fn();

    checks += 1;

    console.log("PASS R17 " + name);

  };



  check("LEFT FIRE / LEFT MG runtime creation and touch paths are removed", () => {

    assert(!frontlineSource.includes("function r16EnsureLeftControls"));

    assert(!frontlineSource.includes("function r16BindLeftControls"));

    assert(!frontlineSource.includes("r16BeginLeftControl"));

    assert(!frontlineSource.includes("r16MoveLeftControl"));

    assert(!frontlineSource.includes("r16EndLeftControl"));

    assert(!frontlineSource.includes("fl44-left-control fl44-left-fire"));

    assert(!frontlineSource.includes("fl44-left-control fl44-left-mg"));

    assert(!frontlineCss.includes(".fl44-left-control"));

    assert(!frontlineCss.includes(".fl44-left-fire"));

    assert(!frontlineCss.includes(".fl44-left-mg"));

  });



  check("legacy LEFT control DOM/storage is cleanup-only", () => {

    assert(frontlineSource.includes("function r17RemoveLegacyLeftWeapons"));

    assert(frontlineSource.includes("delete G.r16LeftControls"));

    assert(!frontlineSource.includes("r16SaveLeftPosition"));

    assert(!frontlineSource.includes("r16SavedLeftPosition"));

    assert(!frontlineSource.includes("r16LayoutLeftControls"));

  });



  check("RIGHT FIRE / RIGHT MG / DRIVE / AIM / AUTO / SCOPE remain present", () => {

    for (const id of ["#fl44-fire", "#fl44-mg", "#fl44-stick", "#fl44-aim-stick", "#fl44-auto-forward", "#fl44-auto-reverse", "#fl44-scope"]) {

      assert(frontlineSource.includes(id), id + " must remain in CURRENT runtime");

    }

    assert(frontlineSource.includes("queueMobileFirePulse"));

    assert(frontlineSource.includes("fireMachineGun"));

  });



  check("physical swept barrel contact remains required and broad proximity is insufficient", () => {

    assert(frontlineSource.includes("function r17SweepContainsPoint"));

    assert(frontlineSource.includes("if(!r17SweepContainsPoint(pose.x,pose.z,previousHeading,currentHeading,e.world.x,e.world.z,e.radius))continue"));

    assert(frontlineSource.includes("turretSweepReach:8.15"));

    assert(frontlineSource.includes("turretSweepHalfWidth:.78"));

    assert(!frontlineSource.includes("large invisible tank-centered hit radius"));

  });



  check("normal-zombie fling horizontalLaunch uses requested value 80", () => {

    const m = frontlineSource.match(/baselineHorizontalLaunch:(\d+(?:\.\d+)?),flingSpeedMultiplier:(\d+(?:\.\d+)?),flingDistanceMultiplier:(\d+(?:\.\d+)?),horizontalLaunch:(\d+(?:\.\d+)?)/);

    assert(m, "R17 fling tuning must be explicit");

    const baseline = Number(m[1]);

    const speedMultiplier = Number(m[2]);

    const distanceMultiplier = Number(m[3]);

    const launch = Number(m[4]);

    assert.strictEqual(speedMultiplier, 100);

    assert.strictEqual(distanceMultiplier, 100);

    assert.strictEqual(launch, 80);

  });



  check("open-world fling distance follows requested horizontalLaunch 80", () => {

    const cfg = frontlineSource.match(/baselineHorizontalLaunch:(\d+(?:\.\d+)?),flingSpeedMultiplier:(\d+(?:\.\d+)?),flingDistanceMultiplier:(\d+(?:\.\d+)?),horizontalLaunch:(\d+(?:\.\d+)?),verticalLaunch:(\d+(?:\.\d+)?),flingGravity:(\d+(?:\.\d+)?),flingHorizontalDrag:(\d+(?:\.\d+)?),flingMaxSeconds:(\d+(?:\.\d+)?)/);

    assert(cfg, "R17 distance tuning must be parseable");

    const baseline = Number(cfg[1]), launch = Number(cfg[4]), vertical = Number(cfg[5]), gravity = Number(cfg[6]), drag = Number(cfg[7]), maxSeconds = Number(cfg[8]);

    const duration = Math.min(maxSeconds, Math.max(.18, 2 * vertical / gravity));

    const distance = (speed) => drag > 1e-9 ? speed * (1 - Math.exp(-drag * duration)) / drag : speed * duration;

    const ratio = distance(launch) / distance(baseline);

    assert(Math.abs(ratio - (80 / baseline)) < 0.02, "expected distance ratio from horizontalLaunch 80, got " + ratio);

  });



  check("real zombie world coordinates are translated during fling", () => {

    assert(frontlineSource.includes("e.world.x+=dx;e.world.z+=dz"));

    assert(frontlineSource.includes("e.crowdRecord.world.x=e.world.x;e.crowdRecord.world.z=e.world.z"));

    assert(frontlineSource.includes("!wanted.has(id)&&!r17FlingActive(e)"));

  });



  check("Titan remains immune to normal turret fling", () => {

    assert(frontlineSource.includes("function r17TurretSweepEligible(e){return !!(e&&e.isZombie&&e.crowdManaged&&!e.dead&&!e.isTitan&&e.world);}"));

  });



  check("R17 tank/barrel baseline remains preserved beneath the current revision", () => {

    assert(frontlineSource.includes("id:'P2.1R17-e2e9bd'"));

    assert(frontlineSource.includes("presentation:R15_SYSTEM.presentation"));

    assert(frontlineSource.includes("baselineId:R17_SYSTEM.id"));

    assert(frontlineSource.includes("REVISION:R18_SYSTEM.id"));

  });



  console.log("PASS R17 " + checks + " focused CURRENT-source revision groups.");

}



runR17CurrentSourceGuards();



// Phase 2.1 R18 — CURRENT-source guards for on-foot/melee revision.
function runR18CurrentSourceGuards() {
  const assert = require("assert");
  const vm = require("vm");
  const frontlineSource = fs.readFileSync(path.join(__dirname, "..", "js", "frontline1944.js"), "utf8");
  const frontlineCss = fs.readFileSync(path.join(__dirname, "..", "css", "frontline1944.css"), "utf8");
  let checks = 0;
  const check = (name, fn) => { fn(); checks += 1; console.log("PASS R18 " + name); };

  check("normal zombie chase speed uses an explicit 30% gameplay multiplier", () => {
    assert(frontlineSource.includes("normalZombieChaseMultiplier:.30"));
    assert(frontlineSource.includes("e.speed=e.r18BaseChaseSpeed*R18_SYSTEM.normalZombieChaseMultiplier"));
    assert(frontlineSource.includes("speed=baseSpeed*R18_SYSTEM.normalZombieChaseMultiplier"));
  });

  check("Titan and enemy tanks are excluded from the normal-zombie speed multiplier", () => {
    assert(frontlineSource.includes("if(e&&e.isZombie&&!e.isTitan)"));
    assert(frontlineSource.includes("r18MeleeEligible(e){return !!(e&&e.isZombie&&!e.dead&&!e.isTitan"));
  });

  check("EXIT TANK and EXIT GAME remain distinct controls", () => {
    assert(frontlineSource.includes("id='fl44-exit-tank'") || frontlineSource.includes("id=\'fl44-exit-tank\'"));
    assert(frontlineSource.includes("#fl44-exit"));
    assert(frontlineSource.includes("function r18ExitTank()"));
    assert(frontlineCss.includes(".fl44-exit-tank"));
  });

  check("third-person on-foot mode has safe spawn, movement, and camera", () => {
    assert(frontlineSource.includes("function r18SafeExitPoint"));
    assert(frontlineSource.includes("function r18TickOnFoot"));
    assert(frontlineSource.includes("G.collision.resolveCircleMove(st.world,to,R18_SYSTEM.onFootRadius)"));
    assert(frontlineSource.includes("function r18UpdateOnFootCamera"));
    assert(frontlineSource.includes("onFootCameraDistance:8.8"));
  });

  check("tank remains in world and is re-entered rather than recreated", () => {
    assert(frontlineSource.includes("const st=r18State(),tank=G.player"));
    assert(frontlineSource.includes("if(st.avatar)st.avatar.visible=false"));
    assert(!frontlineSource.includes("r18EnterTank(tank=G.player){makePlayer("));
  });

  check("automatic tank entry is physical, occupancy-guarded, and debounced", () => {
    assert(frontlineSource.includes("function r18TankContact"));
    assert(frontlineSource.includes("r18TankOccupiedByOther(tank)"));
    assert(frontlineSource.includes("exitReentryCooldownMs:900"));
    assert(frontlineSource.includes("enterDebounceMs:650"));
    assert(frontlineSource.includes("if(inputNow()>=st.canEnterAt&&r18TankContact(G.player))r18EnterTank(G.player)"));
  });

  check("MELEE is close-contact only and flings normal zombies at 120", () => {
    assert(frontlineSource.includes("meleeHorizontalLaunch:120"));
    assert(frontlineSource.includes("function r18MeleeContact"));
    assert(frontlineSource.includes("forward>=.15&&forward<=R18_SYSTEM.meleeReach"));
    assert(frontlineSource.includes("Math.abs(side)<=R18_SYSTEM.meleeHalfWidth"));
    assert(frontlineSource.includes("const hit=candidates[0]"));
    assert(frontlineSource.includes("st.meleeHits.add(key)"));
    assert(frontlineSource.includes("e.world.x+=dx;e.world.z+=dz"));
  });

  check("current tank/barrel fling tuning stays unchanged at horizontalLaunch 80", () => {
    assert(frontlineSource.includes("horizontalLaunch:80,verticalLaunch:8.8"));
    assert(frontlineSource.includes("meleeHorizontalLaunch:120"));
  });

  check("EXIT TANK prefers the upper Player-to-Target-Word gap and stays separate from all combat controls", () => {
    assert(frontlineSource.includes("// R18 PORTRAIT HUD LAYOUT START"));
    assert(frontlineSource.includes("function r18UpperExitTankPreferredRect"));
    assert(frontlineSource.includes("function r18FindUpperExitTankRuntimeRect"));
    assert(frontlineSource.includes("upper-player-word-gap"));
    assert(frontlineSource.includes("function r18LayoutExitTank"));
    assert(frontlineSource.includes("r18LayoutExitTank('make-dom-r18')"));
    assert(frontlineSource.includes("r18LayoutExitTank('open-r18')"));
    assert(!frontlineSource.includes("if(!r15PortraitMode()){r18ClearExitTankLayoutOverride()"), "EXIT TANK layout must also run in the screenshot/wide mobile presentation");
    assert(frontlineCss.includes("left:clamp(112px,27vw,360px)"));
    assert(frontlineCss.includes("top:max(10px,env(safe-area-inset-top))"));
    assert(frontlineCss.includes("bottom:auto"));
    assert(frontlineCss.includes("min-width:84px!important;min-height:48px!important"));
    assert(!frontlineCss.includes("bottom:max(150px,calc(env(safe-area-inset-bottom) + 150px))"));
  });

  check("EXIT TANK upper-gap geometry matches screenshot intent and narrow portrait fallback remains collision-safe", () => {
    const r15Start = frontlineSource.indexOf("// R15 PURE PORTRAIT MODEL START");
    const r15End = frontlineSource.indexOf("// R15 PURE PORTRAIT MODEL END");
    const r18Start = frontlineSource.indexOf("// R18 PORTRAIT HUD LAYOUT START");
    const r18End = frontlineSource.indexOf("// R18 PORTRAIT HUD LAYOUT END");
    assert(r15Start >= 0 && r15End > r15Start && r18Start >= 0 && r18End > r18Start);
    const rectCenter = (r) => ({ x: (r.left + r.right) / 2, y: (r.top + r.bottom) / 2 });
    const sandbox = {
      Math,
      R14_TITAN_SYSTEM: { id: "stub-r14" },
      clamp: (v, a, c) => Math.max(a, Math.min(c, v)),
      rectCenter,
      rectIntersects: (a, c) => !!a && !!c && a.left < c.right && a.right > c.left && a.top < c.bottom && a.bottom > c.top,
      expandRect: (r, pad) => ({ left: r.left - pad, top: r.top - pad, right: r.right + pad, bottom: r.bottom + pad, width: r.width + pad * 2, height: r.height + pad * 2 }),
      fireRectAtCenter: (cx, cy, w, h, safe) => {
        const x = Math.max(safe.left + w / 2, Math.min(safe.right - w / 2, cx));
        const y = Math.max(safe.top + h / 2, Math.min(safe.bottom - h / 2, cy));
        return { left: x - w / 2, top: y - h / 2, right: x + w / 2, bottom: y + h / 2, width: w, height: h };
      }
    };
    vm.createContext(sandbox);
    vm.runInContext(
      frontlineSource.slice(r15Start, r15End) + "\n" + frontlineSource.slice(r18Start, r18End) +
      "\nthis.makeHud=r18PortraitHudLayoutModel;this.auditHud=r18ValidatePortraitHudLayout;this.findExit=r18FindExitTankRuntimeRect;this.preferredUpper=r18UpperExitTankPreferredRect;this.findUpper=r18FindUpperExitTankRuntimeRect;",
      sandbox
    );

    // Geometry approximates the supplied CURRENT screenshot: Player HUD left, TARGET WORD center, clear red-box gap between them.
    const box = (left, top, width, height) => ({ left, top, right: left + width, bottom: top + height, width, height });
    const safe = box(8, 8, 1235, 453);
    const wideRects = { player: box(14, 8, 292, 100), word: box(514, 9, 280, 82) };
    const blockers = [{ name: "player", rect: wideRects.player }, { name: "word", rect: wideRects.word }, { name: "exit", rect: box(928, 8, 66, 70) }, { name: "coins", rect: box(1003, 8, 232, 82) }];
    const combatSafe = box(315, 182, 620, 210);
    const preferred = sandbox.preferredUpper(safe, wideRects, 96, 50, 8);
    assert(preferred, "screenshot Player/Target Word gap must fit EXIT TANK");
    assert(preferred.left >= wideRects.player.right + 8 - 0.001);
    assert(preferred.right <= wideRects.word.left - 8 + 0.001);
    const upper = sandbox.findUpper(safe, wideRects, 96, 50, blockers, combatSafe, 8);
    assert(upper && upper.slot === "upper-player-word-gap", "upper red-box gap must be the first-choice runtime slot");
    for (const item of blockers) assert(!sandbox.rectIntersects(upper.rect, item.rect), "EXIT TANK must not overlap " + item.name);
    assert(!sandbox.rectIntersects(upper.rect, combatSafe), "EXIT TANK must stay above gameplay-critical combat area");

    const occupiedGap = [...blockers, { name: "fire", rect: { ...preferred } }];
    const recoveredUpper = sandbox.findUpper(safe, wideRects, 96, 50, occupiedGap, combatSafe, 8);
    assert(recoveredUpper, "EXIT TANK must recover when a saved/moved control occupies the preferred upper gap");
    assert(!sandbox.rectIntersects(recoveredUpper.rect, preferred), "recovered EXIT TANK must move away from the occupied red-box slot");
    for (const item of occupiedGap) assert(!sandbox.rectIntersects(recoveredUpper.rect, item.rect), "recovered EXIT TANK must not overlap " + item.name);

    const cases = [
      [393, 873, {}],
      [360, 800, { top: 32, bottom: 24 }],
      [430, 932, { top: 47, bottom: 34 }],
      [320, 568, {}],
      [320, 568, { top: 20, bottom: 16 }]
    ];
    for (const [w, h, insets] of cases) {
      const model = sandbox.makeHud(w, h, insets);
      const audit = sandbox.auditHud(model);
      assert(audit.pass, `${w}x${h} portrait HUD fallback must pass: ${JSON.stringify(audit)}`);
      for (const name of ["scope", "aim", "fire", "mg", "autoForward", "autoReverse", "exit", "objective", "boss", "state"]) {
        assert(!sandbox.rectIntersects(model.exitTank, model[name]), `portrait fallback EXIT TANK must not overlap ${name}`);
      }
    }
  });

  check("RIGHT MG supports independent long-press drag persistence without restoring LEFT controls", () => {
    assert(frontlineSource.includes("mobileMgPositionStorageKey:'vw.frontline1944.mg-position.v1'"));
    assert(frontlineSource.includes("mobileMgRepositionHoldMs:260"));
    assert(frontlineSource.includes("function findSafeMgRect"));
    assert(frontlineSource.includes("function saveMgPositionPreference"));
    assert(frontlineSource.includes("function restoreMgPositionPreference"));
    assert(frontlineSource.includes("kind==='mg'?readMgPositionStore(storage)"));
    assert(frontlineSource.includes("startMgGesture(id,x,y,transport)"));
    assert(frontlineSource.includes("moveMgGesture(id,x,y)"));
    assert(frontlineSource.includes("finishMgGesture(id,x,y,cancelled=false)"));
    assert(frontlineSource.includes("g.repositioning=true;if(g.firing){g.firing=false;this.onMgChange(false);}"), "active MG repositioning must stop machine-gun fire");
    assert(frontlineSource.includes("this.mgEl.classList.add('repositioning')"));
    assert(frontlineSource.includes("saveMgPositionPreference(this.root,this.driveEl,this.aimEl,this.fireEl,this.mgEl,this.storage)"));
    assert(frontlineSource.includes("$('#fl44-exit-tank')"), "MG drag collision blockers must include EXIT TANK");
    assert(frontlineCss.includes("#vw-frontline1944 #fl44-mg.repositioning"));
    assert(!frontlineCss.includes(".fl44-left-fire"));
    assert(!frontlineCss.includes(".fl44-left-mg"));
  });

  check("RIGHT MG gesture simulation keeps normal hold-fire and disables fire during active reposition", () => {
    const routerStart = frontlineSource.indexOf("class GlobalMobileTouchRouter");
    const routerEnd = frontlineSource.indexOf("function updateInputDiagnostics", routerStart);
    assert(routerStart >= 0 && routerEnd > routerStart);
    let now = 0, saved = 0, applied = 0;
    const events = [];
    const fakeClassList = () => { const s = new Set(); return { add: (v) => s.add(v), remove: (v) => s.delete(v), contains: (v) => s.has(v) }; };
    const mkEl = (rect) => ({ _rect: { ...rect }, classList: fakeClassList(), style: {} });
    const box = (left, top, width, height) => ({ left, top, right: left + width, bottom: top + height, width, height });
    const sb = {
      Math, Map, Set, clearTimeout, setTimeout,
      CFG: { mobileMgDragThresholdPx: 12, mobileMgRepositionHoldMs: 260 },
      G: { lastControlInputAt: 0 },
      inputNow: () => now,
      fireStorage: () => null,
      restoreDrivePositionPreference: () => null, restoreFirePositionPreference: () => null, restoreAimPositionPreference: () => null, restoreMgPositionPreference: () => null,
      rectCenter: (r) => ({ x: (r.left + r.right) / 2, y: (r.top + r.bottom) / 2 }),
      elementUsableRect: (el) => el && el._rect || null,
      findSafeMgRect: (root, drive, aim, fire, mg, cx, cy) => box(cx - 29, cy - 33.5, 58, 67),
      applyMgRect: (el, r) => { applied += 1; el._rect = { ...r }; return el._rect; },
      saveMgPositionPreference: () => { saved += 1; return true; },
      safeGameplayRect: () => box(0, 0, 400, 800),
      normalizedFirePosition: () => ({ x: .5, y: .5 })
    };
    vm.createContext(sb);
    vm.runInContext(frontlineSource.slice(routerStart, routerEnd) + "\nthis.Router=GlobalMobileTouchRouter;", sb);
    const mg = mkEl(box(300, 500, 58, 67));
    const router = new sb.Router({ root: {}, driveEl: mkEl(box(20, 650, 100, 100)), aimEl: mkEl(box(150, 650, 100, 100)), fireEl: mkEl(box(300, 650, 80, 80)), mgEl: mg, storage: {}, onMgChange: (v) => events.push(v) });
    router.rolePointers.mg = 7; router.gestureRects.mg = mg._rect;
    router.startMgGesture(7, 320, 525, "test");
    assert.strictEqual(events.at(-1), true, "normal MG press must still begin fire immediately");
    now = 400; router.moveMgGesture(7, 320, 525);
    assert.strictEqual(router.mgGesture.repositioning, false, "stationary hold remains normal MG firing");
    assert.strictEqual(events.at(-1), true);
    router.finishMgGesture(7, 320, 525, false);
    assert.strictEqual(events.at(-1), false, "normal MG release stops fire");

    now = 1000; router.rolePointers.mg = 8; router.gestureRects.mg = mg._rect; router.startMgGesture(8, 320, 525, "test");
    now = 1300; router.moveMgGesture(8, 355, 555);
    assert.strictEqual(router.mgGesture.repositioning, true, "long-press plus drag must enter MG reposition mode");
    assert.strictEqual(router.mgGesture.firing, false, "MG must not fire while actively repositioning");
    assert.strictEqual(events.at(-1), false, "reposition transition must stop MG fire");
    assert(mg.classList.contains("repositioning"));
    assert(applied > 0, "drag must move the complete MG base");
    router.finishMgGesture(8, 355, 555, false);
    assert.strictEqual(saved, 1, "MG moved position must persist independently on release");
    assert(!mg.classList.contains("repositioning"));
  });

  check("factory positions for DRIVE/AIM/FIRE/MG/AUTO/SCOPE remain CURRENT while saved MG is not forcibly reset", () => {
    assert(frontlineSource.includes("betweenFireAim=fire&&aim?"), "CURRENT MG default placement formula must remain");
    assert(frontlineSource.includes("if(!hasDrive)r15ApplyRect($('#fl44-stick'),model.drive)"));
    assert(frontlineSource.includes("if(!hasAim)r15ApplyRect($('#fl44-aim-stick'),model.aim)"));
    assert(frontlineSource.includes("if(!hasFire)r15ApplyRect($('#fl44-fire'),model.fire)"));
    assert(frontlineSource.includes("if(!hasMg)r15ApplyRect($('#fl44-mg'),model.mg)"));
    assert(frontlineSource.includes("r15ApplyRect($('#fl44-auto-forward'),model.autoForward)"));
    assert(frontlineSource.includes("r15ApplyRect($('#fl44-auto-reverse'),model.autoReverse)"));
    assert(frontlineSource.includes("r15ApplyRect($('#fl44-scope'),model.scope)"));
    assert(frontlineSource.includes("else if(router&&typeof router.recoverMgPosition==='function')router.recoverMgPosition()"));
  });

  check("tank-only and on-foot controls are mode-gated with no LEFT FIRE/MG resurrection", () => {
    for (const id of ["#fl44-fire", "#fl44-mg", "#fl44-stick", "#fl44-aim-stick", "#fl44-auto-forward", "#fl44-auto-reverse", "#fl44-scope", "#fl44-exit-tank", "#fl44-melee"]) assert(frontlineSource.includes(id));
    assert(frontlineSource.includes("el.style.pointerEvents=foot?'none':''"));
    assert(frontlineSource.includes("melee.style.pointerEvents=foot?'auto':'none'"));
    assert(!frontlineCss.includes(".fl44-left-fire"));
    assert(!frontlineCss.includes(".fl44-left-mg"));
  });

  check("R18 is the exported CURRENT revision", () => {
    assert(frontlineSource.includes("id:'P2.1R18-onfoot-melee'"));
    assert(frontlineSource.includes("REVISION:R18_SYSTEM.id"));
    assert(frontlineSource.includes("_t:{R18_SYSTEM"));
  });

  console.log("PASS R18 " + checks + " focused CURRENT-source revision groups.");
}

runR18CurrentSourceGuards();
