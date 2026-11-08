# 작업 분담 규칙 — Fable / Opus

Fable 과 Opus 채팅이 일을 나누던 때(11/2 ~ 11/6)의 규칙이에요.

## 지금 상태

- **대부분 낡았어요.** 지금 작업 순서 · 규칙은 [`HANDOFF.md`](../HANDOFF.md) 2 · 3절이에요.
- 지금도 맞는 것
  - 1절: 모델별 권한 구분이 없어요.
  - 5절: 같은 `core` 파일을 두 채팅이 동시에 고치지 않아요.
  - 8절 6: main 은 보호 브랜치라 PR + `verify` 초록 뒤에 머지돼요(`.github/workflows/ci.yml` 이 이 절을 가리켜요).
- 바뀐 것
  - 머지 · 배포는 이제 Claude 가 직접 해요(1절). 「머지는 사용자」 라고 적힌 곳은 옛 규칙이에요.
  - 팀 채팅 넷(7절) · 파도 계획(9절) · Fable 검토(4절)는 지금 쓰지 않아요.
  - 지금 방은 둘이에요: 개발 방 · 파이썬 QA 방 (`CLAUDE.md` 1절).
- 절 번호는 다른 문서가 「workflow 8절」 처럼 가리켜서 그대로 둬요(2절은 원래 없어요).

배경: Claude 요금제의 주간 한도가 「모든 모델」 과 「Fable 전용」 으로 나뉘어 있어요. Fable 한도가 먼저 바닥나지 않게 **일감을 Opus 에게도 나누려고** 만든 문서예요. 그때 개발 세션은 시작할 때 이 파일을 HANDOFF.md 다음으로 읽었어요.

## 1. 모델별 권한 — **없음** (11/6 사용자 결정)

- Opus 든 Fable 이든 **같아요.**
  - 콘텐츠 · 문서 · `core/` · `tools/` · 버전(`APP_VERSION`) · stamp · CHANGELOG 머리글 · HANDOFF 상태판 · 릴리스 PR — 전부 누구나 해요.
  - 「이건 core 라서」 「이건 Fable 작업이라서」 같은 말로 미루지 않아요.
  - 검토는 사용자가 원할 때만 해요.
- 유일한 제약은 GitHub 설정이에요(규칙이 아니라 사실).
  - main 은 보호 브랜치라 **PR + `verify` 체크(초록) 뒤 머지**해야 배포돼요.
  - **머지도 채팅이 직접 해요**(11/6 사용자 지시). `verify` 초록 + 로컬 QA 를 확인한 뒤 머지해요.
    - 옛 명령: `gh api -X PUT repos/jihoon380462/python-academy/pulls/<번호>/merge -f merge_method=merge`
    - 지금 방법(squash · MCP 도구)은 HANDOFF 2절 6 · 7.
  - 화면이 바뀌는 PR 은 **버전(APP_VERSION + `node tools/stamp.mjs`)을 같이 올려야** 폰 캐시가 갱신돼요(v2.7.1 교훈).
- 알아 둘 사실(금지가 아님)
  - 기존 문제 · 레슨 id 를 바꾸면 학습자 진행 기록이 그 문제에서 끊겨요.
  - `core/storage.js` · `sync.js` 의 저장 모양을 바꾸면 옛 저장을 읽는 코드를 같이 손봐야 해요.
- 어느 모델로 일을 맡길지는 사용자가 채팅의 모델을 골라서 정해요. 문서는 그 결정을 묻지 않아요.

## 3. Opus 개발 세션 규칙 (옛 규칙 — 지금은 HANDOFF 2 · 3절)

1. **시작**: 저장소를 최신으로 당기고(`git fetch` + `reset --hard origin/main`), HANDOFF.md → 이 파일 → 맡은 지시서 순서로 읽어요.
   - **main 에 직접 푸시하지 않아요.** 8절의 브랜치 · PR 규칙대로.
2. **범위**: 지시서에 적힌 파일만 고쳐요.
   - (옛) 지시서에 없는 `core/` 파일을 고쳐야 하면 멈추고 「Fable 검토 대상」 이라고 알렸어요. 11/6 부터는 권한 구분이 없어요(1절).
3. **검증**(푸시 전 필수): `node tools/validate_content.mjs && node tools/check_book.mjs && node tools/extract.mjs tools/.out && python3 tools/run_solutions.py`
   - 가능하면 `python3 tools/regress.py` 도. 전체 명령은 `README.md` 「작업 방법」.
