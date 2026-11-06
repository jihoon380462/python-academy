#!/usr/bin/env node
// tools/run_shell_solutions.mjs — 터미널·Git 코스(terminal-git) 정답 실행 검증 (배포 전 게이트, run_solutions.py 의 셸 판).
//   미션(mission): setup 으로 셸을 만들고 solution 의 명령을 한 줄씩 실행한 뒤 goals[].expect·expect·forbid 를 Grader.matchState 로 전부 통과하는지.
//                  시작 상태에서 이미 goals 가 전부 달성돼 있으면(아무것도 안 해도 풀리는 문제) 실패.
//   명령 순서(parsons): setup 위에서 parsons.solution 을 차례로 실행한 뒤 tests[].expect 통과.
//   레슨 예제(example.shell): setup 위에서 실행했을 때 'command not found'(오타) 가 없는지. (의도된 에러 장면은 example.expectErrors:true)
//   사용: node tools/run_shell_solutions.mjs [--verbose]     실패가 있으면 exit 1. CI(.github/workflows/ci.yml)에서도 돈다.
import fs from 'node:fs'; import path from 'node:path'; import vm from 'node:vm'; import { createRequire } from 'node:module';
import { ROOT } from './load_content.mjs';
const require = createRequire(import.meta.url); const Shell = require('../core/runners/shell.js');
const COURSE = 'terminal-git'; const verbose = process.argv.includes('--verbose');
// content.js 와 engine.js(Grader) 를 같은 컨텍스트에서 읽는다 — matchState 의 instanceof RegExp 가 다른 컨텍스트 객체를 못 알아보는 일이 없게
const src = ['core/config.js', 'shared/errors.js', 'shared/glossary.js', 'shared/badges.js', `courses/${COURSE}/content.js`, 'core/engine.js'].map(f => fs.readFileSync(path.join(ROOT, f), 'utf8')).join('\n');
const ctx = { console }; vm.createContext(ctx); vm.runInContext(src + '\n;this.__out={LESSONS,PROBLEMS,Grader};', ctx, { filename: COURSE + '/content+engine.js' });
const { LESSONS, PROBLEMS, Grader } = ctx.__out;
const fails = []; let n = 0; const fail = (id, m) => fails.push(`${id}: ${m}`);
const lines = (s) => String(s || '').split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#'));
const mk = (setup) => Shell.create(JSON.parse(JSON.stringify(setup || {})));
const runAll = (sh, cmds, id) => { const log = []; for (const c of cmds) { const r = sh.exec(c); log.push([c, r]); if (r.code === 3) { fail(id, `'${c}' 가 편집창을 요구해요 — Node 에서는 edit 파일 "내용" 꼴로`); } if (r.code === 127) fail(id, `'${c}' → ${r.err.trim()}`); } if (verbose) log.forEach(([c, r]) => console.log(`    $ ${c}\n${(r.out + r.err).replace(/^/gm, '      ')}`)); return log; };
const strip = (t) => String(t).replace(/<[^>]+>/g, '');
for (const p of PROBLEMS) {
  if (p.type === 'mission') {
    n++; const goals = p.goals || []; const sh0 = mk(p.setup); const st0 = sh0.state();
    if (goals.length && goals.every(g => Grader.matchState(st0, g.expect || {}).ok)) fail(p.id, '시작 상태에서 이미 목표가 전부 달성돼 있어요 (아무것도 안 쳐도 풀림)');
    const sh = mk(p.setup); runAll(sh, lines(p.solution), p.id); const st = sh.state();
    goals.forEach((g, i) => { const r = Grader.matchState(st, g.expect || {}); if (!r.ok) fail(p.id, `정답을 돌려도 goals[${i}] 「${strip(g.text)}」 미달성: ${r.fails.join(' / ')}`); });
    const ex = Object.assign({}, p.expect || Object.assign({}, ...goals.map(g => g.expect || {})), p.forbid ? { forbid: p.forbid } : {}); const r = Grader.matchState(st, ex); if (!r.ok) fail(p.id, `정답을 돌려도 expect 미달성: ${r.fails.join(' / ')}`);
  } else if (p.type === 'parsons') {
    n++; const sh = mk(p.setup); runAll(sh, lines(p.parsons && p.parsons.solution), p.id); const st = sh.state();
    (p.tests || []).forEach((t, i) => { const r = Grader.matchState(st, t.expect || {}); if (!r.ok) fail(p.id, `명령 순서대로 돌려도 tests[${i}] 미달성: ${r.fails.join(' / ')}`); });
  }
}
let ex = 0;
for (const l of LESSONS) (l.pages || []).forEach((pg, i) => { const e = pg.example; if (!e || e.shell == null) return; ex++; const id = `${l.id} p${i} example`; const sh = mk(e.setup); for (const c of lines(e.shell)) { const r = sh.exec(c); if (r.code === 3) fail(id, `'${c}' 는 편집창을 띄워요 — 예제에서는 edit 파일 "내용" 꼴로`); if (r.code === 127) fail(id, `'${c}' → ${r.err.trim()}`); else if (r.err && !e.expectErrors && verbose) console.log(`  (예제 ${id} 의 '${c}' 가 에러를 내요: ${r.err.trim().split('\n')[0]} — 의도한 장면이면 example.expectErrors:true)`); } });
console.log(`run_shell_solutions: 미션·순서 문제 ${n}개 · 예제 ${ex}개 검사`);
console.log('FAILS', fails.length); fails.forEach(f => console.log('  ' + f));
if (fails.length) { console.log('✗ run_shell_solutions 실패'); process.exit(1); }
console.log('✓ run_shell_solutions OK');
