# 파이썬 아카데미 — 설계 결정 요약

> **2026-11-06: 파이썬·알고리즘(v2.15.0)·터미널·Git·SQL·웹·Vim 은 「교과서」 모드라 아래 3~5절(XP·뱃지·블록)·문제 화면 설명은 그 코스 화면에 보이지 않는다(수학에만 · 나머지는 `?classic=1`). 지금 기준은 [`specs/site-intent.md`](specs/site-intent.md).**

작성일: 2026-11-01 · 앱 버전 1.0.2 · 파일: `python_academy.html` (단일 파일, 약 345KB)

지시서에 없어서 제작자가 임의로 정한 수치·구조·제약을 모았습니다. 숫자는 전부 파일 맨 위 `=== CONFIG ===` 블록에서 바꿀 수 있습니다.

## 1. 파일 구조 (지시서 15절)

`python_academy.html` 안은 주석 구분선으로 5개 블록으로 나뉩니다.

| 블록 | 내용 | 줄 위치(대략) |
|---|---|---|
| `=== UI (스타일) ===` | CSS 전체 (head 안) | 파일 앞 ~180줄 |
| `=== CONFIG ===` | CDN 주소·버전, 타임아웃, XP·레벨 곡선, 복습 간격, 모델명, `APP_VERSION` | 스크립트 시작 |
| `=== I18N ===` | UI 문구 객체 `T`, 선생님 시스템 프롬프트 | CONFIG 바로 뒤 |
| `=== CONTENT ===` | 스키마 주석 → `LESSONS`(24개: 레슨 19 + 보스 5) → `PROBLEMS`(104개) → `CHAPTERS`, `BADGES`, `ERRORS`, `ERROR_HINTS`, `GLOSSARY`, `INVENTORY`, `MAP_DECOR` | 중간 |
| `=== ENGINE ===` | `Content`(인덱스·자체 검사·변형 치환), `Store`(localStorage), `Py`(Pyodide 워커), `Grader`, `Game`, `Review`, `Tutor`, `Audio`, `Confetti`, `TurtleView` | 뒤 |
| `=== UI ===` | 마스코트 SVG, `UI` 공통, `Loader`, `QuickKeys`, 에디터(`TextEditor`/`ParsonsEditor`; `BlockEditor` 는 v2.4.0 삭제), `Views.*` 화면 전부, `Tutor.ui`, `Onboarding`, 초기화 | 맨 뒤 |

- 레슨·문제·뱃지는 전부 `id` 문자열로 참조합니다. 진행 저장(`problems[id]`)도 id 기준이라 중간에 레슨을 끼워 넣어도 깨지지 않습니다. 다만 **레슨 순서(잠금 해제 순서)는 `LESSONS` 배열 순서**를 따릅니다.
- 레슨을 추가하려면 `LESSONS.push({...})` 하나와 그 레슨 id를 가진 문제 객체를 `PROBLEMS`에 넣으면 끝입니다. 엔진은 손대지 않습니다.
- 앱 시작 시 `Content.init()`이 id 중복, 테스트 없는 실행형 문제, 힌트 3개 미만, 태그 없음, 보스 테스트 5개 미만, 문제 4개 미만 레슨을 콘솔 경고로 알립니다.

## 2. 임의로 정한 수치

