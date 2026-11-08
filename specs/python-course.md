# 파이썬 교과서 — 검토와 키우기 설계 (45 → 58)

파이썬 교과서 45 레슨이 충분한지 검토하고, 부족한 것을 채워 58 레슨으로 키운 설계예요. 11/7 Opus 가 썼어요.

## 지금 상태

| 항목 | 값 |
|---|---|
| 상태 | ✅ 끝남 — v2.30.0 에서 58 레슨 완성 |
| 그 뒤 | v2.36.0 에 66 · v2.37.0 에 67 · v2.38.0 에 100 레슨 ([`python-review.md`](python-review.md) · [`python-100.md`](python-100.md)) |
| 지금 레슨의 기준 | `courses/python/content.js` |

이 문서의 레슨 중 v2.36.0 · v2.37.0 에 둘로 나뉜 것이 있어요. 아래 5절은 나누기 전 모양이에요.

| 이 문서의 레슨 | 떼어 낸 새 레슨 (지금 제목) |
|---|---|
| L8B | L8C 함수 3: 범위 · 문서 · *args |
| L9B | L9C 서식 출력: 칸 맞추기 · 소수 · 쉼표 |
| L15B | L15E 클래스 4: 클래스 속성 · property · dataclass |
| L16C | L16E 표준 라이브러리 둘러보기 |
| L17B | L17C JSON 으로 저장하기 |
| L18D | L18F 데코레이터 (L18D 는 지금 「클로저 · nonlocal」) |
| L18E | L18G 타입 힌트 2: \| None · 클래스 · isinstance |
| L19B | L19C 명령 줄 프로그램 2: 하위 명령 · 끝 코드 |

어떻게 시작했나
- 11/7 사용자가 45 레슨으로 충분한지 검토하고, 부족하면 설계까지 하라고 했어요.
- 이 문서는 **검토 결과 + 설계**예요. 기술적인 선택은 Claude 가 정했어요(HANDOFF 3절). 이유는 9절에 있어요.
- 형식은 [`specs/web-course.md`](web-course.md) 와 같아요.

---

## 1. 검토 결과 — 한 줄로

**기초 문법은 고르게 있지만, 「혼자 프로그램을 끝까지 만들기」 와 다른 교과서가 기대는 주제가 12가지 빠져 있어요.** 그래서 **레슨 12 + 만들어 보기 1 을 더해 58** 로 키워요.
- 있는 기초 문법: 출력 · 변수 · 조건 · 반복 · 리스트 · 딕셔너리 · 함수 · 클래스 · 파일 · 예외 · 실전 프로젝트.

### 지금 있는 것 (45 = 설명 레슨 39 + 만들어 보기 6)

| 챕터 | 레슨 | 한 레슨의 크기 |
| --- | --- | --- |
| 0 시작 | L0 | 5쪽 |
| 1 첫걸음 | L1 print · L2 변수 · L3 계산 · L3B input · L4 조건문 · B1 | 4~8쪽, 글 700~1,400자 |
| 2 반복과 묶음 | L5 for · L6 while · L7 리스트 · L7B 리스트 넣고 빼기 · L8 함수 · B2 | 4~8쪽 |
| 3 데이터 다루기 | L9 문자열 · L10 · L10B 딕셔너리 · L11 튜플 · L11B 집합 · L11C 컴프리헨션 · L12 · L12B · L12C · B3 | 3~8쪽 |
| 4 더 큰 프로그램 | L13 예외 · L14 · L15 클래스 · L16 모듈과 random · L16B 날짜 맛보기 · B4 | 3~7쪽 |
| 5 마무리 | L17 파일 · L18 람다 · L18B map·filter·enumerate·zip · B5 | 3~8쪽 |
| 6 실전 | X1 CSV 분석기 · X2 단어 퀴즈 · X3 할 일 앱 · X4 가계부 | 6~8쪽, 글 1,800~2,700자 |
| 7 한 걸음 더 | L19 날짜와 시간 · L20 정규표현식 · L21 테스트 · L22 디버깅 · L23 리팩터링 · B7 · X5 · X6 | 6~9쪽 |

