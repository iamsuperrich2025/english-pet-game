#!/usr/bin/env python
"""เซิร์ฟเวอร์สำหรับ "อบ" แอนิเมชัน 3D → ภาพวนลูปพื้นหลังโปร่ง (ใช้ตอนพัฒนาเท่านั้น ไม่ขึ้นเว็บจริง)

  python tools/bake_server.py          # แล้วเปิด http://127.0.0.1:8766/tools/bake_sprite.html

เสิร์ฟไฟล์เกมตามปกติ + เพิ่ม POST /_save/<path> ให้หน้า bake ส่งภาพที่เรนเดอร์เสร็จ
มาเขียนลงดิสก์ได้ตรงๆ (ไม่ต้องกดดาวน์โหลดเอง) — เขียนได้เฉพาะใต้ img/anim/ กันเผลอทับ asset อื่น
"""
import http.server, socketserver, os, pathlib, io

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / 'img' / 'anim'
PORT = 8766


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=str(ROOT), **kw)

    def do_POST(self):
        if not self.path.startswith('/_save/'):
            self.send_error(404); return
        name = os.path.basename(self.path[len('/_save/'):])   # กันไต่ path ขึ้นไปข้างบน
        if not name or not name.endswith('.png'):
            self.send_error(400, 'png only'); return
        n = int(self.headers.get('Content-Length', 0))
        data = self.rfile.read(n)
        OUT_DIR.mkdir(parents=True, exist_ok=True)
        dest = OUT_DIR / name
        dest.write_bytes(data)
        print(f'  saved {dest.relative_to(ROOT)}  ({len(data)/1024:.0f} KB)', flush=True)
        self.send_response(200)
        self.send_header('Content-Type', 'text/plain')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(b'ok')

    def log_message(self, *a):
        pass


if __name__ == '__main__':
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(('127.0.0.1', PORT), Handler) as srv:
        print(f'bake server: http://127.0.0.1:{PORT}/tools/bake_sprite.html', flush=True)
        srv.serve_forever()
