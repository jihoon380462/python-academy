#!/usr/bin/env python3
"""tools/pre_claims.py — 레슨 본문 <pre> 코드의 「print(x)   # 결과」 주석이 실제 출력과 같은지 (v2.15.4, check_book ⑨ 가 부름)
stdin: JSON [{id, code}] → stdout: JSON [{id, line, claim, got}] (다른 것만). 코드가 에러로 멈추면(앞 쪽 변수가 필요한 조각 등) 그 조각은 건너뜀.
주석이 값처럼 생겼을 때만(숫자·[ ( { ' " True False None 으로 시작) 비교 — 「# 단어 수」 같은 설명 주석은 안 봄. 같은 줄이 여러 번 출력하면(반복) 하나라도 같으면 통과."""
import sys, json, io, builtins, contextlib, re, ast
items = json.load(sys.stdin); bad = []
VAL = re.compile(r"^(-?\d|\[|\(|\{|'|\"|True\b|False\b|None\b)")
def claim_of(c):
    c = c.strip()
    for sep in [' — ', ' ← ', ' ⇒ ', '  ', ' (', ' →']:
        if sep in c: c = c.split(sep)[0]
    return c.strip()
for it in items:
    code = it['code']
    if 'input(' in code or 'open(' in code or 'import turtle' in code or 'time.' in code or 'random' in code: continue
    lines = code.split('\n'); claims = {}
    for n, ln in enumerate(lines, 1):
        m = re.match(r'^(\s*print\(.*\))\s+#\s*(.+)$', ln)
        if m:
            cl = claim_of(m.group(2))
            if VAL.match(cl) and not re.match(r'^-?\d+[가-힣]', cl): claims[n] = cl  # 「3이 처음 나오는 자리」 처럼 숫자로 시작하는 설명은 빼고
    if not claims: continue
    rec = {}
    real = builtins.print
    def p(*a, **k):
        f = sys._getframe(1); buf = io.StringIO(); real(*a, **{**k, 'file': buf}); rec.setdefault(f.f_lineno, []).append(buf.getvalue().rstrip('\n'))
    g = {'__name__': '__main__', 'print': p}
    try:
        with contextlib.redirect_stdout(io.StringIO()): exec(compile(code, '<pre>', 'exec'), g)
    except BaseException as e:
        continue
    sq = lambda s: re.sub(r'\s+', ' ', s).strip()
    for n, cl in claims.items():
        outs = rec.get(n, [])
        if not outs: continue
        def lit_eq(a, b):
            try: return ast.literal_eval(a) == ast.literal_eval(b)
            except Exception: return False
        joined = ', '.join(outs)  # 반복에서 여러 번 찍는 줄: 「# 0, 1, 2」
        ok = any(sq(o) == sq(cl) or sq(o).startswith(sq(cl)) or sq(cl).startswith(sq(o) + ' ') or lit_eq(o, cl) for o in outs) or (len(outs) > 1 and (sq(cl).startswith(sq(joined)) or sq(joined) == sq(cl)))
        if not ok: bad.append({'id': it['id'], 'line': lines[n-1].strip(), 'claim': cl, 'got': outs[0][:120]})
print(json.dumps(bad, ensure_ascii=False))
