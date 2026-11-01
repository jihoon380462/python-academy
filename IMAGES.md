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

## 2. 요청 목록

### 테스트 1 — 허브 코스 카드 아이콘: 파이썬 코스
- **파일**: `assets/img/course-python.png` · **크기**: 512×512 · **쓰이는 곳**: 허브(첫 화면) 코스 카드의 왼쪽 아이콘(화면에선 44px, 레티나 88px) — 지금은 🐍 이모지
- **한국어 설명**: 친근한 초록 뱀(파이썬 마스코트 느낌이지만 공식 로고를 베끼지 말 것)이 작은 노트북 또는 코드 블록 `{ }` 위에 똬리를 틀고 윙크하는 스티커. 초록 `#2bb673` 주색, 노랑 포인트.
- **Prompt (EN)**: `flat vector sticker of a cute friendly green snake coiled around a small laptop, winking, bold dark navy outline (#1d2230), bright green (#2bb673) body with yellow (#ffd166) accents, no text, no gradients, transparent background, centered, 8% margin, simple shapes, kid-friendly educational app icon style`
- **Negative**: `realistic, 3D render, photo, text, letters, logo, white background, gradient, shadow`
- **상태**: ✅ 완료 — 2026-11-02, 윙크하는 초록 뱀과 노트북. 512×512 투명 PNG, 여백·축소 표시 검수.

### 테스트 2 — 챕터 1 보스 캐릭터: 숫자 맞히기 괴물
- **파일**: `assets/img/boss-python-1.png` · **크기**: 512×512 · **쓰이는 곳**: 파이썬 코스 챕터 1 보스 문제(「보스: 숫자 맞히기」) 상단의 보스 HP 바 옆(화면 64px) — 지금은 👾 이모지. 보스를 깨면 같은 그림이 회색으로 바뀐다(코드가 처리, 별도 그림 불필요)
- **한국어 설명**: 숫자 카드(1~100)가 흩날리는 가운데, 물음표 모양 뿔이 달린 동그란 보라색 꼬마 괴물이 "맞혀 봐!" 하는 듯 장난스럽게 웃는 모습. 무섭지 않게, 10세도 좋아할 귀여운 악당. 보라 `#9c27b0` 주색, 노랑 `#ffd166` 포인트.
- **Prompt (EN)**: `flat vector sticker of a cute round purple monster (#9c27b0) with a question-mark shaped horn, playful mischievous grin, holding a card with a big number, a few floating number cards around it, bold dark navy outline (#1d2230), yellow (#ffd166) accents, no text other than digits on the cards, transparent background, centered, 8% margin, simple kid-friendly game boss icon`
- **Negative**: `scary, realistic, 3D, photo, letters, words, white background, gradient`
- **상태**: ✅ 완료 — 2026-11-02, 사용자 피드백으로 큰 물음표 뿔·굵은 눈썹·망토·넓은 자세를 더해 보스 인상 강화. 512×512 투명 PNG.

## 3. 다음에 요청할 것들 (테스트가 잘 되면 — 아직 만들지 말 것)

| 파일 | 크기 | 쓰이는 곳 |
| --- | --- | --- |
| `course-algo.png` | 512 | 허브 알고리즘 코스 카드 (🧭 나침반 + 그래프 노드) |
| `course-terminal-git.png` | 512 | 허브 터미널·Git 카드 (🎧 검은 창 + 가지) |
| `boss-python-2.png` … `boss-python-5.png`, `boss-algo-1.png` … `boss-algo-4.png` | 512 | 각 챕터 보스 (챕터 주제: 숫자 맞히기 2단계·가계부·가위바위보·텍스트 RPG / 괄호 검사·성적 정렬·미로·모의고사) |
| `badge-master-python.png`, `badge-master-algo.png` | 256 | 👑 코스 마스터 뱃지 |
| `hero-hub.png` | 1200×400 | 허브 상단 배너(마스코트들이 코드 블록 위에서 노는 장면, 가로형) |
| `empty-works.png` | 512 | 내 작품이 비었을 때 일러스트 |

## 4. 사이트 쪽 연결 (개발 메모)

- `assetUrl(name)`(core/util.js)이 허브/코스 페이지 어디서든 `assets/img/<name>`의 올바른 상대 경로를 돌려준다. `UI.img(name, fallbackEmoji, cls)`는 `<img>`를 만들고, 파일이 없으면 `onerror`로 이모지 `<span>`으로 바뀐다 → 그림이 없어도 화면 그대로.
- 지금 그림을 쓰는 자리: 허브 코스 카드 아이콘(`course-<courseId>.png`), 보스 문제 HP 패널(`boss-<courseId>-<챕터번호>.png`).
- 새 그림을 쓰는 자리를 추가할 때는 이 파일 2절에 요청을 적고, 코드에서 `UI.img(...)`로 바꾼다. `tools/stamp.mjs`가 `assets/img/*.png`를 오프라인 캐시 목록에 넣는다.
