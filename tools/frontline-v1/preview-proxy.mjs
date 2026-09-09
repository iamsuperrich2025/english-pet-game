/* Same-origin gateway for the development RTDB emulator; keeps LAN clients on one exposed port. */
import http from 'node:http';
import net from 'node:net';

function allowed(rawUrl, namespace) {
  try {
    const url = new URL(rawUrl, 'http://frontline.local');
    return (url.pathname === '/.ws' || url.pathname === '/.lp') && url.searchParams.get('ns') === namespace;
  } catch { return false; }
}

export function proxyEmulatorHttp(req, res, port, namespace) {
  if (!allowed(req.url, namespace)) return false;
  const headers = { ...req.headers, host: `127.0.0.1:${port}` };
  const upstream = http.request({ hostname: '127.0.0.1', port, method: req.method, path: req.url, headers }, response => {
    res.writeHead(response.statusCode || 502, response.headers);
    response.pipe(res);
  });
  upstream.on('error', () => {
    if (!res.headersSent) res.writeHead(502, { 'Content-Type': 'text/plain' });
    res.end('Local emulator unavailable');
  });
  req.pipe(upstream);
  return true;
}

export function attachEmulatorUpgrade(server, port, namespace) {
  server.on('upgrade', (req, socket, head) => {
    if (!allowed(req.url, namespace)) { socket.destroy(); return; }
    const upstream = net.connect(port, '127.0.0.1');
    upstream.once('connect', () => {
      const headers = { ...req.headers, host: `127.0.0.1:${port}` };
      const lines = [`${req.method} ${req.url} HTTP/${req.httpVersion}`];
      for (const [name, value] of Object.entries(headers)) {
        if (Array.isArray(value)) value.forEach(item => lines.push(`${name}: ${item}`));
        else if (value !== undefined) lines.push(`${name}: ${value}`);
      }
      upstream.write(lines.join('\r\n') + '\r\n\r\n');
      if (head.length) upstream.write(head);
      socket.pipe(upstream);
      upstream.pipe(socket);
    });
    upstream.on('error', () => socket.destroy());
    socket.on('error', () => upstream.destroy());
  });
}