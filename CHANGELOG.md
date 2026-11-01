# CHANGELOG

배포한 버전마다 한 항목. 형식: `## vX.Y.Z — YYYY-MM-DD` + 바뀐 것(사용자가 보는 변화 → 내부 변화 순). 배포 커밋에 HANDOFF.md 상태판과 함께 포함한다(작업 규칙).

## v2.0.1 — 2026-11-01
- 텍스트 모드 따라하기 코치가 **모든 레슨**에서 나와요(전에는 L0~L5). 클래스(`class`, `__init__`, `self.x`)·`try/except`·`with open`·딕셔너리 세기·`sort(key=…)`·메서드 호출·`break/continue`·`random.seed` 줄도 뜻을 설명해요.
- 레슨 5~18 설명에 어려운 용어 옆 읽는 법·뜻 추가(인덱스=번호표, 매개변수=재료 칸, 메서드=값에게 시키는 일, 상속=물려받기, 오버라이딩=덮어쓰기 등 17곳).

## v2.0.0 — 2026-11-01
- **Phase 0 (EXPANSION.md 2절)**: `src/`+`build.sh` → `core/`·`courses/python/`·`shared/`·`tools/` 구조(코드는 옮기기만, 전역 이름·순서 유지). 허브 `index.html`(오늘의 할 일·이어서 하기·코스 카드 5개) + `core/hub.js`. 저장 스키마 v2(`academy.profile/course.<id>/tutor.<id>/works/sync`, `Store.data`는 그대로 한 객체; v1 자동 이전 + `academy.backup.v1` 보관 + 설정 "v1 데이터 다시 가져오기"; 4MB 넘으면 "오래된 코드 정리"). 상단바 ⌂ 허브 버튼, `Store.data.last`로 이어서 하기, 코스 페이지 딥링크 해시. Actions `verify` 잡(validate_content + run_solutions) 통과 시에만 배포. `python_academy.html`은 리다이렉트, v1.3.0 원본은 `legacy/python_academy_v1.html`.

## v1.3.0 — 2026-11-01
- 후보 2~7 일괄: ① 레슨 0~4 설명 쉬운 말로(읽는 법·뜻 병기, 몫/나머지 초등 나눗셈 비유) ② **텍스트 모드 따라하기 코치** (`Content.textGuideFor` in 30: L0~L5 정답 코드를 한 줄씩 "뜻 + 이렇게 치세요 + 📋복사"로 자동 생성, 손글 `GUIDES_TEXT[pid]`로 덮어쓰기 가능; `Coach.mount(..., 'text')`, 42 텍스트 분기에 `#pvCoach`) ③ 빈 작업판 **손가락 드래그 데모** (`.bg-demo` CSS 애니메이션, 41 guide; 애니메이션 '끔'이면 숨김) ④ 변수 만들기 창 **추천 이름 칩** (`UI.prompt` `chips` 옵션, 41 `suggest()`: 정답 코드 변수 → 공통 이름) ⑤ **집중 모드** (`settings.focus`, `.pv.focus` 설명 숨김 + `.pv-focusbar`에 제목/설명모달/힌트/선생님; 모바일은 탭이라 버튼 숨김) ⑥ 블록 배율 PC 1.1 / 모바일 0.85

## v1.2.0 — 2026-11-01
- **PC↔모바일 기기 연동**(`Sync` in 31): 사용자 GitHub 비공개 gist(`python_academy_save.json`)에 진행 데이터 저장. 토큰(classic, gist 권한)으로 첫 연결 → "연동 코드"(`PA-SYNC:`+base64{t,g})를 다른 기기에 붙여넣기. `Store.save()`가 `updatedAt` 찍고 3초 디바운스로 push, 시작·탭 복귀·online 때 pull→`merge`(진행은 max/합집합, 설정·문자열은 최근 쪽, `resetAt`이 더 새로우면 그쪽 통째). API 키는 동기화 제외. 설정 카드 `Sync.card()/bind()`, 상단바 ☁ 아이콘. 스텁 테스트: scratchpad `sync_test.js` 패턴(가짜 fetch).

## v1.1.2 — 2026-11-01
- L3 설명에서 `+ - *` 한 칩 → 기호별 칩으로 분리

## v1.1.1 — 2026-11-01
- L2P5/L3P1 기본값 a=3, b=4 (곱과 합이 같아지는 2,2 방지)

## v1.1.0 — 2026-11-01
- **블록 문제 "따라하기" 코치**(`Coach` in 42, 데이터 `GUIDES` in 24, 자동생성 `Content.guideFor` in 30) · 블록 스냅 반경 64px

## v1.0.9 — 2026-11-01
- Blockly 변수 만들기 창을 브라우저 prompt 대신 앱 모달로(`Blockly.dialog.setPrompt`, `UI.prompt`에 hint/ok 옵션)

## v1.0.8 — 2026-11-01
- 설명 속 `<code>` 칩: 줄바꿈 금지 + 고대비(호박색) `--code-bg/fg/bd`

## v1.0.7 — 2026-11-01
- "채점하기" → "제출하기"

## v1.0.6 — 2026-11-01
- 블록 작업판 확대(`.pv.mode-block` 24%/76%, `#view.view-problem` 1720px, `.bed` 높이 최대 600)

## v1.0.5 — 2026-11-01
- 카테고리 1개면 flyoutToolbox, 빈 작업판 안내 오버레이(`.bed-guide`), 메뉴 자동 열기, 메뉴 버튼화

## v1.0.4 — 2026-11-01
- 용어 `dfn.term` 굵기 800/1.12em

## v1.0.3 — 2026-11-01
- 이하: 본문 버튼명 `.uibtn` 칩, 폰트 확대 방지, 모바일 Worker 폴백, GitHub Pages 배포 구축

