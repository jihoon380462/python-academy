// tools/check_book.mjs — 교과서(book.js) 검사 (v2.9.0 파이썬 · v2.10.0 터미널·Git). `node tools/check_book.mjs [코스id]` (없으면 book.js 가 있는 코스 전부)
// ① 「필요한 문법」 링크가 있는 레슨·쪽을 가리키는지 ② pid 가 있는 문제인지 ③ 예시 답을 실제로 돌려 출력 예와 같은지 (noRun 은 건너뜀)
//   파이썬 코스: python3 로 answer 실행 · 셸 코스(runner:'shell'): bash 로 setup → answer → check 실행(HOME 은 임시 폴더, 출력의 그 경로는 /c/Users/me 로 바꿔 비교)
import fs from 'fs'; import vm from 'vm'; import os from 'os'; import path from 'path'; import { execFileSync, spawnSync } from 'child_process';
const R = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const want = process.argv[2]; const courses = fs.readdirSync(R + '/courses').filter(d => fs.existsSync(`${R}/courses/${d}/book.js`) && (!want || d === want));
let total = 0;
for (const cid of courses) total += checkCourse(cid);
process.exit(total ? 1 : 0);
function checkCourse(cid) {
const ctx = { window: {}, console }; vm.createContext(ctx);
vm.runInContext((fs.existsSync(`${R}/courses/${cid}/datasets.js`) ? fs.readFileSync(`${R}/courses/${cid}/datasets.js`, 'utf8').replace(/^(const|let) /gm, 'var ') + '\n' : '') + fs.readFileSync(`${R}/courses/${cid}/content.js`, 'utf8').replace(/^(const|let) /gm, 'var ') + '\n' + fs.readFileSync(`${R}/courses/${cid}/book.js`, 'utf8').replace(/^const /gm, 'var ') + '\n' + fs.readFileSync(`${R}/core/book-derive.js`, 'utf8').replace(/^const /gm, 'var '), ctx); // v2.15.0: 화면과 같은 core/book-derive.js 로 출력 예·예시 답을 만듦
const { LESSONS, PROBLEMS, BOOK, COURSE } = ctx; const L = Object.fromEntries(LESSONS.map(l => [l.id, l])); const P = Object.fromEntries(PROBLEMS.map(p => [p.id, p]));
const SHELL = COURSE && COURSE.runner === 'shell'; const VIM = BOOK.check === 'vim'; const SQLB = BOOK.check === 'sql'; // v2.13.0 SQL 교과서: tools/sql_book_run.py 로 실제 SQLite 실행 // v2.11.0 Vim 교과서: 진짜 vim 으로 키 넣기
const pagesOf = (lid) => lid === 'SETUP' ? BOOK.setup.pages : (BOOK.lessonPages || {})[lid] || (L[lid] || {}).pages;
for (const lid of Object.keys(BOOK.lessonPages || {})) if (!L[lid]) bad(`lessonPages ${lid}: 없는 레슨`);
let fails = 0, ran = 0, n = 0;
for (const [lid, tasks] of Object.entries(BOOK.tasks)) {
  if (!L[lid]) bad(`없는 레슨 ${lid}`);
  tasks.forEach((t, i) => {
    n++; const id = `${lid}#${i + 1} ${t.title}`; const p = t.pid ? P[t.pid] : null;
    if (t.pid && !p) return bad(`${id}: 없는 문제 ${t.pid}`);
    for (const nd of t.needs || []) if (nd.length !== 3 || !nd[2] || !/[A-Za-z0-9=+*\/%\[\](){}"<>.:▷|~$&^#`-]/.test(nd[0])) bad(`${id}: 필요한 문법은 [실제 문법(코드), '레슨/쪽', 설명] 이어야 해요 (v2.9.2) → ${JSON.stringify(nd)}`);
    for (const [name, ref] of t.needs || []) { const [nl, np] = String(ref).split('/'); const pages = pagesOf(nl); if (!pages || !(+np >= 0 && +np < pages.length)) bad(`${id}: 필요한 문법 「${name}」 → ${ref} 가 없는 쪽`); }
    if (t.text === '@prompt' && !p) bad(`${id}: @prompt 인데 pid 없음`);
    const dv = ctx.BookDerive.task(t, p, BOOK); const io = dv.io; const answer = dv.answer; const pyCheck = !SHELL && !VIM && !SQLB && dv.check ? '\n' + dv.check + '\n' : ''; // 함수 문제: 확인 코드(print(호출))를 답 아래에 붙여 돌림
    if (dv.text && /👀|시각화|▶ 실행|입력창/.test(dv.text) && BOOK.fixPrompt) bad(`${id}: 지문에 이 앱 버튼 안내가 남음 「${(dv.text.match(/.{0,20}(👀|시각화|▶ 실행|입력창).{0,20}/) || [''])[0].replace(/<[^>]+>/g, '')}」 — BOOK.fixPrompt 로 지우거나 text 를 직접 쓰세요`);
    if (!answer) bad(`${id}: 예시 답 없음`);
    if (/(^|[^$]){{/.test(JSON.stringify(io) + '\n' + answer)) /* ${{ … }} 는 GitHub Actions 문법이라 제외 */ bad(`${id}: {{바꿔 끼우기}} 자리표시가 남음 — io·answer 를 직접 적으세요`);
    const GHB = ['github', 'linux'].includes(BOOK.check); if (GHB && t.noRun && !(t.checks || []).length) bad(`${id}: 화면에서 하는 문제인데 「확인할 것」(checks) 없음`); /* v2.21.0 리눅스 교과서도 같은 방식(화면 = ☐ · 명령 = bash) */ // v2.16.0 GitHub 교과서: 화면 문제는 checks, 명령 문제는 셸로
    if (t.noRun) return;
    if (GHB) { if (!t.setup) bad(`${id}: 명령 문제인데 준비 명령(setup) 없음`); for (const c of io) runShell(id, t, answer, c); return; }
    if (BOOK.check === 'web') { if (!(t.checks || []).length) bad(`${id}: 「브라우저에서 확인할 것」(checks) 없음`); return; } // v2.14.0 웹 교과서: 실제 검사는 tools/run_web_solutions.py(브라우저)
    if (SQLB) { for (const c of io) runSqlTask(id, t, answer, c); return; }
    if (VIM) { if (!t.setup) bad(`${id}: 준비 명령(setup) 없음`); for (const c of io) runVim(id, t, answer, c); return; }
    if (SHELL) { if (!t.setup) bad(`${id}: 준비 명령(setup) 없음`); for (const c of io) runShell(id, t, answer, c); return; }
    for (const c of io) {
      if (c.output == null) { bad(`${id}: 출력 예 없음`); continue; }
      const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'book-')); const up = p && p.files && p.files.upload; if (up && up.sample) fs.writeFileSync(path.join(dir, up.name), up.sample); if (t.prep) fs.writeFileSync(path.join(dir, t.prep.name), t.prep.text);
      fs.writeFileSync(path.join(dir, 'main.py'), answer + pyCheck);
      let out; try { out = execFileSync('python3', ['main.py'], { cwd: dir, input: c.input || '', encoding: 'utf8', timeout: 8000, stdio: ['pipe', 'pipe', 'pipe'] }); } catch (e) { bad(`${id}: 실행 에러 ${String(e.stderr || e.message).trim().split('\n').pop()}`); continue; }
      ran++; const norm = (s) => String(s).replace(/\r/g, '').split('\n').map(x => x.replace(/\s+$/, '')).join('\n').replace(/\n+$/, '');
      if (norm(out) !== norm(c.output)) bad(`${id}: 출력이 달라요\n      기대: ${JSON.stringify(norm(c.output))}\n      실제: ${JSON.stringify(norm(out))}`);
    }
  });
}
if (SQLB) { // v2.13.0: 사이트에서 받는 cafe.db 가 datasets.js 의 cafe 와 같은지(표마다 전체 행) — 다르면 python3 tools/build_cafe_db.py
  const py = `import sqlite3,sys,json\na=sqlite3.connect(sys.argv[1]);b=sqlite3.connect(':memory:');b.executescript(json.load(sys.stdin))\nts=[r[0] for r in b.execute("select name from sqlite_master where type='table' order by name")]\nbad=[t for t in ts if a.execute(f'select * from {t} order by 1').fetchall()!=b.execute(f'select * from {t} order by 1').fetchall()]\nprint(','.join(bad) or 'OK')`;
  let o; try { o = execFileSync('python3', ['-c', py, `${R}/courses/sql/cafe.db`], { input: JSON.stringify(ctx.SQL_DATASETS.cafe), encoding: 'utf8' }).trim(); } catch (e) { o = String(e.stderr || e.message).trim().split('\n').pop(); }
  ran++; if (o !== 'OK') bad(`courses/sql/cafe.db 가 datasets.js 와 달라요(${o}) — python3 tools/build_cafe_db.py`);
}
if (VIM) { // 교과서가 권하는 _vimrc 를 진짜 vim 이 에러 없이 읽는지 + .py 에서 들여쓰기 설정이 실제로 켜지는지
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'vimrc-')); fs.writeFileSync(path.join(home, 'vimrc'), ctx.VIMRC_BASE_TEXT); fs.writeFileSync(path.join(home, 't.py'), 'x = 1\n');
  try { execFileSync('vim', ['-N', '-u', path.join(home, 'vimrc'), '-i', 'NONE', '-n', '-es', '-c', 'redir! > out.txt', '-c', 'echo "ERR[" . v:errmsg . "]"', '-c', 'set ft? et? sw? sts? ai?', '-c', 'nmap <F5>', '-c', 'redir END', '-c', 'qa!', 't.py'], { cwd: home, env: { PATH: process.env.PATH, HOME: home }, timeout: 10000, stdio: 'ignore' }); } catch (e) {}
  const o = fs.existsSync(path.join(home, 'out.txt')) ? fs.readFileSync(path.join(home, 'out.txt'), 'utf8') : ''; ran++;
  if (!/ERR\[\]/.test(o) || !/filetype=python/.test(o) || !/\bexpandtab/.test(o) || !/shiftwidth=4/.test(o) || !/softtabstop=4/.test(o) || !/\bautoindent/.test(o) || !/:!python %/.test(o)) bad(`기본 _vimrc 가 vim 에서 제대로 안 읽힘:\n${o.trim()}`);
}
for (const [k, o2] of Object.entries(BOOK.pages || {})) { const [pl, pi] = k.split('/'); const pg = (pagesOf(pl) || [])[+pi]; if (!pg) { bad(`pages ${k}: 없는 쪽`); continue; } for (const [a] of o2.rep || []) if (!pg.html.includes(a)) bad(`pages ${k}: 바꿀 글을 못 찾음 「${a.slice(0, 40)}」`); }
for (const k of Object.keys(BOOK.titles || {})) { const [tl, ti] = k.split('/'); if (!(pagesOf(tl) || [])[+ti]) bad(`titles ${k}: 없는 쪽`); }
(BOOK.builtins || []).forEach((bi, i) => { n++; const id = `내장 함수 ${bi.name}`; if (bi.ref) { const [bl, bp] = bi.ref.split('/'); if (!(pagesOf(bl) || [])[+bp]) bad(`${id}: ref ${bi.ref} 가 없는 쪽`); }
  if (VIM || SHELL || ['github', 'linux'].includes(BOOK.check)) return; // 단축키·명령·Markdown 모음은 실행 결과가 없음
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'bi-')); fs.writeFileSync(path.join(dir, 'main.py'), bi.code); let out; try { out = execFileSync('python3', ['main.py'], { cwd: dir, input: bi.input || '', encoding: 'utf8', timeout: 8000, stdio: ['pipe', 'pipe', 'pipe'] }); } catch (e) { bad(`${id}: 실행 에러`); return; }
  ran++; if (out.replace(/\n+$/, '') !== bi.output) bad(`${id}: 결과가 달라요\n      기대: ${JSON.stringify(bi.output)}\n      실제: ${JSON.stringify(out)}`); });
