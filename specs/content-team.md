# 콘텐츠팀 지시서 (Opus) — 파이썬 아카데미

읽는 순서: HANDOFF.md → specs/workflow.md(1·3·7·**8절**) → 이 파일. **권한 구분 없음(11/6)**: 과제에 필요한 것은 무엇이든(콘텐츠·core·tools·문서·버전·릴리스 PR) 직접 한다. main 은 보호 브랜치라 브랜치 `content/<주제>` 에 올리고 PR → 사용자가 머지. 과제가 끝나면 릴리스 PR 까지(workflow 7절). 알아 둘 사실: 기존 문제·레슨 id 를 바꾸면 그 문제의 진행 기록이 끊긴다.

## 1. 스키마 (고치지 말고 그대로 쓴다)

- 파이썬·알고리즘: `courses/python/content.js` 맨 위 주석 + `courses/algo/content.js` 맨 위 주석. 레슨 `{id, ch, n, title, mode, terms, pages[{title, html, example}], summary}` · 문제 `type: quiz|fill|bug|parsons|block|code` (+ 알고 `kind`, `tests[{call,ret}|{input,output}]`, `visualize`, `limits`).
- 수학: `courses/math/content.js` 맨 위 주석. 노드 = 레슨 + `subtitle/level/stars/prereq/star/icon/params[]`, `pages[0].figure`(필수, kind는 `core/figure.js` 주석의 16종만) · `observe` 2~3 · `pages[1].formula/example`. 문제 `quiz kind:'explore' requireInteract` · `num answer:{value,tol,unit,why}`+solution · `match` · `pair` · `code`.
- 규칙: 문제마다 힌트 **정확히 3개**(방향 → 구체 → 거의 정답), 태그 1개 이상(코스의 `WEAKNESS_TAGS` 안에서), 실행형은 테스트 ≥ 4(경계값 포함, 마지막 1개는 숨김), 보스 ≥ 5. `[[용어]]`는 레슨 `terms` 나 `shared/glossary.js`에 있어야 한다. 정답 코드는 CPython으로 돌려 통과해야 한다(`run_solutions.py`). 말투 ~해요체, 초보 기준 비유 먼저.
- 추가 위치: 파일 **끝에** `LESSONS.push(...)`, `PROBLEMS.push(...)`(파이썬·알고리즘) / 수학은 배열 안에 영역별로. `CONFIG.COURSES[].total/lessons`(core/config.js의 숫자 두 개)는 **콘텐츠 수와 같아야 validate가 통과** — 이 숫자 수정은 허용(값만).

## 2. 검증·배포 (푸시 전 필수)

`node tools/validate_content.mjs && node tools/extract.mjs tools/.out && python3 tools/run_solutions.py` → 통과하면 PROBLEMS.md 표 추가 → CHANGELOG 맨 위 `## 미배포` 절에 항목 추가(버전 머리글 없이) → `[content] C4: …` 커밋 → `git push -u origin content/C4-…` → `gh pr create --base main --fill`. **(11/6 개정) 과제가 끝나면 Opus 가 직접 패치 릴리스 PR 을 낸다**(`specs/workflow.md` 7절·`schedule-week.md` 4절 5번: `APP_VERSION` 패치 +1 → `node tools/stamp.mjs` → CHANGELOG 머리글 → HANDOFF 상태판 → `release/vX.Y.Z` PR → 사용자 머지). ~~`APP_VERSION`·stamp·HANDOFF 상태판은 건드리지 않는다**(릴리스 때 Fable). 가능하면 `python3 tools/regress.py`. PR 의 `PR Check` 가 초록이어야 병합된다.

## 3. 과제 목록 (위에서부터, 하나씩 배포)

| # | 과제 | 범위 | 완료 기준 |
| --- | --- | --- | --- |
| C1 ✅ v2.3.2 | **수학 영역 1·3·5 보강 노드** — 기존 그림 16종만으로 만들 수 있는 것: 1-10 「약수의 개수와 완전수」(sieve/bars), 3-9 「기하분포: 몇 번 만에 성공하나」(hist, sim = 첫 성공까지 횟수), 5-9 「두 점 사이 거리와 충돌 판정」(vector, 원 두 개 겹침 판정은 숫자 답·코드로) | `courses/math/content.js`, prereq 는 기존 노드, 노드당 4문제(탐구 2·num 1·code 1) | validate(첫 그림·observe·탐구 퀴즈) 통과, config 총계 갱신 |
| C2 ✅ v2.3.4 | **파이썬 챕터 7 연습 보강** — L19~L23 각 레슨에 `bug` 또는 `fill` 1문제씩(현재 code·quiz 위주) | `courses/python/content.js` 끝 | 힌트 3·테스트 통과 |
| C3 ✅ v2.3.5 | **알고리즘 챕터 6 추적 퀴즈** — A16~A20 각 1문제 `kind:'trace'` + `visualize`(기존 kind: bars/table/grid/callstack) | `courses/algo/content.js` 끝 | 시각화 버튼 동작(QA 확인) |
| C4 | **용어집 보강** — 수학 노드 `terms` 중 공용 가치가 있는 것(나머지·소수·벡터·내적·확률·기댓값 등 20개)을 `shared/glossary.js`로 옮기고 레슨 `terms` 중복 제거 | `shared/glossary.js` | validate 용어 검사 통과 |
| C5 | **힌트 품질 점검** — 파이썬 L0~L8 문제의 힌트 3단계가 "방향→구체→거의 정답" 순서인지, 3단계가 정답 코드와 변수명이 같은지 전수 점검·수정 | `courses/python/content.js` | QA.md에 점검 결과 요약 |

