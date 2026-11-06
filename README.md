# 파이썬 아카데미

사용자 본인이 쓰는 초보자용 학습 사이트. 여러 코스가 모이는 "아카데미" 구조(v2.0.0~).

- **파이썬·터미널·Git·Vim 은 「교과서」**(v2.9.0·v2.10.0·v2.11.0~): 설명을 읽고 내 컴퓨터(VS Code·Git Bash·gVim)에서 직접 만들어 본다. 채점·XP·잠금 없음. 알고리즘·수학은 브라우저 실행 문제집, SQL·웹은 미리보기.
- **무엇이 정상이고 무엇이 버그인가는 [`specs/site-intent.md`](specs/site-intent.md)** — QA·새 세션은 이것부터.

- 사이트(허브): https://jihoon380462.github.io/python-academy/ · 코스: `/courses/python/` · `/courses/terminal-git/` · `/courses/algo/` · `/courses/math/` · `/courses/sql/` · `/courses/web/` · 공용 `/courses/vim/` (교과서 코스의 옛 문제집 화면은 주소 끝 `?classic=1`)
- 설계 결정: DESIGN.md · 문제 목록: PROBLEMS.md · 확장 지시서(멀티 코스): EXPANSION.md

## 개발/인수인계
- 다음 작업 세션은 **`specs/site-intent.md` → `HANDOFF.md`** 순서로 읽을 것.
- 빌드 없음. `core/`(공통 엔진) + `courses/<id>/`(코스 페이지·콘텐츠) + `shared/`(에러 사전·용어집·뱃지)를 일반 `<script>`로 읽는다.
- 푸시 전: `node tools/stamp.mjs` 뒤 site-intent.md 7절의 검사 전부(Actions `verify` 가 같은 검사를 통과해야 배포됨). 헤드리스 회귀는 `python3 tools/regress.py`. 교과서 데이터 검사는 `node tools/check_book.mjs`.
- 저장은 localStorage `academy.*` 조각(스키마 v2). v1 키(`python_academy_save`)는 첫 실행에 자동 이전되고 `academy.backup.v1`에 보관.
