// courses/debug/content.js — 「디버깅·테스트 교과서」 (v2.33.0, 사용자 「1」 → T3 ~ T7 전부 11/7). 설계: specs/courses-t3-t7.md
// 교과서 모드. 연습은 내 PC 의 VS Code + 파이썬. example.code = 파이썬(check_book 이 python3 로 실제 실행).
const COURSE = { id: 'debug', name: '디버깅·테스트', runner: 'python', bench: false,
  tutorPersona: '너는 파이썬을 아는 성인에게 디버깅·테스트 을 작은 파이썬 코드로 직접 해 보며 가르치는 선생님이다.' };
const CHAPTERS = [
  { ch: 0, name: '시작', color: '#6d4c41' },
  { ch: 1, name: '버그 찾기', color: '#4f6bed' },
  { ch: 2, name: '테스트', color: '#2ea043' },
  { ch: 3, name: '테스트 습관', color: '#d97706' },
];
const DEBUG_TODO = (t) => [{ title: '준비 중', html: `<p>TODO: ${t}</p>` }]; // v2.33.0 뼈대 — draft:true 라 목차에 「준비 중」
const LESSONS = [
{ id: 'D0', ch: 0, n: 0, title: '버그는 어디서 오나', mode: 'text',
  tutorSummary: '파이썬 교과서 L22 「디버깅 사고법」 의 다음 단계(그 레슨은 링크만). 버그 세 종류를 「언제 드러나나」 로 — 문법(실행 전에 파일 전체를 검사해 SyntaxError, 1번째 줄 print 도 안 나옴) · 실행 에러(그 줄 앞까지 돌고 트레이스백) · 논리 버그(끝까지 돌고 조용히 틀림, 기대 값을 알아야 찾음). compile(src, 이름, "exec") 은 문법만, exec(code, space) 는 실제로 돌리기. 고치는 차례 재현 → 좁히기 → 고치기 → 테스트(챕터 구성과 같음). 재현은 정답을 아는 다른 방법(calendar.isleap)과 여러 입력에서 비교해 찾기. 추측 금지: 관찰 → 가설 하나 → 값을 찍어 확인 → 맞으면 고치기, 한 번에 하나만 바꾸기. 버그 기록 세 줄 재현 · 원인 · 고침(확인한 방법까지).',
  terms: { '재현': '버그가 나는 상황을 같은 입력 · 같은 차례로 다시 일으키는 것. 재현이 돼야 고쳤는지도 알 수 있어요', '가설': '「아마 이것 때문일 거야」 라는 짐작 하나. 그게 맞으면 보일 값을 찍어서 맞는지 확인해요', '버그 기록': '버그 하나마다 재현 · 원인 · 고침을 짧게 적어 둔 메모. 고침에는 확인한 방법까지 적어요' },
  pages: [
    { title: '문법 · 실행 · 논리 — 언제 드러나나', html: `<p><a href="../python/#lesson/L22" target="_blank" rel="noopener">파이썬 교과서 「디버깅 사고법」 ↗</a> 에서 버그 세 종류, 트레이스백의 마지막 줄 읽기, print 로 값 찍기를 봤어요. 이 교과서는 그다음이에요 — 버그를 <b>차례대로</b> 찾고, 고친 것을 <b>테스트로 지키는</b> 법.</p>\n<p>먼저 세 종류를 「언제 드러나나」 로 다시 나눠 봐요.</p>\n<table class="kb"><tbody><tr><th>종류</th><th>언제 드러나나</th><th>파이썬이 알려 주나</th><th>예</th></tr>\n<tr><td><b>문법 버그</b></td><td>실행 <b>전</b> — 한 줄도 안 돌아요</td><td><code>SyntaxError</code> 와 줄 번호</td><td>콜론 빠짐, 괄호 짝 안 맞음</td></tr>\n<tr><td><b>실행 에러</b></td><td>돌다가 그 줄에서 멈춰요</td><td>트레이스백(종류 · 설명 · 줄)</td><td>없는 키, 0 으로 나누기</td></tr>\n<tr><td><b>논리 버그</b></td><td>끝까지 돌아요</td><td>아무 말 없음</td><td>평균에 <code>//</code>, 경계 <code>&gt;</code></td></tr></tbody></table>\n<p>파이썬은 파일을 돌리기 전에 먼저 <b>전체를 읽어 문법을 검사</b>해요. 그래서 문법 버그가 2번째 줄에 있으면 1번째 줄의 print 도 안 나와요.</p>\n<pre>print("시작")\nif total &gt; 100        # ← 콜론(:)이 빠졌어요\n    print("많아요")\n\n  File "C:\\debug-study\\main.py", line 2\n    if total &gt; 100\n                  ^\nSyntaxError: expected ':'</pre>\n<p>「시작」 이 안 찍혔죠. 실행 에러는 반대로 그 줄 <b>앞까지는</b> 다 돌고 멈춰요. 논리 버그는 아무 말이 없어서, <b>내가 기대한 값</b>을 먼저 알고 있어야 찾을 수 있어요. 셋 중 가장 어려워요.</p>\n<p>예제는 조각 코드 셋을 <code>compile()</code> 로 <b>문법만</b> 검사하고, <code>exec(code, space)</code> 로 실제로 돌려 봐요(조각이 만든 변수는 딕셔너리 <code>space</code> 에 담겨요). 세 종류가 어디서 드러나는지 보여요. <code>compile</code> · <code>exec</code> 는 이 교과서에서 버그를 보여 줄 때만 써요 — 보통 프로그램에는 안 써요.</p>`,
      example: { code: `pieces = [\n    ("문법", "print('시작')\\nif 3 > 1\\n    print('커요')"),\n    ("실행", "print('시작')\\nprices = {'라떼': 5000}\\nprint(prices['모카'])"),\n    ("논리", "print('시작')\\nnums = [1, 2]\\nprint('평균', sum(nums) // len(nums))"),\n]\nfor kind, src in pieces:\n    print(f"--- {kind} 버그 ---")\n    try:\n        code = compile(src, "조각.py", "exec")\n    except SyntaxError as e:\n        print(f"실행 전에 막힘: {e.msg} ({e.lineno}번째 줄)")\n        continue\n    space = {}\n    try:\n        exec(code, space)\n    except Exception as e:\n        print(f"돌다가 멈춤: {type(e).__name__}: {e}")` } },
    { title: '재현 → 좁히기 → 고치기 → 테스트', html: `<p>버그를 잡는 차례는 늘 같아요. 이 교과서의 챕터도 이 차례예요.</p>\n<table class="kb"><tbody><tr><th>차례</th><th>하는 일</th><th>이 교과서</th></tr>\n<tr><td><b>1 재현</b></td><td>같은 입력으로 버그를 <b>다시</b> 일으켜요. 매번 나는지, 가끔 나는지도 봐요</td><td>이 레슨 · [[레슨:D3]] 최소 재현 예</td></tr>\n<tr><td><b>2 좁히기</b></td><td>어느 줄 · 어느 값에서 틀어지는지 찾아요</td><td>[[레슨:D1]] 트레이스백 · [[레슨:D2]] print · logging · [[레슨:D3]] 반으로 나누기 · [[레슨:D4]] 디버거</td></tr>\n<tr><td><b>3 고치기</b></td><td>원인을 알고 <b>한 곳만</b> 고쳐요</td><td>[[레슨:D5]] 흔한 버그 도감</td></tr>\n<tr><td><b>4 테스트</b></td><td>같은 입력으로 다시 돌려 확인하고, 테스트로 남겨요</td><td>챕터 2 · [[레슨:D12]] 회귀 테스트</td></tr></tbody></table>\n<p>[[재현]]이 첫 번째인 이유 — 재현이 안 되면 고쳤는지도 알 수 없어요. 「아까는 됐는데…」 는 아직 재현을 못 한 거예요. 입력 · 파일 · 누른 차례를 적어 두고, <b>한 번에 다시</b> 일으킬 수 있게 만들어요.</p>\n<p>재현하는 좋은 방법 하나 — 정답을 아는 <b>다른 방법</b>과 여러 입력에서 비교해요. 예제의 <code>is_leap</code> 은 「4로 나눠지면 윤년」 이라고 해요. 파이썬에 들어 있는 <code>calendar.isleap</code> 과 1800 ~ 2100 년을 하나씩 비교하면, 어느 해에서 틀리는지 다 나와요.</p>\n<p>틀린 해가 모두 100 으로 나눠지는 해예요 — 원인이 보이죠(100 으로 나눠지면 윤년이 아니고, 400 으로 나눠지면 다시 윤년). 고친 뒤에는 같은 비교를 다시 돌려 빈 리스트 <code>[]</code> 가 나오는지 봐요. 그게 4번 「테스트」 예요.</p>`,
      example: { code: `import calendar\n\ndef is_leap(year):\n    return year % 4 == 0      # 버그가 있어요\n\nwrong = []\nfor year in range(1800, 2101):\n    if is_leap(year) != calendar.isleap(year):\n        wrong.append(year)\nprint("재현되는 해:", wrong)` } },
    { title: '추측 금지 — 가설 하나, 확인 하나', html: `<p>버그를 「찍어서」 고치는 모습은 이래요. 여기 <code>+ 1</code> 을 붙여 보고, 안 되면 저기 <code>&lt;=</code> 로 바꿔 보고, 우연히 맞는 답이 나오면 멈춰요. 이러면 <b>왜</b> 고쳐졌는지 몰라서, 다른 입력에서 또 깨져요.</p>\n<p>대신 이렇게 해요.</p>\n<ol><li><b>관찰</b> — 무엇이 기대와 다른가? 「4 가 나와야 하는데 3」 처럼 숫자로 적어요</li><li><b>[[가설]] 하나</b> — 「대문자를 못 세는 것 같다」</li><li><b>확인</b> — 그 가설이 맞으면 보일 값을 찍어 봐요. 가장 작은 입력으로</li><li>맞으면 고치고, 틀리면 그 가설은 지우고 다음 가설로</li></ol>\n<p>예제의 <code>count_vowels("Apple Pie")</code> 는 모음(a e i o u)이 4개인데 3 이 나와요. 가설 둘을 차례로 확인해요. 가설 1 이 맞다면 <code>"e"</code> 하나만 넣었을 때 0 이 나올 거예요 — 1 이 나와요, 틀린 가설. 가설 2 가 맞다면 <code>"A"</code> 에서 0 이 나올 거예요 — 0, 맞는 가설이에요. 이제 함수 안에서 <code>ch.lower()</code> 로 비교하게 고쳐요(다음 쪽).</p>\n<div class="bk-warn"><b>한 번에 하나만 바꿔요</b> — 두 곳을 같이 바꾸면 어느 쪽이 고쳤는지, 혹시 하나는 새 버그를 만든 건 아닌지 몰라요. 하나 바꾸고 → 다시 돌리고 → 확인.</div>`,
      example: { code: `def count_vowels(text):\n    n = 0\n    for ch in text:\n        if ch in "aeiou":\n            n += 1\n    return n\n\ntext = "Apple Pie"\nprint("결과:", count_vowels(text), "(기대 4)")\n\n# 가설 1: 마지막 글자를 안 본다 → 마지막 글자 하나만 넣어 봐요\nprint("가설 1 확인:", count_vowels("e"))\n\n# 가설 2: 대문자를 못 센다 → 대문자 하나만 넣어 봐요\nprint("가설 2 확인:", count_vowels("A"))` } },
    { title: '버그 기록: # 재현 · # 원인 · # 고침', html: `<p>고친 뒤에는 세 줄로 [[버그 기록]]을 남겨요. 일주일 뒤의 나, 같이 일하는 사람이 같은 버그를 또 만나면 이 기록이 시간을 아껴 줘요. 이 챕터의 「만들어 보기: 버그 사냥」 도 이 모양으로 기록해요.</p>\n<table class="kb"><tbody><tr><th>줄</th><th>적을 것</th><th>예</th></tr>\n<tr><td><b>재현</b></td><td>어떤 입력 · 어떤 차례에서, 기대 값과 실제 값</td><td><code>count_vowels("Apple Pie")</code> 가 4 가 아니라 3</td></tr>\n<tr><td><b>원인</b></td><td>왜 그랬나 — 코드의 어느 줄, 무슨 생각 실수</td><td><code>"aeiou"</code> 에 대문자가 없어서 A 를 못 셈</td></tr>\n<tr><td><b>고침</b></td><td>무엇을 바꿨나 + <b>어떻게 확인했나</b></td><td><code>ch.lower()</code> 로 비교, <code>"A"</code> · <code>"Apple Pie"</code> 로 다시 확인</td></tr></tbody></table>\n<p>코드 맨 위에 <code>#</code> 주석으로 남겨도 되고, 커밋 메시지나 버그 보고서([[레슨:D14]])에 써도 돼요. 「고침」 에 <b>확인한 방법</b>까지 쓰는 게 요점이에요 — 그 확인이 나중에 그대로 테스트가 돼요(챕터 2).</p>`,
      example: { code: `# 버그 기록\n# 재현: count_vowels("Apple Pie") → 3 (기대 4)\n# 원인: "aeiou" 에 대문자가 없어서 "A" 를 못 셈\n# 고침: ch.lower() 로 비교 — "A" · "Apple Pie" · "sky" 로 다시 확인\n\ndef count_vowels(text):\n    n = 0\n    for ch in text:\n        if ch.lower() in "aeiou":\n            n += 1\n    return n\n\nfor text, want in [("A", 1), ("Apple Pie", 4), ("sky", 0)]:\n    got = count_vowels(text)\n    if got == want:\n        print(text, got, "OK")\n    else:\n        print(text, got, "틀림")` } },
  ],
  summary: ['문법(실행 전) · 실행 에러(그 줄에서 멈춤) · 논리 버그(조용히 틀림) — 논리 버그는 기대 값을 알아야 찾는다', '재현 → 좁히기 → 고치기 → 테스트, 재현은 정답을 아는 다른 방법과 여러 입력에서 비교', '추측 금지: 가설 하나 → 값으로 확인 → 한 번에 하나만 바꾸기, 고치면 재현 · 원인 · 고침 세 줄 기록'] },
{ id: 'D1', ch: 1, n: 1, title: '트레이스백 끝까지 읽기', mode: 'text',
  tutorSummary: 'L22 의 「마지막 줄 = 종류: 설명, line N」 다음 단계. most recent call last = 맨 아래가 가장 최근. 읽는 차례: 맨 아래 종류 · 설명 → 바로 위 칸(에러 난 줄, 3.11+ 의 ~~~^~~~ 는 그 줄의 어느 부분) → 위로 올라가며 누가 불렀나(<module> 까지). 칸 하나 = 함수 한 겹 = 호출 스택. 에러는 아래 칸에서 났어도 원인은 위 칸(빈 리스트를 넘긴 곳)일 때가 많다. 라이브러리 칸(json/decoder.py 등)은 건너뛰고 내 파일 이름이 처음 나오는 칸 = 내가 부른 곳, 고칠 건 넘긴 값. traceback.format_exc() 글자, traceback.extract_tb(e.__traceback__) 칸 목록(.filename .lineno .name .line), frame.filename == __file__ 로 내 파일. 연쇄 예외: During handling of the above exception(except 안에서 또 에러 — 보통 실수, e.__context__) vs The above exception was the direct cause(raise 새에러 from e, e.__cause__, 파이썬 L15C) — 위쪽이 먼저 일어난 일. 종류별 첫 질문 표(KeyError 키 !r · IndexError len · TypeError type · NoneType 은 None 을 돌려준 함수 · ValueError 글자 !r · FileNotFoundError os.getcwd()).',
  terms: { '트레이스백': '에러가 났을 때 파이썬이 찍는 여러 줄. 맨 아래가 에러 종류와 설명, 그 위가 「누가 누구를 불렀나」 의 차례예요', '호출 스택': '지금 돌고 있는 함수들이 「누가 누구를 불렀나」 차례로 쌓인 것. 트레이스백은 에러가 난 순간의 호출 스택이에요', '연쇄 예외': '에러를 처리하다가(except 안에서) 또 에러가 나거나, raise … from e 로 바꿔 던져서 트레이스백 두 개가 이어 붙은 것' },
  pages: [
    { title: 'most recent call last — 맨 아래가 최근', html: `<p><a href="../python/#lesson/L22" target="_blank" rel="noopener">파이썬 교과서 「디버깅 사고법」 ↗</a> 에서 [[트레이스백]]의 <b>마지막 줄</b>(종류: 설명)과 <code>line N</code> 을 봤어요. 함수가 여러 겹이면 트레이스백이 길어져요. 첫 줄 <code>Traceback (most recent call last)</code> 은 「가장 최근 호출이 마지막(맨 아래)」 이라는 뜻이에요.</p>\n<pre>Traceback (most recent call last):\n  File "C:\\debug-study\\report.py", line 8, in &lt;module&gt;\n    print(report([]))\n          ^^^^^^^^^^\n  File "C:\\debug-study\\report.py", line 5, in report\n    avg = average(scores)\n          ^^^^^^^^^^^^^^^\n  File "C:\\debug-study\\report.py", line 2, in average\n    return sum(nums) / len(nums)\n           ~~~~~~~~~~^~~~~~~~~~~\nZeroDivisionError: division by zero</pre>\n<ol><li><b>맨 아래</b> — 무엇이: <code>ZeroDivisionError: division by zero</code></li><li><b>바로 위 칸</b> — 어디서: <code>average</code> 의 2번째 줄. <code>~~~^~~~</code> 표시(파이썬 3.11 부터)는 그 줄의 <b>어느 부분</b>인지 짚어 줘요 — 여기선 <code>/</code></li><li><b>위로 올라가며</b> — 누가 불렀나: <code>report</code> 의 5번째 줄 ← 맨 처음 <code>&lt;module&gt;</code>(파일 맨 바깥)의 8번째 줄</li></ol>\n<p><code>File …, line …, in 함수</code> 와 그 줄 코드가 칸 하나, 함수 한 겹이에요. 이 겹들을 [[호출 스택]]이라고 해요. 에러는 맨 아래 칸에서 <b>났지만</b>, 원인은 위 칸에 있을 때가 많아요 — 여기서는 빈 리스트 <code>[]</code> 를 넘긴 8번째 줄이 진짜 원인이죠. 「맨 아래에서 멈추지 말고 끝까지(맨 위까지) 읽기」 가 이 레슨의 제목이에요.</p>\n<p>예제는 에러를 잡아서 <code>traceback.format_exc()</code> 로 트레이스백 글자를 받아 찍어요(멈추지 않고 끝까지 보려고). 내 PC 에서는 경로가 내 폴더로 나와요.</p>`,
      example: { code: `import traceback\n\ndef average(nums):\n    return sum(nums) / len(nums)\n\ndef report(scores):\n    avg = average(scores)\n    return f"평균 {avg:.1f}"\n\nprint(report([80, 90]))\ntry:\n    print(report([]))\nexcept ZeroDivisionError:\n    print(traceback.format_exc())` } },
    { title: '내 파일 줄 찾기 — 라이브러리 칸 건너뛰기', html: `<p>트레이스백 맨 아래 칸이 <b>내 파일이 아닐</b> 때가 많아요. 파이썬에 들어 있는 모듈(json · csv …)이나 pip 로 깐 라이브러리 안에서 에러가 나면, 아래쪽 몇 칸은 그 라이브러리 파일이에요.</p>\n<pre>Traceback (most recent call last):\n  File "C:\\debug-study\\settings.py", line 7, in &lt;module&gt;\n    cfg = load_settings(text)\n  File "C:\\debug-study\\settings.py", line 4, in load_settings\n    return json.loads(text)\n  File "C:\\Users\\me\\AppData\\Local\\Programs\\Python\\Python315\\Lib\\json\\__init__.py", line 346, in loads\n    return _default_decoder.decode(s)\n  File "C:\\Users\\me\\...\\Lib\\json\\decoder.py", line 337, in decode\n    obj, end = self.raw_decode(s, idx=_w(s, 0).end())\n  File "C:\\Users\\me\\...\\Lib\\json\\decoder.py", line 353, in raw_decode\n    obj, end = self.scan_once(s, idx)\njson.decoder.JSONDecodeError: Expecting property name enclosed in double quotes: line 1 column 30 (char 29)</pre>\n<p>읽는 법: 맨 아래 <b>종류 · 설명</b>을 읽고, 위로 올라가며 <b>내 파일 이름이 처음 나오는 칸</b>을 찾아요. 그 줄(<code>json.loads(text)</code>)이 내가 라이브러리를 부른 곳이에요. 라이브러리가 틀렸을 리는 거의 없어요 — 내가 <b>넘긴 값</b>이 이상한 거예요. 여기선 <code>,}</code> — JSON 은 마지막 쉼표를 허락하지 않아요(<a href="../python/#lesson/L17C" target="_blank" rel="noopener">파이썬 교과서 「JSON 으로 저장하기」 ↗</a>).</p>\n<p>코드로도 칸을 하나씩 볼 수 있어요. <code>traceback.extract_tb(e.__traceback__)</code> 는 칸 목록을 돌려줘요. 칸마다 <code>.filename</code>(파일) · <code>.lineno</code>(줄 번호) · <code>.name</code>(함수) · <code>.line</code>(그 줄 코드)이 있어요. 내 파일인지는 <code>frame.filename == __file__</code> 로 물어요(<code>__file__</code> = 지금 돌고 있는 내 파일의 경로).</p>\n<p class="muted small">설명 글자는 파이썬 버전마다 조금 달라요 — 3.13 은 같은 에러를 <code>Illegal trailing comma before end of object</code> 라고 더 친절하게 말해요. 종류(<code>JSONDecodeError</code>)는 같아요.</p>`,
      example: { code: `import json\nimport os\nimport traceback\n\ndef load_settings(text):\n    return json.loads(text)\n\ntext = '{"theme": "dark", "size": 14,}'\ntry:\n    cfg = load_settings(text)\nexcept json.JSONDecodeError as e:\n    print("종류:", type(e).__name__)\n    for frame in traceback.extract_tb(e.__traceback__):\n        if frame.filename == __file__:\n            where = "내 파일   "\n        else:\n            where = "라이브러리"\n        name = os.path.basename(frame.filename)\n        print(where, name, frame.lineno, "줄", frame.name, "|", frame.line)` } },
    { title: '연쇄 예외 — During handling 과 from e', html: `<p>트레이스백이 <b>두 개</b> 이어져 나올 때가 있어요([[연쇄 예외]]). 가운데 한 줄이 둘을 이어 주는데, 그 문장이 두 가지예요.</p>\n<table class="kb"><tbody><tr><th>가운데 줄</th><th>뜻</th><th>언제</th></tr>\n<tr><td><code>During handling of the above exception, another exception occurred:</code></td><td>위 에러를 <b>처리하다가</b> 또 에러가 났어요</td><td>except 안의 코드에 버그가 있을 때 — 보통 실수예요</td></tr>\n<tr><td><code>The above exception was the direct cause of the following exception:</code></td><td>위 에러가 아래 에러의 <b>원인</b>이에요</td><td><code>raise 새에러(…) from e</code> 로 일부러 바꿔 던졌을 때(<a href="../python/#lesson/L15C" target="_blank" rel="noopener">파이썬 교과서 「내 예외 만들기: raise」 ↗</a>)</td></tr></tbody></table>\n<p>두 경우 모두 <b>위쪽 트레이스백이 먼저 일어난 일</b>, 아래쪽이 나중 일이에요.</p>\n<pre>Traceback (most recent call last):\n  File "C:\\debug-study\\menu.py", line 5, in price_of\n    return prices[name]\n           ~~~~~~^^^^^^\nKeyError: '모카'\n\nDuring handling of the above exception, another exception occurred:\n\nTraceback (most recent call last):\n  File "C:\\debug-study\\menu.py", line 9, in &lt;module&gt;\n    price_of("모카")\n  File "C:\\debug-study\\menu.py", line 7, in price_of\n    print("메뉴에 없어요:", nmae)\n                            ^^^^\nNameError: name 'nmae' is not defined</pre>\n<p>맨 아래만 보면 「except 안의 이름 오타」 만 보여요. 그걸 고치면 끝일까요? 위쪽의 <code>KeyError: '모카'</code> 는 except 가 원래 처리하려던 일이에요 — 오타를 고친 뒤 그 처리가 맞게 되는지(돌려주는 값이 있는지)도 봐야 해요. 둘 다 읽어요.</p>\n<p>코드에서는 에러 객체에 붙어 있어요. <code>e.__context__</code> 는 「처리하다가 났을 때」 의 원래 에러, <code>e.__cause__</code> 는 <code>from e</code> 로 붙인 원인이에요.</p>`,
      example: { code: `prices = {"아메리카노": 4500, "라떼": 5000}\n\ndef price_of(name):\n    try:\n        return prices[name]\n    except KeyError:\n        print("메뉴에 없어요:", nmae)     # 오타 — except 안의 버그\n\nclass OrderError(Exception):\n    pass\n\ndef parse_count(text):\n    try:\n        return int(text)\n    except ValueError as e:\n        raise OrderError(f"개수가 숫자가 아니에요: {text}") from e\n\ntry:\n    price_of("모카")\nexcept NameError as e:\n    print("나중 에러:", type(e).__name__, e)\n    print("처음 에러:", type(e.__context__).__name__, e.__context__)\n\ntry:\n    parse_count("두 잔")\nexcept OrderError as e:\n    print("나중 에러:", type(e).__name__, e)\n    print("원인:", type(e.__cause__).__name__, e.__cause__)` } },
    { title: '종류별 첫 질문 — NoneType 은 누가?', html: `<p>마지막 줄의 종류를 보면 <b>첫 질문</b>이 정해져요. 그 질문의 답을 찍어 보면 돼요([[레슨:D2]] 의 <code>!r</code> · <code>x=</code>).</p>\n<table class="kb"><tbody><tr><th>마지막 줄</th><th>첫 질문</th><th>찍어 볼 것</th></tr>\n<tr><td><code>KeyError: '모카'</code></td><td>그 키가 정말 있나? 철자 · 빈칸 · 대소문자</td><td><code>d.keys()</code> · <code>f"{key!r}"</code></td></tr>\n<tr><td><code>IndexError</code></td><td>리스트가 몇 칸인가? 번호는 몇인가?</td><td><code>len(items)</code> · <code>i</code></td></tr>\n<tr><td><code>TypeError: … 'int' and 'str'</code></td><td>값이 생각한 타입인가?</td><td><code>type(x)</code></td></tr>\n<tr><td><code>AttributeError: 'NoneType' …</code></td><td>이 값을 돌려준 함수가 None 을 돌려주지 않았나?</td><td>그 함수의 <code>return</code></td></tr>\n<tr><td><code>ValueError: invalid literal for int()</code></td><td>바꾸려던 글자가 정확히 뭐였나?</td><td><code>f"{text!r}"</code></td></tr>\n<tr><td><code>FileNotFoundError</code></td><td>지금 어느 폴더에서 돌고 있나?</td><td><code>os.getcwd()</code></td></tr></tbody></table>\n<p>가장 헷갈리는 게 <code>'NoneType' object has no attribute</code> 예요.</p>\n<pre>  File "C:\\debug-study\\nick.py", line 6, in &lt;module&gt;\n    print(nickname(user).upper())\n          ^^^^^^^^^^^^^^^^^^^^\nAttributeError: 'NoneType' object has no attribute 'upper'</pre>\n<p>에러는 <code>.upper()</code> 를 부른 줄에서 났지만, 진짜 버그는 <b>None 을 돌려준 함수</b>에 있어요. return 을 빼먹었거나, if 의 한 갈래에만 return 이 있을 때예요. 예제의 <code>nickname</code> 은 별명이 없으면 끝까지 가서 아무것도 돌려주지 않아요 — 파이썬 함수는 그러면 None 을 돌려줘요. 고칠 곳은 <code>.upper()</code> 줄이 아니라 <code>nickname</code> 의 끝(<code>return user["name"]</code> 처럼)이에요.</p>`,
      example: { code: `def nickname(user):\n    if "nick" in user:\n        return user["nick"]\n    # 별명이 없으면? 여기 return 이 없어서 None 을 돌려줘요\n\nusers = [{"name": "민수", "nick": "mins"}, {"name": "영희"}]\nfor user in users:\n    nick = nickname(user)\n    print(user["name"], type(nick).__name__)\n    if nick is not None:\n        print("  →", nick.upper())\n    else:\n        print("  → None 이라 .upper() 를 부르면 AttributeError")` } },
  ],
  summary: ['맨 아래(종류: 설명) → 바로 위 칸(에러 난 줄) → 위로 올라가며 누가 불렀나 — 원인은 위 칸일 때가 많다', '라이브러리 칸은 건너뛰고 내 파일 이름이 처음 나오는 칸 = 내가 넘긴 값이 이상한 곳 (extract_tb · frame.filename == __file__)', 'During handling = except 안의 버그(__context__), direct cause = from e(__cause__) — 위쪽이 먼저 일어난 일'] },
{ id: 'D2', ch: 1, n: 2, title: 'print · logging 디버깅', mode: 'text',
  tutorSummary: 'L22 의 print("i:", i) 다음 단계. f"{x=}" 은 이름=값을 한 번에(식도 됨 f"{price * count=}"), 글자는 따옴표째(repr) 보여서 끝 빈칸 · \\n 이 보인다. 값만 따옴표째는 f"{x!r}". input · 파일 줄의 \\n · 빈칸 → strip(). logging: 남겨 두고 켜고 끄는 print. basicConfig(level=…, format="%(levelname)s %(message)s") 맨 처음 한 번, 레벨 DEBUG < INFO < WARNING(기본) < ERROR < CRITICAL, 정한 레벨 이상만. %(funcName)s %(lineno)d %(asctime)s(시각 — 예제에선 뺌). 로그는 stderr(예제는 출력 차례를 맞추려고 stream=sys.stdout). level="INFO" 글자도 됨. basicConfig 는 처음 한 번만 먹음 — 다시는 force=True. filename="debug.log" · filemode="w"(새로) · encoding="utf-8". 다 찾으면 print 디버그 줄은 지우고(Ctrl+Shift+F 로 print(f"{ 찾기), logging 은 레벨만 올려 두고, *.log 는 .gitignore.',
  terms: { '로그': '프로그램이 도는 동안 「지금 무엇을 하는지」 남기는 기록 줄. 지우지 않고 켜고 끌 수 있는 print 예요', '로그 레벨': '로그 줄의 중요도. DEBUG < INFO < WARNING < ERROR < CRITICAL — 정한 레벨보다 낮은 줄은 안 찍혀요' },
  pages: [
    { title: 'print(f"{x=}") — 이름과 값을 한 번에', html: `<p><a href="../python/#lesson/L22" target="_blank" rel="noopener">파이썬 교과서 「디버깅 사고법」 ↗</a> 에서는 <code>print("i:", i)</code> 처럼 이름과 값을 같이 찍었어요. f-문자열 안에서 이름 뒤에 <code>=</code> 를 붙이면 이름을 두 번 쓸 필요가 없어요. 식도 돼요.</p>\n<pre>price = 4500\ncount = 3\nprint(f"{price=}")             # price=4500\nprint(f"{price * count=}")     # price * count=13500\nprint(f"{len('라떼')=}")        # len('라떼')=2</pre>\n<p>글자는 <code>=</code> 가 <b>따옴표째</b> 보여 줘요. 이게 디버깅에 아주 좋아요 — 눈에 안 보이는 <b>빈칸 · 줄바꿈</b>이 보이거든요. 이름 없이 값만 따옴표째 보고 싶으면 <code>!r</code> 을 붙여요.</p>\n<pre>answer = "yes "                # 끝에 빈칸이 있어요\nprint(answer == "yes")         # False\nprint(answer)                  # yes    ← 빈칸이 안 보여요\nprint(f"{answer=}")            # answer='yes '\nprint(f"{answer!r}")           # 'yes '</pre>\n<p><code>input()</code> 으로 받은 글자 · 파일에서 읽은 줄은 끝에 줄바꿈(<code>\\n</code>)이나 빈칸이 붙어 있을 때가 많아요. 「분명 같은데 <code>==</code> 가 False」 면 먼저 <code>!r</code> 로 찍어 보세요. 범인이 보이면 <code>line.strip()</code> 으로 앞뒤 빈칸 · 줄바꿈을 지워요.</p>`,
      example: { code: `lines = ["민수\\n", "영희 \\n", "철수"]\nmembers = {"민수", "영희", "철수"}\nfor line in lines:\n    print(f"{line!r}", line in members)\n    name = line.strip()\n    print(f"{name=}", name in members)` } },
    { title: 'logging.debug() · basicConfig()', html: `<p>print 로 찍은 디버그 줄은 버그를 찾으면 <b>지워야</b> 하고, 다음에 또 필요하면 다시 써야 해요. [[로그]]는 <b>남겨 두고 켜고 끌 수 있는</b> print 예요. 파이썬에 들어 있는 <code>logging</code> 모듈로 해요.</p>\n<table class="kb"><tbody><tr><th>[[로그 레벨]]</th><th>언제 쓰나</th></tr>\n<tr><td><code>logging.debug()</code></td><td>고치는 중에만 보고 싶은 자세한 값</td></tr>\n<tr><td><code>logging.info()</code></td><td>「시작했어요 · 저장했어요」 같은 정상 흐름</td></tr>\n<tr><td><code>logging.warning()</code></td><td>이상하지만 계속 돌 수 있을 때 — <b>기본 레벨</b></td></tr>\n<tr><td><code>logging.error()</code></td><td>일 하나가 실패했을 때</td></tr>\n<tr><td><code>logging.critical()</code></td><td>프로그램을 더 못 돌릴 때</td></tr></tbody></table>\n<p><code>logging.basicConfig(…)</code> 는 프로그램 맨 처음에 <b>한 번</b> 불러 설정해요. <code>level=</code> 은 「이 레벨 <b>이상만</b> 찍기」, <code>format=</code> 은 줄 모양이에요 — <code>%(levelname)s</code> 레벨 이름, <code>%(message)s</code> 내용, <code>%(funcName)s</code> 함수 이름. 아무 설정도 안 하면 기본은 WARNING 이라 debug · info 는 안 나와요.</p>\n<div class="bk-warn"><b>로그는 stderr 로 나가요</b> — 터미널에서는 print 와 똑같이 보이지만 다른 통로예요. 이 교과서의 예제 · 예시 답은 출력 예와 줄 차례가 맞게 <code>stream=sys.stdout</code> 을 줬어요. 내 프로그램에서는 빼도 돼요.</div>`,
      example: { code: `import logging\nimport sys\n\nlogging.basicConfig(level=logging.DEBUG, format="%(levelname)s %(funcName)s: %(message)s", stream=sys.stdout)\n\ndef total_price(cart):\n    total = 0\n    for name, price, count in cart:\n        total += price * count\n        logging.debug(f"{name} 더함 → {total=}")\n    logging.info(f"합계 {total}")\n    return total\n\ncart = [("아메리카노", 4500, 2), ("케이크", 6500, 1)]\ntotal_price(cart)\nif total_price([]) == 0:\n    logging.warning("빈 장바구니로 계산했어요")` } },
    { title: '레벨 하나로 끄기 — level="WARNING"', html: `<p>다 고쳤으면 debug 줄을 지우지 말고 <b>레벨만</b> 올려요. 한 줄만 바꾸면 debug 줄이 모두 조용해져요. 다음에 또 버그가 나면 DEBUG 로 내리기만 하면 돼요.</p>\n<table class="kb"><tbody><tr><th>level=</th><th>나오는 줄</th></tr>\n<tr><td><code>logging.DEBUG</code></td><td>DEBUG · INFO · WARNING · ERROR · CRITICAL 전부</td></tr>\n<tr><td><code>logging.INFO</code></td><td>INFO 부터</td></tr>\n<tr><td><code>logging.WARNING</code> (기본)</td><td>WARNING 부터</td></tr></tbody></table>\n<p>글자로 줘도 돼요: <code>level="INFO"</code>. 그래서 입력이나 설정 파일에서 레벨을 받기 쉬워요.</p>\n<div class="bk-warn"><b>basicConfig 는 처음 한 번만 먹어요</b> — 이미 설정된 뒤에 또 부르면 조용히 무시돼요. 다시 설정하려면 <code>force=True</code> 를 붙여요. 「레벨을 바꿨는데 그대로예요」 의 흔한 원인이에요.</div>\n<p>format 에 <code>%(lineno)d</code> 를 넣으면 몇째 줄에서 찍었는지도 나와요. 실제 프로그램은 <code>%(asctime)s</code>(시각)도 자주 넣어요 — 이 교과서 예제에서는 출력이 매번 달라져서 뺐어요.</p>`,
      example: { code: `import logging\nimport sys\n\ndef average(nums):\n    logging.debug(f"{nums=}")\n    if not nums:\n        logging.warning("빈 리스트 — 0 으로 해요")\n        return 0\n    return sum(nums) / len(nums)\n\nfor level in ["DEBUG", "WARNING"]:\n    logging.basicConfig(level=level, format="%(levelname)s %(message)s", stream=sys.stdout, force=True)\n    print(f"--- level={level} ---")\n    print(average([80, 90]))\n    print(average([]))` } },
    { title: 'filename="debug.log" · 다 찾으면 정리', html: `<p>오래 도는 프로그램, 가끔만 나는 버그는 화면 대신 <b>파일</b>에 로그를 남겨요. <code>filename=</code> 을 주면 그 파일 끝에 이어 써요. <code>filemode="w"</code> 는 실행할 때마다 새로 쓰기, 한글이 있으면 <code>encoding="utf-8"</code>.</p>\n<pre>logging.basicConfig(filename="debug.log", filemode="w", encoding="utf-8",\n                    level=logging.INFO, format="%(levelname)s %(message)s")</pre>\n<p>버그를 다 찾은 뒤 정리하는 법:</p>\n<ul><li><b>print 디버그 줄은 지워요</b> — 출력이 달라지면 그 출력을 읽는 다른 프로그램 · 테스트가 깨져요. VS Code 에서 <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>F</kbd> 로 <code>print(f"{</code> 를 찾으면 빠뜨리지 않아요</li><li><b>logging 줄은 남겨도 돼요</b> — 레벨을 INFO 나 WARNING 으로 올려 두면 조용해요</li><li>로그 파일(<code>*.log</code>)은 Git 에 올리지 않아요 — <code>.gitignore</code> 에 <code>*.log</code> 한 줄</li></ul>`,
      example: { code: `import logging\n\nlogging.basicConfig(filename="debug.log", filemode="w", encoding="utf-8",\n                    level=logging.INFO, format="%(levelname)s %(message)s")\n\nfor order in ["라떼", "모카", "아메리카노"]:\n    if order == "모카":\n        logging.error(f"없는 메뉴: {order}")\n    else:\n        logging.info(f"주문 받음: {order}")\nprint("주문 처리 끝 — 화면에는 이 줄만 나와요")\n\nlogging.shutdown()\nwith open("debug.log", encoding="utf-8") as f:\n    print(f.read())` } },
  ],
  summary: ['f"{x=}" 은 이름=값, 글자는 따옴표째 — 끝 빈칸 · 줄바꿈은 !r 로 보고 strip()', 'logging.basicConfig(level=…, format=…) 맨 처음 한 번, DEBUG < INFO < WARNING(기본) < ERROR — 정한 레벨 이상만', '다 고치면 print 디버그 줄은 지우고 logging 은 레벨만 올리기, 다시 설정은 force=True · 파일은 filename='] },
{ id: 'D3', ch: 1, n: 3, title: '범위 좁히기', mode: 'text',
  tutorSummary: 'L22 의 「주석으로 절반씩」 을 데이터 · 단계 · 버전에. 반으로 나누기(이분 탐색): works(part) 하나로 rows[lo:mid] 를 시험, 통과면 lo = mid 아니면 hi = mid — 1000 줄도 10 번. 단계 사이 assert 조건, "메시지"(파이썬 L21) — 처음 틀린 단계 안에 버그, 앞 단계는 의심에서 지움. 최소 재현 예: 하나 빼 보고 버그가 남으면 뺀 채로, 안 남으면 되돌리기 → 더 못 뺄 때까지(remove_negatives 는 음수 둘이 붙어 있을 때만 — 남는 건 [-6, -8] — 도는 리스트에서 remove 하면 한 칸 건너뜀, 고침은 [x for x in nums if x >= 0]). 최소 재현 예는 원인이 보이고 · 질문/버그 보고서(D14)에 붙이고 · 회귀 테스트(D12)가 된다. git bisect start / bad / good v1.0 / reset — 커밋을 반으로 나눠 처음 깨진 커밋(이름만, 터미널·Git 교과서).',
  terms: { '이분 탐색': '반으로 나눠 한쪽만 남기기를 되풀이해 찾는 방법. 1000 개도 10 번이면 하나로 줄어요', '최소 재현 예': '버그가 그대로 나는, 가장 작게 줄인 입력 · 코드. 남에게 물을 때도 이걸 보여 줘요' },
  pages: [
    { title: '반으로 나누기 — 1000줄도 10번이면', html: `<p><a href="../python/#lesson/L22" target="_blank" rel="noopener">파이썬 교과서 「디버깅 사고법」 ↗</a> 에서 코드 절반을 주석 처리해 범위를 좁혔죠. 같은 생각을 <b>데이터</b>에도 써요. 1000 줄짜리 파일 어딘가에 이상한 줄이 하나 있어서 프로그램이 멈추면, 앞 500 줄만 넣어 봐요 → 멈추면 그 안에서, 안 멈추면 뒤 500 줄에서 또 반으로.</p>\n<pre>1000 → 500 → 250 → 125 → 63 → 32 → 16 → 8 → 4 → 2 → 1      (10번)</pre>\n<p>이렇게 반씩 버리는 방법을 [[이분 탐색]]이라고 해요. 한 줄씩 보면 최악 1000 번, 반으로 나누면 10 번이에요. 예제는 「이 줄들은 잘 되나?」 를 알려 주는 함수 <code>works(rows)</code> 하나로 범인 줄을 찾아요. <code>rows[lo:hi]</code> 안에 범인이 있다는 걸 지키면서, 앞 절반 <code>rows[lo:mid]</code> 이 통과하면 <code>lo = mid</code>, 아니면 <code>hi = mid</code>.</p>\n<p>코드에도 똑같이 써요. 50 줄짜리 함수의 결과가 틀리면 25번째 줄에 print 하나 → 거기까지 값이 맞으면 뒤쪽, 틀리면 앞쪽.</p>`,
      example: { code: `rows = [f"손님{i},{i * 100}" for i in range(1, 1001)]\nrows[736] = "손님737,칠백"            # 이상한 줄 하나\n\ndef works(part):\n    try:\n        for row in part:\n            name, amount = row.split(",")\n            int(amount)\n        return True\n    except ValueError:\n        return False\n\nprint("전체:", works(rows))\nlo, hi = 0, len(rows)                # rows[lo:hi] 안에 범인이 있어요\ntries = 0\nwhile hi - lo > 1:\n    mid = (lo + hi) // 2\n    tries += 1\n    if works(rows[lo:mid]):\n        lo = mid                     # 앞 절반은 멀쩡 → 뒤 절반에\n    else:\n        hi = mid                     # 앞 절반에 범인\nprint(f"{tries}번 만에 찾음: {lo + 1}번째 줄 {rows[lo]!r}")` } },
    { title: '단계 사이에 assert — 처음 틀린 곳', html: `<p>프로그램이 「읽기 → 다듬기 → 세기 → 출력」 처럼 단계로 되어 있으면, <b>단계 사이</b>에 「여기까지는 이래야 해」 를 적어 두고 하나씩 확인해요. 처음으로 틀린 단계 <b>안</b>에 버그가 있어요 — 앞 단계는 의심 목록에서 지워요.</p>\n<pre>자르기 ──✔── 다듬기 ──✘── 세기 ── 출력\n                ↑ 이 안에 버그</pre>\n<p>확인은 <code>assert 조건, "메시지"</code>(<a href="../python/#lesson/L21" target="_blank" rel="noopener">파이썬 교과서 「테스트 작성」 ↗</a>) 로 해요. 틀리면 그 자리에서 메시지와 함께 멈추니까, 어느 단계인지 바로 보여요. 예를 들어 2단계를 <code>[p.strip() for p in parts]</code> 로 잘못 쓰면 이렇게 멈춰요.</p>\n<pre>AssertionError: 2단계: ['사과', '배', '사과', '귤', '', '배']</pre>\n<p>메시지에 그 단계의 값을 넣어 두면(<code>f"2단계: {words}"</code>) 왜 틀렸는지까지 한 번에 보여요. 빈 글자 <code>''</code> 가 남았네요 — 빈 것을 빼는 <code>if p.strip()</code> 가 빠진 거예요. 예제는 세 단계가 모두 맞는 코드예요.</p>
<p>목록의 <b>모든</b> 값이 조건을 지키는지 한 줄로 확인할 때는 <code>all(조건 for 값 in 목록)</code> 을 써요. 하나라도 어기면 <code>False</code> 라서 assert 가 멈춰요(빈 목록이면 <code>True</code>).</p>
<pre>assert all(w == w.strip() for w in words), f"2단계: {words}"</pre>`,
      example: { code: `text = "사과, 배,사과 , 귤,,배"\n\n# 1단계: 쉼표로 자르기\nparts = text.split(",")\nassert len(parts) == 6, f"1단계: {parts}"\nprint("1단계 OK", parts)\n\n# 2단계: 빈칸 지우고 빈 것 빼기\nwords = [p.strip() for p in parts if p.strip()]\nassert "" not in words, f"2단계: {words}"\nprint("2단계 OK", words)\n\n# 3단계: 세기\ncounts = {}\nfor w in words:\n    counts[w] = counts.get(w, 0) + 1\nassert sum(counts.values()) == len(words), f"3단계: {counts}"\nprint("3단계 OK", counts)` } },
    { title: '최소 재현 예 — 지워도 남으면 지우기', html: `<p>버그를 재현하는 입력이 길면 원인이 안 보여요. [[최소 재현 예]]는 <b>버그가 그대로 남는 한</b> 계속 줄인 입력이에요. 방법은 단순해요 — 하나를 지워 보고 → 버그가 아직 나면 지운 채로 두고 → 안 나면 되돌려요. 더 지울 게 없을 때까지.</p>\n<ul><li>원인이 바로 보여요 — 남은 게 몇 개 없으니까</li><li>남에게 물을 때(질문 · 이슈 · AI 도구) 그대로 붙여요 — [[레슨:D14]] 의 버그 보고서</li><li>그대로 테스트가 돼요 — [[레슨:D12]] 회귀 테스트</li></ul>\n<p>예제의 <code>remove_negatives</code> 는 음수를 지우는데 가끔 하나를 남겨요. 아홉 칸짜리 입력을 자동으로 줄여 봐요. <code>fails(nums)</code> 는 「이 입력에서 버그가 나나?」 를 알려 주는 함수예요.</p>\n<p>남는 건 <code>[-6, -8]</code>, 결과는 <code>[-8]</code> — 음수 둘이 <b>붙어 있을 때</b>만 나요. 리스트를 도는 중에 그 리스트에서 <code>remove</code> 하면, 지운 자리로 다음 칸이 당겨져서 한 칸을 건너뛰어요. 고치려면 남길 것만 새 리스트에 모아요: <code>[x for x in nums if x &gt;= 0]</code>.</p>`,
      example: { code: `def remove_negatives(nums):\n    for x in nums:\n        if x < 0:\n            nums.remove(x)\n    return nums\n\ndef fails(nums):\n    result = remove_negatives(list(nums))   # 복사본을 넘겨요\n    return any(x < 0 for x in result)\n\ncase = [3, -1, -2, 5, -4, 7, -6, -8, 2]\nprint("처음:", case, "버그 남?", fails(case))\n\nshrunk = True\nwhile shrunk:\n    shrunk = False\n    for i in range(len(case)):\n        smaller = case[:i] + case[i + 1:]    # i 번째 하나를 뺀 것\n        if fails(smaller):\n            case = smaller                   # 빼도 버그가 남으면 뺀 채로\n            shrunk = True\n            break\nprint("최소 재현 예:", case)\nresult = remove_negatives(list(case))\nprint("그 결과:", result)` } },
    { title: 'git bisect — 어느 커밋부터 깨졌나', html: `<p>「어제까지는 됐는데」 — 코드가 아니라 <b>버전</b>을 반으로 나눌 때도 있어요. Git 에는 커밋들을 반씩 나눠 「처음으로 깨진 커밋」 을 찾아 주는 <code>git bisect</code> 가 있어요. 여기서는 이름과 생각만 알아 두세요(Git 이 처음이면 <a href="../terminal-git/" target="_blank" rel="noopener">터미널·Git 교과서 ↗</a>).</p>\n<pre>git bisect start\ngit bisect bad            ← 지금 커밋은 깨짐\ngit bisect good v1.0      ← 이때는 됐음\n   … Git 이 가운데 커밋으로 옮겨 줘요 → 돌려 보고 good 또는 bad …\ngit bisect reset          ← 다 찾으면 원래대로</pre>\n<p>하는 일은 첫 쪽의 반으로 나누기와 똑같아요. 커밋이 100 개여도 7 번쯤 확인하면 돼요. 확인을 테스트 하나로 할 수 있으면 더 빨라요 — 챕터 2 에서 만들어요. 예제는 버전 20 개를 흉내 내서 같은 방법으로 처음 깨진 버전을 찾아요.</p>`,
      example: { code: `# 버전마다 세율 — 13번부터 누가 0.1 을 0.01 로 잘못 바꿨어요\nversions = [0.1] * 13 + [0.01] * 7\n\ndef good(v):\n    rate = versions[v]\n    return round(1000 * (1 + rate)) == 1100\n\nlo, hi = 0, len(versions) - 1        # lo 는 됨, hi 는 깨짐\nprint("0번:", good(lo), "/ 19번:", good(hi))\nwhile hi - lo > 1:\n    mid = (lo + hi) // 2\n    if good(mid):\n        print(f"{mid}번 확인 → good")\n        lo = mid\n    else:\n        print(f"{mid}번 확인 → bad")\n        hi = mid\nprint(f"처음 깨진 버전: {hi}번")` } },
  ],
  summary: ['반으로 나누기(이분 탐색) — 데이터 · 코드 · 버전 어디에나, 1000 개도 10 번', '단계 사이에 assert 조건, "메시지" — 처음 틀린 단계 안에 버그', '최소 재현 예: 지워도 버그가 남으면 지운다 — 원인이 보이고, 질문 · 테스트에 그대로 쓴다'] },
{ id: 'D4', ch: 1, n: 4, title: '디버거', mode: 'text',
  tutorSummary: 'print 대신 원하는 줄에서 멈추고 그 순간의 변수를 다 보는 도구. VS Code(Python Debugger 확장, 파이썬 확장과 같이 깔림): 줄 번호 왼쪽 클릭 · F9 = 중단점(빨간 점), F5 → Python Debugger: Python File → 노란 줄(아직 실행 전). F5 계속 · F10 한 줄(Step Over) · F11 안으로(Step Into) · Shift+F11 밖으로 · Ctrl+Shift+F5 다시 · Shift+F5 멈추기. 왼쪽 칸 변수(VARIABLES, Locals/Globals, 값 더블클릭으로 바꾸기) · 조사식(WATCH, len(cart) · total > 30000) · 호출 스택(CALL STACK = 살아 있는 트레이스백, 위 칸 클릭하면 부른 쪽 변수). 디버그 콘솔에 식 계산. 중단점 오른쪽 클릭 Edit Breakpoint: Expression(조건 i == 737 · stock < 0) · Hit Count · Log Message(로그포인트 {i} {stock}, 멈추지 않는 print). 터미널: breakpoint() → (Pdb) 명령 p 식 · pp · n · s · r · c · l/ll · w · q, VS Code F5 로 돌리면 breakpoint() 도 VS Code 에서 멈춤. 다 보면 breakpoint() 지우기, 잠깐 끄기 PYTHONBREAKPOINT=0.',
  terms: { '디버거': '프로그램을 원하는 줄에서 멈추고, 한 줄씩 돌리며 그 순간의 변수 값을 보게 해 주는 도구', '중단점': '「여기서 멈춰」 표시. VS Code 에서는 줄 번호 왼쪽의 빨간 점이에요' },
  pages: [
    { title: '중단점 F9 · F5 로 실행 · F10 한 줄씩', html: `<p>print 는 「찍을 곳을 미리 정하고 다시 실행」 해야 해요. [[디버거]]는 프로그램을 <b>원하는 줄에서 멈추고</b>, 그 순간의 변수를 전부 보여 주고, 한 줄씩 앞으로 가게 해 줘요. VS Code 에 들어 있어요 — 파이썬 확장을 깔 때 같이 깔리는 <b>Python Debugger</b> 예요.</p>\n<ol><li>멈출 줄의 <b>줄 번호 왼쪽</b>을 클릭 → 빨간 점([[중단점]]). 커서가 있는 줄에서 <kbd>F9</kbd> 를 눌러도 돼요</li><li><kbd>F5</kbd> → 처음이면 「Python Debugger: Python File」 을 골라요 → 빨간 점 줄에서 멈추고 그 줄이 노랗게 칠해져요. 노란 줄은 <b>아직 실행 전</b>이에요</li><li>왼쪽 <b>변수(VARIABLES)</b> 칸에 지금 값이 다 보여요</li><li>위쪽에 뜬 작은 막대의 버튼(또는 키)으로 앞으로 가요</li></ol>\n<table class="kb"><tbody><tr><th>키</th><th>이름</th><th>하는 일</th></tr>\n<tr><td><kbd>F5</kbd></td><td>계속 (Continue)</td><td>다음 중단점까지 쭉</td></tr>\n<tr><td><kbd>F10</kbd></td><td>한 줄 (Step Over)</td><td>지금 줄을 실행하고 다음 줄에서 멈춤 — 함수는 안으로 안 들어가요</td></tr>\n<tr><td><kbd>F11</kbd></td><td>안으로 (Step Into)</td><td>지금 줄에서 부르는 함수 <b>안</b> 첫 줄로</td></tr>\n<tr><td><kbd>Shift</kbd>+<kbd>F11</kbd></td><td>밖으로 (Step Out)</td><td>지금 함수를 끝까지 돌고 부른 곳으로</td></tr>\n<tr><td><kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>F5</kbd></td><td>다시 시작</td><td>처음부터 다시</td></tr>\n<tr><td><kbd>Shift</kbd>+<kbd>F5</kbd></td><td>멈추기</td><td>디버깅 끝</td></tr></tbody></table>\n<p>예제를 <code>d4_step.py</code> 로 저장하고 <code>for t in temps:</code> 줄에 중단점을 찍은 뒤 <kbd>F5</kbd> → <kbd>F10</kbd> 을 눌러 가며 <code>best</code> 가 언제 바뀌는지 보세요. 첫 줄은 -3 이 나와야 하는데 0 이 나와요 — 변수 칸에서 <code>best</code> 가 처음부터 0 인 게 보이죠. 모두 음수면 한 번도 안 바뀌어요. 시작값을 <code>temps[0]</code> 로 바꾸면 돼요.</p>`,
      example: { code: `def warmest(temps):\n    best = 0\n    for t in temps:\n        if t > best:\n            best = t\n    return best\n\nprint(warmest([-5, -3, -8]))     # 기대: -3\nprint(warmest([3, 7, 5]))        # 기대: 7` } },
    { title: 'F11 안으로 · 호출 스택 · 조사식', html: `<p>멈춘 상태에서 왼쪽 칸 셋을 봐요.</p>\n<table class="kb"><tbody><tr><th>칸</th><th>보이는 것</th></tr>\n<tr><td><b>변수 (VARIABLES)</b></td><td>지금 함수의 지역 변수(Locals)와 전역 변수(Globals). 리스트 · 딕셔너리는 ▸ 를 눌러 펼쳐요. 값을 더블클릭하면 <b>바꿔 볼 수도</b> 있어요</td></tr>\n<tr><td><b>조사식 (WATCH)</b></td><td>+ 를 눌러 식을 적어 두면 멈출 때마다 계산해 줘요 — <code>len(cart)</code> · <code>total &gt; 30000</code></td></tr>\n<tr><td><b>호출 스택 (CALL STACK)</b></td><td>지금 「누가 누구를 불렀나」 — [[레슨:D1]] 의 트레이스백을 <b>살아 있는 채로</b> 보는 거예요. 아래 칸을 클릭하면 부른 쪽 함수의 변수로 바뀌어요</td></tr></tbody></table>\n<p>아래쪽 <b>디버그 콘솔(DEBUG CONSOLE)</b> 에는 파이썬 식을 쳐서 그 자리에서 계산해 볼 수 있어요: <code>cart[0]</code> · <code>type(price)</code> · <code>price * count</code>.</p>\n<p>예제에서 <code>total = add_item(total, item)</code> 줄에 중단점 → <kbd>F5</kbd> → <kbd>F11</kbd> 로 <code>add_item</code> 안으로 들어가 보세요. 호출 스택에 <code>add_item</code> 아래 <code>checkout</code> · <code>&lt;module&gt;</code> 이 쌓인 게 보여요. 변수 칸의 <code>count</code> 는 2 인데 <code>return</code> 줄에 count 가 없죠 — 개수를 곱하지 않았어요. 고칠 곳을 찾았으면 <kbd>Shift</kbd>+<kbd>F11</kbd> 로 밖으로 나와요.</p>`,
      example: { code: `def add_item(total, item):\n    name, price, count = item\n    return total + price          # 어디가 이상할까요?\n\ndef checkout(cart):\n    total = 0\n    for item in cart:\n        total = add_item(total, item)\n    return total\n\ncart = [("아메리카노", 4500, 2), ("케이크", 6500, 1)]\nprint("합계", checkout(cart), "(기대 15500)")` } },
    { title: '조건 중단점 stock < 0 · 로그포인트', html: `<p>반복이 1000 번 도는데 수백 번째쯤에서만 이상하면, 중단점에서 <kbd>F5</kbd> 를 수백 번 누를 수는 없죠. 빨간 점을 <b>오른쪽 클릭 → Edit Breakpoint…</b>(빈 줄 번호 왼쪽을 오른쪽 클릭하면 Add Conditional Breakpoint…) 에서 세 가지를 고를 수 있어요.</p>\n<table class="kb"><tbody><tr><th>고르는 것</th><th>하는 일</th></tr>\n<tr><td><b>Expression</b> (조건)</td><td>식이 참일 때만 멈춰요 — <code>i == 737</code> · <code>stock &lt; 0</code> · <code>name == "모카"</code></td></tr>\n<tr><td><b>Hit Count</b> (횟수)</td><td>그 줄을 N 번째 지날 때 멈춰요 — <code>737</code></td></tr>\n<tr><td><b>Log Message</b> (로그포인트)</td><td>멈추지 않고 디버그 콘솔에 글을 찍어요 — <code>{i} {stock}</code> 처럼 중괄호 안이 값. 코드를 안 고치는 print 예요</td></tr></tbody></table>\n<p>조건 중단점은 <b>「언제」 를 모를 때</b> 특히 좋아요. 「재고가 처음 음수가 되는 순간」 처럼 <b>결과의 모양</b>으로 조건을 걸면, 그 순간의 <code>i</code> 와 <code>n</code> 이 변수 칸에 보여요. 예제의 <code>history.append(stock)</code> 줄에 조건 <code>stock &lt; 0</code> 을 걸고 <kbd>F5</kbd> 해 보세요 — 맨 아래 줄이 찍는 번호와 같은 <code>i</code> 에서 멈춰요.</p>`,
      example: { code: `stock = 300\nhistory = []\nfor i in range(1000):\n    n = (i * 7) % 5                  # 주문 0~4 개 (가짜 데이터)\n    if i % 10 == 9:\n        stock += 15                  # 10 번마다 15 개 들어와요\n    stock -= n\n    history.append(stock)            # ← 여기에 조건 중단점 stock < 0\nprint("마지막 재고", stock)\nfirst = next(i for i, s in enumerate(history) if s < 0)\nprint("처음 음수가 된 번호", first)` } },
    { title: 'breakpoint() · pdb 명령 p n s c q', html: `<p>VS Code 없이 터미널에서도 멈출 수 있어요. 멈출 곳에 <code>breakpoint()</code> 한 줄을 넣고 <code>python 파일.py</code> 로 돌리면, 그 자리에서 <code>(Pdb)</code> 가 뜨고 명령을 기다려요. 파이썬에 들어 있는 디버거 <b>pdb</b> 예요. VS Code 의 <kbd>F5</kbd> 로 돌리면 <code>breakpoint()</code> 에서도 VS Code 디버거가 멈춰요.</p>\n<table class="kb"><tbody><tr><th>명령</th><th>하는 일</th></tr>\n<tr><td><code>p 식</code></td><td>값 찍기 — <code>p total</code> · <code>p cart[0]</code></td></tr>\n<tr><td><code>pp 식</code></td><td>긴 리스트 · 딕셔너리를 보기 좋게</td></tr>\n<tr><td><code>n</code></td><td>다음 줄 (VS Code 의 F10)</td></tr>\n<tr><td><code>s</code></td><td>함수 안으로 (F11)</td></tr>\n<tr><td><code>r</code></td><td>이 함수 끝까지 (Shift+F11 과 비슷)</td></tr>\n<tr><td><code>c</code></td><td>계속 — 다음 breakpoint() 까지 (F5)</td></tr>\n<tr><td><code>l</code> · <code>ll</code></td><td>지금 위치 근처 코드 · 함수 전체 보기</td></tr>\n<tr><td><code>w</code></td><td>호출 스택 (where)</td></tr>\n<tr><td><code>q</code></td><td>그만 — 프로그램도 끝나요</td></tr></tbody></table>\n<pre>&gt; C:\\debug-study\\shop.py(4)checkout()\n-&gt; for name, price, count in cart:\n(Pdb) p cart\n[('아메리카노', 4500, 2), ('케이크', 6500, 1)]\n(Pdb) n\n&gt; C:\\debug-study\\shop.py(5)checkout()\n-&gt; total += price\n(Pdb) n\n&gt; C:\\debug-study\\shop.py(4)checkout()\n-&gt; for name, price, count in cart:\n(Pdb) p total, count\n(4500, 2)\n(Pdb) c\n11000</pre>\n<p><code>p total, count</code> 에서 total 은 4500 인데 count 는 2 — 개수를 안 곱한 게 보여요. 파이썬 버전에 따라 <code>breakpoint()</code> 줄에서 멈추기도 하고 그다음 줄에서 멈추기도 해요.</p>\n<div class="bk-warn"><b>다 보면 breakpoint() 줄을 지워요</b> — 남겨 두면 그 프로그램을 쓰는 사람의 화면이 (Pdb) 에서 멈춰요. 잠깐 끄려면 환경 변수 <code>PYTHONBREAKPOINT=0</code> 을 줘요.</div>`,
      example: { code: `def checkout(cart):\n    total = 0\n    # breakpoint()     ← 앞의 # 을 지우고 터미널에서 python 으로 실행해 보세요\n    for name, price, count in cart:\n        total += price\n    return total\n\nprint(checkout([("아메리카노", 4500, 2), ("케이크", 6500, 1)]))` } },
  ],
  summary: ['줄 번호 왼쪽 클릭(F9) = 중단점, F5 실행 · F10 한 줄 · F11 안으로 · Shift+F11 밖으로', '변수 · 조사식 · 호출 스택 칸과 디버그 콘솔 — 조건 중단점 stock < 0 · 로그포인트는 「언제」 를 모를 때', '터미널은 breakpoint() → (Pdb) p · n · s · c · q, 다 보면 지우기'] },
{ id: 'D5', ch: 1, n: 5, title: '흔한 버그 도감', mode: 'text',
  tutorSummary: 'L22 「자주 나오는 논리 버그」(경계 · range 시작 · 반복 안 초기화 · // · b = a) 다음. 하나 차이(off-by-one): 1부터 n까지 range(1, n + 1), 마지막 칸 items[-1], 기둥과 칸(10m 에 2m 마다 기둥 6개), 나눠 담기 (n + per - 1) // per — 0개 · 1개 · 딱 나눠떨어짐 · 하나 넘침으로 손계산(경계값 D8). 가변 기본값 def f(tag, tags=[]) — 기본값은 def 할 때 한 번 만들어져 같은 리스트를 계속 씀(f.__defaults__ 로 보임), 고침 tags=None + if tags is None: tags = []. 얕은 복사: a.copy() · list(a) · a[:] 는 겉만, 안쪽 리스트는 같이 씀 → copy.deepcopy, [[0] * 3] * 3 은 같은 줄 셋 → [[0] * 3 for _ in range(3)], 의심되면 a[0] is b[0]. is = 같은 물건, == = 같은 값 — 값 비교는 언제나 ==, is 는 x is None 에만, 숫자 · 글자에 is 는 가끔 맞아서 고약함(3.8+ SyntaxWarning). 숫자: 0.1 + 0.2 != 0.3 → math.isclose · 돈은 원 단위 정수, -7 // 2 = -4(아래로) vs int(-7 / 2) = -3(0 쪽), round(2.5) = 2(짝수 쪽), 올림 math.ceil.',
  terms: { '하나 차이 버그': '경계에서 하나 많거나 적게 세는 버그(off-by-one). range 의 끝 · 칸 번호 · 「기둥과 칸」 에서 나요', '가변 객체': '만든 뒤에도 안을 바꿀 수 있는 값 — 리스트 · 딕셔너리 · 집합. 이름 둘이 같은 물건을 가리키면 한쪽에서 바꾼 게 다른 쪽에도 보여요', '얕은 복사': '겉 상자만 새로 만들고 안에 든 것은 같이 쓰는 복사. a.copy() · list(a) · a[:] 가 그래요' },
  pages: [
    { title: '하나 차이 — 기둥과 칸 · range(1, n + 1)', html: `<p>[[하나 차이 버그]]는 가장 흔한 버그예요. <a href="../python/#lesson/L22" target="_blank" rel="noopener">파이썬 교과서 「디버깅 사고법」 ↗</a> 에서 <code>range</code> 의 끝을 봤죠. 같은 모양이 여기저기 나와요.</p>\n<table class="kb"><tbody><tr><th>모양</th><th>틀린 코드</th><th>맞는 코드</th></tr>\n<tr><td>1부터 n까지</td><td><code>range(1, n)</code></td><td><code>range(1, n + 1)</code></td></tr>\n<tr><td>마지막 칸</td><td><code>items[len(items)]</code></td><td><code>items[-1]</code> 또는 <code>items[len(items) - 1]</code></td></tr>\n<tr><td>기둥과 칸 — 10m 에 2m 마다 기둥</td><td><code>10 // 2</code> → 5개</td><td><code>10 // 2 + 1</code> → 6개 (칸은 5, 기둥은 6)</td></tr>\n<tr><td>나눠 담기 — 23개를 10개씩</td><td><code>23 // 10</code> → 2쪽</td><td><code>(23 + 10 - 1) // 10</code> → 3쪽</td></tr>\n<tr><td>끝 번호 — 2쪽은 몇 번부터 몇 번?</td><td><code>p * 10</code> 부터</td><td><code>(p - 1) * 10 + 1</code> 부터 <code>min(p * 10, n)</code> 까지</td></tr></tbody></table>\n<p>잡는 법은 늘 같아요. <b>가장 작은 경우</b>를 손으로 세어 봐요 — 0개 · 1개 · 딱 나눠떨어질 때(20개) · 하나 넘칠 때(21개). 이 넷을 미리 넣어 보는 게 [[레슨:D8]] 의 경계값 테스트예요.</p>`,
      example: { code: `def pages(n, per):\n    return (n + per - 1) // per\n\nfor n in [0, 1, 10, 11, 20, 21, 23]:\n    print(n, "개 →", pages(n, 10), "쪽  (틀린 n // 10 은", n // 10, ")")` } },
    { title: 'tags=[] 기본값 — 한 번만 만들어져요', html: `<p>기본값이 리스트 · 딕셔너리 같은 [[가변 객체]]면 생기는 버그예요. 기본값은 <code>def</code> 를 실행할 때 <b>한 번</b> 만들어지고, 부를 때마다 <b>같은 리스트</b>를 다시 써요.</p>\n<pre>def add_tag(tag, tags=[]):\n    tags.append(tag)\n    return tags\n\nprint(add_tag("빨강"))     # ['빨강']\nprint(add_tag("파랑"))     # ['빨강', '파랑']  ← 새 리스트일 줄 알았는데!</pre>\n<p>고치는 법은 정해져 있어요 — 기본값은 <code>None</code>, 함수 안에서 새로 만들기.</p>\n<pre>def add_tag(tag, tags=None):\n    if tags is None:\n        tags = []\n    tags.append(tag)\n    return tags</pre>\n<p>예제의 <code>add_tag_bad.__defaults__</code> 는 함수가 품고 있는 기본값이에요. 두 번 부른 뒤 거기에 <code>['빨강', '파랑']</code> 이 들어 있는 게 보여요 — <code>a</code> 와 <code>b</code> 는 같은 물건이라 <code>a is b</code> 가 True 예요. 숫자 · 글자 · None · 튜플처럼 <b>못 바꾸는</b> 값은 기본값으로 써도 괜찮아요.</p>`,
      example: { code: `def add_tag_bad(tag, tags=[]):\n    tags.append(tag)\n    return tags\n\ndef add_tag(tag, tags=None):\n    if tags is None:\n        tags = []\n    tags.append(tag)\n    return tags\n\na = add_tag_bad("빨강")\nb = add_tag_bad("파랑")\nprint(a, b, a is b)\nprint(add_tag_bad.__defaults__)\n\nc = add_tag("빨강")\nd = add_tag("파랑")\nprint(c, d, c is d)` } },
    { title: 'a.copy() 는 겉만 · copy.deepcopy(a)', html: `<p><a href="../python/#lesson/L12C" target="_blank" rel="noopener">파이썬 교과서 「정렬과 복사」 ↗</a> 에서 <code>b = a</code> 는 복사가 아니고 <code>a.copy()</code> 로 복사한다고 했죠. 그런데 리스트 <b>안에 리스트</b>가 있으면 <code>copy()</code> 도 부족해요. <code>copy()</code> 는 [[얕은 복사]] — 겉 리스트만 새로 만들고 안쪽 리스트는 <b>같이 써요</b>.</p>\n<pre>a = [[1, 2], [3, 4]]\nb = a.copy()\nb[0].append(99)\nprint(a)        # [[1, 2, 99], [3, 4]]  ← a 도 바뀌었어요\nb.append([5])\nprint(a)        # [[1, 2, 99], [3, 4]]  ← 겉에 붙인 건 a 에 없어요</pre>\n<p>안쪽까지 다 새로 만들려면 <code>import copy</code> 하고 <code>copy.deepcopy(a)</code> 예요. 비슷한 함정: <code>[[0] * 3] * 3</code> 은 <b>같은 줄 하나</b>를 세 번 넣은 거라 한 칸을 바꾸면 세 줄이 다 바뀌어요. 표는 <code>[[0] * 3 for _ in range(3)]</code> 로 만들어요 — 줄마다 새 리스트예요.</p>\n<p>의심되면 <code>is</code> 로 물어봐요(다음 쪽). <code>a[0] is b[0]</code> 이 True 면 같은 물건을 같이 쓰는 중이에요.</p>`,
      example: { code: `import copy\n\na = [[1, 2], [3, 4]]\nshallow = a.copy()\ndeep = copy.deepcopy(a)\nshallow[0].append(99)\nprint("a      ", a)\nprint("deep   ", deep)\nprint(a[0] is shallow[0], a[0] is deep[0])\n\ngrid = [[0] * 3] * 3\ngrid[0][0] = 1\nprint("grid", grid)\ngood = [[0] * 3 for _ in range(3)]\ngood[0][0] = 1\nprint("good", good)` } },
    { title: 'a is b 는 같은 물건 · a == b 는 같은 값', html: `<p><code>==</code> 는 「값이 같나」, <code>is</code> 는 「<b>같은 물건</b>(같은 객체)인가」 예요.</p>\n<pre>a = [1, 2]\nb = [1, 2]\nc = a\nprint(a == b)   # True  — 값이 같아요\nprint(a is b)   # False — 다른 리스트 두 개\nprint(a is c)   # True  — 이름 둘, 물건 하나</pre>\n<ul><li>값을 비교할 때는 <b>언제나 <code>==</code></b>. 숫자 · 글자를 <code>is</code> 로 비교하면 어떤 때는 True, 어떤 때는 False 가 나와요 — 파이썬이 작은 수 · 짧은 글자를 <b>가끔</b> 같이 쓰기 때문이에요. 그래서 연습 땐 되다가 다른 입력에서 깨지는, 가장 고약한 버그가 돼요. 예제의 <code>int("1000")</code> 둘은 값은 같지만 다른 물건이에요</li><li><code>is</code> 는 <code>x is None</code> · <code>x is not None</code> 에만 써요. None 은 세상에 하나뿐이라 <code>is</code> 가 맞는 질문이에요</li><li><code>x is 5</code> 처럼 숫자 · 글자 그대로와 is 를 쓰면 파이썬이 <code>SyntaxWarning: "is" with … literal</code> 경고를 띄워 줘요 — 이 경고가 보이면 <code>==</code> 로 고쳐요</li></ul>`,
      example: { code: `a = int("1000")\nb = int("1000")\nprint(a == b, a is b)\n\ns = "".join(["라", "떼"])\nt = "라떼"\nprint(s == t, s is t)\n\nresult = None\nprint(result is None)` } },
    { title: '0.1 + 0.2 · -7 // 2 · round(2.5)', html: `<p>숫자 계산의 함정 셋이에요.</p>\n<pre>print(0.1 + 0.2)              # 0.30000000000000004\nprint(0.1 + 0.2 == 0.3)       # False\nprint(-7 // 2)                # -4  — 몫은 아래쪽으로 내려요\nprint(int(-7 / 2))            # -3  — int() 는 0 쪽으로 잘라요\nprint(round(2.5), round(3.5)) # 2 4 — .5 는 짝수 쪽으로</pre>\n<ul><li><b>소수는 2진수로 정확히 못 적어요</b> — 0.1 은 사실 0.1000000000000000055… 예요. 소수끼리 <code>==</code> 로 비교하지 말고 <code>math.isclose(a, b)</code>, 돈은 <b>원 단위 정수</b>로 계산하고 할인 같은 곱셈만 마지막에 <code>round</code> 해요</li><li><b><code>//</code> 와 <code>int()</code> 는 음수에서 달라요</b> — <code>//</code> 는 더 작은 쪽(−4), <code>int()</code> 는 0 쪽(−3)으로 잘라요. 양수만 다룰 때는 같아요</li><li><b><code>round</code> 는 .5 를 짝수 쪽으로</b> 보내요(2.5 → 2, 3.5 → 4). 무조건 올림이 필요하면 <code>math.ceil</code></li></ul>\n<p>평균에 <code>//</code> 를 써서 소수가 잘리는 버그는 <a href="../python/#lesson/L22" target="_blank" rel="noopener">파이썬 교과서 「디버깅 사고법」 ↗</a> 에서 봤죠. 이 쪽의 셋까지 알면 숫자 버그는 거의 다 알아본 거예요.</p>`,
      example: { code: `import math\n\ntotal = 0\nfor i in range(10):\n    total += 0.1                  # 0.1 을 열 번 더하기\nprint(total, total == 1.0, math.isclose(total, 1.0))\n\nwon = [4500, 4500, 6500]\ntotal_won = sum(won)\nprint("정수로:", total_won, "원")\nprint("10% 할인:", round(total_won * 0.9), "원")\n\nfor x in [-7, 7]:\n    print(x, "// 2 =", x // 2, "  int(x / 2) =", int(x / 2))\nprint([round(v) for v in [0.5, 1.5, 2.5, 3.5]])\nprint(math.ceil(2.1))` } },
  ],
  summary: ['하나 차이 — 0개 · 1개 · 딱 · 하나 넘침을 손으로 세기, 나눠 담기는 (n + per - 1) // per', '기본값에 [] 쓰지 않기(None 으로), copy() 는 겉만(안까지는 copy.deepcopy), 값은 == · None 만 is', '소수는 == 대신 math.isclose · 돈은 정수, -7 // 2 = -4 · round(2.5) = 2'] },
{ id: 'DB1', ch: 1, boss: true, title: '만들어 보기: 버그 사냥', mode: 'text',
  tutorSummary: '챕터 1 묶기 — 버그 여러 개가 숨은 프로그램 셋(카페 정산 · 성적표 · 재고 명령)을 재현 → 좁히기(트레이스백 · !r · logging · 반으로 나누기 · 디버거) → 고치기로 잡고, 버그마다 # 재현 · # 원인 · # 고침 세 줄 기록. 숨은 버그는 도감의 것들(하나 차이 · 끝 빈칸 KeyError · 가변 기본값 · // 평균 · 결석 ValueError · return 빠진 None · 별칭 정렬 · 되돌리기 별칭 · 경계 > · print(None 돌려주는 함수)). 마지막엔 고친 버그를 확인 함수로 남겨 옛 코드는 실패 · 새 코드는 통과(챕터 2 테스트 예고).', pages: [], summary: [] },
{ id: 'D6', ch: 2, n: 6, title: "테스트 함수 다시 보기", mode: 'text',
  tutorSummary: "파이썬 교과서 L21(assert · 테스트 함수 · 경계값)을 다시 가르치지 않고 링크. 테스트 하나는 준비 → 실행 → 확인 세 칸, 결과는 got · 기대는 want, 기대 값은 손으로 계산한 값(함수와 같은 계산 금지). 이름은 상황 + 기대(test_total_empty_cart_is_zero, 한글 이름도 됨), 테스트 하나에 상황 하나. assert got == want, f\"{got=} {want=}\" 로 단서 남기기, 길이 말고 통째로 비교, 소수는 math.isclose. 늘 통과하는 테스트 네 가지(assert 빠뜨림 · 괄호 없는 함수 · 괄호로 묶은 튜플 · 함수끼리 비교) — 새 테스트는 한 번 일부러 깨뜨려 보기. globals() 에서 test_ 함수를 모아 돌리는 작은 실행기 = pytest 가 할 일. python -O 는 assert 를 끄니 프로그램의 입력 검사는 if + raise.",
  terms: { "준비 · 실행 · 확인": "테스트 하나를 세 칸으로 나눠 쓰는 모양. 값을 만들고(준비), 함수를 한 번 부르고(실행), assert 로 비교해요(확인)", "테스트 실행기": "테스트 함수를 찾아 차례로 부르고 통과 · 실패를 세어 알려 주는 프로그램. pytest 가 대표예요" },
  pages: [
    { title: "assert got == want · 준비 → 실행 → 확인", html: `<p><a href="../python/#lesson/L21" target="_blank" rel="noopener">파이썬 교과서 「테스트 작성」 ↗</a> 에서 <code>assert</code> · 테스트 함수 · 경계값을 배웠어요. 여기서는 그걸 다시 설명하지 않고, 테스트를 <b>읽기 좋고 믿을 수 있게</b> 쓰는 모양을 다듬어요. 다음 레슨부터는 pytest 가 이 모양 그대로 테스트를 돌려 줘요.</p>\n<p>테스트 하나는 세 칸으로 써요([[준비 · 실행 · 확인]]).</p>\n<table class="kb"><tbody><tr><td><b>준비</b></td><td>넣을 값과 기대하는 값을 만들어요</td></tr><tr><td><b>실행</b></td><td>테스트할 함수를 <b>한 번</b> 불러요</td></tr><tr><td><b>확인</b></td><td>assert 로 결과와 기대를 비교해요</td></tr></tbody></table>\n<pre>def total_price(items):\n    return sum(price * qty for price, qty in items)\n\ndef test_total_price_two_items():\n    # 준비\n    items = [(1000, 2), (500, 1)]\n    want = 2500\n    # 실행\n    got = total_price(items)\n    # 확인\n    assert got == want</pre>\n<p>결과는 <code>got</code>(받은 값), 기대는 <code>want</code>(바라는 값)처럼 이름을 붙여 두면 assert 줄이 한눈에 읽혀요.</p>\n<div class="bk-warn"><b>기대 값은 손으로</b> — <code>want = sum(p * q for p, q in items)</code> 처럼 함수와 <b>같은 계산</b>을 또 하면, 둘이 같이 틀려도 통과해요. 기대 값은 손으로 계산한 숫자 <code>2500</code> 을 그대로 적어요.</div>`,
      example: { code: `def total_price(items):\n    return sum(price * qty for price, qty in items)\n\ndef test_total_price_two_items():\n    # 준비\n    items = [(1000, 2), (500, 1)]\n    want = 2500\n    # 실행\n    got = total_price(items)\n    # 확인\n    assert got == want\n\ntest_total_price_two_items()\nprint("통과: test_total_price_two_items")` } },
    { title: "test_빈_장바구니면_0원 — 이름은 문장처럼", html: `<p>테스트가 실패하면 제일 먼저 보이는 건 <b>이름</b>이에요. 이름만 보고 「무엇이 · 어떤 상황에서 · 어떻게 되어야 하는데」 깨졌는지 알 수 있게 지어요.</p>\n<table class="kb"><tbody><tr><th>이름</th><th>어때요</th><th>왜</th></tr><tr><td><code>test_1</code></td><td>나빠요</td><td>무엇을 보는지 몰라요</td></tr><tr><td><code>test_total</code></td><td>아쉬워요</td><td>어떤 상황인지 없어요</td></tr><tr><td><code>test_total_empty_cart_is_zero</code></td><td>좋아요</td><td>상황(빈 장바구니) + 기대(0)</td></tr><tr><td><code>test_빈_장바구니면_0원</code></td><td>좋아요</td><td>파이썬은 한글 이름도 돼요</td></tr></tbody></table>\n<p>이름에 상황을 넣으려면 테스트 하나가 <b>상황 하나만</b> 봐야 해요. 한 테스트에 assert 를 여러 개 넣으면, 첫 번째가 깨지는 순간 나머지는 돌지도 않아서 무엇이 더 깨졌는지 몰라요.</p>\n<pre># 한 테스트에 상황 셋 — 첫 assert 에서 멈추면 나머지는 몰라요\ndef test_total():\n    assert total_price([]) == 0\n    assert total_price([(1000, 2)]) == 2000\n    assert total_price([(1000, 2), (500, 1)]) == 2500\n\n# 상황마다 하나씩 — 무엇이 깨졌는지 이름이 말해요\ndef test_total_empty_cart_is_zero():\n    assert total_price([]) == 0\n\ndef test_total_one_item_times_qty():\n    assert total_price([(1000, 2)]) == 2000</pre>\n<p>함수 이름은 <code>t.__name__</code> 으로 꺼낼 수 있어요. 실행기가 「어느 테스트가 깨졌는지」 알려 줄 때 이 이름을 써요. 팀에서 영어 이름을 쓰면 영어로, 혼자 공부할 땐 한글도 괜찮아요. <b>한 파일 안에서는 한 가지로</b> 맞춰요.</p>`,
      example: { code: `def total_price(items):\n    return sum(price * qty for price, qty in items)\n\ndef test_total_empty_cart_is_zero():\n    assert total_price([]) == 0\n\ndef test_total_one_item_times_qty():\n    assert total_price([(1000, 2)]) == 2000\n\ndef test_여러_물건이면_모두_더해요():\n    assert total_price([(1000, 2), (500, 1)]) == 2500\n\ntests = [test_total_empty_cart_is_zero, test_total_one_item_times_qty, test_여러_물건이면_모두_더해요]\nfor t in tests:\n    t()\n    print("통과:", t.__name__)` } },
    { title: "f\"{got=}\" 메시지 — 실패에 단서 남기기", html: `<p>assert 만 있으면 실패해도 <code>AssertionError</code> 한 줄뿐이라 <b>무슨 값이 나왔는지</b> 몰라요. 메시지에 [[레슨:D2]] 의 <code>f"{got=}"</code> 를 쓰면 이름과 값이 같이 찍혀요.</p>\n<pre>def average(nums):\n    return sum(nums) // len(nums)    # 버그: // 는 소수를 버려요\n\ngot = average([1, 2])\nwant = 1.5\nassert got == want, f"{got=} {want=}"</pre>\n<pre>AssertionError: got=1 want=1.5</pre>\n<p>값은 <b>통째로</b> 비교해요. 길이나 일부만 보면 나머지가 틀려도 지나가요.</p>\n<pre>counts = {"a": 2, "b": 1}\nassert len(counts) == 2               # 약해요 — {"a": 9, "b": 9} 도 통과\nassert counts == {"a": 2, "b": 1}     # 강해요 — 하나라도 다르면 실패</pre>\n<div class="bk-warn"><b>소수는 == 로 비교하지 않아요</b> — <code>0.1 + 0.2 == 0.3</code> 은 False 예요([[레슨:D5]] 의 부동소수점). <code>math.isclose(got, want)</code> 로 「거의 같은지」 를 보거나, 다음 레슨의 <code>pytest.approx</code> 를 써요.</div>`,
      example: { code: `import math\n\ndef average(nums):\n    return sum(nums) // len(nums)\n\ngot = average([1, 2])\nwant = 1.5\ntry:\n    assert got == want, f"{got=} {want=}"\nexcept AssertionError as e:\n    print("실패:", e)\n\nprint(0.1 + 0.2 == 0.3)\nprint(math.isclose(0.1 + 0.2, 0.3))` } },
    { title: "늘 통과하는 테스트 — assert 빠뜨리기 · 괄호", html: `<p>테스트도 코드라서 틀릴 수 있어요. 제일 무서운 건 <b>절대 실패하지 않는 테스트</b>예요. 버그가 있어도 「통과」 라고 해서 안심하게 만들거든요. 흔한 모양 네 가지예요.</p>\n<pre>def is_even(n):\n    return True                          # 버그: 늘 True\n\ndef test_forgot_assert():\n    is_even(3) == False                  # ① assert 가 없어요\n\ndef test_forgot_call():\n    assert is_even                       # ② 괄호가 없어요\n\ndef test_tuple():\n    assert (is_even(3) == False, "홀수")  # ③ 괄호로 묶었어요\n\ndef test_same_calc():\n    assert is_even(3) == is_even(3)      # ④ 함수끼리 비교해요</pre>\n<ol><li><b>assert 가 없어요</b> — 비교만 하고 결과를 버려요. 아무것도 검사하지 않아요</li><li><b>괄호가 없어요</b> — <code>is_even</code> 은 부르지 않은 함수 그 자체라서 늘 참이에요</li><li><b>괄호로 묶었어요</b> — <code>(값, "글")</code> 은 튜플이고, 빈 튜플이 아니면 늘 참이에요. 파이썬도 <code>SyntaxWarning: assertion is always true</code> 경고를 띄워 줘요</li><li><b>함수끼리 비교해요</b> — 같은 함수를 두 번 불러 비교하면 같이 틀려도 같아요</li></ol>\n<p>네 테스트 모두 통과하지만 is_even 은 엉터리예요. 제대로 쓴 한 줄은 바로 깨져요.</p>\n<pre>def test_odd_is_not_even():\n    assert not is_even(3)    # 실패 — 버그를 잡았어요</pre>\n<p>그래서 새 테스트를 쓰면 <b>한 번은 일부러 깨뜨려 봐요</b>. 기대 값을 살짝 바꿔 실패가 나는지 보고 되돌리면, 그 테스트가 정말 무언가를 검사한다는 걸 알 수 있어요. [[레슨:D11]] 의 「빨강부터」 가 이 습관이에요.</p>`,
      example: { code: `def is_even(n):\n    return True\n\ndef test_forgot_assert():\n    is_even(3) == False\n\ndef test_forgot_call():\n    assert is_even\n\ndef test_tuple():\n    assert (is_even(3) == False, "홀수")\n\ndef test_same_calc():\n    assert is_even(3) == is_even(3)\n\ndef test_odd_is_not_even():\n    assert not is_even(3), "3 은 짝수가 아니에요"\n\ntests = [test_forgot_assert, test_forgot_call, test_tuple, test_same_calc, test_odd_is_not_even]\nfor t in tests:\n    try:\n        t()\n        print("통과", t.__name__)\n    except AssertionError as e:\n        print("실패", t.__name__, "—", e)` } },
    { title: "test_ 로 시작하면 모아 돌리기 — 작은 실행기", html: `<p>테스트 함수가 늘면 리스트에 하나씩 적는 것도 일이에요. 「이름이 <code>test_</code> 로 시작하는 함수를 전부 찾아 부르기」 를 직접 만들어 보면, 다음 레슨의 pytest 가 무슨 일을 해 주는지 보여요.</p>\n<pre>for name, func in list(globals().items()):\n    if name.startswith("test_") and callable(func):\n        try:\n            func()\n            print("PASS", name)\n        except AssertionError as e:\n            print("FAIL", name, e)</pre>\n<ul><li><code>globals()</code> 는 이 파일에 만든 「이름 → 값」 딕셔너리예요. 함수도 값이라 들어 있어요</li><li><code>list(…)</code> 로 먼저 복사해요. 도는 중에 name · func 같은 새 이름이 생기면 딕셔너리 크기가 바뀌어 <code>RuntimeError</code> 가 나거든요</li><li><code>callable(func)</code> 는 「부를 수 있는 것인가」 — test_ 로 시작하는 변수는 건너뛰어요</li><li><code>except AssertionError as e</code> 의 e 에는 assert 메시지가 담겨요</li></ul>\n<p>이게 [[테스트 실행기]]예요. pytest 는 여기에 「test_ 파일 찾기 · 실패한 줄과 값 보여 주기 · 골라 돌리기」 를 더한 거예요.</p>\n<div class="bk-warn"><b>assert 는 테스트에만</b> — <code>python -O 파일.py</code> 로 돌리면 assert 줄은 통째로 꺼져요. 프로그램 안에서 「입력이 이상하면 멈추기」 는 assert 대신 <code>if …: raise ValueError(…)</code> 로 써요(<a href="../python/#lesson/L15C" target="_blank" rel="noopener">파이썬 교과서 「내 예외 만들기: raise」 ↗</a>).</div>`,
      example: { code: `def clamp(x, lo, hi):\n    if x < lo:\n        return lo\n    if x > hi:\n        return lo          # 버그: hi 여야 해요\n    return x\n\ndef test_clamp_inside_stays():\n    assert clamp(5, 0, 10) == 5\n\ndef test_clamp_below_goes_to_lo():\n    assert clamp(-3, 0, 10) == 0\n\ndef test_clamp_above_goes_to_hi():\n    got = clamp(99, 0, 10)\n    assert got == 10, f"{got=}"\n\npassed = failed = 0\nfor name, func in list(globals().items()):\n    if name.startswith("test_") and callable(func):\n        try:\n            func()\n            print("PASS", name)\n            passed += 1\n        except AssertionError as e:\n            print("FAIL", name, e)\n            failed += 1\nprint(f"통과 {passed} · 실패 {failed}")` } },
  ],
  summary: ["테스트 하나 = 준비 → 실행 → 확인, 기대 값은 손으로 계산한 값", "이름은 상황 + 기대, 테스트 하나에 상황 하나, 실패엔 f\"{got=}\"", "한 번은 일부러 깨뜨려 보기 — 늘 통과하는 테스트는 버그를 숨긴다"] },
{ id: 'D7', ch: 2, n: 7, title: "pytest 시작", mode: 'text',
  tutorSummary: "pytest = 앞 레슨의 작은 실행기를 제대로 만든 도구(가상 환경에 python -m pip install pytest). 규칙: test_*.py(또는 *_test.py) 파일의 test_ 함수, 확인은 그냥 assert. python -m pytest -q 로 폴더 전부(지금 가상 환경의 파이썬 · 지금 폴더가 import 경로). 화면: 점 = 통과, F = 실패(테스트 안의 에러도 F), > 줄 = 깨진 줄, E 줄 = 양쪽 값과 where, 파일:줄, short test summary, 마지막 줄 n failed, m passed in 시간. pytest 는 assert 를 고쳐 써서 메시지 없이도 값이 보임. 소수는 pytest.approx. 옵션 -v(이름마다) · -k \"식\"(이름으로 고르기, and · or · not) · -x(첫 실패에서 멈춤) · --tb=short · 파일::함수. pytest.main([...]) 은 파이썬에서 부르기, 돌려준 값 0 = 전부 통과 · 1 = 실패 있음. 이 교과서 예시 답의 꼬리: 화면을 StringIO 에 담고 실패 이름과 마지막 줄(시간 뺀)만 찍음.",
  terms: { "pytest": "파이썬 테스트 도구. test_ 로 시작하는 파일 · 함수를 찾아 돌리고, 실패하면 어느 줄에서 어떤 값이 달랐는지 보여 줘요" },
  pages: [
    { title: "test_*.py 와 python -m pytest -q", html: `<p>[[pytest]] 는 앞 레슨에서 만든 작은 실행기를 제대로 만든 도구예요. 시작하기에서 가상 환경에 <code>python -m pip install pytest</code> 로 깔았어요. 규칙은 이름 두 개뿐이에요.</p>\n<table class="kb"><tbody><tr><td><b>파일</b></td><td><code>test_</code> 로 시작하는 .py(<code>test_calc.py</code>). <code>calc_test.py</code> 처럼 끝나도 돼요</td></tr><tr><td><b>함수</b></td><td>그 안에서 <code>test_</code> 로 시작하는 함수</td></tr><tr><td><b>확인</b></td><td>그냥 <code>assert</code> — 따로 배울 함수가 없어요</td></tr></tbody></table>\n<pre>debug-study/\n├─ calc.py          ← 테스트할 코드\n└─ test_calc.py     ← 테스트</pre>\n<p><b>calc.py</b></p><pre>def add(a, b):\n    return a + b\n\n\ndef average(nums):\n    return sum(nums) / len(nums)</pre>\n<p><b>test_calc.py</b></p><pre>from calc import add, average\n\n\ndef test_add_two_numbers():\n    assert add(2, 3) == 5\n\n\ndef test_add_negative():\n    assert add(-1, 1) == 0\n\n\ndef test_average_two():\n    assert average([1, 2]) == 1.5</pre>\n<p>VS Code 터미널(가상 환경이 켜진 곳)에서 쳐요.</p>\n<pre>(.venv) PS C:\\debug-study&gt; python -m pytest -q\n...                                                          [100%]\n3 passed in 0.01s</pre>\n<ul><li>점 하나가 통과한 테스트 하나예요. 실패는 <code>F</code> 예요</li><li>마지막 줄은 개수와 걸린 시간 — 시간은 돌릴 때마다 조금씩 달라요</li><li><code>pytest</code> 만 쳐도 되지만 <code>python -m pytest</code> 로 치면 <b>지금 켠 가상 환경의 파이썬</b>으로 돌고, 지금 폴더를 import 경로에 넣어 줘서 <code>from calc import add</code> 가 바로 돼요(<a href="../python/#lesson/L16C" target="_blank" rel="noopener">파이썬 교과서 「내 모듈과 패키지」 ↗</a>)</li><li>폴더를 안 주면 지금 폴더와 그 아래를 <b>전부</b> 뒤져요. <code>python -m pytest -q test_calc.py</code> 처럼 파일 하나만 줄 수도 있어요</li></ul>\n<p>아래 예제는 함수와 테스트를 한 파일에 둔 거예요. <code>test_first.py</code> 로 저장하고 같은 명령으로 돌려 보세요. <code>python test_first.py</code> 로 돌리면 함수만 만들고 끝나서 아무것도 안 나와요 — 테스트를 부르는 건 pytest 예요.</p>`,
      example: { code: `def add(a, b):\n    return a + b\n\n\ndef average(nums):\n    return sum(nums) / len(nums)\n\n\ndef test_add_two_numbers():\n    assert add(2, 3) == 5\n\n\ndef test_add_negative():\n    assert add(-1, 1) == 0\n\n\ndef test_average_two():\n    assert average([1, 2]) == 1.5`, label: "예제 코드 — test_first.py 로 저장하고 python -m pytest -q" } },
    { title: "실패 화면 읽기 — E assert 1 == 1.5", html: `<p>calc.py 의 average 를 <code>//</code> 로 잘못 고쳤다고 해 봐요. pytest 화면은 이렇게 나와요.</p>\n<pre>(.venv) PS C:\\debug-study&gt; python -m pytest -q\n..F                                                          [100%]\n============================ FAILURES ============================\n________________________ test_average_two ________________________\n\n    def test_average_two():\n&gt;       assert average([1, 2]) == 1.5\nE       assert 1 == 1.5\nE        +  where 1 = average([1, 2])\n\ntest_calc.py:13: AssertionError\n==================== short test summary info =====================\nFAILED test_calc.py::test_average_two - assert 1 == 1.5\n1 failed, 2 passed in 0.03s</pre>\n<table class="kb"><tbody><tr><td><code>..F</code></td><td>세 번째 테스트가 실패</td></tr><tr><td><code>&gt;</code> 줄</td><td>깨진 줄 — 테스트 코드 그대로</td></tr><tr><td><code>E</code> 줄</td><td>양쪽 값. <code>1 == 1.5</code> 가 거짓이고, 1 은 <code>average([1, 2])</code> 가 돌려준 값이에요</td></tr><tr><td><code>test_calc.py:13</code></td><td>테스트 파일의 13번째 줄 — VS Code 에서 Ctrl+클릭하면 그 줄로 가요</td></tr><tr><td><code>FAILED …</code></td><td>맨 아래 요약. 실패가 여러 개면 여기 다 모여요</td></tr></tbody></table>\n<p>앞 레슨에서는 <code>f"{got=}"</code> 메시지를 붙여야 값이 보였는데, pytest 는 assert 줄을 읽어서 <b>양쪽 값을 알아서</b> 보여 줘요. 메시지는 「왜 이 값이어야 하는지」 같은 설명이 필요할 때만 붙이면 돼요.</p>\n<p>테스트 안에서 assert 말고 다른 에러(<code>ZeroDivisionError</code> 같은)가 나도 F 예요. 그때는 E 줄에 에러 이름과 설명이 나와요. [[레슨:D1]] 의 트레이스백처럼 <b>맨 아래부터</b> 읽어요.</p>\n<p>소수는 [[레슨:D6]] 에서 본 것처럼 == 가 위험해요. pytest 에는 <code>pytest.approx</code> 가 있어요.</p>\n<pre>assert price_with_vat(1000) == 1100                  # 실패: 1100.0000000000002\nassert price_with_vat(1000) == pytest.approx(1100)   # 통과: 거의 같아요</pre>`,
      example: { code: `import pytest\n\n\ndef average(nums):\n    return sum(nums) // len(nums)    # 버그\n\n\ndef price_with_vat(price):\n    return price * 1.1\n\n\ndef test_average_two():\n    assert average([1, 2]) == 1.5\n\n\ndef test_vat_exact():\n    assert price_with_vat(1000) == 1100\n\n\ndef test_vat_approx():\n    assert price_with_vat(1000) == pytest.approx(1100)`, label: "예제 코드 — test_fail.py 로 저장하고 python -m pytest -q 로 실패 화면 보기" } },
    { title: "-k 이름 · -x 첫 실패에서 멈추기", html: `<p>테스트가 많아지면 지금 고치는 것만 돌리고 싶어요. 자주 쓰는 옵션이에요.</p>\n<table class="kb"><tbody><tr><th>옵션</th><th>하는 일</th></tr><tr><td><code>-q</code></td><td>짧게(점만). 이 교과서는 늘 이걸로</td></tr><tr><td><code>-v</code></td><td>테스트마다 이름과 PASSED · FAILED 한 줄씩</td></tr><tr><td><code>-k add</code></td><td>이름에 add 가 들어간 테스트만</td></tr><tr><td><code>-k "add and not negative"</code></td><td>and · or · not 으로 섞기</td></tr><tr><td><code>-x</code></td><td>첫 실패에서 바로 멈추기</td></tr><tr><td><code>--tb=short</code></td><td>실패 화면을 짧게</td></tr><tr><td><code>test_calc.py::test_average_two</code></td><td>테스트 하나만 콕 집어서</td></tr></tbody></table>\n<pre>&gt; python -m pytest -q -k add\n..                                                           [100%]\n2 passed, 1 deselected in 0.01s</pre>\n<p><code>deselected</code> 는 「골라내서 안 돌린 것」 이에요. 이름을 잘 지어 두면([[레슨:D6]]) <code>-k empty</code> 처럼 상황으로 골라 돌릴 수 있어요.</p>\n<pre>&gt; python -m pytest -v -x\ntest_calc.py::test_add_two_numbers PASSED                   [ 33%]\ntest_calc.py::test_add_negative PASSED                      [ 66%]\ntest_calc.py::test_average_two FAILED                       [100%]\n…\n!!!!!!!!!!!!!!!!!!!! stopping after 1 failures !!!!!!!!!!!!!!!!!!!!\n================= 1 failed, 2 passed in 0.02s ==================</pre>\n<p><code>-x</code> 는 실패가 우르르 나올 때 좋아요. 대개 <b>첫 실패</b>가 원인이고 나머지는 그 여파라서, 하나씩 고치며 다시 돌려요.</p>`,
      example: { shell: `python -m pytest -q\npython -m pytest -q -k add\npython -m pytest -q -k "add and not negative"\npython -m pytest -v -x\npython -m pytest -q test_calc.py::test_average_two`, label: "예제 명령 — VS Code 터미널에서(가상 환경을 켜고)" } },
    { title: "pytest.main([...]) — 파이썬에서 부르기", html: `<p><code>pytest.main(["-q", "test_calc.py"])</code> 은 터미널에서 <code>python -m pytest -q test_calc.py</code> 를 친 것과 같아요. 끝나면 숫자를 돌려줘요. <code>0</code> 이면 전부 통과, <code>1</code> 이면 실패가 있다는 뜻이에요. 터미널의 pytest 도 같은 숫자로 끝나서, CI 가 이 숫자로 성공 · 실패를 판단해요([[레슨:D14]]).</p>\n<p>이 교과서의 「만들어 보기」 예시 답은 테스트 파일 맨 아래에 이런 <b>꼬리</b>를 붙여요. pytest 화면에는 <code>in 0.01s</code> 처럼 걸린 시간이 찍혀서 매번 달라지니까, 화면은 담아만 두고 <b>실패한 테스트 이름과 마지막 줄의 개수</b>만 찍어요.</p>\n<pre>if __name__ == "__main__":\n    import contextlib, io\n    buf = io.StringIO()\n    with contextlib.redirect_stdout(buf):\n        pytest.main(["-q", "-p", "no:cacheprovider", __file__])\n    lines = buf.getvalue().splitlines()\n    for line in lines:\n        if line.startswith("FAILED"):\n            print("실패:", line.split("::")[1].split(" - ")[0])\n    print(lines[-1].rsplit(" in ", 1)[0])</pre>\n<ul><li><code>if __name__ == "__main__":</code> — <code>python test_calc.py</code> 로 직접 돌릴 때만 이 아래가 돌아요. pytest 가 이 파일을 읽을 때는 안 돌아요</li><li><code>__file__</code> 은 이 파일 자신의 경로 — 「이 파일을 pytest 로 돌려」</li><li><code>-p no:cacheprovider</code> — 폴더에 <code>.pytest_cache</code> 를 만들지 않게</li><li><code>contextlib.redirect_stdout(buf)</code> — 그동안 화면으로 나갈 글을 <code>io.StringIO()</code>(글자 상자)에 담아요</li><li><code>"FAILED test_calc.py::test_average_two - …"</code> 줄에서 <code>::</code> 뒤 · <code> - </code> 앞만 잘라 이름을 찍어요</li></ul>\n<p>꼬리는 확인용이에요. 공부할 때는 터미널에서 <code>python -m pytest -q</code> 로 진짜 화면을 보세요. 꼬리가 있어도 pytest 로 돌리는 데는 아무 상관 없어요.</p>`,
      example: { code: `import pytest\n\n\ndef average(nums):\n    return sum(nums) // len(nums)    # 버그\n\n\ndef test_average_whole():\n    assert average([2, 4]) == 3\n\n\ndef test_average_two():\n    assert average([1, 2]) == 1.5\n\n\ndef test_average_one():\n    assert average([7]) == 7\n\nif __name__ == "__main__":\n    import contextlib, io\n    buf = io.StringIO()\n    with contextlib.redirect_stdout(buf):\n        pytest.main(["-q", "-p", "no:cacheprovider", __file__])\n    lines = buf.getvalue().splitlines()\n    for line in lines:\n        if line.startswith("FAILED"):\n            print("실패:", line.split("::")[1].split(" - ")[0])\n    print(lines[-1].rsplit(" in ", 1)[0])`, label: "예제 코드 — python 으로 돌려도 · python -m pytest -q 로 돌려도 돼요" } },
  ],
  summary: ["test_*.py 의 test_ 함수 + 그냥 assert → python -m pytest -q", "실패 화면은 > 줄(깨진 줄) · E 줄(양쪽 값) · 파일:줄, 소수는 pytest.approx", "-k 이름으로 고르기 · -x 첫 실패에서 멈추기 · pytest.main 은 0 = 전부 통과"] },
{ id: 'D8', ch: 2, n: 8, title: "경계값과 같은 무리 나누기", mode: 'text',
  tutorSummary: "모든 입력을 넣을 수 없으니 같은 규칙을 따르는 값끼리 무리를 나누고(등가 분할) 무리마다 대표값 하나 — 잘못된 값(음수 등)도 한 무리. 버그는 무리 사이에서 나서(< 와 <= 혼동) 경계마다 양쪽 값 둘(7 · 8, 19 · 20, 64 · 65, -1 · 0). 대표값은 다 맞는데 경계 하나만 틀리는 예. 목록 · 글자는 빈 것 · 하나 · 둘 · 많이(+ 처음 · 끝 · 중복), 가장 작은 실패 예가 고치기 쉬움(D3 최소 재현). 경우를 (입력, 기대, 이유) 표로 두고 돌리면 빠진 무리가 보이고 한 줄로 더함 — 다음 레슨 parametrize 가 이 표를 받음. 파이썬 L21 의 경계값을 모든 무리 사이로 넓힌 것.",
  terms: { "등가 분할": "입력을 「같은 규칙을 따르는 무리」 로 나누고 무리마다 대표값 하나만 테스트하는 방법. 같은 무리 나누기라고도 불러요", "경계값 분석": "무리와 무리 사이(규칙이 바뀌는 곳)의 양쪽 값을 골라 테스트하는 방법" },
  pages: [
    { title: "같은 무리 나누기 — 무리마다 하나씩", html: `<p>놀이공원 입장료 규칙이에요.</p>\n<table class="kb"><tbody><tr><th>무리</th><th>나이</th><th>입장료</th><th>대표값</th></tr><tr><td>어린이</td><td>0~7</td><td>0원</td><td>5</td></tr><tr><td>청소년</td><td>8~19</td><td>5000원</td><td>15</td></tr><tr><td>어른</td><td>20~64</td><td>10000원</td><td>40</td></tr><tr><td>어르신</td><td>65~</td><td>3000원</td><td>70</td></tr><tr><td>잘못된 값</td><td>음수</td><td>ValueError</td><td>-1</td></tr></tbody></table>\n<p>나이는 수백 가지인데 다 넣어 볼 수는 없어요. <b>같은 규칙을 따르는 값끼리는 결과도 같은 모양</b>이라, 무리마다 하나만 넣어도 돼요. 이걸 [[등가 분할]](같은 무리 나누기)이라고 해요. 15살이 맞으면 16살도 맞을 거라고 믿는 거예요.</p>\n<pre>def ticket_price(age):\n    if age &lt; 0:\n        raise ValueError("나이는 0 이상")\n    if age &lt;= 7:\n        return 0\n    if age &lt;= 19:\n        return 5000\n    if age &lt;= 64:\n        return 10000\n    return 3000\n\nprint(ticket_price(5))    # 0\nprint(ticket_price(15))   # 5000\nprint(ticket_price(40))   # 10000\nprint(ticket_price(70))   # 3000</pre>\n<p><b>잘못된 값도 한 무리</b>예요. 「틀린 입력이 오면 어떻게 되어야 하나」 도 정해 두고 테스트해요. 에러가 나는지 확인하는 테스트는 [[레슨:D10]] 에서 pytest 로 깔끔하게 써요.</p>`,
      example: { code: `def ticket_price(age):\n    if age < 0:\n        raise ValueError("나이는 0 이상")\n    if age <= 7:\n        return 0\n    if age <= 19:\n        return 5000\n    if age <= 64:\n        return 10000\n    return 3000\n\ngroups = [("어린이", 5), ("청소년", 15), ("어른", 40), ("어르신", 70)]\nfor name, age in groups:\n    print(f"{name} {age}살 → {ticket_price(age)}원")\ntry:\n    ticket_price(-1)\nexcept ValueError as e:\n    print("잘못된 값 -1살 →", e)` } },
    { title: "경계값 — 7 · 8, 19 · 20, 64 · 65", html: `<p>대표값은 무리 <b>가운데</b>를 보지만, 버그는 대부분 무리 <b>사이</b>에서 나요. <code>&lt;</code> 와 <code>&lt;=</code> 를 헷갈리면 가운데 값은 다 맞고 딱 경계 하나만 틀리거든요. 그래서 경계마다 <b>양쪽 값 둘</b>을 넣어요([[경계값 분석]]). <a href="../python/#lesson/L21" target="_blank" rel="noopener">파이썬 교과서 「테스트 작성」 ↗</a> 의 경계값 쪽과 같은 생각을 <b>모든 무리 사이</b>에 하는 거예요.</p>\n<pre>def ticket_price(age):        # 버그가 하나 숨어 있어요\n    if age &lt; 0:\n        raise ValueError("나이는 0 이상")\n    if age &lt;= 7:\n        return 0\n    if age &lt;= 19:\n        return 5000\n    if age &lt;= 65:\n        return 10000\n    return 3000\n\nfor age in [5, 15, 40, 70]:         # 대표값 — 다 맞아요\n    print(age, ticket_price(age))\nfor age in [7, 8, 19, 20, 64, 65]:  # 경계값 — 65 에서 잡혀요\n    print(age, ticket_price(age))</pre>\n<p>위 함수는 어른 줄이 <code>age &lt;= 65</code> 라서 65살이 10000원이에요. 대표값 넷은 전부 맞아서, 대표값만 넣었다면 몰랐을 버그예요.</p>\n<table class="kb"><tbody><tr><th>경계</th><th>넣을 값</th></tr><tr><td>잘못된 값 | 어린이</td><td>-1, 0</td></tr><tr><td>어린이 | 청소년</td><td>7, 8</td></tr><tr><td>청소년 | 어른</td><td>19, 20</td></tr><tr><td>어른 | 어르신</td><td>64, 65</td></tr></tbody></table>\n<p>규칙 글(「65세 이상」)과 코드(<code>&lt;= 64</code>)가 <b>다른 말로</b> 같은 경계를 쓰고 있을 때 특히 잘 틀려요. 경계 표를 만들면 둘을 맞춰 보게 돼요.</p>`,
      example: { code: `def ticket_price(age):\n    if age < 0:\n        raise ValueError("나이는 0 이상")\n    if age <= 7:\n        return 0\n    if age <= 19:\n        return 5000\n    if age <= 65:\n        return 10000\n    return 3000\n\nwant = {5: 0, 15: 5000, 40: 10000, 70: 3000,\n        0: 0, 7: 0, 8: 5000, 19: 5000, 20: 10000, 64: 10000, 65: 3000}\n\nprint("대표값")\nfor age in [5, 15, 40, 70]:\n    got = ticket_price(age)\n    print(f"  {age}살 → {got}원", "OK" if got == want[age] else f"틀림 (기대 {want[age]}원)")\nprint("경계값")\nfor age in [0, 7, 8, 19, 20, 64, 65]:\n    got = ticket_price(age)\n    print(f"  {age}살 → {got}원", "OK" if got == want[age] else f"틀림 (기대 {want[age]}원)")` } },
    { title: "빈 것 · 하나 · 많이 — [] · [5] · [1, 2]", html: `<p>목록 · 글자를 받는 함수에도 경계가 있어요. <b>개수</b>가 경계예요.</p>\n<table class="kb"><tbody><tr><th>개수</th><th>예</th><th>잘 숨는 버그</th></tr><tr><td>0개</td><td><code>[]</code> · <code>""</code></td><td>0 으로 나누기 · <code>[0]</code> 꺼내다 IndexError</td></tr><tr><td>1개</td><td><code>[5]</code></td><td>비교할 짝이 없어요</td></tr><tr><td>2개</td><td><code>[1, 2]</code></td><td>처음과 끝이 붙어 있어요 — range 끝 하나 차이</td></tr><tr><td>많이</td><td><code>[1, 3, 2, 4]</code></td><td>중복 · 순서 · 처음과 끝</td></tr></tbody></table>\n<pre>def count_ups(nums):\n    """앞 값보다 커진 횟수"""\n    ups = 0\n    for i in range(1, len(nums) - 1):    # 버그: 마지막 칸을 안 봐요\n        if nums[i] &gt; nums[i - 1]:\n            ups += 1\n    return ups\n\nprint(count_ups([]))            # 0 — 빈 것: 맞아요\nprint(count_ups([5]))           # 0 — 하나: 맞아요\nprint(count_ups([1, 2]))        # 0 — 둘: 1 이어야 해요\nprint(count_ups([1, 3, 2, 4]))  # 1 — 많이: 2 여야 해요</pre>\n<p>빈 것 · 하나는 통과하고 둘부터 틀려요. 이럴 땐 <b>가장 작은 실패 예</b> <code>[1, 2]</code> 로 손계산하면 원인이 바로 보여요([[레슨:D3]] 의 최소 재현 예). <code>range(1, len(nums) - 1)</code> 은 길이 2 에서 <code>range(1, 1)</code> — 한 번도 안 돌아요. [[레슨:D5]] 의 「하나 차이」 버그예요.</p>\n<p>그 밖에 자주 빼먹는 경우: <b>처음 · 끝</b>(첫 칸 · 마지막 칸이 답일 때), <b>같은 값 여러 개</b>(<code>[2, 2, 2]</code>), <b>이미 정렬된 것 · 거꾸로인 것</b>.</p>`,
      example: { code: `def count_ups(nums):\n    """앞 값보다 커진 횟수"""\n    ups = 0\n    for i in range(1, len(nums) - 1):    # 버그: 마지막 칸을 안 봐요\n        if nums[i] > nums[i - 1]:\n            ups += 1\n    return ups\n\ncases = [([], 0), ([5], 0), ([1, 2], 1), ([2, 1], 0), ([1, 3, 2, 4], 2), ([2, 2, 2], 0)]\nfor nums, want in cases:\n    got = count_ups(nums)\n    mark = "OK" if got == want else "틀림"\n    print(f"{str(nums):14} → {got} (기대 {want}) {mark}")` } },
    { title: "경우 표 — (입력, 기대, 이유) 리스트", html: `<p>무리 · 경계 · 개수를 생각해 고른 값을 <b>표 하나</b>로 모아요. 튜플 리스트로 두고 for 로 돌리면 돼요.</p>\n<pre>cases = [\n    # (나이, 기대, 이유)\n    (0, 0, "어린이 시작"),\n    (7, 0, "어린이 끝"),\n    (8, 5000, "청소년 시작"),\n    (19, 5000, "청소년 끝"),\n    (20, 10000, "어른 시작"),\n    (64, 10000, "어른 끝"),\n    (65, 3000, "어르신 시작"),\n    (100, 3000, "아주 많은 나이"),\n]\nbad = 0\nfor age, want, why in cases:\n    got = ticket_price(age)\n    if got != want:\n        bad += 1\n        print(f"틀림 {age=} {got=} {want=} ({why})")\nprint(f"{len(cases)}개 중 {bad}개 틀림")</pre>\n<p>위 버그 판(<code>age &lt;= 65</code>)으로 돌리면 <code>틀림 age=65 got=10000 want=3000 (어르신 시작)</code> 과 <code>8개 중 1개 틀림</code> 이 나와요.</p>\n<ul><li><b>빠진 무리가 보여요</b> — 어린이 · 청소년 · 어른 · 어르신마다 시작 · 끝이 있는지 눈으로 확인돼요</li><li><b>새 경우는 한 줄</b> — 버그 신고가 오면 그 입력을 한 줄 더해요([[레슨:D12]] 의 회귀 테스트)</li><li><b>이유 칸</b>이 「왜 이 값을 골랐는지」 를 남겨요. 나중에 읽는 사람(나 포함)을 위해서예요</li><li>assert 대신 if 로 세어서, 하나가 틀려도 <b>끝까지</b> 다 봐요</li></ul>\n<p>다음 레슨의 <code>@pytest.mark.parametrize</code> 가 이 표를 그대로 받아 경우마다 테스트 하나씩 만들어 줘요.</p>`,
      example: { code: `def ticket_price(age):\n    if age < 0:\n        raise ValueError("나이는 0 이상")\n    if age <= 7:\n        return 0\n    if age <= 19:\n        return 5000\n    if age <= 65:\n        return 10000\n    return 3000\n\ncases = [\n    # (나이, 기대, 이유)\n    (0, 0, "어린이 시작"),\n    (7, 0, "어린이 끝"),\n    (8, 5000, "청소년 시작"),\n    (19, 5000, "청소년 끝"),\n    (20, 10000, "어른 시작"),\n    (64, 10000, "어른 끝"),\n    (65, 3000, "어르신 시작"),\n    (100, 3000, "아주 많은 나이"),\n]\nbad = 0\nfor age, want, why in cases:\n    got = ticket_price(age)\n    if got != want:\n        bad += 1\n        print(f"틀림 {age=} {got=} {want=} ({why})")\nprint(f"{len(cases)}개 중 {bad}개 틀림")` } },
  ],
  summary: ["같은 규칙끼리 무리를 나누고 무리마다 대표값 하나 — 잘못된 값도 한 무리", "버그는 무리 사이에 — 경계마다 양쪽 값 둘(7 · 8, 64 · 65)", "목록은 빈 것 · 하나 · 둘 · 많이, 경우는 (입력, 기대, 이유) 표로"] },
{ id: 'D9', ch: 2, n: 9, title: "fixture 와 parametrize", mode: 'text',
  tutorSummary: "@pytest.mark.parametrize(\"age, want\", [(7, 0), (8, 5000), …]) — 앞 레슨의 경우 표가 경우마다 테스트 하나(이름 test_x[7-0]), 하나가 틀려도 나머지는 다 돎. 첫 인자 글자 = 테스트 함수 매개변수 이름, 값이 하나면 튜플 없이. 한글 값은 id 에서 \\uc5b4 처럼 보여서 ids= 나 영어 값. @pytest.fixture 는 준비를 함수로: 테스트 매개변수에 fixture 이름을 적으면 pytest 가 불러 넘겨 줌, 테스트마다 새로 만들어 서로 안 섞임. yield fixture 는 yield 뒤가 정리(실패해도 돎). 여러 파일이 같이 쓰면 conftest.py(import 없이). tmp_path 는 내장 fixture — 테스트마다 새 빈 폴더(pathlib.Path), tmp_path / \"a.json\", read_text 로 파일 내용까지 확인, 진짜 폴더는 그대로. fixture 와 parametrize 를 한 테스트에 같이 쓸 수 있음.",
  terms: { "parametrize": "테스트 함수 하나에 여러 입력 · 기대 값을 표로 주어, 경우마다 따로 돌게 하는 pytest 기능", "fixture": "테스트가 쓸 준비물(객체 · 파일 · 연결)을 만들어 주는 함수. 테스트 매개변수에 이름만 적으면 pytest 가 만들어 넘겨 줘요" },
  pages: [
    { title: "@pytest.mark.parametrize — 표를 테스트로", html: `<p>[[레슨:D8]] 의 경우 표를 pytest 에 넘기면 경우마다 테스트를 하나씩 만들어 줘요([[parametrize]]). <code>tickets.py</code> 에 버그 판 ticket_price(<code>age &lt;= 65</code>)가 있다고 해 봐요.</p>\n<pre>import pytest\nfrom tickets import ticket_price\n\n\n@pytest.mark.parametrize("age, want", [\n    (7, 0),\n    (8, 5000),\n    (64, 10000),\n    (65, 3000),\n])\ndef test_ticket_price(age, want):\n    assert ticket_price(age) == want</pre>\n<ul><li>첫 번째 글자 <code>"age, want"</code> 는 테스트 함수의 <b>매개변수 이름</b>이에요. 쉼표로 나눠 적어요</li><li>두 번째는 경우 리스트 — 튜플 하나가 테스트 하나예요</li><li>값이 하나면 튜플 없이 <code>@pytest.mark.parametrize("n", [0, 1, 2])</code></li></ul>\n<pre>&gt; python -m pytest -v\ntest_tickets.py::test_ticket_price[7-0] PASSED              [ 25%]\ntest_tickets.py::test_ticket_price[8-5000] PASSED           [ 50%]\ntest_tickets.py::test_ticket_price[64-10000] PASSED         [ 75%]\ntest_tickets.py::test_ticket_price[65-3000] FAILED          [100%]\n…\nE       assert 10000 == 3000\nE        +  where 10000 = ticket_price(65)\n…\nFAILED test_tickets.py::test_ticket_price[65-3000] - assert 10000 == 3000\n================= 1 failed, 3 passed in 0.02s ==================</pre>\n<p>경우마다 이름이 <code>test_ticket_price[65-3000]</code> 처럼 붙어서 <b>어느 줄이 틀렸는지</b> 바로 보여요. 그리고 앞 레슨의 for + assert 와 달리 하나가 틀려도 <b>나머지는 다 돌아요</b>.</p>\n<div class="bk-warn"><b>한글 값은 이름이 깨져 보여요</b> — <code>"가나"</code> 를 넣으면 <code>[\\uac00\\ub098]</code> 처럼 보여요. 이름이 중요하면 <code>ids=["child", "teen"]</code> 처럼 영어 이름을 따로 주거나 값을 숫자 · 영어로 써요.</div>`,
      example: { code: `import pytest\n\n\ndef ticket_price(age):\n    if age < 0:\n        raise ValueError("나이는 0 이상")\n    if age <= 7:\n        return 0\n    if age <= 19:\n        return 5000\n    if age <= 65:\n        return 10000\n    return 3000\n\n\n@pytest.mark.parametrize("age, want", [\n    (0, 0),\n    (7, 0),\n    (8, 5000),\n    (19, 5000),\n    (20, 10000),\n    (64, 10000),\n    (65, 3000),\n])\ndef test_ticket_price(age, want):\n    assert ticket_price(age) == want\n\n\n@pytest.mark.parametrize("age", [-1, -100])\ndef test_negative_age_is_error(age):\n    try:\n        ticket_price(age)\n    except ValueError:\n        return\n    assert False, "ValueError 가 나야 해요"\n\nif __name__ == "__main__":\n    import contextlib, io\n    buf = io.StringIO()\n    with contextlib.redirect_stdout(buf):\n        pytest.main(["-q", "-p", "no:cacheprovider", __file__])\n    lines = buf.getvalue().splitlines()\n    for line in lines:\n        if line.startswith("FAILED"):\n            print("실패:", line.split("::")[1].split(" - ")[0])\n    print(lines[-1].rsplit(" in ", 1)[0])` } },
    { title: "@pytest.fixture — 준비를 함수 하나로", html: `<p>테스트마다 「장바구니를 만들고 물건 두 개 넣기」 를 쓰면 같은 줄이 계속 반복돼요. 준비를 함수 하나로 빼고 <code>@pytest.fixture</code> 를 붙이면 [[fixture]] 가 돼요.</p>\n<pre>import pytest\nfrom cart import Cart\n\n\n@pytest.fixture\ndef cart():\n    c = Cart()\n    c.add("우유", 2000)\n    c.add("빵", 3000, 2)\n    return c\n\n\ndef test_total(cart):\n    assert cart.total() == 8000\n\n\ndef test_add_more(cart):\n    cart.add("우유", 2000)\n    assert cart.total() == 10000\n\n\ndef test_still_fresh(cart):\n    assert len(cart.items) == 2    # 앞 테스트가 더한 우유는 없어요</pre>\n<ul><li>테스트 매개변수에 <b>fixture 이름</b>(<code>cart</code>)을 적으면, pytest 가 그 함수를 불러 돌려준 값을 넣어 줘요. 직접 부르지 않아요</li><li><b>테스트마다 새로</b> 만들어요. test_add_more 가 우유를 더해도 test_still_fresh 는 새 장바구니를 받아요. 전역 변수 하나를 같이 쓰면 테스트 순서에 따라 결과가 바뀌는 버그가 생겨요</li></ul>\n<p>다 쓰고 <b>정리</b>할 게 있으면(파일 닫기 · 연결 끊기) <code>return</code> 대신 <code>yield</code> 를 써요. yield 앞이 준비, 뒤가 정리예요.</p>\n<pre>@pytest.fixture\ndef db():\n    conn = sqlite3.connect(":memory:")\n    yield conn          # 여기서 테스트가 돌고\n    conn.close()        # 테스트가 끝나면 정리 — 실패해도 돌아요</pre>\n<p>여러 테스트 파일이 같은 fixture 를 쓰면 같은 폴더의 <code>conftest.py</code> 에 둬요. pytest 가 알아서 읽어서 <b>import 없이</b> 이름만 적으면 돼요.</p>`,
      example: { code: `import sqlite3\n\nimport pytest\n\n\nclass Cart:\n    def __init__(self):\n        self.items = []\n\n    def add(self, name, price, qty=1):\n        self.items.append((name, price, qty))\n\n    def total(self):\n        return sum(price * qty for name, price, qty in self.items)\n\n\n@pytest.fixture\ndef cart():\n    c = Cart()\n    c.add("우유", 2000)\n    c.add("빵", 3000, 2)\n    return c\n\n\ndef test_total(cart):\n    assert cart.total() == 8000\n\n\ndef test_add_more(cart):\n    cart.add("우유", 2000)\n    assert cart.total() == 10000\n\n\ndef test_still_fresh(cart):\n    assert len(cart.items) == 2\n\n\n@pytest.fixture\ndef db():\n    conn = sqlite3.connect(":memory:")\n    conn.execute("CREATE TABLE t (x)")\n    yield conn\n    conn.close()\n\n\ndef test_db_starts_empty(db):\n    assert db.execute("SELECT COUNT(*) FROM t").fetchone()[0] == 0\n\nif __name__ == "__main__":\n    import contextlib, io\n    buf = io.StringIO()\n    with contextlib.redirect_stdout(buf):\n        pytest.main(["-q", "-p", "no:cacheprovider", __file__])\n    lines = buf.getvalue().splitlines()\n    for line in lines:\n        if line.startswith("FAILED"):\n            print("실패:", line.split("::")[1].split(" - ")[0])\n    print(lines[-1].rsplit(" in ", 1)[0])` } },
    { title: "tmp_path — 테스트마다 새 빈 폴더", html: `<p>파일을 읽고 쓰는 함수를 테스트하면서 진짜 파일을 건드리면 안 돼요. 내 데이터가 덮어써지거나, 앞 테스트가 남긴 파일 때문에 결과가 달라져요. pytest 에 들어 있는 fixture <code>tmp_path</code> 는 <b>테스트마다 새 빈 폴더</b>를 만들어 줘요.</p>\n<pre>import json\n\n\ndef save_scores(path, scores):\n    with open(path, "w", encoding="utf-8") as f:\n        json.dump(scores, f, ensure_ascii=False)\n\n\ndef load_scores(path):\n    try:\n        with open(path, encoding="utf-8") as f:\n            return json.load(f)\n    except FileNotFoundError:\n        return {}</pre>\n<pre>def test_save_then_load(tmp_path):\n    path = tmp_path / "scores.json"\n    save_scores(path, {"민수": 90})\n    assert load_scores(path) == {"민수": 90}\n\n\ndef test_file_is_utf8_json(tmp_path):\n    path = tmp_path / "scores.json"\n    save_scores(path, {"지우": 85})\n    assert path.read_text(encoding="utf-8") == '{"지우": 85}'\n\n\ndef test_missing_file_is_empty(tmp_path):\n    assert load_scores(tmp_path / "없음.json") == {}</pre>\n<ul><li><code>tmp_path</code> 는 만들 필요 없이 매개변수에 이름만 적으면 돼요(pytest 에 들어 있는 fixture)</li><li>값은 <code>Path</code> 라서 <code>tmp_path / "scores.json"</code> 으로 경로를 만들어요(<a href="../python/#lesson/L17B" target="_blank" rel="noopener">파이썬 교과서 「파일 2: 경로 · 인코딩」 ↗</a>)</li><li><code>path.read_text(encoding="utf-8")</code> 로 <b>파일에 실제로 적힌 글</b>까지 확인할 수 있어요</li><li>폴더는 내 컴퓨터의 임시 폴더 안에 생기고, pytest 가 오래된 것부터 알아서 지워요</li></ul>\n<p>예제를 돌리면 테스트가 끝난 뒤에도 지금 폴더에는 scores.json 이 없어요. 테스트는 tmp_path 안에서만 썼으니까요.</p>`,
      example: { code: `import json\nimport os\n\nimport pytest\n\n\ndef save_scores(path, scores):\n    with open(path, "w", encoding="utf-8") as f:\n        json.dump(scores, f, ensure_ascii=False)\n\n\ndef load_scores(path):\n    try:\n        with open(path, encoding="utf-8") as f:\n            return json.load(f)\n    except FileNotFoundError:\n        return {}\n\n\ndef test_save_then_load(tmp_path):\n    path = tmp_path / "scores.json"\n    save_scores(path, {"민수": 90})\n    assert load_scores(path) == {"민수": 90}\n\n\ndef test_file_is_utf8_json(tmp_path):\n    path = tmp_path / "scores.json"\n    save_scores(path, {"지우": 85})\n    assert path.read_text(encoding="utf-8") == '{"지우": 85}'\n\n\ndef test_missing_file_is_empty(tmp_path):\n    assert load_scores(tmp_path / "없음.json") == {}\n\nif __name__ == "__main__":\n    import contextlib, io\n    buf = io.StringIO()\n    with contextlib.redirect_stdout(buf):\n        pytest.main(["-q", "-p", "no:cacheprovider", __file__])\n    lines = buf.getvalue().splitlines()\n    for line in lines:\n        if line.startswith("FAILED"):\n            print("실패:", line.split("::")[1].split(" - ")[0])\n    print(lines[-1].rsplit(" in ", 1)[0])\n    print("지금 폴더에 scores.json:", os.path.exists("scores.json"))` } },
    { title: "fixture + parametrize — 같이 쓰기", html: `<p>한 테스트에 fixture 와 parametrize 를 같이 쓸 수 있어요. 매개변수에 둘 다 적으면 돼요. pytest 가 이름을 보고 fixture 인지 표의 칸인지 알아서 나눠 넣어요.</p>\n<pre>@pytest.mark.parametrize("name, price, qty, want", [\n    ("물", 1000, 1, 9000),\n    ("귤", 500, 4, 10000),\n    ("공짜 쿠폰", 0, 1, 8000),\n])\ndef test_total_after_add(cart, name, price, qty, want):\n    cart.add(name, price, qty)\n    assert cart.total() == want</pre>\n<p>경우 셋이 모두 <b>각자 새 장바구니</b>(우유 · 빵 = 8000원)에서 시작해요. 표 줄마다 fixture 가 새로 만들어지거든요.</p>\n<table class="kb"><tbody><tr><th>이럴 때</th><th>쓰는 것</th></tr><tr><td>같은 함수에 입력만 여러 개</td><td>parametrize</td></tr><tr><td>여러 테스트가 같은 준비물</td><td>fixture</td></tr><tr><td>파일 · 폴더가 필요</td><td>tmp_path</td></tr><tr><td>준비물 + 입력 여러 개</td><td>둘 다</td></tr></tbody></table>`,
      example: { code: `import pytest\n\n\nclass Cart:\n    def __init__(self):\n        self.items = []\n\n    def add(self, name, price, qty=1):\n        self.items.append((name, price, qty))\n\n    def total(self):\n        return sum(price * qty for name, price, qty in self.items)\n\n\n@pytest.fixture\ndef cart():\n    c = Cart()\n    c.add("우유", 2000)\n    c.add("빵", 3000, 2)\n    return c\n\n\n@pytest.mark.parametrize("name, price, qty, want", [\n    ("물", 1000, 1, 9000),\n    ("귤", 500, 4, 10000),\n    ("공짜 쿠폰", 0, 1, 8000),\n])\ndef test_total_after_add(cart, name, price, qty, want):\n    cart.add(name, price, qty)\n    assert cart.total() == want\n\nif __name__ == "__main__":\n    import contextlib, io\n    buf = io.StringIO()\n    with contextlib.redirect_stdout(buf):\n        pytest.main(["-q", "-p", "no:cacheprovider", __file__])\n    lines = buf.getvalue().splitlines()\n    for line in lines:\n        if line.startswith("FAILED"):\n            print("실패:", line.split("::")[1].split(" - ")[0])\n    print(lines[-1].rsplit(" in ", 1)[0])` } },
  ],
  summary: ["@pytest.mark.parametrize(\"a, want\", [...]) — 표 한 줄이 테스트 하나", "@pytest.fixture 는 테스트마다 새 준비물, 정리는 yield 뒤에, 같이 쓰면 conftest.py", "tmp_path 는 테스트마다 새 빈 폴더 — 진짜 파일은 안 건드려요"] },
{ id: 'D10', ch: 2, n: 10, title: "예외 · 가짜 객체 테스트", mode: 'text',
  tutorSummary: "with pytest.raises(ValueError): 안에서 그 에러가 나야 통과, 안 나면 Failed: DID NOT RAISE, 다른 에러면 그 에러로 실패. match=\"글\" 은 메시지 검사(정규식), as e 로 받으면 e.value 가 예외. with 안에는 에러가 날 한 줄만. monkeypatch fixture: setattr(random, \"randint\", lambda a, b: 6) 처럼 테스트 동안만 바꿔 끼우고 끝나면 되돌림, \"builtins.input\" 으로 input 바꾸기(답 여러 개는 iter + next), setenv 로 환경 변수. datetime.date.today 는 못 바꿈(TypeError) → 시간 · 무작위는 인자로 받기(today=None 이면 진짜 오늘, rng=None 이면 random.Random()), 테스트는 고정 날짜 · random.Random(7) 을 넘김, 같은 seed → 같은 순서처럼 버전에 안 흔들리는 성질을 검사. 가짜 객체: 진짜(메일 · 문자 · 네트워크) 대신 같은 메서드 이름을 가진 FakeSender 가 보낸 것을 리스트에 기록, 테스트는 기록을 비교. unittest.mock.Mock 은 더 알아보기.",
  terms: { "monkeypatch": "테스트 동안만 함수 · 값 · 환경 변수를 바꿔 끼우고, 테스트가 끝나면 원래대로 되돌려 주는 pytest fixture", "가짜 객체": "진짜(메일 보내기 · 네트워크 · 시간) 대신 테스트에 넘기는 객체. 같은 메서드 이름을 가지고, 받은 것을 기록만 해요" },
  pages: [
    { title: "pytest.raises(ValueError) — 에러도 약속", html: `<p>「음수면 ValueError」 도 함수가 지켜야 할 약속이라 테스트해요. 예외를 일으키고 받는 법은 <a href="../python/#lesson/L13" target="_blank" rel="noopener">파이썬 교과서 「예외 처리」 ↗</a> · <a href="../python/#lesson/L15C" target="_blank" rel="noopener">파이썬 교과서 「내 예외 만들기: raise」 ↗</a> 에서 배웠어요.</p>\n<pre>import pytest\n\n\ndef parse_age(text):\n    age = int(text)\n    if age &lt; 0:\n        raise ValueError("나이는 0 이상이어야 해요")\n    return age\n\n\ndef test_negative_age_raises():\n    with pytest.raises(ValueError):\n        parse_age("-3")\n\n\ndef test_negative_age_message():\n    with pytest.raises(ValueError, match="0 이상"):\n        parse_age("-3")\n\n\ndef test_not_a_number():\n    with pytest.raises(ValueError) as e:\n        parse_age("열")\n    assert "invalid literal" in str(e.value)</pre>\n<ul><li><code>with pytest.raises(ValueError):</code> 안에서 ValueError 가 <b>나야</b> 통과예요. 안 나면 <code>Failed: DID NOT RAISE</code> 로 실패해요</li><li>다른 에러(<code>ZeroDivisionError</code> 등)가 나면 그 에러로 실패해요 — 「아무 에러나」 가 아니라 <b>약속한 그 에러</b>인지 봐요</li><li><code>match="0 이상"</code> 은 메시지에 그 글이 들어 있는지 봐요. 정규식이라 <code>.</code> <code>(</code> <code>?</code> 같은 글자는 뜻이 달라요</li><li><code>as e</code> 로 받으면 with 가 끝난 뒤 <code>e.value</code> 가 일어난 예외예요</li></ul>\n<div class="bk-warn"><b>with 안에는 한 줄만</b> — 준비하는 줄까지 with 안에 넣으면, 준비하다 난 에러를 「약속대로 났다」 고 착각해요. 에러가 나야 하는 그 한 줄만 넣어요.</div>`,
      example: { code: `import pytest\n\n\ndef parse_age(text):\n    age = int(text)\n    if age < 0:\n        raise ValueError("나이는 0 이상이어야 해요")\n    return age\n\n\ndef test_negative_age_raises():\n    with pytest.raises(ValueError):\n        parse_age("-3")\n\n\ndef test_negative_age_message():\n    with pytest.raises(ValueError, match="0 이상"):\n        parse_age("-3")\n\n\ndef test_not_a_number():\n    with pytest.raises(ValueError) as e:\n        parse_age("열")\n    assert "invalid literal" in str(e.value)\n\n\ndef test_zero_is_ok():\n    assert parse_age("0") == 0\n\nif __name__ == "__main__":\n    import contextlib, io\n    buf = io.StringIO()\n    with contextlib.redirect_stdout(buf):\n        pytest.main(["-q", "-p", "no:cacheprovider", __file__])\n    lines = buf.getvalue().splitlines()\n    for line in lines:\n        if line.startswith("FAILED"):\n            print("실패:", line.split("::")[1].split(" - ")[0])\n    print(lines[-1].rsplit(" in ", 1)[0])` } },
    { title: "monkeypatch.setattr — 잠깐 바꿔 끼우기", html: `<p>주사위 함수는 부를 때마다 결과가 달라서 「6 이 나오면 대박」 을 테스트하기 어려워요. pytest 의 [[monkeypatch]] fixture 로 <code>random.randint</code> 를 테스트 동안만 「늘 6」 으로 바꿔 끼워요(<a href="../python/#lesson/L16" target="_blank" rel="noopener">파이썬 교과서 「모듈과 random」 ↗</a>).</p>\n<pre>import random\n\n\ndef roll_message():\n    n = random.randint(1, 6)\n    if n == 6:\n        return "대박! 6"\n    return f"{n} 나왔어요"\n\n\ndef test_six(monkeypatch):\n    monkeypatch.setattr(random, "randint", lambda a, b: 6)\n    assert roll_message() == "대박! 6"\n\n\ndef test_three(monkeypatch):\n    monkeypatch.setattr(random, "randint", lambda a, b: 3)\n    assert roll_message() == "3 나왔어요"</pre>\n<ul><li><code>monkeypatch.setattr(대상, "이름", 새 값)</code> — 대상(모듈 · 객체)의 그 이름을 새 값으로 바꿔요</li><li><code>lambda a, b: 6</code> 은 진짜 randint 처럼 두 개를 받고 늘 6 을 돌려주는 함수예요(<a href="../python/#lesson/L18" target="_blank" rel="noopener">파이썬 교과서 「람다 · 함수를 값처럼」 ↗</a>)</li><li>테스트가 끝나면 <b>원래대로 되돌려</b> 줘요. 다른 테스트는 진짜 randint 를 써요</li></ul>\n<p><code>input()</code> 도 바꿔 끼울 수 있어요. 키보드 없이 「사용자가 이렇게 쳤다」 고 정해 두는 거예요.</p>\n<pre>def ask_name():\n    name = input("이름: ")\n    return name.strip() or "손님"\n\n\ndef test_blank_name_is_guest(monkeypatch):\n    monkeypatch.setattr("builtins.input", lambda prompt="": "   ")\n    assert ask_name() == "손님"</pre>\n<p>답이 여러 번이면 <code>answers = iter(["abc", "7"])</code> 로 만들고 <code>lambda prompt="": next(answers)</code> 로 하나씩 꺼내 줘요. 환경 변수는 <code>monkeypatch.setenv("WEATHER_KEY", "test-key")</code> — 진짜 키 없이 테스트해요(<a href="../api/#lesson/H7" target="_blank" rel="noopener">HTTP·API·SDK 교과서 「토큰 · .env」 ↗</a>).</p>`,
      example: { code: `import os\n\nimport pytest\nimport random\n\n\ndef roll_message():\n    n = random.randint(1, 6)\n    if n == 6:\n        return "대박! 6"\n    return f"{n} 나왔어요"\n\n\ndef test_six(monkeypatch):\n    monkeypatch.setattr(random, "randint", lambda a, b: 6)\n    assert roll_message() == "대박! 6"\n\n\ndef test_three(monkeypatch):\n    monkeypatch.setattr(random, "randint", lambda a, b: 3)\n    assert roll_message() == "3 나왔어요"\n\n\ndef ask_name():\n    name = input("이름: ")\n    return name.strip() or "손님"\n\n\ndef test_blank_name_is_guest(monkeypatch):\n    monkeypatch.setattr("builtins.input", lambda prompt="": "   ")\n    assert ask_name() == "손님"\n\n\ndef test_api_key_from_env(monkeypatch):\n    monkeypatch.setenv("WEATHER_KEY", "test-key")\n    assert os.environ["WEATHER_KEY"] == "test-key"\n\nif __name__ == "__main__":\n    import contextlib, io\n    buf = io.StringIO()\n    with contextlib.redirect_stdout(buf):\n        pytest.main(["-q", "-p", "no:cacheprovider", __file__])\n    lines = buf.getvalue().splitlines()\n    for line in lines:\n        if line.startswith("FAILED"):\n            print("실패:", line.split("::")[1].split(" - ")[0])\n    print(lines[-1].rsplit(" in ", 1)[0])` } },
    { title: "시간 · 무작위는 인자로 받기", html: `<p>「오늘」 을 쓰는 함수는 내일 돌리면 답이 달라져요. 그런데 오늘 날짜는 monkeypatch 로도 못 바꿔요.</p>\n<pre>import datetime\n\ndatetime.date.today = lambda: datetime.date(2026, 1, 1)\n# TypeError: cannot set 'today' attribute of immutable type 'datetime.date'</pre>\n<p>더 좋은 방법은 함수를 <b>테스트하기 쉽게</b> 만드는 거예요. 시간 · 무작위를 함수 안에서 직접 부르지 말고 <b>인자로 받아요</b>. 안 넘기면 진짜를 쓰게 기본값을 <code>None</code> 으로 둬요(<a href="../python/#lesson/L16B" target="_blank" rel="noopener">파이썬 교과서 「날짜: datetime 맛보기」 ↗</a>).</p>\n<pre>import datetime\nimport random\n\n\ndef days_until(target, today=None):\n    if today is None:\n        today = datetime.date.today()     # 프로그램에선 진짜 오늘\n    return (target - today).days\n\n\ndef shuffled(items, rng=None):\n    rng = rng or random.Random()           # 프로그램에선 진짜 무작위\n    out = list(items)\n    rng.shuffle(out)\n    return out\n\n\ndef test_days_until_christmas():\n    today = datetime.date(2026, 12, 1)\n    assert days_until(datetime.date(2026, 12, 25), today=today) == 24\n\n\ndef test_same_seed_same_order():\n    a = shuffled([1, 2, 3, 4, 5], random.Random(7))\n    b = shuffled([1, 2, 3, 4, 5], random.Random(7))\n    assert a == b\n\n\ndef test_shuffle_keeps_items():\n    assert sorted(shuffled([3, 1, 2])) == [1, 2, 3]</pre>\n<ul><li>프로그램에서는 <code>days_until(크리스마스)</code> 처럼 부르면 진짜 오늘을 써요</li><li>테스트는 <code>today=</code> 로 고정한 날짜를 넘겨요 — 1년 뒤에 돌려도 24 예요</li><li><code>random.Random(7)</code> 은 seed 가 7 인 무작위 상자예요. 같은 seed 면 같은 순서가 나와요</li><li>「섞은 결과가 정확히 [3, 1, …]」 처럼 적지 말고 <b>성질</b>(같은 seed 면 같다 · 섞어도 개수와 값은 그대로)을 검사하면, 파이썬 버전이 달라도 흔들리지 않아요</li></ul>`,
      example: { code: `import pytest\nimport datetime\nimport random\n\n\ndef days_until(target, today=None):\n    if today is None:\n        today = datetime.date.today()     # 프로그램에선 진짜 오늘\n    return (target - today).days\n\n\ndef shuffled(items, rng=None):\n    rng = rng or random.Random()           # 프로그램에선 진짜 무작위\n    out = list(items)\n    rng.shuffle(out)\n    return out\n\n\ndef test_days_until_christmas():\n    today = datetime.date(2026, 12, 1)\n    assert days_until(datetime.date(2026, 12, 25), today=today) == 24\n\n\ndef test_same_seed_same_order():\n    a = shuffled([1, 2, 3, 4, 5], random.Random(7))\n    b = shuffled([1, 2, 3, 4, 5], random.Random(7))\n    assert a == b\n\n\ndef test_shuffle_keeps_items():\n    assert sorted(shuffled([3, 1, 2])) == [1, 2, 3]\n\nif __name__ == "__main__":\n    import contextlib, io\n    buf = io.StringIO()\n    with contextlib.redirect_stdout(buf):\n        pytest.main(["-q", "-p", "no:cacheprovider", __file__])\n    lines = buf.getvalue().splitlines()\n    for line in lines:\n        if line.startswith("FAILED"):\n            print("실패:", line.split("::")[1].split(" - ")[0])\n    print(lines[-1].rsplit(" in ", 1)[0])` } },
    { title: "가짜 객체 — 진짜 대신 기록만", html: `<p>회비를 안 낸 사람에게 문자를 보내는 함수를 테스트할 때마다 진짜 문자가 나가면 곤란해요. 문자를 보내는 객체(<code>sender</code>)를 <b>인자로 받게</b> 해 두면, 테스트에서는 [[가짜 객체]]를 넘길 수 있어요.</p>\n<pre>def remind_unpaid(members, sender):\n    count = 0\n    for name, paid in members.items():\n        if not paid:\n            sender.send(name, f"{name}님, 회비를 내 주세요")\n            count += 1\n    return count\n\n\nclass FakeSender:\n    def __init__(self):\n        self.sent = []\n\n    def send(self, to, text):\n        self.sent.append((to, text))\n\n\ndef test_only_unpaid_get_message():\n    fake = FakeSender()\n    n = remind_unpaid({"민수": True, "지우": False}, fake)\n    assert n == 1\n    assert fake.sent == [("지우", "지우님, 회비를 내 주세요")]</pre>\n<ul><li>함수는 sender 가 진짜인지 몰라요. <code>.send(받는 사람, 글)</code> 만 있으면 돼요</li><li>FakeSender 는 보내는 대신 <code>self.sent</code> 리스트에 <b>기록</b>만 해요</li><li>테스트는 「누구에게 · 무슨 글을 · 몇 번」 보냈는지 기록을 통째로 비교해요</li></ul>\n<p>진짜 SmsSender 는 같은 <code>send</code> 메서드 안에서 네트워크로 보내요. 프로그램에서는 그걸 넘기고, 테스트에서는 가짜를 넘겨요. 앞 쪽의 <code>today=</code> · <code>rng=</code> 와 같은 생각이에요 — <b>바깥 세상과 닿는 것은 인자로</b>.</p>\n<details class="lp-more"><summary>💡 더 알아보기</summary><p>파이썬에 들어 있는 <code>unittest.mock.Mock()</code> 은 어떤 메서드를 불러도 받아 주고 기록하는 가짜를 자동으로 만들어 줘요. <code>m = Mock()</code> 을 넘긴 뒤 <code>m.send.assert_called_once_with("지우", "지우님, 회비를 내 주세요")</code> 로 확인해요. 처음엔 손으로 만든 가짜가 읽기 쉬워요.</p></details>`,
      example: { code: `import pytest\n\n\ndef remind_unpaid(members, sender):\n    count = 0\n    for name, paid in members.items():\n        if not paid:\n            sender.send(name, f"{name}님, 회비를 내 주세요")\n            count += 1\n    return count\n\n\nclass FakeSender:\n    def __init__(self):\n        self.sent = []\n\n    def send(self, to, text):\n        self.sent.append((to, text))\n\n\ndef test_only_unpaid_get_message():\n    fake = FakeSender()\n    n = remind_unpaid({"민수": True, "지우": False}, fake)\n    assert n == 1\n    assert fake.sent == [("지우", "지우님, 회비를 내 주세요")]\n\n\ndef test_everyone_paid_sends_nothing():\n    fake = FakeSender()\n    assert remind_unpaid({"민수": True}, fake) == 0\n    assert fake.sent == []\n\nif __name__ == "__main__":\n    import contextlib, io\n    buf = io.StringIO()\n    with contextlib.redirect_stdout(buf):\n        pytest.main(["-q", "-p", "no:cacheprovider", __file__])\n    lines = buf.getvalue().splitlines()\n    for line in lines:\n        if line.startswith("FAILED"):\n            print("실패:", line.split("::")[1].split(" - ")[0])\n    print(lines[-1].rsplit(" in ", 1)[0])` } },
  ],
  summary: ["with pytest.raises(ValueError, match=\"…\"): 안에는 에러 날 한 줄만", "monkeypatch.setattr · setenv 는 테스트 동안만 바꿔 끼우고 되돌린다", "시간 · 무작위 · 바깥 세상은 인자로 받고, 테스트엔 고정 값 · 가짜 객체"] },
{ id: 'DB2', ch: 2, boss: true, title: "만들어 보기: 계산기 테스트 묶음", mode: 'text',
  tutorSummary: "남이 만든 계산기 모듈 calc.py(준비 파일, 버그 넷: div 가 // · power 지수 0 · average 빈 리스트가 ZeroDivisionError · round_won 이 round() 의 짝수 반올림)에 test_calc.py 를 써서 버그를 잡기. 정상 값 parametrize → 경계값(지수 0 · 끝이 5) → pytest.raises 로 예외 약속 → 고친 판으로 전부 통과. 예시 답은 pytest.main 꼬리로 실패한 테스트 이름과 개수만 찍음.",
  pages: [], summary: [] },
{ id: 'D11', ch: 3, n: 11, title: '테스트 먼저(TDD)', mode: 'text',
  tutorSummary: 'TDD(테스트 주도 개발) = 빨강(아직 없는 기능의 테스트를 하나 먼저 쓰고 실패를 본다) → 초록(그 테스트가 통과할 가장 단순한 코드) → 정리(테스트를 돌려 가며 이름·중복 다듬기, 새 기능은 안 넣음)를 아주 작은 걸음으로 되풀이. 369 게임 clap(n): 1 은 "1" → 3 은 "짝" → 6·9·13 도 → 33 은 "짝짝". 바로 통과하는 테스트는 「이미 되는 것」 이지만, 한 번도 빨강을 못 본 테스트는 진짜 검사하는지 의심. pytest 로는 test_clap.py 를 먼저 → python -m pytest -q 가 ModuleNotFoundError(끝 코드 2) → clap.py → 실패(1) → 고쳐서 초록(0). 규칙이 분명한 함수·버그 고치기에 특히 좋다.',
  terms: { 'TDD': '테스트 주도 개발. 테스트를 먼저 쓰고(빨강), 통과할 만큼만 코드를 쓰고(초록), 테스트를 지키며 다듬는(정리) 순서를 되풀이하는 방법', '작은 걸음': '테스트 하나 · 코드 몇 줄씩만 바꾸고 바로 돌려 보는 것. 틀려도 어디가 틀렸는지 바로 안다' },
  pages: [
    { title: '빨강 → 초록 → 정리 · 테스트가 먼저', html: `<p>지금까지는 코드를 먼저 짜고 테스트를 나중에 붙였어요(<a href="../python/#lesson/L21" target="_blank" rel="noopener">파이썬 교과서 「테스트 작성」 ↗</a>). [[TDD]](테스트 주도 개발)는 순서를 뒤집어요. <b>테스트를 먼저</b> 쓰고, 그 테스트가 통과할 만큼만 코드를 써요.</p>
<table class="kb"><tbody><tr><th>단계</th><th>하는 일</th><th>끝나면</th></tr><tr><td><b>빨강</b></td><td>아직 없는 기능의 테스트를 <b>하나</b> 써요</td><td>그 테스트가 실패해요</td></tr><tr><td><b>초록</b></td><td>그 테스트가 통과할 <b>가장 단순한</b> 코드를 써요</td><td>모든 테스트 통과</td></tr><tr><td><b>정리</b></td><td>테스트를 돌려 가며 이름 · 중복을 다듬어요</td><td>여전히 모두 통과</td></tr></tbody></table>
<p>예로 369 게임 함수 <code>clap(n)</code> 을 만들어요. 숫자에 3 · 6 · 9 가 있으면 그 개수만큼 「짝」, 없으면 숫자를 글자로 돌려줘요. 첫 테스트는 제일 쉬운 것 — 1 은 <code>"1"</code> 이에요.</p>
<pre>def test_plain():
    assert clap(1) == "1"
# clap 이 아직 없어요 → NameError → 빨강</pre>
<p><b>왜 실패부터 보나요?</b> 테스트가 정말로 검사하는지 확인하려고요. 코드가 없는데도 통과하는 테스트라면 테스트가 잘못된 거예요.</p>
<p>이제 통과할 만큼만 써요. <code>return str(n)</code> 한 줄이면 초록이에요. 「3 이면 짝」 은 <b>아직 테스트가 없으니까</b> 안 써요.</p>
<pre>def clap(n):
    return str(n)

print(clap(1))   # 1</pre>
<p>예제의 <code>run(tests)</code> 는 테스트 함수를 차례로 불러 <code>PASS</code> · <code>FAIL</code> 을 찍는 작은 도구예요(파이썬 교과서 「테스트 작성」 의 「실패해도 끝까지 세기」). 빨강의 NameError 도 받으려고 <code>except Exception as e:</code> 로 받아요. 이 교과서의 「만들어 보기」 는 이 run 으로 결과를 찍어요.</p>`,
      example: { code: `def run(tests):
    for t in tests:
        try:
            t()
            print("PASS", t.__name__)
        except Exception as e:
            print("FAIL", t.__name__, type(e).__name__, e)

def test_plain():
    assert clap(1) == "1"

print("-- 빨강: clap 이 아직 없어요")
run([test_plain])

def clap(n):
    return str(n)

print("-- 초록: 가장 단순한 코드")
run([test_plain])` } },
    { title: '작은 걸음 — 테스트 하나에 코드 한 걸음', html: `<p>테스트를 <b>하나씩</b> 늘리고, 늘릴 때마다 돌려요. 한 번에 조금만 바꾸니까 빨강이 나오면 원인은 방금 바꾼 몇 줄이에요. 이게 [[작은 걸음]]이에요.</p>
<table class="kb"><tbody><tr><th>새 테스트</th><th>처음 결과</th><th>초록으로 만든 코드</th></tr><tr><td><code>clap(1) == "1"</code></td><td>빨강(NameError)</td><td><code>return str(n)</code></td></tr><tr><td><code>clap(3) == "짝"</code></td><td>빨강(<code>'3'</code>)</td><td>숫자 하나하나에 3 · 6 · 9 가 있으면 <code>"짝"</code></td></tr><tr><td><code>clap(13) == "짝"</code></td><td><b>바로 초록</b></td><td>안 바꿔요 — 이미 되는 것</td></tr><tr><td><code>clap(33) == "짝짝"</code></td><td>빨강(<code>'짝'</code>)</td><td>3 · 6 · 9 를 <b>세서</b> 그만큼 <code>"짝" * count</code></td></tr></tbody></table>
<pre>def clap(n):
    count = 0
    for d in str(n):
        if d in "369":
            count += 1
    if count == 0:
        return str(n)
    return "짝" * count

print(clap(33))   # 짝짝</pre>
<p>바로 초록인 테스트(<code>clap(13)</code>)도 남겨 둬요. 지금은 되지만, 나중에 고치다 깨지면 알려 줘요. 다만 <b>한 번도 빨강을 못 본</b> 테스트는 「정말 검사하나?」 를 한 번 의심해 보세요 — <code>assert</code> 를 빠뜨렸거나 이름이 <code>test_</code> 로 시작하지 않아 안 돌고 있을 수도 있어요.</p>
<p>예제는 세 걸음의 clap 을 모든 테스트에 돌려, 걸음마다 O · X 가 어떻게 바뀌는지 보여 줘요.</p>`,
      example: { code: `def clap_v1(n):
    return str(n)

def clap_v2(n):
    for d in str(n):
        if d in "369":
            return "짝"
    return str(n)

def clap_v3(n):
    count = 0
    for d in str(n):
        if d in "369":
            count += 1
    if count == 0:
        return str(n)
    return "짝" * count

cases = [(1, "1"), (3, "짝"), (6, "짝"), (13, "짝"), (33, "짝짝")]
for name, f in [("v1", clap_v1), ("v2", clap_v2), ("v3", clap_v3)]:
    marks = []
    for n, want in cases:
        marks.append(str(n) + ":" + ("O" if f(n) == want else "X"))
    print(name, " ".join(marks))` } },
    { title: '정리 — 초록일 때만 고쳐 쓰기', html: `<p>모든 테스트가 초록이면 <b>정리</b> 차례예요. 하는 일은 그대로 두고 코드 모양만 다듬어요(<a href="../python/#lesson/L23" target="_blank" rel="noopener">파이썬 교과서 「코드 설계와 리팩터링」 ↗</a>). 테스트가 지켜 주니까 마음 놓고 고칠 수 있어요.</p>
<pre>def clap(n):
    s = str(n)
    count = s.count("3") + s.count("6") + s.count("9")
    if count == 0:
        return s
    return "짝" * count

print(clap(36))   # 짝짝
print(clap(10))   # 10</pre>
<ul><li><b>정리 중엔 새 기능을 넣지 않아요.</b> 「0 이면?」 같은 새 생각이 나면 메모해 두고, 다음 빨강 테스트로 시작해요</li><li>한 군데 고칠 때마다 테스트를 돌려요. 빨강이 되면 방금 고친 걸 되돌려요(<kbd>Ctrl</kbd>+<kbd>Z</kbd>)</li><li>테스트 코드도 정리해요. 비슷한 테스트 다섯 개는 <code>(입력, 기대)</code> 목록 하나로 묶을 수 있어요(pytest 에서는 [[레슨:D9]] 의 parametrize)</li></ul>
<div class="bk-warn"><b>빨강일 때 정리하지 않기</b> — 실패하는 테스트가 있는데 모양까지 바꾸면, 다음 빨강이 버그 때문인지 정리 때문인지 알 수 없어요. 초록 → 정리 → 다시 초록 확인, 이 순서예요.</div>`,
      example: { code: `def clap(n):
    s = str(n)
    count = s.count("3") + s.count("6") + s.count("9")
    if count == 0:
        return s
    return "짝" * count

cases = [(1, "1"), (3, "짝"), (6, "짝"), (13, "짝"), (33, "짝짝"), (36, "짝짝"), (10, "10")]
passed = 0
for n, want in cases:
    if clap(n) == want:
        passed += 1
    else:
        print("FAIL", n, clap(n), "기대", want)
print(f"정리한 뒤에도 {passed}/{len(cases)} 통과")
claps = [clap(n) for n in range(1, 14)]
print(" ".join(claps))` } },
    { title: 'pytest 로 TDD — test_clap.py 부터', html: `<p>진짜 프로젝트에서는 pytest 로 같은 순서를 밟아요. <b>테스트 파일을 먼저</b> 만들어요. <code>clap.py</code> 는 아직 없어요.</p>
<pre>from clap import clap

def test_plain():
    assert clap(1) == "1"</pre>
<p>VS Code 터미널에서 <code>python -m pytest -q</code> — 첫 빨강은 「그런 모듈이 없어요」 예요.</p>
<pre>E   ModuleNotFoundError: No module named 'clap'
=========================== short test summary info ============================
ERROR test_clap.py
!!!!!!!!!!!!!!!!!!!! Interrupted: 1 error during collection !!!!!!!!!!!!!!!!!!!!
1 error in 0.09s</pre>
<p><code>clap.py</code> 에 <code>return str(n)</code> 을 쓰면 초록, <code>test_three</code> 를 더하면 다시 빨강이에요. pytest 는 기대와 실제를 나란히 보여 줘요.</p>
<pre>.F                                                                       [100%]
    def test_three():
&gt;       assert clap(3) == "짝"
E       AssertionError: assert '3' == '짝'
FAILED test_clap.py::test_three - AssertionError: assert '3' == '짝'
1 failed, 1 passed in 0.01s</pre>
<p>pytest 가 끝나며 남기는 <b>끝 코드</b>로도 빨강 · 초록을 알 수 있어요. 로봇(<a href="../github/#lesson/G14" target="_blank" rel="noopener">GitHub Actions ↗</a>)은 이 숫자만 봐요.</p>
<table class="kb"><tbody><tr><th>끝 코드</th><th>뜻</th></tr><tr><td><code>0</code></td><td>모두 통과(초록)</td></tr><tr><td><code>1</code></td><td>실패한 테스트가 있음</td></tr><tr><td><code>2</code></td><td>테스트를 모으다 멈춤(가져오기 에러 등)</td></tr><tr><td><code>5</code></td><td>테스트를 하나도 못 찾음</td></tr></tbody></table>
<p>파이썬 코드 안에서 돌릴 땐 <code>pytest.main(["-q", "test_clap.py"])</code> 이 같은 끝 코드를 돌려줘요. 예제는 파일을 직접 쓰고 pytest 를 세 번 돌려 끝 코드만 찍어요(pytest 화면에는 걸린 시간이 찍혀서 매번 달라요).</p>
<p><b>언제 TDD 가 좋나요?</b> 입력과 결과가 분명한 함수(계산 · 변환 · 검사)와, 버그를 고칠 때([[레슨:D12]])예요. 화면 모양을 이리저리 바꿔 보는 실험 코드는 먼저 만들어 보고 나중에 테스트를 붙여도 괜찮아요.</p>`,
      example: { code: `import subprocess, sys
from pathlib import Path

def pytest_q():
    r = subprocess.run([sys.executable, "-B", "-m", "pytest", "-q", "-p", "no:cacheprovider"], capture_output=True, text=True)
    last = r.stdout.strip().splitlines()[-1]
    return r.returncode, last.split(" in ")[0]

Path("test_clap.py").write_text('from clap import clap\\n\\ndef test_plain():\\n    assert clap(1) == "1"\\n\\ndef test_three():\\n    assert clap(3) == "짝"\\n', encoding="utf-8")
print("① 테스트만 있을 때:", pytest_q())

Path("clap.py").write_text("def clap(n):\\n    return str(n)\\n", encoding="utf-8")
print("② 가장 단순한 clap:", pytest_q())

Path("clap.py").write_text('def clap(n):\\n    count = sum(1 for d in str(n) if d in "369")\\n    return "짝" * count if count else str(n)\\n', encoding="utf-8")
print("③ 3 · 6 · 9 를 세는 clap:", pytest_q())` } },
  ],
  summary: ['빨강(테스트 먼저, 실패 확인) → 초록(가장 단순한 코드) → 정리(테스트를 지키며)', '테스트 하나에 코드 한 걸음 — 빨강이면 원인은 방금 바꾼 곳', 'pytest 끝 코드 0 = 초록 · 1 = 실패 · 2 = 모으다 멈춤'] },
{ id: 'D12', ch: 3, n: 12, title: '회귀 테스트', mode: 'text',
  tutorSummary: '회귀 = 고친 버그가 나중의 다른 수정 때문에 다시 나타나는 것. 버그 보고를 받으면 고치기 전에 그 버그를 재현하는 테스트를 먼저 쓰고 빨강을 확인(버그를 정확히 잡았다는 증거) → 고쳐서 초록 → 테스트는 지우지 않고 남긴다(회귀 테스트). 보고서의 재현 단계 = 테스트의 준비·부르기, 기대 = assert 오른쪽, 실제 = 지금의 빨강 메시지. 이름과 주석에 버그 내용·번호(# 버그 #7). 고친 뒤엔 새 테스트만이 아니라 전부 다시 돌린다 — 공백을 다 지우는 replace(" ", "") 는 새 테스트는 통과해도 "ice cream" 을 깨뜨림. 같은 무리의 이웃 입력(앞·뒤 공백, 탭, 줄바꿈, 대문자)도 함께 테스트.',
  terms: { '회귀': '한 번 고친 버그가 나중에 다른 걸 고치다가 다시 나타나는 것', '회귀 테스트': '고친 버그가 다시 오지 않는지 지키려고 남겨 두는 테스트. 버그를 재현하는 테스트를 고치기 전에 먼저 쓴다' },
  pages: [
    { title: '버그 → 실패하는 테스트 먼저 → 고치기', html: `<p>버그를 고쳤는데 몇 달 뒤 다른 걸 고치다 <b>같은 버그가 다시</b> 나타나는 일, 아주 흔해요. 이걸 [[회귀]]라고 해요. 막는 방법은 하나 — 버그마다 테스트를 남겨 두는 거예요. 이게 [[회귀 테스트]]예요.</p>
<p>순서는 [[레슨:D11]] 의 빨강 → 초록과 같아요.</p>
<ol><li>버그를 <b>재현하는 테스트</b>를 먼저 써요</li><li>돌려서 <b>빨강</b>인지 확인해요 — 빨강이어야 「이 테스트가 그 버그를 잡는다」 는 증거예요</li><li>코드를 고쳐서 <b>초록</b>으로</li><li>테스트는 <b>지우지 않고</b> 남겨요</li></ol>
<p>보고: 「5000원짜리 하나에 10000원 쿠폰을 쓰면 -5000원이 나와요」.</p>
<pre>def total(prices, coupon=0):
    return sum(prices) - coupon

print(total([5000], coupon=10000))   # -5000

def test_coupon_bigger_than_total():   # 버그 #7
    assert total([5000], coupon=10000) == 0</pre>
<p>고칠 땐 <code>return max(0, sum(prices) - coupon)</code> — 0 보다 작으면 0 이에요.</p>
<p>예제는 고치기 전 · 후를 한 파일에서 보여 줘요. 테스트 함수는 <b>불릴 때</b> <code>total</code> 이라는 이름을 찾아요. 그래서 <code>total = total_old</code> 처럼 이름에 옛 함수를 잠깐 붙이면 「고치기 전」 을 다시 돌려 볼 수 있어요. 「만들어 보기」 에서도 이 방법으로 전 · 후를 찍어요.</p>`,
      example: { code: `def run(tests):
    for t in tests:
        try:
            t()
            print("PASS", t.__name__)
        except Exception as e:
            print("FAIL", t.__name__, type(e).__name__, e)

def total_old(prices, coupon=0):
    return sum(prices) - coupon

def total_new(prices, coupon=0):
    return max(0, sum(prices) - coupon)

def test_sum():
    assert total([3000, 2000]) == 5000

def test_coupon():
    assert total([3000, 2000], coupon=1000) == 4000

def test_coupon_bigger_than_total():  # 버그 #7: -5000원이 나왔어요
    got = total([5000], coupon=10000)
    assert got == 0, f"기대 0, 실제 {got}"

tests = [test_sum, test_coupon, test_coupon_bigger_than_total]
print("-- 고치기 전")
total = total_old
run(tests)
print("-- 고친 뒤")
total = total_new
run(tests)` } },
    { title: '버그 보고를 테스트로 · 이름에 버그를', html: `<p>버그 보고서([[레슨:D14]])의 칸은 테스트의 칸으로 그대로 옮겨져요.</p>
<table class="kb"><tbody><tr><th>보고서</th><th>테스트</th></tr><tr><td>재현 단계</td><td>준비하고 함수를 부르는 줄</td></tr><tr><td>기대한 결과</td><td><code>assert</code> 의 오른쪽 값</td></tr><tr><td>실제 결과</td><td>지금 나오는 빨강 메시지</td></tr><tr><td>버그 번호 · 제목</td><td>테스트 이름 · 주석</td></tr></tbody></table>
<p>보고: 「단어장에서 <code>"  Apple"</code> 로 찾으면 없다고 나와요. <code>apple</code> 은 넣어 뒀어요」. 단어를 찾기 좋게 바꾸는 <code>normalize(word)</code> 가 앞 공백을 안 지워서예요.</p>
<pre>def normalize(word):
    return word.lower()

def test_normalize_strips_leading_space():   # 버그 #12: "  Apple" 을 못 찾음
    got = normalize("  Apple")
    assert got == "apple", f"기대 'apple', 실제 {got!r}"</pre>
<ul><li><b>이름은 「무엇이 어떠해야 하나」</b>로 — <code>test_bug12</code> 보다 <code>test_normalize_strips_leading_space</code>. 이름만 보고도 무엇이 깨졌는지 알아요</li><li><b>주석에 버그 번호</b> — 나중에 「이 테스트 왜 있지?」 하면 보고서를 찾아볼 수 있어요</li><li><b>보고서 그대로 말고 가장 작게</b> — 단어장 전체 대신 <code>normalize</code> 하나만 불러요([[레슨:D3]] 의 최소 재현)</li><li>assert 메시지에 실제 값을 넣어요. <code>{got!r}</code> 은 따옴표까지 보여 줘서 빈칸이 눈에 보여요</li></ul>`,
      example: { code: `def normalize(word):
    return word.lower()

def test_normalize_strips_leading_space():  # 버그 #12: "  Apple" 을 못 찾음
    got = normalize("  Apple")
    assert got == "apple", f"기대 'apple', 실제 {got!r}"

try:
    test_normalize_strips_leading_space()
    print("PASS")
except AssertionError as e:
    print("FAIL —", e)` } },
    { title: '고친 뒤엔 전부 다시 — 새 테스트만 보면 안 돼요', html: `<p>새 테스트만 초록이면 끝일까요? 아니에요. 고치다가 <b>원래 되던 것</b>을 깨뜨릴 수 있어요. 그래서 고친 뒤엔 <b>모든 테스트</b>를 다시 돌려요 — pytest 는 <code>python -m pytest -q</code> 한 번이면 전부 돌아요.</p>
<p>앞 쪽의 공백 버그를 고치는 두 방법을 비교해 봐요.</p>
<pre>def normalize_a(word):
    return word.replace(" ", "").lower()   # 빈칸을 전부 지움

def normalize_b(word):
    return word.strip().lower()            # 앞뒤 빈칸만 지움

print(normalize_a("Ice Cream"))   # icecream
print(normalize_b("Ice Cream"))   # ice cream</pre>
<p>둘 다 버그 #12 테스트는 통과해요. 그런데 A 는 예전부터 있던 「가운데 빈칸은 남긴다」 테스트를 깨뜨려요 — <code>ice cream</code> 이 <code>icecream</code> 이 됐어요. 새 테스트만 봤다면 A 를 골랐을 거예요.</p>
<div class="bk-warn"><b>테스트를 지우거나 고쳐서 초록을 만들지 않기</b> — 옛 테스트가 빨강이 되면 「테스트가 틀렸나?」 보다 「내가 뭘 깨뜨렸나?」 를 먼저 봐요. 요구가 정말 바뀌었을 때만 테스트를 바꿔요.</div>`,
      example: { code: `def normalize_old(word):
    return word.lower()

def normalize_a(word):
    return word.replace(" ", "").lower()

def normalize_b(word):
    return word.strip().lower()

tests = [
    ("대문자는 소문자로", "Apple", "apple"),
    ("가운데 빈칸은 남김", "Ice Cream", "ice cream"),
    ("버그 #12 앞 빈칸", "  Apple", "apple"),
]
for name, f in [("고치기 전", normalize_old), ("방법 A", normalize_a), ("방법 B", normalize_b)]:
    print("--", name)
    for title, given, want in tests:
        got = f(given)
        print("PASS" if got == want else "FAIL", title, repr(got))` } },
    { title: '이웃 입력도 함께 — 같은 무리의 버그', html: `<p>버그 하나를 찾으면 <b>옆집</b>도 살펴봐요. 앞 빈칸이 문제였다면 뒤 빈칸 · 탭 · 줄바꿈 · 대문자는 괜찮을까요? 같은 무리의 입력([[레슨:D8]] 의 등가 분할)을 한꺼번에 테스트해요.</p>
<pre>cases = [
    ("  Apple", "apple"),     # 버그 #12 그대로
    ("apple  ", "apple"),     # 뒤 빈칸
    ("\\tapple\\n", "apple"),   # 탭 · 줄바꿈 (파일에서 읽은 줄)
    ("APPLE", "apple"),       # 대문자
]</pre>
<p><code>strip()</code> 은 빈칸뿐 아니라 탭 · 줄바꿈도 지워서 넷 다 통과해요. 이런 목록은 pytest 에서는 [[레슨:D9]] 의 <code>@pytest.mark.parametrize</code> 로 쓰면 하나하나가 따로 된 테스트로 보여요.</p>
<p>회귀 테스트는 <b>관련된 테스트 파일</b>에 같이 둬요(<code>test_normalize.py</code>). 「버그 테스트만 모은 파일」 보다 찾기 쉬워요. 그리고 고친 코드와 테스트는 <b>같은 커밋</b>으로 올려요 — 커밋 메시지에 <code>Fixes #12</code> 를 쓰면 GitHub 이 이슈를 닫아 줘요(<a href="../github/#lesson/G9" target="_blank" rel="noopener">GitHub 교과서 「Issues 로 할 일 관리」 ↗</a>).</p>`,
      example: { code: `def normalize(word):
    return word.strip().lower()

cases = [
    ("  Apple", "apple"),
    ("apple  ", "apple"),
    ("\\tapple\\n", "apple"),
    ("APPLE", "apple"),
    ("Ice Cream", "ice cream"),
]
passed = 0
for given, want in cases:
    got = normalize(given)
    if got == want:
        passed += 1
    else:
        print("FAIL", repr(given), "→", repr(got))
print(f"{passed}/{len(cases)} 통과")` } },
  ],
  summary: ['버그를 재현하는 테스트 먼저 → 빨강 확인 → 고쳐서 초록 → 테스트는 남긴다', '보고서의 재현 · 기대 · 실제 = 테스트의 부르기 · assert · 빨강 메시지', '고친 뒤엔 전부 다시 돌리고, 이웃 입력도 함께 테스트'] },
{ id: 'D13', ch: 3, n: 13, title: '커버리지', mode: 'text',
  tutorSummary: '커버리지 = 테스트를 돌리는 동안 코드의 몇 %(줄·갈래)가 실제로 실행됐나. 갈래마다 표시를 남겨 보면 원리가 보인다. python -m pip install coverage → coverage run -m pytest → coverage report -m(Stmts 문장 수 · Miss 안 지나간 수 · Cover % · Missing 안 지나간 줄 번호) → coverage html(htmlcov/index.html, 빨간 줄). .coverage · htmlcov/ 는 .gitignore. 목표는 100% 숫자가 아니라 Missing 의 「빠진 갈래」 를 보고 테스트를 더하는 것. 지나갔다 ≠ 검사했다(assert 없는 테스트도 커버리지는 오름). 줄 100% 여도 if 의 「아닐 때」 길은 빠질 수 있어 --branch(BrPart, 3->5).',
  terms: { '커버리지': '테스트를 돌리는 동안 코드의 몇 퍼센트(줄 · 갈래)가 실제로 실행됐는지 잰 값', '갈래': 'if · else 처럼 코드가 갈라지는 길 하나하나. 테스트가 한 번도 안 지나간 갈래엔 버그가 있어도 모른다' },
  pages: [
    { title: '커버리지 = 테스트가 지나간 줄', html: `<p>테스트가 다 초록이어도 <b>한 번도 실행되지 않은 코드</b>가 있을 수 있어요. 거기 숨은 버그는 테스트가 못 잡아요. 테스트가 코드의 몇 %를 지나갔는지 잰 것이 [[커버리지]]예요.</p>
<p>원리는 간단해요. [[갈래]]마다 「여기 지나감」 표시를 남기고, 테스트를 돌린 뒤 표시가 없는 곳을 보면 돼요.</p>
<pre>hit = set()

def shipping(total, member):
    if total &gt;= 30000:
        hit.add("무료")
        return 0
    if member:
        hit.add("회원")
        return 1500
    hit.add("기본")
    return 3000</pre>
<p>배송비 테스트를 두 개(3만 원 이상 · 보통 손님) 돌리면 둘 다 통과하지만 <code>"회원"</code> 표시는 안 생겨요. 회원 할인 갈래는 <b>한 번도 시험받지 않은</b> 코드예요.</p>
<p>진짜 도구 <b>coverage</b> 는 이 표시를 <b>모든 줄에 저절로</b> 해 줘요. 코드에 <code>hit.add</code> 를 넣을 필요가 없어요 — 다음 쪽에서 써요.</p>`,
      example: { code: `hit = set()

def shipping(total, member):
    if total >= 30000:
        hit.add("무료")
        return 0
    if member:
        hit.add("회원")
        return 1500
    hit.add("기본")
    return 3000

def test_free():
    assert shipping(30000, False) == 0

def test_basic():
    assert shipping(10000, False) == 3000

for t in [test_free, test_basic]:
    t()
print("테스트 2개 통과")
print("지나간 갈래:", sorted(hit))
print("안 지나간 갈래:", sorted({"무료", "회원", "기본"} - hit))` } },
    { title: 'coverage run -m pytest · report -m', html: `<p>coverage 는 따로 설치하는 도구예요. 공부 폴더의 가상 환경을 켜고 설치해요.</p>
<pre>python -m pip install coverage
coverage run -m pytest -q
coverage report -m</pre>
<p><code>coverage run -m pytest</code> 는 「pytest 를 돌리면서 지나간 줄을 기록해」 예요. 기록은 <code>.coverage</code> 파일에 남고, <code>coverage report -m</code> 이 표로 보여 줘요. 앞 쪽의 배송비 코드(<code>shipping.py</code>, 표시 줄 없이 6줄)와 테스트 두 개라면 이렇게 나와요.</p>
<pre>Name               Stmts   Miss  Cover   Missing
------------------------------------------------
shipping.py            6      1    83%   5
test_shipping.py       5      0   100%
------------------------------------------------
TOTAL                 11      1    91%</pre>
<table class="kb"><tbody><tr><th>칸</th><th>뜻</th></tr><tr><td><b>Stmts</b></td><td>실행할 수 있는 줄(문장) 수</td></tr><tr><td><b>Miss</b></td><td>한 번도 안 지나간 줄 수</td></tr><tr><td><b>Cover</b></td><td>지나간 비율. 5/6 = 83%</td></tr><tr><td><b>Missing</b></td><td>안 지나간 <b>줄 번호</b> — 제일 중요한 칸</td></tr></tbody></table>
<p>5번 줄은 <code>return 1500</code>, 회원 갈래예요. <code>coverage html</code> 을 치면 <code>htmlcov/index.html</code> 이 생겨요. 브라우저로 열고 파일 이름을 누르면 안 지나간 줄이 <b>빨간 줄</b>로 칠해져 있어요.</p>
<div class="bk-warn"><b>.gitignore 에 넣기</b> — <code>.coverage</code> 와 <code>htmlcov/</code> 는 내 컴퓨터에서 만든 결과물이라 저장소에 올리지 않아요.</div>`,
      example: { label: '예제 명령 — VS Code 터미널(가상 환경 켜고)', shell: 'python -m pip install coverage\ncoverage run -m pytest -q\ncoverage report -m\ncoverage html\n# htmlcov/index.html 을 브라우저로 열기' } },
    { title: '숫자보다 빠진 갈래 · 지나갔다 ≠ 검사했다', html: `<p>83% 를 보고 「100% 로 올려야지」 하고 아무 테스트나 더하면 안 돼요. <b>Missing 의 줄 번호를 열어 보고</b>, 그 갈래가 무슨 경우인지(「회원이고 3만 원 미만」) 생각해서 그 경우의 테스트를 써요.</p>
<p>그리고 커버리지는 <b>지나갔는지</b>만 재요. <b>맞게 나왔는지</b>는 안 봐요. assert 없이 함수만 부르는 테스트도 커버리지는 올라가요.</p>
<pre>def shipping(total, member):
    if total &gt;= 30000:
        return 0
    if member:
        return 15000      # 버그: 1500 이어야 해요
    return 3000

def test_member_runs():          # 지나가기만 함 — 커버리지 100%
    shipping(10000, True)

def test_member_price():         # 값을 검사함 — 버그를 잡음
    assert shipping(10000, True) == 1500</pre>
<ul><li>커버리지가 <b>낮으면</b> 확실한 신호예요 — 시험받지 않은 코드가 있어요</li><li>커버리지가 <b>높아도</b> 안심은 못 해요 — 검사를 제대로 했는지는 테스트를 읽어 봐야 알아요</li><li>모든 코드를 100% 로 만들 필요는 없어요. 계산 · 규칙 · 돈처럼 <b>틀리면 아픈 곳</b>부터 빠진 갈래를 채워요</li></ul>`,
      example: { code: `def shipping(total, member):
    if total >= 30000:
        return 0
    if member:
        return 15000
    return 3000

def test_member_runs():
    shipping(10000, True)

def test_member_price():
    assert shipping(10000, True) == 1500

for t in [test_member_runs, test_member_price]:
    try:
        t()
        print("PASS", t.__name__)
    except AssertionError:
        print("FAIL", t.__name__, "실제", shipping(10000, True))` } },
    { title: '줄은 다 지나도 길은 빠질 수 있어요 --branch', html: `<p>else 없는 if 는 조심해요. 「참일 때」 한 번만 돌려도 <b>모든 줄</b>이 실행돼서 줄 커버리지는 100% 예요. 그런데 「거짓일 때 if 를 건너뛰는 길」 은 한 번도 안 가 봤어요.</p>
<pre>def greet(name, vip):
    msg = "어서 오세요"
    if vip:
        title = "VIP "
    return title + name + "님, " + msg

print(greet("민수", True))   # VIP 민수님, 어서 오세요</pre>
<p>VIP 테스트 하나면 다섯 줄이 다 지나가요. 그런데 <code>greet("지우", False)</code> 는 <code>title</code> 이 없어서 <code>UnboundLocalError</code> 예요. 이 「건너뛰는 길」 까지 재려면 <code>--branch</code> 를 붙여요.</p>
<pre>coverage run --branch -m pytest -q
coverage report -m

Name            Stmts   Miss Branch BrPart  Cover   Missing
-----------------------------------------------------------
greet.py            5      0      2      1    86%   3-&gt;5
test_greet.py       3      0      0      0   100%</pre>
<p><b>Branch</b> 는 갈래 길 수(if 하나에 참 · 거짓 둘), <b>BrPart</b> 는 한쪽만 가 본 곳 수예요. Missing 의 <code>3-&gt;5</code> 는 「3번 줄(if)에서 5번 줄로 바로 가는 길 — 거짓일 때 — 을 안 가 봤어요」 예요. html 보고서에서는 노란 줄로 보여요.</p>
<p>고치는 법은 [[레슨:D12]] 그대로예요 — <code>vip=False</code> 테스트를 먼저 써서 빨강을 보고, if 앞에 <code>title = ""</code> 를 넣어 초록으로.</p>`,
      example: { code: `def greet(name, vip):
    msg = "어서 오세요"
    if vip:
        title = "VIP "
    return title + name + "님, " + msg

print(greet("민수", True))
try:
    print(greet("지우", False))
except UnboundLocalError as e:
    print("거짓 길에서 에러:", type(e).__name__)

def greet_fixed(name, vip):
    msg = "어서 오세요"
    title = ""
    if vip:
        title = "VIP "
    return title + name + "님, " + msg

print(greet_fixed("지우", False))` } },
  ],
  summary: ['커버리지 = 테스트가 실제로 지나간 줄 · 갈래의 비율', 'coverage run -m pytest → coverage report -m 의 Missing 줄 번호를 본다', '지나갔다 ≠ 검사했다 · else 없는 if 는 --branch 로'] },
{ id: 'D14', ch: 3, n: 14, title: '버그 보고서 · CI 에서 테스트', mode: 'text',
  tutorSummary: '좋은 버그 보고 = 제목(언제 무엇이) · 환경(파이썬 버전 · OS · 라이브러리 버전: python --version, pip show) · 재현 단계(번호) · 기대 vs 실제(에러는 트레이스백 전체 복사) · 최소 재현 코드. 최소 재현은 버그가 남는 한 계속 지우기 — 적립금 프로그램이 round(2.5) == 2(짝수 쪽 반올림) 한 줄로 줄어듦. CI(지속적 통합) = push · PR 마다 GitHub Actions 가 .github/workflows/test.yml(checkout → setup-python → pip install pytest → python -m pytest -q) 을 돌려 끝 코드 0 이면 초록 ✓, 아니면 빨간 ✗(GitHub 교과서 「GitHub Actions 첫 워크플로」). 빨간 ✗ 이면 로그 맨 아래 → 내 PC 에서 재현 → 회귀 테스트 → 고치기. CI 에서만 실패하는 흔한 이유: push 안 한 파일, pip install 빠짐, 파일 이름 대소문자(리눅스는 구분), 실행 폴더(open("words.txt") 대신 Path(__file__).resolve().parent / "words.txt").',
  terms: { '재현 단계': '버그를 다른 사람도 똑같이 일으킬 수 있게 번호를 붙여 적은 순서', 'CI': '지속적 통합. push · PR 마다 다른 컴퓨터가 테스트를 저절로 돌려 결과를 알려 주는 것. GitHub 에서는 Actions 로 한다' },
  pages: [
    { title: '버그 보고서 — 재현 단계 · 기대 vs 실제', html: `<p>남의 프로그램(또는 팀 동료의 코드)에서 버그를 찾으면 보고서를 써요. 「안 돼요」 한 줄이면 받는 사람이 처음부터 다시 찾아야 해요. 좋은 보고서는 <b>읽는 사람이 5분 안에 버그를 다시 볼 수 있게</b> 써요.</p>
<pre>제목: 쿠폰이 합계보다 크면 결제 금액이 음수로 나와요

환경
- Windows 11, Python 3.13.1, shop 1.2.0

재현 단계
1. 5000원짜리 상품 하나를 담아요
2. 10000원 쿠폰을 써요
3. 「결제」 를 눌러요

기대한 결과: 0원
실제 결과: -5000원 (에러는 없음)

최소 재현 코드
print(total([5000], coupon=10000))   # -5000</pre>
<table class="kb"><tbody><tr><th>칸</th><th>왜 필요한가</th></tr><tr><td><b>제목</b></td><td>「언제 · 무엇이」 한 줄. 목록에서 보고 찾을 수 있게</td></tr><tr><td><b>환경</b></td><td>버전마다 다르게 도는 버그가 많아요. <code>python --version</code> · <code>python -m pip show 라이브러리</code></td></tr><tr><td><b>[[재현 단계]]</b></td><td>번호를 붙여 그대로 따라 하면 버그가 나게</td></tr><tr><td><b>기대 vs 실제</b></td><td>「무엇이 틀렸나」 의 기준. 에러면 트레이스백을 <b>전부</b> 복사해 붙여요</td></tr><tr><td><b>최소 재현</b></td><td>버그가 나는 가장 짧은 코드(다음 쪽)</td></tr></tbody></table>
<p>GitHub 저장소라면 <b>Issues</b> 에 이 모양으로 써요(<a href="../github/#lesson/G9" target="_blank" rel="noopener">GitHub 교과서 「Issues 로 할 일 관리」 ↗</a>). 예제는 「환경」 칸에 붙일 정보를 찍어요 — 결과는 컴퓨터마다 달라요.</p>`,
      example: { code: `import platform
import sys

print("OS:", platform.system(), platform.release())
print("Python:", platform.python_version())
print("실행 파일:", sys.executable)
try:
    import pytest
    print("pytest:", pytest.__version__)
except ImportError:
    print("pytest: 설치 안 됨")` } },
    { title: '최소 재현 — 한 줄까지 줄이기', html: `<p>보고: 「50원짜리 상품의 적립금이 2원이에요. 5% 면 2.5원이니 반올림해서 3원이어야 해요」. 적립금 프로그램은 수십 줄이지만, 버그가 남는 한 계속 지워 봐요([[레슨:D3]] 의 반으로 나누기).</p>
<ol><li>새 파일에 문제 코드를 복사해요</li><li>상관없어 보이는 줄을 지우고 돌려 봐요</li><li>버그가 <b>아직 나면</b> 지운 채로, <b>사라지면</b> 되돌리고 다른 곳을 지워요</li><li>더 지울 게 없을 때까지</li></ol>
<p>이 적립금 버그는 끝까지 줄이면 한 줄이 남아요.</p>
<pre>print(round(2.5))   # 2
print(round(3.5))   # 4</pre>
<p>파이썬의 <code>round</code> 는 딱 절반(.5)이면 <b>짝수 쪽</b>으로 보내요(은행가 반올림). 버그는 상품 · 장바구니 코드가 아니라 「round 가 학교 반올림과 다르다」 였어요. 줄이다 보면 원인을 스스로 찾는 일이 많아요 — 보고서를 쓰기 전에 줄여 보는 이유예요.</p>
<p>양수 금액에서 학교 반올림이 필요하면 <code>int(x + 0.5)</code> 처럼 직접 써요. 고친 뒤엔 [[레슨:D12]] 처럼 <code>2.5 → 3</code> 회귀 테스트를 남겨요.</p>`,
      example: { code: `print(round(2.5), round(3.5), round(4.5))

def round_half_up(x):
    return int(x + 0.5)

print(round_half_up(2.5), round_half_up(3.5), round_half_up(4.5))

def point(price):
    return round_half_up(price * 0.05)

assert point(50) == 3, "버그 #21: 50원 적립금은 3원"
print("적립금 50원 →", point(50), "원")` } },
    { title: 'CI — push 마다 GitHub 이 pytest 를', html: `<p>테스트가 아무리 좋아도 <b>안 돌리면</b> 소용없어요. 바쁠 때 깜빡하고 push 하기 쉬워요. [[CI]](지속적 통합)는 push · PR 마다 다른 컴퓨터가 테스트를 저절로 돌려 주는 거예요. GitHub 에서는 <b>Actions</b> 로 해요. 처음 만드는 법은 <a href="../github/#lesson/G14" target="_blank" rel="noopener">GitHub 교과서 「GitHub Actions 첫 워크플로」 ↗</a>에 있어요. 여기선 pytest 로 돌리는 모양만 봐요.</p>
<pre>name: test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-python@v7
        with:
          python-version: "3.13"
      - run: python -m pip install pytest
      - run: python -m pytest -q</pre>
<p>저장소의 <code>.github/workflows/test.yml</code> 로 저장하고 push 하면, GitHub 의 컴퓨터가 ① 저장소 받기 ② 파이썬 준비 ③ pytest 설치 ④ <code>python -m pytest -q</code> 를 해요. 라이브러리를 더 쓰면 <code>requirements.txt</code> 에 적고 설치 줄을 <code>python -m pip install -r requirements.txt</code> 로 바꿔요.</p>
<p>Actions 가 보는 건 <b>끝 코드 하나</b>예요([[레슨:D11]] 의 표). 0 이면 초록 ✓, 아니면 빨간 ✗. 예제는 같은 판단을 내 컴퓨터에서 해 봐요.</p>`,
      example: { code: `import subprocess, sys
from pathlib import Path

def ci():
    r = subprocess.run([sys.executable, "-B", "-m", "pytest", "-q", "-p", "no:cacheprovider"], capture_output=True, text=True)
    return "초록 ✓" if r.returncode == 0 else f"빨간 ✗ (끝 코드 {r.returncode})"

Path("test_calc.py").write_text("def add(a, b):\\n    return a + b\\n\\ndef test_add():\\n    assert add(2, 3) == 5\\n", encoding="utf-8")
print("첫 push:", ci())

Path("test_calc.py").write_text("def add(a, b):\\n    return a - b\\n\\ndef test_add():\\n    assert add(2, 3) == 5\\n", encoding="utf-8")
print("실수한 push:", ci())` } },
    { title: 'CI 에서만 빨간 ✗ — Path(__file__) 로 찾기', html: `<p>빨간 ✗ 를 받으면 Actions 탭 → 실행 → 빨간 단계를 펼쳐 <b>로그 맨 아래</b>를 읽어요. pytest 의 <code>FAILED …</code> 줄이 보이면 내 컴퓨터에서 같은 테스트를 돌려 재현 → 회귀 테스트([[레슨:D12]]) → 고치기 → push 예요.</p>
<p>「내 컴퓨터에선 초록인데 CI 에서만 빨강」 이면 보통 이 넷이에요.</p>
<table class="kb"><tbody><tr><th>이유</th><th>고치기</th></tr><tr><td>새 파일을 <code>git add</code> 안 함</td><td><code>git status</code> 로 확인하고 올리기</td></tr><tr><td>내 컴퓨터에만 깔린 라이브러리</td><td>yml 의 설치 줄 · <code>requirements.txt</code> 에 적기</td></tr><tr><td>파일 이름 대소문자</td><td>Windows 는 <code>Data.txt</code> 와 <code>data.txt</code> 를 같게 보지만 리눅스(CI)는 달라요. 이름을 똑같이</td></tr><tr><td>실행하는 폴더가 다름</td><td><code>open("words.txt")</code> 는 <b>지금 폴더</b> 기준이에요. 코드 파일 기준으로 찾기</td></tr></tbody></table>
<p>마지막이 제일 헷갈려요. VS Code 에서 공부 폴더를 열고 돌리면 되는데, CI 나 다른 폴더에서 돌리면 <code>FileNotFoundError</code> 예요. 코드 파일이 있는 폴더를 기준으로 경로를 만들면 어디서 돌려도 같아요.</p>
<pre>from pathlib import Path

HERE = Path(__file__).resolve().parent   # 이 .py 파일이 있는 폴더
words = (HERE / "words.txt").read_text(encoding="utf-8").split()</pre>`,
      example: { code: `import os
from pathlib import Path

HERE = Path(__file__).resolve().parent
(HERE / "words.txt").write_text("apple\\nbanana\\n", encoding="utf-8")

os.makedirs("elsewhere", exist_ok=True)
os.chdir("elsewhere")
print("지금 폴더:", Path.cwd().name)

try:
    open("words.txt", encoding="utf-8")
except FileNotFoundError:
    print("open(\\"words.txt\\") → FileNotFoundError")

words = (HERE / "words.txt").read_text(encoding="utf-8").split()
print("HERE / \\"words.txt\\" →", words)` } },
  ],
  summary: ['보고서: 제목 · 환경 · 재현 단계 · 기대 vs 실제 · 최소 재현 코드', 'CI: test.yml 에서 pip install pytest → python -m pytest -q, 끝 코드 0 = 초록 ✓', 'CI 에서만 빨강: 안 올린 파일 · 설치 빠짐 · 대소문자 · 실행 폴더(Path(__file__))'] },
{ id: 'DB3', ch: 3, boss: true, title: '만들어 보기: TDD 로 만드는 단어장', mode: 'text',
  tutorSummary: '챕터 3 종합. 단어장 Vocab 클래스를 TDD 로 한 단계씩: ① add · count(앞뒤 빈칸 · 대문자 정리, 같은 단어는 뜻만 바꿈) ② find(없으면 None) · starts_with(정렬된 목록) ③ record(맞음/틀림) · quiz_order(틀린 횟수 많은 것 먼저, 같으면 가나다순, 없는 단어는 KeyError) ④ remove + 버그 보고(지웠다 다시 넣으면 옛 틀린 횟수가 남음)를 회귀 테스트로 → 고치기 → pytest.main 으로 전부. 단계마다 테스트를 먼저 쓰고 빨강을 본 뒤 코드, 앞 단계 테스트는 계속 남겨 함께 돌린다.', pages: [], summary: [] },
];
const PROBLEMS = []; // 교과서 전용 코스 — 문제·채점 없음(「만들어 보기」는 book.js)
