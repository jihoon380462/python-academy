#!/usr/bin/env python3
# tools/img_clean.py — docs/IMAGES.md 납품 검수·정리. `python3 tools/img_clean.py [--check] [파일...]`  (Pillow 필요: pip install pillow)
#   검사: 크기(512/256/1200×400), RGBA 투명 배경, 모서리 알파 0, 여백 ≥ 6%, 흰 테두리(스티커 후광) 유무
#   정리(--check 없을 때): 투명 배경에 맞닿은 흰색~회색(무채색) 테두리 픽셀을 지운다(최대 14겹)(다크 테마에서 흰 띠가 생기는 문제). 내부의 흰색(눈·종이)은 윤곽선에 막혀 그대로.
#            hero-hub.png 처럼 아래가 비어 있는 가로 배너는 내용 bbox + 8% 여백으로 잘라 세로를 줄인다.
import os, sys
try:
    from PIL import Image
except ImportError:
    print('Pillow 가 필요해요: pip install pillow'); sys.exit(2)
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); DIR = os.path.join(ROOT, 'assets', 'img')
check_only = '--check' in sys.argv; args = [a for a in sys.argv[1:] if not a.startswith('--')]
files = args or sorted(f for f in os.listdir(DIR) if f.endswith('.png'))
EXPECT = {'badge-': (256, 256), 'hero-': (1200, None), 'course-': (512, 512), 'boss-': (512, 512), 'chapter-': (512, 512), 'empty-': (512, 512), 'area-': (512, 512)}
def rim_pixels(im):
    w, h = im.size; px = im.load(); out = []
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a == 0 or not (min(r, g, b) > 100 and max(r, g, b) - min(r, g, b) < 36): continue  # 흰색~회색(무채색) 테두리만
            for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nx, ny = x + dx, y + dy
                if nx < 0 or ny < 0 or nx >= w or ny >= h or px[nx, ny][3] == 0: out.append((x, y)); break
    return out
problems = 0
for f in files:
    p = os.path.join(DIR, f) if not os.path.exists(f) else f; im = Image.open(p).convert('RGBA'); w, h = im.size; a = im.split()[3]; notes = []
    exp = next((v for k, v in EXPECT.items() if os.path.basename(f).startswith(k)), None)
    if exp and (w != exp[0] or (exp[1] and h != exp[1])): notes.append(f'크기 {w}x{h} (기대 {exp[0]}x{exp[1] or "자유"})')
    if any(a.getpixel(c) != 0 for c in ((0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1))): notes.append('모서리가 투명하지 않음')
    bbox = a.getbbox(); margin = min(bbox[0], bbox[1], w - bbox[2], h - bbox[3]) if bbox else 0
    if margin < 0.06 * min(w, h): notes.append(f'여백 {margin}px 부족')
    rim = rim_pixels(im)
    if len(rim) > 150: notes.append(f'흰 테두리 {len(rim)}px')
    changed = False
    if not check_only:
        px = im.load(); total = 0
        for _ in range(14):
            rim = rim_pixels(im)
            if not rim: break
            for x, y in rim: px[x, y] = (0, 0, 0, 0)
            total += len(rim)
        if total > 150: changed = True; notes.append(f'→ 흰 테두리 {total}px 제거')
        if os.path.basename(f).startswith('hero-'):
            bb = im.split()[3].getbbox(); pad = 24
            top = max(0, bb[1] - pad); bottom = min(h, bb[3] + pad)
            if bottom - top < h - 40: im = im.crop((0, top, w, bottom)); changed = True; notes.append(f'→ 세로 {h}→{im.size[1]} 잘라냄')
        if changed: im.save(p, optimize=True)
    status = '✓' if not [n for n in notes if not n.startswith('→')] or changed else '✗'
    if status == '✗': problems += 1
    print(f'{status} {os.path.basename(f):26s} {w}x{h} ' + (' · '.join(notes) if notes else 'OK'))
print(('문제 %d개' % problems) if problems else '✓ img_clean OK')
sys.exit(1 if problems and check_only else 0)
