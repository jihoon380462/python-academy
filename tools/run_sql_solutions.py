#!/usr/bin/env python3
# tools/run_sql_solutions.py — 데이터베이스(SQL) 코스 정답 검증 (네트워크 불필요, Python 표준 sqlite3).
#   courses/sql/datasets.js 에서 데이터셋 SQL 을 뽑아(정규식) 메모리 DB 를 만들고,
#   courses/sql/content.js 의 모든 sql 문제(type:'sql')의 solution(또는 expect.query)과 레슨 예제(example.sql)를 실행해
#   · 에러 없음 · rows 문제는 결과가 1행 이상 · state 문제는 expect.table 이 존재하고 실행 뒤에도 조회됨 을 확인한다.
#   사용: python3 tools/run_sql_solutions.py   (content.js 는 tools/load_content.mjs 로 읽어 JSON 으로 받는다 — node 필요)
import json, os, re, sqlite3, subprocess, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
def datasets():
    src = open(os.path.join(ROOT, 'courses/sql/datasets.js'), encoding='utf-8').read()
    body = src[src.index('SQL_DATASETS'):]
    out = {}
    for m in re.finditer(r'^\s{2}(\w+):\s*`([\s\S]*?)`', body, re.M): out[m.group(1)] = m.group(2)
    return out
def load_course():
    js = "import { loadCourse } from './tools/load_content.mjs'; const c = loadCourse('sql'); console.log(JSON.stringify({ PROBLEMS: c.PROBLEMS, LESSONS: c.LESSONS.map(l => ({ id: l.id, pages: (l.pages || []).map(p => ({ example: p.example || null })) })) }));"
    r = subprocess.run(['node', '--input-type=module', '-e', js], cwd=ROOT, capture_output=True, text=True)
    if r.returncode: print(r.stderr); sys.exit(1)
    return json.loads(r.stdout)
def fresh(sql):
    db = sqlite3.connect(':memory:'); db.executescript(sql); return db
def run(db, q):
    cur = db.cursor()
    # executescript 는 결과를 안 돌려주므로 문장을 나눠 마지막 결과 집합을 가져온다(sql.js 의 db.exec 와 같은 규칙)
    stmts = [s for s in split_statements(q) if s.strip()]
    rows, cols = None, None
    for s in stmts:
        cur.execute(s)
        if cur.description: cols = [d[0] for d in cur.description]; rows = cur.fetchall()
    db.commit(); return cols, rows
def split_statements(q):
    # 작은따옴표 안의 ; 는 무시
    out, cur, inq = [], '', False
    for ch in q:
        if ch == "'": inq = not inq
        if ch == ';' and not inq: out.append(cur); cur = ''
        else: cur += ch
    out.append(cur); return out
DS = datasets(); C = load_course(); fails = []; n = 0
if not DS: print('datasets.js 에서 데이터셋을 못 찾았어요'); sys.exit(1)
for k, sql in DS.items():
    try: fresh(sql).close()
    except Exception as e: fails.append((f'dataset {k}', str(e)))
for p in C['PROBLEMS']:
    if p.get('type') != 'sql': continue
    n += 1; spec = p.get('sql') or {}; ex = spec.get('expect') or {}; ds = DS.get(spec.get('dataset', 'cafe'))
    if ds is None: fails.append((p['id'], f"dataset {spec.get('dataset')} 없음")); continue
    q = ex.get('query') or p.get('solution') or ''
    try:
        db = fresh(ds); cols, rows = run(db, q)
        if ex.get('kind') == 'state':
            t = ex.get('table'); c2, r2 = run(db, f'SELECT * FROM "{t}"')
            if c2 is None: fails.append((p['id'], f'state: 표 {t} 를 조회하지 못함'))
        else:
            if cols is None: fails.append((p['id'], 'rows: 정답 쿼리가 결과 집합을 내지 않음(SELECT 가 아님?)'))
            elif not rows: fails.append((p['id'], 'rows: 정답 결과가 0행 — 데이터셋과 지문을 확인'))
        db.close()
    except Exception as e: fails.append((p['id'], f'정답 쿼리 에러: {e}'))
    st = p.get('starter')
    if st and st.strip() and not ex.get('query'):
        # 시작 쿼리가 이미 정답과 같은 결과를 내면 문제가 아니다
        try:
            db = fresh(ds); c1, r1 = run(db, st); db.close(); db = fresh(ds); c2, r2 = run(db, q); db.close()
            if ex.get('kind') == 'rows' and c1 is not None and r1 is not None and sorted(map(str, r1)) == sorted(map(str, r2)) and [c.lower() for c in c1] == [c.lower() for c in c2]: fails.append((p['id'], 'starter 가 이미 정답과 같은 결과를 내요'))
        except Exception: pass
m = 0
for l in C['LESSONS']:
    for i, pg in enumerate(l['pages']):
        ex = pg.get('example')
        if not ex or ex.get('sql') is None: continue
        m += 1; ds = DS.get(ex.get('dataset', 'cafe'))
        if ds is None: fails.append((f"{l['id']} p{i}", f"example.dataset {ex.get('dataset')} 없음")); continue
        try: db = fresh(ds); run(db, ex['sql']); db.close()
        except Exception as e: fails.append((f"{l['id']} p{i}", f'예제 쿼리 에러: {e}'))
print('FAILS', len(fails)); [print(' ', f) for f in fails]
print(f'검증한 sql 문제 {n} · 예제 {m} · 데이터셋 {", ".join(DS)}')
if fails: sys.exit(1)
print('✓ run_sql_solutions OK')
