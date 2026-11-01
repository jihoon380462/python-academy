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

## 2. 완료된 그림 (검수 통과 ✅ 2026-11-02 — 이 둘이 **스타일 기준**이다. 새 그림은 이 둘과 나란히 놓았을 때 한 세트로 보여야 한다)

| 파일 | 내용 | 비고 |
| --- | --- | --- |
| `course-python.png` | 윙크하는 초록 뱀 + 노트북 | 허브 코스 카드 48px |
| `boss-python-1.png` | 보라색 숫자 괴물(물음표 뿔·숫자 카드·망토) | 보스 HP 패널 56px · 지도 보스 노드 40px |

## 3. 요청 목록 — 2차 (지금 만들 것, 총 16장)

같은 작가가 그린 한 세트처럼: 윤곽선 굵기·채도·눈 모양을 완료된 두 장과 맞출 것. 보스들은 **같은 "꼬마 괴물" 종족**으로 — 몸 색과 소품만 챕터 주제에 맞게 다르다. 코스 아이콘은 **동물 마스코트 + 소품** 공식(뱀+노트북처럼).

### A. 허브 코스 카드 아이콘 (512×512, 허브에서 48px)

| # | 파일 | 코스 | 한국어 설명 | Prompt (EN) |
| --- | --- | --- | --- | --- |
| A1 | `course-algo.png` | 알고리즘·자료구조 (지금 🧭) | 파란 부엉이가 나침반을 들고, 뒤에 작은 그래프(동그라미 3개를 선으로 연결)가 떠 있는 스티커. 주색 파랑 `#2196f3`, 포인트 노랑 | `flat vector sticker of a cute blue owl holding a golden compass, three small connected circle nodes floating behind it like a graph, bold dark navy outline (#1d2230), blue (#2196f3) body, yellow (#ffd166) accents, no text, transparent background, centered, 8% margin, same style as a kid-friendly educational app icon set` |
| A2 | `course-terminal-git.png` | 터미널·Git (지금 🎧) | 회색 고양이가 검은 터미널 창(초록 `>_` 프롬프트)을 안고 있고, 꼬리가 Git 가지(갈라졌다 합쳐지는 선 + 점 3개)처럼 생김. 주색 회청 `#607d8b`, 포인트 주황 `#ffb347` | `flat vector sticker of a cute gray cat hugging a small black terminal window with a green prompt symbol, its tail shaped like a branching git graph with three dots, bold dark navy outline (#1d2230), orange (#ffb347) accents, no readable text, transparent background, centered, 8% margin` |
| A3 | `course-sql.png` | 데이터베이스(SQL) (지금 🗄️) | 노란 코끼리(기억력!)가 서랍 3칸짜리 데이터 캐비닛 위에 앉아 커피잔을 들고 있음(동네 카페 데이터라는 설정). 주색 노랑 `#ffd166`, 포인트 갈색 | `flat vector sticker of a cute yellow elephant sitting on a small three-drawer filing cabinet, holding a coffee cup, bold dark navy outline (#1d2230), brown and teal accents, no text, transparent background, centered, 8% margin` |
| A4 | `course-web.png` | 웹·HTTP·API (지금 🌐) | 주황 여우가 작은 지구본 위에서 종이비행기(요청·응답)를 날리는 스티커. 주색 주황 `#ff9800`, 포인트 하늘색 | `flat vector sticker of a cute orange fox standing on a small globe, throwing a paper airplane, a tiny browser window floating nearby, bold dark navy outline (#1d2230), sky blue accents, no text, transparent background, centered, 8% margin` |

### B. 챕터 보스 캐릭터 (512×512, HP 패널 56px·지도 40px) — `boss-python-1.png`과 같은 종족

