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
  const run = async (code, checks, api) => { const f = document.createElement('iframe'); f.style.cssText = 'width:1024px;height:700px;border:0'; host.appendChild(f); const errs = []; const logs = []; const ready = await Web.render(f, code, { onError: (e) => errs.push(e.text), onConsole: (c) => logs.push(c.text) }, { api: Object.assign({ delay: 20 }, api || {}) }); await new Promise(r => setTimeout(r, 150)); const res = checks ? await Web.check(f, checks) : []; f.remove(); return { ready, errs, res, logs }; };
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
  // v2.14.0 웹 교과서(book.js): 「만들어 보기」 예시 답(파일 전체)을 미리보기에 넣고 checks 전부 ✓ 인지. mock 이 있으면 그 주소의 fetch 를 가짜 JSON 으로(Live Server·인터넷 대신)
  const bk = [];
  if (typeof BOOK !== 'undefined') {
    for (const [lid, ts] of Object.entries(BOOK.tasks || {})) for (const [i, t] of ts.entries()) {
      if (t.noRun || !(t.checks || []).length) continue;
      // 미리보기 iframe 은 sandbox 라 localStorage 가 막혀 있음 → 검사 때만 메모리 localStorage 로 대신(실제 브라우저·Live Server 에서는 진짜가 동작)
      let html = t.answer.replace('<head>', '<head><script>try{localStorage.getItem("x")}catch(e){var S={};Object.defineProperty(window,"localStorage",{configurable:true,value:{getItem:function(k){return Object.prototype.hasOwnProperty.call(S,k)?S[k]:null},setItem:function(k,v){S[k]=String(v)},removeItem:function(k){delete S[k]},clear:function(){S={}}}})}<\\/script>');
      if (t.mock) { const m = '<script>(function(){var M=' + JSON.stringify(t.mock) + ';var f=window.fetch;window.fetch=function(u,o){var s=String(u&&u.url||u);for(var k in M){if(s.indexOf(k)>=0){var st=(o&&o.method&&String(o.method).toUpperCase()==="POST")?201:200;var b=JSON.stringify(M[k]);return new Promise(function(r){setTimeout(function(){r(new Response(b,{status:st,headers:{"Content-Type":"application/json"}}))},30)})}}return f.apply(this,arguments)}})();<\\/script>'; html = html.replace('<head>', '<head>' + m); }
      const r = await run({ html }, t.checks);
      bk.push({ id: `${lid}#${i + 1} ${t.title}`, ready: r.ready, errs: r.errs, bad: r.res.filter(x => !x.ok).map(x => `${x.text} (지금: ${x.got})`) });
    }
    for (const [lid, pgs] of Object.entries(BOOK.lessonPages || {})) for (const [i, pg] of pgs.entries()) {
      const c = pg.example && pg.example.code; if (!c || !/^\\s*</.test(c)) continue;
      // v2.15.4: fetch("menu.json") 예제는 같은 레슨 앞 쪽의 menu.json 내용으로(Live Server 에서처럼). 본문의 「Console 에 <code>값</code>」·「실행하면 <code>값</code>」 이 실제 console.log 에 있는지도
      let html = c; const js = (pgs.find(q => q.example && /^\\s*[\\[{]/.test(q.example.code || '')) || {}).example; if (js && /fetch\\(\\s*["']menu\\.json/.test(c)) { const m = '<script>(function(){var B=' + JSON.stringify(js.code) + ';var f=window.fetch;window.fetch=function(u,o){if(String(u).indexOf("menu.json")>=0)return Promise.resolve(new Response(B,{status:200,headers:{"Content-Type":"application/json"}}));return f.apply(this,arguments)}})();<\\/script>'; html = /<head>/.test(c) ? c.replace('<head>', '<head>' + m) : m + c; }
      const r = await run({ html }, null); const ent = (x) => String(x).replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&'); const sq = (x) => x.replace(/\\s+/g, ' ').trim();
      const claims = []; for (const m of String(pg.html).matchAll(/([^.。>]{0,40})(?:Console 에|콘솔에|실행하면)([^.。]*?)(?=[.。]|<\\/p>|<\\/li>|$)/g)) if (!/고치|바꾸|바꿔|지우고/.test(m[1])) for (const v of m[2].matchAll(/<code>([\\s\\S]*?)<\\/code>/g)) { const t = ent(v[1]).trim(); if (t.length >= 2 && !sq(c).includes(sq(t))) claims.push(t); }
      const out = sq(r.logs.join('\\n')); const miss = /console\\.log/.test(c) ? claims.filter(t => !out.includes(sq(t))) : [];
      ex.push({ id: `book ${lid}/${i}`, ready: r.ready, errs: r.errs.concat(miss.map(t => `본문은 Console 에 「${t}」 인데 실제 console.log 에 없어요 — 실제: ${r.logs.join(' / ').slice(0, 160)}`)) });
    }
  }
  host.remove(); return { probs: out, ex, bk };
}"""
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=CHROME, args=['--no-sandbox', '--allow-file-access-from-files']) if CHROME else p.chromium.launch(args=['--no-sandbox', '--allow-file-access-from-files'])
    ctx = b.new_context(viewport={'width': 1280, 'height': 900}); pg = ctx.new_page(); perr = []
    pg.on('pageerror', lambda e: perr.append(str(e)[:300]))
    pg.goto(URL); pg.wait_for_timeout(600); pg.add_script_tag(path=os.path.join(ROOT, 'tools/web-preview.js'))  # v2.19.0 N13: 사이트는 Web 러너를 안 불러서 검사할 때만 넣음
    pg.evaluate("document.querySelectorAll('.modal-ov').forEach(m => m.remove())")
    r = pg.evaluate(JS); b.close()
fails = 0
for it in r['probs']:
    tag = '자유' if it['free'] else 'web'
    if it['bad']: fails += 1; print(f"✗ {it['id']} ({tag}) {it['title']}"); [print('    ' + m) for m in it['bad']]
    else: print(f"✓ {it['id']} ({tag}) {it['title']}")
    for m in it['warn']: print('    ⚠ ' + m)
for b in r.get('bk', []):
    if not b['ready'] or b['errs'] or b['bad']:
        fails += 1; print(f"✗ 교과서 {b['id']}"); [print('    ' + m) for m in (b['bad'] + [('JS 에러: ' + e) for e in b['errs']] + ([] if b['ready'] else ['미리보기 준비 안 됨']))]
    else: print(f"✓ 교과서 {b['id']}")
for e in r['ex']:
    if not e['ready'] or e['errs']: fails += 1; print(f"✗ 예제 {e['id']}: {'준비 안 됨' if not e['ready'] else ''} {' / '.join(e['errs'])}")
print(f"예제 {len(r['ex'])}개 렌더 확인 · web 문제 {len(r['probs'])}개 · 교과서 만들어 보기 {len(r.get('bk', []))}개 · 실패 {fails}")
if perr: print('페이지 에러(정답·예제 JS 에러는 위 항목에 포함):', perr[:5])
sys.exit(1 if fails else 0)
