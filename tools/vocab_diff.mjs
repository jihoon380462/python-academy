// 덱 파일 두 판(고치기 전 → 후)의 노트를 대조해 바뀐 노트만 찍어요. 검수를 반영한 파일을 합치기 전에, 지시한 노트만 바뀌었는지 읽는 데 써요(specs/vocab.md 7절).
//   node tools/vocab_diff.mjs <전 파일> <후 파일>
//   git show HEAD:vocab/decks/base-0401.js > /tmp/before.js && node tools/vocab_diff.mjs /tmp/before.js vocab/decks/base-0401.js
// 노트는 rank 가 있으면 rank 로, 없으면(속어 덱처럼) id 로 짝지어요. 열쇠가 겹치면 대조할 수 없으니 멈춰요 —
// 예전에는 rank 로만 짝지어서, rank 가 없는 노트를 한 열쇠에 겹쳐 「바뀐 노트 0개」 로 조용히 넘겼어요(LESSON.md R6).
import fs from 'node:fs'; import vm from 'node:vm';

function load(p) {
  const out = []; vm.runInNewContext(fs.readFileSync(p, 'utf8'), { VocabDecks: { notes: (id, arr) => out.push(...arr) } });
  if (!out.length) { console.error(`✗ ${p}: 노트를 하나도 못 읽었어요`); process.exit(1); }
  const m = new Map();
  for (const n of out) {
    const k = n.rank !== undefined ? n.rank : n.id;
    if (k === undefined || m.has(k)) { console.error(`✗ ${p}: 노트 열쇠 ${k} 가 ${k === undefined ? '없어요' : '겹쳐요'} — 대조할 수 없어요`); process.exit(1); }
    m.set(k, n);
  }
  return m;
}

const args = process.argv.slice(2);
if (args.length !== 2) { console.error('쓰는 법: node tools/vocab_diff.mjs <전 파일> <후 파일>'); process.exit(1); }
const [a, b] = args.map(load);
const show = (x) => `${x.ko.map(([p, k]) => `${p}:${k}`).join(' / ')} | ${x.ex.map(([e, k]) => `${e} ＝ ${k}`).join(' ‖ ')}${x.forms ? ' | forms ' + x.forms.join(',') : ''}${x.note ? ' | ' + x.note : ''}`;
let n = 0;
for (const [k, y] of b) {
  const x = a.get(k); if (x && JSON.stringify(x) === JSON.stringify(y)) continue; n++;
  console.log(`● ${k} ${y.w}`); if (x) console.log(`  전: ${show(x)}`); console.log(`  후: ${show(y)}`);
}
let gone = 0; for (const k of a.keys()) if (!b.has(k)) { gone++; console.log(`● ${k} 사라짐`); }
console.log(`바뀐 노트 ${n}개${gone ? ` · 사라진 노트 ${gone}개` : ''} (전 ${a.size}개 · 후 ${b.size}개)`);
