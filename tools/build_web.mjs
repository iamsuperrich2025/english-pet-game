import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_ARG = process.argv.indexOf('--out');
const OUT = path.resolve(OUT_ARG >= 0 && process.argv[OUT_ARG + 1]
  ? process.argv[OUT_ARG + 1]
  : path.join(ROOT, 'dist'));

const PUBLIC_ROOT_FILES = new Set([
  'index.html',
  'index_classic.html',
  'offline.html',
  'privacy.html',
  'delete-account.html',
  'manifest.webmanifest',
  'sw.js',
  'version.json',
]);
const PUBLIC_DIRS = new Set(['.well-known', 'clip', 'css', 'img', 'js', 'sound']);
const FORBIDDEN_NATIVE_EXT = /\.(?:aab|apk|bat|cmd|com|dex|dll|exe|jar|ps1|so)$/i;
const TOKEN_BUILD = /__VW_BUILD_VERSION__/g;
const TOKEN_UPDATED = /__VW_BUILD_UPDATED__/g;

const posix = (value) => value.replaceAll('\\', '/');
const sha = (data, length = 16) => createHash('sha256').update(data).digest('hex').slice(0, length);

function isPublicPath(relativePath) {
  const rel = posix(relativePath).replace(/^\.\//, '');
  if (!rel || rel.startsWith('../') || FORBIDDEN_NATIVE_EXT.test(rel)) return false;
  if (PUBLIC_ROOT_FILES.has(rel)) return true;
  return PUBLIC_DIRS.has(rel.split('/')[0]);
}

async function sourceFiles() {
  try {
    const raw = execFileSync('git', ['ls-files', '-z'], { cwd: ROOT, encoding: 'utf8' });
    const tracked = raw.split('\0').filter(Boolean).filter(isPublicPath);
    // Required delivery files may be newly created in the current migration before the first commit.
    // Arbitrary untracked game assets remain excluded so local WIP cannot leak into a deploy.
    for (const rel of [...PUBLIC_ROOT_FILES, 'js/app-update.js', 'js/account-deletion.js', 'css/account-deletion.css',
      'sound/racing/engineSound.mp3']) {
      try {
        await fs.access(path.join(ROOT, rel));
        if (!tracked.includes(rel)) tracked.push(rel);
      } catch {}
    }
    return tracked;
  } catch {
    const found = [];
    async function walk(dir, prefix = '') {
      for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
        const rel = posix(path.join(prefix, entry.name));
        if (entry.isDirectory()) {
          if (PUBLIC_DIRS.has(rel.split('/')[0])) await walk(path.join(dir, entry.name), rel);
        } else if (isPublicPath(rel)) {
          found.push(rel);
        }
      }
    }
    await walk(ROOT);
    return found;
  }
}

async function copyPublicTree(files) {
  const resolvedOut = path.resolve(OUT);
  if (resolvedOut === path.parse(resolvedOut).root || resolvedOut === ROOT) {
    throw new Error(`Refusing unsafe output directory: ${resolvedOut}`);
  }
  await fs.rm(resolvedOut, { recursive: true, force: true });
  await fs.mkdir(resolvedOut, { recursive: true });
  for (const rel of files) {
    const from = path.join(ROOT, rel);
    const to = path.join(resolvedOut, rel);
    await fs.mkdir(path.dirname(to), { recursive: true });
    await fs.copyFile(from, to);
  }
}

async function readVersion() {
  const data = JSON.parse(await fs.readFile(path.join(ROOT, 'version.json'), 'utf8'));
  const version = String(data.version || data.v || '').trim();
  if (!/^\d{4}-\d{2}-\d{2}\.\d+$/.test(version)) {
    throw new Error(`version.json has an invalid version: ${version || '(missing)'}`);
  }
  return {
    version,
    updated: String(data.updated || new Date().toISOString()),
  };
}

async function replaceBuildTokens(file, build) {
  const full = path.join(OUT, file);
  let text = await fs.readFile(full, 'utf8');
  text = text.replace(TOKEN_BUILD, build.version).replace(TOKEN_UPDATED, build.updated);
  await fs.writeFile(full, text);
}

async function fileHash(relativePath) {
  return sha(await fs.readFile(path.join(OUT, relativePath)));
}

