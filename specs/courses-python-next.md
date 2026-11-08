# 파이썬 다음 코스 6개 — 설계 (2026-11-08 Opus + 설계 에이전트 6)

> 사용자(11/8): 「일단 파이썬 관련을 먼저 끝내고 싶은데 추천 코스 있으면 5가지로 추려서 추천해」 → 업무 자동화 · 크롤링 · Flask · pygame · 파이썬 중급 추천 → 「json 코스는 어때 엑셀도 같이」 → 「데이터 파일 다루기: JSON · 엑셀」 → 「너가 추천한거랑 데이터 파일 다루기 설계하고 … 코스별 분류 정리해」.
> **설계만** 했어요(아직 안 만듦). 6개 모두 파이썬 교과서 100 레슨을 다 배운 사람이 대상이고, 기존 교과서와 겹치는 기초는 레슨 id 로 넘겨요. 각 절은 설계 에이전트가 쓰고 Claude 가 검수했어요.

## 1. 한눈에

| 코스 | id · 레슨 글자 | 레슨 | 허브 분류(v2.40.0) | 바깥 패키지(CI) |
|---|---|---|---|---|
| 데이터 파일 다루기: JSON · 엑셀 ✅ v2.41.0 | `files` · F / FB | 18 | 🛠 파이썬으로 만들기 | openpyxl |
| 파이썬 업무 자동화 | `auto` · J / JB | 18 | 🛠 파이썬으로 만들기 | pypdf · python-docx · reportlab · cryptography |
| 웹 크롤링과 스크래핑 | `crawl` · Y / YB | 17 | 🛠 파이썬으로 만들기 | beautifulsoup4 |
| pygame 으로 게임 만들기 | `game` · GM / GMB | 17 | 🛠 파이썬으로 만들기 | pygame-ce(고정 2.5.8) |
| Flask 로 웹 서비스 만들기 | `flask` · Q / QB | 18 | 🌐 웹과 서비스(HTTP·API 다음) | flask |
| 파이썬 다음 단계(중급) | `pyplus` · PY / PYB | 17 | 💪 파이썬 실력 키우기 | mypy · ruff · build(버전 고정) |

합계 105 레슨. 레슨 id 글자는 기존 코스(L B X A E M T V G S W H U K R C N D P O I Z)와 안 겹쳐요(`COURSE_ID_PATTERNS` 에 더할 것).

**만드는 순서(추천)**: `files` → `auto`(엑셀은 files 를 가리킴) → `crawl` → `flask` → `game` → `pyplus`. 「파이썬으로 만들기」 를 먼저 채우고(허브의 빈 칸), 웹 · 실력 쪽을 이어서.

**만들기 전에 먼저 넣을 공통 기능**(설계 여럿이 같이 필요)
- 준비 파일 여럿 · 하위 폴더: `prep` 을 배열로, `templates/…` 같은 폴더 만들기 — `files`(엑셀 만드는 스크립트) · `flask`(템플릿) — `tools/check_book.mjs` · `core/book-derive.js` · `core/ui-views-book.js`
- 본문 예제도 준비 파일을 쓰게(`example.prep`) — `crawl`(practice_site.py) · `auto`(samples.py)
- 코스별 실행 환경: `game` 은 `SDL_VIDEODRIVER=dummy` · `SDL_AUDIODRIVER=dummy` · `PYGAME_HIDE_SUPPORT_PROMPT=1`
- `tools/requirements-ci.txt` 에 위 표의 패키지(버전 고정이 필요한 것은 고정)

## 2. 정한 것(11/8 — 기술적 선택은 Claude)

| 코스 | 물음 | 정한 것 |
|---|---|---|
| files | 레슨 18 그대로? 차트 떼어 19? | 18 그대로(서식 · 차트 한 레슨) |
| files | 엑셀 예제를 내려받는 단추도? | 안 둠 — `make_samples.py` 로만(저장소에 바이너리 없음) |
| files | 엑셀이 없는 학습자 안내 | 무료 LibreOffice Calc 를 먼저, 웹용 Excel 은 다음 |
| files · auto | 「정해진 시간에 엑셀 보고서」 | auto 가 맡고 files 의 FB2 를 불러 씀 |
| auto | 실제 메일 발송 안내 | Gmail · 네이버 둘 다(앱 비밀번호) |
| auto | 엑셀 링크 | files 를 먼저 만들어 실제 레슨 id 로 |
| auto | 한글(HWP) 문서 | 「한글에서 PDF · 워드로 저장해서 다루기」 한 쪽만(11/8 Claude 가 정함 — HWP 직접 읽기 라이브러리는 비공식이라 깨지기 쉽고, 한글 프로그램 조종은 Windows + 한글이 있어야 해서 CI 로 확인할 수 없음) |
| crawl | 법 이야기 깊이 | 법 이름 + 원칙만(판례 · 국내 사례는 넣지 않음) |
| crawl | 공개 연습 사이트 이름 | 이름만(예시 답은 기대지 않음 — 주소 · 구조가 바뀔 수 있어서) |
| flask | 웹 교과서 W1 ~ W4 · W11 이 빈 쪽? | **사실이 아님** — 웹은 내용을 `BOOK.lessonPages` 에 담아 33 레슨 모두 채워져 있음(설계 에이전트가 content.js 만 봄). validate 의 「web 준비 중 33」 경고도 같은 착각이라 고칠 것 |
| flask | 허브 자리 · 아이콘 | 🌐 웹과 서비스, HTTP·API 다음 · 🧪 |
| flask | 무료 호스팅 이름 | 「이런 곳이 있어요」 예로만(가입 · 화면이 바뀜) |
| game | pygame-ce 로 가르치기 | 그렇게 — 원래 pygame 은 파이썬 3.14 부터 설치 파일이 없음. 코드는 `import pygame` 그대로 |
| game | 레슨 17? 16? | 17 그대로 |
| game | 게임 화면 글자 | 영어 · 숫자 기본, 한글 글꼴은 GM6 의 「바꿔 보기」 |
| game | PyInstaller(exe) | GM13 에 ☐ 한 쪽으로(백신 경고 · OS 마다 따로 빌드) |
| pyplus | 레슨 17? 16? | 17 그대로(디스크립터 · 메타클래스는 「이런 게 있다」 수준) |
| pyplus | 패키지 올리기 | TestPyPI 까지만(진짜 PyPI 는 이름만) |
| pyplus | CI 에 mypy · ruff · build | 버전을 고정해서 더함 |

---

## 데이터 파일 다루기: JSON · 엑셀 (`files`, 레슨 `F0`~`F14` · 만들어 보기 `FB1`~`FB3` = 18)

**한 줄로**: 앱 설정 · API 응답 · 기록 · 엑셀 표처럼 **실제로 받는 데이터 파일**을 파이썬으로 읽고, 검사하고, 바꾸고, 사람이 보기 좋은 **엑셀 보고서로 만들어 내보낸다**. 파이썬 교과서 L17C 「JSON 으로 저장하기」 · L29 「csv 모듈 제대로」 의 다음 단계이고, 엑셀(openpyxl)은 사이트에서 이 코스가 전부 맡는다.

**누구에게 · 어디서 이어지나**
- 대상: 파이썬 교과서(100 레슨)를 다 배운 사람.
- 꼭 거쳐 올 레슨(본문에서 「복습: 레슨 ○○」 로 링크):
  - 파일 · 경로: L17 · L17B
  - JSON · CSV: L17C · L29
  - 날짜 · 돈: L16B · L19 · L24
  - 클래스 · 타입 · 패턴: L15E(`@dataclass`) · L18G(`isinstance`) · L37(`match`)
  - 반복 · 재귀 · 폴더: L18C(제너레이터) · L32(재귀) · L27(pathlib · glob)
  - 준비: L16D(가상 환경)
- 있으면 좋은 것: API 교과서 H3 「헤더와 JSON」(`json.loads` · `JSONDecodeError`).
- 다음에 갈 곳:
  - 데이터 분석(`data`): 같은 일을 pandas 로 — `pd.read_excel` · `pd.json_normalize` · `pd.read_json(lines=True)`
  - HTTP · API(`api`): JSON 을 진짜 API 에서 받기, 검사를 Pydantic 으로(H11)
  - SQL(`sql`): 파일이 커지고 찾을 일이 많으면 DB 로
  - 업무 자동화(`auto`): 이 코스에서 만든 보고서 함수를 정해진 때에 돌리기
- 허브: 「코스」 칸(공용 아님).

**준비**
- 프로그램:
  - 파이썬 3.11 이상. 사이트가 권하는 3.15 면 `tomllib` 이 들어 있어요.
  - VS Code(파이썬 교과서 「시작하기」 그대로).
  - 결과를 눈으로 볼 표 프로그램 하나: 엑셀이 없으면 무료 **LibreOffice Calc** 나 웹용 Excel.
- pip: 가상 환경에 `pip install openpyxl` 하나뿐(L16D). pandas 는 안 써요.
- 예제 데이터: 전부 이 교과서가 만든 가짜 데이터(저작권 걱정 없음). `courses/files/book.js` 에 상수로 둬요.

  | 상수 | 무엇 | 어떻게 주나 |
  | --- | --- | --- |
  | `SETTINGS_JSON` | 메모 앱 설정. 사용자가 손으로 고쳐 틀린 값 · 빠진 키가 섞임 | `prep` 글자 파일 `settings.json` |
  | `BOOKSHOP_JSON` | 가짜 온라인 서점 「주문 목록 API」 응답 저장본. `data.orders[].items[]` · `customer.address` 로 3겹 중첩. 시각은 `"2026-09-03T14:05:00+09:00"`, 금액은 `"12500.00"` 글자 | `prep` 글자 파일 `orders.json` |
  | `EVENTS_JSONL` | 앱 사용 기록 40줄. 빈 줄 하나, 깨진 줄 하나가 숨어 있음 | `prep` 글자 파일 `events.jsonl` |
  | `APP_TOML` | 작은 도구의 설정 파일. 주석 · `[표]` · 날짜 · 배열이 있음 | `prep` 글자 파일 `config.toml` |
  | `MAKE_SAMPLES_PY` | 엑셀 예제를 만드는 스크립트(아래 세 가지) | `prep` 파일 `make_samples.py`, 한 번 실행 |

- `make_samples.py` 가 만드는 엑셀(무작위 없는 상수 데이터):
  - `빵집_매출.xlsx`: 시트 「7월」 · 「8월」 · 「9월」, 시트마다 20줄쯤. 칸은 날짜 · 품목 · 분류 · 단가 · 수량.
  - `지점/강남.xlsx` · `지점/홍대.xlsx` · `지점/판교.xlsx`: 같은 모양인데 한 파일만 열 순서가 다름.
  - `가계부_카드내역.xlsx`: 카드사에서 내려받은 모양을 흉내 낸 지저분한 파일.
    - 위에 제목 줄 둘과 병합 칸이 있고, 중간에 빈 줄이 있어요.
    - 금액은 `"12,300원"` 같은 글자, 날짜 몇 칸은 `46023` 같은 숫자예요.
    - 맨 아래에 합계 줄이 있어요.
- 왜 스크립트로 주나: 엑셀은 글자가 아닌 파일이라 「이 내용을 붙여 넣으세요」 로 줄 수 없어요. 「이 스크립트를 저장해서 한 번 실행」 이 다른 교과서의 `prep` 과 가장 가까워요.
  - 덤: 학습자가 F8(쓰기)을 배운 뒤 이 스크립트를 읽으면 그대로 연습 교재가 돼요.

| 챕터 | id · 제목 | 주요 내용 |
| --- | --- | --- |
| 0 시작 | F0 데이터 파일 세 가지 | JSON · JSON Lines · CSV · 엑셀 · TOML 한눈에(생김새 · 누가 쓰나 · 파이썬 도구 표) · 준비 `python -m venv .venv` → `pip install openpyxl` · `make_samples.py` 저장 · 실행 → 만들어진 파일 목록 찍기 · 이 코스의 습관 「만들면 다시 읽어서 확인 + 엑셀에서 열어 ☐」 |
| 1 JSON 깊게 | F1 JSON 문법 다시 보기 · 깨진 JSON | 복습(L17C · H3 링크): `dump`/`load`, 파이썬 ↔ JSON 대응 표 · 넷 정리 `dump · dumps · load · loads` · 문법 규칙(큰따옴표만 · 끝 쉼표 ✗ · 주석 ✗) · 옵션 `indent` · `ensure_ascii=False` · `sort_keys=True` · `separators=(",", ":")` · 어디가 깨졌나 `json.JSONDecodeError` 의 `e.lineno` · `e.colno` · `e.msg` 로 그 줄 보여 주기 · 함정 `float("nan")` → `NaN`(JSON 이 아님, `allow_nan=False`) · 같은 키 두 번은 마지막만 남음(`object_pairs_hook` 으로 잡기) |
| | F2 중첩 구조에서 꺼내기 | 경로 읽기 `data["data"]["orders"][0]["items"][1]["title"]` · `.get` 이어 쓰기와 그 함정(`.get("a", {})` 인데 값이 `None` 일 때) · 경로 함수 `dig(data, "data", "orders", 0, "customer", "name", default=None)`(`KeyError` · `IndexError` · `TypeError` 받기) · 리스트 안 딕셔너리를 컴프리헨션으로 모으기 · 합계 · `match` 의 딕셔너리 모양으로 꺼내기 `case {"status": "paid", "items": items}:`(L37 복습) · 모르는 구조 살피기 `outline(data)` 재귀로 키 · 종류 나무 찍기(L32 복습) |
| | F3 JSON 에 없는 값: 날짜 · 돈 | `TypeError: Object of type date is not JSON serializable` 읽기 · 날짜는 ISO 8601 글자 `d.isoformat()` ↔ `date.fromisoformat`(L19 복습) · 시각과 시간대 `timezone(timedelta(hours=9))` · `"+09:00"` · `"Z"` · 유닉스 시간 `datetime.fromtimestamp(ts, timezone.utc)` · zoneinfo 는 Windows 에서 `tzdata` 가 따로 필요하다는 한 줄 · 돈 `json.loads(s, parse_float=Decimal)` · 저장은 `str(Decimal)` 이나 정수 원 단위(L24 복습) · `json.dumps(data, default=to_json)` 함수 하나로 date · Decimal 모으기, 되돌리기는 내가 |
| | F4 내 클래스 저장 · 되살리기: dataclass | `dataclasses.asdict` · `default=` 에서 `is_dataclass(o)` 처리 · 되살리기 `Book(**d)`(H15 복습) · 중첩 dataclass 는 손으로(`Order(items=[Item(**x) for x in d["items"]])`) · `object_hook=` — 딕셔너리를 만날 때마다 불리는 함수, 꼬리표 `{"__type__": "date", "value": "2026-09-03"}` 로 되살리기 · `to_dict` / `from_dict` 메서드 짝과 왕복 시험 `assert Order.from_dict(json.loads(json.dumps(o.to_dict()))) == o` · 저장 모양에 `"version": 2` 를 넣는 까닭(나중에 칸이 늘 때) |
| | F5 JSON Lines: 한 줄에 하나씩 | `.jsonl` = 한 줄에 JSON 하나 · 이어 쓰기 `open(…, "a")` + `json.dumps(rec, ensure_ascii=False) + "\n"` · 한 줄씩 읽는 제너레이터 `read_jsonl(path)`(L18C 복습) · 빈 줄 건너뛰기 · 깨진 줄은 `enumerate(f, 1)` + `JSONDecodeError` 로 줄 번호만 남기고 계속 · 언제 JSON 대신 JSONL(기록 · 로그 · 쌓이는 데이터 · AI 학습 데이터의 흔한 모양) · 큰 JSON 하나는 통째로 읽어야 하지만 JSONL 은 한 줄씩 |
| | F6 값 검사: 필수 키 · 종류 · 범위 | 왜 검사하나(손으로 고친 설정 · 남이 준 응답) · 필수 키 `REQUIRED - d.keys()` 집합 차 · 종류 `isinstance`, 그리고 `isinstance(True, int)` 가 참이라는 함정(bool 먼저 거르기) · 범위 · 고를 수 있는 값 · 글자 길이 · 첫 에러에서 멈추지 말고 모아서 한 번에 `["items[2].price: 0 보다 커야 해요", …]` 경로 붙여 보고 · 규칙표 `RULES = {"theme": (str, {"light", "dark"}), "font_size": (int, range(8, 41))}` 로 검사 함수 하나 · 더 큰 도구: Pydantic(API 교과서 H11) · JSON Schema 는 이름만 |
| | **FB1** 🛠 앱 설정과 API 응답 정리하기 | ① 기본 설정 + 사용자 `settings.json` 깊게 합치기 `merge(defaults, user)` ② 설정 검사 → 틀린 값 목록 출력 · 틀린 값만 기본값으로 되돌려 `sort_keys` 로 저장 ③ `orders.json`(서점 API 저장본)에서 주문마다 「날짜 · 고객 · 권수 · 금액(Decimal)」 요약 ④ 요약을 dataclass 로 바꿔 JSON 저장 → 되살려 왕복 `assert` ⑤ 처리 기록을 `log.jsonl` 에 이어 쓰고, `events.jsonl` 의 깨진 줄은 건너뛰며 종류별로 세기 |
| 2 엑셀(openpyxl) | F7 엑셀 읽기: 통합 문서 · 시트 · 셀 · 범위 | `load_workbook("빵집_매출.xlsx")` · `wb.sheetnames` · `wb["7월"]` · `wb.active` · 셀 `ws["B2"].value` · `ws.cell(row=2, column=3)` · 열 글자 ↔ 번호 `get_column_letter` · `column_index_from_string` · 범위 `ws["A1:C3"]` · `ws.iter_rows(min_row=2, values_only=True)` → 머리줄로 `dict(zip(header, row))` · 읽은 값의 종류(숫자 · 글자 · 날짜는 `datetime` · 빈 칸 `None`) · 함정: `ws.max_row` 는 서식만 있는 빈 칸까지 셈 · 병합 칸은 왼쪽 위에만 값이 있고 나머지는 `MergedCell` · 날짜가 `46023` 숫자로 나오면 `openpyxl.utils.datetime.from_excel` · `.xls`(옛 형식)는 못 엶 · 큰 파일은 `read_only=True` |
| | F8 새로 만들어 쓰기 | `Workbook()` · `ws.title` · `wb.create_sheet("8월")` · 한 줄씩 `ws.append([...])` · 칸에 바로 `ws["A1"] = …` · `ws.cell(row, column, value)` · 숫자 · 날짜는 그 종류 그대로, 앞자리 0(`"01012345678"` · `"00123"`)은 글자로 · `wb.save("보고서.xlsx")` · 습관: 저장 → `load_workbook` 으로 다시 열어 값 찍기 · 시트 순서 · 지우기 `wb.move_sheet` · `wb.remove` · 엑셀이 그 파일을 열고 있으면 Windows 에서 `PermissionError`(본문 `<pre>` + ☐) |
| | F9 수식과 값: `data_only` 함정 | 수식은 글자로 넣음 `ws["E22"] = "=SUM(E2:E21)"` · 줄마다 `f"=C{r}*D{r}"` · 끝 줄을 계산해 `f"=SUM(E2:E{last})"` · 다시 읽으면 수식 글자 그대로 · **`load_workbook(…, data_only=True)` 는 엑셀이 마지막으로 계산해 저장해 둔 값 — openpyxl 로 만든 파일은 아직 계산된 적이 없어 `None`** · 해결 셋: ① 값은 파이썬이 계산해서 쓰기 ② 수식은 넣되 파이썬 계산값으로 따로 검사 ③ 엑셀에서 한 번 열어 저장(☐) · 또 하나의 함정: `data_only=True` 로 열어 저장하면 수식이 사라짐 · 함수 이름은 한국어 엑셀에서도 영어(`SUM` · `AVERAGE`), 구분은 쉼표 |
| | F10 꾸미기: 서식 · 차트 맛보기 | 글꼴 · 색 · 줄 · 맞춤: `Font(bold=True, color="FFFFFF")` · `PatternFill("solid", fgColor="4472C4")` · `Border(bottom=Side("thin"))` · `Alignment(horizontal="center")` · 크기와 보기: `ws.column_dimensions["A"].width = 14` · `ws.freeze_panes = "A2"` · `ws.auto_filter.ref = ws.dimensions` · 숫자 모양: `number_format = "#,##0"` · `"yyyy-mm-dd"` · `"0.0%"`(값은 그대로, 보이는 모양만) · 차트 맛보기: `BarChart()` · `Reference(ws, min_col=…, min_row=…, max_row=…)` · `add_data(…, titles_from_data=True)` · `set_categories` · `ws.add_chart(chart, "G2")`, `LineChart` · `PieChart` 이름만 · 확인하기: 다시 읽어 `font.b` · `fill.fgColor.rgb` · `number_format` · `width` 찍기, `.xlsx` 는 사실 zip 이라 `zipfile.ZipFile(p).namelist()` 에 `xl/charts/chart1.xml` 이 있나 보기 — 겉모양은 ☐ |
| | F11 여러 시트 · 여러 파일 합치기 | 모든 시트 돌기 `for ws in wb:` · 시트 이름을 「월」 열로 · 여러 파일 `Path("지점").glob("*.xlsx")`(L27 복습) · 엑셀이 열려 있을 때 생기는 `~$강남.xlsx` 건너뛰기 · 열 순서가 다른 파일은 머리줄 이름으로 맞추기 · 빠진 열은 경고 · 합친 결과에 「출처」 열 · 맨 앞에 요약 시트 `wb.create_sheet("요약", 0)` · 시트마다 합계를 한 표로 |
| | **FB2** 🛠 월별 매출 보고서 | `빵집_매출.xlsx`(7~9월 시트)를 읽어: ① 월별 매출 합계 ② 분류별 합계 · 품목 TOP 3 ③ 새 통합 문서 `매출_보고서.xlsx`: 「요약」 시트(월 × 분류 표 + `SUM` 수식 줄 + 머리줄 색 · `#,##0` · 열 너비 · 틀 고정) ④ 월별 막대 차트 ⑤ 다시 읽어 검사: 수식 글자 · 파이썬 계산 합계 · 차트 파일 있음 · 시트 순서 + ☐ 엑셀에서 열어 보기(색 · 차트 · 수식 결과가 파이썬 합계와 같은지) |
| 3 서로 바꾸기 | F12 JSON ↔ CSV ↔ 엑셀 | 형식마다 잃는 것 표(CSV: 다 글자 · 시트 하나 · 서식 없음 / JSON: 표가 아님 · 날짜 없음 / 엑셀: 중첩 없음) · CSV → JSON: `csv.DictReader` + 열마다 바꿀 함수표 `{"수량": int, "날짜": date.fromisoformat}`(L29 복습) · JSON 리스트 → 엑셀: 머리줄 = 키 합집합(처음 나온 순서), 빠진 칸은 빈칸 · 엑셀 → CSV: `encoding="utf-8-sig"` · `newline=""` · 날짜는 ISO 글자로 · 앞자리 0 지키기 · 함수 셋을 묶어 왕복 시험(CSV → 엑셀 → CSV 가 같은가) |
| | F13 중첩 JSON 을 표로 펴기 | 왜 펴나(엑셀 · CSV 는 평평) · `flatten(d)` 재귀로 `"customer.address.city"` 키 · 리스트를 다루는 두 길: 줄로 늘리기(주문 1 × 상품 n → n 줄, 주문 칸 되풀이) vs 글자로 붙이기 `", ".join` · 두 표로 나누기(주문 표 + 상품 표, 주문번호로 잇기 — SQL 교과서 JOIN · 데이터 분석 P5 `merge` 링크) · 거꾸로 접기 `unflatten` · 같은 주문번호끼리 묶어 다시 중첩 · 「pandas 로도 돼요: `pd.json_normalize` — 데이터 분석 교과서」(이름만) |
| | F14 설정 파일 TOML 맛보기 · 형식 고르기 | TOML 생김새(주석 `#` · `[표]` · `[[배열 표]]`) · `tomllib.load(f)` 는 `open(…, "rb")` 로, 읽기만 됨(쓰기는 `tomli-w` 패키지 이름만) · 종류 대응(날짜는 `date` 로 바로 · 정수 · 배열 · 표) · `pyproject.toml` 읽어 보기(API 교과서 H16 링크) · 형식 고르기 표: 사람이 쓰는 설정 = TOML · 앱 데이터 = JSON · 쌓이는 기록 = JSONL · 표 주고받기 = CSV · 사람에게 보여 줄 보고 = 엑셀 · 많고 자주 찾음 = SQLite(L30) |
| | **FB3** 🛠 가계부 엑셀 → JSON → 보고서 | `가계부_카드내역.xlsx` 로: ① 지저분한 표 읽기 — 머리줄 찾기 · 빈 줄 · 합계 줄 빼기 · `"12,300원"` → `12300` · 숫자 날짜 → `date` ② 깨끗한 `가계부.json`(ISO 날짜 · 정수 원)으로 저장 + F6 식 검사 ③ JSON 을 다시 읽어 월 · 분류별 합계(X4 「가계부 분석기」 복습 링크) ④ `가계부_보고서.xlsx`(요약 시트 + 원본 시트 + 분류별 막대 차트)와 `가계부.csv`(`utf-8-sig`) 내보내기 ⑤ 다음 달 카드 내역을 넣고 다시 돌려도 같은 건이 두 번 안 들어가게(날짜 · 내용 · 금액으로 열쇠) |

