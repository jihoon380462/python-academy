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
vm.runInContext(fs.readFileSync(`${R}/courses/${cid}/content.js`, 'utf8').replace(/^(const|let) /gm, 'var ') + '\n' + fs.readFileSync(`${R}/courses/${cid}/book.js`, 'utf8').replace(/^const /gm, 'var '), ctx);
const { LESSONS, PROBLEMS, BOOK, COURSE } = ctx; const L = Object.fromEntries(LESSONS.map(l => [l.id, l])); const P = Object.fromEntries(PROBLEMS.map(p => [p.id, p]));
const SHELL = COURSE && COURSE.runner === 'shell';
const pagesOf = (lid) => lid === 'SETUP' ? BOOK.setup.pages : (BOOK.lessonPages || {})[lid] || (L[lid] || {}).pages;
for (const lid of Object.keys(BOOK.lessonPages || {})) if (!L[lid]) bad(`lessonPages ${lid}: 없는 레슨`);
let fails = 0, ran = 0, n = 0;
for (const [lid, tasks] of Object.entries(BOOK.tasks)) {
  if (!L[lid]) bad(`없는 레슨 ${lid}`);
  tasks.forEach((t, i) => {
    n++; const id = `${lid}#${i + 1} ${t.title}`; const p = t.pid ? P[t.pid] : null;
    if (t.pid && !p) return bad(`${id}: 없는 문제 ${t.pid}`);
    for (const nd of t.needs || []) if (nd.length !== 3 || !nd[2] || !/[A-Za-z0-9=+*\/%\[\](){}"<>.:▷|~$&-]/.test(nd[0])) bad(`${id}: 필요한 문법은 [실제 문법(코드), '레슨/쪽', 설명] 이어야 해요 (v2.9.2) → ${JSON.stringify(nd)}`);
    for (const [name, ref] of t.needs || []) { const [nl, np] = String(ref).split('/'); const pages = pagesOf(nl); if (!pages || !(+np >= 0 && +np < pages.length)) bad(`${id}: 필요한 문법 「${name}」 → ${ref} 가 없는 쪽`); }
    if (t.text === '@prompt' && !p) bad(`${id}: @prompt 인데 pid 없음`);
    const tests = (p && p.tests) || []; const io = t.io || (p && p.project ? tests.filter(c => !c.files && !c.inputGen && c.output !== '__COMPUTED__').filter((c, i, ok) => ok.findIndex(d => d.stage === c.stage) === i).slice(0, 4) : tests[0] ? [tests[0]] : []); const answer = t.answer || (p && p.solution) || '';
    if (!answer) bad(`${id}: 예시 답 없음`);
    if (JSON.stringify(io).includes('{{') || answer.includes('{{')) bad(`${id}: {{바꿔 끼우기}} 자리표시가 남음 — io·answer 를 직접 적으세요`);
    if (t.noRun) return;
    if (SHELL) { if (!t.setup) bad(`${id}: 준비 명령(setup) 없음`); for (const c of io) runShell(id, t, answer, c); return; }
    for (const c of io) {
      if (c.output == null) { bad(`${id}: 출력 예 없음`); continue; }
      const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'book-')); const up = p && p.files && p.files.upload; if (up && up.sample) fs.writeFileSync(path.join(dir, up.name), up.sample); if (t.prep) fs.writeFileSync(path.join(dir, t.prep.name), t.prep.text);
      fs.writeFileSync(path.join(dir, 'main.py'), answer);
      let out; try { out = execFileSync('python3', ['main.py'], { cwd: dir, input: c.input || '', encoding: 'utf8', timeout: 8000, stdio: ['pipe', 'pipe', 'pipe'] }); } catch (e) { bad(`${id}: 실행 에러 ${String(e.stderr || e.message).trim().split('\n').pop()}`); continue; }
      ran++; const norm = (s) => String(s).replace(/\r/g, '').split('\n').map(x => x.replace(/\s+$/, '')).join('\n').replace(/\n+$/, '');
      if (norm(out) !== norm(c.output)) bad(`${id}: 출력이 달라요\n      기대: ${JSON.stringify(norm(c.output))}\n      실제: ${JSON.stringify(norm(out))}`);
    }
  });
}
for (const [k, o2] of Object.entries(BOOK.pages || {})) { const [pl, pi] = k.split('/'); const pg = (pagesOf(pl) || [])[+pi]; if (!pg) { bad(`pages ${k}: 없는 쪽`); continue; } for (const [a] of o2.rep || []) if (!pg.html.includes(a)) bad(`pages ${k}: 바꿀 글을 못 찾음 「${a.slice(0, 40)}」`); }
for (const k of Object.keys(BOOK.titles || {})) { const [tl, ti] = k.split('/'); if (!(pagesOf(tl) || [])[+ti]) bad(`titles ${k}: 없는 쪽`); }
(BOOK.builtins || []).forEach((bi, i) => { n++; const id = `내장 함수 ${bi.name}`; if (bi.ref) { const [bl, bp] = bi.ref.split('/'); if (!(pagesOf(bl) || [])[+bp]) bad(`${id}: ref ${bi.ref} 가 없는 쪽`); }
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'bi-')); fs.writeFileSync(path.join(dir, 'main.py'), bi.code); let out; try { out = execFileSync('python3', ['main.py'], { cwd: dir, input: bi.input || '', encoding: 'utf8', timeout: 8000, stdio: ['pipe', 'pipe', 'pipe'] }); } catch (e) { bad(`${id}: 실행 에러`); return; }
  ran++; if (out.replace(/\n+$/, '') !== bi.output) bad(`${id}: 결과가 달라요\n      기대: ${JSON.stringify(bi.output)}\n      실제: ${JSON.stringify(out)}`); });
