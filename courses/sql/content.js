// courses/sql/content.js — 코스 4 데이터베이스(SQL) (Phase 3 → v2.7.0 뼈대). 설계 docs/EXPANSION.md 7절, 플러그인 계약 docs/DESIGN.md 16절, 채우는 규칙 specs/content-team.md 「C-S」절.
// 파이썬 content.js 와 같은 전역 const 구조(엔진이 그대로 읽는다). 뼈대: S0 만 완성본, 나머지 레슨은 draft:true(「준비 중」).
//
// 레슨 (LESSONS)  { id:'S0'(보스 'SB1'), ch, n, title, mode:'text', tutorSummary, terms?, pages:[{ title, html, example?:{ sql, dataset?, schema?, autoRun? } }], summary[3], draft? }
//   example.sql     레슨 예제 — 편집기 + ▶ 실행 + 결과 표(core/ui-views-sql.js UI.examples.sql). dataset 기본 'cafe'(courses/sql/datasets.js). autoRun:false 면 엔진이 준비돼도 자동 실행 안 함
// 문제 (PROBLEMS)  공통: id 'S0P1' · lesson · type · title · prompt(html) · tags(WEAKNESS_TAGS 안에서 1~3) · hints[3] · xp(선택, 없으면 CONFIG.XP[type] — sql 25) · solution(문자열, 「정답 보기」가 그대로 보여 줌)
//   type:'sql'   쿼리 작성. starter?(처음 쿼리) · solution(정답 쿼리) · sql:{ dataset:'cafe', expect:{ kind:'rows'|'state', query?, ordered?, columns?, table? } }
//                rows  = 내 쿼리 결과 집합 vs solution(또는 expect.query) 결과 집합. 기본 열·행 순서 무시, ordered:true 면 행 순서 검사(ORDER BY 문제), columns:true 면 열 이름 검사(AS 문제). 실수는 소수 2자리
//                state = 내 쿼리(여러 문장 가능)를 실행한 뒤 expect.table 의 전체 행 vs solution 실행 뒤 (INSERT/UPDATE/DELETE/CREATE 문제)
//                「틀린 곳 고치기」(설계의 bug 유형)도 뼈대에서는 type:'sql' + starter(틀린 쿼리) + prompt 「틀린 곳을 고치세요」 로 낸다(기존 bug 유형은 파이썬 실행을 전제)
//   type:'quiz'  결과 예측: quiz:{ code:'SELECT …'(지문 아래 코드 상자), opts[4], ans, why } — 기존 유형 그대로
//   type:'fill'  키워드·열 이름 빈칸: fill:{ code:'SELECT ___1___ FROM ___2___', blanks:[{a:['name','NAME']}], why } — 대소문자는 a 에 둘 다 적어 둔다(채점은 글자 그대로 비교)
//   type:'parsons' 절 단위 순서 맞추기(정답 5줄 이상: SELECT / FROM / WHERE / GROUP BY / ORDER BY 한 줄씩). parsons.solution 이 곧 solution. 채점은 줄 순서 비교(기존)
//   DRILLS 는 안 쓴다(빈 배열).
const COURSE = { id: 'sql', name: '데이터베이스(SQL)', runner: 'sql', bench: false,
  tutorPersona: '너는 SQL 을 처음 배우는 성인 입문자를 가르치는 친절한 선생님이다. 모든 예는 「동네 카페」 데이터(menu·customers·orders·order_items·staff·shifts)로 든다. 쿼리는 「무엇을 고르나(SELECT) → 어디서(FROM) → 어떤 조건(WHERE)」 순서로 읽어 준다. SQLite 에러 원문(영문)을 그대로 보여 주고 한국어로 풀어 준다. 정답 쿼리를 통째로 주지 말고 어느 절(SELECT/FROM/WHERE…)을 보라고 짚어 준다. 쉬운 말, 짧은 문장, ~해요체.' };