4. **커밋 메시지**: `core/` 를 한 줄이라도 바꿨으면 맨 앞에 **`[core]`**. 콘텐츠만이면 표시 없음.
   - 예: `[core] v2.4.0: 터미널 러너 디스패치`
5. **문서**: HANDOFF 상태판 · CHANGELOG 는 같은 커밋에. 상태판 「마지막 작업」 에 **작업한 모델(Opus/Fable)** 을 괄호로 적어요.
6. **보고**: 버전, 바뀐 것 한 줄, 브라우저에서 확인할 곳(어느 화면 → 어느 문제), `[core]` 였는지.
7. **같은 문제의 나머지는 묻지 말고 이어서 끝내요**(11/6 사용자 지적 — 묻다가 다른 일을 먼저 하면 잊혀요).
   - 지적받은 문제와 같은 원인으로 다른 곳도 틀려 있으면 그 자리에서 전부 고쳐요.
     - 예: 「필요한 문법」 별명 → 쪽 제목 · 문제 제목도 별명
   - 선택지로 내미는 것은 **새 일**만.
   - (옛) 한 번에 못 끝내는 남은 일은 TODO.md 에 적었어요. 지금은 그 자리에서 고치고 다음으로 가요(HANDOFF 3절).
8. **다른 화면으로 보내는 버튼을 만들면 돌아오는 버튼도 같이**(11/6 사용자 지적 — Claude 가 자주 잊음. v2.8.x 「문제 → 목록」 때도 같은 지적).
   - 교과서 화면은 `params.back = { label, view, params }` 를 넘기고, 받는 화면이 맨 위에 「← label」 을 그려요(`core/ui-views-book.js` `backBar`).
   - regress 에 「갔다가 돌아오기」 검사를 같이 넣어요.

## 4. Fable 검토 체크리스트 (`[core]` 커밋만 — 지금은 안 씀)

`git log --oneline --grep "\[core\]"` 로 목록을 뽑고 커밋마다 봤어요.

- [ ] 다른 코스(파이썬 · 알고리즘)의 동작을 바꿨나 — 바뀐 함수의 호출처를 `grep`
- [ ] 저장 데이터 모양을 바꿨나 — 바꿨다면 예전 데이터가 그대로 읽히나
- [ ] 전역 이름 · 스크립트 로드 순서 · `?v=` 규칙을 지켰나
- [ ] 모바일 390px, 다크/라이트, 접근성 설정(고대비 · 아주 크게)에서 깨지지 않나 (`regress.py`)
- [ ] 지시서와 다르게 만든 부분이 docs/DESIGN.md 에 이유와 함께 적혀 있나

문제가 있으면 패치 커밋, 없으면 HANDOFF 상태판에 「Fable 검토 통과: 커밋 해시들」 한 줄.

## 5. 작업 순서는 HANDOFF 상태판이 기준

- 무엇을 먼저 할지는 HANDOFF.md 0절 「다음 후보」 가 정해요(이 파일에 적지 않아요).
- 순서를 정할 때 지킬 것
  - **같은 `core` 파일을 건드리는 작업 두 개를 동시에 두 채팅으로 돌리지 않아요.** 예: `core/engine.js` · `core/ui-views-main.js`. 하나를 배포한 뒤 다음을 시작해요.
  - 콘텐츠만 건드리는 작업(서로 다른 `courses/<id>/content.js`)은 동시에 돌려도 돼요. 푸시 직전에 다시 당겨요.
  - 지금은 개발 방 · 파이썬 QA 방이 동시에 돌 수 있어요. QA 방이 도는 동안 개발 방은 `courses/python` 을 고치지 않아요(`CLAUDE.md` 1절).

## 6. 버전 번호 (옛 기록)

- 문서들(docs/archive/NEXT.md, docs/EXPANSION.md 1절 표)에 적힌 마이너 번호는 **계획 당시의 순서 표시일 뿐**이에요.
- 실제 번호는 **먼저 배포되는 쪽이 다음 마이너를 가져가요.** 배포할 때 docs/archive/NEXT.md 표와 docs/EXPANSION.md 해당 줄을 실제 번호로 고쳤어요.
- 초기에 쓴 마이너: 2.0.0 Phase 0 · 2.1.0 알고리즘 · 2.2.0 실전 챕터 · 2.3.0 수학 공간 M1
  - 그때 다음 마이너(2.4.0)는 터미널·Git(WP-B)과 수학 M2 중 먼저 배포되는 쪽이었어요. 지금 버전은 HANDOFF 0절.

## 7. 팀 운영 — QA팀 · 콘텐츠팀 (11/2 사용자 결정 — 지금은 안 씀)

