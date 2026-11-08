# 쓰기: python3 qa-reports/2026-11-08-python/tools/measure_clip.py <출력.json>
# 폰(390px)에서 모든 레슨 쪽을 열어 코드·에러 상자 가로 잘림, 제목 줄 수·간격, 13px 미만 글자, 쪽 길이·어절 수를 잰다. 읽기 전용.
import json, os, sys
from playwright.sync_api import sync_playwright
ROOT=os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..','..'))
M = r"""() => {
  const o={clip:[], docH:document.documentElement.scrollHeight, words:0, h1:0, gap:null, tip12:[], codeLines:0, pre:0};
  const art=document.querySelector('.bk-art')||document.querySelector('#view');
  o.words=(art.innerText||'').replace(/\s+/g,' ').trim().split(' ').length;
  // 가로로 잘리는 코드·에러 상자: 스크롤 너비가 보이는 너비보다 크면 잘림
  art.querySelectorAll('pre, .codebox, .bk-code, .bk-err, [class*=err] pre, textarea').forEach(e=>{
    o.pre++;
    const cw=e.clientWidth, sw=e.scrollWidth;
    if(sw>cw+2){
      // 잘린 줄: 보이는 폭을 넘는 첫 줄과 그 줄의 마지막 보이는 글자를 구함
      const lines=(e.innerText||'').split('\n'); let longest='';
      lines.forEach(l=>{ if(l.length>longest.length) longest=l; });
      const kind=e.closest('.bk-needs')?'needs': (/Error|Traceback|File "/.test(e.innerText)?'err':'code');
      o.clip.push({kind, hide:Math.round((sw-cw)), cw, sw, line:longest.slice(0,70)});
    }
  });
  const h=art.querySelector('h1.lp-h'); if(h){ const lh=parseFloat(getComputedStyle(h).lineHeight)||40; o.h1=Math.round(h.getBoundingClientRect().height/lh);
    const nx=h.nextElementSibling; if(nx) o.gap=Math.round(nx.getBoundingClientRect().top-h.getBoundingClientRect().bottom); }
  art.querySelectorAll('.bk-tip, .bk-tip *, kbd, .muted.small').forEach(e=>{ const fs=parseFloat(getComputedStyle(e).fontSize); if(fs<13 && (e.textContent||'').trim()) o.tip12.push([(e.textContent||'').trim().slice(0,24), +fs.toFixed(1)]); });
  o.tip12=o.tip12.slice(0,3);
  return o; }"""
rep={}
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox','--allow-file-access-from-files'])
    pg=b.new_page(viewport={'width':390,'height':844})
    pg.goto(f'file://{ROOT}/courses/python/index.html'); pg.wait_for_timeout(900)
    pg.evaluate("document.querySelectorAll('.modal-ov').forEach(e=>e.remove())")
    nset=pg.evaluate("BOOK.setup.pages.length")
    views=[('SETUP',i) for i in range(nset)]
    for lid,n in pg.evaluate("LESSONS.filter(l=>!l.draft||(BOOK.lessonPages||{})[l.id]||((BOOK.tasks||{})[l.id]||[]).length).map(l=>[l.id,((BOOK.lessonPages||{})[l.id]||l.pages||[]).length])"):
        views += [(lid,i) for i in range(n+1)]
    for lid,i in views:
        pg.evaluate(f"UI.go('lesson',{{lessonId:'{lid}',page:{i}}})"); pg.wait_for_timeout(90); pg.evaluate("window.scrollTo(0,0)")
        rep[f'{lid}/{i}']=pg.evaluate(M)
    b.close()
json.dump(rep,open(sys.argv[1],'w'),ensure_ascii=False)
n=len(rep); clipped=[k for k,v in rep.items() if v['clip']]
print('쪽',n,'| 코드·에러 상자가 잘리는 쪽',len(clipped))
from collections import Counter
c=Counter(x['kind'] for v in rep.values() for x in v['clip']); print('종류별 상자 수',dict(c))
print('상자 개수 합',sum(len(v['clip']) for v in rep.values()),'| 전체 pre 수',sum(v['pre'] for v in rep.values()))
