# 작업 분담 규칙 — Fable / Opus

Claude 요금제의 주간 한도가 "모든 모델"과 "Fable 전용"으로 나뉘어 있다. Fable 한도가 먼저 바닥나지 않도록 **일감을 Opus에게도 나눈다.** 개발 세션은 시작할 때 이 파일을 HANDOFF.md 다음으로 읽는다.

## 1. 모델별 권한 (고정 — 묻지 않는다)

개발 세션은 자기가 어떤 모델인지 안다(시스템 안내의 모델 이름). 그 모델의 권한대로 바로 작업한다. 사용자에게 모드를 묻지 않는다.

| | Opus | Fable |
| --- | --- | --- |
| 콘텐츠: `courses/*/content.js` 레슨·문제·힌트·코치, `shared/` 문구, `IMAGES.md` | ✅ | ✅ |
| 문서: `specs/`, HANDOFF·CHANGELOG·DESIGN·NEXT | ✅ | ✅ |
| 피드백 패치 (스크린샷) | ✅ | ✅ |
| `core/` 수정 — 지시서(NEXT.md·EXPANSION.md·specs/)에 **파일과 단계가 적힌 것** | ✅ 커밋에 `[core]` 표시 | ✅ |
| `core/` 수정 — 지시서에 없는 새 설계 (새 러너·새 시각화 엔진·새 문제 type·저장 스키마 변경) | ❌ 멈추고 사용자에게 "Fable 작업"이라고 알림 | ✅ |
| Opus의 `[core]` 커밋 검토 | — | ✅ 4절 체크리스트 |

어느 모델로 일을 맡길지는 사용자가 채팅의 모델을 골라서 정한다. 문서는 그 결정을 묻지 않는다.

## 3. Opus 개발 세션 규칙

1. 시작: 저장소를 최신으로 당기고(`git fetch` + `reset --hard origin/main`), HANDOFF.md → 이 파일 → 맡은 지시서 순서로 읽는다. **main 에 직접 푸시하지 않는다 — 8절의 브랜치·PR 규칙대로.**
2. 범위: 지시서에 적힌 파일만 고친다. 지시서에 없는 `core/` 파일을 고쳐야 하면 멈추고 사용자에게 "이 파일도 고쳐야 한다, Fable 검토 대상"이라고 알린다.
3. 검증(푸시 전 필수): `node tools/validate_content.mjs && node tools/extract.mjs tools/.out && python3 tools/run_solutions.py`, 셸 관련이면 `node tools/test_shell.mjs`, 가능하면 `python3 tools/regress.py`.
4. 커밋 메시지: `core/`를 한 줄이라도 바꿨으면 맨 앞에 **`[core]`**. 예: `[core] v2.4.0: 터미널 러너 디스패치`. 콘텐츠만이면 표시 없음.
5. HANDOFF 상태판·CHANGELOG는 기존 규칙대로 같은 커밋에. 상태판 "마지막 작업"에 **작업한 모델(Opus/Fable)**을 괄호로 적는다.
6. 사용자에게 보고할 때: 버전, 바뀐 것 한 줄, 브라우저에서 확인할 곳(어느 화면 → 어느 문제), `[core]`였는지 여부.

## 4. Fable 검토 체크리스트 (`[core]` 커밋만)

`git log --oneline --grep "\[core\]"`로 목록을 뽑고 커밋마다:

- [ ] 다른 코스(파이썬·알고리즘)의 동작을 바꿨나 — 바뀐 함수의 호출처를 `grep`
- [ ] 저장 데이터 모양을 바꿨나 — 바꿨다면 예전 데이터가 그대로 읽히나
- [ ] 전역 이름·스크립트 로드 순서·`?v=` 규칙을 지켰나
- [ ] 모바일 390px, 다크/라이트, 접근성 설정(고대비·아주 크게)에서 깨지지 않나 (`regress.py`)
- [ ] 지시서와 다르게 만든 부분이 DESIGN.md에 이유와 함께 적혀 있나
- 문제가 있으면 패치 커밋, 없으면 HANDOFF 상태판에 "Fable 검토 통과: 커밋 해시들" 한 줄.

