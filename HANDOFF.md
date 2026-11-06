# HANDOFF — 다음 작업 세션 인수인계

> 새 채팅은 **「HANDOFF.md 읽고 TODO 대로 진행」** 으로 시작한다. 읽는 순서: **이 파일 → [`specs/site-intent.md`](specs/site-intent.md)(무엇이 정상·버그인가) → [`TODO.md`](TODO.md)(지금 할 일 · 예정 코스)**.
> 2026-11-06 v2.17.1 시점에 다시 썼다. 그 전 내용은 [`docs/archive/HANDOFF-2026-11-06-old.md`](docs/archive/HANDOFF-2026-11-06-old.md)(권한·머지 규칙 등이 지금과 다름).

## 0. 상태판 (배포할 때마다 갱신)

| 항목 | 내용 |
| --- | --- |
| **현재 버전** | **v2.18.0 배포**(수학 공간 → 교과서 — 이제 모든 코스가 교과서). 버전별 내용은 [`CHANGELOG.md`](CHANGELOG.md) |
| **마지막 작업** | (Opus, 11/7) **v2.17.2 N11** GitHub 교과서 교차 QA → **v2.18.0 N12 수학 교과서**(영역 = 챕터 목록 · 레슨 1~45 · 그림은 브라우저 · 만들어 보기 89개 VS Code · 옛 문제는 `?classic=1`) |
| **다음 후보** | 사용자 「순서대로」(11/7) 의 남은 것 — 번호 선택지로 보여 주기: ① **N13 안 쓰는 코드 정리**(이제 문제집 코스 0개 → XP·뱃지·채점·복습·지식 지도는 `?classic=1` 만 씀 — 지울지, classic 째 둘지 사용자 확인) ② N14 예정 코스 설계(순서는 사용자 선택) ③ N7·N8 알고리즘 잔여 |
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
- **코스 현황**: 교과서 8개(파이썬 45 · 알고리즘 32 · 터미널·Git 20 · GitHub 22 · SQL 17 · 웹 17 · 공용 Vim 14 · 공용 수학 45) — 문제집 코스 없음(v2.18.0). 코스별 모드·도구·정상 동작 표는 `specs/site-intent.md` 2절, 폴더 구조는 `README.md`.
- **권한 구분 없음**(11/6 「권한 전부 없애라」): Opus·Fable 모두 core·버전·stamp·PR·**main 머지(배포)까지 직접**(「이제 너가 직접 머지 해라」). 「core 라서 못 한다」 식으로 미루지 않는다.

## 2. 작업 순서 (한 번의 배포)

1. `git checkout main && git pull` → 브랜치(`git checkout -b <이름>`).
2. 고치기. 화면이 바뀌면 `core/config.js` 의 **`APP_VERSION` 을 올리고** `node tools/stamp.mjs`(모든 `?v=` · `sw.js` 미리 캐시 목록). 허브 카드의 레슨 수·문구는 `CONFIG.COURSES`(`lessons` · `bookNote` · `short`)에 손으로 — 교과서 레슨 수를 바꾸면 같은 PR 에서.
3. 검사 전부(= CI `verify`, 명령은 `README.md` 「작업 방법」 · 설명은 `specs/site-intent.md` 7절). `python3 tools/regress.py` 끝 줄 **FAILS 0**.
4. **QA 를 직접**: Playwright 로 휴대폰 390 · PC 1280 화면을 찍어 **눈으로** 보기(가로 넘침 · pageerror 0), 「이 시점의 초보자가 따라 할 수 있나」.
5. 문서: **이 파일 0절 상태판** + `CHANGELOG.md` 새 항목(+ 바뀐 규칙이면 `specs/site-intent.md`, 할 일이면 `TODO.md`).
6. 커밋(끝에 세션 지침의 Co-Authored-By · Claude-Session 줄) → push → `gh api repos/jihoon380462/python-academy/pulls -f title=… -f head=… -f base=main -f body=…`(본문 끝에 🤖 Generated with Claude Code 줄 + 세션 주소).
7. **사용자에게 「CI 기다리는 중」 이라고 먼저 말하고** check-run `verify` 가 success 될 때까지 기다림 → `gh api -X PUT …/pulls/<n>/merge -f merge_method=squash`.
8. main 의 새 SHA 로 두 배포 run(「Deploy to GitHub Pages」 · 「pages build and deployment」)이 success 인지 확인 → `git checkout main && git reset --hard origin/main`.
9. 사용자에게: 무엇이 바뀌었나(짧게) + **다음 선택지 목록**.

## 3. 사용자의 작업 선호 (반복해서 지적한 것 — 꼭 지키기)

