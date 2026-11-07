# 웹 교과서 — 다시 설계 (화면만 · 크게 키움, 2026-11-07 Opus)

> 사용자(11/7): ① 「웹은 따로 빼서 할 거고 HTTP-API-SDK 는 서로 연결되니까 같이 묶을 거야」(D15) ② 「HTML-CSS-JS 를 설명 몇 쪽으로 충분히 처리 가능한 거야?」 → 세어 보니 HTML 4 · CSS 3 · **JavaScript 3 레슨**(레슨마다 3쪽 · 약 1,000~1,350자)뿐 — 파이썬 교과서(레슨 39 · 227쪽)와 비교해 「혼자 만들 수 있게」 에 크게 모자람 → 사용자 「1」(레슨 30개 안팎으로 키우기, D16).
> HTTP · API 는 [`specs/http-api-course.md`](http-api-course.md) 로 옮겨요. 웹 교과서는 **화면(HTML · CSS · JavaScript)만**.
> 이 문서는 **설계**예요. 만들 때 이 문서를 따르고, 바뀌는 건 여기를 먼저 고쳐요. 기술적인 선택은 Claude 가 정했고(HANDOFF 3절) 이유를 9절에 적었어요.

---

## 1. 한 줄로

**VS Code 와 브라우저로 「보이고 움직이는 화면」 을 혼자 처음부터 끝까지.** HTML 로 뼈대 → CSS 로 모양과 배치 → JavaScript 를 **언어로 제대로** → 브라우저(DOM · 이벤트 · 폼 · 상태) → 비동기 · 검사 · 모듈 · 디버깅 · 배포. 서버와 대화하는 원리는 HTTP·API·SDK 교과서가 맡아요.

## 2. 다른 교과서와의 경계

| 주제 | **웹 교과서** | 다른 교과서 |
| --- | --- | --- |
| HTML · CSS · JavaScript 언어 · DOM · 이벤트 · 폼 · 상태 · localStorage · 모듈 · F12 | ✅ 여기가 기준 | — |
| 파이썬과 닮은 것(변수 · 반복 · 함수 · 리스트/딕셔너리) | **차이를 중심으로** 다시 가르침 — 파이썬 교과서 그 레슨으로 「먼저 보면 좋은 레슨」 링크 | 파이썬 교과서 |
| `async` · `await` · `fetch` 로 **같은 폴더의 JSON 파일** | ✅ 레슨 10 | **진짜 API** · HTTP · 상태 코드 · CORS 는 HTTP·API·SDK |
| GitHub Pages | 레슨 13 에서 내 화면을 올리는 순서만 | GitHub 교과서 G12 가 설정의 기준 |

## 3. 연습 방법 (지금과 같음)

- **VS Code + Live Server + 크롬/엣지 F12**. 공부 폴더 `web-study`, 파일 이름 `lesson05_1.html` 모양.
- 만들어 보기는 「브라우저에서 확인할 것」 ☐ + 예시 답(파일 전체). `tools/run_web_solutions.py` 가 예시 답을 미리보기에 넣어 ☐ 를 **자동 확인**(클릭 · 입력 · 제출 · 기다리기 · JS 식 — 지금 있는 검사 그대로). 사람만 볼 수 있는 것(F12 · Lighthouse · 배포)만 `noRun` + ☐.
- **JavaScript 언어 챕터(4)** 는 화면 없이 **Console** 에서: 예시 답의 `console.log` 를 검사기가 읽어 「출력 예」 와 비교(지금 `run_web_solutions.py` 의 Console 확인을 만들어 보기에도 씀 — `checks` 에 `{ text, console: '기대 출력' }`).

## 4. 「먼저 꼭」 경고

| 위치 | 제목 | 내용 |
| --- | --- | --- |
| 챕터 1 위 · 레슨 0·1 (지금) | VS Code + Live Server | 그대로 |
| 챕터 4·5 위 (지금 「F12 Console 을 늘 열어 두세요」) | Console 은 늘 열어 두기 | 그대로 — 챕터 4 부터 |
| 레슨 10 · 12 · 만들어 보기 5 | Live Server 로 열어야 해요 | `fetch` · 모듈은 `file://` 에서 막힘 → Go Live 주소(`http://127.0.0.1:5500/…`) |
| 레슨 13 | 올리기 전에 비밀 확인 · Git 설정 | 공개 저장소에 개인정보 · 키 없게(GitHub G16) · 터미널·Git 레슨 6·16 |

