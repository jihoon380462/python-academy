// core/runners/python.js — Pyodide 워커(Py)·파이썬 프렐류드·거북이 캔버스(TurtleView)
// ---------- Pyodide 워커 ----------
const PY_PRELUDE = String.raw`
import sys, json, math, types, traceback
class _PAStop(Exception): pass
class _PATurtle:
    def __init__(s): s.reset()
    def reset(s):
        s.x=0.0; s.y=0.0; s.h=0.0; s.pen=True; s.col='#2bb673'; s.w=2; s.spd=6
        s.cmds=[]; s.segs=[]; s.filling=False; s.fillpts=[]; s.used=False
_pt=_PATurtle()
def _pa_turtle_module():
    m=types.ModuleType('turtle')
    def _mv(nx,ny):
        if _pt.pen: _pt.segs.append([round(_pt.x,2),round(_pt.y,2),round(nx,2),round(ny,2)])
        if len(_pt.cmds)<20000: _pt.cmds.append(['move',round(nx,2),round(ny,2),_pt.pen,_pt.col,_pt.w])
        if _pt.filling: _pt.fillpts.append([round(nx,2),round(ny,2)])
        _pt.x=nx; _pt.y=ny
    def forward(d):
        _pt.used=True; d=float(d); r=math.radians(_pt.h)
        _mv(_pt.x+math.cos(r)*d, _pt.y+math.sin(r)*d)
    def backward(d): forward(-float(d))
    def left(a):
        _pt.used=True; _pt.h=(_pt.h+float(a))%360
        if len(_pt.cmds)<20000: _pt.cmds.append(['turn',round(_pt.h,2)])
    def right(a): left(-float(a))
    def penup(): _pt.pen=False
    def pendown(): _pt.pen=True
    def color(c,*r): _pt.col=str(c); _pt.cmds.append(['color',_pt.col])
    def width(w): _pt.w=float(w); _pt.cmds.append(['width',_pt.w])
    def speed(s=6): _pt.spd=s; _pt.cmds.append(['speed',s])
    def goto(x,y=None):
        _pt.used=True
        if y is None: x,y=x
        _mv(float(x),float(y))
    def setheading(a): _pt.h=float(a)%360; _pt.cmds.append(['turn',round(_pt.h,2)])
    def circle(r,extent=360):
        r=float(r); extent=float(extent); steps=max(12,int(abs(extent)/10))
        seg=2*math.pi*abs(r)*abs(extent)/360/steps; ang=extent/steps
        if r<0: ang=-ang
        for _ in range(steps):
            left(ang/2); forward(seg); left(ang/2)
    def begin_fill(): _pt.filling=True; _pt.fillpts=[[round(_pt.x,2),round(_pt.y,2)]]
    def end_fill(): _pt.cmds.append(['fill',list(_pt.fillpts),_pt.col]); _pt.filling=False
    def clear(): _pt.segs=[]; _pt.cmds.append(['clear'])
    def home(): goto(0,0); setheading(0)
    def done(*a,**k): pass
    def position(): return (_pt.x,_pt.y)
    def heading(): return _pt.h
    def hideturtle(): _pt.cmds.append(['hide'])
    def showturtle(): _pt.cmds.append(['show'])
    def bgcolor(c,*r): _pt.cmds.append(['bg',str(c)])
    fns=dict(forward=forward,fd=forward,backward=backward,bk=backward,back=backward,left=left,lt=left,right=right,rt=right,
        penup=penup,pu=penup,up=penup,pendown=pendown,pd=pendown,down=pendown,color=color,pencolor=color,fillcolor=color,
        width=width,pensize=width,speed=speed,goto=goto,setpos=goto,setposition=goto,setheading=setheading,seth=setheading,
        circle=circle,begin_fill=begin_fill,end_fill=end_fill,clear=clear,reset=clear,home=home,done=done,mainloop=done,
        exitonclick=done,position=position,pos=position,heading=heading,hideturtle=hideturtle,ht=hideturtle,showturtle=showturtle,
        st=showturtle,bgcolor=bgcolor,shape=done,title=done,tracer=done,update=done,delay=done,setup=done,xcor=lambda: _pt.x,ycor=lambda: _pt.y)
    for k,v in fns.items(): setattr(m,k,v)
    class Turtle:
        def __init__(self,*a,**k): pass
        def __getattr__(self,name):
            if name in fns: return fns[name]
            raise AttributeError("turtle."+name+"은(는) 아직 지원하지 않아요")
    class Screen:
        def __init__(self,*a,**k): pass
        def __getattr__(self,name): return done
    m.Turtle=Turtle; m.Pen=Turtle; m.Screen=Screen; m.RawTurtle=Turtle
    def _ga(name): raise AttributeError("turtle."+name+"은(는) 아직 지원하지 않아요")
    m.__getattr__=_ga
    return m
sys.modules['turtle']=_pa_turtle_module()

def _pa_safe(v):
    try: r=repr(v)
    except Exception: r='?'
    return r if len(r)<=80 else r[:77]+'...'

def _pa_vis(v, depth=0, seen=None):
    # 시각화용 구조 스냅샷: 리스트/딕셔너리/집합/객체를 JSON 가능한 형태로 (깊이·개수 제한, 순환 방지)
    if seen is None: seen=set()
    if v is None or isinstance(v,(bool,int,float)): return v if not isinstance(v,float) or math.isfinite(v) else str(v)
    if isinstance(v,str): return v if len(v)<=60 else v[:57]+'...'
    if depth>8: return '...'
    if isinstance(v,(list,tuple)) or type(v).__name__=='deque':
        # QA #50: deque 도 리스트처럼 (앞=왼쪽)
        v=list(v)
        return [_pa_vis(x,depth+1,seen) for x in v[:300]]+(['...'] if len(v)>300 else [])
    if isinstance(v,(set,frozenset)):
        try: items=sorted(v)
        except Exception: items=list(v)
        return {'__set':[_pa_vis(x,depth+1,seen) for x in items[:300]]}
    if isinstance(v,dict):
        out={}
        for i,(k,x) in enumerate(v.items()):
            if i>=200: out['...']='...'; break
            out[str(k)]=_pa_vis(x,depth+1,seen)
        return out
    if hasattr(v,'__dict__') and not callable(v) and not isinstance(v,types.ModuleType):
        oid=id(v)
        if oid in seen: return {'__ref':oid}
        seen.add(oid)
        out={'__cls':type(v).__name__,'__id':oid}
        for k,x in list(vars(v).items())[:20]:
            if k.startswith('_'): continue
            out[k]=_pa_vis(x,depth+1,seen)
        return out
    return _pa_safe(v)

def __pa_run(code, call=None, trace=False, maxsteps=500, vis=None):
    _pt.reset()
    visnames=json.loads(vis) if vis else None
    ns={'__name__':'__main__','__file__':__import__('os').path.join(__import__('os').getcwd(),'main.py')}  # v2.34.0: Path(__file__).parent 예제(L17B/1)가 NameError 없이 돌게 — VS Code 처럼 「작업 폴더의 main.py」
    res={'ok':True}
    steps=[]; buf=[]; stack=[]
    class _Cap:
        def write(self,t): buf.append(t); return len(t)
        def flush(self): pass
    def tr(frame,event,arg):
        if frame.f_code.co_filename!='<user>': return None
        if event=='call': stack.append(frame.f_code.co_name)
        if event in ('line','return'):
            if len(steps)>=maxsteps: raise _PAStop()
            loc={}
            if len(steps)<500 or not visnames:
                for k,v in frame.f_locals.items():
                    if k.startswith('__') or callable(v) or isinstance(v,types.ModuleType): continue
                    loc[k]=_pa_safe(v)
            st={'line':frame.f_lineno,'vars':loc,'stack':list(stack),'out':''.join(buf)[-3000:],'event':event}
            if visnames:
                snap={}
                for name in visnames:
                    if name in frame.f_locals: snap[name]=_pa_vis(frame.f_locals[name])
                    elif name in ns: snap[name]=_pa_vis(ns[name])
                st['vis']=snap; st['depth']=len(stack); st['fn']=frame.f_code.co_name
            steps.append(st)
        if event=='return' and stack: stack.pop()
        return tr
    old=sys.stdout
    try:
        if trace:
            sys.stdout=_Cap(); sys.settrace(tr)
        exec(compile(code,'<user>','exec'),ns)
        if call: res['ret']=repr(eval(call,ns))
    except _PAStop:
        res['truncated']=True
    except SystemExit:
        pass
    except BaseException as e:
        res['ok']=False; res['ename']=type(e).__name__; res['emsg']=str(e)
        line=None
        if isinstance(e,SyntaxError): line=e.lineno
        else:
            try:
                for fr in traceback.extract_tb(e.__traceback__):
                    if fr.filename=='<user>': line=fr.lineno
            except Exception: pass
        res['line']=line
        try: res['tb']=''.join(traceback.format_exception_only(type(e),e)).strip()
        except Exception: res['tb']=res['ename']+': '+res['emsg']
    finally:
        if trace:
            sys.settrace(None); sys.stdout=old
            res['trace']=steps; res['out']=''.join(buf)
    res['segs']=_pt.segs[:5000]; res['cmds']=_pt.cmds; res['turtleUsed']=_pt.used; res['nsegs']=len(_pt.segs)
    return json.dumps(res)

def __pa_compile(code):
    try:
        compile(code,'<user>','exec'); return json.dumps({'ok':True})
    except SyntaxError as e:
        return json.dumps({'ok':False,'line':e.lineno,'msg':e.msg,'ename':type(e).__name__})
`;

