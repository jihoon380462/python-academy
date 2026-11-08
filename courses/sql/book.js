// courses/sql/book.js — SQL 「교과서」 모드 데이터 (v2.13.0, 사용자 11/6 「2번(SQL·터미널·웹 교과서) 해」 · 「내 컴퓨터 도구로」 · 「필수 사항은 강조하고 계속 다음 진행해」 = N2)
// 화면은 core/ui-views-book.js. 연습은 사용자 PC 의 DB Browser for SQLite(Windows) + 연습 DB cafe.db(courses/sql/cafe.db — datasets.js 의 cafe 로 만듦, tools/build_cafe_db.py)
// lessonPages: S0~S13 쪽 통째(content.js 의 브라우저 실행용 쪽·「준비 중」 대신). example.code = Execute SQL 탭에 붙여 넣을 SQL
// tasks 필드: answer = 예시 답 SQL(또는 runPy:true 면 파이썬 코드 — cafe.db 옆에서 실행한 출력이 결과) · io[0].output = 결과 표(「열 | 열」 머리줄 + 행) · check = 바꾸기 문제에서 다 하고 확인하는 SELECT
//   anyOrder = 행 순서 무시 · db = 데이터셋(기본 cafe) · noRun = 검사 안 함
// 검증: node tools/check_book.mjs — python3 sqlite3 로 cafe 데이터셋을 새로 만들어 answer(+check)를 실행해 결과 표 비교, 파이썬 문제는 cafe.db 옆에서 python3 실행
// 연습 DB 를 만드는 SQL 전체(시작하기 2 의 「SQL 로 만들기」 상자) — datasets.js 의 cafe 그대로(cafe.db 도 이걸로 만듦)
const CAFE_SQL = (typeof SQL_DATASETS !== 'undefined' ? SQL_DATASETS.cafe : '').replace(/^\s*\/\*[^*]*\*\/\s*$/gm, '').trim();
const BOOK = {
  check: 'sql',
  meta: {
    kicker: '🗄️ SQL 교과서', hero: '읽고, DB Browser 에서 직접 쿼리해 보기',
    heroP: '레슨은 SQL 문법 설명이에요. 모든 예제와 「만들어 보기」 는 <b>동네 카페 데이터(cafe.db)</b> 로 해요 — DB Browser for SQLite 의 <b>Execute SQL</b> 탭에 쓰고 실행해서 「결과」 표와 비교하세요. 채점·점수·잠금은 없어요.',
    dexName: 'SQL 문법 도감', dexShort: '문법 도감', dexWhat: '배운 문법', dexHint: '검색해서 바로 찾기(실전은 오픈북)',
    dexExamples: '<code>GROUP BY</code>, <code>조인</code>, <code>NULL</code>, <code>정렬</code>', dexPlaceholder: '🔍 문법 찾기 — JOIN, 정렬, GROUP BY, NULL …', dexAlt: '「합치기」 대신 <code>JOIN</code>',
    dexDocs: 'SQLite 공식 문서 <a href="https://www.sqlite.org/lang.html" target="_blank" rel="noopener">sqlite.org/lang.html</a>',
    dexRun: '예제는 📋 복사해서 DB Browser 의 Execute SQL 탭에서 바로 돌려 볼 수 있고',
    copyToast: '📋 복사했어요. DB Browser 의 Execute SQL 탭에 붙여 넣고 Ctrl+Enter', exampleLabel: '예제 SQL — DB Browser 의 Execute SQL 탭에 붙여 넣고 ▶ (Ctrl+Enter)',
    makeIntro: 'DB Browser 에서 <code>cafe.db</code> 를 열고 <b>Execute SQL</b> 탭에서 직접 써 보세요. 결과 표가 아래 「결과」 와 같으면 성공이에요.',
    makeTail: '막히면 「필요한 문법」을 눌러 설명을 다시 보고, 그래도 막히면 맨 아래 예시 답을 펴 보세요. 쿼리가 달라도 결과가 같으면 맞아요. 데이터를 바꾸는 문제(레슨 8~)를 하다 엉망이 되면 <b>Write Changes 를 누르지 말고 Revert Changes</b> 를 누르거나, cafe.db 를 다시 받으면 처음 상태예요.',
    outTable: true, // 결과를 표로(파이썬 문제의 출력은 그대로 글자)
    setupLabel: '준비 SQL — 먼저 Execute SQL 탭에서 실행하세요(이 문제에 필요한 표를 만들어요. 이미 했으면 건너뛰기)', fileExt: '.sql', answerLabel: '예시 답(SQL)', answerLabelBy: { S13: '예시 답(파이썬)' }, needsLabel: '필요한 문법', checkLabel: '확인 쿼리 — 다 했으면 이걸 실행해 보세요', outLabel: '결과', pyLabel: '실행 결과',
    prereq: [
      { lessons: ['S0', 'S1'], chapters: [1], ref: 'SETUP/0', btn: '시작하기 1 · DB Browser 설치 보기',
        title: '먼저 꼭! 「🛠 시작하기」 1~2 — DB Browser for SQLite 설치 · cafe.db 받아서 열기',
        html: '이 교과서의 모든 예제와 문제는 <b>내 컴퓨터의 DB Browser for SQLite</b> 에서 <b>cafe.db</b>(동네 카페 연습 데이터)를 열어 놓고 해요. 확인: DB Browser 왼쪽 위 창 제목에 <code>cafe.db</code> 가 보이고, <b>Database Structure</b> 탭에 표 6개(menu · customers · orders · order_items · staff · shifts)가 있으면 준비 끝.' },
      { lessons: ['S8', 'S9', 'S12', 'SB3'], chapters: [3], ref: 'S8/0', btn: '레슨 8 · Write Changes 설명 보기',
        title: '데이터를 바꾸는 SQL 은 「Write Changes」 를 눌러야 파일에 저장돼요',
        html: 'DB Browser 는 INSERT·UPDATE·DELETE·CREATE 를 실행해도 <b>바로 파일에 쓰지 않아요</b>. <b>Write Changes</b>(<kbd>Ctrl</kbd>+<kbd>S</kbd>)를 눌러야 저장되고, 안 누르고 끄면 묻는 창이 떠요. 반대로 실수했으면 <b>Revert Changes</b> 로 마지막 저장 상태로 돌아가요. 파이썬(레슨 13)에서 같은 파일을 열 때도 Write Changes 를 먼저 해야 바뀐 내용이 보여요.' },
      { lessons: ['S13', 'SB3'], ref: 'S13/0', btn: '레슨 13 1쪽 · 파이썬 준비 보기',
        title: '레슨 13 은 파이썬이 필요해요 — 파이썬 교과서 「시작하기」 1~3',
        html: '<code>import sqlite3</code> 는 파이썬에 들어 있어서 따로 설치할 건 없지만, <b>VS Code 에서 파이썬이 실행돼야</b> 해요. 그리고 <code>cafe.db</code> 를 <b>.py 파일과 같은 폴더</b>에 두세요. DB Browser 에서 그 파일을 열어 둔 채 바꾼 게 있으면 Write Changes 를 먼저.' },
    ],
  },
  setup: {
    title: '시작하기: DB Browser for SQLite 설치하고 cafe.db 열기',
    pages: [
      { title: '1. DB Browser for SQLite 설치하기 (Windows)', html: `<p><b>SQLite</b> 는 데이터베이스가 <b>파일 하나</b>(<code>.db</code>)에 들어가는 가벼운 데이터베이스예요. 서버를 따로 켤 필요가 없어서 배우기 좋아요. 그 파일을 열고 SQL 을 실행하는 프로그램이 <b>DB Browser for SQLite</b>(무료)예요.</p>
<div class="bk-step-box"><b>① 받기</b><br>브라우저로 <a href="https://sqlitebrowser.org/dl/" target="_blank" rel="noopener">sqlitebrowser.org/dl</a> → <b>Windows</b> 부분의 <b>「DB Browser for SQLite - Standard installer for 64-bit Windows」</b>(<code>.msi</code>, 3.13.x)를 받아요.</div>
<div class="bk-step-box"><b>② 설치</b><ul><li>받은 <code>.msi</code> 더블클릭 → Welcome 화면 <b>Next</b></li><li>License 화면 → <b>I accept the terms in the License Agreement</b> 체크 → <b>Next</b></li><li><b>Shortcuts</b> 화면 → <b>DB Browser (SQLite)</b> 줄의 <b>Desktop</b>·<b>Program Menu</b> 를 체크(바탕화면·시작 메뉴 아이콘). <b>DB Browser (SQLCipher)</b> 는 암호화 DB 용이라 안 써도 돼요 → <b>Next</b></li><li>설치 폴더 그대로 → <b>Next</b> → <b>Install</b> → 「이 앱이 디바이스를 변경…」 <b>예</b> → <b>Finish</b></li></ul></div>
<div class="bk-step-box"><b>③ 확인</b><br>시작 메뉴 → <b>DB Browser (SQLite)</b>. 창 위에 <b>New Database · Open Database · Write Changes · Revert Changes</b> 버튼과, 가운데 <b>Database Structure · Browse Data · Edit Pragmas · Execute SQL</b> 탭이 보이면 성공이에요.</div>
<p class="muted small">화면이 한국어로 나오면 그대로 써도 돼요(탭 이름이 「데이터베이스 구조 · 데이터 보기 · Pragma 수정 · SQL 실행」 처럼 보여요). 이 교과서의 영어 이름과 맞추려면 메뉴 <b>Edit → Preferences</b> → <b>General</b> 탭 → <b>Language</b> 를 English 로 → OK → 프로그램 다시 켜기. Mac 은 같은 페이지의 macOS 용(.dmg)을 받거나 <code>brew install --cask db-browser-for-sqlite</code>.</p>` },
      { title: '2. 연습 DB cafe.db 받아서 열기', html: `<p>모든 예제는 <b>동네 카페</b> 데이터예요. 표 6개: <code>menu</code>(메뉴 10) · <code>customers</code>(손님 8) · <code>orders</code>(주문 30) · <code>order_items</code>(주문 상세 60) · <code>staff</code>(직원 4) · <code>shifts</code>(근무 12).</p>
<div class="bk-step-box"><b>① 받기</b><br><a href="cafe.db" download="cafe.db"><b>⬇ cafe.db 내려받기</b></a> → 다운로드 폴더에 생긴 <code>cafe.db</code> 를 공부 폴더(예: <code>문서\\sql-study</code>)로 옮겨요.</div>
<div class="bk-step-box"><b>② 열기</b><br>DB Browser → <b>Open Database</b>(<kbd>Ctrl</kbd>+<kbd>O</kbd>) → <code>cafe.db</code> → 열기. <b>Database Structure</b> 탭에 표 6개가 보여요. <b>Browse Data</b> 탭 → Table 칸에서 <code>menu</code> 를 고르면 표 내용이 보여요.</div>
<div class="bk-step-box"><b>③ 처음 상태로 되돌리고 싶을 때</b><br>문제를 풀다 데이터를 망쳤으면 ①에서 다시 받아 덮어쓰면 끝. 또는 아래 「SQL 로 만들기」.</div>
<details class="lp-more"><summary>내려받기가 안 되면: SQL 로 직접 만들기</summary><p>DB Browser → <b>New Database</b> → 파일 이름 <code>cafe.db</code> → 저장 → (표 만들기 창이 뜨면 <b>Cancel</b>) → <b>Execute SQL</b> 탭에 아래 상자 전체를 붙여 넣고 ▶ 실행 → <b>Write Changes</b>.</p></details>`, example: { code: CAFE_SQL, label: 'cafe.db 를 만드는 SQL 전체 — 새 DB 의 Execute SQL 탭에 붙여 넣고 ▶ → Write Changes' } },
      { title: '3. Execute SQL 탭 쓰는 법', html: `<p>이 교과서는 거의 <b>Execute SQL</b> 탭에서 해요.</p>
<table class="kb"><tbody><tr><td>위 칸(SQL 편집기)</td><td>SQL 을 쓰는 곳. 레슨 예제를 📋 복사해서 붙여 넣어요</td></tr><tr><td>▶ <b>Execute all/selected SQL</b> · <kbd>Ctrl</kbd>+<kbd>Enter</kbd> · <kbd>F5</kbd></td><td>전부 실행. 일부를 마우스로 고르고 누르면 고른 것만</td></tr><tr><td><b>Execute current line</b> · <kbd>Shift</kbd>+<kbd>F5</kbd></td><td>커서가 있는 문장 하나만 — 여러 쿼리를 써 두고 하나씩 돌릴 때</td></tr><tr><td>가운데 결과 표</td><td>SELECT 결과. 「만들어 보기」 의 「결과」 와 비교해요</td></tr><tr><td>아래 메시지 칸</td><td><code>Execution finished without errors. Result: 10 rows returned in 3ms</code> — 몇 행 나왔는지, 에러면 빨간 글로 이유</td></tr></tbody></table>
<div class="bk-warn"><b>Write Changes</b> — 데이터를 <b>바꾸는</b> SQL(INSERT·UPDATE·DELETE·CREATE, 챕터 3)은 실행만 하면 아직 파일에 안 써져요. <b>Write Changes</b>(<kbd>Ctrl</kbd>+<kbd>S</kbd>)를 눌러야 저장돼요. 실수했으면 <b>Revert Changes</b>. SELECT(읽기)만 할 때는 신경 안 써도 돼요.</div>
<p>SQL 끝의 <code>;</code>(세미콜론)은 문장의 끝 표시예요. 한 문장만 실행할 땐 없어도 되지만, 여러 문장을 한 번에 실행하려면 문장마다 붙여요.</p>` },
      { title: '4. 이 교과서 쓰는 법', html: `<ul><li><b>레슨</b> — SQL 문법 설명과 예제. 예제는 📋 복사 → Execute SQL 탭에 붙여 넣고 ▶.</li><li><b>🛠 만들어 보기</b> — 문장으로 된 문제. 직접 쿼리를 써서 실행하고 「결과」 표와 비교해요. 행 순서까지 같아야 하는 문제는 문제에 「순서대로」 라고 적혀 있어요.</li><li><b>필요한 문법</b> — 그 문제에 쓰는 SQL 과 설명 쪽 링크(갔다가 「← 돌아가기」).</li><li><b>📚 문법 도감</b> — 배운 SQL 을 한곳에. 실전은 오픈북이에요.</li><li>챕터 3(데이터 바꾸기)부터는 <b>Write Changes</b> 를 기억하고, 망쳤으면 cafe.db 를 다시 받아요.</li><li>레슨 13 은 파이썬에서 같은 cafe.db 를 다뤄요(파이썬 교과서와 연결).</li></ul><p>채점·점수·잠금은 없어요.</p>` },
    ],
  },
  pages: {},
  titles: {},
  lessonPages: {
    SB1: [], SB2: [], SB3: [], // 보스는 「만들어 보기」 만(content.js 의 「준비 중」 안내 쪽 대신)
    S0: [
      { title: '데이터베이스란', html: `<p>카페를 운영한다고 해 봐요. 메뉴·손님·주문·직원·근무표… 처음엔 엑셀에 적겠지만 곧 한계가 와요. 두 사람이 동시에 고치면 꼬이고, 「이 손님이 지난달에 뭘 샀더라?」 를 찾으려면 시트 여러 개를 뒤져야 해요.</p>
<p><b>데이터베이스</b>는 데이터를 <b>표(테이블) 여러 개</b>로 정리해 두고 <b>SQL</b> 이라는 말로 질문해서 꺼내 쓰는 창고예요. 은행·쇼핑몰·앱의 거의 모든 데이터가 이렇게 저장돼요.</p>
<table class="kb"><tbody><tr><td>엑셀</td><td>사람이 눈으로 보고 손으로 고치기 좋음</td></tr><tr><td>데이터베이스</td><td>표끼리 <b>연결</b>(주문 → 손님), 수백만 행도 빠르게, 여러 사람·프로그램이 동시에, <b>SQL 로 질문</b></td></tr></tbody></table>
<p>먼저 메뉴 표 전체를 봐요. 시작하기 2 처럼 cafe.db 를 열고 Execute SQL 탭에서 실행하세요. <code>*</code> 는 「모든 열」 이에요.</p>`, example: { code: 'SELECT * FROM menu;' } },
      { title: '표 · 행 · 열 · 기본 키', html: `<p>방금 본 결과가 <b>테이블</b> <code>menu</code> 예요. 표는 두 방향으로 읽어요.</p>
<ul><li><b>행</b>(row): 가로 한 줄 = 데이터 <b>한 건</b>. 「아메리카노, 커피, 4000」 이 한 행. menu 에는 10행</li><li><b>열</b>(column): 세로 한 줄 = <b>항목</b>. <code>id</code>·<code>name</code>·<code>category</code>·<code>price</code>·<code>is_hot</code></li><li><b>기본 키</b>(primary key): 행마다 겹치지 않는 번호 <code>id</code>. 이름이 같아도 id 로 구별해요</li></ul>
<pre class="code">menu         (id, name, category, price, is_hot)
customers    (id, name, phone, joined_at, grade)
staff        (id, name, role, hourly_wage, hired_at)
orders       (id, customer_id, staff_id, ordered_at, total)
order_items  (id, order_id, menu_id, qty)
shifts       (id, staff_id, work_date, start_hour, end_hour)</pre>
<p><code>orders.customer_id</code> 는 「몇 번 손님의 주문인가」 — customers 의 id 를 가리켜요(<b>외래 키</b>, 챕터 2). DB Browser 의 <b>Database Structure</b> 탭에서 표마다 ▶ 를 펴면 열 이름과 자료형이 보여요.</p>`, example: { code: 'SELECT name, price FROM menu;' } },
      { title: '첫 SELECT 문', html: `<pre class="code">SELECT 열이름, 열이름
FROM 표이름;</pre>
<p>「menu 표에서 name 과 price 열을 보여 줘」 = <code>SELECT name, price FROM menu;</code></p>
<ul><li>열 순서는 내가 쓴 순서대로 나와요</li><li><code>SELECT</code>·<code>FROM</code> 같은 SQL 단어는 대소문자를 안 가려요(<code>select</code> 도 됨). 관례상 대문자로 써서 눈에 띄게 해요</li><li>줄바꿈·띄어쓰기는 자유. 길어지면 절마다 줄을 바꿔요</li><li>틀리면 메시지 칸에 이유가 나와요: <code>no such column: nmae</code>(열 이름 오타) · <code>no such table: menus</code>(표 이름 오타)</li></ul>
<p>조건을 붙이면 행을 골라요(다음 레슨): 커피만 보기 ↓</p>`, example: { code: "SELECT name, price\nFROM menu\nWHERE category = '커피';" } },
    ],
    S1: [
      { title: 'WHERE: 행 고르기와 비교', html: `<pre class="code">SELECT 열 FROM 표 WHERE 조건;</pre>
<p><code>WHERE</code> 는 조건이 참인 <b>행만</b> 남겨요.</p>
<table class="kb"><tbody><tr><td><code>=</code> · <code>&lt;&gt;</code>(또는 <code>!=</code>)</td><td>같다 · 다르다 (파이썬과 달리 같다는 <code>=</code> 하나)</td></tr><tr><td><code>&gt;</code> <code>&lt;</code> <code>&gt;=</code> <code>&lt;=</code></td><td>크다 · 작다 · 이상 · 이하</td></tr><tr><td><code>'커피'</code></td><td>글자는 <b>작은따옴표</b>. 숫자는 따옴표 없이</td></tr></tbody></table>
<pre class="code">SELECT name, price FROM menu WHERE price &gt;= 5000;</pre>
<p>날짜도 <code>'2026-10-01'</code> 같은 글자로 저장돼 있어서, 같은 모양이면 크기 비교가 돼요: <code>WHERE ordered_at &gt;= '2026-10-01'</code>.</p>`, example: { code: 'SELECT name, price FROM menu WHERE price >= 5000;' } },
      { title: 'AND · OR · NOT · 괄호', html: `<table class="kb"><tbody><tr><td><code>A AND B</code></td><td>둘 다 참</td></tr><tr><td><code>A OR B</code></td><td>하나라도 참</td></tr><tr><td><code>NOT A</code></td><td>반대</td></tr></tbody></table>
<pre class="code">SELECT name, price FROM menu
WHERE category = '커피' AND price &lt;= 4500;</pre>
<p>AND 와 OR 를 섞으면 <b>AND 가 먼저</b> 계산돼요. 헷갈리면 <b>괄호</b>:</p>
<pre class="code">WHERE (category = '커피' OR category = '음료') AND price &gt;= 5000</pre>
<p>괄호가 없으면 「커피 전부 + 5000원 이상인 음료」 가 돼서 결과가 달라져요.</p>`, example: { code: "SELECT name, category, price FROM menu\nWHERE (category = '커피' OR category = '음료') AND price >= 5000;" } },
      { title: 'IN · BETWEEN · LIKE', html: `<table class="kb"><tbody><tr><td><code>category IN ('커피', '음료')</code></td><td>목록 중 하나 = <code>OR</code> 여러 개를 짧게</td></tr><tr><td><code>price BETWEEN 4000 AND 5000</code></td><td>4000 이상 5000 <b>이하</b>(양끝 포함)</td></tr><tr><td><code>name LIKE '%라테'</code></td><td>모양으로 찾기: <code>%</code> = 아무 글자 몇 개든, <code>_</code> = 아무 글자 딱 하나</td></tr><tr><td><code>name LIKE '%라%'</code></td><td>「라」 가 들어 있는</td></tr><tr><td><code>NOT IN</code> · <code>NOT LIKE</code></td><td>반대</td></tr></tbody></table>
<p>SQLite 의 LIKE 는 영어 대소문자를 안 가려요(<code>'a%'</code> 가 Apple 도 찾음).</p>`, example: { code: "SELECT name, price FROM menu WHERE name LIKE '%라테';\nSELECT name FROM menu WHERE price BETWEEN 4000 AND 4500;" } },
    ],
    S2: [
      { title: 'ORDER BY 와 LIMIT', html: `<table class="kb"><tbody><tr><td><code>ORDER BY price</code></td><td>price 가 작은 것부터(ASC, 기본)</td></tr><tr><td><code>ORDER BY price DESC</code></td><td>큰 것부터</td></tr><tr><td><code>ORDER BY category, price DESC</code></td><td>category 순으로, 같으면 price 큰 순</td></tr><tr><td><code>LIMIT 3</code></td><td>위에서 3행만 — 「TOP 3」</td></tr><tr><td><code>LIMIT 3 OFFSET 3</code></td><td>3행 건너뛰고 3행(4~6등, 쪽 나누기)</td></tr></tbody></table>
<p>절의 순서는 늘 <code>SELECT → FROM → WHERE → ORDER BY → LIMIT</code>. 순서가 바뀌면 <code>near "WHERE": syntax error</code>.</p>
<p><b>ORDER BY 가 없으면 행 순서는 보장되지 않아요.</b> 순서가 중요하면 꼭 씁니다.</p>`, example: { code: 'SELECT name, price FROM menu ORDER BY price DESC LIMIT 3;' } },
      { title: '계산 열 · AS · DISTINCT', html: `<table class="kb"><tbody><tr><td><code>price * 2</code></td><td>열로 계산(<code>+ - * /</code>). 정수끼리 <code>/</code> 는 몫만(<code>7 / 2</code> = 3) — 소수가 필요하면 <code>7 / 2.0</code></td></tr><tr><td><code>price * 1.1 AS 부가세포함</code></td><td><code>AS</code> 로 결과 열에 <b>별명</b></td></tr><tr><td><code>ROUND(x, 1)</code></td><td>소수 첫째 자리까지 반올림</td></tr><tr><td><code>SELECT DISTINCT category</code></td><td>겹치는 행은 하나만 — 「어떤 종류가 있나」</td></tr><tr><td><code>name || ' (' || category || ')'</code></td><td>글자 이어 붙이기는 <code>||</code></td></tr></tbody></table>`, example: { code: "SELECT name, price, price * 2 AS 두잔 FROM menu;\nSELECT DISTINCT category FROM menu;" } },
      { title: 'NULL: 값이 없음', html: `<p><code>NULL</code> 은 0 도 빈 글자도 아닌 「<b>모름 · 없음</b>」 이에요. 이서연 손님의 <code>phone</code>, 비회원 주문의 <code>customer_id</code> 가 NULL 이에요(DB Browser 에서는 흐린 <i>NULL</i> 로 보여요).</p>
<table class="kb"><tbody><tr><td><code>WHERE phone IS NULL</code></td><td>없는 행 찾기 — <b><code>= NULL</code> 로는 절대 안 찾아져요</b>(결과 0행)</td></tr><tr><td><code>WHERE phone IS NOT NULL</code></td><td>있는 행</td></tr><tr><td><code>COALESCE(phone, '없음')</code></td><td>NULL 이면 대신 쓸 값</td></tr></tbody></table>
<p>NULL 과 계산하면 결과도 NULL(<code>NULL + 1</code> = NULL), 비교도 참·거짓이 아니라 「모름」 이라 WHERE 에서 빠져요. 그래서 NULL 은 늘 <code>IS</code> 로.</p>`, example: { code: "SELECT name, phone FROM customers WHERE phone IS NULL;\nSELECT name, COALESCE(phone, '없음') AS 연락처 FROM customers;" } },
    ],
    S3: [
      { title: '집계 함수: COUNT · SUM · AVG · MIN · MAX', html: `<p>여러 행을 <b>하나의 값</b>으로 요약해요.</p>
<table class="kb"><tbody><tr><td><code>COUNT(*)</code></td><td>행 개수</td></tr><tr><td><code>COUNT(phone)</code></td><td>phone 이 NULL 이 <b>아닌</b> 행 개수 — <code>COUNT(*)</code> 와 다를 수 있어요</td></tr><tr><td><code>SUM(total)</code> · <code>AVG(total)</code></td><td>합계 · 평균</td></tr><tr><td><code>MIN(price)</code> · <code>MAX(price)</code></td><td>가장 작은 · 큰 값</td></tr></tbody></table>
<pre class="code">SELECT COUNT(*) AS 주문수, SUM(total) AS 매출, AVG(total) AS 평균
FROM orders WHERE ordered_at &gt;= '2026-10-01';</pre>
<p>WHERE 로 먼저 행을 고른 뒤 남은 행으로 집계해요.</p>`, example: { code: "SELECT COUNT(*) AS 주문수, SUM(total) AS 매출 FROM orders;\nSELECT COUNT(*), COUNT(phone) FROM customers;" } },
      { title: 'GROUP BY: 묶어서 집계', html: `<p>「종류별 메뉴 수」 「손님별 주문 횟수」 처럼 <b>무리마다</b> 집계하려면 <code>GROUP BY</code>.</p>
<pre class="code">SELECT category, COUNT(*) AS 메뉴수, AVG(price) AS 평균가
FROM menu
GROUP BY category;</pre>
<p>같은 category 끼리 한 묶음이 되고, 묶음마다 한 행이 나와요. <b>SELECT 에는 묶은 열(category)과 집계 함수만</b> 쓰는 게 규칙이에요(묶음 안에 name 이 여러 개라 무엇을 보여 줄지 정할 수 없어서). 다른 DB 는 이걸 어기면 에러를 내지만, <b>SQLite 는 에러 없이 묶음 안의 아무 행 값이나 보여 줘요</b> — 결과가 나왔다고 맞은 게 아니니 주의.</p>
<p>여러 열로도 묶어요: <code>GROUP BY category, is_hot</code>.</p>`, example: { code: 'SELECT category, COUNT(*) AS 메뉴수, AVG(price) AS 평균가\nFROM menu\nGROUP BY category;' } },
      { title: 'HAVING: 묶음에 조건', html: `<table class="kb"><tbody><tr><td><code>WHERE</code></td><td>묶기 <b>전</b>, <b>행</b>에 거는 조건</td></tr><tr><td><code>HAVING</code></td><td>묶은 <b>뒤</b>, <b>묶음(집계 결과)</b>에 거는 조건</td></tr></tbody></table>
<pre class="code">SELECT customer_id, COUNT(*) AS 횟수
FROM orders
WHERE customer_id IS NOT NULL     ← 비회원 주문은 빼고(행 조건)
GROUP BY customer_id
HAVING COUNT(*) &gt;= 4              ← 4번 이상 온 손님만(묶음 조건)
ORDER BY 횟수 DESC;</pre>
<p>전체 순서: <code>SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY → LIMIT</code>.</p>`, example: { code: 'SELECT customer_id, COUNT(*) AS 횟수\nFROM orders\nWHERE customer_id IS NOT NULL\nGROUP BY customer_id\nHAVING COUNT(*) >= 4\nORDER BY 횟수 DESC;' } },
    ],
    S4: [
      { title: '표를 왜 나눌까', html: `<p>주문마다 손님 이름·전화번호를 다 적으면, 손님이 번호를 바꿀 때 주문 수십 행을 다 고쳐야 해요. 그래서 손님 정보는 <code>customers</code> 에 <b>한 번만</b> 적고, 주문에는 손님 <b>번호</b>(<code>customer_id</code>)만 적어요.</p>
<pre class="code">orders.customer_id  ──가리킴──▶  customers.id
order_items.order_id ──────────▶  orders.id
order_items.menu_id  ──────────▶  menu.id</pre>
<p>이렇게 다른 표의 기본 키를 가리키는 열이 <b>외래 키</b>(foreign key)예요. 대신 「주문한 손님의 <b>이름</b>」 을 보려면 두 표를 <b>합쳐야</b> 해요 → <code>JOIN</code>.</p>` },
      { title: 'INNER JOIN … ON', html: `<pre class="code">SELECT orders.id, customers.name, orders.total
FROM orders
JOIN customers ON orders.customer_id = customers.id;</pre>
<p>「orders 의 각 행에, customer_id 와 id 가 같은 customers 행을 옆에 붙여라」. <code>JOIN</code> = <code>INNER JOIN</code> — <b>짝이 있는 행만</b> 남아요(비회원 주문은 짝이 없어 빠져요).</p>
<ul><li>두 표에 같은 이름의 열(<code>id</code>, <code>name</code>)이 있으면 <code>표이름.열이름</code> 으로 구별. 안 하면 <code>ambiguous column name: id</code></li><li><b>별명</b>으로 짧게: <code>FROM orders AS o JOIN customers AS c ON o.customer_id = c.id</code> (<code>AS</code> 는 빼도 돼요)</li></ul>`, example: { code: 'SELECT o.id, c.name, o.total\nFROM orders o\nJOIN customers c ON o.customer_id = c.id\nORDER BY o.id\nLIMIT 5;' } },
      { title: 'JOIN 한 뒤 WHERE · GROUP BY', html: `<p>JOIN 으로 합친 결과는 그냥 하나의 큰 표처럼 다뤄요. 거기에 WHERE·GROUP BY·ORDER BY 를 그대로 붙여요.</p>
<pre class="code">SELECT c.name, COUNT(*) AS 주문수, SUM(o.total) AS 합계
FROM orders o
JOIN customers c ON o.customer_id = c.id
WHERE c.grade = '단골'
GROUP BY c.name
ORDER BY 합계 DESC;</pre>
<p>쿼리를 읽는 순서: <b>FROM·JOIN</b>(어떤 표를 합쳐서) → <b>WHERE</b>(어떤 행을) → <b>GROUP BY</b>(어떻게 묶어) → <b>SELECT</b>(무엇을 보여 줄지) → <b>ORDER BY</b>.</p>`, example: { code: "SELECT c.name, COUNT(*) AS 주문수, SUM(o.total) AS 합계\nFROM orders o\nJOIN customers c ON o.customer_id = c.id\nWHERE c.grade = '단골'\nGROUP BY c.name\nORDER BY 합계 DESC;" } },
    ],
    S5: [
      { title: 'LEFT JOIN: 짝이 없어도 남기기', html: `<p><code>LEFT JOIN</code> 은 <b>왼쪽 표(FROM 쪽)의 행은 전부</b> 남기고, 짝이 없으면 오른쪽 열을 NULL 로 채워요.</p>
<pre class="code">SELECT o.id, c.name
FROM orders o
LEFT JOIN customers c ON o.customer_id = c.id;
-- 비회원 주문(customer_id 가 NULL)도 나오고 name 은 NULL</pre>
<p>「짝이 <b>없는</b> 것 찾기」 공식: LEFT JOIN 하고 오른쪽 키가 NULL 인 행만.</p>
<pre class="code">SELECT s.name
FROM staff s
LEFT JOIN shifts sh ON sh.staff_id = s.id AND sh.work_date &gt;= '2026-10-01'
WHERE sh.id IS NULL;      -- 10월에 근무가 하나도 없는 직원</pre>`, example: { code: "SELECT o.id, COALESCE(c.name, '비회원') AS 손님\nFROM orders o\nLEFT JOIN customers c ON o.customer_id = c.id\nORDER BY o.id\nLIMIT 5;" } },
      { title: '세 표 이상 잇기', html: `<p>JOIN 은 줄줄이 이어 붙여요. 「주문 상세마다 메뉴 이름과 주문 날짜」:</p>
<pre class="code">SELECT o.ordered_at, m.name, oi.qty
FROM order_items oi
JOIN orders o ON oi.order_id = o.id
JOIN menu   m ON oi.menu_id = m.id;</pre>
<p>「메뉴별로 몇 잔 팔렸나」 = 여기에 GROUP BY:</p>
<pre class="code">SELECT m.name, SUM(oi.qty) AS 판매수량
FROM order_items oi
JOIN menu m ON oi.menu_id = m.id
GROUP BY m.name
ORDER BY 판매수량 DESC;</pre>
<p>표가 많아질수록 별명(<code>oi</code> <code>o</code> <code>m</code>)이 읽기를 살려 줘요.</p>`, example: { code: 'SELECT m.name, SUM(oi.qty) AS 판매수량\nFROM order_items oi\nJOIN menu m ON oi.menu_id = m.id\nGROUP BY m.name\nORDER BY 판매수량 DESC;' } },
      { title: '같은 표 두 번: 셀프 조인', html: `<p>한 표 안의 행끼리 비교할 때 같은 표를 <b>별명 두 개</b>로 불러요.</p>
<pre class="code">-- 같은 종류에서 나보다 비싼 메뉴 짝
SELECT a.name AS 메뉴, b.name AS 더비싼메뉴
FROM menu a
JOIN menu b ON a.category = b.category AND b.price &gt; a.price
WHERE a.name = '아메리카노';</pre>
<p>별명이 없으면 어느 쪽 menu 인지 구별할 수 없어요. 「같은 날 일한 직원 짝」 「같은 손님의 앞뒤 주문」 같은 질문에 써요.</p>`, example: { code: "SELECT a.name AS 메뉴, b.name AS 더비싼메뉴, b.price\nFROM menu a\nJOIN menu b ON a.category = b.category AND b.price > a.price\nWHERE a.name = '아메리카노';" } },
    ],
    S6: [
      { title: '서브쿼리: 쿼리 안의 쿼리', html: `<p>괄호 안에 SELECT 를 넣으면 그 결과를 값처럼 써요.</p>
<pre class="code">-- 평균보다 비싼 메뉴
SELECT name, price FROM menu
WHERE price &gt; (SELECT AVG(price) FROM menu);</pre>
<table class="kb"><tbody><tr><td><code>(SELECT AVG(price) FROM menu)</code></td><td>값 <b>하나</b>를 내는 서브쿼리 → 비교에</td></tr><tr><td><code>WHERE id IN (SELECT customer_id FROM orders …)</code></td><td>값 <b>목록</b>을 내는 서브쿼리 → IN 에</td></tr><tr><td><code>FROM (SELECT …) AS t</code></td><td>결과 <b>표</b>를 내는 서브쿼리 → 표처럼</td></tr></tbody></table>
<p>안쪽 쿼리만 골라(마우스로) 실행해 보면 무엇을 내는지 확인할 수 있어요.</p>`, example: { code: 'SELECT name, price FROM menu\nWHERE price > (SELECT AVG(price) FROM menu);' } },
      { title: 'WITH: 이름 붙여 읽기 쉽게', html: `<p>서브쿼리가 길어지면 <code>WITH 이름 AS (…)</code> 로 <b>먼저 이름을 붙여</b> 두고 아래에서 표처럼 써요(CTE).</p>
<pre class="code">WITH 손님별 AS (
  SELECT customer_id, COUNT(*) AS 횟수, SUM(total) AS 합계
  FROM orders
  WHERE customer_id IS NOT NULL
  GROUP BY customer_id
)
SELECT c.name, 손님별.횟수, 손님별.합계
FROM 손님별 JOIN customers c ON c.id = 손님별.customer_id
ORDER BY 손님별.합계 DESC;</pre>
<p>「① 손님별로 요약하고 ② 이름을 붙인다」 처럼 생각 순서대로 써져서 읽기 쉬워요. 이름을 여러 개 이어도 돼요: <code>WITH a AS (…), b AS (…)</code>.</p>`, example: { code: 'WITH 손님별 AS (\n  SELECT customer_id, COUNT(*) AS 횟수, SUM(total) AS 합계\n  FROM orders\n  WHERE customer_id IS NOT NULL\n  GROUP BY customer_id\n)\nSELECT c.name, 손님별.횟수, 손님별.합계\nFROM 손님별 JOIN customers c ON c.id = 손님별.customer_id\nORDER BY 손님별.합계 DESC;' } },
      { title: 'EXISTS · NOT EXISTS', html: `<p>「~ 한 적이 있는」 「~ 한 적이 없는」 을 묻는 가장 정확한 방법.</p>
<pre class="code">-- 치즈케이크를 한 번이라도 산 손님
SELECT c.name FROM customers c
WHERE EXISTS (
  SELECT 1 FROM orders o
  JOIN order_items oi ON oi.order_id = o.id
  WHERE o.customer_id = c.id AND oi.menu_id = 10
);</pre>
<p>바깥 행(<code>c</code>)마다 안쪽 쿼리가 <b>한 행이라도</b> 있으면 참. <code>SELECT 1</code> 은 「있기만 하면 됨」 이라는 뜻의 관례예요. <code>NOT EXISTS</code> 는 반대 — LEFT JOIN + IS NULL 과 같은 질문을 더 또렷하게 써요.</p>`, example: { code: 'SELECT c.name FROM customers c\nWHERE EXISTS (\n  SELECT 1 FROM orders o\n  JOIN order_items oi ON oi.order_id = o.id\n  WHERE o.customer_id = c.id AND oi.menu_id = 10\n);' } },
    ],
    S7: [
      { title: 'CASE: 값을 분류하기', html: `<pre class="code">CASE
  WHEN 조건1 THEN 값1
  WHEN 조건2 THEN 값2
  ELSE 그밖의 값
END</pre>
<p>위에서부터 처음 참인 WHEN 의 값. 파이썬의 <code>if · elif · else</code> 와 같아요.</p>
<pre class="code">SELECT name, price,
  CASE WHEN price &gt;= 5000 THEN '비쌈'
       WHEN price &gt;= 4500 THEN '보통'
       ELSE '저렴' END AS 가격대
FROM menu;</pre>
<p>집계 안에도 써요 — 「조건에 맞는 것만 세기」: <code>SUM(CASE WHEN is_hot = 1 THEN 1 ELSE 0 END)</code>.</p>`, example: { code: "SELECT name, price,\n  CASE WHEN price >= 5000 THEN '비쌈'\n       WHEN price >= 4500 THEN '보통'\n       ELSE '저렴' END AS 가격대\nFROM menu;" } },
      { title: '날짜 다루기: substr · strftime', html: `<p>SQLite 는 날짜를 <code>'2026-10-08 12:30'</code> 같은 <b>글자</b>로 저장해요. 그래서 글자를 잘라 월·시간을 뽑아요.</p>
<table class="kb"><tbody><tr><td><code>substr(ordered_at, 1, 7)</code></td><td>1번째 글자부터 7글자 → <code>'2026-10'</code>(월)</td></tr><tr><td><code>substr(ordered_at, 12, 2)</code></td><td>12번째부터 2글자 → <code>'12'</code>(시)</td></tr><tr><td><code>strftime('%m', ordered_at)</code></td><td>날짜 함수로 월 → <code>'10'</code>. <code>%Y</code> 연 <code>%d</code> 일 <code>%H</code> 시 <code>%w</code> 요일(0=일요일)</td></tr><tr><td><code>date('2026-10-08', '+7 days')</code></td><td>날짜 계산 → <code>'2026-10-15'</code></td></tr><tr><td><code>julianday(b) - julianday(a)</code></td><td>두 날짜 사이 날 수</td></tr></tbody></table>`, example: { code: "SELECT substr(ordered_at, 1, 7) AS 월, COUNT(*) AS 주문수, SUM(total) AS 매출\nFROM orders\nGROUP BY 월\nORDER BY 월;" } },
      { title: '글자 함수', html: `<table class="kb"><tbody><tr><td><code>length(name)</code></td><td>글자 수</td></tr><tr><td><code>upper(x)</code> · <code>lower(x)</code></td><td>영어 대문자 · 소문자</td></tr><tr><td><code>a || b</code></td><td>이어 붙이기</td></tr><tr><td><code>replace(phone, '-', '')</code></td><td>바꾸기 → <code>01011112222</code></td></tr><tr><td><code>substr(name, 1, 1)</code></td><td>앞 한 글자(성)</td></tr><tr><td><code>trim(x)</code></td><td>앞뒤 공백 지우기</td></tr><tr><td><code>printf('%,d', total)</code></td><td>천 단위 쉼표 → <code>24,400</code></td></tr></tbody></table>`, example: { code: "SELECT name, substr(name, 1, 1) AS 성, replace(phone, '-', '') AS 번호\nFROM customers;" } },
    ],
    S8: [
      { title: 'INSERT · UPDATE · DELETE', html: `<div class="bk-warn"><b>⚠ 여기서부터는 데이터가 바뀌어요.</b> DB Browser 는 실행해도 파일에 바로 쓰지 않아요 — <b>Write Changes</b>(<kbd>Ctrl</kbd>+<kbd>S</kbd>)로 저장, <b>Revert Changes</b> 로 되돌리기. 연습이 엉망이 되면 cafe.db 를 다시 받으면 돼요(시작하기 2).</div>
<table class="kb"><tbody><tr><td><code>INSERT INTO menu (name, category, price) VALUES ('흑당라테', '커피', 5500);</code></td><td>행 <b>추가</b>. 적지 않은 열은 기본값(<code>is_hot</code> = 1), <code>id</code> 는 자동으로 다음 번호</td></tr><tr><td><code>UPDATE menu SET price = 4200 WHERE name = '아메리카노';</code></td><td>값 <b>고치기</b>. 여러 열은 <code>SET a = 1, b = 2</code></td></tr><tr><td><code>DELETE FROM menu WHERE id = 11;</code></td><td>행 <b>지우기</b></td></tr></tbody></table>
<p>바꾼 뒤엔 SELECT 로 확인하는 습관. 메시지 칸에 <code>1 rows affected</code>(몇 행이 바뀌었나)도 보여요.</p>`, example: { code: "INSERT INTO menu (name, category, price) VALUES ('흑당라테', '커피', 5500);\nSELECT * FROM menu WHERE name = '흑당라테';" } },
      { title: 'WHERE 를 빠뜨리면', html: `<pre class="code">UPDATE menu SET price = 0;          ← 메뉴 10개 전부 0원!
DELETE FROM orders;                 ← 주문 전부 사라짐!</pre>
<p>UPDATE·DELETE 에서 <b>WHERE 를 빠뜨리면 표 전체</b>가 바뀌어요. 실무에서도 가장 무서운 실수예요. 습관:</p>
<ol><li>먼저 같은 WHERE 로 <b>SELECT</b> 해서 무엇이 걸리는지 본다: <code>SELECT * FROM menu WHERE name = '아메리카노';</code></li><li>결과가 맞으면 SELECT 부분만 UPDATE/DELETE 로 바꾼다</li><li><code>N rows affected</code> 숫자가 예상과 같은지 본다</li><li>맞으면 Write Changes, 아니면 <b>Revert Changes</b></li></ol>`, example: { code: "SELECT * FROM menu WHERE name = '아메리카노';\nUPDATE menu SET price = 4200 WHERE name = '아메리카노';" } },
      { title: '여러 행을 한 번에 · 계산으로 바꾸기', html: `<table class="kb"><tbody><tr><td><code>INSERT INTO t (a, b) VALUES (1, 'x'), (2, 'y');</code></td><td>여러 행 추가</td></tr><tr><td><code>UPDATE menu SET price = price + 300 WHERE category = '커피';</code></td><td>지금 값으로 계산 — 커피 전부 300원 인상</td></tr><tr><td><code>UPDATE customers SET grade = '단골' WHERE id IN (SELECT customer_id FROM orders GROUP BY customer_id HAVING COUNT(*) &gt;= 4);</code></td><td>서브쿼리로 고른 행만</td></tr><tr><td><code>DELETE FROM shifts WHERE work_date &lt; '2026-09-01';</code></td><td>조건으로 여러 행 지우기</td></tr></tbody></table>`, example: { code: "UPDATE menu SET price = price + 300 WHERE category = '커피';\nSELECT name, price FROM menu WHERE category = '커피';" } },
    ],
    S9: [
      { title: 'CREATE TABLE 과 자료형', html: `<pre class="code">CREATE TABLE events (
  id     INTEGER PRIMARY KEY,
  title  TEXT NOT NULL,
  day    TEXT NOT NULL,
  seats  INTEGER DEFAULT 10
);</pre>
<table class="kb"><tbody><tr><td><code>INTEGER</code> · <code>REAL</code> · <code>TEXT</code></td><td>정수 · 실수 · 글자(날짜도 TEXT)</td></tr><tr><td><code>INTEGER PRIMARY KEY</code></td><td>기본 키 — 안 적으면 자동으로 1, 2, 3 …</td></tr><tr><td><code>DROP TABLE events;</code></td><td>표 통째로 지우기(되돌릴 수 없음)</td></tr><tr><td><code>ALTER TABLE events ADD COLUMN place TEXT;</code></td><td>열 추가</td></tr></tbody></table>
<p>DB Browser 에서는 <b>Database Structure</b> 탭 → <b>Create Table</b> 버튼으로 칸을 채워 만들 수도 있어요(아래에 같은 CREATE TABLE 문이 보여요). 만든 뒤 <b>Write Changes</b>.</p>`, example: { code: "CREATE TABLE events (\n  id     INTEGER PRIMARY KEY,\n  title  TEXT NOT NULL,\n  day    TEXT NOT NULL,\n  seats  INTEGER DEFAULT 10\n);\nINSERT INTO events (title, day) VALUES ('라테아트 교실', '2026-11-20');\nSELECT * FROM events;" } },
      { title: '제약 조건: 잘못된 데이터 막기', html: `<table class="kb"><tbody><tr><td><code>NOT NULL</code></td><td>비워 둘 수 없음</td></tr><tr><td><code>UNIQUE</code></td><td>겹칠 수 없음(이메일·전화번호)</td></tr><tr><td><code>DEFAULT 값</code></td><td>안 적으면 이 값</td></tr><tr><td><code>CHECK (price &gt; 0)</code></td><td>조건을 만족해야</td></tr><tr><td><code>REFERENCES customers(id)</code></td><td>외래 키 — 그 표에 있는 id 만</td></tr></tbody></table>
<p>어기면 거절되고 메시지 칸에 이유가 나와요: <code>NOT NULL constraint failed: events.title</code> · <code>UNIQUE constraint failed</code> · <code>CHECK constraint failed</code>.</p>
<p class="muted small">SQLite 는 외래 키 검사가 기본으로 꺼져 있어요. <code>PRAGMA foreign_keys = ON;</code> 을 먼저 실행하면 켜져요(DB Browser 는 <b>Edit Pragmas</b> 탭의 Foreign Keys 칸, 기본으로 켜져 있음).</p>`, example: { code: "CREATE TABLE members (\n  id    INTEGER PRIMARY KEY,\n  email TEXT NOT NULL UNIQUE,\n  age   INTEGER CHECK (age >= 0)\n);\nINSERT INTO members (email, age) VALUES ('a@x.com', 20);\nINSERT INTO members (email, age) VALUES ('a@x.com', 30);" } },
    ],
    S10: [
      { title: '한 표에 다 적으면 생기는 일', html: `<pre class="code">주문번호 | 손님   | 손님전화        | 메뉴들
1        | 김민준 | 010-1111-2222   | 아메리카노, 크루아상
2        | 김민준 | 010-1111-2222   | 카페라테</pre>
<ul><li><b>고치기 사고</b>: 김민준이 번호를 바꾸면 주문 행마다 다 고쳐야 하고, 하나라도 빠뜨리면 번호가 두 개가 돼요</li><li><b>지우기 사고</b>: 주문을 지우면 손님 정보까지 사라져요</li><li><b>한 칸에 여러 값</b>: 「아메리카노, 크루아상」 은 메뉴별로 세거나 찾기가 어려워요</li></ul>
<p>그래서 <b>한 가지 사실은 한 곳에만</b> 적어요 — 손님은 customers, 주문은 orders, 주문 안의 메뉴는 order_items 한 행씩. 이렇게 나누는 일을 <b>정규화</b>라고 해요.</p>` },
      { title: '정규화 맛보기와 ERD', html: `<table class="kb"><tbody><tr><td><b>1정규형</b></td><td>한 칸에 값 <b>하나</b> — 「아메리카노, 크루아상」 대신 order_items 에 두 행</td></tr><tr><td><b>2·3정규형</b>(요약)</td><td>키가 아닌 열은 <b>그 표의 키에만</b> 따라야 함 — 손님 전화는 주문이 아니라 손님에 따름 → customers 로</td></tr></tbody></table>
<p><b>ERD</b>(개체-관계 그림)는 표와 연결을 그린 지도예요. cafe.db:</p>
<pre class="code">customers 1 ───&lt; N orders N &gt;─── 1 staff
                   1
                   │
                   N
              order_items N &gt;─── 1 menu
staff 1 ───&lt; N shifts</pre>
<p><code>1 ───&lt; N</code> = 「하나에 여러 개」(손님 한 명이 주문 여러 개). N 쪽 표가 외래 키를 가져요. DB Browser 의 Database Structure 탭에서 각 표의 CREATE 문을 보면 <code>REFERENCES</code> 로 이 선들이 보여요.</p>` },
    ],
    S11: [
      { title: '인덱스: 책 뒤의 찾아보기', html: `<p>WHERE 로 찾을 때 인덱스가 없으면 SQLite 는 표를 <b>처음부터 끝까지</b> 다 읽어요(SCAN). 행이 수백만이면 느려요. <b>인덱스</b>는 책 뒤 「찾아보기」 처럼 값 → 위치를 정리해 둔 것이라 바로 찾아가요(SEARCH).</p>
<pre class="code">CREATE INDEX idx_orders_customer ON orders(customer_id);
DROP INDEX idx_orders_customer;</pre>
<p>기본 키(<code>id</code>)와 <code>UNIQUE</code> 열은 자동으로 인덱스가 있어요. 자주 WHERE·JOIN 하는 열(외래 키, 날짜)에 만들어요.</p>
<div class="bk-warn">인덱스는 공짜가 아니에요 — 파일이 커지고, INSERT·UPDATE 때마다 인덱스도 고쳐야 해서 <b>쓰기가 느려져요</b>. 「자주 찾는 열」 에만.</div>`, example: { code: 'CREATE INDEX idx_orders_customer ON orders(customer_id);' } },
      { title: 'EXPLAIN QUERY PLAN: 어떻게 찾나 보기', html: `<p>쿼리 앞에 <code>EXPLAIN QUERY PLAN</code> 을 붙이면 SQLite 가 <b>어떻게 찾을지</b> 계획을 보여 줘요.</p>
<pre class="code">EXPLAIN QUERY PLAN
SELECT * FROM orders WHERE customer_id = 3;

인덱스 없음 → SCAN orders
인덱스 있음 → SEARCH orders USING INDEX idx_orders_customer (customer_id=?)</pre>
<p><code>SCAN</code> = 다 읽음, <code>SEARCH … USING INDEX</code> = 인덱스로 바로. 데이터가 30행인 cafe.db 에선 둘 다 순식간이지만, 커지면 차이가 몇 백 배가 돼요. 느린 쿼리를 만나면 먼저 이걸로 SCAN 이 있는지 봐요.</p>`, example: { code: 'EXPLAIN QUERY PLAN\nSELECT * FROM orders WHERE customer_id = 3;' } },
    ],
    S12: [
      { title: '트랜잭션: 전부 되거나 전부 안 되거나', html: `<p>통장 A 에서 B 로 만 원 보내기 = UPDATE 두 번(A −10000, B +10000). 첫 번째만 되고 컴퓨터가 꺼지면 돈이 사라져요. <b>트랜잭션</b>은 여러 문장을 <b>한 덩어리</b>로 묶어 「전부 되거나, 하나도 안 되거나」 를 보장해요.</p>
<pre class="code">BEGIN;
UPDATE accounts SET balance = balance - 10000 WHERE name = 'A';
UPDATE accounts SET balance = balance + 10000 WHERE name = 'B';
COMMIT;      ← 확정
-- 중간에 문제가 생기면
ROLLBACK;    ← BEGIN 전으로 전부 되돌리기</pre>
<div class="bk-warn"><b>DB Browser 에서는 <code>BEGIN</code>·<code>COMMIT</code> 을 직접 치지 마세요.</b> DB Browser 가 이미 트랜잭션을 열어 두고 있어서 <code>cannot start a transaction within a transaction</code> 에러가 나요. DB Browser 에서는 <b>Write Changes = COMMIT</b>, <b>Revert Changes = ROLLBACK</b> 이에요. <code>BEGIN</code> 을 직접 쓰는 건 파이썬(레슨 13)이나 다른 프로그램에서예요.</div>`, example: { code: "CREATE TABLE accounts (name TEXT PRIMARY KEY, balance INTEGER CHECK (balance >= 0));\nINSERT INTO accounts VALUES ('A', 30000), ('B', 5000);\nSELECT * FROM accounts;\n-- Write Changes 로 여기까지 저장해 두고 「만들어 보기」 로" } },
      { title: '실패하면 되돌리기', html: `<p>위 accounts 표는 <code>CHECK (balance &gt;= 0)</code> 이라 잔액이 모자라면 UPDATE 가 거절돼요. 그런데 첫 UPDATE 는 성공하고 두 번째가 실패하면? 반쪽만 반영된 상태가 남아요. 그때 <b>되돌리기</b>:</p>
<ul><li>DB Browser: <b>Revert Changes</b> — 마지막 Write Changes 이후를 전부 취소</li><li>SQL: <code>ROLLBACK;</code></li><li>파이썬(레슨 13): <code>conn.rollback()</code>, 성공이면 <code>conn.commit()</code></li></ul>
<p>규칙: 「같이 되어야 하는 변경」 은 한 트랜잭션으로 묶고, 하나라도 실패하면 전부 되돌린다. 은행·쇼핑몰 주문(재고 −1, 주문 +1)이 다 이렇게 돼요.</p>` },
    ],
    S13: [
      { title: '파이썬에서 SQLite 열기', html: `<p>파이썬에는 <code>sqlite3</code> 모듈이 들어 있어서 설치 없이 바로 써요. <code>cafe.db</code> 를 <b>VS Code 에서 연 폴더</b>(.py 와 같은 폴더)에 두고 실행하세요. <code>connect("cafe.db")</code> 는 .py 가 있는 곳이 아니라 <b>지금 터미널의 위치</b>(VS Code 에서 연 폴더)를 기준으로 찾아요.</p>
<pre class="code">import sqlite3

conn = sqlite3.connect("cafe.db")     # 파일 열기(없으면 새로 만듦!)
cur = conn.cursor()
cur.execute("SELECT name, price FROM menu WHERE price &gt;= 5000")
for name, price in cur.fetchall():   # 결과 = 튜플들의 리스트
    print(name, price)
conn.close()</pre>
<table class="kb"><tbody><tr><td><code>fetchall()</code></td><td>결과 전부를 <code>[(…), (…)]</code> 리스트로</td></tr><tr><td><code>fetchone()</code></td><td>한 행만(<code>COUNT(*)</code> 같은 값 하나일 때 <code>[0]</code>)</td></tr></tbody></table>
<div class="bk-warn"><code>connect("cafe.db")</code> 는 파일이 <b>없으면 빈 DB 를 새로 만들어요</b>. 그래서 폴더가 틀리면 에러 대신 <code>no such table: menu</code> 가 나와요 → cafe.db 가 <b>VS Code 에서 연 폴더</b>에 있는지(.py 가 하위 폴더에 있어도 터미널 위치 기준), 터미널의 <code>pwd</code> 로 확인.</div>`, example: { code: 'import sqlite3\n\nconn = sqlite3.connect("cafe.db")\ncur = conn.cursor()\ncur.execute("SELECT name, price FROM menu WHERE price >= 5000")\nfor name, price in cur.fetchall():\n    print(name, price)\nconn.close()', label: '예제 파이썬 — cafe.db 와 같은 폴더의 .py 에 붙여 넣고 VS Code 에서 실행' } },
      { title: '? 로 값 넣기 (SQL 인젝션 막기)', html: `<p>사용자가 입력한 값을 SQL 에 넣을 때 <b>글자 더하기로 만들면 안 돼요</b>.</p>
<pre class="code">name = input("메뉴: ")
cur.execute("SELECT * FROM menu WHERE name = '" + name + "'")   # ❌ 위험</pre>
<p>누군가 <code>' OR '1'='1</code> 을 입력하면 조건이 항상 참이 돼서 전부 나와요(<b>SQL 인젝션</b>). 대신 자리표 <code>?</code> 를 쓰고 값을 따로 넘겨요:</p>
<pre class="code">cur.execute("SELECT * FROM menu WHERE name = ?", (name,))      # ✅
cur.execute("SELECT * FROM menu WHERE price BETWEEN ? AND ?", (4000, 5000))</pre>
<p>값이 하나여도 <b>튜플</b>로: <code>(name,)</code> — 쉼표가 있어야 튜플이에요.</p>`, example: { code: 'import sqlite3\n\nconn = sqlite3.connect("cafe.db")\ncur = conn.cursor()\ncategory = "음료"\ncur.execute("SELECT name, price FROM menu WHERE category = ? ORDER BY price", (category,))\nfor row in cur.fetchall():\n    print(row)\nconn.close()', label: '예제 파이썬 — cafe.db 와 같은 폴더에서' } },
      { title: '바꾸고 저장: commit', html: `<pre class="code">cur.execute("INSERT INTO menu (name, category, price) VALUES (?, ?, ?)", ("흑당라테", "커피", 5500))
conn.commit()        # ← 이걸 해야 파일에 저장(DB Browser 의 Write Changes)
print(cur.rowcount, "행 바뀜")</pre>
<ul><li><code>commit()</code> 을 빼먹고 <code>close()</code> 하면 바꾼 게 <b>사라져요</b></li><li>여러 행: <code>cur.executemany("INSERT … VALUES (?, ?)", [(…), (…)])</code></li><li><code>with conn:</code> 블록 안에서 하면 끝날 때 자동 commit, 에러가 나면 자동 rollback(레슨 12)</li><li>같은 cafe.db 를 DB Browser 에서 열어 고친 뒤 Write Changes 를 안 했다면 파이썬이 <code>database is locked</code> 로 기다릴 수 있어요 → DB Browser 에서 Write Changes 나 Revert 먼저</li></ul>`, example: { code: 'import sqlite3\n\nconn = sqlite3.connect("cafe.db")\nwith conn:\n    conn.execute("UPDATE menu SET price = price + 100 WHERE category = ?", ("베이커리",))\nfor row in conn.execute("SELECT name, price FROM menu WHERE category = ?", ("베이커리",)):\n    print(row)\nconn.close()', label: '예제 파이썬 — 실행하면 cafe.db 가 바뀌어요(되돌리려면 다시 받기)' } },
    ],
  },
  tasks: {
    S0: [
      { title: '손님 표 전부 보기', text: '<code>customers</code> 표의 모든 열·모든 행을 보세요.', needs: [['SELECT *', 'S0/0', '모든 열'], ['FROM 표', 'S0/2', '어느 표에서']], answer: 'SELECT * FROM customers;', io: [{ output: "id | name | phone | joined_at | grade\n1 | 김민준 | 010-1111-2222 | 2026-07-03 | 단골\n2 | 이서연 | NULL | 2026-08-15 | 일반\n3 | 박지호 | 010-3333-4444 | 2026-08-20 | 일반\n4 | 최수아 | 010-5555-6666 | 2026-06-11 | 단골\n5 | 정하준 | 010-7777-8888 | 2026-09-02 | 일반\n6 | 강지우 | 010-9999-0000 | 2026-09-18 | 일반\n7 | 윤서준 | 010-2222-3333 | 2026-05-27 | 단골\n8 | 임하은 | 010-4444-5555 | 2026-10-05 | 일반" }] },
      { title: '직원 이름과 시급', text: '<code>staff</code> 표에서 직원 <b>이름</b>과 <b>시급</b>(<code>hourly_wage</code>)만 보세요.', needs: [['SELECT 열, 열', 'S0/2', '보고 싶은 열만']], answer: 'SELECT name, hourly_wage FROM staff;', io: [{ output: "name | hourly_wage\n이사장 | 12000\n박바리 | 10500\n김알바 | 10030\n최알바 | 10030" }] },
    ],
    S1: [
      { title: '베이커리만', text: '종류(<code>category</code>)가 <code>베이커리</code> 인 메뉴의 이름과 가격.', needs: [['WHERE 열 = \'값\'', 'S1/0', '글자는 작은따옴표']], answer: "SELECT name, price FROM menu WHERE category = '베이커리';", io: [{ output: "name | price\n크루아상 | 3500\n치즈케이크 | 6000" }] },
      { title: '차가운 메뉴 중 5000원 이상', text: '차가운 메뉴(<code>is_hot = 0</code>)이면서 가격이 5000원 <b>이상</b>인 메뉴의 이름과 가격.', needs: [['AND', 'S1/1', '둘 다'], ['>=', 'S1/0', '이상']], answer: 'SELECT name, price FROM menu WHERE is_hot = 0 AND price >= 5000;', io: [{ output: "name | price\n딸기스무디 | 5500\n치즈케이크 | 6000" }] },
      { title: '「라테」 들어간 메뉴', text: '이름에 <code>라테</code> 가 들어간 메뉴의 이름.', needs: [["LIKE '%…%'", 'S1/2', '모양으로 찾기']], answer: "SELECT name FROM menu WHERE name LIKE '%라테%';", io: [{ output: "name\n카페라테\n바닐라라테\n녹차라테" }] },
      { title: '10월 주문', text: '2026년 <b>10월</b>에 들어온 주문의 번호(<code>id</code>)·시각(<code>ordered_at</code>)·금액(<code>total</code>).', needs: [['>= · <', 'S1/0', '날짜 글자 비교'], ['BETWEEN', 'S1/2', '범위'], ["LIKE '2026-10%'", 'S1/2', '(다른 방법) 앞부분 모양']], answer: "SELECT id, ordered_at, total FROM orders WHERE ordered_at >= '2026-10-01' AND ordered_at < '2026-11-01';", io: [{ output: "id | ordered_at | total\n22 | 2026-10-01 12:40 | 21400\n23 | 2026-10-03 13:00 | 10000\n24 | 2026-10-08 12:30 | 23400\n25 | 2026-10-10 12:30 | 15500\n26 | 2026-10-15 17:15 | 8500\n27 | 2026-10-17 10:20 | 14500\n28 | 2026-10-22 17:20 | 8800\n29 | 2026-10-24 17:40 | 19600\n30 | 2026-10-29 18:30 | 18000" }] },
    ],
    S2: [
      { title: '가장 비싼 메뉴 3개', text: '가격이 <b>높은 순서대로</b> 메뉴 3개의 이름과 가격. (값이 같으면 이름 가나다순)', needs: [['ORDER BY … DESC', 'S2/0', '큰 순'], ['LIMIT', 'S2/0', '위에서 몇 개']], answer: 'SELECT name, price FROM menu ORDER BY price DESC, name LIMIT 3;', io: [{ output: "name | price\n치즈케이크 | 6000\n딸기스무디 | 5500\n녹차라테 | 5000" }] },
      { title: '전화번호가 없는 손님', text: '전화번호(<code>phone</code>)가 비어 있는(NULL) 손님의 이름.', needs: [['IS NULL', 'S2/2', '= NULL 은 안 됨']], answer: 'SELECT name FROM customers WHERE phone IS NULL;', io: [{ output: "name\n이서연" }] },
      { title: '근무 시간 계산', text: '근무표(<code>shifts</code>)에서 근무 날짜(<code>work_date</code>)와 <b>일한 시간</b>(<code>end_hour - start_hour</code>, 열 이름 <code>시간</code>)을 <b>일한 시간이 긴 순</b>으로, 같으면 날짜 순으로 위 5개.', needs: [['계산 열 AS', 'S2/1', '열로 계산·별명'], ['ORDER BY 여러 열', 'S2/0', '같으면 다음 기준']], answer: 'SELECT work_date, end_hour - start_hour AS 시간 FROM shifts ORDER BY 시간 DESC, work_date LIMIT 5;', io: [{ output: "work_date | 시간\n2026-09-05 | 6\n2026-09-25 | 6\n2026-09-30 | 6\n2026-10-05 | 6\n2026-08-16 | 5" }] },
      { title: '메뉴 종류 목록', text: '메뉴에 어떤 <b>종류</b>(<code>category</code>)들이 있는지 겹치지 않게, 가나다순으로.', needs: [['DISTINCT', 'S2/1', '겹치는 것 하나만'], ['ORDER BY', 'S2/0', '정렬']], answer: 'SELECT DISTINCT category FROM menu ORDER BY category;', io: [{ output: "category\n베이커리\n음료\n커피" }] },
    ],
    S3: [
      { title: '전체 매출과 평균', text: '전체 주문의 <b>개수</b>, <b>매출 합계</b>, <b>평균 금액</b>(소수 첫째 자리 반올림)을 한 줄로. 열 이름은 <code>주문수</code>, <code>매출</code>, <code>평균</code>.', needs: [['COUNT · SUM · AVG', 'S3/0', '집계'], ['ROUND(x, 1)', 'S2/1', '반올림'], ['AS', 'S2/1', '별명']], answer: 'SELECT COUNT(*) AS 주문수, SUM(total) AS 매출, ROUND(AVG(total), 1) AS 평균 FROM orders;', io: [{ output: "주문수 | 매출 | 평균\n30 | 458700 | 15290.0" }] },
      { title: '종류별 메뉴 수와 최고가', text: '메뉴 <b>종류별로</b> 메뉴 개수(<code>메뉴수</code>)와 가장 비싼 가격(<code>최고가</code>)을, 종류 가나다순으로.', needs: [['GROUP BY', 'S3/1', '묶어서 집계'], ['MAX', 'S3/0', '가장 큰 값']], answer: 'SELECT category, COUNT(*) AS 메뉴수, MAX(price) AS 최고가 FROM menu GROUP BY category ORDER BY category;', io: [{ output: "category | 메뉴수 | 최고가\n베이커리 | 2 | 6000\n음료 | 3 | 5500\n커피 | 5 | 5000" }] },
      { title: '직원별 처리한 주문', text: '직원 번호(<code>staff_id</code>)별로 처리한 주문 수(<code>건수</code>)와 매출(<code>매출</code>)을 <b>매출 큰 순</b>으로.', needs: [['GROUP BY', 'S3/1', '직원별'], ['ORDER BY 별명 DESC', 'S2/0', '집계 결과로 정렬']], answer: 'SELECT staff_id, COUNT(*) AS 건수, SUM(total) AS 매출 FROM orders GROUP BY staff_id ORDER BY 매출 DESC;', io: [{ output: "staff_id | 건수 | 매출\n4 | 16 | 266000\n2 | 6 | 76300\n3 | 4 | 69100\n1 | 4 | 47300" }] },
      { title: '네 번 이상 온 손님', text: '비회원 주문(<code>customer_id</code> 가 NULL)은 빼고, <b>4번 이상</b> 주문한 손님 번호와 횟수를 횟수가 많은 순(같으면 번호 순)으로.', needs: [['WHERE … IS NOT NULL', 'S2/2', '행 조건'], ['HAVING', 'S3/2', '묶음 조건']], answer: 'SELECT customer_id, COUNT(*) AS 횟수 FROM orders WHERE customer_id IS NOT NULL GROUP BY customer_id HAVING COUNT(*) >= 4 ORDER BY 횟수 DESC, customer_id;', io: [{ output: "customer_id | 횟수\n3 | 5\n2 | 4\n5 | 4\n8 | 4" }] },
    ],
    SB1: [
      { title: '복습 — 🏠 메뉴 번호표 만들기', text: '이달 보고서는 메뉴를 <b>번호</b>(<code>menu_id</code>)로 세요. 번호만 보고는 무슨 메뉴인지 모르니, 먼저 <code>menu</code> 표에서 번호(<code>id</code>)와 이름(<code>name</code>)만 골라 번호표를 만들어 두세요. 아래 TOP 5 문제에서 이 표를 옆에 두고 봐요.', needs: [['SELECT 열, 열 FROM 표', 'S0/2', '보고 싶은 열만'], ['menu (id, name, …)', 'S0/1', 'id = 행마다 겹치지 않는 기본 키']], answer: 'SELECT id, name FROM menu;', io: [{ output: "id | name\n1 | 아메리카노\n2 | 카페라테\n3 | 바닐라라테\n4 | 카푸치노\n5 | 콜드브루\n6 | 녹차라테\n7 | 유자차\n8 | 딸기스무디\n9 | 크루아상\n10 | 치즈케이크" }] },
      { title: '복습 — 에러 읽기 — 차가운 메뉴 목록', text: '차가운 메뉴(<code>is_hot = 0</code>)의 이름과 가격을 보려는데 메시지 칸에 <code>no such table: menus</code> 가 나와요. 무슨 뜻인지 읽고 고친 뒤 다시 실행해 보세요. 그러면 이번엔 <code>no such column: nmae</code> 가 나와요. 에러는 하나씩 나오니 하나 고치고 또 실행해요.', given: 'SELECT nmae, price\nFROM menus\nWHERE is_hot = 0;', needs: [['no such table: menus', 'S0/2', '표 이름 오타'], ['no such column: nmae', 'S0/2', '열 이름 오타']], answer: 'SELECT name, price\nFROM menu\nWHERE is_hot = 0;', io: [{ output: "name | price\n콜드브루 | 4800\n딸기스무디 | 5500\n크루아상 | 3500\n치즈케이크 | 6000" }] },
      { title: '복습 — 출력 예측 · 손님 수를 두 가지로 세기', text: '보고서에 「손님 수」 를 적으려는데, 세는 방법에 따라 숫자가 달라요. 아래 쿼리의 결과를 먼저 맞혀 보고 실행해서 확인하세요. 손님 표에서 <code>phone</code> 이 비어 있는 손님이 있었죠?', needs: [['COUNT(*) · COUNT(phone)', 'S3/0', '열을 넣으면 NULL 은 안 셈'], ['NULL', 'S2/2', '값이 없음']], predict: true, answer: 'SELECT COUNT(*) AS 전체, COUNT(phone) AS 전화있음, COUNT(*) - COUNT(phone) AS 전화없음\nFROM customers;', io: [{ output: "전체 | 전화있음 | 전화없음\n8 | 7 | 1" }], explain: '<p><code>COUNT(*)</code> 는 행을 다 세서 8 이에요. <code>COUNT(phone)</code> 은 <code>phone</code> 이 NULL 인 행을 빼고 세요. 이서연 손님만 전화번호가 NULL 이라 7 이에요. 그래서 둘을 빼면 1 이에요.</p>' },
      { title: '이달(10월) 요약', text: '10월 주문만으로 <b>주문 수 · 매출 · 가장 큰 주문 금액</b>을 한 줄로(열 이름 <code>주문수</code>, <code>매출</code>, <code>최대</code>).', needs: [['WHERE 날짜', 'S1/0', '10월만'], ['COUNT · SUM · MAX', 'S3/0', '집계']], answer: "SELECT COUNT(*) AS 주문수, SUM(total) AS 매출, MAX(total) AS 최대 FROM orders WHERE ordered_at >= '2026-10-01';", io: [{ output: "주문수 | 매출 | 최대\n9 | 139700 | 23400" }] },
      { title: '많이 팔린 메뉴 번호 TOP 5', text: '<code>order_items</code> 에서 메뉴 번호(<code>menu_id</code>)별 판매 수량 합계(<code>수량</code>)를 <b>많은 순</b>(같으면 번호 순)으로 5개. (메뉴 이름은 챕터 2 의 JOIN 으로 붙여요)', needs: [['SUM(qty)', 'S3/0', '수량 합계'], ['GROUP BY', 'S3/1', '메뉴별'], ['ORDER BY · LIMIT', 'S2/0', 'TOP 5']], answer: 'SELECT menu_id, SUM(qty) AS 수량 FROM order_items GROUP BY menu_id ORDER BY 수량 DESC, menu_id LIMIT 5;', io: [{ output: "menu_id | 수량\n5 | 19\n9 | 14\n3 | 13\n4 | 11\n7 | 11" }] },
      { title: '시간대별 매출', text: '주문 시각의 <b>시</b>(<code>ordered_at</code> 의 12번째부터 2글자)별로 주문 수와 매출을, 시간 순으로. 열 이름 <code>시</code>, <code>주문수</code>, <code>매출</code>.', needs: [['substr(글자, 시작, 길이)', 'S7/1', '시 뽑기'], ['GROUP BY 별명', 'S3/1', '시간대별']], answer: 'SELECT substr(ordered_at, 12, 2) AS 시, COUNT(*) AS 주문수, SUM(total) AS 매출 FROM orders GROUP BY 시 ORDER BY 시;', io: [{ output: "시 | 주문수 | 매출\n08 | 1 | 15000\n10 | 5 | 68200\n11 | 1 | 11500\n12 | 5 | 85300\n13 | 6 | 87400\n14 | 2 | 38500\n16 | 2 | 31000\n17 | 3 | 36900\n18 | 3 | 42500\n19 | 2 | 42400" }] },
      { title: '🏠 내 가게라면: 평균보다 큰 주문', text: '평균 주문 금액은 15,290원이에요. 그보다 <b>큰</b> 주문만 금액이 큰 순으로 번호·금액. (서브쿼리로 평균을 직접 구하는 법은 레슨 6)', needs: [['WHERE total > 값', 'S1/0', '비교'], ['ORDER BY DESC', 'S2/0', '큰 순']], answer: 'SELECT id, total FROM orders WHERE total > 15290 ORDER BY total DESC;', io: [{ output: "id | total\n1 | 24400\n24 | 23400\n22 | 21400\n21 | 20500\n29 | 19600\n2 | 18000\n8 | 18000\n30 | 18000\n5 | 17900\n4 | 17000\n9 | 17000\n10 | 17000\n13 | 17000\n14 | 17000\n11 | 16000\n18 | 15500\n25 | 15500" }] },
    ],
    S4: [
      { title: '주문에 손님 이름 붙이기', text: '주문 번호·손님 <b>이름</b>·금액을 주문 번호 순으로 위 5개. (비회원 주문은 빠져요)', needs: [['JOIN … ON', 'S4/1', '짝이 같은 행 붙이기'], ['FROM orders o', 'S4/1', '별명 o · c'], ['LIMIT', 'S2/0', '위 5개']], answer: 'SELECT o.id, c.name, o.total FROM orders o JOIN customers c ON o.customer_id = c.id ORDER BY o.id LIMIT 5;', io: [{ output: "id | name | total\n1 | 윤서준 | 24400\n2 | 최수아 | 18000\n4 | 이서연 | 17000\n5 | 박지호 | 17900\n6 | 윤서준 | 9800" }] },
      { title: '손님별 주문 횟수와 합계', text: '손님 <b>이름</b>별 주문 횟수(<code>횟수</code>)와 금액 합계(<code>합계</code>)를 합계가 큰 순으로.', needs: [['JOIN', 'S4/1', '이름 붙이기'], ['GROUP BY', 'S4/2', 'JOIN 뒤에 묶기']], answer: 'SELECT c.name, COUNT(*) AS 횟수, SUM(o.total) AS 합계 FROM orders o JOIN customers c ON o.customer_id = c.id GROUP BY c.name ORDER BY 합계 DESC;', io: [{ output: "name | 횟수 | 합계\n박지호 | 5 | 81400\n정하준 | 4 | 66200\n이서연 | 4 | 66000\n임하은 | 4 | 59000\n김민준 | 3 | 45000\n윤서준 | 2 | 34200\n최수아 | 2 | 27000\n강지우 | 1 | 9000" }] },
      { title: '직원 이름별 매출', text: '직원 <b>이름</b>과 역할(<code>role</code>)별 처리 주문 수와 매출을, 매출이 큰 순으로.', needs: [['JOIN staff', 'S4/1', 'orders.staff_id = staff.id'], ['GROUP BY 여러 열', 'S3/1', '이름·역할']], answer: 'SELECT s.name, s.role, COUNT(*) AS 건수, SUM(o.total) AS 매출 FROM orders o JOIN staff s ON o.staff_id = s.id GROUP BY s.name, s.role ORDER BY 매출 DESC;', io: [{ output: "name | role | 건수 | 매출\n최알바 | 알바 | 16 | 266000\n박바리 | 바리스타 | 6 | 76300\n김알바 | 알바 | 4 | 69100\n이사장 | 점장 | 4 | 47300" }] },
    ],
    S5: [
      { title: '비회원 주문까지 전부', text: '모든 주문의 번호와 손님 이름을, 이름이 없으면(비회원) <code>비회원</code> 으로 보이게 — 10월 주문만, 번호 순.', needs: [['LEFT JOIN', 'S5/0', '짝 없어도 남기기'], ['COALESCE', 'S2/2', 'NULL 대신 값']], answer: "SELECT o.id, COALESCE(c.name, '비회원') AS 손님 FROM orders o LEFT JOIN customers c ON o.customer_id = c.id WHERE o.ordered_at >= '2026-10-01' ORDER BY o.id;", io: [{ output: "id | 손님\n22 | 비회원\n23 | 임하은\n24 | 정하준\n25 | 정하준\n26 | 비회원\n27 | 정하준\n28 | 박지호\n29 | 박지호\n30 | 김민준" }] },
      { title: '메뉴 이름별 판매 수량 TOP 5', text: '<b>메뉴 이름</b>별 판매 수량 합계를 많은 순(같으면 이름 순)으로 5개.', needs: [['JOIN menu', 'S5/1', 'order_items.menu_id = menu.id'], ['SUM · GROUP BY', 'S5/1', '메뉴별 수량']], answer: 'SELECT m.name, SUM(oi.qty) AS 수량 FROM order_items oi JOIN menu m ON oi.menu_id = m.id GROUP BY m.name ORDER BY 수량 DESC, m.name LIMIT 5;', io: [{ output: "name | 수량\n콜드브루 | 19\n크루아상 | 14\n바닐라라테 | 13\n유자차 | 11\n카푸치노 | 11" }] },
      { title: '10월에 근무가 없는 직원', text: '10월(<code>work_date</code> 가 2026-10-01 이후)에 근무가 <b>하나도 없는</b> 직원 이름.', needs: [['LEFT JOIN … IS NULL', 'S5/0', '짝 없는 것 찾기'], ['ON 에 조건 더하기', 'S5/0', 'AND 날짜']], answer: "SELECT s.name FROM staff s LEFT JOIN shifts sh ON sh.staff_id = s.id AND sh.work_date >= '2026-10-01' WHERE sh.id IS NULL ORDER BY s.name;", io: [{ output: "name\n김알바\n박바리\n이사장" }] },
      { title: '주문 상세 세 표 잇기', text: '주문 1번에 들어간 메뉴 이름·수량·가격을 보세요(orders·order_items·menu 세 표).', needs: [['JOIN 여러 번', 'S5/1', '줄줄이 잇기']], answer: 'SELECT m.name, oi.qty, m.price FROM orders o JOIN order_items oi ON oi.order_id = o.id JOIN menu m ON oi.menu_id = m.id WHERE o.id = 1 ORDER BY m.name;', io: [{ output: "name | qty | price\n바닐라라테 | 2 | 5000\n콜드브루 | 3 | 4800" }] },
    ],
    S6: [
      { title: '평균보다 싼 메뉴', text: '메뉴 평균 가격보다 <b>싼</b> 메뉴의 이름과 가격을 가격 순(같으면 이름 순)으로. 평균은 숫자로 쓰지 말고 서브쿼리로.', needs: [['(SELECT AVG …)', 'S6/0', '값 하나 서브쿼리']], answer: 'SELECT name, price FROM menu WHERE price < (SELECT AVG(price) FROM menu) ORDER BY price, name;', io: [{ output: "name | price\n크루아상 | 3500\n아메리카노 | 4000\n유자차 | 4500\n카페라테 | 4500\n카푸치노 | 4500" }] },
      { title: '단골이 주문한 주문 번호', text: '등급(<code>grade</code>)이 <code>단골</code> 인 손님들의 주문 번호를 번호 순으로. JOIN 대신 <code>IN (SELECT …)</code> 으로.', needs: [['IN (SELECT …)', 'S6/0', '목록 서브쿼리']], answer: "SELECT id FROM orders WHERE customer_id IN (SELECT id FROM customers WHERE grade = '단골') ORDER BY id;", io: [{ output: "id\n1\n2\n6\n18\n19\n20\n30" }] },
      { title: 'WITH 로 손님별 요약 후 이름', text: 'WITH 로 손님별 주문 횟수를 먼저 구한 뒤, 횟수가 <b>3번 이상</b>인 손님의 이름과 횟수를 횟수가 많은 순(같으면 이름 순)으로.', needs: [['WITH 이름 AS (…)', 'S6/1', '먼저 이름 붙이기'], ['JOIN', 'S4/1', '이름 붙이기']], answer: 'WITH t AS (SELECT customer_id, COUNT(*) AS 횟수 FROM orders WHERE customer_id IS NOT NULL GROUP BY customer_id) SELECT c.name, t.횟수 FROM t JOIN customers c ON c.id = t.customer_id WHERE t.횟수 >= 3 ORDER BY t.횟수 DESC, c.name;', io: [{ output: "name | 횟수\n박지호 | 5\n이서연 | 4\n임하은 | 4\n정하준 | 4\n김민준 | 3" }] },
      { title: '딸기스무디를 산 적 있는 손님', text: '<code>딸기스무디</code> 를 한 번이라도 산 손님 이름을 가나다순으로.', needs: [['EXISTS', 'S6/2', '있는지'], ['JOIN', 'S5/1', '주문 → 상세 → 메뉴']], answer: "SELECT c.name FROM customers c WHERE EXISTS (SELECT 1 FROM orders o JOIN order_items oi ON oi.order_id = o.id JOIN menu m ON m.id = oi.menu_id WHERE o.customer_id = c.id AND m.name = '딸기스무디') ORDER BY c.name;", io: [{ output: "name\n이서연\n정하준" }] },
    ],
    S7: [
      { title: '주문 금액 등급', text: '주문 번호와 금액, 그리고 금액이 20000 이상이면 <code>큰 주문</code>, 10000 이상이면 <code>보통</code>, 그 밖은 <code>작은 주문</code>(열 이름 <code>등급</code>) — 9월 주문만 번호 순.', needs: [['CASE WHEN', 'S7/0', '분류'], ["LIKE '2026-09%'", 'S1/2', '9월']], answer: "SELECT id, total, CASE WHEN total >= 20000 THEN '큰 주문' WHEN total >= 10000 THEN '보통' ELSE '작은 주문' END AS 등급 FROM orders WHERE ordered_at LIKE '2026-09%' ORDER BY id;", io: [{ output: "id | total | 등급\n10 | 17000 | 보통\n11 | 16000 | 보통\n12 | 15000 | 보통\n13 | 17000 | 보통\n14 | 17000 | 보통\n15 | 14600 | 보통\n16 | 14000 | 보통\n17 | 12800 | 보통\n18 | 15500 | 보통\n19 | 11500 | 보통\n20 | 9000 | 작은 주문\n21 | 20500 | 큰 주문" }] },
      { title: '월별 매출', text: '월(<code>YYYY-MM</code>)별 주문 수와 매출을 월 순으로.', needs: [['substr(…, 1, 7)', 'S7/1', '월 뽑기'], ['GROUP BY', 'S3/1', '월별']], answer: 'SELECT substr(ordered_at, 1, 7) AS 월, COUNT(*) AS 주문수, SUM(total) AS 매출 FROM orders GROUP BY 월 ORDER BY 월;', io: [{ output: "월 | 주문수 | 매출\n2026-08 | 9 | 139100\n2026-09 | 12 | 179900\n2026-10 | 9 | 139700" }] },
      { title: '전화번호 숫자만', text: '손님 이름과, 전화번호에서 <code>-</code> 를 뺀 숫자만(열 이름 <code>번호</code>) — 전화번호가 있는 손님만, id 순.', needs: [['replace', 'S7/2', '글자 바꾸기'], ['IS NOT NULL', 'S2/2', '있는 것만']], answer: "SELECT name, replace(phone, '-', '') AS 번호 FROM customers WHERE phone IS NOT NULL ORDER BY id;", io: [{ output: "name | 번호\n김민준 | 01011112222\n박지호 | 01033334444\n최수아 | 01055556666\n정하준 | 01077778888\n강지우 | 01099990000\n윤서준 | 01022223333\n임하은 | 01044445555" }] },
      { title: '따뜻한·차가운 메뉴 수', text: '메뉴 종류별로 따뜻한(<code>is_hot = 1</code>) 메뉴 수(<code>따뜻</code>)와 차가운 메뉴 수(<code>차가운</code>)를 한 줄씩, 종류 가나다순.', needs: [['SUM(CASE …)', 'S7/0', '조건에 맞는 것만 세기'], ['GROUP BY', 'S3/1', '종류별']], answer: 'SELECT category, SUM(CASE WHEN is_hot = 1 THEN 1 ELSE 0 END) AS 따뜻, SUM(CASE WHEN is_hot = 0 THEN 1 ELSE 0 END) AS 차가운 FROM menu GROUP BY category ORDER BY category;', io: [{ output: "category | 따뜻 | 차가운\n베이커리 | 0 | 2\n음료 | 2 | 1\n커피 | 4 | 1" }] },
    ],
    SB2: [
      { title: '복습 — 출력 예측 · 평균보다 비싼 메뉴는 종류별로 몇 개?', text: '단골 보고서 첫 줄에 「평균보다 비싼 메뉴」 를 적으려 해요. 메뉴 평균 가격은 4730원이에요. 아래 쿼리의 결과를 먼저 맞혀 보고 실행해서 확인하세요.', needs: [['(SELECT AVG(price) FROM menu)', 'S6/0', '값 하나를 내는 서브쿼리'], ['GROUP BY', 'S3/1', '종류별로 묶기']], predict: true, answer: 'SELECT category, COUNT(*) AS 개수\nFROM menu\nWHERE price > (SELECT AVG(price) FROM menu)\nGROUP BY category\nORDER BY category;', io: [{ output: "category | 개수\n베이커리 | 1\n음료 | 2\n커피 | 2" }], explain: '<p>괄호 안 서브쿼리가 먼저 평균 4730 을 내요. 그래서 바깥 WHERE 는 <code>price &gt; 4730</code> 과 같아요. 4730원보다 비싼 메뉴는 바닐라라테·콜드브루(커피), 녹차라테·딸기스무디(음료), 치즈케이크(베이커리) 다섯 개예요. 이걸 종류별로 세면 1 · 2 · 2 예요.</p>' },
      { title: '복습 — 🏠 빵을 한 번도 안 산 손님', text: '베이커리 메뉴(<code>category = \'베이커리\'</code>)를 <b>한 번도</b> 안 산 손님에게 빵 쿠폰을 보내려 해요. 그런 손님 이름을 가나다순으로 구하세요. 「한 번도 없는」 은 <code>NOT EXISTS</code> 로 써요.', needs: [['NOT EXISTS (SELECT 1 …)', 'S6/2', '한 번도 없는'], ['JOIN 여러 번', 'S5/1', '주문 → 상세 → 메뉴']], answer: "SELECT c.name FROM customers c\nWHERE NOT EXISTS (\n  SELECT 1 FROM orders o\n  JOIN order_items oi ON oi.order_id = o.id\n  JOIN menu m ON m.id = oi.menu_id\n  WHERE o.customer_id = c.id AND m.category = '베이커리'\n)\nORDER BY c.name;", io: [{ output: "name\n강지우\n윤서준\n임하은\n정하준\n최수아" }] },
      { title: '복습 — 고치기 — 재방문율이 0 으로 나와요', text: '두 번 이상 온 손님이 몇 % 인지(재방문율) 보려고 <code>WITH</code> 로 손님별 횟수를 먼저 구했어요. 그런데 <code>비율</code> 이 <code>0</code> 으로 나와요. 정수끼리 나누면 몫만 남기 때문이에요. 백분율(%)로 고치고 소수 첫째 자리까지 반올림하세요.', given: 'WITH t AS (\n  SELECT customer_id, COUNT(*) AS 횟수\n  FROM orders\n  WHERE customer_id IS NOT NULL\n  GROUP BY customer_id\n)\nSELECT COUNT(*) AS 손님,\n  SUM(CASE WHEN 횟수 >= 2 THEN 1 ELSE 0 END) AS 재방문,\n  SUM(CASE WHEN 횟수 >= 2 THEN 1 ELSE 0 END) / COUNT(*) AS 비율\nFROM t;', needs: [['WITH 이름 AS (…)', 'S6/1', '손님별 요약에 이름 붙이기'], ['SUM(CASE WHEN … THEN 1 ELSE 0 END)', 'S7/0', '조건에 맞는 것만 세기'], ['7 / 2.0', 'S2/1', '정수끼리 나누면 몫만'], ['ROUND(x, 1)', 'S2/1', '반올림']], answer: 'WITH t AS (\n  SELECT customer_id, COUNT(*) AS 횟수\n  FROM orders\n  WHERE customer_id IS NOT NULL\n  GROUP BY customer_id\n)\nSELECT COUNT(*) AS 손님,\n  SUM(CASE WHEN 횟수 >= 2 THEN 1 ELSE 0 END) AS 재방문,\n  ROUND(100.0 * SUM(CASE WHEN 횟수 >= 2 THEN 1 ELSE 0 END) / COUNT(*), 1) AS 비율\nFROM t;', io: [{ output: "손님 | 재방문 | 비율\n8 | 7 | 87.5" }] },
      { title: '직원별 매출 순위', text: '직원 이름별 매출을 큰 순으로, 그리고 매출 1등부터 순위 번호(<code>순위</code>)를 붙여서. 순위는 <code>RANK() OVER (ORDER BY SUM(o.total) DESC)</code> 로 — 처음 보는 문법이면 이 줄을 그대로 쓰세요.', needs: [['JOIN staff', 'S4/1', '이름'], ['GROUP BY', 'S4/2', '직원별'], ['ORDER BY DESC', 'S2/0', '큰 순']], answer: 'SELECT s.name, SUM(o.total) AS 매출, RANK() OVER (ORDER BY SUM(o.total) DESC) AS 순위 FROM orders o JOIN staff s ON o.staff_id = s.id GROUP BY s.name ORDER BY 매출 DESC;', io: [{ output: "name | 매출 | 순위\n최알바 | 266000 | 1\n박바리 | 76300 | 2\n김알바 | 69100 | 3\n이사장 | 47300 | 4" }] },
      { title: '손님별 즐겨 찾는 시간대', text: '단골(<code>grade = \'단골\'</code>) 손님마다 주문 횟수와, 오전(12시 전) 주문 수(<code>오전</code>)를 이름 순으로.', needs: [['JOIN', 'S4/1', '손님'], ['SUM(CASE …)', 'S7/0', '조건 세기'], ['substr', 'S7/1', '시 뽑기']], answer: "SELECT c.name, COUNT(*) AS 횟수, SUM(CASE WHEN substr(o.ordered_at, 12, 2) < '12' THEN 1 ELSE 0 END) AS 오전 FROM orders o JOIN customers c ON o.customer_id = c.id WHERE c.grade = '단골' GROUP BY c.name ORDER BY c.name;", io: [{ output: "name | 횟수 | 오전\n김민준 | 3 | 1\n윤서준 | 2 | 1\n최수아 | 2 | 0" }] },
      { title: '🏠 메뉴별 매출 보고서', text: '메뉴 이름·종류·판매 수량·매출(<code>수량 * 가격</code> 의 합)을 매출 큰 순(같으면 이름 순)으로 — 판매가 <b>없는</b> 메뉴도 0 으로 나오게.', needs: [['LEFT JOIN', 'S5/0', '안 팔린 메뉴도'], ['COALESCE', 'S2/2', 'NULL → 0'], ['SUM(qty * price)', 'S3/0', '매출']], answer: 'SELECT m.name, m.category, COALESCE(SUM(oi.qty), 0) AS 수량, COALESCE(SUM(oi.qty * m.price), 0) AS 매출 FROM menu m LEFT JOIN order_items oi ON oi.menu_id = m.id GROUP BY m.id ORDER BY 매출 DESC, m.name;', io: [{ output: "name | category | 수량 | 매출\n콜드브루 | 커피 | 19 | 91200\n바닐라라테 | 커피 | 13 | 65000\n유자차 | 음료 | 11 | 49500\n카푸치노 | 커피 | 11 | 49500\n크루아상 | 베이커리 | 14 | 49000\n아메리카노 | 커피 | 10 | 40000\n치즈케이크 | 베이커리 | 6 | 36000\n카페라테 | 커피 | 7 | 31500\n녹차라테 | 음료 | 5 | 25000\n딸기스무디 | 음료 | 4 | 22000" }] },
    ],
    S8: [
      { title: '새 메뉴 추가', text: '메뉴에 <code>흑당라테</code>(커피, 5500원, 차가움 = <code>is_hot</code> 0)를 추가하세요. 확인 쿼리로 커피 메뉴를 가격 순으로 보면 새 메뉴가 맨 아래에 있어야 해요.', needs: [['INSERT INTO … VALUES', 'S8/0', '행 추가'], ['Write Changes', 'S8/0', '파일에 저장']], answer: "INSERT INTO menu (name, category, price, is_hot) VALUES ('흑당라테', '커피', 5500, 0);", check: "SELECT name, price, is_hot FROM menu WHERE category = '커피' ORDER BY price, name;", io: [{ output: "name | price | is_hot\n아메리카노 | 4000 | 1\n카페라테 | 4500 | 1\n카푸치노 | 4500 | 1\n콜드브루 | 4800 | 0\n바닐라라테 | 5000 | 1\n흑당라테 | 5500 | 0" }] },
      { title: '베이커리 가격 인상', text: '베이커리 메뉴 가격을 전부 <b>500원 올리세요</b>(다른 메뉴는 그대로). WHERE 를 빠뜨리지 않게, 먼저 SELECT 로 무엇이 걸리는지 보고.', needs: [['UPDATE … SET … WHERE', 'S8/0', '고치기'], ['price = price + 500', 'S8/2', '지금 값으로 계산'], ['먼저 SELECT', 'S8/1', 'WHERE 확인 습관']], answer: "UPDATE menu SET price = price + 500 WHERE category = '베이커리';", check: 'SELECT name, price FROM menu ORDER BY id;', io: [{ output: "name | price\n아메리카노 | 4000\n카페라테 | 4500\n바닐라라테 | 5000\n카푸치노 | 4500\n콜드브루 | 4800\n녹차라테 | 5000\n유자차 | 4500\n딸기스무디 | 5500\n크루아상 | 4000\n치즈케이크 | 6500" }] },
      { title: '오래된 근무 기록 지우기', text: '근무표에서 <b>9월 1일 전</b>(<code>work_date &lt; \'2026-09-01\'</code>) 기록을 지우세요. 확인 쿼리로 남은 개수와 가장 이른 날짜를 보세요.', needs: [['DELETE FROM … WHERE', 'S8/0', '지우기'], ['N rows affected', 'S8/1', '몇 행 지웠나']], answer: "DELETE FROM shifts WHERE work_date < '2026-09-01';", check: 'SELECT COUNT(*) AS 남은기록, MIN(work_date) AS 처음 FROM shifts;', io: [{ output: "남은기록 | 처음\n7 | 2026-09-05" }] },
    ],
    S9: [
      { title: '예약 표 만들기', text: '손님 예약을 저장할 표 <code>reservations</code> 를 만드세요: <code>id</code>(정수 기본 키) · <code>customer_id</code>(정수, 비면 안 됨, customers 를 가리킴) · <code>day</code>(글자, 비면 안 됨) · <code>people</code>(정수, 기본값 2, 1 이상). 그다음 1번 손님의 <code>2026-11-20</code> 예약(인원 안 적음)을 넣고 확인하세요.', needs: [['CREATE TABLE', 'S9/0', '표 만들기'], ['NOT NULL · DEFAULT · CHECK · REFERENCES', 'S9/1', '제약 조건'], ['INSERT', 'S8/0', '행 추가']],
        answer: "CREATE TABLE reservations (\n  id INTEGER PRIMARY KEY,\n  customer_id INTEGER NOT NULL REFERENCES customers(id),\n  day TEXT NOT NULL,\n  people INTEGER DEFAULT 2 CHECK (people >= 1)\n);\nINSERT INTO reservations (customer_id, day) VALUES (1, '2026-11-20');", check: 'SELECT * FROM reservations;', io: [{ output: "id | customer_id | day | people\n1 | 1 | 2026-11-20 | 2" }] },
      { title: '제약 조건이 막아 주는 것', text: '위 표에 <code>people</code> 이 <b>0</b> 인 예약을 넣어 보세요. 어떤 에러가 나는지 보고, 표에 들어가지 않았는지 확인하세요.', needs: [['CHECK', 'S9/1', '조건을 어기면 거절']],
        setup: "CREATE TABLE reservations (id INTEGER PRIMARY KEY, customer_id INTEGER NOT NULL REFERENCES customers(id), day TEXT NOT NULL, people INTEGER DEFAULT 2 CHECK (people >= 1));\nINSERT INTO reservations (customer_id, day) VALUES (1, '2026-11-20');",
        answer: "INSERT INTO reservations (customer_id, day, people) VALUES (2, '2026-11-21', 0);", expectError: 'CHECK constraint failed', check: 'SELECT COUNT(*) AS 예약수 FROM reservations;', io: [{ output: "예약수\n1" }] },
    ],
    S10: [
      { title: '한 칸에 여러 값을 나누기', text: '<code>wishlist</code> 표의 <code>items</code> 칸에 「메뉴, 메뉴」 처럼 여러 값이 들어 있어요(1정규형 위반). 손님·메뉴 한 쌍씩 한 행이 되도록 새 표 <code>wish</code>(<code>customer_id</code>, <code>menu_name</code>)를 만들어 옮기세요. 확인 쿼리로 손님별 개수를 보세요.', needs: [["(1, 'a'), (1, 'b')", 'S10/1', '1정규형: 한 칸에 값 하나 → 두 행'], ['CREATE TABLE', 'S9/0', '새 표'], ['INSERT … VALUES 여러 행', 'S8/2', '한 번에']],
        setup: "CREATE TABLE wishlist (customer_id INTEGER, items TEXT);\nINSERT INTO wishlist VALUES (1, '아메리카노, 크루아상'), (4, '유자차'), (7, '카페라테, 치즈케이크, 콜드브루');",
        answer: "CREATE TABLE wish (customer_id INTEGER, menu_name TEXT);\nINSERT INTO wish VALUES (1, '아메리카노'), (1, '크루아상'), (4, '유자차'), (7, '카페라테'), (7, '치즈케이크'), (7, '콜드브루');", check: 'SELECT customer_id, COUNT(*) AS 개수 FROM wish GROUP BY customer_id ORDER BY customer_id;', io: [{ output: "customer_id | 개수\n1 | 2\n4 | 1\n7 | 3" }] },
      { title: 'ERD 읽기 → 쿼리', text: '레슨 10 의 ERD 를 보고 「치즈케이크를 판 <b>직원 이름</b>」 을 겹치지 않게 가나다순으로 구하세요(menu → order_items → orders → staff 네 표).', needs: [['ERD', 'S10/1', '1:N 선 따라가기'], ['JOIN 여러 번', 'S5/1', '줄줄이'], ['DISTINCT', 'S2/1', '겹치지 않게']], answer: "SELECT DISTINCT s.name FROM menu m JOIN order_items oi ON oi.menu_id = m.id JOIN orders o ON o.id = oi.order_id JOIN staff s ON s.id = o.staff_id WHERE m.name = '치즈케이크' ORDER BY s.name;", io: [{ output: "name\n이사장\n최알바" }] },
    ],
    S11: [
      { title: 'SCAN 을 SEARCH 로', text: '「3번 손님의 주문」 을 찾는 쿼리의 계획을 <code>EXPLAIN QUERY PLAN</code> 으로 보면 <code>SCAN orders</code> 예요. <code>orders.customer_id</code> 에 인덱스 <code>idx_orders_customer</code> 를 만든 뒤 다시 보면 <code>SEARCH … USING INDEX</code> 가 돼야 해요.', needs: [['CREATE INDEX', 'S11/0', '인덱스 만들기'], ['EXPLAIN QUERY PLAN', 'S11/1', '계획 보기']], answer: 'CREATE INDEX idx_orders_customer ON orders(customer_id);', check: 'EXPLAIN QUERY PLAN SELECT * FROM orders WHERE customer_id = 3;', planOnly: true, io: [{ output: 'SEARCH orders USING INDEX idx_orders_customer (customer_id=?)' }] },
    ],
    S12: [
      { title: '송금은 둘 다 되거나 둘 다 안 되거나', text: 'A 가 B 에게 10000원 보내기. UPDATE 두 개를 <b>같이</b> 실행하고(한 덩어리) 둘 다 성공했으면 <b>Write Changes</b>(= COMMIT). 확인 쿼리로 두 잔액을 보세요.', needs: [['Write Changes = COMMIT', 'S12/0', '확정'], ['UPDATE … SET balance = balance - …', 'S8/2', '계산으로 바꾸기']],
        setup: "CREATE TABLE accounts (name TEXT PRIMARY KEY, balance INTEGER CHECK (balance >= 0));\nINSERT INTO accounts VALUES ('A', 30000), ('B', 5000);",
        answer: "UPDATE accounts SET balance = balance - 10000 WHERE name = 'A';\nUPDATE accounts SET balance = balance + 10000 WHERE name = 'B';\n-- 둘 다 성공 → Write Changes (Ctrl+S) = COMMIT", check: 'SELECT name, balance FROM accounts ORDER BY name;', io: [{ output: "name | balance\nA | 20000\nB | 15000" }] },
      { title: '모자라면 되돌리기', text: 'B(잔액 5000)가 A 에게 <b>8000원</b>을 보내려 해요. 두 UPDATE 를 실행하면 A +8000 은 되지만 B −8000 은 CHECK 에 걸려 실패해요(반쪽만 된 상태). 이때 <b>Revert Changes</b>(= ROLLBACK)로 <b>둘 다</b> 취소해서 잔액이 처음(A 30000, B 5000) 그대로인지 확인하세요. <span class="muted small">(준비 SQL 을 실행한 뒤 먼저 Write Changes 를 한 번 해 둬야 Revert 가 그 상태로 돌아가요)</span>', needs: [['Revert Changes = ROLLBACK', 'S12/1', '전부 되돌리기'], ['CHECK', 'S9/1', '잔액 0 이상']],
        setup: "CREATE TABLE accounts (name TEXT PRIMARY KEY, balance INTEGER CHECK (balance >= 0));\nINSERT INTO accounts VALUES ('A', 30000), ('B', 5000);",
        answer: "UPDATE accounts SET balance = balance + 8000 WHERE name = 'A';\nUPDATE accounts SET balance = balance - 8000 WHERE name = 'B';   -- CHECK constraint failed\n-- 반쪽만 됨 → Revert Changes = ROLLBACK", rollback: true, expectError: 'CHECK constraint failed', check: 'SELECT name, balance FROM accounts ORDER BY name;', io: [{ output: "name | balance\nA | 30000\nB | 5000" }] },
    ],
    S13: [
      { title: '파이썬으로 메뉴 읽기', text: 'cafe.db 와 같은 폴더에 <code>menu.py</code> 를 만들어, 커피 메뉴를 가격 순(같으면 이름 순)으로 <code>이름: 가격원</code> 모양으로 출력하세요.', needs: [['sqlite3.connect', 'S13/0', 'DB 열기'], ['execute · fetchall', 'S13/0', '실행·결과'], ['execute(sql, (값,))', 'S13/1', '? 자리표로 값 넣기']], runPy: true,
        answer: 'import sqlite3\n\nconn = sqlite3.connect("cafe.db")\ncur = conn.cursor()\ncur.execute("SELECT name, price FROM menu WHERE category = ? ORDER BY price, name", ("커피",))\nfor name, price in cur.fetchall():\n    print(f"{name}: {price}원")\nconn.close()', io: [{ output: "아메리카노: 4000원\n카페라테: 4500원\n카푸치노: 4500원\n콜드브루: 4800원\n바닐라라테: 5000원" }] },
      { title: '입력받아 찾기 (안전하게)', text: '메뉴 이름을 입력받아 그 메뉴의 가격을 출력하고, 없으면 <code>없는 메뉴예요</code> 를 출력하세요. 글자 더하기가 아니라 <code>?</code> 로.', needs: [['execute(sql, (값,))', 'S13/1', '? 자리표 — SQL 인젝션 막기'], ['fetchone', 'S13/0', '한 행']], runPy: true,
        answer: 'import sqlite3\n\nconn = sqlite3.connect("cafe.db")\nname = input()\nrow = conn.execute("SELECT price FROM menu WHERE name = ?", (name,)).fetchone()\nif row:\n    print(f"{name} {row[0]}원")\nelse:\n    print("없는 메뉴예요")\nconn.close()', io: [{ input: '유자차', output: "유자차 4500원" }] },
    ],
    SB3: [
      { title: '복습 — 고치기 — 가계부 금액이 전부 바뀌었어요', text: '11월 3일 카페 지출(<code>id</code> 4)이 4500원이 아니라 <b>4800원</b>이었어요. 그 한 행만 고치려고 아래 쿼리를 돌렸더니 다섯 행이 전부 4800원이 됐어요. <b>Revert Changes</b> 로 되돌린 뒤 4번 행만 바뀌게 고쳐서 실행하고, 확인 쿼리로 보세요.', given: 'UPDATE ledger SET amount = 4800;', needs: [['UPDATE … SET … WHERE', 'S8/1', 'WHERE 를 빠뜨리면 표 전체가'], ['Revert Changes', 'S8/0', '저장 전으로 되돌리기']],
        setup: "CREATE TABLE ledger (id INTEGER PRIMARY KEY, day TEXT, category TEXT, amount INTEGER);\nINSERT INTO ledger (day, category, amount) VALUES ('2026-11-01', '식비', 12000), ('2026-11-02', '교통', 2800), ('2026-11-03', '식비', 8500), ('2026-11-03', '카페', 4500), ('2026-11-05', '교통', 1400);",
        answer: 'UPDATE ledger SET amount = 4800 WHERE id = 4;', check: 'SELECT * FROM ledger ORDER BY id;', io: [{ output: "id | day | category | amount\n1 | 2026-11-01 | 식비 | 12000\n2 | 2026-11-02 | 교통 | 2800\n3 | 2026-11-03 | 식비 | 8500\n4 | 2026-11-03 | 카페 | 4800\n5 | 2026-11-05 | 교통 | 1400" }] },
      { title: '복습 — 🏠 예산은 따로 적기', text: '분류마다 한 달 예산(식비 300000 · 교통 60000 · 카페 50000)을 정했어요. <code>ledger</code> 의 행마다 예산 열을 붙이면, 예산을 바꿀 때 행을 다 고쳐야 해요(고치기 사고). 「한 가지 사실은 한 곳에만」 — 새 표 <code>budget</code>(<code>category</code> 글자 기본 키 · <code>monthly</code> 정수)을 만들어 세 분류를 넣으세요. 예산 1 개에 지출 여러 행이 이어지는 1 : N 이에요. 확인 쿼리는 두 표를 JOIN 해서 분류별 지출과 예산을 지출 큰 순으로 보여 줘요.', needs: [['ERD 1 ───< N', 'S10/1', '예산 하나 ← 지출 여러 행'], ['CREATE TABLE … PRIMARY KEY', 'S9/0', '새 표'], ['INSERT … VALUES 여러 행', 'S8/2', '세 분류'], ['JOIN · GROUP BY', 'S4/2', '확인: 분류별로 묶기']],
        setup: "CREATE TABLE ledger (id INTEGER PRIMARY KEY, day TEXT, category TEXT, amount INTEGER);\nINSERT INTO ledger (day, category, amount) VALUES ('2026-11-01', '식비', 12000), ('2026-11-02', '교통', 2800), ('2026-11-03', '식비', 8500), ('2026-11-03', '카페', 4500), ('2026-11-05', '교통', 1400);",
        answer: "CREATE TABLE budget (category TEXT PRIMARY KEY, monthly INTEGER);\nINSERT INTO budget VALUES ('식비', 300000), ('교통', 60000), ('카페', 50000);", check: 'SELECT l.category, SUM(l.amount) AS 지출, b.monthly AS 예산\nFROM ledger l JOIN budget b ON b.category = l.category\nGROUP BY l.category\nORDER BY 지출 DESC;', io: [{ output: "category | 지출 | 예산\n식비 | 20500 | 300000\n카페 | 4500 | 50000\n교통 | 4200 | 60000" }] },
      { title: '복습 — 🏠 날짜로 빨리 찾기', text: '가계부는 「11월 3일에 뭘 썼지?」 처럼 <b>날짜</b>로 자주 찾아요. 지금 <code>EXPLAIN QUERY PLAN</code> 으로 보면 <code>SCAN ledger</code>(다 읽음)예요. <code>ledger.day</code> 에 인덱스 <code>idx_ledger_day</code> 를 만들고 확인 쿼리로 계획이 <code>SEARCH … USING INDEX</code> 로 바뀌었는지 보세요.', needs: [['CREATE INDEX 이름 ON 표(열)', 'S11/0', '찾아보기 만들기'], ['EXPLAIN QUERY PLAN', 'S11/1', 'SCAN → SEARCH']],
        setup: "CREATE TABLE ledger (id INTEGER PRIMARY KEY, day TEXT, category TEXT, amount INTEGER);\nINSERT INTO ledger (day, category, amount) VALUES ('2026-11-01', '식비', 12000), ('2026-11-02', '교통', 2800), ('2026-11-03', '식비', 8500), ('2026-11-03', '카페', 4500), ('2026-11-05', '교통', 1400);",
        answer: 'CREATE INDEX idx_ledger_day ON ledger(day);', check: "EXPLAIN QUERY PLAN SELECT * FROM ledger WHERE day = '2026-11-03';", planOnly: true, io: [{ output: 'SEARCH ledger USING INDEX idx_ledger_day (day=?)' }] },
      { title: '복습 — 에러 읽기 — 지갑에서 저금통으로', text: '지갑(20000원)에서 저금통(3000원)으로 <b>25000원</b>을 옮기려고 UPDATE 두 개를 실행했어요. 메시지 칸에 <code>CHECK constraint failed: balance &gt;= 0</code> 이 나와요. 지갑이 0원 밑으로 내려가서 두 번째 UPDATE 가 거절된 거예요. 그런데 첫 번째(저금통 +25000)는 이미 됐어요. 반쪽만 된 상태예요. <b>Revert Changes</b>(= ROLLBACK)로 <b>둘 다</b> 취소하고, 확인 쿼리로 처음 잔액 그대로인지 보세요. <span class="muted small">(준비 SQL 을 실행한 뒤 먼저 Write Changes 를 한 번 해 둬야 Revert 가 그 상태로 돌아가요)</span>', needs: [['CHECK constraint failed', 'S9/1', '제약에 걸린 에러'], ['Revert Changes = ROLLBACK', 'S12/1', '반쪽을 전부 되돌리기'], ['Write Changes = COMMIT', 'S12/0', '전부 되거나 전부 안 되거나']],
        setup: "CREATE TABLE wallet (name TEXT PRIMARY KEY, balance INTEGER CHECK (balance >= 0));\nINSERT INTO wallet VALUES ('지갑', 20000), ('저금통', 3000);",
        answer: "UPDATE wallet SET balance = balance + 25000 WHERE name = '저금통';\nUPDATE wallet SET balance = balance - 25000 WHERE name = '지갑';   -- CHECK constraint failed\n-- 반쪽만 됨 → Revert Changes = ROLLBACK", rollback: true, expectError: 'CHECK constraint failed', check: 'SELECT name, balance FROM wallet ORDER BY name;', io: [{ output: "name | balance\n저금통 | 3000\n지갑 | 20000" }] },
      { title: '🏠 가계부를 DB 로 (SQL)', text: '새 표 <code>ledger</code>(<code>id</code> 정수 기본 키 · <code>day</code> 글자 · <code>category</code> 글자 · <code>amount</code> 정수)를 만들고 아래 5건을 넣은 뒤, <b>분류별 합계</b>를 큰 순으로 보세요.<pre class="code">2026-11-01 식비 12000\n2026-11-02 교통 2800\n2026-11-03 식비 8500\n2026-11-03 카페 4500\n2026-11-05 교통 1400</pre>', needs: [['CREATE TABLE', 'S9/0', '표'], ['INSERT 여러 행', 'S8/2', '5건'], ['GROUP BY · SUM', 'S3/1', '분류별 합계']],
        answer: "CREATE TABLE ledger (id INTEGER PRIMARY KEY, day TEXT, category TEXT, amount INTEGER);\nINSERT INTO ledger (day, category, amount) VALUES ('2026-11-01', '식비', 12000), ('2026-11-02', '교통', 2800), ('2026-11-03', '식비', 8500), ('2026-11-03', '카페', 4500), ('2026-11-05', '교통', 1400);", check: 'SELECT category, SUM(amount) AS 합계 FROM ledger GROUP BY category ORDER BY 합계 DESC;', io: [{ output: "category | 합계\n식비 | 20500\n카페 | 4500\n교통 | 4200" }] },
      { title: '🏠 가계부를 파이썬으로 (입력 → 저장 → 보고서)', text: '파이썬으로 <code>money.db</code> 에 위 <code>ledger</code> 표를 만들고(<code>CREATE TABLE IF NOT EXISTS</code>), 입력 세 줄(「날짜 분류 금액」)을 <code>executemany</code> 로 넣어 <code>commit</code> 한 뒤, 분류별 합계를 큰 순으로 <code>분류: 금액원</code> 출력하세요. (실행할 때마다 쌓이지 않게 넣기 전에 <code>DELETE FROM ledger</code>)', needs: [['CREATE TABLE IF NOT EXISTS', 'S9/0', '없을 때만 만들기'], ['executemany', 'S13/2', '여러 행'], ['commit', 'S13/2', '저장']], runPy: true,
        answer: 'import sqlite3\n\nconn = sqlite3.connect("money.db")\nconn.execute("CREATE TABLE IF NOT EXISTS ledger (id INTEGER PRIMARY KEY, day TEXT, category TEXT, amount INTEGER)")\nconn.execute("DELETE FROM ledger")\nrows = []\nfor _ in range(3):\n    day, cat, amount = input().split()\n    rows.append((day, cat, int(amount)))\nconn.executemany("INSERT INTO ledger (day, category, amount) VALUES (?, ?, ?)", rows)\nconn.commit()\nfor cat, total in conn.execute("SELECT category, SUM(amount) FROM ledger GROUP BY category ORDER BY 2 DESC"):\n    print(f"{cat}: {total}원")\nconn.close()', io: [{ input: '2026-11-01 식비 12000\n2026-11-02 교통 2800\n2026-11-03 식비 8500', output: "식비: 20500원\n교통: 2800원" }] },
    ],
  },
};
