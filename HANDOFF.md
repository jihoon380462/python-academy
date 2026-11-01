# HANDOFF — 다음 작업 세션 인수인계

> 새 채팅에서 이 파일을 먼저 읽으면 바로 이어서 작업할 수 있다.
> 사용자(jihoon380462)는 한국어로 대화하며, 사이트 화면을 스크린샷으로 보내고 "이거 고쳐" 식으로 피드백을 준다.

## 0. 상태판 (배포할 때마다 이 칸을 갱신한다 — 작업 규칙)

| 항목 | 내용 |
| --- | --- |
| **현재 버전** | v2.0.0 (2026-11-01 배포, Phase 0) |
| **마지막 작업** | Phase 0: `src/`+`build.sh` → `core/`·`courses/python/`·`shared/`·`tools/` 구조, 허브(`index.html`+`core/hub.js`), 저장 스키마 v2(`academy.*`, v1 자동 이전·백업·되돌리기), Actions 검증 게이트, `python_academy.html` 리다이렉트, `legacy/` 보관. 상세: CHANGELOG.md |
| **다음 후보** | ① v2.0.0 실사용 확인(허브 수치·실제 Blockly 화면·기기 연동 병합) 후 피드백 패치 ② Phase 1 알고리즘 코스(EXPANSION.md 5절 → v2.1.0) ③ 텍스트 코치 L6 이후 확장 / 레슨 5 이후 쉬운 말 |

## 1. 이게 뭔가
- **파이썬 아카데미**: 완전 초보자용 학습 사이트. v2.0.0(Phase 0)부터 **허브 + 코스 페이지** 구조 (확장 계획은 `EXPANSION.md`; "Phase N을 진행해"가 의뢰 단위).
- 라이브 주소: 허브 **https://jihoon380462.github.io/python-academy/** · 파이썬 코스 `/courses/python/` (GitHub Pages, `main`에 push → Actions가 **검증(validate+run_solutions) 통과 시** 1~2분 안에 자동 배포)
- 저장소: `github.com/jihoon380462/python-academy` (public)
- 기술: Pyodide 0.27.5(Web Worker, 메인스레드 폴백) · Blockly 11.2.2 · CodeMirror 6 · 모두 CDN. Claude API 선생님(API 키는 기기별 localStorage). 기기 연동은 GitHub 비공개 gist(`core/sync.js`).
- 현재 버전: **v2.0.0** (`core/config.js`의 `APP_VERSION`. 설정 맨 아래·허브 푸터에 표시. 수정할 때마다 올리고 `node tools/stamp.mjs`로 HTML의 `?v=`도 맞춘다 — 사용자가 이 숫자로 반영 여부를 확인한다)

## 2. 작업 방법 (반드시 이 순서)
1. 저장소를 클론/attach한다. **빌드 없음** — 파일을 고치면 그게 곧 배포물이다. 로드 순서는 `courses/python/index.html`의 `<script>` 순서(바꾸지 말 것).
   - `core/config.js` 버전·CDN·수치·문구(T)·허브 코스 목록(COURSES) · `core/util.js` 유틸 · `core/storage.js` 저장(스키마 v2) · `core/sync.js` 기기 연동 · `core/engine.js` Content(인덱스·변형·가이드 생성)·Grader · `core/runners/python.js` Pyodide 워커·거북이 · `core/game.js` Game·Review · `core/tutor.js` 선생님 API+패널 · `core/fx.js` 효과음·색종이·마스코트 · `core/ui-core.js` UI 공통(모달·토스트·상단바·용어 칩) · `core/ui-editors.js` 텍스트/블록/Parsons 에디터 · `core/ui-views-main.js` 홈·레슨·문제·Coach · `core/ui-views-more.js` 나머지 화면·설정·온보딩·코스 페이지 초기화(딥링크 `#problem/ID`, `#lesson/ID`, `#settings`) · `core/hub.js` 허브 · `core/ui.css`
   - `courses/python/content.js` 레슨 24·문제 104·CHAPTERS·MAP_DECOR·GUIDES(블록 코치) · `courses/python/course.json` 코스 메타 · `shared/errors.js`·`glossary.js`·`badges.js`(BADGES·INVENTORY)
   - 허브 `index.html`은 러너 없이 config·util·badges·python content·storage·sync·engine·game·fx·ui-core·hub.js만 읽는다.