| C6 | **파이썬 L9~L18 힌트 품질 점검** — C5와 같은 기준(방향→구체→거의 정답, 3단계 = 정답 코드와 같은 변수명) | `courses/python/content.js` 기존 힌트 줄만 | QA.md에 C5 형식으로 표 추가 |
| C7 | **알고리즘 A0~A15·AB1~AB3 힌트 품질 점검** — 같은 기준 + `kind:'ct'` 문제는 힌트 3이 입출력 형식까지 | `courses/algo/content.js` 기존 힌트 줄만 | QA.md 표 추가 |
| C8 | **알고리즘 실전 E1~E6 연습 문제** — 실전 레슨마다 프로젝트 전에 푸는 작은 `code` 문제 1개(프로젝트의 한 단계만 떼어낸 것, 테스트 4개) | `courses/algo/content.js` 끝에 push, config algo total(값만) | validate·run_solutions 통과 |
| **C10** (v2.7.0, 사용자 11/5 「콘텐츠는 Opus」) | **「풀 수 있나」 맞추기 — TODO ★4-2·★4-3·★4-4.** ① `node tools/check_level.mjs` 표(파이썬 30·알고 7)에 걸린 문제를 3-2절 규칙대로 고친다. 우선순위: B5P1·B5P2(`is None`·삼항 — 본문에 없음), B7P2(`not in`·`.endswith`), AB5P1(`chr/ord` — A16 본문에 한 쪽 추가), L17(5문제 중 4개가 새 기능 3~5개 — 쉬운 것부터 계단), L4(전 문제가 if/else/비교 3~4개 — 첫 문제는 if 하나만), L14, L15P1·L6P1·L9P1(첫 문제가 가장 무거움 — 순서 바꾸기), X1·X3·X5·X6 프로젝트(새 기능 3~4 — starter 에 더 적어 두기). `(지문○)` 표시는 지문에만 있는 것 — 본문에 한 줄 넣을지 판단. 고친 뒤 `node tools/check_level.mjs --update-baseline`. ② 긴 코드 줄 약 230개(74쪽, L17·X1~X4)를 줄 나눠 쓰기(상자 안 가로 스크롤 없애기). ③ QA-OPEN 파이썬 「중」 #128~#139·타자 연습 #139·#144. | `courses/python/content.js`·`courses/algo/content.js` 내용만 | check_level 걸린 수 감소(baseline 갱신)·validate·run_solutions·regress 통과·고친 레슨은 직접 풀어 보기 |
| **C11** (v2.7.0) | **레슨 나누기 2차**(★2 규칙: 한 레슨 = 개념 하나~둘, 5~6쪽 이하, 문제 3~5개) — 파이썬 L1(7쪽)·L2(8)·L4(7)·L5(8, 종합 점검 1 위치 같이)·L9(8)·L13(7)·L17(8)·L19(7, L16B 와 겹침 → 줄이기)·L20(8)·L21(7)·L18B(개념 5 → map·filter / enumerate·zip·max); 알고리즘 6쪽 레슨 A6·A16·A18·A19. **v2.5.0 방식 그대로**: 문제 id 는 안 바꾸고 lesson 만 옮김, 새 레슨 id 는 알파벳 접미(L4B), n 다시 매김, 본문의 「레슨 N」은 `[[레슨:ID]]` 토큰, CHECKUPS after 갱신, config total/lessons 값. 실전 X1·X3·X4 의 새 문법 쪽은 앞 레슨으로. | `courses/python/content.js`·`courses/algo/content.js` | validate(레슨 토큰)·regress 통과, CHANGELOG 「미배포」에 항목 |
| **C12** (v2.7.0) | **수학 「상」 #145~#147** — M5_eigen 절댓값·바늘 그림, M4_ease 문장(QA.md 고칠 내용대로) → 수학 「중」(11/4 검수: 그림 겹침·점선·숫자 답 안내·퀴즈 정답 첫 보기). 그림 kind 가 새로 필요하면 Fable 에게. | `courses/math/content.js` 값·문구만 | QA.md 닫힘 표시 |
| C9 | **수학 난이도·범위 표기 재점검**(QA #33) — 28노드 `level`(고1/고2/대학)·`stars` 기준을 PROBLEMS.md 수학 절에 적고 맞추기 | `courses/math/content.js` level/stars 값만 — **Fable M2 작업 중이면 M2 배포 뒤에** | QA #33 닫힘 |

C1~C5 완료(v2.3.6). **v2.7.0 부터는 C10(풀 수 있나) → C-T·C-S·C-W(새 코스 채우기, 아래 절) → C11 → C12 → C6~C9 순.** 사용자 결정(11/5): 콘텐츠는 전부 Opus, core 는 Fable. 한 과제 = 한 브랜치 = PR 하나(버전은 릴리스 때 Fable이). 수학 `content.js`는 Fable 이 M2 로 고치는 동안(HANDOFF 상태판 확인) 건드리지 않는다 — C9는 그 뒤. 과제를 끝내면 HANDOFF "다음 후보"의 콘텐츠 줄을 갱신하고 다음 과제로.

## 3-2. 문제 난이도 규칙 (2026-11-05 추가, QA #160)

- 레슨 안 문제는 **쉬운 것 → 합친 것** 순서로 배열한다(배열 순서 = 화면 순서). 첫 문제는 레슨 기능 하나만.
- 정답·힌트 3 은 **본문에서 가르친 꼴**로만 쓴다(접힌 「더 알아보기」만 있는 꼴 금지). 더 짧은 꼴이 있어도 배운 꼴을 쓴다.
- 레슨 기능 3개 이상을 합친 문제는 starter 에 대부분을 적어 두고 학습자가 쓸 줄을 지문에 「가운데 한 줄만」처럼 콕 집는다.
- (v2.4.0) 블록·`dual` 은 없다 — 전부 타자. 새 문제는 `type:'code'` 로, 레슨 앞 두 문제는 starter 에 틀을 적고 지문에 쓸 줄을 콕 집는다. `type:'parsons'` 는 정답 5줄 이상이고 줄 순서·들여쓰기 자체가 연습일 때만(validate 가 4줄 이하를 막는다).
- 새 문제를 넣은 뒤 그 레슨을 **처음부터 직접 풀어 본다**(힌트 없이). 막히면 문제를 고친다.
- (v2.7.0) `node tools/check_level.mjs` 가 위 규칙을 자동으로 잰다(①본문 밖 기능 ②합친 새 기능 3+ ③첫 문제가 가장 무거움, DESIGN 14-2절). 걸린 레슨은 `node tools/check_level.mjs --lesson L11` 로 근거(어느 기능이 정답 몇 줄에서 쓰였고 본문 어디서 처음 나왔는지)를 보고 고친다 — 본문에 그 꼴을 넣거나, 문제 순서를 바꾸거나, starter 에 적어 두고 지문에서 쓸 줄을 콕 집는다. 고친 뒤 `node tools/check_level.mjs --update-baseline` 으로 `tools/check_level.baseline.json` 을 내려 잡고 같이 커밋한다(CI 의 `--gate` 는 걸린 수가 **늘면** 실패). 정규식 측정이라 오탐이 있을 수 있다 — 명백한 오탐은 고치지 말고 PR 에 적어 두면 Fable 이 카탈로그를 손본다.

## 4. 하지 말 것

- 레슨·문제 id 변경, 기존 문제 삭제(진행 데이터가 id로 저장됨). 고칠 땐 내용만.
- `vary` 범위 밖 값, 테스트에 현재 시각·난수(시드 없는) 의존, 5초 넘게 도는 정답 코드.
- (11/6) 그림 kind·문제 type 도 필요하면 새로 만든다(DESIGN 에 한 줄, validate·regress 검사 추가).

## C-W 웹·HTTP·API 채우기 (v2.7.0 뼈대 · Fable 2026-11-05)

코스 `courses/web/`(id `web`). 설계는 EXPANSION.md 8절, 플러그인 계약은 DESIGN.md 16절. **본보기는 레슨 `W0`(쪽 4 + 문제 4, 유형 전부 한 번씩)** — 그 모양 그대로 W1~W13·WB1~WB3 을 채우고 각 레슨의 `draft: true` 를 지운다. 이 절만 읽고 채울 수 있게 썼다.

### 파일과 역할 (core 는 손대지 않는다)
| 파일 | 역할 |
| --- | --- |
| `courses/web/content.js` | **여기만 쓴다.** LESSONS·PROBLEMS(머리 주석에 스키마) |
| `core/runners/web.js` | 미리보기 iframe(srcdoc 샌드박스)·가짜 API 서버·체크 스크립트 `Web.check`. 라우트 표 `Web.api.routes`, 검사 키 `Web.CHECK_DOC` |
| `core/ui-views-web.js` | 문제 유형 `web` 화면(HTML/CSS/JS 탭 + 미리보기 + 출력·네트워크·검사 결과 탭), 레슨 예제 `example.web` |
| `courses/web/course.css` | 코스 전용 CSS (고칠 일 거의 없음) |
| `tools/validate/web.mjs` | web 필드 규칙(아래 표를 자동 검사) |
| `tools/run_web_solutions.py` | 모든 web 문제의 `solution` 을 미리보기에 넣어 checks 전부 ✓ 인지 + starter 가 안 풀어도 통과하지 않는지 + 예제 렌더 |

### 스키마 — 필드별 예시 한 벌
```js
// 레슨 (draft 를 지우고 pages 를 채운다. 보스는 pages:[] 그대로, 문제만 붙인다)
{ id: 'W4', ch: 1, n: 4, title: 'CSS: 선택자·색·글꼴·박스 모델', mode: 'text',
  tutorSummary: '선생님용 요지 한 문단',
  terms: { '선택자': '어느 요소를 꾸밀지 고르는 글. 태그 이름·.class·#id' },   // 본문의 [[선택자]] 가 여기(또는 shared/glossary.js)에 있어야 validate 통과
  pages: [
    { title: '쪽 제목', html: `<p>본문…</p><pre>p { color: blue; }</pre>`,
      example: { web: { html: `<p>문단</p>`, css: `p { color: blue; }` } } },      // js 도 가능. api 를 쓰는 예제는 example.api:{ delay:200 } 로 지연을 줄여도 됨
  ],
  summary: ['한 줄', '한 줄', '한 줄'] }

// web 문제 — HTML/CSS 채점
{ id: 'W4P2', lesson: 'W4', type: 'web', title: '빨간 테두리 상자', xp: 30, tags: ['CSS'],
  prompt: `<p>CSS 탭에서 <code>.box</code> 에 … 하세요.</p>`,
  hints: ['방향', '구체', '거의 정답(정답과 같은 선택자·속성 이름)'],
  web: { tabs: ['html', 'css'],                                  // 편집기에 보일 탭(첫 탭이 기본). html 은 항상
    starter: { html: `<div class="box">상자</div>`, css: `/* .box 에 테두리·안쪽 여백 */\n` },
    checks: [
      { text: '.box 가 있어요', sel: '.box', exists: true },
      { text: '테두리가 2px 빨강이에요', sel: '.box', css: { prop: 'border-top-width', value: '2px' } },   // 축약 속성(border) 말고 longhand 로, 한 항목에 검사 하나
      { text: '테두리 색이 빨강이에요', sel: '.box', css: { prop: 'border-top-color', value: 'red' } },     // 색은 rgb 로 정규화해 비교(red = #f00 = rgb(255,0,0))
      { text: '안쪽 여백이 16px 이에요', sel: '.box', css: { prop: 'padding-top', value: '16px' } },        // px 는 ±2 허용
    ] },
  solution: `<style>\n.box { border: 2px solid red; padding: 16px; }\n</style>\n<div class="box">상자</div>` }   // css 는 <style>, js 는 <script> 로 합친 html 한 문자열

// web 문제 — JS·DOM 채점(동작 뒤 검사)
{ id: 'W9P1', lesson: 'W9', type: 'web', title: '카운터', xp: 30, tags: ['DOM', '이벤트'],
  prompt: `…`, hints: ['…', '…', '…'],
  web: { tabs: ['html', 'js'], starter: { html: `<button id="up">+1</button> <span id="n">0</span>`, js: `// #up 을 누르면 #n 이 1 커지게\n` },
    checks: [
      { text: '버튼과 숫자가 있어요', sel: '#up', exists: true },
      { text: '처음 숫자는 0', sel: '#n', equals: '0' },
      { text: '3번 누르면 3', click: '#up', times: 3, then: { sel: '#n', equals: '3' } },
    ] },
  solution: `<button id="up">+1</button> <span id="n">0</span>\n<script>\nlet n = 0;\ndocument.querySelector('#up').addEventListener('click', () => { n++; document.querySelector('#n').textContent = n; });\n</script>` }

