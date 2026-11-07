# HANDOFF — 다음 작업 세션 인수인계

> 새 채팅은 **「HANDOFF.md 읽고 TODO 대로 진행」** 으로 시작한다. 읽는 순서: **이 파일 → [`specs/site-intent.md`](specs/site-intent.md)(무엇이 정상·버그인가) → [`TODO.md`](TODO.md)(지금 할 일 · 예정 코스)**.
> 2026-11-06 v2.17.1 시점에 다시 썼고, 2026-11-07 v2.28.1 시점에 최신화했다(사용자 「HANDOFF.md 와 TODO.md 최신화」). 그 전 내용은 [`docs/archive/HANDOFF-2026-11-06-old.md`](docs/archive/HANDOFF-2026-11-06-old.md)(권한·머지 규칙 등이 지금과 다름). 버전별로 무엇이 바뀌었는지는 [`CHANGELOG.md`](CHANGELOG.md).

## 0. 상태판 (배포할 때마다 갱신)

| 항목 | 내용 |
| --- | --- |
| **현재 버전** | **v2.31.0 배포**(새 어셈블리어 교과서 — 공용 · 레슨 21, x86-64 NASM · 우분투). 버전별 내용은 [`CHANGELOG.md`](CHANGELOG.md) |
| **마지막 작업** | (Opus, 11/7) **어셈블리어 교과서 T10** 을 한 번에(사용자 「1」 → 추천 어셈블리어): 설계 `specs/asm-course.md` · 뼈대 · 검사 도구 `tools/asm_book_run.py`(nasm · ld 또는 gcc -no-pie 로 진짜 빌드 · 실행, CI 에 nasm) → 레슨은 **서브 에이전트 6개가 worktree 에서 동시에**(공통 지침 + 공용 `print_int` 를 미리 정해 둠) → Opus 가 합치고 검수. 합치기는 git 충돌 풀기 대신 **레슨 id 로 꺼내 넣기**(에이전트 커밋의 그 레슨 객체 · 만들어 보기 키만 가져옴 — 충돌 없음). 그 전에 파이썬 58 완성(v2.29.0 · v2.30.0) |
| **다음 후보** | ① 다음 공용 코스(사용자가 고를 것): T1 CS · T11 LLM 기초 · N9 수학 「상」(후순위) · 코스 T3~T7 — 같은 병렬 방식으로 ② 공개 API 가 열린 곳에서 HTTP·API·SDK 응답 예 대조 |
| **막힌 것** | 없음 |

## 1. 이게 뭔가

- **파이썬 아카데미**: 사용자(jihoon380462) **본인이 쓰는** 초보자용 학습 사이트. 허브 + 코스 페이지, 빌드 없음, GitHub Pages.
  - 사이트: https://jihoon380462.github.io/python-academy/ · 저장소: `github.com/jihoon380462/python-academy`(public)
  - main 에 머지 → Actions 「Deploy to GitHub Pages」(verify 통과 시) + 「pages build and deployment」 → 1~2분 뒤 반영.
- **무료 교육** = 교육(콘텐츠)을 돈 받지 않고 제공한다는 뜻일 뿐. 계정·설치·외부 도구·AI 서비스를 막는 규칙이 아니다(사용자 정정 11/3).
- **교과서 방향(11/6, 사용자 결정)**: 반복 문제·채점·XP 로는 혼자 만드는 힘이 안 생긴다 → **코스는 「교과서」**.
  - 레슨 = 설명(한 쪽 = 기능 하나) → 레슨 끝 **「🛠 만들어 보기」**(문장으로 된 과제 + **「필요한 문법」 = 실제 코드 모양** + 그 레슨으로 가는 링크 + 예시 답).
  - 연습은 **사용자 PC 의 진짜 도구**(VS Code · Git Bash · DB Browser · gVim · 진짜 GitHub 계정). 채점·XP·잠금 없음. 실전은 오픈북 → 코스마다 **도감**.
  - 꼭 해야 하는 설정은 **「먼저 꼭 할 것」 경고**(`BOOK.meta.prereq`). ← → 키로 쪽 넘기기.
- **코스 현황**: 교과서 12개(파이썬 58 · 어셈블리어 21 · 알고리즘 36 · 터미널·Git 20 · GitHub 22 · SQL 17 · 웹 34 · HTTP·API·SDK 21 · 공용 Vim 14 · 공용 수학 45 · 공용 리눅스 18 · 공용 운영체제 21) — 문제집 코스 없음(v2.18.0). 코스별 모드·도구·정상 동작 표는 `specs/site-intent.md` 2절, 폴더 구조는 `README.md`.
- **권한 구분 없음**(11/6 「권한 전부 없애라」): Opus·Fable 모두 core·버전·stamp·PR·**main 머지(배포)까지 직접**(「이제 너가 직접 머지 해라」). 「core 라서 못 한다」 식으로 미루지 않는다.