## 5. 작업 순서는 HANDOFF 상태판이 기준

무엇을 먼저 할지는 HANDOFF.md 0절 "다음 후보"가 정한다(이 파일에 적지 않는다). 다만 순서를 정할 때 지킬 것:

- `core/engine.js`·`core/ui-views-main.js`처럼 **같은 `core` 파일을 건드리는 작업 두 개를 동시에 두 채팅으로 돌리지 않는다.** 하나를 배포한 뒤 다음을 시작한다.
- 콘텐츠만 건드리는 작업(서로 다른 `courses/<id>/content.js`)은 동시에 돌려도 된다. 푸시 직전에 다시 당긴다.

## 6. 버전 번호

문서들(NEXT.md, EXPANSION.md 1절 표)에 적힌 마이너 번호는 **계획 당시의 순서 표시일 뿐**이다. 실제 번호는 **먼저 배포되는 쪽이 다음 마이너를 가져간다.** 배포할 때 NEXT.md 표와 EXPANSION.md 해당 줄을 실제 번호로 고친다.

지금까지 실제로 쓴 마이너: 2.0.0 Phase 0 · 2.1.0 알고리즘 · 2.2.0 실전 챕터 · **2.3.0 수학 공간 M1**. 다음 마이너(2.4.0)는 터미널·Git(WP-B)과 수학 M2 중 먼저 배포되는 쪽.

## 7. 팀 운영 — QA팀·콘텐츠팀 (Opus 채팅, 2026-11-02 사용자 결정)

Fable 세션(엔진·설계·검토) 외에 **Opus 채팅 두 개를 팀처럼 돌린다.** 각 팀은 자기 지시서를 읽고 1절 권한표 안에서만 일한다. 같은 `core` 파일을 두 채팅이 동시에 건드리지 않는다(5절).

| 팀 | 지시서 | 하는 일 | 산출물 | 못 하는 일 |
| --- | --- | --- | --- | --- |
| **QA팀** | `specs/qa-team.md` | 배포본을 실제로 플레이(PC·모바일 폭·다크/라이트·고대비)하며 버그·문구·UX 문제를 찾고, 재현 절차와 함께 기록. 콘텐츠 오류(정답·힌트·테스트)는 직접 고쳐 커밋 가능 | `QA.md`(발견 목록·상태), 콘텐츠 패치 커밋, `tools/regress.py` 체크 추가(허용) | `core/` 설계 변경(→ "Fable 작업"으로 QA.md에 표시) |
| **콘텐츠팀** | `specs/content-team.md` | 기존 스키마·그림 종류 안에서 레슨·문제·힌트·용어·예제 추가, 기존 문제 품질 개선(힌트 3단계, 테스트 경계값, 설명 문구) | `courses/*/content.js` 커밋 + PROBLEMS.md·CHANGELOG·HANDOFF | 새 문제 type·새 그림 kind·`core/` 수정 |

공통 규칙: ① 시작할 때 `git fetch && git reset --hard origin/main` ② **main 직접 푸시 금지 — 자기 브랜치에 올리고 PR(8절)** ③ 검증 게이트(3절) 통과 없이는 PR 금지 ④ 커밋 메시지 맨 앞에 `[qa]` 또는 `[content]` ⑤ `APP_VERSION`·`node tools/stamp.mjs`·HANDOFF 상태판은 **건드리지 않는다**(릴리스 때 Fable이 한 번에). Fable은 열린 PR 목록(`gh pr list`)을 검토·병합한다.

