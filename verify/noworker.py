from playwright.sync_api import sync_playwright
errs=[]
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox','--allow-file-access-from-files'])
    pg=b.new_page(viewport={'width':390,'height':800})
    pg.add_init_script("window.Worker=function(){ throw new DOMException('Failed to construct Worker','SecurityError'); };")
    pg.on('pageerror', lambda e: errs.append(str(e)[:200])); pg.on('console', lambda m: errs.append(m.type+': '+m.text[:120]) if m.type in ('warning','error') else None)
    pg.goto('file:///home/claude/python_academy.html'); pg.wait_for_timeout(3000)
    print('main?', pg.evaluate('Py.main'), 'phase', pg.evaluate('Py.phase'), 'modal', pg.locator('.modal').count())
    print('loader:', pg.locator('#pyload').inner_text()[:80].replace('\n',' '))
    b.close()
print('pageerrors', errs)
