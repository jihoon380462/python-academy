// courses/api/content.js — 「HTTP·API·SDK 교과서」 (v2.27.0, 사용자 11/7 D15 「HTTP-API-SDK 는 서로 연결되니까 같이 묶을 거야」 · 「ㄱ」). 설계: specs/http-api-course.md
// 처음부터 교과서 모드(book.js + core/ui-views-book.js). 문제·채점 없음(PROBLEMS 빈 배열). 연습은 사용자 PC 의 VS Code + 파이썬(requests) + 터미널 curl + 브라우저 F12.
// 레슨 쪽 example.code = 인터넷 없이 도는 파이썬(check_book 이 python3 로 실제 실행) · example.shell = curl 명령 · 인터넷을 부르는 파이썬 · 브라우저 JS(사이트 검사에서 안 돌림 — CI 는 인터넷 API 를 부르지 않아요, 설계 6절)
// 본문의 응답 예는 httpbin(로컬에서 같은 프로그램을 띄워 실제로 받은 모양) · jsonplaceholder · Open-Meteo 의 2026-11 모양. Host · Date · origin 같은 줄은 사람마다 달라요.
const COURSE = { id: 'api', name: 'HTTP·API·SDK', runner: 'python', bench: false,
  tutorPersona: '너는 파이썬을 아는 성인에게 HTTP·API·SDK 를 가르치는 선생님이다. 원리를 말한 뒤 꼭 curl -v · requests · F12 Network 로 실제로 오가는 글자를 보게 한다. API 키를 코드에 쓰지 않게 늘 챙긴다.' };
