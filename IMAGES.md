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

## 2. 완료된 그림 (검수 통과 ✅ — 90장, v2.3.3 기준. **A0 전수 재검수 2026-11-02 통과**(아래 검수 메모). 3차 챕터 장식 13장 검수: 2026-11-02 — 흰 테두리 없음, 32px에서 전부 식별 가능, 지도 렌더 확인. **스타일 기준**: 새 그림은 이 세트와 나란히 놓았을 때 한 작가가 그린 것처럼 보여야 한다)

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

**검수 메모(A0 전수 재검수, 2026-11-02, 아트팀·Opus)**: 완료본 **90장 전부 통과, 반려 0**. ① `img_clean.py --check` 90/90 OK. 코드의 그림 자리와 1:1 대조: 뱃지 정의 54 = 파일 54, 챕터 장식(파이썬 0~7·알고 1~6)·보스(파이썬 B1~B5·B7, 알고 AB1~AB5)·영역(1·3·5)·코스 6 전부 파일 있음, 남는 파일 없음, `sw.js` 캐시 목록 90장 포함. ② 축소본 대조표(다크 #0f1117·라이트 #f4f6fb, 원본 140px + 실사용 32/40/48/56/104px): **라이트 32px 전부 식별 가능**. 라이트 배경에서 바깥 윤곽 밝기 차 최소 119/255(boss-python-7 40px) — 어두운 윤곽선 규칙이 지켜져 흰 띠 없음. 글자·브랜드·실존 인물 없음. ③ 앱 렌더(Playwright, 다크/라이트 × PC 1280·모바일 390, 모바일은 2배 해상도 요소 캡처 포함): 허브 7(배너+코스 6)·파이썬 지도 14·알고 지도 11·수학 지도 3·뱃지 화면 54·보스 HP 패널·내 작품 빈 화면 — **90/90 로드, 실패 0, 페이지 에러 0**.
- 주의(통과·유지, 다음 차수 참고): `area-math-5` 가는 선 위주라 32px 면적 12%(세트 최저)이고 다크에서 점선 두 변이 거의 사라져 화살표 2개로 읽힘 · `chapter-algo-3` 사슬이 가로로 길어 32px에서 작게 보임(면적 18%) · `chapter-python-0` 남색 깃대가 다크에서 묻힘(깃발만으로 식별) · 잠긴 챕터는 제목 줄 전체가 흐려져 다크에서 algo-3·algo-6가 가장 흐림(UI 의도) · `perfect1~5`는 리본 색만 달라 48px 구분이 약함(의도, 이름으로 구분) · `boss-python-1` 카드 숫자 1·7·9는 「숫자 카드」 소재라 글자 금지의 예외로 유지 · `chapter-algo-5` = `chapter-python-6` 같은 파일(md5 일치, 의도).
- 겹치는 소재: 박사모 3장(`course-math`·`badge-nohint10`·`badge-math_star3`), 녹색 메달 거북이 2장(`badge-turtle5`·`badge-secret_turtle`) — 메달 색·소품으로 구분되지만 **6차 이후 수학 그림은 박사모·거북이 반복을 피하고**, 영역 아이콘은 `area-math-1/3`처럼 **굵은 덩어리 소재**로 요청할 것(가는 선·점선 금지).
- 선택 과제 후보: `hero-hub.png`에 마스코트 5마리만 있고 수학 거북이(6번째)가 없음 — 배너 갱신은 사용자 결정.
- 도구 메모: `tools/img_clean.py`의 `EXPECT`에 `area-` 접두가 없어 영역 그림은 크기 검사를 건너뜀(이번엔 직접 512×512 확인). 6차(영역 2·4) 납품 전에 `'area-': (512, 512)` 한 줄 추가 권장.

**검수 메모(5차 D)**: 10장 ✅ 완료 — 수학 거북이 마스코트 1·영역 1/3/5 장식 3(512×512), 수학 뱃지 6(256×256). RGBA 투명 배경·사방 8% 이상 여백·전체 90장 `img_clean.py --check` 통과. 다크/라이트 배경에서 영역 32px·마스코트 48px·뱃지 48/56px 축소본 확인. 생성 프롬프트는 `assets/img/README.md`. 실제 브라우저 렌더 검수는 별도.

**검수 메모(4차 C-2~C-7)**: 38장 ✅ 완료(4차 A~C 총 49장 완료). 256×256 RGBA·투명 배경·사방 8% 이상 여백, 전체 80장 `python3 tools/img_clean.py --check` 통과. 다크/라이트 배경의 48/56px 축소본으로 대비·식별성 확인. 퍼펙트 5종은 같은 금메달에 리본 색만 변경. 생성·편집 프롬프트는 `assets/img/README.md`. 이번 검수는 이미지 파일 및 축소본 기준이며 실제 브라우저 화면은 별도 확인 대상.

**검수 메모(4차 A·B·C-1)**: 11장 ✅ 완료. 챕터·보스 512×512, 뱃지 256×256 RGBA. 사방 8% 이상 여백과 `python3 tools/img_clean.py --check` 통과. 다크/라이트 배경에서 챕터 32px·보스 40/56px 및 최신 지도 78/104px·뱃지 48/56px 축소본 확인. 생성 프롬프트는 `assets/img/README.md`.

**검수 메모(3차 A)**: 챕터 장식 13장(파이썬 0~7·알고 1~5) ✅ 완료. 512×512 RGBA, 사방 8% 이상 여백, `img_clean.py --check` 통과. 다크/라이트 배경에서 32px 축소본 확인. A12 트로피는 A7과 같은 파일 복사. 생성 프롬프트는 `assets/img/README.md`.

**검수 메모(2차)**: 2차 16장 중 6장(알고·SQL·웹 아이콘, 빈 작품, 알고 마스터 뱃지, 배너)에 **흰 스티커 테두리**가 있어 다크 테마에서 흰 띠로 보였음 → `tools/img_clean.py`로 투명 배경에 닿은 흰~회색 테두리를 지워 해결(내부 흰색은 윤곽선에 막혀 유지). 앞으로는 납품 전에 `python3 tools/img_clean.py --check`로 확인하고, 테두리가 있으면 `python3 tools/img_clean.py`(인자 없음)로 정리한 뒤 커밋. 배너는 아래 빈 공간을 잘라 1200×274가 됨 — 가로 배너는 **내용이 캔버스를 꽉 채우게** 그리는 편이 좋다.

## 3. 요청 목록 — 6차 E 수학 영역 4·2 (4장, 2026-11-03 요청 · 아트팀 A1)

> 이전 차수(5차 D 10장)는 완료 → 2절. 이번 차수는 **수학 영역 4 「함수·변화·미적분」(보라 #9c27b0)·영역 2 「논리·집합·증명」(청록 #00acc1)** 의 장식 2장 + 영역 완료 뱃지 2장이다.
> **그림 자리**: 영역 장식은 `core/ui-views-math.js` 영역 머리의 `area-math-<영역번호>.png`, 뱃지는 `badge-<id>.png` — 둘 다 이미 있는 자리다. 영역 4·2와 뱃지 `math_area_4`·`math_area_2`는 콘텐츠팀 C10 PR(`specs/schedule-week.md` 5절)이 `CHAPTERS`·`shared/badges.js`에 추가하면 화면에 나온다. 그 전에 납품돼도 사이트는 깨지지 않는다(안 쓰이는 파일일 뿐).
> **A0 재검수에서 나온 기준(2절 검수 메모)**: 32px에서는 **굵게 채운 덩어리 모양**만 남는다 — `area-math-5`처럼 가는 선·점선은 금지. 박사모·거북이·사슬(이미 3장·2장·1장 있음)은 쓰지 않는다. 같은 영역의 장식과 뱃지는 **같은 소재**를 쓴다(영역 1 블록·영역 3 주사위·영역 5 화살표와 같은 규칙).

순서: **E1 영역 장식 2장 → E2 뱃지 2장.**

| # | 파일 | 크기 | 쓰이는 곳 | 한국어 설명 | 참조 그림 | 상태 |
| --- | --- | --- | --- | --- | --- | --- |
| E1-4 | `area-math-4.png` | 512×512 | 수학 지식 지도 「영역 4 · 함수·변화·미적분」 제목 옆 **32px** | (재요청) **낮고 넓은 보라 포물선 띠**(폭이 높이의 2배 이상) **오른쪽 내리막**에 노란 공, 공 뒤로 작은 노란 점 2개가 궤적 — 던진 공의 포물선. 공은 꼭대기 가운데 금지 | `area-math-1.png`, `area-math-3.png` | 납품(2차) — 재검수 대기 |
| E1-2 | `area-math-2.png` | 512×512 | 「영역 2 · 논리·집합·증명」 제목 옆 **32px** | **꽉 채운 원 두 개가 겹친 벤 다이어그램** — 왼쪽 청록, 오른쪽 파랑, 겹친 부분은 진한 남청록 | `area-math-1.png`, `area-math-3.png` | 납품 |
| E2-4 | `badge-math_area_4.png` | 256×256 | 뱃지 화면 56px·획득 알림·공유 카드 48px (영역 4 전부 완료) | (재요청) 보라 메달 + 영역 4 장식과 같은 낮은 포물선 띠·오른쪽 공·점 궤적 | `badge-math_area_1.png`, `badge-math_area_3.png` | 납품(2차) — 재검수 대기 |
| E2-2 | `badge-math_area_2.png` | 256×256 | 같은 자리 (영역 2 전부 완료) | 청록 메달 + 겹친 원 두 개(노랑·흰색, 겹친 부분 주황) | `badge-math_area_1.png`, `badge-math_area_3.png` | 납품 |

### E1-4 `area-math-4.png` — 재요청(2차) 납품

```text
Create ONE educational game asset, a flat vector-style sticker illustration matching the supplied reference set's line weight, rounded shapes and bright palette. Bold dark navy #1d2230 outlines. Clean SOLID color fills and small solid highlights only, absolutely NO smooth gradients, no 3D render, no texture. Transparent background, one centered subject, 8% clear margin on all four sides. Outer edge dark navy; any pale accent must stay INSIDE the dark outline, no white exterior sticker halo or drop shadow. No letters, words, numerals, brands. Palette blue #6c8cff green #2bb673 yellow #ffd166 red #ff5d6c orange #ffb347 purple #9c27b0 teal #00acc1. Must stay readable at 32px: chunky FILLED shapes only — no thin lines, no dashed lines, no axes, no grid. No circular medal or backdrop. Reference is style only; replace its subject entirely. Subject: a LOW and WIDE thick purple (#9c27b0) parabola band — width at least twice its height, like a gentle hill-shaped arc drawn as one chunky rounded band (not a thin curve), both ends on an invisible baseline. One round yellow (#ffd166) ball sits ON THE RIGHT DOWNHILL SIDE of the arc (about two-thirds along, NOT at the top center), and two smaller solid yellow dots trail behind it along the top of the arc toward the upper left, showing the ball's path. The whole icon must NOT look like a person, user avatar or head-and-shoulders symbol: never put the ball centered above the arc, never make the arc tall and narrow. No ground, no arrows, no second curve, no sparkles. 512x512.
```

### E1-2 `area-math-2.png`

```text
Create ONE educational game asset, a flat vector-style sticker illustration matching the supplied reference set's line weight, rounded shapes and bright palette. Bold dark navy #1d2230 outlines. Clean SOLID color fills and small solid highlights only, absolutely NO smooth gradients, no 3D render, no texture. Transparent background, one centered subject, 8% clear margin on all four sides. Outer edge dark navy; any pale accent must stay INSIDE the dark outline, no white exterior sticker halo or drop shadow. No letters, words, numerals, brands. Palette blue #6c8cff green #2bb673 yellow #ffd166 red #ff5d6c orange #ffb347 purple #9c27b0 teal #00acc1. Must stay readable at 32px: chunky FILLED shapes only — no thin lines, no dashed lines, no axes, no grid. No circular medal or backdrop. Reference is style only; replace its subject entirely. Subject: a Venn diagram made of two large FULLY FILLED overlapping circles of equal size, side by side, overlapping by about one third. Left circle solid teal (#00acc1), right circle solid blue (#6c8cff), the shared lens-shaped overlap filled solid darker navy-teal (#1d6f8a). Every circle edge and the overlap edge has the same bold dark navy outline. No dots, no labels, no outer rectangle, no chain links. 512x512.
```

### E2-4 `badge-math_area_4.png` — 재요청(2차) 납품

```text
Create ONE PNG badge for a consistent educational game medal set. Flat vector sticker illustration, bold dark navy #1d2230 outlines, solid clean color shapes, no gradients, no dimensional rendering, no texture. Round medal with simple thick concentric rim and large central subject legible at 48px. Outermost edge DARK NAVY, thin lighter INNER rim, absolutely no white external sticker halo or shadow. True transparent background outside the medal. Centered square composition, at least 8% clear margins. No letters, numbers, words, brands or watermarks. Match reference medal silhouette, line weight and style, replace its central subject with requested one. Palette blue #6c8cff green #2bb673 yellow #ffd166 red #ff5d6c orange #ffb347 purple #9c27b0 teal #00acc1. Subject: a round purple (#9c27b0) medal with one LOW and WIDE thick light lavender parabola band across the medal face (width at least twice its height, chunky rounded band), a single round yellow (#ffd166) ball on its RIGHT downhill side (not at the top center) and two smaller solid yellow dots trailing behind it along the arc. Must NOT look like a person or user avatar icon. No stars, no graph axes, no other objects. 256x256.
```

### E2-2 `badge-math_area_2.png`

```text
Create ONE PNG badge for a consistent educational game medal set. Flat vector sticker illustration, bold dark navy #1d2230 outlines, solid clean color shapes, no gradients, no dimensional rendering, no texture. Round medal with simple thick concentric rim and large central subject legible at 48px. Outermost edge DARK NAVY, thin lighter INNER rim, absolutely no white external sticker halo or shadow. True transparent background outside the medal. Centered square composition, at least 8% clear margins. No letters, numbers, words, brands or watermarks. Match reference medal silhouette, line weight and style, replace its central subject with requested one. Palette blue #6c8cff green #2bb673 yellow #ffd166 red #ff5d6c orange #ffb347 purple #9c27b0 teal #00acc1. Subject: a round teal (#00acc1) medal with two large fully filled overlapping circles in the center (Venn diagram): left circle yellow (#ffd166), right circle cream white, the overlap filled orange (#ffb347), all with bold dark navy outlines. No stars, no chain links, no other objects. 256x256.
```

**검수 기준(아트팀, art-team.md 2절)**: `img_clean --check` → 다크/라이트 축소본(영역 32px·뱃지 48/56px)에서 소재 식별 + 2절 `area-math-1/3`·`badge-math_area_1/3/5`와 나란히 한 작가 느낌 → 앱 렌더(C10 병합 뒤 수학 지도·뱃지 화면). 하나라도 걸리면 이 표 「상태」에 「반려: 이유」와 고친 프롬프트.

**납품 체크리스트(6차부터 — workflow 8절)**: 지정 파일명·크기로 `assets/img/`에 저장 → `python3 tools/img_clean.py --check`(현재 이 도구는 `area-` 크기를 안 봄 → 512×512인지 직접 확인) → 생성 프롬프트를 `assets/img/README.md` 맨 아래에 「6차 E」로 기록 → 이 표 「상태」를 `납품`으로 → **`art/6차` 브랜치에 커밋 → PR**. `APP_VERSION`·`node tools/stamp.mjs`·HANDOFF 상태판은 **손대지 않는다**(릴리스 때 함께). 2절 완료 표로 옮기는 것은 아트팀 검수 통과 뒤.

**납품 메모(2026-11-02, Codex)**: E1-4 → E1-2 → E2-4 → E2-2 순서로 4장 생성. 위 영어 프롬프트와 지정 참조 그림을 변경 없이 사용. 영역 512×512·뱃지 256×256 RGBA, 사방 여백 47/23px, `img_clean --check` 통과. 다크/라이트 32px·48/56px 축소본에서 소재 식별 확인. 생성 결과에 약한 색조 변화가 남아 있어 완전 단색 여부는 아트팀 최종 검수 대상. C10 미병합 상태라 실제 지도·뱃지 렌더 검수는 C10 병합 후 진행. 상태는 납품이며 2절 완료 표로 이동하지 않음.

**2차 납품 메모(2026-11-02, Codex)**: `art/6차-검수`의 수정 프롬프트로 E1-4 → E2-4 재생성. 낮고 넓은 포물선 띠·오른쪽 내리막의 공·작은 궤적 점 2개로 변경했다. 뱃지 최초 결과의 아래로 처진 곡선은 E1-4를 참조한 추가 편집으로 같은 언덕 모양으로 교정(프롬프트 기록: `assets/img/README.md`). 512/256 RGBA·사방 여백 47/23px·img_clean 검사 통과, 다크/라이트 32·48/56px 축소본 확인. 최종 아트팀 재검수·실제 앱 화면 확인은 별도. E1-2·E2-2 파일은 변경하지 않았다.

## 4. 그 뒤 (자리 없음 — 만들지 말 것)

| 파일 | 크기 | 쓰이는 곳 | 메모 |
| --- | --- | --- | --- |
| `mascot-<stage>-<color>.png` | 512 | 상단바·프로필 마스코트(지금은 코드로 그린 SVG, 색·장비를 사용자가 고름) | 색·장비 조합이 많아 SVG가 유리 — 그림으로 바꿀지 미정 |
| `lesson-<course>-<id>.png` | 640×360 | 레슨 첫 페이지 머리 그림 | 레슨 수가 많아(52) 후순위 |
| `node-math-<id>.png` | 256 | 수학 지식 지도 노드 링 안 아이콘(지금은 노드의 `icon` 이모지, `core/ui-views-math.js` `nodeHtml`의 `.mn-ic`) | 자리 없음 → Fable 제안(6차 A1 검토, 2026-11-03). 노드 38개 이상이라 만들면 차수 2개 분량 |

## 5. 사이트 쪽 연결 (개발 메모)

- `assetUrl(name)`(core/util.js)이 허브/코스 페이지 어디서든 `assets/img/<name>`의 올바른 상대 경로를 돌려준다. `UI.img(name, fallbackEmoji, cls)`는 `<img>`를 만들고, 파일이 없으면 `onerror`로 이모지 `<span>`으로 바뀐다 → 그림이 없어도 화면 그대로.
- 그림 자리(파일이 있으면 자동 표시): 허브 코스 카드 `course-<courseId>.png`(48px) · 허브 배너 `hero-hub.png`(없으면 영역 자체가 없음) · 보스 HP 패널(56px)과 지도 보스 노드(40px) `boss-<courseId>-<챕터번호>.png` · 뱃지 화면 `badge-<badgeId>.png`(56px, 전 뱃지) · 내 작품 빈 화면 `empty-works.png`.
- 새 그림을 쓰는 자리를 추가할 때는 이 파일 3절에 요청을 적고, 코드에서 `UI.img(...)`로 바꾼다. `tools/stamp.mjs`가 `assets/img/*.png`를 오프라인 캐시 목록에 넣는다.
