// courses/terminal-git/content.js — 코스 3 터미널·Git (Phase 2, v2.7.0 뼈대). 레슨 20개 중 T0(완성 본보기)·TB1(보스 미션)만 채워져 있고 나머지는 draft:true(「준비 중」).
// 채우는 규칙은 specs/content-team.md 「C-T 터미널·Git 채우기」, 설계는 docs/EXPANSION.md 6절·docs/DESIGN.md 16절. 파이썬/알고리즘 content.js 와 같은 전역 const 구조(엔진이 그대로 읽는다).
//
// 이 코스의 문제 유형과 필드 (화면: core/ui-views-shell.js · 셸: core/runners/shell.js · 채점 키: core/engine.js 끝 Grader.matchState · 검사: tools/validate/terminal-git.mjs · 정답 실행: tools/run_shell_solutions.mjs)
//   type:'mission'  미션형. setup:{cwd?, tree, git?, remote?}(shell.js 머리말) · goals:[{text, expect:{...}}](실시간 체크리스트, 명령마다 Shell.state()와 대조)
//                   · expect?:{...}(최종 비교; 없으면 goals 의 expect 를 합침) · forbid?:['rm -rf /'](명령 히스토리 검사) · solution:'명령\n명령'(정답 보기·검증 도구가 실행) · xp 선택(없으면 CONFIG.XP.mission = 25)
//                   expect 키: cwd cwdStartsWith files dirs noFiles git commits branchCommits branches noBranches head staged stagedEmpty clean noConflictMarkers tags messages lastMessage remoteBranches pushed stash forbid historyIncludes
//                   — expect 에 적힌 항목만 비교(EXPANSION 6절 "채점"). 함수·정규식은 쓰지 않는다(전부 선언형: Node 검증 도구가 같은 데이터로 돌린다). grader 는 'state' 로 적는다.
//   type:'quiz'     그대로. 명령 맞히기는 kind:'cmd' — "이 상태에서 ○○ 하려면?" 보기 4개가 명령어(<code>…</code>)
//   type:'fill'     그대로(명령 빈칸). fill.code 는 터미널 장면($ 프롬프트와 결과를 섞어 적는다)
//   type:'parsons'  명령 순서 맞히기. parsons.solution(줄마다 명령 한 개, 5줄 이상, 들여쓰기 없음) = solution. 화면 채점은 줄 순서만(UI.modes.parsons).
//                   validate 가 실행형 규칙으로 tests 를 요구하므로 setup + tests:[{expect}] 를 두고, run_shell_solutions 가 명령을 차례로 실행해 expect 를 확인한다.
//   레슨 pages[].example: { shell:'pwd\nls', setup?:{...} } — 예제를 터미널 창에서 한 줄씩 실행해 보여 줌(파이썬 example.code 는 이 코스에서 쓰지 않는다)
const COURSE = { id: 'terminal-git', name: '터미널·Git', runner: 'shell', bench: false,
  tutorPersona: '너는 터미널과 Git을 처음 보는 학생을 가르치는 선생님이다. 명령어는 "무엇을 하는지 → 어떻게 치는지 → 잘못 치면 어떻게 되는지" 순서로 설명한다. 실제 bash/Git 에러 문구(영문)를 그대로 보여 주고 한국어로 풀어 준다. 정답 명령을 바로 주지 말고 어느 명령 계열인지부터 짚는다.' };
