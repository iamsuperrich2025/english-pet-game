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

for (const name of moduleNames) {

  completeSuiteSource += fs.readFileSync(path.join(moduleDir, name), "utf8");

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

  check("portrait EXIT TANK is geometry-owned, left-side, and separate from right combat controls", () => {
    assert(frontlineSource.includes("// R18 PORTRAIT HUD LAYOUT START"));
    assert(frontlineSource.includes("function r18PortraitExitTankRect"));
    assert(frontlineSource.includes("function r18ValidatePortraitHudLayout"));
    assert(frontlineSource.includes("combatIntrusions=[]"));
    assert(frontlineSource.includes("function r18FindExitTankRuntimeRect"));
    assert(frontlineSource.includes("function r18RuntimePortraitHudAudit"));
    assert(frontlineSource.includes("left-above-drive"));
    assert(frontlineSource.includes("r18LayoutExitTank('make-dom-r18')"));
    assert(frontlineSource.includes("r18LayoutExitTank('open-r18')"));
    assert(frontlineCss.includes("left:max(10px,env(safe-area-inset-left))"));
    assert(frontlineCss.includes("min-width:84px!important;min-height:48px!important"));
    assert(!frontlineCss.includes(".fl44-exit-tank{right:max(10px,env(safe-area-inset-right));top:42%"));
  });

  check("portrait EXIT TANK layout clears full-screen collision audit at representative mobile sizes", () => {
    const r15Start = frontlineSource.indexOf("// R15 PURE PORTRAIT MODEL START");
    const r15End = frontlineSource.indexOf("// R15 PURE PORTRAIT MODEL END");
    const r18Start = frontlineSource.indexOf("// R18 PORTRAIT HUD LAYOUT START");
    const r18End = frontlineSource.indexOf("// R18 PORTRAIT HUD LAYOUT END");
    assert(r15Start >= 0 && r15End > r15Start && r18Start >= 0 && r18End > r18Start);
    const sandbox = {
      Math,
      R14_TITAN_SYSTEM: { id: "stub-r14" },
      clamp: (v, a, b) => Math.max(a, Math.min(b, v)),
      rectIntersects: (a, b) => !!a && !!b && a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top,
      expandRect: (r, pad) => ({ left: r.left - pad, top: r.top - pad, right: r.right + pad, bottom: r.bottom + pad, width: r.width + pad * 2, height: r.height + pad * 2 })
    };
    vm.createContext(sandbox);
    vm.runInContext(
      frontlineSource.slice(r15Start, r15End) + "\n" + frontlineSource.slice(r18Start, r18End) +
      "\nthis.makeHud=r18PortraitHudLayoutModel;this.auditHud=r18ValidatePortraitHudLayout;this.findExit=r18FindExitTankRuntimeRect;",
      sandbox
    );
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
      assert(audit.pass, `${w}x${h} portrait HUD must pass: ${JSON.stringify(audit)}`);
      assert.strictEqual(model.exitTank.left, model.safe.left, "EXIT TANK should stay on left safe edge");
      assert(model.exitTank.bottom <= model.drive.top - model.gap + 0.001, "EXIT TANK must remain above DRIVE");
      for (const name of ["scope", "aim", "fire", "mg", "autoForward", "autoReverse", "exit", "objective", "boss", "state"]) {
        assert(!sandbox.rectIntersects(model.exitTank, model[name]), `EXIT TANK must not overlap ${name}`);
      }
    }
    const movedModel = sandbox.makeHud(393, 873, {});
    const movedBlockers = ["player", "coins", "word", "objective", "exit", "boss", "state", "drive", "aim", "fire", "autoForward", "autoReverse", "mg", "scope"].map((name) => ({ name, rect: { ...movedModel[name] } }));
    for (const item of movedBlockers) if (item.name === "fire") item.rect = { ...movedModel.exitTank };
    const recovered = sandbox.findExit(movedModel, { left: 0, top: 0 }, movedBlockers);
    assert(recovered, "EXIT TANK must recover when a saved movable control occupies its preferred slot");
    assert(!sandbox.rectIntersects(recovered, movedModel.exitTank), "recovered EXIT TANK slot must move away from the occupied preferred slot");
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