## 2. 작업 순서 (한 번의 배포)

1. `git checkout main && git pull` → 브랜치(`git checkout -b <이름>`).
2. 고치기. 화면이 바뀌면 `core/config.js` 의 **`APP_VERSION` 을 올리고** `node tools/stamp.mjs`(모든 `?v=` · `sw.js` 미리 캐시 목록). 허브 카드의 레슨 수·문구는 `CONFIG.COURSES`(`lessons` · `bookNote` · `short`)에 손으로 — 교과서 레슨 수를 바꾸면 같은 PR 에서.
3. 검사 전부(= CI `verify`, 명령은 `README.md` 「작업 방법」 · 설명은 `specs/site-intent.md` 7절). `python3 tools/regress.py` 끝 줄 **FAILS 0**.
4. **QA 를 직접**: Playwright 로 휴대폰 390 · PC 1440 화면을 찍어 **눈으로** 보기(가로 넘침 · pageerror 0), 「이 시점의 초보자가 따라 할 수 있나」. 사이트 전체(또는 코스 몇 개)는 **`python3 tools/qa_screens.py --out /tmp/qa_pc`**(PC) · `--w 390 --h 844`(폰) · `--theme light` · `--font 3` — 모든 쪽을 열어 대비·글자 크기·누를 곳·가로 넘침을 재고 캡처를 남긴다(쓰는 법은 파일 맨 위 주석, `specs/qa-team.md`).
5. 문서: **이 파일 0절 상태판** + `CHANGELOG.md` 새 항목(+ 바뀐 규칙이면 `specs/site-intent.md`, 할 일이면 `TODO.md`).
6. 커밋(끝에 세션 지침의 Co-Authored-By · Claude-Session 줄) → push → PR(본문 끝에 🤖 Generated with Claude Code 줄 + 세션 주소). **도구**: `gh` CLI 가 있으면 `gh api repos/jihoon380462/python-academy/pulls …`, 클라우드 세션(claude.ai/code)이면 GitHub MCP 도구(`create_pull_request` · `pull_request_read`(get_check_runs) · `merge_pull_request`(squash, `expectedHeadSha` 40자) · `actions_list`).
7. **사용자에게 「CI 기다리는 중」 이라고 먼저 말하고** check-run `verify` 가 success 될 때까지 기다림(클라우드 세션은 `subscribe_pr_activity` 로 CI 결과가 저절로 옴 — 기다리며 다음 챕터를 미리 만들어 둬도 됨, 단 커밋은 머지 뒤) → squash 머지. 빨가면 로그(`get_job_logs`)로 원인을 찾아 고쳐 push(예: v2.28.1 은 CI 에 `requests` 가 없어 실패 → ci.yml 설치 줄에 더함).
8. main 의 새 SHA 로 배포 run(「Deploy to GitHub Pages」)이 success 인지 확인 → 작업 브랜치를 main 으로 되돌림(`git checkout -B <브랜치> origin/main`). 같은 이름의 원격 브랜치에 squash 전 커밋이 남아 있으면 force push 대신 `git merge -s ours origin/<브랜치>` 로 이어 붙이고 push(클라우드 세션은 force push 가 막혀 있음).
9. 사용자에게: 무엇이 바뀌었나(짧게) + **다음 선택지 목록**.

## 3. 사용자의 작업 선호 (반복해서 지적한 것 — 꼭 지키기)