## 5. 목차 (챕터 6 · 설명 레슨 29 + 만들어 보기 5 = 34)

- 레슨 id: **지금 것(W0~W13 · WB1~WB3)은 그대로**, 새 레슨은 사이에 끼워 `W2B` · `W4B` … (파이썬 교과서의 `L3B` 처럼 — 기기에 쌓인 「읽은 레슨」 · 주소가 안 깨지게). 새 만들어 보기는 `WB0` · `WB4`. 레슨 번호(n)는 목차 순서대로 0~28.
- `CONFIG.COURSE_ID_PATTERNS.web` 을 `^(W|WB)\d+[A-Z]?(P\d+)?$` 로(B 붙은 id 도 「읽은 레슨」 에 셈).
- ✏ = 지금 레슨을 그대로 두고 조금 다듬음 · 🆕 = 새로.

### 챕터 1 · HTML — 뼈대 (레슨 5 + 만들어 보기)

| id | 제목 | 쪽(주요 내용) | 만들어 보기 |
| --- | --- | --- | --- |
| W0 ✏ | 웹은 어떻게 동작하나 | 지금 그대로(주소 → 요청 → HTML · CSS · JS) — 끝에 「요청·응답 자세히는 HTTP·API·SDK 교과서(앞으로)」 | 지금 그대로 |
| W1 ✏ | HTML 구조: 태그 · 속성 · 중첩 | 지금 그대로 | 지금 그대로 |
| W2 ✏ | 목록 · 링크 · 이미지 · 표 | 지금 그대로 | 지금 그대로 |
| W2B 🆕 | head 와 의미 있는 태그 · 그림과 영상 | ① `<head>`: `charset` · `viewport` · `title` · `description` · 파비콘 — 「보이지 않지만 꼭」 · ② 의미 있는 구역: `header` · `nav` · `main` · `section` · `article` · `aside` · `footer` — `div` 와 무엇이 다른가(검색 · 화면 읽기 프로그램) · ③ `figure` · `figcaption` · `video controls` · `audio` · 그림 크기와 `loading="lazy"` | 블로그 글 한 편의 뼈대를 의미 있는 태그로(☐ 자동) · head 채우기(☐ 자동) |
| W3 ✏ | 폼: 입력창 · 버튼 · 선택 | 지금 그대로 | 지금 그대로 |
| **WB0** 🆕 | 🛠 레시피 페이지 (HTML 만) | 요리 하나: 제목 · 사진(figure) · 재료(ul) · 순서(ol) · 영양 표(table) · 출처 링크 · 「만들어 봤어요」 후기 폼 — CSS 없이 HTML 만, 의미 있는 태그로 | ☐ 자동 |

### 챕터 2 · CSS 기본 — 모양 (레슨 5)

