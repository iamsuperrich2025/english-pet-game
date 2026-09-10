import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import { validateAssetlinks, verifyAssetlinks, REQUIRED_FINGERPRINTS, ASSETLINKS_PATH } from './assetlinks.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = await fs.readFile(path.join(ROOT, ASSETLINKS_PATH));
const original = JSON.parse(source);
const encode = (data) => Buffer.from(JSON.stringify(data));

test('all recovered certificates retain the exact Android trust relationship', () => {
  validateAssetlinks(source);
  assert.deepEqual(original[0].target.sha256_cert_fingerprints, REQUIRED_FINGERPRINTS);
});
for (const fingerprint of REQUIRED_FINGERPRINTS) {
  test(`reject losing ${fingerprint}`, () => {
    const data = structuredClone(original);
    data[0].target.sha256_cert_fingerprints = REQUIRED_FINGERPRINTS.filter((fp) => fp !== fingerprint);
    assert.throws(() => validateAssetlinks(encode(data)), /missing required certificate/);
  });
}
test('reject a five-entry list made from repeated upload keys', () => {
  const data = structuredClone(original);
  data[0].target.sha256_cert_fingerprints = Array(5).fill(REQUIRED_FINGERPRINTS[0]);
  assert.throws(() => validateAssetlinks(encode(data)), /missing required certificate/);
});
for (const field of ['package_name', 'namespace', 'relation', 'fingerprint', 'fingerprints_array']) {
  test(`reject invalid ${field}`, () => {
    const data = structuredClone(original);
    if (field === 'relation') data[0].relation = [];
    else if (field === 'fingerprints_array') data[0].target.sha256_cert_fingerprints = REQUIRED_FINGERPRINTS[0];
    else if (field === 'fingerprint') data[0].target.sha256_cert_fingerprints.push('invalid');
    else data[0].target[field] = 'invalid';
    assert.throws(() => validateAssetlinks(encode(data)));
  });
}
test('source/output comparison checks bytes and rejects matching truncated lists', async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'vw-assetlinks-'));
  const out = path.join(dir, 'dist');
  await fs.mkdir(path.join(dir, '.well-known'), { recursive: true });
  await fs.mkdir(path.join(out, '.well-known'), { recursive: true });
  await fs.writeFile(path.join(dir, ASSETLINKS_PATH), source);
  await fs.writeFile(path.join(out, ASSETLINKS_PATH), source);
  await verifyAssetlinks(dir, out);
  await fs.appendFile(path.join(out, ASSETLINKS_PATH), '\n');
  await assert.rejects(verifyAssetlinks(dir, out), /exactly match source bytes/);
  const broken = structuredClone(original);
  broken[0].target.sha256_cert_fingerprints = [REQUIRED_FINGERPRINTS[0]];
  for (const root of [dir, out]) await fs.writeFile(path.join(root, ASSETLINKS_PATH), encode(broken));
  await assert.rejects(verifyAssetlinks(dir, out), /missing required certificate/);
});
test('generator preserves certificates, deduplicates, adds approved entries, and fails closed', async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'vw-assetlinks-generator-'));
  await fs.mkdir(path.join(dir, 'tools'));
  await fs.mkdir(path.join(dir, '.well-known'));
  const script = path.join(dir, 'tools/make_assetlinks.py');
  const file = path.join(dir, ASSETLINKS_PATH);
  await fs.copyFile(path.join(ROOT, 'tools/make_assetlinks.py'), script);
  await fs.writeFile(file, source);
  const run = (...args) => spawnSync(process.env.PYTHON || 'python', [script, ...args], {
    encoding: 'utf8', env: { ...process.env, PYTHONIOENCODING: 'utf-8' },
  });
  assert.equal(run(REQUIRED_FINGERPRINTS[0].replaceAll(':', '').toLowerCase()).status, 0);
  assert.deepEqual(await fs.readFile(file), source);
  const partial = structuredClone(original);
  partial[0].target.sha256_cert_fingerprints.pop();
  await fs.writeFile(file, encode(partial));
  assert.equal(run(REQUIRED_FINGERPRINTS.at(-1), REQUIRED_FINGERPRINTS.at(-1)).status, 0);
  assert.deepEqual(await fs.readFile(file), source);
  for (const args of [['--package', 'invalid', REQUIRED_FINGERPRINTS[0]], ['garbage' + REQUIRED_FINGERPRINTS[0]]]) {
    assert.notEqual(run(...args).status, 0);
    assert.deepEqual(await fs.readFile(file), source);
  }
  await fs.writeFile(file, '{invalid');
  assert.notEqual(run(REQUIRED_FINGERPRINTS[0]).status, 0);
  assert.equal(await fs.readFile(file, 'utf8'), '{invalid');
  await fs.unlink(file);
  assert.notEqual(run(REQUIRED_FINGERPRINTS[0]).status, 0);
  await assert.rejects(fs.access(file));
});
test('real build entry rejects stale source before modifying existing output', async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'vw-assetlinks-build-'));
  await fs.mkdir(path.join(dir, 'tools/frontline-v1'), { recursive: true });
  await fs.mkdir(path.join(dir, '.well-known'));
  await fs.mkdir(path.join(dir, 'dist'));
  for (const rel of ['tools/build_web.mjs', 'tools/assetlinks.mjs', 'tools/frontline-v1/package-production.mjs']) {
    await fs.copyFile(path.join(ROOT, rel), path.join(dir, rel));
  }
  const broken = structuredClone(original);
  broken[0].target.sha256_cert_fingerprints = [REQUIRED_FINGERPRINTS[0]];
  await fs.writeFile(path.join(dir, ASSETLINKS_PATH), encode(broken));
  const marker = path.join(dir, 'dist/untouched.txt');
  await fs.writeFile(marker, 'keep');
  const result = spawnSync(process.execPath, [path.join(dir, 'tools/build_web.mjs')], { encoding: 'utf8' });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /missing required certificate/);
  assert.equal(await fs.readFile(marker, 'utf8'), 'keep');
});