- **답은 항상 한국어**(영어로 답하면 강하게 항의함 — 최종 보고도).
- 하기 전에 **무엇을 왜** 할지 먼저. 오래 걸리면 중간중간 무엇을 하는 중인지 짧게 알리기(작업 사이 글이 안 보이는 환경이면 보이는 메시지로). 무엇을 기다리는 중이면 **기다린다고 먼저 말하기**.
- 작업 중 들어온 질문에는 **바로** 답하기. 문제를 지적하면 「원래 그렇다」로 넘기지 말고 **원인을 실제로 분석**.
- 한 단계가 끝나면 「뭐 할까요?」가 아니라 **다음 선택지 목록**. 단 **같은 원인의 나머지는 묻지 말고 이어서 끝내기**(미루면 잊힌다고 지적).
- **기술적인 설계 선택은 묻지 말고 정해서 진행**(11/7 「굳이 나한테 물어보는 이유가 뭔데」): 예제를 어떻게 보여 줄지 · 그림 종류 · 검사 방법 같은 건 Claude 가 정하고 「무엇을 왜」 만 알림. 묻는 건 사용자만 정할 수 있는 것(다음 코스 · 사이트 방향)뿐. 물을 때도 **「Q2」 같은 번호만 쓰지 말고 질문 내용을 그대로**(「Q 숫자로 하면 내가 알아들을 수 있다고 생각하냐」).
- **다른 화면으로 보내는 버튼에는 반드시 돌아오는 버튼**(Claude 가 자주 잊는다고 지적).
- **배포 전 QA 를 다방면으로 직접**(폰 390 · PC). 문제를 일일이 설명하게 하지 말 것.
- 설정·설치 안내는 값만이 아니라 **어느 화면 → 어느 탭/섹션 → 어느 칸**까지. 화면 이름은 공식 문서·실제 화면과 대조(GitHub 은 docs.github.com 의 `data/reusables`).
- 「필요한 문법」 등은 지어낸 별명이 아니라 **실제 문법(코드)**. 설명 없이 새 문법이 튀어나오지 않게.
- 「약 N분」 같은 사람마다 다른 표시는 넣지 않는다. 「일단 완성하는 게 목표니까 필수 사항은 강조하고 계속 다음 진행」(11/6).
- 비밀값(토큰·키)은 절대 커밋하지 않는다.

## 4. 교과서 코스 구조 (새 교과서를 만들 때)

- 파일: `courses/<id>/content.js`(COURSE · CHAPTERS · LESSONS — 레슨 `pages` 가 본문) + **`book.js`**(전역 `BOOK`) + `course.json` + `index.html`(스크립트 순서는 다른 코스 index.html 그대로 복사). 화면은 `core/ui-views-book.js`(마지막에 로드), 설정·용어집·시작은 `core/app.js`, 문제 모양 파생은 `core/book-derive.js`(화면과 `check_book` 이 같이 씀).
- `BOOK` 의 주요 칸: `meta`(prereq 경고 · labels · viz · `makeIntroBy`) · `setup`(시작하기 쪽) · `builtins`(도감 항목 `{name, desc, code, ref}`) · `tasks`(레슨별 만들어 보기 `{title, text, needs:[[코드, '레슨/쪽', 설명]], answer, io, check, setup, given, noRun, checks, outLabel}`) · `check`(검사 방식 `'vim' | 'sql' | 'web' | 'github' | 'linux' | 'os' | 'api'`, 없으면 파이썬 실행). `os` · `api` 는 파이썬 실행 + `noRun` 이면 ☐ 필수 + 도구 상자는 실행 안 함.
- 레슨 쪽 `example.code` 는 파이썬이면 `check_book` 이 실제로 실행해요. 인터넷이 필요하거나 실행하면 안 되는 것(curl · requests · 브라우저 JS · 터미널 명령)은 `example.shell` 에(보여 주기만). 웹 교과서 만들어 보기의 검사(`tools/run_web_solutions.py`)는 `checks` 에 화면 검사 · 동작(click · dblclick · input · key · submit · viewport) · `{ text, console: true }`(console.log 를 io 와 줄마다 비교).
- 검사: `node tools/check_book.mjs [코스]` 가 예시 답·본문 예제를 **진짜로 실행**(python3 · bash · SQLite · vim)해 출력 예와 비교하고, 「필요한 문법」 링크·단어, 옛 앱 문구, 거북이 `turtle.done()` 등을 본다(①~⑪, `specs/site-intent.md` 7절). 브라우저에서 확인하는 문제(`noRun`)는 `checks`(☐ 목록)가 있어야 한다.
- 허브: `CONFIG.COURSES` 에 `book: true` · `lessons` · `bookNote` · `short`(허브 안내 문구용 짧은 이름) · 공용 칸이면 `space: true`, `core/hub.js` 의 glyph, `CONFIG.COURSE_ID_PATTERNS`(읽은 레슨 세기).
- 설계 문서는 `specs/<코스>-course.md`(본보기 [`specs/github-course.md`](specs/github-course.md): 다른 코스와의 경계표 · 필수 경고 · 레슨표 · 화면 이름 출처).

## 5. 환경 메모 (작업 샌드박스)