**겹침 처리**
- 이 코스는 아래 레슨이 끝난 데서 시작해요. 기초는 다시 가르치지 않고 링크로 넘겨요.

  | 기존 레슨 | 겹치는 것 | 이 코스에서는 |
  | --- | --- | --- |
  | 파이썬 L17C | `json.dump` / `load` · `ensure_ascii` · `indent` · True ↔ true · 키는 늘 글자 · 없으면 기본값 | F1 첫 쪽 「복습: L17C」 표 한 장. 새로 가르치는 건 `dumps`/`loads` 넷 정리 · `sort_keys` · `separators` · 에러 위치 · NaN · 같은 키 |
  | API H3 | `json.loads` · `JSONDecodeError` · 「알고 보니 HTML」 | F1 에서 링크만. 이 코스는 HTTP 없이 **저장해 둔 응답 파일**만 다뤄요 |
  | 파이썬 L16B · L19 | `date` · `fromisoformat` | F3 에서 복습 링크. 새로 가르치는 건 JSON 에 넣고 빼기 · 시간대 · 유닉스 시간 |
  | 파이썬 L24 | `Decimal` · `quantize` | F3 에서 복습 링크. 새로 가르치는 건 `parse_float=Decimal` · 저장 모양 |
  | 파이썬 L15E · API H15 | `@dataclass` · `Todo(**data)` | F4 에서 복습 링크. 새로 가르치는 건 `asdict` · 중첩 되살리기 · `default=` / `object_hook` · 왕복 시험 · 판 번호 |
  | 파이썬 L18C | 큰 파일 한 줄씩 · 제너레이터 | F5 에서 복습 링크 |
  | 파이썬 L18G · API H11 | `isinstance` · Pydantic | F6 는 손으로 검사해요. 그 너머는 H11 로 넘겨요 |
  | 파이썬 L29 | `csv` · `DictReader/DictWriter` · `newline=""` · `utf-8-sig` | F12 는 「다른 형식과 오가기」 만. csv 모듈 자체는 L29 링크 |
  | 파이썬 L32 · L37 | 재귀 · `match` | F2 · F13 에서 쓰는 도구로만 |
  | 파이썬 X4 · B3 · X18 | 가계부 집계 · 보고서 | FB3 는 분석 논리가 아니라 **형식 사이 흐름**이 중심이에요(지저분한 엑셀 → 검사한 JSON → 엑셀 보고서 · CSV). 집계 부분은 X4 링크 |
  | 데이터 분석 P1 · P4 · P5 · P11 | pandas 읽기 · 묶기 · 합치기 · 피벗 | 이 코스는 pandas 를 쓰지 않아요. 같은 일이 나오는 쪽 끝에 한 줄로만 가리켜요: 「pandas 로도 돼요 — `pd.read_excel` · `df.to_excel` · `pd.json_normalize` · `pd.read_json(lines=True)` · `pivot_table`, 데이터 분석 교과서 P○」 |
  | 업무 자동화 `auto` | (설계 중) | 엑셀은 이 코스만 다뤄요. `auto` 가 엑셀 · JSON 을 만지면 이 코스의 레슨 id 로 링크하기로 해요 |

- 다루지 않는 것(쪽 안에서 이름만): `.xls` 옛 형식 · 매크로(VBA, `.xlsm`) · 엑셀 프로그램을 직접 움직이는 `xlwings` · 비밀번호 걸린 파일 · Google Sheets API(인터넷) · YAML · XML.

**검사(CI)**
- 패키지: `tools/requirements-ci.txt` 에 `openpyxl` 을 더해요.
  - 순수 파이썬이라 설치가 빨라요.
  - 색 글자(`"004472C4"`) 같은 출력이 판마다 흔들리지 않게 `openpyxl>=3.1,<4` 로 묶어요.
  - `tomllib` · `decimal` · `dataclasses` · `zipfile` 은 표준 라이브러리예요. CI 의 3.12 에 다 있어요.
- 준비 파일:
  - JSON · JSONL · TOML 은 지금 있는 `prep: { name, text }` 그대로 써요.
  - 엑셀은 `prep: { name: 'make_samples.py', text: MAKE_SAMPLES_PY, run: true }` 로 줘요.
  - 이를 위해 `check_book.mjs` 에 한 줄을 더해요: 「`prep.run` 이면 `main.py` 앞에 `python3 make_samples.py`」.
  - 화면 라벨도 「먼저 한 번 실행하세요: `python make_samples.py`」 로 바꿔요.
  - 한 문제에 JSON 과 엑셀이 같이 필요하면, `make_samples.py` 가 JSON 도 함께 써요. `prep` 은 문제마다 하나라서예요.
- 쪽 예제: CI 가 준비 파일 없이 따로 돌려요. 그래서 쪽 예제는 **스스로 끝나는 모양**으로 써요.
  - 엑셀: 작은 통합 문서를 만들고 → 저장하고 → 다시 열어 찍기.
  - JSON: 글자 상수를 `json.loads`.
  - 본문 `<pre>` 의 `# 결과` 주석도 `pre_claims.py` 가 맞춰 봐요.
- 쓰기 문제는 답이 만든 파일을 **다시 `load_workbook` 해서 찍는 것**을 출력 예로 해요.
  - 값 · 수식 글자 · `font.b` · `fill.fgColor.rgb` · `number_format` · `column_dimensions["A"].width` · `freeze_panes` · `wb.sheetnames`
  - 차트는 비공개 속성(`ws._charts`) 대신 zip 목록에 `xl/charts/chart1.xml` 이 있는지로 봐요.
- 수식의 값: CI 에는 엑셀도 LibreOffice 도 없어요.
  - 그래서 합계는 파이썬으로 계산해 찍어요.
  - `data_only=True` 로 열면 `None` 이 나오는 것 자체를 출력 예로 둬요. 함정을 CI 가 실제로 증명하는 셈이에요.
- 시간:
  - `now()` · `today()` 는 예시 답에 쓰지 않아요. 날짜는 데이터에 고정하거나 함수 인자로 받아요.
  - 시간대는 `timezone(timedelta(hours=9))` 로 써요. `zoneinfo` 는 Windows 에 `tzdata` 가 없어 학습자 PC 에서 깨질 수 있어요.
- 무작위: 없어요. 가짜 데이터는 다 상수예요.
- 인터넷: 쓰지 않아요. 「API 응답」 은 저장해 둔 파일(`BOOKSHOP_JSON`)로만 줘요.
- 출력이 흔들리지 않게:
  - `Decimal` 은 `str` 로 찍어요.
  - float 은 `round` 해요.
  - 경로 · 파일 크기 · 저장 시각(xlsx 안의 만든 날짜)은 찍지 않아요.
  - 파일 이름은 상대 경로만 써요(CI 는 임시 폴더에서 돌아요).
- pandas 는 본문에 `<code>` 이름으로만 나와요. `<pre>` 에 넣으면 CI 가 그 코드를 돌리기 때문이에요.
- `check_book` ⑥ 의 모듈 목록(`PYMOD`)에 `openpyxl` · `tomllib` · `decimal` · `dataclasses` · `zipfile` 을 더할지, 만들 때 확인해요.
- `noRun` 으로 둘 것은 거의 없어요.
  - 「엑셀에서 열고 저장한 뒤 `data_only=True` 로 값이 보이는지」(F9, ☐)
  - 「엑셀이 파일을 열고 있을 때 저장하면 `PermissionError`」(F8, 본문 `<pre>` + ☐)
- 문제 수: 레슨마다 3~5, 만들어 보기는 5. 모두 합쳐 70문제쯤이에요.

**사람이 확인할 것**
- 엑셀(또는 LibreOffice Calc · 웹용 Excel)에서 열어서 볼 것(☐):
  - 머리줄 색 · 굵은 글씨 · 열 너비 · 틀 고정 · 필터 단추
  - 숫자 모양이 `1,234,000` · `2026-09-03` 으로 보이는지
  - 막대 차트의 모양 · 제목 · 범례
  - 수식 칸에 파이썬 합계와 같은 값이 보이는지
- 한글: 엑셀에서 연 `utf-8-sig` CSV 의 한글이 깨지지 않는지, VS Code 로 연 JSON 의 한글이 그대로 보이는지.
- 학습자 PC 차이:
  - Windows 의 `PermissionError`(엑셀이 파일을 열고 있을 때)와 `~$` 임시 파일
  - Mac 의 Numbers 로 열었을 때 차트 · 서식이 얼마나 보이는지(참고만)
- 사이트: 「먼저 실행하세요: `make_samples.py`」 라벨과 복사 단추가 제대로 보이는지.

**정할 것(설계 때 물음 — 정한 것은 위 2절)**
1. **레슨 18 개** — 날짜 · Decimal 을 한 레슨(F3), 서식 · 차트를 한 레슨(F10)으로 묶었어요.
   - 그대로 따로 두면 20 개라 정한 크기(14~18)를 넘어요.
   - 차트를 따로 떼고 싶으면 19 개가 돼요.
2. **엑셀 예제 파일 주는 방법**
   - 기본: `make_samples.py` 를 복사해 한 번 실행.
   - 여기에 SQL 교과서의 `cafe.db` 처럼 `.xlsx` 를 **바로 내려받는 단추**도 둘까요?
   - 둔다면 저장소에 바이너리 파일이 들고, CI 가 스크립트로 다시 만든 파일과 셀 값이 같은지 맞춰 봐요.
3. **엑셀이 없는 학습자** — 안내 첫 줄을 「무료 LibreOffice Calc」 로 할지, 「웹용 Excel(마이크로소프트 계정 필요)」 로 할지.
4. **`auto` 코스와 경계** — 「정해진 시간에 엑셀 보고서 만들기」 는 `auto` 가 맡고, 이 코스의 FB2 함수를 불러 쓰는 식으로 링크하면 될까요?

---

## 파이썬 업무 자동화 (`auto`, 레슨 `J0`~`J13` · 만들어 보기 `JB1`~`JB4` = 총 18)

**한 줄로**: 배운 파이썬을 **당장 내 일에** 쓴다. 폴더 · 파일을 한꺼번에 바꾸고 · 백업하고 · 압축하고, PDF 와 워드 문서를 합치고 · 나누고 · 채우고, 명단으로 문서와 메일을 대량으로 만들고, 그 일을 **정해진 시간에 사람 없이** 돌린다. 이야기 무대는 가상의 작은 가게 「햇살 공방」(수강생 명단 · 거래처 청구서 · 수료증 · 회비 안내)의 사무 일이에요.

**누구에게 · 어디서 이어지나**
- 선수: 파이썬 교과서 100 레슨을 다 배운 사람. 특히 바로 앞 단계가 되는 레슨은 아래와 같아요.
  - L17B(Path · `__file__`), L21(`tempfile.TemporaryDirectory`), L27(pathlib · shutil 기본 · 미리 보기), X7(다운로드 폴더 정리기), L28(환경 변수 · subprocess), L31(logging 기본), L29(csv · `utf-8-sig`), L19 · L16B(날짜), L20 · L20B(정규식), L19B · L19C(argparse · 끝 코드), L26(`time.sleep`), L34(`@contextmanager`), L9C(서식 출력), X17(`html.escape`).
- 함께 보면 좋은 곳(링크만): CS 교과서 C16(해시 · 파일 지문), 리눅스 교과서 U14(tar · crontab), 디버깅 교과서 D10(가짜 객체), HTTP·API·SDK 교과서 H5 · H7(requests · 키는 코드 밖에).
- 엑셀은 이 코스에서 다루지 않아요. 엑셀 파일을 읽고 쓰는 곳은 모두 **데이터 파일 다루기 코스(`files`)** 를 가리켜요. 이 코스 안의 표 데이터는 csv 로 주고받아요.
- 다음에 갈 곳: `files`(엑셀 · 여러 데이터 파일), 데이터 분석(`data`, 모은 값을 분석), HTTP·API·SDK(`api`, 화면 대신 API 로 자동화), 리눅스(`linux`, 서버에서 cron 으로 돌리기).

**준비**
- 설치: 가상 환경(파이썬 L16D) 안에서 `pip install pypdf python-docx reportlab cryptography`.
  - `pypdf` 는 PDF 읽기 · 합치기 · 나누기 · 암호, `python-docx` 는 워드, `reportlab` 은 새 PDF 만들기(연습 재료 · 수료증), `cryptography` 는 pypdf 의 AES 암호에 필요해요.
  - 함정 하나: 설치 이름은 `python-docx` 인데 코드는 `import docx` 예요. `pip install docx` 는 다른(옛) 패키지라 깔면 에러가 나요.
- 프로그램: 워드 또는 한컴오피스 · LibreOffice(만든 문서 열어 보기), PDF 보기(Edge · Acrobat), 메일 앱(Outlook · Thunderbird 등, `.eml` 열어 보기). 실제 발송은 내 Gmail 또는 네이버 메일 계정(선택).
- 예제 데이터: 이 교과서가 만든 **연습 재료 `samples.py`** 하나를 J0 에서 프로젝트 폴더에 저장해요. 모든 예제와 문제가 `from samples import …` 로 임시 폴더 안에 가짜 파일을 만들어 써요(`content.js` 상수 `SAMPLES_PY`).
  - `make_files(folder)`: 「다운로드」 폴더 흉내 가짜 파일 12개(사진 · 문서 · 워드 임시 파일 `~$견적.docx` · `Thumbs.db` · 대문자 확장자 · 이름에 빈칸). `os.utime` 으로 수정 시각을 고정해요.
  - `make_pdf(path, pages)`: 쪽마다 글자를 넣은 PDF. reportlab 의 `UnicodeCIDFont("HYGothic-Medium")` 를 써서 **글꼴 파일 없이 한글**이 들어가고, pypdf 로 다시 읽혀요(확인함). `invariant=1` 로 만든 날짜가 들어가지 않게 해요.
  - `make_invoices(folder)`: 거래처 청구서 PDF 6개. 하나는 글자가 없는 「스캔본」(빈 쪽), 하나는 암호 `1234` 가 걸려 있어요.
  - `make_template_docx(path)`: `${이름}` 자리가 run 둘(`${` + `이름}`)로 쪼개진 워드 틀(J7 의 함정 재료).
  - `make_windows_zip(path)`: 한글 파일 이름이 cp949 로 들어 있는 zip(Windows 기본 압축 · 옛 프로그램이 만든 것 흉내).
  - `make_eml(path)`: 첨부(견적서 PDF)가 든 받은 메일 한 통.
  - `ROSTER_CSV`: 수강생 8명(이름 · 이메일 · 수업 · 수강료 · 수료일). 이메일은 모두 `example.com` 이고, 한 명은 이메일 칸이 비어 있어요.
  - `FakeSMTP`: `send_message` 를 받으면 기록만 하는 가짜 메일 서버(J10 에서 직접 만들어 본 뒤 만들어 보기에서 씀).

| 챕터 | id · 제목 | 주요 내용 |
| --- | --- | --- |
| 0 시작 | J0 업무 자동화 첫걸음 | 자동화할 일 고르기: 자주 · 규칙대로 · 오래 걸리는 일(「한 번 5분 × 주 5번 × 52주 = 21시간」 계산) · 사람이 판단해야 하는 일은 남겨 두기 · 안전 세 원칙(원본은 읽기만 · 결과는 새 폴더에 · 미리 보기 먼저 — L27 · X7 복습 링크) · 준비: 가상 환경에 `pip install …` 과 `pip list` 로 확인 · `samples.py` 저장하고 `make_files(tmp)` 한 번 돌려 보기 · 자동화 프로그램의 기본 모양: `main(argv)` · `--dry-run` · 로그(L19B · L19C · L31 복습 링크) |
| 1 파일 · 폴더 일괄 처리 | J1 이름 한꺼번에 바꾸기 · 날짜로 정리 | 규칙을 함수로 떼기 `new_name(p, i)`: 번호 `f"{i:03}"` · 앞 · 뒤 붙이기 · `re.sub`(L20B) · 빈칸과 Windows 금지 글자 9개(`<>:"/\?*` 와 세로줄) 바꾸기 · 미리 보기 표(전 → 후) · 바꾸기 전 충돌 검사 두 가지(새 이름끼리 겹침은 `Counter`, 이미 있는 파일은 `exists`) · 맞바꾸기 함정(a → b 와 b → a 가 함께면 덮어씀) → 임시 이름으로 두 단계 · 되돌리기 기록 `rename_log.csv` 와 `undo` · 수정 시각 `p.stat().st_mtime` → `datetime.fromtimestamp` 로 `2026-10-03_사진.jpg` · 년/월 폴더(`2026/10`)로 옮기기 · 연습 파일의 날짜는 `os.utime` 으로 고정 · Windows 는 대소문자만 다른 이름(`a.JPG` → `a.jpg`)도 `exists()` 가 참인 함정 |
| | J2 백업: 복사 · 비교 · 정리 | `shutil.copy2`(수정 시각까지) vs `copy` · `shutil.copytree(src, dst, dirs_exist_ok=True, ignore=shutil.ignore_patterns("*.tmp", "~$*", "Thumbs.db", "__pycache__"))` · 바뀐 것만 복사(크기 + `st_mtime` 으로 빠르게, 확실히는 `filecmp.cmp(a, b, shallow=False)`) · 두 폴더 비교 `filecmp.dircmp` 의 `left_only` · `right_only` · `diff_files` · 날짜 이름 백업 폴더(`YYYY-MM-DD` 라서 이름 순 = 날짜 순)와 최근 n개만 남기기(지울 목록 미리 보기 → 지우기) · 중복 파일 찾기: 크기로 먼저 묶고 같은 크기끼리만 sha256(C16 복습 링크) · `shutil.disk_usage` 로 남은 공간 확인(값은 ☐) |
| | J3 압축: zipfile | `ZipFile(path, "w", compression=ZIP_DEFLATED)` · `zf.write(p, arcname=p.relative_to(base).as_posix())` — arcname 을 빼면 내 PC 경로가 통째로 들어가는 함정 · 목록과 크기 `namelist()` · `infolist()` 의 `file_size` · `compress_size`(jpg · zip 은 거의 안 줄어요) · 풀지 않고 하나만 읽기 `zf.read(name)` · 풀기 `extractall(새 폴더)` · 깨진 곳 찾기 `testzip()` · 한글 이름이 깨진 zip → `ZipFile(path, metadata_encoding="cp949")`(3.11+) · 한 줄짜리 `shutil.make_archive` · `unpack_archive` · 암호 zip 은 푸는 것만 `pwd=b"…"`(만들기는 표준에 없음, 7-Zip 이름만) · tar 는 리눅스 U14 링크 |
| | **JB1** 🛠 매일 쓰는 백업 도구 | `backup.py 원본 백업폴더 [--dry-run] [--keep 7]` — ① 넣을 파일 고르기(제외 규칙: `~$*` · `*.tmp` · `Thumbs.db` · 숨김 폴더) ② 지난번과 비교: `manifest.json`(상대 경로 → 크기 · sha256)과 같으면 「바뀐 게 없어 건너뜀」 ③ 날짜 이름 zip(`문서_2026-11-08.zip`) 만들고 다시 열어 `namelist` 로 확인 ④ 최근 n개만 남기기(미리 보기 먼저) ⑤ 합치기 `main(argv, today=date(2026, 11, 8))` + 요약 출력(넣은 파일 수 · 건너뛴 수 · 지운 백업) |
| 2 문서: PDF · 워드 | J4 PDF 읽기 · 글자 꺼내기 | pypdf 와 옛 PyPDF2(블로그 코드의 `PdfFileReader` · `PdfMerger` → 지금 이름 `PdfReader` · `PdfWriter.append`) · `PdfReader(path)` · `len(r.pages)` · `page.extract_text()` · `r.metadata.title` · 글자가 없는 PDF(스캔본 → 빈 글자, OCR 은 이름만) · 띄어쓰기 · 줄 순서가 흐트러질 수 있음 → `" ".join(text.split())` 로 고른 뒤 정규식(L20B)으로 필요한 값만(청구 번호 · 날짜 · 금액 → `int(s.replace(",", ""))`) · 암호 PDF `r.is_encrypted` · `r.decrypt(pw)` · 폴더 안 PDF 여러 개 → csv(L29 `utf-8-sig`) · 못 읽은 파일 목록 따로 · 엑셀로 내보내기는 `files` 코스 · 표 꺼내기(pdfplumber)는 이름만 |
| | J5 PDF 합치기 · 나누기 · 고치기 | `w = PdfWriter()` · `w.append(path)` · `w.append(path, pages=(0, 3))` · 사람이 쓰는 쪽 범위 `"1-3,5"` → 0부터 번호 리스트로 바꾸는 함수(사람은 1쪽부터!) · 쪽마다 나누기(`w.add_page(page)`, 이름 `_p01.pdf`) · 회전 `page.rotate(90)` · 빼기 · 순서 바꾸기 · 책갈피 `add_outline_item(제목, 쪽)` · `add_metadata({"/Title": …})` · 암호 걸기 `w.encrypt(pw, algorithm="AES-256")` · 도장 · 워터마크 `page.merge_page(stamp)` · 새 PDF 만들기 맛보기: reportlab `canvas.Canvas` · `registerFont(UnicodeCIDFont("HYGothic-Medium"))` · `drawString` · `showPage`(samples.py 가 쓰는 방법) · 확인은 늘 다시 열어서(쪽 수 · 쪽마다 첫 낱말 · `rotation` · 책갈피 제목) |
| | J6 워드 문서 만들기 | `from docx import Document` · `add_heading(…, level=1)` · `add_paragraph` · run 과 서식(`bold` · `font.size = Pt(14)` · `font.color.rgb = RGBColor(…)`) · 한글 글꼴은 `font.name` 만으로 안 먹는 함정 → `rPr.rFonts.set(qn("w:eastAsia"), "맑은 고딕")`, 문서 전체는 `doc.styles["Normal"]` 에 한 번 · 표 `add_table(rows=1, cols=4)` · `table.style = "Table Grid"` · 줄 더하기 `add_row().cells` · 쪽 나누기 `add_page_break` · 여백 `sections[0].left_margin = Cm(2)` · 머리글 · 바닥글 `section.header.paragraphs[0]` · 저장 뒤 다시 열어 `paragraphs` · `p.style.name` · `tables[0].cell(r, c).text` 찍기 · 그림 `add_picture`(겉모양 ☐) · `.doc` · `.hwp` 는 못 엶(프로그램에서 docx 로 저장) |
| | J7 워드 읽고 고치기 · 틀 채우기 | 문단 · 표 칸 · 머리글 · 바닥글을 다 도는 `all_paragraphs(doc)` · `p.text = …` 로 바꾸면 그 문단 서식이 사라지는 함정 · run 쪼개짐 함정(`${이름}` 이 `${` + `이름}` 두 run 으로 나뉨 — Word 가 맞춤법 검사 · 고친 기록마다 run 을 쪼갬) → 문단 글자를 합쳐 바꾼 뒤 첫 run 에 넣고 나머지 run 은 비우기 · 표에 줄 더하기 · 틀 문서는 그대로 두고 새 이름으로 저장 · 다 바꾼 뒤 남은 `${…}` 찾기 · PDF 로 바꾸기: Word 가 있으면 `docx2pdf`, 아니면 LibreOffice `soffice --headless --convert-to pdf`(L28 subprocess) — 둘 다 ☐ |
| | **JB2** 🛠 청구서 정리기 | `make_invoices` 의 PDF 6개 → ① 글자 꺼내 거래처 · 번호 · 날짜 · 금액 뽑기(스캔본 · 암호 걸린 것은 「못 읽음」 목록, 암호는 입력받아 다시 시도) ② 날짜 순으로 합친 `2026-10_청구서_모음.pdf`(책갈피 = 거래처 이름) ③ 워드 보고서 `2026-10_청구_정리.docx`(제목 · 표 · 합계 · 못 읽은 파일) ④ 만든 두 파일을 다시 열어 쪽 수 · 책갈피 · 표 줄 수 · 합계 찍기 ⑤ 같은 값을 csv 로도(엑셀 보고서는 `files` 코스 링크) |
| 3 글자 · 템플릿 · 메일 | J8 템플릿으로 문서 대량 만들기 | `string.Template`: `$name` · `${name}` · `substitute`(빠지면 `KeyError`) vs `safe_substitute` · `$$` · **한글 자리 이름은 기본으로 안 됨**(`$이름` → `ValueError: Invalid placeholder`, 기본 `idpattern` 이 영문만) → `class KTemplate(Template): idpattern = r"[^\W\d]\w*"` · 한글은 뒤에 붙는 말까지 이름으로 읽힘(`$이름님` = `이름님`) → 늘 `${이름}님` · `get_identifiers()` 로 틀이 바라는 이름 미리 보기 · 왜 f-string · `str.format` 이 아닌가(틀이 파일에 있음, 남이 쓴 틀의 `{x.__class__}` 위험) · 명단 csv(L29) × 틀 → 사람마다 파일 · 먼저 전부 검사하고 그다음 만들기(반쯤 만들다 멈추지 않게) · 값 서식은 넘기기 전에(`f"{n:,}"` L9C · 날짜 L19) · 파일 이름 안전하게(J1 함수) · HTML 틀은 값마다 `html.escape`(X17) · 워드 틀은 J7 함수로 |
| | J9 이메일 메시지 만들기 · 읽기 | `email.message.EmailMessage` · `msg["From"]` · `["To"]` · `["Cc"]` · `["Subject"]`(한글 그대로) · 한글 이름 주소 `email.utils.formataddr(("김민수", addr))` · `parseaddr` · `set_content(글)` + `add_alternative(html, subtype="html")` · 첨부 `add_attachment(data, maintype="application", subtype="pdf", filename="수료증_김민수.pdf")` · `mimetypes.guess_type`(Windows 는 레지스트리마다 답이 달라 → 내 표 + `application/octet-stream`) · 첨부 크기 한도(보통 20~25MB) · `.eml` 로 저장 `msg.as_bytes()` → `BytesParser(policy=policy.default)` 로 다시 읽어 받는 사람 · 제목 · `get_body(preferencelist=("plain",))` · 첨부 이름 찍기 · 받은 메일 `.eml` 에서 첨부 꺼내 저장(`iter_attachments` · `get_filename` · `get_content`) · `as_string()` 은 제목이 `=?utf-8?b?…?=` 이고 경계 글자가 무작위라 그대로 비교하지 않음 |
| | J10 이메일 보내기 | `smtplib.SMTP_SSL(host, 465)` · `SMTP(host, 587)` + `starttls()` · `login` · `send_message`(☐) · Gmail 은 2단계 인증 + 앱 비밀번호, 네이버는 환경 설정에서 SMTP 켜기, 회사 메일은 담당자에게 · 비밀번호는 코드 밖에 `os.environ.get`(L28 · H7) · `getpass` · 보내는 부분을 함수로 떼고 서버 연결을 인자로 → 가짜 SMTP 객체(D10 링크)로 시험 · 여러 명: 한 명씩 · 사이에 `time.sleep` · 실패는 기록하고 계속 · `sent.csv` 로 다시 돌려도 두 번 안 보내기 · `Bcc` 는 `send_message` 가 헤더에서 빼 줌 · 첫 발송은 나에게 한 통 · 미리 보기 모드 = `outbox/` 에 `.eml` 만 저장 · 스팸 · 개인정보 · 하루 발송 한도 · 받은 메일함 읽기(`imaplib`)는 이름만 |
| | **JB3** 🛠 수료증 · 안내 메일 일괄 발송기 | `ROSTER_CSV` → ① 명단 검사(이메일 빈 칸 · 중복 → 먼저 알리고 멈춤 또는 건너뜀) ② 사람마다 수료증(워드 틀 `${이름}` · `${수업}` · `${수료일}` 채우기 + reportlab PDF 판) ③ 사람마다 `EmailMessage`(본문은 KTemplate, 수료증 첨부) ④ 기본은 미리 보기: `outbox/` 에 `.eml` 저장하고 다시 읽어 받는 사람 · 제목 · 첨부 이름 찍기 ⑤ `--send` 는 `FakeSMTP` 로 보내고 `sent.csv` 기록, 다시 돌리면 이미 보낸 사람 건너뜀 ⑥ 실제 SMTP 로 나에게 한 통(☐) |
| 4 사람 손 대신 · 정해진 때에 | J11 맛보기: 클립보드 · 키보드 · 마우스 | 언제 쓰고 언제 피하나(파일 · API 가 있으면 그쪽 — `api` 코스 H5, 화면 자동화는 해상도 · 창 위치 · 한글 입력기에 따라 깨지는 마지막 수단) · 클립보드: 표준 `tkinter` 의 `clipboard_get` · `clipboard_append`(☐) · `pip install pyperclip` 의 `copy` · `paste`(☐) · 핵심 로직은 글자 정리 함수로 떼기(복사한 표 글자를 `\t` 로 나눠 csv 로 · 전화번호 모양 맞추기 — 이건 실행 검사) · `pyautogui` 맛보기: `FAILSAFE`(마우스를 화면 모서리로 = 비상 정지) · `PAUSE` · `size()` · `moveTo` · `click` · `hotkey("ctrl", "v")` · `write` 는 한글을 못 침 → 클립보드에 넣고 붙여 넣기 · `webbrowser.open` · Windows `os.startfile` 로 만든 파일 열기 · 브라우저 자동화(Playwright · Selenium)는 이름만 |
| | J12 혼자 돌아가는 스크립트 | 예약으로 돌면 달라지는 것: 현재 폴더가 다름 → `Path(__file__).parent` 기준(L17B) · `input()` 금지 · 화면 출력은 아무도 안 봄 · 설정 파일 `tomllib`(3.11+, 읽기만) 로 `config.toml` · Windows 경로는 작은따옴표 `'C:\Users\…'`(큰따옴표면 `\U` 탈출 에러 `TOMLDecodeError`) · 로그 파일 돌려 쓰기 `logging.handlers.RotatingFileHandler(path, maxBytes=…, backupCount=3, encoding="utf-8")` · 에러는 `log.exception` 으로 트레이스백까지(L31 다음 단계) · 끝 코드 0 · 1(L19C, 작업 스케줄러가 「마지막 실행 결과」 로 보여 줌) · 두 번 겹쳐 돌지 않게 잠금 파일 `open(lock, "x")` → `FileExistsError` · `@contextmanager`(L34)로 감싸 `finally` 에서 지우기 · 전원이 꺼져 남은 오래된 잠금 처리 · 실패하면 나에게 알림 메일(J10) · 지금 시각은 `now` 인자로 받아 시험 |
| | J13 정해진 시간에 돌리기 | Windows 작업 스케줄러(☐): `taskschd.msc` → 기본 작업 만들기 → 트리거(매일 · 매주) → 동작 「프로그램 시작」: 프로그램 = 가상 환경의 `python.exe`(창 없이 `pythonw.exe`) · 인수 = 스크립트 · **시작 위치** 칸(비우면 `C:\Windows\System32` 에서 돎) → 「지금 실행」 → 「마지막 실행 결과」 `0x0` · `0x1` · 「작업 기록」 · 「예약된 시작 시간을 놓친 경우 가능한 대로 빨리 작업 시작」 · 노트북 전원 조건 · 명령으로 `schtasks /Create /SC WEEKLY /D MON /ST 09:00 /TN … /TR …` · `/Query` · `/Delete`(☐) · macOS · 리눅스는 cron(U14 링크: 짧은 PATH → 파이썬 절대 경로 `sys.executable` 을 적기) · 파이썬 쪽은 표준만: 다음 실행 시각 `next_run(now, "09:00", weekdays={0, 1, 2, 3, 4})`(`datetime` · `timedelta`) · 놓친 실행 따라잡기 `last_run.json` 과 `due(last, now)` · 월말 `calendar.monthrange` · `while` + `time.sleep`(L26) 으로 기다리기는 창 · PC 가 켜져 있어야 해서 맛보기만 · 바깥 `schedule` 패키지를 안 쓰는 까닭(결국 프로그램이 계속 켜져 있어야 함) |
| | **JB4** 🛠 월요일 아침 자동 비서 | `weekly.py` — 작업 스케줄러가 매주 월요일 9시에 부르는 스크립트. ① `config.toml` 읽기(폴더 경로 · 남길 백업 수 · 받는 사람) ② 다운로드 폴더의 지난주 파일을 날짜 폴더로(J1) ③ 문서 폴더 백업 zip(JB1 함수 다시 쓰기) ④ 주간 보고서 워드(정리한 파일 수 · 백업 파일 · 지난주 청구 합계 — JB2 함수) ⑤ 나에게 보낼 메일 `.eml`(J9) ⑥ 잠금 · 회전 로그 · 끝 코드 · `last_run.json` 으로 놓친 주 따라잡기 — 전부 `main(argv, now=datetime(2026, 11, 9, 9, 0))`(월요일)로 실행 검사 ⑦ 작업 스케줄러 등록과 「지금 실행」(☐) |