### 빠진 것

어떻게 찾았나: 저장소 전체를 찾아서, 0번 나오거나 실전 레슨에서 설명 없이 처음 쓰이는 것을 골랐어요.

| # | 빠진 주제 | 왜 필요한가 | 지금 |
| --- | --- | --- | --- |
| 1 | **`raise` · 내 예외 만들기** | 함수가 약속을 못 지킬 때 알리는 법. 없으면 잘못된 값을 조용히 돌려줘요 | `raise` 0번. HTTP·API·SDK 레슨 14 가 「파이썬 교과서의 예외 만들기」 를 가리키는데 **없음** |
| 2 | **제너레이터 · `yield`** | 큰 파일 · 쪽으로 나뉜 데이터를 하나씩 | `yield` 0번. HTTP·API·SDK 레슨 15 가 「파이썬 교과서의 제너레이터」 를 가리키는데 **없음** |
| 3 | **함수를 값처럼 · 데코레이터** | `@app.get` · `@dataclass` · `@property` 를 읽으려면 | 「데코레이터」 0번. HTTP·API·SDK 레슨 10 이 가리키는데 **없음** |
| 4 | **함수 2: 기본값 · 키워드 인자 · 여러 값 돌려주기 · 변수 범위 · docstring** | 함수를 「내가 쓰기 좋게」 만드는 법. 범위(지역/바깥 변수)는 초보 버그 1순위 | L8 은 만들기 · 매개변수 · return 만. 키워드 인자 · docstring 0번 |
| 5 | **내 모듈 · 패키지 · `if __name__ == "__main__"`** | 파일 하나를 넘는 프로그램 | 0번(`random.py` 로 저장하면 생기는 함정도 없음) |
| 6 | **pip · 가상 환경(venv) · requirements.txt** | 남의 라이브러리를 깔고 프로젝트마다 나누기. HTTP·API·SDK · 데이터 분석 · LLM 교과서가 다 씀 | 0번 |
| 7 | **명령 줄 프로그램(`sys.argv` · `argparse`)** | `python todo.py add 장보기` 같은 진짜 도구. 운영체제 · HTTP·API·SDK(HB4)가 씀 | 0번 |
| 8 | **경로(`pathlib`) · 인코딩 · JSON 저장 기본** | Windows 에서 한글이 깨지는 `encoding` 함정, 「실행 위치」 함정 | `pathlib` 0번. JSON 은 실전 X3 에서 설명 없이 처음 |
| 9 | **타입 힌트** | VS Code 자동 완성 · dataclass · FastAPI 의 입력 검사가 이걸로 돌아감 | 0번 |
| 10 | **클래스 3: 특수 메서드 · `@property` · `@dataclass`** | 객체를 비교 · 정렬 · 보기 좋게 출력, 칸만 적는 클래스 | `__repr__` · `__eq__` · dataclass 0번 |
| 11 | **리스트 더: 자르기 · `insert` · `remove` · `extend` · `index` · `count`** | 리스트를 고치는 기본 동작 | `insert` · `remove` · `extend` 0번 |
| 12 | **문자열 더: `find` · `startswith` · `isdigit` · 칸 맞추기 f-string** | 입력 검사 · 표 출력 | 칸 맞추기 · `,` · `.2f` 는 실전 X 레슨에서 설명 없이 처음 |

- 재귀 · `Counter` · `defaultdict` · `heapq` 는 **알고리즘 교과서**에 있어요(재귀 58번 등). 여기서는 다시 안 가르치고 링크만 둬요.

## 2. 다른 교과서와의 경계

