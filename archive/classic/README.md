# 보관: 예전 문제집 화면 (v2.18.0 까지)

> 2026-11-07, v2.19.0(TODO N13). 사용자 「옛 화면을 사이트에서 빼서 다른 폴더에 정리해서 보관」.
> 사이트는 이제 **교과서 화면만** 있어요. 여기 있는 것은 **사이트가 불러오지 않아요**(링크도, 오프라인 캐시도 없음). 지운 게 아니라 옮긴 거예요.

## 통째로 되돌리려면

GitHub 의 **`classic-v2.18.0` 브랜치**가 옮기기 직전(v2.18.0, 커밋 `91822c5`) 그대로예요.
그 브랜치를 받아서 주소 끝에 `?classic=1` 을 붙이면 예전 화면이 열려요.

```bash
git fetch origin classic-v2.18.0
git switch classic-v2.18.0
python3 -m http.server 8766      # → http://127.0.0.1:8766/courses/python/?classic=1
```

이 폴더의 파일만으로는 화면이 돌지 않아요(다른 공용 파일이 이후 버전으로 바뀌었어요). 코드를 다시 쓰고 싶으면 이 폴더에서 **꺼내 보는 자료**로 쓰세요.

## 무엇이 있나

경로는 저장소에 있던 자리 그대로예요. **같은 경로 = v2.18.0 때의 그 파일 원본**.

| 경로 | 무엇 | 지금 사이트에서는 |
| --- | --- | --- |
| `core/ui-views-main.js` | 예전 홈(레슨 지도)·레슨 화면·**문제 풀기 화면**(실행·제출·채점·힌트·정답 보기)·따라하기 코치 | 교과서 화면(`core/ui-views-book.js`). 한 줄씩 보기 패널만 `core/app.js` 로 |
| `core/ui-views-more.js` | 프로필·**뱃지**·보관함·**복습**·오늘의 도전·타임 어택·**타자 연습(백문이 불여일타 → Ape)**·모의고사·종합 점검·약점 분석·내 작품·통계·놀이터·온보딩·설정 | 설정·용어집·에러 사전만 `core/app.js` 로(교과서에 맞게 다시 씀) |
| `core/game.js` | XP·레벨·별·콤보·스트릭·뱃지 판정·잠금·복습 큐(Review) | 없음 — 교과서는 「읽은 레슨」 만 셈 |
| `core/fx.js` | 효과음·진동·콘페티·마스코트 그림 | 없음 |
| `core/tutor.js` | 선생님(Claude API) 창 — v2.2.5 부터 꺼져 있었음 | 없음 |
| `core/ui-editors.js` | 코드 편집기(CodeMirror)·Parsons(줄 맞추기) | 없음 — 코드는 내 PC 의 VS Code 에서 |
| `core/ui-views-shell.js` · `core/runners/shell.js` | 터미널·Git 가짜 셸(브라우저 시뮬레이터)·미션 채점 | 없음 — 진짜 Git Bash |
| `core/ui-views-sql.js` · `core/runners/sql.js` | 브라우저 SQL 실행·결과 비교 채점 | 없음 — DB Browser for SQLite |
| `core/ui-views-web.js` | 웹 코스 편집기·미리보기 화면 | 없음. 미리보기 러너는 검사 도구 `tools/web-preview.js` 로 옮김 |
| `shared/badges.js` | 뱃지 56개 · 보관함(편집기 테마·콘페티·소리) | 없음 |
| `assets/img/` | 그림 88개(뱃지·보스·챕터·코스·영역·마스코트, 8.8MB) — 요청서는 `docs-IMAGES.md` | 없음(첫 방문 오프라인 캐시가 156개 → 51개로) |
| `courses/<코스>/content.js` | **옛 문제 전부**(퀴즈·빈칸·버그 찾기·코드·탐구 퀴즈·숫자 답·그림 맞추기 …) + 타자 연습(DRILLS) + 따라하기 가이드(GUIDES) + 종합 점검(CHECKUPS) + 약점 태그 · 수학 「이미 쓰고 있는 수학」·테마 경로 | 사이트의 content.js 에는 **「만들어 보기」 가 쓰는 문제만** 남김(아래 표). 레슨 본문은 그대로 |
| `courses/<코스>/index.html` · `courses/{sql,web,terminal-git}/course.css` | 예전 코스 페이지(스크립트 20여 개) · 옛 화면 전용 CSS | 교과서 스크립트 13~15개만 |
| `core/{engine,ui-core,hub,config,storage,sync,ui-views-book,ui-views-math}.js` · `core/ui.css` · `index.html` · `sw.js` | 손질하기 전 원본(채점 Grader · XP 연출 · 로딩 오버레이 · 모바일 퀵 키 · 허브의 문제 수·복습·잠금 · XP/하루 목표/선생님 설정 · 수학 지식 지도와 문제 유형) | 교과서에 필요한 것만 남긴 판 |
| `tools/regress.py` | 옛 화면까지 검사하던 회귀 검사(680줄) | 새 `tools/regress.py` 는 교과서만(약 290줄) |
| `tools/test_shell.mjs` · `run_shell_solutions.mjs` · `run_sql_solutions.py` · `e2e_submit/` | 가짜 셸 테스트 · 셸 미션 정답 · SQL 정답 쿼리 · 제출 흐름 검사 | 없음(교과서 검사는 `tools/check_book.mjs`) |
| `tools/load_content.mjs` · `tools/validate_content.mjs` | 손질 전 원본 | 뱃지·문제 개수 규칙을 뺀 판 |

## 옮긴 문제 수

「만들어 보기」 가 `pid` 로 가져다 쓰는 문제는 사이트에 그대로 있어요(지문·예시 답·출력 예의 재료).

| 코스 | 원래 문제 | 사이트에 남김 | 보관 | 타자 연습(보관) |
| --- | --- | --- | --- | --- |
| 파이썬 | 170 | 86 | 84 | 360 |
| 알고리즘 | 145 | 100 | 45 | 315 |
| 수학 | 180 | 89 | 91 | 0 |
| 터미널·Git | 5 | 0 | 5 | 0 |
| SQL | 4 | 0 | 4 | 0 |
| 웹 | 4 | 0 | 4 | 0 |
| GitHub · Vim | 0 | 0 | 0 | 0 |

남긴 문제는 옮기기 전과 **한 글자도 다르지 않은지** 자동으로 비교했어요(레슨·챕터도 같음).

## 저장 데이터

사용자 기기에 이미 쌓인 XP·뱃지·문제 기록(localStorage 의 `academy.*`)은 **지우지 않았어요**. 화면에서 안 쓸 뿐 그대로 남아 있고, 백업 파일·기기 연동에도 그대로 들어가요. 예전 브랜치로 열면 다시 보여요.