**겹침 처리**
- 파이썬 L27(pathlib · shutil 기본: `iterdir` · `glob` · `suffix` · `rename` · `copy` · `move` · `unlink` · 미리 보기)은 다시 가르치지 않아요. J1 · J2 첫 쪽에 「복습: 파이썬 교과서 레슨 L27」 링크만 두고, 새 것(규칙 이름 바꾸기 · 충돌 · 되돌리기 · `stat` 날짜 · `copy2` · `copytree` · `filecmp`)으로 채워요.
- 파이썬 X7(다운로드 폴더 정리기 — 확장자별 폴더 · `이름 (1)` · `--dry-run`)은 「이미 만든 것」 으로 링크해요. 이 코스는 확장자별 정리를 다시 만들지 않고, **날짜별 정리 · 이름 규칙 · 백업**으로 넘어가요. JB1 은 정리기가 아닌 백업 도구예요.
- 파이썬 L28(`os.environ` · `subprocess.run`)은 J10(비밀번호를 환경 변수로)과 J7(LibreOffice 로 PDF 바꾸기)에서 링크로 불러 쓰기만 해요.
- 파이썬 L31(logging 기본 · `basicConfig` · 파일에 남기기)은 링크하고, J12 는 그다음(`RotatingFileHandler` · `log.exception` · 예약 실행용 로그)만 가르쳐요.
- 파이썬 L21(`tempfile.TemporaryDirectory`) · L17B(`Path(__file__).parent`) · L29(csv · `utf-8-sig`) · L20B(정규식) · L19 · L16B(날짜) · L19B · L19C(argparse · 끝 코드) · L26(`sleep`) · L34(`@contextmanager`) · L9C · X17(`html.escape`)은 쓰는 자리마다 「복습: 레슨 ○○」 링크.
- CS C16(sha256 파일 지문)은 J2 중복 찾기 · JB1 manifest 에서 링크로 쓰고 해시 자체는 설명하지 않아요.
- 리눅스 U14(tar · crontab 문법 · cron 의 함정)는 J3 · J13 에서 링크. J13 은 **Windows 작업 스케줄러**와 「예약으로 돌 파이썬 스크립트 쪽」 만 새로 가르쳐요.
- 디버깅 D10(가짜 객체 · monkeypatch)은 J10 의 가짜 SMTP 에서 링크. pytest 는 쓰지 않고 함수에 객체를 넘기는 방식만.
- HTTP·API·SDK H7(`.env` · 키 관리)은 J10 에서 링크.
- 데이터 분석 `data` · 데이터 파일 다루기 `files`: 엑셀 · pandas 는 다루지 않고 링크만(J4 · JB2 · J8).
- 파이썬 X18(csv → 마크다운 보고서)과 JB2 · JB4 의 보고서는 결과물이 워드라서 겹치지 않아요.

**검사(CI)**
- 예시 답은 python3(CI 3.12)로 실제 실행해요. `tools/requirements-ci.txt` 에 `pypdf` · `python-docx` · `reportlab` · `cryptography` 를 더해요. 인터넷은 쓰지 않아요.
- **연습 재료**: 문제는 `prep: { name: 'samples.py', text: SAMPLES_PY }` 로 같은 폴더에 둬요. 쪽 예제는 지금 `check_book` 이 `main.py` 하나만 써서, `example.prep` 도 같은 방식으로 써 주도록 한 줄 넓혀요(데이터 분석 교과서처럼 예제마다 재료를 직접 만드는 것도 되지만, PDF · 워드 · zip 재료는 길어서 예제가 흐려져요).
- **파일**: 모든 예제 · 답은 `tempfile.TemporaryDirectory()` 안에서 `make_files` · `make_invoices` 등으로 가짜 파일을 만들어 써요. 경로는 매번 달라서 `p.name` 이나 `relative_to(base).as_posix()` 만 찍어요. 목록은 늘 `sorted`.
- **날짜 · 시간**: `datetime.now()` · `date.today()` 를 찍지 않아요. 프로그램은 `today` · `now` 를 인자로 받고, 예시 답은 `date(2026, 11, 8)` · `datetime(2026, 11, 9, 9, 0)` 을 넘겨요. 파일 수정 시각은 `os.utime(p, (ts, ts))`(`ts = datetime(…).timestamp()`)로 고정해요. 로컬 시각으로 넣고 로컬 시각으로 읽어서 CI(UTC)와 학습자 PC(KST)가 같은 결과를 내요(확인함).
- **PDF**: 만든 파일을 `PdfReader` 로 다시 열어 쪽 수 · 쪽마다 첫 낱말 · `rotation` · 책갈피 제목 · `is_encrypted` · `metadata.title` 을 찍어요. 파일 크기 · 바이트는 버전마다 달라 찍지 않아요. `extract_text()` 의 띄어쓰기도 버전마다 조금 달라서 `" ".join(t.split())` 로 고르거나 정규식으로 뽑은 값만 찍어요. reportlab 은 `invariant=1`.
- **워드**: 저장 → `Document(path)` 로 다시 열어 문단 글자 · `style.name` · 표 칸 · 머리글 · `runs` 의 `bold` · `font.name` 을 찍어요. 겉모양은 ☐.
- **zip**: `sorted(zf.namelist())` · `testzip()` 결과 · 풀어 낸 파일 내용만 찍어요. 압축 크기는 찍지 않아요(`compress_size < file_size` 같은 참 · 거짓만).
- **메일**: `EmailMessage` 를 만들고 `.eml` 로 저장 → `BytesParser(policy=policy.default)` 로 다시 읽어 받는 사람 · 제목 · 본문 · 첨부 이름 · 첨부 바이트가 원본과 같은지(`==`)를 찍어요. `as_string()` 원문은 경계 글자가 무작위라 찍지 않아요. `Date` · `Message-ID` 는 붙이지 않거나 찍지 않아요. 「보내기」 는 `FakeSMTP` 를 넘겨 실행 검사하고, 진짜 `smtplib` 연결은 noRun + ☐.
- **템플릿 자리표시**: `check_book` 은 `{{…}}` 가 남은 답을 에러로 잡아요. 이 코스는 처음부터 끝까지 `string.Template` 의 `${이름}` 모양을 쓰니 걸리지 않아요(워드 틀도 `${…}`).
- **noRun 으로 둘 것**(문제는 noRun + 「확인할 것 ☐」, 쪽 예제는 `example.code` 없이 본문 `<pre>` 로만 — `check_book` 은 파이썬 쪽 예제를 모두 실행하니까):
  - 진짜 메일 보내기(`SMTP_SSL` · `login` · `send_message`) · `imaplib`
  - 작업 스케줄러 · `schtasks` · cron 등록 · 끝없이 기다리는 `while … sleep` 루프
  - 클립보드(`tkinter` · `pyperclip`) · `pyautogui` · `webbrowser.open` · `os.startfile`
  - 워드 → PDF 바꾸기(`docx2pdf` · `soffice`)
  - 내 진짜 폴더에 쓰는 마지막 단계(예시 답은 임시 폴더판이 실행 검사, 진짜 폴더판은 ☐)
- 위 noRun 문제도 핵심 로직(글자 정리 함수 · `next_run` · `due` · 보내기 목록 만들기)은 따로 떼어 실행 검사하는 문제를 하나씩 붙여요(파이썬 X14 의 「계산은 따로」 와 같은 모양).

**사람이 확인할 것**
- 만든 PDF 를 Edge 나 Acrobat 으로 열어: 쪽 순서 · 회전 · 책갈피 창 · 도장이 보이는지, 한글이 네모로 깨지지 않는지(reportlab CID 글꼴은 파일 안에 글꼴을 넣지 않아서 Acrobat 이 「아시아 글꼴 팩」 을 물을 수 있음), 암호 PDF 가 열 때 암호를 묻는지.
- 만든 워드 문서를 Word · 한컴오피스 · LibreOffice 로 열어: 맑은 고딕 · 표 테두리 · 머리글 · 쪽 나누기 · 틀을 채운 뒤에도 굵게 등 서식이 남았는지.
- 만든 zip 을 Windows 탐색기로 열어 한글 이름 · 폴더 구조가 맞는지, 깨진 이름 zip 을 고쳐 푼 결과.
- `outbox/` 의 `.eml` 을 메일 앱으로 열어 제목 · 보낸 사람 이름 · HTML 본문 · 한글 첨부 이름.
- 실제 발송: 나에게 한 통 보내 받은편지함(스팸함 아님)에 오는지, 앱 비밀번호가 코드 · 로그에 없는지.
- 작업 스케줄러: 등록 → 「지금 실행」 → 「마지막 실행 결과」 `0x0` · 로그 파일이 스크립트 폴더에 생김 → 다음 예약 시각에 저절로 돎. cron 은 리눅스 교과서의 VM 에서.
- 클립보드 · pyautogui: 실제로 복사 · 붙여 넣기가 되는지, 마우스를 모서리로 보내면 멈추는지.
- 진짜 폴더에 돌리기 전 미리 보기 목록을 눈으로 봤는지(백업 · 이름 바꾸기 · 오래된 백업 지우기).

**정할 것(설계 때 물음 — 정한 것은 위 2절)**
- 한글(HWP) 문서: HWP 파일을 직접 열지 않아요(Windows + 한컴오피스가 있어야 하고 공식 파이썬 라이브러리가 없음). 「한글에서 PDF · 워드(.docx)로 저장해서 이 교과서의 도구로 다루기」 한 쪽만 둬요(11/8 정함, 2절).
- 실제 발송 안내를 Gmail · 네이버 둘 다 쓸지, 하나만 쓸지(둘 다면 J10 의 ☐ 쪽이 하나 늘어요).
- `files` 코스를 먼저 만들면, J4 · J8 · JB2 의 「엑셀은 `files` 코스」 링크를 그 코스의 실제 레슨 id 로 바꿔요. 이 코스가 먼저면 코스 링크만 두고 나중에 고쳐요.

---

## 웹 크롤링과 스크래핑 (`crawl`, 레슨 `Y0`~`Y13` · 만들어 보기 `YB1`~`YB3` = 총 17)

**한 줄로**: 웹 쪽의 HTML 을 **BeautifulSoup 으로 나무처럼 읽고 · CSS 선택자로 값을 꺼내고 · requests 로 여러 쪽을 돌며 모아 · csv · sqlite 에 저장**하되, **robots.txt · 속도 · 약관 · 개인정보를 지키고 API 가 있으면 API 를 먼저** 쓰는 습관.

**누구에게 · 어디서 이어지나**
- 대상: 파이썬 교과서 100 레슨을 다 배운 사람.
  - 특히 쓰는 것: L17C(json) · L18C(제너레이터) · L19(날짜 글자) · L25(deque) · L26(`time.sleep`) · L27(pathlib) · L29(csv) · L30(sqlite3) · L31(logging) · L39(pytest) · X17(http.server · `do_GET`).
- 있으면 좋은 것(없어도 그 자리에 요약 한 쪽 + 링크):
  - HTTP·API 교과서 H0~H5(특히 H5 requests 기본기). 없으면 Y6 의 첫 쪽 「복습 상자」 로 충분해요.
  - 웹 교과서 W1 · W2(HTML 구조 · 표) · W4(CSS 선택자) · W13(F12). 없으면 Y1 · Y3 이 필요한 만큼만 다뤄요.
- 다음 갈 곳:
  - 모은 표 분석 → 데이터 분석 교과서(P1~, `pd.read_csv("books.csv")`).
  - 저장한 DB 로 질문 → SQL 교과서(S1~ · S13).
  - 모은 것을 내 API 로 내놓기 → HTTP·API 교과서 챕터 3(H10~).
  - 파서를 테스트로 지키기 → 디버깅·테스트 교과서(D7 · D9 · D10).
  - 매일 자동으로 돌리기 → 리눅스 교과서 U14(cron) · Windows 는 「작업 스케줄러」(이름만).

**준비**
- 설치: `python -m pip install requests beautifulsoup4`(가상 환경, 파이썬 L16D).
  - 파서는 늘 파이썬에 든 `"html.parser"`(lxml · html5lib 은 이름만).
  - Playwright 는 Y13 의 맛보기 쪽에서만 「해 보고 싶으면」(`pip install playwright` → `playwright install chromium`, 큰 내려받기 경고).
- 예제 데이터: **교과서가 만든 가상 헌책방 「다람쥐 헌책방」** — 실제 가게 · 실제 책이 아님을 밝혀요.
  - `practice_site.py`(표준 라이브러리만, 약 200줄): 시작하기 쪽에서 📋 복사 / ⬇ 받기(데이터 교과서의 `cafe.csv` 와 같은 방식). 안은 읽지 않아도 되고, 궁금하면 「X17 의 `do_GET` 과 같은 모양」.
    - 브라우저로 볼 때: `python practice_site.py` → `http://127.0.0.1:8765`(이 컴퓨터에서만).
    - 코드에서 켤 때: `from practice_site import start` → `base, srv = start()`(빈 포트 · 스레드). 챕터 2~3 의 모든 예시 답이 이렇게 해요.
  - 저장해 둔 HTML 글자: `SHOP_P1_HTML` · `SHOP_V2_HTML` · `BOOK_DETAIL_HTML` · `EVENTS_HTML`(book.js 상수, 챕터 1 은 이것만).
    - `practice_site.py` 가 내는 쪽과 같은 글자예요. 한쪽에서 만들어 다른 쪽에 넣어요(아래 검사).

### 연습 사이트 `practice_site.py` 가 내는 쪽

| 주소 | 내용 | 가르치는 것 |
| --- | --- | --- |
| `/` | 첫 쪽 · 메뉴 링크 | 링크 모으기 · 같은 사이트만 |
| `/books?page=1`~`3` | 쪽마다 10권, `ul.book-list > li.book` 안에 `h3.title a[href="/books/7"]` · `span.author` · `span.price`「12,000원」 · `p.star.star-4` · `span.stock`「품절」. 3쪽에는 `a.next` 가 없어요 · 4쪽은 빈 목록 | 쪽 넘기기 · 끝 조건 |
| `/books/<id>` | `dl.info`(dt/dd: 출판일「2024년 3월 5일」 · 쪽수 · 상태 상/중/하 · 장르) · `div.desc`. **13 → 404 · 21 → 500**(늘 같게) | 상세 쪽 · 실패를 건너뛰기 |
| `/events` | 11월 행사표: `<table id="events">` · `thead` · 날짜 칸 `rowspan` · 빈 칸 · 자리「마감」 | 표 긁기 |
| `/notice` | **EUC-KR** 로 쓴 공지. `Content-Type: text/html` 에 charset 없음 · `<meta charset="euc-kr">` | 글자 깨짐 |
| `/robots.txt` | `Disallow: /members` · `Disallow: /admin/` · `Crawl-delay: 1` · `Sitemap:` | robotparser |
| `/members` | 가짜 회원 이름 · 전화(`010-0000-…`) — robots 로 막힌 쪽 | 개인정보 · 안 긁기 |
| `/api/books?page=N` | 같은 30권을 JSON 으로(`items` · `next`) | API 먼저 |
| `/new` | `<ul id="new-books"></ul>` + `<script>` 가 `/api/new` 를 불러 그림 | JS 로 그리는 쪽 |
| `/v2/books?page=1` | 「사이트 개편」: `article.item` · 가격은 `data-price` 속성 | 바뀌면 깨지는 선택자 |

- `start(day=1, rate_limit=None)` 옵션:
  - `day=2`: 다섯 권 가격이 바뀌고(셋 내림 · 둘 오름), 두 권이 품절, 새 책 두 권(31 · 32)이 생겨요. 브라우저용은 `python practice_site.py --day 2`.
  - `rate_limit=1.0`: 1초 안에 또 오면 `429` + `Retry-After: 1`.
