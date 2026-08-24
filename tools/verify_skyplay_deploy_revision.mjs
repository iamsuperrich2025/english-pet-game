#!/usr/bin/env node
"use strict";

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");
const skyRel = "js/skyplay3d.js";
const sentinel = "VW_SKY_DEPLOY_SENTINEL: sky-trampoline-r1235-20260824";
const required = [
  sentinel,
  "function addTrampoline(x,z)",
  "addTrampoline(18,10)",
  "kind:'trampoline'",
  "trampoline?16.4:14.2"
];

function sha256(data) {
  return crypto.createHash("sha256").update(data).digest("hex");
}

function readRequired(file, label) {
  if (!fs.existsSync(file)) throw new Error(`${label} missing: ${file}`);
  const data = fs.readFileSync(file);
  const text = data.toString("utf8");
  const missing = required.filter((token) => !text.includes(token));
  if (missing.length) {
    throw new Error(`${label} is not the approved trampoline revision; missing ${missing.join(", ")}`);
  }
  return { data, hash: sha256(data), file };
}

function gitHeadSky() {
  try {
    return execFileSync("git", ["show", `HEAD:${skyRel}`], { cwd: root, stdio: ["ignore", "pipe", "pipe"] });
  } catch {
    return null;
  }
}

function candidateDistFiles(distRoot) {
  const direct = path.join(distRoot, skyRel);
  if (fs.existsSync(direct)) return [direct];
  const out = [];
  const stack = [distRoot];
  while (stack.length) {
    const dir = stack.pop();
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) stack.push(full);
      else if (ent.isFile() && ent.name.endsWith(".js")) out.push(full);
    }
  }
  return out;
}

function findDistSky(distRoot) {
  if (!fs.existsSync(distRoot)) return null;
  for (const file of candidateDistFiles(distRoot)) {
    const text = fs.readFileSync(file, "utf8");
    if (text.includes(sentinel) && text.includes("addTrampoline(18,10)")) return file;
  }
  return null;
}

function argValue(name) {
  const i = process.argv.indexOf(name);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : null;
}

const allowHeadMismatch = process.argv.includes("--allow-head-mismatch");
const requireDist = process.argv.includes("--require-dist");
const deploySourceArg = argValue("--deploy-source");

try {
  const source = readRequired(path.join(root, skyRel), "working-tree Sky source");
  console.log(`PASS source ${skyRel} sha256=${source.hash}`);

  const headData = gitHeadSky();
  if (headData) {
    const headText = headData.toString("utf8");
    const headHash = sha256(headData);
    const headHasApprovedRevision = required.every((token) => headText.includes(token));
    if (headHash !== source.hash || !headHasApprovedRevision) {
      const msg = `git HEAD does not match the approved working-tree Sky source (HEAD=${headHash}, source=${source.hash})`;
      if (!allowHeadMismatch) throw new Error(msg);
      console.warn(`WARN ${msg}`);
    } else {
      console.log(`PASS git HEAD matches source sha256=${headHash}`);
    }
  } else {
    console.warn("WARN git HEAD could not be read; source-only verification continued");
  }

  const distRoot = path.join(root, "dist");
  const distSky = findDistSky(distRoot);
  if (distSky) {
    const dist = readRequired(distSky, "dist Sky artifact");
    console.log(`PASS dist contains approved Sky revision ${path.relative(root, distSky)} sha256=${dist.hash}`);
  } else if (requireDist) {
    throw new Error("dist exists/was required but no built Sky artifact contains the approved trampoline revision");
  } else {
    console.warn("WARN dist Sky artifact not present; run after build with --require-dist for a strict build check");
  }

  if (deploySourceArg) {
    const deployRoot = path.resolve(root, deploySourceArg);
    const deploy = readRequired(path.join(deployRoot, skyRel), "temporary deploy source");
    if (deploy.hash !== source.hash) {
      throw new Error(`temporary deploy source differs from approved source (temp=${deploy.hash}, source=${source.hash})`);
    }
    console.log(`PASS temporary deploy source matches source sha256=${deploy.hash}`);

    const tempDistRoot = path.join(deployRoot, "dist");
    if (fs.existsSync(tempDistRoot)) {
      const tempDistSky = findDistSky(tempDistRoot);
      if (!tempDistSky) throw new Error("temporary deploy dist does not contain the approved trampoline revision");
      readRequired(tempDistSky, "temporary deploy dist Sky artifact");
      console.log(`PASS temporary deploy dist contains approved Sky revision ${path.relative(deployRoot, tempDistSky)}`);
    }
  }
} catch (err) {
  console.error(`FAIL ${err && err.message ? err.message : err}`);
  process.exitCode = 1;
}