| 항목 | 값 | 비고 |
|---|---|---|
| 실행 제한 시간 | 5,000ms | 초과 시 워커 종료·재생성. 재생성 시 Pyodide를 다시 초기화하므로 브라우저 캐시가 있어도 수 초 걸림 |
| 출력 표시 상한 | 2,000줄 | 초과분은 "…(너무 많아 생략)" |
| 한 줄씩 보기 상한 | 500단계 | 초과 시 안내 문구 |
| 문제당 코드 저장 상한 | 10,240바이트 | Parsons 상태 JSON 도 같은 상한 |
| 기본 XP | 퀴즈 10 / 빈칸 15 / 버그 20 / Parsons 20 / 코드 30 | 지시서 표 그대로 (블록 25 는 v2.4.0 에서 유형과 함께 삭제) |
| 힌트 배율 | 0단계 100% → 1단계 70% → 2단계 40% → 정답 보기 0% | 별점 3→2→1→0 |
| ~~텍스트 선택 배율~~ | — | v2.4.0 에서 `dual` 과 함께 삭제 (전부 타자) |
| 첫 시도 보너스 | +50% | 그 문제에서 채점을 처음 눌러 바로 통과했을 때(실행은 몇 번 해도 됨) |
| 콤보 배율 | 3콤보 ×1.2 / 5콤보 ×1.5 / 10콤보 ×2 | 세션(새로고침 전)에서만 유지. 오답·힌트로 끊김 |
| 다시 풀기 XP | 30% | 이미 클리어한 문제를 또 풀면 |
| 복습 클리어 XP | 문제당 5 | 복습 3개 완료 시 +20 |
| 보스 XP | 해당 챕터 일반 문제 XP 합의 50% (최소 60) | 챕터1 보스 ≈ 128, 챕터3 ≈ 150 |
| 일일 목표 달성 보너스 | +30 XP | 3·5·10문제 중 선택 |
| ~~놀이터 XP~~ | ~~10줄 이상 실행 시 +5, 하루 최대 50~~ | v2.8.0 놀이터 삭제(사용자 결정 11/6) |
| 종합 점검 | 10문제, 80% 이상 통과 시 +40 XP | 레슨 5·10·15 뒤 |
| 오늘의 도전 | XP ×2, 날짜 기반 고정 선택(같은 날엔 같은 문제) | 클리어 3개 이상일 때 열림 |
| 다듬기 XP | +10 (문제당 1회) | 리뷰 받은 뒤 코드를 고쳐 다시 통과 |
| 복습 간격 | 1 → 3 → 7 → 14 → 30일 | 힌트 사용·3회 이상 실패 문제는 1일부터, 깔끔한 클리어는 3일부터 시작. 복습에서 틀리거나 힌트 쓰면 1일로 복귀 |
| 복습 고르기 (v2.7.0 QA #149) | 오늘의 복습 = 날 된 문제 전부 → 모자라면 약점 · 더 복습하기 = 날 안 된 문제 → 없으면 날 된 문제 | 복습에서 한 번에 맞힐 때마다 그 문제의 약점 점수 ×0.5(`rec.reviewOk`). 하루 보너스(3개·+20)는 날짜가 바뀌면 다시 |
| 활동 캘린더 | 최근 14일 | 하루 4문제 이상이면 가장 진한 색 |
| 거북이 채점 오차 | 좌표당 ±1.5 | 정답 코드의 선분 목록과 개수·순서·좌표 비교 |
| 테스트 숨김 | 마지막 1개 | 입력 없는 문제는 같은 테스트를 2개로 복제(1개 공개·1개 숨김) |
| 선생님 대화 맥락 | 최근 12개 메시지 | localStorage 문제별 저장 |

## 3. 레벨 XP 곡선

식: 레벨 L → L+1 에 필요한 XP = **30 + 4L**. 누적 4,290 XP면 레벨 40, 6,370 XP면 최대 레벨 50입니다.

콘텐츠 XP 추정: 일반 문제 104개의 기본 XP 합 2,045 + 보스 5개 약 650 = 약 2,700. 전부 별 3개·첫 시도로 깨면 +50%로 약 4,000, 여기에 콤보 배율·일일 목표·복습·종합 점검 보너스가 더해져 완주 시 레벨 40 안팎에 도달합니다. 레벨 41~50은 복습·도전·타임어택·놀이터로 채웁니다.

| 레벨 | 다음 레벨까지 필요 XP (30+4L) | 누적 XP | 칭호 | 마스코트 |
|---|---|---|---|---|
| 1 | 34 | 0 | 코드 새싹 | 알 |
| 2 | 38 | 34 | 코드 새싹 |  |
| 3 | 42 | 72 | 코드 새싹 |  |
| 4 | 46 | 114 | 코드 새싹 |  |
| 5 | 50 | 160 | 코드 새싹 |  |
| 6 | 54 | 210 | 출력 견습생 |  |
| 7 | 58 | 264 | 출력 견습생 |  |
| 8 | 62 | 322 | 출력 견습생 |  |
| 9 | 66 | 384 | 출력 견습생 |  |
| 10 | 70 | 450 | 출력 견습생 | 새끼 뱀 |
| 11 | 74 | 520 | 변수 수집가 |  |
| 12 | 78 | 594 | 변수 수집가 |  |
| 13 | 82 | 672 | 변수 수집가 |  |
| 14 | 86 | 754 | 변수 수집가 |  |
| 15 | 90 | 840 | 변수 수집가 |  |
| 16 | 94 | 930 | 조건 분기사 |  |
| 17 | 98 | 1024 | 조건 분기사 |  |
| 18 | 102 | 1122 | 조건 분기사 |  |
| 19 | 106 | 1224 | 조건 분기사 |  |
| 20 | 110 | 1330 | 조건 분기사 | 안경 쓴 학생 |
| 21 | 114 | 1440 | 반복의 달인 |  |
| 22 | 118 | 1554 | 반복의 달인 |  |
| 23 | 122 | 1672 | 반복의 달인 |  |
| 24 | 126 | 1794 | 반복의 달인 |  |
| 25 | 130 | 1920 | 반복의 달인 |  |
| 26 | 134 | 2050 | 함수 장인 |  |
| 27 | 138 | 2184 | 함수 장인 |  |
| 28 | 142 | 2322 | 함수 장인 |  |
| 29 | 146 | 2464 | 함수 장인 |  |
| 30 | 150 | 2610 | 함수 장인 | 망토 |
| 31 | 154 | 2760 | 자료 정리사 |  |
| 32 | 158 | 2914 | 자료 정리사 |  |
| 33 | 162 | 3072 | 자료 정리사 |  |
| 34 | 166 | 3234 | 자료 정리사 |  |
| 35 | 170 | 3400 | 자료 정리사 |  |
| 36 | 174 | 3570 | 예외 사냥꾼 |  |
| 37 | 178 | 3744 | 예외 사냥꾼 |  |
| 38 | 182 | 3922 | 예외 사냥꾼 |  |
| 39 | 186 | 4104 | 예외 사냥꾼 |  |
| 40 | 190 | 4290 | 예외 사냥꾼 | 왕관 |
| 41 | 194 | 4480 | 객체 설계자 |  |
| 42 | 198 | 4674 | 객체 설계자 |  |
| 43 | 202 | 4872 | 객체 설계자 |  |
| 44 | 206 | 5074 | 객체 설계자 |  |
| 45 | 210 | 5280 | 객체 설계자 |  |
| 46 | 214 | 5490 | 파이썬 마스터 |  |
| 47 | 218 | 5704 | 파이썬 마스터 |  |
| 48 | 222 | 5922 | 파이썬 마스터 |  |
| 49 | 226 | 6144 | 파이썬 마스터 |  |
| 50 | - | 6370 | 파이썬 마스터 | 황금 |


## 4. 뱃지 전체 목록 (42개)

획득 조건은 `Store.data.stats[키] ≥ 값` 으로 판정합니다(`Game.checkBadges`). 비밀 뱃지 4개는 보관함에 "???"로 표시됩니다.

| id | 이름 | 설명 | 조건(통계 키) |
|---|---|---|---|
| first_run | 첫 실행 | 코드를 처음 실행했어요 | `runs` ≥ 1 |
| first_clear | 첫 클리어 | 문제를 처음 풀었어요 | `clears` ≥ 1 |
| first_error | 첫 에러 | 에러를 처음 만났어요. 힌트를 받은 거예요 | `errors` ≥ 1 |
| error_10 | 에러 극복 | 에러를 10번 극복했어요 | `errorsOvercome` ≥ 10 |
| fail5_clear | 끈기 | 한 문제에서 5번 실패한 뒤 클리어했어요 | `fail5Clear` ≥ 1 |
| nohint3 | 자립 | 힌트 없이 3연속 클리어 | `noHintStreak` ≥ 3 |
| nohint10 | 독학왕 | 힌트 없이 10연속 클리어 | `noHintStreak` ≥ 10 |
| firsttry10 | 한 번에 | 첫 시도 클리어 10회 | `firstTryClears` ≥ 10 |
| firsttry30 | 명사수 | 첫 시도 클리어 30회 | `firstTryClears` ≥ 30 |
| combo10 | 콤보 10 | 콤보 10 달성 | `maxCombo` ≥ 10 |
| combo20 | 콤보 20 | 콤보 20 달성 | `maxCombo` ≥ 20 |
| lesson3star | 완벽한 레슨 | 한 레슨의 모든 문제를 별 3개로 | `lessonsAll3` ≥ 1 |
| lesson3star5 | 별 수집가 | 별 3개 레슨 5개 | `lessonsAll3` ≥ 5 |
| grad_block | 첫 타자 (옛 이름 「블록 졸업」) | 코드 문제를 직접 타자로 처음 클리어 | `textClears` ≥ 1 |
| grad_parsons | 순서 맞추기 졸업 (옛 이름 「Parsons 졸업」) | 순서 맞추기 문제 5개 클리어 | `parsonsClears` ≥ 5 |
| boss1 | 보스 1 | 챕터 1 보스 클리어 | `boss_B1` ≥ 1 |
| boss2 | 보스 2 | 챕터 2 보스 클리어 | `boss_B2` ≥ 1 |
| boss3 | 보스 3 | 챕터 3 보스 클리어 | `boss_B3` ≥ 1 |
| boss4 | 보스 4 | 챕터 4 보스 클리어 | `boss_B4` ≥ 1 |
| boss5 | 보스 5 | 챕터 5 보스 클리어 | `boss_B5` ≥ 1 |
| streak3 | 3일 연속 | 3일 연속 학습 | `bestStreak` ≥ 3 |
| streak7 | 7일 연속 | 7일 연속 학습 | `bestStreak` ≥ 7 |
| streak30 | 30일 연속 | 30일 연속 학습 | `bestStreak` ≥ 30 |
| explore10 | 탐험가 | 예제 코드를 고쳐서 10번 실행 | `examplesEdited` ≥ 10 |
| theme | 분위기 전환 | 설정에서 테마를 바꿨어요 | `themeChanged` ≥ 1 |
| works3 | 창작자 | 내 작품 3개 저장 | `worksSaved` ≥ 3 |
| turtle5 | 거북이 화가 | 거북이 그림 5개 저장 | `turtleSaved` ≥ 5 |
| tutor10 | 질문으로 돌파 | 선생님에게 물어본 뒤 스스로 클리어 10회 | `tutorBreakthrough` ≥ 10 |
| review10 | 기억 유지 | 복습 10개 완료 | `reviewsDone` ≥ 10 |
| daily7 | 목표 달성 7회 | 일일 목표 7번 달성 | `dailyGoalsMet` ≥ 7 |
| ~~playground~~ | ~~자유 코딩~~ | v2.8.0 놀이터와 함께 삭제(이미 받은 사람 데이터엔 id 가 남아도 목록에서 빠짐) | — |
| checkup | 종합 점검 통과 | 종합 점검 80% 이상 | `checkupsPassed` ≥ 1 |
| all_clear | 완주 | 모든 문제 클리어 | `allClear` ≥ 1 |
| perfect1 | 퍼펙트 1 | 챕터 1을 힌트 없이 한 번에 통과 | `perfect_1` ≥ 1 |
| perfect2 | 퍼펙트 2 | 챕터 2를 힌트 없이 한 번에 통과 | `perfect_2` ≥ 1 |
| perfect3 | 퍼펙트 3 | 챕터 3을 힌트 없이 한 번에 통과 | `perfect_3` ≥ 1 |
| perfect4 | 퍼펙트 4 | 챕터 4를 힌트 없이 한 번에 통과 | `perfect_4` ≥ 1 |
| perfect5 | 퍼펙트 5 | 챕터 5를 힌트 없이 한 번에 통과 | `perfect_5` ≥ 1 |
| secret_hello | (비밀) ??? | print("안녕")을 100번 실행 | `printHello` ≥ 100 |
| secret_night | (비밀) ??? | 자정부터 새벽 4시 사이에 문제 클리어 | `nightClear` ≥ 1 |
| secret_fast | (비밀) ??? | 타임 어택 5문제를 60초 안에 | `timeAttackFast` ≥ 1 |
| secret_turtle | (비밀) ??? | 거북이로 선을 100개 이상 그렸어요 | `turtleLines100` ≥ 1 |

## 5. 커스텀 블록 목록 (14개) — **v2.4.0 에서 블록 전체 삭제, 기록용**

Blockly 기본 블록에 더해 아래 커스텀 블록을 정의했습니다(`Blocks.setup`). 생성 코드는 사람이 쓴 것과 같은 형태이며 보조 함수를 만들지 않습니다.

| 블록 | 라벨 | 생성 코드 | 열리는 레슨 |
|---|---|---|---|
| `py_print_many` | 출력 ▢ ▢ ▢ ▢ | `print(a, b, c)` | 항상 |
| `py_input` | 입력 받기 input() | `input()` | L3 |
| `py_int` | 숫자로 int( ▢ ) | `int(x)` | L3 |
| `py_float` | 소수로 float( ▢ ) | `float(x)` | L3 |
| `py_str` | 글자로 str( ▢ ) | `str(x)` | L3 |
| `py_floordiv` | ▢ ÷ ▢ 의 몫 // | `a // b` | L3 |
| `py_change` | 변수 += ▢ | `x += n` | L2 |
| `py_for_range` | i 를 ▢ 부터 ▢ 까지 반복 | `for i in range(a, b + 1):` (끝 포함, 숫자면 미리 계산) | L5 |
| `py_index` | ▢ 의 ▢ 번째 (0부터) | `lst[i]` | L7 |
| `py_append` | ▢ 끝에 ▢ 추가 append | `lst.append(v)` | L7 |
| `py_pop` | ▢ 의 마지막 꺼내기 pop | `lst.pop()` | L7 |
| `py_fstring` | f문장 "…{}…" 의 {} 자리에 ▢ | `f"...{expr}..."` | (툴박스 카테고리 '출력'에 포함, 레슨 blocks에 추가하면 열림) |
| `py_dict_new` / `py_dict_get` / `py_dict_set` | 빈 딕셔너리 / ▢ 에서 ▢ 찾기 / ▢ 의 ▢ 에 ▢ 넣기 | `{}` / `d[k]` / `d[k] = v` | (리스트 카테고리, 필요 시 레슨 blocks에 추가) |

Blockly 기본 생성기에 가한 조정: 들여쓰기 2칸 → 4칸(`INDENT`), 변수 `x = None` 자동 선언 제거, 파이썬 식별자로 유효한 변수 이름(한글 포함)은 그대로 사용, 블록 라벨 한국어 메시지 팩 위에 초보자 용어로 덮어씀("%1번 반복", "만약 / 아니고 만약 / 아니면", "~인 동안 반복" 등). `controls_repeat_ext`는 `for count in range(n):`을 만듭니다.

툴박스는 레슨 `blocks` 필드가 누적됩니다: L1 `text_print, text, text_join` → L2 변수·계산 → L3 input·형 변환·나머지 → L4 조건 → L5 for → L6 while·break → L7 리스트 → L8 함수.

## 6. 외부 라이브러리 (버전 고정)

| 라이브러리 | 주소 | 로드 시점 |
|---|---|---|
| Pyodide 0.27.5 | `cdn.jsdelivr.net/pyodide/v0.27.5/full/` | 홈 진입 즉시 워커에서 백그라운드 다운로드(파일 4개를 먼저 받아 진행률을 계산한 뒤 `loadPyodide`) |
| ~~Blockly 11.2.2~~ (v2.4.0 삭제) | — | — |
| CodeMirror 6 | `codemirror@6.0.1`, `@codemirror/lang-python@6.2.1`, `@codemirror/view@6`, `@codemirror/state@6`, `@codemirror/commands@6`, `@codemirror/language@6`, `@lezer/highlight@1` (jsdelivr `+esm`) | 첫 텍스트 에디터. 실패하면 줄 번호·Tab·콜론 자동 들여쓰기를 갖춘 textarea 대체 에디터로 자동 전환 |

CodeMirror 하위 패키지는 메이저 버전만 고정했습니다. jsdelivr `+esm`은 의존성을 외부 모듈로 풀어 쓰기 때문에, `codemirror@6.0.1`이 요구하는 `@codemirror/view ^6`과 직접 가져오는 `@codemirror/view@6`이 같은 모듈 인스턴스로 해석되어야 확장(extension)이 충돌하지 않습니다. 정확한 패치 버전까지 고정하면 서로 다른 인스턴스가 될 위험이 있어 이렇게 정했습니다.

## 7. 설계상 선택

- **Pyodide 워커**: Blob URL 워커 안에서 `importScripts`로 로드. 매 실행마다 새 네임스페이스(`{'__name__': '__main__'}`)에서 `exec`. stdout/stderr는 바이트 단위 `write` 콜백으로 즉시 postMessage(실시간 스트리밍). stdin은 `setStdin` 콜백이 입력값 칸의 줄을 한 줄씩 주고, 바닥나면 `None`(EOF)을 돌려 `EOFError` → "입력값 칸에 n번째 값이 필요해요"로 바꿔 보여줍니다.
- **거북이**: 워커 안에서 `sys.modules['turtle']`에 직접 만든 모듈을 넣습니다. 지원: forward/backward/left/right/penup/pendown/color/width/speed/circle/goto/setheading/begin_fill/end_fill/clear/home/hideturtle/showturtle/bgcolor + 흔한 약어(fd, bk, lt, rt, pu, pd …) + `Turtle()`/`Screen()` 더미 클래스. 그 외 속성은 "turtle.X은(는) 아직 지원하지 않아요" AttributeError. 명령 목록(최대 2만 개)을 메인 캔버스가 받아 속도 슬라이더에 맞춰 애니메이션으로 그립니다.
- **한 줄씩 보기**: `sys.settrace`로 `<user>` 파일 프레임의 line/return 이벤트만 기록. 각 단계에 줄 번호·지역 변수(repr, 80자 절단)·호출 스택·그 시점까지의 출력(마지막 3,000자)을 담습니다. 블록 모드에서는 생성 코드 기준으로 돌리고, 그 줄을 만든 블록을 `workspace.highlightBlock`으로 같이 밝힙니다(블록↔줄 대응은 블록 단독 코드의 첫 줄을 전체 코드에서 찾는 근사 방식).
- **채점**: 출력 비교는 줄 끝 공백·앞뒤 빈 줄 무시, `ignoreCase` 지정 시 대소문자 무시. 함수형 테스트는 `repr(호출식)` 문자열 비교. 변형 문제(`vary`)와 `__COMPUTED__` 표시는 정답 코드를 실제로 실행해 기대값을 계산합니다.
- **Parsons**: 라이브러리 없이 구현. 줄 타일을 눌러 "내 코드"로 옮기고, 그립(⠿)을 끌어 순서를 바꾸며 좌우로 끌거나 ◀▶로 들여쓰기(0~4단계)를 맞춥니다. 채점은 순서·들여쓰기 완전 일치. 틀린 줄만 붉게 1.5초 표시.
- **정답 코드 주석**: 정답 보기 때 줄마다 붙는 주석은 키워드 규칙(`UI.annotate`)으로 자동 생성합니다(print → "화면에 출력", for … range → "정해진 횟수만큼 반복" 등).
- **콤보 표시**: 상단 바에 2콤보부터 "⚡×n"이 뜨고 3/5/10에서 색이 바뀝니다. 오답 시 사라집니다.
- **오늘의 도전**: 클리어한 문제 중 코드·Parsons·빈칸 유형에서 날짜 숫자 합을 시드로 하나 고르고, `vary`가 있으면 랜덤 변형합니다.
- **마스코트**: 뱀 캐릭터 SVG 1종, 색 3종(온보딩에서 선택), 표정 3종(normal/happy/confused), 레벨 1·10·20·30·40·50에서 알 → 새끼 → 안경 → 망토 → 왕관 → 황금으로 진화. 액세서리 10종은 보관함에서 장착.
- **저장 스키마** v1: `python_academy_save` 키 하나에 JSON. `Store.migrate()`에 향후 버전 변환을 넣습니다.

## 8. 검증 결과

| 항목 | 결과 |
|---|---|
| 모든 실행형 문제(블록 19·코드 30·버그 6·Parsons 12, 보스 5 포함) 정답 코드 vs 테스트 | **CPython 3.13에서 전부 통과** (`verify/run.py`) |
| 레슨 예제 57개 실행 | 55개 정상, 2개는 일부러 에러를 내는 예제(L0 따옴표 누락, L1 따옴표 없는 print) |
| 워커 파이썬 프렐류드(실행·에러 줄 번호·함수 호출·추적·거북이·EOF·네임스페이스 초기화·compile 검사) | CPython 단위 테스트 통과 |
| JS 문법 | Node 22 `--check` 통과 |
| 헤드리스 Chrome 스모크 테스트 | 온보딩 → 레슨 0 → 퀴즈 클리어(+15 XP, 색종이·레벨업) → 빈칸 클리어 → Parsons·버그·코드·블록·놀이터·뱃지·프로필·보관함·설정·용어집·에러 사전·약점 분석·타임 어택·종합 점검 화면 전환, 모바일 390px 폭 가로 스크롤 없음. **JS 런타임 에러 0건** |

### 검증하지 못한 것 (알려진 제약)

- 제작 환경에서 CDN(jsdelivr, unpkg) 접근이 막혀 **Pyodide·Blockly·CodeMirror가 실제 로드된 상태의 브라우저 동작(무한루프 5초 중단, input() 칸, 블록 생성 코드 채점, 색종이 연출과 실행의 조합)은 코드 검토로만 확인**했습니다. 처음 열 때 꼭 한 번 레슨 1~5를 끝까지 눌러 보고, 블록 문제에서 생성된 코드가 채점을 통과하는지 확인해 주세요.
- Claude API 질문·스트리밍·오류 메시지는 유효한 키가 없어 실제 호출을 하지 못했습니다. 설정 → 연결 테스트로 확인해 주세요.
- 블록↔코드 줄 하이라이트는 근사 방식이라 같은 코드 줄이 두 개 이상 있으면(예: `print(i)` 두 번) 첫 번째 줄만 밝힙니다.
- Blockly 기본 블록 중 `text_join`(3개 이상 이어 붙이기), `lists_sort`, `math_on_list` 평균 등 일부는 Blockly가 보조 함수를 끼워 넣습니다. 툴박스에는 `text_join`만 열어 두었고, 2개까지는 `str(a) + str(b)`로 깔끔하게 나옵니다.
- 블록 모드에서 `input()` 블록은 프롬프트 문자열을 받지 않습니다(프롬프트가 stdout에 섞여 채점을 깨뜨리기 때문).
- 복습 변형(`vary`)은 현재 3개 문제(L2P3, L2P5, L3P1)에만 정의되어 있습니다. 나머지는 원본 그대로 복습합니다.
- 거북이 `circle`은 10도 단위 다각형 근사이며 `extent` 각도만큼만 그립니다. `shape`, `dot`, `write` 등은 미지원.
- 효과음은 브라우저 자동재생 정책 때문에 첫 클릭 이후부터 납니다.
- `localStorage`는 같은 파일 경로(file://)·같은 브라우저에서만 공유됩니다. 다른 폴더로 옮기면 진행이 비어 보일 수 있으니 설정 → 내보내기/가져오기를 쓰세요.
- 오늘의 도전은 하루에 한 문제이며 자정(로컬 시각) 기준으로 바뀝니다. 날짜 계산은 모두 기기 로컬 시각입니다.

## 10. 실행 환경 안내 (v1.0.1 추가)

이 파일은 **진짜 브라우저(Chrome·Edge·Safari·Firefox)에서 열어야** 동작합니다. 채팅 앱의 파일 미리보기(주소가 `claudeusercontent.com`인 샌드박스)나 아티팩트 링크에서는 보안 정책 때문에 Blob 워커 생성과 Pyodide의 wasm 다운로드가 모두 막혀 파이썬 실행이 불가능합니다.

| 기기 | 여는 방법 |
|---|---|
| PC | 파일을 저장한 뒤 더블클릭 (file:// 로 열림) |
| 안드로이드 | 파일을 내려받은 뒤 "내 파일"/"Files" 앱에서 `python_academy.html`을 눌러 **Chrome으로 열기** |
| 아이폰·아이패드 | 파일 앱의 미리보기는 스크립트를 실행하지 않습니다. PC와 같은 Wi-Fi에서 PC 쪽에 `python -m http.server 8000`을 띄운 뒤 아이폰 Safari로 `http://PC의IP:8000/python_academy.html` 접속, 또는 GitHub Pages·Netlify Drop 같은 무료 정적 호스팅에 올려 그 주소로 접속 |

v1.0.1에서 **메인 스레드 보조 실행기**를 추가했습니다. 워커를 만들 수 없는 환경(일부 앱 내 WebView)에서는 앱이 멈추지 않고 Pyodide를 메인 스레드에서 직접 띄웁니다. 이때는 상단에 안내 토스트가 뜨고, 로딩 상자에 "보조 실행기"가 표시됩니다. 보조 실행기에서는 무한루프 5초 자동 중단이 불가능하므로(동기 실행 중에는 멈출 수 없음) 탭이 멈출 수 있습니다. 복습 변형의 `{{식}}` 계산도 `eval`을 쓰지 않는 자체 계산기로 바꿔 엄격한 CSP 환경에서도 동작합니다.

## 9. 다음 개선 후보

1. 블록 모드 전용 거북이 블록(앞으로/왼쪽으로)과 f-string 블록을 레슨 5·9 툴박스에 열기
2. `vary` 변형 파라미터를 코드 문제 20개 이상으로 확대(현재 3개)
3. 종합 점검 풀에 코드 문제도 섞기(현재 퀴즈·빈칸만)
4. 선생님 "비슷한 문제 하나 더"로 만든 문제를 레슨 요약 화면 목록에도 표시
5. 블록↔줄 대응을 `STATEMENT_PREFIX` 기반 정확 매핑으로 교체
6. 프로필 PNG에 뱃지 아이콘 넣기, 마스코트 진화 애니메이션
7. 진행 저장이 5MB에 가까워지면 오래된 선생님 대화부터 자동 정리


## 11. v2.0.0 Phase 0 — 멀티 코스 구조 전환 (설계 결정 요약)

**임의로 정한 수치**
- 허브 "남은 시간" = 남은 문제 수 × 4분(`CONFIG.HUB.minutesPerProblem`). 저장 용량 경고 4MB(`CONFIG.STORAGE_WARN_BYTES`).
- 코스 카드 순서·전제(`CONFIG.COURSES`): 알고리즘은 B3, 웹은 B2 보스 클리어. 설정 `settings.unlockAll`이 true면 전제 무시(스위치 UI는 Phase 5에서 노출).

**지시서(EXPANSION.md)와 다르게 한 것과 이유**
- `core/util.js`를 추가(지시서 구조에는 없음): `$`, `esc`, `todayKey` 같은 유틸은 모든 파일이 쓰므로 config 바로 다음에 따로 둠.
- `shared/badges.js`로 BADGES·INVENTORY를 묶음(지시서는 errors·glossary만 shared). 뱃지·보관함 아이템은 코스 공통이고 허브가 마스코트를 그릴 때 INVENTORY가 필요.
- `core/tutor.js`에 API 호출(Tutor)과 패널(Tutor.ui)을 함께 둠. 선생님 UI는 코스 페이지 전용이지만 파일을 둘로 나누면 `Tutor.ui = {...}` 확장 순서 문제만 생기고 이득이 없음.
- `Store.data`는 v1과 똑같은 한 객체를 유지하고 저장 시점에만 `academy.*` 조각으로 나눔. 이유: 400곳 넘는 `Store.data.x` 접근을 바꾸지 않아 회귀 위험 0, 기기 연동(Sync) payload·내보내기 JSON도 v1과 호환.
- 허브가 `courses/python/content.js`(데이터 100KB)를 읽음. 지시서는 "러너를 받지 않는다"이고 데이터는 러너가 아님. 복습 큐 수·이어서 하기·진행률 계산에 문제 목록이 필요. 코스가 늘면 `course.json`에 문제 수를 캐시해 다른 코스 콘텐츠는 안 읽는다.
- 캐시 깨기 `?v=`는 `tools/stamp.mjs`로 일괄 갱신(빌드 도구가 아니라 치환 스크립트). validate_content가 불일치를 에러로 잡아 잊어버리면 배포가 막힘.
- 회귀 체크리스트 중 "허브 1초/코스 2초"는 헤드리스에서 측정하지 않음(파일 크기 기준: 허브 ≈ 160KB, 코스 페이지 ≈ 380KB, CDN 제외).

**알려진 제약과 다음 Phase에 넘긴 것**
- 러너 인터페이스(load/run/grade/reset/snapshot/view)는 아직 `Py`·`Grader` 그대로. Phase 1에서 시각화와 함께 `Runner` 래퍼로 감싼다(동작 변경 없음).
- `tools/schema.json`(JSON Schema)은 미작성. validate_content.mjs가 같은 규칙을 코드로 검사 중이며 Phase 1에서 선생님 문제 생성과 함께 JSON Schema로 옮긴다.
- 허브 4·5번(추천 로드맵·캘린더·뱃지·작품)은 Phase 5. 설정 화면은 아직 코스 페이지 안에만 있음(허브 ⚙는 그리로 이동).
- 다른 코스의 진행 조각(`academy.course.<id>`)은 읽기만 하고, 코스 간 복습 큐 통합은 Phase 1에서.

**파일별 줄 수 / 로딩 용량** (CDN 제외)
- core: config 118 · util 13 · storage 68 · sync 130 · engine 180 · runners/python 288 · game 75 · tutor 74 · fx 63 · ui-core 80 · ui-editors 207 · ui-views-main 279 · ui-views-more 166 · hub 42 · ui.css 212
- courses/python: content.js 798 (≈100KB) · shared: errors 41 · glossary 43 · badges 84
- 허브 전송량 ≈ 160KB, 파이썬 코스 페이지 ≈ 380KB (gzip 전).


## 12. v2.1.0 Phase 1 — 코스 2 알고리즘·자료구조 (설계 결정 요약)

**산출물**: `courses/algo/`(index.html·content.js·course.json) 레슨 16 + 보스 4(마지막은 모의고사), 문제 101(코드 60·퀴즈 30·버그 5·빈칸 4·Parsons 2), 시각화 엔진 `core/visualize.js` 8종(bars·boxes·linked·tree·graph·grid·table·callstack), 모의고사 모드, 시간 제한 채점.

**임의로 정한 수치**
- 시간 제한 배율 `CONFIG.ALGO.slowdown = 3` (Pyodide/CPython). 기기 보정 `Py.bench()`: 100만 번 덧셈 루프를 기준 350ms와 비교해 0.5~4배로 클램프(코스 페이지 로드 직후 1회). 채점 기준 = `limits.time × 3 × 보정`; 워커 강제 종료는 그 1.5배 또는 5초 중 큰 값.
- 검증 스크립트는 정답이 CPython에서 **제한의 50%** 안에 돌아야 통과(`run_solutions.py`). 101개 전부 통과.
- 시각화 추적 단계 5,000(`traceMaxSteps`), 변수 repr 스냅샷은 500단계까지만(payload 억제), 구조 스냅샷은 리스트 300개·딕셔너리 200개·깊이 8·객체 속성 20개 제한.
- 모의고사: 풀 15문제 중 랜덤 3, 60분, 2문제 이상 통과 시 클리어 + 150 XP. 코딩테스트 문제 XP 80, 보스 문제 60~70.
- 큰 입력 테스트는 `inputGen`(파이썬 식)으로 생성 — 최대 n=200,000.

**지시서와 다르게 한 것과 이유**
- 태그는 코스 접두사(`algo.sort`) 대신 한국어(`정렬`)로. 약점 분석·태그 칩이 `#태그`를 그대로 보여 주고, 문제가 코스 파일로 이미 구분되므로 접두사가 사용자에게 보일 이유가 없음. 코스 간 통합 약점 분석(Phase 5)은 코스 id + 태그 2단계로 한다.
- 새 문제 유형 3종(추적 퀴즈·복잡도 맞히기·자료구조 고르기)은 별도 type 대신 `type:'quiz'` + `kind` + 확장 필드(`quiz.code/input/q/then`)로 구현. 채점·XP·통계 코드를 건드리지 않고 표시만 바꾸는 쪽이 회귀 위험이 적음. 코딩테스트 형식은 `kind:'ct'`.
- "데모 모드"는 미리 만든 애니메이션 대신 **예제 코드를 실제로 추적 실행**해서 그린다(`example.visualize`, `autoViz`). 입력 배열을 바꿔 다시 재생하는 요구는 "예제 코드를 고쳐서 재생"으로 자연히 충족되고, 두 모드가 같은 엔진을 쓴다. 레슨 A0·A1의 n 슬라이더는 `example.slider`로 첫 줄 값을 바꾸는 방식(UI는 다음 패치에서 노출 — 현재는 코드 직접 수정).
- 러너 인터페이스(load/run/grade/reset/snapshot/view)는 아직 `Py`·`Grader`를 직접 호출. 시각화 엔진은 `Py.run({vis, maxsteps})` 옵션으로 붙였다. 러너가 2종 이상 생기는 Phase 2에서 래퍼를 도입한다.
- 보스 챕터 열기는 보스 레슨의 **모든 문제** 클리어로(파이썬 코스는 보스 1문제라 동일 동작).
- 모의고사 풀은 보스 레슨 AB4의 문제들(`mock:true`). 지도 노드는 `stats.boss_AB4`로 완료 표시.
- `terms`에 적은 레슨 용어를 공용 GLOSSARY에 합류(`Content.init`). 코스별 용어집 분리는 Phase 5.

**알려진 제약과 다음 Phase에 넘긴 것**
- 실제 Pyodide에서의 시각화·시간 제한·bench는 샌드박스에서 못 봄 → 사용자 확인 필요(특히 모의고사 큰 입력 테스트 속도).
- 시각화 변수 이름을 문제가 지정하므로 다른 이름을 쓰면 그림이 비어 보임("변수 이름은 ○○" 안내로 대응).
- 허브는 다른 코스 진행률을 `CONFIG.COURSES.total`(검증 스크립트가 실제 수와 대조)로 계산. 복습 큐는 아직 파이썬만.
- `tools/schema.json` 미작성(검증은 코드로).

**파일별 줄 수 / 용량**: `courses/algo/content.js` ≈ 118KB(레슨 16·문제 101), `core/visualize.js` 118줄 ≈ 22KB. 알고리즘 코스 페이지 전송량 ≈ 420KB(CDN 제외).

## 13. v2.2.0 Phase 1.5 — 코스 끝 실전 챕터 (설계 결정 요약)

**구조**
- 레슨 `practical: true`(챕터 6/E), 문제 `project.steps[]`(체크리스트) + `tests[].stage`(어느 단계를 검사하는지). 단계의 테스트가 전부 통과하면 `Store.data.lessons['proj_'+pid]`에 자동 체크(`st.autoCheck`), 수동 체크도 그대로 가능. 보스 프로젝트(B2P1 등)는 stage 없이 수동 체크리스트 유지.
- 해금은 기존 `Game.chapterOpen`(직전 챕터 보스 stat) 그대로 — 파이썬 ch6 ← `boss_B5`, 알고리즘 ch5 ← `boss_AB4`(모의고사 통과 시 기록).
- 파일 프로토콜: 문제 `files: { upload: {name, accept, label, sample}, outputs: [...] }`. 실행·채점 전 워커 FS에 `files`를 쓰고, `outputs`는 실행 전 지우고 실행 후 읽어 `result.outFiles`로 돌려줌. 테스트는 `tests[].files`(없으면 upload.sample)로 입력 파일을 주고, `outFile`이 있으면 정답 코드가 만든 파일과 내용 비교(공백 정규화). 사용자가 📎로 올린 파일은 ▶ 실행에만 쓰이고 ✔ 제출 채점은 항상 샘플/테스트 파일.
- 마스터 뱃지: `Game.clearProblem`에서 코스의 practical 문제가 전부 clear면 `stats.master_<course>` → BADGES `master_python`/`master_algo`(👑).

**임의로 정한 수치**
- 실전 프로젝트 xp 120(단계 4×25 = 100 이상, 검증기가 하한 검사). 업로드 미리보기는 결과 파일 앞부분만(`pre.small`, 스크롤). inputGen 입력은 300자 이하면 테스트 목록에 그대로 표시.
- 미로 이웃 순서 위·아래·왼쪽·오른쪽을 지문에 고정 + 테스트 미로는 최단 경로가 유일한 것만 사용(스크립트로 경로 수 확인). 지하철 테스트 질의도 동률 없는 것만.

**지시서(EXPANSION.md 9절 ②)와 다르게 한 것과 이유**
- 「미로 게임」의 "사용자 미로 입력"은 별도 격자 편집 UI 대신 **입력칸에 미로 문자를 그리는 방식**: 기존 입력칸·시각화 파이프라인을 그대로 쓰고, 텍스트 미로가 코딩테스트 입력 형식과 같아 학습 효과가 큼.
- 「지하철」의 "소형 노선 데이터"는 코드 상수가 아니라 **입력 예시(13개 노선)**로 제공: 사용자가 자기 동네 노선을 넣을 수 있고 테스트에서 데이터를 바꿀 수 있음.
- 단어 퀴즈의 랜덤은 `random.seed(S)`를 명령 인자로 받아 **재현 가능하게** — 채점 가능하면서 random 학습 유지.
- 결과 파일 채점은 "정답 코드가 만든 파일과 같은가"로(기대 파일을 콘텐츠에 따로 적지 않음) — 테스트 파일이 바뀌어도 기대값이 자동으로 따라옴.

**알려진 한계**
- 헤드리스 회귀(`tools/regress.py`)는 Pyodide를 못 받아 파일 업로드·내려받기·결과 파일 채점의 실제 동작은 브라우저에서만 확인됨(UI 존재·콘텐츠 구조만 검사).
- 업로드한 CSV의 열 이름이 샘플과 다르면 KeyError — 지문에 "열 이름은 같아야 해요"로 안내.

**v2.2.3 추가 (WP-G)**
- 코스당 실전 프로젝트 4개(X1~X4, E1~E4). 마스터 뱃지 조건은 "코스의 practical 문제 전부"라 자동으로 4개 기준이 됨(이미 받은 사용자는 유지).
- `project.extra[]` = 채점 없는 확장 아이디어. 체크 = 자기 신고, 항목당 10 XP 한 번(`lessons['extra_'+pid]`). 클리어 전에는 숨김(`.pv-extra.hide`).
- 작품(`works[]`)은 프로젝트당 1개(`src`로 식별)이고 재클리어 시 코드 갱신. 선생님 리뷰는 `work.review`에 저장해 재호출하지 않음(비용). 리뷰 프롬프트는 코스 페르소나 + "잘한 점 1·고칠 점 2·다음 도전 1, 정답 코드 금지".
- 알고리즘 E3 배정표는 힙이 아니라 "번호 낮은 빈 교실" 선형 탐색(결과가 결정적이고 교실 수가 작음). 최다 과목은 (끝, 시작, 이름) 정렬 — 지문에 명시.

## 14. 설계 원칙: 무료 교육 (2026-11-02, 사용자 명시 · **2026-11-03 범위 정정**)

> **정정(2026-11-03, 사용자)**: **무료 교육 = 이 사이트의 교육(레슨·문제·코스)을 학습자에게 돈 받지 않고 제공한다는 뜻**(사용자 정정 2026-11-03: 「교육의 무료다, 너무 광범위하게 생각하지 마」). 기술 선택을 막는 규칙이 **아니다** — 외부 도구·계정·설치·AI 서비스도 코스 목적에 맞으면 쓴다. 아래 11/2 의 「계정·API 키·설치 없음」 해석은 너무 넓었다. 아래 줄들은 그때 만든 기존 기능의 설계 기록으로만 남기고, 새 설계를 막는 규칙으로 쓰지 않는다.

- 이 사이트의 가장 중요한 가치는 **무료 교육**이다. 학습자 쪽 비용 0: 계정 없음, 결제 없음, API 키 없음, 설치 없음. 정적 파일 + 무료 CDN(Pyodide·CodeMirror) + localStorage(+선택적 GitHub gist 연동)만으로 모든 학습이 끝까지 가능해야 한다.
- 유료 재료는 **옵션**이다: Claude API 선생님은 `CONFIG.TUTOR.enabled`(기본 false)로 꺼 두고, 켜더라도 힌트·코치·에러 사전·시각화가 못 주는 것만 보탠다. 선생님 없이도 모든 문제가 힌트 3단계 + 정답 보기로 풀리도록 콘텐츠 규칙(validate: 힌트 3개 이상)을 유지한다.
- 앞으로의 "도움" 기능 우선순위: ① 규칙 기반 코치(텍스트/Parsons) ② 에러 사전·테스트 실패 설명 ③ 시각화·한 줄씩 보기 ④ 체크리스트 자동 채점 — 전부 브라우저 안에서 무료.

**v2.2.6 구현 메모 (무료 도움·오프라인)**
- `Grader.explainDiff`는 정규화된 출력(`norm`)끼리 비교해 규칙을 순서대로 적용, 팁 최대 3개. 규칙 추가 위치는 `core/engine.js` 맨 아래. 코드(`r.code`)는 input("…") 안내문 검출에만 씀.
- `sw.js`: 앱 셸은 버전 캐시(`academy-shell-<ver>`)에 설치 때 미리, HTML은 네트워크 우선(새 배포 즉시 반영) → 오프라인이면 캐시, `?v=` 붙은 파일은 캐시 우선. CDN은 `academy-cdn-1` 런타임 캐시(처음 쓸 때). 러너 CDN 버전을 바꾸면 URL이 달라져 자연히 새로 받고, 옛 항목은 설정의 「캐시 지우기」로. file:// 와 미지원 브라우저는 조용히 건너뜀. 용량: Pyodide 한 벌 ≈ 12MB(브라우저 캐시 한도 안).
- 「모르겠어요」는 AI 없이 콘텐츠가 이미 가진 것(용어·예제·요약·이전 페이지)을 한 곳에 모은 것. 누른 횟수는 `lessons.confused[lessonId:page]`, 통계 `stats.confused` — 약점 복습 연결은 다음 후보.

## 14-2. 설계 원칙: 난이도는 레슨이 가르친 만큼만 (2026-11-05, 사용자 제보 QA #160)

- **문제는 그 시점의 본문으로 풀려야 한다.** 검수가 「정답이 맞나」만 보면 1,148문제 실패 0 이어도 학습자는 L11 에서 며칠을 막힌다. 난이도·순서·편집 방식 전환은 따로 본다(specs/qa-team.md 2-2절, specs/content-team.md 3-2절).
- **(v2.6.0, 사용자 결정 D1·D3 11/5) 디자인 개편 — 성인·깔끔·모던.** 레퍼런스 `specs/ref/modern-ui-lesson.png`·`modern-ui-explorer.png`. 토큰은 `core/ui.css` 맨 위: 바탕 `--bg #141a26` → 카드 `--surface` → 칸 `--surface2` 세 단계, 액센트 `--primary`=`--accent` 파랑 하나(완료·제출·진행 막대 전부), `--success` 초록은 맞음/통과 표시에만, `--warn`·`--gold` 는 힌트·별에만 남김. 본문 16px, 제목은 크기·굵기로만(h1 1.8em/800). 화면 구조: 홈 = 탐색기(`.ex3-cols` 트리 260 / 카드 / 미리보기 320, ≤1099px 미리보기 숨김, ≤767px 챕터 칩), 레슨 = `.lp-cols.has-ex`(설명 40% / 편집기), 스텝퍼 `.lp-stepper`. 게임 요소는 `Game.showGame()`(= `settings.game`, 기본 false) 뒤로: UI.celebrate·renderTopbar·문제 결과·요약 목록·허브. 상단바 아이콘은 `UI.icon(name)` 인라인 SVG(hub·home·settings·keys). 아트 자리: 허브 hero·코스 아이콘·챕터 그림·노드 마스코트 삭제(파일 보존), 보스 그림은 `.lc.boss .lc-n` 56px — 새 스타일 요청은 IMAGES.md 3-B. 게임 끔 규칙(QA 2차): 직접 부르는 `UI.badgeFly`는 토스트로, `Confetti.rain/burst`는 안 그림(두 함수 안에서 확인하니 호출부에 조건 불필요), 「+N XP」 문구는 호출부에서 `Game.showGame()` 조건. 홈 탐색기 규칙: 잠긴 레슨은 트리·카드 둘 다 disabled + `pick()`이 `Game.lessonOpen` 확인, 레슨 열 때는 항상 저장 쪽(`d.lessons[id].page`)을 들고 감, ≤1099px 는 「오늘 할 일」을 `.td-narrow`(가운데 열 아래)로 보여 줌. 모의고사 레슨(`l.mock`)은 카드·미리보기 문구가 다름.
- **(v2.5.0, 사용자 결정 D5·D6 11/5) 레슨 나누기.** 한 레슨 = 개념 하나~둘, 5~6쪽 이하, 문제 3~5개(쉬운 것 → 합친 것). 나눌 때 **문제 id 는 바꾸지 않고 lesson 만 옮긴다**(저장 기록·복습·별이 그대로 이어지고 마이그레이션이 필요 없다). 새 레슨 id 는 알파벳 접미(`L3B`), 새 문제 id 는 `L3BP1`(COURSE_ID_PATTERNS 가 `[A-Z]?` 허용). 레슨 번호 `n` 은 파일 순서대로 다시 매기고, 본문·지문의 다른 레슨 참조는 `[[레슨:L11C]]` 토큰으로 써서 렌더 때 번호를 계산한다(QA #128). 「약 N분」은 삭제(사람마다 기준이 달라 의미 없음) → 「N쪽 · 문제 M개」. **진행 보호**: 레슨 열림은 「앞 레슨 완료」 외에 「한 문제라도 푼 가장 뒤 레슨(`Game.furthestIdx`)까지와 그 다음」을 항상 열고, 그 챕터까지 열어 둔다 — 나눈 레슨에 새 문제가 들어가도 옛 사용자가 앞으로 되돌아가지 않는다. 아직 안 나눈 7쪽 이상 레슨(L1·L2·L4·L5·L9·L13·L17·L19·L20·L21)은 다음 후보.
- **(v2.4.0, 사용자 결정 D2 11/5) 블록·「Parsons/텍스트 고르기」 삭제, 전부 타자.** 블록 21문제·정답 4줄 이하 Parsons 7문제를 `code` 로 바꾸고, L0~L3 는 한두 줄 따라 치기, 그 뒤는 starter 에 틀 + 지문이 쓸 줄을 콕 집음. 남은 Parsons 6문제(L6P2·L7P2·B2P1·B2P2·L13P4·L14P5)는 줄 순서 자체가 연습인 것. `core/`: Blockly 로드·BlockEditor·놀이터 블록 탭·블록 코치(GUIDES)·`dual` XP 배율 삭제. 옛 저장의 `rec.mode` 'block'|'parsons' 는 무시하고 starter 로 연다(`regress.py` 검사). validate 가 `type:'block'`·`dual`·4줄 이하 Parsons 를 에러로 막는다. (이전 설계 「블록(L1~L8) → Parsons(L9~L10) → 타자(L11~) 계단」은 폐기)
- **합친 문제는 마지막에, 그리고 한 줄만.** 레슨 기능을 여럿 합친 문제는 레슨 끝에 두고 starter 가 나머지를 적어 둔다(L11P1 「가운데 한 줄만」).
- **`tools/check_level.mjs` (v2.7.0) — 「풀 수 있나」 자동 측정.** 코스 LESSONS 순서대로 레슨을 훑으며 「본문」(= 그 레슨까지의 `pages[].html` 에서 접힌 `<details>` 제외 + `example.code` + 같은 레슨 **앞** 문제의 지문·starter)에 나온 파이썬 기능을 누적하고, 문제마다 정답(`solution`/`bug.solution`/`parsons.solution`, fill 은 빈칸을 채운 코드)과 힌트 3이 쓰는 기능을 재서 ① **본문 밖 기능**(그 시점까지 본문에 한 번도 없음 — 그 문제의 지문·starter 에만 있으면 `(지문○)`, 힌트 3에서만 쓰면 `(힌트3)`) ② **새 기능 수**(이 레슨 본문에서 처음 나온 기능을 몇 개 합쳤나, 3개 이상 표시) ③ **첫 문제 경고**(첫 문제의 정답 줄 수 + 기능 수가 나머지 문제 중앙값보다 크면, 보스 레슨 제외)를 코스별 마크다운 표로 낸다. 기능 카탈로그는 파일 위쪽 `CATALOG` 한 곳(키워드·내장 함수 호출 꼴·메서드·f-string/슬라이싱/컴프리헨션/언패킹 같은 문법 꼴·모듈 호출, 2중 for·중첩 함수·재귀는 들여쓰기로), 문자열·주석 안과 에러 메시지 줄은 빼고 잰다. `SUB`(`int(input())`·`with open` 같은 세부 꼴)는 ①에만 쓰고 ②·무게엔 안 센다. 대상은 runner python + 지식 지도 아님(python·algo, algo 는 선수 코스 python 본문 전체를 배운 것으로 침). 정규식이라 **오탐 가능** — 표 위에 그렇게 적혀 있고, 근거는 `--lesson L11` 로 본다(기능마다 정답 몇 줄에서 쓰였고 어디서 처음 가르쳤는지). 명령: `node tools/check_level.mjs`(걸린 문제만) · `--all` · `--course python` · `--lesson L11` · `--json` · `--features --course python`(기능별 처음 나온 곳, 카탈로그 점검용). **래칫 게이트**: `tools/check_level.baseline.json` 에 코스별 ①②③ 걸린 수를 두고 `--gate`(CI `validate_content` 다음 단계)는 현재 수가 baseline 보다 **늘면** exit 1 — 지금 걸린 것들이 CI 를 바로 깨지 않고, 새로 나빠지는 것만 막는다. 걸린 수를 줄였으면 `--update-baseline` 으로 내려 잡는다.

## 15. 유지보수 위임 `[core]` — 지시서(specs/schedule-week.md 3절)와 다르게 한 것 (2026-11-02, Opus·유지보수)

- **QA #4** 이어서 하기 위치 저장: 지시서 `Store.save()` 대신 `Store.save({ silent: true })`. 화면 이동마다 `updatedAt` 을 올리고 기기 연동 push 를 예약하면 문제를 열기만 해도 동기화가 돌고 다른 기기와 충돌 판정이 잦아진다. 위치는 다음 실제 저장 때 같이 올라간다.
- **QA #6** 시각화 ResizeObserver 가드: 지시서 `!host.isConnected` 에 `|| !cvs[0].isConnected` 추가. 에러가 나는 흔한 경로는 host 가 붙어 있는 채로 내용만 바뀌는 경우(👀 다시 누르기 = `runAndShow` 가 host.innerHTML 교체, 닫기 버튼 = host.innerHTML = '')라 host 검사만으로는 재현이 그대로 남았다.
- **QA #9** 고대비 「전체 초기화」 글자색: 지시서 `[data-contrast="1"] .btn.danger` 를 `[data-contrast="1"][data-theme=dark] .btn.danger` 로 좁힘. 라이트 고대비의 `--danger #c3203a` 위에 `#1d2230` 글자는 2.7:1 로 원래(흰 글자 5.9:1)보다 나빠진다. 다크는 2.5 → 6.3:1.
- **QA #2** 수식 글자 폴백(`MathUI.plain`): 지시서의 「치환 목록 추가 + `\frac` 반복」 대신 **중괄호 짝을 세는 작은 파서**로 다시 씀. 인자 안에 중괄호가 있는 `\frac{1}{\sigma\sqrt{2\pi}}`·`\frac{\sum …}{\sqrt{…}}` 는 정규식 반복으로는 안 풀려 8개가 그대로 깨졌다. 기호 치환은 `\vec{a}\cdot\vec{b}` 처럼 명령 뒤에 글자가 붙기 전에 먼저 한다. 수학 수식 58개 결과는 regress 체크(QA #2)가 지킨다.
- **QA #8** 오프라인 캐시 개수: 지시서 `Math.min(shell.keys().length, ASSETS.length)` 대신 `ASSETS` 각각 `shell.match(u)` 로 셈. min 은 런타임 캐시(같은 출처 이미지·`courses/<id>/` 경로)가 섞이면 일부 파일이 빠져도 125/125 로 보여서 실제 오프라인 준비 상태를 못 알려 준다.
- **QA #12** 노드 완료 버튼: 지시서의 「레슨 완료!」→「노드 완료!」에 더해 같은 버튼의 「다음 레슨:」도 수학 공간에서는 「다음 노드:」.
- **U-1(QA #62)** 탐구 퀴즈 잠금: 지시서대로 `unlockWhen`·`unlockText`. 한 번 열린 보기는 다시 조건에서 벗어나도 잠그지 않는다(답을 고르며 그림을 더 만져 볼 수 있게). 조건은 슬라이더 간격·끌기 0.5 단위로 실제로 만들 수 있는 것만 붙였다(6문제, 끌기까지 헤드리스로 확인).
- **U-2(QA #63)** 폰 폭 글자: 지시서는 modring 배치 변경 + 다른 kind 점검. 점검 결과 넘치는 kind 가 6개라 kind 마다 배치를 바꾸는 대신 **`Fig.text` 한 곳에서** 넘칠 때 글자를 80%까지 줄이고 그래도 넘치면 안쪽으로 민다(회전된 글자는 그대로). 배치까지 바꾼 것은 modring(지시서)과 floatline(80%로도 안 들어가는 긴 문장 → 두 줄).
- **QA #67 기기 연동 형식 2 (`academy-sync-2`)** — 지시서 없음, **사용자 승인(11/2 16:31)으로 유지보수가 진행, Fable 목요일 검토 필수**. 원인: v2.0.0 멀티 코스 뒤에도 `Sync.payload()` 가 지금 열린 코스 하나의 `Store.data` 를 올리고, 다른 코스 페이지가 받아 `merge` 하면 그 코스 조각에 다른 코스 문제 기록이 섞였다(허브 수학 진행도 부풀림). 바꾼 것:
  - gist 내용 = `{ format:'academy-sync-2', updatedAt, profile, courses:{id: academy.course.<id>}, tutor:{id: academy.tutor.<id>}, works }`. 받을 때 프로필·코스·대화·작품을 **각각 따로** 기존 `Sync.merge` 규칙으로 합친다(updatedAt·resetAt 은 프로필 것을 씀).
  - 옛 형식(맨 위에 `problems`)도 받는다: 문제·레슨·대화는 id 로 코스를 나누고, id 가 없는 코스 칸(체크업·타임어택 등)은 파이썬으로. 옛 버전 앱은 새 형식을 무시(덮어쓰기는 할 수 있음) — HTML 은 네트워크 우선이라 다음 열 때 새 버전.
  - 코스 구분 규칙 `CONFIG.COURSE_ID_PATTERNS`(validate 가 모든 id 가 자기 코스 규칙에만 맞는지 검사). `Store.untangle()` 이 `load()` 때마다 다른 코스 조각에 든 문제·레슨 기록을 제자리로 옮김(같은 문제가 양쪽에 있으면 상태·별이 나은 쪽). 이미 섞인 사용자 데이터도 다음에 열 때 정리된다.
  - 저장 키(`academy.*`)·조각 모양은 그대로 — 새 키 없음.
- **QA #5** 레슨 이어 보기: 지시서대로 저장된 `lessons[id].page` 를 쓰되, 저장값이 레슨 쪽 수를 넘으면(레슨이 줄어든 경우) 마지막 쪽으로 자름.
- **QA #32** 벡터 차 라벨: 지시서 C 는 「콘텐츠 `vecs` 라벨을 A·B 로」였지만 콘텐츠는 이미 A·B 였고 소문자는 `core/figure.js` vector `op:'diff'` 의 하드코딩 → 그림 글자·안내 모두 `vecs[i].label`(없으면 a·b) 사용.

### 15-2. 사용자 승인 `[core]` — 지시서에 없던 것 (2026-11-02 17:38 「전부 수정해」, Opus·단일 세션, 브랜치 `fix/core-e`)
- **QA #70** 힌트 칸 `.hint{white-space:pre-wrap}` — 여러 줄 코드 힌트(C7 이후 92개)의 줄바꿈·들여쓰기 유지. 여러 줄 힌트는 「힌트 n (단계)」 머리 다음 줄부터 시작(`renderHints`, 첫 줄만 들여쓰기가 어긋나던 것). 힌트 모달(`#fbHint`)은 머리가 없어 그대로.
- **QA #72** `Game.lessonDone`: **실전 레슨(`practical`)은 `project` 문제만 완료 조건**, 연습 문제(C8 EnP2)는 선택. 프로젝트가 없는 실전 레슨이면 예전대로 전부. 이미 프로젝트를 끝낸 학습자의 E2~E6 이 다시 잠기던 회귀 해소. 저장 데이터 변화 없음.
- **QA #73** 마스터 뱃지 `master_<course>` 판정 대상을 `q.project && practical` 로(뱃지 설명 「실전 프로젝트 전부」와 일치). 파이썬은 실전 문제가 전부 project 라 동작 동일.
- **QA #81** 지도 `.nodes{align-items:flex-start}` + 점선 `top:31px`(일반 노드 동그라미 중심 = 테두리 2 + 안쪽 여백 8 + 44/2 − 1). 보스가 같은 줄에 와도 일반 노드는 위에 붙고 점선이 동그라미를 지남.
- **QA #82** `plot` 탐침 글자: 그림 상자 안으로 고정(범위 밖이면 값 뒤에 ↑/↓), 겹치면 14px 씩 밀기, 탐침이 오른쪽 끝(130px 안)이면 글자를 왼쪽에. `unitcircle`: sin·cos 이름표를 파형 위(겹치던 곡선 시작점 피함), 파형 폭 200px 미만이면 눈금 0°·180°·360° 만.
- **QA #80** `transform` î·ĵ 이름표를 각 화살표 끝의 바깥쪽(왼쪽 끝이면 오른쪽 정렬, 위쪽이면 위로)에.
- **QA #88** `unitcircle` 아래 글자 sin·cos 값 `|v| < 0.005` → `0.00`(−0.00 방지). 탐침 값도 `|y| < 5e-5` → 0.
- **QA #89·#90**(사용자 제보 11/3, `fix/review-fresh`): `Views.problem` 에서 `fresh = inReview || inChallenge || session.timeAttack` 이면 저장된 답 대신 빈 기록(`sv = {}`)으로 편집기·Parsons·블록·수학 숫자/맞추기/짝을 채움(시작 코드부터). 저장·별·힌트 기록은 그대로라 진행 데이터 변화 없음. 모의고사는 세션 안에서 문제를 오가며 코드를 이어 써야 해서 제외. 일반 화면의 깬 문제 재열기(#66)는 설계 결정이라 손대지 않음.
- **QA #91**: 도전(`inChallenge`)·`fresh`·세션 화면에서는 클리어 뒤 「다음 문제」·「다음 레슨」을 만들지 않고, 왼쪽 「이전/다음 문제」도 숨김 — 세션 밖 일반 문제로 빠져 「이미 클리어 · XP 없음」이 뜨던 것. 도전 클리어 뒤에는 「오늘의 도전 완료 · 홈으로 · 더 복습하기」.
- **QA #92 「더 복습하기」**(사용자 요청): 새 화면 `Views.reviewMore` — 클리어한 문제(실전 프로젝트·모의고사 레슨 제외)를 `복습 단계 × 10 − 지난 날수(최대 9) + 무작위 0~6` 이 낮은 순으로 5개 → `Sessions.start(…, { inReview: true, extraReview: true })`. 복습 XP(`REVIEW_XP_BONUS_PER`)·`reviewsDone` 통계는 같지만 **`Review.afterReview` 는 부르지 않아 간격 반복 일정이 바뀌지 않음**(원할 때 하는 연습이 예정된 복습을 밀어내지 않게). 끝나면 「5문제 더?」 확인. 입구: 파이썬·알고 홈 복습 카드(클리어 1개 이상), 수학 홈 복습 카드, 도전 끝 화면.
- **QA #96 ⌨ 백문이불여일타(타자 연습, 사용자 요청 11/3, `feat/drills`)**: 코스 content.js 의 새 전역 `DRILLS`(형식은 PROBLEMS 의 code 문제 + `drill:true`, id `L<n>D<nn>` — `CONFIG.COURSE_ID_PATTERNS.python` 에 `D` 추가). `Content.init` 이 `problemMap` 과 `drillsByLesson` 에만 넣고 **PROBLEMS·byLesson 에는 넣지 않음** → 레슨 완료·진도 %·허브 총계·`clears` 통계·뱃지·오늘의 복습·도전·「더 복습하기」는 그대로(드릴 클리어는 `stats.drillClears`). `Content.drillsOf(lid)`·`allDrills()`. XP 는 `CONFIG.DRILL_XP`(5, 콤보 등 기존 배수 적용). 입구: 홈 복습 카드 밑 카드 → `Views.typing`(연 레슨을 챕터별 체크, `Store.data.lessons.typingSel` 에 기억, 챕터 체크로 묶어 넣고 빼기) → `Sessions.drillMix(lessonIds)`(안 친 것 먼저 섞어서 `CONFIG.DRILL_BATCH`=5개) · 레슨 요약 쪽 카드 → `Sessions.drill(lessonId)`. 드릴 화면은 무조건 텍스트(`decideMode`), 따라하기 코치 숨김(복사 버튼이 있어서), 편집기 `paste` 막음(토스트). 끝나면 「5문제 더?」. validate·extract·run_solutions 가 DRILLS 도 검사·실행(`load_content.mjs` 가 DRILLS 를 함께 읽음). `shuffle` 유틸(core/util.js) 추가.
- **QA #98·#99·#100**(파이썬 QA 5회전 11/3, `fix/qa-1103-python`): ① `core/runners/python.js` 워커 코드·메인 스레드 둘 다 실행 전 파일 준비 순서를 **결과 파일(`outFiles`) 지우기 → 업로드 파일(`files`) 쓰기**로(예전엔 반대라 이름이 겹치면 방금 쓴 입력이 지워짐, X3P1). ② `core/ui.css` 끝: 지문·레슨·퀴즈·튜터·결과 안 `code` 는 `white-space:normal; overflow-wrap:anywhere`(넘칠 때만 줄바꿈 — 짧은 코드는 예전처럼 한 줄), 줄 맞추기 조각 `.pz-tile code` 는 `pre-wrap`(들여쓰기 유지). 폰 390px·PC 1280px 에서 파이썬 레슨 쪽·문제·타자 연습 전부 가로 넘침 0.
- **QA #110·#111**(QA 6회전 11/3, `fix/qa-1103-round6`, CSS 만): `.quiz-code{max-width:100%;overflow-x:auto}` + `.pv-desc,.pv-work{min-width:0}` — 추적 퀴즈 코드의 긴 줄이 그리드 칸을 넓혀 폰 화면 전체가 가로로 밀리던 것(알고 A10P2·A12P2·A13P2), 이제 코드 상자 안에서만 가로 스크롤. `.pv-prompt>p:first-child{margin-top:0}` / `:last-child{margin-bottom:0}` — `<p>` 로 시작·끝나는 지문의 위아래 빈 줄. 콘텐츠 검사: `validate_content` 가 「이렇게 나오면 돼요」 `<pre>` 상자를 테스트 1 출력과 비교(줄 끝 공백 무시)하고, `quiz.why` 에 HTML 태그가 있으면 에러(해설은 이스케이프해서 보여 줌). 새 도구 `tools/e2e_submit/`(로컬 서버 + CPython 으로 Pyodide API 를 흉내 — CDN 없이 화면 제출까지 자동 검사).
- **QA #116 복습 고르기**(사용자 요청 11/4, `feat/review-plan`): `Review.plan({mode:'due'|'extra', lessonIds, n=CONFIG.REVIEW_SIZE})` — 후보 = 클리어한 문제(실전 프로젝트·모의고사 제외, 범위 안). 점수: 다시 볼 날이 됨 +40 + 밀린 날×1.5(30일까지) · 정답 보기 +15 · 틀림×6(5까지) · 힌트×7(3까지)(힌트 없으면 별 모자란 만큼×5) · 약한 주제(정답률 < 75%, 표본 3+) (0.75−정답률)×40 · extra 는 푼 지 오래된 날×0.5 · 가장 최근 챕터 +6·그 앞 +3 · 무작위 0~2. 하나씩 고르며 같은 챕터 −18·같은 레슨 −30. due 모드는 다시 볼 날이 된 것만, 모자라면 약점 있는 문제로 채움(「약점 보강」 표시). 이유 문장은 점수 항목에서 최대 3개. `Views.review`·`Views.reviewMore` 는 `Views.reviewPlan` 미리보기(범위 `Store.data.lessons.reviewSel`, 🔄 다시 고르기) → `Sessions.start(…, { reasons })`. 문제 화면 `.rv-in` 「왜 나왔나」. `Sessions.reviewSummary` 가 끝 요약(보너스 규칙 그대로). **`Views.problem` 의 `hv`**: 복습·도전·타임어택·타자(`fresh`)는 힌트·정답 보기 상태를 이번 것만(`{hints:0, answerSeen:false}`)으로 시작, 연 것은 진짜 기록에도 `max` 로 남김. `Review.afterReview(p, 이번에 안 틀림, 이번 힌트 수)` — 예전엔 누적 힌트 수라 한 번 힌트 본 문제가 계속 1일 간격이던 버그. 틀린 뒤 맞혀도 복습 1개로 셈(단계 0 = 내일). `CONFIG.REVIEW_SIZE` 5.
- **QA #140 지문 속 연속 공백**(릴리스 검수 11/5, Fable, CSS 한 줄): `.pv-prompt code,.lp-html code,.quiz code,.tutor-panel code,.result code` 의 `white-space:normal` → `pre-wrap`. #99 때 긴 코드를 줄바꿈하려고 `normal` 로 바꿨는데 그러면 `"  " * depth`(A6D14)·`"안녕   파이썬"`(L20D04) 의 연속 공백이 한 칸으로 합쳐져 보이는 대로 치면 틀렸음. `pre-wrap` 은 줄바꿈·공백을 살리면서 `overflow-wrap:anywhere` 로 긴 줄도 접힘. 전 코스 인라인 `<code>` 중 줄바꿈·앞뒤 공백이 든 것은 4곳뿐이고 전부 공백을 살려야 하는 자리라 안전.
- **QA #148 복습 후보 기준 통일**(Fable 검토 + 수정): `Review.reviewable(p)` = 실전 프로젝트·모의고사·타자 연습 제외. `clearProblem` 이 일정(`review`)을 붙일 때, `Review.due()`, `candidates()` 가 전부 이 기준을 씀. 옛 저장에 남은 프로젝트·타자 일정은 `Review.prune()`(`due()` 가 부를 때 한 번)이 지워 허브 큐(`hub.js reviewDue` 는 콘텐츠 없이 저장만 봄)와 홈 숫자가 맞게.
- **QA #149 복습 고르기 나머지 11건**(릴리스 검수 11/5, Fable, `release/v2.7.0`): `Review.plan` 은 **묶음 순서**로 고른다 — due 모드 ① 다시 볼 날이 된 문제 전부(챕터 고르게) → ② 모자랄 때만 약점 문제(「약점 보강」); extra 모드(더 복습하기) ① 다시 볼 날이 **안 된** 클리어 문제(약점·오래된 순) → ② 없을 때만 날 된 문제(예전엔 날 된 문제 +40 때문에 오늘의 복습과 같은 목록). `candidates([])` 는 「아무것도 안 고름」(null 만 전체 → 「전체 해제」가 전체였던 것). 범위는 모드별로 `lessons.reviewSel`(오늘)·`reviewSelExtra`(더) 따로. 「🔄 다시 고르기」는 직전 목록을 `avoid` 로 넘겨 각 묶음의 맨 뒤로(후보가 그것뿐이면 토스트). **약점 점수 감소**: `Review.noteResult(p, 안 틀림, 이번 힌트)` 가 `rec.reviewOk`(복습에서 연달아 한 번에 맞힌 횟수)를 올리고 plan 이 약점 점수에 0.5^reviewOk 를 곱함 — 오늘의 복습(`afterReview` 안)·더 복습하기·약점 복습 모두. **하루 보너스**: `afterReview` 가 날짜가 바뀌면 `reviewToday.bonus` 도 false 로(예전엔 첫날만). **별·XP 의 힌트 기준(결정)**: `Game.clearProblem` 은 `max(이번 힌트, rec.hints)` 로 별·`HINT_XP_MULT` 를 계산 — 복습·도전·타임어택이 힌트 창을 접고 시작(#89·#90 「빈 상태」)하는 건 그대로지만, 예전에 힌트 3개 보고 푼 문제를 거기서 다시 풀어 별 3·XP 전액을 받던 구멍을 막음(정답 보기 `answerSeen` 이 이미 평생 기준이라 그와 맞춤; 일반 화면도 `hv===rec` 라 원래 평생 기준). 콤보·복습 간격은 이번 힌트만. 타임어택 안내 「별점에는 영향이 없고」가 이제 사실. **약점 분석 「가장 약한 개념 복습」**: 정답률 낮은 주제부터 클리어 문제가 있는 첫 주제를 골라 `plan({mode:'weak', only})` 로 약점 순 최대 3개 + 「왜 나왔나」(예전엔 무작위 3개, 클리어 0인 주제면 토스트만). CSS: `.modal` 이 `max-height:calc(100dvh−32px)` 플렉스 열 + `.modal-body` 만 스크롤(폰 「아주 크게」 끝 요약 버튼이 화면 밖), `.rv-row .warn` 은 `--gold`(라이트 2.27:1, v2.6.0 뒤 3.8:1) 대신 `--muted`(5.4:1 / 다크 5.5:1; `--gold` 는 힌트·별 전용 토큰). 남은 것: `.ok`(`--success` 라이트 #1e8e3e) 가 흰 바탕에서 4.2:1 로 AA 에 살짝 못 미침 — 전역 토큰이라 이번엔 안 건드림.
- **QA #150~#153 실행기**(Fable 검토 + 수정): ① 워커 출력은 처음 200번 write 와 50ms 마다 바로 보내고 그 뒤만 8KB 묶음 — 시간 초과·⏹ 로 워커가 꺼져도 앞 출력(`print("시작")`)이 남음(300k 줄 → 메시지 275개). ② stderr 를 보내기 전 stdout 을 먼저 보내 순서 유지. ③ 엔진 준비 뒤 `sys.stdout/stderr.reconfigure(line_buffering=True)`(실패해도 무시) — 진짜 Pyodide 가 블록 버퍼여도 줄마다 넘어오게. ④ `Grader.expected()` 는 멈춤·시간 초과·상한 결과를 캐시하지 않고(#151) `runTests` 가 그 테스트를 「다시 제출」로 기록하고 중단(#153), 직접 멈춘 건 `tle` 기록 아님(#154). ⑤ 메인 스레드 실행기(워커 없음)는 `stop()` 이 false 를 돌려주고 멈추기 버튼도 안 띄움(#152 — restart 하면 영구 정지). ⑥ 멈추기 버튼은 0.8초 한 번이 아니라 실행이 끝날 때까지 200ms 마다 busy 를 확인(#153 — 엔진 재시작 중엔 busy 가 늦게 켜짐).
- **QA #120~#122 편집기·레슨 창**(사용자 제보 11/4, PR #63) — 왜 그렇게 했나: ① #120 세션(타자·복습·도전·모의고사) 중 「레슨 설명 보기」는 화면을 떠나지 않고 **창(`UI.lessonPeek`)** 으로 — 레슨 화면으로 가면 세션과 치던 코드가 끊기고, 돌아와도 「이미 클리어」로 열리던 것. 예제는 코드 상자만(실행은 레슨 화면에서 — 창 안에서 실행기·거북이까지 띄우면 뒤 문제의 출력과 섞임). ② #121 줄 앞 공백에서 백스페이스 한 번 = 4칸 — 초보자가 3칸·5칸을 만드는 가장 흔한 경로가 「백스페이스를 몇 번 눌렀는지 세기」라서, 공백이 아닌 글자 앞에서는 평소대로 한 글자. ③ #122 줄 앞 공백을 한 칸마다 점(`.cm-lead`)으로 — 공백은 보이지 않아 4칸인지 셀 수 없음. 4의 배수가 아니면 빨간 바탕(`.cm-lead-odd`), 기본 편집기(textarea)는 점을 못 그려 커서 줄의 「들여쓰기 n칸」 글자(`.ted-ind`)로 대신.
- **출력 상한·묶음·⏹ 멈추기 (QA #123·#150~#154, `core/runners/python.js` 워커 소스)**: 한 번 실행의 stdout 은 `CONFIG.MAX_OUTPUT_CHARS`(100만 **글자** — 바이트가 아니라 `TextDecoder` 로 푼 길이, 메인 스레드 실행기도 같음) 를 넘으면 `write` 가 `code:'EIO'` 를 단 에러를 던져 파이썬 쪽엔 `OSError` 로 끊기고 결과는 `outputLimit:true`(화면엔 「출력이 너무 많아서 멈췄어요」). 채점(`runTests`)은 `max(상한, (입력+기대 출력)×2)`, 정답 기대값·큰 입력 만들기는 상한 없음(`maxOut:0`). 워커는 출력을 **처음 200번 write 와 50ms 마다는 바로** 보내고 그 뒤만 8KB 씩 묶어 보냄(수십만 번 postMessage 로 화면이 굳던 것 ↔ 시간 초과·멈추기로 워커가 꺼져도 앞 출력이 남게). stderr 는 묶지 않고 보내되 그 전에 stdout 을 flush 해 순서 유지. ⏹ 멈추기(`UI.stopButton`)는 실행이 0.8초를 넘고 `Py.busy` 면 출력 상자 위에 생기고(문제·채점·놀이터·레슨 예제·수학 계산기 전부), 누르면 `Py.stop()` = 워커 `terminate` → `restart()` → 대기 중 작업은 `stopped:true` 로 끝남, 멈춘 직후의 실행은 「엔진 준비…」 안내를 첫 출력에 지움(`UI.outClear`). 메인 스레드 실행기는 끊을 수 없어 버튼 없음(#152).
- **QA #155~#159 편집기·레슨 창 나머지**(릴리스 검수 11/5, Fable): ① #155 문제 화면 `keyHandler` 첫 줄 `if ($('.modal-ov')) return;` — 레슨 창 위에서 Ctrl+Enter·Ctrl+Shift+Enter·Ctrl+/ 가 뒤 화면을 실행·채점·힌트 소모하던 것. ② #156 기본 편집기의 Tab·Enter·백스페이스 4칸·⇤·`:` 자동 내어쓰기·칩 입력을 전부 `TextEditor.taEdit`(`setSelectionRange` + `execCommand('insertText'|'delete')`)로 — `ta.value=` 는 브라우저 실행 취소 기록을 지움. 실패하는 환경은 예전 방식(그때만 input 이벤트를 직접 대신함). ③ #157 레슨 창에 `scene`·그림(`Fig.mount` static, 「그림은 레슨 화면에서」)·식(`MathUI.formula`) — 레슨 화면과 같은 재료. ④ #158 `.ted-ta,.ted-gutter{padding-bottom:2em}`(표시 높이만큼, 줄 번호 칸도 같이 스크롤 길이를 맞춤) + 예제 편집기 높이에 그만큼 더함(`:has(.ted-fb)` — CodeMirror 가 뜨면 불필요). ⑤ #159 칸 수 표시는 `taEdit`·`setValue`·`moveCursor` 뒤에도 갱신 · Ctrl/Alt/Cmd+⌫·Tab·Enter 는 브라우저 기본 · `isComposing`/keyCode 229 면 건너뜀 · 괄호 안 이어 쓰는 줄(`bracketDepths`, 문자열·주석 속 괄호는 대충 걷어냄)·공백뿐인 줄은 빨강 아님 · `.modal` 을 `max-height:100vh-32px` 세로 flex 로(본문만 스크롤, 제목 안 잘림) · Esc 는 select·input 에 포커스가 있어도 가장 위 창을 닫음 · 창 닫으면 열기 전 `activeElement` 로 포커스 복원 · terminal-git 코스는 `Py` 가 없어 `Loader.init`·초기 `Py.start()`·`UI.stopButton` 에 `typeof Py` 가드. ⑥ 가짜 Pyodide(`tools/e2e_submit`)는 CPython 쪽에서 stdout·stderr 조각을 쓴 순서대로 돌려주고(`chunks`) 그 순서대로 `write` — stderr 끼어드는 순서를 흉내(8KB 묶음은 워커 코드가 진짜라 그대로 검사됨).

## 16. 코스 플러그인 계약 — 새 코스가 core 에 붙는 자리 (2026-11-05, v2.7.0 뼈대)

사용자 결정(11/5): 터미널·Git / 데이터베이스(SQL) / 웹·HTTP·API 는 **Fable 이 뼈대(엔진·화면·문제 유형·샘플 레슨 1개·검증)**를 세우고 **살(본문·문제)은 Opus(콘텐츠팀)**가 채운다. 코스마다 core 를 고치지 않도록 core 는 아래 등록부만 제공하고, 코스 모듈(`core/ui-views-<코스>.js` + `core/runners/<러너>.js`)이 등록한다.

- **문제 유형** `UI.modes[type] = { label, instant?, mount(host, p, ctx) }` — `p.type` 이 등록돼 있으면 `Views.problem` 이 작업판(`#pvMode`)을 그 플러그인에 맡긴다. `mount` 는 `{ getCode(), submit?(), destroy?() }` 를 돌려준다. `ctx = { pid, rec(저장된 내 답 {code, mode}; 복습·도전은 빈 값), fresh, inMock, lesson, submit(result) }`, `result = { ok, msg(실패 설명 html), detail(성공 시 결과 상자 html) }`. 저장(`Store.setCode`)·XP·별·콤보·뱃지·다음 문제·힌트·「정답 보기」(`p.solution` 문자열 그대로)·선생님·복습 세션은 core 가 그대로 처리한다. 제출 버튼 id 를 `btnGrade` 로 두면 Ctrl+Shift+Enter 가 `submit()` 을 부른다. `instant: true` 면 즉시 채점형(퀴즈처럼 지문 아래 한 화면).
- **레슨 예제** `UI.examples[kind] = { mount(host, example, ctx) }` — `pages[].example` 이 `{ shell: … }`·`{ sql: … }`·`{ web: {html, css, js} }` 처럼 등록된 kind 키를 가지면 그 플러그인이 `.ex2.ex-plugin` 자리에 그린다(`{ code }` 는 파이썬 기존 경로). `UI.exampleKind(example)` 로 판별.
- **준비 중 레슨** `draft: true` — 홈 카드·트리·미리보기 「준비 중」(disabled), `validate_content` 가 본문 검사를 건너뛰고 ⚠ 로 센다. 본문·문제를 채우면 `draft` 를 지운다.
- **허브 미리보기** `CONFIG.COURSES[].preview: true` — `ready` 가 아니어도 카드가 열린다(「준비 중 · 미리보기 열림」). 콘텐츠가 다 차면 `ready: true, total, lessons` 로 바꾸고 `preview` 를 지운다.
- **코스별 검증** `tools/validate/<코스>.mjs` 의 `export default (course, { err, warn })` — 있으면 `validate_content` 가 부른다. 정답 실행 검증은 코스가 자기 도구를 둔다(셸: `tools/run_shell_solutions.mjs`, SQL: `run_solutions.py` 의 sqlite3, 웹: `regress.py` 의 Playwright 검사).
- **id 규칙** `CONFIG.COURSE_ID_PATTERNS`: terminal-git `T0`·`TB1`·`T0P1`, sql `S0`·`SB1`·`S0P1`, web `W0`·`WB1`·`W0P1`.
- 코스 폴더: `courses/<id>/course.json`·`index.html`(python 것을 복사해 러너·코스 모듈 스크립트만 바꿈, `Py` 를 안 쓰는 코스는 `typeof Py` 가드가 core 에 있음)·`content.js`(전역 const: COURSE·CHECKUPS·WEAKNESS_TAGS·CHAPTERS·LESSONS·PROBLEMS·DRILLS=[]).