| 주제 | **파이썬 교과서** | 다른 교과서 |
| --- | --- | --- |
| 문법 · 표준 라이브러리 기본 · 작은 프로그램 끝까지 | ✅ 여기가 기준 | — |
| 재귀 · 자료구조 · `Counter` · `deque` · `heapq` · 정렬 알고리즘 | 링크만 | 알고리즘 교과서 |
| 클래스 기본 · 특수 메서드 · dataclass · 내 예외 | ✅ 여기(L14 · L15 · L15B · L15C) | 설계 원칙 · 디자인 패턴은 예정 T5 객체지향 |
| assert · 테스트 함수 · 디버깅 사고법 | ✅ 여기(L21 · L22) | pytest · TDD 심화는 예정 T3 |
| pip · venv · 패키지 폴더 · `__name__` | ✅ 여기(L16C · L16D) | `pyproject.toml` · `pip install -e .` 은 HTTP·API·SDK 레슨 16 |
| `requests` · HTTP · FastAPI | 링크만(L16D 의 설치 예가 `requests`) | HTTP·API·SDK 교과서 |
| `os.fork` · 시그널 · 파이프 | — | 운영체제 교과서 |
| pandas · matplotlib | — | 예정 T4 데이터 분석 |

T3 · T4 · T5 는 그 뒤 v2.33.0 에 만들어졌어요(TODO 3절).

## 3. 원칙 (웹 교과서 키우기와 같음)

- **지금 레슨 id 는 그대로**(L0 ~ X6 · B1 ~ B7). 새 레슨은 사이에 끼워 `L7C` · `L8B` … 로 붙여요.
  - 까닭: 기기에 쌓인 「읽은 레슨」 · 주소 · 다른 교과서의 링크가 안 깨져요.
  - `COURSE_ID_PATTERNS.python`(`^(L|B|X)\d+[A-Z]?…`)은 이미 `L7C` 모양을 받아요.
- 새 만들어 보기는 비어 있는 **`B6`** 이에요.
- 레슨 번호(n)는 목차 순서대로 다시 매겨요(0 ~ 50).
  - 본문 · 다른 교과서에 「레슨 N」 이 숫자로 적힌 곳은 만들 때 `[[레슨:ID]]` 또는 새 번호로 바꿔요(알고리즘 교과서 v2.20.0 과 같은 방법).
- 표시: ✏ = 지금 레슨을 그대로 두고 쪽 하나를 더함 · 🆕 = 새로.
- 쪽은 3~4쪽, 쪽마다 기능 하나, 만들어 보기 2~3개예요.
  - 채점은 지금 검사 그대로(파이썬 실행으로 출력 예 비교).
  - 설치 · 터미널에서 하는 것(venv · pip)만 「내 화면에서 확인할 것」 ☐.

## 4. 「먼저 꼭」 경고 (더하는 것)

**L16D · 챕터 4 끝 — PowerShell 에서 가상 환경 켜기가 막히면**
- `.venv\Scripts\Activate.ps1` 이 「이 시스템에서 스크립트를 실행할 수 없으므로」 로 막힐 때예요.
- `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` 를 한 번 해요(내 계정에서만).
- 또는 Git Bash 의 `source .venv/Scripts/activate`.

**L16C — 내 파일 이름을 모듈 이름으로 짓지 않기**
- `random.py` · `json.py` 로 저장하면 `import random` 이 내 파일을 가져와요.
- 에러: `AttributeError: module 'random' has no attribute 'randint'`

**L17B — 파일은 늘 `encoding="utf-8"`**
- Windows 의 기본 인코딩은 cp949 라 한글 파일이 `UnicodeDecodeError` 나 깨진 글자로 나와요.

## 5. 목차 (챕터 8 · 설명 레슨 51 + 만들어 보기 7 = 58)

### 챕터 2 · 반복과 묶음 (+2)

**L7C 🆕 리스트 더 다루기** (L7B 다음)
- 쪽
  1. 자르기 `a[1:3]` · `a[-1]` · `a[::-1]` — 레슨 9 의 문자열 자르기와 같은 모양이라 여기서 먼저
  2. 찾기 `in` · `index` · `count` · `sum` · `min` · `max`
  3. 고치기 `insert` · `remove` · `extend` · `del a[i]` · `a + b` · 빈 리스트 검사 `if not a:`
- 만들어 보기: 장바구니 고치기(넣기 · 빼기 · 찾기) · 점수 목록 요약(합 · 평균 · 최고)