// web 문제 — fetch(가짜 서버) 채점
{ id: 'W11P2', lesson: 'W11', type: 'web', title: '메뉴 불러오기', xp: 30, tags: ['fetch', '비동기'],
  web: { tabs: ['html', 'js'], api: { delay: 200 },                                 // api: delay(ms) · failFirst:n(처음 n번 500) · todos:[…] 시드. failRate 는 채점이 흔들리니 쓰지 않기
    starter: { html: `<button id="load">메뉴 보기</button><ul id="menu"></ul>`, js: `` },
    checks: [
      { text: '버튼을 누르면 메뉴 5개가 목록에 나와요', click: '#load', then: { sel: '#menu li', count: 5 } },   // 가짜 서버 응답이 끝날 때까지 자동 대기(그 뒤 wait ms, 기본 300)
      { text: '첫 메뉴는 아메리카노', sel: '#menu li', contains: '아메리카노' },
    ] },
  solution: `…<script>\ndocument.querySelector('#load').addEventListener('click', async () => { const res = await fetch('https://api.academy.local/menu'); const menu = await res.json(); document.querySelector('#menu').innerHTML = menu.map(m => '<li>' + m.name + '</li>').join(''); });\n</script>` }

// 자유 과제(채점 없음, 「완료로 표시」)
{ id: 'WB1P2', lesson: 'WB1', type: 'web', title: '내 소개 페이지 꾸미기', xp: 10, tags: ['CSS'], prompt: `…`, hints: ['…', '…', '…'],
  web: { tabs: ['html', 'css'], free: true, starter: { html: `…`, css: `…` } } }   // checks·solution 없어도 됨

// 기존 유형: quiz / fill / parsons 는 파이썬 코스와 같다 (W0P2·W0P3 참고). parsons 는 태그 중첩 순서 — 들여쓰기 2칸, 정답 5줄 이상
{ id: 'W1P3', lesson: 'W1', type: 'parsons', title: '중첩 순서 맞추기', tags: ['HTML'], prompt: `…`, hints: ['…', '…', '…'],
  parsons: { solution: `<div>\n  <h2>제목</h2>\n  <ul>\n    <li>하나</li>\n  </ul>\n</div>`, distractors: ['</h2>'] } }
```

### 검사 키(checks) 전체 — 한 항목에 `text` + 검사 하나
| 키 | 뜻 | 비고 |
| --- | --- | --- |
| `sel` | CSS 선택자(첫 번째 일치 요소를 검사, count/exists 는 전부) | `js` 빼고 필수 |
| `exists: true/false` | 있다/없다 | |
| `count: n` 또는 `{min, max}` | 개수 | |
| `equals: '글자'` | textContent 가 정확히(공백은 정리) | `text` 는 체크리스트 문구라서 글자 비교는 `equals` |
| `contains: '글자'` | textContent 에 포함 | |
| `value: '…'` | input/textarea/select 의 값 | |
| `attr: {name, value?}` | 속성 값(value 없으면 존재만) | `href`·`src`·`alt`·`type`·`for` |
| `css: {prop, value}` | getComputedStyle 값. 색은 rgb 정규화, px ±2, font-family 는 포함 | `display:flex`·`justify-content` 등. 축약 속성(margin/border) 대신 longhand(`margin-top`) |
| `js: '식'` | iframe 안에서 식이 참이면 통과 | `localStorage.getItem("todos") !== null` 처럼 DOM 밖 검사에 |
| `click: '#btn'`, `times?` | 누른 뒤 `then` 검사 | `then: { sel, … }` 필수 |
| `input: {sel, value}` | 값 넣고 input/change 이벤트 → `then` | |
| `key: {sel, key:'Enter'}` | 키 이벤트 → `then` | |
| `submit: 'form'` | 폼 제출 이벤트 → `then` | 학습자 코드가 `preventDefault` 를 안 하면 미리보기가 새로고침되니 지문에 적을 것 |
| `wait: ms` | 동작 뒤 기다리는 시간(기본 300, 가짜 서버 응답은 끝날 때까지 자동 대기, 최대 3000) | |
| `viewport: 390` | 그 폭으로 미리보기를 바꾼 뒤 검사(반응형) | `css:{prop:'flex-direction', value:'column'}` 와 같이 |

채점 방식: 「✔ 제출하기」 → 미리보기를 새로 그리고 checks 를 **순서대로** 실행 → 체크리스트(✓/✗ + 「지금: 실제값」) → 전부 ✓ 면 클리어. 실패 항목을 누르면 미리보기에서 그 요소가 빨간 테두리로 강조된다(`sel`·`then.sel`·`click` 대상). 힌트·정답 보기·XP 는 core 가 한다. `solution` 은 「정답 보기」가 그대로 보여 주므로 **학습자가 읽을 수 있게** 줄바꿈해서 쓴다.

### 가짜 API 서버 (`https://api.academy.local`, `Web.api.routes`)
`GET /todos` · `POST /todos {title}`(201, 없으면 400) · `PUT /todos/:id {done,title}` · `DELETE /todos/:id`(204) · `GET /menu`(5개: 아메리카노 3000·카페라떼 3500·바닐라라떼 4000·녹차 3000·치즈케이크 5500) · `POST /orders {items:[{id,qty}]}`(201 {orderId,total}) · `GET /weather?city=서울`(서울·부산·대구·제주·강릉, 없으면 400/404) · `POST /login {user:'student', password:'academy'}`(200 {token}, 틀리면 401) · `GET /me`(헤더 `Authorization: Bearer <token>`). 모르는 주소는 404 `{error}`. 응답은 전부 JSON. 지연은 기본 300~800ms 무작위 — 채점용 문제는 `web.api.delay: 200` 처럼 고정. 에러 처리 레슨(W11·WB3)은 `api.failFirst: 1`(첫 요청만 500) 로 결정적으로. 다른 주소(진짜 인터넷)는 샌드박스라 대부분 실패하고 네트워크 탭에 「연결 실패」로 뜬다 — 지문에서 쓰지 말 것.