const noTasks = LESSONS.filter(l => !l.mock && !(BOOK.tasks[l.id] || []).length).map(l => l.id); if (noTasks.length) console.log(`  · [${cid}] 만들어 보기가 없는 레슨:`, noTasks.join(', '));
console.log(fails ? `✗ check_book [${cid}] 실패 ${fails} (문제 ${n}, 실행 ${ran})` : `✓ check_book [${cid}] OK (문제 ${n}, 예시 답 실행 ${ran})`); return fails;
// 셸: 빈 HOME 에서 setup → answer(또는 run) → check. 출력의 HOME 경로는 /c/Users/me 로(교과서가 Git Bash 기준으로 보여 주는 모양)
function runShell(id, t, answer, c) {
  if (c.output == null) return bad(`${id}: 결과 예 없음`);
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'tg-'));
  // setup 출력은 버리고(cd 는 살아 있게 { } 로 묶음), check 가 있으면 answer 출력도 버린 뒤 check 출력만 비교
  const body = `{\n${t.setup}\n} >/dev/null\n` + (t.check ? `{\n${t.run || answer}\n} >/dev/null 2>&1\n${t.check}` : `${t.run || answer}`);
  let out; try { out = execFileSync('bash', ['-c', body], { cwd: home, env: { PATH: process.env.PATH, HOME: home, LANG: 'C.UTF-8', LC_ALL: 'C.UTF-8' }, encoding: 'utf8', timeout: 8000, stdio: ['pipe', 'pipe', 'pipe'] }); } catch (e) { return bad(`${id}: 실행 에러 ${String(e.stderr || e.message).trim().split('\n').pop()}`); }
  ran++;
  const norm = (s) => { let ls = String(s).split(home).join('/c/Users/me').replace(/\r/g, '').split('\n').map(x => x.trim().replace(/\s+/g, ' ')).filter((x, i, a) => x || i < a.length - 1); while (ls.length && !ls[ls.length - 1]) ls.pop(); if (t.anyOrder) ls = ls.sort(); return ls.join('\n'); };
  if (norm(out) !== norm(c.output)) bad(`${id}: 결과가 달라요\n      기대: ${JSON.stringify(norm(c.output))}\n      실제: ${JSON.stringify(norm(out))}`);
  // 로케일 함정: sort 결과를 보여 주는 문제는 Git Bash(보통 한국어·영어 로케일)에서도 같은 순서여야 — 문장부호를 빼고 비교한 순서와 C 순서가 같은지
  if (/\bsort\b(?! -r?n)/.test(t.check || '') && !t.anyOrder) { const ls = String(c.output).split('\n'); const k = (x) => x.replace(/[^\p{L}\p{N}]/gu, '').toLowerCase(); const a = [...ls].sort((x, y) => (k(x) < k(y) ? -1 : k(x) > k(y) ? 1 : 0)); if (a.join('\n') !== ls.join('\n')) bad(`${id}: 정렬 순서가 로케일에 따라 달라질 수 있어요 — 파일 이름을 바꾸세요`); }
}
function bad(m) { fails++; console.log('  ✗', `[${cid}]`, m); }
}
