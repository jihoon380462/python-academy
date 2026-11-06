#!/usr/bin/env python3
"""tools/sql_book_run.py — SQL 교과서(courses/sql/book.js) 문제 한 개를 실제 SQLite 로 실행해 결과 표를 글자로 돌려준다 (v2.13.0).
check_book.mjs 가 문제마다 JSON 을 stdin 으로 넘긴다:
  { dataset, setup?, answer, check?, rollback?, expectError?, planOnly?, py?, input? }
SQL 문제: 새 메모리 DB 에 dataset → setup → answer 를 문장마다 실행(DB Browser 처럼 에러가 나면 거기서 멈춤 — expectError 면 그 에러여야 함)
  → rollback 이면 되돌림 → check(없으면 answer 의 마지막 SELECT) 결과를 「열 | 열」 머리줄 + 행으로.
  planOnly = EXPLAIN QUERY PLAN 의 detail 열만. NULL 은 NULL, 실수는 파이썬 repr(DB Browser 표시와 같음: 4650.0).
파이썬 문제(py): 임시 폴더에 cafe.db(dataset) 를 만들고 answer 를 main.py 로 실행(input 을 표준 입력으로) → 출력.
"""
import json, sqlite3, sys, os, tempfile, subprocess

def stmts(sql):
    out, buf = [], ''
    for line in sql.split('\n'):
        buf += line + '\n'
        if sqlite3.complete_statement(buf):
            if buf.strip(): out.append(buf.strip())
            buf = ''
    if buf.strip() and not all(l.strip().startswith('--') or not l.strip() for l in buf.split('\n')): out.append(buf.strip())
    return out

def fmt(cur, plan=False):
    rows = cur.fetchall()
    if plan: return '\n'.join(str(r[-1]) for r in rows)
    cols = [d[0] for d in cur.description]
    v = lambda x: 'NULL' if x is None else str(x)
    return '\n'.join([' | '.join(cols)] + [' | '.join(v(x) for x in r) for r in rows])

def main():
    t = json.load(sys.stdin)
    if t.get('py'):
        d = tempfile.mkdtemp(prefix='sqlbook-')
        c = sqlite3.connect(os.path.join(d, 'cafe.db')); c.executescript(t['dataset']); c.commit(); c.close()
        open(os.path.join(d, 'main.py'), 'w').write(t['answer'])
        r = subprocess.run([sys.executable, 'main.py'], cwd=d, input=t.get('input') or '', capture_output=True, text=True, timeout=10)
        print(json.dumps({'out': r.stdout, 'error': r.stderr.strip().split('\n')[-1] if r.returncode else None}, ensure_ascii=False)); return
    con = sqlite3.connect(':memory:', isolation_level=None)
    con.executescript(t['dataset'])
    if t.get('setup'): con.executescript(t['setup'])
    if t.get('rollback'): con.execute('BEGIN')
    err, last = None, None
    for s in stmts(t['answer']):
        try:
            cur = con.execute(s)
            if cur.description: last = fmt(cur, t.get('planOnly'))
        except sqlite3.Error as e:
            err = str(e); break
    exp = t.get('expectError')
    if exp and (not err or exp not in err): print(json.dumps({'out': None, 'error': f'에러 「{exp}」 가 나야 하는데: {err}'}, ensure_ascii=False)); return
    if err and not exp: print(json.dumps({'out': None, 'error': err}, ensure_ascii=False)); return
    if t.get('rollback'): con.execute('ROLLBACK')
    if t.get('check'):
        try: last = fmt(con.execute(t['check']), t.get('planOnly'))
        except sqlite3.Error as e: print(json.dumps({'out': None, 'error': 'check: ' + str(e)}, ensure_ascii=False)); return
    print(json.dumps({'out': last, 'error': None}, ensure_ascii=False))

main()
