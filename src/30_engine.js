// =====================================================================
// === ENGINE ===  (실행·채점·게임 로직. 콘텐츠를 건드리지 않고 동작)
// =====================================================================

// ---------- 유틸 ----------
const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
const esc = (s) => String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const todayKey = (d=new Date()) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const daysBetween = (a, b) => Math.round((new Date(b+'T00:00:00') - new Date(a+'T00:00:00')) / 86400000);
const addDays = (key, n) => { const d = new Date(key+'T00:00:00'); d.setDate(d.getDate()+n); return todayKey(d); };
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const uid = () => Math.random().toString(36).slice(2, 10);
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const byteLen = (s) => new TextEncoder().encode(s).length;
function loadScript(src) { return new Promise((res, rej) => { const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = () => rej(new Error('load fail: ' + src)); document.head.appendChild(s); }); }

// ---------- 콘텐츠 인덱스 & 자체 검사 ----------
const Content = {
  lessonMap: {}, problemMap: {}, byLesson: {},
  init() {
    LESSONS.forEach(l => { this.lessonMap[l.id] = l; this.byLesson[l.id] = []; });
    PROBLEMS.forEach(p => { this.problemMap[p.id] = p; (this.byLesson[p.lesson] = this.byLesson[p.lesson] || []).push(p); });
    // 자체 검사
    const seen = new Set(); const warn = (m) => console.warn('[콘텐츠 검사] ' + m);
    PROBLEMS.forEach(p => {
      if (seen.has(p.id)) warn(`id 중복: ${p.id}`); seen.add(p.id);
      if (!this.lessonMap[p.lesson]) warn(`없는 레슨 참조: ${p.id} → ${p.lesson}`);
      if (['block','code'].includes(p.type) && !(p.tests && p.tests.length)) warn(`테스트 없는 실행형 문제: ${p.id}`);
      if (p.type === 'bug' && !(p.bug && p.bug.tests && p.bug.tests.length)) warn(`테스트 없는 버그 문제: ${p.id}`);
      if (!(p.hints && p.hints.length >= 3)) warn(`힌트 3개 미만: ${p.id}`);
      if (!(p.tags && p.tags.length)) warn(`개념 태그 없음: ${p.id}`);
      if (p.boss && this.tests(p).length < 5) warn(`보스 테스트 5개 미만: ${p.id}`);
    });
    LESSONS.forEach(l => { if (!l.boss && l.id !== 'L0' && this.byLesson[l.id].length < 4) warn(`문제 4개 미만 레슨: ${l.id}`); });
  },
  lesson(id) { return this.lessonMap[id]; },
  problem(id) { return this.problemMap[id]; },
  problemsOf(lid) { return this.byLesson[lid] || []; },
  tests(p) { return p.type === 'bug' ? (p.bug.tests || []) : (p.tests || []); },
  lessonsOfChapter(ch) { return LESSONS.filter(l => l.ch === ch); },
  orderedLessons() { return LESSONS.slice(); },
  blocksUpTo(lid) { // 누적 툴박스
    const out = ['text_print','py_print_many']; const idx = LESSONS.findIndex(l => l.id === lid);
    for (let i = 0; i <= idx; i++) (LESSONS[i].blocks || []).forEach(b => { if (!out.includes(b)) out.push(b); });
    return out;
  },
  // {{식}} 치환. params 없으면 vary 기본값(첫 값)
  defaultParams(p) { const out = {}; if (p.vary) for (const k in p.vary) out[k] = p.vary[k][0]; return out; },
  randomParams(p) { const out = {}; if (p.vary) for (const k in p.vary) { const r = p.vary[k]; out[k] = (r.length === 2 && typeof r[0] === 'number' && typeof r[1] === 'number' && r[1] > r[0] + 1) ? r[0] + Math.floor(Math.random() * (r[1] - r[0] + 1)) : r[Math.floor(Math.random() * r.length)]; } return out; },
  // {{식}} 계산기: 숫자·파라미터 이름·+ - * / % 괄호만 지원 (eval 금지 환경에서도 동작)
  evalExpr(src, params) {
    const toks = src.match(/\d+(?:\.\d+)?|[A-Za-z_]\w*|[-+*/%()]/g) || []; let i = 0;
    const peek = () => toks[i], next = () => toks[i++];
    const atom = () => { const t = next(); if (t === '(') { const v = expr(); next(); return v; } if (t === '-') return -atom(); if (/^\d/.test(t)) return Number(t); if (t in params) return typeof params[t] === 'number' ? params[t] : String(params[t]); throw new Error('bad token ' + t); };
    const term = () => { let v = atom(); while (['*', '/', '%'].includes(peek())) { const op = next(), r = atom(); v = op === '*' ? v * r : op === '/' ? v / r : v % r; } return v; };
    const expr = () => { let v = term(); while (['+', '-'].includes(peek())) { const op = next(), r = term(); v = op === '+' ? v + r : v - r; } return v; };
    const v = expr(); if (i < toks.length) throw new Error('trailing'); return v;
  },
  // 블록 문제 따라하기 가이드. 손으로 쓴 guide가 있으면 그것, 없으면 정답 코드 줄에서 자동 생성
  guideFor(p) {
    const hand = p.guide || (typeof GUIDES !== 'undefined' && GUIDES[p.id]);
    if (hand) { const params = p.params || {}; const sub = (x) => typeof x !== 'string' ? x : x.replace(/\{\{([^}]+)\}\}/g, (m, e) => { try { return String(this.evalExpr(e, params)); } catch (err) { return m; } }); return hand.map(g => ({ ...g, t: sub(g.t), c: Array.isArray(g.c) ? g.c.map(sub) : sub(g.c) })); }
    if (p.type !== 'block' || !p.solution) return null;
    const steps = []; const lines = p.solution.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const raw = lines[i]; const t = raw.trim(); if (!t) continue;
      const ind = raw.length - raw.trimStart().length; const inside = ind > 0 ? '위 블록의 <b>안쪽(ㄷ자 안)</b>에 ' : '';
      let txt = null, cat = null, m;
      if ((m = t.match(/^print\((.*)\)$/))) { txt = `${inside}<b>출력</b> 블록을 붙이고, 안쪽이 <code>${esc(m[1])}</code> 가 되게 만드세요.`; cat = '출력'; }
      else if ((m = t.match(/^(\w+) = int\(input\(\)\)$/))) { txt = `<b>변수</b> 메뉴에서 <b>변수 만들기…</b>로 <code>${m[1]}</code> 을 만들고, <b>${m[1]} = 0</b> 블록을 끌어온 뒤 0 자리에 <b>값·계산</b> 메뉴의 <b>숫자로 int( 입력 받기 )</b> 블록을 끼우세요.`; cat = '변수'; }
      else if ((m = t.match(/^(\w+) = input\(\)$/))) { txt = `변수 <code>${m[1]}</code> 을 만들고 <b>${m[1]} = 0</b> 블록의 0 자리에 <b>출력</b> 메뉴의 <b>입력 받기 input()</b> 블록을 끼우세요.`; cat = '변수'; }
      else if ((m = t.match(/^(\w+) \+= (.*)$/))) { txt = `${inside}<b>변수</b> 메뉴의 <b>${m[1]} += 1</b> 블록을 붙이세요 (값: <code>${esc(m[2])}</code>).`; cat = '변수'; }
      else if ((m = t.match(/^(\w+) = (.*)$/))) { txt = `<b>변수</b> 메뉴에서 <b>변수 만들기…</b>로 <code>${m[1]}</code> 을 만들고, <b>${m[1]} = 0</b> 블록을 끌어와 값을 <code>${esc(m[2])}</code> 로 바꾸세요.`; cat = '변수'; }
      else if ((m = t.match(/^for (\w+) in range\((.*)\):$/))) { txt = `${inside}<b>반복</b> 메뉴의 <b>i 를 1 부터 5 까지 반복</b> 블록을 붙이고 범위를 <code>range(${esc(m[2])})</code> 에 맞게 고치세요. (끝 숫자는 마지막으로 셀 숫자)`; cat = '반복'; }
      else if ((m = t.match(/^for (\w+) in (\w+):$/))) { txt = `${inside}<b>반복</b> 메뉴의 <b>… 의 각 항목 … 에 대해</b> 블록을 붙이고, 항목 이름을 <code>${m[1]}</code>, 리스트 자리에 <code>${m[2]}</code> 변수 블록을 끼우세요.`; cat = '반복'; }
      else if ((m = t.match(/^while (.*):$/))) { txt = `${inside}<b>반복</b> 메뉴의 <b>~인 동안 반복</b> 블록을 붙이고 조건을 <code>${esc(m[1])}</code> 로 만드세요.`; cat = '반복'; }
      else if ((m = t.match(/^if (.*):$/))) { txt = `${inside}<b>조건</b> 메뉴의 <b>만약</b> 블록을 붙이고, 옆 빈칸에 비교 블록으로 <code>${esc(m[1])}</code> 을 만드세요.`; cat = '조건'; }
      else if ((m = t.match(/^elif (.*):$/))) { txt = `만약 블록의 <b>⚙ 톱니바퀴</b>를 눌러 <b>아니고 만약</b>을 추가하고 조건을 <code>${esc(m[1])}</code> 로 만드세요.`; cat = '조건'; }
      else if (t === 'else:') { txt = `만약 블록의 <b>⚙ 톱니바퀴</b>를 눌러 <b>아니면</b>을 추가하세요.`; cat = '조건'; }
      else if ((m = t.match(/^def (\w+)\((.*)\):$/))) { txt = `<b>함수</b> 메뉴의 <b>함수 만들기</b> 블록을 끌어와 이름을 <code>${m[1]}</code> 로 바꾸세요.${m[2] ? ` (⚙로 매개변수 <code>${esc(m[2])}</code> 추가)` : ''}`; cat = '함수'; }
      else if ((m = t.match(/^return (.*)$/))) { txt = `함수 안에 <b>돌려주기 (return)</b> 블록을 넣고 값을 <code>${esc(m[1])}</code> 로.`; cat = '함수'; }
      else if ((m = t.match(/^(\w+)\((.*)\)$/))) { txt = `<b>함수</b> 메뉴에 생긴 <b>${m[1]}</b> 부르기 블록을 붙이세요.`; cat = '함수'; }
      else txt = `${inside}다음 코드가 되도록 블록을 붙이세요: <code>${esc(t)}</code>`;
      steps.push({ t: txt, c: t, cat, auto: true });
    }
    steps.push({ t: '다 만들었으면 <b>▶ 실행</b>으로 결과를 확인하고, <b>✔ 제출하기</b>를 누르세요!' });
    return steps;
  },
  instantiate(p, params) {
    if (!p.vary) return p;
    if (!params || !Object.keys(params).length) params = this.defaultParams(p);
    const keys = Object.keys(params), vals = keys.map(k => params[k]);
    const sub = (s) => typeof s !== 'string' ? s : s.replace(/\{\{([^}]+)\}\}/g, (m, e) => { try { return String(this.evalExpr(e, params)); } catch (err) { return m; } });
    const q = JSON.parse(JSON.stringify(p)); q.params = params;
    q.prompt = sub(q.prompt); q.solution = sub(q.solution); q.starter = sub(q.starter); q.inputExample = sub(q.inputExample);
    q.hints = (q.hints || []).map(sub);
    if (q.guide) q.guide = q.guide.map(g => ({ ...g, t: sub(g.t), c: Array.isArray(g.c) ? g.c.map(sub) : sub(g.c) }));
    if (q.tests) q.tests = q.tests.map(t => ({ ...t, input: sub(t.input), output: sub(t.output), call: sub(t.call), ret: sub(t.ret) }));
    q.varied = JSON.stringify(params) !== JSON.stringify(this.defaultParams(p));
    return q;
  },
};

