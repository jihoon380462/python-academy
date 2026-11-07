# HTTP · API · SDK 교과서 — 설계 (새 코스, 2026-11-07 Opus)

> 사용자(11/7): 「웹은 따로 빼서 할 거고 **HTTP-API-SDK 는 서로 연결되니까 같이 묶을** 거야. 각각 레슨 설계해」. 웹 쪽 설계는 [`specs/web-course.md`](web-course.md).
> 출발점: 지금 웹 교과서 챕터 3(W10 HTTP · W11 진짜 API · W12 `requests` · W13 REST) + `docs/EXPANSION.md` 8절의 「서버와 대화」. 그 내용을 이 교과서로 옮기고, **서버를 내가 만드는 쪽**과 **SDK** 를 더해요.
> 이 문서는 **설계**예요. 만들 때 이 문서를 따르고, 바뀌는 건 여기를 먼저 고쳐요. 형식은 `specs/os-course.md` 와 같게. 기술적인 선택은 Claude 가 정했고(HANDOFF 3절) 이유를 9절에 적었어요.

---

## 1. 한 줄로

**프로그램끼리 대화하는 법을 세 겹으로: HTTP(말하는 방법) → API(정해 둔 약속) → SDK(그 약속을 편하게 감싼 라이브러리).** 남이 만든 API 를 `curl` 과 파이썬 `requests` 로 불러 보고, 내가 API 서버를 만들고, 마지막엔 그 API 의 **파이썬 SDK** 를 직접 만들어 써요. 세 겹이 한 줄로 이어져서 한 교과서예요.

```
SDK   client.todos.create("장보기")          ← 내가 쓰는 쪽은 이것만
API   POST /todos  {"text": "장보기"}  → 201  ← 정해 둔 약속(주소 · 메서드 · 모양)
HTTP  요청 줄 · 헤더 · 본문 / 상태 코드 · 헤더 · 본문  ← 실제로 오가는 글자
```

## 2. 다른 교과서와의 경계

| 주제 | 다른 교과서 | **HTTP·API·SDK 교과서** |
| --- | --- | --- |
| HTML · CSS · JS · DOM · `async`/`await` · `fetch` 로 내 JSON 파일 | ✅ 웹 W0~W10 | 다시 안 가르침. 레슨 4 에서 「브라우저의 fetch 로 **진짜 API**」 와 CORS 만 |
| 파이썬 문법(함수 · 딕셔너리 · 예외 · 클래스 · 모듈) | ✅ 파이썬 교과서(클래스 L14·L15) | 링크. 레슨 13~16(SDK)은 클래스를 씀 → 「먼저 보면 좋은 레슨」 |
| `curl` · 터미널 · 환경 변수 | 터미널·Git(명령 줄) · 리눅스 U9(`export`) | `curl -v` 로 HTTP 를 보는 것만 여기 |
| 토큰을 커밋하지 않기 · `.gitignore` · Secrets | ✅ GitHub G16 | 레슨 7 에서 「API 키는 환경 변수 · `.env`」 — 원리는 G16 링크 |
| GitHub 계정 · Personal access token 만드는 화면 | ✅ GitHub 교과서 | 레슨 7 · 만들어 보기 2 는 그 토큰을 **API 에서 쓰는 법** |
| SQLite | ✅ SQL 교과서 | 레슨 12 에서 내 API 의 저장소로 씀(SQL 은 링크) |
| 네트워크 아래쪽(IP · DNS · TCP · 포트) | 예정 T1 CS · 리눅스 U13 | 레슨 1 에서 「주소 → 서버를 찾아 연결 → HTTP」 한 줄만 |
| LLM API · AI SDK | 예정 T7 AI와 협업 · T11 LLM 기초 | 레슨 16 끝에 「같은 모양의 SDK」 맛보기만(유료 키 — 선택) |

## 3. 연습 방법

- 연습은 **사용자 PC 의 진짜 도구**: **VS Code + 파이썬**(파이썬 교과서 시작하기) · 터미널의 **`curl`**(Windows 10/11 에 처음부터 들어 있음 — 단 **Windows PowerShell(VS Code 의 기본 터미널)에서는 `curl` 이 `Invoke-WebRequest` 의 별명**이라 `curl.exe` 로 치거나 Git Bash 에서. 「먼저 꼭」 에 넣음) · 크롬/엣지 **F12 → Network**. 우분투 VM 은 필요 없어요(있으면 거기서 해도 같음).
- **연습용 공개 API — 키 없이 바로**(가입 없음 · 무료):