**Opus 채팅을 열 때 첫 메시지(복사용)**
- QA팀: `저장소 github.com/jihoon380462/python-academy 를 당기고 HANDOFF.md → specs/workflow.md → specs/qa-team.md 순서로 읽은 뒤 qa-team.md 2절 체크리스트대로 1회전 QA를 시작해. 결과는 QA.md에 기록하고 콘텐츠 오류는 고쳐서 [qa] 커밋으로 올려.`
- 콘텐츠팀: `저장소 github.com/jihoon380462/python-academy 를 당기고 HANDOFF.md → specs/workflow.md → specs/content-team.md 순서로 읽은 뒤 content-team.md 3절의 첫 과제부터 시작해. [content] 커밋으로 올려.`

## 8. 브랜치·PR 규칙 — "먼저 끝낸 쪽이 바로 배포" 금지 (2026-11-02)

main 에 푸시되면 곧바로 GitHub Pages 에 배포된다. 그래서 **main 에 직접 푸시하는 건 Fable 릴리스 커밋뿐**이고, 팀 작업은 전부 브랜치 → PR → 검토 → 병합 순서다.

1. **브랜치 이름**: `content/<과제>` (예 `content/C4-glossary`), `qa/<날짜-주제>` (예 `qa/1102-round1`), Opus core 작업은 `core/<주제>`. 시작: `git fetch origin && git switch -c content/C4-glossary origin/main`.
2. **커밋**: 평소대로(`[content]`·`[qa]`·`[core]` 접두). **`APP_VERSION`·`sw.js`·HTML `?v=`·HANDOFF 상태판은 손대지 않는다.** CHANGELOG 는 맨 위 `## 미배포` 절 아래에 항목만 추가한다(버전 머리글 없이). PROBLEMS.md 표 추가는 OK.
3. **PR 열기**: `git push -u origin <브랜치>` → `gh pr create --base main --fill` (제목 = 커밋 요약, 본문에 바뀐 것·확인한 화면·검증 결과). 열면 `PR Check`(`.github/workflows/ci.yml`: validate·run_solutions·test_shell·regress)가 자동으로 돈다. 빨간 PR 은 고쳐서 다시 푸시한다(같은 브랜치에 푸시하면 PR 이 갱신됨).
4. **main 이 앞서 나갔으면** `git fetch origin && git rebase origin/main` 뒤 `git push --force-with-lease`. 충돌은 자기 브랜치에서 푼다. 같은 `courses/<id>/content.js` 끝에 두 팀이 `push`를 추가했으면 둘 다 남기는 쪽으로 합친다.
5. **병합·릴리스(Fable)**: `gh pr list` → 4절 체크리스트로 검토 → `gh pr merge <번호> --squash --delete-branch` → main 에서 **릴리스 커밋 한 번**: `APP_VERSION` 패치/마이너 올림 → `node tools/stamp.mjs` → CHANGELOG `## 미배포` 를 `## vX.Y.Z — 날짜` 로 바꿈 → HANDOFF 상태판 → 푸시 → 배포 확인. 여러 PR 을 한 릴리스로 묶어도 된다.
6. **브랜치 보호(사용자가 GitHub 에서 한 번 설정)**: 저장소 페이지 → **Settings** 탭 → 왼쪽 **Branches** → **Add branch ruleset**(또는 Add classic branch protection rule) → Branch name pattern `main` → 체크: **Require a pull request before merging**(승인 수 0 이어도 됨), **Require status checks to pass before merging** → 검색창에 `verify` 입력해 선택, **Do not allow bypassing the above settings** 는 끈 채로 → Create. 이렇게 하면 팀 채팅이 실수로 `git push origin main` 해도 거부된다. (이 설정은 API 로 못 하고 소유자가 UI 에서 해야 한다.)
7. **예외**: 아트 납품(ChatGPT) 커밋은 `assets/img/`·IMAGES.md·버전만 바꾸므로 지금처럼 main 직접 푸시 허용 — 단 다른 PR 과 `APP_VERSION` 이 겹치지 않게 **아트 납품도 PR 로 올리는 걸 권장**(`art/<차수>` 브랜치).
