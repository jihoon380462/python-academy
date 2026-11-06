// courses/terminal-git/book.js — 터미널·Git 「교과서」 모드 데이터 (v2.10.0, 사용자 결정 2026-11-06 「2번(SQL·터미널·웹 교과서) 해」 · 「내 컴퓨터 도구로」 · 「터미널·Git 먼저」).
// 화면은 core/ui-views-book.js (파이썬 교과서와 같은 틀). 연습은 사용자의 진짜 터미널 = Windows 의 Git Bash.
// meta: 코스마다 다른 글귀 · setup: 첫 화면 「시작하기」 · lessonPages: 레슨 id → 쪽 목록 통째(content.js 의 「준비 중」 쪽 대신)
// pages: 'T0/1' → { html | rep } 기존 쪽 고쳐 쓰기(T0 은 연습용 가짜 터미널 기준이라 Git Bash 기준으로)
// v2.12.0: 파일 끝에 Git 편(GIT_PAGES → lessonPages, T6~TB3 tasks) — 진짜 git 으로 검사(check_book 이 이름·이메일·main·pull.rebase 를 환경 변수로 줌)
// tasks: 레슨 id → 「만들어 보기」 문제. 필드:
//   setup  : 준비 명령 — 붙여 넣으면 ~/terminal-study/<문제 폴더> 를 처음 상태로 만들고 그 안으로 들어간다
//   answer : 예시 답(명령) · check: 확인 명령(다 했으면 치는 것) · io:[{output}] 이렇게 나오면 성공
//   check 가 없으면 answer 의 출력이 곧 결과. run: 검사 도구만 쓰는 명령(answer 대신 출력 비교 — 화면엔 안 보임) · anyOrder: 줄 순서 무시(grep -r·find 결과는 폴더 순서대로라 컴퓨터마다 다름)
//   검증: node tools/check_book.mjs — bash 로 setup → answer → check 를 실제로 돌려 io 와 비교(HOME 은 /c/Users/me 로 보이게 바꿔 비교)
const TS = (dir, lines) => ['cd ~ && mkdir -p terminal-study && cd terminal-study', `rm -rf ${dir} && mkdir ${dir} && cd ${dir}`, ...lines].join('\n'); // 문제마다 깨끗한 연습 폴더
const TF = (name, lines) => `printf '%s\\n' ${lines.map(x => `'${x}'`).join(' ')} > ${name}`; // 파일 한 개(줄 목록)
const PLAY = TS('play', ['mkdir -p projects/web projects/api notes', TF('memo.txt', ['오늘 할 일', '- 터미널 열기', '- pwd 쳐 보기']), TF('projects/web/index.html', ['<h1>hi</h1>']), TF('notes/welcome.txt', ['터미널에 온 것을 환영해요.', '이 파일을 cat 으로 읽었다면 성공!']), TF('notes/diary.txt', ['월: 터미널 설치', '화: pwd ls cd', '수: 숙제 못 함', '목: 숙제 다 함']), 'pwd']);
const BOOK = {
  meta: {
    kicker: '🎧 터미널·Git 교과서', hero: '읽고, Git Bash 에서 직접 쳐 보기',
    heroP: '레슨은 명령어 설명이에요. 각 레슨 끝 「만들어 보기」에 문장으로 된 문제와 그 문제에 필요한 명령이 있어요. 문제마다 연습 폴더를 만드는 <b>준비 명령</b>과, 다 했는지 보는 <b>확인 명령</b>이 같이 있어요. 채점·점수·잠금은 없어요.',
    dexName: '터미널·Git 명령 도감', dexShort: '명령 도감', dexWhat: '배운 명령', dexHint: '검색해서 바로 찾기(실전은 오픈북)',
    dexExamples: '<code>cp</code>, <code>지우기</code>, <code>grep</code>, <code>파이프</code>', dexPlaceholder: '🔍 명령 찾기 — cp, 지우기, grep, 파이프 …', dexAlt: '「복사」 대신 <code>cp</code>',
    dexDocs: '명령 뒤에 <code>--help</code> 를 붙여 쳐 보거나(예: <code>ls --help</code>) bash 설명서 <a href="https://www.gnu.org/software/bash/manual/" target="_blank" rel="noopener">gnu.org/software/bash</a> · Git 설명서 <a href="https://git-scm.com/docs" target="_blank" rel="noopener">git-scm.com/docs</a>',
    dexRun: '예제는 📋 복사해서 Git Bash 에 붙여 넣으면 바로 돌아가고(시작하기 3 의 연습 폴더에서)',
    copyToast: '📋 복사했어요. Git Bash 창에서 마우스 오른쪽 → Paste (또는 Shift+Insert)', exampleLabel: '예제 명령 — 연습 폴더(~/terminal-study/play)에서 한 줄씩 쳐 보세요',
    makeIntro: 'Git Bash 를 열고, 문제마다 먼저 <b>준비 명령</b>을 붙여 넣어 그 문제용 연습 폴더를 만든 다음 직접 명령을 쳐 보세요. 다 했으면 <b>확인 명령</b>을 쳐서 결과를 비교해요. 엉망이 되면 준비 명령을 다시 붙여 넣으면 처음 상태로 돌아가요.', makeTail: 'Git 문제(레슨 6~)는 레슨 6 의 이름·이메일 설정이 먼저예요. 막히면 「필요한 명령」을 눌러 설명을 다시 보고, 그래도 막히면 맨 아래 예시 답을 펴 보세요. 명령이 달라도 확인 결과가 같으면 맞아요.',
    fileExt: '', setupLabel: '준비 명령 — 붙여 넣으면 이 문제용 폴더가 생기고 그 안으로 들어가요', answerLabel: '예시 답(명령)', needsLabel: '필요한 명령',
    checkLabel: '확인 명령 — 다 했으면 이걸 쳐 보세요', outLabel: '이렇게 나오면 성공', inLabel: '입력',
    homeNote: '<code>/c/Users/me</code> 의 <code>me</code> 자리는 내 Windows 사용자 이름이에요',
    // v2.12.1 사용자 「나중에 할 거니까 레슨 6번은 설정을 해야 한다고 강조해」 — Git 레슨마다·목차에 경고 상자
    prereq: { lessons: ['T7', 'T8', 'T9', 'T10', 'TB2', 'T11', 'T12', 'T13', 'T14', 'T15', 'T16', 'TB3'], chapters: [2, 3], ref: 'T6/2',
      title: 'Git 을 하기 전에 꼭! 레슨 6 의 「처음 한 번: 이름·이메일 설정」',
      html: '이 설정을 <b>한 번도 안 했으면</b> 이 레슨의 준비 명령과 <code>git commit</code> 이 <code>Author identity unknown</code> 에러로 <b>전부 멈춰요</b>. 컴퓨터마다 한 번만 하면 돼요(Git Bash 에 네 줄 붙여 넣기, 1분). 했는지 모르겠으면 <code>git config --global user.name</code> 을 쳐 보세요 — 내 이름이 나오면 된 거예요.',
      btn: '레슨 6 · 설정하는 쪽 보기' },
  },
  setup: {
    title: '시작하기: Git Bash 설치하고 연습 폴더 만들기',
    pages: [
      { title: '1. Git for Windows 설치하기 (Git Bash 가 같이 깔려요)', html: `<p>Windows 에 원래 있는 「명령 프롬프트」 는 명령어가 달라요. 이 교과서는 서버·Mac·리눅스와 똑같은 명령(<b>bash</b>)을 쓰는 <b>Git Bash</b> 로 연습해요. <b>Git for Windows</b> 를 설치하면 Git(챕터 2·3)과 Git Bash 가 한꺼번에 깔려요.</p>
<div class="bk-step-box"><b>① 받기</b><br>브라우저로 <a href="https://git-scm.com/downloads/win" target="_blank" rel="noopener">git-scm.com/downloads/win</a> 에 들어가 맨 위 <b>「Click here to download」</b>(64-bit Git for Windows Setup)를 눌러요. <code>Git-2.xx.x-64-bit.exe</code> 가 받아져요.</div>
<div class="bk-step-box"><b>② 설치 — 대부분 「Next」, 이 세 화면만 확인</b><br>받은 파일을 더블클릭 → 「이 앱이 디바이스를 변경할 수 있도록 허용하시겠어요?」 → <b>예</b>. 화면이 열두 개쯤 나오는데 나머지는 그대로 <b>Next</b> 를 눌러요.
<ul><li><b>Choosing the default editor used by Git</b> — 목록에서 <b>Use Visual Studio Code as Git's default editor</b> 를 골라요(VS Code 가 깔려 있을 때). 기본값 Vim 은 처음엔 빠져나오기도 어려워요.</li>
<li><b>Adjusting the name of the initial branch in new repositories</b> — <b>Override the default branch name for new repositories</b> 를 고르고 칸에 <code>main</code> 이 들어 있는지 확인. 요즘 GitHub 기본 이름과 같아져요.</li>
<li><b>Adjusting your PATH environment</b> — 가운데 <b>Git from the command line and also from 3rd-party software</b>(추천, 기본값) 그대로. 그래야 VS Code 터미널에서도 git 이 돼요.</li></ul>
마지막 <b>Install</b> → 「Completing the Git Setup Wizard」 에서 <b>Finish</b>.</div>
<div class="bk-step-box"><b>③ 잘 깔렸는지 확인</b><br><kbd>Win</kbd> 키 → <code>git bash</code> 입력 → <b>Git Bash</b> 를 열고 아래를 쳐서 <kbd>Enter</kbd>.<pre>git --version</pre><code>git version 2.xx.x.windows.1</code> 처럼 나오면 성공이에요.</div>
<details class="lp-more"><summary>Mac 이라면</summary><p>Mac 은 <b>터미널</b> 앱(응용 프로그램 → 유틸리티 → 터미널, 또는 <kbd>⌘</kbd>+<kbd>Space</kbd> → <code>terminal</code>)이 처음부터 있어요. 명령은 거의 같아요(Mac 은 zsh 지만 이 교과서의 명령은 그대로 돼요). 터미널에서 <code>git --version</code> 을 치면 「명령어 라인 개발자 도구를 설치하겠습니까?」 가 뜨는데 <b>설치</b>를 누르면 Git 이 깔려요. 이 교과서의 <code>/c/Users/me</code> 는 Mac 에서 <code>/Users/내이름</code> 이에요.</p></details>` },
      { title: '2. Git Bash 여는 세 가지 방법', html: `<div class="bk-step-box"><b>① 시작 메뉴</b><br><kbd>Win</kbd> 키 → <code>git bash</code> → <b>Git Bash</b>. 검은 창이 열리고 내 홈 폴더(<code>~</code> = <code>C:\\Users\\내이름</code>)에서 시작해요.</div>
<div class="bk-step-box"><b>② 폴더에서 바로 — 제일 많이 써요</b><br>파일 탐색기에서 원하는 폴더 안의 <b>빈 곳을 마우스 오른쪽</b> → Windows 11 은 <b>「추가 옵션 표시」</b>를 한 번 더 → <b>「Open Git Bash here」</b>. 그 폴더에서 시작해요.</div>
<div class="bk-step-box"><b>③ VS Code 안에서</b><br>VS Code 메뉴 <b>터미널(Terminal)</b> → <b>새 터미널</b>(<kbd>Ctrl</kbd>+<kbd>\`</kbd>). 아래 터미널 창 오른쪽 위 <b>+</b> 옆 <b>∨</b> → <b>Git Bash</b>.<br>늘 Git Bash 로 열리게 하려면 <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd> → <code>Terminal: Select Default Profile</code>(한국어면 「터미널: 기본 프로필 선택」) → <b>Git Bash</b>.</div>
<div class="bk-warn"><b>복사·붙여 넣기가 달라요</b><ul><li><b>붙여 넣기</b>: Git Bash 창에서 <b>마우스 오른쪽 → Paste</b>, 또는 <kbd>Shift</kbd>+<kbd>Insert</kbd>. (<kbd>Ctrl</kbd>+<kbd>V</kbd> 는 설정에 따라 안 될 수 있어요. VS Code 터미널에서는 <kbd>Ctrl</kbd>+<kbd>V</kbd> 가 돼요.)</li><li><b>복사</b>: 글자를 마우스로 <b>드래그만 해도</b> 복사돼요. 또는 <kbd>Ctrl</kbd>+<kbd>Insert</kbd>.</li><li><kbd>Ctrl</kbd>+<kbd>C</kbd> 는 터미널에서 <b>복사가 아니라 「멈춰!」</b> 예요 — 안 끝나는 명령을 멈출 때 써요.</li></ul></div>` },
      { title: '3. 연습 폴더 만들기와 안전 수칙', html: `<p>Git Bash 는 <b>진짜</b> 터미널이에요. 그래서 연습은 늘 홈 폴더 안의 <code>terminal-study</code> 폴더에서만 해요. 아래 명령을 복사해서 Git Bash 에 붙여 넣으면 레슨 예제용 폴더 <code>~/terminal-study/play</code> 가 만들어지고 그 안으로 들어가요. 마지막 줄 <code>pwd</code> 가 <code>/c/Users/내이름/terminal-study/play</code> 를 보여 주면 성공이에요.</p>
<div class="bk-warn"><b>세 가지만 지켜요</b><ul><li><code>rm</code>(지우기)으로 지운 건 <b>휴지통에 안 가요</b>. 되살릴 수 없어요. 레슨 2 에서 자세히.</li><li>모르는 명령을 인터넷에서 복사해 붙이지 않기. 특히 <code>rm -rf</code> 가 들어 있으면 한 번 더 읽기.</li><li>헷갈리면 <code>pwd</code> — 지금 어디 있는지부터 확인.</li></ul></div>
<p>예제를 이것저것 바꾸다 엉망이 되면 이 명령을 <b>다시 붙여 넣으면</b> 처음 상태로 돌아가요. 만든 폴더를 탐색기로 보고 싶으면 <code>explorer .</code> (점 하나 = 지금 폴더).</p>
<p class="muted small">「만들어 보기」 문제는 문제마다 자기 준비 명령이 따로 있어서 <code>~/terminal-study/t2-1</code> 처럼 따로 폴더를 만들어요. 예제 폴더와 섞이지 않아요.</p>`, example: { shell: PLAY, label: '연습 폴더 만들기 — 통째로 복사해서 Git Bash 에 붙여 넣으세요' } },
      { title: '4. 이 교과서 쓰는 법', html: `<ul><li><b>레슨</b> — 명령 하나하나의 설명이에요. 각 쪽 아래 <b>예제 명령</b>을 📋 복사해서 Git Bash 에 붙이거나 한 줄씩 쳐 보세요. 예제는 3단계에서 만든 <code>~/terminal-study/play</code> 에서 해요(<code>cd ~/terminal-study/play</code>).</li>
<li><b>🛠 만들어 보기</b> — 레슨 끝에 있는 문장으로 된 문제예요. 순서는 ① <b>준비 명령</b> 붙여 넣기 → ② 문제를 읽고 <b>직접</b> 명령 치기 → ③ <b>확인 명령</b>을 쳐서 「이렇게 나오면 성공」 과 비교.</li>
<li><b>필요한 명령</b> — 그 문제에 쓰는 명령과 설명 쪽 링크예요. 눌러서 보고 「← 돌아가기」 로 돌아와요.</li>
<li><b>📚 명령 도감</b> — 배운 명령을 한곳에 모았어요. 실전은 오픈북이에요. 외우지 말고 찾아 쓰세요.</li>
<li>결과에 보이는 <code>/c/Users/me</code> 의 <code>me</code> 는 사람마다 내 Windows 사용자 이름으로 나와요. 그 부분은 달라도 돼요.</li></ul>
<p>채점·점수·잠금은 없어요. 아는 레슨은 건너뛰고, 필요한 곳부터 펴 보면 돼요.</p>
<div class="bk-warn"><b>⚠ 챕터 2·3(Git) 을 시작하기 전에 꼭: 레슨 6 의 「처음 한 번: 이름·이메일 설정」</b><br>안 하면 Git 레슨의 준비 명령과 커밋이 <code>Author identity unknown</code> 에러로 전부 멈춰요. 컴퓨터마다 한 번만, 1분이면 돼요.</div>
<p><b>챕터 2·3(Git)</b> 은 진짜 Git 으로 연습해요. push·pull 연습은 내 컴퓨터 안의 폴더(<code>remote.git</code>)를 GitHub 대신 쓰고, 진짜 GitHub 는 레슨 16 에서 해요. 결과의 커밋 해시(<code>3f2a1c9</code> 같은 7글자)는 컴퓨터마다 달라서, 확인 명령은 메시지만 보여 줘요.</p>` },
    ],
  },
  // T0 은 연습용 가짜 터미널 기준으로 쓰였던 쪽 — Git Bash 기준으로 고쳐 씀
  pages: {
    'T0/0': { rep: [['<p>이 코스의 터미널은 <b>연습용 가짜</b>예요. 가상 폴더 위에서 돌아가니 무엇을 지워도 진짜 컴퓨터는 멀쩡해요. 마음껏 틀려 보세요.</p>', '<p>이 교과서는 <b>진짜 터미널</b>(Windows 의 <b>Git Bash</b>)에서 연습해요. 진짜라서 지운 파일은 휴지통에 가지 않아요 — 그래서 연습은 늘 <code>~/terminal-study</code> 폴더 안에서만 해요(🛠 시작하기 3). 그 안에서는 마음껏 틀려 보세요.</p>']] },
    'T0/1': { html: `<p>Git Bash 를 열면 이런 두 줄이 기다리고 있어요. 이걸 <b>[[프롬프트]]</b>라고 해요 — "명령을 치세요"라는 신호예요.</p>
<pre class="code">me@DESKTOP-7Q2K MINGW64 ~/terminal-study/play (main)
$ </pre>
<ul><li><code>me</code> — 지금 로그인한 <b>사용자</b> 이름(내 Windows 사용자 이름)</li><li><code>DESKTOP-7Q2K</code> — <b>컴퓨터</b> 이름 (@ 앞은 누가, 뒤는 어디서)</li><li><code>MINGW64</code> — 「Git Bash 예요」 라는 표시. 신경 안 써도 돼요</li><li><code>~/terminal-study/play</code> — <b>지금 있는 폴더</b>. <code>~</code>는 내 홈 폴더(<code>/c/Users/me</code> = <code>C:\\Users\\me</code>)의 줄임말이에요</li><li><code>(main)</code> — Git 저장소 안에 있을 때만 보이는 <b>브랜치</b> 이름. 챕터 2 에서 배워요</li><li><code>$</code> — 여기부터가 내 차례. <b>$ 뒤에 명령을 치고 Enter</b></li></ul>
<p>명령을 치면 결과가 바로 아랫줄에 글자로 나오고, 다시 프롬프트가 나타나요. "결과가 없으면 성공"인 명령도 많아요(예: 폴더 이동). 조용하면 잘 된 거예요.</p>
<p>프롬프트의 폴더 이름은 <b>내가 어디 있는지</b>를 늘 알려 줘요. 길을 잃었다 싶으면 먼저 프롬프트를 보세요.</p>
<p class="muted small">Mac 터미널은 한 줄로 <code>me@MacBook play %</code> 처럼 보여요. <code>$</code> 대신 <code>%</code> 일 뿐 뜻은 같아요.</p>` },
    'T0/2': { example: { shell: 'cd ~/terminal-study/play\npwd\nls\nls projects\ncd projects\npwd\nls\ncd\npwd' }, rep: [['오른쪽 예제의 <b>다음 줄 실행 ▶</b>를 누르며 결과와 파일 트리가 어떻게 바뀌는지 보세요.', 'Git Bash 에서 <code>cd ~/terminal-study/play</code> 로 연습 폴더(시작하기 3)에 들어간 다음, 아래 예제를 <b>한 줄씩</b> 쳐 보세요.'], ['예제를 다 돌린 뒤 입력줄에 직접', '예제를 다 친 뒤 직접'], ['<code>cd</code> 뒤에 아무것도 안 쓰면 홈으로 돌아가요.', '<code>cd</code> 뒤에 아무것도 안 쓰면 홈(<code>~</code>)으로 돌아가요. 예제 마지막의 <code>cd</code> 다음 <code>pwd</code> 는 <code>/c/Users/me</code> 를 보여 줘요.']] },
    'T0/3': { rep: [['me@academy:~$ cd porjects', '$ cd porjects'], ['이 연습 터미널은 에러 아래에 한국어 풀이도 같이 보여 줘요.', '에러는 영어지만 모양이 몇 가지 안 돼요. 자주 보는 것은 레슨 1 의 마지막 쪽에 모아 뒀어요.'], ['이제 문제로 가요. 첫 미션은 "어디 있는지 보고, 뭐가 있는지 보고, 폴더로 들어가기" — 방금 배운 세 명령 그대로예요.', '이제 「🛠 만들어 보기」로 가요. 첫 문제는 "어디 있는지 보고, 뭐가 있는지 보고, 폴더로 들어가기" — 방금 배운 세 명령 그대로예요.']] },
  },
  titles: {},
  lessonPages: {
    T1: [
      { title: '경로: 폴더의 주소', html: `<p>컴퓨터의 폴더는 나무처럼 생겼어요. 맨 꼭대기(뿌리)에서 가지를 따라 내려가면 어떤 파일이든 닿아요. 그 길을 <code>/</code> 로 이어 적은 것이 <b>경로</b>예요.</p>
<pre class="code">/c/Users/me/terminal-study/play/
├── memo.txt
├── notes/
│   ├── diary.txt
│   └── welcome.txt
└── projects/
    ├── api/
    └── web/
        └── index.html</pre>
<ul><li><code>/c</code> — Git Bash 에서는 <b>C 드라이브</b>를 이렇게 적어요(탐색기의 <code>C:\\</code>). D 드라이브는 <code>/d</code>.</li><li>Windows 탐색기는 <code>\\</code>, 터미널은 <code>/</code> 로 폴더를 나눠요. 같은 곳이에요: <code>C:\\Users\\me</code> = <code>/c/Users/me</code></li><li><code>~</code> — 내 <b>홈 폴더</b>(<code>/c/Users/me</code>)의 줄임말. <code>~/terminal-study</code> 는 <code>/c/Users/me/terminal-study</code></li></ul>
<p><code>/</code> 로 시작하는(또는 <code>~</code> 로 시작하는) 경로는 <b>절대 경로</b>예요. 지금 어디 있든 같은 곳을 가리켜요.</p>`, example: { shell: 'cd ~/terminal-study/play\npwd\ncd /c/Users\npwd\ncd ~\npwd' } },
      { title: 'ls 더 보기: -a · -l · 폴더 지정', html: `<p><code>ls</code> 뒤에 <b>옵션</b>(빼기 <code>-</code> 로 시작하는 글자)을 붙이면 다르게 보여 줘요. 옵션은 명령과 대상 사이에 써요.</p>
<table class="kb"><tbody><tr><td><code>ls</code></td><td>지금 폴더 목록. Git Bash 는 폴더 끝에 <code>/</code> 를 붙여 보여 줘요</td></tr><tr><td><code>ls notes</code></td><td>notes 폴더 <b>안</b> 목록 (들어가지 않고 보기)</td></tr><tr><td><code>ls -a</code></td><td><b>숨은 파일까지</b>(all). 이름이 <code>.</code> 으로 시작하면 숨은 파일이에요. <code>./</code> 는 지금 폴더, <code>../</code> 는 위 폴더</td></tr><tr><td><code>ls -l</code></td><td><b>자세히</b>(long) — 한 줄에 하나씩, 크기와 고친 날짜까지</td></tr><tr><td><code>ls -la</code></td><td>옵션은 붙여 써도 돼요 = <code>ls -l -a</code></td></tr></tbody></table>
<pre class="code">$ ls -l
-rw-r--r-- 1 me 197121  52 Nov  6 10:12 memo.txt
drwxr-xr-x 1 me 197121   0 Nov  6 10:12 notes/
drwxr-xr-x 1 me 197121   0 Nov  6 10:12 projects/</pre>
<p>맨 앞 글자가 <code>d</code> 면 폴더(directory), <code>-</code> 면 파일이에요. 가운데 숫자 <code>52</code> 가 크기(바이트), 그 뒤가 고친 날짜예요. 나머지는 지금은 몰라도 돼요.</p>`, example: { shell: 'ls\nls notes\nls -a\nls -l\nls -la projects' } },
      { title: '상대 경로와 . · .. · ~', html: `<p><code>/</code> 없이 시작하는 경로는 <b>상대 경로</b> — "<b>지금 폴더에서부터</b>" 라는 뜻이에요. <code>play</code> 에 있을 때 <code>cd projects/web</code> 는 "여기서 projects 로, 거기서 web 으로" 예요. 한 번에 여러 칸을 내려갈 수 있어요.</p>
<table class="kb"><tbody><tr><td><code>.</code></td><td>지금 폴더</td></tr><tr><td><code>..</code></td><td>한 칸 <b>위</b> 폴더. <code>../..</code> 는 두 칸 위</td></tr><tr><td><code>~</code></td><td>홈 폴더. <code>cd</code> 만 쳐도 홈으로 가요</td></tr><tr><td><code>cd -</code></td><td>바로 <b>전에 있던</b> 폴더로 돌아가기 (TV 리모컨의 「이전 채널」)</td></tr></tbody></table>
<p>옆 폴더로 건너갈 땐 위로 한 칸 올라갔다 내려와요. <code>projects/web</code> 에서 <code>projects/api</code> 로: <code>cd ../api</code>.</p>
<pre class="code">$ cd projects/web
$ pwd
/c/Users/me/terminal-study/play/projects/web
$ cd ../api
$ pwd
/c/Users/me/terminal-study/play/projects/api</pre>
<p>절대 경로는 「주소 전체」, 상대 경로는 「여기서 몇 칸」. 같은 곳을 두 가지로 말할 수 있어요.</p>`, example: { shell: 'cd ~/terminal-study/play\ncd projects/web\npwd\ncd ../api\npwd\ncd ../..\npwd\ncd -' } },
      { title: '자주 보는 에러와 띄어쓰기 있는 이름', html: `<table class="kb"><tbody><tr><td><code>No such file or directory</code></td><td>그런 파일·폴더가 <b>없어요</b>. 오타이거나 지금 다른 폴더에 있어요 → <code>pwd</code> 와 <code>ls</code> 로 확인</td></tr><tr><td><code>Not a directory</code></td><td>파일인데 폴더처럼 <code>cd</code> 했어요 (<code>cd memo.txt</code>)</td></tr><tr><td><code>command not found</code></td><td>그런 <b>명령</b>이 없어요. 명령 이름 오타(<code>pdw</code>)이거나 설치 안 된 프로그램</td></tr><tr><td><code>too many arguments</code></td><td>대상이 여러 개로 읽혔어요 — 이름에 띄어쓰기가 있을 때 자주 나요</td></tr></tbody></table>
<p>터미널은 <b>띄어쓰기로 낱말을 나눠요</b>. 그래서 <code>cd my notes</code> 는 "my 와 notes 두 곳으로 가라" 가 돼요. 이름에 띄어쓰기가 있으면 <b>따옴표</b>로 묶어요.</p>
<pre class="code">$ cd "my notes"
$ cd my\\ notes       ← 띄어쓰기 앞에 \\ 를 붙여도 같아요</pre>
<p>제일 쉬운 방법은 <kbd>Tab</kbd> — <code>cd my</code> 까지 치고 <kbd>Tab</kbd> 을 누르면 알아서 <code>my\\ notes/</code> 로 채워 줘요. 그래서 폴더 이름은 처음부터 띄어쓰기 없이(<code>my-notes</code>, <code>my_notes</code>) 짓는 게 편해요.</p>
<p>지금 폴더를 Windows 탐색기로 열고 싶으면 <code>explorer .</code> 예요.</p>`, example: { shell: 'cd ~/terminal-study/play\ncd porjects\ncd memo.txt\npdw\nexplorer .' } },
    ],
    T2: [
      { title: 'mkdir · touch: 폴더와 빈 파일 만들기', html: `<table class="kb"><tbody><tr><td><code>mkdir 이름</code></td><td>폴더 만들기 (make directory). <code>mkdir a b c</code> 처럼 한 번에 여러 개도</td></tr><tr><td><code>mkdir -p 길/깊은/폴더</code></td><td>중간 폴더가 없어도 <b>한 번에 다</b> 만들기(parents). 이미 있어도 에러가 안 나요</td></tr><tr><td><code>touch 파일</code></td><td>빈 파일 만들기. 이미 있으면 내용은 그대로 두고 고친 시각만 바꿔요</td></tr></tbody></table>
<pre class="code">$ mkdir 2026/11
mkdir: cannot create directory '2026/11': No such file or directory
$ mkdir -p 2026/11
$ ls 2026
11/</pre>
<p>위에서 첫 <code>mkdir</code> 은 <code>2026</code> 폴더가 아직 없어서 실패했어요. <code>-p</code> 를 붙이면 <code>2026</code> 부터 만들어 줘요.</p>
<p>만들기 명령은 성공하면 <b>아무 말도 안 해요</b>. <code>ls</code> 로 확인하는 습관을 들이세요.</p>`, example: { shell: 'cd ~/terminal-study/play\nmkdir photos\nmkdir -p 2026/11/06\ntouch photos/a.jpg photos/b.jpg\nls photos\nls 2026/11' } },
      { title: 'cp: 복사하기 (폴더는 -r)', html: `<p><code>cp 원본 복사본</code> — 순서는 늘 <b>「무엇을」 → 「어디로」</b> 예요.</p>
<table class="kb"><tbody><tr><td><code>cp memo.txt backup.txt</code></td><td>memo.txt 를 backup.txt 라는 <b>새 이름</b>으로 복사</td></tr><tr><td><code>cp memo.txt notes/</code></td><td>notes 폴더 <b>안으로</b> 같은 이름으로 복사</td></tr><tr><td><code>cp a.txt b.txt notes/</code></td><td>여러 개를 폴더로 (맨 끝이 목적지)</td></tr><tr><td><code>cp -r projects old</code></td><td><b>폴더째</b> 복사(recursive — 안의 것까지 전부). 폴더에 <code>-r</code> 을 빼면 <code>cp: -r not specified; omitting directory</code></td></tr></tbody></table>
<div class="bk-warn">복사본 이름의 파일이 <b>이미 있으면 묻지 않고 덮어써요</b>. 걱정되면 <code>cp -i</code>(interactive) — 덮어쓰기 전에 <code>overwrite 'backup.txt'?</code> 하고 물어봐요. <code>y</code> 또는 <code>n</code> 을 치고 Enter.</div>`, example: { shell: 'cd ~/terminal-study/play\ncp memo.txt backup.txt\ncp memo.txt notes/\ncp -r projects old\nls\nls old' } },
      { title: 'mv: 옮기기와 이름 바꾸기', html: `<p><code>mv</code>(move)는 <b>옮기기</b>와 <b>이름 바꾸기</b>를 같은 명령으로 해요. 뒤에 오는 게 폴더면 옮기기, 아니면 새 이름이에요.</p>
<table class="kb"><tbody><tr><td><code>mv backup.txt notes/</code></td><td>notes 폴더 안으로 옮기기 (원래 자리에선 사라져요)</td></tr><tr><td><code>mv memo.txt todo.txt</code></td><td>이름 바꾸기 (같은 폴더 안에서 「옮기기」)</td></tr><tr><td><code>mv a.jpg b.jpg photos/</code></td><td>여러 개를 한 번에 폴더로</td></tr><tr><td><code>mv old projects-old</code></td><td>폴더도 그대로 돼요 (<code>-r</code> 필요 없음)</td></tr><tr><td><code>mv ../x.txt .</code></td><td>위 폴더의 x.txt 를 <b>지금 폴더</b>(<code>.</code>)로 가져오기</td></tr></tbody></table>
<p><code>cp</code> 와 똑같이 같은 이름이 있으면 덮어써요 — <code>mv -i</code> 면 물어봐요.</p>
<p class="muted small">탐색기에서 드래그해서 옮기는 것과 같아요. 다른 점은 파일 수십 개도 한 줄로 옮길 수 있다는 것(레슨 4 의 <code>*</code> 와 같이 쓰면).</p>`, example: { shell: 'cd ~/terminal-study/play\ntouch draft.txt\nmv draft.txt notes/\nls notes\nmv notes/draft.txt notes/final.txt\nls notes' } },
      { title: 'rm: 지우기 — 휴지통이 없어요', html: `<div class="bk-warn"><b><code>rm</code> 으로 지운 파일은 휴지통에 가지 않아요.</b> 바로 사라지고 되살릴 수 없어요. 그래서 지우기 전에 <code>ls</code> 로 무엇을 지우는지 꼭 봐요.</div>
<table class="kb"><tbody><tr><td><code>rm 파일</code></td><td>파일 지우기. 여러 개도: <code>rm a.txt b.txt</code></td></tr><tr><td><code>rm -r 폴더</code></td><td>폴더와 그 안의 것 <b>전부</b> 지우기</td></tr><tr><td><code>rmdir 폴더</code></td><td><b>빈</b> 폴더만 지우기 — 안에 뭐가 있으면 거절해요(안전)</td></tr><tr><td><code>rm -i 파일</code></td><td>하나씩 물어보고 지우기 (<code>remove regular file 'a.txt'?</code>)</td></tr></tbody></table>
<p><code>rm -rf</code> 의 <code>f</code> 는 force — "묻지도 따지지도 말고" 예요. 인터넷에서 본 명령에 <code>rm -rf</code> 가 들어 있으면 <b>뒤에 무엇이 오는지</b> 꼭 읽으세요. <code>rm -rf ~</code> 는 홈 폴더 전체, <code>rm -rf /</code> 는 컴퓨터 전체예요.</p>
<pre class="code">$ rm notes
rm: cannot remove 'notes': Is a directory
$ rmdir notes
rmdir: failed to remove 'notes': Directory not empty</pre>
<p>두 에러 다 <b>지켜 준</b> 거예요. 폴더라서, 비어 있지 않아서 거절했어요.</p>`, example: { shell: 'cd ~/terminal-study/play\ncp memo.txt backup.txt\ncp -r projects old\nls\nrm backup.txt\nrm -r old\nrm notes\nrmdir notes\nmkdir empty\nrmdir empty\nls' } },
    ],
    T3: [
      { title: 'cat · head · tail: 파일 안 보기', html: `<table class="kb"><tbody><tr><td><code>cat 파일</code></td><td>파일 내용을 <b>전부</b> 화면에. <code>cat a.txt b.txt</code> 는 둘을 이어서</td></tr><tr><td><code>cat -n 파일</code></td><td>줄 번호를 붙여서</td></tr><tr><td><code>head -n 3 파일</code></td><td><b>앞</b>에서 3줄 (숫자를 빼면 10줄)</td></tr><tr><td><code>tail -n 2 파일</code></td><td><b>뒤</b>에서 2줄. 기록(로그) 파일의 최근 내용을 볼 때</td></tr><tr><td><code>less 파일</code></td><td>긴 파일을 한 화면씩. <kbd>Space</kbd> 다음 쪽, <kbd>q</kbd> 나가기</td></tr></tbody></table>
<pre class="code">$ head -n 2 notes/diary.txt
월: 터미널 설치
화: pwd ls cd
$ tail -n 1 notes/diary.txt
목: 숙제 다 함</pre>
<p class="muted small">한글이 <code>?</code> 나 이상한 글자로 보이면 Git Bash 창 위를 마우스 오른쪽 → <b>Options</b> → <b>Text</b> → <b>Character set</b> 을 <b>UTF-8</b> 로 바꾸고 Save.</p>`, example: { shell: 'cd ~/terminal-study/play\ncat memo.txt\ncat -n notes/diary.txt\nhead -n 2 notes/diary.txt\ntail -n 1 notes/diary.txt' } },
      { title: 'echo 와 > · >>: 파일에 쓰기', html: `<p><code>echo 글자</code> 는 글자를 화면에 그대로 찍어요. 여기에 <b>화살표</b>를 붙이면 화면 대신 <b>파일로</b> 보내요. 이걸 <b>리다이렉션</b>이라고 해요.</p>
<table class="kb"><tbody><tr><td><code>echo 안녕 &gt; a.txt</code></td><td><b>새로 쓰기</b>. 파일이 없으면 만들고, <b>있으면 원래 내용을 지우고</b> 써요</td></tr><tr><td><code>echo 또 &gt;&gt; a.txt</code></td><td>끝에 <b>이어 쓰기</b>. 원래 내용은 그대로, 맨 아래 한 줄 추가</td></tr></tbody></table>
<pre class="code">$ echo 첫 줄 > hello.txt
$ echo 둘째 줄 >> hello.txt
$ cat hello.txt
첫 줄
둘째 줄
$ echo 덮어씀 > hello.txt
$ cat hello.txt
덮어씀</pre>
<div class="bk-warn"><code>&gt;</code> 하나는 <b>묻지 않고 지워요</b>. 일기장 끝에 한 줄 쓰려다 <code>&gt;</code> 를 치면 일기가 한 줄만 남아요. 「이어 쓰기는 두 개 <code>&gt;&gt;</code>」 를 꼭 기억하세요.</div>
<p>글자에 <code>!</code> <code>*</code> <code>?</code> 같은 기호나 따옴표가 있으면 <b>작은따옴표</b>로 묶어요: <code>echo '정말?! 끝!' &gt;&gt; a.txt</code></p>`, example: { shell: 'cd ~/terminal-study/play\necho 안녕\necho 첫 줄 > hello.txt\necho 둘째 줄 >> hello.txt\ncat hello.txt\necho 덮어씀 > hello.txt\ncat hello.txt' } },
      { title: '명령 결과를 파일로 남기기', html: `<p><code>&gt;</code> 와 <code>&gt;&gt;</code> 는 <code>echo</code> 만이 아니라 <b>어떤 명령 뒤에도</b> 붙어요. 화면에 나올 결과가 대신 파일로 들어가요.</p>
<table class="kb"><tbody><tr><td><code>ls &gt; list.txt</code></td><td>파일 목록을 list.txt 에 저장 (한 줄에 하나씩 들어가요)</td></tr><tr><td><code>date &gt;&gt; log.txt</code></td><td>지금 날짜·시각을 기록 끝에 추가</td></tr><tr><td><code>cat a.txt b.txt &gt; all.txt</code></td><td>두 파일을 이어 붙여 새 파일로</td></tr></tbody></table>
<p><code>ls &gt; list.txt</code> 를 하면 목록에 <code>list.txt</code> 자신도 들어 있어요. <code>&gt;</code> 가 명령을 돌리기 <b>전에</b> 파일을 먼저 만들기 때문이에요.</p>
<p>화면에 아무것도 안 나와도 놀라지 마세요 — 결과가 파일로 갔을 뿐이에요. <code>cat</code> 으로 확인해요.</p>`, example: { shell: 'cd ~/terminal-study/play\nls > list.txt\ncat list.txt\ndate >> log.txt\ndate >> log.txt\ncat log.txt\ncat memo.txt notes/welcome.txt > all.txt\ncat all.txt' } },
      { title: '긴 글은 편집기로: notepad · code', html: `<p>한두 줄은 <code>echo</code> 로 충분하지만 긴 글은 편집기가 편해요. 터미널에서 파일 이름을 주고 편집기를 열 수 있어요.</p>
<table class="kb"><tbody><tr><td><code>notepad memo.txt</code></td><td>Windows <b>메모장</b>으로 열기. 고치고 <kbd>Ctrl</kbd>+<kbd>S</kbd> 저장 → 닫으면 터미널로 돌아와요</td></tr><tr><td><code>code memo.txt</code></td><td><b>VS Code</b> 로 열기 (VS Code 설치 때 「PATH에 추가」 가 켜져 있어야 해요)</td></tr><tr><td><code>code .</code></td><td>지금 폴더를 VS Code 로 통째로 열기 — 프로젝트를 열 때 제일 많이 써요</td></tr></tbody></table>
<p>편집기에서 저장한 뒤 터미널에서 <code>cat memo.txt</code> 를 치면 바뀐 내용이 보여요. 같은 파일을 두 곳에서 보고 있는 거예요.</p>
<p class="muted small"><code>code: command not found</code> 가 나오면 VS Code 를 연 뒤 <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd> → <code>Shell Command: Install 'code' command in PATH</code>(Mac), Windows 는 VS Code 를 다시 설치하며 「PATH에 추가」 를 켜고 Git Bash 를 새로 여세요. Mac 에서 메모장 대신은 <code>open -e memo.txt</code>.</p>`, example: { shell: 'cd ~/terminal-study/play\nnotepad memo.txt\ncat memo.txt\ncode .' } },
    ],
    T4: [
      { title: '와일드카드 *: 이름 여러 개를 한 번에', html: `<p><code>*</code> 는 「<b>아무 글자나, 몇 글자든</b>」 이라는 뜻이에요. 명령이 돌기 전에 bash 가 <code>*</code> 를 실제 이름들로 바꿔 줘요.</p>
<table class="kb"><tbody><tr><td><code>ls *.txt</code></td><td>이름이 <code>.txt</code> 로 끝나는 것 전부</td></tr><tr><td><code>cp *.jpg photos/</code></td><td>jpg 전부를 photos 로 복사</td></tr><tr><td><code>rm tmp*</code></td><td>tmp 로 시작하는 것 전부 지우기 — <b>먼저 <code>ls tmp*</code> 로 무엇이 걸리는지 확인!</b></td></tr><tr><td><code>ls projects/*</code></td><td>projects 안의 모든 것</td></tr><tr><td><code>ls ?.txt</code></td><td><code>?</code> 는 <b>딱 한 글자</b> — a.txt 는 되고 ab.txt 는 안 돼요</td></tr></tbody></table>
<pre class="code">$ ls
a.txt  b.txt  c.log  photo.jpg
$ ls *.txt
a.txt  b.txt</pre>
<div class="bk-warn"><code>rm * .log</code> 처럼 띄어쓰기 하나만 잘못 들어가도 <code>*</code>(전부)와 <code>.log</code> 둘로 읽혀서 <b>폴더의 파일이 전부</b> 지워져요. <code>*</code> 와 <code>rm</code> 을 같이 쓸 땐 늘 <code>ls</code> 로 먼저.</div>`, example: { shell: 'cd ~/terminal-study/play\nls *.txt\nls notes/*\nls notes/*.txt\nls projects/*' } },
      { title: 'find: 이름으로 찾기', html: `<p><code>*</code> 는 지금 폴더 한 층만 봐요. 폴더 안의 폴더까지 <b>전부 뒤져서</b> 이름으로 찾을 땐 <code>find</code> 예요.</p>
<table class="kb"><tbody><tr><td><code>find . -name "*.txt"</code></td><td>지금 폴더(<code>.</code>)부터 아래 전부에서 이름이 *.txt 인 것</td></tr><tr><td><code>find . -name "index.html"</code></td><td>정확한 이름으로</td></tr><tr><td><code>find . -iname "*.JPG"</code></td><td>대소문자 무시(<code>-iname</code>)</td></tr><tr><td><code>find . -type d</code></td><td>폴더만 (directory). 파일만은 <code>-type f</code></td></tr><tr><td><code>find notes -name "*.txt"</code></td><td>notes 폴더 아래에서만</td></tr></tbody></table>
<pre class="code">$ find . -name "*.txt"
./memo.txt
./notes/diary.txt
./notes/welcome.txt</pre>
<p>결과는 시작한 곳(<code>.</code>)에서부터의 경로예요. <code>./notes/diary.txt</code> = 「여기 → notes → diary.txt」.</p>
<p><b>따옴표를 꼭</b> 붙여요. <code>find . -name *.txt</code> 처럼 빼면 bash 가 <code>*.txt</code> 를 지금 폴더의 이름으로 먼저 바꿔 버려서 엉뚱하게 찾거나 <code>paths must precede expression</code> 에러가 나요. 결과가 나오는 순서는 컴퓨터마다 다를 수 있어요.</p>`, example: { shell: 'cd ~/terminal-study/play\nfind . -name "*.txt"\nfind . -type d\nfind projects -type f' } },
      { title: 'grep: 내용으로 찾기', html: `<p>파일 <b>이름</b>은 find, 파일 <b>안의 글자</b>는 <code>grep</code> 이에요. 그 글자가 들어 있는 <b>줄</b>을 보여 줘요.</p>
<table class="kb"><tbody><tr><td><code>grep 숙제 notes/diary.txt</code></td><td>「숙제」 가 들어 있는 줄</td></tr><tr><td><code>grep -n 숙제 파일</code></td><td>줄 번호도 (number)</td></tr><tr><td><code>grep -i error 파일</code></td><td>대소문자 무시 (Error, ERROR 도)</td></tr><tr><td><code>grep -r 숙제 .</code></td><td>지금 폴더 아래 <b>모든 파일</b>에서 (recursive). 결과 앞에 파일 이름이 붙어요</td></tr><tr><td><code>grep -rl 숙제 .</code></td><td>줄 대신 <b>파일 이름만</b> (list)</td></tr><tr><td><code>grep -c 숙제 파일</code></td><td>몇 줄인지 <b>개수만</b> (count)</td></tr><tr><td><code>grep -v 숙제 파일</code></td><td>반대로, 안 들어 있는 줄만</td></tr></tbody></table>
<pre class="code">$ grep -n 숙제 notes/diary.txt
3:수: 숙제 못 함
4:목: 숙제 다 함
$ grep -r 숙제 .
./notes/diary.txt:수: 숙제 못 함
./notes/diary.txt:목: 숙제 다 함</pre>
<p>찾는 말에 띄어쓰기가 있으면 따옴표: <code>grep "숙제 다" 파일</code>. 못 찾으면 <b>아무것도 안 나와요</b> — 에러가 아니에요.</p>`, example: { shell: 'cd ~/terminal-study/play\ngrep 숙제 notes/diary.txt\ngrep -n 숙제 notes/diary.txt\ngrep -r 터미널 .\ngrep -rl 터미널 .\ngrep -c 숙제 notes/diary.txt' } },
      { title: '결과 읽기와 자주 하는 실수', html: `<table class="kb"><tbody><tr><td><code>./notes/diary.txt:3:수: 숙제 못 함</code></td><td><code>grep -rn</code> 결과는 <b>파일 : 줄 번호 : 그 줄</b> 이에요</td></tr><tr><td><code>grep: notes: Is a directory</code></td><td>폴더를 뒤지려면 <code>-r</code> 을 붙여야 해요</td></tr><tr><td><code>find: paths must precede expression</code></td><td><code>-name</code> 뒤의 <code>*</code> 를 따옴표로 안 묶었어요</td></tr><tr><td>아무것도 안 나옴</td><td>못 찾은 거예요. 대소문자(<code>-i</code>), 철자, 지금 폴더(<code>pwd</code>)를 확인</td></tr></tbody></table>
<p>헷갈릴 때 고르는 법:</p>
<ul><li>「이름이 ○○ 인 <b>파일</b>이 어디 있지?」 → <code>find . -name "○○"</code></li><li>「○○ 라고 <b>적힌</b> 곳이 어디지?」 → <code>grep -rn ○○ .</code></li><li>「지금 폴더의 ○○ 로 끝나는 것들」 → <code>ls *○○</code></li></ul>
<p class="muted small">VS Code 의 「폴더에서 찾기」(<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>F</kbd>)가 바로 <code>grep -rn</code> 이에요. 서버처럼 화면이 없는 곳에서도 쓸 수 있다는 게 터미널의 힘이에요.</p>`, example: { shell: 'cd ~/terminal-study/play\ngrep -rn 숙제 .\ngrep 숙제 notes\nfind . -name *.txt\ngrep 없는말 notes/diary.txt' } },
    ],
    T5: [
      { title: '파이프 |: 앞 명령의 결과를 다음 명령으로', html: `<p><code>|</code>(파이프, 키보드 <kbd>Shift</kbd>+<kbd>\\</kbd>)는 <b>왼쪽 명령의 결과</b>를 화면에 내지 않고 <b>오른쪽 명령에 넘겨요</b>. 작은 명령을 레고처럼 이어 붙이는 거예요.</p>
<pre class="code">ls  ──결과──▶  wc -l  ──▶ 화면
$ ls | wc -l
4</pre>
<table class="kb"><tbody><tr><td><code>ls | wc -l</code></td><td>파일·폴더가 <b>몇 개</b>인지</td></tr><tr><td><code>cat 파일 | grep 숙제</code></td><td>= <code>grep 숙제 파일</code> (같은 결과)</td></tr><tr><td><code>grep 숙제 파일 | wc -l</code></td><td>찾은 줄이 몇 개인지</td></tr><tr><td><code>ls -l | tail -n 3</code></td><td>긴 목록의 마지막 3줄만</td></tr><tr><td><code>a | b | c</code></td><td>몇 개든 이어 붙일 수 있어요</td></tr></tbody></table>
<p><code>&gt;</code> 는 결과를 <b>파일로</b>, <code>|</code> 는 결과를 <b>다른 명령으로</b> 보내요. 둘을 같이 써도 돼요: <code>grep 숙제 파일 | wc -l &gt; count.txt</code>.</p>`, example: { shell: 'cd ~/terminal-study/play\nls | wc -l\ncat notes/diary.txt | grep 숙제\ngrep 숙제 notes/diary.txt | wc -l\nls -la | tail -n 3' } },
      { title: 'wc · sort · uniq: 세고 줄 세우기', html: `<table class="kb"><tbody><tr><td><code>wc -l 파일</code></td><td>줄 수 (word count 의 lines). <code>-w</code> 낱말 수, <code>-c</code> 바이트 수</td></tr><tr><td><code>sort 파일</code></td><td>줄을 가나다·abc 순으로</td></tr><tr><td><code>sort -n</code></td><td><b>숫자</b> 크기 순 (안 붙이면 10 이 9 보다 앞에 와요 — 글자로 비교해서)</td></tr><tr><td><code>sort -r</code></td><td>거꾸로 (큰 것부터). <code>sort -rn</code> = 큰 숫자부터</td></tr><tr><td><code>uniq</code></td><td>바로 <b>붙어 있는</b> 같은 줄을 하나로. 그래서 보통 <code>sort | uniq</code></td></tr><tr><td><code>uniq -c</code></td><td>몇 번씩 나왔는지 <b>개수를 앞에 붙여서</b></td></tr></tbody></table>
<pre class="code">$ cat fruits.txt
사과
배
사과
귤
사과
배
$ sort fruits.txt | uniq -c | sort -rn
      3 사과
      2 배
      1 귤</pre>
<p>「무엇이 몇 번 나왔나 → 많은 순」 은 <code>sort | uniq -c | sort -rn</code> 세 단계가 공식처럼 쓰여요. 맨 위 하나만 보려면 끝에 <code>| head -n 1</code>.</p>`, example: { shell: "cd ~/terminal-study/play\nprintf '%s\\n' 사과 배 사과 귤 사과 배 > fruits.txt\nwc -l fruits.txt\nsort fruits.txt\nsort fruits.txt | uniq -c\nsort fruits.txt | uniq -c | sort -rn" } },
      { title: '손이 편해지는 키: Tab · ↑ · Ctrl+R · Ctrl+C', html: `<table class="kb"><tbody><tr><td><kbd>Tab</kbd></td><td>이름 <b>자동완성</b>. 후보가 여럿이면 <kbd>Tab</kbd> 두 번 → 후보 목록</td></tr><tr><td><kbd>↑</kbd> <kbd>↓</kbd></td><td>아까 친 명령 다시 불러오기 — 고쳐서 다시 실행할 때</td></tr><tr><td><code>history</code></td><td>지금까지 친 명령 목록(번호와 함께). <code>history | tail -n 5</code> 최근 5개</td></tr><tr><td><kbd>Ctrl</kbd>+<kbd>R</kbd></td><td>예전 명령 <b>검색</b>. 글자 몇 개 치면 그게 든 명령이 떠요 → Enter 로 실행</td></tr><tr><td><kbd>Ctrl</kbd>+<kbd>C</kbd></td><td>지금 도는 명령 <b>멈추기</b> / 치던 줄 버리기</td></tr><tr><td><kbd>Ctrl</kbd>+<kbd>A</kbd> · <kbd>Ctrl</kbd>+<kbd>E</kbd></td><td>줄의 맨 앞 · 맨 뒤로 커서</td></tr><tr><td><kbd>Ctrl</kbd>+<kbd>L</kbd> · <code>clear</code></td><td>화면 비우기</td></tr></tbody></table>
<p>명령이 끝나지 않고 커서만 깜빡이면(예: <code>cat</code> 만 치고 파일 이름을 빼먹었을 때 — 키보드 입력을 기다리는 중) 당황하지 말고 <kbd>Ctrl</kbd>+<kbd>C</kbd>.</p>
<p>줄 끝에 <code>&gt;</code> 만 보이며 다음 줄을 기다리면 따옴표를 하나만 열고 안 닫은 거예요. 이것도 <kbd>Ctrl</kbd>+<kbd>C</kbd> 하고 다시 치면 돼요.</p>`, example: { shell: 'history | tail -n 5\nclear' } },
      { title: '변수 맛보기: $HOME · $PATH · 내 변수', html: `<p>터미널에는 이름 붙은 값(<b>변수</b>)이 있어요. 이름 앞에 <code>$</code> 를 붙이면 그 값으로 바뀌어요.</p>
<table class="kb"><tbody><tr><td><code>echo $HOME</code></td><td>내 홈 폴더 (<code>~</code> 와 같은 곳)</td></tr><tr><td><code>echo $PATH</code></td><td>명령 프로그램을 찾아보는 폴더 목록(<code>:</code> 로 구분). <code>command not found</code> 는 「여기 다 뒤졌는데 없다」 는 뜻</td></tr><tr><td><code>which git</code></td><td>그 명령이 실제로 어느 파일인지</td></tr><tr><td><code>name=지훈</code></td><td>내 변수 만들기 — <b><code>=</code> 앞뒤에 띄어쓰기 없이</b></td></tr><tr><td><code>echo "안녕 $name"</code></td><td>큰따옴표 안에서는 변수가 값으로 바뀌어요. 작은따옴표 <code>'$name'</code> 은 글자 그대로</td></tr></tbody></table>
<pre class="code">$ echo $HOME
/c/Users/me
$ name=지훈
$ echo "안녕 $name"
안녕 지훈</pre>
<p>내가 만든 변수는 <b>창을 닫으면 사라져요</b>. 지금은 「<code>$</code> 가 붙으면 값으로 바뀐다」 만 알면 충분해요. 파이썬 설치 때 본 「PATH 에 추가」 가 바로 이 <code>$PATH</code> 에 폴더를 넣는 일이었어요.</p>`, example: { shell: 'echo $HOME\necho $PATH\nwhich git\nname=지훈\necho "안녕 $name"\necho \'안녕 $name\'' } },
    ],
  },
  tasks: {
    T0: [
      { title: '어디 있나 보고, 들어가기', text: '준비 명령을 붙여 넣으면 <code>t0-1</code> 폴더에 들어가 있어요. 배운 명령 세 개로 ① 지금 어디 있는지 확인하고 ② 뭐가 있는지 본 다음 ③ <code>projects</code> 폴더 <b>안으로 들어가세요</b>.',
        setup: TS('t0-1', ['mkdir -p projects/web projects/api notes', TF('memo.txt', ['오늘 할 일'])]),
        needs: [['pwd', 'T0/2', '지금 폴더의 전체 경로'], ['ls', 'T0/2', '지금 폴더 안 목록'], ['cd 폴더', 'T0/2', '그 폴더로 이동']],
        answer: 'pwd\nls\ncd projects', check: 'pwd', io: [{ output: '/c/Users/me/terminal-study/t0-1/projects' }] },
      { title: '환영 편지 읽기', text: '<code>notes</code> 폴더 안에 편지 파일이 하나 있어요. 폴더로 들어가서 파일 이름을 확인하고, <code>cat 파일이름</code> 으로 내용을 읽으세요. (<code>cat</code> 은 파일 내용을 화면에 보여 주는 명령 — 레슨 3 에서 자세히)',
        setup: TS('t0-2', ['mkdir notes', TF('notes/welcome.txt', ['터미널에 온 것을 환영해요.', '이 파일을 cat 으로 읽었다면 성공!'])]),
        needs: [['cd notes', 'T0/2', '폴더로 들어가기'], ['ls', 'T0/2', '파일 이름 확인'], ['cat 파일', 'T3/0', '파일 내용 보기'], ['Tab', 'T0/3', '이름 자동완성']],
        answer: 'cd notes\nls\ncat welcome.txt', run: 'cd notes\ncat welcome.txt', io: [{ output: '터미널에 온 것을 환영해요.\n이 파일을 cat 으로 읽었다면 성공!' }] },
    ],
    T1: [
      { title: '한 번에 깊이 들어가기', text: '<code>school</code> 폴더 안에 <code>korean/essay</code> 폴더가 있어요. <code>cd</code> 를 <b>한 번만</b> 써서 <code>essay</code> 폴더 안으로 들어가세요.',
        setup: TS('t1-1', ['mkdir -p school/math school/korean/essay', 'cd school']),
        needs: [['cd 가/나', 'T1/2', '여러 칸을 한 번에 — 상대 경로'], ['pwd', 'T0/2', '들어갔는지 확인']],
        answer: 'cd korean/essay', check: 'pwd', io: [{ output: '/c/Users/me/terminal-study/t1-1/school/korean/essay' }] },
      { title: '옆 폴더로 건너가기', text: '지금 <code>school/korean/essay</code> 안에 있어요. <code>cd</code> <b>한 번</b>으로 <code>school/math</code> 로 가세요. (두 칸 올라갔다가 math 로 내려가요)',
        setup: TS('t1-2', ['mkdir -p school/math school/korean/essay', 'cd school/korean/essay']),
        needs: [['..', 'T1/2', '한 칸 위 폴더'], ['../../math', 'T1/2', '두 칸 위로 갔다가 math 로'], ['pwd', 'T0/2', '지금 위치']],
        answer: 'cd ../../math', check: 'pwd', io: [{ output: '/c/Users/me/terminal-study/t1-2/school/math' }] },
      { title: '숨은 파일 찾아 읽기', text: '이 폴더에 이름이 점(<code>.</code>)으로 시작하는 <b>숨은 파일</b>이 하나 있어요. 그냥 <code>ls</code> 로는 안 보여요. 이름을 알아낸 다음 <code>cat</code> 으로 내용을 읽으세요.',
        setup: TS('t1-3', ['mkdir math korean', TF('.secret', ['비밀 번호는 1234 가 아니에요'])]),
        needs: [['ls -a', 'T1/1', '숨은 파일까지 보기'], ['cat 파일', 'T3/0', '내용 보기']],
        answer: 'ls -a\ncat .secret', run: 'cat .secret', io: [{ output: '비밀 번호는 1234 가 아니에요' }] },
      { title: '띄어쓰기 있는 폴더', text: '<code>art class</code> 라는, 이름에 띄어쓰기가 있는 폴더로 들어가서 <code>pwd</code> 로 확인하세요. 그냥 <code>cd art class</code> 를 치면 어떤 에러가 나는지도 먼저 보세요.',
        setup: TS('t1-4', ['mkdir "art class" music']),
        needs: [['cd "이름"', 'T1/3', '띄어쓰기 있는 이름은 따옴표'], ['Tab', 'T1/3', '자동완성이 알아서 \\ 를 붙여 줌']],
        answer: 'cd "art class"\npwd', io: [{ output: '/c/Users/me/terminal-study/t1-4/art class' }] },
    ],
    T2: [
      { title: '학기 폴더 한 줄로 만들기', text: '빈 폴더에 아래 구조를 만드세요. <code>mkdir</code> 를 <b>한 번만</b> 써 보세요.<pre class="code">2026/\n├── fall/\n└── spring/\n    ├── korean/\n    └── math/</pre>',
        setup: TS('t2-1', []),
        needs: [['mkdir -p', 'T2/0', '중간 폴더까지 한 번에'], ['mkdir a b c', 'T2/0', '여러 개를 한 번에']],
        answer: 'mkdir -p 2026/spring/math 2026/spring/korean 2026/fall', check: 'find . -type d | sort', io: [{ output: '.\n./2026\n./2026/fall\n./2026/spring\n./2026/spring/korean\n./2026/spring/math' }] },
      { title: '백업 만들기', text: '① <code>report.txt</code> 를 <code>backup.txt</code> 라는 이름으로 복사하고 ② <code>images</code> 폴더를 안의 사진까지 통째로 <code>old</code> 라는 폴더로 복사하세요. 원본은 그대로 있어야 해요.',
        setup: TS('t2-2', ['mkdir images', TF('report.txt', ['3분기 보고서']), 'touch images/cat.png']),
        needs: [['cp 원본 새이름', 'T2/1', '파일 복사'], ['cp -r', 'T2/1', '폴더째 복사']],
        answer: 'cp report.txt backup.txt\ncp -r images old', check: 'find . | sort', io: [{ output: '.\n./backup.txt\n./images\n./images/cat.png\n./old\n./old/cat.png\n./report.txt' }] },
      { title: '사진 정리하고 이름 바꾸기', text: '① <code>pics</code> 폴더를 만들고 ② jpg 파일 두 개를 그 안으로 옮기고 ③ <code>todo.txt</code> 의 이름을 <code>plan.txt</code> 로 바꾸세요.',
        setup: TS('t2-3', ['touch a.jpg b.jpg', TF('todo.txt', ['장보기'])]),
        needs: [['mkdir', 'T2/0', '폴더 만들기'], ['mv 파일들 폴더/', 'T2/2', '옮기기'], ['mv 옛이름 새이름', 'T2/2', '이름 바꾸기']],
        answer: 'mkdir pics\nmv a.jpg b.jpg pics/\nmv todo.txt plan.txt', check: 'find . -type f | sort', io: [{ output: './pics/a.jpg\n./pics/b.jpg\n./plan.txt' }] },
      { title: '필요 없는 것만 지우기', text: '<code>keep.txt</code> 만 남기고 나머지(<code>.log</code> 파일 두 개와 <code>cache</code> 폴더)를 지우세요. 지우기 전에 <code>ls</code> 로 무엇을 지울지 먼저 보세요.',
        setup: TS('t2-4', ['mkdir cache', 'touch cache/x.tmp cache/y.tmp tmp1.log tmp2.log', TF('keep.txt', ['지우면 안 돼요'])]),
        needs: [['rm 파일', 'T2/3', '파일 지우기'], ['rm -r 폴더', 'T2/3', '폴더째 지우기 — 되돌릴 수 없음']],
        answer: 'ls\nrm tmp1.log tmp2.log\nrm -r cache', check: 'find . | sort', io: [{ output: '.\n./keep.txt' }] },
    ],
    T3: [
      { title: '할 일 목록 만들기', text: '<code>todo.txt</code> 를 만들어 아래 세 줄을 순서대로 넣으세요. 편집기 없이 <code>echo</code> 로만 해요.<pre class="code">우유 사기\n숙제 하기\n운동 30분</pre>',
        setup: TS('t3-1', []),
        needs: [['echo 글 > 파일', 'T3/1', '새로 쓰기'], ['echo 글 >> 파일', 'T3/1', '끝에 이어 쓰기']],
        answer: 'echo 우유 사기 > todo.txt\necho 숙제 하기 >> todo.txt\necho 운동 30분 >> todo.txt', check: 'cat todo.txt', io: [{ output: '우유 사기\n숙제 하기\n운동 30분' }] },
      { title: '앞부분과 뒷부분만 보기', text: '<code>log.txt</code> 는 10줄짜리 기록이에요. <b>처음 3줄</b>을 보고, 이어서 <b>마지막 2줄</b>을 보세요.',
        setup: TS('t3-2', ["printf '%s번째 기록\\n' 1 2 3 4 5 6 7 8 9 10 > log.txt"]),
        needs: [['head -n 3', 'T3/0', '앞에서 몇 줄'], ['tail -n 2', 'T3/0', '뒤에서 몇 줄']],
        answer: 'head -n 3 log.txt\ntail -n 2 log.txt', io: [{ output: '1번째 기록\n2번째 기록\n3번째 기록\n9번째 기록\n10번째 기록' }] },
      { title: '일기 끝에 한 줄 쓰기', text: '<code>diary.txt</code> 에 일기가 세 줄 있어요. 원래 내용은 <b>그대로 두고</b> 맨 끝에 <code>11월 6일: 터미널 배움</code> 을 한 줄 붙이세요. (<code>&gt;</code> 하나를 치면 일기가 사라져요 — 연습 폴더라 괜찮으니 해 보고 준비 명령으로 되살려도 돼요)',
        setup: TS('t3-3', [TF('diary.txt', ['11월 3일: 비', '11월 4일: 맑음', '11월 5일: 흐림'])]),
        needs: [['>>', 'T3/1', '이어 쓰기 — 원래 내용은 그대로'], ['cat', 'T3/0', '확인']],
        answer: 'echo "11월 6일: 터미널 배움" >> diary.txt', check: 'cat diary.txt', io: [{ output: '11월 3일: 비\n11월 4일: 맑음\n11월 5일: 흐림\n11월 6일: 터미널 배움' }] },
      { title: '파일 목록을 파일로 저장', text: '이 폴더의 파일 목록을 <code>files.txt</code> 에 저장하세요. 그다음 <code>files.txt</code> 를 열어 보면 목록에 무엇이 들어 있는지, 왜 그런지 생각해 보세요.',
        setup: TS('t3-4', ['touch a.txt b.txt c.txt']),
        needs: [['명령 > 파일', 'T3/2', '명령 결과를 파일로'], ['ls', 'T1/1', '목록']],
        answer: 'ls > files.txt\ncat files.txt', io: [{ output: 'a.txt\nb.txt\nc.txt\nfiles.txt' }] },
    ],
    T4: [
      { title: 'txt 파일만 한 번에 읽기', text: '이 폴더에는 <code>.txt</code> 파일 두 개와 <code>.log</code> 파일 하나가 있어요. <code>cat</code> <b>한 번</b>으로 txt 파일 두 개의 내용만 이어서 보세요.',
        setup: TS('t4-1', [TF('a.txt', ['가나다']), TF('b.txt', ['라마바']), TF('c.log', ['로그는 빼고'])]),
        needs: [['*.txt', 'T4/0', '.txt 로 끝나는 이름 전부'], ['cat', 'T3/0', '여러 파일을 이어서']],
        answer: 'cat *.txt', io: [{ output: '가나다\n라마바' }] },
      { title: '여행 사진 전부 찾기', text: '<code>trip</code> 폴더 아래 날짜별 폴더 곳곳에 사진이 흩어져 있어요. 폴더 안의 폴더까지 뒤져서 <b>.jpg 파일</b>을 전부 찾으세요.',
        setup: TS('t4-2', ['mkdir -p trip/day1 trip/day2', 'touch trip/day1/beach.jpg trip/day1/memo.txt trip/day2/temple.jpg trip/day2/map.png trip/list.txt']),
        needs: [['find . -name "*.jpg"', 'T4/1', '이름으로 찾기 — 따옴표 꼭']],
        answer: 'find . -name "*.jpg"', anyOrder: true, io: [{ output: './trip/day1/beach.jpg\n./trip/day2/temple.jpg' }] },
      { title: '「비밀번호」 가 적힌 파일은?', text: '여러 메모 중에 「비밀번호」 라는 말이 적힌 파일이 있어요. 하위 폴더까지 전부 뒤져서 그 <b>파일 이름만</b> 보세요.',
        setup: TS('t4-3', ['mkdir -p work home', TF('work/meeting.txt', ['회의는 3시']), TF('work/wifi.txt', ['와이파이 비밀번호: abc']), TF('home/shop.txt', ['우유', '빵']), TF('home/bank.txt', ['통장 비밀번호는 외우기'])]),
        needs: [['grep -rl', 'T4/2', '내용으로 찾아 파일 이름만'], ['.', 'T1/2', '지금 폴더부터']],
        answer: 'grep -rl 비밀번호 .', anyOrder: true, io: [{ output: './home/bank.txt\n./work/wifi.txt' }] },
      { title: '몇 번째 줄에 있나', text: '<code>diary.txt</code> 에서 「숙제」 가 들어 있는 줄을 <b>줄 번호와 함께</b> 보세요.',
        setup: TS('t4-4', [TF('diary.txt', ['월: 터미널 설치', '화: 숙제 못 함', '수: 게임', '목: 숙제 다 함', '금: 쉼'])]),
        needs: [['grep -n', 'T4/2', '줄 번호와 함께']],
        answer: 'grep -n 숙제 diary.txt', io: [{ output: '2:화: 숙제 못 함\n4:목: 숙제 다 함' }] },
    ],
    T5: [
      { title: '파일이 몇 개?', text: '이 폴더에 파일이 잔뜩 있어요. 하나하나 세지 말고 <b>명령 두 개를 이어서</b> 개수를 숫자로 보세요.',
        setup: TS('t5-1', ['touch a.txt b.txt c.txt d.jpg e.jpg f.png g.md']),
        needs: [['ls | wc -l', 'T5/0', '목록을 넘겨 줄 수 세기'], ['|', 'T5/0', '파이프']],
        answer: 'ls | wc -l', io: [{ output: '7' }] },
      { title: 'ERROR 가 몇 번?', text: '<code>server.log</code> 에서 <code>ERROR</code> 가 들어 있는 줄이 <b>몇 줄</b>인지 숫자로 보세요.',
        setup: TS('t5-2', [TF('server.log', ['09:00 INFO 시작', '09:05 ERROR 디스크', '09:10 INFO 접속', '09:20 ERROR 시간초과', '09:30 INFO 접속', '09:31 ERROR 디스크'])]),
        needs: [['grep', 'T4/2', 'ERROR 줄 찾기'], ['| wc -l', 'T5/0', '찾은 줄 세기'], ['grep -c', 'T4/2', '(다른 방법) 개수만']],
        answer: 'grep ERROR server.log | wc -l', io: [{ output: '3' }] },
      { title: '제일 많이 나온 과일', text: '<code>votes.txt</code> 는 좋아하는 과일 투표예요. 한 줄에 한 표. <b>제일 많이 나온 과일과 그 표 수</b>를 한 줄로 보세요.',
        setup: TS('t5-3', ["printf '%s\\n' 사과 배 귤 사과 포도 배 사과 귤 사과 > votes.txt"]),
        needs: [['sort', 'T5/1', '같은 것끼리 붙이기'], ['uniq -c', 'T5/1', '몇 번씩인지'], ['sort -rn', 'T5/1', '많은 순'], ['head -n 1', 'T3/0', '맨 위 하나']],
        answer: 'sort votes.txt | uniq -c | sort -rn | head -n 1', io: [{ output: '      4 사과' }] },
      { title: '점수 높은 세 명', text: '<code>scores.txt</code> 는 한 줄에 「점수 이름」 이에요. <b>점수가 높은 순서로 세 명</b>만 보세요. (그냥 <code>sort</code> 를 하면 100 이 어디로 가는지도 보세요)',
        setup: TS('t5-4', [TF('scores.txt', ['85 민수', '100 지훈', '92 서연', '78 하준', '95 유나'])]),
        needs: [['sort -rn', 'T5/1', '숫자로, 큰 것부터'], ['head -n 3', 'T3/0', '위에서 3줄'], ['|', 'T5/0', '이어 붙이기']],
        answer: 'sort -rn scores.txt | head -n 3', io: [{ output: '100 지훈\n95 유나\n92 서연' }] },
    ],
    TB1: [
      { title: '엉망인 프로젝트 폴더 정리', text: '<code>project</code> 폴더에 파일이 뒤섞여 있어요. 아래 구조로 정리하고, <b>TODO</b> 라는 말이 들어 있는 파일을 찾아 그 파일 이름을 <code>notes.txt</code> 끝에 적으세요(원래 줄은 그대로).<pre class="code">project/\n├── data/   ← data.csv\n├── docs/   ← README.md\n├── src/    ← .py 파일 두 개\n└── notes.txt</pre>',
        setup: TS('tb1-1', ['mkdir project && cd project', TF('main.py', ['from util import helper', 'print(helper())']), TF('util.py', ['def helper():', '    # TODO: 진짜 계산으로 바꾸기', '    return 42']), TF('README.md', ['# 프로젝트']), TF('data.csv', ['a,b', '1,2']), TF('notes.txt', ['TODO 가 들어 있는 파일:'])]),
        needs: [['mkdir a b c', 'T2/0', '폴더 여러 개'], ['mv 파일 폴더/', 'T2/2', '옮기기'], ['*.py', 'T4/0', '.py 전부'], ['grep -rl', 'T4/2', '내용으로 찾기'], ['>>', 'T3/1', '끝에 한 줄']],
        answer: 'mkdir src docs data\nmv *.py src/\nmv README.md docs/\nmv data.csv data/\ngrep -rl TODO .\necho util.py >> notes.txt', check: 'find . -type f | sort\ncat notes.txt', io: [{ output: './data/data.csv\n./docs/README.md\n./notes.txt\n./src/main.py\n./src/util.py\nTODO 가 들어 있는 파일:\nutil.py' }] },
      { title: '🏠 다운로드 폴더 정리', text: '다운로드 폴더처럼 온갖 파일이 섞여 있어요. <code>images</code>(jpg·png), <code>docs</code>(pdf·hwp), <code>zips</code>(zip) 세 폴더를 만들어 종류별로 옮기세요. 파일이 많아도 <code>mv</code> 는 세 번이면 돼요. 끝나면 이 폴더에는 세 폴더만 남아야 해요.',
        setup: TS('tb1-2', ['touch IMG_0412.jpg IMG_0413.jpg screenshot.png 성적표.pdf 신청서.hwp 과제.pdf setup.zip photos.zip']),
        needs: [['mkdir a b c', 'T2/0', '폴더 여러 개'], ['*.jpg *.png', 'T4/0', '종류별로 한꺼번에'], ['mv 여러개 폴더/', 'T2/2', '한 번에 옮기기']],
        answer: 'mkdir images docs zips\nmv *.jpg *.png images/\nmv *.pdf *.hwp docs/\nmv *.zip zips/', check: 'ls | wc -l\nls images | wc -l\nls docs | wc -l\nls zips | wc -l', io: [{ output: '3\n3\n3\n2' }] },
      { title: '🏠 로그 보고서 만들기', text: '<code>logs</code> 폴더에 날짜별 기록이 있어요. <code>report.txt</code> 를 만들어 ① 첫 줄부터 <code>ERROR</code> 가 들어 있는 <b>파일 이름들</b>을 적고 ② 마지막 줄에 모든 기록을 통틀어 ERROR 줄이 <b>몇 개</b>인지 숫자를 적으세요.',
        setup: TS('tb1-3', ['mkdir logs', TF('logs/1101.log', ['INFO 시작', 'ERROR 디스크']), TF('logs/1102.log', ['INFO 시작', 'INFO 끝']), TF('logs/1103.log', ['ERROR 접속', 'ERROR 접속', 'INFO 끝'])]),
        needs: [['grep -l', 'T4/2', 'ERROR 가 있는 파일 이름만'], ['logs/*.log', 'T4/0', '기록 파일 전부'], ['> · >>', 'T3/2', '결과를 파일로 · 이어서'], ['| wc -l', 'T5/0', '줄 세기']],
        answer: 'grep -l ERROR logs/*.log > report.txt\ngrep ERROR logs/*.log | wc -l >> report.txt', check: 'cat report.txt', io: [{ output: 'logs/1101.log\nlogs/1103.log\n3' }] },
    ],
  },
};

