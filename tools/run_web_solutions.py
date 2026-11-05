#!/usr/bin/env python3
# tools/run_web_solutions.py — 웹·HTTP·API 코스 정답 검증 (배포 전 게이트, CI 의 regress 단계에서 같이 돎).
#   모든 type:'web' 문제(free 제외)의 p.solution 을 코스 페이지의 Web.render 로 미리보기에 넣고 Web.check(p.web.checks) 를 돌려 전부 ✓ 인지 본다.
#   또 starter 가 이미 전부 ✓ 이면(안 풀어도 통과) 에러. 레슨 example.web 은 렌더되고 JS 에러가 없는지 본다.
#   헤드리스 크롬(Playwright). CDN 불필요(편집기·Pyodide 안 씀). 로컬: /usr/bin/google-chrome, CI: playwright chromium.
import os, sys, json
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); URL = 'file://' + os.path.join(ROOT, 'courses/web/index.html')
CHROME = '/usr/bin/google-chrome' if os.path.exists('/usr/bin/google-chrome') else None
JS = """async () => {
  const out = []; const host = document.createElement('div'); host.style.cssText = 'position:fixed;left:0;top:0;width:1024px;height:700px;opacity:0.01;pointer-events:none'; document.body.appendChild(host);
  const run = async (code, checks, api) => { const f = document.createElement('iframe'); f.style.cssText = 'width:1024px;height:700px;border:0'; host.appendChild(f); const errs = []; const ready = await Web.render(f, code, { onError: (e) => errs.push(e.text) }, { api: Object.assign({ delay: 20 }, api || {}) }); await new Promise(r => setTimeout(r, 150)); const res = checks ? await Web.check(f, checks) : []; f.remove(); return { ready, errs, res }; };
  for (const p of PROBLEMS.filter(p => p.type === 'web')) {
    const w = p.web || {}; const item = { id: p.id, title: p.title, free: !!w.free, bad: [], warn: [] };
    if (w.free) { const r = await run(w.starter || {}, null, w.api); if (!r.ready) item.bad.push('starter 미리보기 준비 안 됨'); r.errs.forEach(e => item.warn.push('starter JS 에러: ' + e)); out.push(item); continue; }
    const sol = await run({ html: p.solution || '' }, w.checks, w.api);
    if (!sol.ready) item.bad.push('정답 미리보기 준비 안 됨(2.5초)');
    sol.errs.forEach(e => item.bad.push('정답 JS 에러: ' + e));
    sol.res.filter(r => !r.ok).forEach(r => item.bad.push(`정답이 「${r.text}」 통과 못 함 (지금: ${r.got})`));
    const st = await run(w.starter || {}, w.checks, w.api);
    if (st.res.length && st.res.every(r => r.ok)) item.bad.push('starter 가 이미 전부 ✓ — 안 풀어도 통과해요');
    out.push(item);
  }
  const ex = [];
  for (const l of LESSONS) for (const [i, pg] of (l.pages || []).entries()) { if (!pg.example || !pg.example.web) continue; const r = await run(pg.example.web, null, pg.example.api); ex.push({ id: `${l.id} p${i}`, ready: r.ready, errs: r.errs }); }
  host.remove(); return { probs: out, ex };
}"""
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=CHROME, args=['--no-sandbox', '--allow-file-access-from-files']) if CHROME else p.chromium.launch(args=['--no-sandbox', '--allow-file-access-from-files'])
    ctx = b.new_context(viewport={'width': 1280, 'height': 900}); pg = ctx.new_page(); perr = []
    pg.on('pageerror', lambda e: perr.append(str(e)[:300]))
    pg.goto(URL); pg.wait_for_timeout(600)
    pg.evaluate("document.querySelectorAll('.modal-ov').forEach(m => m.remove())")
    r = pg.evaluate(JS); b.close()
fails = 0
for it in r['probs']:
    tag = '자유' if it['free'] else 'web'
    if it['bad']: fails += 1; print(f"✗ {it['id']} ({tag}) {it['title']}"); [print('    ' + m) for m in it['bad']]
    else: print(f"✓ {it['id']} ({tag}) {it['title']}")
    for m in it['warn']: print('    ⚠ ' + m)
for e in r['ex']:
    if not e['ready'] or e['errs']: fails += 1; print(f"✗ 예제 {e['id']}: {'준비 안 됨' if not e['ready'] else ''} {' / '.join(e['errs'])}")
print(f"예제 {len(r['ex'])}개 렌더 확인 · web 문제 {len(r['probs'])}개 · 실패 {fails}")
if perr: print('페이지 에러(정답·예제 JS 에러는 위 항목에 포함):', perr[:5])
sys.exit(1 if fails else 0)
