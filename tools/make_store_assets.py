#!/usr/bin/env python3
# ============================================================
# make_store_assets.py — สร้างภาพสำหรับหน้าร้าน Google Play (รอบ Play Store)
# ใช้: python tools/make_store_assets.py
# ผลลัพธ์ในโฟลเดอร์ store/ (ไม่ขึ้นเว็บ — deploy_firebase.sh ตัดทิ้ง):
#   store/icon-512.png        ไอคอนแอป 512×512 PNG 32-bit ไม่มีอัลฟา (สเปก Play)
#   store/feature-1024x500.png ภาพหน้าปก (Feature graphic) — Play บังคับต้องมี
# หมายเหตุ: ไอคอนต้นฉบับของเกมคือ img/icons/icon-512.png (โหมด P = palette)
#          Play ต้องการ 32-bit PNG จึงต้องแปลงก่อน ห้ามแก้ไฟล์ต้นฉบับของเกม
# ============================================================
import pathlib
from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "store"
OUT.mkdir(exist_ok=True)

TH_BOLD = "C:/Windows/Fonts/LeelaUIb.ttf"      # Leelawadee UI Bold — ไทย+อังกฤษ
NAVY_TOP, NAVY_BOT = (10, 31, 60), (18, 58, 107)
GOLD, CREAM = (255, 215, 106), (234, 242, 255)


def font(size):
    return ImageFont.truetype(TH_BOLD, size)


# ---------- 1) ไอคอน 512×512 32-bit (แบนลงพื้นทึบ ไม่มีอัลฟา) ----------
src = Image.open(ROOT / "img/icons/icon-512.png").convert("RGBA")
icon = Image.new("RGB", (512, 512), NAVY_TOP)
icon.paste(src, (0, 0), src)
icon.save(OUT / "icon-512.png")
print("✅ store/icon-512.png", icon.size, icon.mode)

# ---------- 2) Feature graphic 1024×500 ----------
W, H = 1024, 500
fg = Image.new("RGB", (W, H), NAVY_TOP)
d = ImageDraw.Draw(fg)
for y in range(H):                                    # ไล่เฉดน้ำเงินแนวตั้ง
    t = y / (H - 1)
    d.line([(0, y), (W, y)], fill=tuple(int(a + (b - a) * t) for a, b in zip(NAVY_TOP, NAVY_BOT)))

glow = Image.new("RGB", (W, H), (0, 0, 0))            # แสงนวลหลังโลโก้ (บวกแบบ additive)
ImageDraw.Draw(glow).ellipse([80, 60, 460, 440], fill=(34, 66, 116))
fg = ImageChops.add(fg, glow.filter(ImageFilter.GaussianBlur(70)))

SH = 340                                              # โลโก้โล่ทองฝั่งซ้าย (ลบมุมให้เข้ากับพื้น)
shield = src.resize((SH, SH), Image.LANCZOS)
mask = Image.new("L", (SH, SH), 0)
ImageDraw.Draw(mask).rounded_rectangle([0, 0, SH - 1, SH - 1], radius=64, fill=255)
fg.paste(shield, (78, 80), mask)

d = ImageDraw.Draw(fg)
X = 468
d.text((X, 116), "VOCAB WORLD", font=font(62), fill=GOLD)
d.text((X, 196), "เกมเรียนคำศัพท์ภาษาอังกฤษ", font=font(38), fill=CREAM)
d.text((X, 246), "สำหรับนักเรียน ป.1 – ม.6", font=font(38), fill=CREAM)
d.text((X, 316), "เลี้ยงสัตว์ · ค้าขาย · ผจญภัยโลก 3 มิติ", font=font(28), fill=(169, 196, 230))

pill_f = font(26)                                     # ป้ายทอง — กว้างตามความยาวข้อความจริง
pill_t = "เล่นฟรี ไม่มีโฆษณา"
tw = d.textbbox((0, 0), pill_t, font=pill_f)[2]
d.rounded_rectangle([X, 380, X + tw + 60, 380 + 52], radius=26, fill=GOLD)
d.text((X + 30, 389), pill_t, font=pill_f, fill=(10, 31, 60))

fg.save(OUT / "feature-1024x500.png")
print("✅ store/feature-1024x500.png", fg.size, fg.mode)