| 서버 | 쓰는 곳 | 왜 |
| --- | --- | --- |
| `https://httpbin.org` | 레슨 1~3 · 5 · 8 | 보낸 요청을 그대로 되돌려 줘서(`/get` · `/post` · `/headers` · `/status/404` · `/delay/3` · `/bearer`) **HTTP 가 눈에 보여요**. 느리거나 막히면 같은 모양의 `https://postman-echo.com` |
| `https://jsonplaceholder.typicode.com` | 레슨 4 · 6 | 가짜 REST(할 일 · 글 · 사용자). POST · PUT · DELETE 를 해도 진짜로 바뀌진 않고 그럴듯한 응답(201 · `id: 101`)만 — 마음껏 연습 |
| `https://api.open-meteo.com` | 만들어 보기 1 | 키 없는 날씨 API(개인 · 비상업 무료) |
| `https://api.github.com` | 레슨 7~9 · 만들어 보기 2 · 레슨 13 | 진짜 서비스의 진짜 API. 토큰 없이 시간당 60번, 토큰이 있으면 5000번 — 인증 · 페이지 · 한도를 진짜로 겪음 |

- **서버 만들기(챕터 3)**: **FastAPI + uvicorn** 을 내 PC 에 설치(`python -m pip install "fastapi[standard]"`), `http://127.0.0.1:8000` 에서만. `/docs` 에 자동으로 생기는 API 문서 화면을 처음부터 같이 봐요.
- 레슨마다 맨 아래 작게 「이 쪽의 응답 모양은 2026년 11월 기준이에요. 공개 API 는 바뀔 수 있어요」.

## 4. 「먼저 꼭」 경고

| 위치 | 제목 | 내용 |
| --- | --- | --- |
| 목차 챕터 1 위 · 레슨 0 | 파이썬 교과서 「시작하기」 · `requests` 설치 | VS Code 터미널에서 `python -m pip install requests`. 명령 줄이 처음이면 터미널·Git 교과서 레슨 0~2 |
| 레슨 0 · 1 | PowerShell 에서는 `curl.exe` | Windows PowerShell 의 `curl` 은 다른 명령의 별명이라 `-v` · `-i` 가 안 돼요 → **`curl.exe -v …`** 로 치거나 Git Bash 를 써요(이 교과서의 예는 Git Bash 기준, PowerShell 은 `curl.exe`) |
| 레슨 7 · 챕터 2 위 · 만들어 보기 2 | **API 키 · 토큰은 코드에 쓰지 않기** | 환경 변수(`os.environ["GITHUB_TOKEN"]`)나 `.env` 파일 + `.gitignore`. 한 번이라도 GitHub 에 올렸으면 **바로 지우고 새로 발급**(지우기만으로는 기록에 남음 — GitHub G16). 토큰 권한은 필요한 만큼만(읽기 전용 · 만료일) |
| 레슨 8 | 남의 서버를 두드리지 않기 | 반복문으로 공개 API 를 부를 땐 `time.sleep` · 한도 헤더 확인. 막혔으면(429) 기다리기 — 계속 두드리면 차단될 수 있어요 |
| 레슨 10 · 챕터 3 위 | 내 서버는 내 PC 에서만 | `uvicorn … --host 127.0.0.1`(기본값). `0.0.0.0` 으로 열면 같은 와이파이의 다른 기기도 들어와요 |
| 레슨 16 | 유료 API 는 돈이 나가요 | LLM API 같은 유료 SDK 맛보기는 **선택** — 키를 만들기 전 요금 · 한도 설정 화면부터. 이 교과서의 다른 실습은 모두 무료 |

## 5. 목차 (챕터 4 · 레슨 17 + 만들어 보기 4 = 21)

레슨 id 는 `H0`~`H16`(HTTP), 챕터 끝 만들어 보기 `HB1`~`HB4`. 쪽 수 2~4 + 마지막 「🛠 만들어 보기」. 폴더 `courses/api/`.

