// tools/validate/sql.mjs — 데이터베이스(SQL) 코스 전용 필드 규칙. validate_content.mjs 가 코스 sql 을 검사할 때 부른다 (DESIGN.md 16절).
//   sql 유형: p.sql.dataset 이 courses/sql/datasets.js 의 SQL_DATASETS 키에 있어야 함 · p.sql.expect.kind 는 'rows'|'state' · solution 은 문자열 · state 면 expect.table · xp 필수(CONFIG.XP 에 sql 이 없음)
//   레슨 예제 { sql } 의 dataset 도 같은 규칙. 정답 쿼리 실행 검증은 tools/run_sql_solutions.py(Python sqlite3).
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export function datasetIds() {
  const f = path.join(ROOT, 'courses/sql/datasets.js'); if (!fs.existsSync(f)) return [];
  const src = fs.readFileSync(f, 'utf8'); const body = src.slice(src.indexOf('SQL_DATASETS'));
  return [...body.matchAll(/^\s{2}(\w+):\s*`/gm)].map(m => m[1]);
}
export default async (course, { err, warn }) => {
  const ids = datasetIds(); if (!ids.length) err('courses/sql/datasets.js 에서 SQL_DATASETS 키를 못 찾았어요');
  const xpTypes = new Set(['sql']);
  for (const p of course.PROBLEMS) {
    const w = p.id;
    if (p.type === 'sql') {
      if (!(p.sql && typeof p.sql === 'object')) { err(`${w}: type 'sql' 은 sql:{ dataset, expect } 필요`); continue; }
      if (!p.sql.dataset) err(`${w}: sql.dataset 없음`); else if (!ids.includes(p.sql.dataset)) err(`${w}: sql.dataset '${p.sql.dataset}' 이 datasets.js 에 없음 (있는 것: ${ids.join(', ')})`);
      const ex = p.sql.expect || {};
      if (!['rows', 'state'].includes(ex.kind)) err(`${w}: sql.expect.kind 는 'rows' 또는 'state'`);
      if (ex.kind === 'state' && !ex.table) err(`${w}: expect.kind 'state' 는 expect.table(비교할 표 이름) 필요`);
      if (ex.kind === 'rows' && ex.table) warn(`${w}: expect.kind 'rows' 에 table 은 쓰이지 않아요`);
      if (typeof p.solution !== 'string' || !p.solution.trim()) err(`${w}: solution(정답 쿼리 문자열) 필요`);
      if (ex.query != null && typeof ex.query !== 'string') err(`${w}: expect.query 는 문자열`);
      if (p.tests && p.tests.length) warn(`${w}: sql 유형은 tests 를 쓰지 않아요(결과 집합 비교)`);
      if (p.bug || p.parsons || p.fill || p.quiz) err(`${w}: sql 유형에 다른 유형 필드(bug/parsons/fill/quiz)가 섞여 있어요`);
      if (p.starter != null && typeof p.starter !== 'string') err(`${w}: starter 는 문자열`);
    }
    if (p.type === 'bug') err(`${w}: 이 코스에서 bug 유형은 못 써요(파이썬 실행 전제). type:'sql' + starter(틀린 쿼리) + prompt 「틀린 곳을 고치세요」 로`);
    if (p.type === 'code') err(`${w}: 이 코스 페이지에는 파이썬 러너가 없어 code 유형을 못 써요(S13 은 quiz·fill 로, 실행형은 core 요청)`);
    if (xpTypes.has(p.type) && !(typeof p.xp === 'number' && p.xp > 0)) err(`${w}: type '${p.type}' 은 xp 필수(CONFIG.XP 에 없음)`);
    if (p.type === 'quiz' && p.quiz && p.quiz.code && /\n\s*$/.test(p.quiz.code)) warn(`${w}: quiz.code 끝에 빈 줄`);
  }
  for (const l of course.LESSONS) for (const [i, pg] of (l.pages || []).entries()) {
    const ex = pg.example; if (!ex) continue;
    if (ex.code != null) err(`${l.id} p${i}: example.code(파이썬)는 이 코스에서 실행할 수 없어요 — example.sql 로`);
    if (ex.sql != null) { if (typeof ex.sql !== 'string' || !ex.sql.trim()) err(`${l.id} p${i}: example.sql 은 비어 있지 않은 문자열`); if (ex.dataset && !ids.includes(ex.dataset)) err(`${l.id} p${i}: example.dataset '${ex.dataset}' 이 datasets.js 에 없음`); }
  }
};