### 레슨별 무엇을 쓸지 (EXPANSION 8절 표 · 각 레슨 쪽 4~5 + 문제 4~5, 총 65문제 이상)
| 레슨 | 쪽(개념) | 문제(유형) |
| --- | --- | --- |
| W1 HTML 구조 | 문서 뼈대·중첩과 들여쓰기·속성·h1~h3/p/div/br | web(제목+문단 구역), fill(닫는 태그), parsons(중첩 5줄+), quiz(속성 위치) |
| W2 목록·링크·이미지·표 | ul/ol/li·a href·img src/alt·table·시맨틱 | web(목록 3개 `count`), web(링크 `attr:href` + 이미지 `attr:alt`), web(표 `count: tr`), quiz(alt 가 왜 필수) |
| W3 폼 | input 종류·label for·select·textarea·button·제출 뜻 | web(`attr:type`, `attr:for`), fill, quiz(제출이 무엇을 보내나), web(select `count: option`) |
| W4 CSS | 선택자 3종·색/글꼴·박스 모델·width | web(css color/font-size), web(padding/border longhand), bug 대신 web(선택자 오타 starter → 고치기), quiz(박스 모델 그림) |
| W5 flexbox | display:flex·justify/align·gap·flex:1 | web(`css: display flex`), web(`justify-content`), web(`gap`), quiz(가운데 정렬의 역사) |
| W6 반응형 | 폰/PC 전환·@media max-width·모바일 먼저·viewport meta | web(`viewport:390` + `flex-direction: column`), web(PC 폭 `row`·폰 `column` 둘 다), quiz(min/max-width), fill(@media 문법) |
| WB1 보스 | — | web 1개(checks 10 안팎 + viewport) + free 1개(xp 10) |
| W7 JS 기초 | 비교표·세미콜론/중괄호·console.log·템플릿 문자열·에러 읽기 | web(`js` 식 검사: 변수·함수 결과), quiz(파이썬↔JS 대응), fill(`let`/`const`), web(console.log 는 체크 불가 → `#out` 에 textContent 로 쓰게) |
| W8 DOM | 트리·querySelector·textContent/innerHTML·classList·createElement·이벤트·preventDefault | web(click→equals), web(input→then), web(createElement count), web(submit + preventDefault), quiz |
| W9 상태와 화면 | 상태→render·카운터·배열 목록·filter 삭제·localStorage | web(카운터 times:3), web(목록 추가 input+click→count), web(`js: localStorage.getItem(...)`), quiz(JSON.stringify 왜) |
| WB2 보스 | — | web 1개(추가·완료·삭제·저장 체인 8 안팎) |
| W10 HTTP | 요청/응답 구조·메서드 4·상태 코드 5·헤더·JSON | quiz×2(메서드·상태 코드), fill(JSON), web(네트워크 탭 읽기: fetch 하고 상태를 `#status` 에 쓰기 → equals '200'), web(404 를 받아 `#msg` 에 쓰기) |
| W11 fetch | 비동기 이유·async/await·res.json·로딩 표시·에러 처리·POST | web(GET 목록), web(로딩 글자 → 결과), web(POST 201 → 응답 id 표시), web(failFirst:1 → 「다시 시도」 click 뒤 성공), quiz |
| W12 파이썬 requests | requests.get/post/json/status_code·API 키·공개 API 읽기 | quiz×2, fill(requests.get(url).json()), parsons(요청→확인→파싱 5줄). **코드 실행 문제(type:'code')를 넣으려면 Pyodide 가 필요** — `courses/web/index.html` 에 `core/runners/python.js` 를 web.js 앞에 추가하고 Fable 에게 「Pyodide 쪽 requests 미니 모듈(가짜 서버로 가는)」을 core 요청으로 올린다. 그 전엔 읽기·퀴즈·빈칸으로 |
| W13 REST·배포 | 자원+메서드 규칙·Flask 10줄 읽기·정적 사이트·GitHub Pages | quiz×3(좋은 주소·메서드 고르기·배포), fill(Flask 데코레이터), web(REST 주소 표를 표로 그리기 `count: tr`) |
| WB3 보스 | — | web 1개(GET /menu → 표시 → click 주문 → POST /orders → `#result` contains '주문' + failFirst:1 재시도) |

### 검증 순서(푸시 전 필수)
1. `node tools/validate_content.mjs` — web 규칙(`tools/validate/web.mjs`)까지 통과. draft 를 지운 레슨은 문제 3개 이상 경고.
2. `python3 tools/run_web_solutions.py` — 모든 web 문제의 solution 이 전부 ✓, starter 는 전부 ✓ 이면 안 됨(= 안 풀어도 통과), 예제 JS 에러 없음.
3. `python3 tools/regress.py` 의 `[코스 web]` 절 FAILS 0 (W0 가 본보기라 W0P1·W0P4·W0P2 의 지문·checks·id 는 바꾸지 말 것).
4. 그 레슨을 **처음부터 직접 풀어 본다**(힌트 없이). 폰 폭(미리보기 「폰」 버튼)에서도 본다.
5. `CONFIG.COURSES` 의 web 항목: 다 차면 `preview:true` 를 지우고 `ready:true, total:문제수, lessons:레슨수` 로(값만).

### 하지 말 것
- 검사 키가 모자라면(예: `hover`, 스크롤) `core/runners/web.js` `Web.check` 에 직접 추가해도 된다(`[core]` 커밋 + `tools/validate/web.mjs` 키 목록 + `Web.CHECK_DOC` + regress 검사 1개).
- id 규칙 밖 id(`W<n>`·`WB<n>`·`W<n>P<m>`·`WB<n>P<m>` 만), 기존 id 변경, W0 문제 삭제.
- `draft: true` 를 지우기 전에 pages 가 비어 있거나 `TODO` 가 남은 채 두기. 보스는 `pages:[]` 가 정상.
- checks 한 항목에 검사 키 두 개(첫 것만 적용되고 경고), `text` 를 글자 비교로 쓰기(`equals`), `api.failRate`(무작위) 로 채점.
- `<script>` 안에서 `</script>` 문자열, 진짜 인터넷 주소 fetch, `alert` 로 결과 보여 주기(출력창에만 뜨고 체크 불가 — DOM 에 쓰게).

## C-T 터미널·Git 채우기 (v2.7.0 뼈대 · 2026-11-05, Fable)

코스 `courses/terminal-git/`(id `terminal-git`). 뼈대(엔진·화면·검증)는 다 있고 **레슨 본문·문제만** 채운다. 이 절만 읽고 작업할 수 있게 썼다. 본보기는 **T0(레슨 4쪽 + 문제 4개)** 와 **TB1P1(보스 미션)** — `courses/terminal-git/content.js` 를 먼저 읽을 것.

### C-T.1 무엇이 있나 (건드리지 않는다)
- `core/runners/shell.js` — 가상 FS·셸 20개 명령·Git 시뮬레이터. 지원 명령: `pwd ls(-l -a) cd mkdir(-p) touch cat echo rm(-r -f) cp(-r) mv head tail wc grep(-n -i -r) find(-name) tree history clear edit`, 파이프 `|`, `> >>`, `*`, `~ . ..`, `$HOME $USER`, `&&` `;`. Git: `init status add commit(-m -am --amend) log(--oneline --graph --all) diff(--staged) restore(--staged) reset(--soft --mixed --hard HEAD~n) branch(-d) switch(-c) checkout(-b) merge(--abort) rebase(--abort) stash(push pop list) remote(add -v) push(-u) pull clone tag`. **없는 명령은 쓰지 말 것**(`grep -l`, `git cherry-pick`, `git rebase -i`, `ls -R`, `sed`, `nano` 없음) — `tools/run_shell_solutions.mjs` 가 `command not found` 를 잡는다.
- `core/ui-views-shell.js` — 화면: 터미널 창·파일 트리·Git 3칸 상태 뷰·커밋 그래프·목표 체크리스트·`edit` 편집창. `core/engine.js` 끝 `Grader.matchState` — 상태 비교 키.
- 에러 문구는 실제 bash/git 영문 그대로 나오고 한국어 풀이는 `shared/errors.js` 의 `ERRORS_SHELL` 이 붙인다(본문에서 에러를 보여 줄 때 그 문구를 그대로 인용하면 된다).