| # | 파일 | 챕터·보스 문제 | 몸 색 | 한국어 설명 | Prompt (EN) |
| --- | --- | --- | --- | --- | --- |
| B1 | `boss-python-2.png` | 파이썬 2 「숫자 맞히기 게임 완성」 | 파랑 `#2196f3` | 보스 1의 형. 더 크고, 주사위 2개를 저글링하며, 머리에 느낌표 뿔. 망토는 같은 디자인 | `flat vector sticker of a cute round blue monster (#2196f3), same species as a purple monster with a question-mark horn, this one has an exclamation-mark shaped horn and juggles two dice, playful grin, small cape, bold dark navy outline (#1d2230), yellow accents, no text, transparent background, centered, 8% margin` |
| B2 | `boss-python-3.png` | 파이썬 3 「간단한 가계부」 | 주황 `#ff9800` | 동전과 영수증을 양손에 든 주황 괴물, 머리에 동전 모양 뿔, 배에 작은 가방(지갑) | `flat vector sticker of a cute round orange monster (#ff9800) with a coin-shaped horn, holding a receipt in one hand and a stack of coins in the other, a small wallet pouch on its belly, mischievous smile, bold dark navy outline (#1d2230), yellow accents, no readable text, transparent background, centered, 8% margin` |
| B3 | `boss-python-4.png` | 파이썬 4 「클래스로 만든 가위바위보」 | 보라 `#9c27b0` 진한 톤 | 팔이 세 개(가위·바위·보 손 모양)인 보라 괴물, 머리에 톱니바퀴 뿔(클래스=설계도 느낌) | `flat vector sticker of a cute round dark purple monster with three arms showing rock, paper and scissors hand gestures, a small gear-shaped horn, confident grin, bold dark navy outline (#1d2230), yellow accents, no text, transparent background, centered, 8% margin` |
| B4 | `boss-python-5.png` | 파이썬 5 「텍스트 RPG 전투」 | 빨강 `#e91e63` | 최종 보스. 작은 왕관, 나무 검과 방패, 위에 하트 3개(HP) 떠 있음. 조금 더 위엄 있지만 여전히 귀엽게 | `flat vector sticker of a cute round crimson monster (#e91e63) wearing a tiny crown, holding a wooden sword and a round shield, three small hearts floating above its head, proud but friendly expression, bold dark navy outline (#1d2230), gold accents, no text, transparent background, centered, 8% margin` |
| B5 | `boss-algo-1.png` | 알고리즘 1 「괄호 검사기 + 프린터 대기열」 | 초록 `#4caf50` | 괄호 `( )` 모양 뿔 두 개, 손에 종이 뭉치(프린터 대기열), 등에 작은 프린터 | `flat vector sticker of a cute round green monster (#4caf50) with two horns shaped like parentheses, holding a stack of papers, a tiny printer on its back, cheeky grin, bold dark navy outline (#1d2230), yellow accents, no readable text, transparent background, centered, 8% margin` |
| B6 | `boss-algo-2.png` | 알고리즘 2 「성적표 정렬·검색 프로그램」 | 파랑 `#2196f3` | 돋보기를 들고, 키 순서대로 줄 선 작은 막대(정렬) 위에 올라탄 파란 괴물, 뿔은 화살표 모양 | `flat vector sticker of a cute round blue monster (#2196f3) holding a magnifying glass, standing on a row of bars sorted from short to tall, an arrow-shaped horn, playful grin, bold dark navy outline (#1d2230), yellow accents, no text, transparent background, centered, 8% margin` |
| B7 | `boss-algo-3.png` | 알고리즘 3 「미로 최단 경로 + 친구 추천」 | 주황 `#ff9800` | 작은 미로 판을 들고 있고, 머리 위에 점 3개가 선으로 연결(그래프)된 주황 괴물 | `flat vector sticker of a cute round orange monster (#ff9800) holding a small square maze board, three connected dots floating above its head like a graph, curious grin, bold dark navy outline (#1d2230), yellow accents, no text, transparent background, centered, 8% margin` |
| B8 | `boss-algo-4.png` | 알고리즘 4 「코딩테스트 모의고사」 | 보라 `#9c27b0` | 시험 감독관 느낌: 안경, 초시계를 들고, 시험지 묶음. 뿔은 연필 모양 | `flat vector sticker of a cute round purple monster (#9c27b0) wearing glasses, holding a stopwatch and a bundle of exam papers, a pencil-shaped horn, strict-but-friendly expression, bold dark navy outline (#1d2230), yellow accents, no readable text, transparent background, centered, 8% margin` |

### C. 뱃지·장식 (256×256 정사각, 뱃지 화면 56px)

| # | 파일 | 쓰이는 곳 | 한국어 설명 | Prompt (EN) |
| --- | --- | --- | --- | --- |
| C1 | `badge-master_python.png` | 👑 파이썬 마스터 뱃지 | 금색 왕관을 쓴 초록 뱀 얼굴 원형 메달, 테두리 금색 | `flat vector round gold medal badge with a cute green snake face wearing a golden crown in the center, bold dark navy outline (#1d2230), no text, transparent background, centered, 8% margin, 256x256` |
| C2 | `badge-master_algo.png` | 👑 알고리즘 마스터 뱃지 | 금색 왕관을 쓴 파란 부엉이 얼굴 원형 메달 | `flat vector round gold medal badge with a cute blue owl face wearing a golden crown in the center, bold dark navy outline (#1d2230), no text, transparent background, centered, 8% margin, 256x256` |