### 챕터 1 · HTTP 들여다보기 — 요청과 응답은 글자예요

| id | 제목 | 쪽(주요 내용) | 만들어 보기 |
| --- | --- | --- | --- |
| H0 | API 가 뭔가: 프로그램끼리의 약속 | ① 화면은 사람에게, API 는 프로그램에게 — 같은 서버가 두 가지를 내놓아요(날씨 앱 · 지도 · 결제) · ② HTTP · API · SDK 세 겹(1절의 그림) · ③ 준비: `curl --version` · `python -m pip install requests` · 첫 요청 `curl https://httpbin.org/get` | 내 PC 에서 `curl` · `requests` 가 되는지(☐) |
| H1 | 요청 한 줄씩: 주소 · 메서드 · 헤더 · 본문 | ① 주소 해부: `https://` · 호스트 · 경로 · `?a=1&b=2`(쿼리) · 「주소 → 서버를 찾아 연결 → HTTP」 · ② `curl -v` 로 실제로 오가는 글자: `>` 요청 줄 `GET /get HTTP/1.1` · 헤더 · 빈 줄 · 본문 / `<` 응답 · ③ 메서드 GET · POST · PUT · PATCH · DELETE 의 뜻 | `curl` 로 쿼리를 붙인 요청을 보내 httpbin 이 되돌려 준 `args` 확인(☐) · 파이썬 `urllib.parse.urlparse` 로 주소 쪼개기(자동 검사) |
| H2 | 상태 코드: 서버의 대답 첫마디 | ① 2xx 3xx 4xx 5xx · 자주 보는 것(200 · 201 · 204 · 301/302 · 304 · 400 · 401 · 403 · 404 · 409 · 422 · 429 · 500 · 503) · ② `curl -i https://httpbin.org/status/404` · `curl -L` 로 리다이렉트 따라가기 · ③ 「누구 탓인가」 로 고치는 곳 고르기(4xx 내 요청 · 5xx 서버 · 잠시 뒤) | 상태 코드를 받아 「무엇을 해야 하나」 를 돌려주는 함수(자동 검사) · `/status/` 여러 개를 `curl -i` 로(☐) |
| H3 | 헤더와 JSON | ① 헤더 = 봉투에 적은 정보: `Content-Type` · `Accept` · `User-Agent` · `Authorization` · ② JSON 의 모양(객체 · 배열 · 글자 · 숫자 · `true`/`false`/`null`) ↔ 파이썬(`json.loads` · `json.dumps`) · 한글은 `ensure_ascii=False` · ③ 깨진 JSON(`json.JSONDecodeError`)과 「JSON 인 줄 알았는데 HTML 에러 페이지」 | 중첩 JSON 에서 값 꺼내기 · 깨진 JSON 은 알려 주기(자동 검사) |
| H4 | 브라우저에서 본 HTTP · CORS | ① F12 → **Network**: 한 줄 = 요청 하나, Headers · Response · Timing · 필터(Fetch/XHR) · ② 웹 교과서 W10 의 `fetch` 로 **진짜 API**(jsonplaceholder) 부르기 — `res.ok` · `res.status` · ③ **CORS**: 다른 주소의 API 를 브라우저가 막는 이유 · 응답 헤더 `Access-Control-Allow-Origin` · 「브라우저만 막고 `curl`·파이썬은 안 막혀요」(챕터 3 에서 내 서버로 직접 겪음) | Network 탭으로 이 사이트가 부르는 요청 셋 읽기(☐) · fetch 로 할 일 5개 그리기(☐ — 웹 미리보기 검사) |
| **HB1** | 🛠 날씨 알리미 | Open-Meteo 로 도시(위도·경도)의 지금 기온 · 오늘 최고/최저 · 비 올 확률을 받아 한 줄로. 상태 코드 확인 · 네트워크 에러(`requests.exceptions`) 처리 · 응답이 이상하면 알려 주기 | ☐ + 응답 JSON 을 넣으면 줄을 만드는 함수(자동 검사) |

### 챕터 2 · API 를 제대로 쓰기 — requests

