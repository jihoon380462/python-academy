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
{ id: 'D0', ch: 0, n: 0, title: '버그는 어디서 오나', mode: 'text', draft: true,
  tutorSummary: '문법 · 실행 · 논리 버그 · 고치는 차례 · 추측 금지',
  pages: DEBUG_TODO('문법 · 실행 · 논리 버그 · 고치는 차례 · 추측 금지'), summary: ["문법", "실행", "논리 버그"] },
{ id: 'D1', ch: 1, n: 1, title: '트레이스백 끝까지 읽기', mode: 'text', draft: true,
  tutorSummary: '맨 아래부터 · 내 파일 줄 · 연쇄 예외',
  pages: DEBUG_TODO('맨 아래부터 · 내 파일 줄 · 연쇄 예외'), summary: ["맨 아래부터", "내 파일 줄", "연쇄 예외"] },
{ id: 'D2', ch: 1, n: 2, title: 'print · logging 디버깅', mode: 'text', draft: true,
  tutorSummary: 'f"{x=}" · logging 레벨',
  pages: DEBUG_TODO('f"{x=}" · logging 레벨'), summary: ["f\"{x=}\"", "logging 레벨", "print · logging 디버깅"] },
{ id: 'D3', ch: 1, n: 3, title: '범위 좁히기', mode: 'text', draft: true,
  tutorSummary: '반으로 나누기 · 최소 재현 예',
  pages: DEBUG_TODO('반으로 나누기 · 최소 재현 예'), summary: ["반으로 나누기", "최소 재현 예", "범위 좁히기"] },
{ id: 'D4', ch: 1, n: 4, title: '디버거', mode: 'text', draft: true,
  tutorSummary: 'VS Code 중단점 · 한 줄씩 · breakpoint() · pdb',
  pages: DEBUG_TODO('VS Code 중단점 · 한 줄씩 · breakpoint() · pdb'), summary: ["VS Code 중단점", "한 줄씩", "breakpoint()"] },
{ id: 'D5', ch: 1, n: 5, title: '흔한 버그 도감', mode: 'text', draft: true,
  tutorSummary: '하나 차이 · 가변 기본값 · 얕은 복사 · is vs ==',
  pages: DEBUG_TODO('하나 차이 · 가변 기본값 · 얕은 복사 · is vs =='), summary: ["하나 차이", "가변 기본값", "얕은 복사"] },
{ id: 'DB1', ch: 1, boss: true, title: '만들어 보기: 버그 사냥', mode: 'text', draft: true,
  tutorSummary: '만들어 보기: 버그 사냥', pages: [], summary: [] },
{ id: 'D6', ch: 2, n: 6, title: "테스트 함수 다시 보기", mode: 'text',
  tutorSummary: "파이썬 교과서 L21(assert · 테스트 함수 · 경계값)을 다시 가르치지 않고 링크. 테스트 하나는 준비 → 실행 → 확인 세 칸, 결과는 got · 기대는 want, 기대 값은 손으로 계산한 값(함수와 같은 계산 금지). 이름은 상황 + 기대(test_total_empty_cart_is_zero, 한글 이름도 됨), 테스트 하나에 상황 하나. assert got == want, f\"{got=} {want=}\" 로 단서 남기기, 길이 말고 통째로 비교, 소수는 math.isclose. 늘 통과하는 테스트 네 가지(assert 빠뜨림 · 괄호 없는 함수 · 괄호로 묶은 튜플 · 함수끼리 비교) — 새 테스트는 한 번 일부러 깨뜨려 보기. globals() 에서 test_ 함수를 모아 돌리는 작은 실행기 = pytest 가 할 일. python -O 는 assert 를 끄니 프로그램의 입력 검사는 if + raise.",
  terms: { "준비 · 실행 · 확인": "테스트 하나를 세 칸으로 나눠 쓰는 모양. 값을 만들고(준비), 함수를 한 번 부르고(실행), assert 로 비교해요(확인)", "테스트 실행기": "테스트 함수를 찾아 차례로 부르고 통과 · 실패를 세어 알려 주는 프로그램. pytest 가 대표예요" },
  pages: [
    { title: "assert got == want · 준비 → 실행 → 확인", html: `<p><a href="../python/#lesson/L21" target="_blank" rel="noopener">파이썬 교과서 「테스트 작성」 ↗</a> 에서 <code>assert</code> · 테스트 함수 · 경계값을 배웠어요. 여기서는 그걸 다시 설명하지 않고, 테스트를 <b>읽기 좋고 믿을 수 있게</b> 쓰는 모양을 다듬어요. 다음 레슨부터는 pytest 가 이 모양 그대로 테스트를 돌려 줘요.</p>\n<p>테스트 하나는 세 칸으로 써요([[준비 · 실행 · 확인]]).</p>\n<table class="kb"><tbody><tr><td><b>준비</b></td><td>넣을 값과 기대하는 값을 만들어요</td></tr><tr><td><b>실행</b></td><td>테스트할 함수를 <b>한 번</b> 불러요</td></tr><tr><td><b>확인</b></td><td>assert 로 결과와 기대를 비교해요</td></tr></tbody></table>\n<pre>def total_price(items):\n    return sum(price * qty for price, qty in items)\n\ndef test_total_price_two_items():\n    # 준비\n    items = [(1000, 2), (500, 1)]\n    want = 2500\n    # 실행\n    got = total_price(items)\n    # 확인\n    assert got == want</pre>\n<p>결과는 <code>got</code>(받은 값), 기대는 <code>want</code>(바라는 값)처럼 이름을 붙여 두면 assert 줄이 한눈에 읽혀요.</p>\n<div class="bk-warn"><b>기대 값은 손으로</b> — <code>want = sum(p * q for p, q in items)</code> 처럼 함수와 <b>같은 계산</b>을 또 하면, 둘이 같이 틀려도 통과해요. 기대 값은 종이에 계산한 숫자 <code>2500</code> 을 그대로 적어요.</div>`,
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
    { title: "tmp_path — 테스트마다 새 빈 폴더", html: `<p>파일을 읽고 쓰는 함수를 테스트하면서 진짜 파일을 건드리면 안 돼요. 내 데이터가 덮어써지거나, 앞 테스트가 남긴 파일 때문에 결과가 달라져요. pytest 에 들어 있는 fixture <code>tmp_path</code> 는 <b>테스트마다 새 빈 폴더</b>를 만들어 줘요.</p>\n<pre>import json\n\n\ndef save_scores(path, scores):\n    with open(path, "w", encoding="utf-8") as f:\n        json.dump(scores, f, ensure_ascii=False)\n\n\ndef load_scores(path):\n    try:\n        with open(path, encoding="utf-8") as f:\n            return json.load(f)\n    except FileNotFoundError:\n        return {}</pre>\n<pre>def test_save_then_load(tmp_path):\n    path = tmp_path / "scores.json"\n    save_scores(path, {"민수": 90})\n    assert load_scores(path) == {"민수": 90}\n\n\ndef test_file_is_utf8_json(tmp_path):\n    path = tmp_path / "scores.json"\n    save_scores(path, {"지우": 85})\n    assert path.read_text(encoding="utf-8") == '{"지우": 85}'\n\n\ndef test_missing_file_is_empty(tmp_path):\n    assert load_scores(tmp_path / "없음.json") == {}</pre>\n<ul><li><code>tmp_path</code> 는 만들 필요 없이 매개변수에 이름만 적으면 돼요(pytest 에 들어 있는 fixture)</li><li>값은 <code>Path</code> 라서 <code>tmp_path / "scores.json"</code> 으로 경로를 만들어요(<a href="../python/#lesson/L17B" target="_blank" rel="noopener">파이썬 교과서 「파일 2: 경로 · 인코딩 · JSON」 ↗</a>)</li><li><code>path.read_text(encoding="utf-8")</code> 로 <b>파일에 실제로 적힌 글</b>까지 확인할 수 있어요</li><li>폴더는 내 컴퓨터의 임시 폴더 안에 생기고, pytest 가 오래된 것부터 알아서 지워요</li></ul>\n<p>예제를 돌리면 테스트가 끝난 뒤에도 지금 폴더에는 scores.json 이 없어요. 테스트는 tmp_path 안에서만 썼으니까요.</p>`,
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
    { title: "monkeypatch.setattr — 잠깐 바꿔 끼우기", html: `<p>주사위 함수는 부를 때마다 결과가 달라서 「6 이 나오면 대박」 을 테스트하기 어려워요. pytest 의 [[monkeypatch]] fixture 로 <code>random.randint</code> 를 테스트 동안만 「늘 6」 으로 바꿔 끼워요(<a href="../python/#lesson/L16" target="_blank" rel="noopener">파이썬 교과서 「모듈과 random」 ↗</a>).</p>\n<pre>import random\n\n\ndef roll_message():\n    n = random.randint(1, 6)\n    if n == 6:\n        return "대박! 6"\n    return f"{n} 나왔어요"\n\n\ndef test_six(monkeypatch):\n    monkeypatch.setattr(random, "randint", lambda a, b: 6)\n    assert roll_message() == "대박! 6"\n\n\ndef test_three(monkeypatch):\n    monkeypatch.setattr(random, "randint", lambda a, b: 3)\n    assert roll_message() == "3 나왔어요"</pre>\n<ul><li><code>monkeypatch.setattr(대상, "이름", 새 값)</code> — 대상(모듈 · 객체)의 그 이름을 새 값으로 바꿔요</li><li><code>lambda a, b: 6</code> 은 진짜 randint 처럼 두 개를 받고 늘 6 을 돌려주는 함수예요(<a href="../python/#lesson/L18" target="_blank" rel="noopener">파이썬 교과서 「람다와 정렬 기준」 ↗</a>)</li><li>테스트가 끝나면 <b>원래대로 되돌려</b> 줘요. 다른 테스트는 진짜 randint 를 써요</li></ul>\n<p><code>input()</code> 도 바꿔 끼울 수 있어요. 키보드 없이 「사용자가 이렇게 쳤다」 고 정해 두는 거예요.</p>\n<pre>def ask_name():\n    name = input("이름: ")\n    return name.strip() or "손님"\n\n\ndef test_blank_name_is_guest(monkeypatch):\n    monkeypatch.setattr("builtins.input", lambda prompt="": "   ")\n    assert ask_name() == "손님"</pre>\n<p>답이 여러 번이면 <code>answers = iter(["abc", "7"])</code> 로 만들고 <code>lambda prompt="": next(answers)</code> 로 하나씩 꺼내 줘요. 환경 변수는 <code>monkeypatch.setenv("WEATHER_KEY", "test-key")</code> — 진짜 키 없이 테스트해요(<a href="../api/#lesson/H7" target="_blank" rel="noopener">HTTP·API·SDK 교과서 「토큰 · .env」 ↗</a>).</p>`,
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
print(" ".join(clap(n) for n in range(1, 14)))` } },
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
    { title: '최소 재현 — print(round(2.5)) 까지 줄이기', html: `<p>보고: 「50원짜리 상품의 적립금이 2원이에요. 5% 면 2.5원이니 반올림해서 3원이어야 해요」. 적립금 프로그램은 수십 줄이지만, 버그가 남는 한 계속 지워 봐요([[레슨:D3]] 의 반으로 나누기).</p>
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