function localPathFromUrl(url) {
  if (!url || /^(?:[a-z]+:|\/\/|data:|blob:|#)/i.test(url)) return null;
  const clean = url.split(/[?#]/, 1)[0].replace(/^\//, '');
  if (!clean || clean.includes('..')) return null;
  return posix(clean);
}

async function rewriteCssUrls(css, sourceRelativePath) {
  const sourceDir = path.posix.dirname(posix(sourceRelativePath));
  const matches = [...css.matchAll(/url\(\s*(['"]?)([^'"\)]+)\1\s*\)/gi)];
  let output = css;
  for (const match of matches.reverse()) {
    const raw = match[2].trim();
    if (/^(?:[a-z]+:|\/\/|data:|blob:|#|\/)/i.test(raw)) continue;
    const [pathname, suffix = ''] = raw.split(/(?=[?#])/);
    const resolved = path.posix.normalize(path.posix.join(sourceDir, pathname));
    if (resolved.startsWith('../')) continue;
    const full = path.join(OUT, resolved);
    try {
      const hash = await fileHash(resolved);
      await fs.access(full);
      const replacement = `url("/${resolved}?v=${hash}${suffix}")`;
      output = output.slice(0, match.index) + replacement + output.slice(match.index + match[0].length);
    } catch {
      // Optional assets are allowed to fall back at runtime.
    }
  }
  return output;
}

const entryAliases = new Map();
async function makeImmutableAlias(relativePath) {
  const rel = posix(relativePath);
  if (entryAliases.has(rel)) return entryAliases.get(rel);
  const source = path.join(OUT, rel);
  let data = await fs.readFile(source);
  if (rel.endsWith('.css')) {
    data = Buffer.from(await rewriteCssUrls(data.toString('utf8'), rel));
  }
  const ext = path.posix.extname(rel);
  const stem = rel.slice(0, -ext.length);
  const alias = `assets/build/${stem}.${sha(data)}${ext}`;
  const target = path.join(OUT, alias);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, data);
  const publicUrl = `/${alias}`;
  entryAliases.set(rel, publicUrl);
  return publicUrl;
}

async function fingerprintHtml(file) {
  const full = path.join(OUT, file);
  let html = await fs.readFile(full, 'utf8');
  const patterns = [
    /(<script\b[^>]*\bsrc=["'])([^"']+)(["'][^>]*>)/gi,
    /(<link\b(?=[^>]*\brel=["'][^"']*stylesheet[^"']*["'])[^>]*\bhref=["'])([^"']+)(["'][^>]*>)/gi,
  ];
  for (const pattern of patterns) {
    const matches = [...html.matchAll(pattern)];
    for (const match of matches.reverse()) {
      const rel = localPathFromUrl(match[2]);
      if (!rel || !/\.(?:js|css)$/i.test(rel)) continue;
      try {
        const alias = await makeImmutableAlias(rel);
        const replacement = `${match[1]}${alias}${match[3]}`;
        html = html.slice(0, match.index) + replacement + html.slice(match.index + match[0].length);
      } catch (error) {
        throw new Error(`${file} references missing entry asset ${rel}: ${error.message}`);
      }
    }
  }
  await fs.writeFile(full, html);
  return html;
}

async function fingerprintManifestIcons() {
  const full = path.join(OUT, 'manifest.webmanifest');
  const manifest = JSON.parse(await fs.readFile(full, 'utf8'));
  const iconGroups = [manifest.icons || [], ...(manifest.shortcuts || []).map((item) => item.icons || [])];
  for (const icon of iconGroups.flat()) {
    const rel = localPathFromUrl(icon.src);
    if (rel) icon.src = await makeImmutableAlias(rel);
  }
  await fs.writeFile(full, `${JSON.stringify(manifest, null, 2)}\n`);
}

async function walkFiles(dir, prefix = '') {
  const found = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const rel = posix(path.join(prefix, entry.name));
    if (entry.isDirectory()) found.push(...await walkFiles(path.join(dir, entry.name), rel));
    else found.push(rel);
  }
  return found;
}

async function writeAssetManifest(build) {
  const files = {};
  for (const rel of await walkFiles(OUT)) {
    if (rel === 'asset-manifest.json') continue;
    const data = await fs.readFile(path.join(OUT, rel));
    files[`/${rel}`] = { hash: sha(data), bytes: data.length };
  }
  const manifest = { build: build.version, updated: build.updated, files };
  await fs.writeFile(path.join(OUT, 'asset-manifest.json'), `${JSON.stringify(manifest)}\n`);
  return manifest;
}

async function main() {
  const build = await readVersion();
  const files = await sourceFiles();
  await copyPublicTree(files);

  for (const rel of ['index.html', 'index_classic.html', 'manifest.webmanifest', 'sw.js']) {
    await replaceBuildTokens(rel, build);
  }

  await fingerprintManifestIcons();
  const cityHtml = await fingerprintHtml('index.html');
  await fingerprintHtml('index_classic.html');

  const cityAliases = [...cityHtml.matchAll(/["'](\/assets\/build\/[^"']+)["']/g)].map((m) => m[1]);
  const precache = [...new Set([
    '/', '/index.html', '/index_classic.html', '/offline.html', '/manifest.webmanifest',
    ...cityAliases,
    ...[...entryAliases.values()].filter((url) => /\/img\/icons\//.test(url)),
  ])];
  const swPath = path.join(OUT, 'sw.js');
  let sw = await fs.readFile(swPath, 'utf8');
  sw = sw.replace('__VW_PRECACHE__', JSON.stringify(precache));
  await fs.writeFile(swPath, sw);

  const manifest = await writeAssetManifest(build);
  const totalBytes = Object.values(manifest.files).reduce((sum, item) => sum + item.bytes, 0);
  console.log(`Vocab World build ${build.version}`);
  console.log(`Output: ${OUT}`);
  console.log(`Files: ${Object.keys(manifest.files).length} (${(totalBytes / 1024 / 1024).toFixed(1)} MiB)`);
  console.log(`Immutable startup aliases: ${entryAliases.size}`);
}

main().catch((error) => {
  console.error(`Build failed: ${error.stack || error.message}`);
  process.exitCode = 1;
});
