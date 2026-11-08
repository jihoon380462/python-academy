// courses/algo/book.js — 알고리즘 「교과서」 모드 데이터 (v2.15.0, 사용자 「1」 = N5 알고리즘도 교과서로). 화면은 core/ui-views-book.js, 문제 모양은 core/book-derive.js.
// 파이썬 교과서와 같은 방식: 레슨을 읽고 → 예제를 VS Code 에서 돌려 보고 → 레슨 끝 「🛠 만들어 보기」 를 빈 파일에서 직접.
//   이 코스만: meta.viz — 레슨 예제의 「👀 그림으로 보기」(정렬·탐색 애니메이션)·「👣 한 줄씩 보기」를 남김(누를 때만 브라우저 파이썬 엔진을 받음)
//   함수 문제(옛 문제의 테스트가 call/ret)는 「확인 코드」(print(호출))와 그 출력이 자동으로 붙음 — 사용자는 함수 아래에 붙여 실행
//   needs 는 [실제 문법(코드 모양), '레슨id/쪽(0부터)', 짧은 설명] (v2.9.2 사용자 「필요 문법은 실제 코드로」)
//   검증: node tools/check_book.mjs algo (모든 예시 답을 실제 python3 로 돌려 출력 예와 같은지 · 지문에 이 앱 버튼 안내가 남았는지)
const BOOK = {
  meta: {
    viz: true,
    kicker: '🧭 알고리즘 교과서', hero: '읽고, 그림으로 보고, VS Code 에서 직접 풀어 보기',
    heroP: '레슨은 자료구조·알고리즘 설명이에요. 예제마다 <b>👀 그림으로 보기</b> 로 코드가 도는 모습을 볼 수 있고, 레슨 끝 「만들어 보기」 에는 문장으로 된 문제와 그 문제에 필요한 코드가 있어요. 채점·점수·잠금은 없어요 — 필요한 곳부터 펴 보면 돼요.',
    dexName: '알고리즘 도감', dexShort: '도감', dexWhat: '배운 기법·자료구조', dexHint: '검색해서 바로 찾기(코딩테스트도 오픈북처럼)',
    dexExamples: '<code>deque</code>, <code>이진 탐색</code>, <code>BFS</code>, <code>heapq</code>', dexPlaceholder: '🔍 기법 찾기 — BFS, 정렬, heapq, bisect …', dexAlt: '「너비 우선 탐색」 대신 <code>BFS</code>',
    dexDocs: '파이썬 공식 문서의 <a href="https://docs.python.org/ko/3/library/collections.html" target="_blank" rel="noopener">collections</a> · <a href="https://docs.python.org/ko/3/library/heapq.html" target="_blank" rel="noopener">heapq</a> · <a href="https://docs.python.org/ko/3/library/bisect.html" target="_blank" rel="noopener">bisect</a>',
    dexRun: '예제는 📋 복사해서 VS Code 에서 바로 돌려 볼 수 있고', builtinsName: '코딩테스트 도구 상자', builtinsSub: 'import 한 줄이면 바로', builtinsChip: '🧰 도구 상자',
    makeIntro: 'VS Code 에서 빈 파일(예: <code>{file}</code>)을 만들고 직접 짜 보세요. <b>함수를 만드는 문제</b>는 함수 아래에 「확인 코드」 를 붙여 실행하면 「출력 예」 와 같아야 해요.',
    checkLabel: '확인 코드 — 만든 함수 아래에 붙여 넣고 실행하세요', startLabel: '시작 코드 — 복사해서 「# 여기에」 를 채우세요',
    prereq: [
      { lessons: ['A0'], chapters: [1], ref: 'SETUP/0', btn: '시작하기 1 · 파이썬·VS Code 준비 보기',
        title: '먼저 꼭! 「🛠 시작하기」 1 — 파이썬 · VS Code 준비',
        html: '이 교과서의 예제와 「만들어 보기」 는 전부 <b>내 컴퓨터의 VS Code</b> 에서 돌려요. 파이썬 교과서의 「시작하기」 를 이미 끝냈다면 확인만 하세요: 터미널에서 <code>python --version</code> 이 버전을 보여 주고, VS Code 오른쪽 위 ▷ 로 <code>.py</code> 파일이 돌면 준비 끝. 리스트·딕셔너리·함수(<code>def</code>)를 아직 모르면 파이썬 교과서를 먼저 보는 게 좋아요.' },
      { lessons: ['E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'AB4', 'A20'], chapters: [5], ref: 'SETUP/1', btn: '시작하기 2 · 긴 입력 넣는 법 보기',
        title: '긴 입력은 input.txt 로 — 「🛠 시작하기」 2',
        html: '여기 문제는 입력이 여러 줄이고 <code>sys.stdin.read()</code> 로 <b>끝까지</b> 읽어요. 터미널에 붙여 넣으면 입력을 끝내는 키(Windows <kbd>Ctrl</kbd>+<kbd>Z</kbd> → <kbd>Enter</kbd>)를 눌러야 하고, 고칠 때마다 다시 붙여야 해요. 입력 예를 <code>input.txt</code> 에 저장해 두고 파일로 읽게 하면 ▷ 한 번으로 끝나요.' },
    ],
  },
  // 지문 속 예전 문제집 화면 안내(👀 시각화 · 입력창 · 큰 입력 테스트 · 채점용 줄)를 교과서 말로 — check_book 이 남은 게 있는지 봄
  fixPrompt: (s) => String(s)
    .replace(/\s*\(시각화용\)/g, '')
    .replace(/\s*변수는 <code>a<\/code>, <code>j<\/code>를 쓰면 👀 시각화가 돼요\./g, '')
    .replace(/(로|으로)\s*(→|->)\s*(👀|▶)\s*시각화에서[^.]*\./g, '$1 지어요(레슨 예제와 같은 이름이라 읽기 쉬워요).')
    .replace(/(을|를)\s*쓰면\s*(👀|▶)\s*시각화(에|가)[^.]*\./g, '$1 쓰세요.')
    .replace(/(로|으로)\s*👀\s*시각화\./g, '$1 쓰세요.')
    .replace(/입력창에/g, '입력에')
    .replace(/큰 입력 테스트가 있어 이중 반복은 시간 초과/g, '입력이 수십만 개면 이중 반복은 시간 초과')
    .replace(/큰 입력 테스트가 있어 비트마스크 전수는 시간 초과예요/g, 'n = 25 면 비트마스크로 전부 보는 건(3천만 가지) 시간 초과예요')
    .replace(/큰 입력 테스트가 있어요/g, '입력이 수십만 개여도 바로 끝나야 해요')
    .replace(/\(큰 입력 테스트\)/g, '(입력이 아주 커도 빨라야 해요)')
    .replace(/\s*—\s*테스트가 스택 사용을 확인하진 않지만 연습이에요/g, ' — 스택 연습이에요')
    .replace(/아래 채점용 줄이 입력받은 값으로/g, '시작 코드 맨 아래 줄들이 입력받은 값으로'),
  fixCode: (s) => String(s)
    .replace(/# 채점용 도우미 — 지우지 마세요 \(테스트가 이 함수로 리스트·트리를 만들어요\)/g, '# 확인용 도우미 — 지우지 마세요 (확인 코드가 이 함수로 리스트·트리를 만들어요)')
    .replace(/# 채점용 도우미 — 지우지 마세요 \(입력값으로 BST 를 만들어 preorder 를 불러요\)/g, '# 확인용 도우미 — 지우지 마세요 (입력값으로 BST 를 만들어 preorder 를 불러요)')
    .replace(/채점용/g, '확인용'),
  setup: {
    title: '시작하기: 알고리즘을 VS Code 에서 공부하기',
    pages: [
      { title: '1. 준비물: 파이썬 · VS Code', html: `<p>알고리즘 코드도 결국 파이썬이에요. 파이썬 교과서의 「시작하기」 1~3 을 했다면 <b>④ 확인</b> 만 하고 넘어가세요.</p>
<div class="bk-step-box"><b>① 파이썬 설치</b><br><a href="https://www.python.org/downloads/windows/" target="_blank" rel="noopener">python.org/downloads/windows</a> → 최신 버전의 <b>「Download Windows installer (64-bit)」</b> → 받은 파일 실행 → 첫 화면 맨 아래 <b>☑ Add python.exe to PATH</b> 를 <b>꼭 체크</b> → <b>Install Now</b>.</div>
<div class="bk-step-box"><b>② VS Code 와 Python 확장</b><br><a href="https://code.visualstudio.com/" target="_blank" rel="noopener">code.visualstudio.com</a> 에서 설치 → 왼쪽 세로 줄 <b>확장</b>(<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>X</kbd>) → 검색 칸에 <code>Python</code> → 만든 곳이 <b>Microsoft</b> 인 「Python」 <b>설치</b>.</div>
<div class="bk-step-box"><b>③ 공부 폴더</b><br>문서나 바탕화면에 <code>algo-study</code> 폴더를 만들고 VS Code 메뉴 <b>파일 → 폴더 열기</b> 로 열어요. 레슨마다 <code>l02_1.py</code>, <code>l02_2.py</code> … 처럼 파일을 만들면 나중에 찾기 쉬워요.</div>
<div class="bk-step-box"><b>④ 확인</b><br>VS Code 메뉴 <b>터미널 → 새 터미널</b> 에서 <pre>python --version</pre><code>Python 3.1x.x</code> 가 나오고, <code>test.py</code> 에 <code>print("준비 완료")</code> 를 쓰고 오른쪽 위 <b>▷</b> 를 눌러 아래 터미널에 <code>준비 완료</code> 가 나오면 끝이에요.</div>
<div class="bk-warn"><b>막히면</b><ul><li><code>python</code> 이 없다고 나와요 → ① 에서 PATH 칸을 안 켰어요. 설치 파일을 다시 실행 → <b>Modify</b> → Next → <b>☑ Add Python to environment variables</b>.</li><li>▷ 가 없어요 → ② 의 Python 확장이 없거나 파일 이름이 <code>.py</code> 로 안 끝나요.</li><li>자세한 설명(화면마다)은 파이썬 교과서 「시작하기」 1~3 에 있어요.</li></ul></div>` },
      { title: '2. 긴 입력은 input.txt 로 넣기', html: `<p>코딩테스트 문제는 입력이 여러 줄이에요. 터미널에 한 줄씩 치면 오래 걸리고, 고칠 때마다 다시 쳐야 해요. <b>입력을 파일에 저장해 두고 읽게</b> 하면 ▷ 한 번으로 끝나요.</p>
<div class="bk-step-box"><b>① 입력 파일 만들기</b><br>.py 파일과 <b>같은 폴더</b>에 <code>input.txt</code> 를 만들고, 문제의 「입력 예」 를 📋 그대로 붙여 넣고 저장(<kbd>Ctrl</kbd>+<kbd>S</kbd>).</div>
<div class="bk-step-box"><b>② 코드 맨 위에 두 줄</b><pre>import sys
sys.stdin = open("input.txt", encoding="utf-8")</pre>이러면 아래의 <code>input()</code> · <code>sys.stdin.read()</code> · <code>sys.stdin.readline()</code> 이 터미널 대신 <code>input.txt</code> 를 읽어요. 코드는 그대로 두고 입력만 바꿔 가며 시험할 수 있어요.<br><span class="muted small">실제 코딩테스트에 낼 때는 이 두 줄을 <b>지우고</b> 내요(채점 서버는 입력을 직접 넣어 줘요).</span></div>
<div class="bk-step-box"><b>③ ▷ 실행</b><br>오른쪽 위 ▷. 터미널에서 직접 돌린다면 <code>python l20_1.py</code>. <span class="muted small">PowerShell 은 <code>python main.py &lt; input.txt</code> 같은 <code>&lt;</code> 를 못 써요 — 그래서 ② 의 방법이 제일 간단해요.</span></div>
<div class="bk-warn"><b>파일 없이 터미널에 붙여 넣을 때</b><br><code>sys.stdin.read()</code> 로 「끝까지」 읽는 프로그램은 입력을 다 붙여 넣은 뒤 <b>Windows: <kbd>Ctrl</kbd>+<kbd>Z</kbd> → <kbd>Enter</kbd></b>, Mac: <kbd>Ctrl</kbd>+<kbd>D</kbd> 를 눌러야 입력이 끝나요. 안 누르면 계속 기다려요.</div>
<div class="bk-warn"><b>한글이 깨지면</b><br><code>open(…, encoding="utf-8")</code> 의 <code>encoding</code> 을 빠뜨렸거나, 메모장에서 다른 인코딩으로 저장했어요. VS Code 로 <code>input.txt</code> 를 만들면 오른쪽 아래 상태 표시줄에 <b>UTF-8</b> 이 보여요.</div>` },
      { title: '3. 시간 재기 · 멈추기 · 재귀 한도', html: `<p>알고리즘은 <b>빠르기</b>를 따져요. 내 컴퓨터에서 직접 재 보는 법과, 오래 걸릴 때 멈추는 법이에요.</p>
<div class="bk-step-box"><b>① 걸린 시간 재기</b><pre>import time
t = time.perf_counter()
total = sum(range(10_000_000))
print(round(time.perf_counter() - t, 3), "초")</pre>시작 전 시각을 적어 두고, 끝난 뒤 시각에서 빼요([[레슨:A0]]). 숫자는 컴퓨터마다 달라요 — <b>n 을 2배로 했을 때 몇 배가 되나</b>를 보세요.</div>
<div class="bk-step-box"><b>② 안 끝날 때 멈추기</b><br>터미널을 한 번 누르고 <kbd>Ctrl</kbd>+<kbd>C</kbd>. <code>KeyboardInterrupt</code> 가 나오며 멈춰요. 무한 반복이거나 너무 느린 풀이예요.</div>
<div class="bk-step-box"><b>③ 재귀가 깊으면</b><br><code>RecursionError: maximum recursion depth exceeded</code> 는 재귀가 1000번쯤 넘게 들어갔다는 뜻이에요. 기저 조건이 빠졌는지 먼저 보고, 정말 깊은 거면 맨 위에<pre>import sys
sys.setrecursionlimit(10**6)</pre>([[레슨:A20]] 「입출력과 재귀 함정」).</div>
<div class="bk-step-box"><b>④ 한 줄씩 따라가기(VS Code)</b><br>줄 번호 왼쪽을 눌러 빨간 점(중단점) → <kbd>F5</kbd> → 「Python Debugger: Debug Python File」. 왼쪽 <b>변수</b> 칸에 <code>stack</code>·<code>queue</code> 같은 값이 보이고 <kbd>F10</kbd> 으로 한 줄씩 내려가요. 이 교과서 레슨의 「👣 한 줄씩 보기」 와 같은 일이에요.</div>` },
      { title: '4. 이 교과서 쓰는 법', html: `<p>이 사이트는 문제집이 아니라 <b>옆에 펴 두는 교과서</b>예요. 점수·잠금·순서 강요가 없어요.</p>
<div class="bk-step-box"><b>① 레슨 읽기 + 그림으로 보기</b><br>레슨은 기법 하나씩 설명해요. 예제 아래 <b>👀 그림으로 보기</b> 를 누르면 그 예제 코드가 브라우저에서 돌며 리스트 막대·스택·트리·그래프가 움직여요. <b>👣 한 줄씩 보기</b> 는 줄마다 변수 값을 표로 보여 줘요. 처음 한 번은 파이썬 엔진을 받느라 몇 초 걸려요.</div>
<div class="bk-step-box"><b>② 예제는 VS Code 에서</b><br>📋 복사 → VS Code 에 붙여 ▷. 숫자·리스트를 바꿔 다시 돌려 보세요. 그림으로 본 것과 같은 결과가 나와요.</div>
<div class="bk-step-box"><b>③ 「🛠 만들어 보기」</b><br>레슨 마지막 쪽에 문장으로 된 문제가 있어요. 문제마다 <b>필요한 문법</b>(누르면 그 설명 쪽으로, 돌아오는 버튼 있음), <b>입력 예 · 출력 예</b>, 막히면 펴 보는 <b>예시 답</b> 이 있어요.<br><b>함수를 만드는 문제</b>(<code>def is_balanced(s):</code> 처럼)는 「확인 코드」 가 같이 있어요 — 내 함수 <b>아래에</b> 붙여 실행하면 「출력 예」 와 같아야 해요.</div>
<div class="bk-step-box"><b>④ 챕터 끝 「만들어 보기」 와 모의고사</b><br>챕터마다 기법을 묶는 큰 문제가 있고, 「패턴」 챕터 끝에는 코딩테스트 모의고사 15문제가 있어요. 「실전」 챕터는 미로 게임·지하철 길찾기 같은 작은 프로그램을 단계별로 만들어요.</div>
<div class="bk-step-box"><b>⑤ 막히면</b><br>문제를 한국어로 단계로 나눠 적기(「입력받는다 → 정렬 → 앞에서부터 고른다」) → 필요한 문법 다시 보기 → <code>print()</code> 로 중간값 찍기 → 📚 도감에서 기법 검색 → 예시 답 펴 보고, <b>닫은 다음 안 보고 다시 쳐 보기</b>.</div>` },
    ],
  },
  // 도감 맨 앞 「🧰 코딩테스트 도구 상자」 — output 은 이 코드를 실제로 돌린 결과(check_book 이 다시 확인). ref 는 설명이 있는 레슨 쪽
  builtins: [
    { name: 'collections.deque', desc: '양쪽 끝에서 넣고 빼기가 O(1). 큐(BFS)·덱은 리스트 대신 이것.', code: 'from collections import deque\nq = deque([1, 2])\nq.append(3)\nq.appendleft(0)\nprint(q.popleft(), q.pop(), list(q))', output: '0 3 [1, 2]', ref: 'A3/1' },
    { name: 'heapq.heappush · heappop', desc: '가장 작은 값을 O(log n) 에 꺼내는 우선순위 큐. 튜플이면 첫 칸부터 비교.', code: 'import heapq\nh = []\nfor x in [5, 1, 4]:\n    heapq.heappush(h, x)\nprint(heapq.heappop(h), heapq.heappop(h))\nprint(heapq.nsmallest(2, [7, 3, 9, 1]))', output: '1 4\n[1, 3]', ref: 'A11/0' },
    { name: '최대 힙: heappush(h, -x)', desc: 'heapq 는 최소 힙뿐 — 부호를 바꿔 넣고 꺼낼 때 다시 바꿔요.', code: 'import heapq\nh = []\nfor x in [5, 1, 4]:\n    heapq.heappush(h, -x)\nprint(-heapq.heappop(h))', output: '5', ref: 'A11/3' },
    { name: 'bisect.bisect_left · bisect_right', desc: '정렬된 리스트에서 끼워 넣을 자리를 O(log n) 에. x 미만 개수 = bisect_left, x 이하 개수 = bisect_right.', code: 'import bisect\na = [1, 3, 3, 7]\nprint(bisect.bisect_left(a, 3), bisect.bisect_right(a, 3))\nprint(len(a) - bisect.bisect_left(a, 3), "개가 3 이상")', output: '1 3\n3 개가 3 이상', ref: 'A7/3' },
    { name: 'collections.Counter', desc: '개수 세기 딕셔너리. most_common(k) 로 많은 순 k개.', code: 'from collections import Counter\nc = Counter("banana")\nprint(c["a"], c["z"])\nprint(c.most_common(2))', output: '3 0\n[(\'a\', 3), (\'n\', 2)]', ref: 'A8/1' },
    { name: 'collections.defaultdict', desc: '없는 키를 처음 쓰면 기본값(list 면 [], int 면 0)을 만들어 줘요. 그룹 묶기·인접 리스트에.', code: 'from collections import defaultdict\ng = defaultdict(list)\nfor a, b in [(1, 2), (1, 3), (2, 3)]:\n    g[a].append(b)\nprint(dict(g))', output: '{1: [2, 3], 2: [3]}', ref: 'A16B/1' },
    { name: 'sorted(목록, key=lambda x: (…, …))', desc: '기준이 여러 개면 튜플로. 큰 것부터는 숫자에 - 를 붙여요.', code: 'rows = [("민수", 90), ("영희", 95), ("철수", 90)]\nprint(sorted(rows, key=lambda r: (-r[1], r[0])))', output: '[(\'영희\', 95), (\'민수\', 90), (\'철수\', 90)]', ref: 'A6B/1' },
    { name: 'itertools.combinations · permutations', desc: '고르기(순서 없음) · 줄 세우기(순서 있음). 완전탐색에.', code: 'from itertools import combinations, permutations\nprint(list(combinations([1, 2, 3], 2)))\nprint(len(list(permutations("abc"))))', output: '[(1, 2), (1, 3), (2, 3)]\n6', ref: 'A19/1' },
    { name: 'itertools.accumulate', desc: '누적 합을 한 줄로. 앞에 0 을 붙이면 구간 합 = prefix[r+1] - prefix[l].', code: 'from itertools import accumulate\na = [3, 1, 4, 1, 5]\nprefix = [0] + list(accumulate(a))\nprint(prefix)\nprint(prefix[4] - prefix[1])', output: '[0, 3, 4, 8, 9, 14]\n6', ref: 'A15/4' },
    { name: 'functools.lru_cache', desc: '함수 결과를 기억해 같은 계산을 다시 안 함(메모이제이션).', code: 'from functools import lru_cache\n@lru_cache(maxsize=None)\ndef fib(n):\n    return n if n < 2 else fib(n - 1) + fib(n - 2)\nprint(fib(80))', output: '23416728348467685', ref: 'A14/0' },
    { name: 'sys.stdin.readline · sys.stdin.read', desc: '입력이 많을 때 input() 대신. readline 은 한 줄(끝의 \\n 포함), read 는 끝까지 전부.', code: 'import sys\nn = int(sys.stdin.readline())\nnums = list(map(int, sys.stdin.readline().split()))\nprint(n, sum(nums))', input: '3\n10 20 30', output: '3 60', ref: 'A20/2' },
    { name: '"\\n".join(map(str, 목록))', desc: '줄이 많은 출력은 print 를 여러 번 하지 말고 한 번에.', code: 'out = [x * 2 for x in [1, 2, 3]]\nprint("\\n".join(map(str, out)))', output: '2\n4\n6', ref: 'A20/2' },
    { name: 'float("inf")', desc: '「아직 못 감」 같은 아주 큰 값. 최솟값 찾기·다익스트라의 처음 거리.', code: 'INF = float("inf")\ndist = {"A": 0, "B": INF}\nprint(dist["B"] > 10**18, min(5, INF))', output: 'True 5', ref: 'A13/1' },
    { name: 'ord(글자) · chr(번호)', desc: '글자 ↔ 번호. 알파벳 칸 이동(시저 암호)·글자 개수 표에.', code: 'print(ord("a"), chr(ord("a") + 2))\nprint(chr((ord("y") - ord("a") + 3) % 26 + ord("a")))', output: '97 c\nb', ref: 'A16/1' },
    { name: 'bin(n) · & | ^ << >>', desc: '2진수 보기와 비트 연산. 1 << k 는 k번 칸만 켠 수.', code: 'print(bin(13), bin(13).count("1"))\nprint(5 & 3, 5 | 3, 5 ^ 3, 1 << 4)', output: '0b1101 3\n1 7 6 16', ref: 'A17/1' },
  ],
  // 레슨 쪽 제목 — 별명만 있던 제목에 실제 코드·정식 용어를 앞에(파이썬 교과서 v2.9.3 사용자 「필요 문법」 지적과 같은 원인). 도감 이름도 이것. 키 '레슨id/쪽'
  titles: {
    'A2/0': '스택 stack.append() · stack.pop(): 접시 더미',
    'A2/1': '괄호 짝 맞추기: stack.pop() != pair[ch]',
    'A2/2': 'if not stack: 꺼내기 전에 비었는지 보기',
    'A2/3': 'while stack: stack.pop() — 되돌리기와 뒤집기',
    'A3/0': '큐 queue.append() · queue.pop(0): 먼저 온 사람 먼저',
    'A3/1': 'from collections import deque: 빠른 큐',
    'A3/2': '덱의 네 동작: append · appendleft · pop · popleft',
    'A3/4': 'q.append(q.popleft()): 앞사람을 뒤로',
    'A4/0': '재귀 f(n - 1) 과 기저 조건: 자기 자신을 부르기',
    'A4/1': '호출 스택: 쌓였다가 풀리기',
    'A4/3': 'fib(n - 1) + fib(n - 2): 같은 계산의 반복',
    'A4/4': '하노이 탑 hanoi(n - 1, …): 큰 문제를 작은 문제로',
    'A5/0': '버블 정렬: a[j], a[j + 1] = a[j + 1], a[j]',
    'A5/2': '선택 정렬: 가장 작은 칸을 앞으로',
    'A5/3': '삽입 정렬: key = a[i] 를 끼워 넣기',
    'A6/0': '병합 정렬 merge_sort: 나누고 합치기',
    'A6/2': '퀵 정렬: pivot 으로 가르기',
    'A6B/0': 'sorted(목록, key=…): 실전은 sorted 와 key',
    'A6B/1': 'key=lambda x: (기준1, 기준2): 기준이 여러 개일 때',
    'A7/0': '이진 탐색 mid = (lo + hi) // 2: 업다운 게임',
    'A7/2': 'while lo <= hi: 없는 값을 찾으면 -1',
    'A7/3': 'bisect.bisect_left: 끼워 넣을 자리',
    'A8/0': '해시 hash() · dict · set: 칸 번호로 바로 가기',
    'A8/1': 'set() · Counter: 중복 제거와 개수 세기',
    'A8/3': 'if target - x in seen: 두 수의 합을 해시로 한 번에',
    'A9/0': 'class Node (val · next): 사슬로 이어진 상자',
    'A9/1': 'while cur: cur = cur.next — 끝까지 따라가기',
    'A9/2': 'new.next = a.next: 끼워 넣기와 빼기',
    'A9/3': 'prev · cur · nxt: 연결 리스트 뒤집기',
    'A10/0': '트리 Node (left · right): 루트와 자식',
    'A10/1': 'BST 찾기: 작으면 left, 크면 right',
    'A10/3': '전위 · 중위 · 후위 순회 3종',
    'A11/0': 'heapq.heappush · heappop: 응급실 순서',
    'A11/1': '(우선순위, 도착순서, 이름) 튜플: 같으면 먼저 온 사람',
    'A11/2': '힙은 배열 안의 트리(부모 ≤ 자식)',
    'A11/3': '최대 힙 heappush(h, -x) 와 k번째',
    'A12/0': '그래프 graph = {정점: [이웃, …]}: 정점과 간선',
    'A12/1': 'graph.setdefault(u, []).append(v): 간선 목록으로 그래프 만들기',
    'A12/2': 'BFS deque · visited: 가까운 곳부터',
    'A12/3': 'DFS def dfs(r, c): 한 길로 끝까지',
    'A13/0': '가중치 그래프 {이웃: 거리}: 칸 수가 아니라 거리',
    'A13/1': '다익스트라 heapq · dist: 가장 가까운 곳부터',
    'A13/3': 'prev[nb] = node: 경로 복원과 주의점',
    'A14/0': '메모이제이션 memo = {}: 기억해 두기',
    'A14/1': 'DP 표 dp = [0] * (n + 1): 작은 것부터 채우기',
    'A14/2': 'dp[x] = min(dp[x], dp[x - c] + 1): 동전 거스름돈',
    'A14/3': 'cur = max(x, cur + x): 최대 부분합',
    'A15/0': '그리디 sort(끝나는 시각 순): 매 순간 최선',
    'A15/2': '투 포인터 lo, hi = 0, len(a) - 1',
    'A15/3': '슬라이딩 윈도우 win += a[i] - a[i - k]',
    'A15/4': '누적 합 prefix[r + 1] - prefix[l]',
    'A16/0': '문자열 s[i] · s[a:b]: 글자 띠',
    'A16/2': '회문: lo · hi 양끝에서 가운데로',
    'A16B/0': 'c[ch] = c.get(ch, 0) + 1: 글자 개수로 비교하기',
    'A16B/1': '"".join(sorted(w)) 열쇠: 아나그램끼리 묶기',
    'A16B/3': 'result += ch 의 숨은 비용 → "".join(parts)',
    'A17/0': 'bin(n): 2진수 읽기',
    'A17/1': '& | ^ << >>: 자리별로 계산하기',
    'A17/2': 'mask |= 1 << k: 비트마스크 = 작은 집합',
    'A17/4': 'for mask in range(1 << n): 부분집합 전부 돌기',
    'A18/0': '방향 배열 dr · dc: 시키는 대로 정확히',
    'A18/1': 'd = (d + 1) % 4: 회전은 번호 더하기',
    'A18/2': '0 <= r < R and 0 <= c < C: 범위 검사와 명령 분기',
    'A18B/1': 'new = a[:] 로 따로: 동시에 바뀌는 규칙',
    'A19/0': 'itertools permutations · combinations: 다 해 보면 된다',
    'A19B/0': '백트래킹 path.append → 재귀 → path.pop()',
    'A20/2': 'sys.stdin.read() · setrecursionlimit: 입출력과 재귀 함정',
  },
  pages: {
    'A0/0': { rep: [['🎚 슬라이더로 <code>n</code>을 키워 보세요.', 'VS Code 에서 코드 위쪽 <code>n = 1000000</code> 의 숫자를 키워 다시 실행해 보세요.']] },
    'A0/4': { title: '이 교과서에서 하는 것', html: '<p>이 코스는 <b>코드가 돌아가는 모습을 눈으로 보면서</b> 배워요. 레슨 예제 아래 <b>👀 그림으로 보기</b> 를 누르면 그 예제가 브라우저에서 돌며 변수가 바뀌는 순간마다 그림이 움직이고, 지금 실행 중인 줄이 코드 칸에서 노랗게 칠해져요. 예제에 따라 <b>👣 한 줄씩 보기</b> 버튼도 있어요 — 줄마다 변수 값을 표로 보여 줘요.</p><p>아래 예제는 옆 두 칸을 비교해 큰 값을 뒤로 보내요. <code>[5, 3, 8, 1, 4]</code>에서 j = 0: 5 > 3 이라 바꿈 → [3, 5, 8, 1, 4] · j = 1: 5 &lt; 8 그대로 · j = 2: 8 > 1 바꿈 → [3, 5, 1, 8, 4] · j = 3: 8 > 4 바꿈 → <b>[3, 5, 1, 4, 8]</b>. 가장 큰 8이 맨 뒤로 갔어요([[레슨:A5]]의 버블 정렬).</p><p>직접 짜는 건 <b>VS Code</b> 에서 해요. 레슨 마지막 쪽 <b>「🛠 만들어 보기」</b> 의 문제를 빈 파일에서 풀고, 문제에 붙은 「필요한 문법」 을 누르면 그 설명으로 가요. 내 코드도 한 줄씩 보고 싶으면 VS Code 디버거(시작하기 3 ④)를 써요.</p><p>「패턴」 챕터 끝에는 진짜 코딩테스트 같은 <b>모의고사 15문제</b>가 있어요.</p>' },
    'A1/0': { rep: [['🎚 슬라이더로 n을 바꿔 보세요.', '코드의 <code>n = 8</code> 을 바꿔 다시 실행해 보세요.']] },
    'A16B/3': { rep: [['<code>n</code> 슬라이더를 키워 보세요.', '코드의 <code>n = 5</code> 를 키워 다시 실행해 보세요.']] },
    'A17/0': { rep: [['<code>n</code> 슬라이더를 움직여 보세요.', '코드의 <code>n = 13</code> 을 여러 값으로 바꿔 실행해 보세요.']] },
    'A20/0': { rep: [['<code>n</code> 슬라이더를 2배로 올리면 시간은 약 4배가 돼요.', '코드의 <code>n = 2000</code> 을 4000 으로 2배 올리면 시간은 약 4배가 돼요.']] },
    'A20/1': { rep: [['<code>n</code> 슬라이더를 바꿔 가며', '코드의 <code>n = 200000</code> 을 바꿔 가며']] },
    'E1/0': { rep: [['어떻게 퍼져 나가는지 ▶ 시각화로 직접 볼 수 있어요.', '어떻게 퍼져 나가는지 레슨 예제의 👀 그림으로 보기로 직접 볼 수 있어요.'], ['완성하면 입력창에', '완성하면 <code>input.txt</code> 에']] },
    'E1/2': { rep: [['시각화를 위해 변수 이름을', '레슨 예제와 같게 변수 이름을']] },
    'E4/1': { rep: [['출력 순서를 정해 둬야 채점이 돼요:', '출력 순서를 정해 둬야 출력 예와 비교할 수 있어요:']] },
    'E2/1': { rep: [['시각화 변수:', '예제의 주요 변수:']] },
  },
  tasks: {
    // ---------- 챕터 1 들어가기 ----------
    A0: [
      { title: '두 가지 방법으로 합 구하기', text: '@prompt', pid: 'A0P3', needs: [['for i in range(1, n + 1):  total += i', 'A0/1', '하나씩 더하기'], ['n * (n + 1) // 2', 'A0/0', '공식으로 한 번에'], ['n = int(input())', 'SETUP/1', '숫자 한 개 입력받기']] },
      { title: '합이 10인 쌍 세기', text: '@prompt', pid: 'A0P4', needs: [['for i in range(len(a)):  for j in range(i + 1, len(a)):', 'A0/3', '모든 쌍을 한 번씩(i < j)'], ['def count_pairs(a): … return cnt', 'A0/2', '세서 돌려주는 함수']] },
      { title: '걸린 시간 재기', text: '<code>sum(range(1000000))</code> 이 걸린 시간을 재서 <code>0.012 초</code> 처럼 출력하세요. 아래 코드의 빈칸 <code>___1___</code> · <code>___2___</code> 를 채워 완성해요. (숫자는 컴퓨터마다 달라요)', pid: 'A0P5', noRun: true, needs: [['t = time.perf_counter()', 'A0/0', '지금 시각(초)'], ['time.perf_counter() - t', 'A0/0', '끝 시각 - 시작 시각 = 걸린 시간']] },
    ],
    A1: [
      { title: '느린 코드를 빠르게', text: '@prompt', pid: 'A1P5', needs: [['s = set(a)', 'A1/4', 'set 으로 바꾸면 in 이 O(1)'], ['for x in b:  if x in s:', 'A1/0', '한 겹 반복 = O(n)']] },
    ],
    A2: [
      { title: '괄호 짝 검사', text: '@prompt', pid: 'A2P2', needs: [['stack.append(ch)', 'A2/0', '맨 위에 쌓기'], ['stack.pop() != pair[ch]', 'A2/1', '맨 위와 짝이 맞는지'], ['if not stack:', 'A2/2', '꺼내기 전에 비었는지']] },
      { title: '빈 스택에서 꺼내기', text: '@prompt', pid: 'A2P3', given: true, needs: [['if not stack:  return False', 'A2/2', '비었으면 꺼내지 않기'], ['IndexError: pop from empty list', 'A2/2', '빈 리스트에서 pop 하면 나는 에러']] },
      { title: '문자열 뒤집기 (스택)', text: '@prompt', pid: 'A2P4', needs: [['while stack:  out += stack.pop()', 'A2/3', '쌓은 반대 순서로 꺼내기']] },
      { title: '실행 취소 기록', text: '작업 <code>쓰기</code>, <code>굵게</code>, <code>색</code> 을 차례로 리스트 <code>history</code> 에 기록하고, <b>마지막 것부터</b> 하나씩 꺼내며 <code>취소: 작업</code> 을 출력하세요.', pid: 'A2P5', start: true, needs: [['history.append(act)', 'A2/0', '기록 쌓기'], ['while history:  history.pop()', 'A2/3', '마지막 것부터 되돌리기']] },
      { title: '괄호 수정 횟수', text: '@prompt', pid: 'AB4P2', needs: [['open_cnt += 1  open_cnt -= 1', 'A2/1', '스택 대신 개수만 세기'], ['(a + 1) // 2 + (b + 1) // 2', 'A2/2', '남은 짝 없는 괄호로 답 계산']] },
    ],
    A3: [
      { title: '프린터 대기열', text: '@prompt', pid: 'A3P3', needs: [['from collections import deque', 'A3/1', '빠른 큐'], ['q.popleft()', 'A3/1', '맨 앞에서 꺼내기'], ['deque(input().split())', 'A3/3', '입력을 줄 세우기']] },
      { title: '요세푸스: 돌아가며 빼기', text: '@prompt', pid: 'A3P4', needs: [['q.append(q.popleft())', 'A3/4', '앞사람을 뒤로 보내기'], ['deque(range(1, n + 1))', 'A3/1', '1~n 줄 세우기']] },
    ],
    AB1: [
      { title: '복습 — 두 문서 묶어 찍기 · 출력 예측', predict: true, text: '<p>챕터 1 을 되짚어요. 먼저 [[레슨:A0]] 의 「모든 쌍을 한 번씩 보기」 예요. 프린터 대기열에 문서 6개가 서 있고, 리스트 <code>pages</code> 는 문서마다 쪽수예요. 쪽수 합이 딱 10 인 두 문서는 한 장에 묶어 찍으려고 해요.</p><p>돌리기 전에 출력 다섯 줄을 먼저 예상해 보고, VS Code 에서 돌려 맞았는지 확인해 보세요. 비교 횟수 <code>checks</code> 가 [[레슨:A1]] 의 n(n-1)/2 와 같은지가 핵심이에요.</p>', needs: [['for j in range(i + 1, len(pages)):', 'A0/3', '모든 쌍을 한 번씩(i < j)'], ['n * (n - 1) // 2', 'A1/1', '안쪽이 점점 짧아지는 두 겹 = n(n-1)/2 번 → O(n²)']], io: [{ output: '묶음: 0 1 → 3 + 7\n묶음: 2 3 → 5 + 5\n묶음: 4 5 → 2 + 8\n비교: 15 번 | n(n-1)/2: 15 번\n10쪽 묶음: 3 쌍' }], answer: 'pages = [3, 7, 5, 5, 2, 8]\nchecks = 0\npairs = 0\nfor i in range(len(pages)):\n    for j in range(i + 1, len(pages)):\n        checks += 1\n        if pages[i] + pages[j] == 10:\n            print("묶음:", i, j, "→", pages[i], "+", pages[j])\n            pairs += 1\nn = len(pages)\nprint("비교:", checks, "번 | n(n-1)/2:", n * (n - 1) // 2, "번")\nprint("10쪽 묶음:", pairs, "쌍")', explain: '<p><code>j</code> 가 <code>i + 1</code> 부터 시작해서 같은 쌍을 두 번 보지 않아요. 안쪽 반복은 5 · 4 · 3 · 2 · 1 · 0 번 돌아 모두 15번이에요. 6 × 5 ÷ 2 = 15 와 같아요. 문서가 2배면 비교는 약 4배라서 O(n²) 예요. 합이 10 인 쌍은 3 + 7 · 5 + 5 · 2 + 8 셋이에요.</p>' },
      { title: '복습 — 느려지는 프린터 대기열 · 고치기', text: '<p>이번엔 [[레슨:A1]] 의 「숨은 반복」 이에요. 문서마다 인쇄 요청이 두 번씩 들어오는 대기열이 있어요. 같은 문서는 한 번만 찍고 두 번째 요청은 건너뛰어요. 입력은 문서 수 n 한 줄이에요. 아래 코드는 n 이 5 면 바로 끝나는데 100000 이면 끝나지 않아요.</p><p>반복 안에 숨은 O(n) 두 개를 찾아 고치세요. ① <code>queue.pop(0)</code> 은 뒤의 값을 모두 한 칸씩 당겨요 → [[레슨:A3]] 의 <code>deque</code> 와 <code>popleft()</code> ② <code>doc in done</code> 은 리스트를 처음부터 뒤져요 → 집합 <code>set()</code>. 집합에는 <code>[-1]</code> 이 없으니 마지막 문서는 변수 <code>last</code> 에 따로 적어요. 고치면 1초 안에 끝나요.</p>', needs: [['queue.pop(0)  ·  doc in done', 'A1/4', '반복 안의 숨은 반복 — 한 겹 더'], ['done = set()', 'A1/4', '집합의 in 은 O(1)'], ['queue = deque(docs + docs);  queue.popleft()', 'A3/1', '앞에서 꺼내기 O(1)']], given: 'n = int(input())\ndocs = list(range(1, n + 1))\nqueue = docs + docs          # 문서마다 요청이 두 번씩\ndone = []\nskipped = 0\nwhile queue:\n    doc = queue.pop(0)\n    if doc in done:\n        skipped += 1\n    else:\n        done.append(doc)\nprint("인쇄:", len(done), "개 | 건너뜀:", skipped, "번 | 마지막:", done[-1])', io: [{ input: '100000', output: '인쇄: 100000 개 | 건너뜀: 100000 번 | 마지막: 100000' }], answer: 'from collections import deque\n\nn = int(input())\ndocs = list(range(1, n + 1))\nqueue = deque(docs + docs)   # 문서마다 요청이 두 번씩\ndone = set()\nskipped = 0\nlast = 0\nwhile queue:\n    doc = queue.popleft()\n    if doc in done:\n        skipped += 1\n    else:\n        done.add(doc)\n        last = doc\nprint("인쇄:", len(done), "개 | 건너뜀:", skipped, "번 | 마지막:", last)' },
      { title: '복습 — 돌아가며 한 장씩 · 출력 예측', predict: true, text: '<p>[[레슨:A3]] 의 「앞사람을 뒤로」 와 [[레슨:A2]] 의 스택이에요. 프린터가 문서마다 한 장씩 돌아가며 찍어요. 한 장 찍은 문서는 대기열 맨 뒤로 다시 서요. 찍힌 종이는 출력함 <code>tray</code> 에 위로 쌓이고, 꺼낼 때는 맨 위부터 꺼내요.</p><p>돌리기 전에 출력 일곱 줄을 먼저 예상해 보고, VS Code 에서 돌려 맞았는지 확인해 보세요.</p>', needs: [['doc = q.popleft();  q.append(doc)', 'A3/4', '앞 문서를 꺼내 뒤로 다시 세우기'], ['while tray:  tray.pop()', 'A2/3', '나중에 쌓인 것부터 꺼내기']], io: [{ output: '한 장: 보고서\n한 장: 사진\n한 장: 표\n[\'포스터\', \'보고서\', \'사진\', \'표\']\n꺼냄: 표\n꺼냄: 사진\n꺼냄: 보고서' }], answer: 'from collections import deque\n\nq = deque(["보고서", "사진", "표", "포스터"])\ntray = []\nfor turn in range(3):\n    doc = q.popleft()\n    print("한 장:", doc)\n    q.append(doc)\n    tray.append(doc)\nprint(list(q))\nwhile tray:\n    print("꺼냄:", tray.pop())', explain: '<p>큐는 먼저 온 문서부터예요. 보고서 → 사진 → 표 순으로 한 장씩 찍고, 찍은 문서는 <code>q.append(doc)</code> 로 뒤에 다시 서서 <code>[\'포스터\', \'보고서\', \'사진\', \'표\']</code> 가 돼요. 출력함은 스택이라 마지막에 쌓인 표가 맨 위예요. 그래서 표 → 사진 → 보고서 순으로 꺼내요.</p>' },
      { title: '괄호 검사기', text: '@prompt', pid: 'AB1P1', needs: [['stack.append(ch)  stack.pop()', 'A2/1', '스택으로 괄호 짝'], ['elif ch in ")]}":', 'A2/1', '괄호가 아닌 글자는 건너뛰기'], ['for _ in range(n):  s = input()', 'SETUP/1', 'n 줄 입력받기']] },
      { title: '프린터 대기열 (급한 문서)', text: '@prompt', pid: 'AB1P2', needs: [['q.append(x)  q.appendleft(x)', 'A3/2', '뒤에 넣기 · 앞에 넣기'], ['q.popleft() if q else "empty"', 'A3/2', '비었는지 보고 꺼내기'], ['cmd = input().split()', 'A3/3', '명령과 이름 나누기']] },
    ],
    // ---------- 챕터 2 찾고 정렬하기 ----------
    A4: [
      { title: '팩토리얼', text: '@prompt', pid: 'A4P3', needs: [['if n <= 1:  return 1', 'A4/0', '기저 조건(멈추는 곳)'], ['return n * fact(n - 1)', 'A4/1', '자기 자신을 더 작은 값으로']] },
      { title: '리스트 합 (재귀)', text: '@prompt', pid: 'A4P4', needs: [['if not a:  return 0', 'A4/0', '빈 리스트에서 멈추기'], ['a[0] + rsum(a[1:])', 'A4/2', '첫 원소 + 나머지의 합']] },
      { title: '하노이 탑 이동 횟수', text: '@prompt', pid: 'A4P5', needs: [['2 * hanoi_count(n - 1) + 1', 'A4/4', 'n-1개 옮기기 두 번 + 1'], ['if n == 0:  return 0', 'A4/0', '기저 조건']] },
    ],
    A5: [
      { title: '버블 정렬 구현', text: '@prompt', pid: 'A5P2', needs: [['for i in range(n - 1):  for j in range(n - 1 - i):', 'A5/1', '한 바퀴마다 끝이 하나씩 확정'], ['a[j], a[j + 1] = a[j + 1], a[j]', 'A5/0', '옆 칸과 바꾸기']] },
      { title: '선택 정렬 버그', text: '@prompt', pid: 'A5P3', given: true, needs: [['if a[j] < a[m]:  m = j', 'A5/2', '남은 것 중 가장 작은 칸 기억'], ['a[i], a[m] = a[m], a[i]', 'A5/2', '찾은 최솟값을 앞으로']] },
      { title: '삽입 정렬 구현', text: '@prompt', pid: 'A5P4', needs: [['key = a[i]', 'A5/3', '끼워 넣을 값 들기'], ['while j >= 0 and a[j] > key:  a[j + 1] = a[j]', 'A5/3', '큰 값들을 한 칸씩 뒤로'], ['a[j + 1] = key', 'A5/3', '빈 자리에 내려놓기']] },
    ],
    A6: [
      { title: '두 정렬 리스트 합치기', text: '@prompt', pid: 'A6P2', needs: [['while i < len(left) and j < len(right):', 'A6/1', '두 줄 맨 앞 비교'], ['merged += left[i:] + right[j:]', 'A6/1', '남은 쪽 통째로 붙이기']] },
      { title: '퀵 정렬 구현', text: '@prompt', pid: 'A6P3', needs: [['pivot = a[len(a) // 2]', 'A6/2', '기준값'], ['[x for x in a if x < pivot]', 'A6/2', '작은 묶음 만들기'], ['quick(small) + same + quick(big)', 'A6/3', '나눠서 재귀']] },
    ],
    A6B: [
      { title: '점수순 정렬', text: '@prompt', pid: 'A6P4', needs: [['sorted(students, key=lambda s: (-s[1], s[0]))', 'A6B/1', '점수 내림차순, 같으면 이름'], ['key=lambda', 'A6B/0', '무엇으로 줄 세울지']] },
      { title: 'key로 길이순', text: '단어를 <b>길이가 짧은 순</b>, 같은 길이면 <b>사전순</b>으로 정렬하려고 해요. 아래 코드의 key 튜플 빈칸 <code>___1___</code> · <code>___2___</code> 를 채워 완성하세요.', pid: 'A6P5', io: [{ output: "['fig', 'kiwi', 'apple', 'banana']" }], needs: [['key=lambda w: (len(w), w)', 'A6B/1', '첫 기준 길이, 둘째 기준 글자']] },
      { title: 'k번째 수', text: '@prompt', pid: 'AB4P3', needs: [['sorted(a[i - 1:j])[k - 1]', 'A6B/0', '잘라서 정렬, k번째(1부터)']] },
    ],
    A7: [
      { title: '이진 탐색 구현', text: '@prompt', pid: 'A7P3', needs: [['lo, hi = 0, len(a) - 1', 'A7/0', '찾을 범위'], ['mid = (lo + hi) // 2', 'A7/0', '가운데 보기'], ['lo = mid + 1  hi = mid - 1', 'A7/2', '반씩 줄이기, 없으면 -1']] },
      { title: '무한루프 이진 탐색', text: '@prompt', pid: 'A7P4', given: true, needs: [['lo = mid + 1', 'A7/2', 'mid 는 이미 봤으니 빼고 줄이기'], ['while lo <= hi:', 'A7/2', '범위가 비면 끝']] },
      { title: 'x보다 작은 값의 개수', text: '@prompt', pid: 'A7P5', needs: [['bisect.bisect_left(a, x)', 'A7/3', 'x 를 끼워 넣을 왼쪽 자리 = x 미만 개수']] },
    ],
    A8: [
      { title: '중복 제거 (순서 유지)', text: '@prompt', pid: 'A8P2', needs: [['seen = set()  if x not in seen:', 'A8/1', '본 적 있는지 O(1)'], ['seen.add(x)  out.append(x)', 'A8/2', '처음 본 것만 순서대로']] },
      { title: '가장 많이 나온 단어', text: '@prompt', pid: 'A8P3', needs: [['count[w] = count.get(w, 0) + 1', 'A8/1', '개수 세기'], ['if best is None or count[w] > count[best]:', 'A8/2', '가장 많은 것 고르기(같으면 먼저 나온 것)']] },
      { title: '두 수의 합', text: '@prompt', pid: 'A8P4', needs: [['if target - x in seen:', 'A8/3', '짝이 이미 나왔는지'], ['seen.add(x)', 'A8/3', '본 값 기억']] },
      { title: '두 수의 합 개수', text: '@prompt', pid: 'AB4P1', needs: [['seen[K - x]', 'A8/3', '짝이 앞에 몇 번 나왔는지'], ['seen[x] = seen.get(x, 0) + 1', 'A8/1', '나온 횟수 세기']] },
      { title: '단어 빈도 TOP 3', text: '@prompt', pid: 'AB4P10', needs: [['c[w] = c.get(w, 0) + 1', 'A8/1', '개수 세기'], ['c.items()', 'A8/2', '(단어, 횟수) 짝으로 꺼내기'], ['sorted(…, key=lambda x: (-x[1], x[0]))[:3]', 'A6B/1', '많은 순, 같으면 사전순, 3개']] },
    ],
    AB2: [
      { title: '복습 — 최고점 재귀 · 에러 읽기', text: '<p>챕터 2 를 되짚어요. 먼저 [[레슨:A4]] 의 재귀예요. 성적표 점수의 총점과 최고점을 재귀 함수로 구하려는데, 총점은 나오고 최고점에서 이렇게 멈춰요.</p><pre>총점: 332\nTraceback (most recent call last):\n  File "C:\\Users\\me\\algo-study\\report.py", line 14, in &lt;module&gt;\n    print("최고점:", best(scores))\n  File "C:\\Users\\me\\algo-study\\report.py", line 8, in best\n    rest = best(a[1:])\n  [Previous line repeated 996 more times]\nRecursionError: maximum recursion depth exceeded</pre><p>① 마지막 줄이 무슨 뜻인지, 왜 같은 줄이 996번 넘게 되풀이됐는지 말해 보고 ② <code>best</code> 에 빠진 것을 넣어 고치세요. 빈 리스트를 잘라도(<code>[][1:]</code>) 빈 리스트라서 끝이 안 나요. 점수가 <b>하나 남으면</b> 그게 바로 최고점이에요.</p>', needs: [['RecursionError: maximum recursion depth exceeded', 'A4/0', '기저 조건이 없으면 끝없이 자신을 부름'], ['if len(a) == 1:  return a[0]', 'A4/0', '멈추는 곳(기저 조건)을 먼저'], ['a[0] + total(a[1:])', 'A4/1', '첫 칸 + 나머지에 맡기기']], given: 'def total(a):\n    if not a:\n        return 0\n    return a[0] + total(a[1:])\n\n\ndef best(a):\n    rest = best(a[1:])\n    return max(a[0], rest)\n\n\nscores = [85, 92, 85, 70]\nprint("총점:", total(scores))\nprint("최고점:", best(scores))', io: [{ output: '총점: 332\n최고점: 92' }], answer: 'def total(a):\n    if not a:\n        return 0\n    return a[0] + total(a[1:])\n\n\ndef best(a):\n    if len(a) == 1:        # 기저 조건: 하나 남으면 그게 최고점\n        return a[0]\n    rest = best(a[1:])\n    return max(a[0], rest)\n\n\nscores = [85, 92, 85, 70]\nprint("총점:", total(scores))\nprint("최고점:", best(scores))' },
      { title: '복습 — 점수 끼워 넣기 · 출력 예측', predict: true, text: '<p>[[레슨:A5]] 의 삽입 정렬이에요. 시험지가 한 장씩 들어올 때마다 앞쪽의 정렬된 점수 사이에 끼워 넣어요. <code>moved</code> 는 그 점수를 끼우려고 뒤로 민 칸 수예요.</p><p>돌리기 전에 출력 네 줄을 먼저 예상해 보고, VS Code 에서 돌려 맞았는지 확인해 보세요. 어느 점수가 <b>0칸</b> 밀기로 끝나는지가 핵심이에요.</p>', needs: [['key = a[i]', 'A5/3', '끼워 넣을 값 들기'], ['while j >= 0 and a[j] > key:  a[j + 1] = a[j]', 'A5/3', '큰 값들을 한 칸씩 뒤로'], ['a[j + 1] = key', 'A5/3', '빈 자리에 내려놓기']], io: [{ output: '85 끼움 | 0 칸 밀기 → [70, 85, 60, 92, 88]\n60 끼움 | 2 칸 밀기 → [60, 70, 85, 92, 88]\n92 끼움 | 0 칸 밀기 → [60, 70, 85, 92, 88]\n88 끼움 | 1 칸 밀기 → [60, 70, 85, 88, 92]' }], answer: 'scores = [70, 85, 60, 92, 88]\nfor i in range(1, len(scores)):\n    key = scores[i]\n    j = i - 1\n    moved = 0\n    while j >= 0 and scores[j] > key:\n        scores[j + 1] = scores[j]\n        j -= 1\n        moved += 1\n    scores[j + 1] = key\n    print(key, "끼움 |", moved, "칸 밀기 →", scores)', explain: '<p>85 와 92 는 바로 앞 값보다 커서 <code>scores[j] > key</code> 가 처음부터 거짓이에요. 그래서 한 칸도 안 밀고 제자리예요. 60 은 85 · 70 을 차례로 밀고 맨 앞에, 88 은 92 하나만 밀어요. 거의 정렬된 성적표라면 대부분 0칸이라 삽입 정렬이 빨라요([[레슨:A5]] 마지막 쪽).</p>' },
      { title: '복습 — 🏠 두 반 성적표 합치기', text: '<p>[[레슨:A6]] 의 병합 정렬이에요. 첫 줄에 1반, 둘째 줄에 2반 점수가 정렬 안 된 채로 들어와요(띄어쓰기). 반마다 <code>merge_sort</code> 로 정렬하고, 정렬된 두 반을 <code>merge</code> 로 합쳐 전체 성적표를 만드세요. <code>merge</code> 는 두 줄의 맨 앞만 비교해 작은 것부터 꺼내는 함수예요. <code>merge_sort</code> 도 안에서 같은 <code>merge</code> 를 다시 써요.</p><p><code>merge_sort</code> 는 [[레슨:A4]] 의 재귀라서 「1개 이하면 그대로 돌려주기」 를 먼저 써요. 출력은 <code>1반: […]</code> · <code>2반: […]</code> · <code>전체: […]</code> 세 줄이에요.</p>', needs: [['while i < len(left) and j < len(right):', 'A6/1', '두 줄 맨 앞 비교'], ['merged += left[i:]', 'A6/1', '남은 쪽 통째로 붙이기'], ['def merge_sort(a):  … merge(merge_sort(a[:mid]), merge_sort(a[mid:]))', 'A6/0', '반으로 나눠 정렬하고 합치기'], ['if len(a) <= 1:  return a', 'A4/0', '기저 조건']], io: [{ input: '85 70 92 60\n88 75 95', output: '1반: [60, 70, 85, 92]\n2반: [75, 88, 95]\n전체: [60, 70, 75, 85, 88, 92, 95]' }], answer: 'def merge(left, right):\n    merged = []\n    i = j = 0\n    while i < len(left) and j < len(right):\n        if left[i] <= right[j]:\n            merged.append(left[i])\n            i += 1\n        else:\n            merged.append(right[j])\n            j += 1\n    merged += left[i:]\n    merged += right[j:]\n    return merged\n\n\ndef merge_sort(a):\n    if len(a) <= 1:\n        return a\n    mid = len(a) // 2\n    return merge(merge_sort(a[:mid]), merge_sort(a[mid:]))\n\n\nline1 = input().split()\nline2 = input().split()\nnums1 = list(map(int, line1))\nclass1 = merge_sort(nums1)\nnums2 = list(map(int, line2))\nclass2 = merge_sort(nums2)\nprint("1반:", class1)\nprint("2반:", class2)\nprint("전체:", merge(class1, class2))' },
      { title: '복습 — 🏠 두 번 낸 성적표 정리', text: '<p>[[레슨:A8]] 의 해시예요. 성적을 받는데 몇 명이 두 번 냈어요. 첫 줄은 줄 수 n, 다음 n줄에 <code>이름 점수</code>. 같은 이름은 <b>처음 낸 것만</b> 인정하고, 두 번째부터는 <code>두 번째 제출: 이름</code> 을 찍어요.</p><p>다 받은 뒤에 ① 인정한 <code>(이름, 점수)</code> 리스트 ② 점수별 인원 딕셔너리 ③ 인원이 가장 많은 점수(같으면 먼저 나온 점수)를 차례로 찍으세요. 이미 냈는지는 집합 <code>seen</code> 으로 보고, 인원은 <code>count.get(점수, 0) + 1</code> 로 세요.</p>', needs: [['if name in seen: …  seen.add(name)', 'A8/1', '본 적 있는지 O(1)'], ['count[score] = count.get(score, 0) + 1', 'A8/1', '개수 세기'], ['for score, c in count.items():  if c > best_c:', 'A8/2', '가장 많은 것(같으면 먼저 나온 것)']], io: [{ input: '6\n민수 85\n지우 92\n하늘 85\n민수 90\n서준 70\n가온 92', output: '두 번째 제출: 민수\n인정: [(\'민수\', 85), (\'지우\', 92), (\'하늘\', 85), (\'서준\', 70), (\'가온\', 92)]\n점수별 인원: {85: 2, 92: 2, 70: 1}\n가장 많은 점수: 85 점 2 명' }], answer: 'n = int(input())\nseen = set()\nrows = []\nfor _ in range(n):\n    name, score = input().split()\n    if name in seen:\n        print("두 번째 제출:", name)\n    else:\n        seen.add(name)\n        rows.append((name, int(score)))\n\ncount = {}\nfor name, score in rows:\n    count[score] = count.get(score, 0) + 1\n\nbest, best_c = None, 0\nfor score, c in count.items():\n    if c > best_c:\n        best, best_c = score, c\nprint("인정:", rows)\nprint("점수별 인원:", count)\nprint("가장 많은 점수:", best, "점", best_c, "명")' },
      { title: '성적표 정렬', text: '@prompt', pid: 'AB2P1', needs: [['rows.sort(key=lambda r: (-r[1], r[0]))', 'A6B/1', '점수 내림차순, 같으면 이름'], ['name, score = input().split()', 'A12/1', '한 줄을 둘로 나눠 담기'], ['if score != prev:  rank = i + 1', 'A6B/1', '같은 점수는 같은 등수']] },
      { title: '점수 검색', text: '@prompt', pid: 'AB2P2', needs: [['scores = sorted(map(int, line))', 'A6B/0', '한 번만 정렬'], ['n - bisect.bisect_left(scores, x)', 'A7/3', 'x 이상인 개수']] },
    ],
    // ---------- 챕터 3 연결된 구조 ----------
    A9: [
      { title: '길이 세기', text: '@prompt', pid: 'A9P2', start: true, needs: [['while cur:  n += 1;  cur = cur.next', 'A9/1', '끝(None)까지 따라가며 세기']] },
      { title: '맨 뒤에 추가', text: '@prompt', pid: 'A9P3', start: true, needs: [['if head is None:  return Node(val)', 'A9/2', '빈 리스트면 새 노드가 head'], ['while cur.next:  cur = cur.next', 'A9/1', '맨 뒤 노드 찾기'], ['cur.next = Node(val)', 'A9/2', '뒤에 잇기']] },
      { title: '연결 리스트 뒤집기', text: '@prompt', pid: 'A9P4', start: true, needs: [['nxt = cur.next;  cur.next = prev', 'A9/3', '화살표 반대로'], ['prev, cur = cur, nxt', 'A9/3', '한 칸 앞으로']] },
      { title: '끊어진 사슬', text: '@prompt', pid: 'A9P5', given: true, needs: [['new.next = a.next;  a.next = new', 'A9/2', '뒤를 먼저 잡고 앞을 바꾸기']] },
    ],
    A10: [
      { title: 'BST 삽입과 탐색', text: '@prompt', pid: 'A10P3', start: true, needs: [['if val < node.val:  node.left = insert(node.left, val)', 'A10/1', '작으면 왼쪽, 크면 오른쪽'], ['if node is None:  return False', 'A10/1', '끝까지 없으면 없음']] },
      { title: '트리의 높이', text: '@prompt', pid: 'A10P4', start: true, needs: [['1 + max(height(node.left), height(node.right))', 'A10/2', '자식 높이 중 큰 쪽 + 1'], ['if node is None:  return 0', 'A10/2', '빈 트리는 0']] },
      { title: '전위 순회', text: '@prompt', pid: 'A10P5', start: true, needs: [['print(node.val); preorder(node.left); preorder(node.right)', 'A10/3', '자신 → 왼쪽 → 오른쪽'], ['if node is None:  return', 'A10/3', '기저 조건이 맨 먼저']] },
    ],
    A11: [
      { title: 'k번째로 작은 값', text: '@prompt', pid: 'A11P3', needs: [['heapq.heapify(h)', 'A11/3', '리스트를 힙으로'], ['heapq.heappop(h)', 'A11/0', '가장 작은 값 꺼내기'], ['for _ in range(k - 1):', 'A11/3', 'k-1번 꺼내고 맨 위가 답']] },
      { title: '응급실', text: '@prompt', pid: 'A11P4', needs: [['heapq.heappush(h, (p, i, name))', 'A11/1', '(우선순위, 도착순서, 이름)'], ['_, _, name = heapq.heappop(h)', 'A11/1', '급한 사람부터 꺼내기']] },
      { title: '카드 합치기 비용', text: '@prompt', pid: 'A11P5', needs: [['a = heapq.heappop(h);  b = heapq.heappop(h)', 'A11/4', '가장 작은 두 개'], ['heapq.heappush(h, a + b)', 'A11/4', '합친 묶음을 다시 넣기']] },
    ],
    A12: [
      { title: 'BFS 거리', text: '@prompt', pid: 'A12P3', needs: [['queue = deque([start])  node = queue.popleft()', 'A12/2', '가까운 곳부터'], ['dist[nb] = dist[node] + 1', 'A12/2', '처음 도착한 거리 = 최단'], ['if nb not in visited:  visited.add(nb)', 'A12/2', '한 번만 넣기']] },
      { title: '섬의 개수', text: '@prompt', pid: 'A12P4', needs: [['for r in range(R):  for c in range(C):', 'A12/4', '모든 칸에서 시작해 보기'], ['for dr, dc in ((-1, 0), (1, 0), (0, -1), (0, 1)):', 'A12/4', '상하좌우 이웃'], ['def dfs(r, c):  visited[r][c] = True', 'A12/3', '한 섬 전부 표시']] },
      { title: 'visited를 빼먹으면', text: '@prompt', pid: 'A12P5', given: true, needs: [['if nb not in visited:  visited.add(nb)', 'A12/2', '넣을 때 바로 표시']] },
      { title: '연결 요소의 개수', text: '@prompt', pid: 'AB4P15', needs: [['for v in range(1, V + 1):  if not visited[v]:', 'A12/4', '아직 안 간 정점마다 새 덩어리'], ['queue = deque([v])', 'A12/2', '덩어리 하나를 BFS 로 전부 방문']] },
    ],
    AB3: [
      { title: '복습 — 지나온 칸을 사슬로 · 출력 예측', predict: true, text: '<p>챕터 3 을 되짚어요. 먼저 [[레슨:A9]] 의 연결 리스트예요. 미로에서 지나온 칸을 노드로 하나씩 이어 붙여 기록하고, 다 이은 다음 길이를 세요. 돌아올 때는 사슬을 뒤집어 도착 칸부터 읽어요.</p><p>돌리기 전에 출력 두 줄을 먼저 예상해 보고, VS Code 에서 돌려 맞았는지 확인해 보세요. <b>칸 수</b>와 <b>이동 수</b>가 왜 하나 차이 나는지도 생각해 봐요.</p>', needs: [['cur.next = Node(cell);  cur = cur.next', 'A9/2', '뒤에 잇고 한 칸 전진'], ['while cur:  n += 1;  cur = cur.next', 'A9/1', '끝(None)까지 따라가며 세기'], ['nxt = cur.next;  cur.next = prev', 'A9/3', '화살표 반대로 — 뒤집기']], io: [{ output: '(0, 0) (0, 1) (1, 1) (2, 1) (2, 2) | 칸 수: 5 | 이동: 4\n(2, 2) (2, 1) (1, 1) (0, 1) (0, 0) | 돌아오는 길' }], answer: 'class Node:\n    def __init__(self, val):\n        self.val = val\n        self.next = None\n\n\nhead = Node((0, 0))\ncur = head\nfor cell in [(0, 1), (1, 1), (2, 1), (2, 2)]:\n    cur.next = Node(cell)\n    cur = cur.next\n\nn = 0\ncur = head\nwhile cur:\n    print(cur.val, end=" ")\n    n += 1\n    cur = cur.next\nprint("| 칸 수:", n, "| 이동:", n - 1)\n\nprev = None\ncur = head\nwhile cur:\n    nxt = cur.next\n    cur.next = prev\n    prev = cur\n    cur = nxt\nhead = prev\ncur = head\nwhile cur:\n    print(cur.val, end=" ")\n    cur = cur.next\nprint("| 돌아오는 길")', explain: '<p><code>cur</code> 는 늘 마지막 노드를 붙잡고 있어서, <code>cur.next = Node(cell)</code> 로 뒤에 잇고 한 칸 전진해요. 세기는 <code>while cur:</code> 로 None 까지 가니 5칸이에요. 칸 사이 화살표는 4개라 이동은 4번이에요. 뒤집기는 <code>nxt</code> 를 먼저 기억하고 화살표를 돌려서, 끝나면 <code>prev</code> 가 맨 끝이던 (2, 2) 를 가리켜요.</p>' },
      { title: '복습 — 🏠 친구 이름 찾기 트리', text: '<p>[[레슨:A10]] 의 이진 탐색 트리예요. 친구 추천에 쓸 친구 이름을 BST 에 넣어 둬요. 첫 줄은 넣을 이름들, 둘째 줄은 찾을 이름들이에요(띄어쓰기). 한글 이름도 <code>&lt;</code> 로 가나다순 비교가 돼요.</p><p>① 중위 순회로 <code>가나다순: …</code> 을 한 줄로 ② 찾을 이름마다 루트부터 몇 번 비교했는지 <code>서준: 있음 (3번 비교)</code> · <code>나래: 없음 (4번 비교)</code> 처럼 찍으세요. 넣는 함수 <code>insert</code> 는 레슨 그대로예요.</p>', needs: [['node.left = insert(node.left, val)', 'A10/0', '작으면 왼쪽, 크면 오른쪽에 넣기'], ['node = node.left if target < node.val else node.right', 'A10/1', '한쪽 가지만 내려가며 찾기'], ['inorder(node.left);  out.append(node.val);  inorder(node.right)', 'A10/3', '중위 순회 = 정렬 순서']], io: [{ input: '지우 민수 하늘 가온 서준 다인\n서준 나래', output: '가나다순: 가온 다인 민수 서준 지우 하늘\n서준: 있음 (3번 비교)\n나래: 없음 (4번 비교)' }], answer: 'class Node:\n    def __init__(self, val):\n        self.val = val\n        self.left = None\n        self.right = None\n\n\ndef insert(node, val):\n    if node is None:\n        return Node(val)\n    if val < node.val:\n        node.left = insert(node.left, val)\n    else:\n        node.right = insert(node.right, val)\n    return node\n\n\ndef inorder(node, out):\n    if node is None:\n        return\n    inorder(node.left, out)\n    out.append(node.val)\n    inorder(node.right, out)\n\n\nroot = None\nfor name in input().split():\n    root = insert(root, name)\n\nnames = []\ninorder(root, names)\nprint("가나다순:", " ".join(names))\n\nfor target in input().split():\n    node = root\n    steps = 0\n    while node:\n        steps += 1\n        if node.val == target:\n            print(f"{target}: 있음 ({steps}번 비교)")\n            break\n        node = node.left if target < node.val else node.right\n    else:\n        print(f"{target}: 없음 ({steps}번 비교)")' },
      { title: '복습 — 🏠 추천 친구 TOP k', text: '<p>[[레슨:A11]] 의 힙이에요. 친구 추천 후보마다 공통 친구 수가 나왔어요. 첫 줄은 후보 수 n, 다음 n줄에 <code>이름 공통친구수</code>, 마지막 줄에 k. 공통 친구가 <b>많은 순</b>, 같으면 <b>먼저 나온 후보</b> 순으로 k명을 <code>1. 지우 (공통 친구 3명)</code> 처럼 찍으세요(후보가 k명보다 적으면 있는 만큼).</p><p><code>heapq</code> 는 작은 것부터 나오니 공통 친구 수에 마이너스를 붙여 넣고, 튜플 가운데에 도착 번호를 끼워요.</p>', needs: [['heapq.heappush(h, (-int(common), i, name))', 'A11/3', '마이너스를 붙이면 큰 것부터'], ['(우선순위, 도착순서, 이름)', 'A11/1', '같으면 먼저 온 후보'], ['common, _, name = heapq.heappop(h)', 'A11/0', '맨 위(가장 앞 순서)부터 꺼내기']], io: [{ input: '5\n하늘 2\n지우 3\n가온 1\n민수 3\n서준 2\n3', output: '1. 지우 (공통 친구 3명)\n2. 민수 (공통 친구 3명)\n3. 하늘 (공통 친구 2명)' }], answer: 'import heapq\n\nn = int(input())\nh = []\nfor i in range(n):\n    name, common = input().split()\n    heapq.heappush(h, (-int(common), i, name))\nk = int(input())\nfor rank in range(1, k + 1):\n    if not h:\n        break\n    common, _, name = heapq.heappop(h)\n    print(f"{rank}. {name} (공통 친구 {-common}명)")' },
      { title: '미로 최단 경로', text: '@prompt', pid: 'AB3P1', needs: [['grid.append(list(map(int, input().split())))', 'A12/1', '격자 읽기'], ['queue.append((nr, nc, d + 1))', 'A12/2', '거리를 같이 넣는 BFS'], ['0 <= nr < R and 0 <= nc < C', 'A12/4', '격자 안인지']] },
      { title: '친구 추천', text: '@prompt', pid: 'AB3P2', needs: [['graph.setdefault(a, set()).add(b)', 'A12/1', '양방향 친구 관계'], ['for f in graph[me]:  for ff in graph[f]:', 'A12/0', '친구의 친구'], ['sorted(cnt, key=lambda x: (-cnt[x], x))', 'A6B/1', '공통 친구 많은 순, 같으면 이름']] },
    ],
    // ---------- 챕터 4 패턴 ----------
    A13: [
      { title: '다익스트라 구현', text: '@prompt', pid: 'A13P3', needs: [['dist = {v: float("inf") for v in graph}', 'A13/1', '처음엔 모두 무한대'], ['d, node = heapq.heappop(heap)', 'A13/1', '가장 가까운 곳부터'], ['if d > dist[node]:  continue', 'A13/2', '낡은 기록 건너뛰기'], ['if d + w < dist[nb]:', 'A13/2', '더 짧으면 갱신']] },
      { title: '최단 경로 복원', text: '@prompt', pid: 'A13P4', needs: [['prev[nb] = node', 'A13/3', '어디서 왔는지 기록'], ['while cur is not None:  path.append(cur);  cur = prev.get(cur)', 'A13/3', '도착부터 거꾸로'], ['path[::-1]', 'A13/3', '뒤집어 시작부터']] },
      { title: '힙에 무엇을 넣나', text: '다익스트라의 한 부분이에요. 힙에 무엇을 넣고, 꺼낸 것을 언제 건너뛰는지 빈칸 <code>___1___</code> · <code>___2___</code> 를 채우세요. (이 부분만으로는 실행되지 않아요 — 다 채우면 위 「다익스트라 구현」 에 넣어 돌려 보세요)', pid: 'A13P5', noRun: true, needs: [['if d > dist[u]:  continue', 'A13/2', '더 짧은 길이 이미 있으면 건너뛰기'], ['heapq.heappush(heap, (dist[v], v))', 'A13/1', '(거리, 정점) 을 넣기']] },
    ],
    A14: [
      { title: '계단 오르기', text: '@prompt', pid: 'A14P2', needs: [['dp = [0] * (n + 1)', 'A14/1', '작은 것부터 채울 표'], ['dp[i] = dp[i - 1] + dp[i - 2]', 'A14/1', '한 칸 전 + 두 칸 전']] },
      { title: '동전 거스름돈', text: '@prompt', pid: 'A14P3', needs: [['dp = [INF] * (target + 1);  dp[0] = 0', 'A14/2', '0원은 동전 0개'], ['dp[x] = min(dp[x], dp[x - c] + 1)', 'A14/2', '동전 c 하나를 마지막에 쓰면']] },
      { title: '최대 부분합', text: '@prompt', pid: 'A14P4', needs: [['cur = max(x, cur + x)', 'A14/3', '이어 붙일까, 새로 시작할까'], ['best = max(best, cur)', 'A14/3', '지금까지 최고']] },
      { title: '점화식 채우기', text: '2×n 판을 1×2, 2×1 타일로 채우는 방법 수를 구해요. 점화식의 빈칸 <code>___1___</code> 을 채워 완성하세요. 맨 위에 <code>n = int(input())</code> 를 넣으면 실행돼요.', pid: 'A14P5', answer: 'n = int(input())\ndp = [0] * (n + 1)\ndp[0] = 1\ndp[1] = 1\nfor i in range(2, n + 1):\n    dp[i] = dp[i - 1] + dp[i - 2]\nprint(dp[n])', io: [{ input: '5', output: '8' }], needs: [['dp[i] = dp[i - 1] + dp[i - 2]', 'A14/1', '마지막 타일이 세로 하나 / 가로 둘'], ['dp[0] = 1;  dp[1] = 1', 'A14/1', '시작 칸 채우기']] },
    ],
    A15: [
      { title: '회의실 배정', text: '@prompt', pid: 'A15P2', needs: [['sorted(meetings, key=lambda m: (m[1], m[0]))', 'A15/0', '일찍 끝나는 것부터'], ['if s >= end:  cnt += 1;  end = e', 'A15/1', '겹치지 않으면 고르기']] },
      { title: '투 포인터: 두 수의 합', text: '@prompt', pid: 'A15P3', needs: [['lo, hi = 0, len(a) - 1', 'A15/2', '양끝에서 시작'], ['if s < target:  lo += 1  else:  hi -= 1', 'A15/2', '작으면 왼쪽을, 크면 오른쪽을 안으로']] },
      { title: '구간 합 질의', text: '@prompt', pid: 'A15P4', needs: [['prefix[i + 1] = prefix[i] + a[i]', 'A15/4', '누적 합 미리'], ['prefix[r + 1] - prefix[l]', 'A15/4', '구간 합을 O(1)']] },
      { title: '슬라이딩 윈도우', text: '@prompt', pid: 'A15P5', needs: [['win = sum(a[:k])', 'A15/3', '첫 창'], ['win += a[i] - a[i - k]', 'A15/3', '들어온 값 더하고 나간 값 빼기']] },
    ],
    AB4: [
      { title: '모의 1: 수 찾기', text: '@prompt', pid: 'AB4P4', needs: [['A = set(input().split())', 'A8/1', '집합으로 담으면 in 이 O(1)'], ['" ".join(out)', 'A20/2', '한 줄에 띄어쓰기로 출력']] },
      { title: '모의 2: 최소 칸 수 미로', text: '@prompt', pid: 'AB4P5', needs: [['grid = [input().strip() for _ in range(N)]', 'E1/1', '붙어 있는 숫자 줄 읽기'], ['dist[nr][nc] = dist[r][c] + 1', 'A12/2', 'BFS 거리표'], ['for dr, dc in ((-1, 0), (1, 0), (0, -1), (0, 1)):', 'A12/4', '상하좌우']] },
      { title: '모의 3: 연속 부분 수열의 최대 합', text: '@prompt', pid: 'AB4P6', needs: [['cur = max(x, cur + x)', 'A14/3', '카데인'], ['best = max(best, cur)', 'A14/3', '지금까지 최고']] },
      { title: '모의 4: 회의실 배정', text: '@prompt', pid: 'AB4P7', needs: [['m.sort(key=lambda x: (x[1], x[0]))', 'A15/0', '끝나는 시간 순'], ['if s >= end:', 'A15/1', '끝=시작은 가능']] },
      { title: '모의 5: 구간 합 구하기', text: '@prompt', pid: 'AB4P8', needs: [['prefix[j] - prefix[i - 1]', 'A15/4', '1부터 세는 구간 합'], ['sys.stdin.readline', 'A20/2', '질의가 많으면 빠른 입력']] },
      { title: '모의 6: 카드 정렬 비용', text: '@prompt', pid: 'AB4P9', needs: [['heapq.heapify(h)', 'A11/3', '묶음 크기를 힙으로'], ['heapq.heappush(h, a + b)', 'A11/4', '가장 작은 두 개를 합쳐 다시']] },
      { title: '모의 7: 계단 오르기 (3칸까지)', text: '@prompt', pid: 'AB4P11', needs: [['dp[i] = (dp[i - 1] + dp[i - 2] + dp[i - 3]) % MOD', 'A14/1', '세 칸 전까지 더하기'], ['MOD = 1000000007', 'A14/1', '문제가 시키면 표에 넣을 때마다 % MOD (파이썬은 큰 수도 되지만 느려져요)']] },
      { title: '모의 8: 최단 거리 (가중치)', text: '@prompt', pid: 'AB4P12', needs: [['graph[u].append((v, w))', 'A12/1', '한 방향 간선과 비용(간선 목록 → 그래프)'], ['heapq.heappush(heap, (nd, v))', 'A13/1', '다익스트라'], ['print(d if d != INF else "INF")', 'A13/3', '못 가면 INF']] },
      { title: '모의 9: 두 포인터로 합 찾기', text: '@prompt', pid: 'AB4P13', needs: [['a.sort()', 'A6B/0', '먼저 정렬'], ['lo, hi = 0, n - 1', 'A15/2', '정렬된 리스트의 양끝에서'], ['if s == x:  cnt += 1;  lo += 1;  hi -= 1', 'A15/2', '찾으면 둘 다 안으로']] },
      { title: '모의 10: 수 정렬하기', text: '@prompt', pid: 'AB4P14', needs: [['a.sort()', 'A6B/0', '내장 정렬 O(n log n)'], ['print("\\n".join(map(str, a)))', 'A20/2', '한 번에 출력']] },
    ],
    // ---------- 챕터 5 실전 ----------
    E1: [
      { title: '연습: 미로 최단 거리만', text: '@prompt', pid: 'E1P2', needs: [['lines = sys.stdin.read().split("\\n")', 'E1/1', '끝까지 한 번에 읽기'], ['grid = [list(row) for row in lines if row]', 'E1/0', '미로를 2차원 리스트로'], ['q.append((nr, nc, d + 1))', 'E1/2', '격자 BFS']] },
      { title: '프로젝트: 미로 게임', text: '@prompt', pid: 'E1P1', needs: [['cmd = lines[0].strip()', 'E1/1', '첫 줄 명령으로 나누기'], ['parent[(nr, nc)] = (r, c)', 'E1/2', '어디서 왔는지'], ['while cur != start:  path.append(cur);  cur = parent[cur]', 'E1/3', '경로 복원'], ['grid[r][c] = "*"', 'E1/3', '경로 칸 표시']] },
    ],
    E2: [
      { title: '연습: 두 역 사이 최단 시간만', text: '@prompt', pid: 'E2P2', needs: [['graph.setdefault(a, []).append((b, m))', 'A12/1', '양방향 노선(간선 목록 → 그래프)'], ['heapq.heappush(heap, (d + m, nb))', 'E2/1', '다익스트라'], ['if d > dist.get(node, INF):  continue', 'A13/2', '낡은 기록 건너뛰기']] },
      { title: '프로젝트: 지하철 최단 경로', text: '@prompt', pid: 'E2P1', needs: [['prev[nb] = node', 'E2/1', '경로 기록'], ['" -> ".join(path)', 'E2/2', '경로 출력'], ['sorted(..., key=lambda x: (dist[x], x))', 'E2/2', '(시간, 이름) 순']] },
    ],
    E3: [
      { title: '연습: 필요한 교실 수만', text: '@prompt', pid: 'E3P2', needs: [['exams.sort()', 'E3/1', '(시작, 끝, 과목) 튜플이라 그냥 sort() 하면 시작 시각 순'], ['if rooms and rooms[0] <= s:  heapq.heapreplace(rooms, e)', 'E3/1', '끝난 교실 다시 쓰기(꺼내고 넣기를 한 번에)'], ['heapq.heappush(rooms, e)', 'E3/1', '끝나는 시각 힙']] },
      { title: '프로젝트: 시험 시간표 짜기', text: '@prompt', pid: 'E3P1', needs: [['for i in range(len(ends)):  if ends[i] <= s:', 'E3/2', '번호가 가장 낮은 빈 교실(앞에서부터)'], ['events.sort()', 'E3/2', '스위프: 끝을 먼저 처리'], ['sorted(exams, key=lambda x: (x[1], x[0], x[2]))', 'A15/0', '끝 시각 그리디((시작, 끝, 과목) 튜플이라 x[1] 이 끝)']] },
    ],
    E4: [
      { title: '연습: 친구 그룹 세기만', text: '@prompt', pid: 'E4P2', needs: [['for name in sorted(graph):  if name not in seen:', 'E4/2', '아직 안 본 사람마다 새 그룹'], ['q = deque([name])', 'E4/1', '그룹 하나를 BFS 로']] },
      { title: '프로젝트: 친구 네트워크 분석', text: '@prompt', pid: 'E4P1', needs: [['def bfs(start):  return dist', 'E4/1', '한 사람 기준 거리표(여러 번 씀)'], ['groups.sort(key=lambda g: (-len(g), g[0]))', 'E4/2', '인원 많은 순'], ['for f in graph[me]:  for ff in graph[f]:', 'A12/0', '친구의 친구']] },
    ],
    E5: [
      { title: '연습: 역색인과 한 단어 검색만', text: '@prompt', pid: 'E5P2', needs: [['w.lower().strip(\'.,!?"\\\'()\')', 'E5/2', '단어 정리'], ['index.setdefault(w, set()).add(doc_no)', 'E5/0', '단어 → 문서 번호 집합']] },
      { title: '프로젝트: 텍스트 검색 엔진', text: '@prompt', pid: 'E5P1', needs: [['index[a] & index[b]', 'E5/2', 'AND = 두 집합의 교집합'], ['sorted(docs)', 'E5/1', '문서 번호 순'], ['Counter(words).most_common()', 'A8/1', '많이 나온 단어']] },
    ],
    E6: [
      { title: '연습: 명령 따라 움직이기만', text: '@prompt', pid: 'E6P2', needs: [['dr = [-1, 0, 1, 0];  dc = [0, 1, 0, -1]', 'A18/0', '상·우·하·좌 = 0·1·2·3'], ['d = (d + 1) % 4', 'A18/1', '오른쪽으로 돌기'], ['if 0 <= nr < R and 0 <= nc < C and grid[nr][nc] != "#":', 'A18/2', '갈 수 있을 때만']] },
      { title: '프로젝트: 로봇 청소기 시뮬레이션', text: '@prompt', pid: 'E6P1', needs: [['dist = bfs(r, c)', 'E6/1', 'BFS 한 번으로 모든 칸 거리'], ['min(dusts, key=lambda p: (dist[p], p))', 'E6/2', '가장 가까운 먼지(같으면 위·왼쪽)'], ['while dusts:', 'E6/2', '먼지가 없어질 때까지 자동 반복']] },
    ],
    // ---------- 챕터 6 한 걸음 더 ----------
    A16: [
      { title: '단어 점수', text: '@prompt', pid: 'A16P7', needs: [['for ch in s:', 'A16/0', '글자를 하나씩'], ['ord(ch) - 97 + 1', 'A16/1', 'a 에서 몇 번째 글자(1부터)']] },
      { title: '공백·대소문자 무시 회문', text: '@prompt', pid: 'A16P2', needs: [['s = input().replace(" ", "").lower()', 'A16/2', '공백 지우고 소문자로'], ['while lo < hi:  if s[lo] != s[hi]:', 'A16/2', '양끝에서 가운데로']] },
    ],
    A16B: [
      { title: '아나그램 그룹', text: '@prompt', pid: 'A16P3', needs: [['key = "".join(sorted(w))', 'A16B/1', '글자를 정렬하면 같은 열쇠'], ['groups.setdefault(key, []).append(w)', 'A16B/1', '열쇠별로 모으기(딕셔너리는 넣은 순서 유지)']] },
      { title: '가장 긴 공통 접두사', text: '@prompt', pid: 'A16P5', needs: [['for i in range(len(words[0])):', 'A16B/2', '첫 단어 글자를 하나씩'], ['all(len(w) > i and w[i] == ch for w in words)', 'A16B/2', '모든 단어가 같은 글자인지']] },
    ],
    A17: [
      { title: '2진수 자릿수 세기', text: '@prompt', pid: 'A17P2', needs: [['bin(n)[2:]', 'A17/0', '0b 떼고 2진수 글자'], ['b.count("1")  len(b)', 'A17/0', '1의 개수 · 자릿수']] },
      { title: '빈칸 채우기: 집합에 넣고 확인', text: '비트마스크 집합에 원소 2 를 넣고, 원소 1 이 있는지 확인하려고 해요. 빈칸 <code>___1___</code> · <code>___2___</code> 에 들어갈 비트 연산자를 채워 완성하세요.', pid: 'A17P3', io: [{ output: '1 없음' }], needs: [['mask |= (1 << k)', 'A17/2', 'k 넣기'], ['if mask & (1 << k):', 'A17/2', 'k 가 있는지']] },
      { title: '합이 되는 부분집합', text: '@prompt', pid: 'A17P4', needs: [['for mask in range(1 << n):', 'A17/4', '부분집합 2ⁿ개 전부'], ['if mask & (1 << i):  s += a[i]', 'A17/4', 'i번째를 골랐는지']] },
    ],
    A18: [
      { title: '명령 사전으로 움직이기', text: '@prompt', pid: 'A18P7', needs: [['move = {"U": (-1, 0), …}', 'A18/2', '명령 → 이동량 딕셔너리'], ['if 0 <= nr < R and 0 <= nc < C:', 'A18/2', '밖이면 무시(다음 칸 먼저 계산)']] },
      { title: '로봇 명령 따라가기', text: '@prompt', pid: 'A18P2', needs: [['dr = [-1, 0, 1, 0];  dc = [0, 1, 0, -1]', 'A18/0', '방향 번호 → 한 칸 이동'], ['d = (d + 1) % 4  d = (d + 3) % 4', 'A18/1', '오른쪽 · 왼쪽으로 돌기'], ['if 0 <= nr < R and 0 <= nc < C:', 'A18/2', '격자 밖이면 무시']] },
    ],
    A18B: [
      { title: '동시에 바뀌어야 하는데', text: '@prompt', pid: 'A18P3', given: true, needs: [['new = [a[i - 1] if i > 0 else 0 for i in range(len(a))]', 'A18B/1', '옛 값으로 새 리스트를 따로 만들기']] },
      { title: '달팽이 채우기', text: '@prompt', pid: 'A18P4', needs: [['dr = [0, 1, 0, -1];  dc = [1, 0, -1, 0]', 'A18B/0', '우·하·좌·상'], ['if not (0 <= nr < n and 0 <= nc < n) or grid[nr][nc]:  d = (d + 1) % 4', 'A18B/0', '막히면 돌기'], ['print(" ".join(map(str, row)))', 'A18/0', '한 행씩 출력']] },
    ],
    A19: [
      { title: '조합으로 세 수의 합', text: '@prompt', pid: 'A19P2', needs: [['from itertools import combinations', 'A19/1', '고르는 경우 전부'], ['for c in combinations(a, 3):  if sum(c) == target:', 'A19/1', '세 개씩 골라 확인']] },
      { title: '자물쇠 비밀번호 후보', text: '@prompt', pid: 'A19P7', needs: [['from itertools import product', 'A19/0', '자리마다 따로 고르기'], ['product(range(10), repeat=n)', 'A19/0', 'n자리 번호 전부'], ['if sum(p) == target:  cnt += 1', 'A19/1', '조건에 맞는 것만 세기']] },
    ],
    A19B: [
      { title: '가지치기가 있는 부분합', text: '@prompt', pid: 'A19P4', needs: [['if s > target:  return False', 'A19B/2', '넘으면 더 볼 필요 없음'], ['go(i + 1, s + a[i]) or go(i + 1, s)', 'A19B/0', '넣는다 / 안 넣는다'], ['sys.setrecursionlimit(10000)', 'A20/2', '재귀 한도']] },
      { title: '백트래킹: 순열 생성', text: '@prompt', pid: 'A19P3', needs: [['used[i] = True;  path.append(s[i])', 'A19B/0', '고르기'], ['go()', 'A19B/0', '다음 칸으로 들어가기(재귀)'], ['path.pop();  used[i] = False', 'A19B/1', '되돌리기']] },
    ],
    A20: [
      { title: '빠른 입출력', text: '@prompt', pid: 'A20P2', needs: [['data = sys.stdin.read().split()', 'A20/2', '한 번에 다 읽기'], ['print("\\n".join(out))', 'A20/2', '한 번에 출력']] },
      { title: '경계에서 터지는 코드', text: '@prompt', pid: 'A20P3', given: true, needs: [['if not nums:  print(0)', 'A20/3', '빈 입력을 먼저 처리'], ['max(nums) - min(nums)', 'A20/3', '빈 리스트에 max 하면 ValueError']] },
      { title: '제출 전 체크리스트 통과', text: '@prompt', pid: 'A20P5', needs: [['vals = sorted(set(nums), reverse=True)', 'A20/3', '같은 값은 하나로, 큰 순'], ['if len(vals) < 2:  print("없음")', 'A20/4', '0개 · 1개 · 전부 같은 값']] },
    ],
    AB5: [
      { title: '복습 — 🏠 섞인 낱말 쪽지 묶기', text: '<p>챕터 6 을 되짚어요. 먼저 [[레슨:A16B]] 의 아나그램이에요. 가로챈 쪽지마다 낱말이 하나씩 있는데, 같은 명령이라도 글자 순서를 섞어 적었어요. 첫 줄에 낱말들(띄어쓰기, 소문자)이 들어와요.</p><p>글자를 정렬한 이름표로 묶어서 <code>이름표 → 낱말들</code> 을 처음 나온 순서대로 찍고, 마지막 줄에 가장 많이 나온 명령을 <code>가장 많이 나온 명령: 4 장 [...]</code> 처럼 찍으세요(같으면 먼저 나온 것).</p>', needs: [['key = "".join(sorted(w))', 'A16B/1', '글자를 정렬한 이름표'], ['groups.setdefault(key, []).append(w)', 'A16B/1', '이름표별로 모으기(처음 나온 순서 유지)']], io: [{ input: 'stop meet pots team tops mate spot', output: 'opst → stop pots tops spot\neemt → meet\naemt → team mate\n가장 많이 나온 명령: 4 장 [\'stop\', \'pots\', \'tops\', \'spot\']' }], answer: 'words = input().split()\ngroups = {}\nfor w in words:\n    key = "".join(sorted(w))\n    groups.setdefault(key, []).append(w)\n\nfor key, ws in groups.items():\n    print(key, "→", " ".join(ws))\nbest = []\nfor ws in groups.values():\n    if len(ws) > len(best):\n        best = ws\nprint("가장 많이 나온 명령:", len(best), "장", best)' },
      { title: '복습 — 달팽이 암호판 읽기', text: '<p>[[레슨:A18B]] 의 「막히면 돌기」 예요. 암호판은 글자를 바깥에서 안쪽으로 시계 방향(달팽이 모양)으로 적은 격자예요. 첫 줄 <code>R C</code>, 다음 R줄에 격자. (0,0) 에서 오른쪽으로 출발해, 다음 칸이 격자 밖이거나 이미 읽은 칸이면 오른쪽으로 돌아요. 읽은 글자를 이어 한 줄로 찍으세요.</p><p>글자는 리스트에 <code>append</code> 로 모았다가 마지막에 <code>"".join(parts)</code> 로 한 번에 붙여요([[레슨:A16B]] 마지막 쪽).</p>', needs: [['dr = [0, 1, 0, -1];  dc = [1, 0, -1, 0]', 'A18B/0', '우·하·좌·상'], ['if not (0 <= nr < R and 0 <= nc < C) or seen[nr][nc]:  d = (d + 1) % 4', 'A18B/0', '밖이거나 읽은 칸이면 돌기'], ['parts.append(ch) … "".join(parts)', 'A16B/3', '모았다가 한 번에 붙이기']], io: [{ input: '3 4\nmeet\nawnm\ndtae', output: 'meetmeatdawn' }], answer: 'R, C = map(int, input().split())\ngrid = [input() for _ in range(R)]\nseen = [[False] * C for _ in range(R)]\ndr = [0, 1, 0, -1]   # 우·하·좌·상\ndc = [1, 0, -1, 0]\nr, c, d = 0, 0, 0\nparts = []\nfor _ in range(R * C):\n    parts.append(grid[r][c])\n    seen[r][c] = True\n    nr, nc = r + dr[d], c + dc[d]\n    if not (0 <= nr < R and 0 <= nc < C) or seen[nr][nc]:\n        d = (d + 1) % 4\n        nr, nc = r + dr[d], c + dc[d]\n    r, c = nr, nc\nprint("".join(parts))' },
      { title: '복습 — 금고 숫자 고르기 · 출력 예측', predict: true, text: '<p>[[레슨:A19B]] 의 백트래킹과 가지치기예요. 금고 비밀번호는 9 ~ 1 중 <b>서로 다른 숫자 3개</b>이고 합이 10 이에요. 아래 코드는 큰 숫자부터 「고르고 → 들어가고 → 되돌리기」 로 후보를 전부 찾고, 함수를 부른 횟수 <code>calls</code> 도 세요. 가지치기를 끈 채로 한 번, 켜고 한 번 돌려요.</p><p>돌리기 전에 찾은 후보 목록을 먼저 예상해 보고, VS Code 에서 돌려 맞았는지 확인해 보세요. 두 줄의 후보가 같은지, 부른 횟수는 얼마나 줄었는지 보세요.</p>', needs: [['path.append(…)  →  go(…)  →  path.pop()', 'A19B/0', '고르고 · 들어가고 · 되돌리기'], ['if prune and cur > target:  return', 'A19B/2', '넘치면 그 아래는 안 봄'], ['global calls', 'A19B/3', '부른 횟수 세기']], io: [{ output: '가지치기 없음: [[7, 2, 1], [6, 3, 1], [5, 4, 1], [5, 3, 2]] 259 번\n가지치기 있음: [[7, 2, 1], [6, 3, 1], [5, 4, 1], [5, 3, 2]] 131 번' }], answer: 'digits = [9, 8, 7, 6, 5, 4, 3, 2, 1]   # 큰 수부터 — 더 빨리 넘쳐서 더 많이 끊겨요\ntarget = 10\npath = []\nfound = []\ncalls = 0\n\n\ndef go(i, cur, prune):\n    global calls\n    calls += 1\n    if prune and cur > target:   # 가지치기: 벌써 넘쳤으면 더 볼 필요 없음\n        return\n    if len(path) == 3:\n        if cur == target:\n            found.append(path[:])\n        return\n    if i == len(digits):\n        return\n    path.append(digits[i])       # 고르고\n    go(i + 1, cur + digits[i], prune)   # 들어가고\n    path.pop()                   # 되돌리기\n    go(i + 1, cur, prune)        # 안 고르고 다음 숫자로\n\n\nfor prune in [False, True]:\n    found = []\n    calls = 0\n    go(0, 0, prune)\n    print("가지치기", "있음:" if prune else "없음:", found, calls, "번")', explain: '<p>숫자를 큰 것부터 보니 후보도 큰 숫자로 시작하는 것부터 나와요: 7 + 2 + 1 · 6 + 3 + 1 · 5 + 4 + 1 · 5 + 3 + 2. 가지치기는 답을 바꾸지 않아요. 합이 10 을 넘는 순간(예: 9 + 8) 그 아래를 안 봐서 부른 횟수만 259번에서 131번으로 줄어요. <code>path.pop()</code> 으로 되돌려야 다음 숫자를 고를 때 깨끗한 상태에서 시작해요.</p>' },
      { title: '복습 — 빈 신호에서 멈춘 해독기 · 에러 읽기', text: '<p>[[레슨:A20]] 의 체크리스트예요. 신호 줄마다 「가장 큰 수 - 가장 작은 수」 가 열쇠예요. 첫 줄은 신호 줄 수 n, 다음 n줄에 숫자들이에요. 그런데 신호가 끊긴 <b>빈 줄</b>이 끼면 이렇게 멈춰요.</p><pre>열쇠: 8\nTraceback (most recent call last):\n  File "C:\\Users\\me\\algo-study\\decoder.py", line 8, in &lt;module&gt;\n    print("열쇠:", max(nums) - min(nums))\nValueError: max() iterable argument is empty</pre><p>① 몇 번째 신호 줄에서 멈췄는지, 왜인지 말해 보고 ② 열쇠를 구하는 함수 <code>key(nums)</code> 로 바꿔 빈 리스트면 <code>없음</code> 을 돌려주게 고치세요 ③ 경계 입력(빈 리스트 · 1개 · 보통)을 <code>assert</code> 로 먼저 확인하고 나서 입력을 처리하세요. 파이썬 3.11 이하에서는 마지막 줄이 <code>max() arg is an empty sequence</code> 로 나와요.</p>', needs: [['ValueError: max() iterable argument is empty', 'A20/3', '빈 리스트에 max 하면 멈춤'], ['if not nums:  return "없음"', 'A20/4', '쓰기 전에 비었는지'], ['assert key([]) == "없음"', 'A20/4', '경계 입력을 assert 로 먼저'], ['lines = sys.stdin.read().split("\\n")', 'A20/2', '입력을 한 번에 읽기']], given: 'import sys\n\nlines = sys.stdin.read().split("\\n")\nn = int(lines[0])\nfor line in lines[1:1 + n]:\n    parts = line.split()\n    nums = list(map(int, parts))\n    print("열쇠:", max(nums) - min(nums))', io: [{ input: '4\n3 9 1\n\n7 7\n12 4 20', output: '열쇠: 8\n열쇠: 없음\n열쇠: 0\n열쇠: 16' }], answer: 'import sys\n\n\ndef key(nums):\n    if not nums:\n        return "없음"\n    return max(nums) - min(nums)\n\n\nassert key([]) == "없음"\nassert key([5]) == 0\nassert key([3, 9, 1]) == 8\n\nlines = sys.stdin.read().split("\\n")\nn = int(lines[0])\nfor line in lines[1:1 + n]:\n    parts = line.split()\n    nums = list(map(int, parts))\n    print("열쇠:", key(nums))' },
      { title: '시저 암호 해독', text: '@prompt', pid: 'AB5P1', needs: [['chr((ord(ch) - ord("a") - k) % 26 + ord("a"))', 'A16/1', '알파벳 k칸 되돌리기'], ['for k in range(26):', 'A19/0', '26가지 전부 해 보기'], ['sum(w in words for w in text.split())', 'A8/0', '사전 단어 수(set 이라 빠름)']] },
      { title: '금고 격자 순찰', text: '@prompt', pid: 'AB5P2', needs: [['mask |= 1 << (r * C + c)', 'A17/2', '칸 번호를 비트로'], ['bin(mask).count("1")', 'A17/0', '방문한 칸 수'], ['dr = [-1, 0, 1, 0];  dc = [0, 1, 0, -1]', 'A18/0', '상·우·하·좌']] },
    ],
  },
};
