from lib import *
with sync_playwright() as p:
    b=launch(p); pg=newpage(b,'mobile')
    pg.goto(BASE+'/courses/terminal-git/index.html'); pg.wait_for_timeout(800)
    pg.evaluate("Store.data.onboarded=true; Store.data.tourDone=true; Store.data.settings.unlockAll=true; Store.save({silent:true})"); pg.reload(); pg.wait_for_timeout(1200)
    pg.evaluate("(()=>{Store.prob('T0P1').status=''; UI.go('problem',{pid:'T0P1',lessonId:'T0'})})()"); pg.wait_for_timeout(900)
    pg.tap('text=작업'); pg.wait_for_timeout(400); pg.tap('.sh-in')
    for cmd in ['ls','ls | wc -l','ls | cat','ls -1','ls | head -n 1','echo a b c | wc -w','echo hi | cat','cat welcome.txt 2>/dev/null','cd projects/web','ls | grep html','cd ~','pwd']:
        pg.keyboard.type(cmd); pg.keyboard.press('Enter'); pg.wait_for_timeout(250)
        o=pg.evaluate("document.querySelector('.sh-out').innerText.split('\\n').filter(x=>x.trim()).slice(-2).join(' | ')")
        print(repr(cmd),'->',o[:150])
    b.close()
