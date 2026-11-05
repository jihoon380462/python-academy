#!/usr/bin/env python3
# tools/regress.py — 헤드리스 크롬 회귀 (로컬 전용: Playwright + /usr/bin/google-chrome, 샌드박스는 CDN 접근 불가라 Pyodide/CodeMirror는 폴백 동작만 확인)
#   1) v1 저장 데이터 → v2 마이그레이션 수치 보존  2) 허브 렌더·이어서 하기  3) 코스 페이지 전 화면 + 문제 유형별 채점  4) 모바일 390px 가로 스크롤 없음  5) 콘솔 에러 0
import json, os, sys, time
from playwright.sync_api import sync_playwright
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__))); HUB='file://'+os.path.join(ROOT,'index.html'); COURSE='file://'+os.path.join(ROOT,'courses/python/index.html')
SHOT=os.path.join(ROOT,'tools/.out/shots'); os.makedirs(SHOT,exist_ok=True)
V1={"v":1,"nick":"테스터","mascotColor":1,"onboarded":True,"xp":385,"badges":["first_run","first_clear"],"badgeDates":{"first_run":"2026-10-20"},"stats":{"runs":12},
    "problems":{"L0P1":{"status":"clear","stars":3,"hints":0,"attempts":1,"fails":0,"code":None,"mode":None,"clearedAt":"2026-10-20"},"L3P2":{"status":"try","stars":0,"hints":1,"attempts":2,"fails":1,"code":"n = int(input())\n","mode":"text"},"L5P2":{"status":"none","stars":0,"hints":0,"attempts":0,"fails":0,"code":json.dumps({"answer":[{"text":"total = 0","indent":0}]}),"mode":"parsons"},"L6P2":{"status":"none","stars":0,"hints":0,"attempts":0,"fails":0,"code":json.dumps({"answer":[{"text":"while True:","indent":0}]}),"mode":"parsons"},"L1P2":{"status":"try","stars":0,"hints":0,"attempts":1,"fails":1,"code":json.dumps({"blocks":{"languageVersion":0,"blocks":[]}}),"mode":"block"}},
    "lessons":{"L0":{"page":4},"terms":{"print":True}},"streak":{"cur":3,"best":5,"last":time.strftime('%Y-%m-%d')},"days":{time.strftime('%Y-%m-%d'):2},"dailyGoal":5,"dailyGoalDates":{},
    "settings":{"theme":"light","font":2,"sound":True,"vibrate":True,"anim":2,"apiKey":"sk-ant-test","model":"claude-haiku-5-5","editorTheme":"classic","confetti":"rainbow","soundSet":"bell","accessory":"none","turtleSpeed":6,"focus":True},
    "works":[{"id":"w1","name":"구구단","code":"print(1)","date":1}],"tutorChats":{"L3P2":[{"role":"user","content":"hi"}]},"myProblems":[],"bestTimes":{"L1":42},"dailyChallenge":None,"checkups":{"1":80},"playgroundXp":{"date":"","amount":0},"polished":{},"examplesEdited":{},"reviewToday":{"date":"","count":0},"chapterPerfect":{},"updatedAt":1700000000000}