| id | 제목 | 쪽 | 만들어 보기 |
| --- | --- | --- | --- |
| H5 | requests 기본기 | ① `requests.get(url, params={...}, timeout=10)` — **timeout 은 늘** · ② `res.status_code` · `res.headers` · `res.json()` · `res.raise_for_status()` · ③ `requests.post(url, json={...})` vs `data=` · `requests.Session()`(헤더를 한 번에 · 연결 재사용) | httpbin `/get` · `/post` 로 내가 보낸 것이 그대로 돌아오는지(☐) · 응답을 받아 요약하는 함수(자동 검사) |
| H6 | REST: 주소와 메서드의 약속 | ① 자원(명사) + 메서드(동사): `GET /todos` · `GET /todos/1` · `POST /todos` · `PUT/PATCH /todos/1` · `DELETE /todos/1` — CRUD 표 · ② jsonplaceholder 로 한 바퀴(201 · 200 · 404 를 직접) · ③ 같은 일을 하는 나쁜 주소(`/getTodo?id=1`)와 비교 · 멱등(같은 요청을 두 번 해도 같은가) | 할 일 CRUD 한 바퀴 스크립트(☐) · 「이 일은 어느 메서드 · 주소?」 표 맞추기(자동 검사) |
| H7 | 인증: API 키와 토큰 | ① 왜 신분증이 필요한가(누가 · 얼마나 · 무엇을) · 헤더 `Authorization: Bearer 토큰` · 쿼리에 키를 넣는 API 도 있음(주소는 기록에 남아 위험) · ② GitHub **fine-grained token** 만들기(읽기 전용 · 만료일 — 화면은 GitHub 교과서 링크)로 `GET /user` · 401 · 403 의 차이 · ③ 키는 코드 밖으로: 환경 변수 · `.env` + `python-dotenv` + `.gitignore` | 환경 변수에서 토큰을 읽어 내 GitHub 이름 찍기(☐) · 토큰이 없으면 친절한 안내로 멈추기(자동 검사) |
| H8 | 페이지 · 한도 · 재시도 | ① 한 번에 다 안 줘요: `?per_page=&page=` · GitHub 의 `Link` 헤더(`rel="next"`) — `res.links["next"]["url"]` · ② 한도: `X-RateLimit-Remaining` · `Retry-After` · 429 · ③ 재시도: 5xx · 429 · 끊김은 잠깐 기다렸다(1 → 2 → 4초) 다시, 4xx(400 · 401 · 404)는 다시 해도 똑같아서 안 함 | 다음 페이지가 없을 때까지 모으는 함수(자동 검사 — 가짜 응답으로) · 재시도 규칙 함수(자동 검사) |
| H9 | API 문서 읽는 법 | ① 문서에서 찾을 것: 기본 주소 · 인증 · 엔드포인트 · 파라미터(필수?) · 응답 예시 · 에러 · 한도 · 버전 · ② GitHub REST 문서의 한 쪽을 같이 읽기(「List repositories for a user」) · ③ **OpenAPI**: 문서를 기계도 읽게 만든 것 — 챕터 3 의 `/docs` 가 이것 | 문서만 보고 처음 쓰는 엔드포인트 부르기(☐) |
| **HB2** | 🛠 내 GitHub 저장소 보고서 | 토큰으로 내 저장소를 **페이지를 넘겨 전부** 받아 언어별 개수 · 별 많은 순 3개 · 최근 고친 저장소를 표로. 한도가 바닥나면 기다릴 시간 알려 주기 | ☐ + 받은 목록으로 표를 만드는 부분(자동 검사 — 가짜 응답) |

### 챕터 3 · 내가 API 만들기 — 서버 쪽에 서 보기