**L8B 🆕 함수 2: 기본값 · 키워드 · 범위** (L8 다음)
- 쪽
  1. 기본값 `def greet(name, end="!")` · 키워드로 부르기 `greet(end="?", name="지훈")`
  2. 여러 값 돌려주기 `return low, high` → `a, b = f()`(튜플은 레슨 14 에서 자세히) · return 이 없으면 `None`
  3. **범위**: 함수 안의 변수는 밖에서 안 보이고, 바깥 변수를 바꾸려면 `global` 대신 **돌려주고 받기**
  4. docstring `"""설명"""` · `help(함수)` · `*args` 맛보기(print 처럼 몇 개든)
- 만들어 보기: 할인 계산(기본값 · 키워드) · 최솟값과 최댓값을 함께 · 범위 버그 고치기

### 챕터 3 · 데이터 다루기 (+1, ✏1)

**L9B 🆕 문자열 더 다루기** (L9 다음)
- 쪽
  1. 찾기 `find` · `count` · `startswith` · `endswith`
  2. 검사 `isdigit` · `isalpha` · `isspace` — 입력이 숫자인지 먼저 보기
  3. 칸 맞추기 f-string `f"{name:<8}"` · `f"{n:>5}"` · `f"{x:.2f}"` · `f"{n:,}"` — 실전 X 레슨들이 처음 쓰던 것을 여기서 · 여러 줄 `"""` · `\n` `\t`
- 만들어 보기: 영수증 표 맞추기 · 숫자일 때까지 다시 받기

**L11B ✏ 집합: 중복 제거**
- 쪽: 지금 3쪽 + ④ **집합 연산** `\|` 합집합 · `&` 교집합 · `-` 차집합 · `add` · `discard`
- 만들어 보기: + 두 반의 공통 학생 찾기

### 챕터 4 · 더 큰 프로그램 (+4)

**L15B 🆕 클래스 3: 특수 메서드 · property · dataclass** (L15 다음)
- 쪽
  1. `__repr__`(개발자용 모양) · `__eq__`(같은가) · `__lt__`(그래서 `sorted` 가 됨)
  2. 클래스 속성 vs 객체 속성 · `@property`(계산되는 속성 · 음수 막기)
  3. `@dataclass` — 칸만 적으면 `__init__` · `__repr__` · `__eq__` 가 생김. `name: str` 의 `: str` 은 타입 힌트(레슨 L18E 에서 자세히)
- 만들어 보기: 카드 정렬 · 잔액이 음수가 못 되는 계좌 · dataclass 할 일

**L15C 🆕 내 예외 만들기: raise** (L15B 다음)
- 쪽
  1. `raise ValueError("나이는 0 이상")` — 함수가 약속을 못 지킬 때 · 언제 raise 하고 언제 None 을 돌려주나
  2. 내 예외 `class 잔액부족(Exception):` · 메시지 · 속성 담기 · 예외의 가족(Exception 아래 ValueError …)
  3. 던지는 쪽과 잡는 쪽 나누기 · 다시 던지기 `raise` · `raise … from e` 맛보기
- 만들어 보기: 나이 검사 함수 · 계좌의 잔액부족 예외 · 검사 + 다시 받기

**L16C 🆕 내 모듈과 패키지** (L16B 다음)
- 쪽
  1. 파일 둘: `utils.py` 의 함수를 `main.py` 에서 `import utils`(같은 폴더)
  2. `if __name__ == "__main__":` — 가져갈 때는 안 도는 자리(시험 코드)
  3. 폴더로 묶기 `mypkg/__init__.py` · `from mypkg.tools import f` · `python -m mypkg`(`__main__.py`)
  4. 표준 라이브러리 둘러보기 `math` · `collections.Counter` · `itertools` 맛보기 · 공식 문서 찾는 법
- 만들어 보기: 두 파일로 나누기 · `__name__` 시험 자리 · 내 패키지