### C-T.2 문제 유형 4개와 채점
| type | 어디서 채점 | 필드 |
| --- | --- | --- |
| `mission` (미션, 메인 유형·문제의 절반 이상) | 명령마다 `Shell.state()` 를 `goals[].expect` 와 `Grader.matchState` 로 대조 → 체크리스트 ✓. 전부 달성해야 제출 버튼이 켜지고, 제출 시 `expect`(없으면 goals 합집합) + `forbid` 로 최종 판정 | `setup` `goals` `expect?` `forbid?` `solution` `xp`(선택, 기본 25) `grader:'state'` |
| `quiz` + `kind:'cmd'` (명령 맞히기) | 기존 퀴즈 그대로(즉시 채점) | `quiz:{opts:[<code>명령</code>×4], ans, why}` |
| `fill` (명령 빈칸) | 기존 빈칸 그대로 | `fill:{code:'터미널 장면', blanks:[{a:['pwd']}], why}` |
| `parsons` (명령 순서) | 줄 순서만(들여쓰기 없음). 셸 실행 채점은 화면에서 하지 않는다 | `parsons:{solution}`(5줄 이상) = `solution`, `setup`, `tests:[{expect}]`(Node 검증 도구가 명령을 차례로 실행해 확인) |

`kind:'cmd'` 가 아닌 일반 quiz(개념 퀴즈)도 된다. 다른 type(code·bug·num…)은 이 코스에서 금지(validate 가 막는다).

### C-T.3 스키마 — 필드별 예시 (전부 선언형: 함수·정규식 금지)
```js
// 미션
{ id: 'T2P1', lesson: 'T2', type: 'mission', title: '미션: 작업 폴더 만들기', xp: 25, tags: ['파일조작'],
  prompt: '<p>홈에 <code>work</code> 폴더를 만들고 그 안에 빈 파일 <code>todo.txt</code> 를 만드세요.</p>',
  setup: { cwd: '/home/me', tree: { home: { me: { 'memo.txt': 'hi\n' } } } },          // 객체=폴더, 문자열=파일 내용. cwd 생략 시 /home/me
  goals: [ { text: '<code>work</code> 폴더 만들기', expect: { dirs: ['/home/me/work'] } },
           { text: '그 안에 <code>todo.txt</code>', expect: { files: { '/home/me/work/todo.txt': '' } } } ],
  grader: 'state', expect: { dirs: ['/home/me/work'], files: { '/home/me/work/todo.txt': '' } }, forbid: ['rm -r'],
  solution: 'mkdir work\ntouch work/todo.txt',                                       // 줄마다 명령 하나. edit 는 edit 파일 "내용" 꼴로만
  hints: ['폴더는 mkdir, 빈 파일은 touch', 'touch 는 경로를 받아요: touch work/todo.txt', 'mkdir work → touch work/todo.txt'] }
// Git 미션: setup.git 으로 저장소를 미리 만든다(커밋 목록은 순서대로 쌓인 스냅샷). remote 는 가짜 origin
{ id: 'T9P1', lesson: 'T9', type: 'mission', title: '미션: 마지막 커밋 취소', xp: 30, tags: ['되돌리기'],
  prompt: '<p>실수로 올린 마지막 커밋을 취소하되 <b>작업 내용은 남기세요</b>.</p>',
  setup: { cwd: '/home/me/app', git: { root: '/home/me/app', branch: 'main', commits: [ { message: 'init', files: { 'a.txt': '1\n' } }, { message: 'oops', files: { 'a.txt': '1\n', 'secret.txt': 'KEY\n' } } ] } },
  goals: [ { text: 'main 의 커밋이 1개로', expect: { branchCommits: 1 } }, { text: 'secret.txt 는 그대로 남아 있기', expect: { files: { 'secret.txt': { includes: 'KEY' } } } } ],   // git 미션의 files 경로는 저장소 루트 기준 상대 경로도 됨
  grader: 'state', expect: { branchCommits: 1, head: 'main', files: { 'secret.txt': { includes: 'KEY' } } }, forbid: ['--hard'],   // commits 는 reset 뒤에도 남는 커밋 객체까지 세므로(2), 브랜치 기준은 branchCommits
  solution: 'git reset --soft HEAD~1', hints: ['reset 의 세 가지 중 "작업 내용을 잃지 않는" 것', 'HEAD~1 은 한 커밋 전', 'git reset --soft HEAD~1 (또는 --mixed)'] }
// 명령 퀴즈
{ id: 'T2P3', lesson: 'T2', type: 'quiz', kind: 'cmd', title: '폴더째 지우려면?', tags: ['파일조작'], prompt: '<code>old/</code> 폴더와 그 안의 파일을 전부 지우려면?',
  quiz: { opts: ['<code>rm old</code>', '<code>rm -r old</code>', '<code>rmdir -a old</code>', '<code>del old</code>'], ans: 1, why: 'rm 은 파일만 지워요. 폴더는 -r(recursive, 안쪽까지). 되돌릴 수 없으니 ls 로 먼저 확인!' },
  hints: ['폴더에 rm 만 치면 "Is a directory" 에러', '안쪽까지 재귀로', '두 번째'] }
// 빈칸 (터미널 장면)
{ id: 'T3P2', lesson: 'T3', type: 'fill', title: '빈칸: 이어 쓰기', tags: ['파일조작'], prompt: '기존 내용을 지우지 않고 한 줄을 덧붙이세요.',
  fill: { code: 'me@academy:~$ echo 우유 ___1___ list.txt\nme@academy:~$ cat list.txt\n빵\n우유', blanks: [{ a: ['>>'] }], why: '> 는 덮어쓰기, >> 는 이어 쓰기예요.' }, hints: ['꺾쇠 하나는 덮어써요', '꺾쇠 두 개', '>>'] }
// 명령 순서
{ id: 'T7P4', lesson: 'T7', type: 'parsons', title: '순서: 첫 커밋까지', tags: ['커밋'], prompt: '빈 폴더를 저장소로 만들고 첫 커밋을 남기는 순서로 놓으세요.',
  setup: { cwd: '/home/me/app', tree: { home: { me: { app: { 'main.py': 'print(1)\n' } } } } },
  parsons: { solution: 'git init\ngit status\ngit add main.py\ngit status\ngit commit -m "첫 커밋"', distractors: ['git push'] }, solution: 'git init\ngit status\ngit add main.py\ngit status\ngit commit -m "첫 커밋"',
  tests: [{ expect: { commits: 1, clean: true } }], hints: ['init 이 가장 먼저', 'add 한 뒤에 commit', 'init → status → add → status → commit'] }
```
`expect` 키 전부(`Grader.matchState`): `cwd cwdStartsWith files dirs noFiles git commits branchCommits branches noBranches head staged stagedEmpty clean noConflictMarkers tags messages lastMessage remoteBranches pushed stash forbid historyIncludes`.
- `files: { 경로: 내용(끝 공백 무시) | null(없어야 함) | {includes} | {excludes} | {lines:n} }`, `commits: 2 | {min:2}`(저장소의 모든 커밋 객체 수 — reset 으로 떼어 낸 커밋도 센다), `branchCommits: 2`(지금 브랜치에서 닿는 커밋 수 — 되돌리기 문제는 이것), `messages:['init','fix']`(순서대로 포함), `remoteBranches:{origin:['main']}`, `pushed:true`(현재 브랜치가 origin 과 같음), `historyIncludes:['git log']`(명령을 썼는지), `forbid:['rm -rf']`(쓰면 실패).
- 절대 경로는 `/home/me/...`. Git 미션에서 상대 경로는 저장소 루트 기준, Git 없는 미션에서는 `/home/me/` 기준.
- **goals 는 2~5개, 작은 단계로**(초보자가 한 칸씩 ✓ 보는 것이 보상). 시작 상태에서 이미 달성되는 goal 은 피한다(전부 달성이면 검증 도구가 실패시킨다).
- 레슨 예제: `pages[].example = { shell: 'mkdir a\ncd a\npwd', setup: {...} }`. `example.code`(파이썬) 금지. 의도적으로 에러를 보여 주는 예제는 `expectErrors: true`.
- 레슨 공통: `pages` 3~5쪽(개념 → 명령 → 실수와 에러), `summary` 3줄, `tutorSummary`, 용어는 `terms:{}` 에 넣고 본문에서 `[[용어]]`. 레슨당 문제 4~5개(미션 2 + 나머지 2~3), 보스 레슨(TB*)은 `boss:true` 미션 1개(goals 3개 이상, `tests` 없음).
- 채우면 그 레슨의 `draft: true` 를 지운다. id 규칙 `T<n>`·`T<n>P<k>`·`TB<n>`·`TB<n>P1`.