- Fable 세션(엔진 · 설계 · 검토 · 릴리스) 외에 **Opus 채팅 네 개를 팀처럼** 돌렸어요(QA → 유지보수, 콘텐츠, 아트).
- 각 팀은 자기 지시서를 읽고 1절 권한표 안에서만 일했어요. 같은 `core` 파일을 두 채팅이 동시에 건드리지 않았어요(5절).

| 팀 | 지시서 | 하는 일 | 산출물 |
| --- | --- | --- | --- |
| **QA팀** | `specs/qa-team.md` | 배포본을 실제로 플레이하며 버그 · 문구 · UX 문제를 재현 절차와 함께 기록. 콘텐츠 오류는 직접 고쳐 커밋 | `docs/QA.md` · 콘텐츠 패치 · `tools/regress.py` 체크 |
| **아트 검수 · 요청팀** | `specs/art-team.md` | docs/IMAGES.md 요청서 작성 · ChatGPT 납품 검수 · 통과분 2절 이동 | docs/IMAGES.md · `assets/img/` 정리 PR(`art/<차수>`) |
| **유지보수팀** | `specs/maintenance-team.md` | docs/QA.md 「열림」 항목을 재현 → 수정 → 확인 → 닫힘 | 수정 PR(`fix/<QA#>-<주제>`) · docs/QA.md 상태 · regress check |
| **콘텐츠팀** | `specs/content-team.md` | 기존 스키마 · 그림 종류 안에서 레슨 · 문제 · 힌트 · 용어 · 예제 추가와 품질 개선 | `courses/*/content.js` 커밋 + docs/archive/PROBLEMS.md · CHANGELOG · HANDOFF |

팀마다 못 하던 일
- QA팀: `core/` 설계 변경(→ docs/QA.md 에 「Fable 작업」 으로 표시)
- 아트팀: 그림 자리 새로 만들기(core) · 버전 · 캐시 stamp
- 유지보수팀: core 설계 변경(Fable) · 버전 · stamp · HANDOFF 상태판. 담당 `Fable` 인 항목은 재현 절차 · 원인 추정만 보강
- 콘텐츠팀: 새 문제 type · 새 그림 kind · `core/` 수정

공통 규칙
1. 시작할 때 `git fetch && git reset --hard origin/main`
2. **main 직접 푸시 금지** — 자기 브랜치에 올리고 PR(8절)
3. 검증 게이트(3절) 통과 없이는 PR 금지
4. 커밋 메시지 맨 앞에 `[qa]` 또는 `[content]`
5. `APP_VERSION` · `node tools/stamp.mjs` · HANDOFF 상태판은 **건드리지 않음**(릴리스 때 Fable 이 한 번에). Fable 은 열린 PR 목록(`gh pr list`)을 검토 · 병합.

Opus 채팅을 열 때 첫 메시지 (옛 복사용)
- QA팀: `저장소 github.com/jihoon380462/python-academy 를 당기고 HANDOFF.md → specs/workflow.md → specs/qa-team.md 순서로 읽은 뒤 qa-team.md 2절 체크리스트대로 1회전 QA를 시작해. 결과는 docs/QA.md에 기록하고 콘텐츠 오류는 고쳐서 [qa] 커밋으로 올려.`
- 콘텐츠팀 (11/5 저녁부터 이 한 줄): `jihoon380462/python-academy 저장소 연결하고 HANDOFF.md 읽고 TODO 에서 Opus 용 확인해`
  - Opus 는 `TODO.md` 「Opus 용」 표를 위에서부터, 상세는 `specs/content-team.md` 3절.
  - 한 과제 = 브랜치 `content/<과제>` = PR 하나, `[content]` 커밋.
  - core(`core/` · `tools/` · `index.html` · `sw.js`) · 버전 · stamp 는 건드리지 않고, 필요하면 HANDOFF 「Fable 요청」 줄에 적었어요.
  - 그 전 문구: `저장소 github.com/jihoon380462/python-academy 를 당기고 HANDOFF.md → specs/workflow.md → specs/content-team.md 순서로 읽은 뒤 content-team.md 3절의 첫 과제부터 시작해. [content] 커밋으로 올려.`
