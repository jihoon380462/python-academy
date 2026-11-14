// 시안의 레슨 내용(src/lesson.js)을 설계 문서에 넣을 마크다운으로 뽑아요 — 손으로 옮겨 적지 않으려고(LESSON R10).
// 쓰는 법: node specs/ref/math-mock/dump_lesson.mjs → 표준 출력(specs/math-course.md 6절에 그대로 붙여요)
import fs from 'node:fs'; import vm from 'node:vm'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const cx = {}; vm.createContext(cx); vm.runInContext(fs.readFileSync(path.join(here, 'src/lesson.js'), 'utf8').replace(/^const (\w+)/mg, 'var $1'), cx);
const L = cx.LESSON;
// 태그를 마크다운으로: 굵게만 살리고 나머지 태그는 지워요. 그림(svg · figure)은 「(그림: 설명)」 으로
const md = (h) => String(h)
  .replace(/<figure[^>]*>\s*<svg[^>]*aria-label="([^"]*)"[^>]*>[\s\S]*?<\/svg>\s*<figcaption>([\s\S]*?)<\/figcaption>\s*<\/figure>/g, (m, a, c) => `\n(그림: ${a})\n`)
  .replace(/<div class="mx-nums"[^>]*aria-label="([^"]*)"[^>]*>[\s\S]*?<\/div>(?=\s*<div class="mx-eq")/g, (m, a) => `\n(그림: ${a})\n`)
  .replace(/<div class="mx-rel"[^>]*aria-label="([^"]*)"[^>]*>[\s\S]*?<\/div><\/div>/g, (m, a) => `\n(그림: ${a})\n`)
  .replace(/<div class="mx-eq">([\s\S]*?)<\/div>/g, (m, a) => `\n> ${a}\n`)
  .replace(/<\/p>/g, '\n').replace(/<p[^>]*>/g, '\n').replace(/<b[^>]*>/g, '**').replace(/<\/b>/g, '**')
  .replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
  .replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
const ind = (s, n = 2) => s.split('\n').map(l => l ? ' '.repeat(n) + l : l).join('\n');
const out = [];
out.push(`레슨 ${L.n} 「${L.title}」 — ${L.sub} (챕터 ${L.ch} ${L.chName})`, '');
L.parts.forEach((p, i) => {
  out.push(`**${i + 1}. ${p.title}**`, '');
  if (p.kind === 'example') {
    out.push(`- 문제: ${md(p.q)}`, `- 이끄는 말: ${md(p.lead)}`, '- 풀이 줄'); p.steps.forEach((s, k) => out.push(`  ${k + 1}. ${md(s)}`));
    if (p.why) out.push(`- 덧붙임: ${md(p.why)}`); if (p.after) out.push(`- ${md(p.after())}`); out.push(`- 답: ${md(p.answer)}`);
  } else { if (p.scene) out.push(`- 장면: ${md(p.scene)}`, ''); out.push(ind(md(p.html()), 0)); }
  out.push('');
});
out.push('**연습 문제**', '');
L.practice.forEach((t, i) => { out.push(`${i + 1}. ${t.home ? '(생활형) ' : ''}**${t.title}** — ${md(t.q).replace(/\n+\s*/g, ' / ')}`, `   - 답: ${md(t.answer)}`, '   - 풀이 줄', ...t.steps.map((x, k) => `     ${k + 1}. ${md(x)}`), `   - 막히면 다시 볼 곳: ${L.parts.find(p => p.id === t.see).short}`); });
out.push('', '**자주 하는 실수**', '');
L.mistakes.forEach((m, i) => out.push(`${i + 1}. **${md(m.t)}** — 틀린 예: ${md(m.bad)} / 바른 예: ${md(m.good)} / ${md(m.tip)}`));
console.log(out.join('\n'));
