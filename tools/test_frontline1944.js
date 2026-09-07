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