// v2.15.1 사용자 「3, 4」(알고 교과서 자체 QA 에서 손으로 찾은 두 종류를 CI 로):
// ⑤ 레슨 본문의 「실행하면 <code>값</code>」 이 그 쪽 예제를 실제로 돌린 출력에 있는지 — 파이썬 예제는 python3, SQL 예제는 tools/sql_book_run.py(cafe)
//    본문 속 <code> 가 예제 코드에 그대로 있으면(「실행하면 heappop(h)[2] 로 …」 처럼 코드를 가리키는 말) 출력 주장이 아니라서 건너뜀. 화살표 →/-> 와 공백은 같게 보지 않음(그게 이번 버그)
// ⑥ 필요한 문법의 코드 속 낱말(3글자 이상 이름) 중 하나라도 링크된 쪽(제목·본문·예제)에 나오는지 — 하나도 없으면 다른 쪽을 가리키는 것
{ const PYEX = !COURSE || !COURSE.runner || COURSE.runner === 'python'; const SQLEX = COURSE && COURSE.runner === 'sql';
  const ent = (x) => String(x).replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&#92;/g, '\\').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');
  const bookPage = (lid, i) => { const pg = (pagesOf(lid) || [])[i]; if (!pg) return null; const o = (BOOK.pages || {})[`${lid}/${i}`]; let html = (o && o.html) || pg.html || ''; ((o && o.rep) || []).forEach(([a, b]) => { html = html.split(a).join(b); }); return { title: (o && o.title) || (BOOK.titles || {})[`${lid}/${i}`] || pg.title || '', html, example: (o && o.example) || pg.example || null }; };
  const sq = (x) => x.replace(/\s+/g, ' ').trim();
  //   ⑥ 의 「코드 낱말」: 파이썬이면 함수·메서드 이름(뒤에 ( · 앞에 .)과 키워드·모듈만 — score·total 같은 변수 이름은 문제마다 달라서 안 봄(대문자로 시작하는 내 클래스 이름도)
  //      셸은 경로 조각(../../math)을, 웹은 내가 지은 .class · #id 이름을, Vim 은 : 명령만 봄
  const PYKW = new Set('and or not in is for while if elif else def class return import from lambda with try except finally raise yield global break continue pass None True False print input'.split(' '));
  const PYGEN = new Set('print input int str float bool len range sum min max sorted list dict set tuple split join get append abs round enumerate zip map filter strip lower upper type isinstance'.split(' ')); // 흔한 내장·메서드는 「약한」 낱말
  const PYMOD = new Set('heapq bisect collections itertools functools sys math time random json csv os re datetime sqlite3 requests turtle'.split(' '));
  const needWords = (syn, userDefs = new Set()) => { const ws = new Set(); const strong = new Set();
    if (VIM) { for (const m of syn.matchAll(/:([a-z]{2,})/g)) ws.add(m[1]); return [...ws]; }
    let x = syn.replace(/"[^"]*"|'[^']*'/g, ' ').replace(/\bself\.\w+/g, ' '); if (SHELL) x = x.replace(/(?:\.{1,2}|~)?\/[\w./~-]*/g, ' '); if (COURSE && COURSE.runner === 'web') x = x.replace(/(^|[\s·,(>])[.#][\w-]+/g, '$1');
    for (const m of x.matchAll(/(\.)?([A-Za-z_][A-Za-z0-9_]{2,})(\s*\()?/g)) { const w = m[2];
      if (!PYEX) { ws.add(w); continue; }
      if (m[3] && userDefs.has(w)) continue; /* 이 문제에서 내가 만드는 함수(def rsum) */
      if (PYGEN.has(w) && (m[1] || m[3])) ws.add(w); else if (m[1] || (m[3] && !/^[A-Z]/.test(w)) || ['Counter', 'deque', 'defaultdict'].includes(w)) strong.add(w); else if (PYKW.has(w) || PYMOD.has(w)) ws.add(w); }
    return strong.size ? [...strong] : [...ws]; /* 함수·메서드 이름이 있으면 그것만(「import heapq」 만 있는 쪽이 heapq.heapify 를 설명하는 쪽으로 통과하지 않게) */ };
  for (const l of LESSONS) (pagesOf(l.id) || []).forEach((_, i) => { const pg = bookPage(l.id, i); const ex = pg.example || {}; const code = ex.code || ex.sql || '';
    const claims = []; for (const m of pg.html.matchAll(/([^.。>]{0,40})실행하면([^.。]*?)(?=[.。]|<\/p>|<\/li>|$)/g)) if (!/고치|바꾸|바꿔|넣고|지우고/.test(m[1])) /* 「…로 고치고 다시 실행하면」 은 예제 그대로의 출력이 아님 */ for (const c of m[2].matchAll(/<code>([\s\S]*?)<\/code>/g)) { const v = ent(c[1]).trim(); if (v.length >= 2 && !sq(code).includes(sq(v))) claims.push(v); }
    if (!code || !(PYEX || SQLEX)) return; if (PYEX && /^\s*(import turtle|from turtle)/m.test(code)) return; /* 거북이는 창이 필요해서(CI 에 화면 없음) 안 돌림 */ if (!claims.length && !PYEX) return; // 파이썬 예제는 주장이 없어도 전부 돌려 봄(에러 나는 예제 찾기, BOOK.meta.exampleErrorsOk 는 일부러 에러)
    const errOk = ((BOOK.meta && BOOK.meta.exampleErrorsOk) || []).includes(`${l.id}/${i}`);
    let out = ''; try { if (PYEX) { const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ex-')); fs.writeFileSync(path.join(dir, 'main.py'), code); out = execFileSync('python3', ['main.py'], { cwd: dir, input: ex.stdin || '', encoding: 'utf8', timeout: 20000, stdio: ['pipe', 'pipe', 'pipe'] }); }
      else { const r = JSON.parse(execFileSync('python3', [R + '/tools/sql_book_run.py'], { input: JSON.stringify({ dataset: ctx.SQL_DATASETS[ex.db || 'cafe'], answer: code }), encoding: 'utf8', timeout: 15000 })); if (r.error) return bad(`${l.id}/${i} 예제 실행 에러: ${r.error}`); out = r.out || r.output || ''; } }
    catch (e) { const em = String(e.stderr || e.message); if (PYEX && e.status && (errOk || /No module named '(tkinter|_tkinter|turtle)'/.test(em))) out = String(e.stdout || '') + em; /* 에러를 보여 주는 예제(트레이스백 레슨)·거북이(Windows 파이썬엔 있음) */ else return bad(`${l.id}/${i} 「${pg.title}」 예제 실행 에러: ${String(e.stderr || e.message).trim().split('\n').pop()}`); }
    ran++; const o = sq(out); for (const v of claims) if (!o.includes(sq(v))) bad(`${l.id}/${i} 「${pg.title}」: 본문은 「실행하면 ${v}」 인데 예제 출력에 없어요 — 실제 출력 ${JSON.stringify(out.slice(0, 160))}`); });
  // ⑧ 셸 교과서: 시작하기 → 레슨 순서대로 예제를 「한 사용자의 Git Bash」 처럼 이어서 실행(폴더 위치가 다음 예제로 이어짐) — 앞 예제가 다른 폴더에서 끝나 「No such file」 이 나는 예제를 찾음(v2.15.2 T1/1·T13/2)
  //    Windows 에만 있는 프로그램(notepad·code·explorer·/c/…)은 괜찮음. 일부러 에러를 보여 주는 쪽은 BOOK.meta.exampleErrorsOk
  if (SHELL) { const home = fs.mkdtempSync(path.join(os.tmpdir(), 'tgseq-')); const env = { PATH: process.env.PATH, HOME: home, LANG: 'C.UTF-8', LC_ALL: 'C.UTF-8', TERM: 'dumb', GIT_EDITOR: 'false', GIT_PAGER: 'cat' };
    execFileSync('bash', ['-c', 'git config --global init.defaultBranch main; git config --global core.quotepath false; git config --global pull.rebase false; git config --global user.name me; git config --global user.email me@example.com'], { env });
    const okPages = new Set((BOOK.meta && BOOK.meta.exampleErrorsOk) || []); let cwd = home;
    const seq = [...BOOK.setup.pages.map((_, i) => ['SETUP', i]), ...LESSONS.flatMap(l => (pagesOf(l.id) || []).map((_, i) => [l.id, i]))];
    for (const [lid, i] of seq) { const pg = lid === 'SETUP' ? BOOK.setup.pages[i] : bookPage(lid, i); const ex = pg && pg.example; if (!ex || !ex.shell) continue;
      const r = spawnSync('bash', ['-c', 'trap \'pwd > "$HOME/.cwd"\' EXIT\n' + ex.shell], { cwd, env, timeout: 15000, encoding: 'utf8' }); ran++;
      try { cwd = fs.readFileSync(path.join(home, '.cwd'), 'utf8').trim() || cwd; } catch (e) {}
      if (okPages.has(`${lid}/${i}`)) continue;
      const errs = String(r.stderr || '').split('\n').filter(x => /command not found|No such file|fatal:|cannot access|cannot stat|invalid reference|Not a directory|pathspec/.test(x) && !/(notepad|code|explorer|start|clip): command not found|cd: \/c\//.test(x));
      if (errs.length) bad(`${lid}/${i} 「${pg.title}」 예제를 앞 예제에 이어서 치면 에러: ${errs.slice(0, 2).join(' / ').split(home).join('~').slice(0, 220)}`); } }
  // ⑨ 본문 <pre> 코드와 예제의 「print(x)   # 결과」 주석이 실제 출력과 같은지(tools/pre_claims.py — 값처럼 생긴 주석만, 반복은 「0, 1, 2」 로 이어서) v2.15.4
  if (PYEX) { const items = []; for (const l of LESSONS) (pagesOf(l.id) || []).forEach((_, i) => { const pg = bookPage(l.id, i); let k = 0; for (const m of pg.html.matchAll(/<pre[^>]*>([\s\S]*?)<\/pre>/g)) items.push({ id: `${l.id}/${i} 본문 코드 ${++k}`, code: ent(m[1].replace(/<br\s*\/?>/g, '\n')) }); if (pg.example && pg.example.code) items.push({ id: `${l.id}/${i} 예제`, code: pg.example.code }); });
    let r = []; try { r = JSON.parse(execFileSync('python3', [R + '/tools/pre_claims.py'], { input: JSON.stringify(items), encoding: 'utf8', timeout: 120000 })); } catch (e) { bad(`pre_claims.py 실행 에러 ${String(e.stderr || e.message).trim().split('\n').pop()}`); } ran += items.length;
    for (const x of r) bad(`${x.id}: 「${x.line}」 의 주석은 「${x.claim}」 인데 실제로는 「${x.got}」 이 나와요`); }
  // ⑩ Vim 교과서: 본문·예제에 나오는 「:명령」 을 진짜 vim(교과서 기본 _vimrc)에서 하나씩 실행해 「없는 명령(E492)·없는 설정(E518)·잘못된 값(E474)·뒤에 남은 글자(E488)」 가 안 나는지. 끝내기(:q …)·플러그인 명령·한글 자리표시(:e 파일)는 건너뜀 v2.15.4
  if (VIM) { const home = fs.mkdtempSync(path.join(os.tmpdir(), 'vimex-')); fs.mkdirSync(path.join(home, 'vim-study')); fs.writeFileSync(path.join(home, 'vimrc'), ctx.VIMRC_BASE_TEXT);
    fs.writeFileSync(path.join(home, 'vim-study', 'play.txt'), Array.from({ length: 12 }, (_, k) => `line${k + 1} cat a i`).join('\n') + '\n');
    const cmds = new Map(); const addc = (x, w) => { x = String(x).split('←')[0].trim(); if (!/^:[A-Za-z%'<0-9.,$]/.test(x) || cmds.has(x)) return; cmds.set(x, w); };
    for (const l of LESSONS) (pagesOf(l.id) || []).forEach((_, i) => { const pg = bookPage(l.id, i); const w = `${l.id}/${i}`; if (pg.example && pg.example.code) pg.example.code.split('\n').forEach(x => addc(x, w)); for (const m of pg.html.matchAll(/<code>([\s\S]*?)<\/code>/g)) addc(ent(m[1]), w); for (const m of pg.html.matchAll(/<pre[^>]*>([\s\S]*?)<\/pre>/g)) ent(m[1]).split('\n').forEach(x => addc(x.split('"')[0], w)); });
    const skip = /^:(q|q!|qa|qa!|x|wq|wqa|PlugInstall|PlugUpdate|Lsp\w*|term|terminal|Lexplore|Ex|source)\b|[가-힣]|Ctrl\+|…/;
    for (const [cmd, w] of cmds) { if (skip.test(cmd)) continue; fs.writeFileSync(path.join(home, 's.vim'), `edit! ~/vim-study/play.txt\nlet v:errmsg=''\nsilent! execute ${JSON.stringify(cmd.slice(1))}\nlet g:e=v:errmsg\nredir! > ${path.join(home, 'o.txt')}\necho 'ERR[' . g:e . ']'\nredir END\nqa!\n`);
      spawnSync('vim', ['-N', '-u', path.join(home, 'vimrc'), '-i', 'NONE', '-n', '-es', '-S', path.join(home, 's.vim')], { cwd: home, env: { PATH: process.env.PATH, HOME: home, LANG: 'C.UTF-8' }, timeout: 10000 }); ran++;
      const o = fs.existsSync(path.join(home, 'o.txt')) ? fs.readFileSync(path.join(home, 'o.txt'), 'utf8') : ''; fs.rmSync(path.join(home, 'o.txt'), { force: true });
      if (/E(492|518|474|488):/.test(o)) bad(`${w}: Vim 명령 「${cmd}」 이 vim 에서 에러 — ${(o.match(/ERR\[(.*)\]/) || [])[1]}`); } }
  // ⑪ 거북이(turtle) 코드는 마지막에 turtle.done()(또는 mainloop·exitonclick) — VS Code 에서는 없으면 창이 깜빡 뜨고 바로 닫힘(예전 화면은 브라우저 캔버스라 필요 없었음). v2.16.2 사용자 「이 turtle 있으면 안 되는 거 아니야?」
  if (PYEX) { const tdone = (code) => !/^\s*(import turtle|from turtle)/m.test(code) || /turtle\.(done|mainloop|exitonclick)\(\)|^\s*(done|mainloop|exitonclick)\(\)/m.test(code);
    for (const l of LESSONS) (pagesOf(l.id) || []).forEach((_, i) => { const pg = bookPage(l.id, i); const codes = [...pg.html.matchAll(/<pre[^>]*>([\s\S]*?)<\/pre>/g)].map(m => ent(m[1])); if (pg.example && pg.example.code) codes.push(pg.example.code); codes.forEach(c => { if (!tdone(c)) bad(`${l.id}/${i} 「${pg.title}」: 거북이 코드에 turtle.done() 이 없어요 — VS Code 에서는 창이 바로 닫혀요`); }); });
    for (const [lid, tasks] of Object.entries(BOOK.tasks)) tasks.forEach((t, ti) => { const a = ctx.BookDerive.task(t, t.pid ? P[t.pid] : null, BOOK).answer; if (!tdone(a)) bad(`${lid}#${ti + 1} ${t.title}: 거북이 예시 답에 turtle.done() 이 없어요`); }); }
  // ⑦ 레슨 쪽에 예전 문제집 화면 말(이 앱 · 채점 · 입력창 · 슬라이더 · XP, 그림 없는 코스의 👀·👣)이 남았는지 — v2.15.2 파이썬 교과서에 8곳 남아 있던 것. 「채점 서버」(코딩테스트)는 괜찮음
  const OLD0 = '이 앱|채점(?! 서버)|입력창|슬라이더|🎚|\\bXP\\b|다음 줄 실행|파일 트리|오른쪽 예제|가짜 터미널|미리보기 칸|▶ 실행|실행 버튼을 누르'; const OLD1 = BOOK.meta && BOOK.meta.fig ? OLD0.replace('|슬라이더|🎚', '') : OLD0; /* v2.18.0 수학 교과서: 레슨 첫 쪽의 만지는 그림에는 진짜 슬라이더가 있음 */ const OLDW = new RegExp(BOOK.meta && BOOK.meta.viz ? OLD1 : OLD1 + '|👀|👣');
  for (const l of LESSONS) (pagesOf(l.id) || []).forEach((_, i) => { const t = ent(bookPage(l.id, i).html); const m = t.match(new RegExp('.{0,30}(?:' + OLDW.source + ').{0,30}')); if (m) bad(`${l.id}/${i}: 예전 문제집 화면 말이 남았어요 「${m[0]}」 — BOOK.pages 의 rep 로 교과서 말로 바꾸세요`); });
  for (const [lid, tasks] of Object.entries(BOOK.tasks)) tasks.forEach((t, ti) => (t.needs || []).forEach(([syn, ref]) => { const [nl, np] = String(ref).split('/'); const pg = bookPage(nl, +np); if (!pg) return; const hay = ent(pg.title + '\n' + pg.html) + '\n' + Object.values(pg.example || {}).filter(x => typeof x === 'string').join('\n');
    const words = needWords(String(syn), new Set([...String(ctx.BookDerive.task(t, t.pid ? P[t.pid] : null, BOOK).answer + '\n' + (t.text || '') + '\n' + ((t.pid && P[t.pid] && P[t.pid].prompt) || '')).matchAll(/(?:def\s+|<code>)([A-Za-z_]\w*)\(/g)].map(m => m[1]))); if (words.length && !words.some(w => hay.includes(w))) bad(`${lid}#${ti + 1} ${t.title}: 필요한 문법 「${syn}」 → ${ref} 「${pg.title}」 쪽에 그 코드 낱말(${words.join(', ')})이 하나도 없어요 — 설명이 있는 쪽으로 링크를 바꾸세요`); })); }
// 허브 카드(v2.10.1 사용자 「메인화면은 수정 안 했는데」): config.js 의 이 코스가 book:true 이고 lessons 가 열린 레슨 수와 같은지 — 허브는 book.js 를 안 읽어서 손으로 맞춰야 함
{ const cx = { window: {} }; vm.createContext(cx); vm.runInContext(fs.readFileSync(R + '/core/config.js', 'utf8').replace(/^(const|let) /gm, 'var '), cx); const cc = (cx.CONFIG.COURSES || []).find(c => c.id === cid);
  const open = LESSONS.filter(l => (!l.mock || ((BOOK.tasks || {})[l.id] || []).length) /* 모의고사는 교과서가 문제를 채웠을 때만(화면 lessonsOf 와 같게, v2.15.0) */ && (!l.draft || (BOOK.lessonPages || {})[l.id] || ((BOOK.tasks || {})[l.id] || []).length)).length;
  if (!cc || !cc.book || !cc.ready) bad(`config.js COURSES 의 ${cid} 에 ready:true, book:true 가 있어야 해요(허브 카드가 「읽은 레슨」으로 보이게)`); else if (cc.lessons !== open) bad(`config.js ${cid}.lessons = ${cc.lessons} 인데 열린 레슨은 ${open}개 — 허브 카드 숫자를 맞추세요`);
  if (cc && /가상|시뮬레이터|브라우저에서 바로/.test(cc.desc || '')) bad(`config.js ${cid}.desc 가 교과서와 안 맞아요: ${cc.desc}`); }
const noTasks = LESSONS.filter(l => !l.mock && !(BOOK.tasks[l.id] || []).length).map(l => l.id); if (noTasks.length) console.log(`  · [${cid}] 만들어 보기가 없는 레슨:`, noTasks.join(', '));
console.log(fails ? `✗ check_book [${cid}] 실패 ${fails} (문제 ${n}, 실행 ${ran})` : `✓ check_book [${cid}] OK (문제 ${n}, 예시 답 실행 ${ran})`); return fails;
// 셸: 빈 HOME 에서 setup → answer(또는 run) → check. 출력의 HOME 경로는 /c/Users/me 로(교과서가 Git Bash 기준으로 보여 주는 모양)
function runShell(id, t, answer, c) {
  if (c.output == null) return bad(`${id}: 결과 예 없음`);
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'tg-'));
  // setup 출력은 버리고(cd 는 살아 있게 { } 로 묶음), check 가 있으면 answer 출력도 버린 뒤 check 출력만 비교
  const body = `{\n${t.setup}\n} >/dev/null\n` + (t.check ? `{\n${t.run || answer}\n} >/dev/null 2>&1\n${t.check}` : `${t.run || answer}`);
  let out; try { out = execFileSync('bash', ['-c', body], { cwd: home, env: { PATH: process.env.PATH, HOME: home, LANG: 'C.UTF-8', LC_ALL: 'C.UTF-8', /* v2.12.0 Git 편: T6 의 처음 설정(이름·이메일·main·pull.rebase)을 한 사용자처럼 */ GIT_AUTHOR_NAME: 'me', GIT_AUTHOR_EMAIL: 'me@example.com', GIT_COMMITTER_NAME: 'me', GIT_COMMITTER_EMAIL: 'me@example.com', GIT_CONFIG_COUNT: '3', GIT_CONFIG_KEY_0: 'init.defaultBranch', GIT_CONFIG_VALUE_0: 'main', GIT_CONFIG_KEY_1: 'pull.rebase', GIT_CONFIG_VALUE_1: 'false', GIT_CONFIG_KEY_2: 'core.quotepath', GIT_CONFIG_VALUE_2: 'false', GIT_EDITOR: 'false', GIT_PAGER: 'cat' }, encoding: 'utf8', timeout: 15000, stdio: ['pipe', 'pipe', 'pipe'] }); } catch (e) { return bad(`${id}: 실행 에러 ${String(e.stderr || e.message).trim().split('\n').pop()}`); }
  ran++;
  const norm = (s) => { let ls = String(s).split(home).join(BOOK.check === 'linux' ? '/home/me' : '/c/Users/me') /* v2.22.0 리눅스 교과서는 우분투 홈 */.replace(/\r/g, '').split('\n').map(x => x.trim().replace(/\s+/g, ' ')).filter((x, i, a) => x || i < a.length - 1); while (ls.length && !ls[ls.length - 1]) ls.pop(); if (t.anyOrder) ls = ls.sort(); return ls.join('\n'); };
  if (norm(out) !== norm(c.output)) bad(`${id}: 결과가 달라요\n      기대: ${JSON.stringify(norm(c.output))}\n      실제: ${JSON.stringify(norm(out))}`);
  // 로케일 함정: sort 결과를 보여 주는 문제는 Git Bash(보통 한국어·영어 로케일)에서도 같은 순서여야 — 문장부호를 빼고 비교한 순서와 C 순서가 같은지
  if (/\bsort\b(?! -r?n)/.test(t.check || '') && !t.anyOrder) { const ls = String(c.output).split('\n'); const k = (x) => x.replace(/[^\p{L}\p{N}]/gu, '').toLowerCase(); const a = [...ls].sort((x, y) => (k(x) < k(y) ? -1 : k(x) > k(y) ? 1 : 0)); if (a.join('\n') !== ls.join('\n')) bad(`${id}: 정렬 순서가 로케일에 따라 달라질 수 있어요 — 파일 이름을 바꾸세요`); }
}
// Vim: 빈 HOME 에 기본 _vimrc(VIMRC_BASE_TEXT) → vim -es 로 setup(준비 명령) → normal! 로 answer 키 → wall → 파일 비교 (+ python3 실행 비교)
function vimKeys(k) { return String(k).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/<(Esc|Enter|BS|Tab|C-[a-z\[\]^])>/g, (m, x) => '\\<' + (x === 'Enter' ? 'CR' : x) + '>'); }
function runVim(id, t, answer, c) {
  if (c.output == null) return bad(`${id}: 결과 예 없음`);
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'vim-')); fs.writeFileSync(path.join(home, 'vimrc'), ctx.VIMRC_BASE_TEXT);
  const fname = t.file || (String(t.setup).match(/edit! ~\/vim-study\/(\S+)/) || [])[1]; if (!fname) return bad(`${id}: setup 에서 연 파일 이름을 못 찾음`);
  fs.writeFileSync(path.join(home, 's.vim'), `${t.setup}\nexe "normal! " . "${vimKeys(answer)}"\nsilent! wall\nqa!\n`);
  try { execFileSync('vim', ['-N', '-u', path.join(home, 'vimrc'), '-i', 'NONE', '-n', '-es', '-S', path.join(home, 's.vim')], { cwd: home, env: { PATH: process.env.PATH, HOME: home, LANG: 'C.UTF-8' }, encoding: 'utf8', timeout: 10000, stdio: ['ignore', 'pipe', 'pipe'] }); } catch (e) { if (e.code === 'ETIMEDOUT' || e.signal) return bad(`${id}: vim 이 끝나지 않음(키가 입력 모드에 갇힘?)`); }
  ran++; let got; try { got = fs.readFileSync(path.join(home, 'vim-study', fname), 'utf8'); } catch (e) { return bad(`${id}: 결과 파일 ${fname} 없음`); }
  const norm = (s) => String(s).replace(/\r/g, '').replace(/\n+$/, '');
  if (norm(got) !== norm(c.output)) return bad(`${id}: 파일이 달라요\n      기대: ${JSON.stringify(norm(c.output))}\n      실제: ${JSON.stringify(norm(got))}`);
  if (t.py) { let out; try { out = execFileSync('python3', [fname], { cwd: path.join(home, 'vim-study'), input: t.py.input || '', encoding: 'utf8', timeout: 8000, stdio: ['pipe', 'pipe', 'pipe'] }); } catch (e) { return bad(`${id}: 파이썬 실행 에러 ${String(e.stderr || e.message).trim().split('\n').pop()}`); }
    ran++; if (norm(out) !== norm(t.py.output)) bad(`${id}: 실행 결과가 달라요\n      기대: ${JSON.stringify(norm(t.py.output))}\n      실제: ${JSON.stringify(norm(out))}`); }
}
function runSqlTask(id, t, answer, c) {
  if (c.output == null) return bad(`${id}: 결과 없음`);
  const req = { dataset: ctx.SQL_DATASETS[t.db || 'cafe'], setup: t.setup, answer, check: t.check, rollback: t.rollback, expectError: t.expectError, planOnly: t.planOnly, py: t.runPy, input: c.input };
  let r; try { r = JSON.parse(execFileSync('python3', [R + '/tools/sql_book_run.py'], { input: JSON.stringify(req), encoding: 'utf8', timeout: 15000 })); } catch (e) { return bad(`${id}: 실행 도구 에러 ${String(e.stderr || e.message).trim().split('\n').pop()}`); }
  ran++; if (r.error) return bad(`${id}: ${r.error}`);
  const norm = (s) => String(s ?? '').replace(/\r/g, '').split('\n').map(x => x.replace(/\s+$/, '')).join('\n').replace(/\n+$/, '');
  let a = norm(r.out), b = norm(c.output); if (t.anyOrder) { a = a.split('\n').sort().join('\n'); b = b.split('\n').sort().join('\n'); }
  if (a !== b) bad(`${id}: 결과가 달라요\n      기대: ${JSON.stringify(b)}\n      실제: ${JSON.stringify(a)}`);
  if (!t.runPy && !t.check && a.split('\n').length < 2) bad(`${id}: 결과가 0행 — 문제·데이터를 확인`);
}
function bad(m) { fails++; console.log('  ✗', `[${cid}]`, m); }
}
