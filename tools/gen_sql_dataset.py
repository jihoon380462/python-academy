#!/usr/bin/env python3
# tools/gen_sql_dataset.py — SQL 코스 「동네 카페」 데이터셋 생성기 (결정적: 시드 고정, 돌릴 때마다 같은 SQL).
#   사용: python3 tools/gen_sql_dataset.py            → courses/sql/datasets.js 의 cafe 블록(/* @gen cafe */ … /* @endgen */)을 다시 씀
#        python3 tools/gen_sql_dataset.py --print    → SQL 만 표준 출력
#        python3 tools/gen_sql_dataset.py --full     → EXPANSION 7절 크기(menu 20·customers 30·orders 200·order_items 500·staff 6·shifts 60)
#   뼈대 기본 크기: menu 10 · customers 8 · orders 30 · order_items 60 · staff 4 · shifts 12.
#   규칙(Opus 가 키울 때도 그대로): id 는 1부터 연속 / 날짜는 2026-08-10 ~ 2026-10-30(최근 3개월, 고정) / orders.total = SUM(qty*price) 와 일치 /
#   customers.phone 하나는 NULL(NULL 레슨용) / orders.customer_id 일부 NULL(비회원) / 값은 전부 시드 난수라 재생성해도 같다.
import random, sys, os, re
SIZES = dict(menu=10, customers=8, orders=30, items=60, staff=4, shifts=12)
if '--full' in sys.argv: SIZES = dict(menu=20, customers=30, orders=200, items=500, staff=6, shifts=60)
R = random.Random(20261105)
MENU = [('아메리카노','커피',4000,1),('카페라테','커피',4500,1),('바닐라라테','커피',5000,1),('카푸치노','커피',4500,1),('콜드브루','커피',4800,0),
        ('녹차라테','음료',5000,1),('유자차','음료',4500,1),('딸기스무디','음료',5500,0),('크루아상','베이커리',3500,0),('치즈케이크','베이커리',6000,0),
        ('에스프레소','커피',3500,1),('플랫화이트','커피',5000,1),('아이스티','음료',4000,0),('레모네이드','음료',4800,0),('핫초코','음료',4800,1),
        ('소금빵','베이커리',3200,0),('스콘','베이커리',3800,0),('브라우니','베이커리',4200,0),('샌드위치','베이커리',6500,0),('바게트','베이커리',4000,0)]
CUST = [('김민준','010-1111-2222','2026-07-03','단골'),('이서연',None,'2026-08-15','일반'),('박지호','010-3333-4444','2026-08-20','일반'),('최수아','010-5555-6666','2026-06-11','단골'),
        ('정하준','010-7777-8888','2026-09-02','일반'),('강지우','010-9999-0000','2026-09-18','일반'),('윤서준','010-2222-3333','2026-05-27','단골'),('임하은','010-4444-5555','2026-10-05','일반'),
        ('한도윤','010-6666-7777','2026-07-21','일반'),('오시우','010-8888-9999','2026-08-01','일반'),('서예준','010-1212-3434','2026-09-09','단골'),('신지안','010-5656-7878','2026-10-12','일반'),
        ('권유나','010-9090-1010','2026-06-30','일반'),('황이준','010-2323-4545','2026-07-14','단골'),('안서윤','010-6767-8989','2026-08-28','일반'),('송주원','010-0101-2323','2026-09-25','일반'),
        ('류하린','010-4545-6767','2026-10-01','일반'),('문은우','010-8989-0101','2026-06-05','단골'),('배소율','010-3434-5656','2026-07-29','일반'),('조지훈','010-7878-9090','2026-08-09','일반'),
        ('허아린','010-1313-2424','2026-09-14','일반'),('남시아','010-3535-4646','2026-10-20','일반'),('노준서','010-5757-6868','2026-06-18','단골'),('하지민','010-7979-8080','2026-07-07','일반'),
        ('전수빈','010-9191-0202','2026-08-24','일반'),('홍예린','010-2424-3535','2026-09-30','일반'),('유태양','010-4646-5757','2026-10-08','일반'),('백채원','010-6868-7979','2026-05-15','단골'),
        ('심재원','010-8080-9191','2026-07-25','일반'),('장다은','010-0202-1313','2026-08-30','일반')]
