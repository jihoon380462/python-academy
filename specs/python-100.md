# 파이썬 교과서 100 레슨 — 설계 (67 → 100)

파이썬 교과서를 67 레슨에서 100 레슨으로 키운 설계예요. 11/8 Opus 가 썼어요.

## 지금 상태

| 항목 | 값 |
|---|---|
| 상태 | ✅ 끝남 — v2.38.0 에서 만듦 |
| 만들어 보기 문제 | 285 → 412 |
| 지금 제목의 기준 | `courses/python/content.js` (이 문서의 제목은 「가」 제목이라 만들며 조금 다듬었어요) |

어떻게 시작했나
- 11/7 사용자가 레슨을 100개로 맞출 수 있는지 물었어요.
- 먼저 검토와 손보기를 했어요(v2.34.0 ~ v2.36.0, [`python-review.md`](python-review.md)).
- 그 뒤 사용자가 Claude 가 낸 안 1 · 2 를 골라서 100 레슨으로 키웠어요(TODO D18).
- 기술적인 선택(주제 · 순서 · 나누기)은 Claude 가 정했어요. 바뀌는 건 이 문서를 먼저 고쳐요.

## 1. 원칙

- **챕터 0~7(67 레슨)은 그대로** 둬요. 새 레슨은 **챕터 8~11** 로 뒤에 붙여요.
  - 이미 읽은 사람의 진도가 흔들리지 않아요.
  - 「다 배운 사람이 다음에 갈 곳」 이 생겨요.
- 새 챕터 차례: **표준 라이브러리 더(8) → 실전 2(9) → 더 깊이(10) → 실전 3(11)**. 문법 챕터 다음에 그걸 쓰는 실전 챕터가 와요.
- 한 레슨의 크기
  - 쪽 3~5개, 글 1,000~2,500자, 새 문법 2~6개, 「만들어 보기」 3~6문제.
  - 문제에는 출력 예측 · 고치기 · 에러 읽기 · 🏠 생활형을 섞어요.
- 실전 레슨(X) = 큰 문제 하나 + 그 앞 몸풀기 1~2개(2단계에서 정한 모양).
- 모든 예시 답은 `check_book` 이 실제로 돌려요.
  - 창(tkinter) · 서버(http.server)처럼 돌려 볼 수 없는 것만 `noRun` + 확인할 것(☐)으로 둬요.

## 2. 새 레슨 33개

### 챕터 8 「표준 라이브러리 더」 (8 + 보스)

| id | 제목(가) | 다루는 것 |
|---|---|---|
| L24 | 소수 오차와 Decimal | `0.1 + 0.2` · `round` 의 한계 · `decimal.Decimal("0.1")` · 돈 계산 · `fractions` 맛보기 |
| L25 | defaultdict · deque · namedtuple · deepcopy | 빈 칸 기본값 · 앞뒤로 넣고 빼기(큐 · 최근 n개) · 이름 붙은 튜플 · `copy.deepcopy` 한 쪽 |
| L26 | 시간 재기: time | `time.time` · `time.sleep` · `time.perf_counter` 로 걸린 시간 · 진행 표시 |
| L27 | 폴더와 파일 정리: pathlib · shutil | `iterdir` · `glob` · `suffix` · `stem` · `mkdir(exist_ok)` · `rename` · `shutil.copy/move` · 지우기 전 확인 |
| L28 | 환경 변수와 다른 프로그램: os · subprocess | `os.environ.get` · API 키는 코드 밖에 · `subprocess.run([...], capture_output=True, text=True)` |
| L29 | csv 모듈 제대로 | `csv.reader` · `DictReader` · `writer` · `newline=""` · 쉼표가 든 칸 · 엑셀 `utf-8-sig` |
| L30 | sqlite3 맛보기 | 표 만들기 · `INSERT` · `SELECT` · `?` 자리표시(SQL 주입 막기) · `commit` · 파일 하나짜리 DB |
| L31 | logging 맛보기 | `print` 대신 `logging` · 단계(DEBUG ~ ERROR) · `basicConfig` · 파일에 남기기 |
| B8 | 보스: 동네 도서관 대출 장부 | sqlite3 + csv 내보내기 + Decimal 연체료 + logging |

### 챕터 9 「실전 2」 (6)

| id | 제목(가) | 쓰는 것 |
|---|---|---|
| X7 | 실전 7: 다운로드 폴더 정리기 | pathlib · shutil · 확장자별 폴더 · 미리 보기(--dry-run) |
| X8 | 실전 8: 주소록(sqlite) | sqlite3 · argparse 하위 명령 · 검색 · csv 내보내기 |
| X9 | 실전 9: 타자 연습 | time.perf_counter · 글자 비교 · 정확도 · 기록 저장(json) |
| X10 | 실전 10: 영수증 계산기 | Decimal · csv 읽기 · 할인 · 부가세 · 칸 맞춘 출력 |
| X11 | 실전 11: 로그 분석기 | 정규식 · Counter · defaultdict · 시간대별 집계 |
| X12 | 실전 12: 텍스트 어드벤처 | 클래스 · 딕셔너리로 방 잇기 · 명령 처리 · 저장/불러오기 |