| id | 제목 | 쪽 | 만들어 보기 |
| --- | --- | --- | --- |
| H10 | FastAPI 첫 서버 | ① 서버 = 요청을 기다렸다가 응답을 돌려주는 프로그램 · 설치 `python -m pip install "fastapi[standard]"` · ② `@app.get("/hello")` 함수 하나 → `fastapi dev main.py` → 브라우저 · `curl` · `requests` 로 부르기 · 터미널에 찍히는 요청 기록 읽기 · ③ **`/docs`**: 자동으로 생긴 API 문서(OpenAPI) — 거기서 바로 「Try it out」 | 인사 API · 지금 시각 API(☐ + `TestClient` 로 자동 검사) |
| H11 | 입력 받기: 경로 · 쿼리 · 본문 | ① 경로 파라미터 `/todos/{todo_id}`(타입 힌트 `int` → 글자를 주면 422) · 쿼리 파라미터 `?done=true&limit=10`(기본값) · ② 본문: Pydantic 모델(`class TodoIn(BaseModel)`) — 빠진 칸 · 틀린 타입은 FastAPI 가 알아서 422 + 이유 · ③ 422 응답 JSON 읽기 | 계산기 API(`/add?a=&b=`) · 회원 가입 검사 API(본문 모델) — `TestClient` 자동 검사 |
| H12 | 상태 코드와 저장 | ① 알맞은 상태 코드 돌려주기: 만들면 `status_code=201` · 없으면 `HTTPException(404)` · 지우면 204 · ② 메모리(리스트) → **SQLite**(`sqlite3` — SQL 교과서 링크)로 저장해 서버를 껐다 켜도 남게 · ③ CORS 켜기: 웹 교과서의 내 화면(Live Server `127.0.0.1:5500`)에서 부르면 막힘 → `CORSMiddleware` 에 그 주소만 허락 | 404 · 201 이 맞게 나오는지(`TestClient`) · CORS 를 켜기 전/후 브라우저 Console(☐) |
| **HB3** | 🛠 할 일 API | `GET/POST /todos` · `GET/PATCH/DELETE /todos/{id}` + SQLite + 알맞은 상태 코드 + 입력 검사 + CORS. 그리고 **웹 교과서의 할 일 앱(WB2)** 이 localStorage 대신 이 API 를 쓰게 바꾸기(같은 화면이 서버와 대화) | `TestClient` 로 CRUD 한 바퀴(자동 검사) + 화면 연결(☐) |

### 챕터 4 · SDK — API 를 편하게 감싸기

| id | 제목 | 쪽 | 만들어 보기 |
| --- | --- | --- | --- |
| H13 | SDK 란: requests 코드 vs SDK 코드 | ① 같은 일(내 저장소 목록)을 `requests`(주소 · 헤더 · 페이지 넘기기 · 에러 직접)와 **SDK**(`PyGithub`: `Github(auth=...).get_user().get_repos()`)로 나란히 — SDK 가 숨겨 준 것 표 · ② SDK 의 모양: 클라이언트 객체 · 자원별 메서드 · 결과는 객체 · 에러는 예외 · ③ 공식 SDK vs 커뮤니티 SDK · 문서와 버전 · SDK 가 없으면 HTTP 로 | PyGithub 로 HB2 보고서를 다시(☐) · 「SDK 가 대신 해 준 것」 고르기(자동 검사) |
| H14 | 내 SDK 만들기 1: 클래스로 감싸기 | ① `class TodoClient:` — `__init__(base_url, token=None)` · 안에 `requests.Session` · ② 메서드 하나 = 엔드포인트 하나: `list()` · `get(id)` · `create(text)` · `update(id, ...)` · `delete(id)` · ③ 에러를 **내 예외**로: 404 → `TodoNotFound` · 422 → `ValidationError` · 그 밖 → `APIError(status, 내용)` | HB3 의 할 일 API 를 감싼 `TodoClient`(서버를 띄워 자동 검사) |
| H15 | 내 SDK 만들기 2: 숨겨 주는 것들 | ① 타임아웃 · 재시도(레슨 8 규칙)를 SDK 안에 — 쓰는 사람은 모름 · ② 페이지 넘기기를 **제너레이터**로: `for todo in client.iter_all():` · ③ 결과를 딕셔너리 대신 `@dataclass Todo` 로 · 타입 힌트 · docstring(VS Code 에 설명이 뜸) | `iter_all()` 이 페이지를 넘겨 전부 주는지 · 5xx 를 두 번 받고 세 번째에 성공하면 결과를 주는지(자동 검사 — 가짜 서버) |
| H16 | 패키지로 묶어 쓰고 나눠 주기 | ① 폴더 구조(`todo_sdk/__init__.py` · `client.py` · `errors.py`) · `pyproject.toml` 몇 줄 · `python -m pip install -e .` 로 다른 폴더에서 `import todo_sdk` · ② 버전(0.1.0 → 0.2.0)과 바뀐 점 적기 · README 의 「빠른 시작」 3줄 · GitHub 에 올리기(GitHub 교과서 링크) · ③ (선택) **진짜 회사의 SDK 맛보기**: LLM API 의 공식 파이썬 SDK 도 똑같이 「클라이언트 → 메서드 → 결과 객체 → 예외」 — 유료 키라서 코드 읽기 위주(T7 · T11 예고) | 내 SDK 를 다른 폴더에서 설치해 쓰기(☐) |
| **HB4** | 🛠 할 일 SDK 와 명령 줄 프로그램 | HB3 의 API 에 대한 SDK `todo_sdk`(클래스 · 내 예외 · 재시도 · `iter_all` · dataclass) + 그걸 쓰는 명령 줄 프로그램 `todo add 장보기` · `todo list` · `todo done 3`(`argparse`) — 서버(HB3) · SDK · 프로그램 세 겹이 다 내 것 | 자동 검사(서버를 띄워 SDK 와 프로그램을 돌림) + ☐ |

