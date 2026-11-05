# 억지로 부수기: 문법 에러·무한루프·대량 출력·위험 모듈·입력 오용 등을 L1P1(출력) 문제 화면에서 제출/실행해 보고 앱이 어떻게 반응·복구하는지 기록
import json, time
from lib import *
cases = [
 ('syntax_colon', 'if True\n    print(1)\n'),
 ('syntax_quote', 'print("안녕)\n'),
 ('fullwidth', 'print（"안녕"）\n'),
 ('tab_mix', 'if True:\n\tprint(1)\n        print(2)\n'),
 ('nameerror', 'print(abc)\n'),
 ('zero_div', 'print(1/0)\n'),
 ('infinite', 'while True:\n    pass\n'),
 ('infinite_print', 'while True:\n    print("가")\n'),
 ('huge_out', 'print("a"*5000000)\n'),
 ('many_lines', 'for i in range(200000):\n    print(i)\n'),
 ('recursion', 'def f(): return f()\nf()\n'),
 ('input_no_stdin', 'x=input()\nprint(x)\n'),
 ('input_loop', 'while True:\n    input()\n'),
 ('import_os', 'import os\nprint(os.listdir("/"))\n'),
 ('open_file', 'print(open("/etc/passwd").read()[:20])\n'),
 ('exit', 'import sys\nsys.exit(3)\n'),
 ('exit_builtin', 'exit()\n'),
 ('memory', 'x=[0]*(10**9)\nprint(len(x))\n'),
 ('unicode_emoji', 'print("😀"*3)\n'),
 ('null_char', 'print("a\\x00b")\n'),
 ('very_long_line', 'print(' + '"x"+' * 2000 + '"y")\n'),
 ('deep_nesting', 'print(' + '('*300 + '1' + ')'*300 + ')\n'),
 ('eval_exec', 'exec("print(7)")\n'),
 ('class_dunder', 'print(().__class__.__bases__[0].__subclasses__()[:1])\n'),
 ('time_sleep', 'import time\ntime.sleep(5)\nprint("끝")\n'),
]
res=[]; errs=[]
with sync_playwright() as p:
    b=launch(p); pg=newpage(b,'mobile',errs)
    pg.goto(BASE+'/courses/python/index.html'); pg.wait_for_timeout(800)
    pg.evaluate("Store.data.onboarded=true; Store.data.tourDone=true; Store.data.settings.unlockAll=true; Store.save({silent:true})"); pg.reload(); pg.wait_for_timeout(800)
    pg.evaluate("Py.start()")
    for _ in range(100):
        if pg.evaluate("Py.ready"): break
        pg.wait_for_timeout(200)
    for name, code in cases:
        pg.evaluate("document.querySelectorAll('.modal-ov,.levelup-ov').forEach(m=>m.remove())")
        pg.evaluate("(()=>{const r=Store.prob('L1P1'); r.status=''; r.mode='text'; UI.go('problem',{pid:'L1P1',lessonId:'L1'})})()")
        pg.wait_for_timeout(150)
        pg.evaluate("(s)=>{const t=document.querySelector('#pvEd textarea'); t.value=s; t.dispatchEvent(new Event('input'));}", code)
        t0=time.time()
        which = '#btnRun' if pg.query_selector('#btnRun') else None
        # 먼저 ▶ 실행, 그다음 제출 둘 다 해 본다
        for btn in (['#btnRun'] if which else []) + ['#btnGrade']:
            pg.evaluate("document.querySelector('%s').click()"%btn)
            settled=None
            for i in range(300):
                pg.wait_for_timeout(100)
                busy=pg.evaluate("(()=>{const b=document.querySelector('%s'); return b? (b.disabled||/중|⏳|…/.test(b.innerText)) : null})()"%btn)
                if not busy and i>3: settled=round(time.time()-t0,1); break
            out=pg.evaluate("((document.querySelector('#pvIo,.out-wrap,#pvResult')||{}).innerText||'').slice(0,160)")
            res_txt=pg.evaluate("((document.querySelector('#pvResult')||{}).innerText||'').slice(0,200)")
            alive=pg.evaluate("(()=>{try{return [document.querySelector('#btnGrade')&&!document.querySelector('#btnGrade').disabled, document.body.scrollWidth<=innerWidth+1]}catch(e){return String(e)}})()")
            res.append(dict(case=name,btn=btn,secs=settled,result=res_txt.replace('\n',' | '),io=out.replace('\n',' | '),alive=alive))
        # 복구 확인: 정답 코드가 다시 돌아가나
        pg.evaluate("(s)=>{const t=document.querySelector('#pvEd textarea'); t.value=s; t.dispatchEvent(new Event('input'));}", 'print(1)\n')
        pg.evaluate("document.querySelector('#btnRun')&&document.querySelector('#btnRun').click()")
        pg.wait_for_timeout(1500)
        rec=pg.evaluate("((document.querySelector('#pvIo,.out-wrap')||{}).innerText||'').slice(0,60)")
        res[-1]['recover']=rec.replace('\n',' | ')
        if name in ('infinite','huge_out','many_lines','memory'): pg.screenshot(path=f'/home/claude/qa-play/shots/brk_{name}.png')
    b.close()
json.dump(dict(res=res,errs=errs),open('/home/claude/qa-out/break.json','w'),ensure_ascii=False,indent=1)
for r in res: print(r['case'],r['btn'],r['secs'],'|',r['result'][:90],'|',r['io'][:60],'| rec:',r.get('recover'),r['alive'])
print('errs',errs[:5])