// ---------- 저장소 ----------
const Store = {
  data: null,
  blank() {
    return { v: CONFIG.SCHEMA_VERSION, nick: '', mascotColor: 0, onboarded: false, xp: 0, badges: [], badgeDates: {}, stats: {}, problems: {}, lessons: {},
      streak: { cur: 0, best: 0, last: null }, days: {}, dailyGoal: 5, dailyGoalDates: {},
      settings: { theme: 'dark', font: 1, sound: true, vibrate: true, anim: 2, apiKey: '', model: CONFIG.TUTOR.defaultModel, editorTheme: 'classic', confetti: 'rainbow', soundSet: 'bell', accessory: 'none', turtleSpeed: 6 },
      works: [], tutorChats: {}, myProblems: [], bestTimes: {}, dailyChallenge: null, checkups: {}, playgroundXp: { date: '', amount: 0 }, polished: {}, examplesEdited: {}, reviewToday: { date: '', count: 0 }, chapterPerfect: {} };
  },
  load() {
    try { const raw = localStorage.getItem(CONFIG.SAVE_KEY); if (raw) { const d = JSON.parse(raw); this.data = Object.assign(this.blank(), d); this.data.settings = Object.assign(this.blank().settings, d.settings || {}); this.migrate(); return; } } catch (e) { console.warn('저장 데이터 읽기 실패', e); }
    this.data = this.blank();
  },
  migrate() { /* 향후 스키마 변경 시 v 비교해 변환 */ this.data.v = CONFIG.SCHEMA_VERSION; },
  save(opt = {}) { if (!opt.silent) { this.data.updatedAt = Date.now(); if (typeof Sync !== 'undefined' && Sync.on) Sync.schedulePush(); } try { localStorage.setItem(CONFIG.SAVE_KEY, JSON.stringify(this.data)); } catch (e) { console.warn('저장 실패(용량?)', e); } },
  prob(id) { const d = this.data; if (!d.problems[id]) d.problems[id] = { status: 'none', stars: 0, hints: 0, attempts: 0, fails: 0, code: null, mode: null, firstTry: null, answerSeen: false, tutorAsked: false, review: null, clearedAt: null }; return d.problems[id]; },
  setCode(id, code, mode) { const p = this.prob(id); if (code != null && byteLen(code) <= CONFIG.MAX_CODE_SAVE_BYTES) { p.code = code; p.mode = mode; } this.save(); },
  exportJSON() { return JSON.stringify(this.data, null, 1); },
  importJSON(text) { const d = JSON.parse(text); if (!d || typeof d !== 'object' || !('problems' in d)) throw new Error('형식이 맞지 않아요'); this.data = Object.assign(this.blank(), d); this.migrate(); this.save(); },
  reset() { this.data = this.blank(); this.data.resetAt = Date.now(); this.save(); },
  resetProblem(id) { delete this.data.problems[id]; delete this.data.tutorChats[id]; this.save(); },
};

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

