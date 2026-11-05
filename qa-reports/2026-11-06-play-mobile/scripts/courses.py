import json, sys
from lib import *
sys.path.insert(0,'.')
from audit import AUDIT_JS
res={}; errs={}
with sync_playwright() as p:
    b=launch(p)
    for c in ['algo','math','terminal-git','sql','web']:
        e=[]; lg=[]
        pg=newpage(b,'mobile',e,lg)
        pg.goto(f'{BASE}/courses/{c}/index.html'); pg.wait_for_timeout(1000)
        pg.evaluate("Store.data.onboarded=true; Store.data.tourDone=true; Store.data.settings.unlockAll=true; Store.save({silent:true})"); pg.reload(); pg.wait_for_timeout(1200)
        r={}
        r['home']=pg.evaluate(AUDIT_JS); shot(pg,f'c_{c}_home')
        info=pg.evaluate("({lessons:(typeof LESSONS!=='undefined'?LESSONS.length:null), probs:(typeof PROBLEMS!=='undefined'?PROBLEMS.length:null), draft:(typeof LESSONS!=='undefined'?LESSONS.filter(l=>l.draft).length:null), types:(typeof PROBLEMS!=='undefined'?Object.entries(PROBLEMS.reduce((m,p)=>(m[p.type]=(m[p.type]||0)+1,m),{})):null), first:(PROBLEMS[0]||{}).id, firstLesson:(LESSONS[0]||{}).id})")
        r['info']=info
        # 첫 레슨, 첫 문제 열기
        try:
            pg.evaluate("UI.go('lesson',{lessonId:'%s'})"%info['firstLesson']); pg.wait_for_timeout(1000)
            r['lesson']=pg.evaluate(AUDIT_JS); shot(pg,f'c_{c}_lesson'); r['lesson_text']=pg.evaluate("document.body.innerText.slice(0,300)")
        except Exception as ex: r['lesson_err']=str(ex)[:150]
        try:
            pid=info['first']
            les=pg.evaluate("PROBLEMS[0].lesson")
            pg.evaluate("UI.go('problem',{pid:'%s',lessonId:'%s'})"%(pid,les)); pg.wait_for_timeout(1200)
            r['problem']=pg.evaluate(AUDIT_JS); shot(pg,f'c_{c}_problem'); r['problem_text']=pg.evaluate("document.body.innerText.slice(0,400)")
        except Exception as ex: r['problem_err']=str(ex)[:150]
        r['pageerrors']=e[:5]; r['console']=[x for x in lg if 'Failed to load' not in x[1]][:6]
        res[c]=r; pg.context.close()
    b.close()
json.dump(res,open('/home/claude/qa-out/courses.json','w'),ensure_ascii=False,indent=1)
for c,r in res.items():
    print('==',c,r.get('info'),'pageerr',r['pageerrors'],r['console'][:3])
    for k in ('home','lesson','problem'):
        if k in r: a=r[k]; print('  ',k,'ovf',a['overflowX'],'small',len(a['small']),'tap',len(a['tap']),'contrast',len(a['contrast']),'clip',len(a['clipped']))