const WORKER_SRC = `
const PYODIDE_URL=${JSON.stringify(CONFIG.PYODIDE_URL)}, INDEX=${JSON.stringify(CONFIG.PYODIDE_INDEX)};
const PRELUDE=${JSON.stringify(PY_PRELUDE)};
let pyodide=null, inputLines=[], inputIdx=0, curId=null;
/* QA #123(사용자 11/5 「무한루프 막는 장치 없어?」): 출력은 8KB 씩 묶어 보내고(수십만 번 메시지로 화면이 굳던 것), 한 번 실행에 MAX_OUT 글자를 넘으면 멈춰요 */
const MAX_OUT_DEFAULT=${JSON.stringify(CONFIG.MAX_OUTPUT_CHARS || 1000000)}; let outBuf='', outN=0, outW=0, outMax=0, outCut=false, lastFlush=0;
/* QA #150: 처음 200번의 write 와 그 뒤 50ms 마다는 바로 보내고(시간 초과·⏹ 로 워커가 꺼져도 앞 출력이 남게), 그 뒤만 8KB 씩 묶는다 */
function flushOut(){ if(outBuf){ postMessage({type:'out',id:curId,text:outBuf}); outBuf=''; } lastFlush=Date.now(); }
const dec=new TextDecoder();
async function prefetch(files){
  let total=0, got=0; const sizes={};
  // 예상 크기(MB): 응답에 content-length가 없을 때 대비
  const est={'pyodide.asm.wasm':9.8e6,'pyodide.asm.js':1.4e6,'python_stdlib.zip':3.2e6,'pyodide-lock.json':3e5};
  for(const f of files){ sizes[f]=est[f]||1e6; total+=sizes[f]; }
  for(const f of files){
    try{
      const r=await fetch(INDEX+f);
      if(!r.ok) throw new Error('HTTP '+r.status);
      const cl=Number(r.headers.get('content-length')); if(cl>0){ total+= cl - sizes[f]; sizes[f]=cl; }
      const reader=r.body.getReader(); let read=0;
      while(true){ const {done,value}=await reader.read(); if(done) break; read+=value.length; const frac=Math.min(1, read/sizes[f]); const pct=Math.min(94, Math.round(100*(got+frac*sizes[f])/total)); postMessage({type:'progress',pct,phase:'download'}); }
      got+=sizes[f];
    }catch(e){ throw new Error('다운로드 실패: '+f+' ('+e.message+')'); }
  }
}
async function init(){
  try{
    postMessage({type:'progress',pct:1,phase:'download'});
    importScripts(PYODIDE_URL);
    await prefetch(['pyodide.asm.js','pyodide.asm.wasm','python_stdlib.zip','pyodide-lock.json']);
    postMessage({type:'progress',pct:95,phase:'init'});
    pyodide=await loadPyodide({indexURL:INDEX});
    const limitErr=()=>{ const e=new Error('PA_OUTPUT_LIMIT'); e.code='EIO'; return e; }; /* QA #154: errno 코드가 있어야 Pyodide 가 조용히 OSError 로 바꿔요(없으면 write 마다 console.error 도배) */
    pyodide.setStdout({write:(b)=>{ if(outCut) throw limitErr(); const t=dec.decode(b,{stream:true}); outN+=t.length; if(outMax && outN>outMax){ outCut=true; flushOut(); throw limitErr(); } outBuf+=t; outW++; if(outW<=200 || outBuf.length>=8192 || Date.now()-lastFlush>50) flushOut(); return b.length; }});
    pyodide.setStderr({write:(b)=>{ flushOut(); /* QA #153: stdout 먼저 보내 순서 유지 */ postMessage({type:'err',id:curId,text:dec.decode(b,{stream:true})}); return b.length; }});
    pyodide.setStdin({stdin:()=>{ if(inputIdx<inputLines.length) return inputLines[inputIdx++]+'\\n'; return null; }, autoEOF:false, isatty:false});
    pyodide.runPython(PRELUDE);
    try{ pyodide.runPython('import sys\\ntry:\\n    sys.stdout.reconfigure(line_buffering=True); sys.stderr.reconfigure(line_buffering=True)\\nexcept Exception: pass'); }catch(e){} /* QA #150: 줄마다 바로 넘기기 */
    postMessage({type:'progress',pct:100,phase:'ready'});
    postMessage({type:'ready'});
  }catch(e){ postMessage({type:'initError',msg:String(e&&e.message||e)}); }
}
self.onmessage=(ev)=>{
  const m=ev.data;
  if(m.type==='init') return init();
  if(!pyodide) return postMessage({type:'done',id:m.id,result:{ok:false,ename:'NotReady',emsg:'파이썬 엔진이 아직 준비되지 않았어요'}});
  if(m.type==='compile'){
    try{ const r=JSON.parse(pyodide.runPython('__pa_compile(' + JSON.stringify(m.code) + ')')); postMessage({type:'compiled',id:m.id,result:r}); }
    catch(e){ postMessage({type:'compiled',id:m.id,result:{ok:true}}); }
    return;
  }
  if(m.type==='run'){
    curId=m.id; outBuf=''; outN=0; outW=0; outCut=false; outMax=(m.maxOut==null?MAX_OUT_DEFAULT:m.maxOut); inputLines=(m.input||'').replace(/\\r/g,'').split('\\n'); if(inputLines.length && inputLines[inputLines.length-1]==='' ) inputLines.pop(); inputIdx=0;
    let result;
    try{
      // 파일 입출력: 실행 전에 업로드/고정 파일을 쓰고, 결과 파일은 지웠다가 실행 뒤 읽어 돌려준다
      // QA 1103(X3P1): 결과 파일을 먼저 지우고 그다음 업로드 파일을 써야 해요 — 같은 이름(todo.json 처럼 읽고 다시 저장하는 파일)이면 반대 순서에서는 방금 올린 파일이 지워져요
      for(const n of (m.outFiles||[])){ try{ pyodide.FS.unlink(n); }catch(e){} }
      for(const f of (m.files||[])){ try{ pyodide.FS.writeFile(f.name, f.text||'', {encoding:'utf8'}); }catch(e){} }
      const fn=pyodide.globals.get('__pa_run');
      const t0=Date.now(); const r=fn(m.code, m.call||null, !!m.trace, m.maxsteps||500, m.vis||null);
      result=JSON.parse(r); result.ms=Date.now()-t0; fn.destroy && fn.destroy();
      if(m.outFiles&&m.outFiles.length){ result.outFiles={}; for(const n of m.outFiles){ try{ result.outFiles[n]=pyodide.FS.readFile(n,{encoding:'utf8'}); }catch(e){} } }
    }catch(e){ result={ok:false,ename:'InternalError',emsg:String(e&&e.message||e)}; }
    result.inputUsed=inputIdx;
    try{ pyodide.runPython('import sys; sys.stdout.flush(); sys.stderr.flush()'); }catch(e){}
    flushOut(); if(outCut){ result={...result, ok:false, outputLimit:true, ename:'OutputLimit', emsg:'출력이 너무 많아서 멈췄어요', limit:outMax}; }
    postMessage({type:'done',id:m.id,result});
    curId=null;
  }
};
`;

