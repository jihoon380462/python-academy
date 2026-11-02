#!/usr/bin/env python3
# tools/run_solutions.py — 배포 전 게이트 2. 모든 코스의 정답 코드를 CPython으로 돌려 테스트 케이스를 전부 통과하는지 확인한다.
#   사용: node tools/extract.mjs && python3 tools/run_solutions.py   (Actions와 로컬 동일)
#   runner별: python → CPython -I (거북이는 심), sql → sqlite3 (Phase 3), shell → Node 시뮬레이터 (Phase 2), web → Playwright (Phase 4)
import json, subprocess, sys, tempfile, os, re, time
HERE=os.path.dirname(os.path.abspath(__file__)); OUT=os.path.join(HERE,'.out')
if not os.path.exists(os.path.join(OUT,'problems.json')): subprocess.run(['node',os.path.join(HERE,'extract.mjs'),OUT],check=True)
P=json.load(open(os.path.join(OUT,'problems.json'),encoding='utf-8'))
TURTLE_SHIM = '''
import sys, types, math
_m=types.ModuleType('turtle'); _s={'x':0.0,'y':0.0,'h':0.0,'pen':True,'segs':[]}
def forward(d):
    d=float(d); r=math.radians(_s['h']); nx=_s['x']+math.cos(r)*d; ny=_s['y']+math.sin(r)*d
    if _s['pen']: _s['segs'].append((round(_s['x'],2),round(_s['y'],2),round(nx,2),round(ny,2)))
    _s['x']=nx; _s['y']=ny
def backward(d): forward(-float(d))
def left(a): _s['h']=(_s['h']+float(a))%360
def right(a): left(-float(a))
def penup(): _s['pen']=False
def pendown(): _s['pen']=True
for k in ['color','width','speed','done','clear','begin_fill','end_fill']: setattr(_m,k,lambda *a,**kw: None)
for k,v in dict(forward=forward,backward=backward,left=left,right=right,penup=penup,pendown=pendown).items(): setattr(_m,k,v)
sys.modules['turtle']=_m
import atexit
atexit.register(lambda: sys.stderr.write('__SEGS__'+str(len(_s['segs']))+'\\n'))
'''
def norm(s): return '\n'.join(l.rstrip() for l in s.replace('\r','').split('\n')).strip('\n')
def run(code, stdin='', call=None, turtle=False, files=None, out_files=None):
    src = (TURTLE_SHIM if turtle else '') + code
    if call: src += '\nprint("__RET__", repr(' + call + '))'
    with tempfile.TemporaryDirectory() as d:
        f=os.path.join(d,'s.py'); open(f,'w',encoding='utf-8').write(src)
        for fl in (files or []): open(os.path.join(d,fl['name']),'w',encoding='utf-8').write(fl['text'])
        try:
            r=subprocess.run([sys.executable,'-I',f],input=stdin,capture_output=True,text=True,timeout=10,cwd=d)
        except subprocess.TimeoutExpired: return None,'TIMEOUT',None,None
        outf={}
        for name in (out_files or []):
            fp=os.path.join(d,name)
            if os.path.exists(fp): outf[name]=open(fp,encoding='utf-8').read()
        out=r.stdout; ret=None
        if call:
            m=re.search(r'__RET__ (.*)$', out.strip().split('\n')[-1]) if out.strip() else None
            ret=m.group(1) if m else None
            out='\n'.join(out.split('\n')[:-2]) if out.strip() else out
        segs=None
        if turtle:
            m=re.search(r'__SEGS__(\d+)', r.stderr); segs=int(m.group(1)) if m else None
        return out, r.stderr if r.returncode else '', ret if not turtle else segs, outf
