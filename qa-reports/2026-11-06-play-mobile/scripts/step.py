# usage: python3 step.py <session-name> <kind> <url-path-or-'-'> "<python snippet using pg, shot, T>"
import sys, os, json
from lib import *
name, kind, path, code = sys.argv[1:5]
sf=f'/home/claude/qa-play/state_{name}.json'
errs=[];logs=[]
with sync_playwright() as p:
    b=launch(p)
    kw={'storage_state':sf} if os.path.exists(sf) else {}
    pg=newpage(b,kind,errs,logs,**kw)
    if path!='-':
        pg.goto(BASE+path); pg.wait_for_timeout(1200)
    def T(n=1500): return pg.evaluate("document.body.innerText").strip()[:n]
    def S(n): shot(pg,f'{name}_{n}')
    g=dict(pg=pg,T=T,S=S,shot=shot,errs=errs,logs=logs,json=json)
    exec(code,g)
    pg.context.storage_state(path=sf)
    if errs: print('PAGEERRORS',errs[:5])
    b.close()
