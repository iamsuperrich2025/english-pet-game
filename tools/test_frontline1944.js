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

  check("R17 identity is current while R15 accepted presentation baseline is preserved", () => {
    assert(frontlineSource.includes("id:'P2.1R17-e2e9bd'"));
    assert(frontlineSource.includes("presentation:R15_SYSTEM.presentation"));
    assert(frontlineSource.includes("REVISION:R17_SYSTEM.id"));
  });

  console.log("PASS R17 " + checks + " focused CURRENT-source revision groups.");
}

runR17CurrentSourceGuards();