### C-T.4 레슨별 무엇을 쓸지 (EXPANSION.md 6절 표 + content.js tutorSummary)
| 레슨 | 제목 | 쓸 것 (tutorSummary 그대로) |
| --- | --- | --- |
| T0 ✅ | 터미널이란 | 본보기 완성. 손대지 않는다 |
| T1 | 어디 있나, 뭐가 있나, 이동 | pwd ls(-l -a) cd. 절대 경로(/부터)와 상대 경로(지금 폴더 기준), `.` `..` `~`. cd 뒤에 아무것도 없으면 홈. 에러 `No such file or directory` |
| T2 | 만들고 복사하고 옮기고 지우기 | mkdir(-p) touch cp(-r) mv rm(-r). rm 은 휴지통이 없어 되돌릴 수 없음 강조. mv 는 이름 바꾸기에도. -r 의 뜻 |
| T3 | 파일 안 보기와 쓰기 | cat head tail echo, `>`(덮어쓰기) `>>`(이어 쓰기) 그림, `edit` 가상 편집기 소개 |
| T4 | 찾기 | find -name(이름), grep -n -i -r(내용), 와일드카드 `*`, 결과 읽기 |
| T5 | 조합 | 파이프 `\|`(왼쪽 출력 → 오른쪽 입력), wc -l, history, $HOME 맛보기, Tab/↑ |
| TB1 ✅ | 보스: 엉망인 폴더 정리 | 완성(TB1P1). 손대지 않는다 |
| T6 | 버전 관리가 왜 필요한가 | 최종_진짜최종.py 이야기, 스냅샷 개념, Git(도구) vs GitHub(사이트) 표. 실행 없는 개념 레슨 — 문제는 quiz 위주 + 미션 1개(`git init` 해 보기) |
| T7 | init, add, commit, status | 3칸 상태(작업 폴더 → 스테이징 → 저장소). init/add/commit -m/status 순서, status 출력 읽기(untracked/staged/modified). Git 미션이면 화면의 3칸 상태 뷰가 자동으로 켜진다 |
| T8 | log와 diff, 커밋 메시지 | log(--oneline), diff(작업↔스테이징)와 diff --staged(스테이징↔마지막 커밋), 좋은 메시지(무엇을 왜, 50자) 예/나쁜 예 |
| T9 | 되돌리기 | restore(파일), restore --staged(스테이징 빼기), reset --soft/--mixed/--hard HEAD~n 과 「무엇을 잃는가」 표. --hard 는 되돌릴 수 없다 |
| T10 | .gitignore와 올리면 안 되는 것 | .gitignore 문법 3가지(`*.log`, `__pycache__/`, `.env`), 올리면 안 되는 것 표(비밀키·빌드 산출물·큰 파일), 이미 커밋한 비밀키는 역사에 남는다 |
| TB2 | 보스: 의미 있는 커밋 3개 | 주어진 폴더를 저장소로 만들고 변경을 의미 단위 3개의 커밋으로(.gitignore 포함). expect: commits 3·messages·files(.gitignore)·clean |
| T11 | 원격과 로컬 | remote add origin, push -u origin main, pull, clone. 로컬↔원격 그림. (가짜 GitHub 탭은 뼈대에 없음 — 커밋 그래프의 `origin/main` 라벨로 대신) |
| T12 | 브랜치는 라벨이다 | branch(목록·-d), switch(-c), checkout 호환. 브랜치 = 커밋을 가리키는 라벨, HEAD = 지금 있는 라벨. 커밋하면 라벨이 따라온다(그래프 패널) |
| T13 | merge와 충돌 | fast-forward vs 3-way 그림. 같은 파일 같은 줄을 양쪽에서 바꾸면 충돌: `<<<<<<< ======= >>>>>>>` 마커를 `edit` 로 고치고 add·commit. 편집창의 내 것/상대 것/둘 다 버튼 |
| T14 | stash와 rebase 맛보기 | stash(push/pop) 서랍 그림, rebase 전후 그래프, merge 와 rebase 차이, 공유한 커밋은 rebase 하지 않기 |
| T15 | 실수 복구 시나리오 5개 | 잘못된 브랜치에 커밋(branch+reset), 메시지 오타(commit --amend), 파일 실수로 삭제(restore), 비밀키 커밋(역사에 남음·키 폐기), 충돌 중 포기(merge --abort). 각각 「상황 → 명령 → 확인」 |
| T16 | 협업 흐름과 실제 GitHub | fork → 브랜치 → PR → 리뷰 → merge 개념. 실제 GitHub 체크리스트(계정·저장소·토큰·첫 push). 실행 없는 개념 레슨 — quiz 위주 |
| TB3 | 보스: 충돌 해결하고 푸시 | setup.remote 에 동료 커밋, setup.git 에 내 커밋(같은 파일 다른 내용, `remoteBranch:true`). pull → 충돌 → edit → add → commit → push. expect: noConflictMarkers·pushed·commits |

### C-T.5 검증 명령 (순서대로, 전부 통과해야 푸시)
```
node tools/validate_content.mjs          # 스키마 + tools/validate/terminal-git.mjs(미션 필드·expect 키·parsons·example.shell)
node tools/run_shell_solutions.mjs       # 모든 미션·순서 문제의 solution 을 셸 시뮬레이터로 돌려 goals/expect 통과, 예제 명령 오타 검사 (--verbose 로 출력 보기)
node tools/test_shell.mjs                # 셸 엔진 자가 테스트(건드리지 않았으면 그대로 통과)
python3 tools/regress.py                 # 브라우저 회귀(terminal-git 절 포함, 약 4분)
```

### C-T.6 하지 말 것
- 셸 명령이 부족하면 `core/runners/shell.js` 에 추가해도 된다(`[core]` 커밋 + `tools/test_shell.mjs` 에 케이스 + DESIGN 15절 한 줄). 급하면 "이 연습 터미널에서는 지원하지 않아요" 로 돌려 쓰고 HANDOFF 「Fable 요청」에 적는다.
- 셸이 모르는 명령·옵션을 정답/예제에 쓰지 않기. `edit 파일` 만 적은 solution 은 Node 에서 안 돌아간다(`edit 파일 "내용"`).
- 문제 데이터에 함수·정규식 넣지 않기. `vary` 없음. `tests` 는 parsons 에만.
- 레슨·문제 id 변경 금지, T0·TB1P1 수정 금지, 채운 레슨은 `draft` 를 지우고 아직인 레슨은 두기. 레슨을 다 채우면 `core/config.js` 의 COURSES 항목(`preview` → `ready·total·lessons`)은 Fable 이 바꾼다.

## C-S 데이터베이스(SQL) 채우기 (v2.7.0 뼈대 → 콘텐츠, Opus)

