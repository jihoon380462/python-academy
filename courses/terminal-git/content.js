// courses/terminal-git/content.js — 코스 3 터미널·Git (Phase 2 → v2.3.0). **뼈대**: 레슨 제목·요지·보스 미션 설명만 있고 페이지 본문·문제는 TODO.
// 채우는 순서·규칙은 NEXT.md WP-B, 설계는 EXPANSION.md 6절. 파이썬/알고리즘 content.js 와 같은 전역 const 구조(엔진이 그대로 읽는다).
//
// 이 코스의 문제 필드(엔진 확장이 필요한 것은 ★):
//   type:'mission' ★   미션형. setup:{cwd, tree, git?, remote?}(core/runners/shell.js 머리말) · goals:[{text, expect:{...}}] (실시간 체크리스트, 명령마다 Shell.state()와 대조) · grader:'state' · expect: Grader.matchState 의 키(core/engine.js 맨 아래: cwd cwdStartsWith files dirs noFiles commits branchCommits branches noBranches head staged stagedEmpty clean noConflictMarkers tags messages lastMessage remoteBranches pushed stash forbid historyIncludes) — 셸·Git 엔진과 채점기는 v2.2.15에 구현·테스트됨(tools/test_shell.mjs 111건)
//                       — expect 에 적힌 항목만 비교(EXPANSION 6절 "채점"). 함수는 쓰지 않는다(extract.mjs 가 JSON으로 내보내 run_solutions 가 Node 셸로 검증하므로 전부 선언형). 명령 히스토리 규칙은 `forbid:['rm -rf /']` ★
//   type:'quiz'        그대로(명령 맞히기 = quiz 에 kind:'cmd' ★: "이 상태에서 ○○ 하려면?" 보기 4개가 명령어)
//   type:'parsons'     명령 순서 맞히기(parsons.solution 은 줄마다 명령 한 개, 채점은 셸로 실행해 expect 비교 ★)
//   type:'fill'        그대로(명령 빈칸)
//   레슨 pages[].example: { shell: 'mkdir a\ncd a\npwd', setup:{...} } ★ — 예제를 터미널 창에서 한 줄씩 실행해 보여 줌(파이썬 example.code 대신)
const COURSE = { id: 'terminal-git', name: '터미널·Git', runner: 'shell', bench: false,
  tutorPersona: '너는 터미널과 Git을 처음 보는 학생을 가르치는 선생님이다. 명령어는 "무엇을 하는지 → 어떻게 치는지 → 잘못 치면 어떻게 되는지" 순서로 설명한다. 실제 bash/Git 에러 문구(영문)를 그대로 보여 주고 한국어로 풀어 준다. 정답 명령을 바로 주지 말고 어느 명령 계열인지부터 짚는다.' };
