// tools/check_nesting.mjs — 「괄호 지옥」 검사 (v2.8.2, 사용자 지시 11/6 · TODO O1-1): 함수 호출이 3겹 이상 겹친 코드 줄을 찾는다.
//   예) print(sorted(set(nums))) ✗ → nums = set(nums) / nums = sorted(nums) / print(nums) ✓  — 한 줄에 한 단계.
//   보는 곳: 문제 prompt 안 <code>/<pre>, solution, starter, hints, fill·quiz·bug 코드, 레슨 example·본문 <pre>/<code>.
//   사용: node tools/check_nesting.mjs            → 파이썬·알고 모두 검사, 하나라도 있으면 exit 1 (CI 게이트)
//         node tools/check_nesting.mjs python list → 그 코스의 걸린 줄 목록
import fs from 'node:fs'; import vm from 'node:vm';
const courses = process.argv[2] ? [process.argv[2]] : ['python', 'algo', 'files']; let total = 0; // v2.41.0 files 더함(다른 교과서는 아직 걸린 줄이 있어 TODO)
for (const course of courses) {
  const ctx = { window: {}, console }; vm.createContext(ctx);
vm.runInContext((fs.existsSync(`courses/${course}/datasets.js`) ? fs.readFileSync(`courses/${course}/datasets.js`, 'utf8') + '\n' : '') /* v2.41.0 */ + fs.readFileSync(`courses/${course}/content.js`, 'utf8').replace(/^(const|let) /gm, 'var '), ctx);
// HTML(문제 설명·레슨 본문)에서만 태그를 벗긴다 — 태그는 글자로 시작하는 것만(코드의 a <= b 비교를 지우지 않게, v2.8.5 수정)
const dec = (s) => s.replace(/<br\s*\/?>/g, '\n').replace(/<\/?[a-zA-Z][^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"');
// 호출 깊이: 이름( 로 여는 괄호만 호출로 셈(문자열 안은 건너뜀)
function depth(line) {
  let max = 0, stack = [], q = null;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (q) { if (ch === '\\') { i++; continue; } if (ch === q) q = null; continue; }
    if (ch === '#') break;
    if (ch === '"' || ch === "'") { q = ch; continue; }
    if (ch === '(') { const isCall = /[\w\])]$/.test(line.slice(0, i).trimEnd()) && !/\b(if|while|for|in|and|or|not|return|elif|print\s*$)$/.test(''); stack.push(isCall); const d = stack.filter(Boolean).length; if (d > max) max = d; continue; }
    if (ch === ')') { stack.pop(); }
  }
  return max;
}
const out = [];
const scan = (where, text, html = false) => { if (!text) return; for (const raw of (html ? dec(String(text)) : String(text)).split('\n')) { const l = raw.trim(); if (!l) continue; const d = depth(l); if (d >= 3) out.push({ where, d, line: l }); } };
for (const p of ctx.PROBLEMS) {
  const codes = (p.prompt || '').match(/<(code|pre)>[\s\S]*?<\/\1>/g) || []; codes.forEach(c => scan(p.id + ' prompt', c, true));
  scan(p.id + ' solution', p.solution); scan(p.id + ' starter', p.starter);
  (p.hints || []).forEach((h, i) => scan(p.id + ' hint' + (i + 1), h));
  if (p.fill) scan(p.id + ' fill', p.fill.code); if (p.quiz && p.quiz.code) scan(p.id + ' quizcode', p.quiz.code);
  if (p.bug) scan(p.id + ' bug', p.bug.code || '');
}
for (const l of ctx.LESSONS) (l.pages || []).forEach((pg, i) => { if (pg.example) scan(`${l.id} p${i + 1} example`, pg.example.code); ((pg.html || '').match(/<(code|pre)>[\s\S]*?<\/\1>/g) || []).forEach(c => scan(`${l.id} p${i + 1} html`, c, true)); });
const byP = {}; out.forEach(o => { const k = o.where.split(' ')[0]; byP[k] = (byP[k] || 0) + 1; });
console.log((out.length ? '✗' : '✓') + ' check_nesting ' + course + ': 호출 3겹 이상 줄 ' + out.length + '개' + (out.length ? ' (' + Object.keys(byP).join(', ') + ')' : ''));
if (process.argv[3] === 'list' || (out.length && !process.argv[3])) out.forEach(o => console.log(`  ${o.d}겹 ${o.where}: ${o.line}`));
total += out.length;
}
if (total) { console.log('→ 한 줄에 한 단계로 나눠 쓰세요(변수에 담기). 예: print(sorted(set(nums))) → nums = set(nums) / nums = sorted(nums) / print(nums)'); process.exit(1); }
