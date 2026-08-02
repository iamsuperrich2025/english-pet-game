"""shotsink — รับภาพ base64 ผ่าน HTTP POST แล้วเซฟเป็นไฟล์ (แท็บ preview ดาวน์โหลดไม่ลง Downloads)
รัน: python shotsink.py 8797 <outdir>   → POST body = "<ชื่อไฟล์>|<base64>"
"""
import sys, os, base64
from http.server import BaseHTTPRequestHandler, HTTPServer

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8797
OUT = sys.argv[2] if len(sys.argv) > 2 else os.getcwd()

class H(BaseHTTPRequestHandler):
    def _cors(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Headers', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST,OPTIONS')

    def do_OPTIONS(self):
        self.send_response(204); self._cors(); self.end_headers()

    def do_POST(self):
        n = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(n).decode('utf-8', 'replace')
        name, _, b64 = body.partition('|')
        name = os.path.basename(name) or 'shot.jpg'
        data = base64.b64decode(b64.split(',')[-1])
        path = os.path.join(OUT, name)
        with open(path, 'wb') as f:
            f.write(data)
        self.send_response(200); self._cors()
        self.send_header('Content-Type', 'text/plain'); self.end_headers()
        self.wfile.write(('OK %d' % len(data)).encode())

    def log_message(self, *a):
        pass

print('sink on %d -> %s' % (PORT, OUT), flush=True)
HTTPServer(('127.0.0.1', PORT), H).serve_forever()
