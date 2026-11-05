#!/usr/bin/env node
// tools/check_level.mjs — 「난이도는 레슨이 가르친 만큼만」(DESIGN 14-2절, TODO ★4-1, QA #160) 자동 측정.
// 문제마다 ① 정답·힌트 3이 쓰는 파이썬 기능 중 그 시점까지 본문에 한 번도 안 나온 것 ② 이 레슨에서 처음 나온 기능을 몇 개 합쳤나
// ③ 레슨 첫 문제가 나머지보다 무거운가 를 재서 사람이 읽는 표로 낸다. 정규식 기반 — 오탐 가능.
//
//   node tools/check_level.mjs                 걸린 문제만 (코스별 마크다운 표 + 요약)
//   node tools/check_level.mjs --all           전부
//   node tools/check_level.mjs --course python 한 코스
//   node tools/check_level.mjs --lesson L11    한 레슨 상세 (기능마다 어디서 쓰였고 어디서 처음 가르쳤는지)
//   node tools/check_level.mjs --json          JSON
//   node tools/check_level.mjs --gate          baseline(check_level.baseline.json) 보다 걸린 수가 늘면 exit 1 (래칫)
//   node tools/check_level.mjs --update-baseline   baseline 갱신
//
// 「본문」 = 그 레슨까지(포함)의 pages[].html(접힌 <details> 「더 알아보기」 제외) + pages[].example.code + 같은 레슨 앞 문제의 지문·starter.
// 대상: runner 가 python 이고 지식 지도(map:'graph')가 아닌 코스 (python·algo). math 는 「대상 아님」, terminal-git 은 건너뜀.
import fs from 'node:fs'; import path from 'node:path';
import { ROOT, courses, loadCourse, instantiate } from './load_content.mjs';