- 파이썬은 `python3` 만 있다(`python` 없음) → 검사로 돌리는 셸 과제는 `python` 을 부르지 않게.
- 로컬 확인 서버: `cd <저장소> && python3 -m http.server 8766 --bind 127.0.0.1`. Playwright · Chromium 이 깔려 있음(`playwright install` 하지 말 것). `tools/qa_screens.py` · `regress.py` 는 `/usr/bin/google-chrome` 을 쓴다(파이썬 `playwright` 패키지가 없으면 `pip install playwright` 만).
- HTTP·API·SDK 교과서 검사에는 `pip install fastapi httpx requests`(CI 의 ci.yml 도 같은 줄). 클라우드 세션의 네트워크는 PyPI · npm 은 되지만 **httpbin.org · jsonplaceholder · open-meteo · api.github.com 같은 공개 API 는 막혀 있었음**(11/7) → 응답 모양은 httpbin 을 venv 에 깔아 로컬로 띄워 확인(`/tmp/hb/bin/gunicorn -b 127.0.0.1:8099 httpbin:app`).
- 사용자 PC 와 연결된 채팅이면 `mcp__remote-devices__*` 로 파일을 주고받을 수 있지만, 이 저장소 작업은 샌드박스의 clone(클라우드 세션은 `/home/user/python-academy`)에서 한다(새 채팅은 `add_repo` → clone → `register_repo_root`).
- CI 의 git 은 새 버전(2.48+)이라 출력이 다를 수 있다(예: `git branch -a` 의 `origin/HEAD` 줄, `ls` 정렬은 로캘 영향 → `git ls-files` 사용).
- 헤드리스에서는 CDN(Pyodide 등)을 못 받는 경우가 있어 regress 는 스텁으로 확인한다. 실제 실행 화면은 사용자가 브라우저에서 본다.

## 6. 데이터 규칙 (옛 문제 — 「만들어 보기」 의 재료)

- 수학: `courses/math/content.js` 맨 위 주석이 노드 스키마(노드 = 레슨 + `subtitle/level/stars/prereq/params[]`, `pages[0].figure` 필수 · `observe` 2~3개). 설계는 `docs/EXPANSION.md` 14절.
- 옛 문제 스키마는 `courses/python/content.js` 맨 위 주석(+ `docs/EXPANSION.md` 4절 확장 필드). `vary:{a:[lo,hi]}` 의 기본값은 lo. 테스트는 최소 2개, 마지막 1개 숨김.
- content.js 의 `PROBLEMS` 에는 **「만들어 보기」 가 `pid` 로 쓰는 문제만** 있다(v2.19.0). 나머지 옛 문제·타자 연습·가이드와 예전 문제집 화면 전체는 **`archive/classic/`**(사이트는 안 불러옴 · 되돌리기는 브랜치 `classic-v2.18.0` — `archive/classic/README.md`). 기기에 쌓인 옛 XP·뱃지 기록은 저장소에 그대로 둔다(지우지 않음).

## 7. 문서 지도

| 문서 | 용도 |
| --- | --- |
| `TODO.md` | 지금 할 일(1절) · 사용자 결정(3절) · **예정 코스**(남은 것: 공용 T1 CS · T10 어셈블리어 · T11 LLM, 코스 T3~T7) |
| `specs/site-intent.md` | 사이트 의도 · 코스별 정상 동작 · 자동 검사 — QA 기준 |
| `specs/workflow.md` · `specs/qa-team.md` | 작업 규칙 · QA 채팅 지시서(QA 는 직접 플레이 → `qa-reports/` 에 PR, 화면 검수 도구 `tools/qa_screens.py`) |
| `specs/python-course.md` | **파이썬 교과서 검토와 키우기 설계**(45 → 58, v2.29.0 · v2.30.0 으로 완성) |
| `specs/linux-course.md` · `specs/os-course.md` | 리눅스 교과서 설계(VirtualBox + 우분투 26.04, T2 운영체제 · T10 어셈블리어의 선수) · 운영체제 교과서 설계 |
| `specs/github-course.md` | GitHub 교과서 설계(새 코스 설계 문서의 본보기) |
| `specs/web-course.md` · `specs/http-api-course.md` | 웹 교과서(34레슨, 화면만) · HTTP·API·SDK 교과서(21레슨) 설계 — 둘 다 완성 |
| `docs/` | 설계 결정 · 확장 지시서(EXPANSION) · QA 기록 · **`VISUAL-REVIEW-2026-11-07.md`(N15 할 일 표)**, 끝난 기록은 `docs/archive/` |
| `archive/classic/` | 보관: 예전 문제집 화면(코드·그림·옛 문제·검사 도구) — `README.md` 에 무엇이 어디 있는지·되돌리는 법 |
