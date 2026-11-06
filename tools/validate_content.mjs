#!/usr/bin/env node
// tools/validate_content.mjs — 배포 전 게이트 1. 콘텐츠 스키마·id 중복·힌트 수·태그·테스트·레슨 참조·?v= 버전 일치 검사. 에러가 하나라도 있으면 exit 1.
import fs from 'node:fs'; import path from 'node:path';
import { ROOT, courses, loadCourse } from './load_content.mjs';
const errors = [], warns = [];
const err = (m) => errors.push(m), warn = (m) => warns.push(m);
const EXEC = new Set(['code', 'parsons', 'bug']);
let totals = { lessons: 0, problems: 0 };
for (const id of courses()) {
  const c = loadCourse(id); const lessonIds = new Set(); const pids = new Set();
  if (!c.meta.id || c.meta.id !== id) err(`${id}: course.json의 id가 폴더 이름과 달라요`);
  for (const l of c.LESSONS) { if (lessonIds.has(l.id)) err(`${id}: 레슨 id 중복 ${l.id}`); lessonIds.add(l.id); if (!l.title) err(`${id}: 레슨 ${l.id} 제목 없음`); if (!l.boss && !l.draft && !(l.pages && l.pages.length)) err(`${id}: 레슨 ${l.id} 페이지 없음`); /* v2.7.0: draft 레슨(뼈대)은 본문 없어도 됨 */ }
  if (c.LESSONS.some(l => l.draft)) warn(`${id}: 준비 중(draft) 레슨 ${c.LESSONS.filter(l => l.draft).length}개 — 본문·문제 채우면 draft 를 지우세요`);
  for (const p of [...c.PROBLEMS, ...(c.DRILLS || [])]) {
    const where = `${id}/${p.id}`;
    if ((c.DRILLS || []).includes(p)) { if (p.type !== 'code') err(`${where}: 타자 연습(DRILLS)은 type 'code' 만`); if (!(p.tests && p.tests.length >= 2)) err(`${where}: 타자 연습 테스트 2개 이상`); if (p.boss || p.project) err(`${where}: 타자 연습에 boss/project 불가`); }
    if (pids.has(p.id)) err(`${where}: 문제 id 중복`); pids.add(p.id);
    // QA 6회전: 「이렇게 나오면 돼요」 출력 상자는 테스트 1 출력과 같아야 해요(글자 그대로의 \n 이 화면에 보이던 회귀 방지)
    { const m = (p.prompt || '').match(/이렇게 나오면 돼요<\/b>[\s\S]*?<pre>([\s\S]*?)<\/pre>/); const t0 = p.tests && p.tests[0]; if (m && t0 && t0.output != null && !/__COMPUTED__/.test(t0.output)) { const shown = m[1].replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&'); const norm = (x) => String(x).split('\n').map(l => l.trimEnd()).join('\n').trim(); if (norm(shown) !== norm(t0.output)) err(`${where}: 「이렇게 나오면 돼요」 상자가 테스트 1 출력과 달라요 (${JSON.stringify(shown.slice(0, 40))} ↔ ${JSON.stringify(String(t0.output).slice(0, 40))})`); } }
    if (p.quiz && typeof p.quiz.why === 'string' && /<[a-z][^>]*>/i.test(p.quiz.why)) err(`${where}: quiz.why 는 글자 그대로 보여요(이스케이프) — HTML 태그를 쓰지 마세요`);
    if (!lessonIds.has(p.lesson)) err(`${where}: 없는 레슨 참조 ${p.lesson}`);
    if (!p.title) err(`${where}: 제목 없음`); if (!p.type) err(`${where}: type 없음`);
    // v2.4.0 (TODO ★1, 사용자 결정 D2): 블록(Blockly) 유형과 「Parsons/텍스트 고르기」(dual) 삭제 — 전부 타자. Parsons 는 줄 순서·들여쓰기 자체가 연습인 문제(정답 5줄 이상)만
    if (p.type === 'block') err(`${where}: type 'block' 은 삭제됐어요 — 'code' 로 바꾸고 starter·지문에 쓸 줄을 적어 주세요 (TODO ★1)`);
    if (p.dual) err(`${where}: dual 은 삭제됐어요 — 기본은 타자(code). 필드를 지워 주세요`);
    if (p.type === 'parsons') { const n = String(p.parsons && p.parsons.solution || '').split('\n').filter(l => l.trim()).length; if (n <= 4) err(`${where}: Parsons 정답이 ${n}줄 — 4줄 이하는 타자(code)로 (D2)`); }
    if (p.type === 'code' && p.parsons) err(`${where}: code 문제에 parsons 필드가 남아 있어요 (dual 잔재)`);
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
    if (p.unlockWhen !== undefined && typeof p.unlockWhen !== 'function') err(`${where}: unlockWhen 은 (params) => 조건 함수여야 해요`); if (p.unlockWhen && p.kind !== 'explore') warn(`${where}: unlockWhen 은 탐구 퀴즈(kind:'explore')에서만 쓰여요`);
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
  for (const l of c.LESSONS) (l.pages || []).forEach((pg, i) => { for (const m of (pg.html || '').matchAll(/\[\[([^\]]+)\]\]/g)) { if (m[1].startsWith('레슨:')) { if (!lessonIds.has(m[1].slice(3))) err(`${id}: 레슨 ${l.id} p${i} 레슨 참조 [[${m[1]}]] 가 없는 레슨`); continue; } /* v2.5.0: [[레슨:L11C]] 는 렌더 때 「레슨 N」으로 바뀜 */ if (!(m[1] in termSet)) err(`${id}: 레슨 ${l.id} p${i} 용어 [[${m[1]}]] 가 용어집에 없음`); } });
  if (id === 'python') for (const l of c.LESSONS) (l.pages || []).forEach((pg, i) => { for (const m of (pg.html || '').matchAll(/레슨 (\d+)(?![\d쪽개])/g)) warn(`${id}: 레슨 ${l.id} p${i} 「레슨 ${m[1]}」 숫자 참조 — 번호가 밀릴 수 있으니 [[레슨:ID]] 토큰으로`); });
  for (const p of c.PROBLEMS) for (const m of String(p.prompt || '').matchAll(/\[\[레슨:([^\]]+)\]\]/g)) if (!lessonIds.has(m[1])) err(`${id}/${p.id}: 지문의 레슨 참조 [[레슨:${m[1]}]] 가 없는 레슨`);
  { const pat = (c.CONFIG.COURSE_ID_PATTERNS || {})[id]; if (!pat) err(`${id}: CONFIG.COURSE_ID_PATTERNS 에 이 코스의 id 규칙이 없어요 (기기 연동이 코스를 구분하는 데 씀, QA #67)`); else { const re = new RegExp(pat); const bad = [...c.LESSONS, ...c.PROBLEMS, ...(c.DRILLS || [])].map(x => x.id).filter(x => !re.test(x)); if (bad.length) err(`${id}: id 규칙(${pat})에 안 맞는 id ${bad.slice(0, 5).join(', ')}`); for (const [o, op] of Object.entries(c.CONFIG.COURSE_ID_PATTERNS)) if (o !== id) { const clash = [...c.LESSONS, ...c.PROBLEMS, ...(c.DRILLS || [])].map(x => x.id).filter(x => new RegExp(op).test(x)); if (clash.length) err(`${id}: id ${clash.slice(0, 3).join(', ')} 가 ${o} 코스 규칙에도 맞아요 — 기기 연동이 헷갈려요`); } } }
  const cfgCourse = (c.CONFIG.COURSES || []).find(x => x.id === id); if (cfgCourse && cfgCourse.ready && !(cfgCourse.book && id !== 'python')) { /* v2.10.1: 교과서 코스의 lessons = 열린 레슨 수(허브 「읽은 레슨 n/m」) — check_book 이 검사. 파이썬은 레슨 전부가 열려 있어 그대로 */ if (cfgCourse.total !== c.PROBLEMS.length) err(`${id}: CONFIG.COURSES total ${cfgCourse.total} ≠ 실제 문제 수 ${c.PROBLEMS.length} (core/config.js 갱신)`); if (cfgCourse.lessons !== c.LESSONS.length) err(`${id}: CONFIG.COURSES lessons ${cfgCourse.lessons} ≠ 실제 레슨 수 ${c.LESSONS.length}`); }
  // v2.7.0 코스별 추가 규칙(tools/validate/<코스>.mjs 가 있으면 그 파일의 default(c, { err, warn }) 를 부름)
  { const extra = path.join(ROOT, 'tools/validate', id + '.mjs'); if (fs.existsSync(extra)) { const m = await import('file://' + extra); await m.default(c, { err: (x) => err(`${id}: ${x}`), warn: (x) => warn(`${id}: ${x}`) }); } }
  for (const l of c.LESSONS) if (l.practical && !c.PROBLEMS.some(p => p.lesson === l.id && p.project)) err(`${id}: 실전 레슨 ${l.id} 에 project 문제가 없음`);
  for (const p of c.PROBLEMS) if (p.boss) { const tests = p.type === 'bug' ? p.bug.tests : p.tests; if (tests && tests.length < 5) err(`${id}/${p.id}: 보스 테스트 5개 미만`); }
  totals.lessons += c.LESSONS.length; totals.problems += c.PROBLEMS.length;
  console.log(`✓ ${id}: 레슨 ${c.LESSONS.length} · 문제 ${c.PROBLEMS.length}${(c.DRILLS || []).length ? ` · 타자 연습 ${c.DRILLS.length}` : ""} · 가이드 ${Object.keys(c.GUIDES).length}`);
}
// ?v= 버전 일치 (캐시 깨기): 모든 html의 ?v= 가 APP_VERSION 과 같아야 함
const cfg = fs.readFileSync(path.join(ROOT, 'core/config.js'), 'utf8'); const ver = (cfg.match(/APP_VERSION:\s*'([^']+)'/) || [])[1];
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.name.startsWith('.') || e.name === 'node_modules' || e.name === 'legacy' ? [] : e.isDirectory() ? walk(path.join(d, e.name)) : e.name.endsWith('.html') ? [path.join(d, e.name)] : []);
for (const f of walk(ROOT)) { const s = fs.readFileSync(f, 'utf8'); for (const m of s.matchAll(/\?v=([0-9.]+)/g)) if (m[1] !== ver) err(`${path.relative(ROOT, f)}: ?v=${m[1]} ≠ APP_VERSION ${ver} (node tools/stamp.mjs 실행)`); }
console.log(`APP_VERSION ${ver} · 총 레슨 ${totals.lessons} · 문제 ${totals.problems}`);
warns.forEach(w => console.log('  ⚠ ' + w));
if (errors.length) { console.error(`✗ 에러 ${errors.length}개`); errors.forEach(e => console.error('  ' + e)); process.exit(1); }
console.log('✓ validate_content OK');
