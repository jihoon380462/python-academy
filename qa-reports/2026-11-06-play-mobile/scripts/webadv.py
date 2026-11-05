import json
from lib import *
with sync_playwright() as p:
    b=launch(p); e=[]; pg=newpage(b,'mobile',e)
    pg.goto(BASE+'/courses/web/index.html'); pg.wait_for_timeout(800)
    pg.evaluate("Store.data.onboarded=true; Store.data.tourDone=true; Store.data.settings.unlockAll=true; Store.save({silent:true})"); pg.reload(); pg.wait_for_timeout(1200)
    webs=pg.evaluate("PROBLEMS.filter(p=>p.type==='web').map(p=>({id:p.id,lesson:p.lesson,title:p.title,sol:p.solution,checks:JSON.stringify(p.web||p.checks||p.tests||'').slice(0,500)}))")
    print(json.dumps(webs,ensure_ascii=False)[:1400])
    q=webs[0]; pid=q['id']
    cases=[('correct',q['sol'],True),('empty','',False),('text_only','내 첫 페이지',False),('h2','<h2>내 첫 페이지</h2>',False),('upper','<H1>내 첫 페이지</H1>',True),('spaced','<h1 >내 첫 페이지</h1 >',True),('in_comment','<!-- <h1>내 첫 페이지</h1> -->',False),('in_script','<script>document.write("<h1>내 첫 페이지</h1>")</script>',None),('in_textarea','<textarea><h1>내 첫 페이지</h1></textarea>',False),('wrong_text','<h1>다른 글자</h1>',False),('unclosed','<h1>내 첫 페이지',None),('two_h1','<h1>내 첫 페이지</h1><h1>하나 더</h1>',None),('xss_alert','<h1>내 첫 페이지</h1><script>alert(1)</script>',None),('infinite_js','<h1>내 첫 페이지</h1><script>while(true){}</script>',None)]
    for name,code,exp in cases:
        pg.evaluate("document.querySelectorAll('.modal-ov,.levelup-ov').forEach(m=>m.remove())")
        pg.evaluate("(()=>{Store.prob('%s').status=''; UI.go('problem',{pid:'%s',lessonId:'%s'})})()"%(pid,pid,q['lesson'])); pg.wait_for_timeout(400)
        pg.evaluate("(s)=>{const t=document.querySelector('textarea.ted-ta'); t.value=s; t.dispatchEvent(new Event('input',{bubbles:true}))}",code)
        pg.wait_for_timeout(500)
        pg.evaluate("document.querySelector('#btnGrade').click()"); pg.wait_for_timeout(1500)
        st=pg.evaluate("Store.prob('%s').status"%pid)
        alive=pg.evaluate("document.body.innerText.length>50")
        print(name,'| clear' if st=='clear' else '| not-clear','| expected',exp,'| alive',alive)
    b.close()
