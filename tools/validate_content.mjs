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
    // QA #48: 테스트가 부르는 도우미(build·to_list·make 등)가 정답에만 있고 starter 에 없으면 학습자는 NameError 로 통과 불가
    if (p.starter && (p.tests || []).some(t => t.call)) { const defs = (src) => new Set([...String(src || '').matchAll(/^(?:def|class) (\w+)/gm)].map(m => m[1])); const sd = defs(p.starter); const called = new Set((p.tests || []).flatMap(t => [...String(t.call || '').matchAll(/\b([A-Za-z_]\w*)\s*\(/g)].map(m => m[1]))); const miss = [...defs(p.solution)].filter(n => !sd.has(n) && called.has(n) && !String(p.prompt || '').includes(n)); if (miss.length) err(`${where}: 테스트가 부르는 ${miss.join(', ')} 가 starter 에 없어요(정답에만 있음) — starter 끝에 "채점용 도우미"로 넣기`); }
    if (p.project) { if (!Array.isArray(p.project.steps) || !p.project.steps.length) err(`${where}: project.steps 배열 필요`); else { const stages = new Set((p.tests || []).map(t => t.stage).filter(s => s != null)); for (const s of stages) if (!(Number.isInteger(s) && s >= 0 && s < p.project.steps.length)) err(`${where}: tests[].stage ${s} 가 steps 범위 밖`); const practical = (c.LESSONS.find(l => l.id === p.lesson) || {}).practical; if (practical) { for (let i = 0; i < p.project.steps.length; i++) if (!stages.has(i)) err(`${where}: 단계 ${i}를 검사하는 테스트가 없음`); if ((p.xp || 0) < p.project.steps.length * 25) err(`${where}: 실전 프로젝트 xp는 단계수×25 이상`); } } }
    if (p.files) { if (p.files.upload && !(p.files.upload.name && typeof p.files.upload.sample === 'string')) err(`${where}: files.upload 에 name·sample 필요`); if (p.files.outputs && !Array.isArray(p.files.outputs)) err(`${where}: files.outputs 는 배열`); for (const t of (p.tests || [])) if (t.outFile && !(p.files.outputs || []).includes(t.outFile)) err(`${where}: test.outFile ${t.outFile} 가 files.outputs 에 없음`); }
  }
  for (const p of c.PROBLEMS) { const where = `${id}/${p.id}`; // 수학 공간 유형 (v2.3.0)
    if (p.type === 'num') { if (!(p.answer && typeof p.answer.value === 'number')) err(`${where}: num 은 answer.value 숫자 필요`); else if (p.answer.tol == null) err(`${where}: num 은 answer.tol 필수`); if (!p.solution) err(`${where}: num 은 solution(계산 코드) 필요`); }
    if (p.type === 'match') { if (!(p.match && p.match.params && Object.keys(p.match.params).length)) err(`${where}: match.params 필요`); if (!(p.figure || (c.LESSONS.find(l => l.id === p.lesson) || {}).pages?.[0]?.figure)) err(`${where}: match 는 figure 필요`); }
    if (p.type === 'pair') { if (!(p.pair && Array.isArray(p.pair.left) && Array.isArray(p.pair.right) && Array.isArray(p.pair.answer) && p.pair.answer.length === p.pair.left.length)) err(`${where}: pair.left/right/answer 형식 오류`); else if (p.pair.answer.some(a => !(Number.isInteger(a) && a >= 0 && a < p.pair.right.length))) err(`${where}: pair.answer 인덱스 범위`); }
    if (p.kind === 'explore' && p.type !== 'quiz') err(`${where}: explore 는 quiz 유형`); if (p.requireInteract && p.kind !== 'explore') err(`${where}: requireInteract 는 explore 전용`); }
  if (c.meta.map === 'graph') { const ids = new Set(c.LESSONS.map(l => l.id)); // 지식 지도 코스: 첫 화면 그림·params·prereq·순환
    for (const l of c.LESSONS) { if (!(l.pages && l.pages[0] && l.pages[0].figure && l.pages[0].figure.kind)) err(`${id}: 노드 ${l.id} 첫 페이지에 figure 가 없음 (그림이 먼저)`); if (!Array.isArray(l.params) || l.params.length > 3) err(`${id}: 노드 ${l.id} params 는 0~3개 배열`); for (const d of (l.params || [])) if (!(d.id && d.min != null && d.max != null)) err(`${id}: 노드 ${l.id} param ${d.id || '?'} 에 id/min/max 필요`); if (!(l.pages[0].observe && l.pages[0].observe.length >= 2 && l.pages[0].observe.length <= 3)) err(`${id}: 노드 ${l.id} observe 질문 2~3개`); if (!l.subtitle) err(`${id}: 노드 ${l.id} subtitle(학교식 이름) 없음`); for (const q of (l.prereq || [])) if (!ids.has(q)) err(`${id}: 노드 ${l.id} prereq ${q} 없음`); if (!c.PROBLEMS.some(p => p.lesson === l.id && p.kind === 'explore')) err(`${id}: 노드 ${l.id} 탐구 퀴즈 없음`); }
    const state = {}; const visit = (lid, stack) => { if (state[lid] === 2) return; if (state[lid] === 1) { err(`${id}: prereq 순환 ${[...stack, lid].join(' → ')}`); return; } state[lid] = 1; for (const q of ((c.LESSONS.find(l => l.id === lid) || {}).prereq || [])) visit(q, [...stack, lid]); state[lid] = 2; }; c.LESSONS.forEach(l => visit(l.id, [])); }
  for (const gid of Object.keys(c.GUIDES)) if (!pids.has(gid)) err(`${id}: GUIDES에 없는 문제 ${gid}`);
  const termSet = Object.assign({}, c.GLOSSARY); c.LESSONS.forEach(l => Object.assign(termSet, l.terms || {}));
  for (const l of c.LESSONS) (l.pages || []).forEach((pg, i) => { for (const m of (pg.html || '').matchAll(/\[\[([^\]]+)\]\]/g)) if (!(m[1] in termSet)) err(`${id}: 레슨 ${l.id} p${i} 용어 [[${m[1]}]] 가 용어집에 없음`); });
  const cfgCourse = (c.CONFIG.COURSES || []).find(x => x.id === id); if (cfgCourse && cfgCourse.ready) { if (cfgCourse.total !== c.PROBLEMS.length) err(`${id}: CONFIG.COURSES total ${cfgCourse.total} ≠ 실제 문제 수 ${c.PROBLEMS.length} (core/config.js 갱신)`); if (cfgCourse.lessons !== c.LESSONS.length) err(`${id}: CONFIG.COURSES lessons ${cfgCourse.lessons} ≠ 실제 레슨 수 ${c.LESSONS.length}`); }
  for (const l of c.LESSONS) if (l.practical && !c.PROBLEMS.some(p => p.lesson === l.id && p.project)) err(`${id}: 실전 레슨 ${l.id} 에 project 문제가 없음`);
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