fails=[]; computed={}; table=[]
for p in P:
    if p.get('runner') not in (None,'python'):
        fails.append((p['id'],f"runner {p['runner']} 검증기는 아직 없음 (해당 Phase에서 추가)")); continue
    tests=p['tests'] or []
    if p['type'] in ('quiz','fill','match','pair'): table.append((p,len(tests))); continue
    if p['type']=='num':   # 수학 공간 숫자 답: 정답 코드가 print 한 마지막 숫자가 answer.value 와 tol 안에서 같아야 한다 (v2.3.0)
        a=p.get('answer') or {}
        if not p['solution']: fails.append((p['id'],'num: solution(계산 코드) 없음')); continue
        out,err,_,_=run(p['solution'],'')
        if err: fails.append((p['id'],f'num error: {err.strip()[-200:]}')); continue
        nums=re.findall(r'-?\d+(?:\.\d+)?(?:e[-+]?\d+)?', out or '', re.I)
        if not nums: fails.append((p['id'],'num: 정답 코드가 숫자를 출력하지 않음')); continue
        v=float(nums[-1]); tol=a.get('tol') if a.get('tol') is not None else abs(a['value'])*0.01
        if abs(v-a['value'])>tol+1e-9: fails.append((p['id'],f"num: 코드 결과 {v} ≠ answer.value {a['value']} (tol {tol})"))
        table.append((p,1)); continue
    if not p['solution']: fails.append((p['id'],'no solution')); continue
    if not tests: fails.append((p['id'],'no tests')); continue
    for i,t in enumerate(tests):
        stdin=t.get('input','')
        if t.get('inputGen'):
            g=subprocess.run([sys.executable,'-I','-c','import sys; sys.stdout.write(str('+t['inputGen']+'))'],capture_output=True,text=True,timeout=20)
            if g.returncode: fails.append((p['id'],f'test{i+1} inputGen error: {g.stderr.strip()[-200:]}')); continue
            stdin=g.stdout
        t0=time.perf_counter()
        files=t.get('files') or ([{'name':(p['files'].get('upload') or {}).get('name','data.csv'),'text':(p['files'].get('upload') or {}).get('sample','')}] if p.get('files') and p['files'].get('upload') else None)
        out,err,extra,outf=run(p['solution'], stdin , t.get('call'), p['turtle'], files, (p.get('files') or {}).get('outputs'))
        el=time.perf_counter()-t0
        if p.get('limits') and p['limits'].get('time') and el>p['limits']['time']*0.5: fails.append((p['id'],f'test{i+1} 정답이 제한의 50%를 넘음 ({el:.2f}s > {p["limits"]["time"]*0.5:.2f}s)'))
        if err=='TIMEOUT': fails.append((p['id'],f'test{i+1} 시간 초과(5초)')); continue
        if err: fails.append((p['id'],f'test{i+1} error: {err.strip()[-300:]}')); continue
        if t.get('outFile') and t['outFile'] not in outf: fails.append((p['id'],f'test{i+1} 정답이 {t["outFile"]} 파일을 만들지 않음'))
        if t.get('stage') is not None and (not p.get('project') or t['stage']>=len(p['project']['steps'])): fails.append((p['id'],f'test{i+1} stage {t["stage"]} 가 project.steps 범위 밖'))
        if p['turtle']:
            if not extra: fails.append((p['id'],f'test{i+1} no segments')); continue
            continue
        if t.get('call'):
            if t['ret']=='__COMPUTED__': computed.setdefault(p['id'],{})[i]=extra
            elif extra!=t['ret']: fails.append((p['id'],f'test{i+1} ret {extra!r} != {t["ret"]!r}'))
        else:
            exp=t['output']
            if exp=='__COMPUTED__': computed.setdefault(p['id'],{})[i]=norm(out)
            elif norm(out)!=norm(exp): fails.append((p['id'],f'test{i+1} out {norm(out)!r} != {norm(exp)!r}'))
    table.append((p,len(tests)))
# parsons structural: solution from parsons must equal solution used
for p in P:
    if p['parsons'] and p['solution'] and p['parsons']['solution']!=p['solution'] and p['type']=='parsons': fails.append((p['id'],'parsons/solution mismatch'))
print('FAILS',len(fails)); [print(' ',f) for f in fails]
json.dump(computed,open(os.path.join(OUT,'computed.json'),'w'),ensure_ascii=False,indent=1)
by={}
for p,n in table: by[p['course']]=by.get(p['course'],0)+1
print('검증한 문제:',by)
if fails: print('✗ run_solutions 실패'); sys.exit(1)
print('✓ run_solutions OK')
