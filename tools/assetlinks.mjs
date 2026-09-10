// Required certificates recovered from the pre-existing source and nine saved
// September 2026 build copies, including work/arena-shield-1397-dist.
// Keep this regression baseline independent of the served source: truncating
// that source must fail even when source and dist contain the same bad list.
import { promises as fs } from 'node:fs';
import path from 'node:path';

export const ASSETLINKS_PATH = '.well-known/assetlinks.json';
export const REQUIRED_FINGERPRINTS = Object.freeze([
  "10:3C:3C:A9:3C:4B:66:0E:14:67:EA:3E:36:C2:5B:20:B7:7D:43:85:5F:35:C2:27:10:4D:90:DF:5E:7E:10:0F",
  "93:27:FC:F1:05:00:A9:12:DE:E3:B8:13:5F:F3:73:F9:D2:F9:9A:A0:97:ED:A5:47:37:8F:A6:18:D4:A9:D5:57",
  "71:C3:17:1E:C4:44:A5:CE:29:2B:4D:D4:CB:DB:92:E9:58:C6:A0:18:7F:F0:F7:69:AB:59:B4:1F:49:EA:4B:69",
  "1A:96:D7:91:02:D0:F8:28:6C:AF:21:7D:5D:CC:0A:B7:87:D9:07:F3:22:73:8E:7A:35:D2:9E:81:4B:69:0F:99",
  "8A:94:4E:04:90:61:A3:94:83:EC:0C:55:F3:83:D6:82:AA:AD:25:F1:26:AF:BE:7C:FF:29:70:2F:74:68:E9:54"
]);
export function validateAssetlinks(bytes) {
  const data = JSON.parse(bytes.toString());
  if (!Array.isArray(data)) throw new Error('assetlinks must be an array');
  const statements = data.filter((s) => s?.target?.namespace === 'android_app'
    && s.target.package_name === 'app.web.vocabworld.twa'
    && Array.isArray(s.relation) && s.relation.includes('delegate_permission/common.handle_all_urls'));
  if (!statements.length) throw new Error('assetlinks missing required Android identity/relation');
  if (statements.some((s) => !Array.isArray(s.target.sha256_cert_fingerprints))) {
    throw new Error('assetlinks certificate fingerprints must be arrays');
  }
  const fingerprints = statements.flatMap((s) => s.target.sha256_cert_fingerprints);
  if (!fingerprints.length || fingerprints.some((fp) => typeof fp !== 'string'
    || !/^(?:[0-9A-F]{2}:){31}[0-9A-F]{2}$/.test(fp))) {
    throw new Error('assetlinks has an invalid SHA-256 fingerprint');
  }
  for (const fp of REQUIRED_FINGERPRINTS) {
    if (!fingerprints.includes(fp)) throw new Error(`assetlinks missing required certificate: ${fp}`);
  }
  return data;
}

export async function verifyAssetlinks(root, dist) {
  const source = await fs.readFile(path.join(root, ASSETLINKS_PATH));
  validateAssetlinks(source);
  if (dist !== undefined) {
    const output = await fs.readFile(path.join(dist, ASSETLINKS_PATH));
    if (!source.equals(output)) throw new Error('dist/.well-known/assetlinks.json must exactly match source bytes');
  }
}
