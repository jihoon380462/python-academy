// tools/validate/terminal-git.mjs — 터미널·Git 코스 전용 스키마 규칙. tools/validate_content.mjs 가 코스 공통 규칙 뒤에 부른다 (DESIGN.md 16절).
//   공통 규칙(힌트 3·tags·quiz/fill 형식·parsons 5줄·id 규칙)은 본체가 보고, 여기서는 mission·quiz kind:'cmd'·parsons(셸)·example.shell·보스 미션을 본다.
//   정답 명령의 실제 실행 검증은 tools/run_shell_solutions.mjs.
export const STATE_KEYS = ['cwd', 'cwdStartsWith', 'files', 'dirs', 'noFiles', 'git', 'commits', 'branchCommits', 'branches', 'noBranches', 'head', 'staged', 'stagedEmpty', 'clean', 'noConflictMarkers', 'tags', 'messages', 'lastMessage', 'remoteBranches', 'pushed', 'stash', 'forbid', 'historyIncludes']; // core/engine.js Grader.matchState 가 읽는 키
const TYPES = ['mission', 'quiz', 'fill', 'parsons'];
const isObj = (x) => x && typeof x === 'object' && !Array.isArray(x);
// 선언형인지(함수·정규식 없음) — Node 검증 도구와 기기 연동이 같은 데이터를 JSON 으로 다루므로
const nonDeclarative = (v, path = '') => { if (typeof v === 'function') return path + ' (함수)'; if (v instanceof RegExp) return path + ' (정규식)'; if (Array.isArray(v)) { for (let i = 0; i < v.length; i++) { const r = nonDeclarative(v[i], `${path}[${i}]`); if (r) return r; } } else if (isObj(v)) { for (const k of Object.keys(v)) { const r = nonDeclarative(v[k], path ? `${path}.${k}` : k); if (r) return r; } } return null; };
const checkExpect = (ex, where, err) => { if (!isObj(ex) || !Object.keys(ex).length) { err(`${where}: expect 는 비어 있지 않은 객체`); return; } for (const k of Object.keys(ex)) if (!STATE_KEYS.includes(k)) err(`${where}: expect 키 '${k}' 는 Grader.matchState 가 모르는 키 (가능: ${STATE_KEYS.join(' ')})`); if (ex.files && !isObj(ex.files)) err(`${where}: expect.files 는 {경로: 내용|null|{includes|excludes|lines}} 객체`); for (const k of ['dirs', 'noFiles', 'branches', 'noBranches', 'staged', 'tags', 'messages', 'forbid', 'historyIncludes']) if (ex[k] != null && !Array.isArray(ex[k])) err(`${where}: expect.${k} 는 배열`); };
const checkSetup = (setup, where, err) => { if (!isObj(setup)) { err(`${where}: setup 객체 필요`); return; } if (!isObj(setup.tree)) err(`${where}: setup.tree 는 객체(폴더=객체, 파일=문자열) — 빈 홈이라도 { home: { me: {} } }`); if (setup.cwd != null && !/^\//.test(setup.cwd)) err(`${where}: setup.cwd 는 / 로 시작하는 절대 경로`); if (setup.git != null && !(isObj(setup.git) && Array.isArray(setup.git.commits))) err(`${where}: setup.git 은 { root?, branch?, commits:[{message, files}] }`); if (setup.remote != null && !(isObj(setup.remote) && Array.isArray(setup.remote.commits))) err(`${where}: setup.remote 는 { name?, branch?, commits:[{message, files}] }`); };
export default async (course, { err, warn }) => {
  const byLesson = {};
  for (const p of course.PROBLEMS) {
    const where = p.id; (byLesson[p.lesson] = byLesson[p.lesson] || []).push(p);
    if (!TYPES.includes(p.type)) err(`${where}: 이 코스의 문제 유형은 ${TYPES.join('/')} 뿐 (type '${p.type}')`);
    const nd = nonDeclarative({ setup: p.setup, goals: p.goals, expect: p.expect, forbid: p.forbid, tests: p.tests }, ''); if (nd) err(`${where}: ${nd} — 문제 데이터는 전부 선언형(함수·정규식 금지)`);
    if (p.runner && p.runner !== 'shell') err(`${where}: runner 는 shell(코스 기본) 만`);
    if (p.type === 'mission') {
      checkSetup(p.setup, where, err);
      if (!(Array.isArray(p.goals) && p.goals.length >= 1)) err(`${where}: goals 1개 이상`); else p.goals.forEach((g, i) => { if (!(g && typeof g.text === 'string' && g.text.trim())) err(`${where}: goals[${i}].text 문자열 필요`); checkExpect(g && g.expect, `${where} goals[${i}]`, err); });
      if (p.expect != null) checkExpect(p.expect, where, err);
      if (p.grader != null && p.grader !== 'state') err(`${where}: mission 의 grader 는 'state'`);
      if (p.forbid != null && !(Array.isArray(p.forbid) && p.forbid.every(f => typeof f === 'string' && f.trim()))) err(`${where}: forbid 는 문자열 배열`);
      if (!(typeof p.solution === 'string' && p.solution.trim())) err(`${where}: solution(정답 명령, 줄바꿈으로 여러 줄) 필요`); else if (p.solution.split('\n').some(l => /^\s*edit\s+\S+\s*$/.test(l))) err(`${where}: solution 의 edit 는 내용을 함께 적어야 Node 에서 돌아가요: edit 파일 "내용"`);
      if (typeof p.xp !== 'number') err(`${where}: mission 은 xp 필수 (CONFIG.XP 에 mission 기본값이 없음)`);
      if (p.tests) err(`${where}: mission 에는 tests 를 쓰지 않아요 (goals·expect 로)`);
      if (p.boss && !(p.goals && p.goals.length >= 3)) err(`${where}: 보스 미션은 goals 3개 이상`);
    }
    if (p.type === 'quiz' && p.kind === 'cmd') { const opts = (p.quiz && p.quiz.opts) || []; if (opts.length !== 4) err(`${where}: 명령 퀴즈(kind:'cmd')는 보기 4개`); if (opts.some(o => !/<code>[^<]+<\/code>/.test(String(o)))) err(`${where}: 명령 퀴즈 보기는 <code>명령</code> 꼴`); }
    if (p.type === 'quiz' && p.kind && p.kind !== 'cmd') err(`${where}: quiz 의 kind 는 'cmd' 뿐`);
    if (p.type === 'parsons') {
      const sol = (p.parsons && p.parsons.solution) || ''; if (p.solution !== sol) err(`${where}: parsons 는 solution 과 parsons.solution 이 같아야 해요(정답 보기·검증 도구가 solution 을 읽음)`);
      if (/^\s+\S/m.test(sol)) err(`${where}: 명령 순서 문제의 줄은 들여쓰기 없이`);
      checkSetup(p.setup, where, err); if (!(Array.isArray(p.tests) && p.tests.length >= 1)) err(`${where}: parsons 는 setup + tests:[{expect}] 1개 이상 (명령을 차례로 실행한 뒤 상태 비교)`); else p.tests.forEach((t, i) => checkExpect(t && t.expect, `${where} tests[${i}]`, err));
    }
    if (p.type === 'fill' && p.fill && Array.isArray(p.fill.blanks)) p.fill.blanks.forEach((b, i) => { if (!(b && Array.isArray(b.a) && b.a.length)) err(`${where}: fill.blanks[${i}].a (정답 목록) 필요`); });
    if (p.vary) err(`${where}: 이 코스는 vary(변형) 를 지원하지 않아요`);
  }
  for (const l of course.LESSONS) {
    (l.pages || []).forEach((pg, i) => { const ex = pg.example; if (!ex) return; const w = `레슨 ${l.id} p${i}`; if (ex.code != null) err(`${w}: example.code(파이썬) 는 이 코스에서 쓰지 않아요 — example.shell`); if (ex.shell != null) { if (typeof ex.shell !== 'string' || !ex.shell.trim()) err(`${w}: example.shell 은 명령 문자열(줄바꿈)`); if (ex.setup != null) checkSetup(ex.setup, w, err); const nd = nonDeclarative(ex.setup); if (nd) err(`${w}: example.setup ${nd}`); } else err(`${w}: example 에 shell 이 없어요`); });
    if (l.draft) continue;
    const ps = byLesson[l.id] || [];
    if (l.boss) { const m = ps.filter(p => p.type === 'mission' && p.boss); if (!m.length) err(`보스 레슨 ${l.id} 에 boss:true 미션이 없어요 (draft 가 아니면 필수)`); }
    else { if (ps.length < 3) err(`레슨 ${l.id}: 문제 3개 이상 (지금 ${ps.length})`); if (!ps.some(p => p.type === 'mission')) err(`레슨 ${l.id}: 미션 1개 이상`); if (!(l.pages && l.pages.length >= 3)) err(`레슨 ${l.id}: 쪽 3개 이상`); if (!(l.pages || []).some(pg => pg.example && pg.example.shell)) warn(`레슨 ${l.id}: example.shell 예제가 한 쪽도 없어요`); }
  }
  for (const p of course.PROBLEMS) if (p.boss) { const l = course.LESSONS.find(x => x.id === p.lesson); if (!(l && l.boss)) err(`${p.id}: boss 문제는 보스 레슨(TB*) 에만`); }
};
