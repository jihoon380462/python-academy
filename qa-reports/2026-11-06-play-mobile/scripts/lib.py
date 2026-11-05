import json, sys, time
from playwright.sync_api import sync_playwright
BASE='http://127.0.0.1:8766'
MOBILE=dict(viewport={'width':390,'height':844}, device_scale_factor=2, is_mobile=True, has_touch=True, user_agent='Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 Chrome/120 Mobile Safari/537.36')
DESK=dict(viewport={'width':1280,'height':900})
def launch(p):
    return p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])
def newpage(b, kind='mobile', errs=None, logs=None, **kw):
    ctx=b.new_context(**(MOBILE if kind=='mobile' else DESK), **kw)
    pg=ctx.new_page()
    if errs is not None: pg.on('pageerror', lambda e: errs.append(str(e)[:300]))
    if logs is not None: pg.on('console', lambda m: logs.append((m.type, m.text[:200])) if m.type in ('error','warning') else None)
    return pg
def shot(pg,name): pg.screenshot(path=f'/home/claude/qa-play/shots/{name}.png')
