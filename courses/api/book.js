// courses/api/book.js — 「HTTP·API·SDK 교과서」 데이터 (v2.27.0, 설계 specs/http-api-course.md). 화면은 core/ui-views-book.js(다른 교과서와 같은 틀).
// 연습: 사용자 PC 의 VS Code + 파이썬(requests) · 터미널 curl(PowerShell 은 curl.exe) · 브라우저 F12.
// tasks 두 종류(check_book 의 BOOK.check === 'api' — 운영체제 교과서의 'os' 와 같은 규칙):
//   ① 로직 문제 — 응답 JSON · 상태 코드 · 주소를 인자로 받는 함수. answer 를 python3 로 실제 실행해 io 의 출력 예와 비교(인터넷 안 씀)
//   ② 진짜 API 를 부르는 문제(curl · httpbin · Open-Meteo · 브라우저) — noRun: true + checks(「내 화면에서 확인할 것」 ☐) — CI 는 인터넷 API 를 부르지 않아요(설계 6절)
const WEATHER_SAMPLE = '{\n  "latitude": 37.55, "longitude": 127.0, "timezone": "Asia/Seoul",\n  "current_units": {"temperature_2m": "°C"},\n  "current": {"time": "2026-11-07T15:00", "temperature_2m": 12.3},\n  "daily_units": {"temperature_2m_max": "°C", "precipitation_probability_max": "%"},\n  "daily": {"time": ["2026-11-07"], "temperature_2m_max": [15.1], "temperature_2m_min": [6.2], "precipitation_probability_max": [20]}\n}';
const BOOK = {
  check: 'api',
  meta: {
    prereq: [
      { lessons: ['H0', 'H1', 'HB1'], chapters: [1], ref: 'SETUP/0', btn: '시작하기 1 · 준비물 보기',
        title: '먼저 꼭! 파이썬 + requests, 그리고 PowerShell 에서는 curl.exe',
        html: '파이썬 교과서 「시작하기」 로 VS Code 와 파이썬이 있어야 하고, VS Code 터미널에서 <code>python -m pip install requests</code> 를 한 번 해요. VS Code 의 기본 터미널(<b>PowerShell</b>)에서 <code>curl</code> 은 다른 명령의 별명이라 <code>-v</code> · <code>-i</code> 가 안 돼요 — <b><code>curl.exe</code></b> 로 치거나 Git Bash 를 써요. 명령 줄이 처음이면 터미널·Git 교과서 레슨 0~2 부터.' },
    ],
    kicker: '🔌 HTTP·API·SDK 교과서', hero: '남의 API 부르기 → 내 API 만들기 → 내 SDK 만들기',
    heroP: '프로그램끼리 대화하는 법을 세 겹으로 배워요: <b>HTTP</b>(말하는 방법) → <b>API</b>(정해 둔 약속) → <b>SDK</b>(약속을 감싼 라이브러리). 터미널의 <code>curl</code> 과 파이썬 <code>requests</code> 로 진짜 공개 API 를 부르고, 나중엔 내 API 서버와 그 SDK 까지 만들어요. 채점·점수·잠금은 없어요.',
    dexName: 'HTTP·API 도감', dexShort: '도감', dexWhat: '명령·코드', dexHint: '「상태 코드」「CORS」 처럼 한국어로도 찾기',
    dexExamples: '<code>curl -v</code>, <code>404</code>, <code>Content-Type</code>, <code>CORS</code>', dexPlaceholder: '🔍 찾기 — curl, 상태 코드, 헤더, JSON …', dexAlt: '「응답 확인」 대신 <code>curl -i</code>',
    dexDocs: 'MDN <a href="https://developer.mozilla.org/ko/docs/Web/HTTP" target="_blank" rel="noopener">HTTP 문서(한국어)</a> · <a href="https://requests.readthedocs.io/" target="_blank" rel="noopener">requests 문서</a>',
    dexRun: '명령·코드는 📋 복사해서 터미널이나 VS Code 의 .py 파일에 붙여 쓸 수 있고', builtinsName: '자주 쓰는 curl · 헤더 · 상태 코드', builtinsSub: '터미널과 응답에서', builtinsChip: '🔌 curl · 상태 코드',
    copyToast: '📋 복사했어요. 터미널(PowerShell 이면 curl.exe)이나 VS Code 의 .py 파일에 붙여 넣어요',
    exampleLabel: '예제 코드 — VS Code 의 .py 파일로 실행',
    makeIntro: 'VS Code 에서 공부 폴더(<code>api-study</code>)에 파일(예: <code>{file}</code>)을 만들고 직접 짜 보세요. 「출력 예」 가 있는 문제는 인터넷 없이 도는 함수 문제예요 — 같은 글이 나오면 성공. 「내 화면에서 확인할 것」 이 있는 문제는 진짜 API 를 부르는 문제예요 — 터미널 · 브라우저에서 하나씩 확인해요.',
    makeTail: '막히면 「필요한 코드·명령」 을 눌러 설명을 다시 보고, 그래도 막히면 맨 아래 예시 답을 펴 보세요. 예시 답과 달라도 같은 결과가 나오면 맞아요. 공개 API 의 응답 숫자(기온 · id)는 그날그날 달라요.',
    fileExt: '.py', answerLabel: '예시 답', needsLabel: '필요한 코드·명령', checkLabel: '확인 코드', outLabel: '출력 예', checksLabel: '내 화면에서 확인할 것',
  },
  setup: {
    title: '시작하기: curl 과 requests 로 API 부를 준비',
    pages: [
      { title: '1. 준비물: 파이썬 · requests · curl', html: `<table class="kb"><tbody><tr><td><b>VS Code + 파이썬</b></td><td>파이썬 교과서 「시작하기」 그대로. 이 교과서는 함수 · 딕셔너리 · 예외 · (챕터 4 에서) 클래스를 써요</td></tr><tr><td><b>requests</b></td><td>VS Code 메뉴 <b>터미널 → 새 터미널</b> → <code>python -m pip install requests</code></td></tr><tr><td><b>curl</b></td><td>Windows 10 · 11 에 들어 있어요. <b>Git Bash</b> 에서는 <code>curl</code>, VS Code 의 PowerShell 에서는 <b><code>curl.exe</code></b>(그냥 <code>curl</code> 은 다른 명령이에요)</td></tr><tr><td><b>크롬 · 엣지</b></td><td>F12 → Network(레슨 4)</td></tr><tr><td><b>공부 폴더</b></td><td>문서 폴더 등에 <code>api-study</code> 를 만들고 VS Code 로 열기(파일 → 폴더 열기)</td></tr></tbody></table>
<p>확인: 아래 세 줄이 에러 없이 버전을 보여 주면 준비 끝이에요.</p>`,
        example: { label: '예제 명령 — VS Code 터미널(PowerShell)', shell: 'python --version\npython -c "import requests; print(requests.__version__)"\ncurl.exe --version' } },
      { title: '2. 이 교과서 쓰는 법', html: `<ul><li><b>레슨</b> — 설명 · 예제. 예제는 두 종류예요: <b>예제 코드</b>(인터넷 없이 도는 파이썬 — .py 로 저장해 실행)와 <b>예제 명령</b>(curl · 진짜 API 를 부르는 코드 — 인터넷이 필요).</li><li><b>만들어 보기</b>도 두 종류예요. 「<b>출력 예</b>」 가 있는 문제는 응답을 <b>인자로 받는 함수</b>를 만드는 것 — 같은 글이 나오면 성공. 「<b>내 화면에서 확인할 것</b>」 ☐ 이 있는 문제는 진짜 API 를 불러 보는 것이에요.</li><li><b>공개 API 는 바뀔 수 있어요.</b> 본문의 응답 예는 2026년 11월 모양이에요. 기온 · id · 날짜 같은 값은 그날그날 달라요.</li><li><b>API 키 · 토큰은 코드에 쓰지 않아요</b>(레슨 7). 챕터 1 의 서버들은 키가 없어도 돼요.</li><li><b>남의 서버를 두드리지 않기</b>: 반복문으로 공개 API 를 부를 땐 몇 번만, 사이에 쉬면서(레슨 8).</li></ul>` },
    ],
  },
  builtins: [
    { name: 'curl -v 주소', desc: '보낸 글자(>)와 받은 글자(<)를 다 보기.', code: 'curl -v https://httpbin.org/get', ref: 'H1/1' },
    { name: 'curl -i 주소', desc: '본문 앞에 상태 줄과 헤더.', code: 'curl -i https://httpbin.org/status/404', ref: 'H2/1' },
    { name: 'curl -L 주소', desc: '3xx 리다이렉트를 따라가기.', code: 'curl -iL "https://httpbin.org/redirect-to?url=/get"', ref: 'H2/1' },
    { name: 'curl -X POST -H … -d …', desc: '메서드 · 헤더 · 본문을 붙여 보내기.', code: 'curl -X POST https://httpbin.org/post -H "Content-Type: application/json" -d \'{"name": "지훈"}\'', ref: 'H1/2' },
    { name: '2xx · 3xx · 4xx · 5xx', desc: '성공 · 다른 곳으로 · 내 요청을 고치기 · 서버 문제(잠시 뒤).', ref: 'H2/0' },
    { name: '200 · 201 · 204', desc: '성공 · 만들어짐 · 성공(본문 없음).', ref: 'H2/0' },
    { name: '401 · 403 · 404 · 422 · 429', desc: '누구세요 · 권한 없음 · 없음 · 값이 규칙에 안 맞음 · 너무 자주.', ref: 'H2/2' },
    { name: 'Content-Type: application/json', desc: '「본문은 JSON 이에요」 — 보낼 때도 받을 때도.', ref: 'H3/0' },
    { name: 'Accept · User-Agent · Authorization', desc: '「이 모양으로 주세요」 · 「나는 이 프로그램」 · 「나는 누구」.', ref: 'H3/0' },
    { name: 'Access-Control-Allow-Origin', desc: '브라우저에게 「이 출처의 페이지에 응답을 넘겨줘도 돼요」(CORS).', ref: 'H4/2' },
  ],
  tasks: {
    H0: [
      { title: '내 PC 에서 API 부를 준비', text: 'VS Code 터미널에서 <code>requests</code> 를 설치하고, <code>curl</code> 로 httpbin 에 첫 요청을 보내 보세요. 그다음 아래 다섯 줄 파이썬(<code>hello_api.py</code>)을 실행해 상태 코드와 주소가 나오는지 봐요.<pre class="code">import requests\n\nres = requests.get("https://httpbin.org/get", timeout=10)\nprint(res.status_code)\nprint(res.json()["url"])</pre>', noRun: true,
        needs: [['python -m pip install requests', 'H0/2', '설치'], ['curl.exe --version', 'H0/2', 'PowerShell 에서는 curl.exe'], ['requests.get(url, timeout=10)', 'H0/2', '파이썬으로 같은 요청']],
        checks: [{ text: '`curl.exe --version`(또는 Git Bash 의 `curl --version`)이 curl 8.x 를 보여 줘요' }, { text: '`curl https://httpbin.org/get` 의 응답에 "url": "https://httpbin.org/get" 이 있어요' }, { text: 'hello_api.py 가 200 과 https://httpbin.org/get 을 찍어요' }],
        answer: 'python -m pip install requests\ncurl.exe --version\ncurl.exe https://httpbin.org/get\npython hello_api.py\n200\nhttps://httpbin.org/get' },
    ],
    H1: [
      { title: '주소 쪼개기', text: '<code>urllib.parse</code> 로 주소를 쪼개는 함수 <code>split_url(url)</code> 을 만드세요. 호스트 · 경로 · 쿼리(딕셔너리 — 값이 하나면 글자 하나로)를 돌려줘요. 아래 두 주소로 확인.<pre class="code">https://httpbin.org/get?city=seoul&amp;days=3\nhttps://api.github.com/users/octocat/repos?per_page=5&amp;sort=updated</pre>', needs: [['urlparse(url)', 'H1/0', '규칙 · 호스트 · 경로 · 쿼리'], ['parse_qs(u.query)', 'H1/0', '쿼리를 딕셔너리로']],
        answer: 'from urllib.parse import urlparse, parse_qs\n\ndef split_url(url):\n    u = urlparse(url)\n    query = {k: v[0] if len(v) == 1 else v for k, v in parse_qs(u.query).items()}\n    return u.netloc, u.path, query\n\nfor url in ["https://httpbin.org/get?city=seoul&days=3",\n            "https://api.github.com/users/octocat/repos?per_page=5&sort=updated"]:\n    host, path, query = split_url(url)\n    print(host, path, query)',
        io: [{ output: "httpbin.org /get {'city': 'seoul', 'days': '3'}\napi.github.com /users/octocat/repos {'per_page': '5', 'sort': 'updated'}" }] },
      { title: '쿼리를 붙여 보내고 되돌려 받기', text: 'curl 로 httpbin 의 <code>/get</code> 에 쿼리 <code>name=지훈</code> · <code>lang=ko</code> 를 붙여 보내고, 응답의 <code>args</code> 에 그대로 돌아오는지 보세요. <code>-v</code> 로 요청 줄의 경로도 확인(한글은 % 로 바뀌어 보여요). 그다음 같은 일을 <code>-X POST</code> 와 JSON 본문으로 <code>/post</code> 에.', noRun: true,
        needs: [['curl -v "주소?이름=값"', 'H1/1', '요청 줄 보기'], ['curl -X POST -H "Content-Type: application/json" -d', 'H1/2', '본문 보내기']],
        checks: [{ text: '/get 응답의 "args" 에 "lang": "ko" 와 이름이 있어요' }, { text: '-v 의 > GET /get?… 줄에서 한글이 %EC… 처럼 바뀐 걸 봤어요' }, { text: '/post 응답의 "json" 칸에 내가 보낸 값이 있어요' }],
        answer: 'curl -v "https://httpbin.org/get?name=%EC%A7%80%ED%9B%88&lang=ko"\ncurl -X POST https://httpbin.org/post -H "Content-Type: application/json" -d \'{"name": "지훈", "lang": "ko"}\'' },
    ],
    H2: [
      { title: '상태 코드로 할 일 고르기', text: '상태 코드를 받아 <b>다음에 할 일</b>을 돌려주는 함수 <code>next_step(status)</code> 를 만드세요: 2xx 「그대로 쓰기」, 3xx 「Location 주소로」, 401 「토큰 확인」, 403 「권한 확인」, 404 「주소 · id 확인」, 429 · 503 「기다렸다 다시」, 그 밖의 4xx 「보낸 값 확인」, 그 밖의 5xx 「잠시 뒤 다시 · 계속이면 알리기」. 아래 순서로 찍어요: 200 201 302 401 403 404 422 429 500 503.', needs: [['if 200 <= status < 300', 'H2/2', '범위로 갈래 나누기'], ['401 · 403 · 404 · 429', 'H2/2', '누구 탓인가 표']],
        answer: 'def next_step(status):\n    if 200 <= status < 300:\n        return "그대로 쓰기"\n    if 300 <= status < 400:\n        return "Location 주소로"\n    if status == 401:\n        return "토큰 확인"\n    if status == 403:\n        return "권한 확인"\n    if status == 404:\n        return "주소 · id 확인"\n    if status in (429, 503):\n        return "기다렸다 다시"\n    if 400 <= status < 500:\n        return "보낸 값 확인"\n    return "잠시 뒤 다시 · 계속이면 알리기"\n\nfor s in [200, 201, 302, 401, 403, 404, 422, 429, 500, 503]:\n    print(s, next_step(s))',
        io: [{ output: '200 그대로 쓰기\n201 그대로 쓰기\n302 Location 주소로\n401 토큰 확인\n403 권한 확인\n404 주소 · id 확인\n422 보낸 값 확인\n429 기다렸다 다시\n500 잠시 뒤 다시 · 계속이면 알리기\n503 기다렸다 다시' }] },
      { title: '상태 코드 눈으로 보기', text: 'curl <code>-i</code> 로 httpbin 의 <code>/status/201</code> · <code>/status/404</code> · <code>/status/503</code> 을 불러 상태 줄을 보고, <code>/redirect-to?url=/get</code> 을 <code>-i</code> 와 <code>-iL</code> 로 각각 불러 차이를 보세요.', noRun: true,
        needs: [['curl -i', 'H2/1', '상태 줄과 헤더'], ['curl -L', 'H2/1', '리다이렉트 따라가기']],
        checks: [{ text: '세 요청의 첫 줄이 201 · 404 · 503 이에요' }, { text: '-i 만 붙인 리다이렉트는 302 와 Location: /get 에서 멈춰요' }, { text: '-iL 은 302 다음에 200 과 /get 의 JSON 까지 나와요' }],
        answer: 'curl -i https://httpbin.org/status/201\ncurl -i https://httpbin.org/status/404\ncurl -i https://httpbin.org/status/503\ncurl -i "https://httpbin.org/redirect-to?url=/get"\ncurl -iL "https://httpbin.org/redirect-to?url=/get"' },
    ],
    H3: [
      { title: '중첩 JSON 에서 꺼내기', text: 'GitHub API 의 저장소 응답 모양(아래 글자)을 <code>json.loads</code> 로 읽어 <code>octocat/Hello-World ★ 2,800 · 주인 octocat · 주제 2개</code> 처럼 한 줄로 찍으세요. 별 수는 세 자리 쉼표.<pre class="code">{"full_name": "octocat/Hello-World", "stargazers_count": 2800,\n "owner": {"login": "octocat", "type": "User"},\n "topics": ["demo", "hello"], "private": false}</pre>', needs: [['json.loads(text)', 'H3/1', 'JSON 글자 → dict'], ['data["owner"]["login"]', 'H3/1', '중첩 꺼내기'], ['f"{n:,}"', 'H3/1', '세 자리 쉼표(파이썬 교과서)']],
        answer: 'import json\n\ntext = \'{"full_name": "octocat/Hello-World", "stargazers_count": 2800, "owner": {"login": "octocat", "type": "User"}, "topics": ["demo", "hello"], "private": false}\'\nrepo = json.loads(text)\nprint(f"{repo[\'full_name\']} ★ {repo[\'stargazers_count\']:,} · 주인 {repo[\'owner\'][\'login\']} · 주제 {len(repo[\'topics\'])}개")',
        io: [{ output: 'octocat/Hello-World ★ 2,800 · 주인 octocat · 주제 2개' }] },
      { title: 'JSON 이 아니면 알려 주기', text: '응답의 <code>Content-Type</code> 과 본문 글자를 받아 딕셔너리를 돌려주는 <code>read_json(content_type, text)</code> 를 만드세요. Content-Type 이 <code>application/json</code> 으로 시작하지 않으면 <code>ValueError("JSON 이 아니에요: text/html")</code>, 읽다가 깨지면 <code>ValueError("깨진 JSON: " + 앞 15글자)</code>. 아래 세 경우를 try/except 로 찍어요.', needs: [['json.JSONDecodeError', 'H3/2', '깨진 JSON'], ['Content-Type', 'H3/2', '먼저 보기'], ['raise ValueError(…)', 'H3/2', '알려 주기']],
        answer: 'import json\n\ndef read_json(content_type, text):\n    if not content_type.startswith("application/json"):\n        raise ValueError("JSON 이 아니에요: " + content_type.split(";")[0])\n    try:\n        return json.loads(text)\n    except json.JSONDecodeError:\n        raise ValueError("깨진 JSON: " + text[:15])\n\ncases = [("application/json; charset=utf-8", \'{"ok": true}\'),\n         ("text/html; charset=utf-8", "<h1>502 Bad Gateway</h1>"),\n         ("application/json", \'{"ok": true, "items": [1, 2\')]\nfor ct, text in cases:\n    try:\n        print("읽음", read_json(ct, text))\n    except ValueError as e:\n        print("문제", e)',
        io: [{ output: "읽음 {'ok': True}\n문제 JSON 이 아니에요: text/html\n문제 깨진 JSON: {\"ok\": true, \"i" }] },
    ],
    H4: [
      { title: 'Network 탭으로 요청 읽기', text: '이 교과서 페이지를 연 채 F12 → <b>Network</b> → 새로고침. ① 맨 위 요청(document)의 Status ② Type 이 script 인 요청 하나의 Response Headers 에서 <code>content-type</code> ③ 아무 요청이나 <b>Timing</b> 에서 가장 오래 걸린 칸을 확인하세요. 그다음 <b>Disable cache</b> 를 켜고 다시 새로고침해 Status 가 어떻게 바뀌는지.', noRun: true,
        needs: [['F12 → Network', 'H4/0', '요청 목록'], ['Headers · Timing', 'H4/0', '줄을 눌러 보기']],
        checks: [{ text: '맨 위 요청의 Status 가 200(또는 304)이에요' }, { text: 'script 요청의 content-type 이 javascript 를 담고 있어요' }, { text: 'Disable cache 를 켜면 304 였던 줄이 200 으로 바뀌어요' }],
        answer: '① 200 (캐시면 304)\n② content-type: application/javascript (또는 text/javascript)\n③ 보통 Waiting for server response 나 Content Download 가 가장 길어요' },
      { title: 'fetch 로 할 일 5개 그리기', text: '웹 교과서처럼 html 파일을 만들어, <code>https://jsonplaceholder.typicode.com/todos?_limit=5</code> 를 fetch 로 불러 할 일 5개를 목록으로 그리세요(끝낸 일은 앞에 ✓). <code>res.ok</code> 가 아니면 화면에 「불러오지 못했어요 (상태 코드)」. Go Live 로 열어 Network 에서 그 요청의 Status 와 응답 헤더의 <code>access-control-allow-origin</code> 을 확인해요.', noRun: true,
        needs: [['fetch(주소)', 'H4/1', '브라우저에서 API 부르기'], ['res.ok · res.status', 'H4/1', '상태 확인'], ['Access-Control-Allow-Origin', 'H4/2', 'CORS 허락']],
        checks: [{ text: '화면에 할 일 5개가 보이고, 끝낸 일 앞에 ✓ 가 있어요' }, { text: 'Network 에서 todos?_limit=5 요청의 Status 가 200 이에요' }, { text: '응답 헤더에 access-control-allow-origin 이 있어요(그래서 CORS 에 안 막혀요)' }, { text: '주소를 …/todoss 로 틀리게 바꾸면 「불러오지 못했어요 (404)」 가 보여요' }],
        answer: '<ul id="list"></ul>\n<p id="msg"></p>\n<script>\n  async function load() {\n    const res = await fetch("https://jsonplaceholder.typicode.com/todos?_limit=5");\n    if (!res.ok) {\n      document.querySelector("#msg").textContent = `불러오지 못했어요 (${res.status})`;\n      return;\n    }\n    const todos = await res.json();\n    document.querySelector("#list").innerHTML = todos.map(t => `<li>${t.completed ? "✓ " : ""}${t.title}</li>`).join("");\n  }\n  load();\n</script>' },
    ],
    HB1: [ // v2.27.0 챕터 1 만들어 보기
      { title: '🏠 날씨 알리미', text: '키 없는 날씨 API <b>Open-Meteo</b> 로 서울(위도 37.57 · 경도 126.98)의 지금 기온 · 오늘 최고/최저 · 비 올 확률을 받아 한 줄로 찍는 <code>weather.py</code> 를 만드세요. 조건: <code>params=</code> 로 쿼리 · <code>timeout=10</code> · 상태 코드가 200 이 아니면 그 코드를 알려 주기 · 인터넷이 끊겼거나 너무 느리면(<code>requests.exceptions.RequestException</code>) 「연결할 수 없어요」. 쿼리는 아래 다섯 가지(위도 · 경도는 따로).<pre class="code">current=temperature_2m\ndaily=temperature_2m_max,temperature_2m_min,precipitation_probability_max\ntimezone=Asia/Seoul\nforecast_days=1</pre>줄 만드는 부분은 다음 문제의 함수를 그대로 써요.', noRun: true,
        needs: [['requests.get(url, params={…}, timeout=10)', 'H0/2', 'API 부르기'], ['res.status_code', 'H0/2', '상태 코드 확인(갈래는 레슨 2)'], ['res.json()', 'H3/1', 'JSON → dict'], ['try … except', 'H3/2', '문제가 생기면 알려 주기']],
        checks: [{ text: '`python weather.py` 가 「서울 지금 …°C · 오늘 …~…°C · 비 올 확률 …%」 한 줄을 찍어요' }, { text: '주소를 …/v1/forecastt 로 틀리게 바꾸면 「날씨를 못 받았어요 (404)」 가 나와요' }, { text: '와이파이를 끄고 돌리면 「연결할 수 없어요」 가 나와요(에러 화면 대신)' }],
        answer: 'import requests\n\nURL = "https://api.open-meteo.com/v1/forecast"\nPARAMS = {\n    "latitude": 37.57, "longitude": 126.98,\n    "current": "temperature_2m",\n    "daily": "temperature_2m_max,temperature_2m_min,precipitation_probability_max",\n    "timezone": "Asia/Seoul", "forecast_days": 1,\n}\n\ndef weather_line(city, data):\n    try:\n        now = data["current"]["temperature_2m"]\n        d = data["daily"]\n        hi, lo, rain = d["temperature_2m_max"][0], d["temperature_2m_min"][0], d["precipitation_probability_max"][0]\n    except (KeyError, IndexError, TypeError):\n        return f"{city}: 응답 모양이 이상해요"\n    return f"{city} 지금 {now}°C · 오늘 {lo}~{hi}°C · 비 올 확률 {rain}%"\n\ntry:\n    res = requests.get(URL, params=PARAMS, timeout=10)\nexcept requests.exceptions.RequestException:\n    print("연결할 수 없어요")\nelse:\n    if res.status_code != 200:\n        print(f"날씨를 못 받았어요 ({res.status_code})")\n    else:\n        print(weather_line("서울", res.json()))' },
      { title: '응답으로 한 줄 만들기', text: '위 문제의 <code>weather_line(city, data)</code> 를 인터넷 없이 확인해요. Open-Meteo 응답 모양(아래 글자)을 <code>json.loads</code> 로 읽어 넣으면 <code>서울 지금 12.3°C · 오늘 6.2~15.1°C · 비 올 확률 20%</code> 가 나오고, <code>current</code> 칸이 빠진 응답이나 <code>daily</code> 의 목록이 빈 응답에는 <code>서울: 응답 모양이 이상해요</code> 가 나오게.<pre class="code">' + WEATHER_SAMPLE + '</pre>', needs: [['data["daily"]["temperature_2m_max"][0]', 'H3/1', '중첩 꺼내기'], ['except (KeyError, IndexError)', 'H3/2', '필요한 키가 없을 때']],
        answer: 'import json\n\ndef weather_line(city, data):\n    try:\n        now = data["current"]["temperature_2m"]\n        d = data["daily"]\n        hi, lo, rain = d["temperature_2m_max"][0], d["temperature_2m_min"][0], d["precipitation_probability_max"][0]\n    except (KeyError, IndexError, TypeError):\n        return f"{city}: 응답 모양이 이상해요"\n    return f"{city} 지금 {now}°C · 오늘 {lo}~{hi}°C · 비 올 확률 {rain}%"\n\nsample = json.loads(\'\'\'' + WEATHER_SAMPLE + '\'\'\')\nprint(weather_line("서울", sample))\nno_current = {k: v for k, v in sample.items() if k != "current"}\nprint(weather_line("서울", no_current))\nempty = json.loads(json.dumps(sample))\nempty["daily"]["temperature_2m_max"] = []\nprint(weather_line("서울", empty))',
        io: [{ output: '서울 지금 12.3°C · 오늘 6.2~15.1°C · 비 올 확률 20%\n서울: 응답 모양이 이상해요\n서울: 응답 모양이 이상해요' }] },
    ],
  },
};
