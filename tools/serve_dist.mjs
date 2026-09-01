import http from 'node:http';
import { createReadStream, promises as fs } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const PORT = Number(process.env.PORT || 4173);
const MIME = {
  '.avif': 'image/avif', '.css': 'text/css; charset=utf-8', '.glb': 'model/gltf-binary', '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon', '.jpeg': 'image/jpeg', '.jpg': 'image/jpeg', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.m4a': 'audio/mp4', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg',
  '.png': 'image/png', '.svg': 'image/svg+xml', '.wav': 'audio/wav', '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.webm': 'video/webm', '.webp': 'image/webp',
};

const server = http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url, `http://${request.headers.host}`);
    let pathname = decodeURIComponent(url.pathname);
    if (pathname === '/') pathname = '/index.html';
    const file = path.resolve(ROOT, `.${pathname}`);
    if (file !== ROOT && !file.startsWith(`${ROOT}${path.sep}`)) throw new Error('invalid path');
    const stat = await fs.stat(file);
    if (!stat.isFile()) throw new Error('not a file');
    response.setHeader('Content-Type', MIME[path.extname(file).toLowerCase()] || 'application/octet-stream');
    response.setHeader('X-Content-Type-Options', 'nosniff');
    if (pathname === '/sw.js') response.setHeader('Service-Worker-Allowed', '/');
    if (/^\/(?:index(?:_classic)?\.html|version\.json|sw\.js|asset-manifest\.json)$/.test(pathname)) {
      response.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    } else if (pathname.startsWith('/assets/build/')) {
      response.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
    response.setHeader('Accept-Ranges', 'bytes');
    const range = request.headers.range;
    if (range) {
      const match = /^bytes=(\d*)-(\d*)$/.exec(range);
      const start = match && match[1] ? Number(match[1]) : 0;
      const end = match && match[2] ? Math.min(Number(match[2]), stat.size - 1) : stat.size - 1;
      if (!match || !Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start < 0 || start > end || start >= stat.size) {
        response.writeHead(416, { 'Content-Range': `bytes */${stat.size}` });
        response.end();
        return;
      }
      response.writeHead(206, {
        'Content-Length': end - start + 1,
        'Content-Range': `bytes ${start}-${end}/${stat.size}`,
      });
      if (request.method === 'HEAD') response.end();
      else createReadStream(file, { start, end }).pipe(response);
      return;
    }
    response.writeHead(200, { 'Content-Length': stat.size });
    if (request.method === 'HEAD') response.end();
    else createReadStream(file).pipe(response);
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Not found');
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Vocab World preview: http://127.0.0.1:${PORT}`);
});
