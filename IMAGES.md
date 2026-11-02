# IMAGES — 아트 리소스 요청서 (ChatGPT 이미지 생성용)

> 이 파일은 **그림을 만들어 주는 쪽(ChatGPT 등)** 이 읽는 요청서다. 아래 「요청 목록」의 항목을 하나씩 만들어 **`assets/img/` 폴더에 정확한 파일 이름으로 저장(커밋)** 하면, 사이트가 자동으로 그 그림을 쓴다(없으면 지금처럼 이모지로 표시 — 그림이 빠져도 사이트는 깨지지 않는다).
> 사이트: 파이썬 아카데미 — 초보자용 **무료** 코딩 학습 사이트 (한국어, 10대~성인). 다크 테마가 기본, 라이트 테마도 있음.

## 1. 공통 규칙 (모든 그림)

| 항목 | 규칙 |
| --- | --- |
| 형식 | **PNG, 배경 투명**. 요청에 적힌 크기(정사각형이면 512×512). JPG·배경 흰색 금지(다크 테마에서 네모가 생김) |
| 스타일 | **플랫 벡터풍 / 둥근 스티커 느낌**, 굵은 윤곽선(어두운 남색 #1d2230, 흰색 아님), 색은 밝고 선명하게 — 사이트 팔레트: 파랑 `#6c8cff`, 초록 `#2bb673`, 노랑 `#ffd166`, 빨강 `#ff5d6c`, 주황 `#ffb347`, 보라 `#9c27b0`. 그라데이션·사진풍·3D 렌더·과한 질감 금지 |
| 대비 | 어두운 배경(#0f1117)과 밝은 배경(#f4f6fb) **둘 다에서** 보이도록: 바깥 윤곽선은 어두운 색 + 안쪽에 얇은 밝은 테두리, 또는 흰색이 바깥에 닿지 않게 |
| 내용 | 글자(텍스트) 넣지 않기. 실제 브랜드·캐릭터·사람 얼굴 금지(전부 창작). 폭력·무서운 표정 금지 — 보스도 "귀여운 악당" |
| 여백 | 캔버스 가장자리 8% 비우기(둥근 카드에 잘려도 안 깨지게). 한 장에 한 소재 |
| 저작권 | 이 사이트(무료 교육)에서 자유롭게 쓸 수 있는 **생성 이미지**만. 저작권 있는 소재 참조 금지 |
| 납품 | `assets/img/<파일이름>` 으로 저장. 여러 후보를 만들었으면 `<파일이름>.alt1.png` 처럼 붙여서 함께. 이 파일의 「상태」 칸을 `✅ 완료`로 바꾸고 한 줄 메모 |

프롬프트는 영어로 적어 두었다(생성기가 영어를 더 잘 알아듣는다). 한국어 설명은 의도 확인용.

## 2. 완료된 그림 (검수 통과 ✅ — 42장, v2.2.26 기준. 3차 챕터 장식 13장 검수: 2026-11-02 — 흰 테두리 없음, 32px에서 전부 식별 가능, 지도 렌더 확인. **스타일 기준**: 새 그림은 이 세트와 나란히 놓았을 때 한 작가가 그린 것처럼 보여야 한다)

| 파일 | 내용 | 쓰이는 곳 |
| --- | --- | --- |
| `course-python.png` `course-algo.png` `course-terminal-git.png` `course-sql.png` `course-web.png` | 뱀+노트북 · 부엉이+나침반 · 고양이+터미널 · 코끼리+캐비닛 · 여우+지구본 | 허브 코스 카드 48px, 공유 카드 |
| `boss-python-1~5.png` `boss-algo-1~4.png` | 꼬마 괴물 종족(보라 물음표·파랑 주사위·주황 가계부·보라 세 팔·빨강 왕관 / 초록 괄호·파랑 돋보기·주황 미로·보라 감독관) | 보스 HP 패널 56px, 지도 보스 노드 40px |
| `badge-master_python.png` `badge-master_algo.png` | 왕관 쓴 뱀·부엉이 금메달 | 뱃지 화면, 공유 카드 |
| `hero-hub.png` (1200×274로 잘라 둠) | 마스코트 5마리 + 코드 블록 | 허브 맨 위 배너 |
| `empty-works.png` | 이젤 위 새싹 + 붓 든 뱀 | 내 작품 빈 화면 |
| `chapter-python-0.png` | ✅ 완료 — 출발 깃발(초록) | 홈 지도 파이썬 0 시작 제목 옆 32px |
| `chapter-python-1.png` | ✅ 완료 — 새싹 화분 | 홈 지도 1 첫걸음 제목 옆 32px |
| `chapter-python-2.png` | ✅ 완료 — 파란 회오리 화살표(반복) | 홈 지도 2 반복과 묶음 제목 옆 32px |
| `chapter-python-3.png` | ✅ 완료 — 주황 상자 3개 쌓임 | 홈 지도 3 데이터 다루기 제목 옆 32px |
| `chapter-python-4.png` | ✅ 완료 — 보라 톱니바퀴 2개 | 홈 지도 4 더 큰 프로그램 제목 옆 32px |
| `chapter-python-5.png` | ✅ 완료 — 분홍 리본 메달 | 홈 지도 5 마무리 제목 옆 32px |
| `chapter-python-6.png` | ✅ 완료 — 금 트로피 | 홈 지도 6 실전 제목 옆 32px |
| `chapter-python-7.png` | ✅ 완료 — 청록 망원경 | 홈 지도 7 한 걸음 더 제목 옆 32px |
| `chapter-algo-1.png` | ✅ 완료 — 초록 나침반 | 홈 지도 알고 1 들어가기 제목 옆 32px |
| `chapter-algo-2.png` | ✅ 완료 — 파란 돋보기 + 막대 3개 | 홈 지도 2 찾고 정렬하기 제목 옆 32px |
| `chapter-algo-3.png` | ✅ 완료 — 주황 사슬 고리 3개 | 홈 지도 3 연결된 구조 제목 옆 32px |
| `chapter-algo-4.png` | ✅ 완료 — 보라 퍼즐 조각 | 홈 지도 4 패턴 제목 옆 32px |
| `chapter-algo-5.png` | ✅ 완료 — 금 트로피(파이썬 6과 같은 것 재사용 가능 — 같은 파일 복사) | 홈 지도 5 실전 제목 옆 32px |
| `chapter-algo-6.png` | ✅ 완료 — 파이썬 7(청록 망원경)과 짝 — **청록 쌍안경**(#00acc1 계열). 2절 챕터 장식 13장과 같은 작가 느낌 | 홈 지도 알고리즘 6 「한 걸음 더」 제목 옆 32px |
| `boss-python-7.png` | ✅ 완료 — **청록 꼬마 괴물**이 확성기(알림)와 돋보기(정규식)를 듦, 어깨에 달력 조각 | 파이썬 챕터 7 보스 「학교 알림 메시지 분석기」 HP 패널 56px·지도 PC 78px·모바일 104px |
| `boss-algo-6.png` | ✅ 완료 — **남색+청록 꼬마 괴물 사령관**이 군모를 쓰고 자물쇠 달린 암호 두루마리를 듦, 뒤에 0·1 느낌의 작은 점 무늬(글자 금지 → 점·사각형으로) | 알고리즘 챕터 6 보스 「암호 해독 사령부」 HP 패널 56px·지도 PC 78px·모바일 104px |
| `badge-first_run.png` | ✅ 완료 — 첫 실행 | 뱃지 56px·공유 카드 48px |
| `badge-first_clear.png` | ✅ 완료 — 첫 클리어 | 뱃지 56px·공유 카드 48px |
| `badge-first_error.png` | ✅ 완료 — 첫 에러 | 뱃지 56px·공유 카드 48px |
| `badge-error_10.png` | ✅ 완료 — 에러 극복 | 뱃지 56px·공유 카드 48px |
| `badge-fail5_clear.png` | ✅ 완료 — 끈기 | 뱃지 56px·공유 카드 48px |
| `badge-grad_block.png` | ✅ 완료 — 블록 졸업 | 뱃지 56px·공유 카드 48px |
| `badge-grad_parsons.png` | ✅ 완료 — Parsons 졸업 | 뱃지 56px·공유 카드 48px |
| `badge-playground.png` | ✅ 완료 — 자유 코딩 | 뱃지 56px·공유 카드 48px |

**검수 메모(4차 A·B·C-1)**: 11장 ✅ 완료. 챕터·보스 512×512, 뱃지 256×256 RGBA. 사방 8% 이상 여백과 `python3 tools/img_clean.py --check` 통과. 다크/라이트 배경에서 챕터 32px·보스 40/56px 및 최신 지도 78/104px·뱃지 48/56px 축소본 확인. 생성 프롬프트는 `assets/img/README.md`.

**검수 메모(3차 A)**: 챕터 장식 13장(파이썬 0~7·알고 1~5) ✅ 완료. 512×512 RGBA, 사방 8% 이상 여백, `img_clean.py --check` 통과. 다크/라이트 배경에서 32px 축소본 확인. A12 트로피는 A7과 같은 파일 복사. 생성 프롬프트는 `assets/img/README.md`.

**검수 메모(2차)**: 2차 16장 중 6장(알고·SQL·웹 아이콘, 빈 작품, 알고 마스터 뱃지, 배너)에 **흰 스티커 테두리**가 있어 다크 테마에서 흰 띠로 보였음 → `tools/img_clean.py`로 투명 배경에 닿은 흰~회색 테두리를 지워 해결(내부 흰색은 윤곽선에 막혀 유지). 앞으로는 납품 전에 `python3 tools/img_clean.py --check`로 확인하고, 테두리가 있으면 `python3 tools/img_clean.py`(인자 없음)로 정리한 뒤 커밋. 배너는 아래 빈 공간을 잘라 1200×274가 됨 — 가로 배너는 **내용이 캔버스를 꽉 채우게** 그리는 편이 좋다.

## 3. 요청 목록 — 4차 잔여 (C-2~C-7 뱃지 38장)

규칙은 1절 + 2절 검수 메모(흰 테두리 금지 — 바깥 윤곽선은 어두운 남색 `#1d2230`으로 끝나야 함). A·B·C-1은 2절에 납품 완료. 다음은 **C-2부터** 순서대로 나눠 납품해도 된다(파일이 있는 것만 자동으로 쓰인다).

공통 영어 베이스 프롬프트(모든 항목 앞에 붙임):
> Flat vector sticker-style icon, bold dark navy (#1d2230) outline, bright clean colors (palette: blue #6c8cff, green #2bb673, yellow #ffd166, red #ff5d6c, orange #ffb347, purple #9c27b0), no text, no letters, no gradients, no 3D, no photo texture, transparent background, single subject centered with 8% empty margin, no white halo or white border around the shape, matching a consistent set of simple educational game icons. —

### C. 남은 뱃지 38장 (256×256) — 뱃지 화면 56px·프로필 공유 카드 48px. 2절 `badge-master_python.png`(왕관 쓴 뱀)·`badge-master_algo.png`(부엉이 금메달)와 같은 **둥근 메달/스티커** 느낌. 비밀 뱃지(C-7)도 획득 후에는 그림이 보이므로 만든다. 작은 크기에서 보이게 **소재 1개 + 큰 실루엣**, 가는 선 금지

파일 이름은 `badge-<id>.png`. 아래 표의 id를 그대로 쓴다(예: `badge-nohint3.png`).

**C-2. 자립·정확도 (6장)**

| id | 뱃지 | 조건(의도) | 프롬프트(베이스 뒤에) |
| --- | --- | --- | --- |
| nohint3 | 자립 | 힌트 없이 3연속 | a round green medal with a compass rose, 256×256 |
| nohint10 | 독학왕 | 힌트 없이 10연속 | a round green medal with a graduation cap and a small star, 256×256 |
| firsttry10 | 한 번에 | 첫 시도 클리어 10회 | a round blue medal with a target and one arrow in the bullseye, 256×256 |
| firsttry30 | 명사수 | 첫 시도 클리어 30회 | a round blue medal with a bow and three arrows in the bullseye, gold rim, 256×256 |
| lesson3star | 완벽한 레슨 | 한 레슨 전부 별 3개 | a round yellow medal with one big shining star, 256×256 |
| lesson3star5 | 별 수집가 | 별 3개 레슨 5개 | a round yellow medal with a small jar full of stars, 256×256 |

**C-3. 콤보·연속·목표 (8장)**

| id | 뱃지 | 조건(의도) | 프롬프트(베이스 뒤에) |
| --- | --- | --- | --- |
| combo10 | 콤보 10 | 콤보 10 | a round orange medal with a single flame, 256×256 |
| combo20 | 콤보 20 | 콤보 20 | a round red medal with a big flame and a burst, 256×256 |
| streak3 | 3일 연속 | 3일 연속 학습 | a round orange medal with a small calendar showing three marked days as three dots in a row, 256×256 |
| streak7 | 7일 연속 | 7일 연속 학습 | a round orange medal with a calendar and a flame on top, 256×256 |
| streak30 | 30일 연속 | 30일 연속 학습 | a round gold medal with a trophy and a calendar page, 256×256 |
| daily7 | 목표 달성 7회 | 일일 목표 7번 | a round green medal with a calendar page and a big checkmark, 256×256 |
| review10 | 기억 유지 | 복습 10개 완료 | a round purple medal with a friendly brain with a small sparkle, 256×256 |
| explore10 | 탐험가 | 예제를 고쳐서 10번 실행 | a round teal medal with a microscope, 256×256 |

**C-4. 보스·퍼펙트·완주 (12장)** — 보스는 2절 보스 종족 얼굴을 **작게 메달 안에**, 퍼펙트는 같은 금메달에 **리본 색만** 바꿔 구분(1 파랑·2 초록·3 주황·4 보라·5 빨강)

| id | 뱃지 | 조건(의도) | 프롬프트(베이스 뒤에) |
| --- | --- | --- | --- |
| boss1 | 보스 1 | 챕터 1 보스 | a round bronze medal with a tiny purple cute monster face with question-mark horns in the center, 256×256 |
| boss2 | 보스 2 | 챕터 2 보스 | a round bronze medal with a tiny blue cute monster face with dice-pattern horns, 256×256 |
| boss3 | 보스 3 | 챕터 3 보스 | a round silver medal with a tiny orange cute monster face with coin horns, 256×256 |
| boss4 | 보스 4 | 챕터 4 보스 | a round silver medal with a tiny purple three-armed cute monster face, 256×256 |
| boss5 | 보스 5 | 챕터 5 보스 | a round gold medal with a tiny red cute monster face wearing a crown, 256×256 |
| perfect1 | 퍼펙트 1 | 챕터 1 힌트 없이 한 번에 | a round gold medal with a big "first place" style laurel wreath and a blue (#6c8cff) ribbon, no numbers, 256×256 |
| perfect2 | 퍼펙트 2 | 챕터 2 | same gold laurel medal with a green (#2bb673) ribbon, 256×256 |
| perfect3 | 퍼펙트 3 | 챕터 3 | same gold laurel medal with an orange (#ffb347) ribbon, 256×256 |
| perfect4 | 퍼펙트 4 | 챕터 4 | same gold laurel medal with a purple (#9c27b0) ribbon, 256×256 |
| perfect5 | 퍼펙트 5 | 챕터 5 | same gold laurel medal with a red (#ff5d6c) ribbon, 256×256 |
| all_clear | 완주 | 모든 문제 클리어 | a round gold medal with a checkered finish flag, 256×256 |
| checkup | 종합 점검 통과 | 종합 점검 80% 이상 | a round blue medal with a clipboard and a big checkmark, 256×256 |

**C-5. 알고리즘 (4장)**

| id | 뱃지 | 조건(의도) | 프롬프트(베이스 뒤에) |
| --- | --- | --- | --- |
| algo_viz10 | 눈으로 보는 사람 | 시각화 10번 재생 | a round blue medal with a big friendly eye looking at three small bars, 256×256 |
| algo_tle | O(n²)에서 O(n log n)으로 | 시간 초과 뒤 통과 | a round orange medal with a stopwatch and a small lightning bolt, 256×256 |
| algo_mock | 모의고사 통과 | 코딩테스트 모의고사 통과 | a round green medal with an exam paper and a pencil, 256×256 |
| algo_boss4 | 알고리즘 탐험가 | 알고리즘 보스 4개 | a round teal medal with a compass and a small owl head (matching the algorithm course owl mascot), 256×256 |

**C-6. 창작·기타 (4장)**

| id | 뱃지 | 조건(의도) | 프롬프트(베이스 뒤에) |
| --- | --- | --- | --- |
| theme | 분위기 전환 | 테마 바꿈 | a round medal split half dark navy half light with a sun on one side and a crescent moon on the other, 256×256 |
| works3 | 창작자 | 내 작품 3개 저장 | a round purple medal with an artist palette and brush, 256×256 |
| turtle5 | 거북이 화가 | 거북이 그림 5개 저장 | a round green medal with a cute turtle holding a paintbrush, 256×256 |
| tutor10 | 질문으로 돌파 | 선생님에게 물은 뒤 스스로 클리어 10회(현재 선생님 기능 꺼짐 — 후순위) | a round blue medal with a speech bubble containing a lightbulb, 256×256 |

**C-7. 비밀 뱃지 (4장)** — 획득 전엔 ❔로 가려지고, 획득하면 그림이 보인다

| id | 뱃지(획득 후 이름 없음) | 조건(의도) | 프롬프트(베이스 뒤에) |
| --- | --- | --- | --- |
| secret_hello | ??? | print("안녕") 100번 | a round yellow medal with a waving hand and a tiny speech bubble (empty, no text), 256×256 |
| secret_night | ??? | 자정~새벽 4시 클리어 | a round dark navy medal with a crescent moon and two stars, light inner rim so it reads on dark backgrounds, 256×256 |
| secret_fast | ??? | 타임 어택 5문제 60초 | a round yellow medal with a big lightning bolt, 256×256 |
| secret_turtle | ??? | 거북이로 선 100개 | a round green medal with a turtle leaving a long spiral trail, 256×256 |

**납품 체크리스트 (4차)**: 파일을 `assets/img/`에(뱃지는 256×256, 나머지 512×512) → `python3 tools/img_clean.py --check`(문제 있으면 인자 없이 실행해 정리) → 이 파일 2절 표로 옮기고 3절에서 지운다 → `core/config.js` `APP_VERSION` 패치 +1 → `node tools/stamp.mjs` → `CHANGELOG.md`·`HANDOFF.md` 상태판 한 줄 → 커밋. 뱃지는 나눠서 납품해도 되고, 납품할 때마다 같은 절차.

### D. 수학 공간 (v2.3.0 M1 완료 — **이제 만들어도 됨**, 자리 있음)

| # | 파일 | 쓰이는 곳 | 설명 |
| --- | --- | --- | --- |
| D1 | `course-math.png` | 허브 「공간」 구역 수학 공간 카드 48px | 박사모 쓴 거북이(느리지만 확실히)가 자와 컴퍼스를 듦 — 코스 아이콘 5장과 같은 작가 느낌, 512 |
| — | ~~gear-cap.png~~ | 박사모는 SVG 로 구현됨(core/fx.js gradcap) — 만들지 않음 | |
| D2 | `area-math-1.png` `area-math-3.png` `area-math-5.png` | 지식 지도 영역 제목 옆 32px (챕터 장식과 같은 자리·크기 규칙) | 1: 초록 주판 또는 숫자 블록 · 3: 주황 주사위 두 개 · 5: 파랑 화살표(벡터) 두 개가 평행사변형을 이룸. 512, 챕터 장식 13장과 같은 스타일. 영역 2·4·6은 M2·M3 뒤 요청 |

## 4. 그 뒤 (자리 없음 — 만들지 말 것)

| 파일 | 크기 | 쓰이는 곳 | 메모 |
| --- | --- | --- | --- |
| `mascot-<stage>-<color>.png` | 512 | 상단바·프로필 마스코트(지금은 코드로 그린 SVG, 색·장비를 사용자가 고름) | 색·장비 조합이 많아 SVG가 유리 — 그림으로 바꿀지 미정 |
| `lesson-<course>-<id>.png` | 640×360 | 레슨 첫 페이지 머리 그림 | 레슨 수가 많아(52) 후순위 |

## 5. 사이트 쪽 연결 (개발 메모)

- `assetUrl(name)`(core/util.js)이 허브/코스 페이지 어디서든 `assets/img/<name>`의 올바른 상대 경로를 돌려준다. `UI.img(name, fallbackEmoji, cls)`는 `<img>`를 만들고, 파일이 없으면 `onerror`로 이모지 `<span>`으로 바뀐다 → 그림이 없어도 화면 그대로.
- 그림 자리(파일이 있으면 자동 표시): 허브 코스 카드 `course-<courseId>.png`(48px) · 허브 배너 `hero-hub.png`(없으면 영역 자체가 없음) · 보스 HP 패널(56px)과 지도 보스 노드(40px) `boss-<courseId>-<챕터번호>.png` · 뱃지 화면 `badge-<badgeId>.png`(56px, 전 뱃지) · 내 작품 빈 화면 `empty-works.png`.
- 새 그림을 쓰는 자리를 추가할 때는 이 파일 3절에 요청을 적고, 코드에서 `UI.img(...)`로 바꾼다. `tools/stamp.mjs`가 `assets/img/*.png`를 오프라인 캐시 목록에 넣는다.
