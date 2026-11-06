#!/usr/bin/env python3
"""tools/build_cafe_db.py — SQL 교과서 연습 DB courses/sql/cafe.db 를 datasets.js 의 cafe 로 다시 만든다 (v2.13.0).
datasets.js 의 cafe 를 고치면 이걸 다시 돌린다. check_book.mjs 가 cafe.db 와 datasets.js 가 같은지(표별 내용) 검사한다.
"""
import os, re, sqlite3, sys
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
def cafe_sql():
    src = open(os.path.join(R, 'courses/sql/datasets.js'), encoding='utf8').read()
    m = re.search(r"\bcafe:\s*`(.*?)`", src, re.S)
    return m.group(1)
def build(path):
    if os.path.exists(path): os.remove(path)
    c = sqlite3.connect(path); c.executescript(cafe_sql()); c.commit(); c.execute('VACUUM'); c.close()
if __name__ == '__main__':
    out = os.path.join(R, 'courses/sql/cafe.db'); build(out); print('cafe.db', os.path.getsize(out), 'bytes')
