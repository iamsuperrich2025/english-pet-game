import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync,statSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const dir=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(dir,'../..');
const ogg='sound/Frontline/bgmusic-9295a3b2636fb961.ogg';
const mp3='sound/Frontline/bgmusic-a88cbf606d0bd932.mp3';
const original='sound/Frontline/Arcade_Adventure_bgm.mp3';
const hash=file=>createHash('sha256').update(readFileSync(path.join(root,file))).digest('hex').slice(0,16);
const audio=readFileSync(path.join(dir,'frontline-audio.js'),'utf8');
const preview=readFileSync(path.join(dir,'preview.mjs'),'utf8');
const build=readFileSync(path.join(root,'tools/build_web.mjs'),'utf8');

test('Frontline BGM hashes match tracked compressed files and are smaller than the original',()=>{
  assert.equal(hash(ogg),'9295a3b2636fb961');
  assert.equal(hash(mp3),'a88cbf606d0bd932');
  assert.ok(statSync(path.join(root,ogg)).size<statSync(path.join(root,original)).size);
  assert.ok(statSync(path.join(root,mp3)).size<statSync(path.join(root,original)).size);
});

test('runtime fetches hashed Frontline BGM only, never the original master',()=>{
  assert.match(audio,/bgmusic-9295a3b2636fb961\.ogg/);
  assert.match(audio,/bgmusic-a88cbf606d0bd932\.mp3/);
  assert.equal(audio.includes('Arcade_Adventure_bgm'),false);
  assert.match(audio,/preload='auto'/);
  assert.match(audio,/createObjectURL/);
  assert.match(audio,/vw-assets-content-v1/);
  assert.match(build,/Arcade_Adventure_bgm\.mp3'\) return false/);
});

test('preview serves hashed audio with blob media CSP and does not expose the original',()=>{
  assert.ok(preview.includes("media-src 'self' blob:"));
  assert.ok(preview.includes('bgmusic-[a-f0-9]+'));
  assert.equal(preview.includes('Arcade_Adventure_bgm'),false);
});
