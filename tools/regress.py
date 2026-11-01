#!/usr/bin/env python3
# tools/regress.py — 헤드리스 크롬 회귀 (로컬 전용: Playwright + /usr/bin/google-chrome, 샌드박스는 CDN 접근 불가라 Pyodide/Blockly/CodeMirror는 폴백 동작만 확인)
#   1) v1 저장 데이터 → v2 마이그레이션 수치 보존  2) 허브 렌더·이어서 하기  3) 코스 페이지 전 화면 + 문제 유형별 채점  4) 모바일 390px 가로 스크롤 없음  5) 콘솔 에러 0
import json, os, sys, time
from playwright.sync_api import sync_playwright
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__))); HUB='file://'+os.path.join(ROOT,'index.html'); COURSE='file://'+os.path.join(ROOT,'courses/python/index.html')
SHOT=os.path.join(ROOT,'tools/.out/shots'); os.makedirs(SHOT,exist_ok=True)
V1={"v":1,"nick":"테스터","mascotColor":1,"onboarded":True,"xp":385,"badges":["first_run","first_clear"],"badgeDates":{"first_run":"2026-10-20"},"stats":{"runs":12},
    "problems":{"L0P1":{"status":"clear","stars":3,"hints":0,"attempts":1,"fails":0,"code":None,"mode":None,"clearedAt":"2026-10-20"},"L3P2":{"status":"try","stars":0,"hints":1,"attempts":2,"fails":1,"code":"n = int(input())\n","mode":"text"},"L5P2":{"status":"none","stars":0,"hints":0,"attempts":0,"fails":0,"code":json.dumps({"answer":[{"text":"total = 0","indent":0}]}),"mode":"parsons"}},
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
    check(r['cards']==5 and r['ready']==1, f"코스 카드 5개, 열린 코스 1개")
    check(r['cont'] and '#' in r['cont'], '이어서 하기 링크: '+str(r['cont']))
    check('일일 목표 2/5' in (r['today'] or ''), '오늘의 할 일: '+(r['today'] or '').replace('\n',' '))
    pg.screenshot(path=SHOT+'/hub.png')
    # ---- 2. 코스 페이지
    print('[코스 페이지]'); pg.goto(COURSE+'#problem/L3P2'); pg.wait_for_timeout(1500); pg.evaluate("Loader.minimized=true;Loader.render()")
    check(pg.evaluate("UI.view")=='problem' and pg.evaluate("UI.params.pid")=='L3P2', '딥링크 #problem/L3P2 로 문제 화면 진입')
    check(pg.evaluate("Store.data.xp")==385 and pg.evaluate("localStorage.getItem('python_academy_save')") is None, '코스 페이지도 같은 v2 데이터')
    check(pg.locator('#pvCoach .coach').count()==1, '텍스트 코치 표시'); check(pg.locator('.pv.focus').count()==1, '집중 모드 유지')
    check(pg.locator('.tb-hub').count()==1, '상단바 허브 버튼')
    pg.evaluate("UI.go('home')"); pg.wait_for_timeout(300); check(pg.locator('.node').count()>20, '지도 노드')
    # 퀴즈 채점
    pg.evaluate("UI.go('problem',{pid:'L0P2',lessonId:'L0'})"); pg.wait_for_timeout(300); ans=pg.evaluate("Content.problem('L0P2').quiz.ans"); pg.click(f'.qopt[data-i="{ans}"]'); pg.wait_for_timeout(1500)
    for _ in range(3):
        if pg.locator('#luOk').count(): pg.click('#luOk'); pg.wait_for_timeout(200)
    check(pg.locator('.result.ok').count()==1, '퀴즈 채점 클리어')
    # 빈칸
    pg.evaluate("UI.go('problem',{pid:'L1P4',lessonId:'L1'})"); pg.wait_for_timeout(300)
    blanks=pg.evaluate("Content.problem('L1P4').fill.blanks.map(b=>b.ans||b.answer||b.a)")
    print('    blanks', blanks)
    check(pg.locator('.blank').count()>=1, '빈칸 문제 렌더')
    # 버그·Parsons·텍스트 렌더
    pg.evaluate("UI.go('problem',{pid:'L2P4',lessonId:'L2'})"); pg.wait_for_timeout(300); check(pg.locator('.bugline').count()>0, '버그 문제 렌더')
    pg.evaluate("UI.go('problem',{pid:'L5P2',lessonId:'L5'})"); pg.wait_for_timeout(300); check(pg.locator('.pz-tile.pz-ans').count()==1 and pg.locator('.pz-bank .pz-tile').count()>0, 'Parsons 렌더 + 저장된 배치 복원')
    pg.evaluate("UI.go('problem',{pid:'L13P1',lessonId:'L13'})"); pg.wait_for_timeout(600); check(pg.locator('.ted').count()==1 and pg.locator('#pvIn').count()==1, '텍스트 문제 에디터(폴백)+입력칸')
    pg.evaluate("UI.go('problem',{pid:'L1P1',lessonId:'L1'})"); pg.wait_for_timeout(1200); check('블록' in pg.locator('.bed').inner_text(), '블록 문제 (CDN 없음 → 안내 문구)')
    # 실전 챕터 6 (v2.2.0): 프로젝트 체크리스트·단계 칩·파일 업로드 UI·마스터 뱃지
    pg.evaluate("Store.data.settings.unlockAll=true; UI.go('problem',{pid:'X1P1',lessonId:'X1'})"); pg.wait_for_timeout(600)
    check(pg.locator('#btnUpload').count()==1 and pg.locator('#pvFile').count()==1, '실전: 📎 CSV 업로드 버튼')
    check(pg.locator('.pv-tests .chip').count()>=4 or '단계' in pg.locator('#view').inner_text(), '실전: 테스트에 단계 칩')
    check(pg.evaluate("CHAPTERS.some(c=>c.ch===6&&c.name==='실전') && LESSONS.filter(l=>l.practical).length===4"), '실전 챕터 6 · practical 레슨 4개')
    pg.evaluate("Store.data.settings.unlockAll=true; UI.go('problem',{pid:'X3P1',lessonId:'X3'})"); pg.wait_for_timeout(500)
    check(pg.locator('#pvExtra').count()==1 and pg.locator('#pvExtra.hide').count()==1, '실전: 더 만들어 보기 카드(클리어 전 숨김)')
    pg.evaluate("Store.data.works.push({id:'w_t', name:'테스트 작품', code:'print(1)\\nprint(2)', src:'X1P1', course:'python', date:Date.now(), mode:'text', steps:4, total:4}); Store.save(); UI.go('works')"); pg.wait_for_timeout(300)
    check(pg.locator('.work-card').count()>=1 and pg.locator('[data-review]').count()>=1 and '단계 4/4' in pg.locator('#view').inner_text(), '내 작품 갤러리: 프로젝트 카드 + 리뷰 버튼')
    pg.evaluate("Store.data.settings.unlockAll=false")
    for v in ['badges','profile','inventory','settings','glossary','errors','weakness','review','timeattack','playground','works']:
        pg.evaluate(f"UI.go('{v}')"); pg.wait_for_timeout(300); check(len(pg.locator('#view').inner_text())>10, f'화면 {v}')
    pg.evaluate("UI.go('settings')"); pg.wait_for_timeout(300)
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
    pg.evaluate("UI.go('home')"); pg.wait_for_timeout(300); check(pg.locator('.node').count()>=20 and pg.locator('.node.boss').count()==4, "알고리즘 지도: 노드 %d · 보스 %d" % (pg.locator('.node').count(), pg.locator('.node.boss').count()))
    pg.evaluate("UI.go('problem',{pid:'A1P1',lessonId:'A1'})"); pg.wait_for_timeout(300); check(pg.locator('.quiz-code').count()==1 and '복잡도' in pg.locator('.pv-head').inner_text(), '복잡도 퀴즈: 코드 블록 + 유형명')
    pg.evaluate("UI.go('problem',{pid:'A2P1',lessonId:'A2'})"); pg.wait_for_timeout(300); check(pg.locator('#btnQuizViz').count()==1, '추적 퀴즈: 시각화 버튼')
    pg.evaluate("UI.go('problem',{pid:'A3P5',lessonId:'A3'})"); pg.wait_for_timeout(300); pg.click('.qopt[data-i="1"]'); pg.wait_for_timeout(400); check(pg.locator('.qopt[data-k]').count()==4, '자료구조 고르기: 2단계(이유) 표시')
    pg.click('.qopt[data-k="1"]'); pg.wait_for_timeout(1500)
    for _ in range(3):
        if pg.locator('#luOk').count(): pg.click('#luOk'); pg.wait_for_timeout(200)
    check(pg.locator('.result.ok').count()==1, '2단계 정답 → 클리어')
    pg.evaluate("UI.go('problem',{pid:'A5P2',lessonId:'A5'})"); pg.wait_for_timeout(500); check(pg.locator('#btnViz').count()==1, '코드 문제: 👀 시각화 버튼')
    pg.evaluate("Store.data.settings.unlockAll=true; UI.go('problem',{pid:'E1P1',lessonId:'E1'})"); pg.wait_for_timeout(600); check(pg.locator('#btnViz').count()==1 and pg.evaluate("CHAPTERS.some(c=>c.ch===5&&c.name==='실전')"), '알고 실전 E1P1: 격자 시각화 버튼 + 챕터 E'); pg.evaluate("Store.data.settings.unlockAll=false")
    pg.evaluate("UI.go('lesson',{lessonId:'AB4'})"); pg.wait_for_timeout(300); check(pg.evaluate("UI.view")=='mock' and pg.locator('#mockStart').count()==1, '보스 AB4 → 모의고사 화면')
    pg.evaluate("UI.go('problem',{pid:'AB4P1',lessonId:'AB4'})"); pg.wait_for_timeout(400); check('입력 형식' in pg.locator('.pv-prompt').inner_text() and '코딩테스트' in pg.locator('.pv-head').inner_text(), '코딩테스트 형식 문제')
    pg.evaluate("UI.go('playground')"); pg.wait_for_timeout(300); check(pg.locator('[data-m="block"]').count()==0, '놀이터에 블록 탭 없음')
    pg.evaluate("UI.go('settings')"); pg.wait_for_timeout(300); check(pg.locator('#sUnlock').count()==1, '설정: 전제 무시 스위치')
    vz = pg.evaluate(VIZ_JS)
    check(vz['ok1'] and vz['frames']==3 and vz['errs']==0, "시각화 플레이어·8종 그리기 (frames=%s, errs=%s)" % (vz['frames'], vz['errs']))
    pg.goto(HUB); pg.wait_for_timeout(600); hc = pg.evaluate("()=>[...document.querySelectorAll('.hc')].map(e=>e.className+'|'+e.innerText.replace(/\\n/g,' ').slice(0,60))")
    check(any('알고리즘' in x and ('ready' in x or 'locked' in x) for x in hc), '허브에 알고리즘 코스 카드: '+([x for x in hc if '알고리즘' in x]+['?'])[0][:70])
    # ---- 3. 모바일
    print('[모바일 390px]'); pg.set_viewport_size({'width':390,'height':800})
    pg.goto(HUB); pg.wait_for_timeout(500); check(pg.evaluate('document.documentElement.scrollWidth')<=390, '허브 가로 스크롤 없음'); pg.screenshot(path=SHOT+'/hub_m.png', full_page=True)
    pg.goto(COURSE+'#problem/L13P1'); pg.wait_for_timeout(1200); pg.evaluate("Loader.minimized=true;Loader.render()"); pg.click('.pv-tabs button[data-t="work"]'); pg.wait_for_timeout(300)
    check(pg.evaluate('document.documentElement.scrollWidth')<=390, '코스 페이지 가로 스크롤 없음'); pg.screenshot(path=SHOT+'/course_m.png')
    pg.goto(ALGO+'#problem/A5P2'); pg.wait_for_timeout(1200); pg.evaluate("Loader.minimized=true;Loader.render()"); pg.click('.pv-tabs button[data-t="work"]'); pg.wait_for_timeout(300)
    check(pg.evaluate('document.documentElement.scrollWidth')<=390, '알고리즘 문제 화면 가로 스크롤 없음(390px)')
    pg.goto(ALGO+'#lesson/AB4'); pg.wait_for_timeout(800); pg.evaluate("Store.data.settings.unlockAll=true;UI.go('lesson',{lessonId:'AB4'})"); pg.wait_for_timeout(400); check(pg.locator('#mockStart').count()==1 and pg.evaluate('document.documentElement.scrollWidth')<=390, '모의고사 안내 화면 모바일')
    # ---- 4. 예전 주소
    pg.goto('file://'+os.path.join(ROOT,'python_academy.html')); pg.wait_for_timeout(800); check(pg.url.endswith('courses/python/index.html') or '/courses/python/' in pg.url, '예전 주소 → 코스 페이지 리다이렉트 ('+pg.url[-40:]+')')
    b.close()
cdn=[e for e in errors if 'importScripts' in e or 'pyodide' in e.lower()]
real=[e for e in errors if e not in cdn]
print('ERRORS', len(real)); [print('  ',e) for e in real]
print('CONSOLE', [l for l in logs if l[0]=='error' and 'ERR_TUNNEL' not in l[1] and 'Failed to load resource' not in l[1]][:10])
if real: fails.append('page errors')
print('FAILS', len(fails)); sys.exit(1 if fails else 0)