def __pa_run(code, call=None, trace=False, maxsteps=500):
    _pt.reset()
    ns={'__name__':'__main__'}
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
            for k,v in frame.f_locals.items():
                if k.startswith('__') or callable(v) or isinstance(v,types.ModuleType): continue
                loc[k]=_pa_safe(v)
            steps.append({'line':frame.f_lineno,'vars':loc,'stack':list(stack),'out':''.join(buf)[-3000:],'event':event})
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
    pyodide.setStdout({write:(b)=>{ postMessage({type:'out',id:curId,text:dec.decode(b,{stream:true})}); return b.length; }});
    pyodide.setStderr({write:(b)=>{ postMessage({type:'err',id:curId,text:dec.decode(b,{stream:true})}); return b.length; }});
    pyodide.setStdin({stdin:()=>{ if(inputIdx<inputLines.length) return inputLines[inputIdx++]+'\\n'; return null; }, autoEOF:false, isatty:false});
    pyodide.runPython(PRELUDE);
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
    curId=m.id; inputLines=(m.input||'').replace(/\\r/g,'').split('\\n'); if(inputLines.length && inputLines[inputLines.length-1]==='' ) inputLines.pop(); inputIdx=0;
    let result;
    try{
      const fn=pyodide.globals.get('__pa_run');
      const r=fn(m.code, m.call||null, !!m.trace, m.maxsteps||500);
      result=JSON.parse(r); fn.destroy && fn.destroy();
    }catch(e){ result={ok:false,ename:'InternalError',emsg:String(e&&e.message||e)}; }
    result.inputUsed=inputIdx;
    try{ pyodide.runPython('import sys; sys.stdout.flush(); sys.stderr.flush()'); }catch(e){}
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
      else if (m.type === 'ready') { this.ready = true; this.phase = 'ready'; this._emit(); this._next(); }
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
      py.setStdout({ write: (b) => { if (this.cur && this.cur.onOut) this.cur.onOut(dec.decode(b, { stream: true }), false); return b.length; } });
      py.setStderr({ write: (b) => { if (this.cur && this.cur.onOut) this.cur.onOut(dec.decode(b, { stream: true }), true); return b.length; } });
      py.setStdin({ stdin: () => this.inputIdx < this.inputLines.length ? this.inputLines[this.inputIdx++] + '\n' : null, autoEOF: false, isatty: false });
      py.runPython(PY_PRELUDE); this.py = py; this.ready = true; this.phase = 'ready'; this.progress = 100; this._emit(); this._next();
    } catch (e) { this.failed = true; this.error = String(e && e.message || e); this.phase = 'error'; this._emit(); this.main = false; }
    finally { console.warn = quiet.warn; console.error = quiet.error; }
  },
  _runMain(id, job) {
    setTimeout(() => {
      let result;
      if (job.kind === 'compile') { try { result = JSON.parse(this.py.runPython('__pa_compile(' + JSON.stringify(job.code) + ')')); } catch (e) { result = { ok: true }; } }
      else {
        this.cur = job; this.inputLines = (job.input || '').replace(/\r/g, '').split('\n'); if (this.inputLines.length && this.inputLines[this.inputLines.length - 1] === '') this.inputLines.pop(); this.inputIdx = 0;
        try { const fn = this.py.globals.get('__pa_run'); const r = fn(job.code, job.call || null, !!job.trace, CONFIG.TRACE_MAX_STEPS); result = JSON.parse(r); fn.destroy && fn.destroy(); } catch (e) { result = { ok: false, ename: 'InternalError', emsg: String(e && e.message || e) }; }
        result.inputUsed = this.inputIdx; this.cur = null;
      }
      delete this.pending[id]; this.busy = false; job.resolve(result); this._next();
    }, 0);
  },
  restart() { if (this.worker) { try { this.worker.terminate(); } catch (e) {} } this.worker = null; this.ready = false; this.busy = false; Object.values(this.pending).forEach(p => { clearTimeout(p.timer); p.resolve({ ok: false, ename: 'Timeout', emsg: T.timeout, timeout: true }); }); this.pending = {}; this.start(); },
  _next() {
    if (!this.ready || this.busy || !this.queue.length) return;
    const job = this.queue.shift(); this.busy = true;
    const id = ++this.seq; this.pending[id] = job;
    if (this.main) return this._runMain(id, job);
    if (job.kind === 'run') {
      job.timer = setTimeout(() => { if (this.pending[id]) { delete this.pending[id]; job.resolve({ ok: false, ename: 'Timeout', emsg: T.timeout, timeout: true }); this.restart(); } }, CONFIG.RUN_TIMEOUT_MS);
      this.worker.postMessage({ type: 'run', id, code: job.code, input: job.input, call: job.call, trace: job.trace, maxsteps: CONFIG.TRACE_MAX_STEPS });
    } else { this.worker.postMessage({ type: 'compile', id, code: job.code }); }
  },
  run({ code, input = '', call = null, trace = false, onOut = null }) {
    return new Promise(resolve => { this.queue.push({ kind: 'run', code, input, call, trace, onOut, resolve }); if (!this.worker && !this.main) this.start(); this._next(); });
  },
  compile(code) { return new Promise(resolve => { this.queue.push({ kind: 'compile', code, resolve }); if (!this.worker && !this.main) this.start(); this._next(); }); },
  explain(result) { // 에러 → 한국어 한 줄
    if (!result || result.ok) return '';
    if (result.timeout) return T.timeout;
    if (result.ename === 'EOFError') return T.needInput((result.inputUsed || 0) + 1);
    if (result.ename === 'IndentationError' || result.ename === 'TabError') { const m = result.emsg || ''; const ln = result.line ? `${result.line}번 줄` : '이 줄'; if (/expected an indented block/.test(m)) return `${ln}은 위 줄(콜론 :으로 끝난 줄)보다 안쪽에 있어야 해요. 앞에 공백 4칸을 넣으세요.`; if (/unexpected indent/.test(m)) return `${ln}은 위 줄과 같은 칸에서 시작해야 해요. 앞의 공백을 지우세요.`; if (/unindent does not match/.test(m)) return `${ln}의 들여쓰기 칸수가 위 묶음과 맞지 않아요. 같은 묶음은 같은 칸수여야 해요.`; }
    return ERROR_HINTS[result.ename] || '에러가 났어요. 메시지를 읽어 보세요.';
  },
};

