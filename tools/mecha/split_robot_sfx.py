#!/usr/bin/env python3
"""Split sound/robot/allroboteffect.mp3 into situation clips under sound/robot/mecha/."""
import hashlib, subprocess
from pathlib import Path
SRC = Path('sound/robot/allroboteffect.mp3')
OUT = Path('sound/robot/mecha')
CUTS = {
  'step_a': (34.30, 35.05, 20),
  'step_b': (44.80, 45.50, 20),
  'impact_a': (46.40, 47.15, 25),
  'impact_b': (65.12, 66.10, 30),
  'explode_a': (6.08, 7.20, 40),
  'explode_b': (87.82, 88.90, 40),
  'warn_a': (80.00, 80.55, 15),
  'warn_b': (83.58, 84.55, 20),
  'enemy_a': (18.32, 18.95, 15),
  'enemy_b': (24.98, 25.45, 15),
  'pickup_a': (35.98, 36.80, 25),
  'pickup_b': (42.22, 43.20, 25),
  'shield': (19.74, 20.70, 30),
  'fire_var_a': (74.38, 74.75, 10),
  'fire_var_b': (75.38, 75.75, 10),
  'servo': (109.64, 110.15, 15),
}
def main():
  OUT.mkdir(parents=True, exist_ok=True)
  lines = []
  for name, (st, en, fade) in CUTS.items():
    dest = OUT / f'{name}.mp3'
    af = f'afade=t=in:st=0:d={fade/1000},afade=t=out:st={max(0,(en-st)-fade/1000)}:d={fade/1000}'
    subprocess.check_call([
      'ffmpeg','-y','-hide_banner','-loglevel','error','-ss',f'{st:.3f}','-to',f'{en:.3f}','-i',str(SRC),
      '-af',af,'-codec:a','libmp3lame','-q:a','4',str(dest)])
    b = dest.read_bytes(); h = hashlib.md5(b).hexdigest()[:16]
    lines.append(f'{name}\t{dest.stat().st_size}\t{h}\t{st:.3f}-{en:.3f}')
    print(name, dest.stat().st_size, h)
  (OUT/'MANIFEST.txt').write_text('\n'.join(lines)+'\n', encoding='utf-8')
if __name__ == '__main__':
  main()
