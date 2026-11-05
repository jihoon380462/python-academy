import json
from lib import *
res=[];errs=[]
with sync_playwright() as p:
    b=launch(p); pg=newpage(b,'mobile',errs)
    pg.goto(BASE+'/courses/python/index.html'); pg.wait_for_timeout(700)
    pg.evaluate("Store.data.onboarded=true; Store.data.tourDone=true; Store.data.settings.unlockAll=true; Store.save({silent:true})"); pg.reload(); pg.wait_for_timeout(800)
    pg.evaluate("Py.start()")
    for _ in range(100):
        if pg.evaluate("Py.ready"): break
        pg.wait_for_timeout(200)
    probs=pg.evaluate("PROBLEMS.filter(p=>p.type==='fill').map(p=>({id:p.id,lesson:p.lesson,title:p.title,fill:p.fill}))")
    for q in probs:
        pid=q['id']; bl=q['fill']['blanks']
        def go():
            pg.evaluate("document.querySelectorAll('.modal-ov,.levelup-ov').forEach(m=>m.remove())")
            pg.evaluate("(()=>{const r=Store.prob('%s'); r.status=''; UI.go('problem',{pid:'%s',lessonId:'%s'})})()"%(pid,pid,q['lesson'])); pg.wait_for_timeout(120)
        def setall(vals):
            go()
            n=pg.evaluate("document.querySelectorAll('#pvMode .blank').length")
            for i,v in enumerate(vals):
                pg.evaluate("""([i,v])=>{const e=document.querySelectorAll('#pvMode .blank')[i]; e.value=v; e.dispatchEvent(new Event('change',{bubbles:true})); e.dispatchEvent(new Event('input',{bubbles:true}))}""",[i,v])
            pg.evaluate("document.querySelector('#btnGrade').click()"); pg.wait_for_timeout(450)
            return pg.evaluate("Store.prob('%s').status==='clear'"%pid), n
        correct=[x['a'][0] for x in bl]
        ok,n=setall(correct)
        res.append(dict(pid=pid,case='correct',got=ok,n=n,exp=True))
        # 각 빈칸: 선택지 하나씩 바꿔 봄(옵션이 있으면), 입력칸이면 변형 시도
        for i,x in enumerate(bl):
            opts=x.get('opt')
            if opts:
                for o in opts:
                    vals=list(correct); vals[i]=o
                    ok2,_=setall(vals); declared= o in x['a']
                    if ok2!=declared: res.append(dict(pid=pid,case='opt',blank=i,val=o,got=ok2,exp=declared,answers=x['a']))
            else:
                variants=[x['a'][0]+' ',' '+x['a'][0], x['a'][0].upper(), x['a'][0].replace('"',"'"), x['a'][0].replace("'",'"'), '']
                for v in variants:
                    vals=list(correct); vals[i]=v
                    ok2,_=setall(vals); declared=(v in x['a'])
                    res.append(dict(pid=pid,case='free',blank=i,val=v,got=ok2,exp=declared,answers=x['a']))
    b.close()
json.dump(dict(res=res,errs=errs),open('/home/claude/qa-out/fill.json','w'),ensure_ascii=False,indent=1)
print(len(res)); 
for r in res:
    if r['got']!=r['exp']: print(r)