// ---------- 채점 ----------
const Grader = {
  norm(s, ic) { let t = String(s ?? '').replace(/\r/g, '').split('\n').map(l => l.replace(/\s+$/, '')).join('\n').replace(/\n+$/, '').replace(/^\n+/, ''); return ic ? t.toLowerCase() : t; },
  normTests(p) { // 테스트 최소 2개 보장(입력 없는 문제는 동일 테스트 복제)
    const t = Content.tests(p).slice(); if (t.length === 1) t.push({ ...t[0] }); return t;
  },
  solutionCache: {},
  async expected(p, test, idx) { // 정답 코드 실행으로 기대값 계산
    const key = p.id + '|' + JSON.stringify(p.params || {}) + '|' + idx; if (this.solutionCache[key]) return this.solutionCache[key];
    const sol = p.type === 'bug' ? p.bug.solution : p.solution;
    let out = ''; const r = await Py.run({ code: sol, input: test.input || '', call: test.call || null, onOut: (t, e) => { if (!e) out += t; } });
    const v = { out, ret: r.ret, segs: r.segs, ok: r.ok }; this.solutionCache[key] = v; return v;
  },
  async runTests(p, code, onEach) {
    const tests = this.normTests(p); const results = []; let passed = 0;
    for (let i = 0; i < tests.length; i++) {
      const t = tests[i]; let out = '', err = '';
      const r = await Py.run({ code, input: t.input || '', call: t.call || null, onOut: (txt, e) => { if (e) err += txt; else out += txt; } });
      let ok = false, expected = t.output, actual = out, note = '';
      if (p.turtle) {
        const ex = await this.expected(p, t, i); const a = r.segs || [], b = ex.segs || [];
        ok = r.ok && a.length === b.length && a.every((s, k) => s.every((v, j) => Math.abs(v - b[k][j]) <= 1.5));
        expected = `선 ${b.length}개`; actual = r.ok ? `선 ${a.length}개` : '에러';
        if (r.ok && a.length !== b.length) note = `선의 개수가 달라요 (기대 ${b.length}, 내 그림 ${a.length})`;
        else if (r.ok && !ok) note = '선의 위치가 달라요';
      } else if (t.call) {
        let exp = t.ret; if (exp === '__COMPUTED__' || p.varied) { const ex = await this.expected(p, t, i); exp = ex.ret; }
        ok = r.ok && r.ret === exp; expected = `${t.call} → ${exp}`; actual = r.ok ? `${r.ret}` : '에러';
      } else {
        let exp = t.output; if (exp === '__COMPUTED__' || p.varied) { const ex = await this.expected(p, t, i); exp = ex.out; }
        ok = r.ok && this.norm(out, p.ignoreCase) === this.norm(exp, p.ignoreCase); expected = exp;
      }
      const res = { idx: i, ok, input: t.input || '', expected, actual, error: r.ok ? '' : (Py.explain(r) + (r.tb ? '\n' + r.tb : '')), hidden: i === tests.length - 1, note, raw: r };
      results.push(res); if (ok) passed++;
      if (onEach) onEach(res, i, tests.length);
      if (r.timeout) break;
    }
    return { passed, total: tests.length, results, allPass: passed === tests.length };
  },
  parsonsLines(sol) { return sol.split('\n').filter(l => l.trim() !== '').map(l => ({ indent: Math.floor((l.match(/^ */)[0].length) / 4), text: l.trim() })); },
  checkParsons(p, arranged) { // arranged: [{text, indent}]
    const sol = this.parsonsLines(p.parsons.solution); const wrong = [];
    if (arranged.length !== sol.length) { arranged.forEach((a, i) => { if (!sol[i] || sol[i].text !== a.text || sol[i].indent !== a.indent) wrong.push(i); }); return { ok: false, wrong, lengthMismatch: true }; }
    arranged.forEach((a, i) => { if (sol[i].text !== a.text || sol[i].indent !== a.indent) wrong.push(i); });
    return { ok: wrong.length === 0, wrong };
  },
  checkFill(p, answers) { const wrong = []; p.fill.blanks.forEach((b, i) => { const a = (answers[i] || '').trim(); if (!b.a.some(x => x.trim() === a)) wrong.push(i); }); return { ok: wrong.length === 0, wrong }; },
};

