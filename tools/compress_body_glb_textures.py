#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""รอบ 1612: บีบเท็กซ์เจอร์ฝังใน body GLB — PNG→JPEG (ทุกภาพ OPAQUE ไม่ใช้ alpha)
- baseColor: คงมิติเดิม (2048) q86 · normal: คงมิติเดิม q92 (normal ไวต่ออาร์ทิแฟกต์)
- metallicRoughness: ย่อเหลือ 1024 q85 (ข้อมูลความถี่ต่ำ ไม่จำเป็นต้องละเอียด)
- กัน idempotent: ภาพที่เป็น JPEG แล้วจะข้าม · ใช้ได้กับทั้งต้นฉบับ characters/ และ runtime-models/
"""
import struct, json, io, os, sys
from PIL import Image

def parse_glb(path):
    data = open(path, 'rb').read()
    magic, version, length = struct.unpack_from('<III', data, 0)
    assert magic == 0x46546C67, 'not a GLB: %s' % path
    off = 12
    gltf = None
    binchunk = None
    while off < length:
        clen, ctype = struct.unpack_from('<II', data, off)
        off += 8
        chunk = data[off:off+clen]
        off += clen
        if ctype == 0x4E4F534A:
            gltf = json.loads(chunk.decode('utf-8'))
        elif ctype == 0x004E4942:
            binchunk = chunk
    return gltf, binchunk

def write_glb(path, gltf, binchunk):
    js = json.dumps(gltf, separators=(',', ':')).encode('utf-8')
    js += b' ' * ((4 - len(js) % 4) % 4)
    bn = binchunk + b'\x00' * ((4 - len(binchunk) % 4) % 4)
    total = 12 + 8 + len(js) + 8 + len(bn)
    with open(path, 'wb') as f:
        f.write(struct.pack('<III', 0x46546C67, 2, total))
        f.write(struct.pack('<II', len(js), 0x4E4F534A))
        f.write(js)
        f.write(struct.pack('<II', len(bn), 0x004E4942))
        f.write(bn)

def encode_jpeg(im, max_dim, quality):
    if max(im.size) > max_dim:
        r = max_dim / max(im.size)
        im = im.resize((max(1, round(im.size[0]*r)), max(1, round(im.size[1]*r))), Image.LANCZOS)
    buf = io.BytesIO()
    im.save(buf, 'JPEG', quality=quality)
    return buf.getvalue(), im.size

def plan_for(name):
    n = (name or '').lower()
    if 'metallic' in n or 'roughness' in n:
        return 1024, 85
    if 'normal' in n:
        return 4096, 92
    return 4096, 86  # baseColor คงมิติเดิม

def compress(path, dry=False):
    gltf, binchunk = parse_glb(path)
    images = gltf.get('images', [])
    if not images:
        print('  skip (no images): %s' % path)
        return
    old_size = os.path.getsize(path)
    # bufferViews ที่เป็นภาพ
    img_bv = {}
    for i, img in enumerate(images):
        if 'bufferView' not in img:
            continue
        bv = gltf['bufferViews'][img['bufferView']]
        raw = binchunk[bv['byteOffset']:bv['byteOffset']+bv['byteLength']]
        if img.get('mimeType') == 'image/jpeg':
            img_bv[i] = None  # บีบแล้ว ข้าม
            continue
        im = Image.open(io.BytesIO(raw)).convert('RGB')
        max_dim, q = plan_for(img.get('name'))
        jpg, newsize = encode_jpeg(im, max_dim, q)
        img_bv[i] = jpg
    if all(v is None for v in img_bv.values()):
        print('  skip (already JPEG): %s' % path)
        return
    # สร้าง BIN ใหม่: วาง bufferViews ตามลำดับเดิม (index เดิม ไม่กระทบ accessors)
    newbin = bytearray()
    for idx, bv in enumerate(gltf['bufferViews']):
        data = None
        for i, jpg in img_bv.items():
            if jpg is not None and images[i]['bufferView'] == idx:
                data = jpg
                break
        if data is None:
            off = bv['byteOffset']
            data = binchunk[off:off+bv['byteLength']]
        while len(newbin) % 4:
            newbin += b'\x00'
        bv['byteOffset'] = len(newbin)
        bv['byteLength'] = len(data)
        newbin += data
    gltf['buffers'][0]['byteLength'] = len(newbin)
    for i, jpg in img_bv.items():
        if jpg is not None:
            images[i]['mimeType'] = 'image/jpeg'
    if not dry:
        write_glb(path, gltf, bytes(newbin))
    print('  %s %.1f MB -> %.1f MB' % (os.path.basename(path), old_size/1e6, (12+8+0+8+len(newbin))/1e6))

def main():
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    vf = os.path.join(root, 'minigames', 'vocab-force')
    bodies = [
        ('characters/zom/animations', 'zom_Elderly_Shaky_Walk_in.glb'),
        ('characters/Lyravyn/animations', 'ly_Run.glb'),
        ('characters/next/animations', 'nex_walk.glb'),
        ('runtime-models/zom', 'zom_Elderly_Shaky_Walk_in.glb'),
        ('runtime-models/lyravyn', 'ly_Run.glb'),
        ('runtime-models/nex', 'nex_walk.glb'),
    ]
    for sub, name in bodies:
        p = os.path.join(vf, sub, name)
        if not os.path.exists(p):
            print('  missing: %s' % p)
            continue
        compress(p)

if __name__ == '__main__':
    main()
