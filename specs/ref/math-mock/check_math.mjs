// 레슨 글 속의 식을 다시 계산해 보는 검사 — 나눗셈(몫 · 나머지) · 곱셈 · 뺄셈 · 약수 목록 · 짝.
// 쓰는 법: node specs/ref/math-mock/check_math.mjs   (dump_lesson.mjs 가 뽑은 글을 읽어요. 틀린 줄이 있으면 종료 코드 1)
// 수학 교과서를 만들 때 이 검사를 tools/ 의 검사 도구로 옮겨요(specs/math-course.md 5절).
import { execFileSync } from 'node:child_process'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const text = execFileSync('node', [path.join(here, 'dump_lesson.mjs')], { encoding: 'utf8' }).replace(/\*\*/g, '');
const divisors = (n) => { const out = []; for (let d = 1; d <= n; d++) if (n % d === 0) out.push(d); return out; };
let n = 0; const bad = []; const seen = { 나눗셈: 0, '나눗셈(나머지 안 적음)': 0, 곱셈: 0, 뺄셈: 0, '약수 목록': 0, 짝: 0 };
const ok = (kind, cond, where) => { n++; seen[kind]++; if (!cond) bad.push(`${kind}: ${where}`); };
text.split('\n').forEach((raw, i) => {
  // 「자주 하는 실수」 의 틀린 예는 일부러 틀린 글이라 빼고 봐요
  const line = raw.replace(/틀린 예: .*? \/ 바른 예: /, '바른 예: '); const at = (s) => `${i + 1}줄 「${s}」`;
  for (const m of line.matchAll(/(\d+) ÷ (\d+) = (\d+), 나머지 (\d+)/g)) ok('나눗셈', +m[3] === Math.floor(m[1] / m[2]) && +m[4] === m[1] % m[2], at(m[0]));
  for (const m of line.matchAll(/(\d+) ÷ (\d+) = (\d+)(?!\d|, 나머지)/g)) ok('나눗셈(나머지 안 적음)', m[1] % m[2] === 0 && +m[3] === m[1] / m[2], at(m[0]));
  for (const m of line.matchAll(/(\d+) × (\d+) = (\d+)/g)) ok('곱셈', m[1] * m[2] === +m[3], at(m[0]));
  for (const m of line.matchAll(/(\d+) = (\d+) × (\d+)/g)) ok('곱셈', +m[1] === m[2] * m[3], at(m[0]));
  for (const m of line.matchAll(/(\d+) − (\d+) = (\d+)/g)) ok('뺄셈', m[1] - m[2] === +m[3], at(m[0]));
  for (const m of line.matchAll(/(\d+)의 약수(?:는|:)? ((?:\d+, )+\d+)/g)) ok('약수 목록', m[2] === divisors(+m[1]).join(', '), at(m[0]));
  for (const m of line.matchAll(/(\d+) ÷ (\d+) = (\d+), 나머지 0 → 짝 \((\d+), (\d+)\)/g)) ok('짝', m[2] === m[4] && m[3] === m[5] && m[4] * m[5] === +m[1], at(m[0]));
});
console.log(Object.entries(seen).map(([k, v]) => `${k} ${v}`).join(' · '));
console.log(`식 ${n}개 · 틀린 것 ${bad.length}`); bad.forEach(b => console.log('✗ ' + b)); process.exit(bad.length ? 1 : 0);