// ================= v2.12.0 Git 편 (T6~T16 · TB2 · TB3) — 사용자 11/6 「2번 진행」(N1 2차) =================
// 연습은 진짜 git(Git Bash). 원격(push·pull·clone)은 처음엔 「내 컴퓨터 안의 가짜 GitHub」 = bare 저장소 폴더(remote.git)로, T16 에서 실제 GitHub.
// 준비 명령의 git init 은 늘 -b main(설치 때 main 을 안 골랐어도 같게). 파일 이름은 영어(한글 이름은 git status 에 \355… 로 보임 — T6 설정에서 quotepath 를 끄지만 같게 보이도록).
// 검사(check_book): 커밋 해시·날짜는 컴퓨터마다 달라서 확인 명령은 --format=%s(메시지)·status --short·ls-files 처럼 늘 같은 것만.
const GI = 'git init -q -b main';
const GC = (msg) => `git add -A && git commit -qm "${msg}"`;
const GIT_PAGES = {
  T6: [
    { title: '최종_진짜최종.py 이야기', html: `<p>과제를 하다 보면 폴더가 이렇게 돼요.</p>
<pre class="code">report.py
report_수정.py
report_최종.py
report_최종_진짜최종.py
report_최종_진짜최종_이게마지막.py</pre>
<p>어느 게 진짜인지, 어제 잘 되던 건 어느 파일이었는지, 무엇이 바뀌었는지 아무도 몰라요. <b>버전 관리</b>는 이 문제를 이렇게 풀어요:</p>
<ul><li>파일은 <b>하나</b>(<code>report.py</code>)만 둔다</li><li>「여기까지 잘 됨」 싶을 때마다 그 순간의 폴더 전체를 <b>사진 찍듯 기록</b>한다 — 이 기록 한 장이 <b>커밋</b>(commit)</li><li>커밋마다 <b>메시지</b>(무엇을 왜 바꿨나)를 붙인다</li><li>언제든 예전 커밋으로 <b>돌아가거나</b>, 두 커밋 사이에 <b>무엇이 바뀌었는지</b> 볼 수 있다</li></ul>
<pre class="code">커밋 1 「과제 뼈대」 ── 커밋 2 「그래프 추가」 ── 커밋 3 「오타 수정」  ← 지금</pre>
<div class="bk-warn"><b>⚠ 이 레슨 3쪽의 「처음 한 번: 이름·이메일 설정」 은 꼭 하고 넘어가세요.</b> 레슨 7 부터 모든 Git 문제가 이 설정이 돼 있어야 돌아가요.</div>` },
    { title: 'Git 과 GitHub 는 다른 것', html: `<table class="kb"><tbody><tr><td><b>Git</b></td><td><b>내 컴퓨터</b>의 프로그램. 커밋을 만들고, 역사를 보고, 되돌려요. 인터넷이 없어도 돼요. 시작하기 1 에서 깐 Git for Windows 가 이것</td></tr><tr><td><b>GitHub</b></td><td>Git 저장소를 <b>인터넷에 올려 두는 사이트</b>. 백업, 다른 컴퓨터에서 받기, 다른 사람과 같이 고치기(PR)에 써요. 레슨 11·16</td></tr><tr><td><b>저장소</b>(repository, repo)</td><td>Git 이 기록을 관리하는 폴더. 안에 숨은 <code>.git</code> 폴더가 있고 거기에 모든 커밋이 들어 있어요</td></tr></tbody></table>
<p>그래서 순서는 늘 <b>① 내 컴퓨터에서 Git 으로 커밋</b> → <b>② 필요하면 GitHub 로 올리기(push)</b> 예요. 챕터 2 는 ①, 챕터 3 은 ② 와 여럿이 일하기예요.</p>
<p class="muted small">비슷한 사이트로 GitLab·Bitbucket 이 있어요. Git 명령은 똑같아요.</p>` },
    { title: '처음 한 번: 이름·이메일 설정 (필수!)', html: `<div class="bk-warn"><b>⚠ 레슨 7 부터의 모든 Git 문제가 이 설정을 전제로 해요.</b> 안 하면 준비 명령의 <code>git commit</code> 이 <code>Author identity unknown</code> 에러로 멈춰요. 아래 상자의 네 줄을 <b>내 이름·이메일로 바꿔</b> Git Bash 에 붙여 넣으세요 — 이 컴퓨터에서 딱 한 번. 다른 컴퓨터(학교·회사)에서 Git 을 쓸 땐 거기서도 한 번.</div>
<p>커밋마다 「누가 만들었나」 가 기록돼요. 그래서 Git 을 깐 뒤 <b>딱 한 번</b> 이름과 이메일을 알려 줘야 해요. 안 하면 첫 커밋에서 <code>Author identity unknown</code> 에러가 나요.</p>
<table class="kb"><tbody><tr><td><code>git config --global user.name "지훈"</code></td><td>이름 — GitHub 에 올리면 다른 사람에게 보여요</td></tr><tr><td><code>git config --global user.email "me@example.com"</code></td><td>이메일 — 나중에 GitHub 계정 이메일과 같게 하면 GitHub 가 내 커밋으로 알아봐요</td></tr><tr><td><code>git config --global core.quotepath false</code></td><td>한글 파일 이름이 <code>"\\355\\225\\234"</code> 처럼 깨져 보이지 않게</td></tr><tr><td><code>git config --global pull.rebase false</code></td><td>레슨 11 의 <code>git pull</code> 이 「어떻게 합칠지 정하라」 고 멈추지 않게(설치 때 기본값을 골랐으면 이미 돼 있어요)</td></tr><tr><td><code>git config --global --list</code></td><td>설정한 것 전부 보기</td></tr></tbody></table>
<p><code>--global</code> 은 「이 컴퓨터의 내 모든 저장소에」 라는 뜻이에요. 설정은 <code>~/.gitconfig</code> 파일에 저장돼요(<code>cat ~/.gitconfig</code> 로 볼 수 있어요).</p>`, example: { shell: 'git config --global user.name "지훈"\ngit config --global user.email "me@example.com"\ngit config --global core.quotepath false\ngit config --global pull.rebase false\ngit config --global --list' } },
  ],
  T7: [
    { title: '세 칸: 작업 폴더 → 스테이징 → 저장소', html: `<p>Git 에서 파일은 세 칸 중 하나에 있어요. 이 그림이 Git 의 거의 전부예요.</p>
<pre class="code">[작업 폴더]  ──git add──▶  [스테이징]  ──git commit──▶  [저장소(.git)]
 내가 고치는 곳             「이번 커밋에 넣을 것」        기록된 커밋들</pre>
<ul><li><b>작업 폴더</b> — 탐색기에서 보이는 그 파일들. 고치면 여기가 바뀌어요</li><li><b>스테이징</b>(staging area) — 다음 커밋에 넣을 변경을 <b>골라 담는 바구니</b>. 바꾼 것 중 일부만 골라 커밋할 수 있는 이유</li><li><b>저장소</b> — 커밋이 쌓이는 곳. 한번 들어가면 웬만해선 사라지지 않아요</li></ul>
<p>「왜 바로 커밋 안 하고 바구니를 거치지?」 — 파일 다섯 개를 고쳤는데 그중 두 개는 「로그인 기능」, 세 개는 「오타 수정」 이라면, 바구니에 나눠 담아 커밋 두 개로 남길 수 있어요. 커밋 하나에 「한 가지 일」 이 좋은 기록이에요.</p>` },
    { title: 'git init · git status', html: `<table class="kb"><tbody><tr><td><code>git init</code></td><td>지금 폴더를 <b>저장소로</b> 만들기 — 숨은 <code>.git</code> 폴더가 생겨요. 프롬프트에 <code>(main)</code> 이 붙어요</td></tr><tr><td><code>git init -b main</code></td><td>첫 브랜치 이름을 확실히 <code>main</code> 으로(설치 때 「Override … main」 을 골랐으면 그냥 <code>git init</code> 과 같아요). 프롬프트가 <code>(master)</code> 면 이걸로 하거나 <code>git branch -m main</code></td></tr><tr><td><code>git status</code></td><td>지금 각 파일이 <b>어느 칸</b>에 있는지. 제일 많이 치는 명령</td></tr><tr><td><code>git status --short</code></td><td>짧게 한 줄씩</td></tr></tbody></table>
<pre class="code">$ git status --short
 M app.py       ← 고쳤는데 아직 add 안 함 (오른쪽 M = 작업 폴더에서 바뀜)
A  new.py       ← add 함 = 스테이징에 있음 (왼쪽 A = 새 파일이 바구니에)
M  util.py      ← 고치고 add 함 (왼쪽 M)
?? notes.txt    ← Git 이 아직 모르는 파일(untracked)</pre>
<p>짧은 표시는 <b>두 글자</b>예요: 왼쪽 = 스테이징, 오른쪽 = 작업 폴더. 아무것도 안 나오면 「커밋할 게 없음(깨끗함)」.</p>
<p class="muted small"><code>git init</code> 을 홈 폴더(<code>~</code>)에서 하면 홈 전체가 저장소가 돼 버려요. 꼭 프로젝트 폴더 안에서. 잘못했으면 그 폴더의 <code>.git</code> 만 지우면(<code>rm -rf .git</code>) 원래대로예요.</p>`, example: { shell: 'cd ~ && mkdir -p terminal-study && cd terminal-study && rm -rf gitplay && mkdir gitplay && cd gitplay\ngit init -b main\necho "print(1)" > app.py\ngit status\ngit status --short' } },
    { title: 'git add: 바구니에 담기', html: `<table class="kb"><tbody><tr><td><code>git add app.py</code></td><td>그 파일만</td></tr><tr><td><code>git add a.py b.py</code></td><td>여러 개</td></tr><tr><td><code>git add .</code></td><td>지금 폴더 아래 바뀐 것 <b>전부</b></td></tr><tr><td><code>git add *.py</code></td><td>와일드카드도 돼요(레슨 4)</td></tr></tbody></table>
<pre class="code">warning: in the working copy of 'app.py', LF will be replaced by CRLF the next time Git touches it</pre>
<p>Windows 에서 <code>git add</code> 할 때 이 경고가 자주 나와요. 줄바꿈 글자를 Windows 식으로 맞춰 주겠다는 안내일 뿐이라 <b>무시해도 돼요</b>(설치 때 고른 「Checkout Windows-style, commit Unix-style」 때문).</p>
<p><code>git add .</code> 은 편하지만, 올리면 안 되는 파일(비밀번호·큰 데이터)까지 담길 수 있어요. 담은 뒤 <code>git status</code> 로 한 번 보는 습관 — 그리고 레슨 10 의 <code>.gitignore</code>.</p>`, example: { shell: 'git add app.py\ngit status --short\necho "메모" > notes.txt\ngit add .\ngit status --short' } },
    { title: 'git commit -m: 기록하기', html: `<p><code>git commit -m "메시지"</code> — 바구니(스테이징)에 담긴 것을 커밋 하나로 기록해요. 바구니는 비워지고, 작업 폴더는 그대로예요.</p>
<pre class="code">$ git commit -m "첫 프로그램"
[main (root-commit) 3f2a1c9] 첫 프로그램
 2 files changed, 2 insertions(+)
 create mode 100644 app.py
 create mode 100644 notes.txt</pre>
<ul><li><code>3f2a1c9</code> 는 커밋의 <b>이름표(해시)</b>. 컴퓨터마다 달라요</li><li><code>-m</code> 을 빼면 메시지를 쓰라고 <b>편집기</b>(설치 때 고른 VS Code)가 열려요. 쓰고 저장한 뒤 그 탭을 닫으면 커밋돼요</li><li><code>nothing to commit</code> = 바구니가 비었어요. <code>git add</code> 를 먼저</li><li><code>Author identity unknown</code> = 레슨 6 의 이름·이메일 설정을 먼저</li></ul>
<p>한 바퀴: <b>고치기 → <code>git add</code> → <code>git commit -m</code> → (반복)</b>. 중간중간 <code>git status</code>.</p>`, example: { shell: 'git commit -m "첫 프로그램"\ngit status\necho "print(2)" >> app.py\ngit status --short\ngit add app.py\ngit commit -m "두 번째 줄 추가"' } },
  ],
  T8: [
    { title: 'git log: 역사 보기', html: `<table class="kb"><tbody><tr><td><code>git log</code></td><td>커밋 목록(최근이 위). 해시·누가·언제·메시지</td></tr><tr><td><code>git log --oneline</code></td><td>한 줄에 하나 — 짧은 해시 + 메시지</td></tr><tr><td><code>git log -n 3</code></td><td>최근 3개만</td></tr><tr><td><code>git log --oneline 파일</code></td><td>그 파일을 바꾼 커밋만</td></tr><tr><td><code>git log --stat</code></td><td>커밋마다 어떤 파일이 몇 줄 바뀌었나</td></tr><tr><td><code>git show</code></td><td>마지막 커밋 하나의 내용(무엇이 바뀌었나)까지</td></tr></tbody></table>
<pre class="code">$ git log --oneline
b71e0d2 (HEAD -> main) 두 번째 줄 추가
3f2a1c9 첫 프로그램</pre>
<div class="bk-warn">목록이 길면 화면이 <code>:</code> 로 끝나며 멈춰요(less 로 보는 중). <kbd>Space</kbd> 다음 쪽, <kbd>q</kbd> 나가기.</div>` , example: { shell: 'git log\ngit log --oneline\ngit log --oneline -n 1\ngit log --stat' } },
    { title: 'git diff: 무엇이 바뀌었나', html: `<table class="kb"><tbody><tr><td><code>git diff</code></td><td><b>작업 폴더</b> ↔ 스테이징 — 고쳤는데 아직 add 안 한 것</td></tr><tr><td><code>git diff --staged</code></td><td><b>스테이징</b> ↔ 마지막 커밋 — add 해서 「이번 커밋에 들어갈 것」</td></tr><tr><td><code>git diff HEAD~1</code></td><td>지금 ↔ 커밋 하나 전</td></tr></tbody></table>
<pre class="code">$ git diff
diff --git a/menu.txt b/menu.txt
index 2c1f0e3..8d4b7a1 100644
--- a/menu.txt
+++ b/menu.txt
@@ -1,2 +1,2 @@
 아메리카노 4000
-라떼 4500
+라떼 5000</pre>
<p><code>-</code> 로 시작하는 줄 = <b>지워진</b> 줄(빨강), <code>+</code> = <b>새로 생긴</b> 줄(초록), 앞이 빈칸이면 그대로인 줄(앞뒤 맥락). 한 줄을 고치면 「옛 줄 지움 + 새 줄 추가」 로 보여요.</p>
<p>커밋하기 전에 <code>git diff --staged</code> 로 「내가 무엇을 기록하려는지」 한 번 보는 게 좋은 습관이에요.</p>`, example: { shell: 'echo "print(3)" >> app.py\ngit diff\ngit add app.py\ngit diff\ngit diff --staged' } },
    { title: '좋은 커밋 메시지', html: `<p>메시지는 <b>몇 달 뒤의 나</b>에게 쓰는 편지예요. <code>git log --oneline</code> 만 보고도 무슨 일이 있었는지 알 수 있어야 해요.</p>
<table class="kb"><tbody><tr><td>❌ <code>수정</code> · <code>ㅇㅇ</code> · <code>asdf</code> · <code>최종</code></td><td>무엇을? 왜?</td></tr><tr><td>✅ <code>로그인 실패 시 에러 메시지 추가</code></td><td>무엇을 했는지 한눈에</td></tr><tr><td>✅ <code>합계 계산에서 빈 줄 건너뛰기 (빈 줄이면 0 으로 나뉨)</code></td><td>왜인지까지</td></tr></tbody></table>
<ul><li>첫 줄은 <b>50자 안팎</b>으로 짧게 — 목록에서 잘리지 않게</li><li>「무엇을 + (필요하면) 왜」. 어떻게는 코드(diff)가 말해 줘요</li><li>커밋 하나 = 한 가지 일. 「로그인 추가 및 오타 수정 및 색 변경」 처럼 「및」 이 들어가면 나눌 때예요(레슨 7 의 바구니)</li><li>영어로 쓰는 곳도 많아요: <code>Add login error message</code> (명령형 동사로 시작)</li></ul>` },
  ],
  T9: [
    { title: '고친 파일 되돌리기: git restore', html: `<p>「아까 커밋한 상태로 되돌리고 싶다」 — 커밋해 둔 덕분에 가능해요.</p>
<table class="kb"><tbody><tr><td><code>git restore app.py</code></td><td>작업 폴더의 app.py 를 <b>마지막 커밋(또는 스테이징) 상태로</b>. 고친 내용은 <b>사라져요</b></td></tr><tr><td><code>git restore .</code></td><td>바꾼 파일 전부</td></tr><tr><td><code>git restore --staged app.py</code></td><td>바구니에서 <b>빼기</b>(unstage). 파일 내용은 그대로 — add 를 취소하는 것</td></tr><tr><td><code>git restore --source HEAD~2 app.py</code></td><td>두 커밋 전 모양으로 그 파일만</td></tr></tbody></table>
<p><code>git status</code> 의 안내문에도 이 명령이 나와요: <code>(use "git restore &lt;file&gt;..." to discard changes in working directory)</code>.</p>
<p class="muted small">옛 글에는 <code>git checkout -- 파일</code> 로 나와요. 같은 일을 하는 예전 명령이에요.</p>`, example: { shell: 'echo "망친 코드" > app.py\ngit status --short\ngit restore app.py\ncat app.py\ngit add notes.txt\ngit restore --staged notes.txt' } },
    { title: '커밋 되돌리기: git reset 세 가지', html: `<p><code>git reset HEAD~1</code> = 「마지막 커밋을 없던 일로」. <code>HEAD</code> 는 지금 커밋, <code>HEAD~1</code> 은 하나 전, <code>HEAD~2</code> 는 둘 전. 옵션에 따라 <b>무엇을 남기는지</b>가 달라요.</p>
<table class="kb"><tbody><tr><th>명령</th><th>커밋</th><th>스테이징</th><th>작업 폴더(파일 내용)</th></tr><tr><td><code>git reset --soft HEAD~1</code></td><td>취소</td><td><b>남음</b>(바구니에 다시 담긴 채)</td><td>남음</td></tr><tr><td><code>git reset HEAD~1</code> (= <code>--mixed</code>, 기본)</td><td>취소</td><td>비움</td><td><b>남음</b></td></tr><tr><td><code>git reset --hard HEAD~1</code></td><td>취소</td><td>비움</td><td><b>사라짐</b> ⚠</td></tr></tbody></table>
<ul><li>「커밋 메시지를 다시 쓰고 싶다 / 파일을 더 넣고 다시 커밋」 → <code>--soft</code></li><li>「커밋을 나눠서 다시 하고 싶다」 → 기본(mixed)</li><li>「다 버리고 그 전으로」 → <code>--hard</code>. 커밋 안 한 변경까지 지워져요</li></ul>
<div class="bk-warn">이미 <b>push 한</b>(GitHub 에 올린) 커밋을 reset 하면 다른 사람 기록과 어긋나요. 올린 뒤 되돌리기는 <code>git revert 커밋</code>(되돌리는 새 커밋을 만듦)이 안전해요.</div>`, example: { shell: 'git log --oneline\ngit reset --soft HEAD~1\ngit status --short\ngit commit -m "다시 커밋"\ngit log --oneline' } },
    { title: 'git reset --hard 와 안전망 reflog', html: `<p><code>git reset --hard</code>(뒤에 아무것도 안 쓰면 <code>HEAD</code>) = 「마지막 커밋 이후 바꾼 것 <b>전부 버리기</b>」. 폴더가 엉망이 됐을 때 깨끗이 돌아가는 비상구예요.</p>
<pre class="code">$ git reset --hard
HEAD is now at b71e0d2 두 번째 줄 추가</pre>
<p><b>커밋하지 않은 변경</b>은 진짜로 사라져요. 하지만 <b>커밋했던 것</b>은 reset 으로 지워도 한동안 Git 이 기억해요:</p>
<pre class="code">$ git reflog
b71e0d2 HEAD@{0}: reset: moving to HEAD~1
9a8c7e6 HEAD@{1}: commit: 실수로 지운 커밋
$ git reset --hard 9a8c7e6      ← 그 커밋으로 다시</pre>
<p>그래서 「일단 커밋해 두기」 가 최고의 보험이에요. 커밋은 거의 잃어버리지 않아요.</p>`, example: { shell: 'echo "엉망" > app.py\ngit reset --hard\ncat app.py\ngit reflog -n 3' } },
  ],
  T10: [
    { title: '.gitignore: Git 이 못 본 척할 파일', html: `<p>저장소 맨 위에 <code>.gitignore</code> 라는 파일을 만들고 한 줄에 하나씩 <b>무시할 이름(패턴)</b>을 적으면, Git 은 그 파일을 <code>git status</code> 에도 안 보이고 <code>git add .</code> 에도 안 담아요.</p>
<table class="kb"><tbody><tr><td><code>*.log</code></td><td>.log 로 끝나는 파일 전부</td></tr><tr><td><code>__pycache__/</code></td><td>그 이름의 폴더 통째로(끝의 <code>/</code> = 폴더)</td></tr><tr><td><code>.env</code></td><td>그 파일 하나</td></tr><tr><td><code>data/*.csv</code></td><td>data 폴더의 csv 만</td></tr><tr><td><code>!keep.log</code></td><td>앞의 규칙의 예외 — 이건 무시하지 말 것</td></tr><tr><td><code># 메모</code></td><td>주석</td></tr></tbody></table>
<p>만들기: <code>echo "*.log" &gt;&gt; .gitignore</code> 처럼 한 줄씩, 또는 <code>notepad .gitignore</code> / <code>code .gitignore</code>. <code>.gitignore</code> 자신은 <b>커밋해요</b> — 같이 일하는 사람도 같은 규칙을 쓰게.</p>
<p class="muted small">파이썬 프로젝트용 모범 목록은 GitHub 의 <a href="https://github.com/github/gitignore/blob/main/Python.gitignore" target="_blank" rel="noopener">github/gitignore — Python.gitignore</a> 에 있어요.</p>`, example: { shell: 'echo "로그" > debug.log\ngit status --short\necho "*.log" >> .gitignore\ngit status --short\ngit add .gitignore\ngit commit -m ".gitignore 추가"' } },
    { title: '올리면 안 되는 것', html: `<table class="kb"><tbody><tr><td><b>비밀</b></td><td>비밀번호, API 키, 토큰, <code>.env</code>, 개인키(<code>*.pem</code>) — GitHub 에 올리면 <b>몇 분 안에</b> 자동으로 긁어 가는 프로그램들이 있어요</td></tr><tr><td><b>만들어지는 것</b></td><td><code>__pycache__/</code>, <code>*.pyc</code>, 빌드 결과 — 코드만 있으면 다시 만들어져요</td></tr><tr><td><b>환경</b></td><td>가상환경 <code>venv/</code>·<code>.venv/</code>, <code>node_modules/</code> — 수천 개 파일, 컴퓨터마다 다름</td></tr><tr><td><b>큰 데이터</b></td><td>수백 MB 동영상·데이터셋 — GitHub 는 100MB 넘는 파일을 거절해요</td></tr><tr><td><b>개인 설정</b></td><td><code>.vscode/</code> 의 내 설정, OS 가 만드는 <code>Thumbs.db</code>·<code>.DS_Store</code></td></tr></tbody></table>
<div class="bk-warn"><b>비밀을 한 번이라도 커밋했다면</b> 나중 커밋에서 지워도 <b>역사(옛 커밋)에 그대로 남아요</b>. 이미 push 했다면 그 키·비밀번호는 <b>바로 폐기하고 새로 발급</b>하는 게 정답이에요. 아직 push 전이면 레슨 15 의 방법으로 커밋에서 빼요.</div>` },
    { title: '이미 커밋한 파일을 무시하려면: git rm --cached', html: `<p><code>.gitignore</code> 는 <b>아직 Git 이 모르는 파일</b>에만 통해요. 이미 커밋한 파일은 목록에 적어도 계속 추적돼요.</p>
<pre class="code">git rm --cached debug.log      ← Git 의 목록에서만 빼기(파일은 내 폴더에 남음)
echo "*.log" &gt;&gt; .gitignore
git add .gitignore
git commit -m "로그 파일 추적 그만"</pre>
<table class="kb"><tbody><tr><td><code>git rm --cached 파일</code></td><td>추적만 그만 — 파일은 그대로</td></tr><tr><td><code>git rm 파일</code></td><td>추적 그만 + 파일도 지우기</td></tr><tr><td><code>git rm -r --cached 폴더</code></td><td>폴더째</td></tr><tr><td><code>git ls-files</code></td><td>지금 Git 이 추적하는 파일 목록</td></tr><tr><td><code>git check-ignore -v 파일</code></td><td>이 파일이 왜 무시되는지(어느 줄 때문인지)</td></tr></tbody></table>`, example: { shell: 'git ls-files\ngit check-ignore -v debug.log' } },
  ],
  T11: [
    { title: '원격 저장소: 다른 곳에 있는 같은 저장소', html: `<p>지금까지의 저장소는 내 컴퓨터에만 있어요(<b>로컬</b>). 같은 저장소를 다른 곳(GitHub 등)에 하나 더 두면 그게 <b>원격</b>(remote)이에요. 둘은 <b>따로</b> 있고, 명령으로 맞춰요.</p>
<pre class="code">[내 컴퓨터: 로컬]  ──git push──▶  [GitHub: 원격 origin]
                  ◀──git pull──
                  ◀──git clone── (처음 한 번 통째로 받기)</pre>
<table class="kb"><tbody><tr><td><code>git push</code></td><td>내 커밋을 원격으로 <b>올리기</b></td></tr><tr><td><code>git pull</code></td><td>원격의 새 커밋을 <b>받아 합치기</b></td></tr><tr><td><code>git clone 주소</code></td><td>원격 저장소를 통째로 <b>복사해 오기</b>(처음 한 번)</td></tr><tr><td><code>origin</code></td><td>원격의 <b>별명</b>. 관례상 첫 원격을 origin 이라 불러요</td></tr></tbody></table>
<p>커밋만 하고 push 를 안 하면 GitHub 에는 없어요. 「내 컴퓨터에서 커밋」 과 「올리기」 는 다른 일이에요.</p>` },
    { title: '연습용 「가짜 GitHub」: 폴더 하나', html: `<p>원격은 꼭 인터넷일 필요가 없어요. <b>내 컴퓨터의 다른 폴더</b>도 원격이 될 수 있어요. 계정 없이 push·pull·clone 을 진짜와 똑같이 연습하려고, 「만들어 보기」 에서는 이걸 가짜 GitHub 로 써요.</p>
<pre class="code">git init --bare remote.git     ← 원격 전용 저장소(작업 폴더 없음 = GitHub 쪽과 같은 모양)</pre>
<p><code>--bare</code> 저장소는 파일을 직접 고치는 곳이 아니라 <b>커밋만 받아 두는 곳</b>이에요. GitHub 의 저장소도 이런 모양이에요. 주소 자리에 <code>https://github.com/…</code> 대신 폴더 경로(<code>../remote.git</code>)를 쓰는 것만 달라요 — 레슨 16 에서 진짜 주소로 바꿔요.</p>` },
    { title: 'remote add · push -u · status', html: `<table class="kb"><tbody><tr><td><code>git remote add origin 주소</code></td><td>원격을 origin 이라는 별명으로 등록</td></tr><tr><td><code>git remote -v</code></td><td>등록된 원격 보기</td></tr><tr><td><code>git push -u origin main</code></td><td><b>처음</b> 올릴 때 — main 을 origin 의 main 과 짝지어(<code>-u</code>) 올리기. 다음부터는 <code>git push</code> 만</td></tr><tr><td><code>git status</code></td><td>짝지은 뒤에는 <code>Your branch is ahead of 'origin/main' by 1 commit.</code>(올릴 게 1개) 처럼 원격과의 차이도 알려 줘요</td></tr></tbody></table>
<pre class="code">$ git push -u origin main
To ../remote.git
 * [new branch]      main -> main
branch 'main' set up to track 'origin/main'.</pre>
<p>push 가 <code>rejected … (fetch first)</code> 로 거절되면 = 원격에 내가 안 받은 커밋이 있어요. 먼저 <code>git pull</code> 하고 다시 push.</p>`, example: { shell: 'cd ~ && mkdir -p terminal-study && cd terminal-study && rm -rf remoteplay && mkdir remoteplay && cd remoteplay\ngit init --bare remote.git\ngit init -b main me && cd me\necho "hi" > a.txt && git add a.txt && git commit -m "첫 커밋"\ngit remote add origin ../remote.git\ngit push -u origin main\ngit status' } },
    { title: 'clone · pull: 받아 오기', html: `<table class="kb"><tbody><tr><td><code>git clone 주소 폴더이름</code></td><td>원격을 통째로 받아 새 폴더로. origin 등록·짝짓기까지 자동</td></tr><tr><td><code>git pull</code></td><td>원격의 새 커밋을 받아(<code>fetch</code>) 내 브랜치에 합치기(<code>merge</code>)</td></tr><tr><td><code>git fetch</code></td><td>받기만 — 합치기 전에 무엇이 왔는지 보고 싶을 때(<code>git log --oneline main..origin/main</code>)</td></tr></tbody></table>
<p>집 컴퓨터와 학교 컴퓨터, 또는 나와 동료가 같은 원격을 쓰는 흐름:</p>
<pre class="code">일 시작 전:  git pull           ← 남이(다른 컴퓨터가) 올린 것 먼저 받기
일하고:      git add · git commit
끝나면:      git push</pre>
<p><code>fatal: Need to specify how to reconcile divergent branches</code> 가 나오면 레슨 6 의 <code>git config --global pull.rebase false</code> 를 한 번 하고 다시 <code>git pull</code>.</p>`, example: { shell: 'cd ~/terminal-study/remoteplay\ngit clone remote.git friend\ncd friend && echo "친구" >> a.txt && git commit -am "친구가 고침" && git push\ncd ../me\ngit pull\ncat a.txt' } },
  ],
  T12: [
    { title: '브랜치는 커밋에 붙은 이름표', html: `<p><b>브랜치</b>는 커밋 하나를 가리키는 <b>이름표</b>예요. <code>main</code> 도 브랜치예요. 커밋하면 지금 브랜치의 이름표가 새 커밋으로 한 칸 따라와요. <code>HEAD</code> 는 「내가 지금 쓰고 있는 이름표」.</p>
<pre class="code">A ── B ── C   ← main ← HEAD
          └── D   ← feature</pre>
<p>왜 쓰나요? <b>main 은 늘 잘 돌아가는 상태</b>로 두고, 새 기능은 옆 가지(feature)에서 실험해요. 망하면 가지만 버리면 되고, 잘 되면 main 에 합쳐요(레슨 13). GitHub 의 PR(레슨 16)도 브랜치 단위예요.</p>
<p>이름표라서 만들기·지우기가 아주 가벼워요 — 파일을 복사하는 게 아니에요.</p>` },
    { title: 'git branch · git switch', html: `<table class="kb"><tbody><tr><td><code>git branch</code></td><td>브랜치 목록. <code>*</code> 가 지금 브랜치</td></tr><tr><td><code>git switch -c feature</code></td><td>feature 를 <b>만들고</b> 그리로 옮기기(create)</td></tr><tr><td><code>git switch main</code></td><td>main 으로 옮기기 — 작업 폴더 파일이 main 의 모양으로 바뀌어요</td></tr><tr><td><code>git branch -d feature</code></td><td>지우기(이미 합친 것만. 안 합친 걸 지우려면 <code>-D</code>)</td></tr><tr><td><code>git log --oneline --graph --all</code></td><td>모든 브랜치를 가지 그림으로</td></tr></tbody></table>
<pre class="code">$ git branch
  feature
* main</pre>
<p><code>git switch</code> 할 때 <b>커밋 안 한 변경</b>이 있으면 Git 이 막을 수 있어요(<code>Your local changes … would be overwritten</code>). 먼저 커밋하거나 레슨 14 의 <code>git stash</code>.</p>
<p class="muted small">옛 글의 <code>git checkout -b feature</code> = <code>git switch -c feature</code>, <code>git checkout main</code> = <code>git switch main</code>. 프롬프트의 <code>(main)</code> 이 지금 브랜치예요.</p>`, example: { shell: 'cd ~/terminal-study/gitplay\ngit switch -c feature\necho "새 기능" > feature.txt\ngit add feature.txt && git commit -m "새 기능"\nls\ngit switch main\nls\ngit log --oneline --graph --all' } },
    { title: '브랜치 이름과 습관', html: `<ul><li>이름은 <b>하는 일</b>로: <code>login-page</code>, <code>fix-total-bug</code>, <code>feat/chart</code>. 띄어쓰기 대신 <code>-</code>·<code>/</code></li><li>일 하나 = 브랜치 하나. 끝나면 합치고 지우기</li><li>main 에서 바로 커밋하기보다 브랜치에서 하고 합치는 습관 — 혼자여도 「실험이 망했을 때」 를 지켜 줘요</li><li>지금 어느 브랜치인지는 <b>프롬프트</b> <code>(feature)</code> 로 늘 확인</li></ul>
<table class="kb"><tbody><tr><td><code>git branch -m 새이름</code></td><td>지금 브랜치 이름 바꾸기</td></tr><tr><td><code>git switch -</code></td><td>바로 전 브랜치로(<code>cd -</code> 처럼)</td></tr></tbody></table>` },
  ],
  T13: [
    { title: 'git merge: 가지 합치기', html: `<p>main 으로 옮긴 다음 <code>git merge feature</code> = 「feature 의 커밋들을 지금 브랜치(main)에 합쳐라」.</p>
<p><b>① fast-forward</b> — main 이 그사이 안 움직였으면, 이름표만 앞으로 옮겨요. 새 커밋이 안 생겨요.</p>
<pre class="code">A ── B   ← main               A ── B ── C ── D   ← main, feature
     └── C ── D  ← feature   ⇒</pre>
<p><b>② 3-way 병합</b> — 양쪽 다 새 커밋이 있으면, 둘을 합친 <b>병합 커밋</b>을 하나 새로 만들어요.</p>
<pre class="code">A ── B ── E   ← main          A ── B ── E ── M   ← main
     └── C   ← feature    ⇒        └── C ──┘</pre>
<p>병합 커밋은 메시지(<code>Merge branch 'feature'</code>)를 쓰라고 <b>편집기</b>를 열어요. 기본 메시지 그대로 저장하고 닫으면 끝. 편집기 없이 하려면 <code>git merge --no-edit feature</code>.</p>`, example: { shell: 'cd ~/terminal-study/gitplay\ngit switch main\ngit merge feature\ngit log --oneline --graph --all\ngit branch -d feature' } },
    { title: '충돌: 같은 줄을 양쪽에서 고쳤을 때', html: `<p>두 가지가 <b>같은 파일의 같은 줄</b>을 다르게 고쳤으면 Git 은 어느 쪽이 맞는지 몰라서 멈춰요. 이게 <b>충돌</b>(conflict)이에요. 고장이 아니라 「사람이 정해 줘」 라는 요청이에요.</p>
<pre class="code">$ git merge --no-edit feature
Auto-merging menu.txt
CONFLICT (content): Merge conflict in menu.txt
Automatic merge failed; fix conflicts and then commit the result.</pre>
<p>파일을 열면 Git 이 양쪽을 표시해 둬요:</p>
<pre class="code">아메리카노 4000
&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD
라떼 5000            ← 지금 브랜치(main)의 것
=======
라떼 4800            ← 합치려는 브랜치(feature)의 것
&gt;&gt;&gt;&gt;&gt;&gt;&gt; feature</pre>
<p><code>git status</code> 에는 <code>both modified: menu.txt</code>(짧게 <code>UU</code>)로 보여요.</p>` },
    { title: '충돌 해결 세 단계', html: `<div class="bk-step-box"><b>① 파일을 고친다</b><br><code>notepad menu.txt</code> 나 <code>code menu.txt</code> 로 열어 <b>원하는 최종 모양</b>으로 만들고 <b>마커 세 줄</b>(<code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code> <code>=======</code> <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt;</code>)을 지워요. 한쪽만 남겨도, 둘을 섞어도, 완전히 새로 써도 돼요. VS Code 는 위에 「Accept Current Change · Accept Incoming Change · Accept Both Changes」 단추를 보여 줘요(Current = HEAD 쪽, Incoming = 합치려는 쪽).</div>
<div class="bk-step-box"><b>② 해결했다고 알린다</b><br><code>git add menu.txt</code> — 충돌 난 파일을 add 하는 게 「해결함」 표시예요.</div>
<div class="bk-step-box"><b>③ 병합을 마친다</b><br><code>git commit --no-edit</code>(기본 메시지로) 또는 <code>git commit -m "메뉴 가격 충돌 해결"</code>.</div>
<p>마커를 지우지 않고 add 하면 <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code> 가 그대로 커밋돼요. 커밋 전에 <code>grep -n "&lt;&lt;&lt;&lt;&lt;&lt;&lt;" 파일</code> 로 남은 마커가 없는지 확인하세요.</p>
<p><b>그만두고 싶으면</b>: <code>git merge --abort</code> — 합치기 전 상태로 돌아가요.</p>`, example: { shell: 'git status\nnotepad menu.txt\ngrep -n "<<<<<<<" menu.txt\ngit add menu.txt\ngit commit --no-edit\ngit log --oneline --graph' } },
  ],
  T14: [
    { title: 'git stash: 하던 일 잠깐 치워 두기', html: `<p>기능을 만들다가(커밋하기엔 덜 됐는데) 급히 다른 브랜치에서 버그를 고쳐야 할 때. 커밋 안 한 변경을 <b>서랍에 잠깐 넣어 두는</b> 게 <code>git stash</code> 예요.</p>
<table class="kb"><tbody><tr><td><code>git stash</code></td><td>커밋 안 한 변경을 치우기 — 작업 폴더가 마지막 커밋 모양으로 깨끗해져요</td></tr><tr><td><code>git stash list</code></td><td>서랍 목록(<code>stash@{0}</code> 이 최근)</td></tr><tr><td><code>git stash pop</code></td><td>최근 것을 꺼내 다시 적용하고 서랍에서 빼기</td></tr><tr><td><code>git stash -u</code></td><td>Git 이 모르는 새 파일(<code>??</code>)까지 같이</td></tr><tr><td><code>git stash drop</code></td><td>꺼내지 않고 버리기</td></tr></tbody></table>
<pre class="code">git stash               ← 하던 것 치우기
git switch main         ← 급한 일
… 고치고 커밋 …
git switch feature
git stash pop           ← 하던 것 다시</pre>`, example: { shell: 'cd ~/terminal-study/gitplay\necho "덜 된 작업" >> app.py\ngit stash\ngit status --short\ngit stash list\ngit stash pop\ngit status --short' } },
    { title: 'git rebase: 내 커밋을 최신 main 끝으로 옮기기', html: `<p>feature 를 만든 뒤 main 에 새 커밋이 생겼어요. merge 하면 병합 커밋이 생기는데, <b>rebase</b> 는 내 커밋들을 main 의 <b>끝으로 옮겨 다시 붙여서</b> 한 줄로 만들어요.</p>
<pre class="code">전:   A ── B ── E   ← main            후(git rebase main):
           └── C ── D   ← feature      A ── B ── E ── C' ── D'   ← feature</pre>
<table class="kb"><tbody><tr><td><code>git switch feature</code> → <code>git rebase main</code></td><td>feature 의 커밋을 main 끝으로</td></tr><tr><td>충돌이 나면</td><td>파일 고치고 <code>git add</code> → <code>git rebase --continue</code> · 그만두기 <code>git rebase --abort</code></td></tr></tbody></table>
<p>그다음 main 에서 <code>git merge feature</code> 하면 fast-forward 로 깔끔하게 합쳐져요.</p>
<div class="bk-warn">rebase 는 커밋을 <b>새로 만들어</b>(C' D' — 해시가 바뀜) 바꿔 끼워요. 그래서 <b>이미 push 해서 남과 같이 쓰는 브랜치</b>에는 하지 않아요. 내 컴퓨터에만 있는 내 브랜치를 정리할 때만.</div>` },
    { title: 'merge 냐 rebase 냐', html: `<table class="kb"><tbody><tr><th></th><th>merge</th><th>rebase</th></tr><tr><td>역사 모양</td><td>가지가 갈라졌다 합쳐진 그대로 + 병합 커밋</td><td>한 줄로 곧게</td></tr><tr><td>커밋</td><td>그대로(해시 안 바뀜)</td><td>새로 만들어짐(해시 바뀜)</td></tr><tr><td>안전</td><td>언제나 안전</td><td>남과 같이 쓰는 브랜치엔 금지</td></tr><tr><td>충돌</td><td>한 번에 해결</td><td>커밋마다 나올 수 있음</td></tr></tbody></table>
<p>입문자 규칙: <b>기본은 merge</b>. 혼자 쓰는 브랜치의 역사를 깔끔하게 하고 싶을 때만 rebase. 헷갈리면 merge 를 쓰면 틀릴 일이 없어요.</p>` },
  ],
  T15: [
    { title: '① 메시지 오타 · 빠뜨린 파일: --amend', html: `<p>방금 한 커밋의 메시지를 고치거나, 깜빡한 파일을 <b>같은 커밋에 넣기</b>.</p>
<pre class="code">git commit --amend -m "올바른 메시지"      ← 메시지만 다시

git add 빠뜨린파일.py
git commit --amend --no-edit               ← 파일 넣기(메시지 그대로)</pre>
<p><code>--amend</code> 는 마지막 커밋을 <b>새 커밋으로 바꿔 끼워요</b>. push 하기 <b>전</b>에만 쓰세요(rebase 와 같은 이유).</p>` },
    { title: '② main 에 잘못 커밋했다 → 브랜치로 옮기기', html: `<p>feature 에서 할 일을 main 에서 커밋해 버렸어요. 그 커밋을 새 브랜치로 옮기고 main 은 원래대로:</p>
<pre class="code">git branch feature          ← 지금 커밋(실수한 것)에 feature 이름표를 붙이고
git reset --hard HEAD~1     ← main 이름표만 한 칸 뒤로 (커밋은 feature 가 갖고 있음)
git switch feature          ← 거기서 이어서 작업</pre>
<p>이름표를 먼저 붙였기 때문에 <code>--hard</code> 로 main 을 되돌려도 커밋은 사라지지 않아요(레슨 12 「브랜치는 이름표」). 커밋 안 한 변경이 있으면 먼저 커밋하거나 stash.</p>` },
    { title: '③ 파일을 실수로 지웠다 · ④ 충돌 중 포기', html: `<p><b>③</b> <code>rm app.py</code> 로 지웠거나 탐색기에서 지웠어요. 커밋해 둔 파일이면:</p>
<pre class="code">git status --short     ← " D app.py" (지워짐)
git restore app.py     ← 마지막 커밋 모양으로 되살리기</pre>
<p>지우고 커밋까지 했으면 <code>git restore --source HEAD~1 app.py</code>(하나 전 커밋에서 꺼내기).</p>
<p><b>④</b> merge 하다 충돌이 잔뜩 나서 일단 그만두고 싶어요:</p>
<pre class="code">git merge --abort      ← merge 하기 전 상태로
git rebase --abort     ← rebase 중이었다면</pre>
<p>프롬프트에 <code>(main|MERGING)</code> 처럼 <code>MERGING</code> 이 붙어 있으면 「병합 중」 이에요. 끝내든(add·commit) 그만두든(--abort) 해야 해요.</p>` },
    { title: '⑤ 비밀(.env)을 커밋했다', html: `<p><b>아직 push 전</b>이면 마지막 커밋에서 빼고 다시는 안 담기게:</p>
<pre class="code">git rm --cached .env           ← 커밋 목록에서 빼기(파일은 남김)
echo ".env" &gt;&gt; .gitignore      ← 앞으로 무시
git add .gitignore
git commit --amend --no-edit   ← 마지막 커밋을 .env 없이 다시</pre>
<p>더 전의 커밋에 들어갔으면 역사를 고치는 도구(<code>git filter-repo</code>)가 필요해서 입문 범위를 넘어요.</p>
<div class="bk-warn"><b>이미 push 했다면</b>: 역사에서 지우기 전에 <b>그 비밀번호·키부터 폐기하고 새로 발급</b>하세요. 한 번 공개된 비밀은 지워도 누군가 이미 가져갔다고 봐야 해요.</div>
<table class="kb"><tbody><tr><th>사고</th><th>해결</th></tr><tr><td>메시지 오타·파일 빠짐</td><td><code>git commit --amend</code></td></tr><tr><td>엉뚱한 브랜치에 커밋</td><td><code>git branch 새이름</code> → <code>git reset --hard HEAD~1</code></td></tr><tr><td>파일 지움</td><td><code>git restore 파일</code></td></tr><tr><td>충돌 중 포기</td><td><code>git merge --abort</code></td></tr><tr><td>비밀 커밋(push 전)</td><td><code>git rm --cached</code> + <code>.gitignore</code> + <code>--amend</code></td></tr><tr><td>커밋을 날림</td><td><code>git reflog</code> → <code>git reset --hard 해시</code></td></tr></tbody></table>` },
  ],
  T16: [
    { title: '실제 GitHub ① 계정과 새 저장소', html: `<div class="bk-step-box"><b>계정</b><br><a href="https://github.com/signup" target="_blank" rel="noopener">github.com/signup</a> 에서 이메일 → 비밀번호 → 사용자 이름(Username) → 이메일 인증. 레슨 6 의 <code>user.email</code> 과 같은 이메일이면 내 커밋에 내 프로필이 붙어요.</div>
<div class="bk-step-box"><b>새 저장소</b><br>로그인 → 오른쪽 위 <b>+</b> → <b>New repository</b>.<ul><li><b>Repository name</b>: 예) <code>my-first-repo</code></li><li><b>Public</b>(누구나 봄) / <b>Private</b>(나만) — 연습은 Private 도 좋아요</li><li>내 컴퓨터에 이미 저장소가 있으면 <b>Add a README file</b>·<b>.gitignore</b>·<b>license</b> 는 <b>모두 비워 둬요</b>(빈 저장소여야 그대로 push 돼요)</li><li><b>Create repository</b></li></ul></div>
<p>만든 직후 화면의 <b>「…or push an existing repository from the command line」</b> 칸에 내 저장소 주소가 들어간 명령 세 줄이 나와요. 다음 쪽에서 그대로 써요.</p>` },
    { title: '실제 GitHub ② 첫 push 와 로그인', html: `<p>내 컴퓨터의 저장소 폴더에서(Git Bash):</p>
<pre class="code">git remote add origin https://github.com/내아이디/my-first-repo.git
git branch -M main
git push -u origin main</pre>
<p>레슨 11 의 <code>../remote.git</code> 자리에 진짜 주소가 들어갔을 뿐이에요. (<code>git branch -M main</code> 은 브랜치 이름을 main 으로 맞추는 것 — 이미 main 이면 아무 일 없어요.)</p>
<div class="bk-step-box"><b>처음 push 할 때 로그인</b><br>「Connect to GitHub」 창(Git Credential Manager — 설치 때 고른 것)이 떠요 → <b>Sign in with your browser</b> → 브라우저에서 GitHub 로그인 → <b>Authorize</b>(git-ecosystem 허용) → 창이 닫히고 push 가 이어져요. 한 번 하면 Windows 가 기억해요.</div>
<p>GitHub 저장소 페이지를 새로고침하면 파일과 커밋이 보여요. 이후로는 <b>커밋 → <code>git push</code></b> 만 하면 돼요.</p>
<table class="kb"><tbody><tr><td><code>remote origin already exists</code></td><td>이미 origin 이 있어요 → <code>git remote set-url origin 새주소</code></td></tr><tr><td><code>Permission denied</code> · <code>403</code></td><td>다른 계정으로 로그인돼 있어요 → Windows 「자격 증명 관리자」 → Windows 자격 증명 → <code>git:https://github.com</code> 제거 후 다시 push</td></tr><tr><td><code>rejected … fetch first</code></td><td>GitHub 에 내가 없는 커밋(예: 웹에서 만든 README)이 있어요 → <code>git pull</code> 후 push</td></tr></tbody></table>` },
    { title: '실제 GitHub ③ 남의 저장소 받기 · fork', html: `<table class="kb"><tbody><tr><td><b>clone</b></td><td>저장소 페이지의 초록 <b>&lt;&gt; Code</b> 단추 → HTTPS 주소 복사 → <code>git clone 주소</code></td></tr><tr><td><b>fork</b></td><td>남의 저장소를 <b>내 계정으로 복사</b>(오른쪽 위 <b>Fork</b> → <b>Create fork</b>). 남의 저장소엔 push 권한이 없으니, 내 fork 에 push 하고 PR 로 「받아 주세요」 해요</td></tr></tbody></table>
<pre class="code">남의 저장소 ──Fork──▶ 내 GitHub 의 복사본 ──clone──▶ 내 컴퓨터
                       ▲                                │
                       └──────────── push ──────────────┘
남의 저장소 ◀──── Pull Request(「내 변경을 합쳐 주세요」) ────</pre>` },
    { title: '실제 GitHub ④ Pull Request 흐름', html: `<p>여럿이 일할 때(혼자여도 연습으로) main 에 바로 push 하지 않고 이렇게 해요:</p>
<ol><li><code>git switch -c fix-typo</code> — 브랜치 만들기</li><li>고치고 <code>git add</code> · <code>git commit -m "README 오타 수정"</code></li><li><code>git push -u origin fix-typo</code> — 브랜치를 올리기</li><li>GitHub 저장소 페이지 위에 노란 띠 <b>「fix-typo had recent pushes」</b> → <b>Compare &amp; pull request</b></li><li>제목·설명(무엇을 왜) 쓰고 <b>Create pull request</b></li><li>(동료가) <b>Files changed</b> 탭에서 줄마다 의견 = <b>리뷰</b>. 고칠 게 있으면 같은 브랜치에 커밋·push 하면 PR 에 자동으로 붙어요</li><li><b>Merge pull request</b> → <b>Confirm merge</b> → <b>Delete branch</b></li><li>내 컴퓨터: <code>git switch main</code> → <code>git pull</code> → <code>git branch -d fix-typo</code></li></ol>
<p>이 사이트(파이썬 아카데미)도 이 흐름으로 만들어지고 있어요 — PR 마다 자동 검사(CI)가 돌고, 통과하면 합쳐져요.</p>` },
  ],
};
// 예제 상자 머리말: Git 예제는 레슨 7 에서 만드는 연습 저장소(gitplay)를 레슨 14 까지 이어 써요(원격은 레슨 11 의 remoteplay)
const GIT_EX_LABEL = { T6: '예제 명령 — Git Bash 어디서나 (이름·이메일은 내 것으로)', T11: '예제 명령 — 연습 원격(~/terminal-study/remoteplay)에서 한 줄씩', 'T13/2': '충돌이 났을 때 치는 순서 — menu.txt 자리에 충돌 난 파일 이름' };
for (const [lid, pgs] of Object.entries(GIT_PAGES)) pgs.forEach((pg, i) => { if (pg.example && !pg.example.label) pg.example.label = GIT_EX_LABEL[`${lid}/${i}`] || GIT_EX_LABEL[lid] || '예제 명령 — 레슨 7 에서 만든 연습 저장소(~/terminal-study/gitplay)에서 한 줄씩 (레슨 7 → 14 이어서)'; });
// 레슨 쪽 → lessonPages
Object.assign(BOOK.lessonPages, GIT_PAGES);
Object.assign(BOOK.tasks, {
  T6: [
    { title: 'Git 처음 설정 (필수 — 레슨 7 전에 꼭)', text: '<b>레슨 7 부터의 모든 Git 문제가 이 설정이 돼 있어야 돌아가요.</b> 레슨 6 · 3쪽처럼 내 이름과 이메일을 Git 에 알려 주고, 한글 파일 이름이 깨지지 않게·pull 이 멈추지 않게 설정하세요. 끝나면 확인 명령으로 이름과 이메일이 보여야 해요. (이름·이메일은 내 것으로 — 아래 결과의 <code>지훈</code>·<code>me@example.com</code> 자리)',
      setup: TS('t6-1', []), needs: [['git config --global user.name', 'T6/2', '이름'], ['git config --global user.email', 'T6/2', '이메일'], ['core.quotepath false', 'T6/2', '한글 파일 이름'], ['pull.rebase false', 'T6/2', 'pull 이 멈추지 않게']],
      answer: 'git config --global user.name "지훈"\ngit config --global user.email "me@example.com"\ngit config --global core.quotepath false\ngit config --global pull.rebase false', check: 'git config --global user.name\ngit config --global user.email', io: [{ output: '지훈\nme@example.com' }] },
  ],
  T7: [
    { title: '첫 저장소, 첫 커밋', text: '이 폴더를 Git 저장소로 만들고 <code>hello.py</code> <b>만</b> 담아 <code>hello 추가</code> 라는 메시지로 커밋하세요. <code>notes.txt</code> 는 아직 커밋하지 않아요.',
      setup: TS('t7-1', [TF('hello.py', ['print("hello")']), TF('notes.txt', ['메모'])]), needs: [['git init', 'T7/1', '저장소 만들기'], ['git add 파일', 'T7/2', '바구니에 담기'], ['git commit -m', 'T7/3', '기록'], ['git status', 'T7/1', '확인']],
      answer: 'git init\ngit add hello.py\ngit commit -m "hello 추가"', check: 'git log --format=%s\ngit status --short', io: [{ output: 'hello 추가\n?? notes.txt' }] },
    { title: '세 칸 읽기', text: '이 저장소에는 ① 커밋한 뒤 고친 파일 ② add 한 새 파일 ③ Git 이 모르는 파일이 하나씩 있어요. <b>짧은 상태</b>를 보고 어느 파일이 어느 칸인지 맞혀 보세요.',
      setup: TS('t7-2', [GI, TF('a.txt', ['처음']), GC('a 추가'), TF('a.txt', ['고침']), TF('b.txt', ['새 파일']), 'git add b.txt', TF('c.txt', ['모르는 파일'])]), needs: [['git status --short', 'T7/1', '두 글자: 왼쪽 스테이징 · 오른쪽 작업 폴더']],
      answer: 'git status --short', io: [{ output: ' M a.txt\nA  b.txt\n?? c.txt' }] },
    { title: '커밋을 두 개로 나누기', text: '파일 세 개를 만들었어요. 「한 커밋 = 한 가지 일」 로 ① <code>README.md</code> 만 <code>README 작성</code> ② <code>login.py</code>·<code>signup.py</code> 를 <code>로그인과 회원가입</code> — 커밋 두 개로 남기세요.',
      setup: TS('t7-3', [GI, TF('README.md', ['# 내 앱']), TF('login.py', ['def login(): pass']), TF('signup.py', ['def signup(): pass'])]), needs: [['git add 파일', 'T7/2', '골라 담기'], ['git commit -m', 'T7/3', '기록'], ['*.py', 'T4/0', '.py 전부']],
      answer: 'git add README.md\ngit commit -m "README 작성"\ngit add login.py signup.py\ngit commit -m "로그인과 회원가입"', check: 'git log --format=%s\ngit status --short', io: [{ output: '로그인과 회원가입\nREADME 작성' }] },
  ],
  T8: [
    { title: '바뀐 줄 찾기', text: '<code>menu.txt</code> 를 누가 고쳤어요(아직 add 안 함). <code>git diff</code> 로 <b>지워진 줄</b>과 <b>새로 생긴 줄</b>을 찾으세요.',
      setup: TS('t8-1', [GI, TF('menu.txt', ['americano 4000', 'latte 4500', 'mocha 5000']), GC('메뉴판'), TF('menu.txt', ['americano 4000', 'latte 5000', 'mocha 5000'])]), needs: [['git diff', 'T8/1', '작업 폴더 ↔ 스테이징'], ['- · +', 'T8/1', '지워진 줄 · 생긴 줄']],
      answer: 'git diff', run: "git diff | grep '^[-+][^-+]'", io: [{ output: '-latte 4500\n+latte 5000' }] },
    { title: '커밋할 것 미리 보기', text: '<code>price.txt</code> 를 고쳐 <b>add 까지</b> 했어요. 이 상태에서 그냥 <code>git diff</code> 를 치면 아무것도 안 나와요. 「커밋에 들어갈 변경」 을 보는 명령으로 보세요.',
      setup: TS('t8-2', [GI, TF('price.txt', ['coffee 3000']), GC('가격표'), TF('price.txt', ['coffee 3500']), 'git add price.txt']), needs: [['git diff --staged', 'T8/1', '스테이징 ↔ 마지막 커밋']],
      answer: 'git diff\ngit diff --staged', run: "git diff --staged | grep '^[-+][^-+]'", io: [{ output: '-coffee 3000\n+coffee 3500' }] },
    { title: '그 파일을 바꾼 커밋은?', text: '커밋이 네 개 있어요. 그중 <code>price.txt</code> 를 바꾼 커밋들만 한 줄씩 보세요. (결과 앞의 7글자 해시는 컴퓨터마다 달라요 — 아래는 메시지만)',
      setup: TS('t8-3', [GI, TF('menu.txt', ['menu']), GC('메뉴 추가'), TF('price.txt', ['3000']), GC('가격 추가'), TF('menu.txt', ['menu', 'tea']), GC('차 메뉴'), TF('price.txt', ['3500']), GC('가격 올림')]), needs: [['git log --oneline 파일', 'T8/0', '그 파일을 바꾼 커밋만']],
      answer: 'git log --oneline price.txt', run: 'git log --format=%s price.txt', io: [{ output: '가격 올림\n가격 추가' }] },
  ],
  T9: [
    { title: '망친 파일 되살리기', text: '<code>app.py</code> 를 실수로 덮어써서 엉망이 됐어요(아직 커밋 안 함). 마지막 커밋 상태로 되돌리세요.',
      setup: TS('t9-1', [GI, TF('app.py', ['print("잘 되던 코드")']), GC('잘 되는 버전'), TF('app.py', ['망친 코드'])]), needs: [['git restore 파일', 'T9/0', '마지막 커밋 상태로']],
      answer: 'git restore app.py', check: 'cat app.py\ngit status --short', io: [{ output: 'print("잘 되던 코드")' }] },
    { title: '잘못 담은 것 빼기', text: '<code>git add .</code> 를 했더니 <code>secret.txt</code> 까지 바구니에 담겼어요. <code>secret.txt</code> <b>만</b> 바구니에서 빼세요. 파일은 지우지 않아요.',
      setup: TS('t9-2', [GI, TF('main.py', ['print(1)']), GC('시작'), TF('feature.py', ['print(2)']), TF('secret.txt', ['password=1234']), 'git add .']), needs: [['git restore --staged', 'T9/0', '바구니에서 빼기(내용은 그대로)']],
      answer: 'git restore --staged secret.txt', check: 'git status --short', io: [{ output: 'A  feature.py\n?? secret.txt' }] },
    { title: '마지막 커밋 취소(파일은 남기고)', text: '방금 커밋 <code>대충 커밋</code> 이 마음에 안 들어요. 이 커밋을 <b>취소</b>하되, 파일 내용은 그대로 두고 바구니도 비운 상태로 만드세요(다시 나눠 커밋할 수 있게).',
      setup: TS('t9-3', [GI, TF('a.txt', ['a']), GC('첫 커밋'), TF('b.txt', ['b']), TF('c.txt', ['c']), GC('대충 커밋')]), needs: [['git reset HEAD~1', 'T9/1', '커밋 취소 · 파일 남김(mixed)'], ['HEAD~1', 'T9/1', '하나 전 커밋']],
      answer: 'git reset HEAD~1', check: 'git log --format=%s\ngit status --short', io: [{ output: '첫 커밋\n?? b.txt\n?? c.txt' }] },
    { title: '다 버리고 마지막 커밋으로', text: '여러 파일을 이것저것 고쳐 봤는데 다 엉망이에요. 커밋 안 한 변경을 <b>전부</b> 버리고 마지막 커밋 상태로 한 번에 돌아가세요.',
      setup: TS('t9-4', [GI, TF('a.txt', ['A']), TF('b.txt', ['B']), GC('깨끗한 상태'), TF('a.txt', ['엉망']), TF('b.txt', ['엉망']), 'git add a.txt']), needs: [['git reset --hard', 'T9/2', '커밋 안 한 변경 전부 버리기 ⚠']],
      answer: 'git reset --hard', check: 'cat a.txt b.txt\ngit status --short', io: [{ output: 'A\nB' }] },
  ],
  T10: [
    { title: '.gitignore 만들기', text: '이 프로젝트에는 올리면 안 되는 것(<code>debug.log</code>, <code>__pycache__</code> 폴더, <code>.env</code>)이 섞여 있어요. <code>.gitignore</code> 를 만들어 세 가지를 무시하게 하세요. <code>git status --short</code> 에 <code>.gitignore</code> 와 <code>main.py</code> 만 보이면 돼요.',
      setup: TS('t10-1', [GI, 'mkdir __pycache__', TF('main.py', ['print(1)']), TF('debug.log', ['log']), TF('__pycache__/main.cpython-313.pyc', ['x']), TF('.env', ['API_KEY=abc'])]), needs: [['*.log', 'T10/0', '.log 전부'], ['__pycache__/', 'T10/0', '폴더 통째로'], ['.env', 'T10/0', '파일 하나'], ['echo >> .gitignore', 'T3/1', '한 줄씩 이어 쓰기']],
      answer: 'echo "*.log" >> .gitignore\necho "__pycache__/" >> .gitignore\necho ".env" >> .gitignore', check: 'git status --short', io: [{ output: '?? .gitignore\n?? main.py' }] },
    { title: '이미 커밋한 로그 파일 빼기', text: '<code>debug.log</code> 를 이미 커밋해 버렸어요. 파일은 내 폴더에 <b>남기고</b> Git 의 추적에서만 빼고, 앞으로 <code>*.log</code> 를 무시하게 한 뒤 <code>로그 파일 추적 그만</code> 으로 커밋하세요.',
      setup: TS('t10-2', [GI, TF('main.py', ['print(1)']), TF('debug.log', ['log']), GC('처음')]), needs: [['git rm --cached', 'T10/2', '추적만 그만'], ['.gitignore', 'T10/0', '앞으로 무시'], ['git ls-files', 'T10/2', '추적 목록']],
      answer: 'git rm --cached debug.log\necho "*.log" >> .gitignore\ngit add .gitignore\ngit commit -m "로그 파일 추적 그만"', check: 'git ls-files\nls debug.log\ngit status --short', io: [{ output: '.gitignore\nmain.py\ndebug.log' }] },
  ],
  TB2: [
    { title: '의미 있는 커밋 3개', text: '작은 계산기 프로젝트를 저장소로 만들고, 아래 <b>순서와 메시지</b>로 커밋 세 개를 남기세요. 비밀(<code>.env</code>)과 로그(<code>*.log</code>)는 절대 커밋되면 안 돼요.<ol><li><code>.gitignore</code> 만 — 메시지 <code>gitignore 추가</code> (.env 와 *.log 무시)</li><li><code>calc.py</code>·<code>main.py</code> — <code>계산 기능</code></li><li><code>README.md</code> — <code>사용법 문서</code></li></ol>',
      setup: TS('tb2-1', [TF('calc.py', ['def add(a, b):', '    return a + b']), TF('main.py', ['from calc import add', 'print(add(2, 3))']), TF('README.md', ['# 계산기', 'python main.py']), TF('.env', ['TOKEN=secret']), TF('run.log', ['ok'])]), needs: [['git init', 'T7/1', '저장소'], ['.gitignore', 'T10/0', '무시 규칙'], ['git add 파일', 'T7/2', '골라 담기'], ['git commit -m', 'T7/3', '기록'], ['git status', 'T7/1', '확인']],
      answer: 'git init\necho ".env" >> .gitignore\necho "*.log" >> .gitignore\ngit add .gitignore\ngit commit -m "gitignore 추가"\ngit add calc.py main.py\ngit commit -m "계산 기능"\ngit add README.md\ngit commit -m "사용법 문서"',
      check: "for c in $(git rev-list --reverse HEAD); do git show --name-only --format='[%s]' $c; done\ngit status --short", io: [{ output: '[gitignore 추가]\n\n.gitignore\n[계산 기능]\n\ncalc.py\nmain.py\n[사용법 문서]\n\nREADME.md' }] },
    { title: '🏠 일기장 버전 관리', text: '일기 폴더를 저장소로 만들어요. ① <code>diary.txt</code> 를 <code>11월 5일</code> 로 커밋 ② 맨 끝에 <code>11/6 Git 배움</code> 한 줄을 붙여 <code>11월 6일</code> 로 커밋 ③ 그런데 실수로 <code>echo 망함 &gt; diary.txt</code>(<code>&gt;</code> 하나!)를 쳐 버렸어요 — 마지막 커밋 상태로 되살리세요.',
      setup: TS('tb2-2', [TF('diary.txt', ['11/5 터미널 배움'])]), needs: [['git init', 'T7/1', '저장소'], ['>>', 'T3/1', '이어 쓰기'], ['git commit -am', 'T7/3', '(추적 중인 파일) add 와 commit 한 번에'], ['git restore', 'T9/0', '되살리기']],
      answer: 'git init\ngit add diary.txt\ngit commit -m "11월 5일"\necho "11/6 Git 배움" >> diary.txt\ngit commit -am "11월 6일"\necho 망함 > diary.txt\ngit restore diary.txt', check: 'cat diary.txt\ngit log --format=%s', io: [{ output: '11/5 터미널 배움\n11/6 Git 배움\n11월 6일\n11월 5일' }] },
  ],
  T11: [
    { title: '가짜 GitHub 에 첫 push', text: '<code>me</code> 저장소(커밋 1개)와 빈 원격 <code>remote.git</code> 이 있어요. 지금 <code>me</code> 안에 있어요. <code>../remote.git</code> 을 <code>origin</code> 으로 등록하고 main 을 올리세요(처음이니 짝짓기까지).',
      setup: TS('t11-1', ['git init -q --bare remote.git', `${GI} me && cd me`, TF('app.py', ['print("v1")']), GC('첫 버전')]), needs: [['git remote add origin', 'T11/2', '원격 등록'], ['git push -u origin main', 'T11/2', '처음 올리기'], ['../', 'T1/2', '한 칸 위 폴더']],
      answer: 'git remote add origin ../remote.git\ngit push -u origin main', check: 'git -C ../remote.git log --format=%s main\ngit status -sb | head -n 1', io: [{ output: '첫 버전\n## main...origin/main' }] },
    { title: 'clone 으로 통째로 받기', text: '원격 <code>remote.git</code> 에 커밋이 두 개 있어요. 이걸 <code>mycopy</code> 라는 폴더로 받아 들어가서, 파일과 커밋 목록을 보세요.',
      setup: TS('t11-2', ['git init -q --bare remote.git', `${GI} tmp && cd tmp`, TF('a.txt', ['A']), GC('a 추가'), TF('b.txt', ['B']), GC('b 추가'), 'git push -q ../remote.git main && cd .. && rm -rf tmp']), needs: [['git clone 주소 폴더', 'T11/3', '통째로 받기'], ['cd', 'T0/2', '들어가기'], ['git log', 'T8/0', '커밋 목록']],
      answer: 'git clone remote.git mycopy\ncd mycopy\nls -1\ngit log --oneline', run: 'git clone -q remote.git mycopy\ncd mycopy\nls -1\ngit log --format=%s', io: [{ output: 'a.txt\nb.txt\nb 추가\na 추가' }] },
    { title: '친구가 올린 것 받기', text: '나(<code>me</code>)와 친구(<code>friend</code>)가 같은 원격을 써요. 방금 친구가 <code>todo.txt</code> 에 한 줄을 더해 push 했어요. 지금 <code>me</code> 안에 있어요. 친구의 커밋을 받아 오세요.',
      setup: TS('t11-3', ['git init -q --bare remote.git', 'git clone -q remote.git me 2>/dev/null && cd me', TF('todo.txt', ['- 장보기']), GC('할 일 시작'), 'git push -q -u origin main', 'cd .. && git clone -q remote.git friend && cd friend', 'echo "- 빨래 (친구)" >> todo.txt', GC('빨래 추가'), 'git push -q && cd ../me']), needs: [['git pull', 'T11/3', '받아 합치기']],
      answer: 'git pull', check: 'cat todo.txt\ngit log --format=%s', io: [{ output: '- 장보기\n- 빨래 (친구)\n빨래 추가\n할 일 시작' }] },
  ],
  T12: [
    { title: '브랜치에서 실험하기', text: '<code>feature</code> 브랜치를 만들어 옮긴 다음 <code>chart.py</code> 를 만들어 <code>차트 실험</code> 으로 커밋하세요. 그다음 <b>main 으로 돌아오면</b> <code>chart.py</code> 가 폴더에서 사라져 보이는 걸 확인하세요(feature 에만 있으니까).',
      setup: TS('t12-1', [GI, TF('app.py', ['print("앱")']), GC('앱 시작')]), needs: [['git switch -c', 'T12/1', '만들고 옮기기'], ['git switch main', 'T12/1', '돌아오기'], ['ls', 'T1/1', '폴더 보기']],
      answer: 'git switch -c feature\necho "print(\\"chart\\")" > chart.py\ngit add chart.py\ngit commit -m "차트 실험"\ngit switch main\nls', check: 'git branch --show-current\nls -1\ngit log --format=%s feature', io: [{ output: 'main\napp.py\n차트 실험\n앱 시작' }] },
    { title: '지금 어느 브랜치?', text: '브랜치가 몇 개 있어요. 목록을 보고 <b>지금 있는 브랜치</b>(<code>*</code>)가 무엇인지 찾으세요.',
      setup: TS('t12-2', [GI, TF('a.txt', ['a']), GC('첫'), 'git branch login-page', 'git branch fix-bug', 'git switch -q login-page']), needs: [['git branch', 'T12/1', '목록과 * 표시']],
      answer: 'git branch', io: [{ output: '  fix-bug\n* login-page\n  main' }] },
    { title: '다 쓴 브랜치 지우기', text: '<code>old-idea</code> 브랜치는 이미 main 에 합쳤어요. main 으로 옮겨서 <code>old-idea</code> 를 지우세요.',
      setup: TS('t12-3', [GI, TF('a.txt', ['a']), GC('첫'), 'git switch -qc old-idea', TF('b.txt', ['b']), GC('아이디어'), 'git switch -q main', 'git merge -q old-idea', 'git switch -q old-idea']), needs: [['git switch main', 'T12/1', '옮기기(지금 브랜치는 못 지움)'], ['git branch -d', 'T12/1', '합친 브랜치 지우기']],
      answer: 'git switch main\ngit branch -d old-idea', check: 'git branch', io: [{ output: '* main' }] },
  ],
  T13: [
    { title: 'fast-forward 로 합치기', text: '<code>feature</code> 에 커밋 두 개가 있고, main 은 그사이 그대로예요. main 으로 가서 feature 를 합치세요.',
      setup: TS('t13-1', [GI, TF('a.txt', ['a']), GC('시작'), 'git switch -qc feature', TF('b.txt', ['b']), GC('기능 1'), TF('c.txt', ['c']), GC('기능 2')]), needs: [['git switch main', 'T12/1', 'main 으로'], ['git merge', 'T13/0', '합치기']],
      answer: 'git switch main\ngit merge feature', check: 'git log --format=%s\nls -1', io: [{ output: '기능 2\n기능 1\n시작\na.txt\nb.txt\nc.txt' }] },
    { title: '양쪽 다 바뀌었을 때 합치기', text: 'main 과 <code>feature</code> 가 서로 <b>다른 파일</b>을 커밋했어요. main 에서 feature 를 합치되, 편집기 없이 기본 메시지로 병합 커밋을 만드세요.',
      setup: TS('t13-2', [GI, TF('a.txt', ['a']), GC('시작'), 'git switch -qc feature', TF('style.css', ['body {}']), GC('스타일'), 'git switch -q main', TF('readme.txt', ['설명']), GC('설명서')]), needs: [['git merge --no-edit', 'T13/0', '3-way 병합 · 기본 메시지']],
      answer: 'git merge --no-edit feature', check: 'git log --format=%s -n 1\nls -1', io: [{ output: "Merge branch 'feature'\na.txt\nreadme.txt\nstyle.css" }] },
    { title: '충돌 해결하기', text: 'main 은 라떼를 <code>5000</code>, <code>feature</code> 는 <code>4800</code> 으로 고쳤어요. 합치면 충돌이 나요. 회의 결과 <b>4800</b> 으로 하기로 했어요 — 파일을 <code>americano 4000</code> / <code>latte 4800</code> 두 줄로 고치고(마커 없이) 해결을 마치세요.',
      setup: TS('t13-3', [GI, TF('menu.txt', ['americano 4000', 'latte 4500']), GC('메뉴판'), 'git switch -qc feature', TF('menu.txt', ['americano 4000', 'latte 4800']), GC('라떼 4800'), 'git switch -q main', TF('menu.txt', ['americano 4000', 'latte 5000']), GC('라떼 5000')]), needs: [['git merge', 'T13/0', '합치기'], ['<<<<<<< ======= >>>>>>>', 'T13/1', '충돌 표시'], ['notepad 파일', 'T3/3', '편집기로 고치기'], ['git add → git commit', 'T13/2', '해결 표시 → 마치기']],
      answer: 'git merge --no-edit feature\nnotepad menu.txt      # 마커 세 줄을 지우고 latte 4800 만 남겨 저장\ngit add menu.txt\ngit commit --no-edit', run: "git merge --no-edit feature\nprintf '%s\\n' 'americano 4000' 'latte 4800' > menu.txt\ngit add menu.txt\ngit commit -q --no-edit", check: "cat menu.txt\ngrep -c '<<<<<<<' menu.txt\ngit status --short\ngit log --format=%s -n 1", io: [{ output: "americano 4000\nlatte 4800\n0\nMerge branch 'feature'" }] },
  ],
  T14: [
    { title: '하던 일 잠깐 치우기', text: '<code>app.py</code> 를 고치던 중(커밋 안 함)인데 급하게 깨끗한 상태가 필요해요. 변경을 stash 로 치워서 <code>git status</code> 가 깨끗한 걸 확인한 다음, 다시 꺼내 원래대로 이어 가세요.',
      setup: TS('t14-1', [GI, TF('app.py', ['print("v1")']), GC('v1'), 'echo "print(\\"작업 중\\")" >> app.py']), needs: [['git stash', 'T14/0', '치우기'], ['git stash pop', 'T14/0', '다시 꺼내기'], ['git status', 'T7/1', '확인']],
      answer: 'git stash\ngit status --short\ngit stash pop', check: 'cat app.py\ngit status --short\ngit stash list | wc -l', io: [{ output: 'print("v1")\nprint("작업 중")\n M app.py\n0' }] },
    { title: '내 커밋을 최신 main 끝으로', text: '<code>feature</code> 를 만든 뒤 main 에 <code>보안 수정</code> 커밋이 생겼어요. 지금 feature 에 있어요. feature 의 커밋을 main 끝으로 옮겨 한 줄 역사로 만드세요.',
      setup: TS('t14-2', [GI, TF('a.txt', ['a']), GC('시작'), 'git switch -qc feature', TF('f.txt', ['f']), GC('내 기능'), 'git switch -q main', TF('s.txt', ['s']), GC('보안 수정'), 'git switch -q feature']), needs: [['git rebase main', 'T14/1', 'main 끝으로 옮기기']],
      answer: 'git rebase main', check: 'git log --format=%s\nls -1', io: [{ output: '내 기능\n보안 수정\n시작\na.txt\nf.txt\ns.txt' }] },
  ],
  T15: [
    { title: '① 메시지 오타 고치기', text: '방금 커밋 메시지를 <code>로긴 추가</code> 라고 잘못 썼어요. <code>로그인 추가</code> 로 고치세요(아직 push 안 함).',
      setup: TS('t15-1', [GI, TF('login.py', ['def login(): pass']), GC('로긴 추가')]), needs: [['git commit --amend -m', 'T15/0', '마지막 커밋 메시지 다시']],
      answer: 'git commit --amend -m "로그인 추가"', check: 'git log --format=%s', io: [{ output: '로그인 추가' }] },
    { title: '② main 에 잘못 커밋 → 브랜치로 옮기기', text: '<code>실험 기능</code> 커밋을 feature 에서 해야 했는데 main 에서 해 버렸어요. 그 커밋을 새 브랜치 <code>experiment</code> 로 옮기고, main 은 <code>안정 버전</code> 으로 되돌리세요.',
      setup: TS('t15-2', [GI, TF('app.py', ['print(1)']), GC('안정 버전'), TF('exp.py', ['print("실험")']), GC('실험 기능')]), needs: [['git branch 이름', 'T15/1', '지금 커밋에 이름표'], ['git reset --hard HEAD~1', 'T15/1', 'main 만 한 칸 뒤로']],
      answer: 'git branch experiment\ngit reset --hard HEAD~1', check: 'git log --format=%s main\ngit log --format=%s experiment', io: [{ output: '안정 버전\n실험 기능\n안정 버전' }] },
    { title: '③ 지운 파일 되살리기', text: '<code>rm app.py</code> 로 파일을 지워 버렸어요(커밋은 해 뒀어요). 되살리세요.',
      setup: TS('t15-3', [GI, TF('app.py', ['print("소중한 코드")']), GC('앱'), 'rm app.py']), needs: [['git status --short', 'T7/1', ' D = 지워짐'], ['git restore', 'T15/2', '되살리기']],
      answer: 'git status --short\ngit restore app.py', check: 'cat app.py\ngit status --short', io: [{ output: 'print("소중한 코드")' }] },
    { title: '④ 충돌 중 포기하기', text: '합치다가 충돌이 났어요(프롬프트에 <code>MERGING</code>). 오늘은 그만두고 합치기 <b>전</b> 상태로 돌아가세요.',
      setup: TS('t15-4', [GI, TF('a.txt', ['원래']), GC('시작'), 'git switch -qc other', TF('a.txt', ['다른쪽']), GC('다른쪽'), 'git switch -q main', TF('a.txt', ['이쪽']), GC('이쪽'), 'git merge -q other >/dev/null 2>&1; true']), needs: [['git merge --abort', 'T15/2', '합치기 그만두기']],
      answer: 'git merge --abort', check: 'cat a.txt\ngit status --short\ngit log --format=%s -n 1', io: [{ output: '이쪽\n이쪽' }] },
    { title: '⑤ 비밀을 커밋했다(push 전)', text: '방금 <code>설정 추가</code> 커밋에 <code>.env</code>(비밀키)가 같이 들어갔어요. 아직 push 전이에요. <code>.env</code> 를 그 커밋에서 빼고(파일은 남기고) 앞으로 무시하도록 <code>.gitignore</code> 를 같은 커밋에 넣으세요. 메시지는 그대로.',
      setup: TS('t15-5', [GI, TF('app.py', ['print(1)']), GC('앱'), TF('config.py', ['DEBUG = False']), TF('.env', ['KEY=secret']), GC('설정 추가')]), needs: [['git rm --cached', 'T10/2', '추적에서만 빼기'], ['.gitignore', 'T10/0', '앞으로 무시'], ['git commit --amend --no-edit', 'T15/0', '마지막 커밋 다시(메시지 그대로)']],
      answer: 'git rm --cached .env\necho ".env" >> .gitignore\ngit add .gitignore\ngit commit --amend --no-edit', check: 'git show --name-only --format=%s HEAD\nls -a | grep env', io: [{ output: '설정 추가\n\n.gitignore\nconfig.py\n.env' }] },
  ],
  T16: [
    { title: '내 GitHub 에 첫 저장소 올리기', text: '레슨 16 의 ①~② 를 따라 실제 GitHub 에 올려 보세요. 올릴 저장소는 아무거나 — 예: TB2 의 계산기(<code>~/terminal-study/tb2-1</code>). GitHub 저장소 페이지에 파일 세 개(<code>.gitignore</code>, <code>calc.py</code> …)와 커밋 3개가 보이고, <b><code>.env</code> 는 없으면</b> 성공이에요.',
      needs: [['New repository', 'T16/0', 'GitHub 에서 빈 저장소'], ['git remote add origin https://…', 'T16/1', '진짜 주소 등록'], ['git push -u origin main', 'T16/1', '첫 push · 브라우저 로그인']],
      answer: 'cd ~/terminal-study/tb2-1\ngit remote add origin https://github.com/내아이디/calc.git\ngit branch -M main\ngit push -u origin main', noRun: true },
    { title: '혼자 해 보는 Pull Request', text: '위 저장소에서 레슨 16 · 4쪽의 PR 흐름을 한 바퀴 해 보세요: 브랜치 <code>docs-update</code> → README 에 한 줄 추가 → 커밋 → <code>git push -u origin docs-update</code> → GitHub 에서 <b>Compare &amp; pull request</b> → <b>Create pull request</b> → <b>Merge pull request</b> → 내 컴퓨터에서 main 으로 pull. 끝나면 <code>git log --oneline</code> 에 그 커밋이 main 에 있어야 해요.',
      needs: [['git switch -c', 'T12/1', '브랜치'], ['git push -u origin 브랜치', 'T16/3', '브랜치 올리기'], ['Compare & pull request', 'T16/3', 'GitHub 단추'], ['git pull', 'T11/3', '합쳐진 main 받기']],
      answer: 'git switch -c docs-update\necho "- 덧셈만 돼요" >> README.md\ngit commit -am "README 에 기능 설명"\ngit push -u origin docs-update\n(GitHub 에서 PR 만들고 Merge)\ngit switch main\ngit pull\ngit branch -d docs-update', noRun: true },
  ],
  TB3: [
    { title: '충돌 해결하고 push', text: '친구(<code>friend</code>)가 방금 <code>menu.txt</code> 의 라떼를 <code>4800</code> 으로 바꿔 push 했어요. 나(<code>me</code>, 지금 여기)는 같은 줄을 <code>5000</code> 으로 바꿔 <b>커밋만</b> 해 둔 상태예요. 받아서 충돌을 <b>둘 다 살려</b> <code>latte 4800 (점심 할인 5000→4800)</code> 한 줄로 해결하고, 원격에 올리세요. 원격 main 에 병합 커밋이 1개(전체 커밋 4개: 메뉴판·라떼 할인·라떼 인상·병합) 있고 마커가 없어야 해요. <span class="muted small">(확인 명령의 <code>git -C 폴더</code> = 그 폴더에서 git 을 실행)</span>',
      setup: TS('tb3-1', ['git init -q --bare remote.git', 'git clone -q remote.git me 2>/dev/null && cd me', TF('menu.txt', ['americano 4000', 'latte 4500']), GC('메뉴판'), 'git push -q -u origin main', 'cd .. && git clone -q remote.git friend && cd friend', TF('menu.txt', ['americano 4000', 'latte 4800']), GC('라떼 할인'), 'git push -q && cd ../me', TF('menu.txt', ['americano 4000', 'latte 5000']), GC('라떼 인상')]),
      needs: [['git push', 'T11/2', '거절되면 먼저 pull'], ['git pull', 'T11/3', '받아 합치기 → 충돌'], ['<<<<<<< ======= >>>>>>>', 'T13/1', '충돌 표시'], ['git add → git commit', 'T13/2', '해결 마치기']],
      answer: 'git push                 # rejected (fetch first) — 원격에 친구 커밋이 있어서\ngit pull --no-edit       # 충돌!\nnotepad menu.txt         # 마커를 지우고 latte 줄을 아래처럼 한 줄로\ngit add menu.txt\ngit commit --no-edit\ngit push',
      run: "git pull -q --no-edit >/dev/null 2>&1; true\nprintf '%s\\n' 'americano 4000' 'latte 4800 (점심 할인 5000→4800)' > menu.txt\ngit add menu.txt\ngit commit -q --no-edit\ngit push -q", check: "git -C ../remote.git show main:menu.txt\ngit -C ../remote.git log --merges --oneline main | wc -l\ngit -C ../remote.git log --oneline main | wc -l", io: [{ output: "americano 4000\nlatte 4800 (점심 할인 5000→4800)\n1\n4" }] },
    { title: '🏠 집 컴퓨터와 학교 컴퓨터', text: '같은 원격을 집(<code>home</code>)과 학교(<code>school</code>) 두 곳에서 써요. 학교에서 <code>hw.py</code> 를 만들어 push 해 둔 상태예요. 지금 <b>집</b>(<code>home</code>)에 있어요. ① 먼저 받고 ② <code>hw.py</code> 끝에 <code>print("집에서 마무리")</code> 를 붙여 <code>숙제 마무리</code> 로 커밋해 ③ 올리세요. 마지막으로 ④ 학교 폴더(<code>../school</code>)로 가서 받아 두세요(다음 날 학교에서 이어 하게).',
      setup: TS('tb3-2', ['git init -q --bare remote.git', 'git clone -q remote.git home 2>/dev/null', 'cd home', TF('readme.txt', ['숙제 저장소']), GC('시작'), 'git push -q -u origin main && cd ..', 'git clone -q remote.git school && cd school', TF('hw.py', ['print("학교에서 시작")']), GC('숙제 시작'), 'git push -q && cd ../home']),
      needs: [['git pull', 'T11/3', '일 시작 전 받기'], ['>>', 'T3/1', '끝에 이어 쓰기'], ['git commit -am', 'T7/3', 'add + commit'], ['git push', 'T11/2', '올리기']],
      answer: 'git pull\necho "print(\\"집에서 마무리\\")" >> hw.py\ngit commit -am "숙제 마무리"\ngit push\ncd ../school\ngit pull', check: 'cat hw.py\ngit log --format=%s', io: [{ output: 'print("학교에서 시작")\nprint("집에서 마무리")\n숙제 마무리\n숙제 시작\n시작' }] },
  ],
});
