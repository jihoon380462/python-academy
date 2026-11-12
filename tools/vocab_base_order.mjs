#!/usr/bin/env node
// tools/vocab_base_order.mjs — 영어 단어장 「기초 일반 단어」 덱의 배우는 차례표와 덱 파일 틀을 만들어요. 설명: specs/vocab.md 6절 W1
//   차례: ① 말에 자주 나오는 단어(NGSL-Spoken 1.2)를 그 목록의 순위대로 → ② 나머지 일반 단어(NGSL 1.2)를 순위대로
//   쓰기:  node tools/vocab_base_order.mjs            차례표 vocab/sources/base-order.tsv 를 다시 만들어 써요(원문 목록이나 이 도구를 바꿨을 때만)
//          node tools/vocab_base_order.mjs --check    지금 차례표가 원문과 맞는지만 봐요(tools/check_vocab.mjs 가 불러요)
//          node tools/vocab_base_order.mjs --status   덱 파일마다 얼마나 채웠는지 보여 줘요(다음에 할 파일을 알려 줘요)
//          node tools/vocab_base_order.mjs --file 1   차례 1 ~ 200 의 덱 파일 vocab/decks/base-0001.js 를 써요:
//                                                     이미 쓴 노트는 그대로 두고, 안 쓴 차례는 「ko: [], ex: []」 빈 틀로 넣어요. 빈 틀을 다 채워야 check_vocab 이 통과해요
//   차례표의 칸(탭으로 구분): no 차례 · id 노트 id · word 단어 · ngsl NGSL 순위 · spoken NGSL-S 순위 · forms 다른 모양(쉼표)
//   노트의 rank 에는 no 를, id · w 에는 이 표의 id · word 를 그대로 써요(check_vocab 이 대조). --file 이 만든 틀에는 이미 그렇게 들어 있어요
import fs from 'node:fs'; import path from 'node:path'; import vm from 'node:vm';
import { ROOT } from './load_content.mjs';
const SRC = path.join(ROOT, 'vocab/sources'); const OUT = path.join(SRC, 'base-order.tsv'); const DECKS = path.join(ROOT, 'vocab/decks');
export const FILE_SIZE = 200;   // 덱 파일 하나에 넣는 차례 수: base-0001.js = 1 ~ 200, base-0201.js = 201 ~ 400 …
export const fileOf = (no) => `base-${String(Math.floor((no - 1) / FILE_SIZE) * FILE_SIZE + 1).padStart(4, '0')}.js`;
const lines = (f) => fs.readFileSync(path.join(SRC, f), 'utf8').split(/\r?\n/).map(l => l.trim()).filter(l => l && !l.startsWith('#'));
// 원문에는 표 계산 프로그램이 대문자로 바꿔 놓은 TRUE · FALSE 가 있어요 → 단어 true · false 로. I(나)는 그대로 대문자
const word = (w) => (w === 'TRUE' || w === 'FALSE' ? w.toLowerCase() : w);
const key = (w) => word(w).toLowerCase();
// 말 목록(NGSL-Spoken)에서 순위가 부풀려진 낱말: 말뭉치의 녹취 표시 「(pause)」 「(unclear)」 「(laughs)」 「(laughter)」 「(cough)」 가 단어로 세어진 것이에요
//   (원문 말 순위: pause 24 · unclear 26 · laugh 80 · laughter 131 · cough 438). 말 순위를 쓰지 않고 NGSL 순위 자리에 둬요. 차례표의 spoken 칸은 비워요.
export const ARTIFACTS = ['pause', 'unclear', 'laugh', 'laughter', 'cough'];
// 순위표: 첫 줄은 머리글, 「단어,순위,…」. 순위는 1 부터 빠짐없이 하나씩이어야 해요.
//   원문 NGSL-Spoken 순위표에는 순위 칸이 「#N/A」 인 줄이 하나 있어요(TRUE — 표 계산 프로그램이 망가뜨린 줄). 순위가 숫자가 아닌 줄 수와
//   빠진 번호 수가 같을 때만, 파일에 적힌 순서대로 빠진 번호를 채워요. 그 밖의 어긋남은 고치지 않고 멈춰요(원문이 바뀌었으면 사람이 봐야 해요)
const ranks = (f) => {
  const rows = lines(f).slice(1).map(l => l.split(',')).map(c => ({ w: word(c[0]), rank: /^\d+$/.test(c[1] || '') ? +c[1] : null }));
  const have = new Set(rows.filter(r => r.rank != null).map(r => r.rank)); const missing = []; for (let i = 1; i <= rows.length; i++) if (!have.has(i)) missing.push(i);
  const blank = rows.filter(r => r.rank == null);
  if (have.size + blank.length !== rows.length || blank.length !== missing.length) throw new Error(`${f}: 순위가 1~${rows.length} 로 빠짐없이 맞지 않아요(숫자 아닌 줄 ${blank.length} · 빠진 번호 ${missing.length} · 겹친 번호 ${rows.length - blank.length - have.size})`);
  blank.forEach((r, i) => { r.rank = missing[i]; });
  return rows.sort((a, b) => a.rank - b.rank);
};
// 모양표: 「표제어,모양,모양…」. 같은 표제어가 두 번 나오면(found · left 같은 것) 모양을 합쳐요
const forms = (f) => { const m = new Map(); for (const l of lines(f)) { const [h, ...rest] = l.split(',').map(x => x.trim()).filter(Boolean); if (!h) continue; const k = key(h); const set = m.get(k) || new Set(); rest.forEach(x => { if (key(x) !== k) set.add(x); }); m.set(k, set); } return m; };

