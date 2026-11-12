#!/usr/bin/env node
// tools/check_vocab.mjs — 영어 단어장 덱 데이터 검사(v2.46.0). 쓰기: node tools/check_vocab.mjs  (CI content 작업이 돌려요)
//   ① 덱 노트 파일(vocab/decks/*.js)이 전부 vocab/index.html 에 올바른 순서로 들어 있는지 — 빠지면 그 노트가 화면에 안 나와요
//   ② 덱 · 노트의 칸 모양(specs/vocab.md 3절): id · 품사 · 뜻 · 예문 · 순위. 한 줄이라도 틀리면 어느 덱 어느 노트인지 알려 줘요
//   ③ 허브 설정: 「필수교양」 이 맨 앞 묶음이고 단어장이 deck 으로 들어 있는지
//   ④ 지시서(specs/vocab.md)의 덱별 노트 수 표가 실제와 같은지(문서 숫자가 낡지 않게 — LESSON.md R15)
//   ⑤ 기초 덱: 차례표(vocab/sources/base-order.tsv)가 원문 목록과 맞는지, 노트의 rank · id · w 가 차례표와 같은지, 출처 표기가 있는지
//   파일을 못 읽거나 실행하다 에러가 나면 통과가 아니라 실패예요(LESSON.md R6). 코어의 계산은 tools/test_vocab.mjs 가 봐요.
import fs from 'node:fs'; import path from 'node:path'; import vm from 'node:vm';
import { ROOT } from './load_content.mjs';
import { build as buildBaseOrder } from './vocab_base_order.mjs';
const errors = []; const err = (m) => errors.push(m);
const read = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');
const HANGUL = /[가-힣]/;
try {
  // ① 파일과 불러오는 순서
  const files = fs.readdirSync(path.join(ROOT, 'vocab/decks')).filter(f => f.endsWith('.js')).sort();
  const html = read('vocab/index.html'); const srcs = [...html.matchAll(/<script src="([^"?]+)/g)].map(m => m[1]);
  const head = ['../core/config.js', '../core/util.js', '../core/storage.js', '../core/sync.js', '../core/ui-core.js', 'fsrs.js', 'core.js', 'decks/index.js'];
  if (JSON.stringify(srcs.slice(0, head.length)) !== JSON.stringify(head)) err(`vocab/index.html: 앞쪽 스크립트 순서가 달라요 — 기대 ${head.join(' → ')}`);
  if (srcs[srcs.length - 1] !== 'app.js') err('vocab/index.html: 마지막 스크립트는 app.js 여야 해요(덱 노트가 다 들어온 뒤 화면을 시작)');
  const deckSrcs = srcs.filter(s => s.startsWith('decks/'));
  for (const f of files) if (!deckSrcs.includes('decks/' + f)) err(`vocab/index.html 에 <script src="decks/${f}?v=…"> 가 없어요 — 이 파일의 노트가 화면에 안 나와요`);
  for (const s of deckSrcs) if (!files.includes(s.slice(6))) err(`vocab/index.html 이 없는 파일을 불러요: ${s}`);
  if (new Set(deckSrcs).size !== deckSrcs.length) err('vocab/index.html: 같은 덱 파일을 두 번 불러요');
  for (const f of ['vocab/LICENSE-fsrs.txt']) if (!fs.existsSync(path.join(ROOT, f))) err(`${f} 가 없어요 — 간격 계산기의 출처 라이선스 표기`);

  // 화면과 같은 순서로 실행해 덱을 읽어요
  const ctx = { console }; vm.createContext(ctx);
  vm.runInContext([read('vocab/core.js'), ...deckSrcs.filter(s => files.includes(s.slice(6))).map(s => read('vocab/' + s)), ';this.__D = VocabDecks;'].join('\n'), ctx, { filename: 'vocab-decks.js' });
  const D = ctx.__D; const POS = Object.keys(D.POS); const TPL = Object.keys(D.TPL);

  // ② 덱 · 노트
  const IDRE = /^[a-z0-9][a-z0-9-]*$/; const counts = {};
  const text = (where, v, max, what) => { if (typeof v !== 'string' || !v.trim()) { err(`${where}: ${what} 가 비었어요`); return false; } if (v !== v.trim()) err(`${where}: ${what} 앞뒤에 빈칸이 있어요`); if (v.length > max) err(`${where}: ${what} 가 너무 길어요(${v.length}자 > ${max}자)`); if (/<[a-zA-Z/]/.test(v)) err(`${where}: ${what} 에 HTML 태그를 쓰지 않아요(글자 그대로 보여요)`); if (/TODO|\?\?\?|…{2,}/.test(v)) err(`${where}: ${what} 에 덜 쓴 표시(TODO · ???)가 남았어요`); return true; };
  if (!D.list.length) err('덱이 하나도 없어요(vocab/decks/index.js)');
  for (const d of D.list) {
    const dw = `덱 ${d.id}`;
    if (!IDRE.test(d.id || '')) err(`${dw}: id 는 영어 소문자 · 숫자 · 하이픈`);
    text(dw, d.name, 20, 'name'); text(dw, d.desc, 80, 'desc');
    if (!Array.isArray(d.tpl) || !d.tpl.length || d.tpl.some(t => !TPL.includes(t)) || new Set(d.tpl).size !== d.tpl.length) err(`${dw}: tpl 은 ${TPL.join(' · ')} 중에서 겹치지 않게`);
    if (!Number.isInteger(d.newPerDay) || d.newPerDay < 1 || d.newPerDay > 100) err(`${dw}: newPerDay 는 1~100 의 정수`);
    if (d.sample && d.notes.length > 50 && d.id !== 'base') err(`${dw}: 노트가 ${d.notes.length}개인데 sample(표본) 표시가 남아 있어요 — 정식으로 채웠으면 vocab/decks/index.js 에서 sample 을 지워요`);
    counts[d.id] = d.notes.length;
    const ids = new Set(), words = new Set(); let lastRank = 0; const ranked = d.notes.filter(n => n.rank != null).length;
    if (ranked && ranked !== d.notes.length) err(`${dw}: rank 는 모든 노트에 있거나 모두 없어야 해요(${ranked}/${d.notes.length})`);
    for (const n of d.notes) {
      const w = `${d.id}/${n && n.id}`;
      if (!n || !IDRE.test(n.id || '')) { err(`${w}: 노트 id 는 영어 소문자 · 숫자 · 하이픈`); continue; }
      if (ids.has(n.id)) err(`${w}: 노트 id 가 겹쳐요`); ids.add(n.id);
      if (!text(w, n.w, 40, 'w(단어)')) continue;
      const lw = n.w.toLowerCase(); if (words.has(lw)) err(`${w}: 같은 단어 「${n.w}」 가 이 덱에 또 있어요 — 뜻이 여럿이면 한 노트의 ko 에 모아요`); words.add(lw);
      if (!Array.isArray(n.ko) || n.ko.length < 1 || n.ko.length > 3) err(`${w}: ko(뜻)는 [[품사, 뜻], …] 1~3개`);
      else for (const s of n.ko) { if (!Array.isArray(s) || s.length !== 2) { err(`${w}: ko 의 한 칸은 [품사, 뜻]`); continue; } if (!POS.includes(s[0])) err(`${w}: 모르는 품사 「${s[0]}」 — ${POS.join(' ')}`); if (text(w, s[1], 40, '뜻') && !HANGUL.test(s[1])) err(`${w}: 뜻에 한글이 없어요 「${s[1]}」`); if (/[.。]$/.test(s[1] || '')) err(`${w}: 뜻 끝에 마침표를 찍지 않아요`); }
      const forms = [n.w, ...(Array.isArray(n.forms) ? n.forms : [])];
      if (n.forms !== undefined && (!Array.isArray(n.forms) || n.forms.some(f => typeof f !== 'string' || !f.trim()))) err(`${w}: forms 는 글자 배열`);
      if (!Array.isArray(n.ex) || n.ex.length < 1 || n.ex.length > 2) err(`${w}: ex(예문)는 [[영어, 한국어], …] 1~2개`);
      else n.ex.forEach((e, i) => {
        if (!Array.isArray(e) || e.length !== 2) { err(`${w}: ex 의 한 칸은 [영어, 한국어]`); return; }
        if (text(w, e[0], 110, `예문 ${i + 1}`)) { if (HANGUL.test(e[0])) err(`${w}: 영어 예문에 한글이 섞였어요`); if (!/[.?!"')]$/.test(e[0])) err(`${w}: 영어 예문은 문장 부호로 끝내요 「${e[0]}」`); if (!/^["'(]?[A-Z0-9`_$]/.test(e[0])) err(`${w}: 영어 예문은 대문자(또는 숫자 · 코드)로 시작해요 「${e[0]}」`); }
        if (text(w, e[1], 80, `예문 ${i + 1} 의 한국어`) && !HANGUL.test(e[1])) err(`${w}: 예문의 한국어 칸에 한글이 없어요`);
        if (i === 0 && typeof e[0] === 'string') { const has = forms.some(f => /^[A-Za-z][A-Za-z' -]*$/.test(f) ? new RegExp('\\b' + f.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i').test(e[0]) : e[0].toLowerCase().includes(String(f).toLowerCase())); if (!has) err(`${w}: 첫 예문에 단어 「${n.w}」(또는 forms 의 모양)가 없어요 「${e[0]}」`); }
      });
      for (const k of ['note', 'say', 'pron']) if (n[k] !== undefined) text(w, n[k], k === 'note' ? 90 : 60, k);
      if (n.tpl !== undefined && (!Array.isArray(n.tpl) || !n.tpl.length || n.tpl.some(t => !TPL.includes(t)))) err(`${w}: tpl 은 ${TPL.join(' · ')} 중에서`);
      if (n.rank != null) { if (!Number.isInteger(n.rank) || n.rank <= lastRank) err(`${w}: rank(순위)는 앞 노트(${lastRank})보다 큰 정수여야 해요 — 순위 순서대로 넣어요`); lastRank = n.rank; }
      const known = ['id', 'w', 'ko', 'ex', 'forms', 'note', 'say', 'pron', 'tpl', 'rank']; for (const k of Object.keys(n)) if (!known.includes(k)) err(`${w}: 모르는 칸 「${k}」 — 쓸 수 있는 칸: ${known.join(' ')}`);
    }
    const cards = D.cards(d.id); const by = {}; for (const c of cards) by[c.tpl] = (by[c.tpl] || 0) + 1;
    console.log(d.notes.length ? `✓ ${d.id}: 노트 ${d.notes.length} · 카드 ${cards.length} (${Object.entries(by).map(([t, n]) => `${D.TPL[t]} ${n}`).join(' · ')})${d.sample ? ' · 표본' : ''}` : `· ${d.id}: 준비 중(노트 0)`);
  }

  // ⑤ 기초 덱과 차례표
  { const b = buildBaseOrder(); const tsv = path.join(ROOT, 'vocab/sources/base-order.tsv');
    if (!fs.existsSync(tsv) || fs.readFileSync(tsv, 'utf8') !== b.text) err('vocab/sources/base-order.tsv 가 원문 목록과 달라요 — node tools/vocab_base_order.mjs 로 다시 만들어요(손으로 고치지 않아요)');
    if (!fs.existsSync(path.join(ROOT, 'vocab/sources/README.md'))) err('vocab/sources/README.md(출처와 라이선스 표기)가 없어요');
    const base = D.byId.base; const byNo = new Map(b.rows.map(r => [r.no, r]));
    if (base && base.notes.length) {
      if (!/CC BY-SA 4\.0/.test(base.credit || '') || !/New General Service List/.test(base.credit || '')) err('덱 base: credit 에 목록 이름(New General Service List)과 라이선스(CC BY-SA 4.0)를 적어요 — 공개 목록의 조건이에요');
      for (const n of base.notes) { const w = `base/${n.id}`; if (n.rank == null) { err(`${w}: 기초 덱의 노트에는 rank(차례표의 no)가 있어야 해요`); continue; } const r = byNo.get(n.rank); if (!r) err(`${w}: rank ${n.rank} 가 차례표에 없어요`); else if (r.id !== n.id || r.word !== n.w) err(`${w}: 차례표 ${n.rank}번은 id 「${r.id}」 · 단어 「${r.word}」 예요 — 노트의 id · w · rank 를 차례표 그대로 써요`); }
      if (!base.sample && base.notes.length !== b.rows.length) err(`덱 base: 노트 ${base.notes.length}개 ≠ 차례표 ${b.rows.length}개 — 다 채우지 않았으면 sample 표시를 남겨 둬요`);
    }
    console.log(`차례표: NGSL ${b.stats.ngsl}개 + NGSL-S 에만 있는 ${b.stats.spokenOnly}개 = ${b.stats.total}개 (둘 다에 있는 단어 ${b.stats.both}개)`); }

  // ③ 허브 설정
  const cx = { window: {} }; vm.createContext(cx); vm.runInContext(read('core/config.js').replace(/^(const|let) /gm, 'var '), cx);
  const cat = (cx.CONFIG.CATEGORIES || [])[0]; const vc = (cx.CONFIG.COURSES || []).find(c => c.id === 'vocab');
  if (!cat || cat.id !== 'liberal' || JSON.stringify(cat.courses) !== '["vocab"]') err('core/config.js: 허브의 맨 앞 묶음은 「필수교양」(id liberal, courses [vocab])이어야 해요 — 사용자 결정 D27');
  if (!vc || !vc.deck || vc.book || !vc.ready || vc.path !== 'vocab/') err('core/config.js: COURSES 의 vocab 은 deck:true · ready:true · path:"vocab/" 이고 book 이 아니어야 해요');

  // ④ 지시서의 덱별 노트 수 표
  const spec = read('specs/vocab.md'); const rows = Object.fromEntries([...spec.matchAll(/^\| `([a-z0-9-]+)` \|[^|\n]*\| (\d+) \|/gm)].map(m => [m[1], +m[2]]));
  for (const id of Object.keys(counts)) { if (!(id in rows)) err(`specs/vocab.md: 덱 표에 \`${id}\` 줄이 없어요(모양: | \`${id}\` | 이름 | 노트 수 | …)`); else if (rows[id] !== counts[id]) err(`specs/vocab.md: 덱 표의 \`${id}\` 노트 수 ${rows[id]} ≠ 실제 ${counts[id]} — 덱을 채우면 표도 같이 고쳐요`); }
  for (const id of Object.keys(rows)) if (!(id in counts)) err(`specs/vocab.md: 덱 표에 없는 덱 \`${id}\` 가 있어요`);
  console.log(`덱 ${D.list.length}개 · 노트 ${Object.values(counts).reduce((a, b) => a + b, 0)}개`);
} catch (e) { err('검사하다 멈췄어요: ' + (e && e.stack || e)); }
if (errors.length) { console.error(`✗ check_vocab 에러 ${errors.length}개`); errors.slice(0, 60).forEach(e => console.error('  ' + e)); if (errors.length > 60) console.error(`  … 외 ${errors.length - 60}개`); process.exit(1); }
console.log('✓ check_vocab OK');
