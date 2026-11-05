import json
from lib import *
out={}
errs=[]
with sync_playwright() as p:
    b=launch(p); pg=newpage(b,'mobile',errs)
    pg.goto(BASE+'/courses/python/index.html'); pg.wait_for_timeout(700)
    pg.evaluate("Store.data.onboarded=true; Store.data.tourDone=true; Store.save({silent:true})"); pg.reload(); pg.wait_for_timeout(800)
    pg.evaluate("UI.go('problem',{pid:'L2P1',lessonId:'L2'})"); pg.wait_for_timeout(700)
    out['hash_on_problem']=pg.evaluate("location.hash")
    pg.tap('text=작업'); pg.wait_for_timeout(300)
    ta=pg.query_selector('#pvEd textarea'); ta.tap(); pg.keyboard.type('x = 5\nprint(x)'); pg.wait_for_timeout(600)
    # 1) 새로고침 후 코드 보존?
    pg.reload(); pg.wait_for_timeout(1200)
    out['after_reload_hash']=pg.evaluate("location.hash")
    out['after_reload_screen']=pg.evaluate("document.body.innerText.slice(0,80).replace(/\\n/g,' | ')")
    try:
        pg.tap('text=작업'); pg.wait_for_timeout(300)
        out['draft_kept']=pg.evaluate("(document.querySelector('#pvEd textarea')||{}).value")
    except Exception as e: out['draft_kept']='ERR '+str(e)[:80]
    # 2) 뒤로가기
    pg.evaluate("UI.go('home')"); pg.wait_for_timeout(400)
    pg.evaluate("UI.go('lesson',{lessonId:'L2'})"); pg.wait_for_timeout(400)
    pg.evaluate("UI.go('problem',{pid:'L2P1',lessonId:'L2'})"); pg.wait_for_timeout(400)
    pg.go_back(); pg.wait_for_timeout(500); out['back1']=pg.evaluate("location.hash+' | '+document.body.innerText.slice(0,40).replace(/\\n/g,' ')")
    pg.go_back(); pg.wait_for_timeout(700); out['back2']=pg.evaluate("location.href+' | '+document.body.innerText.slice(0,40).replace(/\\n/g,' ')")
    pg.goto(BASE+'/courses/python/index.html'); pg.wait_for_timeout(900)
    # 3) 힌트
    pg.evaluate("UI.go('problem',{pid:'L2P1',lessonId:'L2'})"); pg.wait_for_timeout(500)
    pg.tap('text=힌트 0/3'); pg.wait_for_timeout(500)
    out['hint1']=pg.evaluate("document.body.innerText").split('힌트')[1][:160].replace('\n',' | ') if '힌트' in pg.evaluate("document.body.innerText") else 'none'
    out['answer_btn_state']=pg.evaluate("(()=>{const b=[...document.querySelectorAll('button')].find(x=>x.innerText.includes('정답 보기')); return b? [b.disabled, b.getAttribute('title')||'', b.innerText]:null})()")
    S=lambda n: shot(pg,'ux_'+n)
    S('hint')
    # 4) 소프트 키보드 흉내: 뷰포트 높이 줄이기
    pg.tap('text=작업'); pg.wait_for_timeout(300)
    pg.set_viewport_size({'width':390,'height':420}); pg.wait_for_timeout(500)
    pg.query_selector('#pvEd textarea').tap(); pg.wait_for_timeout(500)
    out['kbd_run_btn_in_view']=pg.evaluate("(()=>{const r=document.querySelector('#btnGrade').getBoundingClientRect(); return [Math.round(r.top), Math.round(r.bottom), innerHeight]})()")
    S('kbd')
    # 5) 가로 모드
    pg.set_viewport_size({'width':844,'height':390}); pg.wait_for_timeout(600); S('landscape')
    out['landscape_overflow']=pg.evaluate("document.documentElement.scrollWidth>innerWidth+1")
    pg.set_viewport_size({'width':320,'height':640}); pg.wait_for_timeout(600); S('w320')
    out['w320_overflow']=pg.evaluate("document.documentElement.scrollWidth>innerWidth+1")
    pg.evaluate("UI.go('home')"); pg.wait_for_timeout(500); out['w320_home_overflow']=pg.evaluate("document.documentElement.scrollWidth>innerWidth+1"); S('w320_home')
    b.close()
out['errs']=errs
json.dump(out,open('/home/claude/qa-out/ux.json','w'),ensure_ascii=False,indent=1)
print(json.dumps(out,ensure_ascii=False,indent=1))