export function build() {
  const ngsl = ranks('NGSL_1.2_stats.csv'); const spoken = ranks('NGSL-Spoken_1.2_stats.csv');
  const F1 = forms('NGSL_1.2_lemmatized_for_teaching.csv'); const F2 = forms('NGSL-Spoken_1.2_lemmatized_for_teaching.csv');
  const nRank = new Map(ngsl.map(x => [key(x.w), x.rank])); const sKeys = new Set(spoken.map(s => key(s.w))); const rows = []; const seen = new Set(); const ids = new Set();
  for (const a of ARTIFACTS) if (!nRank.has(a) || !sKeys.has(a)) throw new Error(`녹취 표시 낱말 「${a}」 가 두 목록에 다 있지 않아요 — 원문이 바뀌었으면 ARTIFACTS 를 다시 봐요`);
  const push = (w, ng, sp) => {
    const k = key(w); if (seen.has(k)) return; seen.add(k);
    let id = k.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'x'; while (ids.has(id)) id += '-2'; ids.add(id);
    const fs_ = [...new Set([...(F1.get(k) || []), ...(F2.get(k) || [])])];
    rows.push({ no: rows.length + 1, id, word: w, ngsl: ng || '', spoken: sp || '', forms: fs_.join(',') });
  };
  for (const s of spoken) if (!ARTIFACTS.includes(key(s.w))) push(s.w, nRank.get(key(s.w)), s.rank);
  for (const n of ngsl) push(n.w, n.rank, '');
  const both = spoken.filter(s => nRank.has(key(s.w))).length;
  const text = ['no\tid\tword\tngsl\tspoken\tforms', ...rows.map(r => [r.no, r.id, r.word, r.ngsl, r.spoken, r.forms].join('\t'))].join('\n') + '\n';
  return { rows, text, stats: { ngsl: ngsl.length, spoken: spoken.length, both, spokenOnly: spoken.length - both, spokenFirst: spoken.length - ARTIFACTS.length, total: rows.length } };
}