**L16D 🆕 pip 와 가상 환경** (L16C 다음)
- 쪽
  1. 남이 만든 라이브러리 · PyPI · `python -m pip install requests` · `pip list` · `pip show`
  2. **가상 환경**: `python -m venv .venv` · 켜기(PowerShell `.venv\Scripts\Activate.ps1` · Git Bash `source .venv/Scripts/activate`) · 앞에 `(.venv)` · `deactivate`
  3. VS Code 의 인터프리터 고르기(`Ctrl`+`Shift`+`P` → Python: Select Interpreter → `.venv`) · `requirements.txt`(`pip freeze` · `pip install -r`) · `.gitignore` 에 `.venv`
- 만들어 보기: ☐ 가상 환경 만들고 requests 깔기 · ☐ requirements.txt 로 다른 폴더에 똑같이 · 「지금 가상 환경 안인가」 출력(`sys.prefix`)

### 챕터 5 · 마무리 (+4)

**L17B 🆕 파일 2: 경로 · 인코딩 · JSON** (L17 다음)
- 쪽
  1. `from pathlib import Path` · `Path("data") / "scores.txt"` · `exists()` · `mkdir(exist_ok=True)` · `glob("*.txt")` · 상대 경로는 「터미널이 있는 곳」 기준 → `Path(__file__).parent`
  2. `encoding="utf-8"` 을 꼭(cp949 함정) · `with` 가 닫아 줌
  3. JSON 저장 · 불러오기 `json.dump(data, f, ensure_ascii=False, indent=2)` · `json.load` — 실전 X3 가 처음 쓰던 것을 여기서 · 파일이 없으면 기본값
- 만들어 보기: 폴더의 txt 파일 줄 수 · 설정 파일(없으면 만들기)

**L18C 🆕 반복자와 제너레이터** (L18B 다음)
- 쪽
  1. `for` 가 하는 일 — `iter` · `next` · 끝나면 `StopIteration`
  2. `yield` — 하나 내보내고 멈추는 함수 · 필요할 때만 계산
  3. 제너레이터 식 `(x * x for x in …)` · `sum(…)` 에 바로 · 큰 파일 한 줄씩 · `yield from`
- 만들어 보기: 피보나치 n개 · 조건에 맞는 줄만 내보내기 · n개씩 묶기

**L18D 🆕 함수를 값처럼 · 데코레이터** (L18C 다음)
- 쪽
  1. 함수를 변수에 · 인자로(`sorted` 의 `key` 복습) · 돌려주기
  2. 클로저 — 안쪽 함수가 바깥 값을 기억(카운터)
  3. 데코레이터 — 함수를 받아 감싼 함수를 돌려줌 · `@` 은 줄여 쓴 것 · `functools.wraps` 맛보기 · `@property` · `@dataclass` · FastAPI 의 `@app.get` 이 이것
- 만들어 보기: 몇 번 불렸나 세기 · 로그 남기기 · 같은 인자는 기억해 두기(캐시)

**L18E 🆕 타입 힌트** (L18D 다음)
- 쪽
  1. 왜 — 사람 · 에디터가 알게. **실행에는 영향 없음**(틀려도 돌아감)
  2. 모양 `def f(name: str, n: int = 1) -> str:` · `list[int]` · `dict[str, int]` · `tuple[int, str]` · `str \| None`
  3. 쓰이는 곳 — VS Code 자동 완성 · 경고, dataclass(L15B), FastAPI · Pydantic 의 입력 검사(HTTP·API·SDK 레슨 11). 진짜로 검사하려면 `isinstance`
- 만들어 보기: 힌트 붙이기 · 힌트와 다른 값 찾기(`__annotations__`)

### 챕터 7 · 한 걸음 더 (+1, 만들어 보기 +1)

**L19B 🆕 명령 줄 프로그램** (L19 다음)
- 쪽
  1. `sys.argv` — `python app.py 장보기 3` 은 `["app.py", "장보기", "3"]`(늘 글자)
  2. `argparse` — 위치 인자 · `--옵션` · `type=int` · `-h` 도움말이 저절로
  3. 하위 명령(`add_subparsers` — `todo add` · `todo list`) · 끝 코드 `sys.exit(1)` · `main(argv)` 로 나눠 시험하기
