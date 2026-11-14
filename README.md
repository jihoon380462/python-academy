# 파이썬 아카데미

사용자 본인이 쓰는 초보자용 학습 사이트예요. 여러 교과서가 한 허브에 모여 있어요. 빌드 없이 GitHub Pages 로 배포해요.

- 사이트(허브): https://jihoon380462.github.io/python-academy/
- 무엇이 정상이고 무엇이 버그인지: [`specs/site-intent.md`](specs/site-intent.md)
- 지금 상태 · 작업 순서: [`HANDOFF.md`](HANDOFF.md)

## 코스

교과서 20개 · 레슨 495 (`core/config.js` 의 `COURSES`). 모두 📖 교과서예요. 순서는 허브 묶음 순서예요.

허브 맨 위 「🎓 필수교양」 에는 영어 단어장(`/vocab/`)이 있어요. 교과서가 아니라 Anki 방식 단어장이에요(설계 [`specs/vocab.md`](specs/vocab.md)).

| 묶음 | 코스 | 주소 | 레슨 | 연습 도구 |
| --- | --- | --- | --- | --- |
| 🐍 처음 시작 | 파이썬 | `/courses/python/` | 100 | VS Code + 파이썬 |
| 💪 파이썬 실력 키우기 | 디버깅·테스트 | `/courses/debug/` | 18 | VS Code + 파이썬 + pytest |
| 〃 | 객체지향·설계 | `/courses/oop/` | 17 | VS Code + 파이썬 |
| 〃 | AI와 협업 | `/courses/ai/` | 23 | VS Code + 파이썬 + 내가 쓰는 AI 도구 |
| 〃 | 알고리즘·자료구조 | `/courses/algo/` | 36 (👀 그림으로 보기) | VS Code + 파이썬 |
| 🛠 파이썬으로 만들기 | 데이터 파일 다루기 | `/courses/files/` | 18 | VS Code + 파이썬 + openpyxl |
| 〃 | 파이썬 업무 자동화 | `/courses/auto/` | 18 | VS Code + 파이썬 + pypdf · python-docx · reportlab |
| 🌐 웹과 서비스 | 웹 | `/courses/web/` | 34 (HTML · CSS · JS) | VS Code + Live Server + 브라우저 |
| 〃 | HTTP·API·SDK | `/courses/api/` | 21 (HTTP → requests → FastAPI → SDK) | VS Code + 파이썬 requests + curl + 브라우저 F12 |
| 〃 | 데이터베이스(SQL) | `/courses/sql/` | 17 | DB Browser for SQLite |
| 〃 | 데이터 분석 | `/courses/data/` | 18 | VS Code + 파이썬 + pandas · matplotlib |
| 〃 | AI·머신러닝 기초 | `/courses/ml/` | 16 | VS Code + 파이썬 + numpy · scikit-learn |
| 〃 | LLM 기초 | `/courses/llm/` | 20 | VS Code + 파이썬 + numpy |
| ⚙️ 컴퓨터 깊이 | CS | `/courses/cs/` | 23 | VS Code + 파이썬 |
| 〃 | 리눅스(우분투) | `/courses/linux/` | 18 (챕터 3) | VirtualBox 7.2 + Ubuntu 26.04 LTS |
| 〃 | 운영체제 | `/courses/os/` | 21 | 우분투 VM 안의 python3 |
| 〃 | 어셈블리어 | `/courses/asm/` | 21 | 우분투 VM 안의 nasm · ld · gcc · gdb |
| 🧰 개발 도구 (곁길) | 터미널·Git | `/courses/terminal-git/` | 20 | Git Bash |
| 〃 | GitHub | `/courses/github/` | 22 | 내 GitHub 계정 + Git Bash |
| 〃 | Vim 에디터 | `/courses/vim/` | 14 | gVim + 파이썬 |

### 교과서란

- 설명을 읽고, 레슨 끝 「🛠 만들어 보기」 를 내 컴퓨터에서 직접 만들어요.
- 채점 · XP · 잠금은 없어요.
- 문제마다 「필요한 문법」(실제 코드 모양 + 그 레슨으로 가는 링크)이 있어요.
- 코스마다 도감이 있어요.
- ← → 키로 쪽을 넘겨요.

### 예전 문제집 화면

