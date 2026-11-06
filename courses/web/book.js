// courses/web/book.js — 웹 「교과서」 모드 데이터 (v2.14.0, 사용자 11/6 「2번(SQL·터미널·웹 교과서) 해」 · 「내 컴퓨터 도구로」 · 「계속 다음 진행해」 = N3)
// 화면은 core/ui-views-book.js. 연습은 사용자 PC 의 VS Code(+ Live Server 확장) + 크롬/엣지(개발자 도구 F12).
// lessonPages: W0~W13 쪽 통째(content.js 의 브라우저 편집기용 쪽·「준비 중」 대신) · 보스는 「만들어 보기」 만
// tasks 필드: answer = 예시 답(index.html 파일 전체) · checks = 「브라우저에서 확인할 것」(core/runners/web.js 의 Web.check 형식 — 화면엔 text 만 보임)
//   prep = { name, text } 같은 폴더에 둘 준비 파일(예: menu.json) · mock = { 'URL 일부': JSON } 검사 때만 fetch 를 그 데이터로 대신(실제로는 Live Server·인터넷에서 받음)
//   noRun = 검사 안 함(파이썬 requests·GitHub 배포처럼 사이트 밖에서 하는 것)
// 검증: python3 tools/run_web_solutions.py — 예시 답을 미리보기 iframe 에 넣고 checks 전부 ✓ 인지(CI 의 regress 단계)
const WH = (title, body, css, js) => `<!DOCTYPE html>\n<html lang="ko">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>${title}</title>${css ? `\n  <style>\n${css}\n  </style>` : ''}\n</head>\n<body>\n${body}${js ? `\n<script>\n${js}\n</script>` : ''}\n</body>\n</html>`;
const TODOS3 = [{ userId: 1, id: 1, title: 'delectus aut autem', completed: false }, { userId: 1, id: 2, title: 'quis ut nam facilis et officia qui', completed: false }, { userId: 1, id: 3, title: 'fugiat veniam minus', completed: false }];
const MENU_JSON = [{ id: 1, name: '아메리카노', price: 4000 }, { id: 2, name: '카페라테', price: 4500 }, { id: 3, name: '크루아상', price: 3500 }];
const BOOK = {
  check: 'web',
  meta: {
    kicker: '🌐 웹 교과서', hero: '읽고, VS Code 와 브라우저에서 직접 만들어 보기',
    heroP: '레슨은 HTML·CSS·JavaScript·HTTP 설명이에요. 「만들어 보기」 는 VS Code 에서 <code>index.html</code> 을 만들고 <b>Live Server</b> 로 브라우저에 띄워 「확인할 것」 목록을 하나씩 확인해요. 마지막엔 내 페이지를 인터넷 주소로 올려요. 채점·점수·잠금은 없어요.',
    dexName: '웹 문법 도감', dexShort: '문법 도감', dexWhat: '배운 문법', dexHint: '검색해서 바로 찾기(실전은 오픈북)',
    dexExamples: '<code>flex</code>, <code>버튼</code>, <code>fetch</code>, <code>querySelector</code>', dexPlaceholder: '🔍 문법 찾기 — flex, 링크, fetch, addEventListener …', dexAlt: '「가운데 정렬」 대신 <code>flex</code>',
    dexDocs: 'MDN 웹 문서(한국어) <a href="https://developer.mozilla.org/ko/" target="_blank" rel="noopener">developer.mozilla.org/ko</a>',
    dexRun: '예제는 📋 복사해서 VS Code 의 파일에 붙여 넣고 Go Live 로 바로 볼 수 있고',
    copyToast: '📋 복사했어요. VS Code 의 파일에 붙여 넣고 저장(Ctrl+S) — Live Server 가 브라우저를 새로고침해요', exampleLabel: '예제 — VS Code 의 index.html 에 붙여 넣고 저장 → Go Live',
    makeIntro: 'VS Code 에서 공부 폴더(<code>web-study</code>)에 문제마다 새 폴더나 파일(예: <code>{file}</code>)을 만들고 직접 짜 보세요. <b>Go Live</b> 로 브라우저에 띄워 「브라우저에서 확인할 것」 을 하나씩 확인해요.',
    makeTail: '막히면 「필요한 문법」을 눌러 설명을 다시 보고, 그래도 막히면 맨 아래 예시 답(파일 전체)을 펴 보세요. 모양·글이 달라도 확인할 것이 다 되면 맞아요. 화면이 안 바뀌면 저장(Ctrl+S)했는지, F12 Console 에 빨간 에러가 있는지 먼저 봐요.',
    fileExt: '.html', prepLabel: '준비 파일 — index.html 과 같은 폴더에 이 이름으로 저장', answerLabel: '예시 답(파일 전체)', needsLabel: '필요한 문법', outLabel: '결과',
    prereq: [
      { lessons: ['W0', 'W1'], chapters: [1], ref: 'SETUP/0', btn: '시작하기 1 · VS Code·Live Server 보기',
        title: '먼저 꼭! 「🛠 시작하기」 1~2 — VS Code 로 폴더 열기 · Live Server 설치',
        html: '이 교과서는 <b>VS Code 에서 파일을 만들고</b> <b>Live Server 의 Go Live</b> 로 브라우저에 띄워 확인해요. 파일을 더블클릭해 열어도 처음 레슨들은 보이지만, 레슨 11(fetch)부터는 <b>Live Server 없이는 동작하지 않아요</b>(<code>file://</code> 주소에서는 브라우저가 파일 읽기를 막아요). 확인: VS Code 맨 아래 오른쪽에 <b>Go Live</b> 가 보이면 준비 끝.' },
      { lessons: ['W7', 'W8', 'W9', 'WB2', 'W11', 'WB3'], chapters: [2], ref: 'SETUP/2', btn: '시작하기 3 · 개발자 도구 보기',
        title: 'JavaScript 부터는 F12 개발자 도구의 Console 을 늘 열어 두세요',
        html: 'JS 는 틀려도 화면에 아무 말 없이 <b>그냥 안 돼요</b>. 이유는 <b>F12 → Console</b> 탭의 빨간 줄에만 나와요(예: <code>Uncaught TypeError: Cannot read properties of null</code> + 몇 번째 줄). 안 되면 먼저 Console. 그리고 저장(<kbd>Ctrl</kbd>+<kbd>S</kbd>)을 했는지.' },
      { lessons: ['W12'], ref: 'W12/0', btn: '레슨 12 · 설치 보기',
        title: '레슨 12 는 파이썬 + requests 설치가 필요해요',
        html: '파이썬 교과서 「시작하기」 로 파이썬이 설치돼 있어야 하고, VS Code 터미널에서 <code>python -m pip install requests</code> 를 한 번 해야 해요(레슨 12 · 1쪽).' },
      { lessons: ['W13'], ref: 'W13/1', btn: '레슨 13 · GitHub Pages 보기',
        title: '레슨 13 의 배포는 GitHub 계정과 Git 이 필요해요',
        html: '터미널·Git 교과서의 <b>레슨 6(이름·이메일 설정)</b>과 <b>레슨 16(GitHub 계정·첫 push)</b>을 먼저 하세요. 배포는 「GitHub 에 올린 저장소 → Settings → Pages」 로 해요.' },
    ],
  },
  setup: {
    title: '시작하기: VS Code 와 Live Server 로 웹 페이지 띄우기',
    pages: [
      { title: '1. 공부 폴더를 VS Code 로 열기', html: `<p>웹 페이지는 <b>글자 파일</b>(<code>.html</code> · <code>.css</code> · <code>.js</code>)이에요. 그래서 편집기(VS Code)와 브라우저(크롬·엣지)만 있으면 돼요. VS Code 가 없으면 파이썬 교과서 「시작하기 2」 를 보고 먼저 설치하세요.</p>
<div class="bk-step-box"><b>① 폴더 만들기</b><br>문서 폴더 등에 <code>web-study</code> 폴더를 만들어요.</div>
<div class="bk-step-box"><b>② VS Code 로 폴더 열기</b><br>VS Code → 메뉴 <b>파일(File) → 폴더 열기(Open Folder)</b> → <code>web-study</code> → 폴더 선택. 「이 폴더의 작성자를 신뢰합니까?」 가 뜨면 <b>예, 작성자를 신뢰합니다</b>.</div>
<div class="bk-step-box"><b>③ 첫 파일</b><br>왼쪽 탐색기에서 폴더 이름 옆 <b>새 파일</b> 아이콘 → <code>index.html</code>. 파일 안에서 <code>!</code> 를 치고 <kbd>Tab</kbd>(또는 Enter) — VS Code 가 HTML 뼈대를 통째로 써 줘요(Emmet). <code>&lt;body&gt;</code> 와 <code>&lt;/body&gt;</code> 사이에 <code>&lt;h1&gt;안녕, 웹!&lt;/h1&gt;</code> 을 쓰고 <kbd>Ctrl</kbd>+<kbd>S</kbd>.</div>
<p>탐색기에서 <code>index.html</code> 을 더블클릭하면 브라우저에 보여요 — 주소창이 <code>file:///C:/…/index.html</code>. 이게 가장 단순한 방법이고, 다음 쪽의 Live Server 가 더 편한 방법이에요.</p>` },
      { title: '2. Live Server 설치와 Go Live', html: `<p>저장할 때마다 브라우저를 손으로 새로고침하기는 번거로워요. <b>Live Server</b> 확장은 내 폴더를 작은 웹 서버로 띄우고, <b>저장하면 브라우저가 저절로 새로고침</b>되게 해요. 레슨 11 의 fetch 는 이게 <b>꼭</b> 필요해요.</p>
<div class="bk-step-box"><b>① 설치</b><br>VS Code 왼쪽 막대의 <b>확장(Extensions)</b> 아이콘(네모 네 개, <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>X</kbd>) → 검색 칸에 <code>Live Server</code> → 만든 사람이 <b>Ritwick Dey</b> 인 것 → <b>Install</b>.</div>
<div class="bk-step-box"><b>② 띄우기</b><br><code>index.html</code> 을 연 상태에서 VS Code 맨 아래 <b>오른쪽</b>의 <b>Go Live</b> 를 클릭(또는 편집기 안 마우스 오른쪽 → <b>Open with Live Server</b>). 브라우저가 <code>http://127.0.0.1:5500/index.html</code> 로 열려요.</div>
<div class="bk-step-box"><b>③ 확인</b><br>VS Code 에서 h1 글자를 바꾸고 <kbd>Ctrl</kbd>+<kbd>S</kbd> → 브라우저가 저절로 바뀌면 성공. 끄기는 맨 아래 <b>Port : 5500</b> 을 클릭.</div>
<p class="muted small">Windows 방화벽 창이 뜨면 「개인 네트워크」 만 허용. 다른 파일(<code>about.html</code>)을 보려면 주소 끝만 바꾸거나 그 파일에서 다시 Go Live.</p>` },
      { title: '3. 브라우저 개발자 도구 (F12)', html: `<p>크롬·엣지에서 <kbd>F12</kbd>(또는 <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>I</kbd>, 페이지에서 마우스 오른쪽 → <b>검사</b>)를 누르면 개발자 도구가 열려요. 웹 개발의 절반은 여기서 해요.</p>
<table class="kb"><tbody><tr><td><b>Elements</b>(요소)</td><td>지금 화면의 HTML 나무와 각 요소에 걸린 CSS. 왼쪽 위 화살표 아이콘으로 화면을 클릭하면 그 요소로. 박스 모델(margin·padding) 그림도</td></tr><tr><td><b>Console</b>(콘솔)</td><td>JS 의 <code>console.log</code> 출력과 <b>빨간 에러</b>. JS 를 바로 쳐 볼 수도 있어요</td></tr><tr><td><b>Network</b>(네트워크)</td><td>페이지가 서버와 주고받은 요청 목록 — 주소·상태 코드(200, 404)·걸린 시간(레슨 10)</td></tr><tr><td>폰 화면 아이콘(<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>M</kbd>)</td><td>폰 크기로 보기 — 반응형(레슨 6) 확인</td></tr></tbody></table>
<p>개발자 도구에서 고친 건 <b>새로고침하면 사라져요</b>. 시험해 보고, 마음에 들면 VS Code 의 파일에 옮겨 적어요.</p>` },
      { title: '4. 이 교과서 쓰는 법', html: `<ul><li><b>레슨</b> — 설명과 예제. 예제는 📋 복사 → VS Code 의 파일에 붙여 넣고 저장 → Go Live 화면에서 봐요.</li><li><b>🛠 만들어 보기</b> — 문장으로 된 문제와 「브라우저에서 확인할 것」 목록. 직접 짜서 하나씩 확인하고, 막히면 「필요한 문법」 → 설명 쪽 → 「← 돌아가기」.</li><li><b>예시 답</b>은 <b>파일 전체</b>예요. 새 파일에 통째로 붙여 넣으면 바로 돌아가요.</li><li>챕터 1 = HTML·CSS(보이는 것) · 챕터 2 = JavaScript(움직이는 것) · 챕터 3 = HTTP·API·배포(인터넷과 주고받는 것).</li><li>📚 <b>문법 도감</b> — 배운 태그·속성·함수를 한곳에. 실전은 오픈북이에요.</li></ul><p>채점·점수·잠금은 없어요.</p>` },
    ],
  },
  pages: {},
  titles: {},
  lessonPages: {
    WB1: [], WB2: [], WB3: [], // 보스는 「만들어 보기」 만
    W0: [
      { title: '주소를 치면 일어나는 일', html: `<p>브라우저 주소창에 <code>https://example.com</code> 을 치면:</p>
<ol><li>브라우저가 그 주소의 <b>서버</b>(남의 컴퓨터)에 「이 페이지 주세요」 라고 <b>요청</b>(request)</li><li>서버가 <b>HTML 글자</b>를 <b>응답</b>(response)으로 보내 줌</li><li>브라우저가 그 글자를 읽어 <b>화면을 그림</b>. 그 안에 CSS·JS·이미지 주소가 있으면 그것도 또 요청</li></ol>
<table class="kb"><tbody><tr><td><b>HTML</b></td><td>내용과 구조 — 제목, 문단, 버튼 (뼈대)</td></tr><tr><td><b>CSS</b></td><td>모양 — 색, 크기, 배치 (옷)</td></tr><tr><td><b>JavaScript</b></td><td>동작 — 누르면 바뀌기, 서버에서 데이터 가져오기 (근육)</td></tr></tbody></table>
<p>웹 페이지는 결국 <b>글자 파일</b>이에요. 내 컴퓨터에서 <code>index.html</code> 을 만들어 열면 서버 없이도 똑같이 그려져요 — 시작하기 1 에서 해 본 그것.</p>` },
      { title: 'HTML 뼈대 한 줄씩', html: `<p>VS Code 에서 <code>!</code> + <kbd>Tab</kbd> 이 써 주는 뼈대예요.</p>
<table class="kb"><tbody><tr><td><code>&lt;!DOCTYPE html&gt;</code></td><td>「요즘 HTML 이에요」 표시</td></tr><tr><td><code>&lt;html lang="ko"&gt;</code></td><td>문서 전체. 한국어 문서</td></tr><tr><td><code>&lt;head&gt;</code></td><td>화면에 안 보이는 정보 — 글자 인코딩, 탭 제목, CSS 연결</td></tr><tr><td><code>&lt;meta charset="UTF-8"&gt;</code></td><td>한글이 안 깨지게</td></tr><tr><td><code>&lt;meta name="viewport" …&gt;</code></td><td>폰에서 제 크기로(레슨 6)</td></tr><tr><td><code>&lt;title&gt;</code></td><td>브라우저 <b>탭</b>에 보이는 제목</td></tr><tr><td><code>&lt;body&gt;</code></td><td>화면에 <b>보이는 것</b> 전부가 여기</td></tr></tbody></table>
<p>VS Code 가 <code>lang="en"</code> 으로 써 주면 <code>ko</code> 로 바꿔요.</p>`, example: { code: WH('내 첫 페이지', '  <h1>안녕, 웹!</h1>\n  <p>내가 만든 첫 웹 페이지예요.</p>') } },
      { title: '태그 = 여는 태그 + 내용 + 닫는 태그', html: `<pre class="code">&lt;h1&gt;안녕, 웹!&lt;/h1&gt;
 ↑여는 태그  ↑내용  ↑닫는 태그(/ 가 붙음)</pre>
<ul><li><code>&lt;h1&gt;</code> 가장 큰 제목 · <code>&lt;p&gt;</code> 문단 · <code>&lt;strong&gt;</code> 굵게(중요) · <code>&lt;em&gt;</code> 기울임(강조)</li><li><code>&lt;br&gt;</code> · <code>&lt;img&gt;</code> 처럼 내용이 없는 태그는 닫는 태그가 없어요</li><li>HTML 에서 엔터·띄어쓰기 여러 개는 <b>한 칸</b>으로 보여요. 줄을 바꾸려면 새 <code>&lt;p&gt;</code> 나 <code>&lt;br&gt;</code></li><li><code>&lt;!-- 메모 --&gt;</code> 는 주석(화면에 안 보임)</li></ul>
<p>F12 → <b>Elements</b> 에서 내 HTML 이 나무 모양으로 보이는지 확인해 보세요.</p>`, example: { code: '<h1>오늘의 메뉴</h1>\n<p>아메리카노 <strong>4000원</strong></p>\n<p>카페라테<br>4500원</p>\n<!-- 이건 화면에 안 보여요 -->' } },
    ],
    W1: [
      { title: '중첩과 들여쓰기', html: `<p>태그 안에 태그를 넣을 수 있어요(<b>중첩</b>). 안쪽 태그는 바깥보다 <b>먼저 닫아요</b>.</p>
<pre class="code">&lt;div&gt;
  &lt;h2&gt;공지&lt;/h2&gt;
  &lt;p&gt;내일은 &lt;strong&gt;휴무&lt;/strong&gt;예요.&lt;/p&gt;
&lt;/div&gt;</pre>
<p>❌ <code>&lt;p&gt;&lt;strong&gt;휴무&lt;/p&gt;&lt;/strong&gt;</code> — 엇갈려 닫으면 브라우저가 멋대로 고쳐서 모양이 이상해져요.</p>
<p>안쪽은 <b>스페이스 2칸</b> 들여 써서 「누가 누구 안에 있는지」 보이게 해요. VS Code 에서 <kbd>Shift</kbd>+<kbd>Alt</kbd>+<kbd>F</kbd> = 문서 서식(자동 정렬).</p>
<table class="kb"><tbody><tr><td><code>&lt;div&gt;</code></td><td>뜻 없는 <b>상자</b> — 여러 요소를 묶어 한꺼번에 꾸미거나 옮길 때</td></tr><tr><td><code>&lt;span&gt;</code></td><td>줄 안의 일부만 묶는 작은 상자</td></tr><tr><td><code>&lt;h1&gt;</code>~<code>&lt;h6&gt;</code></td><td>제목 단계. h1 은 한 페이지에 하나</td></tr></tbody></table>`, example: { code: '<div>\n  <h2>공지</h2>\n  <p>내일은 <strong>휴무</strong>예요.</p>\n  <p>모레는 <span style="color: red">오전만</span> 열어요.</p>\n</div>' } },
      { title: '속성: 태그에 붙는 정보', html: `<pre class="code">&lt;a href="https://example.com" target="_blank"&gt;예제 사이트&lt;/a&gt;
   ↑속성이름="값"</pre>
<ul><li>속성은 <b>여는 태그 안</b>에 <code>이름="값"</code> 으로, 여러 개는 띄어쓰기로</li><li><code>id="main"</code> — 페이지에 <b>하나뿐인</b> 이름(CSS·JS 에서 찾을 때)</li><li><code>class="card highlight"</code> — <b>여러 요소가 같이</b> 쓰는 이름, 띄어쓰기로 여러 개</li><li><code>style="color: red"</code> — 그 요소에만 CSS(급할 때만, 보통은 CSS 파일에)</li></ul>
<p>id 와 class 는 레슨 4(CSS)와 8(JS)에서 요소를 고르는 손잡이가 돼요.</p>`, example: { code: '<h1 id="title">카페 소개</h1>\n<p class="note">매일 아침 8시에 열어요.</p>\n<p class="note">일요일은 쉬어요.</p>' } },
      { title: '닫는 태그를 빠뜨리면', html: `<p>HTML 은 틀려도 <b>에러를 내지 않아요</b>. 브라우저가 최대한 짐작해서 그려요. 그래서 실수가 「모양이 이상함」 으로만 나타나요.</p>
<pre class="code">&lt;h1&gt;제목
&lt;p&gt;문단이에요&lt;/p&gt;     ← h1 을 안 닫아서 문단까지 큰 글씨!</pre>
<p>이상하면:</p><ol><li>VS Code 에서 여는 태그를 클릭 — 짝인 닫는 태그가 함께 칠해져요(짝이 없으면 안 칠해짐)</li><li>F12 → Elements 에서 브라우저가 실제로 만든 나무를 보면 어디가 엇나갔는지 보여요</li><li>들여쓰기를 맞추면(<kbd>Shift</kbd>+<kbd>Alt</kbd>+<kbd>F</kbd>) 빠진 곳이 드러나요</li></ol>` },
    ],
    W2: [
      { title: '목록: ul · ol · li', html: `<table class="kb"><tbody><tr><td><code>&lt;ul&gt;</code></td><td>순서 없는 목록(점 ●)</td></tr><tr><td><code>&lt;ol&gt;</code></td><td>순서 있는 목록(1. 2. 3.)</td></tr><tr><td><code>&lt;li&gt;</code></td><td>목록의 한 항목 — 꼭 ul·ol <b>안</b>에</td></tr></tbody></table>
<p>웹에서 메뉴 막대, 카드 목록 같은 「같은 모양이 반복되는 것」 은 대부분 ul + li 에 CSS 를 입힌 거예요.</p>`, example: { code: '<h2>오늘 할 일</h2>\n<ul>\n  <li>장보기</li>\n  <li>운동</li>\n</ul>\n<h2>라테 만드는 순서</h2>\n<ol>\n  <li>에스프레소 내리기</li>\n  <li>우유 데우기</li>\n  <li>붓기</li>\n</ol>' } },
      { title: '링크와 이미지: a · img', html: `<table class="kb"><tbody><tr><td><code>&lt;a href="about.html"&gt;소개&lt;/a&gt;</code></td><td>같은 폴더의 다른 페이지로(상대 경로 — 터미널 레슨 1 과 같아요)</td></tr><tr><td><code>&lt;a href="https://…" target="_blank"&gt;</code></td><td>다른 사이트를 <b>새 탭</b>으로</td></tr><tr><td><code>&lt;a href="#menu"&gt;</code></td><td>같은 페이지의 <code>id="menu"</code> 로 이동</td></tr><tr><td><code>&lt;img src="cat.jpg" alt="창가에서 자는 고양이"&gt;</code></td><td>이미지. <code>src</code> = 파일 주소, <code>alt</code> = 그림 설명</td></tr></tbody></table>
<p><b><code>alt</code> 는 꼭</b>: 그림이 안 열릴 때 대신 보이고, 화면을 못 보는 사람의 읽어 주는 프로그램이 읽어요. 이미지 파일은 index.html 과 같은 폴더(또는 <code>images/</code> 폴더 → <code>src="images/cat.jpg"</code>)에.</p>`, example: { code: '<a href="https://developer.mozilla.org/ko/" target="_blank">MDN 웹 문서</a>\n<a href="#bottom">맨 아래로</a>\n<img src="https://picsum.photos/200" alt="무작위 풍경 사진" width="200">\n<p id="bottom">여기가 맨 아래</p>' } },
      { title: '표와 의미 있는 상자(시맨틱 태그)', html: `<pre class="code">&lt;table&gt;
  &lt;tr&gt;&lt;th&gt;메뉴&lt;/th&gt;&lt;th&gt;가격&lt;/th&gt;&lt;/tr&gt;     ← tr = 행, th = 머리 칸
  &lt;tr&gt;&lt;td&gt;아메리카노&lt;/td&gt;&lt;td&gt;4000&lt;/td&gt;&lt;/tr&gt;  ← td = 보통 칸
&lt;/table&gt;</pre>
<p>표는 <b>표 데이터</b>에만 쓰고, 화면 배치에는 쓰지 않아요(배치는 레슨 5 의 flex).</p>
<p><b>시맨틱 태그</b>는 「뜻이 있는 div」 예요. 모양은 div 와 같지만 검색 엔진·읽어 주는 프로그램이 구조를 알아봐요.</p>
<table class="kb"><tbody><tr><td><code>&lt;header&gt;</code></td><td>머리(로고·제목)</td></tr><tr><td><code>&lt;nav&gt;</code></td><td>메뉴 링크 묶음</td></tr><tr><td><code>&lt;main&gt;</code></td><td>본문(한 페이지에 하나)</td></tr><tr><td><code>&lt;section&gt;</code></td><td>주제별 구역</td></tr><tr><td><code>&lt;footer&gt;</code></td><td>바닥(연락처·저작권)</td></tr></tbody></table>`, example: { code: '<header><h1>동네 카페</h1></header>\n<nav><a href="#menu">메뉴</a> · <a href="#map">오시는 길</a></nav>\n<main>\n  <section id="menu">\n    <table>\n      <tr><th>메뉴</th><th>가격</th></tr>\n      <tr><td>아메리카노</td><td>4000</td></tr>\n      <tr><td>카페라테</td><td>4500</td></tr>\n    </table>\n  </section>\n</main>\n<footer>☎ 02-123-4567</footer>' } },
    ],
    W3: [
      { title: 'form · input · label', html: `<pre class="code">&lt;form&gt;
  &lt;label for="name"&gt;이름&lt;/label&gt;
  &lt;input id="name" type="text" placeholder="홍길동"&gt;
  &lt;button&gt;보내기&lt;/button&gt;
&lt;/form&gt;</pre>
<table class="kb"><tbody><tr><td><code>type="text"</code> · <code>number</code> · <code>email</code> · <code>password</code> · <code>date</code></td><td>입력 종류. 폰에서는 종류에 맞는 자판이 떠요</td></tr><tr><td><code>type="checkbox"</code> · <code>radio</code></td><td>체크 상자 · 하나만 고르기(같은 <code>name</code> 끼리)</td></tr><tr><td><code>&lt;label for="id"&gt;</code></td><td>입력칸의 이름표. 글자를 눌러도 그 칸이 선택돼요(<code>for</code> = 입력칸의 id)</td></tr><tr><td><code>placeholder</code> · <code>required</code> · <code>min</code>/<code>max</code></td><td>흐린 안내 글 · 비우면 제출 안 됨 · 숫자 범위</td></tr></tbody></table>` , example: { code: '<form>\n  <label for="name">이름</label>\n  <input id="name" type="text" placeholder="홍길동" required>\n  <label for="cups">잔 수</label>\n  <input id="cups" type="number" min="1" max="10" value="1">\n  <label><input type="checkbox" id="takeout"> 포장</label>\n  <button>주문</button>\n</form>' } },
      { title: 'select · textarea · button', html: `<table class="kb"><tbody><tr><td><code>&lt;select id="size"&gt;&lt;option value="S"&gt;작은 컵&lt;/option&gt;…&lt;/select&gt;</code></td><td>펼쳐서 고르기. <code>value</code> 가 실제 값, 사이 글자는 보이는 이름</td></tr><tr><td><code>&lt;textarea rows="4"&gt;&lt;/textarea&gt;</code></td><td>여러 줄 입력</td></tr><tr><td><code>&lt;button type="submit"&gt;</code></td><td>form 안의 버튼은 기본이 「제출」</td></tr><tr><td><code>&lt;button type="button"&gt;</code></td><td>제출하지 않는 그냥 버튼(JS 로 동작 — 레슨 8)</td></tr></tbody></table>` , example: { code: '<label for="size">크기</label>\n<select id="size">\n  <option value="S">작은 컵</option>\n  <option value="M" selected>보통</option>\n  <option value="L">큰 컵</option>\n</select>\n<label for="memo">요청 사항</label>\n<textarea id="memo" rows="3"></textarea>\n<button type="button">그냥 버튼</button>' } },
      { title: '「제출」 은 무엇인가', html: `<p>form 의 제출 버튼을 누르면 브라우저는 입력값을 모아 <b>서버로 보내고 새 페이지로 이동</b>해요(<code>&lt;form action="/order" method="post"&gt;</code>). 서버가 없는 내 폴더에서 누르면 주소 끝에 <code>?</code> 가 붙고 페이지가 새로고침돼 입력이 지워져요 — 그게 「제출」 이에요.</p>
<p>요즘 웹 앱은 대부분 <b>JS 로 제출을 가로채서</b>(<code>event.preventDefault()</code>, 레슨 8) 페이지 이동 없이 처리해요. 그래서 이 레슨에서는 모양만 만들고, 동작은 챕터 2 에서 붙여요.</p>
<p>입력칸의 값을 보는 법(미리 보기): F12 → Console 에서 <code>document.querySelector('#name').value</code>.</p>` },
    ],
    W4: [
      { title: 'CSS 규칙과 선택자', html: `<pre class="code">선택자 { 속성: 값; 속성: 값; }
h1 { color: purple; font-size: 32px; }</pre>
<table class="kb"><tbody><tr><td><code>h1</code></td><td>태그 이름 — 모든 h1</td></tr><tr><td><code>.note</code></td><td>class="note" 인 것 전부(점)</td></tr><tr><td><code>#title</code></td><td>id="title" 인 것 하나(샵)</td></tr><tr><td><code>nav a</code></td><td>nav <b>안의</b> a 만(띄어쓰기 = 안쪽)</td></tr><tr><td><code>h1, h2</code></td><td>둘 다(쉼표)</td></tr><tr><td><code>a:hover</code></td><td>마우스를 올렸을 때</td></tr></tbody></table>
<p>CSS 를 쓰는 곳: ① <code>&lt;head&gt;</code> 안 <code>&lt;style&gt;…&lt;/style&gt;</code> ② 따로 <code>style.css</code> 파일을 만들고 head 에 <code>&lt;link rel="stylesheet" href="style.css"&gt;</code>(여러 페이지가 같이 쓸 때). 같은 요소에 규칙이 겹치면 <b>더 구체적인 것</b>(id &gt; class &gt; 태그), 같으면 <b>나중 것</b>이 이겨요.</p>`, example: { code: '<style>\n  h1 { color: purple; }\n  .note { color: gray; font-size: 14px; }\n  #title { text-decoration: underline; }\n</style>\n<h1 id="title">카페 소개</h1>\n<p class="note">매일 아침 8시에 열어요.</p>' } },
      { title: '색 · 글꼴 · 크기', html: `<table class="kb"><tbody><tr><td><code>color</code> · <code>background-color</code></td><td>글자색 · 배경색: <code>red</code> · <code>#ff6600</code> · <code>rgb(255, 102, 0)</code></td></tr><tr><td><code>font-size: 18px</code> · <code>1.2rem</code></td><td>글자 크기. rem = 기본 글자(보통 16px)의 몇 배</td></tr><tr><td><code>font-weight: bold</code> · <code>700</code></td><td>굵기</td></tr><tr><td><code>font-family: "Pretendard", sans-serif</code></td><td>글꼴(없으면 다음 것)</td></tr><tr><td><code>text-align: center</code></td><td>글자 가운데 정렬</td></tr><tr><td><code>line-height: 1.6</code></td><td>줄 간격 — 한글은 1.6 안팎이 읽기 편해요</td></tr></tbody></table>
<p>VS Code 는 색 값 앞에 작은 색 네모를 보여 주고, 클릭하면 색 고르는 창이 떠요.</p>`, example: { code: '<style>\n  body { font-family: sans-serif; line-height: 1.6; background-color: #fdf6ec; }\n  h1 { color: #6b3e26; text-align: center; }\n  p { font-size: 18px; }\n</style>\n<h1>동네 카페</h1>\n<p>따뜻한 라테 한 잔 어때요?</p>' } },
      { title: '박스 모델: margin · border · padding', html: `<p>모든 요소는 <b>상자</b>예요. 안에서 밖으로:</p>
<pre class="code">┌──────── margin(바깥 여백 — 다른 상자와의 거리) ────────┐
│ ┌────── border(테두리) ──────┐                          │
│ │ ┌─── padding(안쪽 여백) ──┐ │                          │
│ │ │       content(내용)      │ │                          │
│ │ └─────────────────────────┘ │                          │
│ └─────────────────────────────┘                          │
└──────────────────────────────────────────────────────────┘</pre>
<table class="kb"><tbody><tr><td><code>padding: 16px</code></td><td>네 방향 다 · <code>padding: 8px 16px</code> 위아래 8 좌우 16</td></tr><tr><td><code>border: 2px solid #333</code></td><td>두께 · 모양(solid 실선, dashed 점선) · 색</td></tr><tr><td><code>border-radius: 12px</code></td><td>모서리 둥글게</td></tr><tr><td><code>margin: 0 auto</code> + <code>width</code>/<code>max-width</code></td><td>상자를 가운데로</td></tr><tr><td><code>box-sizing: border-box</code></td><td>width 에 padding·border 까지 포함 — 계산이 쉬워져서 보통 전체에 걸어요</td></tr></tbody></table>
<p>F12 → Elements → 요소를 고르면 오른쪽 아래(Computed)에 이 그림이 숫자와 함께 나와요.</p>`, example: { code: '<style>\n  * { box-sizing: border-box; }\n  .card { max-width: 320px; margin: 24px auto; padding: 16px; border: 2px solid #6b3e26; border-radius: 12px; }\n</style>\n<div class="card">\n  <h2>카페라테</h2>\n  <p>4500원</p>\n</div>' } },
    ],
    W5: [
      { title: 'display: flex 로 가로 배치', html: `<p>상자들은 기본으로 <b>위에서 아래로</b> 쌓여요. 부모에 <code>display: flex</code> 를 주면 자식들이 <b>가로로</b> 나란히 서요.</p>
<pre class="code">.row { display: flex; gap: 12px; }
&lt;div class="row"&gt;
  &lt;div&gt;A&lt;/div&gt;&lt;div&gt;B&lt;/div&gt;&lt;div&gt;C&lt;/div&gt;
&lt;/div&gt;</pre>
<table class="kb"><tbody><tr><td><code>gap: 12px</code></td><td>자식 사이 간격</td></tr><tr><td><code>flex-direction: column</code></td><td>세로로(기본은 row)</td></tr><tr><td><code>flex-wrap: wrap</code></td><td>자리가 모자라면 다음 줄로</td></tr><tr><td><code>flex: 1</code>(자식에)</td><td>남는 자리를 나눠 갖기 — 셋 다 주면 똑같은 너비</td></tr></tbody></table>`, example: { code: '<style>\n  .row { display: flex; gap: 12px; }\n  .row > div { flex: 1; padding: 16px; background: #eee; border-radius: 8px; }\n</style>\n<div class="row">\n  <div>아메리카노</div>\n  <div>카페라테</div>\n  <div>크루아상</div>\n</div>' } },
      { title: '정렬: justify-content · align-items', html: `<table class="kb"><tbody><tr><td><code>justify-content</code></td><td><b>가로</b>(주 방향) 정렬: <code>flex-start</code> · <code>center</code> · <code>space-between</code>(양끝 붙이고 사이 균등) · <code>space-around</code></td></tr><tr><td><code>align-items</code></td><td><b>세로</b>(교차 방향) 정렬: <code>stretch</code>(기본) · <code>center</code> · <code>flex-start</code></td></tr></tbody></table>
<pre class="code">/* 화면 한가운데 */
.center { display: flex; justify-content: center; align-items: center; height: 100vh; }</pre>
<p>「가운데 정렬」 은 오랫동안 웹 개발자들의 농담거리였어요(표·float·음수 margin…). flex 로는 위 두 줄이면 끝이에요. <code>100vh</code> = 화면 높이 전체.</p>
<p>자주 쓰는 모양: 머리 막대 = 왼쪽 로고, 오른쪽 메뉴 → <code>justify-content: space-between; align-items: center</code>.</p>`, example: { code: '<style>\n  header { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: #6b3e26; color: white; }\n  nav { display: flex; gap: 16px; }\n  nav a { color: white; }\n</style>\n<header>\n  <b>동네 카페</b>\n  <nav><a href="#">메뉴</a><a href="#">오시는 길</a></nav>\n</header>' } },
      { title: '카드 목록과 F12 의 flex 표시', html: `<p>카드 여러 장을 줄 바꿈하며 나열:</p>
<pre class="code">.cards { display: flex; flex-wrap: wrap; gap: 16px; }
.card  { flex: 1 1 200px; }   ← 기본 200px, 남으면 늘고 모자라면 줄어듦</pre>
<p><code>flex: 1 1 200px</code> = <code>flex-grow</code>(늘어나기) 1 · <code>flex-shrink</code>(줄어들기) 1 · <code>flex-basis</code>(기본 크기) 200px. 화면이 넓으면 한 줄에 여러 장, 좁으면 한 장씩 — 미디어 쿼리 없이도 어느 정도 반응형이 돼요.</p>
<p>F12 → Elements 에서 flex 부모 옆에 작은 <b>flex</b> 단추가 붙어 있어요. 누르면 배치선이 화면에 그려지고, 오른쪽에서 justify-content 등을 눌러 바꿔 볼 수 있어요.</p>`, example: { code: '<style>\n  .cards { display: flex; flex-wrap: wrap; gap: 16px; }\n  .card { flex: 1 1 200px; padding: 16px; border: 1px solid #ccc; border-radius: 12px; }\n</style>\n<div class="cards">\n  <div class="card">아메리카노 4000</div>\n  <div class="card">카페라테 4500</div>\n  <div class="card">크루아상 3500</div>\n  <div class="card">치즈케이크 6000</div>\n</div>' } },
    ],
    W6: [
      { title: 'viewport 와 폰에서 보기', html: `<p>폰 브라우저는 viewport 메타 태그가 없으면 페이지를 PC 폭(980px)으로 그린 다음 <b>작게 줄여</b> 보여 줘요 — 글씨가 깨알만 해져요.</p>
<pre class="code">&lt;meta name="viewport" content="width=device-width, initial-scale=1.0"&gt;</pre>
<p>이 한 줄(VS Code 의 <code>!</code> 뼈대에 이미 있음)이 「폰의 실제 폭으로 그려라」 예요.</p>
<p>확인: F12 → 폰 아이콘(<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>M</kbd>) → 위쪽에서 기종(iPhone 등) 고르기. 또는 내 폰에서 직접: PC 와 폰이 같은 와이파이면 Live Server 주소의 <code>127.0.0.1</code> 자리에 PC 의 IP(명령 프롬프트 <code>ipconfig</code> 의 IPv4 주소)를 넣어 폰 브라우저로.</p>` },
      { title: '@media: 폭에 따라 다른 CSS', html: `<pre class="code">.cards { display: flex; gap: 16px; }

@media (max-width: 600px) {       ← 화면 폭이 600px 이하일 때만
  .cards { flex-direction: column; }
  h1 { font-size: 24px; }
}</pre>
<p>괄호 안 조건이 맞을 때만 그 안의 규칙이 적용돼요. 순서가 중요해요 — 미디어 쿼리는 <b>보통 규칙보다 아래</b>에 써야 덮어써요.</p>
<table class="kb"><tbody><tr><td><code>max-width: 600px</code></td><td>600 이하(폰)</td></tr><tr><td><code>min-width: 900px</code></td><td>900 이상(PC)</td></tr></tbody></table>
<p><b>모바일 먼저</b>: 폰용을 기본으로 쓰고 <code>@media (min-width: 900px)</code> 로 PC 에서 넓히는 방식이 요즘 표준이에요. 폰 사용자가 더 많고, 넓히는 게 줄이는 것보다 쉬워서요.</p>`, example: { code: '<style>\n  .cards { display: flex; flex-direction: column; gap: 12px; }\n  .card { padding: 16px; background: #eee; border-radius: 8px; }\n  @media (min-width: 700px) {\n    .cards { flex-direction: row; }\n    .card { flex: 1; }\n  }\n</style>\n<div class="cards">\n  <div class="card">하나</div><div class="card">둘</div><div class="card">셋</div>\n</div>' } },
      { title: '반응형 체크리스트', html: `<ul><li>viewport 메타 태그가 있다</li><li>폭을 px 로 고정하지 않는다 — <code>width: 100%</code> + <code>max-width: 960px</code></li><li>이미지는 <code>img { max-width: 100%; height: auto; }</code> 로 화면보다 커지지 않게</li><li>폰(390px 안팎)에서 <b>가로 스크롤이 생기지 않는다</b> — 생기면 F12 에서 화면 밖으로 삐져나간 요소를 찾기</li><li>누르는 것(버튼·링크)은 손가락 크기(높이 40px 안팎)</li><li>글자 16px 이상</li></ul>
<p>이 아카데미 사이트도 폰 390px 와 PC 에서 가로 넘침이 없는지 매번 자동으로 검사하고 배포해요.</p>` },
    ],
    W7: [
      { title: 'JS 를 붙이는 법과 Console', html: `<pre class="code">&lt;script src="app.js" defer&gt;&lt;/script&gt;   ← head 안에. defer = HTML 을 다 읽은 뒤 실행</pre>
<p>또는 body 맨 아래에 <code>&lt;script&gt; … &lt;/script&gt;</code>. 이 교과서의 예시 답은 파일 하나로 보기 쉽게 body 맨 아래에 써요.</p>
<p>파이썬의 <code>print</code> = JS 의 <code>console.log</code>. 출력은 화면이 아니라 <b>F12 → Console</b> 에 나와요. Console 에 JS 를 직접 쳐서 바로 실행해 볼 수도 있어요(파이썬 대화형처럼).</p>
<pre class="code">console.log("안녕", 1 + 2);    // 안녕 3</pre>`, example: { code: '<script>\n  console.log("안녕, JS!");\n  console.log(1 + 2, "합계");\n</script>', label: '예제 — index.html 의 body 맨 아래에 붙이고 F12 → Console 에서 보기' } },
      { title: '파이썬 ↔ JavaScript 비교표', html: `<table class="kb"><tbody><tr><th>파이썬</th><th>JavaScript</th></tr><tr><td><code>name = "지훈"</code></td><td><code>let name = "지훈";</code> (바뀌지 않으면 <code>const</code>)</td></tr><tr><td><code>print(x)</code></td><td><code>console.log(x);</code></td></tr><tr><td><code>if x &gt; 0:</code> + 들여쓰기</td><td><code>if (x &gt; 0) { … }</code> — 괄호와 중괄호</td></tr><tr><td><code>elif</code> · <code>else</code></td><td><code>else if</code> · <code>else</code></td></tr><tr><td><code>and</code> <code>or</code> <code>not</code></td><td><code>&amp;&amp;</code> <code>||</code> <code>!</code></td></tr><tr><td><code>==</code></td><td><code>===</code>(꼭 세 개 — 두 개는 <code>"1" == 1</code> 도 참이 되는 함정)</td></tr><tr><td><code>for x in items:</code></td><td><code>for (const x of items) { … }</code></td></tr><tr><td><code>for i in range(3):</code></td><td><code>for (let i = 0; i &lt; 3; i++) { … }</code></td></tr><tr><td><code>def add(a, b): return a + b</code></td><td><code>function add(a, b) { return a + b; }</code> · <code>const add = (a, b) =&gt; a + b;</code></td></tr><tr><td>리스트 <code>[1, 2]</code> · <code>append</code> · <code>len</code></td><td>배열 <code>[1, 2]</code> · <code>push</code> · <code>.length</code></td></tr><tr><td>딕셔너리 <code>{"name": "지훈"}</code> · <code>d["name"]</code></td><td>객체 <code>{ name: "지훈" }</code> · <code>d.name</code></td></tr><tr><td><code>f"{name}님"</code></td><td><code>\`\${name}님\`</code>(백틱)</td></tr><tr><td><code>None</code> · <code>True</code></td><td><code>null</code>(·<code>undefined</code>) · <code>true</code></td></tr></tbody></table>`, example: { code: '<script>\n  const menu = [{ name: "아메리카노", price: 4000 }, { name: "카페라테", price: 4500 }];\n  let total = 0;\n  for (const m of menu) {\n    console.log(`${m.name}: ${m.price}원`);\n    total += m.price;\n  }\n  if (total >= 8000) { console.log("합계", total, "— 쿠폰 사용 가능"); } else { console.log("합계", total); }\n</script>' } },
      { title: '배열 메서드: map · filter · join', html: `<table class="kb"><tbody><tr><td><code>arr.map(x =&gt; x * 2)</code></td><td>하나하나 바꾼 <b>새 배열</b>(파이썬 <code>[x * 2 for x in arr]</code>)</td></tr><tr><td><code>arr.filter(x =&gt; x &gt; 0)</code></td><td>조건에 맞는 것만(<code>[x for x in arr if x &gt; 0]</code>)</td></tr><tr><td><code>arr.join(", ")</code></td><td>글자로 이어 붙이기(<code>", ".join(arr)</code> — 순서가 반대!)</td></tr><tr><td><code>arr.reduce((s, x) =&gt; s + x, 0)</code></td><td>합계(<code>sum(arr)</code>)</td></tr><tr><td><code>arr.includes(x)</code> · <code>arr.indexOf(x)</code></td><td><code>x in arr</code> · 위치</td></tr></tbody></table>
<p><code>x =&gt; x * 2</code> 는 <b>화살표 함수</b> — 파이썬 <code>lambda x: x * 2</code>. 레슨 9 의 「배열 → 화면 그리기」 에서 map + join 을 계속 써요.</p>`, example: { code: '<script>\n  const prices = [4000, 4500, 3500, 6000];\n  console.log(prices.map(p => p + 500));\n  console.log(prices.filter(p => p >= 4500));\n  console.log(prices.reduce((s, p) => s + p, 0));\n  console.log(["a", "b", "c"].join(" - "));\n</script>' } },
    ],
    W8: [
      { title: '요소 찾기와 바꾸기', html: `<p><b>DOM</b> 은 브라우저가 HTML 을 읽어 만든 <b>요소 나무</b>예요(F12 Elements 에 보이는 것). JS 는 이 나무에서 요소를 찾아 바꿔요.</p>
<table class="kb"><tbody><tr><td><code>document.querySelector("#title")</code></td><td>CSS 선택자로 <b>첫 번째</b> 하나 찾기(없으면 <code>null</code>)</td></tr><tr><td><code>document.querySelectorAll(".item")</code></td><td>전부 찾기(<code>for … of</code> 로 돌기)</td></tr><tr><td><code>el.textContent = "새 글"</code></td><td>글자 바꾸기</td></tr><tr><td><code>el.innerHTML = "&lt;b&gt;굵게&lt;/b&gt;"</code></td><td>HTML 로 바꾸기(사용자 입력을 넣을 땐 위험 — textContent 로)</td></tr><tr><td><code>el.style.color = "red"</code></td><td>그 요소의 CSS 하나</td></tr><tr><td><code>el.classList.add("on")</code> · <code>remove</code> · <code>toggle</code></td><td>class 넣기·빼기·켜고 끄기 — 모양은 CSS 에 두고 JS 는 class 만 바꾸는 게 깔끔해요</td></tr><tr><td><code>input.value</code></td><td>입력칸의 글자(늘 <b>문자열</b> — 숫자는 <code>Number(…)</code>)</td></tr></tbody></table>
<div class="bk-warn"><code>Cannot read properties of null</code> = querySelector 가 못 찾았어요. 선택자 오타(<code>#</code>·<code>.</code> 빠짐)이거나, script 가 그 요소보다 <b>먼저</b> 실행됐어요(script 를 body 맨 아래로 또는 <code>defer</code>).</div>`, example: { code: '<h1 id="title">안녕</h1>\n<p class="item">하나</p><p class="item">둘</p>\n<script>\n  document.querySelector("#title").textContent = "반가워요";\n  for (const p of document.querySelectorAll(".item")) {\n    p.style.color = "teal";\n  }\n</script>' } },
      { title: '이벤트: addEventListener', html: `<pre class="code">const btn = document.querySelector("#btn");
btn.addEventListener("click", () =&gt; {
  console.log("눌렀어요");
});</pre>
<table class="kb"><tbody><tr><td><code>"click"</code></td><td>클릭(폰에서는 탭)</td></tr><tr><td><code>"input"</code></td><td>입력칸 글자가 바뀔 때마다</td></tr><tr><td><code>"change"</code></td><td>select·체크박스 값이 바뀌면</td></tr><tr><td><code>"keydown"</code></td><td>키를 누를 때 — <code>e.key === "Enter"</code></td></tr><tr><td><code>"submit"</code>(form 에)</td><td>제출 — 아래 쪽</td></tr></tbody></table>
<p>함수의 첫 번째 인자 <code>e</code>(이벤트 객체)에 무슨 일이 일어났는지 들어 있어요: <code>e.target</code>(누른 요소), <code>e.key</code>(누른 키).</p>`, example: { code: '<button id="btn">눌러 보세요</button>\n<p id="msg"></p>\n<script>\n  let count = 0;\n  document.querySelector("#btn").addEventListener("click", () => {\n    count += 1;\n    document.querySelector("#msg").textContent = `${count}번 눌렀어요`;\n  });\n</script>' } },
      { title: '요소 만들기와 폼 가로채기', html: `<table class="kb"><tbody><tr><td><code>const li = document.createElement("li")</code></td><td>새 요소 만들기(아직 화면엔 없음)</td></tr><tr><td><code>li.textContent = "새 항목"</code></td><td>내용</td></tr><tr><td><code>list.append(li)</code></td><td>list 의 맨 끝 자식으로 붙이기 → 화면에 보임</td></tr><tr><td><code>li.remove()</code></td><td>지우기</td></tr></tbody></table>
<pre class="code">form.addEventListener("submit", (e) =&gt; {
  e.preventDefault();          ← 페이지 새로고침(제출) 막기
  … input.value 로 처리 …
  input.value = "";            ← 입력칸 비우기
});</pre>
<p>form + submit 으로 받으면 버튼 클릭과 <b>Enter</b> 둘 다 한 번에 처리돼요.</p>`, example: { code: '<form id="f">\n  <input id="text" placeholder="할 일">\n  <button>추가</button>\n</form>\n<ul id="list"></ul>\n<script>\n  document.querySelector("#f").addEventListener("submit", (e) => {\n    e.preventDefault();\n    const input = document.querySelector("#text");\n    if (!input.value.trim()) return;\n    const li = document.createElement("li");\n    li.textContent = input.value;\n    document.querySelector("#list").append(li);\n    input.value = "";\n  });\n</script>' } },
    ],
    W9: [
      { title: '상태와 render()', html: `<p>화면을 여기저기서 직접 고치다 보면 「데이터와 화면이 어긋나는」 버그가 생겨요. 깔끔한 방법:</p>
<ol><li>데이터는 <b>변수 하나(상태)</b>에만 둔다 — <code>let todos = []</code></li><li>화면은 <code>render()</code> 함수가 상태를 보고 <b>통째로 다시 그린다</b></li><li>무슨 일이 생기면 <b>상태만 바꾸고 render() 를 부른다</b></li></ol>
<pre class="code">let count = 0;
function render() {
  document.querySelector("#n").textContent = count;
}
plus.addEventListener("click", () =&gt; { count += 1; render(); });
render();</pre>
<p>이게 React·Vue 같은 유명한 도구들의 핵심 생각이에요(그 도구들은 「다시 그리기」 를 똑똑하게 해 줄 뿐).</p>`, example: { code: '<button id="minus">-</button> <b id="n"></b> <button id="plus">+</button>\n<script>\n  let count = 0;\n  function render() { document.querySelector("#n").textContent = count; }\n  document.querySelector("#plus").addEventListener("click", () => { count += 1; render(); });\n  document.querySelector("#minus").addEventListener("click", () => { count = Math.max(0, count - 1); render(); });\n  render();\n</script>' } },
      { title: '배열 상태를 목록으로 그리기', html: `<pre class="code">let todos = [{ text: "장보기", done: false }];
function render() {
  list.innerHTML = todos.map((t, i) =&gt;
    \`&lt;li class="\${t.done ? "done" : ""}" data-i="\${i}"&gt;\${t.text}&lt;/li&gt;\`
  ).join("");
}</pre>
<ul><li><code>map</code> 으로 항목마다 HTML 글자 → <code>join("")</code> 으로 붙여 → <code>innerHTML</code></li><li><code>data-i="0"</code> 같은 <b>data- 속성</b>에 번호를 넣어 두면, 클릭했을 때 <code>e.target.dataset.i</code> 로 어느 항목인지 알아요</li><li>목록 전체에 이벤트 하나만 걸고(<code>list.addEventListener("click", …)</code>) 누른 항목을 찾는 방법을 <b>이벤트 위임</b>이라고 해요 — 다시 그려도 이벤트가 안 사라져요</li></ul>`, example: { code: '<style>.done { text-decoration: line-through; color: gray; }</style>\n<ul id="list"></ul>\n<script>\n  let todos = [{ text: "장보기", done: false }, { text: "운동", done: true }];\n  const list = document.querySelector("#list");\n  function render() {\n    list.innerHTML = todos.map((t, i) => `<li class="${t.done ? "done" : ""}" data-i="${i}">${t.text}</li>`).join("");\n  }\n  list.addEventListener("click", (e) => {\n    const i = e.target.dataset.i;\n    if (i === undefined) return;\n    todos[i].done = !todos[i].done;\n    render();\n  });\n  render();\n</script>' } },
      { title: 'localStorage 로 새로고침해도 남기기', html: `<p>변수는 새로고침하면 사라져요. 브라우저의 <b>localStorage</b> 에 글자로 저장해 두면 남아요(그 컴퓨터·그 브라우저에서만).</p>
<table class="kb"><tbody><tr><td><code>localStorage.setItem("todos", JSON.stringify(todos))</code></td><td>저장 — 배열·객체는 <code>JSON.stringify</code> 로 글자로 바꿔서</td></tr><tr><td><code>JSON.parse(localStorage.getItem("todos"))</code></td><td>불러오기 — 글자를 다시 배열로</td></tr><tr><td><code>… || []</code></td><td>처음이라 없으면(<code>null</code>) 빈 배열</td></tr><tr><td><code>localStorage.removeItem("todos")</code></td><td>지우기</td></tr></tbody></table>
<pre class="code">let todos = JSON.parse(localStorage.getItem("todos")) || [];
function save() { localStorage.setItem("todos", JSON.stringify(todos)); }
// 상태를 바꿀 때마다: save(); render();</pre>
<p>F12 → <b>Application</b> 탭 → Local Storage 에서 저장된 값을 볼 수 있어요. JSON 은 파이썬의 <code>json.dumps</code>·<code>json.loads</code> 와 같은 일이에요.</p>` },
    ],
    W10: [
      { title: '요청과 응답', html: `<p>브라우저(또는 앱·파이썬)가 서버와 대화하는 약속이 <b>HTTP</b> 예요. 한 번의 대화 = <b>요청</b> 하나 + <b>응답</b> 하나.</p>
<pre class="code">요청  GET /todos/1 HTTP/1.1          ← 메서드 + 주소
      Host: jsonplaceholder.typicode.com
      Accept: application/json         ← 헤더(부가 정보)

응답  HTTP/1.1 200 OK                  ← 상태 코드
      Content-Type: application/json
      {"userId": 1, "id": 1, "title": "delectus aut autem", "completed": false}   ← 본문</pre>
<table class="kb"><tbody><tr><td><code>GET</code></td><td>가져오기(읽기)</td></tr><tr><td><code>POST</code></td><td>새로 만들기(본문에 데이터)</td></tr><tr><td><code>PUT</code> · <code>PATCH</code></td><td>바꾸기(통째로 · 일부만)</td></tr><tr><td><code>DELETE</code></td><td>지우기</td></tr></tbody></table>
<p>F12 → <b>Network</b> 탭을 열고 아무 페이지나 새로고침하면, 그 페이지가 보낸 요청이 줄줄이 보여요. 하나를 누르면 Headers(요청·응답 머리) · Response(본문)를 볼 수 있어요.</p>` },
      { title: '상태 코드', html: `<table class="kb"><tbody><tr><td><b>2xx 성공</b></td><td><code>200 OK</code> · <code>201 Created</code>(POST 로 만들어짐) · <code>204 No Content</code>(성공, 본문 없음)</td></tr><tr><td><b>3xx 다른 곳으로</b></td><td><code>301</code>·<code>302</code> 이사 감 · <code>304 Not Modified</code>(전에 받은 것 그대로 써)</td></tr><tr><td><b>4xx 내(요청한 쪽) 잘못</b></td><td><code>400</code> 요청 모양이 틀림 · <code>401</code> 로그인 필요 · <code>403</code> 권한 없음 · <code>404</code> 그런 주소 없음 · <code>429</code> 너무 자주 요청</td></tr><tr><td><b>5xx 서버 잘못</b></td><td><code>500</code> 서버 내부 오류 · <code>503</code> 잠시 못 받음(점검·과부하)</td></tr></tbody></table>
<p>첫 숫자만 봐도 「누구 탓인지」 알 수 있어요. 4xx 면 내 주소·데이터를 고치고, 5xx 면 잠시 뒤 다시.</p>` },
      { title: 'JSON: 데이터를 주고받는 글자 모양', html: `<p>요즘 API 는 데이터를 거의 <b>JSON</b> 으로 주고받아요. 파이썬 딕셔너리·리스트와 거의 같은 모양의 <b>글자</b>예요.</p>
<pre class="code">{
  "name": "카페라테",
  "price": 4500,
  "hot": true,
  "tags": ["커피", "우유"],
  "memo": null
}</pre>
<table class="kb"><tbody><tr><td>파이썬과 다른 점</td><td>열쇠는 꼭 <b>큰따옴표</b> · <code>true</code>/<code>false</code>/<code>null</code>(소문자) · 마지막 쉼표 금지 · 주석 없음</td></tr><tr><td>JS</td><td><code>JSON.parse(글자)</code> → 객체 · <code>JSON.stringify(객체)</code> → 글자</td></tr><tr><td>파이썬</td><td><code>json.loads</code> · <code>json.dumps</code>(파이썬 교과서 X3)</td></tr></tbody></table>
<p>브라우저 주소창에 <a href="https://jsonplaceholder.typicode.com/todos/1" target="_blank" rel="noopener">jsonplaceholder.typicode.com/todos/1</a> 을 열면 JSON 응답을 직접 볼 수 있어요(연습용 가짜 API — 레슨 11 에서 써요).</p>` },
    ],
    W11: [
      { title: 'fetch 와 await', html: `<pre class="code">async function load() {
  const res = await fetch("menu.json");     ← 요청 보내고 응답이 올 때까지 기다림
  const data = await res.json();            ← 본문(JSON 글자)을 객체로
  console.log(data);
}
load();</pre>
<ul><li>서버 응답은 <b>시간이 걸려요</b>. 그동안 화면이 멈추지 않게 JS 는 「나중에 줄게」 라는 <b>약속(Promise)</b>을 먼저 돌려줘요</li><li><code>await</code> = 「그 약속이 끝날 때까지 이 함수 안에서 기다려」. <code>await</code> 는 <code>async</code> 함수 안에서만 써요</li><li><code>fetch("menu.json")</code> = 같은 폴더의 파일. 다른 사이트는 전체 주소</li></ul>
<div class="bk-warn"><b>Live Server 로 열어야 해요.</b> 파일을 더블클릭해 연 <code>file://</code> 주소에서는 브라우저가 보안 때문에 fetch 를 막아요(Console 에 <code>CORS</code>·<code>Failed to fetch</code>). 주소가 <code>http://127.0.0.1:5500/…</code> 인지 확인.</div>`, example: { code: JSON.stringify(MENU_JSON, null, 2), label: '먼저 index.html 옆에 menu.json 을 만들어 이 내용을 저장' } },
      { title: '불러와서 그리기 · 로딩 · 에러', html: `<pre class="code">async function load() {
  status.textContent = "불러오는 중…";
  try {
    const res = await fetch("menu.json");
    if (!res.ok) throw new Error("HTTP " + res.status);   ← 404·500 은 에러가 아니라서 직접 확인
    const menu = await res.json();
    list.innerHTML = menu.map(m =&gt; \`&lt;li&gt;\${m.name} \${m.price}원&lt;/li&gt;\`).join("");
    status.textContent = "";
  } catch (err) {
    status.textContent = "불러오지 못했어요: " + err.message;
  }
}</pre>
<ul><li><code>res.ok</code> = 상태 코드가 200~299. <b>fetch 는 404 여도 에러를 안 내요</b> — 그래서 <code>res.ok</code> 를 꼭 봐요</li><li><code>try … catch</code> = 파이썬 <code>try … except</code>. 인터넷이 끊기면 catch 로</li><li>F12 → Network 에서 menu.json 요청이 200 인지, 주소를 틀리게 해서 404 도 만들어 보세요</li></ul>`, example: { code: WH('메뉴', '  <h1>메뉴</h1>\n  <p id="status"></p>\n  <ul id="list"></ul>', '', 'const status = document.querySelector("#status");\nconst list = document.querySelector("#list");\nasync function load() {\n  status.textContent = "불러오는 중…";\n  try {\n    const res = await fetch("menu.json");\n    if (!res.ok) throw new Error("HTTP " + res.status);\n    const menu = await res.json();\n    list.innerHTML = menu.map(m => `<li>${m.name} ${m.price}원</li>`).join("");\n    status.textContent = "";\n  } catch (err) {\n    status.textContent = "불러오지 못했어요: " + err.message;\n  }\n}\nload();') } },
      { title: '진짜 API: GET 과 POST', html: `<p><b>jsonplaceholder</b> 는 연습용 공개 API 예요(가입 없음). 진짜처럼 응답하지만 저장은 안 돼요.</p>
<pre class="code">// GET — 할 일 3개
const res = await fetch("https://jsonplaceholder.typicode.com/todos?_limit=3");
const todos = await res.json();     // [{userId, id, title, completed}, …]

// POST — 새로 만들기(본문을 JSON 으로)
const res2 = await fetch("https://jsonplaceholder.typicode.com/todos", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ title: "새 할 일", completed: false }),
});
console.log(res2.status, await res2.json());   // 201 {title: "새 할 일", completed: false, id: 201}</pre>
<p>주소 뒤 <code>?_limit=3</code> 같은 <b>쿼리 문자열</b>은 「조건」 이에요(<code>?이름=값&amp;이름=값</code>). 다른 사이트 API 를 부를 수 있는지는 그 서버가 정해요(CORS 허용) — jsonplaceholder 는 허용해요.</p>` },
    ],
    W12: [
      { title: 'requests 설치와 GET', html: `<p>같은 요청을 파이썬으로도 할 수 있어요. 웹 페이지 없이 데이터를 모으거나(크롤링), 서버끼리 주고받을 때 써요.</p>
<div class="bk-step-box"><b>설치(한 번)</b><br>VS Code → 메뉴 <b>터미널 → 새 터미널</b> → <code>python -m pip install requests</code> → <code>Successfully installed requests-…</code></div>
<pre class="code">import requests

res = requests.get("https://jsonplaceholder.typicode.com/todos/1")
print(res.status_code)        # 200
data = res.json()             # 딕셔너리로
print(data["title"])</pre>
<table class="kb"><tbody><tr><td><code>requests.get(url, params={"_limit": 3})</code></td><td>쿼리 문자열을 딕셔너리로(주소 뒤 <code>?_limit=3</code> 을 알아서 붙여 줌)</td></tr><tr><td><code>res.status_code</code> · <code>res.ok</code></td><td>상태 코드 · 200~299 인가</td></tr><tr><td><code>res.json()</code> · <code>res.text</code></td><td>JSON → 딕셔너리·리스트 · 그냥 글자</td></tr><tr><td><code>res.raise_for_status()</code></td><td>4xx·5xx 면 에러를 내기</td></tr></tbody></table>`, example: { code: 'import requests\n\nres = requests.get("https://jsonplaceholder.typicode.com/todos", params={"_limit": 3})\nprint(res.status_code)\nfor t in res.json():\n    mark = "✓" if t["completed"] else " "\n    print(f"[{mark}] {t[\'id\']}. {t[\'title\']}")', label: '예제 파이썬 — requests 설치 뒤 .py 로 실행(인터넷 필요)' } },
      { title: 'POST 와 API 키', html: `<pre class="code">res = requests.post("https://jsonplaceholder.typicode.com/todos",
                    json={"title": "새 할 일", "completed": False})
print(res.status_code, res.json())     # 201 {…, 'id': 201}</pre>
<p><code>json=</code> 에 딕셔너리를 주면 JSON 글자로 바꾸고 Content-Type 헤더까지 붙여 줘요.</p>
<p>날씨·지도·AI 같은 진짜 API 는 대부분 <b>API 키</b>(나를 알아보는 비밀 글자)를 요구해요.</p>
<div class="bk-warn"><b>API 키를 코드에 적지 마세요.</b> GitHub 에 올리는 순간 공개돼요(터미널·Git 교과서 레슨 10). <b>환경 변수</b>에 두고 읽어요:<pre>import os
key = os.environ["WEATHER_KEY"]     # 터미널에서 미리 set WEATHER_KEY=… (Git Bash: export)
requests.get(url, headers={"Authorization": f"Bearer {key}"})</pre>또는 <code>.env</code> 파일에 두고 <code>.gitignore</code> 에 <code>.env</code>.</div>` },
    ],
    W13: [
      { title: 'REST: 주소와 메서드의 약속', html: `<p><b>REST</b> 는 API 주소를 짓는 흔한 규칙이에요: 주소는 <b>무엇(명사·복수)</b>, 메서드는 <b>무엇을 할지(동사)</b>.</p>
<table class="kb"><tbody><tr><td><code>GET /todos</code></td><td>목록</td></tr><tr><td><code>GET /todos/5</code></td><td>5번 하나</td></tr><tr><td><code>POST /todos</code></td><td>새로 만들기 → 201</td></tr><tr><td><code>PATCH /todos/5</code></td><td>5번 일부 바꾸기</td></tr><tr><td><code>DELETE /todos/5</code></td><td>5번 지우기</td></tr><tr><td><code>GET /users/1/todos</code></td><td>1번 사용자의 할 일들</td></tr></tbody></table>
<p>❌ <code>/getTodo?id=5</code> · <code>/deleteTodo/5</code> 처럼 주소에 동사를 넣지 않아요. 이 규칙을 알면 처음 보는 API 문서도 금방 읽혀요.</p>
<p>서버 쪽은 누가 만드나요? 파이썬이면 <b>Flask</b>·<b>FastAPI</b> 로 「이 주소로 GET 이 오면 이걸 돌려줘」 를 몇 줄로 써요 — 이 교과서 다음 단계예요.</p>` },
      { title: 'GitHub Pages 로 내 페이지 올리기', html: `<p>HTML·CSS·JS 만으로 된 페이지(<b>정적 사이트</b>)는 GitHub Pages 에 무료로 올릴 수 있어요. 이 파이썬 아카데미도 그렇게 올라가 있어요.</p>
<div class="bk-step-box"><b>① GitHub 에 올리기</b><br>웹 폴더(예: <code>web-study/profile</code>, 첫 페이지 이름은 꼭 <code>index.html</code>)를 Git 저장소로 만들어 GitHub 에 push — 터미널·Git 교과서 레슨 7·16 그대로(<code>git init</code> → add → commit → New repository → <code>git remote add origin …</code> → <code>git push -u origin main</code>).</div>
<div class="bk-step-box"><b>② Pages 켜기</b><br>GitHub 의 그 저장소 → 위쪽 <b>Settings</b> → 왼쪽 <b>Pages</b> → <b>Build and deployment</b> 의 Source = <b>Deploy from a branch</b> → Branch 칸에서 <b>main</b> · <b>/ (root)</b> → <b>Save</b>.</div>
<div class="bk-step-box"><b>③ 주소 받기</b><br>1~2분 뒤 같은 화면 위에 <b>「Your site is live at https://내아이디.github.io/저장소이름/」</b> 이 떠요. 폰으로도 열어 보세요. 이후로는 고치고 commit → push 하면 몇 분 뒤 자동으로 바뀌어요.</div>
<p class="muted small">저장소는 Public 이어야 무료로 Pages 를 쓸 수 있어요. 안 보이면 저장소의 <b>Actions</b> 탭에서 「pages build and deployment」 가 초록 ✓ 인지 봐요.</p>` },
      { title: '정적 사이트 vs 서버가 필요한 것', html: `<table class="kb"><tbody><tr><th></th><th>정적 사이트(GitHub Pages 로 OK)</th><th>서버가 필요</th></tr><tr><td>무엇</td><td>파일을 그대로 보내 줌 — HTML·CSS·JS·이미지</td><td>요청마다 계산해서 응답 — 로그인, 게시판, 결제</td></tr><tr><td>데이터</td><td>내 브라우저(localStorage), 남의 공개 API(fetch)</td><td>서버의 데이터베이스(SQL 교과서!)</td></tr><tr><td>예</td><td>내 소개 페이지, 할 일 앱(내 폰에서만), 이 아카데미</td><td>여럿이 쓰는 게시판, 쇼핑몰</td></tr></tbody></table>
<p>지금까지 배운 것(HTML·CSS·JS·fetch·localStorage)만으로도 꽤 많은 걸 정적 사이트로 만들 수 있어요. 여럿이 데이터를 함께 쓰는 순간 서버(파이썬 Flask + SQLite)가 필요해져요 — 파이썬·SQL·웹 교과서를 다 배운 지금, 그게 다음 한 걸음이에요.</p>` },
    ],
  },
  tasks: {
    W0: [
      { title: '첫 웹 페이지', text: '<code>index.html</code> 을 만들어(<code>!</code> + Tab) 탭 제목은 <code>내 첫 페이지</code>, 화면에는 큰 제목 <code>안녕, 웹!</code> 과 문단 하나(내용 자유)를 보이게 하세요. Go Live 로 확인.', needs: [['<!DOCTYPE html>', 'W0/1', '뼈대'], ['<title>', 'W0/1', '탭 제목'], ['<h1> · <p>', 'W0/2', '제목·문단']],
        answer: WH('내 첫 페이지', '  <h1>안녕, 웹!</h1>\n  <p>내가 만든 첫 웹 페이지예요.</p>'), checks: [{ text: '탭 제목이 「내 첫 페이지」', sel: 'title', equals: '내 첫 페이지' }, { text: 'h1 이 「안녕, 웹!」', sel: 'h1', equals: '안녕, 웹!' }, { text: 'p 문단이 1개 이상', sel: 'p', count: { min: 1 } }] },
      { title: '굵게와 줄바꿈', text: '카페 메뉴 문단 두 개를 만드세요: 첫 문단은 <code>아메리카노</code> 다음 줄(br)에 <code>4000원</code>, 둘째 문단은 <code>카페라테 4500원</code> 인데 가격만 <b>굵게</b>(strong).', needs: [['<br>', 'W0/2', '줄바꿈'], ['<strong>', 'W0/2', '굵게(중요)']],
        answer: WH('메뉴', '  <p>아메리카노<br>4000원</p>\n  <p>카페라테 <strong>4500원</strong></p>'), checks: [{ text: '문단이 2개', sel: 'p', count: 2 }, { text: '첫 문단 안에 br', sel: 'p:first-of-type br', exists: true }, { text: '굵은 글씨가 「4500원」', sel: 'strong', equals: '4500원' }] },
    ],
    W1: [
      { title: '공지 상자', text: 'div 상자 하나 안에 h2 <code>공지</code> 와 문단 두 개를 넣고, 상자에 <code>id="notice"</code>, 두 문단에 <code>class="note"</code> 를 붙이세요. 들여쓰기도 맞춰요.', needs: [['<div>', 'W1/0', '상자'], ['id="…" · class="…"', 'W1/1', '이름표 속성'], ['<div><p>…</p></div>', 'W1/0', '중첩 — 안쪽 먼저 닫기']],
        answer: WH('공지', '  <div id="notice">\n    <h2>공지</h2>\n    <p class="note">내일은 휴무예요.</p>\n    <p class="note">모레는 오전만 열어요.</p>\n  </div>'), checks: [{ text: 'id="notice" 상자가 있어요', sel: '#notice', exists: true }, { text: '상자 안에 h2 「공지」', sel: '#notice h2', equals: '공지' }, { text: '상자 안에 class="note" 문단 2개', sel: '#notice p.note', count: 2 }] },
      { title: '엇갈린 태그 고치기', text: '아래 HTML 은 굵은 글씨가 문단 밖까지 번져요. 짝을 맞게 고치세요(<code>휴무</code> 만 굵게).<pre class="code">&lt;p&gt;내일은 &lt;strong&gt;휴무&lt;/p&gt;&lt;/strong&gt;\n&lt;p&gt;모레는 정상 영업&lt;/p&gt;</pre>', needs: [['<p><strong>…</strong></p>', 'W1/0', '닫는 순서 — 안쪽 먼저(중첩)'], ['F12 Elements', 'SETUP/2', '실제 나무 보기']],
        answer: WH('공지', '  <p>내일은 <strong>휴무</strong></p>\n  <p>모레는 정상 영업</p>'), checks: [{ text: '굵은 글씨는 「휴무」 하나', sel: 'strong', count: 1 }, { text: 'strong 내용이 「휴무」', sel: 'strong', equals: '휴무' }, { text: '둘째 문단은 굵지 않아요', sel: 'p:nth-of-type(2) strong', exists: false }] },
    ],
    W2: [
      { title: '카페 소개 페이지', text: 'header(가게 이름 h1), nav(같은 페이지 <code>#menu</code> 로 가는 링크 <code>메뉴</code>), main 안에 <code>id="menu"</code> section(메뉴 표: 머리 칸 <code>메뉴</code>·<code>가격</code> + 메뉴 3행), footer(전화번호)를 만드세요.', needs: [['<header> <nav> <main> <section> <footer>', 'W2/2', '시맨틱 태그'], ['<a href="#id">', 'W2/1', '같은 페이지로'], ['<table> <tr> <th> <td>', 'W2/2', '표']],
        answer: WH('동네 카페', '  <header><h1>동네 카페</h1></header>\n  <nav><a href="#menu">메뉴</a></nav>\n  <main>\n    <section id="menu">\n      <table>\n        <tr><th>메뉴</th><th>가격</th></tr>\n        <tr><td>아메리카노</td><td>4000</td></tr>\n        <tr><td>카페라테</td><td>4500</td></tr>\n        <tr><td>크루아상</td><td>3500</td></tr>\n      </table>\n    </section>\n  </main>\n  <footer>☎ 02-123-4567</footer>'),
        checks: [{ text: 'header 안에 h1', sel: 'header h1', exists: true }, { text: 'nav 에 #menu 로 가는 링크', sel: 'nav a[href="#menu"]', exists: true }, { text: 'main 안에 id="menu" section', sel: 'main section#menu', exists: true }, { text: '표의 머리 칸 2개', sel: '#menu th', count: 2 }, { text: '메뉴 행 3개(머리 줄 빼고)', sel: '#menu tr', count: 4 }, { text: 'footer 가 있어요', sel: 'footer', exists: true }] },
      { title: '할 일 목록과 사진', text: '순서 있는 목록(ol)으로 <code>라테 만드는 순서</code> 3단계를 만들고, 그 아래 아무 사진 하나를 <code>alt</code> 설명과 함께 넣으세요(사진 주소는 <code>https://picsum.photos/300</code> 를 써도 돼요). 사진을 누르면 MDN(<code>https://developer.mozilla.org/ko/</code>)이 새 탭으로 열리게.', needs: [['<ol> <li>', 'W2/0', '순서 있는 목록'], ['<img src alt>', 'W2/1', '이미지 + 설명'], ['<a target="_blank">', 'W2/1', '새 탭 링크']],
        answer: WH('라테', '  <h2>라테 만드는 순서</h2>\n  <ol>\n    <li>에스프레소 내리기</li>\n    <li>우유 데우기</li>\n    <li>붓기</li>\n  </ol>\n  <a href="https://developer.mozilla.org/ko/" target="_blank">\n    <img src="https://picsum.photos/300" alt="무작위 풍경 사진" width="300">\n  </a>'),
        checks: [{ text: 'ol 에 li 3개', sel: 'ol li', count: 3 }, { text: '이미지에 alt 설명이 있어요', sel: 'img', attr: { name: 'alt' } }, { text: '이미지가 새 탭 링크 안에', sel: 'a[target="_blank"] img', exists: true }] },
    ],
    W3: [
      { title: '음료 주문 폼', text: '주문 폼을 만드세요: <code>이름</code>(글자, 꼭 입력) · <code>잔 수</code>(숫자 1~10, 처음 1) · <code>크기</code>(select: 작은 컵 S / 보통 M / 큰 컵 L) · <code>포장</code> 체크박스 · <code>요청 사항</code>(여러 줄) · <code>주문</code> 버튼. 모든 입력칸에 label 을 연결하세요.', needs: [['<input type required min max>', 'W3/0', '입력칸'], ['<label for="id">', 'W3/0', '이름표 연결'], ['<select> <option value>', 'W3/1', '고르기'], ['<textarea>', 'W3/1', '여러 줄']],
        answer: WH('주문', '  <form>\n    <label for="name">이름</label>\n    <input id="name" type="text" required>\n    <label for="cups">잔 수</label>\n    <input id="cups" type="number" min="1" max="10" value="1">\n    <label for="size">크기</label>\n    <select id="size">\n      <option value="S">작은 컵</option>\n      <option value="M">보통</option>\n      <option value="L">큰 컵</option>\n    </select>\n    <label><input type="checkbox" id="takeout"> 포장</label>\n    <label for="memo">요청 사항</label>\n    <textarea id="memo" rows="3"></textarea>\n    <button>주문</button>\n  </form>'),
        checks: [{ text: '이름 칸은 꼭 입력(required)', sel: 'input[type="text"]', attr: { name: 'required' } }, { text: '잔 수는 숫자 칸, 1~10', sel: 'input[type="number"][min="1"][max="10"]', exists: true }, { text: '크기 고르기에 option 3개', sel: 'select option', count: 3 }, { text: '포장 체크박스', sel: 'input[type="checkbox"]', exists: true }, { text: '여러 줄 입력칸', sel: 'textarea', exists: true }, { text: 'label 이 4개 이상', sel: 'label', count: { min: 4 } }] },
    ],
    W4: [
      { title: '메뉴 카드 꾸미기', text: '메뉴 카드(<code>class="card"</code>) 하나를 꾸미세요: 너비 최대 320px 로 가운데, 안쪽 여백 16px, 2px 실선 테두리, 모서리 12px 둥글게, 이름(h2)은 갈색(<code>#6b3e26</code>), 가격(<code>class="price"</code>)은 굵게.', needs: [['.class { }', 'W4/0', '선택자'], ['padding · border · border-radius · margin: 0 auto', 'W4/2', '박스 모델'], ['color · font-weight', 'W4/1', '색·굵기']],
        answer: WH('카드', '  <div class="card">\n    <h2>카페라테</h2>\n    <p class="price">4500원</p>\n  </div>', '    * { box-sizing: border-box; }\n    .card { max-width: 320px; margin: 24px auto; padding: 16px; border: 2px solid #6b3e26; border-radius: 12px; }\n    .card h2 { color: #6b3e26; }\n    .price { font-weight: bold; }'),
        checks: [{ text: '카드 안쪽 여백 16px', sel: '.card', css: { prop: 'padding-top', value: '16px' } }, { text: '테두리 2px 실선', sel: '.card', css: { prop: 'border-top-style', value: 'solid' } }, { text: '모서리 12px', sel: '.card', css: { prop: 'border-top-left-radius', value: '12px' } }, { text: '최대 너비 320px', sel: '.card', css: { prop: 'max-width', value: '320px' } }, { text: '이름이 갈색 #6b3e26', sel: '.card h2', css: { prop: 'color', value: '#6b3e26' } }, { text: '가격이 굵게', sel: '.price', css: { prop: 'font-weight', value: '700' } }] },
      { title: 'id · class · 태그 선택자', text: '세 문단 중 <code>class="sale"</code> 인 두 문단은 빨간색, 그중 <code>id="best"</code> 는 글자 크기 24px, 나머지 보통 문단은 회색이 되게 CSS 를 쓰세요(HTML 은 그대로).<pre class="code">&lt;p&gt;아메리카노&lt;/p&gt;\n&lt;p class="sale"&gt;카페라테&lt;/p&gt;\n&lt;p class="sale" id="best"&gt;크루아상&lt;/p&gt;</pre>', needs: [['p · .sale · #best', 'W4/0', '선택자 세 가지'], ['#id > .class > p', 'W4/0', '더 구체적인 선택자가 이김']],
        answer: WH('세일', '  <p>아메리카노</p>\n  <p class="sale">카페라테</p>\n  <p class="sale" id="best">크루아상</p>', '    p { color: gray; }\n    .sale { color: red; }\n    #best { font-size: 24px; }'),
        checks: [{ text: '보통 문단은 회색', sel: 'p:first-of-type', css: { prop: 'color', value: 'gray' } }, { text: '.sale 은 빨강', sel: 'p.sale', css: { prop: 'color', value: 'red' } }, { text: '#best 는 24px', sel: '#best', css: { prop: 'font-size', value: '24px' } }] },
    ],
    W5: [
      { title: '머리 막대', text: 'header 에 왼쪽은 가게 이름, 오른쪽은 nav 링크 3개가 오도록 flex 로 배치하세요(양끝으로 벌리고 세로 가운데). nav 링크 사이 간격 16px.', needs: [['display: flex', 'W5/0', '가로 배치'], ['justify-content: space-between', 'W5/1', '양끝으로'], ['align-items: center', 'W5/1', '세로 가운데'], ['gap', 'W5/0', '간격']],
        answer: WH('카페', '  <header>\n    <b>동네 카페</b>\n    <nav><a href="#">메뉴</a><a href="#">소개</a><a href="#">오시는 길</a></nav>\n  </header>', '    header { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: #6b3e26; }\n    header, header a { color: white; }\n    nav { display: flex; gap: 16px; }'),
        checks: [{ text: 'header 가 flex', sel: 'header', css: { prop: 'display', value: 'flex' } }, { text: '양끝으로(space-between)', sel: 'header', css: { prop: 'justify-content', value: 'space-between' } }, { text: '세로 가운데', sel: 'header', css: { prop: 'align-items', value: 'center' } }, { text: 'nav 링크 3개, 사이 16px', sel: 'nav', css: { prop: 'column-gap', value: '16px' } }] },
      { title: '화면 한가운데 버튼', text: '화면 높이 전체(<code>100vh</code>)를 쓰는 상자 한가운데(가로·세로)에 <code>시작하기</code> 버튼 하나가 오게 하세요.', needs: [['justify-content: center · align-items: center', 'W5/1', '가운데'], ['100vh', 'W5/1', '화면 높이']],
        answer: WH('가운데', '  <div class="center"><button>시작하기</button></div>', '    body { margin: 0; }\n    .center { display: flex; justify-content: center; align-items: center; height: 100vh; }'),
        checks: [{ text: '상자가 flex', sel: '.center, body > div', css: { prop: 'display', value: 'flex' } }, { text: '버튼이 가로 가운데', sel: 'button', js: '(r => Math.abs((r.left + r.right) / 2 - innerWidth / 2) < 3)(document.querySelector("button").getBoundingClientRect())' }, { text: '버튼이 세로 가운데', sel: 'button', js: '(r => Math.abs((r.top + r.bottom) / 2 - innerHeight / 2) < 3)(document.querySelector("button").getBoundingClientRect())' }] },
    ],
    W6: [
      { title: '폰에서는 세로로', text: '카드 3장이 PC(700px 이상)에서는 가로로 같은 너비, 폰에서는 세로로 쌓이게 하세요. 모바일 먼저(기본 = 세로, <code>@media (min-width: 700px)</code> 에서 가로). F12 폰 화면으로 확인.', needs: [['@media (min-width: …)', 'W6/1', '넓을 때만'], ['flex-direction', 'W5/0', '가로·세로'], ['viewport', 'W6/0', '폰 폭으로']],
        answer: WH('카드', '  <div class="cards">\n    <div class="card">하나</div>\n    <div class="card">둘</div>\n    <div class="card">셋</div>\n  </div>', '    .cards { display: flex; flex-direction: column; gap: 12px; }\n    .card { padding: 16px; background: #eee; border-radius: 8px; }\n    @media (min-width: 700px) {\n      .cards { flex-direction: row; }\n      .card { flex: 1; }\n    }'),
        checks: [{ text: '넓은 화면: 카드가 가로 한 줄', sel: '.card', js: 'new Set([...document.querySelectorAll(".card")].map(c => Math.round(c.getBoundingClientRect().top))).size === 1' }, { text: '폰(390px): 카드가 세로로', viewport: 390, sel: '.card', js: 'new Set([...document.querySelectorAll(".card")].map(c => Math.round(c.getBoundingClientRect().top))).size === 3' }, { text: 'viewport 메타 태그', sel: 'meta[name="viewport"]', exists: true }] },
    ],
    WB1: [
      { title: '🏠 내 소개 페이지', text: '나를 소개하는 한 페이지를 만드세요. 조건: header(이름 h1) · nav(같은 페이지 구역으로 가는 링크 2개 이상) · main 안에 <code>about</code>·<code>skills</code> 두 section(skills 는 배운 것 목록 ul) · footer · 카드 모양 section(여백·테두리·둥근 모서리) · 폰에서 가로 넘침 없음. 다 되면 레슨 13 에서 인터넷에 올려요.', needs: [['<header> <main> <section> <footer>', 'W2/2', '시맨틱 태그로 구조'], ['<a href="#id">', 'W2/1', '구역으로'], ['padding · border · border-radius', 'W4/2', '박스 모델로 카드'], ['flex', 'W5/1', '머리 막대'], ['max-width: 100%', 'W6/2', '반응형 체크리스트']],
        answer: WH('지훈의 소개', '  <header>\n    <h1>지훈</h1>\n    <nav><a href="#about">소개</a><a href="#skills">배운 것</a></nav>\n  </header>\n  <main>\n    <section id="about" class="box">\n      <h2>소개</h2>\n      <p>파이썬과 웹을 배우고 있어요.</p>\n    </section>\n    <section id="skills" class="box">\n      <h2>배운 것</h2>\n      <ul><li>파이썬</li><li>터미널·Git</li><li>SQL</li><li>HTML·CSS·JS</li></ul>\n    </section>\n  </main>\n  <footer>© 2026 지훈</footer>', '    * { box-sizing: border-box; }\n    body { margin: 0; font-family: sans-serif; line-height: 1.6; }\n    header { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: #23395d; color: white; }\n    header a { color: white; margin-left: 12px; }\n    main { max-width: 720px; margin: 0 auto; padding: 16px; }\n    .box { padding: 16px; margin: 16px 0; border: 1px solid #ccc; border-radius: 12px; }\n    footer { text-align: center; padding: 16px; color: gray; }'),
        checks: [{ text: 'header 안에 h1', sel: 'header h1', exists: true }, { text: 'nav 에 # 링크 2개 이상', sel: 'nav a[href^="#"]', count: { min: 2 } }, { text: 'section#about · section#skills', sel: 'main section#about, main section#skills', count: 2 }, { text: 'skills 에 목록', sel: '#skills ul li', count: { min: 1 } }, { text: 'footer', sel: 'footer', exists: true }, { text: 'section 이 둥근 카드', sel: 'section#about', js: '(s => parseFloat(s.borderTopLeftRadius) > 0 && parseFloat(s.paddingTop) > 0)(getComputedStyle(document.querySelector("#about")))' }, { text: '폰 390px 에서 가로 넘침 없음', viewport: 390, sel: 'body', js: 'document.documentElement.scrollWidth <= innerWidth' }] },
    ],
    W7: [
      { title: 'Console 에 장바구니 합계', text: 'script 에서 배열 <code>cart = [4000, 4500, 3500]</code> 의 합계를 for … of 로 구해 화면의 <code>id="total"</code> 에 <code>합계: 12000원</code> 으로 보이고, Console 에도 합계를 찍으세요.', needs: [['for (const x of arr)', 'W7/1', '반복'], ['console.log', 'W7/0', 'Console 출력'], ['`${…}`', 'W7/1', '글자 안에 값']],
        answer: WH('합계', '  <p id="total"></p>', '', 'const cart = [4000, 4500, 3500];\nlet total = 0;\nfor (const price of cart) {\n  total += price;\n}\nconsole.log(total);\ndocument.querySelector("#total").textContent = `합계: ${total}원`;'),
        checks: [{ text: '화면에 「합계: 12000원」', sel: '#total', equals: '합계: 12000원' }] },
      { title: 'map · filter 로 할인 목록', text: '<code>menu = [{name:"아메리카노",price:4000},{name:"카페라테",price:4500},{name:"치즈케이크",price:6000}]</code> 에서 4500원 <b>이상</b>만 골라(filter) 10% 할인한 값으로 <code>이름 가격원</code> 글자를 만들어(map) <code>, </code> 로 이어(join) <code>id="sale"</code> 에 보이게.', needs: [['filter', 'W7/2', '골라내기'], ['map', 'W7/2', '바꾸기'], ['join', 'W7/2', '이어 붙이기']],
        answer: WH('할인', '  <p id="sale"></p>', '', 'const menu = [{ name: "아메리카노", price: 4000 }, { name: "카페라테", price: 4500 }, { name: "치즈케이크", price: 6000 }];\nconst text = menu.filter(m => m.price >= 4500).map(m => `${m.name} ${m.price * 0.9}원`).join(", ");\ndocument.querySelector("#sale").textContent = text;'),
        checks: [{ text: '「카페라테 4050원, 치즈케이크 5400원」', sel: '#sale', equals: '카페라테 4050원, 치즈케이크 5400원' }] },
    ],
    W8: [
      { title: '좋아요 버튼', text: '<code>♥ 좋아요</code> 버튼을 누를 때마다 옆의 숫자(<code>id="likes"</code>, 처음 0)가 1씩 늘고, 버튼에 <code>on</code> class 가 켜지게(빨간색은 CSS 로).', needs: [['addEventListener("click")', 'W8/1', '클릭'], ['textContent', 'W8/0', '글자 바꾸기'], ['classList.add', 'W8/0', 'class 켜기']],
        answer: WH('좋아요', '  <button id="like">♥ 좋아요</button> <span id="likes">0</span>', '    .on { color: red; }', 'let likes = 0;\nconst btn = document.querySelector("#like");\nbtn.addEventListener("click", () => {\n  likes += 1;\n  document.querySelector("#likes").textContent = likes;\n  btn.classList.add("on");\n});'),
        checks: [{ text: '처음엔 0', sel: '#likes', equals: '0' }, { text: '세 번 누르면 3', click: 'button', times: 3, then: { sel: '#likes', equals: '3' } }, { text: '누르면 버튼에 on class', click: 'button', then: { sel: 'button.on', exists: true } }] },
      { title: '입력하는 대로 미리 보기', text: '입력칸에 글자를 칠 때마다 아래 <code>id="preview"</code> 에 <code>안녕하세요, ○○님!</code> 이 바로 보이게(<code>input</code> 이벤트).', needs: [['addEventListener("input")', 'W8/1', '칠 때마다'], ['input.value', 'W8/0', '입력값']],
        answer: WH('미리 보기', '  <input id="name" placeholder="이름">\n  <p id="preview"></p>', '', 'const input = document.querySelector("#name");\ninput.addEventListener("input", () => {\n  document.querySelector("#preview").textContent = `안녕하세요, ${input.value}님!`;\n});'),
        checks: [{ text: '「지훈」 을 치면 「안녕하세요, 지훈님!」', input: { sel: 'input', value: '지훈' }, then: { sel: '#preview', equals: '안녕하세요, 지훈님!' } }] },
      { title: '폼으로 목록에 추가', text: '입력칸 + <code>추가</code> 버튼 form 을 만들어, 제출하면(버튼 또는 Enter) 새로고침 없이 아래 ul 에 li 로 추가되고 입력칸이 비워지게. 빈 칸은 무시.', needs: [['addEventListener("submit")', 'W8/2', '제출'], ['e.preventDefault()', 'W8/2', '새로고침 막기'], ['createElement · append', 'W8/2', '요소 만들어 붙이기']],
        answer: WH('목록', '  <form id="f">\n    <input id="text" placeholder="할 일">\n    <button>추가</button>\n  </form>\n  <ul id="list"></ul>', '', 'document.querySelector("#f").addEventListener("submit", (e) => {\n  e.preventDefault();\n  const input = document.querySelector("#text");\n  if (!input.value.trim()) return;\n  const li = document.createElement("li");\n  li.textContent = input.value;\n  document.querySelector("#list").append(li);\n  input.value = "";\n});'),
        checks: [{ text: '「장보기」 를 쓰고 제출 → 목록에 1개, 입력칸은 비워짐', input: { sel: '#text', value: '장보기' }, submit: '#f', then: { sel: 'ul li', count: 1 } }, { text: '빈 칸으로 「추가」 를 누르면 늘지 않음(그대로 1개)', click: 'button', then: { sel: 'ul li', count: 1 } }] },
    ],
    W9: [
      { title: '카운터 (상태 + render)', text: '<code>-</code> <code>숫자</code> <code>+</code> 카운터를 상태 변수와 <code>render()</code> 로 만드세요. 0 아래로는 안 내려가고, 10 이상이면 숫자에 <code>max</code> class 가 붙게.', needs: [['let 상태 + render()', 'W9/0', '상태 바꾸고 다시 그리기'], ['classList.toggle(이름, 조건)', 'W8/0', '조건으로 켜고 끄기']],
        answer: WH('카운터', '  <button id="minus">-</button> <b id="n"></b> <button id="plus">+</button>', '    .max { color: red; }', 'let count = 0;\nconst n = document.querySelector("#n");\nfunction render() {\n  n.textContent = count;\n  n.classList.toggle("max", count >= 10);\n}\ndocument.querySelector("#plus").addEventListener("click", () => { count += 1; render(); });\ndocument.querySelector("#minus").addEventListener("click", () => { count = Math.max(0, count - 1); render(); });\nrender();'),
        checks: [{ text: '처음 0', sel: '#n', equals: '0' }, { text: '- 를 눌러도 0 아래로 안 감', click: '#minus', times: 2, then: { sel: '#n', equals: '0' } }, { text: '+ 10번 → 10, max class', click: '#plus', times: 10, then: { sel: '#n.max', equals: '10' } }] },
      { title: '새로고침해도 남는 메모', text: 'textarea 에 쓴 메모가 칠 때마다 localStorage(<code>"memo"</code>)에 저장되고, 페이지를 다시 열면 그 내용이 그대로 보이게.', needs: [['localStorage.setItem · getItem', 'W9/2', '저장·불러오기'], ['addEventListener("input")', 'W8/1', '칠 때마다']],
        answer: WH('메모', '  <textarea id="memo" rows="5" placeholder="메모"></textarea>', '', 'const memo = document.querySelector("#memo");\nmemo.value = localStorage.getItem("memo") || "";\nmemo.addEventListener("input", () => {\n  localStorage.setItem("memo", memo.value);\n});'),
        checks: [{ text: '치면 localStorage 「memo」 에 저장', input: { sel: 'textarea', value: '우유 사기' }, then: { sel: 'textarea', js: 'localStorage.getItem("memo") === "우유 사기"' } }] },
    ],
    WB2: [
      { title: '할 일 앱', text: '할 일 앱을 만드세요: 입력 form 으로 추가 · 항목을 누르면 끝냄 표시(줄 긋기, <code>done</code> class) 토글 · 각 항목의 <code>×</code> 버튼으로 지우기 · 아래에 <code>남은 일 N개</code> · localStorage 저장(새로고침해도 남음). 상태 배열 + render() 로.', needs: [['상태 + render()', 'W9/0', '다시 그리기'], ['map · join · data-i', 'W9/1', '배열 → 목록'], ['e.target.dataset.i', 'W9/1', '이벤트 위임 — 목록 하나에 이벤트'], ['localStorage + JSON', 'W9/2', '저장'], ['submit · preventDefault', 'W8/2', '추가']],
        answer: WH('할 일', '  <h1>할 일</h1>\n  <form id="f"><input id="text" placeholder="할 일"><button>추가</button></form>\n  <ul id="list"></ul>\n  <p id="left"></p>', '    .done span { text-decoration: line-through; color: gray; }\n    li { cursor: pointer; }', 'let todos = JSON.parse(localStorage.getItem("todos")) || [];\nconst list = document.querySelector("#list");\nfunction save() { localStorage.setItem("todos", JSON.stringify(todos)); }\nfunction render() {\n  list.innerHTML = todos.map((t, i) => `<li class="${t.done ? "done" : ""}" data-i="${i}"><span data-i="${i}">${t.text}</span> <button class="del" data-i="${i}">×</button></li>`).join("");\n  document.querySelector("#left").textContent = `남은 일 ${todos.filter(t => !t.done).length}개`;\n}\ndocument.querySelector("#f").addEventListener("submit", (e) => {\n  e.preventDefault();\n  const input = document.querySelector("#text");\n  if (!input.value.trim()) return;\n  todos.push({ text: input.value.trim(), done: false });\n  input.value = "";\n  save(); render();\n});\nlist.addEventListener("click", (e) => {\n  const i = e.target.dataset.i;\n  if (i === undefined) return;\n  if (e.target.classList.contains("del")) todos.splice(i, 1);\n  else todos[i].done = !todos[i].done;\n  save(); render();\n});\nrender();'),
        checks: [{ text: '「빨래」 추가 → 남은 일 1개', input: { sel: '#text', value: '빨래' }, submit: '#f', then: { sel: '#left', equals: '남은 일 1개' } }, { text: '항목을 누르면 done', click: '#list li span', then: { sel: '#list li.done', count: 1 } }, { text: 'localStorage 에 저장', sel: 'body', js: '(JSON.parse(localStorage.getItem("todos")) || []).length >= 1' }, { text: '× 를 누르면 지워짐', click: '#list .del', then: { sel: '#list li', count: 0 } }] },
    ],
    W10: [
      { title: 'Network 탭으로 요청 읽기', text: '아무 사이트(예: 이 아카데미)를 연 채 F12 → <b>Network</b> → 새로고침. ① 맨 위 요청(문서)의 <b>상태 코드</b> ② <b>Type</b> 이 <code>script</code> 인 요청 하나의 주소 ③ 일부러 없는 주소(<code>…/없는페이지</code>)를 열었을 때의 상태 코드를 확인하세요.', needs: [['F12 Network', 'W10/0', '요청 목록'], ['200 · 304 · 404', 'W10/1', '상태 코드']],
        answer: '① 200 (또는 캐시면 304)\n② 예: …/core/config.js?v=…\n③ 404', noRun: true },
      { title: 'JSON 읽고 쓰기', text: '아래 JSON 글자를 <code>JSON.parse</code> 로 객체로 만들어, <code>name</code> 과 <code>tags</code> 의 개수를 <code>카페라테 · 태그 2개</code> 처럼 <code>id="out"</code> 에 보이고, <code>price</code> 를 5000 으로 바꾼 객체를 <code>JSON.stringify</code> 로 다시 글자로 만들어 <code>id="json"</code> 에 보이세요.<pre class="code">{"name": "카페라테", "price": 4500, "tags": ["커피", "우유"]}</pre>', needs: [['JSON.parse · JSON.stringify', 'W10/2', '글자 ↔ 객체'], ['.length', 'W7/1', '배열 길이']],
        answer: WH('JSON', '  <p id="out"></p>\n  <pre id="json"></pre>', '', 'const text = \'{"name": "카페라테", "price": 4500, "tags": ["커피", "우유"]}\';\nconst item = JSON.parse(text);\ndocument.querySelector("#out").textContent = `${item.name} · 태그 ${item.tags.length}개`;\nitem.price = 5000;\ndocument.querySelector("#json").textContent = JSON.stringify(item);'),
        checks: [{ text: '「카페라테 · 태그 2개」', sel: '#out', equals: '카페라테 · 태그 2개' }, { text: 'price 가 5000 인 JSON 글자', sel: '#json', contains: '"price":5000' }] },
    ],
    W11: [
      { title: 'menu.json 불러와 그리기', text: 'index.html 옆에 준비 파일 <code>menu.json</code> 을 두고, fetch 로 불러와 <code>아메리카노 4000원</code> 모양의 li 로 그리세요. 불러오는 동안 <code>불러오는 중…</code>, 실패하면 <code>불러오지 못했어요</code> 를 <code>id="status"</code> 에. <b>Live Server 로 열어야 해요.</b>', needs: [['async · await fetch', 'W11/0', '불러오기'], ['res.ok · res.json()', 'W11/1', '확인·JSON'], ['try … catch', 'W11/1', '에러'], ['map · join', 'W7/2', '그리기']],
        prep: { name: 'menu.json', text: JSON.stringify(MENU_JSON, null, 2) }, mock: { 'menu.json': MENU_JSON },
        answer: WH('메뉴', '  <h1>메뉴</h1>\n  <p id="status"></p>\n  <ul id="list"></ul>', '', 'const status = document.querySelector("#status");\nconst list = document.querySelector("#list");\nasync function load() {\n  status.textContent = "불러오는 중…";\n  try {\n    const res = await fetch("menu.json");\n    if (!res.ok) throw new Error("HTTP " + res.status);\n    const menu = await res.json();\n    list.innerHTML = menu.map(m => `<li>${m.name} ${m.price}원</li>`).join("");\n    status.textContent = "";\n  } catch (err) {\n    status.textContent = "불러오지 못했어요";\n  }\n}\nload();'),
        checks: [{ text: '메뉴 3개가 li 로', wait: 600, sel: '#list li', count: 3 }, { text: '첫 줄 「아메리카노 4000원」', wait: 600, sel: '#list li:first-child', equals: '아메리카노 4000원' }] },
      { title: '공개 API 에서 할 일 3개', text: '버튼 <code>불러오기</code> 를 누르면 <code>https://jsonplaceholder.typicode.com/todos?_limit=3</code> 에서 할 일 3개를 받아, <code>1. delectus aut autem</code> 처럼 번호와 제목을 li 로 그리세요. 끝낸 일(<code>completed</code>)이면 ✓ 를 앞에.', needs: [['fetch(주소?쿼리)', 'W11/2', '공개 API'], ['addEventListener("click")', 'W8/1', '버튼'], ['조건 ? 참 : 거짓', 'W7/1', '삼항 연산자로 ✓']],
        mock: { 'jsonplaceholder.typicode.com/todos': TODOS3 },
        answer: WH('할 일', '  <button id="load">불러오기</button>\n  <ul id="list"></ul>', '', 'document.querySelector("#load").addEventListener("click", async () => {\n  const res = await fetch("https://jsonplaceholder.typicode.com/todos?_limit=3");\n  const todos = await res.json();\n  document.querySelector("#list").innerHTML = todos.map(t => `<li>${t.completed ? "✓ " : ""}${t.id}. ${t.title}</li>`).join("");\n});'),
        checks: [{ text: '누르면 3개', click: '#load', wait: 600, then: { sel: '#list li', count: 3 } }, { text: '첫 줄 「1. delectus aut autem」', click: '#load', wait: 600, then: { sel: '#list li:first-child', equals: '1. delectus aut autem' } }] },
    ],
    W12: [
      { title: '파이썬으로 할 일 보고서', text: '파이썬 <code>todos.py</code> 에서 requests 로 <code>https://jsonplaceholder.typicode.com/todos</code> 를 <code>params={"userId": 1}</code> 로 받아, 전체 개수·끝낸 개수·끝낸 비율(%)을 출력하세요.', needs: [['requests.get(url, params=…)', 'W12/0', 'GET + 쿼리'], ['res.json()', 'W12/0', '리스트로']],
        answer: 'import requests\n\nres = requests.get("https://jsonplaceholder.typicode.com/todos", params={"userId": 1})\nres.raise_for_status()\ntodos = res.json()\ndone = sum(1 for t in todos if t["completed"])\nprint("전체", len(todos))\nprint("끝냄", done)\nprint(f"비율 {done / len(todos) * 100:.0f}%")', io: [{ output: '전체 20\n끝냄 11\n비율 55%' }], noRun: true /* 인터넷·requests 설치가 필요 — 사이트 검사 밖 */ },
    ],
    W13: [
      { title: '🏠 내 소개 페이지를 인터넷에', text: '보스 WB1 에서 만든 내 소개 페이지를 GitHub 저장소로 올리고 GitHub Pages 를 켜서, <code>https://내아이디.github.io/저장소이름/</code> 주소로 <b>폰에서</b> 열어 보세요.', needs: [['git init · git push', 'W13/1', '터미널·Git 교과서 레슨 7·16 의 순서'], ['Settings → Pages', 'W13/1', 'Pages 켜기'], ['index.html', 'W13/1', '첫 페이지 이름']],
        answer: 'cd ~/web-study/profile\ngit init -b main\ngit add .\ngit commit -m "내 소개 페이지"\ngit remote add origin https://github.com/내아이디/profile.git\ngit push -u origin main\n(GitHub → Settings → Pages → Deploy from a branch → main / (root) → Save)', noRun: true },
    ],
    WB3: [
      { title: '카페 주문 화면', text: '<code>menu.json</code> 을 불러와 메뉴마다 <code>담기</code> 버튼이 있는 목록을 그리고, 누르면 장바구니(<code>id="cart"</code>)에 담기고 합계(<code>id="sum"</code>, <code>합계 8500원</code>)가 바뀌게. <code>주문하기</code> 버튼을 누르면 <code>https://jsonplaceholder.typicode.com/posts</code> 로 장바구니를 POST 하고 응답의 id 로 <code>주문 번호 101</code> 을 <code>id="result"</code> 에 보이세요.', needs: [['fetch menu.json', 'W11/1', '불러와 그리기'], ['상태 + render()', 'W9/0', '장바구니'], ['이벤트 위임 · data-id', 'W9/1', '어느 메뉴의 버튼'], ['fetch POST', 'W11/2', '주문 보내기'], ['reduce', 'W7/2', '합계']],
        prep: { name: 'menu.json', text: JSON.stringify(MENU_JSON, null, 2) }, mock: { 'menu.json': MENU_JSON, 'jsonplaceholder.typicode.com/posts': { id: 101 } },
        answer: WH('주문', '  <h1>카페 주문</h1>\n  <ul id="menu"></ul>\n  <h2>장바구니</h2>\n  <ul id="cart"></ul>\n  <p id="sum">합계 0원</p>\n  <button id="order">주문하기</button>\n  <p id="result"></p>', '', 'let menu = [];\nlet cart = [];\nfunction render() {\n  document.querySelector("#menu").innerHTML = menu.map(m => `<li>${m.name} ${m.price}원 <button data-id="${m.id}">담기</button></li>`).join("");\n  document.querySelector("#cart").innerHTML = cart.map(m => `<li>${m.name}</li>`).join("");\n  const sum = cart.reduce((s, m) => s + m.price, 0);\n  document.querySelector("#sum").textContent = `합계 ${sum}원`;\n}\ndocument.querySelector("#menu").addEventListener("click", (e) => {\n  const id = Number(e.target.dataset.id);\n  if (!id) return;\n  cart.push(menu.find(m => m.id === id));\n  render();\n});\ndocument.querySelector("#order").addEventListener("click", async () => {\n  const res = await fetch("https://jsonplaceholder.typicode.com/posts", {\n    method: "POST",\n    headers: { "Content-Type": "application/json" },\n    body: JSON.stringify({ items: cart.map(m => m.id) }),\n  });\n  const data = await res.json();\n  document.querySelector("#result").textContent = `주문 번호 ${data.id}`;\n});\nasync function load() {\n  const res = await fetch("menu.json");\n  menu = await res.json();\n  render();\n}\nload();'),
        checks: [{ text: '메뉴 3개와 담기 버튼', wait: 600, sel: '#menu button', count: 3 }, { text: '아메리카노 + 카페라테 담으면 합계 8500원', wait: 600, sel: 'body', js: '(() => { document.querySelectorAll("#menu button")[0].click(); document.querySelectorAll("#menu button")[1].click(); return document.querySelector("#sum").textContent === "합계 8500원"; })()' }, { text: '주문하기 → 「주문 번호 101」', click: '#order', wait: 600, then: { sel: '#result', equals: '주문 번호 101' } }] },
    ],
  },
};
