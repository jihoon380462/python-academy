# CHANGELOG

배포한 버전마다 한 항목. 형식: `## vX.Y.Z — YYYY-MM-DD` + 바뀐 것(사용자가 보는 변화 → 내부 변화 순). 배포 커밋에 HANDOFF.md 상태판과 함께 포함한다.

## 미배포 (다음 릴리스에 들어갈 것 — 팀 PR 은 여기에 항목만 추가, 버전 머리글은 Fable 이 릴리스 때)

- 📝 문서만(화면 변화 없음 · 11/7 Opus): **N14 T9 리눅스 교과서 설계** `specs/linux-course.md` — 사용자 「T9 리눅스 먼저」. VirtualBox 7.2 + Ubuntu Desktop 26.04 LTS, 챕터 3(연습장 만들기 · 리눅스답게 쓰기 · 시스템 들여다보기) · 레슨 U0~U14 + 보스 UB1~UB3, 터미널·Git 교과서와 겹침 정리, 「먼저 꼭」 7개(가상화 · 🐢 Hyper-V · 메모리 6GB 최소 · 가상 디스크만 지움 · 스냅샷 · sudo · 포트 포워딩), 검사 방법(bash 자동 + ☐), 구현 전 질문 Q1~Q5 → 사용자 결정 11/7 모두 제안대로(TODO D13: 직접 설치 · 🐢 끄는 법+대가·되돌리기 · VM 8GB/CPU 4/40GB · Remote-SSH 넣음).
- 📝 문서만(화면 변화 없음, 버전 그대로 v2.17.1 · 11/6 Opus): **`HANDOFF.md` 를 지금 기준으로 다시 씀**(상태판 · 작업 순서 9단계 · 사용자 선호 · 교과서 구조 · 문서 지도, 옛 판은 `docs/archive/HANDOFF-2026-11-06-old.md`). **`TODO.md` 예정 코스에 공용 5개**: T9 리눅스(VirtualBox + Ubuntu 26.04 LTS) · T1 CS(운영체제는 맛보기) · T2 운영체제(제대로, 우분투에서) · T10 어셈블리어(x86-64 · NASM · 우분투) · T11 LLM 기초(원리 + 아주 작은 모델) — T6 의 언어 모델 맛보기는 T11 로 합침. 0절 「지금 상태」 · N11~N14 · D10 갱신.

## v2.23.1 — 2026-11-07 (Opus: 운영체제 교과서 챕터 2 — CPU 나눠 쓰기와 동기화)

- 📖 **운영체제 챕터 2**(레슨 12 열림 · 챕터 3·4 는 「준비 중」):
  - 레슨 6 스케줄링(문맥 교환 · `voluntary_ctxt_switches` · **간트 차트 그림** · 리눅스 EEVDF · `nice` · `os.nice`) · 7 스레드(메모리를 같이 씀 · `threading.Thread` · `start`/`join` · `Threads:` · `threading.Event` · GIL — 기다리기는 겹치고 계산은 안 빨라짐) · 8 경쟁 상태와 락(읽기 → 더하기 → 쓰기 사이의 끼어들기를 `time.sleep(0)` 틈으로 매번 보이게 · `with lock:` · `dis`) · 9 교착 상태와 큐(**교착 상태 그림** · 네 조건 · `acquire(timeout=)` · `threading.Barrier` 로 재현 · `queue.Queue` 생산자-소비자).
  - **만들어 보기 10개** — 파이썬 8개는 예시 답을 python3 로 실제 실행(시간이 들어가는 결과는 「약 1초인가: True」 처럼 늘 같은 값, 순서가 바뀌는 결과는 정렬해서), 터미널 2개는 ☐(코어 하나에 묶은 두 프로세스의 nice 9:1 · 경쟁 상태 다섯 번). 챕터 끝은 **다운로드 대기열**(일꾼 3명 · 큐 · 락 · Ctrl+C 로 깔끔하게).
- 📐 새 그림 2종(`core/figure.js`): `gantt` — 같은 작업들을 먼저 온 순 · 짧은 것 먼저 · 번갈아(q 조절) 세 줄로, 줄마다 평균 대기(손계산 4 · 3.25 · 4.5 와 같음) · `deadlock` — 일꾼 둘 · 락 둘을 「한 걸음」 씩, 반대 순서면 교착(빨간 글), 같은 순서면 둘 다 끝까지(폰은 설명을 두 줄로). 운영체제 교과서도 수학 교과서의 그림 장치(`figure.js` · `ui-views-math.js`)를 불러 씀.
- 🛠 내부: 허브 카드 운영체제 n/12 · regress 에 간트 차트 · 교착 그림 절.

## v2.23.0 — 2026-11-07 (Opus: T2 운영체제 교과서 챕터 1 — 프로세스)

- 📖 **운영체제 교과서 새로**(허브 「공용」 칸 · 설계 `specs/os-course.md` · 사용자 「전부 추천대로」): 리눅스 교과서에서 만든 **우분투 VM 안의 python3** 로 운영체제를 직접 일으켜 보는 교과서. 이번엔 **시작하기 2쪽 + 챕터 1 프로세스**(레슨 0~5 + 만들어 보기, 레슨 7 열림 · 챕터 2~4 는 목차에 「준비 중」).
  - 레슨 0 운영체제가 하는 일(프로그램 vs 프로세스 · `os.getpid()` · 사용자/커널 모드) · 1 `/proc` 으로 들여다보기(`ps -o pid,ppid,stat,cmd` · `pstree` · `/proc/self/status` · 상태 글자) · 2 `os.fork()`(두 번 돌아옴 · 복사본 · `os._exit` · `os.waitpid` · 종료 코드 · 좀비/고아 · **`flush=True` 가 필요한 이유**) · 3 `os.execvp`(fork + exec + wait = 셸, `cd` 는 셸이 직접, `subprocess.run`) · 4 시그널(SIGINT·SIGTERM·SIGKILL · `signal.signal` · `os.kill` · SIG_IGN/SIG_DFL) · 5 파이프와 리다이렉트(fd 0·1·2 · `os.dup2` · `os.pipe` 로 `echo … | wc -w`).
  - **만들어 보기 13개** — 파이썬 문제 9개는 예시 답을 python3 로 실제 실행해 출력 예와 비교(자식 셋의 제곱을 종료 코드로 · 없는 명령 127 · Ctrl+C 정리 · 손으로 만든 `| sort` · `>>` …), 터미널에서 보는 문제 4개는 ☐. 챕터 끝은 **파이썬 미니 셸 1단계**(`mysh.py`: cd·exit 는 직접 · fork/exec/wait · 없는 명령 127 · Ctrl+C 는 실행 중인 명령만).
  - 「먼저 꼭」 2개: 리눅스 교과서 UB1(Windows 엔 `os.fork` 없음) · `fork` 는 횟수가 정해진 반복만(프로세스 폭탄).
- 🐧 리눅스 교과서·허브 카드: 「앞으로 만들 운영체제 교과서」 → 「운영체제 교과서(공용 칸)」.
- 🐛 만들어 보기의 「끝까지 읽는 프로그램 — Windows: Ctrl+Z → Enter」 팁이 `sys.stdin.readline()`(한 줄 읽기)에도 붙던 것 → `sys.stdin.read(` 일 때만.
- 🛠 내부: `check_book` 의 `BOOK.check = 'os'`(파이썬 실행 + 터미널 문제 ☐ 필수 · 도구 상자는 실행 안 함) · regress 「[운영체제 교과서 v2.23.0]」 절(홈 · 「먼저 꼭」 · KB1 · 도감 · 폰 390 · 허브 카드 n/7) · 허브 카드 10개 · `qa_screens.py` 기본 코스에 os.

## v2.22.5 — 2026-11-07 (Opus: N15 마무리 — 사용자 「전부 추천대로」)

- 🧭 **사용자 결정 D14**(「전부 너의 추천대로」): 설명 쪽의 결과 주석 코드 + 「예제 코드」 상자는 그대로(역할이 다름) · 수학 「먼저 꼭!」 경고 두 번은 그대로(필수 강조) · 「채점·점수·잠금은 없어요」 문구 그대로 · **실전 레슨 순서는 고침**.
- 📚 **목차 순서 = 레슨 번호**: 「한 걸음 더」 를 쓰는 파이썬 실전 5·6(레슨 37·38)과 알고 실전 E5·E6(레슨 29·30)을 「실전」 챕터에서 **「한 걸음 더」 챕터 끝**으로(목차에서 32~36 보다 앞에 있으면서 그 레슨을 쓰던 것). 챕터 끝 「🛠 만들어 보기」 는 늘 그 챕터 맨 뒤.
- 🐧 리눅스: **레슨 9 1쪽에 「안 주면 기본값」(`${1:-.}` · `LIMIT="${LIMIT:-90}"`)과 「이름으로 값 넘기기」(`LIMIT=0 ./check.sh`) 설명** — UB3 예시 답이 설명 없이 쓰던 문법. 예시 답의 `dirname`·`basename`(배운 적 없음) → 레슨 14 에서 배운 `tar -C 폴더 .`. 「필요한 명령」 칩을 실제 코드로(레슨 0 은 `Ctrl+Shift+Esc → 성능`). 레슨 0 「세 겹 그림」 을 글자 그림 → 상자(한글 폭 때문에 세로줄이 어긋남). ☐ 확인 항목 속 명령은 코드 칩.
- ⌨️ Vim: 준비 명령 머리글에 그 문제의 **파일 이름**(폰에서 명령이 다 같아 보이던 것) · 「새 파일 문제는 `:e 파일` 로」 안내 · 아이콘 ⌨ → ⌨️(글꼴에 따라 네모).
- 🌐 웹 레슨 10 「Network 탭」 문제에 확인 3개. 터미널 레슨 3 「code: command not found」 메모를 본문 크기로. 첫 쪽의 꺼진 「← 이전」 은 점선 테두리. 허브 카드의 「공용」 알약 중복 빼고 Vim 카드 문장 끝냄.
- 📝 **N14 T2 운영체제 교과서 설계** `specs/os-course.md`(사용자 「전부 추천대로」 — 다음 코스 1순위): 챕터 4(프로세스 · CPU 나눠 쓰기와 동기화 · 메모리 · 시스템 콜과 파일 시스템) · 레슨 K0~K16 + 만들어 보기 KB1~KB4(끝은 파이썬 미니 셸) · 파이썬 중심(C 는 맛보기) · 브라우저 그림 3종 · 리눅스 교과서와의 경계표 · 「먼저 꼭」 5개.
- 🛠 내부: regress 의 「마지막 레슨」 도 boss 를 챕터 맨 뒤로 보고 찾음. 문서: VISUAL-REVIEW 표 전부 처리(☑ 또는 「그대로 + 이유」).

## v2.22.4 — 2026-11-07 (Opus: N15 전체 시각 검수 반영 — 9코스 + 허브)

- 🔍 TODO N15: 캡처를 눈으로 본 검수 결과 반영. 지난번에 못 받은 「6코스(터미널·GitHub·SQL·웹·Vim·리눅스) + 허브」 는 PC 1440 · 폰 390 으로 다시 캡처해 검수 에이전트 2개가 봄(약 70건). 확실한 것 약 50건을 고침, 의도와 부딪히는 4건은 사용자 선택으로, 나머지는 `docs/VISUAL-REVIEW-2026-11-07.md` 「남은 것」.
- 🎨 공용 화면:
  - **「예시 답 보기」 가 버튼으로** — 테두리 + ▸/▾.
  - **입력 예·출력 예가 한 줄에 한 쌍** — 예가 여럿이면 「예 1」「예 2」 상자(PC 에서 3칸으로 흘러 짝이 어긋나던 것). 출력 예는 줄바꿈하지 않고 칸 안에서 옆으로.
  - 한글은 어디서나 **낱말 단위 줄바꿈**(「건너뛰 / 기」 「교과 / 서」 없음). 글 속 코드 칩은 24자 이하면 한 덩어리, 긴 칩도 한 줄에 안 들어갈 때만 끊김.
  - 옆으로 더 있는 코드 상자는 **오른쪽 끝이 흐려짐**(끝까지 밀면 사라짐) · 40줄 넘는 코드 상자는 상자 안에서 스크롤 · 알고 줄 번호 예제는 그림을 돌릴 때만 높이 제한.
  - 폰: 코드 상자 머리글은 이름(예제 코드) 한 줄 + 설명 다음 줄, 「필요한 문법」 은 코드 → 설명 → 링크 세로, 쌓인 표는 칸마다 이름표(파이썬 · JavaScript, merge · rebase), 도감 레슨 머리의 챕터 이름은 다음 줄.
  - 경로 줄 「LESSON 00」 → **「레슨 0」**, 한 줄 + 말줄임(📚 도감이 늘 오른쪽). 레슨 위 작은 제목은 대소문자 그대로(`for와 range`). 도감 분류 칩은 PC 에서 여러 줄.
  - **「보스」 이름 정리**: 챕터 끝 레슨은 어디서나 「만들어 보기: 과제 이름」(다음 줄 · 제목 · 돌아가기). 본문의 「보스 1」「보스 WB1」「TB2」 도 사람이 읽는 이름으로.
  - 예시 파일 이름 `l05_1.py` → `lesson05_1.py`(「105」 로 읽혀서).
- 📐 수학 그림: 벡터 라벨이 칸 밖으로 잘리던 것 → 칸 안쪽 + 두 라벨이 겹치면 위아래로 비킴 · 폰에서 행렬 글자는 눈금 아래 · 범례는 축 이름(y) 오른쪽부터 · 탐침 값 글자 뒤에 바탕 칸 · `2^7` → `2⁷` · `log_b x` → `log x (밑 b)` · 비트 상자를 키워 세로 가운데 · **폰 sin·cos 그림은 원 위 · 파동 아래**(`figure.mheight`) · 비교할 이론 선이 없는 히스토그램은 처음부터 100번 돌려 둔 상태 · 오프라인 글자 수식 `100101₍₂₎` · `a→`. 본문의 내부 ID(`M4_tangent` 등 13곳) → 「레슨 n」 링크.
- ✏️ 코스별: 파이썬 도감 `&#91;` → `[` · 도감 설명의 「레슨:L11C」 → 「레슨 n」 · X5 「📎 로 올려 보세요」 → diary.txt 안내. 웹 레슨 12·13 첫 안내를 그 과제에 맞게(`meta.makeIntroBy`·`makeTailBy`) · 「필요한 문법」 의 지어낸 말 4개 → 실제 코드 · 「(폰 390px 폭에서)」 중복. Vim 예제 14개의 키 표기 → `<Esc>` `<C-n>`(예시 답과 같게) · 도감 카드 「레슨에서 배운 키」. 리눅스 명령 문제 레슨의 첫 안내(`meta.makeIntroCmd`) · 「앞으로 만들 운영체제·어셈블리 교과서」. SQL 예시 답 버튼 「예시 답(SQL)」/레슨 13 「(파이썬)」(`meta.answerLabelBy`) · EXPLAIN 한 줄 결과의 「0행」 · 경고 버튼 이름. 에러 사전 「무한루프 무한루프」.
- 🛠 내부: regress 의 보스 제목 검사 2개를 새 제목(「🛠 만들어 보기: …」)에 맞춤 · check_book 이 Vim `<C-…>` 줄을 Ex 명령으로 돌리지 않게. `[[레슨:ID]]` 가 `M4_tangent` 처럼 밑줄·소문자 ID 도 받음.

## v2.22.3 — 2026-11-07 (Opus: 사이트 전체 검수 마무리 — 폰·라이트·큰 글자·링크 + UX)

- 🔍 사용자 「중간에 멈추지 말고 전체적으로 검수」: PC(v2.22.2)에 이어 9코스·허브·설정 전 화면을 **폰 390 · 라이트 테마 · 글자 아주 크게(폰)** 로 다시 측정 — 글자 대비 미달 0 · 화면 가로 넘침 0(남은 「넘침」 은 도감 칩 줄 · SQL 결과 표처럼 원래 옆으로 미는 상자). **모든 링크·버튼 2,336개**를 눌러 보고(깨짐 0) 쪽 넘김 631번을 따라가 봄(전부 맞는 쪽).
- ✨ **만들어 보기 끝 → 「다음 레슨 →」**: 레슨 마지막 쪽(🛠 만들어 보기)의 버튼이 목차가 아니라 **다음 레슨 1쪽**으로 가고, 아래에 「다음: 레슨 n 「제목」 · ☰ 목차로」. 시작하기 마지막 쪽은 첫 레슨으로, 코스 마지막 레슨은 목차로. 키보드 → 는 그대로(마지막 쪽에서는 아무 일 없음).
- 🎨 읽기 편하게:
  - 교과서 본문 폭 860 → **780px**(PC 에서 한 줄이 너무 길던 것 — 한글 약 40자 안쪽).
  - 폰(560px 이하)에서 **키·명령 표(kb)가 한 줄씩 세로로 쌓임** — 좁은 칸에 글자가 한 자씩 끊기던 것.
  - 글 속 코드가 줄을 넘어갈 때 양쪽 줄 모두 테두리·여백(box-decoration-break).
  - **라이트 테마 그림 글자**: 밝은 색 글자(노랑·연두 등)를 라이트 바탕에서 진하게(대비 기준 통과).
- 🛠 내부: 화면 검수 도구 **`tools/qa_screens.py`** 를 저장소에 넣음 — 모든 코스의 모든 쪽을 열어 대비·글자 크기·누를 곳·가로 넘침·접힌 코드·긴 제목을 재고 캡처(`--w` · `--theme` · `--font` · `--shots`, 코스 id 로 좁히기). regress 에 「만들어 보기 끝: 다음 레슨 →」 · 「마지막 레슨은 ☰ 목차로」.
- 📝 캡처를 눈으로 본 검수(파이썬 · 알고+수학 에이전트) 결과 33건을 `docs/VISUAL-REVIEW-2026-11-07.md` 에 할 일 표로(반영은 다음 버전 — TODO N15). 「나머지 6코스 + 허브」 결과는 못 받음.

## v2.22.2 — 2026-11-07 (Opus: 사이트 전체 PC 검수)

- 🔍 사용자 「리눅스만이 아니라 전부」: 교과서 9개 + 허브 · 설정 · 용어집 · 에러 사전 **1,046화면**을 PC 1440×900 으로 전부 캡처·자동 측정(글자 대비 · 글자 크기 · 가로 넘침 · 표 끊김 · 그림 깨짐 · 키보드 포커스), 코스마다 특징 화면은 눈으로. 정확성은 코스별 **독립 검수 에이전트 5개**가 공식 문서(docs.python.org · VS Code · docs.github.com · git · sqlite · MDN · vim 소스 · Microsoft)와 직접 실행으로 대조.
- 🎨 공용 화면:
  - 용어 강조(점선 밑줄 낱말)가 어두운 테마에서 대비 **4.08:1**(그림 상자 위 3.23)로 기준 4.5 미달 — 파이썬·알고리즘·수학·터미널 216곳 → 글자용 파란색으로, 이제 1,046화면 대비 미달 0.
  - 「입력 예 (터미널에 치는 값)」 11.6px → 키움.
  - 수학 그림의 글자가 같은 색 도형 위에서 묻히던 것(벤 다이어그램 「A 40%」 등) → 모든 그림 글자에 바탕색 테두리, 벤 다이어그램 A·B 글자는 본문색.
- ✅ 정확성 — 코스별:
  - **파이썬**(13): 디버거 여는 법(▷ 옆 ∨ → Debug Python File / F5 → Python File) · L1 3쪽 제목 SyntaxError → NameError · PATH 를 안 켜면 「아무것도 실행 안 됨」 → 「터미널의 python 만 안 됨」 · install manager(일반 설치 파일은 3.16 부터 없음) 안내 · Stable Releases 「맨 위」 → 「번호가 가장 큰」 · PATH 에러 문구(PowerShell) · f-string 같은 따옴표(3.12 부터 됨) · 엑셀 CSV 는 BOM → `utf-8-sig` · 이 앱 화면 말(📎·📥·빨간 줄·「시작 코드의」) 정리 · `\d` ≈ `[0-9]` · 필요한 문법 링크 2(L22 · 거북이 사각형 range(4)).
  - **알고리즘**(13): 「1초에 1억 번」 은 C++ — 파이썬은 1천만~3천만 번으로 통일(A1·A19·A20, 허용 복잡도 표 O(n²) n ≤ 수천) · 12! 은 파이썬으로 불가능 · 모의고사 위치 · 「다음 챕터의 BFS」 → 챕터 3 · 연결 리스트 O(1) 조건 · 가지치기 「수백 배」 → 수십 배 · find O(n·m) · in 「평균」 O(1) · 문자열 += (CPython 최적화는 보장 안 됨 — PEP 8) · E3 필요한 문법 튜플 순서 3 · dr·dc 쪽 번호 3 · 입력 쪽 번호.
  - **수학**(16): 거듭제곱법은 「절댓값이」 가장 큰 고유값(음수·같은 절댓값이면 오락가락) · 2²⁰ 은 20일째 · 알고리즘 「레슨 21」 → 비트 연산 레슨 · 「M2」 → 역행렬 레슨 · 넓이 배율 = |det|(코드도) · n = 4 의 1.96 구간은 근사(t 값 3.18) · log 올림 실수 오차 · pstdev / stdev · r = 0 은 「직선 관계 없음」 · 정규분포·중심극한정리 단정 완화 · 비둘기집 「같거나」 · 1KB = 1024(KiB) · 이차함수 a = 0 이면 코드가 0 으로 나누던 것 · 「만들어 보기」 필요한 문법 엉뚱한 링크 19(집합·XOR·나머지·map(float)·sin·쪽 번호).
  - **터미널·Git**(4): T16 파일 네 개 · New repository 화면 글자(Add README Off …) · `rm -rf /`(Git Bash 에선 Git 폴더, GNU rm 은 거절) → `rm -rf /c` · reset --hard 는 새 파일(??)은 안 지움.
  - **GitHub**(3): Actions **checkout@v7 · setup-python@v7**(v5 는 Node 20 — 러너에서 빠짐) · 무료 계정은 공개 저장소에서만 Pages · 「Security(and quality)」 메뉴 이름.
  - **SQL**(2): SQLite 는 GROUP BY 규칙을 어겨도 에러 없이 아무 값 · `connect("cafe.db")` 는 터미널 위치 기준.
  - **웹**(5): 환경 변수는 PowerShell `$env:` · 폰으로 보려면 Live Server host 0.0.0.0 · 방화벽 창 안내 · 함수 밖 await 주의 · W13 폴더 경로.
  - **Vim**(4): F6 의 `:terminal` 은 **위** 창 · 설치 화면(한국어 없음 · Welcome · 설치 대상 · Command line support 의 Vim launchers·Add to PATH · Finish) · 시작 메뉴 Vim 9.2 → gVim · 「Hit any key to close this window...」.

## v2.22.1 — 2026-11-07 (Opus: 리눅스 교과서 PC 검수)

- 🔍 사용자 「모바일이 아닌 PC 버전으로 QA·검수 — 정확한지·가독성·시인성·UX·UI」: PC 1280/1440/1920 × 다크·라이트로 71쪽 캡처 + 자동 측정(글자 대비 WCAG 4.5:1 미달 0 · 가로 넘침 0 · 키보드 포커스 테두리 전부 보임) + 눈으로 검수. 정확성은 별도 검수 에이전트가 공식 문서(우분투 26.04 릴리스 노트·VirtualBox 7.2 매뉴얼·Microsoft)와 로컬 bash 로 대조.
- ✅ 정확성(8):
  - **sudo 비밀번호**: 26.04 의 sudo(sudo-rs)는 글자마다 `*` 가 찍혀요 — 「아무것도 안 보이는 게 정상」 을 고침(레슨 3 · 「먼저 꼭」 · 도구 상자).
  - `type -t ls` 는 사용자 터미널에서 `alias`(우분투가 `ls --color=auto` 별명) → 예와 만들어 보기를 `type -t cat`(file)로, `type ls` 설명 한 줄 더함.
  - Resources 는 설정 앱 안이 아니라 **따로 있는 앱**(옛 System Monitor 대신).
  - cups 는 `cups.socket`·`cups.path` 가 다시 켜 줌 → 끄기·켜기 연습을 셋 같이로.
  - 「All packages are up to date」 확인은 단계적 배포(phasing) 때문에 안 맞을 수 있어 「0 upgraded(phasing 으로 남은 몇 개는 정상)」 로.
  - Windows 에서 `ssh ubuntu-study 'tail -3 ~/…'` — 따옴표가 없으면 PowerShell 7.6 이 `~` 를 Windows 집으로 바꿔요.
  - VirtualBox 설치 중 「Visual C++ 2019 Redistributable 필요」 창이 나오면 어떻게 할지 한 줄.
  - 「남은 공간 10% 아래면 업데이트 실패」(근거 없음) → 「거의 다 차면(90% 넘으면 조심)」.
- 🎨 화면(7):
  - 도감 「자주 쓰는 것」 에서 단축키·메뉴 경로(Ctrl+Alt+T · Machine → Take Snapshot …)에 붙던 📋 복사 상자 없앰(공용: 코드가 없는 항목은 상자 없이).
  - 레슨 8 2쪽의 표 두 개가 첫 칸 폭이 달라 어긋나 보이던 것 → 위 표를 목록으로.
  - 보스 2곳 지문의 ①②③ 한 문단 → 번호 목록.
  - 레슨 13 의 긴 PowerShell 한 줄을 글 속 코드 조각 → 코드 상자로.
  - 레슨 14 표 첫 칸의 긴 명령 → `-C 폴더` 로 짧게.
  - 표지 제목 「…리눅스답게 써 보기」 가 넓은 화면에서 「써 보기」 만 둘째 줄 → 「내 PC 안의 우분투로 리눅스 익히기」.
  - 📋 복사 버튼 글자 10.9px → 12.5px(공용).

## v2.22.0 — 2026-11-07 (Opus: T9 리눅스 교과서 챕터 2·3 — 완성)

