#!/usr/bin/env python3
# tools/regress.py — 헤드리스 크롬 회귀 (로컬 전용: Playwright + /usr/bin/google-chrome, 샌드박스는 CDN 접근 불가라 Pyodide/Blockly/CodeMirror는 폴백 동작만 확인)
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
    pg.evaluate("UI.go('lesson',{lessonId:'L3',page:(Content.lesson('L3').pages||[]).length})"); pg.wait_for_timeout(300); dc=pg.locator('#startDrills').count()
    if dc: pg.click('#startDrills'); pg.wait_for_timeout(500)
    dr=pg.evaluate("({pid:UI.params.pid, drill:!!(UI.params.session&&UI.params.session.drill), ed:!!document.querySelector('#pvEd'), n:Content.drillsOf('L3').length, total:PROBLEMS.length, inProbs:PROBLEMS.some(p=>p.drill)})")
    check(dc==1 and dr['drill'] and dr['pid'].startswith('L3D') and dr['ed'] and dr['n']==15 and not dr['inProbs'], '⌨ 타자 연습: 레슨 요약 버튼 → 드릴 세션(텍스트), 진도용 PROBLEMS 에는 안 섞임 (QA #96): '+str(dr))
    pg.evaluate("UI.go('typing')"); pg.wait_for_timeout(300); ty=pg.evaluate("({v:UI.view, note:!!document.querySelector('.ty-note') && document.querySelector('.ty-note').textContent.includes('PC'), lessons:document.querySelectorAll('[data-l]').length})")
    pg.evaluate("Sessions.drillMix(['L3'])"); pg.wait_for_timeout(400); ty2=pg.evaluate("({drill:!!(UI.params.session&&UI.params.session.drill), allL3:UI.params.session.pids.every(id=>id.startsWith('L3D')), coach:!!document.querySelector('#pvCoach .coach')})")
    check(ty['v']=='typing' and ty['note'] and ty['lessons']>=1 and ty2['drill'] and ty2['allL3'] and not ty2['coach'], '⌨ 백문이불여일타 화면: PC 권장 안내·레슨 체크 → 고른 범위 드릴, 따라하기 숨김 (QA #96): '+str(ty)+str(ty2))
    pg.evaluate("UI.go('home')"); pg.wait_for_timeout(200)
    check(pg.locator('#btnTutor').count()==0 and pg.locator('#lpAsk').count()==0, '선생님 기능 꺼짐: 버튼 없음 (CONFIG.TUTOR.enabled=false)')
    bundle=pg.evaluate("Store.exportBundle()"); check('academy-bundle' in bundle and 'academy.course.python' in bundle and 'apiKey' not in bundle, '백업 묶음 내보내기(F8, API 키 제외)')
    check(pg.evaluate("(()=>{const q=document.querySelector('#quickkeys'); return q && q.textContent.includes('⇤') && q.textContent.includes('input');})()"), '모바일 입력 칩 ⇤·input (F12)')
    pg.evaluate("UI.go('home')"); pg.wait_for_timeout(300); check(pg.locator('.node').count()>20, '지도 노드')
    hg=pg.evaluate("(()=>{ const b=s=>document.querySelector('#view .home > '+s).getBoundingClientRect(); const m=b('.map'), d=b('.side'); return {mw:Math.round(m.width), sw:Math.round(d.width), dy:Math.round(Math.abs(m.y-d.y))}; })()")
    check(hg['mw']>hg['sw'] and hg['dy']<4, 'PC 홈: 지도가 넓은 왼쪽 열, 옆 카드가 같은 줄 오른쪽 (QA #64, %s)' % hg)
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
    pg.evaluate("UI.go('problem',{pid:'L13P1',lessonId:'L13'})"); pg.wait_for_timeout(600); check(pg.locator('.ted').count()==1 and pg.locator('#pvIn').count()==1, '텍스트 문제 에디터(폴백)+입력칸')
    pg.evaluate("UI.go('problem',{pid:'L1P1',lessonId:'L1'})"); pg.wait_for_timeout(600); check(pg.locator('.ted').count()==1 and pg.locator('.bed').count()==0 and pg.locator('#btnToText').count()==0, 'L1 첫 문제도 타자 편집기 (블록 화면 없음)')
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
    pg.evaluate("UI.badgeFly(BADGES[6])"); pg.wait_for_timeout(100); check(pg.locator('.badge-fly .bf-icon').count()==1, '뱃지 획득 알림에 그림 자리')
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
    pg.evaluate("UI.go('home')"); pg.wait_for_timeout(300); check(pg.locator('.node').count()>=20 and pg.locator('.node.boss').count()==5, "알고리즘 지도: 노드 %d · 보스 %d" % (pg.locator('.node').count(), pg.locator('.node.boss').count()))
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
    pg.evaluate("UI.go('home')"); pg.wait_for_timeout(400); check(pg.evaluate("document.querySelector('.node.boss .node-ic').offsetWidth")>=100 and pg.evaluate('document.documentElement.scrollWidth')<=390, '모바일 지도 보스 아이콘 100px 이상')
    pg.evaluate("Store.data.settings.theme='light'; UI.applyTheme()"); pg.wait_for_timeout(200); check('rgb(255, 255, 255)' in pg.evaluate("getComputedStyle(document.querySelector('.node.boss')).backgroundImage"), '라이트 테마 보스 노드 밝은 배경'); pg.evaluate("Store.data.settings.theme='dark'; UI.applyTheme()")
    pg.goto(ALGO+'#problem/A5P2'); pg.wait_for_timeout(1200); pg.evaluate("Loader.minimized=true;Loader.render()"); pg.click('.pv-tabs button[data-t="work"]'); pg.wait_for_timeout(300)
    check(pg.evaluate('document.documentElement.scrollWidth')<=390, '알고리즘 문제 화면 가로 스크롤 없음(390px)')
    pg.goto(ALGO+'#lesson/AB4'); pg.wait_for_timeout(800); pg.evaluate("Store.data.settings.unlockAll=true;UI.go('lesson',{lessonId:'AB4'})"); pg.wait_for_timeout(400); check(pg.locator('#mockStart').count()==1 and pg.evaluate('document.documentElement.scrollWidth')<=390, '모의고사 안내 화면 모바일')
    # ---- 4. 예전 주소
    pg.goto('file://'+os.path.join(ROOT,'python_academy.html')); pg.wait_for_timeout(800); check(pg.url.endswith('courses/python/index.html') or '/courses/python/' in pg.url, '예전 주소 → 코스 페이지 리다이렉트 ('+pg.url[-40:]+')')
    print('[기기 연동 코스 구분 (QA #67)]'); sx=b.new_context(); sp=sx.new_page(); sp.on('pageerror', lambda e: errors.append(str(e)[:500]))
    sp.goto('file://'+os.path.join(ROOT,'courses/math/index.html')); sp.wait_for_timeout(900)
    sr=sp.evaluate("""()=>{ Store.data.onboarded=true; const r0=Store.prob('M1_mod_q1'); r0.status='clear'; r0.stars=3; Store.save(); Sync.cfg={lastSyncAt:1}; Sync.apply({updatedAt:Date.now()+5000, xp:9, settings:{}, problems:{L0P1:{status:'clear',stars:3}, M1_mod_q2:{status:'clear',stars:2}}}); const g=c=>{ const m=JSON.parse(localStorage.getItem('academy.course.'+c)||'{}'); return Object.keys(m.problems||{}).filter(k=>m.problems[k].status==='clear').sort().join(','); }; const p=Sync.payload(); return {math:g('math'), py:g('python'), fmt:p.format, keys:Object.keys(p.courses).sort().join(',')}; }""")
    check(sr['math']=='M1_mod_q1,M1_mod_q2' and sr['py']=='L0P1' and sr['fmt']=='academy-sync-2' and 'math' in sr['keys'] and 'python' in sr['keys'], '옛 형식 payload 를 수학 화면에서 받아도 코스별로 나뉨 + 새 payload 는 코스 묶음 (%s)' % sr)
    sx.close()
    b.close()
cdn=[e for e in errors if 'importScripts' in e or 'pyodide' in e.lower()]
real=[e for e in errors if e not in cdn]
print('ERRORS', len(real)); [print('  ',e) for e in real]
print('CONSOLE', [l for l in logs if l[0]=='error' and 'ERR_TUNNEL' not in l[1] and 'Failed to load resource' not in l[1]][:10])
if real: fails.append('page errors')
print('FAILS', len(fails)); sys.exit(1 if fails else 0)