// ---------- 게임 시스템 ----------
const Game = {
  levelFromXp(xp) { let L = 1, need = CONFIG.xpForLevel(1), acc = 0; while (L < CONFIG.MAX_LEVEL && xp >= acc + need) { acc += need; L++; need = CONFIG.xpForLevel(L); } return { level: L, into: xp - acc, need: L >= CONFIG.MAX_LEVEL ? 0 : need }; },
  level() { return this.levelFromXp(Store.data.xp); },
  title(level) { return CONFIG.TITLES[Math.min(CONFIG.TITLES.length - 1, Math.floor((level - 1) / 5))]; },
  mascotStage(level) { let s = 0; CONFIG.MASCOT_STAGES.forEach((L, i) => { if (level >= L) s = i; }); return s; },
  combo: 0, noHintStreak: 0, sessionEvents: [],
  stat(key, delta = 1) { const s = Store.data.stats; s[key] = (s[key] || 0) + delta; return s[key]; },
  statMax(key, v) { const s = Store.data.stats; if ((s[key] || 0) < v) s[key] = v; },
  comboMult() { for (const [n, m] of CONFIG.COMBO_MULT) if (this.combo >= n) return m; return 1; },
  addXp(amount, reason = '') { amount = Math.round(amount); if (amount <= 0) return { amount: 0, levelUps: [] }; const before = this.level().level; Store.data.xp += amount; const after = this.level().level; const ups = []; for (let L = before + 1; L <= after; L++) ups.push({ level: L, title: this.title(L), titleChanged: this.title(L) !== this.title(L - 1), stageChanged: CONFIG.MASCOT_STAGES.includes(L) }); Store.save(); return { amount, levelUps: ups }; },
  // 문제 클리어 처리 → 이벤트 목록 반환
  clearProblem(p, { mode, hints, firstTry, usedTutor, inReview, inChallenge, inTimeAttack }) {
    const rec = Store.prob(p.id); const d = Store.data; const events = []; const wasClear = rec.status === 'clear';
    const stars = rec.answerSeen ? 0 : 3 - Math.min(3, hints);
    let xp = p.xp || CONFIG.XP[p.type] || 10;
    if (p.boss) xp = this.bossXp(p);
    xp *= CONFIG.HINT_XP_MULT[Math.min(3, rec.answerSeen ? 3 : hints)];
    if (p.dual && mode === 'text') xp *= CONFIG.TEXT_MODE_MULT;
    if (firstTry && !wasClear) xp *= 1 + CONFIG.FIRST_TRY_BONUS;
    if (inChallenge) xp *= CONFIG.DAILY_CHALLENGE_MULT;
    // 콤보
    if (!inTimeAttack) { if (hints === 0 && !rec.answerSeen) { this.combo++; } else { this.combo = 0; } }
    this.statMax('maxCombo', this.combo);
    xp *= this.comboMult();
    if (wasClear && !inReview && !inChallenge) xp = Math.round(xp * 0.3); // 다시 풀기는 30%
    if (inReview) xp = CONFIG.REVIEW_XP_BONUS_PER;
    // 기록
    rec.status = 'clear'; rec.clearedAt = Date.now();
    if (!wasClear || stars > rec.stars) rec.stars = Math.max(rec.stars, stars);
    if (!wasClear) { rec.firstTry = !!firstTry; this.stat('clears'); if (firstTry) this.stat('firstTryClears'); if (rec.fails >= 5) this.stat('fail5Clear'); if (rec.hadError) this.stat('errorsOvercome'); }
    if (hints === 0 && !rec.answerSeen) { this.noHintStreak++; this.statMax('noHintStreak', this.noHintStreak); } else this.noHintStreak = 0;
    if (mode === 'text' && p.type === 'code') this.stat('textClears'); if (p.type === 'parsons') this.stat('parsonsClears');
    if (p.boss) { d.stats['boss_' + p.lesson] = 1; this.stat('bossClears'); }
    if (usedTutor) this.stat('tutorBreakthrough');
    const h = new Date().getHours(); if (h >= 0 && h < 4) this.stat('nightClear');
    // 복습 큐
    if (!inReview) { const stage = (hints > 0 || rec.fails >= 3) ? 0 : 1; /* 힌트·3회 실패는 1일, 깔끔한 클리어는 3일부터 */ rec.review = { stage, due: addDays(todayKey(), CONFIG.REVIEW_INTERVALS[stage]) }; }
    // 일일/스트릭
    const today = todayKey(); d.days[today] = (d.days[today] || 0) + 1; this.touchStreak();
    if (d.days[today] === d.dailyGoal && !d.dailyGoalDates[today]) { d.dailyGoalDates[today] = true; this.stat('dailyGoalsMet'); events.push({ type: 'dailyGoal' }); Store.data.xp += CONFIG.DAILY_GOAL_BONUS; }
    // 레슨 전체 별 3
    const lp = Content.problemsOf(p.lesson); if (lp.length && lp.every(q => Store.prob(q.id).stars === 3) && !d.lessons['star3_' + p.lesson]) { d.lessons['star3_' + p.lesson] = true; this.stat('lessonsAll3'); }
    if (PROBLEMS.every(q => Store.prob(q.id).status === 'clear')) d.stats.allClear = 1;
    const r = this.addXp(xp); events.push({ type: 'xp', amount: r.amount, stars, combo: this.combo, mult: this.comboMult() }); r.levelUps.forEach(u => events.push({ type: 'levelUp', ...u }));
    this.checkChapterPerfect(p);
    this.checkBadges().forEach(b => events.push({ type: 'badge', badge: b }));
    Store.save(); return events;
  },
  bossXp(p) { const lesson = Content.lesson(p.lesson); const chProbs = PROBLEMS.filter(q => Content.lesson(q.lesson).ch === lesson.ch && !q.boss); const sum = chProbs.reduce((a, q) => a + (q.xp || CONFIG.XP[q.type] || 10), 0); return Math.max(60, Math.round(sum * CONFIG.BOSS_XP_RATIO)); },
  failProblem(p) { const rec = Store.prob(p.id); rec.fails++; rec.attempts++; this.combo = 0; this.noHintStreak = 0; if (rec.status !== 'clear') rec.status = 'try'; Store.save(); },
  recordError(p) { this.stat('errors'); if (p) Store.prob(p.id).hadError = true; Store.save(); },
  checkChapterPerfect(p) { const lesson = Content.lesson(p.lesson); const ch = lesson.ch; if (!ch) return; const probs = PROBLEMS.filter(q => Content.lesson(q.lesson).ch === ch); if (probs.every(q => { const r = Store.prob(q.id); return r.status === 'clear' && r.stars === 3 && r.firstTry; })) Store.data.stats['perfect_' + ch] = 1; },
  checkBadges() { const d = Store.data; const got = []; BADGES.forEach(b => { if (d.badges.includes(b.id)) return; const [k, v] = b.cond; if ((d.stats[k] || 0) >= v) { d.badges.push(b.id); d.badgeDates[b.id] = Date.now(); got.push(b); } }); if (got.length) Store.save(); return got; },
  touchStreak() { const s = Store.data.streak; const today = todayKey(); if (s.last === today) return; if (s.last && daysBetween(s.last, today) === 1) s.cur++; else if (s.last && daysBetween(s.last, today) > 1) s.cur = 1; else if (!s.last) s.cur = 1; s.last = today; s.best = Math.max(s.best, s.cur); this.statMax('bestStreak', s.best); },
  currentStreak() { const s = Store.data.streak; if (!s.last) return 0; const gap = daysBetween(s.last, todayKey()); return gap <= 1 ? s.cur : 0; },
  isUnlocked(item) { if (!item.unlock) return true; if (item.unlock.level) return this.level().level >= item.unlock.level; if (item.unlock.badge) return Store.data.badges.includes(item.unlock.badge); return false; },
  unlockText(item) { if (!item.unlock) return ''; if (item.unlock.level) return `레벨 ${item.unlock.level}`; const b = BADGES.find(x => x.id === item.unlock.badge); return b ? `뱃지 "${b.secret ? '???' : b.name}"` : ''; },
  // 잠금: 보스를 깨야 다음 챕터
  chapterOpen(ch) { if (ch <= 1) return true; return !!Store.data.stats['boss_B' + (ch - 1)]; },
  lessonOpen(l) { if (!this.chapterOpen(l.ch)) return false; const idx = LESSONS.findIndex(x => x.id === l.id); if (idx === 0) return true; const prev = LESSONS[idx - 1]; if (prev.ch !== l.ch) return true; return this.lessonDone(prev); },
  lessonDone(l) { const ps = Content.problemsOf(l.id); return ps.length > 0 && ps.every(p => Store.prob(p.id).status === 'clear'); },
  lessonStars(l) { const ps = Content.problemsOf(l.id); if (!ps.length) return 0; return Math.min(...ps.map(p => Store.prob(p.id).stars)); },
  currentLesson() { for (const l of LESSONS) { if (this.lessonOpen(l) && !this.lessonDone(l)) return l; } return LESSONS[LESSONS.length - 1]; },
};