// ---------- 덱 파일 틀 (--status · --file) ----------
export const isBlank = (n) => !(n.ko && n.ko.length) && !(n.ex && n.ex.length);   // 빈 틀: 뜻도 예문도 아직 없는 노트
// 지금 덱에 든 기초 노트를 파일마다 읽어요(화면이 읽는 것과 같은 방식). 파일이 깨져 있으면 여기서 멈춰요 — 틀을 덮어쓰기 전에
export function loadBase() {
  const ctx = { console }; vm.createContext(ctx); const read = (f) => fs.readFileSync(f, 'utf8');
  vm.runInContext(read(path.join(ROOT, 'vocab/core.js')) + '\n' + read(path.join(DECKS, 'index.js')) + '\n;this.__D = VocabDecks;', ctx, { filename: 'vocab-decks.js' });
  const files = fs.readdirSync(DECKS).filter(f => /^base.*\.js$/.test(f)).sort(); const byFile = {};
  for (const f of files) { const before = ctx.__D.byId.base.notes.length; vm.runInContext(read(path.join(DECKS, f)), ctx, { filename: f }); byFile[f] = ctx.__D.byId.base.notes.slice(before); }
  return { notes: ctx.__D.byId.base.notes, byFile };
}
// 노트 한 줄을 덱 파일의 모양대로. 작은따옴표가 든 글자는 큰따옴표로 감싸요(줄바꿈 같은 보이지 않는 글자가 들었을 때도)
const q = (s) => ((s.includes("'") && !s.includes('"')) || /[\u0000-\u001f\u2028\u2029]/.test(s) ? JSON.stringify(s) : "'" + s.replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'");
const pairs = (a) => '[' + a.map(p => '[' + p.map(q).join(', ') + ']').join(', ') + ']';
const KEYS = ['id', 'w', 'rank', 'ko', 'ex', 'forms', 'note', 'say', 'pron', 'tpl'];
export function fmt(n) {
  for (const k of Object.keys(n)) if (!KEYS.includes(k)) throw new Error(`노트 ${n.id}: 이 도구가 모르는 칸 「${k}」 — 칸을 새로 만들었으면 KEYS 와 fmt 를 같이 고쳐요`);
  const parts = [`id: ${q(n.id)}`, `w: ${q(n.w)}`, `rank: ${n.rank}`, `ko: ${pairs(n.ko)}`, `ex: ${pairs(n.ex)}`];
  if (n.forms) parts.push(`forms: [${n.forms.map(q).join(', ')}]`);
  for (const k of ['note', 'say', 'pron']) if (n[k] !== undefined) parts.push(`${k}: ${q(n[k])}`);
  if (n.tpl) parts.push(`tpl: [${n.tpl.map(q).join(', ')}]`);
  return `  { ${parts.join(', ')} },`;
}
export function fileText(start, rows, have, withBlanks = true) {   // have: 차례 → 이미 쓴 노트. withBlanks 가 false 면 이미 쓴 노트만(빈 틀 없이)
  const end = Math.min(start + FILE_SIZE - 1, rows.length); const body = [];
  for (const r of rows.slice(start - 1, end)) {
    const n = have.get(r.no); if (!n && !withBlanks) continue;
    body.push(n ? fmt(n) : `  { id: ${q(r.id)}, w: ${q(r.word)}, rank: ${r.no}, ko: [], ex: [] },${r.forms ? ` // 다른 모양: ${r.forms}` : ''}`);
  }
  return [`// vocab/decks/${fileOf(start)} — 「기초 일반 단어」 덱의 노트, 차례 ${start} ~ ${end}. 노트 모양과 품질 기준: specs/vocab.md 3절`,
    '// 단어와 차례의 출처: New General Service List 1.2 · NGSL-Spoken 1.2 (Browne, Culligan & Phillips) — CC BY-SA 4.0 (vocab/sources/README.md).',
    '//   뜻 · 예문 · 쓰임은 이 사이트가 직접 쓴 것이고, 목록을 바탕으로 만든 이 덱도 같은 CC BY-SA 4.0 조건을 따라요.',
    '// 이 파일의 틀은 `node tools/vocab_base_order.mjs --file ' + start + '` 가 만들어요. id · w · rank 는 차례표 그대로라 고치지 않아요. 채울 칸은 ko · ex(· forms · note).',
    "VocabDecks.notes('base', [", ...body, ']);', ''].join('\n');
}
// 파일마다 얼마나 채웠는지. 빈 틀은 채운 것으로 세지 않아요
//   돌려주는 값: { files: [{ f, start, end, done, total, exists }], done, total, next: 다 못 채운 첫 파일의 첫 차례(없으면 null) }
export function status(rows, notes, exists = (f) => fs.existsSync(path.join(DECKS, f))) {
  const have = new Set(notes.filter(n => !isBlank(n)).map(n => n.rank)); const files = []; let next = null;
  for (let st = 1; st <= rows.length; st += FILE_SIZE) {
    const end = Math.min(st + FILE_SIZE - 1, rows.length); let done = 0; for (let i = st; i <= end; i++) if (have.has(i)) done++;
    if (done < end - st + 1 && next == null) next = st;
    files.push({ f: fileOf(st), start: st, end, done, total: end - st + 1, exists: exists(fileOf(st)) });
  }
  return { files, done: files.reduce((a, x) => a + x.done, 0), total: rows.length, next };
}
// 덱 파일 하나를 다시 쓸 글자를 만들어요(쓰지는 않아요). 이미 쓴 노트는 그대로, 안 쓴 차례는 빈 틀로. 여러 번 돌려도 결과가 같아요
//   deck: loadBase() 가 준 것. 문제가 있으면 Error 를 던져요. 돌려주는 값: { f 파일 이름, end, text, kept 그대로 둔 노트 수, blanks 빈 틀 수 }
export function planFile(start, rows, deck) {
  if (!Number.isInteger(start) || start < 1 || start > rows.length || (start - 1) % FILE_SIZE !== 0) throw new Error(`--file 뒤에는 파일의 첫 차례를 적어요: 1, ${FILE_SIZE + 1}, ${2 * FILE_SIZE + 1} … (--status 가 알려 줘요)`);
  const f = fileOf(start); const end = Math.min(start + FILE_SIZE - 1, rows.length); const inRange = (n) => n.rank >= start && n.rank <= end; const names = (ns) => ns.map(n => n.id).slice(0, 5).join(', ');
  for (const [other, ns] of Object.entries(deck.byFile)) if (other !== f) { const stray = ns.filter(inRange); if (stray.length) throw new Error(`차례 ${start} ~ ${end} 의 노트가 다른 파일 ${other} 에도 있어요(${names(stray)}) — 그 파일에서 먼저 지우거나 옮겨요`); }
  const orig = (deck.byFile[f] || []).filter(n => !isBlank(n));
  const outside = orig.filter(n => !inRange(n)); if (outside.length) throw new Error(`${f}: 이 파일의 범위(차례 ${start} ~ ${end}) 밖의 노트가 있어요(${names(outside)}) — 먼저 맞는 파일로 옮겨요`);
  const have = new Map(orig.map(n => [n.rank, n])); if (have.size !== orig.length) throw new Error(`${f}: 차례(rank)가 같은 노트가 두 번 있어요 — 먼저 하나를 지워요`);
  const text = fileText(start, rows, have);
  // 쓰기 전에: 만든 글자를 다시 읽어, 이미 있던 노트가 한 글자도 안 바뀌었는지 확인해요(LESSON.md R8 — 합치는 도구가 내용을 잃지 않게). 칸 순서만 다른 것은 같다고 봐요
  const back = []; const cx = { VocabDecks: { notes: (id, arr) => back.push(...arr) } }; vm.createContext(cx); vm.runInContext(text, cx, { filename: f });
  const kept = back.filter(n => !isBlank(n)); const J = (n) => JSON.stringify(Object.keys(n).sort().map(k => [k, n[k]]));
  if (back.length !== end - start + 1 || kept.length !== orig.length || kept.some(n => J(n) !== J(have.get(n.rank)))) throw new Error(`${f}: 이미 있던 노트 ${orig.length}개가 다시 읽었을 때 그대로가 아니에요(${kept.length}개) — 파일을 쓰지 않았어요`);
  return { f, end, text, kept: kept.length, blanks: back.length - kept.length };
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.join(ROOT, 'tools/vocab_base_order.mjs')) {
  const b = build(); const s = b.stats; const arg = (name) => { const i = process.argv.indexOf(name); return i < 0 ? null : process.argv[i + 1]; };
  console.log(`NGSL ${s.ngsl}개 · NGSL-S ${s.spoken}개 · 둘 다에 있는 단어 ${s.both}개 · NGSL-S 에만 있는 단어 ${s.spokenOnly}개 · 차례표 ${s.total}개(앞 ${s.spokenFirst}개가 말 목록 순서, 녹취 표시 ${ARTIFACTS.length}개는 NGSL 순위 자리)`);
  if (process.argv.includes('--check')) {
    const cur = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : '';
    if (cur !== b.text) { console.error('✗ vocab/sources/base-order.tsv 가 원문 목록과 달라요 — node tools/vocab_base_order.mjs 로 다시 만들어요'); process.exit(1); }
    console.log('✓ 차례표가 원문 목록과 같아요');
  } else if (process.argv.includes('--status')) {
    const st = status(b.rows, loadBase().notes);
    for (const x of st.files) console.log(`  ${x.f}  차례 ${String(x.start).padStart(4)} ~ ${String(x.end).padStart(4)}  ${String(x.done).padStart(3)}/${x.total}${x.done === x.total ? ' ✓' : x.exists ? ' (채우는 중)' : ''}`);
    console.log(`노트 ${st.done}/${st.total}` + (st.next ? ` · 다음에 할 파일: node tools/vocab_base_order.mjs --file ${st.next}` : ' · 다 채웠어요'));
  } else if (process.argv.includes('--file')) {
    let plan; try { plan = planFile(+arg('--file'), b.rows, loadBase()); } catch (e) { console.error('✗ ' + e.message); process.exit(1); }
    fs.writeFileSync(path.join(DECKS, plan.f), plan.text);
    console.log(`${plan.f} 를 썼어요: 차례 ${+arg('--file')} ~ ${plan.end}, 이미 쓴 노트 ${plan.kept}개는 그대로 · 채울 빈 틀 ${plan.blanks}개`);
    if (!fs.readFileSync(path.join(ROOT, 'vocab/index.html'), 'utf8').includes(`decks/${plan.f}`)) console.log(`  vocab/index.html 의 「덱 노트」 자리에 차례대로 넣어요: <script src="decks/${plan.f}?v=…"></script> (넣고 node tools/stamp.mjs)`);
  } else { fs.writeFileSync(OUT, b.text); console.log('vocab/sources/base-order.tsv 를 썼어요'); }
}