- 요청 기록: `srv.log` 에 (경로, User-Agent) 를 쌓아요. 예시 답이 「보낸 요청 수 · 내 이름을 밝혔나」 를 찍어 예의를 숫자로 확인해요.
- 책 30권(장르 5: 소설 · 과학 · 요리 · 여행 · 만화)의 제목 · 저자는 교과서가 지어낸 것이에요.

### 레슨 표

| 챕터 | id · 제목 | 주요 내용 |
| --- | --- | --- |
| 0 시작 | Y0 크롤링 · 스크래핑이란 | 사람이 복사하던 일(가격 비교 · 공지 모으기 · 연구 자료)을 프로그램이 · **크롤링(링크 따라 쪽 모으기) vs 스크래핑(쪽에서 값 꺼내기)** · 받기 → 읽기 → 꺼내기 → 저장 · 하기 전 세 질문(API 있나 · 허락했나(robots · 약관) · 개인정보인가 — 자세히는 챕터 3) · 설치와 `practice_site.py` 켜 보기(☐ 브라우저) · 첫 세 줄 `BeautifulSoup(html, "html.parser")` → `soup.title.get_text()` · **챕터 3 전에는 진짜 사이트에 돌리지 않기** |
| 1 HTML 에서 꺼내기 (글자 · 파일만) | Y1 HTML 을 나무로 읽기 | 태그 · 속성 · 중첩 복습(웹 W1 · W2 링크) · 부모 · 자식 · 형제를 글 그림으로 · F12 Elements 에서 요소 고르기(Ctrl+Shift+C, ☐, 웹 W13 링크) · 「페이지 소스 보기(Ctrl+U)」 와 Elements 는 다를 수 있음(Y13 예고) · `soup.h1` 처럼 점은 **첫 번째 하나만** · `prettify()` 로 들여 보기(출력 예에는 안 씀) · 파서 이름을 빼면 경고 · 닫는 태그가 빠진 HTML 도 읽어 줌 |
| | Y2 find · find_all 과 글자 · 속성 | `find` · `find_all(name, class_=, id=, attrs={"data-id": "7"}, limit=)` · `get_text(strip=True)` · 공백 정리 `" ".join(t.split())` · **`.string` 은 자식이 섞이면 `None`** · 속성 `tag["href"]`(없으면 KeyError) vs `tag.get("href")` · `tag["class"]` 는 리스트(`["star", "star-4"]`) · 못 찾으면 `None` → 에러 읽기 `AttributeError: 'NoneType' object has no attribute 'get_text'` · 방어 `t.get_text() if t else ""` |
| | Y3 CSS 선택자: select · select_one | `select` · `select_one` · `tag` · `.class` · `#id` · `[attr]` · `[href^="/books/"]` · 자손(공백) · 자식(`>`) · `li:nth-of-type(2)` · 여럿 `,` · find 와 select 비교표 · F12 「Copy selector」 의 긴 선택자(`body > div:nth-child(3) > …`) 줄이기 · **잘 안 바뀌는 선택자**(id · `data-*` · 뜻 있는 class) vs 위치에 기대는 선택자 · 웹 W4 · W8 `querySelector` 와 같은 문법(링크) |
| | Y4 나무 따라 움직이기 · 값 다듬기 | `.parent` · `find_parent("li")` · `find_next_sibling("dd")` · `.children` · 「라벨 옆의 값」 dl/dt/dd → 딕셔너리 · 「12,000원」 → `int(s.replace(",", "").removesuffix("원"))`(정규식은 L20 링크) · 「2024년 3월 5일」 → `date`(L19 링크) · 별점 class `star-4` → 4 · 상대 주소 `urllib.parse.urljoin(base, "/books/7")` 과 함정(`../` · 끝 `/` 있고 없고) · **HTML 은 정규식으로 자르지 않고 파서로**(L20B 와 다른 점 한 쪽) |
| | Y5 표 긁기 | `<table>` → `thead th` 열 이름 · `tbody tr` → `td` · `dict(zip(heads, cells))` · 머리 칸이 첫 줄 `th` 인 표 · 빈 칸 · **`rowspan` 채우기**(위 칸 값을 아래 줄로) · `colspan` 이름만 · 한 쪽에 표가 여럿 → `id` · `caption` 으로 고르기 · 숫자 칸 바꾸기 · `pd.read_html` 은 이름만(lxml 필요 — 데이터 교과서 링크) |
| | **YB1** 🛠 헌책방 목록 쪽 해부 | prep 으로 저장해 둔 쪽을 읽어요. ① `li.book` 한 권 → 딕셔너리(제목 · 저자 · 가격 int · 별점 int · 재고 · 상세 절대 주소) ② 열 권 → 품절 빼고 싼 순 TOP 3 ③ `events.html` 행사표 → 자리 남은 행사만 날짜순 ④ 「사이트가 바뀌었어요」 `books_v2.html` — v1 · v2 둘 다 되는 `parse_book` + `assert` 시험(L39 링크) |
| 2 받아 오고 · 모으고 · 저장하기 (연습 서버) | Y6 requests 로 HTML 받기 | 복습 상자: `get` · `timeout` · `raise_for_status`(api H5 링크) · 연습 서버를 코드에서 켜기 `base, srv = start()`(안: `ThreadingHTTPServer(("127.0.0.1", 0), …)` · daemon 스레드 · 끝나면 `srv.shutdown()` — X17 링크) · `res.text` vs `res.content` · **charset 없는 `text/html` 은 requests 가 ISO-8859-1 로 짐작** → `/notice` 깨짐 → `res.encoding = "cp949"` · `res.apparent_encoding` · 가장 쉬운 길 `BeautifulSoup(res.content, "html.parser")`(`<meta charset>` 을 읽음) · `res.url` · `Content-Type` 이 HTML 인가(api H3 링크) · **내 이름 밝히기** `headers={"User-Agent": "daram-study-bot/0.1 (me@example.com)"}` → `srv.log` 로 확인 |
| | Y7 여러 쪽 넘기기 | `params={"page": n}` · 「다음」 링크 `select_one("a.next")` + `urljoin` 따라가기 · **끝 조건 셋**(다음 링크 없음 · 빈 목록 · `max_pages` 안전장치) · 같은 주소를 두 번 가면 멈추기 · 쪽을 내보내는 제너레이터 `def walk(...): … yield soup`(L18C) · `requests.Session()` 한 번(H5 링크) · 검색 폼(GET `form` 의 `action` · `name` → params, 웹 W3 링크) · 「더 보기」 버튼은 JS(Y13 예고) · API 의 쪽 넘기기는 api H8 |
| | Y8 목록 → 상세: 크롤러 만들기 | 상세 링크 모으기 · `visited = set()` · 같은 사이트만 `urlparse(u).netloc` · 주소 다듬기(`urldefrag` 로 `#` 떼기 · 끝 `/`) · 넓게 먼저 `deque`(L25) · 깊이 · 최대 쪽 수 · **실패해도 계속**: 404 · 500 은 건너뛰고 `logging.warning`(L31) · `requests.RequestException` · 재시도는 5xx 한 번만(자세히는 api H8) · 끝에 「성공 28 · 실패 2」 요약 |
| | Y9 모은 것 저장: csv · sqlite | `csv.DictWriter` + `encoding="utf-8-sig"`(엑셀, L29 복습) · json 은 이름만(L17C) · sqlite 표 설계: `book_id INTEGER PRIMARY KEY` · `url TEXT UNIQUE` · `crawled_at` · **다시 긁을 때** 중복 막기 `INSERT OR IGNORE` vs 바뀐 값 갱신 `INSERT … ON CONFLICT(book_id) DO UPDATE SET price = excluded.price` · `executemany` · 책 표와 가격 기록 표 나누기(sql S10 링크) · 날짜는 인자로(`today="2026-11-08"`) · L30 · sql S8 · S9 · S13 링크 |
| | **YB2** 🛠 다람쥐 헌책방 책 전부 모으기 | 연습 서버(prep `practice_site.py`)에서. ① 3쪽 목록 → 30권 기본 정보 ② 상세까지 → 출판일 · 쪽수 · 상태 합치기(13 · 21 은 건너뛰고 기록) ③ `books.csv`(엑셀용) + `books.db` 로 저장 → 다시 읽어 요약(권 수 · 장르별 · 가장 싼 「상」 책) ④ 한 번 더 돌리면 새로 넣은 줄 0 · 보낸 요청 수 · User-Agent 확인 |
| 3 예의 · 법 · 더 나은 길 | Y10 robots.txt 와 속도 | robots 읽기(`User-agent` · `Disallow` · `Allow` · `Crawl-delay` · `Sitemap`) · `urllib.robotparser.RobotFileParser` 의 `set_url` + `read()` / `parse(lines)` · `can_fetch(ua, url)` · **`crawl_delay()` 는 정수만 읽음**(`2.5` → `None`) · robots.txt 가 404 면 「다 허용」, 401 · 403 이면 「다 금지」 로 읽는 점 · robots 는 법이 아니라 약속, 그래도 지킴 · 요청 사이 `time.sleep(delay)`(적혀 있지 않으면 1초 이상) · 한 번에 하나(스레드로 빠르게 금지) · `429` + `Retry-After` 오면 멈추고 기다리기(api H8 링크, `rate_limit=1.0` 으로 직접 겪기) · **캐시**: 받은 HTML 을 `cache/<id>.html` 에, 있으면 안 받기(L27) — 「한 번 받고 분석은 여러 번」 · 시험할 땐 기다림을 기록만 `sleep=waits.append`(디버깅 D10 링크) · ☐ 내가 자주 가는 사이트의 `/robots.txt` 열어 보기 |
| | Y11 이용 약관 · 저작권 · 개인정보 | 약관에서 찾을 말(「자동화된 수단」 · 「크롤링」 · 「상업적 이용」) · 로그인 뒤 쪽 · 캡차 · 차단을 **뚫지 않기** · 사실(가격 · 날짜)과 창작물(글 · 사진 · 리뷰 본문)의 차이 · 데이터베이스를 통째로 베끼지 않기 · 출처 남기기(ai Z10 링크) · **개인정보**: 이름 · 전화 · 이메일 · 프로필은 공개돼 있어도 모으지 않기, 꼭 필요하면 가리기(ai Z9 의 `re.sub` 링크) · `/members` 는 robots 가 막음 → `can_fetch` False 확인 · 법은 이름만(한국: 저작권법(데이터베이스 제작자 보호) · 정보통신망법 · 개인정보 보호법 · 부정경쟁방지법) + 「법률 조언이 아니에요 · 나라마다 달라요 · 모르면 묻기」 · 판단표 함수 `should_crawl(robots_ok, terms_ok, personal, api)` · ☐ 한 사이트의 약관에서 위 말 찾기 |
| | Y12 API 가 있으면 API 를 먼저 | HTML 긁기 vs API 비교표(잘 바뀌나 · 빠르기 · 허락 · 양) · 찾는 법: 사이트 아래쪽 「개발자」 · 「오픈 API」 · 공공 데이터 포털(이름만) · F12 Network → Fetch/XHR 에서 JSON 주소 찾기(api H4 링크, ☐) · 연습 서버 `/api/books?page=` 로 YB2 의 30권을 몇 줄로 · 결과가 HTML 로 모은 것과 같은지 비교 · 키 · 한도 · 문서 읽기는 api H7 · H8 · H9 · 「숨은 JSON」 도 약관 확인 |
| | Y13 자바스크립트로 그리는 쪽 | 왜 비어 있나: `/new` 의 HTML 에는 `<ul id="new-books"></ul>` + `<script>` 뿐 → `select("#new-books li")` 가 0개 · **requests 는 JS 를 돌리지 않음** · Ctrl+U(받은 글자) vs Elements(그린 뒤) 비교(☐) · 그 JS 가 부르는 JSON 을 Network 에서 찾아 직접 받기(웹 W10 fetch · Y12) · `<script>` 안의 `window.__DATA__ = {…}` 를 꺼내 `json.loads` · 그래도 안 되면 브라우저 자동화: **Playwright 맛보기 한 쪽**(`sync_playwright` · `page.goto` · `page.wait_for_selector` · `page.content()` → bs4, noRun ☐) · Selenium 은 이름만 · 무겁고 느리고, 예의 규칙은 그대로 |
| | **YB3** 🛠 중고책 가격 알리미 (종합) | 위시리스트(책 id 다섯). ① 먼저 점검: robots `can_fetch` · Crawl-delay · `/api/books` 가 200 + JSON 인가 → 「API 로 가요」 ② 1일째 가격을 sqlite `prices(book_id, day, price, PRIMARY KEY(book_id, day))` 에 ③ `start(day=2)` 의 2일째 → 내린 책 · 품절 · 다시 들어온 책 알림 줄 ④ API 에 없는 「상태(상 · 중 · 하)」 는 상세 HTML 로 보충 + 예의(User-Agent · 기다림 기록 · 캐시)를 `srv.log` 요청 수로 확인 ⑤ ☐ 매일 돌리기(작업 스케줄러 / cron, 리눅스 U14) · 「연습용」 이라고 밝힌 공개 연습 사이트에 같은 틀 돌려 보기(robots · 약관 먼저) |

- 문제 섞기: 레슨마다 3~5문제에 출력 예측 · 고치기(None 에러 · 깨진 글자 · 무한 루프) · 에러 읽기 · 🏠 생활형(동네 행사표 · 공지 모으기 · 가격 비교)을 섞어요.

**겹침 처리**

| 기존 레슨 | 겹치는 것 | 이 코스에서는 |
| --- | --- | --- |
| api H5 | requests `get` · `params` · `timeout` · `raise_for_status` · Session | Y6 첫 쪽 「복습 상자」 + 링크. 새로 가르치는 건 `text`/`content` · 인코딩 · User-Agent |
| api H1 · H2 · H3 | 주소 해부(`urlparse`) · 상태 코드 · 리다이렉트 · 헤더 · 「알고 보니 HTML」 | 링크만. 새로 가르치는 건 `urljoin` · `urldefrag`(Y4 · Y8) |
| api H4 | F12 Network | Y12 · Y13 에서 「JSON 주소 찾기」 에만 쓰고 링크 |
| api H7 · H8 · H9 | 키 · 쪽 넘기기(API) · 429 · Retry-After · 재시도 · 문서 읽기 | Y7 · Y8 · Y10 · Y12 에서 링크. 여기서는 **HTML 쪽 넘기기**와 **내 쪽에서 먼저 천천히**(robots · sleep · 캐시)만 |
| 웹 W1 · W2 · W3 · W4 · W8 · W10 · W13 | HTML 구조 · 표 · 폼 · CSS 선택자 · `querySelector` · fetch · F12 | 「읽는 쪽」 에서 필요한 만큼만 다시 보고 링크. 만들기 · 꾸미기는 안 해요 |
| 파이썬 X17 | `http.server` · `BaseHTTPRequestHandler` · `do_GET` · `html.escape` | 서버는 교과서가 `practice_site.py` 로 줘요(만들기를 다시 가르치지 않음). Y6 에서 「X17 과 같은 모양」 한 줄 + 스레드로 켜는 법만 |
| 파이썬 L20 · L20B | 정규식 · `re.sub` · `group` | 숫자만 남기기 · `__DATA__` 꺼내기에서 한 줄씩 링크. 「HTML 은 정규식 말고 파서로」 를 대비시켜요 |
| 파이썬 L29 · L30 · sql S8 · S9 · S10 · S13 | csv · sqlite3 기본 · 제약 · 설계 | 복습 링크. 새로 가르치는 건 다시 긁을 때의 `INSERT OR IGNORE` · `ON CONFLICT … DO UPDATE` · 날짜별 기록 |
| 파이썬 L18C · L25 · L26 · L27 · L31 | 제너레이터 · deque · sleep · pathlib · logging | 크롤러 부품으로 쓰고 링크(새 문법 없음) |
| ai Z9 · Z10 | 개인정보 가리기 · 저작권 · 「공개 ≠ 허락」 | Y11 에서 링크. 여기서는 **긁어 모으는** 쪽의 규칙(robots · 약관 · 막힌 것 뚫지 않기) |
| 디버깅 D10 · 파이썬 L39 | 가짜 객체 · 시간을 인자로 · pytest | Y10 의 `sleep=` 주입 · YB1 의 파서 시험에서 링크 |
| 데이터 P1 | `read_csv` | YB2 결과를 「다음엔 데이터 교과서로」 링크. `pd.read_html` 은 이름만 |

**검사(CI)**
- 설치: `tools/requirements-ci.txt` 에 `beautifulsoup4` 를 더해요(soupsieve 가 따라와서 `select` 가 돼요).
  - requests 는 이미 있어요. lxml · html5lib · playwright 는 깔지 않아요.
- 코스 설정:
  - `courses/crawl/course.json` 의 `runner: "python"`.
  - `BOOK.check = 'crawl'` 로 두고, check_book 32줄의 `['os', 'api', 'asm']` 목록에 더해요. 그러면 「noRun 이면 checks(☐) 필수」 규칙이 걸려요.
- 챕터 1: 예제 · 예시 답 모두 글자 HTML 이나 prep HTML 파일만 읽어요(`BeautifulSoup(html, "html.parser")`). 인터넷을 쓰지 않아요.
- 챕터 2~3: 문제마다 `prep: { name: 'practice_site.py', text: PRACTICE_SITE_PY }` 를 줘요.
  - 예시 답은 `from practice_site import start` → `base, srv = start()` 로 **진짜 HTTP 요청을 localhost 에** 보내요.
  - `start()` 의 동작: 포트 0(빈 포트 — check_book_par 가 동시에 돌려도 안 부딪힘) · daemon 스레드 · `log_message` 를 조용히.
  - 예시 답 끝에서 `srv.shutdown()` 을 불러요.
- 예제 쪽(문제가 아닌 본문 예제): 지금 check_book 은 예제에 `main.py` 만 써요.
  - **만들 때 `example.prep` 을 받게 한 줄 고쳐요**(문제의 prep 과 같은 코드). 그래야 예제도 `practice_site.py` 를 import 할 수 있어요.
  - 안 고치면 예제마다 15줄짜리 작은 서버를 붙여야 해서 본문이 지저분해져요.
- 흔들리는 것 고정하기:
  - **주소**: 포트가 매번 달라서 `base` 는 찍지 않고 경로(`/books/7`)만 찍어요. User-Agent 는 `startswith("python-requests")` 처럼 참 · 거짓만.
  - **시간**: 기다림은 함수 인자 `sleep=time.sleep` 으로 받아요.
    - 학습자 실행은 진짜로 기다려요. 「확인 코드」(check)에서만 `sleep=waits.append` 로 기록해 「기다림 32번 · 모두 1초」(요청 수 − 1) 를 찍어요.
    - 그래서 Crawl-delay 1초를 지키는 코드도 CI 에서 1초 안에 끝나요.
    - 429 문제 하나만 `rate_limit=1.0` 으로 곧바로 두 번 보내 진짜 429 를 받아요(1초 안에 두 번이라 흔들리지 않음).
  - **날짜**: `crawled_at` · `day` 는 인자(`today="2026-11-08"`), 진짜 실행은 `date.today()`.
  - **무작위**: 없어요. 404 · 500 이 나는 책, `day=2` 의 바뀐 가격은 고정이에요.
  - **파일**: csv · db 는 check_book 의 임시 폴더(cwd)에 써요. 캐시는 `cache/` 를 `exist_ok`.
- 출력 예에 쓰지 않는 것:
  - `prettify()` · `str(tag)` 통째(bs4 버전마다 공백이 달라질 수 있음). 늘 `get_text` · 속성 값 · 개수를 찍어요.
  - bs4 의 경고는 stderr 라 출력 비교에 안 들어가지만, 예시 답은 늘 `"html.parser"` 를 써서 경고가 없게 해요.
- 2026-11-08 에 확인한 것(requests 2.34 · bs4 4.15 · Python 3.13):
  - charset 없는 `text/html` → `res.encoding == "ISO-8859-1"`, `apparent_encoding == "EUC-KR"`, `BeautifulSoup(res.content)` 가 meta charset 으로 바로 읽음.
  - `RobotFileParser` 가 `Crawl-delay: 2.5` 를 `None` 으로 읽음. localhost 의 `read()` 가 됨.
  - `/new` 의 `li` 0개.
  - 만들 때 CI 에서 한 번 더 봐요.
- 하나에서 만들기:
  - `SHOP_P1_HTML` 같은 book.js 상수는 `python practice_site.py --dump` 가 낸 글자를 그대로 넣어요.
  - regress 에 「상수 == 서버 출력」 비교를 더해요(SQL 교과서의 cafe.db 비교와 같은 생각).
- noRun + ☐ 로 두는 것:
  - 브라우저 · F12 화면, Playwright 쪽, 진짜 사이트의 robots · 약관 보기, 매일 돌리기.
- 프록시: 회사망처럼 `HTTP_PROXY` 가 있는 PC 에서는 127.0.0.1 도 프록시로 갈 수 있어요. 시작하기의 「안 될 때」 에 `NO_PROXY=127.0.0.1` 한 줄을 둬요(CI 에는 해당 없음).

**사람이 확인할 것**
- `python practice_site.py` 로 켠 연습 사이트가 Windows 브라우저에서 잘 보이나(한글 · 표 · 「다음」 링크).
- F12 Elements · Ctrl+Shift+C · 「Copy selector」 의 위치와 이름(크롬 · 엣지).
- `/new` 를 Ctrl+U 와 Elements 로 견주기 · Network 의 Fetch/XHR 에서 `/api/new` 가 보이나.
- `books.csv` 를 엑셀로 열 때 한글이 안 깨지나(`utf-8-sig`).
- Playwright 설치(`playwright install chromium` 의 크기 · 시간)와 맛보기 코드가 실제로 도나.
- 진짜 사이트에 하는 ☐ 연습(robots.txt 열기 · 약관에서 말 찾기 · 공개 연습 사이트).
  - 공개 연습 사이트는 「스크래핑 연습용이라고 스스로 밝힌 곳(예: Books to Scrape · Quotes to Scrape)」 처럼 **이름만** 적어요. 주소 · 구조는 고정하지 않고, 문제가 그 사이트의 HTML 에 기대지 않게 해요.
- Y11 의 법 · 약관 문구(법 이름 · 「법률 조언 아님」 표현)를 사람이 한 번 읽어요.
- 작업 스케줄러 / cron 으로 YB3 을 매일 돌리는 안내.

**정할 것(설계 때 물음 — 정한 것은 위 2절)**
- Y11 의 법 이야기 깊이: **법 이름 + 원칙만**(제안 — 판례는 바뀌고 해석이 갈려요)으로 할지, 국내 사례까지 넣을지.
- 공개 연습 사이트 이름(Books to Scrape 등)을 본문에 적어도 될지, 「연습용이라고 밝힌 곳을 찾아보세요」 로만 둘지.

---

### 정한 것과 이유 (기술적 선택 — Claude)

| 무엇 | 정한 것 | 이유 |
| --- | --- | --- |
| id · 글자 | `crawl` · 레슨 `Y` · 만들어 보기 `YB` | 다른 코스 글자와 안 겹침(목차에서 Y 없음 확인) |
| 크기 | 17(시작 1 + 챕터 3 × (4~5 + 🛠 1)) | 「약 16」 · 규칙 14~18 안. 표 · 저장 · API · JS 를 따로 레슨으로 두려니 하나 많음 |
| 챕터 순서 | HTML 읽기(오프라인) → 받기 · 모으기 · 저장(내 서버) → 예의 · 법 · API · JS | 파서를 먼저 익혀야 요청 코드가 짧아요. 진짜 사이트는 규칙을 배운 챕터 3 에서만 ☐ 로 |
| 연습 대상 | 교과서가 만든 `practice_site.py`(표준 라이브러리 · localhost) | CI 에 인터넷이 없어도 **진짜 HTTP · 쪽 넘기기 · 404 · 429 · 깨진 글자 · JS 쪽**을 다 겪음. 남의 서버에 부담 · 약관 걱정이 없음 |
| 파서 | `html.parser` 만 | 깔 것이 bs4 하나. 결과가 PC 마다 같음 |
| 기다림 시험 | `sleep=` 인자로 바꿔 끼우기 | 예의(Crawl-delay)를 지키는 진짜 코드를 CI 30초 안에서 확인 |
| 예의를 숫자로 | `srv.log` 로 요청 수 · User-Agent 찍기 | 「캐시하면 두 번째는 0번」 처럼 눈에 보이는 결과 |
| Playwright | 한 쪽 맛보기(noRun ☐) · Selenium 은 이름만 | 「왜 안 보이나」 의 답은 「JSON 을 찾자」 가 먼저. 브라우저 자동화는 무겁고 CI 에서 못 돌림 |

---

