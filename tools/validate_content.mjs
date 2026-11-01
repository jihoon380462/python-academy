#!/usr/bin/env node
// tools/validate_content.mjs — 배포 전 게이트 1. 콘텐츠 스키마·id 중복·힌트 수·태그·테스트·레슨 참조·?v= 버전 일치 검사. 에러가 하나라도 있으면 exit 1.
import fs from 'node:fs'; import path from 'node:path';
import { ROOT, courses, loadCourse } from './load_content.mjs';
const errors = [], warns = [];
const err = (m) => errors.push(m), warn = (m) => warns.push(m);
const EXEC = new Set(['code', 'block', 'parsons', 'bug']);
let totals = { lessons: 0, problems: 0 };
for (const id of courses()) {
  const c = loadCourse(id); const lessonIds = new Set(); const pids = new Set();
  if (!c.meta.id || c.meta.id !== id) err(`${id}: course.json의 id가 폴더 이름과 달라요`);
  for (const l of c.LESSONS) { if (lessonIds.has(l.id)) err(`${id}: 레슨 id 중복 ${l.id}`); lessonIds.add(l.id); if (!l.title) err(`${id}: 레슨 ${l.id} 제목 없음`); if (!l.boss && !(l.pages && l.pages.length)) err(`${id}: 레슨 ${l.id} 페이지 없음`); }
  for (const p of c.PROBLEMS) {
    const where = `${id}/${p.id}`;
    if (pids.has(p.id)) err(`${where}: 문제 id 중복`); pids.add(p.id);
    if (!lessonIds.has(p.lesson)) err(`${where}: 없는 레슨 참조 ${p.lesson}`);
    if (!p.title) err(`${where}: 제목 없음`); if (!p.type) err(`${where}: type 없음`);
    if (!Array.isArray(p.hints) || p.hints.length < 3) err(`${where}: 힌트 3개 미만`);
    if (!Array.isArray(p.tags) || !p.tags.length) err(`${where}: 태그 없음`);
    if (EXEC.has(p.type)) { const tests = p.type === 'bug' ? (p.bug && p.bug.tests) : p.tests; if (!tests || !tests.length) err(`${where}: 실행형 문제인데 테스트 없음`); const sol = p.type === 'bug' ? (p.bug && p.bug.solution) : (p.solution || (p.parsons && p.parsons.solution)); if (!sol) err(`${where}: 정답 코드 없음`); }
    if (p.type === 'quiz' && !(p.quiz && Array.isArray(p.quiz.opts) && typeof p.quiz.ans === 'number')) err(`${where}: quiz 형식 오류`);
    if (p.type === 'fill' && !(p.fill && p.fill.code && Array.isArray(p.fill.blanks))) err(`${where}: fill 형식 오류`);
    if (p.vary) for (const [k, v] of Object.entries(p.vary)) if (!Array.isArray(v) || v.length !== 2) err(`${where}: vary.${k}는 [lo, hi]`);
    if (p.runner && !['python', 'sql', 'shell', 'web', 'none'].includes(p.runner)) err(`${where}: runner 값 오류 ${p.runner}`);
    if (p.grader && !['stdout', 'return', 'state', 'custom'].includes(p.grader)) err(`${where}: grader 값 오류 ${p.grader}`);
  }
  for (const gid of Object.keys(c.GUIDES)) if (!pids.has(gid)) err(`${id}: GUIDES에 없는 문제 ${gid}`);
  const termSet = Object.assign({}, c.GLOSSARY); c.LESSONS.forEach(l => Object.assign(termSet, l.terms || {}));
  for (const l of c.LESSONS) (l.pages || []).forEach((pg, i) => { for (const m of (pg.html || '').matchAll(/\[\[([^\]]+)\]\]/g)) if (!(m[1] in termSet)) err(`${id}: 레슨 ${l.id} p${i} 용어 [[${m[1]}]] 가 용어집에 없음`); });
  const cfgCourse = (c.CONFIG.COURSES || []).find(x => x.id === id); if (cfgCourse && cfgCourse.ready) { if (cfgCourse.total !== c.PROBLEMS.length) err(`${id}: CONFIG.COURSES total ${cfgCourse.total} ≠ 실제 문제 수 ${c.PROBLEMS.length} (core/config.js 갱신)`); if (cfgCourse.lessons !== c.LESSONS.length) err(`${id}: CONFIG.COURSES lessons ${cfgCourse.lessons} ≠ 실제 레슨 수 ${c.LESSONS.length}`); }
  for (const p of c.PROBLEMS) if (p.boss) { const tests = p.type === 'bug' ? p.bug.tests : p.tests; if (tests && tests.length < 5) err(`${id}/${p.id}: 보스 테스트 5개 미만`); }
  totals.lessons += c.LESSONS.length; totals.problems += c.PROBLEMS.length;
  console.log(`✓ ${id}: 레슨 ${c.LESSONS.length} · 문제 ${c.PROBLEMS.length} · 가이드 ${Object.keys(c.GUIDES).length}`);
}
// ?v= 버전 일치 (캐시 깨기): 모든 html의 ?v= 가 APP_VERSION 과 같아야 함
const cfg = fs.readFileSync(path.join(ROOT, 'core/config.js'), 'utf8'); const ver = (cfg.match(/APP_VERSION:\s*'([^']+)'/) || [])[1];
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.name.startsWith('.') || e.name === 'node_modules' || e.name === 'legacy' ? [] : e.isDirectory() ? walk(path.join(d, e.name)) : e.name.endsWith('.html') ? [path.join(d, e.name)] : []);
for (const f of walk(ROOT)) { const s = fs.readFileSync(f, 'utf8'); for (const m of s.matchAll(/\?v=([0-9.]+)/g)) if (m[1] !== ver) err(`${path.relative(ROOT, f)}: ?v=${m[1]} ≠ APP_VERSION ${ver} (node tools/stamp.mjs 실행)`); }
console.log(`APP_VERSION ${ver} · 총 레슨 ${totals.lessons} · 문제 ${totals.problems}`);
warns.forEach(w => console.log('  ⚠ ' + w));
if (errors.length) { console.error(`✗ 에러 ${errors.length}개`); errors.forEach(e => console.error('  ' + e)); process.exit(1); }
console.log('✓ validate_content OK');