const Py = {
  worker: null, ready: false, failed: false, progress: 0, phase: 'idle', seq: 0, pending: {}, queue: [], busy: false, listeners: [], main: false, py: null, cur: null, inputLines: [], inputIdx: 0,
  onState(fn) { this.listeners.push(fn); },
  _emit() { this.listeners.forEach(f => { try { f(this); } catch (e) {} }); },
  start() {
    if (this.worker || this.main) return;
    this.failed = false; this.ready = false; this.progress = 0; this.phase = 'download'; this._emit();
    let w;
    try { const blob = new Blob([WORKER_SRC], { type: 'text/javascript' }); w = new Worker(URL.createObjectURL(blob)); }
    catch (e) { console.info('워커를 만들 수 없는 환경 → 메인 스레드 실행기로 전환'); return this.startMain(); }
    this.worker = w;
    w.onmessage = (ev) => {
      const m = ev.data;
      if (m.type === 'progress') { this.progress = m.pct; this.phase = m.phase; this._emit(); }
      else if (m.type === 'ready') { this.ready = true; this.phase = 'ready'; this._emit(); this._next(); if (typeof COURSE !== 'undefined' && COURSE.bench) this.bench(); }
      else if (m.type === 'initError') { this.failed = true; this.phase = 'error'; this.error = m.msg; this._emit(); this.worker = null; w.terminate(); }
      else if (m.type === 'out' || m.type === 'err') { const p = this.pending[m.id]; if (p && p.onOut) p.onOut(m.text, m.type === 'err'); }
      else if (m.type === 'done') { const p = this.pending[m.id]; if (p) { clearTimeout(p.timer); delete this.pending[m.id]; p.resolve(m.result); } this.busy = false; this._next(); }
      else if (m.type === 'compiled') { const p = this.pending[m.id]; if (p) { delete this.pending[m.id]; p.resolve(m.result); } this.busy = false; this._next(); }
    };
    w.onerror = (e) => { if (!this.ready && !this.failed) { try { w.terminate(); } catch (err) {} this.worker = null; this.startMain(); } };
    w.postMessage({ type: 'init' });
  },
  // 워커를 못 만드는 환경(일부 앱 내 미리보기·샌드박스)용 메인 스레드 실행기. 무한루프 5초 중단은 불가.
  async startMain() {
    this.main = true; this.phase = 'download'; this.progress = 3; this._emit();
    // 먼저 작은 파일 하나를 받아 본다. 안 되면(앱 미리보기 같은 샌드박스) 엔진 로드를 시도하지 않는다 → 불필요한 경고 없음
    try { const r = await fetch(CONFIG.PYODIDE_INDEX + 'pyodide-lock.json', { cache: 'force-cache' }); if (!r.ok) throw new Error('HTTP ' + r.status); }
    catch (e) { this.failed = true; this.sandboxed = true; this.error = ''; this.phase = 'error'; this.main = false; this._emit(); return; }
    const quiet = { warn: console.warn, error: console.error }; console.warn = () => {}; console.error = () => {}; // Pyodide 내부 경고가 화면에 뜨지 않게
    try {
      await loadScript(CONFIG.PYODIDE_URL); this.progress = 20; this._emit();
      const py = await loadPyodide({ indexURL: CONFIG.PYODIDE_INDEX }); this.progress = 95; this.phase = 'init'; this._emit();
      const dec = new TextDecoder();
      const limitErr = () => { const e = new Error('PA_OUTPUT_LIMIT'); e.code = 'EIO'; return e; }; /* QA #154: 워커와 같게 — 글자 수로 세고(바이트로 세면 한글 상한이 1/3), EIO 코드 */
      py.setStdout({ write: (b) => { const c = this.cur; if (c) { if (c._cut) throw limitErr(); const t = dec.decode(b, { stream: true }); c._n = (c._n || 0) + t.length; const mx = c.maxOut == null ? (CONFIG.MAX_OUTPUT_CHARS || 1000000) : c.maxOut; if (mx && c._n > mx) { c._cut = true; throw limitErr(); } if (c.onOut) c.onOut(t, false); } return b.length; } });
      py.setStderr({ write: (b) => { if (this.cur && this.cur.onOut) this.cur.onOut(dec.decode(b, { stream: true }), true); return b.length; } });
      py.setStdin({ stdin: () => this.inputIdx < this.inputLines.length ? this.inputLines[this.inputIdx++] + '\n' : null, autoEOF: false, isatty: false });
      py.runPython(PY_PRELUDE); try { py.runPython('import sys\ntry:\n    sys.stdout.reconfigure(line_buffering=True); sys.stderr.reconfigure(line_buffering=True)\nexcept Exception: pass'); } catch (e) {} this.py = py; this.ready = true; this.phase = 'ready'; this.progress = 100; this._emit(); this._next();
    } catch (e) { this.failed = true; this.error = String(e && e.message || e); this.phase = 'error'; this._emit(); this.main = false; }
    finally { console.warn = quiet.warn; console.error = quiet.error; }
  },
  _runMain(id, job) {
    setTimeout(() => {
      let result;
      if (job.kind === 'compile') { try { result = JSON.parse(this.py.runPython('__pa_compile(' + JSON.stringify(job.code) + ')')); } catch (e) { result = { ok: true }; } }
      else {
        this.cur = job; this.inputLines = (job.input || '').replace(/\r/g, '').split('\n'); if (this.inputLines.length && this.inputLines[this.inputLines.length - 1] === '') this.inputLines.pop(); this.inputIdx = 0;
        try { /* QA 1103: 지우기 → 쓰기 순서(워커와 같게) */ for (const n of (job.outFiles || [])) { try { this.py.FS.unlink(n); } catch (e) {} } for (const f of (job.files || [])) { try { this.py.FS.writeFile(f.name, f.text || '', { encoding: 'utf8' }); } catch (e) {} } const t0 = Date.now(); const fn = this.py.globals.get('__pa_run'); const r = fn(job.code, job.call || null, !!job.trace, job.maxsteps || CONFIG.TRACE_MAX_STEPS, job.vis ? JSON.stringify(job.vis) : null); result = JSON.parse(r); result.ms = Date.now() - t0; fn.destroy && fn.destroy(); if (job.outFiles && job.outFiles.length) { result.outFiles = {}; for (const n of job.outFiles) { try { result.outFiles[n] = this.py.FS.readFile(n, { encoding: 'utf8' }); } catch (e) {} } } } catch (e) { result = { ok: false, ename: 'InternalError', emsg: String(e && e.message || e) }; }
        result.inputUsed = this.inputIdx; if (job._cut) result = { ...result, ok: false, outputLimit: true, ename: 'OutputLimit', emsg: '출력이 너무 많아서 멈췄어요' }; this.cur = null;
      }
      delete this.pending[id]; this.busy = false; job.resolve(result); this._next();
    }, 0);
  },
  stop() { /* QA #123: ⏹ 멈추기 — 지금 실행을 끊고 엔진을 다시 켜요(무한루프 5초를 기다리지 않게) */ if (this.main) return false; /* QA #152: 워커 없는 실행기는 끊을 수 없음(restart 하면 영구 정지) */ if (!this.busy) return false; const ids = Object.keys(this.pending); ids.forEach(id => { const p = this.pending[id]; if (p) p._stopped = true; }); this.restart(); return true; },
  restart() { if (this.worker) { try { this.worker.terminate(); } catch (e) {} } this.worker = null; this.ready = false; this.busy = false; Object.values(this.pending).forEach(p => { clearTimeout(p.timer); p.resolve(p._stopped ? { ok: false, ename: '멈춤', emsg: '직접 멈췄어요', stopped: true, timeout: true } : { ok: false, ename: 'Timeout', emsg: T.timeout, timeout: true }); }); this.pending = {}; this.start(); },
  _next() {
    if (!this.ready || this.busy || !this.queue.length) return;
    const job = this.queue.shift(); this.busy = true;
    const id = ++this.seq; this.pending[id] = job;
    if (this.main) return this._runMain(id, job);
    if (job.kind === 'run') {
      job.timer = setTimeout(() => { if (this.pending[id]) { delete this.pending[id]; job.resolve({ ok: false, ename: 'Timeout', emsg: T.timeout, timeout: true, ms: job.timeoutMs || CONFIG.RUN_TIMEOUT_MS }); this.restart(); } }, job.timeoutMs || CONFIG.RUN_TIMEOUT_MS);
      this.worker.postMessage({ type: 'run', id, code: job.code, input: job.input, call: job.call, trace: job.trace, maxsteps: job.maxsteps || CONFIG.TRACE_MAX_STEPS, vis: job.vis ? JSON.stringify(job.vis) : null, files: job.files || null, outFiles: job.outFiles || null, maxOut: job.maxOut });
    } else { this.worker.postMessage({ type: 'compile', id, code: job.code }); }
  },
  // 보이지 않는 문자 정리 (v2.2.16): 모바일 키보드가 넣는 NBSP·전각 기호(：（）“”)·제로폭 문자·탭 때문에 생기는 SyntaxError 를 막는다.
  //   문자열 안의 글자는 건드리지 않는다(따옴표 추적). 바뀐 게 있으면 result.normalized 에 목록을 담아 화면이 알려 준다.
  normalize(code) {
    const changes = new Set(); let out = ''; let q = null; const FW = { '：': ':', '（': '(', '）': ')', '［': '[', '］': ']', '｛': '{', '｝': '}', '，': ',', '．': '.', '＝': '=', '＜': '<', '＞': '>', '＋': '+', '－': '-', '＊': '*', '／': '/', '％': '%', '！': '!', '＃': '#', '“': '"', '”': '"', '‘': "'", '’': "'", '〃': '"', '＂': '"', '＇': "'" };
    const src = String(code || '').replace(/\r\n?/g, '\n');
    for (let i = 0; i < src.length; i++) { const ch = src[i];
      if (ch === '\u200b' || ch === '\u200c' || ch === '\u200d' || ch === '\ufeff') { changes.add('제로폭 문자'); continue; }
      if (q) { const curly = (q === '"' && (ch === '“' || ch === '”' || ch === '＂')) || (q === "'" && (ch === '‘' || ch === '’' || ch === '＇')); if (curly) { changes.add('둥근 따옴표 ' + ch + ' → ' + q); out += q; q = null; continue; } if (ch === q && src[i - 1] !== '\\') q = null; out += ch; continue; }
      if (ch === '"' || ch === "'") { q = ch; out += ch; continue; }
      if (ch === '#') { const j = src.indexOf('\n', i); out += src.slice(i, j < 0 ? src.length : j); i = (j < 0 ? src.length : j) - 1; continue; }
      if (ch === '\u00a0' || ch === '\u3000' || ch === '\u2003' || ch === '\u2002') { changes.add(ch === '\u3000' ? '전각 공백' : '특수 공백'); out += ch === '\u3000' ? '    ' : ' '; continue; }
      if (ch === '\t') { changes.add('탭 → 공백 4칸'); out += '    '; continue; }
      if (FW[ch] && (ch === '“' || ch === '”' || ch === '‘' || ch === '’' || ch === '〃' || ch === '＂' || ch === '＇')) { changes.add('둥근 따옴표 ' + ch + ' → ' + FW[ch]); q = FW[ch]; out += FW[ch]; continue; }
      if (FW[ch]) { changes.add('전각 기호 ' + ch + ' → ' + FW[ch]); out += FW[ch]; continue; }
      out += ch; }
    return { code: out, changes: [...changes] };
  },
  run({ code, input = '', call = null, trace = false, onOut = null, vis = null, maxsteps = null, timeoutMs = null, files = null, outFiles = null, maxOut = null }) {
    const nz = this.normalize(code); code = nz.code;
    return new Promise(resolve => { this.queue.push({ kind: 'run', code, input, call, trace, onOut, vis, maxsteps, timeoutMs, files, outFiles, maxOut, resolve: (r) => { if (r && nz.changes.length) r.normalized = nz.changes; resolve(r); } }); if (!this.worker && !this.main) this.start(); this._next(); });
  },
  // 기기 속도 보정: 같은 작업을 한 번 돌려 기준 시간과 비교 (알고리즘 코스 시간 제한 채점에 곱함). 1회만.
  speedFactor: 1, benched: false,
  async bench() {
    if (this.benched) return this.speedFactor; this.benched = true;
    try { const r = await this.run({ code: 's = 0\nfor i in range(1000000):\n    s += i\n' }); if (r.ok && r.ms) this.speedFactor = Math.min(4, Math.max(0.5, r.ms / CONFIG.ALGO.benchBaselineMs)); } catch (e) {}
    return this.speedFactor;
  },
  compile(code) { return new Promise(resolve => { this.queue.push({ kind: 'compile', code, resolve }); if (!this.worker && !this.main) this.start(); this._next(); }); },
  // SyntaxError 원인 추정 (v2.2.16): 에러 줄과 그 앞 줄을 보고 흔한 실수를 짚는다 (선생님 없이도)
  syntaxTips(code, line) {
    if (!line) return ''; const lines = String(code || '').split('\n'); const cur = lines[line - 1] || ''; let pi = line - 2; while (pi >= 0 && !lines[pi].trim()) pi--; const prev = pi >= 0 ? lines[pi] : ''; const tips = [];
    const ind = (l) => (l.match(/^ */) || [''])[0].length; const strip = (l) => l.replace(/(["']).*?\1/g, '""').replace(/#.*$/, '');
    const opens = (l) => { const t = strip(l); return (t.match(/[([{]/g) || []).length - (t.match(/[)\]}]/g) || []).length; };
    if (/^\s*(elif|else)\b/.test(cur)) { let j = line - 2, found = false; while (j >= 0) { const l = lines[j]; if (l.trim() && ind(l) === ind(cur) && /^\s*(if|elif|for|while|try|except)\b/.test(l)) { found = /^\s*(if|elif|try|except)\b/.test(l); break; } if (l.trim() && ind(l) < ind(cur)) break; j--; } if (!found) tips.push(`${cur.trim().split(/[\s:]/)[0]} 는 짝이 되는 if 와 들여쓰기(칸 수)가 정확히 같아야 해요. 위의 if 가 몇 칸 들여쓰여 있는지 세어 보세요.`); if (!/:\s*(#.*)?$/.test(cur) && /^\s*else\b/.test(cur)) tips.push('else 뒤에는 콜론(:)이 필요해요.'); }
    if (prev && opens(prev) > 0) tips.push(`${pi + 1}번 줄의 괄호가 닫히지 않았어요 — ( 와 ) 개수를 맞추세요.`);
    if (prev && ((strip(prev).match(/"/g) || []).length % 2 === 1 || (prev.replace(/"[^"]*"/g, '').match(/'/g) || []).length % 2 === 1)) tips.push(`${pi + 1}번 줄의 따옴표 짝이 맞지 않아요.`);
    if (/^\s*(if|elif|else|for|while|def|class|try|except|finally|with)\b/.test(cur) && !/:\s*(#.*)?$/.test(cur) && opens(cur) === 0) tips.push('이 줄 끝에 콜론(:)이 빠졌어요.');
    if (/^\s*(if|elif|while)\s.*[^=!<>]=[^=]/.test(strip(cur)) && !/==/.test(cur)) tips.push('비교는 = 가 아니라 == 예요.');
    if (/[\u00a0\u3000\uff01-\uff5e\u201c\u201d\u2018\u2019]/.test(cur + prev)) tips.push('전각 기호(：（）“”)나 특수 공백이 섞여 있어요. 한/영을 영문으로 두고 다시 치거나 아래 칩으로 넣으세요.');
    if (!tips.length && prev && ind(cur) > ind(prev) && !/:\s*(#.*)?$/.test(prev)) tips.push(`${pi + 1}번 줄이 콜론(:)으로 끝나지 않는데 이 줄이 들여쓰여 있어요.`);
    return tips.slice(0, 2).join(' ');
  },
  explain(result) { // 에러 → 한국어 한 줄
    if (!result || result.ok) return '';
    if (result.stopped) return '⏹ 멈추기를 눌러 실행을 멈췄어요.';
    if (result.timeout) return T.timeout;
    if (result.outputLimit) return '출력이 너무 많아서 멈췄어요. 반복이 끝나지 않고 계속 print 하는 건 아닌지(while 조건, 반복 안에서 값을 바꾸는지) 확인해 보세요.';
    if (result.ename === 'EOFError') return T.needInput((result.inputUsed || 0) + 1);
    if (result.ename === 'IndentationError' || result.ename === 'TabError') { const m = result.emsg || ''; const ln = result.line ? `${result.line}번 줄` : '이 줄'; if (/expected an indented block/.test(m)) return `${ln}은 위 줄(콜론 :으로 끝난 줄)보다 안쪽에 있어야 해요. 앞에 공백 4칸을 넣으세요.`; if (/unexpected indent/.test(m)) return `${ln}은 위 줄과 같은 칸에서 시작해야 해요. 앞의 공백을 지우세요.`; if (/unindent does not match/.test(m)) return `${ln}의 들여쓰기 칸수가 위 묶음과 맞지 않아요. 같은 묶음은 같은 칸수여야 해요.`; }
    if (result.ename === 'NameError') { const m = /name '([A-Za-z_]\w*)' is not defined/.exec(result.emsg || ''); if (m) { const n = m[1]; return /^[A-Z]/.test(n) ? `${n} 라는 이름이 아직 없어요. 만들어야 하는 클래스라면 class ${n}: 로 먼저 만들었는지, 이름 오타는 없는지 확인하세요.` : `${n} 라는 이름이 아직 없어요. 함수라면 def ${n}(...): 로 먼저 만들었는지, 변수라면 값을 먼저 넣었는지·오타인지, 글자라면 따옴표를 빠뜨렸는지 확인하세요.`; } } /* PR#94 P1-13 */
    return ERROR_HINTS[result.ename] || '에러가 났어요. 메시지를 읽어 보세요.';
  },
};


// ---------- 거북이 캔버스 ----------
const TurtleView = {
  draw(canvas, cmds, { animate = true, speed = 6, onDone = null } = {}) {
    const ctx = canvas.getContext('2d'); const W = canvas.width, H = canvas.height; const ox = W / 2, oy = H / 2;
    ctx.clearRect(0, 0, W, H); ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--surface2') || '#fff'; ctx.fillRect(0, 0, W, H);
    let x = 0, y = 0, h = 0, col = '#2bb673', w = 2, pen = true, hidden = false; const segs = []; const fills = [];
    const tx = (v) => ox + v, ty = (v) => oy - v;
    const render = () => { ctx.clearRect(0, 0, W, H); ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--surface2') || '#fff'; ctx.fillRect(0, 0, W, H); for (const f of fills) { ctx.beginPath(); f.pts.forEach((p, i) => i ? ctx.lineTo(tx(p[0]), ty(p[1])) : ctx.moveTo(tx(p[0]), ty(p[1]))); ctx.closePath(); ctx.fillStyle = f.c; ctx.globalAlpha = 0.5; ctx.fill(); ctx.globalAlpha = 1; } for (const s of segs) { ctx.beginPath(); ctx.moveTo(tx(s[0]), ty(s[1])); ctx.lineTo(tx(s[2]), ty(s[3])); ctx.strokeStyle = s[4]; ctx.lineWidth = s[5]; ctx.lineCap = 'round'; ctx.stroke(); } if (!hidden) { ctx.save(); ctx.translate(tx(x), ty(y)); ctx.rotate(-h * Math.PI / 180); ctx.beginPath(); ctx.moveTo(10, 0); ctx.lineTo(-7, 6); ctx.lineTo(-4, 0); ctx.lineTo(-7, -6); ctx.closePath(); ctx.fillStyle = '#2bb673'; ctx.fill(); ctx.strokeStyle = '#1a7a4c'; ctx.stroke(); ctx.restore(); } };
    let i = 0; const perFrame = speed >= 10 ? 1e9 : Math.max(1, Math.round(speed * speed / 4));
    const apply = (c) => { if (c[0] === 'move') { if (c[3]) segs.push([x, y, c[1], c[2], col, w]); x = c[1]; y = c[2]; } else if (c[0] === 'turn') h = c[1]; else if (c[0] === 'color') col = c[1]; else if (c[0] === 'width') w = c[1]; else if (c[0] === 'clear') { segs.length = 0; fills.length = 0; } else if (c[0] === 'fill') fills.push({ pts: c[1], c: c[2] }); else if (c[0] === 'hide') hidden = true; else if (c[0] === 'show') hidden = false; };
    if (!animate || !cmds.length) { cmds.forEach(apply); render(); if (onDone) onDone(); return () => {}; }
    let stopped = false; const step = () => { if (stopped) return; let n = 0; while (i < cmds.length && n < perFrame) { apply(cmds[i++]); n++; } render(); if (i < cmds.length) requestAnimationFrame(step); else if (onDone) onDone(); }; requestAnimationFrame(step);
    return () => { stopped = true; cmds.slice(i).forEach(apply); i = cmds.length; render(); };
  },
};