> 레슨 수: H0~H16 = 17 + 만들어 보기 4 = **21**.

## 6. 「만들어 보기」 모양과 검사

- 모양은 다른 교과서와 같음: 문장 문제 · **필요한 문법/명령**(실제 코드 — `requests.get(url, params=..., timeout=10)` · `@app.post("/todos", status_code=201)` · `class TodoClient:`) · 입력/출력 예 · 예시 답 · ☐.
- **검사 원칙: CI 는 인터넷의 API 를 부르지 않아요**(공개 API 가 느리거나 바뀌면 CI 가 빨개지니까). 그래서 문제를 둘로 나눠요.
  - **진짜 API 를 부르는 문제**(챕터 1·2 의 `curl` · httpbin · GitHub · Open-Meteo): `noRun` + ☐(「이렇게 나오면 성공」 예시 출력은 2026-11 에 실제로 받은 모양).
  - **로직 문제**: 응답 JSON · 상태 코드 · 헤더를 **인자로 받는 함수**로 만들게 하고, 가짜 응답으로 자동 검사(check_book 이 python3 로 실행 — 지금 운영체제 교과서와 같은 방식).
  - **서버 · SDK 문제**(챕터 3·4): FastAPI 의 `TestClient` 로 서버를 프로세스 없이 불러 자동 검사 · SDK 는 검사 때 그 서버를 `uvicorn` 으로 잠깐 띄워 실제로 부름. CI 에 `fastapi` · `httpx` · `uvicorn` 설치 한 줄 추가(`.github/workflows` 의 verify).
- `BOOK.check = 'api'`(새): 파이썬 실행 + noRun 은 ☐ 필수 + 도구 상자는 실행 안 함(운영체제 교과서의 `'os'` 와 같은 규칙).

## 7. 시작하기 · 도감 · 허브

- **시작하기 2쪽**: ① 준비물(VS Code + 파이썬 = 파이썬 교과서 시작하기, `requests` 설치, `curl --version`) ② 이 교과서 쓰는 법(공개 API 는 바뀔 수 있음 · 키는 코드 밖 · 「진짜로 부르는 문제」 와 「자동 검사 문제」 의 차이).
- **도감**: 「HTTP·API 도감」 — 쪽 제목을 실제 코드/명령으로(`curl -v`, `requests.get`, `res.raise_for_status()`, `Authorization: Bearer`, `@app.get`, `HTTPException`, `class TodoClient`). 도구 상자 = 상태 코드 표 · 자주 쓰는 헤더 · `curl` 옵션(`-v -i -L -X -H -d`).
- **허브**: 「코스」 칸, 웹 카드 다음. 카드 「🔌 HTTP·API·SDK · 📖 교과서 · 읽은 레슨 n/21 · 남의 API 부르기 → 내 API 만들기 → 내 SDK 만들기」. `CONFIG.COURSES` 에 `book: true`(공용 아님 — 코스 순서: 파이썬 → … → 웹 → HTTP·API·SDK).

## 8. 만들 순서 (구현 계획)

