// tools/check_book.mjs — 교과서(book.js) 검사 (v2.9.0 파이썬 · v2.10.0 터미널·Git). `node tools/check_book.mjs [코스id]` (없으면 book.js 가 있는 코스 전부)
// ① 「필요한 문법」 링크가 있는 레슨·쪽을 가리키는지 ② pid 가 있는 문제인지 ③ 예시 답을 실제로 돌려 출력 예와 같은지 (noRun 은 건너뜀)
//   파이썬 코스: python3 로 answer 실행 · 셸 코스(runner:'shell'): bash 로 setup → answer → check 실행(HOME 은 임시 폴더, 출력의 그 경로는 /c/Users/me 로 바꿔 비교)
import fs from 'fs'; import vm from 'vm'; import os from 'os'; import path from 'path'; import { execFileSync } from 'child_process';
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
    for (const nd of t.needs || []) if (nd.length !== 3 || !nd[2] || !/[A-Za-z0-9=+*\/%\[\](){}"<>.:▷|~$&^-]/.test(nd[0])) bad(`${id}: 필요한 문법은 [실제 문법(코드), '레슨/쪽', 설명] 이어야 해요 (v2.9.2) → ${JSON.stringify(nd)}`);
    for (const [name, ref] of t.needs || []) { const [nl, np] = String(ref).split('/'); const pages = pagesOf(nl); if (!pages || !(+np >= 0 && +np < pages.length)) bad(`${id}: 필요한 문법 「${name}」 → ${ref} 가 없는 쪽`); }
    if (t.text === '@prompt' && !p) bad(`${id}: @prompt 인데 pid 없음`);
    const dv = ctx.BookDerive.task(t, p, BOOK); const io = dv.io; const answer = dv.answer; const pyCheck = !SHELL && !VIM && !SQLB && dv.check ? '\n' + dv.check + '\n' : ''; // 함수 문제: 확인 코드(print(호출))를 답 아래에 붙여 돌림
    if (dv.text && /👀|시각화|▶ 실행|입력창/.test(dv.text) && BOOK.fixPrompt) bad(`${id}: 지문에 이 앱 버튼 안내가 남음 「${(dv.text.match(/.{0,20}(👀|시각화|▶ 실행|입력창).{0,20}/) || [''])[0].replace(/<[^>]+>/g, '')}」 — BOOK.fixPrompt 로 지우거나 text 를 직접 쓰세요`);
    if (!answer) bad(`${id}: 예시 답 없음`);
    if (JSON.stringify(io).includes('{{') || answer.includes('{{')) bad(`${id}: {{바꿔 끼우기}} 자리표시가 남음 — io·answer 를 직접 적으세요`);
    if (t.noRun) return;
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
  if (VIM || SHELL) return; // 단축키·명령 모음은 실행 결과가 없음
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'bi-')); fs.writeFileSync(path.join(dir, 'main.py'), bi.code); let out; try { out = execFileSync('python3', ['main.py'], { cwd: dir, input: bi.input || '', encoding: 'utf8', timeout: 8000, stdio: ['pipe', 'pipe', 'pipe'] }); } catch (e) { bad(`${id}: 실행 에러`); return; }
  ran++; if (out.replace(/\n+$/, '') !== bi.output) bad(`${id}: 결과가 달라요\n      기대: ${JSON.stringify(bi.output)}\n      실제: ${JSON.stringify(out)}`); });
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
  const norm = (s) => { let ls = String(s).split(home).join('/c/Users/me').replace(/\r/g, '').split('\n').map(x => x.trim().replace(/\s+/g, ' ')).filter((x, i, a) => x || i < a.length - 1); while (ls.length && !ls[ls.length - 1]) ls.pop(); if (t.anyOrder) ls = ls.sort(); return ls.join('\n'); };
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
