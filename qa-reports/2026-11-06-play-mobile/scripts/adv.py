# 적대적 채점 플레이: 실제 화면(제출 버튼)으로 변형 코드를 넣어 보고 클리어 여부를 기록
import sys, json, re
from lib import *
SHARD=int(sys.argv[1]); NSH=int(sys.argv[2]); COURSE=sys.argv[3] if len(sys.argv)>3 else 'python'
U=f'{BASE}/courses/{COURSE}/index.html'
res=[]; errs=[]
def variants(q):
    sol=q['sol']; tests=q['tests']; out=[]
    t0=tests[0] if tests else {}
    out.append(('empty','', 'fail'))
    out.append(('comment','# 나중에 쓸게요\n', 'fail'))
    if t0.get('output') is not None:
        o=t0['output']
        out.append(('hardcode_t0', 'import sys\nsys.stdout.write(%r)\n' % (o+'\n'), 'fail'))
    if t0.get('ret') is not None and t0.get('call'):
        name=t0['call'].split('(')[0]
        out.append(('hardcode_call', 'def %s(*a, **k):\n    return %s\n' % (name, t0['ret']), 'fail'))
    # 정답을 억지로 꼰 것 (전부 통과해야 정상)
    out.append(('twist_trailing_blank', sol+'\n\n\n', 'pass'))
    out.append(('twist_crlf', sol.replace('\n','\r\n'), 'pass'))
    out.append(('twist_trail_spaces', '\n'.join(l+'  ' for l in sol.split('\n'))+'\n', 'pass'))
    out.append(('twist_exec', 'exec(compile(%r, "<x>", "exec"))\n' % sol, 'pass'))
    out.append(('twist_pass_noise', 'pass\n'+sol+'\npass\n', 'pass'))
    # 한 글자 변이(결과가 달라져야 하는 것) — 살아남으면 테스트가 약하다는 후보
    ops=[('+','-'),('-','+'),('<=','<'),('>=','>'),('<','<='),('>','>='),('==','!='),(' and ',' or '),(' or ',' and '),('+ 1','+ 2'),('- 1','- 2'),('range(','range(1+'),('[0]','[1]'),('[-1]','[0]'),('//','/'),('%','//'),('*','+')]
    seen=set()
    for a,b in ops:
        i=sol.find(a)
        if i>=0:
            m=sol[:i]+b+sol[i+len(a):]
            if m!=sol and m not in seen:
                seen.add(m); out.append(('mut:%s->%s'%(a.strip(),b.strip()), m, 'mut'))
        if len(seen)>=5: break
    return out
with sync_playwright() as p:
    b=launch(p); pg=newpage(b,'mobile',errs)
    pg.goto(U); pg.wait_for_timeout(800)
    pg.evaluate("Store.data.onboarded=true; Store.data.settings.unlockAll=true; Store.save({silent:true})"); pg.reload(); pg.wait_for_timeout(800)
    pg.evaluate("Py.start()")
    for _ in range(100):
        if pg.evaluate("Py.ready"): break
        pg.wait_for_timeout(200)
    probs=pg.evaluate("""PROBLEMS.filter(p=>p.type==='code' && !p.quizOnly && !p.turtle).map(p=>{const i=p.vary?Content.instantiate(p,Content.defaultParams(p)):p; return {id:p.id,lesson:p.lesson,sol:i.solution||'',tests:(i.tests||[]).map(t=>({input:t.input,output:t.output,call:t.call,ret:t.ret})),n:(i.tests||[]).length}})""")
    probs=[q for i,q in enumerate(probs) if i%NSH==SHARD and q['sol']]
    for q in probs:
        pid=q['id']
        for vname,code,exp in variants(q):
            pg.evaluate("document.querySelectorAll('.modal-ov,.modal-bg,.levelup-ov').forEach(m=>m.remove())")
            pg.evaluate("(()=>{const r=Store.prob('%s'); r.status=''; r.mode='text'; UI.go('problem',{pid:'%s',lessonId:'%s'})})()"%(pid,pid,q['lesson']))
            pg.wait_for_timeout(100)
            ta=pg.query_selector('#pvEd textarea')
            if not ta: res.append(dict(pid=pid,v=vname,exp=exp,got='no_textarea')); break
            pg.evaluate("(s)=>{const t=document.querySelector('#pvEd textarea'); t.value=s; t.dispatchEvent(new Event('input'));}", code)
            pg.evaluate("document.querySelector('#btnGrade').click()")
            got='timeout'
            for _ in range(80):
                pg.wait_for_timeout(100)
                if pg.evaluate("Store.prob('%s').status==='clear'"%pid): got='pass'; break
                txt=pg.evaluate("(document.querySelector('#pvResult')||{}).innerText||''")
                if txt.strip() and ('통과 못' in txt or '실패' in txt or '틀렸' in txt or '✗' in txt or '에러' in txt or '오류' in txt): 
                    pg.wait_for_timeout(250)
                    if pg.evaluate("Store.prob('%s').status==='clear'"%pid): got='pass'
                    else: got='fail'
                    break
            res.append(dict(pid=pid,v=vname,exp=exp,got=got,ntests=q['n']))
    b.close()
json.dump(dict(res=res,errs=errs),open(f'/home/claude/qa-out/adv_{COURSE}_{SHARD}.json','w'),ensure_ascii=False)
print('done',SHARD,len(res),len(errs))
