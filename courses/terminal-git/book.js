// courses/terminal-git/book.js — 터미널·Git 「교과서」 모드 데이터 (v2.10.0, 사용자 결정 2026-11-06 「2번(SQL·터미널·웹 교과서) 해」 · 「내 컴퓨터 도구로」 · 「터미널·Git 먼저」).
// 화면은 core/ui-views-book.js (파이썬 교과서와 같은 틀). 연습은 사용자의 진짜 터미널 = Windows 의 Git Bash.
// meta: 코스마다 다른 글귀 · setup: 첫 화면 「시작하기」 · lessonPages: 레슨 id → 쪽 목록 통째(content.js 의 「준비 중」 쪽 대신)
// pages: 'T0/1' → { html | rep } 기존 쪽 고쳐 쓰기(T0 은 연습용 가짜 터미널 기준이라 Git Bash 기준으로)
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
    makeIntro: 'Git Bash 를 열고, 문제마다 먼저 <b>준비 명령</b>을 붙여 넣어 그 문제용 연습 폴더를 만든 다음 직접 명령을 쳐 보세요. 다 했으면 <b>확인 명령</b>을 쳐서 결과를 비교해요. 엉망이 되면 준비 명령을 다시 붙여 넣으면 처음 상태로 돌아가요.', makeTail: '막히면 「필요한 명령」을 눌러 설명을 다시 보고, 그래도 막히면 맨 아래 예시 답을 펴 보세요. 명령이 달라도 확인 결과가 같으면 맞아요.',
    fileExt: '', setupLabel: '준비 명령 — 붙여 넣으면 이 문제용 폴더가 생기고 그 안으로 들어가요', answerLabel: '예시 답(명령)', needsLabel: '필요한 명령',
    checkLabel: '확인 명령 — 다 했으면 이걸 쳐 보세요', outLabel: '이렇게 나오면 성공', inLabel: '입력',
    homeNote: '<code>/c/Users/me</code> 의 <code>me</code> 자리는 내 Windows 사용자 이름이에요',
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
<p>채점·점수·잠금은 없어요. 아는 레슨은 건너뛰고, 필요한 곳부터 펴 보면 돼요. 챕터 2·3(Git)은 다음 업데이트에 채워져요.</p>` },
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