- 아트 검수 · 요청팀: `저장소 github.com/jihoon380462/python-academy 를 당기고 HANDOFF.md → specs/workflow.md → docs/IMAGES.md → specs/art-team.md 순서로 읽은 뒤 art-team.md 4절의 첫 과제(A0 전수 재검수)를 시작해. 결과는 docs/IMAGES.md 검수 메모에 적고 art/ 브랜치로 PR을 내. main 직접 푸시 금지.`
- 유지보수팀: `저장소 github.com/jihoon380462/python-academy 를 당기고 HANDOFF.md → specs/workflow.md → docs/QA.md → specs/maintenance-team.md 순서로 읽은 뒤 docs/QA.md의 「열림」 항목을 심각도 순으로 고쳐 fix/ 브랜치로 PR을 내. 담당이 Fable인 항목은 건드리지 말고 재현 절차만 보강해. main 직접 푸시 금지.`

그때의 예외
- **11/2 ~ 11/5 임시 예외**: Fable 한도 절약. 릴리스 당번과 위임된 `[core]` 항목은 `specs/archive/schedule-week.md` 0절 · 3절 · 4절을 따랐어요. 목요일에 Fable 이 전부 검토했어요.
- **단일 세션 모드**(11/2 16:40 사용자 결정): 팀을 채팅 네 개로 나누지 않고 **Opus 채팅 하나가 역할을 순서대로** 맡았어요.
  - 순서: 릴리스 당번 → 유지보수 → 콘텐츠 → 아트 → QA
  - 팀 지시서는 역할 설명으로 그대로 쓰고, 브랜치 · PR · 릴리스 규칙도 같았어요. 첫 메시지는 `specs/archive/schedule-week.md` 7절.

## 8. 브랜치 · PR 규칙 (11/2 — 머지 주체는 1절로 바뀜)

- 11/2 의 원칙: 「먼저 끝낸 쪽이 바로 배포」 금지.
- 11/6 부터 권한 구분이 없어요(1절). 릴리스 PR 은 누구나 내요.
  - 순서: 게이트 통과 → `APP_VERSION` 올림 → `node tools/stamp.mjs` → CHANGELOG `## 미배포` 항목을 `## vX.Y.Z — 날짜 (누가·무엇)` 머리글 아래로 → HANDOFF 0절 상태판 → `release/vX.Y.Z` PR → 사용자에게 보고
  - 버전: 콘텐츠만이면 패치 +1, core 가 바뀌면 마이너 +1. 겹쳐도 상관없어요. 나중에 머지되는 쪽이 `origin/main` 머지 뒤 다시 매겨요.
  - (옛) 그때는 머지(배포)를 사용자가 했어요. 지금은 Claude 가 해요(1절 · HANDOFF 2절).

1. **브랜치 이름**
   - `content/<과제>` (예 `content/C4-glossary`)
   - `qa/<날짜-주제>` (예 `qa/1102-round1`)
   - Opus core 작업은 `core/<주제>`
   - 시작: `git fetch origin && git switch -c content/C4-glossary origin/main`
2. **커밋**: 평소대로(`[content]` · `[qa]` · `[core]` 접두).
   - 작업 중엔 CHANGELOG 맨 위 `## 미배포` 절 아래에 항목만 더했어요(버전 머리글 없이). docs/archive/PROBLEMS.md 표 추가는 OK.
   - **릴리스 PR 을 낼 때**(7절 개정) `APP_VERSION` · stamp · CHANGELOG 머리글 · HANDOFF 상태판을 올려요.
3. **PR 열기**: `git push -u origin <브랜치>` → `gh pr create --base main --fill`
   - 제목 = 커밋 요약. 본문에 바뀐 것 · 확인한 화면 · 검증 결과.
   - 열면 `PR Check`(`.github/workflows/ci.yml`)가 자동으로 돌아요.
   - 빨간 PR 은 고쳐서 다시 푸시해요(같은 브랜치에 푸시하면 PR 이 갱신돼요).
4. **main 이 앞서 나갔으면** `git fetch origin && git rebase origin/main` 뒤 `git push --force-with-lease`.
   - 충돌은 자기 브랜치에서 풀어요.
   - 같은 `courses/<id>/content.js` 끝에 두 팀이 `push` 를 더했으면 둘 다 남기는 쪽으로 합쳐요.
   - 클라우드 세션은 force push 가 막혀 있어요(HANDOFF 2절 8).
5. **병합 · 릴리스 (옛 절차)**
   - `gh pr list` → 4절 체크리스트로 검토 → `gh pr merge <번호> --squash --delete-branch`
   - main 에서 **릴리스 커밋 한 번**: `APP_VERSION` 패치/마이너 올림 → `node tools/stamp.mjs` → CHANGELOG `## 미배포` 를 `## vX.Y.Z — 날짜` 로 → HANDOFF 상태판 → 푸시 → 배포 확인
   - 여러 PR 을 한 릴리스로 묶어도 됐어요.