### 챕터 10 「더 깊이」 (9 + 보스)

| id | 제목(가) | 다루는 것 |
|---|---|---|
| L32 | 재귀: 나를 부르는 함수 | 끝나는 조건 · 팩토리얼 · 폴더 안의 폴더 · 깊이 제한 RecursionError |
| L33 | 인자 더: **kwargs · 키워드 전용 · 풀어 넘기기 | `**kwargs` · `*` 뒤는 키워드로만 · `f(*리스트, **딕셔너리)` · 기본값 함정(빈 리스트) |
| L34 | with 직접 만들기: 컨텍스트 매니저 | `__enter__` / `__exit__` · `contextlib.contextmanager` · 시간 재는 with |
| L35 | 특수 메서드 2: len · [] · for | `__len__` · `__getitem__` · `__contains__` · `__iter__` · 내 컬렉션 |
| L36 | Enum: 정해진 값들 | `Enum` · `auto` · 글자 대신 상태 · `match` 와 잘 어울림 |
| L37 | match-case | 값 · 여러 값 `\|` · 모양(리스트 · 딕셔너리) · `case _` · if/elif 와 비교 |
| L38 | 추상 클래스와 Protocol | `abc.ABC` · `@abstractmethod` · 빠뜨리면 TypeError · `typing.Protocol` 맛보기 |
| L39 | pytest 맛보기 | `test_` 함수 · `assert` · `pytest.raises` · `parametrize` · `python -m pytest` |
| L40 | asyncio 맛보기 | `async def` · `await` · `asyncio.run` · `gather` 로 동시에 기다리기 · `asyncio.sleep` |
| B9 | 보스: 미니 상점 시뮬레이터 | Enum 상태 · match 명령 · 특수 메서드 장바구니 · pytest |

### 챕터 11 「실전 3」 (7 + 마지막 보스)

| id | 제목(가) | 쓰는 것 |
|---|---|---|
| X13 | 실전 13: tkinter 첫 창 | 창 · Label · Button · Entry · 버튼 누르면 함수(noRun + ☐) |
| X14 | 실전 14: tkinter 계산기 | grid 배치 · 버튼 여러 개 · 계산 함수는 따로 떼어 assert 로 시험 |
| X15 | 실전 15: 미로 찾기 | 2차원 리스트 · 재귀 · 지나간 칸 표시 · 길 출력 |
| X16 | 실전 16: 퀴즈 게임 | 클래스 · json 문제집 · 점수 · random.seed · pytest |
| X17 | 실전 17: 내 웹 페이지 | `http.server` · html 만들어 쓰기 · localhost(noRun + ☐) |
| X18 | 실전 18: 데이터 보고서 | csv → 집계(defaultdict) → 칸 맞춘 표 → 마크다운 파일로 저장 |
| X19 | 실전 19: 할 일 앱 완성 | sqlite3 · 클래스 · argparse · 테스트 · logging — 지금까지를 한데 |
| B10 | 마지막 보스: 나만의 도구 | 주제를 고르는 큰 과제(가계부 · 독서 기록 · 운동 일지 중 하나) + 단계 목록 |

합계: 67 + 9 + 6 + 10 + 8 = **100**.

## 3. 만들기

- **뼈대**: 새 레슨 33개를 「준비 중」(`draft:true`, `PY_TODO`)으로 넣어요.
  - `CHAPTERS` 에 8 · 9 · 10 · 11 을 더하고, 번호 `n` 을 다시 매겨요.
- **에이전트 9개가 worktree 에서 동시에** 채워요.
  - 새 레슨만 쓰니, 합치기는 `merge_agent.py`(레슨 id 로 꺼내기)로 해요.

  | 에이전트 | 맡을 레슨 |
  |---|---|
  | ① | L24 ~ L27 |
  | ② | L28 ~ L31 · B8 |
  | ③ | X7 ~ X9 |
  | ④ | X10 ~ X12 |
  | ⑤ | L32 ~ L35 |
  | ⑥ | L36 ~ L38 |
  | ⑦ | L39 · L40 · B9 |
  | ⑧ | X13 ~ X16 |
  | ⑨ | X17 ~ X19 · B10 |

- **같은 챕터의 앞 레슨이 다른 에이전트 몫일 때**
  - 그 레슨에서 배울 것은 이 문서의 표대로라고 보고 써요.
  - 합친 뒤 Claude 가 이어지는지 검수해요.
- **CI**: pytest · sqlite3 는 이미 있어요. tkinter · http.server 는 noRun 이에요.
- **문서와 검사**: regress(목차 100 · 허브 `/100`) · `config.js` lessons 100 · CHANGELOG · HANDOFF · TODO.