const CHECKUPS = { after: {}, upto: {} }; // TODO(C-S): 챕터 A 끝(S3)·B 끝(S7) 뒤 종합 점검 — { after: { S3: 1, S7: 2 }, upto: { 1: 'S3', 2: 'S7' } }
const WEAKNESS_TAGS = ['표읽기', 'SELECT', 'WHERE', '정렬', 'NULL', '집계', '그룹', 'JOIN', '서브쿼리', '함수', '수정', '설계', '인덱스', '트랜잭션', '파이썬연결'];
const CHAPTERS = [
  { ch: 1, name: '읽기', color: '#f4511e' },
  { ch: 2, name: '합치기', color: '#ef6c00' },
  { ch: 3, name: '바꾸기와 만들기', color: '#c62828' },
];
// draft 레슨 뼈대(본문·문제는 C-S 에서 채움). 채우면 draft 를 지우고 pages·문제를 넣는다.
const TODO = (t) => [{ title: '준비 중', html: `<p>TODO(C-S): ${t}</p>` }];
const LESSONS = [
// ================= 챕터 A 읽기 =================
{ id: 'S0', ch: 1, n: 0, title: '데이터베이스란', mode: 'text',
  tutorSummary: '데이터베이스는 표(테이블)를 여러 개 모아 둔 창고. 표는 행(한 건)과 열(항목)로 되어 있다. 엑셀과 달리 여러 사람이 동시에 쓰고, 표끼리 연결되며, SQL 이라는 말로 물어본다. SELECT 열 FROM 표 가 첫 문장. 이 앱에서는 진짜 SQLite 가 돌아간다.',
  terms: { '데이터베이스': '데이터를 표 여러 개로 정리해 저장하고, 질문(SQL)으로 꺼내 쓰는 창고 (database)', '테이블': '데이터베이스 안의 표 하나. 행과 열로 되어 있다 (table)', '행': '표의 가로줄 하나 = 데이터 한 건 (row)', '열': '표의 세로줄 하나 = 항목 하나. 이름·자료형이 있다 (column)', 'SQL': '데이터베이스에 묻고 바꾸는 말. SELECT·INSERT·UPDATE·DELETE 같은 문장을 쓴다', 'SELECT': '표에서 원하는 열을 골라 보여 달라는 SQL 문장', 'SQLite': '파일 하나짜리 작은 데이터베이스. 이 앱 안에서 진짜로 돌아간다' },
  pages: [
    { title: '데이터베이스란', html: `<p>카페를 운영한다고 해 봐요. 메뉴, 손님, 주문, 직원, 근무표… 적어 둘 게 많아요. 처음엔 엑셀에 적겠지만 곧 한계가 와요. 두 사람이 동시에 고치면 꼬이고, 「이 손님이 지난달에 뭘 샀더라」는 표 두 개를 눈으로 맞춰 봐야 하고, 행이 10만 개가 되면 느려져요.</p><p>[[데이터베이스]]는 이 문제를 풀려고 만든 <b>표 창고</b>예요.</p><ul><li>표를 <b>여러 개</b> 두고 서로 <b>연결</b>해요(손님 표 ↔ 주문 표)</li><li>여러 사람이 <b>동시에</b> 읽고 써도 안 꼬여요</li><li>「10월에 가장 많이 팔린 메뉴는?」 같은 질문을 <b>말로</b> 물어볼 수 있어요. 그 말이 [[SQL]]이에요</li></ul><p>이 코스에서는 <b>동네 카페</b> 데이터 하나로 끝까지 배워요. 오른쪽 예제의 스키마 패널에 표 6개가 보여요.</p>`,
      example: { sql: `SELECT * FROM menu`, autoRun: true } },
    { title: '표·행·열', html: `<p>방금 본 결과가 [[테이블]](표) <code>menu</code>예요. 표는 두 방향으로 읽어요.</p><ul><li><b>[[행]](row)</b>: 가로 한 줄 = 데이터 <b>한 건</b>. 「아메리카노, 커피, 4000원」이 한 행이에요. menu 표에는 행이 10개, 즉 메뉴가 10개 있어요.</li><li><b>[[열]](column)</b>: 세로 한 줄 = <b>항목</b>. <code>id</code> <code>name</code> <code>category</code> <code>price</code> <code>is_hot</code> 다섯 열이에요. 열마다 이름과 자료형(숫자·글자)이 정해져 있어요.</li></ul><p>엑셀과 다른 점: 열은 미리 정해 두고 <b>모든 행이 같은 열</b>을 가져요. 한 칸에 「4000원 정도?」처럼 아무거나 적을 수 없어요. 그래서 질문이 가능해져요.</p><p>스키마 패널에서 <code>menu</code> 옆 ▸ 를 눌러 열 이름과 자료형, 샘플 3행을 확인해 보세요. 열 이름을 누르면 편집기에 들어가요.</p>`,
      example: { sql: `SELECT name, price FROM menu`, autoRun: true } },
    { title: '첫 SELECT 쳐 보기', html: `<p>SQL 의 첫 문장은 [[SELECT]]예요. 모양은 이래요.</p><pre>SELECT 열이름, 열이름\nFROM 표이름</pre><p>「<code>menu</code> 표에서 <code>name</code> 과 <code>price</code> 열을 보여 줘」가 <code>SELECT name, price FROM menu</code> 예요. 열 이름은 쉼표로 나누고, <code>*</code>(별표)는 「모든 열」이에요. 대소문자는 안 가리지만 키워드는 대문자로 쓰는 습관이 읽기 좋아요.</p><p>행을 고르고 싶으면 뒤에 <code>WHERE 조건</code>을 붙여요. 글자는 작은따옴표 <code>' '</code>로 감싸요.</p><pre>SELECT name, price\nFROM menu\nWHERE category = '커피'</pre><p>예제에서 <code>'커피'</code>를 <code>'음료'</code>로 바꿔 실행해 보세요(Ctrl+Enter 로도 실행돼요). 열 이름을 일부러 틀려서(<code>nmae</code>) 에러가 어떻게 나오는지도 보세요 — 영문 원문 아래에 한국어 풀이가 나와요.</p>`,
      example: { sql: `SELECT name, price\nFROM menu\nWHERE category = '커피'`, autoRun: true } },
    { title: '정리와 이 코스 사용법', html: `<p>정리해요.</p><ul><li>데이터베이스 = 서로 연결된 <b>표</b>들의 창고. 표는 <b>행</b>(한 건)과 <b>열</b>(항목)</li><li><code>SELECT 열 FROM 표</code> 로 보고, <code>WHERE 조건</code> 으로 행을 골라요</li><li>이 앱의 [[SQLite]]는 진짜예요. 쿼리를 치면 실제로 실행되고 결과가 표로 나와요</li></ul><p><b>문제 화면</b>은 이렇게 써요.</p><ul><li>왼쪽 편집기에 쿼리를 쓰고 <b>▶ 실행</b>(Ctrl+Enter)으로 결과를 확인해요. 몇 번이고 실행해도 돼요</li><li>결과 표의 열 이름을 누르면 정렬되고, 50행씩 넘겨 볼 수 있어요</li><li>맞다 싶으면 <b>✔ 제출하기</b>. 기대한 결과와 다르면 「기대 / 내 결과」 표가 나란히 나오고 다른 칸이 빨갛게 보여요</li><li>데이터를 바꾸는 쿼리(뒤 챕터)를 돌렸다가 망가뜨리면 <b>데이터 초기화</b>로 처음 상태로 돌아가요. 채점은 항상 깨끗한 데이터로 해요</li></ul><p>이제 문제 4개를 풀어요. 첫 문제는 방금 친 것과 같아요.</p>` },
  ],
  summary: ['데이터베이스는 서로 연결된 표들의 창고, 표는 행(한 건)과 열(항목)', 'SELECT 열 FROM 표 — 별표 * 는 모든 열', 'WHERE 조건으로 행을 고르고, 글자는 작은따옴표로'] },
{ id: 'S1', ch: 1, n: 1, title: 'SELECT·WHERE 로 고르기', mode: 'text', draft: true, tutorSummary: 'SELECT 열 FROM 표 WHERE 조건. 비교(= <> < > <= >=), AND/OR/NOT, LIKE(와일드카드 %·_), IN(목록), BETWEEN(범위). 글자는 작은따옴표.', pages: TODO('SELECT FROM WHERE 복습 → 비교 연산자 → AND/OR 괄호 → LIKE % _ → IN → BETWEEN. 예제는 전부 menu·customers 표'), summary: ['WHERE 조건으로 행을 고른다', 'AND/OR 는 괄호로 묶어 읽는다', 'LIKE 는 패턴, IN 은 목록, BETWEEN 은 범위'] },
{ id: 'S2', ch: 1, n: 2, title: '정렬·자르기·계산 열·NULL', mode: 'text', draft: true, tutorSummary: 'ORDER BY 열 ASC|DESC(여러 열), LIMIT n(OFFSET), 계산 열(price * qty)과 AS 별명, DISTINCT, NULL 은 「값 없음」(= 로 못 찾고 IS NULL).', pages: TODO('ORDER BY(여러 열·DESC) → LIMIT → 계산 열과 AS → DISTINCT → NULL 이란(customers.phone 이 NULL 인 손님, IS NULL / IS NOT NULL)'), summary: ['ORDER BY 로 줄 세우고 LIMIT 으로 자른다', '계산 열에는 AS 로 이름을 붙인다', 'NULL 은 비교가 아니라 IS NULL 로 찾는다'] },
{ id: 'S3', ch: 1, n: 3, title: '집계와 GROUP BY', mode: 'text', draft: true, tutorSummary: 'COUNT SUM AVG MIN MAX, GROUP BY 로 묶어 집계, HAVING 은 그룹 조건(WHERE 는 행 조건). COUNT(*) 와 COUNT(열) 차이(NULL).', pages: TODO('COUNT/SUM/AVG/MIN/MAX 한 줄 결과 → GROUP BY category(행이 그룹별로 모이는 그림) → HAVING vs WHERE → COUNT(*) vs COUNT(phone)'), summary: ['집계 함수는 여러 행을 한 값으로', 'GROUP BY 는 묶어서 집계, HAVING 은 그룹 조건', 'WHERE 는 행, HAVING 은 그룹'] },
{ id: 'SB1', ch: 1, boss: true, title: '보스: 이달 인기 메뉴 TOP 5 와 시간대별 매출', mode: 'text', draft: true, pages: TODO('보스 안내 한 쪽: order_items·menu·orders 로 10월 인기 메뉴 TOP 5(ordered:true), 시간대별(ordered_at 의 시) 매출 합계 보고서'), summary: [], tutorSummary: '챕터 A 종합(JOIN 전이라 표 하나씩만 쓴다). 문제 5개(sql rows): 10월 주문 수 / order_items 에서 menu_id 별 판매 수량 TOP 5(GROUP BY·ORDER BY·LIMIT, ordered:true) / 시간대(substr(ordered_at, 12, 2))별 매출 합계 / 평균 주문 금액 이상인 주문(서브쿼리 대신 지문에 평균값을 줌) / 손님별 주문 횟수. 메뉴 이름이 필요하면 지문에 menu_id↔이름 표를 보여 준다.' },
// ================= 챕터 B 합치기 =================
{ id: 'S4', ch: 2, n: 4, title: 'JOIN 1: 표를 왜 나누고 어떻게 합치나', mode: 'text', draft: true, tutorSummary: '외래 키(orders.customer_id → customers.id)로 표를 연결. INNER JOIN … ON 으로 키가 같은 행끼리 붙인다. 표이름.열이름, 별명(o, c).', pages: TODO('중복을 피하려고 표를 나눈다(손님 이름을 주문마다 적으면 생기는 일) → 외래 키 → INNER JOIN ON 그림(키가 같은 행끼리 선) → 별명 → 3개 열 고르기'), summary: ['표를 나누면 중복이 사라진다(외래 키)', 'JOIN … ON 키 = 키 로 붙인다', '표이름.열 또는 별명으로 어느 표의 열인지 밝힌다'] },
{ id: 'S5', ch: 2, n: 5, title: 'JOIN 2: LEFT JOIN·여러 표·셀프 조인', mode: 'text', draft: true, tutorSummary: 'LEFT JOIN 은 왼쪽 표의 짝 없는 행도 남긴다(NULL 로 채움) — 한 번도 주문 안 한 손님. 3개 이상 표 잇기(orders → order_items → menu). 같은 표를 두 번 쓰는 셀프 조인.', pages: TODO('INNER vs LEFT 그림(짝 없는 행이 NULL 로) → 주문 없는 손님 찾기(WHERE o.id IS NULL) → 3개 표 JOIN → 셀프 조인 맛보기(같은 카테고리 메뉴 짝)'), summary: ['LEFT JOIN 은 왼쪽을 다 남긴다', '짝 없는 행은 NULL — IS NULL 로 찾는다', 'JOIN 을 이어 붙이면 표 3개도 된다'] },
{ id: 'S6', ch: 2, n: 6, title: '서브쿼리·WITH·EXISTS', mode: 'text', draft: true, tutorSummary: '쿼리 안의 쿼리(WHERE price > (SELECT AVG(price) …)), IN (SELECT …), WITH 이름 AS (…) 로 이름 붙여 읽기 쉽게, EXISTS.', pages: TODO('스칼라 서브쿼리(평균보다 비싼 메뉴) → IN 서브쿼리 → WITH(CTE)로 단계 나누기 → EXISTS'), summary: ['괄호 안 쿼리의 결과를 바깥 쿼리가 쓴다', 'WITH 로 이름 붙이면 단계가 보인다', 'EXISTS 는 「있나 없나」'] },
{ id: 'S7', ch: 2, n: 7, title: 'CASE·날짜·문자열 함수', mode: 'text', draft: true, tutorSummary: 'CASE WHEN … THEN … ELSE … END 로 값 분류, 날짜 글자에서 substr/strftime 으로 월·시 뽑기, LENGTH UPPER LOWER || REPLACE.', pages: TODO('CASE 로 가격대 분류 → ordered_at 에서 월·시 뽑기(substr·strftime) → 문자열 함수(||, LENGTH, UPPER, REPLACE) → ROUND'), summary: ['CASE 는 SQL 의 if', '날짜 글자는 substr/strftime 으로 자른다', '문자열 함수로 모양을 다듬는다'] },
{ id: 'SB2', ch: 2, boss: true, title: '보스: 단골 분석 보고서', mode: 'text', draft: true, pages: TODO('보스 안내 한 쪽: 한 번도 안 온 단골(LEFT JOIN + IS NULL) · 직원별 판매 순위 · 재방문율(2회 이상 주문 손님 비율)'), summary: [], tutorSummary: '챕터 B 종합. 문제 5개: 주문 없는 손님 / 직원별 매출 순위(ordered) / 손님별 주문 횟수 2회 이상 / 메뉴별 판매 수량(3표 JOIN) / 재방문율(CASE·서브쿼리, 소수 2자리).' },
// ================= 챕터 C 바꾸기와 만들기 =================
{ id: 'S8', ch: 3, n: 8, title: 'INSERT·UPDATE·DELETE', mode: 'text', draft: true, tutorSummary: 'INSERT INTO 표 (열…) VALUES (…), UPDATE 표 SET 열 = 값 WHERE 조건, DELETE FROM 표 WHERE 조건. WHERE 를 빠뜨리면 전체가 바뀐다(이 앱이 경고를 보여 줌). 채점은 state(표의 최종 상태).', pages: TODO('INSERT(열 목록 생략의 위험) → UPDATE … WHERE → DELETE … WHERE → WHERE 없이 돌려 보기(「모든 행이 바뀌었어요!」 경험) → 데이터 초기화'), summary: ['INSERT 는 행 추가, UPDATE 는 값 바꾸기, DELETE 는 행 지우기', 'UPDATE·DELETE 는 WHERE 가 생명', '망가지면 데이터 초기화'] },
{ id: 'S9', ch: 3, n: 9, title: 'CREATE TABLE 과 제약 조건', mode: 'text', draft: true, tutorSummary: 'CREATE TABLE 표 (열 자료형 제약…). SQLite 자료형 INTEGER REAL TEXT, PRIMARY KEY, NOT NULL, UNIQUE, DEFAULT, FOREIGN KEY REFERENCES. 제약을 어기면 constraint failed 에러.', pages: TODO('CREATE TABLE 기본 → 자료형 → PRIMARY KEY/NOT NULL/UNIQUE/DEFAULT → FOREIGN KEY → 제약 위반 에러 읽기 → DROP TABLE'), summary: ['CREATE TABLE 로 표의 모양을 정한다', '제약 조건이 잘못된 데이터를 막는다', '외래 키는 다른 표의 기본 키를 가리킨다'] },
{ id: 'S10', ch: 3, n: 10, title: '설계: 중복을 왜 피하나(정규화 맛보기)·ERD', mode: 'text', draft: true, tutorSummary: '한 표에 다 적으면 생기는 갱신 이상(손님 전화번호를 주문마다 적으면). 1정규형(한 칸에 값 하나)·3정규형(키가 아닌 열은 키에만 의존) 맛보기. ERD 읽기(1:N 선).', pages: TODO('나쁜 표 예시(한 칸에 메뉴 여러 개) → 1NF → 갱신 이상 → 3NF 로 나누기 → 카페 ERD 읽기 → 내가 그려 보기(퀴즈)'), summary: ['한 칸엔 값 하나(1NF)', '같은 사실은 한 곳에만(3NF)', 'ERD 는 표와 관계선 그림'] },
{ id: 'S11', ch: 3, n: 11, title: '인덱스와 성능', mode: 'text', draft: true, tutorSummary: '인덱스 = 책 뒤 찾아보기. CREATE INDEX, EXPLAIN QUERY PLAN 으로 SCAN vs SEARCH 확인, 큰 표(10만 행, 예제에서 생성)에서 인덱스 전후 ms 비교. 인덱스는 쓰기를 느리게 하고 공간을 쓴다.', pages: TODO('찾아보기 비유 → EXPLAIN QUERY PLAN 읽기(SCAN/SEARCH) → 10만 행 만들기(WITH RECURSIVE) → CREATE INDEX 전후 ms(결과 표의 ms 표시) → 언제 안 만드나'), summary: ['인덱스는 찾기를 빠르게 하는 찾아보기', 'EXPLAIN QUERY PLAN 으로 SCAN 인지 SEARCH 인지 본다', '인덱스는 공짜가 아니다(쓰기·공간)'] },
{ id: 'S12', ch: 3, n: 12, title: '트랜잭션: 전부 되거나 전부 안 되거나', mode: 'text', draft: true, tutorSummary: 'BEGIN … COMMIT / ROLLBACK. 송금(두 UPDATE 가 하나로) 예제. 중간에 실패하면 ROLLBACK 으로 원상복구. 채점은 state.', pages: TODO('송금 문제(A 빼고 B 더하기 사이에 실패하면?) → BEGIN/COMMIT → ROLLBACK → 카페 예: 주문 넣기 + 재고 줄이기 를 한 묶음으로'), summary: ['트랜잭션은 여러 문장을 한 묶음으로', 'COMMIT 은 확정, ROLLBACK 은 취소', '전부 되거나 전부 안 되거나'] },
{ id: 'S13', ch: 3, n: 13, title: '파이썬 sqlite3 로 연결하기', mode: 'text', draft: true, tutorSummary: 'import sqlite3 → connect → cursor.execute → fetchall. 파라미터 바인딩 ? 로 SQL 인젝션 막기(문자열 더하기 금지). 파이썬 코스 미니 프로젝트와 연결. 이 레슨의 실행형 문제는 type:code(파이썬 러너)가 필요 — 뼈대에서는 quiz·fill 로.', pages: TODO('connect/execute/fetchall 흐름 → 결과를 리스트로 받기 → 문자열 더하기의 위험(인젝션) → ? 바인딩 → commit. 코드 실행이 필요한 문제는 Pyodide 가 이 코스 페이지에 없으니 결과 예측 퀴즈·빈칸으로(core 요청: 코스 안 파이썬 러너 병행)'), summary: ['connect → execute → fetch', 'SQL 은 문자열로 더하지 말고 ? 로', 'commit 해야 저장된다'] },
{ id: 'SB3', ch: 3, boss: true, title: '보스: 가계부를 DB 로', mode: 'text', draft: true, pages: TODO('보스 안내 한 쪽: ledger 데이터셋(datasets.js TODO) 위에서 표 설계(CREATE) → 입력(INSERT) → 월별 집계(GROUP BY) → 파이썬에서 호출(퀴즈)'), summary: [], tutorSummary: '미니 프로젝트형 보스. 문제 5개: CREATE TABLE entries(state) / INSERT 5건(state) / 월별 지출 합계(rows) / 카테고리별 비율(rows, 소수 2자리) / 파이썬 sqlite3 호출 코드 빈칸(fill).' },
];
const PROBLEMS = [
// ----- S0 데이터베이스란 (완성본 — 이 레슨이 C-S 의 본보기) -----
{ id: 'S0P1', lesson: 'S0', type: 'sql', title: '메뉴 표 전부 보기', xp: 20, tags: ['표읽기', 'SELECT'],
  prompt: `<p><code>menu</code> 표의 <b>모든 열, 모든 행</b>을 보여 주는 쿼리를 쓰세요. 레슨에서 친 것과 같아요.</p><p>결과는 10행 5열이면 돼요. 쓴 뒤 <b>▶ 실행</b>으로 확인하고 <b>✔ 제출하기</b>를 누르세요.</p>`,
  hints: ['SELECT 로 시작해서 FROM 뒤에 표 이름을 써요', '모든 열은 열 이름 대신 별표 * 예요', 'SELECT * FROM menu'],
  starter: '', solution: 'SELECT * FROM menu', sql: { dataset: 'cafe', expect: { kind: 'rows' } } },
{ id: 'S0P2', lesson: 'S0', type: 'quiz', title: '결과 예측: 몇 열이 나올까', xp: 10, tags: ['표읽기'],
  prompt: `<p>아래 쿼리를 실행하면 결과 표는 <b>몇 열</b>일까요? (menu 표에는 id, name, category, price, is_hot 다섯 열이 있어요)</p>`,
  quiz: { code: `SELECT name, price FROM menu`, opts: ['1열', '2열', '5열', '10열'], ans: 1, why: 'SELECT 뒤에 적은 열만 나와요. name 과 price 두 개니까 2열이에요. 행 수(10)는 WHERE 가 없으니 그대로예요.' },
  hints: ['SELECT 뒤에 적은 것이 열이에요', '쉼표로 나뉜 이름이 몇 개인지 세어 보세요', 'name, price → 2개'],
  solution: 'SELECT name, price FROM menu' },
{ id: 'S0P3', lesson: 'S0', type: 'fill', title: '빈칸: 손님 이름만 보기', xp: 15, tags: ['SELECT'],
  prompt: `<p><code>customers</code> 표에서 <code>name</code> 열만 보여 주는 쿼리예요. 빈칸을 채우세요.</p>`,
  fill: { code: `___1___ name\n___2___ customers`, blanks: [{ a: ['SELECT', 'select', 'Select'] }, { a: ['FROM', 'from', 'From'] }], why: 'SELECT 는 「어떤 열을」, FROM 은 「어느 표에서」예요. 순서는 항상 SELECT → FROM.' },
  hints: ['첫 줄은 「골라 줘」, 둘째 줄은 「어디서」예요', '첫 칸은 S 로 시작하는 키워드, 둘째 칸은 F 로 시작해요', 'SELECT name FROM customers'],
  solution: 'SELECT name\nFROM customers' },
{ id: 'S0P4', lesson: 'S0', type: 'sql', title: '커피만 골라 보기', xp: 25, tags: ['SELECT', 'WHERE'],
  prompt: `<p><code>menu</code> 표에서 <b>category 가 '커피' 인 행</b>만, <code>name</code> 과 <code>price</code> 두 열로 보여 주세요.</p><p>레슨 3쪽에서 친 쿼리와 같아요. 글자 조건은 작은따옴표로 감싸요. 결과는 5행이면 돼요.</p>`,
  hints: ['SELECT name, price FROM menu 뒤에 WHERE 를 붙여요', "WHERE category = '커피' — 커피는 작은따옴표로", "SELECT name, price FROM menu WHERE category = '커피'"],
  starter: 'SELECT name, price\nFROM menu\n', solution: "SELECT name, price FROM menu WHERE category = '커피'", sql: { dataset: 'cafe', expect: { kind: 'rows' } } },
// TODO(C-S): S1~S13·SB1~SB3 문제 (총 70개 이상 — 쿼리 작성 50% / 빈칸 20% / 결과 예측 15% / 틀린 곳 고치기 15%). 파일 끝에 PROBLEMS.push(...) 로.
];
const GUIDES = {};
const DRILLS = [];