6. **브랜치 보호** (사용자가 GitHub 에서 한 번 설정 — 지금도 걸려 있음)
   - 저장소 페이지 → **Settings** 탭 → 왼쪽 **Branches** → **Add branch ruleset**(또는 Add classic branch protection rule)
   - Branch name pattern `main`
   - 체크: **Require a pull request before merging**(승인 수 0 이어도 됨)
   - 체크: **Require status checks to pass before merging** → 검색창에 `verify` 입력해 선택
   - **Do not allow bypassing the above settings** 는 끈 채로 → Create
   - 이렇게 하면 실수로 `git push origin main` 해도 거부돼요.
   - 이 설정은 API 로 못 하고 소유자가 UI 에서 해야 해요.
7. **예외**: 아트 납품(ChatGPT) 커밋은 `assets/img/` · docs/IMAGES.md · 버전만 바꿔서 main 직접 푸시를 허용했어요.
   - 단 다른 PR 과 `APP_VERSION` 이 겹치지 않게 **아트 납품도 PR 로 올리는 걸 권장**했어요(`art/<차수>` 브랜치).

## 9. 파도(wave) 계획 — 병렬 처리 순서 (11/2 — 지금은 안 씀)

원칙
- **Fable 은 core 하나에 집중, 네 팀은 서로 다른 파일을 동시에, 릴리스는 하루 2번(오전 · 오후) 묶어서.**
- 충돌은 같은 `core` 파일과 같은 `content.js` 의 **같은 줄**에서만 나요.
- 파일 끝 추가(콘텐츠)와 기존 줄 수정(유지보수)은 같은 파일이어도 자동 병합돼요.

### 1차 파도

| 팀 | 일 | 건드리는 파일 | 전제 · 주의 |
| --- | --- | --- | --- |
| Fable | 수학 M2 core(surface · steps 그림, 영역 4 · 2 노드 골격, 식↔그림 색 동기화) + docs/QA.md Fable 담당 항목(#1~15 · #32) | `core/figure.js` `core/ui-views-math.js` `core/engine.js` `courses/math/content.js` | — |
| QA팀 | 2회전: v2.3.7 기준 알고리즘 · 수학 정적 전수 검사(퀴즈 ans · why · 수식 · 숫자 답). 블록 문제 · KaTeX · 모의고사 시간은 사용자 브라우저 확인 요청 | docs/QA.md | 릴리스 직후 시작이 효율적 |
| 유지보수팀 | docs/QA.md 「열림」 중 담당 `QA 수정` / `콘텐츠팀` / `유지보수` 항목(지문 · 정답 · 테스트 · 문구 · CSS 한 줄) | 기존 줄 수정 | **힌트 항목은 콘텐츠 C6 · C7 PR 병합 뒤에**(같은 줄 충돌 방지). `Fable` 담당은 재현 보강만 |
| 콘텐츠팀 | C6 파이썬 L9~L18 힌트, C7 알고 힌트, C8 알고 실전 연습 문제 | `courses/python` `courses/algo` | **수학 content.js 금지**(Fable M2 와 겹침) |
| 아트팀 | A0 완료본 90장 전수 재검수(라이트 32px 식별성) | docs/IMAGES.md | — |
| ChatGPT | 대기 | — | 6차 요청서(A1)까지 |

### 2차 파도 (M2 = v2.4.0 릴리스 뒤)

- Fable: 터미널·Git WP-B 4~5 또는 M3
- QA: 3회전(영역 4 · 2 집중)
- 유지보수: 2회전 항목
- 콘텐츠: C9 + 수학 영역 4 · 2 보강 노드(기존 그림 종류만)
- 아트: A1 6차 요청서(영역 4 · 2 아이콘 · 뱃지) → ChatGPT 생성 → 검수 PR

### 리듬

- Fable 릴리스 창: 오전 · 오후 각 1회. `gh pr list` → 4절 체크리스트 → 병합 → 버전 하나로 릴리스. 그 사이 PR 이 몇 개 쌓여도 돼요.
- 팀은 PR 내기 직전 `git fetch origin && git rebase origin/main` 한 번. 릴리스 뒤 다시 당겨서 새 브랜치로 다음 과제.
- QA 회전은 릴리스 직후 시작해요(새로 들어간 것만 보면 돼요).
- 유지보수는 docs/QA.md 에 「열림」 이 있을 때만 돌려요. 없으면 쉬는 게 맞아요(한도 절약).
- 병목 신호
  - 유지보수팀이 할 게 없다 = QA 가 밀린 것
  - Fable 담당 열림이 10개를 넘는다 = Fable 이 core 작업을 잠시 멈추고 처리
