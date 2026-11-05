// courses/python/book.js — 파이썬 「교과서」 모드 데이터 (v2.9.0, 사용자 결정 2026-11-06). 화면은 core/ui-views-book.js.
// setup: 첫 화면의 「시작하기」(파이썬 설치 → VS Code → 첫 파일 실행 → 이 교과서 쓰는 법)
// tasks: 레슨 id → 「만들어 보기」 문제 목록. 문제는 문장으로, 필요한 문법은 [이름, '레슨id/쪽번호(0부터)'].
//   pid: 같은 내용의 옛 문제 — 입력 예·출력 예(첫 테스트)와 예시 답(solution)을 거기서 가져옴. text '@prompt' 면 그 문제의 지문을 그대로.
//   io·answer 를 직접 적으면 그걸 씀. given: true 면 그 문제의 starter 를 「고칠 코드」로 보여 줌. noRun: 거북이·무작위처럼 출력 비교가 안 되는 것.
//   검증: node tools/check_book.mjs (모든 예시 답을 실제 파이썬으로 돌려 출력 예와 같은지)
const BOOK = {
  setup: {
    title: '시작하기: 파이썬 설치하고 VS Code 에서 실행하기',
    pages: [
      { title: '1. 파이썬 설치하기 (Windows)', html: `<p>파이썬 코드를 내 컴퓨터에서 돌리려면 먼저 <b>파이썬</b>을 설치해야 해요. 한 번만 하면 돼요.</p>
<div class="bk-step-box"><b>① 받기</b><br>브라우저로 <a href="https://www.python.org/downloads/windows/" target="_blank" rel="noopener">python.org/downloads/windows</a> 에 들어가서, 맨 위 <b>Stable Releases</b> 의 가장 최신 버전(예: Python 3.15.x) 아래 <b>「Download Windows installer (64-bit)」</b> 를 눌러 받아요.<br><span class="muted small">python.org 첫 화면의 노란 버튼은 「Python install manager」 예요. 그걸로 설치해도 되지만, 이 안내는 설명이 쉬운 일반 설치 파일(installer) 기준이에요.</span></div>
<div class="bk-step-box"><b>② 설치 — 이 칸이 제일 중요해요</b><br>받은 <code>python-3.xx.x-amd64.exe</code> 를 더블클릭하면 첫 화면이 떠요. 맨 아래 <b>☑ Add python.exe to PATH</b> 칸에 <b>체크</b>하고 나서 <b>「Install Now」</b> 를 눌러요.<br><span class="muted small">이 칸을 안 켜면 나중에 「python 은 내부 또는 외부 명령이 아닙니다」 에러가 나요.</span></div>
<div class="bk-step-box"><b>③ 끝</b><br>「Setup was successful」 이 뜨면 <b>Close</b>. (「Disable path length limit」 이 보이면 눌러 둬도 괜찮아요.)</div>
<div class="bk-step-box"><b>④ 잘 깔렸는지 확인</b><br>키보드 <kbd>Win</kbd> 키 → <code>cmd</code> 입력 → <b>명령 프롬프트</b> 를 열고 아래를 치고 <kbd>Enter</kbd>.<pre>python --version</pre><code>Python 3.15.2</code> 처럼 버전이 나오면 성공이에요.</div>
<div class="bk-warn"><b>Microsoft Store 가 열리거나 아무것도 안 나오면</b><br>Windows <b>설정</b> → <b>앱</b> → <b>고급 앱 설정</b> → <b>앱 실행 별칭</b> 에서 <code>python.exe</code>·<code>python3.exe</code>(「앱 설치 관리자」) 두 개를 <b>끔</b>으로 바꾸고 명령 프롬프트를 새로 열어 다시 쳐 보세요. 그래도 안 되면 ② 에서 PATH 칸을 안 켠 거예요 — 설치 파일을 다시 실행 → <b>Modify</b> → Next → <b>☑ Add Python to environment variables</b> 체크 → Install.</div>
<details class="lp-more"><summary>Mac 이라면</summary><p><a href="https://www.python.org/downloads/macos/" target="_blank" rel="noopener">python.org/downloads/macos</a> 에서 최신 <b>macOS 64-bit universal2 installer</b>(.pkg)를 받아 계속 → 동의 → 설치. 끝나면 <b>터미널</b> 앱에서 <code>python3 --version</code> 으로 확인해요. Mac 은 <code>python</code> 대신 <code>python3</code> 이에요.</p></details>` },
      { title: '2. VS Code 설치하고 파이썬 연결하기', html: `<p>VS Code 는 코드를 쓰는 편집기예요. 이 교과서의 「만들어 보기」 는 전부 여기서 해요.</p>
<div class="bk-step-box"><b>① 설치</b><br><a href="https://code.visualstudio.com/" target="_blank" rel="noopener">code.visualstudio.com</a> → <b>「Download for Windows」</b> → 받은 <code>VSCodeUserSetup-x64-….exe</code> 실행 → 「동의합니다」 → 다음.<br><b>「추가 작업 선택」</b> 화면에서 아래 두 칸을 켜 두면 편해요: <b>☑ "Code(으)로 열기" 작업을 Windows 탐색기 디렉터리의 상황에 맞는 메뉴에 추가</b>, <b>☑ PATH에 추가</b>(보통 이미 켜져 있어요) → 설치 → 마침.</div>
<div class="bk-step-box"><b>② 한국어로 바꾸기 (선택)</b><br>VS Code 왼쪽 세로 줄의 네모 네 개 아이콘(<b>확장</b>, <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>X</kbd>) → 검색 칸에 <code>Korean</code> → <b>Korean Language Pack for Visual Studio Code</b> 의 <b>Install</b> → 오른쪽 아래 <b>Change Language and Restart</b>.</div>
<div class="bk-step-box"><b>③ 파이썬 확장 설치 — 꼭 하세요</b><br>같은 <b>확장</b> 화면 검색 칸에 <code>Python</code> → 만든 곳이 <b>Microsoft</b> 인 <b>「Python」</b> 의 <b>설치(Install)</b>. Pylance·Python Debugger 도 같이 깔려요. 이게 있어야 오른쪽 위에 ▷ 실행 버튼이 생겨요.</div>
<div class="bk-step-box"><b>④ 어떤 파이썬을 쓸지 고르기</b><br><kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd> → <code>Python: Select Interpreter</code>(한국어면 「Python: 인터프리터 선택」) → 1단계에서 설치한 <b>Python 3.xx</b> 를 골라요. 보통은 자동으로 잡혀서 안 해도 돼요. 지금 쓰는 파이썬은 <code>.py</code> 파일을 열었을 때 <b>오른쪽 아래 상태 표시줄</b>에 버전으로 보여요.</div>` },
      { title: '3. 첫 파일 만들고 실행하기', html: `<div class="bk-step-box"><b>① 공부 폴더 만들기</b><br>문서나 바탕화면에 <code>python-study</code> 폴더를 하나 만들어요. 앞으로 만드는 파일은 전부 여기에 둬요.</div>
<div class="bk-step-box"><b>② VS Code 에서 폴더 열기</b><br>VS Code 메뉴 <b>파일(File)</b> → <b>폴더 열기(Open Folder)</b> → <code>python-study</code> 선택. 「이 폴더에 있는 파일의 작성자를 신뢰합니까?」 가 뜨면 <b>「예, 작성자를 신뢰합니다」</b>.</div>
<div class="bk-step-box"><b>③ 파일 만들기</b><br>왼쪽 <b>탐색기</b>(종이 두 장 아이콘)에서 폴더 이름 옆 <b>새 파일</b> 아이콘 → 이름을 <code>hello.py</code> 로. 끝이 꼭 <code>.py</code> 여야 파이썬 파일로 알아봐요.</div>
<div class="bk-step-box"><b>④ 코드 쓰고 저장</b><pre>print("안녕, 파이썬!")</pre>를 치고 <kbd>Ctrl</kbd>+<kbd>S</kbd> 로 저장해요. 탭 이름 옆 ● 가 사라지면 저장된 거예요.</div>
<div class="bk-step-box"><b>⑤ 실행</b><br>오른쪽 위 <b>▷ (Run Python File)</b> 를 눌러요. 아래쪽에 <b>터미널</b> 창이 열리고 <code>안녕, 파이썬!</code> 이 나오면 성공이에요.<br><span class="muted small">터미널에 <code>PS C:\\…\\python-study&gt; &amp; C:/…/python.exe c:/…/hello.py</code> 같은 긴 줄이 먼저 찍히는 건 VS Code 가 대신 친 실행 명령이에요.</span></div>
<div class="bk-step-box"><b>⑥ 입력받는 프로그램은</b><br><code>input()</code> 이 있는 프로그램은 실행하면 터미널에서 커서가 깜빡이며 기다려요. <b>터미널을 한 번 클릭</b>하고 값을 쳐서 <kbd>Enter</kbd>. 입력이 여러 줄이면 한 줄씩 쳐요.</div>
<div class="bk-warn"><b>자주 막히는 곳</b><ul><li>▷ 버튼이 없어요 → 2단계 ③ 파이썬 확장을 안 깔았거나, 파일 이름이 <code>.py</code> 로 안 끝나요.</li><li>고쳤는데 결과가 그대로예요 → 저장(<kbd>Ctrl</kbd>+<kbd>S</kbd>)을 안 했어요. 메뉴 <b>파일 → 자동 저장</b> 을 켜 두면 편해요.</li><li>프로그램이 안 끝나요 → 터미널을 클릭하고 <kbd>Ctrl</kbd>+<kbd>C</kbd>.</li><li>빨간 에러가 나요 → 맨 아래 줄(<code>NameError: …</code> 같은 것)이 무슨 에러인지, 그 위 <code>line 3</code> 이 몇 번째 줄인지예요(레슨 35 「디버깅 사고법」).</li></ul></div>` },
      { title: '4. 이 교과서 쓰는 법', html: `<p>이 사이트는 문제집이 아니라 <b>옆에 펴 두는 교과서</b>예요. 점수·잠금·순서 강요가 없어요.</p>
<div class="bk-step-box"><b>① 레슨 읽기</b><br>레슨은 문법 하나씩 짧게 설명해요. 예제 코드는 <b>📋 복사</b> 해서 VS Code 에 붙여 실행해 보고, 숫자나 글자를 바꿔 다시 돌려 보세요. 바꿔 보는 게 제일 빨리 익어요.</div>
<div class="bk-step-box"><b>② 「🛠 만들어 보기」</b><br>레슨 마지막 쪽에 <b>문장으로 된 문제</b>가 있어요. 빈 파일에서 직접 만들어요. 문제마다 <b>필요한 문법</b> 이 붙어 있어서, 생각이 안 나면 눌러서 그 설명으로 바로 가요. 출력 예와 같은 결과가 나오면 완성이에요 — 코드 모양은 예시 답과 달라도 돼요.</div>
<div class="bk-step-box"><b>③ 막히면 이 순서로</b><br>문제를 한국어로 한 줄씩 나눠 적어 보기(「입력받는다 → 숫자로 바꾼다 → 더한다 → 출력」) → 필요한 문법 다시 보기 → <code>print()</code> 로 중간값 찍어 보기 → 그래도 안 되면 예시 답 펴 보고, <b>닫은 다음 안 보고 다시 쳐 보기</b>.</div>
<div class="bk-step-box"><b>④ 파일 정리</b><br><code>python-study</code> 안에 레슨마다 파일을 만들면 나중에 다시 찾기 좋아요: <code>l05_for_1.py</code>, <code>l05_for_2.py</code> …. 챕터 끝 「만들어 보기」 는 조금 큰 프로그램이라 폴더를 따로 만들어도 좋아요.</div>
<p>다 읽고 나면, 레슨의 문제를 내 생활에 맞게 바꿔 만들어 보세요(내 가계부, 내 단어장, 내 일정표). 「혼자 만들 수 있다」 는 힘은 거기서 생겨요.</p>` },
    ],
  },
  // 레슨 본문 중 이 앱의 버튼(실행해 보기·입력값 칸·한 줄씩 보기)을 말하는 곳만 VS Code 기준으로 — 키 '레슨id/쪽', rep = [바꿀 글, 새 글]
  pages: {
    'L0/0': { rep: [['이 앱에서는 진짜 파이썬이 바로 [[실행]]돼요. 아래 예제의 <b>실행해 보기</b> 버튼을 눌러 보세요.', '이 교과서의 코드는 내 컴퓨터의 VS Code 에서 [[실행]]해요(맨 앞 「시작하기」). 아래 예제를 복사해 <code>hello.py</code> 에 붙이고 ▷ 로 실행해 보세요.']] },
    'L0/2': { rep: [['예제의 <b>👣 한 줄씩 보기</b>를 누르면 지금 실행하는 줄이 노랗게 보여요.', 'VS Code 에서는 줄 번호 왼쪽을 눌러 빨간 점(중단점)을 찍고 <kbd>F5</kbd> → 「Python Debugger: Debug Python File」 을 고르면 그 줄에서 멈춰요. 왼쪽 <b>변수</b> 칸에 지금 값이 보이고, <kbd>F10</kbd> 을 누를 때마다 한 줄씩 내려가요.'], [' (↺ 원래대로 버튼으로 되돌릴 수 있어요)', '']] },
    'L0/4': { title: '이 교과서 쓰는 법', html: '<p>레슨을 읽고, 예제를 VS Code 에서 돌려 보고, 레슨 마지막 쪽 <b>「🛠 만들어 보기」</b> 의 문제를 빈 파일에서 직접 만들어요. 점수·잠금은 없어요.</p><ul><li>문제마다 <b>필요한 문법</b> 이 붙어 있어요 — 누르면 그 설명으로 가요.</li><li>막히면 펼쳐 보는 <b>예시 답</b> 이 있어요. 보고 나면 닫고 안 보고 다시 쳐 보세요.</li><li>설치·VS Code 연결은 홈 맨 위 <b>「시작하기」</b> 에 있어요.</li></ul>' },
    'L2/3': { rep: [['<b>👣 한 줄씩 보기</b>를 누르면 변수 표에서 값이 바뀌는 걸 볼 수 있어요.', 'VS Code 에서는 줄 번호 왼쪽을 눌러 빨간 점(중단점)을 찍고 <kbd>F5</kbd> → 「Python Debugger: Debug Python File」 을 고르면 그 줄에서 멈춰요. 왼쪽 <b>변수</b> 칸에 지금 값이 보이고, <kbd>F10</kbd> 을 누를 때마다 한 줄씩 내려가요.']] },
    'L3B/0': { rep: [['이 앱에서는 에디터 아래 [[입력값]] 칸에 미리 적어 둔 내용을 읽어요. 입력값을 바꾸면 코드는 그대로인데 결과가 바뀌어요.', 'VS Code 에서 실행하면 아래 <b>터미널</b>에서 커서가 깜빡이며 기다려요. 터미널을 한 번 누르고 <code>민수</code> 를 친 뒤 <kbd>Enter</kbd>. 다른 이름을 치면 코드는 그대로인데 결과가 바뀌어요.']] },
    'L3B/3': { rep: [['부를 때마다 입력값 칸의 <b>다음 한 줄</b>을 읽어요.', '부를 때마다 터미널에 치는 <b>다음 한 줄</b>을 읽어요(값을 치고 <kbd>Enter</kbd>, 또 치고 <kbd>Enter</kbd>).']] },
    'L6/2': { rep: [['이 앱은 5초가 지나면 반복을 강제로 멈추고 알려 줘요.', 'VS Code 에서 무한루프가 돌면 터미널을 누르고 <kbd>Ctrl</kbd>+<kbd>C</kbd> 로 멈춰요.']] },
    'L13/2': { rep: [['입력 칸을 <code>abc</code>, <code>5</code>로 바꿔 실행해 보세요.', '다시 실행해서 터미널에 <code>abc</code>, <code>5</code> 도 쳐 보세요.']] },
    'L22/0': { rep: [['<p><b>이 앱에서는</b> 출력 칸에 <code>IndexError: list index out of range</code> 처럼 종류와 설명 한 줄이 나오고, 에러 난 줄은 <b>코드 칸에 빨간 줄</b>로 칠해져요. 아래 예제를 ▶ 실행해 보세요.</p><p>앱 밖(내 컴퓨터의 파이썬)에서는 에러 메시지([[트레이스백]])가 여러 줄로 나와요.', '<p>아래 예제를 VS Code 에서 실행해 보세요. 터미널에 에러 메시지([[트레이스백]])가 여러 줄로 나와요.'], ['이 몇 번째 줄이에요.</p>', '이 몇 번째 줄이에요. VS Code 터미널에서 <code>line 4</code> 가 있는 줄을 <kbd>Ctrl</kbd>+클릭하면 그 줄로 바로 가요.</p>'], ['상단 메뉴의 에러 사전에 정리돼 있어요.', '']] },
    'L22/4': { rep: [['「👣 한 줄씩 보기」로 변수가 언제 이상해지는지 보는 것도 같은 방법이에요.', 'VS Code 에서는 줄 번호 왼쪽을 눌러 빨간 점(중단점)을 찍고 <kbd>F5</kbd> → 「Python Debugger: Debug Python File」 을 고르면 그 줄에서 멈춰요. 왼쪽 <b>변수</b> 칸에 지금 값이 보이고, <kbd>F10</kbd> 을 누를 때마다 한 줄씩 내려가요.']] },
  },
  tasks: {
    L0: [
      { title: '첫 프로그램', text: 'VS Code 에서 <code>hello.py</code> 를 만들어 화면에 <code>안녕!</code> 을 출력해 보세요. (「시작하기」 3번 그대로예요)', needs: [['print()', 'L1/0'], ['VS Code 에서 실행', 'SETUP/2']], pid: 'L0P4' },
    ],
    L1: [
      { title: '첫 인사', text: '화면에 <code>안녕, 파이썬!</code> 을 출력하는 프로그램을 만드세요. 쉼표·느낌표까지 똑같이요.', needs: [['print()', 'L1/0'], ['문자열(따옴표)', 'L1/1']], pid: 'L1P1' },
      { title: '두 줄 말하기', text: '첫 줄에 <code>나는</code>, 둘째 줄에 <code>파이썬을 배워요</code> 를 출력하세요.', needs: [['여러 줄 출력', 'L1/4']], pid: 'L1P2' },
      { title: '자기소개 세 줄', text: '이름·나이·취미를 세 줄로 출력하세요. 출력 예처럼 <code>이름: …</code> 모양으로요. (내 정보로 바꿔도 돼요)', needs: [['여러 줄 출력', 'L1/4'], ['문자열', 'L1/1']], pid: 'L1P5' },
      { title: '쉼표로 한 줄에', text: '<code>print</code> 한 번으로 글자 <code>사과</code>, 숫자 <code>3</code>, 글자 <code>개</code> 를 띄어서 한 줄에 출력하세요. 숫자 3 은 따옴표 없이 쓰세요.', needs: [['쉼표로 여러 개', 'L1/5'], ['숫자는 따옴표 없이', 'L1/2']], io: [{ output: '사과 3 개' }], answer: 'print("사과", 3, "개")' },
    ],
    L2: [
      { title: '변수에 담아 출력', text: '변수 <code>name</code> 에 <code>파이썬</code> 을 담고, 그 변수를 출력하세요. (출력할 때는 따옴표 없이 변수 이름만)', needs: [['변수', 'L2/0']], pid: 'L2P1' },
      { title: '올해와 내년 나이', text: '변수 <code>age</code> 에 나이를 담고, 올해 나이와 내년 나이(<code>age + 1</code>)를 두 줄로 출력하세요. 출력 예는 <code>age = 29</code> 일 때예요.', needs: [['변수', 'L2/0'], ['숫자 담고 계산', 'L2/1']], io: [{ output: '29\n30' }], answer: 'age = 29\nprint(age)\nprint(age + 1)' },
      { title: '성과 이름 붙이기', text: '변수 <code>last</code> 에 <code>김</code>, <code>first</code> 에 <code>코딩</code> 을 담고, 둘을 이어 붙여 <code>김코딩</code> 을 출력하세요.', needs: [['글자 + 글자', 'L2/2']], io: [{ output: '김코딩' }], answer: 'last = "김"\nfirst = "코딩"\nprint(last + first)' },
      { title: '점수 올리기', text: '<code>score = 70</code> 에서 시작해 <code>+=</code> 로 10 을 두 번 더한 뒤 출력하세요.', needs: [['지금 값에 더하기', 'L2/4'], ['+= 줄여 쓰기', 'L2/5']], io: [{ output: '90' }], answer: 'score = 70\nscore += 10\nscore += 10\nprint(score)' },
    ],
    L3: [
      { title: '곱셈은 계산식으로', text: '12 × 34 의 결과를 출력하세요. 답을 직접 계산해서 적지 말고 <code>print</code> 안에 곱셈식을 쓰세요.', needs: [['사칙연산', 'L3/0']], io: [{ output: '408' }], answer: 'print(12 * 34)' },
      { title: '2 의 10 제곱', text: '2 를 10 번 곱한 값(2의 10제곱)을 출력하세요.', needs: [['거듭제곱 **', 'L3/1']], io: [{ output: '1024' }], answer: 'print(2 ** 10)' },
      { title: '몫과 나머지', text: '17 을 5 로 나눈 몫과 나머지를 한 줄씩 출력하세요.', needs: [['몫 // 과 나머지 %', 'L3/4']], pid: 'L3P7' },
    ],
    L3B: [
      { title: '두 배로', text: '숫자 하나를 입력받아 2 배한 값을 출력하세요.', needs: [['input()', 'L3B/0'], ['int()', 'L3B/1']], pid: 'L3P2' },
      { title: '두 수의 합', text: '숫자 두 개를 한 줄씩 입력받아 합을 출력하세요.', needs: [['입력 여러 번', 'L3B/3'], ['int()', 'L3B/1']], pid: 'L3P6' },
      { title: '이름 넣어 인사', text: '이름을 입력받아 <code>안녕, 민수!</code> 처럼 출력하세요.', needs: [['input()', 'L3B/0'], ['글자 + 글자', 'L2/2'], ['쉼표로 여러 개', 'L1/5']], io: [{ input: '민수', output: '안녕, 민수!' }], answer: 'name = input()\nprint("안녕,", name + "!")' },
      { title: '분을 시간과 분으로', text: '분(예: 135)을 입력받아 몇 시간 몇 분인지 <code>2 시간 15 분</code> 처럼 출력하세요.', needs: [['int()', 'L3B/1'], ['몫 // 과 나머지 %', 'L3/4'], ['쉼표로 여러 개', 'L1/5']], io: [{ input: '135', output: '2 시간 15 분' }], answer: 'm = int(input())\nprint(m // 60, "시간", m % 60, "분")' },
    ],
    L4: [
      { title: '짝수 홀수', text: '숫자를 입력받아 짝수면 <code>짝수</code>, 홀수면 <code>홀수</code> 를 출력하세요. (2 로 나눈 나머지가 0 이면 짝수)', needs: [['if', 'L4/2'], ['else', 'L4/3'], ['나머지 %', 'L3/4']], pid: 'L4P2' },
      { title: '성적 등급', text: '점수를 입력받아 90 이상이면 <code>A</code>, 80 이상이면 <code>B</code>, 그 외에는 <code>C</code> 를 출력하세요.', needs: [['elif', 'L4/4'], ['비교 기호', 'L4/1']], pid: 'L4P5' },
      { title: '더 큰 수', text: '숫자 두 개를 한 줄씩 입력받아 더 큰 수를 출력하세요. 같으면 <code>같아요</code>.', needs: [['if·elif·else', 'L4/4'], ['비교 기호', 'L4/1']], io: [{ input: '3\n8', output: '8' }], answer: 'a = int(input())\nb = int(input())\nif a > b:\n    print(a)\nelif b > a:\n    print(b)\nelse:\n    print("같아요")' },
      { title: '청소년인가요', text: '나이를 입력받아 13 이상 19 이하면 <code>청소년</code>, 아니면 <code>청소년 아님</code> 을 출력하세요.', needs: [['and', 'L4/5'], ['이상·이하 기호', 'L4/1']], io: [{ input: '15', output: '청소년' }], answer: 'age = int(input())\nif age >= 13 and age <= 19:\n    print("청소년")\nelse:\n    print("청소년 아님")' },
    ],
    B1: [
      { title: '숫자 맞히기 1단계', text: '비밀 숫자를 <code>7</code> 로 정해 두고, 숫자를 하나 입력받아 7 이면 <code>정답!</code>, 7 보다 작으면 <code>더 커요</code>(비밀 숫자가 더 크다는 뜻), 7 보다 크면 <code>더 작아요</code> 를 출력하세요.', needs: [['input()·int()', 'L3B/1'], ['if·elif·else', 'L4/4'], ['비교 ==', 'L4/0']], pid: 'B1P1' },
      { title: '범위 검사 붙이기', text: '비밀 숫자는 7 이에요. 숫자를 하나 입력받아 1 보다 작거나 10 보다 크면 <code>1에서 10 사이로!</code>, 7 이면 <code>정답!</code>, 그 외에는 <code>땡</code> 을 출력하세요. 범위 밖인지를 가장 먼저 검사해요.', needs: [['or', 'L4/5'], ['elif', 'L4/4']], pid: 'B1P2' },
    ],
    L5: [
      { title: '1 부터 5 까지', text: '1, 2, 3, 4, 5 를 한 줄에 하나씩 출력하세요. <code>print</code> 를 다섯 번 쓰지 말고 반복으로요.', needs: [['for', 'L5/0'], ['range(시작, 끝)', 'L5/3']], pid: 'L5P1' },
      { title: '1 부터 10 까지 더하기', text: '1 부터 10 까지 더한 값을 출력하세요.', needs: [['반복하며 더해 가기', 'L5/5'], ['range(시작, 끝)', 'L5/3']], pid: 'L5P2' },
      { title: '구구단 한 단', text: '숫자 n 을 입력받아 <code>n x 1 = n</code> 부터 <code>n x 9</code> 까지 아홉 줄을 출력하세요.', needs: [['i: 몇 번째인지', 'L5/1'], ['쉼표로 여러 개', 'L1/5'], ['input()·int()', 'L3B/1']], pid: 'L5P6' },
      { title: '짝수만', text: '2 부터 20 까지 짝수만 한 줄에 하나씩 출력하세요. <code>if</code> 없이 range 의 간격으로 해 보세요.', needs: [['range(시작, 끝, 간격)', 'L5/4']], io: [{ output: '2\n4\n6\n8\n10\n12\n14\n16\n18\n20' }], answer: 'for i in range(2, 21, 2):\n    print(i)' },
      { title: '3 의 배수 세기', text: '1 부터 30 까지 중 3 의 배수가 몇 개인지 세어 출력하세요.', needs: [['반복 안에 if', 'L5/6'], ['나머지 %', 'L3/4'], ['+=', 'L2/5']], io: [{ output: '10' }], answer: 'count = 0\nfor i in range(1, 31):\n    if i % 3 == 0:\n        count += 1\nprint(count)' },
      { title: '거북이 정사각형', text: '거북이로 한 변이 100 인 정사각형을 그리세요. 「앞으로 100, 왼쪽 90도」 를 4 번 반복하면 돼요. VS Code 에서 실행하면 그림 창이 떠요 — 마지막 줄에 <code>turtle.done()</code> 을 넣어야 창이 바로 닫히지 않아요.', needs: [['거북이', 'L5/7'], ['for', 'L5/0']], noRun: true, answer: 'import turtle\nfor i in range(4):\n    turtle.forward(100)\n    turtle.left(90)\nturtle.done()' },
    ],
    L6: [
      { title: 'while 로 세기', text: '1 부터 5 까지 <code>while</code> 반복으로 한 줄에 하나씩 출력하세요.', needs: [['while', 'L6/0'], ['시작·조건·바꾸기', 'L6/1']], pid: 'L6P1' },
      { title: '「끝」 이라고 할 때까지', text: '단어를 계속 입력받아 <code>입력: 단어</code> 로 출력하다가, <code>끝</code> 이 들어오면 <code>종료</code> 를 출력하고 멈추세요.', needs: [['while True + break', 'L6/3']], pid: 'L6P2' },
      { title: '100 을 넘는 순간', text: '1, 2, 3, … 을 차례로 더해 가다가 합이 처음으로 100 을 넘는 순간, 마지막에 더한 수와 그때의 합을 출력하세요.', needs: [['while', 'L6/0'], ['시작·조건·바꾸기', 'L6/1']], io: [{ output: '14 105' }], answer: 'total = 0\ni = 0\nwhile total <= 100:\n    i += 1\n    total += i\nprint(i, total)' },
      { title: '3 의 배수 건너뛰기', text: '1 부터 10 까지 출력하되 3 의 배수는 건너뛰세요.', needs: [['continue', 'L6/4'], ['나머지 %', 'L3/4']], io: [{ output: '1\n2\n4\n5\n7\n8\n10' }], answer: 'i = 0\nwhile i < 10:\n    i += 1\n    if i % 3 == 0:\n        continue\n    print(i)' },
    ],
    L7: [
      { title: '처음과 마지막', text: '리스트 <code>["사과", "배", "포도"]</code> 에서 첫 번째와 마지막 과일을 한 줄씩 출력하세요.', needs: [['인덱스', 'L7/1']], pid: 'L7P1' },
      { title: '칸 하나 바꾸기', text: '리스트 <code>["빨강", "파랑", "노랑"]</code> 의 가운데 값을 <code>초록</code> 으로 바꾸고 리스트를 통째로 출력하세요.', needs: [['값 바꾸기', 'L7/2']], pid: 'L7P7' },
      { title: '몇 개, 세 번째는', text: '리스트 <code>[3, 7, 1, 9]</code> 가 몇 개인지와 세 번째 값을 한 줄씩 출력하세요. (세 번째 = 번호 2)', needs: [['len', 'L7/3'], ['인덱스', 'L7/1']], io: [{ output: '4\n1' }], answer: 'nums = [3, 7, 1, 9]\nprint(len(nums))\nprint(nums[2])' },
    ],
    L7B: [
      { title: '넣고 꺼내기', text: '<code>[1, 2]</code> 에 3 을 추가해 출력하고, 마지막 값을 꺼내 출력한 뒤, 남은 개수를 출력하세요.', needs: [['append', 'L7B/0'], ['pop', 'L7B/1'], ['len', 'L7/3']], pid: 'L7P2' },
      { title: '전부 두 배', text: '리스트 <code>[3, 1, 4]</code> 의 값을 하나씩 2 배해서 한 줄에 하나씩 출력하세요.', needs: [['for x in 리스트', 'L7B/2']], pid: 'L7P5' },
      { title: '가장 큰 수 찾기', text: '띄어쓰기로 구분된 숫자들을 한 줄로 입력받아 가장 큰 수를 출력하세요. <code>max()</code> 는 쓰지 말고 반복으로 찾아요.', needs: [['split', 'L7B/3'], ['가장 작은 수 찾기(같은 방법)', 'L7B/4'], ['int()', 'L3B/1']], pid: 'L7P6' },
      { title: '단어 모으기', text: '단어 3 개를 한 줄씩 입력받아 리스트에 모은 뒤 리스트를 출력하세요.', needs: [['빈 리스트에 append', 'L7B/0'], ['range 로 3 번', 'L5/2']], io: [{ input: '사과\n배\n감', output: "['사과', '배', '감']" }], answer: 'words = []\nfor i in range(3):\n    words.append(input())\nprint(words)' },
    ],
    L8: [
      { title: '인사 함수', text: '<code>안녕!</code> 을 출력하는 함수 <code>hello</code> 를 만들고 세 번 부르세요.', needs: [['함수 만들고 부르기', 'L8/0']], pid: 'L8P1' },
      { title: '더하기 함수', text: '두 수를 더해 <b>돌려주는</b> 함수 <code>add(a, b)</code> 를 만들고 <code>add(3, 4)</code> 의 결과를 출력하세요.', needs: [['매개변수', 'L8/1'], ['return', 'L8/2']], pid: 'L8P2' },
      { title: '제곱 함수', text: '숫자를 받아 제곱을 돌려주는 함수 <code>square(n)</code> 을 만들고, <code>square(3)</code> 과 <code>square(12)</code> 를 출력하세요. 함수 안에서는 <code>print</code> 말고 <code>return</code>.', needs: [['return', 'L8/2'], ['print 와 return', 'L8/4']], io: [{ output: '9\n144' }], answer: 'def square(n):\n    return n * n\n\nprint(square(3))\nprint(square(12))' },
      { title: '등급 함수', text: '점수를 받아 90 이상 <code>A</code>, 80 이상 <code>B</code>, 그 외 <code>C</code> 를 돌려주는 함수 <code>grade(score)</code> 를 만들고, 점수를 입력받아 등급을 출력하세요.', needs: [['return 을 만나면 끝', 'L8/3'], ['elif', 'L4/4']], io: [{ input: '85', output: 'B' }], answer: 'def grade(score):\n    if score >= 90:\n        return "A"\n    elif score >= 80:\n        return "B"\n    return "C"\n\nprint(grade(int(input())))' },
    ],
    B2: [
      { title: '숫자 맞히기 게임', text: '@prompt', needs: [['while True + break', 'L6/3'], ['+= 로 횟수 세기', 'L2/5'], ['if·elif·else', 'L4/4']], pid: 'B2P1' },
      { title: '기회는 3 번', text: '@prompt', needs: [['while 조건', 'L6/1'], ['break', 'L6/3']], pid: 'B2P2' },
    ],
    L9: [
      { title: 'f-string 인사', text: '변수 <code>name = "민수"</code> 로 <code>안녕, 민수님!</code> 을 출력하세요. 글자 이어 붙이기 말고 f-string 으로요.', needs: [['f-string', 'L9/7']], pid: 'L9P1' },
      { title: '거꾸로', text: '글자를 입력받아 거꾸로 뒤집어 출력하세요.', needs: [['간격 -1 로 뒤집기', 'L9/2']], pid: 'L9P2' },
      { title: '단어 개수', text: '문장을 입력받아 단어가 몇 개인지(띄어쓰기 기준) 출력하세요.', needs: [['split', 'L9/6'], ['len', 'L7/3']], pid: 'L9P5' },
      { title: '이메일 아이디', text: '이메일 주소를 입력받아 <code>@</code> 앞부분(아이디)만 출력하세요.', needs: [['split(기준 글자)', 'L9/6'], ['인덱스', 'L7/1']], io: [{ input: 'minsu@mail.com', output: 'minsu' }], answer: 'email = input()\nprint(email.split("@")[0])' },
      { title: '빈칸 지우고 대문자로', text: '앞뒤에 빈칸이 붙은 영어 단어를 입력받아 빈칸을 지우고 대문자로 바꿔 출력하세요.', needs: [['strip', 'L9/5'], ['upper', 'L9/3']], io: [{ input: '  hello  ', output: 'HELLO' }], answer: 'word = input()\nprint(word.strip().upper())' },
    ],
    L10: [
      { title: '점수 추가하기', text: '빈 딕셔너리에 <code>민수: 90</code>, <code>영희: 85</code> 를 차례로 넣고 딕셔너리를 통째로 출력하세요.', needs: [['추가 d[키] = 값', 'L10/3']], pid: 'L10P7' },
      { title: '과일 가격표', text: '딕셔너리 <code>{"사과": 1000, "배": 2000, "감": 500}</code> 에서 과일 이름을 입력받아 가격을 출력하고, 없는 과일이면 <code>없는 과일</code> 을 출력하세요.', needs: [['in: 키가 있나', 'L10/1'], ['get: 없으면 기본값', 'L10/2']], io: [{ input: '배', output: '2000' }], answer: 'prices = {"사과": 1000, "배": 2000, "감": 500}\nfruit = input()\nprint(prices.get(fruit, "없는 과일"))' },
      { title: '하나 지우기', text: '딕셔너리 <code>{"민수": 90, "영희": 85, "철수": 70}</code> 에서 이름을 입력받아 지우고 남은 딕셔너리를 출력하세요.', needs: [['del', 'L10/4']], io: [{ input: '영희', output: "{'민수': 90, '철수': 70}" }], answer: 'scores = {"민수": 90, "영희": 85, "철수": 70}\nname = input()\ndel scores[name]\nprint(scores)' },
    ],
    L10B: [
      { title: '점수표 출력', text: '<code>{"민수": 90, "영희": 85}</code> 를 <code>민수 90</code> 처럼 한 줄씩 출력하세요.', needs: [['items()', 'L10B/1']], pid: 'L10P1' },
      { title: '점수 합계', text: '<code>{"민수": 90, "영희": 85, "철수": 70}</code> 의 점수를 모두 더해 출력하세요.', needs: [['values()', 'L10B/2']], io: [{ output: '245' }], answer: 'scores = {"민수": 90, "영희": 85, "철수": 70}\ntotal = 0\nfor s in scores.values():\n    total += s\nprint(total)' },
      { title: '전화번호부', text: '첫 줄에 사람 수 n, 다음 n 줄에 <code>이름 번호</code>, 마지막 줄에 찾을 이름이 와요. 그 사람의 번호를, 없으면 <code>없음</code> 을 출력하세요.', needs: [['한 줄에 두 값 나눠 담기', 'L10B/4'], ['get', 'L10/2']], pid: 'L10P5' },
      { title: '단어 세기', text: '단어들을 한 줄로 입력받아 각 단어가 몇 번 나왔는지 <code>단어 횟수</code> 로 한 줄씩, 처음 나온 순서대로 출력하세요.', needs: [['개수 세기 패턴', 'L10B/3'], ['items()', 'L10B/1']], pid: 'L10P2' },
    ],
    L11: [
      { title: '나눠 담기', text: '튜플 <code>("민수", 90)</code> 을 <code>name</code>, <code>score</code> 두 변수에 한 번에 나눠 담고 출력하세요.', needs: [['나눠 담기', 'L11/1']], pid: 'L11P8' },
      { title: '맞바꾸기', text: '<code>a = 3</code>, <code>b = 8</code> 의 값을 맞바꿔 <code>a b</code> 순서로 출력하세요. 임시 변수 없이 한 줄로요.', needs: [['a, b = b, a', 'L11/2']], io: [{ output: '8 3' }], answer: 'a, b = 3, 8\na, b = b, a\nprint(a, b)' },
      { title: '가로 세로 넓이', text: '가로와 세로를 한 줄에 띄어서 입력받아(<code>3 4</code>) 넓이를 출력하세요.', needs: [['나눠 담기', 'L11/1'], ['split', 'L9/6'], ['int()', 'L3B/1']], io: [{ input: '3 4', output: '12' }], answer: 'w, h = input().split()\nprint(int(w) * int(h))' },
    ],
    L11B: [
      { title: '몇 종류', text: '단어들을 한 줄로 입력받아 몇 종류인지(중복은 한 번) 출력하세요.', needs: [['집합 set', 'L11B/0'], ['len', 'L11B/1']], pid: 'L11BP3' },
      { title: '중복 없이 작은 것부터', text: '<code>[3, 1, 3, 2, 1]</code> 에서 중복을 없애고 작은 수부터 늘어놓은 리스트를 출력하세요.', needs: [['set', 'L11B/0'], ['sorted', 'L11B/2']], pid: 'L11BP4' },
      { title: '금지어 검사', text: '금지어 집합 <code>{"바보", "멍청이"}</code> 를 두고, 단어를 입력받아 금지어면 <code>금지어예요</code>, 아니면 <code>통과</code> 를 출력하세요.', needs: [['in: 들어 있나', 'L11B/1']], io: [{ input: '바보', output: '금지어예요' }], answer: 'banned = {"바보", "멍청이"}\nword = input()\nif word in banned:\n    print("금지어예요")\nelse:\n    print("통과")' },
    ],
    L11C: [
      { title: '제곱 리스트', text: '숫자 n 을 입력받아 1 부터 n 까지의 제곱을 담은 리스트를 컴프리헨션으로 만들어 출력하세요.', needs: [['컴프리헨션', 'L11C/0'], ['range(1, n + 1)', 'L5/3']], pid: 'L11P3' },
      { title: '짝수만 더하기', text: '1 부터 10 까지 중 짝수만 컴프리헨션으로 골라 담고 그 합을 출력하세요.', needs: [['컴프리헨션 + if', 'L11C/1'], ['sum', 'L11C/1']], pid: 'L11P5' },
      { title: '중복 없이 한 줄로', text: '숫자들을 한 줄로 입력받아 중복을 없애고 작은 수부터 띄어쓰기로 한 줄에 출력하세요.', needs: [['입력을 숫자 리스트로', 'L11C/2'], ['join', 'L11C/3'], ['set·sorted', 'L11B/2']], pid: 'L11P1' },
    ],
    L12: [
      { title: '평균 점수', text: '첫 줄에 학생 수 n, 다음 n 줄에 <code>이름 점수</code> 가 와요. 학생들을 딕셔너리 리스트에 담고 평균을 소수 첫째 자리까지 출력하세요.', needs: [['리스트 안의 딕셔너리', 'L12/0'], ['명단에 추가', 'L12/2'], ['round', 'L12/3']], pid: 'L12P1' },
      { title: '80 점 이상만', text: '명단 <code>[{"name": "민수", "score": 85}, {"name": "영희", "score": 92}, {"name": "철수", "score": 70}]</code> 에서 80 점 이상인 학생 이름만 한 줄씩 출력하세요.', needs: [['명단을 하나씩 돌기', 'L12/1'], ['반복 안에 if', 'L5/6']], io: [{ output: '민수\n영희' }], answer: 'students = [{"name": "민수", "score": 85}, {"name": "영희", "score": 92}, {"name": "철수", "score": 70}]\nfor s in students:\n    if s["score"] >= 80:\n        print(s["name"])' },
    ],
    L12B: [
      { title: '표 모양으로 출력', text: '<code>[[1, 2], [3, 4]]</code> 를 행마다 한 줄씩 <code>1 2</code> 처럼 출력하세요.', needs: [['print 의 end', 'L12B/2'], ['중첩 for', 'L12B/3']], pid: 'L12BP1' },
      { title: '표의 총합', text: '첫 줄에 행의 수 n, 다음 n 줄에 숫자들이 띄어쓰기로 와요. 표로 만든 뒤 모든 숫자의 합을 출력하세요.', needs: [['줄마다 읽어 표 만들기', 'L12B/4'], ['중첩 for', 'L12B/3']], pid: 'L12P2' },
      { title: '가운데 칸', text: '3 × 3 표 <code>[[1, 2, 3], [4, 5, 6], [7, 8, 9]]</code> 의 가운데 값과, 둘째 행 전체를 한 줄씩 출력하세요.', needs: [['2차원 리스트', 'L12B/0'], ['행도 리스트', 'L12B/1']], io: [{ output: '5\n[4, 5, 6]' }], answer: 'grid = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]\nprint(grid[1][1])\nprint(grid[1])' },
    ],
    L12C: [
      { title: '1 등은 누구', text: '명단 <code>[{"name": "민수", "score": 85}, {"name": "영희", "score": 92}, {"name": "철수", "score": 70}]</code> 을 점수 높은 순으로 정렬해 이름만 한 줄씩 출력하세요.', needs: [['key: 무엇으로 줄 세울지', 'L12C/1']], pid: 'L12P4' },
      { title: '큰 수부터', text: '숫자들을 한 줄로 입력받아 큰 수부터 정렬한 리스트를 출력하세요.', needs: [['sort(reverse=True)', 'L12C/0'], ['입력을 숫자 리스트로', 'L11C/2']], io: [{ input: '3 9 2 7', output: '[9, 7, 3, 2]' }], answer: 'nums = [int(x) for x in input().split()]\nnums.sort(reverse=True)\nprint(nums)' },
      { title: '복사본에만 추가', text: '<code>a = [1, 2, 3]</code> 의 복사본 <code>b</code> 를 만들어 <code>b</code> 에만 4 를 추가하고, <code>a</code> 와 <code>b</code> 를 한 줄씩 출력하세요. <code>a</code> 는 그대로여야 해요.', needs: [['복사의 함정', 'L12C/2']], io: [{ output: '[1, 2, 3]\n[1, 2, 3, 4]' }], answer: 'a = [1, 2, 3]\nb = a.copy()\nb.append(4)\nprint(a)\nprint(b)' },
    ],
    B3: [
      { title: '간단한 가계부', text: '@prompt', needs: [['while True + break', 'L6/3'], ['split', 'L9/6'], ['딕셔너리 get', 'L10/2'], ['values() 합', 'L10B/2']], pid: 'B3P1' },
      { title: '월별 합계', text: '@prompt', needs: [['한 줄에 값 나눠 담기', 'L10B/4'], ['sorted', 'L11B/2'], ['개수 세기 패턴(합계도 같은 꼴)', 'L10B/3']], pid: 'B3P2' },
    ],
    L13: [
      { title: '안전한 변환', text: '입력을 정수로 바꿔 2 배를 출력하되, 정수가 아니면(<code>abc</code>, <code>3.5</code>) <code>숫자가 아니에요</code> 를 출력하세요.', needs: [['try/except', 'L13/0'], ['에러 이름 ValueError', 'L13/1']], pid: 'L13P1' },
      { title: '안전한 나눗셈 함수', text: '두 수를 나눠 돌려주되, 0 으로 나누면 <code>나눌 수 없음</code> 을 돌려주는 함수 <code>safe_div(a, b)</code> 를 만들고 <code>safe_div(10, 2)</code>, <code>safe_div(1, 0)</code> 을 출력하세요.', needs: [['함수 안에서 쓰기', 'L13/3'], ['ZeroDivisionError', 'L13/1']], pid: 'L13P4' },
      { title: '될 때까지 다시', text: '올바른 정수가 들어올 때까지 계속 입력받으세요. 잘못된 입력마다 <code>다시 입력하세요</code>, 성공하면 <code>입력한 수: n</code>.', needs: [['될 때까지 다시 받기', 'L13/4']], pid: 'L13P5' },
    ],
    L14: [
      { title: '강아지 클래스', text: '이름을 받아 저장하는 <code>Dog</code> 클래스를 만들고, 입력받은 이름으로 객체를 만들어 <code>초코 멍멍!</code> 처럼 출력하세요.', needs: [['설계도와 물건', 'L14/0'], ['__init__', 'L14/2'], ['self', 'L14/3']], pid: 'L14P1' },
      { title: '직사각형 클래스', text: '가로 <code>w</code>, 세로 <code>h</code> 를 받는 <code>Rect</code> 클래스에 넓이를 돌려주는 <code>area()</code>, 둘레를 돌려주는 <code>perimeter()</code> 를 만들고 <code>Rect(3, 4)</code> 의 넓이와 둘레를 출력하세요.', needs: [['메서드', 'L14/4'], ['__init__', 'L14/2']], io: [{ output: '12\n14' }], answer: 'class Rect:\n    def __init__(self, w, h):\n        self.w = w\n        self.h = h\n    def area(self):\n        return self.w * self.h\n    def perimeter(self):\n        return 2 * (self.w + self.h)\n\nr = Rect(3, 4)\nprint(r.area())\nprint(r.perimeter())' },
      { title: '학생 명단', text: '이름과 점수를 가진 <code>Student</code> 클래스를 만들고, 두 학생(민수 90, 영희 85)을 리스트에 담아 <code>이름 점수</code> 로 한 줄씩 출력하세요.', needs: [['객체 여러 개', 'L14/5'], ['for x in 리스트', 'L7B/2']], pid: 'L14P5' },
    ],
    L15: [
      { title: '동물 소리', text: '이름을 저장하는 <code>Animal</code> 클래스의 <code>speak()</code> 는 <code>이름: ...</code> 을 돌려줘요. 이를 물려받은 <code>Dog</code> 는 <code>이름: 멍멍!</code>, <code>Cat</code> 은 <code>이름: 야옹!</code> 을 돌려주게 하고, <code>Dog("초코")</code> 와 <code>Cat("나비")</code> 의 소리를 출력하세요.', needs: [['상속', 'L15/2'], ['오버라이딩', 'L15/3']], io: [{ output: '초코: 멍멍!\n나비: 야옹!' }], answer: 'class Animal:\n    def __init__(self, name):\n        self.name = name\n    def speak(self):\n        return self.name + ": ..."\n\nclass Dog(Animal):\n    def speak(self):\n        return self.name + ": 멍멍!"\n\nclass Cat(Animal):\n    def speak(self):\n        return self.name + ": 야옹!"\n\nprint(Dog("초코").speak())\nprint(Cat("나비").speak())' },
      { title: '책 출력', text: '제목과 쪽수를 받는 <code>Book</code> 클래스를 만들고, <code>print(Book("파이썬", 300))</code> 하면 <code>파이썬 (300쪽)</code> 이 나오게 하세요.', needs: [['__str__', 'L15/4'], ['f-string', 'L9/7']], io: [{ output: '파이썬 (300쪽)' }], answer: 'class Book:\n    def __init__(self, title, pages):\n        self.title = title\n        self.pages = pages\n    def __str__(self):\n        return f"{self.title} ({self.pages}쪽)"\n\nprint(Book("파이썬", 300))' },
      { title: '은행 계좌', text: '잔액을 가진 <code>BankAccount</code> 클래스에 <code>deposit(n)</code>(입금 후 잔액을 돌려줌), <code>withdraw(n)</code>(출금 후 잔액, 잔액이 모자라면 <code>잔액 부족</code>)을 만드세요. 1000 원으로 시작해 500 입금, 2000 출금, 300 출금 결과를 한 줄씩 출력하세요.', needs: [['메서드로 속성 바꾸기', 'L15/0'], ['값을 받는 메서드', 'L15/1']], io: [{ output: '1500\n잔액 부족\n1200' }], answer: 'class BankAccount:\n    def __init__(self, balance):\n        self.balance = balance\n    def deposit(self, n):\n        self.balance += n\n        return self.balance\n    def withdraw(self, n):\n        if n > self.balance:\n            return "잔액 부족"\n        self.balance -= n\n        return self.balance\n\nacc = BankAccount(1000)\nprint(acc.deposit(500))\nprint(acc.withdraw(2000))\nprint(acc.withdraw(300))' },
    ],
    L16: [
      { title: '제곱근', text: '숫자를 입력받아 제곱근을 출력하세요. <code>math</code> 모듈의 <code>sqrt</code> 를 써요.', needs: [['import', 'L16/0']], pid: 'L16P1' },
      { title: '주사위 세 번', text: '씨앗(seed) 숫자를 입력받아 <code>random.seed()</code> 에 넣고, 1~6 주사위를 세 번 굴려 한 줄에 띄어서 출력하세요. 같은 씨앗이면 늘 같은 결과예요.', needs: [['randint', 'L16/2'], ['seed', 'L16/3']], pid: 'L16P4' },
      { title: '오늘 점심 뽑기', text: '메뉴 리스트(<code>김밥</code>, <code>라면</code>, <code>돈가스</code>, <code>비빔밥</code>)에서 무작위로 하나 골라 <code>오늘 점심: 라면</code> 처럼 출력하세요. 실행할 때마다 달라져요.', needs: [['choice', 'L16/4'], ['from … import', 'L16/1']], noRun: true, io: [{ output: '오늘 점심: 라면' }], answer: 'import random\nmenus = ["김밥", "라면", "돈가스", "비빔밥"]\nprint("오늘 점심:", random.choice(menus))' },
    ],
    L16B: [
      { title: '며칠 뒤', text: '숫자 n 을 입력받아 2025 년 1 월 1 일의 n 일 뒤 날짜를 출력하세요.', needs: [['date', 'L16B/0'], ['timedelta', 'L16B/1']], pid: 'L16BP2' },
      { title: '무슨 요일', text: '<code>연 월 일</code> 을 한 줄로 입력받아 그날의 요일을 <code>금요일</code> 처럼 출력하세요. (<code>weekday()</code> 는 월요일이 0)', needs: [['weekday', 'L16B/2'], ['나눠 담기', 'L11/1']], pid: 'L16P5' },
    ],
    B4: [
      { title: '클래스로 만든 가위바위보', text: '@prompt', needs: [['클래스와 속성', 'L14/1'], ['함수 return', 'L8/2'], ['딕셔너리로 이기는 손 정하기', 'L10/0'], ['for + range', 'L5/2']], pid: 'B4P1' },
      { title: '연승 기록', text: '@prompt', needs: [['메서드로 속성 바꾸기', 'L15/0'], ['if·else', 'L4/3']], pid: 'B4P2' },
    ],
    L17: [
      { title: '쓰고 다시 읽기', text: '한 줄을 입력받아 <code>note.txt</code> 에 저장한 뒤, 파일을 다시 열어 읽은 내용을 출력하세요. 실행 뒤 VS Code 왼쪽 탐색기에 <code>note.txt</code> 가 생긴 것도 확인해 보세요.', needs: [['파일에 쓰기', 'L17/0'], ['파일 읽기', 'L17/1']], pid: 'L17P1' },
      { title: '줄 수 세기', text: '첫 줄에 n, 다음 n 줄의 문장을 <code>lines.txt</code> 에 한 줄씩 저장하고, 파일을 읽어 몇 줄인지 <code>3줄</code> 처럼 출력하세요.', needs: [['줄바꿈은 직접', 'L17/2'], ['readlines', 'L17/5']], pid: 'L17P2' },
      { title: '정렬해서 읽기', text: '단어들을 한 줄로 입력받아 <code>words.txt</code> 에 한 줄에 하나씩 저장하고, 다시 읽어 사전순으로 한 줄씩 출력하세요.', needs: [['읽은 줄을 리스트로', 'L17/6'], ['sorted', 'L11B/2']], pid: 'L17P5' },
      { title: '쌓이는 메모장', text: '한 줄을 입력받아 <code>memo.txt</code> 끝에 이어 쓰고, 파일 전체를 출력하세요. 여러 번 실행하면 메모가 쌓여요.', needs: [['"a": 이어 쓰기', 'L17/3'], ['파일이 없을 때', 'L17/7']], io: [{ input: '우유 사기', output: '우유 사기' }], answer: 'memo = input()\nwith open("memo.txt", "a", encoding="utf-8") as f:\n    f.write(memo + "\\n")\nwith open("memo.txt", "r", encoding="utf-8") as f:\n    print(f.read().strip())' },
    ],
    L18: [
      { title: '길이순 정렬', text: '단어들을 한 줄로 입력받아 짧은 것부터 띄어쓰기로 한 줄에 출력하세요. 길이가 같으면 입력 순서대로.', needs: [['람다', 'L18/0'], ['key 에 람다', 'L18/1'], ['join', 'L11C/3']], pid: 'L18P1' },
      { title: '점수순 이름', text: '<code>[("민수", 85), ("영희", 92), ("철수", 70)]</code> 을 점수 높은 순으로 정렬해 이름만 한 줄씩 출력하세요.', needs: [['튜플 리스트 정렬', 'L18/2'], ['나눠 담기', 'L11/1']], pid: 'L18P5' },
    ],
    L18B: [
      { title: 'map 으로 합계', text: '숫자들을 한 줄로 입력받아 <code>map</code> 으로 모두 정수로 바꾼 뒤 합을 출력하세요.', needs: [['map', 'L18B/0']], pid: 'L18P4' },
      { title: '양수만', text: '숫자들을 한 줄로 입력받아 양수만 <code>filter</code> 로 골라 리스트로 출력하세요.', needs: [['filter', 'L18B/1'], ['람다', 'L18/0']], io: [{ input: '3 -1 0 7 -5', output: '[3, 7]' }], answer: 'nums = map(int, input().split())\npositive = list(filter(lambda x: x > 0, nums))\nprint(positive)' },
      { title: '번호 붙여 출력', text: '<code>["민수", "영희", "철수"]</code> 를 1 번부터 번호를 붙여 <code>1 민수</code> 처럼 출력하세요.', needs: [['enumerate', 'L18B/2']], pid: 'L18BP1' },
      { title: '이름과 점수 짝짓기', text: '<code>["민수", "영희"]</code> 와 <code>[90, 85]</code> 를 같은 칸끼리 짝지어 <code>민수 90</code> 처럼 출력하세요.', needs: [['zip', 'L18B/3']], pid: 'L18BP2' },
      { title: '가장 긴 단어', text: '단어들을 한 줄로 입력받아 가장 긴 단어를 출력하세요.', needs: [['max(…, key=len)', 'L18B/4']], io: [{ input: 'cat elephant dog', output: 'elephant' }], answer: 'words = input().split()\nprint(max(words, key=len))' },
    ],
    B5: [
      { title: '텍스트 RPG 전투', text: '@prompt', needs: [['클래스', 'L14/4'], ['randint·seed', 'L16/3'], ['while', 'L6/1'], ['파일 쓰고 읽기', 'L17/1']], pid: 'B5P1' },
      { title: 'RPG 가방', text: '@prompt', needs: [['딕셔너리 get', 'L10/2'], ['sorted', 'L11B/2'], ['파일에 쓰기', 'L17/0']], pid: 'B5P2' },
    ],
    X1: [{ title: '내 CSV 분석기', text: '@prompt', needs: [['csv.DictReader', 'X1/1'], ['반별로 모으기', 'X1/3'], ['소수 첫째 자리', 'X1/5'], ['csv.writer', 'X1/7']], pid: 'X1P1' }],
    X2: [{ title: '단어 암기 퀴즈', text: '@prompt', needs: [['csv.reader', 'X2/1'], ['명령과 값 나누기', 'X2/2'], ['복사본을 섞기', 'X2/3']], pid: 'X2P1' }],
    X3: [{ title: '할 일 관리 앱', text: '@prompt', needs: [['json.load', 'X3/1'], ['json.dump', 'X3/2'], ['여러 기준으로 정렬', 'X3/5'], ['for … else', 'X3/6']], pid: 'X3P1' }],
    X4: [{ title: '가계부 분석기', text: '@prompt', needs: [['월별로 묶기', 'X4/1'], ['천 단위 쉼표', 'X4/2'], ['비율', 'X4/4'], ['막대 그래프', 'X4/6']], pid: 'X4P1' }],
    L19: [
      { title: '며칠 남았나', text: '두 날짜(<code>YYYY-MM-DD</code>)를 두 줄로 입력받아 첫 날짜에서 둘째 날짜까지 <code>N일 남음</code> 을 출력하세요. 같은 날이면 <code>오늘!</code>, 이미 지났으면 <code>N일 지남</code>.', needs: [['며칠 차이: .days', 'L19/3'], ['입력받은 날짜는 글자', 'L19/5']], pid: 'L19P2' },
      { title: '요일 알려주기', text: '날짜 한 줄을 입력받아 <code>2026-11-02은 월요일</code> 형식으로 출력하세요.', needs: [['weekday()', 'L19/2'], ['글자로 되돌리기', 'L19/1']], pid: 'L19P4' },
      { title: '100 일 뒤', text: '날짜(<code>YYYY-MM-DD</code>)를 입력받아 그날로부터 100 일 뒤 날짜를 출력하세요.', needs: [['며칠 뒤: timedelta', 'L19/4'], ['입력받은 날짜는 글자', 'L19/5']], io: [{ input: '2026-11-06', output: '2027-02-14' }], answer: 'from datetime import date, timedelta\n\nd = date.fromisoformat(input())\nprint(d + timedelta(days=100))' },
    ],
    L20: [
      { title: '숫자 전부 더하기', text: '한 줄의 글에서 숫자를 전부 찾아 합을 출력하세요. (<code>사과 3개, 배 12개</code> → <code>15</code>)', needs: [['모양으로 찾기', 'L20/0'], ['개수 붙이기 +', 'L20/1'], ['찾은 건 글자', 'L20/3']], pid: 'L20P2' },
      { title: '전화번호만 뽑기', text: '여러 줄(끝까지)에서 <code>010-XXXX-XXXX</code> 모양의 전화번호를 전부 찾아 한 줄에 하나씩 출력하세요. 없으면 <code>없음</code>.', needs: [['여러 줄을 한 번에', 'L20/4'], ['{n}', 'L20/1']], pid: 'L20P3' },
      { title: '개인정보 가리기', text: '한 줄 글에서 <code>010-XXXX-XXXX</code> 의 마지막 4 자리를 <code>****</code> 로 바꿔 출력하세요.', needs: [['re.sub', 'L20/6'], ['괄호로 일부 살리기', 'L20/7']], pid: 'L20P5' },
    ],
    L21: [
      { title: '테스트 먼저 쓰기', text: '<code>clamp(x, lo, hi)</code> 는 x 를 lo~hi 사이로 자르는 함수예요(작으면 lo, 크면 hi, 아니면 x). 아래 코드에는 테스트 4 개와 세는 부분이 있고 함수는 아직 <code>return x</code> 뿐이에요. 함수를 완성해서 <code>통과 4/4</code> 가 나오게 하세요.', given: true, needs: [['assert', 'L21/0'], ['테스트 함수로 묶기', 'L21/5'], ['실패해도 끝까지 세기', 'L21/6']], pid: 'L21P2' },
      { title: '세 가지 테스트', text: '<code>is_valid_id(s)</code> 는 아이디가 4~12 글자이고 영문 소문자·숫자만이면 True 예요(아래 코드에 있어요). 정상 1 개·경계 2 개(딱 4 글자, 딱 12 글자)·이상 2 개(3 글자, 대문자 섞임), 모두 5 개의 <code>assert</code> 를 써서 전부 통과하면 <code>테스트 5개 통과</code> 가 나오게 하세요. 한글은 이 함수가 따로 거르지 않으니 이상한 값은 한글 없이 만드세요.', given: true, needs: [['assert not', 'L21/2'], ['경계값', 'L21/3'], ['정상·경계·이상', 'L21/4']], pid: 'L21P5' },
    ],
    L22: [
      { title: '버그 3 개 고치기', text: '아래 코드는 점수들의 합·평균·최고점을 출력하려는데, 에러 없이 결과만 틀리는 버그가 3 개 있어요. VS Code 에 붙여 실행해 보고, <code>print</code> 로 값을 찍어 가며 고쳐서 출력 예와 같게 만드세요.', needs: [['논리 버그', 'L22/1'], ['print 로 값 찍기', 'L22/2'], ['작은 입력으로 손계산', 'L22/4']], given: true, pid: 'L22P2' },
      { title: 'print 로 추적하기', text: '아래 함수는 짝수만 두 배로 바꾼 새 리스트를 만들려는데 결과가 비어요. 반복 안에 <code>print("x:", x, "result:", result)</code> 를 넣어 보고 버그를 찾아 고치세요.', needs: [['print 로 값 찍기', 'L22/2'], ['자주 나오는 논리 버그', 'L22/5']], given: true, pid: 'L22P5' },
    ],
    L23: [
      { title: '이름 붙이기', text: '아래 코드는 돌아가지만 읽기 어려워요. 변수 이름을 뜻이 보이게 바꾸고 <code>0.1</code> 을 상수(대문자 이름)로 빼세요. 출력은 그대로여야 해요.', needs: [['리팩터링', 'L23/0'], ['상수', 'L23/1']], given: true, pid: 'L23P2' },
      { title: '계산과 출력 나누기', text: '아래 코드의 계산 부분을 함수 <code>total_price(items)</code> 로 떼어 내세요(items 는 <code>(가격, 개수)</code> 튜플 리스트, 합계를 돌려줌). <code>assert total_price([(100, 2)]) == 200</code> 이 통과하고 출력은 그대로여야 해요. 입력은 줄마다 <code>가격 개수</code>, 끝까지.', needs: [['계산만 하는 함수로', 'L23/2'], ['입력을 줄마다', 'L23/3']], given: true, pid: 'L23P3' },
      { title: '중복 없애기', text: '같은 계산이 세 번 반복돼요. 할인가를 정수로 돌려주는 함수 <code>discounted(price, rate)</code> 하나로 묶고 세 줄을 그 함수 호출로 바꾸세요. 입력은 가격 3 개(띄어쓰기).', needs: [['같은 코드가 두 번이면 함수로', 'L23/4']], given: true, pid: 'L23P5' },
    ],
    B7: [
      { title: '알림 메시지 D-day', text: '@prompt', needs: [['date.fromisoformat', 'L19/5'], ['며칠 차이', 'L19/3'], ['re.match', 'L20/5'], ['여러 기준 정렬', 'L18/2']], pid: 'B7P1' },
      { title: '알림 속 돈과 번호', text: '@prompt', needs: [['re.findall', 'L20/0'], ['천 단위 쉼표', 'X4/2'], ['assert', 'L21/0']], pid: 'B7P2' },
    ],
    X5: [{ title: '일기장 통계', text: '@prompt', needs: [['^ $ re.M', 'X5/1'], ['re.split', 'X5/2'], ['단어 TOP 3', 'X5/5'], ['빠진 날', 'X5/7']], pid: 'X5P1' }],
    X6: [{ title: '비밀번호 검사기·생성기', text: '@prompt', needs: [['규칙 목록', 'X6/1'], ['부족한 것과 점수', 'X6/2'], ['string 모듈', 'X6/5'], ['생성 순서', 'X6/6'], ['테스트', 'X6/7']], pid: 'X6P1' }],
  },
};
