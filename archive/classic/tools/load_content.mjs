// tools/load_content.mjs — 브라우저 없이 코스 콘텐츠(전역 const 파일들)를 Node에서 읽는 공용 로더
import fs from 'node:fs'; import path from 'node:path'; import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export function courses() { return fs.readdirSync(path.join(ROOT, 'courses')).filter(d => fs.existsSync(path.join(ROOT, 'courses', d, 'content.js'))); }
export function loadCourse(id) {
  const files = ['core/config.js', 'shared/errors.js', 'shared/glossary.js', 'shared/badges.js', `courses/${id}/content.js`].map(f => fs.readFileSync(path.join(ROOT, f), 'utf8')).join('\n');
  const ctx = {}; vm.createContext(ctx);
  vm.runInContext(files + '\n;this.__out={CONFIG,LESSONS,PROBLEMS,DRILLS:typeof DRILLS!=="undefined"?DRILLS:[],CHAPTERS,GUIDES:typeof GUIDES!=="undefined"?GUIDES:{},GUIDES_TEXT:typeof GUIDES_TEXT!=="undefined"?GUIDES_TEXT:{},BADGES,ERRORS,GLOSSARY};', ctx, { filename: id + '/content.js' });
  const meta = JSON.parse(fs.readFileSync(path.join(ROOT, `courses/${id}/course.json`), 'utf8'));
  return { id, meta, ...ctx.__out };
}
export function defaults(p) { const o = {}; if (p.vary) for (const k in p.vary) o[k] = p.vary[k][0]; return o; }
export function instantiate(p) {
  if (!p.vary) return p; const params = defaults(p); const keys = Object.keys(params), vals = keys.map(k => params[k]);
  const sub = s => typeof s !== 'string' ? s : s.replace(/\{\{([^}]+)\}\}/g, (m, e) => String(new Function(...keys, 'return (' + e + ')')(...vals)));
  const q = JSON.parse(JSON.stringify(p)); q.prompt = sub(q.prompt); q.solution = sub(q.solution); q.starter = sub(q.starter); q.hints = (q.hints || []).map(sub);
  if (q.tests) q.tests = q.tests.map(t => ({ ...t, input: sub(t.input), output: sub(t.output), call: sub(t.call), ret: sub(t.ret) })); return q;
}
// run_solutions.py가 읽는 평면 JSON
export function flatProblems(course) {
  return course.PROBLEMS.concat(course.DRILLS || []).map(instantiate).map(p => ({ id: p.id, course: course.id, lesson: p.lesson, type: p.type, title: p.title, boss: !!p.boss, turtle: !!p.turtle, runner: p.runner || course.meta.runner,
    solution: p.type === 'bug' ? p.bug.solution : (p.solution || (p.parsons && p.parsons.solution) || null), tests: p.type === 'bug' ? p.bug.tests : (p.tests || []), parsons: p.parsons ? { solution: p.parsons.solution } : null, limits: p.limits || null, files: p.files || null, answer: p.answer || null, kind: p.kind || null, project: p.project || null }));
}
