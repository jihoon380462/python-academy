#!/usr/bin/env node
// tools/extract.mjs — run_solutions.py가 읽는 problems.json(전 코스 평면 목록)과 examples.json을 scratch 폴더에 쓴다
import fs from 'node:fs'; import path from 'node:path';
import { ROOT, courses, loadCourse, flatProblems } from './load_content.mjs';
const out = path.resolve(process.argv[2] || path.join(ROOT, 'tools/.out')); fs.mkdirSync(out, { recursive: true });
const probs = [], ex = [];
for (const id of courses()) { const c = loadCourse(id); probs.push(...flatProblems(c)); c.LESSONS.forEach(l => (l.pages || []).forEach((pg, i) => { if (pg.example) ex.push({ course: id, lesson: l.id, page: i, code: pg.example.code, stdin: pg.example.stdin || '' }); })); }
fs.writeFileSync(path.join(out, 'problems.json'), JSON.stringify(probs, null, 1)); fs.writeFileSync(path.join(out, 'examples.json'), JSON.stringify(ex, null, 1));
console.log(`extract: 문제 ${probs.length} · 예제 ${ex.length} → ${out}`);