STAFF = [('이사장','점장',12000,'2024-03-01'),('박바리','바리스타',10500,'2025-01-15'),('김알바','알바',10030,'2026-06-01'),('최알바','알바',10030,'2026-08-20'),('정바리','바리스타',10800,'2025-07-10'),('오알바','알바',10030,'2026-09-05')]
def q(v): return 'NULL' if v is None else (str(v) if isinstance(v, int) else "'" + str(v).replace("'", "''") + "'")
def row(vals): return '(' + ', '.join(q(v) for v in vals) + ')'
def build():
    menu = MENU[:SIZES['menu']]; cust = CUST[:SIZES['customers']]; staff = STAFF[:SIZES['staff']]
    days = []; y, m, d = 2026, 8, 10
    import datetime; cur = datetime.date(2026, 8, 10); end = datetime.date(2026, 10, 30)
    while cur <= end: days.append(cur.isoformat()); cur += datetime.timedelta(days=1)
    orders = []; items = []; iid = 1
    per = max(1, SIZES['items'] // SIZES['orders'])
    for oid in range(1, SIZES['orders'] + 1):
        day = days[(oid * 7 + 3) % len(days)]; hour = R.choice([8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]); minute = R.choice([0, 5, 10, 15, 20, 30, 40, 45, 50])
        cid = None if R.random() < 0.2 else R.randint(1, len(cust)); sid = R.randint(1, len(staff))
        n = per + (1 if oid <= SIZES['items'] - per * SIZES['orders'] else 0)
        chosen = R.sample(range(1, len(menu) + 1), min(n, len(menu))); total = 0
        for mid in chosen:
            qty = R.choice([1, 1, 1, 2, 2, 3]); items.append((iid, oid, mid, qty)); total += qty * menu[mid - 1][2]; iid += 1
        orders.append((oid, cid, sid, f'{day} {hour:02d}:{minute:02d}', total))
    orders.sort(key=lambda o: o[3]); remap = {o[0]: i + 1 for i, o in enumerate(orders)}
    orders = [(remap[o[0]], o[1], o[2], o[3], o[4]) for o in orders]; items = [(it[0], remap[it[1]], it[2], it[3]) for it in items]; items.sort(key=lambda it: (it[1], it[0])); items = [(i + 1, it[1], it[2], it[3]) for i, it in enumerate(items)]
    shifts = []
    for k in range(SIZES['shifts']):
        sid = k % len(staff) + 1; day = days[(k * 5 + 1) % len(days)]; start = R.choice([8, 9, 13, 14]); shifts.append((k + 1, sid, day, start, start + R.choice([4, 5, 6])))
    L = []
    L.append("-- 동네 카페: menu(메뉴) customers(손님) orders(주문) order_items(주문 상세) staff(직원) shifts(근무)")
    L.append("CREATE TABLE menu (id INTEGER PRIMARY KEY, name TEXT NOT NULL, category TEXT NOT NULL, price INTEGER NOT NULL, is_hot INTEGER NOT NULL DEFAULT 1);")
    L.append("CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT NOT NULL, phone TEXT, joined_at TEXT NOT NULL, grade TEXT NOT NULL DEFAULT '일반');")
    L.append("CREATE TABLE staff (id INTEGER PRIMARY KEY, name TEXT NOT NULL, role TEXT NOT NULL, hourly_wage INTEGER NOT NULL, hired_at TEXT NOT NULL);")
    L.append("CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER REFERENCES customers(id), staff_id INTEGER NOT NULL REFERENCES staff(id), ordered_at TEXT NOT NULL, total INTEGER NOT NULL);")
    L.append("CREATE TABLE order_items (id INTEGER PRIMARY KEY, order_id INTEGER NOT NULL REFERENCES orders(id), menu_id INTEGER NOT NULL REFERENCES menu(id), qty INTEGER NOT NULL DEFAULT 1);")
    L.append("CREATE TABLE shifts (id INTEGER PRIMARY KEY, staff_id INTEGER NOT NULL REFERENCES staff(id), work_date TEXT NOT NULL, start_hour INTEGER NOT NULL, end_hour INTEGER NOT NULL);")
    L.append("INSERT INTO menu (id, name, category, price, is_hot) VALUES\n" + ',\n'.join(row((i + 1,) + m) for i, m in enumerate(menu)) + ';')
    L.append("INSERT INTO customers (id, name, phone, joined_at, grade) VALUES\n" + ',\n'.join(row((i + 1,) + c) for i, c in enumerate(cust)) + ';')
    L.append("INSERT INTO staff (id, name, role, hourly_wage, hired_at) VALUES\n" + ',\n'.join(row((i + 1,) + s) for i, s in enumerate(staff)) + ';')
    L.append("INSERT INTO orders (id, customer_id, staff_id, ordered_at, total) VALUES\n" + ',\n'.join(row(o) for o in orders) + ';')
    L.append("INSERT INTO order_items (id, order_id, menu_id, qty) VALUES\n" + ',\n'.join(row(it) for it in items) + ';')
    L.append("INSERT INTO shifts (id, staff_id, work_date, start_hour, end_hour) VALUES\n" + ',\n'.join(row(s) for s in shifts) + ';')
    return '\n'.join(L) + '\n'
sql = build()
if '--print' in sys.argv: print(sql); sys.exit(0)
path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'courses/sql/datasets.js')
src = open(path, encoding='utf-8').read()
new = re.sub(r'(/\* @gen cafe \*/\n)[\s\S]*?(/\* @endgen \*/)', lambda m: m.group(1) + sql + m.group(2), src)
assert new != src or sql in src, '@gen cafe 마커를 못 찾았어요'
open(path, 'w', encoding='utf-8').write(new); print('datasets.js cafe 블록 갱신:', {k: v for k, v in SIZES.items()})
