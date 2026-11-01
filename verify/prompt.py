import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--allow-file-access-from-files'])
        pg = await b.new_page(viewport={'width':1100,'height':800})
        await pg.add_init_script("localStorage.setItem('python_academy_save', JSON.stringify({v:1,onboarded:true,nick:'t',mascotColor:0,xp:0,badges:[],badgeDates:{},stats:{},problems:{},lessons:{}}))")
        await pg.goto('file:///home/claude/python_academy.html'); await pg.wait_for_timeout(800)
        # Blockly 없이 setup의 다이얼로그 부분만 흉내: 스텁 Blockly.dialog
        r = await pg.evaluate("""async()=>{ window.Blockly={dialog:{setPrompt(f){window._p=f},setConfirm(f){},setAlert(f){}}, Blocks:{}}; try{ Blocks.setup(); }catch(e){ } if(!window._p) return 'no prompt override'; let got; window._p('새 변수 이름:','',v=>got=v); await new Promise(r=>setTimeout(r,100)); const inp=document.querySelector('.modal input'); inp.value='my age'; document.querySelector('.modal [data-a=ok]').click(); await new Promise(r=>setTimeout(r,50)); return got; }""")
        print('result:', r)
        await pg.evaluate("""()=>{ window._p("'x' 변수의 새 이름:",'x',v=>0); }""")
        await pg.wait_for_timeout(150); await pg.screenshot(path='verify/shot_varprompt.png')
        await b.close()
asyncio.run(main())