| id | 제목 | 쪽 | 만들어 보기 |
| --- | --- | --- | --- |
| W4 ✏ | CSS: 선택자 · 색 · 글꼴 · 박스 모델 | 지금 그대로 | 지금 그대로 |
| W4B 🆕 | 누가 이기나: 우선순위 · 상속 · 순서 | ① 같은 곳에 규칙 둘 → 나중 것이 이김(순서) · ② 더 구체적인 선택자가 이김(태그 < `.class` < `#id` < `style=""`) — 점수 세기 · 후손 선택자 `nav a` · 여러 개 `h1, h2` · ③ 상속: 글꼴 · 색은 자식에게, 테두리 · 여백은 안 감 · `!important` 는 쓰지 않기 · F12 Styles 에서 **줄 그어진 규칙** = 진 규칙 | 「왜 안 바뀌지?」 세 가지 고치기(☐ 자동 — 색이 맞게 나오는지) |
| W4C 🆕 | 크기와 단위 | ① `px` · `%` · `em` · `rem`(뿌리 글자 크기 기준 — 글자 크기 설정을 따라감) · `vw` · `vh` · ② `width` 대신 `max-width` · `box-sizing: border-box`(패딩이 넓이를 안 늘림) · ③ `min()` · `max()` · `clamp()` 로 화면에 맞는 크기 | 카드 폭 · 글자 크기를 rem · max-width 로(☐ 자동 — 계산된 px) |
| W4D 🆕 | 꾸미기: 배경 · 테두리 · 그림자 · 변수 | ① `background-color` · `background-image` · `background-size: cover` · 그라데이션 · ② `border-radius` · `box-shadow` · `opacity` · ③ **CSS 변수** `--main: #8e24aa;` · `var(--main)` — 색을 한 곳에서 · 웹 글꼴(`@import` Google Fonts 한 줄) | 버튼 3종(기본 · 강조 · 위험)을 변수로(☐ 자동) |
| W4E 🆕 | 상태에 따라: 가상 클래스 · 전환 · 애니메이션 | ① `:hover` · `:focus-visible` · `:active` · `:disabled` · `:nth-child(odd)` · `::before`/`::after` · ② `transition: background 0.2s` — 부드럽게 바뀌기 · `transform: scale()`/`translate()` · ③ `@keyframes` · `animation` · 움직임을 줄이고 싶은 사람(`prefers-reduced-motion`) | 마우스를 올리면 커지는 카드 · 줄무늬 표(☐ 자동) |

### 챕터 3 · CSS 배치 — 어디에 (레슨 4 + 만들어 보기)

| id | 제목 | 쪽 | 만들어 보기 |
| --- | --- | --- | --- |
| W5 ✏ | 레이아웃: flexbox | 지금 그대로(+ `flex-wrap` · `flex: 1` 한 줄씩) | 지금 그대로 |
| W5B 🆕 | 레이아웃: grid | ① `display: grid` · `grid-template-columns: repeat(3, 1fr)` · `gap` · ② 자동 줄 바꿈 `repeat(auto-fill, minmax(200px, 1fr))` — 미디어 쿼리 없이 반응형 · ③ 칸 넘나들기 `grid-column: span 2` · 이름 붙인 영역 `grid-template-areas` · flex 와 grid 고르기(한 줄 vs 판) | 사진 갤러리(☐ 자동 — 폭에 따라 열 수) · 페이지 판(머리 · 옆 · 본문 · 발) |
| W5C 🆕 | position: 겹치고 붙이기 | ① `static` · `relative` · `absolute`(가장 가까운 relative 부모 기준) · `fixed` · `sticky` · ② 배지 · 툴팁 · 위로 가기 버튼 · 붙어 있는 머리 막대 · ③ `z-index` 와 쌓임 순서 · 흔한 실수(absolute 인데 부모에 relative 없음) | 사진 위 「NEW」 배지 · 스크롤해도 붙어 있는 메뉴(☐ 자동) |
| W6 ✏ | 반응형: 미디어 쿼리 | 지금 그대로(+ 「모바일 먼저」 `min-width` 한 줄) | 지금 그대로 |
| **WB1** ✏ | 🛠 내 소개 페이지 | 지금 것에 grid 갤러리 · sticky 머리 · CSS 변수를 더해(폰 · PC) | ☐ 자동 |

### 챕터 4 · JavaScript 언어 — Console 에서 (레슨 7 + 만들어 보기)