- 문제 풀기 · 채점 · XP · 뱃지 · 복습 · 가짜 터미널 화면은 v2.19.0 에 사이트에서 뺐어요.
- **`archive/classic/`** 에 보관했고, 사이트는 안 불러요.
- 되돌리는 법: `archive/classic/README.md`

## 폴더

| 폴더 | 내용 |
| --- | --- |
| `index.html` · `core/hub.js` | 허브(메인 화면) |
| `core/` | 공통 바탕 (아래 목록) |
| `courses/<id>/` | 코스 페이지(`index.html`) · 콘텐츠(`content.js`) · 교과서 데이터(`book.js`) |
| `vocab/` | 영어 단어장(필수교양): 페이지 · 간격 계산 `fsrs.js` · 코어 `core.js` · 화면 `app.js` · 덱 `decks/` |
| `shared/` | 에러 사전 · 용어집 |
| `archive/classic/` | 보관: 예전 문제집 화면의 코드 · 그림 · 옛 문제 · 검사 도구(v2.19.0 까지, 사이트는 안 불러옴) |
| `tools/` | 검사 · 도구 (아래 「작업 방법」) |
| `specs/` | 지시서: 사이트 의도 · 코스 설계 · 작업 규칙. 끝난 것은 `specs/archive/` |
| `docs/` | 설계 결정 `DESIGN.md` · 확장 지시서 `EXPANSION.md` · QA 기록 `QA.md`. 끝난 기록은 `docs/archive/`, 그림 요청서는 `archive/classic/docs-IMAGES.md` |
| `qa-reports/` | QA 채팅이 직접 플레이하고 올린 보고서 |
| `python_academy.html` | 예전 주소(v1) → 파이썬 코스로 넘겨 주는 파일 |

`core/` 안
- 교과서 화면 `ui-views-book.js`
- 설정 · 용어집 · 시작 `app.js`
- 만들어 보기 모양 `book-derive.js`
- UI 공통 `ui-core.js`
- 저장 `storage.js` · `sync.js`
- 설정값 `config.js` (`APP_VERSION` · `COURSES`)
- 알고리즘 그림 `visualize.js` + `runners/python.js`
- 교과서 그림 `figure.js` + `ui-views-math.js`(운영체제 교과서가 써요 — 수학 교과서는 v2.48.0 에 지웠어요)

맨 위의 문서

| 문서 | 내용 |
| --- | --- |
| `CLAUDE.md` | Claude Code 가 세션마다 읽는 안내 |
| `HANDOFF.md` | 상태판 · 인수인계 · 작업 순서 |
| `TODO.md` | 지금 할 일 · 사용자 결정 기록 |
| `LESSON.md` | 실패 기록 |
| `CHANGELOG.md` | 버전별 변경 |

## 작업 방법

- 새 세션은 `CLAUDE.md` 가 알려 주는 순서로 읽어요. 개발 방은 `LESSON.md` → `HANDOFF.md` → `TODO.md` 예요.
- 화면을 바꾸면 `core/config.js` 의 `APP_VERSION` 을 올리고 `node tools/stamp.mjs` 를 돌려요. 모든 `?v=` 와 `sw.js` 캐시 목록이 바뀌어요.
- 푸시 전 검사 (Actions `verify` 와 같아요)
  ```bash
  node tools/validate_content.mjs && node tools/check_level.mjs --gate && node tools/check_nesting.mjs
  node tools/check_vocab.mjs && node tools/test_vocab.mjs   # 영어 단어장: 덱 데이터 모양 · 코어 단위 검사
  node tools/check_book_par.mjs                   # 교과서: 예시 답 · 예제 실행, 「필요한 문법」, 옛 문구 (교과서마다 동시에)
  node tools/extract.mjs tools/.out && python3 tools/run_solutions.py
  python3 tools/regress.py && python3 tools/run_web_solutions.py   # Playwright
  ```
  - 교과서 하나만: `node tools/check_book.mjs <코스>`
  - CI 가 까는 파이썬 패키지: `tools/requirements-ci.txt` · `tools/requirements-regress.txt`
- 저장은 브라우저 localStorage 의 `academy.*` 조각이에요(스키마 v2).
  - v1 키(`python_academy_save`)는 첫 실행에 자동으로 옮겨지고 `academy.backup.v1` 에 보관돼요.
