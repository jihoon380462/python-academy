# HANDOFF — 다음 작업 세션 인수인계

개발 방이 일을 이어받을 때 읽는 문서예요. 지금 상태 · 배포 순서 · 작업 규칙 · 교과서 구조 · 환경 · 문서 지도가 있어요.

- 새 채팅은 CLAUDE.md 를 읽으라는 한마디로 시작해요. `CLAUDE.md` 가 방에 따라 무엇을 읽을지 알려 줘요.
- 개발 방이 읽는 순서
  1. [`LESSON.md`](LESSON.md) — 실패 기록. 1절 작업 전 점검표
  2. 이 파일
  3. [`specs/site-intent.md`](specs/site-intent.md) — 무엇이 정상이고 무엇이 버그인가
  4. [`TODO.md`](TODO.md) — 지금 할 일
- 파이썬 QA 방은 [`specs/qa-python.md`](specs/qa-python.md) 를 읽어요.
- 이력
  - 11/6 v2.17.1 시점에 다시 썼어요. 그 전 내용(권한 · 머지 규칙 등이 지금과 다름): [`docs/archive/HANDOFF-2026-11-06-old.md`](docs/archive/HANDOFF-2026-11-06-old.md)
  - 11/8 v2.43.1 시점에 최신화했어요. 새 방에서 CLAUDE.md 만 읽어도 일을 이어받게 하라는 사용자 요청이었어요.
  - 버전별 변경: [`CHANGELOG.md`](CHANGELOG.md)

## 0. 상태판 (배포할 때마다 갱신)

| 항목 | 값 |
| --- | --- |
| **배포된 버전** | **v2.46.5** |
| 교과서 | 21개 · 레슨 540 |
| 영어 단어장(필수교양) | 뼈대 · 코어 · 아는 단어 넘기기 · 기초 덱 2,833개(어른 기준) · 속어 · 거친 말 덱 296개(진행은 [`specs/vocab.md`](specs/vocab.md) 0절 표) |
| **다음 할 일** | 개발 방은 **영어 단어장 듣기 · 개발 단어 덱**([`specs/vocab.md`](specs/vocab.md) 6절 W2 · W3), 그다음 크롤링(`crawl`) 교과서 |
| 사용자 결정 대기 | 2건 ([`TODO.md`](TODO.md) 1-2) |
| 막힌 것 | 영어 단어장의 간격 계산을 참조 구현과 실행해서 대조하는 일(W0) — 덱 채우기는 안 막혀요([`specs/vocab.md`](specs/vocab.md) 8절) |

### 최근 배포

