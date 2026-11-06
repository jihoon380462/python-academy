// core/book-derive.js — 교과서 「만들어 보기」 문제 하나를 화면에 보일 모양으로 바꾸기 (v2.15.0 알고리즘 교과서)
// 화면(core/ui-views-book.js)과 검사(tools/check_book.mjs)가 이 함수 하나를 같이 써요 → 검사한 출력 예 = 화면에 보이는 출력 예
//   t: book.js 의 문제 { title, text, needs, pid?, io?, answer?, given?, start?, check?, … }   p: pid 의 옛 문제(content.js) 또는 null
//   B: 그 코스의 BOOK — B.fixPrompt(지문 html) · B.fixCode(시작 코드·고칠 코드·예시 답) 가 있으면 다듬어 씀(예: 「👀 시각화용」 「채점용 도우미」 같은 이 앱 안내 지우기)
//   옛 문제 종류별로:
//     code  → tests 의 첫 입력·출력. 함수 문제(tests 가 call/ret)는 「확인 코드」(print(호출) 몇 줄)와 그 출력으로
//     bug   → bug.tests · bug.solution, 고칠 코드는 bug.code (given: true 일 때)
//     fill  → 빈칸 코드(___1___)를 「채울 코드」로, 빈칸을 정답으로 채운 코드를 예시 답으로
//     project(실전) → 명령(단계)마다 하나씩, 최대 4개
//   start: true → 옛 문제의 starter 를 「시작 코드」로(연결 리스트 Node 클래스처럼 미리 있어야 하는 코드)
const BookDerive = {
  // 함수가 돌려준 값의 repr → print() 했을 때 보이는 글자 ('abc' → abc, 나머지는 그대로)
  shown(ret) { const s = String(ret); const m = s.match(/^'([^'\\]*)'$/) || s.match(/^"([^"\\]*)"$/); return m ? m[1] : s; },
  task(t, p, B) {
    const fix = (B && B.fixPrompt) || null; const fc = (B && B.fixCode) || ((x) => x);
    const src = p && p.bug ? { tests: p.bug.tests, solution: p.bug.solution, starter: p.bug.code } : p;
    const tests = (src && src.tests) || [];
    const plain = tests.filter(c => !c.files && !c.inputGen && c.output !== '__COMPUTED__' && c.ret !== '__COMPUTED__');
    let io = t.io || null; let check = t.check || '';
    if (!io) {
      if (p && p.project) io = plain.filter((c, i, ok) => ok.findIndex(d => d.stage === c.stage) === i).slice(0, 4);
      else if (plain.length && plain.every(c => c.call != null)) { const cs = plain.slice(0, 3); if (!check) check = cs.map(c => `print(${c.call})`).join('\n'); io = [{ output: cs.map(c => BookDerive.shown(c.ret)).join('\n') }]; }
      else io = tests[0] ? [tests[0]] : [];
    }
    const fill = p && p.fill;
    const filled = fill ? fill.code.replace(/___(\d+)___/g, (m, k) => ((fill.blanks[+k - 1] || {}).a || [m])[0]) : '';
    let text = t.text === '@prompt' && p ? String(p.prompt).replace(/<p>📎[\s\S]*?<\/p>/g, '') : t.text;
    if (fix) text = fix(text);
    const up = p && p.files && p.files.upload;
    return { ...t, text, io, check,
      answer: fc(t.answer || (src && src.solution) || filled || ''),
      given: fc(t.given && src ? (t.given === true ? src.starter : t.given) : t.given && !src ? t.given : fill && t.given !== false ? fill.code : ''),
      start: fc(t.start && src ? (t.start === true ? src.starter : t.start) : ''),
      prep: up && up.sample ? { name: up.name, text: up.sample } : (t.prep || null) };
  },
};
if (typeof module !== 'undefined') module.exports = BookDerive;