// =====================================================================
// 기능 카탈로그 — 여기 한 곳만 고치면 된다. [라벨, 정규식(코드 쪽은 문자열·주석을 지운 뒤 적용), 비고]
// 라벨이 곧 기능 id. 정규식은 g 플래그 없이 적고, 여러 줄 꼴은 m 플래그.
// 「구조」 기능(2중 for·중첩 함수·재귀)은 아래 scanStructure 가 들여쓰기로 잰다 (정규식 아님).
// =====================================================================
const KW = (w) => new RegExp(`(?<![\\w.])${w}\\b`);
const CALL = (w) => new RegExp(`(?<![\\w.])${w}\\s*\\(`);            // 변수 이름이 list 여도 list( 꼴만 센다
const METHOD = (w) => new RegExp(`\\.${w}\\s*\\(`);
const CATALOG = [
  // --- 키워드 ---
  ['for', /(?<![\w.])for\b(?![^\n]*\bin\b[^\n]*\])/, '반복(컴프리헨션 안의 for 는 제외)'],
  ['while', KW('while')], ['if', KW('if')], ['elif', KW('elif')], ['else', KW('else')],
  ['def', KW('def')], ['return', KW('return')], ['class', KW('class')],
  ['lambda', KW('lambda')], ['try/except', /(?<![\w.])(?:try|except)\b/], ['finally', KW('finally')], ['raise', KW('raise')],
  ['except 예외이름', /(?<![\w.])except\s+[A-Z]\w*/], ['except ... as', /(?<![\w.])except\b[^\n:]*\bas\s+\w+/],
  ['with', KW('with')], ['with open', /(?<![\w.])with\s+open\s*\(/],
  ['in (포함 검사)', /(?<!\bfor\b[^\n]*)(?<![\w.])in\b/, 'for … in 의 in 은 제외'], ['not in', /(?<![\w.])not\s+in\b/],
  ['not', /(?<![\w.])not\b(?!\s+in\b)/], ['and', KW('and')], ['or', KW('or')], ['is', /(?<![\w.])is\b(?!\s+not\b)/], ['is not', /(?<![\w.])is\s+not\b/],
  ['None', KW('None')], ['True/False', /(?<![\w.])(?:True|False)\b/], ['while True', /(?<![\w.])while\s+True\b/],
  ['break', KW('break')], ['continue', KW('continue')], ['pass', KW('pass')],
  ['global', KW('global')], ['nonlocal', KW('nonlocal')], ['yield', KW('yield')], ['assert', KW('assert')], ['del', KW('del')],
  ['import', /^\s*(?:import|from)\s+\w+/m], ['__name__', /__name__/], ['데코레이터 @', /^\s*@\w+/m], [':= (왈러스)', /:=/],
  // --- 내장 함수 (호출 꼴만) ---
  ...['print', 'input', 'int', 'float', 'str', 'len', 'range', 'list', 'dict', 'set', 'tuple', 'sorted', 'sum', 'min', 'max',
    'enumerate', 'zip', 'map', 'filter', 'abs', 'round', 'open', 'type', 'isinstance', 'reversed', 'any', 'all', 'chr', 'ord',
    'bool', 'divmod', 'pow', 'repr', 'id', 'hash', 'iter', 'next', 'eval', 'exec', 'super', 'format', 'bin', 'hex', 'oct', 'exit', 'help', 'dir', 'frozenset', 'bytes']
    .map(w => [w + '()', CALL(w)]),
  ['range(a, b)', /(?<![\w.])range\s*\([^()\n]*,/], ['range(a, b, step)', /(?<![\w.])range\s*\([^()\n]*,[^()\n]*,/],
  ['print(a, b) 여러 값', /(?<![\w.])print\s*\((?:[^()\n]|\([^()\n]*\))*,/], ['end=', /\bend\s*=/], ['sep=', /\bsep\s*=/],
  ['key=', /\bkey\s*=/], ['reverse=', /\breverse\s*=/], ['encoding=', /\bencoding\s*=/],
  ['int(input())', /(?<![\w.])int\s*\(\s*input\s*\(/],
  // --- 메서드 ---
  ...['append', 'pop', 'insert', 'remove', 'extend', 'index', 'count', 'sort', 'reverse', 'clear', 'copy',
    'split', 'join', 'strip', 'lstrip', 'rstrip', 'lower', 'upper', 'title', 'capitalize', 'replace', 'find', 'rfind', 'startswith', 'endswith',
    'isdigit', 'isalpha', 'isalnum', 'isspace', 'isupper', 'islower', 'format', 'center', 'ljust', 'rjust', 'zfill', 'splitlines', 'encode', 'decode',
    'keys', 'values', 'items', 'get', 'update', 'setdefault', 'add', 'discard', 'union', 'intersection', 'difference', 'issubset',
    'read', 'write', 'readline', 'readlines', 'close', 'seek']
    .map(w => ['.' + w, METHOD(w)]),
  ['__init__', /__init__/], ['self.', /(?<![\w.])self\./], ['던더 메서드 __x__', /def\s+__(?!init__)\w+__/],
  // --- 모듈 (import X 와 X.함수 — 라벨은 detect 안에서 모듈 이름별로 만든다) ---
  // --- 문법 꼴 ---
  ['f-string', /(?<![\w])(?:[fF][rR]?|[rR][fF])["']/, '문자열 지우기 전 원문에서 잰다'], ['f-string 서식 {x:.2f}', /(?<![\w])[fF][rR]?(["'])(?:(?!\1).)*\{[^{}]*:[^{}]*\}/, '원문'],
  ['\\n 이스케이프', /\\n/, '원문'], ['\\t 이스케이프', /\\t/, '원문'], ['삼중따옴표', /"""|'''/, '원문'],
  ['인덱싱 x[i]', /[\w\])]\s*\[[^\[\]:\n]+\]/], ['음수 인덱스 [-1]', /\[\s*-\d+\s*\]/], ['2중 인덱스 x[i][j]', /\]\s*\[/],
  ['슬라이싱 [a:b]', /\[[^\[\]{}\n]*:[^\[\]{}\n]*\]/], ['슬라이싱 스텝 [a:b:c]', /\[[^\[\]{}\n]*:[^\[\]{}\n]*:[^\[\]{}\n]*\]/],
  ['리스트 리터럴 [ ]', /(?<![\w\])])\[[^\[\]\n]*\]/], ['리스트 컴프리헨션', /\[[^\[\]]*\bfor\b[^\[\]]*\bin\b[^\[\]]*\]/],
  ['제너레이터식 f(x for …)', /\w\(\s*[^()\n]*\bfor\b[^()\n]*\bin\b/],
  ['딕셔너리 리터럴 { : }', /\{[^{}\n]*:[^{}\n]*\}(?<!\bfor\b[^{}]*\})/], ['빈 딕셔너리 {}', /\{\s*\}/],
  ['딕셔너리 컴프리헨션', /\{[^{}]*:[^{}]*\bfor\b[^{}]*\bin\b[^{}]*\}/], ['집합 리터럴 { , }', /\{[^{}:\n]*[,]?[^{}:\n]*\}(?<!\{\s*\})(?<!\bfor\b[^{}]*\})/],
  ['집합 컴프리헨션', /\{[^{}:]*\bfor\b[^{}:]*\bin\b[^{}:]*\}/],
  ['튜플 리터럴 (a, b)', /(?<![\w\])\s])\(\s*[^()\n]*,[^()\n]*\)/], ['return 여러 값', /(?<![\w.])return\s+[^\n,()\[]+,/],
  ['나눠 담기 a, b =', /^\s*[A-Za-z_]\w*\s*,\s*[A-Za-z_][\w, ]*=(?!=)/m], ['for a, b in', /(?<![\w.])for\s+\w+\s*,\s*[\w, ]+\s+in\b/],
  ['다중 할당 a = b = 0', /^\s*\w+\s*=\s*\w+\s*=\s*[^=\n]/m], ['별표 풀기 a, *rest =', /^\s*[\w, ]*\*\w+[\w, ]*=(?!=)/m],
  ['** (거듭제곱)', /[\w)\]]\s*\*\*/], ['// (몫)', /(?<!:)\/\//], ['% (나머지)', /[\w)\]]\s*%\s*[\w(]/], ['% 포맷', /["']\s*%\s*[\w(]/],
  ['+=', /\+=/], ['-= *= /= 등', /[-*\/%]=(?!=)/], ['== !=', /[=!]=(?!=)/], ['< > <= >=', /[\w)\]]\s*(?:<=?|>=?)\s*[\w(\-]/],
  ['삼항 x if c else y', /[\w)\]'"]\s+if\s+[^:\n]+?\s+else\s+[^:\n]/], ['*args / *풀기', /[(,]\s*\*[A-Za-z_]/], ['**kwargs', /[(,]\s*\*\*[A-Za-z_]/],
  ['기본값 인자 def f(a=1)', /(?<![\w.])def\s+\w+\s*\([^()\n]*=\s*/], ['문자열 이어붙이기 +', /""\s*\+|\+\s*""/, '문자열을 지운 자리("")가 +와 붙으면'],
  ['문자열 반복 *', /""\s*\*\s*\d|\d\s*\*\s*""/], ['문자열 비교/정렬', /""\s*[<>]/],
  ['세미콜론 ;', /;\s*\w/],
];
const MODULES = ['random', 'math', 'datetime', 're', 'collections', 'json', 'os', 'sys', 'time', 'itertools', 'functools', 'string', 'csv', 'statistics', 'turtle', 'copy', 'operator', 'heapq', 'bisect', 'fractions', 'decimal', 'typing', 'dataclasses', 'enum', 'pathlib', 'urllib', 'sqlite3', 'pickle', 'shutil', 'glob'];
const RAW_FEATURES = new Set(['f-string', 'f-string 서식 {x:.2f}', '\\n 이스케이프', '\\t 이스케이프', '삼중따옴표']);

// --- 간단한 토크나이저: 문자열 안은 ""(빈 따옴표)로, # 뒤는 지운다 ---
export function stripStrings(src) {
  let out = '', i = 0; const n = src.length;
  while (i < n) {
    const c = src[i];
    if (c === '#') { while (i < n && src[i] !== '\n') i++; continue; }
    if (c === '"' || c === "'") {
      const tri = src.slice(i, i + 3); const q = (tri === '"""' || tri === "'''") ? tri : c;
      i += q.length; out += q === c ? c + c : '""';
      while (i < n && src.slice(i, i + q.length) !== q) { if (src[i] === '\\') i++; if (q.length === 1 && src[i] === '\n') break; i++; }
      i += q.length; continue;
    }
    out += c; i++;
  }
  return out;
}
// --- 들여쓰기 구조: 2중 for·중첩 함수·재귀 ---
export function scanStructure(code) {
  const found = new Map(); const stack = []; const lines = code.split('\n'); const fns = [];
  const put = (k, ln, text) => { if (!found.has(k)) found.set(k, { line: ln, text: text.trim() }); };
  lines.forEach((raw, idx) => {
    if (!raw.trim()) return; const indent = raw.match(/^\s*/)[0].length; const line = raw.trim();
    while (stack.length && stack[stack.length - 1].indent >= indent) stack.pop();
    const m = line.match(/^(for|while|def|class|if|elif|else|try|except|finally|with)\b/);
    for (const f of fns) if (indent > f.indent) { if (new RegExp(`(?<![\\w.])${f.name}\\s*\\(`).test(line) && !/^def\b/.test(line)) put('재귀', idx + 1, raw); } else if (f.open) f.open = false;
    if (!m) return;
    const kind = m[1]; const encl = [...stack].reverse().find(s => s.kind !== 'if' && s.kind !== 'elif' && s.kind !== 'else' && s.kind !== 'try' && s.kind !== 'except' && s.kind !== 'finally' && s.kind !== 'with');
    if ((kind === 'for' || kind === 'while') && encl && (encl.kind === 'for' || encl.kind === 'while')) put('2중 for/while', idx + 1, raw);
    if (kind === 'def' && encl && encl.kind === 'def') put('중첩 함수', idx + 1, raw);
    if (kind === 'def') { const nm = line.match(/^def\s+(\w+)/); if (nm) fns.push({ name: nm[1], indent, open: true }); }
    stack.push({ kind, indent });
  });
  return found;
}
// --- 기능 감지: Map<라벨, {line, text}> ---
export function detect(src, { structure = true } = {}) {
  const found = new Map(); if (!src) return found;
  const code = stripStrings(src); const lineOf = (s, i) => s.slice(0, i).split('\n').length; const lineText = (s, i) => s.split('\n')[lineOf(s, i) - 1].trim();
  const put = (k, s, i) => { if (!found.has(k)) found.set(k, { line: lineOf(s, i), text: lineText(s, i) }); };
  for (const [label, re] of CATALOG) { const s = RAW_FEATURES.has(label) ? src : code; const m = s.match(re); if (m) put(label, s, m.index); }
  for (const m of code.matchAll(/^\s*(?:import\s+(\w+)|from\s+(\w+))/gm)) put(`import ${m[1] || m[2]}`, code, m.index);
  for (const m of code.matchAll(new RegExp(`(?<![\\w.])(${MODULES.join('|')})\\.(\\w+)`, 'g'))) put(`${m[1]}.${m[2]}`, code, m.index);
  if (structure) for (const [k, v] of scanStructure(code)) if (!found.has(k)) found.set(k, v);
  return found;
}
// --- 본문 HTML → 글자 (접힌 더 알아보기 제외, 태그 제거, [[용어]] 풀기, <code>/<pre> 는 줄 단위로) ---
export function htmlToText(html) {
  return String(html || '').replace(/<details[\s\S]*?<\/details>/g, '\n')
    .replace(/\[\[레슨:[^\]]+\]\]/g, '레슨').replace(/\[\[([^\]]+)\]\]/g, '$1')
    .replace(/<\/?(?:br|p|pre|li|div|h\d|code|tr|td|th|blockquote)\b[^>]*>/gi, '\n').replace(/<[^>]+>/g, '')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');
}
const solutionOf = (p) => p.type === 'bug' ? (p.bug && p.bug.solution) : p.type === 'parsons' ? (p.parsons && p.parsons.solution)
  : p.type === 'fill' ? String(p.fill && p.fill.code || '').replace(/___(\d+)___/g, (m, i) => ((p.fill.blanks[i - 1] || {}).a || [''])[0]) : (p.solution || '');
const lineCount = (s) => String(s || '').split('\n').filter(l => l.trim()).length;
const median = (a) => { if (!a.length) return 0; const s = [...a].sort((x, y) => x - y); const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };

// =====================================================================
// 측정
// =====================================================================
export function analyzeCourse(c) {
  const taught = new Map();            // 기능 → 처음 가르친 곳 {lesson, where} (본문 누적)
  const rows = [];
  for (const l of c.LESSONS) {
    const lessonNew = new Map();       // 이 레슨 본문에서 처음 나온 기능
    const teach = (src, where, structure) => { for (const [k, v] of detect(src, { structure })) if (!taught.has(k)) { taught.set(k, { lesson: l.id, where, text: v.text }); lessonNew.set(k, { where, text: v.text }); } };
    (l.pages || []).forEach((pg, i) => { teach(htmlToText(pg.html), `${l.id} p${i + 1} 본문`, true); if (pg.example && pg.example.code) teach(pg.example.code, `${l.id} p${i + 1} 예제`, true); });
    const probs = c.PROBLEMS.filter(p => p.lesson === l.id).map(instantiate);
    const lessonRows = [];
    probs.forEach((p, pi) => {
      const sol = solutionOf(p); const h3 = (p.hints || [])[2] || '';
      const own = new Map([...detect(htmlToText(p.prompt)), ...detect(p.starter || '')]);
      const used = new Map(); for (const [k, v] of detect(sol)) used.set(k, { ...v, src: '정답' }); for (const [k, v] of detect(h3)) if (!used.has(k)) used.set(k, { ...v, src: '힌트3' });
      const outside = [], combo = [], where = {};
      for (const [k, v] of used) { const t = taught.get(k); if (!t) outside.push({ feature: k, inPrompt: own.has(k), src: v.src, line: v.line, text: v.text }); else { where[k] = t; if (t.lesson === l.id && lessonNew.has(k)) combo.push(k); } }
      const row = { lesson: l.id, lessonTitle: l.title, boss: !!l.boss, id: p.id, type: p.type, title: p.title, order: pi, lines: lineCount(sol), features: used.size, outside, combo, first: null, usedList: [...used.keys()], where };
      lessonRows.push(row); rows.push(row);
      // 이 문제의 지문·starter 를 뒤 문제의 「본문」에 더한다 (처음 가르친 곳으로 기록)
      teach(htmlToText(p.prompt), `${p.id} 지문`, false); teach(p.starter || '', `${p.id} starter`, true);
    });
    if (!l.boss && lessonRows.length >= 2) { const w = (r) => r.lines + r.features; const rest = median(lessonRows.slice(1).map(w)); if (w(lessonRows[0]) > rest) lessonRows[0].first = { weight: w(lessonRows[0]), median: rest }; }
  }
  const flagged = (r) => r.outside.length > 0 || r.combo.length >= 3 || !!r.first;
  const summary = { problems: rows.length, outside: rows.filter(r => r.outside.length).length, combo: rows.filter(r => r.combo.length >= 3).length, first: rows.filter(r => r.first).length, flagged: rows.filter(flagged).length };
  return { rows, summary, flagged };
}

// =====================================================================
// 출력
// =====================================================================
const args = process.argv.slice(2); const opt = (k) => { const i = args.indexOf(k); return i >= 0 ? (args[i + 1] || true) : null; };
const ALL = args.includes('--all'), JSON_OUT = args.includes('--json'), GATE = args.includes('--gate'), UPDATE = args.includes('--update-baseline');
const ONLY_COURSE = opt('--course'), ONLY_LESSON = opt('--lesson');
const BASE_PATH = path.join(ROOT, 'tools', 'check_level.baseline.json');
const esc = (s) => String(s).replace(/\|/g, '\\|').replace(/\n/g, ' ');
const fmtOutside = (o) => o.map(x => `\`${x.feature}\`${x.inPrompt ? '(지문○)' : ''}${x.src === '힌트3' ? '(힌트3)' : ''}`).join(', ');

const out = {}; const lines = []; const say = (s = '') => lines.push(s);
for (const id of courses()) {
  if (ONLY_COURSE && id !== ONLY_COURSE) continue;
  const c = loadCourse(id);
  const target = c.meta.runner === 'python' && c.meta.map !== 'graph';
  if (!target) { out[id] = { target: false }; if (!JSON_OUT && !ONLY_LESSON) say(`## ${id} — 대상 아님 (${c.meta.map === 'graph' ? '지식 지도 코스' : 'runner ' + c.meta.runner})\n`); continue; }
  const { rows, summary, flagged } = analyzeCourse(c); out[id] = { target: true, summary, rows };
  if (JSON_OUT) continue;
  if (ONLY_LESSON) {
    const lr = rows.filter(r => r.lesson === ONLY_LESSON); if (!lr.length) continue;
    say(`## ${id} / ${ONLY_LESSON} ${lr[0].lessonTitle} — 자동 측정, 오탐 가능\n`);
    for (const r of lr) {
      const flags = [r.outside.length ? `① 본문 밖 ${r.outside.length}` : '', r.combo.length >= 3 ? `② 새 기능 ${r.combo.length}` : '', r.first ? `③ 첫 문제 무게 ${r.first.weight} > 중앙값 ${r.first.median}` : ''].filter(Boolean).join(' · ');
      say(`### ${r.id} ${r.title} (${r.type}) — 정답 ${r.lines}줄 · 기능 ${r.features}개${flags ? ' · **' + flags + '**' : ''}`);
      for (const x of r.outside) say(`- ✗ \`${x.feature}\` — 본문에 없음${x.inPrompt ? ' (이 문제 지문·starter 에는 있음)' : ''} · ${x.src} ${x.line}줄: \`${esc(x.text)}\``);
      for (const k of r.combo) say(`- ★ \`${k}\` — 이 레슨에서 처음 (${r.where[k].where})`);
      const rest = r.usedList.filter(k => r.where[k] && !r.combo.includes(k)); if (rest.length) say(`- 앞에서 배움: ${rest.map(k => `\`${k}\`(${r.where[k].lesson})`).join(', ')}`);
      say();
    }
    continue;
  }
  const shown = ALL ? rows : rows.filter(flagged);
  say(`## ${id} (${c.meta.name}) — 자동 측정, 오탐 가능 · ${ALL ? '전체' : '걸린 문제만'} ${shown.length}/${rows.length}\n`);
  say('| 레슨 | 문제 id | 제목 | 정답 줄 | 기능 수 | ① 본문 밖 기능 | ② 새 기능 수 | ③ 첫 문제 경고 |');
  say('|---|---|---|---:|---:|---|---:|---|');
  for (const r of shown) say(`| ${r.lesson} | ${r.id} | ${esc(r.title)} | ${r.lines} | ${r.features} | ${fmtOutside(r.outside)} | ${r.combo.length >= 3 ? '**' + r.combo.length + '**' : r.combo.length} | ${r.first ? `무게 ${r.first.weight} > 중앙값 ${r.first.median}` : ''} |`);
  say();
}
if (!JSON_OUT && !ONLY_LESSON) {
  say('## 요약 (문제 수 · ① 본문 밖 · ② 새 기능 3+ · ③ 첫 문제 무거움)\n');
  for (const [id, o] of Object.entries(out)) if (o.target) say(`- ${id}: 문제 ${o.summary.problems} · ① ${o.summary.outside} · ② ${o.summary.combo} · ③ ${o.summary.first} (걸린 문제 ${o.summary.flagged})`);
  say('\n표기: `(지문○)` = 본문엔 없지만 그 문제의 지문·starter 에는 적혀 있음, `(힌트3)` = 정답이 아니라 힌트 3에서 쓰임. 근거는 `--lesson L11` 로.');
}
if (JSON_OUT) console.log(JSON.stringify(out, null, 1)); else console.log(lines.join('\n'));

// --- 래칫 게이트 ---
const current = Object.fromEntries(Object.entries(out).filter(([, o]) => o.target).map(([id, o]) => [id, { outside: o.summary.outside, combo: o.summary.combo, first: o.summary.first }]));
if (UPDATE) { fs.writeFileSync(BASE_PATH, JSON.stringify({ note: 'check_level.mjs 래칫 기준. 걸린 수가 이보다 늘면 --gate 가 exit 1. 줄였으면 --update-baseline 으로 갱신.', updated: new Date().toISOString().slice(0, 10), courses: current }, null, 2) + '\n'); console.log(`baseline 저장 → tools/check_level.baseline.json ${JSON.stringify(current)}`); }
if (GATE) {
  if (!fs.existsSync(BASE_PATH)) { console.error('✗ baseline 없음 — node tools/check_level.mjs --update-baseline'); process.exit(1); }
  const base = JSON.parse(fs.readFileSync(BASE_PATH, 'utf8')).courses || {}; const bad = [];
  for (const [id, cur] of Object.entries(current)) { const b = base[id]; if (!b) { console.log(`⚠ ${id}: baseline 에 없음 — --update-baseline 으로 넣어 주세요`); continue; }
    for (const k of ['outside', 'combo', 'first']) if (cur[k] > b[k]) bad.push(`${id} ${({ outside: '① 본문 밖', combo: '② 새 기능 3+', first: '③ 첫 문제 무거움' })[k]} ${b[k]} → ${cur[k]}`); }
  if (bad.length) { console.error(`✗ check_level 게이트: 걸린 문제가 늘었어요 — ${bad.join(' · ')}. 고치거나(--lesson 으로 근거 확인) 의도한 것이면 --update-baseline`); process.exit(1); }
  console.log(`✓ check_level 게이트 OK ${JSON.stringify(current)} (baseline ${JSON.stringify(base)})`);
}
