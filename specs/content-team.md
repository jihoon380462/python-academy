# 콘텐츠팀 지시서 (Opus) — 파이썬 아카데미

읽는 순서: HANDOFF.md → specs/workflow.md(1·3·7·**8절**) → 이 파일. **main 에 직접 푸시 금지 — 브랜치 `content/<주제>` 에 올리고 PR(workflow 8절). 버전·stamp·HANDOFF 상태판은 Fable 이 릴리스 때 한다. 배포 권한은 Fable 이상에게만 있다(workflow 1절 권한표).** 권한: `courses/*/content.js`, `shared/glossary.js`, PROBLEMS.md·CHANGELOG·HANDOFF. **새 문제 type·새 그림 kind·core/ 수정은 금지**(필요하면 HANDOFF 다음 후보에 "Fable 작업"으로 적는다).

## 1. 스키마 (고치지 말고 그대로 쓴다)

- 파이썬·알고리즘: `courses/python/content.js` 맨 위 주석 + `courses/algo/content.js` 맨 위 주석. 레슨 `{id, ch, n, title, minutes, mode, terms, pages[{title, html, example}], summary}` · 문제 `type: quiz|fill|bug|parsons|block|code` (+ 알고 `kind`, `tests[{call,ret}|{input,output}]`, `visualize`, `limits`).
- 수학: `courses/math/content.js` 맨 위 주석. 노드 = 레슨 + `subtitle/level/stars/prereq/star/icon/params[]`, `pages[0].figure`(필수, kind는 `core/figure.js` 주석의 16종만) · `observe` 2~3 · `pages[1].formula/example`. 문제 `quiz kind:'explore' requireInteract` · `num answer:{value,tol,unit,why}`+solution · `match` · `pair` · `code`.
- 규칙: 문제마다 힌트 **정확히 3개**(방향 → 구체 → 거의 정답), 태그 1개 이상(코스의 `WEAKNESS_TAGS` 안에서), 실행형은 테스트 ≥ 4(경계값 포함, 마지막 1개는 숨김), 보스 ≥ 5. `[[용어]]`는 레슨 `terms` 나 `shared/glossary.js`에 있어야 한다. 정답 코드는 CPython으로 돌려 통과해야 한다(`run_solutions.py`). 말투 ~해요체, 초보 기준 비유 먼저.
- 추가 위치: 파일 **끝에** `LESSONS.push(...)`, `PROBLEMS.push(...)`(파이썬·알고리즘) / 수학은 배열 안에 영역별로. `CONFIG.COURSES[].total/lessons`(core/config.js의 숫자 두 개)는 **콘텐츠 수와 같아야 validate가 통과** — 이 숫자 수정은 허용(값만).

## 2. 검증·배포 (푸시 전 필수)

`node tools/validate_content.mjs && node tools/extract.mjs tools/.out && python3 tools/run_solutions.py` → 통과하면 PROBLEMS.md 표 추가 → CHANGELOG 맨 위 `## 미배포` 절에 항목 추가(버전 머리글 없이) → `[content] C4: …` 커밋 → `git push -u origin content/C4-…` → `gh pr create --base main --fill`. **`APP_VERSION`·stamp·HANDOFF 상태판은 건드리지 않는다**(릴리스 때 Fable). 가능하면 `python3 tools/regress.py`. PR 의 `PR Check` 가 초록이어야 병합된다.

## 3. 과제 목록 (위에서부터, 하나씩 배포)

