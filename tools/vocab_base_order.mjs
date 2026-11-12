#!/usr/bin/env node
// tools/vocab_base_order.mjs — 영어 단어장 「기초 일반 단어」 덱의 배우는 차례표를 만들어요: vocab/sources/base-order.tsv
//   차례: ① 말에 자주 나오는 단어(NGSL-Spoken 1.2)를 그 목록의 순위대로 → ② 나머지 일반 단어(NGSL 1.2)를 순위대로
//   쓰기:  node tools/vocab_base_order.mjs          차례표를 다시 만들어 써요(원문 목록을 바꿨을 때만)
//          node tools/vocab_base_order.mjs --check  지금 차례표가 원문과 맞는지만 봐요(tools/check_vocab.mjs 가 불러요)
//   차례표의 칸(탭으로 구분): no 차례 · id 노트 id · word 단어 · ngsl NGSL 순위 · spoken NGSL-S 순위 · forms 다른 모양(쉼표)
//   덱을 채울 때 노트의 rank 에는 no 를, id · w 에는 이 표의 id · word 를 그대로 써요(check_vocab 이 대조). 설명: specs/vocab.md 6절 W1
import fs from 'node:fs'; import path from 'node:path';
import { ROOT } from './load_content.mjs';
const SRC = path.join(ROOT, 'vocab/sources'); const OUT = path.join(SRC, 'base-order.tsv');
const lines = (f) => fs.readFileSync(path.join(SRC, f), 'utf8').split(/\r?\n/).map(l => l.trim()).filter(l => l && !l.startsWith('#'));
// 원문에는 표 계산 프로그램이 대문자로 바꿔 놓은 TRUE · FALSE 가 있어요 → 단어 true · false 로. I(나)는 그대로 대문자
const word = (w) => (w === 'TRUE' || w === 'FALSE' ? w.toLowerCase() : w);
const key = (w) => word(w).toLowerCase();
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
  const nRank = new Map(ngsl.map(x => [key(x.w), x.rank])); const rows = []; const seen = new Set(); const ids = new Set();
  const push = (w, ng, sp) => {
    const k = key(w); if (seen.has(k)) return; seen.add(k);
    let id = k.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'x'; while (ids.has(id)) id += '-2'; ids.add(id);
    const fs_ = [...new Set([...(F1.get(k) || []), ...(F2.get(k) || [])])];
    rows.push({ no: rows.length + 1, id, word: w, ngsl: ng || '', spoken: sp || '', forms: fs_.join(',') });
  };
  for (const s of spoken) push(s.w, nRank.get(key(s.w)), s.rank);
  for (const n of ngsl) push(n.w, n.rank, '');
  const both = spoken.filter(s => nRank.has(key(s.w))).length;
  const text = ['no\tid\tword\tngsl\tspoken\tforms', ...rows.map(r => [r.no, r.id, r.word, r.ngsl, r.spoken, r.forms].join('\t'))].join('\n') + '\n';
  return { rows, text, stats: { ngsl: ngsl.length, spoken: spoken.length, both, spokenOnly: spoken.length - both, total: rows.length } };
}
export function readOrder() { // 차례표 읽기: no → { id, word }
  const m = new Map(); for (const l of fs.readFileSync(OUT, 'utf8').split('\n').slice(1)) { if (!l) continue; const c = l.split('\t'); m.set(+c[0], { id: c[1], word: c[2], forms: c[5] ? c[5].split(',') : [] }); } return m;
}
if (process.argv[1] && path.resolve(process.argv[1]) === path.join(ROOT, 'tools/vocab_base_order.mjs')) {
  const b = build(); const s = b.stats;
  console.log(`NGSL ${s.ngsl}개 · NGSL-S ${s.spoken}개 · 둘 다에 있는 단어 ${s.both}개 · NGSL-S 에만 있는 단어 ${s.spokenOnly}개 · 차례표 ${s.total}개`);
  if (process.argv.includes('--check')) {
    const cur = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : '';
    if (cur !== b.text) { console.error('✗ vocab/sources/base-order.tsv 가 원문 목록과 달라요 — node tools/vocab_base_order.mjs 로 다시 만들어요'); process.exit(1); }
    console.log('✓ 차례표가 원문 목록과 같아요');
  } else { fs.writeFileSync(OUT, b.text); console.log('vocab/sources/base-order.tsv 를 썼어요'); }
}
