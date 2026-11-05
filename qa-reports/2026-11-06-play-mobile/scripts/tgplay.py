import json
from lib import *
errs=[];out={}
with sync_playwright() as p:
    b=launch(p); pg=newpage(b,'mobile',errs)
    pg.goto(BASE+'/courses/terminal-git/index.html'); pg.wait_for_timeout(800)
    pg.evaluate("Store.data.onboarded=true; Store.data.tourDone=true; Store.data.settings.unlockAll=true; Store.save({silent:true})"); pg.reload(); pg.wait_for_timeout(1200)
    pg.evaluate("(()=>{Store.prob('T0P1').status=''; UI.go('problem',{pid:'T0P1',lessonId:'T0'})})()"); pg.wait_for_timeout(900)
    pg.tap('text=작업'); pg.wait_for_timeout(500)
    pg.tap('.sh-in')
    log=[]
    for cmd in ['pwd','ls','rm -rf /','cd projects','cd ..','git status','cd projects','cat nothere','ls -la','echo 안녕 > a.txt','sudo ls','clear','cd /nonexistent','mkdir','ls | wc -l']:
        pg.keyboard.type(cmd); pg.keyboard.press('Enter'); pg.wait_for_timeout(300)
        o=pg.evaluate("document.querySelector('.sh-out').innerText.split('\\n').filter(x=>x.trim()).slice(-3).join(' | ')")
        log.append((cmd,o[:160])); print(repr(cmd),'->',o[:160])
    out['log']=log
    out['goals']=pg.evaluate("[...document.querySelectorAll('[class*=goal] li, .ms-goal, .goal')].map(e=>e.className+':'+e.innerText.trim().slice(0,22))")
    print('goals',out['goals'])
    shot(pg,'tg_after')
    pg.tap('#btnGrade'); pg.wait_for_timeout(1500); shot(pg,'tg_submitted')
    out['status']=pg.evaluate("Store.prob('T0P1').status"); out['toast']=pg.evaluate("[...document.querySelectorAll('.toast')].map(t=>t.innerText)")
    print(out['status'],out['toast'])
    # 키보드 높이 흉내: 입력줄이 보이는가
    pg.set_viewport_size({'width':390,'height':420}); pg.wait_for_timeout(400); pg.tap('.sh-in'); pg.wait_for_timeout(400)
    out['input_in_view_with_kbd']=pg.evaluate("(()=>{const r=document.querySelector('.sh-in').getBoundingClientRect(); return [Math.round(r.top),Math.round(r.bottom),innerHeight]})()")
    shot(pg,'tg_kbd'); print(out['input_in_view_with_kbd'])
    out['errs']=errs
    b.close()
json.dump(out,open('/home/claude/qa-out/tg.json','w'),ensure_ascii=False,indent=1)
