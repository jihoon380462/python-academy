# HANDOFF — 다음 작업 세션 인수인계

> 새 채팅에서 이 파일을 먼저 읽으면 바로 이어서 작업할 수 있다.
> 사용자(jihoon380462)는 한국어로 대화하며, 사이트 화면을 스크린샷으로 보내고 "이거 고쳐" 식으로 피드백을 준다.

## 1. 이게 뭔가
- **파이썬 아카데미**: 완전 초보자용 파이썬 학습 사이트. **단일 HTML 파일** (`python_academy.html` = `index.html`).
- 라이브 주소: **https://jihoon380462.github.io/python-academy/** (GitHub Pages, `main` 브랜치에 push하면 Actions가 1~2분 안에 자동 배포)
- 저장소: `github.com/jihoon380462/python-academy` (public)
- 기술: Pyodide 0.27.5(Web Worker, 메인스레드 폴백) · Blockly 11.2.2(블록 코딩) · CodeMirror 6(텍스트 에디터) · 모두 CDN. Claude API 선생님(사용자 API 키를 localStorage에 저장).
- 현재 버전: **v1.3.0** (설정 화면 맨 아래에 표시됨. 수정할 때마다 `src/10_config.js`의 `APP_VERSION`을 올린다 — 사용자가 이 숫자로 반영 여부를 확인한다)

