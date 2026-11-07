# tools/qa_screens.py — 사이트 전체 화면 검수(v2.22.2~ 전체 검수에서 만든 도구). 모든 코스의 모든 쪽(목차·시작하기·레슨 쪽·만들어 보기·도감)을 열어
#   ① 자동 측정: 글자 대비(WCAG 4.5:1) · 12.5px 미만 글자 · 24px 미만 누를 곳 · 가로 넘침 · 3줄 넘게 접힌 글 속 코드 · 3줄 넘는 제목 · 빈 상자 · 깨진 그림
#   ② 전체 캡처(--shots 1) → 사람이나 검수 에이전트가 눈으로 보기
# 쓰기: python3 tools/qa_screens.py --out /tmp/qa_pc --w 1440 --h 900            (PC 다크, 캡처)
#       python3 tools/qa_screens.py --out /tmp/qa_m --w 390 --h 844              (폰)
#       python3 tools/qa_screens.py --out /tmp/qa_l --theme light --shots 0      (라이트 대비만)
#       python3 tools/qa_screens.py --out /tmp/qa_b --w 390 --font 3 --shots 0   (폰 + 글자 아주 크게)
#       뒤에 코스 id 를 붙이면 그 코스만(예: ... linux sql). 결과 요약은 표준 출력, 화면별 값은 <out>/<코스>/report.json
#   「overflow」 에 dogam chip-btn · sql bk-res 가 나오는 건 가로 스크롤 상자라 정상. 필요: playwright + /usr/bin/google-chrome
import json, sys, os
from playwright.sync_api import sync_playwright
ROOT=os.path.abspath(os.path.join(os.path.dirname(__file__),'..'))
MEASURE = r"""() => {
  const lum = (c) => { const m = c.match(/[\d.]+/g); if (!m) return null; const [r,g,b,a] = m.map(Number); const f = v => { v/=255; return v<=0.03928? v/12.92 : Math.pow((v+0.055)/1.055,2.4) }; return {L:0.2126*f(r)+0.7152*f(g)+0.0722*f(b), a: a===undefined?1:a}; };
  const bgOf = (el) => { while (el) { const c = getComputedStyle(el).backgroundColor; const l = lum(c); if (l && l.a > 0.5) return l.L; el = el.parentElement; } return lum(getComputedStyle(document.body).backgroundColor).L; };
  const out = { lowContrast: [], tiny: [], longLines: [], overflow: [], smallTargets: [] };
  const seen = new Set();
  document.querySelectorAll('#view *').forEach(el => {
    const r = el.getBoundingClientRect(); if (!r.width || !r.height) return;
    const own = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length > 1);
    const cs = getComputedStyle(el);
    if (own && cs.visibility !== 'hidden' && +cs.opacity > 0.2) {
      const fg = lum(cs.color); const fs = parseFloat(cs.fontSize); const bold = +cs.fontWeight >= 700;
      const bg = bgOf(el); const ratio = (Math.max(fg.L,bg)+0.05)/(Math.min(fg.L,bg)+0.05);
      const need = (fs >= 24 || (fs >= 18.66 && bold)) ? 3 : 4.5;
      const txt = [...el.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent.trim()).join(' ').slice(0,30);
      if (ratio < need) { const k='c'+txt; if(!seen.has(k)){ seen.add(k); out.lowContrast.push([txt, ratio.toFixed(2), el.className.toString().slice(0,30), fs]); } }
      if (fs < 12.5) { const k='t'+txt; if(!seen.has(k)){ seen.add(k); out.tiny.push([txt, fs, el.className.toString().slice(0,30)]); } }
    }
    if (el.matches('p, li') && own) { const fs = parseFloat(cs.fontSize); const cpl = r.width / fs; if (cpl > 48) out.longLines.push([el.textContent.trim().slice(0,20), Math.round(r.width), Math.round(cpl)]); }
    if (!el.closest('pre') && r.right > document.documentElement.clientWidth + 1) out.overflow.push([el.tagName, el.className.toString().slice(0,30)]);
    if (el.matches('button, a, input, summary') && (r.height < 24 || r.width < 24) && el.offsetParent) out.smallTargets.push([el.tagName, (el.textContent||'').trim().slice(0,20), Math.round(r.width), Math.round(r.height)]);
  });
  out.longLines = out.longLines.slice(0,3); out.overflow = out.overflow.slice(0,5);
  const art = document.querySelector('.bk-art') || document.querySelector('#view'); const ar = art.getBoundingClientRect();
  out.col = [Math.round(ar.left), Math.round(ar.width)];
  return out;
}"""
EXTRA=r"""() => { const o={h1lines:0, chipTall:[], emptyBox:[], imgBroken:0};
 const h=document.querySelector('.bk-art h1.lp-h'); if(h){ const lh=parseFloat(getComputedStyle(h).lineHeight)||40; o.h1lines=Math.round(h.getBoundingClientRect().height/lh); }
 document.querySelectorAll('.bk-art p code, .bk-art li code').forEach(c=>{ const r=c.getBoundingClientRect(); const lh=parseFloat(getComputedStyle(c.parentElement).lineHeight)||24; if(r.height>lh*2.2 && o.chipTall.length<3) o.chipTall.push(c.textContent.slice(0,40)); });
 document.querySelectorAll('.bk-art pre, .bk-art .bk-task, .bk-art .card').forEach(e=>{ if(!e.textContent.trim()) o.emptyBox.push(e.className.toString().slice(0,20)); });
 document.querySelectorAll('img').forEach(i=>{ if(!i.complete||!i.naturalWidth) o.imgBroken++; });
 return o; }"""