- 🐧 리눅스 교과서 **레슨 18 전부 열림**(사용자 「1, 2」).
  - **챕터 2 「리눅스답게 쓰기」**: 레슨 5 같은 bash, 다른 집(/ 하나 · /home · 대소문자 · CRLF · man·type) · 6 리눅스 폴더 지도(/etc · /var/log · /usr/bin · /proc · /etc/os-release 를 grep·cut·tr 로) · 7 apt(update·install·remove·autoremove · snap · history.log, 어셈블리 도구 build-essential·nasm·gdb 미리) · 8 사용자와 권한(id · rwx · chmod 600/755/u+x · sudo·chown) · 9 내가 만든 명령(#!/bin/bash · PATH 와 ~/bin · alias · ~/.bashrc 는 >> 로) · 보스 「내 도구 상자」(bigfiles·mkday·diskuse).
  - **챕터 3 「시스템 들여다보기」**: 레슨 10 프로세스(ps·pgrep·htop · & · jobs · fg · Ctrl+C/Z · kill / -9) · 11 서비스와 로그(systemctl · openssh-server 와 ssh.socket · journalctl -u/-f/-b -p err) · 12 디스크와 메모리(df·du·free·lsblk · 스냅샷이 먹는 공간 · 정리) · 13 네트워크와 SSH(NAT · **포트 포워딩 127.0.0.1:2222 → 22** · Windows 에서 ssh · ~/.ssh/config · 키 로그인 · **VS Code Remote - SSH**) · 14 예약 작업(tar · crontab 다섯 칸 · cron 의 짧은 PATH·% 함정) · 보스 「스스로 돌아가는 VM」(nightly 백업 + 디스크 경고 + cron + SSH 로 확인).
  - 만들어 보기 25문제 추가(전체 33): **명령 문제 12개는 준비 명령(`~/linux-study/…`) + 확인 명령 + 「이렇게 나오면 성공」** — check_book 이 bash 로 실제 실행해 검사(권한 숫자 · PATH · alias · du 순서 · tar 목록 · kill 뒤 남은 프로세스 · LIMIT 0/101 로 경고 줄). 나머지는 「내 화면에서 확인할 것」 ☐.
  - 「먼저 꼭」 2개 더(레슨 8 sudo · 레슨 13 Host IP 127.0.0.1), 도감 도구 상자 13 → 27.
- 🐛 **폰에서 표 첫 칸이 낱말 중간에서 끊기던 것**(「Nam e」「Gue st IP」) — v2.19.0 의 「넘칠 때 줄바꿈」 규칙이 첫 칸 최소 너비를 한 글자로 만들어서. 첫 칸은 낱말 단위로만 끊게 고침(공용 CSS — GitHub 교과서 14쪽 · Vim · SQL · 웹 교과서 첫 쪽에도 있던 것). 글자 크기 보통·아주 크게 × 9코스 전 쪽 가로 넘침 0 확인.
- 🧰 check_book: 리눅스 교과서의 명령 결과에서 임시 홈을 `/home/me` 로 보여 줌. regress 리눅스 절: 레슨 18 · 준비 중 0 · U13 포트 포워딩 · U8 명령 문제 모양 · 폰 390px 20쪽.

## v2.21.0 — 2026-11-07 (Opus: T9 리눅스 교과서 챕터 1)

- 🐧 **공용 「리눅스(우분투)」 교과서** 새로(허브 「공용」 칸, 설계 `specs/linux-course.md` · 사용자 결정 D13). 내 Windows PC 의 **VirtualBox 7.2** 에 **Ubuntu Desktop 26.04 LTS** 를 설치해서 쓰는 연습장 — 앞으로 운영체제·어셈블리어 교과서의 연습 환경.
  - **시작하기 3쪽**(준비물 · 명령 줄이 처음이면 터미널 교과서 먼저 · 창 나란히 Win+←/→) + **챕터 1 「우분투 연습장 만들기」**: 레슨 0 리눅스·우분투·가상 머신 · 1 가상화 켜기와 VirtualBox 설치 · 2 VM 만들고 우분투 설치 · 3 첫 부팅 뒤 할 일(업데이트 · Guest Additions · 클립보드 · 한글 입력) · 4 스냅샷 · 보스 「내 우분투 연습장 완성」. 챕터 2·3(레슨 5~14 + 보스 2)은 목차에 「준비 중」.
  - 결정대로: 우분투는 **설치 화면을 직접 보며**(무인 설치 안 씀 — 7.2 와 예전 판의 칸 모양 둘 다 적음) · VM **8GB · CPU 4 · 디스크 40GB** · 🐢 거북이(Hyper-V 계열과 충돌)는 **끄는 법 + 대가(WSL2·Docker·샌드박스·메모리 무결성) + 되돌리기(`bcdedit … auto`)**.
  - 26.04 에 맞춘 것: 데스크톱 최소 메모리 6GB, 커널 7.0 이라 **VirtualBox 7.2.10 이상**, **3D 가속 끄기**(우분투 26.04 공식 알려진 문제), 암호화 화면은 No encryption(가상 머신 경고).
  - 화면 이름은 VirtualBox 7.2 매뉴얼(docs.oracle.com)·우분투 26.04 공식 설치 튜토리얼·Microsoft 지원 문서(메모리 무결성 한국어 경로)로 대조. 우분투 설치 언어는 English(교과서 화면 이름과 같게), 한글은 Korean (Hangul) 입력 소스로.
  - 「만들어 보기」 8문제는 전부 **「내 화면에서 확인할 것」 ☐**(설치·VirtualBox 화면은 자동 검사 불가). 도감 도구 상자 13.
- 🧰 `check_book`: `BOOK.check = 'linux'` 도 GitHub 교과서처럼(화면 문제는 ☐ 필수). id 규칙 `U`·`UB`. regress 에 리눅스 절, 허브 카드 수 9.

## v2.20.0 — 2026-11-07 (Opus: N8 알고리즘 레슨 나누기)

- 📖 알고리즘 교과서에서 한 레슨에 개념이 많던 6~7쪽 레슨 4개를 둘로 나눔(한 레슨 = 개념 하나~둘) — **레슨 32 → 36**:
  - 레슨 6 「정렬 2: 병합 정렬과 퀵 정렬」 + 레슨 7 「정렬 3: 실전은 sorted 와 key」
  - 레슨 21 「문자열 1: 글자 띠·번호·회문」 + 레슨 22 「문자열 2: 글자 세기·아나그램·접두사」
  - 레슨 24 「구현 1: 명령대로 움직이기」 + 레슨 25 「구현 2: 벽 따라 돌기와 동시에 바뀌는 규칙」
  - 레슨 26 「완전탐색: 다 해 보기」 + 레슨 27 「백트래킹과 가지치기」
  - 설명 쪽·예제·👀 그림은 그대로 옮김. 「만들어 보기」 도 그 쪽을 따라 옮기고, 하나만 남는 레슨 3곳에 **쉬운 첫 문제**를 하나씩: 「단어 점수」(ord) · 「명령 사전으로 움직이기」(범위 검사) · 「자물쇠 비밀번호 후보」(product).
  - 그 뒤 레슨 번호가 하나씩 밀림(레슨 7 이진 탐색 → 8 …, 실전 5·6 → 29·30). 본문의 「레슨 N 에서 …」 28곳은 번호를 직접 적지 않고 목차에서 계산하게 바꿔서 번호가 바뀌어도 맞게(옮긴 내용을 가리키던 2곳은 새 레슨으로).
  - 읽은 기록은 그대로(옛 레슨을 다 읽었으면 앞 레슨은 「읽음」, 새로 생긴 레슨은 안 읽음). 「만들어 보기」 파일 이름 예(<code>l07_1.py</code>)도 새 번호.
- 🧰 검사: 알고리즘 id 규칙에 접미 글자(A6B) 허용(파이썬 L4B 와 같게), `check_level` 기준선 갱신(첫 문제 무거움 9 → 7), regress 의 레슨 수 36.

## v2.19.1 — 2026-11-07 (Opus: N7 알고리즘 👀 그림 버그)

- 🐛 알고리즘 교과서 레슨 예제의 **👀 그림으로 보기**(QA #50·#51):
  - `deque` 를 쓰는 예제(A3 줄 서기 · A12 BFS · E4 BFS)에서 「그리기 오류」 가 나던 것 → 상자·대기 줄이 제대로 그려짐(앞=왼쪽).
  - 집합(`set`)을 상자로 그리는 예제(A8 「본 값들」)가 오류였던 것 → 작은 값부터 상자로, 안내도 「집합 · 순서 없음」(줄 서기의 「앞·뒤」 대신).
  - 그래프의 이웃을 집합으로 적은 예제(E4 `{"A": {"B", "C"}}`)에서 선이 엉뚱하게 이어지던 것 → 맞는 이웃으로.
  - 딕셔너리를 표로 그리는 예제(A14 메모이제이션 `memo` · A16 글자 세기 `c` · E5 역색인 `index`)가 늘 「비어 있어요」 였던 것 → **위=키, 아래=값** 표(방금 바뀐 칸은 초록, 키가 많으면 여러 줄로 접고 폰에서도 칸이 화면을 채움). 값이 집합·리스트면 `{1,2}`·`[1,2]` 로.
- 🧰 검사: `tools/regress.py` 에 위 7개 예제의 **모든 프레임**을 넘기며 「그리기 오류」 0 · 그려진 프레임 있음 확인(고치기 전 코드에서는 7개 모두 실패하는 것 확인). #52(함수 정의형 문제의 👀)는 그 화면이 v2.19.0 에 보관돼서 끝.

## v2.19.0 — 2026-11-07 (Opus: N13 예전 문제집 화면을 사이트에서 빼서 보관)

- 🗄 사용자 「1번 — 옛 화면을 사이트에서 빼서 다른 폴더에 정리해서 보관」: 교과서로 바꾼 뒤 숨겨만 뒀던 **예전 문제집 화면**(문제 풀기·채점·힌트·정답 보기·XP·레벨·뱃지·복습·오늘의 도전·타임 어택·타자 연습·모의고사·약점 분석·내 작품·통계·온보딩·선생님(Claude API)·코드 편집기·가짜 셸·브라우저 SQL·웹 편집기·수학 지식 지도와 문제 유형)을 **`archive/classic/`** 로 옮김. 지운 것은 없음 — 무엇이 어디 있는지·되돌리는 법은 `archive/classic/README.md`, 옮기기 직전 상태는 브랜치 **`classic-v2.18.0`**.
  - 코드 16개 파일 · 그림 88개(8.8MB) · 코스 CSS 3개 · 옛 문제 268개(파이썬 84 · 알고 45 · 수학 91 · 터미널 5 · SQL 4 · 웹 4) · 타자 연습 675개 · 따라하기 가이드 · 종합 점검. 「만들어 보기」 가 쓰는 문제 275개는 그대로(옮기기 전과 한 글자도 다르지 않은지 자동 비교).
  - `?classic=1` 숨은 문도 없앰 — 붙여도 교과서가 나와요.
  - 기기에 쌓인 옛 XP·뱃지·문제 기록은 **지우지 않음**(화면에서만 안 씀 · 백업·기기 연동에 그대로).
- ⚡ 가벼워짐: 첫 방문 오프라인 캐시 **156개 → 51개 파일**(그림 8.8MB 빠짐), 파이썬 교과서 한 쪽을 열 때 받는 코드 약 **1.2MB → 0.5MB**(content.js 513KB → 240KB, 스크립트 21개 → 13개), 허브는 코스 콘텐츠를 안 받음(「읽은 레슨」 만 셈).
- ⚙ 화면 정리(교과서에 맞게):
  - 설정: 화면 · 찾아보기 · 기기 연동 · 진행 데이터만. 「PC에서 **풀던** 걸 … 이어서 **풀** 수 있어요」 → 「**읽던** 곳을 … 이어서 **읽을** 수 있어요」, 「계정이 없어요」 → 「**사이트 가입이** 없어요」, 「진행 상황·XP·뱃지 … 문제를 풀면」 → 「읽은 레슨·설정 … 레슨을 끝까지 읽으면」, 버전 줄의 Pyodide 표시 뺌.
  - **용어집·에러 사전에 돌아가기 버튼**: 설정 → 용어집 → 「← 설정으로 돌아가기」, 용어집의 「레슨 n」 → 그 쪽 → 「← 용어집으로 돌아가기」(전에는 돌아오는 버튼이 없었음).
  - 상단바: 레벨·🔥 연속 기록 없음. ⌨ 키보드 안내: 실행·제출·힌트 키(교과서에 없는 기능) 대신 ← → 쪽 넘기기 · Esc.
  - 알고리즘 👀·👣: 파이썬 엔진 받는 진행률을 **그림 자리에** % 로(예전 오른쪽 아래 진행 표시는 옛 화면과 함께 보관 — 안내 글도 고침).
  - 허브: 「이어서 하기」 는 마지막으로 읽던 코스·레슨(없으면 파이썬 교과서 목차). 잠금·문제 수·복습·레벨 코드 뺌.
- 🐛 글자 크기 「크게·아주 크게」 에서 폰 화면이 옆으로 넘치던 5쪽(파이썬 레슨 32·36 의 긴 코드 제목 · SQL·웹 시작하기 · 웹 레슨 W10 의 긴 주소·표) — 넘칠 때만 줄바꿈.
- 🐛 기기 연동: 레슨을 끝까지 읽어도 다른 기기로 안 올라가던 것(쪽을 넘길 때 「조용히 저장」 만 해서 연동 신호가 안 갔음) → 레슨을 **처음 다 읽었을 때** 올림.
- 🧰 내부: 새 `core/app.js`(화면 등록부 · 설정 · 용어집 · 에러 사전 · 한 줄씩 보기 패널 · 시작), `core/engine.js` 는 콘텐츠 색인만, `core/ui-core.js`·`core/hub.js`·`core/config.js`·`core/ui-views-math.js`·`core/ui-views-book.js` 에서 옛 화면 부분을 뺌(원본은 보관 폴더). 웹 미리보기 러너는 검사 도구 `tools/web-preview.js` 로. 검사: `tools/regress.py` 680줄 → 약 290줄(교과서만 + N13 검사 12개: 모든 코스에서 옛 코드·옛 스크립트·그림이 안 불리는지 등), CI 에서 `test_shell`·`run_shell_solutions`·`run_sql_solutions` 뺌(보관), `validate_content`·`validate/terminal-git`·`web` 의 문제 개수 규칙 뺌, `check_level` 기준선 갱신(쉬운 첫 문제가 보관되어 「첫 문제」 가 바뀜).

## v2.18.0 — 2026-11-07 (Opus: N12 수학 공간을 교과서로 — 이제 모든 코스가 교과서)

- 📐 **수학 공간 → 수학 교과서**(사용자 11/7: 「VS Code 파이썬 과제」 · 「옛 문제는 화면에서만 숨기기」 · 「다른 교과서처럼 목록」).
  - 목차: 지식 지도 대신 **영역 5개 = 챕터, 레슨 45 목록**. 레슨 번호는 영역마다 1부터였던 것을 **1~45 로 이어서**(「레슨 1」 이 다섯 개가 되지 않게). 잠금 없음.
  - 레슨은 그대로 3쪽: ① 만져 보기 — 쓰임 한 컷 + **슬라이더로 만지는 그림** + 🔍 그림에서 찾아보기 ② 식과 코드 — ∑ 식 + 📋 복사할 예제 ③ 한 단계씩. 1쪽 위에 **「먼저 보면 좋은 레슨」** 링크(누르면 그 레슨, 돌아가기 있음).
  - 🛠 만들어 보기 89개: 레슨마다 옛 문제의 **숫자 답 1 + 코드 1** 을 VS Code 과제로 — 출력 예 · 필요한 문법(실제 코드, 그 설명 쪽으로) · 예시 답. 숫자 답 출력 예는 python3 로 미리 계산, check_book 이 예시 답 89개 + 본문 예제를 실제로 돌려 확인.
  - 시작하기 3쪽: 준비물(파이썬 교과서 시작하기 ↗ 새 탭) · 읽는 법 + 「어디서부터 볼까」 테마 경로 3개(게임 · 코딩테스트 · 데이터·AI) · 만들어 보기에 자주 나오는 파이썬(`input`·`map(int, input().split())`·`f"{x:.3f}"`·`import math`).
  - 수학 도감(식과 코드 90개). 옛 지식 지도·탐구 퀴즈·숫자 답 채점·XP 는 주소 끝 `?classic=1` 에서만.
  - 본문 다듬기: 「이 사이트는 30 + 4L XP」 → 「경험치(예: 30 + 4L)」, 「채점하는 문제는 seed 를」 → 「결과를 맞춰 봐야 하는 문제는」, `pow(7, 128, 13)` 주석에 결과 3.
- 🏠 허브: 문제집 코스가 0개가 되어 안내 문구 「○○만 문제집이에요」 → **「채점·점수·잠금 없이 필요한 곳부터 펴 보면 돼요」**, 수학 카드 「📖 교과서 · 읽은 레슨 n/45 · 그림 만지기 · 영역 순서 자유」.
- core: 교과서 화면이 그림(`core/figure.js`)·식(`MathUI.formula`)·쓰임 한 컷(scene)을 그림(수학처럼 MathUI 가 있는 코스만) · `BOOK.meta.prereqLinks`. check_book: `BOOK.meta.fig` 코스는 레슨의 「슬라이더」 를 옛 화면 말로 보지 않음. regress: 수학 옛 화면 검사는 `?classic=1` 로, 수학 교과서 검사 9개 추가.

## v2.17.2 — 2026-11-07 (Opus: N11 GitHub 교과서 전체 교차 QA)

- 🐙 GitHub 교과서를 처음부터 끝까지 다시 읽고(전체 글 + 따로 한 번 더) 고침 — 따라 하다 실제로 막히는 것부터:
  - **연습 폴더 `~/github-study` 와 연습 저장소 `github-study` 이름이 겹쳐** 홈에서 clone 하면 「already exists」 로 막히던 것 → 진짜 저장소는 `~/github-study/repo` 로 받기(시작하기 3쪽에 명령, G5 · G12 · G17 예시 답 맞춤).
  - 레슨 15 에서 main 보호 규칙을 켠 뒤 G16 · GB4 예시 답이 main 에 바로 push 하던 것 → 브랜치 → PR → 초록 ✓ → Squash and merge.
  - GB1 예시 답: `.gitignore` 를 **첫 push 전에** 만들고 `git add`·`git commit` 단계 추가(전엔 `__pycache__`·`.env` 가 첫 push 에 섞일 수 있었음). GB2 예시 답: 두 브랜치를 먼저 만들어야 충돌이 나는 순서로. G8 과제 1: 확인 항목의 `git pull` 단계 추가. G6: 리뷰 두 번째 코멘트는 **Add review comment**.
  - 잘못된 레슨 번호: 파이썬 교과서 「디버깅 사고법」 22 → **35**, 「테스트 작성」 21 → **34**, README 예시의 「보스 B5」 → **레슨 30 할 일 관리 앱**, GB1 「보스 B1~B7·메모장 앱」 → 레슨 30·31. 「레슨 16 에서 올린 저장소」 → 「터미널·Git 교과서 레슨 16」. G7 과제 「레슨 6 의 PR」 → 레슨 5 에서 열고 6 에서 리뷰한 PR. `sed` 는 터미널 교과서에 없는 명령이라고 바르게.
  - 설명 없이 나오던 것에 한 줄씩: `git commit -am` 의 `-a`, `clip <`, `cat > 파일 <<'EOF'`, `sed -i 's#…#…#g'`, `git log --format="%s | %ae"`, 훅, 끝 코드(G14 1쪽 표), About 칸, github.dev 새 파일, Code → **Local** 탭. 「Pull Request(PR)」 를 처음 나오는 곳에서 풀어 씀.
  - 말투·용어: 「단추」 → **「버튼」**(모든 교과서 — 사이트 전체가 「버튼」), G7 제목 「병합 세 가지」 → **「합치는 방법 세 가지와 뒷정리」**, `--amend --all` → `git add` + `--amend --no-edit`(터미널 교과서와 같게), README 틀 예제에 `## 사용법` · 확인 항목 「# 제목 하나와 ## 제목 다섯 개」, 확인 항목·단계 상자의 명사 끝맺음을 해요체로.
  - 화면 이름 177개를 docs.github.com 원문(github/docs 저장소)과 다시 대조 — 고칠 것 없음.
- 🐛 공통 고침(모든 교과서):
  - 딥링크 `#lesson/SETUP`(「시작하기」)이 목차로 열리던 것 → 시작하기 쪽으로(GitHub 시작하기의 「터미널·Git 교과서 시작하기 ↗」).
  - 도감에서 긴 이름(`.github/workflows/test.yml` · `collections.defaultdict`)이 「레슨 n · m쪽 ›」 을 폰 화면 밖으로 밀던 것(390px 에서 가로 14px 넘침) → 줄바꿈.
- 확인: 154쪽(폰 390 · PC 1280) 가로 넘침 0 · 다른 쪽으로 보내는 버튼 전부 눌러 돌아가기가 원래 쪽으로 · 도감 46개 돌아가기 · regress 에 두 버그 검사 추가.

## v2.17.1 — 2026-11-06 (Opus: 허브 정리 + 저장소 파일·폴더 정리)

- 🏠 허브(메인 화면)를 교과서 기준으로:
  - 맨 위 안내 문구에 빠져 있던 **GitHub** 추가. 교과서 코스 이름은 `COURSES` 의 새 칸 `short` 로 만들어서, 코스가 늘어도 저절로 들어가요.
  - 「계정은 필요 없어요」·푸터 「계정 없음」 → **「사이트 가입은 필요 없어요」·「사이트 가입 없음」**(GitHub 교과서는 내 GitHub 계정을 쓰므로).
  - 상자 이름 「오늘의 할 일」 → **「이어서 하기」**. 「문제 코스(수학) 오늘 0/5 · 복습 큐 0개」 줄은 수학 공간을 시작했을 때만 보여요(교과서만 쓰면 의미 없는 0 이 늘 떠 있었음).
- 🧹 저장소 정리:
  - 지움: 맨 위의 연습 파일 7개(`a.txt` `b.txt` `data.csv` `fruits.txt` `memo.txt` `result.csv` `words.csv` — 사이트가 읽지 않음), `tools/__pycache__`(이제 `.gitignore`), `legacy/python_academy_v1.html`(v1 단일 파일, git 기록에 남음).
  - 옮김: 맨 위 문서 → `docs/`(DESIGN · EXPANSION · IMAGES · QA), 끝난 기록 → `docs/archive/`(NEXT · PROBLEMS · QA-OPEN) · `specs/archive/`(11/2~11/5 시간표 · 팀 메모 3개). 이 파일들을 가리키던 문서·코드 주석 53곳의 경로를 같이 고침(CHANGELOG 의 옛 항목은 그대로).
  - 맨 위에 남은 것: README · CHANGELOG · HANDOFF · TODO · index.html · sw.js · python_academy.html(예전 주소 넘겨 주기).
- README 다시 씀: 코스 표(모드·레슨 수·연습 도구) · 폴더 표 · 검사 명령.

## v2.17.0 — 2026-11-06 (Opus: GitHub 교과서 완성 — 챕터 4 자동화와 안전 + 한 걸음 더 gh)

- 🐙 GitHub 교과서 레슨 22개 전부 열림(준비 중 0 · 만들어 보기 63 — 명령 문제 14개 bash 검사). N6 완료.
  - G14 GitHub Actions 첫 워크플로(`.github/workflows/test.yml` · on: [push, pull_request] · actions/checkout@v6 · setup-python@v5 · python-version "3.13" · Actions 탭 로그 읽기 · 초록 ✓ → 빨간 ✗ → 다시 초록)
  - G15 초록 체크와 보호 규칙(Settings → Code, planning, and automation → Rulesets → Rulesets · New ruleset → New branch ruleset · Disabled → Active · Include default branch · PR 필수(승인 0) · status check 필수 · 바로 push 거절 GH013 → 브랜치로 옮기기)
  - G16 비밀 지키기(.env + .gitignore · git check-ignore -v · Settings → Security → Secrets and variables → Actions → New repository secret · `${{ secrets.X }}` · 로그엔 *** · Push protection · 올렸으면 폐기 먼저)
  - 보스 GB4 「이 사이트처럼 운영하기」(테스트 워크플로 + main 보호 + Actions 로 Pages + 이슈→PR→squash → 자동 배포 + v1.1.0 릴리스 · 이 사이트의 ci.yml · pages.yml 읽기)
  - 한 걸음 더 G17 gh 명령(gh auth login · gh pr create --fill · gh pr checks · gh pr merge --squash --delete-branch)
- 도감 4개(test.yml · secrets · check-ignore · gh pr), 허브 카드 「읽은 레슨 n/22」.
- check_book: `${{ … }}`(Actions 문법)은 {{자리표시}} 검사에서 제외.

## v2.16.2 — 2026-11-06 (Opus: GitHub 교과서 챕터 3 + 파이썬 거북이 예제 turtle.done())

- 🐢 사용자 「이 turtle 있으면 안 되는 거 아니야?」 — 파이썬 레슨 5 「turtle: 거북이에게 명령하기」 의 두 코드에 `turtle.done()` 이 없었어요. 예전 화면은 브라우저 캔버스라 필요 없었지만 VS Code 에서는 없으면 그림 창이 깜빡 뜨고 바로 닫혀요(같은 레슨의 만들어 보기 문제에는 있었음). 두 코드에 넣고 「창 ✕ 를 눌러야 끝나요」 · tkinter 가 없을 때(설치 Modify → ☑ tcl/tk and IDLE) 안내. turtle 자체는 Windows 파이썬 기본 설치에 들어 있어 VS Code 에서 돼요. check_book ⑪: 거북이 코드(예제·본문·예시 답)에 turtle.done() 이 없으면 실패.
- 🐙 GitHub 교과서 챕터 3 「세상에 내놓기」 열림(레슨 3 + 보스 1, 만들어 보기 7 — 명령 문제 3개 bash 검사):
  - G11 fork 와 오픈소스 첫 기여(Fork → Create fork · origin/upstream · git fetch upstream → merge · Sync fork → Update branch · `firstcontributions/first-contributions` 에 첫 PR — 2026-11-06 에도 PR 을 받는 것 확인)
  - G12 GitHub Pages 두 가지(Settings → Code, planning, and automation → Pages · Deploy from a branch / GitHub Actions · 주소 규칙 · index.html 대소문자 · 링크는 / 없이 · 비공개 저장소도 사이트는 공개)
  - G13 태그와 Releases(git tag -a · 태그는 따로 push · 큰.중간.작은 · Draft a new release → Choose a tag → Create new tag → Generate release notes → Publish release)
  - 보스 GB3 「포트폴리오 공개」(프로필 README = 아이디와 같은 이름의 저장소 · Pin · Pages · v1.0.0)
- 허브 카드 「읽은 레슨 n/17」, 도감 명령 2개(upstream · tag).

## v2.16.1 — 2026-11-06 (Opus: GitHub 교과서 챕터 2 — Pull Request 로 협업)

- 🐙 챕터 2 열림(레슨 6 + 보스 1, 만들어 보기 12 — 명령 문제 4개는 bash 검사):
  - G5 브랜치에서 PR 열기(왜 main 에 바로 안 올리나 · Compare & pull request · base ← compare · 무엇/왜/확인 방법 설명 · Draft · 같은 브랜치 push 는 PR 에 붙음)
  - G6 코드 리뷰(Files changed 의 + · Start a review / Add single comment · Insert a suggestion → Commit suggestion · **Submit review**: Comment / Approve / Request changes — 내 PR 은 Comment 만)
  - G7 병합 세 가지와 뒷정리(merge commit · Squash and merge · Rebase and merge 그림 비교 · Confirm … · Delete branch · 내 컴퓨터: switch main → pull → **fetch --prune → branch -d**, squash 면 not fully merged → -D)
  - G8 PR 충돌(Resolve conflicts → Mark as resolved → Commit merge · 내 컴퓨터에서 git pull origin main)
  - G9 Issues(재현·기대·실제 · Labels·Assignees·Milestone · **Closes #3** 은 기본 브랜치에 합쳐질 때 닫힘 · Settings → Features → Set up templates)
  - G10 Projects 보드(프로필 → Projects → New project → Board · + Add item · 기본 Workflows 로 자동 Done)
  - 보스 GB2 「혼자 하는 협업 한 바퀴」
- 화면 이름은 docs.github.com 원문(github/docs 저장소)으로 대조. 예제 명령을 실제 git 으로 돌려 보다가 찾은 것: 「git pull 만 하고 git branch -d」 는 원격 흔적(origin/브랜치)이 남아 있으면 squash 뒤에도 **경고만 내고 지워져요** → 순서를 fetch --prune 먼저로(regress 가 순서 확인).
- 도감 도구 상자에 PR 5개(push -u → Compare & pull request · suggestion · Closes #3 · fetch --prune/branch -D · pull origin main). 허브 카드 「읽은 레슨 n/13」.

## v2.16.0 — 2026-11-06 (Opus: GitHub 교과서 — N6 챕터 1)

- 🐙 사용자 「1」(= GitHub 교과서 만들기, 설계 `specs/github-course.md` 의 Q1~Q4 는 제안대로) — **새 코스 「GitHub」**(허브 「코스」 칸 터미널·Git 다음, 처음부터 교과서). 연습은 **내 진짜 GitHub 계정** + Git Bash.
  - 시작하기 4쪽: 준비물(터미널·Git 레슨 6·16 — 다른 코스는 **새 탭**으로 열어 이 화면이 그대로) · 꼭! 2FA·이메일 비공개 · 연습 폴더 `~/github-study` 와 연습 저장소 · 쓰는 법(계정 하나로 두 역할).
  - 챕터 1 「내 저장소를 제대로」: G0 GitHub 은 무엇을(탭 둘러보기) · G1 계정 다듬기(2FA 단계별·복구 코드, Emails → Keep my email addresses private + noreply 주소, SSH 키) · G2 저장소 만들기(New repository 칸마다, 라이선스, 내 폴더 올리기·「rejected (fetch first)」) · G3 웹에서 고치기(Commit changes 창, History·Blame, github.dev, 웹에서 고친 뒤 pull) · G4 README Markdown · 보스 GB1 「내 파이썬 프로젝트 공개」.
  - 만들어 보기 15: GitHub 화면 문제는 「내 GitHub 화면에서 확인할 것」 ☐, 명령 문제 4개는 준비 명령(원격은 내 컴퓨터 `remote.git`) + 이렇게 나오면 성공. 「먼저 꼭」 경고 3(터미널 6·16 · 2FA · 공개 전 이메일).
  - 화면 이름은 docs.github.com 원문(github/docs 저장소 2026-11)으로 대조 — 예 「Toggle Add README to On」, 「Access → Password and authentication → Enable two-factor authentication」, 「Choose a license template → Review and submit」.
  - 챕터 2~4·한 걸음 더(G5~G17·GB2~GB4)는 목차에 「준비 중」.
- 🔧 check_book `BOOK.check = 'github'`: 화면 문제는 checks 필수, 명령 문제는 bash 로 실행 · 필요한 문법에 Markdown 기호(`#` · 백틱)도 문법으로 인정. regress 「GitHub 교과서」 절 + 허브 카드 8개.

## v2.15.4 — 2026-11-06 (Opus: Vim·웹·본문 코드 검사 보강 + GitHub 교과서 설계 — N6)

- 🧪 사용자 「2, 4」 중 4 — 자동 검사 보강:
  - check_book ⑨ 본문 코드 블록·예제의 `print(x)   # 결과` 주석 ↔ 실제 출력(`tools/pre_claims.py`, 파이썬·알고 594개). 알고 레슨 7 bisect 예제 주석이 설명만 있던 것에 실제 값을 앞에(`# 1 — 3이 처음 나오는 자리`, `# 4 — 마지막 3 다음 자리`).
  - check_book ⑩ Vim 교과서 `:명령` 을 진짜 vim 에서 하나씩 실행(없는 명령·설정 오타).
  - run_web_solutions: 교과서 예제의 `fetch("menu.json")` 을 같은 레슨의 menu.json 으로 · 본문 「Console 에 `값`」 ↔ 실제 console.log.
  - 일부러 `# 70`·`:set hlsearhc` 오타를 넣어 잡는지 확인.
- 🐙 2 — **GitHub 교과서 설계** `specs/github-course.md`: 터미널·Git(로컬 Git, T16 은 다리)·웹(W13 Pages)과의 경계표 · 진짜 계정으로(이용약관상 무료 계정은 한 사람 하나 → 혼자 두 역할, 내 PR 은 Approve 불가라 승인 수 0) · 필수 경고(2FA·이메일 비공개·비밀값) · 챕터 4 + 한 걸음 더 = 레슨 G0~G17 · 보스 GB1~GB4(마지막은 「이 사이트처럼 운영하기」) · 검사(로컬 Git 은 bash, 웹 화면은 「확인할 것」 + docs.github.com 대조) · 만들 순서 · 사용자 결정 Q1~Q4.

## v2.15.3 — 2026-11-06 (Opus: 교과서 ← → 키로 쪽 넘기기)

- ⌨ 사용자 「방향키 ← 누르면 이전, → 누르면 다음 · 만들어 보기에서 목차로 가는 건 따로 키를 넣지 말고」 — 교과서 6개 공통(`core/ui-views-book.js`): 레슨·시작하기 쪽에서 **←** = 이전 쪽, **→** = 다음 쪽(마지막 쪽 「만들어 보기」 에서는 → 가 아무 일도 안 함 — 목차는 버튼으로만). 검색칸·그림 플레이어 슬라이더에 커서가 있을 때, 창이 떠 있을 때, Ctrl·Alt·Shift 와 같이 누를 때는 쪽을 넘기지 않음. 이전·다음 버튼에 「(키보드 ← / →)」 툴팁. regress 에 키 검사 6개.

## v2.15.2 — 2026-11-06 (Opus: 교과서 6개 교차 QA + 자동 검사 4종)

- 🧪 사용자 「3, 4」 — 알고 교과서에서 손으로 찾은 종류를 `tools/check_book.mjs` 에 넣고(4), 교과서 6개 전부에 돌려 걸린 것을 고침(3):
  - ⑤ 본문 「실행하면 `값`」 ↔ 예제 실제 출력(파이썬·알고 python3 · SQL SQLite) + 파이썬 예제 전부 실행(349개) · ⑥ 필요한 문법의 함수·메서드 이름이 링크된 쪽에 있는지 · ⑦ 예전 문제집 화면 말(이 앱·채점·입력창·슬라이더·다음 줄 실행 …) · ⑧ 터미널 예제를 시작하기부터 순서대로 「한 사람의 Git Bash」 처럼 이어서 실행. 일부러 틀린 값을 넣어 각 검사가 실제로 잡는지 확인함.
- 📖 파이썬 교과서: 예전 앱 말 8곳(「이 앱에서는 결과를 적어 둘 때」·「이 앱의 파일은 브라우저 안 가상 공간」 → 「VS Code 에서 연 폴더에 생겨요」·「채점할 수 있어요」 ×5) · 메모장 앱의 `partition` 이 어디에도 설명이 없던 것 → 레슨 9 「split」 쪽에 `split(" ", 1)`·`partition(" ")` 설명과 예제 · 필요한 문법 링크 3곳(and → 레슨 4 「and · or」, 평균 `/` → 레슨 3 「나누기」, `d.items()` 따로).
- 💻 터미널 교과서: 레슨 1 「ls 더 보기」 예제가 앞 쪽(cd ~)에 이어 치면 `notes` 가 없다고 나오던 것 → 연습 폴더로 먼저 cd · 레슨 13 「충돌 해결 세 단계」 예제가 기대는 충돌 상태를 만들 예제가 없던 것 → 앞 쪽에 「충돌 직접 만들어 보기」(conflictplay 폴더) 예제.
- 🗄 SQL · 🌐 웹: 필요한 문법 링크 각 1곳(여러 행 VALUES · 중첩 태그). 🧭 알고리즘: 링크 9곳 더(+ 함수 하나에 두 문법이 섞인 것 나눔).

## v2.15.1 — 2026-11-06 (Opus: 알고리즘 교과서 다듬기 + 옛 지도 CSS 정리 — N10)

- 🧭 사용자 「3, 4」 — 알고리즘 교과서 자체 QA(레슨 전 쪽 그림·한 줄씩 버튼 전부 눌러 보기 · 예제 전부 python3 실행 · 본문 「실행하면 …」 값 대조 · 필요한 문법 링크 대조 · 폰 390/PC 가로 넘침)에서 나온 것:
  - 레슨 17(실전 2) 「실행하면 `강남 → 역삼 → 선릉 (4분)`」 → 실제 출력 `강남 -> 역삼 -> 선릉 (4분)` 으로(content.js — 예전 화면도 틀렸던 것).
  - 레슨 0 4쪽: 그 쪽엔 없는 「👣 한 줄씩 보기」 를 「예제에 따라 있어요」 로 · 실전 4 「채점이 돼요」 → 「출력 예와 비교할 수 있어요」.
  - 필요한 문법 링크 10곳을 그 코드가 실제로 나오는 쪽으로(`heapq.heapify` → 레슨 11 4쪽, `Counter` → 레슨 8 2쪽, `setdefault` → 레슨 12 2쪽 …).
  - 쪽 제목 80개: 별명만 있던 제목 앞에 실제 코드(「접시 더미」 → 「스택 stack.append() · stack.pop(): 접시 더미」 — 파이썬 교과서 v2.9.3 사용자 지적과 같은 원인). 도감 이름·검색도 이것.
- 🧹 N10: 어느 화면도 안 쓰는 CSS 17종(옛 지도 `.ch-toggle`·`.ch-decor`·`.ch-sec.collapsed`·`.node-mascot`·`.node-stars`·`.node-img`, 옛 허브 `.hub-hero`·`.hc-icon`, 달력 `.cal`·`.cal-cell`, `.tb-mascot`·`.prof-row`·`.lp-top`·`.ex-h`·`.tutor-panel` 등) 지움(-1.4KB). 코스마다 `content.js` 의 안 쓰는 `MAP_DECOR` 도 지움. 코스 7개·옛 화면·허브·프로필·설정 20화면 × PC/폰 캡처가 정리 전후 **픽셀까지 같음**.

## v2.15.0 — 2026-11-06 (Opus: 알고리즘 교과서 — N5, 수학 빼고 전부 교과서)

- 🧭 사용자 「1」(= N5 알고리즘도 교과서로) — **알고리즘 코스를 교과서로**. 연습은 내 컴퓨터의 **VS Code + 파이썬**, 레슨 예제의 그림은 남김.
  - 레슨 예제 아래 **👀 그림으로 보기**(정렬 막대·스택·트리·그래프·격자 애니메이션) · **👣 한 줄씩 보기**(줄마다 변수 표). 예전 화면의 플레이어(`Viz.runAndShow`·`TracePanel`)를 그대로 쓰고, 지금 실행 중인 줄을 코드 칸에서 칠함. 파이썬 엔진은 **누를 때만** 받음(`BOOK.meta.viz`).
  - 시작하기 4쪽: 준비물(파이썬·VS Code) · **긴 입력은 input.txt 로**(`sys.stdin = open("input.txt", encoding="utf-8")`, PowerShell 은 `<` 가 안 됨) · 시간 재기·Ctrl+C·재귀 한도 · 쓰는 법.
  - 만들어 보기 100: 레슨마다 + 보스 5(모의고사 AB4 15문제 포함) + 실전 6 프로젝트(명령마다 입력·출력 예). 함수 문제는 **「확인 코드」**(`print(is_balanced("([]{})"))` …)와 그 출력, 버그 문제는 고칠 코드, 연결 리스트·트리는 Node 클래스가 든 시작 코드, 빈칸 문제는 채울 코드. 필요한 문법은 전부 실제 코드.
  - 도감 「🧰 코딩테스트 도구 상자」 15: deque · heapq(최대 힙) · bisect · Counter · defaultdict · sorted key 튜플 · combinations/permutations · accumulate · lru_cache · sys.stdin · join 출력 · inf · ord/chr · 비트 연산.
  - 「먼저 꼭」 경고 2: 레슨 0 · 챕터 1 앞 「파이썬·VS Code 준비」, 실전·모의고사·레슨 24 앞 「긴 입력은 input.txt 로」.
  - 슬라이더 안내(「🎚 n 을 키워 보세요」)는 「코드의 n = … 을 바꿔 다시 실행」 으로, 문제 지문의 「👀 시각화용」·「입력창」·「큰 입력 테스트」·「채점용 도우미」 는 교과서 말로.
- 🏠 허브: 알고리즘 카드 「📖 교과서 · 읽은 레슨 n/32 · 그림으로 보기 · 모의고사 15문제」, 안내 문구에 교과서 코스 전부, 「오늘」 숫자는 「문제 코스(수학)」.
- 🔧 `core/book-derive.js`(새): 「만들어 보기」 문제 하나를 화면 모양으로(옛 문제의 code·bug·fill·project·call/ret 테스트 → 입력·출력 예·확인 코드·예시 답). **화면과 `tools/check_book.mjs` 가 같은 함수** — 검사한 출력 예 = 보이는 출력 예. 교과서 코스 6개 index.html 이 불러옴.
- 🔧 check_book: 함수 문제는 예시 답 + 확인 코드를 python3 로 돌림 · 지문에 앱 버튼 안내가 남으면 실패 · 모의고사 레슨도 열린 레슨 수에 셈. regress: 알고리즘 교과서 절(그림 버튼은 python.js 프렐류드를 python3 로 돌려 진짜 추적으로 확인) · 알고 예전 화면은 `?classic=1` · 복습 큐는 수학으로.

## v2.14.0 — 2026-11-06 (Opus: 웹 교과서 — N3, 코스 7개 전부 교과서·문제집으로 열림)

- 🌐 사용자 「2번(SQL·터미널·웹 교과서) 해 · 내 컴퓨터 도구로」 · 「계속 다음 진행해」 — **웹 코스를 교과서로**(N3). 연습은 내 컴퓨터의 **VS Code + Live Server 확장 + 크롬/엣지 개발자 도구**.
  - 시작하기 4쪽: 공부 폴더를 VS Code 로 열기·`!`+Tab 뼈대 · **Live Server**(확장 → Ritwick Dey → Install → Go Live · http://127.0.0.1:5500) · **F12**(Elements·Console·Network·폰 화면) · 쓰는 법.
  - 레슨 14: 웹의 동작·HTML 뼈대 · 중첩·속성 · 목록·링크·이미지·표·시맨틱 · 폼 · CSS 선택자·색·박스 모델 · flex · 반응형(@media·모바일 먼저) · JS(파이썬 비교표·map/filter) · DOM·이벤트·폼 가로채기 · 상태와 render()·localStorage · HTTP(요청·응답·상태 코드·JSON) · fetch·async/await·에러 · 파이썬 requests·API 키 · REST·**GitHub Pages 배포**(Settings → Pages → Deploy from a branch).
  - 만들어 보기 25 + 보스 3(🏠 내 소개 페이지 · 할 일 앱 · 카페 주문 화면) — 「브라우저에서 확인할 것」 ☐ 목록, 예시 답은 파일 전체. 준비 파일 menu.json.
  - 「먼저 꼭!」 경고: Live Server(레슨 11 fetch 는 꼭) · JS 부터 F12 Console · 레슨 12 requests 설치 · 레슨 13 GitHub.
- 🏠 허브: 웹 카드 「읽은 레슨 n/17」 — 코스 7개가 전부 열림(미리보기 코스 없음).
- 🧪 `tools/run_web_solutions.py`: 교과서 예시 답 25개를 미리보기 iframe 에 넣어 checks 전부 ✓(fetch 는 mock, sandbox 의 localStorage 는 메모리로 대신) + 레슨 예제 렌더. check_book: 웹은 checks 가 있는지. `ui-views-book.js`: 「브라우저에서 확인할 것」 목록. 옛 편집기 회귀는 `?classic=1`. regress +12.

## v2.13.0 — 2026-11-06 (Opus: SQL 교과서 — N2)

- 🗄️ 사용자 「2번(SQL·터미널·웹 교과서) 해 · 내 컴퓨터 도구로」 · 「일단 완성하는 게 목표니까 필수 사항은 강조하고 계속 다음 진행해」 — **SQL 코스를 교과서로**(N2). 연습은 내 컴퓨터의 **DB Browser for SQLite** + 연습 DB **cafe.db**.
  - 시작하기 4쪽: DB Browser 3.13 설치(sqlitebrowser.org/dl 「Standard installer for 64-bit Windows」 · License · Shortcuts 의 DB Browser (SQLite) Desktop·Program Menu) · **cafe.db 내려받기**(못 받으면 「SQL 로 만들기」 상자) · Execute SQL 탭 쓰는 법(Ctrl+Enter · Shift+F5 · 메시지 칸) · **Write Changes / Revert Changes** · 쓰는 법.
  - 레슨 14: 데이터베이스와 첫 SELECT · WHERE(AND/OR/IN/BETWEEN/LIKE) · ORDER BY·LIMIT·계산 열·DISTINCT·NULL · 집계·GROUP BY·HAVING · JOIN(왜 나누나·ON·별명) · LEFT JOIN·세 표·셀프 조인 · 서브쿼리·WITH·EXISTS · CASE·날짜·글자 함수 · INSERT/UPDATE/DELETE(WHERE 빠뜨리기 경고) · CREATE TABLE·제약 조건 · 정규화·ERD · 인덱스·EXPLAIN QUERY PLAN · 트랜잭션(DB Browser 에서는 BEGIN 대신 Write/Revert) · **파이썬 sqlite3**(connect·fetchall·? 자리표·commit).
  - 만들어 보기 47 + 보스 3(10월 요약·TOP 5·시간대별 매출 / 직원 순위·단골 시간대·🏠 메뉴별 매출 보고서 / 🏠 가계부를 DB 로 — SQL·파이썬). 결과는 **표로**(DB Browser 결과 칸처럼, NULL 흐리게).
  - 「먼저 꼭!」 경고: 시작하기 1~2(설치·cafe.db) · 챕터 3 의 Write Changes · 레슨 13 의 파이썬.
- 🧪 `tools/sql_book_run.py`(새): 문제마다 실제 SQLite 로 cafe 데이터를 새로 만들어 예시 답(+확인 쿼리·되돌리기·기대 에러) 실행 → 결과 표 비교, 파이썬 문제는 cafe.db 옆에서 python3 실행. `tools/build_cafe_db.py`(새) — check_book 이 cafe.db 와 datasets.js 가 같은지 검사. 허브 SQL 카드 「읽은 레슨 n/17」. 옛 브라우저 실행 회귀는 `?classic=1`. regress +15.

## v2.12.2 — 2026-11-06 (Opus: 교과서마다 「먼저 꼭 할 것」 강조)

- ⚠ 사용자 「일단 완성하는 게 목표니까 필수 사항은 강조하고 계속 다음 진행해」 — 모든 교과서에 「먼저 꼭!」 경고 상자(목차의 그 챕터 위 · 해당 레슨 1쪽 · 만들어 보기 맨 위, 단추 → 설정 쪽 → 돌아가기):
  - 파이썬: 시작하기 1~3(Add python.exe to PATH · VS Code Python 확장 · 첫 파일 실행) — L0·L1·챕터 0.
  - 터미널·Git: 시작하기 1~3(Git Bash 설치 · 연습 폴더) — T0·T1·챕터 1 (+ v2.12.1 의 레슨 6 Git 설정).
  - Vim: 시작하기 1~2(Do not remap keys · 준비 명령 넣는 법) — 챕터 1 · 레슨 6 기본 _vimrc — 챕터 2 · 파이썬(·Git) 설치 — V8·V10·VB2.
- 🧱 `BOOK.meta.prereq` 를 배열로(여러 개). regress +6.

## v2.12.1 — 2026-11-06 (Opus: 「레슨 6 설정 필수」 강조)

- ⚠ 사용자 「나중에 할 거니까 레슨 6번은 설정을 해야 한다고 강조해」 — Git 을 하기 전 레슨 6 의 「처음 한 번: 이름·이메일 설정」 을 여러 곳에서 강조:
  - 터미널 교과서 목차의 Git 챕터 위 · Git 레슨(T7~TB3)마다 1쪽과 「만들어 보기」 맨 위에 경고 상자(안 하면 `Author identity unknown` 으로 멈춤 · 확인법 `git config --global user.name`) + 「레슨 6 · 설정하는 쪽 보기」 단추(돌아가기 있음).
  - 레슨 6 의 1쪽·설정 쪽(제목 「(필수!)」)·만들어 보기 문제 제목, 시작하기 4 의 Git 안내도 경고 상자로.
- 🧱 `ui-views-book.js`: `BOOK.meta.prereq`(lessons·chapters·ref) — 다른 교과서도 「먼저 할 것」 경고에 같이 씀. regress +7.

## v2.12.0 — 2026-11-06 (Opus: 터미널·Git 교과서 2차 — Git 편, N1 완료)

- 🌿 사용자 「2번 진행」(N1 2차) — 터미널·Git 교과서 **Git 편 T6~T16 + 보스 TB2·TB3** 를 채움. 진짜 git(Git Bash)으로 연습.
  - 챕터 2 Git 기초: 버전 관리가 왜 필요한가 · Git 과 GitHub · **처음 설정**(user.name·email·core.quotepath·pull.rebase) / 세 칸(작업 폴더·스테이징·저장소) · init·status(--short 두 글자 읽기)·add(LF→CRLF 경고는 무시)·commit / log·diff·diff --staged·좋은 메시지 / restore·restore --staged·reset soft·mixed·hard 표·reflog / .gitignore·올리면 안 되는 것·rm --cached / 보스: 의미 있는 커밋 3개 + 🏠 일기장.
  - 챕터 3 브랜치와 협업: 원격과 로컬 · **연습용 「가짜 GitHub」 = bare 저장소 폴더** · remote add·push -u·clone·pull·fetch / 브랜치는 이름표·switch -c / merge(fast-forward·3-way·--no-edit)·충돌 마커·해결 세 단계·merge --abort / stash·rebase·merge vs rebase / 실수 복구 5가지(amend·엉뚱한 브랜치·지운 파일·충돌 포기·비밀 커밋) / **실제 GitHub**(가입·New repository 칸·첫 push 의 Git Credential Manager 브라우저 로그인·fork·Pull Request 단추 순서) / 보스: 충돌 해결하고 push + 🏠 집·학교 컴퓨터.
  - 만들어 보기 35문제 추가(터미널 교과서 전체 60). 준비 명령이 저장소·원격·「친구의 커밋」까지 만들어 줌. 확인 명령은 해시·날짜 없이(메시지·status --short·ls-files) 늘 같게.
- 🏠 허브 터미널 카드 「읽은 레슨 n/20 · 명령어 편 + Git 편 · 실제 GitHub 까지」.
- 🧪 check_book: 셸 코스를 git 환경(이름·이메일·main·pull.rebase·quotepath, 편집기 금지)으로 실행 — Git 편 예시 답 33개를 진짜 git 으로 돌려 비교(터미널 전체 실행 58). regress: Git 편 +5, 터미널 홈 20레슨·준비 중 0.

## v2.11.0 — 2026-11-06 (Opus: 공용 Vim 에디터 교과서 · 허브 「공간」 → 「공용」)

- ⌨ 사용자 「공용에 windows 버전 vim 에디터 설치 및 사용법 그리고 단축키 교과서 만들어 그리고 파이썬과 연결하고 자동 띄어쓰기 및 자동완성 기능까지」 — **Vim 에디터 교과서**(`courses/vim/`, 처음부터 교과서 모드).
  - 시작하기 3쪽: Windows gVim 9.2 받기(vim.org · GitHub vim-win32-installer · winget) · 설치 화면별 칸(Choose Components 의 Create .bat files 등, Choose _vimrc settings 는 **Do not remap keys (Default)** 그대로 — 이유 포함) · 연습 파일과 「준비 명령」 넣는 법(📋 → `:` → Ctrl+R + → Enter) · 쓰는 법.
  - 챕터 1 기본기 6레슨: 모드와 빠져나오기(:w :q :wq :q!, gVim/터미널 Vim/Git Bash Vim 차이, 한글 입력) · 이동 · 입력 · 지우기·바꾸기·되돌리기(연산자+이동 문법, ciw ci", .) · 복사·붙여넣기·비주얼(Ctrl+v 여러 줄 주석, Windows 클립보드 "+) · 찾기·바꾸기(:%s, gc, \<단어\>).
  - 챕터 2 파이썬과 연결 6레슨: `_vimrc`(C:\Users\이름\_vimrc, :source %) · **자동 들여쓰기**(filetype plugin indent on · autoindent · expandtab · tabstop/shiftwidth/softtabstop=4 · >> · :retab) · 파이썬 실행(**F5** = 저장+`:!python %`, **F6** = `:terminal` 로 input 프로그램) · 자동완성 1(Ctrl+n · Ctrl+x Ctrl+f/l) · **자동완성 2(LSP)**: vim-plug 설치(PowerShell·Git Bash) → vim-lsp · vim-lsp-settings · asyncomplete · asyncomplete-lsp → `:PlugInstall` → `:LspInstallServer pylsp-all`, Tab/Enter 고르기 · K · gd · F2 · ]g · 창·탭·탐색기.
  - 만들어 보기 44문제(보스 2 + 🏠 생활형 4) · 📚 **단축키 도감**(레슨 37쪽 + 자주 쓰는 단축키 35개, 「복사」「저장」 한국어 검색).
- 🏠 사용자 「공간을 공용으로 변경」 — 허브 구역 이름과 카드 표시 「공간」 → **「공용」**(수학 공간 + Vim 에디터). 교과서 코스 카드 「📖 읽은 레슨 n/14」.
- 🧪 check_book: Vim 교과서 예시 답 33개를 **진짜 vim**(교과서 기본 _vimrc)에 키로 넣어 결과 파일 비교 + 파이썬 실행 결과 비교(실행 50), 기본 _vimrc 가 에러 없이 읽히고 .py 에서 들여쓰기·F5 가 켜지는지. 화면 `ui-views-book.js`: 「F5 로 실행하면」 상자, 결과 없는 도감 항목. regress +16.

## v2.10.1 — 2026-11-06 (Opus: 메인화면을 교과서에 맞게 · QA 용 사이트 의도 문서)

- 🏠 사용자 「메인화면은 수정 안 했는데 원인 설명」 — 허브 카드는 코스와 따로 `core/config.js` 에 적혀 있어 교과서 전환이 반영되지 않았음(허브 정리를 N4 로 미룬 것 + QA 가 코스 안쪽만 본 것). 고침:
  - 파이썬·터미널 카드: 문제 수(「92/170 문제」) 대신 **「📖 교과서 · 읽은 레슨 n/m」**(레슨을 끝까지 넘기면 읽음). 터미널 문구 「가상 터미널과 Git 시뮬레이터」 → 「Git Bash 에서 직접 쳐 보는 터미널·Git 교과서」 + 「명령어 편 열림 · Git 편 준비 중」.
  - 「오늘의 할 일」: ▶ 이어서 버튼이 교과서면 「○○ 교과서 이어서 읽기」·「레슨 "…" 읽기」 · 「오늘」 숫자·복습 큐는 문제 코스(알고리즘·수학)만 · 교과서에서 없어진 「오늘의 도전」 줄 삭제 · 안내 문구를 「교과서 코스는 내 컴퓨터에서」 로.
  - 프로필 카드 PNG 의 코스 진행에서 교과서 코스 제외(문제 수가 없음).
- 📄 사용자 「QA 가 해당 사이트의 의도를 파악할 수 있게 문서 최신화」 — **`specs/site-intent.md`**(새): 누구를 위한 사이트인가 · 코스별 모드 표 · 교과서에서 정상인 것 / 버그인 것(사용자 지적 8가지 기준) · 허브의 의도 · 자동 검사. `specs/qa-team.md` 회전 체크리스트를 v2.10.1 기준(허브·교과서·문제집·미리보기)으로, README·QA.md·QA-OPEN.md·specs/README·HANDOFF 머리에 「먼저 읽기」.
- 🧪 check_book: `config.js` 의 교과서 코스가 `book:true`·`lessons` = 열린 레슨 수·옛 문구 없음인지 검사. regress: 허브 카드 교과서 표시·터미널 문구·읽은 레슨 세기 +5.

## v2.10.0 — 2026-11-06 (Opus: 터미널·Git 교과서 1차 — 명령어 편)

- 🎧 사용자 「2번(SQL·터미널·웹을 교과서로) 해 · 내 컴퓨터 도구로 · 터미널·Git 먼저」 — **터미널·Git 코스도 교과서**. 연습은 내 컴퓨터의 **Git Bash**(진짜 터미널).
- 🛠 **시작하기 4단계**: Git for Windows 받기·설치(대부분 Next, 확인할 화면 3개 = 기본 편집기 VS Code · 첫 브랜치 이름 main · PATH) → Git Bash 여는 법 3가지(시작 메뉴·폴더 우클릭 「Open Git Bash here」·VS Code 터미널 기본 프로필) · 붙여 넣기 Shift+Insert/우클릭 · Ctrl+C = 멈추기 → **연습 폴더 `~/terminal-study`** 만들기 명령과 안전 수칙(rm 은 휴지통 없음) → 쓰는 법. Mac 안내 포함.
- 📖 **레슨 T1~T5 설명 16쪽**(경로·ls 옵션·상대 경로·에러와 띄어쓰기 / mkdir·cp·mv·rm / cat·head·tail·echo > >>·결과를 파일로·notepad·code / * ·find·grep / 파이프·wc·sort·uniq·단축키·변수). T0 은 연습용 가짜 터미널 기준이던 글을 Git Bash 기준(프롬프트 MINGW64 모양 등)으로 고쳐 씀.
- 🧩 **만들어 보기 25문제**(T0~T5 + 보스 TB1: 폴더 정리 · 🏠 다운로드 폴더 정리 · 🏠 로그 보고서): 문제마다 **준비 명령**(붙여 넣으면 그 문제용 폴더가 처음 상태로 생김) · **확인 명령** · 「이렇게 나오면 성공」 · 필요한 명령(→ 설명 쪽, 돌아가기) · 예시 답.
- 📚 **터미널·Git 명령 도감**(21개, 검색). Git 편(T6~TB3)은 목차에 「준비 중 — 다음 업데이트」(눌러도 안 열림, 주소로 와도 목차로).
- 🧱 `core/ui-views-book.js` 를 코스 공용으로: `BOOK.meta`(코스마다 글귀), `BOOK.lessonPages`(빈 레슨 쪽 통째), 문제 `setup`·`check`·`run`·`anyOrder`, 쪽 `example` 덮어쓰기. 교과서에서 안 쓰는 선생님 패널 숨김.
- 🧪 check_book 이 book.js 있는 코스 전부 — 셸 코스는 **bash 로 준비 → 답 → 확인을 실제로 돌려** 결과 비교(HOME 은 /c/Users/me 로 보이게), 로케일마다 정렬이 달라질 이름 검사. 회귀: 터미널 교과서 +20, 옛 연습 터미널 회귀는 `?classic=1`.

## v2.9.5 — 2026-11-06 (Opus: 교과서 다듬기 A — 내장 함수 도감 · 생활형 만들어 보기 · 설정 정리 · █ → #)

- 🧰 문법 도감 맨 앞 **「자주 쓰는 내장 함수」 18개**(`BOOK.builtins`): print(sep·end)·input·int/float/str·len·range·sum/max/min·sorted·reversed·round/abs(round(2.5)=2 함정)·divmod·enumerate·zip·map/filter·list/set/dict/tuple·any/all·type/isinstance·ord/chr·open. 쓰는 모양 · 설명 · 예제 · 실제 결과(check_book 이 python3 로 다시 확인) · 레슨 링크. 「🧰 내장 함수」 칩.
- 🏠 **생활형 「만들어 보기」 12개** — 챕터 보스마다 2개, 그 챕터까지 배운 문법으로: 더치페이 계산기·택배 요금표 / 장보기 목록·적금 쌓기 / 나만의 단어장·이번 달 지출 순위 / D-day 계산기·로또 번호 뽑기 / 메모장 앱(파일에 남음)·성적 파일 정리 / 사진 파일 이름 정리·이번 주 할 일 알림. 필요한 문법·입출력 예·준비 파일·예시 답.
- ⚙ 교과서 설정 화면에서 의미 없는 칸 숨김: 키보드·효과음·진동·하루 목표·게임 요소·전제 무시·온보딩 다시 보기·클로드 선생님(API 키). 「학습」 카드 → 「찾아보기」(용어·에러 사전).
- ⌨ X4 가계부 막대 글자 `█`(키보드로 못 침) 101곳 → `#`.
- 🧪 check_book: 내장 함수 결과·생활형 준비 파일까지 실행(문제 156, 실행 169). regress +5.

## v2.9.4 — 2026-11-06 (Opus: 파이썬 문법 도감 · 접힌 설명 펼치기 · 가는 곳마다 돌아가기)

- 📚 사용자 「문법을 숨길 필요 없잖아, 어차피 실전은 전부 오픈북이니까. 파이썬 문법 도감 만들어」 — **파이썬 문법 도감**(`#dogam`): 레슨에서 배운 문법 226개(코드가 있는 쪽마다 하나: 제목 = 실제 문법, 본문 첫 문단 = 설명, 첫 코드 = 예제 📋 복사, 「레슨 N · M쪽 ›」). 검색(코드·한국어, 띄어 쓴 낱말 모두 포함), 챕터 칩. 홈 맨 위 카드·레슨 화면 오른쪽 위 「📚 문법 도감」 에서 열림. 레슨을 고치면 도감도 같이 바뀜(따로 적지 않음).
- 📖 레슨 속 접혀 있던 「💡 더 알아보기」 20곳을 펼쳐서(교과서 화면).
- ↩ 사용자 「갈 수 있게만 하지 말고 다시 올 수 있게 해」 — 다른 화면으로 가는 곳마다 맨 위 「← 돌아가기」: 도감 → 레슨(검색어·보던 위치 그대로), 만들어 보기 「필요한 문법」 → 설명 쪽(「만들어 보기 N번 문제로 돌아가기」, 그 문제 위치로), 레슨 → 도감(「레슨 N 「…」로 돌아가기」). 쪽을 넘겨도 남고, 여러 번 건너가도 차례로 거슬러 옴. 작업 규칙 specs/workflow.md 3-8.
- 🧪 regress +8(도감·검색·돌아가기 3길·펼친 더 알아보기).

## v2.9.3 — 2026-11-06 (Opus: 쪽 제목·문제 제목도 실제 문법으로 — v2.9.2 의 나머지)

- 📖 사용자 「1, 2번은 왜 안 하고 다시 물어보냐」 — v2.9.2 와 같은 원인(지어낸 별명)이 남아 있던 **레슨 쪽 제목** 137곳에 실제 문법·정식 용어를 앞에: 예) 「나눠 담기: 쉼표로 한 번에」 → 「언패킹 a, b = 튜플: 한 번에 나눠 담기」, 「개수 세기 패턴」 → 「개수 세기: d[k] = d.get(k, 0) + 1」, 「복사의 함정」 → 「a.copy(): b = a 복사의 함정」 (`BOOK.titles`, 교과서 화면만 — 예전 문제 지문이 쪽 제목을 인용해서 content.js 는 그대로).
- 🛠 「만들어 보기」 문제 제목 22개를 문법 별명 대신 **하는 일** 로: 「나눠 담기」 → 「이름과 점수를 한 번에 꺼내기」, 「map 으로 합계」 → 「숫자들의 합계 구하기」 등.
- 📏 작업 규칙(specs/workflow.md 3-7): 같은 원인의 나머지는 묻지 않고 이어서 끝내고, 못 끝낸 건 바로 TODO 에.

## v2.9.2 — 2026-11-06 (Opus: 「필요한 문법」을 실제 문법으로)

- 🐞 사용자 지적 「필요 문법에 나눠 담기는 뭐냐 · 분명히 필요 문법을 넣으라고 했다」 — 「만들어 보기」 의 필요한 문법이 「나눠 담기」·「개수 세기 패턴」 같은 별명이었음. 263개 전부 **실제 문법(코드 모양) + 짧은 설명** 으로: 예) `name, score = person` 튜플 값을 변수 여러 개에 한 번에(언패킹), `d[k] = d.get(k, 0) + 1` 키마다 개수 세기, `for i in range(1, 6):`. 한 줄에 하나씩, 누르면 그 설명 쪽으로(그대로). 디버깅·리팩터링 레슨은 개념 이름 대신 고칠 때 쓰는 코드(`range(len(scores))`, `total / len(scores)`, `TAX_RATE = 0.1`).
- 🧪 check_book: 필요한 문법이 [코드, 쪽, 설명] 꼴이 아니면 실패. regress +1.

## v2.9.1 — 2026-11-06 (Opus: 교과서 목차에서 레슨을 누르면 1쪽부터)

- 🐞 사용자 제보 「챕터를 누르면 왜 1번부터가 아니라 이상한 곳부터 시작이냐」 — 목차가 「마지막으로 보던 쪽」으로 열었는데, 예전 문제집 화면이 남긴 쪽 번호(끝까지 보면 요약 쪽 = 마지막+1)가 새 화면에선 「만들어 보기」나 중간 쪽이 됐음. 목차에서는 늘 1쪽부터(새로고침·「필요한 문법」 링크는 그대로 그 쪽).

## v2.9.0 — 2026-11-06 (Opus 릴리스: 파이썬 코스를 「교과서」로 — 사용자 방향 전환)

사용자 말(11/6): 「학습은 repeat 만 있고 완강해도 혼자 create 는 못 할 것 같다. 발상의 전환이 필요해. 메인 화면은 파이썬 설치와 VS Code 실행법, 챕터는 문법 설명과 예제(문장으로 된 문제)만, 문제와 그에 필요한 문법을 나열해. 어차피 나만 쓸 건데 억지로 붙잡을 필요 없다.」 결정: 화면에서만 숨기기 · 파이썬만 · 예제 = 보스처럼 문장 · 문제 + 필요한 문법 나열.

- 📖 **파이썬 코스 = 교과서 모드**(`core/ui-views-book.js` + `courses/python/book.js`): 홈 = 「🛠 시작하기」 4단계(파이썬 설치 — ☑ Add python.exe to PATH·Store 별칭 끄기 / VS Code 설치·한국어·Python 확장·인터프리터 / 첫 파일·▷ 실행·터미널 입력·자주 막히는 곳 / 이 교과서 쓰는 법) + 챕터·레슨 목록(잠금·XP·별 없음).
- 🛠 **레슨 마지막 쪽 「만들어 보기」**: 문장으로 된 문제 126개(모든 레슨·보스·실전), 문제마다 **필요한 문법**(누르면 그 설명 쪽으로) · 입력 예·출력 예 · 접힌 예시 답 · 실전 프로젝트는 준비 파일 내용 · 디버깅·리팩터링은 「고칠 코드」 · 「끝까지 읽기」 프로그램은 Ctrl+Z/Ctrl+D 안내. 채점 없음 — VS Code 에서 직접.
- 📝 레슨 예제는 브라우저 실행 대신 **📋 복사** 상자. 본문 중 이 앱 버튼(실행해 보기·입력값 칸·한 줄씩 보기)을 말하던 9곳은 VS Code 기준(터미널 입력·Ctrl+C·중단점 F5/F10)으로(`BOOK.pages`).
- 🙈 화면에서 숨김(콘텐츠는 그대로): 문제·채점·타자 연습·복습·모의고사·XP·뱃지 팝업·닉네임 묻기. 파이썬 엔진(Pyodide)도 안 받아서 첫 화면이 빨라짐. 옛 `#problem/ID` 주소 → 그 레슨 「만들어 보기」. 예전 화면은 `courses/python/index.html?classic=1`.
- 🔓 알고리즘·SQL·터미널·웹 코스의 「파이썬 보스를 깨야 열림」 잠금 없앰(파이썬에 채점이 없어져 영원히 잠기게 돼서).
- 🧪 `tools/check_book.mjs`(CI): 필요한 문법 링크가 있는 쪽인지 · 예시 답 139개를 실제 python3 로 돌려 출력 예와 같은지 · 본문 바꾸기 글이 있는지. regress 는 예전 화면을 `?classic=1` 로 계속 검사하고 교과서 모드 12개 추가.

## v2.8.11 — 2026-11-06 (Opus 릴리스: 플레이 QA 1회전(PR #94) 실수 항목 고침)

- 💾 **치던 코드가 날아가지 않게**(상): 입력이 잠깐 멈추면·폰에서 앱을 바꾸거나 탭이 닫힐 때 저장 → 새로고침해도 그대로.
- ↩ **뒤로가기가 앱 안에서**: 폰·브라우저 뒤로가기 = 이전 화면(창이 떠 있으면 창만 닫힘), 주소에 `#problem/ID`·`#lesson/ID` 가 남아 새로고침하면 보던 곳으로.
- 📱 폰: 오답 제출하면 실패한 테스트로 내려감 · 키보드 기호 줄 맨 앞에 ▶ 실행 · ✔ 제출 · 알림은 화면 아래쪽 · 투어 문구 「위쪽 줄에서」 · 체크박스·링크·✕·칩 터치 영역 키움 · 터미널 미션 지문 요약이 줄 중간에서 잘리지 않고 흐려지게.
- 🎨 고대비 「높게」 선택 칩 대비 2.66 → 7.22(흰 글자 고정 → 테마 토큰) · 링크·다크 「전체 초기화」 대비 4.5 이상 · 통계 요일·뱃지 진행률 글자 12px 이상.
- 💻 터미널: `ls | wc -l`·`ls | head`·`ls > 파일` 이 진짜 셸처럼 한 줄에 하나, `ls -1`, `2>`·`2>>`·`2>&1`·`> /dev/null`.
- 🐍 함수·클래스를 안 만들었을 때 NameError 안내 「Dog 라는 이름이 아직 없어요. class Dog: 로 먼저…」.
- 🧪 B5P1 체력이 정확히 0인 경우 테스트 2개. test_shell 111 → 120, regress 에 초안 저장·주소·뒤로가기 3개.
- 그대로 둔 것(의도): 출력만 비교하는 채점(P1-05, 사용자 결정 필요) · 게임 요소 꺼짐일 때 뱃지 작은 토스트 · 본문 버튼 모양 안내 · 코드 칸 최소 14줄 · 폰 터미널 미션의 파일 트리 위치.

## v2.8.10 — 2026-11-06 (Opus 릴리스: QA #136~#139·#144 콘텐츠 묶음 2)

- ⌨ #144 출력에 치기 어려운 글자(`★ → ² —`)가 들어가던 21문제(파이썬 L1D10·L15D15, 알고 E2P1·E2P2·E4P1·E6P1·A0D04·A0D13·A0D15·A1D07·A1D14·A4D14·A9D15·A12D02·A13D12·A20D13, 수학 M1_sigma_q4·M2_logic_q4·M4_limit_q4·M4_poly_q4·M4_wave_q4) → `* -> ^2 -`. 알고 E2·E4 레슨 코드 상자도.
- 🐞 #136 L22 0쪽: 이 앱의 에러 표시(`종류: 설명` 한 줄 + 코드 칸 빨간 줄)와 앱 밖 트레이스백(마지막 줄 + `line N`)을 나눠 설명, 예제를 `range(1, 4)` 버그 코드로 — 실행하면 실제로 IndexError, 고치면 252. 요약·L22P1 퀴즈 문구.
- 📝 #137 X4 막대 예시를 가장 큰 분류 20칸으로, X4P1 지문 예시를 실제 테스트 결과로. X6 생성 예제를 적힌 순서 그대로(따라 하면 프로젝트와 같은 결과), X6 테스트 쪽 `check("abcdefgh")` 를 규칙 5개 결과로.
- ⌨ #139 타자 연습 11개(L6D13·L22D15·A10D06·A10D07·A12D09~D11·A13D12·A13D13·A18D13·A19D14): 빠진 줄(Node 클래스, `import heapq`·`INF`, deque·그래프, `% 4`, `int(input())`)을 지문 코드 상자로, 정답도 같은 줄 모양으로.
- 📝 #138 요약·튜터 요약 10레슨을 지금 쪽에 맞춤, 결과 주석 「한 줄에 하나씩」(L5·L12), L2 한글 변수 이름, L0 에러 문구 `(detected at line 1)`, L19 「글자라야 키」, L11C 더 알아보기 코드 상자, L11D02 「꼼수」, L21 위쪽 경계값.

## v2.8.9 — 2026-11-06 (Opus 릴리스: QA #128~#135 콘텐츠 문구)

- 📝 #129 「레슨 5·7쪽」 3곳 → 「이 레슨 N쪽」(L19P3·L19P5·X6P1). #128·#131 은 이미 해결돼 있어 닫음.
- 📝 #130 L4 1쪽에 초과·이상·미만·이하 ↔ `> >= < <=` 대응표, 「1 이상 10 이하」 예제를 `x >= 1 and x <= 10` 으로, 타자 L4D12 테스트에 끝값 10(범위 안)·0(범위 밖).
- 📝 #132 B3P2 정답 `if not totals:`(빈 것은 거짓 — 아직 안 배움) → `if len(totals) == 0:`, sorted 쪽에 「딕셔너리를 sorted 하면 키가 정렬」.
- 📝 #133 L14 1쪽에 `is` = 「완전히 같은 물건인가」.
- 📝 #134·#135 문제·타자 연습에 필요한데 접혀 있던 설명을 본문으로: L13 `except … as e`, L15 부모 메서드 속 `self.speak()`, L18B `max(…, key=len)`, L20 findall 괄호.

## v2.8.8 — 2026-11-06 (Opus 릴리스: TODO O1-3 합친 새 기능 정리 — 난이도 검사 표 0)

- 🪜 **계단식 시작 코드**(3-2절 「starter 에 대부분 적어 두고 칠 줄을 콕 집기」): L4P2 짝수 홀수(if 부분은 적어 두고 else 두 줄만), L5P3 거북이 정사각형(for 줄까지 적어 두고 안쪽 두 줄), L17P1 쓰고 읽기(저장 부분 적어 두고 다시 읽는 두 줄), L17P5 정렬해서 읽기(저장 부분 적어 두고 읽기·정렬). L18B 는 가벼운 L18P4 를 첫 순서로.
- 📖 알고 본문 보강: A9 「끝까지 따라가기」에 `reversed()`, A12 「간선 목록으로 그래프 만들기」에 `setdefault`, A12 「덩어리 세기」에 함수 안의 함수.
- 🧰 `tools/check_level.mjs` ② 「합친 새 기능」은 이제 starter(빈칸·버그 문제는 주어진 코드)에 이미 적힌 기능을 빼고 셈 — 학습자가 실제로 치는 것만. **주의: 21 → 0 중 17개는 이 기준 변경 몫, 4개가 문제 수정 몫.**
- 결과: check_level 파이썬 ①0 ②0 ③0 · 알고 ①0 ②0 ③0 (O1 시작 때 파이썬 30·알고 7).

## v2.8.7 — 2026-11-06 (Opus 릴리스: 넓은 화면 문제 3단 배치)

- 🖥 (사용자 요청 11/6 「진짜 넓은 화면 배치」) **1920px 이상에서 문제 화면이 「설명 | 코드 | 입력값·출력·테스트」 3단**: 작업판을 코드 쪽(`.pv-main`: 따라하기·코드 칸·실행 버튼)과 결과 쪽(`.pv-side`: 입력값·출력·테스트·결과, 화면에 붙어 따라 내려옴)으로 나눔. 출력 칸이 있는 문제(코드·버그 고치기 등)만, 퀴즈·빈칸은 예전 배치. 1919px 이하는 위아래로 쌓여 순서가 전과 같음.

## v2.8.6 — 2026-11-06 (Opus 릴리스: TODO O1-2 우선 문제 난이도 맞추기 · 「점검」 글자 넘침)

- 🎯 (TODO O1/C10 우선 문제) **본문에서 안 배운 꼴 없애기**: B5P1 `is None` → `result == ""`, B5P2 `None`→`-1`·삼항식→if/else, B7P2 `.endswith`→`m[-4:] == "****"`, `not in` 은 L11B 2쪽 본문에(접힌 더 알아보기에서 꺼냄), AB5P1 `chr/ord` 는 알고 A16 에 새 쪽 「글자 ↔ 번호: ord 와 chr」(시저 암호 한 줄씩 예제) + 정답의 3겹 줄 나눔, L5 거북이 쪽에 `turtle.right`, 힌트 속 `;`·`a, b =` 꼴(B2P2·X1P1·X5P1)은 줄바꿈으로, X3P1 sorted(리스트식) → 리스트식 + .sort.
- 🎯 **레슨 첫 문제는 가장 쉽게**: L4P1 if/else → if 하나만(양수일 때만 출력), L6P1 입력 없이 1~5 세기, L9P1 입력 없이 f-string 한 줄, L15 는 빈칸 문제(L15P4)를 첫 순서로.
- check_level: 파이썬 ① 본문 밖 8→**0**, ③ 첫 문제 무거움 4→1, ② 22→21 · 알고 ① 4→3 (기준값 갱신). `tools/check_nesting.mjs` 가 코드 속 `<=` 비교를 태그로 잘못 지워 일부 줄을 못 보던 것 수정.
- 📝 (사용자 제보 11/6 「코드 적는 공간이 너무 좁아」) **문제 코드 칸 높이를 코드에 맞춤**: 280px(약 10줄) 고정 → 정답 줄 수 + 3줄(최소 14·최대 40줄, 화면 75%까지), 치는 동안 코드가 길어지면 칸도 늘어남. 가계부(정답 21줄)가 스크롤 없이 25줄 보임.
- 🔤 (사용자 제보 11/6) 홈 레슨 카드의 「점검」 글자가 번호 칸을 넘쳐 두 줄로 나오던 것 → 한 줄(글자 줄임), 번호 칸도 넓은 화면 비율(`--wide`)로.

## v2.8.5 — 2026-11-06 (Opus 릴리스: 따라하기 안내가 같은 줄을 건너뛰던 버그)

- 🐞 (사용자 제보 11/6, 보스 「간단한 가계부」) **따라하기 안내가 정답에 두 번 나오는 줄을 건너뜀**: 안내는 「그 줄이 코드 어딘가에 있으면 통과」라서 `item = parts[1]` 처럼 같은 줄이 두 번째로 나오는 단계는 첫 줄 때문에 저절로 통과 → 「검색」에서 item 을 새로 꺼내지 않아 출력이 틀림(식비가 두 번). 이제 앞 단계에 같은 줄이 k개 있으면 코드에 k+1개 있어야 통과.

## v2.8.4 — 2026-11-06 (Opus 릴리스: 넓은 화면 FHD·2K·4K 대응)

- 🖥 (사용자 요청 11/6 「2K 화면까지 지원」) **넓은 화면에서 내용이 가운데 작게 모이던 것**: 사용자가 고른 글자 크기에 화면 폭 비율을 곱함(`--wide`) — 1920px↑ ×1.125·내용 폭 1600, 2400px↑(2K) ×1.25·1840, 3400px↑(4K) ×1.5·2200. 코드 글자·상단바 아이콘도 같은 비율, 홈 3열·설정 화면 폭도 넓힘. 1919px 이하는 그대로. 2560×1440 측정: 본문 16→20px, 홈 폭 1252→1812px, 문제 화면 1692→2132px, 가로 넘침 없음.

## v2.8.3 — 2026-11-06 (Opus 릴리스: 에러 「자세히」 팝업)

- 🩺 (사용자 제보 11/6) **출력 에러의 「자세히」가 에러 사전 화면으로 넘어가 돌아올 길이 없던 것**: 이제 문제·예제 화면에 그대로 머문 채 그 에러의 「왜 나나요 / 자주 하는 실수 / 고치는 법」을 팝업으로(`UI.errorPeek`). 팝업의 「에러 사전 전체 보기」로 가면 사전 화면 위에 「← 돌아가기」가 있어 원래 문제로 돌아옴. 사전에 없는 에러면 안내 문구.

## v2.8.2 — 2026-11-06 (Opus 릴리스: TODO O1-1 괄호 지옥 풀어 쓰기)

- 📖 (사용자 지시 11/6, TODO O1 「긴 코드 줄 나눠 쓰기」 1차) **함수 호출이 3겹 이상 겹친 줄을 한 줄에 한 단계로**: 예) <code>print(sorted(set(nums)))</code> → <code>nums = set(nums)</code> / <code>nums = sorted(nums)</code> / <code>print(nums)</code>, 알고의 <code>a = list(map(int, input().split()))</code> → <code>line = input().split()</code> / <code>a = list(map(int, line))</code>. 파이썬 48줄(28곳)·알고 63줄(31곳) — 정답·시작 코드·힌트·빈칸·틀린 줄 찾기·레슨 예제·본문 <pre> 전부. 문제 설명 2곳(L11BP3·L11BP4)과 힌트 4곳·레슨 문장 1곳은 손으로 고쳐 씀, 틀린 줄 찾기 A5P3·A20P3 는 줄 번호도 옮김. 출력은 그대로(run_solutions 0). 남은 3겹 줄 0개. 새 검사 도구 `tools/check_nesting.mjs` 를 PR 검사(CI)에 연결해 다시 생기면 실패.

## v2.8.1 — 2026-11-06 (Opus 릴리스: 남은 순서 맞추기 → 타이핑)

- ⌨ (사용자 제보 11/6) **남은 「순서 맞추기(Parsons)」 8문제를 타이핑으로**: 파이썬 L6P2·L7P2·L13P4·L14P5·보스 B2P1·B2P2, 알고 A2P5·A10P5 — v2.4.0 「전부 타자」 때 빠졌던 것. id·테스트·힌트는 그대로, 시작 코드(뼈대 + 할 일 주석)를 주고 직접 치게, 「함정 줄」 문구 삭제. A10P5(전위 순회)는 테스트가 비어 있던 것을 입력값으로 BST 를 만드는 진짜 테스트 4개로. 예전 순서 맞추기 기록이 있어도 타이핑 편집기가 시작 코드로 열림. (터미널·Git 코스의 「명령 순서」 문제는 코스 설계상 유지)
- 🔉 (사용자 제보 11/6) **제출 때 소리가 겹쳐 커지던 것**: 테스트마다 「띵동」 2음(+보스는 「쿵」)이 동시에 울려 찢어지는 소리(최대 1.67) → 테스트 통과는 아주 작은 「틱」 한 번(0.12초 안에 또 오면 생략), 모든 소리에 리미터(압축기 + 마스터 0.8)를 달아 겹쳐도 상한(최대 0.37). 클리어·보스 팡파르는 그대로 한 번.

## v2.8.0 — 2026-11-06 (Opus 릴리스: 커밋 그래프 애니메이션 · 놀이터 삭제 · 문제 화면 이동 버튼 · 복습 「왜 나왔나」 위치)

- 🌱 (TODO F2, EXPANSION 6절) **터미널·Git 커밋 그래프 애니메이션**: 명령마다 그래프가 바뀌는 모습이 보임 — 새 커밋은 피어나고, 브랜치·HEAD·origin/·tag 이름표는 새 자리로 미끄러지고(commit·reset·merge·push), 새 선(merge 의 두 선 포함)은 그려지듯 나타남. 그래프 아래 「방금 바뀐 것: 새 커밋 3f2dc9c · main: 6779a73 → 3f2dc9c」 한 줄. 움직임 줄이기 설정이면 바로 바뀜. 모바일은 가장 새 커밋 쪽으로 자동 스크롤(`core/ui-views-shell.js` graphState·animateGraph, `courses/terminal-git/course.css`).
- 🗑 (사용자 결정 11/6) **놀이터 삭제**: 홈 「놀이터」 링크, 레슨 예제 「놀이터로 가져가기」 버튼, 수학 홈 「자유 공간」의 놀이터, 「자유 코딩」 뱃지, 놀이터 XP 설정·CSS 삭제. 옛 링크·저장된 마지막 화면이 놀이터면 홈으로. 예전에 놀이터에서 저장한 코드는 지우지 않고 「내 작품」의 「📄 저장한 코드」로 보여 줌(있을 때만).
- ☰ (사용자 제보 11/6) **문제 화면에서 레슨 문제 목록으로**: 문제 아래 버튼 줄에 「☰ 문제 목록」(레슨 요약 쪽의 연습문제 목록으로, 보스·모의고사·복습 세션 제외). **클리어 창**에 다음 문제가 있어도 「☰ 문제 목록」·「지도로」.
- 🧠 (사용자 제보 11/6) **복습 「왜 나왔나」를 아래로**: 맨 위에 있어 문제로 착각 → 문제 설명·버튼 줄 아래로, 이름 「이 문제가 복습에 나온 이유」, 옅은 상자.

## v2.7.2 — 2026-11-06 (Opus 릴리스: PR #78·#79 CI 속도 고정 · PR #80 온보딩)

- ⚙ (CI, TODO F0 ②③) PR 검사에 `concurrency: cancel-in-progress`(연달아 푸시하면 이전 검사 취소), `PYTHONUNBUFFERED=1`(run 로그 시각을 실제 검사 시각과 맞춤 — 「화면 settings 78초」는 출력 버퍼링 착시였고 실제론 0.3초), regress 의 가짜 기기 연동이 진짜 api.github.com 으로 나가지 않게 차단. 사이트 변화 없음.
- 👋 (TODO F2) 첫 실행 안내(온보딩): 어느 코스로 들어왔는지 「지금 코스: 🗄️ 데이터베이스(SQL)」처럼 표시, 게임 요소가 꺼져 있으면(기본) 마스코트 색 고르기를 빼고 닉네임만.

- ⚙ (CI, TODO F0 ①) PR 검사에서 `playwright install --with-deps chromium` 제거 — regress·run_web_solutions 는 러너에 깔린 `/usr/bin/google-chrome` 을 쓰므로 필요 없었음. 우분투 미러 상태에 따라 1.5~14분 걸리던 단계가 사라짐. 사이트 변화 없음.

## v2.7.1 — 2026-11-06 (Opus 릴리스: PR #74 — 모바일 홈 챕터 줄 스크롤 유지 · 색 대비 올림)

- 📱 (사용자 제보, Opus 가 core 직접 수정) **모바일 홈 챕터 줄**: 챕터 칩을 누르면 가로 스크롤이 맨 왼쪽으로 돌아가 고른 챕터가 안 보이던 문제 → 다시 그려도 위치를 유지하고 고른 칩을 부드럽게 가운데로(`core/ui-views-main.js` `centerChip`, 페이지 세로 스크롤은 안 건드림). **색 대비 올림**(「물 빠진 색」 제보): 다크 바탕 #141a26→#0c111b·회색 글씨 #8e98a9→#aab4c5(카드 위 대비 4.8→7.2)·파랑 #1a73e8→#1f6feb·글자 #7cb4ff, 라이트 회색 글씨 #5f6b7d→#4a5568(4.8→7.0)·테두리 진하게, 잠긴 레슨 카드 투명도 .55→.78(`core/ui.css` 토큰).

## v2.7.0 — 2026-11-05 (Fable: release/v2.7.0 — core 마무리 · 코스 플러그인 훅 · 터미널·Git/SQL/웹 뼈대)
- 🧰 (TODO ★4-1, Fable) **`tools/check_level.mjs` 레슨 수준 검사 도구**: 문제마다 ① 정답·힌트 3이 그 레슨까지 본문(접힌 「더 알아보기」 제외)에 안 나온 꼴을 쓰는지 ② 한 문제가 합치는 새 기능 수 ③ 레슨 첫 문제가 가장 무거운지 → 표(`--course`·`--lesson L11` 근거·`--json`). 래칫 게이트(`--gate`, `tools/check_level.baseline.json` 보다 늘면 실패)로 CI 에 연결. 현재 파이썬 30·알고 7 걸림 → Opus 과제 C10(specs/content-team.md).
- 🔁 (TODO ★5, QA #149 `[core]`) **복습 고르기 11건**: 날 된 문제가 약점에 밀리지 않게(묶음 순서: 날 된 것 전부 → 모자랄 때 약점) · 「더 복습하기」는 날 안 된 클리어 문제에서(모자라면 날 된 것) · 복습에서 연달아 한 번에 맞히면 약점 점수가 반씩 줄어듦(`rec.reviewOk`) · 「다시 고르기」가 실제로 바뀜 · 범위 「전체 해제」= 0개(안내문) · 두 모드 범위 분리 · 타임어택·도전의 별·XP 는 평생 힌트 기준(`max(이번, 누적)`) · 끝 요약 창은 폰 「아주 크게」에서도 버튼이 화면 안(모달 공통 높이 제한·본문 스크롤) · 라이트 대비 5.4:1 · 하루 보너스 날짜 바뀌면 다시 · 약점 분석 「가장 약한 개념 복습」은 정답률 낮은 주제부터.
- ⌨ (TODO ★5, QA #155~#159·#154 `[core]`) **실행기·편집기·레슨 창**: 레슨 창이 열린 동안 뒤 문제 화면 단축키 차단 · 기본 편집기 Tab/Enter/⌫/⇤ 가 실행 취소(Ctrl+Z) 기록을 지키게(`execCommand`, 폴백 유지) · 수학 레슨 창에 상황 글·정적 그림·식 · 「들여쓰기 n칸」이 마지막 줄을 안 가림 · 칸 수 표시 갱신, 수정키+⌫ 는 브라우저 기본, 한글 조합 중 무시, 괄호 안 이어 쓰는 줄·공백 줄은 빨강 제외 · 가로 폰 창 제목 · 모달 Esc(맨 위 것)·닫으면 포커스 복원 · 메인 실행기 출력 상한을 글자 수로, 상한 예외 `EIO`, 「엔진 준비…」 뒤 출력 안 붙음, ⏹ 멈추기를 놀이터·레슨 예제·수학에도 · 가짜 Pyodide(e2e)가 stdout/stderr 순서 흉내 · terminal-git 코스 `Py is not defined` 가드.
- 🧱 **새 코스 뼈대 3개 — 터미널·Git / 데이터베이스(SQL) / 웹·HTTP·API** (허브 카드 「준비 중 · 미리보기 열림」, 레슨 0만 완성본, 나머지 레슨은 「준비 중」). 본문·문제는 Opus 과제 C-T·C-S·C-W(specs/content-team.md).
  - 터미널·Git: 문제 유형 `mission`(검은 터미널 창 + 파일 트리 + Git 이면 3칸 상태 뷰·커밋 그래프 + 목표 체크리스트 실시간 ✓ + 「처음부터」 + `edit` 모달), `quiz kind:'cmd'`·`fill`·`parsons`(명령 순서), 레슨 예제 `example.shell`(한 줄씩 실행). 검증 `tools/run_shell_solutions.mjs`(셸 시뮬레이터로 정답 명령 실행). T0 4쪽·문제 4, TB1 보스 미션.
  - SQL: `core/runners/sql.js`(sql.js 1.13 CDN, 없으면 「엔진을 받지 못했어요」 안내), 문제 유형 `sql`(편집기·▶ 실행·결과 표 정렬/페이지·스키마 패널·데이터 초기화; 채점 rows/state, 실패 시 기대/내 결과 표 비교·행 수 힌트·에러 한국어 풀이), 카페 데이터셋(`courses/sql/datasets.js`, `tools/gen_sql_dataset.py --full` 로 키움). 검증 `tools/run_sql_solutions.py`(Python sqlite3). S0 4쪽·문제 4.
  - 웹: `core/runners/web.js`(iframe srcdoc 샌드박스, console/alert 출력창, **가짜 API 서버** `https://api.academy.local` todos/menu/orders/weather/login, 네트워크 탭), 문제 유형 `web`(HTML/CSS/JS 탭 + 미리보기 폰/PC + 자동 갱신 + 체크리스트 채점·실패 항목 강조·free 문제). 검증 `tools/run_web_solutions.py`(Playwright). W0 4쪽·문제 4.
  - 독립 QA(상 2·중 5·하 7) 반영: 파이썬 실행기 없는 코스의 parsons 실행 버튼·놀이터 안내, 「다음 레슨」·「이어서 하기」·학습 진행이 준비 중 레슨을 건너뜀, 준비 중 레슨 뒤의 보스가 잠기지 않음, SQL 엔진 없을 때 제출은 실패로 기록하지 않음, 미션 목표 미달성이면 Ctrl+Shift+Enter 도 무시, 레슨 창·「모르겠어요」 문구, xp 선택.
  - 공통: `tools/validate/<코스>.mjs` 규칙, regress 절 3개(55검사), `TextEditor` `lang` 옵션(sql·html·css·js 는 파이썬 들여쓰기 규칙·빠른 키 끔, CodeMirror 언어 모듈 지연 로드), `CONFIG.XP` mission/sql/web 25, `run_solutions.py` 는 다른 러너를 건너뜀.
- 🔌 (사용자 결정 11/5 「뼈대는 Fable, 살은 Opus」) **코스 플러그인 훅**(DESIGN 16절): `UI.modes[type]`(문제 유형 플러그인)·`UI.examples[kind]`(레슨 예제 플러그인)·레슨 `draft: true`(「준비 중」)·허브 `preview: true`(잠금 없이 열림)·`tools/validate/<코스>.mjs` 코스별 검증 훅·id 규칙 sql/web.

## v2.6.0 — 2026-11-05 (Fable: release/v2.6.0 — 디자인 개편 ①~⑥ · 게임 요소 기본 숨김 · TODO ★3)
- 🎨 (사용자 결정 11/5 D1·D3, TODO ★3 ①, `[core]` core/ui.css 토큰만) **색·글꼴·버튼 토큰 개편**: 다크는 아주 어두운 남색 바탕(#141a26) → 카드 한 단계 밝게, 액센트는 파랑 하나(#1a73e8, 완료 체크·제출 버튼·진행 막대 전부 파랑), 「맞음/통과」 표시만 초록(`--success`). 라이트도 같은 원칙(회색 바탕·흰 카드·파랑 액센트). 본문 16px, 제목은 크기·굵기로만(h1 1.8em/800, h2 1.35em/800). 지문 안 코드 칩은 노란색 → 차분한 남색/회색, 편집기·출력 상자는 바탕보다 더 어둡게(키워드 보라·문자열 노랑). 문제 화면에서 「▶ 실행」은 테두리 파랑, 「✔ 제출하기」는 채운 파랑으로 구분. 고대비 모드도 파랑 기준으로.
- 📄 (★3 ②, `[core]` ui-views-main.js Views.lesson) **레슨 화면 배치**: 위 브레드크럼(코스 / 챕터 / 레슨) · 왼쪽 「LESSON 14 · 1/3쪽」 라벨 + 큰 제목 + 본문 · 오른쪽 `main.py` 탭 + 「▶ 실행해 보기」 + 편집기 + 「터미널」 탭 패널 · 아래 챕터 스텝퍼(완료 파란 체크, 현재 테두리, 눌러서 이동) · 「이해했어요/모르겠어요」는 작은 텍스트 버튼 · 「다음 →」 큰 버튼(마지막 쪽은 「요약과 문제 →」) · 요약 쪽도 왼쪽 요약/오른쪽 문제 목록. 폰은 설명 → 편집기 → 스텝퍼 세로. 수학 공간(지도형)은 스텝퍼 없음.
- 🗂 (★3 ③, `[core]` Views.home) **홈 = 레슨 탐색기**: 왼쪽 챕터 트리(검색, 고른 챕터는 레슨 목록 펼침, 학습 진행 N/M 막대, 놀이터·타임어택·내 작품·통계·약점 링크) · 가운데 고른 챕터의 레슨 카드(번호·제목·한 줄 설명·상태 완료/학습 중/미학습, 보스·종합 점검도 카드) · 오른쪽 레슨 미리보기(첫 쪽 요약·예제 코드·「▶ 이 레슨 시작」) + 「오늘 할 일」(복습·타자 연습·더 복습하기·일일 목표). 카드 한 번 클릭 = 미리보기, 두 번 = 레슨(폰은 바로 레슨). 폰은 챕터 칩 가로 스크롤 + 카드. 옛 지도의 마스코트·챕터 그림·색 띠·프로필 카드·14일 달력은 뺐어요(프로필 화면에 그대로 있음).
- 🏠 (★3 ④, `[core]` core/hub.js) **허브**: 동물 배너·마스코트 삭제, 「코드 학습 / 파이썬 아카데미」 제목, 코스 카드는 글자 아이콘(Py·Al·>_·SQL·</>·∑), 진행 링은 파랑 하나.
- 🎮 (★3 ⑤, `[core]`) **게임 요소 기본 숨김**: 설정 → 「게임 요소 보기」(기본 꺼짐)를 켜야 XP·레벨·별·스트릭·콤보·콘페티·레벨업 팝업·뱃지 팝업이 보여요. 꺼져 있어도 데이터는 계속 쌓이고(뱃지는 작은 토스트), 상단바는 홈·설정·단축키 선 아이콘만. 문제 결과 상자는 「클리어」만, 레슨 요약 목록은 완료 체크만.
- 🖼 (★3 ⑥) **아트**: 허브 배너(hero)·코스 동물 아이콘·지도 챕터 그림·노드 마스코트 자리 삭제(파일은 그대로). 보스 그림은 카드 56px 자리만. IMAGES.md 3-B절에 8차 요청서(선 아이콘·단색·추상 도형: 코스 아이콘 6, 보스 추상 문양 12) — ChatGPT 생성 → 검수 흐름 그대로.
- 🧹 버튼·제목의 장식 이모지 정리(💡 힌트 → 힌트, 👣 한 줄씩 보기 → 한 줄씩 보기 등), 「이어서 하기」 띠·강조 배경을 파랑 10% 로. regress 홈 검사 6개를 탐색기 기준으로 교체.
- 🔍 **QA 2차(동작·호환) 반영**: 1100px 미만(폰·1024 노트북)에서 「오늘 할 일」(복습·타자 연습·일일 목표)이 가운데 열 아래에 보이게(전에는 미리보기와 함께 통째로 숨었음) · 트리의 잠긴 레슨은 disabled + 눌러도 토스트만 · 미리보기 「▶ N쪽부터 이어서」와 카드 두 번 클릭이 저장 쪽을 들고 가요(전에는 1쪽부터 열고 저장값을 0으로 덮었음) · 게임 요소 끔이면 직접 부르는 뱃지 팝업(`UI.badgeFly`)은 토스트로, 콘페티(`Confetti.rain/burst`)는 안 뜸(보스·모의고사·타임어택·종합 점검) · 수학 공간 홈 프로필 카드(마스코트·Lv·XP)도 게임 끔이면 이름·프로필·약점 버튼만 · 온보딩 안내를 새 홈 기준(트리 → 선택 카드 → 「이 레슨 시작」 → 설정; XP 안내는 게임 켬일 때만, 숨은 요소는 건너뜀) · 트리 아래 링크에 「오늘의 도전」, 게임 켬이면 「프로필·뱃지」 · 게임 끔이면 「도전 XP 2배」→「오늘의 도전」, 「(콤보가 끊겼어요)」·놀이터/다듬기/확장/복습/모의고사/종합 점검의 「+N XP」 문구 숨김, 「목표 달성」 토스트는 XP 없이 유지 · 챕터 0을 골라도 돌아왔을 때 유지(`st.ch == null`) · 모의고사 레슨(AB4) 카드·미리보기는 「15문제 중 3문제 · 60분 · 2문제 이상 통과」로. regress 검사 5개 추가(잠긴 트리·이어서 쪽·1024px 「오늘 할 일」·게임 끔 콘페티/뱃지).

## v2.5.0 — 2026-11-05 (Fable: release/v2.5.0 — 레슨 나누기 · 「약 N분」 삭제 · TODO ★2)
- 🪜 (사용자 결정 11/5 D6, TODO ★2) **레슨 나누기 — 한 레슨 = 개념 하나~둘, 5~6쪽 이하, 문제 3~5개.** 파이썬 레슨 7개를 17개로: L3 계산하기 / L3B input · L7 리스트 만들고 꺼내기 / L7B 넣고 빼고 돌기 · L10 딕셔너리 이름으로 찾기 / L10B 돌기와 세기 · L11 튜플 / L11B 집합(새로 씀) / L11C 컴프리헨션 · L12 리스트 안의 딕셔너리 / L12B 2차원 리스트 / L12C 정렬과 복사 · L16 모듈과 random / L16B 날짜 맛보기 · L18 람다와 정렬 기준 / L18B map·filter·enumerate·zip. 새 레슨 id 는 알파벳 접미(L3B), 새 문제 id 는 L3BP1·L3P7 처럼. 기존 문제·타자 연습은 **id 그대로** lesson 만 옮겨 클리어·별·복습 기록이 그대로 이어져요. 레슨마다 문제를 쉬운 것 → 합친 것 순서로 재배치, 새 문제 22개(PROBLEMS.md).
- ⏱ (사용자 결정 11/5 D5) 「약 N분」 삭제: 레슨 상단은 「N쪽 · 문제 M개 · 현재/전체」, 허브 카드 「남은 시간」은 「남은 문제 N개」. `minutes` 필드를 네 코스에서 전부 삭제.
- 🔢 (QA #128) 본문·지문의 「레슨 N」 참조 36곳을 `[[레슨:L11C]]` 토큰으로 바꾸고 렌더할 때 번호를 계산(`[core]` UI.terms) — 앞으로 레슨을 더 나눠 번호가 밀려도 본문이 안 틀려요. validate 가 없는 레슨을 가리키는 토큰을 잡아요. 힌트 2곳은 레슨 제목으로.
- 🔓 `[core]` 진행 보호(QA 11/5 상 1건): 나눈 레슨에 새 문제가 들어가도 **이미 지나간 레슨은 잠기지 않아요** — 한 문제라도 푼 가장 뒤 레슨까지(와 그 다음)는 항상 열리고 그 챕터까지 열림(`Game.furthestIdx`), 「이어서 하기」도 거기서 시작. 종합 점검은 점수가 있거나 지나간 자리면 잠그지 않음. 옛 「모르겠어요」 기록의 없어진 쪽 번호는 버림. 레슨 상단 「N쪽」은 본문 쪽 수.
- 🧪 `[core]` COURSE_ID_PATTERNS 파이썬에 접미 허용, CHECKUPS 종합 점검 2 를 L10B 뒤로, 「문제 3개 미만 레슨」 경고, validate 「레슨 N」 숫자 참조 경고, regress 검사 2개(L3 타자 연습 7개·옛 기록 레슨 열림).
- 🔎 릴리스 전 QA 2갈래(콘텐츠 읽기 검수·core 화면/옛 저장): 상 1(위 진행 보호)·중 10·하 14 → 반영. 콘텐츠: L7 len 쪽 예제의 append 제거, L11P8 을 (이름, 점수) 튜플로(중복 제거), L18D13 을 L18B 로, L18B 에 zip 문제 L18BP2 추가, L16 floor/ceil 을 본문으로, 숫자 참조 4곳 토큰화, 「이 레슨 N쪽」, summary 보강, L11B 중괄호 집합 한 줄, L16B 안내 문장.

## v2.4.0 — 2026-11-05 (Fable: release/v2.4.0 — 블록 삭제, 전부 타자 · TODO ★1)
- ⌨ (사용자 결정 11/5 D2, TODO ★1, `[core]`) **블록(스크래치식) 코딩 삭제 — 파이썬 코스는 전부 직접 타자.** 블록 문제 21개(L1~L8·B1)를 타자 문제로: 지금 정답 그대로, L0~L3 는 한두 줄 따라 치기 수준(starter 에 나머지 적힘), 그 뒤는 starter 에 틀 + 지문이 「셋째 줄에 print 한 줄」처럼 쓸 줄을 콕 집음.
- 🧩 「Parsons / 텍스트로 풀기」 고르기 창(dual 9개) 삭제 — 기본이 타자. 정답 4줄 이하 Parsons 7개(L5P2·L8P2·L9P1·L10P1·L11P5·L12P4·L18P5)도 타자로. 줄 순서 자체가 연습인 6개(L6P2·L7P2·B2P1·B2P2·L13P4·L14P5)만 순서 맞추기로 남김. 텍스트 XP ×1.5 배율도 삭제.
- 🧹 `core/`: Blockly CDN 로드·블록 편집기·놀이터 「🧱 블록」 탭·블록 따라하기 코치(GUIDES)·「텍스트로 직접 고치기」 버튼·블록 CSS 삭제(core/ui-editors.js −115줄, ui.css −15줄). 레슨 본문의 「블록 화면에서는…」 문장 2곳 삭제. 뱃지 「블록 졸업」 → 「첫 타자」.
- 💾 옛 저장 호환: 예전에 블록·Parsons 로 풀다 만 기록(`rec.mode` 'block'|'parsons')이 있어도 문제가 starter 로 열림(저장된 블록 JSON 은 버림). 옛 블록 「내 작품」은 저장된 파이썬 코드로 열림. `tools/regress.py` 에 검사 3개 추가.
- 🧪 `tools/validate_content.mjs`: `type:'block'`·`dual`·code 문제의 `parsons` 잔재·정답 4줄 이하 Parsons 를 에러로 막음. `tools/e2e_submit/e2e.py`: vary(변형) 문제도 기본 파라미터 정답으로 제출(L2P3·L2P5·L3P1).
- 📋 문서: specs/qa-team.md 2-2절 1항·content-team.md·DESIGN.md 14-2절을 「전부 타자」 기준으로.
- 🔎 릴리스 전 QA(에이전트 2갈래: 콘텐츠 「풀 수 있나」 읽기 검수 + core 코드·헤드리스 화면 24장): 상 0 · 중 7 · 하 20 → 전부 반영. 콘텐츠 쪽: L5P6 들여쓰기 안내, L10P2 `pass` 설명·줄 짚기, L10P5·L7P6 starter 틀, L9P2·L9P5·L11P3·L5P3·L6P4 쓸 줄 짚기, L2P3 나이 25~45(성인), L4P1·L4P5 「넷째 줄부터」, L18P5 태그 복원, B2P2 중복 solution 제거, 뱃지 「Parsons 졸업」→「순서 맞추기 졸업」, 코치 「N번째 줄」이 빈 줄 포함 실제 줄 번호로. core 쪽: 집중 모드 밖 코치 코드 줄 flex 깨짐(CSS 잘림) 수정 + regress 검사, 놀이터 외톨이 「⌨ 텍스트」 버튼 → 「⌨ 코드」 라벨, 죽은 코드·상수·문서 문구 정리.

## v2.3.22 — 2026-11-05 (Opus: release/v2.3.22 — 폰 코드 가독성)
- 📱 (사용자 제보 11/5 「코드 모바일 가독성」, QA #162, `[core]` CSS) 레슨 코드 상자와 따라 하기 편집기가 **줄을 접지 않고 상자 안에서 옆으로 넘겨** 봐요 — 낱말 중간에서 끊기고 줄 번호(1·2·3)와 실제 줄이 어긋나던 것. 레슨 코드 상자 글자도 편집기와 같은 코드 글자 크기로.
- 📖 파이썬 레슨의 긴 「딕셔너리를 담은 리스트」 한 줄 5곳을 한 칸에 한 줄씩 펼쳐 씀(L12 등).

## v2.3.21 — 2026-11-05 (Fable: release/v2.3.21 — 기기 연동 팝업)
- ☁ (사용자 제보 11/5 「다른 기기 진행 상황 팝업이 계속 나옴」, QA #161, `[core]` core/sync.js) 「☁ 다른 기기의 진행 상황을 가져왔어요」는 이제 **클리어·별·XP·작품이 실제로 늘어서 들어왔을 때만**, 그리고 **한 기기에서 10분에 한 번만** 떠요. 설정·메타만 달라진 동기화는 조용히 합쳐요(합치기 동작은 그대로).

## v2.3.20 — 2026-11-05 (Fable: release/v2.3.20 — L11 난이도 + 검수 규칙)
- 🪜 (사용자 제보 11/5 「튜플·집합·컴프리헨션에서 진도를 못 나감」, QA #160) **L11 문제를 쉬운 것부터**: 퀴즈 → 제곱 리스트 → 빈칸 → 줄 맞추기 → 중복 제거. 「중복 제거」는 가운데 한 줄만 쓰면 되게(입력·출력 줄은 미리 적어 둠), 코드 문제 2개는 타자 대신 **줄 끌어다 맞추기(Parsons)** 도 고를 수 있게. 줄 맞추기 문제의 안 배운 `list(range(…))` → `range(1, 11)`.
- 📋 (문서) 검수가 「맞나」만 보고 「풀 수 있나」를 안 본 것 → 규칙으로: specs/qa-team.md 2-2절·content-team.md 3-2절·DESIGN.md 14-2절. 다음은 레슨 수준 검사 도구 `tools/check_level.mjs` 와 L12~L18(HANDOFF).

## v2.3.19 — 2026-11-05 (릴리스 당번 Opus·단일 세션: release/v2.3.19 — 열린 PR #55~#64 를 한 번에)
- 📖 (QA #117~#119, PR #61·#62) **파이썬 레슨 전체를 「한 쪽 = 기능 하나」로 다시 씀**(129 → 223쪽): 무엇인지 한 줄 → 가장 단순한 코드(결과 주석) → 언제 쓰나·주의 한두 줄, 응용·엮기·꼼수는 쪽 끝 접힌 「💡 더 알아보기」로. L11 은 튜플 / 나눠 담기·맞바꾸기(왜 `a = b` 로는 안 되는지부터) 두 쪽으로, 집합 쪽에 `in` 설명. 레슨 안 코드 상자 모양(`[core]` CSS).
- 🧠 (QA #116, `[core]` PR #60) **오늘의 복습·더 복습하기 고르기 다시** — 약점(틀림·힌트·정답 보기·별·약한 주제) 우선 + 배운 챕터 고르게 + 밀린 날 + 범위 직접 고르기 + 「왜 나왔나」 + 시작 전 미리보기 + 끝 요약. 버그 2: 처음 풀 때 쓴 힌트 수가 복습 단계에 계속 남아 1일 간격에 갇히던 것, 복습 화면에 예전 힌트·정답이 펼쳐진 채이던 것.
- 🪟 (QA #120~#122, `[core]` PR #63) 타자 연습·복습·도전 중 「📖 레슨 설명 보기」는 **창으로** 열려 세션·친 코드가 그대로 · 줄 앞 공백에서 **백스페이스 한 번 = 들여쓰기 한 단계** · **들여쓰기 칸 보이기**(CodeMirror: 칸마다 점, 4의 배수가 아니면 빨강 / 기본 편집기: 「들여쓰기 n칸」).
- ⏹ (QA #123, `[core]` PR #64) 끝없이 출력하는 코드: 출력을 8KB 씩 묶어 보내고 **100만 글자 넘으면 멈추고 안내**, 실행 중 **⏹ 멈추기** 버튼.
- ✏️ (QA #124, PR #64) 백문이불여일타 **모호한 지문 53개**(파이썬 36·알고 17) 다시 씀 — 무엇이 조건인지·출력/계산 순서·필요한 값(「같은 그래프」 대신 실제 데이터).
- 📚 (콘텐츠 11/4, `content/glossary-1104`) 용어집에 기초 용어 36개(실행·주석·정수·몫·참·거짓·인자·반환값·None·기본값·중첩·줄바꿈·인스턴스·생성자·파일·인코딩·디버깅·트레이스백·상수·시드 등, 58 → 94) · 파이썬 레슨에서 그 용어가 처음 나오는 22곳에 밑줄(누르면 뜻). 레슨 쪽 예제는 이미 129쪽 중 128쪽에 있어(L0 5쪽은 퀴즈 안내) 추가하지 않음.
- ⌨ (콘텐츠 11/4, `content/drills-ch4-7`) **백문이불여일타 챕터 4~7 — 파이썬 L13~L23 11레슨 × 15 = 165문제**(195 → 360): 예외 처리·클래스 1·2·모듈(random 은 seed 고정, 날짜는 고정 날짜)·파일(코드 안에서 쓰고 바로 읽기)·람다·날짜·정규식·assert·디버깅(고친 코드·추적 print 치기)·설계(상수·함수 나누기). 그 레슨까지 배운 문법만. 여러 줄 출력은 전부 「이렇게 나오면 돼요」 상자.
- ⌨ (콘텐츠 11/4, `content/algo-drills`) **알고리즘 코스에도 백문이불여일타 — A0~A20 21레슨 × 15 = 315문제**: 코딩테스트에서 매번 치는 템플릿(스택·덱·재귀·정렬·이진 탐색·해시 세기·Node 클래스·BST·heapq·BFS/DFS·다익스트라·DP 표·투 포인터·누적합·비트마스크·방향 배열·백트래킹·빠른 입력)을 짧은 조각부터 완성형까지. 홈 「⌨ 백문이불여일타」 카드·범위 화면·레슨 요약 카드는 파이썬과 같은 화면 그대로. `[core]` `core/config.js` `COURSE_ID_PATTERNS.algo` 에 `D` 추가(한 줄, Fable 검토 대상).
- 📐 (콘텐츠 11/4, `content/math-nodes-1104`) **수학 공간 새 노드 7개 · 28문제**(38 → 45노드, 152 → 180문제) — 기존 그림 kind 만: M3_sample 표본평균과 표준오차(hist) · M4_poly 다항함수 극대·극소(plot) · M4_wave 삼각함수 진폭·주기(plot) · M4_ease 보간(lerp)과 이징(plot) · M5_cross ★ 2D 외적과 행렬식(transform) · M5_system ★ 연립방정식과 역행렬(plot) · M5_eigen ★ 고유벡터·고유값 맛보기(transform). 노드마다 그림·관찰 → 식과 코드 → 「한 단계씩」, 문제 탐구 2·숫자 1·코드 1. 태그 +추정·이징·외적·연립방정식·고유값.
- 🔧 (릴리스 검수 뒤 Fable 수정 11/5) 검수에서 나온 「상」 11건: L16 「날짜 더하기·빼기」 쪽(timedelta) · L11 `sorted(…, reverse=True)` · L20 `.group()`·`group(1)`·`.` `\w` 본문으로 · 타자 L16D12 `int()` 안내 · 알고 A6D15 피벗·A7 `import bisect`·A20D08 `sys.stdin`·A3 `deque` import 안내 · `[core]` 지문 속 연속 공백이 한 칸으로 보이던 CSS(`pre-wrap`) · `[core]` 복습 숫자가 프로젝트·모의고사·타자 연습까지 세던 것(#148) · `[core]` 실행기: 시간 초과·⏹ 로 끝나도 앞 출력이 남고, stdout/stderr 순서, 멈춘 뒤 정답 캐시, 워커 없는 환경 멈추기 금지(#150~#153). 수학 상 3건(#145~#147)은 v2.3.20.
- 검사(11/5 릴리스 검수, 합친 상태): validate OK · 정답 실행 1,148 FAILS 0 · 레슨 예제 431 실행 오류 0 · test_shell 111 · regress FAILS 0 · 화면 제출(가짜 Pyodide) 파이썬 414·알고 401·수학 44 실패 0 · PR 별 읽기 검수(QA.md 「릴리스 검수 — 11/5」 절). 검수에서 찾은 남은 것은 QA.md·QA-OPEN 에.

## v2.3.18 — 2026-11-03 (릴리스 당번 Opus·단일 세션: fix/qa-1103-round6 — v2.3.17 다방면 재검)
- 🐞 (QA #109, **v2.3.17 회귀**) 백문이불여일타 14문제 + 보스 B3P1 의 「이렇게 나오면 돼요」 상자에 줄바꿈 대신 `\n` 글자가 보이던 것 → 실제 줄로. 다시 생기지 않게 콘텐츠 검사에 「상자 = 테스트 1 출력」 비교를 넣음.
- 📱 (QA #110, `[core]` CSS) 폰에서 알고리즘 추적 퀴즈(A10P2·A12P2·A13P2)를 열면 화면 전체가 옆으로 밀리던 것 → 코드 상자 안에서만 옆으로 넘겨 봐요.
- ✨ (QA #111, `[core]` CSS) 문제 지문 상자 위아래에 생기던 빈 줄 없앰(세 코스 71문제).
- 💡 (QA #112~#114) 힌트 3에 빠진 입력 줄(L4P2·L4P5·B1P1·B1P2·L5P6), B4P1 힌트 여러 줄로, L21P2 힌트 순서·`def` 머리줄, L12D04 힌트 1, L1P3 해설에 `<b>` 가 글자로 보이던 것, X2P1 레슨 번호(17 「파일이 없을 때」)·B2P2·L10·B5P2(`None` 설명)·B7P1(괄호 묶음) 문구.
- 🔧 (도구) `tools/e2e_submit/` — CDN 없이도 앱 화면에서 정답 제출까지 자동으로 돌려 보는 검사(가짜 Pyodide = 진짜 CPython). 이번 검사: 파이썬 코드·타자 249/249 · 버그·빈칸 31/31 · 알고 86/86 · 수학 37/37 클리어.
- 검사(QA 6회전): 배포 상태(버전·캐시 129개·CI·Pages) · 게이트 FAILS 0 · 세 코스 1280·390px 화면 에러 0, 가로 넘침 0 · 오프라인(서비스 워커) · 옛 저장 데이터 4종 · 폰 타자 연습 흐름 · 독립 검토(v2.3.17 diff 112곳).

## v2.3.17 — 2026-11-03 (릴리스 당번 Opus·단일 세션: fix/qa-1103-python — 파이썬 QA 5회전)
- 🔍 (사용자 요청 「파이썬 한정으로 QA를 돌아」, QA #98~#108) 파이썬 코스 레슨 30·문제 148·타자 연습 195를 전부 열어 보고(폰·PC 폭) 읽어 보며 검사 → 찾은 것 전부 고침.
  - 🐞 **실전 X3 「파일 정리」를 맞게 풀어도 통과 못 할 수 있던 것** — 실행 전에 업로드 파일을 쓴 뒤 결과 파일을 지우던 순서를 반대로(QA #98, `[core]`).
  - 📱 **폰에서 긴 코드 한 줄이 화면을 넘어 가로로 밀리던 곳 19곳** → 넘칠 때만 줄바꿈(레슨·지문·퀴즈·튜터·결과·줄 맞추기 조각, QA #99·#100, `[core]` CSS).
  - 💡 **힌트 3(거의 정답) 31개**가 여러 줄 코드를 「 / 」로 한 줄에 이어 써서 그대로 옮기면 에러 나던 것 → 실제 줄·들여쓰기로. 힌트 순서가 거꾸로던 3문제(L17P5·L23P3·L23P5)도 방향 → 구체 → 거의 정답으로.
  - 📖 L10 딕셔너리에 `values()`·`keys()` 설명(B3P1 가계부에서 쓰는데 안 배웠던 것) · L7 빈 리스트 `bag = []` 예 · L15 「speak 두 줄 지우고 `pass`」 · X4 `-kv[1]` 정렬·X6 `_` 설명.
  - 🧩 보스 지문 정리: 「더 커요/더 작아요」가 어느 쪽 기준인지(B1·B2), B1P2 괄호 속 지시를 문장으로, B3P1 출력 예, B4 「n라운드」「최다 연승」 예시, B4P2 삼항식 → `if/return`, B7P1 `re.match`·`group` 주석.
  - ⌨ 타자 연습 15개 + 레슨 쪽·문제 9곳: 괄호·「 / 」로 이어 쓴 출력을 **「이렇게 나오면 돼요」 상자**에 실제 줄 그대로(입력이 있으면 함께).
  - 실전 지문: X1P1 반 순서, X2P1 `wrong.csv` 가 없을 때, X6P1 출력의 줄표 「—」 → 「-」(치기 쉽게, 테스트·정답 같이), X5P1 예시 편수 오타 등.
- 검사: 헤드리스 크롬 1280·390px 로 레슨 쪽 159·문제/타자 343 × 2 → 페이지 에러 0 · 빈 화면 0 · 가로 넘침 19 → 0. 힌트 3 그대로 실행 「안 되는」 22 → 8(남은 건 일부러 일부만 보여 주는 힌트). 게이트 FAILS 0.

## v2.3.16 — 2026-11-03 (릴리스 당번 Opus·단일 세션: fix/drill-prompts)
- ⌨ (사용자 제보 QA #97) 백문이불여일타 지문 27개를 알기 쉽게 — 「(쉼표 사용)」 같은 짧은 괄호 지시를 「print 괄호 안에 쉼표로 나눠 넣으면 빈칸이 생겨요」 + 예시 코드로, 출력 여러 줄을 「A / B / C」로 이어 쓰던 것을 **「이렇게 나오면 돼요」 상자**에 실제 줄 그대로.

## v2.3.15 — 2026-11-03 (릴리스 당번 Opus·단일 세션: feat/drills)
- ⌨ (사용자 요청 QA #96) **「백문이불여일타」 — 파이썬 초반 타자 연습 195문제**: 챕터 0~3(L0~L12) 레슨마다 15문제, 방금 배운 문법을 그대로 따라 치는 짧은 문제(생각은 조금, 타자는 많이).
  - 홈 「오늘의 복습」 밑 **「⌨ 백문이불여일타」** 카드 → 내가 연 챕터·레슨이 체크 목록으로 나오고, 넣고 빼서 시작(고른 범위는 기억). 안 친 문제부터 5문제씩, 끝나면 「5문제 더?」.
  - 레슨 요약 쪽에도 그 레슨만 바로 치는 카드.
  - **무조건 직접 타자**: 블록·줄 맞추기 없음, 따라하기 복사 숨김, 붙여넣기 막음. 안내문에 **💻 PC(키보드) 권장**.
  - 레슨 완료 조건이 아니라서 진도·문제 수·뱃지는 그대로예요. 한 문제 5 XP.

## v2.3.14 — 2026-11-03 (릴리스 당번 Opus·단일 세션: 레슨 설명 보강 content/lesson-explain)
- 📖 (콘텐츠, 사용자 제보 QA #95 「설명이 엄청 빈약해」) **세 코스 레슨 설명 전체 보강** — 비유·왜 필요한지 → 개념 → 예제를 한 단계씩 따라가기(값이 어떻게 바뀌는지) → 예제 하나 더.
  - 파이썬 30레슨: 쪽 87 → 129, 설명 3.4배, 예제 85 → 128
  - 알고리즘 27레슨: 쪽 75 → 122, 설명 4배, 예제 75 → 122 (정렬·탐색·재귀·그래프는 반복마다 상태 따라가기)
  - 수학 38노드: 노드마다 새 3쪽 「한 단계씩」(숫자로 따라가기 + 예제), 설명 4배
  - **문제를 푸는 데 필요한데 레슨에 없던 내용 40곳 이상 보탬**(L7 `split()`, L10 두 변수로 나눠 받기, L12 정렬 `key`·`round`, L14 값을 돌려주는 메서드, L17 `"\n"` 직접 붙이기, A3 요세푸스, A9 맨 뒤에 붙이기, A14 카데인, A16 아나그램 `setdefault`, M1_divisor 부족수·과잉수, M4_quad 두 근 순서, M2_logic 비트 꺼내기 등). 문제·힌트는 그대로.
  - 예제 326개 전부 실행 확인(일부러 에러를 보여 주는 4개 제외), 새 쪽 390px 가로 넘침 없음.

## v2.3.13 — 2026-11-03 (릴리스 당번 Opus·단일 세션: PR #45·#46·#47)
- 📝 (docs) `TODO.md` 새로 — 예정 코스 8개(CS · 운영체제 · 디버깅·테스트 · 데이터 분석 · 객체지향·설계 · AI·머신러닝 기초 · AI와 협업 · **GitHub(가장 중요)**): 목적·범위 후보·기존 코스와 겹침·실행 방법 후보·Fable 설계 체크리스트. HANDOFF 6절·EXPANSION 1절에서 가리킴. 사이트 변화 없음.
- 📝 (docs, 사용자 정정 11/3) **「무료 교육」 범위**: 교육을 돈 받지 않고 제공한다는 뜻 — 계정·설치·API·외부 AI 도구를 막는 규칙이 아님. HANDOFF 1절·DESIGN 14절·NEXT 0절·TODO 0절 문구 수정.
- 🧠 (유지보수 `[core]`, 사용자 제보·요청 QA #89~#92) **오늘의 복습·오늘의 도전·타임어택에서 예전 내 답이 이미 적혀 나오던 문제** — 이제 시작 코드부터 다시 풀어요 · **오늘의 도전을 풀고 「다음 문제」로 넘어가면 일반 문제가 돼 「XP 없음」이 뜨던 것** — 도전 끝에는 「오늘의 도전 완료 · 홈으로 · 더 복습하기」 · 홈 복습 카드에 **「🔁 더 복습하기」** — 클리어한 문제 중 5문제씩 원하는 만큼(복습 일정은 그대로).
- 📖 (유지보수, 사용자 제보 QA #93·#94) 파이썬 L10 딕셔너리: 1쪽 설명을 예제와 같은 `price` 로 · **「단어 세기」가 너무 어렵던 것** — 레슨 3쪽에 개수 세기 패턴을 한 단계씩, 지문에 예시·방법, 시작 코드에 뼈대, 힌트 3단계 다듬기, get 빈칸 문제 다음으로 순서 이동.

## v2.3.12 — 2026-11-02 (릴리스 당번 Opus·단일 세션: PR #36·#37·#38·#39·#40·#41·#42)
- 🔧 (유지보수 `[core]`, **사용자 승인 11/2 17:38**, PR #39) **힌트 칸 여러 줄 코드가 줄바꿈·들여쓰기 그대로** 보여요(QA #70) · **알고 실전 프로젝트를 끝낸 사람의 E2~E6 이 다시 잠기던 문제** — 연습 문제는 선택(#72), 마스터 뱃지도 프로젝트만(#73) · 홈 지도 점선이 노드 동그라미를 지나가게(#81) · 수학 그림 글자 겹침·잘림(탐침 값, 단위원 sin/cos·눈금, 회전 î·ĵ, #80·#82)과 `-0.00`(#88).
- 📐 (콘텐츠 C10 2부, PR #40) 수학 공간 **영역 2 「논리·집합·증명」** 노드 4개(34 → 38노드, 136 → 152문제): 집합 연산(벤 다이어그램) · 명제와 진리표(전구 3개) · 함수·일대일·역함수 · 비둘기집 원리 ★. 뱃지 「논리 설계자」.
- 📏 (콘텐츠 C9, PR #41, QA #33) 수학 난이도 표기 기준(PROBLEMS.md) — 순열·조합 고1, 기하분포 대학 ★.
- 🧹 (유지보수, QA #71·#74·#75·#77·#78) 알고 힌트 2 들여쓰기 5문제(A5P2·A5P4·A7P3·A8P4·A11P5 — 그대로 따라 써도 돌아가게) · 실전 E1~E6 **연습 문제가 프로젝트 앞**에 · E1P2 힌트 3 에 시작·출력 줄 · A20 1쪽 슬라이더 최대 2000·출력이 고른 n 을 따름 · A5P5 힌트 1 「비교표」 → 「삽입 정렬」.
- 🧹 (유지보수, QA #76·#79·#83~#88) 수학: M4_linear_q4 **맞는 풀이가 `-0.00` 으로 떨어지던 것**(지문·정답·힌트에 `+ 0`) · M4_quad_q4 중근 `-0.00` · 무한 반복 starter 3개(`pass` → `break` 뼈대) · M4_limit 슬라이더 −8~8(그림과 같게) · M4_explog_q2 지문을 그림 범위 안 값으로 · M3_monte observe·힌트 숫자 · M4_quad_q3 제목·M4_limit_q1 설명(반올림).
- 🎨 (아트, PR #42) 6차 E 최종 검수 — 영역 4 장식 3차 통과로 6차 4장 완료(총 94장), `img_clean` 이 영역 그림 크기도 검사, 7차 초안(사용자 결정 대기).

## v2.3.11 — 2026-11-02 (릴리스 당번 Opus: PR #25·#30·#32·#33·#34, #31 은 #25 에 포함)
- 🎨 (아트 6차 E 3차 납품, PR #33) 수학 영역 4 장식 `area-math-4` 를 굵은 포물선 띠로 다시 교체 — 2차본은 띠가 가늘어 32px 지도에서 눈썹처럼 보였음(32px 면적 11.6% → 23.2%). 릴리스 당번이 병합 전 `img_clean --check`·다크/라이트 축소본 확인(최종 검수 기록은 다음 아트 PR).
- 🎨 (아트 6차 E 2차 납품, PR #31 포함) 수학 영역 4 장식·완료 뱃지 교체 — 사람 아이콘처럼 보이던 좁은 아치를 낮은 포물선·오른쪽 공·점 궤적으로. 아트팀 검수: 뱃지 통과, 장식은 띠가 가늘어 32px에서 안 읽혀 3차 재요청(그 전까지는 2차본 사용).
- 📝 (QA팀 3회전) `QA.md` 3회전 절: v2.3.9 core 수정(B·D그룹·#61·#48) 브라우저 재검 전부 ✓, QA 2회전 수정분 재검(반영 21), C7 힌트 39·C8 연습 6 점검, v2.3.10 재검(C그룹·사용자 제보·C10 영역 4 노드 6개) — 새 발견 #70~#88(C8 이후 **알고 실전 E2·E3·E4·E6 이 다시 잠기는 회귀**, 힌트 칸 줄바꿈 미표시 등). 남은 문제만 모은 **`QA-OPEN.md`** 추가(팀 통합 인수인계용). 코드 변경 없음.
- 📝 (팀 통합 메모, PR #25·#30·#32) 분리 운영 중 생긴 문제·넘길 일: `specs/team-merge-notes.md`(유지보수) · `specs/memo-content-team.md`(콘텐츠) · `specs/memo-art-team.md`(아트). QA 3회전의 남은 문제 모음 `QA-OPEN.md`.

## v2.3.10 — 2026-11-02 (릴리스 당번 Opus: PR #23·#25·#26·#27·#28·#29)
- 🧹 (유지보수, 사용자 제보 QA #68·#69) 지도 챕터 「완료 ✓」 칩이 두 줄로 깨지지 않게 · 파이썬 L9 1쪽에 `s[:2]`·`s[2:]` 설명 한 문장.
- 🖥 (유지보수 `[core]`, 사용자 제보 QA #64) PC 홈에서 챕터 지도가 오른쪽 좁은 열로 쏠리던 문제 — 지도는 넓은 왼쪽, 프로필·오늘의 할 일은 같은 줄 오른쪽으로(검색창이 격자 한 칸을 차지하던 것). 모바일은 그대로.
- 🎨 (아트팀) 6차 E 검수 — 수학 영역 2 장식·뱃지 2장 통과, 영역 4 장식·뱃지 2장 반려(사람 아이콘처럼 보임 → 프롬프트 고쳐 재요청). 영역 4·2 는 아직 화면에 안 나옴(콘텐츠 C10 전).
- 📈 (콘텐츠팀 C10) 수학 공간 **영역 4 「함수·변화·미적분」** 노드 6개(28 → 34노드, 112 → 136문제): 일차함수와 기울기 · 이차함수(포물선·꼭짓점) · 지수·로그 함수(y = x 대칭) · 삼각함수와 단위원 · 극한의 수치 체험(sin x ÷ x, e) · 미분 = 접선(할선이 접선에 붙는 그림). 전부 기존 그림 종류(plot·unitcircle)만 사용, 노드마다 탐구 2·숫자 답 1·코드 1. 뱃지 「변화 탐험가」(영역 4 완료), 추천 경로 게임·데이터에 영역 4 노드 추가, 약점 태그 +4. `CONFIG.COURSES` math total 136·lessons 34(값만).
- ☁ (유지보수 `[core]`, 사용자 제보 QA #67) **기기 연동이 코스별 기록을 섞던 문제** — 허브 수학 진행도가 파이썬 푼 개수만큼 부풀려 보이던 것. 이제 모든 코스를 따로 묶어 올리고 따로 합쳐요. 이미 섞인 기록은 앱을 열 때 자동으로 제자리로 돌아가요(진행은 지워지지 않아요).
- 🧪 (유지보수 `[core]` C그룹, QA #3·#5·#32) **알고 모의고사 중에는 따라하기 안내·정답 보기가 안 나와요**(힌트는 그대로) · 허브 「이어서 보기」가 레슨을 보던 쪽에서 열려요 · 수학 두 점 거리 그림 글자가 레슨과 같은 대문자 B − A.

## v2.3.9 — 2026-11-02 (릴리스 당번 Opus: PR #11·#12·#13·#14·#15·#16·#17·#18·#19·#20·#21)
- 💡 (콘텐츠팀 C7) 알고리즘 A0~A15·보스 AB1~AB3 힌트 86개 전수 점검 — 39문제 수정. 코드 문제의 힌트 1이 코드 조각부터 시작하던 것을 **아이디어를 말로 짚는 단계**로 바꾸고(기존 코드 힌트는 2단계로 합쳐 보존), 3단계를 정답과 같은 코드로 맞췄어요. A2P3·AB1P2 힌트 3의 틀린 코드도 고쳤어요. 점검 결과는 QA.md.
- 🧩 (콘텐츠팀 C8) 알고리즘 실전 E1~E6에 **연습 문제** 하나씩(알고리즘 139 → 145문제): 각 프로젝트의 한 단계만 떼어 낸 작은 코드 문제 — 미로 최단 거리(👀 격자 시각화)·두 역 최단 시간·최소 교실 수·친구 그룹 세기·역색인 검색·명령 따라 움직이기. 입력 방식(`sys.stdin.read()`)은 프로젝트와 같고 테스트 4개씩. `CONFIG.COURSES` algo total 145(값만).
- 📝 (QA팀 v2.3.8 재검) `QA.md`: 유지보수 [core] A그룹 7건 중 6건 브라우저 재검 확인, #6 시각화 콘솔 에러는 재생 타이머 경로에 남아 재열림(#61) · #13 L5P6 확인 · 콘텐츠팀 C6 힌트 16건 중 15건 확인, L17P2 힌트 3 실행 불가(#60). 코드 변경 없음.
- 🎨 (아트팀 A1) IMAGES.md 6차 요청서 — 수학 영역 4·2 장식 2장 + 영역 완료 뱃지 2장(C10 콘텐츠와 짝). 32px용 굵은 소재 기준, 납품은 `art/6차` PR 로.
- 🎨 (아트 6차 E 납품) 수학 영역 4·2 장식과 영역 완료 뱃지 4장. 지정 프롬프트·참조 원문 사용, 파일 규격·투명 여백·흰 테두리 검사 및 축소본 확인. 아트팀 최종 검수와 C10 병합 후 앱 렌더 확인 대기.
- 🚑 (유지보수, QA #48 상) 알고 A9P2·A9P3·A9P4·A10P3·A10P4 를 **맞게 풀어도 통과 못 하던 문제** 수정 — 테스트가 쓰는 `build`·`to_list`·`make` 도우미를 시작 코드 끝에 「채점용 도우미 — 지우지 마세요」로 넣었어요. 검사 도구에 같은 실수를 막는 규칙 추가. (이미 시작 코드를 고쳐 저장해 둔 사람은 도우미 함수가 없을 수 있어요 — 문제 화면의 「↺ 이 문제 초기화」 후 다시 풀거나 도우미 줄을 붙여 넣기)
- 🔧 (유지보수 `[core]` B그룹, QA #1·#2·#8·#12·#14) 수학 체 그림 안내가 진짜 소수 개수(50까지 15개)로 · KaTeX 를 못 불러올 때 글자 수식이 깨지지 않게(분수·루트 중첩, mod·간격·⌊⌋·<< 등 58개 전부) · 설정 「오프라인 캐시」 앱 개수가 전체보다 커지지 않게 · 허브 수학 카드 문구 중복 정리, 「수학 공간 이어서 하기」, 노드를 끝내면 「노드 완료! 다음 노드」 · 블록 `만약` 톱니바퀴 창 이름을 「아니고 만약」「아니면」으로, L4P1·L4P5 힌트도 같은 이름. regress 체크 3개(#1·#2·#12).
- 📱 (유지보수 `[core]` D그룹, 사용자 제보 QA #62·#63) 수학 탐구 퀴즈 6개는 지문이 말한 상태를 **실제로 만들어야** 보기가 열리고, 잠금 문구가 무엇을 맞추면 되는지 알려 줘요(예: 「n 슬라이더를 m의 배수에 맞추면 보기가 열려요」). 폰에서 나머지 원 그림 설명이 원 아래로 내려오고, 부동소수점·몬테카를로·베이즈·변환 그림 글자도 화면 밖으로 안 나가요.
- 📐 (유지보수, QA #34~#47) 수학 문구·그림 14곳: 기댓값 그림(M3_expect)이 이제 막대·평균을 제대로 보여 줘요(칸 간격 1) · 부동소수점 「512배」 · 순열 탐구 n = 3 으로(슬라이더 범위 안) · 행렬 순서 보기에 180° · 몬테카를로 지문·관찰 질문(시드 고정이라 한 번 비교는 들쭉날쭉) · 톱니바퀴 = 최소공배수 · 평균이 「비슷한」 두 설정 · 길이 5 화살표 찾기 · 알고 코스 레슨 번호(4·21) · 다음 날 요일 `(day + 1) % 7` · 거듭제곱 그림 점선이 x = 5 에서 · 내적 「앞쪽 ±90°」 · 해요체.
- 🧮 (유지보수, QA #49·#53·#54·#56~#59) 알고 A18P3 「동시에 바뀌어야 하는데」가 이제 **고쳐야만** 통과돼요(왼쪽 이웃 값, 버그 코드는 전부 0) · A18 1쪽 로봇 예제가 격자 밖(음수 칸)으로 안 나가요 · 용어 「누적 합」 = 앞 i개의 합 · 코스 안 레슨 번호 참조 6곳 · A9P5 지문(3이 사라지고 2만 끝없이) · E3 기본 입력 「교실」(힙 시각화가 보여요) · A20 1쪽 슬라이더 최대 4000 · 해요체 3곳.
- 🔧 (유지보수 `[core]`, QA #61 = #6 재열림) 알고 👀 시각화를 재생 중에 닫거나 다른 화면으로 가도 콘솔 에러가 안 나요(남은 재생 타이머·애니메이션 정리).

## v2.3.8 — 2026-11-02 (릴리스 당번 Opus: PR #4·#5·#6·#7·#8·#9)
- 💡 (콘텐츠팀 C6) 파이썬 L9~L18 힌트 51개 전수 점검 — 16문제 힌트를 「방향 → 구체 → 거의 정답」 순서로 고치고, 3단계가 정답 코드와 같은 변수명·같은 모양(빠진 줄 포함)이 되게 맞췄어요. 점검 결과는 QA.md.
- 🎨 (아트팀 A0) 완료 그림 90장 전수 재검수 — 전부 통과(반려 0). `img_clean --check` 90/90, 다크/라이트 실사용 크기 축소본(라이트 32px 식별성 포함), 앱 화면(허브·지도·뱃지·보스 패널·내 작품, PC·모바일) 90/90 로드. 주의 사항·다음 차수 요청 기준은 IMAGES.md 검수 메모. 그림 파일 변경 없음.
- 🔧 (유지보수 `[core]` A그룹, QA #4·#6·#7·#9·#10·#11·#15) 허브 「이어서 하기」가 방금 연 문제로 가요 · 알고 👀 시각화를 다시 누르거나 닫을 때 콘솔 에러 없음 · 수학 숫자 답에서 정답이 1·2 같은 작은 정수면 엉뚱한 「정확히 2배」 설명이 안 나와요 · 다크 고대비 「전체 초기화」 버튼 글자 대비 · PC 지도 접힌 챕터 제목이 단어 중간에서 안 끊겨요 · 허브 준비 중 카드의 잠금 문구가 다음 줄로 · 실전 X3 결과 파일 이름이 `todo_todo.json` 이 아니라 `todo.json`. regress 체크 3개 추가(#4·#6·#7).
- 🧩 (유지보수, QA #13) 파이썬 L5P6 「구구단 한 단」을 블록으로 끝까지 만들 수 있게 — 힌트 2와 🧭 따라하기가 칸 4개 출력 블록 + 마지막 칸 「글자 이어 붙이기」(`"= " + str(n * i)`)로 안내해요(전에는 값 5개를 넣으라고 해서 블록으로는 불가능). `QA.md` 에 B·C그룹 8건 재현 메모(#2 지시서 밖 수식 3종, #8 세는 방법, #32 원인은 core/figure.js).
- 📝 (QA팀 2회전) `QA.md`에 알고리즘·수학 정적 전수 검사 결과 26건 기록(#34~#59, 상 1 · 중 12 · 하 13). 채점 데이터(정답·숫자 답·테스트)는 정상, 알고 A9P2 등 5문제는 테스트용 도우미 함수가 starter 에 없어 통과 불가(상). 코드 변경 없음.
- 내부(문서, PR #9): 사용자 플레이 제보(수학 탐구 퀴즈 잠금 조건·모바일 그림 글자 잘림)를 유지보수 D그룹(U-1·U-2)으로 위임 — `specs/schedule-week.md` 3절, `specs/maintenance-team.md` 사용자 제보 처리 규칙.

## v2.3.7 — 2026-11-02 (릴리스: QA 1회전 기록 33건 + 수정 PR #3)
- 🔍 (QA팀 1회전 2차) 수학 벡터·확률 노드 7곳에서 **슬라이더를 움직이면 예제 코드 값도 같이 바뀌도록** 예제를 한 줄에 변수 하나로 고쳤어요(M3_cond·M5_add·M5_norm·M5_dot·M5_scale·M5_homog·M5_dist). 파이썬 L20P6 예시 공백이 보이게, L22P6 안내 순서, L21P6·L20P6 설명, 수학 M5_dist·M5_add 안내 문구·360도 설명 수정.
- 📝 `QA.md`에 1회전 발견 33건 기록(닫힘 16 · 열림 17 — Fable 담당 15·콘텐츠팀 1·확인 필요 포함: 수학 체 그림 소수 개수, KaTeX 글자 폴백, 모의고사 중 따라하기 정답 노출, 이어서 하기 위치 저장 등).
- 내부(Fable): `specs/workflow.md` 9절 파도 계획(1차·2차·릴리스 리듬), 콘텐츠팀 과제 C6~C9 추가.

## v2.3.6 — 2026-11-02 (릴리스: 콘텐츠팀 C4·C5 + QA 1회전 1차 + 팀 운영 확장)
- 📚 (콘텐츠팀 C4) 수학 공간에만 있던 용어 20개를 **모든 코스가 함께 쓰는 용어집**으로 옮겼어요: 나머지·소수·최대공약수·약수·비트·16진수·부동소수점·거듭제곱·로그·수열·시그마·순열·조합·확률·기댓값·분산·벡터·정규화·내적·행렬. 파이썬·알고리즘 코스의 📚 용어집 화면에서도 보여요. 수학 노드 17곳의 레슨 `terms`에서 같은 용어를 지워 중복을 없앴어요(뜻 문장은 그대로, 노드 전용 용어는 레슨에 남김). 다른 코스 레슨 terms와 겹침 없음.
- 💡 (콘텐츠팀 C5) 파이썬 L0~L8 힌트 49개 전수 점검 — 9문제(L1P4·L3P6·L4P2·L4P5·L5P1·L5P3·L6P1·L6P4·L8P5) 힌트를 「방향 → 구체 → 거의 정답」 순서로 고치고, 3단계가 정답 코드와 같은 모양이 되게 맞췄어요(L6P4 힌트 3에 빠졌던 `count = 0` 등). 점검 결과는 QA.md.
- 🔍 (QA팀 1회전 1차) 파이썬·수학 문구·힌트 오류 수정: L19 날짜 글자 비교 예시가 우연히 맞던 문제(2026-9-5로)·L22P2 지문·L21P2 힌트·블록 이름 힌트 3개·"답니다→에요" 통일·최댓값 표기 등 24곳.
- 🎨 (Fable 검수) 5차 D 수학 공간 아트 10장 통과 — 거북이 마스코트·영역 아이콘 3·수학 뱃지 6, 전체 90장. 코드에 자리 있는 그림 전부 채워짐.
- 내부(Fable): 레슨 첫 페이지 자동 실행·자동 시각화가 화면을 떠난 뒤 실행되며 `null innerHTML` 에러를 내던 문제 수정(CI regress에서만 재현 — Pyodide가 늦게 준비되는 환경). `specs/art-team.md`·`specs/maintenance-team.md` 추가, workflow 7절 4팀 체계.

## v2.3.5 — 2026-11-02 (알고리즘 챕터 6 추적 퀴즈 — 콘텐츠팀 C3)
- 🔍 알고리즘 챕터 6 「한 걸음 더」 레슨 5개에 **추적 퀴즈 + 👀 시각화**를 하나씩 더했어요(알고리즘 134 → 139문제).
  - A16P6 두 포인터로 뒤집기(table, 주황 = i) · A17P6 비트 하나씩 꺼내기(table) · A18P6 명령 따라 격자 칠하기(grid + 로봇 위치) · A19P6 백트래킹 출력 순서(callstack) · A20P6 누적합 인덱스 경계(bars)
- 정답 5개 모두 코드를 실제로 돌려 확인, 문제 화면 시각화 버튼 표시·모바일 390px 확인. 시각화 재생은 브라우저(Pyodide)에서 QA 확인 필요.
- 내부: `CONFIG.COURSES` algo total 139(값만).

## v2.3.4 — 2026-11-02 (파이썬 챕터 7 연습 보강 — 콘텐츠팀 C2)
- 🐍 파이썬 챕터 7 「한 걸음 더」 레슨 5개에 고치기·빈칸 문제를 하나씩 더했어요(파이썬 143 → 148문제).
  - L19P6 🐞 글자끼리 빼기(input 글자를 날짜로 바꾸지 않고 뺌 → fromisoformat) · L20P6 ✏ 띄어쓰기 정리(re.sub + \s+) · L21P6 ✏ 테스트 두 줄(assert / not) · L22P6 🐞 하나 모자란 합(range 끝 미포함) · L23P6 ✏ 매직 넘버 없애기(return / 상수)
- 고치기 문제는 테스트 4개씩(윤년 2/28→3/1, 같은 날, 해 넘김, n = 1 경계), 버그 코드가 실제로 테스트를 틀리는 것 확인.
- 내부: `CONFIG.COURSES` python total 148(값만).

## v2.3.3 — 2026-11-02 (5차 D 수학 공간 아트 10장)
- 허브 수학 공간에 박사모·분홍 자·컴퍼스를 든 거북이 마스코트, 지식 지도 영역 1·3·5에 초록 블록·주황 주사위·파랑 벡터 장식을 추가했어요.
- 수학 뱃지 6종(이름 붙이기·지도 탐험가·수와 컴퓨터·확률의 눈·벡터 조종사·대학 맛보기)을 추가했어요. 5차 D 완료, 전체 이미지 90장.
- 지정 크기·투명 배경·8% 여백·흰 테두리 검사·다크/라이트 축소본 확인을 마치고, 완료 표·생성 기록·캐시·인수인계를 갱신했어요.

## v2.3.2 — 2026-11-02 (수학 공간 보강 노드 3 — 콘텐츠팀 C1)
- 📐 수학 공간 지식 지도에 노드 3개가 늘었어요(25 → 28, 문제 100 → 112). 모두 기존 그림 종류만 써요.
  - **1-10 약수의 개수와 완전수**(M1_divisor, 선수: 소수·Σ): Σ 막대 그림에서 나누어떨어지는 i에만 막대가 서요. 제곱수만 약수가 홀수 개, 6·28은 약수 합이 2n. 숫자 답(360의 약수 24개), 코드(완전수/부족수/과잉수 판정기).
  - **3-9 기하분포**(M3_geom, 선수: 기댓값): 「성공할 때까지」 실험 히스토그램 + 이론선 + 그림 아래 실제 평균 vs 1/p. 숫자 답(5% 가챠 50번 연속 실패 ≈ 0.077), 코드(정확히 k번째·k번 안에·평균).
  - **5-9 두 점 사이 거리와 충돌 판정**(M5_dist, 선수: 합·차): A·B 두 점과 B − A 화살표. 숫자 답(두 원 사이 틈), 코드(원 충돌 판정 — √ 없이 제곱끼리 비교).
- 🧭 추천 경로: 게임 경로에 M5_dist, 코딩테스트 경로에 M1_divisor 추가. 약점 태그 +「약수」.
- 내부: `CONFIG.COURSES` math total 112·lessons 28(값만). 코드 문제 테스트 각 5개(경계값: n=1, p=100%, 같은 중심, 비정수 거리). `tools/regress.py` 수학 지도 노드·잠김 수를 하드코딩(25·20) 대신 콘텐츠에서 계산.

## v2.3.1 — 2026-11-02 (4차 C-2~C-7 뱃지 38장)
- 자립·정확도 6, 콤보·연속·목표 8, 보스·퍼펙트·완주 12, 알고리즘 4, 창작·기타 4, 비밀 뱃지 4장을 추가했어요. 기존 4차 A~C 49장이 모두 완료됐고 전체 이미지가 80장이 됐어요.
- 모든 신규 뱃지는 256×256 투명 PNG·8% 이상 여백. 흰 테두리 검사 및 다크/라이트 48·56px 축소본 확인을 마쳤어요. 퍼펙트 5종은 같은 금메달에 리본 색으로 구분해요.
- 완료 표·생성 프롬프트·인수인계·오프라인 캐시를 갱신했어요. 수학 공간 이미지 요청은 이번 납품 범위에 포함하지 않았어요.

## v2.3.0 — 2026-11-02 (수학 공간 M1 — 프로그래머 수학, 영역 1·3·5)
- 📐 허브에 **「공간」 구역**과 **수학 공간** 카드가 생겼어요 (코스 순서와 무관, 바로 열림). 들어가면 챕터 지도 대신 **지식 지도**: 영역 1 수와 컴퓨터(9) · 영역 3 경우의 수·확률·통계(8) · 영역 5 벡터·행렬(8) = 노드 25개. 선수 노드를 끝내면 다음이 열리고, 노드마다 숙련도 링(탐구→풀이→유지)과 난이도 점, ★는 대학 맛보기. 추천 경로 3종(게임·코딩테스트·데이터), 「이미 쓰고 있는 수학」 카드(파이썬·알고리즘 코스에서 푼 문제 → 수학 노드).
- 🎚 모든 노드의 첫 화면은 **만지는 그림**(슬라이더·드래그·버튼, 손계산 없음): 나머지 원, 에라토스테네스 체, 유클리드 직사각형, 비트 상자, 부동소수점 수직선, 함수 그래프(거듭제곱·로그·수열), Σ 막대, 순열 트리, 주사위·가챠·갈턴 보드 히스토그램(실험 10/100/10,000번), 벤 다이어그램(B 클릭 = 조건부), 몬테카를로 원주율, 베이즈 1000명 격자, 산점도(점 드래그 → r), 벡터(합·차·내적 그림자·정규화), 행렬 변환(회전·크기·기울임·순서 비교·동차좌표). 둘째 페이지는 **식(KaTeX, 기본 접힘 「∑ 식으로 보기」)과 코드** — 슬라이더를 밀면 코드의 `a = 값` 줄이 바뀌고, 코드를 고치면 슬라이더가 따라와요.
- 🧩 새 문제 유형 4종: **탐구 퀴즈**(그림을 움직여야 보기가 열림) · **숫자 답**(허용 오차, 「코드로 계산하기」 미니 에디터 → print 한 숫자를 답칸에, 틀리면 부호/2배/도↔라디안/반올림/100배/자릿수 규칙 설명) · **그림 맞추기**(목표 그림 vs 내 그림, 파라미터 비교) · **짝짓기**(식 ↔ 그림). 노드당 4문제 = 100문제(시뮬레이션 검증 2개는 고정 시드).
- 🏅 뱃지 6개(이름 붙이기·지도 탐험가·영역 1/3/5·대학 맛보기) + 마스코트 장비 **박사모**(첫 노드 완료). 설정 없이 지도에서 「고1·고2 표기 숨기기」.
- 📱 상단바가 콤보·연동 아이콘이 붙어도 390px 안에 들어가도록 수정(모바일 가로 스크롤 버그).
- 내부: `core/figure.js`(파라미터 기반 그림 엔진 16종, `Fig.mount`), `core/ui-views-math.js`(지식 지도·유형 UI·KaTeX 지연 로드), `Grader.checkNum/checkMatch/checkPair`, `Game.isGraph/mastery`(prereq 잠금), `courses/math/`, validate(첫 화면 그림·params·prereq 순환·num tol)·run_solutions(num 재계산)·regress(+12). 시각화 `runAndShow` 의 `pos:'pos'` 문자열 버그 수정. EXPANSION 14절 M1 완료, M2(영역 4·2 + transform/scatter/surface/steps 확장)·M3(영역 6·코스 연결 칩·실전 프로젝트) 남음.

## v2.2.26 — 2026-11-02 (4차 A·B·C-1 아트 11장)
- 알고리즘 챕터 6 쌍안경, 파이썬 챕터 7·알고리즘 챕터 6 보스, 시작·기본 뱃지 8장을 추가했어요. 기존 보스 종족과 둥근 메달 스타일을 이어가요.
- 지정 크기·투명 배경·8% 여백·흰 테두리 검사 및 다크/라이트 실사용 크기 축소본 검수 통과. 완료 표·프롬프트 기록·오프라인 캐시·인수인계를 갱신했어요. 다음 아트는 C-2부터예요.

## v2.2.25 — 2026-11-02 (모바일·라이트 테마 수정)
- 🐛 설정 맨 아래 「전체 초기화」 버튼이 빨간 바탕에 빨간 글자라 빈 상자로 보이던 것 수정(내 작품 🗑 작은 버튼용 규칙이 덮어쓰고 있었음). 「캐시 지우기」 버튼은 줄을 바꿔 🧹 캐시 지우기로.
- 📱 홈 지도 보스 노드: 보스 그림이 40px라 모바일에서 안 보이던 것 → PC 78px·모바일 104px로 키우고 둥근 카드(28px)로 정리.
- 🌓 라이트 테마에서 보스 노드가 흰색→어두운 자주색 그라데이션으로 이상하게 보이던 것 → 라이트 전용 밝은 분홍 배경·테두리.
- regress +3(초기화 버튼 글자색, 모바일 보스 크기, 라이트 보스 배경).

## v2.2.24 — 2026-11-02 (뱃지 화면 개선 — 그림 뱃지 대비)
- 🏅 뱃지 화면: 맨 위 획득 진행 막대, 필터(전체·획득·거의 다 됨·미획득), 마지막 방문 뒤 새로 얻은 뱃지는 **NEW** 표시와 금빛 반짝임, 획득 뱃지에 금테, 미획득 뱃지는 회색 + **진행 막대(예: 7/10)**, 비밀 뱃지는 ❔로 가림. 정렬: 새 뱃지 → 획득(최근순) → 거의 다 됨 → 나머지 → 비밀.
- 뱃지 획득 알림(오른쪽 위 카드)에도 그림 뱃지(`badge-<id>.png`)가 있으면 그림으로 나와요.
- 내부: `stats.badgesSeenAt`(뱃지 화면을 연 시각)로 NEW 판정. 획득 날짜가 없는 옛 뱃지는 날짜 줄 생략. regress +4.

## v2.2.23 — 2026-11-02 (알고리즘 실전 5·6)
- 🏆 **텍스트 검색 엔진**: 문서 여러 줄을 넣으면 역색인(단어 → 문서 집합), AND 검색(교집합), 아나그램 단어 찾기(정렬 키), 자동완성(접두사·문서 수 순 5개). 역색인 표 시각화.
- 🏆 **로봇 청소기 시뮬레이션**: S·#·*·. 격자에서 명령(F/R/L) 따라가며 청소, BFS로 도달 가능 칸·먼지, 가장 가까운 먼지부터 자동 청소(걸음 수·순서), 청소 뒤 지도. 격자 시각화에 로봇 위치.
- 알고리즘 실전 프로젝트 6개 — 「알고리즘 마스터」 뱃지는 6개 전부 클리어. 알고리즘 134문제·레슨 32.
- 격자 시각화가 `pos:'pos'`(튜플 변수)도 받고, 한 글자 문자 칸(`*` 같은)을 칸에 표시해요.

## v2.2.22 — 2026-11-02 (알고리즘 챕터 6 「한 걸음 더」)
- 🧭 알고리즘 코스에 **챕터 6 「한 걸음 더」**가 생겼어요(모의고사 AB4를 통과하면 실전 챕터와 나란히 열려요): 문자열 알고리즘(회문·아나그램·공통 접두사) · 비트 연산(비트마스크 집합·부분집합 전수) · 구현과 시뮬레이션(방향 배열·회전·동시 갱신, 격자 시각화) · 완전탐색과 백트래킹(itertools·되돌리기·가지치기) · 코딩테스트 체크리스트(허용 복잡도·빠른 입출력·경계값). 레슨 5개 × 5문제.
- 👾 보스 5 「암호 해독 사령부」: 시저 암호 전수조사 해독, 금고 격자 순찰(비트마스크 방문 기록 + 시각화).
- 알고리즘 132문제·레슨 30. 약점 태그 +4(문자열·비트·완전탐색·시뮬레이션). 지도 장식 자리 `chapter-algo-6.png`(IMAGES.md 3차 추가, 없으면 🔭).

## v2.2.21 — 2026-11-02 (3차 A 챕터 장식 13장)
- 홈 지도 제목 옆에 파이썬 0~7·알고리즘 1~5 챕터 장식 13장을 추가했어요. 새 챕터 7의 청록 망원경도 포함하고 실전 트로피는 두 코스에서 함께 써요.
- 512×512 투명 PNG·8% 여백·흰 테두리 검사와 다크/라이트 32px 축소본 검수를 통과했어요. 완료 표·생성 기록·오프라인 캐시·인수인계를 갱신했어요.

## v2.2.20 — 2026-11-02 (파이썬 실전 5·6)
- 🏆 **일기장 통계**: 내 일기 파일(`# 날짜` + 본문)을 올리면 날짜별 글자 수·요일, 자주 쓴 단어 TOP 3, 주간 편수, 빠진 날짜를 알려 주고 report.txt로 내려받아요(정규식 + 날짜).
- 🏆 **비밀번호 검사기·생성기**: 규칙 5개로 강도 점수와 부족한 항목, 흔한 비밀번호 목록 검사, 씨앗으로 재현되는 안전한 비밀번호 생성, assert 자체 테스트.
- 파이썬 실전 프로젝트 6개 — 「파이썬 마스터」 뱃지는 6개 전부 클리어.

## v2.2.19 — 2026-11-02 (파이썬 챕터 7)
- **새 챕터 7 「한 걸음 더」** (챕터 5 보스를 깨면 실전 챕터와 함께 열려요): 날짜와 시간(`datetime`, D-day·요일) · 정규표현식 맛보기(`re` — 숫자·전화번호 뽑기, 전체 검사, 가리기) · 테스트 작성(`assert`, 정상·경계·이상) · 디버깅 사고법(에러 읽기, 절반씩 좁히기, print 추적, 버그 3개 고치기) · 코드 설계와 리팩터링(이름·함수 분리·중복 제거·매직 넘버). 레슨 5개, 문제 25개.
- 보스 7 「학교 알림 메시지 분석기」: 알림에서 날짜를 뽑아 D-day 순으로 정렬, 금액 합계와 전화번호 가리기 + assert 자체 검증.
- 약점 태그에 날짜·정규식·테스트·디버깅·설계 추가. 파이썬 141문제.

## v2.2.18 — 2026-11-02 (2차 아트 검수)
- 2차 그림 16장 검수 통과: 허브 배너(마스코트 5마리), 코스 카드 아이콘 5종, 챕터 보스 9종, 마스터 뱃지 2종, 내 작품 빈 화면이 전부 화면에 보여요.
- 다크 테마에서 일부 그림 가장자리에 흰 띠가 보이던 것을 정리(`tools/img_clean.py` — 앞으로 납품 검수에 사용). 배너는 아래 빈 공간을 잘라 더 낮게.

## v2.2.17 — 2026-11-02 (2차 아트 16장 납품)
- 허브 코스 아이콘 4장, 파이썬·알고리즘 챕터 보스 8장, 마스터 뱃지 2장, 허브 배너·빈 작품 일러스트를 추가했어요. 기존 승인 아트 2종의 스타일과 보스 종족을 유지했어요.
- 지정된 파일 이름·크기·투명 배경·8% 여백, 배너 하단 1/3 투명과 다크/라이트 축소 표시를 검수했어요. 고양이 꼬리는 Git 분기·병합 모양으로 보정했어요.
- `IMAGES.md` 2절 완료 표로 16항목을 옮기고 3절 요청 목록을 비웠어요. 버전·오프라인 캐시·인수인계 상태판 및 생성 기록을 함께 갱신했어요.



## v2.2.16 — 2026-11-02
- 모바일에서 코드에 섞여 들어오는 **전각 기호(：（）“”)·특수 공백·탭**을 실행·채점 전에 자동으로 고쳐요(문자열 안은 그대로, 고친 내용은 알림으로). 이런 글자 때문에 생기던 `SyntaxError: invalid syntax`가 사라져요.
- SyntaxError가 나면 원인을 짚어 줘요: elif/else와 if의 들여쓰기 칸 수 불일치, 줄 끝 콜론 빠짐, 앞 줄 괄호·따옴표 짝, `=`와 `==` 혼동 등 — 실행 에러 상자와 테스트 결과 둘 다.

## v2.2.15 — 2026-11-02 (내부: 터미널·Git 엔진)
- 사용자 화면 변화 없음. 터미널·Git 코스의 엔진을 미리 만들었어요: 가상 터미널(20개 명령, 파이프·리다이렉션·와일드카드), Git 시뮬레이터(커밋·브랜치·병합 충돌·rebase·stash·원격 push/pull/clone, 동료 푸시 시뮬레이션), 실제 bash/git 문구의 에러 사전 25개, 미션 채점기. 자가 테스트 111건.

## v2.2.14 — 2026-11-02
- 프로필 → 「🖼 PNG로 저장」이 SNS 비율(1200×630) **공유 카드**로: 마스코트, 레벨·칭호, XP·연속 학습·뱃지 수, 코스별 진행 막대, 마스터 👑, 최근 뱃지, 날짜. 테마 색을 따라가고, 그림 파일이 있으면 코스 아이콘·뱃지 그림도 들어가요.
- 홈 지도 챕터 제목 옆에 장식 그림 자리(그림이 들어오면 표시).

## v2.2.13 — 2026-11-02
- `IMAGES.md` 2차 요청서: 코스 아이콘 4장, 챕터 보스 8장(보스 1과 같은 종족), 마스터 뱃지 2장, 허브 배너, 빈 작품 일러스트 — 총 16장. 3차 이후 목록(챕터 장식·마스코트·나머지 뱃지·레슨 머리 그림)은 자리 없이 메모만.
- 그림 자리 추가(파일이 들어오면 자동 표시): 허브 맨 위 배너, 뱃지 화면의 모든 뱃지, 내 작품 빈 화면. 마스터 뱃지 설명을 "실전 프로젝트 전부 완성"으로.

## v2.2.12 — 2026-11-02
- 아트 2종 검수 통과(투명 배경·여백·흰 테두리 없음). 보스 HP 패널의 보스 그림이 잘려 보이던 것 수정(56px), 허브 코스 아이콘 48px, 지도의 보스 노드에도 보스 그림(깬 뒤엔 회색).

## v2.2.11 — 2026-11-02 (테스트 아트 납품)
- 허브 파이썬 카드에 윙크하는 초록 뱀과 노트북 아이콘을 적용했어요(`assets/img/course-python.png`).
- 챕터 1 보스에 물음표 뿔·숫자 카드·망토를 갖춘 보라색 괴물을 적용했어요(`assets/img/boss-python-1.png`). 사용자 피드백에 따라 큰 체격·굵은 눈썹·넓은 자세로 보스 인상을 강화했어요.
- 두 파일 모두 512×512 투명 PNG. `IMAGES.md` 테스트 1·2 완료 표시와 메모, 오프라인 캐시 목록을 갱신했어요.

## v2.2.10 — 2026-11-02 (아트 리소스 테스트)
- 그림을 넣을 자리를 만들었어요: 허브의 코스 카드 아이콘과 보스 문제의 HP 패널. `assets/img/`에 그림 파일이 있으면 그걸 쓰고, 없으면 지금처럼 이모지 — 화면 변화 없음.
- `IMAGES.md`: 이미지 생성 도구(ChatGPT 등)에 줄 요청서. 테스트 2건(파이썬 코스 아이콘, 챕터 1 보스 캐릭터)과 공통 규칙(투명 PNG·플랫 스티커 스타일·팔레트·여백·저작권).

## v2.2.9 — 2026-11-02
- 홈 지도 위 **🔍 검색**: 문제 제목·레슨·개념 태그·유형·지문으로 찾고, 칩으로 **안 푼 것 / 틀린 것 / 별 3 아님 / 프로젝트·보스**만 추리기(아직 잠긴 챕터는 🔒).
- **키보드 단축키**: `?` 키나 상단바 ⌨(PC), 설정 → 화면 카드의 「⌨ 단축키 보기」. Ctrl+Shift+Enter 제출, 레슨에서 ←/→ 페이지 넘기기, Esc 창 닫기 추가.
- 접근성: 글자 크기 「아주 크게」, **고대비** 모드(설정 → 화면 → 고대비 → 높게), 키보드 포커스 윤곽선, 시스템의 "동작 줄이기" 설정 존중.

## v2.2.8 — 2026-11-02
- **📈 학습 통계** 화면(홈 「자유 공간」·프로필): 클리어·정답률·제출 횟수·연속 학습, 최근 14일 요일별 막대, 별점 분포, 유형별 진행, 약한/강한 개념 3개씩, 「모르겠어요」가 많았던 레슨.
- 「모르겠어요」 기록이 **약점 복습**(다시 보기·그 레슨 문제 풀기)과 **홈 추천 바**(「○○ 다시 보기」)에 연결돼요.
- 틀린 테스트 설명에 순서 맞추기(들여쓰기 칸)·블록 모드용 팁 추가.

## v2.2.7 — 2026-11-02
- 수정: 이미 클리어한 문제에서 「제출」을 여러 번 눌러도 XP가 계속 오르던 문제. 이제 별이 올라가는 재도전(힌트 없이 다시 풀기)만 30% XP를 주고, 그냥 다시 제출하면 XP·콤보·오늘 푼 문제 수가 바뀌지 않아요(결과 카드에 안내).

## v2.2.6 — 2026-11-02 (무료 교육 원칙: 선생님 없이도 막히지 않게)
- **🔍 어디가 다를까**: 제출해서 틀리면 기대한 출력과 내 출력을 **줄 단위로 나란히** 보여 주고(처음 달라지는 글자부터 색칠), 왜 다른지 규칙으로 설명해요 — 출력이 없음, 줄 수가 많음/적음, 대소문자, 띄어쓰기, 기호, 숫자 1 차이(range 끝), 3과 3.0, 2배, 줄 순서, input("…") 안내문 섞임 등.
- **📴 오프라인**: 한 번 열어 본 뒤엔 인터넷 없이도 공부할 수 있어요(앱은 바로, 파이썬 실행기 같은 큰 파일은 한 번 실행해 본 뒤). 설정 → 진행 데이터 카드에 「오프라인 캐시」 상태와 「캐시 지우기」.
- 허브 맨 아래와 설정에 안내: **완전 무료 · 계정 없음 · 진행은 내 기기에만 저장**(백업 파일·기기 연동 권장).
- 레슨 페이지마다 **「👍 이해했어요 / 🤔 모르겠어요」**: 모르겠어요를 누르면 이 페이지의 용어 풀이, 예제 한 줄씩 보기, 핵심 요약, 앞 페이지/이전 레슨로 가는 길을 한 상자에 보여줘요(이해했어요는 다음 페이지로).
- 수정: 퀴즈 보기에 여러 줄 코드가 있을 때(무한루프 찾기) 줄마다 네모칸으로 깨지던 것을 코드 블록으로.
- 내부: `Grader.explainDiff`, `sw.js` + `Offline`(ui-core) + stamp가 캐시 목록 생성, `UI.multiCode`, `stats.confused/gotIt`. regress 6건.

## v2.2.5 — 2026-11-02
- **선생님(클로드 API) 기능을 껐어요.** 레슨·문제·놀이터·약점 화면의 💬 버튼, 클리어 후 「내 코드 리뷰 받기」, 내 작품의 🎓 리뷰, 설정의 API 키 카드가 보이지 않아요. 저장된 API 키·대화는 지워지지 않고, 다시 켜면(`core/config.js`의 `TUTOR.enabled`) 그대로 돌아와요. 「질문으로 돌파」 뱃지는 비밀 뱃지로 바뀌어요.

## v2.2.4 — 2026-11-02 (WP-F 기능 개선 1차)
- 허브의 🧠 복습 큐가 **모든 코스**를 세요(「파이썬 3 · 알고리즘 2」처럼 코스별 링크).
- 알고리즘 레슨 예제에 **🎚 n 슬라이더**: 끌면 n이 바뀌어 다시 실행되고 걸린 시간이 막대로 쌓여요(레슨 0 "같은 문제, 다른 풀이", 레슨 1 "O(n)과 O(n²)").
- 선생님 답변의 코드 블록에 📋 복사 버튼.
- 설정 「📤 백업 파일 저장」이 **모든 코스 진행 데이터**를 한 파일로(API 키는 제외). 가져오기는 새 묶음·예전 파일 둘 다 돼요.
- 모바일 코드 입력 칩: ⇤ 내어쓰기, ' . < > - * / # 기호, input() 추가.
- 내부: `Hub.reviewDue`, `example.slider` 실행 경로, `Store.exportBundle/importBundle`, `TextEditor.dedentLine`, regress 4건.

## v2.2.3 — 2026-11-02 (WP-G 실전 프로젝트 확장)
- **실전 프로젝트 2개씩 추가** (코스당 4개): 파이썬 🏆 할 일 관리 앱(내 `todo.json` 올려서 목록·추가·완료·급한 일·저장, 📥 내려받기) · 🏆 가계부 분석기(월별·분류 비율·최대 지출·글자 막대 그래프, 내 CSV 업로드). 알고리즘 🏆 시험 시간표 짜기(필요한 교실 수·배정표·겹치지 않게 최대 과목·가장 붐비는 시각 — 힙 시각화) · 🏆 친구 네트워크 분석(그룹·몇 다리·허브·2다리 영향 — 그래프 시각화).
- **🎨 내 작품 갤러리**(홈 「자유 공간」·프로필에서): 실전 프로젝트 작품과 놀이터 작품을 카드로 — 단계 통과 수, 코드 미리보기, 📋 복사, 📥 .py 내려받기, 🛝 놀이터에서 열기, 📘 문제로. **🎓 선생님 리뷰**(API 키 있을 때): 잘한 점 1·고칠 점 2·다음 도전 1을 카드에 저장.
- 프로젝트를 다시 클리어하면 작품 코드가 최신으로 갱신돼요. 프로필에 「완성한 프로젝트」 수.
- **🔧 더 만들어 보기**: 실전 프로젝트를 클리어하면 체크리스트 아래 확장 아이디어 3개가 열려요(채점 없음, 직접 해 보고 체크하면 +10 XP씩).
- 내부: 레슨 `project.extra[]`, `works[].src/course/steps/total/review`, `Views.works`, `Tutor.reviewProject`, `CONFIG.PROJECT_EXTRA_XP`. regress에 갤러리·확장 카드 검사.

## v2.2.2 — 2026-11-02 (WP-A 알고리즘 보강)
- 알고리즘 코스: **코드 문제 전부에 시작 코드**(틀·주석, 41개 추가 — 모의고사 15문제는 입력 읽기 틀만). 힌트 3단계를 "어디에 어떻게 쓰는지" **코드 조각 형태**로 98문제 손질(퀴즈는 1·2단계 설명을 보강하고 3단계는 정답 유지, 모의고사는 방향만). 지문이 한 줄이던 30문제에 "왜 이걸 하나" 한 마디. 레슨 예제 6개에 「👣 한 줄씩 보기」.
- 실전 챕터: 엑셀에서 저장한 CP949 CSV를 올려도 자동 변환(UTF-8 BOM 제거 포함). 📥 내려받기 파일명이 `result_<원본이름>.csv`. 입력칸 높이가 입력 예시 줄 수에 맞춰져 미로를 그리기 쉬워요. KeyError 에러 사전에 "CSV 열 이름이 다른 경우" 설명.
- 내부: regress에 알고리즘 문제 화면·모의고사 안내의 모바일(390px) 검사 추가.

## v2.2.1 — 2026-11-02 (내부: 다음 작업 뼈대)
- 사용자 화면 변화 없음.
- `NEXT.md`: 남은 작업을 다른 모델/세션이 이어서 할 수 있게 작업 패키지 4개(WP-A 알고리즘 보강·실전 피드백 / WP-B Phase 2 터미널·Git / WP-C 허브 통합 프로젝트 / WP-D PC형 실전)로 단계·파일 위치·완료 기준·버전 규칙을 정리. 알고리즘 점검 목록은 스크립트로 다시 뽑아 수록(힌트 짧음 83, starter 없음 41, 지문 짧음 32 등).
- `core/runners/shell.js`: 터미널·Git 코스용 가상 파일시스템 + 셸(pwd ls cd mkdir touch cat echo rm, `&&`/`;`) + 채점용 `state()` + Git 모델 초안. `tools/test_shell.mjs` 자가 테스트(검증 명령에 추가).
- `courses/terminal-git/`: 코스 뼈대(course.json, index.html, content.js — 레슨 17+보스 3의 제목·요지·요약, 문제 스키마 머리말). 허브 카드는 그대로 '준비 중'.
- (문서 보정) 사용자 결정으로 터미널·Git·캡스톤·PC형은 보류. NEXT.md에 WP-F 기능 개선 백로그(F1~F12)·WP-G 실전 프로젝트 확장(G1~G6) 추가, 우선순위를 파이썬·알고리즘·실전으로.

## v2.2.0 — 2026-11-02 (Phase 1.5 실전 챕터)
- **파이썬 챕터 6 「실전」** (챕터 5 보스 클리어 시 열림): 레슨 2개 = 프로젝트 2개.
  - 🏆 내 CSV 분석기: 명령(요약/평균/반별/저장)에 따라 점수표를 집계하고 `result.csv`를 만들어요. 문제 화면의 「📎 내 CSV 파일 올리기」로 **진짜 내 파일**을 넣어 실행하고, 결과 파일은 「📥 내려받기」.
  - 🏆 단어 암기 퀴즈: 단어장 파일 → Card 클래스 → 씨앗으로 섞어 출제 → 틀린 단어만 `wrong.csv`에 저장해 복습. 내 단어장도 올릴 수 있어요.
- **알고리즘 챕터 E 「실전」** (모의고사 통과 시 열림): 🏆 미로 게임(내가 그린 미로를 BFS로 풀고 경로를 `*`로 표시 — 👀 시각화에서 BFS가 격자에 퍼지는 모습) · 🏆 지하철 최단 경로(노선표 입력 → 다익스트라 최단 시간·경로·전체 시간표 — 그래프 시각화).
- 실전 프로젝트는 **단계별 체크리스트**가 테스트 결과로 자동 체크돼요(「✅ 단계 n개 통과!」). 테스트마다 「단계 k」 칩. 클리어하면 내 작품에 저장.
- 코스의 실전 프로젝트를 전부 클리어하면 👑 **파이썬 마스터 / 알고리즘 마스터** 뱃지.
- 내부: 러너 `Py.run({files, outFiles})`(실행 전 파일 쓰기·결과 파일 읽기), `Grader.testFiles`·`tests[].outFile` 비교(정답 코드가 만든 파일과 대조), 레슨 `practical`, 문제 `project.steps`+`tests[].stage`+`files`. 검증 도구(`run_solutions.py`·`validate_content.mjs`)가 샘플 파일·결과 파일·단계 범위·xp 하한을 검사. inputGen 테스트는 입력이 300자 이하면 그대로 보여줘요. EXPANSION.md 9절을 「프로젝트 4층 구조」로 개정, Phase 번호 재배정(터미널·Git → v2.3.0).

## v2.1.3 — 2026-11-02
- 문제: 3단계 힌트가 한 단어였던 19문제를 "어디에 어떻게 쓰는지" 코드 형태로. 코드 문제 17개에 시작 코드(틀·주석) 추가. L5P5 빈칸에 보기 추가. 지문이 한 줄이던 12문제에 설명 한 마디 보강.
- 블록 따라하기 코치: L3P6(두 수의 합)·L4P2(짝수 홀수)·L4P5(성적 등급)에 손으로 쓴 안내. 코치·레슨의 "왼쪽 메뉴/오른쪽 코드 창" 같은 표현이 모바일에선 "아래 메뉴/아래 코드 창"으로 바뀌어요.
- 보스마다 2번째 문제 추가(범위 검사, 기회 3번, 월별 합계, 연승 기록, 가방) — 파이썬 문제 110개. 이미 깬 보스는 그대로 완료로 남아요. 레슨 0에 「첫 실행과 제출」 문제(실행 → 제출 흐름 연습).
- 선생님 버튼: API 키가 없으면 안내 카드와 「⚙ 설정에서 키 넣기」 버튼(설정의 키 칸으로 바로 이동).
- 레슨의 마지막 문제를 풀면 「다음 레슨: ○○ ▶」 버튼. 레슨 예제 대부분에 「👣 한 줄씩 보기」. 처음 용어가 나오는 레슨에서 "밑줄 친 단어를 누르면 뜻이 나와요" 안내 한 번.
- 모바일: 상단바에 긴 제목 대신 「레슨 n」. 설정의 진동 항목은 모바일에서만 보여요.

## v2.1.2 — 2026-11-02
- 모바일: 퀴즈·빈칸 문제는 「설명/작업」 탭 없이 **한 화면**에서 지문 바로 아래 보기가 나와요.
- 모바일: 작업 탭 맨 위에 **문제 제목과 지문 요약**이 보여요(「설명 전체 보기 ▸」로 이동).
- 레슨 예제 코드 칸이 **줄 수에 맞춰** 작아져서(1~3줄 예제는 작게) 실행 버튼과 출력이 화면 안에 들어와요. 실행하면 출력 칸으로 자동 스크롤.
- 홈(지도) 맨 위에 **「▶ 이어서 하기」** 바: 풀다 만 문제 또는 지금 레슨으로 바로. 완료한 챕터와 잠긴 챕터는 접혀 있어요(「펼치기」).
- 모바일에서 「Ctrl+Enter」 표시 숨김. 온보딩 투어가 가리키는 요소로 화면을 스크롤.

## v2.1.1 — 2026-11-01
- 기기 연동: 「☁ 다른 기기의 진행 상황을 가져왔어요」 알림이 다른 기기가 저장할 때마다 뜨던 문제 수정. 이제 진행·설정이 실제로 달라졌을 때, 그것도 **앱을 처음 열 때만** 알리고, 화면으로 돌아왔을 때의 동기화는 조용히 됩니다.

## v2.1.0 — 2026-11-01 (Phase 1)
- **새 코스: 알고리즘·자료구조** — 허브에 카드가 열렸어요(파이썬 챕터 3 보스 클리어 또는 설정의 "전제 무시" 스위치). 레슨 16 + 보스 4: 들어가기(Big-O·스택·큐) → 찾고 정렬하기(재귀·정렬·이진 탐색·해시) → 연결된 구조(연결 리스트·트리·힙·그래프 BFS/DFS) → 패턴(다익스트라·DP·그리디·투 포인터·누적 합). 문제 101개(코드 60).
- **👀 시각화**: 레슨 예제의 「시각화 재생」과 문제의 「시각화」 버튼이 코드를 실행하며 변수를 그림으로 보여줘요 — 막대(정렬·탐색), 상자(스택·큐), 화살표 노드(연결 리스트), 트리, 그래프, 격자(미로), 표(DP), 호출 스택(재귀). 재생·일시정지·한 단계·슬라이더·속도.
- **새 문제 유형**: 추적 퀴즈(코드 보고 결과 맞히기 + 시각화로 확인), 복잡도 맞히기(Big-O 고르기), 자료구조 고르기(선택 + 이유 2단계).
- **코딩테스트 모드**: 마지막 보스는 60분 모의고사(15문제 풀에서 3문제). 큰 입력 테스트에 **시간 제한**이 있어 O(n²) 풀이는 "시간 초과"로 실패해요(기기 속도 자동 보정). 끝나면 문제별 "필요한 기법" 해설.
- 뱃지 4개 추가(눈으로 보는 사람·O(n²)에서 O(n log n)으로·모의고사 통과·알고리즘 탐험가). 설정에 "코스 전제 무시" 스위치.
- 내부: 엔진에서 코스 전용 하드코딩 제거, 레슨 `terms`가 용어집에 합류, 검증 스크립트가 `limits.time`·`inputGen`·CONFIG 문제 수 일치까지 확인.

## v2.0.3 — 2026-11-01
- 따라하기 코치는 **기본으로 접혀** 있어요(「🧭 따라하기 안내 펼치기」로 엶). Parsons 문제만 처음엔 펼쳐져요.
- **Parsons 문제에 「푸는 방법」 코치** 추가: 사용법(줄 누르기·▲▼·◀▶·✕) → 몇 번째 줄에 무엇을, 들여쓰기 몇 번 → 제출. 줄을 맞게 놓으면 자동으로 다음 단계.
- 입력이 필요한 문제에서 ▶ 실행 때 입력값 칸이 비어 있으면 테스트 1의 입력을 자동으로 넣어요 (실행은 EOFError인데 제출은 통과하던 혼란 해소).
- 내부(미노출): 알고리즘 코스용 시각화 엔진·시간 제한 채점·모의고사 모드 코드 추가.

## v2.0.2 — 2026-11-01
- 에디터: `else:` `elif …:` `except …:` `finally:` 를 치면 짝이 되는 `if`/`try` 와 같은 들여쓰기로 **자동으로 당겨져요** (백스페이스로 지울 필요 없음). CodeMirror·기본 textarea 모두.
- 따라하기 코치가 글자를 칠 때마다 다시 뜨지 않고, **단계가 넘어갈 때만** 바뀌어요.
- 내부: 엔진에서 파이썬 코스 전용 하드코딩 제거(종합 점검 위치·약점 태그·첫 레슨 id·보스 키를 코스 콘텐츠에서 읽음) — 코스 2 준비.

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

