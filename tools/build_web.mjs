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

const PUBLIC_PREFIXES = ['assets/weapons/fps/runtime/', 'assets/images/letter_cannon/'];

const FORBIDDEN_NATIVE_EXT = /\.(?:aab|apk|bat|cmd|com|dex|dll|exe|jar|ps1|so)$/i;

const TOKEN_BUILD = /__VW_BUILD_VERSION__/g;

const TOKEN_UPDATED = /__VW_BUILD_UPDATED__/g;

const TOKEN_F1_ENGINE = /__VW_F1_ENGINE_URL__/g;

const F1_COCKPIT_ASSETS = ['red', 'blue', 'green', 'yellow', 'orange'].flatMap((color) =>

  ['center', 'left', 'right'].map((pose) =>

    `img/f1/cockpit_turn_${pose}${color === 'red' ? '' : `_${color}`}.webp`));

const TOKEN_F1_COCKPIT_ASSET = /img\/f1\/cockpit_turn_(?:center|left|right)(?:_(?:blue|green|yellow|orange))?\.webp/g;

const TOKEN_F1_PEER_CAR_ASSET = /img\/f1\/peer_car_25d\.webp/g;

const LOCAL_PREVIEW_BLOCK = /<!-- VW_LOCAL_PREVIEW_ONLY_START -->[\s\S]*?<!-- VW_LOCAL_PREVIEW_ONLY_END -->\s*/g;



const posix = (value) => value.replaceAll('\\', '/');

const sha = (data, length = 16) => createHash('sha256').update(data).digest('hex').slice(0, length);



