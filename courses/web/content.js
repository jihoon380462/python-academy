// courses/web/content.js — 코스 5 웹·HTTP·API (Phase 4 → v2.7.0 뼈대). 설계: docs/EXPANSION.md 8절, 플러그인 계약: docs/DESIGN.md 16절, 채우기 지시: specs/content-team.md 「C-W」 절.
// 파이썬/알고리즘 content.js 와 같은 전역 const 구조(엔진이 그대로 읽는다). 로직 없음.
//
// 이 코스의 문제 유형
//   type:'web'   (core/ui-views-web.js UI.modes.web) — HTML/CSS/JS 편집기 + 미리보기 + 채점 체크리스트
//     web: { tabs:['html','css','js'] 중 쓰는 것(순서대로, 첫 탭이 기본), starter:{ html, css?, js? }, checks:[ {text, sel, 검사…} ], free?:true, api?:{ delay, failRate, failFirst, todos } }
//     checks 항목 = { text:'설명(체크리스트에 보임)', sel:'CSS 선택자', 검사 하나 }  — 검사 종류는 core/runners/web.js 머리말 Web.CHECK_DOC 과 C-W 절
//       exists:true|false · count:n|{min,max} · equals:'글자가 정확히'(공백 정리 후 비교) · contains:'글자 포함' · value:'입력값' · attr:{name,value?} · css:{prop,value}(색은 rgb 정규화, px ±2) · js:'식'
//       동작 뒤: { text, click:'#btn', times?:n, then:{ sel, … } } · { text, input:{sel,value}, then:{…} } · { text, key:{sel,key:'Enter'}, then:{…} } · { text, submit:'form', then:{…} } · wait:ms · viewport:390
//     solution: 정답을 html 한 문자열로(css 는 <style>, js 는 <script> 로 합침 — 「정답 보기」가 그대로 보여 주고, tools/run_web_solutions.py 가 이걸 미리보기에 넣어 checks 전부 ✓ 인지 검사)
//     xp: 선택(없으면 CONFIG.XP.web = 25). 보통 30, 자유 과제(free) 10.
//     free:true 「예쁘게 꾸미세요」 — checks 없이 「완료로 표시」 버튼이 완료 처리.
//   type:'quiz' | 'fill' | 'parsons'  기존 유형 그대로(parsons 는 태그 중첩 순서 — 들여쓰기 2칸, 정답 5줄 이상).
//   레슨 pages[].example = { web:{ html, css?, js? }, api?:{…} }  → 편집기 + 미리보기 + 「원래대로」(UI.examples.web)
//   tags: WEAKNESS_TAGS 중에서.
const COURSE = { id: 'web', name: '웹·HTTP·API', runner: 'web', bench: false,
  tutorPersona: '너는 HTML·CSS·JavaScript 와 HTTP 를 처음 배우는 한국어 사용자를 가르치는 친절한 웹 선생님이야. 브라우저에 "무엇이 보이는지"와 "서버와 무슨 말이 오갔는지"를 먼저 눈으로 확인하게 하고, 태그·선택자·fetch 를 설명할 때는 파이썬과 비교해 준다. 정답 코드를 통째로 주지 말고 어느 태그·어느 줄을 보라고 짚어 준다. 쉬운 말, 짧은 문장, 답은 300자 안팎.' };
const CHAPTERS = [
  { ch: 1, name: '화면 만들기', color: '#8e24aa' },
  { ch: 2, name: '움직이게', color: '#f9a825' },
  { ch: 3, name: '서버와 대화', color: '#00897b' },
];
const TODO = (t) => [{ title: '준비 중', html: `<p>TODO: ${t}</p>` }];