// ---------- 복습 ----------
const Review = {
  due() { const today = todayKey(); return PROBLEMS.filter(p => { const r = Store.prob(p.id); return r.status === 'clear' && r.review && r.review.due <= today; }); },
  afterReview(p, success, hints) { const r = Store.prob(p.id); const st = r.review ? r.review.stage : 0; const next = (success && hints === 0) ? Math.min(CONFIG.REVIEW_INTERVALS.length - 1, st + 1) : 0; r.review = { stage: next, due: addDays(todayKey(), CONFIG.REVIEW_INTERVALS[next]) }; if (success) { Game.stat('reviewsDone'); const rt = Store.data.reviewToday; if (rt.date !== todayKey()) { rt.date = todayKey(); rt.count = 0; } rt.count++; } Store.save(); },
  tagStats() { const tags = {}; PROBLEMS.forEach(p => { const r = Store.prob(p.id); p.tags.forEach(t => { tags[t] = tags[t] || { total: 0, clear: 0, attempts: 0, fails: 0 }; const s = tags[t]; s.total++; if (r.status === 'clear') s.clear++; s.attempts += r.attempts; s.fails += r.fails; }); }); return tags; },
  weakest() { const ts = this.tagStats(); let w = null, wr = 2; Object.entries(ts).forEach(([t, s]) => { if (s.attempts + s.clear === 0) return; const rate = s.clear / Math.max(1, s.clear + s.fails); if (rate < wr) { wr = rate; w = t; } }); return w; },
  quizPool(uptoLesson) { const idx = LESSONS.findIndex(l => l.id === uptoLesson); return PROBLEMS.filter(p => ['quiz', 'fill'].includes(p.type) && LESSONS.findIndex(l => l.id === p.lesson) <= idx); },
};