뼈대(Fable, 11/5)가 세운 것: `courses/sql/`(course.json·index.html·content.js·course.css·datasets.js), `core/runners/sql.js`(sql.js 1.13.0 CDN 로더, 한국어 에러 풀이), `core/ui-views-sql.js`(쿼리 작업판·결과 표·스키마 패널·채점), `tools/validate/sql.mjs`, `tools/run_sql_solutions.py`, `tools/gen_sql_dataset.py`. **S0 가 완성본이자 본보기** — 쪽 4개(개념 → 표·행·열 → 첫 SELECT(example.sql) → 정리), 문제 4개(sql rows / quiz 결과 예측 / fill 키워드 빈칸 / sql rows WHERE). 나머지 S1~S13·SB1~SB3 는 `draft: true` 로 제목·tutorSummary·「무엇을 쓸지」(pages[0].html 의 TODO 줄)만 있다. 설계 원문은 EXPANSION.md 7절, 플러그인 계약은 DESIGN.md 16절.

### 스키마 (content.js 머리 주석과 같음 — 필드별 예시 한 벌)

```js
// 레슨
{ id: 'S1', ch: 1, n: 1, title: 'SELECT·WHERE 로 고르기', mode: 'text',
  tutorSummary: '한 문단 요지(선생님 프롬프트용)', terms: { 'LIKE': '패턴으로 글자를 찾는 조건 (% 는 아무 글자 여러 개, _ 는 한 글자)' },
  pages: [
    { title: '비교로 고르기', html: `<p>…[[LIKE]]…</p><pre>SELECT name FROM menu\nWHERE price >= 5000</pre>`,
      example: { sql: `SELECT name, price\nFROM menu\nWHERE price >= 5000`, dataset: 'cafe' } },   // autoRun: false 면 자동 실행 안 함, schema: false 면 스키마 패널 숨김
  ],
  summary: ['한 줄', '한 줄', '한 줄'] }
// 문제: 쿼리 작성 (type 'sql', expect.kind 'rows')
{ id: 'S1P1', lesson: 'S1', type: 'sql', title: '5000원 이상 메뉴', xp: 25, tags: ['WHERE'],
  prompt: `<p><code>menu</code> 에서 <b>price 가 5000 이상</b>인 행의 <code>name</code>, <code>price</code> 를 보여 주세요.</p>`,
  hints: ['WHERE 뒤에 비교식', 'price >= 5000', 'SELECT name, price FROM menu WHERE price >= 5000'],
  starter: 'SELECT name, price\nFROM menu\n', solution: 'SELECT name, price FROM menu WHERE price >= 5000',
  sql: { dataset: 'cafe', expect: { kind: 'rows' } } }                       // ordered: true (ORDER BY 문제) · columns: true (AS 로 열 이름을 요구할 때) · query: 정답과 다른 쿼리로 기대 결과를 만들 때
// 문제: 데이터 바꾸기 (expect.kind 'state' — 실행 뒤 table 의 전체 행을 비교)
{ id: 'S8P2', lesson: 'S8', type: 'sql', title: '커피 500원 인상', xp: 30, tags: ['수정'],
  prompt: `<p>커피 카테고리 메뉴의 가격을 500원씩 올리세요.</p>`, hints: ['UPDATE … SET … WHERE', "SET price = price + 500", "UPDATE menu SET price = price + 500 WHERE category = '커피'"],
  solution: "UPDATE menu SET price = price + 500 WHERE category = '커피'", sql: { dataset: 'cafe', expect: { kind: 'state', table: 'menu' } } }
// 문제: 틀린 곳 고치기 (설계의 「버그 찾기 15%」 — bug 유형은 파이썬 실행을 전제하므로 sql + starter 로)
{ id: 'S4P3', lesson: 'S4', type: 'sql', title: '틀린 JOIN 조건 고치기', xp: 30, tags: ['JOIN'],
  prompt: `<p>아래 쿼리는 주문과 손님을 잘못 잇고 있어요. <b>ON 조건의 틀린 곳을 고치세요.</b></p>`,
  starter: 'SELECT o.id, c.name\nFROM orders o\nJOIN customers c ON o.id = c.id', solution: 'SELECT o.id, c.name FROM orders o JOIN customers c ON o.customer_id = c.id',
  hints: ['주문 표의 어느 열이 손님을 가리키나요', 'orders.customer_id 가 customers.id 를 가리켜요', 'ON o.customer_id = c.id'], sql: { dataset: 'cafe', expect: { kind: 'rows' } } }
// 문제: 결과 예측 (quiz — 기존 유형. quiz.code 가 지문 아래 코드 상자에 나온다. why 는 글자 그대로(HTML 금지))
{ id: 'S2P3', lesson: 'S2', type: 'quiz', title: '결과 예측: LIMIT', xp: 10, tags: ['정렬'],
  prompt: `<p>아래 쿼리의 결과는 몇 행일까요?</p>`, quiz: { code: 'SELECT name FROM menu ORDER BY price DESC LIMIT 3', opts: ['1행', '3행', '10행', '에러'], ans: 1, why: 'LIMIT 3 은 위에서 3행만 남겨요.' },
  hints: ['LIMIT 이 행 수를 자른다', 'LIMIT 3', '3행'], solution: 'SELECT name FROM menu ORDER BY price DESC LIMIT 3' }
// 문제: 빈칸 (fill — 채점은 글자 그대로 비교. 키워드는 대·소문자 둘 다 a 에)
{ id: 'S3P2', lesson: 'S3', type: 'fill', title: '빈칸: 카테고리별 개수', xp: 15, tags: ['그룹'],
  prompt: `<p>카테고리별 메뉴 개수를 세는 쿼리예요.</p>`, fill: { code: 'SELECT category, ___1___(*)\nFROM menu\n___2___ category', blanks: [{ a: ['COUNT', 'count'] }, { a: ['GROUP BY', 'group by'] }], why: 'COUNT(*) 는 행 수, GROUP BY 는 묶는 기준이에요.' },
  hints: ['세는 함수', 'COUNT', 'GROUP BY category'], solution: 'SELECT category, COUNT(*)\nFROM menu\nGROUP BY category' }
// 문제: 절 순서 맞추기 (parsons — 정답 5줄 이상, 한 줄 = 한 절)
{ id: 'S3P4', lesson: 'S3', type: 'parsons', title: '절 순서: 카테고리별 평균가', xp: 20, tags: ['그룹'],
  prompt: `<p>절을 올바른 순서로 놓으세요.</p>`, parsons: { solution: 'SELECT category, AVG(price) AS avg_price\nFROM menu\nWHERE is_hot = 1\nGROUP BY category\nORDER BY avg_price DESC', distractors: ['HAVING price > 4000'] },
  hints: ['SELECT 가 먼저', 'FROM → WHERE → GROUP BY → ORDER BY', '정답 순서 그대로'], solution: 'SELECT category, AVG(price) AS avg_price\nFROM menu\nWHERE is_hot = 1\nGROUP BY category\nORDER BY avg_price DESC' }
```

### 채점 방식 (core/ui-views-sql.js `SqlUI.grade`)

- `kind:'rows'`: 깨끗한 DB 두 개에 내 쿼리와 `solution`(또는 `expect.query`)을 각각 실행해 **결과 집합**을 비교. 기본은 열 순서·행 순서 무시(열 이름이 같으면 이름으로 맞추고, 다르면 행 안의 값으로 비교), 실수는 소수 2자리 반올림. `ordered:true` 면 행 순서 검사(ORDER BY 문제만), `columns:true` 면 열 이름(대소문자 무시) 검사(AS 문제만). 열 개수·행 수가 다르면 「n행이 더/덜 나왔어요 — WHERE 를 보세요」 자동 힌트, 값이 다르면 「기대 / 내 결과」 표를 나란히 + 다른 셀 빨강.
- `kind:'state'`: 내 쿼리(여러 문장 가능, `;` 로 구분)를 실행한 뒤 `expect.table` 의 `SELECT *` 전체 행을 정답 실행 뒤와 비교(행 순서 무시, 열 이름 검사). INSERT·UPDATE·DELETE·CREATE TABLE·트랜잭션 문제에 쓴다. 문제마다 **항상 새 DB** 로 채점하니 「앞 문제에서 넣은 행」은 없다 — 지문도 그렇게 쓴다.
- 외래 키 검사는 **켜져 있다**(`PRAGMA foreign_keys = ON`, 브라우저·CI 동일). order_items 가 가리키는 menu 행을 DELETE 하면 `FOREIGN KEY constraint failed` 가 난다 — S8 의 DELETE 문제는 참조되지 않는 행(예: 새로 INSERT 한 행, shifts)으로 내거나 그 에러 자체를 가르친다.
- 실행 화면의 DB 는 실행 사이에 유지된다(INSERT 뒤 SELECT 로 확인 가능). WHERE 없는 DELETE/UPDATE 도 실행되며 「모든 행이 바뀌었어요!」 경고 + 데이터 초기화 버튼이 뜬다(S8 의 포인트). 채점은 늘 새 DB.
- quiz·fill·parsons 는 기존 core 채점(SQL 을 실행하지 않음). **bug 유형과 code(파이썬) 유형은 이 코스에서 금지**(validate 가 막음) — 틀린 곳 고치기는 `sql` + starter, S13(파이썬 sqlite3)은 quiz·fill 로 내고 실행형은 HANDOFF 「Fable 작업」으로 적는다.
- `xp` 는 선택(없으면 CONFIG.XP.sql = 25). 기준: rows 20~30, state 30, JOIN·서브쿼리 35, 보스 40~50.