- 만들어 보기: 단위 변환기(`python conv.py 10 --to mile`) · 하위 명령 단어장

**B6 🆕 🛠 내 명령 줄 메모 도구**
- 쓰는 것
  - 가상 환경(L16D)
  - 패키지 폴더 `memo/`(`__init__.py` · `store.py` · `cli.py` · `__main__.py`, L16C)
  - `argparse` 하위 명령(add · list · find · rm, L19B)
  - JSON 저장(`pathlib` · utf-8, L17B)
  - `@dataclass Memo`(L15B) · 내 예외(L15C) · 타입 힌트(L18E) · 테스트(L21)
- 실행 모양: `python -m memo add "장보기"`
- 채점: 자동(main(argv) 를 임시 폴더에서 차례로) + ☐(가상 환경 · `python -m memo`)

레슨 수
- 지금 45 + 새 레슨 12 + 만들어 보기 1(B6) = **58**.
- 새 레슨 12: L7C · L8B · L9B · L15B · L15C · L16C · L16D · L17B · L18C · L18D · L18E · L19B
- 챕터 0 · 1 · 6 은 그대로예요.

## 6. 다른 교과서의 링크 고치기 (새 레슨이 생길 때 같은 릴리스에서)

| 교과서 · 곳 | 지금 글 | 바꿀 것 |
| --- | --- | --- |
| HTTP·API·SDK 레슨 10 1쪽 | 「(파이썬 교과서의 데코레이터)」 | L18D 로 가는 링크 |
| HTTP·API·SDK 레슨 12 1쪽 | 「(파이썬 교과서의 raise 와 같음)」 | L15C |
| HTTP·API·SDK 레슨 14 3쪽 | 「(파이썬 교과서의 예외 만들기)」 | L15C |
| HTTP·API·SDK 레슨 15 2쪽 | 「(파이썬 교과서의 제너레이터)」 | L18C |
| HTTP·API·SDK 챕터 4 「먼저 꼭」 | 「파이썬 교과서의 클래스 · 예외 레슨」 | L14 · L15 · L15B · L15C 를 이름으로 |
| HTTP·API·SDK 레슨 11 · 레슨 15 3쪽 | 타입 힌트 · dataclass 설명 | L18E · L15B 링크 한 줄 |
| HTTP·API·SDK 레슨 7 · 레슨 16 | pip · `.env` · 가상 환경 언급 | L16D 링크 |
| HTTP·API·SDK HB4 | argparse(설명 없이 씀) | L19B 링크 |
| 운영체제 · 웹 · GitHub 교과서 | 「파이썬 교과서 레슨 N」 숫자 | 새 번호(만들 때 grep) |

v2.36.0 에 레슨이 나뉘면서 다른 교과서의 파이썬 링크 25개를 새 레슨으로 다시 옮겼어요(CHANGELOG v2.36.0).

## 7. 시작하기 · 도감 · 허브

- 시작하기는 그대로예요.
  - L16D 가 「pip · 가상 환경」 의 기준 쪽이 되니, 시작하기 2(VS Code)의 끝에 「라이브러리를 깔 땐 레슨 L16D」 한 줄을 둬요.
- 도감: 쪽 제목이 실제 코드라 저절로 들어가요(`raise` · `yield` · `@dataclass` · `python -m venv` · `argparse` · `Path`).
- 허브: 레슨 수는 채울 때마다 늘려요(45 → … → 58). 카드 문구는 그대로예요.

## 8. 만들 순서

진행(11/7)
- ✅ v2.29.0: 1번.
- 사용자가 최대한 나눠서 동시에 하고 Claude 가 검수하라고 했어요. 그래서 2 · 3 · 4번을 **v2.30.0 한 번에** 했어요.
  - 서브 에이전트 6개가 레슨을 나눠 쓰고, Opus 가 합치고 검수했어요.
- ✅ v2.30.0: 58 완성.