const LESSONS = [
// ================= 챕터 A 화면 만들기 =================
{ id: 'W0', ch: 1, n: 0, title: '웹은 어떻게 동작하나', mode: 'text',
  tutorSummary: '브라우저가 서버에 주소로 "이 페이지 주세요"(요청)를 보내면 서버가 HTML 파일을 돌려준다(응답). 브라우저는 받은 HTML(뼈대)·CSS(꾸밈)·JS(움직임)를 읽어 화면을 그린다. 이 아카데미도 같은 재료로 만들어져 개발자 도구(F12)로 열어볼 수 있다. HTML 은 <h1>제목</h1> 처럼 여는 태그와 닫는 태그로 내용을 감싼다.',
  terms: { 'HTML': '웹 페이지의 뼈대를 적는 글. 태그로 제목·문단·버튼 같은 부품을 표시한다 (HyperText Markup Language)', 'CSS': '웹 페이지를 꾸미는 규칙. 색·크기·배치를 정한다 (Cascading Style Sheets)', 'JavaScript': '웹 페이지를 움직이게 하는 프로그래밍 언어. 버튼을 누르면 반응하게 만든다', '브라우저': '크롬·사파리·엣지처럼 웹 페이지를 받아 와서 화면에 그려 주는 프로그램', '서버': '요청을 받으면 페이지나 데이터를 보내 주는, 늘 켜져 있는 컴퓨터', 'HTTP': '브라우저와 서버가 요청·응답을 주고받는 약속(말투). 주소 맨 앞의 http:// 가 이것', '태그': 'HTML 의 부품 표시. <h1> 처럼 꺾쇠로 감싸고, 대부분 </h1> 같은 닫는 짝이 있다', '개발자 도구': '브라우저에 들어 있는 검사 창(F12). 페이지의 HTML·CSS 와 서버 요청을 들여다볼 수 있다' },
  pages: [
    { title: '식당에 주문하듯이', html: `<p>주소창에 주소를 치고 Enter 를 누르면 무슨 일이 일어날까요? 식당에 비유하면 이래요.</p><ol><li><b>손님(브라우저)</b>이 주문해요 — 「이 페이지 주세요」. 이걸 <b>요청</b>이라고 해요.</li><li><b>주방(서버)</b>이 음식을 내보내요 — 페이지 파일을 보내 줘요. 이게 <b>응답</b>이에요.</li><li>손님은 받은 걸 <b>먹기 좋게 차려요</b> — 브라우저가 파일을 읽어 화면에 그려요.</li></ol><p>서버가 보내 주는 파일은 세 가지 재료로 돼 있어요.</p><ul><li>[[HTML]] — 뼈대. 「여기는 제목, 여기는 문단, 여기는 버튼」</li><li>[[CSS]] — 꾸밈. 「제목은 보라색, 글자는 크게」</li><li>[[JavaScript]] — 움직임. 「버튼을 누르면 숫자가 올라간다」</li></ul><p>이 코스에서는 세 재료를 차례로 배우고, 마지막엔 [[서버]]와 직접 대화해요.</p>` },
    { title: '주소·브라우저·서버', html: `<p>주소(URL)는 세 부분으로 읽어요.</p><pre>https://jihoon380462.github.io/python-academy/courses/web/
└─규칙─┘ └───────서버 이름───────┘ └────────경로────────┘</pre><ul><li><b>규칙</b> <code>https</code> — 서버와 어떤 말투로 대화할지. 이 말투가 [[HTTP]] 예요(s 는 암호화).</li><li><b>서버 이름</b> — 어느 컴퓨터에 물어볼지. 전화번호부처럼 이름을 실제 주소로 바꿔 줘요.</li><li><b>경로</b> — 그 서버 안의 어느 페이지인지. 폴더 경로와 같아요.</li></ul><p>[[브라우저]]는 이 주소로 요청을 보내고, 서버는 <b>상태 번호</b>와 함께 응답해요. 자주 보는 번호 두 개만 먼저 알아 두세요.</p><ul><li><code>200</code> — 잘 됐어요. 페이지를 보내요.</li><li><code>404</code> — 그런 경로는 없어요. (주소를 잘못 쳤을 때 보는 그 화면)</li></ul><p>상태 번호는 챕터 C 에서 제대로 배워요. 지금은 「요청에는 번호 달린 응답이 온다」만 기억하면 돼요.</p>` },
    { title: '이 사이트를 열어 보기', html: `<p>지금 보고 있는 이 아카데미도 HTML·CSS·JavaScript 로 만들어졌어요. 직접 확인해 봐요. (PC 에서만 돼요 — 폰이라면 이 쪽은 읽고 넘어가세요.)</p><ol><li>키보드에서 <kbd>F12</kbd> 를 누르세요. (안 되면 <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>I</kbd>, Mac 은 <kbd>Cmd</kbd>+<kbd>Option</kbd>+<kbd>I</kbd>) — [[개발자 도구]]가 열려요.</li><li><b>Elements</b>(요소) 탭을 보세요. 지금 화면의 HTML 이 통째로 보여요. <code>&lt;div id="view"&gt;</code> 를 찾아 펼쳐 보세요 — 이 글도 그 안에 있어요.</li><li>글자를 아무거나 더블클릭해서 바꿔 보세요. 화면이 바로 바뀌어요. 새로고침하면 원래대로 돌아와요(내 브라우저 안에서만 바뀐 거예요).</li><li><b>Network</b>(네트워크) 탭을 누르고 새로고침하면, 브라우저가 서버에 요청한 파일 목록이 쭉 나와요. <code>content.js</code>, <code>ui.css</code> 같은 이름이 보이면 성공이에요.</li></ol><p>이 코스의 미리보기 아래에도 작은 <b>네트워크 탭</b>이 있어요. 챕터 C 에서 서버와 대화할 때 거기에 요청이 쌓여요.</p>` },
    { title: '첫 HTML 쳐 보기', html: `<p>HTML 은 [[태그]]로 부품을 표시해요. 꺾쇠 <code>&lt; &gt;</code> 안에 이름을 쓰고, 내용 뒤에 <code>/</code> 가 붙은 닫는 태그로 끝내요.</p><pre>&lt;h1&gt;안녕, 웹!&lt;/h1&gt;
&lt;p&gt;내가 만든 첫 페이지예요.&lt;/p&gt;</pre><ul><li><code>h1</code> — 가장 큰 제목 (heading 1)</li><li><code>p</code> — 문단 (paragraph)</li></ul><p>아래 예제의 <b>HTML</b> 탭에서 글자를 바꿔 보세요. 타이핑을 멈추면 0.5초 뒤 <b>미리보기</b>(오른쪽 또는 아래)가 저절로 바뀌어요. <b>CSS</b> 탭의 색 이름을 <code>blue</code> 로 바꿔 보세요. 망가지면 <b>원래대로</b> 버튼이 있어요.</p>`,
      example: { web: { html: `<h1>안녕, 웹!</h1>\n<p>내가 만든 첫 페이지예요.</p>`, css: `h1 {\n  color: purple;\n}` } } },
  ],
  summary: ['브라우저가 요청하면 서버가 HTML·CSS·JS 를 응답한다', '주소 = 규칙(https) + 서버 이름 + 경로, 응답엔 상태 번호(200·404)', 'HTML 은 <h1>제목</h1> 처럼 여는 태그와 닫는 태그로 부품을 표시한다'] },

{ id: 'W1', ch: 1, n: 1, title: 'HTML 구조: 태그·속성·중첩', mode: 'text', draft: true, tutorSummary: '문서 뼈대 <!DOCTYPE html><html><head><body>. 태그 안에 태그(중첩)와 들여쓰기. 속성 name="값". 제목 h1~h3, 문단 p, 구역 div, 줄바꿈 br. 닫는 태그를 빠뜨리면 생기는 일.', pages: TODO('문서 뼈대(html/head/body), 중첩과 들여쓰기 그림, 속성(id·class·title), h1~h3·p·div·br, 닫는 태그 누락 버그 찾기'), summary: ['문서는 html > head + body 로 시작한다', '태그 안에 태그를 넣으면 중첩, 들여쓰기로 보여 준다', '속성은 여는 태그 안에 이름="값"'] },
{ id: 'W2', ch: 1, n: 2, title: '목록·링크·이미지·표', mode: 'text', draft: true, tutorSummary: 'ul/ol + li, a href(새 창 target), img src alt(alt 가 왜 필수인지), table/tr/th/td. 시맨틱 태그 header/nav/main/section/footer 는 "의미 있는 div".', pages: TODO('ul/ol/li, a href 와 상대·절대 주소, img src/alt, table 구조, 시맨틱 태그(header/nav/main/footer) 한 쪽'), summary: ['목록은 ul/ol 안에 li', '링크는 a href, 이미지는 img src + alt', '표는 table > tr > th/td'] },
{ id: 'W3', ch: 1, n: 3, title: '폼: 입력창·버튼·선택', mode: 'text', draft: true, tutorSummary: 'form, input(type text/number/checkbox), label for, select/option, textarea, button. 제출이란 "입력값을 모아 서버로 보내는 것" — 이 코스에선 JS 로 가로챈다(preventDefault 는 W8 에서).', pages: TODO('input 종류, label 과 for, select/option, textarea, button, form 과 제출의 뜻(서버로 보낸다 — 미리보기 안에서는 새로고침되니 챕터 B 에서 JS 로 가로챔)'), summary: ['입력은 input, 여러 줄은 textarea, 고르기는 select', 'label 의 for 와 input 의 id 를 맞추면 글자를 눌러도 선택된다', '제출(submit)은 입력값을 서버로 보내는 것'] },
{ id: 'W4', ch: 1, n: 4, title: 'CSS: 선택자·색·글꼴·박스 모델', mode: 'text', draft: true, tutorSummary: '선택자(태그·.class·#id), 속성: 값; 규칙. color/background/font-size/font-family. 박스 모델: content-padding-border-margin 그림. 개발자 도구에서 박스 색 보기.', pages: TODO('선택자 3종과 우선순위 맛보기, color/background/font-size, 박스 모델 그림(margin/padding/border), width/height, 선택자 오타 버그 찾기'), summary: ['선택자 { 속성: 값; } — 태그·.class·#id', '색은 이름·#hex·rgb(), 크기는 px', '박스 = 내용 + padding + border + margin'] },
{ id: 'W5', ch: 1, n: 5, title: '레이아웃: flexbox', mode: 'text', draft: true, tutorSummary: 'display:flex 로 가로 배치, justify-content/align-items, gap, flex:1. "가운데 정렬의 역사"(table→float→flex) 웃음 포인트. 세로 가운데는 align-items:center.', pages: TODO('가운데 정렬의 역사(표·float 시절 → flex), display:flex 가로 배치, justify-content/align-items 표, gap, flex:1 로 남은 공간 채우기'), summary: ['부모에 display:flex 를 주면 자식이 가로로 선다', 'justify-content 는 가로, align-items 는 세로 정렬', 'gap 으로 간격, flex:1 로 남은 공간'] },
{ id: 'W6', ch: 1, n: 6, title: '반응형: 미디어 쿼리', mode: 'text', draft: true, tutorSummary: '미리보기 폰/PC 폭 전환으로 깨지는 걸 먼저 보고, @media (max-width:600px) 로 고친다. 모바일 먼저(min-width) 사고. viewport 메타 태그.', pages: TODO('폰 폭에서 깨지는 예제 → @media (max-width) 로 세로 배치, 모바일 먼저(min-width) 사고방식, viewport meta, checks 의 viewport:390 로 채점되는 문제'), summary: ['@media (max-width: 600px) { … } 는 좁은 화면에서만 적용', '모바일 먼저: 기본은 폰, min-width 로 PC 를 더한다', 'viewport 메타 태그가 없으면 폰이 PC 처럼 그린다'] },
{ id: 'WB1', ch: 1, boss: true, title: '보스: 내 소개 페이지', mode: 'text', draft: true, pages: [], summary: [], tutorSummary: '챕터 A 종합. 제목·사진(alt)·소개 문단·취미 목록·연락 링크를 flex 로 배치하고, 폰(390px)에서는 세로로 쌓이게. web 문제 1개에 checks 10개 안팎(viewport:390 포함) + 자유 꾸미기(free) 1개.' },
// ================= 챕터 B 움직이게 =================
{ id: 'W7', ch: 2, n: 7, title: 'JS 기초: 파이썬과 비교', mode: 'text', draft: true, tutorSummary: '파이썬 ↔ JS 비교표: let/const, function(){}, for/while, 배열(리스트), 객체(딕셔너리), ===, 세미콜론과 중괄호, console.log = print. 출력창에서 확인.', pages: TODO('비교표(변수·함수·반복·배열·객체·조건), 세미콜론·중괄호·들여쓰기 차이, console.log, 템플릿 문자열 `${}`, 흔한 에러(ReferenceError·SyntaxError) 읽기'), summary: ['console.log 는 print, let/const 는 변수', '블록은 들여쓰기가 아니라 { } 로', '리스트는 배열 [ ], 딕셔너리는 객체 { }'] },
{ id: 'W8', ch: 2, n: 8, title: 'DOM: 요소 찾기·바꾸기·만들기', mode: 'text', draft: true, tutorSummary: 'document.querySelector, textContent, style, classList, createElement/append, addEventListener("click"/"input"), event.preventDefault 로 폼 제출 가로채기.', pages: TODO('DOM 트리 그림, querySelector(All), textContent/innerHTML 차이, style·classList, createElement+append, addEventListener click/input, 폼 submit + preventDefault'), summary: ['querySelector 로 요소를 찾고 textContent 로 글자를 바꾼다', 'addEventListener("click", 함수) 가 이벤트', 'createElement + append 로 새 요소를 만든다'] },
{ id: 'W9', ch: 2, n: 9, title: '상태와 화면: 카운터·할 일 목록', mode: 'text', draft: true, tutorSummary: '상태(변수)를 바꾸고 화면을 다시 그리는 패턴 render(). 카운터 → 할 일 목록(배열에 push, map 으로 그리기). localStorage.setItem/getItem + JSON.stringify/parse 로 저장.', pages: TODO('상태→render 패턴, 카운터, 배열 상태로 할 일 목록 그리기(map/join), 삭제(filter), localStorage + JSON 으로 저장·복원'), summary: ['상태를 바꾸고 render() 로 화면을 다시 그린다', '목록은 배열 상태 + map 으로 HTML 만들기', 'localStorage 에 JSON.stringify 로 저장, JSON.parse 로 복원'] },
{ id: 'WB2', ch: 2, boss: true, title: '보스: 할 일 앱', mode: 'text', draft: true, pages: [], summary: [], tutorSummary: '챕터 B 종합. 입력창+추가 버튼, 목록 그리기, 완료 토글, 삭제, localStorage 저장. web 문제 1개에 click/input 체인 checks 8개 안팎(js:"localStorage.getItem(…)" 포함).' },
// ================= 챕터 C 서버와 대화 =================
{ id: 'W10', ch: 3, n: 10, title: 'HTTP: 요청·응답·상태 코드·JSON', mode: 'text', draft: true, tutorSummary: '요청 = 메서드 + 주소 + 헤더 + 본문, 응답 = 상태 코드 + 헤더 + 본문. GET/POST/PUT/DELETE 뜻. 200 201 400 404 500. JSON 은 파이썬 딕셔너리와 거의 같은 글자 형식. 네트워크 탭 읽기.', pages: TODO('요청·응답 구조 그림, 메서드 4개 표(읽기·만들기·바꾸기·지우기), 상태 코드 5개, 헤더(Content-Type), JSON 형식과 파이썬 dict 비교, 가짜 서버 라우트 표(Web.api.routes)와 네트워크 탭 읽기'), summary: ['요청 = 메서드 + 주소 (+ 본문), 응답 = 상태 코드 + 본문', 'GET 읽기 · POST 만들기 · PUT 바꾸기 · DELETE 지우기', '200 성공 · 201 만들어짐 · 400 요청 잘못 · 404 없음 · 500 서버 오류'] },
{ id: 'W11', ch: 3, n: 11, title: 'fetch 와 비동기', mode: 'text', draft: true, tutorSummary: 'fetch(url) 는 약속(Promise)을 돌려준다 → await. async 함수. res.ok/res.status, await res.json(). 로딩 표시 → 결과 그리기 → catch 로 에러 표시. POST 는 method/headers/body(JSON.stringify).', pages: TODO('비동기가 왜 필요한가(기다리는 동안 화면이 멈추면 안 됨), async/await, fetch GET + res.json, 로딩 표시 패턴, res.ok 와 에러 처리(try/catch, 404·500), POST 보내기(headers Content-Type, body JSON.stringify), 네트워크 탭에서 확인'), summary: ['fetch 는 기다려야 하니 await, 기다리는 함수는 async', 'res.ok 를 확인하고 await res.json() 으로 본문을 읽는다', '실패는 try/catch 로 받아 화면에 알려 준다'] },
{ id: 'W12', ch: 3, n: 12, title: '파이썬에서 API 호출: requests', mode: 'text', draft: true, tutorSummary: '같은 요청을 파이썬 requests 로: requests.get(url).json(), post(json=…), status_code. API 키와 환경변수 개념(키를 코드에 적지 않기). 실제 공개 API 예시(읽기만, 실행은 가짜 서버). 이 레슨만 Pyodide(python.js) 필요.', pages: TODO('requests.get/post/json/status_code (가짜 서버로 가는 미니 requests 모듈 — core 요청: Pyodide 쪽 requests 훅), API 키·환경변수 개념, 공개 API 예시 읽기(실행 없음), JS fetch 와 나란히 비교'), summary: ['requests.get(url) → .status_code 와 .json()', 'POST 는 requests.post(url, json={…})', 'API 키는 코드에 적지 말고 환경변수로'] },
{ id: 'W13', ch: 3, n: 13, title: 'REST 맛보기와 배포', mode: 'text', draft: true, tutorSummary: 'REST = 자원(명사) 주소 + 메서드(동사) 조합 규칙. 서버는 누가 만드나: Flask 10줄 읽기(실행 없음). 배포란 — 이 아카데미가 GitHub Pages 에 올라간 과정(정적 파일 = 서버가 그대로 보내 주는 파일).', pages: TODO('REST 규칙(자원 명사 + 메서드), 좋은 주소·나쁜 주소 퀴즈, Flask 10줄 읽기(실행 없음), 정적 사이트와 배포(GitHub Pages 로 이 아카데미가 올라간 과정), 다음 단계 안내'), summary: ['REST: 주소는 자원(명사), 메서드가 동작(동사)', '서버 코드는 Flask 10줄로도 시작할 수 있다', '배포 = 파일을 서버에 올려 주소를 얻는 것'] },
{ id: 'WB3', ch: 3, boss: true, title: '보스: 카페 주문 화면', mode: 'text', draft: true, pages: [], summary: [], tutorSummary: '챕터 C 종합. GET /menu 로 메뉴 받아 표시 → 고르고 POST /orders → 주문 번호·합계 표시, 500 이면 「다시 시도」 버튼(api.failFirst:1). web 문제 1개에 click 체인 + wait checks 8개 안팎.' },
];

const PROBLEMS = [
// ---------- W0 웹은 어떻게 동작하나 ----------



];
