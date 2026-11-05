import json
from lib import *
with sync_playwright() as p:
    b=launch(p); e=[]; pg=newpage(b,'mobile',e)
    fails=[]
    pg.on('response', lambda r: fails.append((r.status, r.url)) if r.status>=400 else None)
    pg.goto(BASE+'/courses/python/index.html'); pg.wait_for_timeout(800)
    pg.evaluate("Store.data.onboarded=true; Store.data.tourDone=true; Store.data.settings.unlockAll=true; Store.save({silent:true})"); pg.reload(); pg.wait_for_timeout(1000)
    pg.evaluate("(()=>{Store.prob('L1P1').status=''; UI.go('problem',{pid:'L1P1',lessonId:'L1'})})()"); pg.wait_for_timeout(600)
    pg.tap('text=작업'); pg.wait_for_timeout(300)
    pg.tap('#pvEd textarea'); pg.keyboard.type('while True:\n    pass'); 
    pg.tap('#btnRun'); pg.wait_for_timeout(2500)
    print('run@2.5s', pg.evaluate("[...document.querySelectorAll('button')].filter(b=>b.getBoundingClientRect().height>0&&b.innerText.trim()).map(b=>b.innerText.trim().slice(0,12)+(b.disabled?'(off)':'')).slice(-8)"), pg.evaluate("(document.querySelector('.out-wrap,#pvIo')||{innerText:''}).innerText.slice(0,80)"))
    shot(pg,'loop_2s')
    pg.wait_for_timeout(9000)
    print('run@12s', pg.evaluate("(document.body.innerText.match(/끝나지[^\\n]*/)||['(no msg)'])[0]"))
    shot(pg,'loop_12s')
    print('FAILS',fails[:6]); print('ERR',e)
    b.close()
