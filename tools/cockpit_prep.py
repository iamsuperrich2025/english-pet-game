# ย่อภาพค็อกพิตใหม่ให้เบาพอขึ้นเว็บ + ตรวจตำแหน่งเข็มว่าตรงหน้าปัดที่วาดไว้ในภาพ
from PIL import Image, ImageDraw
import os, sys

SRC = r"C:\Users\rober\english-pet-game\img\new_heli_cockpit.png"
im = Image.open(SRC)
print("ต้นฉบับ", im.size, im.mode, "alpha ต่ำสุด:", im.getchannel("A").getextrema() if im.mode == "RGBA" else "-")

CROP = (0, 400, 1536, 1024)        # ตัดเพดาน/กระจกบนทิ้ง เหลือแผงหน้าปัดลงมา
W    = 1200
im2  = im.convert("RGB").crop(CROP)
im2  = im2.resize((W, round(im2.height * W / im2.width)), Image.LANCZOS)
print("หลังตัด+ย่อ", im2.size)

out = r"C:\Users\rober\english-pet-game\img\new_heli_cockpit.jpg"
im2.save(out, quality=86, optimize=True, progressive=True)
print("jpg", os.path.getsize(out) // 1024, "KB  (จาก", os.path.getsize(SRC) // 1024, "KB)")

# ---- ตำแหน่งเข็ม (พิกัดในไฟล์ jpg ที่ย่อแล้ว) ----
G = {
    "ATT": (391, 121, 23),
    "SPD": (330, 146, 23),
    "ALT": (447, 125, 23),
    "RPM": (392, 191, 26),
    "V/S": (453, 191, 23),
}
chk = im2.copy()
d = ImageDraw.Draw(chk)
for k, (x, y, r) in G.items():
    d.ellipse([x - r, y - r, x + r, y + r], outline=(0, 255, 90), width=2)
    d.text((x - 10, y - r - 12), k, fill=(0, 255, 90))
chk.crop((250, 60, 560, 250)).resize((930, 570)).save(
    os.path.join(os.path.dirname(os.path.abspath(__file__)), "gauge_check.png"))
print("เขียน gauge_check.png แล้ว")