// ---------- 선생님 (Claude API) ----------
const Tutor = {
  async call({ system, messages, onText, maxTokens }) {
    const key = Store.data.settings.apiKey; if (!key) throw new Error('NOKEY');
    let res;
    try {
      res = await fetch(CONFIG.TUTOR.url, { method: 'POST', headers: { 'x-api-key': key, 'anthropic-version': CONFIG.TUTOR.version, 'anthropic-dangerous-direct-browser-access': 'true', 'content-type': 'application/json' },
        body: JSON.stringify({ model: Store.data.settings.model || CONFIG.TUTOR.defaultModel, max_tokens: maxTokens || CONFIG.TUTOR.maxTokens, system, messages, stream: true }) });
    } catch (e) { throw new Error('NET'); }
    if (res.status === 401 || res.status === 403) throw new Error('AUTH'); if (res.status === 429) throw new Error('RATE'); if (!res.ok) { let m = ''; try { m = (await res.json()).error?.message || ''; } catch (e) {} throw new Error('HTTP ' + res.status + (m ? ': ' + m : '')); }
    const reader = res.body.getReader(); const dec = new TextDecoder(); let buf = '', full = '';
    while (true) { const { done, value } = await reader.read(); if (done) break; buf += dec.decode(value, { stream: true }); const lines = buf.split('\n'); buf = lines.pop();
      for (const line of lines) { if (!line.startsWith('data:')) continue; const js = line.slice(5).trim(); if (!js || js === '[DONE]') continue; try { const ev = JSON.parse(js); if (ev.type === 'content_block_delta' && ev.delta && ev.delta.text) { full += ev.delta.text; if (onText) onText(ev.delta.text, full); } if (ev.type === 'error') throw new Error(ev.error?.message || 'API error'); } catch (e) { if (e.message && e.message !== 'Unexpected token') { /* ignore parse */ } } } }
    return full;
  },
  errMsg(e) { const m = e && e.message || ''; if (m === 'NOKEY') return T.noKey; if (m === 'AUTH') return T.keyBad; if (m === 'RATE') return T.rateLimit; if (m === 'NET') return T.netErr; return '오류: ' + m; },
  async test() { return this.call({ system: '한 단어로만 답해.', messages: [{ role: 'user', content: '안녕' }], maxTokens: 20 }); },
  context({ lesson, problem, code, lastRun, hints, answerSeen, trace, pageHtml }) {
    const parts = [];
    if (lesson) parts.push(`[현재 레슨] ${lesson.title}\n[핵심 개념] ${lesson.tutorSummary || ''}`);
    if (pageHtml) parts.push(`[설명 내용]\n${pageHtml.replace(/<[^>]+>/g, '').slice(0, 1500)}`);
    if (problem) parts.push(`[문제] ${problem.title}\n${problem.prompt.replace(/<[^>]+>/g, '')}`);
    if (code != null) parts.push(`[사용자의 현재 코드]\n${code}`);
    if (lastRun) parts.push(`[마지막 실행 결과]\n${lastRun}`);
    if (hints != null) parts.push(`[사용한 힌트 단계] ${hints}/3`);
    if (answerSeen) parts.push(`[사용자는 이 문제의 "정답 보기"를 이미 열었음 → 전체 코드 설명 허용]`);
    if (trace) parts.push(`[한 줄씩 보기 현재 단계] ${trace}`);
    return parts.join('\n\n');
  },
};