const CHECKUPS = { after: {}, upto: {} };
const WEAKNESS_TAGS = ['경로', '파일조작', '찾기', '파이프', '커밋', '되돌리기', '브랜치', '병합', '원격', '충돌'];
const PLAYGROUND_BLOCKS_UPTO = null;
const CHAPTERS = [
  { ch: 1, name: '터미널', color: '#607d8b' },
  { ch: 2, name: 'Git 기초', color: '#f05033' },
  { ch: 3, name: '브랜치와 협업', color: '#6e5494' },
];
const MAP_DECOR = { 1: '🎧', 2: '📦', 3: '🌿' };
// 페이지 본문(html·example)은 TODO. 각 레슨 3페이지(개념 → 명령 → 실수와 에러) + 문제 4~5개(미션 2 + 퀴즈/빈칸/Parsons 2~3)가 목표(문제 70+).
const TODO = (t) => [{ title: '준비 중', html: `<p>TODO(WP-B): ${t}</p>` }];
const LESSONS = [
// ================= 챕터 A 터미널 =================
{ id: 'T0', ch: 1, n: 0, title: '터미널이란', minutes: 10, mode: 'text', tutorSummary: '터미널 = 글자로 컴퓨터에 명령하는 창. 왜 마우스 대신 글자인가(반복·원격·정확). 프롬프트 읽기(사용자@컴퓨터:현재폴더$).', pages: TODO('터미널이 뭔가, 프롬프트 읽는 법, 첫 명령 pwd/ls 쳐 보기 (example.shell)'), summary: ['터미널은 글자로 명령하는 창', '프롬프트 끝의 $ 뒤에 명령을 친다', '명령 결과가 바로 아래 글자로 나온다'] },
{ id: 'T1', ch: 1, n: 1, title: '어디 있나, 뭐가 있나, 이동', minutes: 20, mode: 'text', tutorSummary: 'pwd ls cd. 절대 경로(/부터)와 상대 경로(지금 폴더 기준), . .. ~. cd 뒤에 아무것도 없으면 홈.', pages: TODO('pwd/ls(-l -a)/cd, 절대·상대 경로 그림, . .. ~, 자주 나는 에러(No such file or directory)'), summary: ['pwd 어디, ls 뭐가, cd 이동', '절대 경로는 /부터, 상대 경로는 지금 폴더부터', '..은 위 폴더, ~는 홈'] },
{ id: 'T2', ch: 1, n: 2, title: '만들고 복사하고 옮기고 지우기', minutes: 20, mode: 'text', tutorSummary: 'mkdir(-p) touch cp(-r) mv rm(-r). rm은 휴지통이 없어 되돌릴 수 없음을 강조. mv는 이름 바꾸기에도 쓴다.', pages: TODO('mkdir touch cp mv rm, mv로 이름 바꾸기, rm 경고(되돌릴 수 없음), -r 의미'), summary: ['mkdir 폴더, touch 빈 파일', 'cp 복사, mv 옮기기·이름 바꾸기', 'rm은 되돌릴 수 없다 — 폴더는 -r'] },
{ id: 'T3', ch: 1, n: 3, title: '파일 안 보기와 쓰기', minutes: 20, mode: 'text', tutorSummary: 'cat head tail echo, 리다이렉션 > (덮어쓰기) >> (이어 쓰기). edit 가상 편집기.', pages: TODO('cat/head/tail, echo > >> 차이 그림, edit 편집기 소개'), summary: ['cat 전체, head 앞, tail 뒤', '>는 덮어쓰기, >>는 이어 쓰기', '긴 글은 edit로'] },
{ id: 'T4', ch: 1, n: 4, title: '찾기', minutes: 20, mode: 'text', tutorSummary: 'find -name 으로 파일 이름 찾기, grep(-n -i -r)으로 내용 찾기, 와일드카드 *.', pages: TODO('find/grep, 와일드카드 *, -r 재귀, 결과 읽기'), summary: ['이름은 find, 내용은 grep', '*는 아무 글자나', '-r은 하위 폴더까지'] },
{ id: 'T5', ch: 1, n: 5, title: '조합', minutes: 20, mode: 'text', tutorSummary: '파이프 |로 명령 잇기, wc, history, 환경변수 $HOME 맛보기, Tab 자동완성과 ↑ 히스토리.', pages: TODO('파이프 그림(왼쪽 출력 → 오른쪽 입력), wc -l, history, $HOME, Tab/↑'), summary: ['|는 왼쪽 결과를 오른쪽에 넘긴다', 'wc -l 줄 수', 'Tab으로 자동완성, ↑로 이전 명령'] },
{ id: 'TB1', ch: 1, boss: true, title: '보스: 엉망인 프로젝트 폴더 정리', minutes: 30, mode: 'text', pages: [], summary: [], tutorSummary: '미션형 보스. 어지러운 폴더를 지정된 구조(src/ docs/ data/)로 옮기고, 특정 단어가 든 파일을 찾아 notes.txt에 이름을 적는다. grader:state 로 최종 트리·파일 내용 비교.' },
// ================= 챕터 B Git 기초 =================
{ id: 'T6', ch: 2, n: 6, title: '버전 관리가 왜 필요한가', minutes: 10, mode: 'text', tutorSummary: '최종_진짜최종.py 이야기. 스냅샷을 남기고 언제든 돌아갈 수 있는 것이 버전 관리. Git(내 컴퓨터의 도구)과 GitHub(저장소를 올려 두는 사이트)의 차이.', pages: TODO('최종_진짜최종 그림, 스냅샷 개념, Git vs GitHub 표'), summary: ['버전 관리 = 시점마다 스냅샷', 'Git은 도구, GitHub은 보관·공유 사이트', '스냅샷 하나가 커밋'] },
{ id: 'T7', ch: 2, n: 7, title: 'init, add, commit, status', minutes: 25, mode: 'text', tutorSummary: '3칸 상태(작업 폴더 → 스테이징 → 저장소). git init 으로 시작, add 로 스테이징, commit -m 으로 기록, status 로 어느 칸에 있는지 보기. 3칸 상태 뷰를 항상 켜 둔다.', pages: TODO('3칸 그림, init/add/commit/status 순서, status 출력 읽기(untracked / staged / modified)'), summary: ['작업 폴더 → add → 스테이징 → commit → 저장소', 'status는 지금 어느 칸에 뭐가 있는지', '커밋에는 메시지가 꼭 필요'] },
{ id: 'T8', ch: 2, n: 8, title: 'log와 diff, 커밋 메시지', minutes: 20, mode: 'text', tutorSummary: 'log(--oneline)로 역사 보기, diff(작업↔스테이징)와 diff --staged(스테이징↔마지막 커밋). 좋은 메시지: 무엇을 왜, 50자 안에.', pages: TODO('log 읽기, diff 두 종류 그림, 메시지 좋은 예/나쁜 예'), summary: ['log는 커밋 목록, --oneline은 한 줄씩', 'diff는 아직 add 안 한 변화, --staged는 add 한 변화', '메시지는 무엇을·왜'] },
{ id: 'T9', ch: 2, n: 9, title: '되돌리기', minutes: 25, mode: 'text', tutorSummary: 'restore(파일 되돌리기), restore --staged(스테이징 빼기), reset --soft/--mixed/--hard HEAD~n 3종과 "무엇을 잃는가" 표. hard는 작업 내용을 잃는다.', pages: TODO('무엇을 잃는가 표, restore vs reset, HEAD~1 의미'), summary: ['restore 파일, restore --staged 칸 빼기', 'reset --soft 커밋만, --mixed 스테이징까지, --hard 작업까지', '--hard는 되돌릴 수 없다'] },
{ id: 'T10', ch: 2, n: 10, title: '.gitignore와 올리면 안 되는 것', minutes: 15, mode: 'text', tutorSummary: '.gitignore 패턴(*.log, __pycache__/, .env), 비밀키·빌드 산출물·큰 데이터는 올리지 않는다. 이미 올린 비밀키는 지워도 역사에 남는다.', pages: TODO('.gitignore 문법 3가지, 올리면 안 되는 것 표, 이미 커밋한 비밀키 이야기'), summary: ['.gitignore에 적으면 Git이 무시', '비밀키·빌드 결과·큰 파일은 올리지 않기', '한 번 커밋한 건 역사에 남는다'] },
{ id: 'TB2', ch: 2, boss: true, title: '보스: 의미 있는 커밋 3개', minutes: 30, mode: 'text', pages: [], summary: [], tutorSummary: '미션형 보스. 주어진 폴더를 저장소로 만들고 변경을 의미 단위 3개의 커밋으로 나눠 기록(.gitignore 포함). grader:state 로 커밋 수·각 커밋의 파일 집합·무시 파일 확인.' },
// ================= 챕터 C 브랜치와 협업 =================
{ id: 'T11', ch: 3, n: 11, title: '원격과 로컬', minutes: 25, mode: 'text', tutorSummary: 'remote add origin, push -u origin main, pull, clone. 원격 저장소 보기 탭(가짜 GitHub 화면). 로컬과 원격은 별개이고 push/pull로 맞춘다.', pages: TODO('로컬↔원격 그림, remote/push/pull/clone, 가짜 GitHub 탭 소개'), summary: ['원격은 GitHub에 있는 복사본', 'push 올리기, pull 내려받기', 'clone은 처음 통째로 받기'] },
{ id: 'T12', ch: 3, n: 12, title: '브랜치는 라벨이다', minutes: 20, mode: 'text', tutorSummary: 'branch(목록·-d), switch(-c), checkout 호환. 브랜치는 커밋을 가리키는 라벨일 뿐, HEAD는 지금 있는 라벨. 커밋 그래프 패널에서 라벨이 움직이는 모습.', pages: TODO('라벨 그림, branch/switch -c, HEAD, 커밋하면 라벨이 따라온다'), summary: ['브랜치 = 커밋을 가리키는 라벨', 'switch -c 새 라벨 만들고 이동', 'HEAD는 지금 서 있는 곳'] },
{ id: 'T13', ch: 3, n: 13, title: 'merge와 충돌', minutes: 30, mode: 'text', tutorSummary: 'fast-forward vs 3-way 병합 그림. 같은 파일 같은 줄을 양쪽에서 바꾸면 충돌: <<<<<<< ======= >>>>>>> 마커를 edit로 고치고 add·commit. 충돌 편집창의 내 것/상대 것 버튼.', pages: TODO('ff vs 3-way 그림, 충돌 마커 읽기, 해소 절차 3단계'), summary: ['merge는 두 라벨을 합치기', '갈라진 뒤 합치면 병합 커밋이 생긴다', '충돌은 마커를 고치고 add·commit'] },
{ id: 'T14', ch: 3, n: 14, title: 'stash와 rebase 맛보기', minutes: 20, mode: 'text', tutorSummary: 'stash(push/pop)로 작업 잠시 치우기. rebase는 내 커밋을 다른 가지 끝으로 옮겨 붙이기(기본만). merge와 rebase 결과 그래프 차이.', pages: TODO('stash 서랍 그림, rebase 전후 그래프, 언제 쓰나'), summary: ['stash는 작업을 서랍에 잠시', 'rebase는 커밋을 옮겨 붙여 역사를 일직선으로', '공유한 커밋은 rebase하지 않기'] },
{ id: 'T15', ch: 3, n: 15, title: '실수 복구 시나리오 5개', minutes: 30, mode: 'text', tutorSummary: '잘못된 브랜치에 커밋(cherry-pick 없이 branch+reset), 메시지 오타(commit --amend), 파일 실수로 삭제(restore), 비밀키 커밋(역사에 남음·키 폐기), 충돌 중 포기(merge --abort).', pages: TODO('시나리오 5개 각각 "상황 → 명령 → 확인"'), summary: ['--amend는 마지막 커밋 메시지 고치기', '지운 파일은 restore로', '충돌이 무서우면 merge --abort'] },
{ id: 'T16', ch: 3, n: 16, title: '협업 흐름과 실제 GitHub', minutes: 20, mode: 'text', tutorSummary: 'fork → 브랜치 → PR → 리뷰 → merge 개념. 실제 GitHub에서 할 일 체크리스트(계정·저장소·토큰·첫 push). 실행 없는 체크리스트형 페이지.', pages: TODO('협업 흐름 그림, 실제 GitHub 체크리스트(체크 상태는 lessons[]에 저장)'), summary: ['PR은 "내 브랜치를 합쳐 주세요" 요청', '리뷰 뒤 merge', '실제 GitHub은 체크리스트대로'] },
{ id: 'TB3', ch: 3, boss: true, title: '보스: 충돌 해결하고 푸시', minutes: 40, mode: 'text', pages: [], summary: [], tutorSummary: '미션형 보스. 동료가 origin에 푸시한 커밋(시뮬레이션)과 같은 파일을 고쳐 충돌을 해결하고, 깨끗한 히스토리(병합 커밋 1개)로 push. grader:state 로 원격 브랜치 상태·충돌 마커 없음·커밋 수 확인.' },
// ================= 챕터 D 실전 (9절 ②, Phase 2 안에 포함) + 보너스 =================
// TODO(WP-B 7단계): { id:'TX1', ch:4, practical:true, title:'실전 1: 내 프로젝트를 GitHub 올리기 (시뮬)' }, { id:'TX2', practical:true, title:'실전 2: 동료와 2주 협업 (시뮬)' }
// TODO(WP-D): 보너스 레슨 'TG' 「컴퓨터에서 이어가기」(개발 환경 가이드 체크리스트, ④ PC형 실전의 전제, EXPANSION 9절 삽입 주제)
];
const PROBLEMS = [
// TODO(WP-B 6단계): 미션 40 + 퀴즈·명령 맞히기·Parsons 30. 첫 미션 예시(형식 참고용, 엔진 지원 전까지 주석):
// { id: 'T1P1', lesson: 'T1', type: 'mission', title: '미션: 프로젝트 폴더로 들어가기', xp: 20, tags: ['경로'],
//   prompt: '<p><code>~/projects/web</code> 폴더로 이동하세요.</p>', setup: { tree: { home: { me: { projects: { web: { 'index.html': '' }, api: {} } } } } },
//   goals: [{ text: 'projects 안으로', expect: { cwdStartsWith: '/home/me/projects' } }, { text: 'web 폴더에 도착', expect: { cwd: '/home/me/projects/web' } }],
//   grader: 'state', expect: { cwd: '/home/me/projects/web' }, solution: 'cd ~/projects/web', hints: ['cd 뒤에 경로', '~는 홈(/home/me)', 'cd ~/projects/web 또는 cd projects/web'] },
];
const GUIDES = {};
