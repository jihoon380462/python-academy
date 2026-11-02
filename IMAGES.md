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

## 2. 완료된 그림 (검수 통과 ✅ — 90장, v2.3.3 기준. 3차 챕터 장식 13장 검수: 2026-11-02 — 흰 테두리 없음, 32px에서 전부 식별 가능, 지도 렌더 확인. **스타일 기준**: 새 그림은 이 세트와 나란히 놓았을 때 한 작가가 그린 것처럼 보여야 한다)

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
| `badge-nohint3.png` | ✅ 완료 — C-2 자립 | 뱃지 56px·공유 카드 48px |
| `badge-nohint10.png` | ✅ 완료 — C-2 독학왕 | 뱃지 56px·공유 카드 48px |
| `badge-firsttry10.png` | ✅ 완료 — C-2 한 번에 | 뱃지 56px·공유 카드 48px |
| `badge-firsttry30.png` | ✅ 완료 — C-2 명사수 | 뱃지 56px·공유 카드 48px |
| `badge-lesson3star.png` | ✅ 완료 — C-2 완벽한 레슨 | 뱃지 56px·공유 카드 48px |
| `badge-lesson3star5.png` | ✅ 완료 — C-2 별 수집가 | 뱃지 56px·공유 카드 48px |
| `badge-combo10.png` | ✅ 완료 — C-3 콤보 10 | 뱃지 56px·공유 카드 48px |
| `badge-combo20.png` | ✅ 완료 — C-3 콤보 20 | 뱃지 56px·공유 카드 48px |
| `badge-streak3.png` | ✅ 완료 — C-3 3일 연속 | 뱃지 56px·공유 카드 48px |
| `badge-streak7.png` | ✅ 완료 — C-3 7일 연속 | 뱃지 56px·공유 카드 48px |
| `badge-streak30.png` | ✅ 완료 — C-3 30일 연속 | 뱃지 56px·공유 카드 48px |
| `badge-daily7.png` | ✅ 완료 — C-3 목표 달성 7회 | 뱃지 56px·공유 카드 48px |
| `badge-review10.png` | ✅ 완료 — C-3 기억 유지 | 뱃지 56px·공유 카드 48px |
| `badge-explore10.png` | ✅ 완료 — C-3 탐험가 | 뱃지 56px·공유 카드 48px |
| `badge-boss1.png` | ✅ 완료 — C-4 보스 1 | 뱃지 56px·공유 카드 48px |
| `badge-boss2.png` | ✅ 완료 — C-4 보스 2 | 뱃지 56px·공유 카드 48px |
| `badge-boss3.png` | ✅ 완료 — C-4 보스 3 | 뱃지 56px·공유 카드 48px |
| `badge-boss4.png` | ✅ 완료 — C-4 보스 4 | 뱃지 56px·공유 카드 48px |
| `badge-boss5.png` | ✅ 완료 — C-4 보스 5 | 뱃지 56px·공유 카드 48px |
| `badge-perfect1.png` | ✅ 완료 — C-4 퍼펙트 1 | 뱃지 56px·공유 카드 48px |
| `badge-perfect2.png` | ✅ 완료 — C-4 퍼펙트 2 | 뱃지 56px·공유 카드 48px |
| `badge-perfect3.png` | ✅ 완료 — C-4 퍼펙트 3 | 뱃지 56px·공유 카드 48px |
| `badge-perfect4.png` | ✅ 완료 — C-4 퍼펙트 4 | 뱃지 56px·공유 카드 48px |
| `badge-perfect5.png` | ✅ 완료 — C-4 퍼펙트 5 | 뱃지 56px·공유 카드 48px |
| `badge-all_clear.png` | ✅ 완료 — C-4 완주 | 뱃지 56px·공유 카드 48px |
| `badge-checkup.png` | ✅ 완료 — C-4 종합 점검 통과 | 뱃지 56px·공유 카드 48px |
| `badge-algo_viz10.png` | ✅ 완료 — C-5 눈으로 보는 사람 | 뱃지 56px·공유 카드 48px |
| `badge-algo_tle.png` | ✅ 완료 — C-5 O(n²)에서 O(n log n)으로 | 뱃지 56px·공유 카드 48px |
| `badge-algo_mock.png` | ✅ 완료 — C-5 모의고사 통과 | 뱃지 56px·공유 카드 48px |
| `badge-algo_boss4.png` | ✅ 완료 — C-5 알고리즘 탐험가 | 뱃지 56px·공유 카드 48px |
| `badge-theme.png` | ✅ 완료 — C-6 분위기 전환 | 뱃지 56px·공유 카드 48px |
| `badge-works3.png` | ✅ 완료 — C-6 창작자 | 뱃지 56px·공유 카드 48px |
| `badge-turtle5.png` | ✅ 완료 — C-6 거북이 화가 | 뱃지 56px·공유 카드 48px |
| `badge-tutor10.png` | ✅ 완료 — C-6 질문으로 돌파 | 뱃지 56px·공유 카드 48px |
| `badge-secret_hello.png` | ✅ 완료 — C-7 secret_hello | 뱃지 56px·공유 카드 48px |
| `badge-secret_night.png` | ✅ 완료 — C-7 secret_night | 뱃지 56px·공유 카드 48px |
| `badge-secret_fast.png` | ✅ 완료 — C-7 secret_fast | 뱃지 56px·공유 카드 48px |
| `badge-secret_turtle.png` | ✅ 완료 — C-7 secret_turtle | 뱃지 56px·공유 카드 48px |
| `course-math.png` | ✅ 완료 — **박사모 쓴 거북이**(느리지만 확실히)가 자와 컴퍼스를 듦. 코스 마스코트 5마리(뱀·부엉이·고양이·코끼리·여우)와 같은 작가 느낌, 분홍 #e91e63 포인트 | 허브 「공간」 구역 수학 공간 카드 48px·공유 카드 |
| `area-math-1.png` | ✅ 완료 — 초록 숫자 블록 3개(0·1·2 느낌의 점 무늬, 글자 금지) | 지식 지도 「영역 1 수와 컴퓨터」 제목 옆 32px |
| `area-math-3.png` | ✅ 완료 — 주황 주사위 두 개 | 「영역 3 경우의 수·확률·통계」 |
| `area-math-5.png` | ✅ 완료 — 파랑 화살표 두 개가 평행사변형을 이룸 | 「영역 5 벡터·행렬」 |
| `badge-math_first.png` | ✅ 완료 — 둥근 메달 + 분홍 이름표(태그) | 뱃지 「이름 붙이기」(수학 노드 첫 완료) |
| `badge-math_nodes10.png` | ✅ 완료 — 둥근 메달 + 점과 선으로 이어진 작은 지도 | 「지도 탐험가」(노드 10개) |
| `badge-math_area_1.png` | ✅ 완료 — 초록 메달 + 숫자 블록 | 「수와 컴퓨터」(영역 1 완료) |
| `badge-math_area_3.png` | ✅ 완료 — 주황 메달 + 주사위 | 「확률의 눈」(영역 3 완료) |
| `badge-math_area_5.png` | ✅ 완료 — 파랑 메달 + 화살표 | 「벡터 조종사」(영역 5 완료) |
| `badge-math_star3.png` | ✅ 완료 — 금 메달 + 박사모 + 별 | 「대학 맛보기」(★ 노드 3개) |