### 레슨별 「무엇을 쓸지」

| 레슨 | 쪽(3~5) | 문제(3~5, 유형 섞기) | 비고 |
| --- | --- | --- | --- |
| S1 SELECT·WHERE | 비교 연산자 → AND/OR(괄호) → LIKE % _ → IN → BETWEEN | sql 3(각 조건) · fill 1 · quiz 1 | 글자는 작은따옴표, 숫자는 그대로 |
| S2 정렬·자르기·계산 열·NULL | ORDER BY(DESC, 여러 열) → LIMIT → 계산 열·AS → DISTINCT → NULL(IS NULL) | sql ordered 2 · sql columns(AS) 1 · quiz 1 · fill 1 | customers.phone 에 NULL 1개, orders.customer_id 에 NULL 5개 |
| S3 집계·GROUP BY | 집계 5개 → GROUP BY → HAVING vs WHERE → COUNT(*) vs COUNT(열) | sql 3 · parsons 1(절 순서) · fill 1 | AVG 는 소수 — 지문에 ROUND 요구 안 해도 됨(2자리 비교) |
| SB1 보스 | 안내 1쪽 | sql 5(표 하나씩, JOIN 없이) | menu_id 별 TOP 5(ordered), 시간대별(substr(ordered_at,12,2)) 매출 |
| S4 JOIN 1 | 왜 나누나(외래 키) → INNER JOIN ON → 별명 → 열 고르기 | sql 2 · 틀린 JOIN 고치기 1 · quiz 1 | ERD·JOIN 애니메이션은 아직 없음(Fable 후보) — 글·표로 |
| S5 JOIN 2 | LEFT JOIN(NULL 로 채움) → 짝 없는 행 찾기 → 3표 JOIN → 셀프 조인 | sql 3 · 고치기 1 · fill 1 | 주문 없는 손님 = customers LEFT JOIN orders … IS NULL |
| S6 서브쿼리·WITH | 스칼라 → IN → WITH → EXISTS | sql 3 · parsons 1 · quiz 1 | |
| S7 CASE·날짜·문자열 | CASE → substr/strftime → 문자열 함수 → ROUND | sql 3 · fill 1 · quiz 1 | ordered_at 은 'YYYY-MM-DD HH:MM' 글자 |
| SB2 보스 | 안내 1쪽 | sql 5(JOIN·집계·CASE 섞어) | 재방문율은 소수 2자리 |
| S8 INSERT·UPDATE·DELETE | INSERT → UPDATE WHERE → DELETE WHERE → WHERE 빠뜨리기 체험 → 초기화 | sql state 3 · quiz 1 · fill 1 | 외래 키 주의(위) |
| S9 CREATE TABLE·제약 | CREATE → 자료형 → PK/NOT NULL/UNIQUE/DEFAULT → FOREIGN KEY → 에러 읽기 | sql state 2(table: 새 표) · fill 1 · quiz 1 | state 비교는 CREATE 뒤 INSERT 까지 한 문제에 넣으면 행 비교가 됨 |
| S10 설계·ERD | 나쁜 표 → 1NF → 갱신 이상 → 3NF → ERD 읽기 | quiz 2 · fill 1 · sql 1(나눈 표 만들기, state) | 그림은 `<pre>` 글자 그림으로 |
| S11 인덱스 | 찾아보기 비유 → EXPLAIN QUERY PLAN → 큰 표 만들기(WITH RECURSIVE) → CREATE INDEX 전후 ms | sql rows 1(EXPLAIN 결과 — expect.query 로 기대 만들기) · quiz 2 · fill 1 | 결과 표의 ms 표시를 쓴다 |
| S12 트랜잭션 | 송금 → BEGIN/COMMIT → ROLLBACK → 카페 예 | sql state 2 · quiz 1 · fill 1 | sql.js 는 BEGIN…COMMIT 을 한 exec 에서 지원 |
| S13 파이썬 sqlite3 | connect/execute/fetch → 결과 리스트 → 인젝션 → ? 바인딩 → commit | quiz 2 · fill 2 | 실행형은 Fable 요청(코스 페이지에 Pyodide 병행) |
| SB3 보스 | 안내 1쪽 | sql state 2 · rows 2 · fill 1 | `ledger` 데이터셋을 datasets.js 에 추가(아래) |

데이터셋: `cafe` 는 지금 뼈대 크기(menu 10·customers 8·orders 30·order_items 60·staff 4·shifts 12). EXPANSION 크기로 키우려면 `python3 tools/gen_sql_dataset.py --full`(시드 고정, 결정적) — 키운 뒤 `run_sql_solutions.py` 를 다시 돌려 0행 문제가 없는지 본다. `school`·`ledger` 는 datasets.js 에 같은 꼴(`키: \`SQL\``)로 추가하면 validate 가 자동 인식한다(SQL 안에 백틱·`${` 금지).

### 검증 명령 순서

1. `node tools/validate_content.mjs` — sql 필드 규칙(tools/validate/sql.mjs: dataset 존재·expect.kind·solution 문자열·state 의 table·bug/code 금지)
2. `python3 tools/run_sql_solutions.py` — 모든 sql 문제의 정답·레슨 예제를 Python sqlite3 로 실행: 에러 없음, rows 는 1행 이상, state 는 table 조회됨, starter 가 이미 정답과 같은 결과면 실패
3. `node tools/check_level.mjs --gate` (3-2절) · `python3 tools/regress.py` 의 `[sql]` 절(가짜 엔진으로 채점 경로 검사 — 실제 sql.js 는 CDN 차단 환경에서 못 받으므로 로컬 브라우저에서 S0 를 직접 풀어 본다)
4. 브라우저에서 레슨마다 처음부터 직접 풀기(3-2절). 특히 결과 표가 50행을 넘는 문제는 페이지 넘김을 눌러 본다.

### 하지 말 것

- core(`core/runners/sql.js`·`core/ui-views-sql.js`)·`tools/validate/sql.mjs`·`tools/run_sql_solutions.py` 도 필요하면 직접 고친다(`[core]` 커밋 + regress). 새 문제 type·example kind 도 같은 조건으로 가능.
- id 규칙 `S0`·`SB1`·`S0P1`(CONFIG.COURSE_ID_PATTERNS). 기존 S0 문제 id 는 바꾸지 않는다.
- 레슨을 채우면 `draft: true` 를 **지운다**(안 지우면 「준비 중」으로 잠긴 채 남는다). 다 채우면 `CONFIG.COURSES[].sql` 의 `preview` 를 지우고 `ready: true, total, lessons` 로(값만).
- `[[용어]]` 는 레슨 `terms` 나 `shared/glossary.js` 에 있어야 한다. `quiz.why` 에 HTML 금지. 힌트 정확히 3개.
- 정답 쿼리가 0행을 내는 문제, 데이터셋 값에 기대는 지문 숫자(「결과는 5행」 같은 것)는 데이터셋을 키운 뒤 다시 맞춘다.