VIZ_JS = """()=>{ const host=document.createElement('div'); host.style.width='600px'; document.body.appendChild(host); const steps=[{line:1,vis:{a:[3,1,2],j:0},stack:[]},{line:2,vis:{a:[1,3,2],j:1},stack:[]},{line:3,vis:{a:[1,2,3],j:2},stack:[]}]; const pl=Viz.player(host,{steps,spec:{kind:'bars',var:'a',hl:['j']},title:'t'}); const ok1=!!host.querySelector('canvas'); const kinds=['boxes','linked','tree','graph','grid','table','callstack']; const specs={boxes:{kind:'boxes',var:'a'},linked:{kind:'linked',var:'h'},tree:{kind:'tree',var:'r'},graph:{kind:'graph',var:'g',visited:'v'},grid:{kind:'grid',var:'gr',visited:'vv'},table:{kind:'table',var:'dp'},callstack:{kind:'callstack'}}; const snap={a:[1,2],h:{__cls:'Node',__id:1,val:1,next:{__cls:'Node',__id:2,val:2,next:null}},r:{__cls:'Node',__id:3,val:5,left:{__cls:'Node',__id:4,val:3,left:null,right:null},right:null},g:{A:['B'],B:['A']},v:{__set:['A']},gr:[[0,1],[0,0]],vv:[[true,false],[false,false]],dp:[1,1,2,3]}; let errs=0; const c=document.createElement('canvas'); c.style.width='400px'; c.style.height='200px'; document.body.appendChild(c); for(const k of kinds){ try{ Viz.frame(c,specs[k],{vis:snap,stack:['f','g'],vars:{n:1}},null,1); const ctx=c.getContext('2d'); }catch(e){errs++; console.error('viz',k,e.message);} } return {ok1, frames:pl.frames.length, errs}; }"""
fails=[]
def check(cond, msg):
    print(('  ✓ ' if cond else '  ✗ ')+msg)
    if not cond: fails.append(msg)
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox','--allow-file-access-from-files'])
    ctx=b.new_context(viewport={'width':1280,'height':900}); errors=[]; logs=[]
    # 위 가짜 기기 연동(gist 'g1')이 인터넷 되는 CI 에서 진짜 api.github.com 으로 나가지 않게 바로 실패시킨다(로컬 오프라인과 같은 조건). ※ CI 로그의 「화면 settings 78초」는 출력 버퍼링 착시였음 — ci.yml PYTHONUNBUFFERED
    ctx.route('https://api.github.com/**', lambda r: r.abort())
    pg=ctx.new_page(); pg.on('console', lambda m: logs.append((m.type, m.text[:300]))); pg.on('pageerror', lambda e: errors.append(str(e)[:500]))
    pg.add_init_script("if(!localStorage.getItem('academy.profile')&&!localStorage.getItem('__seeded')){localStorage.setItem('python_academy_save', "+json.dumps(json.dumps(V1,ensure_ascii=False),ensure_ascii=False)+"); localStorage.setItem('python_academy_sync', JSON.stringify({token:'ghp_x',gistId:'g1',lastSyncAt:1,lastRemoteUpdated:1,lastLocalUpdated:1})); localStorage.setItem('__seeded','1');}")
    # ---- 1. 허브: 마이그레이션 + 렌더
    print('[허브]'); pg.goto(HUB); pg.wait_for_timeout(600)
    r=pg.evaluate("""()=>({keys:Object.keys(localStorage).filter(k=>k.startsWith('academy.')).sort(), v1:localStorage.getItem('python_academy_save'), backup:!!localStorage.getItem('academy.backup.v1'), xp:Store.data.xp, nick:Store.data.nick, badges:Store.data.badges.length, streak:Store.data.streak.cur, stars:Store.data.problems.L0P1.stars, code:Store.data.problems.L3P2.code, parsons:Store.data.problems.L5P2.code, works:Store.data.works.length, chats:Object.keys(Store.data.tutorChats).length, apiKey:Store.data.settings.apiKey, theme:Store.data.settings.theme, focus:Store.data.settings.focus, bestT:Store.data.bestTimes.L1, checkup:Store.data.checkups[1], sync:Sync.on, topbar:document.querySelector('#topbar').innerText, cont:document.querySelector('.hub-cont')?.getAttribute('href'), cards:document.querySelectorAll('.hc').length, ready:document.querySelectorAll('.hc.ready').length, today:document.querySelector('.hub-stats')?.innerText})""")
    check(r['keys']==['academy.backup.v1','academy.course.python','academy.profile','academy.sync','academy.tutor.python','academy.works'], '저장 키가 academy.* 조각으로 나뉨: '+','.join(r['keys']))
    check(r['v1'] is None and r['backup'], 'v1 키 제거 + academy.backup.v1 보관')
    check(r['xp']==385 and r['nick']=='테스터' and r['badges']==2 and r['streak']==3 and r['stars']==3, f"XP/닉네임/뱃지/스트릭/별점 보존 (xp={r['xp']})")
    check(r['code']=='n = int(input())\n' and 'total' in r['parsons'], '풀다 만 코드·Parsons 배치 보존')
    check(r['works']==1 and r['chats']==1 and r['bestT']==42 and r['checkup']==80, '작품·선생님 대화·타임어택·체크업 보존')
    check(r['apiKey']=='sk-ant-test' and r['theme']=='light' and r['focus'] is True, '설정(API 키·테마·집중 모드) 보존')
    check(r['sync'] is True, '기기 연동 설정 키 이전(academy.sync)')
    check(r['cards']==6 and r['ready']==2, f"코스 카드 6개(코스 5 + 수학 공간), 열린 것 2개 (cards={r['cards']}, ready={r['ready']})")
    check(r['cont'] and '#' in r['cont'], '이어서 하기 링크: '+str(r['cont']))
    check('일일 목표 2/5' in (r['today'] or ''), '오늘의 할 일: '+(r['today'] or '').replace('\n',' '))
    pg.screenshot(path=SHOT+'/hub.png')
    # ---- 2. 코스 페이지
    print('[코스 페이지]'); pg.goto(COURSE+'#problem/L3P2'); pg.wait_for_timeout(1500); pg.evaluate("Loader.minimized=true;Loader.render()")
    check(pg.evaluate("UI.view")=='problem' and pg.evaluate("UI.params.pid")=='L3P2', '딥링크 #problem/L3P2 로 문제 화면 진입')
    check(pg.evaluate("Store.data.xp")==385 and pg.evaluate("localStorage.getItem('python_academy_save')") is None, '코스 페이지도 같은 v2 데이터')
    pg.evaluate("UI.go('problem',{pid:'L7P3'})"); pg.wait_for_timeout(200); check(pg.evaluate("Object.keys(localStorage).some(k=>{ if(!k.startsWith('academy.')) return false; try { const v=JSON.parse(localStorage.getItem(k)); return v && v.last && v.last.params && v.last.params.pid==='L7P3'; } catch(e){ return false; } })"), '문제 열기만 해도 이어서 하기 위치 저장 (QA #4)'); pg.evaluate("UI.go('problem',{pid:'L3P2'})"); pg.wait_for_timeout(200)
    check(pg.locator('#pvCoach .coach').count()==1, '텍스트 코치 표시'); check(pg.locator('.pv.focus').count()==1, '집중 모드 유지')
    check(pg.locator('.tb-hub').count()==1, '상단바 허브 버튼')
    pg.evaluate("(()=>{ const r=Store.prob('L8P1'); window.__bak=JSON.stringify(r); Store.setCode('L8P1','# 내 예전 답','text'); r.status='clear'; })()")
    edv="(()=>{ const t=document.querySelector('#pvEd textarea, #pvEd .cm-content'); return t ? (t.value!==undefined ? t.value : t.innerText) : ''; })()"
    rf={}
    for k,prm in [('normal',"{pid:'L8P1',lessonId:'L8'}"),('review',"{pid:'L8P1',lessonId:'L8',inReview:true}"),('chal',"{pid:'L8P1',lessonId:'L8',inChallenge:true}")]:
        pg.evaluate(f"UI.go('problem',{prm})"); pg.wait_for_timeout(400); rf[k]=pg.evaluate(edv); rf[k+'Nav']=pg.locator('#btnPrevP, #btnNextP').count()
    check('예전 답' in rf['normal'] and '예전 답' not in rf['review'] and '예전 답' not in rf['chal'] and rf['reviewNav']==0 and rf['chalNav']==0, '복습·도전은 내 예전 답 없이 시작·이전/다음 버튼 숨김, 일반 화면은 이어서 (QA #89~#91): '+str(rf))
    pg.evaluate("UI.go('reviewMore')"); pg.wait_for_timeout(400); rvp=pg.locator('.rv-list li').count(); pg.evaluate("document.querySelector('#rvGo').click()"); pg.wait_for_timeout(400); rm=pg.evaluate("({v:UI.view, ex:!!(UI.params.session && UI.params.session.extraReview), clear:!!(UI.params.session && UI.params.session.pids.every(id=>Store.prob(id).status==='clear'))})"); rm=rm['v']=='problem' and rm['ex'] and rm['clear']
    pg.evaluate("(()=>{ Object.assign(Store.prob('L8P1'), JSON.parse(window.__bak)); UI.go('home'); })()"); pg.wait_for_timeout(300)
    check(rvp>=1 and rm and pg.locator('[data-go=reviewMore]').count()>=1, '홈 「더 복습하기」 → 미리보기 → 클리어한 문제로 복습 세션 (QA #92·#116)')
    # QA #116 (사용자 요청 11/4): 복습 고르기 = 약점·밀린 날·챕터 고르게 + 왜 나왔나 + 이번에 연 힌트만
    rv=pg.evaluate("""(()=>{ const bak=JSON.stringify(Store.data.problems); const ids=[]; const today=todayKey();
      PROBLEMS.filter(p=>['L1','L2','L5','L6','L9','L10'].includes(p.lesson)).forEach((p,k)=>{ const r=Store.prob(p.id); r.status='clear'; r.stars=3; r.hints=0; r.fails=0; r.answerSeen=false; r.review={stage:1,due:addDays(today,-1)}; });
      Object.assign(Store.prob('L5P1'),{fails:4,hints:2,stars:1});
      const pl=Review.plan({mode:'due'}); const chs=new Set(pl.items.map(x=>x.ch)); const first=pl.items[0];
      const only=Review.plan({mode:'extra',lessonIds:['L9']}).items.every(x=>x.lesson==='L9');
      window.__rvbak=bak; UI.go('problem',{pid:'L5P1',lessonId:'L5',inReview:true,session:{reasons:{L5P1:first.reasons},rv:{},pids:['L5P1'],results:{},goto(){}}});
      return {n:pl.items.length, chs:chs.size, first:first.id, only}; })()""")
    pg.wait_for_timeout(500); rv.update(pg.evaluate("(()=>{ const why=!!document.querySelector('.rv-in'); const hintsOpen=document.querySelectorAll('#pvHints .hint').length; Store.data.problems=JSON.parse(window.__rvbak); UI.go('home'); return {why, hintsOpen}; })()")); pg.wait_for_timeout(300)
    check(rv['n']==5 and rv['chs']>=3 and rv['first']=='L5P1' and rv['why'] and rv['hintsOpen']==0 and rv['only'], '복습: 약점 문제가 먼저·5문제가 3챕터 이상에 고르게·범위 지정·「왜 나왔나」·예전 힌트 접힘 (QA #116): '+str(rv))
    # QA #149 (v2.7.0): 복습 고르기 나머지 — 날 된 문제 우선·더 복습하기는 날 안 된 것·약점 점수 감소·하루 보너스 날짜·전체 해제·모드별 범위·다시 고르기·예전 힌트 별·끝 요약 창·대비
    q=pg.evaluate("""(()=>{ const D=Store.data; const bak={problems:JSON.stringify(D.problems), xp:D.xp, days:JSON.stringify(D.days), stats:JSON.stringify(D.stats), rt:JSON.stringify(D.reviewToday), lessons:JSON.stringify(D.lessons), badges:JSON.stringify(D.badges), badgeDates:JSON.stringify(D.badgeDates), streak:JSON.stringify(D.streak), nh:Game.noHintStreak, combo:Game.combo}; window.__q149=bak; const today=todayKey(); const out={};
      const clean=(id,due)=>Object.assign(Store.prob(id),{status:'clear',stars:3,hints:0,fails:0,answerSeen:false,reviewOk:0,clearedAt:Date.now(),review:{stage:1,due:addDays(today,due?-2:3)}});
      const weak=(id)=>Object.assign(clean(id,false),{fails:5,hints:3,answerSeen:true,stars:0});
      ['L1P1','L1P2','L1P3'].forEach(id=>clean(id,true)); ['L5P1','L5P2','L5P3','L9P1','L9P2','L9P3','L13P1','L13P2'].forEach(weak); Store.prob('L0P1').review={stage:2,due:addDays(today,5)};
      const due=Review.plan({mode:'due'}); out.dueAll=['L1P1','L1P2','L1P3'].every(id=>due.items.some(x=>x.id===id)); out.dueFill=due.items.filter(x=>x.kind==='weak').length; out.dueFillTag=due.items.filter(x=>x.kind==='weak').every(x=>x.reasons[0].includes('약점 보강'));
      const ex=Review.plan({mode:'extra'}); out.exN=ex.items.length; out.exNoDue=ex.items.every(x=>!x.due && !['L1P1','L1P2','L1P3'].includes(x.id));
      out.exFallback=Review.plan({mode:'extra',lessonIds:['L1']}).items.length===3; /* 날 안 된 것이 없으면 날 된 것으로 채움 */
      Review.noteResult(Content.problem('L5P1'),true,0); const wk=Review.plan({mode:'weak',n:1,lessonIds:['L5'],only:p=>['L5P1','L5P2'].includes(p.id)}); out.okCount=Store.prob('L5P1').reviewOk; out.weakPick=wk.items[0].id; out.weakReason=Review.plan({mode:'weak',n:2,lessonIds:['L5'],only:p=>['L5P1','L5P2'].includes(p.id)}).items.some(x=>x.id==='L5P1'&&x.reasons.join().includes('약점 점수를 낮췄어요')); Review.noteResult(Content.problem('L5P1'),false,0); out.okReset=Store.prob('L5P1').reviewOk;
      out.noneSel=Review.candidates([]).length===0 && Review.plan({mode:'due',lessonIds:[]}).items.length===0 && Review.candidates(null).length>0;
      D.reviewToday={date:addDays(today,-1),count:3,bonus:true}; Review.afterReview(Content.problem('L1P1'),true,0); const rt=D.reviewToday; out.bonusReset=rt.date===today&&rt.count===1&&rt.bonus===false;
      Object.assign(Store.prob('L2P1'),{status:'clear',stars:0,hints:3,fails:0,answerSeen:false}); const ev=Game.clearProblem(Content.problem('L2P1'),{mode:'text',hints:0,firstTry:false,inTimeAttack:true}); const xe=ev.find(e=>e.type==='xp'); out.taStars=xe.stars===0 && Store.prob('L2P1').stars===0;
      return out; })()""")
    check(q['dueAll'] and q['dueFill']==2 and q['dueFillTag'], '복습(#149): 같은 레슨의 날 된 문제 3개가 약점 문제에 안 밀리고 전부 들어감 + 모자란 2개는 「약점 보강」: '+str(q))
    check(q['exN']==5 and q['exNoDue'] and q['exFallback'], '더 복습하기(#149): 날 된 문제는 빼고 고름(없을 때만 채움): '+str({k:q[k] for k in ('exN','exNoDue','exFallback')}))
    check(q['okCount']==1 and q['weakPick']=='L5P2' and q['weakReason'] and q['okReset']==0, '약점 점수(#149): 복습에서 한 번에 맞히면 reviewOk 로 반감 → 같은 약점의 다른 문제가 먼저, 틀리면 0: '+str({k:q[k] for k in ('okCount','weakPick','weakReason','okReset')}))
    check(q['bonusReset'], '하루 보너스(#149): 날짜가 바뀌면 reviewToday.bonus 가 풀려 다시 받을 수 있음')
    check(q['noneSel'], '범위 「전체 해제」(#149): 빈 범위 = 아무것도 안 고름 (null 만 전체)')
    check(q['taStars'], '타임어택·도전(#149): 예전에 힌트 3개 본 문제는 힌트 창을 접고 다시 풀어도 별이 안 오름 (평생 힌트 기준)')
    bx=pg.evaluate("(()=>{ const D=Store.data; D.reviewToday={date:todayKey(),count:3,bonus:false}; const x0=D.xp; Sessions.reviewSummary({pids:['L1P1'],rv:{L1P1:{hints:0,fails:0}},extraReview:false,title:'t'}); return {dx:D.xp-x0, bonus:D.reviewToday.bonus, modal:!!document.querySelector('.modal')}; })()"); pg.wait_for_timeout(200); pg.evaluate("document.querySelectorAll('.modal-ov').forEach(e=>e.remove())")
    check(bx['dx']==pg.evaluate('CONFIG.REVIEW_BONUS') and bx['bonus'] and bx['modal'], '복습 끝 요약(#149): 하루 3개 채우면 보너스 +%d (%s)' % (pg.evaluate('CONFIG.REVIEW_BONUS'), bx))
    pg.evaluate("Store.data.lessons.reviewSel=['L1']; delete Store.data.lessons.reviewSelExtra; UI.go('review')"); pg.wait_for_timeout(300); r1=pg.locator('#rvRange').evaluate('e=>e.parentElement.innerText'); pg.evaluate("UI.go('reviewMore')"); pg.wait_for_timeout(300); r2=pg.locator('#rvRange').evaluate('e=>e.parentElement.innerText')
    check('레슨 1개' in r1 and '배운 레슨 전체' in r2, '두 모드 범위 분리(#149): 오늘의 복습 범위(레슨 1개)가 더 복습하기(전체)에 안 번짐 (%s / %s)' % (r1.strip()[:30], r2.strip()[:30]))
    ids0=pg.evaluate("[...document.querySelectorAll('.rv-list li b')].map(e=>e.textContent)"); pg.click('#rvRe'); pg.wait_for_timeout(300); ids1=pg.evaluate("[...document.querySelectorAll('.rv-list li b')].map(e=>e.textContent)")
    check(len(ids0)==5 and len(ids1)==5 and set(ids0)!=set(ids1), '「다시 고르기」(#149): 후보가 남아 있으면 다른 문제가 나옴 (%d개 바뀜)' % len(set(ids1)-set(ids0)))
    pg.click('#rvRange'); pg.wait_for_timeout(200); pg.click('#rvNone'); pg.wait_for_timeout(300); none=pg.evaluate("({dis:document.querySelector('#rvGo').disabled, n:document.querySelectorAll('.rv-list li').length, txt:document.querySelector('#rvRange').parentElement.innerText.includes('고른 레슨이 없어요'), saved:JSON.stringify(Store.data.lessons.reviewSelExtra)})")
    check(none['dis'] and none['n']==0 and none['txt'] and none['saved']=='[]', '범위 「전체 해제」 화면(#149): 목록 0 · 시작 비활성 · 고른 레슨 없음 안내 (%s)' % none); pg.click('#rvAll'); pg.wait_for_timeout(200)
    pg.evaluate("UI.go('weakness')"); pg.wait_for_timeout(300); pg.click('#wkStart'); pg.wait_for_timeout(400); wk=pg.evaluate("(()=>{ const s=UI.params.session; const w=s&&s.title.startsWith('#')?s.title.slice(1).split(' ')[0]:null; return {n:s?s.pids.length:0, w, tag:!!s&&!!w&&s.pids.every(id=>Content.problem(id).tags.includes(w)), why:!!document.querySelector('.rv-in'), first:!!s&&Store.prob(s.pids[0]).fails===5}; })()")
    check(1<=wk['n']<=3 and wk['tag'] and wk['why'] and wk['first'], '약점 분석 「가장 약한 개념 복습」(#149): 그 주제의 문제를 약점 순으로 최대 3개(약한 것이 첫 문제) + 왜 나왔나 (%s)' % wk)
    pg.set_viewport_size({'width':390,'height':600}); pg.evaluate("Store.data.settings.font=3; Store.data.settings.theme='light'; UI.applyTheme(); (()=>{ Sessions.reviewSummary({pids:['L5P1','L5P2','L5P3','L9P1','L9P2','L9P3','L13P1','L13P2'],rv:{L5P1:{hints:1,fails:2},L5P2:{hints:0,fails:0},L5P3:{hints:2,fails:1},L9P1:{hints:0,fails:3},L9P2:{hints:0,fails:0},L9P3:{hints:1,fails:0},L13P1:{hints:0,fails:1}},extraReview:false,title:'t'}); return 1; })()"); pg.wait_for_timeout(400)
    md=pg.evaluate("""(()=>{ const m=document.querySelector('.modal'); const bt=document.querySelector('.modal-btns').getBoundingClientRect(); const body=document.querySelector('.modal-body'); const lum=s=>{ const a=s.match(/[\\d.]+/g).map(Number); const f=c=>{c/=255;return c<=0.03928?c/12.92:Math.pow((c+0.055)/1.055,2.4)}; return 0.2126*f(a[0])+0.7152*f(a[1])+0.0722*f(a[2]); }; const w=document.querySelector('.rv-row .warn'); const cr=(1.05)/(lum(getComputedStyle(w).color)+0.05); return {btnIn:bt.bottom<=innerHeight && bt.top>=0, scroll:body.scrollHeight>body.clientHeight+2, h:Math.round(m.getBoundingClientRect().height), cr:+cr.toFixed(2)}; })()""")
    check(md['btnIn'] and md['scroll'] and md['cr']>=4.5, '복습 끝 요약 창(#149): 폰 「아주 크게」에서 버튼이 화면 안(본문만 스크롤) · 라이트 「✓ N번 틀린 뒤」 대비 ≥ 4.5 (%s)' % md)
    pg.evaluate("document.querySelectorAll('.modal-ov').forEach(e=>e.remove()); Store.data.settings.font=1; Store.data.settings.theme='dark'; UI.applyTheme()"); pg.set_viewport_size({'width':1280,'height':900})
    pg.evaluate("(()=>{ const D=Store.data; const b=window.__q149; D.problems=JSON.parse(b.problems); D.xp=b.xp; D.days=JSON.parse(b.days); D.stats=JSON.parse(b.stats); D.reviewToday=JSON.parse(b.rt); D.lessons=JSON.parse(b.lessons); D.badges=JSON.parse(b.badges); D.badgeDates=JSON.parse(b.badgeDates); D.streak=JSON.parse(b.streak); Game.noHintStreak=b.nh; Game.combo=b.combo; Store.save({silent:true}); UI.go('home'); })()"); pg.wait_for_timeout(300)
    pg.evaluate("UI.go('lesson',{lessonId:'L3',page:(Content.lesson('L3').pages||[]).length})"); pg.wait_for_timeout(300); dc=pg.locator('#startDrills').count()
    if dc: pg.click('#startDrills'); pg.wait_for_timeout(500)
    dr=pg.evaluate("({pid:UI.params.pid, drill:!!(UI.params.session&&UI.params.session.drill), ed:!!document.querySelector('#pvEd'), n:Content.drillsOf('L3').length, total:PROBLEMS.length, inProbs:PROBLEMS.some(p=>p.drill)})")
    # v2.5.0: L3 를 L3·L3B 로 나눠 L3 타자 연습은 7개
    check(dc==1 and dr['drill'] and dr['pid'].startswith('L3D') and dr['ed'] and dr['n']==7 and not dr['inProbs'], '⌨ 타자 연습: 레슨 요약 버튼 → 드릴 세션(텍스트), 진도용 PROBLEMS 에는 안 섞임 (QA #96): '+str(dr))
    pg.evaluate("UI.go('typing')"); pg.wait_for_timeout(300); ty=pg.evaluate("({v:UI.view, note:!!document.querySelector('.ty-note') && document.querySelector('.ty-note').textContent.includes('PC'), lessons:document.querySelectorAll('[data-l]').length})")
    pg.evaluate("Sessions.drillMix(['L3'])"); pg.wait_for_timeout(400); ty2=pg.evaluate("({drill:!!(UI.params.session&&UI.params.session.drill), allL3:UI.params.session.pids.every(id=>id.startsWith('L3D')), coach:!!document.querySelector('#pvCoach .coach')})")
    check(ty['v']=='typing' and ty['note'] and ty['lessons']>=1 and ty2['drill'] and ty2['allL3'] and not ty2['coach'], '⌨ 백문이불여일타 화면: PC 권장 안내·레슨 체크 → 고른 범위 드릴, 따라하기 숨김 (QA #96): '+str(ty)+str(ty2))
    pg.evaluate("UI.go('home')"); pg.wait_for_timeout(200)
    check(pg.locator('#btnTutor').count()==0 and pg.locator('#lpAsk').count()==0, '선생님 기능 꺼짐: 버튼 없음 (CONFIG.TUTOR.enabled=false)')
    bundle=pg.evaluate("Store.exportBundle()"); check('academy-bundle' in bundle and 'academy.course.python' in bundle and 'apiKey' not in bundle, '백업 묶음 내보내기(F8, API 키 제외)')
    check(pg.evaluate("(()=>{const q=document.querySelector('#quickkeys'); return q && q.textContent.includes('⇤') && q.textContent.includes('input');})()"), '모바일 입력 칩 ⇤·input (F12)')
    # v2.6.0 ③: 홈 = 레슨 탐색기(왼쪽 챕터 트리 · 가운데 레슨 카드 · 오른쪽 미리보기)
    pg.evaluate("UI.go('home')"); pg.wait_for_timeout(300); pg.click('.tr-ch[data-tch="1"]'); pg.wait_for_timeout(200); check(pg.locator('.tr-ch').count()>=6 and pg.locator('.lc').count()>=4 and pg.locator('.lc.boss').count()==1, '홈 탐색기: 챕터 트리 %d · 레슨 카드 %d · 보스 카드' % (pg.locator('.tr-ch').count(), pg.locator('.lc').count()))
    hg=pg.evaluate("(()=>{ const b=s=>document.querySelector(s).getBoundingClientRect(); const t=b('.ex3-tree'), m=b('.ex3-main'), p=b('.ex3-prev'); return {tw:Math.round(t.width), mw:Math.round(m.width), pw:Math.round(p.width), dy:Math.round(Math.abs(t.y-m.y))}; })()")
    check(hg['mw']>hg['tw'] and hg['mw']>hg['pw'] and hg['dy']<4 and pg.locator('.pv3-go').count()==1, 'PC 홈: 트리·카드·미리보기 세 열, 미리보기에 「이 레슨 시작」 (%s)' % hg)
    check(pg.locator('.lc.sel').count()==1 and pg.locator('.pv3-t').count()==1, '홈 탐색기: 열린 레슨이 선택돼 미리보기에 보임'); pg.click('.lc.sel'); pg.wait_for_timeout(300); check(pg.locator('.lesson.lp2').count()==1, '홈 탐색기: 선택된 카드 한 번 더 클릭 → 레슨 화면'); pg.evaluate("UI.go('home')"); pg.wait_for_timeout(200)
    pg.click('.tr-ch[data-tch="2"]'); pg.wait_for_timeout(200); check('반복' in pg.locator('.ex3-h').inner_text() and pg.locator('.lc').count()>=4, '홈 탐색기: 챕터 트리 클릭 → 가운데에 그 챕터 레슨 카드')
    # v2.6.0 QA 2차: 잠긴 레슨은 트리에서 열리지 않음 · 미리보기 「이어서」가 저장 쪽을 들고 감 · 좁은 화면에서도 「오늘 할 일」 진입점
    lk=pg.evaluate("(()=>{ const l=LESSONS.find(x=>!Game.lessonOpen(x)); if(!l) return null; UI._home.ch=l.ch; UI._home.sel=null; UI.go('home'); const b=document.querySelector('.tr-l[data-tl=\"'+l.id+'\"]'); b.click(); b.click(); return {id:l.id, dis:b.disabled, view:UI.view}; })()")
    check(lk is None or (lk['dis'] and lk['view']=='home'), '홈 탐색기: 잠긴 레슨은 트리에서 disabled, 두 번 눌러도 레슨 화면으로 안 감 (%s)' % lk)
    pg.evaluate("Store.data.lessons.L0=Object.assign(Store.data.lessons.L0||{},{page:1}); Store.save({silent:true}); UI._home.ch=0; UI._home.sel='L0'; UI.go('home')"); pg.wait_for_timeout(200); check('2쪽부터' in pg.locator('.pv3-go').inner_text(), '홈 미리보기: 저장 쪽이 있으면 「▶ 2쪽부터 이어서」'); pg.click('.pv3-go'); pg.wait_for_timeout(300); check(pg.evaluate('UI.params.page')==1 and pg.evaluate('Store.data.lessons.L0.page')==1, '홈 미리보기 「이어서」 → 저장 쪽(2쪽)으로 열리고 저장값 유지'); pg.evaluate("UI.go('home')"); pg.wait_for_timeout(200)
    pg.set_viewport_size({'width':1024,'height':800}); pg.wait_for_timeout(150); check(pg.locator('.td-narrow').evaluate('e=>getComputedStyle(e).display')!='none' and pg.locator('.ex3-prev').evaluate('e=>getComputedStyle(e).display')=='none' and pg.locator('.td-narrow [data-go="review"]').count()==1, '1024px 홈: 미리보기 대신 「오늘 할 일」이 가운데 열 아래에 보임'); pg.set_viewport_size({'width':1280,'height':900}); pg.wait_for_timeout(150); check(pg.locator('.td-narrow').evaluate('e=>getComputedStyle(e).display')=='none', '1280px 홈: 좁은 화면용 「오늘 할 일」은 숨김')
    go=pg.evaluate("(()=>{ const g0=!!Store.data.settings.game; Store.data.settings.game=false; const p0=Confetti.parts.length; Confetti.rain(10); Confetti.burst(10); UI.badgeFly({id:'first_clear',name:'첫 클리어',icon:'🏅'}); const r={parts:Confetti.parts.length-p0, fly:document.querySelectorAll('.badge-fly').length, toast:!!document.querySelector('.toast')}; Store.data.settings.game=g0; return r; })()"); check(go['parts']==0 and go['fly']==0, '게임 요소 끔: 직접 부른 콘페티·뱃지 팝업도 안 뜸 (%s)' % go)
    pg.evaluate("UI.go('home')"); pg.wait_for_timeout(200)
    # 퀴즈 채점
    pg.evaluate("UI.go('problem',{pid:'L0P2',lessonId:'L0'})"); pg.wait_for_timeout(300); ans=pg.evaluate("Content.problem('L0P2').quiz.ans"); pg.click(f'.qopt[data-i="{ans}"]'); pg.wait_for_timeout(1500)
    for _ in range(3):
        if pg.locator('#luOk').count(): pg.click('#luOk'); pg.wait_for_timeout(200)
    check(pg.locator('.result.ok').count()==1, '퀴즈 채점 클리어')
    pg.evaluate("UI.go('problem',{pid:'L6P3',lessonId:'L6'})"); pg.wait_for_timeout(300); check(pg.locator('.qopt pre.qcode').count()==4, '퀴즈 여러 줄 코드 보기 → 블록(네모칸 수정)')
    x0=pg.evaluate("Store.data.xp"); d0=pg.evaluate("Store.data.days[todayKey()]||0"); ev=pg.evaluate("Game.clearProblem(Content.problem('L0P2'),{mode:'quiz',hints:0,firstTry:false})"); x1=pg.evaluate("Store.data.xp"); d1=pg.evaluate("Store.data.days[todayKey()]||0")
    check(x1==x0 and d1==d0 and any(e.get('rerun') for e in ev if e['type']=='xp'), '이미 클리어한 문제 재제출 → XP·일일 횟수 없음 (%d→%d)'%(x0,x1))
    d=pg.evaluate("Grader.explainDiff({expected:'1\\n2\\n3', actual:'1\\n2'})"); check(len(d['tips'])>=1 and '적어요' in d['tips'][0] and len(d['rows'])==3, '출력 차이 설명(explainDiff): '+d['tips'][0][:30])
    pg.evaluate("UI.go('lesson',{lessonId:'L2',page:0})"); pg.wait_for_timeout(300); pg.click('#lpLost'); pg.wait_for_timeout(200); check(pg.locator('.lp-helpbox').count()==1 and pg.evaluate("Store.data.stats.confused||0")>=1, '레슨 「모르겠어요」 도움 상자')
    pg.evaluate("UI.go('stats')"); pg.wait_for_timeout(300); check(pg.locator('.st-day').count()==14 and '클리어' in pg.locator('#view').inner_text() and '모르겠어요가 많았던' in pg.locator('#view').inner_text(), '학습 통계 화면(F3) + 모르겠어요 레슨')
    pg.evaluate("UI.go('weakness')"); pg.wait_for_timeout(300); check(pg.locator('[data-cl-lesson]').count()>=1, '약점 화면: 모르겠어요 레슨 연결')
    pg.evaluate("UI.go('home')"); pg.wait_for_timeout(300); check(pg.locator('#homeConf').count()==1, '홈: 모르겠어요 레슨 다시 보기 추천')
    pg.fill('#homeQ', '반복'); pg.wait_for_timeout(200); check(pg.locator('#homeResults .pitem').count()>=3 and pg.locator('#homeMap.hide').count()==1, '홈 검색(F4): 반복 → 결과 %d개'%pg.locator('#homeResults .pitem').count())
    pg.fill('#homeQ', ''); pg.click('[data-hf="todo"]'); pg.wait_for_timeout(200); n1=pg.locator('#homeResults .pitem').count(); pg.click('[data-hf="all"]'); pg.wait_for_timeout(200); check(n1>=1 and pg.locator('#homeMap.hide').count()==0, '홈 필터 칩: 안 푼 것 %d개 → 전체는 지도'%n1)
    pg.keyboard.press('?'); pg.wait_for_timeout(200); check(pg.locator('.kb').count()==1, '단축키 안내(F6): ? 키'); pg.keyboard.press('Escape'); pg.wait_for_timeout(200); check(pg.locator('.modal-ov').count()==0, 'Esc로 닫기')
    pg.evaluate("Store.data.settings.contrast=true; Store.data.settings.font=3; UI.applyTheme()"); check(pg.evaluate("document.documentElement.dataset.contrast")=='1' and pg.evaluate("getComputedStyle(document.documentElement).getPropertyValue('--fs').trim()")=='20px', '접근성(F9): 고대비·아주 크게'); pg.evaluate("Store.data.settings.contrast=false; Store.data.settings.font=1; UI.applyTheme()")
    pg.evaluate("UI.go('settings')"); pg.wait_for_timeout(300); check(pg.locator('#sOffline').count()==1 and '완전 무료' in pg.locator('#view').inner_text(), '설정: 오프라인 캐시 줄 + 무료 안내')
    # 빈칸
    pg.evaluate("UI.go('problem',{pid:'L1P4',lessonId:'L1'})"); pg.wait_for_timeout(300)
    blanks=pg.evaluate("Content.problem('L1P4').fill.blanks.map(b=>b.ans||b.answer||b.a)")
    print('    blanks', blanks)
    check(pg.locator('.blank').count()>=1, '빈칸 문제 렌더')
    # 버그·Parsons·텍스트 렌더
    pg.evaluate("UI.go('problem',{pid:'L2P4',lessonId:'L2'})"); pg.wait_for_timeout(300); check(pg.locator('.bugline').count()>0, '버그 문제 렌더')
    pg.evaluate("UI.go('problem',{pid:'L6P2',lessonId:'L6'})"); pg.wait_for_timeout(300); check(pg.locator('.pz-tile.pz-ans').count()==1 and pg.locator('.pz-bank .pz-tile').count()>0, 'Parsons 렌더 + 저장된 배치 복원')
    # v2.4.0 블록·Parsons→타자 전환: 옛 저장(mode parsons/block)이 남아 있어도 code 문제는 starter 로 열린다
    pg.evaluate("UI.go('problem',{pid:'L5P2',lessonId:'L5'})"); pg.wait_for_timeout(600); check(pg.locator('.ted').count()==1 and pg.locator('.pz-tile').count()==0 and 'total = 0' in pg.evaluate("(document.querySelector('.ted textarea')||{}).value || ''"), '옛 Parsons 기록이 있는 문제 → 타자 편집기(starter)로')
    pg.evaluate("UI.go('problem',{pid:'L1P2',lessonId:'L1'})"); pg.wait_for_timeout(600); check(pg.locator('.ted').count()==1 and pg.locator('.bed').count()==0 and pg.evaluate("(document.querySelector('.ted textarea')||{}).value || ''").startswith('print("나는")'), '옛 블록 기록이 있는 문제 → 타자 편집기(starter)로')
    # v2.5.0 레슨 나누기: 옛 기록(L11P1 clear → 지금은 L11C 소속)만 있어도 L11C·그 다음 레슨이 열리고, 「현재 레슨」이 앞(L3)으로 되돌아가지 않는다 (QA 11/5)
    r=pg.evaluate("""()=>{ const bak=JSON.stringify(Store.data.problems); Store.data.problems['L11P1']={status:'clear',stars:3,hints:0,attempts:1,fails:0}; Store.data.settings.unlockAll=false; const out={far:LESSONS[Game.furthestIdx()].id, openC:Game.lessonOpen(Content.lesson('L11C')), open12:Game.lessonOpen(Content.lesson('L12')), open3B:Game.lessonOpen(Content.lesson('L3B')), cur:Game.currentLesson().id}; Store.data.problems=JSON.parse(bak); return out; }""")
    check(r['far']=='L11C' and r['openC'] and r['open12'] and r['open3B'] and r['cur']=='L11C', '나눈 레슨: 옛 클리어 기록으로 멀리 간 레슨까지 열림 + 현재 레슨 유지: '+str(r))
    pg.evaluate("UI.go('problem',{pid:'L13P1',lessonId:'L13'})"); pg.wait_for_timeout(600); check(pg.locator('.ted').count()==1 and pg.locator('#pvIn').count()==1, '텍스트 문제 에디터(폴백)+입력칸')
    pg.evaluate("UI.go('problem',{pid:'L1P1',lessonId:'L1'})"); pg.wait_for_timeout(600); check(pg.locator('.ted').count()==1 and pg.locator('.bed').count()==0 and pg.locator('#btnToText').count()==0, 'L1 첫 문제도 타자 편집기 (블록 화면 없음)')
    # QA #155: 레슨 창이 열린 동안 뒤 문제 화면 단축키(Ctrl+/ 힌트·Ctrl+Shift+Enter 채점) 무시 · QA #159: Esc 로 닫히고 편집기로 포커스 복원
    pg.evaluate("UI.go('problem',{pid:'L13P1',lessonId:'L13'})"); pg.wait_for_timeout(500); pg.focus('#pvEd textarea'); pg.evaluate("UI.lessonPeek('L13')"); pg.wait_for_timeout(200)
    h0=pg.evaluate("Store.prob('L13P1').hints"); pg.keyboard.press('Control+/'); pg.keyboard.press('Control+Shift+Enter'); pg.wait_for_timeout(200)
    k1={'hints':pg.evaluate("Store.prob('L13P1').hints")-h0, 'grading':pg.locator('#pvResult').inner_text().strip(), 'modal':pg.locator('.modal-ov').count()}
    pg.focus('#lpkSel'); pg.keyboard.press('Escape'); pg.wait_for_timeout(150); k1['closed']=pg.locator('.modal-ov').count()==0; k1['focus']=pg.evaluate("document.activeElement && document.activeElement.matches('#pvEd textarea')")
    pg.keyboard.press('Control+/'); pg.wait_for_timeout(150); k1['after']=pg.evaluate("Store.prob('L13P1').hints")-h0; pg.evaluate("Store.prob('L13P1').hints=%d" % h0)
    check(k1['hints']==0 and k1['grading']=='' and k1['modal']==1 and k1['closed'] and k1['focus'] and k1['after']==1, '레슨 창 열린 동안 Ctrl+/ · Ctrl+Shift+Enter 무시, 쪽 목록에서 Esc 닫기 → 편집기 포커스 복원 → 단축키 다시 동작 (QA #155·#159): %s' % k1)
    # QA #156: 기본 편집기 Enter·백스페이스 4칸이 실행 취소(Ctrl+Z) 기록에 남음 · QA #159: 칸 수 표시가 Tab·⇤·처음 코드로 뒤에도 갱신, 괄호 안·공백뿐인 줄은 경고 없음
    pg.click('#pvEd textarea'); pg.keyboard.press('Control+a'); pg.keyboard.type('if x:'); pg.keyboard.press('Enter'); v1=pg.evaluate("document.querySelector('#pvEd textarea').value"); pg.keyboard.press('Backspace'); v2=pg.evaluate("document.querySelector('#pvEd textarea').value"); pg.keyboard.press('Control+z'); pg.wait_for_timeout(100); v3=pg.evaluate("document.querySelector('#pvEd textarea').value"); i3=pg.locator('#pvEd .ted-ind').inner_text()
    check(v1=='if x:\n    ' and v2=='if x:\n' and v3=='if x:\n    ' and '4칸' in i3, '기본 편집기: Enter 자동 들여쓰기 → ⌫ 4칸 → Ctrl+Z 로 되돌아옴 + 칸 수 표시 (QA #156): %r %r %r %r' % (v1, v2, v3, i3))
    ind=lambda: pg.locator('#pvEd .ted-ind').inner_text()
    pg.evaluate("(()=>{ const ta=document.querySelector('#pvEd textarea'); ta.value='if x:\\n'; ta.focus(); ta.setSelectionRange(ta.value.length, ta.value.length); })()"); pg.keyboard.press('Tab'); t1=ind()
    pg.evaluate("(()=>{ const ta=document.querySelector('#pvEd textarea'); ta.focus(); ta.setSelectionRange(ta.value.length, ta.value.length); QuickKeys.press('⇤'); })()"); t2=ind()
    pg.evaluate("(()=>{ const ta=document.querySelector('#pvEd textarea'); ta.value='x = [\\n   1,\\n   2]\\n   \\n  y'; ta.setSelectionRange(10, 10); ta.dispatchEvent(new Event('click')); })()"); t3=ind()
    pg.evaluate("(()=>{ const ta=document.querySelector('#pvEd textarea'); ta.setSelectionRange(ta.value.indexOf('\\n   \\n')+2, ta.value.indexOf('\\n   \\n')+2); ta.dispatchEvent(new Event('click')); })()"); t4=ind()
    pg.evaluate("(()=>{ const ta=document.querySelector('#pvEd textarea'); ta.setSelectionRange(ta.value.length, ta.value.length); ta.dispatchEvent(new Event('click')); })()"); t5=ind()
    check('4칸' in t1 and '⚠' not in t1 and t2=='' and '괄호 안' in t3 and '⚠' not in t3 and '⚠' not in t4 and '⚠' in t5, '칸 수 표시: Tab 뒤 4칸 · ⇤ 뒤 사라짐 · 괄호 안 줄 「(괄호 안)」 · 공백뿐인 줄 경고 없음 · 2칸 줄은 ⚠ (QA #159): %r %r %r %r %r' % (t1, t2, t3, t4, t5))
    # QA #158: 「들여쓰기 n칸」 표시가 마지막 줄을 가리지 않게 — textarea·줄 번호 칸 아래 여백이 표시 높이 이상
    pd=pg.evaluate("(()=>{ const ta=document.querySelector('#pvEd textarea'); const g=document.querySelector('#pvEd .ted-gutter'); const ind=document.querySelector('#pvEd .ted-ind'); return {ta:parseFloat(getComputedStyle(ta).paddingBottom), g:parseFloat(getComputedStyle(g).paddingBottom), ind:ind.offsetHeight+4}; })()")
    check(pd['ta']>=pd['ind'] and pd['g']==pd['ta'], '기본 편집기 아래 여백 ≥ 칸 수 표시 높이, 줄 번호 칸도 같이 (QA #158): %s' % pd)
    # QA #154: 메인 스레드 실행기 출력 상한을 바이트가 아니라 글자 수로 (한글 상한 1/3 이던 것) + 상한 에러에 code 'EIO'
    ml=pg.evaluate("""async ()=>{ const f0=window.fetch, l0=window.loadScript, p0=window.loadPyodide; let w=null; window.fetch=async()=>({ok:true}); window.loadScript=async()=>{}; window.loadPyodide=async()=>({ setStdout:(o)=>{ w=o.write; }, setStderr(){}, setStdin(){}, runPython(){}, globals:{get:()=>null}, FS:{} });
      const bak={main:Py.main, ready:Py.ready, py:Py.py, phase:Py.phase, progress:Py.progress, failed:Py.failed, sandboxed:Py.sandboxed}; try { await Py.startMain(); let got=''; Py.cur={maxOut:10, onOut:(t)=>{ got+=t; }}; const enc=new TextEncoder(); let err=null, n=0; try { for(let i=0;i<5;i++){ w(enc.encode('가나다')); n++; } } catch(e){ err=e; } const cut=!!Py.cur._cut; Py.cur=null; return {got, n, code:err&&err.code, cut}; } finally { window.fetch=f0; window.loadScript=l0; window.loadPyodide=p0; Object.assign(Py, bak); Py._emit(); } }""")
    check(ml['got']=='가나다가나다가나다' and ml['n']==3 and ml['code']=='EIO' and ml['cut'], '메인 실행기 출력 상한 10글자: 한글 3글자×3 까지 받고 4번째에 EIO 로 끊김 (QA #154): %s' % ml)
    pg.evaluate("Store.data.settings.focus=false; Store.save({silent:true}); UI.go('problem',{pid:'L4P1',lessonId:'L4'})"); pg.wait_for_timeout(600); pg.evaluate("(document.querySelector('#coachOpen')||{click(){}}).click()"); pg.wait_for_timeout(200); check(pg.evaluate("(()=>{const e=document.querySelector('.coach-code'); return e? getComputedStyle(e).display : 'none'})()")=='flex', '따라하기 코치 코드 줄 flex 배치 (v2.4.0 CSS 잘림 회귀 방지)')
    # 실전 챕터 6 (v2.2.0): 프로젝트 체크리스트·단계 칩·파일 업로드 UI·마스터 뱃지
    pg.evaluate("Store.data.settings.unlockAll=true; UI.go('problem',{pid:'X1P1',lessonId:'X1'})"); pg.wait_for_timeout(600)
    check(pg.locator('#btnUpload').count()==1 and pg.locator('#pvFile').count()==1, '실전: 📎 CSV 업로드 버튼')
    check(pg.locator('.pv-tests .chip').count()>=4 or '단계' in pg.locator('#view').inner_text(), '실전: 테스트에 단계 칩')
    check(pg.evaluate("CHAPTERS.some(c=>c.ch===6&&c.name==='실전') && LESSONS.filter(l=>l.practical).length===6 && CHAPTERS.some(c=>c.ch===7)"), '실전 챕터 6 · practical 레슨 6개 · 챕터 7')
    check(pg.evaluate("() => { Store.data.settings.unlockAll=false; const s=Store.data.stats; const was=s.boss_B5; delete s.boss_B5; const a=Game.chapterOpen(7); s.boss_B5=1; const b=Game.chapterOpen(7); if(was) s.boss_B5=was; else delete s.boss_B5; return !a && b; }"), '챕터 7은 B5 클리어로 열림(실전 챕터 건너뛰어 보스 찾기)')
    pg.evaluate("Store.data.settings.unlockAll=true; UI.go('problem',{pid:'X3P1',lessonId:'X3'})"); pg.wait_for_timeout(500)
    check(pg.locator('#pvExtra').count()==1 and pg.locator('#pvExtra.hide').count()==1, '실전: 더 만들어 보기 카드(클리어 전 숨김)')
    pg.evaluate("Store.data.works.push({id:'w_t', name:'테스트 작품', code:'print(1)\\nprint(2)', src:'X1P1', course:'python', date:Date.now(), mode:'text', steps:4, total:4}); Store.save(); UI.go('works')"); pg.wait_for_timeout(300)
    check(pg.locator('.work-card').count()>=1 and pg.locator('[data-review]').count()==0 and '단계 4/4' in pg.locator('#view').inner_text(), '내 작품 갤러리: 프로젝트 카드 (리뷰 버튼은 선생님 꺼짐으로 없음)')
    pg.evaluate("Store.data.settings.unlockAll=false")
    for v in ['badges','profile','inventory','settings','glossary','errors','weakness','review','timeattack','playground','works']:
        pg.evaluate(f"UI.go('{v}')"); pg.wait_for_timeout(300); check(len(pg.locator('#view').inner_text())>10, f'화면 {v}')
    pg.evaluate("Store.data.stats.badgesSeenAt=0; Store.data.badgeDates.first_clear=Date.now(); Store.data.stats.runs=12; Store.data.badges=Store.data.badges.filter(b=>b!=='secret_night'); /* 밤(0~5시)에 돌리면 시각 뱃지가 붙어 개수가 달라져요 */ UI.go('badges')"); pg.wait_for_timeout(300)
    check(pg.locator('.badge.got').count()==2 and pg.locator('.badge.new').count()>=1 and pg.locator('.b-prog').count()>=20 and pg.locator('.badge.secret .b-q').count()>=4 and pg.locator('[data-bf]').count()==4, '뱃지 화면: 획득 2·NEW·미획득 진행 막대·비밀 ❔·필터')
    pg.click('[data-bf="got"]'); pg.wait_for_timeout(100); check(pg.locator('.badge:not(.hide)').count()==2, '뱃지 필터: 획득만')
    pg.evaluate("UI.go('badges')"); pg.wait_for_timeout(300); check(pg.locator('.badge.new').count()==0, '뱃지 다시 열면 NEW 사라짐(badgesSeenAt)')
    pg.evaluate("Store.data.settings.game=true; UI.badgeFly(BADGES[6]); Store.data.settings.game=false"); pg.wait_for_timeout(100); check(pg.locator('.badge-fly .bf-icon').count()==1, '뱃지 획득 알림에 그림 자리 (게임 요소 켬)')
    pg.evaluate("UI.go('settings')"); pg.wait_for_timeout(300)
    check(pg.evaluate("getComputedStyle(document.querySelector('#sReset')).color")=='rgb(255, 255, 255)', '설정: 전체 초기화 버튼 글자 흰색(빨강 바탕에 빨강 글자 버그)')
    check(pg.locator('.card.sync').count()==1 and pg.locator('#syncOff').count()==1, '설정: 기기 연동 카드(연동 상태)'); check(pg.locator('#sRestoreV1').count()==1, '설정: v1 데이터 다시 가져오기 버튼'); check(('v'+pg.evaluate('CONFIG.APP_VERSION')) in pg.locator('#view').inner_text(), '설정 하단 버전 표시')
    ex=pg.evaluate("JSON.parse(Store.exportJSON())"); check(ex['xp']>=385 and 'problems' in ex and 'works' in ex and 'tutorChats' in ex, '내보내기 JSON은 v1과 같은 모양')
    pg.evaluate("UI.go('checkup',{n:1})"); pg.wait_for_timeout(300); check(pg.locator('.qopt,.blank').count()>0, '종합 점검')
    # ---- 2b. 알고리즘 코스 페이지
    print('[알고리즘 코스]'); ALGO='file://'+os.path.join(ROOT,'courses/algo/index.html')
    pg.goto(ALGO+'#lesson/A2'); pg.wait_for_timeout(1500); pg.evaluate("Loader.minimized=true;Loader.render()")
    check(pg.evaluate("Store.course")=='algo' and pg.evaluate("UI.view")=='lesson', '코스 id=algo, 레슨 딥링크')
    check(pg.locator('#exViz').count()==1, '레슨 예제에 👀 시각화 재생 버튼')
    check(pg.evaluate("localStorage.getItem('academy.course.algo')") is not None, 'algo 진행 조각 저장')
    check(pg.evaluate("Store.data.xp")>=385, 'XP(프로필) 공유')
    pg.evaluate("UI.go('home')"); pg.wait_for_timeout(300); check(pg.locator('.tr-ch').count()>=5 and pg.locator('.lc').count()>=3 and pg.evaluate("LESSONS.filter(l=>l.boss).length")==5, "알고리즘 탐색기: 챕터 %d · 카드 %d" % (pg.locator('.tr-ch').count(), pg.locator('.lc').count()))
    pg.evaluate("UI.go('problem',{pid:'A1P1',lessonId:'A1'})"); pg.wait_for_timeout(300); check(pg.locator('.quiz-code').count()==1 and '복잡도' in pg.locator('.pv-head').inner_text(), '복잡도 퀴즈: 코드 블록 + 유형명')
    pg.evaluate("UI.go('problem',{pid:'A2P1',lessonId:'A2'})"); pg.wait_for_timeout(300); check(pg.locator('#btnQuizViz').count()==1, '추적 퀴즈: 시각화 버튼')
    pg.evaluate("UI.go('problem',{pid:'A3P5',lessonId:'A3'})"); pg.wait_for_timeout(300); pg.click('.qopt[data-i="1"]'); pg.wait_for_timeout(400); check(pg.locator('.qopt[data-k]').count()==4, '자료구조 고르기: 2단계(이유) 표시')
    pg.click('.qopt[data-k="1"]'); pg.wait_for_timeout(1500)
    for _ in range(3):
        if pg.locator('#luOk').count(): pg.click('#luOk'); pg.wait_for_timeout(200)
    check(pg.locator('.result.ok').count()==1, '2단계 정답 → 클리어')
    pg.evaluate("UI.go('lesson',{lessonId:'A0',page:0})"); pg.wait_for_timeout(500); check(pg.locator('#exSl').count()==1 and pg.evaluate("$('#exSl').value")=='1000000', '레슨 예제 n 슬라이더(F2, 코드 값으로 초기화)')
    pg.evaluate("UI.go('problem',{pid:'A5P2',lessonId:'A5'})"); pg.wait_for_timeout(500); check(pg.locator('#btnViz').count()==1, '코드 문제: 👀 시각화 버튼')
    pg.evaluate("Store.data.settings.unlockAll=true; UI.go('problem',{pid:'E1P1',lessonId:'E1'})"); pg.wait_for_timeout(600); check(pg.locator('#btnViz').count()==1 and pg.evaluate("CHAPTERS.some(c=>c.ch===5&&c.name==='실전')"), '알고 실전 E1P1: 격자 시각화 버튼 + 챕터 E'); pg.evaluate("Store.data.settings.unlockAll=false")
    check(pg.evaluate("CHAPTERS.some(c=>c.ch===6&&c.name==='한 걸음 더') && LESSONS.filter(l=>l.ch===6).length===6 && PROBLEMS.filter(p=>p.lesson==='AB5').length===2"), '알고 챕터 6 한 걸음 더: 레슨 5 + 보스 AB5')
    check(pg.evaluate("() => { Store.data.settings.unlockAll=false; const s=Store.data.stats; const was=s.boss_AB4; delete s.boss_AB4; const a=Game.chapterOpen(6); s.boss_AB4=1; const b=Game.chapterOpen(6); if(was) s.boss_AB4=was; else delete s.boss_AB4; return !a && b; }"), '알고 챕터 6은 AB4 클리어로 열림')
    pg.evaluate("Store.data.settings.unlockAll=true; UI.go('problem',{pid:'A18P2',lessonId:'A18'})"); pg.wait_for_timeout(500); check(pg.locator('#btnViz').count()==1, 'A18P2 로봇 시뮬레이션: 격자 시각화 버튼'); pg.evaluate("Store.data.settings.unlockAll=false")
    pg.evaluate("Store.data.settings.unlockAll=true; UI.go('problem',{pid:'E6P1',lessonId:'E6'})"); pg.wait_for_timeout(500); check(pg.locator('#btnViz').count()==1 and pg.evaluate("LESSONS.filter(l=>l.practical).length===6") and pg.evaluate("PROBLEMS.filter(p=>p.project).length===6"), '알고 실전 5·6(E5 검색 엔진·E6 로봇 청소기): practical 레슨 6 · 프로젝트 6'); pg.evaluate("Store.data.settings.unlockAll=false")
    check(pg.evaluate("() => { const c=document.createElement('canvas'); c.style.width='300px'; c.style.height='200px'; document.body.appendChild(c); try { Viz.frame(c, {kind:'grid', var:'grid', visited:'visited', pos:'pos'}, {vis:{grid:[['.','*','#'],['.','.','.']], visited:{__set:[[0,0],[1,0]]}, pos:[1,1]}, stack:[], vars:{}}, null, 1); return true; } catch (e) { return 'ERR ' + e.message; } }")==True, '격자 시각화: pos 튜플 변수 + 글자 칸(*)')
    pg.evaluate("UI.go('lesson',{lessonId:'AB4'})"); pg.wait_for_timeout(300); check(pg.evaluate("UI.view")=='mock' and pg.locator('#mockStart').count()==1, '보스 AB4 → 모의고사 화면')
    r72=pg.evaluate("(()=>{ const bak=JSON.stringify(Store.data.problems||{}); const E=Content.lesson('E1'); Content.problemsOf('E1').forEach(q=>{ Store.prob(q.id).status = q.project ? 'clear' : 'try'; }); const done=Game.lessonDone(E); Store.data.problems=JSON.parse(bak); return done && Content.problemsOf('E1').some(q=>!q.project); })()"); check(r72, '실전 레슨은 프로젝트만 끝내도 완료 — 연습 문제는 선택 (QA #72)')
    pg.evaluate("UI.go('problem',{pid:'AB4P1',lessonId:'AB4'})"); pg.wait_for_timeout(400); check('입력 형식' in pg.locator('.pv-prompt').inner_text() and '코딩테스트' in pg.locator('.pv-head').inner_text(), '코딩테스트 형식 문제')
    cm=pg.locator('#pvCoach').inner_html(); pg.evaluate("UI.go('problem',{pid:'AB4P1',lessonId:'AB4',session:{mock:true,pids:['AB4P1'],goto(){},startAt:Date.now()}})"); pg.wait_for_timeout(400)
    check(len(cm)>0 and pg.locator('#pvCoach').inner_html()=='' and pg.locator('#btnAnswer').count()==0 and pg.locator('#btnHint').count()==1, '모의고사 중에는 따라하기·정답 보기 없음, 힌트는 있음 (QA #3)')
    pg.evaluate("UI.go('playground')"); pg.wait_for_timeout(300); check(pg.locator('[data-m="block"]').count()==0, '놀이터에 블록 탭 없음')
    pg.evaluate("UI.go('settings')"); pg.wait_for_timeout(300); check(pg.locator('#sUnlock').count()==1, '설정: 전제 무시 스위치')
    vz = pg.evaluate(VIZ_JS)
    check(vz['ok1'] and vz['frames']==3 and vz['errs']==0, "시각화 플레이어·8종 그리기 (frames=%s, errs=%s)" % (vz['frames'], vz['errs']))
    vzerr = pg.evaluate("""()=>new Promise(res=>{ let n=0; const h=()=>{n++}; window.addEventListener('error',h); const host=document.createElement('div'); host.style.width='500px'; document.body.appendChild(host); const pl=Viz.player(host,{steps:[{line:1,vis:{a:[1,2]},stack:[]},{line:2,vis:{a:[2,1]},stack:[]},{line:3,vis:{a:[3,1]},stack:[]}],spec:{kind:'bars',var:'a'},title:'t'}); pl.play(); setTimeout(()=>{ host.innerHTML='<div>다시 기록 중</div>'; setTimeout(()=>{ host.remove(); setTimeout(()=>{ window.removeEventListener('error',h); res(n); },1600); },200); },200); })""")
    check(vzerr==0, '시각화 플레이어를 재생 중에 지우거나 다시 그려도 콘솔 에러 없음 (QA #6·#61, errs=%s)' % vzerr)
    pg.goto(HUB); pg.wait_for_timeout(600); hc = pg.evaluate("()=>[...document.querySelectorAll('.hc')].map(e=>e.className+'|'+e.innerText.replace(/\\n/g,' ').slice(0,60))")
    check('완전 무료' in pg.locator('.hub-foot').inner_text(), '허브 푸터: 완전 무료·계정 없음·오프라인')
    check(any('알고리즘' in x and ('ready' in x or 'locked' in x) for x in hc), '허브에 알고리즘 코스 카드: '+([x for x in hc if '알고리즘' in x]+['?'])[0][:70])
    pg.evaluate("(()=>{const k='academy.course.algo'; const c=JSON.parse(localStorage.getItem(k)||'{}'); c.problems=c.problems||{}; c.problems['A0P3']={status:'clear',stars:3,hints:0,attempts:1,review:{stage:0,due:'2000-01-01'}}; localStorage.setItem(k,JSON.stringify(c)); Hub.render();})()"); pg.wait_for_timeout(200)
    check('알고리즘·자료구조 1' in pg.locator('.hub-stats').inner_text(), '허브 복습 큐 코스 공통(F1): '+pg.locator('.hub-stats').inner_text().replace('\n',' ')[:80])
    # ---- 3. 모바일
    print('[수학 공간]'); MATH='file://'+os.path.join(ROOT,'courses/math/index.html'); pg.set_viewport_size({'width':1100,'height':800})
    pg.goto(MATH); pg.wait_for_timeout(1500); pg.evaluate("Loader.minimized=true;Loader.render(); document.querySelectorAll('.modal-ov').forEach(e=>e.remove()); Store.data.onboarded=true; UI.go('home',{},false)"); pg.wait_for_timeout(500)
    check(pg.evaluate("Store.course")=='math' and pg.evaluate("Game.isGraph()") and pg.locator('.mnode').count()==pg.evaluate("LESSONS.length") and pg.locator('.mnode.locked').count()==pg.evaluate("LESSONS.filter(l=>(l.prereq||[]).length).length") and pg.evaluate("document.querySelectorAll('#mathLinks path').length")>=20, '지식 지도: 노드 %d · 잠김 = prereq 있는 노드 수 · 선수 관계 선' % pg.evaluate("LESSONS.length"))
    pg.evaluate("UI.go('lesson',{lessonId:'M1_mod',page:0})"); pg.wait_for_timeout(500); check(pg.locator('#lpFig canvas').count()==1 and pg.locator('#lpFig input[type=range]').count()==2 and pg.locator('.fig-observe li').count()==3, '노드 첫 페이지: 만지는 그림 + 슬라이더 2 + 관찰 질문 3')
    pg.evaluate("UI.go('lesson',{lessonId:'M1_mod',page:1})"); pg.wait_for_timeout(500); pg.evaluate("const s=document.querySelector('#lpFig input[data-p=n]'); s.value=40; s.dispatchEvent(new Event('input'))"); pg.wait_for_timeout(400)
    check(pg.locator('#lpFormula .mf').count()==2 and ('n = 40' in pg.evaluate("document.querySelector('#exEd textarea')?.value || ''")), '식과 코드 페이지: 수식 2 + 슬라이더 → 코드 n = 40 동기화')
    pg.evaluate("UI.go('problem',{pid:'M1_mod_q1',lessonId:'M1_mod'})"); pg.wait_for_timeout(500); gate=pg.evaluate("[...document.querySelectorAll('.qopt')].every(b=>b.disabled)"); pg.evaluate("const s=document.querySelector('#pvFig input[data-p=n]'); s.value=30; s.dispatchEvent(new Event('input'))"); pg.wait_for_timeout(200)
    check(gate and pg.evaluate("[...document.querySelectorAll('.qopt')].every(b=>!b.disabled)"), '탐구 퀴즈: 그림을 움직여야 보기가 열림')
    # QA #157: 수학 레슨을 창(lessonPeek)으로 열면 상황 글·그림(정지, 슬라이더 없음)·식이 나옴
    pg.evaluate("UI.lessonPeek('M1_mod')"); pg.wait_for_timeout(300); m1={'scene':pg.locator('.modal-ov .lp-scene').count(), 'fig':pg.locator('.modal-ov #lpkFig canvas').count(), 'sliders':pg.locator('.modal-ov #lpkFig input[type=range]').count(), 'note':pg.locator('.modal-ov .lpk-fignote').count()}
    pg.select_option('#lpkSel','1'); pg.wait_for_timeout(300); m1['formula']=pg.locator('.modal-ov #lpkFormula .mf').count(); m1['fig2']=pg.locator('.modal-ov #lpkFig canvas').count(); m1['code']=pg.locator('.modal-ov .lpk-page pre.code').count(); pg.keyboard.press('Escape'); pg.wait_for_timeout(150); m1['closed']=pg.locator('.modal-ov').count()==0
    check(m1['scene']==1 and m1['fig']==1 and m1['sliders']==0 and m1['note']==1 and m1['formula']==2 and m1['fig2']==1 and m1['code']==1 and m1['closed'], '수학 레슨 창: 1쪽 scene+정지 그림, 2쪽 식 2개+작은 그림+코드, Esc 닫기 (QA #157): %s' % m1)
    pg.evaluate("UI.go('problem',{pid:'M1_mod_q2',lessonId:'M1_mod'})"); pg.wait_for_timeout(400); sl="const s=document.querySelector('#pvFig input[data-p=n]'); s.value=%d; s.dispatchEvent(new Event('input'))"; lk="[...document.querySelectorAll('.qopt')].every(b=>b.disabled)"
    pg.evaluate(sl % 25); pg.wait_for_timeout(150); l1=pg.evaluate(lk); pg.evaluate(sl % 24); pg.wait_for_timeout(150); l2=pg.evaluate(lk)
    check(l1 and not l2 and '배수' in pg.locator('#exGate').inner_text() + (pg.evaluate("Content.problemMap.M1_mod_q2.unlockText") or ''), '탐구 퀴즈 unlockWhen: n=25 잠김 → n=24(배수) 열림 (QA #62)')
    pg.evaluate("UI.go('problem',{pid:'M1_mod_q3',lessonId:'M1_mod'})"); pg.wait_for_timeout(500); pg.fill('#numIn','-1'); pg.click('#btnGrade'); pg.wait_for_timeout(300); tip=pg.locator('.result.bad').inner_text(); pg.fill('#numIn','1'); pg.click('#btnGrade'); pg.wait_for_timeout(1200)
    for _ in range(3):
        if pg.locator('#luOk').count(): pg.click('#luOk'); pg.wait_for_timeout(200)
    check('부호' in tip and pg.locator('.result.ok').count()==1 and pg.locator('.num-calc').count()==1, '숫자 답: 부호 반대 규칙 설명 → 정답 클리어, 코드로 계산하기 칸')
    check(pg.evaluate("!Grader.checkNum({answer:{value:1}},2).tips[0].includes('2배') && !Grader.checkNum({answer:{value:2}},1).tips[0].includes('절반') && Grader.checkNum({answer:{value:10}},20).tips[0].includes('2배')"), '숫자 답: 작은 정수(|정답| ≤ 2)는 2배·절반 규칙 건너뜀 (QA #7)')
    pg.evaluate("Store.data.settings.unlockAll=true; UI.go('problem',{pid:'M5_scale_q4',lessonId:'M5_scale'})"); pg.wait_for_timeout(700); check(pg.locator('.pair-fig canvas').count()==4 and pg.locator('.pair-sel').count()==4, '짝짓기: 그림 4 + 선택 4')
    for i,v in enumerate([2,0,3,1]): pg.select_option(f'.pair-sel[data-i="{i}"]', str(v))
    pg.click('#btnGrade'); pg.wait_for_timeout(1200)
    for _ in range(3):
        if pg.locator('#luOk').count(): pg.click('#luOk'); pg.wait_for_timeout(200)
    check(pg.locator('.result.ok').count()==1, '짝짓기 정답 → 클리어'); pg.evaluate("Store.data.settings.unlockAll=false")
    figbad=[]
    for lid in pg.evaluate("LESSONS.map(l=>l.id)"):
        pg.evaluate(f"Store.data.settings.unlockAll=true; UI.go('lesson',{{lessonId:'{lid}',page:0}})"); pg.wait_for_timeout(200)
        n=pg.evaluate("(()=>{const c=document.querySelector('#lpFig canvas'); if(!c) return -1; const d=c.getContext('2d').getImageData(0,0,c.width,c.height).data; let n=0; for(let i=0;i<d.length;i+=4*97){ if(d[i]!==d[i+1]||d[i+1]!==d[i+2]) n++; } return n;})()")
        if n<5 or '오류' in pg.evaluate("document.querySelector('[data-note]')?.textContent||''"): figbad.append(lid)
    check(not figbad, '노드 %d개 첫 그림 전부 그려짐 (%s)' % (pg.evaluate("LESSONS.length"), figbad or 'OK')); pg.evaluate("Store.data.settings.unlockAll=false")
    pg.evaluate("Store.data.settings.unlockAll=true; UI.go('lesson',{lessonId:'M1_prime',page:0})"); pg.wait_for_timeout(300); check('50까지 소수는 15개' in pg.inner_text('#lpFig'), '체 그림 안내: 50까지 소수 15개 (QA #1)'); pg.evaluate("Store.data.settings.unlockAll=false")
    badtex = pg.evaluate(r"""()=>{ const out=[]; for(const l of LESSONS) for(const q of (l.pages||[])) for(const f of (q.formula||[])) { const t=MathUI.plain(f.latex); if(/\\|[{}]|frac|quad|bmod|operatorname|left|right|text|binom/.test(t)) out.push(l.id+': '+t); } return out; }""")
    check(not badtex, '수식 글자 폴백에 LaTeX 찌꺼기 없음 (QA #2) %s' % (badtex[:3] or ''))
    pg.evaluate("UI.go('home')"); pg.wait_for_timeout(300); pg.set_viewport_size({'width':390,'height':800}); pg.evaluate("UI.go('home',{},false)"); pg.wait_for_timeout(400); check(pg.evaluate('document.documentElement.scrollWidth')<=390, '수학 공간 모바일 가로 스크롤 없음 (콤보 ×3 상단바 포함)')
    pg.evaluate("UI.go('lesson',{lessonId:'M5_dot',page:0})"); pg.wait_for_timeout(400); check(pg.evaluate('document.documentElement.scrollWidth')<=390 and 'NaN' not in pg.locator('#lpFig').inner_text(), '수학 레슨 모바일(벡터 그림, NaN 없음)')
    pg.goto(HUB); pg.wait_for_timeout(600); check(pg.locator('.hub-spaces .hc').count()==1 and '수학 공간' in pg.locator('.hub-spaces').inner_text(), '허브: 「공간」 구역에 수학 공간 카드')
    check('코스 순서와 무관' not in pg.locator('.hub-spaces .hc').inner_text(), '허브 수학 카드 문구 중복 없음 (QA #12)')
    print('[모바일 390px]'); pg.set_viewport_size({'width':390,'height':800})
    pg.goto(HUB); pg.wait_for_timeout(500); check(pg.evaluate('document.documentElement.scrollWidth')<=390, '허브 가로 스크롤 없음'); pg.screenshot(path=SHOT+'/hub_m.png', full_page=True)
    pg.goto(COURSE+'#problem/L13P1'); pg.wait_for_timeout(1200); pg.evaluate("Loader.minimized=true;Loader.render()"); pg.click('.pv-tabs button[data-t="work"]'); pg.wait_for_timeout(300)
    check(pg.evaluate('document.documentElement.scrollWidth')<=390, '코스 페이지 가로 스크롤 없음'); pg.screenshot(path=SHOT+'/course_m.png')
    # QA #159: 가로 폰(844×390) 「아주 크게」에서 레슨 창이 화면 안에 들어오고 제목이 안 잘림
    pg.set_viewport_size({'width':844,'height':390}); pg.evaluate("Store.data.settings.font=3; UI.applyTheme(); UI.lessonPeek('L13')"); pg.wait_for_timeout(300)
    mr=pg.evaluate("(()=>{ const m=document.querySelector('.modal-ov .modal'); const t=document.querySelector('.modal-ov .modal-title'); const b=document.querySelector('.modal-ov .modal-btns'); const r=m.getBoundingClientRect(), tr=t.getBoundingClientRect(), br=b.getBoundingClientRect(); return {top:Math.round(r.top), bottom:Math.round(r.bottom), ttop:Math.round(tr.top), btnBottom:Math.round(br.bottom), h:innerHeight}; })()")
    pg.keyboard.press('Escape'); pg.wait_for_timeout(100); pg.evaluate("Store.data.settings.font=1; UI.applyTheme()"); pg.set_viewport_size({'width':390,'height':800}); pg.wait_for_timeout(100)
    check(mr['top']>=0 and mr['bottom']<=mr['h'] and mr['ttop']>=0 and mr['btnBottom']<=mr['h'], '가로 폰 아주 크게: 레슨 창 제목·버튼이 화면 안 (QA #159): %s' % mr)
    pg.evaluate("UI.go('home')"); pg.wait_for_timeout(400); pg.click('.tr-ch[data-tch="1"]'); pg.wait_for_timeout(200); check(pg.locator('.lc.boss').count()==1 and pg.evaluate("document.querySelector('.lc.boss .lc-n').offsetWidth")>=48 and pg.evaluate('document.documentElement.scrollWidth')<=390 and pg.locator('.ex3-prev').evaluate('e=>getComputedStyle(e).display')=='none', '모바일 홈: 챕터 칩 + 레슨 카드, 보스 카드 그림 48px 이상, 미리보기 숨김, 가로 넘침 없음')
    pg.evaluate("Store.data.settings.theme='light'; UI.applyTheme()"); pg.wait_for_timeout(200); check(pg.evaluate("getComputedStyle(document.querySelector('.lc.boss')).backgroundColor")!='rgba(0, 0, 0, 0)', '라이트 테마 보스 카드 배경'); pg.evaluate("Store.data.settings.theme='dark'; UI.applyTheme()")
    pg.goto(ALGO+'#problem/A5P2'); pg.wait_for_timeout(1200); pg.evaluate("Loader.minimized=true;Loader.render()"); pg.click('.pv-tabs button[data-t="work"]'); pg.wait_for_timeout(300)
    check(pg.evaluate('document.documentElement.scrollWidth')<=390, '알고리즘 문제 화면 가로 스크롤 없음(390px)')
    pg.goto(ALGO+'#lesson/AB4'); pg.wait_for_timeout(800); pg.evaluate("Store.data.settings.unlockAll=true;UI.go('lesson',{lessonId:'AB4'})"); pg.wait_for_timeout(400); check(pg.locator('#mockStart').count()==1 and pg.evaluate('document.documentElement.scrollWidth')<=390, '모의고사 안내 화면 모바일')
    # QA #159 (PR 무관): terminal-git 코스는 Py 가 없어도 열림
    print('[terminal-git]'); n0=len(errors); pg.goto('file://'+os.path.join(ROOT,'courses/terminal-git/index.html')); pg.wait_for_timeout(800); tg=[e for e in errors[n0:] if 'Py' in e]
    check(not tg and pg.evaluate("UI.view")=='home', 'terminal-git 코스: Py is not defined 없이 홈 렌더 (%s)' % (tg or 'OK'))
    # ---- 4. 예전 주소
    pg.goto('file://'+os.path.join(ROOT,'python_academy.html')); pg.wait_for_timeout(800); check(pg.url.endswith('courses/python/index.html') or '/courses/python/' in pg.url, '예전 주소 → 코스 페이지 리다이렉트 ('+pg.url[-40:]+')')
    print('[기기 연동 코스 구분 (QA #67)]'); sx=b.new_context(); sx.route('https://api.github.com/**', lambda r: r.abort()); sp=sx.new_page(); sp.on('pageerror', lambda e: errors.append(str(e)[:500]))
    sp.goto('file://'+os.path.join(ROOT,'courses/math/index.html')); sp.wait_for_timeout(900)
    sr=sp.evaluate("""()=>{ Store.data.onboarded=true; const r0=Store.prob('M1_mod_q1'); r0.status='clear'; r0.stars=3; Store.save(); Sync.cfg={lastSyncAt:1}; Sync.apply({updatedAt:Date.now()+5000, xp:9, settings:{}, problems:{L0P1:{status:'clear',stars:3}, M1_mod_q2:{status:'clear',stars:2}}}); const g=c=>{ const m=JSON.parse(localStorage.getItem('academy.course.'+c)||'{}'); return Object.keys(m.problems||{}).filter(k=>m.problems[k].status==='clear').sort().join(','); }; const p=Sync.payload(); return {math:g('math'), py:g('python'), fmt:p.format, keys:Object.keys(p.courses).sort().join(',')}; }""")
    check(sr['math']=='M1_mod_q1,M1_mod_q2' and sr['py']=='L0P1' and sr['fmt']=='academy-sync-2' and 'math' in sr['keys'] and 'python' in sr['keys'], '옛 형식 payload 를 수학 화면에서 받아도 코스별로 나뉨 + 새 payload 는 코스 묶음 (%s)' % sr)
    sx.close()
    # ===== [코스 web] =====  (v2.7.0 뼈대: 허브 카드 → 코스 열기 → W0 예제 미리보기 → 러너 단위(가짜 API·체크 스크립트) → 문제 제출 정답/오답 → draft 「준비 중」 → 모바일. 메인 세션: 이 절은 python 코스 검사 뒤 아무 데나 둬도 됨(앞 절과 공유하는 것은 pg·b·check·errors·HUB·ROOT 뿐))
    print('[코스 web]'); pg.set_viewport_size({'width':1280,'height':900}); pg.goto(HUB); pg.wait_for_timeout(600)
    wc=pg.evaluate("(()=>{ const a=[...document.querySelectorAll('a.hc')].find(x=>(x.getAttribute('href')||'').includes('courses/web/')); return a ? {href:a.getAttribute('href'), cls:a.className, txt:a.innerText} : null; })()")
    check(bool(wc) and 'preview' in wc['cls'] and '미리보기' in wc['txt'], '허브: 웹 코스 카드가 「준비 중 · 미리보기 열림」으로 열림 (%s)' % (wc and wc['href']))
    WEB='file://'+os.path.join(ROOT,'courses/web/index.html'); n0=len(errors); pg.goto(WEB); pg.wait_for_timeout(900); pg.evaluate("Store.data.onboarded=true; Store.save(); document.querySelectorAll('.modal-ov').forEach(m=>m.remove())")
    check(pg.evaluate("UI.view")=='home' and not [e for e in errors[n0:] if 'Py' in e] and pg.evaluate("typeof Web==='object' && typeof UI.modes.web==='object' && typeof UI.examples.web==='object' && !!document.querySelector('link[href^=\"course.css\"]')"), '웹 코스: Py 없이 홈 렌더 + Web 러너·UI.modes.web·UI.examples.web 등록 + course.css')
    check(pg.locator('.lc.draft').count()>=6 and pg.evaluate("(()=>{ const b=document.querySelector('.lc.draft'); return !!b && b.disabled && b.innerText.includes('준비 중'); })()"), '홈: draft 레슨 카드 「준비 중」(disabled) %d개' % pg.locator('.lc.draft').count())
    pg.evaluate("UI.go('lesson',{lessonId:'W0',page:3})"); pg.wait_for_timeout(1000)
    check(pg.locator('#exPlugin .web-frame').count()==1 and pg.frame_locator('#exPlugin .web-frame').locator('h1').count()==1 and pg.locator('#exPlugin .web-tab').count()==2, 'W0 4쪽 예제: HTML·CSS 탭 + 미리보기 iframe(srcdoc) 안에 h1')
    pg.fill('#exPlugin .web-pane[data-pane=html] textarea', '<h2>바꿈</h2>'); pg.wait_for_timeout(900)
    check(pg.frame_locator('#exPlugin .web-frame').locator('h2').count()==1 and pg.frame_locator('#exPlugin .web-frame').locator('h1').count()==0, '예제 편집 → 0.5초 뒤 미리보기 자동 갱신')
    pg.click('#exPlugin .web-reset'); pg.wait_for_timeout(700); check(pg.frame_locator('#exPlugin .web-frame').locator('h1').count()==1, '예제 「원래대로」')
    wr=pg.evaluate("""async()=>{ const f=document.createElement('iframe'); document.body.appendChild(f); const cons=[], net=[]; await Web.render(f,{html:'<p id="t">0</p><button id="b">+</button><ul id="l"></ul>', css:'p{color:blue;margin-top:10px}', js:'alert("hi"); console.log("x",1); document.querySelector("#b").onclick=async()=>{ const r=await fetch("https://api.academy.local/menu"); const m=await r.json(); document.querySelector("#l").innerHTML=m.map(x=>"<li>"+x.name+"</li>").join(""); document.querySelector("#t").textContent=r.status; }; fetch("https://api.academy.local/todos",{method:"POST",headers:{"Content-Type":"application/json"},body:"{}"});'},{onConsole:m=>cons.push(m.level+":"+m.text), onFetch:r=>net.push(r.method+" "+r.status)},{api:{delay:120}}); await new Promise(r=>setTimeout(r,400)); const res=await Web.check(f,[{text:'a',sel:'p',css:{prop:'color',value:'blue'}},{text:'b',sel:'p',css:{prop:'margin-top',value:'11px'}},{text:'c',sel:'p',css:{prop:'color',value:'red'}},{text:'d',click:'#b',then:{sel:'#l li',count:5}},{text:'e',sel:'#t',equals:'200'},{text:'f',js:'innerWidth',viewport:390}]); f.remove(); return {cons, net, ok:res.map(r=>r.ok), vw:res[5].got}; }""")
    check(wr['cons']==['alert:hi','log:x 1'] and wr['net']==['POST 400','GET 200'] and wr['ok']==[True,True,False,True,True,True] and int(wr['vw'])<=390, '웹 러너: alert→출력창·console.log, 가짜 API(POST 400·GET 200), 체크(색 rgb 정규화·px ±2·클릭 뒤 fetch 끝까지 대기·viewport 390) %s' % wr)
    pg.evaluate("UI.go('problem',{pid:'W0P1',lessonId:'W0'})"); pg.wait_for_timeout(900); pg.click('#btnGrade'); pg.wait_for_timeout(1500)
    check(pg.locator('.result.bad').count()==1 and pg.locator('.web-chk li.bad').count()==2, 'W0P1 starter 그대로 제출 → 실패 + 체크리스트 ✗ 2개')
    pg.fill('.web-pane[data-pane=html] textarea','<h1>내 첫 페이지</h1>'); pg.wait_for_timeout(800); pg.click('#btnGrade'); pg.wait_for_timeout(1500)
    for _ in range(3):
        if pg.locator('#luOk').count(): pg.click('#luOk'); pg.wait_for_timeout(200)
    check(pg.locator('.result.ok').count()==1 and pg.evaluate("Store.prob('W0P1').status")=='clear' and pg.evaluate("JSON.parse(Store.prob('W0P1').code).html")=='<h1>내 첫 페이지</h1>', 'W0P1 정답 제출 → 클리어 + 저장값 JSON({html,css,js})')
    pg.evaluate("UI.go('problem',{pid:'W0P4',lessonId:'W0'})"); pg.wait_for_timeout(900)
    pg.fill('.web-pane[data-pane=html] textarea','<h1>내 첫 페이지</h1><p>a</p><p>b</p>'); pg.click('.web-tab[data-tab=css]'); pg.fill('.web-pane[data-pane=css] textarea','p { color: red; }'); pg.wait_for_timeout(800); pg.click('#btnGrade'); pg.wait_for_timeout(1500)
    check(pg.locator('.web-chk li.ok').count()==2 and pg.locator('.web-chk li.bad').count()==1 and '파랑' in pg.locator('.web-chk li.bad').inner_text(), 'W0P4 색만 틀림 → ✓ 2 ✗ 1 (실패 항목 = 글자색)')
    pg.click('.web-chk li.bad'); pg.wait_for_timeout(300); check(pg.frame_locator('.web-frame').locator('p').first.evaluate('e=>e.style.outline')!='', '실패 항목 클릭 → 미리보기에서 그 요소 outline 강조')
    pg.fill('.web-pane[data-pane=css] textarea','p { color: blue; }'); pg.wait_for_timeout(800); pg.click('#btnGrade'); pg.wait_for_timeout(1500)
    for _ in range(3):
        if pg.locator('#luOk').count(): pg.click('#luOk'); pg.wait_for_timeout(200)
    check(pg.locator('.result.ok').count()==1 and pg.locator('.web-check .web-chk li.ok').count()==3 and pg.evaluate("Store.prob('W0P4').status")=='clear', 'W0P4 정답 → 클리어, 「검사 결과」 탭에 체크리스트 ✓ 3')
    pg.evaluate("UI.go('problem',{pid:'W0P2',lessonId:'W0'})"); pg.wait_for_timeout(500); pg.click('.qopt[data-i="0"]'); pg.wait_for_timeout(1200)
    for _ in range(3):
        if pg.locator('#luOk').count(): pg.click('#luOk'); pg.wait_for_timeout(200)
    check(pg.evaluate("Store.prob('W0P2').status")=='clear', 'W0P2 퀴즈(기존 유형) 정답 → 클리어')
    pg.evaluate("UI.go('home')"); pg.wait_for_timeout(400); pg.evaluate("(()=>{ for (let k=0;k<2;k++){ const c=document.querySelector('.lc.draft'); c.disabled=false; c.click(); } })()"); pg.wait_for_timeout(300) # PC 홈은 첫 클릭 = 미리보기 선택, 둘째 클릭 = 열기
    check(pg.evaluate("UI.view")=='home' and '준비 중' in pg.locator('#toasts').inner_text(), 'draft 레슨 카드 → 「준비 중」 토스트, 열리지 않음')
    pg.set_viewport_size({'width':390,'height':800}); pg.evaluate("UI.go('problem',{pid:'W0P4',lessonId:'W0'},false)"); pg.wait_for_timeout(700); pg.click('.pv-tabs button[data-t="work"]'); pg.wait_for_timeout(300)
    check(pg.evaluate('document.documentElement.scrollWidth')<=390 and pg.locator('.web-frame').count()==1, '웹 문제 화면 모바일(390px) 가로 스크롤 없음'); pg.set_viewport_size({'width':1280,'height':900})
    pg.evaluate("UI.go('home')"); pg.wait_for_timeout(300); errors[:]=[e for e in errors if 'allow-same-origin' not in e] # 미리보기 iframe 은 sandbox(allow-same-origin 없음)라 regress 의 add_init_script(localStorage 시드)가 iframe 안에서 던지는 에러 — 앱 코드가 아니므로 이 절 끝에서 뺀다(다른 코스 절이 웹 미리보기를 열면 거기서도 필요)
    # ===== [코스 terminal-git] ===== (v2.7.0 뼈대) 허브 카드 → 코스 열기 → T0 레슨 쪽·예제(한 줄씩 실행) → 미션 정답/오답·명령 퀴즈·빈칸 → 이어서 하기(재실행)·처음부터 → Git 패널·편집창·명령 순서 → draft 「준비 중」 → 폰 390px
    print('[terminal-git 코스]'); TG='file://'+os.path.join(ROOT,'courses/terminal-git/index.html'); tg0=len(errors)
    pg.set_viewport_size({'width':1280,'height':900}); pg.goto(HUB); pg.wait_for_timeout(500)
    tgc=pg.evaluate("(()=>{ const c=[...document.querySelectorAll('a.hc')].find(x=>(x.getAttribute('href')||'').includes('terminal-git')); return c? {href:c.getAttribute('href'), txt:c.innerText.replace(/\\n/g,' ')} : null; })()")
    check(bool(tgc) and '준비 중' in tgc['txt'] and '미리보기' in tgc['txt'], '허브: 터미널·Git 카드가 「준비 중 · 미리보기 열림」 링크 (%s)' % (tgc and tgc['txt'][:40]))
    pg.goto(TG); pg.wait_for_timeout(800); pg.evaluate("Store.data.onboarded=true; Store.save({silent:true}); document.querySelectorAll('.modal-ov').forEach(e=>e.remove()); UI.go('home')"); pg.wait_for_timeout(400)
    tgh=pg.evaluate("({view:UI.view, cards:document.querySelectorAll('.lc').length, draft:document.querySelectorAll('.lc.draft').length, modes:Object.keys(UI.modes).sort().join(','), ex:Object.keys(UI.examples).join(','), css:!![...document.styleSheets].find(s=>(s.href||'').includes('terminal-git/course.css'))})")
    check(tgh['view']=='home' and tgh['cards']>=5 and tgh['draft']>=4 and tgh['modes']=='mission,parsons' and tgh['ex']=='shell' and tgh['css'], 'terminal-git 홈: 레슨 카드 + draft 카드 「준비 중」, UI.modes mission·parsons, UI.examples shell, course.css (%s)' % tgh)
    pg.evaluate("UI._home.sel='T1'; UI.go('home')"); pg.wait_for_timeout(200); dr=pg.evaluate("(()=>{ const c=document.querySelector('.lc[data-l=\"T1\"], .lc.draft'); return c ? {cls:c.className, txt:c.innerText.includes('준비 중')} : null; })()")
    check(bool(dr) and 'draft' in dr['cls'] and dr['txt'], 'draft 레슨 카드에 「준비 중」 (%s)' % dr)
    pg.evaluate("UI.go('lesson',{lessonId:'T0',page:2})"); pg.wait_for_timeout(500)
    tge={'term':pg.locator('#exPlugin .sh-term').count(), 'lines':pg.locator('.ex-sh-lines li').count(), 'pages':pg.evaluate("Content.lesson('T0').pages.length")}
    for _ in range(4): pg.click('#exShNext'); pg.wait_for_timeout(60)
    tge['out']=pg.locator('#exPlugin .sh-out').inner_text(); tge['cur']=pg.locator('#exPlugin .sh-tr.cur').inner_text(); tge['done']=pg.locator('.ex-sh-lines li.done').count()
    check(tge['term']==1 and tge['lines']>=5 and tge['pages']==4 and '/home/me' in tge['out'] and 'projects/' in tge['out'] and 'projects/' in tge['cur'] and tge['done']==4, 'T0 레슨 4쪽 + 예제 플러그인: 한 줄씩 실행 4번 → 출력·트리의 현재 폴더가 projects (%s)' % {k:tge[k] for k in ('term','lines','pages','cur','done')})
    pg.fill('#exPlugin .sh-in', 'cd ..'); pg.keyboard.press('Enter'); pg.wait_for_timeout(100); check('me/' in pg.locator('#exPlugin .sh-tr.cur').inner_text(), '예제 터미널에 직접 친 명령(cd ..)도 트리에 반영')
    # 미션: 목표 체크리스트 실시간 ✓ → 제출 클리어, 저장 코드 = 명령 히스토리
    pg.evaluate("UI.go('problem',{pid:'T0P1',lessonId:'T0'})"); pg.wait_for_timeout(500)
    tgm={'term':pg.locator('#msTerm .sh-term').count(), 'goals':pg.locator('.ms-g').count(), 'dis0':pg.evaluate("document.querySelector('#btnGrade').disabled"), 'label':pg.locator('.pv-head .chip').first.inner_text()}
    pg.fill('#msTerm .sh-in', 'pwd'); pg.keyboard.press('Enter'); pg.fill('#msTerm .sh-in', 'ls'); pg.keyboard.press('Enter'); pg.wait_for_timeout(80); tgm['mid']=pg.locator('.ms-g.done').count(); tgm['dis1']=pg.evaluate("document.querySelector('#btnGrade').disabled")
    pg.fill('#msTerm .sh-in', 'cd pro'); pg.keyboard.press('Tab'); tgm['tab']=pg.evaluate("document.querySelector('#msTerm .sh-in').value"); pg.keyboard.press('Enter'); pg.wait_for_timeout(80); tgm['done']=pg.locator('.ms-g.done').count(); tgm['dis2']=pg.evaluate("document.querySelector('#btnGrade').disabled"); tgm['ps1']=pg.locator('#msTerm .sh-line .sh-ps1').inner_text()
    check(tgm['term']==1 and tgm['goals']==3 and tgm['dis0'] and tgm['mid']==2 and tgm['dis1'] and tgm['tab']=='cd projects/' and tgm['done']==3 and not tgm['dis2'] and '~/projects' in tgm['ps1'] and tgm['label']=='미션', '미션: 명령마다 목표 ✓(2/3 → 3/3), Tab 자동완성, 프롬프트 경로, 전부 달성해야 제출 활성 (%s)' % tgm)
    pg.click('#btnGrade'); pg.wait_for_timeout(1500)
    for _ in range(3):
        if pg.locator('#luOk').count(): pg.click('#luOk'); pg.wait_for_timeout(200)
    check(pg.locator('.result.ok').count()==1 and pg.evaluate("Store.prob('T0P1').status")=='clear' and pg.evaluate("Store.prob('T0P1').code")=='pwd\nls\ncd projects/', '미션 제출 → 클리어, 저장된 답 = 명령 히스토리')
    # 오답 제출(Ctrl+Shift+Enter 로 plugin.submit) → 남은 목표 안내, 다시 열면 이어서(재실행), 처음부터
    pg.evaluate("UI.go('problem',{pid:'T0P4',lessonId:'T0'})"); pg.wait_for_timeout(400); pg.fill('#msTerm .sh-in', 'cd notes'); pg.keyboard.press('Enter'); pg.wait_for_timeout(80); pg.keyboard.press('Control+Shift+Enter'); pg.wait_for_timeout(400)
    tgf=pg.locator('#pvResult').inner_text(); check(tgf.strip()=='' and pg.evaluate("Store.prob('T0P4').fails")==0 and pg.evaluate("document.querySelector('#btnGrade').disabled"), '미션 목표 미달성: 제출 버튼 disabled, Ctrl+Shift+Enter 도 무시(실패 기록 없음) — QA v2.7.0 중6 (%s)' % tgf[:60].replace('\n',' '))
    pg.evaluate("UI.go('home')"); pg.wait_for_timeout(200); pg.evaluate("UI.go('problem',{pid:'T0P4',lessonId:'T0'})"); pg.wait_for_timeout(400)
    check('~/notes' in pg.locator('#msTerm .sh-line .sh-ps1').inner_text() and pg.locator('.sh-note').count()==1, '미션 다시 열기 → 저장된 명령을 재실행해 이어서(프롬프트 ~/notes)')
    pg.click('#msReset'); pg.wait_for_timeout(200); pg.evaluate("(()=>{ const bs=[...document.querySelectorAll('.modal-btns button')]; (bs[1]||bs[0]).click(); })()"); pg.wait_for_timeout(200)
    check(pg.locator('#msTerm .sh-line .sh-ps1').inner_text().startswith('me@academy:~$') and pg.evaluate("Store.prob('T0P4').code")=='', '「처음부터」 → 초기 상태·저장 명령 비움')
    # 명령 퀴즈(kind cmd) · 빈칸
    pg.evaluate("UI.go('problem',{pid:'T0P2',lessonId:'T0'})"); pg.wait_for_timeout(300); tq=pg.locator('.qopt').count(); pg.click('.qopt[data-i="%d"]' % pg.evaluate("Content.problem('T0P2').quiz.ans")); pg.wait_for_timeout(1200)
    for _ in range(3):
        if pg.locator('#luOk').count(): pg.click('#luOk'); pg.wait_for_timeout(200)
    check(tq==4 and pg.locator('.result.ok').count()==1, '명령 맞히기 퀴즈(kind cmd) 보기 4개 → 클리어')
    pg.evaluate("UI.go('problem',{pid:'T0P3',lessonId:'T0'})"); pg.wait_for_timeout(300); fb=pg.locator('.blank').count(); pg.evaluate("[...document.querySelectorAll('.blank')].forEach((el,i)=>{ el.value=Content.problem('T0P3').fill.blanks[i].a[0]; })"); pg.click('#btnGrade'); pg.wait_for_timeout(1200)
    for _ in range(3):
        if pg.locator('#luOk').count(): pg.click('#luOk'); pg.wait_for_timeout(200)
    check(fb==3 and pg.locator('.result.ok').count()==1, '빈칸(터미널 장면) 3칸 → 클리어')
    # 보스 미션: Git 패널(3칸·그래프)·edit 편집창·forbid 규칙
    pg.evaluate("Store.data.settings.unlockAll=true; UI.go('problem',{pid:'TB1P1',lessonId:'TB1'})"); pg.wait_for_timeout(400)
    for c in ['git init','git add .','git commit -m "first"','git switch -c dev','echo more >> util.py','git commit -am "second"','git switch main','echo x >> main.py','git commit -am "third"','git merge dev']:
        pg.fill('#msTerm .sh-in', c); pg.keyboard.press('Enter'); pg.wait_for_timeout(40)
    tgg=pg.evaluate("({panel:document.querySelectorAll('.sh-git:not(.hide)').length, cols:document.querySelectorAll('.sh-col').length, circles:document.querySelectorAll('.sh-svg circle').length, labels:[...document.querySelectorAll('.sh-gl text')].map(t=>t.textContent).sort().join(','), ps1:document.querySelector('#msTerm .sh-line .sh-ps1').textContent, repo:document.querySelector('.sh-cols').innerText.includes('Merge branch')})")
    check(tgg['panel']==1 and tgg['cols']==3 and tgg['circles']==4 and tgg['labels']=='HEAD → main,dev' and '(main)' in tgg['ps1'] and tgg['repo'], 'Git 패널: 3칸 상태 뷰 + 커밋 그래프(커밋 4·라벨 HEAD → main/dev) + 프롬프트 브랜치 (%s)' % tgg)
    pg.fill('#msTerm .sh-in', 'edit notes.txt'); pg.keyboard.press('Enter'); pg.wait_for_timeout(300); tgd=pg.locator('#shEdTa').count(); pg.fill('#shEdTa', 'TODO 가 들어 있는 파일:\nutil.py\n'); pg.click('.modal-btns button:has-text("저장")'); pg.wait_for_timeout(200)
    tgd2=pg.evaluate("({hist:Store.prob('TB1P1')&&1, work:document.querySelector('.sh-cols').innerText.includes('notes.txt'), modal:document.querySelectorAll('.modal-ov').length})"); pg.fill('#msTerm .sh-in', 'cat notes.txt'); pg.keyboard.press('Enter'); pg.wait_for_timeout(80)
    check(tgd==1 and tgd2['modal']==0 and tgd2['work'] and 'util.py' in pg.locator('#msTerm .sh-out').inner_text()[-120:], 'edit 파일 → 편집창(textarea) 저장 → 파일에 반영(작업 폴더 칸에 고침 표시)')
    pg.fill('#msTerm .sh-in', 'rm -r src'); pg.keyboard.press('Enter'); pg.wait_for_timeout(80); check(pg.locator('.ms-g.broken').count()==1 and pg.evaluate("document.querySelector('#btnGrade').disabled"), 'forbid 규칙(rm -r) 어기면 체크리스트에 ✕ + 제출 비활성')
    tgp=pg.evaluate("""(()=>{ const sol='git init\\ngit add .\\ngit commit -m "a"\\ngit switch -c dev\\ngit log'; const p={id:'TX',type:'parsons',title:'t',prompt:'',hints:['a','b','c'],tags:['커밋'],solution:sol,parsons:{solution:sol}}; const host=document.createElement('div'); document.body.appendChild(host); const got=[]; const pl=UI.modes.parsons.mount(host,p,{pid:'TX',rec:{},fresh:true,submit:(r)=>got.push(r.ok)}); const pick=(t)=>[...host.querySelectorAll('.pz-bank .pz-tile')].find(x=>x.textContent===t).click(); ['git add .','git init'].forEach(pick); pl.submit(); while(host.querySelector('.pz-ans .pz-x')) host.querySelector('.pz-ans .pz-x').click(); sol.split('\\n').forEach(pick); pl.submit(); const code=pl.getCode(); host.remove(); return {got, saved:code.includes('git log'), hiddenIndent:getComputedStyle(document.body).display!=null}; })()""")
    check(tgp['got']==[False, True] and tgp['saved'], '명령 순서(parsons 플러그인): 틀린 순서 → 실패, 맞는 순서 → 통과, 저장은 배치 JSON (%s)' % tgp['got'])
    tgv=pg.evaluate("(()=>{ const p=Content.problem('T0P1'); const sh=Shell.create(JSON.parse(JSON.stringify(p.setup))); const r=Grader.matchState(sh.state(), p.expect); return {okBefore:r.ok, fails:r.fails.length}; })()")
    check(tgv['okBefore'] is False and tgv['fails']>=1, '브라우저에서도 Grader.matchState 로 시작 상태는 미달성 (%s)' % tgv)
    pg.set_viewport_size({'width':390,'height':800}); pg.evaluate("UI.go('problem',{pid:'T0P1',lessonId:'T0'})"); pg.wait_for_timeout(400); pg.click('.pv-tabs button[data-t="work"]'); pg.wait_for_timeout(200)
    tgmo=pg.evaluate("({sw:document.documentElement.scrollWidth, chips:getComputedStyle(document.querySelector('.sh-chips')).display, treeFirst:document.querySelector('.sh-wrap').getBoundingClientRect().top < 1e9 && document.querySelector('.sh-side').getBoundingClientRect().top < document.querySelector('.sh-term').getBoundingClientRect().top})")
    check(tgmo['sw']<=390 and tgmo['chips']=='flex' and tgmo['treeFirst'], '폰 390px: 미션 화면 가로 넘침 없음, 명령 칩 표시, 파일 트리가 터미널 위 (%s)' % tgmo)
    pg.evaluate("UI.go('lesson',{lessonId:'T0',page:2})"); pg.wait_for_timeout(400); check(pg.evaluate('document.documentElement.scrollWidth')<=390, '폰 390px: T0 예제 쪽 가로 넘침 없음'); pg.set_viewport_size({'width':1280,'height':900})
    check(not [e for e in errors[tg0:]], 'terminal-git 코스 페이지 에러 0 (%s)' % errors[tg0:][:2])
    # ===== [코스 sql] ===== 데이터베이스(SQL) 코스 뼈대 (v2.7.0): 허브 카드 → 코스 열기 → S0 레슨 쪽·예제(CDN 차단 → Sql.unavailable 안내) → 문제 4개(가짜 엔진으로 채점 ok/실패) → draft 「준비 중」
    print('[sql]'); SQLC='file://'+os.path.join(ROOT,'courses/sql/index.html'); n0=len(errors)
    pg.set_viewport_size({'width':1280,'height':900}); pg.goto(HUB); pg.wait_for_timeout(600)
    check(pg.locator('a.hc[href*="courses/sql/"]').count()==1 and '미리보기' in pg.locator('a.hc[href*="courses/sql/"]').inner_text(), '허브: SQL 카드가 미리보기로 열림')
    pg.goto(SQLC); pg.wait_for_timeout(900); pg.evaluate("Store.data.onboarded=true; Store.data.settings.unlockAll=true; Store.save(); document.querySelectorAll('.modal-ov').forEach(m=>m.remove()); UI.go('home')"); pg.wait_for_timeout(400)
    check(pg.evaluate("UI.view")=='home' and pg.evaluate("typeof Sql==='object' && typeof UI.modes.sql==='object' && typeof UI.examples.sql==='object'"), 'SQL 코스 홈 렌더 + Sql 러너·UI.modes.sql·UI.examples.sql 등록')
    check(pg.locator('.lc.draft').count()>=4 and pg.locator('.lc.draft').first.is_disabled(), '준비 중(draft) 레슨 카드가 비활성 (%d개)' % pg.locator('.lc.draft').count())
    pg.evaluate("UI.go('lesson',{lessonId:'S0',page:0})"); pg.wait_for_timeout(2500)
    check(pg.locator('#exPlugin.sqlw').count()==1 and pg.locator('#exPlugin #exSqlRun').count()==1, 'S0 1쪽: { sql } 예제가 플러그인 작업판으로 그려짐')
    sqlst=pg.evaluate("({un:Sql.unavailable, ready:Sql.ready, reason:Sql.reason})")
    if sqlst['un']: check(pg.locator('#exPlugin .sql-notice.err').count()==1 and '받지 못했어요' in pg.locator('#exPlugin .sql-notice.err').inner_text() and pg.locator('#exPlugin [data-sqlretry]').count()==1, 'CDN 차단: 「SQLite 엔진을 받지 못했어요」 안내 + 재시도 버튼 (%s)' % sqlst['reason'])
    else: check(pg.locator('#exPlugin .sql-tbl').count()==1, '엔진 있음: 예제 자동 실행 결과 표 (%s)' % sqlst)
    # TODO F2: CodeMirror 언어 모듈(sql·html·css·js)이 실제 CDN 에서 받아지는지 — 인터넷 되는 CI 에서만 의미 있음(샌드박스는 CodeMirror 자체가 폴백)
    cml=pg.evaluate("""async()=>{ try { await CM.load(); } catch(e) { return {cm:false} } const o={cm:true}; for (const id of ['sql','html','css','js']) { await CM.lang(id); o[id]=!!(CM.mods.langs&&CM.mods.langs[id]); } return o; }""")
    if cml.get('cm'): check(all(cml.get(k) for k in ['sql','html','css','js']), 'CodeMirror 언어 모듈 sql·html·css·js 로드 %s' % cml)
    else: print('  · CodeMirror CDN 없음(폴백 환경) — 언어 모듈 확인 건너뜀')
    pg.evaluate("UI.go('lesson',{lessonId:'S0',page:2})"); pg.wait_for_timeout(500); check(pg.locator('#exPlugin.sqlw').count()==1 and pg.evaluate("document.querySelector('#exPlugin textarea, #exPlugin .cm-content') ? (document.querySelector('#exPlugin textarea')||{}).value||document.querySelector('#exPlugin .cm-content').innerText : ''").strip().startswith('SELECT name, price'), 'S0 3쪽 예제 쿼리가 편집기에 들어감')
    # 가짜 엔진: Sql.exec 를 고정 결과로 바꿔 채점 경로(rows 비교·기대/내 결과 표·행 수 힌트)를 검사
    pg.evaluate("""()=>{ window.__stubRows={ 'SELECT * FROM menu':{columns:['id','name','category','price','is_hot'],rows:[[1,'아메리카노','커피',4000,1],[2,'카페라테','커피',4500,1]]}, "SELECT name, price FROM menu WHERE category = '커피'":{columns:['name','price'],rows:[['아메리카노',4000],['카페라테',4500]]}, 'SELECT name FROM menu':{columns:['name'],rows:[['아메리카노'],['카페라테']]}, 'SELECT * FROM menu LIMIT 1':{columns:['id','name','category','price','is_hot'],rows:[[1,'아메리카노','커피',4000,1]]}, "SELECT price, name FROM menu WHERE category = '커피'":{columns:['price','name'],rows:[[4500,'카페라테'],[4000,'아메리카노']]}, "SELECT name, price FROM menu WHERE category = '음료'":{columns:['name','price'],rows:[['녹차라테',5000],['유자차',4500]]} };
      Sql.ready=true; Sql.unavailable=false; Sql.SQL={ Database: function(){ this.exec=()=>[]; this.close=()=>{}; this.getRowsModified=()=>0; } };
      Sql.exec=(db,q)=>{ q=String(q).trim().replace(/\\s+/g,' '); const r=window.__stubRows[q]; if(!r) return { error:{ msg:'no such column: '+q.split(' ')[1], ko:'(가짜 엔진) 모르는 쿼리' } }; return { columns:r.columns.slice(), rows:r.rows.map(x=>x.slice()), ms:1, changes:0 }; };
      Sql.tables=()=>['menu']; Sql.columns=()=>[{name:'id',type:'INTEGER',pk:true},{name:'name',type:'TEXT'}]; Sql.count=()=>2; Sql.sample=()=>({columns:['id','name'],rows:[[1,'아메리카노']]}); Sql._emit(); }""")
    pg.evaluate("UI.go('problem',{pid:'S0P1',lessonId:'S0'})"); pg.wait_for_timeout(500)
    check(pg.locator('#pvMode.sqlw').count()==1 and pg.locator('#sqlRun').count()==1 and pg.locator('#btnGrade').count()==1 and pg.locator('#pvMode .sqlw-schema .sql-sch-name').count()>=1, 'S0P1(sql): 작업판(실행·제출·스키마 패널)')
    setq="(q)=>{ const t=document.querySelector('#pvMode textarea, #pvMode .cm-content'); if(t.value!==undefined){ t.value=q; t.dispatchEvent(new Event('input')); } else { t.innerText=q; } }"
    pg.evaluate(setq, 'SELECT name FROM menu'); pg.click('#sqlRun'); pg.wait_for_timeout(300)
    check(pg.locator('#pvMode .sqlw-out .sql-tbl').count()==1 and '2행' in pg.locator('#pvMode .sql-tbl-meta').inner_text(), '▶ 실행: 결과 표 + 행 수·ms')
    pg.click('#pvMode .sql-tbl th[data-col="0"]'); pg.wait_for_timeout(100); check(pg.locator('#pvMode .sql-tbl th.asc').count()==1, '결과 표 열 머리 클릭 정렬')
    pg.click('#btnGrade'); pg.wait_for_timeout(500)
    r1=pg.locator('#pvResult').inner_text(); check('열 개수가 달라요' in r1 and pg.locator('#pvResult .sql-diff .sql-tbl').count()==2, '오답(열 수 다름): 기대/내 결과 표 두 개 나란히: %s' % r1[:40].replace('\n',' '))
    pg.evaluate(setq, 'SELECT * FROM menu LIMIT 1'); pg.click('#btnGrade'); pg.wait_for_timeout(500)
    r2=pg.locator('#pvResult').inner_text(); check('행 수가 달라요' in r2 and '덜 나왔어요' in r2 and pg.locator('#pvResult td.diff').count()>=1, '오답(행 수 다름): 자동 힌트 + 다른 셀 강조: %s' % r2[:50].replace('\n',' '))
    pg.evaluate(setq, 'SELECT * FROM mneu'); pg.click('#btnGrade'); pg.wait_for_timeout(500); check('실행되지 않았어요' in pg.locator('#pvResult').inner_text() and pg.locator('#pvResult .sql-err-ko').count()==1, '오답(에러): 원문 + 한국어 풀이')
    pg.evaluate(setq, 'SELECT * FROM menu'); pg.click('#btnGrade'); pg.wait_for_timeout(900)
    check(pg.evaluate("Store.prob('S0P1').status")=='clear' and '기대한 결과와 같아요' in pg.locator('#pvMode .sqlw-out').inner_text() and pg.locator('#pvMode .sqlw-out .sql-tbl').count()==1 and pg.evaluate("Store.prob('S0P1').code")=='SELECT * FROM menu', '정답: clear + 결과 표 + 쿼리 저장')
    pg.evaluate("UI.go('problem',{pid:'S0P4',lessonId:'S0'})"); pg.wait_for_timeout(500)
    pg.evaluate(setq, "SELECT price, name FROM menu WHERE category = '커피'"); pg.click('#btnGrade'); pg.wait_for_timeout(900); check(pg.evaluate("Store.prob('S0P4').status")=='clear', 'S0P4: 열 순서가 달라도(이름으로 맞춤) 정답')
    pg.evaluate("Store.prob('S0P4').status='none'"); pg.evaluate(setq, "SELECT name, price FROM menu WHERE category = '음료'"); pg.click('#btnGrade'); pg.wait_for_timeout(500); check(pg.locator('#pvResult td.diff').count()>=2 and '셀이 달라요' in pg.locator('#pvResult').inner_text(), 'S0P4: 같은 행 수·다른 값 → 다른 셀 강조')
    pg.evaluate("UI.go('problem',{pid:'S0P2',lessonId:'S0'})"); pg.wait_for_timeout(400); pg.click('.qopt[data-i="1"]'); pg.wait_for_timeout(600); check(pg.evaluate("Store.prob('S0P2').status")=='clear', 'S0P2(quiz 결과 예측) 정답')
    pg.evaluate("UI.go('problem',{pid:'S0P3',lessonId:'S0'})"); pg.wait_for_timeout(400); pg.fill('.blank[data-b="0"]','SELECT'); pg.fill('.blank[data-b="1"]','FROM'); pg.click('#btnGrade'); pg.wait_for_timeout(600); check(pg.evaluate("Store.prob('S0P3').status")=='clear', 'S0P3(fill 키워드 빈칸) 정답')
    pg.set_viewport_size({'width':390,'height':800}); pg.evaluate("UI.go('problem',{pid:'S0P1',lessonId:'S0'},false)"); pg.wait_for_timeout(400); pg.click('.pv-tabs button[data-t="work"]'); pg.wait_for_timeout(200); check(pg.evaluate('document.documentElement.scrollWidth')<=390, 'SQL 문제 화면 모바일 가로 스크롤 없음'); pg.set_viewport_size({'width':1280,'height':900})
    sqlerr=[e for e in errors[n0:] if 'sql-wasm' not in e and 'Py' not in e]; check(not sqlerr, 'SQL 코스 pageerror 0 (%s)' % (sqlerr[:2] or 'OK')); pg.evaluate("Store.data.settings.unlockAll=false; Store.save()")
    b.close()
cdn=[e for e in errors if 'importScripts' in e or 'pyodide' in e.lower()]
real=[e for e in errors if e not in cdn]
print('ERRORS', len(real)); [print('  ',e) for e in real]
print('CONSOLE', [l for l in logs if l[0]=='error' and 'ERR_TUNNEL' not in l[1] and 'Failed to load resource' not in l[1]][:10])
if real: fails.append('page errors')
print('FAILS', len(fails)); sys.exit(1 if fails else 0)
