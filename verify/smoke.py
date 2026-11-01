import asyncio, json, sys
from playwright.sync_api import sync_playwright
errors=[]; logs=[]
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox','--allow-file-access-from-files'])
    pg=b.new_page(viewport={'width':1280,'height':900})
    pg.on('console', lambda m: logs.append((m.type, m.text[:300])))
    pg.on('pageerror', lambda e: errors.append(str(e)[:500]))
    pg.goto('file:///home/claude/python_academy.html'); pg.wait_for_timeout(2500); pg.evaluate("Loader.minimized=true;Loader.render()")
    def closeov():
        for _ in range(3):
            if pg.locator('#luOk').count(): pg.click('#luOk'); pg.wait_for_timeout(200)
    def shot(n): pg.screenshot(path=f'/home/claude/verify/shot_{n}.png', full_page=False)
    # onboarding
    print('modal?', pg.locator('.modal').count()); pg.fill('#obNick','테스터'); pg.click('.ob-c[data-c="1"]'); shot('ob1'); pg.click('.modal-btns button'); pg.wait_for_timeout(300)
    pg.click('#obGoal button[data-g="3"]'); pg.click('.modal-btns button'); pg.wait_for_timeout(600); shot('ob_tour')
    # tour skip
    for _ in range(5):
        if pg.locator('.ob-tip button[data-a="s"]').count(): pg.click('.ob-tip button[data-a="s"]'); break
    pg.wait_for_timeout(500); shot('lesson0')
    print('view class', pg.get_attribute('#view','class'))
    # navigate lesson pages
    for i in range(5):
        if pg.locator('#lpNext').count(): pg.click('#lpNext'); pg.wait_for_timeout(200)
    shot('lesson0_summary')
    print('problem items', pg.locator('.pitem').count())
    pg.click('#startProbs'); pg.wait_for_timeout(400); shot('quiz')
    # answer quiz L0P1 correctly (ans 0)
    pg.click('.qopt[data-i="0"]'); pg.wait_for_timeout(1500); shot('quiz_clear')
    print('result', pg.locator('.result.ok').count(), 'xp text', pg.locator('.res-xp').inner_text() if pg.locator('.res-xp').count() else '-')
    # go home
    pg.click('#tbHome'); pg.wait_for_timeout(400); shot('home')
    print('nodes', pg.locator('.node').count(), 'topbar', pg.locator('#topbar').inner_text().replace('\n',' | '))
    # fill problem L1P4
    pg.evaluate("UI.go('problem',{pid:'L1P4',lessonId:'L1'})"); pg.wait_for_timeout(400); shot('fill')
    pg.select_option('.blank','"안녕"'); pg.click('#btnGrade'); pg.wait_for_timeout(1200); closeov(); print('fill result', pg.locator('.result.ok').count())
    # parsons L5P2
    pg.evaluate("UI.go('problem',{pid:'L5P2',lessonId:'L5'})"); pg.wait_for_timeout(400); shot('parsons')
    print('bank tiles', pg.locator('.pz-bank .pz-tile').count())
    # bug L2P4
    pg.evaluate("UI.go('problem',{pid:'L2P4',lessonId:'L2'})"); pg.wait_for_timeout(400); closeov(); pg.click('.bugline[data-i="2"]'); pg.wait_for_timeout(600); shot('bug2'); print('bug editor', pg.locator('.ted').count())
    # text code problem
    pg.evaluate("UI.go('problem',{pid:'L13P1',lessonId:'L13'})"); pg.wait_for_timeout(800); shot('code'); print('editor', pg.locator('.ted').count(), 'cm', pg.locator('.cm-editor').count(), 'stdin', pg.locator('#pvIn').count())
    # block problem (Blockly load will fail offline)
    pg.evaluate("UI.go('problem',{pid:'L1P1',lessonId:'L1'})"); pg.wait_for_timeout(1500); shot('block'); print('block', pg.locator('.bed').inner_text()[:60])
    # other views
    for v in ['badges','profile','inventory','settings','glossary','errors','weakness','timeattack','playground']:
        pg.evaluate(f"UI.go('{v}')"); pg.wait_for_timeout(500); shot(v); print(v, 'ok', pg.locator('#view').inner_text()[:40].replace('\n',' '))
    pg.evaluate("UI.go('checkup',{n:1})"); pg.wait_for_timeout(400); shot('checkup'); print('checkup', pg.locator('.qopt,.blank').count())
    # mobile
    pg.set_viewport_size({'width':390,'height':800}); pg.evaluate("UI.go('home')"); pg.wait_for_timeout(400); shot('m_home')
    pg.evaluate("UI.go('problem',{pid:'L13P1',lessonId:'L13'})"); pg.wait_for_timeout(600); shot('m_problem'); pg.click('.pv-tabs button[data-t="work"]'); pg.wait_for_timeout(300); shot('m_problem_work')
    print('scrollWidth', pg.evaluate('document.documentElement.scrollWidth'))
    b.close()
print('ERRORS', len(errors)); [print(' ',e) for e in errors]
print('CONSOLE', [l for l in logs if l[0] in ('error','warning')][:20])