| id | 제목 | 쪽 | 만들어 보기 |
| --- | --- | --- | --- |
| W7 ✏ | JS 를 붙이는 법과 Console · 파이썬과 한눈에 | 지금 그대로(붙이는 법 · Console · 비교표 · 배열 메서드는 W7F 로 옮김 → 비교표는 「한눈에」 로 두고 아래 레슨이 하나씩 자세히) | 지금 그대로 |
| W7B 🆕 | 값과 변수: let · const · 타입 | ① `const` 가 기본 · 바뀌면 `let` · `var` 는 쓰지 않기(이유) · 블록 범위 `{ }` · ② 타입: 숫자(정수/실수 구분 없음 · `0.1 + 0.2`) · 글자 · `true`/`false` · `null` · `undefined` · `typeof` · ③ 바꾸기: `Number("3")` · `String(3)` · `"3" + 1` 은 `"31"` 의 함정 | Console 문제: 타입 맞히기 · 글자 → 숫자(☐ Console 출력 자동) |
| W7C 🆕 | 조건: === · 참 같은 값 · 짧은 조건 | ① `===` · `!==` 만 쓰기(`==` 의 함정 표) · ② 참 같은 값/거짓 같은 값(`0` · `""` · `null` · `undefined` · `NaN` 은 거짓 — 빈 배열 `[]` 은 참!) · ③ `&&` · `||` · `??`(값이 없을 때만 기본값) · `조건 ? a : b` · `switch` | 나이 · 회원 여부로 요금 정하기(☐ Console) |
| W7D 🆕 | 반복 | ① `for (let i = 0; i < n; i++)` · `for (const x of 배열)` · `for (const key in 객체)`(of/in 헷갈림 표) · ② `while` · `break` · `continue` · ③ 반복 대신 메서드로(`forEach` · `map` 맛보기 → W7F) | 구구단 · 별 찍기 · 합계(☐ Console) |
| W7E 🆕 | 함수 | ① `function 이름(a, b = 1) { return … }` · 화살표 `(a, b) => a + b` · 한 줄이면 `return` 생략 · ② 함수를 값처럼: 변수에 담기 · 인자로 넘기기(**콜백** — `setTimeout` · `addEventListener` 가 이것) · ③ 범위와 클로저 맛보기(카운터 만들기) | 할인 함수 · 콜백 받는 `repeat(n, fn)`(☐ Console) |
| W7F 🆕 | 배열과 객체 | ① 배열: `push`/`pop` · `slice`/`splice` · `includes` · `find` · `findIndex` · `sort((a, b) => a - b)`(숫자 정렬 함정) · ② `map` · `filter` · `reduce`(지금 W7 3쪽을 옮겨 늘림) · ③ 객체: 점/괄호 · `Object.keys/values/entries` · 구조 분해 `const { name, price } = item` · 펼치기 `[...a, x]` · `{ ...obj, price: 5000 }` · `JSON.stringify/parse` | 메뉴 배열로 통계 · 가격 올린 새 배열(☐ Console) |
| W7G 🆕 | 글자 · 숫자 · 에러 · 클래스 | ① 글자: 템플릿 `` `${}` `` · `split` · `trim` · `toUpperCase` · `padStart` · `includes` · `replaceAll` · ② 숫자: `toFixed` · `Math.round/floor/max/random` · `toLocaleString()`(4,500) · `NaN` · ③ `try` / `catch` / `throw new Error()` · `class` 와 `constructor` · `this` 맛보기(파이썬 클래스와 비교) | 영수증 한 장 만들기 · 잘못된 입력은 에러로(☐ Console) |
| **WB4** 🆕 | 🛠 Console 가계부 | 화면 없이 JS 만: 거래 배열(날짜 · 내용 · 금액 · 분류) → 분류별 합계(객체) · 가장 큰 지출 · 월별 표(`console.table`) · 잘못된 금액은 에러 · 클래스 `Ledger` 로 정리 | ☐ Console 출력 자동 |

### 챕터 5 · 브라우저와 DOM — 움직이게 (레슨 4 + 만들어 보기)

