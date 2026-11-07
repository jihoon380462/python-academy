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
{ id: 'D6', ch: 2, n: 6, title: '테스트 함수 다시 보기', mode: 'text', draft: true,
  tutorSummary: 'assert · 테스트 함수 · 이름',
  pages: DEBUG_TODO('assert · 테스트 함수 · 이름'), summary: ["assert", "테스트 함수", "이름"] },
{ id: 'D7', ch: 2, n: 7, title: 'pytest 시작', mode: 'text', draft: true,
  tutorSummary: 'test_*.py · python -m pytest -q · -k · -x',
  pages: DEBUG_TODO('test_*.py · python -m pytest -q · -k · -x'), summary: ["test_*.py", "python -m pytest -q", "-k"] },
{ id: 'D8', ch: 2, n: 8, title: '경계값과 같은 무리 나누기', mode: 'text', draft: true,
  tutorSummary: '경계값 · 등가 분할',
  pages: DEBUG_TODO('경계값 · 등가 분할'), summary: ["경계값", "등가 분할", "경계값과 같은 무리 나누기"] },
{ id: 'D9', ch: 2, n: 9, title: 'fixture 와 parametrize', mode: 'text', draft: true,
  tutorSummary: '@pytest.fixture · tmp_path · parametrize',
  pages: DEBUG_TODO('@pytest.fixture · tmp_path · parametrize'), summary: ["@pytest.fixture", "tmp_path", "parametrize"] },
{ id: 'D10', ch: 2, n: 10, title: '예외 · 가짜 객체 테스트', mode: 'text', draft: true,
  tutorSummary: 'pytest.raises · monkeypatch',
  pages: DEBUG_TODO('pytest.raises · monkeypatch'), summary: ["pytest.raises", "monkeypatch", "예외 · 가짜 객체 테스트"] },
{ id: 'DB2', ch: 2, boss: true, title: '만들어 보기: 계산기 테스트 묶음', mode: 'text', draft: true,
  tutorSummary: '만들어 보기: 계산기 테스트 묶음', pages: [], summary: [] },
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
