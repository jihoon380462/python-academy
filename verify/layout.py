import asyncio, json
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--allow-file-access-from-files'])
        pg = await b.new_page(viewport={'width':1100,'height':800})
        await pg.add_init_script("localStorage.setItem('python_academy_save', JSON.stringify({v:1,onboarded:true,nick:'t',mascotColor:0,xp:0,badges:[],badgeDates:{},stats:{},problems:{},lessons:{}}))"); await pg.goto('file:///home/claude/python_academy.html')
        await pg.wait_for_timeout(800)
        await pg.evaluate("""()=>{ try{ Store.data.onboarded=true; Store.data.settings = Store.data.settings||{}; }catch(e){} }""")
        await pg.evaluate("()=>UI.go('problem',{pid:'L1P5'})")
        await pg.wait_for_timeout(1200)
        r = await pg.evaluate("""()=>{const q=s=>{const e=document.querySelector(s); if(!e) return null; const r=e.getBoundingClientRect(); return [Math.round(r.x),Math.round(r.width),Math.round(r.height)]}; return {pv:q('.pv'), desc:q('.pv-desc'), work:q('.pv-work'), bed:q('.bed'), cv:q('.codeview'), cls:document.querySelector('.pv')?.className}}""")
        print(json.dumps(r, ensure_ascii=False))
        await pg.screenshot(path='verify/shot_block_layout.png')
        await b.close()
asyncio.run(main())