## Flask 로 웹 서비스 만들기 (`flask`, 레슨 `Q0`~`Q13` · 만들어 보기 `QB1`~`QB4` = 총 18)

**한 줄로**: 브라우저로 열면 **화면이 나오는 웹 서비스**를 파이썬으로 만들어요. 주소마다 함수를 붙이고(route), HTML 을 템플릿으로 찍어 내고(Jinja2), 입력 양식을 받아 검사하고, sqlite 에 저장하고, 로그인으로 「내 것」 을 지키고, 블루프린트로 나눈 뒤 테스트로 지켜요. 방명록 → 회원별 할 일 → 작은 블로그까지 내 손으로 만들어요.

> **FastAPI(HTTP·API 교과서)와 무엇이 다른가** — Q0 첫 쪽에 이 표를 그대로 둬요.
>
> | | HTTP·API 교과서 H10~HB3 (FastAPI) | **이 교과서 (Flask)** |
> | --- | --- | --- |
> | 돌려주는 것 | **JSON** — 받는 쪽은 프로그램 | **HTML 화면** — 받는 쪽은 사람(브라우저) |
> | 화면은 누가 그리나 | 브라우저의 JS 가 JSON 을 받아 그림(웹 WB2 + HB3) | **서버가 다 그려서** 보냄(서버 렌더링) |
> | 입력 | JSON 본문 → Pydantic 이 검사 → 틀리면 422 JSON | **폼(`request.form`)** → 내가 검사 → 틀리면 **같은 화면을 입력값과 함께 다시** |
> | 「누구세요?」 | 헤더의 토큰(`Authorization: Bearer`, H7) | **세션 쿠키**(브라우저가 알아서 들고 옴) |
> | 문서 | `/docs` 가 저절로 | 화면 자체가 쓰는 법 |
> | 시험 | `TestClient(app)` | `app.test_client()` — 모양이 거의 같아요 |
>
> 둘 다 서로의 일을 할 수 있어요(Flask 도 dict 를 돌려주면 JSON, FastAPI 도 HTML 을 줄 수 있음). 고르는 기준은 「받는 쪽이 사람이냐 프로그램이냐」.

**누구에게 · 어디서 이어지나**

- 대상: 파이썬 교과서(100 레슨)를 다 배운 사람. 특히 꼭 필요한 레슨은 「먼저 보면 좋은 레슨」 으로 각 레슨 위에 링크.
  - 파이썬: L16C 내 모듈과 패키지(블루프린트 폴더) · L16D pip 와 가상 환경 · L17B 경로(`Path(__file__)`) · L18F 데코레이터(로그인 필요 장식자) · L28 환경 변수(비밀 키) · L30 sqlite3 맛보기 · L39 pytest 맛보기 · **X17 실전 17: 내 웹 페이지**(`http.server` 의 `do_GET` 과 `html.escape` — Flask 가 대신 해 주는 일의 출발점) · X19 할 일 앱 완성(TodoStore · `:memory:` 시험).
  - 웹: W1 · W2 · W2B(HTML) · **W3 폼** · W4(CSS) · W11 폼 검사(브라우저 검사).
  - HTTP·API: H1 메서드 · H2 상태 코드(302 · 400 · 403 · 404) · H3 헤더 · H10 서버와 TestClient · H12 상태 코드와 저장.
  - SQL: S8 INSERT·UPDATE·DELETE · S9 CREATE TABLE 과 제약 조건(UNIQUE) · S13 파이썬 sqlite3.
  - CS: C16 해시 · **C18 비밀번호 저장하기**(소금 · 느린 해시 — 원리는 거기서).
  - 디버깅·테스트: D7 pytest 시작 · D9 fixture 와 parametrize(`tmp_path`) · D10 바꿔 끼우기 · D12 회귀 테스트.
  - 객체지향: O5 한 가지 책임 · O7 의존성 주입(앱 공장 `create_app(test_config)` 과 같은 생각).
- 다음에 갈 곳(Q13 끝 「더 가 보기」 한 쪽, 이름과 한 줄씩만): Flask-SQLAlchemy(ORM) · Flask-Login · Flask-WTF(CSRF 를 대신) · Django(다 들어 있는 큰 틀) · HTMX(화면 일부만 바꾸기) · FastAPI + 웹 화면 섞기 · 실제 도메인과 HTTPS.

**준비**

- 설치: 가상 환경(파이썬 L16D) 안에서 `python -m pip install flask pytest`. `werkzeug` · `jinja2` · `click` 은 Flask 와 같이 깔려요. 바깥 프로그램은 없음(sqlite 는 파이썬에 들어 있음).
  - 출력 모양은 **Flask 3.1 기준**(2026-11 에 3.1.3 · Werkzeug 3.1 · Jinja2 3.1 로 확인). 레슨마다 맨 아래 작게 「Flask 3.1 기준」.
- 서버 켜기: **`flask --app app run --debug`**(공식 명령, 주소 `http://127.0.0.1:5000`). 파일 안의 `app.run()` 은 쓰지 않아요 — 아래 「검사」 의 이유. PowerShell 도 가상 환경을 켰으면 같은 명령, 안 되면 `python -m flask --app app run --debug`.
  - macOS 는 5000 번을 AirPlay 수신이 쓰고 있을 수 있어요(403 · 「Address already in use」) → `--port 5001`. 「먼저 꼭」 에 넣음.
- 폴더 모양(Q2 부터 늘 이 모양 — 그림으로):
  ```
  guestbook/
    app.py
    schema.sql
    templates/  base.html · index.html · …
    static/     style.css
    instance/   guestbook.db   ← .gitignore
  ```
- 예제 데이터: 이 교과서가 만든 가짜 데이터만.
  - `BOOKS`(book.js 상수): 독서 기록 12권(제목 · 지은이 · 장르 · 별점 1~5 · 다 읽은 날). 지은이는 지어낸 이름. 챕터 1(QB1)은 파이썬 리스트로, 챕터 2 부터는 같은 데이터를 sqlite 에 넣는 `schema.sql` + `seed.sql`.
  - 방명록 · 할 일 · 블로그 글은 예시 답이 `client.post(...)` 로 직접 넣어요(파일 받기 없음).

| 챕터 | id · 제목 | 주요 내용 |
| --- | --- | --- |
| 0 시작 | Q0 화면이 있는 웹 서비스 | ① 위의 FastAPI vs Flask 표 · 「서버가 HTML 을 만들어 보낸다」 그림(요청 → 함수 → HTML 글자 → 브라우저가 그림) ② 파이썬 X17 의 `do_GET` 에서 `if self.path == "/":` 로 직접 고르던 일 → Flask 가 대신 해 주는 것 표(주소 고르기 · 헤더 · 상태 코드 · 이스케이프) ③ 설치 · 첫 `app.py` 5줄(`app = Flask(__name__)` · `@app.route("/")`) · `flask --app app run --debug` · 브라우저 · 터미널의 요청 기록 한 줄 읽기(☐) · `--debug` = 저장하면 다시 켜짐 + 에러 화면 ④ **서버를 안 켜고 확인**: `client = app.test_client()` · `r = client.get("/")` · `r.status_code` · `r.text` · 이 교과서의 확인 도우미 `show(r)`(상태 코드 + 태그를 뺀 글자 한 줄 — 「검사」 참고). 만들어 보기: 인사 페이지(☐) · 「오늘의 한마디」 페이지를 `show` 로 확인(자동) · 「이건 JSON 일까 화면일까」 상황 6개를 고르는 함수(자동) |
| 1 주소와 화면 | Q1 주소마다 함수: route | ① `@app.route` · `@app.get` · `@app.post` · 함수 이름 = 끝점(endpoint) ② 변수 규칙 `/books/<int:book_id>` · `<path:name>` · 글자가 오면 404 ③ 쿼리 `request.args.get("q", "")` · `request.args.get("page", 1, type=int)` ④ 돌려주는 것: 글자 · `(본문, 상태 코드)` 튜플 · dict → JSON(FastAPI 와 같은 점) · `abort(404)` ⑤ `url_for("book", book_id=3)` — 주소를 손으로 쓰지 않는 이유 · 끝 슬래시 함정(`/books/` 로 만들면 `/books` 는 **308** 로 옮겨 감 — `test_client` 로 직접 봄) · **첫 요청 뒤에는 route 를 더할 수 없어요**(「setup method … can no longer be called」 — 한 파일에서 시험할 때 함정). 만들어 보기: 요일별 급식 메뉴 `/menu/<day>`(없는 요일 404) · 계산기 `/add?a=&b=`(빠지면 400) · `url_for` 로 링크 목록 찍기 |
| | Q2 템플릿 1: Jinja2 로 HTML 찍어 내기 | ① f-string 으로 HTML 을 만들던 X17 의 고통 → `templates/` 폴더 + `render_template("index.html", books=books)` ② `{{ 값 }}` · `{{ book.title }}` 과 `{{ book["title"] }}` 둘 다 됨 ③ `{% if %}` · `{% for b in books %}` · **`{% else %}`(빈 목록)** · `loop.index` · `loop.last` ④ **자동 이스케이프**: `<script>` 를 넣어도 글자로(`&lt;script&gt;`) — X17 의 `html.escape` 를 Jinja2 가 늘 해 줌 · `|safe` 는 내가 쓴 HTML 에만 · `.html` 파일만 자동(이름 끝이 중요) ⑤ 맛보기용 `render_template_string`. HTML 문법은 웹 W1 · W2 링크(다시 안 가르침). 만들어 보기: 장보기 목록 페이지(빈 목록이면 「아직 없어요」) · 성적표(80점 이상 굵게) · 이스케이프 고치기(누가 `|safe` 를 붙인 템플릿에서 버그 찾기) |
| | Q3 템플릿 2: 상속 · 거르기 · 정적 파일 | ① **상속** `base.html` 의 `{% block title %}` · `{% block content %}` → `{% extends "base.html" %}` · `{{ super() }}` · `{% include "_nav.html" %}` ② 거르기(필터) `|length` · `|default("없음")` · `|upper` · `|join(", ")` · `|truncate(20)`(낱말 단위 · `leeway` 함정) · 내 거르기 `@app.template_filter("won")` → `{{ 12000|won }}` = `12,000원` ③ 정적 파일 `static/style.css` · `url_for("static", filename="style.css")` → `/static/style.css` · 없는 파일 404 · CSS 문법은 웹 W4 링크 ④ 오류 페이지 `@app.errorhandler(404)` → `render_template("404.html"), 404`(상태 코드를 같이 돌려줘야 하는 이유) ⑤ 지금 메뉴 강조 `request.endpoint == "books"`(☐ 화면). 만들어 보기: 세 페이지가 같은 머리 · 꼬리를 쓰게 · `won` · `stars`(★★★☆☆) 거르기 · 예쁜 404 페이지(상태 코드도 404 인지 자동 확인) |
| | **QB1** 🛠 내 독서 기록 사이트 | `BOOKS` 로 목록 `/` · 상세 `/books/<int:id>` · 장르별 `/genre/<name>` · 별점 거르기 `?min=4` · 없는 책은 내 404 페이지 · `base.html` 상속 · `stars` 거르기 · CSS(☐). 문제: ① 목록 + 상세 ② 장르 · 별점 거르기(빈 결과면 안내) ③ 404 와 링크 전부 `url_for` 로 ④ 화면 다듬기(☐) — ①~③ 자동(`show`) |
| 2 입력과 저장 | Q4 입력 양식 1: GET 과 POST | ① 웹 W3 의 `<form>` 이 진짜로 서버에 감 — `action="{{ url_for('add') }}"` · `method="post"` · `name=` 이 열쇠 ② **GET 폼 = 찾기**(주소에 남아 공유 · 북마크 — `?q=소설` → `request.args`) vs **POST 폼 = 바꾸기**(`request.form`) — 어느 쪽을 쓸지 표 ③ `@app.route("/new", methods=["GET", "POST"])` 한 함수에서 둘 다 · `request.method` ④ `request.form["title"]`(없으면 **400**) vs `request.form.get("title", "").strip()` · 체크박스 여러 개 `request.form.getlist("tags")` · 숫자는 글자로 옴(`int()` 실패 처리) ⑤ 검색 + 페이지 나누기 `?q=&page=2`(리스트 자르기 `books[(page-1)*5 : page*5]`, 「다음」 링크는 `url_for(..., page=page+1, q=q)`) · F12 → Network 에서 폼 데이터 보기(☐ — HTTP·API H4 링크). 만들어 보기: 책 검색(제목 · 지은이, 대소문자 무시) · 장보기 추가 폼(POST) · 페이지 나누기(마지막 쪽에 「다음」 없음) |
| | Q5 입력 양식 2: 검사 · 다시 보여 주기 · PRG | ① **서버 검사는 꼭** — 브라우저의 `required` · `maxlength`(웹 W11)는 건너뛸 수 있음: `test_client` 로 빈 값을 보내 직접 증명 ② `errors = {}` 딕셔너리 → 틀리면 **같은 템플릿을 입력값과 오류 글을 채워 다시**(`value="{{ form.title }}"` · `{% if errors.title %}`) · 상태 코드 400 ③ 맞으면 **PRG**(Post → Redirect → Get): `redirect(url_for("index"))` = 302 + `Location` — 새로고침 「양식 다시 제출」 창(☐)과 두 번 저장 버그 ④ `flash("저장했어요")` · `get_flashed_messages(with_categories=True)` · `secret_key` 가 필요한 이유는 챕터 3 예고 ⑤ `client.post(..., follow_redirects=True)` · `r.history` 로 옮겨 간 길 확인. 만들어 보기: 회원 정보 검사 폼(이름 · 나이 · 이메일 — 파이썬 L20 정규식 링크, 틀린 칸만 표시 · 맞은 칸은 남김) · PRG 로 고치기(새로고침하면 두 번 들어가는 코드) · flash 종류별 색(☐) + 글자(자동) |
| | Q6 sqlite 에 저장: 넣고 · 고치고 · 지우기 | sqlite3 기본은 파이썬 L30 · SQL S8 · S9 · S13 복습 링크, 여기서는 **Flask 에 붙이는 법**만. ① 요청마다 연결 하나: `get_db()` 가 `g.db` 에 담음 · `@app.teardown_appcontext` 로 닫기 · `row_factory = sqlite3.Row` → 템플릿에서 `row["title"]` ② `schema.sql`(`DROP TABLE IF EXISTS` + `CREATE TABLE`) · 내 명령 `@app.cli.command("init-db")` → `flask --app app init-db` · `app.test_cli_runner().invoke(args=["init-db"])` 로 확인 · DB 파일은 `app.instance_path`(`instance/`) + `.gitignore` ③ 넣기 · 목록: `?` 자리표시(SQL 주입 다시 — f-string 으로 넣으면 어떻게 되나 직접) · `commit` · `lastrowid` ④ 고치기: 새 글 폼을 **같은 템플릿으로** 고치기에도(`book` 이 있으면 값 채우기) · 없는 번호는 `abort(404)`(`get_book_or_404` 함수 하나) ⑤ **지우기는 POST 로만**(GET 링크로 지우면 미리 보기 · 검색 로봇이 지움) · `<form method="post">` 버튼 · 지운 뒤 PRG. 만들어 보기: 독서 기록을 DB 로(`seed.sql`) · 고치기 폼 재사용 · 지우기 버튼 · 검색을 `LIKE ?` 와 `LIMIT ? OFFSET ?` 로 다시 |
| | **QB2** 🛠 방명록 | 이름 · 글 · 남긴 시각을 sqlite 에. 검사(이름 1~20자 · 글 1~300자 · 공백만 안 됨) · 틀리면 입력값을 남겨 다시 · 맞으면 PRG + flash · 최신 글 먼저 10개씩 페이지 · 지우기(POST) · `<script>` 글이 글자로 보이는지. 시각은 `now_text()` 함수를 `app.config["NOW"]` 로 바꿔 끼울 수 있게(디버깅·테스트 D10 링크 — 예시 답은 고정 시각). 문제: ① 목록 + 쓰기 ② 검사와 다시 보여 주기 ③ 페이지와 지우기 ④ XSS 시도 확인 ⑤ 화면 꾸미기(☐) |
| 3 로그인 | Q7 쿠키와 세션 | ① HTTP 는 앞 요청을 기억 못 해요 → **쿠키**: 응답 `Set-Cookie` → 다음 요청 `Cookie` 헤더(HTTP·API H3 의 헤더 그대로) · F12 → Application → Cookies(☐) ② 내가 쿠키 하나: `resp = make_response(...)` · `resp.set_cookie("theme", "dark", max_age=…)` · `request.cookies.get("theme")` — 화면 색 기억하기 ③ **Flask `session`** = `secret_key` 로 **서명한** 쿠키: `session["visits"] += 1` · `session.clear()` ④ **잠근 게 아니라 서명만** — 쿠키 앞부분을 `base64` 로 풀면 내용이 다 보임(직접 풀어 봄) · 한 글자만 바꾸면 서명이 틀려 빈 세션 → 비밀번호 · 개인정보는 넣지 않기 ⑤ `secret_key` 는 `secrets.token_hex(32)` 로 만들고 코드 밖에(파이썬 L28 · `os.environ`) · `HttpOnly`(JS 가 못 읽음) · 기본은 브라우저를 닫으면 사라짐 / `session.permanent` · 31일. `test_client` 는 쿠키를 들고 다님 · `with client.session_transaction() as s:`. 만들어 보기: 방문 횟수 세기 · 다크 모드 기억(쿠키) · 장바구니(세션에 상품 번호 목록) · 「쿠키 풀어 보기」 함수(자동) |
| | Q8 회원 가입과 비밀번호 해시 | 원리(평문 금지 · 소금 · 느린 해시)는 CS C18 링크, 여기는 **쓰는 법**. ① `from werkzeug.security import generate_password_hash, check_password_hash` · 결과 모양 `scrypt:32768:8:1$소금$지문` 읽기 · 같은 비밀번호도 매번 다른 글자(소금) · `check_password_hash(h, pw)` ② `users` 표: `username TEXT UNIQUE NOT NULL` · `pw_hash TEXT` · 이미 있는 이름 → `sqlite3.IntegrityError` 잡아 「이미 있는 이름이에요」 ③ 가입 검사: 이름 모양 · 비밀번호 길이 · 비밀번호 확인 칸(파이썬 X6 검사기 링크) · 비밀번호 칸은 **다시 보여 줄 때 비움** ④ 로그인 실패 글은 하나로 「아이디 또는 비밀번호가 틀렸어요」(어느 쪽인지 알려 주지 않는 이유) · 로그 · 화면에 비밀번호를 찍지 않기. 만들어 보기: 가입 폼(중복 이름 · 짧은 비밀번호) · 「DB 에 평문이 들어간」 코드 고치기 · 로그인 확인 함수 `verify(db, name, pw)` |
| | Q9 로그인 · 로그아웃 · 로그인 필요 장식자 | ① 로그인 = `session.clear()` 후 `session["user_id"] = user["id"]` · 로그아웃은 **POST** · `@app.before_request` 로 `g.user` 불러오기 · 템플릿에서 `{% if g.user %}` 로 메뉴 바꾸기 ② **`login_required` 장식자** 직접 만들기(파이썬 L18F 복습): 로그인 안 했으면 `redirect(url_for("login", next=request.path))` ③ `@functools.wraps(view)` 를 빼면? — 장식자 붙은 함수가 둘이 되는 순간 「View function mapping is overwriting an existing endpoint function: wrapper」(직접 겪어 봄) ④ `next` 로 돌아가기 + **열린 리다이렉트 막기**(`/` 로 시작하고 `//` 가 아닐 때만) ⑤ **내 것만**: 글 주인이 아니면 `abort(403)` — 「로그인했다」 ≠ 「고쳐도 된다」 · 남의 번호를 주소에 넣어 보기. 만들어 보기: 회원 전용 메모장(로그인 필요 장식자) · `next` 로 원래 페이지로 · 남의 메모 403 |
| | Q10 웹 보안 기본기 | 지금까지 만든 걸 공격해 보고 막아요(내 PC 의 내 서버에서만 — 「먼저 꼭」). ① **XSS** 다시: 자동 이스케이프가 막는 것 · `|safe` · `Markup` · 속성 안의 따옴표 ② **SQL 주입** 다시: `?` 자리표시 vs f-string(직접 `' OR 1=1 --` 로) ③ **CSRF**: 다른 사이트의 폼이 **내 쿠키를 달고** POST 를 보냄 → 숨은 토큰 직접 만들기(`secrets.token_urlsafe` 를 세션에 · `<input type="hidden" name="csrf">` · `hmac.compare_digest` 로 비교 · `@app.before_request` 에서 POST 마다) · `SESSION_COOKIE_SAMESITE="Lax"` · 실무는 Flask-WTF(이름만) ④ **디버그 모드는 내 PC 에서만** — 에러 화면에서 파이썬을 실행할 수 있음(☐ 화면 보기) · 에러 화면에 비밀이 보이는 이유 ⑤ 점검표: 이스케이프 · 자리표시 · 해시 · CSRF · 주인 확인 · 비밀 키 · 디버그. 만들어 보기: 취약한 메모장(구멍 셋) 고치기 — 공격 요청을 `test_client` 로 보내 막혔는지 자동 확인 · CSRF 토큰 붙이기 |
| | **QB3** 🛠 회원별 할 일 서비스 | 가입 · 로그인 · 로그아웃 · **내 할 일만** 보기 · 더하기 · 완료 표시(POST) · 지우기 · 남의 할 일은 403 · 모든 POST 에 CSRF 토큰 · 오늘 마감 강조(날짜는 `NOW` 고정). 문제: ① 가입 · 로그인(해시) ② 할 일 CRUD + `login_required` ③ 주인 확인(403) · CSRF ④ 두 사람(민지 · 준호)이 섞이지 않는지 `test_client` 둘로 확인 ⑤ 화면(☐) |
| 4 나누고 지키고 내보내기 | Q11 앱 공장과 블루프린트 | ① 300줄 `app.py` 의 고통(객체지향 O5 링크) → 폴더 `myapp/__init__.py` · `db.py` · `auth.py` · `books.py`(파이썬 L16C 패키지 링크) ② **앱 공장** `def create_app(test_config=None):` · `app.config.from_mapping(SECRET_KEY=…, DATABASE=…)` · `app.config.from_pyfile("config.py", silent=True)` · 시험용 설정 끼우기(객체지향 O7 과 같은 생각) ③ `bp = Blueprint("auth", __name__, url_prefix="/auth")` · `app.register_blueprint(bp)` · `url_for("auth.login")` 점 이름 · 같은 블루프린트 안에선 `url_for(".login")` · 템플릿 폴더 `templates/auth/login.html` ④ 순환 import 피하기(`db.py` 를 따로, `current_app`) · `flask --app myapp run --debug` · `app.url_map` 으로 주소 목록 찍기. 만들어 보기: QB2 방명록을 공장 + 블루프린트 둘로 나누기(**결과 화면은 그대로** — 나누기 전 · 후 `show` 출력이 같음) · 시험용 설정으로 다른 DB 파일 쓰기 |
| | Q12 테스트: test_client 와 pytest | pytest 기본은 디버깅·테스트 D7 · D9 링크. ① `conftest.py` 의 fixture 셋: `app`(`create_app({"TESTING": True, "DATABASE": tmp_path / "t.db"})`) · `client` · `runner` ② 응답 검사 모음: `r.status_code` · `"글자" in r.text` · `r.headers["Location"]` · `follow_redirects=True` · `r.history` · `r.json` ③ 로그인이 든 테스트: `AuthActions` fixture(`auth.login()` · `auth.logout()`) · `with client:` 블록 안에서 요청 뒤 `session` · `g` 들여다보기 · CSRF 토큰은 화면에서 정규식으로 꺼내기(파이썬 L20B) 또는 `TESTING` 일 때 끄기 — 둘의 장단 ④ `@pytest.mark.parametrize` 로 검사 규칙 표(빈 이름 · 21자 · 공백만) ⑤ 버그를 테스트로 먼저(회귀, D12) · `coverage` 로 빠진 갈래(디버깅 D13 링크, ☐). 만들어 보기: QB3 할 일 서비스 테스트 묶음(가입 · 로그인 · 403 · 검사 표) · 숨은 버그 하나를 테스트로 잡고 고치기 |
| | Q13 배포 맛보기 | 전부 ☐ + 점검 함수만 자동. ① 개발 서버(`flask run`)는 연습용 — 「WARNING: This is a development server」 를 읽기 · 실제로는 WSGI 서버: Windows 도 되는 `waitress`(`waitress-serve --listen=127.0.0.1:8080 --call myapp:create_app`) · 리눅스의 `gunicorn`(이름만, 리눅스 교과서 링크) ② 설정 나누기: `SECRET_KEY` 는 환경 변수 · 디버그 끄기 · `requirements.txt`(파이썬 L16D) · DB 파일 위치 · `.gitignore`(GitHub 교과서 G16 링크) ③ 올려 보기(선택 ☐): 무료 호스팅 한 곳(PythonAnywhere 같은 곳 — 「2026-11 기준, 바뀔 수 있음」) · HTTPS · 비밀 키를 그 화면에 넣기 · 웹 W13 「정적 사이트 vs 서버」 와 잇기 ④ 「더 가 보기」(위 목록). 만들어 보기: 배포 전 점검 함수 `check_ready(app)` — 디버그 켜짐 · 비밀 키가 `dev` · `SESSION_COOKIE_SECURE` 꺼짐 같은 문제 목록 돌려주기(자동) · waitress 로 내 PC 에서 켜 보기(☐) |
| | **QB4** 🛠 작은 블로그 | 지금까지를 한 서비스로: `create_app` + 블루프린트 `auth` · `blog` · 가입 · 로그인 · 글 쓰기 · 고치기 · 지우기(주인만) · 목록(최신순 · 페이지) · 글 하나 페이지 · 태그 거르기 `?tag=` · 마크다운 대신 줄바꿈만 `<br>`(이스케이프를 지키면서 — `|e` 후 바꾸기 함정) · CSRF · 테스트 묶음 · 배포 점검. 문제: ① 공장 + auth 블루프린트 ② blog 블루프린트 CRUD + 주인 확인 ③ 목록 · 페이지 · 태그 ④ pytest 묶음(`pytest.main` 끝 코드 0) ⑤ 배포 점검 통과 · waitress 로 켜고 브라우저로 한 바퀴(☐) |

