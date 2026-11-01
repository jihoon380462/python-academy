# 파이썬 아카데미

브라우저에서 진짜 파이썬이 실행되는 초보자용 학습 사이트. v2.0.0부터 여러 코스가 모이는 "아카데미" 구조.

- 사이트(허브): https://jihoon380462.github.io/python-academy/ · 파이썬 코스: https://jihoon380462.github.io/python-academy/courses/python/
- 설계 결정: DESIGN.md · 문제 목록: PROBLEMS.md · 확장 지시서(멀티 코스): EXPANSION.md

## 개발/인수인계
- 다음 작업 세션은 **`HANDOFF.md`** 를 먼저 읽을 것.
- 빌드 없음. `core/`(공통 엔진) + `courses/<id>/`(코스 페이지·콘텐츠) + `shared/`(에러 사전·용어집·뱃지)를 일반 `<script>`로 읽는다.
- 푸시 전: `node tools/stamp.mjs && node tools/validate_content.mjs && node tools/extract.mjs tools/.out && python3 tools/run_solutions.py` (Actions가 같은 검사를 통과해야 배포됨). 헤드리스 회귀는 `python3 tools/regress.py`.
- 저장은 localStorage `academy.*` 조각(스키마 v2). v1 키(`python_academy_save`)는 첫 실행에 자동 이전되고 `academy.backup.v1`에 보관.