만들며 바꾼 것
- 내 예외 이름은 5절의 한글 이름(`잔액부족`) 대신 파이썬 관례대로 영어 + Error 로 했어요(`BalanceError` · `AgeError`).
- L18D 에서 `nonlocal` 을 처음 가르쳤어요.
- L16D 의 「지금 가상 환경 안인가」 는 환경마다 출력이 달라서 ☐ 로 뒀어요.

순서
1. **v2.29.0**: 이 설계 + 목차 뼈대 + **챕터 2 · 3**(L7C · L8B · L9B · L11B ✏).
   - 목차 뼈대: 새 레슨 13개 「준비 중」, 레슨 번호 다시 매기기 · 숫자 링크 고치기.
2. **v2.29.1** 챕터 4(L15B · L15C · L16C · L16D) — HTTP·API·SDK 레슨 12 · 14 · 7 · 16 의 링크를 같이.
3. **v2.29.2** 챕터 5(L17B · L18C · L18D · L18E) — HTTP·API·SDK 레슨 10 · 11 · 15 의 링크를 같이.
4. **v2.30.0** 챕터 7(L19B · B6) + HTTP·API·SDK HB4 링크 — 파이썬 교과서 58 완성.
5. 단계마다 할 것
   - `check_book python` · `pre_claims`
   - 폰 390/PC · 라이트 QA(`tools/qa_screens.py python`) · regress 파이썬 절
   - 문서(site-intent 2절 · TODO · CHANGELOG · HANDOFF)

## 9. 정한 것과 이유 (기술적 선택 — Claude)

**충분한가 → 아니요. 12레슨 + 만들어 보기 1 을 더함**
- 기초는 있지만 「혼자 끝까지」 에 필요한 것이 없어요: 내 예외 · 모듈 · pip/venv · 명령 줄 · 경로/인코딩.
- 다른 교과서가 이미 「파이썬 교과서에 있다」 고 가리키는 것도 없어요: 예외 만들기 · 제너레이터 · 데코레이터.

**더 늘리지 않은 것 → 재귀 · 자료구조 · 정규식 심화 · 비동기(async) · 테스트 도구(pytest)**
- 재귀 · 자료구조는 알고리즘 교과서, pytest 는 예정 T3 이 맡아요.
- 파이썬 async 는 이 사이트에서 쓰는 곳이 아직 없어요. 원리는 웹 교과서의 JS async 로 배워요.
- (뒤에 v2.38.0 에서 재귀 L32 · pytest L39 · asyncio L40 을 파이썬 교과서에 넣었어요 — [`python-100.md`](python-100.md))

**레슨 id → 지금 id 그대로 + `B` · `C` … 끼워 넣기, 새 만들어 보기는 비어 있는 `B6`**
- 읽은 기록 · 주소 · 다른 교과서 링크가 안 깨져요(웹 · 알고리즘 교과서와 같은 방법).

**예외 만들기의 자리 → 클래스 다음(L15C)**
- 내 예외는 `class 잔액부족(Exception)` 모양이라 상속(L15)을 알아야 해요. 그래서 L13 예외 처리 옆이 아니라 뒤로 뒀어요.

**타입 힌트의 자리 → 챕터 5(L18E). dataclass(L15B)에서는 `name: str` 모양만 먼저**
- 힌트는 함수 · 클래스 · 컬렉션 타입(`list[int]` · `dict[str, int]`)을 다 알아야 한 번에 설명돼요.

**pip · venv 를 파이썬 교과서에 → L16D**
- HTTP·API·SDK · 데이터 분석 · LLM 교과서가 모두 쓰는 기초라, 파이썬 교과서가 기준이 되고 다른 교과서는 링크해요.

**날짜 레슨 두 개(L16B 맛보기 · L19 날짜와 시간) → 그대로 둠**
- id 를 지우면 읽은 기록이 깨져요.
- L16B 는 짧은 맛보기, L19 가 자세히 — 이미 그렇게 이어져 있어요.

**검사 → 지금 그대로 + venv · pip 만 ☐**
- 지금 검사: 파이썬 실행으로 출력 예 비교 · pre_claims.
- CI 에서 가상 환경을 켜고 끄는 건 사람의 터미널과 달라서, 그 부분은 화면에서 확인해요.