### D. 허브·빈 화면 일러스트

| # | 파일 | 크기 | 쓰이는 곳 | 한국어 설명 | Prompt (EN) |
| --- | --- | --- | --- | --- | --- |
| D1 | `hero-hub.png` | **1200×400 가로, 투명** | 허브 맨 위 배너(오늘의 할 일 카드 위). 없으면 표시 안 함 | 뱀(파이썬)·부엉이(알고리즘)·고양이(터미널)·코끼리(SQL)·여우(웹) 다섯 마스코트가 커다란 코드 블록(`{ }`, 괄호, 화살표 모양 블록) 위에 앉아 노는 장면. 가운데를 비워 두지 말고 좌우로 넓게, 아래쪽 1/3은 투명하게(글자 올릴 공간 없음 — 배너는 그림만) | `wide flat vector illustration 1200x400, five cute animal mascots (green snake, blue owl, gray cat, yellow elephant, orange fox) playing on large colorful code-block shapes (curly braces, brackets, arrows), bold dark navy outlines (#1d2230), bright palette (#6c8cff, #2bb673, #ffd166, #ff5d6c, #ffb347), no text, transparent background, characters spread across the width` |
| D2 | `empty-works.png` | 512×512 | 내 작품 화면이 비었을 때 | 빈 액자(이젤)에 물음표 대신 작은 새싹이 돋는 그림, 옆에 붓을 든 초록 뱀 | `flat vector sticker of an empty easel with a small sprout growing from the canvas, a cute green snake holding a paintbrush beside it, bold dark navy outline (#1d2230), soft palette, no text, transparent background, centered, 8% margin` |

**납품 체크리스트 (2차)**: 16장 전부 `assets/img/`에 정확한 이름으로 → 이 파일 2절 표로 옮기고 3절에서 지운다 → `core/config.js`의 `APP_VERSION` 패치 번호 +1 → `node tools/stamp.mjs`(오프라인 캐시 목록 갱신) → `CHANGELOG.md`·`HANDOFF.md` 상태판 한 줄 → 커밋. 한 번에 다 못 하면 된 것만 먼저 커밋해도 된다(없는 그림은 이모지로 나온다).

## 4. 3차 이후 (아직 만들지 말 것 — 자리도 아직 없음)

| 파일 | 크기 | 쓰이는 곳 | 메모 |
| --- | --- | --- | --- |
| `chapter-<course>-<n>.png` (파이썬 0~6, 알고리즘 1~5) | 512 | 홈 지도 챕터 제목 옆 장식 | 챕터 주제 소품 하나씩(첫걸음=새싹, 반복=회오리, 데이터=상자…) |
| `mascot-<stage>-<color>.png` | 512 | 상단바·프로필 마스코트(지금은 코드로 그린 SVG, 색·장비를 사용자가 고름) | 색·장비 조합이 많아 SVG가 유리 — 그림으로 바꿀지 미정 |
| `badge-<id>.png` 나머지 뱃지 ~40개 | 256 | 뱃지 화면 | 자리는 이미 있음(`badge-<id>.png`가 있으면 이모지 대신 표시) |
| `lesson-<course>-<id>.png` | 640×360 | 레슨 첫 페이지 머리 그림 | 레슨 수가 많아(52) 후순위 |

## 5. 사이트 쪽 연결 (개발 메모)

- `assetUrl(name)`(core/util.js)이 허브/코스 페이지 어디서든 `assets/img/<name>`의 올바른 상대 경로를 돌려준다. `UI.img(name, fallbackEmoji, cls)`는 `<img>`를 만들고, 파일이 없으면 `onerror`로 이모지 `<span>`으로 바뀐다 → 그림이 없어도 화면 그대로.
- 그림 자리(파일이 있으면 자동 표시): 허브 코스 카드 `course-<courseId>.png`(48px) · 허브 배너 `hero-hub.png`(없으면 영역 자체가 없음) · 보스 HP 패널(56px)과 지도 보스 노드(40px) `boss-<courseId>-<챕터번호>.png` · 뱃지 화면 `badge-<badgeId>.png`(56px, 전 뱃지) · 내 작품 빈 화면 `empty-works.png`.
- 새 그림을 쓰는 자리를 추가할 때는 이 파일 3절에 요청을 적고, 코드에서 `UI.img(...)`로 바꾼다. `tools/stamp.mjs`가 `assets/img/*.png`를 오프라인 캐시 목록에 넣는다.