**겹침 처리**

| 겹치는 것 | 기존 교과서 | 이 코스에서 |
| --- | --- | --- |
| HTML 태그 · 폼 태그 · CSS | 웹 W1 · W2 · W2B · W3 · W4 · W11 | 다시 안 가르침. 템플릿 안의 HTML 은 「복습: 웹 교과서 W3 폼」 처럼 링크. Q4 는 「그 폼이 이제 진짜로 서버에 가요」 만 |
| 서버 · 상태 코드 · 헤더 · `TestClient` | HTTP·API H1 · H2 · H3 · H10 · H12 | 링크. Q0 의 비교 표 한 장으로 「같은 점 · 다른 점」, `test_client` 는 「TestClient 와 같은 모양」 한 줄 |
| `http.server` · `html.escape` | 파이썬 X17 | Q0 · Q2 에서 「그때 손으로 하던 일」 로 불러옴(출발점) |
| sqlite3 문법 · `?` 자리표시 · `commit` · `lastrowid` | 파이썬 L30 · X19, SQL S8 · S9 · S13, HTTP·API H12 | 링크. Q6 은 `g` · `teardown_appcontext` · `init-db` 명령 · 템플릿에서 `Row` 쓰기 · 지우기는 POST 처럼 **Flask 에 붙이는 법**만 |
| 데코레이터 문법 | 파이썬 L18F | 링크. Q9 은 `login_required` 와 `functools.wraps` 가 **왜 꼭** 필요한지(끝점 이름 충돌)만 |
| 해시 · 소금 · 느린 해시 원리 | CS C16 · C18 | 링크. Q8 은 `werkzeug.security` 두 함수와 가입 흐름 |
| 환경 변수 · 비밀 키를 코드 밖에 | 파이썬 L28, HTTP·API H7, AI 와 협업 Z9, GitHub G16 | 링크. Q7 · Q13 에서 `SECRET_KEY` 에 적용만 |
| pytest · fixture · `tmp_path` · parametrize · 회귀 | 디버깅·테스트 D7 · D9 · D10 · D12 · D13, 파이썬 L39 | 링크. Q12 는 Flask fixture(`app` · `client` · `runner`)와 로그인 · 세션이 든 테스트 |
| 모듈 · 패키지 · 순환 import | 파이썬 L16C | 링크. Q11 은 블루프린트 폴더 모양 |
| 책임 나누기 · 의존성 주입 | 객체지향 O5 · O7 | 링크. 앱 공장을 「설정을 밖에서 넣는 것」 으로 한 줄 |
| 정적 사이트 · GitHub Pages | 웹 W13 | Q13 에서 「서버가 있는 사이트는 왜 Pages 로 못 올리나」 한 쪽 |
| **새로 배우는 것**(어디에도 없음) | — | 쿠키 · 세션(어느 교과서에도 `Set-Cookie` 가 없음) · Jinja2 · 서버 렌더링 · PRG · flash · CSRF · 열린 리다이렉트 · 403 주인 확인 · 블루프린트 · WSGI 서버 |

**검사(CI)**

- **CI 설치**: `tools/requirements-ci.txt` 에 `flask` 한 줄(werkzeug · jinja2 · click 은 따라옴). `pytest` 는 이미 있음.
- **`BOOK.check = 'flask'`**: HTTP·API 교과서의 `'api'` 와 같은 규칙 — 파이썬으로 실행 · `noRun` 은 「확인할 것」(☐) 필수 · 도구 상자는 실행 안 함. `check_book.mjs` 의 `['os', 'api', 'asm']` · `['github', 'linux', 'os', 'api', 'asm']` 두 목록에 `'flask'` 를 더해요.
- **서버를 켜지 않아요**: 모든 예시 답 · 예제는 `app.test_client()` 로 요청을 보내고 응답을 찍어요(네트워크 · 포트 없음).
  - `check_book` 은 답을 `python3 main.py` 로 돌려서 `__name__ == "__main__"` 이 참이에요. 그래서 **답 안에 `app.run()` 을 쓰지 않아요**(서버가 떠서 30초 시간 초과). 이 교과서는 처음부터 `flask --app app run --debug` 로 켜는 것만 가르쳐서 본문과 답이 어긋나지 않아요.
  - 한 파일 답에서는 **모든 route 를 첫 요청 전에** 정의(Q1 의 함정과 같음).
- **확인 도우미 `show(r)`**(Q0 에서 소개, 예시 답마다 맨 위에 그대로):
  ```python
  import re
  def show(r):
      body = " ".join(re.sub(r"<[^>]+>", " ", r.text).split())
      print(r.status_code, body)
  ```
  HTML 전체를 찍으면 길고 들여쓰기 · 빈 줄이 흔들려서, **상태 코드 + 태그를 뺀 글자 한 줄**만 비교해요. 옮겨 갈 땐 `print(r.status_code, r.headers["Location"])`.
- **템플릿 · 정적 파일 · schema.sql(여러 파일)을 어떻게 주나** — 본문은 늘 진짜 폴더 모양(`templates/base.html` …)으로 보여 줘요. CI 에서는:
  - **정한 것: 준비 파일을 여러 개(하위 폴더 포함)로 늘리기.** 지금 `t.prep` 은 `{name, text}` 하나뿐이에요. `prep: [{name: "templates/base.html", text: …}, {name: "schema.sql", text: …}]` 처럼 배열도 받게 하고, `check_book` 은 `mkdirSync(…, {recursive: true})` 후 쓰기, 화면(`ui-views-book.js`)은 파일마다 「준비 파일 — templates/base.html」 이름표, `book-derive.js` 는 배열을 그대로 넘김. 레슨 본문 예제(`example`)에도 같은 `files` 를 받게(check_book ⑤). 학습자가 만드는 파일과 CI 가 쓰는 파일이 **똑같아요**.
  - 대신할 길(위 기능을 안 만들 때): 예시 답 맨 위에서 `app.jinja_loader = DictLoader({"base.html": "…", "index.html": "…"})`(Jinja2 기능, Flask 3.1 에서 확인) — 열쇠 = 파일 이름이라고 밝힘. Q2 첫 쪽의 맛보기는 어느 쪽이든 `render_template_string`.
- **흔들리는 것 고정**
  - DB: 답은 매번 `init-db`(`DROP TABLE IF EXISTS` 가 든 `schema.sql`)로 시작 → 다시 돌려도 같은 결과. 테스트는 `tmp_path` 의 새 DB.
  - 시간: 방명록 · 할 일 · 블로그 시각은 `app.config["NOW"]`(함수)로 바꿔 끼움 — 예시 답은 `lambda: "2026-11-08 10:00"`.
  - 비밀번호 해시: 소금 때문에 매번 달라서 `h.split("$")[0]`(`scrypt:32768:8:1`)와 `check_password_hash` 의 `True` / `False` 만 찍음. 전체 해시는 본문 `<pre>` + 「매번 달라요」.
  - 세션 쿠키: 서명 부분에 시각이 들어가서, 앞부분을 풀어 낸 dict(`{'user': '민지'}`)와 `HttpOnly; Path=/` 만 찍음.
  - CSRF 토큰 · `secrets`: 값은 안 찍고 「있다 · 길이 · 맞았나」 만.
  - pytest: 걸린 시간(`in 0.03s`)이 찍혀서, 디버깅·테스트 교과서와 같은 방식 — `contextlib.redirect_stdout` 으로 담고 실패 이름과 끝 코드(`pytest.main([... , "-p", "no:cacheprovider", __file__])` 의 돌려준 값 0)만 찍기. 진짜 `python -m pytest` 화면은 `<pre>` + ☐.
  - `secret_key` 는 예제에서 `"dev"`(「진짜 서비스에선 환경 변수」 주석), 배포 레슨만 `os.environ`.
- **noRun 으로 둘 것**: 서버 켜기(`flask run` · `waitress-serve`) · 브라우저 화면 · F12 화면 · 실제 호스팅 · `coverage` 화면 · 디버그 에러 화면.
- 이 문서를 쓰며 Flask 3.1.3 로 직접 돌려 확인한 것: `test_client` · `follow_redirects` · `r.history` · `session_transaction` · 쿠키 앞부분 풀기 · 서명 틀린 쿠키 = 빈 세션 · `scrypt:32768:8:1` · `test_cli_runner().invoke` · `DictLoader` · 블루프린트 + `tmp_path` + `pytest.main` 끝 코드 0 · `/books` → 308 · `request.form["x"]` 없으면 400 · `wraps` 없을 때의 끝점 충돌 에러 · 첫 요청 뒤 route 추가 에러 · `truncate` 의 `leeway`.

**사람이 확인할 것**

- `flask --app app run --debug` 로 켜지고 `http://127.0.0.1:5000` 에서 화면이 보이는지 · 터미널 요청 기록 · 저장하면 다시 켜지는지(Windows PowerShell · macOS 5000 번).
- 템플릿 상속 · CSS 가 붙은 실제 화면, 지금 메뉴 강조, flash 색.
- 새로고침의 「양식 다시 제출」 창(PRG 전 · 후).
- F12 → Network 의 폼 데이터 · 302 · `Set-Cookie`, Application → Cookies 의 `session` · `HttpOnly` 표시.
- 디버그 에러 화면(콘솔 · PIN)이 뜨는 모습과 `--debug` 를 끄면 사라지는지.
- 다른 출처 페이지에서 POST(CSRF)가 토큰 없이 막히는지(내 PC 두 포트로).
- waitress 로 켜기, (선택) 무료 호스팅에 올린 주소에서 가입 · 로그인 한 바퀴.

**정할 것(설계 때 물음 — 정한 것은 위 2절)**

1. **웹 교과서 W1 · W2 · W3 · W4 · W11 이 아직 「준비 중」(draft)** 이에요. 이 코스는 HTML · 폼을 그 레슨 링크로 넘기는데, 지금 열면 빈 쪽이에요. ① 웹 교과서를 먼저 채우고 이 코스를 만들까요, ② 이 코스의 도구 상자에 「템플릿에 자주 쓰는 HTML 한 장(form · input · label · a · ul)」 을 넣고 먼저 만들까요? (Claude 추천: ②, 웹이 채워지면 링크만 살아남)
2. 허브 자리: 「코스」 칸, HTTP·API·SDK 다음(웹 → HTTP·API·SDK → **Flask**)으로 둘까요? 아이콘 후보 🧪(Flask = 실험 병) · 🍶.
3. Q13 「올려 보기」 에 무료 호스팅 한 곳의 이름을 적을지(가입이 필요하고 바뀔 수 있음), 「이런 곳이 있어요」 로만 둘지.

---

## pygame 으로 게임 만들기 (`game`, 레슨 `GM0`~`GM13` · 만들어 보기 `GMB1`~`GMB3` = 17)

**한 줄로**: 창 안에서 움직이는 게임을 **입력 → 갱신 → 그리기** 고리로 만들어요. 다만 게임 규칙(움직임 · 충돌 · 점수 · 장면)은 **화면과 떼어 순수 함수 · 클래스로** 짜서, 창 없이 프레임 수만큼 돌려 보고 시험해요. 마지막에는 장르만 빌린 내 게임 셋(피하기 · 벽돌 깨기 · 플랫폼 점프)을 완성해요.

**누구에게 · 어디서 이어지나**
- 대상: 파이썬 교과서 100 레슨을 다 배운 사람.
- 꼭 필요한 것:
  - 클래스 · 특수 메서드: L14 · L15 · L15B · L15E(dataclass) · **L35**(`__len__` · `__getitem__` · `__contains__` · `__iter__`)
  - 모듈 · 무작위: L16(`random.seed`) · L16D(가상 환경)
  - 2차원 리스트: L12B
  - 파일: L17C(json) · L17B(경로)
  - 더 깊이: **L32**(재귀) · L36(Enum) · L37(match) · L39(pytest)
  - 실전: **X13 · X14**(tkinter — 창 프로그램, 「계산은 따로 떼어 assert」), X15(미로 · 재귀로 칸 돌기)
- 있으면 좋은 것:
  - 수학 공간: M5_vec · M5_add · M5_norm(대각선 속도) · M5_dist(원 충돌) · M5_dot(반사) · M4_quad(포물선 점프) · M4_trig(튀는 각도)
  - 객체지향: O7(의존성 주입 — `Random` · 가짜 소리 넣기) · O10(옵저버 — 「일어난 일」 → 소리)
  - 디버깅: D7 · D9 · D12(리플레이로 회귀 테스트)
- 이 코스 다음에 갈 곳:
  - 수학 공간 챕터 5(벡터 · 행렬 — 돌리기 · 늘리기)
  - 알고리즘 E1(격자 BFS — 쫓아오는 적 길 찾기)
  - 객체지향 OB3(텍스트 RPG 리팩터링)
  - GitHub G13(Releases 로 내 게임 나눠 주기)

**준비**
- 설치(가상 환경, L16D): `python -m pip install pygame-ce`(`import pygame` 은 그대로). GM13 에서 `pytest` · `pyinstaller`.
  - **원래 `pygame` 이 아니라 `pygame-ce` 를 써요.** 2026-11-08 PyPI 로 확인한 것:
    - `pygame` 은 2.6.1(2024-09)이 마지막이고, 미리 빌드한 설치 파일(wheel)이 cp313 까지만 있어요. 그래서 Python 3.14 · 3.15 에서는 `pip install pygame` 이 소스 빌드로 가서 실패해요.
    - `pygame-ce` 2.5.8 은 cp310 ~ cp315 wheel 이 있어요(Windows · macOS universal2 · Linux). Python 3.13 리눅스에서 실제로 설치했어요.
  - 둘 다 `pygame` 폴더에 깔리니 **같이 깔면 안 돼요**. GM0 에서 `pip uninstall pygame` 먼저 하라고 안내해요.
  - 설치 확인: `python -m pygame.examples.aliens`(☐ — 예제 창이 뜨는지만 봐요).
  - import 하면 첫 줄에 인사 `pygame-ce 2.5.8 (SDL 2.32.10, Python …)` 가 찍혀요. 「출력 예에서는 이 줄을 뺐어요」 라고 GM0 에서 한 번 말해요.
- 그림 · 소리 · 데이터: **내려받는 파일은 하나도 없어요.** 전부 교과서가 준 코드로 만들어요.
  - 처음(GM1 ~ GM4 · GMB1)은 **코드로 그리는 도형만** 써요(`pygame.draw.rect` · `circle`). 파일이 없어도 게임은 끝까지 돌아가요.
  - 그림(GM5~): 「글자 그림」 을 그림으로 바꿔요.
    - 예: `["..##..", ".#oo#.", …]` + 색 표 → `pixel_art(rows, palette, scale)` → `Surface`.
    - `make_assets.py` 가 이걸 `assets/*.png` 로 저장하고(`pygame.image.save`), 게임은 그 파일을 불러요(`image.load`).
    - 학습자는 그림판으로 같은 크기의 내 그림을 그려 바꿔 넣을 수 있어요.
    - 파일이 없으면 도형으로 대신하는 `load_or_shape()` 를 둬요.
  - 소리(GM7~): 표준 라이브러리 `wave` + `math.sin`(사각파 · 잡음 섞기)으로 `make_sounds.py` 가 `assets/*.wav` 를 만들어요(삐 · 동전 · 쾅 · 짧은 내 멜로디).
  - 레벨 · 블록 판: 교과서가 만든 글자 지도. book.js 상수(`ICE_BOARD` · `LEVEL_1`~`LEVEL_3`)로 두고, 문제에서는 `prep` 으로 같은 파일을 줘요.
  - 바깥 무료 그림(CC0 등)은 GM13 의 「출처 · 라이선스 적기」 한 쪽에서만 다뤄요(AI 와 협업 Z10 링크). 교과서 예제에는 쓰지 않아요.
- 원칙: **장르만 빌리고 이름 · 그림 · 규칙 · 음악은 내 것.** 만들어 보기마다 「무엇이 내 것인가」 를 한 줄로 적게 해요.

