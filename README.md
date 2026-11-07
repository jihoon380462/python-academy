# 파이썬 아카데미

사용자 본인이 쓰는 초보자용 학습 사이트. 여러 코스가 한 허브에 모이는 구조다. 빌드 없이 GitHub Pages 로 배포한다.

- 사이트(허브): https://jihoon380462.github.io/python-academy/
- **무엇이 정상이고 무엇이 버그인가는 [`specs/site-intent.md`](specs/site-intent.md)** — QA·새 세션은 이것부터 읽는다.

## 코스

| 코스 | 주소 | 모드 | 연습 도구 |
| --- | --- | --- | --- |
| 파이썬 | `/courses/python/` | 📖 교과서 · 레슨 45 | VS Code + 파이썬 |
| 알고리즘·자료구조 | `/courses/algo/` | 📖 교과서 · 레슨 36(👀 그림으로 보기) | VS Code + 파이썬 |
| 터미널·Git | `/courses/terminal-git/` | 📖 교과서 · 레슨 20 | Git Bash |
| GitHub | `/courses/github/` | 📖 교과서 · 레슨 22 | 내 GitHub 계정 + Git Bash |
| 데이터베이스(SQL) | `/courses/sql/` | 📖 교과서 · 레슨 17 | DB Browser for SQLite |
| 웹 | `/courses/web/` | 📖 교과서 · 레슨 34(HTML · CSS · JS) | VS Code + Live Server + 브라우저 |
| HTTP·API·SDK | `/courses/api/` | 📖 교과서 · 레슨 16/21(챕터 1~3, 만드는 중) | VS Code + 파이썬 requests + curl + 브라우저 F12 |
| Vim 에디터 (공용) | `/courses/vim/` | 📖 교과서 · 레슨 14 | gVim + 파이썬 |
| 리눅스(우분투) (공용) | `/courses/linux/` | 📖 교과서 · 레슨 18(챕터 3) | VirtualBox 7.2 + Ubuntu 26.04 LTS |
| 운영체제 (공용) | `/courses/os/` | 📖 교과서 · 레슨 21 | 우분투 VM 안의 python3 |
| 수학 공간 (공용) | `/courses/math/` | 📖 교과서 · 레슨 45(그림 만지기) | 브라우저 그림 + VS Code + 파이썬 |

- **교과서**: 설명을 읽고, 레슨 끝 「🛠 만들어 보기」 를 내 컴퓨터에서 직접 만든다. 채점·XP·잠금은 없다. 문제마다 「필요한 문법」(실제 코드 모양 + 그 레슨으로 가는 링크)이 있고, 코스마다 도감이 있다. ← → 키로 쪽을 넘긴다.
- 예전 문제집 화면(문제 풀기·채점·XP·뱃지·복습·가짜 터미널)은 v2.19.0 에 사이트에서 빼서 **`archive/classic/`** 에 보관했다(사이트는 안 불러옴). 되돌리는 법은 `archive/classic/README.md`.

## 폴더

| 폴더 | 내용 |
| --- | --- |
| `index.html` · `core/hub.js` | 허브(메인 화면) |
| `core/` | 공통 바탕 — 교과서 화면 `ui-views-book.js` · 설정·용어집·시작 `app.js` · 만들어 보기 모양 `book-derive.js` · UI 공통 `ui-core.js` · 저장 `storage.js`·`sync.js` · `config.js`(`APP_VERSION`·`COURSES`) · 알고리즘 그림 `visualize.js`+`runners/python.js` · 수학 그림 `figure.js`+`ui-views-math.js` |
| `courses/<id>/` | 코스 페이지(`index.html`) · 콘텐츠(`content.js`) · 교과서 데이터(`book.js`) |
| `shared/` | 에러 사전 · 용어집 |
| `archive/classic/` | 보관: 예전 문제집 화면의 코드·그림·옛 문제·검사 도구(v2.19.0 까지, 사이트는 안 불러옴) |
| `tools/` | 검사·도구(아래) |
| `specs/` | 지시서 — 사이트 의도 · 코스 설계 · 작업 규칙 (끝난 것은 `specs/archive/`) |
| `docs/` | 설계 결정 `DESIGN.md` · 확장 지시서 `EXPANSION.md` · QA 기록 `QA.md` (끝난 기록은 `docs/archive/`, 그림 요청서는 `archive/classic/docs-IMAGES.md`) |
| `qa-reports/` | QA 채팅이 직접 플레이하고 올린 보고서 |
| `python_academy.html` | 예전 주소(v1) → 파이썬 코스로 넘겨 주는 파일 |

맨 위의 문서: `HANDOFF.md`(상태판 · 인수인계) · `TODO.md`(지금 할 일) · `CHANGELOG.md`(버전별 변경).

## 작업 방법

- 새 세션은 **`specs/site-intent.md` → `HANDOFF.md` → `TODO.md`** 순서로 읽는다.
- 화면을 바꾸면 `core/config.js` 의 `APP_VERSION` 을 올리고 `node tools/stamp.mjs` (모든 `?v=` 와 `sw.js` 캐시 목록 갱신).
- 푸시 전 검사(Actions `verify` 와 같음):
  ```bash
  node tools/validate_content.mjs && node tools/check_level.mjs --gate && node tools/check_nesting.mjs
  node tools/check_book.mjs                       # 교과서: 예시 답·예제 실행, 「필요한 문법」, 옛 문구
  node tools/extract.mjs tools/.out && python3 tools/run_solutions.py
  python3 tools/regress.py && python3 tools/run_web_solutions.py   # Playwright
  ```
- 저장은 브라우저 localStorage 의 `academy.*` 조각(스키마 v2). v1 키(`python_academy_save`)는 첫 실행에 자동 이전되고 `academy.backup.v1` 에 보관된다.