**검수 메모(5차 D)**: 10장 ✅ 완료 — 수학 거북이 마스코트 1·영역 1/3/5 장식 3(512×512), 수학 뱃지 6(256×256). RGBA 투명 배경·사방 8% 이상 여백·전체 90장 `img_clean.py --check` 통과. 다크/라이트 배경에서 영역 32px·마스코트 48px·뱃지 48/56px 축소본 확인. 생성 프롬프트는 `assets/img/README.md`. 실제 브라우저 렌더 검수는 별도.

**검수 메모(4차 C-2~C-7)**: 38장 ✅ 완료(4차 A~C 총 49장 완료). 256×256 RGBA·투명 배경·사방 8% 이상 여백, 전체 80장 `python3 tools/img_clean.py --check` 통과. 다크/라이트 배경의 48/56px 축소본으로 대비·식별성 확인. 퍼펙트 5종은 같은 금메달에 리본 색만 변경. 생성·편집 프롬프트는 `assets/img/README.md`. 이번 검수는 이미지 파일 및 축소본 기준이며 실제 브라우저 화면은 별도 확인 대상.

**검수 메모(4차 A·B·C-1)**: 11장 ✅ 완료. 챕터·보스 512×512, 뱃지 256×256 RGBA. 사방 8% 이상 여백과 `python3 tools/img_clean.py --check` 통과. 다크/라이트 배경에서 챕터 32px·보스 40/56px 및 최신 지도 78/104px·뱃지 48/56px 축소본 확인. 생성 프롬프트는 `assets/img/README.md`.