| id | 제목 | 쪽 | 만들어 보기 |
| --- | --- | --- | --- |
| W8 ✏ | DOM: 요소 찾기 · 바꾸기 · 만들기 | 지금 그대로(+ `closest` · `parentElement` · `children` 로 가족 찾기 한 쪽) | 지금 그대로 |
| W8B 🆕 | 이벤트 자세히 | ① 이벤트 객체 `e` · `e.target` · `e.currentTarget` · 자주 쓰는 이벤트(`click` · `input` · `change` · `keydown` · `submit`) · ② **버블링**: 안쪽에서 생긴 이벤트가 바깥으로 올라감 → **이벤트 위임**(목록 하나에 이벤트 — 지금 W9 2쪽의 그것을 여기서 제대로) · `stopPropagation` · ③ 키보드: `e.key === "Enter"` · 단축키 · `preventDefault` | 버튼 9개 판을 위임 하나로 · Enter 로 추가(☐ 자동) |
| W8C 🆕 | 폼 다루기 | ① 값 읽기: `input.value` · `checkbox.checked` · `select.value` · 라디오 · ② `submit` 가로채기 → `new FormData(form)` · `Object.fromEntries` · ③ 입력하는 대로 반응(`input` 이벤트) · 폼 비우기 `form.reset()` | 설문 폼 → 결과 카드(☐ 자동) |
| W9 ✏ | 상태와 화면 · localStorage | 지금 그대로 | 지금 그대로 |
| **WB2** ✏ | 🛠 할 일 앱 | 지금 것 + 필터(전체 · 남은 일 · 끝낸 일) · 편집(더블클릭) | ☐ 자동 |

### 챕터 6 · 더 단단한 화면 (레슨 4 + 만들어 보기)

| id | 제목 | 쪽 | 만들어 보기 |
| --- | --- | --- | --- |
| W10 🆕 | 기다리는 코드: async · await 와 내 JSON 파일 | ① 줄 순서대로 안 끝나는 코드(`setTimeout`) · ② `Promise` · `async` · `await` · `try`/`catch` · ③ `menu.json` + `fetch("menu.json")` · ④ 불러와 그리기 · 로딩 · 에러(지금 W11 1~2쪽을 옮김) — 끝에 「진짜 서버의 API 는 HTTP·API·SDK 교과서(앞으로)」 | menu.json 불러와 그리기 · 1초 뒤 「저장했어요」(☐ 자동) |
| W11 🆕 | 폼 검사와 접근성 | ① `required` · `type="email"` · `minlength` · `pattern` · `:invalid` · ② JS 로 검사하고 알려 주기(`checkValidity` · `setCustomValidity` · 다 맞을 때만 버튼 켜기) · ③ 접근성: `label` 짝 · `alt` · 버튼은 `<button>` · Tab 으로만 써 보기 · 색 대비 · F12 **Lighthouse → Accessibility** | 회원가입 폼(☐ 자동) · 접근성 고치기(☐ 자동) · 내 소개 페이지 점수 90 이상(☐) |
| W12 🆕 | JS 파일 나누기: 모듈 | ① `<script type="module" src="main.js">` · ② `export` · `import { 이름 } from "./파일.js"` · 파일마다 할 일 하나 · ③ 모듈의 규칙(범위가 파일 안 · `onclick=""` 에서 못 부름 · `file://` 에서 안 됨 — 에러 글 읽기) | 할 일 앱을 store · view · main 으로(☐) · `onclick` 을 `addEventListener` 로(☐ 자동) |
| W13 🆕 | F12 로 고치기와 배포 | ① Sources: 중단점 · 한 줄씩 · 변수 · `debugger;` · ② Elements 에서 바로 고쳐 보기 · Console 에러 → 줄 · ③ GitHub Pages 로 올리기(지금 W13 2쪽을 옮김 — 설정은 GitHub G12 링크) · 폰으로 열기 | 버그 3개 찾아 고치기(☐ 자동) · 🏠 내 소개 페이지를 인터넷에(☐) |
| **WB3** 🆕 | 🛠 카페 주문 화면 | `menu.json`(W10) → 장바구니(상태 · 합계) → 주문 폼 검사(W11) → 주문 내역 localStorage → 모듈(W12) → Pages(W13). 서버로 보내기 없음(HTTP·API·SDK 교과서의 할 일 API 에서 이어짐) | ☐ 자동 |

> 레슨 수: 챕터 1 5 · 2 5 · 3 4 · 4 7 · 5 4 · 6 4 = 29 + 만들어 보기 5(WB0 · WB1 · WB4 · WB2 · WB3) = **34**.

## 6. 「만들어 보기」 모양과 검사