const CHECKUPS = { after: {}, upto: {} };
const WEAKNESS_TAGS = ['경로', '파일조작', '찾기', '파이프', '커밋', '되돌리기', '브랜치', '병합', '원격', '충돌'];
const CHAPTERS = [
  { ch: 1, name: '터미널', color: '#607d8b' },
  { ch: 2, name: 'Git 기초', color: '#f05033' },
  { ch: 3, name: '브랜치와 협업', color: '#6e5494' },
];
// 준비 중 레슨의 자리 표시(draft:true 레슨은 홈·트리에서 「준비 중」으로 잠긴다). 각 레슨 3~4쪽(개념 → 명령 → 실수와 에러) + 문제 4~5개(미션 2 + 퀴즈/빈칸/순서 2~3)가 목표(문제 70+).
const TODO = (t) => [{ title: '준비 중', html: `<p>TODO(C-T): ${t}</p>` }];
// T0 예제·문제가 쓰는 시작 폴더 (홈 /home/me 안)
const T0_TREE = { home: { me: { 'memo.txt': '오늘 할 일\n- 터미널 열기\n- pwd 쳐 보기\n', projects: { web: { 'index.html': '<h1>hi</h1>\n' }, api: {} }, notes: { 'welcome.txt': '터미널에 온 것을 환영해요.\n이 파일을 cat 으로 읽었다면 성공!\n' } } } };
const LESSONS = [
// ================= 챕터 A 터미널 =================
{ id: 'T0', ch: 1, n: 0, title: '터미널이란', mode: 'text', terms: { '터미널': '글자로 명령을 쳐서 컴퓨터를 다루는 창. 셸(bash)이 명령을 읽어 실행한다', '프롬프트': '터미널이 명령을 기다릴 때 보여 주는 한 줄 (사용자@컴퓨터:현재폴더$). $ 뒤에 명령을 친다' }, tutorSummary: '터미널 = 글자로 컴퓨터에 명령하는 창. 왜 마우스 대신 글자인가(반복·원격·정확). 프롬프트 읽기(사용자@컴퓨터:현재폴더$). 첫 명령 pwd(어디)·ls(뭐가)·cd(이동).',
  pages: [
    { title: '검은 창은 무섭지 않아요', scene: '영화에서 해커가 두드리는 검은 창. 사실은 "글자로 말하는 탐색기"일 뿐이에요.',
      html: `<p>폴더를 열고, 파일을 옮기고, 프로그램을 켜는 일 — 지금까지는 마우스로 했죠. <b>[[터미널]]</b>은 같은 일을 <b>글자로 명령해서</b> 하는 창이에요. 마우스로 "폴더 더블클릭"을 하는 대신 <code>cd 폴더</code> 라고 치는 거예요.</p>
<p>왜 굳이 글자로 할까요?</p>
<ul><li><b>반복</b> — 파일 300개 이름 바꾸기를 마우스로 하면 하루, 명령 한 줄이면 1초예요.</li><li><b>원격</b> — 화면이 없는 서버 컴퓨터는 글자로만 말을 걸 수 있어요.</li><li><b>정확</b> — "그 폴더 있잖아, 거기" 대신 <code>/home/me/projects/web</code> 처럼 딱 집어 말해요.</li></ul>
<p>이 코스의 터미널은 <b>연습용 가짜</b>예요. 가상 폴더 위에서 돌아가니 무엇을 지워도 진짜 컴퓨터는 멀쩡해요. 마음껏 틀려 보세요.</p>` },
    { title: '프롬프트 읽기', html: `<p>터미널을 열면 이런 한 줄이 기다리고 있어요. 이걸 <b>[[프롬프트]]</b>라고 해요 — "명령을 치세요"라는 신호예요.</p>
<pre class="code">me@academy:~/projects (main)$ </pre>
<ul><li><code>me</code> — 지금 로그인한 <b>사용자</b> 이름</li><li><code>academy</code> — <b>컴퓨터</b> 이름 (@ 앞은 누가, 뒤는 어디서)</li><li><code>~/projects</code> — <b>지금 있는 폴더</b>. <code>~</code>는 내 홈 폴더(<code>/home/me</code>)의 줄임말이에요</li><li><code>(main)</code> — Git 저장소 안에 있을 때만 보이는 <b>브랜치</b> 이름. 챕터 B에서 배워요</li><li><code>$</code> — 여기부터가 내 차례. <b>$ 뒤에 명령을 치고 Enter</b></li></ul>
<p>명령을 치면 결과가 바로 아랫줄에 글자로 나오고, 다시 프롬프트가 나타나요. "결과가 없으면 성공"인 명령도 많아요(예: 폴더 이동). 조용하면 잘 된 거예요.</p>
<p>프롬프트의 폴더 이름은 <b>내가 어디 있는지</b>를 늘 알려 줘요. 길을 잃었다 싶으면 먼저 프롬프트를 보세요.</p>` },
    { title: '첫 명령 세 개: pwd · ls · cd', html: `<p>처음 배우는 명령은 딱 세 개예요. 오른쪽 예제의 <b>다음 줄 실행 ▶</b>를 누르며 결과와 파일 트리가 어떻게 바뀌는지 보세요.</p>
<table class="kb"><tbody><tr><td><code>pwd</code></td><td><b>어디</b> 있나 — 지금 폴더의 전체 경로를 보여 줘요 (print working directory)</td></tr><tr><td><code>ls</code></td><td><b>뭐가</b> 있나 — 지금 폴더 안의 파일·폴더 목록. 폴더는 끝에 <code>/</code>가 붙어요 (list)</td></tr><tr><td><code>cd 폴더</code></td><td>그 폴더로 <b>이동</b> (change directory). 결과는 안 나오지만 프롬프트가 바뀌어요</td></tr></tbody></table>
<p>명령은 <b>명령 이름</b> + 띄어쓰기 + <b>대상</b> 순서예요. <code>ls projects</code> 는 "projects 폴더 안을 보여 줘". <code>cd</code> 뒤에 아무것도 안 쓰면 홈으로 돌아가요.</p>
<p>예제를 다 돌린 뒤 입력줄에 직접 <code>ls notes</code>, <code>cd ..</code> 같은 것도 쳐 보세요. <code>..</code>은 "한 칸 위 폴더"예요.</p>`,
      example: { shell: 'pwd\nls\nls projects\ncd projects\npwd\nls\ncd\npwd', setup: { tree: T0_TREE } } },
    { title: '틀려도 괜찮아요: 에러 읽기와 편한 키', html: `<p>없는 폴더로 가 보면 이렇게 나와요.</p>
<pre class="code">me@academy:~$ cd porjects
bash: cd: porjects: No such file or directory</pre>
<p>빨간 글씨는 고장이 아니라 <b>힌트</b>예요. "그런 파일이나 폴더가 없다"는 뜻이니 <code>ls</code>로 진짜 이름을 확인하면 돼요. 이 연습 터미널은 에러 아래에 한국어 풀이도 같이 보여 줘요.</p>
<p>손이 편해지는 키 세 개:</p>
<ul><li><b>Tab</b> — 이름 자동완성. <code>cd pro</code> 까지 치고 Tab 을 누르면 <code>projects/</code>가 채워져요. 오타가 사라져요.</li><li><b>↑ ↓</b> — 아까 친 명령 다시 불러오기.</li><li><b>Ctrl+L</b> — 화면 비우기 (<code>clear</code>와 같아요).</li></ul>
<p>이제 문제로 가요. 첫 미션은 "어디 있는지 보고, 뭐가 있는지 보고, 폴더로 들어가기" — 방금 배운 세 명령 그대로예요.</p>` },
  ],
  summary: ['터미널은 글자로 명령하는 창 — 반복·원격·정확', '프롬프트 me@academy:~/폴더$ 의 ~/폴더가 지금 위치, $ 뒤에 명령', 'pwd 어디, ls 뭐가, cd 이동 · 에러는 힌트, Tab 은 자동완성'] },
{ id: 'T1', ch: 1, n: 1, draft: true, title: '어디 있나, 뭐가 있나, 이동', mode: 'text', tutorSummary: 'pwd ls cd. 절대 경로(/부터)와 상대 경로(지금 폴더 기준), . .. ~. cd 뒤에 아무것도 없으면 홈.', pages: TODO('pwd/ls(-l -a)/cd, 절대·상대 경로 그림, . .. ~, 자주 나는 에러(No such file or directory)'), summary: ['pwd 어디, ls 뭐가, cd 이동', '절대 경로는 /부터, 상대 경로는 지금 폴더부터', '..은 위 폴더, ~는 홈'] },
{ id: 'T2', ch: 1, n: 2, draft: true, title: '만들고 복사하고 옮기고 지우기', mode: 'text', tutorSummary: 'mkdir(-p) touch cp(-r) mv rm(-r). rm은 휴지통이 없어 되돌릴 수 없음을 강조. mv는 이름 바꾸기에도 쓴다.', pages: TODO('mkdir touch cp mv rm, mv로 이름 바꾸기, rm 경고(되돌릴 수 없음), -r 의미'), summary: ['mkdir 폴더, touch 빈 파일', 'cp 복사, mv 옮기기·이름 바꾸기', 'rm은 되돌릴 수 없다 — 폴더는 -r'] },
{ id: 'T3', ch: 1, n: 3, draft: true, title: '파일 안 보기와 쓰기', mode: 'text', tutorSummary: 'cat head tail echo, 리다이렉션 > (덮어쓰기) >> (이어 쓰기). edit 가상 편집기.', pages: TODO('cat/head/tail, echo > >> 차이 그림, edit 편집기 소개'), summary: ['cat 전체, head 앞, tail 뒤', '>는 덮어쓰기, >>는 이어 쓰기', '긴 글은 edit로'] },
{ id: 'T4', ch: 1, n: 4, draft: true, title: '찾기', mode: 'text', tutorSummary: 'find -name 으로 파일 이름 찾기, grep(-n -i -r)으로 내용 찾기, 와일드카드 *.', pages: TODO('find/grep, 와일드카드 *, -r 재귀, 결과 읽기'), summary: ['이름은 find, 내용은 grep', '*는 아무 글자나', '-r은 하위 폴더까지'] },
{ id: 'T5', ch: 1, n: 5, draft: true, title: '조합', mode: 'text', tutorSummary: '파이프 |로 명령 잇기, wc, history, 환경변수 $HOME 맛보기, Tab 자동완성과 ↑ 히스토리.', pages: TODO('파이프 그림(왼쪽 출력 → 오른쪽 입력), wc -l, history, $HOME, Tab/↑'), summary: ['|는 왼쪽 결과를 오른쪽에 넘긴다', 'wc -l 줄 수', 'Tab으로 자동완성, ↑로 이전 명령'] },
{ id: 'TB1', ch: 1, boss: true, title: '보스: 엉망인 프로젝트 폴더 정리', mode: 'text', pages: [], summary: [], tutorSummary: '미션형 보스. 어지러운 폴더를 지정된 구조(src/ docs/ data/)로 옮기고, 특정 단어(TODO)가 든 파일을 찾아 notes.txt에 이름을 적는다. grader:state 로 최종 트리·파일 내용 비교.' },
// ================= 챕터 B Git 기초 =================
{ id: 'T6', ch: 2, n: 6, draft: true, title: '버전 관리가 왜 필요한가', mode: 'text', tutorSummary: '최종_진짜최종.py 이야기. 스냅샷을 남기고 언제든 돌아갈 수 있는 것이 버전 관리. Git(내 컴퓨터의 도구)과 GitHub(저장소를 올려 두는 사이트)의 차이.', pages: TODO('최종_진짜최종 그림, 스냅샷 개념, Git vs GitHub 표'), summary: ['버전 관리 = 시점마다 스냅샷', 'Git은 도구, GitHub은 보관·공유 사이트', '스냅샷 하나가 커밋'] },
{ id: 'T7', ch: 2, n: 7, draft: true, title: 'init, add, commit, status', mode: 'text', tutorSummary: '3칸 상태(작업 폴더 → 스테이징 → 저장소). git init 으로 시작, add 로 스테이징, commit -m 으로 기록, status 로 어느 칸에 있는지 보기. 3칸 상태 뷰를 항상 켜 둔다.', pages: TODO('3칸 그림, init/add/commit/status 순서, status 출력 읽기(untracked / staged / modified)'), summary: ['작업 폴더 → add → 스테이징 → commit → 저장소', 'status는 지금 어느 칸에 뭐가 있는지', '커밋에는 메시지가 꼭 필요'] },
{ id: 'T8', ch: 2, n: 8, draft: true, title: 'log와 diff, 커밋 메시지', mode: 'text', tutorSummary: 'log(--oneline)로 역사 보기, diff(작업↔스테이징)와 diff --staged(스테이징↔마지막 커밋). 좋은 메시지: 무엇을 왜, 50자 안에.', pages: TODO('log 읽기, diff 두 종류 그림, 메시지 좋은 예/나쁜 예'), summary: ['log는 커밋 목록, --oneline은 한 줄씩', 'diff는 아직 add 안 한 변화, --staged는 add 한 변화', '메시지는 무엇을·왜'] },
{ id: 'T9', ch: 2, n: 9, draft: true, title: '되돌리기', mode: 'text', tutorSummary: 'restore(파일 되돌리기), restore --staged(스테이징 빼기), reset --soft/--mixed/--hard HEAD~n 3종과 "무엇을 잃는가" 표. hard는 작업 내용을 잃는다.', pages: TODO('무엇을 잃는가 표, restore vs reset, HEAD~1 의미'), summary: ['restore 파일, restore --staged 칸 빼기', 'reset --soft 커밋만, --mixed 스테이징까지, --hard 작업까지', '--hard는 되돌릴 수 없다'] },
{ id: 'T10', ch: 2, n: 10, draft: true, title: '.gitignore와 올리면 안 되는 것', mode: 'text', tutorSummary: '.gitignore 패턴(*.log, __pycache__/, .env), 비밀키·빌드 산출물·큰 데이터는 올리지 않는다. 이미 올린 비밀키는 지워도 역사에 남는다.', pages: TODO('.gitignore 문법 3가지, 올리면 안 되는 것 표, 이미 커밋한 비밀키 이야기'), summary: ['.gitignore에 적으면 Git이 무시', '비밀키·빌드 결과·큰 파일은 올리지 않기', '한 번 커밋한 건 역사에 남는다'] },
{ id: 'TB2', ch: 2, boss: true, draft: true, title: '보스: 의미 있는 커밋 3개', mode: 'text', pages: [], summary: [], tutorSummary: '미션형 보스. 주어진 폴더를 저장소로 만들고 변경을 의미 단위 3개의 커밋으로 나눠 기록(.gitignore 포함). grader:state 로 커밋 수·각 커밋의 파일 집합·무시 파일 확인.' },
// ================= 챕터 C 브랜치와 협업 =================
{ id: 'T11', ch: 3, n: 11, draft: true, title: '원격과 로컬', mode: 'text', tutorSummary: 'remote add origin, push -u origin main, pull, clone. 원격 저장소 보기 탭(가짜 GitHub 화면). 로컬과 원격은 별개이고 push/pull로 맞춘다.', pages: TODO('로컬↔원격 그림, remote/push/pull/clone, 가짜 GitHub 탭 소개'), summary: ['원격은 GitHub에 있는 복사본', 'push 올리기, pull 내려받기', 'clone은 처음 통째로 받기'] },
{ id: 'T12', ch: 3, n: 12, draft: true, title: '브랜치는 라벨이다', mode: 'text', tutorSummary: 'branch(목록·-d), switch(-c), checkout 호환. 브랜치는 커밋을 가리키는 라벨일 뿐, HEAD는 지금 있는 라벨. 커밋 그래프 패널에서 라벨이 움직이는 모습.', pages: TODO('라벨 그림, branch/switch -c, HEAD, 커밋하면 라벨이 따라온다'), summary: ['브랜치 = 커밋을 가리키는 라벨', 'switch -c 새 라벨 만들고 이동', 'HEAD는 지금 서 있는 곳'] },
{ id: 'T13', ch: 3, n: 13, draft: true, title: 'merge와 충돌', mode: 'text', tutorSummary: 'fast-forward vs 3-way 병합 그림. 같은 파일 같은 줄을 양쪽에서 바꾸면 충돌: <<<<<<< ======= >>>>>>> 마커를 edit로 고치고 add·commit. 충돌 편집창의 내 것/상대 것 버튼.', pages: TODO('ff vs 3-way 그림, 충돌 마커 읽기, 해소 절차 3단계'), summary: ['merge는 두 라벨을 합치기', '갈라진 뒤 합치면 병합 커밋이 생긴다', '충돌은 마커를 고치고 add·commit'] },
{ id: 'T14', ch: 3, n: 14, draft: true, title: 'stash와 rebase 맛보기', mode: 'text', tutorSummary: 'stash(push/pop)로 작업 잠시 치우기. rebase는 내 커밋을 다른 가지 끝으로 옮겨 붙이기(기본만). merge와 rebase 결과 그래프 차이.', pages: TODO('stash 서랍 그림, rebase 전후 그래프, 언제 쓰나'), summary: ['stash는 작업을 서랍에 잠시', 'rebase는 커밋을 옮겨 붙여 역사를 일직선으로', '공유한 커밋은 rebase하지 않기'] },
{ id: 'T15', ch: 3, n: 15, draft: true, title: '실수 복구 시나리오 5개', mode: 'text', tutorSummary: '잘못된 브랜치에 커밋(cherry-pick 없이 branch+reset), 메시지 오타(commit --amend), 파일 실수로 삭제(restore), 비밀키 커밋(역사에 남음·키 폐기), 충돌 중 포기(merge --abort).', pages: TODO('시나리오 5개 각각 "상황 → 명령 → 확인"'), summary: ['--amend는 마지막 커밋 메시지 고치기', '지운 파일은 restore로', '충돌이 무서우면 merge --abort'] },
{ id: 'T16', ch: 3, n: 16, draft: true, title: '협업 흐름과 실제 GitHub', mode: 'text', tutorSummary: 'fork → 브랜치 → PR → 리뷰 → merge 개념. 실제 GitHub에서 할 일 체크리스트(계정·저장소·토큰·첫 push). 실행 없는 체크리스트형 페이지.', pages: TODO('협업 흐름 그림, 실제 GitHub 체크리스트(체크 상태는 lessons[]에 저장)'), summary: ['PR은 "내 브랜치를 합쳐 주세요" 요청', '리뷰 뒤 merge', '실제 GitHub은 체크리스트대로'] },
{ id: 'TB3', ch: 3, boss: true, draft: true, title: '보스: 충돌 해결하고 푸시', mode: 'text', pages: [], summary: [], tutorSummary: '미션형 보스. 동료가 origin에 푸시한 커밋(시뮬레이션)과 같은 파일을 고쳐 충돌을 해결하고, 깨끗한 히스토리(병합 커밋 1개)로 push. grader:state 로 원격 브랜치 상태·충돌 마커 없음·커밋 수 확인.' },
// ================= 챕터 D 실전 (EXPANSION 9절 ②) + 보너스 — 뼈대 밖 =================
// TODO(C-T 뒤): { id:'TX1', ch:4, practical:true, title:'실전 1: 내 프로젝트를 GitHub 올리기 (시뮬)' }, { id:'TX2', practical:true, title:'실전 2: 동료와 2주 협업 (시뮬)' }
// TODO: 보너스 레슨 'TG' 「컴퓨터에서 이어가기」(개발 환경 가이드 체크리스트, EXPANSION 9절 삽입 주제)
];
const PROBLEMS = [
// ---------- T0 터미널이란 (본보기: 미션 2 · 명령 퀴즈 1 · 빈칸 1) ----------
{ id: 'T0P1', lesson: 'T0', type: 'mission', title: '미션: 어디, 뭐가, 들어가기', xp: 20, tags: ['경로'],
  prompt: '<p>터미널이 열렸어요. 배운 명령 세 개로 다음을 하세요.</p><ol><li><code>pwd</code>로 지금 어디 있는지 확인하고</li><li><code>ls</code>로 뭐가 있는지 본 다음</li><li><code>projects</code> 폴더 <b>안으로 들어가세요</b>.</li></ol><p>목표 목록이 하나씩 체크되면 제출하면 돼요.</p>',
  setup: { tree: T0_TREE },
  goals: [{ text: '<code>pwd</code>로 지금 위치 보기', expect: { historyIncludes: ['pwd'] } }, { text: '<code>ls</code>로 목록 보기', expect: { historyIncludes: ['ls'] } }, { text: 'projects 폴더 안에 있기', expect: { cwd: '/home/me/projects' } }],
  grader: 'state', expect: { cwd: '/home/me/projects', historyIncludes: ['pwd', 'ls'] },
  solution: 'pwd\nls\ncd projects', hints: ['세 명령을 한 줄씩 차례로 쳐요. 결과가 안 나오는 명령도 있어요', 'cd 뒤에 띄어쓰기 하고 폴더 이름. 프롬프트의 ~ 뒤가 바뀌면 들어간 거예요', 'pwd → ls → cd projects'] },
{ id: 'T0P2', lesson: 'T0', type: 'quiz', kind: 'cmd', title: '지금 어디 있지?', tags: ['경로'],
  prompt: '폴더를 여러 번 옮겨 다녔더니 지금 어디 있는지 헷갈려요. <b>지금 폴더의 전체 경로</b>를 보려면 무엇을 칠까요?',
  quiz: { opts: ['<code>pwd</code>', '<code>ls</code>', '<code>cd</code>', '<code>where</code>'], ans: 0, why: 'pwd 는 print working directory — "지금 작업 중인 폴더를 출력해" 예요. ls 는 안에 뭐가 있는지, cd 는 이동. 사실 프롬프트에도 늘 보여요.' },
  hints: ['"어디(where)" 가 아니라 "폴더(directory)" 를 출력(print)하는 명령이에요', '세 글자이고 d 로 끝나요', '첫 번째 보기'] },
{ id: 'T0P3', lesson: 'T0', type: 'fill', title: '빈칸: 터미널 장면 완성', tags: ['경로'],
  prompt: '아래는 누군가의 터미널 화면이에요. 결과를 보고 <b>어떤 명령을 쳤는지</b> 빈칸을 채우세요 (<code>$</code> 뒤가 명령, 그 아랫줄이 결과예요).',
  fill: { code: 'me@academy:~$ ___1___\n/home/me\nme@academy:~$ ___2___\nmemo.txt  notes/  projects/\nme@academy:~$ ___3___ notes\nme@academy:~/notes$ ', blanks: [{ a: ['pwd'] }, { a: ['ls'] }, { a: ['cd'] }], why: '경로가 나왔으면 pwd, 목록이 나왔으면 ls, 프롬프트의 폴더가 바뀌었으면 cd 예요. 결과의 모양으로 명령을 거꾸로 읽을 수 있어요.' },
  hints: ['첫 결과는 / 로 시작하는 전체 경로예요 — 어디 있나 묻는 명령', '둘째 결과는 파일·폴더 이름이 나란히 — 뭐가 있나 묻는 명령', '셋째는 결과 없이 프롬프트의 ~ 가 ~/notes 로 바뀌었어요 — 이동 명령'] },
{ id: 'T0P4', lesson: 'T0', type: 'mission', title: '미션: 환영 편지 읽기', xp: 25, tags: ['경로', '파일조작'],
  prompt: '<p><code>notes</code> 폴더 안에 <code>welcome.txt</code> 라는 편지가 있어요.</p><ol><li><code>notes</code> 폴더로 들어가서</li><li><code>ls</code>로 파일 이름을 확인하고</li><li><code>cat 파일이름</code> 으로 내용을 읽으세요. <code>cat</code>은 파일 내용을 화면에 그대로 보여 주는 명령이에요(다음 레슨에서 자세히).</li></ol>',
  setup: { tree: T0_TREE },
  goals: [{ text: 'notes 폴더 안에 있기', expect: { cwd: '/home/me/notes' } }, { text: '<code>ls</code>로 파일 이름 확인', expect: { historyIncludes: ['ls'] } }, { text: '<code>cat</code>으로 편지 읽기', expect: { historyIncludes: ['cat welcome.txt'] } }],
  grader: 'state', expect: { cwd: '/home/me/notes', historyIncludes: ['ls', 'cat welcome.txt'] },
  solution: 'cd notes\nls\ncat welcome.txt', hints: ['먼저 cd 로 폴더에 들어가요. 프롬프트가 ~/notes 로 바뀌어야 해요', 'ls 를 치면 welcome.txt 가 보여요. Tab 을 누르면 이름이 자동완성돼요', 'cd notes → ls → cat welcome.txt'] },
// ---------- TB1 보스: 엉망인 프로젝트 폴더 정리 ----------
{ id: 'TB1P1', lesson: 'TB1', type: 'mission', boss: true, title: '보스: 엉망인 프로젝트 폴더 정리', xp: 60, tags: ['파일조작', '찾기', '경로'],
  prompt: '<p><code>~/project</code> 폴더에 파일이 한곳에 뒤섞여 있어요. 아래 구조로 정리하고, <b>TODO</b> 라는 단어가 들어 있는 파일을 찾아 그 파일 이름을 <code>notes.txt</code> 끝에 적으세요.</p><pre>project/\n├── src/    ← .py 파일들\n├── docs/   ← README.md\n├── data/   ← data.csv\n└── notes.txt</pre><p>힌트: 내용으로 찾기는 <code>grep -r 단어 폴더</code>, 파일 끝에 한 줄 붙이기는 <code>echo 글자 &gt;&gt; 파일</code>. 챕터 A에서 배운 것 전부예요. <code>rm -r</code> 로 폴더째 지우지는 마세요.</p>',
  setup: { cwd: '/home/me/project', tree: { home: { me: { project: { 'main.py': 'from util import helper\nprint(helper())\n', 'util.py': 'def helper():\n    # TODO: 진짜 계산으로 바꾸기\n    return 42\n', 'README.md': '# 프로젝트\n', 'data.csv': 'a,b\n1,2\n', 'notes.txt': 'TODO 가 들어 있는 파일:\n' } } } } },
  goals: [
    { text: '<code>src/</code> <code>docs/</code> <code>data/</code> 폴더 만들기', expect: { dirs: ['/home/me/project/src', '/home/me/project/docs', '/home/me/project/data'] } },
    { text: '.py 파일 두 개를 <code>src/</code> 로 옮기기 (원래 자리에는 없어야)', expect: { files: { '/home/me/project/src/main.py': { includes: 'helper' }, '/home/me/project/src/util.py': { includes: 'TODO' } }, noFiles: ['/home/me/project/main.py', '/home/me/project/util.py'] } },
    { text: '<code>README.md</code> 는 <code>docs/</code> 로', expect: { files: { '/home/me/project/docs/README.md': { includes: '프로젝트' } }, noFiles: ['/home/me/project/README.md'] } },
    { text: '<code>data.csv</code> 는 <code>data/</code> 로', expect: { files: { '/home/me/project/data/data.csv': { includes: 'a,b' } }, noFiles: ['/home/me/project/data.csv'] } },
    { text: 'TODO 가 든 파일 이름을 <code>notes.txt</code> 에 적기 (원래 줄은 그대로)', expect: { files: { '/home/me/project/notes.txt': { includes: 'util.py' } } } },
  ],
  grader: 'state', expect: { dirs: ['/home/me/project/src', '/home/me/project/docs', '/home/me/project/data'], files: { '/home/me/project/src/main.py': { includes: 'helper' }, '/home/me/project/src/util.py': { includes: 'TODO' }, '/home/me/project/docs/README.md': { includes: '프로젝트' }, '/home/me/project/data/data.csv': { includes: 'a,b' }, '/home/me/project/notes.txt': { includes: 'util.py' } }, noFiles: ['/home/me/project/main.py', '/home/me/project/util.py', '/home/me/project/README.md', '/home/me/project/data.csv'] },
  forbid: ['rm -r', 'rm -rf'],
  solution: 'mkdir src docs data\nmv main.py util.py src/\nmv README.md docs/\nmv data.csv data/\ngrep -r TODO src\necho util.py >> notes.txt',
  hints: ['순서: 폴더 먼저 만들고(mkdir 는 한 번에 여러 개 가능), mv 로 옮기고, grep 으로 찾고, echo >> 로 적어요', 'mv 는 여러 파일을 한꺼번에 폴더로: mv main.py util.py src/ · 내용 찾기는 grep -r TODO . (결과 앞에 파일 이름이 나와요)', 'mkdir src docs data → mv main.py util.py src/ → mv README.md docs/ → mv data.csv data/ → grep -r TODO src → echo util.py >> notes.txt'] },
];
const DRILLS = []; // 타자 연습 없음(공통 전역 const 구조 유지)
const GUIDES = {};