2. `APP_VERSION` 올리기 → `node tools/stamp.mjs` → 검증: `node tools/validate_content.mjs && node tools/extract.mjs tools/.out && python3 tools/run_solutions.py` → 가능하면 `python3 tools/regress.py`(헤드리스 크롬 회귀: 마이그레이션·허브·전 화면·모바일).
3. 커밋 & push:
   ```
   git -c user.name="jihoon380462" -c user.email="jihoon380462@users.noreply.github.com" commit -m "v2.x.y: 한 줄 요약"
   git push origin main
   ```
   (커밋 메시지 끝에 Co-Authored-By 줄은 세션 지침대로)
   **작업 규칙(사용자 지시)**: 배포하는 커밋에는 반드시 ① 이 파일 **0. 상태판**의 "현재 버전 / 마지막 작업 / 다음 후보" 갱신과 ② **`CHANGELOG.md`** 새 항목(버전·날짜·바뀐 것)을 **같은 커밋에 포함**한다. 코드만 푸시하고 문서를 나중에 올리지 말 것.
4. 배포 확인: `gh run list --workflow "Deploy to GitHub Pages" --limit 1` 이 `success`면 끝(verify 잡 실패 시 배포 안 됨 → `gh run view <id> --log-failed`). 사용자에게 "vX.Y.Z 배포 완료, Ctrl+F5" 라고 알린다.

## 3. 환경 제약 (작업 샌드박스)
- CDN(unpkg, jsdelivr, pypi, npm)에 **접근 불가** → Pyodide/Blockly/CodeMirror는 헤드리스에서 실제 로드 못 함. 실제 블록/실행 화면은 **사용자가 브라우저에서 확인**한다. 로직은 스텁으로 검증(`tools/regress.py`는 textarea 폴백·"블록 도구를 불러오지 못했어요" 문구까지만 확인).
- GitHub API도 file://에서는 CORS로 막힘 → 기기 연동은 가짜 fetch로 단위 테스트(`Sync.merge`·connect/pull/push 흐름; v1.2.0 작업 scratchpad `sync_test.js` 패턴).
- GitHub Pages REST API는 프록시가 막음 → Actions 워크플로로만 배포 제어.
- 헤드리스 크롬: `tools/regress.py` 패턴 — playwright + `/usr/bin/google-chrome`, `--allow-file-access-from-files`, `add_init_script`로 localStorage에 **v1 키 `python_academy_save`를 넣으면 마이그레이션까지 같이 검증**된다. `UI.go('problem',{pid:'L1P1'})`로 화면 이동.
- 정답 코드 CPython 검증: `tools/run_solutions.py` (`tools/extract.mjs`로 problems.json 추출 후 실행; Actions에서도 같은 명령).

## 4. 사용자의 작업 선호 (지켜야 함)
- 한 단계 끝나면 **"다음으로 할 수 있는 선택지 목록"**을 번호로 제시 (열린 질문 금지).
- 설정 바꾸라고 할 때는 **어느 화면 → 어느 섹션 → 어느 칸**인지 위치까지.
- 오래 걸리는 작업은 진행률 % 표시.
- 반복되는 수동 절차를 싫어함("일일이 하라고?") → 자동화해서 링크 하나로 끝나게.
- 답변은 짧게, 결과 먼저.

## 5. 변경 이력
- **CHANGELOG.md** 참고 (버전별 변경 내용). 상태판(0절)에는 최신 버전만 적는다.

## 6. 열려 있는 다음 후보
- 상태판(0절)의 "다음 후보"가 최신이다. 사용자에게는 번호 붙인 선택지로 제시한다.

## 7. 핵심 데이터 규칙 요약
- 문제 스키마는 `courses/python/content.js` 맨 위 주석(+ EXPANSION.md 4절의 확장 필드 runner/grader/setup/limits/visualize). `vary:{a:[lo,hi]}`의 **기본값은 lo**(`Content.defaultParams`) — 기본값끼리 겹치는 출력이 안 나오게 주의.
- 테스트는 최소 2개(1개면 복제), 마지막 1개 숨김.
- 코치 가이드 `GUIDES[pid]`(content.js) `= [{t:'HTML 설명', c:'코드에 포함될 문자열' | ['여러개'] | '@var:이름' | '~정규식', cat:'강조할 메뉴'}]`, 마지막 단계는 c 없이 "실행 → 제출" 안내. 없는 문제는 정답 코드 줄에서 자동 생성.
- Blockly 한글 라벨 오버라이드는 `core/ui-editors.js` `Blocks.setup()` (`출력 %1`, `%1 = %2`, `만약/아니고 만약/아니면`, `i 를 1 부터 5 까지 반복` 등). 안내 문구는 이 라벨과 일치시킬 것.