- **답은 항상 한국어**(영어로 답하면 강하게 항의함 — 최종 보고도).
- 하기 전에 **무엇을 왜** 할지 먼저. 오래 걸리면 **진행률 %** 를 보이는 메시지로(SendUserMessage — 작업 사이 글은 사용자에게 안 보임). 무엇을 기다리는 중이면 **기다린다고 먼저 말하기**.
- 작업 중 들어온 질문에는 **바로** 답하기. 문제를 지적하면 「원래 그렇다」로 넘기지 말고 **원인을 실제로 분석**.
- 한 단계가 끝나면 「뭐 할까요?」가 아니라 **다음 선택지 목록**. 단 **같은 원인의 나머지는 묻지 말고 이어서 끝내기**(미루면 잊힌다고 지적).
- **다른 화면으로 보내는 버튼에는 반드시 돌아오는 버튼**(Claude 가 자주 잊는다고 지적).
- **배포 전 QA 를 다방면으로 직접**(폰 390 · PC). 문제를 일일이 설명하게 하지 말 것.
- 설정·설치 안내는 값만이 아니라 **어느 화면 → 어느 탭/섹션 → 어느 칸**까지. 화면 이름은 공식 문서·실제 화면과 대조(GitHub 은 docs.github.com 의 `data/reusables`).
- 「필요한 문법」 등은 지어낸 별명이 아니라 **실제 문법(코드)**. 설명 없이 새 문법이 튀어나오지 않게.
- 「약 N분」 같은 사람마다 다른 표시는 넣지 않는다. 「일단 완성하는 게 목표니까 필수 사항은 강조하고 계속 다음 진행」(11/6).
- 비밀값(토큰·키)은 절대 커밋하지 않는다.

## 4. 교과서 코스 구조 (새 교과서를 만들 때)

- 파일: `courses/<id>/content.js`(COURSE · CHAPTERS · LESSONS — 레슨 `pages` 가 본문) + **`book.js`**(전역 `BOOK`) + `course.json` + `index.html`. 화면은 `core/ui-views-book.js`(마지막에 로드), 문제 모양 파생은 `core/book-derive.js`(화면과 `check_book` 이 같이 씀).
- `BOOK` 의 주요 칸: `meta`(prereq 경고 · labels · viz) · `setup`(시작하기 쪽) · `builtins`(도감 항목 `{name, desc, code, ref}`) · `tasks`(레슨별 만들어 보기 `{title, text, needs:[[코드, '레슨/쪽', 설명]], answer, io, check, setup, noRun, checks}`) · `check`(검사 방식 `'vim' | 'sql' | 'web' | 'github'`, 없으면 파이썬 실행).
- 검사: `node tools/check_book.mjs [코스]` 가 예시 답·본문 예제를 **진짜로 실행**(python3 · bash · SQLite · vim)해 출력 예와 비교하고, 「필요한 문법」 링크·단어, 옛 앱 문구, 거북이 `turtle.done()` 등을 본다(①~⑪, `specs/site-intent.md` 7절). 브라우저에서 확인하는 문제(`noRun`)는 `checks`(☐ 목록)가 있어야 한다.
- 허브: `CONFIG.COURSES` 에 `book: true` · `lessons` · `bookNote` · `short`(허브 안내 문구용 짧은 이름) · 공용 칸이면 `space: true`, `core/hub.js` 의 glyph, `CONFIG.COURSE_ID_PATTERNS`(읽은 레슨 세기).
- 설계 문서는 `specs/<코스>-course.md`(본보기 [`specs/github-course.md`](specs/github-course.md): 다른 코스와의 경계표 · 필수 경고 · 레슨표 · 화면 이름 출처).

## 5. 환경 메모 (작업 샌드박스)

- 파이썬은 `python3` 만 있다(`python` 없음) → 검사로 돌리는 셸 과제는 `python` 을 부르지 않게.
- 로컬 확인 서버: `cd <저장소> && python3 -m http.server 8766 --bind 127.0.0.1`. Playwright · Chromium 이 깔려 있음(`playwright install` 하지 말 것).
- CI 의 git 은 새 버전(2.48+)이라 출력이 다를 수 있다(예: `git branch -a` 의 `origin/HEAD` 줄, `ls` 정렬은 로캘 영향 → `git ls-files` 사용).
- 헤드리스에서는 CDN(Pyodide 등)을 못 받는 경우가 있어 regress 는 스텁으로 확인한다. 실제 실행 화면은 사용자가 브라우저에서 본다.

## 6. 데이터 규칙 (문제집 코스 · 옛 문제 — 수학 공간과 `?classic=1` 화면)

- 수학 공간: `courses/math/content.js` 맨 위 주석이 노드·문제 스키마(노드 = 레슨 + `subtitle/level/stars/prereq/params[]`, `pages[0].figure` 필수, 문제 `quiz kind:'explore'` · `num answer:{value,tol,unit,why}` …). 설계는 `docs/EXPANSION.md` 14절.
- 옛 문제 스키마는 `courses/python/content.js` 맨 위 주석(+ `docs/EXPANSION.md` 4절 확장 필드). `vary:{a:[lo,hi]}` 의 기본값은 lo. 테스트는 최소 2개, 마지막 1개 숨김.
- 교과서 화면의 옛 문제집 화면은 주소 끝 `?classic=1`(검수 대상 아님 — `specs/site-intent.md`).

## 7. 문서 지도

| 문서 | 용도 |
| --- | --- |
| `TODO.md` | 지금 할 일(1절) · 사용자 결정(3절) · **예정 코스**(공용 5 + 코스 5, 설계 전) |
| `specs/site-intent.md` | 사이트 의도 · 코스별 정상 동작 · 자동 검사 — QA 기준 |
| `specs/workflow.md` · `specs/qa-team.md` | 작업 규칙 · QA 채팅 지시서(QA 는 직접 플레이 → `qa-reports/` 에 PR) |
| `specs/github-course.md` | GitHub 교과서 설계(새 코스 설계 문서의 본보기) |
| `docs/` | 설계 결정 · 확장 지시서(EXPANSION) · 그림 요청서(IMAGES) · QA 기록, 끝난 기록은 `docs/archive/` |
