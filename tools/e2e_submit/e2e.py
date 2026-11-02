# tools/e2e_submit/e2e.py — 실제 화면에서 코드·버그 문제(타자 연습 포함)의 정답을 넣고 「✔ 제출하기」 → 클리어 되는지.
# 사용: (server.py 를 띄운 뒤) python3 tools/e2e_submit/e2e.py python [L1P1,X3P1]   결과는 tools/.out/e2e_<코스>.json
import json, sys, time
from playwright.sync_api import sync_playwright
COURSE = sys.argv[1]; ONLY = sys.argv[2].split(',') if len(sys.argv) > 2 and sys.argv[2] else None
U = f'http://127.0.0.1:8766/courses/{COURSE}/index.html'
res = {'pass': [], 'fail': [], 'skip': [], 'errors': []}
with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])
    pg = b.new_page(viewport={'width': 1280, 'height': 900})
    pg.on('pageerror', lambda e: res['errors'].append(str(e)[:200]))
    pg.goto(U); pg.wait_for_timeout(800)
    pg.evaluate("Store.data.onboarded=true; Store.data.settings.unlockAll=true; Store.save({silent:true})"); pg.reload(); pg.wait_for_timeout(800)
    pg.evaluate("Py.start()")
    for _ in range(100):
        if pg.evaluate("Py.ready"): break
        pg.wait_for_timeout(200)
    print('Py.ready', pg.evaluate("Py.ready"), pg.evaluate("Py.main"), pg.evaluate("Py.error||''"))
    probs = pg.evaluate("PROBLEMS.concat(Content.allDrills()).filter(p=>['code','bug'].includes(p.type) && !p.quizOnly).map(p=>({id:p.id,type:p.type,lesson:p.lesson,drill:!!p.drill,sol:p.solution||'',bug:p.bug||null,blockOnly:p.type==='code'&&!p.dual&&(p.mode==='block')}))")
    for q in probs:
        pid = q['id']
        if ONLY and pid not in ONLY: continue
        if not q['sol']: res['skip'].append((pid, 'no solution')); continue
        sess = ",session:{drill:true,results:{},goto(){},pids:['%s']}" % pid if q['drill'] else ''
        pg.evaluate("document.querySelectorAll('.modal-bg').forEach(m=>m.remove())")
        pg.evaluate("(()=>{const r=Store.prob('%s'); r.status=''; r.mode='text'; UI.go('problem',{pid:'%s',lessonId:'%s'%s})})()" % (pid, pid, q['lesson'], sess))
        pg.wait_for_timeout(120)
        if q['type'] == 'bug':
            # 1단계: 틀린 줄 고르기
            pg.evaluate("(()=>{const b=[...document.querySelectorAll('#pvMode [data-line], #pvMode .bug-line, #pvMode .bl')].find(x=>+(x.dataset.line||x.dataset.ln)==%d); if(b) b.click();})()" % q['bug']['bugLine'])
            pg.wait_for_timeout(200)
        ta = pg.query_selector('#pvEd textarea')
        if not ta: res['skip'].append((pid, 'no textarea (mode=%s)' % pg.evaluate("document.querySelector('#pvMode')?.innerText.slice(0,60)"))); continue
        pg.evaluate("(s)=>{const t=document.querySelector('#pvEd textarea'); t.value=s; t.dispatchEvent(new Event('input'));}", q['sol'])
        pg.evaluate("document.querySelectorAll('.levelup-ov,.modal-bg').forEach(m=>m.remove()); document.querySelector('#btnGrade').click()")
        ok = False
        for _ in range(150):
            pg.wait_for_timeout(100)
            if pg.evaluate("Store.prob('%s').status==='clear'" % pid): ok = True; break
            txt = pg.evaluate("(document.querySelector('#pvResult')||{}).innerText||''")
            if '통과 못' in txt or '실패' in txt or '틀렸' in txt or ('✗' in txt): 
                pg.wait_for_timeout(300); break
        if ok: res['pass'].append(pid)
        else: res['fail'].append((pid, pg.evaluate("((document.querySelector('#pvResult')||{}).innerText||'').slice(0,300)"), pg.evaluate("((document.querySelector('#pvTests')||{}).innerText||'').slice(0,400)")))
        pg.evaluate("document.querySelectorAll('.modal-bg').forEach(m=>m.remove())")
    b.close()
import os; os.makedirs('tools/.out', exist_ok=True); json.dump(res, open(f'tools/.out/e2e_{COURSE}.json', 'w'), ensure_ascii=False, indent=1)
print('pass', len(res['pass']), 'fail', len(res['fail']), 'skip', len(res['skip']), 'pageerrors', len(res['errors']))
for f in res['fail'][:10]: print('FAIL', f)
for s in res['skip'][:10]: print('SKIP', s)
for e in res['errors'][:5]: print('ERR', e)
