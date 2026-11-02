# tools/e2e_submit/server.py — 정적 파일(저장소) + 가짜 Pyodide(실제 CPython 하위 프로세스). QA 6회전(2026-11-03)에서 만듦.
# CDN 이 막힌 환경에서도 앱 화면의 「▶ 실행·✔ 제출」을 끝까지 돌려 보려고 config.js 의 PYODIDE 주소만 이 서버로 바꿔 줘요(저장소 파일은 그대로).
# 사용: python3 tools/e2e_submit/server.py . 8766 /tmp/pa_fs   (그다음 e2e.py)
import http.server, json, os, sys, subprocess, socketserver
REPO = os.path.abspath(sys.argv[1]); PORT = int(sys.argv[2]); FS = os.path.abspath(sys.argv[3]); os.makedirs(FS, exist_ok=True)
PRE = {'code': ''}
MOCK = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'mock_pyodide.js')).read().replace('http://127.0.0.1:8766', 'http://127.0.0.1:%d' % PORT)
RUNNER = r'''
import sys, json, io
src = json.loads(sys.stdin.readline())
stdin_text = src.get('stdin', '')
real_out = sys.stdout
cap = io.StringIO()
sys.stdout = cap; sys.stdin = io.StringIO(stdin_text)
g = {'__name__': '__pa__'}
res = {}
try:
    exec(compile(src['pre'], '<pre>', 'exec'), g)
    if 'call' in src:
        res['ret'] = g[src['call']](*src['args'])
    else:
        code = src['code']
        try: res['v'] = eval(compile(code, '<x>', 'eval'), g)
        except SyntaxError:
            exec(compile(code, '<x>', 'exec'), g); res['v'] = None
except BaseException as e:
    res['error'] = type(e).__name__ + ': ' + str(e)
sys.stdout = real_out
res['out'] = cap.getvalue()
if not isinstance(res.get('v'), (str, int, float, type(None))): res['v'] = str(res['v'])
print(json.dumps(res))
'''
class H(http.server.SimpleHTTPRequestHandler):
    def __init__(s, *a, **k): super().__init__(*a, directory=REPO, **k)
    def log_message(s, *a): pass
    def end_headers(s):
        s.send_header('Cache-Control', 'no-store'); super().end_headers()
    def do_GET(s):
        p = s.path.split('?')[0]
        if p == '/__mock/pyodide.js':
            return s._send(MOCK.encode(), 'text/javascript')
        if p.startswith('/__mock/'):
            return s._send(b'{}' if p.endswith('.json') else b'x', 'application/octet-stream')
        if p == '/core/config.js':
            t = open(os.path.join(REPO, 'core/config.js'), encoding='utf-8').read()
            import re; t = re.sub(r"https://cdn\.jsdelivr\.net/pyodide/v[\d.]+/full/pyodide\.js", 'http://127.0.0.1:%d/__mock/pyodide.js' % PORT, t); t = re.sub(r"https://cdn\.jsdelivr\.net/pyodide/v[\d.]+/full/", 'http://127.0.0.1:%d/__mock/' % PORT, t)
            return s._send(t.encode(), 'text/javascript')
        return super().do_GET()
    def _send(s, b, ct, code=200):
        s.send_response(code); s.send_header('Content-Type', ct); s.send_header('Content-Length', str(len(b))); s.end_headers(); s.wfile.write(b)
    def do_POST(s):
        n = int(s.headers.get('Content-Length', 0)); req = json.loads(s.rfile.read(n) or b'{}')
        p = s.path
        try:
            if p == '/__py/fs':
                f = os.path.join(FS, os.path.basename(req['name'])); r = {}
                if req['op'] == 'w': open(f, 'w', encoding='utf-8').write(req.get('text', ''))
                elif req['op'] == 'rm':
                    if os.path.exists(f): os.remove(f)
                    else: r['error'] = 'ENOENT'
                elif req['op'] == 'r':
                    if os.path.exists(f): r['text'] = open(f, encoding='utf-8').read()
                    else: r['error'] = 'ENOENT'
                return s._send(json.dumps(r).encode(), 'application/json')
            if p == '/__py/run':
                if 'def __pa_run' in req['code']:
                    PRE['code'] = req['code']; return s._send(b'{"v":null}', 'application/json')
                job = {'pre': PRE['code'], 'code': req['code']}
            elif p == '/__py/call':
                job = {'pre': PRE['code'], 'call': req['name'], 'args': req['args'], 'stdin': req.get('stdin', '')}
            else:
                return s._send(b'{}', 'application/json', 404)
            try:
                pr = subprocess.run([sys.executable, '-c', RUNNER], input=json.dumps(job) + '\n', capture_output=True, text=True, timeout=8, cwd=FS)
                out = pr.stdout.strip().split('\n')[-1] if pr.stdout.strip() else json.dumps({'error': 'runner: ' + pr.stderr[-300:]})
            except subprocess.TimeoutExpired:
                # 무한 루프: 응답을 늦게 줘서 앱의 시간 초과(워커 재시작)가 먼저 일어나게
                out = json.dumps({'error': 'timeout'})
            return s._send(out.encode(), 'application/json')
        except Exception as e:
            return s._send(json.dumps({'error': repr(e)}).encode(), 'application/json')
class TS(socketserver.ThreadingMixIn, http.server.HTTPServer): daemon_threads = True; allow_reuse_address = True
os.chdir(FS)
TS(('127.0.0.1', PORT), H).serve_forever()
