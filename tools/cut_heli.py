# ตัดเสียง Bell 212 จริง → 3 ไฟล์ที่เกมใช้ (heli_start / heli_rotor / heli_rotor_high)
import wave, subprocess, os, numpy as np, imageio_ffmpeg

FF  = imageio_ffmpeg.get_ffmpeg_exe()
SRC = r"C:\Users\rober\english-pet-game\sound\helicopter\Bell_212_Helicopter_Engine_Startup_and_Takeoff.mp3"
OUT = r"C:\Users\rober\english-pet-game\sound"
TMP = os.path.dirname(os.path.abspath(__file__))
SR  = 44100
BLADE = 10.7                      # Hz — จังหวะใบพัดตอนรอบเต็ม (วัดจากไฟล์จริง)

full = os.path.join(TMP, "full.wav")
if not os.path.exists(full):
    subprocess.run([FF, "-v", "error", "-y", "-i", SRC, "-ac", "2", "-ar", str(SR), full], check=True)

w = wave.open(full)
a = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768
a = a.reshape(-1, 2)
print("source %.1f s" % (len(a) / SR))

def cut(t0, t1):
    return a[int(t0 * SR):int(t1 * SR)].copy()

def xfade(x, y, ms):                      # ต่อ 2 ท่อนแบบ equal-power (ไม่มีรอยต่อ)
    n = int(ms / 1000 * SR)
    f = np.linspace(0, 1, n)[:, None]
    head, tail = x[:-n], x[-n:] * np.cos(f * np.pi / 2)
    return np.concatenate([head, tail + y[:n] * np.sin(f * np.pi / 2), y[n:]])

def loopify(t0, secs, xf_ms=300):         # ทำท่อนวนลูปให้หัวต่อท้ายเนียน + ยาวลงตัวกับจังหวะใบพัด
    beats = round(secs * BLADE)
    L     = beats / BLADE                 # ปัดให้ลงตัวกับคาบใบพัด → ลูปไม่กระตุก
    xf    = int(xf_ms / 1000 * SR)
    seg   = cut(t0, t0 + L + xf_ms / 1000)
    body  = seg[:int(L * SR)].copy()
    f     = np.linspace(0, 1, xf)[:, None]
    # เอาหางที่เกินมา fade เข้าไปทับหัว → เล่นวนแล้วต่อกันสนิท
    body[:xf] = body[:xf] * np.sin(f * np.pi / 2) + seg[int(L * SR):int(L * SR) + xf] * np.cos(f * np.pi / 2)
    return body

def norm(x, peak=0.89):
    return x * (peak / max(1e-6, np.abs(x).max()))

def save(name, x, kbps="96k"):
    p = os.path.join(TMP, name + ".wav")
    ww = wave.open(p, "wb"); ww.setnchannels(2); ww.setsampwidth(2); ww.setframerate(SR)
    ww.writeframes((np.clip(x, -1, 1) * 32767).astype(np.int16).tobytes()); ww.close()
    mp3 = os.path.join(OUT, name + ".mp3")
    subprocess.run([FF, "-v", "error", "-y", "-i", p, "-codec:a", "libmp3lame",
                    "-b:a", kbps, "-ar", "44100", mp3], check=True)
    print("%-22s %5.2f s  %6.0f KB" % (name + ".mp3", len(x) / SR, os.path.getsize(mp3) / 1024))

# ---------- 1) heli_start: สตาร์ทเครื่องเต็มลำดับ ----------
# 2.0-21.5s  = เทอร์ไบน์ครางเบาๆ → จุดระเบิด (light-off) → ใบพัดเริ่มออกตัว   ← สเน่ห์ของ Bell 212
# 99-104s    = ใบพัดเร่งรอบกลาง (blade 8.7Hz)
# 157.5-164s = รอบเต็ม 10.7Hz พร้อมบิน
s = xfade(cut(2.0, 21.5), cut(99.0, 104.2), 1100)
s = xfade(s, cut(157.5, 164.0), 1300)
n = int(1.2 * SR); s[:n] *= np.linspace(0, 1, n)[:, None]          # เฟดหัวกันเสียงป๊อก
n = int(0.5 * SR); s[-n:] *= np.linspace(1, 0, n)[:, None] * 0.35 + 0.65
save("heli_start", norm(s, 0.86), "112k")

# ---------- 2) heli_rotor: ลูปบินปกติ (รอบเต็มคงที่ 10.7Hz) ----------
save("heli_rotor", norm(loopify(176.0, 9.0), 0.80))

# ---------- 3) heli_rotor_high: ลูปเร่งเครื่องเต็มกำลัง (ช่วงเทคออฟจริง) ----------
save("heli_rotor_high", norm(loopify(228.6, 7.0), 0.86))