**검수 메모(3차 A)**: 챕터 장식 13장(파이썬 0~7·알고 1~5) ✅ 완료. 512×512 RGBA, 사방 8% 이상 여백, `img_clean.py --check` 통과. 다크/라이트 배경에서 32px 축소본 확인. A12 트로피는 A7과 같은 파일 복사. 생성 프롬프트는 `assets/img/README.md`.

**검수 메모(2차)**: 2차 16장 중 6장(알고·SQL·웹 아이콘, 빈 작품, 알고 마스터 뱃지, 배너)에 **흰 스티커 테두리**가 있어 다크 테마에서 흰 띠로 보였음 → `tools/img_clean.py`로 투명 배경에 닿은 흰~회색 테두리를 지워 해결(내부 흰색은 윤곽선에 막혀 유지). 앞으로는 납품 전에 `python3 tools/img_clean.py --check`로 확인하고, 테두리가 있으면 `python3 tools/img_clean.py`(인자 없음)로 정리한 뒤 커밋. 배너는 아래 빈 공간을 잘라 1200×274가 됨 — 가로 배너는 **내용이 캔버스를 꽉 채우게** 그리는 편이 좋다.

## 3. 요청 목록 — 5차 D 완료 ✅

수학 공간 D1 → D2 → D3 **10장 납품 완료**, 2절 완료 표로 이동했다. 전체 이미지 90장. 영역 2·4·6 아이콘과 뱃지는 M2·M3 뒤 별도 요청까지 보류한다.

**납품 체크리스트**: 지정 파일명·크기로 `assets/img/`에 저장 → `python3 tools/img_clean.py --check` → 완료 항목을 2절로 이동 → `APP_VERSION` 패치 +1 → `node tools/stamp.mjs` → CHANGELOG·HANDOFF 갱신 → 커밋.

## 4. 그 뒤 (자리 없음 — 만들지 말 것)

| 파일 | 크기 | 쓰이는 곳 | 메모 |
| --- | --- | --- | --- |
| `mascot-<stage>-<color>.png` | 512 | 상단바·프로필 마스코트(지금은 코드로 그린 SVG, 색·장비를 사용자가 고름) | 색·장비 조합이 많아 SVG가 유리 — 그림으로 바꿀지 미정 |
| `lesson-<course>-<id>.png` | 640×360 | 레슨 첫 페이지 머리 그림 | 레슨 수가 많아(52) 후순위 |

## 5. 사이트 쪽 연결 (개발 메모)

- `assetUrl(name)`(core/util.js)이 허브/코스 페이지 어디서든 `assets/img/<name>`의 올바른 상대 경로를 돌려준다. `UI.img(name, fallbackEmoji, cls)`는 `<img>`를 만들고, 파일이 없으면 `onerror`로 이모지 `<span>`으로 바뀐다 → 그림이 없어도 화면 그대로.
- 그림 자리(파일이 있으면 자동 표시): 허브 코스 카드 `course-<courseId>.png`(48px) · 허브 배너 `hero-hub.png`(없으면 영역 자체가 없음) · 보스 HP 패널(56px)과 지도 보스 노드(40px) `boss-<courseId>-<챕터번호>.png` · 뱃지 화면 `badge-<badgeId>.png`(56px, 전 뱃지) · 내 작품 빈 화면 `empty-works.png`.
- 새 그림을 쓰는 자리를 추가할 때는 이 파일 3절에 요청을 적고, 코드에서 `UI.img(...)`로 바꾼다. `tools/stamp.mjs`가 `assets/img/*.png`를 오프라인 캐시 목록에 넣는다.
