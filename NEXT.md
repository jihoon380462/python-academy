# NEXT — 남은 작업 뼈대 (다음 모델/세션용 작업 지시서)

> v2.2.0까지는 Fable 5.1이 만들었다. 이 문서는 **그 다음 작업을 다른 모델(Opus 등)이 이어서 할 수 있게** 큰 뼈대를 적어 둔 것이다.
> 읽는 순서: `HANDOFF.md`(상태판·작업 방법·사용자 성향) → 이 문서 → 해당 WP가 가리키는 `EXPANSION.md` 절 → 코드.
> 한 작업 패키지(WP) = 한 버전 = 한 배포. WP 안의 단계는 적힌 순서대로, 단계마다 검증을 돌린 뒤 다음으로.

## 0. 공통 규칙 (모든 WP)

1. **시작**: 저장소 attach → `HANDOFF.md` 0절 상태판 확인 → 이 문서에서 WP 하나를 고른다(사용자가 번호로 지정). 사용자에게 "시작합니다 + 단계 목록 + 예상 진행률"을 한 줄로 알리고 바로 작업.
2. **빌드 없음**. 파일이 곧 배포물. `<script>` 로드 순서(각 코스 `index.html`)는 바꾸지 않는다. 전역 const 구조(`CONFIG`·`LESSONS`·`PROBLEMS`…)와 `core/engine.js`의 `Content`·`Grader` API를 깨지 않는다.
3. **검증 명령(푸시 전 필수, 순서대로)**:
   ```
   node tools/stamp.mjs && node tools/validate_content.mjs && node tools/extract.mjs tools/.out && python3 tools/run_solutions.py && node tools/test_shell.mjs && python3 tools/regress.py
   ```
   `regress.py`는 헤드리스 크롬(file://, CDN 없음 → Pyodide·Blockly·CodeMirror 폴백). 새 화면·요소를 추가하면 거기에 `check(...)` 한 줄을 보탠다.
4. **버전**: `core/config.js`의 `APP_VERSION`을 올리고 `node tools/stamp.mjs`. WP-A(피드백·보강)는 패치(2.2.x), WP-B는 2.3.0, SQL 2.4.0, 웹 2.5.0, WP-C/WP-D(Phase 5)는 2.6.0 (EXPANSION.md 1절 표).
5. **같은 커밋에 반드시**: `HANDOFF.md` 0절 상태판(현재 버전·마지막 작업·다음 후보), `CHANGELOG.md`(사용자가 보는 변화 → 내부 변화 순), 설계가 바뀌면 `DESIGN.md`(새 절: "임의로 정한 수치 / 지시서와 다르게 한 것과 이유 / 알려진 한계 / 파일별 용량"), 문제가 늘면 `PROBLEMS.md`.
6. **커밋·배포**:
   ```
   git -c user.name="jihoon380462" -c user.email="jihoon380462@users.noreply.github.com" commit -m "vX.Y.Z: 한 줄 요약" && git push origin main
   gh run list --workflow "Deploy to GitHub Pages" --limit 1   # verify(validate+run_solutions) 통과 → deploy
   ```
   커밋 메시지 끝에 그 세션의 Co-Authored-By/Claude-Session 줄(시스템 안내대로). 배포 확인 뒤 사용자에게 **"vX.Y.Z 배포 완료, Ctrl+F5"**.
7. **사용자 성향**(HANDOFF 4절): 한국어, 짧게, 결과 먼저. 설정을 바꾸라고 할 땐 "어느 화면 → 어느 카드 → 어느 칸"까지. 오래 걸리면 진행률 %. 끝나면 **"다음 옵션 번호 목록"**을 반드시 제시(열린 질문으로 넘기지 않기). 사이트 피드백은 스크린샷 + "이거 고쳐" 식으로 온다.
8. **하지 말 것**: 빌드 도구·프레임워크 도입, 저장 스키마 v2 키 이름 변경(`core/storage.js` 머리말), 러너 CDN 버전 변경, 문제 id 변경(진행 데이터가 id로 저장됨), 기존 보스 stat 이름 변경(`boss_<lessonId>`, 허브 해금이 본다).

## 1. WP 목록과 추천 순서 (2026-11-02 사용자 결정: **터미널·Git은 보류**, 파이썬·알고리즘·전체 기능 개선·실전 프로젝트에 집중)

| WP | 내용 | 버전 | 크기 | 상태 |
| --- | --- | --- | --- | --- |
| **WP-A** | 알고리즘 코스 보강(점검 목록 반영) + v2.2.0 실전 챕터 실기기 피드백 | 2.2.x | 중 | **1차 완료(v2.2.2)** — A-1·A-3 반영, A-2는 F2 슬라이더만 남음 |
| **WP-F** | 전체 기능 개선 백로그(두 코스 공통 엔진·허브·학습 기능) | 2.2.x | 중 | **진행 대상** — 아래 목록에서 사용자가 번호로 고른다 |
| **WP-G** | 실전 프로젝트 확장(코스당 프로젝트 추가 + 실전 공통 기능) | 2.2.x | 중 | **1차 완료(v2.2.3)** — G1·G2·G3·G4·G5·G6 반영 |
| WP-B | Phase 2 터미널·Git | 2.3.0 | 대 | **보류** (뼈대만 있음) |
| WP-C | 9절 ③ 캡스톤 | 2.6.0 | 중 | 보류 (코딩테스트 도전만 지금 가능) |
| WP-D | 9절 ④ PC형 실전 | 2.6.0 | 중 | 보류 (WP-B의 TG 레슨 전제) |

패치 버전은 WP를 섞어도 된다(예: v2.2.2 = WP-A 1차 + WP-F 2개). CHANGELOG에 어떤 WP의 어느 항목인지 적는다.

### WP-F. 전체 기능 개선 백로그 (후보 — 사용자가 고른 것만)

| # | 항목 | 어디 | 비고 |
| --- | --- | --- | --- |
| F1 | 복습 큐를 허브에서 코스 공통으로(지금은 파이썬만 `Review.due`) | `core/game.js` Review, `core/hub.js` | 알고리즘 틀린 문제도 복습 |
| F2 | 알고리즘 `example.slider:{var,min,max,step}` — n을 끌면 예제가 다시 실행되고 시간이 그래프로 | `core/ui-views-main.js` 레슨 예제, `core/visualize.js` | 지시서 5절 미구현 |
| F3 | 학습 통계 화면(요일별 푼 문제·정답률·약점 태그 추이) | 새 `Views.stats`(`core/ui-views-more.js`), `Store.data.days`·`stats` | 그래프는 visualize bars 재사용 |
| F4 | 문제 검색·필터(제목/태그/상태) 홈 지도 위 | `core/ui-views-main.js` home | 모바일에선 칩으로 |
| F5 | 선생님(튜터) 개선: 현재 문제의 테스트 실패 내용을 자동으로 같이 보내기, 답변에 코드 블록 복사 버튼 | `core/tutor.js` | 키 없는 사용자 영향 없음 |
| F6 | 키보드 단축키 안내 모달(?) + Ctrl+Enter 실행/Ctrl+Shift+Enter 제출/Esc 닫기 | `core/ui-core.js` | PC만 |
| F7 | 오프라인 캐시(Service Worker로 core·content·CDN 러너 캐시) | 새 `sw.js`, 허브·코스 index.html 등록 | Pyodide 10MB+ 캐시 용량 주의, `?v=` 규칙과 맞추기 |
| F8 | 진행 데이터 내보내기/가져오기(JSON 파일) 설정 카드 | `core/ui-views-more.js` settings | gist 연동 없는 사용자용 백업 |
| F9 | 접근성: 포커스 링·aria-label·명도 대비, 글자 크기 단계 추가 | `core/ui.css`, `data-font` | |
| F10 | 레슨 안 "이해했어요/모르겠어요" 버튼 → 모르겠으면 선생님 질문 프리셋 또는 쉬운 예제 1개 더 | 레슨 뷰, `CHECKUPS` | |
| F11 | 뱃지 알림 모아 보기·프로필 공유 카드(PNG 저장) | `Views.profile`, canvas | |
| F12 | 모바일 코드 입력 보조: 들여쓰기 ±, 자주 쓰는 기호 칩(`: ( ) [ ] " =`) 키보드 위 고정 | `core/ui-editors.js` TextEditor | 알고리즘 코스에서 특히 필요 |

### WP-G. 실전 프로젝트 확장 (9절 ② 층 심화)

| # | 항목 | 비고 |
| --- | --- | --- |
| G1 | 파이썬 실전 3·4: **할 일 관리 앱**(JSON 저장·우선순위·마감 정렬, 명령 루프) / **가계부 분석기**(월별·카테고리 집계, 그래프 대신 텍스트 막대, CSV 업로드) | X1·X2와 같은 스키마(`project.steps`·`stage`·`files`) |
| G2 | 알고리즘 실전 3·4: **시험 시간표 짜기**(그리디·힙, 충돌 없는 배정) / **친구 추천**(그래프 BFS 2단계 이웃·공통 친구 수 정렬, 그래프 시각화) | `visualize` 필수 |
| G3 | 실전 공통: 🏆 **내 작품 갤러리** 개선 — 프로젝트 카드(단계 체크 요약·업로드 파일명·완성일), 코드 복사/`.py` 내려받기, 다시 열기 | `Views.playground` works 영역 또는 새 `Views.works` |
| G4 | 실전 공통: 완성 시 **선생님 코드 리뷰**(키 있을 때, `Tutor.review`) 결과를 작품 카드에 저장 | WP-C 4단계와 공유 |
| G5 | 실전 공통: 프로젝트 **자유 확장 모드** — 클리어 뒤 "더 만들어 보기" 제안 3개(체크리스트 추가 단계, 채점 없음, XP 소액) | `project.extra:[...]` |
| G6 | 실전 공통: 업로드 파일 인코딩(CP949) 자동 처리, 내려받기 파일명에 원본 이름, 미로 입력칸 여러 줄(WP-A-3과 동일 — 먼저 하는 쪽에서 처리) | |

---

## WP-A. 알고리즘 코스 보강 (v2.2.1 ~)

**근거**: v2.1.3에서 파이썬 코스에 한 것과 같은 "직접 플레이 점검"을 알고리즘 코스에도 하기로 했다. 사용자에게 전달한 20항목 목록은 채팅에만 있고 저장소엔 없다 → 아래는 **스크립트로 다시 뽑은 사실 기반 목록**(2026-11-02, `tools/load_content.mjs`로 계산). 사용자가 채팅의 목록을 주면 합친다.

**A-1 콘텐츠 보강 (파이썬 v2.1.3과 같은 기준)** — `courses/algo/content.js`
- 힌트가 25자 미만(한 단어·한 구절)인 문제 **83개**: 3단계 힌트를 "어디에 무엇을 어떻게 쓰는지" 코드 조각 형태로. 기준 예시는 파이썬 `L8P3`·`B3P1` 힌트. 대상 id: A0P1,A0P2,A0P5,A1P1~A1P5,A2P1,A2P2,A2P3,A2P5,A3P1,A3P2,A3P5,A4P1~A4P5,A5P1~A5P5,A6P1~A6P5,A7P1~A7P5,A8P1,A8P4,A8P5,A9P1~A9P4,A10P1~A10P5,A11P1~A11P5,A12P1,A12P2,A12P3,A12P5,AB3P2,A13P1,A13P2,A13P4,A13P5,A14P1,A14P3,A14P4,A14P5,A15P1~A15P5,AB4P1,AB4P3,AB4P4,AB4P6~AB4P15. 모의고사(AB4Px)는 정답 방향만(복잡도·자료구조) — 코드 힌트 금지(DESIGN 12절 결정).
- `code` 문제인데 시작 코드(`starter`) 없음 **41개**: A0P3,A2P4,A3P3,AB1P1,AB1P2,A4P4,A4P5,A6P3,A6P4,A7P5,A8P3,A8P4,AB2P1,AB2P2,A11P3,A11P4,A11P5,AB3P1,AB3P2,A13P4,A14P3,A14P4,A15P2~A15P5, AB4P1~AB4P15. 보스·모의고사는 입력 읽기 틀만(`import sys; data = sys.stdin.read().split()` + `# 여기에`), 일반 문제는 함수 틀 + `pass`.
- 지문 40자 미만 **32개**: A0P1,A0P5,A1P1~A1P4,A2P1,A3P1,A3P2,A4P1,A4P2,A5P1,A5P3,A5P5,A6P1,A7P1,A7P4,A8P1,A9P1,A9P5,A10P1,A10P5,A11P1,A11P2,A12P1,A12P2,A12P5,A13P1,A13P2,A13P5,A14P1,A15P1 → "왜 이걸 하나" 한 마디 + 입출력 예 한 줄.
- 레슨 예제 중 `trace`도 `visualize`도 없는 11개(A0p0,A0p1,A1p0,A1p2,A3p1,A6p2,A7p1,A7p2,A8p0,A11p2,A13p2): 가능한 것은 `trace:true` 또는 `visualize`.
- `code` 문제 62개 중 시각화 없는 16개: 자료구조가 보이는 문제면 `visualize` 추가(변수 이름 안내 문구 "변수 이름은 ○○" 지문에 포함 — DESIGN 12절 규칙).
- 레슨 E1·E2(실전)는 페이지 2개 — 지시서 기준 2~3개면 충분. 손대지 않아도 됨.

**A-2 UX (파이썬 v2.1.2/v2.1.3에서 한 것 중 알고리즘 전용 화면에 빠진 것)** — `core/ui-views-more.js`(Views.mock), `core/visualize.js`
- 모의고사 화면: 시작 전 "3문제·60분·2문제 이상 통과" 안내 카드 + 남은 시간 모바일 상단 고정(`.mock-bar`는 있음, 모바일 폭 390px 확인).
- 시각화 플레이어: 모바일에서 캔버스 폭이 넘치면 `max-width:100%` + 라벨 폰트 축소. 슬라이더 `example.slider:{var,min,max,step}` UI(지시서 5절, 아직 미구현 — HANDOFF 다음 후보 "n 슬라이더").
- 알고리즘 코스 홈에도 파이썬처럼 `.hcont` 이어서 하기 바 동작 확인(공통 코드라 되어야 함 — regress에 check 추가).

**A-3 실전 챕터(v2.2.0) 실기기 피드백 대비** — 자동 검증이 못 본 부분
- X1P1 CSV 업로드: 한글 Windows 엑셀 CSV(EUC-KR/CP949)면 `f.text()`가 깨짐 → `bindRun`의 업로드 처리에서 `TextDecoder('utf-8', {fatal:true})` 실패 시 `euc-kr`로 재시도(`core/ui-views-main.js` `#pvFile onchange`).
- 열 이름이 샘플과 다르면 KeyError → 에러 사전(`shared/errors.js`)에 `KeyError` 항목이 "CSV 열 이름" 경우를 설명하도록 한 줄 추가.
- 📥 내려받기 파일명: 지금은 `result.csv` 고정 → 업로드한 원본 이름을 붙여 `result_<원본>.csv`로 (`st.upload.origName` 이미 있음).
- E1P1 미로: 입력칸이 한 줄짜리면 미로 그리기가 불편 → 문제에 `files`가 없어도 `inputExample` 줄 수가 3 이상이면 입력칸 `rows`를 줄 수에 맞춤(`ioHtml`).

**완료 기준**: validate·run_solutions·regress 통과, 위 수치가 0(또는 의도적으로 남긴 것은 DESIGN에 이유). CHANGELOG에 항목 수를 적는다.

---

## WP-B. Phase 2 터미널·Git 코스 (v2.3.0) — 설계 EXPANSION.md 6절

**이미 있는 뼈대 (v2.2.1에서 추가)**
- `core/runners/shell.js` — VFS + 셸 8개 명령(pwd ls cd mkdir touch cat echo rm) 동작, `Shell.COMMANDS` 지원 명령 표(impl 플래그), `exec()`가 `&&`/`;` 처리, `state()`가 채점용 스냅샷, `gitModel()` 초안. 자가 테스트 `tools/test_shell.mjs`.
- `courses/terminal-git/` — `course.json`, `index.html`(셸 러너 로드, UI 파일 자리 표시), `content.js`(레슨 17 + 보스 3 **제목·요지·요약**만, 페이지 본문은 TODO, 문제 0, 문제 스키마 머리말).
- `core/config.js` COURSES에 `terminal-git`은 `phase:2` 자리표시자(허브에 "준비 중" 카드).

**단계** (각 단계 끝에 검증 명령 전부 통과시킨 뒤 다음으로. 진행률 안내용 가중치 괄호)

1. **셸 명령 완성 (10%)** — `shell.js` `cmds`에 cp(-r) mv head tail(-n) wc(-l -w -c) grep(-n -i -r) find(-name) tree history clear edit. `exec()`에 파이프 `|`(왼쪽 out → 오른쪽 stdin: cmds 시그니처에 `stdin` 추가), 리다이렉션 `> >>`(마지막 토큰 파싱 후 파일에 쓰기), 와일드카드 `*`(argv 단계에서 cwd 기준 확장), `$HOME`·`$USER`. 에러 문구는 실제 bash 원문. `COMMANDS[x].impl=true`로 바꾸고 `test_shell.mjs`에 명령마다 케이스 2개 이상.
2. **에러 사전 셸 섹션 (3%)** — `shared/errors.js`에 `ERRORS.shell`(영문 원문 정규식 → 한국어 풀이·해결) 10개: command not found, No such file or directory, Is a directory, Not a directory, Permission denied(시뮬에선 /etc 등 보호 폴더), File exists, missing operand, it is dangerous to operate recursively, git: not a git repository, nothing to commit.
3. **Git 시뮬레이터 (20%)** — `shell.js` `gitModel()`을 실제 객체로: `git init`(`.git` 숨김 폴더 표시용 더미), `status`(untracked/modified/staged 분류 = 작업 트리 vs HEAD 스냅샷 vs staged), `add`(파일·.·-A, .gitignore 적용), `commit -m/-am`(해시 = 7자리 결정적: 커밋 순번+메시지의 FNV 해시 → 테스트 재현 가능), `log --oneline --graph --all`, `diff/--staged`, `restore/--staged`, `reset --soft/--mixed/--hard HEAD~n`, `branch/-d`, `switch/-c`, `checkout`(호환), `merge`(ff / 3-way / 충돌 마커 삽입 `<<<<<<< HEAD` …), `merge --abort`, `rebase`(기본: 현재 브랜치 커밋들을 대상 끝에 재적용, 충돌 시 중단), `stash push/pop/list`, `commit --amend`, `remote add`, `push -u origin main`, `pull`, `clone`(remote → 새 폴더), `tag`. 원격은 같은 모델의 두 번째 객체(`sh.remote`). "동료가 푸시했어요" 시뮬은 문제의 `setup.remoteCommits:[{files, message}]`로 원격에 커밋을 미리 쌓는다. `state().git`에 채점 항목(commits 수, branches, head, staged, remoteBranches, 충돌 마커 유무) 포함. `test_shell.mjs`에 시나리오 테스트: 기본 3커밋, 브랜치+ff, 3-way, 충돌 해소, reset 3종, stash, push/pull.
4. **엔진 러너 디스패치 (12%)** — 지금은 `Py.*`를 직접 호출. 바꿀 곳:
   - `core/engine.js` `Grader.runTests`: 문제의 `type==='mission'` 또는 `COURSE.runner==='shell'`이면 `Grader.runShell(p, tests)` → 각 테스트(미션은 테스트 대신 `expect` 하나)를 `Shell.create(p.setup)`에 `solution`/사용자 명령 히스토리를 넣고 `Grader.matchState(state, expect)`로 비교. `matchState`는 expect에 적힌 키만 비교(cwd, cwdStartsWith, files{path:content|null}, dirs[], commits, branches(집합), head, staged, remoteBranches, noConflictMarkers, forbid[] (history 검사)). 결과 형식은 기존 `results[]`(ok/expected/actual/note)와 같게 해서 문제 화면 테스트 목록·`autoCheck`가 그대로 돈다.
   - `core/ui-views-main.js` 문제 화면: `p.type==='mission'`이면 에디터 대신 **터미널 뷰**(5단계)를 작업 탭에 넣고, 명령 한 줄 실행마다 `Shell.state()`로 `goals[]`를 대조해 체크리스트 갱신(`st.autoCheck`와 같은 자리 `Store.data.lessons['proj_'+pid]`), ✔ 제출은 `Grader.runTests`. "처음부터" 버튼 = `Shell.create(p.setup)` 재생성. 퀴즈(`kind:'cmd'`)·빈칸·Parsons는 기존 뷰 그대로(Parsons 채점만 `parsons.solution`을 셸로 실행해 `expect` 비교).
   - 레슨 예제: `page.example.shell`이면 예제 칸이 작은 터미널(한 줄씩 ▶ 실행, `setup` 초기화). `core/ui-views-main.js` 레슨 뷰의 example 렌더 분기.
   - 놀이터(`Views.playground`): `COURSE.runner==='shell'`이면 자유 터미널(폴더 상태 `Store.data.playgroundShell`에 저장 — storage COURSE_FIELDS에 키 추가).
   - `tools/run_solutions.py`: runner `shell`이면 `node tools/run_mission.mjs problems.json`(새 파일: 각 미션의 `solution` 명령들을 Node 셸에서 실행해 `expect`와 대조)을 호출. `tools/load_content.mjs` `flatProblems`에 `setup/expect/goals/forbid` 포함.
   - `tools/validate_content.mjs`: `mission`은 `setup.tree`·`expect`·`solution`·`goals≥2` 필수, `goals[].expect` 키가 matchState 허용 키인지 검사.
5. **UI 화면 (18%)** — 새 파일 `core/ui-views-terminal.js`(알고리즘의 `visualize.js`처럼 이 코스만 로드, `index.html` 자리 표시 주석 위치에 추가) + `core/ui.css` 섹션 `/* ===== terminal ===== */`:
   - 터미널 창: 검은 배경, 프롬프트 `me@academy:~/projects (main)$`, 입력 한 줄, 출력 누적, ↑↓ 히스토리, Tab 자동완성(`Shell.COMMANDS` + 현재 폴더 항목), Ctrl+L. 모바일(≤640px): 입력칸 위에 칩 행 `ls cd .. mkdir git status git add . git commit -m "" | > ~ /`.
   - 파일 트리 패널(PC 오른쪽 / 모바일 위, 접기 가능): `Shell.state().tree`를 매 명령 뒤 다시 그림, cwd 강조, 사라진 항목 0.3초 페이드.
   - 3칸 상태 뷰(레슨 7~9, 문제에 `views:['stage']`): 작업 폴더 / 스테이징 / 저장소 칸 사이로 파일 칩이 이동(CSS transition).
   - 커밋 그래프 패널(`views:['graph']`): SVG, 커밋=원(해시 7자리), 브랜치 라벨, HEAD 화살표, merge는 두 부모 선. 명령마다 diff 애니메이션(새 커밋 scale-in, 라벨 translate).
   - 가짜 GitHub 탭(`views:['remote']`, 레슨 11부터): 원격 파일 목록·커밋 수·브랜치, "동료가 커밋을 푸시했어요" 배너(setup.remoteCommits).
   - 충돌 편집창: `edit 파일` 시 마커가 있으면 "내 것 유지 / 상대 것 유지 / 직접 편집" 버튼.
   - regress: 미션 문제 열기 → 명령 입력 → 트리 갱신 → 체크리스트 체크 → 제출 클리어 흐름 + 모바일 390px 가로 스크롤 없음.
6. **콘텐츠 (25%)** — `courses/terminal-git/content.js`: 레슨 17개 페이지 3개씩(개념 → 명령 → 실수와 에러, `example.shell`), 문제 70+ (미션 40: 레슨당 2 + 보스 3×2 / 퀴즈·명령 맞히기·빈칸·Parsons 30). 보스 3개는 `tests`(미션은 expect) 5개 이상 규칙 대신 `goals` 5개 이상(validate에 분기). 용어는 레슨 `terms`로(validate가 `[[용어]]` 검사). `WEAKNESS_TAGS` 사용. 문제 id는 `T<레슨>P<n>`, 보스 `TB<n>P<n>`.
7. **실전 챕터 D + 보너스 TG (7%)** — 9절 ②: `TX1` "내 프로젝트를 GitHub에 올리기(시뮬)" 4단계(init → .gitignore → 커밋 3개 → push), `TX2` "동료와 2주 협업(시뮬)" 4단계(브랜치 → PR 흉내(merge) → 충돌 해소 → 깨끗한 로그). `practical:true` + `project.steps` + `tests[].stage`(미션은 `stages[]`로 단계별 expect — `autoCheck`가 stage 결과로 체크). 마스터 뱃지 `master_terminal-git`(🎧👑) `shared/badges.js`. 보너스 레슨 `TG` "컴퓨터에서 이어가기"(개발 환경 가이드, 실행 없는 체크리스트 12항목: 파이썬 설치·VS Code·터미널 열기·가상환경·pip·Git 설치·git config·GitHub 계정·토큰·첫 push·.gitignore·README; 체크 상태 `Store.data.lessons['guide_TG']`) — WP-D의 전제.
8. **마무리 (5%)** — `core/config.js` COURSES terminal-git을 `ready:true, path:'courses/terminal-git/', total:N, lessons:N, requires:{course:'python', boss:'B2', label:'파이썬 챕터 2 보스 클리어'}`(validate가 수와 대조), 허브 카드 색 `#607d8b`. 튜터 페르소나는 `COURSE.tutorPersona`(이미 있음). `DESIGN.md` 14절(지원 명령 표 = `Shell.COMMANDS`에서 생성, 임의 수치: 해시 규칙·XP·미션 수, 지시서와 다른 점, 한계), `PROBLEMS.md` 코스 3 표, CHANGELOG v2.3.0, HANDOFF 상태판(Phase 3 → v2.4.0).

**지시서와 달라도 되는 것(미리 결정)**: `nano/vim` 대신 `edit` 가상 편집기 1개. `rebase -i`·`cherry-pick`·`bisect`는 범위 밖(레슨 15 시나리오는 branch+reset으로 푼다). 권한(chmod)·사용자·프로세스 명령 없음.

---

## WP-C. 9절 ③ 허브 통합 프로젝트(캡스톤) — Phase 5(v2.6.0), 설계 EXPANSION.md 9절 ③

**구조 결정(권장)**: 캡스톤은 "코스"가 아니라 **허브의 구역**이지만 콘텐츠·채점은 코스 엔진을 그대로 쓰는 게 싸다 → `courses/capstone/`을 숨은 코스로 둔다(`CONFIG.COURSES`에 `hidden:true`, 허브 코스 목록엔 안 나오고 "통합 프로젝트" 구역이 카드로 링크). 문제마다 `runner`가 다르다(`p.runner:'python'|'sql'|'shell'|'web'`) → WP-B 4단계의 러너 디스패치를 **문제 단위**로(`p.runner || COURSE.runner`). `index.html`은 필요한 러너를 전부 로드.

1. 데이터: `academy.profile`에 `capstones:{[id]:{stage, done, savedAt}}`(공통 조각, sync 병합은 max). `Store.COURSE_FIELDS`에 넣지 말 것(코스 조각이 아님).
2. 허브(`core/hub.js`): 완주(`cleared>=total`)한 코스가 2개 이상이면 "🏗 통합 프로젝트" 구역. 카드 4개(가계부 앱 파이썬+SQL · 포트폴리오 사이트 웹+터미널·Git · 코딩테스트 도전 알고리즘 · 카페 주문 시스템 파이썬+SQL+웹), 필요한 코스를 못 끝냈으면 🔒 + 부족한 코스 이름. 설정 "전제 무시"가 켜져 있으면 열림.
3. 콘텐츠: 각 캡스톤 = 레슨 1개(`practical:true`, 소개 페이지 2개) + 문제 1개 `project.steps` 8~12 + `tests[].stage`. 단계마다 `runner`가 다를 수 있으니 테스트에 `runner` 허용(없으면 문제 runner). **지금 당장 가능한 것은 "코딩테스트 도전"**(알고리즘만): 모의고사 3회분 풀(`Sessions.mock`를 `mockSet:'cap1'`로 재사용), 회차별 난이도 상승, 점수 추이 미니 그래프(`core/visualize.js` bars 재사용). 나머지 3개는 SQL(2.4.0)·웹(2.5.0) 뒤.
4. 선생님 전체 리뷰: 클리어 시 `Tutor.review(codeAll)`(키 있을 때만) → 결과를 내 작품 카드 메모로 저장.
5. 보상: 완성작 → `Store.data.works`에 `{kind:'capstone'}` 카드, 프로필 "완성한 프로젝트 n개", 마스코트 최상급 장비(`shared/badges.js` INVENTORY 왕관 `cond:['capstones',1]`).
6. 검증·문서: validate에 `hidden` 코스는 totals 검사 제외, regress에 허브 구역 체크, DESIGN 새 절, CHANGELOG, HANDOFF.

---

## WP-D. 9절 ④ PC형 실전 — Phase 5(v2.6.0), 설계 EXPANSION.md 9절 ④ (전제: WP-B 7단계 TG 레슨)

1. **허브 구역** "💻 컴퓨터에서 하기": `Store.data.lessons['guide_TG']` 체크리스트가 전부 체크되면 열림(또는 전제 무시). 프로젝트 카드 3개: 폴더 정리 스크립트(실제 파일 이동, 확장자별 폴더) · 날씨 API 호출(`requests`, 무료 API 키 없이 되는 Open-Meteo) · 내 PC의 CSV 집계(X1P1의 PC판). 카드 → `Views.pcProject(id)`(새 화면, `core/ui-views-more.js`).
2. **콘텐츠** `courses/pc/content.js`(숨은 코스, runner `'none'`): 프로젝트 = 레슨(설명 2페이지) + 문제 `type:'pc'`(★ 새 유형: 채점은 토큰 대조), `steps[]`(체크리스트, 스크립트가 단계마다 출력하는 문구와 1:1), `script`(파이썬 코드 템플릿, `{{NICK}}` `{{PID}}` 자리표시), `summaryKeys:['moved']`(토큰에 섞는 결과 요약 키).
3. **토큰**: 스크립트와 앱이 **같은 식**으로 계산. `token = base32(FNV1a32(nick + '|' + pid + '|' + summary))[:8]`을 `XXXX-XXXX`로. 파이썬 쪽은 표준 라이브러리만(`hashlib` 말고 직접 FNV — 앱 JS와 1:1 같은 정수 연산). `summary`는 스크립트가 출력하는 결과 줄(예: `moved=12`)이므로 사용자가 앱에 **토큰과 요약 줄 둘 다** 붙여 넣는다(앱이 요약으로 토큰을 재계산해 대조 — 서버 없음). 구현 위치: `core/engine.js` `Grader.pcToken(nick, pid, summary)` + 스크립트 템플릿의 `def _token(...)`.
4. **흐름 UI**: 카드 → 설명·체크리스트 → 📥 `.py` 내려받기(`{{NICK}}`·`{{PID}}` 치환, `Blob` 다운로드 — v2.2.0 `#pvOutFiles` 내려받기 코드 재사용) → "터미널에서 `python 파일.py`" 안내(TG 레슨 링크) → 결과 붙여넣기 칸 → 검증 → 클리어(XP·내 작품 카드 `{kind:'pc'}`). 실패·에러는 스크립트가 한국어로(에러 사전 이름과 같은 용어).
5. 검증·문서: `tools/run_solutions.py`에 `pc` 유형은 "스크립트를 CPython으로 임시 폴더에서 실행 → 토큰 줄이 나오고 앱 식과 같은지" 검사(`tools/pc_token.py` 공용 함수). regress에 화면·다운로드 버튼 체크. DESIGN 새 절, CHANGELOG, HANDOFF.

---

## 부록. 자주 보는 코드 위치 (뼈대 작업 때 확인한 것)

| 무엇 | 어디 |
| --- | --- |
| 문제 화면(에디터·실행·채점·체크리스트·파일 업로드/내려받기) | `core/ui-views-main.js` `Views.problem` — `ioHtml`, `bindRun`, `runCode`, `grade`, `st.autoCheck`, `renderTests` |
| 채점 | `core/engine.js` `Grader.runTests`·`expected`·`testFiles`·`testInput`(inputGen)·`norm` |
| 러너 | `core/runners/python.js` `Py.run({code,input,call,trace,vis,maxsteps,timeoutMs,files,outFiles})` / `core/runners/shell.js` `Shell.create(setup).exec(line)`·`state()` |
| 챕터 해금·보스·마스터 stat | `core/game.js` `chapterOpen`·`lessonDone`·`clearProblem`(`boss_<id>`, `master_<course>`) |
| 허브 카드·잠금 | `core/hub.js` `courseCard`·`locked`(`stats['boss_'+requires.boss]`) · `core/config.js` `COURSES` |
| 저장 스키마·코스 조각 | `core/storage.js` `COURSE_FIELDS`, 키 `academy.*` · 병합 `core/sync.js` |
| 시각화 | `core/visualize.js` 머리말(spec 8종) |
| 검증 | `tools/validate_content.mjs`(스키마·총수·?v=) · `tools/run_solutions.py`(정답 실행, files/outFile/stage) · `tools/regress.py`(헤드리스) · `tools/test_shell.mjs` |
