from lib import *
with sync_playwright() as p:
    b=launch(p); pg=newpage(b,'mobile')
    pg.goto(BASE+'/courses/python/index.html'); pg.wait_for_timeout(800)
    pg.evaluate("Store.data.onboarded=true; Store.data.tourDone=true; Store.save({silent:true})"); pg.reload(); pg.wait_for_timeout(900)
    pg.evaluate("UI.go('problem',{pid:'L2P1',lessonId:'L2'})"); pg.wait_for_timeout(600)
    pg.tap('text=작업'); pg.tap('#pvEd textarea'); pg.keyboard.press('Control+A'); pg.keyboard.type('x = 5\nprint(x)'); 
    for wait in (500, 3000, 6000):
        pg.wait_for_timeout(wait)
        print(wait, 'ms saved?', pg.evaluate("JSON.stringify(Object.fromEntries(Object.entries(Store.prob('L2P1')).filter(([k,v])=>typeof v==='string'&&v.length<200)))"), '| LS has x=5:', pg.evaluate("Object.keys(localStorage).map(k=>[k,(localStorage.getItem(k)||'').includes('x = 5')])"))
    pg.evaluate("document.querySelector('#pvEd textarea').blur()"); pg.wait_for_timeout(800)
    print('after blur LS has x=5:', pg.evaluate("Object.keys(localStorage).map(k=>[k,(localStorage.getItem(k)||'').includes('x = 5')])"))
    pg.reload(); pg.wait_for_timeout(1000); pg.tap('text=이어서 풀기'); pg.wait_for_timeout(700); pg.tap('text=작업'); pg.wait_for_timeout(300)
    print('after reload:', repr(pg.evaluate("(document.querySelector('#pvEd textarea')||{}).value")))
    b.close()
