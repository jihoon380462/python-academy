# tools/pre_syntax.py — 교과서 본문 <pre> 코드 블록 중 「파이썬 코드로 시작하는」 것이 문법에 맞는지(ast.parse) — check_book ⑭ 이 불러요 (v2.43.3)
# 2026-11-08 파이썬 QA: L18B/5 의 print(any([s = 50 for s in scores])) 가 SyntaxError 인데 아무 검사도 못 잡았음(LESSON.md R14)
# 입력(stdin): [{id, code}] JSON → 출력: [{id, msg, line}] JSON
# 출력 · 에러 화면 · 터미널 명령 · 폴더 그림 블록은 첫 줄이 코드 모양이 아니라 건너뜀. 「…」 로 일부만 보여 주는 조각도 건너뜀.
import ast, json, re, sys, textwrap, warnings
warnings.simplefilter('ignore')
CODE = re.compile(r'^(import |from \w[\w.]* import |(def|class|for|while|if|with)\b[^#]*:\s*(#.*)?$|try:|@\w|print\(|[A-Za-z_][\w.\[\]"\']*\s*[-+*/]?=[^=])')   # for · if 같은 줄은 「:」 로 끝날 때만(「for 로 더하기: 0.05초」 같은 출력 줄은 아님)
out = []
for it in json.load(sys.stdin):
    c = it['code']; lines = [l for l in c.split('\n') if l.strip()]
    if not lines or not CODE.match(lines[0].strip()) or '…' in c or '...' in c: continue
    if lines[-1].rstrip().endswith(':'): continue   # 머리줄(def …:)만 보여 주는 조각
    try: ast.parse(textwrap.dedent(c))   # 클래스 안 메서드만 떼어 보여 주는 조각은 들여쓰기를 걷어 내고
    except SyntaxError as e:
        bl = c.split('\n')[(e.lineno or 1) - 1] if e.lineno else ''
        out.append({'id': it['id'], 'msg': e.msg, 'line': bl.strip()[:80]})
print(json.dumps(out, ensure_ascii=False))