| # | 과제 | 범위 | 완료 기준 |
| --- | --- | --- | --- |
| C1 ✅ v2.3.2 | **수학 영역 1·3·5 보강 노드** — 기존 그림 16종만으로 만들 수 있는 것: 1-10 「약수의 개수와 완전수」(sieve/bars), 3-9 「기하분포: 몇 번 만에 성공하나」(hist, sim = 첫 성공까지 횟수), 5-9 「두 점 사이 거리와 충돌 판정」(vector, 원 두 개 겹침 판정은 숫자 답·코드로) | `courses/math/content.js`, prereq 는 기존 노드, 노드당 4문제(탐구 2·num 1·code 1) | validate(첫 그림·observe·탐구 퀴즈) 통과, config 총계 갱신 |
| C2 ✅ v2.3.4 | **파이썬 챕터 7 연습 보강** — L19~L23 각 레슨에 `bug` 또는 `fill` 1문제씩(현재 code·quiz 위주) | `courses/python/content.js` 끝 | 힌트 3·테스트 통과 |
| C3 ✅ v2.3.5 | **알고리즘 챕터 6 추적 퀴즈** — A16~A20 각 1문제 `kind:'trace'` + `visualize`(기존 kind: bars/table/grid/callstack) | `courses/algo/content.js` 끝 | 시각화 버튼 동작(QA 확인) |
| C4 | **용어집 보강** — 수학 노드 `terms` 중 공용 가치가 있는 것(나머지·소수·벡터·내적·확률·기댓값 등 20개)을 `shared/glossary.js`로 옮기고 레슨 `terms` 중복 제거 | `shared/glossary.js` | validate 용어 검사 통과 |
| C5 | **힌트 품질 점검** — 파이썬 L0~L8 문제의 힌트 3단계가 "방향→구체→거의 정답" 순서인지, 3단계가 정답 코드와 변수명이 같은지 전수 점검·수정 | `courses/python/content.js` | QA.md에 점검 결과 요약 |

| C6 | **파이썬 L9~L18 힌트 품질 점검** — C5와 같은 기준(방향→구체→거의 정답, 3단계 = 정답 코드와 같은 변수명) | `courses/python/content.js` 기존 힌트 줄만 | QA.md에 C5 형식으로 표 추가 |
| C7 | **알고리즘 A0~A15·AB1~AB3 힌트 품질 점검** — 같은 기준 + `kind:'ct'` 문제는 힌트 3이 입출력 형식까지 | `courses/algo/content.js` 기존 힌트 줄만 | QA.md 표 추가 |
| C8 | **알고리즘 실전 E1~E6 연습 문제** — 실전 레슨마다 프로젝트 전에 푸는 작은 `code` 문제 1개(프로젝트의 한 단계만 떼어낸 것, 테스트 4개) | `courses/algo/content.js` 끝에 push, config algo total(값만) | validate·run_solutions 통과 |
| C9 | **수학 난이도·범위 표기 재점검**(QA #33) — 28노드 `level`(고1/고2/대학)·`stars` 기준을 PROBLEMS.md 수학 절에 적고 맞추기 | `courses/math/content.js` level/stars 값만 — **Fable M2 작업 중이면 M2 배포 뒤에** | QA #33 닫힘 |

C1~C5 완료(v2.3.6). **C6부터.** 한 과제 = 한 브랜치 = PR 하나(버전은 릴리스 때 Fable이). 수학 `content.js`는 Fable 이 M2 로 고치는 동안(HANDOFF 상태판 확인) 건드리지 않는다 — C9는 그 뒤. 과제를 끝내면 HANDOFF "다음 후보"의 콘텐츠 줄을 갱신하고 다음 과제로.

## 3-2. 문제 난이도 규칙 (2026-11-05 추가, QA #160)

- 레슨 안 문제는 **쉬운 것 → 합친 것** 순서로 배열한다(배열 순서 = 화면 순서). 첫 문제는 레슨 기능 하나만.
- 정답·힌트 3 은 **본문에서 가르친 꼴**로만 쓴다(접힌 「더 알아보기」만 있는 꼴 금지). 더 짧은 꼴이 있어도 배운 꼴을 쓴다.
- 레슨 기능 3개 이상을 합친 문제는 starter 에 대부분을 적어 두고 학습자가 쓸 줄을 지문에 「가운데 한 줄만」처럼 콕 집는다.
- 타자 전용 레슨(L11 이후)의 앞 두 문제는 `dual:true` + `parsons:{solution, distractors}` 를 넣어 줄 맞추기로도 풀 수 있게 한다.
- 새 문제를 넣은 뒤 그 레슨을 **처음부터 직접 풀어 본다**(힌트 없이). 막히면 문제를 고친다.

## 4. 하지 말 것

- 레슨·문제 id 변경, 기존 문제 삭제(진행 데이터가 id로 저장됨). 고칠 땐 내용만.
- `vary` 범위 밖 값, 테스트에 현재 시각·난수(시드 없는) 의존, 5초 넘게 도는 정답 코드.
- 그림 kind 새로 쓰기 / 문제 type 새로 쓰기 — Fable 작업.
