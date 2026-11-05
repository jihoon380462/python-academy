// courses/sql/datasets.js — SQL 코스 샘플 데이터셋 (EXPANSION.md 7절). 문제·예제를 열 때마다 이 SQL 로 메모리 DB 를 새로 만든다(Sql.fresh(id)).
// 키 = 데이터셋 id (문제의 p.sql.dataset · 예제의 example.dataset). 값 = CREATE TABLE + INSERT 문장(전부 결정적 값, 난수·현재 시각 없음).
//
// cafe(동네 카페) — 뼈대 크기: menu 10 · customers 8 · orders 30 · order_items 60 · staff 4 · shifts 12.
//   EXPANSION 7절 크기(menu 20 · customers 30 · orders 200 · order_items 500 · staff 6 · shifts 60)로 키우려면 손으로 고치지 말고
//   `python3 tools/gen_sql_dataset.py --full` 을 돌린다(아래 @gen cafe … @endgen 블록을 다시 씀. 시드 고정이라 결과가 늘 같다).
//   규칙: id 는 1부터 연속 / 날짜는 2026-08-10 ~ 2026-10-30(최근 3개월, 고정) / orders.total = SUM(order_items.qty * menu.price) /
//   customers.phone 하나는 NULL(NULL 레슨용) / orders.customer_id 일부 NULL(비회원 주문, LEFT JOIN 레슨용) / ordered_at 은 'YYYY-MM-DD HH:MM' 글자.
//   키운 뒤에는 `python3 tools/run_sql_solutions.py` 로 모든 정답 쿼리가 1행 이상 내는지 다시 확인한다(결과가 비는 문제는 지문·정답을 손본다).
//
// TODO(C-S): school(학교 — students·subjects·enrollments·scores, 다대다 JOIN 연습용 · S5~S6) 과 ledger(내 가계부 — entries·categories, SB3 미니 프로젝트용,
//   파이썬 코스 미니 프로젝트 2와 이어짐) 는 아직 없다. 추가할 때는 같은 꼴로 키를 늘리고 tools/validate/sql.mjs 가 자동으로 인식한다.
const SQL_DATASETS = {
  cafe: `
/* @gen cafe */
-- 동네 카페: menu(메뉴) customers(손님) orders(주문) order_items(주문 상세) staff(직원) shifts(근무)
CREATE TABLE menu (id INTEGER PRIMARY KEY, name TEXT NOT NULL, category TEXT NOT NULL, price INTEGER NOT NULL, is_hot INTEGER NOT NULL DEFAULT 1);
CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT NOT NULL, phone TEXT, joined_at TEXT NOT NULL, grade TEXT NOT NULL DEFAULT '일반');
CREATE TABLE staff (id INTEGER PRIMARY KEY, name TEXT NOT NULL, role TEXT NOT NULL, hourly_wage INTEGER NOT NULL, hired_at TEXT NOT NULL);
CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER REFERENCES customers(id), staff_id INTEGER NOT NULL REFERENCES staff(id), ordered_at TEXT NOT NULL, total INTEGER NOT NULL);
CREATE TABLE order_items (id INTEGER PRIMARY KEY, order_id INTEGER NOT NULL REFERENCES orders(id), menu_id INTEGER NOT NULL REFERENCES menu(id), qty INTEGER NOT NULL DEFAULT 1);
CREATE TABLE shifts (id INTEGER PRIMARY KEY, staff_id INTEGER NOT NULL REFERENCES staff(id), work_date TEXT NOT NULL, start_hour INTEGER NOT NULL, end_hour INTEGER NOT NULL);
INSERT INTO menu (id, name, category, price, is_hot) VALUES
(1, '아메리카노', '커피', 4000, 1),
(2, '카페라테', '커피', 4500, 1),
(3, '바닐라라테', '커피', 5000, 1),
(4, '카푸치노', '커피', 4500, 1),
(5, '콜드브루', '커피', 4800, 0),
(6, '녹차라테', '음료', 5000, 1),
(7, '유자차', '음료', 4500, 1),
(8, '딸기스무디', '음료', 5500, 0),
(9, '크루아상', '베이커리', 3500, 0),
(10, '치즈케이크', '베이커리', 6000, 0);
INSERT INTO customers (id, name, phone, joined_at, grade) VALUES
(1, '김민준', '010-1111-2222', '2026-07-03', '단골'),
(2, '이서연', NULL, '2026-08-15', '일반'),
(3, '박지호', '010-3333-4444', '2026-08-20', '일반'),
(4, '최수아', '010-5555-6666', '2026-06-11', '단골'),
(5, '정하준', '010-7777-8888', '2026-09-02', '일반'),
(6, '강지우', '010-9999-0000', '2026-09-18', '일반'),
(7, '윤서준', '010-2222-3333', '2026-05-27', '단골'),
(8, '임하은', '010-4444-5555', '2026-10-05', '일반');
INSERT INTO staff (id, name, role, hourly_wage, hired_at) VALUES
(1, '이사장', '점장', 12000, '2024-03-01'),
(2, '박바리', '바리스타', 10500, '2025-01-15'),
(3, '김알바', '알바', 10030, '2026-06-01'),
(4, '최알바', '알바', 10030, '2026-08-20');
INSERT INTO orders (id, customer_id, staff_id, ordered_at, total) VALUES
(1, 7, 4, '2026-08-10 19:45', 24400),
(2, 4, 4, '2026-08-15 19:30', 18000),
(3, NULL, 2, '2026-08-17 12:20', 8000),
(4, 2, 4, '2026-08-20 10:10', 17000),
(5, 3, 4, '2026-08-22 10:20', 17900),
(6, 7, 1, '2026-08-24 10:50', 9800),
(7, 6, 2, '2026-08-27 10:45', 9000),
(8, 8, 4, '2026-08-29 14:20', 18000),
(9, 2, 1, '2026-08-31 13:10', 17000),
(10, 2, 4, '2026-09-03 13:00', 17000),
(11, NULL, 2, '2026-09-05 13:05', 16000),
(12, 2, 4, '2026-09-07 08:05', 15000),
(13, NULL, 3, '2026-09-10 16:40', 17000),
(14, 8, 3, '2026-09-12 12:45', 17000),
(15, 3, 4, '2026-09-14 13:10', 14600),
(16, 8, 4, '2026-09-17 16:45', 14000),
(17, 5, 2, '2026-09-19 13:50', 12800),
(18, 1, 3, '2026-09-21 18:45', 15500),
(19, 1, 1, '2026-09-24 11:05', 11500),
(20, 4, 1, '2026-09-26 18:30', 9000),
(21, 3, 2, '2026-09-28 14:40', 20500),
(22, NULL, 4, '2026-10-01 12:40', 21400),
(23, 8, 2, '2026-10-03 13:00', 10000),
(24, 5, 4, '2026-10-08 12:30', 23400),
(25, 5, 4, '2026-10-10 12:30', 15500),
(26, NULL, 4, '2026-10-15 17:15', 8500),
(27, 5, 4, '2026-10-17 10:20', 14500),
(28, 3, 4, '2026-10-22 17:20', 8800),
(29, 3, 3, '2026-10-24 17:40', 19600),
(30, 1, 4, '2026-10-29 18:30', 18000);
INSERT INTO order_items (id, order_id, menu_id, qty) VALUES
(1, 1, 3, 2),
(2, 1, 5, 3),
(3, 2, 7, 1),
(4, 2, 2, 3),
(5, 3, 9, 1),
(6, 3, 4, 1),
(7, 4, 10, 2),
(8, 4, 3, 1),
(9, 5, 5, 3),
(10, 5, 9, 1),
(11, 6, 3, 1),
(12, 6, 5, 1),
(13, 7, 3, 1),
(14, 7, 1, 1),
(15, 8, 7, 1),
(16, 8, 4, 3),
(17, 9, 3, 1),
(18, 9, 10, 2),
(19, 10, 10, 2),
(20, 10, 3, 1),
(21, 11, 7, 2),
(22, 11, 9, 2),
(23, 12, 1, 1),
(24, 12, 8, 2),
(25, 13, 9, 1),
(26, 13, 7, 3),
(27, 14, 1, 2),
(28, 14, 4, 2),
(29, 15, 5, 2),
(30, 15, 6, 1),
(31, 16, 7, 2),
(32, 16, 6, 1),
(33, 17, 1, 2),
(34, 17, 5, 1),
(35, 18, 3, 1),
(36, 18, 9, 3),
(37, 19, 4, 1),
(38, 19, 9, 2),
(39, 20, 2, 1),
(40, 20, 7, 1),
(41, 21, 4, 3),
(42, 21, 9, 2),
(43, 22, 9, 2),
(44, 22, 5, 3),
(45, 23, 3, 1),
(46, 23, 6, 1),
(47, 24, 5, 3),
(48, 24, 2, 2),
(49, 25, 8, 2),
(50, 25, 2, 1),
(51, 26, 1, 1),
(52, 26, 4, 1),
(53, 27, 3, 2),
(54, 27, 7, 1),
(55, 28, 5, 1),
(56, 28, 1, 1),
(57, 29, 3, 2),
(58, 29, 5, 2),
(59, 30, 1, 2),
(60, 30, 6, 2);
INSERT INTO shifts (id, staff_id, work_date, start_hour, end_hour) VALUES
(1, 1, '2026-08-11', 14, 18),
(2, 2, '2026-08-16', 8, 13),
(3, 3, '2026-08-21', 13, 18),
(4, 4, '2026-08-26', 8, 12),
(5, 1, '2026-08-31', 9, 13),
(6, 2, '2026-09-05', 8, 14),
(7, 3, '2026-09-10', 9, 14),
(8, 4, '2026-09-15', 14, 18),
(9, 1, '2026-09-20', 14, 18),
(10, 2, '2026-09-25', 9, 15),
(11, 3, '2026-09-30', 14, 20),
(12, 4, '2026-10-05', 13, 19);
/* @endgen */
`,
};