import argparse
ap=argparse.ArgumentParser(); ap.add_argument('--out'); ap.add_argument('--w',type=int,default=1440); ap.add_argument('--h',type=int,default=900); ap.add_argument('--theme',default='dark'); ap.add_argument('--font',default='1'); ap.add_argument('--shots',type=int,default=1); ap.add_argument('courses',nargs='*')
A=ap.parse_args(); OUT=A.out
courses=A.courses or ['python','algo','math','terminal-git','github','sql','web','vim','linux','os']
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
    for c in courses:
        errs=[]; rep={}
        os.makedirs(f'{OUT}/{c}',exist_ok=True)
        pg=b.new_page(viewport={'width':A.w,'height':A.h}); pg.on('pageerror',lambda e:errs.append(str(e)[:120]))
        pg.goto(f'file://{ROOT}/courses/{c}/index.html'); pg.wait_for_timeout(900); pg.evaluate("document.querySelectorAll('.modal-ov').forEach(e=>e.remove())"); pg.evaluate(f"document.documentElement.dataset.theme='{A.theme}'; document.documentElement.dataset.font='{A.font}'")
        nset=pg.evaluate("BOOK.setup.pages.length")
        views=[('home',None)]+[('SETUP',i) for i in range(nset)]
        for lid,n in pg.evaluate("LESSONS.filter(l=>!l.draft||(BOOK.lessonPages||{})[l.id]||((BOOK.tasks||{})[l.id]||[]).length).map(l=>[l.id,((BOOK.lessonPages||{})[l.id]||l.pages||[]).length])"):
            views += [(lid,i) for i in range(n+1)]
        views += [('dogam',None)]
        for lid,i in views:
            if lid in ('home','dogam'): pg.evaluate(f"UI.go('{lid}')")
            else: pg.evaluate(f"UI.go('lesson',{{lessonId:'{lid}',page:{i}}})")
            pg.wait_for_timeout(90 if c!='math' else 250); pg.evaluate("window.scrollTo(0,0)")
            m=pg.evaluate(MEASURE); m.update(pg.evaluate(EXTRA)); m['docOver']=pg.evaluate('document.documentElement.scrollWidth')>A.w; rep[f'{lid}/{i}']=m
            (pg.screenshot(path=f'{OUT}/{c}/{lid}_{i}.png', full_page=True) if A.shots else None)
        pg.close()
        json.dump(rep, open(f'{OUT}/{c}/report.json','w'), ensure_ascii=False)
        lc={}; tiny={}; small={}; chip=[]; h1=[]; empty=[]; over=[]; img=0
        for k,m in rep.items():
            for x in m['lowContrast']: lc.setdefault((x[0][:24],x[1],x[2][:20]),k)
            for x in m['tiny']: tiny.setdefault((x[0][:16],round(x[1],1),x[2][:20]),k)
            for x in m['smallTargets']: small.setdefault((x[0],x[1][:16]),k)
            if m['chipTall']: chip.append((k,m['chipTall'][0]))
            if m['h1lines']>=3: h1.append((k,m['h1lines']))
            if m['emptyBox']: empty.append((k,m['emptyBox'][:2]))
            if m['overflow'] or m.get('docOver'): over.append((k,m['overflow'][:2],m.get('docOver')))
            img+=m['imgBroken']
        print(f'== {c}: views {len(rep)} errs {len(errs)} {errs[:2]}')
        print('  lowContrast', len(lc), list(lc.items())[:6])
        print('  tiny', len(tiny), list(tiny.items())[:6])
        print('  smallTargets', len(small), [k for k in small][:8])
        print('  chipTall', len(chip), chip[:5]); print('  h1>=3lines', len(h1), h1[:5]); print('  empty', len(empty), empty[:4]); print('  overflow', len(over), over[:4], 'imgBroken', img)
    # hub & app views
    pg=b.new_page(viewport={'width':A.w,'height':A.h}); pg.goto(f'file://{ROOT}/index.html'); pg.wait_for_timeout(800)
    pg.screenshot(path=f'{OUT}/hub.png', full_page=True); m=pg.evaluate(MEASURE); print('== hub', {k:(v[:5] if isinstance(v,list) else v) for k,v in m.items()})
    pg.goto(f'file://{ROOT}/courses/python/index.html'); pg.wait_for_timeout(800)
    for v in ['settings','glossary','errors']:
        pg.evaluate(f"UI.go('{v}')"); pg.wait_for_timeout(300); pg.screenshot(path=f'{OUT}/app_{v}.png', full_page=True); m=pg.evaluate(MEASURE); print('==',v,{k:(v2[:5] if isinstance(v2,list) else v2) for k,v2 in m.items()})
    b.close()
