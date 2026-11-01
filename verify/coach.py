import asyncio, json
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--allow-file-access-from-files'])
        pg = await b.new_page(viewport={'width':1100,'height':800})
        await pg.add_init_script("localStorage.setItem('python_academy_save', JSON.stringify({v:1,onboarded:true,nick:'t',mascotColor:0,xp:0,badges:[],badgeDates:{},stats:{},problems:{},lessons:{}}))")
        await pg.goto('file:///home/claude/python_academy.html'); await pg.wait_for_timeout(800)
        r = await pg.evaluate("""()=>{
          const out=[]; const vars=new Set();
          for (const base of PROBLEMS.filter(x=>x.type==='block')) {
            const p = Content.instantiate(base, null); const div=document.createElement('div'); document.body.appendChild(div);
            const names = [...p.solution.matchAll(/^(\\w+) *=/gm)].map(m=>m[1]).concat([...p.solution.matchAll(/for (\\w+) in/g)].map(m=>m[1]));
            const c = Coach.mount(div, p, {status:''}, ()=>({ws:{getVariable:n=>names.includes(n)?{}:null}}));
            const steps = Content.guideFor(p);
            c.update(p.solution);
            const reached = div.querySelector('.coach-title b')?.textContent;
            out.push([p.id, steps.length, reached, steps[0].auto?'auto':'hand', reached==String(steps.length)?'OK':'STUCK']);
            div.remove();
          }
          return out; }""")
        for row in r: print(row)
        # 화면 확인: L2P3 코치 렌더
        await pg.evaluate("()=>UI.go('problem',{pid:'L2P3'})"); await pg.wait_for_timeout(1000)
        await pg.screenshot(path='verify/shot_coach.png')
        await b.close()
asyncio.run(main())