const CHAPTERS = [
  { ch: 1, name: 'HTTP 들여다보기', color: '#00897b' },
  { ch: 2, name: 'API 제대로 쓰기', color: '#3949ab' },
  { ch: 3, name: '내 API 만들기', color: '#d81b60' },
  { ch: 4, name: 'SDK 만들기', color: '#f57c00' },
];
const API_DATE = '<p class="muted small">이 쪽의 응답 모양은 2026년 11월 기준이에요. 공개 API 는 바뀔 수 있고, Host · Date · origin 같은 줄은 사람마다 달라요.</p>';
const LESSONS = [
// ================= 챕터 1 HTTP 들여다보기 =================
{ id: 'H0', ch: 1, n: 0, title: 'API 가 뭔가: 프로그램끼리의 약속', mode: 'text', tutorSummary: '같은 서버가 사람에겐 화면(HTML), 프로그램에겐 데이터(JSON)를 줌. API = 「이 주소로 이렇게 물으면 이런 모양으로 답할게」 라는 약속. HTTP(말하는 방법) → API(약속) → SDK(약속을 감싼 라이브러리) 세 겹. 준비: curl --version, python -m pip install requests, PowerShell 에서는 curl.exe.',
  pages: [
    { title: '화면은 사람에게, API 는 프로그램에게', html: `<p>날씨 앱을 열면 지금 기온이 보여요. 그 앱은 기온을 스스로 재지 않아요 — 날씨 회사의 <b>서버에 물어서</b> 받아 와요. 이때 서버가 돌려주는 건 예쁜 화면이 아니라 이런 <b>데이터</b>예요.</p>
<pre class="code">{"temperature_2m": 12.3, "precipitation_probability": 20}</pre>
<p>같은 회사가 사람에게는 <b>웹 페이지(HTML)</b>를, 프로그램에게는 <b>데이터(JSON)</b>를 내놓아요. 프로그램이 서버에 묻는 정해진 방법을 <b>API</b>(Application Programming Interface — 프로그램이 쓰는 창구)라고 해요.</p>
<table class="kb"><tbody><tr><td>지도 앱의 길찾기</td><td>지도 회사 API 에 출발 · 도착을 보내고 경로를 받음</td></tr><tr><td>쇼핑몰의 결제</td><td>결제 회사 API 에 금액 · 카드 정보를 보내고 「승인」 을 받음</td></tr><tr><td>「구글로 로그인」</td><td>구글 API 가 「이 사람이 맞아요」 를 알려 줌</td></tr><tr><td>GitHub Actions · 앱</td><td>GitHub API 로 저장소 · 이슈 · PR 을 읽고 만듦</td></tr></tbody></table>
<p>API 는 결국 <b>약속</b>이에요: 「이 주소로 · 이 방법으로 · 이런 모양으로 물으면 · 이런 모양으로 답해 줄게」.</p>` },
    { title: 'HTTP · API · SDK 세 겹', html: `<pre class="code">SDK   client.todos.create("장보기")             ← 내가 쓰는 쪽은 이것만
API   POST /todos  {"text": "장보기"}  → 201     ← 정해 둔 약속(주소 · 메서드 · 모양)
HTTP  요청 줄 · 헤더 · 본문 / 상태 코드 · 헤더 · 본문  ← 실제로 오가는 글자</pre>
<table class="kb"><tbody><tr><td><b>HTTP</b></td><td>말하는 방법 — 우편으로 치면 「봉투에 주소 · 보내는 사람을 쓰는 규칙」. 웹 · 앱 · API 가 다 이걸로 말해요</td></tr><tr><td><b>API</b></td><td>그 회사가 정한 <b>주문서 양식</b> — 어느 주소에 무엇을 보내면 무엇을 주는지</td></tr><tr><td><b>SDK</b></td><td>주문서를 <b>대신 써 주는 비서</b>(라이브러리) — 주소 · 헤더 · 에러 처리를 숨기고 함수 하나로</td></tr></tbody></table>
<p>이 교과서의 순서도 이 세 겹을 따라가요.</p>
<ol><li><b>챕터 1</b> — HTTP 를 날것으로 보기(<code>curl -v</code> · 상태 코드 · 헤더 · JSON · 브라우저 Network)</li><li><b>챕터 2</b> — 남의 API 를 파이썬 <code>requests</code> 로 제대로 쓰기(REST · 인증 · 페이지 · 재시도 · 문서)</li><li><b>챕터 3</b> — 내 API 서버를 만들기(FastAPI)</li><li><b>챕터 4</b> — 내 API 의 SDK 를 만들기 — 서버 · SDK · 프로그램이 다 내 것</li></ol>` },
    { title: '준비: curl 과 requests', html: `<p>두 가지 도구로 API 를 불러요. <b>curl</b> 은 터미널에서 HTTP 를 날것으로 보는 명령, <b>requests</b> 는 파이썬에서 API 를 부르는 라이브러리예요.</p>
<table class="kb"><tbody><tr><td><code>curl --version</code></td><td>Windows 10 · 11 에는 처음부터 있어요. 맨 앞에 <code>curl 8.x …</code> 가 나오면 준비 끝</td></tr><tr><td><code>python -m pip install requests</code></td><td>VS Code 터미널에서 한 번. <code>Successfully installed requests-…</code> 또는 <code>Requirement already satisfied</code>. 프로젝트마다 나눠 깔려면 <a href="../python/#lesson/L16D" target="_blank" rel="noopener">파이썬 교과서 「pip 와 가상 환경」 ↗</a></td></tr></tbody></table>
<div class="bk-warn"><b>VS Code 의 기본 터미널(PowerShell)에서는 <code>curl.exe</code> 로 쳐요.</b> PowerShell 의 <code>curl</code> 은 다른 명령(<code>Invoke-WebRequest</code>)의 별명이라 <code>-v</code> · <code>-i</code> 가 안 돼요. 이 교과서의 명령은 Git Bash 기준이고, PowerShell 이면 <code>curl</code> 자리에 <code>curl.exe</code>.</div>
<p>첫 요청 — <b>httpbin.org</b> 는 받은 요청을 그대로 되돌려 주는 연습용 서버예요(가입 없음).</p>`,
      example: { label: '예제 명령 — Git Bash(PowerShell 은 curl.exe)', shell: 'curl https://httpbin.org/get\n\n# 파이썬으로 같은 일 — VS Code 의 hello_api.py 로 저장해 실행\n# import requests\n# res = requests.get("https://httpbin.org/get", timeout=10)\n# print(res.status_code)\n# print(res.json()["url"])' } },
  ],
  summary: ['API = 프로그램끼리의 약속(주소 · 방법 · 모양)', 'HTTP(말) → API(약속) → SDK(감싼 라이브러리)', 'curl --version · pip install requests · PowerShell 은 curl.exe'] },
{ id: 'H1', ch: 1, n: 1, title: '요청 한 줄씩: 주소 · 메서드 · 헤더 · 본문', mode: 'text', tutorSummary: '주소 = 규칙(https) + 호스트 + 경로 + 쿼리(?a=1&b=2), 한글은 %로 바뀜(urlencode). 주소 → 서버 찾기(DNS) → 연결(TCP·TLS) → HTTP 글자. curl -v 의 > 는 보낸 줄(요청 줄 GET /get HTTP/1.1, 헤더, 빈 줄, 본문), < 는 받은 줄. 메서드 GET 읽기 · POST 만들기 · PUT 통째로 바꾸기 · PATCH 일부 바꾸기 · DELETE 지우기.',
  pages: [
    { title: '주소 해부', html: `<pre class="code">https://httpbin.org/get?city=seoul&amp;days=3
└┬──┘   └────┬────┘└┬─┘└───────┬───────┘
 규칙       호스트     경로         쿼리</pre>
<table class="kb"><tbody><tr><td><b>규칙</b> <code>https</code></td><td>잠가서(암호화) 말하는 HTTP. 포트는 따로 안 쓰면 443(<code>http</code> 는 80)</td></tr><tr><td><b>호스트</b></td><td>어느 서버(컴퓨터)에게</td></tr><tr><td><b>경로</b></td><td>그 서버의 어느 창구에게</td></tr><tr><td><b>쿼리</b></td><td><code>?</code> 뒤에 <code>이름=값</code> 을 <code>&amp;</code> 로 이어 붙인 조건</td></tr></tbody></table>
<p>주소에는 한글 · 공백을 그대로 못 넣어서 <code>%EC%84%9C…</code> 처럼 바꿔 넣어요(<b>URL 인코딩</b>). 파이썬에서는 <code>requests</code> 가 <code>params=</code> 로 알아서 해 줘요.</p>
<p>주소를 치면 일어나는 일 한 줄: <b>호스트 이름으로 서버의 IP 를 찾고(DNS) → 그 서버에 연결하고(TCP · TLS) → HTTP 글자를 주고받아요.</b> 이 교과서는 마지막 「HTTP 글자」 를 봐요.</p>`,
      example: { code: 'from urllib.parse import urlparse, parse_qs, urlencode\n\nurl = "https://httpbin.org/get?city=seoul&days=3"\nu = urlparse(url)\nprint(u.scheme, u.netloc, u.path)\nprint(parse_qs(u.query))\nprint(urlencode({"q": "서울 날씨"}))', label: '예제 코드 — 인터넷 없이 돌아요' } },
    { title: 'curl -v 로 오가는 글자 보기', html: `<p><code>-v</code>(자세히)를 붙이면 curl 이 <b>보낸 글자</b>(<code>&gt;</code>)와 <b>받은 글자</b>(<code>&lt;</code>)를 보여 줘요. HTTP 는 정말로 이런 글자예요.</p>
<pre class="code">&gt; GET /get?city=seoul HTTP/1.1
&gt; Host: httpbin.org
&gt; User-Agent: curl/8.11.1
&gt; Accept: */*
&gt;
&lt; HTTP/1.1 200 OK
&lt; Content-Type: application/json
&lt; Content-Length: 216
&lt; Access-Control-Allow-Origin: *
&lt;
{ "args": { "city": "seoul" }, … }</pre>
<table class="kb"><tbody><tr><td><code>&gt; GET /get?city=seoul HTTP/1.1</code></td><td><b>요청 줄</b> — 메서드 · 경로(+쿼리) · 버전</td></tr><tr><td><code>&gt; Host: …</code> 여러 줄</td><td><b>헤더</b>(이름: 값)</td></tr><tr><td><code>&gt;</code> 만 있는 줄</td><td><b>빈 줄</b> = 헤더 끝. 그 뒤가 본문(GET 은 본문 없음)</td></tr><tr><td><code>&lt; HTTP/1.1 200 OK</code></td><td><b>상태 줄</b> — 버전 · 상태 코드 · 설명</td></tr><tr><td>맨 아래 <code>{ … }</code></td><td>응답 <b>본문</b></td></tr></tbody></table>
<p>요청 = <b>요청 줄 + 헤더 + 빈 줄 + 본문</b>, 응답 = <b>상태 줄 + 헤더 + 빈 줄 + 본문</b>. 이 모양 하나만 알면 어떤 API 도 읽혀요.</p>
<p class="muted small">요즘 서버는 <code>HTTP/2</code> 로 말하기도 해요 — 그땐 헤더 이름이 소문자(<code>content-type</code>)로 보이지만 뜻은 같아요. <code>*</code> 로 시작하는 줄(연결 · 인증서)은 curl 이 하는 혼잣말이에요.</p>${API_DATE}`,
      example: { label: '예제 명령 — Git Bash(PowerShell 은 curl.exe)', shell: 'curl -v "https://httpbin.org/get?city=seoul"' } },
    { title: '메서드: 무엇을 할지', html: `<table class="kb"><tbody><tr><td><code>GET</code></td><td>가져오기(읽기) — 본문 없음</td></tr><tr><td><code>POST</code></td><td>새로 만들기 · 보내기 — 본문에 데이터</td></tr><tr><td><code>PUT</code></td><td>통째로 바꾸기</td></tr><tr><td><code>PATCH</code></td><td>일부만 바꾸기</td></tr><tr><td><code>DELETE</code></td><td>지우기</td></tr></tbody></table>
<p>curl 은 <code>-X 메서드</code> 로 고르고, <code>-H</code> 로 헤더를, <code>-d</code> 로 본문을 붙여요. 본문이 JSON 이면 <code>Content-Type: application/json</code> 헤더로 「이건 JSON 이에요」 라고 알려 줘요.</p>
<p>httpbin 의 <code>/post</code> 는 받은 본문을 되돌려 줘요. 응답의 <code>json</code> 칸에 내가 보낸 것이 들어 있으면 서버가 JSON 으로 잘 읽은 거예요.</p>
<pre class="code">{
  "data": "{\\"name\\": \\"\\uc9c0\\ud6c8\\", \\"cups\\": 2}",
  "headers": { "Content-Type": "application/json", … },
  "json": { "cups": 2, "name": "\\uc9c0\\ud6c8" },
  …
}</pre>
<p><code>\\uc9c0\\ud6c8</code> 은 「지훈」 이에요 — JSON 은 한글을 이렇게 숫자 코드로 쓰기도 해요(레슨 3 에서 다시).</p>${API_DATE}`,
      example: { label: '예제 명령 — Git Bash(작은따옴표 안이 본문)', shell: 'curl -X POST https://httpbin.org/post -H "Content-Type: application/json" -d \'{"name": "지훈", "cups": 2}\'' } },
  ],
  summary: ['주소 = 규칙 + 호스트 + 경로 + 쿼리', '요청 = 요청 줄 + 헤더 + 빈 줄 + 본문', 'GET 읽기 · POST 만들기 · PUT/PATCH 바꾸기 · DELETE 지우기'] },
{ id: 'H2', ch: 1, n: 2, title: '상태 코드: 서버의 대답 첫마디', mode: 'text', tutorSummary: '1xx 정보 · 2xx 성공(200 · 201 · 204) · 3xx 다른 곳으로(301 · 302 · 304) · 4xx 요청한 쪽 잘못(400 · 401 · 403 · 404 · 409 · 422 · 429) · 5xx 서버 잘못(500 · 502 · 503). curl -i 로 상태 줄과 헤더, -L 로 리다이렉트 따라가기. 4xx 는 내 요청을 고치고, 5xx · 429 는 잠시 뒤 다시.',
  pages: [
    { title: '첫 숫자로 읽기', html: `<table class="kb"><tbody><tr><td><b>2xx 성공</b></td><td><code>200 OK</code> · <code>201 Created</code>(만들어짐) · <code>204 No Content</code>(성공, 본문 없음 — 지웠을 때)</td></tr><tr><td><b>3xx 다른 곳으로</b></td><td><code>301</code> 영영 이사 · <code>302</code> 잠깐 저기로(<code>Location</code> 헤더에 새 주소) · <code>304 Not Modified</code>(전에 받은 것 그대로)</td></tr><tr><td><b>4xx 요청한 쪽 잘못</b></td><td><code>400</code> 모양이 틀림 · <code>401</code> 누구세요(로그인 · 토큰 없음) · <code>403</code> 알지만 안 돼요(권한) · <code>404</code> 그런 거 없음 · <code>409</code> 이미 있음(부딪힘) · <code>422</code> 값이 규칙에 안 맞음 · <code>429</code> 너무 자주</td></tr><tr><td><b>5xx 서버 잘못</b></td><td><code>500</code> 서버 안에서 에러 · <code>502</code> 뒤의 서버가 이상 · <code>503</code> 잠시 못 받음(점검 · 과부하)</td></tr></tbody></table>
<p>첫 숫자만 봐도 「누구 탓인지」 알아요. 뒤의 설명 글(<code>OK</code> · <code>NOT FOUND</code>)은 서버마다 조금씩 달라서, 프로그램은 <b>숫자</b>만 봐요.</p>` },
    { title: 'curl -i 와 리다이렉트', html: `<p><code>-i</code> 는 본문 앞에 <b>상태 줄과 헤더</b>를 같이 보여 줘요(<code>-v</code> 보다 조용함). httpbin 의 <code>/status/숫자</code> 는 그 상태 코드를 그대로 돌려줘요.</p>
<pre class="code">HTTP/1.1 404 NOT FOUND
Content-Type: text/html; charset=utf-8
Content-Length: 0
…</pre>
<p><code>/redirect-to?url=/get</code> 은 <b>302</b> 와 함께 <code>Location: /get</code> 헤더를 줘요 — 「저기로 가 보세요」. curl 은 기본으로 안 따라가고, <code>-L</code> 을 붙이면 따라가서 <code>/get</code> 의 응답까지 받아 와요. 브라우저와 <code>requests</code> 는 저절로 따라가요(<code>res.history</code> 에 거쳐 온 302 가 남아요).</p>
<pre class="code">HTTP/1.1 302 FOUND
Location: /get
…</pre>${API_DATE}`,
      example: { label: '예제 명령 — Git Bash', shell: 'curl -i https://httpbin.org/status/404\ncurl -i "https://httpbin.org/redirect-to?url=/get"\ncurl -iL "https://httpbin.org/redirect-to?url=/get"' } },
    { title: '누구 탓인가 — 고칠 곳 고르기', html: `<table class="kb"><tbody><tr><td><code>400</code> · <code>422</code></td><td>보낸 <b>본문 · 값</b>을 문서와 비교(빠진 칸 · 틀린 타입). 응답 본문에 이유가 적혀 있는 경우가 많아요</td></tr><tr><td><code>401</code></td><td>토큰을 안 보냈거나 틀림 · 만료(레슨 7)</td></tr><tr><td><code>403</code></td><td>토큰은 맞는데 <b>권한</b>이 없음 · 한도 초과를 403 으로 알리는 서버도 있음</td></tr><tr><td><code>404</code></td><td>주소 · id 오타. 비공개 저장소는 권한이 없으면 403 대신 404 로 숨기기도 해요</td></tr><tr><td><code>429</code> · <code>503</code></td><td><b>기다렸다가</b> 다시(<code>Retry-After</code> 헤더가 몇 초인지 알려 줌, 레슨 8)</td></tr><tr><td><code>500</code> · <code>502</code></td><td>내 잘못이 아님 — 잠시 뒤 다시 · 계속이면 서버 쪽에 알리기</td></tr></tbody></table>
<p>프로그램도 이 표처럼 <b>상태 코드로 갈래</b>를 나눠요. 아래 예제가 그 첫걸음이에요.</p>`,
      example: { code: 'def kind(status):\n    if 200 <= status < 300:\n        return "성공"\n    if 300 <= status < 400:\n        return "다른 곳으로"\n    if 400 <= status < 500:\n        return "내 요청을 고치기"\n    if 500 <= status < 600:\n        return "잠시 뒤 다시"\n    return "모르는 코드"\n\nfor s in [200, 201, 302, 404, 429, 503]:\n    print(s, kind(s))', label: '예제 코드 — 인터넷 없이 돌아요' } },
  ],
  summary: ['2xx 성공 · 3xx 다른 곳 · 4xx 내 요청 · 5xx 서버', 'curl -i 는 상태 줄과 헤더, -L 은 리다이렉트 따라가기', '429 · 503 은 기다렸다가 다시'] },
{ id: 'H3', ch: 1, n: 3, title: '헤더와 JSON', mode: 'text', tutorSummary: '헤더 = 봉투에 적은 정보: 요청 Accept · Content-Type · User-Agent · Authorization, 응답 Content-Type · Content-Length · Location · Retry-After. 이름은 대소문자 무시. JSON ↔ 파이썬: 객체=dict, 배열=list, true/false/null=True/False/None, json.loads · json.dumps(ensure_ascii=False, indent=2). json.JSONDecodeError, JSON 인 줄 알았는데 HTML 에러 페이지 — Content-Type 먼저 보기.',
  pages: [
    { title: '헤더 = 봉투에 적은 정보', html: `<table class="kb"><tbody><tr><th>보낼 때(요청)</th><th></th></tr><tr><td><code>Accept: application/json</code></td><td>「JSON 으로 주세요」</td></tr><tr><td><code>Content-Type: application/json</code></td><td>「제가 보내는 본문은 JSON 이에요」</td></tr><tr><td><code>User-Agent: my-app/1.0</code></td><td>나는 어떤 프로그램인지 — GitHub API 는 이게 없으면 거절해요</td></tr><tr><td><code>Authorization: Bearer 토큰</code></td><td>나는 누구인지(레슨 7)</td></tr><tr><th>받을 때(응답)</th><th></th></tr><tr><td><code>Content-Type</code></td><td>본문이 무엇인지 — <code>application/json</code> · <code>text/html</code></td></tr><tr><td><code>Content-Length</code></td><td>본문 크기(바이트)</td></tr><tr><td><code>Location</code></td><td>3xx · 201 에서 새 주소</td></tr><tr><td><code>Retry-After</code></td><td>몇 초 뒤에 다시 오라는지(429 · 503)</td></tr></tbody></table>
<p>헤더 이름은 <b>대소문자를 가리지 않아요</b>(<code>content-type</code> = <code>Content-Type</code>). 파이썬 <code>res.headers["content-type"]</code> 도 그래서 돼요. httpbin 의 <code>/headers</code> 는 내가 보낸 헤더를 되돌려 줘요.</p>${API_DATE}`,
      example: { label: '예제 명령 — Git Bash', shell: 'curl https://httpbin.org/headers -H "Accept: application/json" -H "User-Agent: my-first-api/0.1"' } },
    { title: 'JSON ↔ 파이썬', html: `<table class="kb"><tbody><tr><th>JSON</th><th>파이썬</th></tr><tr><td>객체 <code>{"name": "지훈"}</code></td><td><code>dict</code></td></tr><tr><td>배열 <code>[1, 2]</code></td><td><code>list</code></td></tr><tr><td>글자 · 숫자</td><td><code>str</code> · <code>int</code>/<code>float</code></td></tr><tr><td><code>true</code> · <code>false</code> · <code>null</code></td><td><code>True</code> · <code>False</code> · <code>None</code></td></tr></tbody></table>
<p>JSON 은 <b>글자</b>예요. <code>json.loads(글자)</code> 로 파이썬 값이 되고, <code>json.dumps(값)</code> 으로 다시 글자가 돼요(파이썬 교과서 X3 과 같아요). 키는 꼭 큰따옴표 · 마지막 쉼표 금지 · 주석 없음.</p>
<p>레슨 1 의 <code>\\uc9c0\\ud6c8</code> 처럼, <code>json.dumps</code> 는 기본으로 한글을 숫자 코드로 바꿔요. 사람이 읽을 파일로 저장할 땐 <code>ensure_ascii=False</code>, 줄 맞춤은 <code>indent=2</code>.</p>`,
      example: { code: 'import json\n\ntext = \'{"name": "\\\\uc9c0\\\\ud6c8", "cups": 2, "hot": true, "memo": null}\'\ndata = json.loads(text)\nprint(data)\nprint(data["name"], type(data["cups"]).__name__)\nprint(json.dumps({"name": "지훈"}))\nprint(json.dumps({"name": "지훈"}, ensure_ascii=False))', label: '예제 코드 — 인터넷 없이 돌아요' } },
    { title: '깨진 JSON 과 「알고 보니 HTML」', html: `<p>API 가 늘 JSON 을 주는 건 아니에요. 서버가 고장 나면 <b>HTML 에러 페이지</b>(<code>&lt;html&gt;…502 Bad Gateway…</code>)를 주기도 하고, 응답이 중간에 잘리기도 해요. 그때 <code>json.loads</code> 는 <code>json.JSONDecodeError</code> 를 내요.</p>
<table class="kb"><tbody><tr><td>먼저 <code>Content-Type</code> 보기</td><td><code>application/json</code> 이 아니면 JSON 으로 읽지 않기</td></tr><tr><td><code>try</code> / <code>except json.JSONDecodeError</code></td><td>읽다가 실패하면 「응답 모양이 이상해요」 + 앞부분 몇 글자를 보여 주기 — 원인 찾기가 쉬워요. 함수라면 <code>raise ValueError("깨진 JSON: …")</code> 로 부른 쪽에 알려요</td></tr><tr><td>필요한 키가 없을 때</td><td><code>data.get("key")</code> 는 없으면 <code>None</code>, <code>data["key"]</code> 는 <code>KeyError</code></td></tr></tbody></table>`,
      example: { code: 'import json\n\nfor text in [\'{"ok": true}\', "<html><h1>502 Bad Gateway</h1></html>", \'{"ok": tr\']:\n    try:\n        print("읽음:", json.loads(text))\n    except json.JSONDecodeError as e:\n        print("JSON 이 아니에요:", text[:20], "|", e.msg)', label: '예제 코드 — 인터넷 없이 돌아요' } },
  ],
  summary: ['헤더 = 이름: 값 — Accept · Content-Type · User-Agent · Authorization', 'json.loads 로 dict/list, json.dumps(ensure_ascii=False) 로 글자', '받은 게 JSON 이 아닐 수 있다 — Content-Type 과 JSONDecodeError'] },
{ id: 'H4', ch: 1, n: 4, title: '브라우저에서 본 HTTP · CORS', mode: 'text', tutorSummary: 'F12 → Network: 한 줄 = 요청 하나, Status · Type · Size · Time, Headers · Payload · Preview · Response · Timing, Fetch/XHR 필터, Preserve log. 브라우저 fetch 로 jsonplaceholder 부르기 — res.ok · res.status · await res.json(). CORS: 다른 주소의 API 응답을 브라우저가 페이지에게 넘겨줄지 서버의 Access-Control-Allow-Origin 헤더로 정함 — curl · 파이썬은 안 막힘, 고치는 건 서버 쪽.',
  pages: [
    { title: 'F12 → Network', html: `<p>브라우저도 HTTP 로 말해요. 페이지 하나를 열 때 HTML · CSS · JS · 그림 · API 요청이 수십 개 오가요. <b>F12 → Network</b> 탭을 연 채로 새로고침하면 전부 보여요.</p>
<table class="kb"><tbody><tr><td><b>한 줄 = 요청 하나</b></td><td>Name(주소 끝) · Status(상태 코드) · Type(document · script · fetch …) · Size · Time</td></tr><tr><td>줄을 누르면</td><td><b>Headers</b>(요청 · 응답 헤더) · <b>Payload</b>(보낸 쿼리 · 본문) · <b>Preview</b>(JSON 을 펼쳐 보기) · <b>Response</b>(날것) · <b>Timing</b>(어디서 오래 걸렸나)</td></tr><tr><td>위쪽 필터 <b>Fetch/XHR</b></td><td>API 요청만 보기</td></tr><tr><td><b>Preserve log</b></td><td>페이지가 바뀌어도 목록을 지우지 않기</td></tr><tr><td><b>Disable cache</b></td><td>304 대신 매번 새로 받기</td></tr></tbody></table>
<p>curl 의 <code>&gt;</code> · <code>&lt;</code> 와 같은 것을 표로 보여 주는 거예요. 앱이 이상할 때 「요청이 가긴 했나? 상태 코드는? 응답에 뭐가 왔나?」 를 여기서 먼저 봐요.</p>` },
    { title: 'fetch 로 진짜 API 부르기', html: `<p>웹 교과서 레슨 25 의 <code>fetch</code> 는 같은 폴더의 <code>menu.json</code> 을 불렀어요. 주소만 바꾸면 <b>인터넷의 API</b> 도 똑같이 불러요. <b>jsonplaceholder</b> 는 연습용 가짜 REST API 예요(가입 없음).</p>
<table class="kb"><tbody><tr><td><code>res.ok</code></td><td>상태 코드가 200~299 인지 — <code>fetch</code> 는 404 · 500 이어도 에러를 안 내서 꼭 봐요</td></tr><tr><td><code>res.status</code></td><td>상태 코드 숫자</td></tr><tr><td><code>await res.json()</code></td><td>본문 JSON 을 객체로</td></tr></tbody></table>
<p>아래 코드를 웹 교과서처럼 html 파일의 <code>&lt;script&gt;</code> 에 넣고 Go Live 로 열어, F12 Network 에서 <code>todos?_limit=5</code> 요청을 눌러 봐요. 응답은 이런 모양이에요.</p>
<pre class="code">[
  { "userId": 1, "id": 1, "title": "delectus aut autem", "completed": false },
  { "userId": 1, "id": 2, "title": "quis ut nam facilis et officia qui", "completed": false },
  …
]</pre>${API_DATE}`,
      example: { label: '예제 — html 파일의 body 맨 아래 &lt;script&gt; 안에(브라우저 JavaScript)', shell: '<ul id="list"></ul>\n<script>\n  async function load() {\n    const res = await fetch("https://jsonplaceholder.typicode.com/todos?_limit=5");\n    if (!res.ok) throw new Error("HTTP " + res.status);\n    const todos = await res.json();\n    document.querySelector("#list").innerHTML = todos.map(t => `<li>${t.completed ? "✓ " : ""}${t.title}</li>`).join("");\n  }\n  load().catch(err => console.error(err));\n</script>' } },
    { title: 'CORS: 브라우저만 막는 이유', html: `<p>브라우저에는 「이 페이지의 JS 는 <b>자기 주소(출처)의 서버</b>와만 자유롭게 대화한다」 는 규칙이 있어요. 다른 주소의 API 를 부르면, 브라우저는 요청을 보내긴 하지만 응답을 페이지에 넘겨줄지 <b>그 서버에게 물어요</b>. 서버가 응답 헤더로 허락해야 넘겨줘요 — 이걸 <b>CORS</b>(출처가 다른 요청 허락)라고 해요.</p>
<pre class="code">요청  Origin: http://127.0.0.1:5500                 ← 브라우저가 붙임(어느 페이지에서 왔나)
응답  Access-Control-Allow-Origin: *                  ← 「아무 페이지나 괜찮아요」 (httpbin · jsonplaceholder)
      Access-Control-Allow-Origin: https://my.site    ← 「이 출처만」</pre>
<p>허락이 없으면 Console 창에 이런 빨간 줄이 떠요.</p>
<pre class="code">Access to fetch at '…' from origin 'http://127.0.0.1:5500' has been blocked by CORS policy:
No 'Access-Control-Allow-Origin' header is present on the requested resource.</pre>
<table class="kb"><tbody><tr><td><b>curl · 파이썬은 안 막혀요</b></td><td>CORS 는 「남의 사이트 JS 가 내 로그인으로 몰래 부르는 것」 을 막으려는 <b>브라우저</b>의 규칙이라서</td></tr><tr><td>고치는 곳은 <b>서버</b></td><td>페이지 쪽 JS 로는 못 고쳐요. 내 서버라면 허락 헤더를 켜고(챕터 3 에서 직접), 남의 서버라면 내 서버를 거쳐서 불러요</td></tr></tbody></table>` },
  ],
  summary: ['F12 Network 의 한 줄 = 요청 하나(Headers · Response · Timing)', 'fetch 는 404 여도 에러가 아니라 res.ok 를 본다', 'CORS 는 브라우저의 규칙 — 허락은 서버의 Access-Control-Allow-Origin'] },
{ id: 'HB1', ch: 1, boss: true, title: '보스: 날씨 알리미', mode: 'text', pages: [], summary: [], tutorSummary: '챕터 1 종합. Open-Meteo(키 없음)에 위도·경도와 current · daily 파라미터로 GET, 상태 코드 확인, requests.exceptions(연결 · 시간 초과) 처리, 응답 JSON 에서 지금 기온 · 오늘 최고/최저 · 비 올 확률을 꺼내 한 줄로. 응답 모양이 이상하면 알려 주기.' },
// ================= 챕터 2 API 를 제대로 쓰기 =================
{ id: 'H5', ch: 2, n: 5, title: 'requests 기본기', mode: 'text', tutorSummary: 'requests.get(url, params={...}, timeout=10) — timeout 은 늘(없으면 영원히 기다릴 수 있음). res.status_code · res.ok · res.headers(대소문자 무시) · res.text · res.json() · res.url. raise_for_status() 로 4xx·5xx 를 HTTPError 로, requests.exceptions(ConnectionError · Timeout · 전부 RequestException). post(json=) 는 JSON 본문 + Content-Type, data= 는 폼. Session 으로 헤더를 한 번에 · 연결 재사용.',
  pages: [
    { title: 'get · params · timeout', html: `<pre class="code">import requests

res = requests.get("https://httpbin.org/get", params={"city": "서울", "days": 3}, timeout=10)</pre>
<table class="kb"><tbody><tr><td><code>params={…}</code></td><td>쿼리를 딕셔너리로 — 한글 · 공백은 알아서 % 로 바꿔 붙여요. 실제로 간 주소는 <code>res.url</code></td></tr><tr><td><code>timeout=10</code></td><td><b>늘 붙여요.</b> 없으면 서버가 대답을 안 할 때 프로그램이 영원히 기다릴 수 있어요(10초 넘으면 <code>Timeout</code> 예외)</td></tr><tr><td><code>res.status_code</code> · <code>res.ok</code></td><td>상태 코드 · 200~399 인지</td></tr><tr><td><code>res.headers["content-type"]</code></td><td>응답 헤더(이름의 대소문자 무시)</td></tr><tr><td><code>res.text</code> · <code>res.json()</code></td><td>본문 글자 · 본문을 JSON 으로 읽은 dict/list(JSON 이 아니면 에러)</td></tr><tr><td><code>res.elapsed</code></td><td>걸린 시간</td></tr></tbody></table>
<p>httpbin 의 <code>/get</code> 이 되돌려 준 <code>res.json()["args"]</code> 는 <code>{'city': '서울', 'days': '3'}</code> 이에요 — 쿼리는 늘 <b>글자</b>로 가요(3 도 <code>'3'</code>).</p>${API_DATE}`,
      example: { label: '예제 코드 — 인터넷이 필요해요(VS Code 의 .py 로)', shell: 'import requests\n\nres = requests.get("https://httpbin.org/get", params={"city": "서울", "days": 3}, timeout=10)\nprint(res.status_code, res.ok)\nprint(res.url)\nprint(res.headers["content-type"])\nprint(res.json()["args"])' } },
    { title: 'raise_for_status 와 예외 잡기', html: `<p><code>requests</code> 는 404 · 500 을 받아도 <b>에러를 내지 않아요</b> — 응답을 받는 데는 성공했으니까요. 「4xx · 5xx 면 멈춰」 를 원하면 <code>res.raise_for_status()</code> 를 불러요.</p>
<table class="kb"><tbody><tr><td><code>requests.exceptions.HTTPError</code></td><td><code>raise_for_status()</code> 가 4xx · 5xx 에서 냄 — <code>e.response.status_code</code> 로 코드</td></tr><tr><td><code>ConnectionError</code></td><td>서버를 못 찾음 · 연결 안 됨(인터넷 끊김 · 주소 오타)</td></tr><tr><td><code>Timeout</code></td><td><code>timeout=</code> 시간을 넘김</td></tr><tr><td><code>RequestException</code></td><td>위 전부의 부모 — 한 번에 잡을 때</td></tr></tbody></table>
<pre class="code">try:
    res = requests.get(url, timeout=10)
    res.raise_for_status()
    data = res.json()
except requests.exceptions.HTTPError as e:
    print("서버가 거절:", e.response.status_code)
except requests.exceptions.RequestException as e:
    print("연결 문제:", type(e).__name__)</pre>
<p><code>except</code> 는 <b>좁은 것부터</b> 써요(HTTPError 도 RequestException 의 자식이라, 넓은 것을 먼저 쓰면 좁은 것이 안 잡혀요).</p>` },
    { title: 'post(json=) · data= · Session', html: `<table class="kb"><tbody><tr><td><code>requests.post(url, json={"name": "지훈"})</code></td><td>딕셔너리를 JSON 글자로 바꿔 본문에 + <code>Content-Type: application/json</code> 헤더까지 — API 는 대부분 이것</td></tr><tr><td><code>requests.post(url, data={"name": "지훈"})</code></td><td>HTML 폼 모양(<code>name=%EC%A7%80…</code>) — httpbin 은 <code>json</code> 칸이 아니라 <code>form</code> 칸에 보여 줘요</td></tr><tr><td><code>headers={"User-Agent": "my-app/0.1"}</code></td><td>헤더 붙이기(모든 메서드)</td></tr></tbody></table>
<p>같은 서버에 여러 번 보낼 땐 <b>Session</b> 을 써요. 헤더를 한 번만 정하면 되고, 연결을 다시 써서 빨라요.</p>
<pre class="code">with requests.Session() as s:
    s.headers.update({"User-Agent": "my-app/0.1", "Accept": "application/json"})
    a = s.get("https://httpbin.org/get", timeout=10)
    b = s.post("https://httpbin.org/post", json={"cups": 2}, timeout=10)</pre>
<p><code>timeout</code> 은 Session 에 한 번에 못 정해서 요청마다 붙여요(챕터 4 의 내 SDK 에서는 이걸 감춰 줘요).</p>`,
      example: { label: '예제 코드 — 인터넷이 필요해요', shell: 'import requests\n\nwith requests.Session() as s:\n    s.headers.update({"User-Agent": "my-app/0.1"})\n    r1 = s.post("https://httpbin.org/post", json={"name": "지훈"}, timeout=10)\n    r2 = s.post("https://httpbin.org/post", data={"name": "지훈"}, timeout=10)\n    print(r1.json()["json"], r1.json()["headers"]["Content-Type"])\n    print(r2.json()["form"], r2.json()["headers"]["Content-Type"])' } },
  ],
  summary: ['requests.get(url, params=…, timeout=10) — timeout 은 늘', 'raise_for_status() 로 4xx·5xx 를 예외로', 'post(json=) 은 JSON 본문 · Session 은 헤더 한 번에'] },
{ id: 'H6', ch: 2, n: 6, title: 'REST: 주소와 메서드의 약속', mode: 'text', tutorSummary: 'REST = 자원(명사 · 복수) 주소 + 메서드(동사). GET /todos 목록 · GET /todos/1 하나 · POST /todos 만들기(201) · PUT 통째 · PATCH 일부 · DELETE 지우기. 없으면 404. jsonplaceholder 는 가짜라 진짜로 바뀌진 않음. 나쁜 주소 /getTodo?id=1. 멱등: GET · PUT · DELETE 는 두 번 해도 같음, POST 는 두 번이면 두 개 — 재시도에 중요.',
  pages: [
    { title: '자원과 메서드: CRUD 표', html: `<p><b>REST</b> 는 API 주소를 짓는 흔한 규칙이에요. <b>주소는 무엇(명사 · 복수)</b>, <b>메서드는 무엇을 할지(동사)</b>. 만들기 · 읽기 · 바꾸기 · 지우기(CRUD)가 모두 이 표 안에 들어가요.</p>
<table class="kb"><tbody><tr><th>하고 싶은 일</th><th>메서드 · 주소</th><th>성공하면</th></tr><tr><td>목록</td><td><code>GET /todos</code> (조건은 쿼리 <code>?userId=1</code>)</td><td>200 + 배열</td></tr><tr><td>하나</td><td><code>GET /todos/5</code></td><td>200 + 객체 · 없으면 404</td></tr><tr><td>만들기</td><td><code>POST /todos</code> + 본문</td><td><b>201</b> + 만든 것(새 id)</td></tr><tr><td>통째로 바꾸기</td><td><code>PUT /todos/5</code> + 전체 본문</td><td>200</td></tr><tr><td>일부만 바꾸기</td><td><code>PATCH /todos/5</code> + 바꿀 칸만</td><td>200</td></tr><tr><td>지우기</td><td><code>DELETE /todos/5</code></td><td>200 또는 204</td></tr><tr><td>딸린 것</td><td><code>GET /users/1/todos</code></td><td>1번 사용자의 할 일</td></tr></tbody></table>
<p>이 규칙을 알면 처음 보는 API 문서도 「아, 목록은 GET 이겠구나」 하고 금방 읽혀요.</p>` },
    { title: 'jsonplaceholder 로 한 바퀴', html: `<p><b>jsonplaceholder</b> 는 연습용 가짜 REST API 예요. 만들고 · 바꾸고 · 지워도 <b>진짜로 저장되지는 않고</b> 그럴듯한 응답만 줘요 — 마음껏 연습해도 돼요.</p>
<table class="kb"><tbody><tr><td><code>GET /todos?userId=1</code></td><td>200 · 할 일 20개</td></tr><tr><td><code>GET /todos/1</code></td><td>200 · <code>{"userId": 1, "id": 1, "title": "delectus aut autem", "completed": false}</code></td></tr><tr><td><code>POST /todos</code> <code>{"title": "장보기", "completed": false, "userId": 1}</code></td><td><b>201</b> · 보낸 것 + <code>"id": 201</code></td></tr><tr><td><code>PATCH /todos/1</code> <code>{"completed": true}</code></td><td>200 · 1번이 바뀐 모양</td></tr><tr><td><code>DELETE /todos/1</code></td><td>200 · <code>{}</code></td></tr><tr><td><code>GET /todos/9999</code></td><td><b>404</b> · <code>{}</code></td></tr></tbody></table>
<p>만든 201번을 다시 <code>GET /todos/201</code> 하면 404 예요 — 가짜라서 저장이 안 됐으니까요. 진짜로 저장되는 API 는 챕터 3 에서 내가 만들어요.</p>${API_DATE}`,
      example: { label: '예제 코드 — 인터넷이 필요해요', shell: 'import requests\n\nBASE = "https://jsonplaceholder.typicode.com"\nr = requests.post(f"{BASE}/todos", json={"title": "장보기", "completed": False, "userId": 1}, timeout=10)\nprint(r.status_code, r.json())\nr = requests.patch(f"{BASE}/todos/1", json={"completed": True}, timeout=10)\nprint(r.status_code, r.json()["completed"])\nr = requests.delete(f"{BASE}/todos/1", timeout=10)\nprint(r.status_code, r.json())\nr = requests.get(f"{BASE}/todos/9999", timeout=10)\nprint(r.status_code)' } },
    { title: '나쁜 주소 · 멱등', html: `<table class="kb"><tbody><tr><th>❌ 주소에 동사</th><th>✅ REST</th></tr><tr><td><code>GET /getTodo?id=5</code></td><td><code>GET /todos/5</code></td></tr><tr><td><code>POST /createTodo</code></td><td><code>POST /todos</code></td></tr><tr><td><code>GET /deleteTodo/5</code></td><td><code>DELETE /todos/5</code> — GET 으로 지우면, 링크를 미리 읽는 프로그램이 지나가기만 해도 지워져요</td></tr></tbody></table>
<p><b>멱등</b>(같은 요청을 두 번 보내도 결과가 한 번 보낸 것과 같음)은 「다시 보내도 되나」 를 정해요.</p>
<table class="kb"><tbody><tr><td><code>GET</code> · <code>PUT</code> · <code>DELETE</code></td><td>멱등 — 두 번 해도 같은 상태(두 번째 DELETE 는 404 일 수 있지만 지워진 상태는 같음)</td></tr><tr><td><code>POST</code></td><td><b>멱등 아님</b> — 두 번 보내면 두 개 만들어져요(주문 두 번!)</td></tr><tr><td><code>PATCH</code></td><td>바꾸는 내용에 따라 — <code>{"completed": true}</code> 는 멱등, 「수량 +1」 은 아님</td></tr></tbody></table>
<p>그래서 응답이 끊겼을 때 <b>GET 은 마음 놓고 다시</b>, POST 는 조심해서(레슨 8 의 재시도 규칙).</p>` },
  ],
  summary: ['주소는 명사(복수), 메서드는 동사', 'POST 201 · GET 200 · 없으면 404', 'GET · PUT · DELETE 는 멱등, POST 는 아님'] },
{ id: 'H7', ch: 2, n: 7, title: '인증: API 키와 토큰', mode: 'text', tutorSummary: '인증 = 누가 · 얼마나 · 무엇을. 헤더 Authorization: Bearer 토큰(쿼리 ?api_key= 는 주소가 기록에 남아 위험). GitHub fine-grained token(만료일 · 필요한 권한만)으로 GET /user — 헤더 Accept: application/vnd.github+json · X-GitHub-Api-Version. 401 토큰이 없거나 틀림 · 403 권한 없음. 키는 코드 밖: 환경 변수(os.environ) · .env + python-dotenv + .gitignore. 올렸으면 바로 폐기하고 새로.',
  pages: [
    { title: '왜 신분증이 필요한가 · Bearer', html: `<p>공개 API 도 대부분 <b>누가 부르는지</b> 알고 싶어해요: 누구의 데이터를 보여 줄지, 얼마나 자주 불러도 되는지(한도), 무엇을 해도 되는지(권한). 그래서 요청마다 <b>신분증</b>을 붙여요.</p>
<pre class="code">Authorization: Bearer ghp_xxxxxxxxxxxxxxxxxxxx</pre>
<table class="kb"><tbody><tr><td><b>토큰</b> · <b>API 키</b></td><td>비밀번호 대신 쓰는 긴 글자. 사람 비밀번호와 달리 <b>권한 · 만료일</b>을 좁게 정할 수 있고 언제든 폐기</td></tr><tr><td><code>Authorization: Bearer 토큰</code></td><td>가장 흔한 모양(「이 토큰을 가진 사람이에요」)</td></tr><tr><td><code>?api_key=…</code> 쿼리</td><td>이렇게 받는 API 도 있지만, 주소는 서버 기록 · 브라우저 기록 · 화면 공유에 남아서 <b>더 위험</b>해요. 고를 수 있으면 헤더로</td></tr></tbody></table>
<p>httpbin 의 <code>/bearer</code> 는 Bearer 헤더가 없으면 <b>401</b>, 있으면 200 과 <code>{"authenticated": true, "token": "…"}</code> 을 줘요.</p>${API_DATE}`,
      example: { label: '예제 명령 — Git Bash', shell: 'curl -i https://httpbin.org/bearer\ncurl -i https://httpbin.org/bearer -H "Authorization: Bearer test123"' } },
    { title: 'GitHub 토큰으로 GET /user', html: `<p>진짜 서비스의 API 로 해 봐요. GitHub 교과서에서 만든 계정으로 <b>fine-grained 토큰</b>을 만들어요(화면 자세히는 GitHub 교과서).</p>
<div class="bk-step-box"><b>① 만들기</b><br>GitHub → 오른쪽 위 프로필 → <b>Settings</b> → 맨 아래 <b>Developer settings</b> → <b>Personal access tokens → Fine-grained tokens</b> → <b>Generate new token</b>.</div>
<div class="bk-step-box"><b>② 좁게</b><br>이름 <code>api-study</code> · <b>Expiration</b> 30일 · <b>Repository access</b> 는 <b>Public repositories</b>(읽기만). 이 교과서는 이것으로 충분해요 → Generate → 토큰을 <b>한 번만</b> 보여 주니 바로 복사해 다음 쪽처럼 저장.</div>
<table class="kb"><tbody><tr><td><code>GET https://api.github.com/user</code></td><td>토큰 주인의 정보(<code>login</code> · <code>public_repos</code> …)</td></tr><tr><td>헤더 <code>Accept: application/vnd.github+json</code> · <code>X-GitHub-Api-Version: 2022-11-28</code></td><td>GitHub 문서가 권하는 두 줄</td></tr><tr><td><b>401</b> <code>Bad credentials</code></td><td>토큰이 없거나 틀림 · 만료</td></tr><tr><td><b>403</b> <code>Resource not accessible by personal access token</code></td><td>토큰은 맞는데 그 일을 할 <b>권한</b>이 없음</td></tr></tbody></table>${API_DATE}`,
      example: { label: '예제 코드 — 인터넷 + 토큰이 필요해요(다음 쪽처럼 환경 변수에 넣은 뒤)', shell: 'import os\nimport requests\n\ntoken = os.environ["GITHUB_TOKEN"]\nheaders = {"Authorization": f"Bearer {token}", "Accept": "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28"}\nres = requests.get("https://api.github.com/user", headers=headers, timeout=10)\nprint(res.status_code)\nprint(res.json()["login"], res.json()["public_repos"])' } },
    { title: '키는 코드 밖으로: 환경 변수 · .env', html: `<div class="bk-warn"><b>토큰을 코드에 직접 쓰지 마세요.</b> 그 파일을 GitHub 에 올리는 순간 공개돼요(공개 저장소는 몇 분 안에 자동으로 긁어 가는 프로그램이 있어요). 한 번이라도 올렸으면 <b>지우는 걸로는 부족</b>해요(commit 기록에 남음) — 그 토큰을 바로 <b>폐기(Delete)하고 새로 만들어요</b>(GitHub 교과서 레슨 16).</div>
<table class="kb"><tbody><tr><td><b>환경 변수</b></td><td>그 터미널에서만 사는 이름표. PowerShell <code>$env:GITHUB_TOKEN="…"</code> · Git Bash <code>export GITHUB_TOKEN="…"</code> → 같은 터미널에서 <code>python app.py</code>. 파이썬은 <code>os.environ.get("GITHUB_TOKEN")</code></td></tr><tr><td><b><code>.env</code> 파일</b></td><td>프로젝트 폴더에 <code>GITHUB_TOKEN=…</code> 한 줄 → <code>python -m pip install python-dotenv</code> → 코드 맨 위 <code>from dotenv import load_dotenv; load_dotenv()</code></td></tr><tr><td><b><code>.gitignore</code></b></td><td><code>.env</code> 한 줄을 꼭 — Git 이 그 파일을 못 본 척해요. <code>git status</code> 에 <code>.env</code> 가 안 보이면 성공</td></tr></tbody></table>
<p>토큰이 없을 때 프로그램은 에러 화면 대신 <b>무엇을 해야 하는지</b> 알려 주고 멈춰요. 화면 · 기록에 찍을 땐 앞 몇 글자만(<code>ghp_…</code>).</p>`,
      example: { label: '예제 코드 — .env 를 쓰는 모양', shell: '# .env (같은 폴더, .gitignore 에 .env 를 꼭)\n# GITHUB_TOKEN=github_pat_xxxxxxxx\n\nimport os\nfrom dotenv import load_dotenv\n\nload_dotenv()\ntoken = os.environ.get("GITHUB_TOKEN")\nif not token:\n    raise SystemExit("GITHUB_TOKEN 이 없어요 — .env 에 넣었는지 확인하세요")\nprint("토큰:", token[:4] + "…")' } },
  ],
  summary: ['토큰은 Authorization: Bearer 헤더로', '401 누구세요 · 403 권한 없음', '키는 코드 밖(환경 변수 · .env + .gitignore)'] },
{ id: 'H8', ch: 2, n: 8, title: '페이지 · 한도 · 재시도', mode: 'text', tutorSummary: '목록은 나눠서: per_page · page, GitHub 은 Link 헤더(rel="next") — requests 는 res.links["next"]["url"], 없을 때까지 반복. 한도: x-ratelimit-limit · remaining · reset(초 단위 시각), 넘으면 403/429 + Retry-After. 재시도는 5xx · 429 · 끊김만, 1→2→4초 늘리며 몇 번까지, 4xx 는 다시 해도 같아서 안 함, POST 는 멱등이 아니라 조심.',
  pages: [
    { title: '한 번에 다 안 줘요: 페이지', html: `<p>저장소가 300개여도 API 는 한 번에 <b>30개씩</b>(GitHub 기본) 줘요. 다음 묶음은 <code>?page=2</code>. 한 번에 받을 개수는 <code>per_page</code>(GitHub 최대 100).</p>
<p>「다음 쪽이 있나」 는 응답 헤더 <b><code>Link</code></b> 가 알려 줘요.</p>
<pre class="code">Link: &lt;https://api.github.com/user/repos?per_page=100&amp;page=2&gt;; rel="next",
      &lt;https://api.github.com/user/repos?per_page=100&amp;page=3&gt;; rel="last"</pre>
<p><code>requests</code> 는 이걸 <code>res.links</code> 로 풀어 줘요: <code>res.links["next"]["url"]</code>. 마지막 쪽에는 <code>"next"</code> 가 없어요 — 그때까지 반복.</p>
<pre class="code">url = "https://api.github.com/user/repos?per_page=100"
repos = []
while url:
    res = s.get(url, timeout=10)
    res.raise_for_status()
    repos += res.json()
    url = res.links.get("next", {}).get("url")   # 없으면 None → 끝</pre>
<p>API 마다 방식이 달라요: <code>page</code> 번호 · <code>Link</code> 헤더 · 본문의 <code>next</code> 주소 · <code>cursor</code>. 문서(레슨 9)에서 확인해요.</p>` },
    { title: '한도: X-RateLimit · 429 · Retry-After', html: `<p>API 는 한 사람이 너무 자주 부르지 못하게 <b>한도</b>를 둬요. GitHub 는 토큰 없이 <b>시간당 60번</b>, 토큰이 있으면 <b>5000번</b>. 응답 헤더로 남은 횟수를 알려 줘요.</p>
<table class="kb"><tbody><tr><td><code>x-ratelimit-limit</code></td><td>한 시간에 몇 번까지</td></tr><tr><td><code>x-ratelimit-remaining</code></td><td>남은 횟수</td></tr><tr><td><code>x-ratelimit-reset</code></td><td>다시 채워지는 시각(1970년부터 센 <b>초</b> — <code>time.time()</code> 과 같은 단위)</td></tr><tr><td><b>403 · 429</b> + <code>Retry-After: 60</code></td><td>다 썼어요 — 몇 초 뒤에 오라는 뜻</td></tr></tbody></table>
<div class="bk-warn"><b>남의 서버를 두드리지 마세요.</b> 반복문으로 부를 땐 <code>remaining</code> 을 보고, 막혔으면 <b>기다려요</b>. 계속 두드리면 한동안 차단될 수 있어요. 연습할 땐 몇 번만, 사이에 <code>time.sleep(1)</code>.</div>
<p><code>GET https://api.github.com/rate_limit</code> 은 한도를 쓰지 않고 지금 남은 횟수를 보여 줘요.</p>${API_DATE}`,
      example: { label: '예제 명령 — Git Bash(토큰 없이)', shell: 'curl -s -i https://api.github.com/users/octocat | grep -i ratelimit\ncurl -s https://api.github.com/rate_limit' } },
    { title: '재시도: 언제 · 얼마나', html: `<table class="kb"><tbody><tr><td><b>다시 해 볼 만함</b></td><td>5xx(500 · 502 · 503 · 504) · 429 · 연결 끊김 · 시간 초과 — 잠깐 뒤엔 될 수 있음</td></tr><tr><td><b>다시 해도 소용없음</b></td><td>400 · 401 · 403(권한) · 404 · 422 — 내 요청을 고쳐야 해요</td></tr><tr><td><b>얼마나 기다리나</b></td><td><code>Retry-After</code> 가 있으면 그만큼, 없으면 <b>1 → 2 → 4초</b>처럼 두 배씩(서버가 숨 돌릴 틈)</td></tr><tr><td><b>몇 번까지</b></td><td>3~5번에서 포기하고 알리기 — 끝없이 하지 않아요</td></tr><tr><td><b>POST 는 조심</b></td><td>멱등이 아니라(레슨 6), 응답만 끊기고 서버는 만들었을 수 있어요 — 다시 보내면 두 개</td></tr></tbody></table>
<pre class="code">import time

for attempt in range(1, 5):
    try:
        res = requests.get(url, timeout=10)
    except requests.exceptions.RequestException:
        res = None
    if res is not None and res.status_code not in (429, 500, 502, 503, 504):
        break                               # 성공이거나, 다시 해도 소용없는 4xx
    time.sleep(2 ** (attempt - 1))          # 1, 2, 4, 8초</pre>
<p>이 규칙은 챕터 4 의 내 SDK 안에 넣어서, SDK 를 쓰는 사람은 신경 쓰지 않게 해요.</p>` },
  ],
  summary: ['res.links["next"] 가 없을 때까지 모은다', '한도는 x-ratelimit-remaining · 막히면 Retry-After 만큼 기다림', '5xx · 429 · 끊김만 1→2→4초로 다시, 4xx 는 안 함'] },
{ id: 'H9', ch: 2, n: 9, title: 'API 문서 읽는 법', mode: 'text', tutorSummary: '문서에서 찾을 여덟 칸: 기본 주소 · 인증 · 엔드포인트 · 파라미터(경로 · 쿼리 · 본문, 필수?) · 응답 예 · 에러 · 한도 · 버전. GitHub 「List repositories for a user」 = GET /users/{username}/repos, type · sort · direction · per_page(최대 100, 기본 30) · page. OpenAPI = 문서를 기계도 읽는 모양(paths · parameters · responses), Swagger UI 의 Try it out, FastAPI /docs.',
  pages: [
    { title: '문서에서 찾을 여덟 칸', html: `<table class="kb"><tbody><tr><td>① <b>기본 주소</b></td><td>모든 주소의 앞부분 — <code>https://api.github.com</code></td></tr><tr><td>② <b>인증</b></td><td>키가 필요한가 · 어디에(헤더 · 쿼리) · 어떤 권한</td></tr><tr><td>③ <b>엔드포인트</b></td><td>메서드 + 경로 — <code>GET /users/{username}/repos</code>(<code>{ }</code> 는 내가 채울 칸)</td></tr><tr><td>④ <b>파라미터</b></td><td>경로 · 쿼리 · 본문 — <b>필수(required)</b>인지 · 기본값 · 고를 수 있는 값</td></tr><tr><td>⑤ <b>응답 예</b></td><td>성공하면 어떤 모양이 오는지 — <b>여기부터 보면 빨라요</b></td></tr><tr><td>⑥ <b>에러</b></td><td>어떤 상태 코드가 왜 오는지</td></tr><tr><td>⑦ <b>한도</b></td><td>몇 번까지 · 페이지 크기</td></tr><tr><td>⑧ <b>버전</b></td><td><code>X-GitHub-Api-Version</code> · <code>/v1/</code> — 바뀌어도 내 코드가 안 깨지게</td></tr></tbody></table>
<p>문서를 처음부터 다 읽지 않아요. 하고 싶은 일의 <b>엔드포인트 하나</b>를 찾고, 그 쪽에서 ④ ⑤ ⑥ 만 읽고, curl 로 한 번 불러 봐요.</p>` },
    { title: 'GitHub 문서 한 쪽 같이 읽기', html: `<p>GitHub REST 문서(<code>docs.github.com/rest</code>)의 「Repositories → <b>List repositories for a user</b>」 쪽이에요.</p>
<table class="kb"><tbody><tr><td>엔드포인트</td><td><code>GET /users/{username}/repos</code> — 그 사람의 <b>공개</b> 저장소(토큰 없이도 돼요)</td></tr><tr><td>경로 파라미터</td><td><code>username</code> (required)</td></tr><tr><td>쿼리 파라미터</td><td><code>type</code> = all · owner · member(기본 owner) · <code>sort</code> = created · updated · pushed · full_name(기본 full_name) · <code>direction</code> = asc · desc · <code>per_page</code>(기본 30, 최대 100) · <code>page</code>(기본 1)</td></tr><tr><td>응답</td><td><code>200</code> + 저장소 객체의 <b>배열</b>(<code>full_name</code> · <code>stargazers_count</code> · <code>language</code> · <code>pushed_at</code> …)</td></tr><tr><td>내 저장소 전부(비공개까지)</td><td>다른 쪽 「List repositories for the authenticated user」 = <code>GET /user/repos</code> + 토큰</td></tr></tbody></table>
<p>그대로 옮기면 아래 한 줄이에요.</p>
<pre class="code">GET https://api.github.com/users/octocat/repos?sort=updated&amp;per_page=5</pre>
<p>문서의 오른쪽에는 curl · JavaScript · GitHub CLI 예제와 응답 예가 같이 있어요.</p>${API_DATE}`,
      example: { label: '예제 명령 — Git Bash(토큰 없이)', shell: 'curl -s "https://api.github.com/users/octocat/repos?sort=updated&per_page=5" -H "Accept: application/vnd.github+json"' } },
    { title: 'OpenAPI: 기계도 읽는 문서', html: `<p>사람이 읽는 문서 말고, <b>기계도 읽을 수 있게</b> API 를 적는 약속이 <b>OpenAPI</b> 예요(JSON · YAML 파일). 어느 주소에 어떤 메서드 · 파라미터 · 응답이 있는지가 정해진 모양으로 들어 있어요.</p>
<pre class="code">paths:
  /todos:
    get:
      summary: 할 일 목록
      parameters:
        - name: done
          in: query
          required: false
    post:
      summary: 할 일 만들기
      responses:
        "201": { description: 만들어짐 }</pre>
<table class="kb"><tbody><tr><td><b>Swagger UI</b></td><td>OpenAPI 파일을 웹 화면 문서로 — 엔드포인트마다 <b>Try it out</b> 으로 그 자리에서 불러 볼 수 있어요</td></tr><tr><td>SDK 자동 생성</td><td>OpenAPI 파일로 여러 언어의 SDK 를 기계가 만들기도 해요(챕터 4)</td></tr><tr><td>GitHub</td><td>GitHub REST API 도 OpenAPI 파일을 공개해요</td></tr><tr><td><b>FastAPI</b></td><td>챕터 3 에서 내가 만든 서버는 <code>/docs</code> 에 이 화면이 <b>저절로</b> 생겨요</td></tr></tbody></table>` },
  ],
  summary: ['문서의 여덟 칸 — 엔드포인트 · 파라미터 · 응답 예부터', '{username} 같은 칸은 내가 채운다', 'OpenAPI 는 기계도 읽는 문서(Swagger UI · /docs)'] },
{ id: 'HB2', ch: 2, boss: true, title: '보스: 내 GitHub 저장소 보고서', mode: 'text', pages: [], summary: [], tutorSummary: '챕터 2 종합. 환경 변수의 토큰 + Session(헤더 세 줄) + GET /user/repos?per_page=100 을 Link 의 next 가 없을 때까지, 언어별 개수 · 별 많은 순 3개 · 최근 push 3개 · 남은 한도, 한도가 0 이면 reset 까지 몇 분 기다릴지. 보고서 만드는 부분은 저장소 목록을 인자로 받는 함수.' },
// ================= 챕터 3 내가 API 만들기 =================
{ id: 'H10', ch: 3, n: 10, title: 'FastAPI 첫 서버', mode: 'text', tutorSummary: '서버 = 요청을 기다렸다가 응답을 돌려주는 프로그램. python -m pip install "fastapi[standard]", app = FastAPI(), @app.get("/hello") 함수가 dict 를 돌려주면 JSON, fastapi dev main.py → http://127.0.0.1:8000(저장하면 다시 켜짐, Ctrl+C 로 끔). 터미널의 요청 기록 한 줄, 없는 주소 404 · 다른 메서드 405. /docs 는 OpenAPI 문서 화면(Try it out), TestClient 로 서버를 안 켜고 시험.',
  pages: [
    { title: '서버 = 기다렸다가 대답하는 프로그램', html: `<p>지금까지는 남의 서버에 <b>물었어요</b>. 이제 내가 <b>대답하는 쪽</b>이 돼요. 파이썬에서는 <b>FastAPI</b> 로 함수 하나가 API 하나가 돼요.</p>
<div class="bk-step-box"><b>① 설치(한 번)</b><br>VS Code 터미널에서 <code>python -m pip install "fastapi[standard]"</code> — 큰따옴표까지 그대로(대괄호를 셸이 다르게 읽지 않게).</div>
<div class="bk-step-box"><b>② main.py</b><br>아래 예제를 <code>api-study/main.py</code> 로 저장.</div>
<div class="bk-step-box"><b>③ 켜기</b><br>같은 폴더에서 <code>fastapi dev main.py</code> → 「<code>http://127.0.0.1:8000</code>」 이 보이면 켜진 거예요. 브라우저로 <code>http://127.0.0.1:8000/hello</code> → <code>{"message":"안녕하세요"}</code>. 끄기는 터미널에서 <kbd>Ctrl</kbd>+<kbd>C</kbd>.</div>
<table class="kb"><tbody><tr><td><code>app = FastAPI()</code></td><td>서버 하나</td></tr><tr><td><code>@app.get("/hello")</code></td><td>「<code>GET /hello</code> 요청이 오면 아래 함수를 불러」(<a href="../python/#lesson/L18F" target="_blank" rel="noopener">파이썬 교과서 「데코레이터」 ↗</a>)</td></tr><tr><td><code>return {…}</code></td><td>딕셔너리 · 리스트를 돌려주면 FastAPI 가 <b>JSON</b> 으로 바꾸고 <code>Content-Type</code> 까지 붙여요</td></tr><tr><td><code>fastapi dev</code></td><td>개발용 — 파일을 저장하면 서버가 <b>저절로 다시 켜져요</b></td></tr></tbody></table>
<div class="bk-warn"><b>내 서버는 내 PC 에서만.</b> <code>127.0.0.1</code> 은 「이 컴퓨터 자신」 이라 다른 기기는 못 들어와요(기본값). <code>--host 0.0.0.0</code> 으로 열면 같은 와이파이의 다른 기기도 들어와요 — 연습 중에는 쓰지 않아요.</div>`,
      example: { label: '예제 — main.py 로 저장하고 fastapi dev main.py', shell: 'from fastapi import FastAPI\n\napp = FastAPI()\n\n\n@app.get("/hello")\ndef hello():\n    return {"message": "안녕하세요"}' } },
    { title: '요청 기록 읽기 · curl · requests 로 부르기', html: `<p>서버를 켠 터미널에는 요청이 올 때마다 한 줄씩 찍혀요 — 내 서버의 Network 탭이에요.</p>
<pre class="code">INFO:     127.0.0.1:52344 - "GET /hello HTTP/1.1" 200 OK
INFO:     127.0.0.1:52344 - "GET /hi HTTP/1.1" 404 Not Found
INFO:     127.0.0.1:52351 - "POST /hello HTTP/1.1" 405 Method Not Allowed</pre>
<table class="kb"><tbody><tr><td>누가(주소 · 포트)</td><td>요청 줄</td><td>상태 코드</td></tr></tbody></table>
<table class="kb"><tbody><tr><td>없는 주소</td><td><b>404</b> <code>{"detail": "Not Found"}</code></td></tr><tr><td>주소는 있는데 메서드가 다름</td><td><b>405</b> <code>{"detail": "Method Not Allowed"}</code></td></tr><tr><td>함수 안에서 에러</td><td><b>500</b> — 터미널에 파이썬 트레이스백이 찍혀요(원인은 거기서)</td></tr></tbody></table>
<p>다른 터미널(서버 터미널은 켜 둔 채)에서 챕터 1·2 의 도구로 그대로 불러요: <code>curl -i http://127.0.0.1:8000/hello</code> · <code>requests.get("http://127.0.0.1:8000/hello", timeout=10)</code>. 이번엔 <b>양쪽 끝이 다 내 것</b>이라, 요청이 서버 기록에 찍히는 걸 동시에 볼 수 있어요.</p>`,
      example: { label: '예제 명령 — 서버를 켠 채 다른 터미널에서', shell: 'curl -i http://127.0.0.1:8000/hello\ncurl -i http://127.0.0.1:8000/hi\ncurl -i -X POST http://127.0.0.1:8000/hello' } },
    { title: '/docs 와 TestClient', html: `<p>서버를 켜고 <code>http://127.0.0.1:8000/docs</code> 를 열어 봐요. 내가 쓴 적 없는 <b>API 문서 화면</b>이 있어요 — 레슨 9 의 <b>OpenAPI</b> 를 FastAPI 가 함수들을 보고 저절로 만든 거예요(날것은 <code>/openapi.json</code>). 엔드포인트를 펴고 <b>Try it out → Execute</b> 를 누르면 그 자리에서 불러 보고 응답 · curl 명령까지 보여 줘요.</p>
<p>서버를 켜지 않고 <b>코드로 시험</b>할 수도 있어요. <code>TestClient</code> 는 requests 와 똑같이 생겼지만, 네트워크 없이 내 <code>app</code> 을 바로 불러요. 이 교과서의 서버 문제는 이걸로 확인해요(<code>python -m pip install httpx</code> 가 필요한데 <code>fastapi[standard]</code> 에 들어 있어요).</p>
<pre class="code">from fastapi.testclient import TestClient

client = TestClient(app)
res = client.get("/hello")
print(res.status_code, res.json())</pre>`,
      example: { code: 'from fastapi import FastAPI\nfrom fastapi.testclient import TestClient\n\napp = FastAPI()\n\n\n@app.get("/hello")\ndef hello():\n    return {"message": "안녕하세요"}\n\n\nclient = TestClient(app)\nres = client.get("/hello")\nprint(res.status_code, res.json())\nprint(client.get("/hi").status_code, client.post("/hello").status_code)\nprint(list(client.get("/openapi.json").json()["paths"]))', label: '예제 코드 — 서버를 안 켜고 실행(fastapi 설치 뒤)' } },
  ],
  summary: ['@app.get("/hello") 함수가 dict 를 돌려주면 JSON', 'fastapi dev main.py → 127.0.0.1:8000 · Ctrl+C', '/docs 는 저절로 생긴 문서 · TestClient 로 서버 없이 시험'] },
{ id: 'H11', ch: 3, n: 11, title: '입력 받기: 경로 · 쿼리 · 본문', mode: 'text', tutorSummary: '경로 파라미터 /todos/{todo_id} + 함수 인자 todo_id: int — 글자를 주면 422. 경로에 없는 인자는 쿼리(done: bool | None = None, limit: int = 10, true · 1 · yes 는 True). 본문은 Pydantic BaseModel(text: str = Field(min_length=1)), model_dump(). 빠진 칸 · 틀린 타입 · 규칙 위반은 FastAPI 가 알아서 422 + detail 목록(type · loc · msg · input).',
  pages: [
    { title: '경로 파라미터와 쿼리 파라미터', html: `<pre class="code">@app.get("/todos/{todo_id}")
# 주소의 {todo_id} 칸 = 함수 인자, 타입은 int
def get_todo(todo_id: int):
    …

@app.get("/todos")
# 주소에 없는 인자 = 쿼리
def list_todos(done: bool | None = None, limit: int = 10):
    …</pre>
<table class="kb"><tbody><tr><td><code>GET /todos/3</code></td><td><code>todo_id</code> 에 숫자 <b>3</b>(글자 <code>"3"</code> 이 아니라) — 타입 힌트대로 바꿔 줘요</td></tr><tr><td><code>GET /todos/abc</code></td><td><b>422</b> — 숫자가 아니라서 함수를 부르지도 않아요</td></tr><tr><td><code>GET /todos?done=true&amp;limit=3</code></td><td><code>done=True</code> · <code>limit=3</code>(<code>true</code> · <code>1</code> · <code>yes</code> 는 모두 True)</td></tr><tr><td><code>GET /todos</code></td><td>기본값 — <code>done=None</code> · <code>limit=10</code></td></tr></tbody></table>
<p>타입 힌트(<a href="../python/#lesson/L18E" target="_blank" rel="noopener">파이썬 교과서 「타입 힌트」 ↗</a>)가 FastAPI 에서는 곧 <b>검사</b>예요. 함수 안에서 「숫자인가?」 를 직접 확인할 필요가 없어요. <code>/docs</code> 에도 각 칸의 타입 · 기본값이 그대로 나와요.</p>`,
      example: { code: 'from fastapi import FastAPI\nfrom fastapi.testclient import TestClient\n\napp = FastAPI()\n\n\n@app.get("/todos/{todo_id}")\ndef get_todo(todo_id: int):\n    return {"todo_id": todo_id, "type": type(todo_id).__name__}\n\n\n@app.get("/todos")\ndef list_todos(done: bool | None = None, limit: int = 10):\n    return {"done": done, "limit": limit}\n\n\nclient = TestClient(app)\nprint(client.get("/todos/3").json())\nprint(client.get("/todos/abc").status_code)\nprint(client.get("/todos?done=true&limit=3").json())\nprint(client.get("/todos").json())', label: '예제 코드 — 서버를 안 켜고 실행' } },
    { title: '본문: Pydantic 모델', html: `<p>POST · PUT · PATCH 의 <b>JSON 본문</b>은 모양을 <b>클래스</b>로 적어요(Pydantic — FastAPI 에 같이 깔려요).</p>
<pre class="code">from pydantic import BaseModel, Field

class TodoIn(BaseModel):
    # 꼭 있어야 하고 1~100글자
    text: str = Field(min_length=1, max_length=100)
    # 없으면 False
    done: bool = False

@app.post("/todos", status_code=201)
# 인자 타입이 모델이면 = 본문
def create_todo(todo: TodoIn):
    return {"id": 1, **todo.model_dump()}</pre>
<table class="kb"><tbody><tr><td><code>todo.text</code> · <code>todo.done</code></td><td>검사를 통과한 값 — 함수 안에서는 늘 믿고 써요</td></tr><tr><td><code>todo.model_dump()</code></td><td>딕셔너리로</td></tr><tr><td><code>Field(min_length=…, max_length=…)</code> · <code>Field(ge=0, le=10)</code></td><td>글자 수 · 숫자 범위 규칙</td></tr></tbody></table>
<p>본문이 빠졌거나 · <code>text</code> 가 없거나 · 빈 글자거나 · <code>done</code> 에 <code>"몰라"</code> 를 주면 함수는 불리지 않고 <b>422</b> 가 가요.</p>`,
      example: { code: 'from fastapi import FastAPI\nfrom fastapi.testclient import TestClient\nfrom pydantic import BaseModel, Field\n\napp = FastAPI()\n\n\nclass TodoIn(BaseModel):\n    text: str = Field(min_length=1, max_length=100)\n    done: bool = False\n\n\n@app.post("/todos", status_code=201)\ndef create_todo(todo: TodoIn):\n    return {"id": 1, **todo.model_dump()}\n\n\nclient = TestClient(app)\nres = client.post("/todos", json={"text": "장보기"})\nprint(res.status_code, res.json())\nprint(client.post("/todos", json={"text": ""}).status_code)\nprint(client.post("/todos", json={"done": "몰라"}).status_code)', label: '예제 코드 — 서버를 안 켜고 실행' } },
    { title: '422 응답 읽기', html: `<p>FastAPI 의 422 는 <b>무엇이 · 어디서 · 왜</b> 틀렸는지 목록으로 알려 줘요.</p>
<pre class="code">{"detail": [
  {"type": "missing", "loc": ["body", "text"], "msg": "Field required", "input": {}},
  {"type": "int_parsing", "loc": ["path", "todo_id"],
   "msg": "Input should be a valid integer, unable to parse string as an integer", "input": "abc"}
]}</pre>
<table class="kb"><tbody><tr><td><code>loc</code></td><td><b>어디</b> — <code>["body", "text"]</code> 본문의 text 칸 · <code>["path", "todo_id"]</code> 경로 · <code>["query", "limit"]</code> 쿼리</td></tr><tr><td><code>type</code></td><td><b>무엇</b> — <code>missing</code> 빠짐 · <code>int_parsing</code> 숫자가 아님 · <code>string_too_short</code> 너무 짧음 · <code>bool_parsing</code></td></tr><tr><td><code>msg</code> · <code>input</code></td><td>사람이 읽을 설명 · 실제로 받은 값</td></tr></tbody></table>
<p>API 를 <b>쓰는 쪽</b>(챕터 2 의 나, 챕터 4 의 SDK)은 이 목록을 읽어 「text 칸이 빠졌어요」 처럼 알려 주면 돼요. 이게 레슨 2 표의 「422 — 값이 규칙에 안 맞음」 의 실제 모습이에요.</p>`,
      example: { code: 'from fastapi import FastAPI\nfrom fastapi.testclient import TestClient\nfrom pydantic import BaseModel\n\napp = FastAPI()\n\n\nclass TodoIn(BaseModel):\n    text: str\n\n\n@app.post("/todos")\ndef create_todo(todo: TodoIn):\n    return todo\n\n\nclient = TestClient(app)\nfor err in client.post("/todos", json={}).json()["detail"]:\n    print(err["type"], "/".join(err["loc"]), "-", err["msg"])', label: '예제 코드 — 서버를 안 켜고 실행' } },
  ],
  summary: ['/todos/{todo_id} + todo_id: int — 타입 힌트가 검사', '경로에 없는 인자는 쿼리(기본값)', '본문은 BaseModel — 틀리면 422 + detail(loc · type · msg)'] },
{ id: 'H12', ch: 3, n: 12, title: '상태 코드와 저장', mode: 'text', tutorSummary: '만들면 @app.post(…, status_code=201), 없으면 raise HTTPException(status_code=404, detail=…), 지우면 status_code=204 + Response(status_code=204). 메모리(리스트)는 서버를 끄면 사라짐 → sqlite3(파일 todos.db, CREATE TABLE IF NOT EXISTS, lastrowid, row_factory = sqlite3.Row, ? 자리표시). CORS: 웹 페이지(127.0.0.1:5500)에서 부르면 막힘 → CORSMiddleware(allow_origins=[그 주소]).',
  pages: [
    { title: '알맞은 상태 코드 돌려주기', html: `<pre class="code">from fastapi import HTTPException, Response

# 만들었으면 201
@app.post("/todos", status_code=201)
def create_todo(todo: TodoIn): …

@app.get("/todos/{todo_id}")
def get_todo(todo_id: int):
    if todo_id not in todos:
        # 없으면 404
        raise HTTPException(status_code=404, detail="할 일이 없어요")
    return todos[todo_id]

@app.delete("/todos/{todo_id}", status_code=204)
def delete_todo(todo_id: int):
    …
    # 지웠으면 204(본문 없음)
    return Response(status_code=204)</pre>
<table class="kb"><tbody><tr><td><code>raise HTTPException(…)</code></td><td>함수를 바로 멈추고 그 상태 코드 + <code>{"detail": "할 일이 없어요"}</code> 를 보내요(<a href="../python/#lesson/L15C" target="_blank" rel="noopener">파이썬 교과서 「내 예외 만들기: raise」 ↗</a> 와 같음)</td></tr><tr><td>아무것도 안 정하면</td><td>200 — 만들었는데 200 이면 쓰는 쪽이 「만들어졌나?」 헷갈려요</td></tr><tr><td>지운 걸 또 지우면</td><td>404 — DELETE 는 멱등(지워진 상태는 같음)</td></tr></tbody></table>`,
      example: { code: 'from fastapi import FastAPI, HTTPException, Response\nfrom fastapi.testclient import TestClient\n\napp = FastAPI()\ntodos = {1: {"id": 1, "text": "장보기", "done": False}}\n\n\n@app.get("/todos/{todo_id}")\ndef get_todo(todo_id: int):\n    if todo_id not in todos:\n        raise HTTPException(status_code=404, detail="할 일이 없어요")\n    return todos[todo_id]\n\n\n@app.delete("/todos/{todo_id}", status_code=204)\ndef delete_todo(todo_id: int):\n    if todos.pop(todo_id, None) is None:\n        raise HTTPException(status_code=404, detail="할 일이 없어요")\n    return Response(status_code=204)\n\n\nclient = TestClient(app)\nprint(client.get("/todos/1").status_code, client.get("/todos/9").json())\nprint(client.delete("/todos/1").status_code, client.delete("/todos/1").status_code)', label: '예제 코드 — 서버를 안 켜고 실행' } },
    { title: 'SQLite 로 저장: 껐다 켜도 남게', html: `<p>딕셔너리 · 리스트에 넣으면 <b>서버를 끄는 순간 사라져요</b>(<code>fastapi dev</code> 는 저장할 때마다 다시 켜서 더 자주 사라져요). 파일로 저장하는 데이터베이스 <b>SQLite</b>(SQL 교과서)를 파이썬 <code>sqlite3</code> 로 써요 — 따로 설치할 것 없어요.</p>
<pre class="code">import sqlite3

def db():
    # 파일 하나가 데이터베이스
    con = sqlite3.connect("todos.db")
    # 줄을 dict(row) 로 바꿀 수 있게
    con.row_factory = sqlite3.Row
    con.execute("CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY, text TEXT NOT NULL, done INTEGER NOT NULL DEFAULT 0)")
    return con

# 끝나면 저장(commit)
with db() as con:
    cur = con.execute("INSERT INTO todos (text) VALUES (?)", (todo.text,))
    # 새로 생긴 id
    new_id = cur.lastrowid</pre>
<table class="kb"><tbody><tr><td><code>?</code> 자리표시</td><td>값은 늘 <code>?</code> 로 넘겨요 — f-string 으로 SQL 에 끼우면 사용자 글이 SQL 명령이 될 수 있어요(SQL 교과서 · SQL 주입)</td></tr><tr><td><code>done INTEGER</code></td><td>SQLite 에는 참거짓이 없어서 0 · 1 — 돌려줄 때 <code>bool(row["done"])</code></td></tr><tr><td><code>.gitignore</code> 에 <code>todos.db</code></td><td>데이터 파일은 보통 Git 에 안 올려요</td></tr></tbody></table>`,
      example: { code: 'import sqlite3\n\nfrom fastapi import FastAPI\nfrom fastapi.testclient import TestClient\nfrom pydantic import BaseModel\n\n\ndef db():\n    con = sqlite3.connect("todos.db")\n    con.row_factory = sqlite3.Row\n    con.execute("CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY, text TEXT NOT NULL, done INTEGER NOT NULL DEFAULT 0)")\n    return con\n\n\napp = FastAPI()\n\n\nclass TodoIn(BaseModel):\n    text: str\n\n\n@app.post("/todos", status_code=201)\ndef create_todo(todo: TodoIn):\n    with db() as con:\n        cur = con.execute("INSERT INTO todos (text) VALUES (?)", (todo.text,))\n    return {"id": cur.lastrowid, "text": todo.text, "done": False}\n\n\n@app.get("/todos")\ndef list_todos():\n    with db() as con:\n        rows = con.execute("SELECT * FROM todos ORDER BY id").fetchall()\n    return [{**dict(r), "done": bool(r["done"])} for r in rows]\n\n\nclient = TestClient(app)\nclient.post("/todos", json={"text": "장보기"})\nclient.post("/todos", json={"text": "운동"})\nprint(client.get("/todos").json())', label: '예제 코드 — 같은 폴더에 todos.db 가 생겨요' } },
    { title: 'CORS 켜기: 내 웹 화면에서 부르기', html: `<p>웹 교과서로 만든 화면(Live Server <code>http://127.0.0.1:5500</code>)에서 내 API(<code>http://127.0.0.1:8000</code>)를 fetch 하면, 포트가 달라서 <b>다른 출처</b>예요. 레슨 4 의 그 CORS 에러가 Console 창에 떠요 — 이번엔 서버가 내 것이니 <b>직접 고쳐요</b>.</p>
<pre class="code">from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    # 이 출처의 페이지만 허락
    allow_origins=["http://127.0.0.1:5500"],
    allow_methods=["*"],
    allow_headers=["*"],
)</pre>
<table class="kb"><tbody><tr><td>허락한 출처에서 온 요청</td><td>응답에 <code>access-control-allow-origin: http://127.0.0.1:5500</code></td></tr><tr><td>다른 출처</td><td>그 헤더가 없음 → 브라우저가 막음(curl · 파이썬은 여전히 돼요)</td></tr><tr><td><code>allow_origins=["*"]</code></td><td>아무 페이지나 — 공개 API 라면 괜찮지만, 로그인이 있는 API 에는 쓰지 않아요</td></tr></tbody></table>
<p>POST · PATCH 처럼 JSON 을 보내는 요청은 브라우저가 먼저 <code>OPTIONS</code>(「보내도 돼요?」) 요청을 하나 더 보내요 — 서버 기록에 <code>OPTIONS /todos 200</code> 이 보여도 정상이에요.</p>`,
      example: { code: 'from fastapi import FastAPI\nfrom fastapi.middleware.cors import CORSMiddleware\nfrom fastapi.testclient import TestClient\n\napp = FastAPI()\napp.add_middleware(CORSMiddleware, allow_origins=["http://127.0.0.1:5500"], allow_methods=["*"], allow_headers=["*"])\n\n\n@app.get("/hello")\ndef hello():\n    return {"message": "안녕하세요"}\n\n\nclient = TestClient(app)\nfor origin in ["http://127.0.0.1:5500", "http://evil.example"]:\n    res = client.get("/hello", headers={"Origin": origin})\n    print(origin, "→", res.headers.get("access-control-allow-origin"))', label: '예제 코드 — 서버를 안 켜고 실행' } },
  ],
  summary: ['만들면 201 · 없으면 HTTPException(404) · 지우면 204', 'sqlite3 로 파일에 — 값은 늘 ? 자리표시', 'CORSMiddleware 로 내 화면의 출처만 허락'] },
{ id: 'HB3', ch: 3, boss: true, title: '보스: 할 일 API', mode: 'text', pages: [], summary: [], tutorSummary: '챕터 3 종합. GET/POST /todos · GET/PATCH/DELETE /todos/{id} + SQLite + 201 · 404 · 204 · 422 + Pydantic(TodoIn · TodoPatch 의 None 칸) + CORS. 웹 교과서의 할 일 앱이 localStorage 대신 이 API 를 쓰게(같은 화면이 서버와 대화).' },
// ================= 챕터 4 SDK =================
{ id: 'H13', ch: 4, n: 13, title: 'SDK 란: requests 코드 vs SDK 코드', mode: 'text', tutorSummary: '같은 일(내 저장소 목록)을 requests(주소 · 헤더 · 쪽 넘기기 · 에러 직접)와 PyGithub(Github(auth=Auth.Token(token)).get_user().get_repos())로 나란히. SDK 가 숨긴 것: 기본 주소 · 헤더 · 쪽 넘기기 · JSON→객체 · 상태 코드→예외(BadCredentialsException · UnknownObjectException · RateLimitExceededException). SDK 의 모양 = 클라이언트 · 자원별 메서드 · 결과 객체 · 예외. 공식 vs 커뮤니티 · 버전 고정 · 없으면 HTTP 로.',
  pages: [
    { title: 'requests 코드 vs SDK 코드', html: `<p>챕터 2 의 「내 저장소 목록」 을 두 가지로 써 봐요. 왼쪽은 HTTP 를 직접, 오른쪽은 GitHub API 의 파이썬 <b>SDK</b> 인 <b>PyGithub</b>(<code>python -m pip install PyGithub</code>).</p>
<pre class="code"># requests — 내가 다 챙김
s = requests.Session()
s.headers.update({"Authorization": f"Bearer {token}",
                  "Accept": "application/vnd.github+json",
                  "X-GitHub-Api-Version": "2022-11-28"})
url = "https://api.github.com/user/repos?per_page=100"
while url:
    res = s.get(url, timeout=10)
    res.raise_for_status()
    for r in res.json():
        print(r["full_name"], r["stargazers_count"])
    url = res.links.get("next", {}).get("url")</pre>
<pre class="code"># PyGithub — SDK 가 챙김
from github import Auth, Github

g = Github(auth=Auth.Token(token))
for repo in g.get_user().get_repos():
    print(repo.full_name, repo.stargazers_count)</pre>
<table class="kb"><tbody><tr><th>SDK 가 숨긴 것</th><th>requests 에서는</th></tr><tr><td>기본 주소 · 헤더 · 버전</td><td>내가 Session 에 세 줄</td></tr><tr><td>쪽 넘기기</td><td><code>res.links["next"]</code> 반복 — SDK 는 <code>for</code> 를 돌리면 필요할 때 다음 쪽을 받아요</td></tr><tr><td>JSON → 객체</td><td><code>r["full_name"]</code> 대신 <code>repo.full_name</code>(VS Code 가 자동 완성)</td></tr><tr><td>상태 코드 → 예외</td><td>401 · 404 · 한도를 내가 확인 — SDK 는 <code>BadCredentialsException</code> · <code>UnknownObjectException</code> · <code>RateLimitExceededException</code></td></tr></tbody></table>` },
    { title: 'SDK 의 모양', html: `<p>회사마다 SDK 는 달라도 모양은 거의 같아요. 이 모양을 알면 처음 보는 SDK 도 금방 써요.</p>
<table class="kb"><tbody><tr><td>① <b>클라이언트 객체</b></td><td>설정(주소 · 키 · 시간 제한)을 <b>한 번</b>: <code>g = Github(auth=…)</code></td></tr><tr><td>② <b>자원별 메서드</b></td><td>API 의 엔드포인트 하나 = 메서드 하나: <code>g.get_repo("octocat/Hello-World")</code> = <code>GET /repos/octocat/Hello-World</code></td></tr><tr><td>③ <b>결과는 객체</b></td><td>딕셔너리 대신 속성: <code>repo.stargazers_count</code> · 다음 요청도 객체에서 <code>repo.get_issues()</code></td></tr><tr><td>④ <b>에러는 예외</b></td><td><code>except UnknownObjectException:</code> — 상태 코드 숫자 대신 이름으로</td></tr><tr><td>⑤ (많은 SDK) <b>재시도 · 한도 · 쪽 넘기기</b></td><td>안에서 알아서. <code>g.rate_limiting</code> 은 (남은 횟수, 한도)</td></tr></tbody></table>
<p>①~④ 를 그대로 거꾸로 하면 <b>SDK 를 만드는 법</b>이 돼요 — 레슨 14 · 15 에서 챕터 3 의 할 일 API 로 해요.</p>`,
      example: { label: '예제 코드 — 인터넷 + 토큰(환경 변수)이 필요해요', shell: 'import os\n\nfrom github import Auth, Github, UnknownObjectException\n\ng = Github(auth=Auth.Token(os.environ["GITHUB_TOKEN"]))\nrepo = g.get_repo("octocat/Hello-World")\nprint(repo.full_name, repo.stargazers_count, repo.default_branch)\ntry:\n    g.get_repo("octocat/없는-저장소")\nexcept UnknownObjectException:\n    print("그런 저장소는 없어요(404)")\nprint("남은 한도, 한도:", g.rate_limiting)' } },
    { title: '공식 SDK vs 커뮤니티 SDK · 버전', html: `<table class="kb"><tbody><tr><td><b>공식 SDK</b></td><td>API 를 만든 회사가 직접 — 새 기능이 빨리 들어오고 문서에 같이 나와요(예: 결제 · 클라우드 · AI 회사의 파이썬 SDK)</td></tr><tr><td><b>커뮤니티 SDK</b></td><td>다른 사람들이 만든 것 — PyGithub 이 그래요(GitHub 의 공식 SDK 는 JavaScript 의 Octokit 등). 고를 땐 <b>최근 업데이트 · 문서 · 라이선스 · 쓰는 사람 수</b>를 봐요</td></tr><tr><td><b>버전 고정</b></td><td>SDK 가 바뀌면 내 코드가 깨질 수 있어서 <code>requirements.txt</code> 에 <code>PyGithub==2.*</code> 처럼 적고, 올릴 땐 바뀐 점(CHANGELOG)을 읽어요</td></tr><tr><td><b>SDK 가 없거나 기능이 빠졌으면</b></td><td>챕터 2 처럼 HTTP 로 직접 — SDK 도 결국 안에서 HTTP 를 보내요. 그래서 HTTP 를 알면 SDK 에 막혀도 길이 있어요</td></tr></tbody></table>` },
  ],
  summary: ['SDK = 클라이언트 · 자원별 메서드 · 결과 객체 · 예외', 'SDK 가 주소 · 헤더 · 쪽 넘기기 · 에러를 숨긴다', '없거나 빠졌으면 HTTP 로 — SDK 도 결국 HTTP'] },
{ id: 'H14', ch: 4, n: 14, title: '내 SDK 만들기 1: 클래스로 감싸기', mode: 'text', tutorSummary: 'class TodoClient: __init__(base_url, token=None, session=None, timeout=10) — 설정은 한 번, session 을 받아 시험할 땐 TestClient 를 넣음. _request(method, path, **kw) 한 곳에서 주소 · 헤더 · 상태 코드 처리, 204 면 None. 메서드 하나 = 엔드포인트 하나: list · get · create · update(보낸 칸만) · delete. 내 예외: TodoError ← TodoNotFound(404) · ValidationError(422, errors) · APIError(status, body).',
  pages: [
    { title: 'class TodoClient: 설정은 한 번', html: `<p>챕터 3 의 할 일 API 를 쓰는 사람이 <code>requests</code> 와 주소를 몰라도 되게, <b>클래스 하나</b>로 감싸요.</p>
<pre class="code">import requests

class TodoClient:
    def __init__(self, base_url, token=None, session=None, timeout=10):
        self.base_url = base_url.rstrip("/")
        self.session = session or requests.Session()
        self.timeout = timeout
        if token:
            self.session.headers.update({"Authorization": f"Bearer {token}"})

client = TodoClient("http://127.0.0.1:8000")</pre>
<table class="kb"><tbody><tr><td><code>base_url</code></td><td>서버 주소는 한 번만 — 내 PC · 회사 서버를 바꿔 끼우기 쉽게</td></tr><tr><td><code>session=None</code></td><td>안 주면 <code>requests.Session()</code>. <b>시험할 땐</b> FastAPI 의 <code>TestClient(app)</code> 를 넣어요 — 생김새(<code>.request(…)</code> · <code>.headers</code>)가 같아서 서버를 켜지 않고 SDK 를 확인할 수 있어요(이 교과서의 SDK 문제가 그렇게 검사돼요)</td></tr><tr><td><code>timeout</code></td><td>모든 요청에 같은 값 — 쓰는 사람은 잊어버려도 돼요. TestClient 로 시험할 땐 <code>timeout=None</code></td></tr></tbody></table>` },
    { title: '메서드 하나 = 엔드포인트 하나', html: `<pre class="code">    def _request(self, method, path, **kwargs):
        if self.timeout is not None:
            kwargs["timeout"] = self.timeout
        res = self.session.request(method, self.base_url + path, **kwargs)
        self._raise_for(res)                      # 다음 쪽
        return None if res.status_code == 204 else res.json()

    def list(self, done=None):
        params = {} if done is None else {"done": done}
        return self._request("GET", "/todos", params=params)

    def get(self, todo_id):
        return self._request("GET", f"/todos/{todo_id}")

    def create(self, text):
        return self._request("POST", "/todos", json={"text": text})

    def update(self, todo_id, *, text=None, done=None):
        body = {k: v for k, v in {"text": text, "done": done}.items() if v is not None}
        return self._request("PATCH", f"/todos/{todo_id}", json=body)

    def delete(self, todo_id):
        self._request("DELETE", f"/todos/{todo_id}")</pre>
<table class="kb"><tbody><tr><td><code>_request</code></td><td>주소 붙이기 · timeout · 상태 코드 처리를 <b>한 곳</b>에서. 이름 앞 <code>_</code> 는 「안에서만 쓰는 것」 이라는 약속</td></tr><tr><td><code>update(…, *, text=None, done=None)</code></td><td><code>*</code> 뒤는 이름을 꼭 써서 부르기(<code>update(3, done=True)</code>) · 보낸 칸만 본문에 — API 의 PATCH 와 맞춤</td></tr><tr><td>쓰는 쪽</td><td><code>client.create("장보기")</code> · <code>client.update(1, done=True)</code> — 주소 · 메서드 · JSON 이 안 보여요</td></tr></tbody></table>` },
    { title: '에러를 내 예외로', html: `<p>쓰는 사람이 상태 코드 숫자를 외우지 않게, <b>내 예외 클래스</b>로 바꿔 던져요(<a href="../python/#lesson/L15C" target="_blank" rel="noopener">파이썬 교과서 「내 예외 만들기: raise」 ↗</a>).</p>
<pre class="code">class TodoError(Exception):          # 이 SDK 의 모든 에러의 부모
    pass

class TodoNotFound(TodoError):       # 404
    pass

class ValidationError(TodoError):    # 422 — 무엇이 틀렸는지 같이
    def __init__(self, errors):
        super().__init__("입력이 규칙에 안 맞아요: " + ", ".join(e["loc"][-1] for e in errors))
        self.errors = errors

class APIError(TodoError):           # 그 밖의 4xx · 5xx
    def __init__(self, status, body):
        super().__init__(f"API 에러 {status}: {body}")
        self.status = status

    def _raise_for(self, res):           # (TodoClient 안의 메서드)
        if res.status_code == 404:
            raise TodoNotFound(res.json().get("detail", "없어요"))
        if res.status_code == 422:
            raise ValidationError(res.json()["detail"])
        if res.status_code >= 400:
            raise APIError(res.status_code, res.text[:200])</pre>
<p>쓰는 쪽은 <code>except TodoNotFound:</code> 로 「없는 할 일」 만 따로, <code>except TodoError:</code> 로 이 SDK 의 에러를 한 번에 잡아요. 레슨 11 의 422 <code>detail</code> 목록이 <code>e.errors</code> 에 그대로 들어 있어요.</p>` },
  ],
  summary: ['설정은 __init__ 한 번 · session 을 받아 시험 가능하게', '메서드 하나 = 엔드포인트 하나, 처리는 _request 한 곳', '404 → TodoNotFound · 422 → ValidationError · 그 밖 → APIError'] },
{ id: 'H15', ch: 4, n: 15, title: '내 SDK 만들기 2: 숨겨 주는 것들', mode: 'text', tutorSummary: '재시도를 SDK 안에: 5xx · 429 · 연결 에러면 sleep(1 → 2 → 4) 후 다시, 멱등인 GET · PUT · PATCH · DELETE 만(POST 는 안 함), sleep 을 받아 시험할 땐 기다리지 않게. 쪽 넘기기를 제너레이터로: def iter_all(): … yield from items — for todo in client.iter_all(). 결과는 @dataclass Todo(Todo(**data)) · 타입 힌트 · docstring(VS Code 에 설명이 뜸).',
  pages: [
    { title: '재시도를 SDK 안에', html: `<p>레슨 8 의 재시도 규칙을 <code>_request</code> 안에 넣으면, SDK 를 쓰는 사람은 서버가 잠깐 503 을 내도 <b>모르고 지나가요</b>.</p>
<pre class="code">RETRY_STATUS = {429, 500, 502, 503, 504}
SAFE = {"GET", "PUT", "PATCH", "DELETE"}            # 다시 보내도 되는 것(POST 빼고)

    def _request(self, method, path, **kwargs):
        for attempt in range(1, self.max_tries + 1):
            try:
                res = self.session.request(method, self.base_url + path, **kwargs)
            except requests.exceptions.ConnectionError:
                res = None
            retry = res is None or res.status_code in RETRY_STATUS
            if not retry or method not in SAFE or attempt == self.max_tries:
                break
            self.sleep(2 ** (attempt - 1))           # 1, 2, 4초
        if res is None:
            raise TodoError("서버에 연결할 수 없어요")
        self._raise_for(res)
        return None if res.status_code == 204 else res.json()</pre>
<table class="kb"><tbody><tr><td><code>self.sleep</code></td><td><code>__init__(…, sleep=time.sleep)</code> 로 받아 둬요. 시험할 땐 <b>기다리지 않고 기록만</b> 하는 함수(예: <code>waited = []</code> 를 만들고 <code>sleep=waited.append</code>)를 넣어 「1초 · 2초 쉬었나」 를 확인</td></tr><tr><td>POST 는 재시도 안 함</td><td>응답만 끊기고 서버는 만들었을 수 있어서(레슨 6 의 멱등)</td></tr><tr><td>끝까지 실패하면</td><td>마지막 응답으로 내 예외(503 이면 <code>APIError</code>)</td></tr></tbody></table>` },
    { title: '쪽 넘기기를 제너레이터로', html: `<p>목록이 쪽으로 나뉘어 오는 API(<code>GET /todos?page=2</code> → <code>{"items": […], "next_page": 3}</code>)라면, SDK 가 쪽을 넘겨 주고 쓰는 사람은 <code>for</code> 만 돌리게 해요.</p>
<pre class="code">    def iter_all(self):
        page = 1
        while page:
            data = self._request("GET", "/todos", params={"page": page})
            yield from data["items"]          # 이 쪽의 할 일을 하나씩 내보내기
            page = data["next_page"]          # 없으면 None → 끝

for todo in client.iter_all():               # 쓰는 쪽
    print(todo["text"])</pre>
<table class="kb"><tbody><tr><td><code>yield</code></td><td>값을 <b>하나 내보내고 거기서 잠깐 멈추는</b> 함수(제너레이터) — <code>for</code> 가 다음 값을 달라고 할 때 이어서 돌아요(<a href="../python/#lesson/L18C" target="_blank" rel="noopener">파이썬 교과서 「반복자와 제너레이터」 ↗</a>)</td></tr><tr><td>필요할 때만 요청</td><td>처음 몇 개만 보고 <code>break</code> 하면 뒤쪽 요청은 아예 안 보내요 — PyGithub 의 <code>get_repos()</code> 가 바로 이렇게 동작</td></tr><tr><td>전부 리스트로</td><td><code>list(client.iter_all())</code></td></tr></tbody></table>` },
    { title: '결과는 dataclass · 타입 힌트 · docstring', html: `<pre class="code">from dataclasses import dataclass

@dataclass
class Todo:
    """할 일 하나."""
    id: int
    text: str
    done: bool = False

    def get(self, todo_id: int) -> Todo:
        """id 로 할 일 하나를 가져와요. 없으면 TodoNotFound."""
        return Todo(**self._request("GET", f"/todos/{todo_id}"))</pre>
<table class="kb"><tbody><tr><td><code>@dataclass</code></td><td>(<a href="../python/#lesson/L15E" target="_blank" rel="noopener">파이썬 교과서 「클래스 4」 ↗</a>) 칸만 적으면 <code>__init__</code> · 보기 좋은 출력(<code>Todo(id=1, text='장보기', done=False)</code>) · <code>==</code> 비교를 만들어 줘요</td></tr><tr><td><code>Todo(**data)</code></td><td>응답 딕셔너리를 그대로 객체로 — <code>todo.text</code> 로 쓰고 VS Code 가 자동 완성</td></tr><tr><td>타입 힌트 <code>-&gt; Todo</code></td><td>무엇을 돌려주는지 — 에디터가 미리 알려 줌</td></tr><tr><td>docstring <code>"""…"""</code></td><td>VS Code 에서 메서드에 마우스를 올리면 이 설명이 떠요 — SDK 의 문서</td></tr></tbody></table>
<p>이게 레슨 13 의 「결과는 객체」 를 내 SDK 에 넣은 거예요.</p>`,
      example: { code: 'from dataclasses import dataclass\n\n\n@dataclass\nclass Todo:\n    """할 일 하나."""\n    id: int\n    text: str\n    done: bool = False\n\n\ndata = {"id": 1, "text": "장보기", "done": False}\ntodo = Todo(**data)\nprint(todo)\nprint(todo.text, todo == Todo(1, "장보기"))', label: '예제 코드 — 인터넷 없이 돌아요' } },
  ],
  summary: ['재시도는 SDK 안에 — 멱등인 것만, sleep 은 받아서', 'iter_all 은 yield from 으로 쪽을 넘김', '결과는 @dataclass · 타입 힌트 · docstring'] },
{ id: 'H16', ch: 4, n: 16, title: '패키지로 묶어 쓰고 나눠 주기', mode: 'text', tutorSummary: 'todo_sdk/__init__.py(밖에 보일 이름 · __version__) · client.py · errors.py · models.py, pyproject.toml([project] name · version · dependencies), python -m pip install -e . 로 어느 폴더에서나 import todo_sdk. 버전 0.1.0 → 0.2.0(기능) → 0.2.1(고침) → 1.0.0, CHANGELOG · README 빠른 시작, GitHub 에 올려 pip install git+https://…. (선택) LLM 회사의 공식 SDK 도 클라이언트 → 메서드 → 결과 객체 → 예외 · 재시도 내장 — 유료 키.',
  pages: [
    { title: '폴더 구조와 pyproject.toml', html: `<pre class="code">todo-sdk/                  ← 프로젝트 폴더(GitHub 저장소 하나)
├── pyproject.toml
├── README.md
└── todo_sdk/              ← 패키지(import 할 이름)
    ├── __init__.py
    ├── client.py          ← TodoClient
    ├── errors.py          ← TodoError · TodoNotFound …
    └── models.py          ← @dataclass Todo</pre>
<pre class="code"># todo_sdk/__init__.py — 밖에서 「from todo_sdk import …」 로 쓸 이름
from .client import TodoClient
from .errors import APIError, TodoError, TodoNotFound, ValidationError
from .models import Todo

__version__ = "0.1.0"</pre>
<pre class="code"># pyproject.toml
[build-system]
requires = ["setuptools>=68"]
build-backend = "setuptools.build_meta"

[project]
name = "todo-sdk"
version = "0.1.0"
description = "할 일 API 의 파이썬 SDK"
requires-python = ">=3.10"
dependencies = ["requests>=2.31"]</pre>
<p><code>todo-sdk</code> 폴더에서 <code>python -m pip install -e .</code>(<code>-e</code> = 고치면 바로 반영 · 가상 환경 안에서 하는 게 좋아요 — <a href="../python/#lesson/L16D" target="_blank" rel="noopener">파이썬 교과서 「pip 와 가상 환경」 ↗</a>) 하면 <b>어느 폴더에서나</b> <code>import todo_sdk</code> 가 돼요. 확인은 다른 폴더에서 아래 한 줄.</p>
<pre class="code">python -c "import todo_sdk; print(todo_sdk.__version__)"</pre>` },
    { title: '버전 · README · 나눠 주기', html: `<table class="kb"><tbody><tr><td><code>0.1.0</code> → <code>0.2.0</code></td><td>기능을 더함(<code>iter_all</code> 추가)</td></tr><tr><td><code>0.2.0</code> → <code>0.2.1</code></td><td>고치기만(버그)</td></tr><tr><td><code>1.0.0</code></td><td>「이제 모양을 함부로 안 바꿀게요」 약속 — 그 뒤 쓰는 사람 코드가 깨지는 변경이면 2.0.0</td></tr></tbody></table>
<p>버전을 올릴 땐 <code>pyproject.toml</code> 의 <code>version</code> 과 <code>__version__</code> 을 같이 바꾸고, <code>CHANGELOG.md</code> 에 바뀐 점을 적어요(이 아카데미의 CHANGELOG 처럼).</p>
<pre class="code">## 빠른 시작
python -m pip install git+https://github.com/내아이디/todo-sdk
from todo_sdk import TodoClient
client = TodoClient("http://127.0.0.1:8000"); client.create("장보기")</pre>
<p>README 맨 위의 「빠른 시작」 세 줄이 SDK 의 첫인상이에요. GitHub 에 올리면(GitHub 교과서) 다른 사람이 위 한 줄로 설치할 수 있어요. 누구나 <code>pip install todo-sdk</code> 로 받게 하려면 PyPI 에 올리는데, 이 교과서 범위 밖이에요.</p>` },
    { title: '(선택) 진짜 회사의 SDK 도 같은 모양', html: `<div class="bk-warn"><b>유료 API 는 돈이 나가요.</b> 이 쪽은 <b>코드 읽기</b>가 목적이에요. 직접 해 보려면 키를 만들기 전에 그 회사의 <b>요금 · 사용 한도 설정</b> 화면부터 봐요. 이 교과서의 다른 실습은 모두 무료예요.</div>
<p>AI(LLM) 회사의 공식 파이썬 SDK 도 내가 만든 SDK 와 모양이 같아요. 예를 들어 Anthropic 의 파이썬 SDK:</p>
<pre class="code">import anthropic

client = anthropic.Anthropic()               # ① 클라이언트 — 키는 환경 변수 ANTHROPIC_API_KEY 에서
try:
    message = client.messages.create(        # ② 자원별 메서드 = POST /v1/messages
        model="claude-sonnet-5-5",
        max_tokens=300,
        messages=[{"role": "user", "content": "HTTP 상태 코드 429 를 한 줄로 설명해 줘"}],
    )
    print(message.content[0].text)           # ③ 결과는 객체
except anthropic.RateLimitError:             # ④ 에러는 이름 있는 예외(429)
    print("잠시 뒤에 다시")</pre>
<p>키는 코드 밖(환경 변수) · 클라이언트 한 번 · 메서드 · 결과 객체 · 예외 — 그리고 이 SDK 도 429 · 5xx 를 <b>안에서 자동으로 몇 번 재시도</b>해요(<code>max_retries</code>). 레슨 14 · 15 에서 내가 만든 것과 같죠. AI 를 쓰는 법 자체는 「AI 와 협업」 · 「LLM 기초」 교과서(예정)에서.</p>` },
  ],
  summary: ['todo_sdk/__init__.py 가 밖에 보일 이름 · __version__', 'pyproject.toml + pip install -e . 로 어디서나 import', '진짜 SDK 도 클라이언트 · 메서드 · 결과 객체 · 예외'] },
{ id: 'HB4', ch: 4, boss: true, title: '보스: 할 일 SDK 와 명령 줄 프로그램', mode: 'text', pages: [], summary: [], tutorSummary: '교과서 종합. 할 일 SDK(TodoClient · 내 예외 · 멱등만 재시도 · dataclass Todo)와 그걸 쓰는 argparse 명령 줄 프로그램 todo add 장보기 · todo list · todo done 3 · todo rm 3. 서버(HB3) · SDK · 프로그램 세 겹이 다 내 것. main(argv, client) 로 나눠 TestClient 로 검사.' },
];
const PROBLEMS = [];
