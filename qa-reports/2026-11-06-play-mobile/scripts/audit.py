# 화면 점검: 가로 넘침, 작은 글자, 작은 터치 영역, 대비, 잘림, 겹침 — 화면·테마·폭별
import sys, json
from lib import *
AUDIT_JS = r'''
(() => {
  const out = {overflowX: document.documentElement.scrollWidth > innerWidth + 1, vw: innerWidth, small: [], tap: [], contrast: [], clipped: [], offscreen: []};
  const lum = c => { const [r,g,b] = c.map(v => { v/=255; return v<=0.03928? v/12.92 : Math.pow((v+0.055)/1.055,2.4)}); return 0.2126*r+0.7152*g+0.0722*b };
  const parse = s => { const m = s.match(/rgba?\(([^)]+)\)/); if(!m) return null; const a = m[1].split(',').map(x=>parseFloat(x)); return {c:a.slice(0,3), a: a.length>3? a[3]:1} };
  const bgOf = el => { let e = el; while (e && e !== document.documentElement) { const p = parse(getComputedStyle(e).backgroundColor); if (p && p.a > 0.95) return p.c; e = e.parentElement } return [255,255,255] };
  const vis = el => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width>0 && r.height>0 && cs.visibility!=='hidden' && cs.display!=='none' && +cs.opacity>0.05 };
  const label = el => (el.id? '#'+el.id : '') + '.' + String(el.className||'').toString().split(' ').filter(Boolean).slice(0,2).join('.') + ' "' + (el.innerText||el.value||'').trim().replace(/\s+/g,' ').slice(0,24) + '"';
  const all = [...document.body.querySelectorAll('*')];
  for (const el of all) {
    if (!vis(el)) continue;
    const cs = getComputedStyle(el), r = el.getBoundingClientRect();
    const own = [...el.childNodes].some(n => n.nodeType===3 && n.textContent.trim().length>0);
    if (own) {
      const fs = parseFloat(cs.fontSize);
      if (fs < 12) out.small.push([label(el), fs]);
      const fg = parse(cs.color); if (fg) {
        const bg = bgOf(el); const L1 = lum(fg.c), L2 = lum(bg); const ratio = (Math.max(L1,L2)+0.05)/(Math.min(L1,L2)+0.05) ;
        const need = fs >= 18.66 || (fs>=14 && +cs.fontWeight>=700) ? 3 : 4.5;
        if (ratio < need && fg.a > 0.5) out.contrast.push([label(el), +ratio.toFixed(2), fs]);
      }
      if (cs.overflow!=='visible' || cs.textOverflow==='ellipsis') { if (el.scrollWidth > el.clientWidth+2 && cs.textOverflow!=='ellipsis' && el.clientWidth>0) out.clipped.push([label(el), el.scrollWidth, el.clientWidth]) }
    }
    const isTap = el.matches('button, a[href], input, select, textarea, [role=button], [onclick], .btn, .chip, .tab') ;
    if (isTap && (r.width < 40 || r.height < 36) ) out.tap.push([label(el), Math.round(r.width), Math.round(r.height)]);
    if (r.right > innerWidth + 2 && r.width < innerWidth*2) out.offscreen.push([label(el), Math.round(r.right)]);
  }
  const dd = (a)=>{ const m = new Map(); a.forEach(x=>{const k=x[0]; if(!m.has(k)) m.set(k,x)}); return [...m.values()] };
  out.small = dd(out.small).slice(0,15); out.tap = dd(out.tap).slice(0,20); out.contrast = dd(out.contrast).slice(0,20); out.clipped = dd(out.clipped).slice(0,15); out.offscreen = dd(out.offscreen).slice(0,15);
  return out;
})()
'''
def run(kind, theme, hc, results, screens, errs):
    with sync_playwright() as p:
        b = launch(p); pg = newpage(b, kind, errs)
        pg.goto(BASE+'/courses/python/index.html'); pg.wait_for_timeout(700)
        pg.evaluate("Store.data.onboarded=true; Store.data.tourDone=true; Store.data.settings.theme=%r; Store.data.settings.contrast=%s; Store.save({silent:true})" % (theme, 'true' if hc else 'false'))
        pg.reload(); pg.wait_for_timeout(900)
        pg.evaluate("document.documentElement.setAttribute('data-theme','%s')" % theme)
        pg.evaluate("Py.start && Py.start()")
        for name, js in screens:
            try:
                pg.evaluate("document.querySelectorAll('.modal-ov,.levelup-ov').forEach(m=>m.remove())")
                pg.evaluate(js); pg.wait_for_timeout(700)
                a = pg.evaluate(AUDIT_JS)
                key = f'{kind}-{theme}{"-hc" if hc else ""}/{name}'
                results[key] = a
                if kind=='mobile' and theme=='dark' and not hc: shot(pg, 'aud_'+name)
            except Exception as e:
                results[f'{kind}-{theme}/{name}'] = {'error': str(e)[:200]}
        b.close()
if __name__=='__main__':
    screens = [
      ('home', "UI.go('home')"),
      ('lesson_L1', "UI.go('lesson',{lessonId:'L1'})"),
      ('problem_L1P1', "UI.go('problem',{pid:'L1P1',lessonId:'L1'})"),
      ('problem_L4P2', "UI.go('problem',{pid:'L4P2',lessonId:'L4'})"),
      ('settings', "UI.go('settings')"),
      ('stats', "UI.go('stats')"),
      ('badges', "UI.go('badges')"),
    ]
    results = {}; errs=[]
    for kind in ('mobile','desktop'):
        for theme, hc in (('dark',False),('light',False),('dark',True)):
            run(kind, theme, hc, results, screens, errs)
    json.dump(dict(results=results, errs=errs), open('/home/claude/qa-out/audit_python.json','w'), ensure_ascii=False, indent=1)
    print('ok', len(results), errs[:3])
