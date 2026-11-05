// tools/check_book.mjs — 파이썬 교과서(book.js) 검사 (v2.9.0). `node tools/check_book.mjs`
// ① 「필요한 문법」 링크가 있는 레슨·쪽을 가리키는지 ② pid 가 있는 문제인지 ③ 예시 답을 실제 파이썬(python3)으로 돌려 출력 예와 같은지 (noRun 은 건너뜀)
import fs from 'fs'; import vm from 'vm'; import os from 'os'; import path from 'path'; import { execFileSync } from 'child_process';
const R = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const ctx = { window: {}, console }; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(R + '/courses/python/content.js', 'utf8').replace(/^(const|let) /gm, 'var ') + '\n' + fs.readFileSync(R + '/courses/python/book.js', 'utf8').replace(/^const /gm, 'var '), ctx);
const { LESSONS, PROBLEMS, BOOK } = ctx; const L = Object.fromEntries(LESSONS.map(l => [l.id, l])); const P = Object.fromEntries(PROBLEMS.map(p => [p.id, p]));
let fails = 0, ran = 0, n = 0; const bad = (m) => { fails++; console.log('  ✗', m); };
for (const [lid, tasks] of Object.entries(BOOK.tasks)) {
  if (!L[lid]) bad(`없는 레슨 ${lid}`);
  tasks.forEach((t, i) => {
    n++; const id = `${lid}#${i + 1} ${t.title}`; const p = t.pid ? P[t.pid] : null;
    if (t.pid && !p) return bad(`${id}: 없는 문제 ${t.pid}`);
    for (const [name, ref] of t.needs || []) { const [nl, np] = String(ref).split('/'); const pages = nl === 'SETUP' ? BOOK.setup.pages : (L[nl] || {}).pages; if (!pages || !(+np >= 0 && +np < pages.length)) bad(`${id}: 필요한 문법 「${name}」 → ${ref} 가 없는 쪽`); }
    if (t.text === '@prompt' && !p) bad(`${id}: @prompt 인데 pid 없음`);
    const tests = (p && p.tests) || []; const io = t.io || (p && p.project ? tests.filter(c => !c.files && !c.inputGen && c.output !== '__COMPUTED__').filter((c, i, ok) => ok.findIndex(d => d.stage === c.stage) === i).slice(0, 4) : tests[0] ? [tests[0]] : []); const answer = t.answer || (p && p.solution) || '';
    if (!answer) bad(`${id}: 예시 답 없음`);
    if (JSON.stringify(io).includes('{{') || answer.includes('{{')) bad(`${id}: {{바꿔 끼우기}} 자리표시가 남음 — io·answer 를 직접 적으세요`);
    if (t.noRun) return;
    for (const c of io) {
      if (c.output == null) { bad(`${id}: 출력 예 없음`); continue; }
      const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'book-')); const up = p && p.files && p.files.upload; if (up && up.sample) fs.writeFileSync(path.join(dir, up.name), up.sample);
      fs.writeFileSync(path.join(dir, 'main.py'), answer);
      let out; try { out = execFileSync('python3', ['main.py'], { cwd: dir, input: c.input || '', encoding: 'utf8', timeout: 8000, stdio: ['pipe', 'pipe', 'pipe'] }); } catch (e) { bad(`${id}: 실행 에러 ${String(e.stderr || e.message).trim().split('\n').pop()}`); continue; }
      ran++; const norm = (s) => String(s).replace(/\r/g, '').split('\n').map(x => x.replace(/\s+$/, '')).join('\n').replace(/\n+$/, '');
      if (norm(out) !== norm(c.output)) bad(`${id}: 출력이 달라요\n      기대: ${JSON.stringify(norm(c.output))}\n      실제: ${JSON.stringify(norm(out))}`);
    }
  });
}
for (const [k, o2] of Object.entries(BOOK.pages || {})) { const [pl, pi] = k.split('/'); const pg = ((L[pl] || {}).pages || [])[+pi]; if (!pg) { bad(`pages ${k}: 없는 쪽`); continue; } for (const [a] of o2.rep || []) if (!pg.html.includes(a)) bad(`pages ${k}: 바꿀 글을 못 찾음 「${a.slice(0, 40)}」`); }
const noTasks = LESSONS.filter(l => !l.mock && !(BOOK.tasks[l.id] || []).length).map(l => l.id); if (noTasks.length) console.log('  · 만들어 보기가 없는 레슨:', noTasks.join(', '));
console.log(fails ? `✗ check_book 실패 ${fails} (문제 ${n}, 실행 ${ran})` : `✓ check_book OK (문제 ${n}, 예시 답 실행 ${ran})`); process.exit(fails ? 1 : 0);
