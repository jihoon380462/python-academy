import json,subprocess,sys,tempfile,os
E=json.load(open('/home/claude/verify/examples.json'))
shim=open('/home/claude/verify/run.py').read().split("TURTLE_SHIM = '''")[1].split("'''")[0]
for e in E:
    with tempfile.TemporaryDirectory() as d:
        f=os.path.join(d,'s.py'); open(f,'w').write(shim+e['code'])
        r=subprocess.run([sys.executable,'-I',f],input=e['stdin'],capture_output=True,text=True,timeout=5,cwd=d)
        tag='OK ' if r.returncode==0 else 'ERR'
        print(tag, e['lesson'], e['page'], (r.stderr.strip().split('\n')[-1] if r.returncode else r.stdout.strip().replace('\n',' | ')[:70]))