function isPublicPath(relativePath) {

  const rel = posix(relativePath).replace(/^\.\//, '');

  if (!rel || rel.startsWith('../') || FORBIDDEN_NATIVE_EXT.test(rel)) return false;

  if (PUBLIC_ROOT_FILES.has(rel)) return true;

  if (PUBLIC_PREFIXES.some((prefix) => rel.startsWith(prefix))) return true;

  return PUBLIC_DIRS.has(rel.split('/')[0]);

}



async function sourceFiles() {

  try {

    const raw = execFileSync('git', ['ls-files', '-z'], {

      cwd: ROOT,

      encoding: 'utf8',

      // Deploy builds run inside a git-archive directory by design. The fallback below

      // handles that case, so suppress Git's misleading fatal message on stderr.

      stdio: ['ignore', 'pipe', 'ignore'],

    });

    const tracked = [];

    for (const rel of raw.split('\0').filter(Boolean).filter(isPublicPath)) {

      // Local replacement rounds can delete a tracked source before the deletion is committed.

      // A git-archive deploy never has this mismatch; local builds should skip the absent old asset.

      try { await fs.access(path.join(ROOT, rel)); tracked.push(rel); } catch {}

    }

    // Required delivery files may be newly created in the current migration before the first commit.

    // Arbitrary untracked game assets remain excluded so local WIP cannot leak into a deploy.

    for (const rel of [...PUBLIC_ROOT_FILES, 'js/app-update.js', 'js/account-deletion.js', 'css/account-deletion.css',

      'js/home-v2.js', 'css/home-v2.css',
      'img/home-v2/r10_screen_backdrop.svg', 'img/home-v2/r10_pet_world.svg', 'img/home-v2/r10_cloud_pedestal.svg',
      'img/home-v2/r11_screen_frame.svg', 'img/home-v2/r11_pet_world.svg', 'img/home-v2/r11_cloud_pedestal.svg',
      'img/home-v2/r11_kanok_corner.svg', 'img/home-v2/r11_kanok_band.svg',
      'img/home-v2/r111_screen_frame.svg', 'img/home-v2/r111_pet_world_scene.svg', 'img/home-v2/r111_cloud_pedestal.svg',
      'img/home-v2/r111_kanok_corner.svg', 'img/home-v2/r111_kanok_band.svg',
      // Home V2 R11.5.1 asset-driven fantasy UI skins (optimized WebP via VW Dev Studio 0.8.1 Lightweight Asset Bridge).
      'img/home-v2/r115_profile_shell.webp', 'img/home-v2/r115_stat_coin.webp', 'img/home-v2/r115_stat_today.webp', 'img/home-v2/r115_stat_online.webp', 'img/home-v2/r115_stat_computer.webp',
      'img/home-v2/r115_stat_worth.webp', 'img/home-v2/r115_frame_feed.webp', 'img/home-v2/r115_frame_mission.webp', 'img/home-v2/r115_frame_online.webp', 'img/home-v2/r115_title_plaque.webp',
      'img/home-v2/r115_ticker_plaque.webp', 'img/home-v2/r115_nav_frame.webp', 'img/home-v2/r115_nav_racing.webp', 'img/home-v2/r115_hero_world.webp', 'img/home-v2/r115_hero_match.webp',
      'img/home-v2/r115_hero_pet.webp', 'img/home-v2/r115_bottom_blue.webp', 'img/home-v2/r115_bottom_pink.webp', 'img/home-v2/r115_bottom_green.webp', 'img/home-v2/r115_bottom_orange.webp',
      'img/home-v2/r115_bottom_gold.webp', 'img/home-v2/r115_bottom_lime.webp', 'img/home-v2/r115_bottom_violet.webp', 'img/home-v2/r115_bottom_rose.webp', 'img/home-v2/r115_speech_bubble.webp',
      'img/home-v2/r115_pedestal.webp', 'img/home-v2/r115_scene_frame.webp', 'img/home-v2/r115_reward_sign.webp', 'img/home-v2/r115_house_label.webp', 'img/home-v2/r115_clouds.webp',
      'img/home-v2/r1279_fantasy_world.webp',
      'img/home-v2/r1282_bottom_frame.webp', 'img/home-v2/r1282_filigree.webp',

      'js/data/f1_vocab.js',

      'sound/racing/engineSound.mp3', ...F1_COCKPIT_ASSETS,

      'img/f1/peer_car_25d.webp', 'img/f1/sky_racing_1024.webp', 'js/fpsweapon.js', 'js/coinaward.js', 'js/assetaward.js', 'js/onlinecoinaward.js',

      'js/lettercannon.js', 'css/lettercannon.css', 'js/skyplay3d.js', 'css/skyplay3d.css',

      'img/characters/sky_soft_cuboid_chibi_8dir.webp',

      'img/characters/sky_soft_cuboid_chibi_anim.webp',

      'img/characters/sky_soft_cuboid_chibi_explorer_8dir.webp',

      'img/characters/sky_soft_cuboid_chibi_explorer_anim.webp',

      'img/characters/sky_soft_cuboid_chibi_captain_8dir.webp',

      'img/characters/sky_soft_cuboid_chibi_captain_anim.webp',

      'img/characters/sky_soft_cuboid_chibi_schoolgirl_8dir.webp',

      'img/characters/sky_soft_cuboid_chibi_schoolgirl_anim.webp',

      'img/characters/sky_soft_cuboid_chibi_witch_8dir.webp',

      'img/characters/sky_soft_cuboid_chibi_witch_anim.webp',

      'img/characters/sky_soft_cuboid_chibi_pajamas_8dir.webp', 'js/data/wear_extra.js',

      'img/characters/sky_soft_cuboid_chibi_pajamas_anim.webp',

      'img/characters/sky_soft_cuboid_chibi_thumb.webp',

      'img/characters/sky_soft_cuboid_chibi_explorer_thumb.webp',

      'img/characters/sky_soft_cuboid_chibi_captain_thumb.webp',

      'img/characters/sky_soft_cuboid_chibi_schoolgirl_thumb.webp',

      'img/characters/sky_soft_cuboid_chibi_witch_thumb.webp',

      'img/characters/sky_soft_cuboid_chibi_pajamas_thumb.webp',

      'js/rankgraph.js', 'css/rankgraph.css',

      'js/data/petshopping.js', 'js/petpantry.js', 'js/petshopping3d.js',

      'css/petpantry.css', 'css/petfashion.css', 'css/petshopping3d.css',

      'js/dailybox.js', 'css/dailybox.css',

      'img/pet-shopping/food_window.webp', 'img/pet-shopping/fashion_window.webp', 'img/pet-shopping/pantry_grant.webp',

      'img/pet-shopping/cute_town_mural_v2.webp',

      'assets/images/letter_cannon/letter_cannon_base.png',

      'assets/images/letter_cannon/letter_cannon_gun_head.png']) {

      try {

        await fs.access(path.join(ROOT, rel));

        if (!tracked.includes(rel)) tracked.push(rel);

      } catch {}

    }

    async function includeRuntime(dir, prefix = 'assets/weapons/fps/runtime') {

      try {

        for (const entry of await fs.readdir(dir, { withFileTypes: true })) {

          const rel = posix(path.join(prefix, entry.name));

          if (entry.isDirectory()) await includeRuntime(path.join(dir, entry.name), rel);

          else if (isPublicPath(rel) && !tracked.includes(rel)) tracked.push(rel);

        }

      } catch {}

    }

    await includeRuntime(path.join(ROOT, 'assets/weapons/fps/runtime'));

    // Premium dress-up art is intentionally reusable runtime content. Include newly

    // generated pieces before their first commit, without opening the build to other WIP img files.

    await includeRuntime(path.join(ROOT, 'img/wear/premium'), 'img/wear/premium');

    // Standardized pet art is a complete runtime catalog. Include new WebP files during

    // pre-commit QA as well as after git archive starts tracking the directories.

    await includeRuntime(path.join(ROOT, 'img/animal'), 'img/animal');

    await includeRuntime(path.join(ROOT, 'img/AnimalWearItems'), 'img/AnimalWearItems');

    return tracked;

  } catch {

    const found = [];

    async function walk(dir, prefix = '') {

      for (const entry of await fs.readdir(dir, { withFileTypes: true })) {

        const rel = posix(path.join(prefix, entry.name));

        if (entry.isDirectory()) {

          if (PUBLIC_DIRS.has(rel.split('/')[0]) || PUBLIC_PREFIXES.some((prefix) => (rel + '/').startsWith(prefix) || prefix.startsWith(rel + '/'))) await walk(path.join(dir, entry.name), rel);

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



async function stripLocalPreviewBootstrap(file) {

  const full = path.join(OUT, file);

  const html = await fs.readFile(full, 'utf8');

  const stripped = html.replace(LOCAL_PREVIEW_BLOCK, '');

  if (stripped === html) throw new Error(`${file} is missing the marked local-preview bootstrap`);

  await fs.writeFile(full, stripped);

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



  // Source HTML clears stale production caches only while developing on localhost.

  // Never ship that destructive recovery bootstrap in the production HTML.

  await stripLocalPreviewBootstrap('index.html');

  await stripLocalPreviewBootstrap('index_classic.html');



  for (const rel of ['index.html', 'index_classic.html', 'manifest.webmanifest', 'sw.js']) {

    await replaceBuildTokens(rel, build);

  }



  /* The Realistic cockpit was introduced as a new untracked runtime asset. Give both

     the image and lazy F1 engine immutable paths so a cached missing-image response

     or an older engine can never produce a steering-wheel-only cockpit. */

  const f1PeerCarUrl = await makeImmutableAlias('img/f1/peer_car_25d.webp');

  const f1File = path.join(OUT, 'js/f1_3d.js');

  let f1Text = await fs.readFile(f1File, 'utf8');

  const cockpitRefs = [...new Set(f1Text.match(TOKEN_F1_COCKPIT_ASSET) || [])];

  for (const asset of cockpitRefs) {

    const immutableUrl = await makeImmutableAlias(asset);

    f1Text = f1Text.replaceAll(asset, immutableUrl);

  }

  await fs.writeFile(f1File, f1Text.replace(TOKEN_F1_PEER_CAR_ASSET, f1PeerCarUrl));



  /* F1 is lazy-loaded after startup, so give it the same immutable-path guarantee as

     startup scripts. A query string is insufficient because older service workers

     may match cached assets while ignoring URL search parameters. */

  const f1EngineUrl = await makeImmutableAlias('js/f1_3d.js');

  const uiFile = path.join(OUT, 'js/ui.js');

  const uiText = await fs.readFile(uiFile, 'utf8');

  await fs.writeFile(uiFile, uiText.replace(TOKEN_F1_ENGINE, f1EngineUrl));



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

