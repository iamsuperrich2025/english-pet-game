#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🕵️ ตรวจ "ฟังก์ชันที่ถูกเรียกแต่ไม่มีอยู่จริง" ในโค้ด js/ ทั้งโปรเจกต์
(เกิดจากรอบ 320: handler แตะน้องเรียก petPatFx() ที่ไม่เคยถูกเขียน → ReferenceError เงียบๆ
 คลิกแล้วไม่มีอะไรเกิดขึ้น ผู้เล่นแจ้งบั๊กแบบนี้ยากมาก)

วิธีใช้ (dev เท่านั้น · ไม่ขึ้นเว็บ เพราะ deploy ตัด tools/ ทิ้ง):
    python tools/check_undefined_calls.py            # รายงานเฉพาะที่น่าสงสัย
    python tools/check_undefined_calls.py --all      # รายงานชื่อที่ไม่รู้จักทั้งหมด (รวม global เบราว์เซอร์)

หลักการ: ตัด comment/string ออกก่อน แล้ว
  · เก็บ "ชื่อที่ถูกนิยาม" = function ชื่อ() · const/let/var ชื่อ = function/arrow · window.ชื่อ = · class ชื่อ
  · เก็บ "ชื่อที่ถูกเรียก" = ชื่อ(  ที่ไม่มีจุดนำหน้า (เมธอด obj.f() ข้ามไป ตรวจไม่ได้ด้วยวิธีนี้)
  · ตัดคำสงวน/บิลด์อิน/global เบราว์เซอร์ที่รู้จักทิ้ง
เป็นการตรวจแบบ heuristic — ผลที่ได้ให้ใช้เป็น "รายการที่ต้องไปดูด้วยตา" ไม่ใช่คำตัดสิน
"""
import re, sys, pathlib

# console Windows เป็น cp1252 → บังคับ stdout เป็น utf-8 ไม่งั้น emoji/ไทยพัง
try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

ROOT = pathlib.Path(__file__).resolve().parent.parent
# --path <dir> = ตรวจโฟลเดอร์อื่น (deploy ใช้ตรวจสำเนาที่ staged จาก git HEAD ก่อนขึ้นเว็บ)
if "--path" in sys.argv:
    ROOT = pathlib.Path(sys.argv[sys.argv.index("--path") + 1]).resolve()
JS_DIR = ROOT / "js"
SHOW_ALL = "--all" in sys.argv

# ---- ชื่อที่ถือว่ามีอยู่แล้วเสมอ (คำสงวน + บิลด์อิน + global เบราว์เซอร์ที่เกมนี้ใช้) ----
KEYWORDS = {
    "if", "for", "while", "switch", "catch", "return", "typeof", "function", "new", "delete",
    "do", "else", "in", "of", "case", "await", "yield", "void", "throw", "with", "instanceof",
}
BUILTINS = {
    "Array", "Object", "String", "Number", "Boolean", "Math", "JSON", "Date", "RegExp", "Error",
    "Promise", "Map", "Set", "WeakMap", "WeakSet", "Symbol", "BigInt", "Proxy", "Reflect",
    "parseInt", "parseFloat", "isNaN", "isFinite", "encodeURIComponent", "decodeURIComponent",
    "encodeURI", "decodeURI", "structuredClone", "queueMicrotask", "eval",
    "setTimeout", "setInterval", "clearTimeout", "clearInterval", "requestAnimationFrame",
    "cancelAnimationFrame", "fetch", "alert", "confirm", "prompt", "atob", "btoa",
    "Audio", "Image", "Blob", "File", "FileReader", "FormData", "Headers", "Request", "Response",
    "URL", "URLSearchParams", "WebSocket", "Worker", "AudioContext", "webkitAudioContext",
    "MouseEvent", "PointerEvent", "TouchEvent", "KeyboardEvent", "CustomEvent", "Event",
    "IntersectionObserver", "ResizeObserver", "MutationObserver", "AbortController",
    "getComputedStyle", "matchMedia", "scrollTo", "open", "close", "print", "postMessage",
    "Uint8Array", "Uint16Array", "Uint32Array", "Int8Array", "Int16Array", "Int32Array",
    "Float32Array", "Float64Array", "ArrayBuffer", "DataView", "TextEncoder", "TextDecoder",
    "Intl", "Notification", "Option", "DOMParser", "XMLHttpRequest", "createImageBitmap",
    "RTCPeerConnection", "RTCSessionDescription", "RTCIceCandidate", "MediaStream",
    "SpeechSynthesisUtterance", "SpeechRecognition", "webkitSpeechRecognition",
}

REGEX_PREV = set("(,=:[!&|?{};+-*%~^\n\t ")   # ตัวที่มาก่อน / แล้วแปลว่าเป็น regex literal ไม่ใช่หาร

def strip_code(src: str) -> str:
    """ตัด comment / string / regex literal ทิ้ง (คงจำนวนบรรทัดไว้เท่าเดิม เพื่อรายงานเลขบรรทัดถูก)
       ⚠️ regex literal ต้องตัดด้วย ไม่งั้นเครื่องหมาย ' หรือ " ข้างในจะถูกอ่านเป็นสตริง
          แล้วกลืนโค้ดจริงหายไปทั้งก้อน (เคยทำให้ util.js ทั้งไฟล์หายจากการสแกน)"""
    out, i, n = [], 0, len(src)
    last_sig = ""          # อักขระที่ไม่ใช่ช่องว่างตัวล่าสุดที่ "เก็บไว้จริง"
    while i < n:
        c = src[i]
        nxt = src[i + 1] if i + 1 < n else ""
        if c == "/" and nxt not in "/*" and (last_sig == "" or last_sig in REGEX_PREV):
            j, ok = i + 1, False
            while j < n and src[j] != "\n":
                if src[j] == "\\":
                    j += 2
                    continue
                if src[j] == "[":                      # [...] ในตัว regex อาจมี / ได้ ข้ามทั้งก้อน
                    while j < n and src[j] not in "]\n":
                        j += 2 if src[j] == "\\" else 1
                if src[j] == "/":
                    ok = True
                    j += 1
                    break
                j += 1
            if ok:
                while j < n and src[j].isalpha():      # flags gimsuy
                    j += 1
                i = j
                last_sig = "/"
                continue
        if c == "/" and nxt == "/":
            j = src.find("\n", i)
            i = n if j < 0 else j
        elif c == "/" and nxt == "*":
            j = src.find("*/", i + 2)
            j = n if j < 0 else j + 2
            out.append("\n" * src.count("\n", i, j))
            i = j
        elif c in "\"'":
            quote, j = c, i + 1
            while j < n:
                if src[j] == "\\":
                    j += 2
                    continue
                if src[j] == quote:
                    j += 1
                    break
                j += 1
            out.append("\n" * src.count("\n", i, j))
            i = j
        elif c == "`":
            # template literal: เนื้อความทิ้ง แต่ "โค้ดใน ${...} ต้องเก็บไว้" (โค้ดเกมนี้เรียกฟังก์ชันใน ${} เยอะมาก)
            # และต้องรองรับ template ซ้อน template ด้วย ไม่งั้นตัวสแกนหลงกลืนโค้ดจริงเป็นสตริงยาว
            j = i + 1
            while j < n:
                if src[j] == "\\":
                    j += 2
                    continue
                if src[j] == "\n":
                    out.append("\n")
                    j += 1
                    continue
                if src[j] == "`":
                    j += 1
                    break
                if src[j] == "$" and j + 1 < n and src[j + 1] == "{":
                    depth, k = 1, j + 2
                    while k < n and depth:                 # หาปีกกาปิดของ ${...} (นับซ้อน + ข้ามสตริง/template ใน)
                        ch = src[k]
                        if ch == "\\":
                            k += 2
                            continue
                        if ch in "\"'`":
                            q, k = ch, k + 1
                            while k < n:
                                if src[k] == "\\":
                                    k += 2
                                    continue
                                if src[k] == q:
                                    k += 1
                                    break
                                k += 1
                            continue
                        if ch == "{":
                            depth += 1
                        elif ch == "}":
                            depth -= 1
                        k += 1
                    out.append(strip_code(src[j + 2:k - 1]))   # โค้ดข้างใน ${} เก็บไว้สแกนต่อ
                    out.append(";")
                    j = k
                    continue
                j += 1
            i = j
            last_sig = "`"
        else:
            out.append(c)
            if not c.isspace():
                last_sig = c
            i += 1
    return "".join(out)

DEF_PATTERNS = [
    re.compile(r"\bfunction\s+([A-Za-z_$][\w$]*)"),
    re.compile(r"\bclass\s+([A-Za-z_$][\w$]*)"),
    re.compile(r"\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*="),
    re.compile(r"\bwindow\.([A-Za-z_$][\w$]*)\s*="),
    # เมธอด class / object shorthand / getter-setter: `ชื่อ(...){` · `get ชื่อ(){` — เรียกผ่าน obj.ชื่อ อยู่แล้ว
    re.compile(r"(?:async\s+|static\s+)*([A-Za-z_$][\w$]*)\s*\([^()]*\)\s*\{"),
    re.compile(r"\b(?:get|set)\s+([A-Za-z_$][\w$]*)\s*\("),
    re.compile(r"\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*[;,\n]"),   # ประกาศเปล่าๆ ค่อยกำหนดค่าทีหลัง
    # ตัวแปรที่ถูก "กำหนดค่า" ที่ไหนสักแห่ง (รวม let a=1, b=2, c=null; ที่ประกาศหลายตัวในบรรทัดเดียว)
    # ฟังก์ชันที่ลืมเขียนจริงๆ จะมีแต่การ "เรียก" ไม่มีการกำหนดค่า → ยังฟ้องได้อยู่
    re.compile(r"(?<![.\w$])([A-Za-z_$][\w$]*)\s*=(?!=)"),
]
# ชื่อพารามิเตอร์/ตัวแปรใน callback (เช่น new Promise((res,rej)=>...) · onOk, onDone ที่ส่งเข้ามา)
# ถือว่า "มีอยู่จริง" ทั้งหมด ไม่งั้นจะฟ้องผิดเพียบ
PARAM_RE = re.compile(r"\(([^()]{0,200}?)\)\s*(?:=>|\{)")
PARAM_NAME_RE = re.compile(r"[A-Za-z_$][\w$]*")
# โฟลเดอร์ที่ไม่ใช่โค้ดเกมที่เราเขียนเอง (ไลบรารีคนอื่น/ไฟล์ข้อมูลล้วน) — สแกนแล้วมีแต่ noise
SKIP_DIRS = ("vendor", "data")
CALL_RE = re.compile(r"(?<![.\w$])([A-Za-z_$][\w$]*)\s*\(")

def main():
    all_files = sorted(JS_DIR.rglob("*.js"))
    # ไฟล์ที่ "ตรวจการเรียก" = โค้ดเกมที่เราเขียนเอง · ส่วนนิยามเก็บจากทุกไฟล์ (data/vendor ก็นิยาม global ให้เกมใช้)
    files = [f for f in all_files
             if not any(part in SKIP_DIRS for part in f.relative_to(JS_DIR).parts[:-1])]
    if not files:
        print("❌ ไม่พบไฟล์ js/ — รันจากรากโปรเจกต์นะ")
        return 1
    cleaned = {}
    defined = set()
    for f in all_files:
        src = strip_code(f.read_text(encoding="utf-8", errors="replace"))
        if f in files:
            cleaned[f] = src
        for pat in DEF_PATTERNS:
            defined.update(pat.findall(src))
        for params in PARAM_RE.findall(src):
            defined.update(PARAM_NAME_RE.findall(params))

    known = defined | KEYWORDS | BUILTINS
    hits = []
    for f, src in cleaned.items():
        for ln, line in enumerate(src.split("\n"), 1):
            for name in CALL_RE.findall(line):
                if name in known:
                    continue
                hits.append((f, ln, name, line.strip()))

    # จัดกลุ่มตามชื่อ — ชื่อที่โผล่ครั้งเดียวคือกลุ่มที่น่าสงสัยที่สุด (พิมพ์ผิด/ลืมเขียนฟังก์ชัน)
    by_name = {}
    for f, ln, name, line in hits:
        by_name.setdefault(name, []).append((f, ln, line))

    print(f"🔍 สแกน {len(files)} ไฟล์ · นิยามที่พบ {len(defined)} ชื่อ · เรียกที่ไม่รู้จัก {len(by_name)} ชื่อ\n")
    if not by_name:
        print("✅ ไม่พบการเรียกฟังก์ชันที่ไม่รู้จักเลย")
        return 0
    for name in sorted(by_name, key=lambda k: (len(by_name[k]), k)):
        spots = by_name[name]
        mark = "⚠️ " if len(spots) == 1 else "   "
        print(f"{mark}{name}()  — {len(spots)} จุด")
        for f, ln, line in spots[: (99 if SHOW_ALL else 3)]:
            print(f"      {f.relative_to(ROOT).as_posix()}:{ln}  {line[:110]}")
    print("\n💡 ⚠️ = เรียกที่เดียวในโปรเจกต์ → เสี่ยงเป็นฟังก์ชันที่ลืมเขียน/พิมพ์ผิดมากที่สุด")
    print("   (ตัวที่เรียกหลายจุดมักเป็น global ของไลบรารีภายนอก เช่น firebase/THREE — ตรวจด้วยตาอีกที)")
    # exit 2 = เจอของน่าสงสัย → deploy_firebase.sh (set -e) หยุดทันที ไม่ปล่อยบั๊กเงียบขึ้นเว็บ
    # ถ้าเป็น global ภายนอกจริงๆ ให้เติมชื่อลง BUILTINS ด้านบน แล้วรันใหม่
    return 2

if __name__ == "__main__":
    sys.exit(main())