| 챕터 | id · 제목 | 주요 내용 |
| --- | --- | --- |
| 0 시작 | GM0 게임은 어떻게 돌아가나 | 이 교과서에서 만들 셋(장르만 빌린 내 게임 — 베끼지 않기의 기준: 이름 · 그림 · 규칙 · 음악) · 설치(`pip install pygame-ce`, `pip uninstall pygame` 먼저, 인사 줄) · 첫 창 20 줄 `pygame.init()` · `set_mode((640, 360))` · `pygame.QUIT` · `fill` · `display.flip()` · `pygame.quit()`(noRun ☐) · **이 교과서의 약속**: 규칙 `rules.py`(화면 없이 · 실행되는 예시 답) / 화면 `game.py`(창 · ☐) 로 나누기 — X14 에서 `calculate(text)` 를 창과 떼었던 것과 같은 생각 · tkinter 와 다른 점: tkinter 는 `mainloop` 가 대신 돌면서 내 함수를 불러 주고, pygame 은 **내가 `while` 을 돌려요** |
| 1 움직이고 부딪히기 | GM1 게임 고리: 입력 → 갱신 → 그리기 | 한 바퀴 = 한 프레임 · 이벤트를 프레임마다 비우기(`for event in pygame.event.get()`, 안 비우면 창이 「응답 없음」) · `clock = pygame.time.Clock()` · `clock.tick(60)` = 초당 프레임 상한 + 지난 ms(값은 컴퓨터마다 달라서 찍지 않기) · **고정 `DT = 1/60`** 으로 `World.step(inputs, DT)` 을 부르는 까닭(어느 컴퓨터에서나 같은 결과) · 창 없이 돌려 보기: `for frame in range(120): world.step(...)` 하고 상태 찍기(CI) · 같은 고리에 창을 붙인 `game.py`(noRun) · tkinter `after(16, tick)` 과 나란히 보기(X13 링크) |
| | GM2 좌표와 움직임 | (0, 0) 은 왼쪽 위, y 는 **아래로** 커져요 · 속도는 px/초 × dt · 화면 밖 막기 `max(0, min(x, W - w))` · `Rect.clamp_ip(screen_rect)` · 벽에서 튕기기 `vx = -vx` · 화면 반대편으로 나오기 `x % W` · **Rect 함정**: Rect 는 정수만 담아요. 속도 0.4 로 `rect.x += 0.4` 하면 영원히 0 이에요(실험으로 확인). 소수를 넣으면 pygame 은 반올림하고 pygame-ce 는 잘라 버려서 `r.center = (15.6, 15.6)` 이 (11, 11) / (10, 10) 으로 달라져요. 그래서 위치는 소수 `self.x` 로 따로 두고 `rect.x = round(self.x)` 로 옮겨요 · 수학 공간 M5_vec · M5_add 링크 |
| | GM3 키보드와 마우스 | **이벤트 vs 상태** — `KEYDOWN` 은 누른 순간 한 번(점프 · 메뉴), `pygame.key.get_pressed()` 는 누르고 있는 동안 계속(이동) · `event.key == pygame.K_SPACE` · `pygame.key.name(key)` · 입력 → 의도 순수 함수 `direction(pressed) -> (dx, dy)` · 시험은 가짜 키보드 `defaultdict(bool, {pygame.K_LEFT: True})`(L25) · 대각선은 √2 배 빨라요 → `Vector2(dx, dy).normalize()`(M5_norm) · 키 바꾸기 표 `CONTROLS = {"left": [K_LEFT, K_a], …}` · 마우스 `MOUSEBUTTONDOWN` 의 `event.pos` · `event.button` · `pygame.mouse.get_pos()` · 버튼 = Rect + `collidepoint(event.pos)` · 한/영 입력기가 켜져 있으면 글자 키가 안 먹을 수 있어요 → `pygame.key.stop_text_input()` · 기본 키는 화살표 + 스페이스 |
| | GM4 Rect 와 충돌 | `colliderect` · `collidepoint` · `collidelist` / `collidelistall` · **모서리만 닿으면 False**(`Rect(0,0,10,10)` 과 `Rect(10,0,10,10)` — 오른쪽 끝은 `x + w` 바로 앞까지) · `inflate(-4, -4)` 로 너그러운 판정 · `rect.center` · `midbottom` 같은 이름 붙은 점 · 원끼리는 중심 거리 `math.dist(a, b) <= r1 + r2`(M5_dist) · **어느 쪽에서 부딪혔나 = 축 하나씩**: x 로만 움직이고 겹치면 x 를 되돌리고, 그다음 y 도 같게(GMB2 · GM11 에서 다시 써요) · 너무 빠르면 뚫고 지나가요(터널링) — 한 프레임에 움직이는 양을 물체 크기보다 작게 |
| | **GMB1** 🛠 도토리 피하기 | 피하기 장르. 다람쥐(네모)가 바닥에서 좌우로 움직이며 위에서 떨어지는 솔방울은 피하고 도토리는 주워요(+10) · 규칙 클래스 `Dodge(seed)` 안에 `random.Random(seed)` 를 둬요(O7) · 30 초(= 1800 프레임)마다 빨라짐 · 목숨 3 · 맞으면 60 프레임 무적(깜박이기) · 문제: ① 규칙만 만들고 600 프레임을 정해진 입력으로 돌려 점수 · 목숨 찍기(CI) ② 같은 seed 면 같은 판이 나오는지 · 화면 밖으로 안 나가는지 시험(CI) ③ 도형으로 창 붙이기 `game.py`(noRun ☐) ④ 내 규칙 하나 더(예: 황금 도토리 · 바람)(noRun ☐) |
| 2 게임답게 | GM5 그림: Surface 와 이미지 | `pygame.Surface((w, h), pygame.SRCALPHA)`(투명 바탕) · `pygame.draw.rect/circle/polygon/line` · `blit(그림, 위치)` · 글자 그림 → `pixel_art(rows, palette, scale)` · `make_assets.py` 로 `pygame.image.save(surf, "assets/squirrel.png")` · `pygame.image.load(p).convert_alpha()`(창이 있어야 해요 — 시험에서는 `SDL_VIDEODRIVER=dummy`) · `transform.flip`(왼쪽 보기) · `scale` · `rotate`(돌리면 크기가 바뀌어요 → `get_rect(center=…)` 로 다시 맞추기) · 그림 시험: 창 대신 `Surface` 에 그리고 `surf.get_at((x, y))[:3]` 로 점 색 확인(CI) · 파일이 없으면 도형으로 · 작은 그림을 크게 `set_mode(…, pygame.SCALED)`(☐) |
| | GM6 글자와 점수 | `pygame.font.Font(None, 32)`(기본 글꼴 — 영어 · 숫자만, 한글은 □) · `font.render(text, True, color)` · `text.get_rect(center=screen_rect.center)` 로 가운데 놓기 · 한글 글꼴 `pygame.font.match_font("malgungothic,applesdgothicneo,nanumgothic")` → 없으면 `None` 이라 기본 글꼴로(☐) · 글자는 점수가 바뀔 때만 다시 render(매 프레임 하지 않기) · 점수 규칙 `Score` 클래스 — 콤보 · 배수 · `add(kind)` 표 · 최고 기록 `best.json`: 파일이 없으면 0, 깨졌으면 0 으로 하고 다시 쓰기(L17C · L13) · 화면에 `SCORE 120  BEST 300` |
| | GM7 소리 | `pygame.mixer.init()` 은 소리 장치가 없으면 `pygame.error` → `try` 로 「소리 없이 계속」 · 소리 만들기: `wave.open(p, "wb")` · `setframerate(22050)` · `math.sin` 으로 높이(Hz) · 길이(ms) · 음량 · 끝을 서서히 줄여 「딱」 소리 없애기 · 사각파와 잡음으로 「쾅」 · 음 목록으로 짧은 **내** 멜로디(유명 게임 음악은 베끼지 않기) · `pygame.mixer.Sound(p).play()` · `set_volume` · 배경음 `mixer.music.load` · `play(-1)` · **규칙은 소리를 직접 틀지 않아요**: `step()` 이 「일어난 일」 목록(`["coin", "hit"]`)을 돌려주고, 화면 쪽이 `SOUNDS[name].play()`(O10 옵저버) · 시험에서는 가짜 소리가 불린 이름만 모으기 · `M` 키로 소리 끄기 · 소리 파일 검사는 `wave` 로 프레임 수 · 길이(CI), 들리는지는 ☐ |
| | GM8 장면 바꾸기: 시작 · 게임 · 끝 | `class SceneId(Enum): TITLE, PLAY, PAUSE, OVER`(L36) · `match` 로 장면마다 다르게(L37) · 장면 클래스의 세 메서드 `handle(event)` · `update(dt)` · `draw(surface)` + 다음 장면을 돌려주기 · 장면 상태표(어디서 무엇을 누르면 어디로) · 시험: 가짜 이벤트 `pygame.event.Event(pygame.KEYDOWN, key=pygame.K_SPACE)` 를 차례로 넣어 TITLE → PLAY → OVER → PLAY 확인(CI) · 일시정지에서는 `update` 를 건너뛰기 · 다시 하기는 **새 객체로**(지난 판의 값이 남는 함정) · 시작 화면의 마우스 버튼(GM3) |
| | GM9 스프라이트 묶음 | `pygame.sprite.Sprite`(`self.image` · `self.rect` 두 칸이 약속) · `Group(…)` · `group.update(*args)` 가 모두에게 전달 · `group.draw(surface)` · `sprite.kill()` · `spritecollide(sprite, group, dokill=True)` · `groupcollide(a, b, True, False)` · 묶음 여러 개(all · enemies · coins)와 그리는 차례 · Group 에 `len` · `in` · `for` 가 되는 까닭: L35 의 `__len__` · `__contains__` · `__iter__` 를 pygame 이 이미 만들어 둔 것 → 내 `Swarm` 클래스에 직접 붙여 보며 비교 · 규칙 쪽 객체와 스프라이트를 잇는 방법(스프라이트는 그리기만, 위치는 규칙에서) |
| | **GMB2** 🛠 얼음 성 깨기 | 벽돌 깨기 장르(공 · 받침 · 블록). 배치 · 규칙은 내 것으로 해요 · 얼음 블록 단단함 1 ~ 3(맞을 때마다 색이 옅어짐) · **폭탄 블록**은 이웃 8 칸을 깨고, 그 이웃이 폭탄이면 또 터져요 → 재귀 `blast(grid, r, c, seen)`(L32 — `seen` 이 없으면 서로 부르다 RecursionError) · 받침의 어디에 맞았나로 튀는 방향(가운데 = 위, 끝 = 비스듬히, 속력은 그대로 — M5_norm · M4_trig) · 공은 축 하나씩 움직여 반사(GM4) · 콤보 점수(GM6) · 장면(GM8) · 소리 이벤트(GM7) · 문제: ① 블록 판 글자 지도 `ICE_BOARD` → 블록 목록(CI) ② 반사 · 폭탄 연쇄 시험(CI) ③ 공 하나를 정해진 각도로 300 프레임 → 깬 블록 수 · 점수(CI) ④ 화면 · 소리 · 장면 붙이기, 마우스로 받침(noRun ☐) |
| 3 물리와 플랫폼 | GM10 속도 · 가속 · 중력 | 위치 · 속도 · 가속 — 프레임마다 `vel += acc * dt` → `pos += vel * dt` · `pygame.math.Vector2`(`+` · `*` · `length()` · `normalize()` · `reflect(normal)` — M5_dot) · 내 `Vec` 에 `__add__` · `__mul__` 을 붙여 보고 Vector2 와 비교(L15B 의 다음) · 중력 · 점프 = 위로 향하는 속도를 한 번 넣기 · 최고 낙하 속도 · 마찰 `vel.x *= 0.85` 와 「이만하면 멈춤」 기준 · 점프 높이 v²/2g 를 코드로 재어 식과 비교(M4_quad 포물선) · 고정 dt 를 쓰면 컴퓨터마다 점프가 같아요(가변 dt + 누적기는 「더 알아보기」) |
| | GM11 타일 지도와 벽 | 글자 지도(`#` 벽 · `.` 빈칸 · `P` 시작) → 타일 Rect 목록(L12B · X15) · `TileMap` 에 `__getitem__((col, row))` · `__iter__` · `__contains__`(L35) · **축 하나씩**: x 로 움직이고 벽에 겹치면 벽 옆에 붙이고, 그다음 y — 아래로 붙으면 `on_ground = True`, 위로 붙으면 머리 찧기(`vel.y = 0`) · 낙하 속도를 타일 크기보다 작게(뚫고 지나감 막기) · 카메라: 화면 위치 = 세상 위치 − `camera.x`, 플레이어를 따라가되 지도 끝에서 멈추기(clamp) · 주변 타일만 검사하기(빠르게) |
| | GM12 레벨과 손맛 | 레벨 파일 `levels/1.txt`(prep) 읽기와 잘못된 지도 알리기(`P` 가 없거나 둘, 줄 길이가 다름 → `ValueError`) · 레벨 검사: 시작에서 모든 등불 · 문에 갈 수 있나 — 재귀 flood fill(L32 · X15. 점프는 단순하게 「서 있을 수 있는 칸끼리, 세 칸 위까지」 로 정해요) · 가시 · 왕복 발판(올라탄 플레이어도 같이 움직이기) · 손맛 셋: 코요테 타임(발판을 떠나도 6 프레임 동안 점프 가능) · 점프 버퍼(땅에 닿기 직전에 누른 점프 기억) · 짧게 누르면 낮게 · 타이머는 모두 프레임 수 |
| | GM13 다듬고 나눠 주기 | 규칙 시험 묶음: `test_rules.py` + `@pytest.mark.parametrize`(D9), 결과는 `pytest.main([...])` 이 돌려준 0 만 찍기(D 교과서와 같은 규칙) · 창 없는 시험 파일 맨 위에 `os.environ.setdefault("SDL_VIDEODRIVER", "dummy")` · **리플레이**: 프레임마다 입력을 json 으로 남기고 다시 돌려 같은 결과가 나오는지 보기 → 버그를 재현하는 회귀 테스트로(D12) · 설정 파일(음량 · 키) · 그림 경로 `Path(__file__).parent / "assets"` 와 `resource_path()` · `pyinstaller --onefile --windowed game.py`(noRun ☐ — 백신 경고 · OS 마다 따로 빌드) · GitHub Releases 로 나눠 주기(G13) · README 에 조작법 · 「무엇이 내 것인가」 · 에셋 출처 적기(Z10) |
| | **GMB3** 🛠 꼬마 등대지기 | 플랫폼 점프 장르. 등대지기가 지도 셋을 돌며 꺼진 등불 셋을 켜고(닿으면 켜짐) 문으로 가요 · 가시 · 왕복 발판 · 그림은 글자 그림, 소리는 `wave` 로 만든 것, 이름 · 규칙 · 지도는 모두 내 것 · 문제: ① `LEVEL_1`~`LEVEL_3` 읽기 + 레벨 검사(재귀)(CI) ② 물리 + 타일 충돌: 「오른쪽 30 프레임 → 점프 → 착지」 위치와 `on_ground` 시험(CI) ③ 장면 · 점수(걸린 프레임 수, 최고 기록 json, 리플레이 한 판 다시 돌리기)(CI) ④ 화면 · 카메라 · 소리 붙이기 + 친구가 만든 레벨 넣어 보기(noRun ☐) |

**겹침 처리**
- 클래스 · 특수 메서드(L14 · L15 · L15B · L35): 다시 가르치지 않아요.
  - GM9 은 「Group 의 `len` · `in` · `for` = L35 의 그것」 으로 링크만 해요.
  - GM11 의 `TileMap` 은 L35 의 `Cart` 와 같은 모양으로 링크해요.
  - 새로 가르치는 건 GM10 의 `__add__` · `__mul__` 하나뿐이에요(지금 교과서 어디에도 연산자 특수 메서드가 없어요).
- 재귀(L32 · X15 · 알고리즘 A4): 재귀 자체는 링크만 해요. 이 코스에서는 게임에 쓰는 것만 다뤄요.
  - GMB2: 폭탄 연쇄
  - GM12: 레벨 갈 수 있나 검사
- tkinter(X13 · X14): 창을 띄우는 법은 다시 하지 않아요.
  - GM0 · GM1 에서는 「mainloop 가 불러 줌 vs 내가 while」 의 차이와, X14 의 「계산은 따로 떼어 assert」 를 게임 규칙으로 넓히는 것만 다뤄요.
- Enum · match(L36 · L37): 문법은 링크만 해요. GM8 에서는 장면 기계로 쓰는 법만 다뤄요.
- json · 예외(L17C · L13): 최고 기록 · 설정 · 리플레이에 쓰는 것만 다뤄요.
- random.seed(L16): `random.Random(seed)` 객체를 규칙에 넣어 주는 것(O7 의존성 주입)만 다뤄요.
- pytest(L39 · 디버깅 D7 · D9 · D12): 사용법은 링크만 해요. GM13 은 게임 규칙 시험 묶음과 리플레이 회귀 테스트만 다뤄요.
- 벡터 · 거리 · 포물선(수학 공간 M5_* · M4_quad): 식과 그림은 수학 공간 링크로 넘겨요. 여기서는 Vector2 와 프레임마다 더하는 코드만 다뤄요.
- 옵저버 · 의존성 주입(객체지향 O10 · O7): 패턴 설명은 링크만 해요. 소리 이벤트 · 가짜 Random 에 쓰는 것만 다뤄요.
- 텍스트 게임(X12 · B5 · 객체지향 OB3): 화면 없는 게임이라 겹치지 않아요. 「장면 = 방, 명령 = 이벤트」 비유로 링크만 해요.

**검사(CI)**

창 없이 되는 것을 직접 실험해 봤어요.
- 날짜: 2026-11-08
- 환경: 화면 · 소리 장치가 없는 리눅스, Python 3.13, `pygame 2.6.1` 과 `pygame-ce 2.5.8` 둘 다

| 무엇 | 아무 설정 없이 | `SDL_VIDEODRIVER=dummy` | `SDL_AUDIODRIVER=dummy` |
| --- | --- | --- | --- |
| `Rect` 전부 · `Vector2` · `Event(...)` 만들기 · `Surface` + `draw` + `get_at` · `font.Font(None).render` · `image.save` / `load`(convert 없이) · `sprite.Group` · `spritecollide` · `mask` · `transform` | ✅ (`pygame.init()` 도 필요 없음, `font` 만 `font.init()`) | ✅ | — |
| `display.set_mode` · `flip` · `convert()` / `convert_alpha()` · `event.post` → `event.get` 고리 | ❌ `convert` 는 「display 가 없어서 안 돼요」 에러 (`set_mode` 는 리눅스에서 SDL 이 offscreen 으로 알아서 가지만 믿지 않기) | ✅ (가짜 창 320×240, 픽셀도 읽힘) | — |
| `mixer.init` · `Sound(파일)` · `get_length` | ❌ `pygame.error: ALSA: Couldn't open audio device` + stderr 잡음 | — | ✅ |
| 실제 창 · 소리 듣기 · 키 감각 · FPS | ☐ | ☐ | ☐ |

검사 방법은 아래와 같이 정해요.
- **설치**: `tools/requirements-ci.txt` 에 `pygame-ce==2.5.8` 을 더하고 버전을 고정해요.
  - Rect 표시 · 글꼴 크기가 버전마다 달라서 고정해요.
  - cp312 manylinux wheel 이 있어서 CI(Python 3.12)에서 빌드 없이 깔려요.
- **환경 변수**: `check_book` 이 `game` 교과서의 예시 답 · 예제를 돌릴 때 `execFileSync` 의 `env` 에 세 개를 넣어요(안전망).
  - 넣을 것: `SDL_VIDEODRIVER=dummy` · `SDL_AUDIODRIVER=dummy` · `PYGAME_HIDE_SUPPORT_PROMPT=1`
  - 마지막 것을 빼면 인사 줄이 **stdout** 에 찍혀 출력 비교가 깨져요(실험으로 확인).
  - 그래도 창이 필요한 예시 답(`set_mode` · `convert_alpha` · 이벤트 고리)은 코드 맨 위에 `os.environ.setdefault("SDL_VIDEODRIVER", "dummy")` 를 직접 써요. GM1 · GM5 · GM13 에서 가르치는 기술이라서예요.
- **pygame 과 pygame-ce 차이 때문에 출력 예에 쓰지 않는 것**(실험으로 확인):
  - `print(rect)`: `<rect(5, 5, 10, 10)>` 대 `Rect(5, 5, 10, 10)` → `tuple(rect)` · `rect.topleft` 로 찍어요.
  - `print(color)`: `(255, 0, 0, 255)` 대 `Color(255, 0, 0, 255)` → `tuple(surf.get_at(p))[:3]` 로 찍어요.
  - Rect 에 소수 넣기: 반올림 대 버림 → 늘 `round()` 해서 넣어요(GM2 에서 가르쳐요).
  - 글꼴 그림 크기: `(67, 16)` 대 `(69, 18)` → 찍지 않아요. `get_height() > 0` 정도만 찍어요.
  - 이벤트 큐: `AudioDeviceAdded` · `WindowShown` · `ActiveEvent` 같은 장치 이벤트가 판마다 다른 개수로 들어와요. 그래서 이벤트를 통째로 찍지 않고, 내가 처리하는 종류만 걸러요.
  - 둘이 같은 것: `pygame.key.name` · `Vector2` 표시 · `tuple(rect)` · `transform` 크기.
- **끝나는 고리**: 실행되는 예시 답의 게임 고리는 늘 `frames=N` 만큼만 돌거나, 넣어 준 `QUIT` 이벤트에서 끝나요. 끝없는 `while True` 는 noRun 에만 써요(CI 시간 제한 30 초).
- **시간**:
  - 규칙은 고정 `DT = 1/60` 을 받아요. 타이머 · 무적 · 코요테 타임은 모두 프레임 수로 세요.
  - `Clock.tick` · `get_fps` 는 화면 쪽(noRun)에서만 쓰고, 값은 찍지 않아요.
- **무작위**: 규칙 클래스에 `random.Random(seed)` 를 넣어 줘요. 같은 seed 면 같은 판이에요(GMB1 ②).
- **입력**: 아래 두 가지 가짜 입력으로 시험해요. 진짜 키 누르기는 ☐ 예요.
  - 가짜 키보드 `defaultdict(bool, {K_LEFT: True})`
  - 가짜 이벤트 `pygame.event.Event(KEYDOWN, key=…)` 를 장면의 `handle` 에 바로 넣기
- **파일**:
  - 그림 · 소리 · `best.json` · 리플레이는 예시 답이 그 자리(임시 폴더)에서 만들어요.
  - 레벨 · 블록 판은 `prep`(파일 하나)으로 줘요.
  - 그림 확인: 크기와 몇 점의 색.
  - 소리 확인: `wave.open` 으로 프레임 수 · `round(길이, 2)`. 실험에서 `mixer.Sound` 길이도 같게 나왔지만, 출력은 `wave` 로만 찍어요.
- **pytest**: 디버깅 교과서 규칙과 같아요. `pytest.main([...])` 이 돌려준 값(0)만 찍고, 진짜 `python -m pytest` 화면은 본문 `<pre>` + ☐ 로 둬요.
- **noRun + ☐ 로 둘 것**:
  - 첫 창(GM0)
  - 레슨마다의 `game.py`(진짜 창 고리)
  - `python -m pygame.examples.aliens`
  - 한글 글꼴이 보이는지
  - 소리 듣기 · 배경음
  - 마우스로 받침 움직이기
  - `pygame.SCALED`
  - PyInstaller 빌드 · Releases 올리기
  - 만들어 보기 ④(내 규칙 · 화면 붙이기)

**사람이 확인할 것**
- 창이 뜨고 X 단추 · Esc 로 닫히나. 「응답 없음」 이 안 뜨나.
- 60 FPS 에서 움직임이 부드럽나. 떨림(Rect 정수 함정) · 찢어짐이 없나.
- 키 반응
  - 누르고 있기 vs 한 번 누르기가 맞게 갈렸나.
  - 한/영 상태에서도 키가 먹나(`stop_text_input`).
  - Windows · macOS 둘 다 봐요.
- 마우스 좌표 · 클릭이 버튼 자리와 맞나. 고해상도 화면에서 `SCALED` 를 켰을 때도 봐요.
- 그림
  - 투명 바탕이 투명한가(`convert_alpha`).
  - 왼쪽 보기 뒤집기 · 돌린 뒤 가운데가 맞나.
- 글자
  - 한글이 □ 가 아니게 나오나(OS 마다 글꼴 이름).
  - 점수 글자가 깜박이지 않나.
- 소리
  - 들리나. 음량이 알맞나. 끝에 「딱」 소리가 없나.
  - 소리 장치가 없을 때 게임이 멈추지 않나.
- 장면 전환 · 일시정지 · 다시 하기에서 지난 판 값이 남지 않나.
- 재미 · 어렵기: 피하기의 빨라지는 속도, 얼음 성 공 속도, 점프 높이 · 코요테 타임이 알맞나. 교과서 값으로 직접 해 봐요.
- 설치
  - Windows · macOS 에서 `pip install pygame-ce` 가 빌드 없이 끝나나(Python 3.13 · 3.14 · 3.15).
  - 이미 `pygame` 이 깔린 경우 안내대로 되나.
- PyInstaller exe 가 다른 컴퓨터에서 그림 · 소리를 찾나. 백신 경고 안내 문구가 맞나.
- 검수: 세 게임이 특정 기존 게임의 이름 · 그림 · 규칙 · 음악을 베끼지 않았나(장르만 빌림).

**정할 것(설계 때 물음 — 정한 것은 위 2절)**
1. **`pygame-ce` 로 가르쳐도 되나요?**
   - 원래 `pygame` 은 Python 3.14 부터 설치 파일이 없어서, 지금 python.org 에서 받은 파이썬이면 `pip install pygame` 이 실패해요.
   - 코드는 `import pygame` 그대로라 코스 이름 「pygame 으로 게임 만들기」 는 그대로 두고, 설치 줄만 `pygame-ce` 로 하자는 안이에요.
   - 출력 예는 두 패키지에서 같게 나오도록 써요(위 출력 규칙).
2. 레슨 수: 「약 16」 에서 **17**(GM13 「다듬고 나눠 주기」 를 따로 뒀어요). GM13 을 GMB3 에 합치면 16 이에요.
3. 게임 화면 글자: 기본은 영어 · 숫자(`SCORE` · `PRESS SPACE`)로 하고, 한글 글꼴은 GM6 에서 「바꿔 보기」 로 둬요.
   - OS 마다 글꼴 이름이 달라 ☐ 가 늘어서예요.
   - 한글을 기본으로 원하면 글꼴 찾기를 GM0 으로 당겨요.
4. GM13 의 PyInstaller(exe 만들기)를 넣을까요? 백신 경고 · OS 마다 따로 빌드라 ☐ 만 있는 쪽이에요. 빼면 Releases 링크만 남겨요.

---

## 파이썬 다음 단계(중급) (`pyplus`, 레슨 `PY0`~`PY13` · 만들어 보기 `PYB1`~`PYB3` = 17)

**한 줄로**: 파이썬 교과서를 다 뗀 사람이 「돌아가는 코드」 다음으로 넘어가는 교과서예요. **재서 빠르고 가볍게 고치고**, 기다리는 일과 계산하는 일을 **동시에** 돌리고, 내 코드를 **타입 검사 · 린터 · 문서**로 다듬어서 **`pip install` 할 수 있는 패키지와 명령**으로 내놓아요. 파이썬 교과서 챕터 10 「더 깊이」(L32 ~ L40)에서 바로 이어져요.

**누구에게 · 어디서 이어지나**
- 선수: 파이썬 교과서 전부. 특히 L16C(내 모듈과 패키지) · L16D(pip 와 가상 환경) · L18C(반복자와 제너레이터) · L18F(데코레이터) · L18E/L18G(타입 힌트 1 · 2) · L19B/L19C(argparse · 끝 코드) · L26(time.perf_counter) · L34(컨텍스트 매니저) · L38(ABC · Protocol) · L40(asyncio 맛보기).
- 같이 보면 좋은 곳: 알고리즘 A1(Big-O) · 운영체제 K7~K9(스레드 · 락 · 큐) · HTTP·API H16(pyproject 첫걸음).
- 다음에 갈 곳: HTTP·API 챕터 4(SDK 만들기 — 이 교과서의 패키지 · 타입 · async 를 그대로 씀) · GitHub G13 · G14(Releases · Actions 에 ruff · mypy 걸기) · 운영체제 챕터 2(동시성 속 사정) · 객체지향 · 설계(oop) 교과서.

**준비**
- 내 PC 의 VS Code + 파이썬(파이썬 교과서 「시작하기」). 파이썬 **3.12 이상**(`itertools.batched` · `def first[T]` 문법 · `asyncio.TaskGroup`). CI 도 3.12.
- 가상 환경(파이썬 L16D)에 한 번: `python -m pip install mypy ruff build setuptools httpx`
  - `mypy`(타입 검사) · `ruff`(린터 + 포매터 — black 과 같은 모양을 만드는 한 도구) · `build` + `setuptools`(패키지 만들기) · `httpx`(챕터 2 가짜 서버).
- 예제 데이터는 전부 교과서가 직접 만든 가짜 데이터(인터넷 · 내려받기 없음):
  - `make_sales.py`(book.js 상수 `SALES_GEN`, `prep` 으로 같은 파일) — `random.Random(2026)` 으로 「동네 서점 판매 기록」 CSV 를 n 줄 만들어요(날짜 · 회원 · 책 · 권수 · 값). 챕터 1 전부와 PYB1 이 씀.
  - `FAKE_SITES`(book.js 상수) — 링크 40개와 각자의 「응답 시간 · 상태 코드」 표. 챕터 2 에서 `httpx.MockTransport` 로 가짜 서버를 만드는 재료.
  - 패키지 예제는 답 코드가 `Path.write_text` 로 연습 폴더(`tempfile.TemporaryDirectory()`)에 직접 파일을 만들어요. 학습자 PC 를 어지럽히지 않게.