- 지금과 같음 + **Console 검사**(챕터 4): `checks: [{ text, console: '기대 출력 한 줄 또는 여러 줄' }]` — `run_web_solutions.py` 가 예시 답의 `console.log` 를 모아 비교(지금 레슨 예제의 Console 확인을 만들어 보기로 넓힘). 화면에는 「Console 에 이렇게 나오면 성공」 으로.
- `check_book` 은 지금처럼(필요한 문법 링크 · 낱말 · ☐ 필수).

## 7. 시작하기 · 도감 · 허브

- 시작하기 4쪽은 그대로(3쪽 F12 는 챕터 4·6 에서 다시 씀).
- 도감: 쪽 제목이 실제 코드라 새 레슨이 저절로 들어감(`grid-template-columns` · `position: sticky` · `===` · `??` · 구조 분해 · `FormData` · `import`).
- 허브: 카드 이름 「웹·HTTP·API」 → **「웹」**, 문구 「HTML · CSS · JavaScript 를 제대로 — 혼자 화면을 끝까지」, 레슨 수는 챕터를 채울 때마다 늘림(17 → … → 34).

## 8. 만들 순서

1. ✅ **v2.25.0**(11/7 배포): 이 설계 + 목차 뼈대(챕터 6개 · 새 레슨은 「준비 중」) + **챕터 1**(W2B · WB0) + id 모양(`[A-Z]?`) + 허브 이름 「웹」. 지금 챕터 3 의 HTTP 레슨(W10~W13 · WB3)은 **챕터 6 이 완성될 때까지 그 자리에 그대로**(챕터 6 의 이름도 그때까지 「서버와 대화」) — 내용이 비는 때가 없게.
2. ✅ **v2.25.1** 챕터 2(W4B~W4E) · **v2.25.2** 챕터 3(W5B · W5C · WB1 키우기).
3. **v2.25.3** 챕터 4(W7B~W7G · WB4) + Console 검사.
4. **v2.25.4** 챕터 5(W8B · W8C · WB2 키우기).
5. **v2.26.0** 챕터 6(W10~W13 · WB3 새로 — 옛 HTTP 글은 HTTP·API·SDK 교과서로 옮길 때 git 기록에서) — 웹 교과서 완성.
6. 단계마다: `check_book web` · `run_web_solutions.py` · 폰 390/PC · 라이트 QA(`tools/qa_screens.py web`) · 문서(site-intent 2절 · TODO · CHANGELOG · HANDOFF).

## 9. 정한 것과 이유 (기술적 선택 — Claude)

| 무엇 | 정한 것 | 이유 |
| --- | --- | --- |
| 크기 | 설명 레슨 29 + 만들어 보기 5 | 사용자 「몇 쪽으로 충분하냐」 → 아니라서 키움(D16). JS 언어를 7레슨(파이썬을 아는 사람 기준이라 파이썬 39레슨보다 훨씬 짧게, 대신 **차이와 함정** 중심), CSS 를 기본 5 + 배치 4 로 |
| 레슨 id | 지금 id 그대로 + `B` · `C` … 끼워 넣기 | 기기의 읽은 기록 · 주소 · 허브 숫자가 안 깨짐(파이썬 교과서 `L3B` 와 같은 방식) |
| JS 언어 챕터를 Console 로 | 화면 없이 `console.log` | DOM 과 언어를 섞으면 「문법이 틀렸는지 화면 코드가 틀렸는지」 를 초보자가 못 가림. 언어를 먼저 Console 에서 다지고 챕터 5 에서 화면에 씀 |
| 프레임워크(React 등) · TypeScript · 빌드 도구 | 이 교과서 범위 밖 | 「HTML · CSS · JS 만으로 혼자 끝까지」 가 목표. 다음 단계로 이름만 소개 |
| `fetch` 를 웹에 남기는 범위 | 같은 폴더의 JSON 파일만 | 비동기는 JS 언어의 일, 서버와의 대화는 HTTP·API·SDK |
| 챕터 6 을 맨 마지막에 바꿈 | 그동안 옛 HTTP 레슨이 챕터 6 자리에 남음 | 사이트에서 HTTP 내용이 비는 때가 없게(HTTP·API·SDK 교과서를 웹 다음에 만들어도) |