## 2. 작업 방법 (반드시 이 순서)
1. 저장소를 클론/attach한다. 소스는 **`src/` 조각 파일**이 원본이다. `index.html`을 직접 고치지 말 것.
   - `src/00_head.html` CSS + body 골격 · `10_config.js` 설정/문구(T) · `20~21_content_*.js` 레슨 · `22~23_problems_*.js` 문제 104개 · `24_content_misc.js` 챕터/뱃지/에러사전/용어집/**GUIDES(따라하기 코치 데이터)** · `30_engine.js` 실행·채점·게임·Content · **`31_sync.js` 기기 연동(GitHub Gist)** · `40_ui_core.js` UI 공통(모달·토스트·용어 칩) · `41_ui_editors.js` 텍스트/블록/Parsons 에디터 · `42_ui_views_main.js` 홈·레슨·문제 화면·Coach · `43_ui_views_more.js` 나머지 화면·초기화 · `99_tail.html`
2. `APP_VERSION` 올리기 → `./build.sh` (조각 합치기 + `node --check`) → `index.html`, `python_academy.html` 둘 다 갱신됨.
3. 커밋 & push:
   ```
   git -c user.name="jihoon380462" -c user.email="jihoon380462@users.noreply.github.com" commit -m "v1.x.y: 한 줄 요약"
   git push origin main
   ```
   (커밋 메시지 끝에 Co-Authored-By 줄은 세션 지침대로)
4. 배포 확인: `gh run list --workflow "Deploy to GitHub Pages" --limit 1` 이 `success`면 끝. 사용자에게 "vX.Y.Z 배포 완료, Ctrl+F5" 라고 알린다.
   - 워크플로(`.github/workflows/pages.yml`)에 멈춘 이전 배포 자동 취소 + 재시도가 들어 있다. 실패하면 `gh run view <id> --log-failed`.

## 3. 환경 제약 (작업 샌드박스)
- CDN(unpkg, jsdelivr, pypi, npm)에 **접근 불가** → Pyodide/Blockly/CodeMirror는 헤드리스에서 실제 로드 못 함. 그래서 실제 블록/실행 화면은 **사용자가 브라우저에서 확인**한다. 로직은 스텁으로 검증(`verify/coach.py`, `verify/prompt.py` 참고).
- GitHub Pages REST API는 프록시가 막음 → Actions 워크플로로만 배포 제어.
- 헤드리스 크롬: `verify/layout.py` 패턴 — playwright + `/usr/bin/google-chrome`, `--allow-file-access-from-files`, localStorage에 `python_academy_save` 를 `{v:1,onboarded:true,...}`로 넣어 온보딩 건너뜀, `UI.go('problem',{pid:'L1P1'})`로 화면 이동.
- 정답 코드 CPython 검증: `verify/run.py` (`verify/extract.js`로 problems.json 추출 후 실행).

## 4. 사용자의 작업 선호 (지켜야 함)
- 한 단계 끝나면 **"다음으로 할 수 있는 선택지 목록"**을 번호로 제시 (열린 질문 금지).
- 설정 바꾸라고 할 때는 **어느 화면 → 어느 섹션 → 어느 칸**인지 위치까지.
- 오래 걸리는 작업은 진행률 % 표시.
- 반복되는 수동 절차를 싫어함("일일이 하라고?") → 자동화해서 링크 하나로 끝나게.
- 답변은 짧게, 결과 먼저.

## 5. 지금까지 반영한 피드백 이력 (최근순)
- v1.3.0 후보 2~7 일괄: ① 레슨 0~4 설명 쉬운 말로(읽는 법·뜻 병기, 몫/나머지 초등 나눗셈 비유) ② **텍스트 모드 따라하기 코치** (`Content.textGuideFor` in 30: L0~L5 정답 코드를 한 줄씩 "뜻 + 이렇게 치세요 + 📋복사"로 자동 생성, 손글 `GUIDES_TEXT[pid]`로 덮어쓰기 가능; `Coach.mount(..., 'text')`, 42 텍스트 분기에 `#pvCoach`) ③ 빈 작업판 **손가락 드래그 데모** (`.bg-demo` CSS 애니메이션, 41 guide; 애니메이션 '끔'이면 숨김) ④ 변수 만들기 창 **추천 이름 칩** (`UI.prompt` `chips` 옵션, 41 `suggest()`: 정답 코드 변수 → 공통 이름) ⑤ **집중 모드** (`settings.focus`, `.pv.focus` 설명 숨김 + `.pv-focusbar`에 제목/설명모달/힌트/선생님; 모바일은 탭이라 버튼 숨김) ⑥ 블록 배율 PC 1.1 / 모바일 0.85
- v1.2.0 **PC↔모바일 기기 연동**(`Sync` in 31): 사용자 GitHub 비공개 gist(`python_academy_save.json`)에 진행 데이터 저장. 토큰(classic, gist 권한)으로 첫 연결 → "연동 코드"(`PA-SYNC:`+base64{t,g})를 다른 기기에 붙여넣기. `Store.save()`가 `updatedAt` 찍고 3초 디바운스로 push, 시작·탭 복귀·online 때 pull→`merge`(진행은 max/합집합, 설정·문자열은 최근 쪽, `resetAt`이 더 새로우면 그쪽 통째). API 키는 동기화 제외. 설정 카드 `Sync.card()/bind()`, 상단바 ☁ 아이콘. 스텁 테스트: scratchpad `sync_test.js` 패턴(가짜 fetch).
- v1.1.2 L3 설명에서 `+ - *` 한 칩 → 기호별 칩으로 분리
- v1.1.1 L2P5/L3P1 기본값 a=3, b=4 (곱과 합이 같아지는 2,2 방지)
- v1.1.0 **블록 문제 "따라하기" 코치**(`Coach` in 42, 데이터 `GUIDES` in 24, 자동생성 `Content.guideFor` in 30) · 블록 스냅 반경 64px
- v1.0.9 Blockly 변수 만들기 창을 브라우저 prompt 대신 앱 모달로(`Blockly.dialog.setPrompt`, `UI.prompt`에 hint/ok 옵션)
- v1.0.8 설명 속 `<code>` 칩: 줄바꿈 금지 + 고대비(호박색) `--code-bg/fg/bd`
- v1.0.7 "채점하기" → "제출하기"
- v1.0.6 블록 작업판 확대(`.pv.mode-block` 24%/76%, `#view.view-problem` 1720px, `.bed` 높이 최대 600)
- v1.0.5 카테고리 1개면 flyoutToolbox, 빈 작업판 안내 오버레이(`.bed-guide`), 메뉴 자동 열기, 메뉴 버튼화
- v1.0.4 용어 `dfn.term` 굵기 800/1.12em
- v1.0.3 이하: 본문 버튼명 `.uibtn` 칩, 폰트 확대 방지, 모바일 Worker 폴백, GitHub Pages 배포 구축

## 6. 열려 있는 다음 후보 (사용자에게 선택지로 제시했던 것)
1. 기기 연동(v1.2.0)·v1.3.0 기능들 실사용 피드백 반영 (사용자가 브라우저에서 확인 후 스크린샷)
2. 텍스트 코치를 L6 이후로 확장 (또는 손글 `GUIDES_TEXT` 보강)
3. 레슨 5 이후 설명 재점검

## 7. 핵심 데이터 규칙 요약
- 문제 스키마는 `src/20_content_a.js` 맨 위 주석. `vary:{a:[lo,hi]}`의 **기본값은 lo**(`Content.defaultParams`) — 기본값끼리 겹치는 출력이 안 나오게 주의.
- 테스트는 최소 2개(1개면 복제), 마지막 1개 숨김.
- 코치 가이드 `GUIDES[pid] = [{t:'HTML 설명', c:'코드에 포함될 문자열' | ['여러개'] | '@var:이름' | '~정규식', cat:'강조할 메뉴'}]`, 마지막 단계는 c 없이 "실행 → 제출" 안내. 없는 문제는 정답 코드 줄에서 자동 생성.
- Blockly 한글 라벨 오버라이드는 `41_ui_editors.js` `Blocks.setup()` (`출력 %1`, `%1 = %2`, `만약/아니고 만약/아니면`, `i 를 1 부터 5 까지 반복` 등). 안내 문구는 이 라벨과 일치시킬 것.