| 챕터 | id · 제목 | 주요 내용 |
| --- | --- | --- |
| 0 시작 | PY0 다음 단계: 재고 · 동시에 · 내놓기 | 「돌아간다」 다음의 세 질문(빠른가 · 동시에 되나 · 남이 쓸 수 있나) · 설치 한 줄과 `python -m mypy --version` · `python -m ruff --version` 확인 · **이 교과서의 출력 규칙**: 시간 · 메모리처럼 매번 다른 값은 숫자 대신 「몇 배가 2 보다 큰가 → True」 로 찍기, 진짜 숫자는 내 화면에서 ☐ |
| 1 빠르게 · 가볍게 | PY1 시간 재기 제대로: timeit · 빅오 감각 | 복습 L26 `perf_counter` · 한 번 재기는 들쭉날쭉 → `timeit.timeit(f, number=…)` · `min(timeit.repeat(…, repeat=5))` 이 대표값인 까닭 · `globals=` · 터미널 `python -m timeit -s "준비" "식"` · 함정(재는 코드 안의 `print` · 첫 실행 · 너무 짧은 일) · 비교는 `ratio = slow / fast` → `print(ratio > 2)` · 빅오 감각: n 을 2 배로 할 때 「센 횟수」 가 2 배(O(n)) · 4 배(O(n²)) 인지 세어 보기(알고리즘 A1 링크, 시간 버전은 ☐) |
| | PY2 느린 곳 찾기: cProfile · 고치고 다시 재기 | 「추측 말고 재기」 · `python -m cProfile -s cumtime app.py` 화면 읽기(ncalls · tottime · cumtime) · `with cProfile.Profile() as pr:` + `pstats.Stats(pr)` · 시간 대신 **불린 횟수**(`stats.stats` 의 ncalls)는 늘 같다 · 흔한 고치기 셋: `x in 리스트` → 집합(알고리즘 A8 링크) · 반복 안의 같은 계산 밖으로 · `@functools.cache` 와 `cache_info()`(hits · misses — L18F 다음) · 고친 뒤 결과가 같은지 먼저, 빨라졌는지 다음 |
| | PY3 메모리 재기: getsizeof · tracemalloc · `__slots__` | `sys.getsizeof` 는 겉만(리스트 안의 리스트) · `tracemalloc.start()` · `get_traced_memory()` 의 지금 · 최고(peak) · `reset_peak()` · `take_snapshot().statistics("lineno")` 로 가장 많이 쓴 줄(☐) · 객체 10만 개: `__slots__ = ("x", "y")` 가 더 작다(비교만) · 참조가 남으면 안 풀린다 — `del` · 큰 캐시의 값(`maxsize=`) · 운영체제 K11 의 RSS 와 무엇이 다른지 한 줄 |
| | PY4 제너레이터 깊이: 파이프라인 · itertools | 복습 L18C(yield · 제너레이터 식) · 읽기 → 쪼개기 → 거르기 → 더하기를 제너레이터로 잇기 · 리스트 버전과 peak 비교(100 배 넘게 작다 → True) · **한 번만 돈다** 함정(두 번째 `sum` 은 0) · `itertools.islice` · `chain.from_iterable` · `groupby`(먼저 정렬해야 하는 함정) · `batched(it, 100)`(3.12) · `tee` 와 `send` 는 「이런 게 있다」 |
| | **PYB1** 🛠 느린 서점 리포트를 빠르고 가볍게 | `make_sales.py` 로 만든 2만 줄. 주어진 느린 리포트(리스트 `in` · 반복 안 `sorted` · `.count` · 파일 통째로 읽기)를 ① cProfile 로 범인 찾기(불린 횟수 TOP 3) ② 고치기 ③ **고치기 전 · 후 리포트가 글자 하나까지 같다** ④ `빨라졌나(2배 넘게): True` · `메모리 덜 쓰나: True` |
| 2 동시에 | PY5 동시성 지도 · GIL 쉽게 · 스레드 풀 | 기다리는 일(I/O) vs 계산하는 일(CPU) · 스레드 · 프로세스 · asyncio 고르기 표 · **GIL = 마이크 하나**(말하는 사람은 한 명, 기다리는 동안은 마이크를 넘김) — 잠자기 5개는 스레드로 빨라지고(True) 계산 4개는 안 빨라진다(False) · GIL 없는 파이썬(3.13t ~) 은 「이런 게 생기고 있다」 · `with ThreadPoolExecutor(max_workers=4) as ex:` · `ex.map` 은 **넣은 순서대로** · `submit` → `Future.result()` · `as_completed` · 일꾼 안의 예외는 `.result()` 에서 다시 터진다 · 같은 변수를 고치지 말고 돌려받기(Lock 은 운영체제 K8 링크) |
| | PY6 프로세스 풀 · multiprocessing | 계산하는 일은 `ProcessPoolExecutor` · 꼭 `if __name__ == "__main__":`(Windows · macOS · 3.14 리눅스는 새 파이썬을 띄워 파일을 다시 읽음 — 빠뜨린 화면은 `<pre>`) · 프로세스는 메모리를 따로 씀(전역 변수를 고쳐도 부모는 그대로 — 운영체제 K2 링크) · 넘기는 값은 pickle 로 — `lambda` 는 못 넘김(`PicklingError`) · 띄우는 값이 커서 작은 일은 오히려 느림 · `chunksize` · `os.cpu_count()` · `multiprocessing.Pool` · `Queue` 는 이름만 |
| | PY7 asyncio 깊이 1: Task · 시간 제한 · 취소 | 복습 L40(`gather`) · `asyncio.create_task` 는 만들자마자 출발 · `async with asyncio.TaskGroup() as tg:`(하나가 터지면 나머지 취소 · `except* ValueError` 맛보기) · `async with asyncio.timeout(0.5):` 와 `TimeoutError` · `task.cancel()` · `CancelledError` 를 삼키지 않기 · `finally` 정리 · `asyncio.as_completed` 로 끝난 순서대로 |
| | PY8 asyncio 깊이 2: 한도 · 줄 · 막히는 코드 | `asyncio.Semaphore(3)` — 한 번에 3개만(서버 예의 · HTTP·API H8 의 한도 링크) · 「동시에 최대 몇 개였나」 세기 · `asyncio.Queue` 일꾼 N 명 + `task_done` · `join` · 막히는 함수(`time.sleep` · `requests`)는 `await asyncio.to_thread(f, …)` — L40 「흔한 실수」 의 다음 편 · `httpx.AsyncClient(transport=httpx.MockTransport(handler))` 로 인터넷 없이 가짜 서버(진짜 주소는 ☐) |
| | **PYB2** 🛠 링크 검사기 | README · 블로그의 링크 40개(`FAKE_SITES`)가 살아 있는지 동시에 확인: 한 번에 5개(Semaphore) · 0.5초 넘으면 「느림」(timeout) · 503 은 한 번 다시 · 결과표(살아 있음 · 404 · 느림 · 다시 해서 됨)를 이름 순으로 · 하나씩 할 때와 비교해 `빨라졌나(2배 넘게): True` · 스레드 풀 버전도 같은 표가 나오는지 · 내 진짜 README 링크로 돌리기(☐) |
| 3 남에게 내놓는 코드 | PY9 타입 검사: mypy · TypedDict · Protocol · Generic 맛보기 | 복습 L18E/L18G · `python -m mypy shop.py` 화면 읽기(`줄: error: … [arg-type]` — 맨 끝 대괄호가 에러 이름) · 힌트 없는 함수는 안 본다(점진적 도입 · `--check-untyped-defs`) · `reveal_type(x)` · `str \| None` 좁히기(`if x is None: return`) · JSON 같은 딕셔너리는 `class Item(TypedDict):` · Protocol 을 mypy 가 실제로 잡는 모습(설계 이야기는 oop O4 링크) · Generic 맛보기 `def first[T](xs: list[T]) -> T:`(옛 모양 `TypeVar` 도 읽기만) · 끝 코드 0 = 통과 |
| | PY10 라이브러리 속 들여다보기: 디스크립터 · 메타클래스 | 「이런 게 있다」 레슨 · `@property` 도 디스크립터(L15E 다음) · `__set_name__` · `__get__` · `__set__` 로 「0 보다 커야 하는 칸」 `Positive()` 를 여러 클래스에서 다시 쓰기 · 클래스도 객체 — `type(Book)` · `type("Point", (), {…})` · 하위 클래스 자동 등록은 메타클래스 대신 `__init_subclass__`(oop O11 `@register` 와 비교) · `type(Color)` 이 `EnumType` 인 까닭 · dataclass · Django · Pydantic 이 쓰는 곳 · 「내 코드에선 거의 안 쓴다」 |
| | PY11 좋은 코드 습관: ruff · 포매터 · 문서 | `python -m ruff check .` 화면 읽기(F401 안 쓴 import · E711 `== None` · B006 기본값 리스트 — 디버깅 D5 의 그 버그를 기계가 잡음 · I001 import 순서) · `--fix` · `python -m ruff format`(black 과 같은 모양, `--diff` · `--check`) · 규칙은 버전마다 기본값이 달라서 **`[tool.ruff.lint] select = [...]` 로 직접 고르기** · VS Code 저장할 때 자동 정리(☐) · docstring 모양(한 줄 요약 · Args · Returns · Raises) · `>>>` 예시를 **doctest** 로 — `doctest.testmod()` 의 `failed=0`(테스트 본편은 debug D7 링크) |
| | PY12 패키지 만들기: pyproject · src · 진입점 명령 | 복습 L16C · H16(pyproject 첫걸음) · `src/` 모양을 쓰는 까닭(설치 안 하고 import 되는 사고 막기) · `[build-system]` 3 줄의 뜻 · `[project]` name · version · requires-python · dependencies · **`[project.scripts]` `tip = "tipcalc.cli:main"`** — 명령 = 이 함수를 부르는 작은 실행 파일 · `main(argv=None) -> int` + 끝 코드(L19C 다음) · `__main__.py` 로 `python -m tipcalc` 도 · `python -m pip install -e .`(점이 「이 폴더」, 빠뜨리면 PyPI 에서 찾음) 과 「고치면 바로 반영」(☐) · `[tool.ruff]` · `[tool.mypy]` 도 같은 파일에 |
| | PY13 버전 · 빌드 · 배포 | 버전 규칙(H16 의 0.2.0 → 0.2.1 다음): `1.0.0rc1` · `0.3.0a1` · `packaging.version.Version("0.10.0") > Version("0.9.0")`(글자 비교는 반대!) · `importlib.metadata.version("tip-calc")` 로 버전을 한 곳에만 · 설치 전이면 `PackageNotFoundError` · `python -m build` → `dist/` 의 wheel · sdist · wheel 은 zip — `zipfile` 로 속 보기(`entry_points.txt` · `METADATA`) · `[project.optional-dependencies] dev = [...]` 와 `pip install -e ".[dev]"`(☐) · TestPyPI + `twine upload`(☐, 토큰은 G16 · H7 링크, 진짜 PyPI 에 연습용 금지) · GitHub Release 에 wheel 붙이기(G13 링크) · uv · hatch · poetry 도 같은 pyproject 를 읽는다(이름만) |
| | **PYB3** 🛠 글자 수 세기 명령 `geulja` 를 패키지로 | 자기소개서 · 원고용: `geulja 글.txt` → 글자 수(공백 포함 · 제외) · 줄 · 단어 · 바이트(UTF-8) · `--limit 1000` 이면 남은 글자 · `--json`. `src/geulja/` (core · cli · `__main__`) · TypedDict 결과 · mypy 0 · ruff 0 · core 에 doctest · 0.1.0 → `--json` 을 더해 0.2.0 · `python -m build` 한 wheel 에 명령이 들었나 확인 · 내 터미널에서 `pip install -e .` 뒤 아무 폴더에서 `geulja`(☐) · GitHub Actions 에 ruff · mypy 걸기(☐, G14 링크) |

**겹침 처리**

| 기존 레슨 | 겹치는 것 | 이 교과서에서는 |
| --- | --- | --- |
| 파이썬 L26 · 컴퓨터 과학 C9 | `perf_counter` · `timeit` 첫 비교(for vs sum) | PY1 은 「복습: L26 · C9」 링크 한 줄. 새로 하는 건 `repeat` + `min` · `-m timeit` · 재는 함정 · 「몇 배」 로 판정 |
| 알고리즘 A1 · A8 · A14 | Big-O · 해시가 빠른 이유 · 메모 | 다시 안 가르침. PY1 은 「센 횟수가 몇 배」 실험만, PY2 는 「집합으로 바꿨더니 몇 배」 를 재는 쪽 |
| 파이썬 L18F | `@functools.cache` 소개 | PY2 에서 `cache_info()` 로 효과를 재고, PY3 에서 메모리 값(`maxsize`)을 봄 |
| 파이썬 L18C | iter · next · yield · 제너레이터 식 · yield from | PY4 첫 쪽 「복습: L18C」. 새로 하는 건 파이프라인 · 메모리 비교 · 한 번만 도는 함정 · itertools |
| 운영체제 K7 · K8 · K9 · K10 · K11 | Thread · start · join · GIL 맛보기 · Lock · Queue · 가상 메모리 · RSS | `threading.Thread` · Lock · `queue.Queue` 는 다시 안 가르치고 링크. PY5 는 그 위의 **`concurrent.futures`**, PY6 은 프로세스 풀, GIL 은 「마이크」 그림 + 재 보기만. PY3 은 파이썬 안의 메모리(tracemalloc), 운영체제 쪽은 링크 |
| 파이썬 L40 | async def · await · asyncio.run · gather · never awaited · time.sleep 실수 | PY7 첫 쪽 「복습: L40」. 새로 하는 건 create_task · TaskGroup · timeout · 취소 · as_completed · Semaphore · Queue · to_thread |
| 컴퓨터 과학 C15 | 스레드로 서버 · 클라이언트 | 링크만. 챕터 2 는 소켓 대신 `httpx.MockTransport` |
| 파이썬 L18E · L18G · L38, oop O4 | 힌트 문법 · `\| None` · Protocol 설계 · 「mypy 가 잡아 준다」 한 줄 | PY9 는 **mypy 를 실제로 돌리고 에러를 읽고 고치는 쪽**. Protocol 을 언제 쓰나(설계)는 O4 링크 |
| 파이썬 L15E · oop O11 | property · dataclass · `@register` 등록 | PY10 은 그 속(디스크립터 · `__init_subclass__`)을 「이런 게 있다」 로만 |
| 디버깅 D5 · D7 · D14 | 가변 기본값 버그 · pytest · CI 에서 테스트 | PY11 은 그 버그를 ruff(B006)가 잡는 모습만. 테스트는 doctest 하나(본편은 D7 링크), CI 는 G14 · D14 링크 |
| 파이썬 L8C | docstring · help() | PY11 은 「복습: L8C」 + 모양(Args · Returns) · doctest |
| 파이썬 L16C · L16D, HTTP·API H16 · HB4 | 패키지 폴더 · `python -m mypkg` · pip · venv · requirements.txt · pyproject 첫걸음 · `pip install -e .` · 0.1.0 → 0.2.0 | PY12 첫 쪽 「복습: L16C · H16」. 새로 하는 건 src 모양 · `[build-system]` 의 뜻 · **진입점 명령** · `__main__.py` · `[tool.*]`. PY13 은 PEP 440 버전 비교 · `importlib.metadata` · wheel 속 · extras · TestPyPI |
| 파이썬 L19B · L19C, B6 | argparse · 하위 명령 · 끝 코드 · 명령 줄 메모 도구 | PYB3 는 argparse 를 다시 안 가르치고 「설치되는 명령」 으로 만드는 쪽. 주제도 메모가 아니라 글자 수 세기 |
| GitHub G13 · G14 · G16 | 태그 · Releases · Actions · 비밀값 | PY13 · PYB3 에서 링크만(☐) |

**검사(CI)**

- 예시 답은 python3(3.12)로 실제 실행해 출력 예와 비교(파이썬 기본 검사, `main.py` + `prep`).
- **`tools/requirements-ci.txt` 에 더할 것**: `mypy` · `ruff` · `build` · `setuptools` — **버전을 `==` 로 고정**.
  - 까닭: mypy 메시지 · ruff 기본 규칙 · ruff format 모양은 버전마다 바뀌어요. 실제로 지금 ruff 는 설정 없이도 I001 을 냈어요(예전 기본값은 E · F 만).
  - 올릴 때는 check_book 을 돌려 출력 예를 함께 고쳐요.
  - `httpx` · `packaging`(pytest 가 같이 깖)은 이미 있어요.
  - mypy · ruff 는 pip 휠(ruff 는 실행 파일 하나)이라 CI 에 문제없이 깔려요. 이 컨테이너(3.13)에서 mypy 2.4 · ruff 0.17 · black 26 · build 1.6 을 깔아서 아래를 확인했어요.
- **시간**: 숫자는 절대 출력 예에 넣지 않아요. `min(timeit.repeat(…))` 으로 잰 두 값의 비 `ratio` 를 `print("빨라졌나(2배 넘게):", ratio > 2)` 처럼 찍어요.
  - check_book_par 가 교과서 여럿을 CPU 를 나눠 동시에 돌리므로, **CI 에서 판정하는 비교는 실제로 10 배 이상 차이 나는 것만** 써요(리스트 `in` vs 집합 · cache 전후 · 잠자기 5개 순서대로 vs 스레드 = 이 컨테이너에서 약 5 배). 문턱은 2 로 넉넉하게.
  - 차이가 작은 것(컴프리헨션 vs append, `+=` vs `join`)은 ☐.
  - **프로세스 풀의 「빨라졌나」 는 CI 에서 판정하지 않아요**: CPU 를 나눠 쓰는 중이라 흔들려요. 이 컨테이너 4코어에서도 2.3 배였어요. CI 에서는 「결과가 순서대로 한 것과 같다: True」 만, 빠르기는 ☐.
  - GIL 쪽 「계산 4개를 스레드로 2배 넘게: False」 는 일반 CPython 에서는 늘 False 라 판정해도 돼요(이 컨테이너 0.85 배). GIL 없는 빌드면 True 가 나온다는 설명을 같이 써요.
  - 「빅오 감각」 은 시간이 아니라 **센 횟수**로 판정해요(늘 같은 수).
- **cProfile**: 화면(`print_stats`)에는 시간이 찍혀서 `<pre>` + ☐. 예시 답은 `pstats.Stats(pr).stats` 에서 내 파일 함수의 **불린 횟수(ncalls)** 만 이름 순으로 찍어요. 그 수는 늘 같아요(예: 메모 없는 `fib(20)` 은 21891 번).
- **메모리**: `sys.getsizeof` · tracemalloc 숫자는 파이썬 버전마다 달라요. 학습자는 3.14 · 3.15, CI 는 3.12. 그래서 「리스트가 제너레이터보다 100배 넘게: True」(실측 약 3만 배) · 「`__slots__` 쪽이 작다: True」(3.13 실측 1.46 배)처럼 비교만 찍어요.
- **무작위**: `random.Random(2026)` 처럼 seed 를 박은 객체로만 데이터를 만들어요(`randrange` · `choice`). 셔플 결과를 출력 예에 쓰는 일은 피해요.
- **동시성 순서**:
  - 스레드 안에서 `print` 하지 않아요. `ex.map` 의 결과(넣은 순서)를 바깥에서 찍어요.
  - asyncio 는 sleep 시간을 서로 다르게(0.05 초 넘게 차이) 두면 끝나는 순서가 늘 같아요. 이벤트 루프가 마감 시각 순(힙)으로 꺼내기 때문이에요.
  - 「동시에 최대 몇 개」 는 카운터로 세어 찍어요.
  - 가짜 서버는 `httpx.MockTransport`(async 처리 함수 + `asyncio.sleep`)라 인터넷이 없어도 돼요.
  - 한 문제의 전체 잠자기는 2 초 안쪽(제한 30 초).
- **mypy**:
  - 답 끝에서 `from mypy import api` → `out, err, code = api.run([검사할 파일])`. debug 교과서의 `pytest.main` 과 같은 「파이썬에서 부르기」 예요.
  - 출력 예에는 **끝 코드**(0 = 통과)와 **「17줄 [typeddict-item]」 처럼 줄 번호 + 에러 이름만** 찍어요. 경로(임시 폴더)와 문장은 버전 · PC 마다 달라서 빼요.
  - 전체 메시지는 본문 `<pre>` + ☐ 「내 화면에도 같은 [이름] 이 나오나」.
  - 이 컨테이너에서 확인: 한 파일 검사 0.7 초, 문장은 `shop.py:17: error: Incompatible types (…)  [typeddict-item]` 모양.
  - 함수 문제(`check` 를 붙이는 모양)는 쓰지 않아요. 붙인 확인 코드까지 mypy 가 읽기 때문이에요.
- **ruff**:
  - `subprocess.run([sys.executable, "-m", "ruff", "check", "--no-cache", "--output-format=concise", "--select", "E,F,I,B", 파일], capture_output=True, text=True)`.
  - ruff 는 문제가 있으면 끝 코드 1 이라 꼭 `capture_output` 으로 받아요. 그냥 실패시키면 check_book 이 「실행 에러」 로 봐요.
  - 출력 예는 `규칙 이름 + 줄` 과 끝 코드.
  - `ruff format --diff` 는 날짜가 안 찍혀서 그대로 써도 돼요(버전 고정 전제).
  - black 의 `--diff` 는 날짜 · 시각이 찍혀서 출력 예에 못 써요. 그래서 포매터는 ruff format 으로 통일하고 black 은 이름 · ☐.
- **doctest**: `doctest.testmod()` 의 돌려준 값 `TestResults(failed=0, attempted=3)` 을 그대로 찍어요(늘 같음).
- **패키지(PY12 · PY13 · PYB3)**:
  - 답이 임시 폴더에 `pyproject.toml` · `src/…` 를 `write_text` 로 만들어요.
  - 그다음 `subprocess.run([sys.executable, "-m", "build", "--no-isolation", "--wheel", 폴더])` 로 wheel 을 만들어요. `--no-isolation` = 인터넷에서 setuptools 를 받지 않고 지금 것을 씀. 학습자 venv 에도 PY0 에서 setuptools 를 깔았어요.
  - 이어서 `pip install --no-index --no-deps --target 시험장 dist/*.whl` 로 그 폴더에만 설치해요.
  - 확인은 `importlib.metadata` 로: `version("tip-calc")` → `0.1.0`, 명령 `entry_points(group="console_scripts")` 의 `tip` → `tipcalc.cli:main`, 그 함수를 `ep.load()` 해서 부른 출력.
  - 이 컨테이너에서 확인한 것:
    - 인터넷 없이 build 0.9 초.
    - wheel 이름 `tip_calc-0.1.0-py3-none-any.whl`. 이름의 `-` 가 `_` 로 바뀌는 것도 가르칠 거리.
    - `entry_points.txt` 내용은 `[console_scripts]` / `tip = tipcalc.cli:main`.
    - `--target` 설치 뒤 `version()` = `0.1.0`, 명령 실행 = 정상.
  - `pip install ./폴더` 의 `./` 를 빠뜨리면 「No matching distribution」(PyPI 에서 찾음) — 실측 그대로 에러 읽기 문제로.
  - 가상 환경 안에 또 가상 환경을 만드는 방식(`venv.create` + `pip install -e`)은 **쓰지 않아요**. CI 에서는 4 초에 됐지만, 학습자의 venv 안에서 만든 venv 는 venv 가 아니라 바탕 파이썬의 site-packages 를 봐서, 인터넷 없이 setuptools 를 못 찾을 수 있어요.
  - 진짜 `pip install -e .` 과 터미널 명령 `tip 45000 3` 은 noRun + ☐.
- **noRun 으로 둘 것**: 진짜 `pip install -e .` · `pip install -e ".[dev]"` · 터미널에서 설치된 명령 실행 · TestPyPI / `twine upload` · GitHub Actions 워크플로 · 진짜 인터넷 주소(PYB2 의 「내 README 로」) · `python -m cProfile` / `timeit` 화면 그대로 · `snapshot.statistics` 화면 · `if __name__` 을 빠뜨린 프로세스 풀 화면(리눅스 3.12 의 fork 에서는 에러가 안 나서 CI 로 못 보여 줌).
- 모양 규칙: 다른 파이썬 계열과 같이 한 줄에 함수 호출 3겹 이하(`ratio = slow / fast` 를 따로 두기 등).

**사람이 확인할 것**
- 내 PC 에서 잰 시간 · 「몇 배」 가 대략 설명과 맞는지(특히 프로세스 풀이 코어 수만큼 빨라지는지, Windows 에서 띄우는 값이 큰지).
- Windows 에서:
  - 프로세스 풀 + `if __name__` 을 빠뜨린 에러 화면.
  - `pip install -e .` 뒤 `Scripts\geulja.exe` 가 생기고 아무 폴더에서 `geulja` 가 되는지.
  - 한글 파일 이름과 `encoding="utf-8"`.
- VS Code: mypy · ruff 확장(또는 Pylance)의 밑줄 · 저장할 때 자동 정리(`editor.formatOnSave`)가 본문 설명대로 켜지는지.
- PYB2 를 진짜 링크로 돌렸을 때 예의(동시 5개 · 시간 제한)가 지켜지는지.
- TestPyPI 화면 · 토큰 만들기 단계가 현재 사이트 모양과 맞는지(바뀌기 쉬움).
- 3.14 · 3.15 에서 본문 예시가 그대로 도는지(CI 는 3.12): asyncio · multiprocessing 기본값 변화.

**정할 것(설계 때 물음 — 정한 것은 위 2절)**
- 레슨 수가 **17**(「약 16」 보다 하나 많음)이에요. 16 으로 맞추려면 PY10(디스크립터 · 메타클래스)을 PY9 의 마지막 「더 알아보기」 쪽으로 접으면 돼요. 저는 따로 두는 쪽을 권해요. 「라이브러리 속은 이렇다」 를 한 번 보고 나서 패키지를 만들면 흐름이 좋아요.
- 실제 PyPI 에 올리는 것은 가르치지 않고 **TestPyPI 까지만**(☐) 하려고 해요. 계정 · 2단계 인증 · 이름 선점 문제가 있어서예요. 괜찮은지.
- requirements-ci 에 mypy · ruff · build · setuptools 를 버전 고정으로 더해도 되는지. CI 설치가 몇 초 늘어요. 저는 「된다」 로 보고 설계했어요.