| 버전 | 무엇 |
| --- | --- |
| v2.46.5 | 영어 단어장: 새 덱 「속어 · 거친 말」 296개(읽기 + 듣기, 들을 가능성 × 위험 순, 사용자 요청 D29) · 예문 굵게 보이기 고침 · 전후 대조 도구 |
| v2.46.4 | 영어 단어장: 기초 덱 2,833개 완성 · 덱 전체를 어른 기준으로 다시 씀(비틀린 뜻 약 250개 · 속어 뜻, 사용자 지적 D29) · 모든 페이지 아이콘 줄(콘솔 404) |
| v2.46.3 | 영어 단어장: 기초 덱 차례 201 ~ 1400(파일 6개, 덱 1,400개) — 파일마다 쓰는 에이전트 + 다른 모델의 검수, 검수로 93개 고침 · 예문 겹침 · `?v=` 검사 |
| v2.46.2 | 영어 단어장: 기초 덱 차례 41 ~ 200 을 채워 첫 파일(`base-0001.js`, 1 ~ 200) 완성(덱 210개) · 두 번째 읽기(검수)에서 나온 11곳 고침 · 지시서 품질 기준 · 검수 항목 보강 |
| v2.46.1 | 영어 단어장: 아는 단어 한꺼번에 넘기기(덱 개요의 버튼) · 기초 덱 차례 1 ~ 40(덱 50개) · 기초 덱 파일을 차례 200개씩 나누고 틀을 만드는 도구(`vocab_base_order.mjs --status` · `--file`) · 차례표의 녹취 표시 낱말 고침 · 지시서에 본보기와 검수 절차(지시서만 준 작업자로 시험) |
| v2.46.0 | 허브 맨 위 「필수교양」 묶음 + 영어 단어장 뼈대 · 코어(`vocab/`): Anki 방식 화면 · FSRS-6 간격 · 복습 기록 저장과 기기 연동 합치기 · 기초 단어 표본 10개 · 단어 목록 원문과 차례표(`vocab/sources/`) · 검사(`test_vocab` · `check_vocab` · 회귀) · 지시서 `specs/vocab.md` |
| v2.45.0 | AI와 협업에 챕터 4 「하네스 꾸리기」(레슨 Z13~Z18 + 만들어 보기 ZB4, 16 → 23): 에이전트 루프 · 지침 파일 · 컨텍스트 · 훅 · 권한 · 서브에이전트. 내용은 Claude Code 공식 문서와 대조 |
| v2.44.2 | 파이썬 챕터 2 보스(B2) 만들어 보기 1번 문제 글을 풀어 씀 |
| v2.44.1 | 파이썬 QA 2회차 반영: 판정 230줄(실수 122 고침 · 의도 81 · 오판 0) · Git 설명(L16D) · 보스 · 실전 문제 글 목록화 · `validate_content` 문서 버전 · 숫자 검사 |
| v2.44.0 | 파이썬 QA 보고 222항목 판정 · 실수 175 고침(막힘 11 전부) · 칩 528곳 줄바꿈 · 운영체제 끊긴 코드 6곳 · `check_book` ⑭~⑰ |
| v2.43.2 | 사용자 말 인용 지우기(문서 · 주석 · PR 설명) · 문서를 읽기 쉽게 다시 쓰기 · 수학 M4_ease 설명(옛 QA #147) |
| v2.43.1 | 레슨 15 「못 찾으면 -1」 설명을 단계대로 |
| v2.43.0 | 파이썬 교과서 검토 반영: 빠진 문법 넷 보강 · 객체지향 · 디버깅의 겹침을 복습으로 · 두 코스는 파이썬 챕터 5 뒤부터 · AI와 협업을 「파이썬 실력 키우기」 로 |
| v2.42.1 | 허브 묶음 순서를 학습 로드맵(`specs/roadmap.md`)대로: 주 길 → 갈래 → 곁길(개발 도구) · 리눅스는 컴퓨터 깊이로 · 알고리즘 카드 「모의고사 10문제」 · 카드 글 검사 |
| v2.42.0 | 새 교과서 「파이썬 업무 자동화」(`auto`, 18 레슨) · 모든 교과서의 만들어 보기 = 챕터 복습(5~10문제, 239 → 439) · `check_level` 이 교과서 문제도 잼(13 교과서 모두 0) |
| v2.41.1 | 괄호 3겹 줄 정리(교과서 아홉 + 파이썬 예시 답) · 검사 빈틈 막기(`check_nesting` 대상 12개 · book.js 예시 답 · `check_level` 기준선) |
| v2.41.0 | 새 교과서 「데이터 파일 다루기: JSON · 엑셀」(`files`, 18 레슨) · 준비 파일 여러 개 · `datasets.js` · 만들어 보기 링크 버그 |
| v2.40.0 | 허브를 목적별 7묶음으로 · 파이썬 다음 코스 6개 설계(`specs/courses-python-next.md`) |
| v2.39.0 | CI 줄이기(작업 셋 동시에 · `tools/check_book_par.mjs` · `REGRESS_WAIT_SCALE`) · 도감 검색 버그 |
| v2.38.0 | 파이썬 교과서 **100 레슨**(챕터 8 ~ 11 더함, 문제 412, 설계 `specs/python-100.md`) |

- 그 전: v2.37.0 은 67 레슨(타입 힌트 두 레슨 등). 손보기 1 · 2 · 3단계는 v2.34.0 ~ v2.36.0(검토 `specs/python-review.md`).
- 자세한 내용은 [`CHANGELOG.md`](CHANGELOG.md).

### 마지막 작업 (11/12)

- 영어 단어장 뼈대 · 코어 (v2.46.0). 사용자 결정 D27 · D28.
- 같은 날 v2.46.1: 단어 넣기를 다음 작업자에게 넘길 준비를 했어요 — 아는 단어 한꺼번에 넘기기 화면, 덱 파일 틀을 만드는 도구, 지시서의 본보기와 검수 절차.
  - 지시서만 준 에이전트에게 첫 40단어를 시험 삼아 채우게 했고(약 3분), 결과를 전부 읽어 검수해 덱에 넣었어요. 그때 나온 헷갈린 곳은 지시서에 반영했어요(LESSON.md R17).
  - 다음 작업자는 `base-0001.js` 의 41번부터 이어서 채우면 돼요.
- v2.46.2: 그 41 ~ 200번을 채워 첫 파일을 끝냈어요(`base-0001.js`). 쓴 쪽과 다른 에이전트가 두 번째 읽기를 했고 지적 11개를 모두 반영했어요(LESSON.md R18).
- v2.46.3: 차례 201 ~ 1400(파일 6개)을 넣었어요. 파일마다 쓰는 에이전트가 채우고 다른 모델의 에이전트가 검수했어요. 합치는 사람(Claude)이 지적을 확인하고 바뀐 노트를 전후 대조했어요.
  - 여럿에게 나눠 맡기는 법은 `specs/vocab.md` 7절 「나눠 맡기」. 이번에 쓴 순서: 쓰기(파일마다 에이전트 하나, 따로 뗀 작업 폴더) → 다른 모델의 검수(읽기만) → 쓴 쪽이 반영 → 합치는 사람이 대조 · 가져오기.
- v2.46.4: 기초 덱 2,833개를 다 채웠어요. 사용자가 짚어서 덱 전체를 어른 기준으로 다시 썼어요(비틀린 뜻 약 250개 · 속어 뜻 — LESSON.md U13 · 결정 D29).
- v2.46.5: 「속어 · 거친 말」 덱 296개를 넣었어요(목록 → 셋이 나눠 쓰기 → 다른 모델 검수 → 반영을 `tools/vocab_diff.mjs` 로 대조 → 합치기).
  - 다음은 듣기 · 개발 단어 덱(`specs/vocab.md` W2 · W3).
- 덱 채우기는 지시서 [`specs/vocab.md`](specs/vocab.md)로 넘겼어요. 덱 파일만 쓰면 되고 코어는 건드리지 않아요. 시작은 `node tools/vocab_base_order.mjs --status`.
- 기초 덱의 재료(단어 목록 원문 · 배우는 차례표)는 `vocab/sources/` 에 넣어 두었어요. 덱 채우기에 네트워크가 필요 없어요.
- 끝내지 못한 것 하나는 `CHANGELOG.md` v2.46.0 의 「못 한 것」 에 있어요(참조 구현과의 실행 대조).

### 그 전 작업 (Opus, 11/8)

차례대로 했어요. 자세히는 CHANGELOG.

1. 업무 자동화 교과서 (v2.42.0)
2. 모든 만들어 보기 = 챕터 복습(5~10문제)
3. 레벨 검사가 교과서 문제도 잼
4. 실패 기록 `LESSON.md` · `CLAUDE.md`
5. 학습 로드맵 `specs/roadmap.md` 와 허브 순서 (v2.42.1)
6. GitHub 자체 페이지 빌드 실패 고침(`.nojekyll`)
7. `TODO.md` 다시 쓰기
8. 파이썬 교과서 검토 (v2.43.0)
9. 레슨 15 설명 (v2.43.1)
10. 파이썬 QA 보고 검토 · 반영 (v2.44.0) — 판정은 `qa-reports/2026-11-08-python/review/README.md`
11. 파이썬 QA 2회차 검토 · 반영 (v2.44.1) — 판정은 `qa-reports/2026-11-09-python/review/README.md`

### 다음 후보

- **파이썬 QA 방**: 11/8 사용자 결정. Sonnet 방에서 파이썬 교과서만 검수해요(`specs/qa-python.md`). 1회차(11/8)는 v2.44.0 에, 2회차(11/9)는 v2.44.1 에 반영했어요. 다음 회차를 돌릴지는 사용자가 정해요.
- **개발 방 ①**: 영어 단어장 덱 채우기(`specs/vocab.md` 6절). 사용자가 영어를 프로그래밍보다 먼저로 정했어요(D27).
- **개발 방 ②**: 설계 순서대로 다음 코스를 만들어요(`specs/courses-python-next.md`).
  - 크롤링(`crawl`) → Flask → pygame → 파이썬 중급
- 사용자 결정 대기 2건: `TODO.md` 1-2

## 1. 이게 뭔가

### 사이트

- **파이썬 아카데미**: 사용자(jihoon380462) **본인이 쓰는** 초보자용 학습 사이트예요.
- 허브 + 코스 페이지. 빌드 없이 GitHub Pages 로 배포해요.
- 사이트: https://jihoon380462.github.io/python-academy/
- 저장소: `github.com/jihoon380462/python-academy` (**public**)
  - 배포가 저장소 폴더 전체를 올려서, 문서도 사이트 주소에서 열려요.
- 배포 흐름: main 에 머지 → Actions 두 개가 돌아요 → 1~2분 뒤 반영
  - 「Deploy to GitHub Pages」 (verify 통과 시)
  - 「pages build and deployment」 (GitHub 자체 빌드)

### 무료 교육의 뜻 (11/3 사용자 정정)

- 교육(콘텐츠)을 돈 받지 않고 준다는 뜻일 뿐이에요.
- 계정 · 설치 · 외부 도구 · AI 서비스를 막는 규칙이 아니에요.

### 교과서 방향 (11/6 사용자 결정)

- 반복 문제 · 채점 · XP 로는 혼자 만드는 힘이 안 생겨요. 그래서 **코스는 「교과서」** 예요.
- 레슨 = 설명 쪽들(한 쪽 = 기능 하나) → 레슨 끝 **「🛠 만들어 보기」**
  - 만들어 보기 = 문장으로 된 과제 + **「필요한 문법」**(실제 코드 모양 + 그 레슨으로 가는 링크) + 예시 답
- 연습은 **사용자 PC 의 진짜 도구**로 해요: VS Code · Git Bash · DB Browser · gVim · 진짜 GitHub 계정
- 채점 · XP · 잠금은 없어요.
- 실전은 오픈북이라 코스마다 **도감**이 있어요.
- 꼭 해야 하는 설정은 **「먼저 꼭 할 것」 경고**(`BOOK.meta.prereq`)로 달아요.
- ← → 키로 쪽을 넘겨요.

### 코스 현황

교과서 21개 · 레슨 540 (`core/config.js` 의 `COURSES`). 허브는 맨 위에 「필수교양」 을, 그 아래에 목적별 7묶음을 학습 로드맵 순서로 보여 줘요(근거 `specs/roadmap.md`).

| 순서 | 묶음 | 코스 (레슨 수) |
| --- | --- | --- |
| 0 | 🎓 필수교양 | 영어 단어장 — 교과서가 아니라 Anki 방식 덱이라 레슨 수가 없어요(v2.46.0, `specs/vocab.md`) |
| 1 | 🐍 처음 시작 | 파이썬 100 |
| 2 | 💪 파이썬 실력 키우기 | 디버깅·테스트 18 · 객체지향·설계 17 · AI와 협업 23 · 알고리즘 36 |
| 3 | 🛠 파이썬으로 만들기 | 데이터 파일 18 · 업무 자동화 18 |
| 4 | 🌐 웹과 서비스 | 웹 34 · HTTP·API·SDK 21 · SQL 17 |
| 5 | 📊 데이터와 AI | 수학 45 · 데이터 분석 18 · AI·머신러닝 16 · LLM 기초 20 |
| 6 | ⚙️ 컴퓨터 깊이 | CS 23 · 리눅스 18 · 운영체제 21 · 어셈블리어 21 |
| 7 | 🧰 개발 도구 (곁길) | 터미널·Git 20 · GitHub 22 · Vim 14 |

### 권한 구분 없음 (11/6 사용자 결정)

- Opus · Fable 모두 core · 버전 · stamp · PR · **main 머지(배포)까지 직접** 해요. 머지도 직접 하라는 사용자 지시가 있었어요.
- 「core 라서 못 한다」 식으로 미루지 않아요.

## 2. 작업 순서 (한 번의 배포)

1. **브랜치 만들기**: `git checkout main && git pull` → `git checkout -b <이름>`
2. **고치기**
   - 화면이 바뀌면 `core/config.js` 의 **`APP_VERSION` 을 올리고** `node tools/stamp.mjs` 를 돌려요(모든 `?v=` · `sw.js` 미리 캐시 목록).
   - 허브 카드의 레슨 수 · 문구는 `CONFIG.COURSES`(`lessons` · `bookNote` · `short`)에 손으로 적어요. 교과서 레슨 수를 바꾸면 같은 PR 에서 고쳐요.
3. **검사 전부** (= CI `verify`)
   - 명령은 `README.md` 「작업 방법」, 설명은 `specs/site-intent.md` 7절.
   - `python3 tools/regress.py` 끝 줄이 **FAILS 0** 이어야 해요.
4. **QA 를 직접**
   - Playwright 로 휴대폰 390 · PC 1440 화면을 찍어 **눈으로** 봐요. 가로 넘침 · pageerror 0.
   - 「이 시점의 초보자가 따라 할 수 있나」 를 봐요.
   - 사이트 전체나 코스 몇 개는 `tools/qa_screens.py` 로 모든 쪽을 열어 대비 · 글자 크기 · 누를 곳 · 가로 넘침을 재고 캡처를 남겨요.
     - PC: `python3 tools/qa_screens.py --out /tmp/qa_pc`
     - 폰: `--w 390 --h 844` · 라이트: `--theme light` · 큰 글자: `--font 3`
     - 쓰는 법: 파일 맨 위 주석, `specs/qa-team.md` 1절
5. **문서**
   - 이 파일 0절 상태판 + `CHANGELOG.md` 새 항목
   - 바뀐 규칙이면 `specs/site-intent.md`, 할 일이면 `TODO.md`
   - 이번 작업에 실패가 있었으면 **[`LESSON.md`](LESSON.md) 최신화** (CI 빨강 · 사용자 지적 · 검사가 놓친 것 · 도구가 깨뜨린 것)
6. **커밋 → push → PR**
   - 커밋 끝에 세션 지침의 Co-Authored-By · Claude-Session 줄
   - PR 본문 끝에 🤖 Generated with Claude Code 줄 + 세션 주소
   - 커밋 메시지 · PR 설명에 사용자 말을 따옴표로 옮기지 않아요(3절).
   - 도구
     - `gh` CLI 가 있으면 `gh api repos/jihoon380462/python-academy/pulls …`
     - 클라우드 세션(claude.ai/code)이면 GitHub MCP 도구: `create_pull_request` · `pull_request_read`(get_check_runs) · `merge_pull_request`(squash, `expectedHeadSha` 40자) · `actions_list`
7. **CI 기다리기 → 머지**
   - 사용자에게 **「CI 기다리는 중」 이라고 먼저 말해요.**
   - check-run `verify` 가 success 가 될 때까지 기다려요.
   - 클라우드 세션은 `subscribe_pr_activity` 로 CI 결과가 저절로 와요. 기다리며 다음 챕터를 미리 만들어 둬도 돼요(커밋은 머지 뒤).
   - success 면 squash 머지.
   - 빨가면 로그(`get_job_logs`)로 원인을 찾아 고쳐 push 해요. 예: v2.28.1 은 CI 에 `requests` 가 없어 실패 → ci.yml 설치 줄에 더함.
   - **그리고 같은 PR 에서 [`LESSON.md`](LESSON.md) 에 기록**해요(무슨 일 · 진짜 원인 · 막는 장치).
8. **배포 확인**
   - main 의 새 SHA 로 「Deploy to GitHub Pages」 가 success 인지 봐요.
   - **GitHub 자체 빌드 「pages build and deployment」 도 success 인지 같이** 봐요. v2.40.0 ~ v2.42.1 에 다섯 번 실패했는데 아무도 몰랐어요(LESSON.md R11).
   - 작업 브랜치를 main 으로 되돌려요: `git checkout -B <브랜치> origin/main`
   - 같은 이름의 원격 브랜치에 squash 전 커밋이 남아 있으면 force push 대신 `git merge -s ours origin/<브랜치>` 로 이어 붙이고 push 해요(클라우드 세션은 force push 가 막혀 있어요).
9. **사용자에게 보고**: 무엇이 바뀌었나(짧게) + **다음 선택지 목록**

## 3. 사용자의 작업 선호 (꼭 지키기)

언제 · 무엇을 잘못했는지는 [`LESSON.md`](LESSON.md) 2절에 있어요.

### 말하기

- **답은 항상 한국어.** 최종 보고 · 도구 사이 메모까지.
- 하기 전에 **무엇을 왜** 할지 먼저 말해요.
- 오래 걸리면 중간중간 무엇을 하는 중인지 짧게 알려요.
  - 작업 사이 글이 안 보이는 환경이면 보이는 메시지로.
  - 무엇을 기다리는 중이면 **기다린다고 먼저 말해요.**
  - 배포 전에 만든 것을 보고할 때는 **맨 앞에 「아직 사이트에는 없어요」** 를 적어요 (11/12, LESSON.md U12).
- 작업 중 들어온 질문에는 **바로** 답해요.
- **물은 것에만 답하기** (11/8). 「왜?」 에는 까닭만. 시키지 않은 일은 시작하지 않아요.
- **사용자가 내 글을 다 읽었다고 가정하지 않기** (11/8). 선택지 · 요약에는 앞 글을 안 읽어도 알게 한두 줄 설명을 붙여요.
- **사용자 말을 옮겨 적지 않기** (11/8). 저장소가 public 이고 사이트에서도 문서가 열려요.
  - **사용자가 채팅에서 한 말을 문서 · 코드 주석 · 커밋 메시지 · PR 설명에 따옴표로 옮기지 않아요.**
  - 요청 내용만 짧게 서술해요.

### 일하기

- 문제를 지적받으면 「원래 그렇다」 로 넘기지 말고 **원인을 실제로 분석**해요.
- **문제가 보이면 그 자리에서 고치고 나서 다음으로** (11/8, 개발 방 한정 — QA 방은 보고만). 「따로 할 일」 로 TODO 에 미루지 않아요.
- 한 단계가 끝나면 「뭐 할까요?」 가 아니라 **다음 선택지 목록**을 줘요.
  - 단 **같은 원인의 나머지는 묻지 말고 이어서 끝내요.** 미루면 잊혀요.
- **기술적인 설계 선택은 묻지 말고 정해서 진행** (11/7).
  - 예제를 어떻게 보여 줄지 · 그림 종류 · 검사 방법 같은 건 Claude 가 정하고 「무엇을 왜」 만 알려요.
  - 묻는 건 사용자만 정할 수 있는 것(다음 코스 · 사이트 방향)뿐이에요.
  - 물을 때도 **「Q2」 같은 번호만 쓰지 말고 질문 내용을 그대로** 적어요.
- **배포 전 QA 를 다방면으로 직접** 해요(폰 390 · PC). 사용자가 문제를 일일이 설명하게 하지 않아요.
  - 폰은 화면 폭만 줄이지 말고 기기 흉내(터치 · 기기 배율)로도 한 번 봐요 (11/12, LESSON.md U12).
- 비밀값(토큰 · 키)은 절대 커밋하지 않아요.

### 콘텐츠 만들기

- **다른 화면으로 보내는 버튼에는 반드시 돌아오는 버튼.** Claude 가 자주 잊는 것이에요.
- 설정 · 설치 안내는 값만이 아니라 **어느 화면 → 어느 탭/섹션 → 어느 칸**까지.
  - 화면 이름은 공식 문서 · 실제 화면과 대조해요. GitHub 은 docs.github.com 의 `data/reusables`.
- 「필요한 문법」 등은 지어낸 별명이 아니라 **실제 문법(코드)**.
- 설명 없이 새 문법이 튀어나오지 않게.
- 「약 N분」 같은 사람마다 다른 표시는 넣지 않아요.
- 필수 사항은 강조하고, 일단 완성을 목표로 계속 진행해요 (11/6).

## 4. 교과서 코스 구조 (새 교과서를 만들 때)

### 파일

- `courses/<id>/content.js`: COURSE · CHAPTERS · LESSONS. 레슨 `pages` 가 본문이에요.
- **`book.js`**: 전역 `BOOK`
- `course.json`
- `index.html`: 스크립트 순서는 다른 코스 index.html 을 그대로 복사해요.
- 화면 코드
  - `core/ui-views-book.js`: 교과서 화면(마지막에 로드)
  - `core/app.js`: 설정 · 용어집 · 시작
  - `core/book-derive.js`: 문제 모양 파생(화면과 `check_book` 이 같이 씀)

### `BOOK` 의 주요 칸

| 칸 | 내용 |
| --- | --- |
| `meta` | prereq 경고 · labels · viz · `makeIntroBy` |
| `setup` | 시작하기 쪽 |
| `builtins` | 도감 항목 `{name, desc, code, ref}` |
| `tasks` | 레슨별 만들어 보기(아래) |
| `check` | 검사 방식 `'vim' \| 'sql' \| 'web' \| 'github' \| 'linux' \| 'os' \| 'api'`. 없으면 파이썬 실행 |

- `tasks` 의 칸: `{title, text, needs:[[코드, '레슨/쪽', 설명]], answer, io, check, setup, given, noRun, checks, outLabel}`
- `os` · `api` 는 파이썬 실행이에요. `noRun` 이면 ☐ 필수이고 도구 상자는 실행하지 않아요.

### 예제

- 레슨 쪽 `example.code` 가 파이썬이면 `check_book` 이 실제로 실행해요.
- 인터넷이 필요하거나 실행하면 안 되는 것은 `example.shell` 에 넣어요(보여 주기만). 예: curl · requests · 브라우저 JS · 터미널 명령
- 웹 교과서 만들어 보기의 검사(`tools/run_web_solutions.py`)는 `checks` 에 넣어요.
  - 화면 검사
  - 동작: click · dblclick · input · key · submit · viewport
  - `{ text, console: true }`: console.log 를 io 와 줄마다 비교

### 준비 파일 (v2.41.0)

- 문제 `prep` 과 레슨 `example.prep` 은 `{ name, text, run?, fold? }` 하나나 배열이에요.
  - `name`: 하위 폴더도 돼요.
  - `run: true`: 만든 뒤 `python <name>` 을 한 번 실행해요. 엑셀처럼 글자가 아닌 파일을 스크립트로 만들 때 써요.
  - `fold: '…'`: 화면에서 접혀요.
- 코스 공통 데이터는 `courses/<id>/datasets.js` 에 둬요. index.html 에서 content.js 앞에 불러요. 본보기: `courses/files/`

### 검사

- `node tools/check_book.mjs [코스]`
  - 예시 답 · 본문 예제를 **진짜로 실행**(python3 · bash · SQLite · vim)해 출력 예와 비교해요.
  - 「필요한 문법」 링크 · 단어, 옛 앱 문구, 거북이 `turtle.done()` 등도 봐요.
  - 검사 번호 ①~⑰ 의 뜻: `specs/site-intent.md` 7절
  - 브라우저에서 확인하는 문제(`noRun`)는 `checks`(☐ 목록)가 있어야 해요.
- 빠르게 전부: `node tools/check_book_par.mjs` (v2.39.0, CI 도 이걸 써요)
  - 교과서마다 따로 띄워 CPU 수만큼 동시에 돌려요.
- 화면 검사 대기 줄이기: `REGRESS_WAIT_SCALE=0.25 python3 tools/regress.py`
  - CI 값이에요. 기본 1 = 예전 그대로.

### 허브

- `CONFIG.COURSES` 에 적을 것: `book: true` · `lessons` · `bookNote` · `short`(허브 안내 문구용 짧은 이름)
  - 옛 「공용」 칸 코스는 `space: true`
- `core/hub.js` 의 glyph
- `CONFIG.COURSE_ID_PATTERNS`: 읽은 레슨 세기

### 영어 단어장은 교과서가 아니에요 (v2.46.0 ~)

- 폴더는 `courses/` 가 아니라 `vocab/` 예요. `content.js` · `book.js` 가 없고, 위 검사(`check_book` 등)의 대상이 아니에요.
- 덱 데이터 · 간격 계산 · 저장 · 검사는 모두 [`specs/vocab.md`](specs/vocab.md)에 있어요.
- `CONFIG.COURSES` 에는 `deck: true` 로 들어 있어요. 문서의 「교과서 N개」 에는 세지 않아요.
- 단어장은 어른인 사용자 본인의 학습 자료예요. 주제가 민감하다는 이유로 뜻을 빼거나 예문을 억지 장면으로 돌리지 않아요. 가장 흔한 뜻을 사전처럼 사실대로 가르쳐요(LESSON.md U13).
- 무엇을 가르칠지 줄이는 기준(주제 · 수준 제한)은 Claude 가 정하지 않고 사용자에게 먼저 물어요.

### 설계 문서

- `specs/<코스>-course.md` 에 써요.
- 본보기: [`specs/github-course.md`](specs/github-course.md) — 다른 코스와의 경계표 · 필수 경고 · 레슨표 · 화면 이름 출처

## 5. 환경 메모 (작업 샌드박스)

- 파이썬은 `python3` 만 있어요(`python` 없음). 검사로 돌리는 셸 과제는 `python` 을 부르지 않게 써요.
- 로컬 확인 서버: `cd <저장소> && python3 -m http.server 8766 --bind 127.0.0.1`
- Playwright · Chromium 이 깔려 있어요. `playwright install` 은 하지 마요.
  - `tools/qa_screens.py` · `regress.py` 는 `/usr/bin/google-chrome` 을 써요.
  - 파이썬 `playwright` 패키지가 없으면 `pip install playwright` 만.
- HTTP·API·SDK 교과서 검사: `pip install fastapi httpx requests` (CI 는 `tools/requirements-ci.txt`)
- 클라우드 세션의 네트워크 (11/7 확인)
  - PyPI · npm 은 돼요.
  - httpbin.org · jsonplaceholder · open-meteo · api.github.com 같은 공개 API 는 막혀 있었어요.
  - 응답 모양은 httpbin 을 venv 에 깔아 로컬로 띄워 확인해요: `/tmp/hb/bin/gunicorn -b 127.0.0.1:8099 httpbin:app`
- 사용자 PC 와 연결된 채팅이면 `mcp__remote-devices__*` 로 파일을 주고받을 수 있어요.
  - 그래도 이 저장소 작업은 샌드박스의 clone 에서 해요. 클라우드 세션은 `/home/user/python-academy`.
  - 새 채팅은 `add_repo` → clone → `register_repo_root`.
- CI 의 git 은 새 버전(2.48+)이라 출력이 다를 수 있어요.
  - 예: `git branch -a` 의 `origin/HEAD` 줄
  - `ls` 정렬은 로캘 영향 → `git ls-files` 를 써요.
- 헤드리스에서는 CDN(Pyodide 등)을 못 받을 때가 있어 regress 는 스텁으로 확인해요. 실제 실행 화면은 사용자가 브라우저에서 봐요.

## 6. 데이터 규칙 (옛 문제 — 「만들어 보기」 의 재료)

- 수학: `courses/math/content.js` 맨 위 주석이 노드 스키마예요.
  - 노드 = 레슨 + `subtitle/level/stars/prereq/params[]`
  - `pages[0].figure` 필수 · `observe` 2~3개
  - 설계: `docs/EXPANSION.md` 14절
- 옛 문제 스키마: `courses/python/content.js` 맨 위 주석 (+ `docs/EXPANSION.md` 4절 확장 필드)
  - `vary:{a:[lo,hi]}` 의 기본값은 lo
  - 테스트는 최소 2개, 마지막 1개는 숨김
- content.js 의 `PROBLEMS` 에는 **「만들어 보기」 가 `pid` 로 쓰는 문제만** 있어요 (v2.19.0).
  - 나머지 옛 문제 · 타자 연습 · 가이드와 예전 문제집 화면 전체는 **`archive/classic/`** 에 있어요. 사이트는 안 불러요.
  - 되돌리기: 브랜치 `classic-v2.18.0` (`archive/classic/README.md`)
  - 기기에 쌓인 옛 XP · 뱃지 기록은 그대로 둬요(지우지 않음).

## 7. 문서 지도

| 문서 | 용도 |
| --- | --- |
| `CLAUDE.md` | Claude Code 가 세션마다 저절로 읽는 짧은 안내. 방 구분 · 꼭 지킬 것 |
| `.claude/settings.json` · `.claude/hooks/korean_reply.py` | 답하는 언어를 한국어로 고정하고, 영어로만 쓴 글이 있으면 답을 끝내지 못하게 막는 Stop 훅(LESSON U1) |
| **`LESSON.md`** | **실패 기록**(11/8 사용자 지시). 작업 전에 1절 점검표, 실패가 생기면 같은 PR 에서 최신화 |
| `TODO.md` | 남은 일(1절) · 사용자 결정 기록 D1~(2절) · 끝난 일 N · T(3절) |
| `specs/site-intent.md` | 사이트 의도 · 코스별 정상 동작 · 자동 검사. QA 기준 |
| **`specs/qa-python.md`** | **파이썬 교과서 QA 지시서**(11/8, 지금 것) |
| **`specs/vocab.md`** | **영어 단어장 설계와 지시서**(v2.46.0 · v2.46.1). 덱 채우기 순서와 도구 · 남은 일 · 노트 모양과 품질 기준 · 간격 계산과 저장 규칙 |
| `specs/roadmap.md` | **학습 로드맵**. 허브 묶음 순서가 이걸 따라요. 새 코스 · 「먼저 꼭」 을 바꾸면 같이 고쳐요 |
| `specs/courses-python-next.md` | 파이썬 다음 코스 6개 설계(데이터 파일 · 업무 자동화는 완성, 나머지 넷은 TODO 1-1) |
| `specs/workflow.md` | 옛 작업 분담 규칙(11/2 ~ 11/6). 지금 규칙은 이 파일 2 · 3절 |
| `specs/qa-team.md` | 옛 QA 지시서(v2.10 시절). `tools/qa_screens.py` 쓰는 법(1절)은 지금도 맞아요 |
| `specs/python-course.md` | 파이썬 교과서 검토와 키우기 설계(45 → 58, v2.29.0 · v2.30.0 으로 완성) |
| `specs/linux-course.md` | 리눅스 교과서 설계(VirtualBox + 우분투 26.04). 운영체제(T2) · 어셈블리어(T10)의 선수 |
| `specs/os-course.md` | 운영체제 교과서 설계 |
| `specs/github-course.md` | GitHub 교과서 설계. 새 코스 설계 문서의 본보기 |
| `specs/ai-harness.md` | AI와 협업 챕터 4 「하네스 꾸리기」 설계(레슨 Z13 ~ Z18 + 보스 ZB4). 공식 문서에서 확인한 사실표(F1 ~ F19) 포함. 만듦(v2.45.0) |
| `specs/web-course.md` · `specs/http-api-course.md` | 웹 교과서(34 레슨, 화면만) · HTTP·API·SDK 교과서(21 레슨) 설계. 둘 다 완성 |
| `docs/` | 설계 결정 · 확장 지시서(EXPANSION) · QA 기록 · `VISUAL-REVIEW-2026-11-07.md`(N15 기록, ✅ 끝남). 끝난 기록은 `docs/archive/` |
| `archive/classic/` | 보관: 예전 문제집 화면(코드 · 그림 · 옛 문제 · 검사 도구). `README.md` 에 무엇이 어디 있는지 · 되돌리는 법 |