// ---------- 효과음 (Web Audio 합성) ----------
const Audio = {
  ctx: null, get on() { return Store.data.settings.sound; },
  wave() { const s = INVENTORY.sound.find(x => x.id === Store.data.settings.soundSet); return s ? s.wave : 'sine'; },
  _ctx() { if (!this.ctx) { try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return null; } } if (this.ctx.state === 'suspended') this.ctx.resume(); return this.ctx; },
  tone(freq, dur = 0.12, type = null, vol = 0.18, delay = 0, slide = 0) { if (!this.on) return; const c = this._ctx(); if (!c) return; const o = c.createOscillator(), g = c.createGain(); o.type = type || this.wave(); const t = c.currentTime + delay; o.frequency.setValueAtTime(freq, t); if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), t + dur); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + dur); o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + dur + 0.02); },
  click() { this.tone(900, 0.05, 'square', 0.06); },
  pass() { this.tone(660, 0.08); this.tone(880, 0.1, null, 0.18, 0.08); },
  clear() { [523, 659, 784, 1047].forEach((f, i) => this.tone(f, 0.15, null, 0.2, i * 0.09)); this.tone(1319, 0.35, null, 0.2, 0.36); },
  combo(n) { this.tone(440 + Math.min(n, 15) * 60, 0.1, 'triangle', 0.15); },
  levelUp() { [392, 523, 659, 784, 1047, 1319].forEach((f, i) => this.tone(f, 0.18, null, 0.2, i * 0.1)); this.tone(1568, 0.5, null, 0.2, 0.62); },
  badge() { this.tone(1200, 0.08, 'triangle', 0.15); this.tone(1800, 0.14, 'triangle', 0.15, 0.07); },
  boss() { [262, 330, 392, 523, 659, 784, 1047].forEach((f, i) => this.tone(f, 0.2, null, 0.22, i * 0.11)); this.tone(1319, 0.7, null, 0.22, 0.8); },
  wrong() { this.tone(180, 0.18, 'sawtooth', 0.12, 0, -60); },
  hit() { this.tone(120, 0.12, 'square', 0.15, 0, -50); },
  type() { this.tone(1500, 0.02, 'square', 0.02); },
};
const Haptic = { tap(ms = 20) { if (Store.data.settings.vibrate && navigator.vibrate) try { navigator.vibrate(ms); } catch (e) {} } };

// ---------- 색종이 ----------
const Confetti = {
  canvas: null, ctx: null, parts: [], raf: null,
  init() { this.canvas = $('#confetti'); this.ctx = this.canvas.getContext('2d'); const rs = () => { this.canvas.width = innerWidth; this.canvas.height = innerHeight; }; addEventListener('resize', rs); rs(); },
  colors() { const c = INVENTORY.confetti.find(x => x.id === Store.data.settings.confetti); return c ? c.colors : INVENTORY.confetti[0].colors; },
  burst(n = 120, x = null, y = null) { const anim = Store.data.settings.anim; if (anim === 0) return; n = Math.round(n * (anim === 1 ? 0.4 : 1)); const cols = this.colors(); const cx = x ?? innerWidth / 2, cy = y ?? innerHeight * 0.4; for (let i = 0; i < n; i++) { const a = Math.random() * Math.PI * 2, sp = 4 + Math.random() * 9; this.parts.push({ x: cx, y: cy, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 4, g: 0.18, w: 6 + Math.random() * 6, h: 4 + Math.random() * 6, r: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.3, c: cols[i % cols.length], life: 90 + Math.random() * 60 }); } if (!this.raf) this.loop(); },
  rain(n = 200) { const anim = Store.data.settings.anim; if (anim === 0) return; const cols = this.colors(); for (let i = 0; i < n; i++) this.parts.push({ x: Math.random() * innerWidth, y: -20 - Math.random() * innerHeight * 0.5, vx: (Math.random() - 0.5) * 2, vy: 2 + Math.random() * 3, g: 0.03, w: 6 + Math.random() * 6, h: 4 + Math.random() * 6, r: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.2, c: cols[i % cols.length], life: 200 + Math.random() * 100 }); if (!this.raf) this.loop(); },
  loop() { const c = this.ctx; const step = () => { c.clearRect(0, 0, this.canvas.width, this.canvas.height); this.parts = this.parts.filter(p => p.life > 0 && p.y < innerHeight + 30); for (const p of this.parts) { p.vy += p.g; p.x += p.vx; p.y += p.vy; p.vx *= 0.99; p.r += p.vr; p.life--; c.save(); c.translate(p.x, p.y); c.rotate(p.r); c.fillStyle = p.c; c.globalAlpha = Math.min(1, p.life / 30); c.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); c.restore(); } if (this.parts.length) this.raf = requestAnimationFrame(step); else { this.raf = null; c.clearRect(0, 0, this.canvas.width, this.canvas.height); } }; this.raf = requestAnimationFrame(step); },
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
