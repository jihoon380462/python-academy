# 유지보수팀 지시서 (Opus) — 파이썬 아카데미

읽는 순서: HANDOFF.md → specs/workflow.md(1·3·7·8절) → QA.md → 이 파일. **입력은 QA.md의 「열림」 항목**, 출력은 수정 PR. 배포 권한 없음(브랜치 `fix/<QA번호-주제>` → PR).

## 1. 담당 범위 (workflow 1절 Opus 권한 안)

| QA.md 담당 칸 | 유지보수팀이 하나 | 비고 |
| --- | --- | --- |
| `QA 수정` / `유지보수` | ✅ 콘텐츠(지문·힌트·정답·테스트), 문구·오타, CSS 한두 줄, 레슨 html | 가장 많은 유형 |
| `콘텐츠팀` | ✅ (콘텐츠팀이 쉬는 동안 대신) | 문제 품질·보강 |
| `Fable` | ❌ 손대지 않음 — 단, **재현 절차를 보강**하고 원인 추정(어느 파일·함수)을 QA.md 비고에 적어 둔다 | core 설계·새 유형·새 그림·저장 스키마 |
| `[core]` 한 줄 수정(지시서에 있는 것) | ✅ 커밋 접두 `[core]` + Fable 검토 대상 표시 | 예: 가드 한 줄, 문구, 색 변수 |

사용자가 플레이 중 직접 제보한 버그(스크린샷 + 한 줄)도 **QA.md에 행을 추가한 뒤** 같은 절차로 처리한다. 담당은 범위에 따라 정하고, core 설계면 `Fable`(이번 주는 schedule-week.md 3절에 적힌 것만 `[core]`).

## 2. 작업 절차 (항목 하나 = 브랜치 하나 = PR 하나, 작은 항목은 같은 종류끼리 묶어도 됨)

1. `git fetch origin && git switch -c fix/<QA#>-<주제> origin/main`
2. QA.md 항목의 **재현 절차로 먼저 재현**한다(Playwright 또는 로컬 서버). 재현이 안 되면 상태를 「재현 불가(날짜)」로 바꾸고 다음 항목.
3. 고친다 → 같은 절차로 **고쳐졌는지 확인** → 재발 방지가 되는 항목이면 `tools/regress.py`에 `check(...)` 한 줄 추가(허용).
4. 게이트: `node tools/validate_content.mjs && node tools/extract.mjs tools/.out && python3 tools/run_solutions.py` (+ 가능하면 `python3 tools/regress.py`).
5. QA.md 그 행의 상태를 「닫힘 [fix] <브랜치>」로, 담당을 `유지보수`로 바꾼다. CHANGELOG `## 미배포`에 사용자가 보는 변화 한 줄(여러 항목이면 한 줄에 묶어도 됨).
6. `[fix] QA#n: …` 커밋 → `git push -u origin fix/…` → `gh pr create --base main --fill`. **버전·stamp·HANDOFF 상태판은 손대지 않는다.**

## 3. 우선순위

심각도 상(진행 불가·데이터 손실·오답 처리) → 중 → 하. 같은 심각도면 QA.md 위에서부터. 같은 파일을 고치는 항목은 한 PR로.

## 4. 하지 말 것

- 증상만 가리는 수정(예: 테스트 기대값을 내 출력에 맞추기). 지문·정답·테스트·힌트가 **서로 맞는지** 확인하고, 정답 코드는 CPython으로 돌린다.
- 문제·레슨 id 변경, 문제 삭제, `vary` 범위 축소(진행 데이터 호환).
- core 설계 변경 — QA.md에 "Fable" 담당으로 남기고 원인 추정만.
- QA.md 형식 변경. 행은 지우지 않고 상태만 바꾼다(이력).