1. ✅ **v2.27.0** `courses/api/` 뼈대(content.js · book.js · course.json · index.html) + 허브 카드 + `check_book` 의 `'api'` 검사 + regress 절 + **시작하기 + 챕터 1(H0~H4 · HB1)**. 응답 예는 httpbin 을 로컬로 띄워 실제로 받은 모양(작업 환경에서 공개 API 가 막혀 있었음). ✅ **v2.27.1 챕터 2(H5~H9 · HB2)**.
2. ✅ 웹 교과서 챕터 6 바꾸기 — 사용자 「일단 웹만」 으로 웹 v2.26.0 에서 먼저 함(그래서 v2.26.0~v2.27.0 사이 HTTP 설명이 잠시 없었음).
3. ✅ **v2.28.0** 챕터 3(H10~H12 · HB3) — CI(ci.yml check_book 단계)에 `fastapi` · `httpx` 설치 + `TestClient` 검사.
4. ✅ **v2.28.1** 챕터 4(H13~H16 · HB4) — SDK 검사는 서버를 띄우는 대신 FastAPI `TestClient` 를 SDK 의 `session` 으로 주입(포트 · 네트워크 없이 같은 코드 경로) · PyGithub 는 ☐(토큰 필요). **교과서 완성.**
5. 단계마다: 공식 문서(requests · FastAPI · GitHub REST · Open-Meteo)로 대조 · 폰 390/PC QA(`tools/qa_screens.py api`) · 문서(site-intent 코스 표 · TODO · CHANGELOG · HANDOFF).

## 9. 정한 것과 이유 (기술적 선택 — Claude 결정)

| 무엇 | 정한 것 | 이유 |
| --- | --- | --- |
| 한 교과서로 묶는 줄기 | HTTP(말) → API(약속) → SDK(감싼 라이브러리), 그리고 **남의 것 쓰기 → 내 것 만들기** | 사용자 「서로 연결되니까 같이」. 끝에서 서버 · SDK · 프로그램이 모두 내 것이 되면 세 겹이 한 번에 이어짐 |
| 연습 언어 | 파이썬(`requests` · FastAPI) + `curl` · 브라우저 F12 | 파이썬은 이미 배웠고 SDK 를 클래스로 만드는 데 알맞음. `curl -v` 는 HTTP 글자를 가장 날것으로 보여 줌 |
| 연습 API | httpbin(되돌려 줌) · jsonplaceholder(가짜 REST) · Open-Meteo(키 없음) · GitHub(진짜 인증 · 페이지 · 한도) | 모두 무료. 앞의 셋은 가입 없이, GitHub 는 이미 GitHub 교과서에서 만든 계정 |
| 서버 프레임워크 | **FastAPI** (Flask 대신) | `/docs` 에 API 문서가 저절로 생겨 레슨 9 「문서 읽기」 와 이어지고, 타입 힌트 · Pydantic 으로 입력 검사(422)가 저절로 됨 — 초보자가 「상태 코드 · 검사」 를 눈으로 봄. `TestClient` 로 CI 검사가 쉬움 |
| 실제 SDK 예 | **PyGithub**(GitHub API 의 파이썬 SDK, 커뮤니티 제작) | 챕터 2 에서 `requests` 로 부른 바로 그 GitHub API 라 「같은 일을 SDK 로」 비교가 바로 됨. 무료. 공식/커뮤니티 SDK 차이도 이걸로 설명 |
| 유료 SDK(LLM) | 레슨 16 끝 「선택 · 코드 읽기 위주」 | 무료 교육 원칙(교육을 돈 받지 않음)과 별개로 학습자에게 요금이 나가지 않게. 깊은 내용은 T7 · T11 |
| CI 검사 | 인터넷 API 는 부르지 않고 ☐, 로직 · 서버 · SDK 는 자동 | 공개 API 가 바뀌거나 느려도 CI 가 빨개지지 않게. 서버·SDK 는 내 PC 와 같은 코드로 진짜 실행 |
| 레슨 id · 폴더 | `H0`~`H16` · `HB1`~`HB4` · `courses/api/` | `A`(알고리즘) · `W`(웹)와 안 겹치고 「HTTP」 의 H |
| 웹 교과서와의 순서 | (처음 계획) 이 교과서 챕터 1·2 를 먼저 → (실제) 사용자 「일단 웹만」 으로 웹을 먼저 끝내고 바로 이 교과서 | 사이트에서 HTTP 내용이 비는 때를 짧게 — 웹 v2.26.0 다음 릴리스가 바로 이 교과서 챕터 1 |
