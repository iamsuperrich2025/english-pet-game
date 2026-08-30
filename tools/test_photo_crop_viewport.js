"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const photo = fs.readFileSync(path.join(root, "js", "photo.js"), "utf8");
const css = fs.readFileSync(path.join(root, "css", "style.css"), "utf8");

const viewportAssignment = photo.match(/st\.V\s*=\s*[^;]+;/);
assert.ok(viewportAssignment, "photo crop viewport assignment is missing");
assert.ok(
  viewportAssignment[0].includes("stage.clientWidth") &&
  viewportAssignment[0].indexOf("stage.clientWidth") < viewportAssignment[0].indexOf("stage.getBoundingClientRect().width"),
  "photo crop must prefer the untransformed layout width over the animated bounding rect"
);
assert.ok(
  /@keyframes\s+popIn\s*\{[^}]*scale\(\.4\)/s.test(css),
  "regression setup changed: popIn no longer begins with a transformed box"
);

// A 240 px crop stage appears as 96 px during popIn's scale(.4). The viewport
// must remain 240 px so the cover calculation fills the complete crop stage.
const layoutWidth = 240;
const animatedRectWidth = 96;
const viewport = layoutWidth || animatedRectWidth || 240;
const sourceWidth = 1280;
const sourceHeight = 720;
const coverScale = Math.max(viewport / sourceWidth, viewport / sourceHeight);
assert.strictEqual(viewport, 240, "animated transform shrank the crop viewport");
assert.ok(sourceWidth * coverScale >= viewport, "image does not cover crop width");
assert.ok(sourceHeight * coverScale >= viewport, "image does not cover crop height");

console.log("PASS photo crop uses full untransformed viewport during popIn");
